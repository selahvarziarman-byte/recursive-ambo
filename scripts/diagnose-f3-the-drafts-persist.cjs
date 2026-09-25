#!/usr/bin/env node

// DIAGNOSTIC — F3, THE WORD PAIRS GIVEN ALONE SURVIVE SAVING (STAMP F3, 2026-09-25 — Arman's Δ113 "yes fix F3"; the mothership's
// ruling: PERSISTENCE ONLY). A word pair given on an edge with no plain role pair lives in the store's `edgeTauDrafts` (τ before the
// first role pair — C-7e), and neither Export nor Import touched it at 2027c6d, so it was gone after Export → reload → Import; an
// Import into a session holding drafts kept that session's own. THE FIX: the workspace file carries `edgeTauDrafts`; an Import
// restores the file's and drops the session's. THE INVARIANT: after Export → a FRESH store → Import, every reader reads the same
// word pairs, and everything derived from them, as before the export. The lift is UNCHANGED (its asymmetry parked): measured here,
// printed, not pinned.
//
// §a THE DEFECT MEASURED — the mechanism as ruled (the draft, the plain record empty, the resolver reading τ from the draft); the
//    round trip through a fresh store; the PERMANENT CONTROL — the file as 2027c6d wrote it (no `edgeTauDrafts`) loses the pair.
// §b THE FOUR CASES — alone on an edge; an edge joined only through triads; the last plain role pair withdrawn (the pairs kept);
//    an Import into a session holding other drafts (the session's dropped, the file's restored). Each with the readers' invariant.
// §c THE SERIALIZER — the field written; an old file (no field) accepted; a malformed field refused by name; the store's two lines.
// §d THE LIFT — a word pair alone does not cross (measured, not pinned — parked by the mothership).
//
// ⛔ Run this witness at the BASE first: §a's round trip and §b's cases FAIL there — that failure is the fix's positive control.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const J = (x) => JSON.stringify(x);

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${cond ? '' : ` — ${detail ?? ''}`}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);

