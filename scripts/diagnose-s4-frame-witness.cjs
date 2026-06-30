#!/usr/bin/env node

// DIAGNOSTIC — Witness Runner: the S₄ frame (items 4–5) over committed Layer-1.
//
// Asserts the SEAL's INTEGRITY (buildability + the four falsifiers-ABSENT + the
// honesty-budget — NEVER a predicted winding) through the REAL committed modules:
//   ambo.applyAmboDissection · seeds.createSeedShape · incidenceTraceRegistry.buildIncidenceTraceRegistry
//   cascadeDriver.buildSelfGlueSeed/runCascade/certifyCascadeOrientation
//   globalW1.analyzeGlobalW1 (perCycleW1/basisCycles) · surfaceOperations.{glue,flipGlue,collapse}Face/faceEdgePairs
//   connectionWaveInstrumentV0 (buildFlatConnection, wilsonLoop, holonomyFromPerCycleW1) · genealogyDag.seamSign
//   + the NEW forced frame s4FrameWitnessV0 (the simplex frame, the director winding, the site-witness).
//
// BLIND: the runner MEASURES the per-form winding / site-witness RAW and PRINTS the table;
// it asserts NOTHING about a winding's magnitude vs any prediction (the mothership holds it).
// LABEL: every asserted quantity is buildability, a falsifier-absent, or the honesty-budget.
// Seal: .handoff/WITNESS_RUNNER_S4_FRAME_SEALED_INTEGRITY.md (committed SHA-256 hash on-repo).
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        esModuleInterop: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
      fileName: filename,
    }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const frame = req('src/lib/s4FrameWitnessV0.ts');
