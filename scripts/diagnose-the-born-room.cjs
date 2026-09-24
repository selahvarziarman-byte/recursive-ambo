#!/usr/bin/env node

// DIAGNOSTIC — THE BORN ROOM, REACHABLE LAWFULLY (STAMP C-8, 2026-09-23): `spaceOf(vertex)`, ONE
// resolver for the concept-space a vertex holds, re-derived at every read (src/lib/spaceOf.ts); the
// KIND of an edge fixing the J its midpoint glues over — a SEED edge the person's record, a CORNER
// edge the carried injection, a MEDIAL edge the MEET of everything both endpoints hold ∪ the
// person's BORN pairs; the loader offered on the seed's own corners ALONE (Δ86); the composed
// identity shown and never a pair; the born room the only place a pair is taken; the dependency
// refusal across generations; the record's home and the site said in words.
//
// ⛔ THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the resolver is RUN — on the record's own
// fixtures through the store's own actions (the lawful path: casts on the seed's corners, pairs by
// pointing, the core dissected), and on this witness's OWN generator of random towers (seeds of 5
// roles and 2 words, random partial injections) — and read against the researcher's seals
// (space_of_resolver.py · g3_meet_vs_parent.py, run at the mothership's hand): the SHAPE of every
// law is pinned here on this generator; the researcher's figures (A twice in 3,000 of 3,000 under
// the record alone; 960 of 3,000 pooled under the parent's rule; 2,926 name-matched duplicates;
// 2,993 of 3,000 moved by J_AB) are quoted from THEIR run and not reproduced — this generator is
// not theirs (C-5's rule on numbers in charters). The one hand-sealed face IS reproduced: |A| = 5 ·
// |M_AB| = 8 · |M_CA| = 10 ⇒ the station 8, ABAC 13 (record-only 18; name-matched 15).

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

const { spaceOf, edgeKind, generationOf, composedOn, duplicatedSeeds, pooledRoles, brokenBornActs, isSeedVertex, nameIn } = req('src/lib/spaceOf.ts');
const { isMoldType } = req('src/lib/castLoader.ts');
const { glue } = req('src/lib/midpointGlue.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;

console.log('THE BORN ROOM — one resolver, the edge\'s kind fixing its J, the meet on a medial edge, the loader on the seed alone, the composed identity never a pair, the dependency refusal (C-8)\n');

// ─── this witness's own generator: a synthetic shape of seeds, midpoints and the edges between them ───
const seedCast = (X, n, m) => ({ roles: Array.from({ length: n }, (_, i) => ({ id: `${X.toLowerCase()}${i}` })), signature: Array.from({ length: m }, (_, i) => ({ type: `w${X.toLowerCase()}${i}`, arity: 2 })), relations: [], axioms: [] });
function shapeBuilder() {
  const vertices = {};
  const edges = [];
  const seed = (id, c) => { vertices[id] = { id, position: [0, 0, 0], data: { label: id, notes: '', color: '', tags: [], custom: {}, cast: c }, createdBy: { shapeId: 'synthetic', operation: 'seed', sourceVertexIds: [] } }; return id; };
  const mid = (id, p, q) => { vertices[id] = { id, position: [0, 0, 0], data: { label: id, notes: '', color: '', tags: [], custom: {} }, createdBy: { shapeId: 'synthetic', operation: 'ambo-dissection', sourceVertexIds: [p, q] } }; return id; };
  const edge = (a, b, identification) => { const e = { id: `e:${a}:${b}`, vertexIds: [a, b], sourceVertexIds: [a, b], ...(identification ? { identification } : {}) }; edges.push(e); return e; };
  const shape = () => ({ id: 'synthetic', vertices, edges, faces: [], cells: [] });
  return { seed, mid, edge, shape };
}
const rngOf = (seed) => {
  let s = seed >>> 0;
  const next = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  return { next, int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)), sample: (arr, k) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, k); } };
};
const rndPinj = (rng, src, dst, total = false) => { const k = total ? Math.min(src.length, dst.length) : rng.int(0, Math.min(src.length, dst.length)); const xs = rng.sample(src, k); const ys = rng.sample(dst, k); return xs.map((x, i) => [x, ys[i]]); };
const ids = (c) => c.roles.map((r) => r.id);
const words = (c) => c.signature.map((s) => s.type);
/** one face A, B, C with random records on its three seed edges; gen 1 = M_AB, M_BC, M_CA; gen 2 = the station S on A–M_AB and P_A, P_B on the medial edges; gen 3 = Q on P_A–P_B */
function tower(rng, opts = {}) {
  const { seed, mid, edge, shape } = shapeBuilder();
  const A = seedCast('A', 5, 2); const B = seedCast('B', 5, 2); const C = seedCast('C', 5, 2);
  seed('A', A); seed('B', B); seed('C', C);
  const J_AB = opts.J_AB ?? { roles: rndPinj(rng, ids(A), ids(B), opts.total), types: rndPinj(rng, words(A), words(B)) };
  const J_BC = opts.J_BC ?? { roles: rndPinj(rng, ids(B), ids(C), opts.total), types: rndPinj(rng, words(B), words(C)) };
  let J_CA = opts.J_CA ?? { roles: rndPinj(rng, ids(C), ids(A), opts.total), types: rndPinj(rng, words(C), words(A)) };
  if (opts.flat) { const jab = new Map(J_AB.roles); const jbc = new Map(J_BC.roles); J_CA = { roles: [...jab].filter(([, b]) => jbc.has(b)).map(([a, b]) => [jbc.get(b), a]), types: [] }; }
  edge('A', 'B', J_AB); edge('B', 'C', J_BC); edge('C', 'A', J_CA);
  mid('M_AB', 'A', 'B'); mid('M_BC', 'B', 'C'); mid('M_CA', 'C', 'A');
  edge('A', 'M_AB'); edge('M_AB', 'B'); // corner edges
  edge('M_CA', 'M_AB', opts.born_CA_AB); edge('M_AB', 'M_BC', opts.born_AB_BC); edge('M_BC', 'M_CA'); // medial edges (gen 1's)
  mid('S', 'A', 'M_AB'); mid('P_A', 'M_CA', 'M_AB'); mid('P_B', 'M_AB', 'M_BC');
  edge('P_A', 'P_B'); // the gen-2 medial edge
  mid('Q', 'P_A', 'P_B');
  // C-8b — the tower grows: the gen-4 STATION S4 on the corner edge P_A–Q (P_A is Q's own parent — §122's site), and the
  // gen-4 COMPOUNDING at R = mid(Q, Q2) on the medial edge Q–Q2 whose ends share the parent P_B (§123.2's site)
  edge('P_A', 'Q'); mid('S4', 'P_A', 'Q');
  mid('P_C', 'M_BC', 'M_CA'); edge('P_B', 'P_C'); mid('Q2', 'P_B', 'P_C');
  edge('Q', 'Q2'); mid('R', 'Q', 'Q2');
  return { shape: shape(), A, B, C, J_AB, J_BC, J_CA };
}
/** a born pair on a medial edge of the synthetic shape, written as the store would: a role of one end holding only `left`'s seeds ↦ a role of the other holding only `right`'s */
const bornOn = (shape, edgeId, left, right) => {
  const e = shape.edges.find((x) => x.id === edgeId);
  const U = spaceOf(shape, e.vertexIds[0]); const V = spaceOf(shape, e.vertexIds[1]);
  const only = (R, corner) => [...R.roleContent].filter(([, s]) => [...s].every((t) => t.startsWith(`${corner}|`))).map(([k]) => k);
  const u = only(U, left)[0]; const v = only(V, right)[0];
  if (u === undefined || v === undefined) return null;
  e.identification = { roles: [[u, v]], types: [] };
  return [u, v];
};
const mult = (R) => { const c = new Map(); for (const s of R.roleContent.values()) for (const t of s) c.set(t, (c.get(t) ?? 0) + 1); return Math.max(0, ...c.values()); };
const wordMult = (R) => { const c = new Map(); for (const s of R.wordContent.values()) for (const t of s) c.set(t, (c.get(t) ?? 0) + 1); return Math.max(0, ...c.values()); };
const bytes = (R) => J([R.space.roles.map((r) => [r.id, r.label ?? null]), [...R.roleContent].map(([k, s]) => [k, [...s].sort()]), R.space.signature.map((w) => w.type), [...R.wordContent].map(([k, s]) => [k, [...s].sort()])]);
const fingerprint = (R) => J([...R.roleContent.values()].map((s) => [...s].sort().join(',')).sort());

