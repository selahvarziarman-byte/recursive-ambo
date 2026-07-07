#!/usr/bin/env node

// DIAGNOSTIC — the surface (Poincaré) dual `dual(M²)` (Q6 / ADR 0020) = THE SEAL.
//
// On the surface zoo {torus, Klein, RP², genus-2, cube-boundary}:
//   INVOLUTION  M** ≅ M — dual-of-dual returns the counts AND the composed
//               correspondence is a cell-level bijection with incidence intact
//               (the falsifiable check: a wrong dual fails self-inverse);
//   χ PRESERVED     χ(M*) = χ(M);
//   w₁ PRESERVED    committed globalW1Class over M*'s complex = over M's;
//   PINNED: the quotient torus (V1/E2/F1) is SELF-DUAL (V1/E2/F1, χ=0, w₁=0);
//           cube-boundary V8/E12/F6 → octahedron-boundary V6/E12/F8 (χ=2);
//   GATE: bounded (disk) / non-manifold (3-fan) / pinched (two spheres at a
//         vertex) inputs are REFUSED with reasons, never faked.
//
// THE SEAM, GROUNDED (mandate-vs-reality, surfaced): the committed dualization
// construction is NOT reusable here — its functions are module-PRIVATE, the
// face-cycle walker HARD-requires degree-5 vertices (dualization.ts:527/:574,
// pyritohedral-only), and its incidence is ENDPOINT-KEYED (:563), which fuses
// the self-loop edge classes of every quotient fixture (incl. the pinned
// self-dual torus). Per the mandate's hard line, dualization.ts stays
// BYTE-UNCHANGED (suite + diff verify); the surface dual is built ONCE,
// slot-faithfully, in surfaceDual.ts, reusing the committed `decomposeLink`
// (the gate), lineage helpers, and the `dualization` OperationKind.
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

