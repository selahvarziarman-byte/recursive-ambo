#!/usr/bin/env node

// DIAGNOSTIC — THE APEX-LIFT (SEAL_APEX_LIFT_THE_CONE): the faithful body
// BECOMES the cone. The fan of slant R with apex material-angle Θ = 2π − δ
// rolls (an ISOMETRY — no material made or destroyed) to the cone:
//   s = Θ/2π · baseRadius = R·s · apexHeight = R·√(1−s²).
//
// THE CLAUSES:
//   E1 ★★ THE APEX LIFTS BY THE ISOMETRY — on the APP-PATH fold-borns:
//        δ=300° → h≈0.9860R (triangle needle) · δ=270° → h≈0.9682R
//        (square); the rim contracts to R·s; the slant √(r²+h²) == R;
//        h TRACKS δ (the two specimens' heights differ — a constant h reds).
//   E1b  THE FLAT DEGENERATE IS INERT — a δ=0 apex (planted at exactly
//        Σθ=2π) → kind 'flat', h=0, rim at R — the pre-lift placements,
//        byte-equal.
//   E2 ★★ R1 RIDES UNTOUCHED — readVertexCurvatures reads the IDENTICAL
//        curvature on the lifted body (the atom is distance-free), and the
//        deficit mark's center sits at the LIFTED apex [0,0,h].
//   E4   THE SADDLE GUARD — a planted δ<0 apex (Σθ>2π) → 'saddle-declared',
//        h=0, every position finite — the honest limit, never an imaginary
//        shape.
//   E5   the model surface: faceDisk.radius == lift.baseRadius (the ghosts
//        and the view read the contracted base), seams run apex→rim at
//        slant R.
//
// Anti-mock: the REAL TS modules through the transpile hook; the specimens
// ride the APP path (invokePrimitive → the handleInvoke stamp → applyFoldTo).

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
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { invokePrimitive } = req('src/manuscript/writtenFormModel.ts');
const { applyFoldTo } = req('src/manuscript/handGestureModel.ts');
const { computeSeedCornerAngles, readVertexCurvatures, gaussBonnetTotal } = req('src/lib/conformalAtom.ts');
const { computeFaithfulLift } = req('src/manuscript/faithfulBodyModel.ts');
const { buildDeficitRegisterModel, faithfulDeficitDatum } = req('src/manuscript/deficitRegisterModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const near = (a, b, eps = 1e-4) => Math.abs(a - b) < eps;
const P = Math.PI;

console.log('THE APEX-LIFT — the faithful body becomes the cone (the isometry, drawn)\n');

const wireForm = (form) => {
  const owned = computeSeedCornerAngles(form.shape);
  return {
    ...form,
    shape: owned,
    render: form.render.mode === 'plain' ? { ...form.render, shape: owned } : form.render,
  };
};
const foldBorn = (key, seqA, seqB) => {
  const invoked = wireForm(invokePrimitive(key, seqA));
  const fold = applyFoldTo(invoked.shape, null, [], [{ edgeA: 0, edgeB: 1, mode: 'preserving' }], seqB, 8);
  if (!fold.ok || fold.born.render.mode !== 'faithful') {
    throw new Error(`apex-lift witness: the ${key} fold did not route faithful`);
  }
  return fold.born;
};

// ---------------------------------------------------------------------------
// §1 (E1) ★★ the isometry, on the app-path specimens
// ---------------------------------------------------------------------------
console.log('----- §1 (E1) ★★ the apex lifts by the isometry (h from the OWNED δ; slant preserved) -----');
const tri = foldBorn('triangle', 970, 971);
const sq = foldBorn('square', 972, 973);
const triModel = tri.render.model;
const sqModel = sq.render.model;
const expectH = (deltaDeg) => {
  const s = (2 * P - (deltaDeg * P) / 180) / (2 * P);
  return Math.sqrt(1 - s * s);
};
note(`triangle: lift=${triModel.lift.kind} h=${triModel.lift.apexHeight} r=${triModel.lift.baseRadius} (expect h≈${expectH(300).toFixed(6)}, r≈${(1 / 6).toFixed(6)})`);
note(`square:   lift=${sqModel.lift.kind} h=${sqModel.lift.apexHeight} r=${sqModel.lift.baseRadius} (expect h≈${expectH(270).toFixed(6)}, r≈0.25)`);
check('§1 (E1) ★★ THE TRIANGLE NEEDLE: δ=300° → kind cone, h = R·√(1−(1/6)²) ≈ 0.9860, rim contracted to R/6 — the apex.position IS [0,0,h] and every rim vertex sits on the contracted circle at z=0',
  triModel.lift.kind === 'cone' &&
    near(triModel.lift.apexHeight, expectH(300)) &&
    near(triModel.lift.baseRadius, 1 / 6) &&
    near(triModel.apex.position[2], expectH(300)) &&
    triModel.apex.position[0] === 0 &&
    triModel.apex.position[1] === 0 &&
    triModel.rimVertices.every(
      (r) => near(Math.hypot(r.position[0], r.position[1]), 1 / 6) && r.position[2] === 0,
    ));
check('§1 (E1) ★★ THE SQUARE CONE: δ=270° → h ≈ 0.9682, rim at R/4',
  sqModel.lift.kind === 'cone' &&
    near(sqModel.lift.apexHeight, expectH(270)) &&
    near(sqModel.lift.baseRadius, 0.25) &&
    near(sqModel.apex.position[2], expectH(270)));
check('§1 (E1) ★★ THE SLANT IS PRESERVED (the isometry\'s own receipt): √(baseRadius² + h²) == R on BOTH specimens, and every seam runs apex→rim at length R',
  [triModel, sqModel].every((m) => {
    const slantOk = near(Math.hypot(m.lift.baseRadius, m.lift.apexHeight), 1);
    const seamsOk = m.seams.every((s) =>
      near(
        Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]),
        1,
      ),
    );
    return slantOk && seamsOk;
  }));
