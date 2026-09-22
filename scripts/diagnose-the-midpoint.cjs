#!/usr/bin/env node

// DIAGNOSTIC — THE MIDPOINT (STAMP C-7b, 2026-09-22; Δ81 BOTH opposite vertices):
// the ambo site's concept-space as the PUSHOUT of its two parents' casts over
// the person's (J, τ), the REFUSAL at the act, the TRACE of the act, the
// unfolded SURFACE on the canvas, and the presenter's TRACE consumed for the
// structural inputs (the MARKER of 1036).
//
// ⛔ THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the glue is RUN on the
// fixtures FROM THE RECORD and read against the researcher's seal
// (inside_midpoint_trace.py, sealed by hand at 10ccb00): flow ⊔_∅ phi = 23 roles ·
// 25 words · 56 tuples · 23 marks; under (J₃, τ₃) 20 · 22 · 52 (4 both) · 20 marks,
// K = 3 · 4 · 3, 14 + 9 − 3 = 20; [F5≡Φ7] 7: 1 · 4 · 2 · [F7≡Φ1] 24: 3 · 7 · 14 ·
// [F8≡Φ2] 7: 2 · 3 · 2; flow alone 11 · 27 · 3 · 0; phi alone 6 · 11 · 7 · 0;
// t-cell × phi r8↦Φ6 r0↦Φ1 under sustains↦descends-from REFUSED, one name;
// t-cell × phi r7↦Φ9 REFUSED, one name; flow × phi F2↦Φ1 under
// disjoins↦descends-from GLUED — [F2≡Φ1] 23: 0 · 6 · 17, phi alone 8 · 16 · 5 · 1
// (the 09-08 fabrication site: the one tuple is an EXPOSURE, an absence shown).
// A disagreement reopens the DEFINITION, never tunes the code.
//
// The store is driven by BEHAVIOUR (the acts, the refusal with every
// withdrawal, the re-made attempt, the draft); the surface is rendered to a
// string under node with the record as props; the mount and the boundaries are
// source-pinned. LAW 24 on every refusal: the glue that DOES glue is beside it.

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
const { glue, traceOf } = req('src/lib/midpointGlue.ts');
const { describeConflict, wordPairForm, refusalOf } = req('src/lib/jRegister.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);
const J = (x) => JSON.stringify(x);

console.log('THE MIDPOINT — the pushout over the person\'s (J, τ), the refusal at the act, the trace of the act, the unfolded surface (C-7b)\n');

const tri = cast('triangle.cast.json');
const tcell = cast('t-cell.cast.json');
const flow = cast('flow.cast.json');
const phi = cast('phi.cast.json');
const unrec = cast('unrecorded.cast.json');
const J3 = [['F5', 'Φ7'], ['F7', 'Φ1'], ['F8', 'Φ2']];
const T3 = [['sustains', 'descends-from'], ['presupposes', 'specifies'], ['exceeds-in-size', 'lodges-in']];
const countsLine = (M) => `${M.counts.roles} roles · ${M.counts.words} words · ${M.counts.tuples} tuples (${M.counts.both} both) · ${M.counts.marks} marks`;
const roleLine = (r) => `[${r.a}≡${r.b}] ${r.about}: both ${r.both} · A ${r.fromA} · B ${r.fromB}`;
const parentLine = (p) => `${p.unmatched} roles · ${p.onUnmatched} on them · ${p.untranslatedOnMapped} untranslated on mapped · ${p.exposed} exposed`;

// ═══ §1 THE SEAL — the glue and the trace ═══
const empty = glue(flow, phi, [], []);
check('§1 ★★ THE UNMAPPED MIDPOINT is the DISJOINT UNION: flow ⊔_∅ phi glued (nothing refused) — `23 roles · 25 words · 56 tuples (0 both) · 23 marks`; `disjoins` and `presupposes`, spelled alike on both sides, are TWO words each (foreign outside τ — the same-name proposal is gone)',
  !empty.refused && countsLine(empty.midpoint) === '23 roles · 25 words · 56 tuples (0 both) · 23 marks' && empty.midpoint.words.filter((w) => w.a === 'disjoins' || w.b === 'disjoins').length === 2 && empty.midpoint.words.every((w) => w.origin !== 'both') && empty.midpoint.core.roles === 0,
  empty.refused ? 'refused' : countsLine(empty.midpoint));
const t0 = traceOf(flow, phi, empty.midpoint);
check('§1 ★ the disjoint union\'s trace: no glued role; Flow alone 14 roles · 34 tuples on them; Φ alone 9 · 22 — nothing translated, nothing exposed',
  t0.glued.length === 0 && parentLine(t0.parents[0]) === '14 roles · 34 on them · 0 untranslated on mapped · 0 exposed' && parentLine(t0.parents[1]) === '9 roles · 22 on them · 0 untranslated on mapped · 0 exposed');
const given = glue(flow, phi, J3, T3);
const M3 = given.refused ? null : given.midpoint;
check('§1 ★★ THE SEAL under (J₃, τ₃): glued — `20 roles · 22 words · 52 tuples (4 both) · 20 marks`; the core K = 3 roles · 4 tuples · 3 marks; |R_M| = 14 + 9 − 3 = 20',
  M3 !== null && countsLine(M3) === '20 roles · 22 words · 52 tuples (4 both) · 20 marks' && J(M3.core) === '{"roles":3,"tuples":4,"marks":3}' && M3.counts.roles === 14 + 9 - 3,
  M3 ? countsLine(M3) : 'refused');
const t3 = M3 ? traceOf(flow, phi, M3) : null;
check('§1 ★★ THE TRACE per glued role (the origin partition): `[F5≡Φ7] 7: both 1 · A 4 · B 2` · `[F7≡Φ1] 24: both 3 · A 7 · B 14` · `[F8≡Φ2] 7: both 2 · A 3 · B 2` — each with the mold\'s value `has` witnessed by both',
  t3 !== null && J(t3.glued.map(roleLine)) === J(['[F5≡Φ7] 7: both 1 · A 4 · B 2', '[F7≡Φ1] 24: both 3 · A 7 · B 14', '[F8≡Φ2] 7: both 2 · A 3 · B 2']) && t3.glued.every((r) => r.mark && r.mark.type === 'member_status' && r.mark.value === 'has' && J(r.mark.witnesses) === '["A","B"]'),
  t3 ? J(t3.glued.map(roleLine)) : '');
check('§1 ★★ THE TRACE per parent (A ⊖ K, never A ⊖ M): Flow alone `11 roles · 27 on them · 3 untranslated on mapped · 0 exposed`; Φ alone `6 roles · 11 on them · 7 untranslated on mapped · 0 exposed` — ⚠ Φ: SIX of its nine met no partner (the letter\'s `3 of its 9` is the count that met one)',
  t3 !== null && parentLine(t3.parents[0]) === '11 roles · 27 on them · 3 untranslated on mapped · 0 exposed' && parentLine(t3.parents[1]) === '6 roles · 11 on them · 7 untranslated on mapped · 0 exposed' && t3.parents[1].roles === 9 && t3.parents[0].roles === 14,
  t3 ? `${parentLine(t3.parents[0])} / ${parentLine(t3.parents[1])}` : '');
check('§1 ★ THE COLOURING follows the same partition: exactly 4 of Flow\'s own tuples and 4 of Φ\'s read `both` under (J₃, τ₃) — one glued tuple, two appearances; none under ∅',
  M3 !== null && [...M3.originOf.A.values()].filter((o) => o === 'both').length === 4 && [...M3.originOf.B.values()].filter((o) => o === 'both').length === 4 && [...empty.midpoint.originOf.A.values()].every((o) => o === 'A'));
check('§1 ★★ THE REFUSAL, by name (LAW 24 beside the glue): t-cell × phi with r8↦Φ6 · r0↦Φ1 under sustains↦descends-from is REFUSED — exactly one conflict, `sustains(r8, r0) does-not-hold here · descends-from(Φ6, Φ1) holds there`',
  (() => { const r = glue(tcell, phi, [['r8', 'Φ6'], ['r0', 'Φ1']], [['sustains', 'descends-from']]); return r.refused && r.conflicts.length === 1 && describeConflict(r.conflicts[0]) === 'sustains(r8, r0) does-not-hold here · descends-from(Φ6, Φ1) holds there'; })());
check('§1 ★★ THE REFUSAL ON THE MOLD\'S TYPE, no τ on the key: t-cell × phi with r7↦Φ9 under τ = ∅ is REFUSED — one name, `member_status: r7 has · Φ9 none-by-nature`',
  (() => { const r = glue(tcell, phi, [['r7', 'Φ9']], []); return r.refused && r.conflicts.length === 1 && describeConflict(r.conflicts[0]) === 'member_status: r7 has · Φ9 none-by-nature'; })());
check('§1 ★★ NOT A REFUSAL — the 09-08 fabrication site: flow × phi with F2↦Φ1 under disjoins↦descends-from GLUES; `[F2≡Φ1] 23: both 0 · A 6 · B 17`; Flow alone `13 roles · 34 on them · 0 · 0`; Φ alone `8 roles · 16 on them · 5 untranslated · 1 exposed` — the one tuple is an EXPOSURE (an absence shown), never fabricated into Flow',
  (() => {
    const r = glue(flow, phi, [['F2', 'Φ1']], [['disjoins', 'descends-from']]);
    if (r.refused) return false;
    const t = traceOf(flow, phi, r.midpoint);
    return t.glued.length === 1 && roleLine(t.glued[0]) === '[F2≡Φ1] 23: both 0 · A 6 · B 17' && parentLine(t.parents[0]) === '13 roles · 34 on them · 0 untranslated on mapped · 0 exposed' && parentLine(t.parents[1]) === '8 roles · 16 on them · 5 untranslated on mapped · 1 exposed';
  })());
// the mold's type at the glue — C-7pre through the pushout
const minimal = (role, value) => readCastFile(J({ roles: [{ id: role, types: { member_status: value } }], signature: [], relations: [] })).cast;
const glueOne = (u, v) => { const r = glue(minimal('x', u), minimal('y', v), [['x', 'y']], []); if (r.refused) return 'refused'; const m = r.midpoint.marks.find((mk) => mk.role === 'x≡y'); return m ? `${m.value} ${J(m.witnesses)}` : 'no mark'; };
check('§1 ★★ THE MOLD\'S TYPE AT THE GLUE (the researcher\'s five minimal cases, C-7pre): has × unrecorded → glued value `has`, witnesses A and B; unrecorded × none-by-nature → refused; has × none-by-nature → refused; UNKNOWN × has → glued `has` witnessed by B alone; UNKNOWN × none-by-nature → glued `none-by-nature` witnessed by B alone (UNKNOWN is absence, never a value)',
  glueOne('has', 'unrecorded') === 'has ["A","B"]' && glueOne('unrecorded', 'none-by-nature') === 'refused' && glueOne('has', 'none-by-nature') === 'refused' && glueOne('UNKNOWN', 'has') === 'has ["B"]' && glueOne('UNKNOWN', 'none-by-nature') === 'none-by-nature ["B"]',
  [glueOne('has', 'unrecorded'), glueOne('unrecorded', 'none-by-nature'), glueOne('has', 'none-by-nature'), glueOne('UNKNOWN', 'has'), glueOne('UNKNOWN', 'none-by-nature')].join(' · '));
check('§1 ★ THE FIXTURE THAT USES `unrecorded`: u1 ↦ F1 (has) glues with the mark `has` witnessed by both; u1 ↦ Φ9 (none-by-nature) is refused',
  (() => { const a = glue(unrec, flow, [['u1', 'F1']], []); const b = glue(unrec, phi, [['u1', 'Φ9']], []); return !a.refused && a.midpoint.marks.some((m) => m.role === 'u1≡F1' && m.value === 'has' && J(m.witnesses) === '["A","B"]') && b.refused; })());
check('§1 ★ WORDS OUTSIDE τ ARE FOREIGN EVEN WHEN SPELLED ALIKE (LAW 24 both ways): flow × phi with F4↦Φ1 and NO τ shares no tuple (`disjoins` is two words); the same map with the PERSON\'s `disjoins ↦ disjoins` shares the loop — exactly one `both`',
  (() => { const a = glue(flow, phi, [['F4', 'Φ1']], []); const b = glue(flow, phi, [['F4', 'Φ1']], [['disjoins', 'disjoins']]); return !a.refused && a.midpoint.counts.both === 0 && !b.refused && b.midpoint.counts.both === 1 && b.midpoint.words.some((w) => w.key === 'disjoins≡disjoins'); })());
check('§1 ★ THE FORM of a word pair: `sustains ↦ descends-from` has it; `removes ↦ decays` names arity 3 against 2 (`"removes" is arity 3 here and "decays" is arity 2 there — a translation keeps the arity`); an undeclared word is named',
  wordPairForm(flow, phi, 'sustains', 'descends-from') === null && wordPairForm(tcell, phi, 'removes', 'decays') === '"removes" is arity 3 here and "decays" is arity 2 there — a translation keeps the arity' && wordPairForm(flow, phi, 'nope', 'decays') === '"nope" is not a word this cast declares');
check('§1 a pair naming a role a cast does not hold is NOT glued and NOT refused by the glue (the surface names it): flow × phi with F99↦Φ1 glues as the disjoint union',
  (() => { const r = glue(flow, phi, [['F99', 'Φ1']], []); return !r.refused && r.midpoint.pairs.length === 0 && r.midpoint.counts.roles === 23; })());

// ═══ §2 THE STRUCTURAL INPUTS — the presenter's TRACE consumed (the MARKER of 1036) ═══
console.log('\n----- §2 the presenter\'s trace consumed: parents, host, the two opposite vertices; the source edge resolved in the current shape -----');
const { midpointSiteOf, MidpointSurface, ConceptSurface, actsOfRefusal, residualWords, conflictWords } = req('src/components/MidpointSurface.tsx');
const seed = createSeedShape('tetrahedron');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
let seeded = withCast(withCast(withCast(withCast(seed, byLabel(seed, 'A'), flow), byLabel(seed, 'B'), phi), byLabel(seed, 'C'), tcell), byLabel(seed, 'D'), phi);
const ambo = applyAmboDissection(seeded);
const report = buildGeneralSitePacketPresenterReport(ambo);
const a = byLabel(ambo, 'A'); const b = byLabel(ambo, 'B'); const c = byLabel(ambo, 'C'); const d = byLabel(ambo, 'D');
const packetAB = report.packets.find((p) => p.trace.parentIds.includes(a) && p.trace.parentIds.includes(b));
const siteAB = midpointSiteOf(ambo, packetAB.trace.siteId, packetAB.trace);
check('§2 ★★ THE TRACE CONSUMED, NOT RE-DERIVED: the presenter names the AB site\'s parents (A, B), its host (the parent cell) and its complement {C, D} — Δ81 already in the engine\'s arithmetic; the surface\'s inputs come from it (`midpointSiteOf` takes the trace)',
  report.issues.length === 0 && report.generatedSiteCount === 6 && packetAB && J([...packetAB.trace.complementVertexIds].sort()) === J([c, d].sort()) && ambo.cells.find((x) => x.id === packetAB.trace.hostCellId).kind === 'parent' && siteAB !== null && siteAB.hostCellId === packetAB.trace.hostCellId);
check('§2 ★★ THE SOURCE EDGE IS RESOLVED IN THE CURRENT SHAPE by the two parents (the parent-cell-face edge between A and B — the same object the mounted register reads for that seam): it exists; the midpoint\'s `createdBy.sourceEdgeId` names the PARENT shape\'s edge and does NOT resolve in the ambo shape (measured — the ambo re-derives its edges with fresh ids)',
  siteAB.edge && siteAB.edge.vertexIds.includes(a) && siteAB.edge.vertexIds.includes(b) && !ambo.edges.some((e) => e.id === ambo.vertices[packetAB.trace.siteId].createdBy.sourceEdgeId) && seed.edges.some((e) => e.id === ambo.vertices[packetAB.trace.siteId].createdBy.sourceEdgeId));
check('§2 ★★ BOTH OPPOSITE VERTICES, SEPARATELY, THROUGH THEIR FACES (Δ81): the host\'s two faces incident to the edge A–B, each with ONE apex — {C} and {D}, the presenter\'s complement as a set; the face names composed from the corners by D14 (`A·B·C` · `A·D·B` — the first corner alphabetically, then along that face) — never the combined projection',
  siteAB.sources.length === 2 && J(siteAB.sources.map((s) => s.apexes).flat().sort()) === J([c, d].sort()) && siteAB.sources.every((s) => s.apexes.length === 1 && /^[A-D](·[A-D]){2}$/.test(s.faceName)),
  J(siteAB.sources));
note(`the faces: ${siteAB.sources.map((s) => `${s.faceName} → ${s.apexes.map((v) => ambo.vertices[v].data.label).join(',')}`).join(' · ')}`);
check('§2 ★ A LATER GENERATION (the ambo of the core, an octahedral host): the presenter\'s complement has FOUR vertices and the two incident faces have TWO apexes among them — the unfolding needs the faces, which the trace does not carry; read from the host it names',
  (() => {
    const core = ambo.cells.find((x) => x.kind === 'core');
    const gen2 = applyAmboDissection(ambo, core.id);
    const rep2 = buildGeneralSitePacketPresenterReport(gen2);
    const p2 = rep2.packets.find((p) => p.trace.generationDepth === 2);
    const s2 = midpointSiteOf(gen2, p2.trace.siteId, p2.trace);
    return p2.trace.complementVertexIds.length === 4 && s2 !== null && s2.sources.length === 2 && s2.sources.every((s) => s.apexes.length === 1 && p2.trace.complementVertexIds.includes(s.apexes[0]));
  })());
// C-7c item 1 (2026-09-22) — THE SECOND DISSECTION, MEASURED: a record given at a gen-1 midpoint, then the ambo again.
// The MECHANISM is pinned (the pair survives as a parent-cell-face edge with a FRESH id — `makeEdgeId(shapeId, pair)`
// depends on the shape id; the gen-1 shape keeps its record); the gen-2 record's state is PRINTED as a note, never
// pinned as expected — a carry across the dissection is priced in the report, not built here.
check('§2 ★★ THE SECOND DISSECTION, MEASURED (C-7c item 1): a J given on the gen-1 edge A–B, then the core dissected — the pair A–B exists in gen 2 as a parent-cell-face edge with a DIFFERENT id (the mint depends on the shape id), the gen-1 shape keeps its record intact, and the AB midpoint\'s site at gen 2 resolves to the NEW edge; what that edge carries is printed beneath, as a fact',
  (() => {
    const g1 = withCast(withCast(applyAmboDissection(seed), a, flow), b, phi);
    const r1 = buildGeneralSitePacketPresenterReport(g1);
    const p1 = r1.packets.find((p) => p.trace.parentIds.includes(a) && p.trace.parentIds.includes(b));
    const s1 = midpointSiteOf(g1, p1.trace.siteId, p1.trace);
    const given = { ...g1, edges: g1.edges.map((e) => (e.id === s1.edge.id ? { ...e, identification: { roles: [['F5', 'Φ7']], types: [['sustains', 'descends-from']] } } : e)) };
    const g2 = applyAmboDissection(given, given.cells.find((x) => x.kind === 'core').id);
    const pairOf = (e) => [...e.vertexIds].sort().join('|');
    const twin = g2.edges.filter((e) => pairOf(e) === pairOf(s1.edge));
    const r2 = buildGeneralSitePacketPresenterReport(g2);
    const p2 = r2.packets.find((p) => p.trace.siteId === p1.trace.siteId);
    const s2 = p2 ? midpointSiteOf(g2, p2.trace.siteId, p2.trace) : null;
    note(`gen-1 edge ${s1.edge.id} → gen-2 edge ${twin.map((e) => e.id).join(',')} · the gen-2 edge carries: ${JSON.stringify(twin[0] && twin[0].identification)} · any record in gen 2: ${g2.edges.filter((e) => e.identification).length} · the AB surface at gen 2 reads ${s2 && s2.edge.identification ? 'glued' : 'no pair given yet'}`);
    return twin.length === 1 && twin[0].id !== s1.edge.id && given.edges.find((e) => e.id === s1.edge.id).identification.roles.length === 1 && s2 !== null && s2.edge.id === twin[0].id && !g2.edges.some((e) => e.id === s1.edge.id);
  })());
check('§2 a site whose parents do not both hold a cast has NO surface: the AD midpoint (A holds Flow, D holds Φ) has one; a seed with casts on A alone yields none for AB (the chooser falls to the corner\'s own inside, or nothing)',
  (() => { const one = applyAmboDissection(withCast(seed, byLabel(seed, 'A'), flow)); const rep = buildGeneralSitePacketPresenterReport(one); const p = rep.packets.find((x) => x.trace.parentIds.includes(byLabel(one, 'A')) && x.trace.parentIds.includes(byLabel(one, 'B'))); const s = midpointSiteOf(one, p.trace.siteId, p.trace); return s !== null && !(one.vertices[s.a].data.cast && one.vertices[s.b].data.cast); })());

// ═══ §3 THE STORE, BY BEHAVIOUR — the acts on the source edge, checked at the act ═══
console.log('\n----- §3 the store: the acts, the refusal with every withdrawal, the re-made attempt, the draft, the record leaving with its last pair -----');
const { useGeometryStore } = req('src/store/geometryStore.ts');
useGeometryStore.setState({ shapes: { ...useGeometryStore.getState().shapes, [ambo.id]: ambo }, currentShapeId: ambo.id, edgeTauDrafts: {}, midpointRefusals: {} });
const S = () => useGeometryStore.getState();
const edgeAB = siteAB.edge.id;
const recordOfEdge = (edgeId) => S().shapes[ambo.id].edges.find((e) => e.id === edgeId).identification ?? null;
// the record's orientation: the edge's first corner ↦ its second — the surface and the store share it
const forward = siteAB.a === a; // A is the edge's first corner?
const role = (x, y) => (forward ? [x, y] : [y, x]);
S().giveRolePair(edgeAB, ...role('F5', 'Φ7'));
check('§3 ★★ A ROLE PAIR GIVEN writes the record through the one writer: `roles` one pair, `types` empty, no draft, no refusal',
  (() => { const r = recordOfEdge(edgeAB); return r && J(r.roles) === J([role('F5', 'Φ7')]) && J(r.types) === '[]' && S().edgeTauDrafts[edgeAB] === undefined && S().midpointRefusals[edgeAB] === undefined; })(), J(recordOfEdge(edgeAB)));
S().giveWordPair(edgeAB, ...role('sustains', 'descends-from'));
S().giveRolePair(edgeAB, ...role('F7', 'Φ1'));
S().giveRolePair(edgeAB, ...role('F8', 'Φ2'));
S().giveWordPair(edgeAB, ...role('presupposes', 'specifies'));
S().giveWordPair(edgeAB, ...role('exceeds-in-size', 'lodges-in'));
check('§3 ★★ THE ACTS ACCUMULATE, role to role and word to word, in the order given: three pairs and τ₃ on the record — and the record glues to the seal (52 tuples, 4 both)',
  (() => { const r = recordOfEdge(edgeAB); const [A, B] = forward ? [flow, phi] : [phi, flow]; const g = glue(A, B, r.roles, r.types); return r.roles.length === 3 && r.types.length === 3 && !g.refused && g.midpoint.counts.both === 4 && g.midpoint.counts.tuples === 52; })(), J(recordOfEdge(edgeAB)));
S().giveRolePair(edgeAB, ...role('F5', 'Φ3'));
check('§3 ★★ THE FORM refuses at the act, in words, with nothing written: `F5 ↦ Φ3` while F5 is paired — `F5 is already paired with Φ7 — one role, one partner` (or the mirror), no conflict listed, the record\'s three pairs untouched; the refusal offers BOTH withdrawals (the attempt and the prior pair)',
  (() => { const ref = S().midpointRefusals[edgeAB]; const acts = ref ? actsOfRefusal(ref, recordOfEdge(edgeAB).roles, recordOfEdge(edgeAB).types) : []; return ref && ref.form && /is already paired with .+ — one role, one partner$/.test(ref.form) && ref.conflicts.length === 0 && recordOfEdge(edgeAB).roles.length === 3 && acts.length === 2 && acts[0].attempt && !acts[1].attempt && acts[1].kind === 'role'; })(), J(S().midpointRefusals[edgeAB]));
S().withdrawMidpointAttempt(edgeAB);
S().giveRolePair(edgeAB, ...role('F1', 'Φ9'));
check('§3 ★★ THE CONTRADICTION refuses at the act with NOTHING GLUED: `F1 ↦ Φ9` names `member_status: F1 has · Φ9 none-by-nature` (the mold\'s key, by definition), the record keeps its three pairs, the attempt stays PENDING beside its refusal; the conflict rests on the attempt alone, so ONE withdrawal is offered',
  (() => { const ref = S().midpointRefusals[edgeAB]; return ref && !ref.form && ref.conflicts.length === 1 && ref.conflicts[0].arity === 1 && recordOfEdge(edgeAB).roles.length === 3 && actsOfRefusal(ref, recordOfEdge(edgeAB).roles, recordOfEdge(edgeAB).types).length === 1; })(), J(S().midpointRefusals[edgeAB]));
S().withdrawMidpointAttempt(edgeAB);
check('§3 ★ the attempt withdrawn: the refusal leaves, the record stands', S().midpointRefusals[edgeAB] === undefined && recordOfEdge(edgeAB).roles.length === 3);
// the three-handed refusal on the C–D edge (C holds the T cell, D holds Φ)
const packetCD = report.packets.find((p) => p.trace.parentIds.includes(c) && p.trace.parentIds.includes(d));
const siteCD = midpointSiteOf(ambo, packetCD.trace.siteId, packetCD.trace);
const edgeCD = siteCD.edge.id;
const fwdCD = siteCD.a === c;
const roleCD = (x, y) => (fwdCD ? [x, y] : [y, x]);
S().giveRolePair(edgeCD, ...roleCD('r8', 'Φ6'));
S().giveWordPair(edgeCD, ...roleCD('sustains', 'descends-from'));
S().giveRolePair(edgeCD, ...roleCD('r0', 'Φ1'));
check('§3 ★★ A RELATIONAL REFUSAL OFFERS EVERY WITHDRAWAL IT RESTS ON — `r0 ↦ Φ1` after r8 ↦ Φ6 under sustains ↦ descends-from is refused (`sustains(r8, r0) does-not-hold · descends-from(Φ6, Φ1) holds`) and the acts are THREE: the attempt, the prior pair r8 ↦ Φ6, the word pair — never one undo deciding which half was wrong',
  (() => { const ref = S().midpointRefusals[edgeCD]; if (!ref) return false; const acts = actsOfRefusal(ref, recordOfEdge(edgeCD).roles, recordOfEdge(edgeCD).types); return ref.conflicts.length === 1 && ref.conflicts[0].arity === 2 && acts.length === 3 && acts[0].attempt && acts.some((x) => x.kind === 'role' && !x.attempt) && acts.some((x) => x.kind === 'word'); })(), J(S().midpointRefusals[edgeCD]));
S().withdrawRolePair(edgeCD, ...roleCD('r8', 'Φ6'));
check('§3 ★★ WITHDRAWING THE PRIOR HALF RE-MAKES THE ATTEMPT: r8 ↦ Φ6 withdrawn → the pending r0 ↦ Φ1 is made, the record reads one pair r0 ↦ Φ1 with τ kept, the refusal gone',
  (() => { const r = recordOfEdge(edgeCD); return r && J(r.roles) === J([roleCD('r0', 'Φ1')]) && r.types.length === 1 && S().midpointRefusals[edgeCD] === undefined; })(), J(recordOfEdge(edgeCD)));
S().withdrawWordPair(edgeCD, ...roleCD('sustains', 'descends-from'));
S().withdrawRolePair(edgeCD, ...roleCD('r0', 'Φ1'));
check('§3 ★ THE RECORD LEAVES WITH ITS LAST PAIR: the word pair withdrawn (roles kept, τ empty), then the role pair — no identification on the edge, no draft (τ was empty)',
  recordOfEdge(edgeCD) === null && S().edgeTauDrafts[edgeCD] === undefined);
// τ before the first role pair — the draft, as (β) held it
const packetAC = report.packets.find((p) => p.trace.parentIds.includes(a) && p.trace.parentIds.includes(c));
const siteAC = midpointSiteOf(ambo, packetAC.trace.siteId, packetAC.trace);
const edgeAC = siteAC.edge.id;
const fwdAC = siteAC.a === a;
const roleAC = (x, y) => (fwdAC ? [x, y] : [y, x]);
S().giveWordPair(edgeAC, ...roleAC('sustains', 'sustains'));
check('§3 ★★ A WORD PAIR BEFORE ANY ROLE PAIR lives in the DRAFT (the frozen record cannot mark "τ given, not yet acted" apart from "none" — (β)\'s home kept): no identification on the edge, the draft holds `sustains ↦ sustains`',
  recordOfEdge(edgeAC) === null && J(S().edgeTauDrafts[edgeAC]) === J([roleAC('sustains', 'sustains')]));
S().giveRolePair(edgeAC, ...roleAC('F1', 'r0'));
check('§3 ★ the first role pair takes the draft\'s τ into the record and clears the draft; withdrawing it hands τ back',
  (() => { const r = recordOfEdge(edgeAC); const ok = r && r.roles.length === 1 && r.types.length === 1 && S().edgeTauDrafts[edgeAC] === undefined; S().withdrawRolePair(edgeAC, ...roleAC('F1', 'r0')); return ok && recordOfEdge(edgeAC) === null && J(S().edgeTauDrafts[edgeAC]) === J([roleAC('sustains', 'sustains')]); })());
check('§3 a withdrawal of a pair not on the record writes nothing; an act on a seam whose corners do not both hold a cast writes nothing and refuses nothing',
  (() => { const before = J(S().shapes[ambo.id].edges); S().withdrawRolePair(edgeAB, 'F13', 'Φ4'); const other = ambo.edges.find((e) => e.vertexIds.every((v) => ambo.vertices[v].createdBy.operation === 'ambo-dissection')); S().giveRolePair(other.id, 'x', 'y'); return J(S().shapes[ambo.id].edges) === before && S().midpointRefusals[other.id] === undefined; })());

// ═══ §4 THE SURFACE, BY BEHAVIOUR — rendered to a string with the record as props ═══
console.log('\n----- §4 the surface: unglued in words, both columns, the lines marked yours, only `both` gets a glyph, the trace, the residual on the lines, the refusal with every withdrawal -----');
const React = require('react');
const { renderToString } = require('react-dom/server');
const render = (el) => renderToString(el).replace(/<!-- -->/g, '');
const unescapeHtml = (s) => (s ?? '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
const attrsOf = (html, name) => [...html.matchAll(new RegExp(`${name}="([^"]*)"`, 'g'))].map((m) => unescapeHtml(m[1]));
const countOf = (html, name) => (html.match(new RegExp(`${name}="`, 'g')) || []).length;
const textsOf = (html, name) => [...html.matchAll(new RegExp(`${name}="[^"]*"[^>]*>([^<]*)<`, 'g'))].map((m) => unescapeHtml(m[1]));
const visibleText = (html) => unescapeHtml(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const surface = (shape, site, tauDraft = [], refusal = null) => render(React.createElement(MidpointSurface, { shape, site, castA: shape.vertices[site.a].data.cast, castB: shape.vertices[site.b].data.cast, tauDraft, refusal }));
const la = ambo.vertices[siteAB.a].data.label;
const lb = ambo.vertices[siteAB.b].data.label;
const fresh = surface(ambo, siteAB);
check('§4 ★★ THE UNGLUED STATE says so in words — never *nothing identified*: `no pair given yet — A and B stand apart: 23 roles · 25 words · 56 tuples · 23 marks`; both columns present (14 + 9 points, each side marked), NO line across the fold, the word rows with nothing translated said',
  attrsOf(fresh, 'data-midpoint-state')[0] === 'unglued' && textsOf(fresh, 'data-midpoint-sentence')[0] === `no pair given yet — ${la} and ${lb} stand apart: 23 roles · 25 words · 56 tuples · 23 marks` &&
    attrsOf(fresh, 'data-midpoint-side').filter((s) => s === 'A').length === (forward ? 14 : 9) && attrsOf(fresh, 'data-midpoint-side').filter((s) => s === 'B').length === (forward ? 9 : 14) && countOf(fresh, 'data-midpoint-line') === 0 && visibleText(fresh).includes('no word translated — every word foreign to the other side, alike spellings included'),
  textsOf(fresh, 'data-midpoint-sentence')[0]);
check('§4 ★★ BOTH OPPOSITE VERTICES AS RECORD, one above and one below, each through its face, WHOLE: C (the T cell) drawn compact above or below with its 10 points, D (Φ) with its 9 — and the device computes nothing with them (no line, no glyph, no count of theirs in the trace)',
  J(attrsOf(fresh, 'data-midpoint-source')) === '["above","below"]' && attrsOf(fresh, 'data-midpoint-face').every((f) => /^[A-D](·[A-D]){2}$/.test(f)) &&
    (fresh.match(/data-inside="source-[^"]*"/g) || []).length === 2 && visibleText(fresh).includes('through face') && visibleText(fresh).includes('the cast it holds, whole'));
const glued = surface(S().shapes[ambo.id], midpointSiteOf(S().shapes[ambo.id], packetAB.trace.siteId, packetAB.trace));
const gRec = recordOfEdge(edgeAB);
check('§4 ★★ THE PAIRS ARE LINES ACROSS THE FOLD marked `yours` with `withdraw` (the landed idiom kept): three lines for the three pairs; the three word pairs listed `yours · withdraw`; the sentence `3 role pairs · 3 word pairs — yours`',
  attrsOf(glued, 'data-midpoint-state')[0] === 'glued' && countOf(glued, 'data-midpoint-line') === 3 && attrsOf(glued, 'data-midpoint-line').every((l) => gRec.roles.some(([x, y]) => `${x}↦${y}` === l)) && (glued.match(/· yours · /g) || []).length === 6 && countOf(glued, 'data-midpoint-word-pair') === 3 && textsOf(glued, 'data-midpoint-sentence')[0] === '3 role pairs · 3 word pairs — yours',
  `${countOf(glued, 'data-midpoint-line')} lines · ${textsOf(glued, 'data-midpoint-sentence')[0]}`);
check('§4 ★★ ONLY `both` GETS A GLYPH: in the unfolded layout `from A` and `from B` are stated by position — exactly 4 marks in this cast\'s column and 4 in that cast\'s wear `≡` (the four glued tuples, each drawn where its two witnesses drew it); none in the unglued state',
  attrsOf(glued, 'data-midpoint-both').filter((s) => s === 'A').length === 4 && attrsOf(glued, 'data-midpoint-both').filter((s) => s === 'B').length === 4 && (glued.match(/≡ /g) || []).length >= 8 && countOf(fresh, 'data-midpoint-both') === 0);
check('§4 ★★ THE TRACE, as description: the counts `AB: 20 roles (14 + 9 − 3) · 22 words · 52 tuples (4 both) · 20 marks` (or with the corners the other way), `what both confirm: 3 roles · 4 tuples · 3 marks`, and per glued role `F5 ≡ Φ7 · 7 tuples about it: both 1 · A 4 · B 2 · member_status has (A, B)` (the sides named by the corners\' labels)',
  (() => {
    const counts = textsOf(glued, 'data-midpoint-counts')[0];
    const core = textsOf(glued, 'data-midpoint-core')[0];
    const rows = textsOf(glued, 'data-midpoint-role-trace');
    const lm = ambo.vertices[packetAB.trace.siteId].data.label;
    const expectedCounts = forward ? `${lm}: 20 roles (14 + 9 − 3) · 22 words · 52 tuples (4 both) · 20 marks` : `${lm}: 20 roles (9 + 14 − 3) · 22 words · 52 tuples (4 both) · 20 marks`;
    const expectRow = forward ? `F5 ≡ Φ7 · 7 tuples about it: both 1 · ${la} 4 · ${lb} 2 · member_status has (${la}, ${lb})` : `Φ7 ≡ F5 · 7 tuples about it: both 1 · ${la} 2 · ${lb} 4 · member_status has (${la}, ${lb})`;
    return counts === expectedCounts && core === 'what both confirm: 3 roles · 4 tuples · 3 marks' && rows.length === 3 && rows[0] === expectRow;
  })(), `${textsOf(glued, 'data-midpoint-counts')[0]} | ${textsOf(glued, 'data-midpoint-role-trace')[0]}`);
check('§4 ★★ THE PARENT→CHILD LINES ARE NEVER BARE — the residual with PER-PARENT DENOMINATORS rides each: `A: 11 of its 14 roles met no partner · 27 tuples on them · 3 on mapped roles in words not translated · 0 in translated words B has unrecorded` and `B: 6 of its 9 roles met no partner · 11 tuples on them · 7 … · 0 …` (different wholes, the juxtaposition disarmed)',
  (() => {
    const rows = textsOf(glued, 'data-midpoint-parent-trace');
    const [lf, lp] = forward ? [la, lb] : [lb, la];
    return rows.length === 2 && rows.includes(`${lf}: 11 of its 14 roles met no partner · 27 tuples on them · 3 on mapped roles in words not translated · 0 in translated words ${lp} has unrecorded`) && rows.includes(`${lp}: 6 of its 9 roles met no partner · 11 tuples on them · 7 on mapped roles in words not translated · 0 in translated words ${lf} has unrecorded`);
  })(), J(textsOf(glued, 'data-midpoint-parent-trace')));
// the refusal rendered: F1 ↦ Φ9 pending
S().giveRolePair(edgeAB, ...role('F1', 'Φ9'));
const refusedHtml = surface(S().shapes[ambo.id], midpointSiteOf(S().shapes[ambo.id], packetAB.trace.siteId, packetAB.trace), [], S().midpointRefusals[edgeAB]);
check('§4 ★★ THE REFUSAL AT THE ACT: `refused — F1 ↦ Φ9 (a role pair): nothing glued, the edge keeps its prior state`, the conflict with BOTH values and BOTH parents named — `member_status: F1 has in A · Φ9 none-by-nature in B` — and its one withdrawal (the act just made); the three lines still stand',
  (() => { const [x, y] = role('F1', 'Φ9'); const [lx, ly] = [la, lb]; return countOf(refusedHtml, 'data-midpoint-refusal') === 1 && visibleText(refusedHtml).includes(`refused — ${x} ↦ ${y} (a role pair): nothing glued, the edge keeps its prior state`) && attrsOf(refusedHtml, 'data-midpoint-conflict')[0] === (forward ? `member_status: F1 has in ${lx} · Φ9 none-by-nature in ${ly}` : `member_status: Φ9 none-by-nature in ${lx} · F1 has in ${ly}`) && countOf(refusedHtml, 'data-midpoint-withdraw-attempt') === 1 && countOf(refusedHtml, 'data-midpoint-line') === 3; })(),
  J(attrsOf(refusedHtml, 'data-midpoint-conflict')));
S().withdrawMidpointAttempt(edgeAB);
// the three-handed refusal rendered on C–D
S().giveRolePair(edgeCD, ...roleCD('r8', 'Φ6'));
S().giveWordPair(edgeCD, ...roleCD('sustains', 'descends-from'));
S().giveRolePair(edgeCD, ...roleCD('r0', 'Φ1'));
const cdHtml = surface(S().shapes[ambo.id], midpointSiteOf(S().shapes[ambo.id], packetCD.trace.siteId, packetCD.trace), [], S().midpointRefusals[edgeCD]);
check('§4 ★★ THE TWO-HANDED CONTROL, rendered: the relational refusal on C–D names `sustains(r8, r0) does-not-hold in C · descends-from(Φ6, Φ1) holds in D` and offers THREE withdrawals — the attempt r0 ↦ Φ1, the prior r8 ↦ Φ6, the word pair sustains ↦ descends-from',
  (() => { const ws = attrsOf(cdHtml, 'data-midpoint-withdraw').filter((w) => !w.startsWith('role|r8|Φ6') || true); const inBox = (cdHtml.split('data-midpoint-refusal=')[1] || '').split('data-midpoint-residuals=')[0]; const boxWithdraws = attrsOf(inBox, 'data-midpoint-withdraw'); return countOf(cdHtml, 'data-midpoint-refusal') === 1 && attrsOf(cdHtml, 'data-midpoint-conflict')[0].startsWith(fwdCD ? 'sustains(r8, r0) does-not-hold in' : 'descends-from(Φ6, Φ1) holds in') && boxWithdraws.length === 3 && boxWithdraws.some((w) => w.startsWith('attempt|')) && boxWithdraws.some((w) => w.startsWith('role|')) && boxWithdraws.some((w) => w.startsWith('word|')) && ws.length >= 3; })(),
  J(attrsOf(cdHtml, 'data-midpoint-withdraw')));
S().withdrawMidpointAttempt(edgeCD);
S().withdrawWordPair(edgeCD, ...roleCD('sustains', 'descends-from'));
S().withdrawRolePair(edgeCD, ...roleCD('r8', 'Φ6'));
// a record that contradicts itself (a fiat pair the retired register let through) is named with its withdrawals
S().takeEdgeIdentification(edgeAB, [...gRec.roles, role('F1', 'Φ9')]);
const torn = surface(S().shapes[ambo.id], midpointSiteOf(S().shapes[ambo.id], packetAB.trace.siteId, packetAB.trace));
check('§4 ★ A RECORD THAT CONTRADICTS ITSELF (a fiat pair the retired register let through) reads `record-in-conflict` — the conflict by name and a withdrawal per pair and per word; no trace of it (a trace is a function of one act that glued)',
  attrsOf(torn, 'data-midpoint-state')[0] === 'record-in-conflict' && countOf(torn, 'data-midpoint-record-conflict') === 1 && attrsOf(torn, 'data-midpoint-conflict').length === 1 && countOf(torn, 'data-midpoint-trace') === 0 && attrsOf(torn, 'data-midpoint-withdraw').length >= 7);
S().withdrawEdgeIdentification(edgeAB);
check('§4 ⛔ NEVER a candidate, a weight, a ranking, a proposal, a hint (Δ80): the surface\'s text carries none of `offer`, `weight`, `candidate`, `propos`, `tied`, `orbit`, `rank`, `support`; and no sort of the device\'s on either side (the caster\'s order stands)',
  !/offer|weight|candidate|propos|tied|orbit|rank|support/i.test(visibleText(glued) + visibleText(fresh) + visibleText(refusedHtml)) && !/\.sort\(/.test(readLf('src/components/MidpointSurface.tsx')));
const noneAmbo = applyAmboDissection(seed);
const noneRep = buildGeneralSitePacketPresenterReport(noneAmbo);
useGeometryStore.setState({ shapes: { ...useGeometryStore.getState().shapes, [noneAmbo.id]: noneAmbo }, currentShapeId: noneAmbo.id });
const noneSite = noneRep.packets[0].trace.siteId;
check('§4 ★★ THE CHOOSER: a midpoint whose parents do not both hold a cast renders NOTHING (the empty string — no surface, no empty frame); a corner holding a cast renders its own inside; the AB midpoint with both parents cast renders the unfolding',
  render(React.createElement(ConceptSurface, { shape: noneAmbo, vertexId: noneSite })) === '' &&
    countOf(render(React.createElement(ConceptSurface, { shape: ambo, vertexId: a })), 'data-inside-panel') === 1 &&
    countOf(render(React.createElement(ConceptSurface, { shape: ambo, vertexId: packetAB.trace.siteId })), 'data-midpoint-surface') === 1);

// ═══ §5 THE MOUNT and the boundaries, source-pinned ═══
console.log('\n----- §5 the check at the act lives with the writer; the presenter\'s FACE is not consumed; the boundaries -----');
const store = readLf('src/store/geometryStore.ts');
const surf = readLf('src/components/MidpointSurface.tsx');
const gl = readLf('src/lib/midpointGlue.ts');
check('§5 ★★ NO WRITE WITHOUT THE CHECK, BY CONSTRUCTION: the store\'s acts call `refusalOf` before every write and route every write through `writeEdgeIdentification` (`midpointWrite` → the one writer); the store imports the check and the form from the register and nothing else of it',
  /const conflicts = refusalOf\(A, B, nextRoles, nextTypes\);\s*if \(conflicts\.length\) return refuse\(undefined, conflicts\);/.test(store) && (store.match(/writeEdgeIdentification\(set,/g) || []).length >= 5 && store.includes("import { refusalOf, wordPairForm, type Conflict } from '../lib/jRegister';"));
check('§5 ★★ THE PRESENTER\'S TRACE IS CONSUMED AND ITS FACE IS NOT: the surface imports `buildGeneralSitePacketPresenterReport` (one producer, many consumers — Panels consumes it too) and never `renderPacketFace`; no sentence of the naming era (`Name the concept`, `Across the cell`) in the surface',
  surf.includes("import { buildGeneralSitePacketPresenterReport, type GeneralSitePacketTrace } from '../lib/generalSitePacketPresenterV0';") && !surf.includes('renderPacketFace') && !/Name the concept|Across the cell|howToName|namingDecision/.test(surf) && readLf('src/components/Panels.tsx').includes('buildGeneralSitePacketPresenterReport(shape)'));
check('§5 ⛔ THE GLUE IS PURE OVER TWO CASTS AND THE PERSON\'S (J, τ): midpointGlue.ts imports only the types, the mold\'s join from the loader and the register\'s record/refusal/shared signature; no store, no component; the surface reaches the store only to act (five actions, two reads in the chooser)',
  (gl.match(/^import /gm) || []).length === 3 && gl.includes("import { isMoldType, moldJoin } from './castLoader';") && gl.includes("import { recordOf, refusalOf, sharedSignature, type Conflict } from './jRegister';") && !/from '\.\.\/store|from '\.\.\/components/.test(gl) &&
    (surf.match(/useGeometryStore\(\(s\) => s\.(give|withdraw)/g) || []).length === 5 && !/updateSelected|\.cast\s*=/.test(surf));
check('§5 the surface is sited on the canvas through the chooser (Workspace3D mounts `ConceptSurface`), and nothing of it enters Panels.tsx or the manuscript',
  readLf('src/components/Workspace3D.tsx').includes("import { ConceptSurface } from './MidpointSurface';") && !readLf('src/components/Panels.tsx').includes('MidpointSurface') && !/from '\.\.\/manuscript|explore/.test(surf));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-MIDPOINT: ALL PASS — the pushout reads the seal, the refusal names both tuples and offers every withdrawal, the trace is a partition never a score, both opposite vertices stand as record, and the presenter\'s trace is consumed' : `DIAGNOSE-THE-MIDPOINT: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
