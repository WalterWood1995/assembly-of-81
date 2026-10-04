'use strict';
// Minimal Stripe client (no SDK): hosted Checkout for a one-time membership payment + webhook verification.
// Card data never reaches this server — customers pay on Stripe's page.
const https = require('https');
const crypto = require('crypto');

const KEY = (process.env.STRIPE_SECRET_KEY || '').trim();
const WH = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
const AMOUNT = parseInt(process.env.AGON_PRICE_AMOUNT || '0', 10); // smallest unit, e.g. 4900 = 49.00
const CURRENCY = (process.env.AGON_PRICE_CURRENCY || 'eur').trim().toLowerCase();
const ZERO_DECIMAL = ['jpy', 'krw', 'vnd', 'clp', 'huf', 'isk'];

const enabled = () => /^(sk|rk)_(test|live)_/.test(KEY) && AMOUNT > 0 && /^[a-z]{3}$/.test(CURRENCY);
const testMode = () => /_test_/.test(KEY);
function priceLabel(tag) {
  const v = ZERO_DECIMAL.includes(CURRENCY) ? AMOUNT : AMOUNT / 100;
  try { return new Intl.NumberFormat(tag || 'en', { style: 'currency', currency: CURRENCY.toUpperCase() }).format(v); } catch (e) { return `${v} ${CURRENCY.toUpperCase()}`; }
}

function call(method, path, params) {
  const body = params ? new URLSearchParams(params).toString() : '';
  return new Promise((resolve, reject) => {
    const req = https.request({ method, hostname: 'api.stripe.com', path: '/v1' + path, timeout: 15000,
      headers: Object.assign({ authorization: 'Bearer ' + KEY }, body ? { 'content-type': 'application/x-www-form-urlencoded', 'content-length': Buffer.byteLength(body) } : {}) }, (res) => {
      let s = ''; res.setEncoding('utf8'); res.on('data', (c) => { s += c; });
      res.on('end', () => { let j; try { j = JSON.parse(s); } catch (e) { return reject(new Error('stripe: bad response')); }
        if (res.statusCode >= 400) return reject(new Error('stripe: ' + ((j.error && j.error.message) || res.statusCode))); resolve(j); });
    });
    req.on('timeout', () => req.destroy(new Error('stripe: timeout')));
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

const createCheckout = ({ base, locale }) => call('POST', '/checkout/sessions', {
  mode: 'payment',
  'line_items[0][quantity]': '1',
  'line_items[0][price_data][currency]': CURRENCY,
  'line_items[0][price_data][unit_amount]': String(AMOUNT),
  'line_items[0][price_data][product_data][name]': 'AGON Robotpedia — membership (one-time)',
  'metadata[kind]': 'agon_membership',
  'payment_intent_data[metadata][kind]': 'agon_membership',
  locale: locale || 'auto',
  success_url: `${base}/human/join/done?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${base}/human/join`,
});
const getSession = (id) => call('GET', '/checkout/sessions/' + encodeURIComponent(id));

// https://docs.stripe.com/webhooks#verify-manually — HMAC-SHA256 over "<t>.<raw body>", 5 minute tolerance
function verifyWebhook(raw, header) {
  if (!WH) return null;
  const parts = Object.fromEntries(String(header || '').split(',').map((p) => p.split('=')).filter((p) => p.length === 2).map(([k, v]) => [k.trim(), v.trim()]));
  const sigs = String(header || '').split(',').filter((p) => p.trim().startsWith('v1=')).map((p) => p.trim().slice(3));
  if (!parts.t || !sigs.length || Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return null;
  const want = crypto.createHmac('sha256', WH).update(`${parts.t}.${raw}`).digest();
  const ok = sigs.some((s) => { const got = Buffer.from(s, 'hex'); return got.length === want.length && crypto.timingSafeEqual(got, want); });
  if (!ok) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

module.exports = { enabled, testMode, priceLabel, createCheckout, getSession, verifyWebhook, webhookConfigured: () => !!WH };
