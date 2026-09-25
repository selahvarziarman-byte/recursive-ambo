#!/usr/bin/env node
// DIAGNOSE-THE-ROAD — STAMP C-13 (the mothership's 1158 letter; Arman's Δ104: "fix F1 and F4. F2 must be fixed."): three
// defects found on the new seat's road — his four seeds → a cast each → the tetrahedron → two Ambo dissections → the six
// squares of g2 lifted one by one → the Manuscript. Landed in the order the road meets them, each with its own section here:
//
//   §a  C-13a (F2) — a cast quality value that is not text was dropped with no mark: the loader now carries it on the warrant
//       under its home, marks it by name in the house's form, counts it in the card's not-taken line; UNKNOWN and an omitted
//       quality stay absence. The same site's two siblings (a label that is not text; qualities that are not a set of named
//       values) take the same cure — said in the report.
//
// ⛔ RECORD, NOT READING: nothing here stores a reading; every line is re-derived from the record at the read.

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

console.log('DIAGNOSE-THE-ROAD — C-13, three found on the road (a · b · c), each in the order the road meets it');

// ═══ §a C-13a — A CAST QUALITY VALUE THAT IS NOT TEXT (F2) ═══
console.log('----- §a a quality value that is not text: not taken, carried on the warrant under its home, marked by name, counted -----');
const { readCastFile, notTakenAddresses, notTakenLine } = req('src/lib/castLoader.ts');
const castOf = (roles, extra = {}) => JSON.stringify({ roles, signature: [{ type: 'r', arity: 2 }], relations: [], ...extra });
const load = (roles, extra) => readCastFile(castOf(roles, extra));
const line = (r) => (r.taken ? notTakenLine(notTakenAddresses(r.cast)) : null);
const malformed = (r) => (r.taken && r.cast.warrant ? r.cast.warrant.malformed ?? null : null);

const letter = load([{ id: 'x', types: { weight: 3, kind: 'a' } }]);
note(`the letter's role at the cure: roles ${J(letter.cast && letter.cast.roles)} · marks ${J(letter.marks)} · warrant ${J(letter.cast && letter.cast.warrant)} · card ${J(line(letter))}`);
check('§a ★★ THE LETTER\'S ROLE `{ id: "x", types: { weight: 3, kind: "a" } }` (✔ RAN at the base d95de24: `types: { kind: \'a\' }`, `marks: []`, `warrant: null` — the number gone, nothing saying so): the kind stays categorical (`kind: a` taken, the number NOT a quality); the value CARRIED on the warrant under its home `roles.0.types.weight`; MARKED by name `role 0: quality "weight" is not text — not taken`; COUNTED in the card\'s line `1 item not taken: role 0\'s quality "weight"`',
  letter.taken === true && J(letter.cast.roles) === J([{ id: 'x', types: { kind: 'a' } }]) && J(letter.marks) === J(['role 0: quality "weight" is not text — not taken']) &&
    J(malformed(letter)) === J({ 'roles.0.types.weight': 3 }) && line(letter) === '1 item not taken: role 0\'s quality "weight"',
  J({ roles: letter.cast && letter.cast.roles, marks: letter.marks, malformed: malformed(letter), card: line(letter) }));

const others = load([{ id: 'x', types: { n: null, a: [1], o: { c: 1 }, b: true, kind: 'a' } }]);
check('§a ★ EVERY VALUE THAT IS NOT TEXT takes the same road — null, an array, an object, a boolean: each marked by its name, carried by its name with its bytes unchanged, counted (4 items), the text quality beside them taken',
  others.taken && J(others.cast.roles) === J([{ id: 'x', types: { kind: 'a' } }]) && others.marks.length === 4 && ['n', 'a', 'o', 'b'].every((k) => others.marks.includes(`role 0: quality "${k}" is not text — not taken`)) &&
    J(malformed(others)) === J({ 'roles.0.types.n': null, 'roles.0.types.a': [1], 'roles.0.types.o': { c: 1 }, 'roles.0.types.b': true }) &&
    line(others) === '4 items not taken: role 0\'s quality "n" · role 0\'s quality "a" · role 0\'s quality "o" · role 0\'s quality "b"',
  J({ roles: others.cast && others.cast.roles, marks: others.marks, malformed: malformed(others), card: line(others) }));

const absent = load([{ id: 'x', types: { kind: 'UNKNOWN' } }, { id: 'y' }, { id: 'z', label: '' }]);
check('§a ★ UNKNOWN AND AN OMITTED QUALITY STAY ABSENCE, UNCHANGED (and an empty label, as before): `kind: UNKNOWN` kept verbatim, the role with no qualities holds none, the empty label no label — no mark, no warrant, no card line',
  absent.taken && J(absent.cast.roles) === J([{ id: 'x', types: { kind: 'UNKNOWN' } }, { id: 'y' }, { id: 'z' }]) && absent.marks.length === 0 && absent.cast.warrant === undefined && line(absent) === null,
  J({ roles: absent.cast && absent.cast.roles, marks: absent.marks, warrant: absent.cast && absent.cast.warrant }));

