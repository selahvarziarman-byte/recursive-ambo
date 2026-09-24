#!/usr/bin/env node

// DIAGNOSTIC — THE CARGO ON THE WALK (STAMP C-11b, 2026-09-24; §135 — the ground ruling §23 (ratified §132) + §24 option A
// (ratified §134); the surface the designer's 1500 §2 + 1508 + 1520). The person enters a room he built from a lifted form
// carrying a ROLE of one of its corners; a door he glued carries it by that door's transport at the corner it is at (C-11a's
// e_c), or not; inside the cell ONLY HE moves it, along a rod, by the rod's J on the carried record; home, he reads Fix · Mov ·
// Und with the reduced route; away, identity and presence by the route. THE REFERENCE, cited not re-derived: the researcher's
// cargo_in_the_room.py (RESULTS_2026-09-24_cargo_in_the_room.txt — door_home amended after run 1). src/manuscript/cargoModel.ts
// is THE SECOND IMPLEMENTATION: §1 pins K1–K7 NUMBER FOR NUMBER on the reference's fixtures (the prism of two first faces over
// the 42 hand triples, the translation door with the largest lawful transport built line by line — the person's stand-in).
//
// §1 THE FIXTURES — K1 the reverse walk is the inverse map · K2 curvature through the door (a cargo home MOVED) · K3 presence
//    route-dependent · K4 identity route-dependent · K5 a spur moves nothing · K6 the room's T³ control silent · K7 the total
//    flat control silent; the reading's words on a K2 room.
// §2 THE LAWFUL PATH — the residue at A lifted from gen 1, the hinge door with C-11a's transport (F1's whole line), the room
//    built and its cell surface read; the cargo's room from the built record and the carried record: the entry corner, the
//    rods by the seed's edges, the faces by their corners, the door by the row's correspondence and transport; the walks —
//    F1 out along a rod, through the door, home along a rod (Fix, the reduced word); F2 the same route, lost at the door
//    (away, by the route); a cargo left behind by a face that does not hold its corner; a spur that returns; a rod the J does
//    not carry — broke, withdrawable by its one hand; the walker's word going on after a loss (a spur told from a residue).
// §3 THE SURFACE — the window's fourth seam field, the crossing hook at BOTH crossing sites, the line mounted once beside the
//    sentence, the legend's clause; the view hands the walk its room from the built record; the reading's words per state;
//    purity and the manifest row.
//
// ⛔ RECORD, NOT READING: nothing here stores a route or a verdict; every reading is re-derived at the read.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText, filename);
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const J = (x) => JSON.stringify(x);

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);

