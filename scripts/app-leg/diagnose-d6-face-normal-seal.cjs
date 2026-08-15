#!/usr/bin/env node

// DIAGNOSTIC — D6(α): THE THICKEN-LIFT COHERENCE GUARD (2026-08-15 mandate;
// researcher 1243's re-ruled quantity, mothership 1250's binding label).
//
// THE FILE'S NAME carries its arc history: the original D6 quantity (the
// per-cell interior FACE-NORMAL dihedral) was BUILT EXACTLY and REFUSED BY
// THE SUBSTRATE — embedded dihedrals tile 2π around any interior line while
// intrinsic stamps sum to the cone angle, so per-cell equality was
// impossible at every true cone (measured, two independent routes) — and
// the in-place position read broke conformalAtom's witness-pinned
// distance-free charter. The re-ruled α quantity below is a RECORD guard.
//
// ★ THE CARRY DECLARATION: I hand in owned thicken products and read the
// per-cell lift-coherence seal (`readPillarDihedrals`); I do NOT walk or
// render, and I do NOT measure geometry.
//
// ✔ WHAT A GREEN ASSERTS: the dihedral record stayed faithful to the
//   cornerAngle record thicken lifted it from — THE LIFT HELD.
// ⛔ WHAT A GREEN DOES NOT ASSERT: consistency with geometry — a green never
//   means "the metric matches the world" (arrow-7 territory).
// ⛔ WHAT IT DOES NOT CATCH: a coordinated rewrite of BOTH records (no seal
//   catches total forgery), and mint-fabrication (D5) — that is R2's job
//   upstream. D6(α) + R2 together close the chain: positions→cornerAngle by
//   R2, cornerAngle→dihedral by α; neither alone.
//
// ⛔⛔ THE ACCEPTANCE — a bent SINGLE record FIRES it (either direction):
//   1 ★ the CELL record bent (+0.1 rad on one dihedral) → INCONSISTENT;
//   1b ★ the SOURCE record bent instead (the base copy's cornerAngle) →
//      INCONSISTENT (the same guard, the other record);
//   2 GREEN on the honest fan (every cell's dihedral == its lifted corner);
//   3 GREEN on the legitimate cone (Σ = 300° ≠ 2π stays consistent — α
//      never looks at the sum; no cone-detector).
//
// Home: scripts/app-leg/ (the flat suite stays at its 112 @ 1 baseline).

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
const { thicken } = req('src/lib/thicken.ts');
const { readPillarDihedrals } = req('src/lib/conformalAtom.ts');

console.log('I hand in owned thicken products and read the per-cell lift-coherence seal; I do NOT walk, render, or measure geometry.');
console.log('A green asserts THE LIFT HELD — never "the metric matches the world"; it cannot catch a rewrite of BOTH records nor D5 mint-fabrication (R2 upstream).');

let failures = 0;
const check = (label, pass, detail = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${label}${detail ? ` — ${detail}` : ''}`);
  if (!pass) failures += 1;
};
const DEG = (r) => Math.round((r * 180) / Math.PI);

// ---- the owned product: the door-3 terrain fan × I -------------------------
const cube1 = applyAmboDissection(createSeedShape('cube'));
const cubocta = cube1.cells.find((c) => c.topology === 'cuboctahedron' && c.kind !== 'parent');
const terrain = applyPyritohedralDiagonalization(cube1, cubocta.id);
const coreCell = terrain.cells.find((c) => c.kind === 'core' && c.sourceOperation === 'pyritohedral-diagonalization');
const mid = Object.values(terrain.vertices).find(
  (v) => v.createdBy && v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2,
).id;
const lift = openLift(terrain, mid, coreCell.id);
const thickened = thicken(lift.shape).shape;
const hubPillar = `${mid}@I`;

// ---- 2 · GREEN on the honest fan -------------------------------------------
console.log('\n— the honest fan: the lift held —');
const honest = readPillarDihedrals(lift.shape, thickened);
const hub = honest.find((r) => r.pillarEdgeId === hubPillar);
check(
  '2 · every cell\'s dihedral record equals the cornerAngle record it was lifted from — THE LIFT HELD on all five prisms',
  Boolean(hub) && hub.consistent === true && hub.cellCount === 5,
  hub ? `cells ${hub.cellCount} · consistent ${hub.consistent}` : 'hub reading missing',
);
check(
  '2b · every interior pillar of the fan product reads coherent',
  honest.every((r) => r.consistent),
  honest.map((r) => (r.consistent ? 'ok' : 'RED')).join(' '),
);

// ---- 3 · GREEN on the legitimate cone --------------------------------------
check(
  '3 · the SAME hub is a REAL cone (Σ = 300° ≠ 2π) AND stays coherent — α never reads the sum; the guard is not a cone-detector',
  Boolean(hub) && hub.classification === 'cone' && DEG(hub.totalDihedral) === 300 && hub.consistent === true,
  hub ? `Σ=${DEG(hub.totalDihedral)}° · ${hub.classification} · consistent ${hub.consistent}` : '',
);

// ---- 1 ★ THE PLANT, direction one: the CELL record bent --------------------
console.log('\n— ★ THE PLANTS (a single bent record fires the guard) —');
let plantedOnce = false;
const bentCells = thickened.cells.map((c) => {
  if (plantedOnce || !c.dihedralAngles || c.dihedralAngles[hubPillar] === undefined) return c;
  plantedOnce = true;
  return { ...c, dihedralAngles: { ...c.dihedralAngles, [hubPillar]: c.dihedralAngles[hubPillar] + 0.1 } };
});
const bentCellRead = readPillarDihedrals(lift.shape, { ...thickened, cells: bentCells });
const bentCellHub = bentCellRead.find((r) => r.pillarEdgeId === hubPillar);
check(
  '1 ★ THE CELL RECORD BENT (+0.1 rad on one dihedral) → the guard FIRES: the lift no longer holds at the hub',
  plantedOnce && Boolean(bentCellHub) && bentCellHub.consistent === false,
  bentCellHub ? `consistent ${bentCellHub.consistent}` : '',
);
check(
  '1-local · the alarm is LOCAL: every other pillar stays coherent',
  bentCellRead.filter((r) => !r.consistent).length === 1,
  `${bentCellRead.filter((r) => !r.consistent).length} incoherent pillar(s)`,
);

// ---- 1b ★ THE PLANT, direction two: the SOURCE record bent -----------------
let cornerBent = false;
const bentFaces = thickened.faces.map((f) => {
  if (cornerBent || !f.id.endsWith('@0') || !f.cornerAngles) return f;
  const k = f.vertexIds.indexOf(`${mid}@0`);
  if (k < 0) return f;
  cornerBent = true;
  const corners = [...f.cornerAngles];
  corners[k] += 0.1;
  return { ...f, cornerAngles: corners };
});
const bentSourceRead = readPillarDihedrals(lift.shape, { ...thickened, faces: bentFaces });
const bentSourceHub = bentSourceRead.find((r) => r.pillarEdgeId === hubPillar);
check(
  '1b ★ THE SOURCE RECORD BENT instead (the base copy\'s cornerAngle +0.1) → the SAME guard FIRES — either record\'s drift breaks the lift',
  cornerBent && Boolean(bentSourceHub) && bentSourceHub.consistent === false,
  bentSourceHub ? `consistent ${bentSourceHub.consistent}` : '',
);

console.log(failures === 0 ? '\nDIAGNOSE-D6 (α): ALL GREEN — the plants FIRED, the lift holds where it should' : `\nDIAGNOSE-D6 (α): ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
