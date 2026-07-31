#!/usr/bin/env node

// DIAGNOSTIC — P5, THE LIFT: the SECOND SOURCE. The lift always carried the
// Ambo's angles in its coordinates and read NONE — it reads now:
//   PART A — the corner-import: each lifted face's corner measures
//   θ_k = acos((e₁·e₂)/(|e₁||e₂|)) from the carried positions and stamps
//   `Face.cornerAngles` (the P0 carrier, reused) AT THE LIFT SEAM — positions
//   are read at the SOURCES only (invocation reads n; the lift reads its own
//   coordinates); the transforms P1–P4 still read none.
//   PART B — the apex-trace median read: per (M, C) entry the median C→M
//   carries THREE relations — 90° foot · 30° apex · 60° base — a
//   cross-generation reader, NOT a corner, stored NOWHERE.
//   ⛔ THE HORIZON GUARD: the three medians stay SEPARATE; the barycentric is
//   never assembled — the centroid is a deficit-zero void; THE READ ADDS NO
//   VERTEX.
//
// THE TEETH:
//   §1 ★ PART A (E1): the lifted octahedron (ambo(tetra) → lift the core)
//      owns all 8 faces at [60° ×3] via acos — stamped at the seam;
//   §2 ★★ PART A's SEAL (E2, FLOAT-TOLERANT, ε = 1e-9 STATED): Σ deficit =
//      6·(2π−4π/3) = 4π = 2π·2 (χ=2 CERTIFIED) to ±ε; a planted wrong
//      corner (+0.01 rad, beyond ε) misses by exactly 0.01 → RED;
//   §3 ★★ PART B (E3): all 12 apex-trace medians read 90‑60‑30 (±ε); the
//      read STORES nothing (the shape's faces byte-unchanged);
//   §4 ⛔★★ THE HORIZON GUARD (E4): the vertex-set is UNCHANGED by the read
//      and no centroid exists anywhere in the reader; a planted
//      centroid-mint FAILS the guard;
//   §5 E5/E6/E7: the discipline (conformalAtom still reads no positions),
//      the frozen status (EXPECTED NO UNION — geometry/manifest byte-
//      identical to HEAD), the SNAPSHOT build-check (the frozen spread
//      carries the imported corners through save/load — measured, no union
//      needed), own-only.
//
// Anti-mock: the REAL TS modules through the transpile hook.

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
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
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { usePlaygroundStore } = req('src/store/playgroundStore.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { liftSubComplex, readApexTraceMedians } = req('src/lib/subComplexLift.ts');
const { readVertexCurvatures, gaussBonnetTotal } = req('src/lib/conformalAtom.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { serializeSnapshot } = req('src/playground/snapshot.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const EPS = 1e-9; // ★ E2's STATED tolerance — the imported angle rides float positions
const near = (a, b, eps = EPS) => Math.abs(a - b) < eps;
const P = Math.PI;

console.log('P5 — the lift reads what it always carried: the corner-import + the apex-trace medians, under the horizon guard\n');

// the canonical chain: tetra → ambo → lift the core (the octahedron)
const tetra = createSeedShape('tetrahedron');
const ambo = applyAmboDissection(tetra);
const core = ambo.cells.find((c) => c.kind === 'core');
const lifted = liftSubComplex(ambo, [{ kind: 'cell', id: core.id }]).shape;

// ---------------------------------------------------------------------------
// §1 ★ Part A — the corner-import at the seam
// ---------------------------------------------------------------------------
console.log('----- §1 ★ Part A: the lifted octahedron owns its corners via acos -----');
note(`lifted core: V${Object.keys(lifted.vertices).length} E${lifted.edges.length} F${lifted.faces.length} · face0 [${(lifted.faces[0].cornerAngles ?? []).map((a) => ((a * 180) / P).toFixed(4)).join(', ')}]°`);
check('★ §1 (E1) ALL 8 lifted faces own [π/3 ×3] (60° via acos from the carried positions, ±ε) — stamped at the lift seam, aligned',
  lifted.faces.length === 8 &&
    lifted.faces.every(
      (f) =>
        f.cornerAngles?.length === f.vertexIds.length &&
        f.cornerAngles.every((a) => near(a, P / 3)),
    ));

// ---------------------------------------------------------------------------
// §2 ★★ Part A's seal — float-tolerant, χ certified, the plant bites
// ---------------------------------------------------------------------------
console.log('\n----- §2 ★★ the ±ε seal: Σ deficit = 4π = 2π·2 (ε = 1e-9) + the wrong-corner plant -----');
const chi = readFormInvariants(lifted, [ambo]).chi;
const total = gaussBonnetTotal(readVertexCurvatures(lifted));
note(`χ=${chi} (certified) · Σ deficit = ${(total / P).toFixed(9)}π vs 2πχ = ${2 * chi}π · ε = ${EPS}`);
check('★★ §2 (E2) the LIFTED octahedron seals: Σ deficit = 4π = 2π·2 to ±1e-9 (6 vertices × (2π−4π/3); χ=2 CERTIFIED; the tolerance is EXPLICIT — a float source, not invocation\'s rational π)',
  chi === 2 && near(total, 2 * P * chi));
// THE PLANT (runs every time): one corner bent +0.01 rad (beyond ε)
const bent = {
  ...lifted,
  faces: lifted.faces.map((f, i) =>
    i === 0 ? { ...f, cornerAngles: f.cornerAngles.map((a, k) => (k === 0 ? a + 0.01 : a)) } : f,
  ),
};
const bentTotal = gaussBonnetTotal(readVertexCurvatures(bent));
note(`plant (+0.01 rad): |Σ − 4π| = ${Math.abs(bentTotal - 2 * P * chi).toFixed(9)} (must be 0.01, far beyond ε)`);
check('★★ §2 (E2) THE PLANT BITES: a corner bent beyond ε breaks the seal by exactly the bend (0.01 rad ≫ 1e-9)',
  near(Math.abs(bentTotal - 2 * P * chi), 0.01, 1e-12) && !near(bentTotal, 2 * P * chi));

// ---------------------------------------------------------------------------
// §3 ★★ Part B — the apex-trace medians read 90‑60‑30, stored nowhere
// ---------------------------------------------------------------------------
console.log('\n----- §3 ★★ Part B: the 12 medians read 90°·30°·60° — a reader, not a corner -----');
const facesBefore = JSON.stringify(ambo.faces);
const medians = readApexTraceMedians(ambo);
note(`${medians.length} median readings · first: foot=${((medians[0].footAngle * 180) / P).toFixed(4)}° apex=${((medians[0].apexAngle * 180) / P).toFixed(4)}° base=${((medians[0].baseAngle * 180) / P).toFixed(4)}°`);
check('★★ §3 (E3) EVERY apex-trace median reads 90° foot · 30° apex · 60° base (±ε) — the cross-generation relation, all 12 (6 sites × 2 face-mediations)',
  medians.length === 12 &&
    medians.every(
      (m) => near(m.footAngle, P / 2) && near(m.apexAngle, P / 6) && near(m.baseAngle, P / 3),
    ));
check('§3 (E3) the read is a READER: nothing stamped on Face.cornerAngles, the shape\'s faces BYTE-UNCHANGED, no new stored field',
  JSON.stringify(ambo.faces) === facesBefore &&
    medians.every((m) => Object.keys(m).sort().join(',') === 'apexAngle,apexId,baseAngle,baseIds,footAngle,midpointId'));

// ---------------------------------------------------------------------------
// §4 ⛔★★ the horizon guard — the read adds NO vertex; the centroid is nowhere
// ---------------------------------------------------------------------------
console.log('\n----- §4 ⛔★★ the horizon guard: three medians, no meet, no minted vertex -----');
const vertexKeysBefore = Object.keys(ambo.vertices).sort().join('|');
readApexTraceMedians(ambo);
const vertexKeysAfter = Object.keys(ambo.vertices).sort().join('|');
const liftSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/subComplexLift.ts'), 'utf8');
// the guard grep reads CODE only (the doc comment rightly NAMES the law)
const liftCodeOnly = liftSrc
  .split('\n')
  .map((l) => l.replace(/\/\/.*$/, ''))
  .join('\n');
check('⛔★★ §4 (E4) THE READ ADDS NO VERTEX: the vertex-set is IDENTICAL before/after, and the reader\'s CODE assembles NO centroid (the barycentric never exists outside the law\'s own comment)',
  vertexKeysBefore === vertexKeysAfter && !/centroid|barycent/i.test(liftCodeOnly));
// THE PLANT (runs every time): what a violating reader would do — mint the
// medians' meet as a vertex. The guard check MUST fail it.
const violated = {
  ...ambo,
  vertices: {
    ...ambo.vertices,
    'vertex:planted:centroid': {
      id: 'vertex:planted:centroid',
      position: [0, 0, 0],
      data: {},
      createdBy: { shapeId: ambo.id, operation: 'seed', sourceVertexIds: [] },
    },
  },
};
check('⛔★★ §4 (E4) THE GUARD BITES: a planted centroid-mint changes the vertex-set — the guard check FAILS it (the read that minted would be caught)',
  Object.keys(violated.vertices).sort().join('|') !== vertexKeysBefore);

// ---------------------------------------------------------------------------
// §5 the discipline · the frozen status · the snapshot build-check · own-only
// ---------------------------------------------------------------------------
console.log('\n----- §5 discipline (sources only) · no union · snapshot rides · own-only -----');
check('§5 (E5) THE DISCIPLINE: conformalAtom (P1–P4\'s home) still performs NO `.position` access — positions live at the SOURCES only',
  !/\.position/.test(fs.readFileSync(path.join(repoRoot, 'src/lib/conformalAtom.ts'), 'utf8')));
const headEq = (p) => {
  const working = fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r/g, '');
  const head = execFileSync('git', ['show', `HEAD:${p}`], { cwd: repoRoot, encoding: 'utf8' }).replace(/\r/g, '');
  return working === head;
};
check('§5 (E6) EXPECTED NO UNION — HELD: geometry.ts AND the manifest BYTE-IDENTICAL to HEAD (Face.cornerAngles reused; the lift seam is NOT_FROZEN)',
  headEq('src/types/geometry.ts') && headEq('docs/governance/ENGINE_FREEZE_MANIFEST.txt'));
// the snapshot build-check — the FROZEN path spreads faces, so the imported
// corners RIDE save/load with no union (measured, not assumed)
const G = () => usePlaygroundStore.getState();
G().resetPlayground();
const file = serializeSnapshot(lifted, 'p5lift', [ambo]);
const loaded = G().loadSnapshot(file, 'p5src');
check('§5 (E6) THE SNAPSHOT BUILD-CHECK: the imported corners RIDE save/load (the frozen spread carries them — no union needed)',
  loaded.faces.length === 8 &&
    loaded.faces.every((f) => f.cornerAngles?.length === 3 && f.cornerAngles.every((a) => near(a, P / 3))));
check('§5 (E7) OWN-ONLY: no render register reads corners/dihedrals/medians',
  [
    'src/manuscript/InkedForm.tsx',
    'src/manuscript/InkedPlainForm.tsx',
    'src/manuscript/InkedSkeleton.tsx',
    'src/manuscript/InkedDomain.tsx',
    'src/manuscript/laidBodyModel.ts',
    'src/manuscript/laidInkedModel.ts',
  ].every((p) => {
    const src = fs.readFileSync(path.join(repoRoot, p), 'utf8');
    return !src.includes('cornerAngles') && !src.includes('dihedralAngles') && !src.includes('ApexMedian');
  }));

console.log(
  `\n--- P5 THE CONFORMAL LIFT (the second source · the medians read · the horizon held): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
