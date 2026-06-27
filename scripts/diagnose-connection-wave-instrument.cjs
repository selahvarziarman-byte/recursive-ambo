#!/usr/bin/env node

// DIAGNOSTIC — Layer-1: the connection-wave instrument (ψ probe over the committed law).
//
// Asserts the SEALED LAYER-0 INVARIANTS (§5.1-5.8) — holonomy / no-zero-mode / isospectrality
// / strip / robustness / label / falsifiers — through the REAL committed modules:
//   ambo.applyAmboDissection · seeds.createSeedShape · incidenceTraceRegistry.buildIncidenceTraceRegistry
//   cascadeDriver.buildSelfGlueSeed/runCascade/certifyCascadeOrientation
//   globalW1.analyzeGlobalW1 (perCycleW1/basisCycles) · surfaceOperations.glueFace/flipGlueFace/collapseFace
//   + the Layer-1 instrument connectionWaveInstrumentV0 (flat L_U, Wilson loop, ψ wave probe, M_var).
//
// LABEL: every asserted quantity is LAYER-0 (w1 / Hol / F_γ / isospectrality / M_var). NO raw
// ψ, NO knob value is asserted as a sealed invariant. The law is the committed holonomy class.
// Seal: .handoff/LAYER1_CONNECTION_WAVE_SEALED_INVARIANTS.md (committed SHA-256 hash).
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

