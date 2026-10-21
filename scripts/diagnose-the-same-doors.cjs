#!/usr/bin/env node
'use strict';
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// LIFT AGAIN WITH THE SAME DOORS — ADR 0031 §9.61's open question, Arman's "b" (Δ208; the designer's form of 10-19 16:15; the mothership's 10-20 11:09, rider 2)
//
// The old form's doors — the faces he paired, the map he picked, the pairs he took — applied to a new lift of the same region and glued, what it carried said; a
// pair that no longer stands on the record refused by name at its door, the rest carried. The carry is by the ADDRESSES the lift keeps (a lift carries the seed's
// own faces and corners with their ids — §2 measures the same face id on both forms), said by the names as they stand on the new form, and every pair is
// replayed through the door's own act on the new form's record. THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the lift, the door's act,
// `carryDoors` and the glue are RUN under node on the eye's own casts (the cargo witness's lawful path).
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
const A = req('src/manuscript/apertureModel.ts');
const D = req('src/manuscript/doorTransportModel.ts');
const { carryDoors } = req('src/manuscript/sameDoorsModel.ts');
const { LiftedConceptSection } = req('src/manuscript/LiftedConceptSection.tsx');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const unesc = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8');

console.log("LIFT AGAIN WITH THE SAME DOORS — the old form's doors on a new lift, by their names, each pair replayed; what was carried said, what fell refused by name (Δ208)\n");

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
const G1 = cur().id;
const give = (X, Y, map) => { const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y)); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
const take = (X, Y, x, y) => { const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y)); if (e.vertexIds[0] === byLabel(cur(), X)) S().withdrawRolePair(e.id, x, y); else S().withdrawRolePair(e.id, y, x); };
// the cargo witness's lawful path: F1's line closes round the hinge door by his pairings
give('A', 'B', { F1: 'r0', F5: 'r2', F7: 'r8' });
give('A', 'C', { F1: 'Φ1', F7: 'Φ3' });
give('A', 'D', { F1: 'Φ1' });
give('B', 'C', { r0: 'Φ1' });
give('B', 'D', { r0: 'Φ1' });
S().selectShape(G1); S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection();
const residueAt = (label) => cur().cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(byLabel(cur(), label)) && c.vertexIds.length === 4).id;
S().selectCell(residueAt('A'));
const q0 = useLiftStore.getState().queue.length;
S().liftSelectionToManuscript();
const item1 = useLiftStore.getState().queue[q0];
const entry1 = loadUniverseSnapshot(item1.file);
const form1 = placeShelfEntry(entry1, 0);
const record1 = liftedConceptOf(form1, entry1.loaded.ancestors ?? []).record;
const lab = (shape) => (v) => shape.vertices[v.replace(/^c\d+:/, '')]?.data.label || v;
// the first form's door, as the door arm builds it: A·AC·AB ~ A·AB·AD on the hinge map, F1 ↦ F1 taken at A (the whole line with it)
const menu1 = A.boundaryFacesOf(form1.shape);
const faceWith = (menu, set) => menu.find((m) => { const t = m.label.split(' · ')[0].split('·'); return t.length === set.length && set.every((x) => t.includes(x)); });
const fA = faceWith(menu1, ['A', 'AB', 'AC']); const fB = faceWith(menu1, ['A', 'AB', 'AD']);
const cands = A.dihedralMapCandidates(form1.shape, fA.id, fB.id);
const L1 = lab(form1.shape);
const hinge = cands.find((c) => c.correspondence.every(([a, b]) => L1(a) === L1(b) || (L1(a) === 'AC' && L1(b) === 'AD')));
const cycleA = hinge.correspondence.map(([a]) => a.replace(/^c\d+:/, '')); const cycleB = hinge.correspondence.map(([, b]) => b.replace(/^c\d+:/, ''));
const memo = new Map();
const SA = D.sideOf(record1, cycleA, memo, fA.label.split(' · ')[0]); const SB = D.sideOf(record1, cycleB, memo, fB.label.split(' · ')[0]);
const act = D.actAt(SA.side, SB.side, [], 0, 'F1', 'F1');
const rows1 = [{ faceA: fA.id, faceB: fB.id, candidateKey: hinge.key, transports: act.transports }, { faceA: null, faceB: null, candidateKey: null }];
const verdict1 = A.buildPersonDomainVerdict(form1.shape, rows1, 'built-1', 'built 3-manifold 1');
check('§1 ★★ THE FIRST FORM AND ITS DOOR (the cargo witness\'s path): the gen-1 residue at A lifted; the hinge door A·AC·AB ~ A·AB·AD on the preserving map, F1 ↦ F1 taken at A with its whole line; glued into a room',
  act.taken === true && act.transports.length >= 1 && !verdict1.folded && verdict1.domain, { taken: act.taken, transports: act.transports.length, folded: verdict1.folded });

