#!/usr/bin/env node
// THE WALK UNDER THE NORM — a MEASUREMENT, not a build (the mothership's letter of 2026-10-17 13:45; ADR 0031 §9.50 (3) scoped by §9.54; Arman's Δ184).
// A built case with a FAMILY: the seeded tetrahedron (A flow · B t-cell · C phi · D triangle), A–C under (J₃, τ₃) plus ONE relating in a mode, `F5 carries Φ1`
// (the instance-space witness §f's case), dissected once so AC is born. Then F5's fibre on the corner edge A–AC holds an IS-instance AND a mode instance.
// Reads the repo's modules in place; writes nothing; the store is in memory only.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const REPO = 'C:/Dev/202cl/PlatonicEngine202';
const ts = require(path.join(REPO, 'node_modules', 'typescript'));
const OPTS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...OPTS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};
const req = (p) => require(path.join(REPO, p));
const J = (x) => JSON.stringify(x);
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const T = req('src/lib/transport.ts');
const RL = req('src/lib/relatings.ts');
const IS_ = req('src/lib/instanceSpace.ts');
const BF = req('src/lib/bornFace.ts');
const { nameIn } = req('src/lib/spaceOf.ts');

const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const cast = (n) => readCastFile(fs.readFileSync(path.join(REPO, 'scripts/fixtures/casts', n), 'utf8')).cast;
const byLabel = (sh, l) => Object.values(sh.vertices).find((v) => v.data.label === l).id;
const withCast = (sh, id, c) => ({ ...sh, vertices: { ...sh.vertices, [id]: { ...sh.vertices[id], data: { ...sh.vertices[id].data, cast: c } } } });
let seeded = createSeedShape('tetrahedron');
for (const [l, c] of [['A', cast('flow.cast.json')], ['B', cast('t-cell.cast.json')], ['C', cast('phi.cast.json')], ['D', cast('triangle.cast.json')]]) seeded = withCast(seeded, byLabel(seeded, l), c);
useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [] });
const A = byLabel(cur(), 'A'); const C = byLabel(cur(), 'C');
const eAC0 = edgeBetween(cur().edges, A, C);
const aFirst = eAC0.vertexIds[0] === A;
const o = (x, y) => (aFirst ? [x, y] : [y, x]);
for (const [x, y] of [['F5', 'Φ7'], ['F7', 'Φ1'], ['F8', 'Φ2']]) S().giveRolePair(eAC0.id, ...o(x, y));
for (const [s, t] of [['sustains', 'descends-from'], ['presupposes', 'specifies'], ['exceeds-in-size', 'lodges-in']]) S().giveWordPair(eAC0.id, ...o(s, t));
const r = S().giveRelating(eAC0.id, 'carries', ...o('F5', 'Φ1'), '+');
console.log('THE CASE: A–C under (J3, τ3) + `F5 carries Φ1` →', r === null ? 'taken' : `refused: ${r.why}`);
S().applyAmboDissectionToCurrent();
const sh = cur();
const AC = Object.values(sh.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(A) && v.createdBy.sourceVertexIds.includes(C)).id;
const eAC = edgeBetween(sh.edges, A, C);
const L = (v) => sh.vertices[v].data.label;
const name = (v, id) => IS_.termWordsOf(sh, v, id);

// ── 1 · THE STEP ON THE SEED EDGE A–C (D12 amended): today IS only; moved, every relating with its word ──
console.log('\n═══ 1 · the seed edge A–C ═══');
const held = [...RL.instancesOn(eAC), ...RL.barsOn(eAC)];
console.log('relatings held on A–C:', held.map((x) => `${x[0]} ${x[1]} ${x[2]} ${x[3]}${RL.dirOf(x) === RL.AGAINST ? ' ←' : ''}`).join(' · '));
const todayAC = T.transportStepOf(sh, A, C);
console.log('today, transportStepOf(A→C):', J([...todayAC.entries()]));
// the MOVED step as a relation: from a role of the first corner, every relating it stands in, with the word and the way it was said
const movedStep = (from, to) => {
  const e = edgeBetween(sh.edges, from, to); const rev = e.vertexIds[0] !== from;
  const out = new Map();
  for (const x of RL.instancesOn(e)) { const [p, q] = rev ? [x[2], x[1]] : [x[1], x[2]]; const ways = out.get(p) ?? []; ways.push({ to: q, word: x[0], said: RL.dirOf(x) === RL.ALONG ? (rev ? 'against' : 'along') : (rev ? 'along' : 'against') }); out.set(p, ways); }
  return out;
};
const mAC = movedStep(A, C);
console.log('moved, A→C as a relation:', J([...mAC.entries()].map(([p, w]) => [p, w.map((x) => `${x.to} by ${x.word}${x.said === 'against' ? ' (read back)' : ''}`)])));
console.log('FAMILIES on A→C (a role with more than one way):', J([...mAC.entries()].filter(([, w]) => w.length > 1).map(([p, w]) => [p, w.length])));
console.log('moved, C→A (the ways read back):', J([...movedStep(C, A).entries()].map(([p, w]) => [p, w.map((x) => `${x.to} by ${x.word}${x.said === 'against' ? ' (read back)' : ''}`)])));

