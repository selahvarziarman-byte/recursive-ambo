#!/usr/bin/env node

// DIAGNOSTIC — STAMP MODES-1 · B1 (2026-09-26): THE EDGE RECORD IN MODES (the projection ruling D1–D3, D12; the mothership's
// step-0 ruling: design (A), the packet home, no vertex id in any packet). §0 purity · §a THE ONE READER on bare edges (the
// pairing read as IS-instances, the packet as the rest, a candidate in place of the pairing, malformed items dropped) · §b THE
// ACTS through the store (declare, give, refuse, the IS-instance routed to the pairing, a bar, replace, withdraw) · §c THE
// LEXICON (IS · declared · in use) · §d THE ROUND TRIP (Export → a FRESH store → Import; a file before B1; the permanent control)
// · §e THE LIFT (the packet crosses the loader's namespace hop verbatim) · §f THE DISSECTION (carried mirrored exactly as the
// record is) · §g THE SEAL — the existing readers read as before with the packet present (B1 exposes nothing to the core) and
// every IS-instance is exactly a pair of the pairing in force, on the seeded tetrahedron and on Virgin Land's record · §h THE
// CENSUS — every `.identification` site named; the packet's writers named.
//
// Run: node scripts/diagnose-modes1-the-edge-in-modes.cjs

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

