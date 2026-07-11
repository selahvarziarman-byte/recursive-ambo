#!/usr/bin/env node

// DIAGNOSTIC — the word-op SINGLE-FACE gate (engineer-chartered, 2026-07-11):
// every op that routes through `materializeSurfaceResult` (glue-* / flip-glue-*
// / collapse — the fundamental-polygon ops: `identifyByPairs` is slot-indexed
// with cellCounts f=1 hardcoded; the materializer emits ONE face) now REFUSES
// multi-face forms out loud instead of silently discarding every face but the
// selected one.
//
//   §a THE LIE IS DEAD — a multi-face ASSEMBLE child (the manuscript combine
//      gate's own birth, reachable today) and the 30-face connectedSum
//      genus-2: every word op reports canApply === false with the honest
//      reason naming the face count; forcing execute throws loudly; the
//      CUSTOM-GLUE seam (validate / preview / execute — the same
//      materializer) refuses with the identical family reason.
//   §b WHAT IS NOT GATED — `cut` still applies to multi-face forms (it
//      carries the whole complex through `materializeCutResult` — asserted by
//      executing it: 30 faces → 29); `assemble` still pairs multi-face forms.
//   §c THE ZOO DOES NOT MOVE — a battery of SINGLE-face forms (invoked
//      square/hexagon; the five worded births; the Q-M2 chained quotient; the
//      degenerate minimal torus) reads byte-identically: eligible ops stay
//      canApply true / reason null; every committed refusal string is
//      unchanged (the gate is inert on faces.length === 1).
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

