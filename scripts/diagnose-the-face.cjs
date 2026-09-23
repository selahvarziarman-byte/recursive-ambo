#!/usr/bin/env node

// DIAGNOSTIC — THE FACE (STAMP C-5, 2026-09-23): the composition of the three
// records around one face of the seed, read at each corner as `Fix · Mov · Und`
// with an address, the direction stated, the empty-core guard, and THE GUARD the
// researcher found — the face is REFUSABLE: the colimit is attempted, never
// assumed; a corner's own record saying two things about one tuple once the face
// merges x ∼ h(x) is a refusal naming four things with three hands.
//
// ⛔ THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the module is RUN on the
// fixtures FROM THE RECORD and read against the researcher's seal
// (face_residue_reading.py, RESULTS_2026-09-22_face_residue_reading.txt; the
// residues of first_face_and_tower.py): on the first face Flow · T · Φ over the 42
// hand triples — Flow 76 Mov pairs · 0 refusals; T 39 · 7 refusals in 6 triples;
// Φ 45 · 0; `(i)+S1+Q` at T: Mov {r1 ↦ r8}, `sustains(r8, r0) does-not-hold
// against sustains(r1, r0) holds — once r8 ≡ r1`; `(i)+B'+P` at T: Mov {r0 ↦ r2,
// r2 ↦ r0}, `sustains(r8, r2) holds against sustains(r8, r0) does-not-hold — once
// r2 ≡ r0`; `(i)+A+Q` at Flow = 1_{F7}; `(i)+B'+P` at Flow contains the 2-cycle
// (F5 F7); `(i)+A+P` at Flow: F1 → F7 → F8 → ⊥, F12 → F5 → ⊥, F13 → ⊥. A
// disagreement reopens the DEFINITION, never tunes the code. ⚠ The researcher's
// random counts (7,204 · 5,860 of 20,000; 524 of 4,000) are that run's own
// numbers under Python's generator — this witness runs its own seeded trials and
// pins the SEALED SHAPE of each law (0 failures; > 0 occurrences), never those
// figures.
//
// The store is driven by BEHAVIOUR (the three records given through the acts, the
// refusal's hands withdrawn through the same acts); the surface is rendered to a
// string with the shape as props; the boundaries are source-pinned.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const { readCastFile } = req('src/lib/castLoader.ts');
const { faceOf, composeThroughCorner, cornerRefusals, walkOf, readStep, firstBreak, undByStep, edgeBetween } = req('src/lib/faceReading.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const { midpointSiteOf, ConceptSurface } = req('src/components/MidpointSurface.tsx');
const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);
const J = (x) => JSON.stringify(x);

console.log('THE FACE — the three records walked in turn around a face, read at each corner with the direction stated as the face\'s own; the guard: the face is refusable (C-5; C-7g items 6–9)\n');

const flow = cast('flow.cast.json');
const tcell = cast('t-cell.cast.json');
const phi = cast('phi.cast.json');
const inv = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [v, k]));
// the hand triples, verbatim from face_residue_reading.py (T-role → other; used inverted where the walk needs F → T)
const HAND_TF = { A: { r9: 'F8', r1: 'F7', r0: 'F1', r2: 'F12', r8: 'F13' }, "B'": { r9: 'F3', r1: 'F9', r0: 'F5', r7: 'F13', r8: 'F1', r2: 'F7' },
  C: { r9: 'F12', r1: 'F13', r0: 'F9', r6: 'F1', r2: 'F3' }, D: { r9: 'F12', r1: 'F1', r0: 'F2', r7: 'F7', r2: 'F5' },
  S1: { r0: 'F13', r1: 'F9', r2: 'F1', r4: 'F12', r6: 'F3', r8: 'F7' }, S4: { r0: 'F13', r1: 'F9', r2: 'F1', r6: 'F3', r7: 'F5', r8: 'F7' },
  S2: { r0: 'F9', r1: 'F3', r2: 'F13', r6: 'F10', r7: 'F5', r8: 'F12' } };
const HAND_TP = { P: { r0: 'Φ1', r1: 'Φ2', r2: 'Φ7', r4: 'Φ5', r6: 'Φ3' }, Q: { r9: 'Φ6', r1: 'Φ1', r0: 'Φ8', r7: 'Φ5', r6: 'Φ2' }, R: { r0: 'Φ1', r1: 'Φ6', r7: 'Φ5', r2: 'Φ7', r4: 'Φ8' } };
const J_FP = { '(i)': { F7: 'Φ1', F8: 'Φ2', F5: 'Φ7' }, '(ii)': { F1: 'Φ3', F2: 'Φ2', F3: 'Φ4', F5: 'Φ1' } };
const edge = (id, a, b, roles) => ({ id, vertexIds: [a, b], sourceVertexIds: [a, b], identification: { roles: Object.entries(roles), types: [] } });
const casts = { F: flow, T: tcell, P: phi };
const triple = (fp, tf, tp) => [edge('e-FT', 'F', 'T', inv(HAND_TF[tf])), edge('e-TP', 'T', 'P', HAND_TP[tp]), edge('e-PF', 'P', 'F', inv(J_FP[fp]))];
const refusalWords = (r) => `${r.first.type}(${r.first.terms.join(', ')}) ${r.first.value} against ${r.second.type}(${r.second.terms.join(', ')}) ${r.second.value} — once ${r.merged.map(([a, b]) => `${a} ≡ ${b}`).join(' · ')}`;