// ═══ §1 THE KINDS, on the real shapes ═══
console.log('----- §1 the kind of an edge, by what its ends are — never by name -----');
const seed0 = createSeedShape('tetrahedron');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json');
let seeded = seed0;
for (const [label, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', phi]]) seeded = withCast(seeded, byLabel(seeded, label), c);
const g1 = applyAmboDissection(seeded);
const g2 = applyAmboDissection(g1, g1.cells.find((x) => x.kind === 'core').id);
const kinds = (shape) => { const n = { seed: 0, corner: 0, medial: 0 }; for (const e of shape.edges) n[edgeKind(shape, e.vertexIds[0], e.vertexIds[1])] += 1; return n; };
note(`gen 1 (${g1.edges.length} edges): ${J(kinds(g1))} · gen 2 (${g2.edges.length} edges): ${J(kinds(g2))}`);
check('§1 ★★ THREE KINDS BY WHAT THE ENDS ARE: on the gen-1 shape A–B is a SEED edge, A–AB a CORNER edge (a born vertex to its own parent), AB–AC a MEDIAL edge (two born vertices, neither the other\'s parent); at gen 2 the same three edges keep their kinds and AB–ABAC is a corner edge; every edge is one of the three and the counts sum to the shape\'s',
  (() => {
    const a = byLabel(g1, 'A'); const b = byLabel(g1, 'B'); const ab = byLabel(g1, 'AB'); const ac = byLabel(g1, 'AC');
    const k1 = kinds(g1); const k2 = kinds(g2);
    return edgeKind(g1, a, b) === 'seed' && edgeKind(g1, a, ab) === 'corner' && edgeKind(g1, ab, ac) === 'medial' && edgeKind(g2, a, b) === 'seed' && edgeKind(g2, a, ab) === 'corner' && edgeKind(g2, ab, ac) === 'medial' && edgeKind(g2, ab, byLabel(g2, 'ABAC')) === 'corner' &&
      k1.seed + k1.corner + k1.medial === g1.edges.length && k2.seed + k2.corner + k2.medial === g2.edges.length && k1.medial > 0 && k2.medial > k1.medial;
  })());
// MEASURED (this witness's first run): dissecting the CORE mints midpoints on the octahedron's edges alone — no midpoint
// stands on a corner edge A–AB at gen 2; the STATION on A–AB is minted when the CORNER CELL at A (the residue tetrahedron
// A · AB · AC · AD) is dissected. The researcher's model has both; the build makes each by its own cell.
const cornerCellAt = (shape, corner, born) => shape.cells.find((c) => c.kind !== 'core' && c.vertexIds.includes(corner) && c.vertexIds.includes(born));
const g2c = applyAmboDissection(g1, cornerCellAt(g1, byLabel(g1, 'A'), byLabel(g1, 'AB')).id);
const stationIn = (shape, corner, born) => Object.values(shape.vertices).find((v) => v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(corner) && v.createdBy.sourceVertexIds.includes(born));
check('§1 ★ THE GENERATION is derived from what made a vertex: the seed\'s corners 0, a gen-1 midpoint 1, ABAC 2 (the core dissected), the station on A–AB 2 (the corner cell at A dissected — one more than its greatest parent); the core\'s dissection mints NO midpoint on a corner edge (measured)',
  generationOf(g2, byLabel(g2, 'A')) === 0 && generationOf(g2, byLabel(g2, 'AB')) === 1 && generationOf(g2, byLabel(g2, 'ABAC')) === 2 && stationIn(g2, byLabel(g2, 'A'), byLabel(g2, 'AB')) === undefined &&
    (() => { const st = stationIn(g2c, byLabel(g2c, 'A'), byLabel(g2c, 'AB')); return st && generationOf(g2c, st.id) === 2 && edgeKind(g2c, byLabel(g2c, 'A'), byLabel(g2c, 'AB')) === 'corner'; })());

// ═══ §2 THE RESOLVER on the record's fixtures ═══
console.log('\n----- §2 the resolver: a seed corner\'s cast; a midpoint the gluing over its edge\'s J; the station; ABAC; the controls -----');
const { useGeometryStore } = req('src/store/geometryStore.ts');
useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {} });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
S().applyAmboDissectionToCurrent();
const G1 = cur();
const a1 = byLabel(G1, 'A'); const b1 = byLabel(G1, 'B'); const c1 = byLabel(G1, 'C');
const give = (X, Y, map) => { const e = edgeBetween(cur().edges, X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === X) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } return e.id; };
const giveWord = (X, Y, s, t) => { const e = edgeBetween(cur().edges, X, Y); if (e.vertexIds[0] === X) S().giveWordPair(e.id, s, t); else S().giveWordPair(e.id, t, s); };
check('§2 ★★ A SEED CORNER resolves to ITS CAST, every role and word carrying its own seed tag; a midpoint of an UNMAPPED seed edge resolves to the DISJOINT UNION by the same construction (23 roles for Flow ⊔ Φ — the midpoint witness\'s seal), no branch',
  (() => {
    const RA = spaceOf(G1, a1);
    const abid = byLabel(G1, 'AB'); const acid = byLabel(G1, 'AC');
    const RAB0 = spaceOf(G1, abid); const RAC0 = spaceOf(G1, acid);
    return RA && RA.origin === 'seed' && RA.space === flow && [...RA.roleContent.values()].every((s) => s.size === 1 && [...s][0].startsWith(`${a1}|`)) && RA.wordContent.size === flow.signature.length &&
      RAB0 && RAB0.origin === 'derived' && RAB0.edge.kind === 'seed' && RAB0.space.roles.length === flow.roles.length + tcell.roles.length && RAC0 && RAC0.space.roles.length === flow.roles.length + phi.roles.length && RAC0.space.roles.length === 23;
  })());
give(a1, b1, { F1: 'r0', F5: 'r2', F7: 'r8' });
giveWord(a1, b1, 'sustains', 'sustains');
give(a1, c1, { F1: 'Φ1', F7: 'Φ3', F13: 'Φ9' });
const RAB1 = spaceOf(G1 === cur() ? cur() : cur(), byLabel(cur(), 'AB'));
check('§2 ★★ A MAPPED SEED MIDPOINT resolves to the gluing over the person\'s RECORD (the same construction the surface read before): AB with three pairs and one τ has 14 + 10 − 3 = 21 roles, and each glued role carries BOTH seed tags; the τ pair is one word carrying both',
  (() => {
    const R = spaceOf(cur(), byLabel(cur(), 'AB'));
    const glued = R.space.roles.filter((r) => r.id.includes('≡'));
    const w = [...R.wordContent.entries()].find(([k]) => k.includes('≡'));
    return R && R.edge.kind === 'seed' && R.edge.born.roles.length === 3 && R.space.roles.length === 21 && glued.length === 3 && glued.every((r) => R.roleContent.get(r.id).size === 2) && w && w[1].size === 2;
  })());
S().selectCell(cur().cells.find((x) => x.kind === 'core').id);
S().applyAmboDissectionToCurrent();
const G2 = cur();
const A2 = byLabel(G2, 'A'); const AB2 = byLabel(G2, 'AB'); const AC2 = byLabel(G2, 'AC'); const ABAC = byLabel(G2, 'ABAC');
const RAB2 = spaceOf(G2, AB2); const RAC2 = spaceOf(G2, AC2); const RABAC = spaceOf(G2, ABAC);
// the station: the corner cell at A dissected on the gen-1 shape WITH its records (the store's), read through the resolver
const G1r = S().shapes[G1.id];
const G2c = applyAmboDissection(G1r, cornerCellAt(G1r, a1, byLabel(G1r, 'AB')).id);
const station = stationIn(G2c, byLabel(G2c, 'A'), byLabel(G2c, 'AB')).id;
const RS = spaceOf(G2c, station); const RABc = spaceOf(G2c, byLabel(G2c, 'AB'));
note(`gen 2 (the core dissected): AB ${RAB2.space.roles.length} roles · AC ${RAC2.space.roles.length} · ABAC ${RABAC.space.roles.length} (${RABAC.edge.kind}, ${RABAC.edge.composed.roles.length} composed pairs, ${RABAC.edge.composed.words.length} composed words, ${RABAC.edge.composed.conflicts.length} conflicts) · duplicated seeds at ABAC ${J(duplicatedSeeds(RABAC))} · (the corner cell at A dissected): the station on A–AB ${RS.space.roles.length} roles (${RS.edge.kind}, ${RS.edge.composed.roles.length} carried) against AB's ${RABc.space.roles.length}`);
check('§2 ★★ THE STATION on the CORNER edge A–AB (the corner cell at A dissected) is AB\'s OWN SPACE (Arman\'s stations theorem): the same role count as AB, no seed role or word duplicated, the injection of A total (14 carried pairs — one per role of A — and Flow\'s 11 words), no record read',
  RS && RS.edge.kind === 'corner' && RS.space.roles.length === RABc.space.roles.length && duplicatedSeeds(RS).roles === 0 && duplicatedSeeds(RS).words === 0 && RS.edge.composed.roles.length === flow.roles.length && RS.edge.composed.words.length === flow.signature.length && RS.edge.born.roles.length === 0 && RS.edge.born.types.length === 0);
check('§2 ★★ ABAC on the MEDIAL edge with NO born pair: |M_AB| + |M_CA| − |A| roles (21 + 21 − 14 = 28), the shared corner A composed ONCE (14 pairs, 11 words), 0 seed roles and 0 seed words duplicated; the record alone would house A twice (42 roles), and matching NAMES leaves the glued A-roles apart (`F1 ≡ r0` ≠ `Φ1 ≡ F1`) — both controls measured',
  (() => {
    const want = RAB2.space.roles.length + RAC2.space.roles.length - flow.roles.length;
    const recordOnly = glue(RAB2.space, RAC2.space, [], []);
    const labelOf = (space, id) => { const r = space.roles.find((x) => x.id === id); return r && r.label ? r.label : id; };
    const byName = RAB2.space.roles.map((r) => [r.id, RAC2.space.roles.find((s) => labelOf(RAC2.space, s.id) === labelOf(RAB2.space, r.id))?.id]).filter(([, y]) => y !== undefined);
    const named = glue(RAB2.space, RAC2.space, byName, []);
    note(`ABAC: kind-aware ${RABAC.space.roles.length} roles (sealed by hand ${want}) · record-only ${recordOnly.refused ? 'refused' : recordOnly.midpoint.roles.length} · name-matched ${named.refused ? 'refused' : named.midpoint.roles.length} (${byName.length} names matched)`);
    return RABAC.edge.kind === 'medial' && RABAC.space.roles.length === want && RABAC.edge.composed.roles.length === flow.roles.length && RABAC.edge.composed.words.length === flow.signature.length && RABAC.edge.composed.conflicts.length === 0 &&
      duplicatedSeeds(RABAC).roles === 0 && duplicatedSeeds(RABAC).words === 0 && !recordOnly.refused && recordOnly.midpoint.roles.length === RAB2.space.roles.length + RAC2.space.roles.length && !named.refused && named.midpoint.roles.length > want;
  })());
