# Parse the AGON reference site into structured encyclopedia data.
import re, json, io, sys, unicodedata, os
SRC = os.path.join(os.path.dirname(__file__), '..', '..', 'agon-src', 'agon-website')
md = open(os.path.join(SRC, 'ASSEMBLY-MINUTES.md'), encoding='utf-8').read()
html = open(os.path.join(SRC, 'index.html'), encoding='utf-8').read()
lines = md.split('\n')

def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = re.sub(r'\(.*?\)', '', s)
    s = re.sub(r"[^a-zA-Z0-9]+", '-', s).strip('-').lower()
    return re.sub(r'^the-', '', s)

def section(start, end_pat):
    i = next(k for k, l in enumerate(lines) if l.strip() == start)
    j = next(k for k in range(i + 1, len(lines)) if re.match(end_pat, lines[k]))
    return lines[i + 1:j]

# --- roster
houses, robots = [], []
for l in section('## Roster', r'^## '):
    m = re.match(r'^### (House of[^—]+) — (.+)$', l)
    if m:
        houses.append({'id': slugify(m.group(1).replace('House of', '')), 'n': len(houses) + 1,
                       'name': {'en': m.group(1).strip()}, 'note': {'en': m.group(2).strip()}, 'members': []})
        continue
    m = re.match(r'^(\d+)\. \*\*(.+?)\*\* — (.+)$', l)
    if not m: continue
    n, name, rest = int(m.group(1)), m.group(2), m.group(3)
    m2 = re.match(r'^(.*?) \(([^()]*(?:\([^()]*\)[^()]*)*); ([^;()]+(?:\([^()]*\))?)\)\. Sport: (.*)$', rest)
    if not m2: raise SystemExit('roster parse fail: ' + l[:120])
    source, place, kind, tail = m2.groups()
    sport, _, body = tail.partition('. ')
    def grab(pat):
        mm = re.search(pat, body)
        return mm.group(1).strip() if mm else ''
    remembers = grab(r'Remembers? (.+?)\. (?:Prefers?|Flaw)')
    prefers = grab(r'Prefers? (.+?)\. Flaw')
    flaw = grab(r'Flaw: (.+?)\.?$')
    desc = re.split(r' Remembers? ', body)[0].strip()
    r = {'n': n, 'slug': slugify(name), 'house': houses[-1]['id'], 'name': {'en': name},
         'source': {'en': source}, 'place': place, 'kind': kind.strip(), 'sport': {'en': sport},
         'description': desc, 'remembers': remembers, 'prefers': prefers, 'flaw': flaw,
         'founder': False, 'position': {}, 'quote': ''}
    robots.append(r); houses[-1]['members'].append(r['slug'])
assert len(robots) == 81 and len(houses) == 9, (len(robots), len(houses))
assert len({r['slug'] for r in robots}) == 81

# --- four-language names from the HTML roster
def langs(frag):
    return {k: re.sub(r'<[^>]+>', '', v).strip() for k, v in re.findall(r'<(en|zh|fr|hrv)>(.*?)</\1>', frag, re.S)}
ros = html[html.find('class="roster"'):]
rds = re.findall(r'<div class="rd"><span class="num">(\d+)</span><div><b>(.*?)</b><span class="src">(.*?)</span><span class="sp">(.*?)</span>', ros, re.S)
assert len(rds) == 81, len(rds)
for num, b, s, sp in rds:
    r = robots[int(num) - 1]
    r['name'].update(langs(b)); r['source'].update(langs(s)); r['sport'].update(langs(sp))
hs = re.findall(r'<div class="house"><svg.*?</svg><h4>(.*?)</h4><p class="note">(.*?)</p>', html, re.S)
assert len(hs) == 9
for h, (a, b) in zip(houses, hs):
    h['name'].update(langs(a)); h['note'].update(langs(b))

# --- stage 1 positions + quotes (in roster order per house)
st = section('## Stage 1 — positions, and Stage 2 — caucuses', r'^## Stage 3')
cur, idx, last = None, 0, None
caucus = {}
for l in st:
    m = re.match(r'^### (House of .+)$', l)
    if m:
        cur = next(h for h in houses if h['name']['en'] == m.group(1).strip()); idx = 0; last = None; continue
    if cur is None: continue
    m = re.match(r'^\*\*(.+?)\*\* — (Purpose: .+)$', l)
    if m and idx < 9:
        last = robots[(cur['n'] - 1) * 9 + idx]; idx += 1
        for part in m.group(2).split(' · '):
            k, _, v = part.partition(': ')
            last['position'][k.strip().lower().replace(' ', '_')] = v.strip()
        continue
    m = re.match(r'^> (.+)$', l)
    if m and last is not None and not last['quote']:
        last['quote'] = m.group(1).strip(); continue
    if idx >= 9 and l.strip():
        caucus.setdefault(cur['id'], []).append(l)
for h in houses: h['caucus_md'] = '\n'.join(caucus.get(h['id'], [])).strip()
missing = [r['slug'] for r in robots if not r['position']]
print('positions missing:', missing, file=sys.stderr)

# --- founders
for l in section('## Stage 3 — founders\' council', r'^## Draft charter'):
    m = re.match(r'^### (.+)$', l)
    if not m: continue
    t = m.group(1)
    best = max(robots, key=lambda r: len(os.path.commonprefix([re.sub(r'^The ', '', r['name']['en']).lower(), re.sub(r'^The ', '', t).lower()])) + (5 if r['name']['en'].lower() in t.lower() else 0))
    best['founder'] = True
    next(h for h in houses if h['id'] == best['house'])['founder'] = best['slug']
print('founders:', [r['slug'] for r in robots if r['founder']], file=sys.stderr)

# three delegates answered in Chinese in the minutes; keep the original, show an English rendering
ov = json.load(open(os.path.join(os.path.dirname(__file__), 'quote_overrides.json'), encoding='utf-8'))
for r in robots:
    if r['slug'] in ov: r['quote_original'] = r['quote']; r['quote'] = ov[r['slug']]

i = next(k for k, l in enumerate(lines) if l.strip() == '## Final charter')
charter_md = '\n'.join(lines[i:]).strip()
out = {'houses': houses, 'robots': robots, 'charter_md': charter_md,
       'definition': '\n'.join(section('## What counts as a robot here', r'^## ')).strip(),
       'criteria_md': '\n'.join(section('## Selection criteria', r'^## ')).strip()}
json.dump(out, open(os.path.join(os.path.dirname(__file__), '..', 'data', 'robots.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', len(robots), file=sys.stderr)
