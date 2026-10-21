#!/usr/bin/env node

// DIAGNOSE THE WALK UNDER THE NORM — ADR 0031 §9.57 (the mothership's STAMP of 2026-10-17 16:42 and ruling of 16:51; the designer's words of 16:44; Arman's Δ190,
// after release 1; group 2). A walk is a TREE OF ROUTES, every named way a road; a route's word is the composite of the words walked — by substitution, by his
// rule, else unruled; a mixed route returning to another role of one corner derives a LIGHT, never a Mov; Fix · Mov · Und stay the IS routes' alone.
//
// THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the coder's built case of 10-17 (the seeded tetrahedron, F4's pairs and words on A–C plus `F5 carries Φ1`, one
// dissection) is made in the store as the app makes it; the readers the page prints from (`transportWaysOf`, `routesAround`, `compositeOf`, `lightsAt`, the cargo's
// `cargoReading` and `stepRod`) are RUN on it, and the RESEARCHER'S FALSIFIER (§9.57, its last bullet) clause by clause: three routes from A:F5, two from A:F7, the
// guard refusing nothing, one Fix and no light with the relating withdrawn. What a person SEES is the concept-layer eye's (§44: the hands in the room).
// Run: node scripts/diagnose-the-walk-under-the-norm.cjs

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const React = require('react');
const { renderToString } = require('react-dom/server');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const T = req('src/lib/transport.ts');
const W = req('src/lib/walkRoutes.ts');
const BF = req('src/lib/bornFace.ts');
const RL = req('src/lib/relatings.ts');
const IS_ = req('src/lib/instanceSpace.ts');
const C = req('src/manuscript/cargoModel.ts');
const MS = req('src/components/MidpointSurface.tsx');
const { nameIn, spaceOf } = req('src/lib/spaceOf.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8');

console.log('THE WALK UNDER THE NORM — a tree of routes, every named way a road; the composite word; a mixed route a light, never a Mov (§9.57)\n');

// ═══ THE CASE (the coder's measurement of 10-17): A flow · B t-cell · C phi · D triangle; A–C under (J₃, τ₃) + `F5 carries Φ1`; one dissection ═══
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const cast = (n) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', n), 'utf8')).cast;
const byLabel = (sh, l) => Object.values(sh.vertices).find((v) => v.data.label === l).id;
const withCast = (sh, id, c) => ({ ...sh, vertices: { ...sh.vertices, [id]: { ...sh.vertices[id], data: { ...sh.vertices[id].data, cast: c } } } });
let seeded = createSeedShape('tetrahedron');
for (const [l, c] of [['A', cast('flow.cast.json')], ['B', cast('t-cell.cast.json')], ['C', cast('phi.cast.json')], ['D', cast('triangle.cast.json')]]) seeded = withCast(seeded, byLabel(seeded, l), c);
useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], rules: [], converses: [], opaque: [] });
const A = byLabel(cur(), 'A'); const C0 = byLabel(cur(), 'C');
const eAC0 = edgeBetween(cur().edges, A, C0);
const aFirst = eAC0.vertexIds[0] === A;
const o = (x, y) => (aFirst ? [x, y] : [y, x]);
for (const [x, y] of [['F5', 'Φ7'], ['F7', 'Φ1'], ['F8', 'Φ2']]) S().giveRolePair(eAC0.id, ...o(x, y));
for (const [s, t] of [['sustains', 'descends-from'], ['presupposes', 'specifies'], ['exceeds-in-size', 'lodges-in']]) S().giveWordPair(eAC0.id, ...o(s, t));
// F5 is the SUBJECT whatever the edge's stored order (the probe of 10-17 passed the roles in the edge's order with the default direction, which read `Φ1 carries F5` where C stood first — the ADR's falsifier reads it as F5 carries Φ1)
const relDir = aFirst ? RL.ALONG : RL.AGAINST;
const taken = S().giveRelating(eAC0.id, 'carries', ...o('F5', 'Φ1'), '+', relDir);
S().applyAmboDissectionToCurrent();
const sh = () => cur();
const AC = Object.values(sh().vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(A) && v.createdBy.sourceVertexIds.includes(C0)).id;
const L = (v) => sh().vertices[v].data.label;
const name = (v, id) => IS_.termWordsOf(sh(), v, id);
const ways = (f, t) => T.transportWaysOf(sh(), f, t);
const corners = [A, C0, AC];
const roadWords = (m) => Object.fromEntries([...(m || new Map()).entries()].map(([p, rs]) => [p, rs.map((r) => `${r.to} by ${r.word}${r.against ? ' (against)' : ''}`)]));
check('THE CASE stands: `F5 carries Φ1` taken beside F4\'s three pairs on A–C; AC born', taken === null && !!AC && !!edgeBetween(sh().edges, A, C0), { taken, AC: AC && L(AC) });

