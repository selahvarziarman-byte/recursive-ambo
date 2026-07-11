#!/usr/bin/env node

// DIAGNOSTIC — Q3 (genealogy view: transitive reduction) + Q5 (level-1 b₁ readout).
//
// Q3: the view's DEFAULT edges = immediate-begetting edges only. The committed
// `buildGenealogyDag` recovers DIRECT grandparent edges for deep assemblies
// (their created vertices ride in the child's shape-level sources) — the pure
// `transitiveReduceEdges` strips exactly those depth-skips, LOSSLESSLY:
// reachability (committed `ancestorsOf`) and `carriedRoots` keep the ancestry.
// `buildGenealogyDag` itself stays byte-unchanged (reduction is view-layer).
//
// Q5: a face-less 1-complex reports its LEVEL-1 reading — H₀ = Z^c and
// b₁ = E − V + c (cycle rank), torsion-free — instead of a blank "n-a". The
// surface-specific rows (genus / w₁ / orientability) stay n-a; the committed
// surface certifier stays out-of-domain and untouched.
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
const { buildGenealogyDag, ancestorsOf } = req('src/lib/genealogyDag.ts');
const { transitiveReduceEdges, layoutGenealogy } = req('src/playground/genealogyLayout.ts');
const { readFormInvariants, level1Betti } = req('src/playground/formInvariants.ts');
const { usePlaygroundStore } = req('src/store/playgroundStore.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log('Q3 + Q5 readouts: direct-parent genealogy edges · level-1 b₁ for skeletons\n');

// ===== [Q3] transitive reduction on the D5 deep chain =====
console.log('----- [Q3] TRANSITIVE REDUCTION (deep assembly F3/F4/F5) -----');
const F1 = loadForm(nGon(4), 'u1');
const F2 = loadForm(nGon(4), 'u2');
const Fx = loadForm(nGon(4), 'ux');
const Fy = loadForm(nGon(4), 'uy');
const F3 = assemble([F1, F2], canonicalAssembleIdentification(F1, F2)).shape;
const F4 = assemble([F3, Fx], canonicalAssembleIdentification(F3, Fx)).shape;
const F5 = assemble([F4, Fy], canonicalAssembleIdentification(F4, Fy)).shape;
const shapes = [F1, F2, Fx, Fy, F3, F4, F5];
const dag = buildGenealogyDag(shapes);
const dagSnapshot = JSON.stringify(dag.edges);
const reduced = transitiveReduceEdges(dag);

const incomingFull = (id) => dag.edges.filter((e) => e.child === id).map((e) => e.parent).sort();
const incomingReduced = (id) => reduced.filter((e) => e.child === id).map((e) => e.parent).sort();
// P2 (enacted assemble): ancestry composes THROUGH NAMES level-by-level — F5
// carries no vertex of F3's minting (F3's children were absorbed into F4's),
// so F3 is reachable TRANSITIVELY (F5 -> F4 -> F3; the LOSSLESS check below
// pins reachability === committed ancestorsOf), not by a direct edge.
check('Q3 the committed DAG carries the depth-skips the shapes still CARRY (F4 ← 4 parents; F5 ← 5 — F3 rides transitively, lossless below)', incomingFull(F4.id).length === 4 && incomingFull(F5.id).length === 5);
check('Q3 REDUCED: F4 draws ONLY its immediate parents {F3, Fx}', eq(incomingReduced(F4.id), [F3.id, Fx.id].sort()));
check('Q3 REDUCED: F5 draws ONLY its immediate parents {F4, Fy}', eq(incomingReduced(F5.id), [F4.id, Fy.id].sort()));
check('Q3 REDUCED: F3 keeps both root parents (nothing below to skip)', eq(incomingReduced(F3.id), [F1.id, F2.id].sort()));

// losslessness: reachability over the REDUCED edges === committed ancestorsOf
const reducedAncestors = (start) => {
  const result = new Set();
  const stack = [start];
  while (stack.length) {
    const current = stack.pop();
    for (const e of reduced) {
      if (e.child === current && !result.has(e.parent)) {
        result.add(e.parent);
        stack.push(e.parent);
      }
    }
  }
  return [...result].sort();
};
check('Q3 LOSSLESS: reduced reachability === committed ancestorsOf for EVERY node', shapes.every((s) => eq(reducedAncestors(s.id), ancestorsOf(dag, s.id))));
const f4Node = dag.nodes.find((n) => n.id === F4.id);
// P2: F4's roots now name what F4 CARRIES — the absorbed depth-1 child and
// Fx's absorbed corner ride as NAMES (the absent-source primal rule); u1:v0 /
// u2:v0 live one level up, on F3's node (the ledger keeps the full descent).
check('Q3 carriedRoots on the DAG node name the ENACTED carry (the depth-1 child + ux:v0 as names; the deeper roots live on F3)', f4Node.carriedRoots.includes('asm:u1:v0+u2:v0') && f4Node.carriedRoots.includes('ux:v0') && !f4Node.carriedRoots.includes('u1:v0'));
check('Q3 the committed buildGenealogyDag output is BYTE-UNCHANGED by the reduction', JSON.stringify(dag.edges) === dagSnapshot);
const model = layoutGenealogy(shapes);
check('Q3 the VIEW draws the reduced set (layout edges === reduced triples)', eq(model.edges.map((e) => `${e.parent}>${e.child}`).sort(), reduced.map((e) => `${e.parent}>${e.child}`).sort()));
note(`full edges=${dag.edges.length} → reduced=${reduced.length} (dropped ${dag.edges.length - reduced.length} depth-skips)`);

// ===== [Q5] level-1 b₁ on the pinned skeletons =====
console.log('\n----- [Q5] LEVEL-1 b₁ (skeletons report their loops) -----');
// pinned: the CYCLE — the cut-born square rim, through the real store
usePlaygroundStore.getState().resetPlayground();
const A = usePlaygroundStore.getState().invokeForm(nGon(4), 'ua');
usePlaygroundStore.getState().selectForm(A.id);
usePlaygroundStore.getState().selectFace(A.faces[0].id);
const cutBorn = usePlaygroundStore.getState().applyOperationToSelection('cut');
const cycleReadout = readFormInvariants(cutBorn, A);
check('Q5 CYCLE (cut-born rim): b₁ = 1, H₀ = Z (c=1), level-1 present', Boolean(cycleReadout.level1) && cycleReadout.level1.b1 === 1 && cycleReadout.level1.components === 1);
check('Q5 CYCLE: the surface rows stay n-a (cert null; skeleton classification)', cycleReadout.cert === null && cycleReadout.classification === 'n-a (no 2-cells — not a surface complex)');

const skeleton = (id, vertexIds, edges) => ({
  id, name: id, cells: [], generations: [],
  vertices: Object.fromEntries(vertexIds.map((k) => [k, { id: k, position: [0, 0, 0], data: { label: k, color: '#fff' }, createdBy: { shapeId: id, operation: 'seed', sourceVertexIds: [] } }])),
  edges: edges.map(([u, v], i) => ({ id: `${id}:e${i}`, vertexIds: [u, v], role: 'boundary' })),
  faces: [],
  genealogy: { parentShapeId: null, operation: 'seed', generationDepth: 0, sourceVertexIds: [], createdVertexIds: vertexIds, createdAt: '' },
});
const tree = skeleton('fixture:tree', ['A', 'B', 'C'], [['A', 'B'], ['B', 'C']]);
const treeReadout = readFormInvariants(tree);
check('Q5 TREE (path A−B−C): b₁ = 0, c = 1', Boolean(treeReadout.level1) && treeReadout.level1.b1 === 0 && treeReadout.level1.components === 1);

const figure8 = skeleton('fixture:fig8', ['A'], [['A', 'A'], ['A', 'A']]);
check('Q5 FIGURE-8 (1 vertex, 2 self-loops): b₁ = 2, c = 1 (two independent loops)', level1Betti(figure8).b1 === 2 && level1Betti(figure8).components === 1);
const fig8Readout = readFormInvariants(figure8);
check('Q5 FIGURE-8 through the READOUT: level-1 present even with self-loops (no faithful 2-complex needed)', Boolean(fig8Readout.level1) && fig8Readout.level1.b1 === 2 && fig8Readout.classification === 'n-a (no 2-cells — not a surface complex)');

const theta = skeleton('fixture:theta', ['A', 'B'], [['A', 'B'], ['A', 'B'], ['A', 'B']]);
check('Q5 THETA (2 vertices, 3 parallel edges): b₁ = 2', level1Betti(theta).b1 === 2 && level1Betti(theta).components === 1);

const twoComponents = skeleton('fixture:2c', ['A', 'B', 'C', 'D'], [['A', 'B'], ['C', 'D']]);
check('Q5 TWO components: H₀ = Z², b₁ = 0', level1Betti(twoComponents).components === 2 && level1Betti(twoComponents).b1 === 0);

// a face-bearing surface form is UNAFFECTED (no level1 field; committed readings stand)
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const sphereReadout = readFormInvariants(immerseSurface({ surface: 'sphere', resolution: 8 }).shape);
check('Q5 a face-bearing surface is unaffected (no level-1 field; committed genus reading stands)', sphereReadout.level1 === undefined && sphereReadout.classification === 'genus 0 (closed, orientable)');

console.log(
  `\n--- Q3+Q5 readouts (direct-parent default edges, lossless; level-1 b₁ = E−V+c on skeletons): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
