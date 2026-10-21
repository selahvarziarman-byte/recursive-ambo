#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// THE DEPENDENCE LOGIC — ADR 0031 §9.73 (ratified 10-21 13:16; its ADDENDUM by Arman's Δ163 "stay quiet", 13:47; the mothership's 13:44 and 13:48; the designer's
// 13:42 and 13:50 words; the mothership's 13:35 STAMP, landing (A)). "Cannot be without" is TRANSITIVE and read as CHAINS in the caster's words; one reader of
// foundation per cast; read at the drawing's card (Δ226), at the child's card and at the altitude's end-cell — LINES on demand, never a state, a refusal or an act;
// a cut by silence is NEVER shown (no `met nothing here`, no `none crossed here`, no `not said there`): a foundation shows as the parent's, `crossed as …` where he
// related it, `barred: …` where he barred it, nothing where he said nothing; the count counts the crossed and prints no zero. THE INSTRUMENT SHARES THE CLAIM'S TYPE
// SYSTEM: the reader is RUN on Virgin Land's four v7 casts as she poured them (14:56) and the cards are RENDERED; the researcher's seals (S1) are the acceptance.
// With it, the view's remaining slices (Δ226): the hover's reach on the wires, the child's legs as wiring, the counts, and the designer's 17:50 reason line.
// ═══════════════════════════════════════════════════════════════════════════════
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
const { createSeedShape } = req('src/data/seeds.ts');
const { readCastFile, castSummaryLine, castCounts } = req('src/lib/castLoader.ts');
const { insideOf, dependenceTuplesOf } = req('src/lib/castInside.ts');
const { foundationOf, foundationItemsOf, groupedItems } = req('src/lib/foundation.ts');
const { momentCardOf, RelatingCard } = req('src/components/FoundationCard.tsx');
const { ChildCast } = req('src/components/ChildCast.tsx');
const { MidpointSurface, midpointViewOf } = req('src/components/MidpointSurface.tsx');
const { litWiresOf } = req('src/components/CastInsideDiagram.tsx');
const { configurationAt } = req('src/lib/configuration.ts');
const { spaceOf } = req('src/lib/spaceOf.ts');
const IS_ = req('src/lib/instanceSpace.ts');
const RL = req('src/lib/relatings.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
const unesc = (t) => t.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const text = (html) => unesc(html.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
/** the texts of the spans carrying `attr` — each chunk from its marker to the next marker (nested spans stripped) */
const linesOf = (html, attr) => html.split(new RegExp(`(?=<span ${attr})`)).slice(1).map((chunk) => text(chunk.split(/(?=<span data-dependence-card-line=|<span data-dependence-item=|<span data-dependence-rests-line=|<\/div>)/)[0]));
const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];

console.log('THE DEPENDENCE LOGIC — "cannot be without" transitive, read as chains; the cards\' lines in the designer\'s words; a cut by silence never shown (ADR 0031 §9.73 and its addendum by Δ163)\n');

// ═══ §0 HER FOUR v7 CASTS AS SHE POURED THEM (2026-10-20 14:56; the fixtures refreshed from her folder — the 14:49 copies predated the denial she added) ═══
const P = cast('vl-v7-production.cast.json'); const F = cast('vl-v7-finance.cast.json'); const D = cast('vl-v7-distribution.cast.json'); const C = cast('vl-v7-consumption.cast.json');
const tP = dependenceTuplesOf(P); const tF = dependenceTuplesOf(F); const tD = dependenceTuplesOf(D); const tC = dependenceTuplesOf(C);
const wordsOf = (t) => new Set(t.map((x) => x.word)).size;
check('§0 THE CASTS: Production 12 dependence tuples in 5 words, one denied (`is made of (product, instrument)`); Finance 5 in 3; Distribution 6 in 6; Consumption 6 in 4 — every tuple between two of the cast\'s own roles, in the caster\'s order',
  tP.length === 12 && wordsOf(tP) === 5 && tP.filter((t) => !t.holds).length === 1 && tP[11].word === 'is made of' && tP[11].from === 'product' && tP[11].to === 'instrument'
    && tF.length === 5 && wordsOf(tF) === 3 && tD.length === 6 && wordsOf(tD) === 6 && tC.length === 6 && wordsOf(tC) === 4,
  { P: [tP.length, wordsOf(tP)], F: [tF.length, wordsOf(tF)], D: [tD.length, wordsOf(tD)], C: [tC.length, wordsOf(tC)] });

// ═══ §1 THE READER — the researcher's seal S1 (the instrument's run of 13:10 on the same four casts): each moment's closure ═══
const idOf = (c, label) => c.roles.find((r) => r.label === label).id;
const nameIn = (c) => (id) => c.roles.find((r) => r.id === id)?.label ?? id;
const restsOn = (c, t, label) => foundationOf(t, idOf(c, label)).rests;
const s1 = { working: restsOn(P, tP, 'the working').length, product: restsOn(P, tP, 'the product').length, capacity: restsOn(P, tP, 'the capacity').length, return: restsOn(F, tF, 'the return').length, promise: restsOn(F, tF, 'the promise').length, security: restsOn(F, tF, 'the security').length, entitlement: restsOn(D, tD, 'the entitlement').length, share: restsOn(D, tD, 'the share').length, spending: restsOn(C, tC, 'the spending').length };
check('§1 ★★ S1 — THE CLOSURES (the instrument\'s seal, held): Production\'s working, product and capacity each rest on 6 of its other 8 moments; Finance\'s return on 4, its promise and security on 2 each; Distribution\'s entitlement and share on 2 each; Consumption\'s spending on 4 — transitive across words, itself excluded',
  J(s1) === J({ working: 6, product: 6, capacity: 6, return: 4, promise: 2, security: 2, entitlement: 2, share: 2, spending: 4 }), s1);
const ret = restsOn(F, tF, 'the return');
check('§1 ★★ THE CHAIN IS KEPT, nearest first, through the moment it is reached by: the return rests on the stake and the security directly, on the promise through the security, on the hoard through the security and the promise (`the return is yielded by the security, which rests on the promise, which rests on the hoard`)',
  J(ret.map((f) => [f.id, f.via, f.chain])) === J([['stake', null, ['stake']], ['security', null, ['security']], ['promise', 'security', ['security', 'promise']], ['hoard', 'promise', ['security', 'promise', 'hoard']]]), ret);
const w = foundationOf(tP, 'working'); const pr = foundationOf(tP, 'product');
check('§1 ★★ MUTUAL FOUNDATION IS LAWFUL AND UNMARKED: the working rests on the product and the product on the working — each in the other\'s closure, neither a contradiction, no mark; a denial stops no chain and is kept beside: the product rests on the instrument by one chain (`is made by the working, which requires the instrument`) while the caster denies `is made of (product, instrument)` — the chain stands and the denial is listed where it stands (the direct line, struck)',
  w.rests.some((f) => f.id === 'product') && pr.rests.some((f) => f.id === 'working') && pr.rests.find((f) => f.id === 'instrument')?.via === 'working' && pr.direct.some((d) => d.to === 'instrument' && !d.holds) && pr.direct.filter((d) => d.holds).every((d) => d.to !== 'instrument'),
  { workingRests: w.rests.map((f) => f.id), productRests: pr.rests.map((f) => [f.id, f.via]), productDirect: pr.direct });
// the §9.73 (1) falsifier: withdraw the held `requires (working, instrument)` and the instrument leaves the product's foundation
const without = tP.filter((t) => !(t.word === 'requires' && t.from === 'working' && t.to === 'instrument'));
check('§1 ★★ THE FALSIFIER OF §9.73 (1), run: with the held `requires (working, instrument)` withdrawn the instrument leaves the product\'s foundation (5, not 6), the denial still listed beside',
  foundationOf(without, 'product').rests.length === 5 && !foundationOf(without, 'product').rests.some((f) => f.id === 'instrument') && foundationOf(without, 'product').direct.some((d) => d.to === 'instrument' && !d.holds),
  foundationOf(without, 'product').rests.map((f) => f.id));

// ═══ §2 THE MOMENT CARD (the designer's 13:42 §1), rendered on her Production ═══
const cardP = unesc(renderToString(momentCardOf({ head: 'the product', tuples: tP, id: 'product', nameOf: nameIn(P) })));
const cardLines = (html) => ({ head: text((html.match(/<span data-dependence-card-head="true"[^>]*>[\s\S]*?<\/span>/) || [''])[0]), direct: linesOf(html, 'data-dependence-card-line="direct"'), through: linesOf(html, 'data-dependence-card-line="through"'), dependents: linesOf(html, 'data-dependence-card-line="dependents"') });
const cp = cardLines(cardP);
check('§2 ★★ THE PRODUCT\'S CARD, HER LINES TO THE WORD: `the product` · `cannot be without: is made of the material · has the form of the purpose · is made by the working, the capacity · is made of the instrument` (the last struck) · `through the working: requires the instrument` · `through the capacity: requires the reproduction` · `what cannot be without it: the capacity requires it · the working requires it`; the count 6',
  cp.head === 'the product' && J(cp.direct) === J(['cannot be without: is made of the material · has the form of the purpose · is made by the working, the capacity · is made of the instrument'])
    && J(cp.through) === J(['through the working: requires the instrument', 'through the capacity: requires the reproduction'])
    && J(cp.dependents) === J(['what cannot be without it: the capacity requires it · the working requires it'])
    && /data-dependence-denied="true"[^>]*>is made of the instrument</.test(cardP) && (cardP.match(/data-dependence-denied="true"/g) || []).length === 1 && /data-dependence-rests="6"/.test(cardP),
  cp);
const cardW = unesc(renderToString(momentCardOf({ head: 'the working', tuples: tP, id: 'working', nameOf: nameIn(P) })));
const cw = cardLines(cardW);
check('§2 ★★ THE WORKING\'S CARD (her 15:41 example; §9.73 ADDENDUM (2), the researcher\'s 15:21): `cannot be without: requires the capacity, the material, the instrument, the product · presupposes the purpose` · `through the capacity: requires the reproduction` — six foundations and NO struck item (the product\'s denial of the instrument is the product\'s card\'s alone; a through-line prints held foundations only, and the product reaches nothing new) · `what cannot be without it: the product is made by it`',
  cw.head === 'the working' && J(cw.direct) === J(['cannot be without: requires the capacity, the material, the instrument, the product · presupposes the purpose'])
    && J(cw.through) === J(['through the capacity: requires the reproduction']) && !/data-dependence-denied/.test(cardW) && w.rests.length === 6
    && J(cw.dependents) === J(['what cannot be without it: the product is made by it']), cw);
check('§2 ★★ A MOMENT WITH NO WIRE HAS NO CARD (the card reads the wires; the cooperation and the surplus have none): null, not an empty box',
  momentCardOf({ head: 'the cooperation', tuples: tP, id: 'cooperation', nameOf: nameIn(P) }) === null && momentCardOf({ head: 'the surplus', tuples: tP, id: 'surplus', nameOf: nameIn(P) }) === null);
check('§2 ★ THE GROUPS: one group per word and polarity in the order of first appearance; the `show` items one per dependence, the through items prefixed, a denial its own item',
  J(groupedItems(pr.direct).map((g) => [g.word, g.holds, g.to])) === J([['is made of', true, ['material']], ['has the form of', true, ['purpose']], ['is made by', true, ['working', 'capacity']], ['is made of', false, ['instrument']]])
    && J(foundationItemsOf(tP, 'product').map((x) => [x.via, x.item.word, x.item.to, x.item.holds])) === J([[null, 'is made of', 'material', true], [null, 'has the form of', 'purpose', true], [null, 'is made by', 'working', true], [null, 'is made by', 'capacity', true], [null, 'is made of', 'instrument', false], ['working', 'requires', 'instrument', true], ['capacity', 'requires', 'reproduction', true]]));

// ═══ §3 THE RELATING CARD (the designer's 13:50 under Δ163) — her example built: Production on A, Distribution on B, her old Production–Distribution relatings ═══
let seed = createSeedShape('tetrahedron');
const byLabel = (sh, l) => Object.values(sh.vertices).find((v) => v.data.label === l).id;
const withCast = (sh, id, c, label) => ({ ...sh, vertices: { ...sh.vertices, [id]: { ...sh.vertices[id], data: { ...sh.vertices[id].data, cast: c, label } } } });
const A0 = byLabel(seed, 'A'); const B0 = byLabel(seed, 'B');
seed = withCast(seed, A0, P, 'Production'); seed = withCast(seed, B0, D, 'Distribution');
useGeometryStore.setState({ shapes: { [seed.id]: seed }, shapeOrder: [seed.id], currentShapeId: seed.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], rules: [], converses: [], opaque: [], loopAnswers: [], loopRules: [], relationNames: [], roleNames: [], childView: null, relationView: null, log: [] });
S().applyAmboDissectionToCurrent();
const sh0 = cur();
const Pv = byLabel(sh0, 'Production'); const Dv = byLabel(sh0, 'Distribution');
const mid = Object.values(sh0.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(Pv) && v.createdBy.sourceVertexIds.includes(Dv));
const ePD = edgeBetween(sh0.edges, Pv, Dv);
check('§3 THE RECORD: the seed dissected, the midpoint of Production–Distribution born, the edge kept', !!mid && !!ePD && cur().id !== seed.id, { mid: mid && mid.data.label, edge: !!ePD });
for (const m of ['is drawn from', 'is put to work as', 'is received as']) S().declareMode(m);
/** a relating said from X's role x to Y's role y in w, given as the edge stores it (D13); `sign` − for a bar */
const relate = (X, Y, x, wd, y, sign = '+') => { const ed = edgeBetween(cur().edges, X, Y); const first = ed.vertexIds[0] === X; return S().giveRelating(ed.id, wd, first ? x : y, first ? y : x, sign, first ? RL.ALONG : RL.AGAINST); };
const g0 = relate(Dv, Pv, 'share', 'is drawn from', 'product');
const inst0 = IS_.instancesFrom(cur(), Pv, Dv).find((i) => i.mode === 'is drawn from');
const renderChild = () => { const child = IS_.childSpaceOf(cur(), mid.id); return unesc(renderToString(React.createElement(ChildCast, { shape: cur(), siteId: mid.id, child, litOf: () => ({ lit: false, dim: false }), onHoverRow: () => {} }))); };
useGeometryStore.setState({ childView: { siteId: mid.id, key: inst0.key } });
const h1 = renderChild();
check('§3 ★★ THE CHILD\'S CARD, THE MOMENT CHOSEN, NOTHING ELSE SAID (Δ163): `(the share is drawn from the product)` · `stands on the product (Production) and the share (Distribution)` · `the product (Production) rests on 6 · show` · `the share (Distribution) rests on 2 · show` — NO crossed count (its zero is not printed), no `met nothing here`, no `none crossed`',
  g0 === null && !!inst0 && h1.includes('(the share is drawn from the product)') && text(h1).includes('stands on the product (Production) and the share (Distribution)')
    && linesOf(h1, 'data-dependence-rests-line="product"')[0] === 'the product (Production) rests on 6 · show' && linesOf(h1, 'data-dependence-rests-line="share"')[0] === 'the share (Distribution) rests on 2 · show'
    && !/data-dependence-crossed=/.test(h1) && !/met nothing|none crossed|not said/.test(h1),
  { given: g0, lines: [linesOf(h1, 'data-dependence-rests-line="product"'), linesOf(h1, 'data-dependence-rests-line="share"')] });
