#!/usr/bin/env node

// DIAGNOSTIC — THE FOUND BUGS, ONE CUT (STAMP C-12a, 2026-09-24; §144, Δ95 — Arman: "i want the bugs you have already find
// addressed. we are not still at the finish line"). Each item MEASURED first, then cured; each cure with its falsifier here or
// in the eye leg (scripts/app-leg/diagnose-the-concept-layer-eye.cjs §12). Items 1 (the door's words name their corners) and 8
// (the room taken where its drawn body is hit) are pinned in diagnose-the-doors-act.cjs §2/§4 and the eye leg §10/§12; item 4
// (the gen-2 corner cell at the glue) STOPPED on the frozen extractor and is reported, not cured; item 5 (the badge) did not
// reproduce under measurement and is pinned at the eye as it stands.
//
// §1 item 2 — a lifted CELL is designated by its KIND and CORNERS (`the tetrahedron A·AB·AC·AD of …`), never by its address;
//    the universe's name says the dissection ONCE at every generation; a given name still wins; a vertex lift unchanged.
// §2 item 3 — THE WAY BACK: `selectShape` measured safe — an earlier shape made current keeps only the selections it holds,
//    clears the lift set and the inspection, refuses an unknown id, lets a dissection BRANCH from it, and returns.
// §3 item 6 — a LONE word wears its corner when ANY other name in the space — a lone one or a chain's segment — is spelled
//    alike under another seed: `presupposes [B]` beside `presupposes ≡ specifies` (the ≡ rule's bracket, §125.1); the
//    lone-against-lone rule as it stood (`disjoins [A]` · `disjoins [B]`) and the plain names unchanged.
// §4 item 7 — the explore room's read SAYS its refusal: a throw anywhere in the read returns `cannot walk this room — its
//    surface could not be read: <the engine's own reason>`, the reason carried verbatim; the lawful read returns the surface.
// §5 the surfaces by source: the genealogy mounted in the workspace tab; the view prints the read's refusal in the door's
//    register and swallows nothing; the hit hull in the drawn domain; the name's mint; purity; the manifest row.
//
// ⛔ RECORD, NOT READING: nothing here stores a derived value; every reading is re-derived at the read.

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

const { spaceOf, composedOn, nameIn } = req('src/lib/spaceOf.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const { cellDesignationOf } = req('src/lib/subComplexLift.ts');
const { buildThreeTorusDomain } = req('src/manuscript/worldModel.ts');
const { readCellSurface } = req('src/manuscript/apertureModel.ts');
const { exploreReadOf, exploreRefusalWords } = req('src/manuscript/exploreRead.ts');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const reset = (seeded) => useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, liftSelection: [], selectedCellId: null, selectedVertexId: null, selectedEdgeId: null, selectedFaceId: null, dualInspectionTarget: null, hoverTarget: null });
const residueAt = (label) => cur().cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(byLabel(cur(), label)) && c.vertexIds.length === 4);
const coreOf = () => cur().cells.find((c) => c.kind === 'core');
const lastLift = () => { const q = useLiftStore.getState().queue; return q[q.length - 1]; };

// ─── §1 item 2 — THE CELL'S DESIGNATION AND THE NAME ONCE ──────────────────────────────────────────────────────────────────
console.log('§1 — a lifted cell named by its kind and corners; the universe named once');
reset(createSeedShape('tetrahedron'));
const G0id = cur().id;
S().selectCell(cur().cells[0].id);
const t0 = S().liftSelectionToManuscript();
S().applyAmboDissectionToCurrent();
const G1id = cur().id;
S().selectCell(residueAt('A').id);
const t1 = S().liftSelectionToManuscript();
const form1 = placeShelfEntry(loadUniverseSnapshot(lastLift().file), 0);
S().selectCell(coreOf().id);
S().applyAmboDissectionToCurrent();
const G2id = cur().id;
S().selectCell(residueAt('A').id);
const t2 = S().liftSelectionToManuscript();
const form2 = placeShelfEntry(loadUniverseSnapshot(lastLift().file), 0);
S().selectCell(coreOf().id);
S().applyAmboDissectionToCurrent();
const G3id = cur().id;
note(`titles: gen 0 ${J(t0)} · gen 1 ${J(t1)} · gen 2 ${J(t2)} · the placed forms ${J(form1.title)} / ${J(form2.title)} · names ${J([S().shapes[G0id].name, S().shapes[G1id].name, S().shapes[G2id].name, S().shapes[G3id].name])}`);
check('§1 ★★ THE CELL NAMED BY ITS KIND AND CORNERS (item 2): the residue at A lifted from gen 1 is titled `the tetrahedron A·AB·AC·AD of Ambo Dissection Tetrahedron` (the corners alphabetical — the cell\'s record holds them A·AC·AB·AD), the shelf entry and the placed form carry the same words, no `cell:` anywhere; the seed cell at gen 0 likewise by its kind',
  t1 === 'the tetrahedron A·AB·AC·AD of Ambo Dissection Tetrahedron' && form1.title === `${t1} — loaded` && form1.shape.name === t1 && !/cell:/.test(t0 + t1 + t2 + form1.title + form2.title) && /^the (tetrahedron|seed) A·B·C·D of Tetrahedron$/.test(t0),
  J({ t0, t1, form1: form1.title, name: form1.shape.name }));