// ── 2 · THE CORNER EDGE A–AC (D14; B6): the fibre over a parent role, IS and modes — THE FAMILY ──
console.log('\n═══ 2 · the corner edge A–AC ═══');
const fib = T.fibresOf(sh, A, AC);
console.log('fibresOf(A, AC):', J([...fib.entries()].filter(([, f]) => f.is.length + f.others.length > 0)));
const census = T.fibreCensus(sh, A, AC);
const both = [...fib.entries()].filter(([, f]) => f.is.length >= 1 && f.others.length >= 1).map(([p]) => p);
console.log('fibreCensus(A, AC):', J(census), '· roles held by an IS-instance AND a mode instance (the census has no column for them):', J(both));
console.log('today, transportStepOf(A→AC):', J([...T.transportStepOf(sh, A, AC).entries()]));
console.log('today, transportStepOf(AC→A) (child to parent — D-1: IS-instances only):', J([...T.transportStepOf(sh, AC, A).entries()]));
const inst = IS_.instancesFrom(sh, A, C);
const movedCorner = new Map(); for (const i of inst) { const ways = movedCorner.get(i.p) ?? []; ways.push({ to: i.key, word: i.mode }); movedCorner.set(i.p, ways); }
console.log('moved, A→AC as a relation (every instance holding the role, with its word):', J([...movedCorner.entries()].map(([p, w]) => [p, w.map((x) => `${name(AC, x.to)} by ${x.word}`)])));
console.log('moved, AC→A (an instance to its A-coordinate, the mode instance too — a map still):', J(inst.map((i) => [name(AC, i.key), i.p, i.mode])));

// ── the guard (D-1): a walk under the moved steps around A → C → AC → A ──
console.log('\n═══ the guard · walks around A → C → AC → A under the moved steps ═══');
const corners = [A, C, AC];
const rel = [mAC, (() => { const m = new Map(); for (const i of inst) { const ways = m.get(i.q) ?? []; ways.push({ to: i.key, word: i.mode }); m.set(i.q, ways); } return m; })(), new Map(inst.map((i) => [i.key, [{ to: i.p, word: 'coordinate' }]]))];
const at = (c, x) => `${L(corners[c])}:${x}`;
const routesFrom = (role, rounds = 1) => {
  const out = [];
  const go = (c, x, words, depth) => {
    if (depth === 3 * rounds) { out.push({ ends: at(c, x), words }); return; }
    for (const w of rel[c].get(x) ?? []) go((c + 1) % 3, w.to, [...words, w.word], depth + 1);
    if (!(rel[c].get(x) ?? []).length) out.push({ ends: at(c, x), words, broke: true });
  };
  go(0, role, [], 0);
  return out;
};
for (const role of ['F5', 'F7', 'F8']) console.log(`routes of one round from A:${role}:`, J(routesFrom(role).map((x) => `${x.ends} by ${x.words.join(' ; ')}${x.broke ? ' — BROKE' : ''}`)));
// an unguarded walk: a line reader that follows the relation without a visited set never ends on a cycle; the door's `met` guard stops it at the first revisit, named
const unguarded = (role, cap = 60) => { let c = 0; let x = role; let n = 0; while ((rel[c].get(x) ?? []).length && n < cap) { x = rel[c].get(x)[0].to; c = (c + 1) % 3; n += 1; } return n; };
const guarded = (role) => { let c = 0; let x = role; const met = new Set([at(0, role)]); let n = 0; for (;;) { const ws = rel[c].get(x) ?? []; if (!ws.length) return { stopped: 'no step', at: at(c, x), steps: n }; x = ws[0].to; c = (c + 1) % 3; n += 1; if (c === 0 && x === role) return { stopped: 'closed at its start', steps: n }; if (met.has(at(c, x))) return { stopped: `runs into itself at ${at(c, x)}`, steps: n }; met.add(at(c, x)); } };
console.log('an UNGUARDED walk from A:F5 (cap 60 steps) takes', unguarded('F5'), 'steps — it does not end by itself; the door\'s guard (met):', J(guarded('F5')));
// branching: where the relation has more than one way out, a line reader that holds one role per corner cannot hold the walk
console.log('BRANCHING (out-degree > 1) under the moved steps:', J(corners.flatMap((v, c) => [...rel[c].entries()].filter(([, w]) => w.length > 1).map(([x, w]) => `${at(c, x)} → ${w.length} ways`))));

