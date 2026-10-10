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
check('§4 ★★ ANSWERED, THE CARD READS IT (her 11:17 §4–§5): `comes to “the price is directed at the obtaining” · withdraw`; the block\'s reading `· they agree: the price is directed at the obtaining` and `· both come to nothing`; the state, every question in order before the relation (her 15:12), `filled: from the price to the obtaining, both ways come to “the price is directed at the obtaining”; from the wanting to the instituted, both come to nothing. A relation of the child between … .`, then `name it`',
  answers[0] === 'comes to “the price is directed at the obtaining” · withdraw' && textsOf(h2, 'data-child-loop-diagonal-reading').includes('· they agree: the price is directed at the obtaining') && textsOf(h2, 'data-child-loop-diagonal-reading').includes('· both come to nothing') &&
    /^filled: from the price to the obtaining, both ways come to “the price is directed at the obtaining”; from the wanting to the instituted, both come to nothing\. A relation of the child between .+\.$/.test(state) && /data-child-relation-name-it="true"/.test(h2),
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
check('§6 ★★ THE CONCEPT\'S COUNTS (her 10:56 and 11:24): with nothing said, `0 relations, in 18 pieces · loops: 71 waiting · 62 across a refusal · two words at one pair: 3` (every zero after `loops:` left out: the designer at 17:46 and 17:55) — every number from the readers; no arc drawn (nothing filled, no hole, no role chosen); his relations `none named yet`',
  counts0 === '0 relations, in 18 pieces · loops: 71 waiting · 62 across a refusal · two words at one pair: 3' && !/data-midpoint-child-arc=/.test(e0) && /the child's relations: <span>none named yet/.test(unesc(e0)),
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
check('§6 ★★ A FILLED LOOP IS DRAWN, SOLID, WHETHER OR NOT A ROLE IS CHOSEN, its arrowhead at the role both parents\' words run toward (her 11:04 on §9.41 (1): `presupposes` from the price\'s end at Value, `presupposes` from the instituted\'s at Fact — so toward the wanting); its hover says what it is, naming its question (her 15:12: `filled: from the price to the obtaining, both ways come to “the price is directed at the obtaining”`); the head counts it — `1 relation, in 17 pieces · loops: 70 waiting · 1 filled …`',
  /data-midpoint-child-arc-state="filled"/.test(arc2) && new RegExp(`data-midpoint-child-arc-heads="${towardWanting}"`).test(arc2) && !/stroke-dasharray/.test(arc2.split('<path')[1] || '') &&
    title2.startsWith('(the price is the case as the instituted) and (the wanting is the case as the obtaining)') && title2.includes('filled: from the price to the obtaining, both ways come to “the price is directed at the obtaining”') &&
    (textsOf(e2, 'data-midpoint-child-counts')[0] || '') === '1 relation, in 17 pieces · loops: 70 waiting · 1 filled · 62 across a refusal · two words at one pair: 3',
  { heads: (arc2.match(/data-midpoint-child-arc-heads="([^"]+)"/) || [])[1], title: title2.slice(0, 200), counts: textsOf(e2, 'data-midpoint-child-counts')[0] });
check('§6 ★★ D-5 — THE TRACES\' COUNTS SAY WHICH RECORD EACH READS (the mothership\'s 17:46, its question 2; the designer\'s words of 17:55): with the loop filled (unnamed), the child\'s own line counts its relatings and its FILLED relation — `Culture: 18 relatings · 1 relation` — and the parents\' line, named as theirs, the words and tuples read at its ends — `Value\'s and Fact\'s relations, read at its ends: N words · M tuples`',
  (textsOf(e2, 'data-midpoint-counts')[0] || '') === 'Culture: 18 relatings · 1 relation' && /^Value's and Fact's relations, read at its ends: \d+ words · \d+ tuples$/.test(textsOf(e2, 'data-midpoint-counts-read')[0] || ''),
  { counts: textsOf(e2, 'data-midpoint-counts')[0], read: textsOf(e2, 'data-midpoint-counts-read')[0] });
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

// ═══ §9 THE CHILD AS A PARENT (slice 2 · F, ADR 0031 §9.40–§9.41 and §9.46 (3); the mothership's 15:06 — condition 1 by construction, condition 2 by witness
// — and its 15:08 on the readers that take the child: the next child, the sorting's passages through a born light and the configuration, the columns; the
// review of b3ec97d) ═══
console.log('\n----- §9 the child as a parent -----');
const IS_ = req('src/lib/instanceSpace.ts');
const { sortingOf } = req('src/lib/sorting.ts');
const { CastInsidePanel } = req('src/components/CastInsideDiagram.tsx');
const { childRecordsOf } = req('src/store/geometryStore.ts');
const { AGAINST } = req('src/lib/relatings.ts');
S().importWorkspace(ws);
{
  const rec = () => childRecordsOf(S());
  const L = CL.childLoopsCached(shape(), siteId, rec());
  const P = L.loops.find((l) => l.kind === 'four' && !l.form && !l.pair);
  const pid = CL.loopIdOf(L, P); const pi = L.roles[P.i].key; const pj = L.roles[P.j].key;
  const fill = () => { S().sayLoop(siteId, pid, pi, 'a', 'cw-agreed'); S().sayLoop(siteId, pid, pi, 'b', 'cw-agreed'); S().sayLoop(siteId, pid, pj, 'a', 0); S().sayLoop(siteId, pid, pj, 'b', 0); };
  // §9.48 (Q1): a filled relation's type is its KIND — a normal form in its own namespace, never a word — so a reader is asked for the arc between the price
  // loop's two roles, whatever it is named
  const arcOf = (sp) => (sp ? sp.relations.filter((r) => r.type.startsWith('type:') && r.terms.includes(pi) && r.terms.includes(pj)).length : -1);
  const typeOf = (sp) => (sp ? (sp.relations.find((r) => r.terms.includes(pi) && r.terms.includes(pj)) || {}).type : undefined);
  const stateP = () => { const L1 = CL.childLoopsCached(shape(), siteId, rec()); const lp = L1.loops.find((l) => CL.loopIdOf(L1, l) === pid); return lp ? CL.loopReadingFor(L1, lp, CL.loopRecordsFor(shape(), siteId, L1, S().loopAnswers, S().loopRules, { converses: S().converses, opaque: S().opaque })).state : null; };
  // condition 1 — the thin cast, and D4's record READ under its own names
  const thin0 = IS_.childSpaceOf(shape(), siteId);
  const recNothing = IS_.childSpaceOf(shape(), siteId, { records: rec() });
  const d4 = IS_.instanceSpaceOf(shape(), edgeOf());
  check('§9 ★★ THE CHILD AS A CAST IS THIN, BY CONSTRUCTION (condition 1): read without his records Culture is its relatings and no relation — `relations` and `signature` empty; D4\'s pulled-back record stays READ under its own names (`record`, `words`), never the child\'s relations; read with his records but nothing filled, thin too',
    thin0.roles.length === L.roles.length && thin0.relations.length === 0 && thin0.signature.length === 0 && d4.space.relations.length === 0 && d4.record.length > 0 && d4.words.length > 0 && recNothing.relations.length === 0,
    { roles: thin0.roles.length, d4: [d4.record.length, d4.words.length] });
  // the configuration's light: Culture at the face Value · Value–Meaning · Culture, one saying from its role `pi` at Value's `price`
  const face = shape().faces.find((f) => f.vertexIds.length === 3 && f.vertexIds.includes(siteId) && f.vertexIds.includes(V) && f.vertexIds.some((v) => shape().vertices[v]?.data?.label === 'Value–Meaning'));
  const VM = face.vertexIds.find((v) => v !== siteId && v !== V);
  const said = S().giveAltitudeSaying(face.id, siteId, V, pi, 'cw-at', 'price', '+');
  const eVM = () => shape().edges.find((e) => e.vertexIds.includes(V) && e.vertexIds.includes(VM));
  const cutOf = (opts) => sortingOf(shape(), eVM(), opts).views.find((w) => w.view === siteId).altitude.cut;
  // the panel reads props only (the drawing imports no store): its mount on the Ambo hands it his records from the store's one source
  const panel = (inline, threaded = true) => renderToString(React.createElement(CastInsidePanel, { shape: shape(), vertexId: siteId, inline, ...(threaded ? { records: rec() } : {}) })).replace(/<!-- -->/g, '');
  const mountSrc = fs.readFileSync(path.join(repoRoot, 'src/components/MidpointSurface.tsx'), 'utf8');
  const mountThreads = /const childRecords = childRecordsOf\(useGeometryStore\.getState\(\)\);\s*if \(view\) \{/.test(mountSrc) && /<CastInsidePanel shape=\{shape\} vertexId=\{vertexId\} records=\{childRecords\} \/>/.test(mountSrc);
  // the medium is handed his records by its one mount (the sorting's passages and the configuration read through it)
  const mediumThreads = /const mediumOptions = useMemo\(\(\) => \(\{ records: childRecords \}\), \[childRecords\]\);/.test(mountSrc) && /const mediumProps = \{ shape, edge: sourceEdge, siteId: site\.siteId, la, lb, options: mediumOptions, /.test(mountSrc);
  const arcOnPanel = (h, w = 'cw-rel') => new RegExp(`data-inside-arc="${w}\\|`).test(h); // a named arc carries its name; an unnamed one no label (`""`)
  const reads = () => ({ child: arcOf(IS_.childSpaceOf(shape(), siteId, { records: rec() })), cut: cutOf({ records: rec() }), column: arcOf(IS_.columnSpaceOf(shape(), siteId, { records: rec() })), panel: arcOnPanel(panel(false)) });
  const before = reads();
  fill();
  const unnamed = { state: stateP(), relations: IS_.childSpaceOf(shape(), siteId, { records: rec() }).relations.length, arc: arcOf(IS_.childSpaceOf(shape(), siteId, { records: rec() })), type: typeOf(IS_.childSpaceOf(shape(), siteId, { records: rec() })), cut: cutOf({ records: rec() }), panelNoLabel: arcOnPanel(panel(false), ''), panelNamed: arcOnPanel(panel(false)) };
  const reserved = S().nameRelation(siteId, pid, 'IS');
  const reservedTaken = S().relationNames.length;
  const named = S().nameRelation(siteId, pid, 'cw-rel');
  const namedType = typeOf(IS_.childSpaceOf(shape(), siteId, { records: rec() }));
  const filled = { ...reads(), thin: arcOf(IS_.childSpaceOf(shape(), siteId)), cutThin: cutOf({}), columnThin: arcOf(IS_.columnSpaceOf(shape(), siteId)), panelThin: arcOnPanel(panel(false, false)), lifted: IS_.liftedColumnOf(shape(), siteId).relations.length };
  S().withdrawLoopSay(siteId, pid, pi, 'a');
  const withdrawn = { ...reads(), names: S().relationNames.length };
  check('§9 ★★ EVERY FILLED RELATION CROSSES, NAMED OR NOT (§9.48 Q1, claims §369; `cbad099`\'s "only once named" withdrawn): Culture\'s price loop filled and unnamed is ONE arc of the child as a parent between its two roles, its type the loop\'s KIND (a normal form, never shown) — never the diagonal\'s agreed word `cw-agreed`; the configuration counts it (cut 1) and the panel draws it with no label (`data-inside-arc=""`); IS refused as a relation\'s name (M4), nothing recorded',
    unnamed.state === 'filled' && unnamed.relations === 1 && unnamed.arc === 1 && typeof unnamed.type === 'string' && unnamed.type.startsWith('type:') && !unnamed.type.includes('cw-agreed') && unnamed.cut === 1 && unnamed.panelNoLabel && !unnamed.panelNamed && reserved === "a relation's name can't be ≡ or IS: two roles are made one by pairing them, not by naming a relation" && reservedTaken === 0,
    { unnamed, reserved });
  check('§9 ★★ A FILLED LOOP IS AN ARC OF THE CHILD AS A PARENT ONLY WHILE IT IS FILLED (§9.41, §9.48; condition 2, each reader with its positive control): named `cw-rel` — its type unchanged (identity is the kind, never the spelling), the panel\'s arc now labelled `cw-rel` — the CONFIGURATION through the sorting (the light Culture at Value · Value–Meaning, one saying at `price`: its cut bonds 0 → 1; the medium handed his records by its mount), the COLUMN and the born corner\'s PANEL on the Ambo (its mount handing it his records) each take the arc; withdraw one answer — the loop no longer filled, its name goes (D\'s law) and each reader loses the arc; a reader not threaded his records reads the thin cast (no arc, cut 0) — never D4\'s record',
    said === null && named === null && namedType === unnamed.type && before.cut === 0 && before.column === 0 && !before.panel
      && filled.child === 1 && filled.thin === 0 && filled.cut === 1 && filled.cutThin === 0 && filled.column === 1 && filled.columnThin === 0 && filled.panel && !filled.panelThin && mountThreads && mediumThreads
      && withdrawn.child === 0 && withdrawn.cut === 0 && withdrawn.column === 0 && !withdrawn.panel && withdrawn.names === 0,
    { before, filled, withdrawn, mountThreads, mediumThreads });
  check('§9 ★ THE LIFT KEEPS D4\'S RECORD, READ, AT GENERATION 1 (the Manuscript hop, flagged open by the mothership\'s 15:06; §9.46 (3) moves the identity readers to the child\'s IS-part — not built here): the lifted corner\'s column (`liftedColumnOf`) carries D4\'s entries; the Ambo\'s never do',
    filled.lifted === d4.record.length && filled.lifted > 0, { lifted: filled.lifted, d4: d4.record.length });
  // the lexicon's facts move whether a loop is filled: a converse turning the agreed word into a barred one makes a tension; the name goes with the filling
  fill(); S().nameRelation(siteId, pid, 'cw-rel');
  const L1 = CL.childLoopsCached(shape(), siteId, rec()); const P1 = L1.loops.find((l) => CL.loopIdOf(L1, l) === pid);
  const dA = CL.loopReadingFor(L1, P1, CL.loopRecordsFor(shape(), siteId, L1, S().loopAnswers, S().loopRules, { converses: S().converses, opaque: S().opaque })).diagonals.find((d) => d.reading === 'agree');
  const bar = S().giveRelating(edgeOf().id, 'cw-conv', dA.diagonal.start, dA.diagonal.end, '-', AGAINST);
  const conv = S().declareConverse('cw-agreed', 'cw-conv');
  const afterConv = { state: stateP(), names: S().relationNames.length, arc: arcOf(IS_.childSpaceOf(shape(), siteId, { records: rec() })) };
  S().withdrawConverse('cw-agreed');
  const afterWithdraw = { state: stateP(), names: S().relationNames.length };
  check('§9 ★★ THE LEXICON\'S FACTS SETTLE HIS RECORDS (the review of b3ec97d): a bar `cw-conv` at the agreeing diagonal\'s cross cell, then `cw-agreed` declared its converse — the diagonal is a tension, the loop no longer filled, its relation\'s name and arc gone; the converse withdrawn, the loop is filled again and the name stays gone (never back by itself)',
    bar === null && conv === null && afterConv.state !== 'filled' && afterConv.names === 0 && afterConv.arc === 0 && afterWithdraw.state === 'filled' && afterWithdraw.names === 0,
    { afterConv, afterWithdraw });
  S().withdrawRelating(edgeOf().id, 'cw-conv', dA.diagonal.start, dA.diagonal.end, AGAINST);
  // the NEXT CHILD: two relatings on the corner edge Value–Culture, Value's residue dissected — the midpoint of Value and Culture, generation 2; Culture's
  // relation left UNNAMED (§9.48: it crosses as its loop)
  S().withdrawRelationName(siteId, pid);
  const eVC = shape().edges.find((e) => e.vertexIds.includes(V) && e.vertexIds.includes(siteId));
  const pairOf = (c) => (eVC.vertexIds[0] === V ? ['price', c] : [c, 'price']);
  const g1 = S().giveRelating(eVC.id, 'cw-holds', ...pairOf(pi), '+');
  const g2 = S().giveRelating(eVC.id, 'cw-holds', ...pairOf(pj), '+');
  S().selectCell(shape().cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(V)).id);
  S().applyAmboDissectionToCurrent();
  const m2 = Object.values(shape().vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(V) && v.createdBy.sourceVertexIds.includes(siteId)).id;
  const loops2 = (r) => { const Lx = CL.childLoopsCached(shape(), m2, r); return Lx ? Lx.loops.filter((l) => !l.form && l.kind !== 'two' && !l.pair && [l.X, l.Y].some((y) => !y.same && !!y.kind)) : []; };
  const renderAt = (site) => { const sh = shape(); const packet = buildGeneralSitePacketPresenterReport(sh).packets.find((pk) => pk.trace.siteId === site); const st = midpointSiteOf(sh, site, packet ? packet.trace : null); return renderToString(React.createElement(MidpointSurface, { shape: sh, site: st, parents: [spaceOf(sh, st.a), spaceOf(sh, st.b)], resolved: spaceOf(sh, site), refusal: null, remade: null })).replace(/<!-- -->/g, ''); };
  const answers2 = () => S().loopAnswers.filter(([sh, v]) => sh === S().currentShapeId && v === m2).length;
  const at2 = { threaded: loops2(rec()).length, thin: loops2(undefined).length };
  const h2 = renderAt(m2);
  const counts2 = textsOf(h2, 'data-midpoint-child-counts')[0] || '';
  const head2 = textsOf(h2, 'data-midpoint-counts-read')[0] || ''; // D-5: the parents' relations read at its ends, on their own line
  const sides2 = IS_.childSidesOf(shape(), m2, { records: rec() });
  const L2 = CL.childLoopsCached(shape(), m2, rec());
  const l2 = loops2(rec())[0];
  const d2 = l2 ? CL.diagonalsOf(L2, l2).find((d) => !d.a.itself || !d.b.itself) : null;
  const sayOf2 = () => { const Lx = CL.childLoopsCached(shape(), m2, rec()); const lx = Lx && Lx.loops.find((l) => [l.X, l.Y].some((y) => !y.same && !!y.kind)); return lx ? [lx.X, lx.Y].find((q) => !q.same && !!q.kind) : null; };
  const sayAt2 = () => { const y = sayOf2(); return y ? [y.from, y.to] : null; };
  const unnamedSay = sayOf2();
  // the loop card open at the generation-2 midpoint, on a role of the loop resting on Culture's arc: no kind's key anywhere on the page (§9.48: a normal
  // form, never shown); its way prints Culture's say as its loop, unnamed
  const Lc2 = CL.childLoopsCached(shape(), m2, rec()); const lc2 = loops2(rec())[0];
  S().setChildView({ siteId: m2, key: lc2 ? Lc2.roles[lc2.i].key : null, scale: null });
  const h2card = unesc(renderAt(m2).replace(/<[^>]+>/g, ' ')); // what the page PRINTS (a loop's identity rides a data attribute, never shown)
  S().setChildView(null);
  check('§9 ★★ NO KIND\'S KEY ON THE PAGE (§9.48 Q1: its key is a normal form, never shown; the designer\'s 18:43 §1): the loop card open at the midpoint of Value and Culture prints Culture\'s say as its loop, unnamed (`… unnamed, through Value\'s …`), and nowhere on the page is a `kind:` key',
    !!lc2 && /, unnamed, through Value's /.test(h2card) && !/kind:|type:/.test(h2card), { card: !!lc2, unnamed: /, unnamed, through Value's /.test(h2card), key: [...h2card.matchAll(/.{0,160}(?:kind|type):.{0,40}/g)].map((m) => m[0].replace(/\s+/g, ' ')).slice(0, 3) });
  const said2 = l2 && d2 ? S().sayLoop(m2, CL.loopIdOf(L2, l2), CL.roleIdOf(L2, d2.from === 'i' ? l2.i : l2.j), d2.a.itself ? 'b' : 'a', 'cw-next') : 'none';
  const stood = answers2();
  check('§9 ★★ THE NEXT CHILD RESTS ON THE ARC, NAMED OR NOT (§9.48 Q1; the next generation\'s loops on the generation before\'s relations, never D4\'s): at the midpoint of Value and Culture (generation 2) the loop whose Culture say is the price loop\'s arc stands read with his records, its say printed as its loop, unnamed, in the designer\'s words (`… is related to …, unnamed, through Value\'s … and Fact\'s …`, never its key) — on the page its counts read ONE loop waiting, and the head counts the parents\' relations read at its ends with his records (its one tuple, Culture\'s arc); unthreaded the loop is not there (thin: no say from Culture); an answer on it is taken',
    g1 === null && g2 === null && at2.threaded === 1 && at2.thin === 0 && !!unnamedSay && /^.+ (is related to .+, unnamed, through Value's .+ and Fact's .+|and .+ are related, unnamed, through Value's .+ one way and Fact's .+ the other)$/.test(unnamedSay.words || '') && !(unnamedSay.words || '').includes('kind:') && /loops: 1 waiting/.test(counts2) && sides2.relations.length === 1 && new RegExp(`· ${sides2.relations.length} tuple\\b`).test(head2) && said2 === null && stood === 1,
    { at2, counts2, head2, said2, stood, say: unnamedSay && unnamedSay.words });
  // withdraw the arc's answer one generation down: the loop resting on it goes, and takes his answer with it (D's law, settled); said again and named
  // again, the loop stands again — his answer on it never comes back by itself
  S().withdrawLoopSay(siteId, pid, pi, 'a');
  const gone = { loops: loops2(rec()).length, answers: answers2(), names: S().relationNames.filter(([sh]) => sh === S().currentShapeId).length };
  S().sayLoop(siteId, pid, pi, 'a', 'cw-agreed');
  const back = { loops: loops2(rec()).length, answers: answers2() };
  check('§9 ★★ A LOOP GONE TAKES HIS ANSWERS, AT ANY GENERATION (D\'s law, settled — condition 2\'s withdraw arm one generation down; §9.48 Q3 turns it into a refusal, built next): Culture\'s answer withdrawn, the generation-2 loop resting on its arc goes and his answer on it with it; said again, the loop stands again and waits — his answer never comes back by itself',
    gone.loops === 0 && gone.answers === 0 && back.loops === 1 && back.answers === 0, { gone, back });
  if (l2 && d2) S().sayLoop(m2, CL.loopIdOf(L2, l2), CL.roleIdOf(L2, d2.from === 'i' ? l2.i : l2.j), d2.a.itself ? 'b' : 'a', 'cw-next');
  // a cast edited: a rule keyed on its words goes, and the loop it filled with it — settled against the rules AFTER the act
  const ruleOn = (() => { const L3 = CL.childLoopsCached(shape(), siteId, rec()); const P3 = L3.loops.find((l) => CL.loopIdOf(L3, l) === pid); const r3 = CL.roleIdOf(L3, P3.i); S().withdrawLoopSay(siteId, pid, r3, 'a'); S().sayLoopRule(siteId, pid, r3, 'a', 'cw-agreed', false); S().nameRelation(siteId, pid, 'cw-rel'); return { state: stateP(), loops: loops2(rec()).length }; })();
  if (l2 && d2) S().sayLoop(m2, CL.loopIdOf(CL.childLoopsCached(shape(), m2, rec()), loops2(rec())[0]), CL.roleIdOf(L2, d2.from === 'i' ? l2.i : l2.j), d2.a.itself ? 'b' : 'a', 'cw-next');
  const beforeEdit = { answers: answers2(), rules: S().loopRules.length };
  S().selectVertex(V);
  const patched = JSON.parse(JSON.stringify(shape().vertices[V].data.cast));
  patched.roles[patched.roles.length - 1].label = `${patched.roles[patched.roles.length - 1].label || patched.roles[patched.roles.length - 1].id} (re-worded)`;
  S().updateSelectedVertexData({ cast: patched });
  const afterEdit = { rules: S().loopRules.length, state: stateP(), loops: loops2(rec()).length, answers: answers2() };
  S().sayLoop(siteId, pid, CL.roleIdOf(CL.childLoopsCached(shape(), siteId, rec()), P.i), 'a', 'cw-agreed'); S().nameRelation(siteId, pid, 'cw-rel');
  const afterSaid = { state: stateP(), loops: loops2(rec()).length, answers: answers2() };
  check('§9 ★★ A CAST EDITED SETTLES AGAINST THE RULES AFTER THE ACT (the review of b3ec97d): one way of the price loop set by a rule, the loop named and a generation-2 answer resting on it; Value\'s cast re-worded — its rules go, the loop waits, the generation-2 loop and his answer on it go; said and named again, the answer stays gone',
    ruleOn.state === 'filled' && ruleOn.loops === 1 && beforeEdit.answers === 1 && beforeEdit.rules === 1 && afterEdit.rules === 0 && afterEdit.state !== 'filled' && afterEdit.loops === 0 && afterEdit.answers === 0 && afterSaid.state === 'filled' && afterSaid.loops === 1 && afterSaid.answers === 0,
    { ruleOn, beforeEdit, afterEdit, afterSaid });
  // G — at the next generation a relating that is a role of an end reads by his NAME, where he gave one — in the term reader and in a born parent's say;
  // naming designates only (the loop stands)
  const loopsBefore = loops2(rec()).length;
  const namedRole = S().nameRole(siteId, pi, 'cw-pricing');
  const h3 = renderAt(m2);
  const word3 = IS_.termWordsOf(shape(), siteId, pi, { records: rec() });
  const word3thin = IS_.termWordsOf(shape(), siteId, pi);
  const say3 = sayAt2();
  check('§9 ★★ G — THE NAME WHERE IT SHOWS (the designer\'s 09:03 §3; the review of b3ec97d): Culture\'s role named `cw-pricing`; at the generation after, the term reader reads it by that name (read with his records; without them its sentence), a born parent\'s SAY prints its end by that name too (never its key), and the page at the midpoint of Value and Culture prints it; the name designates only — the loop resting on Culture stands',
    namedRole === null && word3 === 'cw-pricing' && word3thin !== 'cw-pricing' && !!say3 && say3.includes('cw-pricing') && !say3.includes(pi) && /cw-pricing/.test(unesc(h3)) && loops2(rec()).length === loopsBefore && loopsBefore === 1,
    { word3, word3thin, say3 });
  // §9.48 (Q3): identity is the kind, never the spelling — a plain rename changes nothing at the next generation; the say prints the new name
  if (l2 && d2) S().sayLoop(m2, CL.loopIdOf(CL.childLoopsCached(shape(), m2, rec()), loops2(rec())[0]), CL.roleIdOf(L2, d2.from === 'i' ? l2.i : l2.j), d2.a.itself ? 'b' : 'a', 'cw-next');
  const answersBefore = answers2();
  const typeBefore = typeOf(IS_.childSpaceOf(shape(), siteId, { records: rec() }));
  const renamed = S().nameRelation(siteId, pid, 'cw-rel2');
  const after = { type: typeOf(IS_.childSpaceOf(shape(), siteId, { records: rec() })), loops: loops2(rec()).length, answers: answers2(), say: (sayOf2() || {}).words };
  check('§9 ★★ A PLAIN RENAME IS INERT (§9.48 Q3): Culture\'s relation renamed `cw-rel2` — its type (the kind) unchanged, the generation-2 loop resting on it the same loop, his answer on it kept; only the say\'s printed word changes (`… cw-rel2 …`)',
    renamed === null && after.type === typeBefore && after.loops === 1 && answersBefore === 1 && after.answers === 1 && / cw-rel2 /.test(after.say || ''), { typeBefore, after });
  // one arc, never two, where the parents' words run opposite ways
  {
    const Lc = CL.childLoopsCached(shape(), siteId, rec());
    const crossed = Lc.loops.find((l) => l.kind === 'four' && !l.form && !l.pair && !l.X.same && !l.Y.same && l.X.fwd !== l.Y.fwd && CL.loopIdOf(Lc, l) !== pid);
    const cid = crossed ? CL.loopIdOf(Lc, crossed) : null;
    const ci = crossed ? Lc.roles[crossed.i].key : null; const cj = crossed ? Lc.roles[crossed.j].key : null;
    if (crossed) { S().sayLoop(siteId, cid, ci, 'a', 'cw-u'); S().sayLoop(siteId, cid, ci, 'b', 'cw-u'); S().sayLoop(siteId, cid, cj, 'a', 0); S().sayLoop(siteId, cid, cj, 'b', 0); }
    const arcsC = crossed ? CL.childArcDetailsOf(shape(), siteId, { records: rec() }).filter((a) => a.loopId === cid) : [];
    // its own kind's relations between its two roles (the price loop's arc may join the same two roles: another kind, another relation)
    const relsC = crossed && arcsC[0] ? IS_.childSpaceOf(shape(), siteId, { records: rec() }).relations.filter((r) => r.type === arcsC[0].type && r.terms.includes(ci) && r.terms.includes(cj)) : [];
    check('§9 ★★ CROSSED DIRECTIONS ARE ONE ARC, NEVER TWO (§9.48 Q1, §9.41 (1)): a loop of Culture whose parents\' words run opposite ways, filled — one arc between its two roles, with no direction of its own (`undirected`), one relation of the child, never a pair of arcs read as a symmetric relation',
      !!crossed && arcsC.length === 1 && arcsC[0].undirected === true && relsC.length === 1, { found: !!crossed, arcs: arcsC.map((a) => [a.undirected, a.terms]), rels: relsC.length });
  }
  // §9.48 · B2 — IDENTITY IS THE KIND: a name is kept on its loop's kind (one word to one or more kinds of one child); a join makes one type, a part two
  {
    const Lk = CL.childLoopsCached(shape(), siteId, rec());
    const Pk = Lk.loops.find((l) => CL.loopIdOf(Lk, l) === pid);
    const kindP = CL.kindKeyOf(Lk, Pk);
    const row = S().relationNames.find(([sh, v]) => sh === S().currentShapeId && v === siteId);
    // a second loop of the price loop's own kind, filled: it carries the name already (the name is the kind's)
    const twin = Lk.loops.find((l) => l !== Pk && !l.form && !l.pair && l.kind !== 'two' && CL.kindKeyOf(Lk, l) === kindP);
    const tid = twin ? CL.loopIdOf(Lk, twin) : null; const ti = twin ? Lk.roles[twin.i].key : null; const tj = twin ? Lk.roles[twin.j].key : null;
    if (twin) { S().sayLoop(siteId, tid, ti, 'a', 'cw-agreed'); S().sayLoop(siteId, tid, ti, 'b', 'cw-agreed'); S().sayLoop(siteId, tid, tj, 'a', 0); S().sayLoop(siteId, tid, tj, 'b', 0); }
    const arcsNow = () => CL.childArcDetailsOf(shape(), siteId, { records: rec() });
    const twinArc = twin ? arcsNow().find((a) => a.loopId === tid) : null;
    const priceArc = () => arcsNow().find((a) => a.loopId === pid);
    check('§9 ★★ B2 — A NAME IS KEPT ON ITS KIND (§9.48 Q3: one word to one or more kinds of one child): the price loop\'s name `cw-rel2` is recorded on its KIND (`kind:…`, never the loop), and a second loop of that same kind, filled afterwards, carries the name already — one relation type, two arcs',
      !!row && row[2] === kindP && row[3] === 'cw-rel2' && !!twinArc && twinArc.name === 'cw-rel2' && twinArc.type === priceArc().type,
      { key: row && row[2].slice(0, 12), twin: !!twin, twinName: twinArc && twinArc.name });
    // a JOIN: the same word given to a loop of another kind; a PART: that kind renamed apart again — the next generation's loop and his answer on it untouched
    const other = Lk.loops.find((l) => !l.form && !l.pair && l.kind !== 'two' && CL.kindKeyOf(Lk, l) !== kindP && CL.loopIdOf(Lk, l) !== CL.loopIdOf(Lk, Pk));
    const oid = other ? CL.loopIdOf(Lk, other) : null; const oi = other ? Lk.roles[other.i].key : null; const oj = other ? Lk.roles[other.j].key : null;
    if (other) { S().sayLoop(siteId, oid, oi, 'a', 'cw-agreed'); S().sayLoop(siteId, oid, oi, 'b', 'cw-agreed'); S().sayLoop(siteId, oid, oj, 'a', 0); S().sayLoop(siteId, oid, oj, 'b', 0); }
    const answersK = answers2();
    const joined = other ? S().nameRelation(siteId, oid, 'cw-rel2') : 'none';
    const otherArc = () => arcsNow().find((a) => a.loopId === oid);
    const afterJoin = { same: !!otherArc() && otherArc().type === priceArc().type, kinds: !!otherArc() && otherArc().kind !== priceArc().kind, answers: answers2() };
    const parted = other ? S().nameRelation(siteId, oid, 'cw-apart') : 'none';
    const afterPart = { apart: !!otherArc() && otherArc().type !== priceArc().type, answers: answers2() };
    check('§9 ★★ B2 — A JOIN MAKES ONE TYPE, A PART TWO, AND NEITHER MOVES AN ANSWER (§9.48 Q3): the word `cw-rel2` given to a filled loop of ANOTHER kind joins the two kinds into one relation type of the child (their arcs\' type one, their kinds two); renamed `cw-apart` it parts again; his answer at the next generation stays through both (it rests on the kind)',
      !!other && joined === null && afterJoin.same && afterJoin.kinds && parted === null && afterPart.apart && answersK === afterJoin.answers && answersK === afterPart.answers,
      { other: !!other, afterJoin, afterPart, answersK });
    // a direction given with the name: kept on the kind as its canonical reading's side, the arc turned that way
    const Lr = CL.childLoopsCached(shape(), siteId, rec()); const Pr = Lr.loops.find((l) => CL.loopIdOf(Lr, l) === pid);
    const toward = CL.roleIdOf(Lr, Pr.j);
    S().readRelationFrom(siteId, pid, toward);
    const rowR = S().relationNames.find(([sh, v, k]) => sh === S().currentShapeId && v === siteId && k === kindP);
    const arcR = priceArc();
    check('§9 ★★ B2 — A DIRECTION GIVEN WITH A NAME IS KEPT ON THE KIND (§9.41 (1), §9.48 Q3): read from the price loop\'s second role, the record keeps the kind\'s side (`1` or `2`, never a role\'s key) and the arc runs from that role',
      !!rowR && (rowR[4] === '1' || rowR[4] === '2') && !!arcR && arcR.terms[0] === Lr.roles[Pr.j].key && !arcR.undirected, { side: rowR && rowR[4], terms: arcR && arcR.terms });
    // an older file keeps a relation's name on its LOOP: read back onto the loop's kind; one whose loop is not there NOT TAKEN by name
    const fileK = JSON.parse(JSON.stringify(S().exportWorkspace()));
    fileK.relationNames = [[S().currentShapeId, siteId, pid, 'cw-legacy', ''], [S().currentShapeId, siteId, '["no such loop"]', 'cw-ghost', '']];
    S().importWorkspace(fileK);
    const legacy = S().relationNames.filter(([sh, v]) => sh === S().currentShapeId && v === siteId);
    const ghost = (S().log || []).slice(-12).map((e) => JSON.stringify(e)).join(' ');
    check('§9 ★ B2 — A FILE THAT KEEPS A NAME ON ITS LOOP IS READ BACK ONTO THE KIND: `cw-legacy`, kept on the price loop by an older file, is recorded on that loop\'s kind; a name whose loop is not there is not taken',
      legacy.length === 1 && legacy[0][2] === kindP && legacy[0][3] === 'cw-legacy', { legacy: legacy.map((r) => [r[2].slice(0, 12), r[3]]), ghost: /cw-ghost/.test(ghost) });
  }
}

// ═══ §5 BY CONSTRUCTION ═══
const libSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/childLoops.ts'), 'utf8');
const cardSrc = fs.readFileSync(path.join(repoRoot, 'src/components/ChildLoopCard.tsx'), 'utf8');
check('§5 ★ THE PAGE PROPOSES NOTHING AND KEYS NOTHING BY THE COLUMN: the answer fields open empty (no answer stands until he gives it); the records key a loop by its roles\' own keys and a rule by the shape\'s normal form (`loopIdOf`, `loopShapeOf`), never by the column\'s indices',
  /placeholder="a word"/.test(cardSrc) && !/value=\{[^}]*\?\?\s*'[a-z]/.test(cardSrc) && /export function loopIdOf/.test(libSrc) && !/loopAnswers[^\n]*loop\.i\b/.test(fs.readFileSync(path.join(repoRoot, 'src/store/geometryStore.ts'), 'utf8')));

console.log('');
if (failures === 0) console.log('DIAGNOSE-THE-CHILDS-LOOP-CARD: ALL PASS — on Culture, the diagonals agree, differ, empty, refuse and hold a tension as ruled, the loops fill, hole and settle; a rule binds the shape in its normal form across mirrored loops, the loop\'s own answer before it; the records logged, gone with their loop, on the file, the undo and the dissection; the card in the designer\'s words');
else { console.log(`DIAGNOSE-THE-CHILDS-LOOP-CARD: ${failures} FAIL`); process.exitCode = 1; }