// ═══ §1 P1 — THE STEP AS A RELATION ═══
const wAC = ways(A, C0); const wCA = ways(C0, A); const wAAC = ways(A, AC); const wACA = ways(AC, A);
const inst = IS_.instancesFrom(sh(), A, C0);
const keyOf = (p, mode) => inst.find((i) => i.p === p && i.mode === mode).key;
check('§1 ★★ ON THE SEED EDGE A–C every named way is a road (§9.57 (2), (5)(b)): F5 → Φ7 by IS and Φ1 by `carries` — THE FAMILY, at the seed edge; F7 → Φ1 by IS; F8 → Φ2 by IS; read back from C: Φ1 → F7 by IS and F5 by `carries` (against its direction, as he said it from F5)',
  J(wAC.get('F5')) === J([{ to: 'Φ7', word: RL.IS, against: false }, { to: 'Φ1', word: 'carries', against: false }]) && J(wAC.get('F7')) === J([{ to: 'Φ1', word: RL.IS, against: false }]) && J(wAC.get('F8')) === J([{ to: 'Φ2', word: RL.IS, against: false }]) &&
    J(wCA.get('Φ1')) === J([{ to: 'F7', word: RL.IS, against: false }, { to: 'F5', word: 'carries', against: true }]) && wAC.size === 3,
  { AC: roadWords(wAC), CA: roadWords(wCA) });
check('§1 ★★ ON THE CORNER EDGE A–AC from the parent every instance holding the role is a road, with its mode: F5 → (Φ7 ≡ F5) by IS and (F5 carries Φ1) by `carries`; from the child the coordinate map as it stands, the mode instance too (`coordinate`, no word) — and `transportStepOf` stays IS-only for §9.54\'s readers (F5 ↦ the IS-instance alone)',
  (wAAC.get('F5') || []).length === 2 && wAAC.get('F5').some((r) => r.word === RL.IS && r.to === keyOf('F5', RL.IS)) && wAAC.get('F5').some((r) => r.word === 'carries' && r.to === keyOf('F5', 'carries') && r.against === false) &&
    [...wACA.values()].every((rs) => rs.length === 1 && rs[0].word === T.COORDINATE) && wACA.get(keyOf('F5', 'carries'))[0].to === 'F5' && T.transportStepOf(sh(), A, AC).get('F5') === keyOf('F5', RL.IS) && T.transportStepOf(sh(), A, C0).get('F5') === 'Φ7' && T.transportStepOf(sh(), A, C0).size === 3,
  { AAC: roadWords(wAAC), ACA: roadWords(wACA), step: [...T.transportStepOf(sh(), A, AC).entries()] });
const census = T.fibreCensus(sh(), A, AC);
check('§1 ★ THE CENSUS has its column (§9.57 (5)(b)): on A–AC one role is held by an IS-instance AND a mode instance (F5), two by one IS-instance alone (F7, F8); none mode-only; the other eleven held by none',
  census.isAndMode === 1 && census.one === 3 && census.modeOnly === 0 && census.none === 11 && census.severalIS.length === 0, census);

// ═══ §2 THE FALSIFIER — the routes of one round from A:F5 and from A:F7 ═══
const rs5 = W.routesAround(corners, 'F5', ways); const rs7 = W.routesAround(corners, 'F7', ways);
const words = (r) => W.wordsWalked(r).join(' ; ');
const line = (r) => `${words(r)} → ${r.end === null ? `BROKE at ${L(r.brokeAt.from)}→${L(r.brokeAt.to)}` : r.end}`;
check('§2 ★★ FROM A:F5 EXACTLY THREE ROUTES (§9.57\'s falsifier): `≡ ; ≡ → F5` (Fix), `carries ; carries → F5` (a light of F5 with itself), `carries ; ≡ → F7` (the light `F5 carries F7`); none breaks — the coordinate leg has no word and is unprinted',
  rs5.length === 3 && rs5.every((r) => r.end !== null && r.legs.length === 3) && J(rs5.map(line).sort()) === J(['carries ; carries → F5', 'carries ; ≡ → F7', '≡ ; ≡ → F5']), rs5.map(line));
check('§2 ★★ FROM A:F7 TWO ROUTES: `≡ ; ≡ → F7` (Fix) and `≡ ; carries → F5` (the same light read back)',
  rs7.length === 2 && J(rs7.map(line).sort()) === J(['≡ ; carries → F5', '≡ ; ≡ → F7']), rs7.map(line));
