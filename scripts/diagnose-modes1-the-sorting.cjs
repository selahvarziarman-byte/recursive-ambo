#!/usr/bin/env node

// DIAGNOSTIC — STAMP MODES-1 · B3 (2026-09-26): PATHS, VERDICTS, RULES, EXCEPTIONS, THE SORTING AND THE STATES (the projection
// ruling D5–D9; ADR 0031 §9.1 D5–D9; §9.2's landing gate F4, second half). §0 purity · §a ★★ F4: under IS-only with IS ; IS = IS,
// on the 42 hand triples of the record's first face (F · T · Φ, verbatim from the stone witness), the view's four kinds reproduce
// the stone's reference port (`links`: FIX · DIS · PRO · UND — {UND 497 · PRO 46 · DIS 39 · FIX 6}) role for role, and the loop
// reproduces the face reading's classification (`composeThroughCorner`, C-5: Fix · Mov · Und with the break's step) at all
// three bases, role for role — 76 · 39 · 45 Mov pairs · §b verdicts, rules, exceptions (UNRULED → a rule → LIGHT/COMPOSED; `not`;
// an exception flagged; a verdict disagreement across faces) · §c the states (UNDETECTED · VACUOUS · EXHAUSTED · CLOSED · POCKET ·
// COHERENT) · §d Virgin Land's record, the after: triads alone read LIGHT with the disagreement shown, never an instance · §e the
// shape route equals the records, and the resolver's feet (C-12b) agree with the view's kinds at a midpoint · §f the store's acts,
// the round trip, the dissection's carry of verdicts · §g the face reading routed (defect 1) · §h the surface: names on the face
// lines (defect 2); no "do not meet" where a path exists (defect 3), rendered at Virgin Land's Value–Action.
//
// Run: node scripts/diagnose-modes1-the-sorting.cjs

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