const given = [relate(Dv, Pv, 'holding', 'is put to work as', 'material'), relate(Dv, Pv, 'holding', 'is put to work as', 'capacity'), relate(Dv, Pv, 'holding', 'is put to work as', 'instrument'), relate(Pv, Dv, 'reproduction', 'is received as', 'share'), relate(Dv, Pv, 'share', 'is drawn from', 'instrument', '-')];
const h2 = renderChild();
check('§3 ★★ HE RELATES AND BARS — THE COUNT COUNTS THE CROSSED (her 13:50: `Production\'s product rests on 6, 4 crossed here`, `Distribution\'s share rests on 2, 1 crossed here`): `the product (Production) rests on 6 · 4 crossed here · show` · `the share (Distribution) rests on 2 · 1 crossed here · show`, each with its `show`',
  given.every((x) => x === null) && linesOf(h2, 'data-dependence-rests-line="product"')[0] === 'the product (Production) rests on 6 · 4 crossed here · show' && linesOf(h2, 'data-dependence-rests-line="share"')[0] === 'the share (Distribution) rests on 2 · 1 crossed here · show'
    && (h2.match(/data-dependence-show="/g) || []).length === 2,
  { given, lines: [linesOf(h2, 'data-dependence-rests-line="product"'), linesOf(h2, 'data-dependence-rests-line="share"')] });
// the items, whole, as a hover card shows them (it cannot be pressed): the ends built from the record through the one readers, as the surface builds them
const words = (c1, c2, r) => { const wd = r[0] === RL.IS ? RL.IS_GLYPH : r[0]; return RL.dirOf(r) === RL.ALONG ? `(${nameIn(c1)(r[1])} ${wd} ${nameIn(c2)(r[2])})` : `(${nameIn(c2)(r[2])} ${wd} ${nameIn(c1)(r[1])})`; };
const first = ePD.vertexIds[0] === Pv; const cA = first ? P : D; const cB = first ? D : P;
const endOf = (c, id, side) => ({ label: c === P ? 'Production' : 'Distribution', tuples: dependenceTuplesOf(c), id, nameOf: nameIn(c), crossed: (f) => RL.instancesOn(edgeBetween(cur().edges, Pv, Dv)).filter((r) => r[side] === f).map((r) => words(cA, cB, r)), barred: (f) => RL.barsOn(edgeBetween(cur().edges, Pv, Dv)).filter((r) => r[side] === f).map((r) => React.createElement('s', { 'data-bar': r[0] }, words(cA, cB, r))) });
const sideP = first ? 1 : 2; const sideD = first ? 2 : 1;
const hover = unesc(renderToString(React.createElement(RelatingCard, { head: '(the share is drawn from the product)', ends: [endOf(P, 'product', sideP), endOf(D, 'share', sideD)], pressable: false })));
const items = linesOf(hover, 'data-dependence-item=');
check('§3 ★★ `show` LISTS THE FOUNDATIONS AS THE PARENT\'S CARD HAS THEM, A TAIL ONLY WHERE HE ACTED AT THIS EDGE (her 13:50, to the word): `is made of the material · crossed as (the holding is put to work as the material)` · `has the form of the purpose` · `is made by the working` · `is made by the capacity · crossed as (the holding is put to work as the capacity)` · `is made of the instrument` (struck, no tail) · `through the working: requires the instrument · crossed as (the holding is put to work as the instrument) · barred: (the share is drawn from the instrument)` · `through the capacity: requires the reproduction · crossed as (the reproduction is received as the share)`; the share\'s: `is determined by the holding · crossed as (…) · (…) · (…)` · `is a part of the produce`',
  J(items) === J(['is made of the material · crossed as (the holding is put to work as the material)', 'has the form of the purpose', 'is made by the working', 'is made by the capacity · crossed as (the holding is put to work as the capacity)', 'is made of the instrument',
    'through the working: requires the instrument · crossed as (the holding is put to work as the instrument) · barred: (the share is drawn from the instrument)', 'through the capacity: requires the reproduction · crossed as (the reproduction is received as the share)',
    'is determined by the holding · crossed as (the holding is put to work as the material) · (the holding is put to work as the capacity) · (the holding is put to work as the instrument)', 'is a part of the produce'])
    && /data-dependence-item="\|is made of\|instrument"[^>]*><span style="text-decoration:line-through" data-dependence-denied="true">is made of the instrument<\/span><\/span>/.test(hover.replace(/\s+data-/g, ' data-'))
    && !/data-dependence-show=/.test(hover) && !/met nothing|none crossed|not said/.test(hover),
  items);
// the drawing of the edge: the legs are wiring, each column's wires in its channel on its outer side
const view = midpointViewOf(cur(), mid.id);
const surface = view ? unesc(renderToString(React.createElement(MidpointSurface, { shape: cur(), site: view.site, parents: view.parents, resolved: view.resolved, refusal: null, remade: null }))) : '';
const legA = surface.match(/<path data-midpoint-leg="A" d="([^"]+)"/); const legB = surface.match(/<path data-midpoint-leg="B" d="([^"]+)"/);
check('§3 ★★ THE CHILD\'S LEGS ARE WIRING (her 15:41): two square runs `data-midpoint-leg="A|B"` from the midpoint to each concept\'s foot in the wiring\'s ink (slate, 1.2, wordless), drawn before the columns — no grey V (`stroke-stone-600`) remains; each column\'s wires in a channel on its OUTER side (A −1, B +1): Production 12 wires (the denied one its own), Distribution 5',
  !!legA && !!legB && /^M [\d.]+ [\d.]+ L [\d.]+ [\d.]+ Q [\d.]+ [\d.]+ [\d.]+ [\d.]+ L [\d.]+ [\d.]+$/.test(legA[1]) && /stroke-slate-500/.test((surface.match(/<path data-midpoint-leg="A"[^>]*>/) || [''])[0]) && !/stroke-stone-600/.test(surface)
    && surface.indexOf('data-midpoint-leg="A"') < surface.indexOf('data-inside-column="true"') && surface.indexOf('data-midpoint-hits=') < surface.indexOf('data-inside-column="true"') && (surface.match(/data-midpoint-line-hit="/g) || []).length === (surface.match(/data-midpoint-line-kind="/g) || []).length && (surface.match(/data-midpoint-line-hit="/g) || []).length >= 6
    && (first ? /data-inside-wiring="12" data-inside-channel="-1\|/.test(surface) && /data-inside-wiring="5" data-inside-channel="1\|/.test(surface) : /data-inside-wiring="5" data-inside-channel="-1\|/.test(surface) && /data-inside-wiring="12" data-inside-channel="1\|/.test(surface)),
  { legA: legA && legA[1], channels: surface.match(/data-inside-wiring="\d+" data-inside-channel="[^"]+"/g) });

// ═══ §4 THE END-CELL (§9.73 (3) under Δ163; the designer's 13:42 §3): of what a present moment rests on, only what he SAID there ═══
{
  const e = 1; const x = 'spending';
  const entries = [['say', 'promise', 'is spent as', e, x, '+'], ['say', 'hoard', 'is spent as', e, x, '-']]; // the promise present at the spending, the hoard denied there, the security unsaid
  const cfg = configurationAt(F, entries, e, x);
  const present = new Set(cfg.present); const denied = new Set(cfg.denied);
  const said = foundationOf(tF, 'promise').rests.filter((f) => present.has(f.id) || denied.has(f.id));
  check('§4 ★★ THE PROMISE AT THE SPENDING (Finance\'s light, R1): the promise rests on the hoard and the security; the hoard is DENIED there — `cut here: the hoard is denied at the spending`; the security UNSAID — neither counted nor listed (Δ163); so the line counts `1 denied` and lists one item',
    J(cfg.present) === J(['promise']) && J(cfg.denied) === J(['hoard']) && J(said.map((f) => [f.id, present.has(f.id) ? 'present' : 'denied'])) === J([['hoard', 'denied']]) && foundationOf(tF, 'promise').rests.length === 2, { present: cfg.present, denied: cfg.denied, said });
  const cfg2 = configurationAt(F, [...entries, ['say', 'security', 'is spent as', e, x, '+']], e, x);
  const said2 = foundationOf(tF, 'promise').rests.filter((f) => cfg2.present.includes(f.id) || cfg2.denied.includes(f.id));
  check('§4 ★★ THE SECURITY SAID PRESENT THERE: `1 present · 1 denied`, two items (`rests on the security · present at the spending`, `rests on the hoard · cut here: …`); the count\'s zero part never printed',
    J(said2.map((f) => [f.id, cfg2.present.includes(f.id) ? 'present' : 'denied'])) === J([['hoard', 'denied'], ['security', 'present']]), said2);
  const ret2 = foundationOf(tF, 'return').rests.find((f) => f.id === 'hoard');
  check('§4 ★ A FOUNDATION REACHED THROUGH ANOTHER SAYS SO, THE PATH FIRST (the designer\'s 15:31 fit (2)): the return rests on the hoard — `through the security, the promise: rests on the hoard` (the chain read down) — the words the surface composes from `chain.slice(0, -1)`',
    !!ret2 && J(ret2.chain.slice(0, -1)) === J(['security', 'promise']), ret2);
  const ms = src('src/components/MidpointSurface.tsx');
  check('§4 ★★ BY CONSTRUCTION, THE PAGE: `foundationAt` filters the closure by `present.has(f.id) || denied.has(f.id)` (what he said there, nothing else), prints `present at …` or `cut here: … is denied at …`, counts `N present · M denied` with the zero part dropped, no line when nothing is said, placed under the saying beside the relations line; no `not said`, `met nothing` or `none crossed` anywhere in the components',
    ms.includes("const said = foundationOf(lightInside.dependenceTuples, z).rests.filter((f) => present.has(f.id) || denied.has(f.id));") && ms.includes("if (said.length === 0) return null;") && ms.includes("const parts = [nP ? `${nP} present` : '', nD ? `${nD} denied` : ''].filter(Boolean).join(' · ');")
      && ms.includes("`${through(f)}rests on ${nL(f.id)} · ${present.has(f.id) ? `present at ${nX(end, x)}` : `cut here: ${nL(f.id)} is denied at ${nX(end, x)}`}`") && ms.includes("`through ${f.chain.slice(0, -1).map(nL).join(', ')}: `") && ms.includes("{recorded.some((s) => signOf(s) === '+') ? foundationAt(zRole.id, e as EndSlot, x.id, end) : null}")
      && !/not said there|met nothing here|none crossed here/.test(fs.readdirSync(path.join(repoRoot, 'src/components')).map((f) => src(`src/components/${f}`)).join('\n')) && !/not said there|met nothing here|none crossed here/.test(src('src/lib/foundation.ts')),
    'source pins');
}

// ═══ §5 COUNTED APART (the designer's 15:41): the load line and the card ═══
check('§5 ★★ THE SUMMARY LINE: `· 12 dependences in 5 words` beside the relations on her Production, `· 5 dependences in 3 words` on her Finance; a cast before MOLD v7 names none; the card\'s `dependences` row: each word with its count, in the cast\'s order',
  /^9 roles · 25 relations in 12 words · 12 dependences in 5 words · /.test(castSummaryLine(P)) && /^6 roles · 21 relations in 15 words · 5 dependences in 3 words · /.test(castSummaryLine(F)) && !/dependence/.test(castSummaryLine(cast('vl-v6-production.cast.json')))
    && J(castCounts(P).dependenceWordCounts) === J([{ word: 'requires', tuples: 6 }, { word: 'presupposes', tuples: 1 }, { word: 'is made of', tuples: 2 }, { word: 'has the form of', tuples: 1 }, { word: 'is made by', tuples: 2 }]) && castCounts(P).dependences === 12 && castCounts(P).dependenceWords === 5
    && src('src/components/Panels.tsx').includes('data-cast-card-row="dependences"') && src('src/components/Panels.tsx').includes('<dt className="col-span-2 text-stone-500">dependences</dt>'),
  { P: castSummaryLine(P), F: castSummaryLine(F), row: castCounts(P).dependenceWordCounts });

// ═══ §6 THE HOVER'S REACH ON THE WIRES (her 15:41: what it rests on at once, what rests on it after 600 ms) ═══
{
  const ins = insideOf(P);
  const at = (id) => ins.points.findIndex((p) => p.id === id);
  const lit = (id, late) => litWiresOf(ins, at(id), late).map((on, i) => (on ? `${ins.points[ins.wires[i].from].id}>${ins.points[ins.wires[i].to].id}${ins.wires[i].holds ? '' : '|denied'}` : null)).filter(Boolean);
  check('§6 ★★ THE WORKING RESTED ON lights its 5 runs out at once (capacity, material, instrument, purpose, product) and the product\'s run into it after the moment (6); THE PRODUCT lights its 5 out (the denied one among them, dashed) and the two into it after (7); the model\'s wires are the drawing\'s (12)',
    J(lit('working', false)) === J(['working>capacity', 'working>material', 'working>instrument', 'working>purpose', 'working>product']) && lit('working', true).length === 6 && lit('working', true).includes('product>working')
      && lit('product', false).length === 5 && lit('product', false).includes('product>instrument|denied') && lit('product', true).length === 7 && ins.wires.length === 12 && ins.dependenceTuples.length === 12,
    { workingAtOnce: lit('working', false), workingLate: lit('working', true), productAtOnce: lit('product', false), productLate: lit('product', true) });
  const cd = src('src/components/CastInsideDiagram.tsx'); const ms = src('src/components/MidpointSurface.tsx'); const cc = src('src/components/ChildCast.tsx');
  check('§6 ★★ BY CONSTRUCTION: the lone drawing lights its wires by `litWiresOf` and hands `wireExtra` to its column, the ends of lit wires light, and the card beside the moment is `momentCardOf`; the edge\'s three columns take `wireExtraOf(\'A\'|\'B\'|\'L\')`, a relating rested on lights the wires OUT of its two ends (`hoveredEnds`), the relatings standing on what they reach stay at 0.8, and the card is a moment\'s (`the working (Production)`) or a relating\'s (`RelatingCard … pressable={false}`); the child\'s card shows `standsOn(chosen.key)`',
    cd.includes("const wireLit = (i: number): boolean => hover !== null && hover.kind === 'point' && litWiresOf(inside, indexOfId(hover.id), hoverIn)[i];") && cd.includes('pointExtra={pointExtraAll} wireExtra={wireExtra} who={who} />') && cd.includes('inside.wires.some((w, i) => wireLit(i) && (inside.points[w.from].id === pid || inside.points[w.to].id === pid))') && cd.includes('momentCardOf({ head: labelOfId(hover.id), tuples: inside.dependenceTuples, id: hover.id, nameOf: labelOfId })')
      && ms.includes("wireExtra={wireExtraOf('A')}") && ms.includes("wireExtra={wireExtraOf('B')}") && ms.includes("wireExtra={wireExtraOf('L')}") && ms.includes("return hoveredEnds().some((e) => e.column === column && ins.wires[i].from === ins.points.findIndex((pt) => pt.id === e.id));") && ms.includes('const opacity = dimmed ? (standing(l) ? 0.8 : 0.2) : l.faint ? 0.45 : 1;')
      && ms.includes("momentCardOf({ head: `${nameOf(hover.id)} (${hover.column === 'A' ? la : hover.column === 'B' ? lb : lightLabel})`, tuples: ins.dependenceTuples, id: hover.id, nameOf })") && ms.includes("<RelatingCard head={head} ends={[parentEndOf('A', a.id), parentEndOf('B', b.id)]} pressable={false} />")
      && cc.includes('{standsOn(chosen.key)}') && cc.includes("return <RelatingCard head={null} ends={[end(P, inst.p, 1), end(Q, inst.q, 2)]} pressable />;"),
    'source pins');
  const fc = src('src/components/FoundationCard.tsx');
  check('§6 ★★ THE CARD\'S PLACE BY CONSTRUCTION (the designer\'s 15:31 blocker and form; the mothership\'s 15:32): the card\'s width is FIXED (`CARD_WIDTH`), its place a function of the FRAME and the moment alone (right of the frame, else left, else over its edge; level with the moment; kept on screen), `position: fixed`; the layout effect runs once per moment rested on (`[anchorKey]`) and never reads what it sets — no feedback for React\'s update depth to storm on; every mount hands the frame (the drawing\'s zoom box) and the key; the relating\'s hit target is a transparent 8 px stroke per drawn line in its own group BEFORE the columns (a point above keeps its pointer), the visible line letting the pointer through',
    fc.includes('export const CARD_WIDTH = 416;') && fc.includes("const side: 'right' | 'left' | 'over' = fr.right + 8 + w <= vw - 8 ? 'right' : fr.left - 8 - w >= 8 ? 'left' : 'over';") && fc.includes('const top = Math.round(Math.max(8, Math.min(ar.top - 6, vh - h - 8)));') && fc.includes('  }, [anchorKey]);') && fc.includes('className="pointer-events-none fixed z-30') && !/card\.offsetWidth/.test(fc) && !/pane\.getBoundingClientRect/.test(fc)
      && cd.includes("frame={() => paneRef.current?.querySelector('[data-inside-box]') ?? null} anchorKey={`point|${hover.id}`}") && ms.includes("frame={() => paneEl.current?.querySelector('[data-midpoint-drawing-box]') ?? null} anchorKey={`point|${hover.column}|${hover.id}`}") && ms.includes("anchorKey={`line|${hover.key}`}")
      && ms.includes('stroke="transparent" strokeWidth={8} data-midpoint-line-hit={l.key} onPointerEnter=') && ms.indexOf('<g data-midpoint-hits=') < ms.indexOf('<InsideColumn inside={insideA}') && ms.includes('data-midpoint-line-kind={l.kind} opacity={opacity} className="pointer-events-none">') && !/data-midpoint-line-kind=\{l\.kind\}[^>]*onPointerEnter/.test(ms),
    'source pins');
}

// ═══ §7 THE LOAD REFUSAL GIVES ITS REASON (the designer's 17:50), on Virgin Land's 19:54 record ═══
{
  const save = JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json'), 'utf8'));
  S().importWorkspace(save);
  const Pr = Object.values(cur().vertices).find((v) => v.data.label === 'Production'); const held = Pr.data.cast;
  /** the held v6 cast with the given way-words moved to the dependence kind — the same roles, the same tuples, the kind changed */
  const reKind = (ws, drop = []) => ({ ...held, signature: held.signature.filter((s) => !ws.includes(s.type) && !drop.includes(s.type)), relations: held.relations.filter((r) => !ws.includes(r.type) && !drop.includes(r.type)), dependenceSignature: held.signature.filter((s) => ws.includes(s.type)), dependences: held.relations.filter((r) => ws.includes(r.type)) });
  const load = (c) => { S().selectVertex(Pr.id); return S().updateSelectedVertexData({ cast: c }); };
  const r1 = load(reKind(['is carried out as']));
  check('§7 ★★ ONE WORD RE-KINDED, EVERY LOSS RESTING ON IT (measured 14:3x on the 19:54 record): `loading this cast on Production would take away 4 answers at the midpoint of Consumption and Production. They rest on "is carried out as", which this cast holds as a dependence, not a way. Withdraw them there first:` — the sentence between the two, the list unchanged (4 answers)',
    !!r1 && r1.why === 'loading this cast on Production would take away 4 answers at the midpoint of Consumption and Production. They rest on "is carried out as", which this cast holds as a dependence, not a way. Withdraw them there first:' && r1.items.length === 4 && cur().vertices[Pr.id].data.cast === held, r1 && { why: r1.why, items: r1.items.length });
  const r2 = load(reKind(['is carried out as', 'is fixed as']));
  check('§7 ★★ TWO WORDS RE-KINDED: both named — `They rest on "is carried out as" and "is fixed as", which this cast holds as dependences, not ways.` — each necessary for some loss (measured: 4 answers each at Consumption–Production)',
    !!r2 && /^loading this cast on Production would take away \d+ answers at the midpoint of Consumption and Production\. They rest on "is carried out as" and "is fixed as", which this cast holds as dependences, not ways\. Withdraw them there first:$/.test(r2.why), r2 && r2.why);
  const r3 = load(reKind(['is carried out as'], ['is consumed as']));
  check('§7 ★★ ONLY SOME OF THE LOSSES REST ON A RE-KINDED WORD (`is consumed as` dropped outright beside it — those fall for the reasons they always did, which take no sentence): `Of them, 4 rest on "is carried out as", which this cast holds as a dependence, not a way.`',
    !!r3 && /\. Of them, 4 rest on "is carried out as", which this cast holds as a dependence, not a way\. Withdraw them there first:$/.test(r3.why) && r3.items.length > 4, r3 && { why: r3.why, items: r3.items.length });
  const r4 = load(P);
  check('§7 ★★ NO SENTENCE WHEN NO LOSS RESTS ON A RE-KINDED WORD: her v7 Production over the v6 (no v7 dependence word was a v6 way) — the refusal as before, `… at 3 midpoints: Consumption and Production, Production and Distribution, Finance and Production. Withdraw them there first:`',
    !!r4 && /at 3 midpoints: Consumption and Production, Production and Distribution, Finance and Production\. Withdraw them there first:$/.test(r4.why) && !/rest on/.test(r4.why), r4 && r4.why);
  const r5 = load(reKind(['is put to work as']));
  check('§7 ★ THE FIRST GUARD STANDS BEFORE IT: a word standing as a way at Production\'s edges (`is put to work as`, 5 relatings and 10 sayings) is refused by name at the load before any loss is counted',
    !!r5 && r5.why === '"is put to work as" names a dependence in this cast, and it is used as a way here: 5 relatings, 10 sayings', r5 && r5.why);
  const r6 = load(reKind(['is exercised as']));
  check('§7 ★ LAW 24 — a word nothing of his rests on (`is exercised as`) re-kinded is TAKEN; the held cast then put back', r6 === null && cur().vertices[Pr.id].data.cast !== held && load(held) === null && cur().vertices[Pr.id].data.cast.signature.length === held.signature.length, { r6 });
}

// ═══ §8 VIRGIN LAND'S ROUTE (the mothership's 13:35, one measure): her 14:57 export — the four v7 casts loaded at 2.1, before the page read the two lists ═══
{
  const save = JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-20_1457_four-v7-casts_dissected_no-relatings.workspace.json'), 'utf8'));
  S().importWorkspace(save);
  const corners = Object.values(cur().vertices).filter((v) => v.data.cast);
  const wiresNow = () => Object.fromEntries(corners.map((v) => [v.data.label, insideOf(spaceOf(cur(), v.id).space).wires.length]));
  const before = wiresNow();
  check('§8 ★★ AS THE PAGE READS HER 14:57 EXPORT AT THIS HEAD: the four corners draw NO wire — release 2.1\'s loader carried `dependence_signature` and `dependences` under the warrant\'s file, unread, so the casts hold neither list',
    corners.length === 4 && Object.values(before).every((n) => n === 0) && corners.every((v) => !v.data.cast.dependences && !!v.data.cast.warrant && !!v.data.cast.warrant.file && 'dependences' in v.data.cast.warrant.file), before);
  const files = { Finance: F, Production: P, Distribution: D, Consumption: C };
  const reloads = corners.map((v) => { S().selectVertex(v.id); return S().updateSelectedVertexData({ cast: files[v.data.label] }); });
  check('§8 ★★ HER ROUTE — LOAD THE FOUR CASTS AGAIN, ONE ACT EACH, NO MIGRATION: each taken (nothing of hers rests on them on this record), and the corners draw their wires: Finance 5, Production 12, Distribution 5, Consumption 5',
    reloads.every((r) => r === null) && J(wiresNow()) === J({ Finance: 5, Production: 12, Distribution: 5, Consumption: 5 }), wiresNow());
}

// ═══ §9 THE RECORD: the new reader classified at the landing ═══
check('§9 ★ THE COMPLETENESS ROW: `src/lib/foundation.ts` carries its NOT_FROZEN row in the freeze manifest (the closure witness fails any unlisted file under the engine roots)',
  src('docs/governance/ENGINE_FREEZE_MANIFEST.txt').includes('NOT_FROZEN src/lib/foundation.ts — '));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-DEPENDENCE-LOGIC: ALL PASS — "cannot be without" is transitive and read as chains in the caster\'s words; one reader of foundation per cast, run on her four v7 casts to the instrument\'s seals; the cards in the designer\'s words, a cut by silence never shown; the wires lit in the ways\' rhythm, the legs wiring, the counts apart, the load refusal with its reason' : `DIAGNOSE-THE-DEPENDENCE-LOGIC: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
