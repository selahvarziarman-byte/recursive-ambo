#!/usr/bin/env node

// DIAGNOSTIC — THE INSIDE (STAMP C-7a, 2026-09-22): a corner's concept-space as
// an ARC DIAGRAM on the canvas — the incidence presentation computed on the
// type (src/lib/castInside.ts) and drawn (src/components/CastInsideDiagram.tsx).
//
// ⛔ THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the presentation is RUN on
// the fixtures FROM THE RECORD, and its census is read against the researcher's
// seal (inside_midpoint_trace.py, sealed by hand at 10ccb00 and reproduced at
// the mothership's hand): triangle 3 points · 3 arrows · 0 loops · 0 hyper ·
// 0 neg · 1 word · 0 marks; t-cell 10 · 10 · 0 · 1 hyper removes(r8, r3, r2) ·
// 3 neg · 6 words · 10 marks; flow 14 · 31 · 3 loops (disjoins F4 · sustains
// F5 · sustains F7) · 11 words · 14 marks; phi 9 · 15 · 7 loops (six on Φ1;
// descends-from Φ7) · 14 words · 9 marks. A disagreement reopens the
// DEFINITION, never tunes the code (the ADR 0031 kill-condition pattern).
//
// THE ACCEPTANCE IS FAITHFULNESS: the cast is RECOVERABLE from the drawing —
// every point, every tuple with its word and polarity, nothing for the
// unrecorded, no derived arrows. Pinned here by RECOVERING it and comparing.
// The drawing is pinned by BEHAVIOUR (rendered to a string under node) and the
// mount by SOURCE.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const { readCastFile } = req('src/lib/castLoader.ts');
const { insideOf, insideCensusLine } = req('src/lib/castInside.ts');
const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);
const J = (x) => JSON.stringify(x);

console.log('THE INSIDE — a cast drawn as it is held: points, arcs by side, loops, numbered tuple-nodes, badges in words, nothing for the unrecorded (C-7a)\n');

const tri = cast('triangle.cast.json');
const sym = cast('triangle-symmetric.cast.json');
const tcell = cast('t-cell.cast.json');
const flow = cast('flow.cast.json');
const phi = cast('phi.cast.json');
const insides = { triangle: insideOf(tri), 'triangle-symmetric': insideOf(sym), 't-cell': insideOf(tcell), flow: insideOf(flow), phi: insideOf(phi) };
for (const [name, ins] of Object.entries(insides)) note(`${name.padEnd(19)} ${insideCensusLine(ins.census)}`);

// ═══ §1 THE SEAL — the researcher's census reproduced by the second implementation ═══
check('§1 ★★ THE SEAL: triangle `3 points · 3 arrows · 0 loops · 0 hyper · 0 neg · 1 word · 0 marks`',
  insideCensusLine(insides.triangle.census) === '3 points · 3 arrows · 0 loops · 0 hyper · 0 neg · 1 word · 0 marks');
check('§1 ★★ THE SEAL: the symmetric triangle `3 points · 6 arrows` (every arc reversed — six drawn arcs, three down and three up)',
  insides['triangle-symmetric'].census.points === 3 && insides['triangle-symmetric'].census.arrows === 6 &&
    insides['triangle-symmetric'].arcs.filter((a) => a.side === 'down').length === 3 && insides['triangle-symmetric'].arcs.filter((a) => a.side === 'up').length === 3);
check('§1 ★★ THE SEAL: t-cell `10 points · 10 arrows · 0 loops · 1 hyper · 3 neg · 6 words · 10 marks` — the one hyper is `removes(r8, r3, r2)` with its legs NUMBERED in the tuple\'s own order',
  insideCensusLine(insides['t-cell'].census) === '10 points · 10 arrows · 0 loops · 1 hyper · 3 neg · 6 words · 10 marks' &&
    insides['t-cell'].nodes.length === 1 && insides['t-cell'].nodes[0].type === 'removes' && J(insides['t-cell'].nodes[0].legs.map((i) => insides['t-cell'].points[i].id)) === '["r8","r3","r2"]',
  insideCensusLine(insides['t-cell'].census));
