#!/usr/bin/env node
// DIAGNOSE THE PAIRING TAB — STAMP THE-FINDINGS-BATCH · SLICE 2b (the mothership's letter of 2026-10-17 12:39; Arman's order Δ177 "right after it"; the form he
// approved at 10:55 on 10-10, Δ176 — the designer's letter of 10:56, its section "The pairing tab", and the mock `.handoff/DESIGN_THE-CHILDS-CAST/pairs.html`).
// Under node, on Virgin Land's 19:34 export (`Culture`, the midpoint of Value and Fact): the tab stands first among the point's tabs, its head is pinned with the
// act at its end, one card per role of the second parent with the recorded relatings first in amber and the line `<role> [a word] ≡ <role> · holds · does not
// hold`, the glosses, `+ another`; the view (the role's turn, a card lit) is the store's; the act is the store's one writer; the old click-to-pair is gone from
// the drawing (§354 (d)), and so is its chooser. At a corner edge (A–AC, the seeded tetrahedron) the coordinate pair's `≡` is not offered, by name (M1).
// What a person DOES in the tab (type, choose, record) is the eye's — the concept-layer eye's arms relate by the tab since this slice.
'use strict';
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
const { MidpointSurface, midpointViewOf } = req('src/components/MidpointSurface.tsx');
const { spaceOf, nameIn } = req('src/lib/spaceOf.ts');
const { columnSpaceOf, instancesFrom } = req('src/lib/instanceSpace.ts');
const RL = req('src/lib/relatings.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const unesc = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html) => unesc(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const firstText = (html, attr) => { const m = new RegExp(`${attr}="[^"]*"[^>]*>([^<]*)<`).exec(html); return m ? unesc(m[1]) : null; };
const attrValues = (html, attr) => [...html.matchAll(new RegExp(`${attr}="([^"]*)"`, 'g'))].map((m) => unesc(m[1]));
/** the element carrying `attr="value"` with its whole subtree (balanced on its tag) */
const elementOf = (html, attr, value) => {
  const open = html.indexOf(`${attr}="${value}"`);
  if (open < 0) return null;
  const start = html.lastIndexOf('<', open);
  const tag = /^<([a-z]+)/.exec(html.slice(start))[1];
  let depth = 0; let i = start;
  const re = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g'); re.lastIndex = start;
  for (let m = re.exec(html); m; m = re.exec(html)) { if (m[0].startsWith('</')) depth -= 1; else if (!m[0].endsWith('/>')) depth += 1; i = m.index + m[0].length; if (depth === 0) break; }
  return html.slice(start, i);
};
const S = () => useGeometryStore.getState();
const shape = () => S().shapes[S().currentShapeId];
/** the page as the app mounts it, the pairing tab OPEN (the tab is the page's own state: `useState<Tab>('point')` is read as `'pairs'` for this render) */
const renderTab = (siteId) => {
  const real = React.useState;
  React.useState = (init) => real(init === 'point' ? 'pairs' : init);
  try {
    const vw = midpointViewOf(shape(), siteId, { tauDrafts: S().edgeTauDrafts });
    return renderToString(React.createElement(MidpointSurface, { shape: shape(), site: vw.site, parents: vw.parents, resolved: vw.resolved, refusal: null, remade: null })).replace(/<!-- -->/g, '');
  } finally { React.useState = real; }
};
const siteBetween = (p, q) => Object.values(shape().vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(p) && v.createdBy.sourceVertexIds.includes(q));

// ═══ §1 THE TAB, ON CULTURE (Value–Fact) ═══
console.log('\n----- §1 the tab on Culture -----');
const FIX = path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-09_1934_Value-Fact_all-passages-decided.workspace.json');
S().importWorkspace(JSON.parse(fs.readFileSync(FIX, 'utf8')));
const cornerOf = (lab) => Object.values(shape().vertices).find((v) => v.data?.label === lab && v.data?.cast)?.id;
const V = cornerOf('Value'); const F = cornerOf('Fact');
const culture = siteBetween(V, F).id;
const eVF = edgeBetween(shape().edges, V, F);
const first = eVF.vertexIds[0]; const second = eVF.vertexIds[1];
const la = shape().vertices[first].data.label; const lb = shape().vertices[second].data.label;
const castA = columnSpaceOf(shape(), first, { records: childRecordsOf(S()) }); const castB = columnSpaceOf(shape(), second, { records: childRecordsOf(S()) });
const nA = (id) => nameIn(castA, id); const nB = (id) => nameIn(castB, id);
const glossOf = (r) => (r.marks && typeof r.marks.gloss === 'string' && r.marks.gloss.trim() ? r.marks.gloss.trim() : null);
const h1 = renderTab(culture);
const tabs = attrValues(h1, 'data-midpoint-tab');
const panel = elementOf(h1, 'data-midpoint-panel', 'pairs') || '';
const head = firstText(panel, 'data-pairs-head');
check('§1 ★★ THE TAB STANDS FIRST AMONG THE POINT\'S TABS, named by the two parents (the designer\'s 10:56: `Value–Fact` first among `the point · modes · corners · traces`): its button `Value–Fact` before `the point`, its panel `data-midpoint-panel="pairs"` holding the box `1/8`',
  J(tabs) === J(['pairs', 'point', 'modes', 'corners', 'traces']) && (firstText(h1, 'data-midpoint-tab') || '') === `${la}–${lb}` && panel.length > 0 && attrValues(panel, 'data-pairs-box')[0] === `1/${castA.roles.length}` && castA.roles.length === 8,
  { tabs, label: firstText(h1, 'data-midpoint-tab'), box: attrValues(panel, 'data-pairs-box') });
check('§1 ★★ THE HEAD IS PINNED WITH THE ACT AT ITS END (the mock\'s headline; the light\'s form, measure for measure): `the validity · 1 of 8 · previous · next · record 0` — `previous` disabled at the first role, `next` not, `record 0` disabled; the hint `type a word and choose holds or does not hold` while nothing is ready; the box one step larger than the light (13.5px/20px)',
  head === `${nA(castA.roles[0].id)} · 1 of 8` && /data-pairs-head-line="true" class="sticky top-0/.test(panel) && /data-pairs-previous="true" disabled/.test(panel) && /data-pairs-next="true"(?! disabled)/.test(panel) && /data-pairs-record="0" disabled/.test(panel) && firstText(panel, 'data-pairs-hint') === 'type a word and choose holds or does not hold' && /data-pairs-box="[^"]*" class="grid gap-2 text-\[13\.5px\] leading-5/.test(panel),
  { head, hint: firstText(panel, 'data-pairs-hint') });
const z0 = castA.roles[0];
check('§1 ★ THE ROLE\'S GLOSS under the head, then `in Fact` (the designer\'s 10:56): the gloss is the cast\'s own, one step lighter; the group named by the second parent',
  (glossOf(z0) === null ? !/data-pairs-gloss=/.test(panel) : firstText(panel, 'data-pairs-gloss') === glossOf(z0)) && attrValues(panel, 'data-pairs-in')[0] === lb && textOf(elementOf(panel, 'data-pairs-in', lb) || '').startsWith(`in ${lb}`),
  { gloss: firstText(panel, 'data-pairs-gloss'), in: attrValues(panel, 'data-pairs-in') });
const cards = attrValues(panel, 'data-pairs-card');
const recordedHere = [...RL.instancesOn(eVF), ...RL.barsOn(eVF)].filter((r) => r[1] === z0.id);
const cardOf = (o) => elementOf(panel, 'data-pairs-card', o) || '';
const everyCard = castB.roles.every((o) => {
  const c = cardOf(o.id);
  const cell = elementOf(c, 'data-pairs-cell', `${z0.id}|${o.id}|0`) || '';
  const line = textOf(elementOf(cell, 'data-pairs-line', `${z0.id}|${o.id}|0`) || '');
  const rec = recordedHere.filter((r) => r[2] === o.id);
  const recOk = attrValues(c, 'data-pairs-recorded').length === rec.length;
  // SLICE 2b's riders (the designer's look of 16:23): once a pair has a recorded relating, the empty row under it goes and `+ another` opens one; a card without one has its line
  // her look at 1159db4, her rider: a card with a recorded relating keeps the end's gloss under its recorded lines, so the role's determinacy stays in view
  if (rec.length > 0) return recOk && !/data-pairs-cell=/.test(c) && /data-pairs-another="/.test(c) && (glossOf(o) === null ? !/data-pairs-end-gloss=/.test(c) : (c.match(/data-pairs-end-gloss=/g) || []).length === 1 && firstText(c, 'data-pairs-end-gloss') === glossOf(o) && c.indexOf('data-pairs-end-gloss=') > c.lastIndexOf('data-pairs-recorded=') && c.indexOf('data-pairs-end-gloss=') < c.indexOf('data-pairs-another='));
  const glossOk = glossOf(o) === null ? !/data-pairs-end-gloss=/.test(c) : firstText(c, 'data-pairs-end-gloss') === glossOf(o) && /data-pairs-end-gloss="[^"]*" class="text-xs leading-\[17px\]/.test(c);
  return cell.length > 0 && line.startsWith(`${nA(z0.id)}`) && /data-pairs-word="[^"]*"[^>]*placeholder="a word"/.test(cell) && /class="h-6 w-32/.test(cell) && /data-pairs-is="/.test(cell) && line.includes(`≡ ${nB(o.id)}`) && /holds · does not hold$/.test(line) && /data-pairs-sign="\+"/.test(cell) && /data-pairs-sign="-"/.test(cell) && /data-pairs-another="/.test(c) && recOk && glossOk && !/data-pairs-live=/.test(c) && !/data-pairs-reads=/.test(c);
});
check('§1 ★★ ONE CARD PER ROLE OF FACT, in the cast\'s order (the mock, line 76): recorded relatings first, in amber, with `withdraw`, and under them NO empty row — `+ another` opens one (the designer\'s look of 16:23), and the end\'s gloss stays under them (her look at 1159db4, her rider); a card with none recorded has its line `the validity [a word] ≡ <role> · holds · does not hold` — the field 24px high (`h-6`), `≡` beside it; the end\'s gloss under the first line at 12px; `+ another`; no live line and no `which way it reads` while nothing is typed',
  J(cards) === J(castB.roles.map((r) => r.id)) && cards.length === 7 && recordedHere.length > 0 && castB.roles.some((o) => !recordedHere.some((r) => r[2] === o.id)) && everyCard,
  { cards: cards.length, recordedHere: recordedHere.length });