// C-8c item 4 — ONE MEASUREMENT for C-9, no build: which FACES of the gen-1 complex hold the edge AB–AC, and which does the surface at ABAC show as sources today
(() => {
  const { midpointSiteOf } = req('src/components/MidpointSurface.tsx');
  const L = (v) => G1.vertices[v].data.label;
  const holding = G1.faces.filter((f) => f.vertexIds.includes(byLabel(G1, 'AB')) && f.vertexIds.includes(byLabel(G1, 'AC')));
  const byCell = holding.map((f) => ({ face: f.vertexIds.map(L).join('·'), cells: G1.cells.filter((c) => c.faceIds.includes(f.id)).map((c) => `${c.kind}${c.topology ? `:${c.topology}` : ''}`) }));
  const rep = buildGeneralSitePacketPresenterReport(G2);
  const p = rep.packets.find((x) => x.trace.siteId === ABAC);
  const site = midpointSiteOf(G2, ABAC, p ? p.trace : null);
  const host = G2.cells.find((c) => c.id === p.trace.hostCellId);
  note(`C-8c item 4 — the faces of the gen-1 complex holding AB–AC: ${holding.length} — ${J(byCell)} · the surface at ABAC shows as sources the host cell's (${host ? `${host.kind}${host.topology ? `:${host.topology}` : ''}` : '?'}) incident faces: ${J(site ? site.sources.map((s) => `${s.faceName} (apex ${s.apexes.map((a) => G2.vertices[a].data.label).join(',')})`) : null)}`);
})();
check('§2 ★ THE INDUCED WALK — the mothership\'s one measurement (1535 §3 / 1642 §1) by the researcher\'s test (a cell\'s walk on its face is the vertex order whose right-hand normal points OUT of it: n = (v₂ − v₁) × (v₃ − v₁), the order that cell\'s iff n · (face centroid − cell centroid) > 0): at gen 1 and gen 2 every face held by two cells is TWO records with ONE cyclic order — the core\'s ring face and the residue\'s base from the same `midpointRingForVertex` (ambo.ts), the parent-cell copies verbatim — and on the build\'s OWN positions that order is the HOST cell\'s own walk (the core\'s, the parent\'s) on every shared face; the residue\'s walk is held by NO record (it is the reverse — derivable from the record itself, no positions needed); the researcher\'s regular-tetrahedron control reproduced (+1 the corner cell, −1 the core)',
  (() => {
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const centroid = (pts) => pts.reduce((c, p) => [c[0] + p[0] / pts.length, c[1] + p[1] / pts.length, c[2] + p[2] / pts.length], [0, 0, 0]);
    const cyc = (ids) => { const i = ids.indexOf([...ids].sort()[0]); return [...ids.slice(i), ...ids.slice(0, i)].join('>'); };
    const measure = (shape) => {
      const pos = (v) => shape.vertices[v].position;
      const byKey = new Map();
      for (const f of shape.faces) { const k = [...f.vertexIds].sort().join('|'); (byKey.get(k) ?? byKey.set(k, []).get(k)).push(f); }
      let shared = 0; let oneOrder = 0; let hostWalk = 0; let residueHeld = 0; const rows = [];
      for (const recs of byKey.values()) {
        const cells = [...new Set(recs.flatMap((f) => shape.cells.filter((c) => c.faceIds.includes(f.id))))];
        if (cells.length < 2) continue;
        shared += 1;
        const fc = centroid(recs[0].vertexIds.map(pos));
        const orient = (f, cell) => { const [v1, v2, v3] = f.vertexIds.map(pos); return Math.sign(dot(cross(sub(v2, v1), sub(v3, v1)), sub(fc, centroid(cell.vertexIds.map(pos))))); };
        if (new Set(recs.map((f) => cyc(f.vertexIds))).size === 1) oneOrder += 1;
        const host = cells.find((c) => c.kind === 'core' || c.kind === 'parent'); const residue = cells.find((c) => c.kind === 'residue');
        if (host && residue && recs.every((f) => orient(f, host) > 0 && orient(f, residue) < 0)) hostWalk += 1;
        if (residue && recs.some((f) => orient(f, residue) > 0)) residueHeld += 1;
        rows.push(`${recs.map((f) => f.vertexIds.map((v) => shape.vertices[v].data.label).join('·')).join(' = ')} held by ${cells.map((c) => `${c.kind}:${c.topology ?? '?'}`).join(' + ')}: ${host ? `the ${host.kind}'s walk` : '?'}`);
      }
      return { shared, oneOrder, hostWalk, residueHeld, rows };
    };
    const m1 = measure(G1); const m2 = measure(G2);
    const T = { A: [1, 1, 1], B: [1, -1, -1], C: [-1, 1, -1], D: [-1, -1, 1] };
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2];
    const face = [mid(T.A, T.C), mid(T.A, T.B), mid(T.A, T.D)];
    const fc = centroid(face); const n = cross(sub(face[1], face[0]), sub(face[2], face[0]));
    const corner = Math.sign(dot(n, sub(fc, centroid([T.A, ...face])))); const core = Math.sign(dot(n, sub(fc, centroid([mid(T.A, T.B), mid(T.A, T.C), mid(T.A, T.D), mid(T.B, T.C), mid(T.B, T.D), mid(T.C, T.D)]))));
    note(`gen 1: ${m1.shared} shared faces, one cyclic order ${m1.oneOrder}, the host's walk ${m1.hostWalk}, the residue's walk held ${m1.residueHeld} — ${J(m1.rows)}`);
    note(`gen 2: ${m2.shared} shared faces, one cyclic order ${m2.oneOrder}, the host's walk ${m2.hostWalk}, the residue's walk held ${m2.residueHeld} · the seed's positions ${J(Object.values(G1.vertices).filter((v) => v.createdBy.operation === 'seed').map((v) => `${v.data.label} ${J(v.position)}`))} · the researcher's control: AC·AB·AD the corner cell's ${corner}, the core's ${core}`);
    return m1.shared === 4 && m1.oneOrder === 4 && m1.hostWalk === 4 && m1.residueHeld === 0 && m2.shared === 10 && m2.oneOrder === 10 && m2.hostWalk === 10 && m2.residueHeld === 0 && corner === 1 && core === -1;
  })());
check('§2 ★ THE HAND-SEALED FACE (the researcher\'s one instance, reproduced on this generator\'s shape): |A| = 5 · |M_AB| = 8 · |M_CA| = 10 ⇒ the station on A–M_AB 8 roles, 0 duplicated · ABAC with no born pair 8 + 10 − 5 = 13 roles, 0 duplicated · the record alone 18 · names matched 15',
  (() => {
    const rng = rngOf(7);
    const t = tower(rng, { J_AB: { roles: [['a0', 'b0'], ['a1', 'b1']], types: [] }, J_CA: { roles: [], types: [] }, J_BC: { roles: [], types: [] } });
    const R_AB = spaceOf(t.shape, 'M_AB'); const R_CA = spaceOf(t.shape, 'M_CA'); const R_S = spaceOf(t.shape, 'S'); const R_P = spaceOf(t.shape, 'P_A');
    const recordOnly = glue(R_CA.space, R_AB.space, [], []);
    const labelOf = (space, id) => { const r = space.roles.find((x) => x.id === id); return r && r.label ? r.label : id; };
    const byName = R_CA.space.roles.map((r) => [r.id, R_AB.space.roles.find((s) => labelOf(R_AB.space, s.id) === labelOf(R_CA.space, r.id))?.id]).filter(([, y]) => y !== undefined);
    const named = glue(R_CA.space, R_AB.space, byName, []);
    note(`the hand-sealed face: |A| 5 · |M_AB| ${R_AB.space.roles.length} · |M_CA| ${R_CA.space.roles.length} · station ${R_S.space.roles.length} (dup ${duplicatedSeeds(R_S).roles}) · ABAC ${R_P.space.roles.length} (dup ${duplicatedSeeds(R_P).roles}) · record-only ${recordOnly.midpoint.roles.length} · name-matched ${named.midpoint.roles.length}`);
    return R_AB.space.roles.length === 8 && R_CA.space.roles.length === 10 && R_S.space.roles.length === 8 && duplicatedSeeds(R_S).roles === 0 && R_P.space.roles.length === 13 && duplicatedSeeds(R_P).roles === 0 && recordOnly.midpoint.roles.length === 18 && named.midpoint.roles.length === 15;
  })());

// ═══ §3 THE MEET against the parent's identity — random towers, this witness's own generator ═══
console.log('\n----- §3 the meet: the shared corner\'s identity at gen 2; at gen 3 the meet never pools where the parent\'s rule does; the doubling is the meet\'s conflicts; invariant 9 -----');
/** RULE P (the control, the researcher\'s 1055): pair through the shared PARENT's roles traced into each endpoint — every role of the parent's space finds the one role of each endpoint holding its tags */
const parentIdentity = (shape, U, V, parentId) => {
  const P = spaceOf(shape, parentId);
  const find = (R, tags) => [...R.roleContent.entries()].filter(([, s]) => [...tags].every((t) => s.has(t))).map(([id]) => id);
  const pairs = [];
  for (const [, tags] of P.roleContent) { const u = find(U, tags); const v = find(V, tags); if (u.length === 1 && v.length === 1) pairs.push([u[0], v[0]]); }
  return pairs;
};
const contentOfGlue = (U, V, M) => { const m = new Map(); for (const r of M.roles) m.set(r.key, new Set([...(r.a !== null ? U.roleContent.get(r.a) : []), ...(r.b !== null ? V.roleContent.get(r.b) : [])])); return m; };
const pooledIn = (content) => { let n = 0; for (const s of content.values()) { const per = new Map(); for (const t of s) { const c = t.slice(0, t.indexOf('|')); per.set(c, (per.get(c) ?? 0) + 1); } if ([...per.values()].some((k) => k > 1)) n += 1; } return n; };
const doubledA = (content) => { const cnt = new Map(); for (const s of content.values()) for (const t of s) cnt.set(t, (cnt.get(t) ?? 0) + 1); return new Set([...cnt].filter(([t, k]) => k > 1 && t.startsWith('A|')).map(([t]) => t.slice(2))); };
const formula = (t) => {
  const JAB = new Map(t.J_AB.roles); const JBC = new Map(t.J_BC.roles); const JCA = new Map(t.J_CA.roles);
  const h = new Map(); for (const [a, b] of JAB) if (JBC.has(b) && JCA.has(JBC.get(b))) h.set(a, JCA.get(JBC.get(b)));
  const reach = new Set([...JAB].filter(([, b]) => JBC.has(b)).map(([a]) => a));
  const out = new Set(); for (const a of JCA.values()) if (h.get(a) !== a) out.add(a); for (const a of reach) if (!h.has(a)) out.add(a);
  return out;
};
(() => {
  const rng = rngOf(251);
  const N = 3000;
  let t1 = 0; let t2 = 0; let t6m = 0; let t6p = 0; let t3 = 0; let dupBelow = 0; let inv9 = 0; let inv9ctl = 0; let inv9n = 0;
  for (let i = 0; i < N; i += 1) {
    const t = tower(rng);
    const R_CA = spaceOf(t.shape, 'M_CA'); const R_AB = spaceOf(t.shape, 'M_AB'); const R_BC = spaceOf(t.shape, 'M_BC');
    // T1 — at gen 2 the meet IS the shared corner's identity
    const meet2 = composedOn(t.shape, R_CA, R_AB, ['M_CA', 'M_AB'], 'medial');
    const ident = parentIdentity(t.shape, R_CA, R_AB, 'A');
    if (J([...meet2.roles].sort()) !== J([...ident].sort()) || meet2.conflicts.length) t1 += 1;
    // below gen 3 nothing doubles
    for (const id of ['M_AB', 'M_BC', 'M_CA', 'S', 'P_A', 'P_B']) { const d = duplicatedSeeds(spaceOf(t.shape, id)); if (d.roles || d.words) dupBelow += 1; }
    // gen 3 — Q on P_A–P_B: the meet (the build) against RULE P (the control)
    const R_PA = spaceOf(t.shape, 'P_A'); const R_PB = spaceOf(t.shape, 'P_B'); const R_Q = spaceOf(t.shape, 'Q');
    const pP = parentIdentity(t.shape, R_PA, R_PB, 'M_AB');
    const QP = glue(R_PA.space, R_PB.space, pP, []);
    const contentQP = QP.refused ? null : contentOfGlue(R_PA, R_PB, QP.midpoint);
    if (pooledRoles(R_Q) > 0) t6m += 1;
    if (contentQP && pooledIn(contentQP) > 0) t6p += 1;
    if (contentQP && [...contentQP.values()].length) { const dP = duplicatedSeeds({ roleContent: contentQP, wordContent: new Map() }).roles; if (dP > duplicatedSeeds(R_Q).roles) t3 += 1; }
    // T2 — the doubled A-roles at Q equal the ratified 09-16 set (empty born rooms)
    if (J([...doubledA(R_Q.roleContent)].sort()) !== J([...formula(t)].sort())) t2 += 1;
    // invariant 9 at gen 2 — vary J_BC (the opposite vertex of AB–AC, not an ancestor): P_A byte-identical; vary J_AB (a parent): P_A moves (the control)
    const t2b = tower(rng, { J_AB: t.J_AB, J_CA: t.J_CA });
    if (fingerprint(spaceOf(t2b.shape, 'P_A')) !== fingerprint(R_PA)) inv9 += 1;
    const t2c = tower(rng, { J_BC: t.J_BC, J_CA: t.J_CA });
    inv9n += 1;
    if (fingerprint(spaceOf(t2c.shape, 'P_A')) !== fingerprint(R_PA)) inv9ctl += 1;
  }
  note(`${N} random faces (A, B, C: 5 roles, 2 words; random partial injections on the three seed edges; born rooms empty): T1 the gen-2 meet ≠ the shared corner's identity ${t1} · duplicated seeds below gen 3 ${dupBelow} · T6 POOLING at gen 3 — the meet ${t6m} faces, the parent's rule ${t6p} faces · T3 the parent's rule doubles more ${t3} · T2 the doubling ≠ the 09-16 set ${t2} · invariant 9: J_BC varied, ABAC moved ${inv9} of ${N}; J_AB varied, ABAC moved ${inv9ctl} of ${inv9n} (the control)`);
  check('§3 ★★ AT GEN 2 THE MEET IS THE SHARED CORNER\'S IDENTITY (T1, sealed 0): on every face the meet on M_CA–M_AB equals the identity on A traced through both injections, with no conflict; and NOTHING doubles below gen 3 (every gen-1 and gen-2 space free of duplicated seeds)', t1 === 0 && dupBelow === 0, J({ t1, dupBelow }));
  check('§3 ★★ THE MEET NEVER POOLS (T6 — 0031 §6 invariant 3, THE STONE): at gen 3 no role of Q holds two seed roles of one corner under the meet, in 0 faces — where THE PARENT\'S IDENTITY ALONE (the control, the researcher\'s own 1055 rule) pools in > 0 faces ("it pools the disagreement and doubles the agreement: exactly backwards") and doubles more than the meet in > 0', t6m === 0 && t6p > 0 && t3 > 0, J({ t6m, t6p, t3 }));
  check('§3 ★★ THE DOUBLING IS THE MEET\'S CONFLICTS (T2, sealed 0): with every born room empty the doubled A-roles at Q are exactly the ratified 09-16 set (im J_CA ∖ Fix h_A) ∪ (dom(J_BC∘J_AB) ∖ dom h_A) on every face — an independent reproduction of that theorem, built recursively', t2 === 0, J({ t2 }));
  check('§3 ★★ INVARIANT 9 AT GEN 2, the byte-identical falsifier on a NON-ANCESTOR opposite vertex: J_BC re-cast (BC is ABAC\'s opposite vertex in the medial triangle, not an ancestor) — ABAC unchanged on every face; J_AB re-cast (a PARENT) — ABAC changed on most (the control > 0)', inv9 === 0 && inv9ctl > 0, J({ inv9, inv9ctl }));
})();
check('§3 ★ THE CLASSICAL SUB-CASE IS SILENT (T4): on flat faces with total maps (h = 1) the meet doubles nothing at gen 3',
  (() => { const rng = rngOf(97); let bad = 0; let n = 0; for (let i = 0; i < 300; i += 1) { const t = tower(rng, { total: true, flat: true }); if (t.J_CA.roles.length !== 5) continue; n += 1; if (duplicatedSeeds(spaceOf(t.shape, 'Q')).roles) bad += 1; } note(`${n} flat total faces: doubled ${bad}`); return n > 0 && bad === 0; })());