const C = req('src/manuscript/cargoModel.ts');
const D = req('src/manuscript/doorTransportModel.ts');
const { spaceOf, composedOn, nameIn } = req('src/lib/spaceOf.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const A = req('src/manuscript/apertureModel.ts');

console.log('THE CARGO ON THE WALK — a role carried through the doors he glued and along the rods by his hand; home Fix · Mov · Und by the reduced word; the reference\'s K1–K7 reproduced (C-11b)\n');

const inv = (m) => { const o = new Map(); for (const [k, v] of m) o.set(v, k); return o; };
const toMap = (o) => new Map(Object.entries(o));
const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json');
const sameSet = (a, b) => a.length === b.length && a.every((v) => b.includes(v));

// ═══ §1 THE FIXTURES — the reference's K1–K7 ═══
console.log('----- §1 the fixtures: the prism of two first faces (bottom X, top Y over the 42 hand triples), the translation door with the largest lawful transport built line by line — the reference\'s K1–K7 -----');
const HAND_TF = { A: { r9: 'F8', r1: 'F7', r0: 'F1', r2: 'F12', r8: 'F13' }, "B'": { r9: 'F3', r1: 'F9', r0: 'F5', r7: 'F13', r8: 'F1', r2: 'F7' }, C: { r9: 'F12', r1: 'F13', r0: 'F9', r6: 'F1', r2: 'F3' }, D: { r9: 'F12', r1: 'F1', r0: 'F2', r7: 'F7', r2: 'F5' }, S1: { r0: 'F13', r1: 'F9', r2: 'F1', r4: 'F12', r6: 'F3', r8: 'F7' }, S4: { r0: 'F13', r1: 'F9', r2: 'F1', r6: 'F3', r7: 'F5', r8: 'F7' }, S2: { r0: 'F9', r1: 'F3', r2: 'F13', r6: 'F10', r7: 'F5', r8: 'F12' } };
const HAND_TP = { P: { r0: 'Φ1', r1: 'Φ2', r2: 'Φ7', r4: 'Φ5', r6: 'Φ3' }, Q: { r9: 'Φ6', r1: 'Φ1', r0: 'Φ8', r7: 'Φ5', r6: 'Φ2' }, R: { r0: 'Φ1', r1: 'Φ6', r7: 'Φ5', r2: 'Φ7', r4: 'Φ8' } };
const J_FP = { '(i)': { F7: 'Φ1', F8: 'Φ2', F5: 'Φ7' }, '(ii)': { F1: 'Φ3', F2: 'Φ2', F3: 'Φ4', F5: 'Φ1' } };
const casts = [flow, tcell, phi];
const ids = casts.map((c) => c.roles.map((r) => r.id));
// the reference's triple order: (tf, tp, fp) — face J's F→T = inv(HAND_TF), T→P = HAND_TP, P→F = inv(J_FP)
const triples = [];
for (const tf of Object.keys(HAND_TF)) for (const tp of Object.keys(HAND_TP)) for (const fp of Object.keys(J_FP)) triples.push({ name: `${tf}+${tp}+${fp}`, J: [inv(toMap(HAND_TF[tf])), toMap(HAND_TP[tp]), inv(toMap(J_FP[fp]))] });
// the largest lawful door transport built line by line (the reference's given_door — the person's stand-in, one lawful choice among many)
const linePairMap = (la, lb, q, k) => { const e = Array.from({ length: k }, () => new Map()); la.nodes.forEach(([c, x], p) => { const [c2, y] = la.kind === 'path' ? lb.nodes[p] : lb.nodes[(p + q * k) % lb.nodes.length]; if (c !== c2) throw new Error('a line pair off its corners'); e[c].set(x, y); }); return e; };
const givenDoor = (JY, JX, corners) => {
  const LY = D.linesOf(JY, corners).lines; const LX = D.linesOf(JX, corners).lines;
  const e = [0, 1, 2].map(() => new Map()); const used = new Set();
  for (const ly of LY) for (let j = 0; j < LX.length; j += 1) { const lx = LX[j]; if (used.has(j) || lx.shape !== ly.shape) continue; linePairMap(ly, lx, 0, 3).forEach((m, c) => { for (const [x, y] of m) e[c].set(x, y); }); used.add(j); break; }
  if (!D.lawful(e, JY, JX)) throw new Error('the given door is not lawful');
  return e;
};
const BOT = ['F', 'T', 'P']; const TOP = ["F'", "T'", "P'"];
const roomOf = (JX, JY, e, roleIds) => {
  const Jmap = new Map();
  const link = (a, b, m) => { Jmap.set(`${a}|${b}`, m); Jmap.set(`${b}|${a}`, inv(m)); };
  for (let i = 0; i < 3; i += 1) { link(BOT[i], BOT[(i + 1) % 3], JX[i]); link(TOP[i], TOP[(i + 1) % 3], JY[i]); link(BOT[i], TOP[i], new Map(roleIds[i].map((r) => [r, r]))); }
  const roles = {}; BOT.forEach((c, i) => { roles[c] = roleIds[i].map((id) => ({ id })); roles[TOP[i]] = roleIds[i].map((id) => ({ id })); });
  return C.cargoRoomFrom({
    corners: [...BOT, ...TOP], entry: 'F', roles,
    J: (from, to) => Jmap.get(`${from}|${to}`) ?? null,
    rods: [{ a: 'F', b: 'T' }, { a: 'T', b: 'P' }, { a: 'P', b: 'F' }, { a: "F'", b: "T'" }, { a: "T'", b: "P'" }, { a: "P'", b: "F'" }, { a: 'F', b: "F'" }, { a: 'T', b: "T'" }, { a: 'P', b: "P'" }],
    faces: [{ corners: TOP, name: "F'·T'·P'" }, { corners: BOT, name: 'F·T·P' }], // face 0 the top = the door's faceA (exit, side a → the bottom); face 1 the bottom (side b)
    doors: [{ a: TOP, b: BOT, e }],
  });
};
// a path: rods by their far corner, the door by its face and side; the transport of every role of the start corner
const carry = (room, path, corner, role) => {
  let st = C.pickCargo(room, corner, role);
  for (const step of path) {
    if (!st.at) break;
    st = step.rod !== undefined ? C.stepRod(room, st, step.rod) : C.crossDoor(room, st, step.face, { pair: 0, side: step.side });
  }
  return st;
};
const transport = (room, path, corner, roleIds) => { const h = new Map(); for (const r of roleIds) { const st = carry(room, path, corner, r); if (st.at) h.set(r, st.at); } return h; };
const DOOR = [{ rod: "F'" }, { face: 0, side: 'a' }];
const SIDE = [{ rod: 'T' }, { rod: "T'" }, { face: 0, side: 'a' }, { rod: 'F' }];
const SPURRED = [{ rod: 'T' }, { rod: 'F' }, { rod: "F'" }, { face: 0, side: 'a' }];
const reverseOf = (path, endCorner, room) => {
  // the reverse walk: the corners visited, back to front; a door crossed top→bottom (side a at the top face) is re-crossed bottom→top (side b at the bottom face)
  const corners = ['F']; let at = 'F';
  for (const s of path) { if (s.rod !== undefined) at = s.rod; else { const d = room.doors[0]; at = s.side === 'a' ? d.b[d.a.indexOf(at)] : d.a[d.b.indexOf(at)]; } corners.push(at); }
  const out = []; let cur = endCorner;
  for (let i = path.length - 1; i >= 0; i -= 1) { const s = path[i]; const prevCorner = corners[i]; if (s.rod !== undefined) out.push({ rod: prevCorner }); else out.push({ face: s.side === 'a' ? 1 : 0, side: s.side === 'a' ? 'b' : 'a' }); cur = prevCorner; }
  void cur;
  return out;
};
const bad = { K1: 0, K5: 0, K6moved: 0, K6lost: 0 }; const hit = { K2: 0, K3: 0, K4: 0, spurLost: 0, K6n: 0, doorEmptyAtF: 0 }; const ex = {};
const t0 = Date.now();
for (const X of triples) for (const Y of triples) {
  const e = givenDoor(Y.J, X.J, ids);
  const room = roomOf(X.J, Y.J, e, ids);
  const F = ids[0];
  const hd = transport(room, DOOR, 'F', F); const hs = transport(room, SIDE, 'F', F);
  // K1 — the reverse walk is the inverse map, on four paths
  for (const p of [DOOR, SIDE, [{ rod: 'T' }, { rod: 'P' }, { rod: 'F' }], [{ rod: "F'" }, { rod: "P'" }, { face: 0, side: 'a' }, { rod: 'F' }]]) {
    const h = transport(room, p, 'F', F);
    const endCorner = h.size ? [...h.values()][0].corner : 'F';
    const rp = reverseOf(p, endCorner, room);
    const endRoles = room.rolesAt(endCorner).map((r) => r.id);
    const hr = transport(room, rp, endCorner, endRoles);
    for (const [a, v] of h) { const back = hr.get(v.role); if (!back || back.corner !== 'F' || back.role !== a) bad.K1 += 1; }
    for (const [b, v] of hr) { const fwd = h.get(v.role); if (v.corner !== 'F' || !fwd || fwd.role !== b) bad.K1 += 1; }
  }
  const mov = [...hd].some(([a, v]) => v.role !== a);
  if (mov) hit.K2 += 1;
  const pres = J([...hd.keys()].sort()) !== J([...hs.keys()].sort());
  const ident = [...hd].some(([a, v]) => hs.has(a) && hs.get(a).role !== v.role);
  if (pres) hit.K3 += 1;
  if (ident) hit.K4 += 1;
  const hsp = transport(room, SPURRED, 'F', F);
  for (const [a, v] of hsp) { const d = hd.get(a); if (!d || d.role !== v.role) bad.K5 += 1; }
  if ([...hd.keys()].some((a) => !hsp.has(a))) hit.spurLost += 1;
  if (e[0].size === 0) hit.doorEmptyAtF += 1;
  if (X.name === Y.name) { hit.K6n += 1; if (mov) bad.K6moved += 1; if (hd.size !== F.length) bad.K6lost += 1; }
  if (mov && !ex.K2) ex.K2 = { X: X.name, Y: Y.name, moved: [...hd].filter(([a, v]) => v.role !== a).map(([a, v]) => [a, v.role]).sort((p, q) => (p[0] < q[0] ? -1 : p[0] > q[0] ? 1 : 0)).slice(0, 3), room }; // the reference's sample: sorted by string, the first three
  if (pres && !ex.K3) ex.K3 = { X: X.name, Y: Y.name, differ: [...new Set([...hd.keys(), ...hs.keys()])].filter((a) => hd.has(a) !== hs.has(a)).sort().slice(0, 4) };
  if (ident && !ex.K4) ex.K4 = { X: X.name, Y: Y.name, differ: [...hd].filter(([a, v]) => hs.has(a) && hs.get(a).role !== v.role).map(([a, v]) => [a, v.role, hs.get(a).role]).slice(0, 2) };
}
// K7 — the total flat control: random bijections on five roles, X = Y, the door the identity (a seeded generator; the reference's Python seed is not reproducible in JS — the pins are 0, 0, 0)
let seed = 351; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const K7 = { moved: 0, lost: 0, disagree: 0 };
const five = [0, 1, 2, 3, 4].map(String);
for (let t = 0; t < 2000; t += 1) {
  const Jr = [0, 1, 2].map(() => { const p = [...five]; for (let i = p.length - 1; i > 0; i -= 1) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } return new Map(five.map((x, i) => [x, p[i]])); });
  const e = givenDoor(Jr, Jr, [five, five, five]);
  const room = roomOf(Jr, Jr, e, [five, five, five]);
  const hd = transport(room, DOOR, 'F', five); const hs = transport(room, SIDE, 'F', five);
  if ([...hd].some(([a, v]) => v.role !== a)) K7.moved += 1;
  if (hd.size !== 5) K7.lost += 1;
  if (J([...hd].map(([a, v]) => [a, v.role]).sort()) !== J([...hs].map(([a, v]) => [a, v.role]).sort())) K7.disagree += 1;
}
note(`1764 rooms in ${Date.now() - t0} ms: K1 failures ${bad.K1} · K2 moved ${hit.K2} · K3 presence differs ${hit.K3} · K4 identity differs ${hit.K4} · K5 spur moved ${bad.K5} (spur loses a cargo the door loop delivers: ${hit.spurLost}) · K6 (${hit.K6n} rooms) moved ${bad.K6moved} lost ${bad.K6lost} · K7 (2000) moved ${K7.moved} lost ${K7.lost} disagree ${K7.disagree} · door empty at F ${hit.doorEmptyAtF}`);
note(`e.g. K2 ${J([ex.K2 && ex.K2.X, ex.K2 && ex.K2.Y, ex.K2 && ex.K2.moved])} · K3 ${J(ex.K3)} · K4 ${J(ex.K4)}`);
check('§1 ★★ K1 — COMPOSITION IS A FUNCTOR ON THE WALK: a walk and its reverse compose to inverse maps (the door loop, the side loop, the bottom triangle, the top-and-door path — every role, both ways): 0 failures', bad.K1 === 0, bad.K1);
check('§1 ★★ K2 — CURVATURE THROUGH THE DOOR: the door loop at F (F → F′ → the door → F) brings a cargo home MOVED in 1,694 of 1,764 rooms — the reference\'s number; e.g. X = A+P+(i), Y = A+P+(ii): F10 ↦ F6 · F11 ↦ F9 · F14 ↦ F10', hit.K2 === 1694 && ex.K2 && ex.K2.X === 'A+P+(i)' && ex.K2.Y === 'A+P+(ii)' && J(ex.K2.moved) === J([['F10', 'F6'], ['F11', 'F9'], ['F14', 'F10']]), J([hit.K2, ex.K2 && [ex.K2.X, ex.K2.Y, ex.K2.moved]]));
check('§1 ★★ K3 — PRESENCE ROUTE-DEPENDENT: the door loop and the side loop (F → T → T′ → the door → T → F), both once round the room, disagree on WHICH cargos arrive in 1,764 of 1,764 rooms — the reference\'s number; e.g. A+P+(i) against itself: F10 · F11 · F14 · F2', hit.K3 === 1764 && ex.K3 && J(ex.K3.differ) === J(['F10', 'F11', 'F14', 'F2']), J([hit.K3, ex.K3]));
check('§1 ★★ K4 — IDENTITY ROUTE-DEPENDENT: the same two loops both deliver a cargo AS DIFFERENT ROLES in 803 of 1,764 rooms — the reference\'s number; e.g. X = A+P+(i), Y = B′+Q+(ii): F12 arrives as F10 by the door loop and as F13 by the side loop', hit.K4 === 803 && ex.K4 && ex.K4.X === 'A+P+(i)' && ex.K4.Y === "B'+Q+(ii)" && J(ex.K4.differ) === J([['F12', 'F10', 'F13']]), J([hit.K4, ex.K4]));
check('§1 ★★ K5 — A SPUR NEVER MOVES A CARGO: inserting F → T → F into the door loop only RESTRICTS it (0 failures), and in 1,764 rooms the spur loses a cargo the door loop delivers — the reference\'s numbers', bad.K5 === 0 && hit.spurLost === 1764, J([bad.K5, hit.spurLost]));
check('§1 ★★ K6 — CONTROL, the room\'s T³ (X = Y, the door the identity — 42 rooms): the door loop returns every role of F unchanged — 0 moved · 0 lost', hit.K6n === 42 && bad.K6moved === 0 && bad.K6lost === 0, J([hit.K6n, bad.K6moved, bad.K6lost]));
check('§1 ★★ K7 — CONTROL, total and flat (2,000 rooms of random bijections, X = Y, the door the identity): nothing moved, nothing lost, the two loops never disagree — 0 · 0 · 0', K7.moved === 0 && K7.lost === 0 && K7.disagree === 0, J(K7));
check('§1 rooms whose given door carries nothing at F: 0 of 1,764 — the reference\'s number', hit.doorEmptyAtF === 0, hit.doorEmptyAtF);
// the words on the K2 room
{
  const room = ex.K2.room;
  const st = carry(room, DOOR, 'F', 'F10');
  const r = C.cargoReading(room, st);
  const away = C.cargoReading(room, carry(room, [{ rod: "F'" }], 'F', 'F10'));
  const spurHome = C.cargoReading(room, carry(room, [{ rod: "F'" }, { rod: 'F' }], 'F', 'F10'));
  note(`K2 words: ${r.words} · away ${away.words} · spur home ${spurHome.words}`);
  check('§1 ★ THE READING ON A K2 ROOM, in the designer\'s words: home after the door loop `carrying F10 — returned as F6 by F–F′ · a` (Mov, the reduced route printed); away after one rod `carrying F10 — at the corner F′, came along F–F′ as F10`; out and back along one rod `returned to itself — the route reduces to nothing`',
    r.state === 'home-mov' && r.words === "carrying F10 — returned as F6 by F–F' · a" && away.state === 'away' && away.words === "carrying F10 — at the corner F', came along F–F' as F10" && spurHome.state === 'home-fix' && spurHome.words === 'carrying F10 — returned to itself — the route reduces to nothing', J([r, away.words, spurHome.words]));
}

