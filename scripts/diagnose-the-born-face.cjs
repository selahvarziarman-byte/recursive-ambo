#!/usr/bin/env node

// DIAGNOSTIC — THE BORN FACE (STAMP C-9, 2026-09-23 · MARKER THE-THIRD-RESOLUTION · M1, 2026-10-07): the face reading at
// generation ≥ 1 THROUGH THE ONE MONODROMY (src/lib/bornFace.ts, NOT_FROZEN) — the corners' spaces and the steps the
// TRANSPORT's (D11 · D12 amended: a seed its cast, a born corner its child; his IS-instances and the inherited on a seed or
// medial edge, the coordinate map on a corner edge), handed in by the caller (`bornReadersOf`, transport.ts); the SOLID part
// the ground (the step with his pairs left out — the inherited alone on a medial edge, the coordinate map on a corner edge);
// the EXTENSION the step whole, its news attributed to his pairs; the guard the seed face's own at every corner, a refusal
// standing under the solid reading INHERITED; `Und` with its address and its descent; and the surface: the born faces named
// at the site, read at their homes, the corner cell's own face among them.
//
// M1 (the mothership's 23:55, on this seat's measurement — the identity regime's born step apart from the transport's on 12 of
// 12 rod-directions): (a) NO LEFTOVER CARRIED — the parents' unpaired roles were never the midpoint's (§9.15); (b) NO IDENTITY
// THROUGH A SHARED CORNER WITHOUT HIS PAIRING — where the parents' pairing is absent the step is absent (D15) and the face says
// `no reading yet: nothing paired on …`. THE DEFINITION IS REOPENED BY THE RULING: the researcher's born_face_reading.py
// (.handoff/instruments/connection_layer_reference) reads the identity regime — the merged space with the parents' leftovers,
// the composed identity's coprojection — and its deterministic seals (a1 · a2 · a3; 234 glued roles; the domain 91 of 774;
// Und 683 = 354 · 210 · 119; 6 inherited refusals) are the OLD definition's numbers, superseded here, not reproduced: the
// kill-condition pattern ran the right way round (a disagreement between two implementations reopened the DEFINITION — by
// the mothership's ruling, on a measurement — and the code follows the definition, never a number). The reference's FIXTURES,
// order and triples are kept (A flow · B t-cell · C phi · D triangle; the 42 hand triples on A–B, B–C, C–A; A–D, B–D, C–D
// unmapped; one dissection; the medial triangle M_AB·M_BC·M_CA, the interior M_AB·M_CA·M_AD, the corner-cell face A·M_AB·M_CA),
// and THIS witness's numbers are the new regime's, measured on them.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText, filename);
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const J = (x) => JSON.stringify(x);

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);

const { readCastFile } = req('src/lib/castLoader.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { bornFaceOf, readAlike } = req('src/lib/bornFace.ts');
const { bornReadersOf, transportStepOf, transportGroundOf } = req('src/lib/transport.ts');
const { nameIn } = req('src/lib/spaceOf.ts');
const { edgeBetween, faceBy } = req('src/lib/faceReading.ts');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;

console.log('THE BORN FACE — the face at gen ≥ 1 through the ONE MONODROMY (M1): the transport\'s spaces and steps, the solid part the ground, the extension the news attributed to his pair, the guard the seed face\'s own, Und with its descent; read at the site (C-9 · C-10b)\n');

const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json'); const tri = cast('triangle.cast.json');
const inv = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [v, k]));
// the hand triples, verbatim from born_face_reading.py (the same as face_residue_reading.py's)
const HAND_TF = { A: { r9: 'F8', r1: 'F7', r0: 'F1', r2: 'F12', r8: 'F13' }, "B'": { r9: 'F3', r1: 'F9', r0: 'F5', r7: 'F13', r8: 'F1', r2: 'F7' },
  C: { r9: 'F12', r1: 'F13', r0: 'F9', r6: 'F1', r2: 'F3' }, D: { r9: 'F12', r1: 'F1', r0: 'F2', r7: 'F7', r2: 'F5' },
  S1: { r0: 'F13', r1: 'F9', r2: 'F1', r4: 'F12', r6: 'F3', r8: 'F7' }, S4: { r0: 'F13', r1: 'F9', r2: 'F1', r6: 'F3', r7: 'F5', r8: 'F7' },
  S2: { r0: 'F9', r1: 'F3', r2: 'F13', r6: 'F10', r7: 'F5', r8: 'F12' } };