// ═══ §2 THE SEED MOVES; THE SAME REGION LIFTED AGAIN; THE DOORS CARRIED BY THEIR NAMES ═══
S().declareMode('carries');
const eAB = edgeBetween(cur().edges, byLabel(cur(), 'A'), byLabel(cur(), 'B'));
S().giveRelating(eAB.id, 'carries', eAB.vertexIds[0] === byLabel(cur(), 'A') ? 'F6' : 'r3', eAB.vertexIds[0] === byLabel(cur(), 'A') ? 'r3' : 'F6', '+');
const again = S().liftAgain(item1.lift);
const item2 = useLiftStore.getState().queue[useLiftStore.getState().queue.length - 1];
const entry2 = loadUniverseSnapshot(item2.file);
const form2 = placeShelfEntry(entry2, 1);
const record2 = liftedConceptOf(form2, entry2.loaded.ancestors ?? []).record;
const same = carryDoors(form1.shape, rows1, record1, form2.shape, record2);
const nameOn = (form, id) => A.faceReferenceName(form.shape, form.shape.faces.find((f) => f.id === id.replace(/^c\d+:/, '')));
check('§2 ★★ THE SAME DOORS ON THE NEW LIFT: a relating given on the seed after the first lift, the same region lifted again — a NEW form (its own shape id) whose faces are the seed\'s own, with their ids (the MEASURED premise: the same face id on both forms), so the door is found again by its face\'s ADDRESS and its map by the corners\' addresses, and SAID by the faces\' names as they stand on the new form; the pair taken is replayed through the door\'s act on the new record and stands; the words: `glued with the same doors: a (A·AC·AB with A·AB·AD, preserving) · F1 ≡ F1`',
  'title' in again && form2.shape.id !== form1.shape.id && same.rows.length === rows1.length && same.carried.length === 1 && same.refused.length === 0 && same.carried[0].pairs.length === 1 && same.carried[0].pairs[0] === 'F1 ≡ F1' && same.carried[0].mode === 'preserving'
    && same.rows[0].faceA === rows1[0].faceA && same.rows[0].faceB === rows1[0].faceB && nameOn(form2, same.rows[0].faceA) === 'A·AC·AB' && nameOn(form2, same.rows[0].faceB) === 'A·AB·AD'
    && same.rows[0].candidateKey !== null && (same.rows[0].transports || []).length >= 1 && same.words === 'glued with the same doors: a (A·AC·AB with A·AB·AD, preserving) · F1 ≡ F1',
  { again, ids: [form1.shape.id, form2.shape.id], carried: same.carried, refused: same.refused, words: same.words, faces: [same.rows[0].faceA, same.rows[0].faceB], sameAddress: same.rows[0].faceA === rows1[0].faceA, key: same.rows[0].candidateKey });