const siblings = load([{ id: 'x', label: 5 }, { id: 'y', types: ['a', 'b'] }, { id: 'z', types: 'weight' }]);
check('§a ★★ THE SAME SITE\'S TWO SIBLINGS, THE SAME CURE (the coder\'s widening, said in the report — measured at the base: both erased with no mark): a label that is not text (`role 0: its label is not text — not taken`, carried under `roles.0.label`) and qualities that are not a set of named values (an array, a string — `role N: its qualities are not a set of named values — not taken`, carried under `roles.N.types`); each counted by its home',
  siblings.taken && J(siblings.cast.roles) === J([{ id: 'x' }, { id: 'y' }, { id: 'z' }]) &&
    J(siblings.marks) === J(['role 0: its label is not text — not taken', 'role 1: its qualities are not a set of named values — not taken', 'role 2: its qualities are not a set of named values — not taken']) &&
    J(malformed(siblings)) === J({ 'roles.0.label': 5, 'roles.1.types': ['a', 'b'], 'roles.2.types': 'weight' }) &&
    line(siblings) === '3 items not taken: role 0\'s label · role 1\'s qualities · role 2\'s qualities',
  J({ marks: siblings.marks, malformed: malformed(siblings), card: line(siblings) }));

const mixed = load([{ id: 'x', types: { weight: 3 } }, { label: 'no id' }], { relations: [{ type: 'r', terms: ['x', 'x'], polarity: 'maybe' }] });
check('§a ★ THE HOUSE FORMS STAND BESIDE THE NEW ONES, IN THE FILE\'S ORDER: a role with no id reads `role 1: has no id — not taken` (address `role 1`), a relation with no polarity `relation 0`; the card line counts all three — `3 items not taken: role 0\'s quality "weight" · role 1 · relation 0`',
  mixed.taken && mixed.marks.includes('role 1: has no id — not taken') && mixed.marks.includes('role 0: quality "weight" is not text — not taken') && line(mixed) === '3 items not taken: role 0\'s quality "weight" · role 1 · relation 0',
  J({ marks: mixed.marks, card: line(mixed) }));

const dotted = load([{ id: 'x', types: { 'a.b': 3 } }]);
check('§a ★ A QUALITY\'S NAME MAY HOLD A DOT: `{ "a.b": 3 }` is carried under `roles.0.types.a.b` and read back whole — `role 0\'s quality "a.b"` (everything after `types.` is the name)',
  dotted.taken && J(malformed(dotted)) === J({ 'roles.0.types.a.b': 3 }) && line(dotted) === '1 item not taken: role 0\'s quality "a.b"', J({ malformed: malformed(dotted), card: line(dotted) }));

check('§a ★ ONE READER EACH WAY: the card\'s Cast rows print `notTakenLine(notTakenAddresses(cast))` — the warrant read by key, re-derived at every read; the load line joins the loader\'s own marks; the manifest classifies the loader NOT_FROZEN',
  readLf('src/components/Panels.tsx').includes('const notTaken = notTakenLine(notTakenAddresses(cast));') && readLf('src/components/VertexPacketEditor.tsx').includes("load.marks.join(' · ')") &&
    /^NOT_FROZEN src\/lib\/castLoader\.ts /m.test(readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt')));

// ═══ §b C-13b — RENAMING A CORNER MADE ITS MIDPOINTS LOOK NAMED, WITH STALE LETTERS (F4) — Δ58 · Δ104 as C-13 · M1 reconciles them ═══
console.log('----- §b the slot keeps the composed string; the string follows its corners; christened is a positive mark set by the act -----');
const { createSeedShape } = req('src/data/seeds.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { givenLabelOf, isChristened, isGeneratedMidpoint, midpointLetters, migrateChristening, withChristened, CHRISTENED_KEY } = req('src/lib/christening.ts');
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label);
const reset = (seeded) => useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, liftSelection: [], selectedCellId: null, selectedVertexId: null, selectedEdgeId: null, selectedFaceId: null });
const coreOf = () => cur().cells.find((c) => c.kind === 'core');
const act = (shapeId, vertexId, label) => { S().selectShape(shapeId); S().selectVertex(vertexId); S().updateSelectedVertexData({ label }); }; // the packet editor's Save with a changed Label, as the store receives it
const lab = (shapeId, id) => S().shapes[shapeId].vertices[id].data.label;
const given = (shapeId, id) => givenLabelOf(S().shapes[shapeId].vertices[id]);
const marked = (shapeId, id) => isChristened(S().shapes[shapeId].vertices[id].data);
// the OLD judge (Panels.tsx:3941 / VertexPacketEditor.tsx:513 at d95de24), kept here as the positive control of the mechanism
const oldJudgeReadsAName = (shape, v) => { const [a, b] = v.createdBy.sourceVertexIds.map((id) => shape.vertices[id].data.label); return !new Set([`${a}${b}`, `${b}${a}`, `${a}-${b}`, `${b}-${a}`]).has(v.data.label); };

