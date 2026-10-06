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
// lines (defect 2); no "do not meet" where a path exists (defect 3), rendered at Virgin Land's Value–Action · §i D18 (THE THIRD
// RESOLUTION §1; ADR 0031 §9.19–§9.20): the truth value of an instance V(i) as the one object — the definitions RUN, the tokens read from
// the family on §c's fixtures (the `closed` flag's difference said), F-D18 on the run-2 saves (792 cards, zero departures).
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
check('§0 sorting.ts is react-free and store-free: the types, the face reading\'s edgeBetween, the instance space (D14 — the coordinate map read off the child), B1\'s reader, the respects (the triads and the faces through an edge) and the resolver\'s option type', (src.match(/^import /gm) || []).length === 6 && /import \{ instancesFrom, instancesWithInherited \} from '\.\/instanceSpace';/.test(src) && !/useGeometryStore|from '\.\.\/store|from '\.\.\/components|from '\.\.\/manuscript|from 'react'|from 'three'|@react-three/.test(src));
check('§0 the module never touches `.identification` and never proposes (no `propose`, no `offer`; a light is record, §9.6)', !/\.identification\b|EdgeIdentification|propos|offer/i.test(src.replace(/\/\/.*$/gm, '')));
check('§0 the identity regime\'s rule is built in and first: IS_RULE = [IS, IS, IS] and composeBy answers IS ; IS before it consults the person\'s rules (every shape — IS is symmetric)', /export const IS_RULE: Rule = \[IS, IS, IS\];/.test(src) && /if \(w === IS && w2 === IS\) return \{ word: IS, dir: ALONG, undirected: false \}; \/\/ symmetric: every shape\n  for \(const r of rules\) if \(ruleReads\(r, \{ w, w2, shape \}\)\) \{/.test(src));
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
check('§b THE RULE (carries, resists) ↦ sustains: the path composes to `sustains` and meets the direct — COMPOSED, the instance the centroid\'s; the site CLOSED (nothing theirs alone, no light — the one token at §8\'s precedence, MODES-2 (d))', u1.views[0].paths[0].reading === 'COMPOSED' && u1.views[0].paths[0].by === 'rule' && J(u1.centroid) === J(['sustains|x1|y1']) && u1.state === 'CLOSED' && u1.closed);
// MODES-2 (d): the seven states are ONE token at §8's precedence — UNDETECTED · VACUOUS · UNRULED · POCKET · EXHAUSTED · CLOSED · COHERENT · OPEN
const stUnruled = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+']], [{ view: 'Z', faceId: 'f', xz: [['IS', 'x1', 'z1', '+']], zy: [['IS', 'z1', 'y1', '+']], triads: [], verdicts: [] }, { ...legs[0], view: 'W', faceId: 'g' }], []);
const stExhausted = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+']], [{ view: 'Z', faceId: 'f', xz: [['IS', 'x1', 'z1', '+'], ['IS', 'x2', 'z2', '+']], zy: [['IS', 'z1', 'y1', '+'], ['IS', 'z2', 'y2', '+']], triads: [], verdicts: [] }], []);
const stCoherent = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+'], ['IS', 'x2', 'y2', '+']], [{ view: 'Z', faceId: 'f', xz: [['IS', 'x1', 'z1', '+']], zy: [['IS', 'z1', 'y1', '+']], triads: [], verdicts: [] }], []);
check('§b THE ONE TOKEN at §8\'s precedence: an unruled passage makes the site UNRULED even where the rest would read CLOSED (x1 ≡ y1 composed through Z, the carries·resists path unruled through W); nothing theirs alone with a light standing is EXHAUSTED, without one CLOSED; one theirs alone beside one the face\'s, looked at, none unsaid, is COHERENT', stUnruled.state === 'UNRULED' && stUnruled.unruled && stExhausted.state === 'EXHAUSTED' && !stExhausted.closed && stExhausted.own.length === 0 && u1.state === 'CLOSED' && stCoherent.state === 'COHERENT' && stCoherent.coherent, J([stUnruled.state, stExhausted.state, u1.state, stCoherent.state]));
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

// ═══ §b′ MARKER MODES-1 · M3 (2026-09-29) as MODES-4 · D13 and M3 (ADR 0031 §9.8, §9.14) re-read it: a leg AGAINST the walk carries its direction bit, the path has a SHAPE, a rule is keyed on the shape; a not-it say without a direct; exceptions against HIS rule alone; the legs held; the tension's end ═══
console.log('\n----- §b′ D13 (the interim of M3 lifted): a leg against the walk by its direction bit · the shape · rules keyed on the shape · a not-it say carries no w3 · an exception only against his rule · the legs held · the end is total -----');
// the M3 fixture, the direction now IN THE RECORD: `z1 carries x1` on X–Z (x1 the first corner's, said from Z: `←`) with `z1 resists y1` — BOTH FROM z1: a FORK
const ag = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+']], [{ ...legs[0], xz: [['carries', 'x1', 'z1', '+', '←']] }], [['carries', 'resists', 'sustains']]);
check('§b′ D13 REPLACES THE INTERIM: the leg said from Z carries `←` in the record; the path is a FORK (both from z1), its legs print AS HE SAID THEM (`z1 carries x1` · `z1 resists y1`), `path.against` says a leg runs against the walk; the CHAIN rule (carries, resists) ↦ sustains does not read a fork — UNRULED, no composite, the direct stays OWN; the fork\'s own key is carried first',
  ag.views[0].paths[0].reading === 'UNRULED' && ag.views[0].paths[0].path.shape === 'fork' && ag.views[0].paths[0].path.from === 'z' && ag.views[0].paths[0].path.against === true && ag.views[0].paths[0].composite === null && ag.views[0].paths[0].by === null && J(ag.views[0].paths[0].path.said) === J([['z1', 'carries', 'x1'], ['z1', 'resists', 'y1']]) && J(ag.views[0].paths[0].path.dirs) === J(['←', '→']) && J(ag.own) === J(['sustains|x1|y1']) && J(ag.views[0].paths[0].path.keys) === J([{ w: 'carries', w2: 'resists', shape: 'fork', dir: '→' }]), J(ag.views[0].paths[0]));
const agFork = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+']], [{ ...legs[0], xz: [['carries', 'x1', 'z1', '+', '←']] }], [['carries', 'resists', 'sustains', 'fork']]);
const agForkRev = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+']], [{ ...legs[0], xz: [['carries', 'x1', 'z1', '+', '←']] }], [['resists', 'carries', 'sustains', 'fork']]);
check('§b′ M3 (§9.14): a FORK rule reads it — (carries, resists from one point) ↦ sustains composes `x1 sustains y1` (the rule\'s first-named word\'s end the subject: carries is x1\'s leg), COMPOSED with the direct, by rule; the same rule named the other way round (resists and carries) composes `y1 sustains x1` (`←`) — no direct in that direction: a LIGHT, the direct stays own',
  agFork.views[0].paths[0].reading === 'COMPOSED' && agFork.views[0].paths[0].by === 'rule' && agFork.views[0].paths[0].composite === 'sustains' && agFork.views[0].paths[0].compositeDir === '→' && agForkRev.views[0].paths[0].reading === 'LIGHT' && agForkRev.views[0].paths[0].compositeDir === '←' && J(agForkRev.own) === J(['sustains|x1|y1']), J([agFork.views[0].paths[0].reading, agForkRev.views[0].paths[0]]));
const agConv = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+']], [{ ...legs[0], xz: [['carries', 'x1', 'z1', '+', '←']] }], [['carried-by', 'resists', 'sustains']], { converses: [['carries', 'carried-by']], opaque: [] });
check('§b′ M3: a declared CONVERSE (carries ↔ carried-by) reads the fork as a CHAIN — `x1 carried-by z1 · z1 resists y1` — and the chain rule (carried-by, resists) ↦ sustains composes it, COMPOSED; the legs still print as he said them; the keys carry the fork first, the chain second',
  agConv.views[0].paths[0].reading === 'COMPOSED' && agConv.views[0].paths[0].by === 'rule' && J(agConv.views[0].paths[0].path.said) === J([['z1', 'carries', 'x1'], ['z1', 'resists', 'y1']]) && J(agConv.views[0].paths[0].path.keys) === J([{ w: 'carries', w2: 'resists', shape: 'fork', dir: '→' }, { w: 'carried-by', w2: 'resists', shape: 'chain', dir: '→' }]), J(agConv.views[0].paths[0]));
// the chain FROM Y: both legs `←` — `z1 carries x1` · `y1 resists z1`, in the chain\'s own order `y1 resists z1 · z1 carries x1`
const agBack = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+', '←']], [{ ...legs[0], xz: [['carries', 'x1', 'z1', '+', '←']], zy: [['resists', 'z1', 'y1', '+', '←']] }], [['resists', 'carries', 'sustains']]);
const agBackWrong = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+', '←']], [{ ...legs[0], xz: [['carries', 'x1', 'z1', '+', '←']], zy: [['resists', 'z1', 'y1', '+', '←']] }], [['carries', 'resists', 'sustains']]);
check('§b′ M3: A CHAIN IS ONE KEY WHICHEVER WAY IT CROSSES THE EDGE — both legs `←` is a chain FROM Y (`y1 resists z1 · z1 carries x1`), its key the pair in the CHAIN\'s own order (resists, then carries) and its composite in the chain\'s own direction, `y1 sustains x1` (`←`): the rule (resists, carries) ↦ sustains composes it onto his `y1 sustains x1` (recorded `←`) — COMPOSED; the rule (carries, resists) ↦ sustains does NOT read it (the walk\'s order is the device\'s, not his) — UNRULED',
  agBack.views[0].paths[0].path.shape === 'chain' && agBack.views[0].paths[0].path.from === 'y' && J(agBack.views[0].paths[0].path.keys) === J([{ w: 'resists', w2: 'carries', shape: 'chain', dir: '←' }]) && agBack.views[0].paths[0].reading === 'COMPOSED' && agBack.views[0].paths[0].compositeDir === '←' && agBack.views[0].paths[0].direct === 'sustains|x1|y1|←' && J(agBack.centroid) === J(['sustains|x1|y1|←']) && agBackWrong.views[0].paths[0].reading === 'UNRULED', J([agBack.views[0].paths[0], agBackWrong.views[0].paths[0].reading]));
const agIS = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+']], [{ view: 'Z', faceId: 'f', xz: [['IS', 'x1', 'z1', '+', '←']], zy: [['IS', 'z1', 'y1', '+', '←']], triads: [], verdicts: [] }], []);
check('§b′ IS legs are unaffected: a `←` on an IS entry is read as `→` (IS is symmetric — D13; the designer\'s S3), the path composes by IS ; IS = IS (COMPOSED), `against` false, the legs in the walk\'s order', agIS.views[0].paths[0].reading === 'COMPOSED' && agIS.views[0].paths[0].path.against === false && J(agIS.views[0].paths[0].path.dirs) === J(['→', '→']) && J(agIS.views[0].paths[0].path.said) === J([['x1', 'IS', 'z1'], ['z1', 'IS', 'y1']]));
const agNot = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+']], [{ ...legs[0], xz: [['carries', 'x1', 'z1', '+', '←']], verdicts: [{ x: 'x1', w: 'carries', z: 'z1', w2: 'resists', y: 'y1', dirs: ['←', '→'], verdict: 'not' }] }], [['carries', 'resists', 'sustains']]);
const agOld = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+']], [{ ...legs[0], xz: [['carries', 'x1', 'z1', '+', '←']], verdicts: [{ x: 'x1', w: 'carries', z: 'z1', w2: 'resists', y: 'y1', verdict: 'not' }] }], []);
const agTwo = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+']], [{ ...legs[0], xz: [['carries', 'x1', 'z1', '+', '←'], ['carries', 'x1', 'z1', '+']], verdicts: [{ x: 'x1', w: 'carries', z: 'z1', w2: 'resists', y: 'y1', verdict: 'not' }] }], []);
check('§b′ a `not` say on the fork (its record carrying the legs\' senses) reads NOT, by verdict, and a not-it say carries NO w3 (it speaks of no direct — S5); a record WITHOUT `dirs` (every record before D13) names the ONE path with its five names — the fork here (NOT) — and where he has since said the same words both ways (a `→ →` chain beside the fork) it names the `→ →` one (the fork UNRULED, the chain NOT)', agNot.views[0].paths[0].reading === 'NOT' && agNot.views[0].paths[0].by === 'verdict' && agOld.views[0].paths[0].reading === 'NOT' && agTwo.views[0].paths.length === 2 && agTwo.views[0].paths.find((p) => p.path.shape === 'fork').reading === 'UNRULED' && agTwo.views[0].paths.find((p) => p.path.shape === 'chain').reading === 'NOT', J(agTwo.views[0].paths.map((p) => [p.path.shape, p.reading])));
const agComposed = SO.sortFromRecords(['X', 'Y'], [['sustains', 'x1', 'y1', '+']], [{ ...legs[0], xz: [['carries', 'x1', 'z1', '+', '←']], verdicts: [{ ...notV, dirs: ['←', '→'], verdict: 'composed' }] }], []);
check('§b′ D13 LIFTS THE INTERIM: a `composed` say on a path with a leg against the walk IS READ — his word on the fork composes it onto the direct (COMPOSED, by verdict)', agComposed.views[0].paths[0].reading === 'COMPOSED' && agComposed.views[0].paths[0].by === 'verdict', J(agComposed.views[0].paths[0]));
const exIS = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+']], [{ view: 'Z', faceId: 'f', xz: [['IS', 'x1', 'z1', '+']], zy: [['IS', 'z1', 'y1', '+']], triads: [], verdicts: [{ x: 'x1', w: 'IS', z: 'z1', w2: 'IS', y: 'y1', verdict: 'not' }] }], []);
check('§b′ S6: an EXCEPTION is read only against a rule HE named — a not-it on an IS ; IS path is no exception (the built-in rule names none), against his (carries, resists) ↦ sustains it is (u4)', exIS.views[0].paths[0].reading === 'NOT' && exIS.views[0].paths[0].exception === false && u4.views[0].paths[0].exception === true);
const legsHeld = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+']], [
  { view: 'Z', faceId: 'f1', xz: [], zy: [], triads: [], verdicts: [] },
  { view: 'W', faceId: 'f2', xz: [['IS', 'x1', 'w1', '+']], zy: [], triads: [], verdicts: [] },
  { view: 'V', faceId: 'f3', xz: [['IS', 'x1', 'v1', '+']], zy: [['IS', 'v2', 'y1', '+']], triads: [], verdicts: [] },
], []);
check('§b′ R1: each view says which legs hold a relating — none · the first only · both (and the two do not meet: no path)', J(legsHeld.views.map((v) => [v.legs, v.paths.length])) === J([[[false, false], 0], [[true, false], 0], [[true, true], 0]]), J(legsHeld.views.map((v) => v.legs)));
const srcT = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y2', '+']], [{ view: 'Z', faceId: 'f', xz: [['IS', 'x1', 'z1', '+']], zy: [['IS', 'z1', 'y1', '+']], triads: [], verdicts: [] }], []);
check('§b′ the TENSION\'s end is TOTAL and names what presses: his bar → `bar` with the bar\'s own key; his pair at the source → `source` with that pair (x1 ≡ y2); at the target → `target` with that pair (x9 ≡ y1)', u3.views[0].paths[0].end === 'bar' && u3.views[0].paths[0].direct === 'sustains|x1|y1' && srcT.views[0].paths[0].end === 'source' && srcT.views[0].paths[0].direct === 'IS|x1|y2' && sT.views[0].paths[0].end === 'target' && sT.views[0].paths[0].direct === 'IS|x9|y1');

