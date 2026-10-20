#!/usr/bin/env node
'use strict';
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// SINCE THIS LIFT — ADR 0031 §9.61 at the record (rider 2 after release 2.1; the designer's form of 10-19 16:15; the mothership's STAMP of 10-20 11:09)
//
// A lifted form is a record of the residue as it stood at the lift. The lift is an act of the log (D17) and the shelf item carries what was lifted and
// at what stage; an act on the seed after it is SINCE THE LIFT and the form's card says so by count and on demand: `since this lift, on the seed: 1
// relating on A–B · show · lift again`. `lift again` lifts the same region as the seed stands now — a new form, the old one a record. THE INSTRUMENT
// SHARES THE CLAIM'S TYPE SYSTEM: the store's lift, the reader and the card are RUN under node on the eye's own casts.
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const React = require('react');
const { renderToString } = require('react-dom/server');
const { readCastFile } = req('src/lib/castLoader.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const { liftedConceptOf } = req('src/manuscript/liftedConceptModel.ts');
const { sinceLiftOf, liftEntryOf } = req('src/manuscript/sinceLiftModel.ts');
const { LiftedConceptSection } = req('src/manuscript/LiftedConceptSection.tsx');
const { relatingsHeld, AGAINST } = req('src/lib/relatings.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const unesc = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8');

console.log('SINCE THIS LIFT — a lifted form is a record of the residue as it stood at the lift; what moved on the seed since is marked by count and on demand (ADR 0031 §9.61)\n');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
let seeded = createSeedShape('tetrahedron');
for (const [label, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', phi]]) seeded = withCast(seeded, byLabel(seeded, label), c);
useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, log: [] });
S().applyAmboDissectionToCurrent();
const seedId = cur().id;
const E = (X, Y) => edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y));
// a relating `x w y` with x a role of X and y a role of Y, given in the edge's own orientation (the record's first corner first; read the other way round where X is the second)
const relate = (X, Y, w, x, y, sign = '+') => { const e = E(X, Y); const first = e.vertexIds[0] === byLabel(cur(), X); const r = first ? S().giveRelating(e.id, w, x, y, sign) : S().giveRelating(e.id, w, y, x, sign, AGAINST); if (r) throw new Error(`the relating ${x} ${w} ${y} on ${X}–${Y} was refused: ${JSON.stringify(r)}`); return r; };
const unrelate = (X, Y, w, x, y) => { const e = E(X, Y); const first = e.vertexIds[0] === byLabel(cur(), X); return first ? S().withdrawRelating(e.id, w, x, y) : S().withdrawRelating(e.id, w, y, x, AGAINST); };
// the place as the line says it: the edge's corners in the record's own order
const place = (X, Y) => { const e = E(X, Y); const l = (v) => cur().vertices[v].data.label; return `on ${l(e.vertexIds[0])}–${l(e.vertexIds[1])}`; };
S().declareMode('carries'); S().declareMode('sustains'); S().declareMode('resists');
relate('A', 'B', 'sustains', 'F2', 'r4'); // held by the form: given BEFORE the lift (B's cast is the t-cell: r0 … r9)
const residueAt = (label) => cur().cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(byLabel(cur(), label)) && c.vertexIds.length === 4).id;
S().selectShape(seedId); S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection();
S().selectCell(residueAt('A'));
const q0 = useLiftStore.getState().queue.length; const n0 = S().log.length;
const title1 = S().liftSelectionToManuscript();
const item1 = useLiftStore.getState().queue[q0];
const origin1 = item1.lift;
const seed = () => S().shapes[seedId];
const since1 = () => sinceLiftOf(S().log, origin1, seed());
const AB = place('A', 'B'); const AC = place('A', 'C');

