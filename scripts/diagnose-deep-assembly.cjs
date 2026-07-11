#!/usr/bin/env node

// DIAGNOSTIC — D5: assemble depth = max(parents) + 1 (deep birth-lineages unblocked).
//
// Committed `multiform.assemble` used to hardcode the child's generationDepth to 1,
// so assembling an ASSEMBLY produced a child NOT strictly deeper than its depth-1
// parent — the DAG (ADR 0009's arrow) rejected it, capping assembly at one
// generation. Under the D5 sanction the child's depth is max over the input
// forms + 1. This diagnostic builds a THREE-generation chain through the REAL
// committed modules and the REAL store:
//   F3 = F1 ⊕ F2            → depth 1  (the R2 base case, unchanged)
//   F4 = F3 ⊕ Fx (fresh)    → depth 2  (max(1,0)+1 — was 1, DAG-rejected)
//   F5 = F4 ⊕ Fy (fresh)    → depth 3
// asserting: the depths; `buildGenealogyDag` ACCEPTS at every stage (strictly-
// increasing depths, acyclic, lineage ⊆ parents); the chain resolves through
// `ancestorsOf`; carried-not-minted lineage HOLDS at depth 2 (a deep merge's
// primalMultiset is still the union of its sources' roots — the seal's law,
// depth-independent); and the STORE path (applyAssembleToSelection on an
// assembly) births the depth-2 child the D2 genealogy view can lay out.
//
// MEASURED-AND-SURFACED (committed recovery semantics, not an error): an
// assembled child's shape-level sourceVertexIds are ALL its union sites, which
// include vertices the GRANDPARENTS created — so the committed parent recovery
// records DIRECT edges to grandparents too (F4 ← {F3, Fx, F1, F2}). Depths still
// strictly increase along every such edge; the DAG accepts.
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

