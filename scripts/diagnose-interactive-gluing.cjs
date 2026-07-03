#!/usr/bin/env node

// DIAGNOSTIC — C5 + C4: interactive gluing (face-select + the pairing/identification picker).
//
// UI-only pass over the PROVEN engine — this asserts the CHOICE layer:
//   §1  C5 store-level face selection (set / clear / gate; the raycast is visual).
//   §2  pairing → surface class, NON-CIRCULAR: for one square face, each chosen
//       pairing runs through the REAL store action (`applyCustomGlueToSelection`
//       → committed op → committed G5.0 materializer) and the born form's
//       INDEPENDENT invariants (V−E+F over the replay-recovered complex;
//       committed `globalW1Class`) match the committed trace AND the known
//       class — torus / Klein / RP² / cylinder / Möbius; free edges → open;
//       a NON-OPPOSITE pairing materializes faithfully and falls back to the
//       patch render (unclassified — no lie, no throw). Different pairings on
//       the SAME face → different born forms (distinct ids).
//   §3  degenerate/invalid pairings are GATED (reason strings, throw-free at the
//       pure layer; the store throws LOUDLY if forced); the dry-run preview's
//       χ/w₁ are the committed trace's own.
//   §4  the assemble picker: edge choice {0,0,parallel} IS the canonical
//       identification; a custom choice births through the committed `assemble`
//       (unique id, carried union lineage, multi-parent DAG); reversed flips the
//       endpoint identification; invalid choices are gated.
//
// THE GUARD (asserted by the suite, not here): materializeOperation, the
// committed ops, and bornFormRouting are BYTE-UNCHANGED this pass — customGluing
// only exposes the choice.
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
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const {
  describeFaceEdges,
  validateCustomPairings,
  previewCustomGlue,
  edgeAssembleIdentification,
  validateAssembleEdges,
} = req('src/playground/customGluing.ts');
const { canonicalAssembleIdentification } = req('src/playground/playgroundOperations.ts');
const { routeBornForm, recoverBornSurface } = req('src/playground/bornFormRouting.ts');
const { globalW1Class } = req('src/lib/globalW1.ts');
const { assemble } = req('src/lib/multiform.ts');
const { primalMultiset, primalMultisetKey } = req('src/lib/lineage.ts');
const { buildGenealogyDag, ancestorsOf } = req('src/lib/genealogyDag.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const P = (edgeA, edgeB, mode) => ({ edgeA, edgeB, mode });

console.log('C5+C4 interactive gluing: face selection + arbitrary pairings through the committed pipeline\n');

// ===== [1] C5 — face selection at the store (the raycast is the visual half) =====
console.log('----- [1] C5 FACE SELECTION (store-level) -----');
usePlaygroundStore.getState().resetPlayground();
const A = usePlaygroundStore.getState().invokeForm(nGon(4), 'ua');
usePlaygroundStore.getState().selectForm(A.id);
const faceId = A.faces[0].id;
usePlaygroundStore.getState().selectFace(faceId);
check('§1 a face click sets selectedFaceId (the op target)', usePlaygroundStore.getState().selectedFaceId === faceId);
usePlaygroundStore.getState().selectFace('face:not-a-real-face');
check('§1 a face NOT on the current form does not select (gated null)', usePlaygroundStore.getState().selectedFaceId === null);
usePlaygroundStore.getState().selectFace(faceId);
usePlaygroundStore.getState().selectFace(null);
check('§1 empty-space click deselects (selectFace(null))', usePlaygroundStore.getState().selectedFaceId === null);
check('§1 the edge vocabulary reads off the face in slot order', eq(describeFaceEdges(A.faces[0]).map((e) => `${e.index}:${e.from}>${e.to}`), ['0:ua:v0>ua:v1', '1:ua:v1>ua:v2', '2:ua:v2>ua:v3', '3:ua:v3>ua:v0']));

// ===== [2] C4 — pairing → surface class (the same face, six different pairings) =====
console.log('\n----- [2] PAIRING → CLASS (one square face; committed pipeline end-to-end) -----');
usePlaygroundStore.getState().selectFace(faceId);
const CASES = [
  { name: 'both-opposite preserving', pairings: [P(0, 2, 'preserving'), P(1, 3, 'preserving')], surface: 'torus', chi: 0, w1: 0 },
  { name: 'one pair reversed', pairings: [P(0, 2, 'preserving'), P(1, 3, 'reversing')], surface: 'klein', chi: 0, w1: 1 },
  { name: 'both reversed', pairings: [P(0, 2, 'reversing'), P(1, 3, 'reversing')], surface: 'rp2', chi: 1, w1: 1 },
  { name: 'single pair preserving (open)', pairings: [P(0, 2, 'preserving')], surface: 'cylinder', chi: 0, w1: 0, free: 2 },
  { name: 'single pair reversing (open)', pairings: [P(0, 2, 'reversing')], surface: 'mobius', chi: 0, w1: 1, free: 2 },
];
const bornIds = [];
for (const c of CASES) {
  const preview = previewCustomGlue(A, A.faces[0], c.pairings);
  check(`${c.name}: the dry-run preview accepts and reads χ=${c.chi} w₁=${c.w1} → ${c.surface}`, preview.ok && preview.preview.chi === c.chi && preview.preview.w1 === c.w1 && preview.preview.surface === c.surface && (c.free === undefined || preview.preview.freeEdges === c.free));
  const born = usePlaygroundStore.getState().applyCustomGlueToSelection(c.pairings);
  bornIds.push(born.id);
  const stored = usePlaygroundStore.getState().forms[born.id];
  check(`${c.name}: provenance {origin:'operated', source:'glue-custom'}`, stored.provenance.origin === 'operated' && stored.provenance.source === 'glue-custom');
  const route = routeBornForm(born, A);
  check(`${c.name}: routed to the ${c.surface} immersion`, route.kind === 'immersion' && route.surface === c.surface);
  if (route.kind !== 'immersion') continue;
  const { trace, materialized } = route.recovery;
  const chiComplex = materialized.complex.vertices.length - materialized.complex.edges.length + materialized.complex.faces.length;
  const w1Indep = globalW1Class(materialized.complex).nonOrientable ? 1 : 0;
  check(`${c.name}: independent χ === trace.chi === ${c.chi}; independent w₁ === trace.w1 === ${c.w1}`, chiComplex === trace.chi && chiComplex === c.chi && w1Indep === trace.w1 && w1Indep === c.w1);
  note(`${c.name}: born ${born.id.slice(born.id.lastIndexOf(':', born.id.length - 8))}`);
}
// a NON-OPPOSITE pairing: materializes faithfully, falls back to the patch render.
const weird = [P(0, 1, 'reversing'), P(2, 3, 'reversing')];
const weirdPreview = previewCustomGlue(A, A.faces[0], weird);
check('non-opposite pairing: preview accepts (χ/w₁ from the committed trace) and classifies NULL (patch render)', weirdPreview.ok && weirdPreview.preview.surface === null);
const weirdBorn = usePlaygroundStore.getState().applyCustomGlueToSelection(weird);
bornIds.push(weirdBorn.id);
const weirdRoute = routeBornForm(weirdBorn, A);
const weirdRecovery = recoverBornSurface(weirdBorn, A);
check("non-opposite pairing: routes to the honest 'patch' fallback (no lie, no throw)", weirdRoute.kind === 'patch');
check('non-opposite pairing: the born form still REPLAY-VERIFIES and its independent χ/w₁ === the trace', Boolean(weirdRecovery) && (() => {
  const chi = weirdRecovery.materialized.complex.vertices.length - weirdRecovery.materialized.complex.edges.length + weirdRecovery.materialized.complex.faces.length;
  return chi === weirdRecovery.trace.chi && (globalW1Class(weirdRecovery.materialized.complex).nonOrientable ? 1 : 0) === weirdRecovery.trace.w1;
})());
if (weirdRecovery) note(`non-opposite: measured χ=${weirdRecovery.trace.chi} w₁=${weirdRecovery.trace.w1} (unclassified — rendered as the pre-quotient patch)`);
check('§2 SIX different pairings on the SAME face → six DISTINCT born forms', new Set(bornIds).size === 6 && bornIds.every((id) => Boolean(usePlaygroundStore.getState().forms[id])));

// ===== [3] gating (reasons, throw-free at the pure layer; the store throws loudly) =====
console.log('\n----- [3] GATING (degenerate/invalid pairings) -----');
check('§3 self-pair gated', String(validateCustomPairings(A.faces[0], [P(0, 0, 'preserving')])).includes('cannot pair with itself'));
check('§3 edge reuse gated', String(validateCustomPairings(A.faces[0], [P(0, 2, 'preserving'), P(2, 3, 'preserving')])).includes('at most ONE pair'));
check('§3 out-of-range gated', String(validateCustomPairings(A.faces[0], [P(0, 9, 'preserving')])).includes('integers in [0, 3]'));
check('§3 empty pairing gated', String(validateCustomPairings(A.faces[0], [])).includes('at least one'));
const torusBorn = usePlaygroundStore.getState().forms[bornIds[0]].shape;
check('§3 a QUOTIENT face (repeated corners) is gated — the standing freeze', String(validateCustomPairings(torusBorn.faces[0], [P(0, 2, 'preserving')])).includes('not yet ruled'));
const big = usePlaygroundStore.getState().invokeForm(nGon(10), 'ubig');
check('§3 n > 8 gated (the committed reconstruction guard, surfaced as a reason)', String(validateCustomPairings(big.faces[0], [P(0, 5, 'preserving')])).includes('guarded to 8'));
let storeThrew = false;
try {
  usePlaygroundStore.getState().selectForm(A.id);
  usePlaygroundStore.getState().selectFace(faceId);
  usePlaygroundStore.getState().applyCustomGlueToSelection([P(0, 0, 'preserving')]);
} catch (error) {
  storeThrew = String(error.message).includes('not applicable');
}
check('§3 the store refuses an invalid pairing LOUDLY', storeThrew);

// ===== [4] C4 — the assemble picker (WHICH edges merge) =====
console.log('\n----- [4] ASSEMBLE PICKER (edge choice; canonical stays) -----');
const B = usePlaygroundStore.getState().invokeForm(nGon(4), 'ub');
check('§4 edge choice {A:e0, B:e0, parallel} IS the canonical identification (byte-equal)', eq(edgeAssembleIdentification(A, B, { edgeA: 0, edgeB: 0, reversed: false }), canonicalAssembleIdentification(A, B)));

usePlaygroundStore.getState().selectForm(A.id);
const custom = usePlaygroundStore.getState().applyAssembleToSelection(B.id, { edgeA: 1, edgeB: 2, reversed: false });
const direct = assemble([A, B], edgeAssembleIdentification(A, B, { edgeA: 1, edgeB: 2, reversed: false })).shape;
check('§4 the custom merge births BYTE-IDENTICAL to the direct committed assemble', JSON.stringify(custom) === JSON.stringify(direct));
check("§4 provenance {origin:'born', source:'assemble'}", usePlaygroundStore.getState().forms[custom.id].provenance.origin === 'born');
check('§4 the chosen merge carries the UNION lineage (ua:v1×1|ub:v2×1 — carried, not minted)', primalMultisetKey(primalMultiset('asm:ua:v1+ub:v2', custom, new Map())) === 'ua:v1×1|ub:v2×1' && primalMultisetKey(primalMultiset('asm:ua:v2+ub:v3', custom, new Map())) === 'ua:v2×1|ub:v3×1');

usePlaygroundStore.getState().selectForm(A.id);
const canonical = usePlaygroundStore.getState().applyAssembleToSelection(B.id);
check('§4 the canonical default STILL births (no options — the pre-C4 path)', Boolean(canonical) && canonical.id !== custom.id);

usePlaygroundStore.getState().selectForm(A.id);
const reversed = usePlaygroundStore.getState().applyAssembleToSelection(B.id, { edgeA: 1, edgeB: 2, reversed: true });
check('§4 REVERSED flips the endpoint identification (a0↔b1: asm:ua:v1+ub:v3 minted)', Boolean(reversed.vertices['asm:ua:v1+ub:v3']) && Boolean(reversed.vertices['asm:ua:v2+ub:v2']) && reversed.id !== custom.id);
check('§4 three assemblies of the SAME pair under THREE identifications coexist (D1 at work)', new Set([custom.id, canonical.id, reversed.id]).size === 3);

const st = usePlaygroundStore.getState();
const dag = buildGenealogyDag(st.formOrder.map((id) => st.forms[id].shape));
check('§4 the DAG accepts all three and each pulls back to {A, B}', dag.integrity.accepted === true && eq(ancestorsOf(dag, custom.id), [A.id, B.id].sort()) && eq(ancestorsOf(dag, reversed.id), [A.id, B.id].sort()));
check('§4 an invalid edge choice is gated with a reason (out of range)', String(validateAssembleEdges(A, B, { edgeA: 1, edgeB: 7, reversed: false })).includes("Form B's edge index"));
let assembleThrew = false;
try {
  usePlaygroundStore.getState().selectForm(A.id);
  usePlaygroundStore.getState().applyAssembleToSelection(B.id, { edgeA: 0, edgeB: 99, reversed: false });
} catch (error) {
  assembleThrew = String(error.message).includes('not applicable');
}
check('§4 the store refuses an invalid edge choice LOUDLY', assembleThrew);

console.log(
  `\n--- C5+C4 interactive gluing (face selection; pairing→class through the committed pipeline; gating; assemble picker): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