// ═══ §2 THE LAWFUL PATH ═══
console.log('\n----- §2 the lawful path: the residue at A lifted from gen 1, the hinge door with F1\'s whole line (C-11a), the room built; the cargo\'s room from the built record and the carried record; the walks -----');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
let seeded = createSeedShape('tetrahedron');
for (const [label, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', phi]]) seeded = withCast(seeded, byLabel(seeded, label), c);
useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {} });
S().applyAmboDissectionToCurrent();
const G1id = cur().id;
const give = (X, Y, map) => { const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y)); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
const giveWord = (X, Y, s, t) => { const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y)); if (e.vertexIds[0] === byLabel(cur(), X)) S().giveWordPair(e.id, s, t); else S().giveWordPair(e.id, t, s); };
give('A', 'B', { F1: 'r0', F5: 'r2', F7: 'r8' }); giveWord('A', 'B', 'sustains', 'sustains');
give('A', 'C', { F1: 'Φ1', F7: 'Φ3' });
S().selectCell(cur().cells.find((x) => x.kind === 'core').id);
S().applyAmboDissectionToCurrent();
const bornPairOn = (X, Y) => {
  const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y));
  const R0 = spaceOf(cur(), e.vertexIds[0]); const R1 = spaceOf(cur(), e.vertexIds[1]);
  const c = composedOn(cur(), R0, R1, [e.vertexIds[0], e.vertexIds[1]], 'medial');
  const dom = new Set(c.roles.map(([x]) => x)); const im = new Set(c.roles.map(([, y]) => y));
  for (const x of R0.space.roles.map((r) => r.id).filter((id) => !dom.has(id))) for (const y of R1.space.roles.map((r) => r.id).filter((id) => !im.has(id))) {
    S().giveRolePair(e.id, x, y);
    if (cur().edges.find((f) => f.id === e.id).identification?.roles.some(([a, b]) => a === x && b === y)) return `${nameIn(R0.space, x)} ↦ ${nameIn(R1.space, y)}`;
    S().withdrawMidpointAttempt(e.id);
  }
  return null;
};
note(`the born pair on AB–AC: ${bornPairOn('AB', 'AC')}`);
S().selectShape(G1id); S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection();
S().selectCell(cur().cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(byLabel(cur(), 'A')) && c.vertexIds.length === 4).id);
const before = useLiftStore.getState().queue.length;
S().liftSelectionToManuscript();
const file = useLiftStore.getState().queue[before].file;
const entry = loadUniverseSnapshot(file);
const form = placeShelfEntry(entry, 0);
const shape = form.shape;
const lab = (v) => shape.vertices[v]?.data.label || v;
const menu = A.boundaryFacesOf(shape);
const faceWith = (set) => menu.find((m) => { const t = m.label.split(' · ')[0].split('·'); return t.length === set.length && set.every((x) => t.includes(x)); });
const fA = faceWith(['A', 'AB', 'AC']); const fB = faceWith(['A', 'AB', 'AD']);
const cands = A.dihedralMapCandidates(shape, fA.id, fB.id);
const hinge = cands.find((c) => c.correspondence.every(([a, b]) => lab(a) === lab(b) || (lab(a) === 'AC' && lab(b) === 'AD')));
const record = entry.loaded.ancestors[0];
const cycleA = hinge.correspondence.map(([a]) => a); const cycleB = hinge.correspondence.map(([, b]) => b);
const memo = new Map();
const SA = D.sideOf(record, cycleA, memo, fA.label.split(' · ')[0]); const SB = D.sideOf(record, cycleB, memo, fB.label.split(' · ')[0]);
const act = D.actAt(SA.side, SB.side, [], 0, 'F1', 'F1');
const rows = [{ faceA: fA.id, faceB: fB.id, candidateKey: hinge.key, transports: act.transports }, { faceA: null, faceB: null, candidateKey: null }];
const verdict = A.buildPersonDomainVerdict(shape, rows, 'built-1', 'built 3-manifold 1');
const surface = A.readCellSurface(verdict.domain, false);
const room = C.cargoRoomOf(shape, entry.loaded.ancestors ?? [], rows, surface);
const idOf = (label) => byLabel(shape, label);
const faceIndexOf = (labels) => surface.faces.findIndex((f) => f.corners && sameSet(f.corners.map(lab), labels));
const doorFace = faceIndexOf(['A', 'AC', 'AB']);
note(`the room: ${surface.faces.length} faces (${surface.faces.map((f) => `${(f.corners || []).map(lab).join('·')}${f.door ? `=${f.door.pair}${f.door.side}` : ''}`).join(' ')}) · ${surface.rods.length} rods (${surface.rods.map((r) => (r.ends ? r.ends.map(lab).join('–') : '?')).join(' ')}) · entry ${room && lab(room.entry)} · door a ${room && room.doors[0] && room.doors[0].a.map(lab).join('·')} → ${room && room.doors[0] && room.doors[0].b.map(lab).join('·')} · e sizes ${room && room.doors[0] && room.doors[0].e.map((m) => m.size)}`);
check('§2 ★★ THE CARGO\'S ROOM from the built record and the carried record: the residue\'s four faces carry their corners and its six rods their ends (C-11b\'s additive fields on the cell surface); the entry corner is A (the first in D14 order); the one door pairs A · AC · AB with A · AD · AB (the candidate\'s order) and its transport holds ONE pair at each of the three corners (F1\'s whole line from C-11a); the crossed face A·AC·AB is the door\'s side a',
  room !== null && surface.faces.length === 4 && surface.faces.every((f) => f.corners && f.corners.length === 3) && surface.rods.length === 6 && surface.rods.every((r) => r.ends) && lab(room.entry) === 'A' && room.doors.length === 1 && room.doors[0] && J(room.doors[0].a.map(lab)) === J(['A', 'AC', 'AB']) && J(room.doors[0].b.map(lab)) === J(['A', 'AD', 'AB']) && room.doors[0].e.every((m) => m.size === 1) && doorFace >= 0 && surface.faces[doorFace].door && surface.faces[doorFace].door.pair === 0 && surface.faces[doorFace].door.side === 'a',
  J({ room: room !== null, faces: surface.faces.length, rods: surface.rods.length, entry: room && lab(room.entry), doorFace, door: doorFace >= 0 && surface.faces[doorFace].door }));
