#!/usr/bin/env node

// DIAGNOSTIC — G1: the invocation catalogue (primitives).
//
// Structural checks through the REAL committed modules: every catalogue entry
// loads via the committed `loadForm` into an n-gon Shape (n vertices, the
// derived edge count, 1 face); source-less invokes keep PLAIN ids; sourced
// invokes namespace them (co-location ≠ identity across sources); `nGon`
// rejects n < 2 loudly. The visual half of G1 acceptance (the panel in
// `?playground`) is checked by eye and reported in the handback, not here.
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

const { PRIMITIVE_CATALOGUE, nGon } = req('src/playground/primitiveCatalogue.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { usePlaygroundStore } = req('src/store/playgroundStore.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('G1 invocation catalogue: bare primitives -> real Shapes via committed loadForm\n');

// ---------------------------------------------------------------------------
// [1] every catalogue entry loads into the expected n-gon structure.
// ---------------------------------------------------------------------------
console.log('----- [1] catalogue entries load as n-gon Shapes (counts printed) -----');
const EXPECTED_N = { segment: 2, triangle: 3, square: 4, pentagon: 5, hexagon: 6 };
check('§1 catalogue carries the five chartered primitives', PRIMITIVE_CATALOGUE.map((e) => e.key).join(',') === 'segment,triangle,square,pentagon,hexagon');
for (const entry of PRIMITIVE_CATALOGUE) {
  const n = EXPECTED_N[entry.key];
  const shape = loadForm(entry.build);
  const vertexCount = Object.keys(shape.vertices).length;
  const edgeCount = shape.edges.length;
  const faceCount = shape.faces.length;
  // The committed deriveEdges keys edges by canonical endpoints, so the 2-gon's
  // two sides share one endpoint pair -> ONE Edge record; every n >= 3 gives n.
  const expectedEdges = n === 2 ? 1 : n;
  check(
    `§1 ${entry.key}: ${n} vertices, ${expectedEdges} derived edge(s), 1 face`,
    vertexCount === n && edgeCount === expectedEdges && faceCount === 1 && shape.faces[0].vertexIds.length === n,
  );
  check(
    `§1 ${entry.key}: vertices are v0..v${n - 1}, all source-less (fresh primals)`,
    Object.keys(shape.vertices).sort().join(',') ===
      Array.from({ length: n }, (_, i) => `v${i}`).sort().join(',') &&
      Object.values(shape.vertices).every(
        (v) => v.createdBy.operation === 'seed' && v.createdBy.sourceVertexIds.length === 0,
      ),
  );
  note(`${entry.key} (${entry.label}): V=${vertexCount} E=${edgeCount} F=${faceCount} shapeId=${shape.id}`);
}

// ---------------------------------------------------------------------------
// [2] invocation provenance through the REAL G0 store.
// ---------------------------------------------------------------------------
console.log('\n----- [2] source-less = plain ids; sourced = namespaced (co-location != identity) -----');
usePlaygroundStore.getState().resetPlayground();
const triangle = PRIMITIVE_CATALOGUE.find((e) => e.key === 'triangle');
const plain = usePlaygroundStore.getState().invokeForm(triangle.build);
const u1 = usePlaygroundStore.getState().invokeForm(triangle.build, 'u1');
const u2 = usePlaygroundStore.getState().invokeForm(triangle.build, 'u2');
check('§2 source-less invoke keeps plain ids v0..v2 (no ":" prefix)', Boolean(plain.vertices.v0) && Object.keys(plain.vertices).every((id) => !id.includes(':')));
check("§2 sourced invoke 'u1' namespaces every vertex (u1:v0..)", Boolean(u1.vertices['u1:v0']) && Object.keys(u1.vertices).every((id) => id.startsWith('u1:')));
check("§2 sourced invoke 'u2' namespaces every vertex (u2:v0..)", Boolean(u2.vertices['u2:v0']) && Object.keys(u2.vertices).every((id) => id.startsWith('u2:')));
check('§2 the three shape ids are pairwise distinct', new Set([plain.id, u1.id, u2.id]).size === 3);
check('§2 co-located v0 across sources are DISTINCT ids (no auto-identity)', u1.vertices['u1:v0'].id !== u2.vertices['u2:v0'].id);
const storeState = usePlaygroundStore.getState();
check('§2 all three invokes live in the store with carried provenance', storeState.forms[plain.id]?.provenance.source === null && storeState.forms[u1.id]?.provenance.source === 'u1' && storeState.forms[u2.id]?.provenance.source === 'u2');
note(`plain=${plain.id} u1=${u1.id} u2=${u2.id}`);

// ---------------------------------------------------------------------------
// [3] nGon rejects n < 2 loudly; parametric n works.
// ---------------------------------------------------------------------------
console.log('\n----- [3] nGon parametric builder + loud rejection -----');
for (const bad of [1, 0, -3, 2.5]) {
  let threw = false;
  try {
    nGon(bad);
  } catch (error) {
    threw = String(error.message).includes('needs an integer n >= 2');
  }
  check(`§3 nGon(${bad}) throws loudly`, threw);
}
const seven = loadForm(nGon(7));
check('§3 nGon(7) loads as a 7-gon (7 vertices, 7 edges, 1 face)', Object.keys(seven.vertices).length === 7 && seven.edges.length === 7 && seven.faces.length === 1);
note(`nGon(7): V=${Object.keys(seven.vertices).length} E=${seven.edges.length} F=${seven.faces.length} shapeId=${seven.id}`);

console.log(
  `\n--- G1 invocation catalogue (structure, provenance, parametric rejection): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