// ═══ §1 THE SEAL — the record's own first face, the 42 hand triples ═══
console.log('----- §1 the seal: Flow · T · Φ over the 42 hand triples, at all three bases -----');
const mov = { F: 0, T: 0, P: 0 };
const refs = { F: 0, T: 0, P: 0 };
const refusedTriples = { F: 0, T: 0, P: 0 };
const named = {};
let triples = 0;
for (const fp of Object.keys(J_FP)) for (const tf of Object.keys(HAND_TF)) for (const tp of Object.keys(HAND_TP)) {
  triples += 1;
  const { walk } = walkOf(['F', 'T', 'P'], triple(fp, tf, tp));
  for (const c of ['F', 'T', 'P']) {
    const r = composeThroughCorner(walk, c, casts[c]);
    mov[c] += r.mov.length;
    const rf = cornerRefusals(walk, r, casts[c]);
    refs[c] += rf.length;
    if (rf.length) {
      refusedTriples[c] += 1;
      named[`${fp}+${tf}+${tp}@${c}`] = { mov: r.mov, words: rf.map(refusalWords) };
    }
  }
}
note(`${triples} triples · Mov pairs Flow ${mov.F} · T ${mov.T} · Φ ${mov.P} · corner-local refusals Flow ${refs.F} · T ${refs.T} (in ${refusedTriples.T} triples) · Φ ${refs.P}`);
check('§1 ★★ THE SEAL, read to the digit: over the 42 hand triples, Flow 76 Mov pairs and 0 corner-local refusals; T 39 Mov pairs and 7 refusals in 6 triples; Φ 45 Mov pairs and 0 refusals',
  triples === 42 && mov.F === 76 && mov.T === 39 && mov.P === 45 && refs.F === 0 && refs.T === 7 && refusedTriples.T === 6 && refs.P === 0 && refusedTriples.F === 0 && refusedTriples.P === 0,
  J({ mov, refs, refusedTriples }));
check('§1 ★★ THE NAMED REFUSALS, by name: `(i)+S1+Q` at T — Mov {r1 ↦ r8}, `sustains(r8, r0) does-not-hold against sustains(r1, r0) holds — once r8 ≡ r1`; `(i)+B\'+P` at T — Mov {r0 ↦ r2, r2 ↦ r0}, `sustains(r8, r2) holds against sustains(r8, r0) does-not-hold — once r2 ≡ r0`; `(ii)+D+P` at T — Mov {r0 ↦ r2, r1 ↦ r0, r6 ↦ r1}, TWO refusals; the six refusing triples are exactly (i)+B\'+P · (i)+B\'+R · (i)+S1+Q · (i)+S4+Q · (ii)+D+P · (ii)+D+R, all at T',
  (() => {
    const keys = Object.keys(named).sort();
    const s1q = named['(i)+S1+Q@T'];
    const bp = named["(i)+B'+P@T"];
    const dp = named['(ii)+D+P@T'];
    return J(keys) === J(["(i)+B'+P@T", "(i)+B'+R@T", '(i)+S1+Q@T', '(i)+S4+Q@T', '(ii)+D+P@T', '(ii)+D+R@T']) &&
      s1q && J(s1q.mov) === J([['r1', 'r8']]) && s1q.words[0] === 'sustains(r8, r0) does-not-hold against sustains(r1, r0) holds — once r8 ≡ r1' &&
      bp && J(bp.mov) === J([['r0', 'r2'], ['r2', 'r0']]) && bp.words[0] === 'sustains(r8, r2) holds against sustains(r8, r0) does-not-hold — once r2 ≡ r0' &&
      dp && J(dp.mov) === J([['r0', 'r2'], ['r1', 'r0'], ['r6', 'r1']]) && dp.words.length === 2;
  })(), J(named));
check('§1 ★ WHY FLOW AND Φ CANNOT REFUSE HERE (the researcher\'s reason, measured on the record): Flow declares 0 negatives and one mark value, Φ declares 0 negatives — a merge can only ever add `holds`; T declares 3 negatives, and only a cast that declares a negative can refuse a face by the corner-local check',
  flow.relations.filter((r) => r.polarity === 'does-not-hold').length === 0 && new Set(flow.roles.flatMap((r) => Object.values(r.types ?? {}))).size === 1 &&
    phi.relations.filter((r) => r.polarity === 'does-not-hold').length === 0 && tcell.relations.filter((r) => r.polarity === 'does-not-hold').length === 3);