const words = (st) => C.cargoReading(room, st);
const pick = words(null);
check('§2 ★ THE PICK at the entry corner: `carry from the corner A:` with A\'s 14 flow roles in the caster\'s order (F1 first), no line yet', pick.state === 'pick' && pick.pickWords === 'carry from the corner A:' && pick.picks.length === 14 && pick.picks[0].name === 'F1' && pick.words === '' && pick.rods.length === 0, J(pick));
let st = C.pickCargo(room, room.entry, 'F1');
const carrying = words(st);
note(`carrying: ${carrying.words} · rods ${J(carrying.rods.map((r) => r.words))}`);
check('§2 ★ CARRYING at the entry corner: `carrying F1 — at the corner A`, the rods from A listed by their two corners in the cell\'s own order — A–AC · A–AB · A–AD (nothing lit, nothing marked as carrying or losing)', carrying.state === 'carrying' && carrying.words === 'carrying F1 — at the corner A' && J(carrying.rods.map((r) => r.words).sort()) === J(['A–AB', 'A–AC', 'A–AD']) && carrying.hand === null, J(carrying));
st = C.stepRod(room, st, idOf('AC'));
const afterRod = words(st);
check('§2 ★★ THE PERSON\'S PRESS along A–AC: the cargo arrives by the rod\'s J (the corner edge\'s carried coprojection — F1 becomes AC\'s own class `Φ1 ≡ F1`): `carrying F1 — at the corner AC, came along A–AC as Φ1 ≡ F1`; the rods from AC offered', afterRod.state === 'away' && afterRod.words === 'carrying F1 — at the corner AC, came along A–AC as Φ1 ≡ F1' && afterRod.rods.length === 3, J(afterRod));
st = C.crossDoor(room, st, doorFace, { pair: 0, side: 'a' });
const afterDoor = words(st);
check('§2 ★★ THE WALK\'S CROSSING of the door at AC → AD: the transport at that corner carries `Φ1 ≡ F1 ↦ F1` — `carrying F1 — at the corner AD as F1, by A–AC · a` (identity AND position by the route printed; the route carries the rod step beside the door letter)', afterDoor.state === 'away' && afterDoor.words === 'carrying F1 — at the corner AD as F1, by A–AC · a' && afterDoor.route === 'A–AC · a', J(afterDoor));
st = C.stepRod(room, st, idOf('A'));
const home = words(st);
check('§2 ★★ HOME — Fix: along AD–A the coprojection\'s inverse carries F1 back to A itself — `carrying F1 — returned to itself by A–AC · a · AD–A` (the reduced route printed; the walk closed at its starting corner)', home.state === 'home-fix' && home.words === 'carrying F1 — returned to itself by A–AC · a · AD–A', J(home));
// F2: the same route, lost at the door
let s2 = C.pickCargo(room, room.entry, 'F2');
s2 = C.stepRod(room, s2, idOf('AC'));
const f2AtAC = words(s2);
s2 = C.crossDoor(room, s2, doorFace, { pair: 0, side: 'a' });
const lostAway = words(s2);
note(`F2: ${f2AtAC.words} → ${lostAway.words} · picks again ${lostAway.pickWords} (${lostAway.picks.length})`);
check('§2 ★★ REFUSED BY THE DOOR — presence by the route: F2 rides A–AC as itself, and the door at AC does not carry it (the transport holds F1\'s line alone): `carrying F2 — not here by A–AC · a: lost at the door a, which does not carry it` — away (the door\'s net count is one); the picks return: `carry again from the corner A:`', f2AtAC.words === 'carrying F2 — at the corner AC, came along A–AC as F2' && lostAway.state === 'lost-door' && lostAway.words === 'carrying F2 — not here by A–AC · a: lost at the door a, which does not carry it' && lostAway.pickWords === 'carry again from the corner A:' && lostAway.picks.length === 14, J(lostAway));
// the walker goes on: crossing back (side b at the partner face) cancels the letter — the loss is a RESIDUE at home
const partnerFace = faceIndexOf(['A', 'AB', 'AD']);
const s2back = C.crossDoor(room, s2, partnerFace, { pair: 0, side: 'b' });
const lostHome = words(s2back);
// and a spur: the cargo at A (a corner of the door face) lost at the first crossing — e_A holds F1's pair alone — then the walker back through the door: the route a · A reduces to nothing
let s3 = C.pickCargo(room, room.entry, 'F2');
s3 = C.crossDoor(room, s3, doorFace, { pair: 0, side: 'a' });
const s3back = C.crossDoor(room, s3, partnerFace, { pair: 0, side: 'b' });
const lostSpur = words(s3back);
note(`after the walker crosses back: ${lostHome.words} · the spur: ${lostSpur.words}`);
check('§2 ★★ A SPUR TOLD FROM A RESIDUE BY THE REDUCED WORD: the walker\'s word goes on after the loss — crossing back through the partner face cancels the letter: with the rod step standing the loss reads `carrying nothing — F2 did not return: lost around A–AC, at the door a, which does not carry it` (home by the door count); lost at the first crossing from A itself (e_A holds F1\'s pair alone) and the walker back through the door, the route a · A reduces to nothing: `carrying nothing — F2 did not return: a spur — the route reduces to nothing; lost at the door a, which does not carry it`',
  lostHome.state === 'lost-door' && lostHome.words === 'carrying nothing — F2 did not return: lost around A–AC, at the door a, which does not carry it' && lostSpur.state === 'lost-spur' && lostSpur.words === 'carrying nothing — F2 did not return: a spur — the route reduces to nothing; lost at the door a, which does not carry it', J([lostHome.words, lostSpur.words]));