const comp = (r) => W.compositeOf(r, S().rules);
const byWords = (ws) => rs5.find((r) => words(r) === ws);
check('§2 ★★ THE COMPOSITE (§9.57 (2)): `≡ ; ≡` is the identification structure\'s (no word); `carries ; ≡` composes to `carries` by substitution; `carries ; carries` is UNRULED while he has no rule',
  J(comp(byWords('≡ ; ≡'))) === J({ kind: 'is' }) && J(comp(byWords('carries ; ≡'))) === J({ kind: 'word', word: 'carries', by: 'substitution' }) && J(comp(byWords('carries ; carries'))) === J({ kind: 'unruled' }),
  rs5.map((r) => [words(r), comp(r)]));
const ruleRefusal = S().nameRule('carries', 'carries', 'carries', 'join'); // §9.65 (3): the self-route out by `carries` and back on the same relating read AGAINST is a JOIN at Φ1 — a join rule, never the pair's chain rule
check('§2 ★★ HIS JOIN RULE `(carries, carries) ↦ carries` given (§9.65 (3): the route out and back on one relating is a join at Φ1 — his chain rule on the pair no longer composes it, measured): the self-route composes to `carries` BY RULE; the mixed route is unchanged (substitution); `≡ ; ≡` unchanged',
  ruleRefusal === null && J(comp(byWords('carries ; carries'))) === J({ kind: 'word', word: 'carries', by: 'rule' }) && J(comp(byWords('carries ; ≡'))) === J({ kind: 'word', word: 'carries', by: 'substitution' }),
  { ruleRefusal, rules: S().rules });

// ═══ §3 THE LIGHTS AT A (§9.57 (1), (3); the mothership's 16:51: a way found from both ends is ONE light) ═══
const rolesA = spaceOf(sh(), A).space.roles.map((r) => r.id);
const lights = W.lightsAt(corners, rolesA, ways, S().rules);
const lightLine = (lt) => (lt.unruled ? `${lt.route.start} to ${lt.route.end}, by ${W.wordsWalked(lt.route).join(' then ')} · unruled` : `${lt.subject} ${lt.word} ${lt.object}, by ${W.wordsWalked(lt.route).join(' then ')}${W.compositeOf(lt.route, S().rules).by === 'rule' ? ' (by rule)' : ''}`);
check('§3 ★★ TWO LIGHTS AT A, the mixed way ONCE: `F5 carries F7, by carries then ≡` — found from F5 and read back from F7 (`≡ then carries`), listed once, by the route that reads in its sentence\'s direction (the designer\'s 16:51) — and `F5 carries F5, by carries then carries (by rule)`; no Fix among them',
  lights.length === 2 && J(lights.map(lightLine).sort()) === J(['F5 carries F5, by carries then carries (by rule)', 'F5 carries F7, by carries then ≡']) && lights.every((lt) => lt.route.start === lt.subject),
  lights.map(lightLine));

// ═══ §4 THE GUARD reads the IS routes alone (§9.57 (3)) ═══
const face = BF.bornFaceOf(sh(), corners, T.bornReadersOf(sh()));
check('§4 ★★ THE MERGE GUARD REFUSES NOTHING on the walk A → C → AC → A: the IS routes fix F5, F7 and F8 at A (Fix · Mov · Und the identification structure\'s), the named routes never enter the stone',
  face.state === 'read' && (() => { const rA = face.readings.find((x) => x.corner === A); return J([...rA.full.fix].sort()) === J(['F5', 'F7', 'F8']) && rA.full.mov.length === 0; })(),
  face.state === 'read' ? { fix: face.readings.find((x) => x.corner === A).full.fix, mov: face.readings.find((x) => x.corner === A).full.mov } : face);

// ═══ §5 P2 — THE CARGO: the roads as his hands; the return by the composite word ═══
const roomSpec = () => ({
  corners: corners.map(L), entry: 'A', label: (v) => v,
  roles: Object.fromEntries(corners.map((v) => [L(v), (T.transportSpaceOf(sh(), v)?.space.roles ?? []).map((r) => ({ id: r.id, name: name(v, r.id) }))])),
  J: (f, t) => T.transportStepOf(sh(), byLabel(sh(), f), byLabel(sh(), t)),
  ways: (f, t) => T.transportWaysOf(sh(), byLabel(sh(), f), byLabel(sh(), t)),
  rules: S().rules,
  rods: [{ a: 'A', b: 'C' }, { a: 'C', b: 'AC' }, { a: 'AC', b: 'A' }], faces: [], doors: [],
  instanceOf: () => null, // the fixture room names an instance by its sentence alone; the built room parenthesizes it (the designer's gate) — the eye reads that
});
const room = C.cargoRoomFrom(roomSpec());
const read = (st) => C.cargoReading(room, st);
let st = C.pickCargo(room, 'A', 'F5');
const r0 = read(st);
check('§5 ★★ THE HANDS (§9.57 (4); the designer\'s 16:44 §1): F5 picked at A, the rods line offers each road of A–C as its own choice before he presses — `A–C as Φ7 (≡) · A–C as Φ1 (carries)` — and, F5 being held two ways on A–AC as well (the family lives at the corner edge from the parent\'s side, §9.57 (5)(b)), that rod\'s two roads likewise, `A–AC as (Φ7 ≡ F5) · A–AC as (F5 carries Φ1)` — at a corner edge the instance names its word, so the trailing word goes (the designer\'s 15:17 copy rider; the mothership\'s 15:26 (4)); nothing is chosen for him',
  r0.state === 'carrying' && r0.words === 'carrying F5 — at the corner A' && J(r0.rods.map((r) => r.words)) === J(['A–C as Φ7 (≡)', 'A–C as Φ1 (carries)', `A–AC as ${name(AC, keyOf('F5', RL.IS))}`, `A–AC as ${name(AC, keyOf('F5', 'carries'))}`]) && J(r0.rods.map((r) => r.via)) === J(['Φ7', 'Φ1', keyOf('F5', RL.IS), keyOf('F5', 'carries')]),
  r0.rods);
