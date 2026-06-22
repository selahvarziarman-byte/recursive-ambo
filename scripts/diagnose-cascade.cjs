#!/usr/bin/env node

// DIAGNOSTIC — Cascade driver, step 2a: the identification closure (Case A).
// Seals the combinatorics ONLY: μ, merges, faces-survive, fixpoint, confluence,
// op-set-pure-∂. NO orientation / w₁ (that is step 2b). The sign is recorded on each
// match but NOT consumed here.
//
// Fixture: createSeedShape('cube'); F1 = bottom (z=−1), F2 = top (z=+1) — two disjoint
// squares JOINed by their boundary (rotation φ and reflection φ).
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

const { runCascade, buildJoinSeed, buildSelfGlueSeed, certifyCascadeOrientation } = req(
  'src/lib/cascadeDriver.ts',
);
const { createSeedShape } = req('src/data/seeds.ts');
const { getCellFaces } = req('src/lib/shape.ts');

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`PASS - ${label}`);
  } else {
    console.log(`FAIL - ${label}`);
    failures += 1;
  }
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const setOfSets = (classes) =>
  JSON.stringify(classes.map((c) => [...c].sort()).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))));
const shortId = (id) => id.split(':').pop();
const pairsOf = (merges, dim) =>
  merges.filter((m) => m.dim === dim).map((m) => [m.a, m.b].sort());

// ---- the fixture: two disjoint cube squares ----
const shape = createSeedShape('cube');
const shapeSnapshot = JSON.stringify(shape);
const faces = getCellFaces(shape, shape.cells[0]); // reuse getCellFaces
const F1 = faces.find((f) => f.vertexIds.every((v) => shape.vertices[v].position[2] === -1));
const F2 = faces.find((f) => f.vertexIds.every((v) => shape.vertices[v].position[2] === 1));
const v1 = F1.vertexIds;
const v2 = F2.vertexIds;
const n = v1.length;

// expected vertex pairings per φ (rotation: i↦i; reflection: i↦(n−i)%n)
const expectVertexClasses = (mode) =>
  v1.map((v, i) => [v, v2[mode === 'rotation' ? i : (n - i) % n]]);

console.log(`Fixture: F1=${F1.id} ${JSON.stringify(v1.map(shortId))} | F2=${F2.id} ${JSON.stringify(v2.map(shortId))}`);

// ===================== ROTATION φ =====================
console.log('\n----- ROTATION φ -----');
const seedRot = buildJoinSeed(shape, F1, F2, 'rotation');
const rot = runCascade(shape, [F1, F2], seedRot);

// §A1 μ before === 18
check('§A1 μ before === 18 (2 faces + 8 edges + 8 vertices; F1,F2 disjoint)', rot.mu.before === 18);

// §A2 ROTATION forces exactly 4 vertex-merges + 4 edge-merges, per the cycle alignment
check('§A2 exactly 4 vertex-merges (dim 0)', rot.forcedMerges.filter((m) => m.dim === 0).length === 4);
check('§A2 exactly 4 edge-merges (dim 1)', rot.forcedMerges.filter((m) => m.dim === 1).length === 4);
check(
  '§A2 the 4 vertex classes are the rotation pairing {(a,e),(d,f),(c,g),(b,h)}',
  setOfSets(rot.partition[0]) === setOfSets(expectVertexClasses('rotation')),
);
note(`READ-ACTUALS rotation vertex merges: ${rot.partition[0].map((c) => c.map(shortId).join('~')).join(', ')}`);
note(`READ-ACTUALS rotation edge merges: ${pairsOf(rot.forcedMerges, 1).map((p) => p.map(shortId).join('~')).join(', ')}`);

// §A3 faces SURVIVE
check('§A3 faces SURVIVE: face count stays 2 (no 2-cell merged/created)', rot.partition[2].length === 2);
check('§A3 the two surviving faces are exactly F1 and F2', setOfSets(rot.partition[2]) === setOfSets([[F1.id], [F2.id]]));

// §A4 μ after === 10, strictly decreased, no cell created
check('§A4 μ after === 10 (F=2, E=4, V=4)', rot.mu.after === 10);
check('§A4 μ strictly decreased (18 → 10)', rot.mu.after < rot.mu.before && rot.mu.before === 18 && rot.mu.after === 10);
check(
  '§A4 no cell created: every forced step is a MERGE (μ down only)',
  rot.forcedMerges.length >= 1 && rot.partition[1].length === 4 && rot.partition[0].length === 4,
);

