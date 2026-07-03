#!/usr/bin/env node

// DIAGNOSTIC — G5.0: the op-result materializer (operations produce FORMS).
//
// Canonical inputs = the committed level-2 zoo op-path (glue/flip-glue on the
// cube bottom face, exactly as diagnose-level2-zoo.cjs), collapse, and a cut.
// THE CORE (non-circular): the materialized Shape's INDEPENDENTLY-computed
// invariants — χ from its own explicit cells, w₁ via the committed globalW1Class
// over its complex, links via the committed decomposeLink — equal the committed
// op-trace's OWN certificate AND the known zoo values. Plus lineage
// (carried-not-minted), single-parent genealogy in the committed DAG, and the
// teeth: T1 endpoint-fusion corrupts χ (the naive route is wrong and shown
// wrong); T2 a doctored certificate REFUSES to materialize (replay verification);
// T3 a cut drops χ by exactly the trace's removed count, never silently.
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

const { materializeSurfaceResult, materializeCutResult } = req('src/lib/materializeOperation.ts');
const { glueFace, flipGlueFace, collapseFace } = req('src/lib/surfaceOperations.ts');
const { cutCell } = req('src/lib/cutOperation.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { globalW1Class } = req('src/lib/globalW1.ts');
const { decomposeLink } = req('src/lib/incidenceTraceRegistry.ts');
const { deriveEdges } = req('src/lib/shape.ts');
const { primalMultiset, primalMultisetKey } = req('src/lib/lineage.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');
const { faceEdgePairs } = req('src/lib/surfaceOperations.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---- the canonical substrate (exactly the level-2 zoo's) ----
const cube = createSeedShape('cube');
const cubeSnapshot = JSON.stringify(cube);
const face = cube.faces[0];
const P = (edgeA, edgeB, mode) => ({ edgeA, edgeB, mode });

const CASES = [
  { name: 'torus', trace: () => glueFace(cube, face, [P(0, 2, 'preserving'), P(1, 3, 'preserving')]), chi: 0, w1: 0, b1: 2, w1Class: [0, 0], closed: true },
  { name: 'klein', trace: () => flipGlueFace(cube, face, [P(0, 2, 'preserving'), P(1, 3, 'reversing')]), chi: 0, w1: 1, b1: 2, w1Class: [0, 1], closed: true },
  { name: 'rp2', trace: () => flipGlueFace(cube, face, [P(0, 2, 'reversing'), P(1, 3, 'reversing')]), chi: 1, w1: 1, b1: 1, w1Class: [1], closed: true },
  { name: 'sphere (collapse)', trace: () => collapseFace(cube, face), chi: 2, w1: 0, b1: 0, w1Class: [], closed: false },
];

console.log('G5.0 materializer: committed op certificates -> real forms, verified independently\n');
const table = [];

for (const testCase of CASES) {
  console.log(`----- [${testCase.name}] -----`);
  const trace = testCase.trace();
  const result = materializeSurfaceResult(cube, face, trace);
  const L = result.shape;
  const V = Object.keys(L.vertices).length;
  const E = L.edges.length;
  const F = L.faces.length;
  const chiShape = V - E + F;

  // (1) independent invariants === the trace's certificate === the known values
  check(`${testCase.name}: independent χ (V−E+F over explicit cells) === trace.chi === ${testCase.chi}`, chiShape === trace.chi && chiShape === testCase.chi);
  check(`${testCase.name}: Shape cell counts === the trace's cellCounts`, eq({ v: V, e: E, f: F }, trace.cellCounts));
  const cert = globalW1Class(result.complex);
  const independentW1 = cert.nonOrientable ? 1 : 0;
  check(`${testCase.name}: independent w₁ (committed globalW1Class on the complex) === trace.w1 === ${testCase.w1}`, independentW1 === trace.w1 && independentW1 === testCase.w1);
  check(`${testCase.name}: b₁ === ${testCase.b1}, w1Class === ${JSON.stringify(testCase.w1Class)}`, cert.b1 === testCase.b1 && eq(cert.w1Class, testCase.w1Class));
  if (testCase.closed) {
    check(`${testCase.name}: every vertex link single-component interior (closed combinatorial manifold)`, result.links.length === V && result.links.every((l) => l.valence === 'interior' && l.decomposition.strata.length === 1 && !l.decomposition.pinch));
    const traceValences = trace.links.map((l) => l.valence);
    check(`${testCase.name}: link valences match the trace's own links certificate`, traceValences.every((v) => v === 'interior'));
  } else {
    check(`${testCase.name}: collapse carries no 1-complex link (committed precedent — the surface test is χ)`, result.links.length === 0 && E === 0 && trace.links.length === 0);
  }

  // (2) carried-not-minted lineage
  const minted = L.genealogy.createdVertexIds;
  check(`${testCase.name}: merged vertices carry the UNION of their parents' roots (no fresh primal)`, minted.length > 0 && minted.every((id) => {
    const sources = L.vertices[id].createdBy.sourceVertexIds;
    const multiset = primalMultiset(id, L, new Map());
    const expected = [...sources].sort().map((s) => `${s}×1`).join('|');
    return sources.length >= 2 && primalMultisetKey(multiset) === expected && !multiset.has(id);
  }));
  const retained = Object.keys(L.vertices).filter((id) => !minted.includes(id));
  check(`${testCase.name}: un-merged vertices retained verbatim (createdBy untouched)`, retained.every((id) => eq(L.vertices[id].createdBy, cube.vertices[id].createdBy)));

  // (3) single-parent genealogy + the committed DAG
  const expectedOp = { torus: 'glue', klein: 'flip-glue', rp2: 'flip-glue', 'sphere (collapse)': 'collapse' }[testCase.name];
  check(`${testCase.name}: genealogy single-parent (parent=${'cube'}, op='${expectedOp}', depth+1)`, L.genealogy.parentShapeId === cube.id && L.genealogy.operation === expectedOp && L.genealogy.generationDepth === cube.genealogy.generationDepth + 1);
  const dag = buildGenealogyDag([cube, L]);
  const node = dag.nodes.find((x) => x.id === L.id);
  check(`${testCase.name}: the birth registers cleanly in the committed DAG (accepted; parents=[cube])`, dag.integrity.accepted === true && eq(node.parents, [cube.id]));

  note(`V=${V} E=${E} F=${F} χ=${chiShape} | b₁=${cert.b1} w1Class=${JSON.stringify(cert.w1Class)} | pairings=${JSON.stringify(result.pairings)}`);
  table.push({ name: testCase.name, V, E, F, chi: chiShape, traceChi: trace.chi, w1: independentW1, traceW1: trace.w1, links: testCase.closed ? 'interior×' + V : '(χ-test)' });
  console.log('');
}

// ===== TEETH =====
console.log('----- TEETH -----');

// T1 — the endpoint-fusion trap: naive deriveEdges on the torus fuses the two
// self-loop classes into one edge → wrong χ. The explicit-class result is right.
const torusTrace = glueFace(cube, face, [P(0, 2, 'preserving'), P(1, 3, 'preserving')]);
const torus = materializeSurfaceResult(cube, face, torusTrace);
const naiveEdges = deriveEdges(torus.shape.faces, torus.shape.id);
const naiveChi = Object.keys(torus.shape.vertices).length - naiveEdges.length + torus.shape.faces.length;
check('T1 naive endpoint-keyed re-derivation FUSES parallel classes (fewer edges than explicit)', naiveEdges.length < torus.shape.edges.length);
check('T1 the naive χ is CORRUPTED (differs from the true 0); the explicit-class χ is right', naiveChi !== 0 && torus.shape.edges.length === 2 && Object.keys(torus.shape.vertices).length - torus.shape.edges.length + 1 === 0);
note(`explicit: E=${torus.shape.edges.length} χ=0 ; naive deriveEdges: E=${naiveEdges.length} χ=${naiveChi} (the route-B trap, bitten)`);

// T2 — a doctored certificate must REFUSE to materialize (replay verification).
let doctoredRejected = false;
let doctoredMessage = '';
try {
  materializeSurfaceResult(cube, face, { ...torusTrace, w1: 1 });
} catch (error) {
  doctoredRejected = true;
  doctoredMessage = String(error.message);
}
check('T2 a trace with a flipped w₁ is REJECTED (committed-op replay does not reproduce it)', doctoredRejected && doctoredMessage.includes('refusing to materialize'));
let foreignRejected = false;
try {
  const kleinTrace = flipGlueFace(cube, face, [P(0, 2, 'preserving'), P(1, 3, 'reversing')]);
  materializeSurfaceResult(cube, face, { ...kleinTrace, surface: 'glue' });
} catch (error) {
  foreignRejected = true;
}
check('T2 a cross-wired certificate (klein trace relabelled glue) is REJECTED', foreignRejected);
note(`doctored: "${doctoredMessage.slice(0, 110)}…"`);

// T3 — the cut drops χ by exactly the trace's removed count, never silently.
const cutTrace = cutCell(cube, face);
const cutShape = materializeCutResult(cube, cutTrace);
const chiCube = Object.keys(cube.vertices).length - cube.edges.length + cube.faces.length;
const chiCut = Object.keys(cutShape.vertices).length - cutShape.edges.length + cutShape.faces.length;
const removedCount = Object.values(cutTrace.ledger.forward).filter((t) => t === null).length;
check('T3 the cut removes exactly the trace\'s logged losses (1 face)', removedCount === 1 && cutShape.faces.length === cube.faces.length - 1 && !cutShape.faces.some((f) => f.id === cutTrace.removed));
check(`T3 χ drops by EXACTLY the removed count (${chiCube} → ${chiCube - removedCount})`, chiCut === chiCube - removedCount);
// independent recompute of the trace's boundary claim on the MATERIALIZED shape:
const boundaryV = cutTrace.boundaryVertex;
const adjacency = new Map();
const add = (a, b) => { const l = adjacency.get(a); if (l) l.push(b); else adjacency.set(a, [b]); };
for (const f of cutShape.faces) {
  if (!f.vertexIds.includes(boundaryV)) continue;
  const pairs = faceEdgePairs(f);
  const incoming = pairs.find((e) => e[1] === boundaryV);
  const outgoing = pairs.find((e) => e[0] === boundaryV);
  if (incoming && outgoing) { add(incoming[0], outgoing[1]); add(outgoing[1], incoming[0]); }
}
check("T3 the cut vertex's link on the MATERIALIZED shape opens to 'boundary' (=== the trace's valence)", decomposeLink(adjacency).valence === 'boundary' && cutTrace.valence === 'boundary');
check('T3 cut genealogy: single-parent, operation \'cut\', depth+1, mints nothing', cutShape.genealogy.parentShapeId === cube.id && cutShape.genealogy.operation === 'cut' && cutShape.genealogy.generationDepth === cube.genealogy.generationDepth + 1 && cutShape.genealogy.createdVertexIds.length === 0);
check('T3 cut vertices/edges PASS THROUGH verbatim (committed cutCell semantics)', cutShape.vertices === cube.vertices && cutShape.edges === cube.edges);
note(`cube χ=${chiCube} → cut χ=${chiCut} (removed=${removedCount}) ; boundary vertex ${boundaryV} valence=boundary`);

// ===== the per-op table + discipline =====
console.log('\n  OP                 V  E  F  χ(indep)  χ(trace)  w₁(indep)  w₁(trace)  links');
for (const r of table) {
  const pad = (s, w) => String(s).padEnd(w);
  console.log(`  ${pad(r.name, 19)}${pad(r.V, 3)}${pad(r.E, 3)}${pad(r.F, 3)}${pad(r.chi, 10)}${pad(r.traceChi, 10)}${pad(r.w1, 11)}${pad(r.traceW1, 11)}${r.links}`);
}

console.log('\n----- discipline -----');
check('derive-only: the cube Shape is byte-unchanged after every materialization', JSON.stringify(cube) === cubeSnapshot);

console.log(
  `\n--- G5.0 materializer (faithful materialization vs trace + known zoo, lineage, genealogy, T1-T3 teeth): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