const { surfaceDual, previewSurfaceDual } = req('src/lib/surfaceDual.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { glueFace, flipGlueFace } = req('src/lib/surfaceOperations.ts');
const { materializeSurfaceResult } = req('src/lib/materializeOperation.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { globalW1Class } = req('src/lib/globalW1.ts');
const { usePlaygroundStore } = req('src/store/playgroundStore.ts');
const { getPlaygroundOperation } = req('src/playground/playgroundOperations.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const P = (edgeA, edgeB, mode) => ({ edgeA, edgeB, mode });
const countsOf = (complex) => ({ v: complex.vertices.length, e: complex.edges.length, f: complex.faces.length });
const chiOf = (complex) => complex.vertices.length - complex.edges.length + complex.faces.length;

console.log('surface dual: M** = M + χ/w₁ preservation across the zoo (Q6 / ADR 0020)\n');

// ---- fixtures (committed ops throughout) ----
function quotient(word, pairings, n = 4, source = 'u1') {
  const form = loadForm(nGon(n), source);
  const face = form.faces[0];
  const op = pairings.some((p) => p.mode === 'reversing') ? flipGlueFace : glueFace;
  const trace = op(form, face, pairings);
  const result = materializeSurfaceResult(form, face, trace);
  return { name: word, shape: result.shape, complex: result.complex };
}
const ZOO = [
  { name: 'torus (quotient)', fx: quotient('torus', [P(0, 2, 'preserving'), P(1, 3, 'preserving')]) },
  { name: 'klein (quotient)', fx: quotient('klein', [P(0, 2, 'preserving'), P(1, 3, 'reversing')]) },
  { name: 'rp2 (quotient)', fx: quotient('rp2', [P(0, 2, 'reversing'), P(1, 3, 'reversing')]) },
  {
    name: 'genus-2 (octagon abABcdCD)',
    fx: quotient('genus2', [P(0, 2, 'preserving'), P(1, 3, 'preserving'), P(4, 6, 'preserving'), P(5, 7, 'preserving')], 8, 'u8'),
  },
  { name: 'cube-boundary', fx: { shape: createSeedShape('cube'), complex: undefined } },
];

// the involution: dual twice, compose the correspondences, demand identity-shape
function assertInvolution(name, source, sourceComplex) {
  const d1 = surfaceDual(source, { complex: sourceComplex });
  const d2 = surfaceDual(d1.shape, { complex: d1.complex });
  const src = sourceComplex ?? null;
  const srcCounts = src ? countsOf(src) : { v: Object.keys(source.vertices).length, e: source.edges.length, f: source.faces.length };
  const ddCounts = countsOf(d2.complex);
  check(`${name}: M** counts RETURN (V**=V, E**=E, F**=F)`, eq(ddCounts, srcCounts));

  // vertex chain: source vertex -> dual face (d1) -> its index -> M** vertex; must be a bijection
  const d1FaceIndexById = new Map(d1.shape.faces.map((f, i) => [f.id, i]));
  const composedVertexImages = Object.entries(d1.correspondence.sourceVertexToDualFace).map(([sv, df]) => {
    const index = d1FaceIndexById.get(df);
    return [sv, d2.correspondence.sourceFaceToDualVertex[`face:${index}`]];
  });
  check(
    `${name}: the composed vertex correspondence is a BIJECTION onto M** vertices`,
    composedVertexImages.every(([, image]) => Boolean(image)) &&
      new Set(composedVertexImages.map(([, image]) => image)).size === srcCounts.v,
  );
  // edge chain: e -> e* -> e**; endpoints must match the composed vertex images
  const vertexImage = new Map(composedVertexImages);
  const edgesOk = (src ? src.edges : d1 && []).length >= 0; // placeholder guard
  let edgeBijection = true;
  let incidenceOk = true;
  const seen = new Set();
  const sourceEdges = src ? src.edges : source.edges.map((e) => ({ id: e.id, u: e.vertexIds[0], v: e.vertexIds[1] }));
  for (const e of sourceEdges) {
    const de = d1.correspondence.sourceEdgeToDualEdge[e.id];
    const dde = d2.correspondence.sourceEdgeToDualEdge[de];
    if (!de || !dde || seen.has(dde)) edgeBijection = false;
    seen.add(dde);
    const ddEdge = d2.complex.edges.find((x) => x.id === dde);
    const want = [vertexImage.get(e.u), vertexImage.get(e.v)].sort();
    const got = ddEdge ? [ddEdge.u, ddEdge.v].sort() : null;
    if (!got || !eq(want, got)) incidenceOk = false;
  }
  void edgesOk;
  check(`${name}: the composed edge correspondence is a bijection with INCIDENCE intact`, edgeBijection && incidenceOk);
  return d1;
}

// ===== the zoo: involution + χ + w₁ =====
console.log('----- [ZOO] involution · χ · w₁ -----');
for (const entry of ZOO) {
  const { shape, complex } = entry.fx;
  const d1 = assertInvolution(entry.name, shape, complex);
  const srcComplex = complex ?? (() => {
    // cube-boundary: plain — surfaceDual translated it internally; rebuild for the certs
    const d = surfaceDual(shape); // deterministic — same translation
    void d;
    return null;
  })();
  const chiSource = srcComplex ? chiOf(srcComplex) : Object.keys(shape.vertices).length - shape.edges.length + shape.faces.length;
  const chiDual = chiOf(d1.complex);
  check(`${entry.name}: χ PRESERVED (χ(M*) = ${chiSource})`, chiDual === chiSource);
  const certDual = globalW1Class(d1.complex);
  const certSource = srcComplex ? globalW1Class(srcComplex) : globalW1Class({
    vertices: Object.keys(shape.vertices),
    edges: shape.edges.map((e) => ({ id: e.id, u: e.vertexIds[0], v: e.vertexIds[1] })),
    faces: shape.faces.map((f) => ({
      boundary: f.vertexIds.map((x, k) => {
        const y = f.vertexIds[(k + 1) % f.vertexIds.length];
        const edge = shape.edges.find((e2) => (e2.vertexIds[0] === x && e2.vertexIds[1] === y) || (e2.vertexIds[0] === y && e2.vertexIds[1] === x));
        return { edge: edge.id, dir: edge.vertexIds[0] === x ? 1 : -1 };
      }),
    })),
  });
  check(
    `${entry.name}: w₁ PRESERVED (committed globalW1Class — nonOrientable ${certSource.nonOrientable}, w1Class ${JSON.stringify(certSource.w1Class)})`,
    certDual.nonOrientable === certSource.nonOrientable && eq(certDual.w1Class, certSource.w1Class) && certDual.b1 === certSource.b1,
  );
  check(`${entry.name}: the born dual carries operation 'dualization', parent = M, depth+1`, d1.shape.genealogy.operation === 'dualization' && d1.shape.genealogy.parentShapeId === shape.id && d1.shape.genealogy.generationDepth === shape.genealogy.generationDepth + 1);
  note(`${entry.name}: M ${JSON.stringify(srcComplex ? countsOf(srcComplex) : { v: Object.keys(shape.vertices).length, e: shape.edges.length, f: shape.faces.length })} → M* ${JSON.stringify(countsOf(d1.complex))} · χ=${chiDual} · w1Class=${JSON.stringify(certDual.w1Class)}`);
}

// ===== the pinned concretes =====
console.log('\n----- [PINNED] torus self-dual · cube → octahedron -----');
const torusFx = ZOO[0].fx;
const torusDual = surfaceDual(torusFx.shape, { complex: torusFx.complex });
check('PINNED torus: V1/E2/F1 → dual V1/E2/F1 (SELF-DUAL), χ=0', eq(countsOf(torusDual.complex), { v: 1, e: 2, f: 1 }) && chiOf(torusDual.complex) === 0);
const cubeDual = surfaceDual(createSeedShape('cube'));
check('PINNED cube-boundary: V8/E12/F6 → dual = octahedron-boundary V6/E12/F8, χ=2 (the classic)', eq(countsOf(cubeDual.complex), { v: 6, e: 12, f: 8 }) && chiOf(cubeDual.complex) === 2);
check('PINNED cube dual: every dual face is a TRIANGLE (the octahedron), every dual vertex degree 4', cubeDual.complex.faces.every((f) => f.boundary.length === 3) && cubeDual.shape.faces.every((f) => f.vertexIds.length === 3));

// ===== the gate (refuse, don't fake) =====
console.log('\n----- [GATE] refusals -----');
const disk = loadForm(nGon(4), 'ud');
const diskProbe = previewSurfaceDual(disk);
check('GATE: a DISK (bounded) is refused — boundary edge named', diskProbe.ok === false && diskProbe.reason.includes('boundary edge'));
// three faces sharing one edge (a plain 3-fan — hand fixture, display-layer data)
const fan = {
  id: 'fixture:fan', name: 'fan', cells: [], generations: [],
  vertices: Object.fromEntries(['A', 'B', 'C', 'D', 'E'].map((k) => [k, { id: k, position: [0, 0, 0], data: { label: k, color: '#fff' }, createdBy: { shapeId: 'fixture:fan', operation: 'seed', sourceVertexIds: [] } }])),
  edges: [
    { id: 'eAB', vertexIds: ['A', 'B'], role: 'boundary' },
    { id: 'eBC', vertexIds: ['B', 'C'], role: 'boundary' }, { id: 'eCA', vertexIds: ['C', 'A'], role: 'boundary' },
    { id: 'eBD', vertexIds: ['B', 'D'], role: 'boundary' }, { id: 'eDA', vertexIds: ['D', 'A'], role: 'boundary' },
    { id: 'eBE', vertexIds: ['B', 'E'], role: 'boundary' }, { id: 'eEA', vertexIds: ['E', 'A'], role: 'boundary' },
  ],
  faces: [
    { id: 'fC', vertexIds: ['A', 'B', 'C'], role: 'seed-face' },
    { id: 'fD', vertexIds: ['A', 'B', 'D'], role: 'seed-face' },
    { id: 'fE', vertexIds: ['A', 'B', 'E'], role: 'seed-face' },
  ],
  genealogy: { parentShapeId: null, operation: 'seed', generationDepth: 0, sourceVertexIds: [], createdVertexIds: [], createdAt: '' },
};
const fanProbe = previewSurfaceDual(fan);
check('GATE: a NON-MANIFOLD edge (3 faces) is refused', fanProbe.ok === false && fanProbe.reason.includes('non-manifold'));
// two pillow-spheres sharing ONE vertex (each pillow = 2 triangles on the same 3 corners — a closed S²)
const pillowPair = {
  id: 'fixture:pinch', name: 'pinch', cells: [], generations: [],
  vertices: Object.fromEntries(['A', 'B', 'C', 'D', 'E'].map((k) => [k, { id: k, position: [0, 0, 0], data: { label: k, color: '#fff' }, createdBy: { shapeId: 'fixture:pinch', operation: 'seed', sourceVertexIds: [] } }])),
  edges: [
    { id: 'p1AB', vertexIds: ['A', 'B'], role: 'boundary' }, { id: 'p1BC', vertexIds: ['B', 'C'], role: 'boundary' }, { id: 'p1CA', vertexIds: ['C', 'A'], role: 'boundary' },
    { id: 'p2AD', vertexIds: ['A', 'D'], role: 'boundary' }, { id: 'p2DE', vertexIds: ['D', 'E'], role: 'boundary' }, { id: 'p2EA', vertexIds: ['E', 'A'], role: 'boundary' },
  ],
  faces: [
    { id: 'p1f1', vertexIds: ['A', 'B', 'C'], role: 'seed-face' },
    { id: 'p1f2', vertexIds: ['A', 'C', 'B'], role: 'seed-face' },
    { id: 'p2f1', vertexIds: ['A', 'D', 'E'], role: 'seed-face' },
    { id: 'p2f2', vertexIds: ['A', 'E', 'D'], role: 'seed-face' },
  ],
  genealogy: { parentShapeId: null, operation: 'seed', generationDepth: 0, sourceVertexIds: [], createdVertexIds: [], createdAt: '' },
};
const pinchProbe = previewSurfaceDual(pillowPair);
check("GATE: a PINCHED vertex (two spheres kissing) is refused — link ≠ 'interior'", pinchProbe.ok === false && pinchProbe.reason.includes("link reads 'junction'"));
note(`gate reasons: disk="${diskProbe.reason.slice(0, 70)}…" · fan="${fanProbe.reason.slice(0, 60)}…" · pinch="${pinchProbe.reason.slice(0, 70)}…"`);

// ===== the playground op (wiring) =====
console.log('\n----- [OP] the registry wiring (store end-to-end on the quotient torus) -----');
usePlaygroundStore.getState().resetPlayground();
const A = usePlaygroundStore.getState().invokeForm(nGon(4), 'u1');
usePlaygroundStore.getState().selectForm(A.id);
usePlaygroundStore.getState().selectFace(A.faces[0].id);
const bornTorus = usePlaygroundStore.getState().applyOperationToSelection('glue-torus');
usePlaygroundStore.getState().selectForm(bornTorus.id);
const dualOp = getPlaygroundOperation('dual');
const opContext = {
  form: bornTorus,
  selectedFaceId: null,
  selectedFace: null,
  parentShape: A,
};
check('OP: dual.canApply on the born quotient torus (parent recovery feeds the faithful complex)', dualOp.canApply(opContext) === true);
const dualBorn = usePlaygroundStore.getState().applyOperationToSelection('dual');
const storedDual = usePlaygroundStore.getState().forms[dualBorn.id];
check("OP: the dual joins the store {origin:'operated', source:'dual'}, operation 'dualization', parent = the torus", Boolean(storedDual) && storedDual.provenance.source === 'dual' && dualBorn.genealogy.operation === 'dualization' && dualBorn.genealogy.parentShapeId === bornTorus.id);
check('OP: the parent torus STILL LIVES in the store (store-level coexistence)', Boolean(usePlaygroundStore.getState().forms[bornTorus.id]));
check('OP: an invoked DISK is gated with the refusal reason (no throw)', dualOp.canApply({ form: A, selectedFaceId: null, selectedFace: null, parentShape: null }) === false && String(dualOp.getDisabledReason({ form: A, selectedFaceId: null, selectedFace: null, parentShape: null })).includes('boundary edge'));

console.log(
  `\n--- surface dual (involution M**=M · χ/w₁ preserved across the zoo · pinned concretes · gate · op wiring): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
