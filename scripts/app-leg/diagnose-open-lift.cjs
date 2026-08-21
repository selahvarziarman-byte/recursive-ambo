#!/usr/bin/env node

// DIAGNOSTIC — THE OPEN-STAR EXTRACTOR (DOOR 3; SEAL_OPEN_STAR_EXTRACTOR,
// researcher 1837 lineage contract). Pure node, no server, no port use.
// Placed in scripts/app-leg/ (the non-suite diagnostics home, precedent
// diagnose-deficit-app.cjs) so the flat suite glob stays at its sealed
// 112 @ 1 baseline.
//
// WHAT THIS PROVES, in the SEAL's order:
//   CLEAN — openLift (the COMMITTED module) on the sovereign's terrain
//   (ambo(cube) → central cuboctahedron → pyritohedral-diagonalization)
//   extracts the n=5 open star: 5 carried triangles, owned Σθ = 300° at the
//   centre with the TRUE wedge parts [60,60,45,45,90] (R2 2026-08-14: the
//   mint sites acos-import from positions — the parts changed from the
//   stamped uniform 60s, the sum did not), rim FREE (V=6/E=10/F=5,
//   nothing minted, nothing merged), the
//   birth-name 'open-lift' single-parent non-consuming, every vertex's
//   createdBy carried VERBATIM (the primalMultiset is a pure function of the
//   carried createdBy chain — the seed-stamp is exactly what severs it).
//   THE FOUR PLANTS — each corruption RED when planted, GREEN clean:
//     1 angle-drift    (a carried cornerAngle ≠ owned ⇒ Σθ ≠ 300°)
//     2 fabricated name (operation 'seed' / a minted vertex id)
//     3 lost rim       (a closure — rim vertices identified ⇒ no longer open)
//     4 erased descent (loadForm-style seed-stamp resets the createdBy chain)
//   END-TO-END — through the COMMITTED extractor (not a by-hand extract):
//   thicken → buildFormDomain sound (v12 e26 f20 c5) → the caption reads the
//   SEALED, measured 1 × 300° where the heuristic k×90° would lie 450°; the
//   cone edge named by the terrain's own lineage; readCellSurface 15/15/26.

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
const { buildFormDomain } = req('src/manuscript/formDomainModel.ts');
const A = req('src/manuscript/apertureModel.ts');

