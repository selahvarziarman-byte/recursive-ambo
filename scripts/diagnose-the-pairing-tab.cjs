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
  if (rec.length > 0) return recOk && !/data-pairs-cell=/.test(c) && /data-pairs-another="/.test(c) && !/data-pairs-end-gloss=/.test(c);
  const glossOk = glossOf(o) === null ? !/data-pairs-end-gloss=/.test(c) : firstText(c, 'data-pairs-end-gloss') === glossOf(o) && /data-pairs-end-gloss="[^"]*" class="text-xs leading-\[17px\]/.test(c);
  return cell.length > 0 && line.startsWith(`${nA(z0.id)}`) && /data-pairs-word="[^"]*"[^>]*placeholder="a word"/.test(cell) && /class="h-6 w-32/.test(cell) && /data-pairs-is="/.test(cell) && line.includes(`≡ ${nB(o.id)}`) && /holds · does not hold$/.test(line) && /data-pairs-sign="\+"/.test(cell) && /data-pairs-sign="-"/.test(cell) && /data-pairs-another="/.test(c) && recOk && glossOk && !/data-pairs-live=/.test(c) && !/data-pairs-reads=/.test(c);
});
check('§1 ★★ ONE CARD PER ROLE OF FACT, in the cast\'s order (the mock, line 76): recorded relatings first, in amber, with `withdraw`, and under them NO empty row — `+ another` opens one (the designer\'s look of 16:23); a card with none recorded has its line `the validity [a word] ≡ <role> · holds · does not hold` — the field 24px high (`h-6`), `≡` beside it; the end\'s gloss under the first line at 12px; `+ another`; no live line and no `which way it reads` while nothing is typed',
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
  /const wayOf = \(d: Draft\): Dir \| null => \(wordOf\(d\) === IS \? ALONG : wordWay\(wordOf\(d\)\) \?\? d\.way\);/.test(tabSrc) && /wayOf\(d\) !== null/.test(tabSrc) && /data-pairs-reads=\{k\}/.test(tabSrc) && /which way it reads: /.test(tabSrc) && /data-pairs-way="→"/.test(tabSrc) && /data-pairs-way="←"/.test(tabSrc) && /wordWay=\{recordDir\}/.test(surfSrc) && /return ds\.length > 0 && ds\.every\(\(d\) => d === ds\[0\]\) \? ds\[0\] : null;/.test(surfSrc));
check('§2 ★★ THE OLD CLICK-TO-PAIR IS REMOVED (the mothership\'s §354 (d), on Arman\'s 10:31 Δ173): a click on a role of the first column opens its TURN, on the second lights its CARD, and opens the tab — the drawing\'s click writes no pair and no relating; no pick, no pick line, no `not offered` note on the drawing; the act\'s chooser (`MediumChoices`: the mode, the bar, the direction for the next two picks) is gone from the surface and the medium',
  /const onPoint = \(side: Side, role: string\): void => \{\n[^\n]*triadPickAt[^\n]*\n[^\n]*\n\s*setPairsView\(side === 'A' \? \{ siteId: site\.siteId, at: role, lit: null \} : \{ \.\.\.was, siteId: site\.siteId, lit: role \}\);\n\s*setTab\('pairs'\);\n\s*\};/.test(surfSrc) && !/giveRolePair\(edgeId, x, y\)/.test(surfSrc.slice(surfSrc.indexOf('const onPoint'), surfSrc.indexOf('const onWord'))) && !/setPick\(|data-midpoint-picked|data-midpoint-pick-line="role"|data-midpoint-not-offered|notOfferedNote|barNext|dirByWord/.test(surfSrc) && !/MediumChoices/.test(surfSrc) && !/export function MediumChoices|data-medium-mode=|data-medium-dir=|data-medium-hold=/.test(mediumSrc) && !/data-midpoint-picked|data-midpoint-pick-line="role"|data-medium-choices|data-medium-modes="true"/.test(h1));
check('§2 ★ THE ? NOTE IS SWEPT WITH THE GESTURE, in the designer\'s words (her 16:18 (4)): `relate: click a role of Value, or open the Value–Fact tab. Type the word on a role\'s card, then record.`',
  /`relate: click a role of \$\{la\}, or open the \$\{la\}–\$\{lb\} tab\. Type the word on a role's card, then record\.`/.test(surfSrc) && !/choose the mode above|its turn opens in/.test(surfSrc));
// SLICE 2b's riders (the mothership's 16:26; the designer's 16:18): the default tab, the empty column's line, the refusal beside `record`
check('§2 ★★ THE REFUSAL SHOWS BESIDE `record`, ONCE, AND WHERE ITS ACT WAS MADE (the mothership\'s 16:26, MISPLACED ruled; the designer\'s 16:18 (6)): a `record`\'s refusal (a role act, not a withdrawal) and a relating\'s refusal are mounted in the pairing tab under its pinned head, and no longer above the drawing; the word act\'s refusal stays where the word act is made, in the words half; a WITHDRAWAL\'s refusal stays by the hand that made it, in the acts list under the drawing (the eye at ec408d7: the dependency refusal\'s far hand must be in sight where he pressed `withdraw`); the says\' refusals stay by the says',
  /refusals=\{<>\{refusal && refusal\.act\.kind === 'role' && !refusal\.act\.withdrawal \? refusalBox : null\}<MediumRefusals \{\.\.\.mediumProps\} only="relating" \/><\/>\}/.test(surfSrc) && /<MediumRefusals \{\.\.\.mediumProps\} only="says" \/>/.test(surfSrc) && /\{refusal && \(refusal\.act\.kind === 'word' \|\| refusal\.act\.withdrawal\) \? refusalBox : null\}/.test(surfSrc) && !/^\s*\{refusalBox\}\s*$/m.test(surfSrc) && /data-pairs-refusal="true"/.test(tabSrc) && /refusal && props\.only !== 'says'/.test(mediumSrc) && /props\.only === 'relating' \? \[\] : says/.test(mediumSrc));
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

console.log('');
if (failures === 0) console.log('DIAGNOSE-THE-PAIRING-TAB: ALL PASS — the pairing tab stands first, pinned head and the act at its end, one card per role with the recorded relatings first and the line in the designer\'s form, the view the store\'s, the act the store\'s one writer; click-to-pair and its chooser are gone; at a corner edge the coordinate pair is not offered, by name');
else { console.log(`DIAGNOSE-THE-PAIRING-TAB: ${failures} FAIL`); process.exitCode = 1; }