// ═══ §1 THE LIFT IS AN ACT OF THE LOG; THE SHELF ITEM CARRIES WHAT WAS LIFTED ═══
check('§1 ★★ THE LIFT IS AN ACT OF THE LOG (D17): the lift appends one entry `lift` naming the seed, the selections (the residue at A, a cell) and the form\'s title; the shelf item carries the same as its ORIGIN with the entry\'s stage; `liftEntryOf` finds it',
  S().log.length === n0 + 1 && S().log[n0].act === 'lift' && S().log[n0].shape === seedId && S().log[n0].selections.length === 1 && S().log[n0].selections[0].kind === 'cell' && S().log[n0].title === title1
    && !!origin1 && origin1.shapeId === seedId && origin1.stage === S().log[n0].n && origin1.title === title1 && J(origin1.selections) === J(S().log[n0].selections) && liftEntryOf(S().log, origin1) === S().log[n0],
  { entry: S().log[n0] && { act: S().log[n0].act, n: S().log[n0].n, title: S().log[n0].title }, origin: origin1 });
check('§1 ★★ NOTHING MOVED, NO LINE: right after the lift the reader says null — the ordinary is not marked',
  since1() === null);

// ═══ §2 THE MARK — by kind and by place, zero parts not printed, `show` as he said it ═══
relate('A', 'B', 'carries', 'F6', 'r3');
const s2a = since1();
check(`§2 ★★ ONE RELATING SINCE: \`F6 carries r3\` given on the seed's A–B after the lift — the line reads \`since this lift, on the seed: 1 relating ${AB}\` (the place in the record's own corner order); \`show\` lists \`${AB}: F6 carries r3\``,
  !!s2a && s2a.line === `since this lift, on the seed: 1 relating ${AB}` && J(s2a.list) === J([`${AB}: F6 carries r3`]), s2a);
relate('A', 'B', 'resists', 'F9', 'r5', '-');
relate('A', 'C', 'carries', 'F6', 'Φ1');
const s2b = since1();
check(`§2 ★★ BY KIND AND BY PLACE: a bar on A–B and a relating on A–C added — \`1 relating ${AB}, 1 ${AC} · 1 bar ${AB}\` (the kind said once, then the places; a bar its own kind); the list names each with its place as he said it, the bar \`· barred\``,
  !!s2b && s2b.line === `since this lift, on the seed: 1 relating ${AB}, 1 ${AC} · 1 bar ${AB}` && s2b.list.includes(`${AB}: F9 resists r5 · barred`) && s2b.list.includes(`${AC}: F6 carries Φ1`) && s2b.items.length === 3, s2b);
unrelate('A', 'B', 'sustains', 'F2', 'r4'); // a relating the FORM HOLDS, withdrawn on the seed
const s2c = since1();
check(`§2 ★★ WITHDRAWN IS ITS OWN KIND: \`F2 sustains r4\`, held by the form (given before the lift), withdrawn on the seed — \`… · 1 withdrawn ${AB}\`; the list: \`withdrawn ${AB}: F2 sustains r4\``,
  !!s2c && s2c.line.endsWith(`· 1 withdrawn ${AB}`) && s2c.list.includes(`withdrawn ${AB}: F2 sustains r4`), s2c && { line: s2c.line, list: s2c.list });
unrelate('A', 'B', 'carries', 'F6', 'r3'); // given since the lift, then withdrawn: its LATEST act
const s2d = since1();
check(`§2 ★★ AN ITEM COUNTS BY ITS LATEST ACT (the ADR's falsifier: "withdraw that relating on the seed: the first form's mark reads one withdrawn since"): \`F6 carries r3\`, given since the lift and withdrawn again, reads \`withdrawn\`, not a relating — \`1 relating ${AC} · 1 bar ${AB} · 2 withdrawn ${AB}\``,
  !!s2d && s2d.line === `since this lift, on the seed: 1 relating ${AC} · 1 bar ${AB} · 2 withdrawn ${AB}` && s2d.list.includes(`withdrawn ${AB}: F6 carries r3`), s2d && s2d.line);

// ═══ §3 THE OTHER KINDS, on the log's own entries (an answer, a name; a lexicon act is not the seed's) ═══
const siteAB = byLabel(cur(), 'AB');
const synthetic = [...S().log,
  { n: S().log.length + 1, act: 'loopsay', shape: seedId, site: siteAB, loop: 'L1', start: 'F1', way: 'a', route: 'R1', answer: 'carries', was: null },
  { n: S().log.length + 2, act: 'rolename', shape: seedId, site: siteAB, role: 'carries|F6|Φ1', name: 'the yield', was: '' },
  { n: S().log.length + 3, act: 'rule', added: [['carries', 'carries', 'carries']], removed: [] },
  { n: S().log.length + 4, act: 'loopsay', shape: 'another-shape', site: siteAB, loop: 'L1', start: 'F1', way: 'a', route: 'R1', answer: 'owes', was: null }];
