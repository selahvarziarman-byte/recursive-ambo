#!/usr/bin/env node

// DIAGNOSTIC — G5.1: the playground op registry + apply-to-selection.
//
// End-to-end through the REAL modules: invoke a 4-gon form in the REAL store,
// select its face, applyOperationToSelection('flip-glue') → a BORN form joins
// the store; the born form is BYTE-IDENTICAL to the independent committed path
// (flipGlueFace + G5.0 materializeSurfaceResult, canonical pairing); its
// independent invariants (committed globalW1Class / explicit cell counts) match
// the committed trace's certificate; genealogy single-parent; the committed
// buildGenealogyDag over the store's forms ACCEPTS and records the birth.
// Registry: data-driven canApply gating (ineligible faces disable, never throw).
// Derive-only: the parent form is byte-unchanged.
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

const { usePlaygroundStore } = req('src/store/playgroundStore.ts');
const { PLAYGROUND_OPERATIONS, flipGlueOperation, canonicalFlipGluePairing, getPlaygroundOperation } = req('src/playground/playgroundOperations.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { flipGlueFace } = req('src/lib/surfaceOperations.ts');
const { materializeSurfaceResult } = req('src/lib/materializeOperation.ts');
const { globalW1Class } = req('src/lib/globalW1.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log('G5.1 op registry: apply-to-selection -> a born form, live in the store\n');

// ===== [1] the pipeline end-to-end through the REAL store =====
console.log('----- [1] THE PIPELINE (invoke -> select face -> apply -> born form) -----');
usePlaygroundStore.getState().resetPlayground();
const parent = usePlaygroundStore.getState().invokeForm(nGon(4), 'op-demo');
const parentSnapshot = JSON.stringify(parent);
usePlaygroundStore.getState().selectForm(parent.id);
const face = parent.faces[0];
usePlaygroundStore.getState().selectFace(face.id);
check('§2.1 face selected on the current form', usePlaygroundStore.getState().selectedFaceId === face.id);

const born = usePlaygroundStore.getState().applyOperationToSelection('flip-glue');
const stored = usePlaygroundStore.getState().forms[born.id];
check('§2.1 the born form JOINED the store', Boolean(stored) && usePlaygroundStore.getState().formOrder.includes(born.id));
check("§2.1 provenance = {origin:'operated', source:'flip-glue'}", stored.provenance.origin === 'operated' && stored.provenance.source === 'flip-glue');

// the independent committed path (same face, the canonical pairing) — byte-compare.
const independentTrace = flipGlueFace(parent, face, canonicalFlipGluePairing(face));
const independent = materializeSurfaceResult(parent, face, independentTrace);
check('§2.1 the born form is BYTE-IDENTICAL to the independent committed path (flipGlueFace + G5.0)', JSON.stringify(born) === JSON.stringify(independent.shape));

// independent invariants === the committed trace's certificate (4-gon antipodal = RP²-class).
const V = Object.keys(born.vertices).length;
const E = born.edges.length;
const F = born.faces.length;
const cert = globalW1Class(independent.complex);
check(`§2.1 independent χ (V−E+F = ${V}−${E}+${F}) === trace.chi === ${independentTrace.chi}`, V - E + F === independentTrace.chi);
check(`§2.1 independent w₁ (committed globalW1Class) === trace.w1 === ${independentTrace.w1}`, (cert.nonOrientable ? 1 : 0) === independentTrace.w1);
check('§2.1 every vertex link interior (the materializer certifies the closed surface)', independent.links.every((l) => l.valence === 'interior'));
note(`born: ${born.id}`);
note(`χ=${V - E + F} w₁=${independentTrace.w1} b₁=${cert.b1} w1Class=${JSON.stringify(cert.w1Class)} pairing=${JSON.stringify(canonicalFlipGluePairing(face))}`);

// genealogy: single-parent birth, registered in the committed DAG over the store's forms.
check('§2.1 born genealogy: parentShapeId = the source form, operation flip-glue, depth+1', born.genealogy.parentShapeId === parent.id && born.genealogy.operation === 'flip-glue' && born.genealogy.generationDepth === parent.genealogy.generationDepth + 1);
const storeShapes = usePlaygroundStore.getState().formOrder.map((id) => usePlaygroundStore.getState().forms[id].shape);
const dag = buildGenealogyDag(storeShapes);
const bornNode = dag.nodes.find((n) => n.id === born.id);
const birthEdge = dag.edges.find((e) => e.parent === parent.id && e.child === born.id);
check('§2.1 buildGenealogyDag over the store ACCEPTS (acyclic; lineage ⊆ parents)', dag.integrity.accepted === true);
check("§2.1 the DAG records the birth: parent→child edge, operation 'flip-glue' (a merge-birth)", eq(bornNode.parents, [parent.id]) && Boolean(birthEdge) && birthEdge.operation === 'flip-glue' && birthEdge.consuming === true);
note(`DAG: nodes=${dag.nodes.length} born.parents=${JSON.stringify(bornNode.parents)} edge.op=${birthEdge.operation} (flip-glue consumes: consuming=${birthEdge.consuming})`);

// ===== [2] the registry is data-driven =====
console.log('\n----- [2] REGISTRY (canApply gates; ineligible disables, never throws) -----');
check('§2.2 the registry is data-driven (flip-glue registered)', PLAYGROUND_OPERATIONS.length >= 1 && getPlaygroundOperation('flip-glue') === flipGlueOperation);
const triangle = usePlaygroundStore.getState().invokeForm(nGon(3), 'op-demo-tri');
const triContext = { form: triangle, selectedFaceId: triangle.faces[0].id, selectedFace: triangle.faces[0] };
check('§2.2 a 3-gon face is INELIGIBLE (odd) — canApply false, reason given, no throw', flipGlueOperation.canApply(triContext) === false && typeof flipGlueOperation.getDisabledReason(triContext) === 'string');
const noFaceContext = { form: triangle, selectedFaceId: null, selectedFace: null };
check('§2.2 no selected face — canApply false, reason given', flipGlueOperation.canApply(noFaceContext) === false && flipGlueOperation.getDisabledReason(noFaceContext) === 'Select a face to operate on.');
// the born form's own carried face is a REPEATED-VERTEX quotient cycle —
// Q-M2 (ruled): chaining COMPOSES the birth word with the new one, which needs
// the parent for the replay-verified recovery. WITHOUT it the op refuses
// honestly (a slot-level run would be unfaithful); the with-parent composition
// is ratified in diagnose-chaining-composition.cjs.
const bornFace = born.faces[0];
const bornContext = { form: born, selectedFaceId: bornFace.id, selectedFace: bornFace };
check('§2.2 the born quotient face WITHOUT its parent refuses honestly (Q-M2: the composition needs the replay-verified birth word)', flipGlueOperation.canApply(bornContext) === false && String(flipGlueOperation.getDisabledReason(bornContext)).includes('not replay-recoverable'));
let storeThrew = false;
try {
  usePlaygroundStore.getState().selectForm(triangle.id);
  usePlaygroundStore.getState().selectFace(triangle.faces[0].id);
  usePlaygroundStore.getState().applyOperationToSelection('flip-glue');
} catch (error) {
  storeThrew = String(error.message).includes('not applicable');
}
check('§2.2 the store refuses an ineligible apply LOUDLY (the UI gates via canApply; misuse throws)', storeThrew);

// ===== [3] derive-only =====
console.log('\n----- [3] DERIVE-ONLY -----');
check('§2.3 the parent form is byte-identical after the op (the child is new; no mutation)', JSON.stringify(usePlaygroundStore.getState().forms[parent.id].shape) === parentSnapshot);

console.log(
  `\n--- G5.1 op registry (pipeline end-to-end, DAG birth, data-driven gating, derive-only): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