const HAND_TP = { P: { r0: 'Φ1', r1: 'Φ2', r2: 'Φ7', r4: 'Φ5', r6: 'Φ3' }, Q: { r9: 'Φ6', r1: 'Φ1', r0: 'Φ8', r7: 'Φ5', r6: 'Φ2' }, R: { r0: 'Φ1', r1: 'Φ6', r7: 'Φ5', r2: 'Φ7', r4: 'Φ8' } };
const J_FP = { '(i)': { F7: 'Φ1', F8: 'Φ2', F5: 'Φ7' }, '(ii)': { F1: 'Φ3', F2: 'Φ2', F3: 'Φ4', F5: 'Φ1' } };

// ─── the fixtures: the seed tetrahedron with the four casts, one triple's records on A–B, B–C, C–A, one dissection ───
const seed0 = createSeedShape('tetrahedron');
const labels = ['A', 'B', 'C', 'D'];
const seedIds = Object.values(seed0.vertices).map((v) => v.id);
seedIds.forEach((id, i) => { seed0.vertices[id].data.label = labels[i]; });
const casts = { A: flow, B: tcell, C: phi, D: tri };
for (const [i, id] of seedIds.entries()) seed0.vertices[id].data.cast = casts[labels[i]];
const byLabel = (shape, l) => Object.values(shape.vertices).find((v) => v.data.label === l).id;
const mid = (shape, p, q) => Object.values(shape.vertices).find((v) => v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(p) && v.createdBy.sourceVertexIds.includes(q)).id;
/** one triple's gen-1 shape: the records oriented to each edge's own vertexIds (flow→T on A–B, T→Φ on B–C, Φ→flow on C–A); the midpoints labelled by their parents */
function shapeFor(fp, tf, tp) {
  const s = JSON.parse(J(seed0));
  const setRec = (X, Y, mapXY) => { const e = edgeBetween(s.edges, byLabel(s, X), byLabel(s, Y)); const pairs = Object.entries(mapXY); e.identification = { roles: e.vertexIds[0] === byLabel(s, X) ? pairs : pairs.map(([x, y]) => [y, x]), types: [] }; };
  setRec('A', 'B', inv(HAND_TF[tf])); setRec('B', 'C', HAND_TP[tp]); setRec('C', 'A', inv(J_FP[fp]));
  const g1 = applyAmboDissection(s, s.cells[0].id);
  for (const v of Object.values(g1.vertices)) if (v.createdBy.sourceVertexIds.length === 2) v.data.label = v.createdBy.sourceVertexIds.map((p) => g1.vertices[p].data.label).join('');
  return g1;
}
const cornersOf = (g) => { const A = byLabel(g, 'A'); const B = byLabel(g, 'B'); const C = byLabel(g, 'C'); const D = byLabel(g, 'D'); return { A, B, C, D, MAB: mid(g, A, B), MBC: mid(g, B, C), MCA: mid(g, C, A), MAD: mid(g, A, D) }; };
const triples = [];
for (const fp of Object.keys(J_FP)) for (const tf of Object.keys(HAND_TF)) for (const tp of Object.keys(HAND_TP)) triples.push([fp, tf, tp]);
const L = (g, v) => g.vertices[v].data.label;
const edgeW = (g, u) => `${L(g, u.from)}–${L(g, u.to)}`;
const unpairedW = (g, r) => r.unpaired.map((u) => (u.kind === 'corner' && u.descent ? `${L(g, u.descent.from)}–${L(g, u.descent.to)}` : edgeW(g, u))).join(',');