// ═══ §3b C-8b — THE CARRY BY CONSTRUCTION (§122) and THE ANCHORED MEET (§123.2), at gen 4 where content parts from structure ═══
console.log('\n----- §3b C-8b: the station over a DOUBLED vertex is its own space by construction; the anchored meet compounds to at most one copy per lineage; gen ≤ 3 byte-identical, born pairs too -----');
const { coprojectionOf, contentMeet } = req('src/lib/spaceOf.ts');
(() => {
  const rng = rngOf(251);
  const N = 3000;
  const content = { meet: 'content' };
  let dblQ = 0; let s4own = 0; let s4dupMore = 0; let ctlFail = 0; let ctlN = 0;
  let rMax = 0; let rAbove3 = 0; let rPool = 0; let rSplit = 0; let rSpurious = 0; let rFacesSpurious = 0;
  let cMax = 0; let cGe4 = 0; let cSplit = 0; let cSpurious = 0; let cFacesSpurious = 0;
  let wMax = 0; let wMaxContent = 0; let gen3diff = 0; let gen3n = 0; let bornDiff = 0; let bornN = 0; let byAnch = 0; let byContent = 0;
  const splits = (sh, opt) => {
    const RQ = spaceOf(sh, 'Q', opt); const RQ2 = spaceOf(sh, 'Q2', opt); const RR = spaceOf(sh, 'R', opt); const RPB = spaceOf(sh, 'P_B', opt);
    const q = new Map(coprojectionOf(RQ, 'P_B').roles); const q2 = new Map(coprojectionOf(RQ2, 'P_B').roles);
    const rq = new Map(coprojectionOf(RR, 'Q').roles); const rq2 = new Map(coprojectionOf(RR, 'Q2').roles);
    let split = 0; let spurious = 0;
    for (const p of RPB.space.roles.map((r) => r.id)) {
      const xq = q.get(p); const xq2 = q2.get(p);
      if (xq === undefined || xq2 === undefined) continue;
      if (rq.get(xq) !== rq2.get(xq2)) { split += 1; if (J([...RQ.roleContent.get(xq)].sort()) === J([...RQ2.roleContent.get(xq2)].sort())) spurious += 1; }
    }
    return { split, spurious, R: RR };
  };
  for (let i = 0; i < N; i += 1) {
    const t = tower(rng); const sh = t.shape;
    // §122 — the gen-4 station over the doubled vertex Q, on the corner edge P_A–Q
    const RQ = spaceOf(sh, 'Q'); const RS4 = spaceOf(sh, 'S4');
    const dQ = duplicatedSeeds(RQ).roles; if (dQ > 0) dblQ += 1;
    const sameMult = (a, b) => { const m = (R) => { const c = new Map(); for (const s of R.roleContent.values()) for (const x of s) c.set(x, (c.get(x) ?? 0) + 1); return J([...c].sort()); }; return m(a) === m(b); };
    if (RS4.space.roles.length === RQ.space.roles.length && sameMult(RS4, RQ) && RS4.edge.composed.by === 'carried' && RS4.edge.composed.conflicts.length === 0) s4own += 1;
    if (duplicatedSeeds(RS4).roles > dQ) s4dupMore += 1;
    // the CONTROL: the content meet on the same corner edge (the mechanism replaced) — must fail on > 0 faces
    const RS4c = spaceOf(sh, 'S4', content); ctlN += 1;
    if (RS4c.space.roles.length !== RQ.space.roles.length) ctlFail += 1;
    // §123.2 — the anchored meet at R against the content meet
    const a = splits(sh, {}); const c = splits(sh, content);
    const ma = mult(a.R); const mc = mult(c.R);
    rMax = Math.max(rMax, ma); cMax = Math.max(cMax, mc);
    if (ma > 3) rAbove3 += 1; if (mc >= 4) cGe4 += 1;
    if (pooledRoles(a.R) > 0) rPool += 1;
    rSplit += a.split; rSpurious += a.spurious; if (a.spurious) rFacesSpurious += 1;
    cSplit += c.split; cSpurious += c.spurious; if (c.spurious) cFacesSpurious += 1;
    if (a.R.edge.composed.by === 'anchored') byAnch += 1; else byContent += 1;
    wMax = Math.max(wMax, wordMult(a.R)); wMaxContent = Math.max(wMaxContent, wordMult(c.R));
    // gen ≤ 3 byte-identical under both mechanisms, every vertex
    for (const id of ['M_AB', 'M_BC', 'M_CA', 'S', 'P_A', 'P_B', 'P_C', 'Q', 'Q2']) { gen3n += 1; if (bytes(spaceOf(sh, id)) !== bytes(spaceOf(sh, id, content))) gen3diff += 1; }
    // … and with BORN pairs on the gen-1 medial edges (a C-only role of M_CA ↦ a B-only role of M_AB; an A-only of M_AB ↦ a C-only of M_BC)
    if (bornOn(sh, 'e:M_CA:M_AB', 'C', 'B') && bornOn(sh, 'e:M_AB:M_BC', 'A', 'C')) {
      for (const id of ['P_A', 'P_B', 'Q']) { bornN += 1; if (bytes(spaceOf(sh, id)) !== bytes(spaceOf(sh, id, content))) bornDiff += 1; }
    }
  }
  note(`${N} random faces: Q doubles in ${dblQ} · the gen-4 station S4 on P_A–Q is Q's own space (count, seed multiplicities, carried, no conflict) in ${s4own} of ${N}, more duplicated than Q in ${s4dupMore} · the CONTROL (the content meet on the corner edge): |S4| ≠ |Q| in ${ctlFail} of ${ctlN}`);
  note(`the gen-4 compounding at R (Q–Q2, shared parent P_B): ANCHORED — max copies of a seed ${rMax}, above 3 in ${rAbove3} faces, pools ${rPool}, shared-parent classes split ${rSplit} (spurious ${rSpurious} in ${rFacesSpurious} faces), by anchor ${byAnch} / by content ${byContent} · the CONTROL (the content meet) — max ${cMax}, a seed in 4 roles in ${cGe4} faces, split ${cSplit} (spurious ${cSpurious} in ${cFacesSpurious} faces) · WORDS at R: max copies of a seed word ${wMax} anchored, ${wMaxContent} under the content meet`);
  note(`gen ≤ 3 under both mechanisms: ${gen3diff} of ${gen3n} spaces differ (empty born rooms) · ${bornDiff} of ${bornN} differ with born pairs standing on the gen-1 medial edges`);
  check('§3b ★★ THE CARRY BY CONSTRUCTION (C-8b item 1a, §122): the gen-4 station on the corner edge P_A–Q is Q\'s OWN SPACE on every face — the same role count and the same seed multiplicities, the J carried from Q\'s own coprojection of P_A, no conflict — where Q holds a seed twice (the lawful gen-3 doubling); the CONTROL — the content meet on the same corner edge, the mechanism replaced — parts from Q on > 0 faces (the mothership\'s copy of this generator: 2,918 of 3,000)', s4own === N && s4dupMore === 0 && dblQ > 0 && ctlFail > 0, J({ s4own, s4dupMore, dblQ, ctlFail }));
  check('§3b ★★ THE ANCHORED MEET COMPOUNDS LAWFULLY (C-8b item 1b, §123.2 — the researcher\'s gen4_compounding.py G4–G6 on this generator): at R = mid(Q, Q2) a seed stands in at most 3 roles (one per lineage), never above; R pools in 0 faces; 0 SPURIOUS splits (a class of the shared parent P_B that Q and Q2 hold identically, split in R); every R anchored on its one shared parent — the CONTROL, the content meet at the same edges: a seed in 4 roles in > 0 faces and spurious splits > 0 (the researcher\'s run: 15,415 spurious; the mothership\'s on a copy of this generator: max 4 in 2,983)', rMax <= 3 && rAbove3 === 0 && rPool === 0 && rSpurious === 0 && byContent === 0 && cGe4 > 0 && cSpurious > 0, J({ rMax, rAbove3, rPool, rSpurious, byContent, cGe4, cSpurious }));
  check('§3b ★★ GEN ≤ 3 IS BYTE-IDENTICAL under the structural and the content mechanisms — every vertex up to Q and Q2 with the born rooms empty, and P_A, P_B, Q with born pairs standing on the gen-1 medial edges: 0 differences (a behaviour-neutral cut below gen 4, measured, not argued)', gen3n > 0 && gen3diff === 0 && bornN > 0 && bornDiff === 0, J({ gen3diff, gen3n, bornDiff, bornN }));
})();
// rider 2 — the ACT's positive controls (the mothership's dependency_control.cjs on this generator, run at its hand 1,626 of 1,626 each)
check('§3b ★★ THE DEPENDENCY READING\'S TWO CONTROLS FOR ACTS (C-8b rider 2): with a born pair standing on M_CA–M_AB, an UNRELATED gen-0 act on A–B is TAKEN (nothing broken) on every face; the act gluing the born pair\'s own B-role is REFUSED (the born act named) on every face',
  (() => {
    const rng = rngOf(7); let n = 0; let ctlTaken = 0; let falsRefused = 0; let falsN = 0;
    for (let i = 0; i < 3000; i += 1) {
      const t = tower(rng); const sh = t.shape;
      const eAB = sh.edges.find((e) => e.id === 'e:A:B');
      const pair = bornOn(sh, 'e:M_CA:M_AB', 'C', 'B');
      if (!pair || brokenBornActs(sh).length) continue;
      const RAB = spaceOf(sh, 'M_AB');
      const bornB = [...RAB.roleContent.get(pair[1])][0].split('|')[1];
      const domA = new Set(eAB.identification.roles.map(([a]) => a)); const imB = new Set(eAB.identification.roles.map(([, b]) => b));
      const freeA = ['a0', 'a1', 'a2', 'a3', 'a4'].filter((a) => !domA.has(a)); const freeB = ['b0', 'b1', 'b2', 'b3', 'b4'].filter((b) => !imB.has(b));
      const otherB = freeB.filter((b) => b !== bornB);
      if (!freeA.length) continue;
      n += 1;
      if (otherB.length) { if (brokenBornActs(sh, { candidate: { edgeId: 'e:A:B', roles: [...eAB.identification.roles, [freeA[0], otherB[0]]], types: eAB.identification.types } }).length === 0) ctlTaken += 1; } else ctlTaken += 1;
      if (freeB.includes(bornB)) { falsN += 1; if (brokenBornActs(sh, { candidate: { edgeId: 'e:A:B', roles: [...eAB.identification.roles, [freeA[0], bornB]], types: eAB.identification.types } }).length > 0) falsRefused += 1; }
    }
    note(`faces used ${n}: an unrelated gen-0 act taken while a born pair stands ${ctlTaken} of ${n} · the act gluing the born pair's own B-role refused ${falsRefused} of ${falsN}`);
    return n > 0 && ctlTaken === n && falsN > 0 && falsRefused === falsN;
  })());