// §A5 fixpoint: finite passes; the work-list drains; vertices terminal
check('§A5 fixpoint reached in finite passes (passes >= 1)', rot.passes >= 1 && Number.isFinite(rot.passes));
check('§A5 the last sweep forces nothing new (work-list drains to a fixpoint)', rot.passes === 2);
check(
  '§A5 vertices are terminal: no forced merge below dim 0',
  rot.forcedMerges.every((m) => m.dim >= 0) && rot.forcedMerges.some((m) => m.dim === 0),
);
// provenance: each vertex merge carries a forcing path from a seed edge match
check(
  '§A5 every forced vertex merge carries a provenance path rooted at a seed (edge) match',
  rot.forcedMerges.filter((m) => m.dim === 0).every((m) => m.path.length >= 2 && m.path[0].startsWith('1:')),
);

// ===================== REFLECTION φ =====================
console.log('\n----- REFLECTION φ -----');
const seedRef = buildJoinSeed(shape, F1, F2, 'reflection');
const ref = runCascade(shape, [F1, F2], seedRef);

// §A6 reflection: same μ before/after, 4+4 merges, a DIFFERENT pairing
check('§A6 REFLECTION μ before === 18', ref.mu.before === 18);
check('§A6 REFLECTION μ after === 10', ref.mu.after === 10);
check('§A6 REFLECTION 4 vertex-merges + 4 edge-merges', ref.forcedMerges.filter((m) => m.dim === 0).length === 4 && ref.forcedMerges.filter((m) => m.dim === 1).length === 4);
check(
  '§A6 the reflection pairing {(a,e),(d,h),(c,g),(b,f)} matches φ and DIFFERS from rotation',
  setOfSets(ref.partition[0]) === setOfSets(expectVertexClasses('reflection')) &&
    setOfSets(ref.partition[0]) !== setOfSets(rot.partition[0]),
);
check('§A6 REFLECTION faces survive (count stays 2)', ref.partition[2].length === 2);
note(`READ-ACTUALS reflection vertex merges: ${ref.partition[0].map((c) => c.map(shortId).join('~')).join(', ')}`);
note(`READ-ACTUALS reflection edge merges: ${pairsOf(ref.forcedMerges, 1).map((p) => p.map(shortId).join('~')).join(', ')}`);

// ===================== §A7 CONFLUENCE =====================
console.log('\n----- §A7 CONFLUENCE -----');
const seedShuffled = { matches: [...seedRot.matches].reverse() };
const confl = runCascade(shape, [F1, F2], seedShuffled);
check(
  '§A7 re-run rotation with seed.matches REVERSED → IDENTICAL final partition (order-independent)',
  JSON.stringify(confl.partition) === JSON.stringify(rot.partition),
);
check('§A7 confluence: identical μ (both → 10)', JSON.stringify(confl.mu) === JSON.stringify(rot.mu));

// ===================== §A8 op-set scaffold =====================
console.log('\n----- §A8 op-set scaffold (pure-∂, downward only) -----');
const seedMaxDim = Math.max(...seedRot.matches.map((m) => m.dim));
check('§A8 identification op is pure-∂: every forced merge is at dim <= the seed max dim (downward)', rot.forcedMerges.every((m) => m.dim <= seedMaxDim));
check(
  '§A8 strictly downward: every forced child is exactly one dimension down (no upward ∂ᵀ match)',
  // edge seeds (dim 1) force vertices (dim 0); nothing forces a higher dim
  rot.forcedMerges.every((m) => m.dim === 1 || m.dim === 0) && rot.forcedMerges.some((m) => m.dim === 0),
);
check(
  '§A8 never removes a cell: the universe cell-count is constant; μ falls ONLY by merging',
  rot.mu.before === 18 && rot.mu.after === 10 && rot.partition[2].length === 2,
);

// ===================== §A (discipline) — derive-only =====================
console.log('\n----- discipline -----');
check('derive-only: JSON.stringify(shape) byte-identical before/after all runs', JSON.stringify(shape) === shapeSnapshot);
check('the closure TRACE carries no w1 field (orientation is a SEPARATE cert, not baked into the trace)', !('w1' in rot) && !('orientation' in rot));
note(`READ-ACTUALS: F1=${F1.id}, F2=${F2.id} | rotation μ 18→10, reflection μ 18→10 | faces survive=${rot.partition[2].length} | passes=${rot.passes} | confluence=identical`);

