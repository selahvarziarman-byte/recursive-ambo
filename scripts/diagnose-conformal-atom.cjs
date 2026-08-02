#!/usr/bin/env node

// DIAGNOSTIC — THE CONFORMAL ATOM (§2 first build): the engine OWNS one
// per-corner angle — carried from the INVOCATION source by pure combinatorics
// ((n−2)π/n, never render positions), stamped on the NON-frozen invoke seams,
// derived into per-vertex curvature through the committed vertex-link idiom,
// and SEALED by the general boundary-corrected Gauss–Bonnet:
//     Σ_interior(2π − Σθ_v)  +  Σ_boundary(π − Σθ_v)  ==  2πχ
// — the identity that cannot be cheated. OWN-ONLY: nothing renders.
//
// THE TEETH (this witness BITES):
//   §1 ★ THE ATOM OWNED at a REAL invocation seam: a store-invoked triangle
//      carries [π/3 ×3], a square [π/2 ×4] — aligned to vertexIds, absent
//      nowhere, fabricated never (and the module reads NO positions);
//   §2 ★ THE CURVATURE DERIVES via the link (decomposeLink classifies —
//      never hand-tagged): tetra vertices INTERIOR (deficit π each),
//      triangle vertices BOUNDARY (turning 2π/3 each);
//   §3 ★★ THE SELF-SEAL, BOTH REGIMES + the in-witness PLANT: tetra (χ=2
//      measured) Σ = 4π = 2πχ · triangle (χ=1 measured) Σ = 2π = 2πχ — and
//      a single wrong corner (60°→50°) breaks the identity (the negative
//      control runs EVERY time; a vacuous seal cannot pass);
//   §4 E2/E6/E7 — the stamp is NON-frozen (grep-proof: no stamp in the
//      frozen constructors; geometry.ts the ONLY frozen touch, its re-seal
//      LIVE), and NO render register reads the atom (own-only).
//
// Anti-mock: the REAL TS modules through the transpile hook.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
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
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { computeSeedCornerAngles, readVertexCurvatures, gaussBonnetTotal, regularCornerAngle } = req('src/lib/conformalAtom.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const near = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;

console.log('THE CONFORMAL ATOM: owned from invocation · derived by the link · sealed by Gauss–Bonnet\n');

const G = () => usePlaygroundStore.getState();
G().resetPlayground();

// ---------------------------------------------------------------------------
// §1 ★ the atom OWNED at a REAL invocation seam (the store's invokeForm)
// ---------------------------------------------------------------------------
console.log('----- §1 ★ owned at invocation: triangle 60° · square 90° · combinatorics only -----');
const tri = G().invokeForm(nGon(3), 'ca3');
const sq = G().invokeForm(nGon(4), 'ca4');
note(`triangle face angles: [${(tri.faces[0].cornerAngles ?? []).map((a) => ((a * 180) / Math.PI).toFixed(1)).join(', ')}]°`);
note(`square face angles:   [${(sq.faces[0].cornerAngles ?? []).map((a) => ((a * 180) / Math.PI).toFixed(1)).join(', ')}]°`);
check('★ §1 the store-invoked TRIANGLE owns [π/3, π/3, π/3] — aligned to its 3 vertexIds',
  Array.isArray(tri.faces[0].cornerAngles) &&
    tri.faces[0].cornerAngles.length === tri.faces[0].vertexIds.length &&
    tri.faces[0].cornerAngles.every((a) => near(a, Math.PI / 3)));
check('★ §1 the store-invoked SQUARE owns [π/2 ×4] — the combinatorial (n−2)π/n, both shapes',
  Array.isArray(sq.faces[0].cornerAngles) &&
    sq.faces[0].cornerAngles.length === 4 &&
    sq.faces[0].cornerAngles.every((a) => near(a, Math.PI / 2)) &&
    near(regularCornerAngle(3), Math.PI / 3) &&
    near(regularCornerAngle(4), Math.PI / 2));
const atomSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/conformalAtom.ts'), 'utf8');
check('§1 the atom module reads NO render positions (no `.position` access anywhere — combinatorics only, grep-proof)',
  !/\.position/.test(atomSrc));

// ---------------------------------------------------------------------------
// §2 ★ the curvature DERIVES — the link classifies, never a hand tag
// ---------------------------------------------------------------------------
console.log('\n----- §2 ★ per-vertex curvature via the vertex link -----');
const tetra = computeSeedCornerAngles(createSeedShape('tetrahedron'));
const tetraReadings = readVertexCurvatures(tetra);
note(`tetra: ${tetraReadings.length} vertices · valences [${[...new Set(tetraReadings.map((r) => r.valence))].join(',')}] · deficits [${tetraReadings.map((r) => (r.curvature / Math.PI).toFixed(3)).join(', ')}]π`);
check('★ §2 TETRA: all 4 vertices read INTERIOR through the link (closed cycles) with Σθ_v = π ⇒ deficit π each',
  tetraReadings.length === 4 &&
    tetraReadings.every((r) => r.valence === 'interior' && near(r.angleSum, Math.PI) && near(r.curvature, Math.PI)));
const triReadings = readVertexCurvatures(tri);
note(`triangle: ${triReadings.length} vertices · valences [${[...new Set(triReadings.map((r) => r.valence))].join(',')}] · turnings [${triReadings.map((r) => (r.curvature / Math.PI).toFixed(3)).join(', ')}]π`);
check('★ §2 TRIANGLE: all 3 vertices read BOUNDARY through the link (open arcs) with Σθ_v = π/3 ⇒ turning 2π/3 each',
  triReadings.length === 3 &&
    triReadings.every((r) => r.valence === 'boundary' && near(r.angleSum, Math.PI / 3) && near(r.curvature, (2 * Math.PI) / 3)));
check('§2 the unowned atom REFUSES (a bare seed without the stamp throws — nothing fabricated)',
  (() => {
    try {
      readVertexCurvatures(createSeedShape('tetrahedron'));
      return false;
    } catch (e) {
      return String(e.message).includes('the atom is not owned yet');
    }
  })());

// ---------------------------------------------------------------------------
// §3 ★★ the SELF-SEAL — both regimes, and the plant breaks it
// ---------------------------------------------------------------------------
console.log('\n----- §3 ★★ Gauss–Bonnet, both regimes + the in-witness plant -----');
const tetraInv = readFormInvariants(tetra);
const triInv = readFormInvariants(tri);
const tetraTotal = gaussBonnetTotal(tetraReadings);
const triTotal = gaussBonnetTotal(triReadings);
note(`tetra: χ=${tetraInv.chi} (readFormInvariants) · Σ curvature = ${(tetraTotal / Math.PI).toFixed(6)}π vs 2πχ = ${(2 * tetraInv.chi).toFixed(0)}π`);
note(`triangle: χ=${triInv.chi} · Σ = ${(triTotal / Math.PI).toFixed(6)}π vs 2πχ = ${(2 * triInv.chi).toFixed(0)}π`);
check('★★ §3 TETRAHEDRON (closed, χ=2 CERTIFIED): Σ interior deficits = 4π = 2πχ — the interior term seals',
  tetraInv.chi === 2 && near(tetraTotal, 2 * Math.PI * tetraInv.chi));
check('★★ §3 TRIANGLE (bounded, χ=1 CERTIFIED): Σ boundary turnings = 2π = 2πχ — the boundary term seals (the bare Σ(2π−Σθ) would read 5π ≠ 2π — the correction is load-bearing)',
  triInv.chi === 1 && near(triTotal, 2 * Math.PI * triInv.chi));
// THE PLANT (runs every time — the identity must BITE): one triangle corner
// bent to 50° — Gauss–Bonnet must reject it.
const planted = {
  ...tri,
  faces: tri.faces.map((f, i) =>
    i === 0
      ? { ...f, cornerAngles: f.cornerAngles.map((a, k) => (k === 0 ? (50 * Math.PI) / 180 : a)) }
      : f,
  ),
};
const plantedTotal = gaussBonnetTotal(readVertexCurvatures(planted));
note(`plant (60°→50°): Σ = ${(plantedTotal / Math.PI).toFixed(6)}π (must ≠ 2π)`);
check('★★ §3 THE PLANT BITES: one corner bent 60°→50° breaks the identity (Σ ≠ 2πχ by the exact 10° = π/18)',
  !near(plantedTotal, 2 * Math.PI * triInv.chi, 1e-6) &&
    near(Math.abs(plantedTotal - 2 * Math.PI * triInv.chi), Math.PI / 18, 1e-9));

// ---------------------------------------------------------------------------
// §4 E2/E6/E7 — non-frozen stamp · the one union re-sealed · own-only
// ---------------------------------------------------------------------------
console.log('\n----- §4 the stamp is non-frozen · the union re-sealed · own-only -----');
const storeSrc = fs.readFileSync(path.join(repoRoot, 'src/store/playgroundStore.ts'), 'utf8');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('§4 (E2) the stamp lands on the NON-frozen seams: the zoo store\'s invokeForm AND the manuscript\'s invoke wrapper',
  storeSrc.includes('computeSeedCornerAngles(loadForm(') &&
    viewSrc.includes('computeSeedCornerAngles(invoked.shape)'));
check('§4 (E2) NO stamp in the frozen constructors (primitiveCatalogue · writtenFormModel · multiform — grep-proof)',
  ['src/playground/primitiveCatalogue.ts', 'src/manuscript/writtenFormModel.ts', 'src/lib/multiform.ts'].every(
    (p) => !fs.readFileSync(path.join(repoRoot, p), 'utf8').includes('cornerAngles'),
  ));
check('§4 (E7) OWN-ONLY: no render register reads the atom (InkedForm · InkedPlainForm · InkedSkeleton · InkedDomain · laidBodyModel · laidInkedModel — zero hits)',
  [
    'src/manuscript/InkedForm.tsx',
    'src/manuscript/InkedPlainForm.tsx',
    'src/manuscript/InkedSkeleton.tsx',
    'src/manuscript/InkedDomain.tsx',
    'src/manuscript/laidBodyModel.ts',
    'src/manuscript/laidInkedModel.ts',
  ].every((p) => !fs.readFileSync(path.join(repoRoot, p), 'utf8').includes('cornerAngles')));
const manifest = fs.readFileSync(path.join(repoRoot, 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'), 'utf8');
const geoRow = manifest.split(/\r?\n/).find((l) => l.startsWith('src/types/geometry.ts'));
const geoSha = crypto
  .createHash('sha256')
  .update(fs.readFileSync(path.join(repoRoot, 'src/types/geometry.ts'), 'utf8').replace(/\r/g, ''))
  .digest('hex');
check('§4 (E6) manifest :87 row === sha256(working geometry.ts) — THE UNION\'s re-seal is LIVE',
  Boolean(geoRow) && geoRow.trim().split(/\s+/).pop() === geoSha);
check('§4 the atom module is ROWED — HASH-ROWED since the APEX-LIFT union (2026-08-02, engineer ruling 1807): the atom entered the FROZEN set (its own "freeze candidate once the layer lands" clause, due) and its manifest row is the sha256 line, matching the working bytes',
  (() => {
    const row = manifest
      .split(/\r?\n/)
      .find((line) => line.startsWith('src/lib/conformalAtom.ts'));
    if (!row) return false;
    const sha = crypto
      .createHash('sha256')
      .update(fs.readFileSync(path.join(repoRoot, 'src/lib/conformalAtom.ts'), 'utf8').replace(/\r/g, ''))
      .digest('hex');
    return row.trim().split(/\s+/).pop() === sha && !manifest.includes('NOT_FROZEN src/lib/conformalAtom.ts');
  })());

console.log(
  `\n--- THE CONFORMAL ATOM (owned · derived · sealed): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