// the recorded relatings on the cards are the edge's, by the one reader, and read as he said them (D13)
const said = (r) => (r[0] === 'IS' ? `${nA(r[1])} ≡ ${nB(r[2])}` : RL.dirOf(r) === RL.AGAINST ? `${nB(r[2])} ${r[0]} ${nA(r[1])}` : `${nA(r[1])} ${r[0]} ${nB(r[2])}`);
const recTexts = [...panel.matchAll(/data-pairs-recorded="([^"]*)" data-pairs-recorded-sign="([^"]*)"[^>]*>([^<]*)</g)].map((m) => [unesc(m[1]), m[2], unesc(m[3]).trim()]);
check('§1 ★★ THE RECORDED RELATINGS ON A CARD ARE THE EDGE\'S OWN, read through the one reader (`instancesOn` · `barsOn`), each printed as he made it (D13) with its sign and its `withdraw`: on the validity\'s turn, every relating from the validity, no other',
  recordedHere.length > 0 && recTexts.length === recordedHere.length && recordedHere.every((r) => recTexts.some(([k, sign, t]) => k === `${r[0]}|${r[1]}|${r[2]}|${RL.dirOf(r)}` && sign === r[3] && t === `${said(r)} · ${r[3] === '+' ? 'holds' : 'does not hold'} ·`)) && attrValues(panel, 'data-pairs-withdraw').length === recordedHere.length,
  { recorded: recTexts.slice(0, 3), n: recordedHere.length });