// rider 3 — the withdrawal guard's falsifier, searched at gen 3
const cornerOfSeed = (t) => t.slice(0, t.indexOf('|'));
const poolsTags = (tags) => { const m = new Map(); for (const t of tags) { const c = cornerOfSeed(t); m.set(c, (m.get(c) ?? 0) + 1); } return [...m.values()].some((k) => k > 1); };
/** a candidate born pair of the wanted kind at a synthetic medial edge — `pool` (two seeds of one corner), `share` (a seed in common, dissolving a doubling), `disjoint` (clean) */
const candidateOf = (shape, edgeId, want) => {
  const e = shape.edges.find((x) => x.id === edgeId);
  const U = spaceOf(shape, e.vertexIds[0]); const V = spaceOf(shape, e.vertexIds[1]);
  const comp = composedOn(shape, U, V, e.vertexIds, 'medial');
  const dom = new Set(comp.roles.map(([a]) => a)); const im = new Set(comp.roles.map(([, b]) => b));
  for (const [u, cu] of [...U.roleContent].filter(([k]) => !dom.has(k))) for (const [v, cv] of [...V.roleContent].filter(([k]) => !im.has(k))) {
    const union = new Set([...cu, ...cv]);
    const kind = poolsTags(union) ? 'pool' : [...cu].some((t) => cv.has(t)) ? 'share' : 'disjoint';
    if (kind === want) return { u, v, cu: [...cu], cv: [...cv] };
  }
  return null;
};
check('§3b ★★ THE WITHDRAWAL GUARD\'S FALSIFIER, RE-MEASURED ON CLEAN PAIRS (C-8b rider 3, corrected by C-8c): with a CLEAN born pair standing on Q\'s edge P_A–P_B (gen 3) — disjoint content, else sharing a seed, never two roles of one corner (the stone refuses those at the act, and the C-8b run\'s 596 were measured on exactly those) — every gen-0 withdrawal on A–B, B–C, C–A is read as a candidate, and some BREAK the born act; the guard on withdrawals (C-8 item 4) has its case on lawful pairs, and the first is printed (else the bound)',
  (() => {
    const rng = rngOf(3); let faces = 0; let tried = 0; let breaking = 0; let ex = null; const why = new Map();
    for (let i = 0; i < 3000; i += 1) {
      const t = tower(rng); const sh = t.shape;
      const d = candidateOf(sh, 'e:P_A:P_B', 'disjoint') ?? candidateOf(sh, 'e:P_A:P_B', 'share');
      if (!d) continue;
      sh.edges.find((x) => x.id === 'e:P_A:P_B').identification = { roles: [[d.u, d.v]], types: [] };
      if (brokenBornActs(sh).length) continue;
      faces += 1;
      for (const id of ['e:A:B', 'e:B:C', 'e:C:A']) {
        const e = sh.edges.find((x) => x.id === id);
        for (let k = 0; k < e.identification.roles.length; k += 1) {
          tried += 1;
          const rest = e.identification.roles.filter((_, j) => j !== k);
          const broken = brokenBornActs(sh, { candidate: { edgeId: id, roles: rest, types: e.identification.types } }, id);
          if (broken.length) { breaking += 1; const w = broken[0].why.replace(/^.*?(no longer a role|would be one with|which the corner keeps apart|contradict).*$/, '$1'); why.set(w, (why.get(w) ?? 0) + 1); if (!ex) ex = { face: i, edge: id, withdrawn: e.identification.roles[k], born: [d.u, d.v], why: broken[0].why }; }
        }
      }
    }
    note(`${faces} faces with a CLEAN born pair standing at Q · ${tried} gen-0 withdrawals read as candidates · ${breaking} would break the born act — by reason ${J([...why])}${ex ? ` — first: ${J(ex)}` : ' — none found in this bound'}`);
    return faces > 0 && tried > 0 && (breaking > 0 || (note('⚠ no gen-0 withdrawal breaks a clean born pair on this generator in this bound — the bound is printed, not the case'), true));
  })());

check('§3b ★ THE TRIPWIRE (§124.2, the mothership: the content-meet fallback is a TRIPWIRE, not a rule): on 300 towers of this generator, at EVERY generation built (gen 1 to gen 4), every corner edge composes `by: carried` and every medial edge `by: anchored` — `by: content` 0 of them; a nonzero count is a STOP-and-report (a medial edge without one shared parent is a kind the layer does not define)',
  (() => {
    const rng = rngOf(77); const by = new Map(); let born = 0;
    for (let i = 0; i < 300; i += 1) {
      const sh = tower(rng).shape;
      for (const v of Object.values(sh.vertices)) {
        if (v.createdBy.sourceVertexIds.length !== 2) continue;
        const R = spaceOf(sh, v.id); if (!R || !R.edge) continue;
        born += 1; const k = `${R.edge.kind}:${R.edge.composed.by}`; by.set(k, (by.get(k) ?? 0) + 1);
      }
    }
    note(`300 towers · ${born} born vertices at gen 1–4 · composed by ${J([...by])}`);
    return born > 0 && (by.get('medial:content') ?? 0) === 0 && (by.get('corner:content') ?? 0) === 0 && (by.get('medial:anchored') ?? 0) > 0 && (by.get('corner:carried') ?? 0) > 0 && [...by.keys()].every((k) => k === 'medial:anchored' || k === 'corner:carried' || k === 'seed:none');
  })());

