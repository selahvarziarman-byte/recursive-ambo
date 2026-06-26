#!/usr/bin/env node

// DIAGNOSTIC — Enabler-2: the persistent genealogy DAG + OperationKind + seam-readiness.
//
// Asserts the R-E2-3 SEALED values (§5.1-5.8) on the reconciled two-branch example,
// through the REAL committed modules (no hand-built shapes/registries):
//   genealogyDag.buildGenealogyDag/assessIntegrity/seamSign/ancestorsOf/descendantsOf
//   multiform.loadForm/assemble · seeds.createSeedShape · ambo.applyAmboDissection
//   lineage.primalMultiset/primalMultisetKey · transformationLedger.shapeLineageOf/certifyFaithfulness
//   incidenceTraceRegistry.buildIncidenceTraceRegistry · cascadeDriver OrientationCert (U = (-1)^w1).
//
// Seal: .handoff/ENABLER_2_GENEALOGY_DAG_SEALED_VALUES.md (committed SHA-256 hash). A run
// that disagrees with a sealed value is the first real result — surfaced, never massaged.
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
  buildGenealogyDag,
  assessIntegrity,
  seamSign,
  ancestorsOf,
  descendantsOf,
} = req('src/lib/genealogyDag.ts');
const { loadForm, assemble } = req('src/lib/multiform.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { primalMultiset, primalMultisetKey } = req('src/lib/lineage.ts');
const { shapeLineageOf, certifyFaithfulness } = req('src/lib/transformationLedger.ts');
const { buildIncidenceTraceRegistry } = req('src/lib/incidenceTraceRegistry.ts');
const {
  buildJoinSeed,
  runCascade,
  certifyCascadeOrientation,
  buildSelfGlueSeed,
} = req('src/lib/cascadeDriver.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sorted = (xs) => [...xs].sort();

// ---- the reconciled two-branch example (real committed code) ----
// Branch A (namespaced birth): F1, F2 squares; F3 = assemble glue A*<-{u1:A,u2:A}, B*<-{u1:B,u2:B}.
// Branch B (cell-bearing ambo): T = seed tetrahedron; Tprime = ambo-dissection(T).
const squareForm = () => ({
  name: 'square',
  vertices: [
    { id: 'A', position: [0, 0, 0] },
    { id: 'B', position: [1, 0, 0] },
    { id: 'C', position: [1, 1, 0] },
    { id: 'D', position: [0, 1, 0] },
  ],
  faces: [{ vertexIds: ['A', 'B', 'C', 'D'] }],
});

const F1 = loadForm(squareForm, 'u1');
const F2 = loadForm(squareForm, 'u2');
const asm = assemble([F1, F2], {
  merges: [
    { resultId: 'A*', sources: ['u1:A', 'u2:A'] },
    { resultId: 'B*', sources: ['u1:B', 'u2:B'] },
  ],
});
const F3 = asm.shape;
const ledger = asm.ledger;
const T = createSeedShape('tetrahedron');
const Tprime = applyAmboDissection(T);

// U sign — derived from the REAL committed OrientationCert (NOT hardcoded). The Branch A
// glue is orientation-preserving → w1=0 → U=+1; the flip-glue variant → w1=1 → U=-1.
const glueCert = certifyCascadeOrientation(
  F3,
  [F3.faces[0], F3.faces[1]],
  runCascade(F3, [F3.faces[0], F3.faces[1]], buildJoinSeed(F3, F3.faces[0], F3.faces[1], 'rotation')),
);
const w1Glue = glueCert.w1;
const flipCert = certifyCascadeOrientation(
  F1,
  [F1.faces[0]],
  runCascade(F1, [F1.faces[0]], buildSelfGlueSeed(F1, F1.faces[0], 'flip')),
);
const w1Flip = flipCert.w1;

const dag = buildGenealogyDag([F1, F2, F3, T, Tprime], { orientation: { [F3.id]: { w1: w1Glue } } });
const dagSnapshot = JSON.stringify(dag);

const nodeOf = (id) => dag.nodes.find((n) => n.id === id);
const edgeOf = (parent, child) => dag.edges.find((e) => e.parent === parent && e.child === child);
const ids = { F1: F1.id, F2: F2.id, F3: F3.id, T: T.id, Tprime: Tprime.id };

console.log('Example: Branch A {F1,F2 squares -> F3 assemble} + Branch B {T tetra -> Tprime ambo} in ONE DAG\n');

// ===== [1] §5.1 depths (from committed genealogy.generationDepth) =====
console.log('----- [1] DAG NODES / DEPTHS -----');
check('§5.1 depth F1=0', nodeOf(ids.F1).depth === 0);
check('§5.1 depth F2=0', nodeOf(ids.F2).depth === 0);
check('§5.1 depth F3=1', nodeOf(ids.F3).depth === 1);
check('§5.1 depth T=0', nodeOf(ids.T).depth === 0);
check('§5.1 depth Tprime=1', nodeOf(ids.Tprime).depth === 1);
check('§5.1 five nodes in one DAG', dag.nodes.length === 5);
note(`F1=${nodeOf(ids.F1).depth} F2=${nodeOf(ids.F2).depth} F3=${nodeOf(ids.F3).depth} | T=${nodeOf(ids.T).depth} Tprime=${nodeOf(ids.Tprime).depth}`);

// ===== [2] §5.2 OperationKind on edges (placeholder retired) =====
console.log('\n----- [2] OPERATIONKIND ON EDGES -----');
check('§5.2 F1,F2,T = invoke (source-less roots)', nodeOf(ids.F1).birthOperation === 'invoke' && nodeOf(ids.F2).birthOperation === 'invoke' && nodeOf(ids.T).birthOperation === 'invoke');
check('§5.2 F3 = assemble (NOT ambo — placeholder retired)', nodeOf(ids.F3).birthOperation === 'assemble');
check('§5.2 Tprime = ambo-dissection', nodeOf(ids.Tprime).birthOperation === 'ambo-dissection');
check('§5.2 edge F1->F3 and F2->F3 carry operation=assemble', edgeOf(ids.F1, ids.F3).operation === 'assemble' && edgeOf(ids.F2, ids.F3).operation === 'assemble');
check('§5.2 edge T->Tprime carries operation=ambo-dissection', edgeOf(ids.T, ids.Tprime).operation === 'ambo-dissection');
check('§5.2 NO glued child reads "ambo": F3.A*,B* createdBy.operation === "assemble"', F3.vertices['A*'].createdBy.operation === 'assemble' && F3.vertices['B*'].createdBy.operation === 'assemble');
note(`birthOps: F1=${nodeOf(ids.F1).birthOperation} F3=${nodeOf(ids.F3).birthOperation} Tprime=${nodeOf(ids.Tprime).birthOperation} | A* op=${F3.vertices['A*'].createdBy.operation}`);

// ===== [3] §5.3 carried roots — carried-not-minted (real primalMultiset) =====
console.log('\n----- [3] CARRIED ROOTS (carried-not-minted) -----');
const expectF3Roots = sorted(['u1:A', 'u1:B', 'u1:C', 'u1:D', 'u2:A', 'u2:B', 'u2:C', 'u2:D']);
const expectTpRoots = sorted(['vertex:tetrahedron:a', 'vertex:tetrahedron:b', 'vertex:tetrahedron:c', 'vertex:tetrahedron:d']);
check('§5.3 F3 carriedRoots === 8 namespaced roots {u1:A..u2:D}', eq(nodeOf(ids.F3).carriedRoots, expectF3Roots));
check('§5.3 F3 mints NO A*/B* primal', !nodeOf(ids.F3).carriedRoots.includes('A*') && !nodeOf(ids.F3).carriedRoots.includes('B*'));
check('§5.3 Tprime carriedRoots === 4 tetra corners {a..d}', eq(nodeOf(ids.Tprime).carriedRoots, expectTpRoots));
check('§5.3 Tprime mints NO midpoint primal (only the 4 corners)', nodeOf(ids.Tprime).carriedRoots.length === 4);
// cross-check against the REAL primalMultiset directly (A* over F3; a midpoint over Tprime)
check('§5.3 direct: primalMultiset(A*) === {u1:A,u2:A} (key carried union)', primalMultisetKey(primalMultiset('A*', F3, new Map())) === 'u1:A×1|u2:A×1');
const aMidpoint = Object.values(Tprime.vertices).find((v) => v.createdBy.operation === 'ambo-dissection');
check('§5.3 direct: a Tprime midpoint carries its 2 corner endpoints (no minted primal)', primalMultiset(aMidpoint.id, Tprime, new Map()).size === 2);
note(`F3 roots=${nodeOf(ids.F3).carriedRoots.length} Tprime roots=${nodeOf(ids.Tprime).carriedRoots.length}`);

// ===== [4] §5.4 seam — co-location != identity (real certifyFaithfulness) =====
console.log('\n----- [4] SEAM (co-location != identity) -----');
const seam = certifyFaithfulness({ forward: ledger.forward, pullBack: ledger.pullBack }, shapeLineageOf(F3));
const siteIn = (cert, id) => cert.perResultSite.find((s) => s.resultSiteId === id);
check('§5.4 A* lineage-heterogeneous, conflict=["u1:A×1","u2:A×1"]', siteIn(seam, 'A*').status === 'lineage-heterogeneous' && eq(siteIn(seam, 'A*').lineageConflict, ['u1:A×1', 'u2:A×1']));
check('§5.4 B* lineage-heterogeneous, conflict=["u1:B×1","u2:B×1"]', siteIn(seam, 'B*').status === 'lineage-heterogeneous' && eq(siteIn(seam, 'B*').lineageConflict, ['u1:B×1', 'u2:B×1']));
check('§5.4 heterogeneousCount === 2', seam.heterogeneousCount === 2);
check('§5.4 operationStatus === UNFAITHFUL (annotate-not-reject)', seam.operationStatus === 'UNFAITHFUL');
note(`het=${seam.heterogeneousCount} ${seam.operationStatus}`);

// ===== [5] §5.5 X_K seam slots (real buildIncidenceTraceRegistry) =====
console.log('\n----- [5] X_K SEAM SLOTS -----');
check('§5.5 Tprime exposes 6 X_K sites', nodeOf(ids.Tprime).xK.length === 6);
const tpRootSet = new Set(Object.values(Tprime.vertices).filter((v) => v.createdBy.sourceVertexIds.length === 0).map((v) => v.id));
check('§5.5 every Tprime site has 2 parents, both tracing to Tprime roots', nodeOf(ids.Tprime).xK.every((s) => s.parents.length === 2 && tpRootSet.has(s.parents[0]) && tpRootSet.has(s.parents[1])));
check('§5.5 Branch A nodes (F1,F2,F3) expose 0 X_K (cell-less)', nodeOf(ids.F1).xK.length === 0 && nodeOf(ids.F2).xK.length === 0 && nodeOf(ids.F3).xK.length === 0);
check('§5.5 direct: buildIncidenceTraceRegistry(Tprime).sites === 6', buildIncidenceTraceRegistry(Tprime).sites.length === 6);
note(`Tprime X_K=${nodeOf(ids.Tprime).xK.length} ; roots traced=${nodeOf(ids.Tprime).xK.every((s) => tpRootSet.has(s.parents[0]) && tpRootSet.has(s.parents[1]))} ; BranchA X_K=${nodeOf(ids.F1).xK.length}/${nodeOf(ids.F2).xK.length}/${nodeOf(ids.F3).xK.length}`);

// ===== [6] §5.6 U orientation sign (derived from real OrientationCert, NOT hardcoded) =====
console.log('\n----- [6] U ORIENTATION SIGN (U = (-1)^w1) -----');
check('§5.6 real OrientationCert: orientable glue w1=0', w1Glue === 0);
check('§5.6 Branch A glue edges carry U=+1 (= seamSign(w1Glue), derived)', edgeOf(ids.F1, ids.F3).U === 1 && edgeOf(ids.F2, ids.F3).U === 1 && seamSign(w1Glue) === 1);
check('§5.6 non-glue edge (T->Tprime, ambo) carries NO U', edgeOf(ids.T, ids.Tprime).U === undefined);
check('§5.6 cross-check: flip-glue w1=1 -> U=-1 (U is w1-driven, not a constant)', w1Flip === 1 && seamSign(w1Flip) === -1);
note(`w1Glue=${w1Glue} -> U=${edgeOf(ids.F1, ids.F3).U} ; flip w1=${w1Flip} -> U=${seamSign(w1Flip)}`);

// ===== [7] §5.7 monotone record vs non-monotone population =====
console.log('\n----- [7] MONOTONE RECORD vs NON-MONOTONE POPULATION -----');
const births = dag.record.filter((e) => e.kind === 'birth');
const deaths = dag.record.filter((e) => e.kind === 'death');
check('§5.7 record events === 8 (5 births + 3 deaths)', dag.record.length === 8 && births.length === 5 && deaths.length === 3);
check('§5.7 deaths are {F1,F2 (assemble), T (ambo)}', eq(sorted(deaths.map((e) => e.node)), sorted([ids.F1, ids.F2, ids.T])));
check('§5.7 live population path === [1,2,1,2,2] (NON-monotone — drops at assemble)', eq(dag.populationPath, [1, 2, 1, 2, 2]));
check('§5.7 population is non-monotone (a real drop)', dag.populationPath.some((v, i) => i > 0 && v < dag.populationPath[i - 1]));
check('§5.7 live-at-end === 2 {F3,Tprime}', eq(sorted(dag.liveAtEnd), sorted([ids.F3, ids.Tprime])));
note(`record=${dag.record.length} (births=${births.length},deaths=${deaths.length}) ; path=${JSON.stringify(dag.populationPath)} ; live-at-end=${dag.liveAtEnd.length}`);

// ===== [8] §5.8 TOOTH — integrity ACCEPTS the valid DAG, REJECTS both broken variants =====
console.log('\n----- [8] TOOTH (integrity must BITE) -----');
check('§5.8 valid DAG is ACCEPTED (acyclic && lineage⊆parents)', dag.integrity.accepted === true);
// (a) inject a cycle: an edge Tprime->T (depth 1 -> 0) has no consistent depth.
const cycleEdges = [...dag.edges, { parent: ids.Tprime, child: ids.T, operation: 'ambo-dissection', death: false }];
const cycleVerdict = assessIntegrity(dag.nodes, cycleEdges);
check('§5.8(a) injected cycle (Tprime->T) is REJECTED (not acyclic)', cycleVerdict.accepted === false && cycleVerdict.acyclic === false);
// (b) inject a ghost source on F3 (GHOST:Z not in F1/F2 vertices).
const ghostNodes = dag.nodes.map((n) => (n.id === ids.F3 ? { ...n, lineageSources: [...n.lineageSources, 'GHOST:Z'] } : n));
const ghostVerdict = assessIntegrity(ghostNodes, dag.edges);
check('§5.8(b) injected ghost source (GHOST:Z on F3) is REJECTED (lineage⊄parents)', ghostVerdict.accepted === false && ghostVerdict.lineageWithinParents === false);
note(`valid=${dag.integrity.accepted} ; cycle=${cycleVerdict.accepted}(acyclic ${cycleVerdict.acyclic}) ; ghost=${ghostVerdict.accepted}(lineage⊆parents ${ghostVerdict.lineageWithinParents})`);

// ===== discipline =====
console.log('\n----- discipline -----');
check('queryable: ancestorsOf(F3) === {F1,F2}', eq(ancestorsOf(dag, ids.F3), sorted([ids.F1, ids.F2])));
check('queryable: descendantsOf(T) === {Tprime}', eq(descendantsOf(dag, ids.T), [ids.Tprime]));
check('parents recovered forward: F3.parents={F1,F2}, Tprime.parents={T}', eq(sorted(nodeOf(ids.F3).parents), sorted([ids.F1, ids.F2])) && eq(nodeOf(ids.Tprime).parents, [ids.T]));
check('derive-only: DAG JSON byte-identical before/after all reads', JSON.stringify(dag) === dagSnapshot);
note(`ancestors(F3)=${JSON.stringify(ancestorsOf(dag, ids.F3))}`);

console.log(
  `\n--- genealogy DAG (§5.1-5.8: depths, OperationKind, carried roots, seam, X_K, U, monotone record, tooth): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
