#!/usr/bin/env node

// DIAGNOSTIC — E1 (mothership G2): snapshot save/load across universes (ADR 0010).
//
// Through the REAL modules + store:
//   §1 ROUND-TRIP — serialize → deserialize reproduces the form's structure
//      faithfully (cells preserved; edges CARRIED, never re-derived; plain JSON;
//      self-contained). Derive-only on the source form.
//   §2 CROSS-SOURCE DISTINCTNESS (the load-bearing property) — ONE snapshot
//      loaded under sources u1 and u2: lineage roots namespace distinctly
//      (u1:v0 ≠ u2:v0 under the committed primalMultisetKey); both coexist in
//      one store; ASSEMBLING them reads lineage-heterogeneous / UNFAITHFUL
//      through the committed certifier — co-location ≠ identity across
//      snapshot universes (the E1/multiform seal's law, reused not recomputed).
//   §3 PROVENANCE — origin 'loaded' + the source NAME; deserialization works
//      from a pure JSON copy with the original long gone (no doorway).
//   §4 A BORN (quotient) form round-trips with its carried lineage PREFIXED
//      (the fundamental-polygon cells intact — nothing re-derived); its DAG
//      standing without its home universe is measured and surfaced honestly.
//   §5 GUARDS — version / malformed / reserved-char / empty sources refuse loudly.
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

