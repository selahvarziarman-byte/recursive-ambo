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
//
// C-7e (Δ84 "pay the price", 2026-09-22): THE RECORD AND THE DRAFTS RIDE THE
// DISSECTION — §2 measures the carry on the engine's arm (the copy, the true
// absence both ways, the MIRROR on a pair the new shape walks the other way —
// measured in the wild at gen 2 → gen 3), §3 the drafts through the store's own
// ambo action, §4 the chain's closing clause TRUE at gen 2 with no hand.

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
const { glue, traceOf, gluedSpace } = req('src/lib/midpointGlue.ts');
const { insideOf } = req('src/lib/castInside.ts');
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
// C-7d item 1 — THE GLUED SPACE AS A CAST: one presentation for the corner and the midpoint
check('§1 ★★ THE MAPPED MIDPOINT\'S OWN SPACE (C-7d item 1): `gluedSpace` under (J₃, τ₃) is a ConceptSpace of 20 roles in the glue\'s order (A\'s, then B\'s unglued), 22 signature words, 52 relations and 20 marks; the glued roles labelled by the casters\' words `F5 ≡ Φ7` (the ≡ is the person\'s act), the translated words ONE word `sustains ≡ descends-from`, foreign words plain; `insideOf` draws it as 20 points and 52 arcs + loops; the origins ride beside it — 4 tuples `both`, 3 roles `both`',
  (() => {
    if (!M3) return false;
    const own = gluedSpace(flow, phi, M3);
    const ins = insideOf(own.space);
    const marks = own.space.roles.reduce((n, r) => n + Object.keys(r.types ?? {}).length, 0);
    return own.space.roles.length === 20 && own.space.roles[0].id === 'A:F1' && own.space.roles[4].label === 'F5 ≡ Φ7' && own.space.roles[14].label === 'Φ3' && own.space.signature.length === 22 && own.space.relations.length === 52 && marks === 20 &&
      own.space.signature.some((s) => s.type === 'sustains ≡ descends-from') && own.space.signature.some((s) => s.type === 'disjoins [A]') && own.space.signature.some((s) => s.type === 'disjoins [B]') && own.space.signature.some((s) => s.type === 'generates') &&
      ins.census.points === 20 && ins.census.arrows + ins.census.loops === 52 && ins.census.hyper === 0 && ins.census.words === 22 && ins.census.marks === 20 &&
      [...own.tupleOrigin.values()].filter((o) => o === 'both').length === 4 && [...own.roleOrigin.values()].filter((o) => o === 'both').length === 3 && own.wordOrigin.get('sustains ≡ descends-from') === 'both' && own.wordOrigin.get('disjoins [B]') === 'B';
  })());
check('§1 ★ the unmapped midpoint\'s own space is the disjoint union as one cast: 23 roles · 25 words (the alike spellings kept apart as `w [A]` / `w [B]`) · 56 relations · 23 marks, nothing `both`; and a cast of the glued space is RECOVERABLE by the inside (faithfulness holds on the derived space too)',
  (() => {
    const own = gluedSpace(flow, phi, empty.midpoint);
    const ins = insideOf(own.space);
    return own.space.roles.length === 23 && own.space.signature.length === 25 && own.space.relations.length === 56 && ins.census.points === 23 && ins.census.arrows + ins.census.loops === 56 && [...own.tupleOrigin.values()].every((o) => o !== 'both') && own.space.signature.filter((s) => /^disjoins \[(A|B)\]$/.test(s.type)).length === 2 && ins.unplaced.length === 0;
  })());
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
// C-7c item 1 (2026-09-22) MEASURED the second dissection — a record given at a gen-1 midpoint did NOT survive the
// ambo: the pair survives as a parent-cell-face edge with a FRESH id (`makeEdgeId(shapeId, pair)` depends on the shape
// id; the gen-1 shape keeps its record) and the fresh edge carried nothing. C-7e (Δ84 "pay the price") CARRIES it: the
// mechanism stays (the mint is FROZEN and untouched — that is why the carry exists) and the expectation INVERTS.
check('§2 ★★ THE SECOND DISSECTION — THE RECORD CARRIES (C-7e, Δ84; C-7c\'s measurement is the reason): a J given on the gen-1 edge A–B, then the core dissected — the pair A–B exists in gen 2 as a parent-cell-face edge with a DIFFERENT id (the mint `makeEdgeId(shapeId, pair)` depends on the shape id — shape.ts and ids.ts untouched), the gen-1 shape keeps its record intact, the AB midpoint\'s site at gen 2 resolves to the NEW edge — and that edge CARRIES the record: the same roles and τ as a COPY (not the gen-1 object), exactly ONE record in gen 2 for the one in gen 1, and the AB surface at gen 2 reads glued',
  (() => {
    const g1 = withCast(withCast(applyAmboDissection(seed), a, flow), b, phi);
    const r1 = buildGeneralSitePacketPresenterReport(g1);
    const p1 = r1.packets.find((p) => p.trace.parentIds.includes(a) && p.trace.parentIds.includes(b));
    const s1 = midpointSiteOf(g1, p1.trace.siteId, p1.trace);
    const rec = { roles: [['F5', 'Φ7']], types: [['sustains', 'descends-from']] };
    const given = { ...g1, edges: g1.edges.map((e) => (e.id === s1.edge.id ? { ...e, identification: rec } : e)) };
    const g2 = applyAmboDissection(given, given.cells.find((x) => x.kind === 'core').id);
    const pairOf = (e) => [...e.vertexIds].sort().join('|');
    const twin = g2.edges.filter((e) => pairOf(e) === pairOf(s1.edge));
    const r2 = buildGeneralSitePacketPresenterReport(g2);
    const p2 = r2.packets.find((p) => p.trace.siteId === p1.trace.siteId);
    const s2 = p2 ? midpointSiteOf(g2, p2.trace.siteId, p2.trace) : null;
    note(`gen-1 edge ${s1.edge.id} → gen-2 edge ${twin.map((e) => e.id).join(',')} · the gen-2 edge carries: ${J(twin[0] && twin[0].identification)} · records in gen 2: ${g2.edges.filter((e) => e.identification).length} · the AB surface at gen 2 reads ${s2 && s2.edge.identification ? 'glued' : 'no pair given yet'}`);
    return twin.length === 1 && twin[0].id !== s1.edge.id && given.edges.find((e) => e.id === s1.edge.id).identification === rec && !g2.edges.some((e) => e.id === s1.edge.id) &&
      s2 !== null && s2.edge.id === twin[0].id && J(twin[0].identification) === J(rec) && twin[0].identification !== rec && twin[0].identification.roles !== rec.roles &&
      g2.edges.filter((e) => e.identification).length === 1 && Boolean(s2.edge.identification);
  })());
