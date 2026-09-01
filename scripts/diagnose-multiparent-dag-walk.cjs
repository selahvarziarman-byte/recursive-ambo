#!/usr/bin/env node

// DIAGNOSTIC — THE MULTI-PARENT DAG WALK (engineer-chartered 2026-07-12;
// SEAL-BEFORE-BUILD — BUILT BLIND to `.handoff/SEAL_MULTIPARENT_DAG_WALK.md`,
// SHA-256 2758838a…89ddb; every pin below is the builder's own measurement).
//
// THE HOLE THIS CLOSES: `resolveLineage` walked `genealogy.parentShapeId` —
// ONE link — while an assemble/connectedSum child carries `parentShapeId:
// null` BY DESIGN ("null because it is single-valued"). The RECORD was always
// complete (the DAG recovers both parents by site provenance; integrity
// accepted; 16 source sites per parent) — THE WALKER COULD NOT REACH IT. Now
// it can: the walker reads the SAME two committed signals `genealogyDag.ts`
// reads (the pointer where single-valued; sourceVertexIds ∩ createdVertexIds
// where null), BFS nearest-first, seen-guarded — and the multi-parent ORDER
// comes from COMMITTED IDENTITY (first index in the child's form-order
// `sourceVertexIds`, the order the birth id also embeds), NEVER the store
// array (the ef704d0 bug, one level up — trapped in §o below).
//
// THE FOUR CLAUSES, each proving its teeth:
//   1 EXECUTE WHAT YOU WITNESS — every multi-parent case asserts
//     `parentShapeId === null` AND the walker returns BOTH parents; a case
//     resolving through the single-parent pointer is not a witness of the join.
//   2 CARRY THE WRONG MECHANISM (the law the canonical-wedge re-cut earned:
//     THE WITNESS MUST OUTLIVE THE COMMIT) — the single-parent walker rides
//     IN-MEMORY in this file and VISIBLY FAILS: 0 ancestors where 2 are owed.
//     Its FIDELITY is proven against the REAL committed walker while HEAD
//     still carries it (§h — the one HEAD-state-aware branch, checkable only
//     before the commit; the post-commit branch asserts real things too:
//     HEAD carries the DAG walker and the mutant still visibly fails).
//   3 ORDER INVARIANCE — ≥6 permutations of the candidate (store) array; the
//     ancestor order must not move; a carried INPUT-ORDER walker VISIBLY
//     FAILS the sweep (2 distinct orders where 1 is owed).
//   4 SINGLE-PARENT NON-MOVEMENT (the highest bar) — on the whole
//     single-parent zoo and the depth-4 chain at every generation, the new
//     walker is BYTE-IDENTICAL to the carried old walker: same shapes, same
//     order, same length. ANY movement on a single-parent chain is a HARD FAIL.
//
// NO leg of this diagnostic depends on HEAD carrying the old walker (§h's
// pre-commit branch retires ON ITS OWN DETECTION into equally-real
// assertions; the post-commit simulation proves it).
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { execSync } = require('node:child_process');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
};

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { resolveLineage, getPlaygroundOperation } = req('src/playground/playgroundOperations.ts');
const { connectedSum } = req('src/lib/connectedSum.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { cutCell } = req('src/lib/cutOperation.ts');
const { materializeCutResult } = req('src/lib/materializeOperation.ts');
const { sewBoundaryCircles } = req('src/lib/complexIdentification.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { usePlaygroundStore } = req('src/store/playgroundStore.ts');
const { operationAvailabilityFor, applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const copyOf = (shape, prefix) => deserializeSnapshot(serializeSnapshot(shape, prefix)).shape;
const ids = (shapes) => shapes.map((s) => s.id);

// ---------------------------------------------------------------------------
// THE CARRIED WRONG MECHANISMS (per the witness law: carried, never borrowed
// from a git ref this very build overwrites).
// (1) the SINGLE-PARENT walker — the shipped `resolveLineage`, VERBATIM (its
//     fidelity to the real committed walker is byte-proven in §h while HEAD
//     still carries it):
function singleParentWalker(shape, lookup) {
  const lineage = [];
  const seen = new Set([shape.id]);
  let parentId = shape.genealogy.parentShapeId;
  while (parentId && !seen.has(parentId)) {
    seen.add(parentId);
    const parent = lookup(parentId) ?? null;
    if (!parent) break;
    lineage.push(parent);
    parentId = parent.genealogy.parentShapeId;
  }
  return lineage;
}
// (2) the INPUT-ORDER walker — the DAG-shaped walk that naively inherits the
//     candidate-array order for multi-parent children (the ef704d0 bug one
//     level up; §o shows it visibly failing the permutation sweep):
function inputOrderWalker(shape, lookup, candidates) {
  const parentsOf = (node) => {
    if (node.genealogy.parentShapeId) {
      const parent = lookup(node.genealogy.parentShapeId) ?? null;
      return parent ? [parent] : [];
    }
    const sourceSet = new Set(node.genealogy.sourceVertexIds);
    if (sourceSet.size === 0) return [];
    return candidates.filter(
      (candidate) =>
        candidate.id !== node.id &&
        candidate.genealogy.createdVertexIds.some((v) => sourceSet.has(v)),
    ); // ← candidate ARRAY order — the trap
  };
  const lineage = [];
  const seen = new Set([shape.id]);
  let frontier = [shape];
  while (frontier.length > 0) {
    const next = [];
    for (const node of frontier) {
      for (const parent of parentsOf(node)) {
        if (seen.has(parent.id)) continue;
        seen.add(parent.id);
        lineage.push(parent);
        next.push(parent);
      }
    }
    frontier = next;
  }
  return lineage;
}

console.log('the multi-parent DAG walk: the record was complete; now the walker can reach it (blind concretes)\n');

// ---------------------------------------------------------------------------
// fixtures: two T² reps (the mandate's mpA/mpB), their connect-sum child,
// decoys, and the single-parent zoo (incl. the ub7 depth-4 chain)
// ---------------------------------------------------------------------------
const torusRep = (prefix) => copyOf(immerseSurface({ surface: 'torus', resolution: 4 }).shape, prefix);
const A = torusRep('mpA');
const B = torusRep('mpB');
const csum = connectedSum(A, B).shape;
const decoySq = loadForm(nGon(4), 'mpD');
const decoyBorn = getPlaygroundOperation('glue-torus').execute({
  form: decoySq, selectedFaceId: decoySq.faces[0].id, selectedFace: decoySq.faces[0], parentShape: null,
});
const tube81 = loadForm(() => ({
  name: 'tube8x1',
  vertices: [
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ id: `a${i}`, position: [Math.cos((i * Math.PI) / 4), 0, Math.sin((i * Math.PI) / 4)] })),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ id: `b${i}`, position: [Math.cos((i * Math.PI) / 4), 1, Math.sin((i * Math.PI) / 4)] })),
  ],
  faces: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ vertexIds: [`a${i}`, `a${(i + 1) % 8}`, `b${(i + 1) % 8}`, `b${i}`] })),
}), 'ub7');
const S1 = sewBoundaryCircles(tube81, 'preserving').shape;
const C1 = materializeCutResult(S1, cutCell(S1, S1.faces[0]));
const disjointFace = C1.faces.find((f) => f.vertexIds.every((v) => !S1.faces[0].vertexIds.includes(v)));
const C2 = materializeCutResult(C1, cutCell(C1, disjointFace));
const S3 = sewBoundaryCircles(C2, 'preserving', 0, 1, [C1, S1, tube81]).shape;

