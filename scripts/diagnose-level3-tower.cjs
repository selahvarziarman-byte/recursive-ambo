#!/usr/bin/env node

// DIAGNOSTIC — level-3 Build 2: the invariant tower (χ-consistency · w₁ · integer homology).
//
// THE SEAL (§2, researcher-sealed tuple):
//   ① 3-TORUS: χ=0 (Tier-1 consistency ✓ on the sound closed form); w₁=0
//     orientable (three preserving translations — every gluing REVERSES the
//     induced boundary orientation, §3 convention); ∂₁=∂₂=∂₃=0 exactly;
//     H₀=Z H₁=Z³ H₂=Z³ H₃=Z; torsion-free; π₁ NOT computed — H₁ exposed as its
//     abelianization, labelled.
//   ② CROSS-CHECKS: w₁ ⟺ H₃ (orientable ⟺ H₃=Z); the orientation foundation's
//     per-gluing bits ARE w₁'s support (mod-2 shadow); mode ⟺ derived bit (the
//     §3 convention) on every sealed pattern; Tier-1 vs the S² gate.
//   ③ the RATIFIED TOPOLOGICAL-TORSION VALIDATION CASE (researcher-pinned
//     identity): the z-pair re-mapped order-preserving (step +1, mode
//     'reversing', flipGlueFaces) builds the MAPPING TORUS OF THE T²-SWAP
//     φ(x,y) = (y,x) — a T²-bundle over S¹, a non-orientable flat (Bieberbach)
//     3-manifold (the S²-gate PASS is structural: a fiber bundle is a genuine
//     closed 3-manifold). The obstruction fires (w₁=1, the z-gluing the
//     support, H₃=0) and the Tier-3 SNF→torsion readout reads its Z/2.
//   ④ SNF unit tests (the torsion READOUT in isolation — the 3-torus's zero
//     maps cannot exercise it): [[2]]→Z/2 · diag(1,3)→Z/3 · [[2,4],[4,2]]→[2,6]
//     · the hand-written RP² cellular complex → H₁ = Z/2 through the full
//     homology readout. With ③ ratified, the Z/2-torsion validation gap is
//     CLOSED inside Option-A (cube) scope; odd Z/p (p>2) and lens L(p,q) still
//     need non-cube (order-p) domains — the cube's face-symmetry is D₄
//     (orders 1/2/4 only; the softened tower §5 note).
//   ⑤ byte-unchanged guards + suite (report-level).
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

