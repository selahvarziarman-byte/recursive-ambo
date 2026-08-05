#!/usr/bin/env node

// DIAGNOSTIC — THE FAITHFUL BODY UNIFICATION (the craft stack, third
// instance; seal SEAL_FAITHFUL_BODY_UNIFICATION): the fold-born cone renders
// through the ONE crafted renderer via the thin adapter — the wash is gone,
// the apex-lift preserved, and the PASS-PARITY INSTRUMENT makes the drift
// impossible silently (the diagnose-the-laid-body shape: the instrument + the
// contradiction, both run every time).
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

const { invokePrimitive } = req('src/manuscript/writtenFormModel.ts');
const { applyFoldTo } = req('src/manuscript/handGestureModel.ts');
const { computeSeedCornerAngles } = req('src/lib/conformalAtom.ts');
const { buildFaithfulInkedModel } = req('src/manuscript/faithfulInkedModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

console.log('THE FAITHFUL BODY UNIFICATION — the cone becomes an inked drawing (the one renderer, the third instance)\n');

// ---------------------------------------------------------------------------
// §1 (E1/E5) the adapter mints a VALID InkedFormModel — the cone preserved
// ---------------------------------------------------------------------------
console.log('----- §1 (E1/E5) the adapter: apex + rim ring · the triangle fan · seams + rim chains · the LIFT preserved -----');
const wireForm = (form) => {
  const owned = computeSeedCornerAngles(form.shape);
  return { ...form, shape: owned, render: form.render.mode === 'plain' ? { ...form.render, shape: owned } : form.render };
};
const sq = wireForm(invokePrimitive('square', 990));
const foldRes = applyFoldTo(sq.shape, null, [], [{ edgeA: 0, edgeB: 1, mode: 'preserving' }], 991, 8);
const faithful = foldRes.ok && foldRes.born.render.mode === 'faithful' ? foldRes.born.render.model : null;
const inked = faithful ? buildFaithfulInkedModel(faithful) : null;
const inkedShape = inked ? inked.immersion.shape : null;
const apexVertex = inkedShape
  ? Object.values(inkedShape.vertices).find((v) => v.id.endsWith(':apex'))
  : null;
const rimVertexCount = inkedShape ? Object.keys(inkedShape.vertices).length - 1 : 0;
note(
  inked
    ? `V=${Object.keys(inkedShape.vertices).length} (apex + ${rimVertexCount} ring) · F=${inkedShape.faces.length} fan triangles · E=${inkedShape.edges.length} (seams + rim chains) · apex z=${apexVertex?.position[2]}`
    : 'the fold did not yield a faithful body',
);
check('§1 (E1) THE ADAPTER MINTS THE FAN: the □-fold cone adapts to an InkedFormModel with the apex + a densified rim ring, >0 triangle-fan faces (each [apex, rim_i, rim_i+1]), seam + rim-chain edges, loops [] (the disk has no basis), and the faithful model\'s invariants/h1Label VERBATIM',
  inked !== null &&
    apexVertex !== null &&
    rimVertexCount >= 12 &&
    inkedShape.faces.length === rimVertexCount &&
    inkedShape.faces.every((f) => f.vertexIds.length === 3 && f.vertexIds[0] === apexVertex.id) &&
    inkedShape.edges.some((e) => e.id.includes(':seam:')) &&
    inkedShape.edges.some((e) => e.id.includes(':rim:')) &&
    inked.loops.length === 0 &&
    inked.invariants === faithful.invariants &&
    inked.h1Label === faithful.h1Label);
check('§1 (E5) ★ THE APEX-LIFT SURVIVES THE UNIFICATION: the adapter\'s apex sits at the frozen model\'s own lift.apexHeight (the 270°-deficit square cone, h ≈ 0.968R — a cone, never flattened) and the rim ring sits on z = 0 at the contracted radius',
  faithful !== null &&
    faithful.lift.kind === 'cone' &&
    near(apexVertex.position[2], faithful.lift.apexHeight) &&
    apexVertex.position[2] > 0.9 &&
    Object.values(inkedShape.vertices)
      .filter((v) => v.id !== apexVertex.id)
      .every((v) => near(v.position[2], 0) && near(Math.hypot(v.position[0], v.position[1]), faithful.lift.baseRadius, 1e-3)));

// ---------------------------------------------------------------------------
// §2 (E2/E3) ★ THE PASS-PARITY INSTRUMENT + THE CONTRADICTION
// ---------------------------------------------------------------------------
console.log('\n----- §2 (E2/E3) ★ the instrument: the faithful route wears the crafted stack; the planted wash FAILS -----');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
// the instrument — a PREDICATE over the view source (run on the real bytes
// AND on the planted contradiction): the faithful route mounts the ONE
// crafted renderer, and the old wash (a coneGeometry/faceDisk-circle
// meshBasic body fill) is GONE from the view
const passParity = (src) =>
  src.includes('faithfulInkedById') &&
  src.includes('<InkedForm') &&
  src.includes('model={faithfulInked}') &&
  !src.includes('<coneGeometry') &&
  !src.includes('circleGeometry args={[model.faceDisk.radius, model.faceDisk.segments]}');
check('§2 (E2) ★ THE RAW PATH IS GONE: the faithful route mounts <InkedForm model={faithfulInked}> through the adapter map, and the old wash (the coneGeometry / faceDisk-circle meshBasic fill) no longer exists in the view — the body wears prepass · hull · lit body · hatching · two-pass',
  passParity(viewSrc));
// THE CONTRADICTION (runs every time): re-plant the wash → the instrument REDS
const planted = viewSrc.replace(
  'model={faithfulInked}',
  'model={faithfulInked}>{/* planted */}<mesh><coneGeometry args={[1,1,64,1,true]} /><meshBasicMaterial /></mesh>',
);
check('§2 (E3) ★ THE CONTRADICTION BITES: the SAME instrument run on a source with the raw meshBasic cone wash re-planted FAILS — a silent drift back to the wash is structurally impossible',
  passParity(planted) === false);
check('§2 (E3) THE OVERLAY KEPT ITS REGISTERS: FaithfulBody still rides as the overlay (seams · rims · dots · the RECOGNITION letter + ghosts) beside the crafted body — the fill props left its signature (no bodyColor/bodyOpacity remain)',
  viewSrc.includes('<FaithfulBody') &&
    /export function FaithfulBody\(\{[^}]*\}/s.test(viewSrc) &&
    !/export function FaithfulBody\(\{[^}]*bodyColor/s.test(viewSrc));

// ---------------------------------------------------------------------------
// §3 (E7) the fallback is honest — a declared/flat lift still adapts
// ---------------------------------------------------------------------------
console.log('\n----- §3 (E7) the declared degenerates route through the crafted stack — GUARDED (Phase B) -----');
const flatModel = { ...faithful, lift: { kind: 'flat', apexHeight: 0, baseRadius: 1 }, apex: { ...faithful.apex, position: [0, 0, 0] } };
const flatInked = buildFaithfulInkedModel(flatModel);
// PHASE B (SEAL_PHASE_B_MANIFOLD — the ADAPTER-HELD flat-body guard): a flat
// subject (apex ON the rim plane) would hand InkedForm a constant-normal
// body whose hull displacement DEGENERATES (no silhouette — the pinch). The
// adapter now lifts the DRAWN apex a shallow depicted step off the rim plane
// (depiction only — the model's numbers untouched; InkedForm byte-untouched).
const flatVerts = flatInked.immersion.shape.vertices;
const flatRing = Object.values(flatVerts).filter((v) => v.id !== 'faithfulink:apex');
const flatApex = flatVerts['faithfulink:apex'];
const ringRadius = Math.max(...flatRing.map((v) => Math.hypot(v.position[0], v.position[1])), 1e-9);
const fanNormalZSigns = flatInked.immersion.shape.faces.map((f) => {
  const [a, b, c] = f.vertexIds.map((id) => flatVerts[id].position);
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  return [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
});
const normalsVary = (() => {
  const norm = (n) => {
    const l = Math.hypot(n[0], n[1], n[2]);
    return l > 1e-12 ? [n[0] / l, n[1] / l, n[2] / l] : null;
  };
  const first = norm(fanNormalZSigns[0]);
  return fanNormalZSigns.some((n) => {
    const u = norm(n);
    return first && u && Math.abs(u[0] * first[0] + u[1] * first[1] + u[2] * first[2]) < 0.9999;
  });
})();
check('§3 (E7→PHASE B) THE FLAT-BODY GUARD: a flat/declared lift (h=0) still adapts through the SAME crafted stack — the RING stays on the rim plane (z≈0) but the DRAWN apex is LIFTED a shallow depicted step (≈6% of the rim radius, off-plane) so the fan normals VARY and the hull can inflate a real silhouette — never a constant-normal pinch, never a wash',
  flatInked.immersion.shape.faces.length > 0 &&
    flatRing.every((v) => near(v.position[2], 0)) &&
    flatApex !== undefined &&
    Math.abs(flatApex.position[2]) > 0.01 * ringRadius &&
    Math.abs(flatApex.position[2]) < 0.2 * ringRadius &&
    normalsVary);
check('§3 (E7→PHASE B) THE GUARD IS A NO-OP ON A REAL CONE: the fold-born faithful model (apex already lifted) adapts with its apex height PRESERVED verbatim — the guard touches only the degenerate',
  (() => {
    if (!inked || !faithful) return false;
    const coneApex = inked.immersion.shape.vertices['faithfulink:apex'];
    return coneApex !== undefined && near(coneApex.position[2], faithful.apex.position[2]);
  })());

// ---------------------------------------------------------------------------
// §4 (E4) zero frozen edit — the hard rail
// ---------------------------------------------------------------------------
console.log('\n----- §4 (E4) the hard rail: the frozen renderer + model bytes untouched -----');
const headEq = (p) => {
  const working = fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r/g, '');
  const head = execFileSync('git', ['show', `HEAD:${p}`], { cwd: repoRoot, encoding: 'utf8' }).replace(/\r/g, '');
  return working === head;
};
check('§4 (E4) ZERO FROZEN EDIT: InkedForm.tsx · inkedFormModel.ts · faithfulBodyModel.ts BYTE-IDENTICAL to HEAD (the adapter READS; the rail holds by construction)',
  ['src/manuscript/InkedForm.tsx', 'src/manuscript/inkedFormModel.ts', 'src/manuscript/faithfulBodyModel.ts'].every(headEq));
const manifest = fs.readFileSync(path.join(repoRoot, 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'), 'utf8');
check('§4 (E4) THE COMPLETENESS ROW: faithfulInkedModel.ts carries its NOT_FROZEN row (the closure witness fails any unlisted src/** file) — a cures-at-HEAD manifest compare pre-commit, green at the sim tip',
  manifest.includes('NOT_FROZEN src/manuscript/faithfulInkedModel.ts'));

// ═══════════════════════════════════════════════════════════════════════════
// §5 THE (b) PARITY WIRE (SEAL_D2_GROUND_HATCH_PARITY — the mothership's hard
// bar: it must EXECUTE). InkedPlainForm carries a private copy of InkedForm's
// hatch (the union that would share one source is ruled OUT); this clause
// READS InkedForm's ACTUAL COMMITTED bytes (git show HEAD:…), extracts the
// hatch block (HATCH_VERTEX + HATCH_FRAGMENT + useHatchMaterial — the GLSL
// AND the full uniform/param set), and demands BYTE-IDENTITY with the copy.
// The plants prove it can fail — BOTH directions. Never a copied literal.
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n----- §5 (D2-GROUND) ★★ the hatch parity — the plain copy === InkedForm\'s COMMITTED bytes -----');
const extractHatchBlock = (source) => {
  const start = source.indexOf('const HATCH_VERTEX');
  if (start < 0) return null;
  const endMarker = 'return material;';
  const endAt = source.indexOf(endMarker, start);
  if (endAt < 0) return null;
  const close = source.indexOf('}', endAt); // useHatchMaterial's closing brace
  if (close < 0) return null;
  return source.slice(start, close + 1).replace(/\r/g, '');
};
// the ONE committed-blob read of this witness — spelled scanner-visibly (the
// engine-freeze HEAD-read inventory names it; an argv spelling would be the
// exact hole its Clause 2(b) exhibits)
const { execSync } = require('node:child_process');
const committedInkedForm = execSync('git show HEAD:src/manuscript/InkedForm.tsx', {
  cwd: repoRoot,
  encoding: 'utf8',
  maxBuffer: 1e8,
});
const workingPlain = fs.readFileSync(path.join(repoRoot, 'src/manuscript/InkedPlainForm.tsx'), 'utf8');
const headHatch = extractHatchBlock(committedInkedForm);
const plainHatch = extractHatchBlock(workingPlain);
const hatchParity = (a, b) => a !== null && b !== null && a === b;
note(`extracted: head ${headHatch ? headHatch.length : 'MISS'} bytes · plain ${plainHatch ? plainHatch.length : 'MISS'} bytes`);
check('§5 (E-PARITY) ★★ THE WIRE READS THE FROZEN BYTES AND HOLDS: InkedPlainForm\'s hatch block is BYTE-IDENTICAL to InkedForm\'s COMMITTED blob (read from the repository at run time, never a copied literal — a re-seal of InkedForm\'s hatch trips this clause; a drifted copy trips it too)',
  hatchParity(headHatch, plainHatch));
// ★ the plants — a parity that can't fail witnesses nothing
const plantPlain = plainHatch === null ? null : plainHatch.replace('opacityCap', 'opacityCaq');
const plantInked = headHatch === null ? null : headHatch.replace('spacingPx', 'spacingPy');
check('§5 (E-PARITY-EXECUTES) ★★ THE PLANT BITES BOTH DIRECTIONS: one byte flipped in the PLAIN copy → RED; one byte flipped on the InkedForm side of the SAME comparator → RED; the real pair → GREEN — the wire executes, it does not decorate',
  hatchParity(headHatch, plantPlain) === false &&
    hatchParity(plantInked, plainHatch) === false &&
    hatchParity(headHatch, plainHatch) === true);
check('§5 (D2-GROUND) THE ONE HATCH PASS IS MOUNTED: exactly one hatch mesh at renderOrder 0.5 in InkedPlainForm (InkedForm\'s own mount, mirrored), gated on the craft\'s hatchOpacity',
  (workingPlain.match(/material=\{hatchMaterial\} renderOrder=\{0\.5\}/g) ?? []).length === 1 &&
    workingPlain.includes('craft.hatchOpacity > 0 ?'));
// S4 — THE SURFACE LOCK (SEAL_S3_BLACK_TRIANGLE_S4_SURFACE_LOCK): the hatch
// rides the SURFACE (object-space), never the screen. Reads the COMMITTED
// block — pre-sim-commit this is RED by the HEAD-read ordering (expected).
check('§5 (E-S4-SURFACE-LOCK) ★ THE HATCH IS SKIN, NOT WALLPAPER: the COMMITTED hatch block contains NO gl_FragCoord (gone, not made conditional — no per-body toggle); HATCH_VERTEX declares + writes the object-position varying; HATCH_FRAGMENT reads it in BOTH hatch dots (the surfaceCoord frame)',
  headHatch !== null &&
    !headHatch.includes('gl_FragCoord') &&
    headHatch.includes('varying vec3 vObjectPosition') &&
    headHatch.includes('vObjectPosition = position') &&
    (headHatch.match(/dot\(surfaceCoord, d[12]\)/g) ?? []).length === 2);
check('§5 (E-S3-HULL-GUARD) THE FLAT BODY KEEPS ITS RIM SILHOUETTE: the hull-on-flat guard stands in InkedPlainForm — a constant-normal body skips the face-hull (its zero-volume shell\'s back-face washed the interior black); the rim edges carry a flat silhouette',
  workingPlain.includes('THE HULL-ON-FLAT GUARD') && workingPlain.includes('if (flat) return null;'));

console.log(
  `\n--- THE FAITHFUL BODY UNIFICATION — the cone becomes an inked drawing (the one renderer, the adapter thin, the wash gone, the apex-lift riding, the instrument + contradiction standing) + THE D2-GROUND HATCH PARITY (the wire executes): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