const { spaceOf } = req('src/lib/spaceOf.ts');
const { readRespects, triadsOn } = req('src/lib/respects.ts');
const { serializeWorkspaceSnapshot, validateWorkspaceImport } = req('src/lib/workspacePersistence.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const { liftedConceptOf } = req('src/manuscript/liftedConceptModel.ts');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json'); const triangle = cast('triangle.cast.json');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const reset = (seeded) => useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, liftSelection: [], selectedCellId: null, selectedVertexId: null, selectedEdgeId: null, selectedFaceId: null });
const seeded4 = () => { let s = createSeedShape('tetrahedron'); for (const [l, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', triangle]]) s = withCast(s, byLabel(s, l), c); return s; };
const E = (shape, X, Y) => edgeBetween(shape.edges, byLabel(shape, X), byLabel(shape, Y));
const give = (X, Y, map) => { const e = E(cur(), X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
const take = (X, Y, map) => { const e = E(cur(), X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().withdrawRolePair(e.id, x, y); else S().withdrawRolePair(e.id, y, x); } };
const wordPair = (X, Y, s, t) => { const e = E(cur(), X, Y); if (e.vertexIds[0] === byLabel(cur(), X)) S().giveWordPair(e.id, s, t); else S().giveWordPair(e.id, t, s); };
const faceOf = (shape, labels) => { const ids = labels.map((l) => byLabel(shape, l)); return shape.faces.find((f) => f.vertexIds.length === ids.length && ids.every((id) => f.vertexIds.includes(id))) ?? null; };
const triad = (labels, items) => S().giveTriad(faceOf(cur(), labels).id, 'role', labels.map((l, i) => ({ corner: byLabel(cur(), l), item: items[i] })));
const midpointOf = (shape, u, v) => Object.values(shape.vertices).find((w) => w.createdBy.operation !== 'seed' && w.createdBy.sourceVertexIds.length === 2 && w.createdBy.sourceVertexIds.includes(u) && w.createdBy.sourceVertexIds.includes(v));
const canon = (v) => JSON.stringify(v, (k, x) => (x instanceof Map ? [...x] : x instanceof Set ? [...x] : x));
const drafts = () => S().edgeTauDrafts;
/** the draft on the edge between two labelled corners, as the store holds it — the file's key is the edge's id */
const draftOn = (X, Y) => drafts()[E(cur(), X, Y).id];
/** every reader's view of AB at gen 1, with the drafts as the store holds them: the resolution (the glue over τ, the feet, the core, the respects) and the direct readings */
const readersAt = () => { const G = cur(); const m = midpointOf(G, byLabel(G, 'A'), byLabel(G, 'B')); const opts = { tauDrafts: drafts() }; const R = spaceOf(G, m.id, opts); return canon({ born: R.edge.born, space: R.space, core: R.core, respects: readRespects(G, E(G, 'A', 'B'), opts), feet: R.feet.map((f) => [f.type, [...f.map]]), respectsDirect: R.respects }); };
/** Export → a FRESH store → Import; `strip` removes the field as 2027c6d wrote the file (no `edgeTauDrafts`) */
const roundTrip = (strip) => { const w = S().exportWorkspace(); const o = JSON.parse(JSON.stringify(w)); if (strip) delete o.edgeTauDrafts; reset(seeded4()); S().importWorkspace(o); return w; };

console.log('F3 — the word pairs given alone survive saving (persistence only)\n');

// ═══ §a THE DEFECT, MEASURED ═══
console.log('----- §a the defect measured: the draft, the round trip through a fresh store, the permanent control -----');
reset(seeded4());
wordPair('A', 'B', 'sustains', 'sustains');
const eAB0 = E(cur(), 'A', 'B');
const draft0 = J(draftOn('A', 'B'));
S().applyAmboDissectionToCurrent();
const G1 = cur(); const mAB = midpointOf(G1, byLabel(G1, 'A'), byLabel(G1, 'B'));
const withDraft = spaceOf(G1, mAB.id, { tauDrafts: drafts() }); const withoutDraft = spaceOf(G1, mAB.id);
check('§a ★★ THE MECHANISM, as the mothership read it, run: `sustains ↦ sustains` given on A–B with no plain role pair lives in `edgeTauDrafts[A–B]` and the edge\'s plain record holds nothing; the draft rides the dissection by pair (C-7e); at gen 1 the born concept at AB translates `sustains ≡ sustains` from the draft alone — the resolver read with the store\'s drafts glues one word fewer than the resolver read without them',
  draft0 === J([['sustains', 'sustains']]) && eAB0.identification === undefined && J(draftOn('A', 'B')) === J([['sustains', 'sustains']]) && J(withDraft.edge.born.types) === J([['sustains', 'sustains']]) && withoutDraft.edge.born.types.length === 0 && withDraft.space.signature.length === withoutDraft.space.signature.length - 1,
  J({ draft0, gen1: draftOn('A', 'B'), born: withDraft.edge.born, words: [withoutDraft.space.signature.length, withDraft.space.signature.length] }));
const beforeA = { drafts: J(drafts()), readers: readersAt() };
const wA = roundTrip(false);
const afterA = { drafts: J(drafts()), readers: readersAt() };
note(`the exported file ${Object.prototype.hasOwnProperty.call(wA, 'edgeTauDrafts') ? 'carries' : 'does NOT carry'} \`edgeTauDrafts\` (${J(wA.edgeTauDrafts)}) · the fresh store after Import holds ${afterA.drafts}`);
check('§a ★★ THE ROUND TRIP (alone on an edge): Export → a FRESH store → Import — the word pair given alone is PRESENT after the import (the file carries `edgeTauDrafts`), and every reader reads AB as before the export: the glue over τ, the feet, the core, the respects — byte-equal. ⛔ At 2027c6d this clause FAILS: the file carried no drafts and the fresh store held none — the defect, measured',
  Object.prototype.hasOwnProperty.call(wA, 'edgeTauDrafts') && afterA.drafts === beforeA.drafts && afterA.readers === beforeA.readers && J(draftOn('A', 'B')) === J([['sustains', 'sustains']]),
  J({ fileHasDrafts: Object.prototype.hasOwnProperty.call(wA, 'edgeTauDrafts'), before: beforeA.drafts, after: afterA.drafts, readersEqual: afterA.readers === beforeA.readers }));
// the permanent control: the file as 2027c6d wrote it
reset(seeded4()); wordPair('A', 'B', 'sustains', 'sustains'); S().applyAmboDissectionToCurrent();
const wCtl = roundTrip(true);
check('§a ★★ THE PERMANENT CONTROL — the file as 2027c6d wrote it (the field struck) loses the pair: after Import into a fresh store the drafts are empty and the born concept at AB glues nothing over τ — the base\'s behaviour, reproduced by construction, whatever the code',
  !Object.prototype.hasOwnProperty.call(JSON.parse(JSON.stringify((() => { const o = JSON.parse(JSON.stringify(wCtl)); delete o.edgeTauDrafts; return o; })())), 'edgeTauDrafts') && J(drafts()) === '{}' && spaceOf(cur(), midpointOf(cur(), byLabel(cur(), 'A'), byLabel(cur(), 'B')).id, { tauDrafts: drafts() }).edge.born.types.length === 0,
  J({ drafts: drafts() }));

// ═══ §b THE FOUR CASES ═══
console.log('\n----- §b the four cases, each through a fresh store, each with the readers\' invariant -----');
// (b) an edge joined only through triads
reset(seeded4());
const rT = triad(['A', 'B', 'C'], ['F7', 'r0', 'Φ1']);
wordPair('A', 'B', 'sustains', 'sustains');
S().applyAmboDissectionToCurrent();
const beforeB = { drafts: J(drafts()), readers: readersAt(), triads: J(cur().faces.map((f) => triadsOn(f).roles).filter((r) => r.length)) };
roundTrip(false);
const afterB = { drafts: J(drafts()), readers: readersAt(), triads: J(cur().faces.map((f) => triadsOn(f).roles).filter((r) => r.length)) };
check('§b ★★ AN EDGE JOINED ONLY THROUGH TRIADS: (F7, r0, Φ1) at A·B·C and `sustains ↦ sustains` on A–B with no plain role pair — the word pair lives in the drafts (the triad on the face); after Export → a fresh store → Import both stand — the triad on its face, the word pair in the drafts — and every reader reads AB as before',
  rT === null && E(G1, 'A', 'B').identification === undefined && beforeB.triads !== '[]' && afterB.triads === beforeB.triads && afterB.drafts === beforeB.drafts && afterB.readers === beforeB.readers && J(draftOn('A', 'B')) === J([['sustains', 'sustains']]),
  J({ before: beforeB, after: { drafts: afterB.drafts, triads: afterB.triads, readersEqual: afterB.readers === beforeB.readers } }));
// (c) the last plain role pair withdrawn, the word pairs kept
reset(seeded4());
give('A', 'B', { F7: 'r0' }); wordPair('A', 'B', 'sustains', 'sustains');
const inRecord = J(E(cur(), 'A', 'B').identification);
take('A', 'B', { F7: 'r0' });
const movedToDraft = J(draftOn('A', 'B')); const recordAfter = E(cur(), 'A', 'B').identification;
S().applyAmboDissectionToCurrent();
const beforeC = { drafts: J(drafts()), readers: readersAt() };
roundTrip(false);
const afterC = { drafts: J(drafts()), readers: readersAt() };
check('§b ★★ THE LAST PLAIN ROLE PAIR WITHDRAWN: with F7 ↦ r0 standing the word pair lives in the edge\'s record (`identification.types`); F7 ↦ r0 withdrawn, the word pair moves to the drafts and the record is gone (`midpointWrite`); after Export → a fresh store → Import the word pair stands in the drafts and every reader reads AB as before',
  /"types":\[\["sustains","sustains"\]\]/.test(inRecord) && movedToDraft === J([['sustains', 'sustains']]) && recordAfter === undefined && afterC.drafts === beforeC.drafts && afterC.readers === beforeC.readers && J(draftOn('A', 'B')) === J([['sustains', 'sustains']]),
  J({ inRecord, movedToDraft, recordAfter, before: beforeC.drafts, after: afterC.drafts, readersEqual: afterC.readers === beforeC.readers }));
// (d) an Import into a session holding other drafts
reset(seeded4());
wordPair('A', 'C', 'disjoins', 'disjoins');
const wFile = S().exportWorkspace();
const fileDrafts = J(wFile.edgeTauDrafts);
reset(seeded4());
wordPair('A', 'B', 'sustains', 'sustains');
const sessionDrafts = J(drafts());
S().importWorkspace(JSON.parse(JSON.stringify(wFile)));
check('§b ★★ AN IMPORT INTO A SESSION HOLDING OTHER DRAFTS: the file holds `disjoins ↦ disjoins` on A–C alone; the session holds `sustains ↦ sustains` on A–B alone; after the Import the drafts are the FILE\'s — A–C\'s pair restored, the session\'s A–B pair dropped',
  fileDrafts !== '{}' && sessionDrafts !== '{}' && sessionDrafts !== fileDrafts && J(drafts()) === fileDrafts && draftOn('A', 'B') === undefined && J(draftOn('A', 'C')) === J([['disjoins', 'disjoins']]),
  J({ fileDrafts, sessionDrafts, after: drafts() }));

// ═══ §c THE SERIALIZER AND THE STORE'S TWO LINES ═══
console.log('\n----- §c the serializer: the field written, an old file accepted, a malformed one refused by name; the store\'s two lines -----');
const snap = { selectedSeedKey: 'tetrahedron', shapes: { [seeded4().id]: seeded4() }, shapeOrder: [seeded4().id], currentShapeId: seeded4().id, selectedCellId: null, selectedVertexId: null, operationHistory: [], historySequence: 0, edgeTauDrafts: { 'edge:x': [['a', 'b']] } };
const written = serializeWorkspaceSnapshot(snap);
const oldFile = JSON.parse(JSON.stringify(written)); delete oldFile.edgeTauDrafts;
const malformed = { ...JSON.parse(JSON.stringify(written)), edgeTauDrafts: 'junk' };
const malformed2 = { ...JSON.parse(JSON.stringify(written)), edgeTauDrafts: { 'edge:x': [['a']] } };
const storeSrc = readLf('src/store/geometryStore.ts'); const persistSrc = readLf('src/lib/workspacePersistence.ts');
check('§c ★★ THE SERIALIZER writes `edgeTauDrafts` as the store holds it (an empty object when none); a file saved before F3 (no field) still validates; a malformed field (a string; a tuple of one) is refused BY NAME — `Workspace edgeTauDrafts is malformed.`; the store exports `edgeTauDrafts: state.edgeTauDrafts` and imports `importedWorkspace.edgeTauDrafts ?? {}` — the file\'s restored, the session\'s dropped, by construction',
  J(written.edgeTauDrafts) === J({ 'edge:x': [['a', 'b']] }) && J(serializeWorkspaceSnapshot({ ...snap, edgeTauDrafts: undefined }).edgeTauDrafts) === '{}' && validateWorkspaceImport(oldFile).ok === true && validateWorkspaceImport(malformed).ok === false && validateWorkspaceImport(malformed).errors.includes('Workspace edgeTauDrafts is malformed.') && validateWorkspaceImport(malformed2).ok === false && storeSrc.includes('edgeTauDrafts: state.edgeTauDrafts,') && storeSrc.includes('edgeTauDrafts: importedWorkspace.edgeTauDrafts ?? {},') && persistSrc.includes('edgeTauDrafts?: PersistedEdgeTauDrafts;'),
  J({ written: written.edgeTauDrafts, old: validateWorkspaceImport(oldFile), bad: validateWorkspaceImport(malformed), bad2: validateWorkspaceImport(malformed2) }));

// ═══ §d THE LIFT — measured, not pinned (parked by the mothership) ═══
console.log('\n----- §d the lift, measured (parked): a word pair alone and the carried record -----');
reset(seeded4());
wordPair('A', 'B', 'sustains', 'sustains');
S().applyAmboDissectionToCurrent();
const Gl = cur();
S().selectCell(Gl.cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(byLabel(Gl, 'A')) && c.vertexIds.length === 4).id);
const beforeQ = useLiftStore.getState().queue.length;
S().liftSelectionToManuscript();
const entry = loadUniverseSnapshot(useLiftStore.getState().queue[beforeQ].file);
const form = placeShelfEntry(entry, 0);
const concept = liftedConceptOf(form, entry.loaded.ancestors ?? []);
const liftedAB = concept.state === 'read' ? E(concept.record, 'A', 'B') : null;
const liftedRead = concept.state === 'read' ? spaceOf(concept.record, byLabel(concept.record, 'AB')) : null;
note(`the lift: the carried record's A–B holds ${liftedAB && liftedAB.identification ? 'a record' : 'NO plain record'}; the lifted AB glues ${liftedRead ? liftedRead.edge.born.types.length : '?'} word pair(s) over τ (the manuscript reads the record without the store's drafts) — the word pair given alone ${liftedRead && liftedRead.edge.born.types.length === 0 ? 'does NOT cross the lift' : 'crosses the lift'}; a role pair's record does (C-10). PARKED by the mothership: said, not pinned.`);

console.log(`\nDIAGNOSE-F3: ${failures === 0 ? 'ALL PASS — the word pairs given alone ride the workspace file; an import restores the file\'s and drops the session\'s; every reader reads the same after a round trip' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