// ═══ §1 THE GROUND IS GEN 0's — the three born faces over the 42 hand triples, born rooms empty, under the transport ═══
console.log('----- §1 the ground is gen 0\'s: the three born faces over the 42 hand triples, born rooms empty, through the transport -----');
const stat = {}; const bump = (k, n = 1) => { stat[k] = (stat[k] ?? 0) + n; };
const shapes = new Map();
for (const [fp, tf, tp] of triples) {
  const g = shapeFor(fp, tf, tp); shapes.set(`${fp}+${tf}+${tp}`, g);
  const { A, B, C, MAB, MBC, MCA, MAD } = cornersOf(g);
  const RD = bornReadersOf(g);
  const med = bornFaceOf(g, [MAB, MBC, MCA], RD); const int = bornFaceOf(g, [MAB, MCA, MAD], RD); const cc = bornFaceOf(g, [A, MAB, MCA], RD);
  bump(`medial ${med.state}`); bump(`interior ${int.state}`); bump(`corner-cell ${cc.state}`);
  // the seed face A·B·C through the same transport (D20: faceBy with transportStepOf) — the ground the born faces descend from
  const seed = faceBy([A, B, C], Object.fromEntries([A, B, C].map((v) => [v, RD.cast(v)])), g.edges, (x, y) => transportStepOf(g, x, y));
  bump(`seed ${seed.state}`);
  const seedFixA = seed.state === 'read' ? seed.readings[0].fix : null;
  // (a) THE CORNER-CELL FACE at A: its solid reading at A IS the seed face's Fix at A — the coordinate map out and back, the inherited step
  // between (D15: (x≡b) ~ (x≡c) exactly when b ≡ c is his on B–C); no Mov ever (the inherited step never moves); the rest Und. Where the
  // seed face has no Fix at A the inherited step is EMPTY and the face is absent — `nothing paired on AB–AC` — no leftover, nothing minted
  if (cc.state === 'read') {
    const r = cc.readings[0];
    bump(seedFixA && J([...r.solid.fix].sort()) === J([...seedFixA].sort()) ? 'a: cc solid fix = seed fix at A' : 'a: cc FAIL');
    bump('cc solid mov', r.solid.mov.length); bump('cc solid fix', r.solid.fix.length); bump('cc solid und', r.solid.und.length); bump('cc ambient', r.solid.ambient.length);
    if (r.und.some((u) => u.brokeAt.from === A && u.descent !== null)) bump('descent FAIL'); // a break leaving a SEED corner descends from nothing (the extension's Und carries the descent)
  } else if (cc.state === 'absent') {
    bump(`cc absent: ${unpairedW(g, cc)}`);
    if (seedFixA && seedFixA.length > 0) bump('a: cc absent with a seed Fix FAIL');
  } else bump('cc refused');
  // (b) THE MEDIAL TRIANGLE, born rooms empty: every step the inherited alone — the face reads only where the three pairings compose at some
  // role around the seed face (6 of 42), the solid Mov is 0 everywhere, every Fix instance's A-coordinate a Fix of the seed face at A
  if (med.state === 'read') {
    const r = med.readings[0];
    bump('med solid fix', r.solid.fix.length); bump('med solid mov', r.solid.mov.length); bump('med solid und', r.solid.und.length); bump('|M_AB child|', r.solid.ambient.length);
    for (const u of r.solid.und) bump(`med und@${L(g, u.brokeAt.from)}→${L(g, u.brokeAt.to)}`);
    for (const u of r.und) { const step = med.walk.steps.find((s) => s.from === u.brokeAt.from && s.to === u.brokeAt.to); const parents = g.vertices[step.from].createdBy.sourceVertexIds; if (!u.descent || u.descent.from !== parents[0] || u.descent.to !== parents[1]) bump('descent FAIL'); }
    const coords = r.solid.fix.map((k) => k.split('≡')[0]);
    bump(seedFixA && coords.every((a) => seedFixA.includes(a)) ? 'b: med fix ⊆ seed fix' : 'b: med FAIL');
    // (d3) both hands reachable: for every break leaving M_AB a FREE born slot exists on M_AB–M_BC — a role outside the ground's domain and a role of M_BC outside its image
    const ground = RD.ground(MAB, MBC) ?? new Map(); const dom = new Set(ground.keys()); const im = new Set(ground.values());
    const freeBC = RD.cast(MBC).roles.some((x) => !im.has(x.id));
    for (const u of r.solid.und) if (u.brokeAt.from === MAB) { bump('d3 breaks'); if (!dom.has(u.role) && freeBC) bump('d3 free'); }
  } else if (med.state === 'absent') bump(`med absent: ${unpairedW(g, med)}`);
  else { bump('medial refused'); for (const x of med.refusals) bump(`med refusal ${x.kind} inherited=${x.inherited}`); }
  // (c) THE INTERIOR FACE M_AB·M_CA·M_AD: its edges M_CA–M_AD and M_AD–M_AB descend from C–D and A–D, unmapped in the fixture — absent on every triple, both walks alike by absence
  if (int.state === 'absent') { bump(`int absent: ${unpairedW(g, int)}`); if (!readAlike(int, bornFaceOf(g, [MAB, MAD, MCA], RD))) bump('int alike FAIL'); } else bump(`int ${int.state} UNEXPECTED`);
  if (seed.state === 'refused') bump(`seed refused → medial ${med.state} · corner-cell ${cc.state}`);
}
note(`the 42 triples under the transport: ${J(stat)}`);
check('§1 ★★ M1 (a) — THE GROUND IS GEN 0\'s, NO LEFTOVER CARRIED: the CORNER-CELL face A·AB·AC reads exactly where the seed face A·B·C has a Fix at A (6 of 42 triples), and there its SOLID reading at A IS the seed face\'s Fix at A — the coordinate map out, the inherited step between (D15), the coordinate map back — with no Mov (the inherited never moves) and the rest Und; on the other 36 the inherited step on AB–AC is EMPTY and the face is ABSENT, named by its parent edge\'s silence (`nothing paired on A–B` / `B–C` — the edge whose pairings would fill it), never a Fix on a role nobody paired',
  stat['corner-cell read'] === 6 && stat['a: cc solid fix = seed fix at A'] === 6 && !stat['a: cc FAIL'] && !stat['a: cc absent with a seed Fix FAIL'] && !stat['cc solid mov'] && stat['corner-cell absent'] === 36 && !stat['cc refused'] && stat['seed read'] === 36 && stat['seed refused'] === 6, J(stat));