const verdict2 = A.buildPersonDomainVerdict(form2.shape, same.rows, 'built-2', 'built 3-manifold 2');
check('§2 ★★ GLUED: the carried rows glue the new form into a room (the S² gate sound), as the first form\'s did', !verdict2.folded && !!verdict2.domain, { folded: verdict2.folded });
check('§2 ★ A FORM WITH NO DOORS CARRIES NONE: against an old panel of open rows alone the carry is empty and says so — `glued with the same doors: none`',
  carryDoors(form1.shape, [{ faceA: null, faceB: null, candidateKey: null }], record1, form2.shape, record2).words === 'glued with the same doors: none');

// ═══ §3 A PAIR THAT NO LONGER STANDS: refused by name at its door, the door carried ═══
take('A', 'D', 'F1', 'Φ1'); // F1's line round the door rested on it
const again3 = S().liftAgain(item1.lift);
const item3 = useLiftStore.getState().queue[useLiftStore.getState().queue.length - 1];
const entry3 = loadUniverseSnapshot(item3.file);
const form3 = placeShelfEntry(entry3, 2);
const record3 = liftedConceptOf(form3, entry3.loaded.ancestors ?? []).record;
const same3 = carryDoors(form1.shape, rows1, record1, form3.shape, record3);
check('§3 ★★ REFUSED BY NAME, THE REST CARRIED: `F1 ≡ Φ1` on A–D withdrawn on the seed, the same region lifted again — the door (its faces and map) is carried, and the pair F1 ↦ F1, whose line rested on that pairing, is refused by name at the door: `not taken — door a: F1 ≡ F1 no longer stands on the seed`; the glue still takes the door',
  'title' in again3 && same3.carried.length === 1 && same3.carried[0].pairs.length === 0 && same3.refused.length === 1 && same3.refused[0] === 'not taken — door a: F1 ≡ F1 no longer stands on the seed' && same3.words === 'glued with the same doors: a (A·AC·AB with A·AB·AD, preserving) · not taken — door a: F1 ≡ F1 no longer stands on the seed' && !A.buildPersonDomainVerdict(form3.shape, same3.rows, 'built-3', 'built 3-manifold 3').folded,
  { carried: same3.carried, refused: same3.refused, words: same3.words });

// ═══ §4 THE CARD OFFERS IT WHERE THE FORM HAS A ROOM ═══
const paper = { cardBackground: '#fff', cardBorder: '#ccc', cardInk: '#222' };
const concept1 = liftedConceptOf(form1, entry1.loaded.ancestors ?? []);
const since = { items: [{ kind: 'relating', place: 'on A–B', words: 'F6 carries r3' }], line: 'since this lift, on the seed: 1 relating on A–B', list: ['on A–B: F6 carries r3'] };
const withDoors = unesc(renderToString(React.createElement(LiftedConceptSection, { concept: concept1, pick: null, onPick: () => {}, paper, since, onLiftAgain: () => {}, onLiftAgainDoors: () => {}, liftAgainNotice: null })));
const without = unesc(renderToString(React.createElement(LiftedConceptSection, { concept: concept1, pick: null, onPick: () => {}, paper, since, onLiftAgain: () => {}, liftAgainNotice: null })));
check('§4 ★★ THE CARD: with a glued room the since-line offers `lift again with the same doors` beside `lift again` (its own gesture, its own button); without one, `lift again` alone',
  /data-lifted-lift-again-doors[^>]*>\s*lift again with the same doors/.test(withDoors) && /data-lifted-lift-again[ =>]/.test(withDoors) && !/data-lifted-lift-again-doors/.test(without) && /data-lifted-lift-again[ =>]/.test(without));