const rF7 = read(C.pickCargo(room, 'A', 'F7'));
check('§5 ★ A ROLE HELD ONE WAY ON A ROD reads as today: F7 picked, the rods `A–C · A–AC` by their corners, no road named',
  J(rF7.rods.map((r) => r.words)) === J(['A–C', 'A–AC']) && rF7.rods.every((r) => r.via === undefined), rF7.rods);
const stNo = C.stepRod(room, st, 'C');
check('§5 ★ AT A BRANCHING NOTHING MOVES WITHOUT HIS CHOICE: the rod pressed with no road named leaves the cargo where it is', stNo === st);
st = C.stepRod(room, st, 'C', 'Φ1');
const r1 = read(st);
check('§5 ★★ THE NAMED ROAD TAKEN adds its word on the way (her §1): `carrying F5 — at the corner C as Φ1, by A–C (carries)`; at C the role Φ1 is held two ways on C–AC — the hands again, `C–AC as (Φ1 ≡ F7) · C–AC as (F5 carries Φ1)` — and two ways back on C–A, `C–A as F7 (≡) · C–A as F5 (carries)`',
  r1.state === 'away' && r1.words === 'carrying F5 — at the corner C as Φ1, by A–C (carries)' && r1.rods.length === 4 && J(r1.rods.filter((r) => r.to === 'A').map((r) => r.words)) === J(['C–A as F7 (≡)', 'C–A as F5 (carries)']) && J(r1.rods.filter((r) => r.to === 'AC').map((r) => r.words)) === J([`C–AC as ${name(AC, keyOf('F7', RL.IS))}`, `C–AC as ${name(AC, keyOf('F5', 'carries'))}`]),
  { words: r1.words, rods: r1.rods });
const stMixed = C.stepRod(room, C.stepRod(room, st, 'AC', keyOf('F7', RL.IS)), 'A');
const rMixed = read(stMixed);
check('§5 ★★ THE WAY HOME BY A NAMED LEG (her §2; §9.57 (1)): `carries` then `≡` brings F5 home as F7 — never `returned`: `carrying F5 — back at A by a way: F5 carries F7, by carries then ≡` (the coordinate leg unprinted)',
  rMixed.state === 'home-way' && rMixed.words === 'carrying F5 — back at A by a way: F5 carries F7, by carries then ≡', rMixed.words);
const stSelf = C.stepRod(room, C.stepRod(room, st, 'AC', keyOf('F5', 'carries')), 'A');
const rSelf = read(stSelf);
check('§5 ★★ HOME BY HIS JOIN RULE (§9.65 (3)): `carries` then `carries`, the second walked against its way — `carrying F5 — back at A by a way: F5 carries F5, by carries then carries (by rule)`',
  rSelf.state === 'home-way' && rSelf.words === 'carrying F5 — back at A by a way: F5 carries F5, by carries then carries (by rule)', rSelf.words);
useGeometryStore.setState({ rules: [] });
const roomNoRule = C.cargoRoomFrom(roomSpec());
const rUnruled = C.cargoReading(roomNoRule, stSelf);
check('§5 ★★ WITH NO RULE the ends are named and the words walked follow (her §2): `carrying F5 — back at A by a way: F5 to F5, by carries then carries · unruled`; no composite sentence is made up',
  rUnruled.state === 'home-way' && rUnruled.words === 'carrying F5 — back at A by a way: F5 to F5, by carries then carries · unruled', rUnruled.words);