check('§1 ★★ THE SEALED RESIDUES AT BASE FLOW (first_face_and_tower.py): `(i)+A+Q` is 1_{F7} — one role returned to itself, nothing moved; `(i)+B\'+P` contains the 2-cycle (F5 F7); `(i)+A+P` reads F1 → F7 → F8 → ⊥, F12 → F5 → ⊥, F13 → ⊥ — Mov {F1 ↦ F7, F7 ↦ F8, F12 ↦ F5}, and of those that set out F8 and F13 broke at T → Φ (F5 never set out — it broke at F → T)',
  (() => {
    const at = (fp, tf, tp) => composeThroughCorner(walkOf(['F', 'T', 'P'], triple(fp, tf, tp)).walk, 'F', flow);
    const q = at('(i)', 'A', 'Q');
    const bp = at('(i)', "B'", 'P');
    const ap = at('(i)', 'A', 'P');
    const broke = (r, x) => { const u = r.und.find((u) => u.role === x); return u ? `${u.brokeAt.from}→${u.brokeAt.to}` : null; };
    return J([...q.h.entries()]) === J([['F7', 'F7']]) && J(q.fix) === J(['F7']) && q.mov.length === 0 &&
      bp.mov.some(([x, y]) => x === 'F5' && y === 'F7') && bp.mov.some(([x, y]) => x === 'F7' && y === 'F5') &&
      J(ap.mov) === J([['F1', 'F7'], ['F7', 'F8'], ['F12', 'F5']]) && ap.fix.length === 0 && broke(ap, 'F8') === 'T→P' && broke(ap, 'F13') === 'T→P' && broke(ap, 'F5') === 'F→T';
  })());
check('§1 ★ THE LOWER BOUND, said in the instrument\'s own words: the corner-local check is sufficient for refusal, not necessary — the module\'s head names it a LOWER BOUND, and the witness pins a count of refusals never as "the" count',
  /LOWER BOUND/.test(readLf('src/lib/faceReading.ts')) && /SUFFICIENT for refusal, not necessary/.test(readLf('src/lib/faceReading.ts')));

// ═══ §2 THE STRUCTURE — the laws on random triples, own generator ═══
console.log('\n----- §2 the structure: dom h ⊆ dom of the first step; Fix ⊔ Mov = dom h, Und = R ∖ dom h; one first-break edge each; orientation is content; the projection route identity -----');
let seed = 220;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const sample = (xs, k) => { const a = [...xs]; const out = []; for (let i = 0; i < k; i += 1) out.push(a.splice(Math.floor(rnd() * a.length), 1)[0]); return out; };
const rndMap = (src, dst) => { const n = Math.floor(rnd() * (src.length + 1)); const s = sample(src, n); const d = sample(dst, n); return Object.fromEntries(s.map((x, i) => [x, d[i]])); };
const R = { A: ['a0', 'a1', 'a2', 'a3', 'a4', 'a5'], B: ['b0', 'b1', 'b2', 'b3', 'b4', 'b5'], C: ['c0', 'c1', 'c2', 'c3', 'c4', 'c5'] };
const space = (roles) => ({ roles: roles.map((id) => ({ id })), signature: [], relations: [], axioms: [] });
const spaces = { A: space(R.A), B: space(R.B), C: space(R.C) };
const bad = { A1: 0, A2: 0, A3: 0, A4: 0, proj: 0 };
const hit = { A5: 0, A6: 0, wrong: 0 };
const TRIALS = 4000;
for (let t = 0; t < TRIALS; t += 1) {
  const J_AB = rndMap(R.A, R.B); const J_BC = rndMap(R.B, R.C); const J_CA = rndMap(R.C, R.A);
  const edges = [edge('ab', 'A', 'B', J_AB), edge('bc', 'B', 'C', J_BC), edge('ca', 'C', 'A', J_CA)];
  const { walk } = walkOf(['A', 'B', 'C'], edges);
  if (!walk) continue; // an empty record on some edge — the guard's case, measured in §4
  const r = composeThroughCorner(walk, 'A', spaces.A);
  const domH = new Set(r.h.keys());
  if (![...domH].every((x) => x in J_AB)) bad.A1 += 1;
  const fixMov = new Set([...r.fix, ...r.mov.map(([x]) => x)]);
  const und = new Set(r.und.map((u) => u.role));
  if (J([...fixMov].sort()) !== J([...domH].sort()) || J([...und].sort()) !== J(R.A.filter((x) => !domH.has(x)).sort())) bad.A2 += 1;
  const touched = new Set([...Object.keys(J_AB), ...Object.values(J_CA)]);
  if ([...fixMov].some((x) => !touched.has(x))) bad.A3 += 1;
  const steps = [walk.steps[0], walk.steps[1], walk.steps[2]];
  if (r.und.some((u) => firstBreak(steps, u.role) === null) || [...domH].some((x) => firstBreak(steps, x) !== null)) bad.A4 += 1;
  // the same face walked the other way — the reading based at A in the reverse direction is h⁻¹
  const back = composeThroughCorner(walkOf(['A', 'C', 'B'], edges).walk, 'A', spaces.A);
  if (J([...und].sort()) !== J(back.und.map((u) => u.role).sort())) hit.A5 += 1;
  // the person spoke on BOTH the direct map and the route through C, they differ, and the role is still Und
  const proj = {}; for (const [a, c] of Object.entries(inv(J_CA))) if (c in inv(J_BC)) proj[a] = inv(J_BC)[c];
  if (r.und.some((u) => u.role in proj && u.role in J_AB && proj[u.role] !== J_AB[u.role])) hit.A6 += 1;
  // the projection route identity h = proj_C⁻¹ ∘ J_AB (0 failures) and its positive control (the reversed convention fails on some)
  const projInv = inv(proj);
  const viaProj = {}; for (const [a, b] of Object.entries(J_AB)) if (b in projInv) viaProj[a] = projInv[b];
  if (J(Object.entries(viaProj).sort()) !== J([...r.h.entries()].sort())) bad.proj += 1;
  const wrong = {}; for (const [c, b] of Object.entries(inv(J_BC))) if (b in inv(J_AB)) wrong[c] = inv(J_AB)[b]; // a reversed convention
  const wrongInv = inv(wrong);
  const viaWrong = {}; for (const [a, b] of Object.entries(J_AB)) if (b in wrongInv) viaWrong[a] = wrongInv[b];
  if (J(Object.entries(viaWrong).sort()) !== J([...r.h.entries()].sort())) hit.wrong += 1;
}
note(`${TRIALS} random triples of partial injections (6+6+6 roles, this witness's own generator): A1 ${bad.A1} · A2 ${bad.A2} · A3 ${bad.A3} · A4 ${bad.A4} failures · A5 ${hit.A5} · A6 ${hit.A6} occurrences · projection identity ${bad.proj} failures · the reversed convention fails on ${hit.wrong}`);
check('§2 ★★ THE STRUCTURE (A1–A4, sealed 0): dom h ⊆ dom of the first step; Fix ⊔ Mov = dom h and Und = R ∖ dom h — a partition; a role in no edge\'s domain is never in Fix ∪ Mov; every Und role has EXACTLY ONE first-break edge and no returning role has one', bad.A1 === 0 && bad.A2 === 0 && bad.A3 === 0 && bad.A4 === 0, J(bad));
check('§2 ★★ ORIENTATION IS CONTENT (A5, sealed > 0): the same face walked the other way has a different Und set on some triples — so the surface must state the direction it walked; and (A6, sealed > 0) a role is Und although the person spoke on BOTH the direct map and the route and they differ — Und is NEVER "the person has not said"', hit.A5 > 0 && hit.A6 > 0, J(hit));
check('§2 ★ THE PROJECTION ROUTE IDENTITY (0031 §8(b), the researcher\'s probe): h_A = proj_C⁻¹ ∘ J_AB on every triple — Fix is exactly where the direct map and the route through C agree; the POSITIVE CONTROL — the reversed convention fails on some triples, so the test can tell a right convention from a wrong one', bad.proj === 0 && hit.wrong > 0, J({ proj: bad.proj, wrong: hit.wrong }));