// ═══ §5 BY CONSTRUCTION ═══
const sm = src('src/manuscript/sameDoorsModel.ts'); const mv = src('src/manuscript/ManuscriptView.tsx'); const ew = src('src/manuscript/ExploreWindow.tsx');
check('§5 ★★ BY CONSTRUCTION: the carry finds a door by the face\'s address the lift keeps (`strip(m.id) === strip(oldId)`) and its map by the corners\' addresses (`samePairs` on the stripped ids), compares no composed name for identity (the 08-22 ruling), replays each pair through `actAt` on the new record, and refuses by name; the view lifts, waits for the shelf\'s drain, places beside the old form, glues through the same verdict door and records the room; the room\'s head offers the gesture too and closes first',
  /menu\.find\(\(m\) => strip\(m\.id\) === strip\(oldId\)\)/.test(sm) && /samePairs\(c\.correspondence\.map\(\(\[a, b\]\) => \[strip\(a\), strip\(b\)\]\), wanted\)/.test(sm) && !/(faceReferenceName|nameOf)\([^)]*\)\s*===/.test(sm) && !/=== (nameA|nameB|oldNameA|oldNameB|name)\b/.test(sm)
    && /const act = actAt\(A, B, standing, nc, x, y\);/.test(sm) && /no longer stands on the seed/.test(sm)
    && /const same = carryDoors\(oldForm\.form\.shape, oldBuilt\.rows, oldConcept\.record, form\.shape, concept\.record\);/.test(mv) && /buildPersonDomainVerdict\(form\.shape, same\.rows, `built-\$\{n\}`, `built 3-manifold \$\{n\}`\)/.test(mv) && /if \(idx < 0\) return; \/\/ the drain has not taken the lift yet/.test(mv)
    && /onLiftAgainDoors=\{roomLiftAgainDoors\}/.test(mv) && /data-explore-lift-again-doors onClick=\{\(\) => \{ onClose\(\); onLiftAgainDoors\(\); \}\}/.test(ew));

// ═══ §6 BY CONSTRUCTION — THE GESTURE'S EFFECT CANNOT STORM (measured at 0ec7c6c: `Maximum update depth exceeded` at `setSameDoorsPending(null)`, the Manuscript lost) ═══
const sameDoorsEffect = (mv.match(/useEffect\(\(\) => \{\s*const pending = sameDoorsRef\.current;[\s\S]*?\}, \[shelf, sameDoorsAsked,/) || [''])[0];
check('§6 ★★ BY CONSTRUCTION: the same-doors request is a REF (`sameDoorsRef`), read and cleared in the effect BEFORE its first write to the page store (`setWritten`, `setShelf`), so the SyncLane re-render the store\'s write forces cannot see the request still pending; the effect re-renders on a tick (`sameDoorsAsked`) and never on React state holding the request; it takes an UNPLACED shelf entry; no `sameDoorsPending` state remains',
  sameDoorsEffect.length > 0 && /const idx = shelf\.findIndex\(\(x\) => !x\.placed && x\.entry\.loaded\.shape\.id === pending\.shapeId\);/.test(sameDoorsEffect)
    && sameDoorsEffect.indexOf('sameDoorsRef.current = null;') > 0 && sameDoorsEffect.indexOf('sameDoorsRef.current = null;') < sameDoorsEffect.indexOf('setWritten(')
    && sameDoorsEffect.indexOf('setWritten(') < sameDoorsEffect.indexOf('setShelf(') && /sameDoorsRef\.current = \{ shapeId: loaded\.loaded\.shape\.id, oldKey, oldShapeId, home \};\s*setSameDoorsAsked\(\(k\) => k \+ 1\);/.test(mv)
    && !/sameDoorsPending/.test(mv) && /const sameDoorsRef = useRef</.test(mv),
  { effectFound: sameDoorsEffect.length > 0, clearedBeforeWrite: sameDoorsEffect.indexOf('sameDoorsRef.current = null;') < sameDoorsEffect.indexOf('setWritten('), statePendingRemains: /sameDoorsPending/.test(mv) });

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-SAME-DOORS: ALL PASS — the old form\'s doors ride a new lift by the addresses the lift keeps, said by name; what is carried is said, what fell is refused by name' : `DIAGNOSE-THE-SAME-DOORS: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
