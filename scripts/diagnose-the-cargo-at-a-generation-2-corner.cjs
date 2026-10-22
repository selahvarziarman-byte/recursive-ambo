#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// THE CARGO AT A GENERATION-2 CORNER HOLDING A RELATING IN A MODE — group 3's part 5 (the coder's price of 10-21 13:31: "measure a generation-2 room with a generation-2 mode relating
// walked; cut only if keys print"). MEASURED 10-22, nothing cut: the room names a born corner's moments through the transport's space, whose labels are the one term reader's
// (`transportSpaceOf` → `termWordsOf`), so a relating in a mode walks as `((Φ3 ≡ F7) carries (F5 ≡ r2))` — never its key `Φ3≡F7 carries F5≡r2` — and comes along a corner edge as its
// coordinate, `(F5 ≡ r2)` toward AB, `(Φ3 ≡ F7)` toward AC, and breaks at a rod that does not carry it. This witness pins that measurement.
// ═══════════════════════════════════════════════════════════════════════════════
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};
const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const C = req('src/manuscript/cargoModel.ts');
const M = req('src/manuscript/doorTransportModel.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const A = req('src/manuscript/apertureModel.ts');
const { liftedConceptOf } = req('src/manuscript/liftedConceptModel.ts');
const { columnSpaceOf, termWordsOf } = req('src/lib/instanceSpace.ts');
console.log('THE CARGO AT A GENERATION-2 CORNER HOLDING A RELATING IN A MODE — part 5 measured: the term reader\'s words, never a key\n');
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const byLabel = (sh, l) => Object.keys(sh.vertices).find((v) => sh.vertices[v].data.label === l);
const cast = (f) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', f), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json');
const withCast = (shape, v, c) => ({ ...shape, vertices: { ...shape.vertices, [v]: { ...shape.vertices[v], data: { ...shape.vertices[v].data, cast: c } } } });
let seeded = createSeedShape('tetrahedron');
for (const [label, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', phi]]) seeded = withCast(seeded, byLabel(seeded, label), c);
useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {} });
S().applyAmboDissectionToCurrent();
const give = (X, Y, map) => { const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y)); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
give('A', 'B', { F1: 'r0', F5: 'r2', F7: 'r8' });
give('A', 'C', { F1: 'Φ1', F7: 'Φ3' });
give('A', 'D', { F1: 'Φ1' });
give('B', 'C', { r0: 'Φ1' });
give('B', 'D', { r0: 'Φ1' });
// a RELATING IN A MODE on the gen-1 medial edge AB–AC, between two of the children's own points: `(Φ3 ≡ F7) carries (F5 ≡ r2)`, said from AC (the edge's first corner as stored)
const AB = byLabel(cur(), 'AB'); const AC = byLabel(cur(), 'AC');
const eABAC = edgeBetween(cur().edges, AB, AC);
const colAB = columnSpaceOf(cur(), AB); const colAC = columnSpaceOf(cur(), AC);
const x = colAB.roles.map((r) => r.id).find((id) => id.startsWith('F5')); const y = colAC.roles.map((r) => r.id).find((id) => id.endsWith('F7'));
const abFirst = eABAC.vertexIds[0] === AB;
const ref = abFirst ? S().giveRelating(eABAC.id, 'carries', x, y, '+') : S().giveRelating(eABAC.id, 'carries', y, x, '+');
check('§0 THE RECORD: the tetrahedron with the three casts dissected; his pairings on five seed edges; a relating in the mode `carries` TAKEN on the gen-1 medial edge AB–AC between the children\'s own points `F5≡r2` (AB\'s) and `Φ3≡F7` (AC\'s)',
  x === 'F5≡r2' && y === 'Φ3≡F7' && ref === null, { x, y, ref, storedFirst: abFirst ? 'AB' : 'AC' });
