#!/usr/bin/env node

// DIAGNOSTIC — P4, THICKEN: the atom EXTENDS to the per-(cell,edge) DIHEDRAL.
// Each base corner θ becomes the dihedral around the vertical pillar v×I;
// the wall meets the floor at π/2 (the ⊥ product). The 3-D seal is LOCAL —
// per interior pillar, Σ(cell dihedrals): SMOOTH = 2π · an HONEST CONE ≠ 2π
// (OWNED, its angle reported, ⛔ never refused) · REFUSAL only for a
// NON-MANIFOLD 3-edge (the cells branch — the base vertex link reads
// junction). The CONSISTENCY SEAL ties the dimensions: Σ dihedral at
// v×I == Σθ_v — two views of one curvature.
//
// THE TEETH:
//   §1 ★ THE STAMP (E1/E6): the thickened owned square's one prism cell
//      carries VERTICAL v@I = 90° ×4 + HORIZONTAL e@0/e@1 = 90° everywhere,
//      KEYED by edge id, combinatorial (no positions); the base corners
//      ride verbatim to F×{0}/F×{1}; an un-owned base leaves the cell
//      un-owned;
//   §2 ★★ THE THREE OUTCOMES (E2/E3/E5): the flat TORUS pillar reads
//      SMOOTH Σ=2π (the quotient wrap-sum: one cell, the whole 2π wedge);
//      the CUBE corner reads CONE 3π/2 (3 squares) and the OCTAHEDRON CONE
//      4π/3 (4 triangles) — OWNED and reported, NOT refused; the
//      NON-MANIFOLD 3-edge (thicken over the P2 junction base) REFUSES with
//      the 3-edge sentence;
//   §3 ★★ THE CONSISTENCY SEAL (E4) + the plant: Σ at v×I == Σθ_v on every
//      subject; a PLANTED 85° dihedral (where the base corner is 90°)
//      breaks consistency AND the smooth seal — RED every run;
//   §4 E7/E8: the ONE union re-sealed (manifest :87 reads the working
//      geometry.ts) · own-only (no render register reads either atom).
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
const { applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { acquireComplex, identify } = req('src/lib/complexIdentification.ts');
const { subdivideFace } = req('src/lib/surfaceRefinement.ts');
const { thicken } = req('src/lib/thicken.ts');
const { computeSeedCornerAngles, readPillarDihedrals } = req('src/lib/conformalAtom.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const near = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;
let seq = 60;
const P = Math.PI;

console.log('P4 — thicken lifts the corner to the dihedral; smooth 2π · honest cone · branching refused\n');

const G = () => usePlaygroundStore.getState();
G().resetPlayground();

// ---------------------------------------------------------------------------
// §1 ★ the stamp — keyed, combinatorial, riding copies, honest un-owned
// ---------------------------------------------------------------------------
console.log('----- §1 ★ the stamp: vertical θ_v · horizontal π/2 · copies ride · un-owned stays un-owned -----');
const sq = G().invokeForm(nGon(4), 'p4s');
const sqTh = thicken(sq).shape;
const sqCell = sqTh.cells[0];
const dm = sqCell.dihedralAngles ?? {};
note(`stamp map (deg): { ${Object.entries(dm).map(([k, v]) => `${k.split(':').pop()}: ${((v * 180) / P).toFixed(0)}`).join(', ')} }`);
const verticals = Object.keys(dm).filter((k) => k.endsWith('@I'));
const horizontals = Object.keys(dm).filter((k) => k.endsWith('@0') || k.endsWith('@1'));
check('★ §1 (E1) the owned square\'s prism cell: FOUR vertical pillars at θ_v = π/2 each, keyed v@I',
  verticals.length === 4 && verticals.every((k) => near(dm[k], P / 2)));
check('★ §1 (E6) EVERY horizontal (e@0 · e@1, the wall-floor dihedrals) = π/2 — the ⊥ product, eight of them',
  horizontals.length === 8 && horizontals.every((k) => near(dm[k], P / 2)));
check('§1 (E1) the base corners RIDE verbatim to both face copies (F×{0}, F×{1} aligned)',
  sqTh.faces
    .filter((f) => f.id.endsWith('@0') || f.id.endsWith('@1'))
    .filter((f) => !f.id.includes('edge'))
    .every((f) => f.cornerAngles?.length === 4 && f.cornerAngles.every((a) => near(a, P / 2))) &&
    !/\.position/.test(fs.readFileSync(path.join(repoRoot, 'src/lib/conformalAtom.ts'), 'utf8')));
const bare = thicken(require(path.join(repoRoot, 'src/lib/multiform.ts')).loadForm(nGon(4), 'p4b')).shape;
check('§1 an UN-OWNED base leaves the cell UN-OWNED and the copies un-owned (nothing fabricated)',
  bare.cells.every((c) => c.dihedralAngles === undefined) &&
    bare.faces.every((f) => f.cornerAngles === undefined));

// ---------------------------------------------------------------------------
// §2 ★★ the three outcomes — smooth · cone (owned) · refusal (branching)
// ---------------------------------------------------------------------------
console.log('\n----- §2 ★★ smooth 2π · the cones OWNED (3π/2 · 4π/3) · the non-manifold 3-edge REFUSES -----');
const host = G().invokeForm(nGon(4), 'p4t');
const torus = applyPlaygroundOperationTo('glue-torus', host, null, (seq += 1), 8, [], null).born.shape;
const torusTh = thicken(torus).shape;
const torusAcq = acquireComplex(torus, [host]);
const torusPillars = readPillarDihedrals(torus, torusTh, torusAcq ? torusAcq.complex : undefined);
note(`torus pillar: ${torusPillars.map((r) => `${r.classification} Σ=${(r.totalDihedral / P).toFixed(4)}π (cells ${r.cellCount})`).join(' · ')}`);
check('★★ §2 (E2) SMOOTH: the flat torus vertex\'s pillar reads Σ dihedral = 2π — Euclidean around the edge (the quotient wrap-sum carries the whole wedge)',
  torusPillars.length === 1 &&
    torusPillars[0].classification === 'smooth' &&
    near(torusPillars[0].totalDihedral, 2 * P) &&
    torusPillars[0].coneAngle === null);
const cubeSurf = computeSeedCornerAngles({ ...createSeedShape('cube'), cells: [] });
const cubePillars = readPillarDihedrals(cubeSurf, thicken(cubeSurf).shape);
const octaSurf = computeSeedCornerAngles({ ...createSeedShape('octahedron'), cells: [] });
const octaPillars = readPillarDihedrals(octaSurf, thicken(octaSurf).shape);
note(`cube: ${cubePillars.length} pillars · Σ=${(cubePillars[0].totalDihedral / P).toFixed(4)}π · octa: ${octaPillars.length} pillars · Σ=${(octaPillars[0].totalDihedral / P).toFixed(4)}π`);
check('★★ §2 (E3) THE CONE IS OWNED, NOT REFUSED: every cube corner pillar reads CONE at 3π/2 (3 squares, 3 cells), the angle reported',
  cubePillars.length === 8 &&
    cubePillars.every(
      (r) => r.classification === 'cone' && r.cellCount === 3 && near(r.totalDihedral, (3 * P) / 2) && near(r.coneAngle, (3 * P) / 2),
    ));
check('★★ §2 (E3) …and every octahedron pillar reads CONE at 4π/3 (4 triangles, 4 cells) — two cone angles, both owned',
  octaPillars.length === 6 &&
    octaPillars.every(
      (r) => r.classification === 'cone' && r.cellCount === 4 && near(r.totalDihedral, (4 * P) / 3) && near(r.coneAngle, (4 * P) / 3),
    ));
// E5 — the non-manifold 3-edge: thicken over the P2 junction base (the
// subdivided owned square's rim identified with its own chord)
const sqJ = G().invokeForm(nGon(4), 'p4j');
const fJ = sqJ.faces[0];
const subJ = subdivideFace(sqJ, fJ, fJ.vertexIds[0], fJ.vertexIds[2]);
const rimJ = subJ.shape.edges.find((e) => !e.id.includes(':chord'));
const chordJ = subJ.shape.edges.find((e) => e.id.includes(':chord'));
const junctionBase = identify(subJ.shape, [rimJ.id], [chordJ.id], 'preserving', null);
const junctionTh = thicken(junctionBase.shape).shape;
check('★ §2 (E5) THE REFUSAL fires ONLY for the branching edge: the pillar over the P2 junction base throws the NON-MANIFOLD 3-EDGE sentence (the cones above were NOT refused)',
  junctionBase.gate.manifold === false &&
    (() => {
      try {
        readPillarDihedrals(junctionBase.shape, junctionTh, junctionBase.complex);
        return false;
      } catch (e) {
        const msg = String(e.message);
        return msg.includes('NON-MANIFOLD 3-edge') && msg.includes('the cells around a pillar BRANCH');
      }
    })());

// ---------------------------------------------------------------------------
// §3 ★★ the consistency seal + the 85° plant
// ---------------------------------------------------------------------------
console.log('\n----- §3 ★★ Σ at v×I == Σθ_v everywhere + the 85° plant -----');
check('★★ §3 (E4) THE CONSISTENCY SEAL: Σ dihedral at v×I == Σθ_v on EVERY subject (torus 2π · cube 3π/2 · octa 4π/3) — two views of one curvature',
  torusPillars.every((r) => r.consistent && near(r.baseAngleSum, r.totalDihedral)) &&
    cubePillars.every((r) => r.consistent) &&
    octaPillars.every((r) => r.consistent));
// THE PLANT (runs every time): one cube cell's pillar dihedral bent to 85°
const bentCells = thicken(cubeSurf).shape.cells.map((c, i) => {
  if (i !== 0 || !c.dihedralAngles) return c;
  const firstPillar = Object.keys(c.dihedralAngles).find((k) => k.endsWith('@I'));
  return { ...c, dihedralAngles: { ...c.dihedralAngles, [firstPillar]: (85 * P) / 180 } };
});
const bentPillars = readPillarDihedrals(cubeSurf, { ...thicken(cubeSurf).shape, cells: bentCells });
const bent = bentPillars.find((r) => !r.consistent);
note(`plant: the bent pillar reads Σ=${bent ? ((bent.totalDihedral * 180) / P).toFixed(0) : '—'}° vs base Σθ=${bent ? ((bent.baseAngleSum * 180) / P).toFixed(0) : '—'}° (off by 5°)`);
check('★★ §3 (E4) THE PLANT BITES: an 85° dihedral where the base corner is 90° breaks the consistency seal by exactly 5° — and nothing else can hide it',
  Boolean(bent) &&
    near(Math.abs(bent.totalDihedral - bent.baseAngleSum), (5 * P) / 180) &&
    bentPillars.filter((r) => !r.consistent).length === 1);

// ---------------------------------------------------------------------------
// §4 the union re-sealed · own-only
// ---------------------------------------------------------------------------
console.log('\n----- §4 the union re-sealed (manifest :87) · own-only -----');
const manifest = fs.readFileSync(path.join(repoRoot, 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'), 'utf8');
const geoRow = manifest.split(/\r?\n/).find((l) => l.startsWith('src/types/geometry.ts'));
const geoSha = crypto
  .createHash('sha256')
  .update(fs.readFileSync(path.join(repoRoot, 'src/types/geometry.ts'), 'utf8').replace(/\r/g, ''))
  .digest('hex');
check('§4 (E7) manifest :87 row === sha256(working geometry.ts) — THE UNION\'s re-seal is LIVE',
  Boolean(geoRow) && geoRow.trim().split(/\s+/).pop() === geoSha);
check('§4 (E8) OWN-ONLY: no render register reads either atom (cornerAngles / dihedralAngles — zero hits in the six registers)',
  [
    'src/manuscript/InkedForm.tsx',
    'src/manuscript/InkedPlainForm.tsx',
    'src/manuscript/InkedSkeleton.tsx',
    'src/manuscript/InkedDomain.tsx',
    'src/manuscript/laidBodyModel.ts',
    'src/manuscript/laidInkedModel.ts',
  ].every((p) => {
    const src = fs.readFileSync(path.join(repoRoot, p), 'utf8');
    return !src.includes('cornerAngles') && !src.includes('dihedralAngles');
  }));

console.log(
  `\n--- P4 THE CONFORMAL THICKEN (θ → dihedral · π/2 walls · smooth/cone/refuse · one curvature, two views): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
