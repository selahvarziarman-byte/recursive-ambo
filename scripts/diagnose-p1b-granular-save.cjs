#!/usr/bin/env node

// DIAGNOSTIC — P1b: the granular ambo→manuscript save (ADR 0010 at the grain
// of a single entity).
//
//   §1 each ATOMIC entity type lifts (cell / face / edge / vertex): downward
//      closure → self-contained sub-Shape → the COMMITTED serializeSnapshot →
//      the COMMITTED loadUniverseSnapshot → a placeable, SOURCE-TAGGED shelf
//      entry (parentShapeId re-rooted to null; cells + generations namespaced
//      by the P1b deserialize extension).
//   §2 the Q4 re-root contract: lineage refs are retained VERBATIM at
//      extraction; on load, EXTERNAL refs (the un-lifted ambo ancestors)
//      resolve — through the committed `primalMultiset` — to SOURCE-TAGGED
//      PRIMAL roots (`<amboId>:<externalId>`), the committed mechanism doing
//      the re-rooting (nothing re-invented).
//   §3 the precondition ENFORCES connected + downward-closed (honest
//      refusals) — and a JUNCTION-carrying region (two faces wedged at one
//      vertex) LIFTS ANYWAY (soundness is NOT a lift gate).
//   §4 the ambo original is BYTE-UNCHANGED by every lift.
//   §5 the REAL store path end-to-end: geometryStore.liftSelectionToManuscript
//      → the lift channel → the committed shelf ingestion; and the committed
//      whole-form snapshot path still loads (no regression; 2D forms are
//      byte-unaffected by the deserialize extension).
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
  extractSubShape,
  liftSubComplex,
} = req('src/lib/subComplexLift.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const { primalMultiset } = req('src/lib/lineage.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const setEq = (a, b) => eq([...a].sort(), [...b].sort());

console.log('P1b granular save: lift → self-contained sub-Shape → committed snapshot → shelf\n');

// ===== the fixture: a REAL dissected ambo shape ==============================
const seed = createSeedShape('tetrahedron');
const dissectOp = getOperation('ambo-dissection');
const dissected = dissectOp.execute({ shape: seed, selectedCellId: null, selectedCell: null });
const dissectedBytes = JSON.stringify(dissected);
const coreCell = dissected.cells.find((c) => c.kind === 'core');
note(`fixture: ${dissected.name} — V=${Object.keys(dissected.vertices).length} E=${dissected.edges.length} F=${dissected.faces.length} cells=${dissected.cells.length} (core: ${coreCell.topology})`);

// the sub-shape must be SELF-CONTAINED structurally
function structurallySelfContained(shape) {
  const vs = new Set(Object.keys(shape.vertices));
  const fids = new Set(shape.faces.map((f) => f.id));
  return (
    shape.edges.every((e) => e.vertexIds.every((v) => vs.has(v))) &&
    shape.faces.every((f) => f.vertexIds.every((v) => vs.has(v))) &&
    shape.cells.every(
      (c) =>
        c.vertexIds.every((v) => vs.has(v)) &&
        c.faceIds.every((id) => fids.has(id)) &&
        (c.parentCellId === null || shape.cells.some((x) => x.id === c.parentCellId)),
    ) &&
    shape.generations.every((g) => g.createdVertexIds.every((v) => vs.has(v)))
  );
}

// ===== [1] each atomic entity type lifts, end to end =========================
console.log('----- [1] the four atomic lifts (cell / face / edge / vertex) -----');

// --- CELL: the octahedron core -----------------------------------------------
const cellLift = liftSubComplex(dissected, [{ kind: 'cell', id: coreCell.id }]);
check('§1 CELL lift: the core cell extracts SELF-CONTAINED with its full downward closure',
  structurallySelfContained(cellLift.shape) && cellLift.shape.cells.length === 1);
check('§1 CELL lift: the octahedron closure counts — {V:6, E:12, F:8, cells:1} (χ of the shell = 2)',
  Object.keys(cellLift.shape.vertices).length === 6 &&
  cellLift.shape.edges.length === 12 &&
  cellLift.shape.faces.length === 8 &&
  Object.keys(cellLift.shape.vertices).length - cellLift.shape.edges.length + cellLift.shape.faces.length === 2);
check("§1 CELL lift: the un-lifted parent cell is re-rooted (parentCellId null); genealogy = the committed patch-lift convention (parent edge to the ambo, NON-CONSUMING)",
  cellLift.shape.cells[0].parentCellId === null &&
  cellLift.shape.genealogy.parentShapeId === dissected.id &&
  cellLift.shape.genealogy.operation === 'patch-lift' &&
  cellLift.shape.genealogy.generationDepth === dissected.genealogy.generationDepth + 1);
const cellFile = serializeSnapshot(cellLift.shape, dissected.id);
const cellEntry = loadUniverseSnapshot(cellFile);
check('§1 CELL lift: loads onto the shelf PLACEABLE and SOURCE-TAGGED with the ambo id; parentShapeId re-rooted to null',
  cellEntry.placeable === true &&
  cellEntry.source === dissected.id &&
  cellEntry.loaded.shape.genealogy.parentShapeId === null);
check('§1 CELL lift: the loaded copy is fully NAMESPACED — vertices, cell refs AND generations carry the source prefix (the P1b deserialize extension)',
  Object.keys(cellEntry.loaded.shape.vertices).every((v) => v.startsWith(`${dissected.id}:`)) &&
  cellEntry.loaded.shape.cells.every((c) => c.vertexIds.every((v) => v.startsWith(`${dissected.id}:`)) && c.sourceVertexIds.every((v) => v.startsWith(`${dissected.id}:`))) &&
  cellEntry.loaded.shape.generations.every((g) => g.createdVertexIds.every((v) => v.startsWith(`${dissected.id}:`))));
check('§1 CELL lift: the shelf render is honest — plain ink, certified χ = 2 (the closed octahedron shell)',
  cellEntry.render !== null && cellEntry.render.mode === 'plain' && cellEntry.render.invariants.chi === 2);
const placedCell = placeShelfEntry(cellEntry, 7);
check('§1 CELL lift: places as a WrittenForm operand whose provenance names the source universe',
  placedCell.title === `${cellLift.title} — loaded` && placedCell.provenance.includes(dissected.id));
note(`CELL concrete: {V:6, E:12, F:8, cells:1} · source tag "${cellEntry.source.slice(0, 48)}…" · provenance: ${placedCell.provenance.slice(0, 72)}…`);

// --- FACE ---------------------------------------------------------------------
// GRAIN-FREE subject (SEAL_THE_LIFT_IDENTITY_AND_GRAIN recut): a lifted
// COARSE entity now CARRIES its collinear finer cells (the cured closure —
// diagnose-argument-card §10 owns that truth); the exact-count clauses here
// keep their original claim on faces/edges with no seed-to-seed side.
const isSeedV = (v) => Boolean(seed.vertices[v]);
const someFace = dissected.faces.find(
  (f) =>
    f.vertexIds.length === 3 &&
    f.vertexIds.every((v, i) => !(isSeedV(v) && isSeedV(f.vertexIds[(i + 1) % f.vertexIds.length]))),
);
const faceLift = liftSubComplex(dissected, [{ kind: 'face', id: someFace.id }]);
const faceFile = serializeSnapshot(faceLift.shape, dissected.id);
const faceEntry = loadUniverseSnapshot(faceFile);
check('§1 FACE lift: a triangle lifts {V:3, E:3, F:1} — a disk, χ = 1 — placeable + source-tagged',
  Object.keys(faceLift.shape.vertices).length === 3 &&
  faceLift.shape.edges.length === 3 &&
  faceLift.shape.faces.length === 1 &&
  faceEntry.placeable === true &&
  faceEntry.render.invariants.chi === 1 &&
  faceEntry.source === dissected.id);

// --- EDGE ---------------------------------------------------------------------
// a grain-free edge (a half-/mid-edge carries nothing collinear on itself)
const someEdge = dissected.edges.find((e) => !(isSeedV(e.vertexIds[0]) && isSeedV(e.vertexIds[1])));
const edgeLift = liftSubComplex(dissected, [{ kind: 'edge', id: someEdge.id }]);
const edgeEntry = loadUniverseSnapshot(serializeSnapshot(edgeLift.shape, dissected.id));
check('§1 EDGE lift: {V:2, E:1, F:0} — loads as the honest SKELETON render (no faces), placeable',
  Object.keys(edgeLift.shape.vertices).length === 2 &&
  edgeLift.shape.edges.length === 1 &&
  edgeLift.shape.faces.length === 0 &&
  edgeEntry.placeable === true &&
  edgeEntry.render.mode === 'skeleton');

// --- VERTEX -------------------------------------------------------------------
const someVertexId = Object.keys(dissected.vertices)[0];
const vertexLift = liftSubComplex(dissected, [{ kind: 'vertex', id: someVertexId }]);
const vertexEntry = loadUniverseSnapshot(serializeSnapshot(vertexLift.shape, dissected.id));
check('§1 VERTEX lift: the trivial closure {V:1, E:0, F:0} — loads placeable (skeleton)',
  Object.keys(vertexLift.shape.vertices).length === 1 &&
  vertexLift.shape.edges.length === 0 &&
  vertexEntry.placeable === true &&
  vertexEntry.render.mode === 'skeleton');

// ===== [2] the Q4 re-root: verbatim lineage → source-tagged primals ==========
console.log('\n----- [2] the Q4 re-root (internal verbatim; external → source-tagged primals) -----');
const originalCoreVertex = dissected.vertices[Object.keys(cellLift.shape.vertices)[0]];
const liftedCoreVertex = cellLift.shape.vertices[originalCoreVertex.id];
check('§2 at extraction, LINEAGE is retained VERBATIM (createdBy byte-equal to the ambo original)',
  eq(liftedCoreVertex.createdBy, originalCoreVertex.createdBy));
const externalSources = liftedCoreVertex.createdBy.sourceVertexIds.filter(
  (id) => !cellLift.shape.vertices[id],
);
check('§2 the probe vertex carries EXTERNAL lineage (its ambo ancestors were not lifted)',
  externalSources.length > 0);
const loadedProbeId = `${dissected.id}:${originalCoreVertex.id}`;
const memo = new Map();
const primals = primalMultiset(loadedProbeId, cellEntry.loaded.shape, memo);
check('§2 ON LOAD the committed primalMultiset re-roots them: every primal of the loaded probe is a SOURCE-TAGGED root `<amboId>:<externalId>`',
  primals.size === externalSources.length &&
  setEq([...primals.keys()], externalSources.map((id) => `${dissected.id}:${id}`)));
note(`re-root concrete: ${originalCoreVertex.id} ← ${JSON.stringify(externalSources)} → primals ${JSON.stringify([...primals.keys()].map((k) => '…:' + k.split(':').slice(-1)[0]))}`);

// ===== [3] the precondition + the NOT-a-gate ==================================
console.log('\n----- [3] connected + downward-closed ENFORCED; soundness NOT gated -----');
const coreClosure = downwardClosure(dissected, [{ kind: 'cell', id: coreCell.id }]);
check('§3 a downwardClosure output passes the validator (by construction)',
  validateLiftSelection(dissected, coreClosure) === null);
const gapped = { ...coreClosure, faceIds: coreClosure.faceIds.slice(1) };
const gappedReason = validateLiftSelection(dissected, gapped);
check('§3 a NON-DOWNWARD-CLOSED set refuses honestly (a cell without one of its faces)',
  typeof gappedReason === 'string' && /not downward-closed/.test(gappedReason));
let extractRefused = false;
try {
  extractSubShape(dissected, gapped, 'gapped');
} catch (error) {
  extractRefused = /not downward-closed/.test(String(error.message));
}
check('§3 extractSubShape re-checks the precondition and refuses the same set loudly', extractRefused);
const vertexIds = Object.keys(dissected.vertices);
const farApart = vertexIds.filter((v) => {
  return !dissected.edges.some((e) => e.vertexIds.includes(v) && e.vertexIds.includes(vertexIds[0]));
});
const disconnected = { cellIds: [], faceIds: [], edgeIds: [], vertexIds: [vertexIds[0], farApart[farApart.length - 1]] };
const discoReason = validateLiftSelection(dissected, disconnected);
check("§3 a DISCONNECTED set refuses honestly — '…lift components separately'",
  typeof discoReason === 'string' && /disconnected/.test(discoReason) && /lift components separately/.test(discoReason));
// the junction wedge: two faces sharing exactly ONE vertex — lifts ANYWAY
// grain-free wedge faces (no coarse side) — the {V:5, E:6, F:2} shape of the
// closure is the claim; a coarse side would honestly carry its grain and the
// counts would speak a different (equally honest) sentence
const wedgeGrainFree = (f) =>
  f.vertexIds.every((v, i) => !(isSeedV(v) && isSeedV(f.vertexIds[(i + 1) % f.vertexIds.length])));
let wedgePair = null;
outer: for (const fa of dissected.faces) {
  for (const fb of dissected.faces) {
    if (fa.id === fb.id || !wedgeGrainFree(fa) || !wedgeGrainFree(fb)) continue;
    const shared = fa.vertexIds.filter((v) => fb.vertexIds.includes(v));
    if (shared.length === 1) { wedgePair = [fa, fb, shared[0]]; break outer; }
  }
}
check('§3 fixture: the dissected shape has two faces sharing exactly one vertex (a wedge/junction region)', Boolean(wedgePair));
const wedgeClosure = downwardClosure(dissected, [
  { kind: 'face', id: wedgePair[0].id },
  { kind: 'face', id: wedgePair[1].id },
]);
check('§3 the wedge closure passes the precondition (connected through the shared vertex; downward-closed)',
  validateLiftSelection(dissected, wedgeClosure) === null);
const wedgeLift = extractSubShape(dissected, wedgeClosure, 'wedge region');
const wedgeEntry = loadUniverseSnapshot(serializeSnapshot(wedgeLift.shape, dissected.id));
check('§3 the JUNCTION-carrying region LIFTS ANYWAY and loads placeable — soundness is an instrument downstream, never a lift gate',
  wedgeEntry.placeable === true &&
  Object.keys(wedgeLift.shape.vertices).length === 5 &&
  wedgeLift.shape.faces.length === 2);
note(`wedge concrete: two triangles at "${wedgePair[2].slice(0, 24)}" → {V:5, E:6, F:2} χ=${5 - 6 + 2} — lifted, not gated`);

// ===== [4] the ambo original is never mutated =================================
console.log('\n----- [4] the ambo original: byte-unchanged after every lift -----');
check('§4 the dissected source shape is BYTE-IDENTICAL after cell/face/edge/vertex/wedge lifts + serializations',
  JSON.stringify(dissected) === dissectedBytes);

// ===== [5] the REAL store path + no regression =================================
console.log('\n----- [5] the real store action → channel → shelf ingestion; committed paths intact -----');
useGeometryStore.getState().applyOperationToSelection('ambo-dissection');
const storeShape = useGeometryStore.getState().shapes[useGeometryStore.getState().currentShapeId];
const storeCore = storeShape.cells.find((c) => c.kind === 'core');
useGeometryStore.getState().selectCell(storeCore.id);
const liftedTitle = useGeometryStore.getState().liftSelectionToManuscript();
const queued = useLiftStore.getState().queue;
check('§5 geometryStore.liftSelectionToManuscript pushes ONE item onto the channel with the honest title — named by WHICH entity (`<cellId> of …`, the distinct-id mint; SLICE2 un-doubled the kind: the entity id already carries it)',
  queued.length === 1 && queued[0].title === liftedTitle && liftedTitle === `${storeCore.id} of ${storeShape.name}`);
// R1.2 (the fresh-session drain): the channel RETAINS its items — no
// destructive drain exists; consumers ingest IDEMPOTENTLY by the item's own
// monotone `key`. The old "hands over exactly once" law is REPLACED by this.
const retained = useLiftStore.getState().queue;
check('§5 R1.2: the channel RETAINS the pushed item (no drain in the protocol; `key` is the idempotence token — monotone, positive)',
  retained.length === 1 && retained[0].key > 0 && useLiftStore.getState().queue.length === 1);
const retainedEntry = loadUniverseSnapshot(retained[0].file);
check('§5 the retained file loads through the COMMITTED shelf ingestion — placeable, source = the live ambo shape id',
  retainedEntry.placeable === true && retainedEntry.source === storeShape.id);
check('§5 the live store shape is unmutated by its lift',
  JSON.stringify(useGeometryStore.getState().shapes[storeShape.id]) === JSON.stringify(storeShape));
// no selection → the action refuses honestly
useGeometryStore.getState().selectCell(null);
let refusedNoSelection = false;
try {
  useGeometryStore.getState().liftSelectionToManuscript();
} catch (error) {
  // stem-match, not full-copy: this is a BEHAVIOUR test (the lift refuses with a
  // select-something message), never a copy pin — GAP2A PARITY correctly extended
  // "…a vertex" → "…a vertex, or an edge" and the old full-string regex went RED
  // (a diagnostic pinning person-facing copy; recut to the stable stem, L19).
  refusedNoSelection = /select a cell/.test(String(error.message));
}
check('§5 with nothing selected the lift refuses honestly (the UI disables; misuse throws)', refusedNoSelection);
// committed whole-form path: a 2D form round-trips byte-unaffected by the extension
const square = loadForm(nGon(4), 'p1b');
const squareEntry = loadUniverseSnapshot(serializeSnapshot(square, 'someuniverse'));
check('§5 NO REGRESSION: a committed whole-form 2D snapshot still loads placeable (cells/generations empty — byte-unaffected by the extension)',
  squareEntry.placeable === true &&
  squareEntry.loaded.shape.cells.length === 0 &&
  squareEntry.loaded.shape.generations.length === 0);
const squareLoaded = deserializeSnapshot(serializeSnapshot(square, 'someuniverse'));
check('§5 the deserialize extension adds nothing to a 2D form (same keys, empty arrays verbatim)',
  eq(Object.keys(squareLoaded.shape).sort(), Object.keys(square).sort()));

console.log(
  failures === 0
    ? '\n--- P1b granular save (lift → re-root → committed snapshot → shelf): no failures ---\n\nALL PASS'
    : `\n--- P1b granular save: ${failures} FAILURE(S) ---`,
);
process.exitCode = failures === 0 ? 0 : 1;
