#!/usr/bin/env node
// THE CROSSING BY HAND — the researcher's reproduction of the coder's F-D19c measurement (the mothership's 2026-10-06 23:55),
// reading the FROZEN module's output shape directly, never the coder's reader (identificationImageModel.ts computes `seam.crossed`;
// this probe does not call it for the ground — it is printed beside, as a second column, for transparency only).
//
// THE CLAIM UNDER TEST (sealed before the run):
//   on the single-face word path, with both slots walked forward and both edges stored in the slot's order (s_A = s_B = +1):
//     `preserving` (the band, abcB)  ⇒ the corner pairing CROSSES the stored ends:  first(a) ~ second(b), second(a) ~ first(b)
//     `reversing`  (the twist, abcb) ⇒ the corner pairing runs PARALLEL:            first(a) ~ first(b),  second(a) ~ second(b)
//   and, by D13 alone (direction positional in the record), a directed relating from each edge's first stored corner meets its
//   counterpart RUN THE OTHER WAY exactly where the pairing crosses — a discordance unless the word is symmetric or has a converse.
// SEALED: band crossed = true · twist crossed = false · band → discordance · twist → one relating (same word) · 0 departures.
//
// Run: node .handoff/instruments/connection_layer_reference/the_crossing_by_hand.cjs

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const req = (p) => require(path.join(repoRoot, p));
const J = (x) => JSON.stringify(x);

