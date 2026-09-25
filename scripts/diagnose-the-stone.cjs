#!/usr/bin/env node

// DIAGNOSTIC — THE STONE (STAMP C-12b, 2026-09-24; §145 + the §147 MARKER — Δ95 "i want the stone re-build before the final
// use"; ADR 0031 §3.10 + invariant 9's positive half; the researcher's §25 (the four runs) and §27 (`≡_X` IS IN THE SIGNATURE);
// the designer's 1939 (WORDS, not glyphs)). A born concept M⁺_AB carries, per opposite corner X of a triangular face holding
// its edge, the FOOT `foot_X = J_XB ∘ J_AX : A ⇀ B` — derived from the person's own two other pairings, each edge's J by its
// kind through C-9's one reader — as the relation `≡_X` on M's points: FIX (a loop) · MOV split into DISAGREEMENT and PROPOSAL
// (a link) · UND (silence); IN the signature, holds-only, composed at every read, stored nowhere; a proposal RECORD, never an
// offer. THE REFERENCE, cited not re-derived: the_stone_foot_runs.py + RESULTS_2026-09-24_the_stone_foot_runs.txt.
// src/lib/spaceOf.ts (feetOf · withFeet) is THE SECOND IMPLEMENTATION — a disagreement reopens the DEFINITION, never tunes.
//
// §1 R1–R3 on the 42 hand triples — the reference's numbers reproduced by a port of its `links` (R1 six distinct feet per J_FT,
//    control 0 · R2 non-loop = |MOV|, flat control 0 · R3 (a)(b)(c) 0, the EXCESS on 40 of 42 triples and 77 roles, the kinds
//    {UND 497 · PRO 46 · DIS 39 · FIX 6}, the per-triple histogram, the 1,000-random flat control 0).
// §2 R4 THE TOWER through the APP's resolver: the gen-0 feet at the three midpoints (307 non-loop links over the 42), the medial
//    triangle's feet at gen 2 (573) with medial ⇔ gen-0 per triple (0 disagreements), the corner triangle's feet all loops (0).
// §3 THE FEET IN THE SPACE at the eye's own state: the three states, the links on M's points, M's points and J_AB untouched,
//    holds-only, the counts moved by the feet alone, the `feet: false` control byte-as-before, one foot per distinct triangle.
// §4 THE CARRIERS: the lift (re-derived on the carried record), the next pushout (the parents' feet as FOREIGN words — the
//    lone-name bracket tells `≡_D [AB]` from `≡_D [AC]`; that generation's own feet derived afresh), the record check (refusalOf
//    equal with and without the feet over every pointed pair); the door's census and the cargo's K1–K7 are their own witnesses'.
// §5 THE SURFACE: the blocks under the own column in the designer's words and order, no control inside, no `[C]`/`C:` at the
//    head; the drawing free of foot glyphs (the census says what it left to the words); the manifest row; purity.
//
// ⛔ RECORD, NOT READING: nothing here stores a foot or a verdict; every reading is re-derived at the read.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const J = (x) => JSON.stringify(x);

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${cond ? '' : ` — ${detail ?? ''}`}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);

const { spaceOf, nameIn, isSeedVertex, spaceCounts, feetShareOf } = req('src/lib/spaceOf.ts');
const { refusalOf } = req('src/lib/jRegister.ts');
const { insideOf } = req('src/lib/castInside.ts');
const { footTypeName, isFootType, respectTypeName, isRespectType } = req('src/lib/feet.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const { liftedConceptOf } = req('src/manuscript/liftedConceptModel.ts');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const React = require('react');
const { renderToString } = require('react-dom/server');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json'); const triangle = cast('triangle.cast.json');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const reset = (seeded) => useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, liftSelection: [], selectedCellId: null, selectedVertexId: null, selectedEdgeId: null, selectedFaceId: null });
const give = (X, Y, map) => { const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y)); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
const inv = (m) => { const o = new Map(); for (const [k, v] of m) o.set(v, k); return o; };
const comp = (g, f) => { const o = new Map(); for (const [x, y] of f) if (g.has(y)) o.set(x, g.get(y)); return o; };
const toMap = (o) => new Map(Object.entries(o));
const nonloopOf = (foot) => foot.disagreement.length + foot.proposal.length;
const midpointOf = (shape, u, v) => Object.values(shape.vertices).find((w) => w.createdBy.operation !== 'seed' && w.createdBy.sourceVertexIds.length === 2 && w.createdBy.sourceVertexIds.includes(u) && w.createdBy.sourceVertexIds.includes(v));
const footAt = (shape, vertexId, cornerId) => (spaceOf(shape, vertexId)?.feet ?? []).find((f) => f.corner === cornerId) ?? null;

console.log('THE STONE — M⁺: the born concept carries its opposite corners\' FEET (C-12b)\n');