S().nameRule('carries', 'carries', 'carries', 'join'); // §9.65 (3): a join rule — the way back is walked against its way
const stIS = C.stepRod(room, C.stepRod(room, C.stepRod(room, C.pickCargo(room, 'A', 'F7'), 'C'), 'AC', keyOf('F7', RL.IS)), 'A');
check('§5 ★★ BY ≡ ALONE THE WORDS ARE TODAY\'S (her one rule): F7 around by its IS pair and the coordinate map — `carrying F7 — returned to itself by A–C · C–AC · AC–A`',
  read(stIS).state === 'home-fix' && read(stIS).words === 'carrying F7 — returned to itself by A–C · C–AC · AC–A', read(stIS).words);
const stBroke = C.stepRod(room, C.pickCargo(room, 'A', 'F1'), 'C');
check('§5 ★ A ROUTE THAT FINDS NO ROAD stops with today\'s words, withdrawable: F1 (unpaired on A–C) `carrying nothing — F1 broke at the rod A–C, which does not carry it`',
  read(stBroke).state === 'lost-rod' && /^carrying nothing — F1 broke at the rod A–C, which does not carry it$/.test(read(stBroke).words) && C.withdrawStep(stBroke).at !== null, read(stBroke).words);

// ═══ §5b THE SPUR (the designer's 15:17, read in the source; the mothership's 15:26 (1), ruled): a step back onto the role just left CANCELS the step in, whatever road entered ═══
{
  const pick9 = C.pickCargo(room, 'A', 'F5');
  const backIS = C.stepRod(room, C.stepRod(room, pick9, 'AC', keyOf('F5', RL.IS)), 'A');
  const backCar = C.stepRod(room, C.stepRod(room, pick9, 'AC', keyOf('F5', 'carries')), 'A');
  check('§5b ★★ OUT BY ≡ TO THE CHILD AND STRAIGHT BACK reduces to nothing — `carrying F5 — returned to itself — the route reduces to nothing` (today\'s words); at 8993d7c it read a return `by A–AC · AC–A`',
    read(backIS).state === 'home-fix' && read(backIS).words === 'carrying F5 — returned to itself — the route reduces to nothing', read(backIS).words);
  check('§5b ★★ OUT BY carries TO THE CHILD AND STRAIGHT BACK reduces to nothing too: the coordinate back into F5 undoes the step in, whatever road entered — NO light `F5 carries F5` from a walk no one said (at 8993d7c: `back at A by a way: F5 carries F5, by carries`)',
    read(backCar).state === 'home-fix' && read(backCar).words === 'carrying F5 — returned to itself — the route reduces to nothing', read(backCar).words);
  const outC = C.stepRod(room, pick9, 'C', 'Φ1');
  const sameBack = C.stepRod(room, outC, 'A', 'F5'); const otherBack = C.stepRod(room, outC, 'A', 'F7');
  check('§5b ★★ ON A SEED ROD the same relating walked back onto F5 cancels (`returned to itself — the route reduces to nothing`; at 8993d7c `F5 carries F5, by carries then carries (by rule)`), while a step back onto a DIFFERENT role does not — the mixed route stands, `F5 carries F7, by carries then ≡` (choice (c) as ruled: the test is the role landed on, not the word)',
    read(sameBack).state === 'home-fix' && read(sameBack).words === 'carrying F5 — returned to itself — the route reduces to nothing' && read(otherBack).state === 'home-way' && read(otherBack).words === 'carrying F5 — back at A by a way: F5 carries F7, by carries then ≡',
    { same: read(sameBack).words, other: read(otherBack).words });
  const back7 = C.stepRod(room, C.stepRod(room, C.pickCargo(room, 'A', 'F7'), 'AC'), 'A');
  check('§5b ★ A ROLE HELD ONE WAY, out to the child by its one road and straight back: reduces to nothing, as before the walk',
    read(back7).state === 'home-fix' && read(back7).words === 'carrying F7 — returned to itself — the route reduces to nothing', read(back7).words);
}

// ═══ §6 P3 — THE BORN FACE'S LIGHTS, rendered where a face of the shape carries one ═══
const facesWithLights = sh().faces.filter((f) => f.vertexIds.length === 3).flatMap((f) => f.vertexIds.map((base) => { const cyc = [base, ...f.vertexIds.filter((v) => v !== base)]; const rd = BF.bornFaceOf(sh(), cyc, T.bornReadersOf(sh())); if (rd.state !== 'read') return null; const rA = rd.readings.find((x) => x.corner === base); const lt = W.lightsAt(cyc, rA.space.roles.map((x) => x.id), ways, S().rules); return lt.length ? { face: f, cycle: cyc, base, lights: lt } : null; }).filter(Boolean));
const noLightFace = sh().faces.find((f) => f.vertexIds.length === 3 && f.vertexIds.includes(A) && f.vertexIds.includes(AC) && BF.bornFaceOf(sh(), f.vertexIds, T.bornReadersOf(sh())).state === 'read');
const renderFace = (f, cyc) => renderToString(React.createElement(MS.BornFaceRecord, { shape: sh(), cycle: cyc, faceName: cyc.map(L).join('·'), faceId: f.id, here: null })).replace(/<!-- -->/g, '');
const h0 = noLightFace ? renderFace(noLightFace, noLightFace.vertexIds) : '';
if (noLightFace) check('§6 ★ WITHOUT A NAMED ROUTE THE BLOCK IS ABSENT (her §3: only when a named route exists): on the corner cell\'s face through A and AC the reading stands as it is — Fix · Mov · Und lines, no `ways the walk finds` block',
  /data-midpoint-born-face-line="ground"/.test(h0) && !/data-midpoint-born-face-lights=/.test(h0), { face: noLightFace.vertexIds.map(L), blocks: (h0.match(/data-midpoint-born-face-lights/g) || []).length });