// ═══ §4 THE STORE AND THE SURFACE on the lawful path ═══
console.log('\n----- §4 the born room at ABAC: the composed identity never a pair, a born pair taken, a pair on a composed role refused by name, the dependency refusal, the home and the site -----');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { ConceptSurface } = req('src/components/MidpointSurface.tsx');
const render = (el) => renderToString(el).replace(/<!-- -->/g, '');
const unescapeHtml = (s) => (s ?? '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
const attrsOf = (html, name) => [...html.matchAll(new RegExp(`${name}="([^"]*)"`, 'g'))].map((m) => unescapeHtml(m[1]));
const countOf = (html, name) => (html.match(new RegExp(`${name}="`, 'g')) || []).length;
const visibleText = (html) => unescapeHtml(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const surfaceAt = (id) => render(React.createElement(ConceptSurface, { shape: cur(), vertexId: id }));
// the surface with a REFUSAL passed as a prop — the chooser reads the store's refusals through hooks, and a server render
// reads the store's initial state (the midpoint witness's own way, C-7b)
const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const surfaceWith = (shape, siteId, refusal) => {
  const rep = buildGeneralSitePacketPresenterReport(shape);
  const p = rep.packets.find((x) => x.trace.siteId === siteId);
  const site = midpointSiteOf(shape, siteId, p ? p.trace : null);
  const memo = new Map();
  const parents = [spaceOf(shape, site.a, {}, memo), spaceOf(shape, site.b, {}, memo)];
  const resolved = spaceOf(shape, siteId, {}, memo);
  return render(React.createElement(MidpointSurface, { shape, site, parents, resolved, refusal, remade: null }));
};
const siteABAC = (() => { const rep = buildGeneralSitePacketPresenterReport(G2); const p = rep.packets.find((x) => x.trace.siteId === ABAC); const { midpointSiteOf } = req('src/components/MidpointSurface.tsx'); return midpointSiteOf(G2, ABAC, p.trace); })();
const bornA = RABAC.edge.parents[0] === AB2 ? RAB2 : RAC2; const bornB = RABAC.edge.parents[0] === AB2 ? RAC2 : RAB2;
const freeOf = (R) => R.space.roles.map((r) => r.id).filter((id) => ![...R.roleContent.get(id)].some((t) => t.startsWith(`${A2}|`)));
const xBorn = freeOf(bornA)[0]; const yBorn = freeOf(bornB)[0];
check('§4 ★★ THE SURFACE AT ABAC ON THE LAWFUL PATH: the unfolding PRESENT with the shared corner\'s 14 roles composed on BOTH sides (never pickable — no click handler), NO line across the fold, the composed identity STATED ONCE in the sentence — `corner A\'s 14 roles and 11 words stand on both sides as one — composed, not yours (their points hollow)` (C-7h item 2, the designer: do not mark the ordinary) — its points HOLLOW rings carrying no words, the word `composed` once on the whole surface, the born room named, the record\'s home said (`a medial edge (generation 1)`, the site `generation 2`), and every composed point in the own column marked composed in its data and drawn hollow',
  (() => {
    const html = surfaceAt(ABAC);
    const text = visibleText(html);
    const composedPts = attrsOf(html, 'data-midpoint-composed');
    const ownComposed = attrsOf(html, 'data-midpoint-own-role').filter((o) => o === 'composed').length;
    const groups = (marker) => html.split(marker).slice(1).map((g) => g.slice(0, g.indexOf('</g>')));
    const quiet = groups('data-midpoint-composed="').every((g) => !/data-inside-origin/.test(g) && /data-inside-solid="true"/.test(g)) && groups('data-midpoint-own-role="composed"').every((g) => !/data-inside-origin/.test(g) && /data-inside-solid="true"/.test(g));
    note(`ABAC: composed points ${composedPts.length} · own column composed ${ownComposed} · the word composed on the surface ${(text.match(/composed/g) || []).length} time(s) · the sentence: ${(text.match(/corner A's[^·]*·[^·]*·[^·]*/) || [''])[0]}`);
    return countOf(html, 'data-midpoint-surface') === 1 && composedPts.length === 2 * flow.roles.length && composedPts.every((c) => c === 'A') && countOf(html, 'data-midpoint-line') === 0 && quiet &&
      /corner A's 14 roles and 11 words stand on both sides as one — composed, not yours \(their points hollow\) · the born room: \d+ roles of A[BC] and \d+ of A[BC] stand apart · no pair of yours yet/.test(text) && (text.match(/composed/g) || []).length === 1 &&
      /the record's home: A[BC]–A[BC], a medial edge \(generation 1\) · this site: ABAC, generation 2 — a pair beyond the shared corner is born here, yours/.test(text) && ownComposed === flow.roles.length && !/data-midpoint-composed="[^"]*"[^>]*class="cursor-pointer"/.test(html);
  })(), visibleText(surfaceAt(ABAC)).slice(0, 500));
check('§4 ★★ `≡` IS THE PERSON\'S ACT AND ONLY THAT (C-7h item 1, the designer\'s live drive: nine composed words wore `≡`, `r0 ≡ F1 ≡ F1` joined a role to itself): at ABAC every role\'s and word\'s name is a chain of DISTINCT seeds joined by `≡` — no seed printed twice (one reached through two parents is printed once), every `≡` joining two different seeds (the person\'s acts); the mold\'s own words plain; a chain with one spelling under two seeds carries its corners in brackets',
  (() => {
    const R = spaceOf(cur(), ABAC);
    const chains = [...R.roleSegs.entries()].map(([id, segs]) => ({ id, segs, label: nameIn(R.space, id) }));
    const wchains = [...R.wordSegs.entries()].filter(([, segs]) => !segs.every((x) => isMoldType(x.text))).map(([name, segs]) => ({ name, segs }));
    const distinct = (segs) => new Set(segs.map((x) => x.tag)).size === segs.length;
    const joins = (label, segs) => (label.match(/ ≡ /g) || []).length === Math.max(0, segs.length - 1);
    const names = [...chains.map((c) => c.label), ...wchains.map((w) => w.name)];
    const selfJoined = names.filter((l) => l.split(' ≡ ').map((seg) => seg.replace(/ \[[^\]]+\]$/, '')).some((seg, k, all) => all.indexOf(seg) !== k && !/ \[[^\]]+\]/.test(l)));
    const bracketed = names.filter((l) => / \[[A-D]\] ≡ /.test(l));
    const composedLabels = RABAC.edge.composed.roles.map(([a, b]) => nameIn(R.space, `${a}≡${b}`));
    note(`ABAC names: ${chains.length} roles, ${wchains.length} words · chains of 2+ seeds: ${chains.filter((c) => c.segs.length > 1).length} roles, ${wchains.filter((w) => w.segs.length > 1).length} words · a name joined to itself: ${selfJoined.length} · composed roles read ${J(composedLabels.slice(0, 5))} · bracketed chains: ${J(bracketed.slice(0, 4))}`);
    return chains.length > 0 && chains.every((c) => distinct(c.segs) && joins(c.label, c.segs)) && wchains.every((w) => distinct(w.segs) && joins(w.name, w.segs)) && selfJoined.length === 0 && composedLabels.length === flow.roles.length && composedLabels.every((l) => !/(^|≡ )(\S+) ≡ \2(?= ≡|$)/.test(l));
  })());
check('§4 ★★ A PAIR ON A COMPOSED ROLE IS REFUSED BY NAME (item 3), nothing written: the store\'s `giveRolePair` on ABAC\'s edge naming the shared corner\'s role reads `… is already one with … by the solid — composed · corner A; not yours to pair or withdraw`, and the record on that edge stays empty',
  (() => {
    const cx = RABAC.edge.composed.roles[0];
    S().giveRolePair(siteABAC.edge.id, cx[0], cx[1]);
    const ref = S().midpointRefusals[siteABAC.edge.id];
    const rec = cur().edges.find((e) => e.id === siteABAC.edge.id).identification;
    S().withdrawMidpointAttempt(siteABAC.edge.id);
    return ref && /is already one with .+ by the solid — composed · corner A; not yours to pair or withdraw/.test(ref.form || '') && rec === undefined;
  })());
check('§4 ★★ A BORN PAIR IS TAKEN (item 3): a role of AB\'s own part paired with a role of AC\'s own part is written to the medial edge\'s record — the record holds the born pair ALONE (never the composed identity), the space grows by one fewer role, the surface draws ONE line across the fold marked `yours, born here`',
  (() => {
    const before = spaceOf(cur(), ABAC).space.roles.length;
    S().giveRolePair(siteABAC.edge.id, xBorn, yBorn);
    const rec = cur().edges.find((e) => e.id === siteABAC.edge.id).identification;
    const R = spaceOf(cur(), ABAC);
    const html = surfaceAt(ABAC);
    return rec && rec.roles.length === 1 && rec.roles[0][0] === xBorn && rec.roles[0][1] === yBorn && R.space.roles.length === before - 1 && countOf(html, 'data-midpoint-line') === 1 && /1 role pair · 0 word pairs — yours, born here/.test(visibleText(html)) && S().midpointRefusals[siteABAC.edge.id] === undefined;
  })());
// the seed edge A–B in the gen-2 shape carries the gen-0 record; an act there that re-glues the role the born pair named
const eAB2 = edgeBetween(cur().edges, A2, byLabel(cur(), 'B'));
const bornSideB = xBorn.startsWith('B:') || yBorn.startsWith('B:') ? (xBorn.startsWith('B:') ? xBorn : yBorn) : null; // the B-side role named by the born pair, as AB's space keys it
check('§4 ★★ THE DEPENDENCY REFUSAL (item 4): at the gen-2 shape\'s seed edge A–B, a gen-0 pair that RE-GLUES the role the born act named is refused, naming the born act in TWO sentences (C-7h item 8, the designer) — `not taken — F1 ↦ Φ3 would make Φ3 one with F1.` then `your pair at ABAC, one generation up, needs Φ3 as its own role: r3 ↦ Φ3.` — with TWO hands (here: withdraw this attempt · at ABAC: withdraw … first) — and the record on A–B unchanged; the far hand taken (the born pair withdrawn through the store), the same gen-0 act is then TAKEN',
  (() => {
    if (!bornSideB) return false;
    const rRaw = bornSideB.slice(2); // the B role (r…) the born pair named
    const before = J(cur().edges.find((e) => e.id === eAB2.id).identification);
    const freeA = flow.roles.map((r) => r.id).find((id) => !eAB2.identification.roles.some(([x]) => x === id) && !eAB2.identification.roles.some(([, y]) => y === id));
    const act = eAB2.vertexIds[0] === A2 ? [freeA, rRaw] : [rRaw, freeA];
    S().giveRolePair(eAB2.id, act[0], act[1]);
    const ref = S().midpointRefusals[eAB2.id];
    const html = surfaceWith(cur(), byLabel(cur(), 'AB'), ref ?? null);
    const text = visibleText(html);
    const unchanged = J(cur().edges.find((e) => e.id === eAB2.id).identification) === before;
    const grammar = ref && ref.dependency && ref.dependency.generationsUp === 1 && /not taken — .+ ↦ .+ would make .+ one with .+\./.test(text) && /your pair at ABAC, one generation up, needs .+ as its own role: .+ ↦ .+\./.test(text) && /here, on [AB]–[AB]: withdraw this attempt/.test(text) && /at ABAC \(one generation up\): withdraw .+ ↦ .+ first/.test(text) && !/refused —|the act just made|nothing glued|rests on the role|rests on what/.test(text);
    // the far hand: the born pair withdrawn at ABAC — then the gen-0 act is taken
    S().withdrawMidpointAttempt(eAB2.id);
    S().withdrawRolePair(siteABAC.edge.id, xBorn, yBorn);
    S().giveRolePair(eAB2.id, act[0], act[1]);
    const after = S().midpointRefusals[eAB2.id];
    const taken = after === undefined && cur().edges.find((e) => e.id === eAB2.id).identification.roles.length === eAB2.identification.roles.length + 1;
    S().withdrawRolePair(eAB2.id, act[0], act[1]);
    note(`the dependency: ${ref && ref.dependency ? `${ref.dependency.act.pair.join(' ↦ ')} at ${ref.dependency.siteId ? cur().vertices[ref.dependency.siteId].data.label : '?'}, ${ref.dependency.generationsUp} generation up — ${ref.dependency.why}` : 'none'} · the act ${J(act)} after the far hand: ${after ? `refused (${after.form || J(after.conflicts.slice(0, 1))})` : 'taken'}`);
    if (!(grammar && unchanged && taken)) note(`  culprits: ${J((text.match(/.{50}(refused —|the act just made|nothing glued|rests on the role|rests on what).{50}/g) || []).slice(0, 4))} · act sentence ${/not taken — .+ ↦ .+ would make .+ one with .+\./.test(text)} · collision ${/your pair at ABAC, one generation up, needs .+ as its own role: .+ ↦ .+\./.test(text)} · hands ${/here, on [AB]–[AB]: withdraw this attempt/.test(text) && /at ABAC \(one generation up\): withdraw .+ ↦ .+ first/.test(text)}`);
    if (!(grammar && unchanged && taken)) note(`  detail: grammar ${grammar} · unchanged ${unchanged} · taken ${taken} · refusal keys ${J(Object.keys(S().midpointRefusals))} · eAB2 ${eAB2.id} · surfaces ${countOf(html, 'data-midpoint-surface')} · refusal boxes ${countOf(html, 'data-midpoint-refusal')} · text ${text.slice(0, 400)}`);
    return grammar && unchanged && taken;
  })());