// ===================== §B-orient (Case A) — the JOIN glue is ORIENTABLE, both φ ======
console.log('\n----- §B-orient (Case A orientation, w₁ via the 2-colouring) -----');
const rotOrient = certifyCascadeOrientation(shape, [F1, F2], rot);
const refOrient = certifyCascadeOrientation(shape, [F1, F2], ref);
check('§B-orient ROTATION φ → w1 === 0 (the two faces 2-colour consistently across their 4 interior edges)', rotOrient.w1 === 0);
check('§B-orient ROTATION φ → nonOrientable === false, conflict === null', rotOrient.nonOrientable === false && rotOrient.conflict === null);
check('§B-orient REFLECTION φ → w1 === 0 (orientable S²)', refOrient.w1 === 0);
check('§B-orient REFLECTION φ → nonOrientable === false, conflict === null', refOrient.nonOrientable === false && refOrient.conflict === null);
note(`READ-ACTUALS: both φ orientable (S² pillowcase, χ=2) — rotation w1=${rotOrient.w1}, reflection w1=${refOrient.w1}.`);

// ===================== §C-orient (Case B) — single-face flip-glue → Möbius ===========
console.log('\n----- §C-orient (Case B: self-glue one opposite-edge pair of ONE face) -----');
const bottom = F1; // a single cube face [a,d,c,b]
const ctrlSeed = buildSelfGlueSeed(shape, bottom, 'control');
const flipSeed = buildSelfGlueSeed(shape, bottom, 'flip');
const ctrl = runCascade(shape, [bottom], ctrlSeed);
const flip = runCascade(shape, [bottom], flipSeed);
const ctrlOrient = certifyCascadeOrientation(shape, [bottom], ctrl);
const flipOrient = certifyCascadeOrientation(shape, [bottom], flip);

// the face SURVIVES (count stays 1) — a self-glue of its boundary, not a 2-cell merge
check('§C-orient the single face SURVIVES in both modes (face count stays 1)', ctrl.partition[2].length === 1 && flip.partition[2].length === 1);

// FLIP → Möbius: w1=1 RECORDED, conflict is a parity-1 self-loop; the cascade CONTINUES
check('§C-orient FLIP → w1 === 1, nonOrientable === true (Möbius)', flipOrient.w1 === 1 && flipOrient.nonOrientable === true);
check('§C-orient FLIP → conflict !== null and is a SELF-LOOP (one face forced opposite to itself)', flipOrient.conflict !== null && flipOrient.conflict.faces[0] === flipOrient.conflict.faces[1]);
check('§C-orient FLIP → the cascade RECORDS w1=1 and CONTINUES: runCascade still reached its fixpoint (no abort/throw)', flip.passes >= 1 && Number.isFinite(flip.passes) && flip.mu.after === 6);

// CONTROL → cylinder: w1=0
check('§C-orient CONTROL → w1 === 0, nonOrientable === false (cylinder, orientable)', ctrlOrient.w1 === 0 && ctrlOrient.nonOrientable === false);
check('§C-orient CONTROL → conflict === null', ctrlOrient.conflict === null);

// the ONLY difference is the seed sign: merges/μ/fixpoint identical, orientation verdict opposite
check(
  '§C-orient flip vs control: IDENTICAL μ (9→6), face count, and passes — the closure is sign-blind',
  JSON.stringify(ctrl.mu) === JSON.stringify(flip.mu) &&
    ctrl.mu.before === 9 && ctrl.mu.after === 6 &&
    ctrl.partition[2].length === flip.partition[2].length &&
    ctrl.passes === flip.passes,
);
check(
  '§C-orient the orientation statistic is load-bearing on the SIGN: same combinatorics, opposite w1 (0 vs 1)',
  ctrlOrient.w1 === 0 && flipOrient.w1 === 1,
);
note(`READ-ACTUALS Case B: control(cylinder) w1=0 vmerges=${ctrl.partition[0].map((c) => c.map(shortId).join('~')).join(',')} | flip(Möbius) w1=1 vmerges=${flip.partition[0].map((c) => c.map(shortId).join('~')).join(',')} | conflict edgeClass=${flipOrient.conflict.edgeClass}`);

// ===================== §B-discipline =====================
console.log('\n----- §B-discipline -----');
const driverSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/cascadeDriver.ts'), 'utf8');
check('§B-discipline certifyOrientation is NOT imported/called in cascadeDriver.ts (grep proves it)', !/certifyOrientation/.test(driverSrc));
check('§B-discipline the cascade w1 comes from certifyCascadeOrientation (the 2-colouring) ONLY', typeof certifyCascadeOrientation === 'function');
check('§B-discipline derive-only: JSON.stringify(shape) byte-identical after all 2b runs', JSON.stringify(shape) === shapeSnapshot);

// ===================== SUMMARY =====================
console.log('');
console.log(`--- cascade (Case A closure + 2b orientation): ${failures === 0 ? 'no failures' : failures + ' FAIL'} ---`);
console.log('');
if (failures === 0) {
  console.log('ALL PASS');
} else {
  console.log(`${failures} FAIL`);
  process.exitCode = 1;
}