// ═══ §3 THE GUARD — refusals on random corners; four things; three hands ═══
console.log('\n----- §3 the guard: random corners carrying declared negatives refuse; a refusal names four things; three hands per merged pair -----');
let hits = 0; let example = null;
for (let t = 0; t < 2000; t += 1) {
  const X = ['x0', 'x1', 'x2', 'x3', 'x4', 'x5'];
  const rel = [];
  for (let k = 0; k < 8; k += 1) rel.push({ type: rnd() < 0.5 ? 'p' : 'q', terms: [X[Math.floor(rnd() * 6)], X[Math.floor(rnd() * 6)]], polarity: rnd() < 0.5 ? 'holds' : 'does-not-hold' });
  const sp = { roles: X.map((id) => ({ id })), signature: [{ type: 'p', arity: 2 }, { type: 'q', arity: 2 }], relations: rel, axioms: [] };
  const [m0, m1] = sample(X, 2);
  // one Mov pair m0 ↦ m1 around a face whose other corners carry it through
  const edges = [edge('xy', 'X', 'Y', { [m0]: 'y' }), edge('yz', 'Y', 'Z', { y: 'z' }), edge('zx', 'Z', 'X', { z: m1 })];
  const walk = walkOf(['X', 'Y', 'Z'], edges).walk;
  const r = composeThroughCorner(walk, 'X', sp);
  const rf = cornerRefusals(walk, r, sp);
  if (rf.length) { hits += 1; if (!example) example = { merge: [m0, m1], words: refusalWords(rf[0]), hands: rf[0].hands.map((h) => `${h.pair.join(' ↦ ')} on ${h.edge.id}`) }; }
}
note(`2000 random corners with declared negatives, one Mov pair each: refusals ${hits}${example ? ` · one instance: merging ${example.merge.join(' ∼ ')} — ${example.words} · hands ${example.hands.join(' · ')}` : ''}`);
check('§3 ★★ THE HAZARD IS REAL (B1, sealed > 0): on random corners carrying declared negatives, one Mov pair produces refusals', hits > 0);
check('§3 ★★ A REFUSAL NAMES FOUR THINGS AND CARRIES THREE HANDS: on `(i)+S1+Q` at T — the two tuples with their values (`sustains(r8, r0) does-not-hold` · `sustains(r1, r0) holds`), the corner (T), the merged pair (r8 ≡ r1), and the three acts whose composition merged them, each as it stands on ITS OWN edge\'s record — r1 ↦ Φ1 on T–Φ · Φ1 ↦ F7 on Φ–F · F7 ↦ r8 on F–T',
  (() => {
    const res = faceOf(['F', 'T', 'P'], casts, triple('(i)', 'S1', 'Q'));
    if (res.state !== 'refused') return false;
    const r = res.refusals[0];
    return res.refusals.length === 1 && r.corner === 'T' && r.kind === 'tuple' && J(r.first) === J({ type: 'sustains', terms: ['r8', 'r0'], value: 'does-not-hold' }) && J(r.second) === J({ type: 'sustains', terms: ['r1', 'r0'], value: 'holds' }) &&
      J(r.merged) === J([['r8', 'r1']]) && J(r.hands.map((h) => [h.edge.id, ...h.pair])) === J([['e-TP', 'r1', 'Φ1'], ['e-PF', 'Φ1', 'F7'], ['e-FT', 'F7', 'r8']]);
  })());
