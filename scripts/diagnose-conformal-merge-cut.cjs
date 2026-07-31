#!/usr/bin/env node

// DIAGNOSTIC — P2+P3, THE MERGE + CUT forced angle-transforms (bundle):
// merge and cut invent NO corner-angle — PURE TOPOLOGY. The MERGE fuses
// vertices (the same corners now sum at one vertex: Σθ_w = Σθ_u + Σθ_v);
// the CUT removes a face (its corners leave WITH it; the rim's link OPENS,
// interior → boundary; χ−1). The atom RIDES untouched through both; the
// derived curvature re-sums; Gauss–Bonnet holds with the NEW χ —
// automatically. The pinch is REFUSED, never falsely sealed.
//
// THE TEETH:
//   §1 ★ THE ATOM RIDES (E1/E2): the word-door merges (glue-torus /
//      glue-cylinder / flip-glue-mobius on an OWNED square) keep every
//      corner VERBATIM; the cut door's survivors ride verbatim and the cut
//      face's angles leave with it;
//   §2 ★★ THE MERGE SEAL (E3) + THE PINCH (E4): torus Σ=0=2π·0 (χ=0
//      certified) · cylinder Σ=0 · Möbius Σ=0; the PLANT (assert the
//      PRE-merge χ) breaks by exactly 2π; and a REAL owned 3-wedge merge
//      (the P1-subdivided square's rim ⊕ chord) REFUSES — the valence
//      throw FIRES, never a silent false seal;
//   §3 ★★ THE CUT SEAL (E5): tetra−face Σ=2π=2π·1 (χ=1 certified; apex
//      interior deficit π + three rim boundary turnings π/3); the PLANT
//      (rim kept INTERIOR) reads Σ=5π≠2π — the interior→boundary flip is
//      the load-bearing datum;
//   §4 E7/E8: EXPECTED NO UNION — the frozen ops (complexIdentification ·
//      cutOperation) + geometry.ts + the manifest all BYTE-IDENTICAL to
//      HEAD; own-only (no render register reads the atom).
//
// MEASURED DISCLOSURE (report §findings): on QUOTIENT vertices (a class
// repeated inside one face cycle) the shape-level neighbour-keyed link
// DEGENERATES to self-loops — a FALSE junction on a true manifold vertex
// (measured on the general-identify torus). The COMMITTED gate on the
// acquired complex (edge-END-keyed) is the truth-bearer: the reader takes
// the complex as an optional argument and classifies through
// readIdentificationGate. Simplicial callers (atom/P1) are byte-unchanged.
//
// NOTE (per the seal §3 — not built): COMBINE = P3∘P3∘P2 (cut a port from
// each operand, glue the rims) — its angle-transform is the COMPOSITION of
// these two; no new primitive exists or is needed.
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
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { acquireComplex, identify } = req('src/lib/complexIdentification.ts');
const { subdivideFace } = req('src/lib/surfaceRefinement.ts');
const { computeSeedCornerAngles, readVertexCurvatures, gaussBonnetTotal } = req('src/lib/conformalAtom.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const near = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;
let seq = 100;
const P = Math.PI;

console.log('P2+P3 — merge fuses, cut removes; the atom rides; Gauss–Bonnet follows the new χ\n');

const G = () => usePlaygroundStore.getState();
G().resetPlayground();

// the gate-classified GB of a born shape (the P2/P3 read: shape + complex)
const sealOf = (shape, ancestry) => {
  const acq = acquireComplex(shape, ancestry ?? null);
  if (!acq) throw new Error('subject not acquirable');
  const readings = readVertexCurvatures(shape, acq.complex);
  return { total: gaussBonnetTotal(readings), readings };
};

// ---------------------------------------------------------------------------
// §1 ★ the atom RIDES — merges and the cut, verbatim
// ---------------------------------------------------------------------------
console.log('----- §1 ★ the atom rides the word merges and the cut, verbatim -----');
const mkMerge = (word, ns) => {
  const host = G().invokeForm(nGon(4), ns);
  const born = applyPlaygroundOperationTo(word, host, null, (seq += 1), 8, [], null);
  return { host, born };
};
const torus = mkMerge('glue-torus', 'mcT');
const cyl = mkMerge('glue-cylinder', 'mcC');
const mob = mkMerge('flip-glue-mobius', 'mcM');
check('★ §1 (E1) every word-door merge keeps EVERY corner VERBATIM ([π/2 ×4] riding the born face, aligned to the remapped vertexIds)',
  [torus, cyl, mob].every(
    ({ host, born }) =>
      born.ok === true &&
      born.born.shape.faces.length === 1 &&
      born.born.shape.faces[0].cornerAngles?.length === born.born.shape.faces[0].vertexIds.length &&
      born.born.shape.faces[0].cornerAngles.every((a, k) => a === host.faces[0].cornerAngles[k]),
  ));
const tetra = computeSeedCornerAngles(createSeedShape('tetrahedron'));
const cutBorn = applyPlaygroundOperationTo('cut', tetra, null, (seq += 1), 8, [], tetra.faces[0].id);
check('★ §1 (E2) the CUT door: all three SURVIVING faces ride [π/3 ×3] verbatim; the cut face and its corners are GONE (F 4→3)',
  cutBorn.ok === true &&
    cutBorn.born.shape.faces.length === 3 &&
    cutBorn.born.shape.faces.every(
      (f) => f.cornerAngles?.length === 3 && f.cornerAngles.every((a) => near(a, P / 3)),
    ) &&
    !cutBorn.born.shape.faces.some((f) => f.id === tetra.faces[0].id));

// ---------------------------------------------------------------------------
// §2 ★★ the merge seal + the pinch refusal
// ---------------------------------------------------------------------------
console.log('\n----- §2 ★★ the merge seal (torus/cylinder/Möbius) + the pinch REFUSES -----');
const torusSeal = sealOf(torus.born.born.shape, [torus.host]);
const torusChi = readFormInvariants(torus.born.born.shape, [torus.host]).chi;
note(`torus: χ=${torusChi} · Σ=${(torusSeal.total / P).toFixed(6)}π · vertex [${torusSeal.readings.map((r) => `${r.valence} Σθ=${(r.angleSum / P).toFixed(2)}π`).join(' · ')}]`);
check('★★ §2 (E3) SQUARE→TORUS seals: the 4 corners fuse to ONE interior vertex, Σθ=2π, deficit 0 ⇒ Σ=0=2π·0 (χ=0 CERTIFIED)',
  torusChi === 0 &&
    torusSeal.readings.length === 1 &&
    torusSeal.readings[0].valence === 'interior' &&
    near(torusSeal.readings[0].angleSum, 2 * P) &&
    near(torusSeal.total, 0));
const cylSeal = sealOf(cyl.born.born.shape, [cyl.host]);
const mobSeal = sealOf(mob.born.born.shape, [mob.host]);
check('§2 (E3) CYLINDER and MÖBIUS seal too: two boundary vertices each, Σθ=π, turning 0 ⇒ Σ=0=2π·0 (χ=0 certified both)',
  readFormInvariants(cyl.born.born.shape, [cyl.host]).chi === 0 &&
    readFormInvariants(mob.born.born.shape, [mob.host]).chi === 0 &&
    cylSeal.readings.length === 2 &&
    cylSeal.readings.every((r) => r.valence === 'boundary' && near(r.angleSum, P)) &&
    near(cylSeal.total, 0) &&
    mobSeal.readings.every((r) => r.valence === 'boundary' && near(r.angleSum, P)) &&
    near(mobSeal.total, 0));
// THE PLANT (E3c, runs every time): assert the PRE-merge χ — the seal must
// contradict it by exactly 2π (χ moved 1→0 and the angles are honest).
const preMergeChi = readFormInvariants(torus.host).chi;
note(`plant: pre-merge χ=${preMergeChi} → |Σ − 2πχ_pre| = ${(Math.abs(torusSeal.total - 2 * P * preMergeChi) / P).toFixed(4)}π (must be 2π)`);
check('★★ §2 (E3) THE PLANT BITES: fusing the corners but asserting the PRE-merge χ (square, χ=1) contradicts by EXACTLY 2π — the seal follows the NEW χ or it reds',
  preMergeChi === 1 && near(Math.abs(torusSeal.total - 2 * P * preMergeChi), 2 * P));
// THE PINCH (E4, must FIRE): a REAL owned 3-wedge merge — the P1-subdivided
// square's rim edge identified with its own chord (both children owned).
const sqP = G().invokeForm(nGon(4), 'mcP');
const fP = sqP.faces[0];
const subP = subdivideFace(sqP, fP, fP.vertexIds[0], fP.vertexIds[2]);
const rimP = subP.shape.edges.find((e) => !e.id.includes(':chord'));
const chordP = subP.shape.edges.find((e) => e.id.includes(':chord'));
const pinch = identify(subP.shape, [rimP.id], [chordP.id], 'preserving', null);
check('★★ §2 (E4) THE PINCH REFUSES — the owned 3-wedge merge (rim ⊕ chord on the subdivided square) throws the valence sentence; the refusal FIRES, never a silent false 2πχ',
  pinch.gate.manifold === false &&
    pinch.shape.faces.every((f) => Array.isArray(f.cornerAngles)) &&
    (() => {
      try {
        readVertexCurvatures(pinch.shape, pinch.complex);
        return false;
      } catch (e) {
        const msg = String(e.message);
        return msg.includes('reads link valence "junction"') && msg.includes('Gauss–Bonnet speaks only for interior');
      }
    })());

// ---------------------------------------------------------------------------
// §3 ★★ the cut seal + the rim-interior plant
// ---------------------------------------------------------------------------
console.log('\n----- §3 ★★ the cut seal (tetra − face) + the rim-kept-interior plant -----');
const cutShape = cutBorn.born.shape;
const cutChi = readFormInvariants(cutShape, [tetra]).chi;
const cutSeal = sealOf(cutShape, [tetra]);
const interiorCount = cutSeal.readings.filter((r) => r.valence === 'interior').length;
const boundaryCount = cutSeal.readings.filter((r) => r.valence === 'boundary').length;
note(`tetra−face: χ=${cutChi} · Σ=${(cutSeal.total / P).toFixed(6)}π · ${interiorCount} interior (Σθ=π, deficit π) + ${boundaryCount} boundary (Σθ=2π/3, turning π/3)`);
check('★★ §3 (E5) TETRA−FACE seals: Σ = π + 3·(π/3) = 2π = 2π·1 (χ=1 CERTIFIED); the rim OPENED interior→boundary, the apex stayed interior',
  cutChi === 1 &&
    interiorCount === 1 &&
    boundaryCount === 3 &&
    near(cutSeal.total, 2 * P) &&
    cutSeal.readings.find((r) => r.valence === 'interior').angleSum === P &&
    cutSeal.readings.filter((r) => r.valence === 'boundary').every((r) => near(r.angleSum, (2 * P) / 3)));
// THE PLANT (E5b, runs every time): keep the rim INTERIOR — the boundary
// term is load-bearing; without the flip the total reads 5π, not 2π.
const plantedTotal = cutSeal.readings.reduce(
  (sum, r) => sum + (2 * P - r.angleSum), // every vertex read as interior
  0,
);
note(`plant (rim kept interior): Σ = ${(plantedTotal / P).toFixed(4)}π (must be 5π ≠ 2π)`);
check('★★ §3 (E5) THE PLANT BITES: the rim kept interior reads Σ = 5π ≠ 2π·1 — the interior→boundary flip is the load-bearing datum',
  near(plantedTotal, 5 * P) && !near(plantedTotal, 2 * P * cutChi));

// ---------------------------------------------------------------------------
// §4 E7/E8 — expected NO UNION · own-only
// ---------------------------------------------------------------------------
console.log('\n----- §4 no frozen touch (expected NO UNION held) · own-only -----');
const headEq = (p) => {
  const working = fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r/g, '');
  const head = execFileSync('git', ['show', `HEAD:${p}`], { cwd: repoRoot, encoding: 'utf8' }).replace(/\r/g, '');
  return working === head;
};
check('§4 (E7) the frozen ops are BYTE-IDENTICAL to HEAD — the atom rode without a carry (complexIdentification · cutOperation · geometry.ts · the manifest)',
  ['src/lib/complexIdentification.ts', 'src/lib/cutOperation.ts', 'src/types/geometry.ts', 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'].every(headEq));
check('§4 (E8) OWN-ONLY: no render register reads the atom',
  [
    'src/manuscript/InkedForm.tsx',
    'src/manuscript/InkedPlainForm.tsx',
    'src/manuscript/InkedSkeleton.tsx',
    'src/manuscript/InkedDomain.tsx',
    'src/manuscript/laidBodyModel.ts',
    'src/manuscript/laidInkedModel.ts',
  ].every((p) => !fs.readFileSync(path.join(repoRoot, p), 'utf8').includes('cornerAngles')));

console.log(
  `\n--- P2+P3 THE CONFORMAL MERGE + CUT (the atom rides · the seal follows χ · the pinch refuses): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