const s3 = sinceLiftOf(synthetic, origin1, seed());
check('§3 ★★ A LOOP\'S ANSWER AND A NAME at the seed\'s site count in their kinds (`1 answer at AB · 1 name at AB`); a rule is an act on the lexicon, not on the seed, and an answer on another shape is not the seed\'s — neither counts',
  !!s3 && s3.line.endsWith(`· 1 answer at AB · 1 name at AB · 2 withdrawn ${AB}`) && s3.list.includes('at AB: a way of a loop comes to carries') && s3.list.includes('at AB: the name “the yield” for a role') && s3.items.length === s2d.items.length + 2, s3 && s3.line);

// ═══ §4 LIFT AGAIN — the same region as the seed stands now; the old form a record ═══
const q1 = useLiftStore.getState().queue.length; const n1 = S().log.length;
const again = S().liftAgain(origin1);
const item2 = useLiftStore.getState().queue[q1];
const origin2 = item2 && item2.lift;
const concept1 = liftedConceptOf(placeShelfEntry(loadUniverseSnapshot(item1.file), 0), loadUniverseSnapshot(item1.file).loaded.ancestors ?? []);
const concept2 = liftedConceptOf(placeShelfEntry(loadUniverseSnapshot(item2.file), 1), loadUniverseSnapshot(item2.file).loaded.ancestors ?? []);
const heldAC = (record) => { const e = edgeBetween(record.edges, byLabel(record, 'A'), byLabel(record, 'C')); return relatingsHeld(e).map((r) => r[0] + '|' + r[1] + '|' + r[2]); };
check('§4 ★★ LIFT AGAIN: the same selections of the same seed lifted as it stands now — one more item on the shelf with its own origin at a later stage (a new `lift` entry), the title returned; the new form\'s carried record holds the relating given since (`F6 carries Φ1` on A–C), the old form\'s does not; the new form has no mark, the old form keeps its line',
  !!again && 'title' in again && useLiftStore.getState().queue.length === q1 + 1 && S().log.length === n1 + 1 && S().log[n1].act === 'lift' && !!origin2 && origin2.stage === S().log[n1].n && origin2.stage > origin1.stage
    && concept2.state === 'read' && concept1.state === 'read' && heldAC(concept2.record).some((k) => /^carries\|F6\|Φ1$|^carries\|Φ1\|F6$/.test(k)) && !heldAC(concept1.record).some((k) => /^carries\|F6\|Φ1$|^carries\|Φ1\|F6$/.test(k))
    && sinceLiftOf(S().log, origin2, seed()) === null && sinceLiftOf(S().log, origin1, seed()).line === s2d.line,
  { again, origin2, newHolds: heldAC(concept2.record), oldHolds: heldAC(concept1.record) });
check('§4 ★★ REFUSED BY NAME: a lift again of a seed not in the universe is refused (`not lifted — the seed this form was lifted from is not in the universe`); a selection the seed no longer holds is refused with the lift\'s own reason',
  'refusal' in S().liftAgain({ ...origin1, shapeId: 'no-such-shape' }) && S().liftAgain({ ...origin1, shapeId: 'no-such-shape' }).refusal === 'not lifted — the seed this form was lifted from is not in the universe'
    && 'refusal' in S().liftAgain({ ...origin1, selections: [{ kind: 'cell', id: 'cell:none' }] }) && /^not lifted — /.test(S().liftAgain({ ...origin1, selections: [{ kind: 'cell', id: 'cell:none' }] }).refusal),
  { gone: S().liftAgain({ ...origin1, shapeId: 'no-such-shape' }), noCell: S().liftAgain({ ...origin1, selections: [{ kind: 'cell', id: 'cell:none' }] }) });

// ═══ §5 THE GUARD: the log must be the lift's ═══
check('§5 ★★ NOT THIS UNIVERSE, NOTHING SAID: against a log whose entry at the lift\'s stage is not a lift of this seed (another universe\'s log), or a seed not in the universe, the reader says null — never a count against the wrong log',
  sinceLiftOf(S().log.map((e) => (e.n === origin1.stage ? { ...e, shape: 'other' } : e)), origin1, seed()) === null && sinceLiftOf(S().log, origin1, null) === null && sinceLiftOf([], origin1, seed()) === null);