check('§3 ★★ ON A REFUSED FACE NOTHING ELSE IS READ: `faceOf` returns the refusals and no readings — a Fix · Mov · Und of a world that does not exist is not printed; and a 2-cycle (`(i)+B\'+P` at T: r0 ↦ r2, r2 ↦ r0) needs TWO withdrawals — after the first hand the other path still merges the pair',
  (() => {
    const res = faceOf(['F', 'T', 'P'], casts, triple('(i)', "B'", 'P'));
    if (res.state !== 'refused' || 'readings' in res) return false;
    const hand = res.refusals[0].hands[0];
    const without = triple('(i)', "B'", 'P').map((e) => (e.id === hand.edge.id ? { ...e, identification: { roles: e.identification.roles.filter(([x, y]) => !(x === hand.pair[0] && y === hand.pair[1])), types: [] } } : e));
    const again = faceOf(['F', 'T', 'P'], casts, without);
    if (again.state !== 'refused') return false;
    const hand2 = again.refusals[0].hands[0];
    const freed = without.map((e) => (e.id === hand2.edge.id ? { ...e, identification: { roles: e.identification.roles.filter(([x, y]) => !(x === hand2.pair[0] && y === hand2.pair[1])), types: [] } } : e));
    return faceOf(['F', 'T', 'P'], casts, freed).state === 'read';
  })());
check('§3 ★ A MARK CAN REFUSE TOO, under the mold\'s own rule: merging a role marked `has` with one marked `none-by-nature` refuses; merging `has` with `unrecorded` does NOT (has ⊔ unrecorded = has, C-7pre)',
  (() => {
    const sp = (a, b) => ({ roles: [{ id: 'x', types: { member_status: a } }, { id: 'y', types: { member_status: b } }], signature: [], relations: [], axioms: [] });
    const edges = [edge('xy', 'X', 'Y', { x: 'y1' }), edge('yz', 'Y', 'Z', { y1: 'z1' }), edge('zx', 'Z', 'X', { z1: 'y' })];
    const walk = walkOf(['X', 'Y', 'Z'], edges).walk;
    const test = (a, b) => { const s = sp(a, b); return cornerRefusals(walk, composeThroughCorner(walk, 'X', s), s); };
    return test('has', 'none-by-nature').length === 1 && test('has', 'none-by-nature')[0].kind === 'mark' && test('has', 'unrecorded').length === 0 && test('has', 'has').length === 0;
  })());

// ═══ §4 ORIENTATION AT THE MOMENT OF READING; THE EMPTY-CORE GUARD ═══
console.log('\n----- §4 the records read from the edges\' vertexIds at the moment of reading; the empty-core guard -----');
check('§4 ★★ ORIENTATION IS LOAD-BEARING AND NOT A PARAMETER: the same three records stored the other way round (each edge\'s `vertexIds` reversed, its record written first ↦ second as stored) give the SAME reading at every corner and the SAME refusal — with each hand\'s pair in its edge\'s own orientation; nothing stores a direction (the module reads `vertexIds[0] !== from` and carries no direction field)',
  (() => {
    const fwd = faceOf(['F', 'T', 'P'], casts, triple('(i)', 'A', 'P'));
    const rev = faceOf(['F', 'T', 'P'], casts, [edge('e-FT', 'T', 'F', HAND_TF.A), edge('e-TP', 'P', 'T', inv(HAND_TP.P)), edge('e-PF', 'F', 'P', J_FP['(i)'])]);
    const same = fwd.state === 'read' && rev.state === 'read' && fwd.readings.every((r, i) => J([...r.h.entries()]) === J([...rev.readings[i].h.entries()]) && J(r.und) === J(rev.readings[i].und));
    const f2 = faceOf(['F', 'T', 'P'], casts, triple('(i)', 'S1', 'Q'));
    const r2 = faceOf(['F', 'T', 'P'], casts, [edge('e-FT', 'T', 'F', HAND_TF.S1), edge('e-TP', 'P', 'T', inv(HAND_TP.Q)), edge('e-PF', 'F', 'P', J_FP['(i)'])]);
    const src = readLf('src/lib/faceReading.ts');
    return same && f2.state === 'refused' && r2.state === 'refused' && J(r2.refusals[0].merged) === J(f2.refusals[0].merged) &&
      J(r2.refusals[0].hands.map((h) => [h.edge.id, ...h.pair])) === J([['e-TP', 'Φ1', 'r1'], ['e-PF', 'F7', 'Φ1'], ['e-FT', 'r8', 'F7']]) &&
      src.includes('const reversed = edge.vertexIds[0] !== from;') && !/direction\s*[:=]/.test(src);
  })());
