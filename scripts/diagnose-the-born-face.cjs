#!/usr/bin/env node

// DIAGNOSTIC — THE BORN FACE (STAMP C-9, 2026-09-23): the face reading at generation ≥ 1 through the resolver
// (src/lib/bornFace.ts) — each of a born face's three edges composing its J BY ITS KIND, the SOLID part (every born
// room empty — the ground, derived from gen 0) and the EXTENSION (with the born pairs — monotone, every added route
// attributed to the born pair it runs through), the guard over the face's WORLD naming PAIRS of tuples (a refusal that
// stands with the born rooms empty INHERITED from the seed face), `Und` addressed by an edge of the born face with its
// DESCENT derived, the domain inside spaceOf(born corner); and the surface: read at the born face's edge's SITE in the
// unfolding's sources — the solid quiet, the extension marked, Und's two hands, an interior face's two walks.
//
// ⛔ THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the engine is RUN on the researcher's own fixtures, ORDER and
// TRIPLES (born_face_reading.py, .handoff/instruments/connection_layer_reference — A flow · B t-cell · C phi ·
// D triangle; the 42 hand triples on A–B, B–C, C–A; A–D, B–D, C–D unmapped; one dissection; the medial triangle
// M_AB·M_BC·M_CA, the interior M_AB·M_CA·M_AD, the corner-cell face A·M_AB·M_CA) — the DETERMINISTIC seals reproduced
// to the digit (a1 · a2 · a3 0 failures; the medial loop moving B-only roles in 9 of 42; inherited refusals 6 of 42,
// T 7; the domain 91 of 774; Und 683 = 354 · 210 · 119; a free born slot for 354 of 354; the interior's two walks
// alike on every solid face); the RANDOM-DRAW seals pinned by their SHAPE (this witness's own generator, not theirs:
// 40 draws per triple — the reference's 315 of 1,680 added refusals and 92 of 1,680 differing walks are ITS numbers,
// quoted, not reproduced — a Python RNG cannot be replayed here; said).

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
const { spaceOf, composedOn, nameIn } = req('src/lib/spaceOf.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;

console.log('THE BORN FACE — the face at gen ≥ 1 through the resolver: the solid part the ground, the extension the news attributed to the born pair, a refusal a pair of tuples, Und with its descent; read at the site (C-9)\n');

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
const tagsOf = (R, id) => [...(R.roleContent.get(id) ?? [])];
const holds = (R, id, corner) => tagsOf(R, id).some((t) => t.startsWith(`${corner}|`));
const solidH = (result, k) => { const steps = [result.walk.steps[k], result.walk.steps[(k + 1) % 3], result.walk.steps[(k + 2) % 3]]; const h = new Map(); for (const id of result.readings ? result.readings[k].resolved.space.roles.map((r) => r.id) : []) { const b = steps[0].solidMap.get(id); const c = b === undefined ? undefined : steps[1].solidMap.get(b); const a = c === undefined ? undefined : steps[2].solidMap.get(c); if (a !== undefined) h.set(id, a); } return h; };

// ═══ §1 THE SEAL — the reference's deterministic numbers, on its fixtures, order and triples ═══
console.log('----- §1 the seal: the three born faces over the 42 hand triples, born rooms empty -----');
const stat = {}; const bump = (k, n = 1) => { stat[k] = (stat[k] ?? 0) + n; };
const shapes = new Map();
for (const [fp, tf, tp] of triples) {
  const g = shapeFor(fp, tf, tp); shapes.set(`${fp}+${tf}+${tp}`, g);
  const { A, B, MAB, MBC, MCA, MAD } = cornersOf(g);
  const med = bornFaceOf(g, [MAB, MBC, MCA]); const int = bornFaceOf(g, [MAB, MCA, MAD]); const cc = bornFaceOf(g, [A, MAB, MCA]);
  bump(`medial ${med.state}`); bump(`interior ${int.state}`); bump(`corner-cell ${cc.state}`);
  const RAB = spaceOf(g, MAB);
  const roles = RAB.space.roles.map((r) => r.id);
  const aPart = roles.filter((id) => holds(RAB, id, A));
  // (a1) the interior triangle, born rooms empty: the identity on M_AB's A-part
  if (int.state === 'read') { const r = int.readings[0]; bump(J([...r.solid.fix].sort()) === J([...aPart].sort()) && r.solid.mov.length === 0 ? 'a1 ok' : 'a1 FAIL'); }
  // (a2) the corner-cell face at A: 1 on all of A
  if (cc.state === 'read') { const r = cc.readings[0]; bump(r.solid.fix.length === flow.roles.length && r.solid.mov.length === 0 && r.solid.und.length === 0 ? 'a2 ok' : 'a2 FAIL'); }
  // (a3) the medial triangle at M_AB: ι_A ∘ (J_CA ∘ J_BC) ∘ ι_B⁻¹ — and the B-only roles it moves
  const JBC = HAND_TP[tp]; const JCA = inv(J_FP[fp]);
  const withTag = (tag) => roles.find((id) => RAB.roleContent.get(id).has(tag));
  const want = new Map();
  for (const id of roles) { const b = tagsOf(RAB, id).find((t) => t.startsWith(`${B}|`)); if (!b) continue; const c = JBC[b.slice(b.indexOf('|') + 1)]; if (!c) continue; const a = JCA[c]; if (!a) continue; const target = withTag(`${A}|${a}`); if (target) want.set(id, target); }
  const steps = med.walk.steps; const h = new Map();
  for (const id of roles) { const b1 = steps[0].solidMap.get(id); const c1 = b1 === undefined ? undefined : steps[1].solidMap.get(b1); const a1 = c1 === undefined ? undefined : steps[2].solidMap.get(c1); if (a1 !== undefined) h.set(id, a1); }
  bump(h.size === want.size && [...h].every(([k, v]) => want.get(k) === v) ? 'a3 ok' : 'a3 FAIL');
  const bOnlyMoved = [...h.keys()].filter((id) => !holds(RAB, id, A));
  if (bOnlyMoved.length) bump('a3more triples'); bump('b-only moved', bOnlyMoved.length);
  bump('glued', aPart.filter((id) => RAB.roleContent.get(id).size === 2).length); bump('dom med', h.size); bump('|M_AB|', roles.length); bump('fix med', [...h].filter(([k, v]) => k === v).length);
  // (d) Und at M_AB by the step it broke at; (d2) the descent; (d3) a free born slot
  const und = roles.filter((id) => !h.has(id)); bump('und', und.length);
  const comp = composedOn(g, RAB, spaceOf(g, MBC), [steps[0].edge.vertexIds[0], steps[0].edge.vertexIds[1]], 'medial');
  const domAB = new Set(steps[0].reversed ? comp.roles.map(([, y]) => y) : comp.roles.map(([x]) => x)); const imBC = new Set(steps[0].reversed ? comp.roles.map(([x]) => x) : comp.roles.map(([, y]) => y));
  const RBC = spaceOf(g, MBC); const freeBC = RBC.space.roles.some((r) => !imBC.has(r.id));
  for (const id of und) {
    const b1 = steps[0].solidMap.get(id);
    if (b1 === undefined) { bump('und@M_AB→M_BC'); if (holds(RAB, id, B)) bump('d2 FAIL'); if (!domAB.has(id) && freeBC) bump('d3 free'); bump('d3 breaks'); continue; }
    const c1 = steps[1].solidMap.get(b1);
    if (c1 === undefined) { bump('und@M_BC→M_CA'); if (holds(RBC, b1, byLabel(g, 'C'))) bump('d2 FAIL'); continue; }
    bump('und@M_CA→M_AB'); if (holds(spaceOf(g, MCA), c1, A)) bump('d2 FAIL');
  }
  if (med.state === 'read') for (const r of med.readings) for (const u of r.und) { const step = med.walk.steps.find((s) => s.from === u.brokeAt.from && s.to === u.brokeAt.to); if (!step || !u.descent || u.descent.from !== g.vertices[step.from].createdBy.sourceVertexIds[0] || u.descent.to !== g.vertices[step.from].createdBy.sourceVertexIds[1] || !u.descent.edge) bump('descent FAIL'); }
  // (b) refusals, born rooms empty: inherited from the seed face — by corner, deduplicated by the engine
  if (med.state === 'refused') { bump('medial refused triples'); for (const r of med.refusals) { bump(`refusals@${g.vertices[r.corner].data.label}`); bump(r.inherited ? 'inherited' : 'NOT inherited'); } }
  // THE REFERENCE'S GRAIN, ported: the face's world (union-find over the three spaces' roles joined by the solid maps) restricted to SEED roles; each seed corner's OWN record read under it, a refusal counted at the tuple met later (corner_refusals of born_face_reading.py)
  {
    const R3 = [MAB, MBC, MCA].map((v) => spaceOf(g, v)); const parent = new Map();
    const find = (z) => { let r = parent.get(z) ?? z; while (parent.get(r) !== undefined && parent.get(r) !== r) r = parent.get(r); return r; };
    const union = (a, b) => { const ra = find(a); const rb = find(b); if (ra !== rb) parent.set(ra, rb); };
    med.walk.steps.forEach((st, i) => { for (const [x, y] of st.solidMap) union(`${i}|${x}`, `${(i + 1) % 3}|${y}`); });
    const classOfTag = new Map();
    R3.forEach((Rk, k) => { for (const r of Rk.space.roles) for (const t of Rk.roleContent.get(r.id)) { const c = find(`${k}|${r.id}`); if (classOfTag.has(t) && classOfTag.get(t) !== c) union(classOfTag.get(t), c); classOfTag.set(t, c); } });
    const seedRefs = { A: 0, B: 0, C: 0 };
    for (const [X, id] of [['A', A], ['B', B], ['C', byLabel(g, 'C')]]) {
      const cs = casts[X]; const seen = new Map();
      for (const rel of cs.relations) { const k = `${rel.type}|${rel.terms.map((t) => find(classOfTag.get(`${id}|${t}`))).join(',')}`; const v = seen.get(k); if (v !== undefined && v !== rel.polarity) seedRefs[X] += 1; else if (v === undefined) seen.set(k, rel.polarity); }
      const mseen = new Map(); const { valuesAgree } = req('src/lib/jRegister.ts');
      for (const role of cs.roles) for (const [mk, v] of Object.entries(role.types ?? {})) { if (v === 'UNKNOWN') continue; const k = `${mk}|${find(classOfTag.get(`${id}|${role.id}`))}`; const w = mseen.get(k); if (w !== undefined && !valuesAgree(mk, mk, w, v)) seedRefs[X] += 1; else if (w === undefined) mseen.set(k, v); }
    }
    bump('ref flow', seedRefs.A); bump('ref T', seedRefs.B); bump('ref phi', seedRefs.C);
    if (seedRefs.A + seedRefs.B + seedRefs.C > 0) bump('ref refusing triples');
    if ((seedRefs.A + seedRefs.B + seedRefs.C > 0) !== (med.state === 'refused')) bump('grain DISAGREE');
  }
  if (int.state === 'refused') bump('interior refused'); if (cc.state === 'refused') bump('corner-cell refused');
  // (e) the interior face's two walks, solid: alike
  if (int.state === 'read') bump(readAlike(int, bornFaceOf(g, [MAB, MAD, MCA])) ? 'interior alike' : 'interior differ');
}
note(`the 42 triples: ${J(stat)}`);
check('§1 ★★ THE SOLID READINGS ARE DETERMINED BY GEN 0 (a1 · a2 · a3, 0 failures each, the reference\'s seal): the INTERIOR triangle at M_AB reads the identity on M_AB\'s A-part (flat but lossy, 1_D); the CORNER-CELL face at A reads 1 on all of A (flat and total); the MEDIAL triangle at M_AB reads ι_A ∘ (J_CA ∘ J_BC) ∘ ι_B⁻¹ — the route B → C → A on a vertex holding both',
  stat['a1 ok'] === 42 && !stat['a1 FAIL'] && stat['a2 ok'] === 42 && !stat['a2 FAIL'] && stat['a3 ok'] === 42 && !stat['a3 FAIL'] && stat['interior read'] === 42 && stat['corner-cell read'] === 42);
check('§1 ★★ THE RESEARCHER\'S AMENDMENT (a3more): the medial loop ALSO MOVES B-only roles into A-roles — 9 roles in 9 of the 42 triples; the vacuity of the seal: 234 glued roles at M_AB · the medial loop\'s domain 91 · Fix 6 (derived — not the seed face\'s own h; printing it as h would misname those 9)',
  stat['a3more triples'] === 9 && stat['b-only moved'] === 9 && stat['glued'] === 234 && stat['dom med'] === 91 && stat['fix med'] === 6, J(stat));
check('§1 ★★ REFUSABILITY INHERITED WHOLE (b1 · b2): born rooms empty, the medial triangle refuses where the seed face does — 6 of 42 triples; at the REFERENCE\'S GRAIN (each seed corner\'s own record under the face\'s world, a refusal counted at the tuple met later — ported here as the second implementation) T 7, flow 0, phi 0; the ENGINE refuses the SAME 6 triples and no other, at the grain of PAIRS (every contradicted pair of one corner\'s record, each seed pair named once though T\'s tuples live at both M_AB and M_BC — the count at that grain printed, not the reference\'s number), every refusal marked inherited; the interior and corner-cell faces refuse nothing solid (a star and a path)',
  stat['medial refused triples'] === 6 && stat['ref refusing triples'] === 6 && !stat['grain DISAGREE'] && stat['ref T'] === 7 && !stat['ref flow'] && !stat['ref phi'] && ((stat['refusals@AB'] ?? 0) + (stat['refusals@BC'] ?? 0) + (stat['refusals@CA'] ?? 0)) === stat['inherited'] && !stat['NOT inherited'] && !stat['interior refused'] && !stat['corner-cell refused'], J(stat));
check('§1 ★★ THE DOMAIN AND `Und` WITH THEIR ADDRESSES (c · d1 · d2): the medial triangle at M_AB carries 91 of 774 roles around; Und 683 — 354 break leaving M_AB (from A–B\'s silence), 210 leaving M_BC (from B–C), 119 leaving M_CA (from C–A); every break on the edge leaving a born vertex M_XY holds no Y-seed (it descends from the silence of its own parent edge X–Y — 0 failures), and the engine\'s DESCENT names exactly that parent edge',
  stat['|M_AB|'] === 774 && stat['dom med'] === 91 && stat['und'] === 683 && stat['und@M_AB→M_BC'] === 354 && stat['und@M_BC→M_CA'] === 210 && stat['und@M_CA→M_AB'] === 119 && !stat['d2 FAIL'] && !stat['descent FAIL'], J(stat));
check('§1 ★ BOTH HANDS REACHABLE (d3): for every break leaving M_AB a FREE born slot exists on M_AB–M_BC — the role outside the composed identity\'s domain and a role of M_BC outside its image — 354 of 354',
  stat['d3 breaks'] === 354 && stat['d3 free'] === 354, J({ breaks: stat['d3 breaks'], free: stat['d3 free'] }));
check('§1 ★ THE INTERIOR FACE\'S TWO WALKS READ ALIKE with the born rooms empty (e1, solid: the identity both ways) — 42 of 42', stat['interior alike'] === 42 && !stat['interior differ']);

// ═══ §2 BORN PAIRS — the shapes, on this witness's own draws ═══
console.log('\n----- §2 born pairs: the extension monotone, every added route through a born pair, refusals only grow, the two walks of an interior face can differ -----');
const rngOf = (seed) => { let s = seed >>> 0; const next = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; return { next, int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)), sample: (arr, k) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, k); } }; };
/** random born pairs on a medial edge: free slots on both sides (outside the composed identity), the pair keys oriented to the edge's own vertexIds */
const drawBorn = (g, u, v, rng, kMax = 2) => {
  const e = edgeBetween(g.edges, u, v); const R0 = spaceOf(g, e.vertexIds[0]); const R1 = spaceOf(g, e.vertexIds[1]);
  const comp = composedOn(g, R0, R1, [e.vertexIds[0], e.vertexIds[1]], 'medial');
  const dom = new Set(comp.roles.map(([x]) => x)); const im = new Set(comp.roles.map(([, y]) => y));
  const l = R0.space.roles.map((r) => r.id).filter((id) => !dom.has(id)); const r = R1.space.roles.map((x) => x.id).filter((id) => !im.has(id));
  const k = rng.int(0, Math.min(l.length, r.length, kMax));
  const xs = rng.sample(l, k); const ys = rng.sample(r, k);
  e.identification = { roles: xs.map((x, i) => [x, ys[i]]), types: [] };
  return e.identification.roles.length;
};
const clearBorn = (g, u, v) => { const e = edgeBetween(g.edges, u, v); delete e.identification; };
const rkey = (r) => [`${r.first.type}|${r.first.terms.join(',')}|${r.first.value}`, `${r.second.type}|${r.second.terms.join(',')}|${r.second.value}`].sort().join('||') + `|${r.kind}`;
const s2 = {}; const b2 = (k, n = 1) => { s2[k] = (s2[k] ?? 0) + n; };
const rng = rngOf(261);
for (const [fp, tf, tp] of triples) {
  const g = shapes.get(`${fp}+${tf}+${tp}`);
  const { MAB, MBC, MCA, MAD } = cornersOf(g);
  const solidMed = bornFaceOf(g, [MAB, MBC, MCA]);
  for (let d = 0; d < 40; d += 1) {
    const n = drawBorn(g, MAB, MBC, rng) + drawBorn(g, MBC, MCA, rng) + drawBorn(g, MCA, MAB, rng);
    b2('draws'); b2('born pairs drawn', n);
    const med = bornFaceOf(g, [MAB, MBC, MCA]);
    if (solidMed.state === 'read' && med.state === 'read') {
      for (let k = 0; k < 3; k += 1) {
        const hs = solidH(solidMed, k); const r = med.readings[k];
        // (a4) monotone: every solid route kept; every added route through a born pair
        if (![...hs].every(([x, y]) => r.full.h.get(x) === y)) b2('a4 FAIL');
        for (const nw of r.news) { b2('news'); if (!nw.through.length) b2('a4news FAIL'); if (hs.has(nw.role)) b2('news-not-new FAIL'); }
        if (r.news.length !== [...r.full.h.keys()].filter((x) => !hs.has(x)).length) b2('news-count FAIL');
      }
    }
    // (b3) refusals only grow: every inherited refusal stands with born pairs; a new one is attributed to a born pair
    if (solidMed.state === 'refused') {
      if (med.state !== 'refused') b2('b3 FAIL');
      else { const keys = new Set(med.refusals.map(rkey)); for (const r of solidMed.refusals) if (!keys.has(rkey(r))) b2('b3 FAIL'); }
    }
    if (med.state === 'refused') { const born = med.refusals.filter((r) => !r.inherited); if (born.length) { b2('draws adding a refusal'); for (const r of born) if (!r.through.length) b2('unattributed new refusal FAIL'); } }
    // (e1) the interior face with born pairs on its three edges, both walks
    clearBorn(g, MAB, MBC); clearBorn(g, MBC, MCA); clearBorn(g, MCA, MAB);
    drawBorn(g, MAB, MCA, rng); drawBorn(g, MCA, MAD, rng); drawBorn(g, MAD, MAB, rng);
    const fwd = bornFaceOf(g, [MAB, MCA, MAD]); const bwd = bornFaceOf(g, [MAB, MAD, MCA]);
    if (!readAlike(fwd, bwd)) b2('e1 differ');
    if (fwd.state === 'read') for (const r of fwd.readings) b2('interior news', r.news.length);
    clearBorn(g, MAB, MCA); clearBorn(g, MCA, MAD); clearBorn(g, MAD, MAB);
  }
}
note(`this witness's draws: ${J(s2)} (the reference's own: born pairs add a refusal in 315 of 1,680 draws; the two walks differ in 92 of 1,680 — its RNG, not reproduced)`);
check('§2 ★★ THE EXTENSION IS MONOTONE (a4): with born pairs on the medial triangle\'s three edges, every solid route is kept and every ADDED route runs through at least one born pair — 0 failures over the draws; the news at a corner is exactly the routes the solid did not carry',
  s2.draws === 1680 && !s2['a4 FAIL'] && !s2['a4news FAIL'] && !s2['news-not-new FAIL'] && !s2['news-count FAIL'] && (s2.news ?? 0) > 0, J(s2));
