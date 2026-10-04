'use strict';
// Procedural SVG portraits for the 81 delegates. Original drawings: no likeness of any
// copyrighted character is reproduced — archetypes are rendered from the roster's own text.

const MAT = {
  bronze: ['#B9772F', '#7E4C17', '#3A230B'], gold: ['#E2B13C', '#A87A12', '#4A3505'],
  ivory: ['#EFE6D2', '#C9BBA0', '#4B4234'], clay: ['#B08463', '#7C573C', '#38261A'],
  wood: ['#B98A55', '#80592E', '#3B2710'], copper: ['#C9713F', '#8A4520', '#3D1C0B'],
  tin: ['#C5CBD0', '#8C959D', '#2E3439'], steel: ['#9AA5B1', '#5F6B78', '#1F262D'],
  iron: ['#6E7782', '#424A54', '#14181C'], white: ['#F2F3F5', '#C3C8CF', '#2B3037'],
  red: ['#D2493A', '#8E2A20', '#34100C'], blue: ['#4A7FC1', '#2C5388', '#0F2038'],
  green: ['#7FA06B', '#4F6E3F', '#1E2C17'], flesh: ['#D9B59A', '#A97F63', '#3E2A1E'],
  black: ['#3B3F46', '#1E2126', '#0A0B0D'], silver: ['#D5D9DE', '#9AA1AA', '#30353B'],
  yellow: ['#E6C34A', '#A8871B', '#413308'], stone: ['#A9A59B', '#77736A', '#2D2B27'],
};
const HOUSE_BG = {
  myth: '#E9D9B8', craft: '#E3D2C0', page: '#DAD9CC', threshold: '#CFD8DD', arena: '#E5CFC6',
  theory: '#D7D4E3', laboratory: '#CFE0D6', frontier: '#B9C4DA', household: '#E6DCCB',
};