const inst = req('src/lib/connectionWaveInstrumentV0.ts');
const { seamSign } = req('src/lib/genealogyDag.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { buildIncidenceTraceRegistry } = req('src/lib/incidenceTraceRegistry.ts');
const { buildSelfGlueSeed, runCascade, certifyCascadeOrientation } = req('src/lib/cascadeDriver.ts');
const { analyzeGlobalW1 } = req('src/lib/globalW1.ts');
const { glueFace, flipGlueFace, collapseFace, faceEdgePairs } = req('src/lib/surfaceOperations.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const cornerOf = (vid) => String(vid).split(':').pop();
const keyOf = (parents) => parents.map(cornerOf).sort().join('');

// ===========================================================================
// substrate — F0 = ambo(tetra); the 6 X_K sites; the 12 pure-X_K faces
// ===========================================================================
const T = createSeedShape('tetrahedron');
const F0 = applyAmboDissection(T);
const F0Snapshot = JSON.stringify(F0); // derive-only guard (ambo stamps a real createdAt; snapshot THIS instance)
const midpointSet = new Set(
  Object.values(F0.vertices)
    .filter((v) => v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2)
    .map((v) => v.id),
);
const sites = buildIncidenceTraceRegistry(F0).sites;
const pureFaces = F0.faces.filter(
  (f) => f.vertexIds.length === 3 && f.vertexIds.every((v) => midpointSet.has(v)),
);

console.log('Witness Runner: the forced S₄ frame (items 4–5) over the committed Layer-1 holonomy\n');

// ---- the forced frame: cell simplex + the site octahedral axes ----
const cornerIds = [...new Set(sites.flatMap((s) => s.parents))].sort();
const cellFrame = frame.buildCellFrame(cornerIds);
// order the 6 sites along a Hamiltonian cycle of the octahedron (consecutive share a corner)
const siteByKey = {};
for (const s of sites) siteByKey[keyOf(s.parents)] = s;
const HAM = ['ab', 'ac', 'ad', 'bd', 'cd', 'bc']; // +x,+y,+z,−y,−x,−z — each consecutive pair shares a primal
const orderedSites = HAM.map((k) => siteByKey[k]);
const siteInputs = orderedSites.map((s) => ({ siteId: s.scopedVertexId, parents: s.parents }));
const siteFrames = frame.buildSiteFrames(siteInputs, cellFrame);
const axisOf = (i) => siteFrames[i].axisLabel;
const keyAt = (i) => keyOf(orderedSites[i].parents);
const witnessLabels = (idxs) => idxs.map((i) => `${keyAt(i)}(${axisOf(i)})`);

// the X_K loop graph (the intrinsic seam visits all 6 axes; consecutive are adjacent)
const cycle = inst.cycleGraph(6);
const loop = [0, 1, 2, 3, 4, 5];

// ===========================================================================
// build the AssembledComplex of a glued pure-X_K seam (the §3 intrinsic source):
// read perCycleW1 straight from the committed analyzeGlobalW1 of the real glued complex.
// ===========================================================================
const edgeKey = (u, v) => [u, v].sort((a, b) => a.localeCompare(b)).join('|');
const edgeByKey = new Map();
for (const e of F0.edges) edgeByKey.set(edgeKey(e.vertexIds[0], e.vertexIds[1]), e);
function assembledFromCascade(face, mode) {
  const trace = runCascade(F0, [face], buildSelfGlueSeed(F0, face, mode));
  const w1 = certifyCascadeOrientation(F0, [face], trace).w1;
  const repOf = (classes, id) => {
    for (const cls of classes) if (cls.includes(id)) return cls[0];
    return id;
  };
  const vClass = (v) => repOf(trace.partition[0], v);
  const eClass = (e) => repOf(trace.partition[1], e);
  const edges = trace.partition[1].map((cls) => {
    const real = F0.edges.find((e) => e.id === cls[0]);
    return { id: cls[0], u: vClass(real.vertexIds[0]), v: vClass(real.vertexIds[1]) };
  });
  const boundary = faceEdgePairs(face).map(([from, to]) => {
    const real = edgeByKey.get(edgeKey(from, to));
    const classId = eClass(real.id);
    const ae = edges.find((e) => e.id === classId);
    const dir = ae.u === vClass(from) && ae.v === vClass(to) ? 1 : -1;
    return { edge: classId, dir };
  });
  const vertices = [...new Set(face.vertexIds.map(vClass))];
  return { complex: { vertices, edges, faces: [{ boundary }] }, w1 };
}

// ---- the committed cube-based controls (mirror diagnose-global-w1 buildAssembled) ----
const cube = createSeedShape('cube');
const cubeFace = cube.faces[0];
const vsCube = cubeFace.vertexIds;
const nCube = vsCube.length;
const P = (edgeA, edgeB, mode) => ({ edgeA, edgeB, mode });
function buildAssembled(useFlip, pairings) {
  const trace = (useFlip ? flipGlueFace : glueFace)(cube, cubeFace, pairings);
  const supportOf = (corner) => trace.identified[corner];
  const parent = {};
  const find = (x) => {
    if (parent[x] === undefined) parent[x] = x;
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const union = (a, b) => {
    parent[find(a)] = find(b);
  };
  for (let k = 0; k < nCube; k += 1) find(String(k));
  for (const { edgeA, edgeB } of pairings) union(String(edgeA), String(edgeB));
  const dir = {};
  for (let k = 0; k < nCube; k += 1) dir[k] = 1;
  for (const { edgeA, edgeB, mode } of pairings) {
    const lo = Math.min(edgeA, edgeB);
    const hi = Math.max(edgeA, edgeB);
    dir[lo] = 1;
    dir[hi] = mode === 'preserving' ? -1 : 1;
  }
  const slotsByRoot = {};
  for (let k = 0; k < nCube; k += 1) (slotsByRoot[find(String(k))] ||= []).push(k);
  const edgeIdOfSlot = {};
  const edges = [];
  for (const root of Object.keys(slotsByRoot)) {
    const slots = slotsByRoot[root].sort((a, b) => a - b);
    const k0 = slots[0];
    const id = `E${k0}`;
    edges.push({ id, u: supportOf(vsCube[k0]), v: supportOf(vsCube[(k0 + 1) % nCube]) });
    for (const k of slots) edgeIdOfSlot[k] = id;
  }
  const boundary = [];
  for (let k = 0; k < nCube; k += 1) boundary.push({ edge: edgeIdOfSlot[k], dir: dir[k] });
  return { vertices: [...new Set(vsCube.map(supportOf))], edges, faces: [{ boundary }] };
}
function buildSphere() {
  const trace = collapseFace(cube, cubeFace);
  return { vertices: [trace.identified[vsCube[0]]], edges: [], faces: [{ boundary: [] }] };
}

// ===========================================================================
// [1] §5.1 BUILDABILITY — F0→6 X_K (2 parents each); pure-X_K flip→w1=1 / control→w1=0;
//     the intrinsic seam is a real pure-X_K loop (req 3).
// ===========================================================================
console.log('----- [1] §5.1 BUILDABILITY (the intrinsic w₁=1 X_K seam) -----');
const intrinsicFace = pureFaces[0];
const w1OfPure = (face, mode) =>
  certifyCascadeOrientation(F0, [face], runCascade(F0, [face], buildSelfGlueSeed(F0, face, mode))).w1;
const flipAll = pureFaces.every((f) => w1OfPure(f, 'flip') === 1);
const ctrlAll = pureFaces.every((f) => w1OfPure(f, 'control') === 0);
const asmFlip = assembledFromCascade(intrinsicFace, 'flip');
const asmCtrl = assembledFromCascade(intrinsicFace, 'control');
const seamFlip = analyzeGlobalW1(asmFlip.complex);
const seamCtrl = analyzeGlobalW1(asmCtrl.complex);
const hamAdjacent = loop.every((i) => {
  const a = orderedSites[i].parents.map(cornerOf);
  const b = orderedSites[(i + 1) % 6].parents.map(cornerOf);
  return a.some((c) => b.includes(c)); // consecutive sites share a primal corner (real X_K edge)
});

check('§5.1 F0 → exactly 6 X_K sites', sites.length === 6);
check('§5.1 each X_K site has exactly 2 parents (source-less primals)', sites.every((s) => s.parents.length === 2) && cornerIds.length === 4);
check('§5.1 12 PURE-X_K (all-midpoint) triangular faces exist', pureFaces.length === 12);
check('§5.1 a pure-X_K face flip → w1=1, control → w1=0 (real cascade)', w1OfPure(intrinsicFace, 'flip') === 1 && w1OfPure(intrinsicFace, 'control') === 0);
check('§5.1 ALL 12 pure-X_K faces: flip → w1=1 AND control → w1=0 (robust)', flipAll && ctrlAll);
check('§5.1 the intrinsic seam is a real pure-X_K LOOP: glued flip complex b₁=1, perCycleW1=[1]', seamFlip.cert.b1 === 1 && eq(seamFlip.debug.perCycleW1, [1]) && asmFlip.w1 === 1);
check('§5.1 analyzeGlobalW1 agrees with certifyCascadeOrientation (flip nonOrientable; control orientable)', seamFlip.cert.nonOrientable === true && seamCtrl.cert.nonOrientable === false);
check('§5.1 the loop visits 6 real X_K sites, each consecutive pair an X_K edge (shares a primal)', hamAdjacent);
note(`intrinsic face ${intrinsicFace.id} = [${intrinsicFace.vertexIds.map((v) => keyOf(F0.vertices[v].createdBy.sourceVertexIds)).join(',')}] | seam flip perCycleW1=${JSON.stringify(seamFlip.debug.perCycleW1)} control perCycleW1=${JSON.stringify(seamCtrl.debug.perCycleW1)}`);

// ===========================================================================
// [2] §5.2 FORCED FRAME — regular simplex; q_site=q_i+q_j signed octahedron; #knobs≤#orbits
// ===========================================================================
console.log('\n----- [2] §5.2 FORCED FRAME (regular simplex → signed octahedral axes ; zero frame knobs) -----');
const octa = frame.sitesAreSignedOctahedron(siteFrames);
// q_site === q_i + q_j exactly (re-derive from the cell frame; not assumed)
const siteSumOk = siteFrames.every((sf) => {
  const expect = [0, 1, 2].map((k) => cellFrame.qCorner[sf.parents[0]][k] + cellFrame.qCorner[sf.parents[1]][k]);
  return expect.every((x, k) => Math.abs(x - sf.qSite[k]) < 1e-9);
});
// S₄-equivariance: a transposition, a 3-cycle, a 4-cycle, and identity → each an R_σ ∈ O(3)
const perms = [[0, 1, 2, 3], [1, 0, 2, 3], [1, 2, 0, 3], [1, 2, 3, 0], [3, 2, 1, 0]];
const equivars = perms.map((p) => frame.s4EquivariantO3(p));
const allEquivariant = equivars.every((e) => e.isO3 && e.fixesSimplex);

check('§5.2 q_v is the regular simplex: Σ q_v = 0', cellFrame.sumIsZero);
check('§5.2 q_v equal length (= √3) and equal pairwise inner products (= −1)', cellFrame.equalLength && cellFrame.equalInnerProducts && Math.abs(cellFrame.commonLength - Math.sqrt(3)) < 1e-9 && Math.abs(cellFrame.commonInnerProduct - -1) < 1e-9);
check('§5.2 q_site = q_i + q_j (the 2 parents) — re-derived, not assumed', siteSumOk);
check('§5.2 the six sites are the octahedron\'s signed axes {±x,±y,±z}', octa);
check('§5.2 S₄-equivariant: each primal permutation is an R_σ ∈ O(3) fixing the simplex', allEquivariant);
check('§5.2 #knobs ≤ #orbits: the frame has ZERO free frame knobs', frame.FRAME_KNOB_COUNT === 0);
check('§5.2 #knobs ≤ #orbits: the one equivariant field weight (1) ≤ Aut(form) vertex orbits (1)', frame.knobsWithinBudget(frame.FIELD_WEIGHT_KNOB_COUNT, frame.AUT_FORM_VERTEX_ORBITS) && frame.FIELD_WEIGHT_KNOB_COUNT === 1 && frame.AUT_FORM_VERTEX_ORBITS === 1);
note(`axes: ${siteFrames.map((sf) => `${keyOf(sf.parents)}=${sf.axisLabel}`).join(' ')}`);
note(`|q_v|=${cellFrame.commonLength.toFixed(4)} q_i·q_j=${cellFrame.commonInnerProduct} | frame knobs=${frame.FRAME_KNOB_COUNT}, field-weight knobs=${frame.FIELD_WEIGHT_KNOB_COUNT} ≤ orbits=${frame.AUT_FORM_VERTEX_ORBITS}`);

// ===========================================================================
// [3] §5.3 RAW PER-FORM TABLE — item 4 (winding) + item 5 (site-witness); BLIND, assert nothing
// ===========================================================================
console.log('\n----- [3] §5.3 RAW PER-FORM TABLE (item 4 winding · item 5 site-witness — measured BLIND) -----');

// the committed holonomy classes, read from analyzeGlobalW1 of the real complexes
const perCycleW1Intrinsic = seamFlip.debug.perCycleW1; // [1] (the glued pure-X_K seam)
const cylinder = buildAssembled(false, [P(0, 2, 'preserving')]);
const klein = buildAssembled(true, [P(0, 2, 'preserving'), P(1, 3, 'reversing')]);
const sphere = buildSphere();
const perCycleW1Cyl = analyzeGlobalW1(cylinder).debug.perCycleW1; // [0]
const w1ClassKlein = analyzeGlobalW1(klein).cert.w1Class; // [0,1]
const perCycleW1Sphere = analyzeGlobalW1(sphere).debug.perCycleW1; // []

const rows = [];
const fmtWind = (w) => (w.vacuous ? 'vacuous (no cycle)' : `${w.directorReturn} (∏U=${w.windingSign}, class=${w.windingClass})`);
const pushRow = (form, w, wit, extra) => {
  rows.push({ form, winding: fmtWind(w), witness: wit.localized ? witnessLabels(wit.witnessSites).join(',') : '∅', extra: extra || '' });
};

// (1) w₁=1 form — the intrinsic cycle
const r1 = frame.runFrameWitness(cycle, perCycleW1Intrinsic, loop);
pushRow('w₁=1 intrinsic (pure-X_K flip seam)', r1.winding, r1.witness, `wilson=${r1.wilsonCrossCheck}`);

// (2) canonical-cycle control — the SAME w₁=1 connection on a CONTRACTIBLE backtrack loop
const flipConn = inst.buildFlatConnection(cycle, (k) => frame.runFrameWitness(cycle, perCycleW1Intrinsic, loop).generators[k]);
const contractibleLoop = [0, 1, 2, 1]; // 0→1→2→1→0: out-and-back, bounds (uses no seam edge)
const r2w = frame.directorWinding(cycle, flipConn.edgeSigns, contractibleLoop);
const r2wit = frame.siteWitness(cycle, flipConn.edgeSigns, contractibleLoop);
pushRow('canonical-cycle control (contractible loop, same U)', r2w, r2wit);

// (3) w₁=0 control — the orientable cylinder (a real generator that does NOT wind)
const r3 = frame.runFrameWitness(cycle, perCycleW1Cyl, loop);
pushRow('w₁=0 control (cylinder)', r3.winding, r3.witness, `wilson=${r3.wilsonCrossCheck}`);

// (4) H₁=0 bare ambo'd seed — S² (no loop). Also the intrinsic control self-glue (perCycleW1=[]).
const r4 = frame.runFrameWitness(cycle, perCycleW1Sphere, loop);
pushRow('H₁=0 bare ambo\'d seed (S²)', r4.winding, r4.witness);

// (5) Klein — BOTH cycles (a figure-eight graph; one generator winds, one does not)
const kg = { n: 5, edges: [{ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 0 }, { a: 0, b: 3 }, { a: 3, b: 4 }, { a: 4, b: 0 }] };
const kGen = inst.holonomyFromPerCycleW1(w1ClassKlein).generators; // [+1,−1]
const kConn = inst.buildFlatConnection(kg, (k) => kGen[k]);
const kA = [0, 1, 2];
const kB = [0, 3, 4];
const kAw = frame.directorWinding(kg, kConn.edgeSigns, kA);
const kAwit = frame.siteWitness(kg, kConn.edgeSigns, kA);
const kBw = frame.directorWinding(kg, kConn.edgeSigns, kB);
const kBwit = frame.siteWitness(kg, kConn.edgeSigns, kB);
rows.push({ form: 'Klein cycle A', winding: fmtWind(kAw), witness: kAwit.localized ? `sites{${kAwit.witnessSites.join(',')}}` : '∅', extra: `wilson=${inst.wilsonLoop(kg, kConn.edgeSigns, kA)}` });
rows.push({ form: 'Klein cycle B', winding: fmtWind(kBw), witness: kBwit.localized ? `sites{${kBwit.witnessSites.join(',')}}` : '∅', extra: `wilson=${inst.wilsonLoop(kg, kConn.edgeSigns, kB)}` });

// (6) declared-knob sweep — the equivariant field weight; winding must be invariant
const weights = [0, 0.25, 0.5, 1, 2, 5];
const sweepWind = weights.map((w) => frame.transportDirector(cycle, r1.edgeSigns, loop, w).orientations.slice(-1)[0]);
const sweepInvariant = sweepWind.every((s) => s === r1.winding.windingSign);
rows.push({ form: 'declared-knob sweep (field weight)', winding: `∏U≡${r1.winding.windingSign} ∀weight (inv=${sweepInvariant})`, witness: '—', extra: `weights={${weights.join(',')}}` });

// print the RAW table (columns wide enough to never truncate a raw value)
const pad = (s, n) => (s + ' '.repeat(n)).slice(0, Math.max(n, String(s).length));
console.log(`  ${pad('FORM', 52)} ${pad('item 4: WINDING', 32)} ${pad('item 5: SITE-WITNESS', 16)} extra`);
for (const r of rows) console.log(`  ${pad(r.form, 52)} ${pad(r.winding, 32)} ${pad(r.witness, 16)} ${r.extra}`);

// the ONLY assertions here are structural cross-checks (NOT a predicted winding magnitude):
check('§5.3 the director winding EQUALS the committed Wilson loop (frame realises the law, not a new one)', r1.winding.windingSign === r1.wilsonCrossCheck && r3.winding.windingSign === r3.wilsonCrossCheck);
check('§5.3 the table is BLIND: a raw winding/witness is reported for every required form', rows.length >= 7);
note('the winding/site-witness MAGNITUDES above are RAW measurements — asserted against NO prediction (the mothership holds it).');

// ===========================================================================
// [4] §5.4 FALSIFIERS — each a check asserting it does NOT trigger
// ===========================================================================
console.log('\n----- [4] §5.4 FALSIFIERS (must NOT trigger) -----');
// F1: NO winding where H₁=0 (the bare ambo'd seed / the intrinsic control self-glue).
check('§5.4 F1: NO winding where H₁=0 (S² bare seed is vacuous → no winding, empty witness)', r4.winding.vacuous === true && r4.winding.windingSign === null && r4.witness.localized === false && eq(perCycleW1Sphere, []) && eq(seamCtrl.debug.perCycleW1, []));
// F2: NO readout flip under a declared knob (the equivariant field weight).
check('§5.4 F2: NO winding flip across the declared field-weight sweep (robust)', sweepInvariant === true);
// F3: NO winding/holonomy WITHOUT a site-witness — item 5 localises to specific X_K sites.
const windingForms = [
  { w: r1.winding, wit: r1.witness },
  { w: kAw, wit: kAwit },
  { w: kBw, wit: kBwit },
];
const f3Holds = windingForms.every((f) => (f.w.windingClass === 1 ? f.wit.localized : !f.wit.localized));
check('§5.4 F3: every winding form localises to ≥1 X_K site; every non-winding form has empty witness', f3Holds && r1.witness.localized === true && r1.witness.witnessSites.length >= 1);
// F4: NOT (#knobs > #orbits).
check('§5.4 F4: NOT (#knobs > #orbits) — the honesty-budget holds (1 ≤ 1; frame knobs 0)', !(frame.FIELD_WEIGHT_KNOB_COUNT > frame.AUT_FORM_VERTEX_ORBITS) && frame.FRAME_KNOB_COUNT === 0);
note(`F1 vacuous=${r4.winding.vacuous} | F2 sweep invariant=${sweepInvariant} | F3 winding⇔witness=${f3Holds} (intrinsic witness=${witnessLabels(r1.witness.witnessSites).join(',')}) | F4 ${frame.FIELD_WEIGHT_KNOB_COUNT}≤${frame.AUT_FORM_VERTEX_ORBITS}`);

// ===========================================================================
// [5] §5.5 §3-WATCH — the frame is reconstructed from the simplex + edge-sum ALONE
// ===========================================================================
console.log('\n----- [5] §5.5 §3-WATCH (clean frame from simplex + edge-sum ; NO cuboctahedral VE-shell) -----');
// The signed octahedron was produced from q_v (the simplex) + q_site = q_i + q_j ALONE —
// no pSimplexCoreGeometry / VE-shell import. If THAT were insufficient we would STOP and
// surface a bring-home; it is sufficient, so we record the finding.
const moduleSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/s4FrameWitnessV0.ts'), 'utf8');
const noCoreImport = !/pSimplexCoreGeometry|cuboctahedr|VE-?shell/i.test(moduleSrc.replace(/\/\/.*$/gm, ''));
check('§5.5 the six signed axes come from q_v + q_site=q_i+q_j ALONE (simplex + edge-sum sufficient)', octa && siteSumOk);
check('§5.5 NO Core / cuboctahedral VE-shell import (the clean essence suffices — no bring-home)', noCoreImport);
note('FINDING: the clean §2 frame does NOT require the VE-shell; reconstructed from the simplex + the edge-sum. (Decision stays: build-here.)');

// ===========================================================================
// [6] §5.7 LABEL — the asserted quantities are buildability + falsifiers + raw observables
// ===========================================================================
console.log('\n----- [6] §5.7 LABEL + discipline -----');
check('§5.7 LABEL: the law is the committed perCycleW1 (the frame reads it; no law/verdict written in the frame)', eq(perCycleW1Intrinsic, [1]) && eq(perCycleW1Cyl, [0]) && eq(w1ClassKlein, [0, 1]));
check('§5.7 LABEL: the winding is the committed seamSign(w1) — read, not invented', frame.intrinsicSeamSign(1) === seamSign(1) && frame.intrinsicSeamSign(1) === -1 && frame.intrinsicSeamSign(0) === 1);
check('derive-only: the ambo Shape JSON is byte-identical after all reads', JSON.stringify(F0) === F0Snapshot);
note(`asserted: buildability + 4 falsifiers-absent + honesty-budget + raw observables — NEVER a predicted winding.`);

// ===========================================================================
console.log(
  `\n--- S₄ frame witness runner (buildability · forced frame · raw table · falsifiers F1–F4 · §3-watch · LABEL): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