check('§1 (E1/E5) ★★ h TRACKS δ (the wrong-h plant is structural): the two specimens\' heights DIFFER exactly as the isometry says — a constant h, or an un-inverted s, cannot pass both',
  !near(triModel.lift.apexHeight, sqModel.lift.apexHeight, 1e-3) &&
    triModel.lift.apexHeight > sqModel.lift.apexHeight);

// ---------------------------------------------------------------------------
// §2 (E1b) the flat degenerate is inert (the pure branch, driven directly)
// ---------------------------------------------------------------------------
console.log('\n----- §2 (E1b) the flat degenerate: δ=0 → h=0, rim at R — the pre-lift numbers -----');
// the branch is driven through the EXPORTED pure isometry: every reachable
// fold-born is a δ>0 cone (that is the family's point), and a perturbed
// shape cannot pass the acquisition's byte-compared replay — so the
// flat/saddle branches are witnessed on computeFaithfulLift itself, and the
// verdict's wiring to it is source-pinned in §5.
const flatLift = computeFaithfulLift(0);
note(`computeFaithfulLift(0) → ${flatLift.kind} h=${flatLift.apexHeight} r=${flatLift.baseRadius}`);
check('§2 (E1b) THE FLAT DEGENERATE IS INERT: δ=0 → kind `flat`, h = 0, base radius = R = 1 — the pre-lift placements exactly (the lift is a no-op where there is no deficit); a hair above zero lifts, exactly (the boundary is δ=0 itself)',
  flatLift.kind === 'flat' &&
    flatLift.apexHeight === 0 &&
    flatLift.baseRadius === 1 &&
    computeFaithfulLift(1e-6).kind === 'cone');