check('§1 ★★ M1 (b) — NO IDENTITY WITHOUT HIS PAIRING: the MEDIAL triangle with the born rooms empty reads only where the three pairings compose around the seed face (6 of 42; absent on 36 — every medial edge\'s inherited step empty), its solid Mov 0 everywhere, every Fix instance\'s A-coordinate a Fix of the seed face at A, every Und breaking on the first step with its DESCENT the parent seed edge A–B; a free born slot on AB–BC for every such break (both hands reachable); the INTERIOR face absent on all 42 (its edges descend from A–D and C–D, unmapped), both walks alike by absence',
  stat['medial read'] === 6 && stat['medial absent'] === 36 && !stat['medial refused'] && !stat['med solid mov'] && stat['b: med fix ⊆ seed fix'] === 6 && !stat['b: med FAIL'] && !stat['descent FAIL'] && stat['d3 breaks'] === stat['med solid und'] && stat['d3 free'] === stat['d3 breaks'] && stat['interior absent'] === 42 && !stat['int alike FAIL'] && Object.keys(stat).every((k) => !/UNEXPECTED/.test(k)), J(stat));

// ═══ §2 HIS PAIRS ON THE MEDIAL EDGES — the shapes, on this witness's own draws ═══
console.log('\n----- §2 his pairs on the medial triangle\'s edges: the extension monotone over the ground, every added route through his pair, refusals only grow, the two walks of an interior face can differ -----');
const rngOf = (seed) => { let s = seed >>> 0; const next = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; return { next, int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)), sample: (arr, k) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, k); } }; };
/** random born pairs on a medial edge: FREE slots on both sides (outside the ground — the inherited step), the pair keys oriented to the edge's own vertexIds */
const drawBorn = (g, u, v, rng, kMax = 2) => {
  const e = edgeBetween(g.edges, u, v); const RD = bornReadersOf(g);
  const ground = RD.ground(e.vertexIds[0], e.vertexIds[1]) ?? new Map();
  const dom = new Set(ground.keys()); const im = new Set(ground.values());
  const l = RD.cast(e.vertexIds[0]).roles.map((r) => r.id).filter((id) => !dom.has(id)); const r = RD.cast(e.vertexIds[1]).roles.map((x) => x.id).filter((id) => !im.has(id));
  const k = rng.int(1, Math.max(1, Math.min(l.length, r.length, kMax)));
  const xs = rng.sample(l, k); const ys = rng.sample(r, k);
  e.identification = { roles: xs.map((x, i) => [x, ys[i]]).filter(([, y]) => y !== undefined), types: [] };
  return e.identification.roles.length;
};
const clearBorn = (g, u, v) => { const e = edgeBetween(g.edges, u, v); delete e.identification; };
const rkey = (r) => [`${r.first.type}|${r.first.terms.join(',')}|${r.first.value}`, `${r.second.type}|${r.second.terms.join(',')}|${r.second.value}`].sort().join('||') + `|${r.kind}`;
const solidH = (result, k) => { const steps = [result.walk.steps[k], result.walk.steps[(k + 1) % 3], result.walk.steps[(k + 2) % 3]]; const h = new Map(); for (const id of result.readings[k].space.roles.map((r) => r.id)) { const b = steps[0].solidMap.get(id); const c = b === undefined ? undefined : steps[1].solidMap.get(b); const a = c === undefined ? undefined : steps[2].solidMap.get(c); if (a !== undefined) h.set(id, a); } return h; };
const s2 = {}; const b2 = (k, n = 1) => { s2[k] = (s2[k] ?? 0) + n; };
const rng = rngOf(261);
for (const [fp, tf, tp] of triples) {
  const g = shapes.get(`${fp}+${tf}+${tp}`);
  const { MAB, MBC, MCA, MAD } = cornersOf(g);
  const solidMed = bornFaceOf(g, [MAB, MBC, MCA], bornReadersOf(g));
  for (let d = 0; d < 40; d += 1) {
    const n = drawBorn(g, MAB, MBC, rng) + drawBorn(g, MBC, MCA, rng) + drawBorn(g, MCA, MAB, rng);
    b2('draws'); b2('born pairs drawn', n);
    const med = bornFaceOf(g, [MAB, MBC, MCA], bornReadersOf(g));
    b2(`medial with pairs ${med.state}`);
    if (med.state === 'read') {
      for (let k = 0; k < 3; k += 1) {
        const r = med.readings[k];
        // (a4) monotone OVER THE GROUND: every route of the solid reading is kept; every added route runs through his pair; the news is exactly what the solid did not carry
        const hs = solidH(med, k);
        if (![...hs].every(([x, y]) => r.full.h.get(x) === y)) b2('a4 FAIL');
        if (J([...r.solid.h].sort()) !== J([...hs].sort())) b2('solid-h FAIL');
        for (const nw of r.news) { b2('news'); if (!nw.through.length) b2('a4news FAIL'); if (hs.get(nw.role) === nw.to) b2('news-not-new FAIL'); }
        if (r.news.length !== [...r.full.h].filter(([x, y]) => hs.get(x) !== y).length) b2('news-count FAIL');
        // the extension's steps ARE the transport's, the ground's the transport's ground (the readers handed in — pinned, not assumed)
        for (const st of med.walk.steps) { const T = transportStepOf(g, st.from, st.to); const G = transportGroundOf(g, st.from, st.to); if (J([...st.map]) !== J([...T]) || J([...st.solidMap]) !== J([...G])) b2('steps FAIL'); }
      }
      if (solidMed.state === 'read') { for (let k = 0; k < 3; k += 1) if (!solidMed.readings[k].solid.fix.every((x) => med.readings[k].full.h.get(x) === x)) b2('solid-kept FAIL'); }
    }
    // (b3) refusals only grow: every refusal standing with the born rooms empty stands with his pairs (inherited); a new one is attributed to his pair on its hands
    if (solidMed.state === 'refused') {
      if (med.state !== 'refused') b2('b3 FAIL');
      else { const keys = new Set(med.refusals.map(rkey)); for (const r of solidMed.refusals) if (!keys.has(rkey(r))) b2('b3 FAIL'); }
    }
    if (med.state === 'refused') { b2('draws refusing'); const born = med.refusals.filter((r) => !r.inherited); if (born.length) { b2('draws adding a refusal'); for (const r of born) if (!r.through.length) b2('unattributed new refusal FAIL'); } for (const r of med.refusals) b2(`refusal kind ${r.kind}`); }
    // (e1) the interior face with his pairs on its three edges, both walks — M_AD holds a child only where A–D is paired (D11: a born
    // vertex's roles are his instances on the parent edge; an unpaired edge's midpoint holds NONE), so A–D and C–D are given two
    // pairings each first (the casts' own roles, deterministic), cleared after
    clearBorn(g, MAB, MBC); clearBorn(g, MBC, MCA); clearBorn(g, MCA, MAB);
    const { A: vA, C: vC, D: vD } = cornersOf(g);
    const pairSeed = (X, Y, cx, cy) => { const e = edgeBetween(g.edges, X, Y); const xs = cx.roles.slice(0, 2).map((r) => r.id); const ys = cy.roles.slice(0, 2).map((r) => r.id); const pairs = xs.map((x, i) => [x, ys[i]]); e.identification = { roles: e.vertexIds[0] === X ? pairs : pairs.map(([x, y]) => [y, x]), types: [] }; };
    pairSeed(vA, vD, flow, tri); pairSeed(vC, vD, phi, tri);
    drawBorn(g, MAB, MCA, rng); drawBorn(g, MCA, MAD, rng); drawBorn(g, MAD, MAB, rng);
    const RDi = bornReadersOf(g);
    const fwd = bornFaceOf(g, [MAB, MCA, MAD], RDi); const bwd = bornFaceOf(g, [MAB, MAD, MCA], RDi);
    b2(`interior with pairs ${fwd.state}`);
    if (!readAlike(fwd, bwd)) b2('e1 differ');
    if (fwd.state === 'read') for (const r of fwd.readings) b2('interior news', r.news.length);
    clearBorn(g, MAB, MCA); clearBorn(g, MCA, MAD); clearBorn(g, MAD, MAB); clearBorn(g, vA, vD); clearBorn(g, vC, vD);
  }
}
note(`this witness's draws: ${J(s2)}`);
check('§2 ★★ THE EXTENSION IS MONOTONE OVER THE GROUND (a4): with his pairs on free slots of the medial triangle\'s three edges the face READS (his pairs alone carry it where the inherited carried nothing), every route of the solid reading is kept, every ADDED route runs through at least one pair of his, and the news at a corner is exactly the routes the solid did not carry — 0 failures over the draws; every step of the walk is the transport\'s and every ground the transport\'s ground (the readers handed in, pinned)',
  s2.draws === 1680 && (s2['medial with pairs read'] ?? 0) > 0 && !s2['a4 FAIL'] && !s2['solid-h FAIL'] && !s2['a4news FAIL'] && !s2['news-not-new FAIL'] && !s2['news-count FAIL'] && !s2['steps FAIL'] && !s2['solid-kept FAIL'] && (s2.news ?? 0) > 0, J(s2));