// ── 3 · THE CARGO (C-11b, D20): today its J is `transportStepOf` (one role per corner, `state.at`); its return around a loop composes words ──
console.log('\n═══ 3 · the cargo ═══');
const cargoSrc = fs.readFileSync(path.join(REPO, 'src/manuscript/cargoModel.ts'), 'utf8');
console.log('cargo J reads transportStepOf (single-valued RoleMap):', /J: \(from, to\) => \(record\.vertices\[from\] && record\.vertices\[to\] \? transportStepOf\(record, from, to\) : null\)/.test(cargoSrc), '· `at` holds ONE role:', /at: \{ corner: VertexId; role: string \}|at\?: \{ corner|at: \{ corner/.test(cargoSrc));
console.log('the words a cargo would compose around A→C→AC→A from F5:', J(routesFrom('F5').map((x) => x.words.join(' ; '))));
const rulesBefore = S().rules.length;
const ruleR = S().nameRule('carries', 'carries', 'carries');
console.log('his rule (carries, carries) ↦ carries given:', ruleR === null ? 'taken' : ruleR, '· rules', rulesBefore, '→', S().rules.length, '(the composite is his; with no rule the route is unruled — D6)');

// ── 4 · THE LIFT'S HOP (D11): the lifted corner's column — the child's instances in every mode ──
console.log('\n═══ 4 · the lift ═══');
const lifted = IS_.liftedColumnOf(sh, AC);
console.log('liftedColumnOf(AC) roles:', J(lifted.roles.map((x) => [x.id, x.label])), '· its relations (READ, D4):', lifted.relations.length, '· words:', lifted.signature.length);
console.log('the family stands in the lifted column already, as two roles:', J(lifted.roles.filter((x) => inst.find((i) => i.key === x.id && i.p === 'F5')).map((x) => x.label)));

// ── 5 · THE BORN FACE (§9.24; M1 reads the step): today's Fix · Mov · Und at A over A → C → AC; what a walk carrying words would read ──
console.log('\n═══ 5 · the born face A · C · AC ═══');
const face = BF.bornFaceOf(sh, [A, C, AC], T.bornReadersOf(sh));
if (face.state === 'read') {
  const rA = face.readings.find((x) => x.corner === A);
  console.log('today at A: fix', J([...rA.full.fix]), '· mov', J([...rA.full.mov].map(([x, y]) => `${x}→${y}`)), '· und', J(rA.und.map((u) => `${u.role} broke at ${L(u.brokeAt.from)}→${L(u.brokeAt.to)}`)), '· news', J(rA.news.map((n) => `${n.role}→${n.to}`)));
} else console.log('today the face reads:', face.state, J(face.unpaired || face.refusals || face.missing));
const movedReading = (role) => { const rs = routesFrom(role); const back = rs.filter((x) => !x.broke); return { role, routes: rs.length, fixedBy: back.filter((x) => x.ends === at(0, role)).map((x) => x.words.join(' ; ')), movedTo: back.filter((x) => x.ends !== at(0, role)).map((x) => `${x.ends} by ${x.words.join(' ; ')}`), broke: rs.filter((x) => x.broke).length }; };
console.log('a walk carrying words would read at A:', J(['F5', 'F7', 'F8'].map(movedReading)));
console.log('\nDONE — a measurement; nothing written.');