// left behind: the cargo at AD, the walker leaves by A·AC·AB (which does not hold AD)
let s4 = C.pickCargo(room, room.entry, 'F1');
s4 = C.stepRod(room, s4, idOf('AD'));
s4 = C.crossDoor(room, s4, doorFace, { pair: 0, side: 'a' });
const stayed = words(s4);
check('§2 ★★ LEFT BEHIND (§24): the cargo carried to AD, the walker leaving by the face A·AC·AB — `carrying nothing — F1 stayed at AD, in the cell you left: the face you left by, A·AC·AB, does not hold AD` (a positive mark for a loss that is still a presence elsewhere; the face by its D14 name)', stayed.state === 'stayed' && stayed.words === 'carrying nothing — F1 stayed at AD, in the cell you left: the face you left by, A·AC·AB, does not hold AD' && stayed.pickWords === 'carry again from the corner A:', J(stayed));
// a rod the J does not carry: a C-role at AC (a cargo of AC's own — the model allows a pick anywhere; the window picks at the entry corner) along AC → A: the corner edge's inverse coprojection does not hold it
const phiAtAC = room.rolesAt(idOf('AC')).find((r) => /^Φ\d+$/.test(r.name));
let s5 = C.pickCargo(room, idOf('AC'), phiAtAC.id);
const s5b = C.stepRod(room, s5, idOf('A'));
const broke = words(s5b);
const restored = words(C.withdrawStep(s5b));
note(`a C-role ${phiAtAC.name} at AC along AC–A: ${broke.words} · hand ${broke.hand} · withdrawn: ${restored.words}`);
check('§2 ★★ BROKE AT THE ROD, withdrawable by its ONE HAND (the designer\'s 1520 §4 — the face block\'s own phrase; nothing was refused, the step was made and the J answered): a role of AC\'s own (C\'s Φ) along AC–A — `carrying nothing — Φ… broke at the rod AC–A: its J does not carry Φ…` · `here, on AC–A: withdraw this step`; the hand restores the cargo to AC and strikes the step from the route',
  broke.state === 'lost-rod' && broke.words === `carrying nothing — ${phiAtAC.name} broke at the rod AC–A: its J does not carry ${phiAtAC.name}` && broke.hand === 'here, on AC–A: withdraw this step' && restored.state === 'carrying' && restored.words === `carrying ${phiAtAC.name} — at the corner AC` && restored.route === '', J([broke, restored.words]));
