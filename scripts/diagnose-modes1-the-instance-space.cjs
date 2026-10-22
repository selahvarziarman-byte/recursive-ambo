#!/usr/bin/env node

// DIAGNOSTIC — STAMP MODES-1 · B2 (2026-09-26): THE CHILD AS THE INSTANCE SPACE (the projection ruling D4; ADR 0031 §9.1 D4,
// §9.2's landing gate F4, first half). §0 purity · §a ★★ F4: under IS-only relatings the child's CORE reproduces the built glue's
// core K on the flow ⊔ phi fixture EXACTLY — 3 roles · 4 tuples · 3 marks under (J₃, τ₃) — tuple for tuple and mark for mark
// against `glue()` itself · §b the child is the instances alone, never the parents' leftovers · §c modes: an instance typed by
// its mode, `≡` for IS only, the record induced across modes · §d DISCORDANCE kept as content, never a refusal (a tuple and a
// mark) · §e bars are form; strays carried and marked · §f through the shape: the same child from the corners' spaces; UNDETECTED
// where no relating stands · §g the construction's worked example (§3): the child on A–B is its two IS-instances · §h B2 exposes
// nothing to the core's readers yet (no importer under src/ but the witness's subjects).
//
// Run: node scripts/diagnose-modes1-the-instance-space.cjs

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

const I = req('src/lib/instanceSpace.ts');
const M = req('src/lib/relatings.ts');
const { glue } = req('src/lib/midpointGlue.ts');
const { spaceOf } = req('src/lib/spaceOf.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json'); const triangle = cast('triangle.cast.json');
const J3 = [['F5', 'Φ7'], ['F7', 'Φ1'], ['F8', 'Φ2']];
const T3 = [['sustains', 'descends-from'], ['presupposes', 'specifies'], ['exceeds-in-size', 'lodges-in']];
const isOf = (pairs) => pairs.map(([x, y]) => ['IS', x, y, '+']);
const minimal = (spec) => readCastFile(J(spec)).cast;
const sortedKeys = (list, f) => list.map(f).sort();