check('§1 ★★ THE SEAL: flow `14 points · 31 arrows · 3 loops · 0 hyper · 0 neg · 11 words · 14 marks` — the loops named: disjoins at F4 · sustains at F5 · sustains at F7 (⚠ 48 across both homes = 34 tuples + 14 marks, the designer\'s measure; not the stale "34 · 6")',
  insideCensusLine(insides.flow.census) === '14 points · 31 arrows · 3 loops · 0 hyper · 0 neg · 11 words · 14 marks' &&
    J(insides.flow.loops.map((l) => `${l.type}@${insides.flow.points[l.at].id}`)) === '["disjoins@F4","sustains@F5","sustains@F7"]' && insides.flow.arcs.length + insides.flow.loops.length + insides.flow.census.marks === 48,
  insideCensusLine(insides.flow.census));
check('§1 ★★ THE SEAL: phi `9 points · 15 arrows · 7 loops · 0 hyper · 0 neg · 14 words · 9 marks` — six loops on Φ1 and one on Φ7 (descends-from); Φ9\'s badge reads `none-by-nature`, the mold\'s',
  insideCensusLine(insides.phi.census) === '9 points · 15 arrows · 7 loops · 0 hyper · 0 neg · 14 words · 9 marks' &&
    insides.phi.loops.filter((l) => insides.phi.points[l.at].id === 'Φ1').length === 6 && J(insides.phi.loops.filter((l) => insides.phi.points[l.at].id === 'Φ7').map((l) => l.type)) === '["descends-from"]' &&
    J(insides.phi.points.find((p) => p.id === 'Φ9').badges) === '[{"key":"member_status","value":"none-by-nature","mold":true,"home":"roles"}]',
  insideCensusLine(insides.phi.census));
check('§1 ★ THE THREE NEGATIVES ARE THREE DRAWN ARCS (does-not-hold is a VALUE, never an absence): the T cell\'s `sustains(r8, r0)` · `sustains(r6, r0)` · `starts(r5, r1)` are arcs with polarity does-not-hold — present in the presentation, distinct from the unrecorded, which has no arc',
  J(insides['t-cell'].arcs.filter((a) => a.polarity === 'does-not-hold').map((a) => `${a.type}(${insides['t-cell'].points[a.from].id}, ${insides['t-cell'].points[a.to].id})`)) === '["sustains(r8, r0)","sustains(r6, r0)","starts(r5, r1)"]');

// ═══ §2 THE SIDE is a function of the tuple; the caster's order; FAITHFULNESS ═══
console.log('\n----- §2 the side is the tuple\'s; the order is the caster\'s; the cast is recoverable from the drawing -----');
check('§2 ★★ THE SIDE IS A FUNCTION OF THE TUPLE, not a choice: on every fixture every arc reads `down` iff its first term comes before its second in the caster\'s order (the symmetric triangle\'s reversed pairs sit one on each side)',
  Object.values(insides).every((ins) => ins.arcs.every((a) => a.side === (a.from < a.to ? 'down' : 'up'))) &&
    (() => { const s = insides['triangle-symmetric']; const xy = s.arcs.find((a) => s.points[a.from].id === 'x' && s.points[a.to].id === 'y'); const yx = s.arcs.find((a) => s.points[a.from].id === 'y' && s.points[a.to].id === 'x'); return xy && yx && xy.side === 'down' && yx.side === 'up'; })());