else console.log('      no face through A and AC reads on this seed (its other edges are unpaired, so the transport reads no step across them): the block\'s absence is pinned where a face reads — the eye\'s seed; here by source');
check('§6 ★ THE BLOCK\'S FORM BY SOURCE (her §3): under the core line, in the light\'s ink (`text-violet-200`), never the amber of the `+` lines; the head `ways the walk finds at <corner>, lights of the face:`; one line per light — the composite sentence or `… to …` with `· unruled`, then `by` the words joined with `then`, `(by rule)` where his rule composed',
  (() => { const s = src('src/components/MidpointSurface.tsx'); return s.includes('data-midpoint-born-face-lights={String(lights.length)} className="grid text-violet-200"') && s.includes('ways the walk finds at ${L(r.corner)}, lights of the face:') && s.includes("lightsAt(rot.map((step) => step.from), r.space.roles.map((x) => x.id), (f, t) => transportWaysOf(shape, f, t), rulesNow, factsNow)") && s.includes(", by ${by} · unruled` : `${nameAt(r.corner, lt.subject)} ${lt.word} ${nameAt(r.corner, lt.object)}, by ${by}${c.kind === 'word' && c.by === 'rule' ? ' (by rule)' : ''}`"); })(),
  'source pins');
if (facesWithLights.length) {
  const fl = facesWithLights[0];
  const h1 = renderFace(fl.face, fl.cycle);
  const block = (h1.split('data-midpoint-born-face-lights=')[1] || '');
  check(`§6 ★★ A FACE WITH A NAMED ROUTE (${fl.cycle.map(L).join('·')} at ${L(fl.base)}) prints the block with one line per light`, /data-midpoint-born-face-lights="\d+"/.test(h1) && (block.match(/data-midpoint-born-face-light=/g) || []).length === fl.lights.length, { lights: fl.lights.map(lightLine), lines: (block.match(/data-midpoint-born-face-light=/g) || []).length });
} else {
  console.log('      no face of this shape carries a named route around it (the walk A → C → AC → A is a closed walk of the mesh, not a face): the block is pinned by source and by the reader (§3); seen at the eye where a face does');
}

// ═══ §7 THE FALSIFIER'S LAST CLAUSE — the relating withdrawn ═══
// the dissection made a NEW shape: the edge A–C is found fresh and the relating withdrawn as the new edge holds it (an act on the old edge id is a silent no-op)
const eACnow = edgeBetween(sh().edges, A, C0);
const heldNow = RL.relatingsHeld(eACnow).find((r) => r[0] === 'carries');
S().withdrawRelating(eACnow.id, heldNow[0], heldNow[1], heldNow[2], RL.dirOf(heldNow));
const rs5b = W.routesAround(corners, 'F5', ways);
check('§7 ★★ WITH THE RELATING WITHDRAWN the three routes collapse to ONE Fix and the lights are gone; the census column reads 0',
  rs5b.length === 1 && rs5b[0].end === 'F5' && J(W.compositeOf(rs5b[0], S().rules)) === J({ kind: 'is' }) && W.lightsAt(corners, rolesA, ways, S().rules).length === 0 && T.fibreCensus(sh(), A, AC).isAndMode === 0 && (T.transportWaysOf(sh(), A, C0).get('F5') || []).length === 1,
  { routes: rs5b.map(line) });