check('§2 ★★ REFUSALS ONLY GROW (b3, at the grain of PAIRS, the seed face\'s own guard at every corner — the child\'s induced tuples and marks, the instance\'s mode among them): every refusal standing with the born rooms empty stands under every draw, and every NEW refusal is attributed to his pair on its hands — 0 failures',
  !s2['b3 FAIL'] && !s2['unattributed new refusal FAIL'], J(s2));
check('§2 ★ AN INTERIOR FACE\'S TWO WALKS with his pairs on its three edges: read on this generator, and the two walks can differ (the reverse walk IS a face of this solid, the other cell\'s: the surface names the cell each reading walks)', (s2['interior with pairs read'] ?? 0) > 0 && (s2['e1 differ'] ?? 0) > 0, J(s2));

// ═══ §3 THE SURFACE at a gen-2 site on the lawful path ═══
console.log('\n----- §3 the surface: the born faces at ABAC named at the site, read at their homes — through the transport; the corner cell\'s own face reads like every born face -----');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { ConceptSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const { SelectedFaceReading } = req('src/components/Panels.tsx'); // C-10b: the face's HOME — where a born face's reading prints, once
const { useGeometryStore } = req('src/store/geometryStore.ts');
const render = (el) => renderToString(el).replace(/<!-- -->/g, '');
const unescapeHtml = (s) => (s ?? '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
const countOf = (html, name) => (html.match(new RegExp(`${name}="`, 'g')) || []).length;
const visibleText = (html) => unescapeHtml(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
// the lawful path through the store: casts on the seed's corners, the acts by pairing, two dissections
const lawful = JSON.parse(J(seed0));
useGeometryStore.setState({ shapes: { [lawful.id]: lawful }, currentShapeId: lawful.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {} });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
S().applyAmboDissectionToCurrent();
const give = (X, Y, map) => { const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y)); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
give('A', 'B', inv(HAND_TF.A)); give('B', 'C', HAND_TP.P); give('C', 'A', inv(J_FP['(i)']));
S().selectCell(cur().cells.find((x) => x.kind === 'core').id);
S().applyAmboDissectionToCurrent();
const G2 = cur();
const ABAC = Object.values(G2.vertices).find((v) => v.data.label === 'ABAC').id;
const surfaceAt = (id) => render(React.createElement(ConceptSurface, { shape: cur(), vertexId: id }));
// C-10b (§131 item 2): the site's TOP names each born face through it in a line; the READING prints once, at the face's home
const homeAt = (faceId) => render(React.createElement(SelectedFaceReading, { shape: cur(), faceId }));
const siteFaceIds = () => midpointSiteOf(cur(), ABAC, buildGeneralSitePacketPresenterReport(cur()).packets.find((x) => x.trace.siteId === ABAC).trace).sources.filter((s) => s.cycle.length === 3).map((s) => s.faceId);
const linesAt = (html) => [...html.matchAll(/data-midpoint-born-face-at-site="([^"]*)" data-midpoint-born-face-kind="([^"]*)"/g)].map((m) => ({ name: unescapeHtml(m[1]), kind: m[2] }));
const blocksOf = (html) => html.split('data-midpoint-born-face="').slice(1).map((s) => {
  const name = s.slice(0, s.indexOf('"'));
  return { name, cells: (s.match(/data-midpoint-born-face-cells="(\d)"/) || [])[1], alike: (s.match(/data-midpoint-born-face-alike="(\w+)"/) || [])[1] ?? null, alikeLine: countOf(s, 'data-midpoint-born-face-alike-line'),
    states: [...s.matchAll(/data-midpoint-born-face-state="(\w+)"/g)].map((m) => m[1]), absent: [...s.matchAll(/data-midpoint-born-face-absent="([\w-]+)"/g)].map((m) => m[1]),
    ground: countOf(s, 'data-midpoint-born-face-line="ground'), noNews: (s.match(/data-midpoint-born-face-line="no-news"/g) || []).length, news: [...s.matchAll(/data-midpoint-born-face-news="([^"]*)"/g)].map((m) => unescapeHtml(m[1])),
    hands: [...s.matchAll(/data-midpoint-born-face-hands="[^"]*"[^>]*>([^<]*)</g)].map((m) => unescapeHtml(m[1])), text: visibleText(s) };
});
const homesAt = () => siteFaceIds().map((fid) => ({ fid, head: (homeAt(fid).match(/data-face-home-kind="([\w-]+)"/) || [])[1], blocks: blocksOf(homeAt(fid)) }));
const before = homesAt();
note(`ABAC's born faces at their homes, born rooms empty: ${J(before.map((h) => ({ kind: h.head, blocks: h.blocks.map((b) => ({ name: b.name, cells: b.cells, alike: b.alike, states: b.states, absent: b.absent, ground: b.ground, text: b.text.slice(0, 160) })) })))}`);
check('§3 ★★ THE SITE NAMES ITS BORN FACES, ONCE EACH, AT ITS TOP (C-10b, §131 item 2): the surface at ABAC carries one line per born face through it — the medial face (one cell) and the interior face (two cells) — each with `read it` (COPY-1 §4.7; in the corners tab), and NO born-face block (the reading prints at the face\'s home)',
  (() => { const html = surfaceAt(ABAC); const lines = linesAt(html); return lines.length === 2 && lines.some((l) => l.kind === 'one-cell') && lines.some((l) => l.kind === 'interior') && !/data-midpoint-born-face="/.test(html) && (html.match(/data-midpoint-select-face="/g) || []).length === 2 && (html.match(/>read it</g) || []).length === 2; })(),
  J(linesAt(surfaceAt(ABAC))));
check('§3 ★★ THE BORN FACES AT ABAC READ AT THEIR HOMES THROUGH THE TRANSPORT (M1): each home mounts ONE block; a face whose every edge the transport reads is `read` with its ground line once per corner; a face with an edge nothing is paired on is ABSENT and SAYS SO in COPY-1 §11.8\'s form — `no reading yet: nothing paired on <edge>` (a corner edge by the parent edge whose pairings would fill it); the interior face\'s two walks read alike (one block, the alike line) or absent alike',
  before.length === 2 && before.every((h) => h.blocks.length === 1) && before.every((h) => h.blocks[0].states.every((s) => s === 'read' || s === 'absent') && (h.blocks[0].states[0] === 'read' ? h.blocks[0].ground === 3 : h.blocks[0].absent[0] === 'unpaired' && /no reading yet: nothing paired on [A-Z]+–[A-Z]+/.test(h.blocks[0].text))) &&
    before.some((h) => h.blocks[0].cells === '2' && (h.blocks[0].states[0] === 'absent' || (h.blocks[0].alike === 'true' && h.blocks[0].alikeLine === 1))),
  J(before.map((h) => ({ kind: h.head, blocks: h.blocks.map((b) => ({ states: b.states, absent: b.absent, ground: b.ground, alike: b.alike, text: b.text.slice(0, 200) })) }))));
// the corner cell's own face at its home: a block like every born face (M1 — the old `every role returns to itself` was the leftovers' ordinary)
const cornerCellFace = G2.faces.find((f) => f.vertexIds.length === 3 && f.vertexIds.includes(byLabel(G2, 'A')) && f.vertexIds.includes(Object.values(G2.vertices).find((v) => v.data.label === 'AB').id) && f.vertexIds.includes(Object.values(G2.vertices).find((v) => v.data.label === 'AC').id));
const ccHome = cornerCellFace ? homeAt(cornerCellFace.id) : '';
const ccBlocks = blocksOf(ccHome);
note(`the corner cell's own face ${cornerCellFace ? 'found' : 'NOT found'} at its home: kind ${(ccHome.match(/data-face-home-kind="([\w-]+)"/) || [])[1]} · head ${J((ccHome.match(/data-face-home-head="true"[^>]*>([^<]*)</) || [])[1])} · blocks ${J(ccBlocks.map((b) => ({ states: b.states, absent: b.absent, ground: b.ground, text: b.text.slice(0, 200) })))}`);
check('§3 ★★ THE CORNER CELL\'S OWN FACE reads like every born face (M1): its home carries the head `face A·AB·AC, the corner cell\'s own` (COPY-1 §4.7 — never `every role at its corner returns to itself`, the identity regime\'s leftovers) and ONE block — read with its ground lines, or absent naming the parent edge whose pairings would fill its corner edge',
  Boolean(cornerCellFace) && /data-face-home-kind="corner-cell"/.test(ccHome) && /the corner cell's own/.test(visibleText(ccHome)) && !/returns to itself/.test(visibleText(ccHome)) && ccBlocks.length === 1 && (ccBlocks[0].states[0] === 'read' ? ccBlocks[0].ground === 3 : ccBlocks[0].absent[0] === 'unpaired' && /no reading yet: nothing paired on [A-Z]+–[A-Z]+/.test(ccBlocks[0].text)),
  visibleText(ccHome).slice(0, 300));
// a pair of his on AB–AC (the site's own medial edge): where the face then reads, the news is marked and attributed to his pair at ABAC
const site = midpointSiteOf(G2, ABAC, buildGeneralSitePacketPresenterReport(G2).packets.find((x) => x.trace.siteId === ABAC).trace);
const eAC = site.edge; const RD2 = bornReadersOf(G2);
const groundAC = RD2.ground(eAC.vertexIds[0], eAC.vertexIds[1]) ?? new Map();
const free0 = RD2.cast(eAC.vertexIds[0]).roles.map((r) => r.id).filter((id) => !groundAC.has(id)); const free1 = RD2.cast(eAC.vertexIds[1]).roles.map((r) => r.id).filter((id) => ![...groundAC.values()].includes(id));
let closing = null; let tried = 0; let readsAfter = 0;
outer: for (const x of free0) for (const y of free1) {
  tried += 1;
  S().giveRolePair(eAC.id, x, y);
  const taken = cur().edges.find((e) => e.id === eAC.id).identification?.roles.some(([a, b]) => a === x && b === y);
  if (taken) {
    const after = homesAt();
    if (after.some((h) => h.blocks[0].states[0] === 'read')) readsAfter += 1;
    if (after.some((h) => h.blocks[0].news.length)) { closing = { x, y, after }; break outer; }
    S().withdrawRolePair(eAC.id, x, y);
  } else S().withdrawMidpointAttempt(eAC.id);
  if (tried >= 60) break;
}
note(`a pair of his on AB–AC: ${closing ? `${nameIn(RD2.cast(eAC.vertexIds[0]), closing.x)} ≡ ${nameIn(RD2.cast(eAC.vertexIds[1]), closing.y)} closes a route after ${tried} tried — ${J(closing.after.map((h) => h.blocks.map((b) => ({ name: b.name, states: b.states, news: b.news, noNews: b.noNews }))))}` : `none of ${tried} free pairs closes a route (a route needs every edge of the loop; faces read after a pair: ${readsAfter}) — printed, not assumed`}`);
check('§3 ★ A PAIR OF HIS ON AB–AC: where it closes a route the face\'s block carries a news line `+ <role> returns …, through the pair x ≡ y at ABAC` (COPY-1 §5.4) attributed to that pair; where no single pair closes a route (the loop needs its other edges) the witness SAYS so and the faces stay as they were',
  closing ? closing.after.some((h) => h.blocks[0].news.length > 0) && closing.after.some((h) => h.blocks[0].news.length > 0 && new RegExp(`through the pair ${nameIn(RD2.cast(eAC.vertexIds[0]), closing.x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} ≡ ${nameIn(RD2.cast(eAC.vertexIds[1]), closing.y).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} at ABAC`).test(h.blocks[0].text)) : tried > 0,
  closing ? J(closing.after.map((h) => h.blocks[0].text.slice(0, 400))) : `tried ${tried}`);

// ═══ §4 THE SOURCE — the engine's boundary and its classification ═══
const lib = readLf('src/lib/bornFace.ts');
const surf = readLf('src/components/MidpointSurface.tsx');
const tr = readLf('src/lib/transport.ts');
check('§4 ⛔ THE ENGINE IS PURE AND THE READERS ARE HANDED IN (M1, as D20 kept it): bornFace.ts imports the types, the resolver (the edge\'s kind; the identity regime\'s one-step reader kept for the stone\'s feet) and the gen-0 face (the one monodromy and the one guard) — no transport, no store, no component, nothing written; transport.ts builds the readers (`bornReadersOf`: a corner\'s space, the step, the GROUND — the inherited alone on a medial edge) with a type-only import; the manifest classifies bornFace.ts NOT_FROZEN; the surface hands the readers to the born face and mounts the block on the corner cell\'s own face too; the site names each born face with `read it`, none with `returns to itself`',
  (lib.match(/^import /gm) || []).length === 3 && lib.includes("from './spaceOf';") && lib.includes("from './faceReading';") && !/transport|useGeometryStore|from '\.\.\/store|from '\.\.\/components|\.cast\s*=|identification\s*=|\.identification\b/.test(lib.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')) &&
    /import type \{ BornReaders \} from '\.\/bornFace';/.test(tr) && /export function bornReadersOf\(record: Shape, options: SpaceOfOptions = \{\}\): BornReaders \{/.test(tr) && /export function transportGroundOf\(/.test(tr) &&
    /^NOT_FROZEN src\/lib\/bornFace\.ts /m.test(readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt')) &&
    /const readers = useMemo\(\(\) => bornReadersOf\(shape\), \[shape\]\);/.test(surf) && /bornFaceOf\(shape, cycle, readers\)/.test(surf) && !/if \(cornerCellFace\) return null;/.test(surf) && !/every role at its corner returns to itself/.test(surf.replace(/\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '')) && surf.includes('data-midpoint-born-face-at-site=') &&
    readLf('src/components/Panels.tsx').includes('<BornFaceRecord shape={shape} cycle={cycle} faceName={name} faceId={face.id} here={null} />') && !/every role at its corner returns to itself/.test(readLf('src/components/Panels.tsx').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')) && !/returns all of its corner to itself/.test(readLf('src/manuscript/LiftedConceptSection.tsx')));

console.log(`\nDIAGNOSE-THE-BORN-FACE: ${failures === 0 ? 'ALL PASS — the born face reads through the one monodromy: the transport\'s spaces and steps, the ground gen 0\'s, the news his, the guard the seed face\'s own' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