const SO = req('src/lib/sorting.ts');
const M = req('src/lib/relatings.ts');
const FR = req('src/lib/faceReading.ts');
const { spaceOf } = req('src/lib/spaceOf.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { parseWorkspaceImport } = req('src/lib/workspacePersistence.ts');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const React = require('react');
const { renderToString } = require('react-dom/server');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json'); const triangle = cast('triangle.cast.json');
const inv = (m) => { const o = new Map(); for (const [k, v] of m) o.set(v, k); return o; };
const comp = (g, f) => { const o = new Map(); for (const [x, y] of f) if (g.has(y)) o.set(x, g.get(y)); return o; };
const toMap = (o) => new Map(Object.entries(o));
const isOf = (m) => [...m].map(([x, y]) => ['IS', x, y, '+']);
const plain = (e) => (e.identification ? e.identification.roles : []);
const edgeOf = (id, a, b, m) => ({ id, vertexIds: [a, b], sourceVertexIds: [a, b], identification: { roles: [...m], types: [] } });

// ═══ §0 PURITY ═══
console.log('THE SORTING — B3 (MODES-1)\n\n----- §0 purity -----');
const src = readLf('src/lib/sorting.ts');
check('§0 sorting.ts is react-free and store-free: the types, the face reading\'s edgeBetween, B1\'s reader, the respects (the triads and the faces through an edge) and the resolver\'s option type', (src.match(/^import /gm) || []).length === 5 && !/useGeometryStore|from '\.\.\/store|from '\.\.\/components|from '\.\.\/manuscript|from 'react'|from 'three'|@react-three/.test(src));
check('§0 the module never touches `.identification` and never proposes (no `propose`, no `offer`; a light is record, §9.6)', !/\.identification\b|EdgeIdentification|propos|offer/i.test(src.replace(/\/\/.*$/gm, '')));
check('§0 the identity regime\'s rule is built in and first: IS_RULE = [IS, IS, IS] and composeBy consults it before the person\'s rules', /export const IS_RULE: Rule = \[IS, IS, IS\];/.test(src) && /for \(const \[a, b, c\] of \[IS_RULE, \.\.\.rules\]\)/.test(src));
check('§0 NO VERTEX ID IN THE VERDICT RECORD: the face stores the two base corners by their POSITIONS (`base: [number, number]`), the rest role ids and words', /base: \[number, number\];/.test(src) && !/corner: VertexId/.test(src.slice(src.indexOf('export interface VerdictRecord'), src.indexOf('export const VERDICTS_KEY'))));

// ═══ §a F4 — the 42 hand triples ═══
console.log('\n----- §a F4: the stone\'s four kinds and the face reading\'s classification, on the 42 hand triples -----');
const stoneSrc = readLf('scripts/diagnose-the-stone.cjs');
const constOf = (name) => { const m = stoneSrc.match(new RegExp(`^const ${name} = (.*);$`, 'm')); if (!m) throw new Error(`${name} not found in the stone witness`); return new Function(`return ${m[1]}`)(); };
const HAND_TF = constOf('HAND_TF'); const HAND_TP = constOf('HAND_TP'); const J_FP = constOf('J_FP');
const flowRoles = flow.roles.map((r) => r.id);
const links = (J_AB, J_AX, J_XB, A_roles) => { const foot = comp(J_XB, J_AX); const L = new Map(); for (const a of A_roles) { if (!foot.has(a)) L.set(a, ['UND', null]); else if (J_AB.get(a) === foot.get(a)) L.set(a, ['FIX', foot.get(a)]); else if (J_AB.has(a)) L.set(a, ['DIS', foot.get(a)]); else L.set(a, ['PRO', foot.get(a)]); } return L; };
const triples = [];
for (const tf of Object.keys(HAND_TF)) for (const tp of Object.keys(HAND_TP)) for (const fp of Object.keys(J_FP)) triples.push({ tf, tp, fp });
let kindMismatch = 0; const kinds = {}; let loopMismatch = 0; const mov = { F: 0, T: 0, P: 0 }; let sortedTriples = 0;
let targetTensions = 0; let proTaken = 0; let sourceTensions = 0;
const casts = { F: flow, T: tcell, P: phi };
for (const { tf, tp, fp } of triples) {
  const J_FT = inv(toMap(HAND_TF[tf])); const J_TP = toMap(HAND_TP[tp]); const J_PF = inv(toMap(J_FP[fp]));
  const J_FP_ = inv(J_PF); const J_PT = inv(J_TP);
  // the view Φ on F–T
  const s = SO.sortFromRecords(['F', 'T'], isOf(J_FT), [{ view: 'P', faceId: 'f', xz: isOf(J_FP_), zy: isOf(J_PT), triads: [], verdicts: [] }], []);
  const L = links(J_FT, J_FP_, J_PT, flowRoles);
  const v = s.views[0];
  for (const a of flowRoles) {
    const mine = v.feet.get(a) ? v.feet.get(a).kind : 'UND';
    const ref = L.get(a)[0];
    if (mine !== ref) kindMismatch += 1;
    kinds[mine] = (kinds[mine] || 0) + 1;
  }
  // M2 (§9.7): the target-end tensions — a proposal onto a T-role already paired elsewhere — counted from the sorting and DERIVED from the pairings alone
  targetTensions += v.tensions.filter((t) => t.end === 'target').length;
  sourceTensions += v.tensions.filter((t) => t.end === 'source').length;
  const takenT = new Map([...J_FT].map(([f, t]) => [t, f]));
  for (const [a, [k, b]] of L) if (k === 'PRO' && takenT.has(b) && takenT.get(b) !== a) proTaken += 1;
  sortedTriples += 1;
  // the loop at the three bases against the face reading
  const edges = [edgeOf('e-FT', 'F', 'T', J_FT), edgeOf('e-TP', 'T', 'P', J_TP), edgeOf('e-PF', 'P', 'F', J_PF)];
  const { walk } = FR.walkOf(['F', 'T', 'P'], edges, plain);
  const maps = { F: [J_FT, J_TP, J_PF], T: [J_TP, J_PF, J_FT], P: [J_PF, J_FT, J_TP] };
  const stepAt = { F: [['F', 'T'], ['T', 'P'], ['P', 'F']], T: [['T', 'P'], ['P', 'F'], ['F', 'T']], P: [['P', 'F'], ['F', 'T'], ['T', 'P']] };
  for (const c of ['F', 'T', 'P']) {
    const r = FR.composeThroughCorner(walk, c, casts[c]);
    const l = SO.loopReading(maps[c][0], maps[c][1], maps[c][2], casts[c].roles.map((x) => x.id));
    const refUnd = r.und.map((u) => `${u.role}@${stepAt[c].findIndex(([f, t]) => f === u.brokeAt.from && t === u.brokeAt.to) + 1}`).sort();
    const mineUnd = l.und.map((u) => `${u.role}@${u.brokeAt}`).sort();
    if (J([...r.fix].sort()) !== J([...l.fix].sort()) || J(r.mov.map((p) => p.join('>')).sort()) !== J(l.mov.map((p) => p.join('>')).sort()) || J(refUnd) !== J(mineUnd)) loopMismatch += 1;
    mov[c] += r.mov.length;
  }
}
check(`§a ★★ THE LANDING GATE, SECOND HALF (the stone, as §9.7 corrects it): over the ${sortedTriples} hand triples, the view's kinds under IS ; IS = IS equal the stone's reference port ROLE FOR ROLE after the merge (FIX = COMPOSED · DIS = a tension at the source · PRO = a light or a tension at the target · UND = no path) — 0 mismatches — and reproduce its census {UND 497 · PRO 46 · DIS 39 · FIX 6}`, sortedTriples === 42 && kindMismatch === 0 && J(kinds) === J({ UND: 497, PRO: 46, DIS: 39, FIX: 6 }), J({ kindMismatch, kinds }));
check(`§a ★★ THE FAR-END COLLISION (M2, §9.7): on the hand triples the sorting reads ${targetTensions} tensions at the TARGET — a proposal onto a T-role already paired elsewhere — and that count is DERIVABLE from the pairings alone (the probe's PRO_TAKEN, 42): derived ${proTaken}; the tensions at the source are the stone's ${sourceTensions} DIS`, targetTensions === 42 && proTaken === 42 && sourceTensions === 39, J({ targetTensions, proTaken, sourceTensions }));
check('§a ★★ THE LANDING GATE, SECOND HALF (the face): at all three bases of every triple the loop equals `composeThroughCorner` — Fix, Mov (with the return) and Und (with the step it broke at) — 0 mismatches; the seal\'s Mov pairs reproduced: Flow 76 · T 39 · Φ 45', loopMismatch === 0 && mov.F === 76 && mov.T === 39 && mov.P === 45, J({ loopMismatch, mov }));
const T3 = { x: 'x', y: 'y', z: 'z' };
const s1 = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+'], ['IS', 'x2', 'y3', '+']], [{ view: 'Z', faceId: 'f', xz: [['IS', 'x1', 'z1', '+'], ['IS', 'x2', 'z2', '+'], ['IS', 'x3', 'z3', '+']], zy: [['IS', 'z1', 'y1', '+'], ['IS', 'z2', 'y2', '+']], triads: [], verdicts: [] }], []);
check('§a the four kinds by name on a small record: x1 → z1 → y1 with x1 ≡ y1 given: FIX (COMPOSED, y1 the centroid\'s); x2 → z2 → y2 with x2 ≡ y3 given: DIS (a TENSION at the SOURCE, pressing on x2 ≡ y3); x3 → z3 with no z3 → Y: UND; and OWN = {x2 ≡ y3}', J([...s1.views[0].feet].map(([x, f]) => [x, f.kind]).sort()) === J([['x1', 'FIX'], ['x2', 'DIS'], ['x3', 'UND']]) && J(s1.centroid) === J(['IS|x1|y1']) && J(s1.own) === J(['IS|x2|y3']) && s1.views[0].tensions.length === 1 && s1.views[0].tensions[0].direct === 'IS|x2|y3' && s1.views[0].tensions[0].end === 'source', J({ feet: [...s1.views[0].feet], own: s1.own, centroid: s1.centroid }));
const sT = SO.sortFromRecords(['X', 'Y'], [['IS', 'x9', 'y1', '+']], [{ view: 'Z', faceId: 'f', xz: [['IS', 'x1', 'z1', '+']], zy: [['IS', 'z1', 'y1', '+']], triads: [], verdicts: [] }], []);
check('§a THE TARGET END (M2, §9.7): x1 → z1 → y1 where y1 is already x9\'s (x9 ≡ y1 given, x1 unpaired) is a TENSION at the TARGET, naming the far-end instance x9 ≡ y1 it presses on — never a light; in the identity regime it reads PRO (the stone\'s proposal is a merge)', sT.views[0].tensions.length === 1 && sT.views[0].tensions[0].end === 'target' && sT.views[0].tensions[0].direct === 'IS|x9|y1' && sT.views[0].lights.length === 0 && sT.views[0].feet.get('x1').kind === 'PRO', J({ tensions: sT.views[0].tensions.map((t) => [t.end, t.direct]), feet: [...sT.views[0].feet] }));
const s2 = SO.sortFromRecords(['X', 'Y'], [], [{ view: 'Z', faceId: 'f', xz: [['IS', 'x1', 'z1', '+']], zy: [['IS', 'z1', 'y1', '+']], triads: [], verdicts: [] }], []);
check('§a PRO is LIGHT: x1 → z1 → y1 with nothing given on X–Y composes to (IS, x1, y1) — Z\'s light, no instance made of it (the edge stays UNDETECTED)', s2.views[0].feet.get('x1').kind === 'PRO' && s2.views[0].lights.length === 1 && s2.instances.length === 0 && s2.state === 'UNDETECTED' && !s2.closed, J({ lights: s2.views[0].lights.map((l) => l.reading), state: s2.state }));
void T3;

// ═══ §b verdicts, rules, exceptions ═══
console.log('\n----- §b verdicts, rules, exceptions -----');
const legs = [{ view: 'Z', faceId: 'f', xz: [['carries', 'x1', 'z1', '+']], zy: [['resists', 'z1', 'y1', '+']], triads: [], verdicts: [] }];
const u0 = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+']], legs, []);
check('§b a path in two modes with no rule and no verdict is UNRULED (the edge\'s instance stays OWN)', u0.views[0].unruled.length === 1 && u0.unruled === true && J(u0.own) === J(['sustains|x1|y1']));
const u1 = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+']], legs, [['carries', 'resists', 'sustains']]);
check('§b THE RULE (carries, resists) ↦ sustains: the path composes to `sustains` and meets the direct — COMPOSED, the instance the centroid\'s; the edge EXHAUSTED and CLOSED', u1.views[0].paths[0].reading === 'COMPOSED' && u1.views[0].paths[0].by === 'rule' && J(u1.centroid) === J(['sustains|x1|y1']) && u1.state === 'EXHAUSTED' && u1.closed);
const u2 = SO.sortFromRecords(['X', 'Y'], [], legs, [['carries', 'resists', 'sustains']]);
check('§b the same rule with no direct: LIGHT — Z\'s light of (sustains, x1, y1), the edge UNDETECTED', u2.views[0].paths[0].reading === 'LIGHT' && u2.views[0].paths[0].composite === 'sustains' && u2.state === 'UNDETECTED');
const u3 = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '-']], legs, [['carries', 'resists', 'sustains']]);
check('§b the same rule against the person\'s BAR (sustains, x1, y1, −): TENSION, shown, never resolved; the edge is not coherent', u3.views[0].paths[0].reading === 'TENSION' && u3.coherent === false);
const notV = { x: 'x1', w: 'carries', z: 'z1', w2: 'resists', y: 'y1', w3: 'sustains', verdict: 'not' };
const u4 = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+']], [{ ...legs[0], verdicts: [notV] }], [['carries', 'resists', 'sustains']]);
check('§b THE VERDICT `not` on the path overrides the rule: the path reads NOT, flagged as an EXCEPTION; the direct stays OWN', u4.views[0].paths[0].reading === 'NOT' && u4.views[0].paths[0].exception === true && J(u4.own) === J(['sustains|x1|y1']));
const otherV = { ...notV, w3: 'detaches', verdict: 'composed' };
const u5 = SO.sortFromRecords(['X', 'Y'], [['detaches', 'x1', 'y1', '+']], [{ ...legs[0], verdicts: [otherV] }], [['carries', 'resists', 'sustains']]);
check('§b a verdict `composed` to another word than the rule\'s is an EXCEPTION too — the path composes to the person\'s word and meets that direct', u5.views[0].paths[0].reading === 'COMPOSED' && u5.views[0].paths[0].exception === true && u5.views[0].paths[0].composite === 'detaches');
const dis = SO.sortFromRecords(['X', 'Y'], [], [
  { view: 'Z', faceId: 'f1', xz: [['carries', 'x1', 'z1', '+']], zy: [['resists', 'z1', 'y1', '+']], triads: [], verdicts: [{ ...notV, w3: 'sustains', verdict: 'composed' }] },
  { view: 'W', faceId: 'f2', xz: [['carries', 'x1', 'w1', '+']], zy: [['resists', 'w1', 'y1', '+']], triads: [], verdicts: [{ ...notV, z: 'w1', w3: 'detaches', verdict: 'composed' }] },
], []);
check('§b two verdicts on one word-pair (carries, resists) that disagree across faces (sustains at Z, detaches at W) — the edge is not COHERENT (the disagreement is shown, never resolved)', dis.coherent === false && dis.views.every((v) => v.paths[0].by === 'verdict'));

