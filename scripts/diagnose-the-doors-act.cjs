#!/usr/bin/env node

// DIAGNOSTIC — THE DOOR's ACT (STAMP C-11a, 2026-09-24; §133 — Option R: the ROOM's door, the aperture's pairing row).
// The person glues two faces of a lifted form into a door and gives it a CONCEPT: which role of one side's corner
// crosses to which role of the other's. The door TRANSPORTS: in the glued form the two boundary edges of each strip ARE
// one edge, so the two ways across a strip must be one transport — DESCENT, read from EITHER face (the two-way strip
// condition; the one-way reading depends on which face is called A — D10). THE REFERENCE, cited not re-derived: the
// researcher's descent_at_the_door.py and its RESULTS_2026-09-23_descent_at_the_door.txt ((N) two-way, as amended after
// run 1). src/manuscript/doorTransportModel.ts is THE SECOND IMPLEMENTATION; a disagreement between the two reopens the
// DEFINITION, never tunes a number — so §1 pins the reference's fixture census NUMBER FOR NUMBER (the prism of two first
// faces, the translation door, 42 × 42 ordered door pairs, every pointed pair at every corner).
//
// §1 THE FIXTURES — the reference's shapes: the empty transport always lawful (D3); one pointed pair carries exactly its
//    whole line (D2, against the (shape, place) mechanism carried in-memory here, and against the whole line-pair); a
//    differing pair refused at the parting edge; the record refusal at Φ (5880 — jRegister's refusalOf agreeing with the
//    reference's glue); the ONE-WAY reading refused (the D10 control: the forward-only propagation carried in-memory
//    admits pairs the two-way refuses, and none the other way).
// §2 THE LAWFUL PATH — casts on the seed's corners, the person's pairs, two dissections, the born pair on AB–AC; the
//    residue at A lifted (from gen 1 and from gen 2) and loaded through the shelf's door; the door A·AC·AB ~ A·AB·AD on
//    the hinge candidate: the lines on each face through the record (the one resolver, each edge's J by its kind), every
//    pointed pair's outcome, an act taken with its whole line, the form, the parting-edge refusal, the record refusal,
//    the whole-line withdrawal, the cannot-cross line (on the gen-2 residue the person's own born pair is exactly what
//    cannot cross), the one-way control on the record; the six candidates' verdicts printed (the gen-2 residue's glue
//    throws in the level-3 link extractor today — a subdivided-face cell; printed, not pinned).
// §3 PERSISTENCE — the transport rides the row into the built record and the page file; a save → load round trip
//    carries it verbatim; the restored record reads the same lines; the glue ignores it (the same verdict).
// §4 THE SURFACE under node — the section's words: the empty state, the taken line with ONE hand, the refusal with its
//    local hand, the cannot-cross line; nothing lit; the chrome mounts the section under the row; the view's wiring.
//
// ⛔ RECORD, NOT READING: nothing here stores a line or a verdict; every reading is re-derived at the read.

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