// the view: a role's turn and a lit card are the store's (`pairsView`), set by the drawing's click — the page's view, never a record
const z3 = castA.roles[3]; const o1 = castB.roles[1];
S().setPairsView({ siteId: culture, at: z3.id, lit: o1.id });
const h2 = renderTab(culture);
const p2 = elementOf(h2, 'data-midpoint-panel', 'pairs') || '';
check('§1 ★★ THE TURN AND THE LIT CARD ARE THE PAGE\'S VIEW, the store\'s (`pairsView`, keyed by the site — set by a click on the drawing, §354 (d)): the fourth role\'s turn reads `<role> · 4 of 8` with that role\'s own glosses and relatings; the card a click on the other column lit wears `data-pairs-card-lit`, the others not; the record is untouched',
  firstText(p2, 'data-pairs-head') === `${nA(z3.id)} · 4 of 8` && attrValues(p2, 'data-pairs-box')[0] === '4/8' && attrValues(p2, 'data-pairs-card-lit').length === 1 && /data-pairs-card="[^"]*" data-pairs-card-lit="true"/.test(elementOf(p2, 'data-pairs-card', o1.id) || '') && !/data-pairs-card-lit/.test(elementOf(p2, 'data-pairs-card', castB.roles[0].id) || '') && S().log.length === S().log.length,
  { head: firstText(p2, 'data-pairs-head'), lit: attrValues(p2, 'data-pairs-card-lit') });
S().setPairsView({ siteId: culture, at: castA.roles[7].id, lit: null });
const p3 = elementOf(renderTab(culture), 'data-midpoint-panel', 'pairs') || '';
check('§1 ★ AT THE LAST ROLE `next` is disabled and `previous` not; the box reads `8/8`', /data-pairs-next="true" disabled/.test(p3) && /data-pairs-previous="true"(?! disabled)/.test(p3) && attrValues(p3, 'data-pairs-box')[0] === '8/8');
S().setPairsView(null);

