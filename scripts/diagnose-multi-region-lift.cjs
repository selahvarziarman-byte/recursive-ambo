#!/usr/bin/env node

// DIAGNOSTIC — Multi-region lift (the P1b follow-on): a SET of picked entities
// lifts as ONE sub-complex through the untouched P1b data plane.
//
//   §1 a multi-FACE region (two faces sharing an edge) lifts as one connected
//      sub-complex with the closure pulled in AUTOMATICALLY (edges+vertices),
//      lands source-tagged and placeable on the shelf.
//   §2 a multi-CELL 3-region and §3 multi-EDGE path/cycle lift as one
//      sub-complex each.
//   §4 a DISCONNECTED pick refuses honestly (the P1b validator earning its
//      keep as the live gate) — refused, never a broken lift.
//   §5 the REAL store: toggle semantics (in/out), the set lifts through
//      liftSelectionToManuscript, clears after success, the single-entity
//      FALLBACK still works (empty set → inspection selection — the committed
//      P1b behavior), and the ambo original is byte-unchanged.
//
// The data plane (subComplexLift / liftStore / snapshot / shelf) is consumed
// BY IMPORT, byte-unchanged — this pass only feeds it a set.
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

const { createSeedShape } = req('src/data/seeds.ts');
const { getOperation } = req('src/operations/registry.ts');
const {
  downwardClosure,
  validateLiftSelection,
  liftSubComplex,
} = req('src/lib/subComplexLift.ts');
const { serializeSnapshot } = req('src/playground/snapshot.ts');
const { loadUniverseSnapshot } = req('src/manuscript/genesisModel.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('multi-region lift: a picked SET → one sub-complex → the committed P1b pipeline\n');

// ===== the fixture ============================================================
const seed = createSeedShape('tetrahedron');
const dissected = getOperation('ambo-dissection').execute({ shape: seed, selectedCellId: null, selectedCell: null });
const dissectedBytes = JSON.stringify(dissected);
const sharedCount = (a, b) => a.vertexIds.filter((v) => b.vertexIds.includes(v)).length;

// ===== [1] a multi-FACE region (adjacent pair) ================================
console.log('----- [1] multi-FACE region: two faces sharing an edge -----');
let adjacent = null;
outer: for (const fa of dissected.faces) {
  for (const fb of dissected.faces) {
    if (fa.id !== fb.id && sharedCount(fa, fb) === 2) { adjacent = [fa, fb]; break outer; }
  }
}
check('§1 fixture: an adjacent face pair exists (two shared vertices — a shared edge)', Boolean(adjacent));
const facePicks = [
  { kind: 'face', id: adjacent[0].id },
  { kind: 'face', id: adjacent[1].id },
];
const faceClosure = downwardClosure(dissected, facePicks);
check('§1 AUTO-CLOSURE: picking the two faces alone pulls in their edges and vertices — {V:4, E:5, F:2}, no cells',
  faceClosure.vertexIds.length === 4 &&
  faceClosure.edgeIds.length === 5 &&
  faceClosure.faceIds.length === 2 &&
  faceClosure.cellIds.length === 0);
check('§1 the validator accepts the region (connected through the shared edge)',
  validateLiftSelection(dissected, faceClosure) === null);
const faceRegion = liftSubComplex(dissected, facePicks);
const faceEntry = loadUniverseSnapshot(serializeSnapshot(faceRegion.shape, dissected.id));
check('§1 the region lifts as ONE sub-complex and lands PLACEABLE + SOURCE-TAGGED on the shelf (χ = 4−5+2 = 1, a disk of two triangles)',
  faceEntry.placeable === true &&
  faceEntry.source === dissected.id &&
  faceEntry.render.invariants.chi === 1 &&
  faceRegion.title === `2-entity region of ${dissected.name}`);
note(`multi-face concrete: {V:4, E:5, F:2} χ=1 · title "${faceRegion.title}" · source "${faceEntry.source.slice(0, 40)}…"`);

// ===== [2] a multi-CELL 3-region ==============================================
console.log('\n----- [2] multi-CELL region: the core + an adjacent residue -----');
const core = dissected.cells.find((c) => c.kind === 'core');
const residue = dissected.cells.find((c) => c.kind === 'residue');
const cellRegion = liftSubComplex(dissected, [
  { kind: 'cell', id: core.id },
  { kind: 'cell', id: residue.id },
]);
const cellEntry = loadUniverseSnapshot(serializeSnapshot(cellRegion.shape, dissected.id));
check('§2 two cells lift as ONE sub-complex (cells:2, their shared face carried once) and load placeable',
  cellRegion.shape.cells.length === 2 &&
  cellEntry.placeable === true &&
  new Set(cellRegion.shape.faces.map((f) => f.id)).size === cellRegion.shape.faces.length);
note(`multi-cell concrete: {V:${Object.keys(cellRegion.shape.vertices).length}, E:${cellRegion.shape.edges.length}, F:${cellRegion.shape.faces.length}, cells:2}`);

// ===== [3] multi-EDGE path + cycle ============================================
console.log('\n----- [3] multi-EDGE regions: a path and a cycle -----');
const e0 = dissected.edges[0];
const e1 = dissected.edges.find(
  (e) => e.id !== e0.id && e.vertexIds.some((v) => e0.vertexIds.includes(v)),
);
const pathRegion = liftSubComplex(dissected, [
  { kind: 'edge', id: e0.id },
  { kind: 'edge', id: e1.id },
]);
const pathEntry = loadUniverseSnapshot(serializeSnapshot(pathRegion.shape, dissected.id));
check('§3 an edge PATH (two edges sharing a vertex) lifts {V:3, E:2, F:0} — the honest skeleton, placeable',
  Object.keys(pathRegion.shape.vertices).length === 3 &&
  pathRegion.shape.edges.length === 2 &&
  pathEntry.placeable === true &&
  pathEntry.render.mode === 'skeleton');
// a cycle: the three boundary edges of a triangle face
const tri = adjacent[0];
const triSides = tri.vertexIds.map((v, i) => [v, tri.vertexIds[(i + 1) % tri.vertexIds.length]]);
const cycleEdges = triSides.map(([a, b]) =>
  dissected.edges.find(
    (e) =>
      (e.vertexIds[0] === a && e.vertexIds[1] === b) ||
      (e.vertexIds[0] === b && e.vertexIds[1] === a),
  ),
);
check('§3 fixture: the triangle face has all three boundary edge records', cycleEdges.every(Boolean));
const cycleRegion = liftSubComplex(dissected, cycleEdges.map((e) => ({ kind: 'edge', id: e.id })));
const cycleEntry = loadUniverseSnapshot(serializeSnapshot(cycleRegion.shape, dissected.id));
check('§3 an edge CYCLE (a triangle boundary, no face) lifts {V:3, E:3, F:0} — χ = 0, the loop as a skeleton, placeable',
  Object.keys(cycleRegion.shape.vertices).length === 3 &&
  cycleRegion.shape.edges.length === 3 &&
  cycleRegion.shape.faces.length === 0 &&
  cycleEntry.placeable === true);

// ===== [4] disconnected → refused, not broken =================================
console.log('\n----- [4] a DISCONNECTED pick refuses honestly -----');
let apart = null;
outer2: for (const fa of dissected.faces) {
  for (const fb of dissected.faces) {
    if (fa.id !== fb.id && sharedCount(fa, fb) === 0) { apart = [fa, fb]; break outer2; }
  }
}
check('§4 fixture: two faces sharing NO vertex exist', Boolean(apart));
const apartPicks = [
  { kind: 'face', id: apart[0].id },
  { kind: 'face', id: apart[1].id },
];
const apartClosure = downwardClosure(dissected, apartPicks);
const apartReason = validateLiftSelection(dissected, apartClosure);
check("§4 the validator returns the honest reason — 'disconnected (2 components) — lift components separately'",
  typeof apartReason === 'string' && /disconnected \(2 components\)/.test(apartReason) && /lift components separately/.test(apartReason));
let apartThrew = false;
try {
  liftSubComplex(dissected, apartPicks);
} catch (error) {
  apartThrew = /disconnected/.test(String(error.message));
}
check('§4 the lift REFUSES the disconnected pick loudly (never a broken lift)', apartThrew);

// ===== [5] the REAL store: toggle → set lift → clear → fallback ===============
console.log('\n----- [5] the real store: toggle semantics, set lift, clear, fallback -----');
useGeometryStore.getState().applyOperationToSelection('ambo-dissection');
const live = useGeometryStore.getState().shapes[useGeometryStore.getState().currentShapeId];
const liveBytes = JSON.stringify(live);
let livePair = null;
outer3: for (const fa of live.faces) {
  for (const fb of live.faces) {
    if (fa.id !== fb.id && sharedCount(fa, fb) === 2) { livePair = [fa, fb]; break outer3; }
  }
}
useGeometryStore.getState().toggleLiftSelection({ kind: 'face', id: livePair[0].id });
useGeometryStore.getState().toggleLiftSelection({ kind: 'face', id: livePair[1].id });
check('§5 toggling two faces builds the set', useGeometryStore.getState().liftSelection.length === 2);
useGeometryStore.getState().toggleLiftSelection({ kind: 'face', id: livePair[1].id });
check('§5 toggling an entity AGAIN removes it (in/out semantics)',
  useGeometryStore.getState().liftSelection.length === 1 &&
  useGeometryStore.getState().liftSelection[0].id === livePair[0].id);
useGeometryStore.getState().toggleLiftSelection({ kind: 'face', id: livePair[1].id });
// R1.2: the channel RETAINS its items (no destructive drain) — a witness
// measures ITS OWN pushes from the watermark, never by clearing the channel.
const liftWatermark = useLiftStore.getState().queue.length;
const regionTitle = useGeometryStore.getState().liftSelectionToManuscript();
const pushed = useLiftStore.getState().queue.slice(liftWatermark);
check("§5 the SET lifts through the real action as '2-entity region of …', reaches the channel, and loads placeable",
  regionTitle === `2-entity region of ${live.name}` &&
  pushed.length === 1 &&
  loadUniverseSnapshot(pushed[0].file).placeable === true);
check('§5 the set CLEARS after a successful lift', useGeometryStore.getState().liftSelection.length === 0);
check('§5 the ambo original is byte-unchanged by the region lift',
  JSON.stringify(useGeometryStore.getState().shapes[live.id]) === liveBytes);
// the committed single-entity FALLBACK (empty set → inspection selection)
const liveCore = live.cells.find((c) => c.kind === 'core');
useGeometryStore.getState().selectCell(liveCore.id);
const fallbackWatermark = useLiftStore.getState().queue.length; // R1.2 watermark idiom
const fallbackTitle = useGeometryStore.getState().liftSelectionToManuscript();
const fallbackPushed = useLiftStore.getState().queue.slice(fallbackWatermark);
check("§5 NO REGRESSION: with an empty set, the single inspection-selected cell still lifts ('cell of …' — the committed P1b path)",
  fallbackTitle === `cell of ${live.name}` &&
  fallbackPushed.length === 1 &&
  loadUniverseSnapshot(fallbackPushed[0].file).placeable === true);
// clear control
useGeometryStore.getState().toggleLiftSelection({ kind: 'vertex', id: Object.keys(live.vertices)[0] });
useGeometryStore.getState().clearLiftSelection();
check('§5 clearLiftSelection empties the set', useGeometryStore.getState().liftSelection.length === 0);
// mixed kinds compose into one region — a residue face that TOUCHES the core
// (shares a mid-edge vertex) plus one of its vertices
const coreVertexSet = new Set(core.vertexIds);
const touchingFace = dissected.faces.find(
  (f) => !core.faceIds.includes(f.id) && f.vertexIds.some((v) => coreVertexSet.has(v)),
);
const mixed = liftSubComplex(dissected, [
  { kind: 'cell', id: core.id },
  { kind: 'face', id: touchingFace.id },
  { kind: 'vertex', id: touchingFace.vertexIds[0] },
]);
const mixedEntry = loadUniverseSnapshot(serializeSnapshot(mixed.shape, dissected.id));
check('§5 MIXED kinds (cell + face + vertex) compose into one connected region and lift placeable',
  mixedEntry.placeable === true && mixed.title === `3-entity region of ${dissected.name}`);

console.log(
  failures === 0
    ? '\n--- multi-region lift (pick a set → auto-close → gate on connectivity → one lifted sub-complex): no failures ---\n\nALL PASS'
    : `\n--- multi-region lift: ${failures} FAILURE(S) ---`,
);
process.exitCode = failures === 0 ? 0 : 1;