// ═══ §1 R1–R3 — the reference's runs on the 42 hand triples, by a port of its `links` ═══
console.log('----- §1 R1–R3 on the 42 hand triples (F = flow · T = t-cell · Φ = phi; the foot of Φ on F–T) — the reference reproduced -----');
// the 42 hand triples, verbatim from the researcher's born_face_reading.py (HAND_TF · HAND_TP · J_FP)
const HAND_TF = { A: { r9: 'F8', r1: 'F7', r0: 'F1', r2: 'F12', r8: 'F13' }, "B'": { r9: 'F3', r1: 'F9', r0: 'F5', r7: 'F13', r8: 'F1', r2: 'F7' }, C: { r9: 'F12', r1: 'F13', r0: 'F9', r6: 'F1', r2: 'F3' }, D: { r9: 'F12', r1: 'F1', r0: 'F2', r7: 'F7', r2: 'F5' }, S1: { r0: 'F13', r1: 'F9', r2: 'F1', r4: 'F12', r6: 'F3', r8: 'F7' }, S4: { r0: 'F13', r1: 'F9', r2: 'F1', r6: 'F3', r7: 'F5', r8: 'F7' }, S2: { r0: 'F9', r1: 'F3', r2: 'F13', r6: 'F10', r7: 'F5', r8: 'F12' } };
const HAND_TP = { P: { r0: 'Φ1', r1: 'Φ2', r2: 'Φ7', r4: 'Φ5', r6: 'Φ3' }, Q: { r9: 'Φ6', r1: 'Φ1', r0: 'Φ8', r7: 'Φ5', r6: 'Φ2' }, R: { r0: 'Φ1', r1: 'Φ6', r7: 'Φ5', r2: 'Φ7', r4: 'Φ8' } };
const J_FP = { '(i)': { F7: 'Φ1', F8: 'Φ2', F5: 'Φ7' }, '(ii)': { F1: 'Φ3', F2: 'Φ2', F3: 'Φ4', F5: 'Φ1' } };
const flowRoles = flow.roles.map((r) => r.id);
// the reference's `links`: role a of A → FIX | DIS | PRO | UND with the foot
const links = (J_AB, J_AX, J_XB, A_roles) => {
  const foot = comp(J_XB, J_AX);
  const L = new Map();
  for (const a of A_roles) {
    if (!foot.has(a)) L.set(a, ['UND', null]);
    else if (J_AB.get(a) === foot.get(a)) L.set(a, ['FIX', foot.get(a)]);
    else if (J_AB.has(a)) L.set(a, ['DIS', foot.get(a)]);
    else L.set(a, ['PRO', foot.get(a)]);
  }
  return { L, foot };
};
const nonloop = (L) => [...L].filter(([, [k]]) => k === 'DIS' || k === 'PRO').map(([a]) => a);
const bad = {}; const hit = {}; const bump = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
const feetByJFT = new Map(); const per = []; const kinds = {};
const triples = [];
for (const tf of Object.keys(HAND_TF)) for (const tp of Object.keys(HAND_TP)) for (const fp of Object.keys(J_FP)) triples.push({ tf, tp, fp });
for (const { tf, tp, fp } of triples) {
  const J_FT = inv(toMap(HAND_TF[tf])); const J_TP = toMap(HAND_TP[tp]); const J_PF = inv(toMap(J_FP[fp]));
  const { L, foot } = links(J_FT, inv(J_PF), inv(J_TP), flowRoles);
  const { foot: foot2 } = links(J_FT, inv(J_PF), inv(J_TP), flowRoles);
  if (J([...foot].sort()) !== J([...foot2].sort())) bump(bad, 'R1ctl');
  if (!feetByJFT.has(tf)) feetByJFT.set(tf, new Set());
  feetByJFT.get(tf).add(J([...foot].sort()));
  const mov = nonloop(L);
  if (mov.length !== [...L.values()].filter(([k]) => k === 'DIS' || k === 'PRO').length) bump(bad, 'R2');
  // R3 — the corner reading h = J_PF ∘ J_TP ∘ J_FT
  const h = comp(J_PF, comp(J_TP, J_FT));
  const cfix = new Set([...h].filter(([f, g]) => f === g).map(([f]) => f));
  const cmov = new Set([...h].filter(([f, g]) => f !== g).map(([f]) => f));
  const cund = new Set(flowRoles.filter((f) => !h.has(f)));
  for (const f of cfix) if (L.get(f)[0] !== 'FIX') bump(bad, 'R3a');
  for (const f of cmov) { const g = h.get(f); if (foot.get(g) !== J_FT.get(f) || L.get(g)[0] === 'FIX') bump(bad, 'R3b'); }
  if (mov.length < cmov.size) bump(bad, 'R3c');
  const excess = mov.filter((a) => cund.has(a));
  if (excess.length) bump(hit, 'R3excess'); bump(hit, 'R3excess_roles', excess.length);
  per.push([mov.length, cmov.size, excess.length]);
  for (const [k] of L.values()) bump(kinds, k);
  // R2 control: J_PT re-set so the route through Φ agrees with J_FT wherever defined
  const J_FP_ = inv(J_PF); const J_PT_ctl = new Map(); for (const [f, p] of J_FP_) if (J_FT.has(f)) J_PT_ctl.set(p, J_FT.get(f));
  const { L: Lc } = links(J_FT, J_FP_, J_PT_ctl, flowRoles);
  bump(bad, 'R2ctl', nonloop(Lc).length);
}
// R3 control — 1,000 total flat triples (random bijections on 6, the third map forced to close the loop; a seeded JS generator)
let seed = 371; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const shuffle = (xs) => { const a = [...xs]; for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const X6 = [0, 1, 2, 3, 4, 5];
for (let n = 0; n < 1000; n += 1) {
  const pAB = shuffle(X6); const pAX = shuffle(X6); // ONE bijection per map (a fresh draw per element is no bijection — measured: 1,682 spurious links)
  const J_AB = new Map(X6.map((x, i) => [x, pAB[i]])); const J_AX = new Map(X6.map((x, i) => [x, pAX[i]]));
  const J_XB = new Map(X6.map((a) => [J_AX.get(a), J_AB.get(a)]));
  const { L } = links(J_AB, J_AX, J_XB, X6);
  bump(bad, 'R3ctl', nonloop(L).length);
}
const distinct = [...feetByJFT.values()].map((s) => s.size).sort();
const hist = {}; for (const p of per) bump(hist, J(p));
const histSorted = Object.entries(hist).map(([k, n]) => [JSON.parse(k), n]).sort((a, b) => (a[0][0] - b[0][0]) || (a[0][1] - b[0][1]) || (a[0][2] - b[0][2]));
note(`R1 distinct feet per J_FT ${J(distinct)} · control differences ${bad.R1ctl || 0} · R2 failures ${bad.R2 || 0} · R2 flat control ${bad.R2ctl || 0} · R3 (a) ${bad.R3a || 0} (b) ${bad.R3b || 0} (c) ${bad.R3c || 0} · excess on ${hit.R3excess || 0} of 42 triples, ${hit.R3excess_roles || 0} roles · kinds ${J(kinds)} · R3 flat control (1,000) ${bad.R3ctl || 0}`);
note(`R3 per triple (non-loop, corner-MOV, excess): ${J(histSorted)}`);
check('§1 ★★ R1 DEPENDENCE — holding J_FT, the feet vary across the six triples sharing it: [6, 6, 6, 6, 6, 6, 6] distinct feet (sealed > 1); CONTROL the same triple twice — 0 differences', J(distinct) === J([6, 6, 6, 6, 6, 6, 6]) && (bad.R1ctl || 0) === 0, J({ distinct, ctl: bad.R1ctl || 0 }));
check('§1 ★★ R2 NO REDUCTION — non-loop links = |MOV| on every triple (0 failures); CONTROL flat (the route re-set to agree with J_FT): 0 non-loop links', (bad.R2 || 0) === 0 && (bad.R2ctl || 0) === 0, J({ R2: bad.R2 || 0, ctl: bad.R2ctl || 0 }));
check('§1 ★★ R3 (a) every corner-FIX role\'s link is a loop · (b) every corner-MOV role\'s return g = h(f) has foot(g) = J_FT(f) and a non-loop link · (c) non-loop ≥ corner-MOV — 0 · 0 · 0 failures; THE EXCESS (links where the corner reads UND) on 40 of 42 triples, 77 roles (the KILL condition: > 0); the kinds over 42 × 14 roles {UND 497 · PRO 46 · DIS 39 · FIX 6}; CONTROL total flat (1,000 random) 0',
  (bad.R3a || 0) === 0 && (bad.R3b || 0) === 0 && (bad.R3c || 0) === 0 && hit.R3excess === 40 && hit.R3excess_roles === 77 && J(kinds) === J({ UND: 497, PRO: 46, DIS: 39, FIX: 6 }) && (bad.R3ctl || 0) === 0,
  J({ a: bad.R3a || 0, b: bad.R3b || 0, c: bad.R3c || 0, excess: [hit.R3excess, hit.R3excess_roles], kinds, ctl: bad.R3ctl || 0 }));
check('§1 ★ R3 the per-triple histogram (non-loop, corner-MOV, excess) — the reference\'s eleven classes',
  J(histSorted) === J([[[0, 0, 0], 1], [[1, 0, 1], 1], [[1, 1, 1], 7], [[2, 1, 2], 6], [[2, 2, 0], 1], [[2, 2, 2], 15], [[3, 2, 1], 1], [[3, 2, 2], 1], [[3, 3, 1], 1], [[3, 3, 2], 1], [[3, 3, 3], 7]]), J(histSorted));

// ═══ §2 R4 — THE TOWER through the APP's resolver (the second implementation of the researcher's build) ═══
console.log('----- §2 R4 the tower through the app\'s resolver: gen-0 feet, the medial triangle at gen 2, the corner triangle -----');
let gen0NonLoop = 0; let medNonLoop = 0; let medDisagree = 0; let cornerNonLoop = 0; let cornerFeet = 0; let missing = 0;
const t0 = Date.now();
for (const { tf, tp, fp } of triples) {
  let seeded = createSeedShape('tetrahedron');
  for (const [label, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', triangle]]) seeded = withCast(seeded, byLabel(seeded, label), c);
  reset(seeded);
  // the face F·T·Φ = A·B·C: J_FT on A–B, J_TP on B–C, J_PF on C–A (each in the map's own direction)
  give('A', 'B', Object.fromEntries(inv(toMap(HAND_TF[tf]))));
  give('B', 'C', HAND_TP[tp]);
  give('C', 'A', Object.fromEntries(inv(toMap(J_FP[fp]))));
  S().applyAmboDissectionToCurrent();
  const G1 = cur(); const G1id = G1.id;
  const A = byLabel(G1, 'A'); const B = byLabel(G1, 'B'); const C = byLabel(G1, 'C');
  const mAB = midpointOf(G1, A, B); const mBC = midpointOf(G1, B, C); const mCA = midpointOf(G1, C, A);
  // gen 0: the feet at the three midpoints of the face A·B·C, each warranted by the third corner
  for (const [m, X] of [[mAB, C], [mBC, A], [mCA, B]]) { const f = footAt(G1, m.id, X); if (!f) missing += 1; else gen0NonLoop += nonloopOf(f); }
  const g0 = [[mAB, C], [mBC, A], [mCA, B]].reduce((n, [m, X]) => n + (footAt(G1, m.id, X) ? nonloopOf(footAt(G1, m.id, X)) : 0), 0);
  // the medial triangle M_AB·M_BC·M_CA: its sides' midpoints are born by dissecting the CORE (born rooms empty)
  S().selectCell(G1.cells.find((c) => c.kind === 'core').id); S().applyAmboDissectionToCurrent();
  const G2 = cur();
  let med = 0;
  for (const [u, v, X] of [[mAB, mBC, mCA], [mBC, mCA, mAB], [mCA, mAB, mBC]]) { const m = midpointOf(G2, u.id, v.id); const f = m ? footAt(G2, m.id, X.id) : null; if (!f) missing += 1; else med += nonloopOf(f); }
  medNonLoop += med;
  if ((med > 0) !== (g0 > 0)) medDisagree += 1;
  // the corner triangle A·M_AB·M_CA: its sides' midpoints are born by dissecting the RESIDUE at A
  S().selectShape(G1id);
  S().selectCell(G1.cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(A) && c.vertexIds.length === 4).id); S().applyAmboDissectionToCurrent();
  const G2c = cur();
  for (const [u, v, X] of [[A, mAB.id, mCA.id], [mAB.id, mCA.id, A], [mCA.id, A, mAB.id]]) { const m = midpointOf(G2c, u, v); const f = m ? footAt(G2c, m.id, X) : null; if (!f) missing += 1; else { cornerFeet += 1; cornerNonLoop += nonloopOf(f); } }
}
note(`R4 over the 42 (${Date.now() - t0} ms): gen-0 non-loop ${gen0NonLoop} · medial non-loop ${medNonLoop} · medial ⇔ gen-0 disagreements ${medDisagree} · corner triangle feet ${cornerFeet}, non-loop ${cornerNonLoop} · feet not found ${missing}`);
check('§2 ★★ R4 THE TOWER, THE APP\'S RESOLVER AS THE SECOND IMPLEMENTATION: over the 42 triples the corner triangle A·M_AB·M_CA\'s feet (126 of them) are ALL loops (0 non-loop — sealed 0, KILL); the medial triangle\'s feet carry a non-loop link exactly when the seed face\'s do (0 disagreements — sealed 0, KILL); the counts the reference sealed: medial 573 · gen-0 307',
  missing === 0 && cornerFeet === 126 && cornerNonLoop === 0 && medDisagree === 0 && medNonLoop === 573 && gen0NonLoop === 307,
  J({ missing, cornerFeet, cornerNonLoop, medDisagree, medNonLoop, gen0NonLoop }));

// ═══ §3 THE FEET IN THE SPACE — the eye's state (A flow · B phi · C t-cell · D phi; the eye's pairs) ═══
console.log('----- §3 the feet composed at AB in the eye\'s state; the counts moved by the feet alone -----');
let seeded3 = createSeedShape('tetrahedron');
for (const [label, c] of [['A', flow], ['B', phi], ['C', tcell], ['D', phi]]) seeded3 = withCast(seeded3, byLabel(seeded3, label), c);
reset(seeded3);
S().applyAmboDissectionToCurrent();
const G1e = cur().id;
give('A', 'B', { F5: 'Φ7', F7: 'Φ1', F8: 'Φ2' });
const AB = byLabel(cur(), 'AB'); const Cv = byLabel(cur(), 'C'); const Dv = byLabel(cur(), 'D');
const before = spaceOf(cur(), AB);
check('§3 ★★ TWO FEET, SILENT, with pairs on A–B alone: `≡_C` and `≡_D` in M⁺\'s signature (one per triangular face holding A–B: A·B·C and A·B·D), each with an empty map — nothing paired on A–C, C–B, A–D or D–B — no tuple; the drawing\'s census counts 0 feet',
  before.feet.length === 2 && J(before.feet.map((f) => f.type)) === J(['≡_C', '≡_D']) && before.feet.every((f) => f.map.size === 0 && f.links.length === 0 && !f.given[0] && !f.given[1]) && before.space.signature.filter((s) => isFootType(s.type)).length === 2 && before.space.relations.filter((r) => isFootType(r.type)).length === 0 && insideOf(before.space).census.feet === 0,
  J(before.feet.map((f) => [f.type, f.map.size, f.given])));
// the eye's later acts: S1 on A–C (the T cell's roles ↦ flow's) and Q on B–C (the T cell's ↦ phi's)
give('C', 'A', { r0: 'F13', r1: 'F9', r2: 'F1', r4: 'F12', r6: 'F3', r8: 'F7' });
give('C', 'B', { r9: 'Φ6', r1: 'Φ1', r0: 'Φ8', r7: 'Φ5', r6: 'Φ2' });
const R = spaceOf(cur(), AB); const Rno = spaceOf(cur(), AB, { feet: false });
const footC = R.feet.find((f) => f.corner === Cv); const footD = R.feet.find((f) => f.corner === Dv);
const nA = (id) => nameIn(spaceOf(cur(), R.edge.parents[0]).space, id); const nB = (id) => nameIn(spaceOf(cur(), R.edge.parents[1]).space, id);
note(`C's foot: map ${footC.map.size} · fix ${J(footC.fix)} · disagreement ${J(footC.disagreement)} · proposal ${J(footC.proposal.map(([a, b]) => `${nA(a)} with ${nB(b)}`))} · links ${J(footC.links)} · D's foot: map ${footD.map.size}, given ${J(footD.given)}`);
check('§3 ★★ THE FOOT OF C ON A–B, read from the pairings on A–C and C–B: foot_C = {F13 ↦ Φ8 · F9 ↦ Φ1 · F3 ↦ Φ2} (J_CB ∘ J_AC on A\'s roles, through C-9\'s reader); none of the three is paired on A–B, so all three are PROPOSALS (links between two points that stay two), no FIX, no DISAGREEMENT; D\'s foot stays silent (nothing on A–D, nothing on D–B)',
  footC.map.size === 3 && footC.fix.length === 0 && footC.disagreement.length === 0 && J(footC.proposal) === J([['F13', 'Φ8'], ['F9', 'Φ1'], ['F3', 'Φ2']]) && footC.links.length === 3 && footC.links.every(([u, v]) => u !== v) && footC.given[0] && footC.given[1] && footD.map.size === 0 && !footD.given[0] && !footD.given[1],
  J({ C: { map: footC.map.size, pro: footC.proposal, links: footC.links }, D: { map: footD.map.size, given: footD.given } }));
const sansFeet = (space) => ({ roles: space.roles, signature: space.signature.filter((s) => !isFootType(s.type)), relations: space.relations.filter((r) => !isFootType(r.type)), axioms: space.axioms });
check('§3 ★★ M⁺ = M PLUS THE FEET, NOTHING ELSE: M\'s points untouched (20 roles both ways), J_AB untouched (the same pairs in force), every foot tuple holds-only; the counts move by the feet alone — words 25 → 27 (+2 types), tuples 56 → 59 (+3 links); with the feet filtered out the space is byte-as-before (`feet: false` the control)',
  R.space.roles.length === 20 && Rno.space.roles.length === 20 && J(R.edge.midpoint.pairs) === J(Rno.edge.midpoint.pairs) && R.space.relations.filter((r) => isFootType(r.type)).every((r) => r.polarity === 'holds') && Rno.space.signature.length === 25 && R.space.signature.length === 27 && Rno.space.relations.length === 56 && R.space.relations.length === 59 && J(sansFeet(R.space)) === J(sansFeet(Rno.space)) && J(sansFeet(Rno.space)) === J({ roles: Rno.space.roles, signature: Rno.space.signature, relations: Rno.space.relations, axioms: Rno.space.axioms }),
  J({ roles: [R.space.roles.length, Rno.space.roles.length], words: [Rno.space.signature.length, R.space.signature.length], tuples: [Rno.space.relations.length, R.space.relations.length] }));
const insideAB = insideOf(R.space);
check('§3 ★★ THE FOOT IS WORDS, NEVER A GLYPH: the drawing of M⁺ draws no foot tuple (46 arcs · 10 loops — as M\'s) and its census says what it left to the words (3 feet); the foot TYPES stand in the word list (`≡_C` · `≡_D`), so at the next generation they read in the word rows as foreign words',
  insideAB.census.arrows === insideOf(Rno.space).census.arrows && insideAB.census.loops === insideOf(Rno.space).census.loops && insideAB.census.feet === 3 && insideOf(Rno.space).census.feet === 0 && J(insideAB.words.filter((w) => isFootType(w))) === J(['≡_C', '≡_D']),
  J({ arrows: [insideAB.census.arrows, insideOf(Rno.space).census.arrows], loops: insideAB.census.loops, feet: insideAB.census.feet, words: insideAB.words.filter((w) => isFootType(w)) }));

// ═══ §4 THE CARRIERS ═══
console.log('----- §4 the carriers: the lift, the next pushout (foreign words), the record check -----');
S().selectCell(cur().cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(byLabel(cur(), 'A')) && c.vertexIds.length === 4).id);
const before4 = useLiftStore.getState().queue.length;
S().liftSelectionToManuscript();
const entry4 = loadUniverseSnapshot(useLiftStore.getState().queue[before4].file);
const form4 = placeShelfEntry(entry4, 0);
const concept4 = liftedConceptOf(form4, entry4.loaded.ancestors ?? []);
const carriedAB = spaceOf(concept4.record, byLabel(concept4.record, 'AB'));
check('§4 ★★ THE LIFT CARRIES THE FEET — re-derived on the carried record, nothing extra: the residue at A lifted, its corner AB read on the record the lift carried holds `≡_C` with the same three proposals and `≡_D` silent (the concept\'s AB row counts the feet among its words)',
  concept4.state === 'read' && carriedAB.feet.length === 2 && J(carriedAB.feet.find((f) => f.type === '≡_C').proposal) === J([['F13', 'Φ8'], ['F9', 'Φ1'], ['F3', 'Φ2']]) && carriedAB.feet.find((f) => f.type === '≡_D').map.size === 0 && carriedAB.space.signature.length === 27,
  J({ state: concept4.state, feet: carriedAB.feet.map((f) => [f.type, f.map.size]), words: carriedAB.space.signature.length }));
S().selectCell(cur().cells.find((c) => c.kind === 'core').id); S().applyAmboDissectionToCurrent();
const ABAC = byLabel(cur(), 'ABAC');
const P = spaceOf(cur(), ABAC); const Pno = spaceOf(cur(), ABAC, { feet: false });
const footWords = P.space.signature.map((s) => s.type).filter((t) => t.includes('≡_'));
note(`gen 2 ABAC: the foot words as they read ${J(footWords)} · its own feet ${J(P.feet.map((f) => [f.type, f.map.size, f.fix.length, f.disagreement.length, f.proposal.length]))} · words ${Pno.space.signature.length} → ${P.space.signature.length}`);
check('§4 ★★ THE NEXT PUSHOUT CARRIES THE PARENTS\' FEET AS FOREIGN WORDS — never shared by spelling (Δ80): at ABAC the words read `≡_C` (AB\'s), `≡_B` (AC\'s), and the two `≡_D` told apart by the lone-name bracket — `≡_D [AB]` · `≡_D [AC]`; ABAC\'s OWN feet are derived afresh — three, one per distinct triangle holding AB–AC: the corner cell\'s face (foot of A, all loops), the interior face (foot of AD, all loops) and the seed-boundary face (foot of BC, which carries the seed face\'s disagreement forward: links) — a triangle held by two cells counted ONCE',
  footWords.includes('≡_C') && footWords.includes('≡_B') && footWords.includes('≡_D [AB]') && footWords.includes('≡_D [AC]') && P.feet.length === 3 && J(P.feet.map((f) => f.type).sort()) === J(['≡_A', '≡_AD', '≡_BC']) && P.feet.find((f) => f.type === '≡_A').map.size === 14 && nonloopOf(P.feet.find((f) => f.type === '≡_A')) === 0 && nonloopOf(P.feet.find((f) => f.type === '≡_AD')) === 0 && nonloopOf(P.feet.find((f) => f.type === '≡_BC')) > 0 && P.space.signature.length === Pno.space.signature.length + 4 + 3,
  J({ footWords, own: P.feet.map((f) => [f.type, f.map.size, nonloopOf(f)]), words: [Pno.space.signature.length, P.space.signature.length] }));
const U = spaceOf(cur(), byLabel(cur(), 'AB')); const V = spaceOf(cur(), byLabel(cur(), 'AC')); const Un = spaceOf(cur(), byLabel(cur(), 'AB'), { feet: false }); const Vn = spaceOf(cur(), byLabel(cur(), 'AC'), { feet: false });
let same = 0; let differ = 0;
for (const x of U.space.roles) for (const y of V.space.roles) { const a = refusalOf(U.space, V.space, [[x.id, y.id]], []); const b = refusalOf(Un.space, Vn.space, [[x.id, y.id]], []); if (J(a.map((c) => c.type)) === J(b.map((c) => c.type)) && a.length === b.length) same += 1; else differ += 1; }
check('§4 ★★ THE RECORD CHECK READS THE FEET AND FINDS NOTHING TO CONTRADICT (§147: holds-only, never shared by spelling): `refusalOf` on the gen-2 edge AB–AC gives the same conflicts with and without the feet for EVERY pointed pair (360 pairs, 0 differ); the door\'s census and the cargo\'s K1–K7 are pinned unchanged by their own witnesses in the sweep',
  same === 360 && differ === 0, J({ same, differ }));

// ═══ §6 ONE COUNT EVERYWHERE, THE SPACE'S (§149 — the mothership's finding at its eye: the own column's head said M's size while the card said M⁺'s) ═══
console.log('----- §6 one count everywhere — the head and the card agree on the mothership\'s path and on mine -----');
const { cornersViewWords } = req('src/components/MidpointSurface.tsx');
const headOf = (html) => { const m = /data-midpoint-counts="true"[^>]*>([^<]*)</.exec(html); return m ? m[1].replace(/&#x27;/g, "'").replace(/&quot;/g, '"') : null; };
const leadOf = (html) => { const m = /its own space, one column: ([^<]*)</.exec(html); return m ? m[1].replace(/&#x27;/g, "'") : null; };
const cardLineOf = (space) => { const c = spaceCounts(space); return `${c.roles} roles · ${c.words} words · ${c.tuples} tuples`; }; // the card's own expression (Panels.tsx prints spaceCounts thrice — pinned below)
const surfaceAt = (siteId) => { const packet = buildGeneralSitePacketPresenterReport(cur()).packets.find((p) => p.trace.siteId === siteId); const site = midpointSiteOf(cur(), siteId, packet.trace); const parents = [spaceOf(cur(), site.a), spaceOf(cur(), site.b)]; return renderToString(React.createElement(MidpointSurface, { shape: cur(), site, parents, resolved: spaceOf(cur(), siteId), refusal: null, remade: null })).replace(/<!-- -->/g, ''); };
// the mothership's path (§149, its own drive): A flow · B phi · C t-cell · D phi; F5↦Φ7 · F7↦Φ1 · F8↦Φ2 on A–B, no word pairs; r0↦F1 on A–C; Φ1↦r0 on B–C
let seeded6 = createSeedShape('tetrahedron');
for (const [label, c] of [['A', flow], ['B', phi], ['C', tcell], ['D', phi]]) seeded6 = withCast(seeded6, byLabel(seeded6, label), c);
reset(seeded6);
S().applyAmboDissectionToCurrent();
give('A', 'B', { F5: 'Φ7', F7: 'Φ1', F8: 'Φ2' });
give('C', 'A', { r0: 'F1' });
give('C', 'B', { r0: 'Φ1' });
const AB6 = byLabel(cur(), 'AB');
const RM = spaceOf(cur(), AB6); const cM = spaceCounts(RM.space); const shM = feetShareOf(RM.feet);
const htmlM = surfaceAt(AB6); const headM = headOf(htmlM); const leadM = leadOf(htmlM);
const footC6 = RM.feet.find((f) => f.corner === byLabel(cur(), 'C'));
note(`the mothership's path at AB: space ${J(cM)} · feet's share ${J(shM)} · C's foot proposal ${J(footC6 ? footC6.proposal : null)} · head "${headM}" · lead "${leadM}"`);
check('§6 ★★ THE MOTHERSHIP\'S PATH REPRODUCED (the positive control that this is its path): at AB the space counts 20 roles · 27 words · 57 tuples — its 25 words · 56 tuples plus the two feet\'s relation-types and C\'s one proposal (F1 with Φ1, the sentence it saw); the feet\'s share {2 words, 1 tuple}',
  cM.roles === 20 && cM.words === 27 && cM.tuples === 57 && shM.words === 2 && shM.tuples === 1 && footC6 && J(footC6.proposal) === J([['F1', 'Φ1']]),
  J({ cM, shM, proposal: footC6 && footC6.proposal }));
check('§6 ★★ ONE COUNT EVERYWHERE — the head and the card AGREE on the mothership\'s path: the own column\'s head reads `AB: 20 roles (14 + 9 − 3) · 27 words · 57 tuples (N both) · 20 marks · 2 of the words and 1 tuple are the corners\' views` — the space\'s count, the card\'s own expression, the feet\'s share said beside it; the lead-in the same count with the same words',
  headM !== null && new RegExp(`^AB: ${cM.roles} roles \\(14 \\+ 9 − 3\\) · ${cM.words} words · ${cM.tuples} tuples \\(\\d+ both\\) · 20 marks · ${cornersViewWords(shM).replace(/[()]/g, '\\$&')}$`).test(headM) && headM.includes(cardLineOf(RM.space).replace('20 roles', '')) && headM.includes("2 of the words and 1 tuple are the corners' views") &&
    leadM !== null && leadM.startsWith(`${cardLineOf(RM.space)} · 20 marks · ${cornersViewWords(shM)} · `),
  J({ headM, leadM, card: cardLineOf(RM.space) }));
// and on mine — the §3 state (the eye's path: S1 on A–C, Q on B–C; the three proposals)
reset(seeded3);
S().applyAmboDissectionToCurrent();
give('A', 'B', { F5: 'Φ7', F7: 'Φ1', F8: 'Φ2' });
give('C', 'A', { r0: 'F13', r1: 'F9', r2: 'F1', r4: 'F12', r6: 'F3', r8: 'F7' });
give('C', 'B', { r9: 'Φ6', r1: 'Φ1', r0: 'Φ8', r7: 'Φ5', r6: 'Φ2' });
const AB3 = byLabel(cur(), 'AB');
const R3 = spaceOf(cur(), AB3); const c3 = spaceCounts(R3.space); const sh3 = feetShareOf(R3.feet); const html3 = surfaceAt(AB3); const head3 = headOf(html3);
check('§6 ★★ …AND ON MINE: at the eye\'s state (three proposals) the head reads the space\'s 27 words · 59 tuples with `2 of the words and 3 tuples are the corners\' views`, equal to the card\'s expression; the feet\'s share equals the space\'s own foot-typed entries (by construction — `withFeet` added exactly them)',
  c3.words === 27 && c3.tuples === 59 && sh3.words === 2 && sh3.tuples === 3 && head3 !== null && head3.includes(`· ${c3.words} words · ${c3.tuples} tuples (`) && head3.endsWith(` · ${cornersViewWords(sh3)}`) &&
    R3.space.signature.filter((t) => isFootType(t.type)).length === sh3.words && R3.space.relations.filter((r) => isFootType(r.type)).length === sh3.tuples,
  J({ c3, sh3, head3 }));
check('§6 ★★ THE ONE EXPRESSION, BY CONSTRUCTION: the card (Panels.tsx), the lifted card (liftedConceptModel.ts) and the surface (its sizes memo) all print `spaceCounts(…)` from the resolver — no `.space.signature.length` or `.space.relations.length` printed anywhere else in the components or the manuscript; the surface\'s three lines carry the feet\'s share through `cornersViewWords`',
  (() => {
    const panels = readLf('src/components/Panels.tsx'); const lifted = readLf('src/manuscript/liftedConceptModel.ts'); const surf = readLf('src/components/MidpointSurface.tsx');
    const stray = (t) => /\.space\.(signature|relations|roles)\.length/.test(t);
    return panels.includes('${spaceCounts(resolved.space).roles} roles · ${spaceCounts(resolved.space).words} words · ${spaceCounts(resolved.space).tuples} tuples') && !stray(panels) &&
      lifted.includes('roles: r ? spaceCounts(r.space).roles : 0') && lifted.includes('tuples: r ? spaceCounts(r.space).tuples : 0') && !stray(lifted) &&
      surf.includes('const sizes = useMemo(() => spaceCounts(resolved.space), [resolved]);') && (surf.match(/\$\{sizes\.words\} words · \$\{sizes\.tuples\} tuples/g) || []).length === 3 && (surf.match(/\$\{sizes\.roles\} roles/g) || []).length === 3 && (surf.match(/\$\{cornersClause\}/g) || []).length === 3 && !/M\.counts\.(words|tuples|roles)/.test(surf) && !stray(surf);
  })());

// ═══ §5 THE SURFACE — the designer's words, under the own column ═══
console.log('----- §5 the surface: the blocks under the own column (renderToString), the drawing free of foot glyphs, the manifest, purity -----');
S().selectShape(G1e);
const G1s = cur();
const rep = buildGeneralSitePacketPresenterReport(G1s);
const packet = rep.packets.find((x) => x.trace.siteId === AB);
const site = midpointSiteOf(G1s, AB, packet ? packet.trace : null);
const resolvedAB = spaceOf(G1s, AB);
const parentsAB = [spaceOf(G1s, resolvedAB.edge.parents[0]), spaceOf(G1s, resolvedAB.edge.parents[1])];
const html = renderToString(React.createElement(MidpointSurface, { shape: G1s, site, parents: parentsAB, resolved: resolvedAB, refusal: null, remade: null })).replace(/<!-- -->/g, '');
const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
const blocks = [...html.matchAll(/<div[^>]*data-midpoint-foot="([^"]+)"[^>]*data-midpoint-foot-state="([^"]+)"[^>]*>([\s\S]*?)<\/div>/g)].map((m) => ({ corner: m[1], state: m[2], head: unescape(((m[3].match(/data-midpoint-foot-head="true"[^>]*>([^<]*)</) || [])[1] || '')), lines: [...m[3].matchAll(/data-midpoint-foot-line="([^"]+)"[^>]*>([^<]*)</g)].map((l) => [l[1], unescape(l[2])]), buttons: (m[3].match(/<button/g) || []).length }));
note(`the blocks: ${J(blocks)}`);
const ownDrawing = (html.match(/data-midpoint-own-drawing="true"[\s\S]*?<\/svg>/) || [''])[0];
check('§5 ★★ THE FEET AS WORDS UNDER THE OWN COLUMN, in the unfolding\'s order (C above, D below): C\'s block heads `C\'s view of your pairing on A–B — read from your pairings on A–C and C–B` and reads three proposals, each a conditional sentence — `would join what you left apart: F13 with Φ8` · `… F9 with Φ1` · `… F3 with Φ2` — no `agrees` line (nothing agrees), no control inside; D\'s block its one silent line `D says nothing about A–B — you have paired nothing on A–D or D–B yet`; the heads name the corner, never `[C]`, never `C:`',
  blocks.length === 2 && blocks[0].corner === 'C' && blocks[1].corner === 'D' && blocks[0].state === 'read' && blocks[0].head === "C's view of your pairing on A–B — read from your pairings on A–C and C–B" && J(blocks[0].lines) === J([['would-join', 'would join what you left apart: F13 with Φ8'], ['would-join', 'would join what you left apart: F9 with Φ1'], ['would-join', 'would join what you left apart: F3 with Φ2']]) && blocks[1].state === 'silent' && J(blocks[1].lines) === J([['silent', 'D says nothing about A–B — you have paired nothing on A–D or D–B yet']]) && blocks.every((b) => b.buttons === 0 && !/\[C\]|\[D\]|^C:|^D:/.test(b.head)) && html.indexOf('data-midpoint-foot="C"') > html.indexOf('data-midpoint-own-drawing="true"') && html.indexOf('data-midpoint-foot="C"') < html.indexOf('data-midpoint-own="glued"') + html.slice(html.indexOf('data-midpoint-own="glued"')).indexOf('data-midpoint-trace='),
  J(blocks));
check('§5 ★★ THE DRAWING FREE OF FOOT GLYPHS: the own drawing\'s arc and loop words never spell a foot (`≡_`); the head line counts M (the amalgam) as before',
  ownDrawing.length > 0 && !/data-inside-(arc|loop)-word="[^"]*"[^>]*>[^<]*≡_/.test(ownDrawing) && /20 roles · \d+ words · \d+ tuples/.test(unescape(html)), J({ ownDrawingLen: ownDrawing.length }));
// the agreement and the disagreement, exercised at the model (the eye's state has none): C's foot with a pair on A–B agreeing / disagreeing
give('A', 'B', { F13: 'Φ8' });
const Ragree = spaceOf(cur(), AB).feet.find((f) => f.corner === Cv);
S().withdrawRolePair(edgeBetween(cur().edges, byLabel(cur(), 'A'), byLabel(cur(), 'B')).id, 'F13', 'Φ8');
give('A', 'B', { F13: 'Φ5' });
const Rdis = spaceOf(cur(), AB).feet.find((f) => f.corner === Cv);
const htmlDis = renderToString(React.createElement(MidpointSurface, { shape: cur(), site: midpointSiteOf(cur(), AB, packet ? packet.trace : null), parents: [spaceOf(cur(), resolvedAB.edge.parents[0]), spaceOf(cur(), resolvedAB.edge.parents[1])], resolved: spaceOf(cur(), AB), refusal: null, remade: null })).replace(/<!-- -->/g, '');
const disLines = [...htmlDis.matchAll(/data-midpoint-foot-line="([^"]+)"[^>]*>([^<]*)</g)].map((l) => [l[1], unescape(l[2])]);
check('§5 ★★ AGREEMENT LEADS, DISAGREEMENT NAMES BOTH: F13 ↦ Φ8 paired on A–B makes C\'s foot AGREE on F13 (a loop — `agrees on 1: F13 ≡ Φ8`, the first line); F13 ↦ Φ5 instead makes a DISAGREEMENT — `would pair F13 otherwise: with Φ8 — you paired it with Φ5` — with his pair named as his; the proposals follow, never first',
  Ragree.fix.length === 1 && J(Ragree.fix[0]) === J(['F13', 'Φ8']) && Ragree.proposal.length === 2 && Rdis.disagreement.length === 1 && J(Rdis.disagreement[0]) === J(['F13', 'Φ8', 'Φ5']) && Rdis.fix.length === 0 && Rdis.proposal.length === 2 && disLines[0][0] === 'would-pair' && disLines[0][1] === 'would pair F13 otherwise: with Φ8 — you paired it with Φ5' && disLines.slice(1, 3).every((l) => l[0] === 'would-join') && Rdis.links.some(([u, v]) => u !== v),
  J({ agree: Ragree.fix, dis: Rdis.disagreement, lines: disLines.slice(0, 4) }));
const manifest = readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt');
const feetSrc = readLf('src/lib/feet.ts'); const spaceSrc = readLf('src/lib/spaceOf.ts'); const insideSrc = readLf('src/lib/castInside.ts');
check('§5 ★ THE MANIFEST AND PURITY: feet.ts classified NOT_FROZEN (a leaf — no import); spaceOf composes the feet through C-9\'s one reader (`bornStepOf`, a deferred use) and names them through the leaf; castInside keeps them out of the glyphs through the same leaf; spaceOf and castInside stay NOT_FROZEN; the foot type is `≡_<label>`; C-14: castInside imports the respect\'s test beside the foot\'s from the same leaf, and the respect type `⟨<label>⟩` is told from a foot',
  /^NOT_FROZEN src\/lib\/feet\.ts — STAMP C-12b/m.test(manifest) && !/^import /m.test(feetSrc) && /import \{ bornStepOf \} from '\.\/bornFace';/.test(spaceSrc) && /import \{ footTypeName \} from '\.\/feet';/.test(spaceSrc) && /import \{ isFootType, isRespectType \} from '\.\/feet';/.test(insideSrc) && /^NOT_FROZEN src\/lib\/spaceOf\.ts/m.test(manifest) && /^NOT_FROZEN src\/lib\/castInside\.ts/m.test(manifest) && footTypeName('C') === '≡_C' && isFootType('≡_C') && !isFootType('sustains') && respectTypeName('C') === '⟨C⟩' && isRespectType('⟨C⟩') && !isRespectType('≡_C') && !isFootType('⟨C⟩'),
  '');

console.log(`\nDIAGNOSE-THE-STONE: ${failures === 0 ? 'ALL PASS — the born concept carries its opposite corners\' feet, in the signature, as words under the own column; the four runs reproduced, the tower through the app\'s own resolver' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