check('§4 ★ A WITHDRAWAL AT GEN 0 THAT BREAKS NO BORN ACT IS TAKEN (the positive control for the withdrawal check): with the born pair standing again, withdrawing F1 ↦ r0 on A–B goes through — no born act named it',
  (() => {
    S().giveRolePair(siteABAC.edge.id, xBorn, yBorn);
    const pair = eAB2.vertexIds[0] === A2 ? ['F1', 'r0'] : ['r0', 'F1'];
    S().withdrawRolePair(eAB2.id, pair[0], pair[1]);
    const gone = !cur().edges.find((e) => e.id === eAB2.id).identification.roles.some(([x, y]) => x === pair[0] && y === pair[1]);
    S().giveRolePair(eAB2.id, pair[0], pair[1]);
    return gone && S().midpointRefusals[eAB2.id] === undefined;
  })());

// ═══ §4b C-8c — THE STONE AT THE ACT (§123.3): a born pair that would pool two roles of one corner is refused by name; the gen-2 born room is unaffected ═══
console.log('\n----- §4b C-8c: the stone at the act — through the STORE on this generator; the positive controls; gen 2 unchanged; the dependency arm -----');
/** the store loaded with a synthetic tower; an act through `giveRolePair`; what the record and the refusal say after */
const throughStore = (shape, edgeId, u, v) => {
  const snap = S();
  useGeometryStore.setState({ shapes: { synthetic: JSON.parse(J(shape)) }, currentShapeId: 'synthetic', edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {} });
  S().giveRolePair(edgeId, u, v);
  const rec = S().shapes.synthetic.edges.find((x) => x.id === edgeId).identification;
  const ref = S().midpointRefusals[edgeId] ?? null;
  useGeometryStore.setState(snap, true);
  return { written: !!rec && rec.roles.some(([a, b]) => a === u && b === v), form: ref ? ref.form ?? null : null, dependency: ref ? ref.dependency ?? null : null, conflicts: ref ? ref.conflicts.length : 0 };
};
const stoneRun = (() => {
  const rng = rngOf(251); let faces = 0; let pooled = 0; let refused = 0; let named = 0; let shares = 0; let sharesTaken = 0; let disj = 0; let disjTaken = 0; let ex = null;
  for (let i = 0; i < 300 && (pooled < 60 || shares < 30 || disj < 30); i += 1) {
    const sh = tower(rng).shape; faces += 1;
    const p = candidateOf(sh, 'e:P_A:P_B', 'pool');
    if (p) {
      pooled += 1;
      const r = throughStore(sh, 'e:P_A:P_B', p.u, p.v);
      if (!r.written && r.form) { refused += 1; if (/^.+ ↦ .+ would make \w+ and \w+ one: two roles of corner [ABC], which the corner keeps apart$/.test(r.form)) named += 1; if (!ex) ex = { pair: [p.u, p.v], tags: [p.cu, p.cv], form: r.form }; }
    }
    const s = candidateOf(sh, 'e:P_A:P_B', 'share');
    if (s) { shares += 1; if (throughStore(sh, 'e:P_A:P_B', s.u, s.v).written) sharesTaken += 1; }
    const d = candidateOf(sh, 'e:P_A:P_B', 'disjoint');
    if (d) { disj += 1; if (throughStore(sh, 'e:P_A:P_B', d.u, d.v).written) disjTaken += 1; }
  }
  return { faces, pooled, refused, named, shares, sharesTaken, disj, disjTaken, ex };
})();
check('§4b ★★ THE STONE AT THE ACT (C-8c item 1 — 0031 §6 invariant 3): through the STORE, at a gen-3 site (Q on P_A–P_B) a born pair whose two roles hold two seed roles of ONE corner is REFUSED BY NAME — the two seed roles by their own labels and their corner, in the one grammar (C-7h item 7, the designer\'s words): `Φ2 ↦ r1 would make c1 and c3 one: two roles of corner C, which the corner keeps apart` — and nothing is written; the positive controls at the same site: a pair that SHARES a seed and pools nothing is TAKEN (it dissolves a doubling), a DISJOINT clean pair is TAKEN',
  (() => {
    const { faces, pooled, refused, named, shares, sharesTaken, disj, disjTaken, ex } = stoneRun;
    note(`${faces} faces through the store at Q: pooling pairs tried ${pooled} — refused ${refused}, named ${named} · share-a-seed pairs tried ${shares} — taken ${sharesTaken} · disjoint pairs tried ${disj} — taken ${disjTaken} · the first refusal: ${J(ex)}`);
    return pooled > 0 && refused === pooled && named === pooled && shares > 0 && sharesTaken === shares && disj > 0 && disjTaken === disj;
  })());
check('§4b ★ THE STONE AS THE PERSON READS IT — the refusal box rendered at ABAC (the real gen-2 shape) with the store\'s own refusal as a prop, in the ONE grammar (C-7h items 6–7): the head `not taken — <pair> would make c1 and c3 one: two roles of corner C, which the corner keeps apart`, ONE hand `here, on AC–AB: withdraw this attempt` naming nothing by a key, no `refused`, no `(the act just made)`, no `nothing glued`, no dependency box',
  (() => {
    const form = stoneRun.ex ? stoneRun.ex.form : null;
    if (!form) return false;
    const html = surfaceWith(G2, ABAC, { act: { kind: 'role', pair: [xBorn, yBorn] }, form, conflicts: [] });
    const text = visibleText(html);
    const la = G2.vertices[siteABAC.a].data.label; const lb = G2.vertices[siteABAC.b].data.label;
    const at = Math.max(0, text.indexOf('not taken —'));
    note(`the box at ABAC: ${text.slice(at, at + 240)}`);
    const hand = `here, on ${la}–${lb}: withdraw this attempt`;
    note(`  culprits: ${J((text.match(/.{50}(refused —|the act just made|nothing glued).{50}/g) || []).slice(0, 4))} · form ${attrsOf(html, 'data-midpoint-refusal-form').length} · head ${text.includes(`not taken — ${form}`)} · attempt hands ${countOf(html, 'data-midpoint-withdraw-attempt')} · dependency ${countOf(html, 'data-midpoint-refusal-dependency')} · hand ${text.includes(hand)} · keys shown ${text.includes(`withdraw ${xBorn} ↦`)} · attr ${attrsOf(html, 'data-midpoint-withdraw').includes(`attempt|${xBorn}|${yBorn}`)}`);
    return countOf(html, 'data-midpoint-refusal') === 1 && attrsOf(html, 'data-midpoint-refusal-form').length === 1 && text.includes(`not taken — ${form}`) && /^.+ ↦ .+ would make \w+ and \w+ one: two roles of corner [A-D], which the corner keeps apart$/.test(form) && countOf(html, 'data-midpoint-withdraw-attempt') === 1 && countOf(html, 'data-midpoint-refusal-dependency') === 0 && text.includes(hand) && !/refused —|the act just made|nothing glued/.test(text) && !text.includes(`withdraw ${xBorn} ↦`) && attrsOf(html, 'data-midpoint-withdraw').includes(`attempt|${xBorn}|${yBorn}`);
  })());
check('§4b ★★ THE GEN-2 BORN ROOM IS UNAFFECTED (the behaviour-neutral half): at P_A on M_CA–M_AB every candidate born pair joins two corners\' own roles — 0 of them pool under the resolver (this generator\'s census, all faces), and through the store a disjoint pair is taken exactly as before, none refused by the stone',
  (() => {
    const rng = rngOf(251); let pairs = 0; let pools = 0; let tried = 0; let taken = 0;
    for (let i = 0; i < 3000; i += 1) {
      const sh = tower(rng).shape;
      const e = sh.edges.find((x) => x.id === 'e:M_CA:M_AB');
      const U = spaceOf(sh, e.vertexIds[0]); const V = spaceOf(sh, e.vertexIds[1]);
      const comp = composedOn(sh, U, V, e.vertexIds, 'medial');
      const dom = new Set(comp.roles.map(([a]) => a)); const im = new Set(comp.roles.map(([, b]) => b));
      for (const [, cu] of [...U.roleContent].filter(([k]) => !dom.has(k))) for (const [, cv] of [...V.roleContent].filter(([k]) => !im.has(k))) { pairs += 1; if (poolsTags(new Set([...cu, ...cv]))) pools += 1; }
      if (i < 60) { const d = candidateOf(sh, 'e:M_CA:M_AB', 'disjoint'); if (d) { tried += 1; const r = throughStore(sh, 'e:M_CA:M_AB', d.u, d.v); if (r.written && !r.form) taken += 1; } }
    }
    note(`gen 2 born room over 3000 faces: ${pairs} candidate pairs, ${pools} pool · through the store: ${tried} disjoint pairs tried, ${taken} taken`);
    return pairs > 0 && pools === 0 && tried > 0 && taken === tried;
  })());