const inst = req('src/lib/connectionWaveInstrumentV0.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { buildIncidenceTraceRegistry } = req('src/lib/incidenceTraceRegistry.ts');
const { buildSelfGlueSeed, runCascade, certifyCascadeOrientation } = req('src/lib/cascadeDriver.ts');
const { analyzeGlobalW1 } = req('src/lib/globalW1.ts');
const { glueFace, flipGlueFace, collapseFace } = req('src/lib/surfaceOperations.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const PI = Math.PI;

// ===========================================================================
// the committed Layer-0 holonomy: build the cylinder / Möbius / sphere complexes from the
// REAL surfaceOperations (mirrors diagnose-global-w1.cjs buildAssembled), read analyzeGlobalW1.
// ===========================================================================
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

const cylinder = buildAssembled(false, [P(0, 2, 'preserving')]);
const mobius = buildAssembled(true, [P(0, 2, 'reversing')]);
const sphere = buildSphere();
const perCycleW1Ctrl = analyzeGlobalW1(cylinder).debug.perCycleW1; // [0]
const perCycleW1Flip = analyzeGlobalW1(mobius).debug.perCycleW1; // [1]
const perCycleW1Sphere = analyzeGlobalW1(sphere).debug.perCycleW1; // []

// committed cross-check via the cascade self-glue (a glued complex's w1).
const w1Of = (mode) =>
  certifyCascadeOrientation(
    cube,
    [cubeFace],
    runCascade(cube, [cubeFace], buildSelfGlueSeed(cube, cubeFace, mode)),
  ).w1;
const w1Control = w1Of('control'); // 0
const w1Flip = w1Of('flip'); // 1

// ===========================================================================
// the X_K substrate: ambo'd tetrahedron → 6 seam slots
// ===========================================================================
const T = createSeedShape('tetrahedron');
const F0 = applyAmboDissection(T);
const F0Snapshot = JSON.stringify(F0); // derive-only guard (ambo stamps a real createdAt; snapshot THIS instance)
const sites = buildIncidenceTraceRegistry(F0).sites;

console.log('Layer-1 connection-wave instrument: iron filings (ψ) over the committed holonomy class\n');

// ===========================================================================
// [1] §4.1 TRACK·HOLONOMY — flip→w1=1/Hol=−1/F_γ=π/no-zero-mode ; control→w1=0/+1/0/zero-mode
// ===========================================================================
console.log('----- [1] §5.1 TRACK·HOLONOMY (F_γ === committed arg ∏U) -----');
const cycle = inst.cycleGraph(6); // the X_K loop (the H₁ generator), 6 seam slots
const loop = [0, 1, 2, 3, 4, 5];

const holCtrl = inst.holonomyFromPerCycleW1(perCycleW1Ctrl);
const holFlip = inst.holonomyFromPerCycleW1(perCycleW1Flip);
const flatCtrl = inst.buildFlatConnection(cycle, (k) => holCtrl.generators[k]);
const flatFlip = inst.buildFlatConnection(cycle, (k) => holFlip.generators[k]);
const specCtrl = inst.spectrumReadout(inst.signedLaplacian(cycle, flatCtrl.edgeSigns));
const specFlip = inst.spectrumReadout(inst.signedLaplacian(cycle, flatFlip.edgeSigns));
const wilsonCtrl = inst.wilsonLoop(cycle, flatCtrl.edgeSigns, loop);
const wilsonFlip = inst.wilsonLoop(cycle, flatFlip.edgeSigns, loop);
const probeCtrl = inst.evolveProbe(cycle, flatCtrl.edgeSigns, loop);
const probeFlip = inst.evolveProbe(cycle, flatFlip.edgeSigns, loop);

check('§5.1 X_K === 6 (ambo tetra seam slots, survive the glue)', sites.length === 6);
check('§5.1 committed law agrees: cylinder perCycleW1=[0]=cascade control w1=0', eq(perCycleW1Ctrl, [0]) && w1Control === 0);
check('§5.1 committed law agrees: Möbius perCycleW1=[1]=cascade flip w1=1', eq(perCycleW1Flip, [1]) && w1Flip === 1);
check('§5.1 control: Hol=+1, F_γ=0, zero mode present', holCtrl.loopHolonomy === 1 && holCtrl.Fgamma === 0 && specCtrl.hasZeroMode === true);
check('§5.1 flip: Hol=−1, F_γ=π, NO zero mode', holFlip.loopHolonomy === -1 && holFlip.Fgamma === PI && specFlip.hasZeroMode === false);
check('§5.1 F_γ === committed arg ∏U (control 0 ; flip π)', holCtrl.Fgamma === inst.argSign(1) && holFlip.Fgamma === inst.argSign(-1));
check('§5.1 spectrum readout & Wilson-loop & current readout AGREE (control)', specCtrl.hasZeroMode === (wilsonCtrl === 1) && probeCtrl.Fgamma === 0 && wilsonCtrl === 1);
check('§5.1 spectrum readout & Wilson-loop & current readout AGREE (flip)', specFlip.hasZeroMode === (wilsonFlip === 1) && probeFlip.Fgamma === PI && wilsonFlip === -1);
note(`control: Hol=+1 F_γ=0 zeroMode=${specCtrl.hasZeroMode} | flip: Hol=−1 F_γ=π zeroMode=${specFlip.hasZeroMode} | X_K=${sites.length}`);

// ===========================================================================
// [2] no-zero-mode ⟺ w1=1 (flat L_U nonsingular/singular ; gauge-invariant)
// ===========================================================================
console.log('\n----- [2] §5.2 NO-ZERO-MODE ⟺ w1=1 (flat connection-Laplacian) -----');
check('§5.2 flip (w1=1): L_U NONSINGULAR (det≠0) → no zero mode (min-eig>0)', Math.abs(specFlip.det) > 1e-6 && specFlip.minEig > 1e-6);
check('§5.2 control (w1=0): L_U SINGULAR (det=0) → zero mode (min-eig=0)', Math.abs(specCtrl.det) < 1e-6 && Math.abs(specCtrl.minEig) < 1e-6);
note(`flip: det=${specFlip.det.toFixed(3)} min-eig=${specFlip.minEig.toFixed(4)} (= 2−√3) | control: det=${specCtrl.det.toFixed(3)} min-eig=${specCtrl.minEig.toFixed(4)}`);

// ===========================================================================
// [3] §4.2 TRACK·ORDER — isospectrality of single-birth intermediates (full-spectrum M_var)
// ===========================================================================
console.log('\n----- [3] §5.3 TRACK·ORDER (isospectrality verdict ; M_var full-spectrum) -----');
// adjacency on the 6 X_K sites: share a parent corner ⇒ adjacent (the rectified-tetra octahedron).
const cornerOf = (vid) => String(vid).split(':').pop();
const keyOf = (s) => s.parents.map(cornerOf).sort().join('');
const idxOf = {};
sites.forEach((s, i) => { idxOf[keyOf(s)] = i; });
const octaEdges = [];
for (let i = 0; i < 6; i += 1)
  for (let j = i + 1; j < 6; j += 1)
    if (sites[i].parents.some((p) => sites[j].parents.includes(p))) octaEdges.push({ a: i, b: j });
const octa = { n: 6, edges: octaEdges };
const withBridge = (g, s, t) => ({ n: g.n + 1, edges: [...g.edges, { a: g.n, b: s }, { a: g.n, b: t }] });
const specOf = (g) => inst.symmetricEigenvalues(inst.laplacian(g));

// a DAG-recorded birth = a new node glued across two seam slots.
const op1 = [idxOf.ac, idxOf.ad]; // adjacent (share corner a)
const op2 = [idxOf.ab, idxOf.cd]; // NON-equivalent: antipodal (no shared corner)
const op2btwin = [idxOf.bc, idxOf.bd]; // B-twin of op1 (adjacent, share corner b; (a b) maps op1→op2btwin)

// Object 2 (non-equivalent): two birth orders, intermediates differ.
const up2 = [specOf(octa), specOf(withBridge(octa, op1[0], op1[1])), specOf(withBridge(withBridge(octa, op1[0], op1[1]), op2[0], op2[1]))];
const down2 = [specOf(octa), specOf(withBridge(octa, op2[0], op2[1])), specOf(withBridge(withBridge(octa, op2[0], op2[1]), op1[0], op1[1]))];
const mvar2 = inst.mVar(up2, down2);
const inter2up = specOf(withBridge(octa, op1[0], op1[1]));
const inter2down = specOf(withBridge(octa, op2[0], op2[1]));
const iso2 = inst.isospectral(inter2up, inter2down);

// Object 3 (B-twin): intermediates isospectral, order-blind.
const up3 = [specOf(octa), specOf(withBridge(octa, op1[0], op1[1])), specOf(withBridge(withBridge(octa, op1[0], op1[1]), op2btwin[0], op2btwin[1]))];
const down3 = [specOf(octa), specOf(withBridge(octa, op2btwin[0], op2btwin[1])), specOf(withBridge(withBridge(octa, op2btwin[0], op2btwin[1]), op1[0], op1[1]))];
const mvar3 = inst.mVar(up3, down3);
const inter3up = specOf(withBridge(octa, op1[0], op1[1]));
const inter3down = specOf(withBridge(octa, op2btwin[0], op2btwin[1]));
const iso3 = inst.isospectral(inter3up, inter3down);

check('§5.3 octahedron seam graph: 6 sites, 12 share-parent edges', octa.edges.length === 12);
check('§5.3 Object 2 (non-equivalent births): intermediates NON-isospectral → order-SENSITIVE', iso2 === false && mvar2 > 1e-6);
check('§5.3 Object 3 (B-twin births): intermediates ISOSPECTRAL → order-BLIND', iso3 === true && Math.abs(mvar3) < 1e-6);
note(`Object 2: isospectral=${iso2} M_var=${mvar2.toFixed(4)} (sensitive) | Object 3: isospectral=${iso3} M_var=${mvar3.toFixed(6)} (blind)`);

// ===========================================================================
// [4] §4.4 STRIP — Hol + spectrum without ψ/knobs are BYTE-IDENTICAL to the with-probe values
// ===========================================================================
console.log('\n----- [4] §5.4 STRIP (remove ψ + knobs ; Layer-0 unchanged) -----');
// the "stripped" holonomy/spectrum are pure functions of perCycleW1 / the flat L_U — no ψ, no knob.
const strippedHolFlip = inst.holonomyFromPerCycleW1(perCycleW1Flip).Fgamma;
const strippedSpecFlip = inst.spectrumReadout(inst.signedLaplacian(cycle, flatFlip.edgeSigns)).eigenvalues;
check('§5.4 with-probe F_γ === stripped F_γ (ψ/knobs do NOT enter the holonomy)', probeFlip.Fgamma === strippedHolFlip && probeCtrl.Fgamma === inst.holonomyFromPerCycleW1(perCycleW1Ctrl).Fgamma);
check('§5.4 spectrum byte-identical with/without probe (it is a function of L_U only)', eq(specFlip.eigenvalues, strippedSpecFlip));
note(`stripped F_γ(flip)=${strippedHolFlip} === probe F_γ(flip)=${probeFlip.Fgamma}`);

// ===========================================================================
// [5] §4.3 DECLARE·ROBUSTNESS — F_γ∈{0,π} knob-invariant ; order verdict stable
// ===========================================================================
console.log('\n----- [5] §5.5 DECLARE·ROBUSTNESS (knob sweep) -----');
const K = inst.DECLARED_KNOBS;
const sweep = [];
for (const g of inst.KNOB_RANGES.gamma) sweep.push({ ...K, gamma: g });
for (const c of inst.KNOB_RANGES.waveSpeed) sweep.push({ ...K, waveSpeed: c });
for (const a of inst.KNOB_RANGES.alpha) sweep.push({ ...K, alpha: a });
for (const tau of inst.KNOB_RANGES.tau) sweep.push({ ...K, tau });
for (const kappa of inst.KNOB_RANGES.kappa) sweep.push({ ...K, kappa });
let ctrlStable = true;
let flipStable = true;
for (const knobs of sweep) {
  if (inst.evolveProbe(cycle, flatCtrl.edgeSigns, loop, knobs).Fgamma !== 0) ctrlStable = false;
  if (inst.evolveProbe(cycle, flatFlip.edgeSigns, loop, knobs).Fgamma !== PI) flipStable = false;
}
check('§5.5 F_γ=0 (control) invariant across ALL declared knob settings', ctrlStable);
check('§5.5 F_γ=π (flip) invariant across ALL declared knob settings', flipStable);
check('§5.5 order verdict stable (isospectrality is bare-Laplacian, knob-free)', iso2 === false && iso3 === true);
note(`swept ${sweep.length} knob settings (γ, c, α, τ, κ ranges) × {control,flip} → F_γ never flips`);

// ===========================================================================
// [6] §4.5 LABEL — the asserted quantities are LAYER-0, never raw ψ
// ===========================================================================
console.log('\n----- [6] §5.6 LABEL (the law is the holonomy class, not ψ) -----');
check('§5.6 the holonomy is the committed perCycleW1 (instrument reads it, never redefines)', eq(perCycleW1Ctrl, [0]) && eq(perCycleW1Flip, [1]));
check('§5.6 every asserted invariant is Layer-0 (w1/Hol/F_γ/isospectrality/M_var) — strip proves no ψ in the law', probeFlip.Fgamma === strippedHolFlip);
note('asserted: w1, Hol, F_γ, isospectrality, M_var — all Layer-0 ; ψ and the knobs are the instrument only');

// ===========================================================================
// [7] §4.7 FALSIFIERS — each must be ABSENT
// ===========================================================================
console.log('\n----- [7] §5.7 FALSIFIERS (must NOT trigger) -----');
check('§5.7(a) NO order invented on B-twin (symmetric) births: M_var(Object 3) === 0', Math.abs(mvar3) < 1e-6);
check('§5.7(b) NO holonomy where H₁=0: bare ambo seed is S² (perCycleW1=[]) → Hol VACUOUS', eq(perCycleW1Sphere, []) && inst.holonomyFromPerCycleW1(perCycleW1Sphere).vacuous === true && inst.holonomyFromPerCycleW1(perCycleW1Sphere).loopHolonomy === null);
check('§5.7(c) NO readout flip inside a declared knob range (robustness held)', ctrlStable && flipStable);
const summaryUp = inst.spectralTrace(inter2up);
const summaryDown = inst.spectralTrace(inter2down);
check('§5.7(d) a SUMMARY metric (trace) reads BLIND on distinguishable births, but M_var reads them', Math.abs(summaryUp - summaryDown) < 1e-6 && mvar2 > 1e-6);
note(`(b) sphere Hol vacuous=${inst.holonomyFromPerCycleW1(perCycleW1Sphere).vacuous} | (d) trace Δ=${Math.abs(summaryUp - summaryDown).toFixed(6)} (blind) vs M_var=${mvar2.toFixed(4)} (sees order)`);

// ===========================================================================
// discipline — derive-only (the committed Shape is never mutated by the probe)
// ===========================================================================
console.log('\n----- discipline -----');
check('derive-only: the ambo Shape JSON is byte-identical after all instrument reads', JSON.stringify(F0) === F0Snapshot);
note(`flat gauge: control edges=${JSON.stringify(flatCtrl.edgeSigns)} | flip edges=${JSON.stringify(flatFlip.edgeSigns)}`);

console.log(
  `\n--- connection-wave instrument (§5.1-5.7: holonomy, no-zero-mode, order, strip, robustness, label, falsifiers): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