// ═══ §c the states ═══
console.log('\n----- §c the states -----');
const vac = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+']], [{ view: 'Z', faceId: 'f', xz: [], zy: [], triads: [], verdicts: [] }], []);
check('§c VACUOUS: a view with no relating from X or Y to Z says so; the instance is OWN (no path through that view)', vac.views[0].vacuous && J(vac.own) === J(['IS|x1|y1']) && vac.state === 'OPEN' && vac.coherent);
const pocket = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+'], ['IS', 'x2', 'y2', '+']], [
  { view: 'Z', faceId: 'f1', xz: [['IS', 'x1', 'z1', '+']], zy: [['IS', 'z1', 'y1', '+']], triads: [], verdicts: [] },
  { view: 'W', faceId: 'f2', xz: [['IS', 'x2', 'w1', '+']], zy: [['IS', 'w1', 'y2', '+']], triads: [], verdicts: [] },
], []);
check('§c POCKET (D9): two views, each own part non-empty ({x2 ≡ y2} under Z, {x1 ≡ y1} under W), their intersection empty — the site is contested, not coherent, not exhausted', pocket.state === 'POCKET' && J(pocket.views[0].own) === J(['IS|x2|y2']) && J(pocket.views[1].own) === J(['IS|x1|y1']) && pocket.own.length === 0 && !pocket.coherent);
const undet = SO.sortFromRecords(['X', 'Y'], [], [], []);
check('§c UNDETECTED with no view at all: no instance, no path; not closed', undet.state === 'UNDETECTED' && !undet.closed && undet.coherent);