let failures = 0;
const check = (label, pass, detail = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`);
  if (!pass) failures += 1;
};

// ---------- the terrain (the sovereign's construction, committed ops) -------
const cube1 = applyAmboDissection(createSeedShape('cube'));
const cubocta = cube1.cells.find((c) => c.topology === 'cuboctahedron' && c.kind !== 'parent');
const terrain = applyPyritohedralDiagonalization(cube1, cubocta.id);
const coreCell = terrain.cells.find((c) => c.kind === 'core' && c.sourceOperation === 'pyritohedral-diagonalization');
const mid = Object.values(terrain.vertices).find(
  (v) => v.createdBy && v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2,
).id;

// ---------- the ASSESSOR — the checks the plants must trip ------------------
// Σθ at the centre from the CARRIED cornerAngles (index-aligned to vertexIds).
const sumAtCenter = (shape, center) => {
  let sum = 0;
  for (const face of shape.faces) {
    if (!Array.isArray(face.cornerAngles)) return null;
    face.vertexIds.forEach((v, k) => {
      if (v === center) sum += face.cornerAngles[k];
    });
  }
  return sum;
};
const DEG = (r) => (r * 180) / Math.PI;

function assess(lift, source) {
  const shape = lift.shape;
  const n = shape.faces.length;
  const sum = sumAtCenter(shape, lift.center);
  const vertexIds = Object.keys(shape.vertices);
  const carriedSet = new Set([lift.center, ...lift.rimVertexIds]);
  return {
    // plant 1 target — the owned angle carriage
    angles:
      sum !== null && Math.abs(DEG(sum) - 300) < 1e-6,
    // plant 2 target — the birth-name
    name:
      shape.genealogy.operation === 'open-lift' &&
      shape.genealogy.parentShapeId === source.id &&
      shape.genealogy.generationDepth === source.genealogy.generationDepth + 1 &&
      shape.genealogy.createdVertexIds.length === 0 &&
      vertexIds.every((id) => carriedSet.has(id)),
    // plant 3 target — the free rim (open, nothing identified)
    rim:
      vertexIds.length === n + 1 &&
      shape.edges.length === 2 * n &&
      shape.faces.every((f) => f.vertexIds.every((v) => carriedSet.has(v))) &&
      shape.edges.every((e) => e.vertexIds[0] !== e.vertexIds[1]),
    // plant 4 target — the carried descent (createdBy verbatim; the
    // primalMultiset is a pure function of this chain)
    descent: vertexIds.every((id) => {
      const carried = shape.vertices[id].createdBy;
      const truth = source.vertices[id] && source.vertices[id].createdBy;
      return (
        truth &&
        carried.operation === truth.operation &&
        JSON.stringify(carried.sourceVertexIds) === JSON.stringify(truth.sourceVertexIds)
      );
    }),
  };
}

// ---------- CLEAN: the committed extractor on the terrain -------------------
console.log('— CLEAN —');
const lift = openLift(terrain, mid, coreCell.id);
const clean = assess(lift, terrain);
check('clean · 5-triangle star extracted', lift.shape.faces.length === 5 && lift.rimVertexIds.length === 5);
check('clean · owned Σθ at centre = 300° (carried, not re-derived)', clean.angles, `Σ=${Math.round(DEG(sumAtCenter(lift.shape, lift.center)))}°`);
// ★ R2's receipt (2026-08-14): the wedge PARTS are the TRUE measured angles
// [60,60,45,45,90] (2 ring triangles + the touched square's halves + the
// avoided square's half) — no longer the stamped uniform 60s; Σ holds 300°.
{
  const wedgeDegs = lift.shape.faces
    .map((face) => {
      let acc = 0;
      face.vertexIds.forEach((v, k) => {
        if (v === lift.center) acc += (face.cornerAngles ?? [])[k] ?? 0;
      });
      return Math.round(DEG(acc));
    })
    .sort((a, b) => a - b);
  check('clean · the wedge parts are TRUE: [45,45,60,60,90] (R2 — measured, never stamped)', JSON.stringify(wedgeDegs) === JSON.stringify([45, 45, 60, 60, 90]), `[${wedgeDegs.join(',')}]`);
}
check("clean · birth-name 'open-lift', single-parent, non-consuming, nothing minted", clean.name);
check('clean · the rim is FREE (V=6/E=10/F=5, nothing identified)', clean.rim, `V=${Object.keys(lift.shape.vertices).length} E=${lift.shape.edges.length} F=${lift.shape.faces.length}`);
check('clean · descent carried verbatim (createdBy chains intact)', clean.descent);
check('clean · terrain untouched (non-consuming)', terrain.vertices[mid] === lift.shape.vertices[mid] && terrain.faces.length === 72);

// ---------- THE FOUR PLANTS (each corruption must go RED) -------------------
console.log('\n— THE PLANTS (each RED when planted) —');
const deepCopyLift = () => {
  const shape = JSON.parse(JSON.stringify(lift.shape));
  return { ...lift, shape };
};

// 1 · angle-drift: one carried centre corner re-stamped to 90°
{
  const planted = deepCopyLift();
  const face = planted.shape.faces[0];
  face.cornerAngles[face.vertexIds.indexOf(mid)] = Math.PI / 2;
  check('plant 1 · angle-drift caught (Σθ ≠ 300° ⇒ RED)', !assess(planted, terrain).angles);
}
// 2 · fabricated name: the lift claims to be a seed birth
{
  const planted = deepCopyLift();
  planted.shape.genealogy.operation = 'seed';
  check("plant 2 · fabricated name caught ('seed' ⇒ RED)", !assess(planted, terrain).name);
}
// 3 · lost rim: a closure — two rim vertices identified (patchLift-style)
{
  const planted = deepCopyLift();
  const [a, b] = planted.rimVertexIds;
  delete planted.shape.vertices[b];
  for (const f of planted.shape.faces) f.vertexIds = f.vertexIds.map((v) => (v === b ? a : v));
  for (const e of planted.shape.edges) e.vertexIds = e.vertexIds.map((v) => (v === b ? a : v));
  check('plant 3 · lost rim caught (a closure ⇒ RED)', !assess(planted, terrain).rim);
}
// 4 · erased descent: a loadForm-style seed-stamp on every vertex
{
  const planted = deepCopyLift();
  for (const id of Object.keys(planted.shape.vertices)) {
    planted.shape.vertices[id].createdBy = { shapeId: planted.shape.id, operation: 'seed', sourceVertexIds: [] };
  }
  check('plant 4 · erased descent caught (seed-stamp ⇒ RED)', !assess(planted, terrain).descent);
}

// ---------- END-TO-END through the COMMITTED extractor ----------------------
console.log('\n— END-TO-END (the payoff) —');
const band = thicken(lift.shape);
const product = band.shape || band;
check('thicken: 5 cells, every cell owns dihedrals', product.cells.length === 5 && product.cells.every((c) => c.dihedralAngles && Object.keys(c.dihedralAngles).length > 0));
const domain = buildFormDomain(product, [], 'open-lift-e2e', 'the terrain fan room');
const counts = domain.complex.counts;
check('buildFormDomain: sound, counts v12 e26 f20 c5', domain.tower.sound === true && counts.v === 12 && counts.e === 26 && counts.f === 20 && counts.c === 5, JSON.stringify(counts));
const gate = A.buildAperture(domain, { base: lift.shape });
check('gate.ok', gate.ok === true, gate.ok ? '' : String(gate.reason).slice(0, 120));
check('the caption reads the SEALED measured 1 × 300° (heuristic would lie 450°)', Boolean(gate.ok && gate.geometry.label.includes('cone edges (measured): 1 × 300°')), gate.ok ? gate.geometry.label.slice(0, 100) : '');
const src = A.resolveConeAngleSource(domain, { base: lift.shape });
const coneClasses = src.anglesByClass ? [...src.anglesByClass.entries()] : [];
check('coneSource measured; the cone edge named by the terrain lineage', src.kind === 'measured' && coneClasses.length === 1 && Math.abs(DEG(coneClasses[0][1]) - 300) < 1e-6 && coneClasses[0][0].includes(mid), coneClasses.map(([k, v]) => `${k}=${Math.round(DEG(v))}°`).join(','));
const surf = A.readCellSurface(domain, Boolean(gate.ok && gate.geometry.coneEdges));
// INTERIOR TRANSPORT LANDED (mothership 2026-08-21; the 15/15/26 pin expired
// as designed): the fan room is now DEVELOPED — 7 walls + the 2 bounded seam
// portals carrying the 300° cone's holonomy, rods re-laid from the records.
check('readCellSurface (developed cone room): 9 faces / 7 walls / 2 bounded seam portals / 29 rods',
  surf.faces.length === 9 && surf.wallCount === 7 && surf.rods.length === 29 &&
  surf.faces.filter((f) => !f.wall).length === 2 && surf.faces.filter((f) => !f.wall).every((f) => f.bounds),
  `faces=${surf.faces.length} walls=${surf.wallCount} rods=${surf.rods.length}`);

console.log(failures === 0 ? '\nDIAGNOSE-OPEN-LIFT: ALL GREEN' : `\nDIAGNOSE-OPEN-LIFT: ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
