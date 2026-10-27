#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// THE TOWER — ⟨G3⟩ of ADR 0031 §9.73 (2) (Arman's Δ243, 2026-10-22, via the mothership: "what a concept rests on, read down the tower at generation 2 and beyond";
// the designer's 16:48: each `through` line names its concept, the depth as the chain of lines). THE RULE: at generation n a moment's foundation reaches the seeds
// THROUGH ITS COORDINATES — a born moment rests on its two coordinates (D14's wordless legs) and on what those rest on in their casts, down to the seeds; the one reader
// of foundation (src/lib/foundation.ts) reads the tower's tuples (src/lib/tower.ts) as it reads a cast's, every node keyed through its corner; CROSSED at a site is
// reached by some moment of that site along its legs (at generation 1 exactly the built reading, a relating holding the foundation as an end). MEASURED on Virgin
// Land's 19:54 record dissected again, at the generation-2 edge Accumulation–Class (landing A measured: a generation-2 relating card had no count line).
// ⟨G3⟩ AS RULED (GROUP 4 · slice 7; the researcher's 12:43 "9.73 ADDENDUM, second", ratified claims §543; the mothership's 13:04 MARKER G3-RATIFIED): *a foundation f of an
// end x is crossed at a site when some moment of the site reaches f by a chain of coordinate legs that does not pass through x* — an end's own coordinates are its
// construction, and its own pair never counts them as crossed (before §543 every generation-2 card read `2 crossed here`, the pair counting its own end's construction).
// §7 runs the researcher's falsifier, with its one number corrected by measurement.
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
const { useGeometryStore, childRecordsOf } = req('src/store/geometryStore.ts');
const { columnSpaceOf, termWordsOf, instancesFrom, childSpaceOf } = req('src/lib/instanceSpace.ts');
const { spaceOf, nameIn } = req('src/lib/spaceOf.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { dependenceTuplesOf } = req('src/lib/castInside.ts');
const { foundationOf, foundationItemsOf } = req('src/lib/foundation.ts');
const T = req('src/lib/tower.ts');
const { ChildCast } = req('src/components/ChildCast.tsx');
const { RelatingCard, momentCardOf } = req('src/components/FoundationCard.tsx');
const { barsOn } = req('src/lib/relatings.ts');
const PRED7 = req('src/lib/isPredicate.ts');
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
const unesc = (t) => t.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const text = (html) => unesc(html.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const linesOf = (html, attr) => html.split(new RegExp(`(?=<span ${attr})`)).slice(1).map((chunk) => text(chunk.split(/(?=<span data-dependence-card-line=|<span data-dependence-item=|<span data-dependence-rests-line=|<\/div>)/)[0]));
console.log('THE TOWER — ⟨G3⟩ on the 19:54 record at the generation-2 edge Accumulation–Class: a moment rests on its coordinates and on what those rest on, down to the seeds\n');
const S = () => useGeometryStore.getState();
S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json'), 'utf8')));
const sh0 = S().shapes[S().currentShapeId];
S().selectCell(sh0.cells.find((c) => /core/.test(c.id)).id);
S().applyAmboDissectionToCurrent();
const sh = () => S().shapes[S().currentShapeId];
const byLabel = (l) => Object.values(sh().vertices).find((v) => v.data.label === l);
const A = byLabel('Accumulation'); const B = byLabel('Class'); const Pr = byLabel('Production'); const Fi = byLabel('Finance'); const Di = byLabel('Distribution');
const e = edgeBetween(sh().edges, A.id, B.id);
const first = e.vertexIds[0] === A.id;
const mid = Object.values(sh().vertices).find((v) => v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(A.id) && v.createdBy.sourceVertexIds.includes(B.id));
const records = childRecordsOf(S()); const opts = { records };
const nm = (c, id) => termWordsOf(sh(), c, id, opts);
const cA = columnSpaceOf(sh(), A.id, opts); const cB = columnSpaceOf(sh(), B.id, opts);
const byName = (col, c, name) => col.roles.map((r) => r.id).find((id) => nm(c, id) === name);
const cs = byName(cA, A.id, 'the credit sale'); const lg = byName(cB, B.id, 'the largesse');
const Pspace = spaceOf(sh(), Pr.id).space; const Fspace = spaceOf(sh(), Fi.id).space;
check('§0 THE RECORD: the 19:54 record dissected again; Accumulation (Finance–Production\'s child, 17 moments) and Class (Production–Distribution\'s child, 12), their generation-2 edge with its midpoint; `the credit sale` and `the largesse` found',
  !!A && !!B && !!mid && !!cs && !!lg && cA.roles.length === 17 && cB.roles.length === 12, { mid: mid && mid.data.label, keys: { cs, lg } });

// ═══ §1 THE TOWER'S TUPLES under a born corner ═══
const tower = T.towerTuplesOf(sh(), A.id, opts);
const legs = tower.filter((t) => t.word === '');
const seedTuples = tower.filter((t) => t.word !== '');
const castCount = dependenceTuplesOf(Fspace).length + dependenceTuplesOf(Pspace).length;
check('§1 ★★ THE TOWER\'S TUPLES under Accumulation: two wordless legs per moment (17 · 2 = 34 — each to a role of Finance or of Production, keyed through its corner) and the two seed casts\' own dependence tuples keyed through their corners, nothing else (on this 10-19 record the seed casts hold NO dependence tuples — the tower bottoms at the coordinates here, measured and said; the depth is §6\'s, on a v7 export); a seed corner\'s tower is its cast\'s tuples alone',
  legs.length === 34 && legs.every((t) => T.towerNodeOf(t.from).corner === A.id && [Fi.id, Pr.id].includes(T.towerNodeOf(t.to).corner) && t.holds) && seedTuples.length === castCount && seedTuples.every((t) => [Fi.id, Pr.id].includes(T.towerNodeOf(t.from).corner) && T.towerNodeOf(t.from).corner === T.towerNodeOf(t.to).corner)
    && T.towerTuplesOf(sh(), Pr.id, opts).length === dependenceTuplesOf(Pspace).length,
  { legs: legs.length, seedTuples: seedTuples.length, castCount });

// ═══ §2 THE FOUNDATION OF A BORN MOMENT, down to the seeds ═══
const coords = T.coordinatesOf(sh(), A.id, cs, opts);
const F = foundationOf(tower, T.towerKey(A.id, cs));
const name = T.towerNameOf(sh(), opts);
const fromP = foundationOf(dependenceTuplesOf(Pspace), coords.find((c) => c.corner === Pr.id).id); const fromF = foundationOf(dependenceTuplesOf(Fspace), coords.find((c) => c.corner === Fi.id).id);
note(`the credit sale: coordinates ${coords.map((c) => name(T.towerKey(c.corner, c.id))).join(' · ')} · rests on ${F.rests.length} · through ${F.through.map((t) => `${name(t.via)}: ${t.items.map((i) => `${i.word} ${name(i.to)}`).join(' · ')}`).join(' | ')}`);
check('§2 ★★★ THE FOUNDATION OF `the credit sale` READ DOWN THE TOWER (⟨G3⟩): it rests on its two coordinates — `the promise (Finance)` and `the product (Production)`, wordless legs — and on what those rest on in their casts (the two casts\' own readings, joined: rests = 2 + Finance\'s from the promise + Production\'s from the product), every `through` line naming its concept; nothing named twice',
  coords.length === 2 && F.direct.length === 2 && F.direct.every((d) => d.word === '' && d.holds) && J(F.direct.map((d) => name(d.to)).sort()) === J(['the product (Production)', 'the promise (Finance)'].sort())
    && F.rests.length === 2 + fromP.rests.length + fromF.rests.length && F.through.every((t) => /\((Finance|Production)\)$/.test(name(t.via))) && new Set(F.rests.map((r) => r.id)).size === F.rests.length,
  { direct: F.direct.map((d) => name(d.to)), rests: F.rests.length, fromProduct: fromP.rests.length, fromPromise: fromF.rests.length, through: F.through.map((t) => name(t.via)) });

// ═══ §3 THE CARD AT A GENERATION-2 EDGE: the count line, crossed as …, the items whole ═══
if (first) S().giveRolePair(e.id, cs, lg); else S().giveRolePair(e.id, lg, cs);
const rec = sh().edges.find((z) => z.id === e.id).identification;
const inst = instancesFrom(sh(), A.id, B.id, opts).find((k) => k.p === cs && k.q === lg) || instancesFrom(sh(), A.id, B.id, opts)[0];
useGeometryStore.setState({ childView: { siteId: mid.id, key: inst ? inst.key : '' } });
const child = childSpaceOf(sh(), mid.id, opts);
const html = unesc(renderToString(React.createElement(ChildCast, { shape: sh(), siteId: mid.id, child, litOf: () => ({ lit: false, dim: false }), onHoverRow: () => {} })));
const lineCs = linesOf(html, 'data-dependence-rests-line="[^"]*\\|promise is spent as product"')[0] || null;
const lineLg = linesOf(html, 'data-dependence-rests-line="[^"]*\\|surplus is given away as gift"')[0] || null;
check('§3 ★★★ THE RELATING CARD AT A GENERATION-2 EDGE, ⟨G3⟩ AS RULED (claims §543; the falsifier\'s step 1): with `the credit sale ≡ the largesse` ALONE at Accumulation–Class, the child\'s card reads `the credit sale (Accumulation) rests on 2 · show` and `the largesse (Class) rests on 2 · show` — each end\'s own coordinates are its construction, reached by its own pair only THROUGH the end, never counted as crossed; nothing crossed, nothing said (Δ163: no zero printed, no `none crossed`). Before §543 both read `2 crossed here`',
  !!rec && rec.roles.length === 1 && !!inst && !!lineCs && lineCs === `the credit sale (Accumulation) rests on ${F.rests.length} · show` && !!lineLg && /^the largesse \(Class\) rests on \d+ · show$/.test(lineLg) && !/crossed here|met nothing|none crossed|not said/.test(html),
  { lineCs, lineLg, standing: rec && rec.roles });
// the items whole, as a hover card shows them: the ends through the one producer (`towerEndOf`), as the child's card builds them
const endOf = (c, id, side) => { const E = T.towerEndOf(sh(), c, id, mid.id, opts); return { label: sh().vertices[c].data.label, tuples: E.tuples, id: E.id, nameOf: E.nameOf, crossed: (f) => E.reached(f).map((m) => termWordsOf(sh(), mid.id, m, opts)), barred: (f) => E.barsReaching(f, barsOn(e), (r) => r[side]).map((r) => r[0]) }; };
const whole = unesc(renderToString(React.createElement(RelatingCard, { head: null, ends: [endOf(A.id, cs, first ? 1 : 2), endOf(B.id, lg, first ? 2 : 1)], pressable: false })));
const t = text(whole);
const momentHtml = unesc(renderToString(momentCardOf({ head: `${nm(A.id, cs)} (Accumulation)`, tuples: T.towerTuplesOf(sh(), A.id, opts), id: T.towerKey(A.id, cs), nameOf: T.towerEndOf(sh(), A.id, cs, mid.id, opts).nameOf })));
const mt = text(momentHtml);
check('§3 ★★ THE ITEMS WHOLE, ⟨G3⟩ AS RULED (the relating card as a hover card shows it, the designer\'s 13:50): `stands on the credit sale (Accumulation) and the largesse (Class)`, each end `rests on 2` with its two coordinates listed with their concepts — `the promise (Finance)`, `the product (Production)`, `the surplus (Production)`, `the gift (Distribution)` — and NO `crossed as` tail: the pair reaches them only through its own ends; no concept doubled. THE MOMENT CARD unchanged (the designer\'s 16:48): `cannot be without: the promise (Finance) · the product (Production)` — the coordinates, wordless legs, no word printed',
  /stands on the credit sale \(Accumulation\) and the largesse \(Class\)/.test(t) && !/crossed as/.test(t) && /the credit sale \(Accumulation\) rests on 2 the promise \(Finance\) the product \(Production\)/.test(t) && /the largesse \(Class\) rests on 2 the surplus \(Production\) the gift \(Distribution\)/.test(t) && !/\(Production\) \(Production\)|\(Finance\) \(Finance\)|\(Accumulation\) \(Accumulation\)/.test(t)
    && /cannot be without: the promise \(Finance\) · the product \(Production\)/.test(mt) && !/cannot be without:  /.test(mt),
  { text: t.slice(0, 400), moment: mt.slice(0, 300) });

// ═══ §7 ⟨G3⟩ AS RULED — THE FALSIFIER (the researcher's 12:43, ratified claims §543): (1) is §3 above; (2) a second pair whose Accumulation end holds the product, the debt
// service's — MEASURED: the debt service holds BOTH of the credit sale's coordinates (the promise and the product: two relatings of Finance–Production between the same two
// roles), so the rule as ratified counts 2, each crossed as the debt service's pair (the falsifier's "1" assumed the product alone); (3) withdrawn: none; (4) the count at
// exactly 1 — a pair whose CLASS end, the portion, holds the product (Accumulation and Class share Production): the product crossed by it alone, through the pair's other end
// at the other corner, and the largesse's surplus crossed through the pair's Accumulation end, the reserve; withdrawn: none ═══
{
  const o7 = () => ({ records: childRecordsOf(S()) });
  const give = (x, y) => (first ? S().giveRolePair(e.id, x, y) : S().giveRolePair(e.id, y, x));
  const take = (x, y) => (first ? S().withdrawRolePair(e.id, x, y) : S().withdrawRolePair(e.id, y, x));
  const end7 = (c, id, side) => { const E = T.towerEndOf(sh(), c, id, mid.id, o7()); return { label: sh().vertices[c].data.label, tuples: E.tuples, id: E.id, nameOf: E.nameOf, crossed: (f) => E.reached(f).map((m) => termWordsOf(sh(), mid.id, m, o7())), barred: (f) => E.barsReaching(f, barsOn(sh().edges.find((z) => z.id === e.id)), (r) => r[side]).map((r) => r[0]) }; };
  const read7 = () => {
    const k = instancesFrom(sh(), A.id, B.id, o7()).find((z) => z.p === cs && z.q === lg);
    useGeometryStore.setState({ childView: { siteId: mid.id, key: k ? k.key : '' } });
    const h = unesc(renderToString(React.createElement(ChildCast, { shape: sh(), siteId: mid.id, child: childSpaceOf(sh(), mid.id, o7()), litOf: () => ({ lit: false, dim: false }), onHoverRow: () => {} })));
    const w = text(unesc(renderToString(React.createElement(RelatingCard, { head: null, ends: [end7(A.id, cs, first ? 1 : 2), end7(B.id, lg, first ? 2 : 1)], pressable: false }))));
    return { found: !!k, cs: linesOf(h, 'data-dependence-rests-line="[^"]*\\|promise is spent as product"')[0] || null, lg: linesOf(h, 'data-dependence-rests-line="[^"]*\\|surplus is given away as gift"')[0] || null, whole: w };
  };
  const coordsOf = (c, id) => T.coordinatesOf(sh(), c, id, o7()).map((k) => name(T.towerKey(k.corner, k.id)));
  const nameB = (id) => termWordsOf(sh(), B.id, id, o7());
  // (2) the debt service's pair: its Class end the first moment the one IS predicate takes beside the standing pair
  const ds = byName(cA, A.id, 'the debt service');
  const yPick = ds ? cB.roles.map((r) => r.id).find((y) => y !== lg && (first ? PRED7.isPairRefusalAt(sh(), A.id, B.id, ds, y, { options: o7(), names: nm }) : PRED7.isPairRefusalAt(sh(), B.id, A.id, y, ds, { options: o7(), names: nm })) === null) : null;
  if (ds && yPick) give(ds, yPick);
  const ref2 = S().midpointRefusals[e.id] || null;
  const s2 = read7(); const yName = yPick ? nameB(yPick) : null;
  const by2 = new RegExp(`crossed as \\(the debt service ≡ ${(yName || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
  check('§7 ★★★ ⟨G3⟩\'s FALSIFIER, STEP 2 (claims §543), ITS NUMBER CORRECTED BY MEASUREMENT: a second pair whose Accumulation end holds the product, `the debt service ≡ <the first Class moment the predicate takes>`, TAKEN; the debt service holds BOTH of the credit sale\'s coordinates (`the promise (Finance)`, `the product (Production)`), so the credit sale\'s card reads `rests on 2 · 2 crossed here · show`, each foundation `crossed as (the debt service ≡ …)` and never as the credit sale\'s own pair; the largesse\'s card unmoved, `rests on 2 · show` (the debt service reaches none of its coordinates). The researcher\'s step 2 said `1`, the product alone',
    !!ds && !!yPick && ref2 === null && J(coordsOf(A.id, ds).sort()) === J(coordsOf(A.id, cs).sort()) && J(coordsOf(A.id, cs).sort()) === J(['the product (Production)', 'the promise (Finance)'])
      && s2.found && s2.cs === 'the credit sale (Accumulation) rests on 2 · 2 crossed here · show' && s2.lg === 'the largesse (Class) rests on 2 · show'
      && (s2.whole.match(by2) || []).length === 2 && new RegExp(`the promise \\(Finance\\) · ${by2.source}`).test(s2.whole) && new RegExp(`the product \\(Production\\) · ${by2.source}`).test(s2.whole) && !/crossed as \(the credit sale ≡ the largesse\)/.test(s2.whole),
    { debtService: ds && coordsOf(A.id, ds), creditSale: coordsOf(A.id, cs), y: yName, refusal: ref2, cs: s2.cs, lg: s2.lg, whole: s2.whole.slice(0, 420) });
  if (ds && yPick) take(ds, yPick);
  const s3 = read7();
  check('§7 ★★ STEP 3: the debt service\'s pair WITHDRAWN — the credit sale\'s card returns to `rests on 2 · show`, nothing crossed, nothing said; the largesse\'s the same',
    s3.found && s3.cs === 'the credit sale (Accumulation) rests on 2 · show' && s3.lg === 'the largesse (Class) rests on 2 · show' && !/crossed as/.test(s3.whole),
    { cs: s3.cs, lg: s3.lg });
  // (4) THE COUNT AT EXACTLY 1: the reserve (Accumulation) ≡ the portion (Class)
  const rv = byName(cA, A.id, 'the reserve'); const pt = byName(cB, B.id, 'the portion');
  if (rv && pt) give(rv, pt);
  const ref4 = S().midpointRefusals[e.id] || null;
  const s4 = read7();
  check('§7 ★★★ STEP 4 — THE COUNT AT EXACTLY ONE, THROUGH THE OTHER CORNER: `the reserve ≡ the portion` TAKEN (the reserve holds `the hoard (Finance)` and `the surplus (Production)`; the portion holds `the product (Production)` and `the share (Distribution)` — Accumulation and Class share Production); the credit sale\'s card reads `rests on 2 · 1 crossed here · show`, `the product (Production) · crossed as (the reserve ≡ the portion)` reached through the pair\'s Class end, the promise with no tail; the largesse\'s card `rests on 2 · 1 crossed here · show`, `the surplus (Production) · crossed as (the reserve ≡ the portion)` reached through the pair\'s Accumulation end',
    !!rv && !!pt && ref4 === null && J(coordsOf(A.id, rv).sort()) === J(['the hoard (Finance)', 'the surplus (Production)']) && J(coordsOf(B.id, pt).sort()) === J(['the product (Production)', 'the share (Distribution)'])
      && s4.cs === 'the credit sale (Accumulation) rests on 2 · 1 crossed here · show' && s4.lg === 'the largesse (Class) rests on 2 · 1 crossed here · show'
      && /the product \(Production\) · crossed as \(the reserve ≡ the portion\)/.test(s4.whole) && /the surplus \(Production\) · crossed as \(the reserve ≡ the portion\)/.test(s4.whole) && !/the promise \(Finance\) · crossed/.test(s4.whole) && !/the gift \(Distribution\) · crossed/.test(s4.whole) && (s4.whole.match(/crossed as /g) || []).length === 2,
    { refusal: ref4, cs: s4.cs, lg: s4.lg, whole: s4.whole.slice(0, 420) });
  if (rv && pt) take(rv, pt);
  const s5 = read7();
  check('§7 ★★ STEP 4 WITHDRAWN: both cards return to `rests on 2 · show`',
    s5.cs === 'the credit sale (Accumulation) rests on 2 · show' && s5.lg === 'the largesse (Class) rests on 2 · show' && !/crossed as/.test(s5.whole),
    { cs: s5.cs, lg: s5.lg });
}
if (first) S().withdrawRolePair(e.id, cs, lg); else S().withdrawRolePair(e.id, lg, cs);
useGeometryStore.setState({ midpointRefusals: {} });

// ═══ §4 · §6 ON A v7 EXPORT (Virgin Land's 12:10 Property export: the seed casts carry dependences — Finance 5, Production 12, Distribution 6, Consumption 6) ═══
S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-22_1210_Property_F-D_19-moments-8-relation-words-named.workspace.json'), 'utf8')));
const byLabel2 = (l) => Object.values(sh().vertices).find((v) => v.data.label === l);
const Cap = byLabel2('Capital'); const Prop = byLabel2('Property'); const Fi2 = byLabel2('Finance'); const Pr2 = byLabel2('Production');
const P2space = spaceOf(sh(), Pr2.id).space;
{
  // §4 THE CONTROL AT GENERATION 1: at Finance–Production (Capital's own edge) a seed end reads the ratified reading — its own cast's tuples, the crossed those a relating holds as an end
  const recsV = childRecordsOf(S()); const optsV = { records: recsV };
  const insts = instancesFrom(sh(), Fi2.id, Pr2.id, optsV);
  const onCapacity = insts.find((k) => k.q === 'capacity') || insts[0];
  useGeometryStore.setState({ childView: { siteId: Cap.id, key: onCapacity.key } });
  const h1 = unesc(renderToString(React.createElement(ChildCast, { shape: sh(), siteId: Cap.id, child: childSpaceOf(sh(), Cap.id, optsV), litOf: () => ({ lit: false, dim: false }), onHoverRow: () => {} })));
  const lineQ = linesOf(h1, `data-dependence-rests-line="${onCapacity.q}"`)[0] || null;
  const own = foundationOf(dependenceTuplesOf(P2space), onCapacity.q);
  const crossedQ = own.rests.filter((f) => insts.some((k) => k.q === f.id)).length;
  check('§4 ★★ THE CONTROL — GENERATION 1 UNCHANGED (the Property export, v7 casts): at Finance–Production, Capital\'s own edge, the seed end reads the ratified reading — `<role> (Production) rests on N` by Production\'s own tuples, `M crossed here` the foundations a relating at this edge holds as an end, `show`; no concept doubled, no tower key printed',
    !!onCapacity && !!lineQ && lineQ === `${nameIn(P2space, onCapacity.q)} (Production) rests on ${own.rests.length}${crossedQ ? ` · ${crossedQ} crossed here` : ''} · show` && own.rests.length > 0 && !/\(Production\) \(Production\)/.test(h1) && !/\|/.test(lineQ),
    { lineQ, rests: own.rests.length, crossed: crossedQ });
  // ⟨G3⟩'s ONE RULE AT EVERY SCALE, MEASURED AT GENERATION 1 (claims §543: "the rule reproduces the built reading") — the tower's own end at the seed corner, read by the rule
  // (a moment of the site reaching the foundation by a road that avoids the end), counts what the seed branch counts; a positive control, since the card itself routes a seed
  // end to the seed branch and so could never disagree
  const E4 = T.towerEndOf(sh(), Pr2.id, onCapacity.q, Cap.id, optsV);
  const F4 = foundationOf(E4.tuples, E4.id);
  const byRule = F4.rests.filter((f) => E4.reached(f.id).length > 0).map((f) => T.towerNodeOf(f.id).id).sort();
  const byBranch = own.rests.filter((f) => insts.some((k) => k.q === f.id)).map((f) => f.id).sort();
  check('§4 ★★ ⟨G3⟩\'s ONE RULE AT GENERATION 1, MEASURED BY THE RULE ITSELF (claims §543: "at generation 1 nothing changes"): the tower\'s end at the seed corner Production — `the capacity`, at Finance–Production — read by the rule counts the same foundations crossed as the seed branch that prints `rests on 6 · 4 crossed here`: four, the same four',
    byRule.length === 4 && J(byRule) === J(byBranch) && F4.rests.length === own.rests.length,
    { byRule, byBranch, rests: [F4.rests.length, own.rests.length] });
}
// §6 THE DEPTH: the core dissected again; at the generation-2 edge Capital–Property a lawful pair whose first end rests below its coordinates; the card reads the tower down to the seeds
S().selectCell(sh().cells.find((c) => c.kind === 'core').id); S().applyAmboDissectionToCurrent();
{
  const G2 = sh(); const recs2 = childRecordsOf(S()); const opts2 = { records: recs2 };
  const names2 = (c, id) => termWordsOf(G2, c, id, opts2);
  const colA = columnSpaceOf(G2, Cap.id, opts2); const colB = columnSpaceOf(G2, Prop.id, opts2);
  const e12 = edgeBetween(G2.edges, Cap.id, Prop.id);
  const mid2 = Object.values(G2.vertices).find((v) => v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(Cap.id) && v.createdBy.sourceVertexIds.includes(Prop.id));
  const PRED = req('src/lib/isPredicate.ts');
  const towerA = T.towerTuplesOf(G2, Cap.id, opts2);
  let pair = null; let F6 = null;
  for (const x of colA.roles) { for (const y of colB.roles) { if (PRED.isPairRefusalAt(G2, Cap.id, Prop.id, x.id, y.id, { options: {}, names: names2 }) === null) { const Fx = foundationOf(towerA, T.towerKey(Cap.id, x.id)); if (Fx.rests.length > 2) { pair = [x.id, y.id]; F6 = Fx; break; } } } if (pair) break; }
  const name2 = T.towerNameOf(G2, opts2);
  note(`§6 the pair ${pair ? `${names2(Cap.id, pair[0])} ≡ ${names2(Prop.id, pair[1])}` : 'none'} · the tower: rests on ${F6 ? F6.rests.length : 0}; direct ${F6 ? F6.direct.map((d) => name2(d.to)).join(' · ') : ''}; through ${F6 ? F6.through.map((t) => `${name2(t.via)}: ${t.items.map((i) => `${i.word} ${name2(i.to)}`).join(' · ')}`).join(' | ') : ''}`);
  if (e12.vertexIds[0] === Cap.id) S().giveRolePair(e12.id, pair[0], pair[1]); else S().giveRolePair(e12.id, pair[1], pair[0]);
  const ref = S().midpointRefusals[e12.id] || null;
  const inst2 = instancesFrom(sh(), Cap.id, Prop.id, opts2).find((k) => k.p === pair[0] && k.q === pair[1]);
  useGeometryStore.setState({ childView: { siteId: mid2.id, key: inst2 ? inst2.key : '' } });
  const h6 = unesc(renderToString(React.createElement(ChildCast, { shape: sh(), siteId: mid2.id, child: childSpaceOf(sh(), mid2.id, opts2), litOf: () => ({ lit: false, dim: false }), onHoverRow: () => {} })));
  const line6 = linesOf(h6, `data-dependence-rests-line="[^"]*\\|${pair[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`)[0] || null;
  const E6 = T.towerEndOf(sh(), Cap.id, pair[0], mid2.id, opts2);
  const whole6 = text(unesc(renderToString(React.createElement(RelatingCard, { head: null, ends: [{ label: 'Capital', tuples: E6.tuples, id: E6.id, nameOf: E6.nameOf, crossed: (f) => E6.reached(f).map((m) => termWordsOf(sh(), mid2.id, m, opts2)), barred: () => [] }], pressable: false }))));
  const mc6 = text(unesc(renderToString(momentCardOf({ head: `${names2(Cap.id, pair[0])} (Capital)`, tuples: E6.tuples, id: E6.id, nameOf: E6.nameOf }))));
  check('§6 ★★★ THE DEPTH (⟨G3⟩ on a v7 export, as ruled — claims §543): at the generation-2 edge Capital–Property a lawful pair is TAKEN, ALONE, and the child\'s card reads its first end `<moment> (Capital) rests on N · show` with N > 2 — its coordinates its construction, never crossed by its own pair, the deeper foundations met by nothing (before §543: `2 crossed here`); the items whole run DOWN THE TOWER, each `through` line naming its concept (`through the capacity (Production): requires the product (Production) · …`) to the seeds, nearest first, nothing named twice, no `crossed as` tail; the moment card says `cannot be without: <coordinate> (Finance) · <coordinate> (Production)` then the same `through` lines',
    !!pair && !!F6 && F6.rests.length > 2 && ref === null && !!inst2 && !!line6 && line6 === `${names2(Cap.id, pair[0])} (Capital) rests on ${F6.rests.length} · show` && F6.through.length >= 1 && F6.through.every((t) => /\((Finance|Production)\)$/.test(name2(t.via)))
      && new RegExp(`through ${name2(F6.through[0].via).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}: `).test(whole6) && (whole6.match(/crossed as /g) || []).length === 0 && new Set(F6.rests.map((r) => r.id)).size === F6.rests.length
      && /cannot be without: [^·]+ \((Finance|Production)\) · [^·]+ \((Finance|Production)\)/.test(mc6) && new RegExp(`through ${name2(F6.through[0].via).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}: `).test(mc6),
    { pair: pair && [names2(Cap.id, pair[0]), names2(Prop.id, pair[1])], line6, through: F6 && F6.through.map((t) => `${name2(t.via)}: ${t.items.map((i) => `${i.word} ${name2(i.to)}`).join(' · ')}`), moment: mc6.slice(0, 400) });

  // §6b THE DESIGNER'S 19:36 — A MOMENT'S CONCEPT NAMED ONLY WHERE IT CHANGES, read on the RENDERED cards (the tower end's `nameFrom` handed in) and judged by the FULL names of
  // the tower's own namer (`towerNameOf` — the concept in a name's last parentheses), never by the rule's own output
  const conceptIn = (full) => (full.match(/\(([^()]*)\)$/) || [])[1] || null;
  const bareIn = (full) => full.replace(/ \([^()]*\)$/, '');
  const momentHtml6b = unesc(renderToString(momentCardOf({ head: `${names2(Cap.id, pair[0])} (Capital)`, tuples: E6.tuples, id: E6.id, nameOf: E6.nameOf, nameFrom: E6.nameFrom })));
  const relHtml6b = unesc(renderToString(React.createElement(RelatingCard, { head: null, ends: [{ label: 'Capital', tuples: E6.tuples, id: E6.id, nameOf: E6.nameOf, nameFrom: E6.nameFrom, crossed: () => [], barred: () => [] }], pressable: false })));
  // the moment card: each `through` line's text, by the line's own mark
  const lineTexts = [...momentHtml6b.matchAll(/data-dependence-card-line="through" data-dependence-through="([^"]*)"[^>]*>([\s\S]*?)(?=<span data-dependence-card-line=|<\/div>)/g)].map((m) => ({ via: m[1], text: text(m[2]) }));
  const verdicts = lineTexts.map(({ via, text: t }) => {
    const tr = F6.through.find((x) => x.via === via);
    if (!tr) return { via, ok: false, why: 'no such line in the reading' };
    const head = name2(via); const c = conceptIn(head);
    if (!t.startsWith(`through ${head}: `)) return { via, ok: false, why: `head ${t.slice(0, 80)}` };
    const body = t.slice(`through ${head}: `.length);
    const bad = tr.items.filter((i) => { const full = name2(i.to); const same = conceptIn(full) === c; return same ? !body.includes(bareIn(full)) || body.includes(full) : !body.includes(full); });
    return { via, ok: bad.length === 0, same: tr.items.filter((i) => conceptIn(name2(i.to)) === c).length, body: body.slice(0, 160), bad: bad.map((i) => name2(i.to)) };
  });
  // the relating card: each item under a `through` head, by its own mark
  const relItems = foundationItemsOf(E6.tuples, E6.id).filter((x) => x.via !== null).map((x) => {
    const at = relHtml6b.indexOf(`data-dependence-item="${x.via}|${x.item.word}|${x.item.to}"`);
    const chunk = at < 0 ? '' : relHtml6b.slice(at, relHtml6b.indexOf('data-dependence-item=', at + 10) < 0 ? undefined : relHtml6b.indexOf('data-dependence-item=', at + 10));
    const full = name2(x.item.to); const same = conceptIn(full) === conceptIn(name2(x.via));
    const t = text('<i ' + chunk);
    return { ok: at >= 0 && (same ? t.includes(`${x.item.word} ${bareIn(full)}`) && !t.includes(`${x.item.word} ${full}`) : t.includes(`${x.item.word} ${full}`)), same };
  });
  check('§6b ★★ THE DESIGNER\'S 19:36 — A MOMENT\'S CONCEPT NAMED ONLY WHERE IT CHANGES, on the rendered cards: each `through` line of the moment card names its head with its concept, an item of the head\'s own concept BARE and one of another concept WITH its name; the coordinates line keeps every name; the relating card\'s items the same — judged by the full names of the tower\'s own namer; the same-concept branch exercised here (every `through` line of this card stays in Production, measured) — the other-concept branch on a generation-2 moment\'s card (the merged-point witness §5d)',
    lineTexts.length === F6.through.length && verdicts.every((v) => v.ok) && verdicts.some((v) => v.same > 0) && /cannot be without: [^·]+ \((Finance|Production)\) · [^·]+ \((Finance|Production)\)/.test(text(momentHtml6b))
      && relItems.length >= 1 && relItems.every((x) => x.ok) && relItems.some((x) => x.same),
    { lines: verdicts.slice(0, 6), relItems: { n: relItems.length, same: relItems.filter((x) => x.same).length, bad: relItems.filter((x) => !x.ok).length } });
}

// ═══ §5 BY CONSTRUCTION ═══
const tower_ = src('src/lib/tower.ts'); const childCast = src('src/components/ChildCast.tsx'); const surface = src('src/components/MidpointSurface.tsx'); const card = src('src/components/FoundationCard.tsx'); const manifest = src('docs/governance/ENGINE_FREEZE_MANIFEST.txt');
check('§5 ★ BY CONSTRUCTION: the tower is one reader (`towerTuplesOf` — legs at born corners, the casts\' tuples at seeds, keyed through the corner; `reachedBy` along the legs BY A ROAD THAT AVOIDS THE END, the end a REQUIRED argument so no reader can count an end\'s own construction by forgetting to name it — ⟨G3⟩ as ruled, claims §543; `towerEndOf` the one producer of a born end, handing its own key), read by the one reader of foundation unchanged; the child\'s card and the surface route a BORN parent\'s end and a born column\'s moment to it and a seed\'s as before; the foundation card prints a wordless leg without a word; the module react-free and classified NOT_FROZEN',
  /export function towerTuplesOf\(/.test(tower_) && /export function reachedBy\(shape: Shape, site: VertexId, key: string, end: string, options/.test(tower_) && /export function towerEndOf\(/.test(tower_) && !/from 'react'|useGeometryStore|zustand/.test(tower_) && /legClosureOf\(shape, site, m, options, end\)\.has\(key\)/.test(tower_)
    && /if \(avoid !== null && towerKey\(corner, id\) === avoid\) return out;/.test(tower_) && /if \(k !== avoid && !out\.has\(k\)\)/.test(tower_) && /reached: \(f\) => reachedBy\(shape, site, f, own, options\)/.test(tower_)
    && /if \(!isSeedVertex\(shape, c\)\) \{\n\s*const T = towerEndOf\(shape, c, id, siteId, \{ records: childRecords \}\);/.test(childCast) && /if \(!isSeedVertex\(shape, corner\)\) \{\n\s*const T = towerEndOf\(shape, corner, id, site\.siteId, \{ records: childRecords \}\);/.test(surface) && /const T = cornerOfColumn !== null && !isSeedVertex\(shape, cornerOfColumn\) \? towerEndOf\(/.test(surface)
    && /g\.word \? `\$\{g\.word\} \$\{g\.to\.map\(nameOf\)\.join\(', '\)\}` : g\.to\.map\(nameOf\)\.join\(' · '\)/.test(card) && /^NOT_FROZEN src\/lib\/tower\.ts — GROUP 4 · slice 3/m.test(manifest) && !/export function foundationOf\(tuples: readonly DependenceTuple\[\], id: string, /.test(src('src/lib/foundation.ts')));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-TOWER: ALL PASS — a born moment rests on its coordinates and on what those rest on, down to the seeds; the generation-2 relating card counts the crossed by roads that avoid the end (⟨G3⟩ as ruled, §543); generation 1 reads as before' : `DIAGNOSE-THE-TOWER: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