check('§2 ★ A ROD THE J CARRIES moves the cargo by EXACTLY that J: along A–AC every one of A\'s 14 roles arrives as the class the corner edge\'s coprojection names (the same map bornStepOf reads), and along AC–A it comes back to itself (K1 on the record)',
  room.rolesAt(room.entry).every((r) => { const a = C.stepRod(room, C.pickCargo(room, room.entry, r.id), idOf('AC')); const Jm = room.J(room.entry, idOf('AC')); if (!a.at || a.at.role !== Jm.get(r.id)) return false; const b = C.stepRod(room, a, room.entry); return b.at && b.at.role === r.id; }));
check('§2 ★ THE FREE REDUCTION: a rod walked back cancels (A–AC · AC–A → nothing), a door re-crossed the other way cancels (a · A → nothing), and an unmatched step stays (A–AC · a · AD–A stays whole)',
  C.reduceRoute([{ kind: 'rod', from: 'x', to: 'y' }, { kind: 'rod', from: 'y', to: 'x' }]).length === 0 && C.reduceRoute([{ kind: 'door', pair: 0, side: 'a' }, { kind: 'door', pair: 0, side: 'b' }]).length === 0 && C.reduceRoute([{ kind: 'rod', from: 'x', to: 'y' }, { kind: 'door', pair: 0, side: 'a' }, { kind: 'rod', from: 'z', to: 'x' }]).length === 3);