check('§1 ★★ THE NAME ONCE (item 2): the universe is `Ambo Dissection Tetrahedron` at gen 1, gen 2 AND gen 3 — never `Ambo Dissection Ambo Dissection …`; the residue at A lifted from gen 2 is titled by the SOURCE cell\'s record — its four corners, the same words as gen 1\'s — while the lifted shape carries the FINER grain (§148 ruling 1: 7 corners, the three midpoints on its face born corners; the lifted cell\'s own record names all seven — the title reads the source, said in the report)',
  S().shapes[G1id].name === 'Ambo Dissection Tetrahedron' && S().shapes[G2id].name === 'Ambo Dissection Tetrahedron' && S().shapes[G3id].name === 'Ambo Dissection Tetrahedron' && S().shapes[G0id].name === 'Tetrahedron' && t2 === t1 && Object.keys(form2.shape.vertices).length === 7 && form2.shape.cells[0].vertexIds.length === 7 && Object.keys(form1.shape.vertices).length === 4,
  J({ names: [S().shapes[G0id].name, S().shapes[G1id].name, S().shapes[G2id].name, S().shapes[G3id].name], t2, corners: [Object.keys(form1.shape.vertices).length, Object.keys(form2.shape.vertices).length] }));
// a GIVEN name wins; a vertex lift unchanged; the designation of a cell not held is null
S().selectShape(G1id);
const named = { ...cur(), cells: cur().cells.map((c) => (c.id === residueAt('A').id ? { ...c, data: { ...(c.data ?? {}), label: 'the A-corner' } } : c)) };
useGeometryStore.setState({ shapes: { ...S().shapes, [G1id]: named } });
S().selectCell(residueAt('A').id);
const tGiven = S().liftSelectionToManuscript();
useGeometryStore.setState({ shapes: { ...S().shapes, [G1id]: { ...cur(), cells: cur().cells.map((c) => (c.id === residueAt('A').id ? { ...c, data: { ...(c.data ?? {}), label: undefined } } : c)) } } });
S().selectCell(null); S().selectVertex(byLabel(cur(), 'AB'));
const tVertex = S().liftSelectionToManuscript();
S().selectVertex(null);
check('§1 ★ THE GIVEN NAME WINS, THE VERTEX UNCHANGED: a cell the person named lifts as `the A-corner of Ambo Dissection Tetrahedron`; a vertex lift keeps its own designation (`AB of Ambo Dissection Tetrahedron`); `cellDesignationOf` on a cell the shape does not hold is null; the designation reads the record\'s `topology` before the `kind`',
  tGiven === 'the A-corner of Ambo Dissection Tetrahedron' && tVertex === 'AB of Ambo Dissection Tetrahedron' && cellDesignationOf(cur(), 'cell:nope') === null && cellDesignationOf(cur(), coreOf().id) === `the ${coreOf().topology ?? coreOf().kind} ${coreOf().vertexIds.map((v) => cur().vertices[v].data.label).sort((a, b) => a.localeCompare(b)).join('·')}`,
  J({ tGiven, tVertex, core: cellDesignationOf(cur(), coreOf().id) }));

// ─── §2 item 3 — THE WAY BACK: selectShape measured ───────────────────────────────────────────────────────────────────────
console.log('§2 — the way back: selectShape');
S().selectShape(G2id);
S().selectCell(coreOf().id); // gen 2's core (the cuboctahedron) — born at gen 2, held by no earlier shape
const heldInG2 = S().selectedCellId;
S().selectShape(G1id);
const back = S();
check('§2 ★★ AN EARLIER SHAPE MADE CURRENT (item 3): `selectShape(gen 1)` from gen 2 with gen 2\'s core selected — the current shape is gen 1, the selected cell (born at gen 2, not held by gen 1) cleared, the lift set, the dual inspection and the hover cleared; the shape order untouched',
  back.currentShapeId === G1id && heldInG2 !== null && !S().shapes[G1id].cells.some((c) => c.id === heldInG2) && back.selectedCellId === null && back.selectedVertexId === null && back.liftSelection.length === 0 && back.dualInspectionTarget === null && back.hoverTarget === null && J(back.shapeOrder) === J([G0id, G1id, G2id, G3id]),
  J({ current: back.currentShapeId === G1id, cell: back.selectedCellId, lift: back.liftSelection.length, order: back.shapeOrder.length }));
S().selectShape(G2id);
S().selectCell(residueAt('A').id); // the residue at A keeps its id across the dissection — gen 1 HOLDS it, so it survives the way back
const sharedId = S().selectedCellId;
S().selectShape(G1id);
check('§2 ★ A CELL BOTH SHAPES HOLD SURVIVES THE WAY BACK: gen 2\'s residue at A carries the id gen 1 minted for it; selected at gen 2, it stays selected at gen 1 (`selectShape` keeps what the chosen shape holds — measured, the cure was not to clear)',
  sharedId !== null && S().shapes[G1id].cells.some((c) => c.id === sharedId) && S().selectedCellId === sharedId && S().currentShapeId === G1id, J({ sharedId, kept: S().selectedCellId }));