const { loadForm, assemble } = req('src/lib/multiform.ts');
const { canonicalAssembleIdentification } = req('src/playground/playgroundOperations.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { primalMultiset, primalMultisetKey } = req('src/lib/lineage.ts');
const { buildGenealogyDag, ancestorsOf } = req('src/lib/genealogyDag.ts');
const { usePlaygroundStore } = req('src/store/playgroundStore.ts');
const { layoutGenealogy } = req('src/playground/genealogyLayout.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log('D5 deep assembly: the depth arrow restored (assemblies of assemblies)\n');

// ===== [1] the three-generation chain (committed modules, canonical identifications) =====
console.log('----- [1] THE CHAIN (F3 = F1⊕F2 → F4 = F3⊕Fx → F5 = F4⊕Fy) -----');
const F1 = loadForm(nGon(4), 'u1');
const F2 = loadForm(nGon(4), 'u2');
const Fx = loadForm(nGon(4), 'ux');
const Fy = loadForm(nGon(4), 'uy');
const F3 = assemble([F1, F2], canonicalAssembleIdentification(F1, F2)).shape;
check('§1 base case UNCHANGED: F3 = F1⊕F2 has depth 1 (max(0,0)+1)', F3.genealogy.generationDepth === 1);

const F4 = assemble([F3, Fx], canonicalAssembleIdentification(F3, Fx)).shape;
check('§1 F4 = F3⊕Fx has depth 2 (max(1,0)+1 — the D5 arrow)', F4.genealogy.generationDepth === 2);

const F5 = assemble([F4, Fy], canonicalAssembleIdentification(F4, Fy)).shape;
check('§1 F5 = F4⊕Fy has depth 3 (a THIRD generation)', F5.genealogy.generationDepth === 3);
note(`depths: F1/F2/Fx/Fy=0  F3=${F3.genealogy.generationDepth}  F4=${F4.genealogy.generationDepth}  F5=${F5.genealogy.generationDepth}`);

// ===== [2] the DAG accepts the deep chain (was REJECTED pre-D5) =====
console.log('\n----- [2] THE DAG ACCEPTS (strictly-increasing depths; the chain resolves) -----');
const dag4 = buildGenealogyDag([F1, F2, Fx, F3, F4]);
check('§2 two generations: buildGenealogyDag({F1,F2,Fx,F3,F4}) ACCEPTS', dag4.integrity.accepted === true);
const f4Node = dag4.nodes.find((n) => n.id === F4.id);
check('§2 F4 recovers its constructive parents {F3, Fx}', Boolean(f4Node) && f4Node.parents.includes(F3.id) && f4Node.parents.includes(Fx.id));
// committed recovery semantics, surfaced: the union carries grandparent-created
// vertices in F4's shape-level sourceVertexIds → DIRECT grandparent edges too.
check(
  '§2 (surfaced) the committed recovery ALSO records grandparent edges — parents(F4) === {F1, F2, F3, Fx}',
  Boolean(f4Node) && eq([...f4Node.parents].sort(), [F1.id, F2.id, F3.id, Fx.id].sort()),
);
check('§2 every F4 edge still climbs the arrow (child depth 2 > every parent depth)', dag4.edges.filter((e) => e.child === F4.id).every((e) => {
  const parent = dag4.nodes.find((n) => n.id === e.parent);
  return Boolean(parent) && parent.depth < 2;
}));
check('§2 ancestorsOf(F4) resolves the WHOLE chain {F1, F2, F3, Fx}', eq(ancestorsOf(dag4, F4.id), [F1.id, F2.id, F3.id, Fx.id].sort()));

const dag5 = buildGenealogyDag([F1, F2, Fx, Fy, F3, F4, F5]);
check('§2 three generations: the full DAG ACCEPTS', dag5.integrity.accepted === true);
check('§2 ancestorsOf(F5) resolves ALL six ancestors', eq(ancestorsOf(dag5, F5.id), [F1.id, F2.id, F3.id, F4.id, Fx.id, Fy.id].sort()));
check('§2 the three assembly ids are DISTINCT (D1 holds at depth)', new Set([F3.id, F4.id, F5.id]).size === 3);
note(`F4 parents: ${JSON.stringify(f4Node ? f4Node.parents.sort() : null)}`);

// ===== [3] the seal's law holds at DEPTH (carried-not-minted, depth-independent) =====
console.log('\n----- [3] LINEAGE AT DEPTH (carried-not-minted on the depth-2 merges) -----');
for (const merge of canonicalAssembleIdentification(F3, Fx).merges) {
  const ms = primalMultiset(merge.resultId, F4, new Map());
  const expected = [...merge.sources].sort().map((s) => `${s}×1`).join('|');
  check(
    `§3 F4 merge "${merge.resultId}": primalMultiset === union of its sources' roots (no fresh primal)`,
    primalMultisetKey(ms) === expected && !ms.has(merge.resultId),
  );
  note(`${merge.resultId}: ${primalMultisetKey(ms)}`);
}
// P2 (enacted assemble): the depth-1 child is ABSORBED into the depth-2 merge
// (it is a SOURCE of F4's identification, so it leaves F4's vertex record —
// the enactment). Its lineage lives where it is CARRIED: in F3. Inside F4 the
// composition proceeds THROUGH NAMES level-by-level (an absent source is its
// own primal — the committed absent-source rule); the full multi-parent
// descent stays in the LEDGER (the pull-back checks above).
check('§3 the depth-1 merge keeps its lineage where it is CARRIED (in F3: u1:v0×1|u2:v0×1); in F4 it is enacted INTO the depth-2 child (P2)',
  primalMultisetKey(primalMultiset('asm:u1:v0+u2:v0', F3, new Map())) === 'u1:v0×1|u2:v0×1' &&
  !F4.vertices['asm:u1:v0+u2:v0']);

// ===== [4] the STORE path (re-assembling an assembly is no longer rejected) =====
console.log('\n----- [4] THE STORE PATH (applyAssembleToSelection on an assembly; D2 lays it out) -----');
usePlaygroundStore.getState().resetPlayground();
const A = usePlaygroundStore.getState().invokeForm(nGon(4), 'ua');
const B = usePlaygroundStore.getState().invokeForm(nGon(4), 'ub');
const C = usePlaygroundStore.getState().invokeForm(nGon(4), 'uc');
usePlaygroundStore.getState().selectForm(A.id);
const s1 = usePlaygroundStore.getState().applyAssembleToSelection(B.id);
usePlaygroundStore.getState().selectForm(s1.id);
const s2 = usePlaygroundStore.getState().applyAssembleToSelection(C.id); // an ASSEMBLY as form A
check('§4 the store births the deep child (S1⊕C) with depth 2', s2.genealogy.generationDepth === 2);
const st = usePlaygroundStore.getState();
const storeDag = buildGenealogyDag(st.formOrder.map((id) => st.forms[id].shape));
check('§4 the store DAG ACCEPTS the two-generation assembly (was rejected pre-D5)', storeDag.integrity.accepted === true);
const model = layoutGenealogy(st.formOrder.map((id) => st.forms[id].shape));
check('§4 the D2 genealogy view lays the deep chain out (accepted; three depth rows)', model.accepted === true && new Set(model.nodes.map((n) => n.depth)).size === 3);
check('§4 every edge in the layout still points strictly downward', model.edges.every((e) => e.y2 > e.y1));
note(`store depths present: ${[...new Set(model.nodes.map((n) => n.depth))].sort().join(', ')} — rows d0×${model.nodes.filter((n) => n.depth === 0).length} d1×${model.nodes.filter((n) => n.depth === 1).length} d2×${model.nodes.filter((n) => n.depth === 2).length}`);

console.log(
  `\n--- D5 deep assembly (depth arrow, DAG acceptance, chain resolution, lineage-at-depth, store + D2 view): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
