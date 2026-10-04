'use strict';
// Minimal PayPal client (no SDK): Orders v2 redirect flow for a one-time membership payment.
// The buyer approves on paypal.com; this server then captures the order. No card data ever reaches this server.
const https = require('https');

const ID = (process.env.PAYPAL_CLIENT_ID || '').trim();
const SECRET = (process.env.PAYPAL_CLIENT_SECRET || '').trim();
const LIVE = (process.env.PAYPAL_ENV || 'sandbox').trim().toLowerCase() === 'live'; // sandbox unless explicitly live
const WEBHOOK_ID = (process.env.PAYPAL_WEBHOOK_ID || '').trim();
const HOST = LIVE ? 'api-m.paypal.com' : 'api-m.sandbox.paypal.com';
const AMOUNT = parseInt(process.env.AGON_PRICE_AMOUNT || '0', 10); // smallest unit, e.g. 4900 = 49.00
const CURRENCY = (process.env.AGON_PRICE_CURRENCY || 'eur').trim().toUpperCase();
const ZERO_DECIMAL = ['JPY', 'HUF', 'TWD'];

const enabled = () => ID.length > 20 && SECRET.length > 20 && AMOUNT > 0 && /^[A-Z]{3}$/.test(CURRENCY);
const testMode = () => !LIVE;
const value = () => (ZERO_DECIMAL.includes(CURRENCY) ? String(AMOUNT) : (AMOUNT / 100).toFixed(2));
function priceLabel(tag) {
  try { return new Intl.NumberFormat(tag || 'en', { style: 'currency', currency: CURRENCY }).format(Number(value())); } catch (e) { return `${value()} ${CURRENCY}`; }
}

function request(method, path, { headers, body }) {
  return new Promise((resolve, reject) => {
    const req = https.request({ method, hostname: HOST, path, timeout: 20000, headers: Object.assign({}, headers, body ? { 'content-length': Buffer.byteLength(body) } : {}) }, (res) => {
      let s = ''; res.setEncoding('utf8'); res.on('data', (c) => { s += c; });
      res.on('end', () => { let j = {}; try { j = s ? JSON.parse(s) : {}; } catch (e) { return reject(new Error('paypal: bad response')); } resolve({ status: res.statusCode, json: j }); });
    });
    req.on('timeout', () => req.destroy(new Error('paypal: timeout')));
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}
let tok = null;
async function token() {
  if (tok && tok.exp > Date.now() + 60e3) return tok.value;
  const r = await request('POST', '/v1/oauth2/token', { headers: { authorization: 'Basic ' + Buffer.from(`${ID}:${SECRET}`).toString('base64'), 'content-type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
  if (r.status !== 200 || !r.json.access_token) throw new Error('paypal: auth failed (' + r.status + ')');
  tok = { value: r.json.access_token, exp: Date.now() + (r.json.expires_in || 300) * 1000 };
  return tok.value;
}
async function api(method, path, payload) {
  const r = await request(method, path, { headers: { authorization: 'Bearer ' + (await token()), 'content-type': 'application/json' }, body: payload ? JSON.stringify(payload) : (method === 'POST' ? '{}' : '') });
  return r;
}

async function createOrder({ base, locale }) {
  const r = await api('POST', '/v2/checkout/orders', {
    intent: 'CAPTURE',
    purchase_units: [{ custom_id: 'agon_membership', description: 'AGON Robotpedia — membership (one-time)', amount: { currency_code: CURRENCY, value: value() } }],
    payment_source: { paypal: { experience_context: { brand_name: 'AGON Robotpedia', shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW', locale: locale || undefined,
      return_url: `${base}/human/join/done`, cancel_url: `${base}/human/join` } } },
  });
  const link = (r.json.links || []).find((l) => l.rel === 'payer-action' || l.rel === 'approve');
  if (r.status >= 300 || !link) throw new Error('paypal: create order failed (' + r.status + ') ' + (r.json.message || ''));
  return { id: r.json.id, url: link.href };
}

// Returns the paid order in a uniform shape, capturing it first when the buyer has approved but funds are not yet taken.
async function settle(orderId) {
  let r = await api('GET', '/v2/checkout/orders/' + encodeURIComponent(orderId));
  if (r.status !== 200) return null;
  if (r.json.status === 'APPROVED') {
    const c = await api('POST', `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`);
    r = c.status < 300 ? c : await api('GET', '/v2/checkout/orders/' + encodeURIComponent(orderId));
  }
  const o = r.json; const pu = (o.purchase_units || [])[0] || {};
  const cap = ((pu.payments || {}).captures || [])[0];
  if (o.status !== 'COMPLETED' || !cap || cap.status !== 'COMPLETED') return null;
  if ((cap.custom_id || pu.custom_id) !== 'agon_membership') return null;
  if (cap.amount.currency_code !== CURRENCY || Number(cap.amount.value) < Number(value())) return null; // never accept a smaller payment
  return { id: o.id, capture_id: cap.id, email: (o.payer && o.payer.email_address) || '', amount: `${cap.amount.value} ${cap.amount.currency_code}` };
}

// Webhooks are verified by asking PayPal (verify-webhook-signature); needs PAYPAL_WEBHOOK_ID.
async function verifyWebhook(raw, headers) {
  if (!WEBHOOK_ID) return null;
  let event; try { event = JSON.parse(raw); } catch (e) { return null; }
  const r = await api('POST', '/v1/notifications/verify-webhook-signature', {
    auth_algo: headers['paypal-auth-algo'], cert_url: headers['paypal-cert-url'], transmission_id: headers['paypal-transmission-id'],
    transmission_sig: headers['paypal-transmission-sig'], transmission_time: headers['paypal-transmission-time'], webhook_id: WEBHOOK_ID, webhook_event: event,
  });
  return r.status === 200 && r.json.verification_status === 'SUCCESS' ? event : null;
}

module.exports = { enabled, testMode, priceLabel, createOrder, settle, verifyWebhook };