// ═══ §d Virgin Land's record — the after ═══
console.log('\n----- §d Virgin Land\'s record: triads alone read LIGHT, the disagreement shown -----');
const vlPath = path.join(repoRoot, '.handoff/inbox/coder/2026-09-25_2353_virgin-land_export_break-by-lights_ValueAction.workspace.json');
let vlShape = null;
if (fs.existsSync(vlPath)) {
  const vl = parseWorkspaceImport(JSON.parse(fs.readFileSync(vlPath, 'utf8')));
  vlShape = Object.values(vl.shapes).find((s) => s.faces.some((f) => f.data && f.data.triads));
  const label = (v) => vlShape.vertices[v].data.label || v;
  const byLabel = (l) => Object.values(vlShape.vertices).find((v) => v.data.label === l).id;
  const rows = vlShape.edges.map((e) => SO.sortingOf(vlShape, e, {}, [])).filter((s) => s && s.views.some((v) => v.paths.length > 0)).map((s) => ({ edge: `${label(s.edge[0])}–${label(s.edge[1])}`, state: s.state, closed: s.closed, instances: s.instances.length, lights: s.views.flatMap((v) => v.lights.map((l) => `${label(v.view)}:${l.path.x}→${l.path.y}${l.path.source === 'triad' ? '·triad' : ''}`)), paths: s.views.reduce((n, v) => n + v.paths.length, 0) }));
  note(J(rows));
  const va = rows.find((r) => r.edge === 'Value–Action' || r.edge === 'Action–Value');
  check('§d ★★ THE AFTER (the mothership\'s 17:06 §2): every edge joined by triads alone is UNDETECTED with LIGHTS — no instance made of a light, nothing CLOSED; every path is a triad\'s', rows.length === 6 && rows.every((r) => r.state === 'UNDETECTED' && !r.closed && r.instances === 0 && r.lights.length === r.paths && r.lights.every((l) => l.endsWith('·triad'))), J(rows.map((r) => [r.edge, r.state, r.lights.length])));
  check('§d ★★ THE DISAGREEMENT SHOWN at Value–Action: Fact\'s light proposes tl → tl and Meaning\'s tl → tr — both lights listed on one x (C-14 read this as silence; §9.6: light is record, never an offer)', !!va && va.lights.length === 2 && va.lights.some((l) => l.startsWith('Fact:tl→tl')) && va.lights.some((l) => l.startsWith('Meaning:tl→tr')), va && J(va.lights));
  const vlPairs = vlShape.edges.reduce((n, e) => n + M.instancesOn(e).filter((r) => r[0] === 'IS').length, 0);
  const vlTargetTensions = vlShape.edges.map((e) => SO.sortingOf(vlShape, e, {}, [])).filter(Boolean).reduce((n, s) => n + s.views.reduce((m, v) => m + v.tensions.filter((t) => t.end === 'target').length, 0), 0);
  check(`§d THE FAR-END COUNT on Virgin Land\'s record (M2): derived from its pairings alone — ${vlPairs} IS-instances, so 0 roles paired elsewhere for a proposal to land on — and the sorting reads ${vlTargetTensions} target-end tensions: they agree`, vlPairs === 0 && vlTargetTensions === 0, J({ vlPairs, vlTargetTensions }));
} else note('Virgin Land\'s fixture is not beside the inbox on this checkout — §d skipped here');