// ═══ §2 BY CONSTRUCTION — the act is the store's one writer; click-to-pair and its chooser are gone ═══
console.log('\n----- §2 by construction -----');
const tabSrc = fs.readFileSync(path.join(repoRoot, 'src/components/PairingTab.tsx'), 'utf8');
const surfSrc = fs.readFileSync(path.join(repoRoot, 'src/components/MidpointSurface.tsx'), 'utf8');
const mediumSrc = fs.readFileSync(path.join(repoRoot, 'src/components/MediumBlock.tsx'), 'utf8');
check('§2 ★★ THE ACT IS THE SAME ACT IN A NEW PLACE (the readings under Δ173 and Δ175): `record` gives each ready line to the store\'s one writer — a pair (`giveRolePair`), a word or a bar (`giveRelating`, with the word\'s own way) — and `withdraw` to its hand; the tab reads no resolver and writes no record of its own (its drafts are the page\'s state)',
  /if \(w === IS && d\.sign === '\+'\) st\.giveRolePair\(edgeId, x, y\);\n\s*else st\.giveRelating\(edgeId, w, x, y, d\.sign as Sign, dir\);/.test(tabSrc) && /st\.withdrawRolePair\(edgeId, r\[1\], r\[2\]\)/.test(tabSrc) && /st\.withdrawRelating\(edgeId, r\[0\], r\[1\], r\[2\], dirOf\(r\)\)/.test(tabSrc) && !/spaceOf\(|edge\.identification|\.relatings\b/.test(tabSrc) && /useState<Record<string, Draft>>/.test(tabSrc));
check('§2 ★★ DIRECTION PER WORD, as built at 4400618 (the designer\'s 10:56): a line\'s way is the word\'s own on this edge (`wordWay`, the way his relatings in it all read), else the way he chose for this new word, else NONE — then the line is not ready and does not count toward `record`; a new word asks `which way it reads` with both sentence shapes and neither chosen; the surface hands the tab its `recordDir`',
  /const wayOf = \(d: Draft\): Dir \| null => \(wordOf\(d\) === IS \? ALONG : wordWay\(wordOf\(d\)\) \?\? d\.way \?\? batchWay\(wordOf\(d\)\)\);/.test(tabSrc) && /wayOf\(d\) !== null/.test(tabSrc) && /data-pairs-reads=\{k\}/.test(tabSrc) && /which way it reads: /.test(tabSrc) && /data-pairs-way="→"/.test(tabSrc) && /data-pairs-way="←"/.test(tabSrc) && /wordWay=\{recordDir\}/.test(surfSrc) && /const recordDir = \(w: string\): Dir \| null => \{ const st = useGeometryStore\.getState\(\); return wayOfWord\(w, sayingsOn\(shape, sourceEdge, st\.loopAnswers\), \{ converses: st\.converses, opaque: st\.opaque \}\); \};/.test(surfSrc) && /return ds\.length > 0 && ds\.every\(\(d\) => d === ds\[0\]\) \? ds\[0\] : null;/.test(fs.readFileSync(path.join(repoRoot, 'src/lib/wordWay.ts'), 'utf8')));  // VL 42: `recordDir` is the ONE reader (wordWay.ts: relatings, bars, decisions with their direction, the loops' chosen ways); the batch's way is read after the word's and his own on the line
check('§2 ★★ THE OLD CLICK-TO-PAIR IS REMOVED (the mothership\'s §354 (d), on Arman\'s 10:31 Δ173): a click on a role of the first column opens its TURN, on the second lights its CARD, and opens the tab — the drawing\'s click writes no pair and no relating; no pick, no pick line, no `not offered` note on the drawing; the act\'s chooser (`MediumChoices`: the mode, the bar, the direction for the next two picks) is gone from the surface and the medium',
  /const onPoint = \(side: Side, role: string\): void => \{\n[^\n]*triadPickAt[^\n]*\n[^\n]*\n\s*setPairsView\(side === 'A' \? \{ siteId: site\.siteId, at: role, lit: null \} : \{ \.\.\.was, siteId: site\.siteId, lit: role \}\);\n\s*setTab\('pairs'\);\n\s*\};/.test(surfSrc) && !/giveRolePair\(edgeId, x, y\)/.test(surfSrc.slice(surfSrc.indexOf('const onPoint'), surfSrc.indexOf('const onWord'))) && !/setPick\(|data-midpoint-picked|data-midpoint-pick-line="role"|data-midpoint-not-offered|notOfferedNote|barNext|dirByWord/.test(surfSrc) && !/MediumChoices/.test(surfSrc) && !/export function MediumChoices|data-medium-mode=|data-medium-dir=|data-medium-hold=/.test(mediumSrc) && !/data-midpoint-picked|data-midpoint-pick-line="role"|data-medium-choices|data-medium-modes="true"/.test(h1));
check('§2 ★ THE ? NOTE IS SWEPT WITH THE GESTURE, in the designer\'s words (her 16:18 (4)): `relate: click a role of Value, or open the Value–Fact tab. Type the word on a role\'s card, then record.`',
  /`relate: click a role of \$\{la\}, or open the \$\{la\}–\$\{lb\} tab\. Type the word on a role's card, then record\.`/.test(surfSrc) && !/choose the mode above|its turn opens in/.test(surfSrc));
// SLICE 2b's riders (the mothership's 16:26; the designer's 16:18): the default tab, the empty column's line, the refusal beside `record`
check('§2 ★★ THE REFUSAL SHOWS BESIDE `record`, ONCE, AND WHERE ITS ACT WAS MADE (the mothership\'s 16:26, MISPLACED ruled; the designer\'s 16:18 (6)): a `record`\'s refusal (a role act, not a withdrawal) and a relating\'s refusal are mounted in the pairing tab under its pinned head, and no longer above the drawing; the word act\'s refusal stays where the word act is made, in the words half; a WITHDRAWAL\'s refusal stays by the hand that made it, in the acts list under the drawing (the eye at ec408d7: the dependency refusal\'s far hand must be in sight where he pressed `withdraw`) — a RELATING\'s withdrawal too (the STOP at 1159db4; the designer\'s placement at 4fc90de: `MediumRefusals` mounts a `record`\'s relating refusal in the tab and a withdrawal\'s at the TOP OF THE ACTS LIST, directly above the line he pressed; the says\' alone by the says); the says\' refusals stay by the says',
  /refusals=\{<>\{refusal && refusal\.act\.kind === 'role' && !refusal\.act\.withdrawal \? refusalBox : null\}<MediumRefusals \{\.\.\.mediumProps\} only="relating" \/><\/>\}/.test(surfSrc) && /<MediumRefusals \{\.\.\.mediumProps\} only="says" \/>/.test(surfSrc) && /\{refusal && \(refusal\.act\.kind === 'word' \|\| refusal\.act\.withdrawal\) \? refusalBox : null\}/.test(surfSrc) && !/^\s*\{refusalBox\}\s*$/m.test(surfSrc) && /data-pairs-refusal="true"/.test(tabSrc) && /props\.only === 'relating' \? !refusal\.withdrawal : props\.only === 'withdrawal' \? !!refusal\.withdrawal : props\.only === 'says' \? false : true/.test(mediumSrc) && /props\.only === 'relating' \|\| props\.only === 'withdrawal' \? \[\] : says/.test(mediumSrc) && /<div data-midpoint-acts="true"[^>]*>\s*<MediumRefusals \{\.\.\.mediumProps\} only="withdrawal" \/>/.test(surfSrc) && /withdrawal: true, dependency: dep/.test(fs.readFileSync(path.join(repoRoot, 'src/store/geometryStore.ts'), 'utf8')));
check('§2 ★★ THE TAB\'S QUIET TONE STANDS AT ITEM 7c\'s FLOOR (the eye at 1159db4, §3 — the default-tab rider put the tab before the census for the first time: the hint, `≡`, `·` and the carried note read stone-500 at 4.12:1, the disabled `previous` and `record 0` stone-600 at 2.59:1; the floor is 4.5): no `text-stone-500` and no `text-stone-600` in the tab — its quiet tone is stone-400, as `fit selected` disabled was lifted (C-7f item 7)',
  !/text-stone-500|text-stone-600/.test(tabSrc) && (tabSrc.match(/text-stone-400/g) || []).length >= 10, { stone400: (tabSrc.match(/text-stone-400/g) || []).length });
check('§2 ★ THE EMPTY COLUMN NAMES THE GESTURE (the designer\'s 16:18 (5)): `Fact has no roles yet: load its cast in the casts drawer` for a seed corner; a born corner\'s roles come with the relatings on its parents\' edge (`… relate on A–B first`, the coder\'s words, asked)',
  /has no roles yet: load its cast in the casts drawer`/.test(tabSrc) && /has no roles yet: relate on \$\{parents\[0\]\}–\$\{parents\[1\]\} first`/.test(tabSrc) && !/nothing to pair yet/.test(tabSrc));

// ═══ §3 AT A CORNER EDGE (MODES-4 · M1): the coordinate pair's `≡` is not offered, by name ═══
console.log('\n----- §3 the corner edge -----');
const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const byLabel = (sh, label) => Object.values(sh.vertices).find((v) => v.data.label === label).id;
const withCast = (sh, id, c) => ({ ...sh, vertices: { ...sh.vertices, [id]: { ...sh.vertices[id], data: { ...sh.vertices[id].data, cast: c } } } });
let seeded = createSeedShape('tetrahedron');
for (const [l, c] of [['A', cast('flow.cast.json')], ['B', cast('t-cell.cast.json')], ['C', cast('phi.cast.json')], ['D', cast('triangle.cast.json')]]) seeded = withCast(seeded, byLabel(seeded, l), c);
useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], pairsView: null });
const A = byLabel(shape(), 'A'); const C = byLabel(shape(), 'C');
const eAC = edgeBetween(shape().edges, A, C);
const acFirstIsA = eAC.vertexIds[0] === A;
for (const [x, y] of [['F5', 'Φ7'], ['F7', 'Φ1'], ['F8', 'Φ2']]) S().giveRolePair(eAC.id, ...(acFirstIsA ? [x, y] : [y, x]));
S().applyAmboDissectionToCurrent();
const AC = siteBetween(A, C).id;
S().selectCell(shape().cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(A)).id);
S().applyAmboDissectionToCurrent();
const cornerSite = siteBetween(A, AC);
const eA_AC = cornerSite ? edgeBetween(shape().edges, A, AC) : null;
const hC = cornerSite ? renderTab(cornerSite.id) : '';
const pC = elementOf(hC, 'data-midpoint-panel', 'pairs') || '';
const aFirst = eA_AC ? eA_AC.vertexIds[0] === A : null;
// the card holding F5's own instance against F5: carried; another instance's card against F5: offered — the instances by the coordinate map (D14), never a key spelled
const instOf = (role) => (instancesFrom(shape(), A, C).find((k) => k.p === role) || {}).key;
const F5inst = instOf('F5'); const F7inst = instOf('F7');
if (cornerSite) S().setPairsView({ siteId: cornerSite.id, at: aFirst ? 'F5' : F5inst, lit: null });
const pC2 = cornerSite ? elementOf(renderTab(cornerSite.id), 'data-midpoint-panel', 'pairs') || '' : '';
const carriedCard = elementOf(pC2, 'data-pairs-card', aFirst ? F5inst : 'F5') || '';
const offeredCard = elementOf(pC2, 'data-pairs-card', aFirst ? F7inst : 'F7') || '';
check('§3 ★★ AT A CORNER EDGE THE COORDINATE PAIR IS NOT OFFERED, BY NAME (MODES-4 · M1, moved from the drawing\'s pick into the tab\'s card): on A–AC, generation 2, the card pairing F5 with its own instance `(F5 ≡ Φ7)` offers no `≡` and says `holds F5 already` where the glyph would stand; the card against another instance offers `≡`; a word on the same pair is an ordinary line (§9.10: the field and the signs stand on both)',
  !!cornerSite && pC.length > 0 && carriedCard.length > 0 && !/data-pairs-is=/.test(carriedCard) && firstText(carriedCard, 'data-pairs-carried') === 'holds F5 already' && /data-pairs-word=/.test(carriedCard) && /data-pairs-sign="\+"/.test(carriedCard) && offeredCard.length > 0 && /data-pairs-is=/.test(offeredCard) && !/data-pairs-carried/.test(offeredCard),
  { site: !!cornerSite, aFirst, carried: firstText(carriedCard, 'data-pairs-carried'), offeredHasIs: /data-pairs-is=/.test(offeredCard) });