// ---------------------------------------------------------------------------
// §3 (E2) ★★ R1 rides untouched on the lifted body
// ---------------------------------------------------------------------------
console.log('\n----- §3 (E2) ★★ R1 reads the SAME deficit on the lifted body; the mark sits at the lifted apex -----');
const triLineage = [tri.shape, tri.parentShape].filter(Boolean);
const triDatum = faithfulDeficitDatum(triModel, triLineage);
const triReadings = readVertexCurvatures(triModel.shape, triDatum.complex);
const apexReading = triReadings.find((r) => r.valence === 'interior');
const rimReading = triReadings.find((r) => r.valence === 'boundary');
note(`substrate on the lifted body: apex ${((apexReading.curvature * 180) / P).toFixed(1)}° · rim ${((rimReading.curvature * 180) / P).toFixed(1)}° · Σ = ${((gaussBonnetTotal(triReadings) * 180) / P).toFixed(1)}°`);
check('§3 (E2) ★★ THE ATOM IS DISTANCE-FREE: the lifted body reads the IDENTICAL curvature — apex interior 300°, rim boundary 60°, Σ = 360° = 2πχ (the lift moved positions only; the reading cannot move)',
  triDatum.kind === 'read' &&
    near(apexReading.curvature, (5 * P) / 3, 1e-9) &&
    near(rimReading.curvature, P / 3, 1e-9) &&
    near(gaussBonnetTotal(triReadings), 2 * P, 1e-9));
const triMarks = buildDeficitRegisterModel(triDatum.shape, triDatum.complex);
const apexMark = triMarks.marks.find((m) => m.valence === 'interior');
check('§3 (E2) ★★ THE MARK RIDES THE LIFTED APEX: the cone-point mark\'s center == [0, 0, h] (the register reads apex.position — untouched by this arc, now lifted), wedge still 300°, the ring still closed',
  triMarks.marked &&
    apexMark !== undefined &&
    near(apexMark.center[2], expectH(300)) &&
    apexMark.center[0] === 0 &&
    apexMark.center[1] === 0 &&
    near(apexMark.wedgeAngle, (5 * P) / 3, 1e-9) &&
    apexMark.circuitArcs.length === 1);

// ---------------------------------------------------------------------------
// §4 (E4) the saddle guard — declared, never faked
// ---------------------------------------------------------------------------
console.log('\n----- §4 (E4) the saddle guard: δ<0 has no ℝ³ cone — declared flat, every number finite -----');
const saddleLift = computeFaithfulLift(-P / 2);
note(`computeFaithfulLift(−π/2) → ${saddleLift.kind} h=${saddleLift.apexHeight} r=${saddleLift.baseRadius}`);
check('§4 (E4) THE SADDLE GUARD: δ<0 (Θ>2π, s>1 — the height would be imaginary) → kind `saddle-declared`, h = 0, base at R — the honest limit DECLARED, never a faked shape; every number finite',
  saddleLift.kind === 'saddle-declared' &&
    saddleLift.apexHeight === 0 &&
    saddleLift.baseRadius === 1 &&
    Number.isFinite(saddleLift.apexHeight) &&
    Number.isFinite(saddleLift.baseRadius));

// ---------------------------------------------------------------------------
// §5 (E5) the model surface the consumers read
// ---------------------------------------------------------------------------
console.log('\n----- §5 (E5) the surface the consumers read: faceDisk = the contracted base; the wiring pinned -----');
check('§5 (E5) faceDisk.radius == lift.baseRadius on every specimen (the view\'s cone base, the ghost sweep, the bench all read ONE number) and the lift kind is carried on the model',
  [triModel, sqModel].every((m) => m.faceDisk.radius === m.lift.baseRadius) &&
    ['cone'].includes(triModel.lift.kind) &&
    ['cone'].includes(sqModel.lift.kind));
const modelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/faithfulBodyModel.ts'), 'utf8');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('§5 (E5) THE WIRING IS PINNED: the verdict CALLS computeFaithfulLift (the pure branch §2/§4 witnessed IS the branch the app runs), the un-owned catch declares, and the view draws the cone\'s LATERAL surface from the lift (coneGeometry from lift.apexHeight; the flat degenerates keep the pre-lift disk)',
  modelSrc.includes('lift = computeFaithfulLift(') &&
    modelSrc.includes("lift = { kind: 'unowned-declared', apexHeight: 0, baseRadius: RADIUS };") &&
    viewSrc.includes('model.lift.apexHeight > 0 ? (') &&
    viewSrc.includes('<coneGeometry') &&
    viewSrc.includes('export function FaithfulBody'));

console.log(
  `\n--- THE APEX-LIFT (the fan rolled to its cone: h from the owned δ, slant preserved, flat/saddle/un-owned declared, R1 riding untouched): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