S().selectCell(residueAt('A').id);
const heldInG1 = S().selectedCellId;
S().selectShape(G1id);
S().selectShape('shape:nope');
check('§2 ★ A SELECTION THE SHAPE HOLDS SURVIVES; AN UNKNOWN ID MOVES NOTHING: gen 1\'s residue selected, `selectShape(gen 1)` again keeps it; `selectShape(\'shape:nope\')` leaves gen 1 current',
  heldInG1 !== null && S().selectedCellId === heldInG1 && S().currentShapeId === G1id, J({ heldInG1, after: S().selectedCellId, current: S().currentShapeId }));
const orderBefore = [...S().shapeOrder];
const gen2Object = S().shapes[G2id]; // the object gen 2 IS — the same act must return it, not re-derive it
const historyBefore = S().historySequence;
S().selectCell(coreOf().id);
let threw = null;
try { S().applyAmboDissectionToCurrent(); } catch (e) { threw = e.message; }
const back2 = cur();
const orderAfter = [...S().shapeOrder];
note(`the same dissection after the way back: order before ${J(orderBefore.map((id) => id.split(':').slice(1, 3).join(':')))} → after ${J(orderAfter.map((id) => id.split(':').slice(1, 3).join(':')))} · history ${historyBefore} → ${S().historySequence} · shapes held ${Object.keys(S().shapes).length}`);
check('§2 ★★ THE EXISTING CHILD IS MADE CURRENT, NEVER RE-DERIVED (§148 ruling 3): gen 1\'s core dissected again after the way back returns gen 2 ITSELF — the same id AND the same object, no throw, nothing minted, no history entry, the order and the count of shapes unchanged, gen 3 still held',
  threw === null && back2.id === G2id && back2 === gen2Object && J(orderAfter) === J(orderBefore) && S().historySequence === historyBefore && Object.keys(S().shapes).length === 4 && Boolean(S().shapes[G3id]) && S().currentShapeId === G2id,
  J({ threw, sameId: back2.id === G2id, sameObject: back2 === gen2Object, history: [historyBefore, S().historySequence], order: orderAfter.length, current: S().currentShapeId === G2id }));
// the sibling act: a DIFFERENT cell of gen 1 dissected — a different child, both held (the id indexes parent AND cell)
S().selectShape(G1id);
const g1Core = coreOf();
const g1ResidueA = residueAt('A');
S().selectCell(g1ResidueA.id);
S().applyAmboDissectionToCurrent();
const sibling = cur();
// a child's `parent` cell is the marker of the cell it dissected — the same vertex set (the generation's parentCellIds name that marker, never the source cell)
const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
const dissected = (child, source) => child.cells.some((c) => c.kind === 'parent' && sameSet(c.vertexIds, source.vertexIds));
check('§2 ★★ A DIFFERENT CELL OF THE SAME PARENT MINTS A DIFFERENT CHILD (§148 ruling 3\'s reason, measured further): gen 1\'s residue at A dissected — its child is NOT gen 2 (the mint hashed on the parent alone minted ONE id for every cell of gen 1 and the second child overwrote the first); both children held, each marking the cell it dissected as its `parent` cell (the same corners); gen 2 still the core\'s child, the same object as before',
  sibling.id !== G2id && sibling.genealogy.parentShapeId === G1id && Boolean(S().shapes[G2id]) && S().shapes[G2id] === gen2Object && dissected(sibling, g1ResidueA) && dissected(S().shapes[G2id], g1Core) && !dissected(sibling, g1Core) && Object.keys(S().shapes).length === 5,
  J({ siblingDistinct: sibling.id !== G2id, gen2Held: Boolean(S().shapes[G2id]), gen2Same: S().shapes[G2id] === gen2Object, siblingMarksResidue: dissected(sibling, g1ResidueA), gen2MarksCore: dissected(S().shapes[G2id], g1Core), shapes: Object.keys(S().shapes).length }));
S().selectShape(G2id);

// ─── §3 item 6 — THE LONE WORD'S BRACKET AGAINST A CHAIN'S SEGMENT ────────────────────────────────────────────────────────
console.log('§3 — the lone word wears its corner beside a chain spelled alike');
const flow = cast('flow.cast.json'); const phi = cast('phi.cast.json'); const tcell = cast('t-cell.cast.json');
let seeded = createSeedShape('tetrahedron');
for (const [label, c] of [['A', flow], ['B', phi], ['C', tcell], ['D', phi]]) seeded = withCast(seeded, byLabel(seeded, label), c);
reset(seeded);
S().applyAmboDissectionToCurrent();
const give = (X, Y, map) => { const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y)); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
const giveWord = (X, Y, s, t) => { const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y)); if (e.vertexIds[0] === byLabel(cur(), X)) S().giveWordPair(e.id, s, t); else S().giveWordPair(e.id, t, s); };
const wordsAtAB = () => spaceOf(cur(), byLabel(cur(), 'AB')).space.signature.map((w) => w.type);
give('A', 'B', { F5: 'Φ7', F7: 'Φ1', F8: 'Φ2' });
giveWord('A', 'B', 'sustains', 'descends-from');
const w1 = wordsAtAB();
giveWord('A', 'B', 'presupposes', 'specifies');
const w2 = wordsAtAB();
giveWord('A', 'B', 'exceeds-in-size', 'lodges-in');
const w3 = wordsAtAB();
note(`AB's words after the three pairs: ${J(w3)}`);
check('§3 ★★ THE LONE WORD WEARS ITS CORNER (item 6): after his word pair presupposes ↦ specifies, AB reads `presupposes ≡ specifies` (A\'s presupposes, chained) and `presupposes [B]` (B\'s, lone, spelled like the chain\'s segment under another seed) — no bare `presupposes`',
  w2.includes('presupposes ≡ specifies') && w2.includes('presupposes [B]') && !w2.includes('presupposes') && !w2.includes('presupposes [A]'),
  J(w2.filter((w) => /presupposes/.test(w))));