check('§2 ★★ THE CARRY COPIES, NEVER RE-DERIVES, AND A TRUE ABSENCE CARRIES AS A TRUE ABSENCE (LAW 24 both ways): a gen-1 shape with NO record dissects to a gen 2 with none; with records on A–B and A–C alone, gen 2 carries exactly those two, each on its own pair, every other pair carries nothing — and no pair of the parent is lost',
  (() => {
    const g1 = withCast(withCast(withCast(applyAmboDissection(seed), a, flow), b, phi), c, tcell);
    const core = g1.cells.find((x) => x.kind === 'core').id;
    const none = applyAmboDissection(g1, core);
    const rep = buildGeneralSitePacketPresenterReport(g1);
    const siteOf = (x, y) => { const p = rep.packets.find((q) => q.trace.parentIds.includes(x) && q.trace.parentIds.includes(y)); return midpointSiteOf(g1, p.trace.siteId, p.trace); };
    const eAB = siteOf(a, b).edge; const eAC = siteOf(a, c).edge;
    const two = { ...g1, edges: g1.edges.map((e) => (e.id === eAB.id ? { ...e, identification: { roles: [['F5', 'Φ7']], types: [] } } : e.id === eAC.id ? { ...e, identification: { roles: [['F1', 'r0']], types: [['sustains', 'sustains']] } } : e)) };
    const g2 = applyAmboDissection(two, core);
    const pairOf = (e) => [...e.vertexIds].sort().join('|');
    const carried = g2.edges.filter((e) => e.identification);
    const pairs = new Set(carried.map(pairOf));
    return none.edges.every((e) => !e.identification) && carried.length === 2 && pairs.has(pairOf(eAB)) && pairs.has(pairOf(eAC)) &&
      two.edges.every((p) => g2.edges.some((e) => pairOf(e) === pairOf(p)));
  })());