const M = req('src/manuscript/doorTransportModel.ts');
const { spaceOf, composedOn, nameIn } = req('src/lib/spaceOf.ts');
const { refusalOf } = req('src/lib/jRegister.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const A = req('src/manuscript/apertureModel.ts');
const { liftedConceptOf } = req('src/manuscript/liftedConceptModel.ts');
const { serializePage, parsePage } = req('src/manuscript/pageSnapshot.ts');
const { useManuscriptPageStore } = req('src/manuscript/pageStore.ts');
const { DoorTransportSection } = req('src/manuscript/DoorTransportSection.tsx');
const { ApertureGatePanel } = req('src/manuscript/ManuscriptChrome.tsx');
const React = require('react');
const { renderToString } = require('react-dom/server');

console.log("THE DOOR's ACT — the whole line-pair taken, the refusal at the parting edge or the record, the one-way reading refused, the transport riding the row (C-11a)\n");

const inv = (m) => { const o = new Map(); for (const [k, v] of m) o.set(v, k); return o; };
const comp = (g, f) => { const o = new Map(); for (const [x, y] of f) if (g.has(y)) o.set(x, g.get(y)); return o; };
const mapEq = (a, b) => a.size === b.size && [...a].every(([k, v]) => b.get(k) === v);
const toMap = (o) => new Map(Object.entries(o));
const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json');

// ═══ §1 THE FIXTURES — the reference's D8, number for number ═══
console.log('----- §1 the fixtures: the prism of two first faces (F · T · Φ), the translation door, 42 × 42 door pairs — the reference\'s census reproduced -----');
// the 42 hand triples, verbatim from the researcher's born_face_reading.py (HAND_TF · HAND_TP · J_FP); a face's J's: flow→T = inv(HAND_TF), T→Φ = HAND_TP, Φ→flow = inv(J_FP)
const HAND_TF = { A: { r9: 'F8', r1: 'F7', r0: 'F1', r2: 'F12', r8: 'F13' }, "B'": { r9: 'F3', r1: 'F9', r0: 'F5', r7: 'F13', r8: 'F1', r2: 'F7' }, C: { r9: 'F12', r1: 'F13', r0: 'F9', r6: 'F1', r2: 'F3' }, D: { r9: 'F12', r1: 'F1', r0: 'F2', r7: 'F7', r2: 'F5' }, S1: { r0: 'F13', r1: 'F9', r2: 'F1', r4: 'F12', r6: 'F3', r8: 'F7' }, S4: { r0: 'F13', r1: 'F9', r2: 'F1', r6: 'F3', r7: 'F5', r8: 'F7' }, S2: { r0: 'F9', r1: 'F3', r2: 'F13', r6: 'F10', r7: 'F5', r8: 'F12' } };
const HAND_TP = { P: { r0: 'Φ1', r1: 'Φ2', r2: 'Φ7', r4: 'Φ5', r6: 'Φ3' }, Q: { r9: 'Φ6', r1: 'Φ1', r0: 'Φ8', r7: 'Φ5', r6: 'Φ2' }, R: { r0: 'Φ1', r1: 'Φ6', r7: 'Φ5', r2: 'Φ7', r4: 'Φ8' } };
const J_FP = { '(i)': { F7: 'Φ1', F8: 'Φ2', F5: 'Φ7' }, '(ii)': { F1: 'Φ3', F2: 'Φ2', F3: 'Φ4', F5: 'Φ1' } };
const casts = [flow, tcell, phi];
const CORNERS = ['F', 'T', 'Φ'];
const faces = {};
for (const fp of Object.keys(J_FP)) for (const tf of Object.keys(HAND_TF)) for (const tp of Object.keys(HAND_TP)) faces[`${fp}+${tf}+${tp}`] = [inv(toMap(HAND_TF[tf])), toMap(HAND_TP[tp]), inv(toMap(J_FP[fp]))];
const names = Object.keys(faces);
const sides = Object.fromEntries(names.map((n) => [n, M.sideFrom(['F', 'T', 'Φ'], casts, faces[n], 'F·T·Φ')]));
const kinds = { path: 0, cycle: 0 };
for (const n of names) for (const l of sides[n].lines) kinds[l.kind] += 1;
check('§1 the 42 faces\' LINES: 803 (795 paths, 8 cycles) — the reference\'s line census', names.length === 42 && kinds.path === 795 && kinds.cycle === 8, J(kinds));
// (N) total at F / at every corner: the shape multiset of the lines touching corner 0 / of all lines — 42 classes of one each
const keyOf = (ls) => J([...ls.map((l) => l.shape)].sort());
const atF = new Set(names.map((n) => keyOf(sides[n].lines.filter((l) => l.nodes.some(([c]) => c === 0)))));
const full = new Set(names.map((n) => keyOf(sides[n].lines)));
check('§1 classes by (N) — a transport TOTAL AT F: 42 (every face its own class); total at every corner: 42', atF.size === 42 && full.size === 42, J([atF.size, full.size]));
// the identity control on the diagonal: a door between two copies of ONE triple, e = the identity — descends, record included, 42 of 42
let identOk = 0;
for (const n of names) {
  const e = [0, 1, 2].map((c) => new Map(casts[c].roles.map((r) => [r.id, r.id])));
  if (M.lawful(e, faces[n], faces[n]) && [0, 1, 2].every((c) => refusalOf(casts[c], casts[c], [...e[c]], []).length === 0)) identOk += 1;
}
check('§1 ★ CONTROL — a door between two copies of ONE triple, e = the identity: descends, record included, in 42 of 42', identOk === 42, identOk);
// the (shape, place) mechanism — carried IN-MEMORY here as the second reading of D2
const giftByLines = (i, x, y, SA, SB) => {
  const la = SA.place.get(`${i}|${x}`); const lb = SB.place.get(`${i}|${y}`);
  if (SA.lines[la.line].shape !== SB.lines[lb.line].shape) return { ok: false };
  if (SA.lines[la.line].kind === 'path') return { ok: la.idx === lb.idx, la: la.line, lb: lb.line, q: 0 };
  const L = SA.lines[la.line].nodes.length;
  return { ok: true, la: la.line, lb: lb.line, q: (((lb.idx - la.idx) % L) + L) % L / 3 };
};
const linePairMap = (la, lb, q, k) => {
  const e = [0, 1, 2].map(() => new Map());
  la.nodes.forEach(([c, x], p) => { const [c2, y] = la.kind === 'path' ? lb.nodes[p] : lb.nodes[(p + q * k) % lb.nodes.length]; if (c !== c2) throw new Error('a line pair off its corners'); e[c].set(x, y); });
  return e;
};
// the ONE-WAY reading — the first run's (N): forward propagation only, one diagonal of each strip — carried IN-MEMORY as the D10 control
const extendOneWay = (i, x, y, Jm, Km) => {
  const k = Jm.length; const e = [0, 1, 2].map(() => new Map()); const stack = [[i, x, y]];
  while (stack.length) { const [c, a, b] = stack.pop(); if (e[c].has(a)) { if (e[c].get(a) !== b) return null; continue; } e[c].set(a, b); if (Jm[c].has(a) !== Km[c].has(b)) return null; if (Jm[c].has(a)) stack.push([(c + 1) % k, Jm[c].get(a), Km[c].get(b)]); }
  return e;
};
const lawfulOneWay = (e, Jm, Km) => Jm.every((_, i) => mapEq(comp(e[(i + 1) % 3], Jm[i]), comp(Km[i], e[i])));
const out = {}; const bad = { d2: 0, d2law: 0, d2whole: 0, d3: 0, d10back: 0, unlawfulTaken: 0 };
let carried = [0, 0, 0]; let uniq = 0; let oneOnly = 0; let oneOnlyLaw = 0; const recCache = new Map(); const recRefused = [0, 0, 0]; const ex = {};
const t0 = Date.now();
for (const a of names) for (const b of names) {
  const SA = sides[a]; const SB = sides[b]; const Jm = SA.J; const Km = SB.J;
  if (!M.lawful([new Map(), new Map(), new Map()], Jm, Km)) bad.d3 += 1;
  const shapesB = new Set(SB.lines.map((l) => l.shape));
  for (const l of SA.lines) for (const [c] of l.nodes) { carried[c] += 0; }
  for (let c = 0; c < 3; c += 1) for (const r of casts[c].roles) { const p = SA.place.get(`${c}|${r.id}`); if (shapesB.has(SA.lines[p.line].shape)) carried[c] += 1; }
  const ca = {}; const cb = {};
  for (const l of SA.lines) ca[l.shape] = (ca[l.shape] || 0) + 1;
  for (const l of SB.lines) cb[l.shape] = (cb[l.shape] || 0) + 1;
  let nmax = 1;
  for (const s of Object.keys(ca)) { if (!cb[s]) continue; const [lo, hi] = [ca[s], cb[s]].sort((p, q) => p - q); const m = s.startsWith('cycle') ? Number(s.split(':')[1]) : 1; let perm = 1; for (let t = 0; t < lo; t += 1) perm *= hi - t; nmax *= perm * m ** lo; }
  if (nmax === 1) uniq += 1;
  for (let c = 0; c < 3; c += 1) for (const x of casts[c].roles) for (const y of casts[c].roles) {
    const ext = M.extendPair(c, x.id, y.id, Jm, Km);
    const gift = giftByLines(c, x.id, y.id, SA, SB);
    if (ext.taken !== gift.ok) bad.d2 += 1;
    const one = extendOneWay(c, x.id, y.id, Jm, Km);
    if (one && lawfulOneWay(one, Jm, Km) && !M.lawful(one, Jm, Km)) { oneOnly += 1; if (ext.taken) oneOnlyLaw += 1; }
    if (!ext.taken) {
      const key = `${c}|${ext.refusal.kind}`; out[key] = (out[key] || 0) + 1;
      if (!ex[key]) ex[key] = `door ${a} → ${b}, ${x.id} ↦ ${y.id}: ${M.refusalWords(SA, SB, ext.refusal, (v) => v)}`;
      continue;
    }
    out[`${c}|taken`] = (out[`${c}|taken`] || 0) + 1;
    if (!M.lawful(ext.e, Jm, Km)) bad.d2law += 1;
    const want = linePairMap(SA.lines[gift.la], SB.lines[gift.lb], gift.q, 3);
    if (!ext.e.every((m, d) => mapEq(m, want[d]))) bad.d2whole += 1;
    let refused = false;
    for (let d = 0; d < 3; d += 1) { if (!ext.e[d].size) continue; const k = `${d}|${[...ext.e[d]].sort().map(([p, q]) => `${p}>${q}`).join(',')}`; let r = recCache.get(k); if (r === undefined) { r = refusalOf(casts[d], casts[d], [...ext.e[d]], []); recCache.set(k, r); } if (r.length) { refused = true; if (!ex[`${c}|record`]) ex[`${c}|record`] = `door ${a} → ${b}, ${x.id} ↦ ${y.id}: ${M.refusalWords(SA, SB, { kind: 'record', corner: d, conflicts: r }, (v) => v)}`; break; } }
    if (refused) recRefused[c] += 1;
  }
}
note(`census in ${Date.now() - t0} ms: ${J(out)} · record refused ${J(recRefused)} · roles a door CAN carry ${J(carried)} of ${J([14 * 1764, 10 * 1764, 9 * 1764])} · largest lawful transport unique ${uniq} of 1764 · one-way admits and two-way refuses ${oneOnly}`);
for (const k of Object.keys(ex).sort()) note(`e.g. ${k}: ${ex[k]}`);
check('§1 ★★ THE REFERENCE\'S CENSUS, NUMBER FOR NUMBER (D8 — ONE POINTED PAIR at F: taken 90036 · refused by the lines 255708 = along 184742 + into 70542 + rounds 424; at T: 26416 · 96668 + 53012 + 304; at Φ: 19480 · 72174 + 51006 + 224) — the second implementation agrees with the reference on 665,028 pointed pairs',
  out['0|taken'] === 90036 && out['0|along'] === 184742 && out['0|into'] === 70542 && out['0|rounds'] === 424 && out['1|taken'] === 26416 && out['1|along'] === 96668 && out['1|into'] === 53012 && out['1|rounds'] === 304 && out['2|taken'] === 19480 && out['2|along'] === 72174 && out['2|into'] === 51006 && out['2|rounds'] === 224, J(out));
check('§1 ★★ THE RECORD REFUSAL: of the taken, refused by the record — F 0 · T 0 · Φ 5880 (the reference\'s glue and jRegister\'s refusalOf agree; the Φ refusals are the mold\'s member_status said two ways on one glued tuple)', J(recRefused) === J([0, 0, 5880]), J(recRefused));
check('§1 ★ D2 — one pointed pair: the extension exists ⇔ equal shape and place (0 disagreements against the (shape, place) mechanism), the extension is lawful two-way (0 failures), and it is EXACTLY the whole line-pair (0 failures)', bad.d2 === 0 && bad.d2law === 0 && bad.d2whole === 0, J(bad));
check('§1 ★ D3 — the EMPTY transport always descends: refused on 0 of 1764 doors', bad.d3 === 0, bad.d3);
check('§1 the roles a door CAN carry (their line has an equal-shape line opposite): F 18714 of 24696 · T 12434 of 17640 · Φ 10269 of 15876; doors whose largest lawful transport is unique: 0 of 1764 — the reference\'s numbers', J(carried) === J([18714, 12434, 10269]) && uniq === 0, J([carried, uniq]));
check('§1 ★★ THE D10 CONTROL — the ONE-WAY reading (forward propagation, one diagonal of each strip, carried in-memory) ADMITS pointed pairs the two-way condition REFUSES (> 0), and never the reverse (every pair the model takes is lawful one-way too, by construction of (N))', oneOnly > 0 && oneOnlyLaw === 0, J([oneOnly, oneOnlyLaw]));
check('§1 every refusal class reads in the one grammar — `not taken — along F→T, …\'s line runs on and …\'s stops` · `not taken — into … from …, … has a predecessor and … has none` · `not taken — at …, …\'s line and …\'s close after different rounds` · `not taken — at Φ, the record would say two things about member_status(…): … here, … there`',
  /^door .*: not taken — along [FTΦ]→[FTΦ], .*'s line runs on and .*'s stops$/.test(ex['0|along']) && /not taken — into [FTΦ] from [FTΦ], .* has a predecessor and .* has none$/.test(ex['0|into']) && /not taken — at [FTΦ], .*'s line and .*'s close after different rounds$/.test(ex['0|rounds']) && /not taken — at Φ, the record would say two things about member_status\(Φ\d+\): (has|none-by-nature|unrecorded) here, (has|none-by-nature|unrecorded) there$/.test(ex['2|record']),
  J([ex['0|along'], ex['0|into'], ex['0|rounds'], ex['2|record']]));

// ═══ §2 THE LAWFUL PATH ═══
console.log('\n----- §2 the lawful path: the residue at A lifted, loaded through the shelf\'s door; the door A·AC·AB ~ A·AB·AD on the hinge candidate, read on the record -----');
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
const G2id = cur().id;
const bornPairOn = (X, Y) => {
  const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y));
  const R0 = spaceOf(cur(), e.vertexIds[0]); const R1 = spaceOf(cur(), e.vertexIds[1]);
  const c = composedOn(cur(), R0, R1, [e.vertexIds[0], e.vertexIds[1]], 'medial');
  const dom = new Set(c.roles.map(([x]) => x)); const im = new Set(c.roles.map(([, y]) => y));
  for (const x of R0.space.roles.map((r) => r.id).filter((id) => !dom.has(id))) for (const y of R1.space.roles.map((r) => r.id).filter((id) => !im.has(id))) {
    S().giveRolePair(e.id, x, y);
    if (cur().edges.find((f) => f.id === e.id).identification?.roles.some(([a, b]) => a === x && b === y)) return { x: nameIn(R0.space, x), y: nameIn(R1.space, y) };
    S().withdrawMidpointAttempt(e.id);
  }
  return null;
};
const born = bornPairOn('AB', 'AC');
note(`the born pair on AB–AC: ${born ? `${born.x} ↦ ${born.y}` : 'NONE'}`);
const liftOf = (shapeId, pick) => {
  S().selectShape(shapeId); S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection();
  S().selectCell(pick(cur()).id);
  const before = useLiftStore.getState().queue.length;
  S().liftSelectionToManuscript();
  return useLiftStore.getState().queue[before].file;
};
const residueAt = (shape, label) => shape.cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(byLabel(shape, label)) && c.vertexIds.length === 4);
const doorOn = (file) => {
  const entry = loadUniverseSnapshot(file);
  const form = placeShelfEntry(entry, 0);
  const concept = liftedConceptOf(form, entry.loaded.ancestors ?? []);
  const shape = form.shape; const record = concept.record;
  const lab = (v) => shape.vertices[v]?.data.label || v;
  const menu = A.boundaryFacesOf(shape);
  const faceWith = (set) => menu.find((m) => { const t = m.label.split(' · ')[0].split('·'); return t.length === set.length && set.every((x) => t.includes(x)); });
  const fA = faceWith(['A', 'AB', 'AC']); const fB = faceWith(['A', 'AB', 'AD']);
  const cands = A.dihedralMapCandidates(shape, fA.id, fB.id);
  const hinge = cands.find((c) => c.correspondence.every(([a, b]) => lab(a) === lab(b) || (lab(a) === 'AC' && lab(b) === 'AD')));
  const cycleA = hinge.correspondence.map(([a]) => a); const cycleB = hinge.correspondence.map(([, b]) => b);
  const memo = new Map();
  const nameA = fA.label.split(' · ')[0]; const nameB = fB.label.split(' · ')[0];
  const SA = M.sideOf(record, cycleA, memo, nameA); const SB = M.sideOf(record, cycleB, memo, nameB);
  const verdicts = cands.map((c) => { try { const v = A.buildPersonDomainVerdict(shape, [{ faceA: fA.id, faceB: fB.id, candidateKey: c.key }], 'k', 't'); return `${c.key} ${v.folded ? 'FOLDED' : `sound=${v.domain.tower.sound} H1=${v.domain.tower.homology.H1.pretty}`}`; } catch (e) { return `${c.key} THROWS (${e.message.slice(0, 60)}…)`; } });
  return { file, entry, form, concept, shape, record, lab, menu, fA, fB, cands, hinge, cycleA, cycleB, SA, SB, verdicts, nameA, nameB };
};
const D1 = doorOn(liftOf(G1id, (s) => residueAt(s, 'A')));
const D2 = doorOn(liftOf(G2id, (s) => residueAt(s, 'A')));
note(`gen-1 residue: ${Object.keys(D1.shape.vertices).length} corners · concept ${D1.concept.state} ${D1.concept.held}/${D1.concept.resolved} · menu ${D1.menu.map((m) => m.label).join(' | ')} · hinge ${D1.hinge.key} ${D1.hinge.correspondence.map(([a, b]) => `${D1.lab(a)}→${D1.lab(b)}`).join(' · ')} (${D1.hinge.derivedMode}) · verdicts ${D1.verdicts.join(' · ')}`);
note(`gen-2 residue: ${Object.keys(D2.shape.vertices).length} corners (the grain law) · hinge ${D2.hinge.key} · verdicts ${D2.verdicts.join(' · ')}`);
check('§2 the door\'s faces are D14-named (never ids) and the hinge candidate exists on both lifted residues: A→A · AC→AD · AB→AB (preserving, derived); on the gen-1 residue it glues SOUND (H₁ = 0) — a room, not a fold', /^A·A[BC]·A[BC]$/.test(D1.nameA) && /^A·A[BD]·A[BD]$/.test(D1.nameB) && D1.hinge.derivedMode === 'preserving' && D2.hinge && D1.verdicts.some((v) => v.startsWith(`${D1.hinge.key} sound=true H1=0`)), J([D1.nameA, D1.nameB, D1.verdicts]));
note(`the gen-2 residue's glue: every candidate ${D2.verdicts.every((v) => /THROWS/.test(v)) ? 'THROWS in the level-3 link extractor (a cell whose shared face is subdivided — the grain law\'s residue cannot be glued today; printed, not pinned)' : 'does not throw'}`);
const shapesOf = (Sd) => { const c = {}; for (const l of Sd.lines) c[l.shape] = (c[l.shape] || 0) + 1; return c; };
check('§2 ★★ THE SIDES READ ON THE RECORD (the one resolver at every corner, each boundary edge\'s J by its kind — the seed edge A–AC the person\'s record, the corner edge AB→A the carried coprojection, the medial edge AC→AB the anchored meet): on the gen-1 residue face A·AC·AB has 28 lines (14 cycles of one round — A\'s roles carried all the way round — and 7 + 7 lines of one at AC and AB) and face A·AB·AD 30 (14 cycles, 9 + 7); both J\'s of the hinge edge identical (the same edge, read the same way)',
  D1.SA.state === 'read' && D1.SB.state === 'read' && J(shapesOf(D1.SA.side)) === J({ 'path:1:0': 7, 'path:2:0': 7, 'cycle:1': 14 }) && J(shapesOf(D1.SB.side)) === J({ 'path:1:0': 9, 'path:2:0': 7, 'cycle:1': 14 }) && mapEq(D1.SA.side.J[2], D1.SB.side.J[2]), J([D1.SA.state, D1.SB.state, D1.SA.state === 'read' ? shapesOf(D1.SA.side) : null, D1.SB.state === 'read' ? shapesOf(D1.SB.side) : null]));
