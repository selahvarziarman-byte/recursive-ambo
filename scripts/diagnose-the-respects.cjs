#!/usr/bin/env node

// DIAGNOSTIC — THE RESPECTS (STAMP C-14, 2026-09-25 — Arman's Δ111 "yes, adopt it. go build"; ADR 0031 §3.11; the researcher's
// rulings §28–§31; the hermeneutic office's 1347 §2 and 1355 §3). A second GIVEN kind beside the pairing: the RESPECT
// `a ↦ b ⟨c⟩` on an edge, keyed by the face's opposite corner — holds-only, no one-to-one, INPUT. The person points a TRIAD
// (a, b, c) at a face as ONE act; it enters three respects, atomically. An edge's CORE `J_e` = his unconditional pairs ∪ the
// MEET of the respect-pairs of every light through it — re-derived at every read through the resolver's ONE reader, stored
// nowhere; conflicts left out and said; a meet pair that would break a born act held back and said. Each respect is READ
// against the core — HONORED · BROKEN (the leg named) · NOT YET — a mark, never a demand. THE REFERENCE, cited not re-derived:
// .handoff/instruments/connection_layer_reference/{triadic_act,respect_pairing_P2,meet_core_P6}.py and the fixture
// scripts/fixtures/meet_core_P6_configs.json (the instrument's own 4,000 draws, dumped once by gen_meet_core_P6_configs.py).
// src/lib/respects.ts is THE SECOND IMPLEMENTATION — a disagreement reopens the DEFINITION, never tunes.
//
// §0 the manifest and purity · §a THE RECORD (keyed by (edge, light), holds-only, malformed bytes unread and unerased; INPUT
//    through Export → text → Import) · §b THE ACT (three oriented legs; ATOMIC refusals by name; a respect binds no other face
//    and never answers or causes a refusal; the whole triad withdrawn by one hand) · §c THE MEET-CORE (one light ⇒ empty; both
//    lights ⇒ the core, the child glued over it; (i) left out and said, twice and against; (ii) held back naming the born act;
//    the P6 instrument reproduced over its own draws: 47 · 0 · 958; fences 1, 6, 7) · §d THE READINGS (NOT YET → HONORED →
//    BROKEN at each leg; marks only; the P2d census on the 42 hand triples by the port AND through the app: HONORED 6 ·
//    BROKEN 1,905 (A–C 1,161 · C–B 744) · NOT YET 195, with the instrument's own vacuous controls) · §e THE CARRY (the dissection
//    with the pairing, mirrored; the lift verbatim; the next pushout as foreign words; the door preserves and its lines never
//    read a respect; the cargo does not carry one) · §f the fences by source (2 · 3 · 4 · 5 · 6).
//
// ⛔ RECORD, NOT READING: nothing here stores a core or a verdict; every reading is re-derived at the read.

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