const H = (o) => Object.assign({ t: 'h', mat: 'steel', head: 'round', eyes: 'dot', top: 'none', mouth: 'line' }, o);
const SPEC = {
  'talos': H({ mat: 'bronze', head: 'helm', eyes: 'slit', top: 'crest', mouth: 'none', extra: 'nail' }),
  'golden-handmaidens': H({ mat: 'gold', head: 'oval', eyes: 'closed', top: 'bun', pair: true }),
  'pandora': H({ mat: 'clay', head: 'oval', eyes: 'dot', top: 'hair', mouth: 'smile', extra: 'jar' }),
  'galatea': H({ mat: 'ivory', head: 'oval', eyes: 'closed', top: 'bun', mouth: 'smile' }),
  'golem-of-prague': H({ mat: 'clay', head: 'square', eyes: 'dot', mouth: 'line', extra: 'letter' }),
  'bhuta-vahana-yantra': H({ mat: 'bronze', head: 'dome', eyes: 'slit', top: 'halo', mouth: 'none', extra: 'blades' }),
  'mokkurkalfi': H({ mat: 'clay', head: 'tall', eyes: 'big', mouth: 'o', extra: 'heart' }),
  'ilmarinen-s-golden-bride': H({ mat: 'gold', head: 'oval', eyes: 'closed', top: 'crown', mouth: 'none', extra: 'frost' }),
  'yan-shi-s-automaton': H({ mat: 'wood', head: 'oval', eyes: 'wink', top: 'knot', mouth: 'smile', extra: 'seam' }),
  'leonardo-s-mechanical-knight': H({ mat: 'steel', head: 'helm', eyes: 'visor', top: 'plume', mouth: 'grille' }),
  'vaucanson-s-flute-player': H({ mat: 'ivory', head: 'oval', eyes: 'dot', top: 'hat', mouth: 'o', extra: 'flute' }),
  'vaucanson-s-digesting-duck': { t: 'duck' },
  'jaquet-droz-s-writer': H({ mat: 'ivory', head: 'round', eyes: 'down', top: 'hair', mouth: 'smile', extra: 'quill' }),
  'mechanical-turk': H({ mat: 'wood', head: 'oval', eyes: 'dot', top: 'turban', mouth: 'line', extra: 'chess' }),
  'archer-karakuri': H({ mat: 'ivory', head: 'round', eyes: 'dot', top: 'knot', mouth: 'smile', extra: 'bow' }),
  'tea-serving-karakuri': H({ mat: 'ivory', head: 'round', eyes: 'closed', top: 'fringe', mouth: 'smile', extra: 'cup' }),
  'al-jazari-s-hand-washing-servant': H({ mat: 'copper', head: 'oval', eyes: 'dot', top: 'turban', mouth: 'line', extra: 'ewer' }),
  'zhuge-liang-s-wooden-ox': { t: 'ox' },
  'frankenstein-s-creature': H({ mat: 'green', head: 'tall', eyes: 'heavy', top: 'flat', mouth: 'line', extra: 'scar' }),
  'olimpia': H({ mat: 'ivory', head: 'oval', eyes: 'big', top: 'bun', mouth: 'o', extra: 'key' }),
  'pinocchio': H({ mat: 'wood', head: 'round', eyes: 'dot', top: 'cone', mouth: 'smile', extra: 'nose' }),
  'hadaly': H({ mat: 'silver', head: 'oval', eyes: 'closed', top: 'veil', mouth: 'none', extra: 'spark' }),
  'steam-man-of-the-prairies': H({ mat: 'iron', head: 'round', eyes: 'glow', top: 'stovepipe', mouth: 'grille' }),
  'tik-tok': H({ mat: 'copper', head: 'round', eyes: 'dot', top: 'knob', mouth: 'moustache', extra: 'key' }),
  'tin-woodman': H({ mat: 'tin', head: 'dome', eyes: 'dot', top: 'funnel', mouth: 'smile', extra: 'heart' }),
  'helena-and-primus-the-robots-of-r-u-r': H({ mat: 'flesh', head: 'oval', eyes: 'dot', top: 'flat', mouth: 'line', pair: true, extra: 'number' }),
  'maschinenmensch': H({ mat: 'gold', head: 'helm', eyes: 'slit', top: 'none', mouth: 'line', extra: 'rings' }),
  'boy-robot': H({ mat: 'flesh', head: 'round', eyes: 'big', top: 'spikes', mouth: 'smile' }),
  'bicentennial-android': H({ mat: 'silver', head: 'oval', eyes: 'dot', top: 'none', mouth: 'smile', extra: 'half' }),
  'replicant': H({ mat: 'flesh', head: 'oval', eyes: 'glow', top: 'flat', mouth: 'line', extra: 'rain' }),
  'cyborg-major': H({ mat: 'flesh', head: 'oval', eyes: 'slit', top: 'bob', mouth: 'line', extra: 'ports' }),
  'artificial-friend': H({ mat: 'white', head: 'oval', eyes: 'big', top: 'bob', mouth: 'smile', extra: 'sun' }),
  'escapee': H({ mat: 'silver', head: 'oval', eyes: 'dot', top: 'mesh', mouth: 'line' }),
  'iron-bean': H({ mat: 'iron', head: 'square', eyes: 'big', top: 'antenna', mouth: 'smile', extra: 'rivets' }),
  'elektronik': H({ mat: 'flesh', head: 'round', eyes: 'dot', top: 'curls', mouth: 'line', extra: 'bolt' }),
  'deviant-android': H({ mat: 'flesh', head: 'oval', eyes: 'dot', top: 'flat', mouth: 'line', extra: 'led' }),
  'boxer': H({ mat: 'iron', head: 'square', eyes: 'visor', top: 'none', mouth: 'grille', extra: 'gloves' }),
  'tournament-champion': H({ mat: 'black', head: 'helm', eyes: 'glow', top: 'horns', mouth: 'none' }),
  'gladiator-mecha': H({ mat: 'white', head: 'helm', eyes: 'visor', top: 'vcrest', mouth: 'grille', giant: true }),
  'taekwon-giant': H({ mat: 'blue', head: 'helm', eyes: 'visor', top: 'crest', mouth: 'grille', giant: true, extra: 'belt' }),
  'moxon-s-master': H({ mat: 'iron', head: 'dome', eyes: 'one', top: 'none', mouth: 'none', extra: 'chess' }),
  'circling-runner': H({ mat: 'copper', head: 'dome', eyes: 'glow', top: 'antenna', mouth: 'grille', extra: 'orbit' }),
  'drift-synced-jaeger': H({ mat: 'blue', head: 'helm', eyes: 'visor', top: 'fin', mouth: 'none', giant: true, extra: 'twin' }),
  'remote-controlled-giant': H({ mat: 'iron', head: 'dome', eyes: 'dot', top: 'none', mouth: 'grille', giant: true, extra: 'remote' }),
  'first-piloted-giant': H({ mat: 'black', head: 'helm', eyes: 'slit', top: 'pod', mouth: 'grille', giant: true }),
  'turing-test': { t: 'glyph', g: 'turing' }, 'three-laws': { t: 'glyph', g: 'laws' },
  'cybernetics': { t: 'glyph', g: 'loop' }, 'universal-constructor': { t: 'glyph', g: 'cells' },
  'moravec-s-paradox': { t: 'glyph', g: 'moravec' }, 'uncanny-valley': { t: 'glyph', g: 'valley' },
  'zero-moment-point': { t: 'glyph', g: 'zmp' }, 'passive-dynamic-walker': { t: 'glyph', g: 'walker' },
  'subsumption-architecture': { t: 'glyph', g: 'layers' },
  'elmer-and-elsie': { t: 'tortoise' }, 'shakey': { t: 'cabinet' },
  'wabot-1': H({ mat: 'steel', head: 'square', eyes: 'big', top: 'none', mouth: 'grille', extra: 'rivets' }),
  'one-legged-hopper': { t: 'hopper' }, 'genghis': { t: 'hexapod' }, 'kismet': { t: 'kismet' },
  'robocup': { t: 'ball' },
  'darpa-robotics-challenge': H({ mat: 'red', head: 'square', eyes: 'visor', top: 'lidar', mouth: 'none', extra: 'tilt' }),
  'cybathlon': H({ mat: 'flesh', head: 'round', eyes: 'dot', top: 'flat', mouth: 'smile', extra: 'exo' }),
  'lunokhod-1': { t: 'rover', wheels: 4, body: 'tub', c: 'silver' },
  'sojourner': { t: 'rover', wheels: 3, body: 'flat', c: 'gold', small: true },
  'opportunity': { t: 'rover', wheels: 3, body: 'wing', c: 'white', mast: true },
  'curiosity': { t: 'rover', wheels: 3, body: 'box', c: 'white', mast: true, big: true },
  'perseverance': { t: 'rover', wheels: 3, body: 'box', c: 'white', mast: true, big: true, tube: true },
  'ingenuity': { t: 'heli' },
  'zhurong': { t: 'rover', wheels: 3, body: 'butterfly', c: 'blue', mast: true },
  'robonaut-2': H({ mat: 'white', head: 'helm', eyes: 'visorgold', top: 'none', mouth: 'none', extra: 'pack' }),
  'philae': { t: 'lander' },
  'household-helper': H({ mat: 'blue', head: 'dome', eyes: 'big', top: 'cap', mouth: 'grille', extra: 'apron' }),
  'cat-from-the-future': H({ mat: 'blue', head: 'round', eyes: 'big', top: 'none', mouth: 'smile', extra: 'bell' }),
  'healthcare-companion': H({ mat: 'white', head: 'wide', eyes: 'link', top: 'none', mouth: 'none', soft: true }),
  'repair-unit': { t: 'barrel' },
  'security-unit': H({ mat: 'black', head: 'helm', eyes: 'visordark', top: 'none', mouth: 'none', extra: 'screen' }),
  'hunter': H({ mat: 'steel', head: 'oval', eyes: 'red', top: 'none', mouth: 'teeth' }),
  'compactor': { t: 'compactor' }, 'lightning-struck-prototype': { t: 'tracked' }, 'ship-s-mind': { t: 'lens' },
};

