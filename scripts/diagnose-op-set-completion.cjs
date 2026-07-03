#!/usr/bin/env node

// DIAGNOSTIC — C1 + C2: the form-producing op-set, COMPLETE, per-op end-to-end.
//
// Through the REAL registry + store + committed modules: for each op in the
// completed registry (glue→torus / glue→cylinder / flip-glue→klein /
// flip-glue→rp2 / flip-glue→möbius / collapse→sphere / cut), applying it on an
// eligible face births a form whose INDEPENDENT invariants (V−E+F over the
// recovered faithful complex; committed `globalW1Class`) equal the committed
// trace's certificate AND the known class values — and `routeBornForm` routes it
// to the correct render (the immersion for the six surfaces — sphere is the
// collapse target; 'direct' for cut). Gating asserted per op (too-few-edge /
// odd / repeated-corner faces disable with reasons, never throw). The single-
// pair words are ALSO run on a 6-gon (the generalized open-surface path).
// Genealogy: every birth is a single-parent DAG edge carrying its op kind.
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
const { PLAYGROUND_OPERATIONS, getPlaygroundOperation } = req('src/playground/playgroundOperations.ts');
const { routeBornForm } = req('src/playground/bornFormRouting.ts');
const { globalW1Class } = req('src/lib/globalW1.ts');
const { cutCell } = req('src/lib/cutOperation.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log('C1+C2 op-set completion: every metabolism op births a properly-routed form\n');

// The completed registry, in panel order.
const REGISTRY_IDS = ['glue-torus', 'glue-cylinder', 'flip-glue-klein', 'flip-glue', 'flip-glue-mobius', 'collapse-sphere', 'cut'];
check('§0 the registry carries the COMPLETE op-set (7 ops, panel order)', eq(PLAYGROUND_OPERATIONS.map((op) => op.id), REGISTRY_IDS));

// ===== [1] per-op end-to-end on the canonical 4-gon (REAL store pipeline) =====
console.log('\n----- [1] PER-OP PIPELINE (4-gon; store -> registry -> G5.0 -> routeBornForm) -----');
usePlaygroundStore.getState().resetPlayground();
const A = usePlaygroundStore.getState().invokeForm(nGon(4), 'u1');
usePlaygroundStore.getState().selectForm(A.id);
usePlaygroundStore.getState().selectFace(A.faces[0].id);

// op id -> the KNOWN class values (surface ops; cut asserted separately).
const SURFACE_CASES = [
  { id: 'glue-torus', surface: 'torus', op: 'glue', chi: 0, w1: 0, b1: 2, w1Class: [0, 0] },
  { id: 'glue-cylinder', surface: 'cylinder', op: 'glue', chi: 0, w1: 0, b1: 1, w1Class: [0] },
  { id: 'flip-glue-klein', surface: 'klein', op: 'flip-glue', chi: 0, w1: 1, b1: 2, w1Class: [0, 1] },
  { id: 'flip-glue', surface: 'rp2', op: 'flip-glue', chi: 1, w1: 1, b1: 1, w1Class: [1] },
  { id: 'flip-glue-mobius', surface: 'mobius', op: 'flip-glue', chi: 0, w1: 1, b1: 1, w1Class: [1] },
  { id: 'collapse-sphere', surface: 'sphere', op: 'collapse', chi: 2, w1: 0, b1: 0, w1Class: [] },
];

const bornIds = [];
for (const c of SURFACE_CASES) {
  const born = usePlaygroundStore.getState().applyOperationToSelection(c.id);
  bornIds.push(born.id);
  const stored = usePlaygroundStore.getState().forms[born.id];
  const route = routeBornForm(born, A);
  const routed = route.kind === 'immersion' ? route.surface : `(${route.kind})`;
  check(`${c.id}: routed to the ${c.surface} immersion`, route.kind === 'immersion' && route.surface === c.surface);
  if (route.kind !== 'immersion') {
    note(`route=${routed}`);
    continue;
  }
  const { trace, materialized } = route.recovery;
  const chiComplex = materialized.complex.vertices.length - materialized.complex.edges.length + materialized.complex.faces.length;
  const cert = globalW1Class(materialized.complex);
  const independentW1 = cert.nonOrientable ? 1 : 0;
  check(`${c.id}: independent χ (V−E+F over the recovered complex) === trace.chi === ${c.chi}`, chiComplex === trace.chi && chiComplex === c.chi);
  check(`${c.id}: independent w₁ (committed globalW1Class) === trace.w1 === ${c.w1}`, independentW1 === trace.w1 && independentW1 === c.w1);
  check(`${c.id}: b₁ === ${c.b1}, w1Class === ${JSON.stringify(c.w1Class)}`, cert.b1 === c.b1 && eq(cert.w1Class, c.w1Class));
  check(`${c.id}: born genealogy — single parent A, operation '${c.op}', depth+1`, born.genealogy.parentShapeId === A.id && born.genealogy.operation === c.op && born.genealogy.generationDepth === A.genealogy.generationDepth + 1);
  check(`${c.id}: provenance {origin:'operated', source:'${c.id}'} (routes through BornFormView)`, stored.provenance.origin === 'operated' && stored.provenance.source === c.id);
  note(`χ=${chiComplex} w₁=${independentW1} b₁=${cert.b1} w1Class=${JSON.stringify(cert.w1Class)} → ${routed}`);
}

// cut — the removal: χ drops by the CutTrace's one logged loss; renders DIRECT.
const cutBorn = usePlaygroundStore.getState().applyOperationToSelection('cut');
bornIds.push(cutBorn.id);
{
  const face = A.faces[0];
  const chiParent = Object.keys(A.vertices).length - A.edges.length + A.faces.length;
  const chiBorn = Object.keys(cutBorn.vertices).length - cutBorn.edges.length + cutBorn.faces.length;
  const trace = cutCell(A, face);
  check('cut: χ shifts by EXACTLY the removed 2-cell (parent 1 → born 0)', chiParent === 1 && chiBorn === 0 && chiBorn === chiParent - 1);
  check('cut: vertices + edges PASS THROUGH verbatim; the face is gone', eq(cutBorn.vertices, A.vertices) && eq(cutBorn.edges, A.edges) && cutBorn.faces.length === A.faces.length - 1);
  check('cut: the committed CutTrace logs the loss (forward[face] = null) and reads FAITHFUL logged / UNFAITHFUL silent', trace.ledger.forward[face.id] === null && trace.faithfulnessLogged.operationStatus === 'FAITHFUL' && trace.faithfulnessSilent.operationStatus === 'UNFAITHFUL');
  const route = routeBornForm(cutBorn, A);
  check("cut: routed 'direct' (real positions — no immersion, replay-verified)", route.kind === 'direct');
  check("cut: born genealogy — single parent A, operation 'cut', depth+1", cutBorn.genealogy.parentShapeId === A.id && cutBorn.genealogy.operation === 'cut' && cutBorn.genealogy.generationDepth === A.genealogy.generationDepth + 1);
  const stored = usePlaygroundStore.getState().forms[cutBorn.id];
  check("cut: provenance {origin:'operated', source:'cut'}", stored.provenance.origin === 'operated' && stored.provenance.source === 'cut');
}
check('§1 all SEVEN births coexist in the store (distinct materialized ids)', new Set(bornIds).size === 7 && bornIds.every((id) => Boolean(usePlaygroundStore.getState().forms[id])));

// ===== [2] the single-pair words GENERALIZE (6-gon: the open surfaces, class-correct) =====
console.log('\n----- [2] SINGLE-PAIR WORDS ON A 6-GON (open surfaces generalize) -----');
const H = usePlaygroundStore.getState().invokeForm(nGon(6), 'u2');
usePlaygroundStore.getState().selectForm(H.id);
usePlaygroundStore.getState().selectFace(H.faces[0].id);
for (const c of [
  { id: 'glue-cylinder', surface: 'cylinder', chi: 0, w1: 0 },
  { id: 'flip-glue-mobius', surface: 'mobius', chi: 0, w1: 1 },
]) {
  const born = usePlaygroundStore.getState().applyOperationToSelection(c.id);
  const route = routeBornForm(born, H);
  const ok = route.kind === 'immersion' && route.surface === c.surface;
  check(`6-gon ${c.id}: routed ${c.surface}`, ok);
  if (ok) {
    const { trace, materialized } = route.recovery;
    const chiComplex = materialized.complex.vertices.length - materialized.complex.edges.length + materialized.complex.faces.length;
    const cert = globalW1Class(materialized.complex);
    check(`6-gon ${c.id}: independent χ === trace.chi === ${c.chi}; independent w₁ === ${c.w1}`, chiComplex === trace.chi && chiComplex === c.chi && (cert.nonOrientable ? 1 : 0) === c.w1);
    note(`6-gon ${c.id}: V=${materialized.complex.vertices.length} E=${materialized.complex.edges.length} F=${materialized.complex.faces.length}`);
  }
}

// ===== [3] gating (disabled with reasons — never a throw) =====
console.log('\n----- [3] GATING (canApply per op; no throws) -----');
const contextFor = (form, face) => ({ form, selectedFaceId: face ? face.id : null, selectedFace: face });
const hexContext = contextFor(H, H.faces[0]);
for (const id of ['glue-torus', 'flip-glue-klein']) {
  const op = getPlaygroundOperation(id);
  check(`6-gon ${id}: disabled (double-pair word needs exactly 4) with reason`, op.canApply(hexContext) === false && String(op.getDisabledReason(hexContext)).includes('exactly 4'));
}
const T = usePlaygroundStore.getState().invokeForm(nGon(3), 'u3');
const triContext = contextFor(T, T.faces[0]);
for (const id of ['glue-torus', 'glue-cylinder', 'flip-glue-klein', 'flip-glue', 'flip-glue-mobius']) {
  const op = getPlaygroundOperation(id);
  check(`triangle ${id}: disabled (word ops need even ≥ 4) with reason`, op.canApply(triContext) === false && op.getDisabledReason(triContext) !== null);
}
for (const id of ['collapse-sphere', 'cut']) {
  const op = getPlaygroundOperation(id);
  check(`triangle ${id}: ELIGIBLE (n-free whole-face op)`, op.canApply(triContext) === true && op.getDisabledReason(triContext) === null);
}
const noFaceContext = contextFor(A, null);
check('no selected face: every op disabled with a reason, none throws', PLAYGROUND_OPERATIONS.every((op) => op.canApply(noFaceContext) === false && typeof op.getDisabledReason(noFaceContext) === 'string'));

// ===== [4] genealogy — every birth a single-parent edge carrying its op kind =====
console.log('\n----- [4] GENEALOGY (the births in ONE accepted DAG) -----');
const st = usePlaygroundStore.getState();
const dag = buildGenealogyDag(st.formOrder.map((id) => st.forms[id].shape));
check('§4 buildGenealogyDag over the whole store ACCEPTS', dag.integrity.accepted === true);
const bornEdges = dag.edges.filter((e) => bornIds.includes(e.child));
check('§4 each of the 7 births is exactly ONE parent edge from A', bornEdges.length === 7 && bornEdges.every((e) => e.parent === A.id));
check(
  '§4 the edges carry the op kinds (glue ×2, flip-glue ×3, collapse, cut)',
  eq(
    bornEdges.map((e) => e.operation).sort(),
    ['collapse', 'cut', 'flip-glue', 'flip-glue', 'flip-glue', 'glue', 'glue'],
  ),
);

console.log(
  `\n--- C1+C2 op-set completion (7 ops end-to-end, invariants vs trace + known, routing, gating, genealogy): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