check('§3 ★★ THE RULE AS IT STOOD, UNCHANGED: before that pair both were lone — `presupposes [A]` · `presupposes [B]` (lone against lone); `disjoins [A]` · `disjoins [B]` stand in every read; a name spelled once in the space stays plain (`component-of`, `generates`); the third pair moves nothing here',
  w1.includes('presupposes [A]') && w1.includes('presupposes [B]') && [w1, w2, w3].every((w) => w.includes('disjoins [A]') && w.includes('disjoins [B]') && w.includes('component-of') && w.includes('generates')) && J(w3.filter((w) => /presupposes/.test(w))) === J(w2.filter((w) => /presupposes/.test(w))) && w3.includes('exceeds-in-size ≡ lodges-in'),
  J({ w1: w1.filter((w) => /presupposes|disjoins/.test(w)), w3: w3.filter((w) => /presupposes|disjoins|exceeds-in-size/.test(w)) }));

const tuplesAB = spaceOf(cur(), byLabel(cur(), 'AB')).space.relations;
const presTypes = [...new Set(tuplesAB.filter((t) => /presupposes/.test(t.type)).map((t) => t.type))].sort();
check('§3 ★★ THE TUPLES CARRY THE DISPLAY: every tuple of the glued space names its relation by the same display as the signature — B\'s two presupposes tuples read `presupposes [B]`, the chained ones `presupposes ≡ specifies`, the disjoins tuples `[A]` · `[B]` — so the LIFTED drawing (which writes no origin) shows the corner, while the midpoint\'s own drawing strips it by C-7f item 4 and writes `from B` instead (both measured at the eye, §12)',
  J(presTypes) === J(['presupposes [B]', 'presupposes ≡ specifies']) && tuplesAB.filter((t) => t.type === 'presupposes [B]').length === 2 && J([...new Set(tuplesAB.filter((t) => /disjoins/.test(t.type)).map((t) => t.type))].sort()) === J(['disjoins [A]', 'disjoins [B]']),
  J({ presTypes, presuppositions: tuplesAB.filter((t) => /presupposes/.test(t.type)).length }));

// the hazard beyond item 3, MEASURED and pinned as found (reported to the mothership in C-12a's letter, not cured here): a
// record given at gen 2, then the way back and the same dissection again — gen 2 re-minted from gen 1's records alone
const H1id = cur().id;
S().selectCell(coreOf().id);
S().applyAmboDissectionToCurrent();
const H2id = cur().id;
const bornPairOn = (X, Y) => {
  const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y));
  const R0 = spaceOf(cur(), e.vertexIds[0]); const R1 = spaceOf(cur(), e.vertexIds[1]);
  const c = composedOn(cur(), R0, R1, [e.vertexIds[0], e.vertexIds[1]], 'medial');
  const dom = new Set(c.roles.map(([x]) => x)); const im = new Set(c.roles.map(([, y]) => y));
  for (const x of R0.space.roles.map((r) => r.id).filter((id) => !dom.has(id))) for (const y of R1.space.roles.map((r) => r.id).filter((id) => !im.has(id))) {
    S().giveRolePair(e.id, x, y);
    if (cur().edges.find((f) => f.id === e.id).identification?.roles.some(([a, b]) => a === x && b === y)) return { edge: e.id, pair: `${nameIn(R0.space, x)} ↦ ${nameIn(R1.space, y)}` };
    S().withdrawMidpointAttempt(e.id);
  }
  return null;
};
const bornAtGen2 = bornPairOn('AB', 'AC');
const recordOn = (shape, edgeId) => { const e = shape.edges.find((x) => x.id === edgeId); return e && e.identification ? e.identification.roles.length : 0; };
const gen2RecordBefore = bornAtGen2 ? recordOn(cur(), bornAtGen2.edge) : null;
S().selectShape(H1id);
S().selectCell(coreOf().id);
S().applyAmboDissectionToCurrent();
const remade = cur();
const gen2RecordAfter = bornAtGen2 ? recordOn(remade, bornAtGen2.edge) : null;
const gen1Carried = recordOn(remade, edgeBetween(remade.edges, byLabel(remade, 'A'), byLabel(remade, 'B')).id);
note(`the way back then the same dissection: gen 2 ${remade.id === H2id ? 'returned under its own id' : 'a new id'} · the born pair given at gen 2 (${bornAtGen2 && bornAtGen2.pair}) before ${gen2RecordBefore} → after ${gen2RecordAfter} · gen 1's pairs on A–B carried ${gen1Carried}`);
check('§3 ★★ THE BORN PAIR STANDS (§148 ruling 3, the witness the ruling asked for): a born pair given at gen 2, the way back to gen 1, the same cell dissected again — gen 2 returned as it was, the pair standing 1 → 1 (it was dropped 1 → 0 before the cure), gen 1\'s three pairs on A–B as before',
  bornAtGen2 !== null && remade.id === H2id && gen2RecordBefore === 1 && gen2RecordAfter === 1 && gen1Carried === 3,
  J({ born: bornAtGen2, before: gen2RecordBefore, after: gen2RecordAfter, gen1: gen1Carried, sameId: remade.id === H2id }));