note(`flow: ${insides.flow.arcs.filter((a) => a.side === 'down').length} arcs down the caster's order · ${insides.flow.arcs.filter((a) => a.side === 'up').length} up · phi: ${insides.phi.arcs.filter((a) => a.side === 'down').length} down · ${insides.phi.arcs.filter((a) => a.side === 'up').length} up`);
check('§2 ★★ THE CASTER\'S OWN ORDER, and the id as an ADDRESS: Flow\'s points are F1 … F14 in the file\'s order with no label (every point an address); the T cell\'s labels are empty strings and read as addresses too; the triangle\'s x · y · z',
  J(insides.flow.points.map((p) => p.id)) === J(flow.roles.map((r) => r.id)) && insides.flow.points.every((p) => p.label === null) && insides['t-cell'].points.every((p) => p.label === null) && J(insides.triangle.points.map((p) => p.id)) === '["x","y","z"]');
// FAITHFULNESS — recover the cast from the presentation and compare with the record
const recover = (ins) => {
  const roles = ins.points.map((p) => ({ id: p.id, label: p.label, types: Object.fromEntries(p.badges.filter((b) => b.home === 'roles').map((b) => [b.key, b.value])) }));
  const relations = [];
  for (const a of ins.arcs) relations.push(`${a.type}|${J([ins.points[a.from].id, ins.points[a.to].id])}|${a.polarity}`);
  for (const l of ins.loops) relations.push(`${l.type}|${J([ins.points[l.at].id, ins.points[l.at].id])}|${l.polarity}`);
  for (const n of ins.nodes) relations.push(`${n.type}|${J(n.legs.map((i) => ins.points[i].id))}|${n.polarity}`);
  for (const p of ins.points) for (const b of p.badges.filter((bb) => bb.home === 'signature')) relations.push(`${b.key}|${J([p.id])}|${b.value}`);
  for (const u of ins.unplaced) relations.push(`${u.type}|${J(u.terms)}|${u.polarity}`);
  return { roles, relations: relations.sort() };
};
const recordOfCast = (c) => ({
  roles: c.roles.map((r) => ({ id: r.id, label: r.label && r.label.length ? r.label : null, types: { ...(r.types ?? {}) } })),
  relations: [...new Set(c.relations.map((r) => `${r.type}|${J(r.terms)}|${r.polarity}`))].sort(),
});
const faithful = (c) => J(recover(insideOf(c))) === J(recordOfCast(c));
check('§2 ★★ FAITHFULNESS, THE ACCEPTANCE: the cast is RECOVERED from the presentation — points → roles with their badges as `types`, arcs + loops + tuple-nodes + signature badges → the relations as a set with word and polarity — and equals the record on every fixture (triangle · symmetric · t-cell · flow · phi · unrecorded · one-axiom)',
  ['triangle.cast.json', 'triangle-symmetric.cast.json', 't-cell.cast.json', 'flow.cast.json', 'phi.cast.json', 'unrecorded.cast.json', 'one-axiom.cast.json'].every((n) => faithful(cast(n))));
check('§2 ★★ NO DERIVED ARROWS and NOTHING FOR THE UNRECORDED: Flow\'s 2,156 binary places (14 × 14 × 11 words) hold 34 listed tuples, and the presentation draws exactly 34 (31 arcs + 3 loops) — no closure, no lattice, no transitivity, no orbit; the T cell\'s 11 tuples draw as 10 arcs + 1 node',
  14 * 14 * 11 === 2156 && insides.flow.arcs.length + insides.flow.loops.length === 34 && flow.relations.length === 34 && insides['t-cell'].arcs.length + insides['t-cell'].nodes.length === 11 && tcell.relations.length === 11);