// ═══ §e the shape route; the resolver's feet ═══
console.log('\n----- §e the shape route and the resolver\'s feet -----');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const seeded4 = () => { let s = createSeedShape('tetrahedron'); for (const [l, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', triangle]]) s = withCast(s, byLabel(s, l), c); return s; };
const reset = (seeded) => useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], rules: [], liftSelection: [], selectedCellId: null, selectedVertexId: null, selectedEdgeId: null, selectedFaceId: null });
const E = (shape, X, Y) => FR.edgeBetween(shape.edges, byLabel(shape, X), byLabel(shape, Y));
const give = (X, Y, map) => { const e = E(cur(), X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
reset(seeded4());
give('A', 'B', { F7: 'r0', F13: 'r8', F9: 'r1' });
give('A', 'C', { F13: 'Φ8', F9: 'Φ1', F3: 'Φ2' });
give('C', 'B', { Φ8: 'r0', Φ1: 'r1' });
const sAB = SO.sortingOf(cur(), E(cur(), 'A', 'B'), {}, []);
const viewC = sAB.views.find((v) => v.view === byLabel(cur(), 'C'));
const feetC = [...viewC.feet].map(([x, f]) => [x, f.kind]).sort();
check('§e THE SHAPE ROUTE: on the seeded tetrahedron with pairings on A–B, A–C and C–B, C\'s view on A–B reads F13: DIS (F13 → Φ8 → r0 against F13 ≡ r8) · F9: FIX (F9 → Φ1 → r1, F9 ≡ r1) · F3: UND (Φ2 reaches no B-role); D\'s view VACUOUS', J(feetC) === J([['F13', 'DIS'], ['F3', 'UND'], ['F9', 'FIX']]) && sAB.views.find((v) => v.view === byLabel(cur(), 'D')).vacuous, J({ feetC, views: sAB.views.map((v) => [v.view, v.vacuous, v.paths.length]) }));
S().applyAmboDissectionToCurrent();
const G1 = cur();
const midAB = Object.values(G1.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(byLabel(G1, 'A')) && v.createdBy.sourceVertexIds.includes(byLabel(G1, 'B')));
const resolvedAB = spaceOf(G1, midAB.id);
const footC = resolvedAB.feet.find((f) => f.corner === byLabel(G1, 'C'));
const s1AB = SO.sortingOf(G1, E(G1, 'A', 'B'), {}, []);
const v1C = s1AB.views.find((v) => v.view === byLabel(G1, 'C'));
const kindsFromFoot = (foot) => [...foot.fix.map(([a]) => [a, 'FIX']), ...foot.disagreement.map(([a]) => [a, 'DIS']), ...foot.proposal.map(([a]) => [a, 'PRO'])].sort();
const kindsFromView = (v) => [...v.feet].filter(([, f]) => f.kind !== 'UND').map(([x, f]) => [x, f.kind]).sort();
check('§e ★★ THE RESOLVER\'S FEET (C-12b, the identity regime) AGREE WITH THE VIEW\'S KINDS at the midpoint AB after the dissection: fix ↔ FIX, disagreement ↔ DIS, proposal ↔ PRO, role for role', !!footC && J(kindsFromFoot(footC)) === J(kindsFromView(v1C)) && kindsFromFoot(footC).length > 0, J({ foot: footC && kindsFromFoot(footC), view: kindsFromView(v1C) }));

// ═══ §f the store's acts, the round trip, the carry ═══
console.log('\n----- §f the acts, the round trip, the carry -----');
reset(seeded4());
S().nameRule('carries', 'resists', 'sustains'); S().nameRule('carries', 'resists', 'sustains'); S().nameRule('IS', 'IS', 'IS'); S().nameRule(' ', 'x', 'y');
check('§f nameRule records one rule per word-pair (a repeat replaces; IS ; IS and a blank are never stored)', J(S().rules) === J([['carries', 'resists', 'sustains']]));
S().nameRule('carries', 'resists', 'detaches');
check('§f a rule re-named replaces the composite for its word-pair', J(S().rules) === J([['carries', 'resists', 'detaches']]));
const fABC = cur().faces.find((f) => f.vertexIds.length === 3 && ['A', 'B', 'C'].every((l) => f.vertexIds.includes(byLabel(cur(), l))));
const iA = fABC.vertexIds.indexOf(byLabel(cur(), 'A')); const iB = fABC.vertexIds.indexOf(byLabel(cur(), 'B'));
const rec = { base: [iA, iB], x: 'F13', w: 'IS', z: 'Φ8', w2: 'IS', y: 'r0', w3: 'IS', verdict: 'not' };
const r1 = S().giveVerdict(fABC.id, rec);
check('§f giveVerdict writes ONE verdict on the face packet, positional; verdictsOn reads it back', r1 === null && J(SO.verdictsOn(cur().faces.find((f) => f.id === fABC.id))) === J([rec]));
check('§f a verdict refused by name: a face of four corners, positions out of range, a blank word', typeof S().giveVerdict(fABC.id, { ...rec, base: [0, 0] }) === 'string' && typeof S().giveVerdict('face:none', rec) === 'string' && typeof S().giveVerdict(fABC.id, { ...rec, x: ' ' }) === 'string');
give('A', 'B', { F13: 'r0' }); give('A', 'C', { F13: 'Φ8' }); give('C', 'B', { Φ8: 'r0' });
const sV = SO.sortingOf(cur(), E(cur(), 'A', 'B'), {}, S().rules);
const pV = sV.views.find((v) => v.view === byLabel(cur(), 'C')).paths.find((p) => p.path.x === 'F13');
check('§f THE VERDICT READ ON THE SHAPE: F13 → Φ8 → r0 with F13 ≡ r0 given would be FIX, but the person said `not` — the path reads NOT, an exception to IS ; IS = IS, and F13 ≡ r0 stays OWN', !!pV && pV.reading === 'NOT' && pV.exception === true && J(sV.own) === J(['IS|F13|r0']));
const file = JSON.parse(J(S().exportWorkspace()));
reset(seeded4()); S().nameRule('stale', 'session', 'rule');
S().importWorkspace(JSON.parse(J(file)));
check('§f ★★ THE ROUND TRIP: the file carries the rules and the face\'s verdicts; a FRESH store after Import reads both (the session\'s rules dropped)', J(S().rules) === J([['carries', 'resists', 'detaches']]) && J(SO.verdictsOn(cur().faces.find((f) => f.id === fABC.id))) === J([rec]) && J(file.rules) === J([['carries', 'resists', 'detaches']]));
const old = JSON.parse(J(file)); delete old.rules; reset(seeded4()); S().importWorkspace(old);
check('§f a file saved before B3 (no `rules`) imports with none', J(S().rules) === '[]');
S().withdrawVerdict(fABC.id, rec);
check('§f withdrawVerdict takes it off the face (no key left behind when nothing else is held)', SO.verdictsOn(cur().faces.find((f) => f.id === fABC.id)).length === 0);
S().withdrawRule('carries', 'resists');
check('§f withdrawRule', J(S().rules) === '[]');
reset(seeded4());
S().giveVerdict(cur().faces.find((f) => f.id === fABC.id) ? fABC.id : cur().faces[0].id, rec);
S().applyAmboDissectionToCurrent();
const carried = cur().faces.filter((f) => SO.verdictsOn(f).length > 0);
check('§f THE DISSECTION CARRIES THE VERDICTS with the triads: the dissected cell\'s face record rides onto its parent-cell-face, positional in the same corner order — one face holds it in the child', carried.length === 1 && carried[0].role === 'parent-cell-face' && J(SO.verdictsOn(carried[0])) === J([rec]), J(carried.map((f) => [f.role, SO.verdictsOn(f)])));

// ═══ §g the face reading routed ═══
console.log('\n----- §g the face reading routed (defect 1) -----');
const frSrc = readLf('src/lib/faceReading.ts');
check('§g faceReading.ts never reads the plain record: `readStep`, `walkOf` and `faceOf` take the READER the caller hands (`RecordReader`), and `.identification` is gone from the module', !/\.identification\b/.test(frSrc) && /export function readStep\(edges: Edge\[\], from: VertexId, to: VertexId, read: RecordReader\)/.test(frSrc) && /export function walkOf\(corners: \[VertexId, VertexId, VertexId\], edges: Edge\[\], read: RecordReader\)/.test(frSrc) && /export function faceOf\([^)]*read: RecordReader, options: FaceOptions = \{\}\)/.test(frSrc));
check('§g the module stays pure (the face witness\'s §6): its imports are still the types and the register\'s `valuesAgree`', (frSrc.match(/^import /gm) || []).length === 2);
const msSrc = readLf('src/components/MidpointSurface.tsx');
check('§g THE SURFACE HANDS THE ONE READER: `readInstances` = the IS-instances through B1\'s reader, passed to `faceOf`', /const readInstances = \(e: Edge\): Array<\[string, string\]> => instancesOn\(e\)\.filter\(\(r\) => r\[0\] === IS\)/.test(msSrc) && /faceOf\(cycle, casts, shape\.edges, readInstances\)/.test(msSrc));

// ═══ §h the surface: names (defect 2) and no "do not meet" where a path exists (defect 3) ═══
console.log('\n----- §h the surface: the face lines by name; the silent line only where no path exists -----');
check('§h defect 2: the face lines print the corner\'s own names for the roles that returned, returned elsewhere and did not return — never an id', /returned to itself: \$\{r\.fix\.length \? r\.fix\.map\(\(x\) => nameAt\(r\.corner, x\)\)/.test(msSrc) && /returned elsewhere: \$\{r\.mov\.length \? r\.mov\.map\(\(\[x, y\]\) => `\$\{nameAt\(r\.corner, x\)\} as \$\{nameAt\(r\.corner, y\)\}`\)/.test(msSrc) && /s\.roles\.map\(\(x\) => nameAt\(r\.corner, x\)\)\.join\(' '\)/.test(msSrc));
check('§h defect 3, by construction: a foot is silent only when its map is empty AND the sorting finds NO path through that corner (`silent = f.map.size === 0 && !(view && view.paths.length > 0)`)', /const silent = f\.map\.size === 0 && !\(view && view\.paths\.length > 0\);/.test(msSrc) && /const sourceEdge = useMemo\(\(\) => edgeBetween\(shape\.edges, site\.a, site\.b\)/.test(msSrc) && /const sorting = useMemo\(\(\) => sortingOf\(shape, sourceEdge, \{\}, \[\]\)/.test(msSrc));
if (vlShape) {
  const vlById = { ...vlShape };
  useGeometryStore.setState({ shapes: { [vlById.id]: vlById }, shapeOrder: [vlById.id], currentShapeId: vlById.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], rules: [] });
  const byL = (l) => Object.values(vlById.vertices).find((v) => v.data.label === l).id;
  const mid = Object.values(vlById.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(byL('Value')) && v.createdBy.sourceVertexIds.includes(byL('Action')));
  const packet = buildGeneralSitePacketPresenterReport(vlById).packets.find((p) => p.trace.siteId === mid.id);
  const site = midpointSiteOf(vlById, mid.id, packet ? packet.trace : null);
  const resolved = spaceOf(vlById, mid.id);
  const parents = [spaceOf(vlById, site.a), spaceOf(vlById, site.b)];
  const html = renderToString(React.createElement(MidpointSurface, { shape: vlById, site, parents, resolved, refusal: null, remade: null })).replace(/<!-- -->/g, '');
  const feet = [...html.matchAll(/data-midpoint-foot="([^"]+)" data-midpoint-foot-state="([^"]+)"/g)].map((m) => [m[1], m[2]]);
  check('§h ★★ RENDERED AT VIRGIN LAND\'S Value–Action (the fixture beside the letter): no foot says the legs do not meet; Fact\'s foot is `read` (its triad path) and its respect line is there; no `says nothing about` line at all on this midpoint', !/do not meet/.test(html) && feet.some(([c, s]) => c === 'Fact' && s === 'read') && /data-midpoint-respect-line/.test(html) && !/says nothing about/.test(html), J({ feet, doNotMeet: /do not meet/.test(html), saysNothing: (html.match(/says nothing about/g) || []).length }));
  check('§h defect 2 rendered: the face lines on this midpoint print no bare role id of the casts (`tl as tr` never appears; the corners\' own names do)', !/\btl as t[lr]\b/.test(html) && !/\bbl as \w+\b/.test(html), (html.match(/returned (?:to itself|elsewhere): [^<]{0,60}/g) || []).slice(0, 3).join(' | '));
}

console.log(`\n${failures === 0 ? 'DIAGNOSE-MODES1-THE-SORTING: ALL PASS — under IS ; IS = IS the view\'s kinds are the stone\'s and the loop is the face reading\'s, role for role on the 42 hand triples; verdicts, rules and exceptions read as ruled; the states read as defined; triads alone are lights, never instances; the face reading reads through the one reader; the surface names roles and is silent only where no path exists' : `DIAGNOSE-MODES1-THE-SORTING: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
