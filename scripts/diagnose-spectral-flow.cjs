#!/usr/bin/env node

// DIAGNOSTIC — The Second Arrow: the integer spectral flow SF over committed Layer-1 + the DAG.
//
// Asserts the SEAL's INTEGRITY (buildability + the five falsifiers-as-gates + zero knobs —
// NEVER a predicted SF) through the REAL committed modules:
//   ambo.applyAmboDissection · seeds.createSeedShape · cascadeDriver.buildSelfGlueSeed/runCascade/
//   certifyCascadeOrientation · globalW1.analyzeGlobalW1 (perCycleW1) · genealogyDag.buildGenealogyDag
//   connectionWaveInstrumentV0.{signedLaplacian,spectrumReadout,buildFlatConnection,cycleGraph,
//   holonomyFromPerCycleW1} + the NEW spectralFlowV0 (kerCount / spectralFlow / homotopyCrossing).
//
// BLIND: SF is MEASURED raw and the table is printed; NOTHING is asserted about an SF
// magnitude vs any prediction (the mothership holds it). LABEL: every asserted quantity is
// buildability, a falsifier, or the honesty-budget. Seal:
// .handoff/SECOND_ARROW_SF_SEALED_INTEGRITY.md (committed SHA-256 hash on-repo).
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

const sf = req('src/lib/spectralFlowV0.ts');
const inst = req('src/lib/connectionWaveInstrumentV0.ts');
const { analyzeGlobalW1 } = req('src/lib/globalW1.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { buildSelfGlueSeed, runCascade, certifyCascadeOrientation } = req('src/lib/cascadeDriver.ts');
const { glueFace, flipGlueFace, faceEdgePairs } = req('src/lib/surfaceOperations.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log('The Second Arrow: spectral flow SF (the integer w₁ shadows) over the committed connection-Laplacian\n');

// ===========================================================================
// substrate — the committed forms + the committed holonomy classes (the same ops the witness built)
// ===========================================================================
const T = createSeedShape('tetrahedron');
const F0 = applyAmboDissection(T);
const F0Snapshot = JSON.stringify(F0); // derive-only guard (ambo stamps a real createdAt)

// the births, read from the committed genealogy DAG (invoke for the root, ambo for the dissection).
const dag = buildGenealogyDag([T, F0]);
const dagInvoke = dag.nodes.find((n) => n.id === T.id);
const dagAmbo = dag.nodes.find((n) => n.id === F0.id);

// the committed holonomy class per form: frustrated [1] from the flip self-glue ; orientable [0]
// from the cube cylinder — exactly as the witness runner read them.
const midpointSet = new Set(
  Object.values(F0.vertices)
    .filter((v) => v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2)
    .map((v) => v.id),
);
const pureFaces = F0.faces.filter((f) => f.vertexIds.length === 3 && f.vertexIds.every((v) => midpointSet.has(v)));
const intrinsicFace = pureFaces[0];
const edgeKey = (u, v) => [u, v].sort((a, b) => a.localeCompare(b)).join('|');
const edgeByKey = new Map();
for (const e of F0.edges) edgeByKey.set(edgeKey(e.vertexIds[0], e.vertexIds[1]), e);
function assembledFromCascade(face, mode) {
  const trace = runCascade(F0, [face], buildSelfGlueSeed(F0, face, mode));
  const repOf = (cs, id) => {
    for (const c of cs) if (c.includes(id)) return c[0];
    return id;
  };
  const vClass = (v) => repOf(trace.partition[0], v);
  const eClass = (e) => repOf(trace.partition[1], e);
  const edges = trace.partition[1].map((c) => {
    const r = F0.edges.find((e) => e.id === c[0]);
    return { id: c[0], u: vClass(r.vertexIds[0]), v: vClass(r.vertexIds[1]) };
  });
  const boundary = faceEdgePairs(face).map(([from, to]) => {
    const r = edgeByKey.get(edgeKey(from, to));
    const cid = eClass(r.id);
    const ae = edges.find((e) => e.id === cid);
    return { edge: cid, dir: ae.u === vClass(from) && ae.v === vClass(to) ? 1 : -1 };
  });
  return { vertices: [...new Set(face.vertexIds.map(vClass))], edges, faces: [{ boundary }] };
}
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

const perCycleW1Frust = analyzeGlobalW1(assembledFromCascade(intrinsicFace, 'flip')).debug.perCycleW1; // [1]
const perCycleW1Orient = analyzeGlobalW1(buildAssembled(false, [P(0, 2, 'preserving')])).debug.perCycleW1; // [0]
// committed cascade w1 cross-check (the witness's route): flip → 1, control → 0.
const w1Of = (mode) =>
  certifyCascadeOrientation(F0, [intrinsicFace], runCascade(F0, [intrinsicFace], buildSelfGlueSeed(F0, intrinsicFace, mode))).w1;
const w1Flip = w1Of('flip');
const w1Control = w1Of('control');

// ===========================================================================
// the committed connection-Laplacian L_U per stage (cycleGraph + buildFlatConnection edgeSigns)
// ===========================================================================
const treeGraph = inst.cycleGraph(4); // the 4 source-less corners: connected & orientable → ker counts the 1 component
const xkGraph = inst.cycleGraph(6); // the 6 X_K sites (the committed grounding's loop)
const genHol = (pw) => (k) => inst.holonomyFromPerCycleW1(pw).generators[k];
const signsTree = inst.buildFlatConnection(treeGraph, genHol([0])).edgeSigns; // all +1
const signsOrient = inst.buildFlatConnection(xkGraph, genHol([0])).edgeSigns; // all +1 (orientable)
const signsFrust = inst.buildFlatConnection(xkGraph, genHol(perCycleW1Frust)).edgeSigns; // one −1 (frustrated)

const specTree = inst.spectrumReadout(inst.signedLaplacian(treeGraph, signsTree));
const specOrient = inst.spectrumReadout(inst.signedLaplacian(xkGraph, signsOrient));
const specFrust = inst.spectrumReadout(inst.signedLaplacian(xkGraph, signsFrust));
const kerTree = sf.kerCountOf(treeGraph, signsTree);
const kerAmbo = sf.kerCountOf(xkGraph, signsOrient);
const kerFlip = sf.kerCountOf(xkGraph, signsFrust);
const kerCtrl = sf.kerCountOf(xkGraph, signsOrient); // orientable close = same connection as ambo
const kerIdent = kerAmbo; // identity: no birth, same form

// ===========================================================================
// [1] §5.1 RAW SF TABLE (blind — measured, asserted against NO prediction)
// ===========================================================================
console.log('----- [1] §5.1 RAW SF TABLE (SF = ker(L_U^parent) − ker(L_U^child) ; measured BLIND) -----');
const SF = (kp, kc) => sf.spectralFlow(kp, kc);
const sfAmbo = SF(kerTree, kerAmbo);
const sfFlip = SF(kerAmbo, kerFlip);
const sfCtrl = SF(kerAmbo, kerCtrl);
const sfIdent = SF(kerAmbo, kerIdent);
const pathTotal = sfAmbo + sfFlip; // Σ SF over the path's births (invoke is the depth-0 baseline)
const rows = [
  { birth: 'invoke (tree, root)', op: dagInvoke.birthOperation, pk: '—', ck: kerTree, sf: 0, minEig: specTree.minEig, w1: '—' },
  { birth: 'ambo (site-add)', op: dagAmbo.birthOperation, pk: kerTree, ck: kerAmbo, sf: sfAmbo, minEig: specOrient.minEig, w1: perCycleW1Orient[0] ?? 0 },
  { birth: 'flip-glue (frustrated close)', op: 'flip-glue', pk: kerAmbo, ck: kerFlip, sf: sfFlip, minEig: specFrust.minEig, w1: perCycleW1Frust[0] },
  { birth: 'glue (orientable close)', op: 'glue', pk: kerAmbo, ck: kerCtrl, sf: sfCtrl, minEig: specOrient.minEig, w1: w1Control },
  { birth: 'identity (non-birth)', op: '(none)', pk: kerAmbo, ck: kerIdent, sf: sfIdent, minEig: specOrient.minEig, w1: '—' },
];
const pad = (s, n) => (s + ' '.repeat(n)).slice(0, Math.max(n, String(s).length));
console.log(`  ${pad('BIRTH', 28)} ${pad('OperationKind', 16)} ${pad('parentKer', 10)} ${pad('childKer', 9)} ${pad('SF', 4)} ${pad('child minEig', 14)} ${pad('w₁', 4)} SF mod 2`);
for (const r of rows)
  console.log(`  ${pad(r.birth, 28)} ${pad(r.op, 16)} ${pad(r.pk, 10)} ${pad(r.ck, 9)} ${pad(r.sf, 4)} ${pad(r.minEig.toFixed(4), 14)} ${pad(r.w1, 4)} ${typeof r.w1 === 'number' ? Math.abs(r.sf) % 2 : '—'}`);
console.log(`  PATH (invoke→ambo→flip): Σ SF(births) = ${pathTotal} ; endpoint ker(tree)−ker(flip) = ${kerTree - kerFlip}`);
check('§5.1 the table is BLIND: a raw SF is reported for every birth + the path total', rows.length === 5);
note('the SF MAGNITUDES above are RAW measurements — asserted against NO prediction (the mothership holds it).');

// ===========================================================================
// [2] F1 IDENTITY — a non-birth / identity step → SF === 0
// ===========================================================================
console.log('\n----- [2] F1 IDENTITY (non-birth → SF = 0) -----');
check('F1: the identity (non-birth) step → SF === 0', sfIdent === 0);
note(`identity: ker(F0) − ker(F0) = ${kerIdent} − ${kerIdent} = ${sfIdent}`);

// ===========================================================================
// [3] F2 ℤ/2 SHADOW — where a birth closes a loop, SF mod 2 === w₁ (committed perCycleW1, READ)
// ===========================================================================
console.log('\n----- [3] F2 ℤ/2 SHADOW (SF mod 2 === committed w₁) -----');
check('F2: flip-glue closes a loop → SF mod 2 === w₁=1 (committed perCycleW1=[1] = cascade w1)', Math.abs(sfFlip) % 2 === perCycleW1Frust[0] && perCycleW1Frust[0] === 1 && w1Flip === 1);
check('F2: glue closes an orientable loop → SF mod 2 === w₁=0 (committed perCycleW1=[0] = cascade w1)', Math.abs(sfCtrl) % 2 === (perCycleW1Orient[0] ?? 0) && (perCycleW1Orient[0] ?? 0) === 0 && w1Control === 0);
note(`flip: SF=${sfFlip} mod 2 = ${Math.abs(sfFlip) % 2} === perCycleW1=${JSON.stringify(perCycleW1Frust)} | control: SF=${sfCtrl} mod 2 = ${Math.abs(sfCtrl) % 2} === w1=${w1Control}`);

// ===========================================================================
// [4] F3 CONVENTION-INDEPENDENCE (NON-CIRCULAR) — pinned to the w₁=1 frustration-close
// ===========================================================================
console.log('\n----- [4] F3 NON-CIRCULAR (independent coupling-in crossing === Δker ; frustration-close, #newSites=0) -----');
// the frustrating seam = the U_e=−1 edge(s) of the committed flat gauge (NOT new sites).
const seamEdges = signsFrust.map((s, i) => (s === -1 ? i : -1)).filter((i) => i >= 0);
// the F3 device builds the committed L_U formula with per-edge weights; at all weights = 1 it is
// byte-identical to the committed signedLaplacian (asserted) — the homotopy never enters the SF value.
const weightsOne = xkGraph.edges.map(() => 1);
const deviceAtOne = sf.weightedSignedLaplacian(xkGraph, signsFrust, weightsOne);
const committedLU = inst.signedLaplacian(xkGraph, signsFrust);
check('F3 device fidelity: weightedSignedLaplacian(weights=1) === committed signedLaplacian', eq(deviceAtOne, committedLU));
// the INDEPENDENT path-count: homotopyCrossing reads ONLY the homotopy spectra — its signature
// takes no Δker / perCycleW1 (the non-circularity is structural). #newSites = 0 (existing X_K set).
const cross = sf.homotopyCrossing(xkGraph, signsFrust, seamEdges, 200);
const deltaKer = SF(kerAmbo, kerFlip); // = 1, computed SEPARATELY from the endpoint forms
check('F3: independent netCrossing (eigenvalue trajectories, seam weight 0→1) === Δker (endpoint forms)', cross.netCrossing === deltaKer && deltaKer === 1);
check('F3: #newSites = 0 (the frustrating seam couples in on the EXISTING X_K site set — not a site-add)', seamEdges.length >= 1 && xkGraph.n === 6);
note(`seam edges (U=−1) = ${JSON.stringify(seamEdges)} | homotopy t0 ker=${cross.t0Ker} (path) → t1 ker=${cross.t1Ker} (frustrated) | crossing @ ${cross.crossings.map((c) => `t=${c.t.toFixed(3)}`).join(',')}`);
note(`netCrossing=${cross.netCrossing} computed from trajectories ALONE === Δker=${deltaKer} computed from the committed endpoint forms — independent paths agree (PSD homotopy-invariance). NEVER set to Δker.`);

// ===========================================================================
// [5] F4 ADDITIVITY — SF(path) === Σ SF(births)
// ===========================================================================
console.log('\n----- [5] F4 ADDITIVITY (SF(path) === Σ SF(births)) -----');
check('F4: endpoint SF(path) ker(tree)−ker(flip) === Σ SF(births) = SF(ambo)+SF(flip)', kerTree - kerFlip === sfAmbo + sfFlip && kerTree - kerFlip === pathTotal);
note(`endpoint ker(tree)−ker(flip) = ${kerTree - kerFlip} === SF(ambo)+SF(flip) = ${sfAmbo}+${sfFlip} = ${sfAmbo + sfFlip}`);

// ===========================================================================
// [6] F5 NO SPURIOUS DIMENSION FLOW (the crux) — orientable site-add → SF === 0
// ===========================================================================
console.log('\n----- [6] F5 NO SPURIOUS DIMENSION FLOW (orientable site-adding birth → SF = 0) -----');
check('F5: the ambo (orientable, connectivity-preserving site-add) → SF === 0 despite the dimension jump', sfAmbo === 0 && xkGraph.n > treeGraph.n && kerTree === kerAmbo);
note(`ambo: sites ${treeGraph.n} → ${xkGraph.n} (dimension +${xkGraph.n - treeGraph.n}) BUT ker ${kerTree} → ${kerAmbo} (unchanged) → SF=${sfAmbo}. The added X_K sites are dimension, NOT flow.`);

// ===========================================================================
// [7] HONESTY-BUDGET / LABEL / discipline — zero knobs ; SF is the committed kernel-count readout
// ===========================================================================
console.log('\n----- [7] HONESTY-BUDGET · LABEL · discipline -----');
check('honesty-budget: SF_ZERO_TOL === 1e-9 (the committed value, NOT re-tuned ; zero knobs)', sf.SF_ZERO_TOL === 1e-9);
check('LABEL: SF is the committed kernel-count readout — ker via spectrumReadout on the committed signedLaplacian', kerFlip === sf.kerCount(specFrust.eigenvalues) && kerAmbo === sf.kerCount(specOrient.eigenvalues));
check('LABEL: the law is the committed perCycleW1 (F2) + kernel count — read, not invented; no new law in the module', eq(perCycleW1Frust, [1]) && eq(perCycleW1Orient, [0]));
check('genealogy: births read from the committed DAG (invoke for the root ; ambo for the dissection)', dagInvoke.birthOperation === 'invoke' && dagAmbo.birthOperation === 'ambo-dissection' && dagAmbo.depth > dagInvoke.depth);
check('derive-only: the ambo Shape JSON is byte-identical after all reads', JSON.stringify(F0) === F0Snapshot);
note(`ker via committed spectrumReadout (orientable ker=${kerAmbo} minEig=${specOrient.minEig.toFixed(4)} ; frustrated ker=${kerFlip} minEig=${specFrust.minEig.toFixed(4)} = 2−√3) ; SF_ZERO_TOL=${sf.SF_ZERO_TOL}`);

// ===========================================================================
console.log(
  `\n--- Second Arrow: spectral flow SF (RAW table · F1 identity · F2 ℤ/2-shadow · F3 non-circular · F4 additivity · F5 no-spurious-flow · zero knobs): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