const censusOn = (D) => {
  const out2 = {}; const eg = {};
  for (let i = 0; i < 3; i += 1) for (const x of D.SA.side.spaces[i].roles) for (const y of D.SB.side.spaces[i].roles) {
    const r = M.actAt(D.SA.side, D.SB.side, [], i, x.id, y.id);
    const key = `${D.lab(D.cycleA[i])} ${r.taken ? 'taken' : r.refusal.kind}`;
    out2[key] = (out2[key] || 0) + 1;
    if (!eg[key]) eg[key] = r.taken ? { pair: `${nameIn(D.SA.side.spaces[i], x.id)} ↦ ${nameIn(D.SB.side.spaces[i], y.id)}`, words: M.takenWords(D.SA.side, D.SB.side, r.e, i, x.id, y.id, D.lab), transports: r.transports } : { pair: `${nameIn(D.SA.side.spaces[i], x.id)} ↦ ${nameIn(D.SB.side.spaces[i], y.id)}`, words: M.refusalWords(D.SA.side, D.SB.side, r.refusal, D.lab), x: x.id, y: y.id, i };
  }
  return { out: out2, eg };
};
const C1 = censusOn(D1); const C2 = censusOn(D2);
note(`gen-1 door outcomes: ${J(C1.out)}`);
for (const k of Object.keys(C1.eg)) note(`  e.g. ${k}: ${C1.eg[k].pair} → ${C1.eg[k].words}`);
note(`gen-2 door outcomes: ${J(C2.out)}`);
for (const k of Object.keys(C2.eg)) note(`  e.g. ${k}: ${C2.eg[k].pair} → ${C2.eg[k].words}`);
check('§2 ★★ EVERY POINTED PAIR ON THE GEN-1 DOOR, on an empty transport: at A 196 taken (every F-role pair — the 14 cycles pair at their place); at AC 245 taken · 224 refused along AC→AB · 14 refused by the RECORD; at AB 245 taken · 196 refused along AB→A — no other class', J(C1.out) === J({ 'A taken': 196, 'AC taken': 245, 'AC along': 224, 'AC record': 14, 'AB taken': 245, 'AB along': 196 }), J(C1.out));
check('§2 ★★ TAKEN — THE WHOLE LINE, EACH PAIR AT ITS CORNER (C-12a item 1): F1 ↦ F1 at A takes with it the whole cycle along A→AC→AB→A (at A F1 ↦ F1 · at AC Φ1 ≡ F1 ↦ F1 · at AB F1 ≡ r0 ↦ F1 ≡ r0), and the transport records ONE entry per corner pair, one role pair each, the word pairs empty', /^taken — F1 ↦ F1 at A, and with it the whole line along A→AC→AB→A: at A F1 ↦ F1 · at AC Φ1 ≡ F1 ↦ F1 · at AB F1 ≡ r0 ↦ F1 ≡ r0$/.test(C1.eg['A taken'].words) && C1.eg['A taken'].transports.length === 3 && C1.eg['A taken'].transports.every((t) => t.roles.length === 1 && t.types.length === 0), J(C1.eg['A taken']));
check('§2 ★★ REFUSED BY THE LINES at the edge where they part: `not taken — along AC→AB, Φ1 ≡ F1\'s line runs on and Φ1\'s stops` (one continues and the other stops)', /^not taken — along AC→AB, Φ1 ≡ F1's line runs on and Φ1's stops$/.test(C1.eg['AC along'].words), C1.eg['AC along'].words);
check('§2 ★★ REFUSED BY THE RECORD at a corner, the tuple named: `not taken — at AC, the record would say two things about member_status(Φ2): has here, none-by-nature there` (Φ2 ↦ Φ9 — two phi casts, the mold\'s unary said two ways on the glued tuple)', /^not taken — at AC, the record would say two things about member_status\(Φ\d+\): (has|none-by-nature) here, (has|none-by-nature) there$/.test(C1.eg['AC record'].words), C1.eg['AC record'].words);
// the standing transport: an act, the form, the withdrawal, the reading
const act1 = M.actAt(D1.SA.side, D1.SB.side, [], 0, 'F1', 'F1');
const standing = act1.transports;
const again = M.actAt(D1.SA.side, D1.SB.side, standing, 0, 'F1', 'F5');
const other = M.actAt(D1.SA.side, D1.SB.side, standing, 0, 'F5', 'F1');
const second = M.actAt(D1.SA.side, D1.SB.side, standing, 0, 'F5', 'F5');
const reading = M.doorReadingOf(D1.SA.side, D1.SB.side, second.taken ? second.transports : standing, D1.lab);
note(`the standing transport after F1 ↦ F1 and F5 ↦ F5: ${reading.pairs} pairs on ${reading.lines.length} lines · ${reading.lines.map((l) => `[${l.words} — ${l.hand}]`).join(' ')} · lawful ${reading.lawful}`);
check('§2 ★ THE FORM: a role already on a line of the person\'s is not pointed again — `not taken — F1 is already on a line of yours (F1 ↦ F1 — withdraw that line to point it again)` on either side; a second line on untaken roles is taken; the standing transport of two whole lines is lawful two-way and reads as two lines with ONE hand each', !again.taken && again.refusal.kind === 'form' && /^not taken — F1 is already on a line of yours \(F1 ↦ F1 — withdraw that line to point it again\)$/.test(M.refusalWords(D1.SA.side, D1.SB.side, again.refusal, D1.lab)) && !other.taken && other.refusal.kind === 'form' && second.taken && reading.lawful && reading.lines.length === 2 && reading.pairs === 6 && reading.lines.every((l) => /^yours · a whole line along A→AC→AB→A: /.test(l.words) && /^withdraw the line F[15] ↦ F[15]$/.test(l.hand)), J([again.taken ? 'taken' : M.refusalWords(D1.SA.side, D1.SB.side, again.refusal, D1.lab), other.taken, second.taken, reading.lines.map((l) => [l.words, l.hand])]));
const withdrawn = M.withdrawLine(D1.SA.side, D1.SB.side, second.transports, 0, 'F1');
const afterW = M.doorReadingOf(D1.SA.side, D1.SB.side, withdrawn, D1.lab);
const allGone = M.withdrawLine(D1.SA.side, D1.SB.side, withdrawn, 0, 'F5');
check('§2 ★ THE WHOLE-LINE WITHDRAWAL: `withdraw the line F1 ↦ F1` removes its three pairs and leaves F5\'s line standing (3 pairs, 1 line); withdrawing that too leaves the empty transport — a true absence (no entry at all), lawful', afterW.pairs === 3 && afterW.lines.length === 1 && afterW.lines[0].head === 'F5 ↦ F5' && allGone.length === 0 && M.lawful(M.transportMaps(D1.SA.side, D1.SB.side, allGone), D1.SA.side.J, D1.SB.side.J), J([afterW.pairs, afterW.lines.length, allGone.length]));
check('§2 the empty transport on the gen-1 door is lawful, and the reading says no role is barred: every role of both faces has an equal-shape line opposite (the cannot-cross line absent)', M.doorReadingOf(D1.SA.side, D1.SB.side, [], D1.lab).lawful && M.doorReadingOf(D1.SA.side, D1.SB.side, [], D1.lab).cannotCross === null);
// the gen-2 residue: the born pair's line, the cannot-cross line, the 'into' class and the one-way control on the record
const R2 = M.doorReadingOf(D2.SA.side, D2.SB.side, [], D2.lab);
note(`gen-2 door: A ${J(shapesOf(D2.SA.side))} · B ${J(shapesOf(D2.SB.side))} · cannot cross: ${R2.cannotCross}`);
// the one-way reading's blind spot is a role at the END of a path on the face called B (a predecessor there, none on A, nothing
// ahead on either): (N)'s one diagonal sees A's predecessors through J and never B's through K — so the SAME door is read from
// BOTH faces (the reference's D10: the one-way reading depends on which face is called A; the two-way does not)
const oneWayOnly = (SA, SB, lab, cycle) => {
  let n = 0; let ex = null;
  for (let i = 0; i < 3; i += 1) for (const x of SA.spaces[i].roles) for (const y of SB.spaces[i].roles) {
    const one = extendOneWay(i, x.id, y.id, SA.J, SB.J);
    if (one && lawfulOneWay(one, SA.J, SB.J) && !M.lawful(one, SA.J, SB.J)) { n += 1; const r = M.extendPair(i, x.id, y.id, SA.J, SB.J); if (!ex) ex = { pair: `${nameIn(SA.spaces[i], x.id)} ↦ ${nameIn(SB.spaces[i], y.id)} at ${lab(cycle[i])}`, taken: r.taken, kind: r.taken ? null : r.refusal.kind, words: r.taken ? null : M.refusalWords(SA, SB, r.refusal, lab) }; }
  }
  return { n, ex };
};
const fromA = oneWayOnly(D2.SA.side, D2.SB.side, D2.lab, D2.cycleA);
const fromB = oneWayOnly(D2.SB.side, D2.SA.side, D2.lab, D2.cycleB);
const gen1FromA = oneWayOnly(D1.SA.side, D1.SB.side, D1.lab, D1.cycleA);
const gen1FromB = oneWayOnly(D1.SB.side, D1.SA.side, D1.lab, D1.cycleB);
note(`one-way admits and two-way refuses — the gen-2 door read with A·AC·AB as A: ${fromA.n} · read with A·AB·AD as A: ${fromB.n} (e.g. ${J(fromB.ex)}) · the gen-1 door: ${gen1FromA.n} · ${gen1FromB.n}`);
check('§2 ★★ THE BORN PAIR IS EXACTLY WHAT CANNOT CROSS: on the gen-2 residue the person\'s born pair on AB–AC rides the record as one line of length one (Φ2 at AC → r1 at AB) with no equal-shape line opposite, and the door says so ONCE, quietly — `cannot cross this door — no line opposite: on A·AC·AB Φ2 at AC · r1 at AB`; every other role can cross', J(shapesOf(D2.SA.side)) === J({ 'path:1:1': 1, 'path:1:0': 6, 'path:2:0': 6, 'cycle:1': 14 }) && /^cannot cross this door — no line opposite: on A·AC·AB [^ ]+ at AC · [^ ]+ at AB$/.test(R2.cannotCross || ''), J([shapesOf(D2.SA.side), R2.cannotCross]));
check('§2 ★★ THE ONE-WAY CONTROL ON THE RECORD (D10 — the one-way reading depends on which face is called A; the model does not): the gen-2 door read with the born pair\'s face as A admits nothing one-way that the two-way refuses (no path ends on the other face), but read the OTHER way it does (> 0): the born pair\'s line ends at r1 on AB, and the one-way reading lets the other face\'s r1 cross to it — the model refuses it from either face, into AB, naming the faces since the names coincide (`not taken — into AB from AD, r1 (on A·AC·AB) has a predecessor and r1 (on A·AB·AD) has none`); the gen-1 door, with no path of length one, has none either way', fromA.n === 0 && fromB.n > 0 && fromB.ex && !fromB.ex.taken && fromB.ex.kind === 'into' && /^not taken — into AB from AD, r1 \(on A·AC·AB\) has a predecessor and r1 \(on A·AB·AD\) has none$/.test(fromB.ex.words) && gen1FromA.n === 0 && gen1FromB.n === 0, J([fromA.n, fromB.n, fromB.ex, gen1FromA.n, gen1FromB.n]));