// THE ORIENTATION, MEASURED (C-7e): a record reads FIRST corner ↦ SECOND, and `deriveEdges` walks a re-derived edge by
// whichever face it meets first — gen 1 → gen 2 keeps every pair's order; gen 2 → gen 3 on the core walks 12 of 78 the
// other way (printed below, pinned as at least one). So a carried record is MIRRORED on a pair walked the other way: the
// same act, said from the new first corner — never a blind copy, which would name each role as the other cast's.
check('§2 ★★ THE CARRY HONOURS THE EDGE\'S ORIENTATION: on a pair the new shape walks the other way (gen 2 → gen 3 on the core — found in the wild, the count printed) a record `[x ↦ y]` carries as `[y ↦ x]`, x still a role of the cast on its own corner; on a pair walked the same way it carries as it was — the positive control beside it',
  (() => {
    const g1 = applyAmboDissection(seed);
    const g2 = applyAmboDissection(g1, g1.cells.find((x) => x.kind === 'core').id);
    const core2 = g2.cells.find((x) => x.kind === 'core' && x.generationDepth === 2).id;
    const pairOf = (e) => [...e.vertexIds].sort().join('|');
    const probe = applyAmboDissection(g2, core2);
    const twinOf = (e) => probe.edges.find((x) => pairOf(x) === pairOf(e));
    const reversed = g2.edges.filter((e) => twinOf(e) && twinOf(e).vertexIds[0] !== e.vertexIds[0]);
    const kept = g2.edges.filter((e) => twinOf(e) && twinOf(e).vertexIds[0] === e.vertexIds[0]);
    note(`gen 2 → gen 3 on the core: ${reversed.length} of ${g2.edges.length} surviving pairs walked the other way, ${kept.length} the same way (gen 1 → gen 2: ${g1.edges.filter((e) => { const t = g2.edges.find((x) => pairOf(x) === pairOf(e)); return t && t.vertexIds[0] !== e.vertexIds[0]; }).length} of ${g1.edges.length})`);
    const rE = reversed[0];
    const kE = kept.find((e) => !e.vertexIds.some((v) => rE && rE.vertexIds.includes(v)));
    if (!rE || !kE) return false;
    const cast2 = withCast(withCast(withCast(withCast(g2, rE.vertexIds[0], flow), rE.vertexIds[1], phi), kE.vertexIds[0], flow), kE.vertexIds[1], phi);
    const rec = { roles: [['F5', 'Φ7']], types: [['sustains', 'descends-from']] };
    const given = { ...cast2, edges: cast2.edges.map((e) => (e.id === rE.id || e.id === kE.id ? { ...e, identification: rec } : e)) };
    const g3 = applyAmboDissection(given, core2);
    const r3 = g3.edges.find((x) => pairOf(x) === pairOf(rE)); const k3 = g3.edges.find((x) => pairOf(x) === pairOf(kE));
    const firstCast = (s, e) => s.vertices[e.vertexIds[0]].data.cast;
    return r3.vertexIds[0] === rE.vertexIds[1] && J(r3.identification) === J({ roles: [['Φ7', 'F5']], types: [['descends-from', 'sustains']] }) && firstCast(g3, r3).roles.some((r) => r.id === 'Φ7') &&
      k3.vertexIds[0] === kE.vertexIds[0] && J(k3.identification) === J(rec) && firstCast(g3, k3).roles.some((r) => r.id === 'F5');
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
check('§3 ★★ WITHDRAWING THE PRIOR HALF RE-MAKES THE ATTEMPT: r8 ↦ Φ6 withdrawn → the pending r0 ↦ Φ1 is made, the record reads one pair r0 ↦ Φ1 with τ kept, the refusal gone — and the store ATTRIBUTES the re-made pair to the withdrawal (C-7f item 3, the designer: a pair that appears without a gesture must say whose gesture made it)',
  (() => { const r = recordOfEdge(edgeCD); return r && J(r.roles) === J([roleCD('r0', 'Φ1')]) && r.types.length === 1 && S().midpointRefusals[edgeCD] === undefined && J(S().midpointRemade[edgeCD]) === J({ act: { kind: 'role', pair: roleCD('r0', 'Φ1') }, withdrawn: { kind: 'role', pair: roleCD('r8', 'Φ6') } }); })(), J({ record: recordOfEdge(edgeCD), remade: S().midpointRemade[edgeCD] }));
S().withdrawWordPair(edgeCD, ...roleCD('sustains', 'descends-from'));
S().withdrawRolePair(edgeCD, ...roleCD('r0', 'Φ1'));
check('§3 ★ THE RECORD LEAVES WITH ITS LAST PAIR: the word pair withdrawn (roles kept, τ empty), then the role pair — no identification on the edge, no draft (τ was empty); the attribution left with the pair',
  recordOfEdge(edgeCD) === null && S().edgeTauDrafts[edgeCD] === undefined && S().midpointRemade[edgeCD] === undefined);
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
check('§3 a withdrawal of a pair not on the record writes nothing; an act on a seam whose ends do not both hold a SPACE writes nothing and refuses nothing (a seed corner without a cast); C-8: a seam between two BORN corners whose parents hold casts HAS a space (derived) — an act naming a role neither holds is refused by name there, and nothing is written',
  (() => {
    const before = J(S().shapes[ambo.id].edges);
    S().withdrawRolePair(edgeAB, 'F13', 'Φ4');
    const other = ambo.edges.find((e) => e.vertexIds.every((v) => ambo.vertices[v].createdBy.operation === 'ambo-dissection'));
    S().giveRolePair(other.id, 'x', 'y');
    const bornRefused = S().midpointRefusals[other.id];
    const midpointRefusals = { ...S().midpointRefusals }; delete midpointRefusals[other.id]; useGeometryStore.setState({ midpointRefusals });
    // a seed corner without a cast: the seam C–D with D's cast removed resolves to nothing — no act, no refusal
    const d = byLabel(ambo, 'D');
    const noD = { ...ambo, vertices: { ...ambo.vertices, [d]: { ...ambo.vertices[d], data: { ...ambo.vertices[d].data, cast: undefined } } } };
    const snap = S();
    useGeometryStore.setState({ shapes: { ...S().shapes, [noD.id]: noD }, currentShapeId: noD.id });
    const cd = noD.edges.find((e) => (e.vertexIds[0] === byLabel(noD, 'C') && e.vertexIds[1] === d) || (e.vertexIds[1] === byLabel(noD, 'C') && e.vertexIds[0] === d));
    const beforeCD = J(S().shapes[noD.id].edges);
    S().giveRolePair(cd.id, 'r0', 'Φ1');
    const silent = J(S().shapes[noD.id].edges) === beforeCD && S().midpointRefusals[cd.id] === undefined;
    useGeometryStore.setState(snap, true);
    return J(S().shapes[ambo.id].edges) === before && bornRefused !== undefined && /"x" is not a role this cast holds/.test(bornRefused.form || '') && silent;
  })());

// C-7e (Δ84) item 2 — THE DRAFTS RIDE THE DISSECTION BY PAIR, through the store's OWN ambo action: the state after the
// acts above (AB: three pairs and τ₃; AC: the draft `sustains ↦ sustains`) plus a pending attempt on AB and, on CD, a
// pair RE-MADE by a withdrawal (C-7f item 3 — its attribution rides too).
const snapshot = S();
S().giveRolePair(edgeAB, ...role('F1', 'Φ9'));
S().giveRolePair(edgeCD, ...roleCD('r8', 'Φ6'));
S().giveWordPair(edgeCD, ...roleCD('sustains', 'descends-from'));
S().giveRolePair(edgeCD, ...roleCD('r0', 'Φ1'));
S().withdrawRolePair(edgeCD, ...roleCD('r8', 'Φ6'));
S().selectCell(ambo.cells.find((x) => x.kind === 'core').id);
S().applyAmboDissectionToCurrent();
check('§3 ★★ THE DRAFTS RIDE THE DISSECTION BY PAIR (C-7e item 2; C-7f item 3): the store\'s own `Apply Ambo Dissection` on the core — at gen 2 the A–B edge (a fresh id) carries the record\'s three pairs and τ₃ (the carrier\'s copy), the A–C edge carries the draft `sustains ↦ sustains` under its new id, the pending attempt F1 ↦ Φ9 on A–B is RE-MADE there through the same check — refused again by the mold\'s name, nothing glued — and the C–D edge carries its re-made pair r0 ↦ Φ1 WITH its attribution (`re-made when you withdrew r8 ↦ Φ6`); the gen-1 keys stay and the gen-1 shape keeps its record and its draft',
  (() => {
    const st = S(); const g2 = st.shapes[st.currentShapeId]; if (!g2 || g2.id === ambo.id) return false;
    const pairOf = (e) => [...e.vertexIds].sort().join('|');
    const twin = (edgeId) => g2.edges.find((e) => pairOf(e) === pairOf(ambo.edges.find((x) => x.id === edgeId)));
    const ab2 = twin(edgeAB); const ac2 = twin(edgeAC); const cd2 = twin(edgeCD);
    const ref = st.midpointRefusals[ab2.id];
    return ab2.id !== edgeAB && ab2.identification && ab2.identification.roles.length === 3 && ab2.identification.types.length === 3 &&
      J(st.edgeTauDrafts[ac2.id]) === J([roleAC('sustains', 'sustains')]) && ac2.identification === undefined && st.edgeTauDrafts[cd2.id] === undefined && st.midpointRefusals[cd2.id] === undefined &&
      cd2.identification && cd2.identification.roles.length === 1 && J(st.midpointRemade[cd2.id]) === J({ act: { kind: 'role', pair: roleCD('r0', 'Φ1') }, withdrawn: { kind: 'role', pair: roleCD('r8', 'Φ6') } }) &&
      ref && !ref.form && ref.conflicts.length === 1 && ref.conflicts[0].arity === 1 && J(ref.act) === J({ kind: 'role', pair: role('F1', 'Φ9') }) &&
      st.midpointRefusals[edgeAB] !== undefined && J(st.edgeTauDrafts[edgeAC]) === J([roleAC('sustains', 'sustains')]) && st.midpointRemade[edgeCD] !== undefined && st.shapes[ambo.id].edges.find((e) => e.id === edgeAB).identification.roles.length === 3;
  })(), J({ current: S().currentShapeId === ambo.id ? 'gen 1 (the action did not run)' : 'gen 2', drafts: Object.keys(S().edgeTauDrafts).length, refusals: Object.keys(S().midpointRefusals).length, remade: Object.keys(S().midpointRemade).length }));
useGeometryStore.setState(snapshot, true);

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
// C-8: the surface takes the RESOLVED parents and midpoint (one resolver, `spaceOf`); a τ draft rides the resolver's options as the store's drafts do
const { spaceOf } = req('src/lib/spaceOf.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const surface = (shape, site, tauDraft = [], refusal = null, remade = null) => {
  const options = { tauDrafts: tauDraft.length ? { [site.edge.id]: tauDraft } : {} };
  const memo = new Map();
  const parents = [spaceOf(shape, site.a, options, memo), spaceOf(shape, site.b, options, memo)];
  const resolved = spaceOf(shape, site.siteId, options, memo);
  return render(React.createElement(MidpointSurface, { shape, site, parents, resolved, refusal, remade }));
};
const la = ambo.vertices[siteAB.a].data.label;
const lb = ambo.vertices[siteAB.b].data.label;
const fresh = surface(ambo, siteAB);
check('§4 ★★ THE UNGLUED STATE says so in words — never *nothing identified*: `no pair given yet — A and B stand apart: 23 roles · 25 words · 56 tuples · 23 marks`; both columns present (14 + 9 points, each side marked), NO line across the fold, the word rows with nothing translated said',
  attrsOf(fresh, 'data-midpoint-state')[0] === 'unglued' && textsOf(fresh, 'data-midpoint-sentence')[0] === `no pair given yet — ${la} and ${lb} stand apart: 23 roles · 25 words · 56 tuples · 23 marks` &&
    attrsOf(fresh, 'data-midpoint-side').filter((s) => s === 'A').length === (forward ? 14 : 9) && attrsOf(fresh, 'data-midpoint-side').filter((s) => s === 'B').length === (forward ? 9 : 14) && countOf(fresh, 'data-midpoint-line') === 0 && visibleText(fresh).includes('no word translated — every word foreign to the other side, alike spellings included'),
  textsOf(fresh, 'data-midpoint-sentence')[0]);
const glued = surface(S().shapes[ambo.id], midpointSiteOf(S().shapes[ambo.id], packetAB.trace.siteId, packetAB.trace));
const gRec = recordOfEdge(edgeAB);
check('§4 ★★ BOTH OPPOSITE VERTICES AS RECORD, one above and one below, each through its face — IN WORDS (C-7f item 6, the designer: WHOLE, or WORDS, never a thumbnail — a 9 px drawing looks like information and stops the person asking for it): C (the T cell) reads `holds a concept-space of 10 roles · 11 relations · 6 words`, D (Φ) `9 roles · 22 relations · 14 words`, each with `open the drawing` and NO drawing until asked (0 points inside a source when closed); the device computes nothing with them (no line, no glyph, no count of theirs in the trace)',
  (() => {
    const src = (html, pos) => (html.split(`data-midpoint-source="${pos}"`)[1] || '').split(/data-midpoint-word-half="|data-midpoint-source="/)[0];
    const above = src(glued, 'above'); const below = src(glued, 'below');
    const words = (i) => `holds a concept-space of ${i.census.points} roles · ${i.census.arrows + i.census.loops + i.census.hyper} relations · ${i.census.words} words`;
    const texts = `${visibleText(above)} ${visibleText(below)}`;
    return countOf(glued, 'data-midpoint-source') === 2 && texts.includes(words(insideOf(tcell))) && texts.includes(words(insideOf(phi))) && attrsOf(glued, 'data-midpoint-source-open').length === 2 && attrsOf(glued, 'data-midpoint-source-open').every((o) => o === 'closed') &&
      countOf(above, 'data-inside-point') === 0 && countOf(below, 'data-inside-point') === 0 && countOf(glued, 'data-midpoint-source-drawing') === 0 && !/data-midpoint-source-words="true"[^>]*>[^<]*(offer|candidate|weight)/.test(glued);
  })());
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
check('§4 ★★ THE EMPTY MAP\'S LINES GO BARE (C-7f item 2, the designer: a residual is the trace OF AN ACT; in the unglued state no act has been made): the unglued render carries NO residual sentence (`data-midpoint-residuals` absent — the standing-apart sentence already describes the two records), the glued one both parents\' lines',
  (() => { const bare = surface(ambo, siteAB); return countOf(bare, 'data-midpoint-residuals') === 0 && countOf(glued, 'data-midpoint-residuals') === 1 && attrsOf(glued, 'data-midpoint-parent-trace').length === 2; })());
check('§4 ★★ THE REFUSAL AT THE ACT, IN THE ONE GRAMMAR (C-7h item 6, the designer\'s §125.1 — one head `not taken` at every midpoint site; `refused`, `(the act just made)` and `nothing glued, the edge keeps its prior state` retired): `not taken — F1 ↦ Φ9: the two records contradict under it`, the conflict with BOTH values and BOTH parents named — `member_status: F1 has in A · Φ9 none-by-nature in B` — and its one hand `here, on A–B: withdraw this attempt`; the three lines still stand',
  (() => { const [x, y] = role('F1', 'Φ9'); const [lx, ly] = [la, lb]; const text = visibleText(refusedHtml); return countOf(refusedHtml, 'data-midpoint-refusal') === 1 && text.includes(`not taken — ${x} ↦ ${y}: the two records contradict under it`) && attrsOf(refusedHtml, 'data-midpoint-conflict')[0] === (forward ? `member_status: F1 has in ${lx} · Φ9 none-by-nature in ${ly}` : `member_status: Φ9 none-by-nature in ${lx} · F1 has in ${ly}`) && countOf(refusedHtml, 'data-midpoint-withdraw-attempt') === 1 && text.includes(`here, on ${lx}–${ly}: withdraw this attempt`) && !/refused —|the act just made|nothing glued/.test(text) && countOf(refusedHtml, 'data-midpoint-line') === 3; })(),
  `${J(attrsOf(refusedHtml, 'data-midpoint-conflict'))} · culprits ${J((visibleText(refusedHtml).match(/.{50}(refused —|the act just made|nothing glued).{50}/g) || []).slice(0, 4))} · ${visibleText(refusedHtml).slice(Math.max(0, visibleText(refusedHtml).indexOf('not taken')), Math.max(0, visibleText(refusedHtml).indexOf('not taken')) + 220)}`);
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
// C-7d item 0 — THE TWO HALVES REACHABLE: the word half ABOVE the drawing, the chips controls, one sentence naming both halves
check('§4 ★★ THE WORD HALF STANDS ABOVE THE DRAWING (C-7d item 0, Δ83 — measured at the eye: the rows sat 107 px below the panel\'s fold at 1689 × 897): in the rendered order the word half (`data-midpoint-word-half`) and both word rows precede the drawing; the sentence at the top names BOTH halves and where each is made; the chips are buttons styled as controls',
  glued.indexOf('data-midpoint-word-half="true"') < glued.indexOf('data-midpoint-drawing="true"') && glued.indexOf('data-midpoint-words="A"') < glued.indexOf('data-midpoint-drawing="true"') && glued.indexOf('data-midpoint-words="B"') < glued.indexOf('data-midpoint-drawing="true"') &&
    textsOf(glued, 'data-midpoint-gesture')[0].startsWith('two halves, both yours: a role — click a point in') && /a word — click a word in/.test(textsOf(glued, 'data-midpoint-gesture')[0]) &&
    /<button[^>]*data-midpoint-word="A\|sustains"[^>]*class="[^"]*border[^"]*"/.test(glued) && visibleText(glued).includes('the words — τ, the translation, given by you'));
check('§4 ★★ THE MAPPED MIDPOINT\'S OWN DIAGRAM, ITS ORIGINS WRITTEN (C-7d item 1 · C-7f item 4): under (J₃, τ₃) the surface draws the glued space as ONE column — 20 points in the glue\'s order, the three glued roles marked, 4 tuples `both`; EVERY role and tuple carries its origin IN WORDS (`both` · `from A` · `from B`: 72 origin words — 20 roles + 52 tuples; 7 `both`), never colour alone (the tint stays as reinforcement); a translated word keeps its mark `sustains ≡ descends-from`, an untranslated alike spelling is shown plain (no `[A]` / `[B]` in the column\'s text), no `≡` glyph before a tuple\'s word; the unglued midpoint draws NO third column and says its own space is the two columns above',
  (() => {
    const ownHtml = (glued.split('data-midpoint-own="glued"')[1] || '').split('data-midpoint-trace=')[0];
    const origins = attrsOf(ownHtml, 'data-inside-origin');
    const footWords = [...ownHtml.matchAll(/data-inside-arc-word="\d+"[^>]*>([^<]*)</g)].map((m) => unescapeHtml(m[1]));
    return attrsOf(glued, 'data-midpoint-own').includes('glued') && countOf(ownHtml, 'data-inside-point') === 20 && attrsOf(ownHtml, 'data-midpoint-own-role').filter((o) => o === 'both').length === 3 && attrsOf(ownHtml, 'data-midpoint-own-origin').filter((o) => o === 'both').length === 4 &&
      origins.length === 72 && origins.filter((o) => o === 'both').length === 7 && origins.filter((o) => /^from [AB]$/.test(o)).length === 65 && /stroke-sky-300/.test(ownHtml) &&
      ownHtml.includes('sustains ≡ descends-from') && !/ \[[AB]\]/.test(visibleText(ownHtml)) && footWords.length > 0 && footWords.every((w) => !w.startsWith('≡')) &&
      visibleText(glued).includes('its own space, one column: 20 roles · 22 words · 52 tuples · 20 marks') && /every role and tuple says where it is from — both · from [AB] · from [AB]/.test(visibleText(glued)) &&
      attrsOf(fresh, 'data-midpoint-own')[0] === 'unglued' && countOf(fresh, 'data-midpoint-own-drawing') === 0 && visibleText(fresh).includes('its own space is the two casts side by side, the columns above: no pair given yet');
  })(), `${attrsOf(glued, 'data-midpoint-own').join(',')} own · ${countOf((glued.split('data-midpoint-own="glued"')[1] || ''), 'data-inside-point')} points · origins ${attrsOf((glued.split('data-midpoint-own="glued"')[1] || '').split('data-midpoint-trace=')[0], 'data-inside-origin').length}`);
check('§4 ★★ THE PROJECTION SOURCES CARRY THE PERSON\'S ACTS (C-7d item 2): with nothing given on A–C and B–C each source reads `raw material — nothing given yet on the edges that reach it (…)`; after a pair on the A–C edge (given at the AC midpoint) C reads `on A–C: F1 ↦ r0 · sustains ↦ sustains` beside `no identification given yet on B–C` — his own maps as they stand, nothing computed, nothing composed',
  (() => {
    const before = attrsOf(glued, 'data-midpoint-source-acts');
    S().giveRolePair(edgeAC, ...roleAC('F1', 'r0'));
    const after = surface(S().shapes[ambo.id], midpointSiteOf(S().shapes[ambo.id], packetAB.trace.siteId, packetAB.trace));
    const words = textsOf(after, 'data-midpoint-source-acts');
    S().withdrawRolePair(edgeAC, ...roleAC('F1', 'r0'));
    const labelAC = `${ambo.vertices[siteAC.a].data.label}–${ambo.vertices[siteAC.b].data.label}`;
    const pairAC = fwdAC ? 'F1 ↦ r0' : 'r0 ↦ F1';
    return before.length === 2 && before.every((x) => x === 'none') && visibleText(glued).includes('raw material — nothing given yet on the edges that reach it') &&
      attrsOf(after, 'data-midpoint-source-acts').includes('given') && words.some((w) => w.includes(`on ${labelAC}: ${pairAC} · sustains ↦ sustains`) && /no identification given yet on/.test(w));
  })());
check('§4 ★ THE GESTURE LINE under the canvas names the midpoint\'s two halves (C-6a\'s ruling: the module states every act it offers in its own persistent row)',
  /at a midpoint, two halves: a role here then a role there in the drawing, a word here then a word there in the rows above it — each pair yours, withdrawable/.test(readLf('src/components/Workspace3D.tsx')));
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

check('§4 ★★ ONE CODE PATH, TWO SITES — TRUE AT GEN 2 (C-7d item 1\'s closing clause, made true by C-7e\'s carry): a mapped midpoint dissected again and selected as a corner draws its glued space through the SAME chooser and column — the engine\'s own carry, no hand — `ConceptSurface` at gen 2 renders `data-midpoint-own="glued"` with the same 20-point column and 4 both; LAW 24 — a gen-1 midpoint with NO record, dissected, renders `data-midpoint-own="unglued"` at gen 2 (a true absence carries as a true absence)',
  (() => {
    const g1 = withCast(withCast(applyAmboDissection(seed), a, flow), b, phi);
    const r1 = buildGeneralSitePacketPresenterReport(g1);
    const p1 = r1.packets.find((p) => p.trace.parentIds.includes(a) && p.trace.parentIds.includes(b));
    const s1 = midpointSiteOf(g1, p1.trace.siteId, p1.trace);
    const fwd1 = s1.a === a;
    const rec = { roles: (fwd1 ? J3 : J3.map(([x, y]) => [y, x])), types: (fwd1 ? T3 : T3.map(([x, y]) => [y, x])) };
    const given = { ...g1, edges: g1.edges.map((e) => (e.id === s1.edge.id ? { ...e, identification: rec } : e)) };
    const core = g1.cells.find((x) => x.kind === 'core').id;
    const withCarry = render(React.createElement(ConceptSurface, { shape: applyAmboDissection(given, core), vertexId: p1.trace.siteId }));
    const without = render(React.createElement(ConceptSurface, { shape: applyAmboDissection(g1, core), vertexId: p1.trace.siteId }));
    const ownHtml = (withCarry.split('data-midpoint-own="glued"')[1] || '').split('data-midpoint-trace=')[0];
    return countOf(withCarry, 'data-midpoint-surface') === 1 && attrsOf(withCarry, 'data-midpoint-own').includes('glued') && countOf(ownHtml, 'data-inside-point') === 20 && attrsOf(ownHtml, 'data-midpoint-own-origin').filter((o) => o === 'both').length === 4 &&
      countOf(without, 'data-midpoint-surface') === 1 && attrsOf(without, 'data-midpoint-own')[0] === 'unglued';
  })());

// C-5 ITEM 0 was MEASURED here on the SHORTCUT (casts loaded onto the gen-1 midpoints AB and AC — an act Arman named as not
// his, Δ86: "no cast loading is only for the seed"); C-8 item 0 reads the LAWFUL path — casts on the seed's corners only, AB
// and AC mapped by pointing, nothing loaded on a midpoint — and the shortcut's loaded casts are NOT READ (said, never
// silently preferred). The born room itself is scripts/diagnose-the-born-room.cjs's.
check('§4 ★★ C-8 ITEM 0 — THE LAWFUL PATH, and the shortcut retired: with records on A–B and A–C given through the store and NOTHING loaded on a midpoint, the core dissected, the gen-2 midpoint ABAC has a site whose parents both RESOLVE (derived) and the chooser renders the UNFOLDING with the shared corner\'s roles marked `composed` on both sides and NO line across the fold; the same shape with casts loaded onto AB and AC (the shortcut) resolves them to the SAME derived spaces — the loaded casts not read (`loadedIgnored`), the surface saying so',
  (() => {
    const snap = S();
    const g1 = applyAmboDissection(seeded); // the seed's four corners hold casts — the only lawful loading
    useGeometryStore.setState({ shapes: { ...S().shapes, [g1.id]: g1 }, currentShapeId: g1.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {} });
    const a1 = byLabel(g1, 'A'); const b1 = byLabel(g1, 'B'); const c1 = byLabel(g1, 'C');
    const give = (X, Y, map) => { const e = edgeBetween(S().shapes[g1.id].edges, X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === X) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
    give(a1, b1, { F5: 'Φ7', F7: 'Φ1' }); // A holds Flow, B holds Φ in this witness's seed
    give(a1, c1, { F1: 'r0', F5: 'r2' }); // C holds the T cell
    S().selectCell(S().shapes[g1.id].cells.find((x) => x.kind === 'core').id);
    S().applyAmboDissectionToCurrent();
    const g2 = S().shapes[S().currentShapeId];
    const abac = byLabel(g2, 'ABAC');
    const ab = byLabel(g2, 'AB'); const ac = byLabel(g2, 'AC');
    const html = render(React.createElement(ConceptSurface, { shape: g2, vertexId: abac }));
    const RAB = spaceOf(g2, ab); const RAC = spaceOf(g2, ac); const RM = spaceOf(g2, abac);
    // the shortcut: the same gen-2 shape with casts LOADED onto AB and AC — not read
    const shortcut = withCast(withCast(g2, ab, flow), ac, phi);
    const RABs = spaceOf(shortcut, ab);
    const htmlS = render(React.createElement(ConceptSurface, { shape: shortcut, vertexId: abac }));
    useGeometryStore.setState(snap, true);
    note(`C-8 ITEM 0 (the lawful path): ABAC's parents AB (${RAB ? `${RAB.space.roles.length} roles, derived` : 'nothing'}) · AC (${RAC ? `${RAC.space.roles.length} roles, derived` : 'nothing'}) · the chooser renders ${countOf(html, 'data-midpoint-surface')} unfolding · composed points ${countOf(html, 'data-midpoint-composed')} · lines across the fold ${countOf(html, 'data-midpoint-line')} · ABAC ${RM ? `${RM.space.roles.length} roles, ${RM.edge.kind} edge, ${RM.edge.composed.roles.length} composed pairs` : 'nothing'} · the shortcut's loaded cast on AB: ${RABs ? `ignored=${RABs.loadedIgnored}, ${RABs.space.roles.length} roles (derived, not Flow's 14)` : 'nothing'} · the notice ${countOf(htmlS, 'data-midpoint-loaded-ignored')}`);
    return RAB && RAC && RM && RM.edge.kind === 'medial' && countOf(html, 'data-midpoint-surface') === 1 && countOf(html, 'data-midpoint-composed') === 2 * RM.edge.composed.roles.length && RM.edge.composed.roles.length === flow.roles.length && countOf(html, 'data-midpoint-line') === 0 &&
      RABs && RABs.loadedIgnored === true && RABs.space.roles.length === RAB.space.roles.length && countOf(htmlS, 'data-midpoint-loaded-ignored') >= 1;
  })());

// ═══ §5 THE MOUNT and the boundaries, source-pinned ═══
console.log('\n----- §5 the check at the act lives with the writer; the presenter\'s FACE is not consumed; the boundaries -----');
const store = readLf('src/store/geometryStore.ts');
const surf = readLf('src/components/MidpointSurface.tsx');
const gl = readLf('src/lib/midpointGlue.ts');
check('§5 ★★ NO WRITE WITHOUT THE CHECK, BY CONSTRUCTION: the store\'s acts call `refusalOf` before every write — over the identity the SOLID fixed on the seam ∪ the record (C-8: the composed pairs enter the check and never the record) — then read every born act again under the act as a CANDIDATE (item 4) and route every write through `writeEdgeIdentification` (`midpointWrite` → the one writer); the store imports the check and the form from the register and nothing else of it',
  /const conflicts = refusalOf\(A, B, \[\.\.\.\(composed \? composed\.roles : \[\]\), \.\.\.nextRoles\], \[\.\.\.\(composed \? composed\.words : \[\]\), \.\.\.nextTypes\]\);\s*if \(conflicts\.length\) return refuse\(undefined, conflicts\);/.test(store) && (store.match(/brokenBornActs\(shape, \{ tauDrafts: state\.edgeTauDrafts, candidate: \{ edgeId, roles: nextRoles, types: nextTypes \} \}, edgeId\)/g) || []).length === 2 &&
    (store.match(/writeEdgeIdentification\(set,/g) || []).length >= 5 && store.includes("import { refusalOf, wordPairForm, type Conflict } from '../lib/jRegister';"));
check('§5 ★★ THE PRESENTER\'S TRACE IS CONSUMED AND ITS FACE IS NOT: the surface imports `buildGeneralSitePacketPresenterReport` (one producer, many consumers — Panels consumes it too) and never `renderPacketFace`; no sentence of the naming era (`Name the concept`, `Across the cell`) in the surface',
  surf.includes("import { buildGeneralSitePacketPresenterReport, type GeneralSitePacketTrace } from '../lib/generalSitePacketPresenterV0';") && !surf.includes('renderPacketFace') && !/Name the concept|Across the cell|howToName|namingDecision/.test(surf) && readLf('src/components/Panels.tsx').includes('buildGeneralSitePacketPresenterReport(shape)'));
check('§5 ⛔ THE GLUE IS PURE OVER TWO CASTS AND THE PERSON\'S (J, τ): midpointGlue.ts imports only the types, the mold\'s join from the loader and the register\'s record/refusal/shared signature; no store, no component; the surface reaches the store only to act (the midpoint\'s five actions, the face\'s one hand — `withdrawRolePair` again, in FaceRecord (C-5) — and the born face\'s one hand, `withdrawRolePair` again, in BornFaceRecord (C-9); three state reads in the chooser)',
  (gl.match(/^import /gm) || []).length === 3 && gl.includes("import { isMoldType, moldJoin } from './castLoader';") && gl.includes("import { recordOf, refusalOf, sharedSignature, type Conflict } from './jRegister';") && !/from '\.\.\/store|from '\.\.\/components/.test(gl) &&
    (surf.match(/useGeometryStore\(\(s\) => s\.(give|withdraw)/g) || []).length === 7 && !/updateSelected|\.cast\s*=/.test(surf) && !/J_CB|∘/.test(surf));
check('§5 the SURFACE is sited on the canvas through the chooser (Workspace3D mounts `ConceptSurface`) and enters neither Panels.tsx nor the manuscript; the FACE BLOCKS it exports (FaceRecord · BornFaceRecord, with the cell words) are shared by ruling — the face\'s HOME in Panels (C-10b §131 item 2) and the Manuscript\'s card (C-10) import exactly those, never the surface',
  readLf('src/components/Workspace3D.tsx').includes("import { ConceptSurface } from './MidpointSurface';") && readLf('src/components/Panels.tsx').includes("import { BornFaceRecord, FaceRecord, faceCellsOf } from './MidpointSurface';") && !readLf('src/components/Panels.tsx').includes('ConceptSurface') && !readLf('src/components/Panels.tsx').includes('<MidpointSurface') && !/from '\.\.\/manuscript|explore/.test(surf));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-MIDPOINT: ALL PASS — the pushout reads the seal, the refusal names both tuples and offers every withdrawal, the trace is a partition never a score, both opposite vertices stand as record, and the presenter\'s trace is consumed' : `DIAGNOSE-THE-MIDPOINT: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