const CI = req('src/lib/complexIdentification.ts');
const { loadUniverseSnapshot } = req('src/manuscript/genesisModel.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { childSpaceOf } = req('src/lib/instanceSpace.ts');
const I = req('src/manuscript/identificationImageModel.ts'); // the coder's reader — second column only
const REL = req('src/lib/relatings.ts');

let failures = 0;
const seal = (name, ok, detail) => { console.log(`${ok ? 'HELD' : 'FIRED'} - ${name}${detail !== undefined ? ` — ${detail}` : ''}`); if (!ok) failures += 1; };

const page = JSON.parse(fs.readFileSync(path.join(repoRoot, '.handoff/REPORTS_CUSTOMER-SIDE_2026-09-28/saves/ta/saves/manuscript_torus_word.page.json'), 'utf8'));
const entry = loadUniverseSnapshot(page.shelfFiles[0]);
const record = entry.loaded.ancestors[0];
const lifted = page.written[0].form;
const lab = (v) => record.vertices[v]?.data.label || v;

const sq = lifted.shape.faces[0]; const n = sq.vertexIds.length;
const slotEdge = (s) => edgeBetween(lifted.shape.edges, sq.vertexIds[s], sq.vertexIds[(s + 1) % n]);
const eA = slotEdge(0); const eB = slotEdge(2);
const recEdge = (e) => record.edges.find((x) => x.id === e.id);
const storedA = recEdge(eA).vertexIds; const storedB = recEdge(eB).vertexIds;
const slotA = [sq.vertexIds[0], sq.vertexIds[1]]; const slotB = [sq.vertexIds[2], sq.vertexIds[3]];
const sA = storedA[0] === slotA[0] ? 1 : -1; const sB = storedB[0] === slotB[0] ? 1 : -1;
console.log(`THE FIXTURE: the lifted square ${sq.vertexIds.map(lab).join(' · ')}`);
console.log(`  a = slot 0: ${slotA.map(lab).join('→')} · stored ${storedA.map(lab).join(',')} · s_A = ${sA}`);
console.log(`  b = slot 2: ${slotB.map(lab).join('→')} · stored ${storedB.map(lab).join(',')} · s_B = ${sB}`);
seal('the fixture is the sealed case: both edges stored in their slot order (s_A = s_B = +1)', sA === 1 && sB === 1, J([sA, sB]));

// the merged classes, read off the frozen module's OUTPUT SHAPE: a minted vertex carries its members as sourceVertexIds
const classesOf = (shape) => {
  const classes = [];
  for (const v of Object.values(shape.vertices)) {
    const members = (v.createdBy && v.createdBy.sourceVertexIds) || [];
    if (members.length > 1) classes.push([...members].sort());
  }
  return classes;
};
const sameClass = (classes, x, y) => classes.some((c) => c.includes(x) && c.includes(y));

const [vS, vC] = storedA; const [vT, vM] = storedB;
const results = {};
for (const mode of ['preserving', 'reversing']) {
  const out = CI.identify(lifted.shape, [eA.id], [eB.id], mode);
  const classes = classesOf(out.shape);
  const firstFirst = sameClass(classes, vS, vT); const firstSecond = sameClass(classes, vS, vM);
  const secondSecond = sameClass(classes, vC, vM); const secondFirst = sameClass(classes, vC, vT);
  const crossed = firstSecond && secondFirst && !firstFirst && !secondSecond;
  const parallel = firstFirst && secondSecond && !firstSecond && !secondFirst;
  results[mode] = { via: out.via, classes: classes.map((c) => c.map(lab)), crossed, parallel };
  console.log(`\n${mode.toUpperCase()} (${out.via}): classes ${J(results[mode].classes)} → ${crossed ? 'CROSSED (first~second, second~first)' : parallel ? 'PARALLEL (first~first, second~second)' : 'NEITHER'}`);
}
seal('the band (preserving, abcB) — the corner pairing CROSSES the stored ends', results.preserving.crossed === true, J(results.preserving));
seal('the twist (reversing, abcb) — the corner pairing runs PARALLEL to the stored ends', results.reversing.parallel === true, J(results.reversing));

// D13 by hand: a directed relating from each edge's first stored corner — `s1 carries c1` on a, `t1 carries m1` on b — read through the pairing
const roleAt = (v) => { const s = childSpaceOf(record, v); return s && s.roles[0] ? s.roles[0].id : null; };
const s1 = roleAt(vS); const c1 = roleAt(vC); const t1 = roleAt(vT); const m1 = roleAt(vM);
const byHand = (crossed) => {
  // the pairing as a map from a's corners to b's: crossed sends first→second, parallel sends first→first
  const pair = crossed ? { [s1]: m1, [c1]: t1 } : { [s1]: t1, [c1]: m1 };
  const imageOfA = ['carries', pair[s1], pair[c1]]; // `s1 carries c1` carried to b's roles
  const counterpart = ['carries', t1, m1]; // what b holds, in b's stored order
  const aligned = imageOfA[1] === counterpart[1] && imageOfA[2] === counterpart[2];
  const reversed = imageOfA[1] === counterpart[2] && imageOfA[2] === counterpart[1];
  return { imageOfA, counterpart, reading: aligned ? 'ONE RELATING' : reversed ? 'DISCORDANCE OF DIRECTION (the counterpart runs the other way)' : 'no counterpart' };
};
const handBand = byHand(results.preserving.crossed); const handTwist = byHand(!results.reversing.parallel);
console.log(`\nBY HAND (D13 alone, no reader): band → ${handBand.reading} ${J([handBand.imageOfA, handBand.counterpart])}`);
console.log(`BY HAND (D13 alone, no reader): twist → ${handTwist.reading} ${J([handTwist.imageOfA, handTwist.counterpart])}`);
seal('by D13 alone, the crossing makes the discordance: band → discordance of direction, twist → one relating', /DISCORDANCE/.test(handBand.reading) && handTwist.reading === 'ONE RELATING');

// the second column — the coder's reader, for transparency (NOT the ground)
const oriented = (edge, from, x, to, y, mode) => (edge.vertexIds[0] === from ? REL.relating(mode, x, y, '+', REL.ALONG) : REL.relating(mode, y, x, '+', REL.ALONG));
const withOn = (shape, edge, r) => ({ ...shape, edges: shape.edges.map((e) => (e.id === edge.id ? REL.withRelating(e, r) : e)) });
let rec = record;
rec = withOn(rec, recEdge(eA), oriented(recEdge(eA), vS, s1, vC, c1, 'carries'));
rec = withOn(rec, recEdge(eB), oriented(recEdge(eB), vT, t1, vM, m1, 'carries'));
const twoActs = (r, img, pairs) => { let standing = []; for (const [i, x, y] of pairs) { const a = I.seamActAt(r, img.seams[0], standing, i, x, y); if (!a.taken) return null; standing = a.transports; } return standing; };
const column = (mode, crossed) => {
  const shape = CI.identify(lifted.shape, [eA.id], [eB.id], mode).shape;
  const form = { shape, opId: mode === 'preserving' ? 'glue-cylinder' : 'flip-glue-mobius', provenance: mode, parentShape: lifted.shape };
  const img0 = I.identificationImageOf(form, rec, []);
  if (img0.state !== 'identified') return { state: img0.state };
  const pairs = crossed ? [[0, s1, m1], [1, c1, t1]] : [[0, s1, t1], [1, c1, m1]];
  const acts = twoActs(rec, img0, pairs);
  if (!acts) return { act: 'refused' };
  const img = I.identificationImageOf(form, rec, [{ formId: shape.id, seam: 0, transports: acts }]);
  return { readerCrossed: img.seams[0].crossed, joined: img.media[0].joined, discordances: img.media[0].discordances.map((d) => d.kind) };
};
const colBand = column('preserving', results.preserving.crossed); const colTwist = column('reversing', !results.reversing.parallel);
console.log(`\nTHE CODER'S READER (second column): band ${J(colBand)} · twist ${J(colTwist)}`);
seal('the coder\'s reader agrees with the hand reading (agreement noted, not the ground)', colBand.readerCrossed === true && colBand.discordances.length === 1 && colBand.joined === 0 && colTwist.readerCrossed === false && colTwist.discordances.length === 0 && colTwist.joined === 1, J([colBand, colTwist]));

// ═══ §2 THE GENERAL PATH — the same label under two storages ═══
// Two disjoint triangles P (p0→p1→p2) and Q (q0→q1→q2), direct-readable (unique endpoint keys, no parallels, no self-loops), so
// `identify` takes identifyOnComplex. Edge a = p0–p1 stored ALONG P's cycle ([p0,p1], s_A = +1). Edge b = q0–q1 stored once ALONG Q's
// cycle ([q0,q1], s_B = +1) and once AGAINST it ([q1,q0], s_B = −1). Each edge is FREE (one wedge), so its canonical wedge is its slot.
// SEALED (from the module's own code, lines 598–608: preserving = tail~head in WEDGE terms, reversing = tail~tail):
//   b along   (s_A = s_B): preserving CROSSES the stored ends (p0~q1, p1~q0) · reversing PARALLEL (p0~q0, p1~q1)
//   b against (s_A ≠ s_B): preserving PARALLEL in the stored ends (p0~q1 = first of a ~ first stored of b) · reversing CROSSES
//   ⇒ the same label crosses under one storage and runs parallel under the other: no label predicts the crossing; the pairing does.
console.log('\n----- §2 the general path: two triangles, the identified edge stored along and against its face cycle -----');
const mkV = (id, pos) => ({ id, position: pos, data: { label: id, notes: '', color: '#000', tags: [], custom: {} }, createdBy: { shapeId: 'two-tri', operation: 'seed', sourceVertexIds: [] } });
const mkE = (id, u, v) => ({ id, vertexIds: [u, v], createdBy: { shapeId: 'two-tri', operation: 'seed', sourceVertexIds: [] } });
const mkF = (id, ids) => ({ id, vertexIds: ids, createdBy: { shapeId: 'two-tri', operation: 'seed', sourceVertexIds: [] } });
const twoTriangles = (bStored) => ({
  id: 'two-tri', name: 'two triangles',
  vertices: { p0: mkV('p0', [0, 0, 0]), p1: mkV('p1', [1, 0, 0]), p2: mkV('p2', [0, 1, 0]), q0: mkV('q0', [5, 0, 0]), q1: mkV('q1', [6, 0, 0]), q2: mkV('q2', [5, 1, 0]) },
  edges: [mkE('a', 'p0', 'p1'), mkE('p12', 'p1', 'p2'), mkE('p20', 'p2', 'p0'), mkE('b', bStored[0], bStored[1]), mkE('q12', 'q1', 'q2'), mkE('q20', 'q2', 'q0')],
  faces: [mkF('P', ['p0', 'p1', 'p2']), mkF('Q', ['q0', 'q1', 'q2'])],
  cells: [], generations: [], genealogy: { parentShapeId: null },
});
const general = {};
for (const [storage, bStored] of [['along', ['q0', 'q1']], ['against', ['q1', 'q0']]]) {
  general[storage] = {};
  for (const mode of ['preserving', 'reversing']) {
    let out;
    try { out = CI.identify(twoTriangles(bStored), ['a'], ['b'], mode); } catch (e) { general[storage][mode] = { error: String(e.message).slice(0, 200) }; continue; }
    const classes = classesOf(out.shape);
    const [bFirst, bSecond] = bStored;
    const crossed = sameClass(classes, 'p0', bSecond) && sameClass(classes, 'p1', bFirst) && !sameClass(classes, 'p0', bFirst);
    const parallel = sameClass(classes, 'p0', bFirst) && sameClass(classes, 'p1', bSecond) && !sameClass(classes, 'p0', bSecond);
    general[storage][mode] = { via: out.via, classes, crossed, parallel };
    console.log(`  b stored ${storage} (${J(bStored)}) · ${mode} (${out.via}): classes ${J(classes)} → ${crossed ? 'CROSSED' : parallel ? 'PARALLEL' : 'NEITHER'}`);
  }
}
const g = general;
seal('§2 b ALONG its cycle (s_A = s_B): preserving CROSSES the stored ends, reversing runs PARALLEL — the polygon path\'s tie, reproduced on the general path', !!g.along.preserving.crossed && !!g.along.reversing.parallel, J(g.along));
seal('§2 b AGAINST its cycle (s_A ≠ s_B): preserving runs PARALLEL in the stored ends, reversing CROSSES — the SAME LABELS, the opposite crossing', !!g.against.preserving.parallel && !!g.against.reversing.crossed, J(g.against));
seal('§2 both arms took the general path (via identifyOnComplex, not the committed word)', ['along', 'against'].every((s) => ['preserving', 'reversing'].every((m) => g[s][m].via && g[s][m].via !== 'committed-word')), J([g.along.preserving.via, g.against.reversing.via]));

console.log(`\nTHE CROSSING BY HAND: ${failures === 0 ? 'ALL SEALS HELD' : `${failures} SEAL(S) FIRED`}`);
process.exit(failures === 0 ? 0 : 1);