// ═══ §8 BY CONSTRUCTION ═══
const tr = src('src/lib/transport.ts'); const cm = src('src/manuscript/cargoModel.ts'); const ew = src('src/manuscript/ExploreWindow.tsx'); const mv = src('src/manuscript/ManuscriptView.tsx'); const er = src('src/manuscript/exploreRead.ts');
check('§8 ★★ THE TWO STEPS: `transportStepOf` keeps `if (r[0] === IS)` and `i.mode === IS` (IS-only, §9.54\'s readers); `transportWaysOf` stands beside it; the cargo room reads both (`J` and `ways`) and carries his rules; the window hands the road he chose (`stepRod(room, cur, r.to, r.via)`); the Manuscript view hands the store\'s rules to the read; the born face reads Fix · Mov · Und through `transportStepOf` still',
  /for \(const r of groundOnly \? inheritedISOn\(record, e, options\) : instancesWithInherited\(record, e, options\)\) if \(r\[0\] === IS\)/.test(tr) && /for \(const i of held\) if \(i\.mode === IS && !map\.has\(i\.key\)\) map\.set\(i\.key, i\.p\);/.test(tr) && /export function transportWaysOf\(/.test(tr) &&
    cm.includes("ways: (from, to) => (record.vertices[from] && record.vertices[to] ? transportWaysOf(record, from, to) : null),") && ew.includes('cargoSet(stepRod(room, cur, r.to, r.via))') && ew.includes('data-explore-cargo-via={r.via}') && mv.includes('rules: useGeometryStore.getState().rules,') && er.includes('args.resolveAbsent, args.rules ?? [], args.facts)') &&
    src('src/components/MidpointSurface.tsx').includes('faceBy(cycle, casts, shape.edges, (from, to) => transportStepOf(shape, from, to))'),
  'source pins');

// ═══ §9 THE BACKWARD LEG (ADR 0031 §9.65 (3); the mothership's 15:07 ruling 5; the coder's measurement of 10-20 15:05): a leg walked AGAINST its way is a JOIN step —
// it composes by a join rule or by the converse's chain rule, never by the pair's chain rule as if the leg ran along; else UNRULED from that step on ═══
{
  // the case: `F5 carries Φ1` (A → C) and `r0 lends Φ1` (B → C), both INTO Φ1 — a JOIN at C; `F5 ≡ r0` on A–B; the round from A:F5 is `carries ; lends (against) ; ≡`
  let seed9 = createSeedShape('tetrahedron');
  for (const [l, c] of [['A', cast('flow.cast.json')], ['B', cast('t-cell.cast.json')], ['C', cast('phi.cast.json')], ['D', cast('triangle.cast.json')]]) seed9 = withCast(seed9, byLabel(seed9, l), c);
  useGeometryStore.setState({ shapes: { [seed9.id]: seed9 }, shapeOrder: [seed9.id], currentShapeId: seed9.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], rules: [], converses: [], opaque: [], loopAnswers: [], loopRules: [], relationNames: [], log: [] });
  const A9 = byLabel(cur(), 'A'); const B9 = byLabel(cur(), 'B'); const C9 = byLabel(cur(), 'C');
  const e9 = (x, y) => edgeBetween(cur().edges, x, y);
  const relate9 = (X, Y, x, w, y) => { const ed = e9(X, Y); const first = ed.vertexIds[0] === X; return S().giveRelating(ed.id, w, first ? x : y, first ? y : x, '+', first ? RL.ALONG : RL.AGAINST); };
  S().declareMode('carries'); S().declareMode('lends');
  const g1 = relate9(A9, C9, 'F5', 'carries', 'Φ1'); const g2 = relate9(B9, C9, 'r0', 'lends', 'Φ1');
  { const ed = e9(A9, B9); const first = ed.vertexIds[0] === A9; S().giveRolePair(ed.id, first ? 'F5' : 'r0', first ? 'r0' : 'F5'); }
  const chain9 = S().nameRule('carries', 'lends', 'reaches'); // his CHAIN rule on the pair — the one the fold wrongly applied to the join step (10-20)
  const ways9 = (f, t) => T.transportWaysOf(cur(), f, t);
  const corners9 = [A9, C9, B9];
  const facts9 = () => ({ converses: S().converses, opaque: S().opaque });
  const backward = () => W.routesAround(corners9, 'F5', ways9).find((r) => r.legs.some((l) => l.road.against && l.road.word !== RL.IS));
  const r0 = backward();
  const steps = r0 ? r0.legs.map((l) => `${l.road.word}${l.road.against ? ' (against)' : ''}`) : null;
  const c0 = r0 ? W.compositeOf(r0, S().rules, facts9()) : null;
  const light0 = W.lightsAt(corners9, ['F5'], ways9, S().rules, facts9()).map((lt) => (lt.unruled ? `${lt.route.start} to ${lt.route.end} · unruled` : `${lt.subject} ${lt.word} ${lt.object}`));
  check('§9 ★★ THE BACKWARD LEG IS UNRULED UNDER THE PAIR\'S CHAIN RULE: the round from A:F5 is `carries ; lends (against) ; ≡` — the second leg a JOIN step at C — and his chain rule `(carries, lends) ↦ reaches` does not compose it: the composite UNRULED, the light at A `F5 to F5 · unruled` (10-20 15:05 measured `reaches` here, the fold reading the join as a chain)',
    g1 === null && g2 === null && chain9 === null && !!r0 && J(steps) === J(['carries', 'lends (against)', RL.IS]) && c0 !== null && c0.kind === 'unruled' && light0.includes('F5 to F5 · unruled'),
    { given: [g1, g2, chain9], steps, composite: c0, lights: light0 });
  const join9 = S().nameRule('carries', 'lends', 'meets', 'join'); // a JOIN rule on the pair: the join step composes by it
  const c1 = W.compositeOf(backward(), S().rules, facts9());
  check('§9 ★★ A JOIN RULE COMPOSES IT: `(carries, lends) ↦ meets` as a join — the same route reads `meets` by rule', join9 === null && c1.kind === 'word' && c1.word === 'meets' && c1.by === 'rule', { join9, composite: c1 });
  S().withdrawRule('carries', 'lends', 'join');
  const conv9 = S().declareConverse('lends', 'lent-by'); // the leg's converse declared: walked against its way, `lends` reads as `lent-by` along — the chain rule on the converse composes it
  const chainC = S().nameRule('carries', 'lent-by', 'reaches-by-the-converse');
  const c2 = W.compositeOf(backward(), S().rules, facts9());
  check('§9 ★★ THE CONVERSE\'S CHAIN RULE COMPOSES IT: `lends ≡ lent-by` declared and `(carries, lent-by) ↦ reaches-by-the-converse` named — the same route reads `reaches-by-the-converse` by rule; the pair\'s own chain rule still does not',
    conv9 === null && chainC === null && c2.kind === 'word' && c2.word === 'reaches-by-the-converse' && c2.by === 'rule', { conv9, chainC, composite: c2 });
  S().withdrawConverse('lends'); S().withdrawRule('carries', 'lent-by', 'chain');
  // the control: the same leg stored `Φ1 lends r0` (C → B) — walked ALONG, a CHAIN step, where the pair's chain rule is right
  { const ed = e9(B9, C9); const first = ed.vertexIds[0] === B9; S().withdrawRelating(ed.id, 'lends', first ? 'r0' : 'Φ1', first ? 'Φ1' : 'r0', first ? RL.ALONG : RL.AGAINST); }
  const g3 = relate9(C9, B9, 'Φ1', 'lends', 'r0');
  const along = W.routesAround(corners9, 'F5', ways9).find((r) => r.legs.length === 3 && r.legs.every((l) => !l.road.against));
  const c3 = along ? W.compositeOf(along, S().rules, facts9()) : null;
  check('§9 ★★ THE CONTROL — the same leg walked ALONG (`Φ1 lends r0`, C → B): a CHAIN step, and the pair\'s chain rule composes it to `reaches` (by rule), as before',
    g3 === null && !!along && c3 !== null && c3.kind === 'word' && c3.word === 'reaches' && c3.by === 'rule', { g3, steps: along ? along.legs.map((l) => `${l.road.word}${l.road.against ? ' (against)' : ''}`) : null, composite: c3 });
  const wr = src('src/lib/walkRoutes.ts'); const cm9 = src('src/manuscript/cargoModel.ts');
  check('§9 ★★ BY CONSTRUCTION: the fold takes STEPS (a word and its `against`) and the lexicon\'s facts (`compositeOfSteps`); a join step keys a join rule (`ruleReads(x, { w: key, w2: w, shape: \'join\' })`) or the converse\'s chain rule (`converseOf(facts, w)`); `compositeOf` reads a route\'s legs through `stepsOf`; the cargo folds its tokens\' roads with their `against` and the room carries the facts; the lights pass the facts',
    /export function compositeOfSteps\(steps: readonly Step\[\], rules: readonly Rule\[\], facts: LexiconFacts = NO_FACTS\): Composite/.test(wr) && /ruleReads\(x, \{ w: key, w2: w, shape: 'join' \}\)/.test(wr) && /const cw = converseOf\(facts, w\);/.test(wr) && /export const compositeOf = \(r: Route, rules: readonly Rule\[\], facts: LexiconFacts = NO_FACTS\): Composite => compositeOfSteps\(stepsOf\(r\), rules, facts\);/.test(wr)
      && cm9.includes("compositeOfSteps(reduceRoute(state.route).map((t) => ({ word: roadWord(t), against: t.kind === 'rod' && !!t.road?.against })), room.rules, room.facts)") && cm9.includes('facts: spec.facts ?? NO_FACTS,'),
    'source pins');
}

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-WALK-UNDER-THE-NORM: ALL PASS — on the coder\'s case the walk is a tree of three routes from F5 and two from F7, the mixed route a light listed once, the cargo\'s roads his hands and its return the composite word, the guard untouched, one Fix with the relating withdrawn' : `DIAGNOSE-THE-WALK-UNDER-THE-NORM: ${failures} FAIL`}`);
process.exit(failures === 0 ? 0 : 1);