function head(shape, m) {
  const a = `fill="${m[0]}" stroke="${m[2]}" stroke-width="2.2" stroke-linejoin="round"`;
  switch (shape) {
    case 'square': return `<rect x="29" y="21" width="42" height="42" rx="7" ${a}/>`;
    case 'oval': return `<ellipse cx="50" cy="42" rx="18.5" ry="23.5" ${a}/>`;
    case 'helm': return `<path d="M28 46Q28 18 50 18Q72 18 72 46L72 58Q50 70 28 58Z" ${a}/>`;
    case 'dome': return `<path d="M28 63V41a22 22 0 0 1 44 0V63Z" ${a}/>`;
    case 'tall': return `<rect x="31" y="14" width="38" height="51" rx="9" ${a}/>`;
    case 'wide': return `<ellipse cx="50" cy="44" rx="25" ry="17" ${a}/>`;
    default: return `<circle cx="50" cy="42" r="22" ${a}/>`;
  }
}
function eyes(kind, m) {
  const k = m[2], y = 42;
  switch (kind) {
    case 'slit': return `<path d="M36 ${y}h10M54 ${y}h10" stroke="${k}" stroke-width="3" stroke-linecap="round"/>`;
    case 'closed': return `<path d="M36 ${y}q5 4 10 0M54 ${y}q5 4 10 0" fill="none" stroke="${k}" stroke-width="2.2" stroke-linecap="round"/>`;
    case 'wink': return `<circle cx="41" cy="${y}" r="3" fill="${k}"/><path d="M54 ${y}q5 4 10 0" fill="none" stroke="${k}" stroke-width="2.2" stroke-linecap="round"/>`;
    case 'down': return `<path d="M37 ${y + 1}q4-4 8 0M55 ${y + 1}q4-4 8 0" fill="none" stroke="${k}" stroke-width="2.2" stroke-linecap="round"/>`;
    case 'big': return `<circle cx="41" cy="${y}" r="6" fill="#fff" stroke="${k}" stroke-width="2"/><circle cx="59" cy="${y}" r="6" fill="#fff" stroke="${k}" stroke-width="2"/><circle cx="42" cy="${y}" r="2.6" fill="${k}"/><circle cx="60" cy="${y}" r="2.6" fill="${k}"/>`;
    case 'heavy': return `<path d="M34 37h14M52 37h14" stroke="${k}" stroke-width="3.5"/><circle cx="41" cy="44" r="2.6" fill="${k}"/><circle cx="59" cy="44" r="2.6" fill="${k}"/>`;
    case 'visor': return `<rect x="33" y="36" width="34" height="10" rx="5" fill="${k}"/><rect x="37" y="39" width="12" height="3" rx="1.5" fill="#7FE0E6"/>`;
    case 'visorgold': return `<rect x="32" y="30" width="36" height="22" rx="10" fill="#C9972B" stroke="${k}" stroke-width="2"/><path d="M38 36q6-4 12-2" stroke="#FCE9A9" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    case 'visordark': return `<rect x="31" y="32" width="38" height="18" rx="8" fill="#0B0C0E" stroke="#555B64" stroke-width="1.5"/>`;
    case 'glow': return `<circle cx="41" cy="${y}" r="4.5" fill="#FFD36B" stroke="${k}" stroke-width="1.6"/><circle cx="59" cy="${y}" r="4.5" fill="#FFD36B" stroke="${k}" stroke-width="1.6"/>`;
    case 'red': return `<circle cx="41" cy="${y}" r="5" fill="${k}"/><circle cx="59" cy="${y}" r="5" fill="${k}"/><circle cx="41" cy="${y}" r="2.2" fill="#FF3B2F"/><circle cx="59" cy="${y}" r="2.2" fill="#FF3B2F"/>`;
    case 'one': return `<circle cx="50" cy="${y}" r="7" fill="${k}"/><circle cx="50" cy="${y}" r="3" fill="#FF6A4D"/>`;
    case 'link': return `<circle cx="40" cy="44" r="3.2" fill="${k}"/><circle cx="60" cy="44" r="3.2" fill="${k}"/><path d="M40 44h20" stroke="${k}" stroke-width="1.8"/>`;
    default: return `<circle cx="41" cy="${y}" r="3" fill="${k}"/><circle cx="59" cy="${y}" r="3" fill="${k}"/>`;
  }
}
function mouth(kind, m) {
  const k = m[2];
  switch (kind) {
    case 'none': return '';
    case 'smile': return `<path d="M43 54q7 5 14 0" fill="none" stroke="${k}" stroke-width="2.2" stroke-linecap="round"/>`;
    case 'o': return `<ellipse cx="50" cy="55" rx="3" ry="3.6" fill="${k}"/>`;
    case 'grille': return `<rect x="41" y="51" width="18" height="8" rx="2" fill="${m[1]}" stroke="${k}" stroke-width="1.6"/><path d="M45.5 51v8M50 51v8M54.500 51v8" stroke="${k}" stroke-width="1.4"/>`;
    case 'teeth': return `<rect x="40" y="52" width="20" height="7" rx="1.5" fill="#EEE" stroke="${k}" stroke-width="1.6"/><path d="M44 52v7M48 52v7M52 52v7M56 52v7" stroke="${k}" stroke-width="1.2"/>`;
    case 'moustache': return `<path d="M38 53q6-5 12 0q6-5 12 0" fill="none" stroke="${k}" stroke-width="2.6" stroke-linecap="round"/>`;
    default: return `<path d="M44 55h12" stroke="${k}" stroke-width="2.2" stroke-linecap="round"/>`;
  }
}
function top(kind, m) {
  const [b, s, k] = m, st = `stroke="${k}" stroke-width="2.2" stroke-linejoin="round"`;
  switch (kind) {
    case 'antenna': return `<path d="M50 20V9" ${st}/><circle cx="50" cy="7" r="3.2" fill="#E8563F" ${st}/>`;
    case 'knob': return `<circle cx="50" cy="17" r="4" fill="${s}" ${st}/>`;
    case 'crest': return `<path d="M50 19Q40 2 62 6Q54 10 56 19Z" fill="#B2402C" ${st}/>`;
    case 'plume': return `<path d="M50 18Q46 0 66 4Q56 9 57 19Z" fill="#B2402C" ${st}/>`;
    case 'vcrest': return `<path d="M50 30L28 10l8 16zM50 30L72 10l-8 16z" fill="#E2B13C" ${st}/><rect x="46" y="22" width="8" height="8" fill="#D2493A" ${st}/>`;
    case 'fin': return `<path d="M46 19L50 4l4 15z" fill="${s}" ${st}/>`;
    case 'horns': return `<path d="M32 26Q22 14 28 6Q32 16 40 20ZM68 26Q78 14 72 6Q68 16 60 20Z" fill="${s}" ${st}/>`;
    case 'pod': return `<ellipse cx="50" cy="18" rx="10" ry="6" fill="#D2493A" ${st}/><ellipse cx="50" cy="17" rx="5" ry="2.6" fill="#BFE6F2"/>`;
    case 'hat': return `<path d="M30 24h40M36 24V12h28v12" fill="${k}" ${st}/>`;
    case 'stovepipe': return `<rect x="40" y="0" width="20" height="21" fill="${k}" ${st}/><path d="M33 21h34" ${st}/><path d="M50 0q-6-6 2-9" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" opacity=".7"/>`;
    case 'funnel': return `<path d="M38 20L46 6h8l8 14z" fill="${s}" ${st}/>`;
    case 'cone': return `<path d="M36 23L52 2l12 20z" fill="#D2493A" ${st}/>`;
    case 'cap': return `<path d="M34 24q16-12 32 0z" fill="#fff" ${st}/>`;
    case 'turban': return `<path d="M29 32Q28 12 50 12Q72 12 71 32Q50 22 29 32Z" fill="#F2F3F5" ${st}/><circle cx="50" cy="18" r="3" fill="#B2402C"/>`;
    case 'crown': return `<path d="M34 24l2-13 7 8 7-11 7 11 7-8 2 13z" fill="#C3C8CF" ${st}/>`;
    case 'halo': return `<circle cx="50" cy="40" r="30" fill="none" stroke="${s}" stroke-width="2" stroke-dasharray="3 5"/>`;
    case 'hair': return `<path d="M30 40Q28 16 50 16Q72 16 70 40Q66 26 50 25Q34 26 30 40Z" fill="${k}"/>`;
    case 'bob': return `<path d="M29 56Q24 16 50 16Q76 16 71 56L66 56Q68 28 50 27Q32 28 34 56Z" fill="${k}"/>`;
    case 'bun': return `<circle cx="50" cy="14" r="7" fill="${k}"/><path d="M31 38Q30 17 50 17Q70 17 69 38Q62 25 50 25Q38 25 31 38Z" fill="${k}"/>`;
    case 'knot': return `<circle cx="50" cy="16" r="5" fill="${k}"/><path d="M45 20h10" stroke="#B2402C" stroke-width="3"/>`;
    case 'fringe': return `<path d="M29 40Q28 19 50 19Q72 19 71 40L66 33H34Z" fill="${k}"/>`;
    case 'flat': return `<path d="M31 32Q32 16 50 16Q68 16 69 32Q50 24 31 32Z" fill="${k}"/>`;
    case 'curls': return `<g fill="#C98A3B"><circle cx="35" cy="26" r="6"/><circle cx="44" cy="20" r="6"/><circle cx="55" cy="20" r="6"/><circle cx="65" cy="26" r="6"/></g>`;
    case 'spikes': return `<path d="M29 36Q26 14 50 17Q60 6 66 20Q76 22 71 38Q62 26 50 27Q38 26 29 36Z" fill="${k}"/>`;
    case 'veil': return `<path d="M27 60Q22 12 50 14Q78 12 73 60" fill="none" stroke="${s}" stroke-width="2" stroke-dasharray="2 3"/>`;
    case 'mesh': return `<path d="M33 30Q36 17 50 17Q64 17 67 30" fill="none" stroke="${k}" stroke-width="1.6"/><path d="M38 28l6-10M46 27l3-10M54 27l-3-10M62 28l-6-10" stroke="${k}" stroke-width="1.1"/>`;
    case 'lidar': return `<rect x="42" y="11" width="16" height="10" rx="3" fill="${k}"/><circle cx="50" cy="16" r="2.5" fill="#7FE0E6"/>`;
    default: return '';
  }
}
function extra(kind, m) {
  const [b, s, k] = m, st = `stroke="${k}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
  switch (kind) {
    case 'nail': return `<circle cx="66" cy="86" r="3.4" fill="#E9E3D2" ${st}/><path d="M66 89v8" stroke="#B2402C" stroke-width="2"/>`;
    case 'jar': return `<path d="M70 78q-7 8 0 18h14q7-10 0-18z" fill="#8F5F17" ${st}/><path d="M69 78h16" ${st}/>`;
    case 'letter': return `<text x="50" y="33" text-anchor="middle" font-size="11" font-family="serif" fill="${k}">אמת</text>`;
    case 'blades': return `<path d="M8 50l14-4v8zM92 50l-14-4v8z" fill="${s}" ${st}/>`;
    case 'heart': return `<path d="M50 94l-7-7a4.500 4.500 0 0 1 7-5.500a4.500 4.500 0 0 1 7 5.500z" fill="#D2493A" stroke="${k}" stroke-width="1.5"/>`;
    case 'frost': return `<path d="M16 22v12M10 28h12M12 24l8 8M20 24l-8 8M84 66v10M79 71h10" stroke="#9CC7E0" stroke-width="1.8" stroke-linecap="round"/>`;
    case 'seam': return `<path d="M50 72v28" stroke="${k}" stroke-width="1.6" stroke-dasharray="3 3"/><circle cx="50" cy="80" r="2" fill="${k}"/><circle cx="50" cy="90" r="2" fill="${k}"/>`;
    case 'flute': return `<path d="M52 56L88 66" stroke="#5B3A17" stroke-width="4" stroke-linecap="round"/><path d="M62 59l.1 0M70 61l.1 0M78 63l.1 0" stroke="#E9D9B8" stroke-width="2" stroke-linecap="round"/>`;
    case 'quill': return `<path d="M74 96L88 62q4 10-6 22z" fill="#fff" ${st}/>`;
    case 'chess': return `<path d="M76 96h14l-2-6h-10zM79 90q-3-8 4-12q7 4 4 12z" fill="${k}"/><circle cx="83" cy="76" r="3" fill="${k}"/>`;
    case 'bow': return `<path d="M82 58Q96 78 82 98" fill="none" stroke="#5B3A17" stroke-width="2.6"/><path d="M82 58V98" stroke="${k}" stroke-width="1"/><path d="M70 78h22l-4-3m4 3l-4 3" fill="none" stroke="${k}" stroke-width="1.6"/>`;
    case 'cup': return `<path d="M38 82h24M43 82q0 9 7 9q7 0 7-9z" fill="#F2F3F5" ${st}/><path d="M48 78q-2-3 0-5M53 78q-2-3 0-5" fill="none" stroke="${s}" stroke-width="1.4"/>`;
    case 'ewer': return `<path d="M74 96q-6-10 2-18v-5h8v5q8 8 2 18z" fill="#C9972B" ${st}/><path d="M76 76q-8-2-8 6" fill="none" ${st}/>`;
    case 'scar': return `<path d="M36 26l12 6M39 23l-2 6M44 25l-2 6" stroke="${k}" stroke-width="1.6"/><circle cx="40" cy="68" r="3" fill="${MAT.steel[0]}" stroke="${k}"/><circle cx="60" cy="68" r="3" fill="${MAT.steel[0]}" stroke="${k}"/>`;
    case 'key': return `<circle cx="84" cy="82" r="5" fill="none" stroke="#A87A12" stroke-width="3"/><path d="M79 82H68M72 82v5" stroke="#A87A12" stroke-width="3" stroke-linecap="round"/>`;
    case 'nose': return `<path d="M50 47L78 50" stroke="${s}" stroke-width="5" stroke-linecap="round"/><path d="M50 47L78 50" stroke="${b}" stroke-width="2.4" stroke-linecap="round"/>`;
    case 'spark': return `<path d="M84 18l-6 9h5l-4 9" fill="none" stroke="#E2B13C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'number': return '';
    case 'rings': return `<ellipse cx="50" cy="52" rx="40" ry="9" fill="none" stroke="#FFF2B8" stroke-width="1.6" opacity=".9"/><ellipse cx="50" cy="80" rx="44" ry="9" fill="none" stroke="#FFF2B8" stroke-width="1.6" opacity=".9"/>`;
    case 'half': return `<path d="M50 18.500a18.500 23.500 0 0 1 0 47z" fill="${MAT.flesh[0]}" stroke="${k}" stroke-width="2.2"/>`;
    case 'rain': return `<path d="M14 10l-3 9M26 22l-3 9M82 8l-3 9M90 28l-3 9M76 40l-3 9M10 46l-3 9" stroke="#6FA3C9" stroke-width="1.8" stroke-linecap="round"/>`;
    case 'ports': return `<circle cx="44" cy="68" r="1.6" fill="${k}"/><circle cx="50" cy="68" r="1.6" fill="${k}"/><circle cx="56" cy="68" r="1.6" fill="${k}"/>`;
    case 'sun': return `<circle cx="84" cy="16" r="7" fill="#F2B632"/><path d="M84 3v4M84 25v4M71 16h4M93 16h4M75 7l3 3M90 22l3 3M93 7l-3 3M78 22l-3 3" stroke="#F2B632" stroke-width="2" stroke-linecap="round"/>`;
    case 'rivets': return `<g fill="${k}"><circle cx="33" cy="25" r="1.5"/><circle cx="67" cy="25" r="1.5"/><circle cx="33" cy="59" r="1.5"/><circle cx="67" cy="59" r="1.5"/></g>`;
    case 'bolt': return `<path d="M52 78l-6 9h5l-3 8" fill="none" stroke="#E2B13C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'led': return `<circle cx="66" cy="36" r="3.2" fill="none" stroke="#38B6E8" stroke-width="2.2"/>`;
    case 'gloves': return `<circle cx="16" cy="78" r="11" fill="#D2493A" ${st}/><circle cx="84" cy="78" r="11" fill="#D2493A" ${st}/>`;
    case 'belt': return `<path d="M24 92h52" stroke="#111" stroke-width="5"/>`;
    case 'orbit': return `<ellipse cx="50" cy="44" rx="44" ry="12" fill="none" stroke="#E8563F" stroke-width="1.6" stroke-dasharray="4 4" transform="rotate(-14 50 44)"/>`;
    case 'twin': return `<circle cx="42" cy="86" r="4" fill="#7FE0E6" stroke="${k}"/><circle cx="58" cy="86" r="4" fill="#7FE0E6" stroke="${k}"/><path d="M46 86h8" stroke="#7FE0E6" stroke-width="2"/>`;
    case 'remote': return `<rect x="74" y="76" width="16" height="20" rx="2" fill="#2B3037" ${st}/><path d="M78 76V66M86 76V68" ${st}/><circle cx="82" cy="86" r="2.500" fill="#D2493A"/>`;
    case 'tilt': return '';
    case 'exo': return `<path d="M22 100V84l10-8M78 100V84l-10-8" fill="none" stroke="#2B3037" stroke-width="4" stroke-linecap="round"/><circle cx="22" cy="84" r="3.500" fill="#38B6E8" stroke="#2B3037" stroke-width="1.500"/><circle cx="78" cy="84" r="3.500" fill="#38B6E8" stroke="#2B3037" stroke-width="1.500"/>`;
    case 'pack': return `<rect x="38" y="80" width="24" height="12" rx="2" fill="${s}" ${st}/><path d="M42 86h6" stroke="#D2493A" stroke-width="2.500"/>`;
    case 'apron': return `<path d="M36 78h28v22H36z" fill="#fff" ${st}/><path d="M36 78l-6-4M64 78l6-4" ${st}/>`;
    case 'bell': return `<path d="M30 70h40" stroke="#D2493A" stroke-width="4"/><circle cx="50" cy="75" r="5" fill="#E2B13C" ${st}/><ellipse cx="50" cy="50" rx="13" ry="10" fill="#fff" opacity=".9"/><circle cx="50" cy="47" r="2.600" fill="#D2493A"/><path d="M43 53q7 6 14 0" fill="none" stroke="${k}" stroke-width="2" stroke-linecap="round"/>`;
    case 'screen': return `<rect x="70" y="72" width="22" height="16" rx="2" fill="#0B0C0E" stroke="#555B64" stroke-width="1.500"/><path d="M78 76v8l7-4z" fill="#7FE0E6"/>`;
    default: return '';
  }
}

function humanoid(sp) {
  const m = MAT[sp.mat] || MAT.steel;
  const st = `stroke="${m[2]}" stroke-width="2.2" stroke-linejoin="round"`;
  const sh = sp.giant
    ? `<path d="M6 100V82l18-10h52l18 10v18z" fill="${m[0]}" ${st}/><path d="M6 82l-2-10 14-4 6 4M94 82l2-10-14-4-6 4" fill="${m[1]}" ${st}/>`
    : sp.soft ? `<path d="M10 100Q10 66 50 66Q90 66 90 100Z" fill="${m[0]}" ${st}/>`
      : `<path d="M18 100Q18 75 50 73Q82 75 82 100Z" fill="${m[0]}" ${st}/>`;
  const neck = sp.soft ? '' : `<rect x="43" y="60" width="14" height="15" fill="${m[1]}" ${st}/>`;
  const hairBack = ['bob'].includes(sp.top) ? top(sp.top, m) : '';
  let g = `${sh}${neck}${hairBack}${head(sp.head, m)}${hairBack ? '' : top(sp.top, m)}${sp.extra === 'half' ? extra('half', m) : ''}${eyes(sp.eyes, m)}${sp.extra === 'bell' ? '' : mouth(sp.mouth, m)}${sp.extra && sp.extra !== 'half' ? extra(sp.extra, m) : ''}`;
  if (sp.extra === 'tilt') g = `<g transform="rotate(14 50 90)">${g}</g>`;
  if (sp.pair) {
    return `<g transform="translate(-16 8) scale(.86)">${g}</g><g transform="translate(30 8) scale(.86)">${g}</g>`;
  }
  return g;
}

const K = '#1F262D';
const S = `stroke="${K}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
function wheel(x, y, r) { return `<circle cx="${x}" cy="${y}" r="${r}" fill="#3B3F46" ${S}/><circle cx="${x}" cy="${y}" r="${r * .35}" fill="#9AA5B1"/>`; }
function rover(sp) {
  const c = MAT[sp.c] || MAT.white, y = 80, r = sp.big ? 9 : sp.small ? 6 : 7.500;
  const xs = sp.wheels === 4 ? [22, 40, 60, 78] : [24, 50, 76];
  let body = '';
  if (sp.body === 'tub') body = `<path d="M18 66q0-16 32-16q32 0 32 16z" fill="${c[0]}" ${S}/><path d="M26 50q24-16 48 0z" fill="${c[1]}" ${S}/><path d="M74 46l10-14" ${S}/><circle cx="85" cy="30" r="3" fill="${c[0]}" ${S}/>`;
  else if (sp.body === 'flat') body = `<rect x="24" y="58" width="52" height="10" rx="2" fill="${c[1]}" ${S}/><path d="M22 58h56l-6-7H28z" fill="#2C5388" ${S}/><path d="M66 51V38" ${S}/><circle cx="66" cy="36" r="2.500" fill="${K}"/>`;
  else if (sp.body === 'wing') body = `<path d="M10 58h80l-10-9H20z" fill="#2C5388" ${S}/><rect x="34" y="58" width="32" height="10" fill="${c[0]}" ${S}/>`;
  else if (sp.body === 'butterfly') body = `<path d="M50 56L8 44l6 18zM50 56l42-12-6 18z" fill="#2C5388" ${S}/><rect x="34" y="54" width="32" height="14" rx="3" fill="#E2B13C" ${S}/>`;
  else body = `<rect x="22" y="50" width="56" height="18" rx="3" fill="${c[0]}" ${S}/><path d="M72 50l10-8 4 4-8 8" fill="${c[1]}" ${S}/>`;
  const mast = sp.mast ? `<path d="M40 ${sp.body === 'box' ? 50 : 56}V28" ${S}/><rect x="31" y="18" width="18" height="11" rx="2" fill="${c[0]}" ${S}/><circle cx="36" cy="23.500" r="2.600" fill="${K}"/><circle cx="44" cy="23.500" r="2.600" fill="${K}"/>` : '';
  const tube = sp.tube ? `<rect x="82" y="84" width="4" height="10" rx="2" fill="#E2B13C" stroke="${K}"/><rect x="88" y="86" width="4" height="10" rx="2" fill="#E2B13C" stroke="${K}"/>` : '';
  return `<path d="M0 90h100v10H0z" fill="#8E4A2E" opacity=".75"/>${mast}${body}<path d="M${xs[0]} ${y}L50 66L${xs[xs.length - 1]} ${y}" fill="none" ${S}/>${xs.map((x) => wheel(x, y, r)).join('')}${tube}`;
}
const DRAW = {
  h: humanoid, rover,
  heli: () => `<path d="M0 90h100v10H0z" fill="#8E4A2E" opacity=".75"/><path d="M12 22h76M20 30h60" stroke="#D5D9DE" stroke-width="3.500" stroke-linecap="round"/><path d="M50 16v36" ${S}/><rect x="40" y="52" width="20" height="16" rx="3" fill="#E2B13C" ${S}/><rect x="42" y="10" width="16" height="6" fill="#2C5388" ${S}/><path d="M42 68L30 88M58 68L70 88M46 68l-6 20M54 68l6 20" ${S}/>`,
  lander: () => `<path d="M0 88l30-20 22 14 48-40v58H0z" fill="#3B3F46"/><path d="M26 30h34l10 18-10 16H26l-8-16z" fill="#D5D9DE" ${S}/><path d="M30 38h26v14H30z" fill="#2C5388" ${S}/><path d="M22 60L8 80M62 62l16 16M44 64v18" ${S}/><circle cx="8" cy="80" r="3" fill="${K}"/><circle cx="78" cy="78" r="3" fill="${K}"/><circle cx="44" cy="84" r="3" fill="${K}"/>`,
  duck: () => `<path d="M18 70q0-22 28-22q10 0 16 6q-2-22 12-22q12 0 10 12l8 4-9 4q-2 8-6 12q4 22-26 22q-33 0-33-16z" fill="#C9972B" ${S}/><circle cx="76" cy="40" r="2.400" fill="${K}"/><path d="M30 66q14 10 28 0" fill="none" ${S}/><circle cx="40" cy="62" r="4" fill="none" stroke="${K}" stroke-width="1.500"/><path d="M40 56v-2M40 70v-2M34 62h-2M48 62h-2" stroke="${K}" stroke-width="1.500"/><path d="M40 86v8h-6M52 86v8h-6" ${S} fill="none"/>`,
  ox: () => `<rect x="18" y="40" width="52" height="26" rx="4" fill="#B98A55" ${S}/><path d="M70 44l14-4 4 14-18 4z" fill="#B98A55" ${S}/><path d="M80 40q-2-10 8-10M76 41q-6-8 0-12" fill="none" ${S}/><circle cx="82" cy="48" r="1.800" fill="${K}"/><path d="M26 66v22M38 66v22M52 66v22M64 66v22" stroke="#80592E" stroke-width="5" stroke-linecap="round"/><path d="M22 40q20-14 44 0" fill="#E9D9B8" ${S}/><path d="M30 48h30M30 56h30" stroke="#80592E" stroke-width="1.500"/>`,
  tortoise: () => [[30, 66, .8], [66, 56, 1]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-24 12a24 22 0 0 1 48 0z" fill="#CFE0D6" stroke="${K}" stroke-width="2.400" fill-opacity=".55"/><path d="M-26 12h52v6h-52z" fill="#9AA5B1" ${S}/><path d="M0 12V-16" ${S}/><circle cx="0" cy="-19" r="4" fill="#FFD36B" ${S}/><circle cx="-16" cy="22" r="4.500" fill="#3B3F46"/><circle cx="16" cy="22" r="4.500" fill="#3B3F46"/></g>`).join(''),
  cabinet: () => `<g transform="rotate(-4 50 60)"><rect x="30" y="36" width="40" height="40" rx="3" fill="#C5CBD0" ${S}/><rect x="36" y="18" width="28" height="16" rx="2" fill="#9AA5B1" ${S}/><circle cx="50" cy="26" r="5" fill="${K}"/><circle cx="50" cy="26" r="2" fill="#7FE0E6"/><path d="M42 18L36 6M58 18l6-12" ${S}/><path d="M36 46h28M36 54h28M36 62h18" stroke="#5F6B78" stroke-width="2"/><path d="M24 76h52l4 8H20z" fill="#5F6B78" ${S}/></g>${wheel(32, 88, 6)}${wheel(68, 88, 6)}<path d="M12 40q-4 4 0 8M88 40q4 4 0 8" fill="none" stroke="#5F6B78" stroke-width="2" stroke-linecap="round"/>`,
  hopper: () => `<path d="M10 94h80" stroke="#5F6B78" stroke-width="3" stroke-linecap="round"/><g transform="rotate(8 50 50)"><rect x="30" y="18" width="40" height="18" rx="4" fill="#D2493A" ${S}/><path d="M22 27h56" ${S}/><path d="M50 36v14" ${S}/><path d="M50 50l-7 4 14 5-14 5 14 5-7 4v9" fill="none" ${S}/><circle cx="50" cy="84" r="3.500" fill="${K}"/></g><path d="M36 92q14-8 28 0" fill="none" stroke="#5F6B78" stroke-width="1.600" stroke-dasharray="3 3"/>`,
  hexapod: () => `<path d="M0 86q20-8 40 0t60-2v16H0z" fill="#8A8F7A" opacity=".6"/><path d="M30 52L12 40 6 78M42 52L30 32 22 80M58 52L70 32l8 48M70 52l18-12 6 38M50 52l-6 30M50 52l8 30" fill="none" ${S}/><rect x="28" y="44" width="44" height="16" rx="5" fill="#3B3F46" ${S}/><path d="M66 46l10-10M70 48l12-6" ${S}/><circle cx="38" cy="52" r="2.500" fill="#7FE0E6"/><circle cx="48" cy="52" r="2.500" fill="#E2B13C"/><circle cx="58" cy="52" r="2.500" fill="#D2493A"/>`,
  kismet: () => `<path d="M28 34L14 12l22 12zM72 34l14-22-22 12z" fill="#E9A3B0" ${S}/><path d="M26 40q0-14 24-14t24 14v20q0 12-24 12T26 60z" fill="#9AA5B1" ${S}/><circle cx="39" cy="46" r="9" fill="#fff" ${S}/><circle cx="61" cy="46" r="9" fill="#fff" ${S}/><circle cx="40" cy="47" r="4" fill="#3A74B8"/><circle cx="62" cy="47" r="4" fill="#3A74B8"/><path d="M29 33q9-7 18 0M53 33q9-7 18 0" fill="none" stroke="#5B3A17" stroke-width="3.500" stroke-linecap="round"/><path d="M38 64q12 8 24 0q-12-4-24 0z" fill="#D2493A" ${S}/><path d="M44 72v10h12V72" fill="#5F6B78" ${S}/><path d="M30 88h40" ${S}/>`,
  ball: () => `<path d="M0 84h100v16H0z" fill="#5E9E60"/><path d="M0 84h100" stroke="#fff" stroke-width="2"/><circle cx="70" cy="70" r="14" fill="#fff" ${S}/><path d="M70 62l7 5-3 8h-8l-3-8z" fill="${K}"/><path d="M70 62v-6M77 67l6-2M74 75l4 6M66 75l-4 6M63 67l-6-2" stroke="${K}" stroke-width="1.600"/><rect x="18" y="30" width="24" height="20" rx="4" fill="#D2493A" ${S}/><circle cx="25" cy="39" r="2.500" fill="#fff"/><circle cx="35" cy="39" r="2.500" fill="#fff"/><rect x="20" y="52" width="20" height="18" rx="2" fill="#9AA5B1" ${S}/><path d="M24 70v14M36 70l12 10" ${S}/><path d="M30 30v-8" ${S}/><circle cx="30" cy="20" r="2.500" fill="#E2B13C" stroke="${K}"/>`,
  barrel: () => `<path d="M30 40a20 20 0 0 1 40 0z" fill="#D5D9DE" ${S}/><rect x="30" y="40" width="40" height="40" fill="#F2F3F5" ${S}/><circle cx="46" cy="30" r="5" fill="${K}"/><circle cx="46" cy="30" r="2" fill="#D2493A"/><rect x="56" y="28" width="8" height="5" fill="#2C5388"/><path d="M36 48h28v6H36zM36 60h10v12H36zM52 60h12v5H52z" fill="#2C5388"/><path d="M22 44h8v40h-10zM78 44h-8v40h10z" fill="#D5D9DE" ${S}/><path d="M14 92h18l-4-8h-10zM86 92H68l4-8h10zM42 80h16l3 12H39z" fill="#9AA5B1" ${S}/>`,
  compactor: () => `<path d="M0 92h100v8H0z" fill="#B59A6A"/><rect x="28" y="48" width="44" height="34" rx="3" fill="#E0A83A" ${S}/><path d="M34 60h32v14H34z" fill="#8C6A1E" ${S}/><path d="M50 48V38" ${S}/><path d="M26 34q0-9 11-9t11 9q0 7-11 7T26 34zM52 34q0-9 11-9t11 9q0 7-11 7T52 34z" fill="#9AA5B1" ${S}/><circle cx="38" cy="33" r="5" fill="${K}"/><circle cx="62" cy="33" r="5" fill="${K}"/><circle cx="39.500" cy="31.500" r="1.600" fill="#fff"/><circle cx="63.500" cy="31.500" r="1.600" fill="#fff"/><path d="M14 92l6-20h10v20zM86 92l-6-20H70v20z" fill="#3B3F46" ${S}/><path d="M84 60q4-8 0-12" fill="none" stroke="#5E9E60" stroke-width="2.400" stroke-linecap="round"/><circle cx="84" cy="46" r="2.500" fill="#5E9E60"/>`,
  tracked: () => `<path d="M88 4l-8 14h7l-7 14" fill="none" stroke="#E2B13C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 78h68a8 8 0 0 1 0 16H16a8 8 0 0 1 0-16z" fill="#3B3F46" ${S}/><circle cx="22" cy="86" r="4" fill="#9AA5B1"/><circle cx="50" cy="86" r="4" fill="#9AA5B1"/><circle cx="78" cy="86" r="4" fill="#9AA5B1"/><rect x="34" y="58" width="32" height="20" rx="3" fill="#C5CBD0" ${S}/><path d="M50 58V40" stroke="${K}" stroke-width="5"/><path d="M26 36q0-10 11-10h26q11 0 11 10t-11 10H37q-11 0-11-10z" fill="#9AA5B1" ${S}/><circle cx="39" cy="36" r="6.500" fill="${K}"/><circle cx="61" cy="36" r="6.500" fill="${K}"/><circle cx="39" cy="36" r="2.600" fill="#7FE0E6"/><circle cx="61" cy="36" r="2.600" fill="#7FE0E6"/><path d="M28 24l10 3M72 24l-10 3" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
  lens: () => `<rect x="30" y="8" width="40" height="84" rx="4" fill="#1E2126" stroke="#555B64" stroke-width="2.200"/><rect x="36" y="14" width="28" height="8" fill="#2C5388"/><circle cx="50" cy="50" r="16" fill="#0A0B0D" stroke="#9AA5B1" stroke-width="3"/><circle cx="50" cy="50" r="9" fill="#7A1710"/><circle cx="50" cy="50" r="4" fill="#FF3B2F"/><circle cx="46" cy="46" r="1.800" fill="#FFD9A8"/><path d="M38 76h24M38 81h24M38 86h24" stroke="#555B64" stroke-width="2"/>`,
  glyph: (sp) => GLYPH[sp.g](),
};
const P = '#3D3470', A = '#B2402C';
const GS = `fill="none" stroke="${P}" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"`;
const GLYPH = {
  turing: () => `<path d="M50 12v76" stroke="${P}" stroke-width="3" stroke-dasharray="5 5"/><circle cx="24" cy="38" r="9" ${GS}/><path d="M10 66q14-16 28 0" ${GS}/><rect x="64" y="29" width="20" height="18" rx="3" ${GS}/><path d="M62 66q12-14 24 0" ${GS}/><text x="50" y="98" text-anchor="middle" font-size="12" font-family="monospace" fill="${A}">?</text><circle cx="70" cy="38" r="1.800" fill="${P}"/><circle cx="78" cy="38" r="1.800" fill="${P}"/>`,
  laws: () => `<rect x="18" y="16" width="64" height="18" rx="3" fill="${A}" fill-opacity=".9" stroke="${P}" stroke-width="2.400"/><rect x="24" y="41" width="52" height="18" rx="3" fill="#E2B13C" stroke="${P}" stroke-width="2.400"/><rect x="30" y="66" width="40" height="18" rx="3" fill="#fff" stroke="${P}" stroke-width="2.400"/><g font-family="monospace" font-size="12" font-weight="700" text-anchor="middle" fill="${P}"><text x="50" y="29" fill="#fff">1</text><text x="50" y="54">2</text><text x="50" y="79">3</text></g>`,
  loop: () => `<path d="M22 50a28 28 0 1 1 10 21" ${GS}/><path d="M32 71l-10 2 3-10" ${GS}/><circle cx="50" cy="50" r="7" fill="${A}"/><path d="M50 22v-8M78 50h8M50 78v8" ${GS}/>`,
  cells: () => { let s = ''; const on = ['11', '12', '13', '21', '31', '32', '33', '23', '34', '44', '43', '42', '41', '14']; for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) s += `<rect x="${14 + j * 12}" y="${14 + i * 12}" width="11" height="11" fill="${on.includes('' + i + j) ? P : '#fff'}" fill-opacity="${on.includes('' + i + j) ? 1 : .5}"/>`; return s + `<path d="M64 74l14 0m-5-5l5 5-5 5" ${GS} stroke="${A}"/>`; },
  moravec: () => `<path d="M12 84h76" ${GS}/><path d="M18 84V40h10v44M22 40v-8h2v8M20 32h6" ${GS}/><path d="M58 84q-2-16 8-24" ${GS}/><circle cx="68" cy="52" r="8" ${GS}/><path d="M64 66l-10 6M70 68l8 8" ${GS}/><path d="M36 56l12 0m-4-4l4 4-4 4" stroke="${A}" stroke-width="2.600" fill="none" stroke-linecap="round"/>`,
  valley: () => `<path d="M12 86V14M12 86h78" ${GS}/><path d="M14 80C34 70 44 40 58 34c6-2 8 44 14 44s6-56 16-62" fill="none" stroke="${A}" stroke-width="3.200" stroke-linecap="round"/><circle cx="72" cy="78" r="3.500" fill="${P}"/>`,
  zmp: () => `<path d="M8 84h84" ${GS}/><path d="M50 22v26l-12 18v18M50 48l12 16-4 20" ${GS}/><circle cx="50" cy="15" r="7" ${GS}/><path d="M30 84h14M52 84h14" stroke="${P}" stroke-width="5"/><circle cx="48" cy="90" r="4" fill="${A}"/><path d="M48 90V70" stroke="${A}" stroke-width="2" stroke-dasharray="3 3"/>`,
  walker: () => `<path d="M6 60L94 90" ${GS}/><g transform="rotate(18 50 50)"><path d="M46 20v22l-12 30M46 42l10 30" ${GS}/><circle cx="46" cy="16" r="5" fill="${P}"/><path d="M30 72h10M52 72h10" ${GS}/></g><path d="M70 30q8 4 8 14m0 0l-5-4m5 4l4-5" fill="none" stroke="${A}" stroke-width="2.400" stroke-linecap="round"/>`,
  layers: () => `<rect x="14" y="62" width="72" height="16" rx="3" fill="${P}"/><rect x="24" y="42" width="52" height="16" rx="3" fill="${P}" fill-opacity=".7"/><rect x="34" y="22" width="32" height="16" rx="3" fill="${P}" fill-opacity=".4"/><path d="M8 88h84" ${GS}/><path d="M50 78v10M40 58v4M60 38v4" stroke="${A}" stroke-width="2.600"/><g font-family="monospace" font-size="9" fill="#fff" text-anchor="middle"><text x="50" y="73">avoid</text><text x="50" y="53">wander</text></g>`,
};

function avatarSvg(robot, size) {
  const sp = SPEC[robot.slug] || H({});
  const bg = HOUSE_BG[robot.house] || '#DDD';
  const stars = robot.house === 'frontier' ? '<g fill="#fff" opacity=".8"><circle cx="12" cy="14" r="1"/><circle cx="84" cy="10" r=".9"/><circle cx="70" cy="24" r=".7"/><circle cx="24" cy="38" r=".8"/><circle cx="92" cy="44" r=".8"/></g>' : '';
  const inner = DRAW[sp.t](sp);
  const id = 'c' + robot.n;
  const sz = size ? ` width="${size}" height="${size}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"${sz} role="img" aria-label="${robot.name.en.replace(/"/g, '&quot;')}"><defs><clipPath id="${id}"><rect width="100" height="100" rx="14"/></clipPath></defs><g clip-path="url(#${id})"><rect width="100" height="100" fill="${bg}"/>${stars}${inner}</g></svg>`;
}
module.exports = { avatarSvg };