check('§2 ★ THE FALSIFIER (LAW 24): a manufactured cast with r(x, y) and r(y, z) but NOT r(x, z) draws two arcs and no third — the transitive closure is not drawn; and the same cast with r(x, z) listed draws three',
  (() => {
    const two = readCastFile(J({ roles: ['x', 'y', 'z'], signature: [{ type: 'r', arity: 2 }], relations: [{ type: 'r', terms: ['x', 'y'], polarity: 'holds' }, { type: 'r', terms: ['y', 'z'], polarity: 'holds' }] })).cast;
    const three = readCastFile(J({ roles: ['x', 'y', 'z'], signature: [{ type: 'r', arity: 2 }], relations: [{ type: 'r', terms: ['x', 'y'], polarity: 'holds' }, { type: 'r', terms: ['y', 'z'], polarity: 'holds' }, { type: 'r', terms: ['x', 'z'], polarity: 'holds' }] })).cast;
    return insideOf(two).arcs.length === 2 && insideOf(three).arcs.length === 3;
  })());

// ═══ §3 what the type holds beyond tuples: badges, UNKNOWN where written, axioms and warrant carried, the unplaced ═══
console.log('\n----- §3 badges in words, UNKNOWN only where written, axioms and warrant as text, the unplaced carried -----');
check('§3 ★ THE BADGE IS THE VALUE IN WORDS, the mold\'s marked as the mold\'s: every Flow point carries `member_status = has` (mold: true, home: roles); an arity-1 type in the SIGNATURE is a badge carrying the tuple\'s polarity (home: signature); UNKNOWN appears only where the caster wrote it',
  (() => {
    const u = readCastFile(J({ roles: [{ id: 'a', types: { member_status: 'UNKNOWN', colour: 'red' } }, { id: 'b' }], signature: [{ type: 'p', arity: 1 }], relations: [{ type: 'p', terms: ['b'], polarity: 'does-not-hold' }] })).cast;
    const ins = insideOf(u);
    return insides.flow.points.every((p) => p.badges.length === 1 && p.badges[0].mold && p.badges[0].home === 'roles' && p.badges[0].value === 'has') &&
      J(ins.points[0].badges) === '[{"key":"member_status","value":"UNKNOWN","mold":true,"home":"roles"},{"key":"colour","value":"red","mold":false,"home":"roles"}]' &&
      J(ins.points[1].badges) === '[{"key":"p","value":"does-not-hold","mold":false,"home":"signature"}]' && ins.census.unknown === 1 && ins.census.marks === 2 && ins.census.negatives === 1 && ins.census.arrows === 0;
  })());
check('§3 ★ AXIOMS AND WARRANT ARE TEXT BESIDE, CARRIED — never arrows: one-axiom.cast.json presents its one sentence and no warrant; the T cell presents no axiom and a warrant carried; the triangle neither',
  J(insideOf(cast('one-axiom.cast.json')).axioms).length > 4 && insideOf(cast('one-axiom.cast.json')).axioms.length === 1 && insideOf(cast('one-axiom.cast.json')).warrantCarried === false &&
    insides['t-cell'].axioms.length === 0 && insides['t-cell'].warrantCarried === true && insides.triangle.axioms.length === 0 && insides.triangle.warrantCarried === false);
check('§3 ★ THE UNPLACED (a closure-broken cast, taken and marked by the loader): a tuple whose term is not among the roles is carried in its own list with the loader\'s own reason (`"throughput" is not among your roles`), never drawn as if it resolved and never erased; the placed tuples still draw; LAW 24 — the triangle has none',
  (() => {
    const ins = insideOf(cast('closure-broken.cast.json'));
    return ins.unplaced.length >= 1 && ins.unplaced.every((u) => /is not among your roles/.test(u.reason)) && ins.unplaced.some((u) => u.reason.includes('"throughput" is not among your roles')) &&
      ins.census.unplaced === ins.unplaced.length && insides.triangle.unplaced.length === 0 && faithful(cast('closure-broken.cast.json'));
  })());
check('§3 a repeated role or tuple is read ONCE (a role is one, a relation is a set) — redundant.cast.json presents each once; RECORD NOT READING: the presentation is re-derived from the held cast, nothing stored',
  (() => {
    const r = readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts/redundant.cast.json'), 'utf8'));
    if (!r.taken) return false;
    const ins = insideOf(r.cast);
    return ins.points.length === new Set(ins.points.map((p) => p.id)).size && ins.arcs.length + ins.loops.length + ins.nodes.length === new Set(r.cast.relations.map((x) => `${x.type}|${J(x.terms)}`)).size && faithful(r.cast);
  })());

