#!/usr/bin/env node

// DIAGNOSTIC — STAMP THE-FINDINGS-BATCH · SLICE 2 · C and D (the mothership's 11:06; ADR 0031 §9.42–§9.44; the mothership's rulings on D at 13:41 with the
// researcher's §19.28; the designer's 11:17 and 11:24 forms and her 13:43 note): HIS ANSWERS ON THE LOOPS AND THE CARD THAT TAKES THEM, on Virgin Land's
// `Culture` (19:34). §1 what a diagonal and a loop come to — agree, differ, empty; filled (one agreeing, the other empty), a hole, settled; a three-sided
// loop's refused route; a tension on a barred word · §2 a rule binds the loop's SHAPE (its normal form, never the column's order): the shapes on Culture
// (71 asked loops in 15), the price loop's covering 6, a mirrored loop answered at its other diagonal, the loop's own answer before the rule, flagged · §3
// the records' life — logged, gone with the loop, the relation's name only on a filled loop, the file, the undo, the dissection · §4 the card under node, in
// the designer's words · §5 by construction.
// Run: node scripts/diagnose-the-childs-loop-card.cjs

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const React = require('react');
const { renderToString } = require('react-dom/server');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const { spaceOf } = req('src/lib/spaceOf.ts');
const CL = req('src/lib/childLoops.ts');
const { relatingsHeld, dirOf } = req('src/lib/relatings.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const unesc = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
/** each element carrying `attr`, its whole text up to the next element carrying it (nested spans included) — the way blocks hold spans within spans */
const blocksOf = (html, attr, stop) => html.split(`${attr}=`).slice(1).map((chunk) => { const end = stop ? chunk.indexOf(stop) : -1; const body = chunk.slice(chunk.indexOf('>') + 1, end > 0 ? end : undefined); return unesc(body.replace(/<input[^>]*>/g, ' [a word] ').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim(); });
const textsOf = (html, attr) => [...html.matchAll(new RegExp(`${attr}="[^"]*"[^>]*>([\\s\\S]*?)</(?:span|div)>`, 'g'))].map((m) => unesc(m[1].replace(/<[^>]+>/g, '')));

const FIX = path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-09_1934_Value-Fact_all-passages-decided.workspace.json');
const ws = JSON.parse(fs.readFileSync(FIX, 'utf8'));
const S = () => useGeometryStore.getState();
S().importWorkspace(ws);
const shape = () => S().shapes[S().currentShapeId];
const cornerOf = (lab) => Object.values(shape().vertices).find((v) => v.data?.label === lab && v.data?.cast)?.id;
const V = cornerOf('Value'); const F = cornerOf('Fact');
const siteId = Object.values(shape().vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(V) && v.createdBy.sourceVertexIds.includes(F)).id;
const edgeOf = () => shape().edges.find((e) => e.vertexIds.includes(V) && e.vertexIds.includes(F));
const Lnow = () => CL.childLoopsCached(shape(), siteId);
const byId = (id) => { const L = Lnow(); return L.loops.find((l) => CL.loopIdOf(L, l) === id); };
const readOf = (id) => { const L = Lnow(); return CL.loopReadingFor(L, byId(id), CL.loopRecordsFor(shape(), siteId, L, S().loopAnswers, S().loopRules, { converses: S().converses, opaque: S().opaque })); };
const render = () => {
  const sh = shape();
  const packet = buildGeneralSitePacketPresenterReport(sh).packets.find((p) => p.trace.siteId === siteId);
  const site = midpointSiteOf(sh, siteId, packet ? packet.trace : null);
  return renderToString(React.createElement(MidpointSurface, { shape: sh, site, parents: [spaceOf(sh, site.a), spaceOf(sh, site.b)], resolved: spaceOf(sh, siteId), refusal: null, remade: null })).replace(/<!-- -->/g, '');
};
const L0 = Lnow();
const asked = L0.loops.filter((l) => !l.form && l.kind !== 'two');
const roleKey = (k) => L0.roles[k].key;

// ═══ §1 WHAT A DIAGONAL AND A LOOP COME TO ═══
console.log('\n----- §1 the readings -----');
const four = asked.find((l) => l.kind === 'four');
const fid = CL.loopIdOf(L0, four); const fi = roleKey(four.i); const fj = roleKey(four.j);
const s0 = readOf(fid).state;
S().sayLoop(siteId, fid, fi, 'a', 'cw-agreed');
const s1 = readOf(fid);
S().sayLoop(siteId, fid, fi, 'b', 'cw-agreed');
const s2 = readOf(fid);
S().sayLoop(siteId, fid, fj, 'a', 0); S().sayLoop(siteId, fid, fj, 'b', 0);
const s3 = readOf(fid);
check('§1 ★★ ONE DIAGONAL AGREEING AND THE OTHER EMPTY IS FILLED (§9.42): nothing said, the loop waits; one way said, it still waits; both ways of the first diagonal on one word — it agrees; both ways of the second on nothing — it is empty; the loop is FILLED',
  s0 === 'waits' && s1.state === 'waits' && s2.diagonals.find((d) => d.start === fi).reading === 'agree' && s3.state === 'filled' && J(s3.diagonals.map((d) => d.reading).sort()) === J(['agree', 'empty']),
  { s0, s1: s1.state, s3: s3.diagonals.map((d) => [d.start, d.reading]) });
S().sayLoop(siteId, fid, fj, 'b', 'cw-other');
const s4 = readOf(fid);
check('§1 ★★ A WORD AND NOTHING DIFFER — A HOLE (§9.42: any diagonal differing): the second diagonal\'s ways on a word and on nothing; the loop is a hole whatever the first says',
  s4.state === 'hole' && s4.diagonals.find((d) => d.start === fj).reading === 'differ', s4.diagonals.map((d) => [d.start, d.reading]));
S().sayLoop(siteId, fid, fj, 'b', 0); S().sayLoop(siteId, fid, fi, 'a', 0); S().sayLoop(siteId, fid, fi, 'b', 0);
const s5 = readOf(fid);
check('§1 ★ EVERY DIAGONAL COMING TO NOTHING BOTH WAYS IS SETTLED: no relation, neither filled nor a hole', s5.state === 'settled' && s5.diagonals.every((d) => d.reading === 'empty'), s5.state);
// a three-sided loop: one way per diagonal is the relating itself; the asked way coming to nothing is a refused route (form, counted empty)
const three = asked.find((l) => l.kind === 'three');
const tid = CL.loopIdOf(L0, three);
const tr0 = readOf(tid);
const askedWays = tr0.diagonals.map((d) => ({ start: d.start, way: d.a.by === 'itself' ? 'b' : 'a', itselfWord: (d.a.by === 'itself' ? d.a : d.b).value }));
for (const w of askedWays) S().sayLoop(siteId, tid, w.start, w.way, 0);
const tr1 = readOf(tid);
S().sayLoop(siteId, tid, askedWays[0].start, askedWays[0].way, askedWays[0].itselfWord);
const tr2 = readOf(tid);
check('§1 ★★ A THREE-SIDED LOOP (§9.42; §9.43): on each diagonal one way IS the relating itself, said already (`itself`); the asked way coming to nothing is a REFUSED ROUTE, counted empty — both refused, settled; the asked way coming to the relating\'s own word agrees, and the loop is filled with the other diagonal refused',
  tr0.diagonals.every((d) => (d.a.by === 'itself') !== (d.b.by === 'itself')) && tr1.state === 'settled' && tr1.diagonals.every((d) => d.reading === 'refused') && tr2.state === 'filled',
  { before: tr0.diagonals.map((d) => [d.a.by, d.b.by]), refused: tr1.diagonals.map((d) => d.reading), after: tr2.state });
// a tension: both ways on a word barred at the diagonal's cross cell
const bars = relatingsHeld(edgeOf()).filter((r) => r[3] === '-');
let tension = null;
for (const l of asked) { const ds = CL.diagonalsOf(L0, l); for (const d of ds) { const b = bars.find((r) => r[1] === d.start && r[2] === d.end); if (b && !d.a.itself && !d.b.itself) { tension = { l, d, w: b[0] }; break; } } if (tension) break; }
let tensionOk = false; let tensionDetail = null;
if (tension) {
  const id = CL.loopIdOf(L0, tension.l); const st = roleKey(tension.d.from === 'i' ? tension.l.i : tension.l.j);
  S().sayLoop(siteId, id, st, 'a', tension.w); S().sayLoop(siteId, id, st, 'b', tension.w);
  const r = readOf(id); const dd = r.diagonals.find((d) => d.start === st);
  tensionOk = dd.reading === 'tension' && dd.tension.a && dd.tension.b && r.state !== 'filled';
  tensionDetail = { word: tension.w, cell: [tension.d.start, tension.d.end], reading: dd.reading, state: r.state };
}
check('§1 ★★ A TENSION (§9.44 (2)): both ways of a diagonal on a word BARRED at its cross cell — the reading is a tension, each way marked, counted EMPTY: it fills nothing',
  !!tension && tensionOk, tensionDetail || 'no barred cell on an asked diagonal');

// ═══ §2 A RULE BINDS THE LOOP'S SHAPE ═══
console.log('\n----- §2 the rules -----');
const shapesPlain = new Set(asked.map((l) => CL.loopShapeOf(L0, l, false).key));
const price = L0.roles.findIndex((r) => r.key === 'price is the case as instituted');
const priceLoop = asked.filter((l) => l.i === price || l.j === price).sort((a, b) => (a.i === price ? a.j : a.i) - (b.i === price ? b.j : b.i) || a.id - b.id)[0];
const priceShape = CL.loopShapeOf(L0, priceLoop, false);
const across = CL.loopsOfShapeAcross(shape(), priceShape.key, false);
check('§2 ★★ THE SHAPES (the mothership\'s 13:41: a loop read from its other end IS the same shape — the normal form is the smaller of its two readings, never the column\'s order): Culture\'s 71 asked loops come in 15 shapes, and the price loop\'s covers 6 (the designer\'s 13:43 note); each word in a key carries its cast (the corner holding it, §19.28 (1)) — Value\'s `presupposes` is not Fact\'s',
  shapesPlain.size === 15 && across.length === 6 && across.every((x) => x.siteId === siteId) && [...shapesPlain].every((k) => /vertex:[^|]*\|/.test(k)),
  { shapes: shapesPlain.size, priceShape: across.length });
const pid = CL.loopIdOf(L0, priceLoop);
const pd = CL.diagonalsOf(L0, priceLoop)[0];
const pStart = roleKey(pd.from === 'i' ? priceLoop.i : priceLoop.j);
const ruled = S().sayLoopRule(siteId, pid, pStart, 'a', 'cw-ruled', false);
const covered = across.map((x) => { const r = readOf(CL.loopIdOf(x.L, x.loop)); const sh = CL.loopShapeOf(x.L, x.loop, false); const d = r.diagonals.find((dd) => dd.a.by === 'rule'); return { from: sh.from, ruledFrom: d ? d.diagonal.from : null, value: d ? d.a.value : null }; });
const mirrored = covered.filter((c) => c.from !== priceShape.from);
check('§2 ★★ ONE SAY FOR EVERY LOOP OF THE SHAPE (`say it for: every loop of this shape`): the rule answers the asked way on all 6 loops; a MIRRORED loop takes it at its other diagonal (§19.28 (2): the diagonals exchange) — so the rule\'s diagonal on each loop is the one read from the same end of the shape',
  ruled === null && covered.every((c) => c.value === 'cw-ruled') && covered.every((c) => (c.from === priceShape.from ? c.ruledFrom === pd.from : c.ruledFrom !== pd.from)) && mirrored.length > 0,
  { covered, mirrored: mirrored.length });
S().sayLoop(siteId, pid, pStart, 'a', 'cw-own');
const own = readOf(pid).diagonals.find((d) => d.start === pStart).a;
check('§2 ★★ THE LOOP\'S OWN ANSWER STANDS BEFORE THE RULE\'S, the rule\'s kept beside it (D6\'s exception)', own.by === 'loop' && own.value === 'cw-own' && own.rule === 'cw-ruled', own);
S().withdrawLoopSay(siteId, pid, pStart, 'a');
S().withdrawLoopRule(priceShape.key, false);
check('§2 ★ WITHDRAWN, the loop\'s own answer and then the rule: the way waits again on every loop of the shape', across.every((x) => readOf(CL.loopIdOf(x.L, x.loop)).diagonals.every((d) => d.a.by !== 'rule' || d.a.value === undefined)) && readOf(pid).diagonals.find((d) => d.start === pStart).a.value === undefined);

// ═══ §3 THE RECORDS' LIFE ═══
console.log('\n----- §3 the records -----');
S().importWorkspace(ws);
const L1 = Lnow(); const f1 = L1.loops.find((l) => l.kind === 'four' && !l.form); const id1 = CL.loopIdOf(L1, f1); const a1 = L1.roles[f1.i].key; const b1 = L1.roles[f1.j].key;
const logAt = S().log.length;
S().sayLoop(siteId, id1, a1, 'a', 'cw-kept'); S().sayLoop(siteId, id1, a1, 'b', 'cw-kept'); S().sayLoop(siteId, id1, b1, 'a', 0); S().sayLoop(siteId, id1, b1, 'b', 0);
const logged = S().log.slice(logAt);
const named = S().nameRelation(siteId, id1, 'cw-relation');
check('§3 ★★ EACH ANSWER A LOGGED ACT (D17: `loopsay` — the shape, the site, the loop, the diagonal\'s starting role, the way, the answer, the one before); the filled loop\'s relation named (`relname`)',
  logged.length === 4 && logged.every((e) => e.act === 'loopsay' && e.shape === shape().id && e.site === siteId && e.loop === id1) && named === null && S().relationNames.length === 1 && S().log[S().log.length - 1].act === 'relname', { logged: logged.map((e) => [e.start === a1 ? 'i' : 'j', e.way, e.answer]) });
const file = JSON.parse(JSON.stringify(S().exportWorkspace()));
S().sayLoop(siteId, id1, b1, 'b', 'cw-unfilling');
const nameAfterHole = S().relationNames.length;
check('§3 ★★ A RELATION\'S NAME STANDS ONLY ON A FILLED LOOP: an answer that makes it a hole takes the name, never back by itself', nameAfterHole === 0 && readOf(id1).state === 'hole');
S().importWorkspace(file);
check('§3 ★★ THE FILE CARRIES THEM: his answers, his rules and his relations\' names ride the export and import back exactly', J(S().loopAnswers) === J(file.loopAnswers) && J(S().relationNames) === J(file.relationNames) && file.loopAnswers.length === 4 && file.relationNames.length === 1 && readOf(id1).state === 'filled',
  { answers: file.loopAnswers.length, names: file.relationNames.length });
const r1 = relatingsHeld(edgeOf()).find((r) => r[3] === '+' && r[1] === L1.roles[f1.i].x && r[2] === L1.roles[f1.i].y);
S().withdrawRelating(edgeOf().id, r1[0], r1[1], r1[2], dirOf(r1));
const goneA = S().loopAnswers.filter(([, , l]) => l === id1).length; const goneN = S().relationNames.length;
S().giveRelating(edgeOf().id, r1[0], r1[1], r1[2], '+', dirOf(r1));
check('§3 ★★ A LOOP GONE TAKES HIS ANSWERS AND ITS RELATION\'S NAME (its relating withdrawn), and they never come back when the relating is made again: the loop stands again, waiting',
  goneA === 0 && goneN === 0 && S().loopAnswers.filter(([, , l]) => l === id1).length === 0 && readOf(id1).state === 'waits', { goneA, goneN });
S().importWorkspace(file);
S().selectCell(shape().cells.find((c) => c.kind === 'core').id);
S().applyAmboDissectionToCurrent();
const g2 = S().currentShapeId;
const carried = S().loopAnswers.filter(([s]) => s === g2).length; const carriedN = S().relationNames.filter(([s]) => s === g2).length;
S().undoWorkspace();
check('§3 ★★ THE DISSECTION CARRIES THEM INTO THE NEW SHAPE (once, when it is first made), and AN UNDO TAKES THEM BACK WITH THE RECORD',
  carried === 4 && carriedN === 1 && J(S().loopAnswers) === J(file.loopAnswers) && J(S().relationNames) === J(file.relationNames), { carried, carriedN });
const badFile = { ...file, loopAnswers: [...file.loopAnswers, [shape().id, siteId, 'no such loop', a1, 'a', 'x']] };
const nt = S().importWorkspace(badFile);
check('§3 ★ A FILE\'S ANSWER ON A LOOP THAT IS NOT ASKED THERE IS NOT TAKEN, by name; the rest is', nt.some((l) => /^an answer on a loop at Culture: that loop's way is not asked there$/.test(l)) && S().loopAnswers.length === 4, nt);

// ═══ §4 THE CARD, UNDER NODE ═══
console.log('\n----- §4 the card -----');
S().importWorkspace(ws);
S().setChildView({ siteId, key: 'price is the case as instituted', scale: null });
S().setLoopView({ siteId, key: 'price is the case as instituted', at: 0, scope: 'loop', modes: false, shown: ['form'] });
const h = render();
const head = textsOf(h, 'data-child-loops-head')[0];
const asks = textsOf(h, 'data-child-loop-asks')[0];
const ways = blocksOf(h, 'data-child-loop-way', 'data-child-loop-diagonal-reading').map((w) => w.split('data-child-loop-diagonal=')[0]);
const scope = textsOf(h, 'data-child-loop-scope')[0];
check('§4 ★★ THE ROLE\'S LOOPS ON ITS CARD (the designer\'s 10:56; her 11:17 §1): `2 closed loops with 1 role: previous · next · 1 of 2`; the loop\'s question first, both diagonals from the role he stands at — `are these two roles related? each way round comes to what, from the price to the obtaining, and from the wanting to the instituted?`',
  head === '2 closed loops with 1 role: previous · next · 1 of 2' && asks === 'are these two roles related? each way round comes to what, from the price to the obtaining, and from the wanting to the instituted?' && /data-child-loop-drawing="true"/.test(h),
  { head, asks });
check('§4 ★★ EACH WAY PRINTED AS IT WAS SAID (her 11:17 §3) — `by Value\'s side: the price presupposes the wanting, and the wanting is the case as the obtaining` — with the decide form, `comes to the price [a word] the obtaining · comes to nothing`; on the second diagonal the leg walked against its saying still prints as said',
  ways.length === 4 && ways[0].startsWith("by Value's side: the price presupposes the wanting, and the wanting is the case as the obtaining") && /comes to the price.*the obtaining.*comes to nothing/.test(ways[0]) && ways[2].startsWith("by Value's side: the price presupposes the wanting, and the price is the case as the instituted"),
  ways.map((w) => w.slice(0, 110)));
check('§4 ★★ THE SCOPE, in the shape\'s count (her 13:43): `say it for: this loop · every loop of this shape (6 loops) · show · the modes too`; the loops across a refusal listed apart, struck where a side does not hold',
  /^say it for: this loop · every loop of this shape \(6 loops\) · show · the modes too/.test(scope || '') && /across a refusal: 4 loops with 1 role, form, never filled · hide/.test(unesc(h).replace(/<[^>]+>/g, '')) && /line-through/.test(h.split('data-child-loops-form-item')[1] || ''),
  { scope });
// answered: the lines and the state in her words
const Lp = Lnow(); const lp = Lp.loops.filter((l) => !l.form && l.kind !== 'two' && (l.i === price || l.j === price)).sort((a, b) => (a.i === price ? a.j : a.i) - (b.i === price ? b.j : b.i) || a.id - b.id)[0];
const lpid = CL.loopIdOf(Lp, lp); const ds = CL.diagonalsOf(Lp, lp); const meKey = 'price is the case as instituted';
const first = ds.find((d) => Lp.roles[d.from === 'i' ? lp.i : lp.j].key === meKey); const second = ds.find((d) => d !== first);
const k1 = Lp.roles[first.from === 'i' ? lp.i : lp.j].key; const k2 = Lp.roles[second.from === 'i' ? lp.i : lp.j].key;
S().sayLoop(siteId, lpid, k1, 'a', 'is directed at'); S().sayLoop(siteId, lpid, k1, 'b', 'is directed at'); S().sayLoop(siteId, lpid, k2, 'a', 0); S().sayLoop(siteId, lpid, k2, 'b', 0);
const h2 = render();
const answers = textsOf(h2, 'data-child-loop-answer');
const state = textsOf(h2, 'data-child-loop-state')[0] || '';
check('§4 ★★ ANSWERED, THE CARD READS IT (her 11:17 §4–§5): `comes to “the price is directed at the obtaining” · withdraw`; the block\'s reading `· they agree: the price is directed at the obtaining` and `· both come to nothing`; the state `filled: from the price to the obtaining, both ways come to “the price is directed at the obtaining”. A relation of the child between … From the wanting to the instituted, both come to nothing.`, then `name it`',
  answers[0] === 'comes to “the price is directed at the obtaining” · withdraw' && textsOf(h2, 'data-child-loop-diagonal-reading').includes('· they agree: the price is directed at the obtaining') && textsOf(h2, 'data-child-loop-diagonal-reading').includes('· both come to nothing') &&
    /^filled: from the price to the obtaining, both ways come to “the price is directed at the obtaining”\. A relation of the child between .+ From the wanting to the instituted, both come to nothing\./.test(state) && /data-child-relation-name-it="true"/.test(h2),
  { answers, state: state.slice(0, 260) });
S().sayLoop(siteId, lpid, k2, 'b', 'rests on');
const h3 = render();
check('§4 ★ A HOLE IN ITS WORDS: `a hole: from the wanting to the instituted, the two ways round differ. It stays as you said it.`', (textsOf(h3, 'data-child-loop-state')[0] || '') === 'a hole: from the wanting to the instituted, the two ways round differ. It stays as you said it.', textsOf(h3, 'data-child-loop-state')[0]);

// ═══ §6 E · THE DRAWING (the designer's 10:56 §the point tab; her 11:04 note on a filled arc's direction; her 11:24 head) ═══
console.log('\n----- §6 the drawing -----');
S().importWorkspace(ws);
S().setChildView({ siteId, key: null, scale: null });
const e0 = render();
const counts0 = textsOf(e0, 'data-midpoint-child-counts')[0];
check('§6 ★★ THE CONCEPT\'S COUNTS (her 10:56 and 11:24): with nothing said, `0 relations, in 18 pieces · loops: 71 waiting · 0 filled · 0 holes · 0 settled · 62 across a refusal · two words at one pair: 3` — every number from the readers; no arc drawn (nothing filled, no hole, no role chosen); his relations `none named yet`',
  counts0 === '0 relations, in 18 pieces · loops: 71 waiting · 0 filled · 0 holes · 0 settled · 62 across a refusal · two words at one pair: 3' && !/data-midpoint-child-arc=/.test(e0) && /the child's relations: <span>none named yet/.test(unesc(e0)),
  counts0);
const rowCount = (html, key) => { const m = html.match(new RegExp(`<g data-midpoint-child-row="${key}"[\\s\\S]*?data-midpoint-child-row-count="([^"]*)"`)); return m ? unesc(m[1]) : null; };
check('§6 ★ EACH ROW\'S COUNT AT ITS END (her 10:56): the price\'s row `2 loops waiting` — its asked loops only (its loops across a refusal are no part of it)', rowCount(e0, 'price is the case as instituted') === '2 loops waiting', rowCount(e0, 'price is the case as instituted'));
S().setChildView({ siteId, key: 'price is the case as instituted', scale: null });
const e1 = render();
const arcs1 = [...e1.matchAll(/data-midpoint-child-arc="([^"]+)" data-midpoint-child-arc-state="([^"]+)"/g)].map((m) => [unesc(m[1]), m[2]]);
check('§6 ★★ THE CHOSEN ROLE\'S LOOPS STILL WAITING ARE DRAWN, DOTTED, only while it is chosen: one arc to `(the wanting is the case as the obtaining)`, its state `waiting`, no arrowhead',
  arcs1.length === 1 && arcs1[0][0] === 'price is the case as instituted|wanting is the case as obtaining' && arcs1[0][1] === 'waiting' && /data-midpoint-child-arc-heads="none"/.test(e1) && /stroke-dasharray="1 3"/.test(e1.split('data-midpoint-child-arc=')[1] || ''),
  arcs1);
// the price loop filled through the store (its own words checked in §4)
const Le = Lnow(); const le = Le.loops.filter((l) => !l.form && l.kind !== 'two' && (l.i === price || l.j === price)).sort((a, b) => (a.i === price ? a.j : a.i) - (b.i === price ? b.j : b.i) || a.id - b.id)[0];
const leid = CL.loopIdOf(Le, le); const dse = CL.diagonalsOf(Le, le);
const ka = Le.roles[dse[0].from === 'i' ? le.i : le.j].key; const kb = Le.roles[dse[1].from === 'i' ? le.i : le.j].key;
const firstK = ka === 'price is the case as instituted' ? ka : kb; const otherK = firstK === ka ? kb : ka;
S().sayLoop(siteId, leid, firstK, 'a', 'is directed at'); S().sayLoop(siteId, leid, firstK, 'b', 'is directed at'); S().sayLoop(siteId, leid, otherK, 'a', 0); S().sayLoop(siteId, leid, otherK, 'b', 0);
S().setChildView({ siteId, key: null, scale: null });
const e2 = render();
const arc2 = (e2.match(/<g data-midpoint-child-arc="[^"]*"[\s\S]*?<\/g>/) || [''])[0];
const title2 = unesc((arc2.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
const towardWanting = le.i === price ? 'end' : 'start';
check('§6 ★★ A FILLED LOOP IS DRAWN, SOLID, WHETHER OR NOT A ROLE IS CHOSEN, its arrowhead at the role both parents\' words run toward (her 11:04 on §9.41 (1): `presupposes` from the price\'s end at Value, `presupposes` from the instituted\'s at Fact — so toward the wanting); its hover says what it is (`filled: both ways come to “the price is directed at the obtaining”`); the head counts it — `1 relation, in 17 pieces · loops: 70 waiting · 1 filled …`',
  /data-midpoint-child-arc-state="filled"/.test(arc2) && new RegExp(`data-midpoint-child-arc-heads="${towardWanting}"`).test(arc2) && !/stroke-dasharray/.test(arc2.split('<path')[1] || '') &&
    title2.startsWith('(the price is the case as the instituted) and (the wanting is the case as the obtaining)') && title2.includes('filled: both ways come to “the price is directed at the obtaining”') &&
    (textsOf(e2, 'data-midpoint-child-counts')[0] || '').startsWith('1 relation, in 17 pieces · loops: 70 waiting · 1 filled · 0 holes · 0 settled'),
  { heads: (arc2.match(/data-midpoint-child-arc-heads="([^"]+)"/) || [])[1], title: title2.slice(0, 200), counts: textsOf(e2, 'data-midpoint-child-counts')[0] });
S().nameRelation(siteId, leid, 'cw-strip');
S().readRelationFrom(siteId, leid, 'wanting is the case as obtaining');
const e3 = render();
const arc3 = (e3.match(/<g data-midpoint-child-arc="[^"]*"[\s\S]*?<\/g>/) || [''])[0];
check('§6 ★★ NAMED, THE ARC CARRIES HIS NAME AND READS HIS WAY (her 11:04: once named, the way he chose): read from the wanting, the arrowhead turns to the price; his relations\' strip lists it, `cw-strip 1 loop`, pressable',
  /data-midpoint-child-arc-name="cw-strip"/.test(arc3) && new RegExp(`data-midpoint-child-arc-heads="${towardWanting === 'end' ? 'start' : 'end'}"`).test(arc3) && /data-midpoint-child-relation="cw-strip"/.test(e3) && /cw-strip<\/button> 1 loop/.test(unesc(e3)),
  (arc3.match(/data-midpoint-child-arc-heads="([^"]+)"/) || [])[1]);
S().setRelationView({ siteId, word: 'cw-strip' });
const e4 = render();
check('§6 ★ PRESSED, A RELATION DRAWS ITS PAIRS LIT and its card reads each loop from his chosen role: `cw-strip · a relation of the child, on 1 loop` · `(the wanting is the case as the obtaining) cw-strip (the price is the case as the instituted)`',
  /data-midpoint-child-arc-lit="true"/.test(e4) && /data-midpoint-child-relation-card="cw-strip"/.test(e4) && unesc(e4).includes('(the wanting is the case as the obtaining) cw-strip (the price is the case as the instituted)'),
  textsOf(e4, 'data-midpoint-child-relation-card')[0]);
S().sayLoop(siteId, leid, otherK, 'b', 'rests on');
S().setRelationView(null);
const e5 = render();
check('§6 ★★ A HOLE IS DRAWN DASHED and its relation\'s name is gone (its loop filled no more)', /data-midpoint-child-arc-state="hole"/.test(e5) && /stroke-dasharray="5 3"/.test(e5) && !/data-midpoint-child-arc-name=/.test(e5) && /the child's relations: <span>none named yet/.test(unesc(e5)));

// ═══ §7 THE REVIEW OF 38925cd (its records lens, each claim put to a skeptic) ═══
console.log('\n----- §7 the review of 38925cd -----');
S().importWorkspace(ws);
S().giveRolePair(edgeOf().id, 'validity', 'possible'); // an IS pair among the roles: its key `x≡y` is written from a corner
{
  const sh = shape(); const e = edgeOf();
  const flipDir = (d) => (d === '←' ? '→' : '←');
  const mirroredEdge = { ...e, vertexIds: [e.vertexIds[1], e.vertexIds[0]], ...(e.identification ? { identification: { roles: e.identification.roles.map(([x, y]) => [y, x]), types: e.identification.types.map(([x, y]) => [y, x]) } } : {}), data: { ...e.data, relatings: (e.data.relatings || []).map((r) => (r[0] === 'IS' || r[0] === '≡' ? [r[0], r[2], r[1], r[3]] : [r[0], r[2], r[1], r[3], flipDir(r[4] || '→')])) } };
  const mirrored = { ...sh, id: `${sh.id}-mirrored`, edges: sh.edges.map((x) => (x.id === e.id ? mirroredEdge : x)) };
  const A = CL.childLoopsOf(sh, siteId); const B = CL.childLoopsOf(mirrored, siteId);
  const ids = (L) => new Set(L.loops.map((l) => CL.loopIdOf(L, l)));
  const keys = (L, m) => new Set(L.loops.filter((l) => !l.form && l.kind !== 'two').map((l) => CL.loopShapeOf(L, l, m).key));
  const same = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
  const isRole = A.roles.findIndex((r) => r.w === 'IS' || r.w === '≡');
  check('§7 ★★ A LOOP\'S IDENTITY AND ITS SHAPE ARE THE CORNERS\' OWN, NEVER THE EDGE\'S WALK (the review: a dissection may carry the edge walked the other way, and an IS pair\'s key `x≡y` turns with it): the edge mirrored — its corners exchanged, its relatings and pairs turned — reads the same loops, the same identities and the same shapes (with the modes and without), an IS pair\'s identity included',
    B.flipped !== A.flipped && same(ids(A), ids(B)) && same(keys(A, false), keys(B, false)) && same(keys(A, true), keys(B, true)) && isRole >= 0 && CL.roleIdOf(A, isRole) === CL.roleIdOf(B, B.roles.findIndex((r) => r.w === 'IS' || r.w === '≡')),
    { loops: [A.loops.length, B.loops.length], idsSame: same(ids(A), ids(B)), isRole: isRole >= 0 ? [A.roles[isRole].key, B.roles.find((r) => r.w === 'IS' || r.w === '≡').key, CL.roleIdOf(A, isRole)] : null });
}
// an undo's names are read against the rules now in force
S().importWorkspace(ws);
{
  const L = Lnow(); const l = L.loops.find((x) => x.kind === 'four' && !x.form); const id = CL.loopIdOf(L, l);
  const d = CL.diagonalsOf(L, l); const s1 = CL.roleIdOf(L, d[0].from === 'i' ? l.i : l.j); const s2 = CL.roleIdOf(L, d[1].from === 'i' ? l.i : l.j);
  S().setLoopView(null);
  S().sayLoopRule(siteId, id, s1, 'a', 'cw-by-rule', false); S().sayLoopRule(siteId, id, s1, 'b', 'cw-by-rule', false);
  S().sayLoop(siteId, id, s2, 'a', 0); S().sayLoop(siteId, id, s2, 'b', 0);
  S().nameRelation(siteId, id, 'cw-ruled-name');
  const named = S().relationNames.length;
  S().selectCell(shape().cells.find((c) => c.kind === 'core').id);
  S().applyAmboDissectionToCurrent(); // the snapshot taken here holds the name
  S().withdrawLoopRule(CL.loopShapeOf(L, l, false).key, false); // the rule withdrawn: the loop waits; its names go
  const afterRule = S().relationNames.length;
  S().undoWorkspace();
  check('§7 ★★ AN UNDO NEVER BRINGS BACK A NAME A RULE\'S CHANGE TOOK (the review): a loop filled by a rule and named; a dissection (its snapshot holds the name); the rule withdrawn — the name goes; undone, the name stays gone, since the loop is not filled under the rules now in force',
    named === 1 && afterRule === 0 && S().relationNames.length === 0 && readOf(id).state === 'waits', { named, afterRule, afterUndo: S().relationNames.length });
}
// the file: IS and ≡ not taken by name; a second rule and a second name not taken
S().importWorkspace(ws);
{
  const L = Lnow(); const l = L.loops.find((x) => x.kind === 'four' && !x.form); const id = CL.loopIdOf(L, l);
  const st0 = CL.roleIdOf(L, CL.diagonalsOf(L, l)[0].from === 'i' ? l.i : l.j);
  const sh = CL.loopShapeOf(L, l, false);
  const nt = S().importWorkspace({ ...ws, loopAnswers: [[shape().id, siteId, id, st0, 'a', '≡']], loopRules: [[sh.key, 0, 1, 'a', 'cw-a'], [sh.key, 0, 1, 'a', 'cw-b'], [sh.key, 0, 1, 'b', 'IS']] });
  check('§7 ★★ A FILE\'S IS AND ≡ ARE NOT TAKEN, BY NAME (M4, §251 — the review: they were taken silently, though the act refuses them), and a second rule for one way of one shape is not taken; the rest is',
    S().loopAnswers.length === 0 && J(S().loopRules) === J([[sh.key, 0, 1, 'a', 'cw-a']]) && nt.some((x) => /^an answer "≡" on a loop at Culture: what a way comes to can't be ≡ or IS/.test(x)) && nt.some((x) => /^a rule for a loop's shape coming to "IS": what a way comes to can't be ≡ or IS/.test(x)) && nt.includes("a second rule for one way of a loop's shape"),
    nt);
}
// the reading: one of the loop's two roles, on a filled loop; the log keeps the reading before
S().importWorkspace(ws);
{
  const L = Lnow(); const l = L.loops.find((x) => x.kind === 'four' && !x.form); const id = CL.loopIdOf(L, l);
  const d = CL.diagonalsOf(L, l); const s1 = CL.roleIdOf(L, d[0].from === 'i' ? l.i : l.j); const s2 = CL.roleIdOf(L, d[1].from === 'i' ? l.i : l.j);
  S().sayLoop(siteId, id, s1, 'a', 'cw-w'); S().sayLoop(siteId, id, s1, 'b', 'cw-w'); S().sayLoop(siteId, id, s2, 'a', 0); S().sayLoop(siteId, id, s2, 'b', 0);
  S().nameRelation(siteId, id, 'cw-read');
  const logAt = S().log.length;
  S().readRelationFrom(siteId, id, 'not a role of this loop');
  const ignored = S().log.length === logAt && S().relationNames[0][4] === '';
  S().readRelationFrom(siteId, id, CL.roleIdOf(L, l.j));
  S().readRelationFrom(siteId, id, CL.roleIdOf(L, l.i));
  const last = S().log[S().log.length - 1];
  check('§7 ★ WHICH WAY IT READS IS ONE OF THE LOOP\'S TWO ROLES (the review: any string was taken), and its log line keeps the reading before (`wasFrom`)',
    ignored && last.act === 'relname' && last.from === CL.roleIdOf(L, l.i) && last.wasFrom === CL.roleIdOf(L, l.j), { ignored, last });
}

// the review's meaning lens: rules go with a corner's cast and with a new solid; the tension read by the house's bar reader; a three-sided agreement in the relating's way
S().importWorkspace(ws);
{
  const L = Lnow(); const l = L.loops.find((x) => x.kind === 'four' && !x.form); const id = CL.loopIdOf(L, l);
  const st0 = CL.roleIdOf(L, CL.diagonalsOf(L, l)[0].from === 'i' ? l.i : l.j);
  S().sayLoopRule(siteId, id, st0, 'a', 'cw-cast-rule', false);
  const before = S().loopRules.length;
  S().selectVertex(V);
  const cast0 = shape().vertices[V].data.cast;
  S().updateSelectedVertexData({ cast: { ...cast0, roles: cast0.roles.map((r) => ({ ...r })) } }); // the same cast loaded again: its space unchanged, its rules stay
  const afterSame = S().loopRules.length;
  S().updateSelectedVertexData({ cast: { ...cast0, relations: cast0.relations.slice(1) } }); // a changed cast: the resolver hands another space
  const afterCast = S().loopRules.length;
  S().sayLoopRule(siteId, id, st0, 'a', 'cw-cast-rule', false);
  S().resetWorkspace();
  check('§7 ★★ A LOOP RULE GOES WITH THE CASTS IT NAMES (the review: a rule\'s key names each cast by the corner holding it, and a corner\'s id outlives its cast): read through the resolver, the same cast loaded again keeps them; a changed cast drops the rules keyed on its words; a reset starts with none (its corners hold new casts though their ids recur)',
    before === 1 && afterSame === 1 && afterCast === 0 && S().loopRules.length === 0, { before, afterSame, afterCast, afterReset: S().loopRules.length });
}
{
  const lib = fs.readFileSync(path.join(repoRoot, 'src/lib/childLoops.ts'), 'utf8'); const sort = fs.readFileSync(path.join(repoRoot, 'src/lib/sorting.ts'), 'utf8');
  check('§7 ★ ONE BAR READER (the review: the tension matched a bar by word and cell alone): a loop\'s tension reads the edge\'s bars through the house\'s reader — any spelling, a declared converse\'s included, in the word\'s own direction on the edge — the reader the sorting\'s own bar check delegates to; and a three-sided loop agrees only on the relating\'s word read the relating\'s way',
    /barred: \(x, y, w\) => barredOn\(bars, instances, facts, w, x, y, readsFromY\(w\) \? AGAINST : ALONG\)/.test(lib) && /return barredOn\(sorting\.bars, sorting\.instances, facts, w, x, y, dir\);/.test(sort) && /asked === itself && sameWay/.test(lib));
}

// ═══ §8 THROUGH A PAIR (ADR 0031 §9.45, claims §362 — Culture holds no pair among its roles, so this witness makes one) ═══
console.log('\n----- §8 through a pair -----');
S().importWorkspace(ws);
S().giveRolePair(edgeOf().id, 'validity', 'possible');
{
  const L = Lnow();
  const k = L.roles.findIndex((r) => r.key === 'validity≡possible');
  const mine = L.loops.filter((l) => (l.i === k || l.j === k) && !l.form && l.kind !== 'two');
  const reads = mine.map((l) => ({ l, r: CL.loopReadingFor(L, l, CL.loopRecordsFor(shape(), siteId, L, S().loopAnswers, S().loopRules, { converses: S().converses, opaque: S().opaque })) }));
  const first = reads[0];
  const d0 = first ? first.r.diagonals[0] : null;
  const viaPair = reads.flatMap((x) => x.r.diagonals.flatMap((d) => [d.a, d.b])).find((v) => v.by === 'pair') || null; // a way made of the pair and a parent's say, wherever it stands
  const refused = first ? S().sayLoop(siteId, CL.loopIdOf(L, first.l), d0.start, d0.a.by === 'pair' ? 'b' : 'a', 'cw-never') : null;
  check('§8 ★★ A LOOP THROUGH A PAIR IS NEVER ASKED (§9.45): `validity ≡ possible` paired — each of its closed loops is through the pair, every diagonal read `pair` (form, empty), the loop\'s state `pair`; a way made of the pair and a parent\'s say reads that say carried across the pair (its word, no answer); the store refuses an answer on it by name; the pairs count it apart',
    k >= 0 && mine.length > 0 && reads.every((x) => x.r.state === 'pair' && x.r.diagonals.every((d) => d.reading === 'pair')) && !!viaPair && typeof viaPair.value === 'string' && refused === 'this way of this loop is not asked here' && L.pairs.throughPair > 0 && S().loopAnswers.length === 0,
    { loops: mine.length, viaPair, refused, throughPair: L.pairs.throughPair });
  S().setChildView({ siteId, key: 'validity≡possible', scale: null });
  S().setLoopView({ siteId, key: 'validity≡possible', at: 0, scope: 'loop', modes: false, shown: ['pair'] });
  const h = render();
  const plain = unesc(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  check('§8 ★★ ON THE CARD, LISTED APART: `through a pair: N loops with M roles, never asked · hide`, each loop with its diagonals — the way across the pair `reads across the pair: …`, the other `is not asked` — and no answer field for them; the concept\'s counts name them (`· N through a pair`)',
    new RegExp(`through a pair: ${mine.length} loops? with \\d+ roles?, never asked · hide`).test(plain) && /reads across the pair: /.test(plain) && /is not asked/.test(plain) && !/data-child-loop-field=/.test(h.split('data-child-loops-pair=')[1] || '') && new RegExp(`· ${reads.length} through a pair`).test(textsOf(h, 'data-midpoint-child-counts')[0] || ''),
    { counts: textsOf(h, 'data-midpoint-child-counts')[0] });
}

// ═══ §5 BY CONSTRUCTION ═══
const libSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/childLoops.ts'), 'utf8');
const cardSrc = fs.readFileSync(path.join(repoRoot, 'src/components/ChildLoopCard.tsx'), 'utf8');
check('§5 ★ THE PAGE PROPOSES NOTHING AND KEYS NOTHING BY THE COLUMN: the answer fields open empty (no answer stands until he gives it); the records key a loop by its roles\' own keys and a rule by the shape\'s normal form (`loopIdOf`, `loopShapeOf`), never by the column\'s indices',
  /placeholder="a word"/.test(cardSrc) && !/value=\{[^}]*\?\?\s*'[a-z]/.test(cardSrc) && /export function loopIdOf/.test(libSrc) && !/loopAnswers[^\n]*loop\.i\b/.test(fs.readFileSync(path.join(repoRoot, 'src/store/geometryStore.ts'), 'utf8')));

console.log('');
if (failures === 0) console.log('DIAGNOSE-THE-CHILDS-LOOP-CARD: ALL PASS — on Culture, the diagonals agree, differ, empty, refuse and hold a tension as ruled, the loops fill, hole and settle; a rule binds the shape in its normal form across mirrored loops, the loop\'s own answer before it; the records logged, gone with their loop, on the file, the undo and the dissection; the card in the designer\'s words');
else { console.log(`DIAGNOSE-THE-CHILDS-LOOP-CARD: ${failures} FAIL`); process.exitCode = 1; }