// ═══ §0 PURITY ═══
console.log('THE CHILD AS THE INSTANCE SPACE — B2 (MODES-1)\n\n----- §0 purity -----');
const src = readLf('src/lib/instanceSpace.ts');
check('§0 instanceSpace.ts is react-free and store-free (the types, the mold helper, the face reading\'s edgeBetween (B4), the register\'s translation, the glue\'s types, B1\'s reader, the respects\' base read, the resolver — and STAMP THE-FINDINGS-BATCH · slice 2 · F: the child\'s loops, by which a born corner read as a parent with his records carries its FILLED LOOPS as arcs, `childArcsOf` (and `childArcDetailsOf` for the labels of a column, §9.48), read at call time only — the recursion\'s one import)', (src.match(/^import /gm) || []).length === 10 && /^import \{ childArcDetailsOf, childArcsOf \} from '\.\/childLoops';$/m.test(src) && !/useGeometryStore|from '\.\.\/store|from '\.\.\/components|from '\.\.\/manuscript|from 'react'|from 'three'|@react-three/.test(src));
check('§0 the module never touches `.identification` (it reads through B1\'s one reader and the resolver\'s base read) and never refuses (no `refused`, no `throw`)', !/\.identification\b|EdgeIdentification|refused|throw /.test(src));
check('§0 `≡` is IS and nothing else (the designer\'s rule 3, M1): the key is `x≡y` for IS and, for any other mode, HIS SENTENCE — `x w y` said from the first corner, `y w x` from the second (D13, MODES-4)', /mode === IS \? `\$\{x\}≡\$\{y\}` : dir === ALONG \? `\$\{x\} \$\{mode\} \$\{y\}` : `\$\{y\} \$\{mode\} \$\{x\}`/.test(src));

// ═══ §a F4 — the core K under IS-only ═══
console.log('\n----- §a F4: the core under IS-only reproduces K exactly -----');
const child3 = I.instanceSpaceFromCasts(flow, phi, isOf(J3), T3);
const glued3 = glue(flow, phi, J3, T3);
const M3 = glued3.refused ? null : glued3.midpoint;
check('§a ★★ THE LANDING GATE, FIRST HALF (ADR 0031 §9.2): under IS-only relatings the child\'s core is `3 roles · 4 tuples · 3 marks` under (J₃, τ₃) — equal to the built glue\'s core K on the same fixture, read from `glue()` itself', M3 !== null && J(child3.core) === J(M3.core) && J(child3.core) === '{"roles":3,"tuples":4,"marks":3}', J({ child: child3.core, glue: M3 && M3.core }));
const bothTuples = (M) => M.tuples.filter((t) => t.origin === 'both').map((t) => `${t.word}|${J(t.terms)}|${t.value}`).sort();
const childBoth = child3.record.filter((e) => e.witnesses.length === 2).map((e) => `${e.word}|${J(e.terms)}|${e.value}`).sort();
check('§a ★★ TUPLE FOR TUPLE: the child\'s two-witness entries are exactly the glue\'s `both` tuples — the same word keys (`s≡t`), the same instance keys (`x≡y`), the same values', M3 !== null && J(childBoth) === J(bothTuples(M3)), J(childBoth));
const bothMarks = (M) => M.marks.filter((m) => m.witnesses.length === 2).map((m) => `${m.type}|${m.role}|${m.value}`).sort();
const childMarks2 = child3.marks.filter((m) => m.witnesses.length === 2).map((m) => `${m.type}|${m.role}|${m.value}`).sort();
check('§a ★★ MARK FOR MARK: the child\'s two-witness marks are exactly the glue\'s two-witness marks (the mold\'s `member_status` on each of the three instances)', M3 !== null && J(childMarks2) === J(bothMarks(M3)), J(childMarks2));
check('§a the roles ARE K = dom J: the three instances `F5≡Φ7 · F7≡Φ1 · F8≡Φ2`, each typed `mode: IS`', J(child3.instances.map((i) => i.key)) === J(['F5≡Φ7', 'F7≡Φ1', 'F8≡Φ2']) && child3.space.roles.every((r) => r.types.mode === 'IS'));
check('§a the pulled-back signature is the glue\'s words: 22 words, the three τ pairs as one word each (`sustains≡descends-from` …)', M3 !== null && child3.words.length === M3.words.length && J(child3.words.map((w) => w.key).sort()) === J(M3.words.map((w) => w.key).sort()) && child3.words.some((w) => w.key === 'sustains≡descends-from'));
const empty3 = I.instanceSpaceFromCasts(flow, phi, [], []);
check('§a the control: no relating → no instance, no tuple, no mark; the child UNDETECTED (the glue under ∅ has 23 roles — the disjoint union; the child has none: the instances alone)', empty3.state === 'undetected' && empty3.instances.length === 0 && empty3.record.length === 0 && empty3.marks.length === 0 && !glue(flow, phi, [], []).refused && glue(flow, phi, [], []).midpoint.counts.roles === 23);

// ═══ §b the child is the instances alone ═══
console.log('\n----- §b the instances alone -----');
check('§b THE CHILD IS THE INSTANCES ALONE (Q1): 3 roles where the pushout has 14 + 9 − 3 = 20; no parent\'s unmatched role enters', child3.counts.roles === 3 && M3 !== null && M3.counts.roles === 20 && child3.space.roles.length === 3);
note(`the child under (J₃, τ₃): ${child3.counts.roles} roles · ${child3.counts.words} words · ${child3.counts.tuples} tuples (${child3.core.tuples} both) · ${child3.counts.marks} marks (${child3.core.marks} both) · ${child3.counts.discordances} discordances`);
check('§b the one-sided record is kept too (via X alone, via Y alone) — every entry has its witnesses, none is dropped and none is doubled', child3.record.every((e) => e.witnesses.length >= 1) && new Set(child3.record.map((e) => `${e.word}|${J(e.terms)}`)).size === child3.record.length && child3.record.some((e) => e.witnesses.length === 1));
check('§b every induced entry\'s terms are instance keys and its word a pulled-back word', child3.record.every((e) => e.terms.every((t) => child3.instances.some((i) => i.key === t)) && child3.words.some((w) => w.key === e.word)));

// ═══ §c modes ═══
console.log('\n----- §c modes -----');
const withMode = I.instanceSpaceFromCasts(flow, phi, [...isOf(J3), ['carries', 'F5', 'Φ1', '+']], T3);
const carries = withMode.instances.find((i) => i.mode === 'carries');
check('§c a relating in another mode is an instance typed by its mode, keyed by its word (never `≡`): `F5 carries Φ1`, `types.mode = carries`', !!carries && carries.key === 'F5 carries Φ1' && withMode.space.roles.find((r) => r.id === carries.key).types.mode === 'carries' && withMode.instances.length === 4);
const across = withMode.record.filter((e) => e.terms.includes('F5 carries Φ1'));
check('§c the record is induced across modes: entries land on the carries-instance wherever a parent relates its coordinate (F5 in Flow, Φ1 in Φ) to another instance\'s', across.length > 0 && across.every((e) => e.witnesses.length >= 1), `${across.length} entries on it`);
check('§c the IS-core is unchanged by the mode\'s presence (F4 holds beside it): the two-witness part still K', J(withMode.record.filter((e) => e.witnesses.length === 2 && !e.terms.includes('F5 carries Φ1')).map((e) => `${e.word}|${J(e.terms)}|${e.value}`).sort()) === J(childBoth));

// ═══ §d discordance ═══
console.log('\n----- §d discordance kept as content -----');
const P = minimal({ roles: [{ id: 'p1', types: { member_status: 'has' } }, { id: 'p2' }], signature: [{ type: 'near', arity: 2 }], relations: [{ type: 'near', terms: ['p1', 'p2'], polarity: 'holds' }] });
const Q = minimal({ roles: [{ id: 'q1', types: { member_status: 'none-by-nature' } }, { id: 'q2' }], signature: [{ type: 'close', arity: 2 }], relations: [{ type: 'close', terms: ['q1', 'q2'], polarity: 'does-not-hold' }] });
const disc = I.instanceSpaceFromCasts(P, Q, isOf([['p1', 'q1'], ['p2', 'q2']]), [['near', 'close']]);
const refusedGlue = glue(P, Q, [['p1', 'q1'], ['p2', 'q2']], [['near', 'close']]);
check('§d ★★ A TUPLE DISCORDANCE IS KEPT AS CONTENT (Q4): `near≡close(p1≡q1, p2≡q2)` holds via P and does-not-hold via Q — both values kept, no entry in the record, the child still built; the built glue REFUSES the same pairing (the control)', disc.discordances.length === 1 && disc.discordances[0].viaA === 'holds' && disc.discordances[0].viaB === 'does-not-hold' && disc.discordances[0].word === 'near≡close' && !disc.record.some((e) => e.word === 'near≡close') && disc.instances.length === 2 && refusedGlue.refused, J(disc.discordances));
check('§d ★★ A MARK DISCORDANCE IS KEPT AS CONTENT: `member_status` has via P and none-by-nature via Q on `p1≡q1` — both values kept, no mark; the glue refuses it (the control)', disc.markDiscordances.length === 1 && disc.markDiscordances[0].viaA === 'has' && disc.markDiscordances[0].viaB === 'none-by-nature' && !disc.marks.some((m) => m.role === 'p1≡q1' && m.type === 'member_status'), J(disc.markDiscordances));
check('§d the counts say so: discordances counted, the core empty of the discordant entry', disc.counts.discordances === 2 && disc.core.tuples === 0 && disc.core.marks === 0);

// ═══ §e bars and strays ═══
console.log('\n----- §e bars are form; strays carried -----');
const barred = I.instanceSpaceFromCasts(flow, phi, [...isOf(J3), ['IS', 'F5', 'Φ1', '-'], ['carries', 'F9', 'Φ3', '-']], T3);
check('§e a BAR adds no role and no tuple (form, not a role — Q6): listed beside the child, the core unchanged', barred.bars.length === 2 && barred.instances.length === 3 && J(barred.core) === J(child3.core));
const stray = I.instanceSpaceFromCasts(flow, phi, [...isOf(J3), ['IS', 'F99', 'Φ1', '+'], ['carries', 'F5', 'Φ99', '+']], T3);
check('§e a STRAY (an instance naming a role its corner\'s cast does not hold) is carried and marked, never a role and never dropped', stray.strays.length === 2 && stray.instances.length === 3 && stray.counts.strays === 2 && J(stray.core) === J(child3.core));

// ═══ §f through the shape ═══
console.log('\n----- §f through the shape -----');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
let seeded = createSeedShape('tetrahedron');
for (const [l, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', triangle]]) seeded = withCast(seeded, byLabel(seeded, l), c);
useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [] });
const A = byLabel(cur(), 'A'); const C = byLabel(cur(), 'C');
const eAC = edgeBetween(cur().edges, A, C);
const acFirstIsA = eAC.vertexIds[0] === A;
for (const [x, y] of J3) S().giveRolePair(eAC.id, ...(acFirstIsA ? [x, y] : [y, x]));
for (const [s, t] of T3) S().giveWordPair(eAC.id, ...(acFirstIsA ? [s, t] : [t, s]));
S().giveRelating(eAC.id, 'carries', ...(acFirstIsA ? ['F5', 'Φ1'] : ['Φ1', 'F5']), '+');
const onShape = I.instanceSpaceOf(cur(), edgeBetween(cur().edges, A, C));
const U = spaceOf(cur(), eAC.vertexIds[0]).space; const V = spaceOf(cur(), eAC.vertexIds[1]).space;
const direct = I.instanceSpaceFromCasts(U, V, [...M.instancesOn(edgeBetween(cur().edges, A, C)), ...M.barsOn(edgeBetween(cur().edges, A, C))], edgeBetween(cur().edges, A, C).identification.types);
check('§f THE CHILD OF AN EDGE ON THE SHAPE is the child of its corners\' resolved spaces under the relatings B1\'s reader gives and the τ in force — the same object, byte-equal', onShape !== null && J(onShape) === J(direct) && onShape.instances.length === 4 && onShape.core.roles === 4, onShape && J({ instances: onShape.instances.map((i) => i.key), core: onShape.core }));
check('§f F4 THROUGH THE SHAPE: on A–C (flow ⊔ phi) with (J₃, τ₃) the IS-core is still `3 · 4 · 3` beside the carries-instance', onShape !== null && onShape.record.filter((e) => e.witnesses.length === 2 && e.terms.every((t) => t.includes('≡'))).length === 4 && onShape.marks.filter((m) => m.witnesses.length === 2 && m.role.includes('≡')).length === 3);
const eAB = edgeBetween(cur().edges, A, byLabel(cur(), 'B'));
const undetected = I.instanceSpaceOf(cur(), eAB);
check('§f UNDETECTED (D8): an edge with no relating has a child with no role — carried, not looked at', undetected !== null && undetected.state === 'undetected' && undetected.instances.length === 0);
check('§f no edge → null; a corner holding no space → null (never a fabricated child)', I.instanceSpaceOf(cur(), undefined) === null);

// ═══ §i the law-fill (ADR 0031 §9.46 (4), §9.48 (5); the mothership's 18:21, its part 5; the researcher's F4 probe, 4 of 4) ═══
console.log('\n----- §i the law-fill -----');
{
  const CL = req('src/lib/childLoops.ts');
  const { childRecordsOf } = req('src/store/geometryStore.ts');
  const React = require('react');
  const { renderToString } = require('react-dom/server');
  const MS = req('src/components/MidpointSurface.tsx');
  S().applyAmboDissectionToCurrent();
  const AC = Object.values(cur().vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(A) && v.createdBy.sourceVertexIds.includes(C)).id;
  const eNow = () => edgeBetween(cur().edges, A, C);
  const rec = () => childRecordsOf(S());
  const label = (id) => cur().vertices[id].data.label;
  // an arc's two words, its parents' as it was filled through (`A's sustains`), joined as the child's own τ word is (`sustains≡descends-from`)
  const arcKey = (a) => `${a.through.map((t) => t.replace(/^[^']+'s /, '')).join('≡')}|${a.terms.join(',')}`;
  const arcsNow = () => CL.childArcDetailsOf(cur(), AC, { records: rec() });
  const core = () => I.instanceSpaceOf(cur(), eNow()).record.filter((e) => e.witnesses.length === 2 && e.terms.every((t) => t.includes('≡'))).map((e) => `${e.word}|${e.terms.join(',')}`).sort();
  const arcs = arcsNow();
  const selfs = arcs.filter((a) => a.terms[0] === a.terms[1]);
  check('§i ★★ F4 FILLED BY LAW (§9.46 (4), §9.48 (5)): on A–C (flow ⊔ phi) with (J₃, τ₃), the child read with his records has FOUR relations and no answer given — the loops between two pairs whose two ways carry τ-paired words, each as one arc, and two a pair\'s loop with ITSELF (`sustains ≡ descends-from` on F5≡Φ7 and on F7≡Φ1); together exactly the two-witness record K the glue built (the researcher\'s 4 of 4), each filled through its parents\' words (`A\'s sustains`, `C\'s descends-from`), unnamed, never a key',
    arcs.length === 4 && selfs.length === 2 && J(arcs.map(arcKey).sort()) === J(core()) && core().length === 4 && arcs.every((a) => a.name === null && a.through.length === 2 && a.through.every((t) => /^(A|C)'s \S/.test(t))) && S().loopAnswers.length === 0,
    { arcs: arcs.map(arcKey), core: core() });
  // positive control: read without his records the child is thin; one τ pair withdrawn, ITS law arc goes and the loop reads through the pair again, the rest stand
  const thin = CL.childArcDetailsOf(cur(), AC, {});
  const [ps, pt] = acFirstIsA ? ['presupposes', 'specifies'] : ['specifies', 'presupposes'];
  S().withdrawWordPair(eNow().id, ps, pt);
  const less = arcsNow().map(arcKey);
  const Lp = CL.childLoopsCached(cur(), AC, rec());
  const pLoop = Lp.loops.find((l) => l.pair && !l.form && [l.X, l.Y].some((y) => !y.same && (y.w === 'presupposes' || y.w === 'specifies')));
  const pState = pLoop ? CL.loopReadingFor(Lp, pLoop, CL.loopRecordsFor(cur(), AC, Lp, [], [], { converses: [], opaque: [] })).state : null;
  S().giveWordPair(eNow().id, ps, pt);
  const back = arcsNow().map(arcKey).sort();
  check('§i ★★ THE LAW IS HIS τ, NOTHING ELSE (positive control): read without his records the child is thin (no arc); `presupposes ≡ specifies` withdrawn, exactly its arc goes — that loop reads through the pair again (never asked) — and the other three stand; given again, all four are back',
    thin.length === 0 && less.length === 3 && !less.some((k) => /presupposes|specifies/.test(k)) && pState === 'pair' && J(back) === J(core()),
    { thin: thin.length, less, pState, back: back.length });
  // the page: the child's head and the traces' count the same four relations
  const vw = MS.midpointViewOf(cur(), AC, { tauDrafts: S().edgeTauDrafts });
  const html = renderToString(React.createElement(MS.MidpointSurface, { shape: cur(), site: vw.site, parents: vw.parents, resolved: vw.resolved, refusal: null, remade: null })).replace(/<!-- -->/g, '');
  const unesc = (x) => x.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const headAttr = (/data-midpoint-child-counts="([^"]*)"/.exec(html) || [])[1] || '';
  const headText = unesc(((/data-midpoint-child-counts="[^"]*"[^>]*>([^<]*)</.exec(html)) || [])[1] || '');
  const traces = unesc(((/data-midpoint-counts="[^"]*"[^>]*>([^<]*)</.exec(html)) || [])[1] || '');
  check('§i ★ THE CHILD COUNTS ITS RELATIONS FILLED BY LAW (one count, the head\'s and the traces\'): the point tab\'s head `4 relations, in … pieces` and the traces\' own line `… · 4 relations`',
    headAttr.startsWith('4|') && /^4 relations, in \d+ pieces?/.test(headText) && new RegExp(`^${label(AC)}: \\d+ relatings · 4 relations$`).test(traces),
    { headAttr, headText, traces });
  // ITEM 2 · part 1 (the mothership's 2026-10-17 12:56; the designer's 10-10 20:40 (1) and (2)): on the card of F7's pair, the loops filled by law
  // in the list apart, each with its line and the one naming; the role's loop with itself as a line of its own; the row's count
  {
    const unescT = (x) => x.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    const escA = (v) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#x27;'); // an attribute value as React prints it (a loop's id carries quotes and arrows)
    const elementOf = (h, attr, value) => { const open = h.indexOf(`${attr}="${value}"`); if (open < 0) return null; const start = h.lastIndexOf('<', open); const tag = /^<([a-z]+)/.exec(h.slice(start))[1]; let depth = 0; let i = start; const re = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g'); re.lastIndex = start; for (let m = re.exec(h); m; m = re.exec(h)) { if (m[0].startsWith('</')) depth -= 1; else if (!m[0].endsWith('/>')) depth += 1; i = m.index + m[0].length; if (depth === 0) break; } return h.slice(start, i); };
    const textOf = (h) => unescT(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    const pairInst = I.instancesFrom(cur(), A, C).find((k) => k.p === 'F7' && k.mode === 'IS').key; // F7's pair: two loops filled by law with F8's pair, and its loop with itself (F5's pair has only the latter)
    const Lc = CL.childLoopsCached(cur(), AC, rec());
    const me = Lc.roles.findIndex((r) => r.key === pairInst);
    const laws = Lc.loops.filter((l) => l.law && (l.i === me || l.j === me));
    const selfs = Lc.selfs.filter((sl) => sl.i === me);
    const arcs = CL.childArcDetailsOf(cur(), AC, { records: rec() });
    const through = (id) => (arcs.find((x) => x.loopId === id) || { through: [] }).through.join(' with ');
    S().setChildView({ siteId: AC, key: pairInst });
    S().setLoopView({ siteId: AC, key: pairInst, at: 0, scope: 'loop', modes: false, shown: ['pair'] });
    const renderCard = () => { const vw = MS.midpointViewOf(cur(), AC, { tauDrafts: S().edgeTauDrafts }); return renderToString(React.createElement(MS.MidpointSurface, { shape: cur(), site: vw.site, parents: vw.parents, resolved: vw.resolved, refusal: null, remade: null })).replace(/<!-- -->/g, ''); };
    const h0 = renderCard();
    const lawItems = laws.map((l) => elementOf(h0, 'data-child-loop-law', escA(CL.loopIdOf(Lc, l))) || '');
    const otherOf = (l) => Lc.roles[l.i === me ? l.j : l.i].key;
    const selfItem = selfs.length ? elementOf(h0, 'data-child-loop-self', escA(CL.selfIdOf(Lc, selfs[0]))) || '' : '';
    check('§i ★★ A LOOP FILLED BY LAW HAS ITS LINE AND THE ONE NAMING (ITEM 2 · part 1; the designer\'s 20:40 (1)): on the card of F7\'s pair, the loops filled by law stay in the list apart (`through a pair: … · show`) and each reads `with (…): filled through a pair of words, <X\'s word> with <Y\'s word>, so both ways read the same` with the field and `name it`; a role\'s loop with ITSELF reads `with itself: filled through a pair of words, … ` with `name it`, under its loops (20:40 (2))',
      laws.length === 2 && lawItems.every((h, n) => h.length > 0 && textOf(h).startsWith(`with ${I.termWordsOf(cur(), AC, otherOf(laws[n]))}: filled through a pair of words, ${through(CL.loopIdOf(Lc, laws[n]))}, so both ways read the same`) && /data-child-relation-field="true"/.test(h) && /data-child-relation-name-it="true"/.test(h))
        && selfs.length === 1 && selfItem.length > 0 && textOf(selfItem).startsWith(`with itself: filled through a pair of words, ${through(CL.selfIdOf(Lc, selfs[0]))}`) && /data-child-relation-name-it="true"/.test(selfItem) && !/data-child-relation-reads/.test(selfItem)
        && (h0.indexOf('data-child-loops-form=') < 0 ? h0.indexOf('data-child-loop-self=') > 0 : h0.indexOf('data-child-loop-self=') < h0.indexOf('data-child-loops-form=')),
      J({ laws: laws.length, lawTexts: lawItems.map((h) => textOf(h).slice(0, 140)), self: textOf(selfItem).slice(0, 140) }));
    // named, like any filled relation: on the kind; the law loop with its way to choose, the loop with itself with none; the name stands; withdrawn, gone
    const lawId = CL.loopIdOf(Lc, laws[0]); const selfId = CL.selfIdOf(Lc, selfs[0]);
    const n1 = S().nameRelation(AC, lawId, 'cw-law'); const n2 = S().nameRelation(AC, selfId, 'cw-self');
    const h1 = renderCard();
    const lawNamed = elementOf(h1, 'data-child-loop-law', escA(lawId)) || ''; const selfNamed = elementOf(h1, 'data-child-loop-self', escA(selfId)) || '';
    const arcs1 = CL.childArcDetailsOf(cur(), AC, { records: rec() });
    const names1 = S().relationNames.filter(([sh, v]) => sh === S().currentShapeId && v === AC).map((r) => r[3]).sort();
    const w1 = S().withdrawRelationName(AC, selfId);
    const names2 = S().relationNames.filter(([sh, v]) => sh === S().currentShapeId && v === AC).map((r) => r[3]);
    check('§i ★★ NAMED LIKE ANY FILLED RELATION, ON ITS KIND (§9.48): `cw-law` on the law loop — `cw-law · rename · withdraw · which way it reads: …`, its arc named; `cw-self` on the loop with itself — `cw-self · rename · withdraw`, no way to choose (its two ends are one role), its arc named; both names stand in the record; the loop with itself\'s withdrawn, gone, the other standing',
      n1 === null && n2 === null && /data-child-relation-name="cw-law"/.test(lawNamed) && /data-child-relation-reads=/.test(lawNamed) && /data-child-relation-name="cw-self"/.test(selfNamed) && !/data-child-relation-reads=/.test(selfNamed)
        && (arcs1.find((x) => x.loopId === lawId) || {}).name === 'cw-law' && (arcs1.find((x) => x.loopId === selfId) || {}).name === 'cw-self' && J(names1) === J(['cw-law', 'cw-self']) && w1 === null && J(names2) === J(['cw-law']),
      J({ n1, n2, names1, names2, w1, law: lawNamed.length, self: selfNamed.length, arcLaw: (arcs1.find((x) => x.loopId === lawId) || {}).name, arcSelf: (arcs1.find((x) => x.loopId === selfId) || {}).name }));
    // ITEM 2 · part 1's rider (the designer's look of 18:15; the mothership's 18:21): a filled relation is DRAWN and LISTED like any other — the law-filled loop's arc
    // between the two pairs' rows, named; the loop with itself a loop on its row, named; both names in the strip (before the self name was withdrawn: h1)
    const otherPair = Lc.roles[laws[0].i === me ? laws[0].j : laws[0].i].key;
    const lawArc = elementOf(h1, 'data-midpoint-child-arc', escA(`${Lc.roles[Math.min(laws[0].i, laws[0].j)].key}|${Lc.roles[Math.max(laws[0].i, laws[0].j)].key}`)) || '';
    const selfArc = elementOf(h1, 'data-midpoint-child-arc', escA(`${pairInst}|${pairInst}`)) || '';
    const stripN = (/data-midpoint-child-relations="([^"]*)"/.exec(h1) || [])[1];
    check('§i ★★ THE RIDER — A FILLED RELATION IS DRAWN AND LISTED LIKE ANY OTHER (the designer\'s look of 18:15; §9.46 (4), §9.48): the law-filled loop\'s arc stands between the two pairs\' rows, filled, named `cw-law`; the loop with itself is a loop on its row (`data-midpoint-child-arc-self`), filled, named `cw-self`; the strip lists both names',
      lawArc.length > 0 && /data-midpoint-child-arc-state="filled"/.test(lawArc) && /data-midpoint-child-arc-name="cw-law"/.test(lawArc) && selfArc.length > 0 && /data-midpoint-child-arc-self="true"/.test(selfArc) && /data-midpoint-child-arc-name="cw-self"/.test(selfArc) && stripN === '2' && /cw-law/.test(h1) && /cw-self/.test(h1) && !!otherPair,
      J({ lawArc: lawArc.length, selfArc: selfArc.length, stripN }));
    S().withdrawRelationName(AC, lawId);
    // the row's count: the pair's row counts its relations filled by law and its loop with itself, as the head does
    const rowCount = (() => { const m = new RegExp(`data-midpoint-child-row-count="([^"]*)"`, 'g'); const rows = [...renderCard().matchAll(/data-midpoint-child-row-count="([^"]*)"/g)].map((x) => unescT(x[1])); return rows; })();
    const expectedRel = laws.length + selfs.length;
    check(`§i ★ THE ROW\'S COUNT (the designer\'s 20:40 (2): "in the row\'s count it is one more relation, as it is in the head"): F7\'s pair\'s row counts ${expectedRel} relations — its two loops filled by law and its loop with itself`,
      rowCount.some((t) => new RegExp(`^${expectedRel} relations?\\b`).test(t)), J({ rows: rowCount }));
    S().setChildView(null); S().setLoopView(null);
  }
}

// ═══ §g the construction's worked example ═══
console.log('\n----- §g the construction\'s worked example (§3) -----');
const Ax = minimal({ roles: [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }], signature: [], relations: [] });
const Bx = minimal({ roles: [{ id: 'b1' }, { id: 'b2' }, { id: 'b3' }], signature: [], relations: [] });
const ex = I.instanceSpaceFromCasts(Ax, Bx, isOf([['a1', 'b1'], ['a2', 'b2']]), []);
check('§g the child on A–B under J_AB = {a1~b1, a2~b2} is exactly its two IS-instances `a1≡b1 · a2≡b2` — a3 and b3, unpaired, are not in it (the sorting by C is B3\'s)', J(ex.instances.map((i) => i.key)) === J(['a1≡b1', 'a2≡b2']) && ex.counts.roles === 2 && ex.record.length === 0);

// ═══ §h exposure ═══
console.log('\n----- §h exposure -----');
const walk = (dir, out = []) => { for (const f of fs.readdirSync(dir)) { const p = path.join(dir, f); if (fs.statSync(p).isDirectory()) walk(p, out); else if (/\.(ts|tsx)$/.test(f)) out.push(p); } return out; };
const importers = walk(path.join(repoRoot, 'src')).filter((f) => /from '\.{1,2}\/(lib\/)?instanceSpace'/.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(repoRoot, f).split(path.sep).join('/'));
check('§h THE IMPORTERS of the instance space under src/ are exactly B4\'s descent, the sorting (MODES-4 · D14 — the seed corner\'s view at a medial site read from the coordinate map, `instancesFrom`), the transport (MODES-4 · row 5 — the child at a born corner, the coordinate map\'s fibre), the store (the act\'s role check through `childSpaceOf`; M1\'s coordinate-pair refusal), B5\'s block (the corners\' names, the term reader) MODES-2 (a) — the midpoint surface (the sentence counts the children\'s relatings through `childSpaceOf`, the head\'s own reader: one card, one count) and — COPY-1 §7.5, THE CUT — Panels (the vertex card\'s `space` row counts the child, never the pushout) — and STAMP MODES-3: the cast panel (a born corner\'s drawing is its child, `columnSpaceOf`; the midpoint view\'s columns read the same) — and THE THIRD RESOLUTION · D19: the identification image model (a merged corner\'s union child reads each member\'s child; the sentences through `termWordsOf`), its card section (the words of roles and lines) and the cargo (item 5 — a born corner\'s role read as its instance, with its mode and direction) — and STAMP THE-ALTITUDE · slice 1: the altitude lib (the saying\'s act checks z against the opposite corner\'s roles and x against the ends\' through `childSpaceOf` — a seed\'s cast, a born corner\'s child; the one direction per light) — and STAMP THE-FINDINGS-BATCH · slice 2: the child\'s cast in the point tab (its rows read by the term reader, `termWordsOf`; the child typed by `childSpaceOf`, its one reader) — and slice 2 · B: the child\'s loops (the child and its parents through `childSpaceOf`, the roles\' ends through the coordinate map, `instancesFrom`) — and slice 2 · C: the card\'s loops (the parents\' roles\' words through `childSpaceOf`) — and §9.48\'s riders (claims §373): the respects (the word triad at a born corner takes the child\'s FILLED relations through `columnSpaceOf`, refused in their words through `wordWordsOf`) — and STAMP THE-RIDERS-AFTER-2.1 · rider 2 (ADR 0031 §9.61): the since-lift reader (a relating\'s roles in the mark\'s list named through the term reader, `termWordsOf`) — and GROUP 4 · slice 2: the one IS predicate (src/lib/isPredicate.ts — the shared parent\'s space through `columnSpaceOf`, each end\'s coordinate at it through `instancesFrom`, the names a refusal says through `termWordsOf`, a word\'s words through `wordWordsOf`; read by the store\'s act and the seam\'s alike)', J(importers.sort()) === J(['src/components/CastInsideDiagram.tsx', 'src/components/ChildCast.tsx', 'src/components/ChildLoopCard.tsx', 'src/components/MediumBlock.tsx', 'src/components/MidpointSurface.tsx', 'src/components/Panels.tsx', 'src/lib/altitude.ts', 'src/lib/childLoops.ts', 'src/lib/descent.ts', 'src/lib/isPredicate.ts', 'src/lib/respects.ts', 'src/lib/sorting.ts', 'src/lib/transport.ts', 'src/manuscript/IdentificationImageSection.tsx', 'src/manuscript/cargoModel.ts', 'src/manuscript/identificationImageModel.ts', 'src/manuscript/sinceLiftModel.ts', 'src/store/geometryStore.ts']), J(importers));

// ═══ §A16 THE ONE-TO-ONE LAW AT THE WORD GRAIN (ADR 0031 §9.63 (7); the 15:07 STAMP ruling 4; the coder's measure of 10-20 15:05) ═══
{
  const A16 = { refused: 0 };
  let sh16 = createSeedShape('tetrahedron');
  const lab16 = (l) => Object.values(sh16.vertices).find((v) => v.data.label === l).id;
  const w16 = (id, c) => ({ ...sh16, vertices: { ...sh16.vertices, [id]: { ...sh16.vertices[id], data: { ...sh16.vertices[id].data, cast: c } } } });
  sh16 = w16(lab16('A'), cast('flow.cast.json')); sh16 = w16(lab16('B'), cast('phi.cast.json')); sh16 = w16(lab16('C'), cast('t-cell.cast.json')); sh16 = w16(lab16('D'), cast('triangle.cast.json'));
  useGeometryStore.setState({ shapes: { [sh16.id]: sh16 }, shapeOrder: [sh16.id], currentShapeId: sh16.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {} });
  const S16 = () => useGeometryStore.getState(); const cur16 = () => S16().shapes[S16().currentShapeId];
  const A = lab16('A'), B = lab16('B'), C = lab16('C');
  const e16 = (x, y) => edgeBetween(cur16().edges, x, y);
  const pair16 = (x, y, wx, wy) => { const e = e16(x, y); const first = e.vertexIds[0] === x; S16().giveWordPair(e.id, first ? wx : wy, first ? wy : wx); return S16().midpointRefusals[e.id] ? S16().midpointRefusals[e.id].form || 'refused' : null; };
  const wordsOf16 = (c) => cur16().vertices[c].data.cast.signature.map((t) => t.type);
  const [a1, a2] = wordsOf16(A); const b1 = wordsOf16(B)[0]; const c1 = wordsOf16(C)[0];
  const r1 = pair16(A, B, a1, b1); const r2 = pair16(B, C, b1, c1); const r3 = pair16(C, A, c1, a2);
  check('§A16 ★★ A CYCLE OF TRANSLATIONS THAT MAKES TWO WORDS OF ONE CAST ONE IS REFUSED BY NAME, THE CYCLE SHOWN (the measure of 10-20 15:05, where all three were taken): `' + a1 + ' ≡ ' + b1 + '` on A–B, `' + b1 + ' ≡ ' + c1 + '` on B–C taken; `' + c1 + ' ≡ ' + a2 + '` on C–A refused — around the face, ' + a1 + ' and ' + a2 + ', two words of A\'s cast, would be one',
    r1 === null && r2 === null && typeof r3 === 'string' && (r3.includes(`would make ${a1} and ${a2}, two words of A's cast, one word`) || r3.includes(`would make ${a2} and ${a1}, two words of A's cast, one word`)) && r3.includes('around ') && r3.includes(`${a2} ≡ ${c1}`) === false && (S16().edgeTauDrafts[e16(C, A).id] ?? []).length === 0 && !e16(C, A).identification,
    JSON.stringify({ r1, r2, r3 }));
  const r4 = pair16(C, A, c1, a1);
  check('§A16 ★ THE CONTROL (LAW 24): the round that closes on the word it left from — `' + c1 + ' ≡ ' + a1 + '` on C–A — is TAKEN: no two words of one cast made one', r4 === null, JSON.stringify({ r4, held: S16().edgeTauDrafts[e16(C, A).id] ?? e16(C, A).identification }));
  const so16 = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'src/store/geometryStore.ts'), 'utf8');
  check('§A16 ★ BY CONSTRUCTION: the word act reads `wordCycleOf` after the stone (both rounds, every face through the edge\'s corners), and the role grain keeps its stone untouched',
    so16.includes("const cycle = wordCycleOf(state, shape, edge, s, w);") && so16.includes("if (cycle) return refuse(cycle, []);") && so16.includes("function wordCycleOf(state: GeometryState, shape: Shape, edge: Edge, s: string, w: string): string | null {") && so16.includes("const stone = stoneOn(RA, RB, x, y, 'role');"));
  void A16;
}

// ═══ §part6 THE LEFTOVERS' NAMES (group 3 · part 6; the designer's 13:42: a parent's leftover key named as a parent's moment is named at the child) ═══
{
  const fs6 = require('node:fs'); const path6 = require('node:path');
  const { termWordsOf: tw6, leftoverWordsOf: lw6 } = req('src/lib/instanceSpace.ts');
  const S6 = () => useGeometryStore.getState();
  S6().importWorkspace(JSON.parse(fs6.readFileSync(path6.join(__dirname, 'fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json'), 'utf8')));
  const s60 = S6().shapes[S6().currentShapeId]; S6().selectCell(s60.cells.find((c) => /core/.test(c.id)).id); S6().applyAmboDissectionToCurrent();
  const sh6 = S6().shapes[S6().currentShapeId];
  const lab6 = (l) => Object.values(sh6.vertices).find((v) => v.data.label === l);
  const Acc = lab6('Accumulation'); const Fin = lab6('Finance'); const Pro = lab6('Production');
  const e6 = edgeBetween(sh6.edges, Fin.id, Pro.id);
  const first6 = e6.vertexIds[0] === Fin.id ? 'Finance' : 'Production'; const second6 = first6 === 'Finance' ? 'Production' : 'Finance';
  const A6 = first6 === 'Finance' ? ['A:hoard', 'the hoard (Finance)'] : ['A:product', 'the product (Production)'];
  const B6 = second6 === 'Production' ? ['B:product', 'the product (Production)'] : ['B:hoard', 'the hoard (Finance)'];
  const gone6 = first6 === 'Finance' ? ['A:nothing-of-the-kind', "a role Finance's cast no longer holds"] : ['A:nothing-of-the-kind', "a role Production's cast no longer holds"];
  const got = { a: tw6(sh6, Acc.id, A6[0]), b: tw6(sh6, Acc.id, B6[0]), gone: tw6(sh6, Acc.id, gone6[0]), none: tw6(sh6, Acc.id, 'no-such-key'), held: tw6(sh6, Acc.id, (require('../src/lib/instanceSpace.ts').columnSpaceOf(sh6, Acc.id) || { roles: [] }).roles[0]?.id ?? '') };
  check('§part6 ★★ A LEFTOVER KEY IS NAMED BY HER RULE, NEVER PRINTED AS ITS KEY (the designer\'s 13:42): at Accumulation (the child of ' + first6 + '–' + second6 + ', in the edge\'s stored order) `' + A6[0] + '` reads `' + A6[1] + '` and `' + B6[0] + '` reads `' + B6[1] + '`; a key whose corner\'s cast no longer holds the role reads `' + gone6[1] + '`; a key no corner can be read from reads `a role no cast here holds`; a moment the child holds keeps its own words (its sentence, never a leftover line)',
    got.a === A6[1] && got.b === B6[1] && got.gone === gone6[1] && got.none === 'a role no cast here holds' && got.held.startsWith('(') && !/^A:|^B:/.test(got.held) && lw6(sh6, Acc.id, A6[0]) === A6[1],
    JSON.stringify(got));
  const nested = tw6(sh6, Acc.id, 'A:A:x');
  check('§part6 ★ TWO PREFIXES READ DOWN TWO EDGES: `A:A:x` from Accumulation reaches a SEED through the first prefix, where a second prefix has no edge to read — `a role no cast here holds`, never the key', nested === 'a role no cast here holds' || /cast no longer holds$/.test(nested), nested);
  const src6 = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'src/lib/instanceSpace.ts'), 'utf8');
  check('§part6 ★ BY CONSTRUCTION: `termWordsOf` hands a term the child does not hold to `leftoverWordsOf` (the one term reader says it), which reads `A:`/`B:` down the edge\'s STORED corners and names the role in its holder\'s cast with the corner in parentheses',
    src6.includes('return leftoverWordsOf(shape, corner, id, options, memo);') && src6.includes("const m = /^([AB]):(.+)$/.exec(rest);") && src6.includes("`${nameIn(space, rest)} (${label(at)})`") && src6.includes("`a role ${label(at)}'s cast no longer holds`") && src6.includes("'a role no cast here holds'"));
}

// ═══ §part3 ONE READER OF A BORN CORNER EVERYWHERE (group 3 · part 3): the resolver's glued space is no reader's space at a born corner — the census of its callers, and the control ═══
{
  const fs3 = require('node:fs'); const path3 = require('node:path');
  const root3 = path3.join(__dirname, '..', 'src');
  const walk = (d) => fs3.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path3.join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path3.join(d, e.name)] : []));
  const sites = {};
  for (const f of walk(root3)) {
    const rel = path3.relative(path3.join(__dirname, '..'), f).replace(/\\/g, '/');
    if (rel === 'src/lib/spaceOf.ts') continue;
    const lines = fs3.readFileSync(f, 'utf8').split('\n');
    lines.forEach((line, i) => { const n = (line.match(/(?<![A-Za-z])spaceOf\(/g) || []).length; if (n && !/^\s*import /.test(line) && !/^\s*\/\//.test(line)) { sites[rel] = (sites[rel] || 0) + n; } });
  }
  // the callers that stand, each by its guard: a seed's cast (its branch), the site's own amalgam (`self`), the stone's feet (`bornStepOf`, the named control), the act's ends (part 4's, pending the ruling)
  const expected = {
    'src/components/CastInsideDiagram.tsx': 1, // `seed ? spaceOf(…) : null`
    'src/components/MidpointSurface.tsx': 5, // holdsSpaceAt (a seed), the apex's cast (`bornApex ? undefined : …`), FaceRecord's casts (seed faces), midpointViewOf's `holds` (a seed) and `self` (the site's own amalgam)
    'src/lib/dependenceWords.ts': 1, // after `!isSeedVertex(shape, c)) continue`
    'src/lib/instanceSpace.ts': 1, // childSpaceOf's seed branch
    'src/lib/relatings.ts': 1, // `resolverRoles`, the default no src caller takes (the store hands `childSpaceOf`)
    'src/lib/respects.ts': 1, // `born ? columnSpaceOf(…) : spaceOf(…)`
    'src/lib/bornFace.ts': 2, // bornStepOf — the stone's feet and the witnesses' control (C-12b)
    'src/lib/transport.ts': 1, // after `isSeedVertex(record, v)`
    'src/manuscript/liftedConceptModel.ts': 1, // seedsUnder — a seed resolves to nothing exactly when it holds no cast
    'src/store/geometryStore.ts': 5, // the cast act on the selected (seed) vertex (3) and `resolvedEnds` (2: the act's two ends — part 4's, pending the ruling)
  };
  check('§part3 ★★ THE CENSUS OF THE RESOLVER\'S CALLERS IN src (group 3 · part 3): every `spaceOf(` outside spaceOf.ts is one of the named sites — a seed\'s cast by its branch, the site\'s own amalgam, bornStepOf\'s control, the act\'s ends — and no name, gate, card, panel or column reads a born corner\'s glued space; the counts by file, so a new caller turns this red until it is classified',
    JSON.stringify(Object.fromEntries(Object.entries(sites).sort())) === JSON.stringify(Object.fromEntries(Object.entries(expected).sort())), { sites, expected });
  const so3 = fs3.readFileSync(path3.join(root3, 'store/geometryStore.ts'), 'utf8');
  check('§part3 ★ THE ACT READS THE COLUMN WITH NO FALLBACK (the path that wrote a leftover key into his record): `columnSpaceOf(shape, edge.vertexIds[0], opts)` without `?? A`, a corner holding no relating refused by name, a term no column offers named by its holder\'s cast through the leftover read (part 6) — or, where no cast holds it, in the designer\'s sentence alone',
    so3.includes("const colA = columnSpaceOf(shape, edge.vertexIds[0], opts);") && !so3.includes("columnSpaceOf(shape, edge.vertexIds[0], opts) ?? A") && so3.includes("if (!colA) return refuse(`${la} holds no relating yet`, []);") && so3.includes("const notARole = (c: VertexId, id: string, lc: string): string => { const lo = leftoverOf(shape, c, id, opts); return lo.holder !== null ? `${lo.words} isn't a role of ${lc}` : lo.words; };") && so3.includes("return refuse(notARole(edge.vertexIds[0], x, la), []);") && so3.includes("const name = (c: VertexId, id: string): string => termWordsOf(shape, c, id, opts);"));
  // the control: the resolver's born branch still composes a glued space (its origin `derived`), and the view's parents are the column spaces, not that
  const { spaceOf: so3f } = req('src/lib/spaceOf.ts'); const { midpointViewOf: mv3 } = req('src/components/MidpointSurface.tsx');
  const fsx = require('node:fs');
  useGeometryStore.getState().importWorkspace(JSON.parse(fsx.readFileSync(path3.join(__dirname, 'fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json'), 'utf8')));
  const st3 = useGeometryStore.getState(); const s30 = st3.shapes[st3.currentShapeId]; st3.selectCell(s30.cells.find((c) => /core/.test(c.id)).id); st3.applyAmboDissectionToCurrent();
  const sh3 = useGeometryStore.getState().shapes[useGeometryStore.getState().currentShapeId];
  const lab3 = (l) => Object.values(sh3.vertices).find((v) => v.data.label === l);
  const Acc3 = lab3('Accumulation'); const Cls3 = lab3('Class');
  const mid3 = Object.values(sh3.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(Acc3.id) && v.createdBy.sourceVertexIds.includes(Cls3.id));
  const born3 = so3f(sh3, Acc3.id); const view3 = mv3(sh3, mid3.id);
  check('§part3 ★ THE CONTROL (LAW 24): the resolver\'s born branch still composes Accumulation\'s glued space (origin `derived` — the witness control), while the view at Accumulation–Class hands the COLUMN spaces as its parents (plain spaces, no origin) and its own amalgam as `resolved`',
    !!born3 && born3.origin === 'derived' && !!view3 && view3.parents.length === 2 && view3.parents.every((p) => p !== null && !('origin' in p) && Array.isArray(p.roles)) && view3.resolved.origin === 'derived',
    { born: born3 && born3.origin, parents: view3 && view3.parents.map((p) => (p ? p.roles.length : null)) });
}

console.log(`\n${failures === 0 ? 'DIAGNOSE-MODES1-THE-INSTANCE-SPACE: ALL PASS — the child is the instances alone, its core under IS-only is the built glue\'s K exactly (3 · 4 · 3), a discordance is kept as content, bars are form, strays are carried and marked, and an edge without a relating is undetected' : `DIAGNOSE-MODES1-THE-INSTANCE-SPACE: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