/** the stone read by this witness's own hand: two DIFFERENT seeds of one corner, one in each content (never a shared tag — that dissolves a doubling) */
const crossPools = (cu, cv) => { for (const t of cu) for (const u of cv) if (t !== u && cornerOfSeed(t) === cornerOfSeed(u)) return true; return false; };
const depArm = (() => {
  const rng = rngOf(11); let faces = 0; let tried = 0; let poolBreaks = 0; let found = 0; let disagree = 0; let ex = null;
  let triedW = 0; let poolBreaksW = 0; let foundW = 0; let disagreeW = 0; let exW = null;
  /** under a candidate record on a gen-0 edge, would the standing born pair at Q pool by this witness's own reading — with the resolver's earlier reasons (no longer a role; composed) excluded the same way? */
  let kept = 0; let keptChanged = 0;
  const contentOf = (R, id) => J([...(R.roleContent.get(id) ?? [])].sort());
  const wouldPool = (sh, id, roles, born, standing) => {
    const options = { candidate: { edgeId: id, roles, types: sh.edges.find((x) => x.id === id).identification.types } };
    const U = spaceOf(sh, 'P_A', options); const V = spaceOf(sh, 'P_B', options);
    if (!U || !V) return false;
    if (!U.space.roles.some((r) => r.id === born[0]) || !V.space.roles.some((r) => r.id === born[1])) return false;
    kept += 1;
    if (contentOf(U, born[0]) !== standing[0] || contentOf(V, born[1]) !== standing[1]) keptChanged += 1;
    const comp = composedOn(sh, U, V, ['P_A', 'P_B'], 'medial');
    if (comp.roles.some(([a]) => a === born[0]) || comp.roles.some(([, b]) => b === born[1])) return false;
    return crossPools(U.roleContent.get(born[0]), V.roleContent.get(born[1]));
  };
  for (let i = 0; i < 3000 && faces < 400; i += 1) {
    const sh = tower(rng).shape;
    const d = candidateOf(sh, 'e:P_A:P_B', 'disjoint') ?? candidateOf(sh, 'e:P_A:P_B', 'share');
    if (!d) continue;
    sh.edges.find((x) => x.id === 'e:P_A:P_B').identification = { roles: [[d.u, d.v]], types: [] };
    if (brokenBornActs(sh).length) continue;
    faces += 1;
    const standing = (() => { const U0 = spaceOf(sh, 'P_A'); const V0 = spaceOf(sh, 'P_B'); return [contentOf(U0, d.u), contentOf(V0, d.v)]; })();
    for (const id of ['e:A:B', 'e:B:C', 'e:C:A']) {
      const e = sh.edges.find((x) => x.id === id);
      const X = e.vertexIds[0].toLowerCase(); const Y = e.vertexIds[1].toLowerCase();
      const dom = new Set(e.identification.roles.map(([a]) => a)); const im = new Set(e.identification.roles.map(([, b]) => b));
      for (const a of [0, 1, 2, 3, 4].map((k) => `${X}${k}`).filter((r) => !dom.has(r))) for (const b of [0, 1, 2, 3, 4].map((k) => `${Y}${k}`).filter((r) => !im.has(r))) {
        tried += 1;
        const roles = [...e.identification.roles, [a, b]];
        const broken = brokenBornActs(sh, { candidate: { edgeId: id, roles, types: e.identification.types } }, id);
        const pooling = broken.find((x) => /which the corner keeps apart/.test(x.why));
        const own = wouldPool(sh, id, roles, [d.u, d.v], standing);
        if (pooling) { poolBreaks += 1; if (!ex) ex = { face: i, edge: id, act: [a, b], born: [d.u, d.v], why: pooling.why }; }
        if (own) found += 1;
        if (Boolean(pooling) !== own) disagree += 1;
      }
      for (const [a, b] of e.identification.roles) {
        triedW += 1;
        const roles = e.identification.roles.filter(([x, y]) => !(x === a && y === b));
        const broken = brokenBornActs(sh, { candidate: { edgeId: id, roles, types: e.identification.types } }, id);
        const pooling = broken.find((x) => /which the corner keeps apart/.test(x.why));
        const own = wouldPool(sh, id, roles, [d.u, d.v], standing);
        if (pooling) { poolBreaksW += 1; if (!exW) exW = { face: i, edge: id, withdraw: [a, b], born: [d.u, d.v], why: pooling.why }; }
        if (own) foundW += 1;
        if (Boolean(pooling) !== own) disagreeW += 1;
      }
    }
  }
  return { faces, tried, poolBreaks, found, disagree, ex, triedW, poolBreaksW, foundW, disagreeW, exW, kept, keptChanged };
})();
check('§4b ★★ THE STONE IN THE DEPENDENCY READING (C-8c item 2): with a clean born pair standing at Q (gen 3), a LOWER ACT (a gen-0 pair on A–B, B–C or C–A) that would make that born pair POOL is refused naming it — a third reason beside `no longer a role there` and `would be one with … by the solid` — PINNED against this witness\'s own reading of the stone (the resolver\'s earlier reasons excluded the same way): the two readings agree on every act; the case found, else its bound printed WITH ITS MECHANISM — a born pair\'s role that keeps its key keeps its content (0 changed under the kept), so on this key scheme the earlier reason precedes the stone',
  (() => {
    const { faces, tried, poolBreaks, found, disagree, ex, kept, keptChanged } = depArm;
    note(`${faces} faces with a clean born pair standing at Q · ${tried} gen-0 acts read as candidates · ${poolBreaks} would make the born pair pool and are refused naming it · this witness\'s own reading finds ${found} (${disagree} disagreements)${ex ? ` — first: ${J(ex)}` : ' — none in this bound'}`);
    note(`the MECHANISM of the bound, measured: under ${kept} candidates (acts and withdrawals) the born pair\'s two roles kept their KEYS — and kept their CONTENT under every one of them (${keptChanged} changed): a class is renamed when its content changes, so \`no longer a role there\` precedes the stone on this key scheme`);
    return faces > 0 && tried > 0 && disagree === 0 && poolBreaks === found && kept > 0 && keptChanged === 0 && (poolBreaks > 0 || (note('⚠ no gen-0 act makes the born pair pool on this generator in this bound — the bound is printed, not the case'), true));
  })());
check('§4b ★ THE STONE IN THE DEPENDENCY READING, ON WITHDRAWALS (C-8c item 2 — "a lower act, or a withdrawal"): every standing gen-0 pair withdrawn as a candidate under the same born pair — the resolver and this witness\'s own reading agree on every withdrawal; found and pinned, or its bound printed',
  (() => {
    const { faces, triedW, poolBreaksW, foundW, disagreeW, exW } = depArm;
    note(`${faces} faces · ${triedW} gen-0 withdrawals read as candidates · ${poolBreaksW} would make the born pair pool and are refused naming it · this witness\'s own reading finds ${foundW} (${disagreeW} disagreements)${exW ? ` — first: ${J(exW)}` : ' — none in this bound: a withdrawal splits classes and cannot join two seeds of one corner; the bound is printed'}`);
    return faces > 0 && triedW > 0 && disagreeW === 0 && poolBreaksW === foundW;
  })());

// ═══ §5 THE LOADER on the seed alone; the boundaries ═══
console.log('\n----- §5 the loader offered on the seed\'s corners alone; the boundaries -----');
const editor = readLf('src/components/VertexPacketEditor.tsx');
const lib = readLf('src/lib/spaceOf.ts');
const surf = readLf('src/components/MidpointSurface.tsx');
const store = readLf('src/store/geometryStore.ts');
check('§5 ★★ THE LOADER IS OFFERED ON THE SEED\'S OWN CORNERS ALONE, BY CONSTRUCTION (item 2, Δ86): the packet editor renders `load cast…` and its file input only under `vertex?.createdBy.operation === \'seed\'` — a WHITELIST by what the vertex is, never a blacklist of midpoints; the button is never `disabled`; no word is added; the load function refuses the same way',
  /\{vertex\?\.createdBy\.operation === 'seed' \? \(\s*<>\s*<button/.test(editor) && !/load cast[^]*?disabled=/.test(editor.slice(editor.indexOf("vertex?.createdBy.operation === 'seed'"), editor.indexOf('data-cast-file-input'))) && editor.includes("if (!vertex || vertex.createdBy.operation !== 'seed') return;") && !/isGeneratedMidpointVertex\(vertex\)[^]{0,80}load cast/.test(editor));
// The editor RENDERED under node cannot carry this clause: the packet editor reads its selection through the store's hooks,
// and a server render reads the store's INITIAL state (measured here — `No vertex selected.` whatever the state set) — so the
// offer's absence at a midpoint and its presence at a corner are read AT THE EYE by the drive leg (its §6), where the
// selection is the person's; here the rule is pinned in the source, by construction.
check('§5 ⛔ THE RESOLVER IS PURE: spaceOf.ts imports only the types, the mold predicate from the loader, `edgeBetween` from the face, the glue, the register\'s check, the foot\'s name (feet.ts, a leaf with no import of its own — C-12b) and C-9\'s one reader (bornFace\'s `bornStepOf`, deferred across the cycle, itself importing no store, component or manuscript — C-12b) — no store, no component, nothing written (`.cast =` and `identification =` nowhere); the chooser, the inside\'s panel and the store read `spaceOf`, and `data.cast` is read in the surface by nothing',
  (lib.match(/^import /gm) || []).length === 7 && lib.includes("import { footTypeName } from './feet';") && lib.includes("import { bornStepOf } from './bornFace';") && !/^import /m.test(readLf('src/lib/feet.ts')) && !/useGeometryStore|from '\.\.\/store|from '\.\.\/components|from '\.\.\/manuscript|from 'three'|@react-three/.test(readLf('src/lib/bornFace.ts')) && lib.includes("import { isMoldType } from './castLoader';") && lib.includes("import { edgeBetween } from './faceReading';") && lib.includes("import { glue, gluedSpace, type GluedNaming, type GluedSpace, type Midpoint } from './midpointGlue';") && lib.includes("import { refusalOf, type Conflict } from './jRegister';") &&
    !/useGeometryStore|from '\.\.\/store|from '\.\.\/components|\.cast\s*=|identification\s*=/.test(lib) && !/\.data\.cast/.test(surf) && !/\.data\.cast/.test(store) && !/\.data\.cast/.test(readLf('src/components/CastInsideDiagram.tsx')) &&
    surf.includes("import { feetShareOf, generationOf, holdsLoadedCast, isSeedVertex, nameIn, spaceCounts, spaceOf, type Resolved } from '../lib/spaceOf';") && store.includes("from '../lib/spaceOf';"));
check('§5 the manifest classifies the resolver NOT_FROZEN at its landing', /^NOT_FROZEN src\/lib\/spaceOf\.ts /m.test(readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt')));
check('§5 the face at gen 0 stays the seed\'s at the SITE: `FaceRecord` mounts there only when every corner of the face is a seed vertex; a born face is NAMED there in a line (C-10b) and read at its home — no `BornFaceRecord` mount in the surface', surf.includes("cycle.length === 3 && cycle.every((v) => isSeedVertex(shape, v)) ? (\n        <FaceRecord") && !surf.includes('<BornFaceRecord ') && surf.includes('data-midpoint-born-face-at-site='));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-BORN-ROOM: ALL PASS — one resolver; the edge\'s kind fixes its J; the meet never pools and reproduces the doubling; the loader on the seed alone; the composed identity never a pair; a born pair taken; a later act that would break it refused by name' : `DIAGNOSE-THE-BORN-ROOM: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