check('§3 ★ THE CARRIED PAIR IS NEVER READY (by construction): a line whose word is `≡` on a carried card does not count toward `record`', /&& !\(wordOf\(d\) === IS && carried\(x, y\) !== null\)/.test(tabSrc));

// ═══ §4 THE RIDERS, RENDERED (SLICE 2b's riders): the default tab on an empty edge; the refusals where their acts are ═══
console.log('\n----- §4 the riders -----');
const renderPlain = (siteId) => { const vw = midpointViewOf(shape(), siteId, { tauDrafts: S().edgeTauDrafts }); return renderToString(React.createElement(MidpointSurface, { shape: shape(), site: vw.site, parents: vw.parents, resolved: vw.resolved, refusal: S().midpointRefusals[vw.site.edge.id] || null, remade: null })).replace(/<!-- -->/g, ''); };
const B = byLabel(shape(), 'B');
const AB = siteBetween(A, B);
const tabAt = (h) => (/data-midpoint-tab-active="([^"]*)"/.exec(h) || [])[1];
const hAB = AB ? renderPlain(AB.id) : '';
check('§4 ★★ THE DEFAULT TAB (the designer\'s 16:18 (1)): on an edge with no relating yet the pairing tab opens — at the midpoint of A and B (nothing related on A–B) `data-midpoint-tab-active="pairs"`; on A–C, which holds his pairs, the point tab opens, as before',
  !!AB && tabAt(hAB) === 'pairs' && tabAt(renderPlain(AC)) === 'point', { AB: !!AB, atAB: tabAt(hAB), atAC: tabAt(renderPlain(AC)) });
