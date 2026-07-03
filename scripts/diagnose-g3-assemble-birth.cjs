#!/usr/bin/env node

// DIAGNOSTIC — G3: birth via `assemble` (two forms in, one child out).
//
// Through the REAL store + committed modules: invoke two DISJOINT-namespaced
// forms, applyAssembleToSelection → the child joins the store, BYTE-IDENTICAL to
// the direct committed `assemble` path with the same canonical identification;
// carried-not-minted lineage (each merged vertex's primalMultiset = the union of
// BOTH parents' roots — the committed assemble guarantee); the child is a
// multi-parent shape-root whose shape-level sourceVertexIds pull back to BOTH
// parents: `buildGenealogyDag` ACCEPTS and `ancestorsOf(child) = {A, B}`.
// Gating: same form / shared vertex ids refused with reasons. Derive-only.
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
const { canonicalAssembleIdentification, canAssemblePair, getAssemblePairDisabledReason } = req('src/playground/playgroundOperations.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
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

console.log('G3 assemble birth: two forms in, one multi-parent child out (live in the store)\n');

// ===== [1] the pipeline through the REAL store =====
console.log('----- [1] PIPELINE (invoke A + B -> applyAssembleToSelection -> child) -----');
usePlaygroundStore.getState().resetPlayground();
const A = usePlaygroundStore.getState().invokeForm(nGon(4), 'u1');
const B = usePlaygroundStore.getState().invokeForm(nGon(4), 'u2');
const aSnapshot = JSON.stringify(A);
const bSnapshot = JSON.stringify(B);
usePlaygroundStore.getState().selectForm(A.id);
const child = usePlaygroundStore.getState().applyAssembleToSelection(B.id);
const stored = usePlaygroundStore.getState().forms[child.id];
check('§1 the child JOINED the store', Boolean(stored) && usePlaygroundStore.getState().formOrder.includes(child.id));
check("§1 provenance = {origin:'born', source:'assemble'}", stored.provenance.origin === 'born' && stored.provenance.source === 'assemble');

// byte-identical to the direct committed path with the same canonical identification.
const direct = assemble([A, B], canonicalAssembleIdentification(A, B)).shape;
check('§1 the child is BYTE-IDENTICAL to the direct committed assemble path', JSON.stringify(child) === JSON.stringify(direct));

// carried-not-minted: each merged vertex's primalMultiset = the union of BOTH parents' roots.
const merges = canonicalAssembleIdentification(A, B).merges;
check('§1 the canonical identification carries 2 merges (one boundary edge, endpoint-wise)', merges.length === 2 && merges.every((m) => m.sources.length === 2));
for (const merge of merges) {
  const key = primalMultisetKey(primalMultiset(merge.resultId, child, new Map()));
  const expected = [...merge.sources].sort().map((s) => `${s}×1`).join('|');
  check(`§1 merged "${merge.resultId}": primalMultiset === union of BOTH parents' roots`, key === expected && !primalMultiset(merge.resultId, child, new Map()).has(merge.resultId));
  note(`${merge.resultId}: ${key}`);
}

// the multi-parent birth in the committed DAG.
check('§1 the child is a multi-parent shape-ROOT (parentShapeId === null — the committed assemble semantics)', child.genealogy.parentShapeId === null && child.genealogy.operation === 'assemble');
check("§1 the child's shape-level sourceVertexIds records BOTH parents' sites", child.genealogy.sourceVertexIds.length === Object.keys(A.vertices).length + Object.keys(B.vertices).length);
const storeShapes = usePlaygroundStore.getState().formOrder.map((id) => usePlaygroundStore.getState().forms[id].shape);
const dag = buildGenealogyDag(storeShapes);
const childNode = dag.nodes.find((n) => n.id === child.id);
check('§1 buildGenealogyDag over the store ACCEPTS (acyclic; lineage ⊆ parents)', dag.integrity.accepted === true);
check('§1 ancestorsOf(child) === {A, B} (the multi-parent birth recovered)', eq(ancestorsOf(dag, child.id), [A.id, B.id].sort()));
check('§1 both DAG edges carry operation assemble', dag.edges.filter((e) => e.child === child.id).length === 2 && dag.edges.filter((e) => e.child === child.id).every((e) => e.operation === 'assemble'));
note(`child=${child.id} parents=${JSON.stringify(childNode.parents)} depth=${childNode.depth}`);

// ===== [2] gating =====
console.log('\n----- [2] GATING (ineligible pairs refuse with reasons) -----');
check('§2 same form refused', canAssemblePair(A, A) === false && getAssemblePairDisabledReason(A, A) === 'Pick a DIFFERENT form — assemble needs two.');
const plainA = usePlaygroundStore.getState().invokeForm(nGon(4));
const plainB = usePlaygroundStore.getState().forms['shape:multiform:plain:square'];
// two PLAIN 4-gons share ids v0..v3 — not disjoint. (Invoke a second plain 4-gon:
// same shape id → the store overwrites; use the seeded plain square instead.)
const triPlain = usePlaygroundStore.getState().invokeForm(nGon(3));
void plainB;
check('§2 shared vertex ids refused (plain 4-gon vs plain 3-gon — both v0..)', canAssemblePair(plainA, triPlain) === false && String(getAssemblePairDisabledReason(plainA, triPlain)).includes('DISTINCT sources'));
let storeThrew = false;
try {
  usePlaygroundStore.getState().selectForm(plainA.id);
  usePlaygroundStore.getState().applyAssembleToSelection(triPlain.id);
} catch (error) {
  storeThrew = String(error.message).includes('not applicable');
}
check('§2 the store refuses an ineligible assemble LOUDLY', storeThrew);

// ===== [3] derive-only =====
console.log('\n----- [3] DERIVE-ONLY -----');
check('§3 parent A byte-identical after the birth', JSON.stringify(usePlaygroundStore.getState().forms[A.id].shape) === aSnapshot);
check('§3 parent B byte-identical after the birth', JSON.stringify(usePlaygroundStore.getState().forms[B.id].shape) === bSnapshot);

// ===== [4] D1 — COEXISTENCE (unique ids: two distinct assemblies live in ONE store/DAG) =====
console.log('\n----- [4] D1 COEXISTENCE (deterministically unique assembly ids) -----');
usePlaygroundStore.getState().resetPlayground();
const A2 = usePlaygroundStore.getState().invokeForm(nGon(4), 'ua');
const B2 = usePlaygroundStore.getState().invokeForm(nGon(4), 'ub');
const C2 = usePlaygroundStore.getState().invokeForm(nGon(4), 'uc');
usePlaygroundStore.getState().selectForm(A2.id);
const s1 = usePlaygroundStore.getState().applyAssembleToSelection(B2.id);
usePlaygroundStore.getState().selectForm(A2.id);
const s2 = usePlaygroundStore.getState().applyAssembleToSelection(C2.id);
check('§4 A⊕B and A⊕C mint DISTINCT shape ids', s1.id !== s2.id);
check(
  '§4 the id is DETERMINISTIC — same inputs reproduce the same id (derive-only holds)',
  assemble([A2, B2], canonicalAssembleIdentification(A2, B2)).shape.id === s1.id,
);
const st = usePlaygroundStore.getState();
check(
  '§4 BOTH assemblies live in the store (no overwrite)',
  Boolean(st.forms[s1.id]) && Boolean(st.forms[s2.id]) && st.formOrder.includes(s1.id) && st.formOrder.includes(s2.id),
);
const dagBoth = buildGenealogyDag(st.formOrder.map((id) => st.forms[id].shape));
check('§4 ONE buildGenealogyDag holds BOTH births (accepted: acyclic, lineage ⊆ parents)', dagBoth.integrity.accepted === true);
check('§4 ancestorsOf(A⊕B) === {A, B} (its OWN parents)', eq(ancestorsOf(dagBoth, s1.id), [A2.id, B2.id].sort()));
check('§4 ancestorsOf(A⊕C) === {A, C} (its OWN parents)', eq(ancestorsOf(dagBoth, s2.id), [A2.id, C2.id].sort()));
note(`s1=${s1.id}`);
note(`s2=${s2.id}`);

console.log(
  `\n--- G3 assemble birth (store pipeline, carried union lineage, multi-parent DAG, gating, derive-only, D1 coexistence): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