// ═══ §3 PERSISTENCE ═══
console.log('\n----- §3 persistence: the transport rides the row into the built record and the page file; a save → load round trip carries it verbatim; the restored record reads the same lines -----');
const rowsWith = [{ faceA: D1.fA.id, faceB: D1.fB.id, candidateKey: D1.hinge.key, transports: second.transports }, { faceA: null, faceB: null, candidateKey: null }];
const verdictWith = A.buildPersonDomainVerdict(D1.shape, rowsWith, 'built-1', 'built 3-manifold 1');
const verdictWithout = A.buildPersonDomainVerdict(D1.shape, rowsWith.map((r) => ({ faceA: r.faceA, faceB: r.faceB, candidateKey: r.candidateKey })), 'built-1', 'built 3-manifold 1');
check('§3 ★ THE GLUE IGNORES THE TRANSPORT: the verdict door on rows carrying transports is the verdict on the same rows without them (sound, the same H₁, the same pairing map) — the transport is beside FacePairing, never inside it', !verdictWith.folded && !verdictWithout.folded && verdictWith.domain.tower.homology.H1.pretty === verdictWithout.domain.tower.homology.H1.pretty && J(verdictWith.domain.pairs) === J(verdictWithout.domain.pairs), J([verdictWith.folded, verdictWithout.folded]));
const P = useManuscriptPageStore;
P.setState({ written: [], shelf: [], shelfFiles: [], shelfAncestors: new Map(), builtRecords: [], builtDomains: [], foldedBodies: [], builtCount: 0, zooLoaded: false, metricBaseIds: {}, metricBaseRefusals: {}, laidBodies: new Map(), acts: [], removals: [] });
const built = { door: 'glue', key: 'built-1', title: 'built 3-manifold 1', seed: D1.shape, rows: rowsWith.map((r) => ({ ...r })), baseId: null, baseRefusal: null };
P.getState().recordShelfFile(D1.file);
P.getState().recordBuilt(built);
P.getState().bumpBuiltCount();
const records = P.getState().pageRecords();
const fileJson = JSON.stringify(serializePage(records));
const parsed = parsePage(JSON.parse(fileJson));
P.setState({ written: [], shelf: [], shelfFiles: [], shelfAncestors: new Map(), builtRecords: [], builtDomains: [], foldedBodies: [], builtCount: 0 });
const refusals = P.getState().loadPage(parsed);
const restored = P.getState().builtRecords[0];
const restoredRecord = P.getState().shelfAncestors.get(restored.seed.id)?.[0] ?? null;
note(`the page file ${fileJson.length} B · refusals on load ${J(refusals)} · restored rows ${J(restored.rows.map((r) => ({ faceA: r.faceA, faceB: r.faceB, candidateKey: r.candidateKey, transports: r.transports ? r.transports.length : null })))} · built domains ${P.getState().builtDomains.length} · the record ${restoredRecord ? `holds ${Object.keys(restoredRecord.vertices).length} vertices` : 'ABSENT'}`);
check('§3 ★★ THE TRANSPORT SURVIVES THE PAGE ROUND TRIP VERBATIM: serializePage → JSON → parsePage → loadPage; the built record\'s rows carry the transports byte-equal (three entries, corner pairs and role pairs as given, the open row without the field), the room restored through the same door (one built domain, no refusal), and the page file holds no line, no space, no verdict of the door — the record, not the reading', refusals.length === 0 && J(restored.rows[0].transports) === J(second.transports) && !('transports' in restored.rows[1]) && P.getState().builtDomains.length === 1 && !/"lines"|"lawful"|"place"|"cannotCross"/.test(fileJson), J([refusals, restored.rows[0].transports && restored.rows[0].transports.length, Object.keys(restored.rows[1])]));
const memoR = new Map();
const SAr = restoredRecord ? M.sideOf(restoredRecord, D1.cycleA, memoR, D1.nameA) : null; const SBr = restoredRecord ? M.sideOf(restoredRecord, D1.cycleB, memoR, D1.nameB) : null;
const readingR = SAr && SAr.state === 'read' && SBr.state === 'read' ? M.doorReadingOf(SAr.side, SBr.side, restored.rows[0].transports, D1.lab) : null;
check('§3 ★★ THE RESTORED RECORD READS THE SAME DOOR: the shelf\'s ancestor re-loaded under the seed\'s own id holds every corner of the door; the sides re-derived on it draw the same lines (28 · 30, the same shapes), the restored transport is lawful two-way on them and reads as the same two lines with the same hands', readingR !== null && J(shapesOf(SAr.side)) === J(shapesOf(D1.SA.side)) && J(shapesOf(SBr.side)) === J(shapesOf(D1.SB.side)) && readingR.lawful && readingR.pairs === 6 && J(readingR.lines.map((l) => [l.words, l.hand])) === J(reading.lines.map((l) => [l.words, l.hand])), J([readingR && readingR.lawful, readingR && readingR.pairs, readingR && readingR.lines.map((l) => l.hand)]));

