#!/usr/bin/env node

// DIAGNOSTIC — STAMP MODES-1 · B6 (2026-09-26): TRANSPORT (the projection ruling D12; ADR 0031 §9.1 D12): the lift, the door and
// the cargo ride IS-INSTANCES ONLY — one named option on the resolver, `TRANSPORT_OPTIONS` (no respect read, no foot composed; the
// core his unconditional pairs alone), handed by the three manuscript models to every resolver call. §0 the option and the hands,
// source-pinned · §a ★★ THE MEASUREMENT of what rode before B6 — on the C-14 fixture at the midpoint AB (a triad, pairs, the feet
// of C and D): the full reading against the transport's, the difference NAMED and COUNTED — the meet pairs, the `≡_X` and `⟨X⟩`
// words and their tuples — and NOTHING ELSE (the word difference is exactly those types; the role difference exactly the meet) ·
// §b THE LIFT: the residue at A lifted; the lifted concept's space at AB byte-equal to the transport's reading of the carried
// record; no `≡_`/`⟨` word on it; the record itself still holds the triad on its face (the reading is restricted, the record is
// not stripped) · §c THE DOOR: its side spaces carry no foot or respect type; its lines byte-equal with the respects struck ·
// §d THE CARGO: the room's roles are the transport's; what arrives is a role of the far corner · §e THE SEAL: the Ambo's own
// reading (no option) is byte-equal before and after — the identity regime stands on the surface.
//
// Run: node scripts/diagnose-modes1-the-transport.cjs

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
const check = (name, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `\n        ${detail}` : ''}`);
  if (!ok) failures += 1;
};
const note = (text) => console.log(`      · ${text}`);

const { spaceOf, TRANSPORT_OPTIONS } = req('src/lib/spaceOf.ts');
const { isFootType, isRespectType } = req('src/lib/feet.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { bornStepOf } = req('src/lib/bornFace.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const { liftedConceptOf } = req('src/manuscript/liftedConceptModel.ts');
const { sideOf } = req('src/manuscript/doorTransportModel.ts');
const { cargoRoomFrom, pickCargo, stepRod } = req('src/manuscript/cargoModel.ts');
const R = req('src/lib/respects.ts');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json'); const triangle = cast('triangle.cast.json');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const seeded4 = () => { let s = createSeedShape('tetrahedron'); for (const [l, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', triangle]]) s = withCast(s, byLabel(s, l), c); return s; };
const reset = (seeded) => useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], rules: [], liftSelection: [], selectedCellId: null, selectedVertexId: null, selectedEdgeId: null, selectedFaceId: null });
const E = (shape, X, Y) => edgeBetween(shape.edges, byLabel(shape, X), byLabel(shape, Y));
const give = (X, Y, map) => { const e = E(cur(), X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
const faceOf = (shape, labels) => { const ids = labels.map((l) => byLabel(shape, l)); return shape.faces.find((f) => f.vertexIds.length === ids.length && ids.every((id) => f.vertexIds.includes(id))) ?? null; };
const picksOf = (shape, labels, items) => labels.map((l, i) => ({ corner: byLabel(shape, l), item: items[i] }));
const midOf = (shape, u, v) => Object.values(shape.vertices).find((w) => w.createdBy.operation !== 'seed' && w.createdBy.sourceVertexIds.length === 2 && w.createdBy.sourceVertexIds.includes(u) && w.createdBy.sourceVertexIds.includes(v));
const bytes = (r) => (r ? J({ roles: r.space.roles, signature: r.space.signature, relations: r.space.relations, feet: r.feet.map((f) => [f.corner, [...f.map]]), respects: r.respects.length }) : 'null');
const foreign = (space) => space.signature.map((s) => s.type).filter((t) => isFootType(t) || isRespectType(t));

// ═══ §0 the option and the hands ═══
console.log('THE TRANSPORT — B6 (MODES-1)\n\n----- §0 the option, and the three models hand it to every resolver call -----');
check('§0 TRANSPORT_OPTIONS is the resolver\'s named reading: no respect read, no foot composed — and nothing else', J(TRANSPORT_OPTIONS) === J({ respects: false, feet: false }));
for (const [file, calls] of [['src/manuscript/doorTransportModel.ts', 2], ['src/manuscript/cargoModel.ts', 2], ['src/manuscript/liftedConceptModel.ts', 2]]) {
  const src = readLf(file);
  const resolverCalls = (src.match(/\b(spaceOf|bornStepOf)\(/g) || []).length;
  const handed = src.split('\n').filter((l) => /\b(spaceOf|bornStepOf)\(/.test(l) && /TRANSPORT_OPTIONS/.test(l)).length;
  check(`§0 ${file.split('/').pop()} hands TRANSPORT_OPTIONS to every resolver call (${calls} of ${calls}) and imports it from the resolver`, resolverCalls === calls && handed === calls && /TRANSPORT_OPTIONS.*from '\.\.\/lib\/spaceOf'/.test(src), J({ resolverCalls, handed }));
}

// ═══ §a the measurement: what rode before B6 ═══
console.log('\n----- §a what rode the transport before B6, named and counted -----');
reset(seeded4());
give('A', 'B', { F13: 'r8', F9: 'r1' });
give('A', 'C', { F13: 'Φ8', F9: 'Φ1', F3: 'Φ2' });
give('C', 'B', { Φ8: 'r0', Φ1: 'r1' });
S().giveTriad(faceOf(cur(), ['A', 'B', 'C']).id, 'role', picksOf(cur(), ['A', 'B', 'C'], ['F7', 'r0', 'Φ7']));
S().giveTriad(faceOf(cur(), ['A', 'B', 'D']).id, 'role', picksOf(cur(), ['A', 'B', 'D'], ['F7', 'r0', 'x']));
S().applyAmboDissectionToCurrent();
const G1 = cur(); const A1 = byLabel(G1, 'A'); const B1 = byLabel(G1, 'B'); const C1 = byLabel(G1, 'C');
const AB = midOf(G1, A1, B1);
const full = spaceOf(G1, AB.id);
const tr = spaceOf(G1, AB.id, TRANSPORT_OPTIONS);
const core = R.meetCoreOf(G1, E(G1, 'A', 'B'));
const meetPairs = core.roles.length - core.unconditional.roles.length;
const foreignFull = foreign(full.space);
const foreignTuples = full.space.relations.filter((r) => isFootType(r.type) || isRespectType(r.type)).length;
note(`full: ${full.space.roles.length} roles · ${full.space.signature.length} words · ${full.space.relations.length} tuples · feet ${full.feet.length} · respects ${full.respects.length} — transport: ${tr.space.roles.length} · ${tr.space.signature.length} · ${tr.space.relations.length} · feet ${tr.feet.length} · respects ${tr.respects.length} · meet pairs glued ${meetPairs} · foreign words ${J(foreignFull)}`);
check('§a ★★ WHAT RODE, NAMED: the full reading at AB carries the MEET PAIR the two lights compose (F7 ≡ r0, glued without a direct — one role fewer), the feet\'s words `≡_C` and `≡_D`, the respects\' word `⟨C⟩` and `⟨D⟩`, and their tuples; the transport\'s reading carries NONE of them — his two IS-instances alone', meetPairs === 1 && full.space.roles.length === tr.space.roles.length - 1 && foreignFull.length === 4 && foreign(tr.space).length === 0 && tr.feet.length === 0 && tr.respects.length === 0 && full.feet.length === 2 && full.respects.length === 2, J({ meetPairs, roles: [full.space.roles.length, tr.space.roles.length], foreignFull }));
check('§a ★★ AND NOTHING ELSE RODE: the word difference is exactly the foot and respect types, the tuple difference exactly their tuples plus the meet\'s (the pair\'s tuples read as one), the role difference exactly the meet', full.space.signature.length - tr.space.signature.length === foreignFull.length && full.space.relations.length - foreignTuples <= tr.space.relations.length && full.space.roles.length + meetPairs === tr.space.roles.length, J({ words: [full.space.signature.length, tr.space.signature.length], tuples: [full.space.relations.length, tr.space.relations.length, foreignTuples] }));

// ═══ §b the lift ═══
console.log('\n----- §b the lift rides IS-instances only; the record is not stripped -----');
S().selectCell(G1.cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(A1) && c.vertexIds.length === 4).id);
const beforeQ = useLiftStore.getState().queue.length;
S().liftSelectionToManuscript();
const entry = loadUniverseSnapshot(useLiftStore.getState().queue[beforeQ].file);
const form = placeShelfEntry(entry, 0);
const concept = liftedConceptOf(form, entry.loaded.ancestors ?? []);
const liftedAB = byLabel(concept.record, 'AB');
const row = concept.vertices.find((v) => v.id === liftedAB);
const liftedTr = spaceOf(concept.record, liftedAB, TRANSPORT_OPTIONS);
const liftedFull = spaceOf(concept.record, liftedAB);
check('§b ★★ THE LIFT: the lifted concept\'s card at AB carries the TRANSPORT\'s counts of the carried record — roles · words · tuples equal to `spaceOf(record, AB, TRANSPORT_OPTIONS)`, fewer words than the full reading (no `≡_`/`⟨` word, no meet pair); the same record read without the option still carries them (the reading is restricted, the record is not stripped — its faces still hold the two triads)', concept.state === 'read' && !!row && row.space === 'derived' && row.roles === liftedTr.space.roles.length && row.words === liftedTr.space.signature.length && row.tuples === liftedTr.space.relations.length && row.words < liftedFull.space.signature.length && foreign(liftedTr.space).length === 0 && foreign(liftedFull.space).length === 4 && concept.record.faces.filter((f) => R.triadsOn(f).roles.length > 0).length === 2, J({ state: concept.state, row: row && [row.space, row.roles, row.words, row.tuples], transport: [liftedTr.space.roles.length, liftedTr.space.signature.length, liftedTr.space.relations.length], fullWords: liftedFull.space.signature.length, recordForeign: foreign(liftedFull.space) }));

// ═══ §c the door ═══
console.log('\n----- §c the door -----');
const mAB = midOf(G1, A1, B1); const mAC = midOf(G1, A1, C1);
const cycle = [A1, mAB.id, mAC.id];
const side = sideOf(G1, cycle);
const struck = { ...G1, faces: G1.faces.map((f) => { if (!f.data || f.data.triads === undefined) return f; const { triads: _t, ...rest } = f.data; void _t; return Object.keys(rest).length ? { ...f, data: rest } : (({ data: _d, ...g }) => { void _d; return g; })(f); }) };
const sideStruck = sideOf(struck, cycle);
check('§c ★★ THE DOOR rides IS-instances only: the side A·AB·AC read on the record carries no foot or respect type in any corner\'s space, and its LINES are byte-equal to the same side read with every triad struck', side.state === 'read' && side.side.spaces.every((s) => foreign(s).length === 0) && sideStruck.state === 'read' && J(side.side.lines) === J(sideStruck.side.lines) && side.side.lines.length > 0, J({ state: side.state, foreign: side.state === 'read' ? side.side.spaces.map((s) => foreign(s).length) : null, lines: side.state === 'read' ? side.side.lines.length : null }));

// ═══ §d the cargo ═══
console.log('\n----- §d the cargo -----');
const roomOf = (shape) => cargoRoomFrom({ corners: cycle, roles: Object.fromEntries(cycle.map((v) => [v, spaceOf(shape, v, TRANSPORT_OPTIONS).space.roles])), J: (from, to) => bornStepOf(shape, from, to, TRANSPORT_OPTIONS, new Map())?.map ?? null, rods: [{ a: A1, b: mAB.id }, { a: mAB.id, b: mAC.id }, { a: mAC.id, b: A1 }], faces: [], doors: [] });
const room = roomOf(G1);
const carried = stepRod(room, pickCargo(room, A1, 'F13'), mAB.id);
check('§d ★★ THE CARGO rides IS-instances only: F13 carried along A–AB arrives as AB\'s class of F13 (a role of the far corner, never a `⟨X⟩` or `≡_X` word); the room\'s roles at AB are the transport\'s', carried.at !== null && carried.at.corner === mAB.id && tr.space.roles.some((r) => r.id === carried.at.role) && !isRespectType(carried.at.role) && !isFootType(carried.at.role), J(carried.at));

// ═══ §e the seal ═══
console.log('\n----- §e the seal: the Ambo\'s own reading stands -----');
check('§e THE AMBO\'S OWN SURFACE READS WITHOUT THE OPTION: `spaceOf(shape, AB)` still composes the feet and reads the respects — the identity regime stands as built (B6 touched no reader but the three models\' hands)', full.feet.length === 2 && full.respects.length === 2 && foreignFull.length === 4);
const surfSrc = readLf('src/components/MidpointSurface.tsx') + readLf('src/lib/spaceOf.ts');
check('§e no surface hands TRANSPORT_OPTIONS: it is the transport\'s alone (the manuscript\'s three models)', !/TRANSPORT_OPTIONS/.test(readLf('src/components/MidpointSurface.tsx')) && !/TRANSPORT_OPTIONS/.test(readLf('src/components/MediumBlock.tsx')) && surfSrc.length > 0);

console.log(`\n${failures === 0 ? 'DIAGNOSE-MODES1-THE-TRANSPORT: ALL PASS — the lift, the door and the cargo ride IS-instances only; what rode before is named (the meet pair, the feet\'s and the respects\' words and tuples) and nothing else did; the Ambo\'s own reading stands' : `DIAGNOSE-MODES1-THE-TRANSPORT: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