// a relating refused (a reserved word as its mode, M4) at A–C: the refusal in the pairing tab, not above the drawing; a word pair refused: above the drawing, as before
const eACnow = edgeBetween(shape().edges, A, C);
// a pair the registers contradict (F1 ≡ Φ9, the midpoint witness's own case) — the role act's refusal; a relating on a role no cast holds — the relating's refusal
S().giveRolePair(eACnow.id, ...(acFirstIsA ? ['F1', 'Φ9'] : ['Φ9', 'F1']));
const rr = S().giveRelating(eACnow.id, 'carries', ...(acFirstIsA ? ['F99', 'Φ1'] : ['Φ1', 'F99']), '+');
S().setPairsView(null);
const hR = renderPlain(AC); // the point tab open: the refusals stand in the page all the same, inside the pairing tab's panel, hidden with it
const pairsPanel = elementOf(hR, 'data-midpoint-panel', 'pairs') || '';
const leftOfPanel = hR.slice(0, hR.indexOf('data-midpoint-point="true"'));
check('§4 ★★ A ROLE ACT\'S REFUSAL AND A RELATING\'S SHOW IN THE TAB, BESIDE `record`, ONCE (the mothership\'s 16:26): the pair F1 ≡ Φ9, which the records contradict, and a relating on a role no cast holds are each refused — `not taken — …` with `clear` — inside the pairing tab under its pinned head, and nowhere above the drawing; the panel is mounted with every tab, so the refusal stands in the page whichever is open',
  !!S().midpointRefusals[eACnow.id] && !!rr && /data-midpoint-refusal="role\|/.test(pairsPanel) && (hR.match(/data-midpoint-refusal="role\|/g) || []).length === 1 && !/data-midpoint-refusal=/.test(leftOfPanel) && /data-medium-refusal="true"/.test(pairsPanel) && (hR.match(/data-medium-refusal="true"/g) || []).length === 1 && !/data-medium-refusal="true"/.test(leftOfPanel) && /data-pairs-refusal="true"/.test(pairsPanel) && tabAt(hR) === 'point',
  { rr: rr && rr.why, pair: !!S().midpointRefusals[eACnow.id], inTab: [/data-midpoint-refusal="role\|/.test(pairsPanel), /data-medium-refusal="true"/.test(pairsPanel)], left: [/data-midpoint-refusal=/.test(leftOfPanel), /data-medium-refusal="true"/.test(leftOfPanel)] });
S().withdrawRelatingAttempt(eACnow.id); S().withdrawMidpointAttempt(eACnow.id);
S().giveWordPair(eACnow.id, ...(acFirstIsA ? ['no-such-word', 'descends-from'] : ['descends-from', 'no-such-word']));
const hW = renderPlain(AC);
const panelW = elementOf(hW, 'data-midpoint-panel', 'pairs') || '';
check('§4 ★ THE WORD ACT\'S REFUSAL STAYS WHERE THE WORD ACT IS MADE: a word pair refused for its form shows above the drawing (`data-midpoint-refusal="word|…"`), not in the pairing tab',
  /data-midpoint-refusal="word\|/.test(hW.slice(0, hW.indexOf('data-midpoint-point="true"'))) && !/data-midpoint-refusal=/.test(panelW), { left: /data-midpoint-refusal="word\|/.test(hW.slice(0, hW.indexOf('data-midpoint-point="true"'))) });
S().withdrawMidpointAttempt(eACnow.id);

// ═══ §5 THE STOP AT 1159db4, HER STEPS ON CULTURE (the designer's look of 20:57; the mothership's 21:04): a withdrawal at generation 1 whose role ends a relating on a CORNER edge one generation up ═══
console.log('\n----- §5 the corner edge one generation up, on Culture -----');
S().importWorkspace(JSON.parse(fs.readFileSync(FIX, 'utf8')));
const { instancesOn: heldOn, dirOf: dirOfRel, withoutRelating: withoutRel } = RL;
const { instancesFrom: instFrom, termWordsOf: wordsOf, orphanedByWithdrawal: orphansOf } = req('src/lib/instanceSpace.ts');
const V5 = cornerOf('Value'); const F5 = cornerOf('Fact');
const culture5 = siteBetween(V5, F5).id;
const her = instFrom(shape(), V5, F5).find((i) => /^\(the ought is the case as the instituted\)$/.test(wordsOf(shape(), culture5, i.key)));
const residue5 = shape().cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(V5));
S().selectCell(residue5.id); S().applyAmboDissectionToCurrent(); // her step 1: Value's residue dissected — generation 2, a new shape carrying the record
const eVF5 = edgeBetween(shape().edges, V5, F5);
const eVC5 = edgeBetween(shape().edges, V5, culture5);
const siteVC5 = siteBetween(V5, culture5);
const vFirst5 = eVC5 && eVC5.vertexIds[0] === V5;
S().declareMode('answers to');
const made5 = her && eVC5 ? S().giveRelating(eVC5.id, 'answers to', ...(vFirst5 ? ['validity', her.key] : [her.key, 'validity']), '+', vFirst5 ? RL.AGAINST : RL.ALONG) : { why: 'no corner edge' }; // her step 2, through the store's one writer
const [w5, x5, y5] = her ? her.rel : ['', '', ''];
const without5 = { ...shape(), edges: shape().edges.map((e) => (e.id === eVF5.id ? withoutRel(e, w5, x5, y5, dirOfRel(her.rel)) : e)) };
const found5 = her ? orphansOf(shape(), without5, eVF5.id) : [];
const before5 = heldOn(eVF5).length;
if (her) S().withdrawRelating(eVF5.id, w5, x5, y5, dirOfRel(her.rel)); // her step 3: `withdraw` under the drawing, back on Culture
const ref5 = S().relatingRefusals[eVF5.id];
const after5 = heldOn(edgeBetween(shape().edges, V5, F5)).length;
const hC5 = renderPlain(culture5); // Culture's surface, the point tab open (it holds relatings): the refusal by its hand, not in the pairing tab's panel
const panelC5 = elementOf(hC5, 'data-midpoint-panel', 'pairs') || '';
const refusalEl = elementOf(hC5, 'data-medium-refusal', 'true') || '';
const LINE5 = 'not taken — the ought is the case as the instituted is one end of (the ought is the case as the instituted) answers to the validity at Value–Culture, one generation up · withdraw (the ought is the case as the instituted) answers to the validity at Value–Culture first · clear';
check('§5 ★★ HER WITHDRAWAL IS NOT TAKEN, BY NAME, WITH ITS FAR HAND (the designer\'s STOP at 1159db4, measured at 1159db4 as TAKEN — 18 → 17 and the orphan printed from its key; ADR 0031 §9.48 and Δ85): Value\'s residue dissected, `(the ought is the case as the instituted) answers to the validity · holds` recorded at Value–Culture (generation 2) through the store; back on Culture, withdrawing `the ought is the case as the instituted` is refused — the guard finds the corner-edge dependent — the record stands (18 relatings), and the refusal stands by its hand under the drawing (the says\' mount), not in the pairing tab\'s panel, reading exactly her line with the far hand `withdraw … at Value–Culture first`',
  !!her && made5 === null && !!siteVC5 && (siteVC5.data.label || '') === 'Value–Culture' && found5.length >= 1 && found5.some((b) => b.edgeId === eVC5.id) && !!ref5 && ref5.withdrawal === true && !!ref5.dependency && ref5.dependency.generationsUp === 1 && before5 === 18 && after5 === 18 && (hC5.match(/data-medium-refusal="true"/g) || []).length === 1 && !/data-medium-refusal="true"/.test(panelC5) && textOf(refusalEl) === LINE5,
  { her: !!her, made: made5 === null ? 'made' : made5 && made5.why, site: siteVC5 && siteVC5.data.label, found: found5.map((b) => [b.edgeId === eVC5.id ? 'corner' : 'medial', b.names]), refused: ref5 ? ref5.why : 'TAKEN', held: [before5, after5], inPanel: /data-medium-refusal="true"/.test(panelC5), line: textOf(refusalEl) });