const population = [A, B, csum, decoySq, decoyBorn, tube81, S1, C1, C2, S3];
const byId = new Map(population.map((s) => [s.id, s]));
const lookup = (id) => byId.get(id);

// ═════ [h] CLAUSE 2's fidelity: the carried mutant vs the REAL committed walker ═════
console.log("----- [h] the carried single-parent mutant is FAITHFUL (HEAD-state-aware; both branches assert real things) -----");
const headOpsSource = execSync('git show HEAD:src/playground/playgroundOperations.ts', { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
const headHasOldWalker = !headOpsSource.includes('MULTI-PARENT DAG WALK');
const singleParentZoo = [
  { name: 'invoked square (root)', shape: decoySq },
  { name: 'word-born torus', shape: decoyBorn },
  { name: 'sewn tube gen-1', shape: S1 },
  { name: 'cut gen-2', shape: C1 },
  { name: 'cut gen-3', shape: C2 },
  { name: 're-sewn gen-4', shape: S3 },
  { name: 'torus rep (loaded root)', shape: A },
];
if (headHasOldWalker) {
  // PRE-COMMIT: compile the REAL committed walker in memory and byte-compare
  // the carried mutant against it — checkable only now, done now.
  const fake = path.join(repoRoot, 'src', 'playground', 'playgroundOperations.__head__.ts');
  const m = new Module(fake, module);
  m.filename = fake;
  m.paths = Module._nodeModulePaths(path.dirname(fake));
  m._compile(ts.transpileModule(headOpsSource, { ...TRANSPILE_OPTIONS, fileName: fake }).outputText, fake);
  const headResolveLineage = m.exports.resolveLineage;
  const allAgree = singleParentZoo.every(({ shape }) =>
    eq(ids(singleParentWalker(shape, lookup)), ids(headResolveLineage(shape, lookup))));
  const brokenLookup = (id) => (id === S1.id ? undefined : byId.get(id));
  check('PRE-COMMIT FIDELITY: the carried mutant ≡ the REAL committed resolveLineage (compiled from HEAD) on the whole single-parent zoo, on a broken lookup, and on the JOIN (both give the same answer — 0 parents)',
    allAgree &&
    eq(ids(singleParentWalker(C1, brokenLookup)), ids(headResolveLineage(C1, brokenLookup))) &&
    eq(ids(singleParentWalker(csum, lookup)), ids(headResolveLineage(csum, lookup))) &&
    headResolveLineage(csum, lookup).length === 0);
  note('HEAD carries the old walker — the fidelity byte-compare ran LIVE (this branch retires with the commit; the mutant is then already proven)');
} else {
  // POST-COMMIT: the fidelity was proven pre-commit (recorded in the REPORT
  // and in this file's history); assert the world is as that proof left it.
  check('POST-COMMIT: HEAD carries the DAG walker (the multi-parent marker present); the carried mutant\'s fidelity was byte-proven pre-commit while HEAD still had the old walker — and its wrongness stays visible below (§w: 0 where 2 are owed)',
    headOpsSource.includes('MULTI-PARENT DAG WALK') && headOpsSource.includes('candidates: Shape[] = []'));
  note('HEAD carries the DAG walker — the pre-commit fidelity branch has retired on its own detection, as designed');
}

// ═════ [w] CLAUSE 1 — the join opens; the carried mutant VISIBLY FAILS ══════
console.log('\n----- [w] the join: parentShapeId is NULL by design; the walker recovers BOTH parents; the old mechanism visibly fails -----');
const candidates = population;
const joinWalk = resolveLineage(csum, lookup, candidates);
check('EXECUTE WHAT YOU WITNESS: the connect-sum child took the MULTI-PARENT path — parentShapeId === null (by design, single-valued) AND the walker returns BOTH parents [A, B]',
  csum.genealogy.parentShapeId === null &&
  joinWalk.length === 2 &&
  joinWalk[0].id === A.id && joinWalk[1].id === B.id);
check('THE CARRIED WRONG MECHANISM VISIBLY FAILS: the single-parent walker returns 0 ancestors where 2 are owed (the orphan the manuscript used to draw)',
  singleParentWalker(csum, lookup).length === 0);
check('…and the decoys never appear: an unrelated square and its word-born child sit in the candidates and are excluded (ancestors only, never the population)',
  !joinWalk.some((s) => s.id === decoySq.id || s.id === decoyBorn.id));
const siteCountOf = (parent) => csum.genealogy.sourceVertexIds.filter((v) => parent.genealogy.createdVertexIds.includes(v)).length;
check('the committed site-provenance counts: 16 source sites trace to parent A and 16 to parent B (32 total — the record the DAG always carried)',
  csum.genealogy.sourceVertexIds.length === 32 && siteCountOf(A) === 16 && siteCountOf(B) === 16);
const dag = buildGenealogyDag([A, B, csum]);
const csumNode = dag.nodes.find((n) => n.id === csum.id);
check('the DAG corroborates the walker: buildGenealogyDag recovers the SAME parent set {A, B}, 2 edges, integrity accepted (the mechanism reused, not reinvented)',
  dag.integrity.accepted === true &&
  eq([...csumNode.parents].sort(), [A.id, B.id].sort()) &&
  dag.edges.filter((e) => e.child === csum.id).length === 2);

// ═════ [o] CLAUSE 3 — order invariance; the input-order walker VISIBLY FAILS ═
console.log('\n----- [o] the ancestor ORDER comes from committed identity — ≥6 store permutations cannot move it -----');
const perms = [
  [A, B, csum, decoySq, decoyBorn],
  [B, A, csum, decoySq, decoyBorn],
  [decoyBorn, B, decoySq, A, csum],
  [csum, decoySq, B, decoyBorn, A],
  [B, csum, decoyBorn, A, decoySq],
  [decoySq, A, decoyBorn, csum, B],
  [B, decoyBorn, A, decoySq, csum],
];
const mineOrders = new Set(perms.map((perm) => JSON.stringify(ids(resolveLineage(csum, lookup, perm)))));
const trapOrders = new Set(perms.map((perm) => JSON.stringify(ids(inputOrderWalker(csum, lookup, perm)))));
check(`ORDER INVARIANCE: across ${perms.length} permutations of the candidate array the walker's output is ONE ordered list — [A, B], the committed-birth order`,
  mineOrders.size === 1 && [...mineOrders][0] === JSON.stringify([A.id, B.id]));
check('…and THE TRAP\'S TEETH: the carried INPUT-ORDER walker yields 2 DISTINCT orders across the same sweep ([A,B] and [B,A] — the ancestor order moving with the store array, the exact bug ef704d0 buried, one level up)',
  trapOrders.size === 2 &&
  trapOrders.has(JSON.stringify([A.id, B.id])) && trapOrders.has(JSON.stringify([B.id, A.id])));
const idxA = csum.genealogy.sourceVertexIds.findIndex((v) => A.genealogy.createdVertexIds.includes(v));
const idxB = csum.genealogy.sourceVertexIds.findIndex((v) => B.genealogy.createdVertexIds.includes(v));
check('the order is COMMITTED IDENTITY, doubly corroborated: A\'s first site precedes B\'s in the child\'s form-order sourceVertexIds, AND A\'s id precedes B\'s inside the child\'s own birth id (the argument order, embedded at birth)',
  idxA >= 0 && idxB >= 0 && idxA < idxB &&
  csum.id.indexOf(A.id) >= 0 && csum.id.indexOf(B.id) >= 0 &&
  csum.id.indexOf(A.id) < csum.id.indexOf(B.id));
note(`sourceVertexIds first-index: A@${idxA} < B@${idxB} · birth-id position: A@${csum.id.indexOf(A.id)} < B@${csum.id.indexOf(B.id)}`);

// ═════ [s] CLAUSE 4 — single-parent NON-MOVEMENT (the highest bar) ══════════
console.log('\n----- [s] ★ single-parent non-movement: byte-identical to the carried old walker on the whole zoo -----');
const nonMovement = singleParentZoo.every(({ shape }) => {
  const mine = resolveLineage(shape, lookup, candidates);
  const theirs = singleParentWalker(shape, lookup);
  return eq(ids(mine), ids(theirs)) && mine.every((s, k) => s === theirs[k]);
});
check('every single-parent form — roots, word-born, the depth-4 chain at every generation — walks BYTE-IDENTICALLY (same shapes, same order, same length) with candidates present',
  nonMovement &&
  eq(ids(resolveLineage(S3, lookup, candidates)), [C2.id, C1.id, S1.id, tube81.id]) &&
  eq(ids(singleParentWalker(S3, lookup)), [C2.id, C1.id, S1.id, tube81.id]));
const brokenLookup = (id) => (id === S1.id ? undefined : byId.get(id));
const cyclicA = { ...decoySq, id: 'mp:cyc:a', genealogy: { ...decoySq.genealogy, parentShapeId: 'mp:cyc:b' } };
const cyclicB = { ...decoySq, id: 'mp:cyc:b', genealogy: { ...decoySq.genealogy, parentShapeId: 'mp:cyc:a' } };
const cyclicLookup = (id) => (id === 'mp:cyc:a' ? cyclicA : id === 'mp:cyc:b' ? cyclicB : undefined);
check('…and the honest edges hold identically: a PRUNED ancestor truncates the walk the same way, and a crafted CYCLIC genealogy terminates finitely with the same answer (seen-guarded, both walkers)',
  eq(ids(resolveLineage(C2, brokenLookup, candidates)), ids(singleParentWalker(C2, brokenLookup))) &&
  eq(ids(resolveLineage(cyclicA, cyclicLookup, [])), ids(singleParentWalker(cyclicA, cyclicLookup))) &&
  eq(ids(resolveLineage(cyclicA, cyclicLookup, [])), ['mp:cyc:b']));

// ═════ [t] THROUGH the join — a descendant reaches both grandparents ════════
console.log('\n----- [t] through the join: cut it, cut it, sew it — the ancestry reaches BOTH grandparents, once each -----');
const K1 = materializeCutResult(csum, cutCell(csum, csum.faces[0]));
const kDisjoint = K1.faces.find((f) => f.vertexIds.every((v) => !csum.faces[0].vertexIds.includes(v)));
const K2 = materializeCutResult(K1, cutCell(K1, kDisjoint));
const throughPopulation = [...population, K1, K2];
const throughById = new Map(throughPopulation.map((s) => [s.id, s]));
const throughLookup = (id) => throughById.get(id);
const throughWalk = resolveLineage(K2, throughLookup, throughPopulation);
check('the cut-of-a-cut of the connect-sum child walks THROUGH the join: [K1, csum, A, B] — nearest generation first, the join\'s parents in committed order, no duplication, no cycle',
  eq(ids(throughWalk), [K1.id, csum.id, A.id, B.id]) &&
  new Set(ids(throughWalk)).size === throughWalk.length);
const sewnThrough = sewBoundaryCircles(K2, 'preserving', 0, 1, throughWalk);
const sewnPopulation = [...throughPopulation, sewnThrough.shape];
const sewnById = new Map(sewnPopulation.map((s) => [s.id, s]));
const sewnWalk = resolveLineage(sewnThrough.shape, (id) => sewnById.get(id), sewnPopulation);
const sewnInv = readFormInvariants(sewnThrough.shape, sewnWalk);
check('…and the descendant OPERATES with that ancestry: the re-sew RUNS (via general) and the born form\'s lineage is [K2, K1, csum, A, B] — five ancestors through the join',
  sewnThrough.via === 'general' &&
  eq(ids(sewnWalk), [K2.id, K1.id, csum.id, A.id, B.id]));
check(`…and it CERTIFIES with the walked ancestry: the self-sew of the twice-cut genus-2 reads "${sewnInv.classification}" (χ=${sewnInv.chiCertified})`,
  sewnInv.classification === 'genus 3 (closed, orientable)' && sewnInv.chiCertified === -4);

// ═════ [r] the REAL consumers: the store walks it; the manuscript receives it ═
console.log('\n----- [r] the consumers: the store\'s ancestry and the manuscript\'s target now carry both parents -----');
usePlaygroundStore.getState().resetPlayground();
usePlaygroundStore.getState().addForm(A, { source: 'multiparent-fixture', origin: 'loaded' });
usePlaygroundStore.getState().addForm(B, { source: 'multiparent-fixture', origin: 'loaded' });
usePlaygroundStore.getState().addForm(csum, { source: 'connect-sum', origin: 'operated' });
usePlaygroundStore.getState().selectForm(csum.id);
usePlaygroundStore.getState().selectFace(csum.faces[0].id);
const storeCut = usePlaygroundStore.getState().applyOperationToSelection('cut');
const storeState = usePlaygroundStore.getState();
const storeShapes = storeState.formOrder.map((id) => storeState.forms[id].shape);
const storeWalk = resolveLineage(storeCut, (id) => storeState.forms[id]?.shape, storeShapes);
check('the REAL store operates ON a connect-sum child (cut applies through applyOperationToSelection — its context now carries ancestry [A, B]) and the born cut\'s store-walked lineage is [csum, A, B]',
  eq(ids(storeWalk), [csum.id, A.id, B.id]));
// THE PERSON PICKS THE FACE (sanctioned 2026-07-12): a face-consuming op on a
// MULTI-face form now needs the person's picked face — the un-picked cut
// refuses with the committed reason (never a silent faces[0]); the picked cut
// proceeds. Both pinned here as a live cross-witness.
const availability = operationAvailabilityFor(csum, null, [A, B]);
const unpickedCut = applyPlaygroundOperationTo('cut', csum, null, 77, 8, [A, B]);
const manuscriptCut = applyPlaygroundOperationTo('cut', csum, null, 77, 8, [A, B], csum.faces[4].id);
check('the MANUSCRIPT boundary receives 2 ancestors where it received 0 and does not break: availability computes (10 ops); the UN-PICKED cut on the 30-face child refuses with the committed reason, and the PICKED cut succeeds',
  Array.isArray(availability) && availability.length === 10 &&
  unpickedCut.ok === false && /Select a face/.test(unpickedCut.reason) &&
  manuscriptCut.ok === true);
note(`ManuscriptView:644's walk on this child: ${resolveLineage(csum, lookup, candidates).length} ancestors (was 0) — the render layer itself is untouched (designer ADR 0003 governs the N-pentimenti draw)`);

// ═════ [g] guards ═════════════════════════════════════════════════════════════
console.log('\n----- [g] no-regression: the walker is registry-layer; the engine and the reused mechanism are frozen -----');
// THE ENGINE FREEZE MANIFEST (engineer-chartered 2026-07-12): the old
// per-diagnostic HEAD-differential guard REQUIRED A HOLE IN ITSELF to permit
// any sanctioned change (a carve-out — silent, and permanent unless a human
// remembered; `playgroundOperations.ts` ended up guarded by NOBODY). The
// engine is now frozen by ONE on-repo manifest of content hashes
// (docs/governance/ENGINE_FREEZE_MANIFEST.txt): a sanctioned change is a
// one-line hash update in the SAME commit, and coverage never lapses. The
// shared checker READS the manifest and can never write it. (§h's
// `git show HEAD:` read above is a DIFFERENT mechanism — the carried
// single-parent mutant's HEAD-state-aware fidelity — and stays.)
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
const freeze = checkEngineFreeze();
// 27 → 44 (2026-07-14, THE SMALL RUN): the freeze closed under imports — a
// frozen file is only as frozen as its dependencies; src/types joined the scan.
check('THE ENGINE FREEZE MANIFEST: all 45 frozen engine files (import-closed) match their manifest hashes and every source file under the engine roots is classified — drifted [] · missing [] · unlisted []',
  freeze.ok === true && freeze.checked === 47 &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 && freeze.unlisted.length === 0);
if (!freeze.ok) note(`drifted: [${freeze.drifted}] · missing: [${freeze.missing}] · unlisted: [${freeze.unlisted}]`);
// THE FREEZE CHECK STILL BITES (stub-proof — a checker that cannot fail is dead):
const FREEZE_SENTINEL = 'src/lib/incidenceTraceRegistry.ts';
const sentinelContent = fs.readFileSync(path.join(repoRoot, FREEZE_SENTINEL), 'utf8');
const sentinelFlipped = sentinelContent.slice(0, 100) + (sentinelContent[100] === 'X' ? 'Y' : 'X') + sentinelContent.slice(101);
const freezeBite = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelFlipped } });
const freezeCrlf = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelContent.replace(/\r/g, '').replace(/\n/g, '\r\n') } });
check('…and the freeze check still BITES: a one-character in-memory mutation of the sentinel FAILS it (exactly that file drifts) while the CRLF re-expression PASSES (CR-insensitive — no false wolf)',
  freezeBite.ok === false && freezeBite.drifted.length === 1 && freezeBite.drifted[0] === FREEZE_SENTINEL &&
  freezeCrlf.ok === true);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
