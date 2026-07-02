#!/usr/bin/env node

// DIAGNOSTIC — route-B patch-lift: the lineage-preserving sub-region → surface
// constructor (engineer mandate route-b-patch-lift; researcher ruling
// RESEARCHER_RULING_ROUTE_B_LINEAGE_CARRIAGE; charter
// RELAY_MOTHERSHIP_TO_ENGINEER_ZOO_UNBLOCKED_ROUTE_B).
//
// BLIND BUILD: the structural rules and the teeth are ASSERTED; the specific
// numbers — the boundary cycle length n, the retained/merged primal keys, χ, w₁ —
// are MEASURED through the real committed modules and PRINTED, never asserted
// against expected values here. The engineer's off-repo seal (SHA-256 committed
// on-repo) is checked against these printed measurements at unseal.
//
// Canonical example: source = ambo-dissected tetrahedron, centre = an interior
// X_K midpoint (lexicographically-smallest interior site — deterministic).
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

const { patchLift } = req('src/lib/patchLift.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { buildIncidenceTraceRegistry } = req('src/lib/incidenceTraceRegistry.ts');
const { primalMultiset, primalMultisetKey } = req('src/lib/lineage.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { globalW1Class } = req('src/lib/globalW1.ts');
const { buildGenealogyDag, seamSign } = req('src/lib/genealogyDag.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const keyOf = (id, shape) => primalMultisetKey(primalMultiset(id, shape, new Map()));
const multisetUnion = (a, b) => {
  const m = new Map(a);
  for (const [k, c] of b) m.set(k, (m.get(k) ?? 0) + c);
  return m;
};

// ---- the canonical example (real committed constructors only) ----
const T = createSeedShape('tetrahedron');
const S = applyAmboDissection(T);
const tSnapshot = JSON.stringify(T);
const sSnapshot = JSON.stringify(S);

const registry = buildIncidenceTraceRegistry(S);
const interiorSiteIds = registry.sites
  .filter((s) => s.glueCoh.valence === 'interior')
  .map((s) => s.scopedVertexId)
  .sort();
const center = interiorSiteIds[0];
const centerSite = registry.sites.find((s) => s.scopedVertexId === center);

const lift = patchLift(S, center);
const L = lift.shape;
const n = lift.boundaryCycle.length;
const patchIds = [center, ...lift.boundaryCycle];

console.log('Example: S = ambo-dissection(tetrahedron); L = patchLift(S, centre = interior X_K midpoint)\n');
console.log(`source S: id=${S.id} depth=${S.genealogy.generationDepth}`);
console.log(`centre:   ${center}`);
console.log(`lifted L: id=${L.id} vertices=${Object.keys(L.vertices).length} edges=${L.edges.length} faces=${L.faces.length}`);

// ===== [1] the disk precondition + the MEASURED boundary cycle =====
console.log('\n----- [1] DISK PRECONDITION + BOUNDARY CYCLE (n measured, blind) -----');
check('§5.1 chosen centre link valence === interior (decomposeLink disk gate)', centerSite.glueCoh.valence === 'interior');
check('§5.1 boundary cycle is a simple cycle covering the whole link', new Set(lift.boundaryCycle).size === n && n === centerSite.glueCoh.linkVertexCount);
note(`MEASURED boundary cycle length n = ${n}`);
note(`MEASURED boundary cycle (walk order) = ${JSON.stringify(lift.boundaryCycle)}`);

// ===== [2] axis 1 — RETAINED vertex-primal descent (no re-seeding) =====
console.log('\n----- [2] AXIS-1 RETAINED (createdBy carried verbatim; keys measured, blind) -----');
const carriedIds = patchIds.filter((id) => Boolean(L.vertices[id]));
check(
  '§5.2 every carried patch vertex retains createdBy.sourceVertexIds verbatim from S',
  carriedIds.length > 0 &&
    carriedIds.every((id) => eq(L.vertices[id].createdBy.sourceVertexIds, S.vertices[id].createdBy.sourceVertexIds)),
);
check(
  '§5.2 every carried patch vertex retains its birth operation (not re-stamped to seed)',
  carriedIds.every((id) => L.vertices[id].createdBy.operation === S.vertices[id].createdBy.operation),
);
check('§5.2 centre primalMultisetKey identical over L and over S (descent preserved)', keyOf(center, L) === keyOf(center, S));
note(`carried into L verbatim: ${JSON.stringify(carriedIds)}`);
for (const id of patchIds) note(`MEASURED primalMultisetKey over S — ${id}: ${keyOf(id, S)}`);

// ===== [3] axis 1 — the CARRIED-NOT-MINTED boundary merge (union, not representative) =====
console.log('\n----- [3] AXIS-1 UNION MERGE (carried-not-minted; pairing + keys measured, blind) -----');
note(`pairing: ${lift.pairing.name}`);
check('§5.3 pairing has n/2 pairs and consumes every boundary vertex', lift.pairing.pairs.length === n / 2 && lift.boundaryCycle.every((b) => !L.vertices[b]));
const mergedChildIds = L.genealogy.createdVertexIds;
check('§5.3 exactly n/2 merged children minted', mergedChildIds.length === n / 2);
for (let k = 0; k < lift.pairing.pairs.length; k += 1) {
  const [a, b] = lift.pairing.pairs[k];
  const childId = mergedChildIds[k];
  const child = L.vertices[childId];
  const withinL = primalMultiset(childId, L, new Map());
  const expectedKey = [a, b]
    .sort()
    .map((x) => `${x}×1`)
    .join('|');
  check(`§5.3 pair ${k}: ledger pull-back of "${childId}" === its two identified parents`, eq([...lift.ledger.pullBack[childId]].sort(), [a, b].sort()));
  check(`§5.3 pair ${k}: child createdBy.sourceVertexIds === [both parents] (carried, assemble-style)`, eq([...child.createdBy.sourceVertexIds].sort(), [a, b].sort()));
  check(`§5.3 pair ${k}: primalMultiset over L === union of the two parents (no representative dropped)`, primalMultisetKey(withinL) === expectedKey);
  check(`§5.3 pair ${k}: MINTS no fresh primal (child ∉ its own multiset)`, !withinL.has(childId));
  const throughS = multisetUnion(primalMultiset(a, S, new Map()), primalMultiset(b, S, new Map()));
  check(`§5.3 pair ${k}: through-S root union carries no minted id`, !throughS.has(childId) && [...throughS.keys()].every((r) => Boolean(S.vertices[r])));
  note(`MEASURED pair ${k}: {${a}, ${b}} -> ${childId}`);
  note(`MEASURED pair ${k}: merged key over L = ${primalMultisetKey(withinL)}`);
  note(`MEASURED pair ${k}: through-S root union = ${primalMultisetKey(throughS)}`);
}

// ===== [4] axis 2 — SINGLE-PARENT shape genealogy + DAG integration =====
console.log('\n----- [4] AXIS-2 GENEALOGY (single-parent patch-lift birth) -----');
check('§5.4 L.genealogy.parentShapeId === S.id', L.genealogy.parentShapeId === S.id);
check("§5.4 L.genealogy.operation === 'patch-lift'", L.genealogy.operation === 'patch-lift');
check('§5.4 L.genealogy.generationDepth === S.depth + 1', L.genealogy.generationDepth === S.genealogy.generationDepth + 1);
check('§5.4 (T3) parentShapeId !== null — NOT an assemble-clone root', L.genealogy.parentShapeId !== null);

// w₁ measured FIRST (blind) so the DAG's orientation reading is derived, not assumed.
const w1cert = globalW1Class(lift.complex);
const w1Bit = w1cert.nonOrientable ? 1 : 0;
const dag = buildGenealogyDag([T, S, L], { orientation: { [L.id]: { w1: w1Bit } } });
const lNode = dag.nodes.find((node) => node.id === L.id);
const slEdge = dag.edges.find((edge) => edge.parent === S.id && edge.child === L.id);
check('§5.4 DAG integrity ACCEPTED over [T, S, L] (acyclic && lineage ⊆ parents)', dag.integrity.accepted === true);
check('§5.4 DAG recovers L.parents === [S] (single parent, read forward)', eq(lNode.parents, [S.id]));
check("§5.4 DAG edge S->L carries operation === 'patch-lift'", Boolean(slEdge) && slEdge.operation === 'patch-lift');
check('§5.4 patch-lift is registered in the merge-birth family: edge S->L carries U === seamSign(w1)', slEdge.U === seamSign(w1Bit));
note(`DAG: L.depth=${lNode.depth} parents=${JSON.stringify(lNode.parents)} edge U=${slEdge.U} (w1 bit=${w1Bit}, derived)`);

// ===== [5] manifold soundness + the MEASURED invariants =====
console.log('\n----- [5] MANIFOLD SOUNDNESS + INVARIANTS (χ, w₁ measured, blind) -----');
check('§5.5 every vertex link of L is single-component interior post-glue', lift.links.length > 0 && lift.links.every((l) => l.valence === 'interior' && l.decomposition.strata.length === 1 && !l.decomposition.pinch));
check('§5.5 one link per lifted vertex', lift.links.length === Object.keys(L.vertices).length);
check('§5.5 complex/cellCounts consistent (same identified cells)', lift.complex.vertices.length === lift.cellCounts.v && lift.complex.edges.length === lift.cellCounts.e && lift.complex.faces.length === lift.cellCounts.f);
check('§5.5 χ === v − e + f over the REAL identified cells', lift.chi === lift.cellCounts.v - lift.cellCounts.e + lift.cellCounts.f);
check('§5.5 w₁ certificate is non-degenerate (subdivided representation)', w1cert.nonDegenerate === true);
note(`MEASURED per-vertex link valences: ${JSON.stringify(lift.links.map((l) => `${l.vertexId}:${l.valence}`))}`);
note(`MEASURED cellCounts = ${JSON.stringify(lift.cellCounts)} -> χ = ${lift.chi}`);
note(`MEASURED globalW1Class: b₁=${w1cert.b1} w1Class=${JSON.stringify(w1cert.w1Class)} nonOrientable=${w1cert.nonOrientable}`);

// ===== [6] TEETH — each wrong mechanism must be REJECTED / provably different =====
console.log('\n----- [6] TEETH (must BITE) -----');

// T1 — the loadForm/FormSpec round-trip STRIPS lineage (the rejected v0 mechanism).
const patchBuilder = () => ({
  name: 'patch-roundtrip',
  vertices: patchIds.map((id) => ({ id, position: S.vertices[id].position })),
  faces: centerSite.readings.map((r) => ({ vertexIds: [...r.medialCycle] })),
});
const stripped = loadForm(patchBuilder, '');
check(
  "T1 loadForm re-stamps every patch vertex to operation 'seed' with NO sources",
  patchIds.every((id) => stripped.vertices[id].createdBy.operation === 'seed' && stripped.vertices[id].createdBy.sourceVertexIds.length === 0),
);
check('T1 stripped keys collapse to self×1', patchIds.every((id) => keyOf(id, stripped) === `${id}×1`));
check('T1 route-B retained keys DIFFER from the stripped ones (every patch vertex)', patchIds.every((id) => keyOf(id, S) !== keyOf(id, stripped)));
note(`T1 stripped centre key = ${keyOf(center, stripped)} ; route-B retained centre key = ${keyOf(center, S)}`);

// T2 — a bare union-find merge keeps ONE representative's descent; route-B keeps BOTH.
const [t2a, t2b] = lift.pairing.pairs[0];
const bareA = primalMultiset(t2a, S, new Map()); // what survives if a is kept as the representative
const bareB = primalMultiset(t2b, S, new Map()); // what survives if b is kept as the representative
const routeBUnion = multisetUnion(bareA, bareB);
const containsAll = (bigger, smaller) => [...smaller.entries()].every(([k, c]) => (bigger.get(k) ?? 0) >= c);
check('T2 route-B merged descent !== either single representative’s descent', primalMultisetKey(routeBUnion) !== primalMultisetKey(bareA) && primalMultisetKey(routeBUnion) !== primalMultisetKey(bareB));
check('T2 each bare representative is a STRICT sub-multiset of the route-B union (descent WOULD be dropped)', containsAll(routeBUnion, bareA) && containsAll(routeBUnion, bareB) && [...routeBUnion.keys()].some((k) => !bareA.has(k)) && [...routeBUnion.keys()].some((k) => !bareB.has(k)));
note(`T2 bare(rep=${t2a}) = ${primalMultisetKey(bareA)} ; bare(rep=${t2b}) = ${primalMultisetKey(bareB)} ; route-B union = ${primalMultisetKey(routeBUnion)}`);

// T3 — single-parent, NOT an assemble-clone root (asserted with §5.4 above; restated).
check('T3 L is single-parent (parentShapeId === S.id; a null root would be WRONG)', L.genealogy.parentShapeId === S.id && L.genealogy.parentShapeId !== null);

// T4 — a NON-DISK centre is REJECTED (no lift). Real committed material: a second
// ambo-dissection (of S's core cell) consumes the gen-1 midpoints' core fans, so
// their link valence is no longer 'interior'.
const coreCell = S.cells.find((cell) => cell.kind === 'core');
const S2 = applyAmboDissection(S, coreCell.id);
const reg2 = buildIncidenceTraceRegistry(S2);
const retiredId = reg2.sites
  .filter((s) => s.glueCoh.valence !== 'interior')
  .map((s) => s.scopedVertexId)
  .sort()[0];
const retiredValence = reg2.sites.find((s) => s.scopedVertexId === retiredId).glueCoh.valence;
let t4aRejected = false;
let t4aMessage = '';
try {
  patchLift(S2, retiredId);
} catch (error) {
  t4aRejected = true;
  t4aMessage = String(error.message);
}
check(`T4a real non-disk centre (valence '${retiredValence}') is REJECTED — no lift`, retiredValence !== 'interior' && t4aRejected && t4aMessage.includes('not a disk'));
note(`T4a centre ${retiredId} valence=${retiredValence} -> "${t4aMessage}"`);
let t4bRejected = false;
let t4bMessage = '';
try {
  patchLift(S, 'vertex:tetrahedron:a');
} catch (error) {
  t4bRejected = true;
  t4bMessage = String(error.message);
}
check('T4b a non-X_K centre (a seed corner — no core fan) is REJECTED — no lift', t4bRejected && t4bMessage.includes('not a disk'));
note(`T4b -> "${t4bMessage}"`);

// ===== discipline =====
console.log('\n----- discipline: derive-only, sources unmutated -----');
check('derive-only: S byte-unchanged after lift + teeth', JSON.stringify(S) === sSnapshot);
check('derive-only: T byte-unchanged', JSON.stringify(T) === tSnapshot);

console.log(
  `\n--- route-B patch-lift (disk gate, axis-1 retained + union merge, axis-2 single-parent, manifold + χ/w₁ measured, teeth): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