check('§2 ★★ REFUSALS ONLY GROW (b3, at the grain of PAIRS): every refusal standing with the born rooms empty stands under every draw (the face never stops refusing; no contradicted pair un-contradicts), and every NEW refusal is attributed to a born pair on its merge path — 0 failures; the draws that add a refusal are counted, not pinned',
  !s2['b3 FAIL'] && !s2['unattributed new refusal FAIL'] && (s2['draws adding a refusal'] ?? 0) > 0, J(s2));
check('§2 ★ AN INTERIOR FACE\'S TWO WALKS CAN DIFFER with born pairs (e1) — found on this generator (the reverse walk IS a face of this solid, the other cell\'s: the surface names the cell each reading walks)', (s2['e1 differ'] ?? 0) > 0, J(s2));

// ═══ §3 THE SURFACE at a gen-2 site on the lawful path ═══
console.log('\n----- §3 the surface: the born face read at ABAC in the unfolding\'s sources — the solid quiet, the extension marked after a born pair, the hands, the interior face\'s two walks -----');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { ConceptSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const { SelectedFaceReading } = req('src/components/Panels.tsx'); // C-10b: the face's HOME — where a born face's reading prints, once
const { useGeometryStore } = req('src/store/geometryStore.ts');
const render = (el) => renderToString(el).replace(/<!-- -->/g, '');
const unescapeHtml = (s) => (s ?? '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
const attrsOf = (html, name) => [...html.matchAll(new RegExp(`${name}="([^"]*)"`, 'g'))].map((m) => unescapeHtml(m[1]));
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
const blocksAtHome = () => siteFaceIds().flatMap((fid) => blocksOf(homeAt(fid)));
const linesAt = (html) => [...html.matchAll(/data-midpoint-born-face-at-site="([^"]*)" data-midpoint-born-face-kind="([^"]*)"/g)].map((m) => ({ name: unescapeHtml(m[1]), kind: m[2] }));
const blocksOf = (html) => html.split('data-midpoint-born-face="').slice(1).map((s) => { const name = s.slice(0, s.indexOf('"')); const body = s.slice(0, s.indexOf('data-midpoint-source=') > 0 ? s.indexOf('data-midpoint-source=') : undefined); return { name, cells: (body.match(/data-midpoint-born-face-cells="(\d)"/) || [])[1], alike: (body.match(/data-midpoint-born-face-alike="(\w+)"/) || [])[1] ?? null, states: attrsOf(body, 'data-midpoint-born-face-state'), ground: (body.match(/data-midpoint-born-face-line="ground"/g) || []).length, noNews: (body.match(/data-midpoint-born-face-line="no-news"/g) || []).length, news: attrsOf(body, 'data-midpoint-born-face-news'), hands: [...body.matchAll(/data-midpoint-born-face-hands="[^"]*"[^>]*>([^<]*)</g)].map((m) => unescapeHtml(m[1])), alikeLine: countOf(body, 'data-midpoint-born-face-alike-line'), text: visibleText(body).slice(0, 700) }; });
const before = blocksAtHome();
note(`ABAC before a born pair: ${J(before.map((b) => ({ name: b.name, cells: b.cells, alike: b.alike, states: b.states, ground: b.ground, noNews: b.noNews, news: b.news, hands: b.hands })))}`);
check('§3 ★★ THE SITE NAMES ITS BORN FACES, ONCE EACH, AT ITS TOP (C-10b, §131 item 2): the surface at ABAC carries one line per born face through it — the medial face (one cell) and the interior face (two cells) — each with `select it to read it`, and NO born-face block (the reading prints at the face\'s home)',
  (() => { const html = surfaceAt(ABAC); const lines = linesAt(html); return lines.length === 2 && lines.some((l) => l.kind === 'one-cell') && lines.some((l) => l.kind === 'interior') && !/data-midpoint-born-face="/.test(html) && (html.match(/data-midpoint-select-face="/g) || []).length === 2 && /select it to read it/.test(html); })(),
  J(linesAt(surfaceAt(ABAC))));
check('§3 ★★ THE BORN FACES AT ABAC READ AT THEIR HOMES (C-10b places C-9\'s blocks where the face is selected): the two sources\' faces are read through the resolver — the MEDIAL face AB·BC·AC (one cell) and the INTERIOR face AB·AD·AC (two cells, walked as the host\'s, its other walk reading ALIKE with the born rooms empty — one block and one line saying so); each read, the solid\'s GROUND stated once per corner (quiet), `nothing added by a pair of yours yet` before any born pair, Und\'s hands leading with WHERE (`here, on AC–AB` at this site) and naming the descent; the corner cell\'s face A·AB·AC carries no block (not a source here)',
  before.length === 2 && before.some((b) => /AB·BC·AC|AC·AB·BC|BC·AC·AB/.test(b.name) && b.cells === '1') && before.some((b) => /AB·AD·AC|AC·AB·AD|AD·AC·AB/.test(b.name) && b.cells === '2' && b.alike === 'true' && b.alikeLine === 1) &&
    before.every((b) => b.states.length === 1 && b.states[0] === 'read' && b.ground === 3 && b.noNews === 3 && b.news.length === 0 && b.hands.length > 0 && b.hands.every((h) => /^(here, on [A-Z]+–[A-Z]+|at [A-Z]+, on [A-Z]+–[A-Z]+): a pair of yours( · or at [A-Z]+, on [A-Z]–[A-Z]: an act on the edge it descends from)?$/.test(h)) && b.hands.some((h) => /^at ABAC, on /.test(h))),
  J(before.map((b) => ({ name: b.name, cells: b.cells, alike: b.alike, states: b.states, ground: b.ground, noNews: b.noNews, hands: b.hands, text: b.text.slice(0, 300) }))));
// a born pair on AB–AC that CLOSES a route: search the free slots for one whose route returns at some corner
const site = midpointSiteOf(G2, ABAC, buildGeneralSitePacketPresenterReport(G2).packets.find((x) => x.trace.siteId === ABAC).trace);
const eAC = site.edge; const R0 = spaceOf(G2, eAC.vertexIds[0]); const R1 = spaceOf(G2, eAC.vertexIds[1]);
const compAC = composedOn(G2, R0, R1, [eAC.vertexIds[0], eAC.vertexIds[1]], 'medial');
const dom = new Set(compAC.roles.map(([x]) => x)); const im = new Set(compAC.roles.map(([, y]) => y));
const free0 = R0.space.roles.map((r) => r.id).filter((id) => !dom.has(id)); const free1 = R1.space.roles.map((r) => r.id).filter((id) => !im.has(id));
let closing = null; let tried = 0;
outer: for (const x of free0) for (const y of free1) {
  tried += 1;
  S().giveRolePair(eAC.id, x, y);
  const taken = cur().edges.find((e) => e.id === eAC.id).identification?.roles.some(([a, b]) => a === x && b === y);
  if (taken) {
    const after = blocksAtHome();
    if (after.some((b) => b.news.length)) { closing = { x, y, after }; break outer; }
    S().withdrawRolePair(eAC.id, x, y);
  } else S().withdrawMidpointAttempt(eAC.id);
}
note(`a born pair that closes a route at ABAC: ${closing ? `${nameIn(R0.space, closing.x)} ↦ ${nameIn(R1.space, closing.y)} after ${tried} tried — ${J(closing.after.map((b) => ({ name: b.name, alike: b.alike, states: b.states, news: b.news, noNews: b.noNews })))}` : `none of ${tried} free pairs closes a route (printed, not the case)`}`);
check('§3 ★★ THE EXTENSION MARKED AND ATTRIBUTED after a born pair (the designer: the news is the person\'s own): a born pair on AB–AC that closes a route makes the face\'s block carry a news line `+ <role> returns … — through your pair x ↦ y at ABAC`, the ground line unchanged, the pair named through the spaces\' labels; where no free pair closes a route on this path, the bound is printed',
  closing ? closing.after.some((b) => b.news.length > 0) && closing.after.every((b) => b.ground === 3) && closing.after.some((b) => new RegExp(`through your pair ${nameIn(R0.space, closing.x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} ↦ ${nameIn(R1.space, closing.y).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} at ABAC`).test(b.text) || new RegExp(`through your pair ${nameIn(R1.space, closing.y).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} ↦ ${nameIn(R0.space, closing.x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} at ABAC`).test(b.text)) : (note('⚠ no route closed by a single born pair on this path — the bound'), true),
  closing ? J(closing.after.map((b) => b.text.slice(0, 400))) : 'none');
check('§3 ★ THE INTERIOR FACE\'S TWO WALKS, NAMED BY THEIR CELLS: with the born pair standing the interior face AB·AD·AC either still reads alike (one block, the alike line) or reads differently (TWO blocks, the host\'s first, each named by its cell — `walked as the parent octahedron\'s` · `walked as the residue tetrahedron at A\'s, the reverse`); the block count follows the engine\'s `readAlike`',
  (() => { const blocks = blocksAtHome(); const int = blocks.find((b) => b.cells === '2'); if (!int) return false; const both = /walked as the parent octahedron's/.test(int.text) || /walked as the core/.test(int.text); return int.alike === 'true' ? int.states.length === 1 && int.alikeLine === 1 && both : int.states.length === 2 && int.alikeLine === 0 && both && /walked as the residue tetrahedron at A's, the reverse/.test(int.text); })(),
  J(blocksAtHome().map((b) => ({ name: b.name, cells: b.cells, alike: b.alike, states: b.states, text: b.text.slice(0, 260) }))));

// ═══ §4 THE SOURCE — the engine's boundary and its classification ═══
const lib = readLf('src/lib/bornFace.ts');
const surf = readLf('src/components/MidpointSurface.tsx');
check('§4 ⛔ THE ENGINE IS PURE: bornFace.ts imports the types, the resolver, the gen-0 face and the register\'s agreement — no store, no component, nothing written (`.cast =` and `identification =` nowhere; the record read through the resolver\'s `recordOn`); the manifest classifies it NOT_FROZEN at its landing; the surface mounts `FaceRecord` on seed faces and `BornFaceRecord` on born faces',
  (lib.match(/^import /gm) || []).length === 4 && lib.includes("from './spaceOf';") && lib.includes("from './faceReading';") && lib.includes("import { valuesAgree } from './jRegister';") && !/useGeometryStore|from '\.\.\/store|from '\.\.\/components|\.cast\s*=|identification\s*=|\.identification\b/.test(lib) &&
    /^NOT_FROZEN src\/lib\/bornFace\.ts /m.test(readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt')) &&
    // C-10b: the site mounts FaceRecord on seed faces alone and NAMES each born face in a line; the born face's block mounts ONCE, at the face's home (Panels)
    !surf.includes('<BornFaceRecord ') && surf.includes("cycle.every((v) => isSeedVertex(shape, v)) ? (\n        <FaceRecord") && surf.includes('data-midpoint-born-face-at-site=') &&
    readLf('src/components/Panels.tsx').includes('<BornFaceRecord shape={shape} cycle={cycle} faceName={name} faceId={face.id} here={null} />'));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-BORN-FACE: ALL PASS — the born face reads through the resolver: the solid part the ground, the extension the news attributed to the born pair, a refusal a pair of tuples inherited or born, Und with its descent; read at the site with the interior face\'s two walks named' : `DIAGNOSE-THE-BORN-FACE: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