reset(createSeedShape('tetrahedron'));
S().selectCell(cur().cells[0].id); S().applyAmboDissectionToCurrent();
const g1 = cur().id;
const vA = byLabel(cur(), 'A').id; const vAB = byLabel(cur(), 'AB').id; const vAC = byLabel(cur(), 'AC').id; const vBC = byLabel(cur(), 'BC').id;
S().selectCell(coreOf().id); S().applyAmboDissectionToCurrent();
const g2 = cur().id;
const vABAC = byLabel(cur(), 'ABAC').id;
check('§b ★ THE MINT AS NOW (Δ58 "keep exactly as now"): a fresh dissection\'s midpoints hold the composed string in the Ambo\'s own form — `AB` · `AC` · `BC`, then `ABAC` — un-christened, no mark, the judge reading no name; the mint and the re-composition read ONE rule (`midpointLetters`)',
  [lab(g1, vAB), lab(g1, vAC), lab(g1, vBC), lab(g2, vABAC)].join(' ') === 'AB AC BC ABAC' && [[g1, vAB], [g1, vAC], [g2, vABAC]].every(([s, id]) => !marked(s, id) && given(s, id) === null) && midpointLetters('A', 'B') === 'AB' &&
    readLf('src/lib/ambo.ts').includes('midpointLetters(sourceA.data.label, sourceB.data.label),') && readLf('src/lib/ambo.ts').includes("import { midpointLetters } from './christening';"),
  J({ g1: [lab(g1, vAB), lab(g1, vAC), lab(g1, vBC)], g2: lab(g2, vABAC) }));
{
  // the positive control of the mechanism: a corner renamed with the strings left as the base left them — the OLD judge reads AB as a name
  const stale = { ...S().shapes[g1], vertices: { ...S().shapes[g1].vertices, [vA]: { ...S().shapes[g1].vertices[vA], data: { ...S().shapes[g1].vertices[vA].data, label: 'apex' } } } };
  check('§b ★★ THE DEFECT\'S MECHANISM, REPRODUCED (the positive control — the mothership\'s ✔ RAN at d95de24): with A renamed `apex` and the strings left as they stood, the OLD string-comparison judge reads AB (`AB`) as a NAME; the one judge reads no name there',
    oldJudgeReadsAName(stale, stale.vertices[vAB]) === true && givenLabelOf(stale.vertices[vAB]) === null, J({ old: oldJudgeReadsAName(stale, stale.vertices[vAB]), judge: givenLabelOf(stale.vertices[vAB]) }));
}
act(g1, vA, 'apex');
check('§b ★★ THE STRING FOLLOWS ITS CORNERS (M1 §2): A → `apex` at gen 1 — AB reads `apexB`, AC `apexC`, BC stays `BC`; every one still un-christened, the judge reading no name (the Packets status, the unresolved count and Next unresolved read that); and ONE GENERATION DOWN gen 2\'s copy of A reads `apex`, its AB `apexB`, its ABAC `apexBapexC` — the person\'s word on a corner reaches every shape holding it',
  lab(g1, vA) === 'apex' && lab(g1, vAB) === 'apexB' && lab(g1, vAC) === 'apexC' && lab(g1, vBC) === 'BC' && [vAB, vAC, vBC].every((id) => !marked(g1, id) && given(g1, id) === null) &&
    lab(g2, vA) === 'apex' && lab(g2, vAB) === 'apexB' && lab(g2, vAC) === 'apexC' && lab(g2, vABAC) === 'apexBapexC' && !marked(g2, vABAC) && given(g2, vABAC) === null,
  J({ g1: [lab(g1, vA), lab(g1, vAB), lab(g1, vAC), lab(g1, vBC)], g2: [lab(g2, vA), lab(g2, vAB), lab(g2, vAC), lab(g2, vABAC)] }));
act(g1, vAB, 'the bridge');
act(g1, vA, 'top');
check('§b ★★ CHRISTENED IS A POSITIVE MARK SET BY THE ACT (M1 §3), AND A CHRISTENED MIDPOINT IS NEVER TOUCHED: AB christened `the bridge` at gen 1 — the mark `custom.christened: true` set by the act, the judge reading the name, gen 2\'s copy christened alike; then A → `top`: AB keeps `the bridge` in both shapes, AC follows (`topC`), gen 2\'s ABAC composes from its parents\' strings as they stand — `the bridgetopC`',
  marked(g1, vAB) && S().shapes[g1].vertices[vAB].data.custom[CHRISTENED_KEY] === true && given(g1, vAB) === 'the bridge' && marked(g2, vAB) && given(g2, vAB) === 'the bridge' &&
    lab(g1, vA) === 'top' && lab(g1, vAB) === 'the bridge' && lab(g1, vAC) === 'topC' && lab(g2, vAB) === 'the bridge' && lab(g2, vAC) === 'topC' && lab(g2, vABAC) === 'the bridgetopC',
  J({ g1: [lab(g1, vA), lab(g1, vAB), lab(g1, vAC)], g2: [lab(g2, vAB), lab(g2, vAC), lab(g2, vABAC)], marks: [marked(g1, vAB), marked(g2, vAB)] }));