S().selectCell(cur().cells.find((c) => c.kind === 'core').id);
S().applyAmboDissectionToCurrent();
const G2id = cur().id;
const ABAC2 = byLabel(cur(), 'ABAC');
const colABAC = columnSpaceOf(cur(), ABAC2);
const modeKey = colABAC ? colABAC.roles.map((r) => r.id).find((id) => / carries /.test(id)) : null;
const isKey = colABAC ? colABAC.roles.map((r) => r.id).find((id) => !/ carries /.test(id)) : null;
const expectMode = abFirst ? 'F5≡r2 carries Φ3≡F7' : 'Φ3≡F7 carries F5≡r2';
const expectModeWords = abFirst ? '((F5 ≡ r2) carries (Φ3 ≡ F7))' : '((Φ3 ≡ F7) carries (F5 ≡ r2))';
check('§1 ★ THE CHILD AT GENERATION 2: ABAC\'s column holds the relating in a mode as a point beside the inherited IS instance; the term reader says it as his sentence in parentheses, each end a child\'s own sentence',
  !!colABAC && colABAC.roles.length === 2 && modeKey === expectMode && termWordsOf(cur(), ABAC2, modeKey) === expectModeWords && !!isKey && /≡/.test(isKey),
  { roles: colABAC && colABAC.roles.map((r) => r.id), words: modeKey && termWordsOf(cur(), ABAC2, modeKey) });
// the gen-2 residue at A lifted, the hinge door glued (the doors-act witness's recipe), the room built
const liftOf = (shapeId, pick) => { S().selectShape(shapeId); S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection(); S().selectCell(pick(cur()).id); const before = useLiftStore.getState().queue.length; S().liftSelectionToManuscript(); return useLiftStore.getState().queue[before].file; };
const residueAt = (shape, label) => shape.cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(byLabel(shape, label)) && c.vertexIds.length === 4);
const file = liftOf(G2id, (s) => residueAt(s, 'A'));
const entry = loadUniverseSnapshot(file);
const form = placeShelfEntry(entry, 0);
const concept = liftedConceptOf(form, entry.loaded.ancestors ?? []);
const shape = form.shape; const record = concept.record;
const lab = (v) => shape.vertices[v]?.data.label || v;
const menu = A.boundaryFacesOf(shape);
const faceWith = (set) => menu.find((m) => { const t = m.label.split(' · ')[0].split('·'); return t.length === set.length && set.every((z) => t.includes(z)); });
const fA = faceWith(['A', 'AC', 'ABAC', 'AB']); const fB = faceWith(['A', 'AB', 'ABAD', 'AD']);
const cands = A.dihedralMapCandidates(shape, fA.id, fB.id);
const hinge = cands.find((c) => c.correspondence.every(([a, b]) => lab(a) === lab(b) || (lab(a) === 'AC' && lab(b) === 'AD') || (lab(a) === 'ABAC' && lab(b) === 'ABAD')));
const cycleA = hinge.correspondence.map(([a]) => a); const cycleB = hinge.correspondence.map(([, b]) => b);
const memo = new Map();
const SA = M.sideOf(record, cycleA, memo, fA.label.split(' · ')[0]); const SB = M.sideOf(record, cycleB, memo, fB.label.split(' · ')[0]);
const act = M.actAt(SA.side, SB.side, [], 0, 'F1', 'F1');
const rows = [{ faceA: fA.id, faceB: fB.id, candidateKey: hinge.key, transports: act.transports }, { faceA: null, faceB: null, candidateKey: null }];
const verdict = A.buildPersonDomainVerdict(shape, rows, 'built-1', 'built 3-manifold 1');
const surface = A.readCellSurface(verdict.domain, false);
const room = C.cargoRoomOf(shape, entry.loaded.ancestors ?? [], rows, surface);
const abac = byLabel(shape, 'ABAC');
check('§2 ★ THE GENERATION-2 ROOM: the residue at A lifted at the finer grain (7 corners), the hinge door F1 ↦ F1 at A taken with its line through ABAC (4 corners), the room built',
  Object.keys(shape.vertices).length === 7 && act.taken && act.transports.length === 4 && room !== null && !!abac, { corners: room && room.corners.map(lab), taken: act.taken, transports: act.transports && act.transports.length });
const roles = room.rolesAt(abac);
const modeRole = roles.find((r) => / carries /.test(r.id)); const isRole = roles.find((r) => !/ carries /.test(r.id));
check('§3 ★★ THE ROOM NAMES A BORN CORNER\'S MOMENTS BY THE ONE TERM READER (MODES-4 · row 5, D11: the transport\'s space, its labels `termWordsOf`\'s): at ABAC the relating in a mode is `' + expectModeWords.slice(1, -1) + '` and the inherited IS instance `(Φ1 ≡ F1) ≡ (F1 ≡ r0)` — never a key (`Φ3≡F7 carries F5≡r2`, `Φ1≡F1≡F1≡r0`)',
  roles.length === 2 && !!modeRole && modeRole.name === expectModeWords.slice(1, -1) && !!isRole && isRole.name === '(Φ1 ≡ F1) ≡ (F1 ≡ r0)' && roles.every((r) => r.name !== r.id),
  roles.map((r) => [r.id, r.name]));