// ─── §4 item 7 — THE EXPLORE ROOM'S READ SAYS ITS REFUSAL ────────────────────────────────────────────────────────────────
console.log('§4 — the explore room\'s read says its refusal');
const t3 = buildThreeTorusDomain();
const okRead = exploreReadOf({ domain: t3, coneEdgesDeclared: false, model: null, built: null, ancestors: [], resolveAbsent: undefined });
check('§4 ★★ THE LAWFUL READ returns the room: on the world\'s T³ the cell surface stands (6 faces, 12 rods) and no cargo room (no built record)',
  !('refusal' in okRead) && okRead.cellSurface && okRead.cellSurface.faces.length === 6 && okRead.cellSurface.rods.length === 12 && okRead.cargoRoom === null,
  J({ refusal: okRead.refusal ?? null, faces: okRead.cellSurface && okRead.cellSurface.faces.length, rods: okRead.cellSurface && okRead.cellSurface.rods.length }));
let thrownBySurface = null;
try { readCellSurface({ ...t3, shape: null }, false, null); } catch (e) { thrownBySurface = e; }
const badSurface = exploreReadOf({ domain: { ...t3, shape: null }, coneEdgesDeclared: false, model: null, built: null, ancestors: [], resolveAbsent: undefined });
const badCargo = exploreReadOf({ domain: t3, coneEdgesDeclared: false, model: null, built: { seed: null, rows: [] }, ancestors: [], resolveAbsent: undefined });
check('§4 ★★ THE REFUSAL SAID (item 7): a read whose surface throws returns `cannot walk this room — its surface could not be read: <reason>` with the very message the throw carried — never null, never a paraphrase; a throw in the cargo\'s room is caught by the same guard',
  thrownBySurface !== null && 'refusal' in badSurface && badSurface.refusal === `cannot walk this room — its surface could not be read: ${thrownBySurface.message}` && badSurface.refusal === exploreRefusalWords(thrownBySurface) && 'refusal' in badCargo && /^cannot walk this room — its surface could not be read: ./.test(badCargo.refusal),
  J({ thrown: thrownBySurface && thrownBySurface.message, surface: badSurface.refusal, cargo: badCargo.refusal }));