// ═══ §6 THE CARD — the line, `show`, `lift again`; no line when nothing moved ═══
const paper = { cardBackground: '#fff', cardBorder: '#ccc', cardInk: '#222' };
const html1 = unesc(renderToString(React.createElement(LiftedConceptSection, { concept: concept1, pick: null, onPick: () => {}, paper, since: sinceLiftOf(S().log, origin1, seed()), onLiftAgain: () => {}, liftAgainNotice: null })));
const html2 = unesc(renderToString(React.createElement(LiftedConceptSection, { concept: concept2, pick: null, onPick: () => {}, paper, since: null, onLiftAgain: () => {}, liftAgainNotice: 'lifted again — “x” is on the shelf' })));
check('§6 ★★ THE CARD SAYS IT: the first form\'s card carries `data-lifted-since` with the line, a `show` and a `lift again`; the second form\'s card (nothing moved) carries no line and no `lift again`, and its notice line alone',
  /data-lifted-since/.test(html1) && html1.includes(s2d.line) && /data-lifted-since-show[^>]*>show</.test(html1) && /data-lifted-lift-again[^>]*>lift again</.test(html1)
    && !/data-lifted-since=/.test(html2) && !/data-lifted-lift-again=/.test(html2) && /data-lifted-lift-again-notice[^>]*>lifted again — “x” is on the shelf</.test(html2),
  { first: (html1.match(/data-lifted-since[^>]*>[^<]{0,120}/g) || []).slice(0, 2), second: (html2.match(/data-lifted-lift-again-notice[^>]*>[^<]{0,80}/g) || []) });

// ═══ §7 BY CONSTRUCTION ═══
const gs = src('src/store/geometryStore.ts'); const ps = src('src/manuscript/pageStore.ts'); const pf = src('src/manuscript/pageSnapshot.ts'); const mv = src('src/manuscript/ManuscriptView.tsx'); const ew = src('src/manuscript/ExploreWindow.tsx'); const st = src('src/lib/stage.ts');
check('§7 ★★ BY CONSTRUCTION: the store\'s lift appends the `lift` entry and hands the origin to the shelf; `liftAgain` is the store\'s; the page store records `shelfLifts` by the loaded shape id and the page file carries them (additive); the view hands the card and the room their `since` from the one reader; the room\'s `lift again` closes the room first',
  /act: 'lift', shape: shape\.id, selections:/.test(gs) && (gs.match(/lift: \{ shapeId: shape\.id, selections:/g) || []).length === 2 && /liftAgain: \(origin\) => \{/.test(gs)
    && /\| \{ n: number; act: 'lift'; shape: string; selections: LiftSelection\[\]; title: string \}/.test(st)
    && /recordShelfLift: \(shapeId, origin\) => set\(\(s\) => \(\{ shelfLifts: new Map\(s\.shelfLifts\)\.set\(shapeId, origin\) \}\)\)/.test(ps) && /shelfLifts: \[\.\.\.s\.shelfLifts\.entries\(\)\]/.test(ps) && /shelfLifts\?: Array<\[string, LiftOrigin\]>/.test(pf)
    && /if \(item\.lift\) recordShelfLift\(entry\.loaded\.shape\.id, item\.lift\);/.test(mv) && /sinceLiftOf\(universeLog, liftedOrigin, universeShapes\[liftedOrigin\.shapeId\] \?\? null\)/.test(mv) && /since=\{liftedSince\}/.test(mv) && /since=\{exploreRoom\.since \?\? null\}/.test(mv)
    && /data-explore-since/.test(ew) && /onClick=\{\(\) => \{ onClose\(\); onLiftAgain\?\.\(\); \}\}/.test(ew));

console.log(`\n${failures === 0 ? 'DIAGNOSE-SINCE-THIS-LIFT: ALL PASS — the lift is an act of the log; what moved on the seed since is marked by kind and place, listed on demand, and lifted again by his hand' : `DIAGNOSE-SINCE-THIS-LIFT: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