const M = req('src/lib/relatings.ts');
const R = req('src/lib/respects.ts');
const { spaceOf, recordOn } = req('src/lib/spaceOf.ts');
const { readStep, edgeBetween } = req('src/lib/faceReading.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { parseWorkspaceImport } = req('src/lib/workspacePersistence.ts');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json'); const triangle = cast('triangle.cast.json');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const reset = (seeded) => useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], liftSelection: [], selectedCellId: null, selectedVertexId: null, selectedEdgeId: null, selectedFaceId: null });
const E = (shape, X, Y) => edgeBetween(shape.edges, byLabel(shape, X), byLabel(shape, Y));
const seeded4 = () => { let s = createSeedShape('tetrahedron'); for (const [l, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', triangle]]) s = withCast(s, byLabel(s, l), c); return s; };
const rolesAt = (shape, L) => spaceOf(shape, byLabel(shape, L)).space.roles.map((r) => r.id);
/** the relating as the EDGE stores it, from the two labels' roles: (w, x of X, y of Y) oriented by the edge's first corner */
const on = (e, X, Y, w, x, y, sign) => (e.vertexIds[0] === X ? [w, x, y, sign] : [w, y, x, sign]);

// ═══ §0 PURITY ═══
console.log('THE EDGE IN MODES — B1 (MODES-1)\n\n----- §0 purity -----');
const src = readLf('src/lib/relatings.ts');
check('§0 relatings.ts is react-free and store-free: its imports are the types, the respects (the base read) and the resolver, and nothing else', (src.match(/^import /gm) || []).length === 3 && !/useGeometryStore|from '\.\.\/store|from '\.\.\/components|from '\.\.\/manuscript|from 'react'|from 'three'|@react-three/.test(src));
check('§0 the module reads the pairing through the resolver\'s base read and never touches `.identification` itself (the census stays where it is)', !/\.identification\b|EdgeIdentification/.test(src) && src.includes('unconditionalOn(e, options)'));
check('§0 NO VERTEX ID IN ANY PACKET, by construction: the module writes `[w, x, y, sign]` items and nothing else into `data.relatings` (no `vertexIds`, no `corner`, no id field in the record)', /const copy = \(r: Relating\): Relating => \[r\[0\], r\[1\], r\[2\], r\[3\]\];/.test(src) && !/vertexIds|VertexId\]/.test(src.slice(src.indexOf('function writeHeld'), src.indexOf('export function carriedRelatings'))));

// ═══ §a THE ONE READER on bare edges ═══
console.log('\n----- §a the one reader -----');
const bare = (identification, data) => ({ id: 'e', vertexIds: ['a', 'b'], sourceVertexIds: ['a', 'b'], ...(identification ? { identification } : {}), ...(data ? { data } : {}) });
check('§a the pairing in force reads as IS-instances, in the person\'s order: `roles [[F7,r0],[F8,r1]]` → `(IS,F7,r0,+) (IS,F8,r1,+)`', J(M.relatingsOn(bare({ roles: [['F7', 'r0'], ['F8', 'r1']], types: [] }))) === J([['IS', 'F7', 'r0', '+'], ['IS', 'F8', 'r1', '+']]));
check('§a an edge with no record and no packet reads as NO relating (a true absence, an empty list)', J(M.relatingsOn(bare(undefined, undefined))) === '[]' && J(M.relatingsOn(undefined)) === '[]');
const packet = { relatings: [['carries', 'F7', 'r1', '+'], ['IS', 'F7', 'r2', '-'], ['resists', 'F8', 'r0', '-']] };
const both = M.relatingsOn(bare({ roles: [['F7', 'r0']], types: [] }, packet));
check('§a the packet\'s relatings follow the IS-instances: the other modes and the bars (an IS bar among them)', J(both) === J([['IS', 'F7', 'r0', '+'], ['carries', 'F7', 'r1', '+'], ['IS', 'F7', 'r2', '-'], ['resists', 'F8', 'r0', '-']]), J(both));
check('§a instancesOn / barsOn / modesOn split and name them', J(M.instancesOn(bare({ roles: [['F7', 'r0']], types: [] }, packet)).map((r) => r[0] + ':' + r[1] + r[2])) === J(['IS:F7r0', 'carries:F7r1']) && J(M.barsOn(bare(undefined, packet)).map((r) => r[0])) === J(['IS', 'resists']) && J(M.modesOn(bare({ roles: [['F7', 'r0']], types: [] }, packet))) === J(['IS', 'carries', 'resists']));
const malformed = { relatings: [['carries', 'F7', 'r1', '+'], ['carries', 'F7', 'r1'], ['carries', 7, 'r1', '+'], ['', 'F7', 'r1', '+'], ['carries', 'F7', 'r1', '?'], 'x', null] };
check('§a a malformed packet item is not read into the record (a 3-tuple, a number, an empty word, a sign that is neither, a string, null): only the well-formed item reads', J(M.relatingsHeld(bare(undefined, malformed))) === J([['carries', 'F7', 'r1', '+']]));
check('§a a CANDIDATE record on the edge (C-8 item 4, the read a candidate act makes) is read in place of the pairing, the packet unchanged', J(M.relatingsOn(bare({ roles: [['F7', 'r0']], types: [] }, packet), { candidate: { edgeId: 'e', roles: [['F9', 'r9']], types: [] } }).slice(0, 2)) === J([['IS', 'F9', 'r9', '+'], ['carries', 'F7', 'r1', '+']]));
check('§a a packet entry (IS, a, b, +) that a foreign file might carry reads once, beside the pairing (never doubled when the pairing holds the same pair)', J(M.relatingsOn(bare({ roles: [['F7', 'r0']], types: [] }, { relatings: [['IS', 'F7', 'r0', '+'], ['IS', 'F7', 'r3', '+']] }))) === J([['IS', 'F7', 'r0', '+'], ['IS', 'F7', 'r3', '+']]));
const e0 = bare(undefined, undefined);
const e1 = M.withRelating(e0, ['carries', 'F7', 'r1', '+']);
const e2 = M.withRelating(e1, ['carries', 'F7', 'r1', '-']);
const e3 = M.withoutRelating(e2, 'carries', 'F7', 'r1');
check('§a the pure writers: set → one item; the same entry with the other sign REPLACES it (one entry per (w, x, y)); withdrawn → no key left behind (no `data` at all when nothing else is held)', J(M.relatingsHeld(e1)) === J([['carries', 'F7', 'r1', '+']]) && J(M.relatingsHeld(e2)) === J([['carries', 'F7', 'r1', '-']]) && M.relatingsHeld(e3).length === 0 && e3.data === undefined && M.withRelating(e1, ['carries', 'F7', 'r1', '+']) === e1);

// ═══ §b THE ACTS through the store ═══
console.log('\n----- §b the acts -----');
reset(seeded4());
const s0 = cur(); const A = byLabel(s0, 'A'); const B = byLabel(s0, 'B');
const eAB = E(s0, 'A', 'B');
const [a1, a2] = rolesAt(s0, 'A'); const [b1, b2] = rolesAt(s0, 'B');
note(`A's roles ${rolesAt(s0, 'A').length} (${a1}, ${a2}, …) · B's roles ${rolesAt(s0, 'B').length} (${b1}, ${b2}, …) · A–B stored ${eAB.vertexIds[0] === A ? 'A→B' : 'B→A'}`);
S().declareMode('carries');
S().declareMode('carries');
S().declareMode(' ');
S().declareMode('IS');
check('§b declareMode: a word once (a repeat, a blank and IS are not added)', J(S().lexicon) === J(['carries']));
const r1 = S().giveRelating(eAB.id, 'carries', ...(eAB.vertexIds[0] === A ? [a1, b1] : [b1, a1]), '+');
const held1 = M.relatingsHeld(E(cur(), 'A', 'B'));
check('§b giveRelating writes ONE relating into the edge\'s packet, read back by the one reader (no pairing on the edge, so it is the only relating)', r1 === null && J(held1) === J([on(eAB, A, B, 'carries', a1, b1, '+')]) && J(M.relatingsOn(E(cur(), 'A', 'B'))) === J(held1), J(held1));
const bad = S().giveRelating(eAB.id, 'carries', ...(eAB.vertexIds[0] === A ? ['nope', b1] : [b1, 'nope']), '+');
check('§b a relating whose role is not of its corner is REFUSED whole, the pick named, nothing written, the refusal held beside the edge until withdrawn', bad !== null && /is not a role of/.test(bad.why) && bad.item === 'nope' && M.relatingsHeld(E(cur(), 'A', 'B')).length === 1 && S().relatingRefusals[eAB.id] && S().relatingRefusals[eAB.id].why === bad.why, J(bad));
S().withdrawRelatingAttempt(eAB.id);
check('§b withdrawRelatingAttempt clears the refusal', S().relatingRefusals[eAB.id] === undefined);
const rIS = S().giveRelating(eAB.id, 'IS', ...(eAB.vertexIds[0] === A ? [a1, b1] : [b1, a1]), '+');
const afterIS = E(cur(), 'A', 'B');
check('§b an IS-INSTANCE routes to the PAIRING (one home for IS): `identification.roles` gains the pair, the packet gains nothing, and the one reader lists it first', rIS === null && afterIS.identification && J(afterIS.identification.roles) === J([eAB.vertexIds[0] === A ? [a1, b1] : [b1, a1]]) && M.relatingsHeld(afterIS).length === 1 && J(M.relatingsOn(afterIS)[0]) === J(on(eAB, A, B, 'IS', a1, b1, '+')) && M.relatingsOn(afterIS).length === 2, J(M.relatingsOn(afterIS)));
const rBar = S().giveRelating(eAB.id, 'IS', ...(eAB.vertexIds[0] === A ? [a2, b2] : [b2, a2]), '-');
check('§b an IS BAR (a, b, −) is the packet\'s (the typed record holds no bars): written beside the mode relating; the pairing untouched', rBar === null && M.relatingsHeld(E(cur(), 'A', 'B')).length === 2 && M.barsOn(E(cur(), 'A', 'B')).length === 1 && E(cur(), 'A', 'B').identification.roles.length === 1);
S().giveRelating(eAB.id, 'carries', ...(eAB.vertexIds[0] === A ? [a1, b1] : [b1, a1]), '-');
check('§b the same entry given with the other sign REPLACES it (same mode at the same endpoints is the same relating)', M.relatingsHeld(E(cur(), 'A', 'B')).length === 2 && M.relatingsHeld(E(cur(), 'A', 'B')).find((r) => r[0] === 'carries')[3] === '-');
S().withdrawRelating(eAB.id, 'carries', ...(eAB.vertexIds[0] === A ? [a1, b1] : [b1, a1]));
S().withdrawRelating(eAB.id, 'IS', ...(eAB.vertexIds[0] === A ? [a2, b2] : [b2, a2]));
check('§b withdrawRelating takes a mode relating and an IS bar out of the packet (the IS-instance, the pairing, stays)', M.relatingsHeld(E(cur(), 'A', 'B')).length === 0 && E(cur(), 'A', 'B').data === undefined && E(cur(), 'A', 'B').identification.roles.length === 1);
S().withdrawRelating(eAB.id, 'IS', ...(eAB.vertexIds[0] === A ? [a1, b1] : [b1, a1]));
check('§b withdrawRelating of an IS-INSTANCE routes to the pairing\'s own withdrawal', !E(cur(), 'A', 'B').identification || E(cur(), 'A', 'B').identification.roles.length === 0);
const rNoEdge = S().giveRelating('edge:none', 'carries', a1, b1, '+');
const rBlank = S().giveRelating(eAB.id, '  ', a1, b1, '+');
check('§b no such edge, or a blank mode: refused and named', rNoEdge !== null && /no such edge/.test(rNoEdge.why) && rBlank !== null && /needs a mode/.test(rBlank.why));
S().withdrawRelatingAttempt(eAB.id);

// ═══ §c THE LEXICON ═══
console.log('\n----- §c the lexicon -----');
reset(seeded4());
S().declareMode('carries'); S().declareMode('resists');
const eBC = E(cur(), 'B', 'C'); const [c1] = rolesAt(cur(), 'C');
S().giveRelating(eBC.id, 'detaches', ...(eBC.vertexIds[0] === B ? [b1, c1] : [c1, b1]), '+');
check('§c lexiconOf = IS, the declared words in the person\'s order, then the words in use not yet listed', J(M.lexiconOf(cur(), S().lexicon)) === J(['IS', 'carries', 'resists', 'detaches']), J(M.lexiconOf(cur(), S().lexicon)));
S().withdrawMode('carries');
check('§c withdrawMode drops a declaration; a word IN USE is never lost that way (detaches stays, from the record)', J(M.lexiconOf(cur(), S().lexicon)) === J(['IS', 'resists', 'detaches']) && J(S().lexicon) === J(['resists']));

// ═══ §d THE ROUND TRIP ═══
console.log('\n----- §d the round trip: Export → a FRESH store → Import -----');
reset(seeded4());
S().declareMode('carries');
S().giveRelating(eAB.id, 'carries', ...(eAB.vertexIds[0] === A ? [a1, b1] : [b1, a1]), '+');
S().giveRelating(eAB.id, 'IS', ...(eAB.vertexIds[0] === A ? [a2, b2] : [b2, a2]), '-');
S().giveRolePair(eAB.id, ...(eAB.vertexIds[0] === A ? [a1, b1] : [b1, a1]));
const before = M.relatingsOn(E(cur(), 'A', 'B'));
const file = JSON.parse(J(S().exportWorkspace()));
reset(seeded4());
S().declareMode('stale-session-word');
S().importWorkspace(JSON.parse(J(file)));
const after = M.relatingsOn(E(cur(), 'A', 'B'));
check('§d ★★ THE ROUND TRIP: the file carries the packet inside `shapes` and the declared modes under `lexicon`; a FRESH store after Import reads the same relatings (the IS-instance, the mode, the bar) byte-equal, and the file\'s lexicon replaces the session\'s', J(after) === J(before) && before.length === 3 && J(file.lexicon) === J(['carries']) && J(S().lexicon) === J(['carries']), J({ before, after, lexicon: S().lexicon }));
const old = JSON.parse(J(file)); delete old.lexicon;
reset(seeded4()); S().importWorkspace(old);
check('§d a file saved BEFORE B1 (no `lexicon`) imports with an empty lexicon and its edges\' packets as they are', J(S().lexicon) === '[]' && M.relatingsOn(E(cur(), 'A', 'B')).length === 3);
const stripped = JSON.parse(J(file)); for (const sh of Object.values(stripped.shapes)) for (const e of sh.edges) if (e.data) delete e.data.relatings;
reset(seeded4()); S().importWorkspace(stripped);
check('§d THE PERMANENT CONTROL — the packet struck from the file: after Import only the pairing reads (the file is the record; nothing is re-derived from elsewhere)', J(M.relatingsOn(E(cur(), 'A', 'B'))) === J([before[0]]));
const badFile = JSON.parse(J(file)); badFile.lexicon = ['ok', 3];
let refusedFile = false; try { parseWorkspaceImport(badFile); } catch (err) { refusedFile = /lexicon is malformed/.test(String(err.message)); }
check('§d a malformed lexicon in a file is refused by name', refusedFile);

// ═══ §e THE LIFT ═══
console.log('\n----- §e the lift -----');
reset(seeded4());
S().giveRelating(eAB.id, 'carries', ...(eAB.vertexIds[0] === A ? [a1, b1] : [b1, a1]), '+');
S().giveRolePair(eAB.id, ...(eAB.vertexIds[0] === A ? [a2, b2] : [b2, a2]));
const liftSrc = cur();
const snap = serializeSnapshot(liftSrc, 'src-b1');
const loaded = deserializeSnapshot(JSON.parse(J(snap)));
const loadedShape = loaded.shape ?? loaded.form ?? loaded;
const liftedAB = loadedShape.edges.find((e) => e.id.endsWith(eAB.id) || e.id === eAB.id);
check('§e ★★ THE LIFT CARRIES THE PACKET VERBATIM: the loaded shape\'s A–B (its id re-rooted by the loader) holds the same `data.relatings` and the same pairing, and the one reader reads the same relatings — role ids need no re-rooting', !!liftedAB && liftedAB.id !== eAB.id && J(liftedAB.data.relatings) === J(E(liftSrc, 'A', 'B').data.relatings) && J(M.relatingsOn(liftedAB)) === J(M.relatingsOn(E(liftSrc, 'A', 'B'))), J({ id: liftedAB && liftedAB.id, relatings: liftedAB && M.relatingsOn(liftedAB) }));

// ═══ §f THE DISSECTION ═══
console.log('\n----- §f the dissection -----');
reset(seeded4());
S().giveRelating(eAB.id, 'carries', ...(eAB.vertexIds[0] === A ? [a1, b1] : [b1, a1]), '+');
S().giveRolePair(eAB.id, ...(eAB.vertexIds[0] === A ? [a2, b2] : [b2, a2]));
const sBefore = cur(); const abBefore = E(sBefore, 'A', 'B');
S().applyAmboDissectionToCurrent();
const G1 = cur(); const abAfter = E(G1, 'A', 'B');
const flipped = abAfter.vertexIds[0] !== abBefore.vertexIds[0];
const expectRel = flipped ? M.relatingsHeld(abBefore).map((r) => [r[0], r[2], r[1], r[3]]) : M.relatingsHeld(abBefore);
const expectPair = flipped ? abBefore.identification.roles.map(([x, y]) => [y, x]) : abBefore.identification.roles;
check(`§f ★★ THE DISSECTION CARRIES THE PACKET exactly as it carries the record: the child's A–B (${flipped ? 'walked the other way — mirrored' : 'the same way — as it is'}) holds the relating and the pairing, both ${flipped ? 'mirrored' : 'unchanged'} together`, J(M.relatingsHeld(abAfter)) === J(expectRel) && J(abAfter.identification.roles) === J(expectPair), J({ flipped, held: M.relatingsHeld(abAfter), pair: abAfter.identification.roles }));
const others = G1.edges.filter((e) => e !== abAfter && M.relatingsHeld(e).length > 0);
check('§f no other edge of the child carries a relating (a true absence carries as a true absence)', others.length === 0);

// ═══ §g THE SEAL — the existing readers read as before ═══
console.log('\n----- §g the seal: the readers unchanged with the packet present; every IS-instance is a pair of the pairing in force -----');
const readAll = (shape) => shape.edges.map((e) => ({ id: e.id, rec: recordOn(shape, e, {}), core: (() => { const c = R.meetCoreOf(shape, e); return { roles: c.roles, types: c.types, meet: c.meet, leftOut: c.leftOut.length }; })(), resp: R.readRespects(shape, e).map((r) => r.verdict), step: (() => { const st = readStep(shape.edges, e.vertexIds[0], e.vertexIds[1]); return st ? [...st.map] : null; })(), space: (() => { const r = spaceOf(shape, e.vertexIds[0]); return r ? r.space.roles.length + ':' + r.space.relations.length : null; })() }));
reset(seeded4());
S().giveRolePair(eAB.id, ...(eAB.vertexIds[0] === A ? [a1, b1] : [b1, a1]));
const faceABC = cur().faces.find((f) => f.vertexIds.length === 3 && [A, B, byLabel(cur(), 'C')].every((v) => f.vertexIds.includes(v)));
S().giveTriad(faceABC.id, 'role', [{ corner: A, item: a2 }, { corner: B, item: b2 }, { corner: byLabel(cur(), 'C'), item: c1 }]);
const control = readAll(cur());
S().declareMode('carries');
S().giveRelating(eAB.id, 'carries', ...(eAB.vertexIds[0] === A ? [a1, b2] : [b2, a1]), '+');
S().giveRelating(eAB.id, 'IS', ...(eAB.vertexIds[0] === A ? [a2, b1] : [b1, a2]), '-');
const withPacket = readAll(cur());
check('§g ★★ B1 EXPOSES NOTHING TO THE CORE\'S READERS: with a mode relating and an IS bar on A–B beside a pairing and a triad, the resolver\'s record, the meet-core, the respects\' readings, the face reading\'s step and the corners\' spaces read BYTE-EQUAL to the control without the packet', J(withPacket) === J(control), J({ edges: control.length, sample: control.find((x) => x.id === eAB.id) }));
const everyIS = (shape) => shape.edges.every((e) => J(M.instancesOn(e).filter((r) => r[0] === M.IS).map((r) => [r[1], r[2]])) === J(R.unconditionalOn(e, {}).roles));
check('§g ★★ EVERY IS-INSTANCE IS EXACTLY A PAIR OF THE PAIRING IN FORCE, on every edge of the seeded tetrahedron with its acts (the migration by reading)', everyIS(cur()));
const vlPath = path.join(repoRoot, '.handoff/inbox/coder/2026-09-25_2353_virgin-land_export_break-by-lights_ValueAction.workspace.json');
if (fs.existsSync(vlPath)) {
  const vl = parseWorkspaceImport(JSON.parse(fs.readFileSync(vlPath, 'utf8')));
  const vlShapes = Object.values(vl.shapes);
  check(`§g on Virgin Land's record (${vlShapes.length} shapes, ${vlShapes.reduce((n, s) => n + s.edges.length, 0)} edges, no plain pair): every edge reads NO relating — the triads are the faces' and B1 reads none of them into the edge`, vlShapes.every((s) => everyIS(s) && s.edges.every((e) => M.relatingsOn(e).length === 0)));
} else note('Virgin Land\'s fixture is not beside the inbox on this checkout — the record control skipped here (it is not tracked)');

// ═══ §h THE CENSUS ═══
console.log('\n----- §h the census -----');
const walk = (dir, out = []) => { for (const f of fs.readdirSync(dir)) { const p = path.join(dir, f); if (fs.statSync(p).isDirectory()) walk(p, out); else if (/\.(ts|tsx)$/.test(f)) out.push(p); } return out; };
const sites = {};
for (const f of walk(path.join(repoRoot, 'src'))) {
  const rel = path.relative(repoRoot, f).split(path.sep).join('/');
  if (rel === 'src/types/geometry.ts') continue;
  const n = (fs.readFileSync(f, 'utf8').match(/\.identification\b/g) || []).length;
  if (n) sites[rel] = n;
}
const expected = { 'src/store/geometryStore.ts': 11, 'src/lib/ambo.ts': 4, 'src/components/JRegisterPanel.tsx': 3, 'src/lib/respects.ts': 1, 'src/lib/faceReading.ts': 1, 'src/components/MidpointSurface.tsx': 1 };
check('§h ★ THE CENSUS OF `.identification` UNDER src/ (the step-0 letter\'s table, each site routed or NAMED): the store (the one WRITER and its callers, `midpointRecord`), the ambo (the CARRIER, mirrored), the register\'s surface (the person\'s own IS record), the respects (the one reader\'s base read), the face reading (routed at B3, on paths) and the midpoint surface (the neighbouring acts as given) — and NOTHING ELSE; relatings.ts adds no site', J(Object.fromEntries(Object.entries(sites).sort())) === J(Object.fromEntries(Object.entries(expected).sort())), J(sites));
const writers = {};
for (const f of walk(path.join(repoRoot, 'src'))) {
  const rel = path.relative(repoRoot, f).split(path.sep).join('/');
  const s = fs.readFileSync(f, 'utf8');
  const n = (s.match(/\bwithRelating\(|\bwithoutRelating\(|\bcarriedRelatings\(|\[RELATINGS_KEY\]\s*:/g) || []).length;
  if (n) writers[rel] = n;
}
check('§h THE PACKET HAS ONE WRITER AND ONE CARRIER: the pure writers are called by the store alone (through `writeEdgeRelatings`), the carry by the ambo alone, and the key is put on a packet in the module and the ambo only', J(Object.keys(writers).sort()) === J(['src/lib/ambo.ts', 'src/lib/relatings.ts', 'src/store/geometryStore.ts']) && writers['src/store/geometryStore.ts'] === 3 && writers['src/lib/ambo.ts'] === 2, J(writers));

console.log(`\n${failures === 0 ? 'DIAGNOSE-MODES1-THE-EDGE-IN-MODES: ALL PASS — the pairing reads as IS-instances, the other modes and the bars live in the edge\'s packet, the acts are checked and routed, the lexicon is IS · declared · in use, the record survives the round trip, the lift and the dissection, and the core\'s readers read as before' : `DIAGNOSE-MODES1-THE-EDGE-IN-MODES: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