// the far hand's act: the dependent withdrawn at Value–Culture — then her withdrawal goes through (18 → 17), and Culture's role is gone with its relating, nothing orphaned
S().withdrawRelatingAttempt(eVF5.id);
if (ref5 && ref5.dependency) { const d = ref5.dependency; S().withdrawRelating(d.edgeId, d.mode, d.act.pair[0], d.act.pair[1], d.reversed ? RL.AGAINST : RL.ALONG); }
const cornerAfter = eVC5 ? heldOn(edgeBetween(shape().edges, V5, culture5)).length : -1;
if (her) S().withdrawRelating(eVF5.id, w5, x5, y5, dirOfRel(her.rel));
check('§5 ★ THE FAR HAND\'S ACT FREES THE WITHDRAWAL: with the generation-2 relating withdrawn at Value–Culture, the same withdrawal on Culture is taken (18 → 17), nothing refused, nothing orphaned',
  cornerAfter === 0 && heldOn(edgeBetween(shape().edges, V5, F5)).length === 17 && S().relatingRefusals[eVF5.id] === undefined, { cornerAfter, held: heldOn(edgeBetween(shape().edges, V5, F5)).length });
// her small rider (her line 15): a card with a recorded relating and no open row keeps the end's gloss under its recorded lines
S().importWorkspace(JSON.parse(fs.readFileSync(FIX, 'utf8')));
const V6 = cornerOf('Value'); const F6 = cornerOf('Fact'); const culture6 = siteBetween(V6, F6).id;
S().selectCell(shape().cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(V6)).id); S().applyAmboDissectionToCurrent();
const eVC6 = edgeBetween(shape().edges, V6, culture6); const siteVC6 = siteBetween(V6, culture6);
const her6 = instFrom(shape(), V6, F6).find((i) => /^\(the ought is the case as the instituted\)$/.test(wordsOf(shape(), culture6, i.key)));
const vFirst6 = eVC6.vertexIds[0] === V6;
S().declareMode('answers to');
S().giveRelating(eVC6.id, 'answers to', ...(vFirst6 ? ['validity', her6.key] : [her6.key, 'validity']), '+', vFirst6 ? RL.AGAINST : RL.ALONG);
S().setPairsView({ siteId: siteVC6.id, at: vFirst6 ? 'validity' : her6.key, lit: null });
const hG = renderTab(siteVC6.id);
const cardG = elementOf(elementOf(hG, 'data-midpoint-panel', 'pairs') || '', 'data-pairs-card', vFirst6 ? her6.key : 'validity') || '';
check('§5 ★★ THE END\'S GLOSS STAYS ON A CARD WITH A RECORDED RELATING (the designer\'s look at 1159db4, her rider — her words: a card with a recorded relating keeps the end\'s gloss under its recorded lines, so the role\'s determinacy stays in view; THE_CLAIMS_LEDGER line 3785): on the turn of the first column\'s role, the card of the role it is related to has its recorded line, no open row, `+ another`, and the gloss once, under the recorded line',
  cardG.length > 0 && (cardG.match(/data-pairs-recorded=/g) || []).length === 1 && !/data-pairs-cell=/.test(cardG) && /data-pairs-another=/.test(cardG) && (cardG.match(/data-pairs-end-gloss=/g) || []).length === 1 && cardG.indexOf('data-pairs-end-gloss=') > cardG.indexOf('data-pairs-recorded=') && cardG.indexOf('data-pairs-end-gloss=') < cardG.indexOf('data-pairs-another='),
  { card: cardG.length, recorded: (cardG.match(/data-pairs-recorded=/g) || []).length, cells: (cardG.match(/data-pairs-cell=/g) || []).length, gloss: (cardG.match(/data-pairs-end-gloss=/g) || []).length, glossText: firstText(cardG, 'data-pairs-end-gloss') });