const { createSeedShape } = req('src/data/seeds.ts');
const { readSeedCell, glueFaces, flipGlueFaces } = req('src/lib/faceIdentification.ts');
const { level3InvariantTower } = req('src/lib/level3Invariants.ts');
const { smithNormalForm, computeIntegerHomology } = req('src/lib/level3Homology.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const allZero = (m) => m.every((row) => row.every((x) => x === 0));

console.log('level-3 Build 2: the invariant tower (χ-consistency · w₁ across face-gluings · integer homology)\n');

// ---- ground: the committed cube → the Build-1 3-torus pattern ----
const cubeShape = createSeedShape('cube');
const cube = readSeedCell(cubeShape);
const positionOf = new Map(Object.values(cubeShape.vertices).map((v) => [v.id, v.position]));
const translationMap = (faceA, faceB, axis) => {
  const map = {};
  const targets = faceB.cycle.map((id) => ({ id, p: positionOf.get(id) }));
  for (const u of faceA.cycle) {
    const p = positionOf.get(u);
    const want = [0, 1, 2].map((i) => (i === axis ? p[i] + 2 : p[i]));
    const hit = targets.find((t) => t.p[0] === want[0] && t.p[1] === want[1] && t.p[2] === want[2]);
    if (!hit) throw new Error(`no translation image for ${u}`);
    map[u] = hit.id;
  }
  return map;
};
const face = (key) => cube.faces.find((f) => f.id === `face:cube:${key}`);
const [LEFT, RIGHT, FRONT, BACK, BOTTOM, TOP] = ['left', 'right', 'front', 'back', 'bottom', 'top'].map(face);
const T3_PATTERN = [
  { faceA: LEFT.id, faceB: RIGHT.id, mode: 'preserving', map: translationMap(LEFT, RIGHT, 0) },
  { faceA: FRONT.id, faceB: BACK.id, mode: 'preserving', map: translationMap(FRONT, BACK, 1) },
  { faceA: BOTTOM.id, faceB: TOP.id, mode: 'preserving', map: translationMap(BOTTOM, TOP, 2) },
];
const t3 = glueFaces(cube, T3_PATTERN);
const tower = level3InvariantTower(t3);

// ===== ① the 3-torus tuple =====
console.log('----- [①] THE 3-TORUS INVARIANT TUPLE (researcher-sealed) -----');
check('① Tier-1: χ = 0, carried from Build 1 (not recomputed) and CONSISTENT on the sound closed form', tower.chi === 0 && tower.sound === true && tower.chiConsistent === true);
check('① the oriented chain complex sits over the identified classes (1/3/3/1)', tower.oriented.vertexReps.length === 1 && tower.oriented.edgeReps.length === 3 && tower.oriented.faceReps.length === 3 && tower.oriented.cellIds.length === 1);
check('① ∂₁ = 0 exactly (every edge-class is a loop at the one vertex)', allZero(tower.oriented.d1));
check('① ∂₂ = 0 exactly (each face-class walks every edge-class + and −)', allZero(tower.oriented.d2));
check('① ∂₃ = 0 exactly (every gluing REVERSES the induced orientation — pairs cancel)', allZero(tower.oriented.d3));
check('① the cube boundary propagation read every committed face OUTWARD (ε ≡ +1 — measured, not assumed)', Object.values(tower.oriented.epsilonOf).every((e) => e === 1));
check('① Tier-2: w₁ = 0, ORIENTABLE, empty support (all three gluings reverse induced orientation)', tower.w1.w1 === 0 && tower.orientable === true && tower.w1.support.length === 0 && tower.w1.gluings.every((g) => g.reversesInducedOrientation === true));
check("① the §3 convention holds on all three: mode 'preserving' ⟺ reverses (modeConsistent)", tower.w1.gluings.every((g) => g.modeConsistent === true));
check('① Tier-3: H₀=Z, H₁=Z³, H₂=Z³, H₃=Z (all boundary ranks 0)', tower.homology.H0.pretty === 'Z' && tower.homology.H1.pretty === 'Z^3' && tower.homology.H2.pretty === 'Z^3' && tower.homology.H3.pretty === 'Z' && eq(tower.homology.ranks, { d1: 0, d2: 0, d3: 0 }));
check('① torsion-free (every Smith diagonal ∈ {0,1})', tower.homology.torsionFree === true);
check('① π₁ NOT computed — H₁ exposed as the abelianization, honestly labelled', tower.piAbelianization.value === 'Z^3' && tower.piAbelianization.label.includes('NOT computed'));
note(`① tuple: χ=${tower.chi} · w₁=${tower.w1.w1} (${tower.orientable ? 'orientable' : 'non-orientable'}) · H₀=${tower.homology.H0.pretty} H₁=${tower.homology.H1.pretty} H₂=${tower.homology.H2.pretty} H₃=${tower.homology.H3.pretty} · ${tower.homology.torsionFree ? 'torsion-free' : 'TORSION'}`);

// ===== ② cross-checks (the teeth wiring the tiers together) =====
console.log('\n----- [②] CROSS-CHECKS (w₁ ↔ H₃ ↔ orientation foundation) -----');
check('② orientable ⟺ H₃ = Z (Tier-2 agrees with Tier-3)', (tower.w1.w1 === 0) === (tower.homology.H3.free === 1));
check("② the foundation's mod-2 shadow IS w₁'s support (non-reversing gluings ≡ support; here none)", tower.w1.support.every((s) => s.reversesInducedOrientation === false) && tower.w1.support.length === tower.w1.gluings.filter((g) => !g.reversesInducedOrientation).length);
check('② Tier-1 sits alongside the S² gate (sound ∧ χ=0 — no contradiction flag)', tower.gate.sound === true && tower.chiConsistent === true);

// ===== ③ the RATIFIED topological-torsion case (+ the reversal tooth) =====
console.log('\n----- [③] THE RATIFIED TORSION CASE: mapping torus of the T²-swap (w₁ ≠ 0, H₃ = 0, Z/2 in H₂) -----');
// the z-pair re-mapped ORDER-PRESERVING (step +1): bottom cycle [a,d,c,b] → top
// cycle [e,f,g,h] in order — in coordinates the gluing is (x,y,0) ↦ (y,x,1):
// the mapping torus of the orientation-reversing SWAP φ(x,y) = (y,x) of T².
const zReflected = {
  faceA: BOTTOM.id,
  faceB: TOP.id,
  mode: 'reversing',
  map: Object.fromEntries(BOTTOM.cycle.map((u, k) => [u, TOP.cycle[k]])),
};
const twisted = flipGlueFaces(cube, [T3_PATTERN[0], T3_PATTERN[1], zReflected]);
const twistedTower = level3InvariantTower(twisted);
check('③ flipGlueFaces enacts (≥1 reversing pairing — the mirrored level-2 contract)', Boolean(twistedTower));
check('③ the obstruction FIRES: w₁ = 1, non-orientable, frustration witnessed', twistedTower.w1.w1 === 1 && twistedTower.orientable === false && twistedTower.w1.frustrationWitness !== null);
check('③ the SUPPORT records exactly the z-gluing (non-reversing: step·εA·εB = +1)', twistedTower.w1.support.length === 1 && twistedTower.w1.support[0].faceA === BOTTOM.id && twistedTower.w1.support[0].faceB === TOP.id);
check("③ the §3 convention holds here too: mode 'reversing' ⟺ NOT reverses-induced (modeConsistent on all three)", twistedTower.w1.gluings.every((g) => g.modeConsistent === true));
check('③ Tier-3 agrees: H₃ = 0 (the non-reversing gluing leaves a ±2 in ∂₃ — ker = 0)', twistedTower.homology.H3.free === 0 && twistedTower.homology.ranks.d3 === 1);
// THE RATIFIED TOPOLOGICAL-TORSION VALIDATION CASE (researcher-pinned identity:
// the mapping torus of the T²-swap — a non-orientable flat Bieberbach
// 3-manifold; the S²-gate PASS is structural, a fiber bundle IS a closed
// 3-manifold). This exercises the Tier-3 SNF→torsion readout on a GENUINE
// closed 3-manifold from inside Option-A (cube) scope — the Z/2-torsion
// validation gap is CLOSED. Identity grounding (confirmed three ways —
// committed SNF · Wang sequence · chain check): H₂ = Z ⊕ Z/2 with
// Z/2 = coker(φ★ − 1 on H₂(T²)) = coker(−2); the torsion lives in H₂, NOT H₁ —
// the fingerprint of the SWAP (a midline reflection would put Z/2 in H₁ → K²×S¹).
// Odd Z/p (p>2) / lens L(p,q) still need non-cube order-p domains (cube = D₄).
check('③ (RATIFIED: mapping torus of the T²-swap) the form is SOUND — S² gate PASS, χ=0 consistent', twistedTower.sound === true && twistedTower.gate.failures.length === 0 && twistedTower.chiConsistent === true && twisted.chi === 0);
check('③ (RATIFIED) its tuple: H₀=Z, H₁=Z², H₂=Z ⊕ Z/2, H₃=0 — the topological-torsion witness', twistedTower.homology.H0.pretty === 'Z' && twistedTower.homology.H1.pretty === 'Z^2' && twistedTower.homology.H2.pretty === 'Z ⊕ Z/2' && twistedTower.homology.H3.pretty === '0' && twistedTower.homology.torsionFree === false);
note(`③ THE RATIFIED CASE (researcher-pinned): mapping torus of φ(x,y)=(y,x) on T² — counts=${JSON.stringify(twisted.counts)} χ=${twisted.chi} sound=${twistedTower.sound} · w₁=1 · H₁=${twistedTower.homology.H1.pretty} H₂=${twistedTower.homology.H2.pretty} H₃=${twistedTower.homology.H3.pretty} · ∂₃=(0,2,0)ᵀ — Z/2 = coker(φ★−1 on H₂(T²)) = coker(−2), in H₂ not H₁ (the swap's fingerprint)`);

// ===== ④ the SNF readout in ISOLATION (the branch the 3-torus cannot reach) =====
console.log('\n----- [④] SNF UNIT TESTS (torsion readout validated in isolation) -----');
check('④ snf([[2]]) → diagonal [2] (Z/2)', eq(smithNormalForm([[2]]).diagonal, [2]));
check('④ snf(diag(1,3)) → [1,3] (Z/3)', eq(smithNormalForm([[1, 0], [0, 3]]).diagonal, [1, 3]));
check('④ snf([[2,4],[4,2]]) → invariant factors [2,6] (d₁|d₂; |det|=12)', eq(smithNormalForm([[2, 4], [4, 2]]).diagonal, [2, 6]));
check('④ snf(0-matrix) → rank 0', smithNormalForm([[0, 0], [0, 0]]).rank === 0);
check('④ snf rejects non-integer entries loudly', (() => { try { smithNormalForm([[1.5]]); return false; } catch (e) { return String(e.message).includes('non-integer'); } })());
// the hand-written RP² cellular complex (1 vertex, 1 edge, 1 face; ∂₂ = ×2):
// validates the FULL homology readout's torsion path — a 2-complex chain, NOT a
// level-3 form (the topological level-3 torsion example is owed to the researcher).
const rp2 = computeIntegerHomology({ n0: 1, n1: 1, n2: 1, n3: 0 }, [[0]], [[2]], [[]]);
check('④ the hand-written RP² chain reads H₀=Z, H₁=Z/2, H₂=0 through the full readout', rp2.H0.pretty === 'Z' && rp2.H1.pretty === 'Z/2' && rp2.H2.pretty === '0' && rp2.torsionFree === false);
note('④ Z/2-torsion validation gap: CLOSED in-scope by the ratified ③ case (the T²-swap mapping torus). Odd Z/p (p>2) and lens L(p,q) still need non-cube order-p domains — the cube face-symmetry is D₄ (orders 1/2/4 only).');

console.log(
  `\n--- level-3 Build 2 (3-torus tuple · cross-checks · reversal tooth · SNF isolation): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