// ─── §6 §148 ruling 1 — THE FINER BOUNDARY OF A LIFTED CELL, and the glue that used to throw ─────────────────────────────
console.log('§6 — the gen-2 corner cell lifted at the finer grain; glued into a room; the door\'s act and the cargo on it');
const A = req('src/manuscript/apertureModel.ts');
const D = req('src/manuscript/doorTransportModel.ts');
const C = req('src/manuscript/cargoModel.ts');
{
  let seeded6 = createSeedShape('tetrahedron');
  for (const [label, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', phi]]) seeded6 = withCast(seeded6, byLabel(seeded6, label), c);
  reset(seeded6);
  S().applyAmboDissectionToCurrent();
  const K1 = cur().id;
  give('A', 'B', { F1: 'r0', F5: 'r2', F7: 'r8' }); giveWord('A', 'B', 'sustains', 'sustains');
  give('A', 'C', { F1: 'Φ1', F7: 'Φ3' });
  S().selectCell(coreOf().id); S().applyAmboDissectionToCurrent();
  const liftAt = (label) => { S().selectCell(residueAt(label).id); S().liftSelectionToManuscript(); const entry = loadUniverseSnapshot(lastLift().file); return { entry, shape: placeShelfEntry(entry, 0).shape }; };
  const { entry: e2, shape: g2 } = liftAt('A');
  const L6 = (id) => g2.vertices[id]?.data.label || id;
  const cell6 = g2.cells[0];
  const cellFaces = new Set(cell6.faceIds);
  const incident = (e) => g2.faces.filter((f) => f.vertexIds.some((a, i) => { const b = f.vertexIds[(i + 1) % f.vertexIds.length]; return (a === e.vertexIds[0] && b === e.vertexIds[1]) || (a === e.vertexIds[1] && b === e.vertexIds[0]); }));
  const names = (f) => f.vertexIds.map(L6).join('·');
  const sides = g2.faces.filter((f) => f.vertexIds.length === 4); const tris = g2.faces.filter((f) => f.vertexIds.length === 3);
  note(`the gen-2 residue at A lifted: V ${Object.keys(g2.vertices).length} · E ${g2.edges.length} · F ${g2.faces.length} · the cell's faces ${cell6.faceIds.length} · corners ${cell6.vertexIds.map(L6).join('·')} · faces ${g2.faces.map(names).join(' | ')}`);
  check('§6 ★★ ONE BOUNDARY, THE FINER (§148 ruling 1): the gen-2 residue at A lifts as 7 corners · 12 edges · 7 faces — its three sides OPENED through the midpoints on them (4 corners each, the midpoint a straight 180° corner: A·AC·ABAC·AB and its two fellows) and the four finer triangles that tile its dissected face; the cell\'s record names those 7 faces and its 7 corners; EVERY edge lies on exactly two of the cell\'s faces (the frozen extractor\'s law); nothing erased — the coarse face AC·AB·AD stands recorded on its four tiles\' `composes`, each coarse side on its two halves\'',
  Object.keys(g2.vertices).length === 7 && g2.edges.length === 12 && g2.faces.length === 7 && cell6.faceIds.length === 7 && cell6.vertexIds.length === 7 && g2.faces.every((f) => cellFaces.has(f.id)) && sides.length === 3 && tris.length === 4 && sides.every((f) => f.cornerAngles && f.cornerAngles.some((a) => Math.abs(a - Math.PI) < 1e-6)) && g2.edges.every((e) => incident(e).filter((f) => cellFaces.has(f.id)).length === 2) && tris.every((f) => f.composes && f.composes.sourceVertexIds.map(L6).sort().join('·') === 'AB·AC·AD') && g2.edges.filter((e) => e.composes).length === 6 && sides.every((f) => !f.composes),
  J({ V: Object.keys(g2.vertices).length, E: g2.edges.length, F: g2.faces.length, cellFaces: cell6.faceIds.length, corners: cell6.vertexIds.length, sides: sides.map(names), tris: tris.map(names), twoFaced: g2.edges.filter((e) => incident(e).filter((f) => cellFaces.has(f.id)).length === 2).length, composedEdges: g2.edges.filter((e) => e.composes).length }));
  const menu = A.boundaryFacesOf(g2);
  const faceWith = (set) => menu.find((m) => { const t = m.label.split(' · ')[0].split('·'); return t.length === set.length && set.every((x) => t.includes(x)); });
  const fA = faceWith(['A', 'AC', 'ABAC', 'AB']); const fB = faceWith(['A', 'AB', 'ABAD', 'AD']);
  const cands = fA && fB ? A.dihedralMapCandidates(g2, fA.id, fB.id) : [];
  const lab = (v) => A.cornerDisplayName(g2, v);
  const hinge = cands.find((c) => /^A→A · AC→AD · ABAC→ABAD · AB→AB — preserving/.test(A.describeCandidate(c, lab)));
  check('§6 ★★ THE FINER BOUNDARY OFFERED BY D14 NAME AT THE APERTURE: seven faces — `A·AC·ABAC·AB · 4 corners`, `A·AB·ABAD·AD · 4 corners`, `A·AD·ACAD·AC · 4 corners`, `ABAC·ABAD·ACAD · 3 corners` and the three corner triangles; the two sides at the hinge A–AB admit two maps, the preserving one `A→A · AC→AD · ABAC→ABAD · AB→AB`',
    menu.length === 7 && ['A·AC·ABAC·AB · 4 corners', 'A·AB·ABAD·AD · 4 corners', 'A·AD·ACAD·AC · 4 corners', 'ABAC·ABAD·ACAD · 3 corners'].every((n) => menu.some((m) => m.label === n)) && menu.filter((m) => / · 4 corners$/.test(m.label)).length === 3 && cands.length === 2 && Boolean(hinge),
    J({ menu: menu.map((m) => m.label), cands: cands.map((c) => A.describeCandidate(c, lab)) }));
  let verdict6 = null; let threw6 = null; let surface6 = null; let room6 = null; let act6 = null; let rows6 = null;
  if (fA && fB && hinge) {
    const record = e2.loaded.ancestors[0];
    const memo = new Map();
    const SA = D.sideOf(record, hinge.correspondence.map(([a]) => a), memo, fA.label.split(' · ')[0]);
    const SB = D.sideOf(record, hinge.correspondence.map(([, b]) => b), memo, fB.label.split(' · ')[0]);
    act6 = D.actAt(SA.side, SB.side, [], 0, 'F1', 'F1');
    rows6 = [{ faceA: fA.id, faceB: fB.id, candidateKey: hinge.key, transports: act6.taken ? act6.transports : [] }, { faceA: null, faceB: null, candidateKey: null }];
    try {
      verdict6 = A.buildPersonDomainVerdict(g2, rows6, 'built-2', 'built 3-manifold 2');
      surface6 = A.readCellSurface(verdict6.domain, false);
      room6 = C.cargoRoomOf(g2, e2.loaded.ancestors ?? [], rows6, surface6);
    } catch (e) { threw6 = e.message; }
  }
  note(`the glue on the finer boundary: ${threw6 ? `THROWS ${threw6.slice(0, 120)}` : verdict6 ? `sound=${verdict6.domain.tower.sound} · counts ${J(verdict6.domain.complex.counts)} · chi ${verdict6.domain.complex.chi}` : 'not reached'} · the act at A: ${act6 ? (act6.taken ? `taken, ${act6.transports.length} corner pairs` : `refused ${act6.refusal && act6.refusal.kind}`) : 'none'} · the cargo room: ${room6 ? `entry ${room6.entry ? L6(room6.entry) : '?'} · rods ${room6.rods ? room6.rods.length : '?'} · faces ${room6.faces ? room6.faces.length : '?'} · doors ${room6.doors ? room6.doors.length : '?'}` : 'none'}`);
  check('§6 ★★ THE GLUE THAT USED TO THROW: the hinge door on the two side faces, F1 ↦ F1 at A taken with its line (four corner pairs on the 4-cycle), the S² gate judges the finer boundary SOUND (the level-3 census v 5 · e 9 · f 6 · c 1, χ 1 — a bounded room, five walls); the cell surface reads 7 faces (corners 4/4/4/3/3/3/3) and 12 rods; the cargo\'s room stands from the built record — entry A, 12 rods, 7 faces, one door',
    threw6 === null && act6 && act6.taken === true && act6.transports.length === 4 && verdict6 && !verdict6.folded && verdict6.domain.tower.sound === true && J(verdict6.domain.complex.counts) === J({ v: 5, e: 9, f: 6, c: 1 }) && surface6 && surface6.faces.length === 7 && surface6.rods.length === 12 && J(surface6.faces.map((f) => (f.corners || []).length)) === J([4, 4, 4, 3, 3, 3, 3]) && room6 && L6(room6.entry) === 'A' && room6.rods.length === 12 && room6.faces.length === 7 && room6.doors.length === 1,
    J({ threw: threw6, taken: act6 && act6.taken, pairs: act6 && act6.transports && act6.transports.length, sound: verdict6 && verdict6.domain.tower.sound, counts: verdict6 && verdict6.domain.complex.counts, surface: surface6 && [surface6.faces.length, surface6.rods.length], room: room6 && { entry: L6(room6.entry), rods: room6.rods.length, faces: room6.faces.length, doors: room6.doors.length } }));
  // the control: the gen-1 residue lifts as it always did (no finer structure — nothing composed, nothing opened)
  S().selectShape(K1);
  const { shape: g1 } = liftAt('A');
  check('§6 ★ THE CONTROL — a lift with no finer structure is byte-as-before: the gen-1 residue at A lifts as 4 corners · 6 edges · 4 faces, nothing composed, no face opened',
    Object.keys(g1.vertices).length === 4 && g1.edges.length === 6 && g1.faces.length === 4 && g1.faces.every((f) => f.vertexIds.length === 3 && !f.composes) && g1.edges.every((e) => !e.composes) && g1.cells[0].faceIds.length === 4 && g1.cells[0].vertexIds.length === 4,
    J({ V: Object.keys(g1.vertices).length, E: g1.edges.length, F: g1.faces.length }));
}

// ─── §5 THE SURFACES BY SOURCE, PURITY, THE MANIFEST ─────────────────────────────────────────────────────────────────────
console.log('§5 — the surfaces by source; purity; the manifest');
const panels = readLf('src/components/Panels.tsx');
const workspace = panels.slice(panels.indexOf('function WorkspacePanel()'), panels.indexOf('function WorkspacePanel()') + 900);
check('§5 ★★ THE GENEALOGY MOUNTED WHERE THE PERSON REACHES IT (item 3): `WorkspacePanel` mounts `<GenealogyViewer />` (the exported viewer whose rows call `selectShape`); the viewer was defined and mounted nowhere before',
  /<GenealogyViewer \/>/.test(workspace) && /export function GenealogyViewer\(\)/.test(panels) && (panels.match(/<GenealogyViewer \/>/g) || []).length === 1 && /onClick=\{\(\) => selectShape\(shapeId\)\}/.test(panels),
  J({ inWorkspace: /<GenealogyViewer \/>/.test(workspace), mounts: (panels.match(/<GenealogyViewer \/>/g) || []).length }));
const view = readLf('src/manuscript/ManuscriptView.tsx');
const memo = view.slice(view.indexOf('const exploreRead = useMemo('), view.indexOf('}, [exploreOpen, dim3All, apertures, foldedBodies, foldedApertures, builtRecords, shelfAncestors, resolveAbsentLabel]);'));
check('§5 ★★ THE VIEW SAYS THE REFUSAL AND SWALLOWS NOTHING (item 7): the explore memo reads through `exploreReadOf` and holds no `catch`; the read\'s two outcomes are told apart (`exploreRoom` / `exploreReadRefusal`); the door\'s refusal register prints either refusal (`data-explore-refusal`)',
  memo.length > 0 && /exploreReadOf\(\{/.test(memo) && !/catch/.test(memo) && /if \('refusal' in read\) return \{ refusal: read\.refusal \};/.test(memo) && /const exploreRoom = exploreRead && !\('refusal' in exploreRead\) \? exploreRead : null;/.test(view) && /const exploreReadRefusal = exploreRead && 'refusal' in exploreRead \? exploreRead\.refusal : null;/.test(view) && /\{exploreRefusal \|\| exploreReadRefusal \? \(/.test(view) && /\{exploreRefusal \? exploreRefusal\.reason : exploreReadRefusal\}/.test(view) && !/import \{ cargoRoomOf \} from '\.\/cargoModel';/.test(view),
  J({ memoLen: memo.length, catches: (memo.match(/catch/g) || []).length }));
const hullSrc = readLf('src/manuscript/DomainHitHull.tsx');
const { execFileSync } = require('node:child_process');
let inkedClean = false;
try { execFileSync('git', ['diff', '--quiet', 'HEAD', '--', 'src/manuscript/InkedDomain.tsx'], { cwd: repoRoot, stdio: 'ignore' }); inkedClean = true; } catch { inkedClean = false; }
check('§5 ★★ THE HIT HULL BESIDE THE FROZEN DRAWING (item 8): DomainHitHull mounts one mesh named `hit-hull` fanned from the domain\'s faces, drawing nothing (`colorWrite={false}`, opacity 0), double-sided; the view mounts it beside the ROOM\'s InkedDomain (the summoned dim-3 body — one site; the live aperture skeleton, the other InkedDomain mount, is no room a person picks); InkedDomain itself (FROZEN, manifest row) is byte-equal to HEAD — the group\'s own double-click reaches the hull (measured at the eye, §12 of the leg)',
  (hullSrc.match(/name="hit-hull"/g) || []).length === 1 && /colorWrite=\{false\}/.test(hullSrc) && /side=\{DoubleSide\}/.test(hullSrc) && /for \(let i = 1; i \+ 1 < ps\.length; i \+= 1\) tri\.push\(\.\.\.ps\[0\], \.\.\.ps\[i\], \.\.\.ps\[i \+ 1\]\);/.test(hullSrc) && (view.match(/<InkedDomain\b/g) || []).length === 2 && (view.match(/<DomainHitHull shape=\{model\.shape\} \/>/g) || []).length === 1 && (view.match(/<DomainHitHull\b/g) || []).length === 1 && !/name="hit-hull"/.test(readLf('src/manuscript/InkedDomain.tsx')) && inkedClean,
  J({ hulls: (hullSrc.match(/name="hit-hull"/g) || []).length, inkedMounts: (view.match(/<InkedDomain\b/g) || []).length, hullMounts: (view.match(/<DomainHitHull shape=\{model\.shape\} \/>/g) || []).length, inkedClean }));
const ambo = readLf('src/lib/ambo.ts');
check('§5 ★ THE NAME\'S MINT (item 2): ambo.ts names the child `Ambo Dissection ${parent.name}` only when the parent is not already so named',
  /name: parent\.name\.startsWith\('Ambo Dissection '\) \? parent\.name : `Ambo Dissection \$\{parent\.name\}`,/.test(ambo), '');
const readSrc = readLf('src/manuscript/exploreRead.ts');
const imports = [...readSrc.matchAll(/^import .* from '([^']+)';$/gm)].map((m) => m[1]);
check('§5 ★ PURITY: exploreRead.ts imports the geometry types, the aperture model and the cargo model — no react, no store, no component',
  J(imports.sort()) === J(['../types/geometry', './apertureModel', './cargoModel'].sort()) && !/react/.test(readSrc), J(imports));
const manifest = readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt');
// a row STARTS with the path (a bare `path  <sha256>` row = FROZEN, space-padded) or with `NOT_FROZEN <path> — …`
const rowOf = (p) => manifest.split('\n').find((l) => l.startsWith(`${p} `) || l.startsWith(`${p}\t`) || l.startsWith(`NOT_FROZEN ${p} `)) || null;
const notFrozen = (p) => { const r = rowOf(p); return r !== null && r.startsWith('NOT_FROZEN '); };
const frozenRow = (p) => { const r = rowOf(p); return r !== null && new RegExp(`^${p.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\s+[0-9a-f]{64}\\s*$`).test(r); };
check('§5 ★ THE MANIFEST: exploreRead.ts and DomainHitHull.tsx classified NOT_FROZEN in the landing commit; every file this cut touched under the engine roots is NOT_FROZEN (ambo · subComplexLift · spaceOf · doorTransportModel · ManuscriptView); the two frozen files this cut MET stand bare and untouched — InkedDomain (the hull went beside it) and level3LinkExtractor (item 4, stopped)',
  notFrozen('src/manuscript/exploreRead.ts') && notFrozen('src/manuscript/DomainHitHull.tsx') && ['src/lib/ambo.ts', 'src/lib/subComplexLift.ts', 'src/lib/spaceOf.ts', 'src/manuscript/doorTransportModel.ts', 'src/manuscript/ManuscriptView.tsx'].every(notFrozen) && frozenRow('src/manuscript/InkedDomain.tsx') && frozenRow('src/lib/level3LinkExtractor.ts'),
  J({ exploreRead: notFrozen('src/manuscript/exploreRead.ts'), hull: notFrozen('src/manuscript/DomainHitHull.tsx'), inkedFrozen: frozenRow('src/manuscript/InkedDomain.tsx'), extractorFrozen: frozenRow('src/lib/level3LinkExtractor.ts') }));

console.log(`\nDIAGNOSE-THE-FOUND-BUGS: ${failures === 0 ? 'ALL PASS — a cell named by its kind and corners, the universe once, the way back safe, the lone word bracketed beside its chain, the explore read\'s refusal said' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
