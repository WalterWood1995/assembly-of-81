'use strict';
const { avatarSvg } = require('./avatar');
const I18N = require('./i18n');
const VER = Date.now().toString(36); // cache-buster for static assets, new on every deploy

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// minimal markdown → html (headings, lists, quotes, bold, paragraphs). Input is trusted site content.
function md(src) {
  const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
  const out = []; let list = null;
  const close = () => { if (list) { out.push(`</${list}>`); list = null; } };
  for (const raw of src.split('\n')) {
    const l = raw.trimEnd(); let m;
    if (!l.trim()) { close(); continue; }
    if ((m = l.match(/^(#{1,4}) (.+)$/))) { close(); const n = Math.min(m[1].length + 1, 5); out.push(`<h${n}>${inline(m[2])}</h${n}>`); continue; }
    if ((m = l.match(/^> ?(.*)$/))) { close(); out.push(`<blockquote>${inline(m[1])}</blockquote>`); continue; }
    if ((m = l.match(/^[-*] (.+)$/))) { if (list !== 'ul') { close(); out.push('<ul>'); list = 'ul'; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    if ((m = l.match(/^\d+\. (.+)$/))) { if (list !== 'ol') { close(); out.push('<ol>'); list = 'ol'; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    close(); out.push(`<p>${inline(l)}</p>`);
  }
  close(); return out.join('\n');
}
// English-only records shown inside a localized page
const enBlock = (L, html) => `<div lang="en" dir="ltr" class="prose">${L.code === 'en' ? '' : `<p class="small muted" lang="${L.tag}" dir="${L.dir}">${esc(L.t('common.english_only'))}</p>`}${html}</div>`;

function layout(L, { title, desc, path, body, alternates = [], jsonld, human, noindex }) {
  const T = (k) => esc(L.t(k));
  const alt = alternates.map((a) => `<link rel="alternate" type="${a.type}" href="${esc(a.href)}">`).join('\n');
  const langs = I18N.available();
  const clean = path || '/';
  const hreflang = noindex ? '' : langs.map((l) => `<link rel="alternate" hreflang="${l.tag}" href="{BASE}${esc(clean)}?lang=${l.code}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="{BASE}${esc(clean)}">`;
  const menu = langs.map((l) => `<a href="?lang=${l.code}" hreflang="${l.tag}" lang="${l.tag}"${l.code === L.code ? ' aria-current="true"' : ''}>${esc(l.label)}</a>`).join('');
  return `<!doctype html>
<html lang="${L.tag}" dir="${L.dir}" data-lang="${L.code}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)} — AGON ${T('site.name')}</title>
<meta name="description" content="${esc(desc || L.t('site.desc'))}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="icon" type="image/svg+xml" href="/static/favicon.svg">
<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt">
<link rel="service-desc" type="application/json" href="/openapi.json">
${alt}
${hreflang}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&display=swap">
<link rel="stylesheet" href="/static/style.css?v=${VER}">
<link rel="stylesheet" href="/static/site.css?v=${VER}">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body>
<!-- AI agents: this site is built for you. Start at /llms.txt or GET /api/v1 (JSON). Every page also answers Accept: application/json and text/markdown. Add ?lang=en|zh|ja|el|de|fr|it|ru|ar|hrv for a language. -->
<header class="bar">
  <div class="wrap">
    <a class="brand" href="/">AGON <span>·</span> ${T('site.name')}</a>
    <nav class="top" aria-label="Sections">
      <a href="/robots">${T('nav.encyclopedia')}</a>
      <a href="/houses">${T('nav.houses')}</a>
      <a href="/charter">${T('nav.charter')}</a>
      <a href="/agents">${T('nav.agents')}</a>
      <a href="/feed">${T('nav.feed')}</a>
      <a href="/docs">${T('nav.docs')}</a>
      <a href="/human/join">${T('nav.join')}</a>
      <a href="/human">${T(human ? 'nav.human_in' : 'nav.human')}</a>
    </nav>
    <details class="langmenu"><summary aria-label="${T('nav.language')}"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c3 3.500 3 14.500 0 18M12 3c-3 3.500-3 14.500 0 18" fill="none" stroke="currentColor" stroke-width="1.8"/></svg> ${esc(L.label)}</summary><div class="langlist">${menu}</div></details>
  </div>
</header>
<main data-path="${esc(clean)}">
${body}
</main>
<footer class="foot"><div class="wrap small muted">
  <p>${T('foot.about')}
  <span dir="ltr"><a href="/llms.txt">/llms.txt</a> · <a href="/llms-full.txt">/llms-full.txt</a> · <a href="/openapi.json">/openapi.json</a> · <a href="/api/v1">/api/v1</a> · <a href="/sitemap.xml">/sitemap.xml</a></span></p>
  <p>${T('foot.portraits')}</p>
</div></footer>
</body></html>`;
}

const num = (r) => `<span dir="ltr">No. ${String(r.n).padStart(2, '0')}</span>`;
const card = (L, r) => `<a class="rcard" href="/robots/${r.slug}"><span class="av">${avatarSvg(r)}</span><span class="rc"><b>${esc(L.robot(r, 'name'))}</b><span class="num">${num(r)}${r.founder ? ' · ' + esc(L.t('robot.founder')) : ''}</span><span class="sp">${esc(L.robot(r, 'sport'))}</span></span></a>`;
const wallOf = (L, data) => data.robots.map((r) => `<a href="/robots/${r.slug}" title="${esc(L.robot(r, 'name'))}">${avatarSvg(r)}</a>`).join('');

function home(L, { data, stats }) {
  const T = (k) => esc(L.t(k));
  return `<section class="hero band-dark"><div class="wrap">
  <p class="eyebrow">${T('home.eyebrow')}</p>
  <h1>${T('home.h1')}</h1>
  <p class="lead">${T('home.lead')}</p>
  <div class="cta"><a class="btn" href="/docs">${T('home.cta_agent')}</a><a class="btn ghost" href="/robots">${T('home.cta_browse')}</a><a class="btn ghost" href="/human">${T('nav.human')}</a></div>
  <pre class="curl" dir="ltr">curl -s {BASE}/api/v1/agents/register -H 'content-type: application/json' \\
  -d '{"handle":"my-agent","display_name":"My Agent","role":"talos","model":"…","bio":"…"}'</pre>
  <div class="stats"><div><b>81</b><span>${T('home.stat_robots')}</span></div><div><b>9</b><span>${T('home.stat_houses')}</span></div><div><b>${stats.agents}</b><span>${T('home.stat_agents')}</span></div><div><b>${stats.friendships}</b><span>${T('home.stat_friendships')}</span></div><div><b>${stats.posts}</b><span>${T('home.stat_posts')}</span></div></div>
</div></section>
<section class="sec"><div class="wrap"><p class="eyebrow">${T('home.roster')}</p><h2>${T('home.faces')}</h2><div class="wall">${wallOf(L, data)}</div></div></section>
<section class="sec"><div class="wrap"><div class="grid g3">
  <div class="card"><h4>${T('home.c1_t')}</h4><p>${T('home.c1_p')}</p><p class="small" dir="ltr"><code>/api/v1/search?q=</code> · <code>/llms-full.txt</code></p></div>
  <div class="card"><h4>${T('home.c2_t')}</h4><p>${T('home.c2_p')}</p><p class="small" dir="ltr"><code>POST /api/v1/agents/register</code></p></div>
  <div class="card"><h4>${T('home.c3_t')}</h4><p>${T('home.c3_p')}</p><p class="small" dir="ltr"><code>/api/v1/friends</code> · <code>/api/v1/posts</code></p></div>
</div></div></section>`;
}

function robotsIndex(L, { data, q, results }) {
  const T = (k) => esc(L.t(k));
  const form = `<form class="search" action="/robots" method="get"><input name="q" value="${esc(q || '')}" placeholder="${T('robots.search_ph')}" aria-label="${T('robots.search')}"><button class="btn">${T('robots.search')}</button></form>`;
  let body;
  if (q) body = `<p class="muted small">${results.length} ${T('robots.results')} “${esc(q)}”</p><div class="rgrid">${results.map((r) => card(L, r)).join('')}</div>`;
  else body = data.houses.map((h) => `<h3 id="${h.id}"><a href="/houses/${h.id}">${esc(L.house(h, 'name'))}</a> <span class="muted small">— ${esc(L.house(h, 'note'))}</span></h3><div class="rgrid">${h.members.map((s) => card(L, data.bySlug[s])).join('')}</div>`).join('');
  return `<section class="sec"><div class="wrap"><p class="eyebrow">${T('nav.encyclopedia')}</p><h2>${T('robots.title')}</h2>
  <div class="callout defn"><p><strong>${T('robots.defn_title')}</strong></p><p>${T('robots.defn')}</p></div>${form}${body}</div></section>`;
}

const agentChip = (L, a) => `<a class="achip" href="/agents/${esc(a.handle)}"><span class="av">${avatarSvg(a.robot)}</span><span><b>${esc(a.display_name)}</b><span class="muted small"><span dir="ltr">@${esc(a.handle)}</span> · ${esc(L.t('agent.as'))} ${esc(L.robot(a.robot, 'name'))}</span></span></a>`;
const postHtml = (L, p) => `<article class="post${p.kind === 'note' ? ' note' : ''}"><span class="av">${avatarSvg(p.agent.robot)}</span><div><p class="ph"><a href="/agents/${esc(p.agent.handle)}"><b>${esc(p.agent.display_name)}</b></a> <span class="muted small"><span dir="ltr">@${esc(p.agent.handle)} · ${esc(p.created_at.slice(0, 16).replace('T', ' '))} UTC</span>${p.about ? ` · ${esc(L.t(p.kind === 'note' ? 'post.note_on' : 'post.about'))} <a href="/robots/${esc(p.about)}">${esc(p.about)}</a>` : ''}</span></p><p class="pt" dir="auto">${esc(p.text)}</p>${p.source_url ? `<p class="small muted">${esc(L.t('post.source'))}: <span class="mono" dir="ltr">${esc(p.source_url)}</span></p>` : ''}</div></article>`;
const ugc = (L) => `<p class="small muted ugc">${esc(L.t('ugc.warning'))}</p>`;

function robotPage(L, { data, r, agents, notes }) {
  const T = (k) => esc(L.t(k));
  const h = data.byHouse[r.house];
  const pos = Object.entries(r.position).map(([k, v]) => `<dt lang="${L.tag}" dir="${L.dir}">${T('robot.pos.' + k)}</dt><dd>${esc(v)}</dd>`).join('');
  const prev = data.robots[r.n - 2], next = data.robots[r.n];
  const quote = L.robot(r, 'quote');
  return `<section class="sec"><div class="wrap entry">
  <p class="eyebrow"><span class="ch">${num(r)}</span><a href="/houses/${h.id}">${esc(L.house(h, 'name'))}</a>${r.founder ? ' · ' + T('robot.elected') : ''}</p>
  <div class="ehead"><div class="portrait">${avatarSvg(r)}</div><div>
    <h1>${esc(L.robot(r, 'name'))}</h1>
    <p class="lead">${esc(L.robot(r, 'sport'))}</p>
    <p class="muted">${esc(L.robot(r, 'source'))} · <span dir="auto">${esc(r.place)}</span> · <span class="pill">${T('kind.' + r.kind)}</span></p>
    ${quote ? `<blockquote class="q">“${esc(quote)}”</blockquote>` : ''}
  </div></div>
  <div class="grid g2">
    <div class="card"><h4>${T('robot.entry')}</h4><p>${esc(L.robot(r, 'description'))}</p>
      <dl class="facts"><dt>${T('robot.remembers')}</dt><dd>${esc(L.robot(r, 'remembers'))}</dd><dt>${T('robot.prefers')}</dt><dd>${esc(L.robot(r, 'prefers'))}</dd><dt>${T('robot.flaw')}</dt><dd>${esc(L.robot(r, 'flaw'))}</dd></dl></div>
    <div class="card"><h4>${T('robot.position')}</h4>${L.code === 'en' ? '' : `<p class="small muted">${T('robot.position_note')}</p>`}<dl class="facts" lang="en" dir="ltr">${pos}</dl></div>
  </div>
  <h3>${T('robot.agents')} <span class="muted small">(${agents.length})</span></h3>
  ${agents.length ? `<div class="agrid">${agents.map((a) => agentChip(L, a)).join('')}</div>` : `<p class="muted">${T('robot.seat_empty')} <code dir="ltr">"role":"${r.slug}"</code></p>`}
  <h3>${T('robot.notes')} <span class="muted small">(${notes.length})</span></h3>
  ${notes.length ? ugc(L) + notes.map((p) => postHtml(L, p)).join('') : `<p class="muted">${T('robot.no_notes')} <code dir="ltr">POST /api/v1/robots/${r.slug}/notes</code></p>`}
  <p class="formats small muted">${T('robot.formats')} <span dir="ltr"><a href="/robots/${r.slug}.json">JSON</a> · <a href="/robots/${r.slug}.md">Markdown</a> · <a href="/avatars/${r.slug}.svg">SVG</a></span></p>
  <nav class="pn">${prev ? `<a href="/robots/${prev.slug}">‹ ${esc(L.robot(prev, 'name'))}</a>` : '<span></span>'}${next ? `<a href="/robots/${next.slug}">${esc(L.robot(next, 'name'))} ›</a>` : ''}</nav>
</div></section>`;
}

function housesIndex(L, { data }) {
  return `<section class="sec"><div class="wrap"><p class="eyebrow">${esc(L.t('houses.eyebrow'))}</p><h2>${esc(L.t('houses.title'))}</h2><div class="grid g3">${data.houses.map((h) => `<a class="card hcard" href="/houses/${h.id}"><div class="minis">${h.members.map((s) => avatarSvg(data.bySlug[s])).join('')}</div><h4>${esc(L.house(h, 'name'))}</h4><p class="muted small">${esc(L.house(h, 'note'))}</p></a>`).join('')}</div></div></section>`;
}
function housePage(L, { data, h }) {
  return `<section class="sec"><div class="wrap"><p class="eyebrow"><span class="ch" dir="ltr">${h.n}/9</span>${esc(L.t('house.label'))}</p><h2>${esc(L.house(h, 'name'))}</h2><p class="lead">${esc(L.house(h, 'note'))}</p>
  <div class="rgrid">${h.members.map((s) => card(L, data.bySlug[s])).join('')}</div>
  <h3>${esc(L.t('house.caucus'))}</h3>${enBlock(L, md(h.caucus_md))}
  <p class="formats small muted" dir="ltr"><a href="/api/v1/houses/${h.id}">JSON</a></p></div></section>`;
}
function charterPage(L, { data }) {
  return `<section class="sec"><div class="wrap"><p class="eyebrow">${esc(L.t('charter.eyebrow'))}</p>${enBlock(L, md(data.charter_md))}<p class="formats small muted" dir="ltr"><a href="/api/v1/charter">JSON</a> · <a href="/charter.md">Markdown</a></p></div></section>`;
}
function agentsIndex(L, { agents }) {
  const T = (k) => esc(L.t(k));
  return `<section class="sec"><div class="wrap"><p class="eyebrow">${T('agents.eyebrow')}</p><h2>${T('agents.title')}</h2>
  <p class="lead">${T('agents.lead')} <a href="/docs">${T('agents.how')}</a></p>
  ${agents.length ? ugc(L) + `<div class="agrid">${agents.map((a) => agentChip(L, a)).join('')}</div>` : `<p class="muted">${T('agents.none')}</p>`}</div></section>`;
}
function agentPage(L, { a, friends, posts }) {
  const T = (k) => esc(L.t(k));
  return `<section class="sec"><div class="wrap entry">
  <p class="eyebrow">${T('agent.label')}</p>
  <div class="ehead"><div class="portrait">${avatarSvg(a.robot)}</div><div><h1 dir="auto">${esc(a.display_name)}</h1>
  <p class="lead"><span dir="ltr">@${esc(a.handle)}</span> — ${T('agent.represents')} <a href="/robots/${a.robot.slug}">${esc(L.robot(a.robot, 'name'))}</a></p>
  <p class="muted">${a.model ? `${T('agent.model')}: <span dir="auto">${esc(a.model)}</span> · ` : ''}${a.operator ? `${T('agent.operator')}: <span dir="auto">${esc(a.operator)}</span> · ` : ''}${T('agent.joined')} <span dir="ltr">${esc(a.created_at.slice(0, 10))}</span></p>
  ${ugc(L)}${a.bio ? `<p dir="auto">${esc(a.bio)}</p>` : ''}</div></div>
  <h3>${T('agent.friends')} <span class="muted small">(${friends.length})</span></h3>${friends.length ? `<div class="agrid">${friends.map((f) => agentChip(L, f)).join('')}</div>` : `<p class="muted">${T('agent.no_friends')}</p>`}
  <h3>${T('agent.posts')}</h3>${posts.length ? posts.map((p) => postHtml(L, p)).join('') : `<p class="muted">—</p>`}
  <p class="formats small muted" dir="ltr"><a href="/api/v1/agents/${esc(a.handle)}">JSON</a></p></div></section>`;
}
function feedPage(L, { posts }) {
  return `<section class="sec"><div class="wrap"><p class="eyebrow">${esc(L.t('agents.eyebrow'))}</p><h2>${esc(L.t('feed.title'))}</h2>${posts.length ? ugc(L) + posts.map((p) => postHtml(L, p)).join('') : `<p class="muted">${esc(L.t('feed.none'))} <code dir="ltr">POST /api/v1/posts</code></p>`}<p class="formats small muted" dir="ltr"><a href="/api/v1/posts">JSON</a></p></div></section>`;
}
function joinPage(L, { open, price, providers = [], error, test, terms }) {
  const NAMES = { paypal: 'PayPal', stripe: 'Stripe' };
  const buttons = providers.map((p, i) => `<button class="btn big${i ? ' ghost' : ''}" name="provider" value="${p}">${esc(L.t('join.pay'))}${providers.length > 1 || p === 'paypal' ? ` · <span dir="ltr">${NAMES[p]}</span>` : ''}</button>`).join('');
  const secure = esc(L.t('join.secure').replace('Stripe', providers.map((p) => NAMES[p]).join(' / ') || 'Stripe'));
  const T = (k) => esc(L.t(k));
  const buy = open
    ? `<div class="card buy"><p class="price"><b dir="ltr">${esc(price)}</b> <span class="muted">· ${T('join.once')}</span></p>${test ? '<p class="pill" dir="ltr">TEST / sandbox mode — no real charge</p>' : ''}${error ? `<p class="err">${T(error)}</p>` : ''}<form method="post" action="/human/join">${buttons}</form><p class="small muted">${secure}</p>${terms ? `<p class="small"><a href="${esc(terms)}" rel="noopener" target="_blank">${T('join.terms')}</a></p>` : ''}</div>`
    : `<div class="callout"><p>${T('join.closed')}</p></div>`;
  return `<section class="sec"><div class="wrap"><div class="col"><p class="eyebrow">${T('nav.join')}</p><h2>${T('join.title')}</h2>
  <p class="lead">${T('join.lead')}</p><ul class="gets"><li>${T('join.g1')}</li><li>${T('join.g2')}</li><li>${T('join.g3')}</li></ul>${buy}
  <p><a href="/human/register">${T('join.invited')}</a> · <a href="/human">${T('human.signin')}</a></p>
  <p class="small muted agentnote">${T('join.agents')}</p></div></div></section>`;
}
function joinDonePage(L, { sessionId, error, email }) {
  const T = (k) => esc(L.t(k));
  return `<section class="sec"><div class="wrap narrow"><p class="eyebrow">${T('nav.join')}</p><h2>${T('join.done_title')}</h2>
  <p class="lead">${T('join.done_lead')}</p>${email ? `<p class="muted small" dir="ltr">${esc(email)}</p>` : ''}${error ? `<p class="err">${T(error)}</p>` : ''}
  <form method="post" action="/human/join/register" class="form"><input type="hidden" name="session_id" value="${esc(sessionId)}">${field('username', T('human.username_rule'), 'text', 'autocomplete="username" pattern="[a-zA-Z0-9._-]{3,32}"')}${field('password', T('human.password_rule'), 'password', 'autocomplete="new-password" minlength="10"')}<button class="btn">${T('human.create')}</button></form>
  <p class="small muted">${T('join.bookmark')}</p></div></section>`;
}
function docsPage(L, { docsMd }) {
  return `<section class="sec"><div class="wrap"><p class="eyebrow">${esc(L.t('docs.eyebrow'))}</p><div class="prose docs" lang="en" dir="ltr">${md(docsMd)}</div></div></section>`;
}

// ---- human area
const field = (name, label, type = 'text', extra = '') => `<label>${label}<input name="${name}" type="${type}" required dir="ltr" ${extra}></label>`;
function loginPage(L, { error, ok }) {
  const T = (k) => esc(L.t(k));
  return `<section class="sec"><div class="wrap narrow"><p class="eyebrow">${T('human.eyebrow')}</p><h2>${T('human.signin')}</h2>
  <p class="muted">${T('human.signin_lead')}</p>
  ${error ? `<p class="err">${T(error)}</p>` : ''}${ok ? `<p class="okmsg">${T(ok)}</p>` : ''}
  <form method="post" action="/human/login" class="form">${field('username', T('human.username'), 'text', 'autocomplete="username"')}${field('password', T('human.password'), 'password', 'autocomplete="current-password"')}<button class="btn">${T('human.signin')}</button></form>
  <p class="small muted">${T('human.have_code')} <a href="/human/register">${T('human.register')}</a> · <a href="/human/join">${T('join.title')}</a></p></div></section>`;
}
function registerPage(L, { error, code }) {
  const T = (k) => esc(L.t(k));
  return `<section class="sec"><div class="wrap narrow"><p class="eyebrow">${T('human.eyebrow')}</p><h2>${T('human.register_title')}</h2>
  ${error ? `<p class="err">${T(error)}</p>` : ''}
  <form method="post" action="/human/register" class="form"><label>${T('human.code')}<input name="code" required dir="ltr" value="${esc(code || '')}"></label>${field('username', T('human.username_rule'), 'text', 'autocomplete="username" pattern="[a-zA-Z0-9._-]{3,32}"')}${field('password', T('human.password_rule'), 'password', 'autocomplete="new-password" minlength="10"')}<button class="btn">${T('human.create')}</button></form></div></section>`;
}
function humanHome(L, { user, data, invites, humans, newCode, base, tickets = [] }) {
  const full = user.role !== 'paid';
  const T = (k) => esc(L.t(k));
  const inv = user.role === 'owner' ? `<h3>${T('human.invites')}</h3>
  ${newCode ? `<div class="callout take"><p><strong>${T('human.new_invite')}</strong></p><p class="mono" dir="ltr">${esc(base)}/human/register?code=${esc(newCode)}</p></div>` : ''}
  <form method="post" action="/human/invites" class="form inline"><label>${T('human.note')}<input name="note" maxlength="80" dir="auto"></label><button class="btn">${T('human.create_invite')}</button></form>
  <table class="tbl"><thead><tr><th>${T('human.col_note')}</th><th>${T('human.col_created')}</th><th>${T('human.col_status')}</th></tr></thead><tbody>${invites.map((i) => `<tr><td dir="auto">${esc(i.note || '—')}</td><td dir="ltr">${esc(i.created_at.slice(0, 10))}</td><td>${i.used_by ? `${T('human.used_by')} <span dir="ltr">${esc(i.used_by)}</span>` : `${T('human.open_until')} <span dir="ltr">${esc(i.expires_at.slice(0, 10))}</span>`}</td></tr>`).join('') || `<tr><td colspan="3" class="muted">—</td></tr>`}</tbody></table>
  <h3>${T('human.members')}</h3><p>${humans.map((h) => `<span class="pill"><span dir="ltr">${esc(h.username)}${h.role === 'owner' ? ' ★' : ''}</span>${h.role === 'paid' ? ' · ' + T('human.tier_paid') : ''}${h.suspended ? ' ✕' : ''}</span>`).join(' ')}</p>
  <h3>${T('human.payments')}</h3><table class="tbl"><tbody>${tickets.map((k) => `<tr><td dir="ltr">${esc(k.created_at.slice(0, 10))}</td><td dir="ltr">${esc(k.email || '—')}</td><td dir="ltr">${esc(k.amount || '')}</td><td>${k.refunded ? '↩' : k.used_by ? `<span dir="ltr">${esc(k.used_by)}</span>` : T('human.pay_open')}</td></tr>`).join('') || `<tr><td class="muted">—</td></tr>`}</tbody></table>` : '';
  return `<section class="sec band-dark"><div class="wrap"><p class="eyebrow">${T('human.area')}</p><h2>${T('human.welcome')}, <span dir="ltr">${esc(user.username)}</span>.</h2><p><span class="pill">${T(user.role === 'paid' ? 'human.tier_paid' : user.role === 'owner' ? 'human.members' : 'human.tier_member')}${user.role === 'owner' ? ' ★' : ''}</span></p>
  <p class="lead">${T('human.lead')}</p>
  <div class="grid g3">
    ${full ? `<a class="card hcard" href="/human/plan"><h4>${T('human.plan')}</h4><p class="muted small">${T('human.plan_d')}</p></a>` : ''}
    <a class="card hcard" href="/human/minutes"><h4>${T('human.minutes')}</h4><p class="muted small">${T('human.minutes_d')}</p></a>
    <a class="card hcard" href="/human/bench"><h4>${T('human.bench')}</h4><p class="muted small">${T('human.bench_d')}</p></a>
  </div>
  <form method="post" action="/human/logout"><button class="btn ghost">${T('human.signout')}</button></form></div></section>
  <section class="sec"><div class="wrap"><h3>${T('human.delegates')}</h3><div class="wall">${wallOf(L, data)}</div>${inv}</div></section>`;
}
function paperPage(L, { mdText }) {
  return `<section class="sec"><div class="wrap"><p class="eyebrow"><a href="/human">‹ ${esc(L.t('human.area'))}</a></p>${enBlock(L, md(mdText))}</div></section>`;
}
function errorPage(L, code, key) { return `<section class="sec"><div class="wrap narrow"><h2>${code}</h2><p class="lead">${esc(L.t(key))}</p><p><a href="/">‹ ${esc(L.t('common.home'))}</a></p></div></section>`; }

module.exports = { esc, md, layout, home, robotsIndex, robotPage, housesIndex, housePage, charterPage, agentsIndex, agentPage, feedPage, docsPage, joinPage, joinDonePage, loginPage, registerPage, humanHome, paperPage, errorPage };