// ═══ §3 THE SURFACE ═══
console.log('\n----- §3 the surface: the window\'s fourth seam field and the crossing hook at both sites; the line beside the sentence; the view hands the walk its room; purity; the manifest -----');
const win = readLf('src/manuscript/ExploreWindow.tsx');
const view = readLf('src/manuscript/ManuscriptView.tsx');
const model = readLf('src/manuscript/cargoModel.ts');
const aperture = readLf('src/manuscript/apertureModel.ts');
const manifest = readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt');
const countOf = (s, re) => (s.match(re) || []).length;
const froms = (src) => [...src.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
check('§3 ★★ THE WINDOW: the cargo is the seam\'s FOURTH FIELD (`cargo: CargoState | null`, `cargo: null` at the host); the crossing hook `cargoCross(exited, face.door)` stands at EXACTLY the two crossing sites, beside the letter the trace writes; the room opened resets it; the line mounts ONCE (`data-explore-cargo`) after the sentence and before the return line; the rods, the picks and the one hand are buttons; the legend gains the rod clause',
  /^  cargo: CargoState \| null;$/m.test(win) && /^      cargo: null,$/m.test(win) && countOf(win, /if \(face\.door\) cargoCross\(exited, face\.door\);/g) === 2 && countOf(win, /if \(face\.door\) seam\.trace \+= doorLetter\(face\.door\);/g) === 2 && /seam\.cargo = null;\n    cargoRef\.current = null;\n    setCargo\(null\);/.test(win) && countOf(win, /data-explore-cargo data-explore-cargo-state=/g) === 1 && win.indexOf('data-explore-cargo data-explore-cargo-state=') > win.indexOf('data-explore-sentence-text') && win.indexOf('data-explore-cargo data-explore-cargo-state=') < win.indexOf('data-explore-return\n') && countOf(win, /data-explore-cargo-rod=\{r\.to\}/g) === 1 && countOf(win, /data-explore-cargo-pick=\{p\.id\}/g) === 1 && countOf(win, /data-explore-cargo-withdraw/g) === 1 && /carry it along — move the cargo corner to corner, one rod per press/.test(win));
const readModule = readLf('src/manuscript/exploreRead.ts');
check('§3 ★ THE VIEW hands the walk its room from the BUILT RECORD (seed + rows) and the carried record by the seed\'s own shape id — since C-12a item 7 through the guarded read module: the view calls `exploreReadOf({ … built, ancestors: built ? shelfAncestors.get(built.seed.id) ?? [] : [], resolveAbsent: resolveAbsentLabel })` once and exploreRead.ts calls `cargoRoomOf(args.built.seed, args.ancestors, args.built.rows, cellSurface, args.resolveAbsent)` once (null on a room with no record); the prop passed once',
  countOf(view, /const built = builtRecords\.find\(\(r\) => r\.key === domain\.key\) \?\? null;/g) === 1 && countOf(view, /exploreReadOf\(\{/g) === 1 && /ancestors: built \? shelfAncestors\.get\(built\.seed\.id\) \?\? \[\] : \[\],/.test(view) && /resolveAbsent: resolveAbsentLabel,/.test(view) && countOf(readModule, /cargoRoomOf\(args\.built\.seed, args\.ancestors, args\.built\.rows, cellSurface, args\.resolveAbsent\)/g) === 1 && !/cargoRoomOf\(/.test(view) && countOf(view, /cargoRoom=\{exploreRoom\.cargoRoom\}/g) === 1);
check('§3 ★ THE CELL SURFACE carries the corners and the ends ADDITIVELY (`corners?: string[]` on a face, `ends?: [string, string]` on a rod), set on the euclidean and the sealed-model reads; the developed cone surface names none (a multi-cell room carries no cargo — said)', /corners\?: string\[\];/.test(aperture) && /ends\?: \[string, string\];/.test(aperture) && countOf(aperture, /corners: \[\.\.\.face\.cycle\]/g) === 2 && countOf(aperture, /ends: \[edge\.vertexIds\[0\], edge\.vertexIds\[1\]\]/g) === 2 && /const corners = face\.cycle\.map\(stripId\);/.test(aperture));
check('§3 ★ PURITY: the model imports the types, the resolver, the born step, the face-reading type, the trace\'s letter, the aperture model and the C-10 reader — no react, no store, no component; classified NOT_FROZEN in the manifest', J(froms(model)) === J(['../types/geometry', '../lib/spaceOf', '../lib/bornFace', '../lib/faceReading', './orderTrace', './apertureModel', './liftedConceptModel']) && !/from 'react'|store\//.test(model) && /^NOT_FROZEN src\/manuscript\/cargoModel\.ts — STAMP C-11b/m.test(manifest), J(froms(model)));
check('§3 the model mentions neither `.cast` nor `ConceptSpace` (the ten readers stand — the corner space is the resolver\'s output)', !/\.cast\b|\bConceptSpace\b/.test(model));

console.log(`\nDIAGNOSE-THE-CARGO: ${failures === 0 ? 'ALL PASS' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