const rods = C.rodsFrom(room, abac);
const st0 = C.pickCargo(room, abac, modeRole.id);
const rd0 = C.cargoReading(room, st0);
const along = Object.fromEntries(rods.map((to) => [lab(to), C.cargoReading(room, C.stepRod(room, st0, to)).words]));
note(`picked: ${rd0.words}`);
for (const [k, v] of Object.entries(along)) note(`  → ${k}: ${v}`);
const printed = [rd0.words, ...Object.values(along)].join('\n');
const toAB = abFirst ? '(F5 ≡ r2)' : '(F5 ≡ r2)'; const toAC = '(Φ3 ≡ F7)';
check('§4 ★★ THE CARGO WALKED ON THE RELATING IN A MODE: picked at ABAC it reads `carrying ' + expectModeWords + ' — at the corner ABAC`; along the corner edge ABAC–AB it comes as its AB coordinate `(F5 ≡ r2)`, along ABAC–AC as its AC coordinate `(Φ3 ≡ F7)` (D19 item 5 — a born corner\'s role is an instance of its parents\' edge); along ABAC–ABAD and ABAC–ACAD it BREAKS, said so by name (`carrying nothing — … broke at the rod ABAC–ABAD, which does not carry it`); no bare key anywhere in the words (no `≡` without its spaces, no `A:`/`B:` prefix)',
  rd0.state === 'carrying' && rd0.words === `carrying ${expectModeWords} — at the corner ABAC` && along.AB === `carrying ${expectModeWords} — at the corner AB, came along ABAC–AB as ${toAB}` && along.AC === `carrying ${expectModeWords} — at the corner AC, came along ABAC–AC as ${toAC}`
    && along.ABAD === `carrying nothing — ${expectModeWords} broke at the rod ABAC–ABAD, which does not carry it` && along.ACAD === `carrying nothing — ${expectModeWords} broke at the rod ABAC–ACAD, which does not carry it` && !/[^ (]≡[^ )]|\b[AB]:[a-zA-Z]/.test(printed),
  { picked: rd0.words, along });
const st1 = C.pickCargo(room, abac, isRole.id);
const isWords = C.cargoReading(room, st1).words; const isAlongAB = C.cargoReading(room, C.stepRod(room, st1, rods.find((to) => lab(to) === 'AB'))).words;
check('§5 ★ THE CONTROL — the inherited IS instance picked at ABAC reads `carrying ((Φ1 ≡ F1) ≡ (F1 ≡ r0)) — at the corner ABAC` and comes along ABAC–AB as `(F1 ≡ r0)`',
  isWords === 'carrying ((Φ1 ≡ F1) ≡ (F1 ≡ r0)) — at the corner ABAC' && isAlongAB === 'carrying ((Φ1 ≡ F1) ≡ (F1 ≡ r0)) — at the corner AB, came along ABAC–AB as (F1 ≡ r0)', { isWords, isAlongAB });
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
check('§6 ★ BY CONSTRUCTION: `transportSpaceOf` labels a born corner\'s roles through the one term reader (`termWordsOf`, its outer parentheses off), and `cargoRoomOf` names a corner\'s roles by `nameIn` on that space — one reader for the room\'s words and the midpoint\'s',
  src('src/lib/transport.ts').includes("const label = (id: string): string => termWordsOf(record, v, id, {}, childMemo).replace(/^\\((.*)\\)$/, '$1');") && src('src/lib/transport.ts').includes("return { space: { ...child, roles: child.roles.map((r) => ({ ...r, label: label(r.id) })) }, origin: 'derived' };") && src('src/manuscript/cargoModel.ts').includes("for (const v of corners) { const s = spaceAt(v); roles[v] = s ? s.roles.map((r) => ({ id: r.id, name: nameIn(s, r.id) })) : []; }"));
console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-CARGO-AT-A-GENERATION-2-CORNER: ALL PASS — a relating in a mode walks under the term reader\'s words, comes along a corner edge as its coordinate, breaks by name; no key prints' : `DIAGNOSE-THE-CARGO-AT-A-GENERATION-2-CORNER: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