// ═══ §c the states ═══
console.log('\n----- §c the states -----');
const vac = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+']], [{ view: 'Z', faceId: 'f', xz: [], zy: [], triads: [], verdicts: [] }], []);
check('§c VACUOUS is the SITE\'s own state (the second resolution §8, M4): a view with no relating from X or Y to Z says so; the instance is OWN (no path through that view); with no passage through any view the site is VACUOUS and NOT coherent (coherence presupposes a passage)', vac.views[0].vacuous && J(vac.own) === J(['IS|x1|y1']) && vac.state === 'VACUOUS' && !vac.looked && !vac.coherent);
const pocket = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+'], ['IS', 'x2', 'y2', '+']], [
  { view: 'Z', faceId: 'f1', xz: [['IS', 'x1', 'z1', '+']], zy: [['IS', 'z1', 'y1', '+']], triads: [], verdicts: [] },
  { view: 'W', faceId: 'f2', xz: [['IS', 'x2', 'w1', '+']], zy: [['IS', 'w1', 'y2', '+']], triads: [], verdicts: [] },
], []);
check('§c POCKET (D9): two views, each own part non-empty ({x2 ≡ y2} under Z, {x1 ≡ y1} under W), their intersection empty — the site is contested, not coherent, not exhausted', pocket.state === 'POCKET' && J(pocket.views[0].own) === J(['IS|x2|y2']) && J(pocket.views[1].own) === J(['IS|x1|y1']) && pocket.own.length === 0 && !pocket.coherent);
const undet = SO.sortFromRecords(['X', 'Y'], [], [], []);
check('§c UNDETECTED with no view at all: no instance, no path; not closed; not coherent (nothing looked at — §8)', undet.state === 'UNDETECTED' && !undet.closed && !undet.coherent);

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
// M5 (ADR §9.12): the store refuses a say on any path with an IS leg by name — so this IS ; IS record is WRITTEN onto the face
// directly (a record a person could hold from before the ruling), and the act's refusal is pinned beside it
const r1 = S().giveVerdict(fABC.id, rec);
{ const sh = cur(); useGeometryStore.setState({ shapes: { ...S().shapes, [sh.id]: { ...sh, faces: sh.faces.map((f) => (f.id === fABC.id ? SO.withVerdict(f, rec) : f)) } } }); }
check('§f M5: giveVerdict REFUSES a say on a path with an IS leg by name (`this passage has a pair in it, so what it comes to follows from the pair; you decide only passages of two modes`); written onto the face directly, ONE verdict, positional; verdictsOn reads it back', typeof r1 === 'string' && /has a pair in it/.test(r1) && J(SO.verdictsOn(cur().faces.find((f) => f.id === fABC.id))) === J([rec]), String(r1));
check('§f a verdict refused by name: a face of four corners, positions out of range, a blank word', typeof S().giveVerdict(fABC.id, { ...rec, base: [0, 0] }) === 'string' && typeof S().giveVerdict('face:none', rec) === 'string' && typeof S().giveVerdict(fABC.id, { ...rec, x: ' ' }) === 'string');
give('A', 'B', { F13: 'r0' }); give('A', 'C', { F13: 'Φ8' }); give('C', 'B', { Φ8: 'r0' });
const sV = SO.sortingOf(cur(), E(cur(), 'A', 'B'), {}, S().rules);
const pV = sV.views.find((v) => v.view === byLabel(cur(), 'C')).paths.find((p) => p.path.x === 'F13');
check('§f THE VERDICT READ ON THE SHAPE: F13 → Φ8 → r0 with F13 ≡ r0 given would be FIX, but the person said `not` — the path reads NOT, NO exception (M3 S6: the built-in IS ; IS = IS names none — an exception is against a rule HE named), and F13 ≡ r0 stays OWN', !!pV && pV.reading === 'NOT' && pV.exception === false && J(sV.own) === J(['IS|F13|r0']));
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
{ const sh = cur(); const fid = sh.faces.find((f) => f.id === fABC.id) ? fABC.id : sh.faces[0].id; useGeometryStore.setState({ shapes: { ...S().shapes, [sh.id]: { ...sh, faces: sh.faces.map((f) => (f.id === fid ? SO.withVerdict(f, rec) : f)) } } }); } // written onto the face (M5 refuses the IS ; IS act)
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
check('§h defect 2: the face lines print the corner\'s own names for the roles that returned, returned elsewhere and did not return — never an id', /return to themselves: \$\{r\.fix\.length \? r\.fix\.map\(\(x\) => nameAt\(r\.corner, x\)\)/.test(msSrc) && /return elsewhere: \$\{r\.mov\.length \? r\.mov\.map\(\(\[x, y\]\) => `\$\{nameAt\(r\.corner, x\)\} as \$\{nameAt\(r\.corner, y\)\}`\)/.test(msSrc) && /s\.roles\.map\(\(x\) => nameAt\(r\.corner, x\)\)\.join\(', '\)/.test(msSrc));
check('§h defect 3, by construction: a foot is silent only when it has NOTHING TO SAY — no agreement of his, no disagreement, no proposal (STAMP MODES-3, the ruling\'s 3: the composed identity\'s own agreements are the ordinary and go unmarked) — AND the sorting finds NO path through that corner (`silent = foot ? foot.fix.length + foot.disagreement.length + foot.proposal.length === 0 && !hasPath : !hasPath`, the corners tab)', /const hasPath = !!view && view\.paths\.length > 0;/.test(msSrc) && /const silent = foot \? foot\.fix\.length \+ foot\.disagreement\.length \+ foot\.proposal\.length === 0 && !hasPath : !hasPath;/.test(msSrc) && /const sourceEdge = site\.edge;/.test(msSrc) && /const sorting = useMemo\(\(\) => sortingOf\(shape, sourceEdge, \{\}, \[\]\)/.test(msSrc));
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

// ═══ §i D18 — THE TRUTH VALUE OF AN INSTANCE (the third resolution §1; ADR 0031 §9.19 with §9.20's rider) ═══
console.log('\n----- §i D18 the truth value per view: the one object, its readings, F-D18 on the run-2 saves -----');
{
  const V = SO.valuesOf(['a', 'b', 'c'], [{ view: 'Z', composedTo: new Set(['a', 'b']) }, { view: 'W', composedTo: new Set(['b']) }, { view: 'Z', composedTo: new Set(['c']) }]);
  check('§i V(i) RUN on a hand family: a → {Z}, b → {Z, W}, c → {Z} (a view once, however many faces compose through it); OWN iff the value is empty; TOTAL iff the view lies in every value — Z is total, W is not', J([...V]) === J([['a', ['Z']], ['b', ['Z', 'W']], ['c', ['Z']]]) && !SO.isOwn(V, 'a') && SO.isOwn(SO.valuesOf(['d'], []), 'd') && SO.isTotal(V, 'Z') && !SO.isTotal(V, 'W'), J([...V]));
  const R = SO.readValues(V, ['a', 'b', 'c'], ['Z', 'W', 'Z']);
  check('§i THE READINGS RUN: the site\'s own part ∅, its centroid all three; each view\'s parts by index (Z: own ∅ · W: own {a, c} · Z again: own ∅); total [Z, Z]; not a pocket (a view is total)', J(R.own) === J([]) && J(R.centroid) === J(['a', 'b', 'c']) && J(R.perView.map((p) => p.own)) === J([[], ['a', 'c'], []]) && J(R.total) === J(['Z', 'Z']) && R.pocket === false, J(R));
  const Pk = SO.readValues(SO.valuesOf(['a', 'b'], [{ view: 'Z', composedTo: new Set(['a']) }, { view: 'W', composedTo: new Set(['b']) }]), ['a', 'b'], ['Z', 'W']);
  check('§i POCKET FROM THE FAMILY ALONE (D8, D9 said once): two views, no value empty, no view total — every view leaves something, nothing is left by all', Pk.pocket === true && Pk.own.length === 0 && Pk.total.length === 0, J(Pk));
}
check('§i §c\'s POCKET read from its family: V(x1 ≡ y1) = {Z}, V(x2 ≡ y2) = {W}, no total view — the state POCKET; and the `closed` FLAG reads true there (nothing own, no light) where D18\'s CLOSED (some view total, §9.20) reads false — THE BUILT TOKEN STANDS (the mothership\'s 10:49 §1) and the difference is said here, not hidden; the STATE token agrees with D18', J([...pocket.values]) === J([['IS|x1|y1', ['Z']], ['IS|x2|y2', ['W']]]) && pocket.total.length === 0 && pocket.state === 'POCKET' && pocket.closed === true, J({ values: [...pocket.values], total: pocket.total, state: pocket.state, closed: pocket.closed }));
const exh = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+']], [{ view: 'Z', faceId: 'f1', xz: [['IS', 'x1', 'z1', '+'], ['IS', 'x2', 'z2', '+']], zy: [['IS', 'z1', 'y1', '+'], ['IS', 'z2', 'y2', '+']], triads: [], verdicts: [] }], []);
check('§i EXHAUSTED by D18 (§9.20): instances exist, no value empty, Z total, a light stands (x2 → z2 → y2 with nothing given on X–Y) — the token EXHAUSTED, the flag false', exh.state === 'EXHAUSTED' && exh.own.length === 0 && J(exh.total) === J(['Z']) && exh.views[0].lights.length === 1 && exh.closed === false, J({ state: exh.state, total: exh.total, lights: exh.views[0].lights.length }));
const clo = SO.sortFromRecords(['X', 'Y'], [['IS', 'x1', 'y1', '+']], [{ view: 'Z', faceId: 'f1', xz: [['IS', 'x1', 'z1', '+']], zy: [['IS', 'z1', 'y1', '+']], triads: [], verdicts: [] }], []);
check('§i CLOSED by D18 (§9.20): no value empty, Z total, no light — the token CLOSED and the flag true', clo.state === 'CLOSED' && J(clo.total) === J(['Z']) && clo.closed === true, J({ state: clo.state, total: clo.total }));
check('§i WITH NO VIEW every value is empty (all own, nothing total): the VACUOUS site\'s one instance has V = ∅ and no view is total; the UNDETECTED site\'s family is empty', J(vac.values.get('IS|x1|y1')) === J([]) && vac.total.length === 0 && undet.values.size === 0 && undet.total.length === 0);
// F-D18 — the run-2 saves (the customer side's ta2/saves/g2_verdicts.json · g2_verdicts_A.json, tracked beside the reports): every card's
// state, its own line and each view's, its total views and its pocket flag, RECOMPUTED FROM THE FAMILY OF VALUES ALONE, equal the cards' —
// and the family itself is re-derived here from the PATHS (a view is in V(i) iff one of its COMPOSED paths composes onto i's key; these saves
// hold no converse equation, so a direct key is the instance's own key), never read off `values`: two readers, one object
{
  const saves = ['g2_verdicts.json', 'g2_verdicts_A.json'].map((n) => path.join(repoRoot, '.handoff/REPORTS_CUSTOMER-SIDE_2026-09-28/saves/ta2/saves', n));
  if (saves.every((p) => fs.existsSync(p))) {
    let cards = 0; let viewsN = 0; let withValues = 0; const pockets = []; const departures = [];
    for (const p of saves) {
      const w = parseWorkspaceImport(JSON.parse(fs.readFileSync(p, 'utf8')));
      const rules = w.rules ?? []; const facts = { converses: w.converses ?? [], opaque: w.opaque ?? [] };
      for (const shape of Object.values(w.shapes)) {
        const label = (v) => (shape.vertices[v] && shape.vertices[v].data && shape.vertices[v].data.label) || v;
        for (const e of shape.edges) {
          const s = SO.sortingOf(shape, e, {}, rules, facts);
          if (!s) continue;
          cards += 1; viewsN += s.views.length;
          const keys = s.instances.map(SO.relKey);
          const fromPaths = new Map(keys.map((k) => [k, s.views.filter((v) => v.paths.some((r) => r.reading === 'COMPOSED' && (r.directs ?? [r.direct]).includes(k))).map((v) => v.view).filter((z, i, a) => a.indexOf(z) === i)]));
          const own = keys.filter((k) => fromPaths.get(k).length === 0);
          const perViewOwn = s.views.map((v) => keys.filter((k) => !fromPaths.get(k).includes(v.view)));
          const total = s.views.map((v) => v.view).filter((z) => keys.every((k) => fromPaths.get(k).includes(z)));
          const pocketV = s.views.length >= 2 && keys.length > 0 && own.length === 0 && total.length === 0;
          const light = s.views.some((v) => v.lights.length > 0);
          const stateV = s.instances.length === 0 && s.bars.length === 0 ? 'UNDETECTED' : !s.looked ? 'VACUOUS' : s.unruled ? 'UNRULED' : pocketV ? 'POCKET' : own.length === 0 && keys.length > 0 ? (light ? 'EXHAUSTED' : 'CLOSED') : s.coherent ? 'COHERENT' : 'OPEN';
          if (keys.some((k) => fromPaths.get(k).length > 0)) withValues += 1;
          if (pocketV) pockets.push(`${label(e.vertexIds[0])}–${label(e.vertexIds[1])}`);
          const dep = [];
          if (J([...s.values]) !== J([...fromPaths])) dep.push('values');
          if (J(s.own) !== J(own)) dep.push('own');
          if (J(s.views.map((v) => v.own)) !== J(perViewOwn)) dep.push('view own');
          if (J(s.total) !== J(total)) dep.push('total');
          if ((s.state === 'POCKET') !== pocketV) dep.push('pocket');
          if (s.state !== stateV) dep.push(`state ${s.state} vs ${stateV}`);
          if (dep.length) departures.push(`${path.basename(p)} ${shape.name || shape.id} ${label(e.vertexIds[0])}–${label(e.vertexIds[1])}: ${dep.join(', ')}`);
        }
      }
    }
    note(`F-D18: ${cards} cards · ${viewsN} views · ${withValues} cards with a non-empty value · pockets ${J(pockets)} · departures ${departures.length}`);
    check(`§i ★★ F-D18 ON THE RUN-2 SAVES: every card's state, its own line and each view's, its total views and its pocket flag, recomputed from the family of values alone — the family itself re-derived from the PATHS — equal the cards' (${cards} cards, ${viewsN} views; the one POCKET among them named in the note), ZERO departures`, cards === 792 && departures.length === 0, departures.slice(0, 6).join(' ⏎ '));
  } else note('the run-2 saves are not beside the reports on this checkout — F-D18 skipped here');
}

console.log(`\n${failures === 0 ? 'DIAGNOSE-MODES1-THE-SORTING: ALL PASS — under IS ; IS = IS the view\'s kinds are the stone\'s and the loop is the face reading\'s, role for role on the 42 hand triples; verdicts, rules and exceptions read as ruled; the states read as defined; triads alone are lights, never instances; the face reading reads through the one reader; the surface names roles and is silent only where no path exists' : `DIAGNOSE-MODES1-THE-SORTING: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
