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
// C-7f item 1 — the foot blocks: one <text> per point per side, its words as tspans naming their arc's ordinal; C-7g — the
// text's own x, y and anchor (its first line), and its positioned lines counted
const footRows = (html) => [...html.matchAll(/<text([^>]*)data-inside-foot-words="([^"]*)"([^>]*)>([\s\S]*?)<\/text>/g)].map((m) => {
  const attrs = m[1] + m[3];
  return { foot: unescapeHtml(m[2]), x: Number((attrs.match(/ x="([^"]*)"/) || [])[1]), y: Number((attrs.match(/ y="([^"]*)"/) || [])[1]), anchor: (attrs.match(/text-anchor="([^"]*)"/) || [])[1], lines: (m[4].match(/data-inside-line="/g) || []).length, words: [...m[4].matchAll(/data-inside-arc-word="(\d+)"[^>]*>([^<]*)</g)].map((w) => ({ i: Number(w[1]), text: unescapeHtml(w[2]) })) };
});
// the loops' block at a point: its lines counted
const loopLinesAt = (html, id) => { const m = html.match(new RegExp(`<text[^>]*data-inside-loop-words="${id.replace(/[^A-Za-z0-9_-]/g, '.')}"[^>]*>([\\s\\S]*?)</text>`)); return m ? (m[1].match(/data-inside-line="/g) || []).length : 0; };
// every <text> of a drawing with its attributes and inner markup
const textsAll = (html) => [...html.matchAll(/<text([^>]*)>([\s\S]*?)<\/text>/g)].map((m) => ({ attrs: m[1], inner: m[2], x: Number((m[1].match(/ x="([^"]*)"/) || [])[1]), anchor: (m[1].match(/text-anchor="([^"]*)"/) || [])[1] || 'start' }));
const innerText = (html, name) => [...html.matchAll(new RegExp(`<text[^>]*${name}="[^"]*"[^>]*>([\\s\\S]*?)</text>`, 'g'))].map((m) => unescapeHtml(m[1].replace(/<[^>]+>/g, '')));
const drawFlow = render(React.createElement(CastInsideDiagram, { inside: insides.flow, id: 'flow' }));
const drawT = render(React.createElement(CastInsideDiagram, { inside: insides['t-cell'], id: 't' }));
const drawPhi = render(React.createElement(CastInsideDiagram, { inside: insides.phi, id: 'phi' }));
check('§4 ★★ FLOW DRAWN: 14 points, 31 arcs, 3 loops, 0 tuple-nodes; every arc carries its word AT ITS FOOT — in the row of the point it LEAVES FROM, on its own side (C-7f item 1) — and its side; the 14 badges read `member_status=has` and are marked the mold\'s; every point marked an ADDRESS (no caster label)',
  countOf(drawFlow, 'data-inside-point') === 14 && countOf(drawFlow, 'data-inside-arc') === 31 && countOf(drawFlow, 'data-inside-loop') === 3 && countOf(drawFlow, 'data-inside-node') === 0 &&
    (() => { const all = footRows(drawFlow).flatMap((r) => r.words.map((w) => ({ ...w, foot: r.foot }))); return all.length === 31 && all.every((w) => { const a = insides.flow.arcs[w.i]; return a && w.text === a.type && w.foot === `${insides.flow.points[a.from].id}|${a.side}`; }); })() && attrsOf(drawFlow, 'data-inside-arc').every((v, i) => v.endsWith(`|${insides.flow.arcs[i].side}`)) &&
    attrsOf(drawFlow, 'data-inside-badge').length === 14 && attrsOf(drawFlow, 'data-inside-badge').every((b) => b === 'member_status=has') && countOf(drawFlow, 'data-inside-mold') === 14 && countOf(drawFlow, 'data-inside-address') === 14,
  `${countOf(drawFlow, 'data-inside-point')} · ${countOf(drawFlow, 'data-inside-arc')} · ${countOf(drawFlow, 'data-inside-loop')} · badges ${attrsOf(drawFlow, 'data-inside-badge').length}`);
check('§4 ★★ THE T CELL DRAWN: 10 points, 10 arcs, ONE tuple-node `removes|r8,r3,r2|holds` with legs numbered 1 · 2 · 3 in the tuple\'s order; the three negatives wear the `¬` glyph on their word (`¬ sustains` · `¬ sustains` · `¬ starts`) and the dashed stroke — the seven positive words carry no glyph',
  countOf(drawT, 'data-inside-point') === 10 && countOf(drawT, 'data-inside-arc') === 10 && J(attrsOf(drawT, 'data-inside-node')) === '["removes|r8,r3,r2|holds"]' && J(attrsOf(drawT, 'data-inside-leg')) === '["1","2","3"]' &&
    J(textsOf(drawT, 'data-inside-arc-word').filter((w) => w.startsWith('¬ ')).sort()) === '["¬ starts","¬ sustains","¬ sustains"]' && textsOf(drawT, 'data-inside-arc-word').filter((w) => !w.startsWith('¬')).length === 7 && (drawT.match(/stroke-dasharray="4 3"/g) || []).length === 3,
  J(attrsOf(drawT, 'data-inside-node')));
check('§4 ★★ Φ DRAWN: six loops at Φ1 (six rings leading their words\' block; the words ONCE, in the rings\' order, one row read through its lines: descends-from · disjoins · displaces · exceeds-in-power · inverts · presupposes) and one at Φ7; Φ9\'s badge `member_status=none-by-nature`',
  attrsOf(drawPhi, 'data-inside-loop').filter((v) => v.split('|')[1] === 'Φ1').length === 6 && J(attrsOf(drawPhi, 'data-inside-loop').filter((v) => v.split('|')[1] === 'Φ1').map((v) => v.split('|')[0])) === '["descends-from","disjoins","displaces","exceeds-in-power","inverts","presupposes"]' &&
    attrsOf(drawPhi, 'data-inside-loop').filter((v) => v.split('|')[1] === 'Φ7').length === 1 && attrsOf(drawPhi, 'data-inside-badge').includes('member_status=none-by-nature') &&
    innerText(drawPhi, 'data-inside-loop-words').length === 2 && innerText(drawPhi, 'data-inside-loop-words')[0] === 'descends-from · disjoins · displaces · exceeds-in-power · inverts · presupposes' && innerText(drawPhi, 'data-inside-loop-words')[1] === 'descends-from');
const circleAt = (html, id, attr) => Number((html.match(new RegExp(`data-inside-point="${id.replace(/[^A-Za-z0-9_-]/g, '.')}"[\\s\\S]*?<circle[^>]*${attr}="([^"]*)"`)) || [])[1]);
check('§4 ★★ THE WORD AT THE FOOT, RIGHT OF THE POINT (C-7f item 1 — a foot sits at a point and the points are the rows, so FEET cannot cluster as apexes did; C-7g item 1, the designer\'s second cut from her own law — only arity 2 is an arrow, arity 1 is a mark on the node — applied to WORDS: an up-foot end-anchored above the row line in the label lane read at the eye as a CAPTION of the role below it, `F4 · has · presupposes`): no textPath and no startOffset anywhere; every arc\'s word is a tspan in the foot block of the point it LEAVES FROM on its own side of the row line — the up-arcs\' block ABOVE it, its last line 3.5 px above; the down-arcs\' block BELOW it, its first line 11.5 px under, beneath the loops\' block when there is one (every baseline in the column a half-row apart — ONE GRID) — and EVERY block start-anchored 10 px RIGHT of the point, none end-anchored, none left of it; Flow\'s 31 words stand in its 14 rows (the blocks per side printed)',
  (() => {
    const rows = footRows(drawFlow);
    if ((drawFlow.match(/<textPath /g) || []).length || /startOffset/.test(drawFlow)) return false;
    note(`Flow's feet: ${rows.filter((r) => r.foot.endsWith('|down')).length} down blocks · ${rows.filter((r) => r.foot.endsWith('|up')).length} up blocks · words per block ${J(rows.map((r) => r.words.length))} · lines per block ${J(rows.map((r) => r.lines))}`);
    return rows.length > 0 && rows.every((r) => {
      const [id, side] = r.foot.split('|');
      const y = circleAt(drawFlow, id, 'cy'); const x = circleAt(drawFlow, id, 'cx');
      const y0 = side === 'up' ? y - 3.5 - 15 * (r.lines - 1) : y + 11.5 + 15 * loopLinesAt(drawFlow, id);
      return Number.isFinite(y) && Number.isFinite(x) && r.anchor === 'start' && Math.abs(r.x - (x + 10)) < 0.01 && Math.abs(r.y - y0) < 0.01 && r.lines >= 1;
    }) && rows.flatMap((r) => r.words).length === 31;
  })());
check('§4 ★★ THE LABEL LANE IS ARITY-1\'S (C-7g item 1): in Flow, the T cell and Φ every text LEFT of the point column (end-anchored) is a LABEL with its badges — a `data-inside-label` tspan, `data-inside-badge` tspans for the unary marks, never an arc word, never a loop word — and every arc-word and loop-word tspan sits in a start-anchored text at or right of cx + 10; the axiom and warrant lines beneath the column are the only other text on the left and carry no arc word',
  [drawFlow, drawT, drawPhi].every((html) => {
    const texts = textsAll(html);
    const left = texts.filter((t) => t.anchor === 'end');
    const wordy = texts.filter((t) => /data-inside-(arc|loop)-word=/.test(t.inner));
    const cx = circleAt(html, attrsOf(html, 'data-inside-point')[0], 'cx');
    return left.length === countOf(html, 'data-inside-point') && left.every((t) => /data-inside-label="true"/.test(t.inner) && !/data-inside-(arc|loop)-word=/.test(t.inner)) &&
      wordy.length > 0 && wordy.every((t) => t.anchor === 'start' && t.x >= cx + 10 - 0.01) && !texts.some((t) => /data-inside-(axiom|warrant|unplaced)=/.test(t.attrs) && /data-inside-arc-word=/.test(t.inner));
  }));
check('§4 ★★ THE WIDTH TAKES THE NEXT LINE (C-7g item 2, the designer\'s — the only option that bounds the width BY CONSTRUCTION; scroll and a narrower fold ruled out by her measurement): a manufactured point carrying eight down-arcs of twelve-letter words wraps into four positioned lines (`data-inside-line`), every word once, no line wider than WRAP (200) by the geometry\'s own estimate; the row GROWS by a line per wrapped line (the next point 75 px lower — 30 + 3 × 15, the line pitch HALF A ROW: the column\'s vertical grid one pitch throughout — where the unwrapped control with two short words keeps the 30 px pitch); the column\'s right reach is bounded at WRAP + 14 (the control\'s is its arcs\'); the arc\'s BULGE stays a function of the span in ROWS while its height is the grown rows\' (rx 74.4 for x → z8, a span of 8; its ry above the 120 an ungrown span of 8 would give); Φ1\'s six loop words wrap into lines led by the rings (printed), their innerText one row in the rings\' order',
  (() => {
    const { insideGeometry, WRAP } = req('src/components/CastInsideDiagram.tsx');
    const mk = (n, type) => readCastFile(J({ roles: ['x', ...Array.from({ length: 9 }, (_, i) => `z${i + 1}`)], signature: [{ type, arity: 2 }], relations: Array.from({ length: n }, (_, i) => ({ type, terms: ['x', `z${i + 1}`], polarity: 'holds' })) })).cast;
    const wide = insideOf(mk(8, 'abcdefghijkl'));
    const narrow = insideOf(mk(2, 'r'));
    const gw = insideGeometry(wide); const gn = insideGeometry(narrow);
    const hw = render(React.createElement(CastInsideDiagram, { inside: wide, id: 'wide' }));
    const rowsW = footRows(hw);
    const arcTo9 = (hw.match(/data-inside-arc="abcdefghijkl\|x\|z8\|holds\|down"[\s\S]*?<path[^>]*d="([^"]*)"/) || [])[1] || '';
    const dm = arcTo9.match(/A ([\d.]+) ([\d.]+) /);
    const phiLines = loopLinesAt(drawPhi, 'Φ1');
    note(`the wide point's block: ${rowsW[0] ? rowsW[0].lines : '?'} lines · pitch to the next point ${gw.yOf(1) - gw.yOf(0)} px (control ${gn.yOf(1) - gn.yOf(0)}) · right reach ${Math.round(gw.rightReach)} (WRAP ${WRAP}; control ${Math.round(gn.rightReach)}) · the span-8 arc's rx ${dm ? dm[1] : '?'} ry ${dm ? dm[2] : '?'} · Φ1's loop block ${phiLines} lines`);
    return WRAP === 200 && rowsW.length === 1 && rowsW[0].lines === 4 && rowsW[0].words.length === 8 && new Set(rowsW[0].words.map((w) => w.i)).size === 8 &&
      gw.yOf(1) - gw.yOf(0) === 75 && gn.yOf(1) - gn.yOf(0) === 30 && gw.rightReach <= WRAP + 14 && gn.rightReach < gw.rightReach &&
      dm && Math.abs(Number(dm[1]) - 8 * 15 * 0.62) < 0.01 && Number(dm[2]) > 120 && (hw.match(/<textPath /g) || []).length === 0 &&
      phiLines >= 2 && innerText(drawPhi, 'data-inside-loop-words')[0] === 'descends-from · disjoins · displaces · exceeds-in-power · inverts · presupposes';
  })());
check('§4 ★ THE BLIND METRIC\'S OWN CONTROL (C-8b rider 5 — a loosened metric that cannot be seen to fail is not yet a metric): the drive leg\'s box test, read from the driver\'s own source and run here on manufactured boxes — an overlap of 5 px COUNTS, an overlap of 0.6 px counts, a touch to a millionth of a pixel does NOT, an overlap of 0.4 px does not (the half-pixel threshold, measured at C-7g: 15 px boxes on a 15 px grid meet without colliding)',
  (() => {
    const driver = readLf('scripts/app-leg/concept_layer_eye_driver.py');
    const m = driver.match(/const inter = (\([^\n]*)\n/);
    if (!m) return false;
    const inter = new Function(`return ${m[1].replace(/;\s*$/, '')}`)();
    const box = (x, y, r, b) => ({ x, y, r, b });
    const overlap5 = inter(box(0, 0, 60, 15), box(55, 0, 120, 15));
    const overlapSmall = inter(box(0, 0, 60, 15), box(59.4, 0, 120, 15));
    const touch = inter(box(0, 0, 60, 15), box(0, 15.0000003, 60, 30.0000003));
    const under = inter(box(0, 0, 60, 15), box(59.6, 0, 120, 15));
    note(`the metric's control: overlap 5 px → ${overlap5} · overlap 0.6 px → ${overlapSmall} · a touch (3e-7 px) → ${touch} · overlap 0.4 px → ${under}`);
    return overlap5 === true && overlapSmall === true && touch === false && under === false;
  })());
check('§4 ★ THE DRAWING DERIVES NOTHING: the number of drawn arcs + loops + nodes equals the listed tuples on every fixture, and NO count is printed as text on the canvas (the column\'s card reads the counts; the census rides only as attributes)',
  [['flow', drawFlow], ['t-cell', drawT], ['phi', drawPhi]].every(([n, html]) => countOf(html, 'data-inside-arc') + countOf(html, 'data-inside-loop') + countOf(html, 'data-inside-node') === insides[n].arcs.length + insides[n].loops.length + insides[n].nodes.length) &&
    !/\b\d+ (points|arrows|loops|marks|words)\b/.test(visibleText(drawFlow)) && attrsOf(drawFlow, 'data-inside-arrows')[0] === '31');
check('§4 ★★ THE COVERING CURED (C-7d item 3, measured at the eye: 22 of 46 arcs passed under an opaque label rect): no `<rect` halo in any point group; every label, loop-row and arc word wears its GLYPH OUTLINE as its halo (`paint-order:stroke` with the ground colour) — an arc through the label lane stays visible between the letters',
  !/data-inside-point="[^"]*"[^>]*>\s*<rect/.test(drawFlow) && (drawFlow.match(/<rect/g) || []).length === 0 && (drawFlow.match(/<text /g) || []).length === (drawFlow.match(/paint-order:stroke/g) || []).length && (drawFlow.match(/paint-order:stroke/g) || []).length >= 14 &&
    /data-inside-label="true"/.test(drawFlow) && drawFlow.indexOf('paint-order:stroke;stroke:#0c0a09;stroke-width:3') > 0);
check('§4 ★ EVERY WORD ONCE, NEXT TO A THING IT IS ABOUT: across Flow, the T cell and Φ the arc-word tspans number exactly the arcs (31 · 10 · 15), no ordinal twice; the apex band carries no text',
  [['flow', drawFlow], ['t-cell', drawT], ['phi', drawPhi]].every(([n, html]) => { const ids = attrsOf(html, 'data-inside-arc-word'); return ids.length === insides[n].arcs.length && new Set(ids).size === ids.length; }));
check('§4 ★ THE SIZES (C-7f item 7, the designer\'s scale — three sizes, each with a job; the dense data UP from 10): the row 30 px; the labels 12 px; the arc, loop and node words and the leg numbers 11 px; NO 10 px or 9 px text in any drawing; `compact` RETIRED (item 6 — a source is whole, or words, never a thumbnail)',
  (() => {
    const { insideGeometry } = req('src/components/CastInsideDiagram.tsx');
    const sizes = (html) => [...html.matchAll(/font-size="(\d+)"/g)].map((m) => Number(m[1]));
    const all = [...sizes(drawFlow), ...sizes(drawT), ...sizes(drawPhi)];
    return insideGeometry(insides.flow).row === 30 && /font-size="12"[^>]*style="paint-order/.test(drawFlow) && /data-inside-foot-words="[^"]*"[^>]*font-size="11"[^>]*style="paint-order:stroke;stroke:#0c0a09;stroke-width:2\.5/.test(drawFlow) && all.length > 0 && all.every((s) => s === 12 || s === 11) && !/compact\?:|compact:|\{ compact|compact =/.test(readLf('src/components/CastInsideDiagram.tsx'));
  })());
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
    /<CastInsidePanel shape=\{shape\} vertexId=\{vertexId\} \/>/.test(readLf('src/components/MidpointSurface.tsx')));
check('§5 ⛔ THE MODULE IS PURE OVER A CAST: castInside.ts imports only the type and the mold predicate from the loader; the drawing imports no store (it reads props and acts on nothing), nothing from manuscript, explore, three or the camera; no cast is written anywhere here',
  /import type \{ ConceptSpace \} from '\.\.\/types\/geometry';/.test(lib) && lib.includes("import { isMoldType } from './castLoader';") && (lib.match(/^import /gm) || []).length === 2 &&
    !/useGeometryStore|from '\.\.\/store|from '\.\.\/manuscript|explore|from 'three'|@react-three/.test(comp) && !/updateSelected|\.cast\s*=/.test(comp + lib));
check('§5 the words of the retired offering are NOT in this surface (Δ80 — never candidates, never a ranking, never a proposal): no `offer`, `weight`, `candidate`, `proposed`, `tied`, `reading` in the drawing\'s text',
  !/offer|weight|candidate|propos|tied|orbit/i.test(visibleText(drawFlow) + visibleText(drawT) + visibleText(some)));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-INSIDE: ALL PASS — the cast is drawn as it is held and recoverable from the drawing; the side is the tuple\'s; nothing for the unrecorded; sited on the canvas' : `DIAGNOSE-THE-INSIDE: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