const {
  PLAYGROUND_OPERATIONS,
  getPlaygroundOperation,
  executeAssemblePair,
  canAssemblePair,
  degenerateBoundaryReason,
  singleFaceGateReason,
} = req('src/playground/playgroundOperations.ts');
const { executeCustomGlue, previewCustomGlue, validateCustomPairings } = req('src/playground/customGluing.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { connectedSum } = req('src/lib/connectedSum.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const P = (a, b, m) => ({ edgeA: a, edgeB: b, mode: m });
const ctxOf = (form, parentShape = null, face = form.faces[0] ?? null) => ({
  form,
  selectedFaceId: face ? face.id : null,
  selectedFace: face,
  parentShape,
});
const torusRep = (prefix) =>
  deserializeSnapshot(serializeSnapshot(immerseSurface({ surface: 'torus', resolution: 4 }).shape, prefix)).shape;

// the gated family — everything that routes through materializeSurfaceResult
const WORD_OPS = ['glue-torus', 'glue-cylinder', 'flip-glue-klein', 'flip-glue', 'flip-glue-mobius', 'collapse-sphere'];

console.log('word-op single-face gate: the fundamental-polygon ops refuse a complex, out loud\n');

// ===== [a] the lie is dead ======================================================
console.log('----- [a] multi-face forms: every word op refuses with the honest reason -----');
const assembleChild = executeAssemblePair(loadForm(nGon(4), 'gA'), loadForm(nGon(4), 'gB'));
check('fixture: the manuscript combine gate births a MULTI-face assemble child (the live reachability)',
  assembleChild.faces.length === 2);
const childCtx = ctxOf(assembleChild);
check('fixture: its selected face has distinct corners — the chain path alone would have ALLOWED it (the old lie)',
  new Set(assembleChild.faces[0].vertexIds).size === assembleChild.faces[0].vertexIds.length);
check('every word op refuses the assemble child: canApply === false, all six',
  WORD_OPS.every((id) => getPlaygroundOperation(id).canApply(childCtx) === false));
const childReason = getPlaygroundOperation('glue-torus').getDisabledReason(childCtx);
check('the reason is honest and specific: names the count (2 faces), the fundamental-polygon bound, and the complex route',
  typeof childReason === 'string' &&
  childReason.includes('fundamental-polygon operation') &&
  childReason.includes('the form has 2 faces') &&
  childReason.includes('not yet ruled') &&
  childReason.includes('cut / combine'));
check('all six word ops speak the SAME family reason on the child',
  WORD_OPS.every((id) => getPlaygroundOperation(id).getDisabledReason(childCtx) === childReason));
note(`refusal: "${String(childReason).slice(0, 120)}…"`);
const genus2 = connectedSum(torusRep('sfA'), torusRep('sfB')).shape;
const g2Ctx = ctxOf(genus2);
check('the 30-face connectedSum genus-2 refuses too — the reason names 30',
  genus2.faces.length === 30 &&
  WORD_OPS.every((id) => getPlaygroundOperation(id).canApply(g2Ctx) === false) &&
  String(getPlaygroundOperation('glue-cylinder').getDisabledReason(g2Ctx)).includes('the form has 30 faces'));
let forcedThrew = false;
try {
  getPlaygroundOperation('glue-torus').execute(g2Ctx);
} catch (error) {
  forcedThrew = /ineligible/.test(String(error.message));
}
check('forcing execute anyway throws LOUDLY (the guard re-checks; no face-discarding child can be born)', forcedThrew);
// the custom-glue seam — the same materializer, the same gate
const customReason = validateCustomPairings(genus2.faces[0], [P(0, 2, 'preserving')], genus2);
check('the CUSTOM-glue seam refuses the same way: validateCustomPairings returns the identical family reason',
  customReason === singleFaceGateReason(genus2) && String(customReason).includes('the form has 30 faces'));
const preview = previewCustomGlue(genus2, genus2.faces[0], [P(0, 2, 'preserving')]);
check('previewCustomGlue: not ok, same reason (the Apply button is exactly honest)',
  preview.ok === false && preview.reason === customReason);
let customThrew = false;
try {
  executeCustomGlue(genus2, genus2.faces[0], [P(0, 2, 'preserving')]);
} catch (error) {
  customThrew = /fundamental-polygon operation/.test(String(error.message));
}
check('executeCustomGlue throws the gate reason — no custom-word path around the guard', customThrew);

// ===== [b] what is NOT gated =====================================================
console.log('\n----- [b] cut / assemble still operate on complexes (they generalize) -----');
const cutOp = getPlaygroundOperation('cut');
check('cut applies to the multi-face genus-2 (whole-complex op — never the problem)',
  cutOp.canApply(g2Ctx) === true && cutOp.getDisabledReason(g2Ctx) === null);
const cutChild = cutOp.execute(g2Ctx);
check('…and executes carrying the WHOLE complex: 30 faces → 29 (the logged loss, nothing discarded silently)',
  cutChild.faces.length === 29);
check('assemble still pairs multi-face forms (vertex-id-keyed, enacts the whole complex)',
  canAssemblePair(assembleChild, torusRep('sfC')) === true);

// ===== [c] the zoo does not move =================================================
console.log('\n----- [c] single-face battery: byte-identical behavior (the gate is inert) -----');
const square = loadForm(nGon(4), 'zsq');
const squareCtx = ctxOf(square);
check('invoked square: every word op canApply true, reason null (unchanged)',
  WORD_OPS.every((id) => getPlaygroundOperation(id).canApply(squareCtx) === true &&
    getPlaygroundOperation(id).getDisabledReason(squareCtx) === null));
const hexagon = loadForm(nGon(6), 'zhx');
const hexCtx = ctxOf(hexagon);
check('invoked hexagon: single-pair words + antipodal + collapse eligible; double-pair words refuse with the committed "exactly 4" (unchanged)',
  getPlaygroundOperation('glue-cylinder').canApply(hexCtx) === true &&
  getPlaygroundOperation('flip-glue-mobius').canApply(hexCtx) === true &&
  getPlaygroundOperation('flip-glue').canApply(hexCtx) === true &&
  getPlaygroundOperation('collapse-sphere').canApply(hexCtx) === true &&
  getPlaygroundOperation('glue-torus').canApply(hexCtx) === false &&
  String(getPlaygroundOperation('glue-torus').getDisabledReason(hexCtx)).includes('exactly 4') &&
  String(getPlaygroundOperation('flip-glue-klein').getDisabledReason(hexCtx)).includes('exactly 4'));
// the five worded births execute unchanged (single-face quotients)
const bornOf = (opId, srcName) => {
  const src = loadForm(nGon(4), srcName);
  return { born: getPlaygroundOperation(opId).execute(ctxOf(src)), src };
};
const births = ['glue-torus', 'glue-cylinder', 'flip-glue-klein', 'flip-glue', 'flip-glue-mobius'].map((id, k) => {
  const { born, src } = bornOf(id, `zb${k}`);
  return { id, born, src, singleFace: born.faces.length === 1 };
});
check('the five worded births still execute on squares and stay SINGLE-face quotients',
  births.every((b) => b.singleFace));
// the Q-M2 chain still operates (the chained torus of the p-immerse §h path)
const cylBorn = births.find((b) => b.id === 'glue-cylinder');
check('the Q-M2 chain is untouched: glue-torus on the cylinder-born quotient face still canApply TRUE (single-face, generic path)',
  getPlaygroundOperation('glue-torus').canApply(ctxOf(cylBorn.born, cylBorn.src)) === true);
// the degenerate refusal is byte-identical (the chaining §c pin's twin)
const torusBornPair = births.find((b) => b.id === 'glue-torus');
check('the degenerate minimal torus still refuses with the COMMITTED degenerate reason, verbatim (word op and collapse alike)',
  getPlaygroundOperation('glue-cylinder').getDisabledReason(ctxOf(torusBornPair.born, torusBornPair.src)) ===
    degenerateBoundaryReason(torusBornPair.born.faces[0]) &&
  getPlaygroundOperation('collapse-sphere').getDisabledReason(ctxOf(torusBornPair.born, torusBornPair.src)) ===
    degenerateBoundaryReason(torusBornPair.born.faces[0]));
check('singleFaceGateReason is null on every single-face form above (the gate is structurally inert there)',
  [square, hexagon, ...births.map((b) => b.born)].every((f) => singleFaceGateReason(f) === null));
check('the un-gated ops are exactly cut + dual (the registry carries 8 ops; 6 are gated word ops)',
  PLAYGROUND_OPERATIONS.length === 8 &&
  PLAYGROUND_OPERATIONS.filter((op) => !WORD_OPS.includes(op.id)).map((op) => op.id).sort().join(',') === 'cut,dual');

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