const { spaceOf, recordOn, brokenBornActs, cornerOfTag } = req('src/lib/spaceOf.ts');
const R = req('src/lib/respects.ts');
const { respectTypeName, isRespectType, isFootType } = req('src/lib/feet.ts');
const { insideOf } = req('src/lib/castInside.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { bornStepOf } = req('src/lib/bornFace.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const { liftedConceptOf } = req('src/manuscript/liftedConceptModel.ts');
const { sideOf } = req('src/manuscript/doorTransportModel.ts');
const { cargoRoomFrom, pickCargo, stepRod } = req('src/manuscript/cargoModel.ts');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json'); const triangle = cast('triangle.cast.json');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const labelOf = (shape, id) => shape.vertices[id]?.data.label || id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const reset = (seeded) => useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, liftSelection: [], selectedCellId: null, selectedVertexId: null, selectedEdgeId: null, selectedFaceId: null });
const E = (shape, X, Y) => edgeBetween(shape.edges, byLabel(shape, X), byLabel(shape, Y));
const give = (X, Y, map) => { const e = E(cur(), X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
const take = (X, Y, map) => { const e = E(cur(), X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().withdrawRolePair(e.id, x, y); else S().withdrawRolePair(e.id, y, x); } };
const inv = (m) => { const o = new Map(); for (const [k, v] of m) o.set(v, k); return o; };
const toMap = (o) => new Map(Object.entries(o));
const midpointOf = (shape, u, v) => Object.values(shape.vertices).find((w) => w.createdBy.operation !== 'seed' && w.createdBy.sourceVertexIds.length === 2 && w.createdBy.sourceVertexIds.includes(u) && w.createdBy.sourceVertexIds.includes(v));
const faceOf = (shape, labels) => { const ids = labels.map((l) => byLabel(shape, l)); return shape.faces.find((f) => f.vertexIds.length === ids.length && ids.every((id) => f.vertexIds.includes(id))) ?? null; };
/** the tuple as the edge holds it: (x of corner X, y of corner Y, z) oriented by the edge's own first corner */
const oriented = (e, X, Y, [x, y, z]) => (e.vertexIds[0] === X ? [x, y, z] : [y, x, z]);
const pairOn = (e, X, Y, [x, y]) => (e.vertexIds[0] === X ? [x, y] : [y, x]);
const picksOf = (shape, labels, items) => labels.map((l, i) => ({ corner: byLabel(shape, l), item: items[i] }));
const triad = (labels, items, kind = 'role') => S().giveTriad(faceOf(cur(), labels).id, kind, picksOf(cur(), labels, items));
const untriad = (labels, items, kind = 'role') => S().withdrawTriad(faceOf(cur(), labels).id, kind, picksOf(cur(), labels, items));
/** the record by the light's LABEL, for reading and comparing across shapes */
const recordOf = (shape, e) => Object.fromEntries([...R.respectsOn(shape, e)].map(([c, rec]) => [labelOf(shape, c), rec]).sort((p, q) => (p[0] < q[0] ? -1 : 1)));
const seeded4 = () => { let s = createSeedShape('tetrahedron'); for (const [l, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', triangle]]) s = withCast(s, byLabel(s, l), c); return s; };
const sameSet = (xs, ys) => xs.length === ys.length && xs.every((x) => ys.includes(x));
/** the shape with every respect struck from its edges — the A/B control at the record level */
const stripped = (shape) => ({ ...shape, faces: shape.faces.map((f) => { if (!f.data || f.data.triads === undefined) return f; const { triads: _r, ...rest } = f.data; void _r; if (Object.keys(rest).length) return { ...f, data: rest }; const { data: _d, ...ff } = f; void _d; return ff; }) });

console.log('THE RESPECTS — the triad, the meet-core and the readings (C-14)\n');

// ═══ §0 THE MANIFEST AND PURITY ═══
console.log('----- §0 the manifest and purity -----');
const manifest = readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt');
const respSrc = readLf('src/lib/respects.ts'); const spaceSrc = readLf('src/lib/spaceOf.ts'); const storeSrc = readLf('src/store/geometryStore.ts');
const amboSrc = readLf('src/lib/ambo.ts'); const feetSrc = readLf('src/lib/feet.ts'); const geomSrc = readLf('src/types/geometry.ts'); const cargoSrc = readLf('src/manuscript/cargoModel.ts'); const doorSrc = readLf('src/manuscript/doorTransportModel.ts');
check('§0 ★ THE HOME: respects.ts classified NOT_FROZEN at its landing (the C-14 row); feet.ts still a leaf (no import); geometry.ts (FROZEN) untouched by the record — it names no respect: the record lives in the FACE\'s open packet field `data.triads`, positional in the face\'s corner order, NO ID INSIDE (the C-13b precedent; the lift\'s namespace hop re-roots no key of it — measured at the first cut, where an edge-held record keyed by a corner id read `⟨vertex:tetrahedron:c⟩` in the carried record)',
  /^NOT_FROZEN src\/lib\/respects\.ts — C-14/m.test(manifest) && !/^import /m.test(feetSrc) && !/respect/i.test(geomSrc) && respSrc.includes("export const TRIADS_KEY = 'triads';") && respSrc.includes('face?.data?.[TRIADS_KEY]') && !/data\.respects|RESPECTS_KEY/.test(respSrc), '');
check('§0 ★ PURITY: respects.ts imports the types, the face\'s `edgeBetween`, the leaf\'s names, the glue\'s Midpoint type and the resolver (deferred across the cycle, nothing at module scope) — five import lines; no store, no component, no manuscript, no three; it writes no `.cast` and no `identification`; the store writes the record through `withTriad` / `withoutTriad` alone, on the face the act was pointed at (no `data.triads` literal there)',
  (respSrc.match(/^import /gm) || []).length === 5 && !/useGeometryStore|from '\.\.\/store|from '\.\.\/components|from '\.\.\/manuscript|from 'three'|@react-three|\.cast\s*=|identification\s*=/.test(respSrc) && storeSrc.includes('withTriad(f, kind, triad.record)') && storeSrc.includes('withoutTriad(f, kind, triad.record)') && !/data\.triads|TRIADS_KEY|data\.respects/.test(storeSrc),
  J(respSrc.match(/^import .*/gm) || []));

// ═══ §a THE RECORD ═══
console.log('\n----- §a the record: keyed by (edge, the opposite corner); holds-only; input -----');
reset(seeded4());
const s0 = cur(); const A0 = byLabel(s0, 'A'); const B0 = byLabel(s0, 'B'); const C0 = byLabel(s0, 'C'); const D0 = byLabel(s0, 'D');
const eAB0 = E(s0, 'A', 'B'); const fABC0 = faceOf(s0, ['A', 'B', 'C']); const fABD0 = faceOf(s0, ['A', 'B', 'D']);
const junk1 = { ...fABC0, data: { ...(fABC0.data ?? {}), triads: 'junk' } };
const junk2 = { ...fABC0, data: { ...(fABC0.data ?? {}), triads: { roles: [['F7', 'r0']], words: 'x' } } };
const shapeWith = (...fs) => ({ ...s0, faces: s0.faces.map((x) => fs.find((f) => f.id === x.id) ?? x) });
check('§a ★ POSITIVE CONTROL at the base (7abb8f7 — an edge\'s record was its `identification` alone; no reader of `respects` existed): every edge of the seed reads a TRUE ABSENCE — an empty map; no face carries the key; a malformed face entry (a string; a tuple of two) is NOT read and NOT erased — the bytes stay in the packet as they were',
  s0.edges.every((e) => R.respectsOn(s0, e).size === 0) && s0.faces.every((f) => f.data === undefined || f.data.triads === undefined) && R.respectsOn(shapeWith(junk1), eAB0).size === 0 && junk1.data.triads === 'junk' && R.respectsOn(shapeWith(junk2), eAB0).size === 0 && J(junk2.data.triads.roles) === J([['F7', 'r0']]) && R.respectsOn(s0, undefined).size === 0, '');
const tri = (f, x, y, z) => f.vertexIds.map((v) => (v === A0 ? x : v === B0 ? y : z)); // (x of A, y of B, z of the third) in the face's own corner order
const f1 = R.withTriad(fABC0, 'role', tri(fABC0, 'F7', 'r0', 'Φ1'));
const f1again = R.withTriad(f1, 'role', tri(fABC0, 'F7', 'r0', 'Φ1'));
const f2 = R.withTriad(f1, 'role', tri(fABC0, 'F7', 'r1', 'Φ1'));
const f3 = R.withTriad(fABD0, 'word', tri(fABD0, 'sustains', 'sustains', 'w'));
const f4 = R.withoutTriad(f2, 'role', tri(fABC0, 'F7', 'r1', 'Φ1'));
const f5 = R.withoutTriad(f4, 'role', tri(fABC0, 'F7', 'r0', 'Φ1'));
const readAB = (...fs) => R.respectsOn(shapeWith(...fs), eAB0);
const tAB0 = oriented(eAB0, A0, B0, ['F7', 'r0', 'Φ1']);
check('§a ★★ THE RECORD on the face, READ on the edge keyed by (edge, light): the triad (F7, r0, Φ1) on A·B·C — `face.data.triads.roles` holds it positional in the face\'s own corner order; A–B reads `F7 ↦ r0 ⟨Φ1⟩` under C (`hasRespect`, the tuple oriented as the edge holds its corners); the identical triad given again leaves the face AS IT IS (the same object); HOLDS-ONLY, no one-to-one: (F7, r1, Φ1) beside it — A–B holds two under C, nothing refused; a WORD triad on A·B·D reads on A–B under D, keyed apart; a withdrawal removes one triad and the last withdrawal leaves NO key — a true absence, never an empty placeholder',
  R.hasRespect(shapeWith(f1), eAB0, C0, 'role', tAB0) && J(f1.data.triads) === J({ roles: [tri(fABC0, 'F7', 'r0', 'Φ1')], words: [] }) && f1again === f1 && readAB(f2).get(C0).roles.length === 2 && readAB(f2, f3).get(D0).words.length === 1 && readAB(f2, f3).get(D0).roles.length === 0 && readAB(f2, f3).get(C0).words.length === 0 && readAB(f4).get(C0).roles.length === 1 && !R.hasRespect(shapeWith(f4), eAB0, C0, 'role', oriented(eAB0, A0, B0, ['F7', 'r1', 'Φ1'])) && readAB(f5).size === 0 && (f5.data === undefined || f5.data.triads === undefined) && R.respectsOn(s0, eAB0).size === 0,
  J({ f1: f1.data, f3: f3.data, f5: f5.data }));
// INPUT: through the store — Export → JSON text → a fresh workspace → Import (the reload; the store writes no other persistence — measured: no localStorage in the store)
const rA = triad(['A', 'B', 'C'], ['F7', 'r0', 'Φ1']);
const rW = triad(['A', 'B', 'C'], ['sustains', 'sustains', 'disjoins'], 'word'); // flow's `sustains`, the T cell's `sustains`, phi's `disjoins` — each a word of its corner
const beforeRT = { AB: recordOf(cur(), E(cur(), 'A', 'B')), AC: recordOf(cur(), E(cur(), 'A', 'C')), BC: recordOf(cur(), E(cur(), 'B', 'C')) };
const exported = S().exportWorkspace(); const text = JSON.stringify(exported);
reset(seeded4());
let importError = null;
try { S().importWorkspace(JSON.parse(text)); } catch (err) { importError = String(err && err.message ? err.message : err); }
const afterRT = importError ? null : { AB: recordOf(cur(), E(cur(), 'A', 'B')), AC: recordOf(cur(), E(cur(), 'A', 'C')), BC: recordOf(cur(), E(cur(), 'B', 'C')) };
note(`the words the store writes for persistence: ${J((storeSrc.match(/localStorage|sessionStorage|indexedDB/g) || []))} · export text carries "triads": ${text.includes('"triads"')} · import error: ${importError}`);
check('§a ★★ INPUT: a role triad and a word triad given through the store ride Export → JSON text → a fresh workspace → Import (the reload — the store writes no localStorage, so the export IS the persistence): the face\'s record rides the text and the three edges\' readings are byte-equal after the round trip, the store\'s two acts returned no refusal',
  rA === null && rW === null && importError === null && !/localStorage|sessionStorage|indexedDB/.test(storeSrc) && text.includes('"triads"') && J(afterRT) === J(beforeRT) && beforeRT.AB.C.roles.length === 1 && beforeRT.AB.C.words.length === 1,
  J({ beforeRT, afterRT, importError }));

// ═══ §b THE ACT ═══
console.log('\n----- §b the act: the triad as three respects, atomic -----');
reset(seeded4());
const s1 = cur(); const A = byLabel(s1, 'A'); const B = byLabel(s1, 'B'); const C = byLabel(s1, 'C'); const D = byLabel(s1, 'D');
const r1 = triad(['A', 'B', 'C'], ['F7', 'r0', 'Φ1']);
const eAB = E(cur(), 'A', 'B'); const eAC = E(cur(), 'A', 'C'); const eBC = E(cur(), 'B', 'C');
const tAB = oriented(eAB, A, B, ['F7', 'r0', 'Φ1']); const tAC = oriented(eAC, A, C, ['F7', 'Φ1', 'r0']); const tCB = oriented(eBC, C, B, ['Φ1', 'r0', 'F7']);
check('§b ★★ THE TRIAD AS RESPECTS: (F7, r0, Φ1) at A·B·C enters `F7 ↦ r0 ⟨Φ1⟩` on A–B, `F7 ↦ Φ1 ⟨r0⟩` on A–C and `Φ1 ↦ r0 ⟨F7⟩` on C–B — each under the light of the face\'s third corner, each tuple oriented as its edge holds its corners (the pairing\'s own convention), nothing on any other edge; ONE face record written (A·B·C\'s); the act returned no refusal',
  r1 === null && R.hasRespect(cur(), eAB, C, 'role', tAB) && R.hasRespect(cur(), eAC, B, 'role', tAC) && R.hasRespect(cur(), eBC, A, 'role', tCB) && [eAB, eAC, eBC].every((e) => R.respectsOn(cur(), e).size === 1 && [...R.respectsOn(cur(), e).values()][0].roles.length === 1) && cur().edges.filter((e) => R.respectsOn(cur(), e).size > 0).length === 3 && cur().faces.filter((f) => R.triadsOn(f).roles.length > 0).length === 1,
  J({ AB: recordOf(cur(), eAB), AC: recordOf(cur(), eAC), CB: recordOf(cur(), eBC) }));
const fABD = faceOf(cur(), ['A', 'B', 'D']);
const r2 = triad(['A', 'B', 'D'], ['F99', 'r0', 'x']);
const standingRefusal = S().triadRefusals[fABD.id];
S().withdrawTriadAttempt(fABD.id);
check('§b ★★ ATOMIC — a pick that is not a role of its corner refuses the WHOLE act, the pick named (corner A, `F99 is not a role of A`): no leg enters on A–B, A–D or B–D (A–B still holds C\'s respect alone); the refusal stands at the face until the attempt is withdrawn by its one hand',
  r2 !== null && r2.corner === A && r2.item === 'F99' && r2.why === 'F99 is not a role of A' && R.respectsOn(cur(), E(cur(), 'A', 'D')).size === 0 && R.respectsOn(cur(), E(cur(), 'B', 'D')).size === 0 && sameSet([...R.respectsOn(cur(), E(cur(), 'A', 'B')).keys()], [C]) && standingRefusal && standingRefusal.item === 'F99' && standingRefusal.picks.length === 3 && S().triadRefusals[fABD.id] === undefined,
  J({ r2, standingRefusal }));
let noD = createSeedShape('tetrahedron'); for (const [l, c] of [['A', flow], ['B', tcell], ['C', phi]]) noD = withCast(noD, byLabel(noD, l), c);
const r3 = R.triadOf(noD, faceOf(noD, ['A', 'B', 'D']).id, 'role', picksOf(noD, ['A', 'B', 'D'], ['F7', 'r0', 'x']));
const cube = createSeedShape('cube');
const r4 = R.triadLegsOf(cube, cube.faces[0].id, []);
const r5 = R.triadLegsOf(s1, faceOf(s1, ['A', 'B', 'C']).id, picksOf(s1, ['A', 'B'], ['F7', 'r0']));
check('§b ★★ ATOMIC — the other refusals, each by name: a corner holding no space (`D holds no space — nothing to point there`); a face of four corners (`a triad is pointed on a triangle — this face has 4 corners`); two picks (`one pick in each of the face\'s three corners makes the act` — the device never completes a triad from two legs, fence 2)',
  r3.refused && r3.refused.corner === byLabel(noD, 'D') && r3.refused.why === 'D holds no space — nothing to point there' && r4.refused && r4.refused.why === 'a triad is pointed on a triangle — this face has 4 corners' && r5.refused && r5.refused.why === "one pick in each of the face's three corners makes the act",
  J({ r3: r3.refused, r4: r4.refused, r5: r5.refused }));
// a respect never causes or answers a refusal, and binds no other face
S().giveRolePair(eAB.id, ...pairOn(eAB, A, B, ['F7', 'r1']));
const refusedPlain = S().midpointRefusals[eAB.id];
const r6 = triad(['A', 'B', 'C'], ['F8', 'r1', 'Φ2']);
const r7 = triad(['A', 'B', 'D'], ['F7', 'r0', 'x']);
check('§b ★★ A RESPECT NEVER CAUSES OR ANSWERS A REFUSAL, AND BINDS NO OTHER FACE: with `F7 ↦ r0 ⟨Φ1⟩` standing, the plain pair F7 ↦ r1 on A–B (against the respect\'s leg) is TAKEN by the register (no refusal); with r1 paired plain, the triad (F8, r1, Φ2) enters (no refusal — holds-only, no one-to-one); the triad at A·B·D speaks D\'s light on A–B and touches nothing of C\'s: A–B now holds C\'s two and D\'s one, A–D and B–D one each',
  refusedPlain === undefined && J(E(cur(), 'A', 'B').identification.roles) === J([pairOn(eAB, A, B, ['F7', 'r1'])]) && r6 === null && r7 === null && R.respectsOn(cur(), E(cur(), 'A', 'B')).get(C).roles.length === 2 && R.respectsOn(cur(), E(cur(), 'A', 'B')).get(D).roles.length === 1 && R.respectsOn(cur(), E(cur(), 'A', 'D')).size === 1 && R.respectsOn(cur(), E(cur(), 'B', 'D')).size === 1,
  J({ refusedPlain, AB: recordOf(cur(), E(cur(), 'A', 'B')) }));
untriad(['A', 'B', 'C'], ['F7', 'r0', 'Φ1']);
check('§b ★★ THE ONE HAND — `withdraw this triad` removes its three legs whole and nothing else: A–B keeps `F8 ↦ r1 ⟨Φ2⟩` under C and D\'s respect; A–C and C–B keep their (F8, r1, Φ2) legs alone',
  R.respectsOn(cur(), E(cur(), 'A', 'B')).get(C).roles.length === 1 && R.hasRespect(cur(), E(cur(), 'A', 'B'), C, 'role', oriented(E(cur(), 'A', 'B'), A, B, ['F8', 'r1', 'Φ2'])) && R.respectsOn(cur(), E(cur(), 'A', 'B')).get(D).roles.length === 1 && R.respectsOn(cur(), E(cur(), 'A', 'C')).get(B).roles.length === 1 && R.respectsOn(cur(), E(cur(), 'B', 'C')).get(A).roles.length === 1 && !R.hasRespect(cur(), E(cur(), 'A', 'C'), B, 'role', tAC),
  J({ AB: recordOf(cur(), E(cur(), 'A', 'B')), AC: recordOf(cur(), E(cur(), 'A', 'C')), BC: recordOf(cur(), E(cur(), 'B', 'C')) }));

// ═══ §c THE MEET-CORE ═══
console.log('\n----- §c the meet-core: re-derived at every read through the one reader -----');
reset(seeded4());
triad(['A', 'B', 'C'], ['F7', 'r0', 'Φ1']);
const core1 = R.meetCoreOf(cur(), E(cur(), 'A', 'B'));
check('§c ★★ ONE LIGHT ⇒ AN EMPTY MEET (the instrument\'s M2): with C\'s light alone spoken on A–B (D\'s face holds no respect) the meet is empty and the core = his unconditional pairs alone (none): lights {C, D}, spoken {C}; the resolver\'s one reader `recordOn` returns the same',
  sameSet(core1.lights.map((v) => labelOf(cur(), v)), ['C', 'D']) && J(core1.spoken.map((v) => labelOf(cur(), v))) === J(['C']) && core1.meet.roles.length === 0 && core1.roles.length === 0 && core1.types.length === 0 && J(recordOn(cur(), E(cur(), 'A', 'B'), {})) === J({ roles: [], types: [] }),
  J({ lights: core1.lights, spoken: core1.spoken, meet: core1.meet, roles: core1.roles }));
triad(['A', 'B', 'D'], ['F7', 'r0', 'x']);
const eABc = E(cur(), 'A', 'B'); const Ac = byLabel(cur(), 'A'); const Bc = byLabel(cur(), 'B');
const pairAB = pairOn(eABc, Ac, Bc, ['F7', 'r0']);
const core2 = R.meetCoreOf(cur(), eABc);
S().applyAmboDissectionToCurrent();
const G1c = cur(); const A1c = byLabel(G1c, 'A'); const B1c = byLabel(G1c, 'B');
const mABc = midpointOf(G1c, A1c, B1c);
const Rm = spaceOf(G1c, mABc.id); const RmNo = spaceOf(G1c, mABc.id, { respects: false });
const eAB1c = E(G1c, 'A', 'B'); const pairAB1 = pairOn(eAB1c, A1c, B1c, ['F7', 'r0']);
const merged = Rm.edge.midpoint.roles.find((r) => r.a === pairAB1[0] && r.b === pairAB1[1]);
check('§c ★★ BOTH LIGHTS ⇒ THE MEET ENTERS THE CORE (the instrument\'s M3): (F7, r0, x) at A·B·D speaks D\'s light with the same pair — the meet on A–B = {F7 ↦ r0}, the core = {F7 ↦ r0}, nothing left out, nothing held back; the dissection\'s born concept at AB is the PUSHOUT OVER THE CORE — F7 and r0 one class, `edge.born` the core, the resolution carrying the core with its lights {C, D} spoken; CONTROL `respects: false` — the core his unconditional pairs alone (none), the class not merged: 24 roles against 23',
  J(core2.meet.roles) === J([pairAB]) && J(core2.roles) === J([pairAB]) && core2.leftOut.length === 0 && core2.heldBack.length === 0 && !!merged && J(Rm.edge.born.roles) === J([pairAB1]) && J(Rm.core.roles) === J([pairAB1]) && sameSet(Rm.core.spoken.map((v) => labelOf(G1c, v)), ['C', 'D']) && Rm.space.roles.length === 23 && RmNo.space.roles.length === 24 && RmNo.edge.born.roles.length === 0 && RmNo.core.roles.length === 0,
  J({ meet: core2.meet, roles: core2.roles, born: Rm.edge.born, with: Rm.space.roles.length, without: RmNo.space.roles.length }));
check('§c ★★ FENCE 1 — ONE CORE PER EDGE, SHARED BY BOTH FACES, by construction: `meetCoreOf(shape, edge, options)` takes the EDGE and no face — the core read from either face\'s side is one read; FENCE 7 — never two born concepts on one edge: exactly one vertex of the dissection is born of {A, B}',
  respSrc.includes('export function meetCoreOf(shape: Shape, edge: Edge, options: SpaceOfOptions = {}): MeetCore') && Object.values(G1c.vertices).filter((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(A1c) && v.createdBy.sourceVertexIds.includes(B1c)).length === 1 && J(R.meetCoreOf(G1c, eAB1c).roles) === J(Rm.core.roles), '');
const cTags = [...Rm.roleContent.values()].flatMap((s) => [...s]).map((t) => labelOf(G1c, cornerOfTag(t)));
const respRels = Rm.space.relations.filter((r) => isRespectType(r.type));
const keys = new Set(Rm.space.roles.map((r) => r.id));
check('§c ★★ FENCE 6 — THE CHILD IS THE PUSHOUT OVER THE CORE AND `c` NEVER ENTERS IT: every role of M⁺_AB is content of A and B alone (no tag of C or D); the `⟨C⟩` and `⟨D⟩` tuples stand on M\'s points — their terms are M\'s own role keys, never Φ1 or x (the warrant is the record\'s, not a term)',
  cTags.every((l) => l === 'A' || l === 'B') && respRels.length === 2 && respRels.every((r) => r.terms.every((t) => keys.has(t)) && !r.terms.includes('Φ1') && !r.terms.includes('x')) && sameSet(respRels.map((r) => r.type), ['⟨C⟩', '⟨D⟩']),
  J({ corners: [...new Set(cTags)], respRels }));
// (i) left out and said
reset(seeded4());
triad(['A', 'B', 'C'], ['F7', 'r0', 'Φ1']); triad(['A', 'B', 'C'], ['F7', 'r1', 'Φ2']);
triad(['A', 'B', 'D'], ['F7', 'r0', 'x']); triad(['A', 'B', 'D'], ['F7', 'r1', 'y']);
const core3 = R.meetCoreOf(cur(), E(cur(), 'A', 'B'));
check('§c ★★ (i) LEFT OUT AND SAID — a meet pairing one role TWICE: both lights give F7 ↦ r0 and F7 ↦ r1 — the meet holds both, the core holds NEITHER, and both are said (`twice`, each with the other); the record itself untouched (two respects under each light)',
  core3.meet.roles.length === 2 && core3.roles.length === 0 && core3.leftOut.length === 2 && core3.leftOut.every((l) => l.why === 'twice' && l.kind === 'role') && R.respectsOn(cur(), E(cur(), 'A', 'B')).get(byLabel(cur(), 'C')).roles.length === 2 && R.respectsOn(cur(), E(cur(), 'A', 'B')).get(byLabel(cur(), 'D')).roles.length === 2,
  J(core3.leftOut));
reset(seeded4());
give('A', 'B', { F7: 'r1' });
triad(['A', 'B', 'C'], ['F7', 'r0', 'Φ1']); triad(['A', 'B', 'D'], ['F7', 'r0', 'x']);
const eAB4 = E(cur(), 'A', 'B'); const uncond4 = pairOn(eAB4, byLabel(cur(), 'A'), byLabel(cur(), 'B'), ['F7', 'r1']); const meet4 = pairOn(eAB4, byLabel(cur(), 'A'), byLabel(cur(), 'B'), ['F7', 'r0']);
const core4 = R.meetCoreOf(cur(), eAB4);
check('§c ★★ (i) LEFT OUT AND SAID — a meet pair AGAINST an unconditional one: F7 ↦ r1 given plain on A–B, both lights\' meet F7 ↦ r0 — left out (`unconditional`, with F7 ↦ r1); the core = the unconditional pair exactly as it is (the existing pairs stay core)',
  core4.leftOut.length === 1 && core4.leftOut[0].why === 'unconditional' && J(core4.leftOut[0].pair) === J(meet4) && J(core4.leftOut[0].with) === J(uncond4) && J(core4.roles) === J([uncond4]) && J(core4.unconditional.roles) === J([uncond4]),
  J(core4));
reset(seeded4());
give('A', 'B', { F7: 'r0' });
triad(['A', 'B', 'C'], ['F7', 'r0', 'Φ1']); triad(['A', 'B', 'D'], ['F7', 'r0', 'x']);
const core5 = R.meetCoreOf(cur(), E(cur(), 'A', 'B'));
check('§c ★ a meet pair the unconditional record already holds is core ONCE — not doubled, not a conflict', core5.roles.length === 1 && core5.leftOut.length === 0 && core5.meet.roles.length === 1, J(core5));
// (ii) the dependency reading — a meet pair that would break a born act is held back, naming it
reset(seeded4());
triad(['A', 'B', 'C'], ['F7', 'r0', 'Φ1']);
S().applyAmboDissectionToCurrent();
const G1d = cur();
S().selectCell(G1d.cells.find((c) => c.kind === 'core').id); S().applyAmboDissectionToCurrent();
const G2 = cur(); const A2 = byLabel(G2, 'A'); const B2 = byLabel(G2, 'B'); const C2 = byLabel(G2, 'C'); const D2 = byLabel(G2, 'D');
const eAB2 = edgeBetween(G2.edges, A2, B2);
const lights2 = R.lightsOf(G2, eAB2).map((v) => labelOf(G2, v));
const mAB2 = midpointOf(G2, A2, B2); const mAC2 = midpointOf(G2, A2, C2);
const eMed = edgeBetween(G2.edges, mAB2.id, mAC2.id);
const candidate = { edgeId: eAB2.id, roles: [pairOn(eAB2, A2, B2, ['F7', 'r0'])], types: [] };
const RAB2 = spaceOf(G2, mAB2.id); const RAC2 = spaceOf(G2, mAC2.id);
const xKey = [...RAB2.roleContent].find(([, tags]) => [...tags].some((t) => t === `${B2}|r0`))?.[0] ?? null; // r0's class at AB — the class the meet pair F7 ↦ r0 would re-house (A's roles at AB are composed-identified with A's at AC, so no born pair is lawful there)
const yKeys = [...RAC2.roleContent].filter(([, tags]) => [...tags].every((t) => cornerOfTag(t) === C2)).map(([k]) => k); // C's own classes at AC — news across the medial edge
let found = null; let tried = 0; let refusedTries = 0;
if (xKey !== null) {
  for (const yId of yKeys) {
    const pair = eMed.vertexIds[0] === mAB2.id ? [xKey, yId] : [yId, xKey];
    S().giveRolePair(eMed.id, pair[0], pair[1]); tried += 1;
    if (S().midpointRefusals[eMed.id]) { refusedTries += 1; S().withdrawMidpointAttempt(eMed.id); continue; }
    const broken = brokenBornActs(cur(), { candidate }, eAB2.id);
    if (broken.length > 0) { found = { pair, broken: broken[0] }; break; }
    S().withdrawRolePair(eMed.id, pair[0], pair[1]);
  }
}
note(`gen 2: the lights of A–B ${J(lights2)} · r0's class at AB ${xKey} · C's classes at AC ${yKeys.length} · born-pair tries on AB–AC ${tried} (${refusedTries} refused by the register) · found ${J(found)}`);
// the second light at gen 2: through the act when the shape holds the face A·B·D, else written on the record by the store's own writer
let secondLight = 'the act';
if (faceOf(cur(), ['A', 'B', 'D'])) { const r = triad(['A', 'B', 'D'], ['F7', 'r0', 'x']); if (r) secondLight = `refused: ${r.why}`; } else secondLight = 'no triangular face A·B·D on this shape';
void D2;
const core6 = R.meetCoreOf(cur(), edgeBetween(cur().edges, A2, B2));
const said6 = spaceOf(cur(), mAB2.id).core;
const standing6 = brokenBornActs(cur(), {}, null);
if (found) S().withdrawRolePair(eMed.id, found.pair[0], found.pair[1]);
const core6b = R.meetCoreOf(cur(), edgeBetween(cur().edges, A2, B2));
note(`the second light spoke by ${secondLight} · held back ${J(core6.heldBack.map((h) => ({ pair: h.pair, edge: h.bornAct.edgeId, born: h.bornAct.pair, why: h.bornAct.why })))} · standing born acts broken under the shape as it is: ${standing6.length} · after the born pair is withdrawn: core ${J(core6b.roles)}, held back ${core6b.heldBack.length}`);
check('§c ★★ (ii) THE DEPENDENCY READING — a meet pair that would break a born act is HELD BACK and SAID, naming the born act: at gen 2 a born pair stands on the medial edge AB–AC through r0\'s class at AB (paired with a C-role at AC); the second light then speaks F7 ↦ r0 on A–B — the meet holds it, the core does NOT (it would re-house r0 with F7 and break the born pair), `heldBack` names the medial edge and the pair, the resolution at AB says it; the born act stands unbroken under the shape as it is; COUNTERFACTUAL — the born pair withdrawn, the same meet pair enters the core',
  found !== null && secondLight === 'the act' && core6.meet.roles.length === 1 && core6.roles.length === 0 && core6.heldBack.length === 1 && core6.heldBack[0].bornAct.edgeId === eMed.id && J(core6.heldBack[0].bornAct.pair) === J(found.pair) && said6 && said6.heldBack.length === 1 && standing6.length === 0 && core6b.heldBack.length === 0 && J(core6b.roles) === J(candidate.roles),
  J({ found, secondLight, core6: { meet: core6.meet, roles: core6.roles, heldBack: core6.heldBack }, standing6: standing6.length, core6b: { roles: core6b.roles, heldBack: core6b.heldBack.length } }));
// the instrument's P6 over its own 4,000 draws
const configs = JSON.parse(readLf('scripts/fixtures/meet_core_P6_configs.json'));
let m1 = 0; let m2bad = 0; let m3 = 0; let m3one = 0; let twiceBoth = 0;
const t6 = Date.now();
for (const c of configs) {
  const rec = new Map([['C', c.t1.map(([a, , b]) => [String(a), String(b)])], ['D', c.t2.map(([a, , b]) => [String(a), String(b)])]]);
  const meet = R.meetPairsOf(rec, ['C', 'D']);
  const { kept, leftOut } = R.meetConflictsOf('role', meet, []);
  if (leftOut.some((l) => l.why === 'twice')) { m1 += 1; if (leftOut.every((l) => leftOut.some((o) => o !== l && J(o.pair) === J(l.with)))) twiceBoth += 1; }
  if (c.t2.length === 0 && meet.length > 0) m2bad += 1;
  if (meet.length > 0) m3 += 1;
  if (R.meetPairsOf(rec, ['C']).length > 0) m3one += 1;
  void kept;
}
note(`P6 over ${configs.length} draws in ${Date.now() - t6} ms: M1 ${m1} · M2 exceptions ${m2bad} · M3 ${m3} · one-light control ${m3one} · every 'twice' pair's partner also left out in ${twiceBoth} of ${m1}`);
check('§c ★★ THE RESEARCHER\'S P6 REPRODUCED over its own 4,000 draws (scripts/fixtures/meet_core_P6_configs.json — the instrument\'s RNG replayed, seed 391, dumped by scripts/fixtures/gen_meet_core_P6_configs.py): M1 the meet not one-to-one in 47 (each left out as `twice`, BOTH colliding pairs out), M2 a silent second face ⇒ an empty meet in every draw (0 exceptions), M3 the second face\'s respects move the core in 958; CONTROL — read with ONE light the meet would move the core in 4,000 of 4,000',
  configs.length === 4000 && m1 === 47 && twiceBoth === 47 && m2bad === 0 && m3 === 958 && m3one === 4000, J({ m1, twiceBoth, m2bad, m3, m3one }));

// ═══ §d THE READINGS ═══
console.log('\n----- §d the readings: each respect against the core, leg by leg — marks only -----');
reset(seeded4());
triad(['A', 'B', 'C'], ['F7', 'r0', 'Φ1']);
const readAt = () => R.readRespects(cur(), E(cur(), 'A', 'B'));
const legLabels = (leg) => leg.map((v) => labelOf(cur(), v));
const rd0 = readAt();
check('§d ★★ NOT YET: nothing paired on A–C or C–B — both legs OPEN, the verdict `NOT YET`, no leg named; the reading names its two legs {A, C} and {C, B}',
  rd0.length === 1 && rd0[0].verdict === 'NOT YET' && rd0[0].legs.every((l) => l.reading === 'OPEN') && rd0[0].brokenLeg === null && rd0[0].kind === 'role' && sameSet(legLabels(rd0[0].legs[0].edge).concat(legLabels(rd0[0].legs[1].edge)), ['A', 'C', 'C', 'B']), J(rd0));
give('A', 'C', { F7: 'Φ1' }); give('C', 'B', { Φ1: 'r0' });
const rdH = readAt();
check('§d ★★ HONORED: F7 ↦ Φ1 on A–C and Φ1 ↦ r0 on C–B — both legs KEPT against the core', rdH.length === 1 && rdH[0].verdict === 'HONORED' && rdH[0].legs.every((l) => l.reading === 'KEPT') && rdH[0].brokenLeg === null, J(rdH));
take('C', 'B', { Φ1: 'r0' }); give('C', 'B', { Φ1: 'r5' });
const rdB = readAt();
check('§d ★★ BROKEN AT C–B, the leg named: Φ1 ↦ r5 instead on C–B — that leg BROKEN, the other KEPT; `brokenLeg` = {C, B}; the reading has no field but corner · kind · tuple · legs · verdict · brokenLeg — nothing proposed, nothing to repair (marks only)',
  rdB[0].verdict === 'BROKEN' && sameSet(legLabels(rdB[0].brokenLeg), ['C', 'B']) && rdB[0].legs.some((l) => l.reading === 'KEPT') && rdB[0].legs.some((l) => l.reading === 'BROKEN') && J(Object.keys(rdB[0]).sort()) === J(['brokenLeg', 'corner', 'kind', 'legs', 'tuple', 'verdict']),
  J(rdB));
take('C', 'B', { Φ1: 'r5' }); give('C', 'B', { Φ1: 'r0' }); take('A', 'C', { F7: 'Φ1' }); give('A', 'C', { F7: 'Φ2' });
const rdB2 = readAt(); const refusedAC = S().midpointRefusals[E(cur(), 'A', 'C').id];
check('§d ★★ BROKEN AT A–C, the leg named: F7 ↦ Φ2 instead on A–C (taken by the register against the respect\'s leg — a respect never answers a refusal) — that leg BROKEN; `brokenLeg` = {A, C}',
  rdB2[0].verdict === 'BROKEN' && sameSet(legLabels(rdB2[0].brokenLeg), ['A', 'C']) && refusedAC === undefined, J({ rdB2, refusedAC }));
take('A', 'C', { F7: 'Φ2' }); give('A', 'C', { F7: 'Φ1' });
S().applyAmboDissectionToCurrent();
const G1r = cur(); const mAB1r = midpointOf(G1r, byLabel(G1r, 'A'), byLabel(G1r, 'B'));
const ridden = spaceOf(G1r, mAB1r.id).respects; const readDirect = R.readRespects(G1r, E(G1r, 'A', 'B'));
check('§d ★★ THE READINGS RIDE THE RESOLUTION: at gen 1 the born concept at AB carries the reading of the carried record — HONORED again, equal to the direct read of the edge; the control `respects: false` carries none',
  ridden.length === 1 && ridden[0].verdict === 'HONORED' && J(ridden) === J(readDirect) && spaceOf(G1r, mAB1r.id, { respects: false }).respects.length === 0, J({ ridden, readDirect }));
check('§d ★ Δ80 — the reading proposes nothing: respects.ts names no offer, proposal, candidate, repair or suggestion in its code (comments stripped); the store has no action that would mend a leg',
  !/offer|propos|candidate\b|repair|suggest|tied|rank/i.test(respSrc.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '').replace(/candidate/g, '')) && !/repair|mend/i.test(storeSrc.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')), '');
// the P2d census on the 42 hand triples — the port, then the app
const HAND_TF = { A: { r9: 'F8', r1: 'F7', r0: 'F1', r2: 'F12', r8: 'F13' }, "B'": { r9: 'F3', r1: 'F9', r0: 'F5', r7: 'F13', r8: 'F1', r2: 'F7' }, C: { r9: 'F12', r1: 'F13', r0: 'F9', r6: 'F1', r2: 'F3' }, D: { r9: 'F12', r1: 'F1', r0: 'F2', r7: 'F7', r2: 'F5' }, S1: { r0: 'F13', r1: 'F9', r2: 'F1', r4: 'F12', r6: 'F3', r8: 'F7' }, S4: { r0: 'F13', r1: 'F9', r2: 'F1', r6: 'F3', r7: 'F5', r8: 'F7' }, S2: { r0: 'F9', r1: 'F3', r2: 'F13', r6: 'F10', r7: 'F5', r8: 'F12' } };
const HAND_TP = { P: { r0: 'Φ1', r1: 'Φ2', r2: 'Φ7', r4: 'Φ5', r6: 'Φ3' }, Q: { r9: 'Φ6', r1: 'Φ1', r0: 'Φ8', r7: 'Φ5', r6: 'Φ2' }, R: { r0: 'Φ1', r1: 'Φ6', r7: 'Φ5', r2: 'Φ7', r4: 'Φ8' } };
const J_FP = { '(i)': { F7: 'Φ1', F8: 'Φ2', F5: 'Φ7' }, '(ii)': { F1: 'Φ3', F2: 'Φ2', F3: 'Φ4', F5: 'Φ1' } };
const phiRoles = phi.roles.map((r) => r.id);
const triples = [];
for (const tf of Object.keys(HAND_TF)) for (const tp of Object.keys(HAND_TP)) for (const fp of Object.keys(J_FP)) triples.push({ tf, tp, fp });
const censusPure = { HONORED: 0, BROKEN: 0, 'NOT YET': 0 }; const legPure = { 'A–C': 0, 'C–B': 0 };
let p2aN = 0; let p2aBad = 0; let p2cN = 0; let p2cBad = 0;
for (const { tf, tp, fp } of triples) {
  const J_AB = inv(toMap(HAND_TF[tf])); const J_AC = toMap(J_FP[fp]); const J_CB = inv(toMap(HAND_TP[tp]));
  for (const [a, b] of J_AB) for (const c of phiRoles) {
    const v = R.verdictOf(R.legReading(J_AC, a, c), R.legReading(J_CB, c, b));
    censusPure[v.verdict] += 1;
    if (v.brokenLeg !== null) legPure[v.brokenLeg === 0 ? 'A–C' : 'C–B'] += 1;
  }
  for (const a of flow.roles.map((r) => r.id)) {
    if (!J_AC.has(a) || !J_CB.has(J_AC.get(a))) continue;
    const c = J_AC.get(a); const b = J_CB.get(c); p2aN += 1;
    if (R.verdictOf(R.legReading(J_AC, a, c), R.legReading(J_CB, c, b)).verdict !== 'HONORED') p2aBad += 1;
    for (const c2 of phiRoles) { if (c2 === c) continue; p2cN += 1; if (R.verdictOf(R.legReading(J_AC, a, c2), R.legReading(J_CB, c2, b)).verdict === 'HONORED') p2cBad += 1; }
  }
}
note(`P2d by the port: ${J(censusPure)} · the broken leg ${J(legPure)} · P2a synthesized ${p2aBad} exceptions of ${p2aN} · P2c wrong respect honored ${p2cBad} of ${p2cN}`);
check('§d ★★ THE RESEARCHER\'S P2d REPRODUCED BY THE PORT (respect_pairing_P2.py — face flow · t-cell · phi, the 42 hand triples; every core pair (a, b) of A–B with every role c of phi as its respect): HONORED 6 · BROKEN 1,905 (A–C 1,161 · C–B 744) · NOT YET 195 — all three non-vacuous; the instrument\'s own vacuous controls hold (P2a respects synthesized from the legs all HONORED, 0 exceptions; P2c a wrong respect never HONORED, 0)',
  J(censusPure) === J({ HONORED: 6, BROKEN: 1905, 'NOT YET': 195 }) && J(legPure) === J({ 'A–C': 1161, 'C–B': 744 }) && p2aBad === 0 && p2cBad === 0 && p2aN > 0 && p2cN > 0, J({ censusPure, legPure, p2aN, p2aBad, p2cN, p2cBad }));
const censusApp = { HONORED: 0, BROKEN: 0, 'NOT YET': 0 }; const legApp = { 'A–C': 0, 'C–B': 0 };
let acts = 0; let refusedActs = 0; let unread = 0; let pairRefusals = 0;
const legKey = (shape, leg) => { const ls = leg.map((v) => labelOf(shape, v)); return ls.includes('A') ? 'A–C' : 'C–B'; };
const tD = Date.now();
for (const { tf, tp, fp } of triples) {
  reset(seeded4());
  give('A', 'B', Object.fromEntries(inv(toMap(HAND_TF[tf])))); give('A', 'C', J_FP[fp]); give('C', 'B', Object.fromEntries(inv(toMap(HAND_TP[tp]))));
  pairRefusals += Object.keys(S().midpointRefusals).length;
  const sh = cur(); const Aa = byLabel(sh, 'A'); const Ba = byLabel(sh, 'B'); const Ca = byLabel(sh, 'C'); const face = faceOf(sh, ['A', 'B', 'C']).id; const eABa = edgeBetween(sh.edges, Aa, Ba);
  for (const [a, b] of inv(toMap(HAND_TF[tf]))) for (const c of phiRoles) {
    const p = [{ corner: Aa, item: a }, { corner: Ba, item: b }, { corner: Ca, item: c }];
    const ref = S().giveTriad(face, 'role', p); acts += 1;
    if (ref) { refusedActs += 1; continue; }
    const rd = R.readRespects(cur(), edgeBetween(cur().edges, Aa, Ba));
    const mine = rd.find((x) => x.corner === Ca && J(x.tuple) === J(oriented(eABa, Aa, Ba, [a, b, c])));
    if (!mine) { unread += 1; S().withdrawTriad(face, 'role', p); continue; }
    censusApp[mine.verdict] += 1;
    if (mine.brokenLeg) legApp[legKey(cur(), mine.brokenLeg)] += 1;
    S().withdrawTriad(face, 'role', p);
  }
}
note(`P2d through the app (${Date.now() - tD} ms): ${J(censusApp)} · the broken leg ${J(legApp)} · acts ${acts} (${refusedActs} refused, ${unread} unread) · pairing refusals while setting the 42 ${pairRefusals}`);
check('§d ★★ THE SAME CENSUS THROUGH THE APP — the second implementation: each of the 2,106 respects given as a TRIAD through the store at A·B·C (its three legs entered, the two other legs one light each — no meet moves), read on A–B by `readRespects`, withdrawn: HONORED 6 · BROKEN 1,905 (A–C 1,161 · C–B 744) · NOT YET 195 — number for number; 0 acts refused, 0 pairing refusals while setting the triples',
  acts === 2106 && refusedActs === 0 && unread === 0 && pairRefusals === 0 && J(censusApp) === J({ HONORED: 6, BROKEN: 1905, 'NOT YET': 195 }) && J(legApp) === J({ 'A–C': 1161, 'C–B': 744 }), J({ censusApp, legApp, acts, refusedActs, unread, pairRefusals }));

// ═══ §e THE CARRY ═══
console.log('\n----- §e the carry: the dissection, the lift, the next pushout, the door, the cargo -----');
reset(seeded4());
triad(['A', 'B', 'C'], ['F7', 'r0', 'Φ1']);
const s3 = cur(); const eAB3 = E(s3, 'A', 'B'); const rec3 = recordOf(s3, eAB3);
S().applyAmboDissectionToCurrent();
const G1 = cur(); const A1 = byLabel(G1, 'A'); const B1 = byLabel(G1, 'B'); const C1 = byLabel(G1, 'C');
const eAB1 = E(G1, 'A', 'B'); const mirrored = eAB1.vertexIds[0] !== eAB3.vertexIds[0];
const rec1 = recordOf(G1, eAB1);
const expected1 = { C: { roles: [oriented(eAB1, A1, B1, ['F7', 'r0', 'Φ1'])], words: [] } };
const keyed = [...R.respectsOn(G1, eAB1).keys()];
const carriedFace = G1.faces.find((f) => R.triadsOn(f).roles.length > 0);
check(`§e ★★ THE DISSECTION CARRIES THE RECORD: the dissected cell\'s face A·B·C becomes a parent-cell-face carrying the triad positional in the same corner order (one face record in the child, on a parent-cell-face); A–B reads it keyed by C (a vertex of the child), the tuple oriented by the child\'s own edge (measured: the pair walked the other way = ${mirrored} — the orientation follows from the face at the read, no stored mirror); A–C and C–B read alike; a face that held none carries none`,
  J(rec1) === J(expected1) && J(rec3) === J({ C: { roles: [oriented(eAB3, byLabel(s3, 'A'), byLabel(s3, 'B'), ['F7', 'r0', 'Φ1'])], words: [] } }) && keyed.length === 1 && G1.vertices[keyed[0]] && labelOf(G1, keyed[0]) === 'C' && R.respectsOn(G1, E(G1, 'A', 'C')).size === 1 && R.respectsOn(G1, E(G1, 'B', 'C')).size === 1 && R.respectsOn(G1, E(G1, 'A', 'D')).size === 0 && G1.edges.filter((e) => R.respectsOn(G1, e).size > 0).length === 3 && G1.faces.filter((f) => R.triadsOn(f).roles.length > 0).length === 1 && carriedFace.role === 'parent-cell-face' && amboSrc.includes('const triads = carriedTriads(face.data);'),
  J({ rec3, rec1, mirrored, carriedFace: carriedFace ? [carriedFace.role, carriedFace.data] : null }));
// the lift, verbatim
S().selectCell(G1.cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(A1) && c.vertexIds.length === 4).id);
const beforeQ = useLiftStore.getState().queue.length;
S().liftSelectionToManuscript();
const entry = loadUniverseSnapshot(useLiftStore.getState().queue[beforeQ].file);
const form = placeShelfEntry(entry, 0);
const concept = liftedConceptOf(form, entry.loaded.ancestors ?? []);
const liftedAB = E(concept.record, 'A', 'B');
const liftedRec = liftedAB ? recordOf(concept.record, liftedAB) : null;
const liftedSpace = spaceOf(concept.record, byLabel(concept.record, 'AB'));
check('§e ★★ THE LIFT CARRIES THE RECORD VERBATIM: the residue at A lifted to the manuscript, the carried record (the ancestor, its ids re-rooted by the loader, its packets verbatim) holds ONE face record — the parent-cell-face A·B·C with the same bytes — and its edge A–B reads the same respect under C (the light a vertex of the carried record, by label); the concept read on it carries `⟨C⟩` on AB with its one tuple, and the same NOT YET reading',
  concept.state === 'read' && liftedRec !== null && J(liftedRec) === J(rec1) && concept.record.faces.filter((f) => R.triadsOn(f).roles.length > 0).length === 1 && J(R.triadsOn(concept.record.faces.find((f) => R.triadsOn(f).roles.length > 0))) === J(R.triadsOn(carriedFace)) && Object.keys(liftedRec).join() === 'C' && liftedSpace.space.signature.some((s) => s.type === '⟨C⟩') && liftedSpace.space.relations.filter((r) => r.type === '⟨C⟩').length === 1 && liftedSpace.respects.length === 1 && liftedSpace.respects[0].verdict === 'NOT YET',
  J({ state: concept.state, liftedRec, sig: liftedSpace.space.signature.filter((s) => isRespectType(s.type)) }));
// the next pushout: foreign words
S().selectCell(G1.cells.find((c) => c.kind === 'core').id); S().applyAmboDissectionToCurrent();
const G2e = cur(); const ABAC = byLabel(G2e, 'ABAC');
const P = spaceOf(G2e, ABAC); const Pno = spaceOf(G2e, ABAC, { respects: false });
const respectWords = P.space.signature.map((s) => s.type).filter(isRespectType);
const AB1s = spaceOf(G1, midpointOf(G1, A1, B1).id); const AB1n = spaceOf(G1, midpointOf(G1, A1, B1).id, { respects: false });
note(`gen 1 AB: words ${AB1n.space.signature.length} → ${AB1s.space.signature.length}, tuples ${AB1n.space.relations.length} → ${AB1s.space.relations.length} · gen 2 ABAC: the respect words ${J(respectWords)} · words ${Pno.space.signature.length} → ${P.space.signature.length}, tuples ${Pno.space.relations.length} → ${P.space.relations.length} · ABAC's own respects ${P.respects.length}`);
check('§e ★★ THE NEXT PUSHOUT CARRIES THE PARENTS\' RESPECT TYPES AS FOREIGN WORDS (Δ80 — never shared by spelling): at ABAC the words read `⟨C⟩` (AB\'s) and `⟨B⟩` (AC\'s), one tuple each; ABAC\'s OWN respects are none (no respect on the medial edge); the numbers moved by the respects alone — at gen 1 AB one word and one tuple over the control, at gen 2 two words and two tuples',
  sameSet(respectWords, ['⟨C⟩', '⟨B⟩']) && P.space.relations.filter((r) => isRespectType(r.type)).length === 2 && P.respects.length === 0 && P.space.signature.length - Pno.space.signature.length === 2 && P.space.relations.length - Pno.space.relations.length === 2 && AB1s.space.signature.length - AB1n.space.signature.length === 1 && AB1s.space.relations.length - AB1n.space.relations.length === 1 && P.feet.length === Pno.feet.length,
  J({ respectWords, own: P.respects.length, words: [Pno.space.signature.length, P.space.signature.length], tuples: [Pno.space.relations.length, P.space.relations.length] }));
// the door preserves; its lines never read a respect (fence 5)
const mAB1 = midpointOf(G1, A1, B1); const mAC1 = midpointOf(G1, A1, C1);
const cycle = [A1, mAB1.id, mAC1.id];
const sideWith = sideOf(G1, cycle); const sideWithout = sideOf(stripped(G1), cycle);
const linesOfSide = (s) => (s.state === 'read' ? J(s.side.lines) : null);
const AB1idx = 1;
check('§e ★★ THE DOOR PRESERVES THE RESPECTS AND ITS LINES NEVER READ ONE (fence 5): the side A·AB·AC read on the record with the respects and on the same record with them struck — the LINES byte-equal (a single-light respect glues nothing; the lines are drawn from the core and the roles), the side\'s space at AB carrying `⟨C⟩` with its tuple in the one and not the other (the space is M⁺, preserved through the door)',
  sideWith.state === 'read' && sideWithout.state === 'read' && linesOfSide(sideWith) === linesOfSide(sideWithout) && sideWith.side.lines.length > 0 && sideWith.side.spaces[AB1idx].signature.some((s) => s.type === '⟨C⟩') && !sideWithout.side.spaces[AB1idx].signature.some((s) => s.type === '⟨C⟩') && J(sideWith.side.J.map((m) => [...m])) === J(sideWithout.side.J.map((m) => [...m])),
  J({ with: sideWith.state, without: sideWithout.state, lines: sideWith.state === 'read' ? sideWith.side.lines.length : null }));
// the cargo does not carry them
const roomOf = (shape) => cargoRoomFrom({ corners: cycle, roles: Object.fromEntries(cycle.map((v) => [v, spaceOf(shape, v).space.roles])), J: (from, to) => bornStepOf(shape, from, to, {}, new Map())?.map ?? null, rods: [{ a: A1, b: mAB1.id }, { a: mAB1.id, b: mAC1.id }, { a: mAC1.id, b: A1 }], faces: [], doors: [] });
const roomWith = roomOf(G1); const roomWithout = roomOf(stripped(G1));
const carriedWith = stepRod(roomWith, pickCargo(roomWith, A1, 'F7'), mAB1.id); const carriedWithout = stepRod(roomWithout, pickCargo(roomWithout, A1, 'F7'), mAB1.id);
check('§e ★★ THE CARGO DOES NOT CARRY A RESPECT: F7 carried along A–AB arrives as AB\'s class of F7 by the rod\'s J — the same arrival on the record with the respects and with them struck; what arrives is a ROLE of the far corner, never a `⟨X⟩` type; the cargo model names no respect in its code',
  carriedWith.at !== null && J(carriedWith.at) === J(carriedWithout.at) && carriedWith.at.corner === mAB1.id && spaceOf(G1, mAB1.id).space.roles.some((r) => r.id === carriedWith.at.role) && !isRespectType(carriedWith.at.role) && !/respect|⟨/.test(cargoSrc) && !/respect|⟨/.test(doorSrc),
  J({ carriedWith: carriedWith.at, carriedWithout: carriedWithout.at }));
const inside1 = insideOf(spaceOf(G1, mAB1.id).space);
check('§e ★ THE DRAWING: the inside builder counts the respects\' tuples for the census and draws none (the designer\'s ruling on part f — the respect is read in words — `⟨C⟩` stands in the word list and in no point, arc, loop or node); the feet\'s count untouched',
  inside1.census.respects === 1 && inside1.census.feet === insideOf(spaceOf(G1, mAB1.id, { respects: false }).space).census.feet && inside1.words.includes('⟨C⟩') && !J({ points: inside1.points, arcs: inside1.arcs, loops: inside1.loops, nodes: inside1.nodes, unplaced: inside1.unplaced }).includes('⟨'), J(inside1.census));

// ═══ §f THE FENCES BY SOURCE ═══
console.log('\n----- §f the fences, by source -----');
const srcFiles = [];
const walk = (d) => { for (const ent of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, ent.name); if (ent.isDirectory()) walk(f); else if (/\.tsx?$/.test(ent.name)) srcFiles.push(path.relative(repoRoot, f).split(path.sep).join('/')); } };
walk(path.join(repoRoot, 'src'));
const mentioning = (re) => srcFiles.filter((f) => re.test(readLf(f)));
const writers = mentioning(/withTriad\(|withoutTriad\(/);
const actCallers = mentioning(/giveTriad\(/);
const recordTouchers = mentioning(/TRIADS_KEY|data\??\.triads\b/); // the packet's key — a bench's own `.triads` field (medialHubTriadicClosureBenchV0) is another vocabulary
note(`writers of the record ${J(writers)} · callers of the act ${J(actCallers)} · files touching the record's key ${J(recordTouchers)}`);
check('§f ★★ FENCES 2 · 3 · 4 — NO DEVICE-NAMED RESPECT, NONE COMPLETED FROM TWO LEGS, NONE SYNTHESIZED FROM THE LEGS: the record\'s only writers are respects.ts (`withTriad` / `withoutTriad`, on the person\'s triad) and the store\'s triad act, which takes the person\'s three picks and nothing else (`triadLegsOf` demands three, one per corner; the tuples are built from the picks alone — `itemAt` — and respects.ts reads no J to make one: no `bornStepOf`, no `.map.get`); the act has NO caller under src until the surface (part f — re-pinned there); the key `triads` is touched by respects.ts and the carrier (ambo.ts) alone',
  sameSet(writers, ['src/lib/respects.ts', 'src/store/geometryStore.ts']) && actCallers.length === 0 && respSrc.includes("if (picks.length !== 3 || new Set(picks.map((p) => p.corner)).size !== 3") && respSrc.includes('tuple: [itemAt.get(first) as string, itemAt.get(second) as string, itemAt.get(Z) as string]') && !/bornStepOf|\.map\.get/.test(respSrc) && sameSet(recordTouchers, ['src/lib/respects.ts', 'src/lib/ambo.ts']),
  J({ writers, actCallers, recordTouchers }));
check('§f ★★ FENCE 5 · 6 BY CONSTRUCTION: the resolver glues the child over THE CORE and nothing else — `born` is the core\'s roles and types, handed to `glue` beside the composed identity; `recordOn` returns the core\'s pairs; the respect enters the space only as `⟨X⟩` tuples on M\'s points through `respectLinksOf` (never a pairing); the door reads J through `bornStepOf` (the core) and lines from roles — respects.ts and feet.ts are imported by no manuscript file',
  spaceSrc.includes("const core = e && kind !== 'corner' ? meetCoreOf(shape, e, options) : null;") && spaceSrc.includes('const born = core ? { roles: core.roles, types: core.types } : { roles: [], types: [] };') && spaceSrc.includes('let result = glue(U.space, V.space, [...composed.roles, ...born.roles], [...composed.words, ...born.types]);') && spaceSrc.includes('return { roles: core.roles, types: core.types };') && spaceSrc.includes('space: withRespects(withFeet(g.space, feet), respectLinks),') && mentioning(/from '\.\.\/lib\/respects'|from '\.\.\/lib\/feet'/).every((f) => !f.startsWith('src/manuscript/')),
  '');

console.log(`\nDIAGNOSE-THE-RESPECTS: ${failures === 0 ? 'ALL PASS — the respect is a record keyed by its light, the triad enters it whole or not at all, the core is the meet re-derived at every read with its conflicts and its held-back pairs said, the readings are marks, and the carry follows the pairing\'s' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