// ═══ §4 THE SURFACE under node ═══
console.log('\n----- §4 the surface: the section\'s words under node — the empty state, the taken line with one hand, the refusal with its local hand, the cannot-cross line; the chrome mounts it under the row; the view\'s wiring -----');
const paper = { cardBackground: '#fff', cardBorder: '#ccc', cardInk: '#222' };
const strip = (html) => html.replace(/<!-- -->/g, '').replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const txt = (html) => strip(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const viewOf = (D, transports, extra = {}) => ({ faceA: D.nameA, faceB: D.nameB, state: 'read', absence: null, reading: M.doorReadingOf(D.SA.side, D.SB.side, transports, D.lab), pick: null, notice: null, refusal: null, ...extra });
const noop = { onPick: () => {}, onWithdrawLine: () => {}, onWithdrawAttempt: () => {} };
const emptyHtml = strip(renderToString(React.createElement(DoorTransportSection, { door: viewOf(D1, []), ...noop, paper })));
const takenView = viewOf(D1, second.transports, { notice: M.takenWords(D1.SA.side, D1.SB.side, second.e, 0, 'F5', 'F5', D1.lab) });
const takenHtml = strip(renderToString(React.createElement(DoorTransportSection, { door: takenView, ...noop, paper })));
const refusedHtml = strip(renderToString(React.createElement(DoorTransportSection, { door: viewOf(D1, second.transports, { refusal: C1.eg['AC along'].words }), ...noop, paper })));
const gen2Html = strip(renderToString(React.createElement(DoorTransportSection, { door: viewOf(D2, []), ...noop, paper })));
const roleCount = (D) => D.SA.side.spaces.reduce((n, s) => n + s.roles.length, 0) + D.SB.side.spaces.reduce((n, s) => n + s.roles.length, 0);
const countOf = (s, re) => (s.match(re) || []).length;
check('§4 ★★ THE EMPTY STATE is a positive mark, the designer\'s words verbatim: `the door A·AC·AB → A·AB·AD — glued by you · carries no concept yet: a cargo crossing it arrives did not return`; the three corner pairs with both sides\' roles as chips (114 on the gen-1 door), no line, no hand', new RegExp(`data-door-empty="true">the door ${D1.nameA} → ${D1.nameB} — glued by you · carries no concept yet: a cargo crossing it arrives did not return<`).test(emptyHtml) && countOf(emptyHtml, /data-door-corner="/g) === 3 && countOf(emptyHtml, /data-door-role="/g) === roleCount(D1) && roleCount(D1) === 114 && !/data-door-line=/.test(emptyHtml) && !/data-door-withdraw/.test(emptyHtml), J([countOf(emptyHtml, /data-door-role="/g), roleCount(D1)]));
check('§4 ★★ NOTHING OFFERED, NOTHING LIT: a role that can cross and one that cannot wear the SAME chip (one style over all 114 chips of the empty door — nothing differs by `crosses`); only a role on a taken line is marked (bold, `data-door-role-taken` naming its partner: 12 chips for 6 pairs, both sides) and only the picked one outlined', (() => { const chips = [...emptyHtml.matchAll(/<button[^>]*data-door-role="[^"]*"[^>]*>/g)].map((m) => m[0].replace(/data-door-role="[^"]*"|data-door-role-name="[^"]*"|data-door-role-crosses="(true|false)"|title="[^"]*"/g, '')); return chips.length === 114 && new Set(chips).size === 1; })() && countOf(takenHtml, /data-door-role-taken="/g) === 12 && countOf(emptyHtml, /data-door-role-taken="/g) === 0 && countOf(emptyHtml, /data-door-role-picked/g) === 0, J([countOf(takenHtml, /data-door-role-taken="/g)]));
check('§4 ★★ TAKEN — THE WHOLE LINE, ONE HAND, EACH PAIR AT ITS CORNER (C-12a item 1): two lines read `yours · a whole line along A→AC→AB→A: at A F1 ↦ F1 · at AC Φ1 ≡ F1 ↦ F1 · at AB F1 ≡ r0 ↦ F1 ≡ r0` and F5\'s; exactly ONE `withdraw the line …` hand per line (2 hands for 6 pairs — never a hand per pair); the head reads `carries 6 role pairs on 2 whole lines`; the TAKEN sentence names the pointed pair and the whole line', countOf(takenHtml, /data-door-line="/g) === 2 && countOf(takenHtml, /data-door-withdraw-line="/g) === 2 && /yours · a whole line along A→AC→AB→A: at A F1 ↦ F1 · at AC Φ1 ≡ F1 ↦ F1 · at AB F1 ≡ r0 ↦ F1 ≡ r0/.test(takenHtml) && countOf(takenHtml, />withdraw the line F[15] ↦ F[15]</g) === 2 && /carries 6 role pairs on 2 whole lines/.test(takenHtml) && /data-door-taken="true"[^>]*>taken — F5 ↦ F5 at A, and with it the whole line along A→AC→AB→A: at A F5 ↦ F5 · at AC /.test(takenHtml), J([countOf(takenHtml, /data-door-line="/g), countOf(takenHtml, /data-door-withdraw-line="/g)]));
check('§4 ★★ THE REFUSAL in the one grammar with its LOCAL hand: `not taken — along AC→AB, Φ1 ≡ F1\'s line runs on and Φ1\'s stops` · `here, at the door: withdraw this attempt` (one hand, a button); the standing lines keep theirs', /data-door-refusal-words="true"[^>]*>not taken — along AC→AB, Φ1 ≡ F1's line runs on and Φ1's stops</.test(refusedHtml) && countOf(refusedHtml, /data-door-withdraw-attempt="true"[^>]*>here, at the door: withdraw this attempt</g) === 1 && countOf(refusedHtml, /data-door-withdraw-line="/g) === 2);
check('§4 ★ THE CANNOT-CROSS LINE, once per door, quietly (italic, dimmed) — on the gen-2 door `cannot cross this door — no line opposite: on A·AC·AB … at AC · … at AB`; absent on the gen-1 door', countOf(gen2Html, /data-door-cannot-cross="true"/g) === 1 && /cannot cross this door — no line opposite: on A·AC·AB [^<]+ at AC · [^<]+ at AB</.test(gen2Html) && /data-door-cannot-cross="true" style="[^"]*font-style:italic/.test(gen2Html) && countOf(emptyHtml, /data-door-cannot-cross/g) === 0);
const absentHtml = strip(renderToString(React.createElement(DoorTransportSection, { door: { faceA: 'A·B·C', faceB: 'A·B·D', state: 'no-record', absence: 'nothing carried — this form was not lifted from a universe (invoked primitive): no corner of this door holds a space, so nothing can cross it', reading: null, pick: null, notice: null, refusal: null }, ...noop, paper })));
check('§4 a door on a form that carries no record says C-10\'s absence and mounts no chip, no line, no hand', /data-door-absence="no-record"[^>]*>nothing carried — this form was not lifted from a universe/.test(absentHtml) && !/data-door-role=/.test(absentHtml) && !/data-door-withdraw/.test(absentHtml));
// the chrome: the panel mounts the section under the complete row, with the three selects addressable
const rowView = { faceA: D1.fA.id, faceB: D1.fB.id, mapKey: D1.hinge.key, faceChoicesA: D1.menu, faceChoicesB: D1.menu, mapChoices: D1.cands.map((c) => ({ key: c.key, label: A.describeCandidate(c, (v) => A.cornerDisplayName(D1.shape, v)) })), mapRefusal: null, door: takenView };
const panelHtml = strip(renderToString(React.createElement(ApertureGatePanel, { rows: [rowView, { faceA: '', faceB: '', mapKey: '', faceChoicesA: D1.menu, faceChoicesB: D1.menu, mapChoices: [], mapRefusal: null, door: null }], faceCount: 4, unpairedFaceCount: 2, parity: null, refusal: null, pristine: false, notice: null, onPickFaceA: () => {}, onPickFaceB: () => {}, onPickMap: () => {}, onGlue: () => {}, onLeaveBounded: null, wall: null, onClose: () => {}, paper, accent: '#a52', onDoorPick: () => {}, onDoorWithdrawLine: () => {}, onDoorWithdrawAttempt: () => {} })));
check('§4 ★ THE CHROME mounts the section under the complete row (one `data-door` in a two-row panel; the open row carries none), between the map select and the exits; the three selects addressable (`data-aperture-select` faceA · faceB · map, twice)', countOf(panelHtml, /data-door="/g) === 1 && countOf(panelHtml, /data-aperture-select="faceA"/g) === 2 && countOf(panelHtml, /data-aperture-select="map"/g) === 2 && panelHtml.indexOf('data-aperture-select="map"') < panelHtml.indexOf('data-door="') && panelHtml.indexOf('data-door="') < panelHtml.indexOf('glue — the S² gate judges'), J([countOf(panelHtml, /data-door="/g)]));
// the view's wiring and the purity of the model
const view = readLf('src/manuscript/ManuscriptView.tsx');
const chrome = readLf('src/manuscript/ManuscriptChrome.tsx');
const model = readLf('src/manuscript/doorTransportModel.ts');
const section = readLf('src/manuscript/DoorTransportSection.tsx');
const manifest = readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt');
const froms = (src) => [...src.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
check('§4 ★ THE VIEW wires the act: the sides re-derived per door identity on the C-10 reader\'s record (`sideOf(liftedConcept.record, …, doorFaceName(row.faceA))` — each side named by its face\'s D14 name), the three hands (pick · withdraw line · withdraw attempt) threaded to the panel once, a changed face or map a NEW door (a fresh row of three fields), the transport written on the row by `actAt`\'s result and read back by `doorReadingOf`; every glue exit and the volume change clear the door states', countOf(view, /sideOf\(liftedConcept\.record, chosen\.correspondence\.map\(\(\[a\]\) => strip\(a\)\), memo, doorFaceName\(row\.faceA\)\)/g) === 1 && countOf(view, /sideOf\(liftedConcept\.record, /g) === 2 && countOf(view, /onDoorPick=\{handleDoorPick\}/g) === 1 && countOf(view, /onDoorWithdrawLine=\{handleDoorWithdrawLine\}/g) === 1 && countOf(view, /onDoorWithdrawAttempt=\{handleDoorWithdrawAttempt\}/g) === 1 && countOf(view, /\{ faceA: v \|\| null, faceB: r\.faceB, candidateKey: null \}/g) === 1 && countOf(view, /transports: result\.transports/g) === 1 && countOf(view, /doorReadingOf\(sides\.A\.side, sides\.B\.side, row\.transports \?\? \[\], doorLabel\)/g) === 1 && countOf(view, /setDoorStates\(\{\}\)/g) === 3);
check('§4 ★ PURITY: the model imports the types, the resolver, the born step, the face-reading type, the register and the row\'s type — no react, no store, no component; the section imports the model alone; the chrome imports the section; both new files classified NOT_FROZEN in the manifest', J(froms(model)) === J(['../types/geometry', '../lib/spaceOf', '../lib/bornFace', '../lib/faceReading', '../lib/jRegister', './apertureModel']) && J(froms(section)) === J(['./doorTransportModel']) && /import \{ DoorTransportSection, type DoorRowView \} from '\.\/DoorTransportSection';/.test(chrome) && /^NOT_FROZEN src\/manuscript\/doorTransportModel\.ts — STAMP C-11a/m.test(manifest) && /^NOT_FROZEN src\/manuscript\/DoorTransportSection\.tsx — STAMP C-11a/m.test(manifest), J([froms(model), froms(section)]));
check('§4 the record\'s type: `AperturePairRow.transports?: DoorTransport[]` beside the row\'s three fields, `DoorTransport { corners, roles, types }` — in the NOT_FROZEN aperture model, never in faceIdentification\'s FacePairing', /transports\?: DoorTransport\[\];/.test(readLf('src/manuscript/apertureModel.ts')) && /export interface DoorTransport \{/.test(readLf('src/manuscript/apertureModel.ts')) && !/transports/.test(readLf('src/lib/faceIdentification.ts')));

console.log(`\nDIAGNOSE-THE-DOORS-ACT: ${failures === 0 ? 'ALL PASS' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