const { serializeSnapshot, deserializeSnapshot, SNAPSHOT_VERSION } = req('src/playground/snapshot.ts');
const { usePlaygroundStore } = req('src/store/playgroundStore.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { assemble } = req('src/lib/multiform.ts');
const { canonicalAssembleIdentification } = req('src/playground/playgroundOperations.ts');
const { shapeLineageOf, certifyFaithfulness } = req('src/lib/transformationLedger.ts');
const { primalMultiset, primalMultisetKey } = req('src/lib/lineage.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');
const { layoutGenealogy } = req('src/playground/genealogyLayout.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const keyOf = (shape, id) => primalMultisetKey(primalMultiset(id, shape, new Map()));

console.log('E1 snapshot: self-contained save/load; co-location ≠ identity across universes\n');

// ===== [1] ROUND-TRIP (plain form; structure faithful; edges carried) =====
console.log('----- [1] ROUND-TRIP -----');
usePlaygroundStore.getState().resetPlayground();
const A = usePlaygroundStore.getState().invokeForm(nGon(4)); // PLAIN ids v0..v3
const aSnapshotJson = JSON.stringify(A);
const snap = serializeSnapshot(A, 'origin');
check('§1 the snapshot is plain JSON (deep-equal after a JSON round) — self-contained', eq(snap, JSON.parse(JSON.stringify(snap))));
check('§1 the snapshot carries version/sourceId/savedAt/shape', snap.version === SNAPSHOT_VERSION && snap.sourceId === 'origin' && typeof snap.savedAt === 'string' && Boolean(snap.shape));
check('§1 save is derive-only (the source form byte-identical)', JSON.stringify(A) === aSnapshotJson);

const loadedDefault = deserializeSnapshot(snap); // under the snapshot's own source
const L = loadedDefault.shape;
check('§1 cells preserved (V/E/F counts equal)', Object.keys(L.vertices).length === Object.keys(A.vertices).length && L.edges.length === A.edges.length && L.faces.length === A.faces.length);
check('§1 every vertex id is source-prefixed (origin:v0 …)', Object.keys(L.vertices).every((id) => id.startsWith('origin:')) && Boolean(L.vertices['origin:v0']));
// P2: the namespacing rule is COMPLETE — the ids the loaded shape OWNS
// (edge/face ids included) prefix together with every ref to them, so two
// loads under different names are FULLY id-disjoint (the enacted assemble
// fail-louds on collisions; loaded universes are actually distinct). The
// STRUCTURE is still carried, never re-derived: same edges in the same
// order, prefixed 1:1.
check('§1 edges are CARRIED, never re-derived (edge ids + endpoints prefixed 1:1, same order — P2 full namespacing)', eq(L.edges.map((e) => e.id), A.edges.map((e) => `origin:${e.id}`)) && eq(L.edges.map((e) => e.vertexIds), A.edges.map((e) => e.vertexIds.map((v) => `origin:${v}`))));
check('§1 faces prefixed in slot order', eq(L.faces.map((f) => f.vertexIds), A.faces.map((f) => f.vertexIds.map((v) => `origin:${v}`))));
check('§1 the loaded form re-roots (parentShapeId null) with namespaced genealogy ids', L.genealogy.parentShapeId === null && eq(L.genealogy.createdVertexIds, A.genealogy.createdVertexIds.map((v) => `origin:${v}`)));
check('§1 the loaded shape id is per-source distinct', L.id === `snapshot:origin:${A.id}`);

// ===== [2] CROSS-SOURCE DISTINCTNESS (the load-bearing property) =====
console.log('\n----- [2] CO-LOCATION ≠ IDENTITY ACROSS SNAPSHOT UNIVERSES -----');
const u1 = deserializeSnapshot(snap, 'u1');
const u2 = deserializeSnapshot(snap, 'u2');
check('§2 the SAME snapshot under u1 / u2 → distinct vertex ids', Boolean(u1.shape.vertices['u1:v0']) && Boolean(u2.shape.vertices['u2:v0']));
const k1 = keyOf(u1.shape, 'u1:v0');
const k2 = keyOf(u2.shape, 'u2:v0');
check('§2 lineage roots namespace DISTINCTLY under the committed primalMultisetKey', k1 === 'u1:v0×1' && k2 === 'u2:v0×1' && k1 !== k2);

const s1 = usePlaygroundStore.getState().loadSnapshot(snap, 'u1');
const s2 = usePlaygroundStore.getState().loadSnapshot(snap, 'u2');
const st = usePlaygroundStore.getState();
check('§2 both coexist in ONE store (distinct per-source shape ids)', s1.id !== s2.id && Boolean(st.forms[s1.id]) && Boolean(st.forms[s2.id]));

// merge them: the committed certifier must read lineage-HETEROGENEOUS (UNFAITHFUL).
const { shape: merged, ledger } = assemble([s1, s2], canonicalAssembleIdentification(s1, s2));
const mergedKeys = canonicalAssembleIdentification(s1, s2).merges.map((m) => keyOf(merged, m.resultId));
check('§2 merged children carry the CROSS-UNIVERSE union (u1:…×1|u2:…×1)', eq(mergedKeys, ['u1:v0×1|u2:v0×1', 'u1:v1×1|u2:v1×1']));
const cert = certifyFaithfulness({ forward: ledger.forward, pullBack: ledger.pullBack }, shapeLineageOf(merged));
const mergedSites = cert.perResultSite.filter((site) => canonicalAssembleIdentification(s1, s2).merges.some((m) => m.resultId === site.resultSiteId));
check('§2 the committed certifier reads the merge lineage-HETEROGENEOUS (co-location ≠ identity)', mergedSites.length === 2 && mergedSites.every((site) => site.status === 'lineage-heterogeneous'));
check('§2 operationStatus UNFAITHFUL (the honest cross-provenance record — the E1 seal reused)', cert.operationStatus === 'UNFAITHFUL' && cert.heterogeneousCount === 2);
usePlaygroundStore.getState().selectForm(s1.id);
const storeMerged = usePlaygroundStore.getState().applyAssembleToSelection(s2.id);
check('§2 the STORE assemble path accepts the two loaded universes (born child joins)', Boolean(usePlaygroundStore.getState().forms[storeMerged.id]));
note(`merged keys: ${mergedKeys.join('  ·  ')}`);

// ===== [3] PROVENANCE (a name, not a doorway) =====
console.log('\n----- [3] PROVENANCE -----');
check("§3 loaded provenance = {origin:'loaded', source:'u1'}", st.forms[s1.id].provenance.origin === 'loaded' && st.forms[s1.id].provenance.source === 'u1');
const detachedCopy = JSON.parse(JSON.stringify(snap)); // a pure JSON copy — no live reference anywhere
check('§3 deserialization is SELF-CONTAINED (a detached JSON copy loads identically)', eq(deserializeSnapshot(detachedCopy, 'u1').shape, u1.shape));
const listed = usePlaygroundStore.getState().saveFormAsSnapshot(s1.id);
check('§3 the in-app list holds the saved snapshot (store returns the same file it lists)', usePlaygroundStore.getState().snapshots.includes(listed) && listed.sourceId === 'u1');

// ===== [4] a BORN (quotient) form round-trips with carried lineage prefixed =====
console.log('\n----- [4] BORN-FORM SNAPSHOT (quotient cells intact; carried lineage prefixed) -----');
const P = usePlaygroundStore.getState().invokeForm(nGon(4), 'ua');
usePlaygroundStore.getState().selectForm(P.id);
usePlaygroundStore.getState().selectFace(P.faces[0].id);
const torusBorn = usePlaygroundStore.getState().applyCustomGlueToSelection([
  { edgeA: 0, edgeB: 2, mode: 'preserving' },
  { edgeA: 1, edgeB: 3, mode: 'preserving' },
]);
const bornFile = usePlaygroundStore.getState().saveFormAsSnapshot(torusBorn.id);
const loadedBorn = deserializeSnapshot(bornFile, 'u9').shape;
const mintedId = Object.keys(loadedBorn.vertices)[0];
check('§4 the quotient cells survive CARRIED (1 vertex, 2 edge classes, 1 face — nothing re-derived; ids prefixed 1:1 per P2)', Object.keys(loadedBorn.vertices).length === 1 && loadedBorn.edges.length === 2 && loadedBorn.faces.length === 1 && eq(loadedBorn.edges.map((e) => e.id), torusBorn.edges.map((e) => `u9:${e.id}`)));
check('§4 carried lineage survives with roots PREFIXED (the union of u9:… corners)', keyOf(loadedBorn, mintedId) === ['u9:ua:v0', 'u9:ua:v1', 'u9:ua:v2', 'u9:ua:v3'].map((r) => `${r}×1`).join('|'));
const orphanDag = buildGenealogyDag([loadedBorn]);
check('§4 (measured, surfaced) WITHOUT its home universe the DAG honestly REJECTS the orphan lineage (ghost sources)', orphanDag.integrity.accepted === false && orphanDag.integrity.violations.some((v) => v.includes('ghost source')));
const orphanLayout = layoutGenealogy([loadedBorn]);
check('§4 the D2 view still lays it out (rejection surfaced, no crash)', orphanLayout.accepted === false && orphanLayout.nodes.length === 1);
note(`orphan violation sample: ${orphanDag.integrity.violations[0]}`);

// ===== [5] guards =====
console.log('\n----- [5] GUARDS -----');
const throws = (fn, needle) => {
  try {
    fn();
    return false;
  } catch (error) {
    return String(error.message).includes(needle);
  }
};
check('§5 an unsupported version refuses loudly', throws(() => deserializeSnapshot({ ...snap, version: 2 }), 'unsupported snapshot version'));
check('§5 a malformed snapshot (no Shape) refuses loudly', throws(() => deserializeSnapshot({ version: 1, sourceId: 'x', savedAt: '', shape: { nope: true } }), 'no well-formed Shape'));
check('§5 a reserved-char load source refuses loudly (the assertKeySafe precedent)', throws(() => deserializeSnapshot(snap, 'u|1'), 'reserved primalMultisetKey char'));
check('§5 an empty source refuses loudly', throws(() => deserializeSnapshot(snap, '   '), 'non-empty'));
check('§5 serialize guards the sourceId too', throws(() => serializeSnapshot(A, 'bad×source'), 'reserved primalMultisetKey char'));

console.log(
  `\n--- E1 snapshot (round-trip, cross-source distinctness via the committed certifier, provenance, born-form carry, guards): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