// ═══ §4 THE DRAWING, by behaviour — rendered to a string under node ═══
console.log('\n----- §4 the drawing: points, arcs with their word and side, the ¬ glyph, loops, the numbered legs, badges, the two absences -----');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { CastInsideDiagram, CastInsidePanel } = req('src/components/CastInsideDiagram.tsx');
const render = (el) => renderToString(el).replace(/<!-- -->/g, '');
const unescapeHtml = (s) => (s ?? '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
const attrsOf = (html, name) => [...html.matchAll(new RegExp(`${name}="([^"]*)"`, 'g'))].map((m) => unescapeHtml(m[1]));
const countOf = (html, name) => (html.match(new RegExp(`${name}="`, 'g')) || []).length;
const textsOf = (html, name) => [...html.matchAll(new RegExp(`${name}="[^"]*"[^>]*>([^<]*)<`, 'g'))].map((m) => unescapeHtml(m[1]));
const visibleText = (html) => unescapeHtml(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const drawFlow = render(React.createElement(CastInsideDiagram, { inside: insides.flow, id: 'flow' }));
const drawT = render(React.createElement(CastInsideDiagram, { inside: insides['t-cell'], id: 't' }));
const drawPhi = render(React.createElement(CastInsideDiagram, { inside: insides.phi, id: 'phi' }));
check('§4 ★★ FLOW DRAWN: 14 points, 31 arcs, 3 loops, 0 tuple-nodes; every arc carries its word at the apex and its side; the 14 badges read `member_status=has` and are marked the mold\'s; every point marked an ADDRESS (no caster label)',
  countOf(drawFlow, 'data-inside-point') === 14 && countOf(drawFlow, 'data-inside-arc') === 31 && countOf(drawFlow, 'data-inside-loop') === 3 && countOf(drawFlow, 'data-inside-node') === 0 &&
    J(textsOf(drawFlow, 'data-inside-arc-word')) === J(insides.flow.arcs.map((a) => a.type)) && attrsOf(drawFlow, 'data-inside-arc').every((v, i) => v.endsWith(`|${insides.flow.arcs[i].side}`)) &&
    attrsOf(drawFlow, 'data-inside-badge').length === 14 && attrsOf(drawFlow, 'data-inside-badge').every((b) => b === 'member_status=has') && countOf(drawFlow, 'data-inside-mold') === 14 && countOf(drawFlow, 'data-inside-address') === 14,
  `${countOf(drawFlow, 'data-inside-point')} · ${countOf(drawFlow, 'data-inside-arc')} · ${countOf(drawFlow, 'data-inside-loop')} · badges ${attrsOf(drawFlow, 'data-inside-badge').length}`);
check('§4 ★★ THE T CELL DRAWN: 10 points, 10 arcs, ONE tuple-node `removes|r8,r3,r2|holds` with legs numbered 1 · 2 · 3 in the tuple\'s order; the three negatives wear the `¬` glyph on their word (`¬ sustains` · `¬ sustains` · `¬ starts`) and the dashed stroke — the seven positive words carry no glyph',
  countOf(drawT, 'data-inside-point') === 10 && countOf(drawT, 'data-inside-arc') === 10 && J(attrsOf(drawT, 'data-inside-node')) === '["removes|r8,r3,r2|holds"]' && J(attrsOf(drawT, 'data-inside-leg')) === '["1","2","3"]' &&
    J(textsOf(drawT, 'data-inside-arc-word').filter((w) => w.startsWith('¬ '))) === '["¬ sustains","¬ sustains","¬ starts"]' && textsOf(drawT, 'data-inside-arc-word').filter((w) => !w.startsWith('¬')).length === 7 && (drawT.match(/stroke-dasharray="4 3"/g) || []).length === 3,
  J(attrsOf(drawT, 'data-inside-node')));
check('§4 ★★ Φ DRAWN: six loops at Φ1 (six rings; their words ONCE in one row in the same order: descends-from · disjoins · displaces · exceeds-in-power · inverts · presupposes) and one at Φ7; Φ9\'s badge `member_status=none-by-nature`',
  attrsOf(drawPhi, 'data-inside-loop').filter((v) => v.split('|')[1] === 'Φ1').length === 6 && J(attrsOf(drawPhi, 'data-inside-loop').filter((v) => v.split('|')[1] === 'Φ1').map((v) => v.split('|')[0])) === '["descends-from","disjoins","displaces","exceeds-in-power","inverts","presupposes"]' &&
    attrsOf(drawPhi, 'data-inside-loop').filter((v) => v.split('|')[1] === 'Φ7').length === 1 && attrsOf(drawPhi, 'data-inside-badge').includes('member_status=none-by-nature') &&
    textsOf(drawPhi, 'data-inside-loop-words').length === 2 && textsOf(drawPhi, 'data-inside-loop-words')[0] === 'descends-from · disjoins · displaces · exceeds-in-power · inverts · presupposes' && textsOf(drawPhi, 'data-inside-loop-words')[1] === 'descends-from');
check('§4 ★ THE WORD RIDES ITS OWN ARC: every arc word is a textPath on that arc\'s own path (31 on Flow, each `href` naming an `id` that exists once in the drawing) — a word on its own curve cannot pile on another\'s (found at the eye)',
  (() => {
    const hrefs = attrsOf(drawFlow, 'href').filter((h) => h.startsWith('#'));
    const ids = attrsOf(drawFlow, 'id');
    return hrefs.length === 31 && hrefs.every((h) => ids.filter((i) => `#${i}` === h).length === 1) && (drawFlow.match(/<textPath /g) || []).length === 31;
  })());
check('§4 ★ THE DRAWING DERIVES NOTHING: the number of drawn arcs + loops + nodes equals the listed tuples on every fixture, and NO count is printed as text on the canvas (the column\'s card reads the counts; the census rides only as attributes)',
  [['flow', drawFlow], ['t-cell', drawT], ['phi', drawPhi]].every(([n, html]) => countOf(html, 'data-inside-arc') + countOf(html, 'data-inside-loop') + countOf(html, 'data-inside-node') === insides[n].arcs.length + insides[n].loops.length + insides[n].nodes.length) &&
    !/\b\d+ (points|arrows|loops|marks|words)\b/.test(visibleText(drawFlow)) && attrsOf(drawFlow, 'data-inside-arrows')[0] === '31');
check('§4 ★ POSITIONS CARRY NOTHING: the points are laid top to bottom in the caster\'s order (F1 first, F14 last), no sort of the device\'s anywhere in the module or the drawing',
  attrsOf(drawFlow, 'data-inside-point')[0] === 'F1' && attrsOf(drawFlow, 'data-inside-point')[13] === 'F14' && !/\.sort\(/.test(readLf('src/lib/castInside.ts')) && !/\.sort\(/.test(readLf('src/components/CastInsideDiagram.tsx')));
// the two absences, through the panel
const { useGeometryStore } = req('src/store/geometryStore.ts');
const seedState = useGeometryStore.getState();
const seed = seedState.shapes[seedState.currentShapeId];
const cornerA = seed.edges[0].vertexIds[0];
const withCast = (c) => ({ ...seed, vertices: { ...seed.vertices, [cornerA]: { ...seed.vertices[cornerA], data: { ...seed.vertices[cornerA].data, cast: c } } } });
const none = render(React.createElement(CastInsidePanel, { shape: seed, vertexId: cornerA }));
const nothing = render(React.createElement(CastInsidePanel, { shape: withCast(cast('nothing.cast.json')), vertexId: cornerA }));
const some = render(React.createElement(CastInsidePanel, { shape: withCast(tri), vertexId: cornerA }));
check('§4 ★★ THE TWO ABSENCES: a corner with NO cast renders NOTHING (the empty string — no panel, no frame); a cast of nothing renders the card\'s own sentence `a cast of nothing — no roles` and NO column; a cast renders the diagram under the corner\'s label in the person\'s register (`A`)',
  none === '' && countOf(nothing, 'data-inside-nothing') === 1 && textsOf(nothing, 'data-inside-nothing')[0] === 'a cast of nothing — no roles' && countOf(nothing, 'data-inside-point') === 0 &&
    countOf(some, 'data-inside-panel') === 1 && countOf(some, 'data-inside-point') === 3 && visibleText(some).includes('A · the inside of the cast it holds'),
  J({ none, nothing: nothing.slice(0, 200) }));
check('§4 ★ THE SUBJECT MATTER rides the header when held (`of: …`, the T cell\'s), absent otherwise (the triangle\'s)',
  visibleText(render(React.createElement(CastInsidePanel, { shape: withCast(tcell), vertexId: cornerA }))).includes('of: the T cell of the first face') && !visibleText(some).includes('of:'));

// ═══ §5 THE MOUNT and the boundaries, source-pinned ═══
console.log('\n----- §5 the siting on the canvas; the boundaries -----');
const ws = readLf('src/components/Workspace3D.tsx');
const lib = readLf('src/lib/castInside.ts');
const comp = readLf('src/components/CastInsideDiagram.tsx');
check('§5 ★★ SITED ON THE CANVAS, NOT THE INSPECTOR COLUMN (the designer\'s ruling): Workspace3D mounts the concept layer\'s chooser `ConceptSurface` for the selected vertex beside the R3F canvas (an overlay in the canvas frame, visible from every sidebar tab), and the chooser delegates a corner to `CastInsidePanel` (C-7b: an ambo midpoint whose parents both hold a cast takes the unfolding instead); Panels.tsx mounts no inside',
  ws.includes("import { ConceptSurface } from './MidpointSurface';") && /\{selectedVertexId \? <ConceptSurface shape=\{shape\} vertexId=\{selectedVertexId\} \/> : null\}/.test(ws) && !readLf('src/components/Panels.tsx').includes('CastInsidePanel') &&
    /return <CastInsidePanel shape=\{shape\} vertexId=\{vertexId\} \/>;/.test(readLf('src/components/MidpointSurface.tsx')));
check('§5 ⛔ THE MODULE IS PURE OVER A CAST: castInside.ts imports only the type and the mold predicate from the loader; the drawing imports no store (it reads props and acts on nothing), nothing from manuscript, explore, three or the camera; no cast is written anywhere here',
  /import type \{ ConceptSpace \} from '\.\.\/types\/geometry';/.test(lib) && lib.includes("import { isMoldType } from './castLoader';") && (lib.match(/^import /gm) || []).length === 2 &&
    !/useGeometryStore|from '\.\.\/store|from '\.\.\/manuscript|explore|from 'three'|@react-three/.test(comp) && !/updateSelected|\.cast\s*=/.test(comp + lib));
check('§5 the words of the retired offering are NOT in this surface (Δ80 — never candidates, never a ranking, never a proposal): no `offer`, `weight`, `candidate`, `proposed`, `tied`, `reading` in the drawing\'s text',
  !/offer|weight|candidate|propos|tied|orbit/i.test(visibleText(drawFlow) + visibleText(drawT) + visibleText(some)));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-INSIDE: ALL PASS — the cast is drawn as it is held and recoverable from the drawing; the side is the tuple\'s; nothing for the unrecorded; sited on the canvas' : `DIAGNOSE-THE-INSIDE: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
