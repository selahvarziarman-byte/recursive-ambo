#!/usr/bin/env node

// DIAGNOSTIC — R2 THE SUBSTRATE ROOT (2026-08-14 mandate, mothership nod
// 1130): derived-face mint sites acos-IMPORT their TRUE corner angles from
// carried positions instead of stamping regularCornerAngle(n).
//
// ★ THE CARRY DECLARATION (the standing carry-chain law — which arrows this
// witness supplies for itself): I hand in positioned shapes and read
// `Face.cornerAngles`; I do NOT walk or render. Arrow (1) only — the read.
// The window's flat-chart walk still renders zero holonomy (downstream, the
// mothership carries it); nothing here claims the cone shows.
//
// THE THREE CASES (the mandate's acceptance, verbatim):
//   1 the pyritohedral split-face reads its TRUE 45·45·90 — never the old
//     stamped 60·60·60 (the Sovereign's D5 finding, cured at the root);
//   2 an invoked square still owns 90×4 — the invoke-seed stamp
//     (conformalAtom, frozen, byte-unchanged) equals the acos on a regular
//     seed: no regression;
//   3 the door-3 fan apex owns wedges 60·60·45·45·90 — the parts now TRUE,
//     the sum unchanged: Σ = 300° (the sealed number holds).
//
// Placed in scripts/app-leg/ (the non-suite diagnostics home) so the flat
// suite glob stays at its 112 @ 1 baseline.

const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..', '..');
const ts = require(path.join(repoRoot, 'node_modules', 'typescript'));
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
      fileName: filename,
    }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];
const req = (p) => require(path.join(repoRoot, p));

const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { applyPyritohedralDiagonalization } = req('src/lib/pyritohedralDiagonalization.ts');
const { openLift } = req('src/lib/openLift.ts');
const { usePlaygroundStore } = req('src/store/playgroundStore.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { computeSeedCornerAngles } = req('src/lib/conformalAtom.ts');

console.log('I hand in positioned shapes and read `Face.cornerAngles`; I do NOT walk or render.');

let failures = 0;
const check = (label, pass, detail = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${label}${detail ? ` — ${detail}` : ''}`);
  if (!pass) failures += 1;
};
const DEG = (r) => Math.round((r * 180) / Math.PI);
const degs = (angles) => angles.map(DEG).sort((a, b) => a - b);

// ---- the terrain (the door-3 chain, committed ops) -------------------------
const cube1 = applyAmboDissection(createSeedShape('cube'));
const cubocta = cube1.cells.find((c) => c.topology === 'cuboctahedron' && c.kind !== 'parent');
const terrain = applyPyritohedralDiagonalization(cube1, cubocta.id);

// ---- 1 · the pyritohedral split-face: TRUE 45·45·90 ------------------------
const splits = terrain.faces.filter((f) => f.role === 'pyritohedral-split-face');
const splitOwned = splits.every((f) => Array.isArray(f.cornerAngles));
// R1 RECUT (B-111 §3; the same class already recut in diagnose-open-lift):
// R2's claim was never "45·45·90" — it was "the face MEASURES its own angles
// instead of stamping an assumed constant". Pre-R1 the measurement read
// 45·45·90 on the diagonalized cuboctahedron's true metric; R1 relaxed the
// twelve corners to t = 1/φ IN the diagonalization, so the SAME measurement
// now reads the regular icosahedron's 60·60·60. ⛔ The discriminator is NOT
// the numbers — a stamped 60·60·60 would print identically today. It is that
// the owned atom AGREES with an independent acos over the shape's own
// positions, which a stamp cannot do once the positions move.
const acosAt = (shape, cycle, k) => {
  const v = shape.vertices[cycle[k]].position;
  const prev = shape.vertices[cycle[(k - 1 + cycle.length) % cycle.length]].position;
  const next = shape.vertices[cycle[(k + 1) % cycle.length]].position;
  const e1 = prev.map((x, i) => x - v[i]);
  const e2 = next.map((x, i) => x - v[i]);
  const cos = (e1[0] * e2[0] + e1[1] * e2[1] + e1[2] * e2[2]) / (Math.hypot(...e1) * Math.hypot(...e2));
  return Math.acos(Math.max(-1, Math.min(1, cos)));
};
const splitTrue =
  splitOwned &&
  splits.every((f) => JSON.stringify(degs(f.cornerAngles)) === JSON.stringify([60, 60, 60])) &&
  splits.every((f) => f.vertexIds.every((_, k) => Math.abs(f.cornerAngles[k] - acosAt(terrain, f.vertexIds, k)) < 1e-9));
check(
  "1 · every pyritohedral split-face MEASURES its own angles — post-R1 they read 60·60·60 (pre-R1: 45·45·90 on the unrelaxed metric), and each owned angle AGREES with an independent acos over the shape's own positions (the discriminator a stamp cannot pass)",
  splits.length === 12 && splitTrue,
  `${splits.length} split faces · e.g. [${splits[0] ? degs(splits[0].cornerAngles ?? []).join(',') : '—'}]`,
);

// ---- 2 · an invoked square: still 90×4 (no regression) ---------------------
usePlaygroundStore.getState().resetPlayground();
const square = computeSeedCornerAngles(usePlaygroundStore.getState().invokeForm(nGon(4), 'r2sq'));
const squareAngles = square.faces[0].cornerAngles ?? [];
check(
  '2 · an invoked square still owns 90×4 (the frozen seed stamp equals the acos on a regular seed)',
  squareAngles.length === 4 && squareAngles.every((a) => DEG(a) === 90),
  `[${degs(squareAngles).join(',')}]`,
);

// ---- 3 · the door-3 fan apex: wedges 60·60·45·45·90, Σ = 300° --------------
const coreCell = terrain.cells.find((c) => c.kind === 'core' && c.sourceOperation === 'pyritohedral-diagonalization');
const mid = Object.values(terrain.vertices).find(
  (v) => v.createdBy && v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2,
).id;
const lift = openLift(terrain, mid, coreCell.id);
const wedges = lift.shape.faces.map((face) => {
  let acc = 0;
  face.vertexIds.forEach((v, k) => {
    if (v === mid) acc += (face.cornerAngles ?? [])[k] ?? 0;
  });
  return acc;
});
const wedgeDegs = degs(wedges);
const sum = wedges.reduce((a, b) => a + b, 0);
// R1 RECUT (B-111 §3): the wedge PARTS moved with the metric — pre-R1
// [45,45,60,60,90], post-R1 five 60s — while Σ holds 300° through BOTH. ★ So
// the SUM was never the discriminator; the PARTS are, and that was R2's whole
// point: a stamped uniform 60 and a measured one print alike until the
// positions move under them.
check(
  "3 · the fan apex owns wedges 60·60·60·60·60 (sorted) — post-R1 the regular icosahedron's own fan (pre-R1: 45·45·60·60·90); Σ unchanged at 300° through both, so the SUM never discriminated — the PARTS do",
  JSON.stringify(wedgeDegs) === JSON.stringify([60, 60, 60, 60, 60]) && Math.abs(DEG(sum) - 300) < 1e-9,
  `wedges [${wedgeDegs.join(',')}] · Σ=${DEG(sum)}°`,
);

console.log(failures === 0 ? '\nDIAGNOSE-R2-ANGLE-IMPORT: ALL GREEN' : `\nDIAGNOSE-R2-ANGLE-IMPORT: ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
