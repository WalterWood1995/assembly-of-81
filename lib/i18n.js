'use strict';
// Server-side i18n: one language per response. Files live in data/i18n/<code>.ui.json and <code>.content.json
// (optionally split as .content.part1.json / .part2.json). Anything missing falls back to English.
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '..', 'data', 'i18n');

const LANGS = [
  { code: 'en', tag: 'en', label: 'English' },
  { code: 'zh', tag: 'zh-CN', label: '中文' },
  { code: 'ja', tag: 'ja', label: '日本語' },
  { code: 'el', tag: 'el', label: 'Ελληνικά' },
  { code: 'de', tag: 'de', label: 'Deutsch' },
  { code: 'fr', tag: 'fr', label: 'Français' },
  { code: 'it', tag: 'it', label: 'Italiano' },
  { code: 'ru', tag: 'ru', label: 'Русский' },
  { code: 'ar', tag: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'hrv', tag: 'hr', label: 'Hrvatski' },
];
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (e) { return null; } };

const enUi = readJson('en.ui.json') || {};
const cache = {};
function load(code) {
  if (cache[code]) return cache[code];
  const meta = LANGS.find((l) => l.code === code) || LANGS[0];
  const ui = Object.assign({}, enUi, code === 'en' ? {} : readJson(`${code}.ui.json`) || {});
  const content = { houses: {}, robots: {} };
  if (code !== 'en') for (const f of [`${code}.content.json`, `${code}.content.part1.json`, `${code}.content.part2.json`]) {
    const j = readJson(f); if (!j) continue;
    Object.assign(content.houses, j.houses || {}); Object.assign(content.robots, j.robots || {});
  }
  const pickField = (tr, base, field) => {
    if (tr && typeof tr[field] === 'string' && tr[field].trim()) return tr[field];
    const v = base[field];
    if (v && typeof v === 'object') return v[code] || v.en;
    return v || '';
  };
  const L = {
    code: meta.code, tag: meta.tag, dir: meta.dir || 'ltr', label: meta.label,
    complete: code === 'en' || Object.keys(content.robots).length >= 81,
    t: (k) => (k in ui ? ui[k] : k),
    robot: (r, field) => pickField(content.robots[r.slug], r, field),
    house: (h, field) => pickField(content.houses[h.id], h, field),
  };
  cache[code] = L; return L;
}
const available = () => LANGS.filter((l) => l.code === 'en' || fs.existsSync(path.join(DIR, `${l.code}.ui.json`)));

function pick(req, url) {
  const ok = (c) => available().some((l) => l.code === c);
  const norm = (c) => { c = String(c || '').toLowerCase(); if (c === 'hr') return 'hrv'; return c.split('-')[0]; };
  const q = norm(url.searchParams.get('lang')); if (q && ok(q)) return { code: q, explicit: true };
  const m = /(?:^|;\s*)agon_lang=([a-z]+)/.exec(String(req.headers.cookie || '')); if (m && ok(m[1])) return { code: m[1] };
  for (const part of String(req.headers['accept-language'] || '').split(',')) { const c = norm(part.split(';')[0].trim()); if (c && ok(c)) return { code: c }; }
  return { code: 'en' };
}
module.exports = { LANGS, load, pick, available };
