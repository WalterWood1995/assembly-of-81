// Validates data/i18n: every language has every UI key, 9 houses, 81 robots × 8 fields, and no untranslated leftovers.
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '..', 'data', 'i18n');
const enUi = JSON.parse(fs.readFileSync(path.join(DIR, 'en.ui.json'), 'utf8'));
const enC = JSON.parse(fs.readFileSync(path.join(DIR, 'en.content.json'), 'utf8'));
const FIELDS = ['name', 'source', 'sport', 'description', 'remembers', 'prefers', 'flaw', 'quote'];
const KEEP = /^(robots\.search_ph|kind\.|agent\.label|site\.name)/; // may legitimately equal English
let bad = 0;
for (const code of ['zh', 'ja', 'el', 'de', 'fr', 'it', 'ru', 'ar', 'hrv']) {
  const out = [];
  let ui, c;
  try { ui = JSON.parse(fs.readFileSync(path.join(DIR, `${code}.ui.json`), 'utf8')); } catch (e) { out.push('ui file missing/invalid'); ui = {}; }
  c = { houses: {}, robots: {} };
  for (const f of [`${code}.content.json`, `${code}.content.part1.json`, `${code}.content.part2.json`]) {
    if (!fs.existsSync(path.join(DIR, f))) continue;
    try { const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); Object.assign(c.houses, j.houses); Object.assign(c.robots, j.robots); } catch (e) { out.push(f + ' invalid JSON'); }
  }
  const missUi = Object.keys(enUi).filter((k) => typeof ui[k] !== 'string' || !ui[k].trim());
  const sameUi = Object.keys(enUi).filter((k) => ui[k] === enUi[k] && !KEEP.test(k) && enUi[k].length > 12);
  const missH = Object.keys(enC.houses).filter((h) => !c.houses[h] || !c.houses[h].name || !c.houses[h].note);
  const missR = []; let same = 0;
  for (const [slug, en] of Object.entries(enC.robots)) for (const f of FIELDS) {
    const v = c.robots[slug] && c.robots[slug][f];
    if (typeof v !== 'string' || !v.trim()) missR.push(`${slug}.${f}`);
    else if (v === en[f] && f !== 'name' && f !== 'source' && en[f].length > 20) same++;
  }
  const extra = Object.keys(c.robots).filter((s) => !enC.robots[s]);
  if (missUi.length) out.push(`ui missing ${missUi.length}: ${missUi.slice(0, 5).join(', ')}`);
  if (sameUi.length) out.push(`ui identical to English ${sameUi.length}: ${sameUi.slice(0, 5).join(', ')}`);
  if (missH.length) out.push(`houses missing: ${missH.join(', ')}`);
  if (missR.length) out.push(`robot fields missing ${missR.length}: ${missR.slice(0, 5).join(', ')}`);
  if (same) out.push(`robot fields identical to English: ${same}`);
  if (extra.length) out.push(`unknown slugs: ${extra.join(', ')}`);
  bad += out.length;
  console.log(`${code}: ${out.length ? out.join(' | ') : 'OK'}  (ui ${Object.keys(ui).length}, robots ${Object.keys(c.robots).length})`);
}
process.exit(bad ? 1 : 0);