check('§4 ★★ THE EMPTY-CORE GUARD: any of the three edges without a record ⇒ NO composite — `absent` with the missing edges named (an edge with a record of zero role pairs counts as none); never an empty map read as an identity',
  (() => {
    const one = faceOf(['F', 'T', 'P'], casts, [edge('e-FT', 'F', 'T', inv(HAND_TF.A))]);
    const zero = faceOf(['F', 'T', 'P'], casts, [edge('e-FT', 'F', 'T', inv(HAND_TF.A)), edge('e-TP', 'T', 'P', HAND_TP.P), { ...edge('e-PF', 'P', 'F', {}), identification: { roles: [], types: [['x', 'y']] } }]);
    return one.state === 'absent' && J(one.missing) === J([{ from: 'T', to: 'P' }, { from: 'P', to: 'F' }]) && zero.state === 'absent' && J(zero.missing) === J([{ from: 'P', to: 'F' }]);
  })());
check('§4 ★ THE DOMAIN AND THE GAP ARE PARAMETERS WITH THE RULED DEFAULTS: `ambient` measures Und against the corner\'s own roles (14 for Flow), `core` shrinks the reading to dom h (Und empty — not the ruling); a `gap` that excludes a break moves the role from Und to `excluded` (the ruled default excludes nothing)',
  (() => {
    const walk = walkOf(['F', 'T', 'P'], triple('(i)', 'A', 'P')).walk;
    const a = composeThroughCorner(walk, 'F', flow);
    const c = composeThroughCorner(walk, 'F', flow, { domain: 'core' });
    const g = composeThroughCorner(walk, 'F', flow, { gap: (at) => (at.from === 'F' && at.to === 'T' ? 'excluded' : 'Und') });
    return a.ambient.length === 14 && a.und.length === 11 && a.core.length === 3 && c.ambient.length === 3 && c.und.length === 0 && g.excluded.length === 9 && g.und.length === 2 && a.excluded.length === 0;
  })());
check('§4 ★ `undByStep` groups the addresses in the walk\'s order — for `(i)+A+P` at Flow: 9 broke at F → T (never left), 2 at T → Φ, 0 at Φ → F',
  (() => { const r = composeThroughCorner(walkOf(['F', 'T', 'P'], triple('(i)', 'A', 'P')).walk, 'F', flow); const by = undByStep(r); return J(by.map((s) => [s.from, s.to, s.roles.length])) === J([['F', 'T', 9], ['T', 'P', 2], ['P', 'F', 0]]); })());