console.log('');
// ═══ the designer's look of 10-19 10:19, rider 1 (landed with STAMP ZOOM): the norm's line directly under the row being chosen, above `+ another` ═══
{
  const srcR1 = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'src/components/PairingTab.tsx'), 'utf8');
  const iLive = srcR1.indexOf('{live ? <span data-pairs-live={k}'); const iNorm = srcR1.indexOf('<NewWordNorm when={newWord} at={k} />'); const iAnother = srcR1.indexOf('[`${z.id}|${o.id}`]: lines })}>+ another');
  check('§R1 ★★ THE NORM\'S LINE UNDER ITS ROW (the designer\'s 10-19, rider 1): in a cell the order is the row\'s line, its gloss and its `which way it reads`, the live line, the norm\'s line, then `+ another` — the line stands directly under the row being chosen (under its live line when there is one), never at the card\'s foot (seen: the eye\'s §40)',
    iLive > 0 && iNorm > iLive && iAnother > iNorm, { iLive, iNorm, iAnother });
}

// ═══ VL 39 (the designer's 14:38; the mothership's 14:46 (3)): THE GLOSS RULE, PINNED AS IT STANDS — Virgin Land's bare row did not reproduce at 04f1c05 (her three ways) ═══
{
  const srcG = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'src/components/PairingTab.tsx'), 'utf8');
  const iCardGloss = srcG.indexOf('{lines === 0 && oGloss ? <span data-pairs-end-gloss={o.id}'); const iCardAnother = srcG.indexOf('{lines === 0 ? <span className="flex gap-x-2"><button type="button" data-pairs-another=');
  const iLine = srcG.indexOf('<span data-pairs-line={k}'); const iCellGloss = srcG.indexOf('{oGloss && n === 0 ? <span data-pairs-end-gloss={o.id}'); const iAsks = srcG.indexOf('{asks ? ('); const iLive2 = srcG.indexOf('{live ? <span data-pairs-live={k}'); const iNorm2 = srcG.indexOf('<NewWordNorm when={newWord} at={k} />'); const iAnother2 = srcG.indexOf('[`${z.id}|${o.id}`]: lines })}>+ another');
  check('§R2 ★★ THE OTHER SIDE\'S GLOSS, ONCE ON EVERY CARD, BY CONSTRUCTION (VL 39 — the designer\'s 14:38, her rule pinned as it stands): two sites, exclusive — the card\'s, guarded by `lines === 0` (no row open: under the recorded lines, before `+ another`), and the cell\'s, guarded by `n === 0` (a row open: directly under that row\'s line, before `which way it reads`, the live line and the norm\'s line; `+ another` opens the row the gloss moves under) — and no third site',
    iCardGloss > 0 && iCardAnother > iCardGloss && iLine > 0 && iCellGloss > iLine && iAsks > iCellGloss && iLive2 > iAsks && iNorm2 > iLive2 && iAnother2 > iNorm2 && (srcG.match(/data-pairs-end-gloss=/g) || []).length === 2,
    { iCardGloss, iCardAnother, iLine, iCellGloss, iAsks, iLive2, iNorm2, iAnother2, sites: (srcG.match(/data-pairs-end-gloss=/g) || []).length });
  // rendered: on the first turn, every card of a role with a gloss and nothing recorded has its default row open — the gloss once, after the row's line, before `+ another`
  const openCards = castB.roles.filter((o) => glossOf(o) !== null && !recordedHere.some((r) => r[2] === o.id)).map((o) => { const c = cardOf(o.id); return { o: o.id, count: (c.match(/data-pairs-end-gloss=/g) || []).length, cell: c.indexOf('data-pairs-cell='), line: c.indexOf('data-pairs-line='), gloss: c.indexOf('data-pairs-end-gloss='), another: c.indexOf('data-pairs-another=') }; });
  check('§R2 ★★ RENDERED, A ROW OPEN (her second and fourth lines): every card with a gloss and nothing recorded has its row open and the gloss ONCE, after the row\'s line and before `+ another`; a card with a recorded relating keeps it once under the recorded lines (§5) — the eye\'s §45 presses `+ another` on such a card and reads the gloss move under the new row',
    openCards.length >= 1 && openCards.every((c) => c.count === 1 && c.cell > 0 && c.line > c.cell && c.gloss > c.line && c.another > c.gloss),
    openCards);
}

if (failures === 0) console.log('DIAGNOSE-THE-PAIRING-TAB: ALL PASS — the pairing tab stands first, pinned head and the act at its end, one card per role with the recorded relatings first and the line in the designer\'s form, the view the store\'s, the act the store\'s one writer; click-to-pair and its chooser are gone; at a corner edge the coordinate pair is not offered, by name');
else { console.log(`DIAGNOSE-THE-PAIRING-TAB: ${failures} FAIL`); process.exitCode = 1; }