act(g1, vAB, '');
check('§b ★ THE SLOT IS NEVER EMPTIED (M1 §1): AB\'s label cleared by the person — the mark cleared (no `false` left behind), the composed string returns, `topB`, in both shapes, gen 2\'s ABAC following (`topBtopC`); the judge reads no name',
  !marked(g1, vAB) && S().shapes[g1].vertices[vAB].data.custom[CHRISTENED_KEY] === undefined && lab(g1, vAB) === 'topB' && lab(g2, vAB) === 'topB' && lab(g2, vABAC) === 'topBtopC' && given(g1, vAB) === null,
  J({ g1: lab(g1, vAB), g2: [lab(g2, vAB), lab(g2, vABAC)], custom: S().shapes[g1].vertices[vAB].data.custom }));
{
  // workspaces saved before the mark: the stated heuristic and its named failure case
  const base = S().shapes[g1];
  const withLabel = (shape, id, label, custom) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, label, custom: custom ?? {} } } } });
  let old = withLabel(base, vAB, 'AB', {});           // stale: A reads `top` now — the old defect's own trace
  old = withLabel(old, vAC, 'topC', {});              // in step with its corners
  old = withLabel(old, vBC, 'the river', {});         // a name the person gave before the cure, no mark
  const vB = byLabel(base, 'B').id; const vC = byLabel(base, 'C').id; void vB; void vC;
  const migrated = migrateChristening(old);
  check('§b ★ WORKSPACES SAVED BEFORE THE MARK (M1 §5) — the stated heuristic, once at import: a slot that differs from every form the old mint or judge composed from its corners\' labels as they stand now is taken as a given name and MARKED (`the river`); one equal to them stays un-christened (`topC`); ITS FAILURE CASE, NAMED AND PINNED: a slot left stale by a corner renamed before the cure (`AB` with A now `top`) is byte-identical to a given name and is marked christened — the old defect kept for that one vertex until the person clears it; nothing else in the packet touched',
    isChristened(migrated.vertices[vBC].data) && !isChristened(migrated.vertices[vAC].data) && isChristened(migrated.vertices[vAB].data) && migrated.vertices[vAB].data.label === 'AB' && migrated.vertices[vBC].data.label === 'the river' &&
      J(withChristened(migrated.vertices[vBC].data.custom, false)) === J({}) && readLf('src/store/geometryStore.ts').includes('migrateChristening(held)'),
    J({ AB: migrated.vertices[vAB].data, AC: migrated.vertices[vAC].data.custom, BC: migrated.vertices[vBC].data.custom }));
  // the import path applies it: the store's own export, re-imported
  const exported = S().exportWorkspace();
  exported.shapes[g1] = old;
  S().importWorkspace(exported);
  check('§b ★ THE IMPORT PATH APPLIES IT: the store\'s own export with the pre-cure shape in it, re-imported — `the river` and the stale `AB` come back christened, `topC` un-christened; the labels as saved',
    S().currentShapeId !== undefined && isChristened(S().shapes[g1].vertices[vBC].data) && isChristened(S().shapes[g1].vertices[vAB].data) && !isChristened(S().shapes[g1].vertices[vAC].data) && S().shapes[g1].vertices[vBC].data.label === 'the river' && S().shapes[g1].vertices[vAB].data.label === 'AB',
    J({ AB: S().shapes[g1].vertices[vAB].data, BC: S().shapes[g1].vertices[vBC].data.custom }));
}
check('§b ★★ BOTH STRING-COMPARISON JUDGES ARE GONE (M1 §3 ⚠): Panels.tsx and VertexPacketEditor.tsx read `givenLabelOf(vertex)` from src/lib/christening.ts and hold no `isAutoGeneratedMidpointLabel`; the editor\'s Save sets the mark by the act (`withChristened`); the store\'s act propagates the label to every copy and re-composes (`recomposeUnchristened`); the manifest classifies the module NOT_FROZEN; the frozen readers (dualization row 50, incidenceTraceRegistry row 55) read the slot as before',
  (() => {
    const p = readLf('src/components/Panels.tsx'); const e = readLf('src/components/VertexPacketEditor.tsx'); const st = readLf('src/store/geometryStore.ts');
    return !p.includes('isAutoGeneratedMidpointLabel') && !e.includes('isAutoGeneratedMidpointLabel') && p.includes('return givenLabelOf(vertex);') && e.includes('return givenLabelOf(vertex);') &&
      p.includes("import { givenLabelOf } from '../lib/christening';") && e.includes("import { givenLabelOf, isGeneratedMidpoint, withChristened } from '../lib/christening';") &&
      e.includes('withChristened(validation.custom, labelDraft.trim().length > 0)') && st.includes('next[id] = recomposeUnchristened(target);') && st.includes("import { isGeneratedMidpoint, migrateChristening, recomposeUnchristened, withChristened } from '../lib/christening';") &&
      /^NOT_FROZEN src\/lib\/christening\.ts /m.test(readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt')) && !readLf('src/lib/christening.ts').includes('composeDesignation');
  })());

// ═══ §c C-13c — A LIFTED FACE WAS TITLED BY ITS ID (F1) ═══
console.log('----- §c a lifted face is designated by its composed corner name, never its id; where no name composes, an absence -----');
const { liftSubComplex, faceDesignationOf } = req('src/lib/subComplexLift.ts');
const { composeCornerCycleName } = req('src/lib/cornerCycleName.ts');
const { faceDisplayName } = req('src/manuscript/apertureModel.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
reset(createSeedShape('tetrahedron'));
S().selectCell(cur().cells[0].id); S().applyAmboDissectionToCurrent();
const c1 = cur().id;
S().selectCell(coreOf().id); S().applyAmboDissectionToCurrent();
const c2 = cur().id;
const g2s = S().shapes[c2];
const squares = g2s.faces.filter((f) => f.vertexIds.length === 4 && f.vertexIds.every((v) => (g2s.vertices[v]?.data.label ?? '').length === 4));
const squareNames = squares.map((f) => faceDesignationOf(g2s, f.id));
const namedSquare = squares.find((f) => faceDesignationOf(g2s, f.id) === 'ABAC·ACAD·ACCD·ACBC');
note(`the six squares of g2 by their composed names: ${J(squareNames)}`);
check('§c ★ THE SIX SQUARES OF g2 READ BY THEIR CORNERS (the name the inspector shows — the ONE frozen composer, cornerCycleName, through `faceDesignationOf`): twelve 4-corner face records of gen-2 midpoints (each square held by two cells, recorded once per cell), SIX distinct squares by name, each named by its corners with no `face:` in it, the mothership\'s own square `ABAC·ACAD·ACCD·ACBC` among them; `faceDesignationOf` equals the inspector\'s `faceDisplayName` on every record',
  squares.length === 12 && new Set(squareNames).size === 6 && squareNames.every((n) => typeof n === 'string' && /^[A-D]{4}(·[A-D]{4}){3}$/.test(n)) && namedSquare !== undefined && squares.every((f) => faceDesignationOf(g2s, f.id) === faceDisplayName(g2s, f)),
  J({ n: squares.length, distinct: new Set(squareNames).size, names: [...new Set(squareNames)] }));
{
  const lifted = liftSubComplex(g2s, [{ kind: 'face', id: namedSquare.id }]);
  check('§c ★★ THE LIFTED SQUARE IS TITLED BY ITS COMPOSED NAME, NEVER ITS ID (✔ SEEN at d95de24: `lifted “face:1gqspju of Ambo Dissection Tetrahedron”`): the title reads `ABAC·ACAD·ACCD·ACBC of <the universe\'s name>`, the lifted shape\'s name the same; the id stays the ADDRESS — `lift:face:…:from:…`, the face id inside it, unchanged bytes',
    lifted.title === `ABAC·ACAD·ACCD·ACBC of ${g2s.name}` && lifted.shape.name === lifted.title && !/face:/.test(lifted.title) && lifted.shape.id === `lift:${namedSquare.id}:from:${g2s.id}` && namedSquare.id.startsWith('face:'),
    J({ title: lifted.title, id: lifted.shape.id }));
  // the store's own act: the region set, the lift taken, the notice's title and the shelf's entry read the same name
  useGeometryStore.setState({ liftSelection: [{ kind: 'face', id: namedSquare.id }] });
  const before = useLiftStore.getState();
  const noticeTitle = S().liftSelectionToManuscript();
  const after = useLiftStore.getState();
  const shelf = after.queue;
  const last = Array.isArray(shelf) && shelf.length ? shelf[shelf.length - 1] : null;
  check('§c ★★ THE STORE\'S ACT, THE NOTICE AND THE SHELF READ THE SAME NAME: `liftSelectionToManuscript` returns the title the notice prints (`lifted “<title>” → the Manuscript shelf`, Panels.tsx), and the shelf\'s new entry carries it — `ABAC·ACAD·ACCD·ACBC of …`, never the id',
    noticeTitle === `ABAC·ACAD·ACCD·ACBC of ${g2s.name}` && last !== null && last.title === noticeTitle && readLf('src/components/Panels.tsx').includes('setLiftNotice(`lifted “${title}” → the Manuscript shelf`);') && before !== after,
    J({ noticeTitle, last: last && last.title, keys: Object.keys(after) }));
}
{
  // after C-13b: a corner christened, then a gen-1 face lifted — the title reads the corners' CURRENT designations
  S().selectShape(c1);
  const gA = byLabel(S().shapes[c1], 'A').id;
  S().selectVertex(gA); S().updateSelectedVertexData({ label: 'apex' });
  const g1s = S().shapes[c1];
  const face = g1s.faces.find((f) => f.vertexIds.length === 3 && f.vertexIds.includes(gA) && f.vertexIds.every((v) => ['apex', 'apexB', 'apexC', 'apexD'].includes(g1s.vertices[v].data.label)));
  const lifted = liftSubComplex(g1s, [{ kind: 'face', id: face.id }]);
  const expected = composeCornerCycleName(face.vertexIds.map((v) => g1s.vertices[v].data.label));
  check('§c ★ AFTER C-13b THE TITLE READS THE CORNERS\' CURRENT DESIGNATIONS: A christened `apex` at gen 1, the corner triangle at A lifted — its title composes from `apex` and the re-composed midpoint strings (`apex·apexB·apexC`, the composer\'s own rotation), never the old letters, never the id',
    lifted.title === `${expected} of ${g1s.name}` && /^apex·apex[B-D]·apex[B-D] of /.test(lifted.title), J({ title: lifted.title, expected }));
}
{
  // the fallback law: where no name composes (a corner without a label), the designation and the title are an ABSENCE, never the id
  const g = S().shapes[c1];
  const face = g.faces[0];
  const hole = { ...g, vertices: { ...g.vertices, [face.vertexIds[0]]: { ...g.vertices[face.vertexIds[0]], data: { ...g.vertices[face.vertexIds[0]].data, label: '' } } } };
  const lifted = liftSubComplex(hole, [{ kind: 'face', id: face.id }]);
  check('§c ★ THE FALLBACK LAW: a face with a corner that carries no label composes no name — the designation is an ABSENCE and so is the title (`\'\'`), never the id; the lifted shape\'s id still the address',
    faceDesignationOf(hole, face.id) === null && lifted.title === '' && lifted.shape.name === '' && lifted.shape.id === `lift:${face.id}:from:${hole.id}` && !/face:/.test(lifted.title),
    J({ title: lifted.title, id: lifted.shape.id }));
}
check('§c ★ THE COMPOSER IS CONSUMED, NOT COPIED: subComplexLift imports `composeCornerCycleName` from the FROZEN cornerCycleName (row 49) and holds no rotation of its own; the manifest classifies the lift NOT_FROZEN; a vertex or an edge with no given label still falls to its address — outside C-13, said in the source',
  (() => { const src = readLf('src/lib/subComplexLift.ts'); return src.includes("import { composeCornerCycleName } from './cornerCycleName';") && !/d14NameRotation|localeCompare\(\)/.test(src.split('export function faceDesignationOf')[1].split('\n}\n')[0]) && src.includes("(selections[0].kind === 'face' ? (faceDesignationOf(shape, selections[0].id) ?? '') : null) ??") && /^NOT_FROZEN src\/lib\/subComplexLift\.ts /m.test(readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt')) && /^src\/lib\/cornerCycleName\.ts\s+[0-9a-f]{64}/m.test(readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt')); })());

// ═══ §d C-13d — A LONG ROLE LABEL WAS CLIPPED AT THE DRAWING'S LEFT EDGE (the new seat's first report: `he involuntary omission`) ═══
console.log('----- §d every role\'s name is read whole: the label lane derives from the longest label, and a measured pass grows it further -----');
const { insideOf } = req('src/lib/castInside.ts');
const { insideGeometry, CastInsideDiagram } = req('src/components/CastInsideDiagram.tsx');
const React = require('react');
const { renderToString } = require('react-dom/server');
const LONG = 'the involuntary omission';
const longCast = readCastFile(JSON.stringify({ roles: [{ id: 'x', label: LONG, types: { kind: 'a' } }, { id: 'y', label: 'B' }], signature: [{ type: 'r', arity: 2 }], relations: [{ type: 'r', terms: ['x', 'y'], polarity: 'holds' }] })).cast;
const shortCast = readCastFile(JSON.stringify({ roles: [{ id: 'x', label: 'F1' }, { id: 'y', label: 'F2' }], signature: [{ type: 'r', arity: 2 }], relations: [{ type: 'r', terms: ['x', 'y'], polarity: 'holds' }] })).cast;
const gLong = insideGeometry(insideOf(longCast), { px: 0, top: 14 });
const gShort = insideGeometry(insideOf(shortCast), { px: 0, top: 14 });
const est = (label, badges) => (label.length + badges) * 7.2; // the drawing's own estimate at the label size
const longExtent = -10 - est(LONG, 3 + 'a'.length); // the label ends at px − 10, anchored end, with its ` · a` badge — this is its left edge by the estimate
const ruleAsItStood = Math.max(0, 118 + 12); // the fixed lane: the left edge of the viewBox was −130 for a cast with no up-arcs
check('§d ★★ THE POSITIVE CONTROL, BY THE RULE AS IT STOOD (✔ read at d95de24: `LABEL_LANE = 118`, `leftReach = max(maxUp + 40, 118 + 12)`): the seat\'s label `the involuntary omission` ends at px − 10 anchored end and, with its badge, reaches ' + Math.round(-longExtent) + ' px left by the estimate — past a left edge at −130 by ' + Math.round(-longExtent - ruleAsItStood) + ' px: clipped (`he involuntary omission`, the seat read)',
  -longExtent > ruleAsItStood, J({ longExtent, ruleAsItStood }));
check('§d ★★ THE CURE: the lane DERIVES from the longest label — the geometry\'s `labelLane` holds the label with its badges (' + Math.round(gLong.labelLane) + ' px), the viewBox\'s left edge (−leftReach = ' + Math.round(-gLong.leftReach) + ') lies left of the label\'s extent (' + Math.round(longExtent) + '), and a drawing of short labels keeps the floor (lane 118, as before — nothing moves for the casts the leg reads)',
  gLong.labelLane >= est(LONG, 4) + 8 && -gLong.leftReach <= longExtent - 4 && gShort.labelLane === 118 && gLong.leftReach === Math.max(gLong.leftReach, gLong.labelLane + 12),
  J({ lane: gLong.labelLane, leftReach: gLong.leftReach, extent: longExtent, shortLane: gShort.labelLane }));
{
  const html = renderToString(React.createElement(CastInsideDiagram, { inside: insideOf(longCast), id: 'long' }));
  const vb = /viewBox="(-?[\d.]+) 0 ([\d.]+) [\d.]+"/.exec(html);
  const lane = /data-inside-label-lane="(\d+)"/.exec(html);
  check('§d ★ THE DRAWING RENDERED (a server render — the estimate alone): the svg\'s viewBox starts at −leftReach, wide enough for the whole label; the lane written on the svg (`data-inside-label-lane`) for the eye to read; the label\'s tspan whole — no ellipsis anywhere in the drawing\'s text',
    vb !== null && Number(vb[1]) === -gLong.leftReach && Number(vb[1]) <= longExtent - 4 && lane !== null && Number(lane[1]) === Math.round(gLong.labelLane) && html.includes(`>${LONG}<`) && !/…|\.\.\./.test(html.replace(/<!--[\s\S]*?-->/g, '')),
    J({ viewBox: vb && vb[0], lane: lane && lane[1] }));
}
{
  // the measured floor: a caller's floor from a measurement wins over the estimate and the floor, and grows the reach with it
  const gFloor = insideGeometry(insideOf(longCast), { px: 0, top: 14, labelLane: gLong.labelLane + 30 });
  check('§d ★ THE MEASUREMENT PASS HAS ITS SEAM: a measured floor handed to the geometry (`options.labelLane`) widens the lane and the reach by exactly that much; the component reads every label\'s rendered box after a paint (getBBox) and hands the overflow back as that floor — grows only, settles in one pass, absent under a server render',
    gFloor.labelLane === gLong.labelLane + 30 && gFloor.leftReach === gLong.leftReach + 30 &&
      (() => { const src = readLf('src/components/CastInsideDiagram.tsx'); return src.includes("svg.querySelectorAll('tspan[data-inside-label]')") && src.includes('text.getBBox()') && src.includes('if (need > 0.5) setLaneFloor(g.labelLane + need);') && src.includes('x={g.px - 10 - g.labelLane}') && !src.includes('x={g.px - 10 - LABEL_LANE}'); })(),
    J({ floorLane: gFloor.labelLane, floorReach: gFloor.leftReach }));
}

// ═══ §e C-13e — ROLE-PAIR LABELS WERE DRAWN ACROSS THE MIDDLE OF THE MIDPOINT DRAWING, OVER THE COLUMNS' TEXT ═══
console.log('----- §e every role pair listed whole outside the drawing with its withdraw; the drawing keeps the line, marked by index; nothing over a column\'s text -----');
const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const longCastOf = (ids, labels) => readCastFile(JSON.stringify({ roles: ids.map((id, i) => ({ id, label: labels[i] })), signature: [{ type: 'bears-on', arity: 2 }], relations: [{ type: 'bears-on', terms: [ids[0], ids[1]], polarity: 'holds' }, { type: 'bears-on', terms: [ids[2], ids[3]], polarity: 'holds' }] })).cast;
const castA = longCastOf(['a1', 'a2', 'a3', 'a4'], ['the involuntary doing', 'the deed', 'the voluntary doing', 'the omission']);
const castB = longCastOf(['b1', 'b2', 'b3', 'b4'], ['the general positive fact', 'the particular positive fact', 'the general negative fact', 'the particular negative fact']);
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
let seededE = createSeedShape('tetrahedron');
seededE = withCast(seededE, byLabel(seededE, 'A').id, castA);
seededE = withCast(seededE, byLabel(seededE, 'B').id, castB);
reset(seededE);
S().selectCell(cur().cells[0].id); S().applyAmboDissectionToCurrent();
const eA = byLabel(cur(), 'A').id; const eB = byLabel(cur(), 'B').id; const eAB = byLabel(cur(), 'AB').id;
{
  const e = edgeBetween(cur().edges, eA, eB);
  for (const [x, y] of [['a1', 'b1'], ['a2', 'b2'], ['a3', 'b3'], ['a4', 'b4']]) { if (e.vertexIds[0] === eA) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); }
}
const surfaceE = (siteId) => { const packet = buildGeneralSitePacketPresenterReport(cur()).packets.find((p) => p.trace.siteId === siteId); const site = midpointSiteOf(cur(), siteId, packet.trace); const parents = [spaceOf(cur(), site.a), spaceOf(cur(), site.b)]; return renderToString(React.createElement(MidpointSurface, { shape: cur(), site, parents, resolved: spaceOf(cur(), siteId), refusal: null, remade: null })).replace(/<!-- -->/g, ''); };
const { spaceOf } = req('src/lib/spaceOf.ts');
const htmlE = surfaceE(eAB);
const drawingE = (htmlE.split('data-midpoint-drawing="true"')[1] || '').split('</svg>')[0];
const svgTexts = [...drawingE.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map((m) => m[1].replace(/<[^>]+>/g, ''));
const FOLD_E = 150;
const longest = 'the involuntary doing ↦ the general positive fact · yours · withdraw';
check('§e ★★ THE POSITIVE CONTROL, BY THE RULE AS IT STOOD (✔ read: each pair\'s words with the withdraw were a <text> centred at the fold\'s mid-height, `textAnchor="middle"`, 11 px): the seat\'s longest pair `' + longest + '` is ' + longest.length + ' glyphs ≈ ' + Math.round(longest.length * 6.2) + ' px at that size, against a fold gap of ' + FOLD_E + ' px — it ran ' + Math.round((longest.length * 6.2 - FOLD_E) / 2) + ' px over EACH column\'s text; four such pairs stacked at the middle',
  longest.length * 6.2 > FOLD_E + 200, J({ glyphs: longest.length, px: longest.length * 6.2, fold: FOLD_E }));
check('§e ★★ NOTHING IS DRAWN OVER A COLUMN\'S TEXT: in the drawing every text is a column\'s own or a pair\'s INDEX at the fold — no <text> holds `↦`, `yours` or `withdraw`; the four lines stand (`data-midpoint-line`), each with one index mark at the fold (`data-midpoint-line-index` 1…4, a single numeral at the dense size, 11 px — the drawing\'s text is 12 and 11 px only, the designer\'s item 7)',
  (drawingE.match(/data-midpoint-line="/g) || []).length === 4 && !svgTexts.some((t) => /↦|yours|withdraw/.test(t)) && [1, 2, 3, 4].every((k) => new RegExp(`data-midpoint-line-index="${k}"[^>]*>${k}<`).test(drawingE)) && (drawingE.match(/font-size="9"|font-size="10"/g) || []).length === 0 && [1, 2, 3, 4].every((k) => new RegExp(`data-midpoint-line-index="${k}"[^>]*font-size="11"`).test(drawingE)),
  J({ lines: (drawingE.match(/data-midpoint-line="/g) || []).length, texts: svgTexts.filter((t) => /↦|yours|withdraw/.test(t)) }));
{
  const listing = (htmlE.split('data-midpoint-role-pairs="true"')[1] || '').split('data-midpoint-trace=')[0];
  const entries = [...listing.matchAll(/data-midpoint-line-listing="([^"]*)" data-midpoint-line-listing-index="(\d+)"/g)].map((m) => [m[1], m[2]]);
  const texts = [...listing.matchAll(/<span data-midpoint-line-listing=[^>]*>([\s\S]*?)<\/span>\s*<\/span>|data-midpoint-line-listing=[^>]*>([\s\S]*?)<\/span>/g)];
  const plain = listing.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  check('§e ★★ EVERY PAIR READ WHOLE IN A PLACE OF ITS OWN, WITH ITS WITHDRAW: the listing (`data-midpoint-role-pairs`) holds the four pairs in the record\'s order, indexed 1…4 like their lines, each `<long A-name> ↦ <long B-name> · yours · withdraw` whole (the seat\'s own words), the withdraw a BUTTON carrying the same `data-midpoint-withdraw="role|x|y"` the witnesses and the eye already press; `· yours · ` counted once per pair; the listing stands AFTER the drawing in the page (below it) and before the role refusal box',
    entries.length === 4 && entries.map(([, i]) => i).join('') === '1234' && entries.map(([p]) => p).join(' ') === 'a1↦b1 a2↦b2 a3↦b3 a4↦b4' &&
      plain.includes('the involuntary doing ↦ the general positive fact · yours · withdraw') && plain.includes('the omission ↦ the particular negative fact · yours · withdraw') &&
      (listing.match(/<button type="button" data-midpoint-withdraw="role\|a\d\|b\d"/g) || []).length === 4 && (htmlE.match(/· yours · /g) || []).length === 4 &&
      htmlE.indexOf('data-midpoint-role-pairs="true"') > htmlE.indexOf('</svg>') && readLf('src/components/MidpointSurface.tsx').includes("      {refusal && refusal.act.kind === 'role' ? refusalBox : null}\n") && readLf('src/components/MidpointSurface.tsx').indexOf('data-midpoint-role-pairs="true"') < readLf('src/components/MidpointSurface.tsx').indexOf("      {refusal && refusal.act.kind === 'role' ? refusalBox : null}\n"),
    J({ entries, plain: plain.slice(0, 400) }));
}
check('§e ★ THE REFUSED PAIR FOLLOWS THE SAME MOVE: its dashed line stays in the drawing with no words on it (`data-midpoint-refused-line` holds a <line> and no <text>); its words `… · not taken — see below the drawing` read in the listing (`data-midpoint-refused-listing`), in rose, beside the pairs — the source, since a refusal needs the store\'s own act to render',
  (() => { const src = readLf('src/components/MidpointSurface.tsx'); const g = src.split('data-midpoint-refused-line={')[1].split('</g>')[0]; return !g.includes('<text') && g.includes('<line') && src.includes('data-midpoint-refused-listing={`${refusal.act.pair[0]}↦${refusal.act.pair[1]}`}') && src.includes('· not taken — see below the drawing`}</span>') && !src.includes('fill-rose-300" style={{ paintOrder'); })());
check('§e ★ §149 BY CONSTRUCTION: the listing is placed below the drawing, so a pair appearing or leaving moves neither the drawing nor the column points; and with no pair and no refusal the listing is absent (the sentence line already says `0 role pairs`)',
  (() => { const src = readLf('src/components/MidpointSurface.tsx'); const i = src.indexOf('</svg>\n      </div>\n'); const j = src.indexOf('data-midpoint-role-pairs="true"'); const k = src.indexOf('data-midpoint-own="glued"'); return i > 0 && j > i && k > j && src.includes("{state === 'glued' && (lines.some((l) => l.iA >= 0 && l.iB >= 0) || (refusal && refusal.act.kind === 'role')) ? ("); })());

console.log('');
if (failures === 0) console.log('DIAGNOSE-THE-ROAD: ALL PASS — the three found on the road stay cured: a quality that is not text carried, marked and counted; a midpoint\'s slot keeping its composed string, following its corners, christened by the person\'s own mark; a lifted face titled by its corners, never its id; every role\'s name read whole in the drawing; every role pair listed whole outside it');
else console.log(`DIAGNOSE-THE-ROAD: ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