// ═══ §5 THE STORE AND THE SURFACE, BY BEHAVIOUR ═══
console.log('\n----- §5 the store and the surface: the three records given through the acts; the face read at the midpoint beside the opposite corner; the refusal with three hands; a hand withdrawn -----');
const seed0 = createSeedShape('tetrahedron');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
// Flow on A, the T cell on B, Φ on C — the face A·B·C walked A → B → C → A is F → T → Φ → F, the instrument's direction
const seeded = withCast(withCast(withCast(seed0, byLabel(seed0, 'A'), flow), byLabel(seed0, 'B'), tcell), byLabel(seed0, 'C'), phi);
const ambo = applyAmboDissection(seeded);
const a = byLabel(ambo, 'A'); const b = byLabel(ambo, 'B'); const c = byLabel(ambo, 'C');
const { useGeometryStore } = req('src/store/geometryStore.ts');
useGeometryStore.setState({ shapes: { ...useGeometryStore.getState().shapes, [ambo.id]: ambo }, currentShapeId: ambo.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {} });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[ambo.id];
const edgeOf = (x, y) => edgeBetween(cur().edges, x, y);
// give a map x ↦ y (x a role of corner X, y of corner Y) on the edge between X and Y, in the edge's own orientation
const give = (X, Y, map) => { const e = edgeOf(X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === X) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
const withdraw = (X, Y, x, y) => { const e = edgeOf(X, Y); if (e.vertexIds[0] === X) S().withdrawRolePair(e.id, x, y); else S().withdrawRolePair(e.id, y, x); };
const React = require('react');
const { renderToString } = require('react-dom/server');
const render = (el) => renderToString(el).replace(/<!-- -->/g, '');
const unescapeHtml = (s) => (s ?? '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
const attrsOf = (html, name) => [...html.matchAll(new RegExp(`${name}="([^"]*)"`, 'g'))].map((m) => unescapeHtml(m[1]));
const countOf = (html, name) => (html.match(new RegExp(`${name}="`, 'g')) || []).length;
const visibleText = (html) => unescapeHtml(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const report = buildGeneralSitePacketPresenterReport(ambo);
const packetAB = report.packets.find((p) => p.trace.parentIds.includes(a) && p.trace.parentIds.includes(b));
const surfaceAB = () => render(React.createElement(ConceptSurface, { shape: cur(), vertexId: packetAB.trace.siteId }));
const faceBlock = (html) => (html.split('data-midpoint-face-reading="A·B·C"')[1] || '').split(/data-midpoint-source-acts=|data-midpoint-word-half=|data-midpoint-source="/)[0];
give(a, b, inv(HAND_TF.S1));
check('§5 ★★ THE ABSENT STATE, in words, at the midpoint: with a record on A–B alone the AB surface\'s source C reads `the face A·B·C, walked in the face\'s own direction, A → B → C → A: no reading yet — it needs a record on each of its three edges; none on B–C · C–A` (C-7g item 7: the direction is the face\'s own, no word about the other way)',
  (() => { const html = surfaceAB(); return attrsOf(html, 'data-midpoint-face-state').includes('absent') && visibleText(faceBlock(html)).includes("the face A·B·C, walked in the face's own direction, A → B → C → A: no reading yet — it needs a record on each of its three edges; none on B–C · C–A"); })(), visibleText(faceBlock(surfaceAB())).slice(0, 300));
give(b, c, HAND_TP.Q);
give(c, a, inv(J_FP['(i)']));
check('§5 ★★ THE THREE RECORDS ACCEPTED AT THEIR EDGES, THE FACE REFUSED (the new site, the new cause): every pair of (i)+S1+Q passed the edge\'s own check (no refusal pending on any of the three edges) — and the AB surface\'s source C reads `NO FACE: the three acts around it, walked in turn, …` (C-7g item 9: never `composed` — the solid\'s word), naming T\'s two tuples with their values, the corner B, the merged pair (r8 and r1 made one), the three edges, and THREE hands as buttons, EACH LEADING WITH WHERE and the local one saying `here` (C-7g item 8) — `on B–C: withdraw r1 ↦ Φ1` · `on C–A: withdraw Φ1 ↦ F7` (as stored) · `here, on A–B: withdraw F7 ↦ r8` (as stored; A–B is the midpoint\'s own edge)',
  (() => {
    const html = surfaceAB();
    const fb = faceBlock(html);
    const text = visibleText(fb);
    const hands = attrsOf(fb, 'data-midpoint-face-withdraw');
    const handTexts = [...fb.matchAll(/data-midpoint-face-withdraw="[^"]*"[^>]*>([^<]*)</g)].map((m) => unescapeHtml(m[1]));
    const eBC = edgeOf(b, c); const eCA = edgeOf(c, a); const eAB = edgeOf(a, b);
    const stored = (e, X, x, y) => (e.vertexIds[0] === X ? `${e.id}|${x}|${y}` : `${e.id}|${y}|${x}`);
    return Object.keys(S().midpointRefusals).length === 0 && attrsOf(html, 'data-midpoint-face-state').includes('refused') && /NO FACE: the three acts around it, walked in turn, make/.test(text) && !/composed/.test(text) &&
      text.includes("B's own record: sustains(r8, r0) does-not-hold against sustains(r1, r0) holds — with r8 and r1 made one") && /walked in the face's own direction, A → B → C → A/.test(text) &&
      hands.length === 3 && hands[0] === stored(eBC, b, 'r1', 'Φ1') && hands[1] === stored(eCA, c, 'Φ1', 'F7') && hands[2] === stored(eAB, a, 'F7', 'r8') &&
      !/Fix|returned to itself/.test(text) && text.includes('withdraw one of the three acts') &&
      handTexts.length === 3 && handTexts[0] === (eBC.vertexIds[0] === b ? 'on B–C: withdraw r1 ↦ Φ1' : 'on C–B: withdraw Φ1 ↦ r1') && handTexts[2] === (eAB.vertexIds[0] === a ? 'here, on A–B: withdraw F7 ↦ r8' : 'here, on B–A: withdraw r8 ↦ F7') && !/^here/.test(handTexts[1]) &&
      attrsOf(fb, 'data-midpoint-face-here').length === 1;
  })(), visibleText(faceBlock(surfaceAB())).slice(0, 600));
withdraw(b, c, 'r1', 'Φ1');
check('§5 ★★ ONE HAND WITHDRAWN THROUGH THE STORE, THE FACE READS: the surface states the direction as the face\'s own (`walked in the face\'s own direction, A → B → C → A` — C-7g item 7: no control to walk the other way, D14; no word about the other way), and at each corner ONE CLAUSE PER LINE in the ruled order (C-7g item 6, ADR 0024: map first, the verdict a consequence) — `returned to itself` · `returned elsewhere` (as, never a pair glyph), or, where NOTHING returned, the one line `nothing returned` (C-7h item 5, the designer) · `N did not return — n broke at A–B: … · m at B–C: …` (the counts per edge BEFORE the names, so a wrap cannot orphan the verdict; every Und role with its edge) · `the face\'s core at A, derived: N of its 14 roles` CLOSING the corner\'s block; the words "has not said" nowhere',
  (() => {
    const html = surfaceAB();
    const fb = faceBlock(html);
    const text = visibleText(fb);
    const corners = attrsOf(fb, 'data-midpoint-face-corner');
    const lines = attrsOf(fb, 'data-midpoint-face-line');
    const lineTexts = [...fb.matchAll(/data-midpoint-face-line="(\w+)"[^>]*>([^<]*)</g)].map((m) => ({ kind: m[1], text: unescapeHtml(m[2]) }));
    const und = lineTexts.filter((l) => l.kind === 'und');
    return attrsOf(html, 'data-midpoint-face-state').includes('read') && attrsOf(fb, 'data-midpoint-face-walk')[0] === 'A → B → C → A' && J(corners) === J(['A', 'B', 'C']) &&
      /walked in the face's own direction, A → B → C → A/.test(text) && !/reads differently|the other way/.test(text) &&
      J(lines) === J(attrsOf(fb, 'data-midpoint-face-fix').map((fx, k) => (Number(fx) + Number(attrsOf(fb, 'data-midpoint-face-mov')[k]) > 0 ? ['fix', 'mov'] : ['none']).concat(['und', 'core'])).flat()) && lineTexts.filter((l) => l.kind === 'none').every((l) => l.text === 'nothing returned') && !/returned to itself: none returned elsewhere: none/.test(text) && (note(`corners reading nothing returned: ${lineTexts.filter((l) => l.kind === 'none').length} of 3 · lines ${J(lines)}`), true) &&
      und.length === 3 && und.every((l) => /^\d+ did not return( — \d+ broke at [A-C]–[A-C]: [^·]+( · \d+ at [A-C]–[A-C]: [^·]+)*)?$/.test(l.text)) && /^\d+ did not return — \d+ broke at A–B: /.test(und[0].text) &&
      lineTexts.filter((l) => l.kind === 'core')[0].text.match(/^the face's core at A, derived: \d+ of its 14 roles$/) && !/has not said/.test(text) && !/↦.*returned elsewhere|returned elsewhere: [^·]*↦/.test(text);
  })(), visibleText(faceBlock(surfaceAB())).slice(0, 700));
check('§5 ★ THE COUNTS AT EACH CORNER ARE THE MODULE\'S OWN, read from the same records: the surface\'s data attributes (fix · mov · und · core per corner) equal `faceOf` on the current shape\'s edges in the D14 walk',
  (() => {
    const html = surfaceAB();
    const fb = faceBlock(html);
    const res = faceOf([a, b, c], { [a]: flow, [b]: tcell, [c]: phi }, cur().edges);
    if (res.state !== 'read') return false;
    return res.readings.every((r, i) => attrsOf(fb, 'data-midpoint-face-fix')[i] === String(r.fix.length) && attrsOf(fb, 'data-midpoint-face-mov')[i] === String(r.mov.length) && attrsOf(fb, 'data-midpoint-face-und')[i] === String(r.und.length) && attrsOf(fb, 'data-midpoint-face-core')[i] === String(r.core.length));
  })());
check('§5 ★ THE WALK IS D14\'s: the source\'s `cycle` starts at the alphabetically-first corner and runs in the face\'s own direction — for the AB site the face through C is `A·B·C` walked A → B → C → A, and the face through D is `A·D·B` walked A → D → B → A (no reversal, no re-sorting)',
  (() => {
    const site = midpointSiteOf(ambo, packetAB.trace.siteId, packetAB.trace);
    const L = (v) => ambo.vertices[v].data.label;
    return site.sources.length === 2 && site.sources.every((s) => s.cycle.length === 3 && s.faceName === s.cycle.map(L).join('·'));
  })());

// ═══ §6 THE BOUNDARIES, source-pinned ═══
console.log('\n----- §6 the boundaries -----');
const lib = readLf('src/lib/faceReading.ts');
const surf = readLf('src/components/MidpointSurface.tsx');
check('§6 ⛔ THE MODULE IS PURE OVER THREE CASTS AND THE EDGES\' RECORDS: faceReading.ts imports only the types and the register\'s `valuesAgree` (the mold\'s rule on marks); no store, no component, no derived arrows; nothing written',
  (lib.match(/^import /gm) || []).length === 2 && lib.includes("import type { ConceptSpace, Edge, VertexId } from '../types/geometry';") && lib.includes("import { valuesAgree } from './jRegister';") && !/useGeometryStore|from '\.\.\/store|from '\.\.\/components|\.identification\s*=/.test(lib));
check('§6 ★ THE SITING: the face\'s reading lives at the midpoint beside the opposite corner seen through that face (`SourceRecord` → `FaceRecord`), reaches the store only to withdraw a hand, and enters neither Panels.tsx nor the manuscript; the words `did not return` are the surface\'s, `has not said` nowhere',
  /function FaceRecord\(/.test(surf) && surf.includes('<FaceRecord ') && surf.includes('did not return') && !/has not said/.test(surf) && !readLf('src/components/Panels.tsx').includes('faceReading') && !readLf('src/components/Panels.tsx').includes('FaceRecord'));
check('§6 the manifest classifies the module NOT_FROZEN at its landing', /^NOT_FROZEN src\/lib\/faceReading\.ts /m.test(readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt')));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-FACE: ALL PASS — the residue reads the seal at every corner, the direction is stated, every Und role has its address, the face is refusable and names four things with three hands' : `DIAGNOSE-THE-FACE: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
