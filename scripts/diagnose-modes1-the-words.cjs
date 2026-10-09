#!/usr/bin/env node

// DIAGNOSTIC — STAMP MODES-1 · B5 (2026-09-26): THE MEDIUM IN THE DESIGNER'S WORDS (her letter of 17:15, ratified for meaning
// §207; D2–D11), and MARKER MODES-1 · M3 (2026-09-29): her eye of 10:16 in Arman's Chrome at 7c64c61 — eleven lines read wrong,
// one cut (S1–S11, R1–R4), with the mothership's two rulings (S4 interim — LIFTED by MODES-4 · D13 and M3: a leg against the walk
// carries its direction bit, a passage has a shape, a chain from B to A is one key in the chain's own order; S5 b: no `that is`
// hand on a tension) and her §4 amendment to S11 (each light says what it goes through); MODES-4's surface forms (the designer's
// 17:32) are pinned in scripts/diagnose-modes4-the-record-and-the-sorting.cjs. EVERY
// CURED LINE IS PINNED VERBATIM AGAINST HER LETTER. The block rendered under node (react-dom/server) at the midpoint AB of the
// seeded tetrahedron and read as text:
// §0 purity and her three rules by construction · §a the counts head, the modes line (`your modes: IS ≡ carries`), the act line
// with its two states (`it holds · it does not hold`), the `add it` hand, the child line from the first relating on · §b THE
// PASSAGES where they sit — `≡` inside every sentence; a tension names what presses by its end (`against your pair — … — you
// paired F13 with r8`), no `that is "…"` hand on it; the face's; the light; the target-end pivot in the corners' view above
// (`would pair r5 otherwise: with F3 — you paired it with F1`) · §c HIS ACTS: a mode declared, a relating and a bar listed UNDER THE
// DRAWING, a passage through D (with the walk) `not yet said` with `that is not it` only, THE FALSIFIER through C (a directed leg
// against the walk: the legs as he said them, no rule applied, no `that is`, the store refusing a composed say by name), a rule,
// a say, an exception only against his rule, a not-it printed once, a disagreement across the faces on IS legs, a tension by his
// bar · §d THE STATES, R1's reasons, R2, R4 · §e the name kept with its state, R3 · §f THE DEEPER LIGHT (S11 with her §4) · §g
// Virgin Land's record · §h where every line sits.
//
// Run: node scripts/diagnose-modes1-the-words.cjs

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

const { spaceOf } = req('src/lib/spaceOf.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { parseWorkspaceImport } = req('src/lib/workspacePersistence.ts');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const { namedUnderOf } = req('src/components/MediumBlock.tsx');
const { nameStageOf } = req('src/lib/stage.ts');
const { withVerdict, sortingOf } = req('src/lib/sorting.ts');
const React = require('react');
const { renderToString } = require('react-dom/server');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json'); const triangle = cast('triangle.cast.json');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const seeded4 = () => { let s = createSeedShape('tetrahedron'); for (const [l, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', triangle]]) s = withCast(s, byLabel(s, l), c); return s; };
const reset = (seeded) => useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], rules: [], log: [], liftSelection: [], selectedCellId: null, selectedVertexId: null, selectedEdgeId: null, selectedFaceId: null });
const E = (shape, X, Y) => edgeBetween(shape.edges, byLabel(shape, X), byLabel(shape, Y));
const give = (X, Y, map) => { const e = E(cur(), X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
/** a relating AS HE SAYS IT on an edge: the record's x is its FIRST corner's role — `said(first, w, second)` */
const say = (X, Y, first, w, second, sign) => { const e = E(cur(), X, Y); const firstIsX = e.vertexIds[0] === byLabel(cur(), X); return S().giveRelating(e.id, w, firstIsX ? first : second, firstIsX ? second : first, sign); };
const storedFirst = (X, Y) => (E(cur(), X, Y).vertexIds[0] === byLabel(cur(), X) ? X : Y);
const midOf = (shape, u, v) => Object.values(shape.vertices).find((w) => w.createdBy.operation !== 'seed' && w.createdBy.sourceVertexIds.length === 2 && w.createdBy.sourceVertexIds.includes(u) && w.createdBy.sourceVertexIds.includes(v));
const NEVER = /extent|lexicon|instance|verdict|centroid|discordance|vacuous|exhausted|pocket|unruled|coherent|closed|proposal|pushout|\bpath\b|edge [A-Z]{2}\b/i;
const unesc = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').trim();
/** the elements carrying `attr`, each [value, its whole html] — BALANCED over nested elements of the same tag (a line holds inner spans and hands) */
const elementsIn = (src, attr) => {
  const out = [];
  const re = new RegExp(`<(span|div)[^>]*${attr}="([^"]*)"[^>]*>`, 'g');
  let m;
  while ((m = re.exec(src))) {
    const tag = m[1]; let depth = 1; let end = re.lastIndex;
    const tagRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'g'); tagRe.lastIndex = re.lastIndex;
    let t;
    while (depth > 0 && (t = tagRe.exec(src))) { depth += t[1] === '/' ? -1 : 1; end = tagRe.lastIndex; }
    out.push([m[2], src.slice(m.index, end)]);
  }
  return out;
};

/** the surface rendered under node at a midpoint; the medium's block as text and its lines by attribute; the listing under the drawing beside it */
const renderAt = (shape, siteId, cell) => {
  // STAMP THE-MODES-TAB: a passage sits on its CELL's card — the pair of roles chosen in the modes tab, every route of it shown (the person's
  // `all · show`); with no cell, no card
  useGeometryStore.setState({ modesView: cell ? { siteId, cell, all: true, at: 0 } : null });
  const packet = buildGeneralSitePacketPresenterReport(shape).packets.find((p) => p.trace.siteId === siteId);
  const site = midpointSiteOf(shape, siteId, packet ? packet.trace : null);
  const resolved = spaceOf(shape, siteId);
  const parents = [spaceOf(shape, site.a), spaceOf(shape, site.b)];
  const html = renderToString(React.createElement(MidpointSurface, { shape, site, parents, resolved, refusal: null, remade: null })).replace(/<!-- -->/g, '');
  const start = html.indexOf('<div data-medium="true"');
  const linesIn = (src, attr) => elementsIn(src, attr).map(([v, h]) => [v, unesc(h)]);
  if (start < 0) return { html, block: null, text: '', lines: () => [], linesAll: (attr) => linesIn(html, attr), attr: () => null, before: html };
  // the block's HTML: its own div and everything to the trace's div (the next sibling), or the end
  const after = html.indexOf('<div data-midpoint-trace="true"', start);
  const blockHtml = html.slice(start, after > 0 ? after : undefined);
  const text = unesc(blockHtml);
  const lines = (attr) => linesIn(blockHtml, attr);
  const attr = (name) => { const m = blockHtml.match(new RegExp(`<div data-medium="true"[^>]*${name}="([^"]*)"`)); return m ? m[1] : null; };
  return { html, block: blockHtml, text, lines, linesAll: (attr2) => linesIn(html, attr2), attr, before: html.slice(0, start) };
};
// STAMP THE-MODES-TAB: the corners tab's silent lines (R1's reasons read there now); the cells a route reaches; the card holding a passage
const footSilent = (r) => [...r.html.matchAll(/data-midpoint-foot-line="silent"[^>]*>([^<]*)</g)].map((m) => unesc(m[1]));
const routedCells = (r) => [...r.block.matchAll(/data-medium-cell="([^"]+)"[^>]*data-medium-cell-routes="([1-9][0-9]*)"/g)].map((m) => m[1]);
const withPassage = (shape, siteId, pred) => { for (const c of routedCells(renderAt(shape, siteId))) { const r = renderAt(shape, siteId, c); if (r.lines('data-medium-passage').some(([k, s]) => pred(k, s))) return r; } return renderAt(shape, siteId); };
const allPassages = (shape, siteId) => { const seen = new Map(); for (const c of routedCells(renderAt(shape, siteId))) for (const [k, h] of elementsIn(renderAt(shape, siteId, c).block, 'data-medium-passage')) if (!seen.has(k)) seen.set(k, h); return [...seen.entries()]; };
const passageOf = (r, x) => { const found = elementsIn(r.block, 'data-medium-passage').find(([k]) => k.startsWith(`${x}|`)); if (!found) return null; const [key, html] = found; return { key, html, text: unesc(html), says: [...html.matchAll(/data-medium-say="([^"]*)"/g)].map((s) => s[1]), attrs: (html.match(/^<span[^>]*>/) || [''])[0] }; };

// ═══ §0 PURITY AND HER THREE RULES ═══
console.log('THE WORDS — B5 + M3 (MODES-1)\n\n----- §0 purity and her three rules -----');
const src = readLf('src/components/MediumBlock.tsx');
const textOf = (s) => s.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const printed = [...textOf(src).matchAll(/`([^`]*)`|'([^']*)'|"([^"]*)"/g)].filter((m) => !/[=!]== $/.test(textOf(src).slice(Math.max(0, m.index - 4), m.index))).map((m) => m[1] ?? m[2] ?? m[3]).filter((s) => /[a-z]{3,}/.test(s) && !/^data-|^\.\.\/|^\.\/|className|^h-|^text-|^flex|^underline|^grid|^mt-|^rounded/.test(s) && !/^[a-z]+(-[a-z]+)*$/.test(s));
const offending = printed.filter((s) => NEVER.test(s.replace(/\$\{[^}]*\}/g, '')));
check('§0 HER RULE 1 BY CONSTRUCTION: no string the block prints carries a researcher\'s coinage (extent · lexicon · instance · verdict · centroid · discordance · vacuous · exhausted · pocket · unruled · coherent · closed · proposal · pushout · path · edge AB) — the D-names live in data attributes only', offending.length === 0, J(offending));
check('§0 HER RULE 3 (S3): `≡` is printed for IS alone, INSIDE EVERY SENTENCE — one word function (`modeWord`: IS → ≡, any other mode its word) feeds the sentence, the legs, the composite and the say-hand; the modes line prints the mode\'s name', /const modeWord = \(w: string\): string => \(w === IS \? '≡' : w\);/.test(src) && /`\$\{nameA\(r\[1\]\)\} \$\{modeWord\(r\[0\]\)\} \$\{nameB\(r\[2\]\)\}`/.test(src) && /\$\{modeWord\(w\)\} \$\{nameZ\(ends\[1\], o\)\}/.test(src) && /modeWord\(p\.composite\)/.test(src) && !/\?\? \(directs\[0\]/.test(src));
check('§0 the block reads B1–B4 and decides nothing: it imports mediumOf, childSpaceOf, lexiconOf, the sorting\'s types and the term reader — no glue, no sorting of its own, no spaceOf', /from '\.\.\/lib\/descent'/.test(src) && !/\bglue\(|sortFromRecords|composedOn|spaceOf\(/.test(textOf(src)));

// ═══ §a the head, the modes, the act line, the hand, the child ═══
console.log('\n----- §a the counts head, the modes line, the act line and its two states, the hand, the child -----');
reset(seeded4());
note(`the dissection's stored orders: A–B ${storedFirst('A', 'B')} first · A–C ${storedFirst('A', 'C')} first · C–B ${storedFirst('C', 'B')} first · A–D ${storedFirst('A', 'D')} first · D–B ${storedFirst('D', 'B')} first`);
give('A', 'B', { F7: 'r0', F13: 'r8', F9: 'r1' }); // (i)
give('A', 'C', { F13: 'Φ8', F9: 'Φ1', F3: 'Φ2' }); // S1
give('C', 'B', { Φ8: 'r0', Φ1: 'r1' }); // Q
S().applyAmboDissectionToCurrent();
const G1 = cur();
const AB = midOf(G1, byLabel(G1, 'A'), byLabel(G1, 'B'));
const r1 = renderAt(G1, AB.id);
check('§a LAYOUT-1 §4 — the medium\'s pieces stand on the VIEW ROOT (`data-medium` is the midpoint view itself): the feet (the corners tab) and the concept\'s diagram (the point tab) are inside it, and the traces tab follows it in the DOM — the one structural law every renderAt reads', !!r1.block && r1.block.includes('data-midpoint-foot=') && r1.block.includes('data-midpoint-own="glued"') && r1.html.indexOf('<div data-midpoint-trace="true"') > r1.html.indexOf('<div data-medium="true"') && r1.before === '', r1.block ? `block ${r1.block.length} chars` : 'no block');
const head = r1.lines('data-medium-head')[0];
check('§a THE HEAD counts his relatings on the grid\'s pairs of roles and nothing else (STAMP THE-MODES-TAB §1.2, Virgin Land\'s 8: `possible` goes): `A–B: 3 relatings, on 3 of the 140 pairs of roles`, no bar part with no bar', !!head && head[1] === 'A–B: 3 relatings, on 3 of the 140 pairs of roles', head && head[1]);
const modesLine = r1.lines('data-medium-modes')[0];
check('§a S7 THE MODES LINE names his modes and nothing else: `modes: IS ≡ + a mode` (the chosen one underlined; the `+ a mode` hand at its end — LAYOUT-1 §4); no polarity on it', !!modesLine && modesLine[1] === 'modes: IS ≡ + a mode' && /data-medium-mode="IS"[^>]*data-medium-mode-chosen="true"/.test(r1.block) && !/does not hold/.test(modesLine[1]), modesLine && modesLine[1]);
const gesture = r1.lines('data-medium-gesture')[0];
check('§a S7 THE ACT LINE carries the polarity, each state with its own mark: `"A\'s point ≡ B\'s point" — it holds · it does not hold` (the act line\'s lead-in is in the pairing\'s ? now — LAYOUT-1 §4), the chosen one underlined (`it holds`)', !!gesture && gesture[1] === '"A\'s point ≡ B\'s point" — it holds · it does not hold' && /data-medium-hold="\+"[^>]*data-medium-hold-chosen="true"/.test(r1.block) && !/data-medium-hold="-"[^>]*data-medium-hold-chosen/.test(r1.block), gesture && gesture[1]);
const modeGesture = r1.lines('data-medium-mode-gesture')[0];
check('§a S8 THE HAND (COPY-1 §4.2): the modes line ends in `+ a mode`; no field and no hand stand before it is pressed; pressed, a field `a word` opens in place and the hand `add` appears only with a word in it', !modeGesture && /data-medium-mode-add="true"/.test(r1.block) && !/data-medium-mode-declare/.test(r1.block) && /newMode\.trim\(\) \? <button type="button" data-medium-mode-declare="true"[\s\S]{0,200}?>add<\/button> : null/.test(src) && /placeholder="a word"/.test(src), J([modeGesture, /data-medium-mode-add/.test(r1.block)]));
check('§a THE CHILD\'s line: `the concept between A and B, made of 3 relatings`', r1.lines('data-medium-child')[0] && r1.lines('data-medium-child')[0][1] === 'the concept between A and B, made of 3 relatings', J(r1.lines('data-medium-child')));

// ═══ §b the passages ═══
console.log('\n----- §b the passages, where they sit — ≡ inside, what presses named, no say against his pair -----');
const heads = r1.lines('data-medium-corner').map(([, s]) => s);
check('§b the corners (STAMP THE-MODES-TAB §1.3: one line per corner, its edges and its light side by side): `C — 2 by its edges · nothing in its light yet · open C\'s light` (F3 → Φ2 reaches no B-role: no passage) and `D — nothing on its edges · nothing in its light yet · open D\'s light`', J(heads) === J(["C — 2 by its edges · nothing in its light yet · open C's light", "D — nothing on its edges · nothing in its light yet · open D's light"]), J(heads));
const p13 = passageOf(renderAt(G1, AB.id, 'F13|r0'), 'F13'); const p9 = passageOf(renderAt(G1, AB.id, 'F9|r1'), 'F9'); // each on its cell's card
check('§b S1 + S3: F13 → Φ8 → r0 presses on HIS PAIR F13 ≡ r8 at the source — `F13 ≡ Φ8 · Φ8 ≡ r0 comes to F13 ≡ r0, but F13 is paired with r8` (never `which you barred` for a pair; ≡ in the legs and the composite), its end `source`', !!p13 && p13.text.startsWith('F13 ≡ Φ8 · Φ8 ≡ r0 comes to F13 ≡ r0, but F13 is paired with r8') && /data-medium-passage-reading="TENSION"/.test(p13.attrs) && /data-medium-passage-end="source"/.test(p13.attrs) && !/which you barred/.test(p13.text), p13 && p13.text);
check('§b S5 (b) RULED (the second resolution §6, M4): on an IS TENSION there is NO say at all — no `that is "F13 ≡ r0"`, no `that is not it` (the one-to-one law is the transport\'s, not his rule; the line names what presses; withdrawing the pair is his route)', !!p13 && J(p13.says) === J([]) && !/that is/.test(p13.text), p13 && J([p13.says, p13.text]));
check('§b F9 → Φ1 → r1 with F9 ≡ r1 given is `F9 ≡ Φ1 · Φ1 ≡ r1 comes to F9 ≡ r1, also related directly` — and (M5, the researcher\'s 12:21, ADR §9.12) NO HAND: two IS legs compose by the transport\'s law, not his to except', !!p9 && p9.text === 'F9 ≡ Φ1 · Φ1 ≡ r1 comes to F9 ≡ r1, also related directly' && J(p9.says) === J([]), p9 && p9.text);
check('§b M5 BY CONSTRUCTION: the store refuses a say on any path with an IS leg by name — `composed` and `not` alike on F9 → Φ1 → r1 (`this passage has a pair in it, so what it comes to follows from the pair; you decide only passages of two modes`); the record unchanged', (() => {
  const f = cur().faces.find((ff) => ff.vertexIds.length === 3 && ['A', 'B', 'C'].every((l) => ff.vertexIds.includes(byLabel(cur(), l))));
  const b = [f.vertexIds.indexOf(byLabel(cur(), 'A')), f.vertexIds.indexOf(byLabel(cur(), 'B'))];
  const a = S().giveVerdict(f.id, { base: b, x: 'F9', w: 'IS', z: 'Φ1', w2: 'IS', y: 'r1', w3: 'IS', verdict: 'composed' });
  const n = S().giveVerdict(f.id, { base: b, x: 'F9', w: 'IS', z: 'Φ1', w2: 'IS', y: 'r1', verdict: 'not' });
  return typeof a === 'string' && /has a pair in it/.test(a) && typeof n === 'string' && /has a pair in it/.test(n) && cur().faces.filter((ff) => ff.data && ff.data.verdicts).length === 0;
})());
// STAMP THE-MODES-TAB §2: the bottom lists leave — each relating's standing is on its own cell's card
const standing = (cell) => (renderAt(G1, AB.id, cell).lines('data-medium-card-relating')[0] || [])[1] || null;
const own = [standing('F7|r0'), standing('F13|r8')];
const faces = [standing('F9|r1')];
check('§b THE SORTING, on the cards (STAMP THE-MODES-TAB §1.5 (2)): `F7 ≡ r0 · not through C or D`, `F13 ≡ r8 · not through C or D` and `F9 ≡ r1 · also through C`', J(own) === J(['F7 ≡ r0 · not through C or D', 'F13 ≡ r8 · not through C or D']) && J(faces) === J(['F9 ≡ r1 · also through C']), J([own, faces]));
const stateLine1 = r1.lines('data-medium-state-line')[0];
check('§b THE STATE is one line with a count, never a grade: with a pair pressed the line counts what is theirs alone and what is the face\'s', !!stateLine1 && stateLine1[1] === "2 relatings not through C or D · 1 also through C" && r1.attr('data-medium-coherent') === 'false', stateLine1 && stateLine1[1]);
check('§b NONE OF THE RESEARCHER\'S COINAGES is in the block\'s text; no `IS` spelled inside a sentence; no `~`', !NEVER.test(r1.text) && !/\b[A-ZΦ]\w* IS \w/.test(r1.text) && !/~/.test(r1.text), (r1.text.match(NEVER) || [])[0]);
// the TARGET end: a pair on A–B holding the role a path lands on — the medium's line and the corners' view above it (S2)
give('C', 'B', { Φ2: 'r5' }); give('A', 'B', { F1: 'r5' });
const rT = renderAt(cur(), AB.id);
const p3 = passageOf(renderAt(cur(), AB.id, 'F3|r5'), 'F3'); // on its cell's card
check('§b S1 at the TARGET: F3 → Φ2 → r5 lands on r5, which his pair holds with F1 — `F3 ≡ Φ2 · Φ2 ≡ r5 comes to F3 ≡ r5, but r5 is paired with F1`, its end `target`, and no say-hand (an IS tension)', !!p3 && p3.text === 'F3 ≡ Φ2 · Φ2 ≡ r5 comes to F3 ≡ r5, but r5 is paired with F1' && /data-medium-passage-end="target"/.test(p3.attrs) && J(p3.says) === J([]), p3 && p3.text);
const footLines = [...rT.html.matchAll(/data-midpoint-foot-line="([^"]+)"[^>]*>([^<]*)</g)].map((m) => [m[1], unesc(m[2])]);
check('§b S2 THE CORNER\'S VIEW (the corners tab, COPY-1 §4.7) splits by end: the target-end tension takes the source end\'s own form pivoting on the paired role, `would pair r5 with F3, but you paired r5 with F1`; the source-end disagreement reads `would pair F13 with r0, but you paired F13 with r8`; F9 agrees — `agrees with 1 pair: F9 ≡ r1`', J(footLines.filter((l) => l[0] !== 'silent')) === J([['agrees', 'agrees with 1 pair: F9 ≡ r1'], ['would-pair', 'would pair F13 with r0, but you paired F13 with r8'], ['would-pair', 'would pair r5 with F3, but you paired r5 with F1']]), J(footLines));
check('§b S5 (b) + M5 BY CONSTRUCTION: the store refuses a composed say on the two IS tensions BY NAME AT THE ACT — under M5 the refusal names the ≡ leg first (`nothing is yours to say on this passage — a leg of it is ≡ …`; the pair it presses on is on the line above); the record is unchanged', (() => {
  const f = cur().faces.find((ff) => ff.vertexIds.length === 3 && ['A', 'B', 'C'].every((l) => ff.vertexIds.includes(byLabel(cur(), l))));
  const iA0 = f.vertexIds.indexOf(byLabel(cur(), 'A')); const iB0 = f.vertexIds.indexOf(byLabel(cur(), 'B'));
  const t = S().giveVerdict(f.id, { base: [iA0, iB0], x: 'F3', w: 'IS', z: 'Φ2', w2: 'IS', y: 'r5', w3: 'IS', verdict: 'composed' });
  const s = S().giveVerdict(f.id, { base: [iA0, iB0], x: 'F13', w: 'IS', z: 'Φ8', w2: 'IS', y: 'r0', w3: 'IS', verdict: 'composed' });
  const held = cur().faces.filter((ff) => ff.data && ff.data.verdicts).length;
  return typeof t === 'string' && /has a pair in it/.test(t) && typeof s === 'string' && /has a pair in it/.test(s) && held === 0;
})());
check('§b S5 (b) the pair-refusal forms stand in the store for a MODE tension whose composite presses on his pair (a rule to ≡ — reachable by a rule alone): `runs into the pair … on A–B` with the pair as its hand, at the target and at the source, and `is barred on A–B` with the bar as its hand (COPY-1 §4.3; the hands as DATA, §7.7)', (() => { const st = readLf('src/store/geometryStore.ts'); return /runs into the pair \$\{termWordsOf\(shape, face\.vertexIds\[i\], key\[1\], opts\)\} ≡ \$\{ny\} on \$\{la\}–\$\{lb\}`, \{ pair: \[key\[1\], record\.y\] \}/.test(st) && /runs into the pair \$\{nx\} ≡ \$\{termWordsOf\(shape, face\.vertexIds\[j\], key\[2\], opts\)\} on \$\{la\}–\$\{lb\}`, \{ pair: \[record\.x, key\[2\]\] \}/.test(st) && /is barred on \$\{la\}–\$\{lb\}`, bar \? \{ bar \} : \{\}\)/.test(st); })());
S().withdrawRolePair(E(cur(), 'A', 'B').id, ...(E(cur(), 'A', 'B').vertexIds[0] === byLabel(cur(), 'A') ? ['F1', 'r5'] : ['r5', 'F1']));
{ const e = E(cur(), 'C', 'B'); S().withdrawRolePair(e.id, ...(e.vertexIds[0] === byLabel(cur(), 'C') ? ['Φ2', 'r5'] : ['r5', 'Φ2'])); }

// ═══ §c his acts ═══
console.log('\n----- §c his acts: a mode, a relating and a bar under the drawing, a passage with the walk, THE FALSIFIER against it, a rule, a say, an exception, a not-it, a disagreement, a tension by his bar -----');
S().declareMode('carries');
say('A', 'B', 'F2', 'carries', 'r3', '+');
say('A', 'B', 'F4', 'resists', 'r5', '-');
const r2 = renderAt(cur(), AB.id);
check('§c S7 a mode declared joins the modes line with her ` · `: `modes: IS ≡ carries · resists · + a mode` (resists used in a bar, not declared, is in use)', r2.lines('data-medium-modes')[0][1] === 'modes: IS ≡ carries · resists · + a mode' && /data-medium-mode="carries"/.test(r2.block), r2.lines('data-medium-modes')[0][1]);
check('§c S10 his relating and his bar are listed UNDER THE DRAWING as his other acts, unnumbered — `F2 carries r3 · withdraw` · `F4 resists r5 · barred · withdraw` (COPY-1 §4.4: no `yours`, the bar\'s mark a word after it) — inside the listing (`data-midpoint-role-pairs`), which stands after the drawing; the modes tab keeps them in its sorting (`… F2 carries r3` not through C or D; the head `4 related · 1 barred`)', (() => {
  const listing = (r2.html.match(/<div data-midpoint-role-pairs="true"[\s\S]*?<\/div>/) || [''])[0];
  const rel = r2.linesAll('data-medium-relating'); const bar = r2.linesAll('data-medium-bar');
  return listing.includes('data-medium-relating="carries|F2|r3"') && listing.includes('data-medium-bar="resists|F4|r5"') && rel.some(([, s]) => s === 'F2 carries r3 · withdraw') && bar.some(([, s]) => s === 'F4 resists r5 · barred · withdraw') && r2.html.indexOf('data-midpoint-role-pairs="true"') > r2.html.indexOf('data-midpoint-drawing="true"') && ((renderAt(cur(), AB.id, 'F2|r3').lines('data-medium-card-relating')[0] || [])[1] || '') === 'F2 carries r3 · not through C or D' && /^A–B: \d+ relatings · 1 bar, on \d+ of the 140 pairs of roles$/.test((r2.lines('data-medium-head')[0] || [])[1] || '');
})(), J({ rel: r2.linesAll('data-medium-relating'), bar: r2.linesAll('data-medium-bar'), head: r2.lines('data-medium-head') }));
// a passage in two modes WITH the walk, through D (A–D stored A first, D–B stored D first): no rule → `not yet said`, `that is not it` its only hand
say('A', 'D', 'F2', 'carries', 'x', '+');
say('D', 'B', 'x', 'resists', 'r3', '+');
// THE FALSIFIER through C: A–C is stored C first and C–B is stored B first — the record's x is the stored first corner's role, so what
// he says there is `Φ3 carries F2` (A's F2 related to C's Φ3) and `r3 resists Φ3` (C's Φ3 to B's r3)
say('A', 'C', 'F2', 'carries', 'Φ3', '+');
say('C', 'B', 'Φ3', 'resists', 'r3', '+');
const r3 = renderAt(cur(), AB.id, 'F2|r3'); // the passages through C and D both sit on F2 · r3's card
const pD = passageOf(r3, 'F2');
const pC = [...r3.block.matchAll(/data-medium-passage="(F2\|carries\|Φ3\|resists\|r3\|←←)"[^>]*/g)].map((m) => m[0]);
const pCtext = (r3.lines('data-medium-passage').find(([k]) => k === 'F2|carries|Φ3|resists|r3|←←') || [])[1] || '';
const pDtext = (r3.lines('data-medium-passage').find(([k]) => k === 'F2|carries|x|resists|r3') || [])[1] || '';
check('§c S5 (a) with MODES-4 §5: a passage in two modes with the walk (through D) reads `F2 carries x · x resists r3 — not yet said` and offers the per-passage word `that is F2 [your word] r3` (no hand until a word is in the field — the machine never fills it) and `that is not it`; the rule gesture `one word for carries then resists:` beside it', pDtext.startsWith('F2 carries x · x resists r3 not decided yet') && / not decided yet comes to F2 r3 comes to nothing$/.test(pDtext) && !/that is "/.test(pDtext) && !/say it/.test(pDtext) && /data-medium-say-input="F2\|carries\|x\|resists\|r3"/.test(r3.block) && r3.block.includes('data-medium-rule-gesture="carries|resists"') && /one word for carries then resists:/.test(r3.text), pDtext);
check('§c D13 REPLACES S4\'S INTERIM (the designer\'s 17:32 §3; the researcher\'s §9.14): through C both legs were said from the far corner — the passage is a CHAIN FROM B TO A and says so before its legs, in the chain\'s own order: `from B to A: r3 resists Φ3 · Φ3 carries F2 not decided yet` (never `F2 carries Φ3 · Φ3 resists r3`), keyed with its senses (`|←←`), marked against; the rule (carries, resists) does not read it (its own order is resists, then carries); the per-passage word reads from B to A, `that is r3 [your word] F2`, and `that is not it`', pC.length === 1 && /data-medium-passage-against="true"/.test(pC[0]) && /data-medium-passage-reading="UNRULED"/.test(pC[0]) && /data-medium-passage-shape="chain"/.test(pC[0]) && /data-medium-passage-from="y"/.test(pC[0]) && pCtext.startsWith('from B to A: r3 resists Φ3 · Φ3 carries F2 not decided yet') && / not decided yet comes to r3 F2 comes to nothing$/.test(pCtext) && !/F2 carries Φ3/.test(r3.text), pCtext);
check('§c the unruled count per view: `1 passage through C not decided yet` and the same through D', r3.lines('data-medium-unruled').map(([, s]) => s).join(' | ') === '1 passage through C not decided yet | 1 passage through D not decided yet', J(r3.lines('data-medium-unruled')));
const viewBlockOf = (r, view) => elementsIn(r.block, 'data-medium-route-corner').filter(([v]) => v === view).map(([, h]) => h).join(''); // a corner's routes on the card
check('§c M6 as M3 re-reads it: the rule gesture exists for every passage of two mode legs, keyed BY SHAPE in the passage\'s own order — through C the chain from B to A offers `one word for resists then carries:` (its own key), through D the chain from A to B offers `one word for carries then resists:`', /data-medium-rule-gesture="resists\|carries"/.test(viewBlockOf(r3, 'C')) && /one word for resists then carries:/.test(unesc(viewBlockOf(r3, 'C'))) && /data-medium-rule-gesture="carries\|resists"/.test(viewBlockOf(r3, 'D')), J([/data-medium-rule-gesture="([^"]*)"/.exec(viewBlockOf(r3, 'C'))]));
check('§c MODES-2 (d) — the site\'s ONE token at §8\'s precedence: with a passage unsaid the site is UNRULED (her §3\'s per-view line says which), and the state line is the counts, never `nothing against it`', r3.attr('data-medium-state') === 'UNRULED' && /^\d+ relatings not through C or D · \d+ also through C$/.test(r3.lines('data-medium-state-line')[0][1]), J([r3.attr('data-medium-state'), r3.lines('data-medium-state-line')]));
// 12:19 (ii): a composed say stored on an against-path BEFORE the interim ruling (the store refuses a new one; here written straight onto the face)
{
  const f = cur().faces.find((ff) => ff.vertexIds.length === 3 && ['A', 'B', 'C'].every((l) => ff.vertexIds.includes(byLabel(cur(), l))));
  const base = [f.vertexIds.indexOf(byLabel(cur(), 'A')), f.vertexIds.indexOf(byLabel(cur(), 'B'))];
  const shape = cur();
  useGeometryStore.setState({ shapes: { ...S().shapes, [shape.id]: { ...shape, faces: shape.faces.map((ff) => (ff.id === f.id ? withVerdict(ff, { base, x: 'F2', w: 'carries', z: 'Φ3', w2: 'resists', y: 'r3', w3: 'carries', verdict: 'composed' }) : ff)) } } });
  const rR = renderAt(cur(), AB.id, 'F2|r3');
  const pR = (rR.lines('data-medium-passage').find(([k]) => k === 'F2|carries|Φ3|resists|r3|←←') || [])[1] || '';
  const pRattrs = (rR.block.match(/<span[^>]*data-medium-passage="F2\|carries\|Φ3\|resists\|r3\|←←"[^>]*>/) || [''])[0];
  check('§c 12:19 (ii) under D13: a composed say he stored on this passage BEFORE the direction bit (no `dirs` in its record — every record before D13) still names its path, the one with those five names, and IS READ (the interim lifted) — AS HE SAID IT THEN, along the walk (`that is "F2 carries r3"`, the offer of that day): his `F2 carries r3` stands on A–B, so the passage sits `the face\'s — said between them and through C too: F2 carries r3`, `you said: that is "F2 carries r3"`, its withdraw; never orphaned, never hidden, never turned round', pR === 'from B to A: r3 resists Φ3 · Φ3 carries F2 comes to F2 carries r3, also related directly decided: F2 carries r3 withdraw' && /data-medium-passage-reading="COMPOSED"/.test(pRattrs) && /data-medium-passage-by="verdict"/.test(pRattrs), pR);
  S().withdrawVerdict(f.id, { base, x: 'F2', w: 'carries', z: 'Φ3', w2: 'resists', y: 'r3' });
  const rW = renderAt(cur(), AB.id, 'F2|r3');
  check('§c … and withdrawn (by a record without `dirs`, as the page\'s own withdraw would carry them) it is gone: the passage reads `not yet said` with its two hands', ((rW.lines('data-medium-passage').find(([k]) => k === 'F2|carries|Φ3|resists|r3|←←') || [])[1] || '').endsWith(' not decided yet comes to r3 F2 comes to nothing'), J(rW.lines('data-medium-passage').find(([k]) => k === 'F2|carries|Φ3|resists|r3|←←')));
}
S().nameRule('carries', 'resists', 'carries');
const r4 = renderAt(cur(), AB.id, 'F2|r3');
const pD4 = (r4.lines('data-medium-passage').find(([k]) => k === 'F2|carries|x|resists|r3') || [])[1] || '';
const pC4 = (r4.lines('data-medium-passage').find(([k]) => k === 'F2|carries|Φ3|resists|r3|←←') || [])[1] || '';
check('§c THE RULE named reads `you named it: carries, then resists = carries — your word for the two in a row; holds on every such passage` (her 17:32 §4); through D the passage now sits `the face\'s — said between them and through D too: F2 carries r3` — and (M5\'s control) a path of TWO MODE LEGS keeps both hands, the per-passage word `that is F2 [your word] r3` · `that is not it`', r4.lines('data-medium-rule').some(([, s]) => /^rule: carries then resists = carries, on every such passage · withdraw$/.test(s)) && pD4.startsWith('F2 carries x · x resists r3 comes to F2 carries r3, also related directly') && /comes to F2 r3 comes to nothing$/.test(pD4), J([r4.lines('data-medium-rule'), pD4]));
check('§c M3 (§9.14): the rule (carries, resists) named at D is NOT the chain from B to A\'s key — C\'s block prints no `you named it` line for it and keeps its own gesture (resists, then carries); D\'s block prints the line; and `nameRule` on a pair with an IS word stores nothing (substitution is a law, §9.12)', !/data-medium-rule=/.test(viewBlockOf(r4, 'C')) && /data-medium-rule-gesture="resists\|carries"/.test(viewBlockOf(r4, 'C')) && /data-medium-rule="carries\|resists\|carries"/.test(viewBlockOf(r4, 'D')) && (() => { const before = J(S().rules); S().nameRule('IS', 'carries', 'x'); S().nameRule('carries', 'IS', 'y'); return J(S().rules) === before; })(), J([r4.lines('data-medium-rule').length, /data-medium-rule=/.test(viewBlockOf(r4, 'C'))]));
check('§c A CHAIN IS ONE KEY WHICHEVER WAY IT CROSSES THE EDGE (M3): the rule named in the chain\'s own order — (resists, then carries) ↦ resists — reads the chain from B to A through C: its composite in the chain\'s own direction, `r3 resists F2`, meets no direct that way — `comes to r3 resists F2, not related directly: C\'s light`; the store takes a composed say on it (the interim lifted); withdrawn again', (() => {
  S().nameRule('resists', 'carries', 'resists');
  const rK = renderAt(cur(), AB.id, 'F2|r3');
  const t = (rK.lines('data-medium-passage').find(([k]) => k === 'F2|carries|Φ3|resists|r3|←←') || [])[1] || '';
  const f = cur().faces.find((ff) => ff.vertexIds.length === 3 && ['A', 'B', 'C'].every((l) => ff.vertexIds.includes(byLabel(cur(), l))));
  const base = [f.vertexIds.indexOf(byLabel(cur(), 'A')), f.vertexIds.indexOf(byLabel(cur(), 'B'))];
  const why = S().giveVerdict(f.id, { base, x: 'F2', w: 'carries', z: 'Φ3', w2: 'resists', y: 'r3', dirs: ['←', '←'], w3: 'carries', verdict: 'composed' });
  S().withdrawVerdict(f.id, { base, x: 'F2', w: 'carries', z: 'Φ3', w2: 'resists', y: 'r3', dirs: ['←', '←'] });
  S().withdrawRule('resists', 'carries');
  return t.startsWith('from B to A: r3 resists Φ3 · Φ3 carries F2 comes to r3 resists F2, not related directly: C\'s light') && /data-medium-rule="resists\|carries\|resists"/.test(viewBlockOf(rK, 'C')) && why === null;
})(), pC4);
// SUBSTITUTION (the second resolution §1): an IS leg with a directed leg composes whatever the directed leg's sense — through C, F13 ≡ Φ8
// (A–C) with `r9 carries Φ8` said on C–B (B first: walked C → B it runs against) reads in his word the other way round, a light
say('C', 'B', 'Φ8', 'carries', 'r9', '+');
const rS = renderAt(cur(), AB.id, 'F13|r9');
const pS = (rS.lines('data-medium-passage').find(([k]) => k === 'F13|IS|Φ8|carries|r9|→←') || [])[1] || '';
const pSattrs = (rS.block.match(/<span[^>]*data-medium-passage="F13\|IS\|Φ8\|carries\|r9\|→←"[^>]*>/) || [''])[0];
check('§c SUBSTITUTION composes a MIXED path whatever the directed leg\'s sense: `F13 ≡ Φ8 · r9 carries Φ8 comes to r9 carries F13, not related directly: C\'s light` — the leg as he said it, the composite the other way round (never a word on swapped coordinates), by substitution, a light — and (M5) NO HAND on it (a mixed path composes by the transport\'s law), no rule gesture on its pair; a mixed path says no shape (its IS leg is symmetric)', pS === 'F13 ≡ Φ8 · r9 carries Φ8 comes to r9 carries F13, not related directly: C\'s light' && /data-medium-passage-by="substitution"/.test(pSattrs) && /data-medium-passage-reading="LIGHT"/.test(pSattrs) && !rS.block.includes('data-medium-rule-gesture="IS|carries"'), pS);
S().withdrawRelating(E(cur(), 'C', 'B').id, 'carries', 'r9', 'Φ8');
const fABD = cur().faces.find((f) => f.vertexIds.length === 3 && ['A', 'B', 'D'].every((l) => f.vertexIds.includes(byLabel(cur(), l))));
const A1 = byLabel(cur(), 'A'); const B1 = byLabel(cur(), 'B');
const baseD = [fABD.vertexIds.indexOf(A1), fABD.vertexIds.indexOf(B1)];
check('§c a say gives the word: `giveVerdict` composed to `resists` on D\'s passage is taken (no tension, with the walk)', S().giveVerdict(fABD.id, { base: baseD, x: 'F2', w: 'carries', z: 'x', w2: 'resists', y: 'r3', w3: 'resists', verdict: 'composed' }) === null);
const r5 = renderAt(cur(), AB.id, 'F2|r3');
check('§c A DECISION against the rule names its relating ONCE (COPY-1 §11.7, M9): `decided: F2 resists r3, an exception to the rule` on the decision\'s own line, marked `data-medium-exception`, and no second `decided here` line; the rule\'s line carries `, on every such passage but 1`', r5.lines('data-medium-said').some(([, s]) => s === 'decided: F2 resists r3, an exception to the rule') && r5.lines('data-medium-exception').some(([, s]) => s === 'decided: F2 resists r3, an exception to the rule') && !/decided here/.test(r5.text) && r5.lines('data-medium-rule').some(([, s]) => /, on every such passage but 1 · withdraw$/.test(s)), J({ said: r5.lines('data-medium-said'), exception: r5.lines('data-medium-exception') }));
check('§c a `not` say carries no w3 and is taken', S().giveVerdict(fABD.id, { base: baseD, x: 'F2', w: 'carries', z: 'x', w2: 'resists', y: 'r3', verdict: 'not' }) === null);
const r6 = renderAt(cur(), AB.id, 'F2|r3');
const pD6 = (r6.lines('data-medium-passage').find(([k]) => k === 'F2|carries|x|resists|r3') || [])[1] || '';
check('§c S6 a `comes to nothing` decision prints ONCE: `…  decided: comes to nothing withdraw` — no exception line (its relating is nothing; the rule\'s count carries it)', /data-medium-passage-reading="NOT"/.test(r6.block) && pD6 === 'F2 carries x · x resists r3 decided: comes to nothing withdraw' && r6.lines('data-medium-exception').length === 0, pD6);
// a disagreement across the faces, on IS legs (unaffected by the walk): F9 → Φ1 → r1 through C, F9 → y → r1 through D — said differently
S().withdrawVerdict(fABD.id, { base: baseD, x: 'F2', w: 'carries', z: 'x', w2: 'resists', y: 'r3' });
give('A', 'D', { F9: 'y' }); give('D', 'B', { y: 'r1' });
const fABC = cur().faces.find((f) => f.vertexIds.length === 3 && ['A', 'B', 'C'].every((l) => f.vertexIds.includes(byLabel(cur(), l))));
const baseC = [fABC.vertexIds.indexOf(A1), fABC.vertexIds.indexOf(B1)];
const sC = S().giveVerdict(fABC.id, { base: baseC, x: 'F9', w: 'IS', z: 'Φ1', w2: 'IS', y: 'r1', w3: 'sustains', verdict: 'composed' });
const sD = S().giveVerdict(fABD.id, { base: baseD, x: 'F9', w: 'IS', z: 'y', w2: 'IS', y: 'r1', w3: 'grounds', verdict: 'composed' });
const r7 = renderAt(cur(), AB.id);
const readableAt = (view) => (r7.block.match(new RegExp(`<div data-medium-view="${view}"[\\s\\S]*?</div>`)) || [''])[0];
check('§c A DISAGREEMENT across the faces (M5): the two IS says that used to make it are REFUSED by name; under D13 every two-mode-leg passage takes a say — through C (`F2 carries Φ3` · `Φ3 resists r3`, said with the walk) and through D — so `decisions differ: carries through C, resists through D` IS REACHABLE at AB now: said on both faces, the line prints; both withdrawn', typeof sC === 'string' && typeof sD === 'string' && r7.lines('data-medium-says-differ').length === 0 && (() => {
  say('A', 'C', 'F2', 'carries', 'Φ3', '+'); say('C', 'B', 'Φ3', 'resists', 'r3', '+');
  const a = S().giveVerdict(fABC.id, { base: baseC, x: 'F2', w: 'carries', z: 'Φ3', w2: 'resists', y: 'r3', w3: 'carries', verdict: 'composed' });
  const b = S().giveVerdict(fABD.id, { base: baseD, x: 'F2', w: 'carries', z: 'x', w2: 'resists', y: 'r3', w3: 'resists', verdict: 'composed' });
  const rD = renderAt(cur(), AB.id);
  const line = rD.lines('data-medium-says-differ').map(([, s]) => s);
  S().withdrawVerdict(fABC.id, { base: baseC, x: 'F2', w: 'carries', z: 'Φ3', w2: 'resists', y: 'r3' });
  S().withdrawVerdict(fABD.id, { base: baseD, x: 'F2', w: 'carries', z: 'x', w2: 'resists', y: 'r3' });
  { const e = E(cur(), 'A', 'C'); S().withdrawRelating(e.id, 'carries', ...(e.vertexIds[0] === byLabel(cur(), 'A') ? ['F2', 'Φ3'] : ['Φ3', 'F2'])); }
  { const e = E(cur(), 'C', 'B'); S().withdrawRelating(e.id, 'resists', ...(e.vertexIds[0] === byLabel(cur(), 'C') ? ['Φ3', 'r3'] : ['r3', 'Φ3'])); }
  return a === null && b === null && J(line) === J(['decisions differ: carries through C, resists through D']);
})(), J([sC, sD, r7.lines('data-medium-says-differ')]));
// a tension by HIS BAR: F4 carries y2 (A–D), y2 resists r5 (D–B) with the rule (carries, resists) ↦ carries changed to resists → composite `F4 resists r5`, which he barred
S().nameRule('carries', 'resists', 'resists');
say('A', 'D', 'F4', 'carries', 'z', '+'); say('D', 'B', 'z', 'resists', 'r5', '+');
const r8 = renderAt(cur(), AB.id, 'F4|r5');
const pBar = (r8.lines('data-medium-passage').find(([k]) => k === 'F4|carries|z|resists|r5') || [])[1] || '';
const pBarAttrs = (r8.block.match(/<span[^>]*data-medium-passage="F4\|carries\|z\|resists\|r5"[^>]*>/) || [''])[0];
check('§c S1 a tension by HIS BAR keeps the bar\'s form: `F4 carries z · z resists r5 comes to F4 resists r5, which is barred`, its end `bar`, `that is not it` its only hand; the store refuses a composed say on it (`is barred on A–B, its bar the hand`)', pBar.startsWith('F4 carries z · z resists r5 comes to F4 resists r5, which is barred') && /data-medium-passage-end="bar"/.test(pBarAttrs) && !/that is "/.test(pBar) && / comes to nothing$/.test(pBar) && (() => { const why = S().giveVerdict(fABD.id, { base: baseD, x: 'F4', w: 'carries', z: 'z', w2: 'resists', y: 'r5', w3: 'resists', verdict: 'composed' }); return typeof why === 'string' && /is barred on A–B$/.test(why); })(), pBar);

// ═══ §d the states ═══
console.log('\n----- §d the states, one line with a count; R1\'s reasons; R2; R4 -----');
reset(seeded4());
S().applyAmboDissectionToCurrent();
const G0 = cur(); const AB0 = midOf(G0, byLabel(G0, 'A'), byLabel(G0, 'B'));
const u = renderAt(G0, AB0.id);
check('§d UNDETECTED: `nothing related between A and B yet` — never "nothing there"; the child line at 0 reads `the concept between A and B` — the designer\'s 16:06 (1): the count drops at zero, the state line says the rest; R1: the corners tab gives the reason, `nothing through C yet: nothing is paired on A–C or C–B`; the modes tab\'s corner line reads `C — nothing on its edges · nothing in its light yet · open C\'s light` (STAMP THE-MODES-TAB §1.3)', u.lines('data-medium-state-line')[0] && u.lines('data-medium-state-line')[0][1] === 'nothing related between A and B yet' && !/nothing there/.test(u.text) && u.lines('data-medium-child')[0] && u.lines('data-medium-child')[0][1] === 'the concept between A and B' && footSilent(u).includes('nothing through C yet: nothing is paired on A–C or C–B') && (u.lines('data-medium-corner')[0] || [])[1] === "C — nothing on its edges · nothing in its light yet · open C's light", J([u.lines('data-medium-state-line'), footSilent(u), u.lines('data-medium-corner')]));
reset(seeded4());
give('A', 'B', { F9: 'r1' }); give('A', 'C', { F9: 'Φ1' }); give('C', 'B', { Φ1: 'r1' });
S().applyAmboDissectionToCurrent();
const Gx = cur(); const ABx = midOf(Gx, byLabel(Gx, 'A'), byLabel(Gx, 'B'));
const x = renderAt(Gx, ABx.id);
check('§d CLOSED (a finding, never a goal): the one relating is the face\'s through C — `the one relating also comes through C, and no passage comes to anything not related directly`; R4: the own line reads `the one relating also comes through C` — M5 (COPY-1 §11.1): the CARRYING corner alone, C; D carries nothing and is not named', x.lines('data-medium-state-line')[0][1] === "the one relating also comes through C, and no passage comes to anything not related directly" && x.attr('data-medium-closed') === 'true' && x.attr('data-medium-state') === 'CLOSED' && ((renderAt(Gx, ABx.id, 'F9|r1').lines('data-medium-card-relating')[0] || [])[1] || '') === 'F9 ≡ r1 · also through C', J({ state: x.lines('data-medium-state-line'), card: renderAt(Gx, ABx.id, 'F9|r1').lines('data-medium-card-relating') }));
reset(seeded4());
give('A', 'B', { F9: 'r1', F7: 'r0' }); give('A', 'C', { F9: 'Φ1' }); give('C', 'B', { Φ1: 'r1' });
S().applyAmboDissectionToCurrent();
const Gc = cur(); const ABc = midOf(Gc, byLabel(Gc, 'A'), byLabel(Gc, 'B'));
const c = renderAt(Gc, ABc.id);
check('§d COHERENT (M4 §2 — its two positive facts marked): one theirs alone and one the face\'s, the site looked at, nothing unsaid — `nothing against it: the one passage through C is decided, none runs into a bar or a pair, the decisions agree, and 1 relating comes through neither C nor D` (the count naming the corners that hold passages; no `no route you refused` — M4 corrected, ADR §9.11). M5 (COPY-1 §11.2): the last clause was `the views agree on what is theirs alone` and was FALSE here — C\'s own part is F7 ≡ r0 alone, D\'s (no passage) is both relatings; COHERENT shows because one relating comes through no corner, and the clause now says so with its count, every corner named', c.lines('data-medium-state-line')[0][1] === 'nothing against it: the one passage through C is decided, none runs into a bar or a pair, the decisions agree, and 1 relating comes through neither C nor D' && c.attr('data-medium-coherent') === 'true' && c.attr('data-medium-state') === 'COHERENT' && (() => { const v = c.attr('data-medium-state') && sortingOf(Gc, edgeBetween(Gc.edges, byLabel(Gc, 'A'), byLabel(Gc, 'B')), {}, S().rules, { converses: S().converses, opaque: S().opaque }); return !!v && v.views.length === 2 && J(v.views.map((w) => w.own.length).sort()) === J([1, 2]); })(), J(c.lines('data-medium-state-line')));
// M5 — an EXHAUSTED site with ONE carrying corner of two: F9 ≡ r1 the face's through C; a light through C (F7 ≡ Φ2 · Φ2 ≡ r0, F7 ≡ r0 not paired); D carries nothing — the line names C alone
reset(seeded4());
give('A', 'B', { F9: 'r1' }); give('A', 'C', { F9: 'Φ1', F7: 'Φ2' }); give('C', 'B', { Φ1: 'r1', Φ2: 'r0' });
S().applyAmboDissectionToCurrent();
const Ge = cur(); const ABe = midOf(Ge, byLabel(Ge, 'A'), byLabel(Ge, 'B'));
const ex = renderAt(Ge, ABe.id);
check('§d M5 (COPY-1 §11.1) — EXHAUSTED with ONE carrying corner of two: `the one relating also comes through C` names C alone (D holds no passage; before M5 the line read `through C or D`, as Virgin Land read `Meaning or Action` at ValueFact where only Action carried it)', ex.attr('data-medium-state') === 'EXHAUSTED' && ex.lines('data-medium-state-line')[0][1] === 'the one relating also comes through C', J({ state: ex.attr('data-medium-state'), line: ex.lines('data-medium-state-line') }));
reset(seeded4());
give('A', 'B', { F9: 'r1' });
S().applyAmboDissectionToCurrent();
const Gq = cur(); const ABq = midOf(Gq, byLabel(Gq, 'A'), byLabel(Gq, 'B'));
const q = renderAt(Gq, ABq.id);
check('§d VACUOUS (the second resolution §8; M4 §1, replacing R2\'s cure): with a relating but no passage through any view the site is VACUOUS — `1 relating · no passage through C or D yet` in the undetected line\'s shape; NO own line prints (the naming clue is not offered where nothing has looked); the per-view `no passage yet` lines stay; not coherent', q.attr('data-medium-state') === 'VACUOUS' && q.lines('data-medium-state-line')[0][1] === '1 relating · no passage through C or D yet' && ((renderAt(Gq, ABq.id, 'F9|r1').lines('data-medium-card-relating')[0] || [])[1] || '') === 'F9 ≡ r1' && q.lines('data-medium-corner').length === 2 && q.lines('data-medium-corner').every(([, s]) => /— nothing on its edges · nothing in its light yet/.test(s)) && q.attr('data-medium-coherent') === 'false', J([q.attr('data-medium-state'), q.lines('data-medium-state-line'), renderAt(Gq, ABq.id, 'F9|r1').lines('data-medium-card-relating'), q.lines('data-medium-corner')]));
check('§d VACUOUS with several relatings and one corner: the forms — `3 relatings · no passage through C yet` (read from the source: the corner list and its pronoun follow the views)', /\$\{plural\(related, 'relating', 'relatings'\)\} · no passage through \$\{cornersWords\} yet/.test(src));
reset(seeded4());
give('A', 'B', { F9: 'r1' }); give('A', 'C', { F9: 'Φ1' });
S().applyAmboDissectionToCurrent();
const Gl = cur(); const ABl = midOf(Gl, byLabel(Gl, 'A'), byLabel(Gl, 'B'));
const l1 = renderAt(Gl, ABl.id);
give('C', 'B', { Φ2: 'r1' });
const l2 = renderAt(cur(), ABl.id);
check('§d R1: a zero count gives its reason, in the corners tab (the modes tab\'s corner line reads `nothing on its edges`, STAMP THE-MODES-TAB §1.3) — one leg empty: `nothing through C yet: nothing is paired on C–B`; both legs held but not meeting: `nothing through C: the pairs on A–C and C–B don\'t meet`', footSilent(l1).includes('nothing through C yet: nothing is paired on C–B') && footSilent(l2).includes("nothing through C: the pairs on A–C and C–B don't meet") && /^C — nothing on its edges/.test((l1.lines('data-medium-corner')[0] || [])[1] || '') && /^C — nothing on its edges/.test((l2.lines('data-medium-corner')[0] || [])[1] || ''), J([footSilent(l1), footSilent(l2), l1.lines('data-medium-corner')[0], l2.lines('data-medium-corner')[0]]));
reset(seeded4());
give('A', 'B', { F9: 'r1', F7: 'r0' }); give('A', 'C', { F9: 'Φ1' }); give('C', 'B', { Φ1: 'r1' }); give('A', 'D', { F7: 'x' }); give('D', 'B', { x: 'r0' });
S().applyAmboDissectionToCurrent();
const Gp = cur(); const ABp = midOf(Gp, byLabel(Gp, 'A'), byLabel(Gp, 'B'));
const p = renderAt(Gp, ABp.id);
check('§d THE POCKET in her shape (MODES-2 · M1 (d), never a first): the head `C and D miss different relatings, and none is missed by both`, then ONE LINE PER RELATING some view leaves alone — `F9 ≡ r1: through C, not through D` · `F7 ≡ r0: through D, not through C`', p.lines('data-medium-state-line')[0][1] === 'C and D miss different relatings, and none is missed by both' && p.attr('data-medium-state') === 'POCKET' && J(p.lines('data-medium-pocket-line').map(([, s]) => s)) === J(["F9 ≡ r1: through C, not through D", "F7 ≡ r0: through D, not through C"]), J([p.lines('data-medium-state-line'), p.lines('data-medium-pocket-line')]));

// ═══ §e the name kept with its state ═══
console.log('\n----- §e the name kept with the state it was given under (D11); R3 -----');
reset(seeded4());
give('A', 'B', { F9: 'r1', F7: 'r0' });
S().applyAmboDissectionToCurrent();
const Gn = cur(); const ABn = midOf(Gn, byLabel(Gn, 'A'), byLabel(Gn, 'B'));
useGeometryStore.setState({ selectedVertexId: ABn.id });
S().updateSelectedVertexData({ label: 'Honesty' });
const stage0 = nameStageOf(cur(), ABn.id);
check('§e D17 (MODES-4 · row 8): christening the midpoint APPENDS the naming act to the LOG and keeps its STAGE on the vertex as input (`namedAt` = the act\'s position); no snapshot of derived values is written (`namedUnder` absent — B5\'s snapshot retired at the act)', stage0 === S().log.length && S().log[S().log.length - 1].act === 'name' && S().log[S().log.length - 1].label === 'Honesty' && namedUnderOf(cur(), ABn.id) === null, J([stage0, S().log.length, S().log.slice(-1)]));
const n0 = renderAt(cur(), ABn.id);
check('§e R3 at the christening the line reads the state RE-DERIVED at the name\'s stage, in her 17:32 §7 words — two relatings and no passage through any corner is VACUOUS: `named Honesty when there were 2 relatings and no passage yet` — no `since then` (the ordinary is not marked); the stage on the line', n0.lines('data-medium-named-under')[0] && n0.lines('data-medium-named-under')[0][1] === 'named Honesty when there were 2 relatings and no passage yet' && new RegExp(`data-medium-named-stage="${stage0}"`).test(n0.block), J(n0.lines('data-medium-named-under')));
give('A', 'C', { F9: 'Φ1' }); give('C', 'B', { Φ1: 'r1' }); give('A', 'B', { F13: 'r8' });
const n1 = renderAt(cur(), ABn.id);
check('§e from the first move on: `named Honesty when there were 2 relatings and no passage yet; since then 1 relating now comes through a corner, and 1 new one comes through no corner` (COPY-1 §11.7: the first part carries the noun, the rest drop it) — the state then re-derived from the log with the three later acts unapplied, the name kept, what moved listed (F9 ≡ r1 now through C; F13 ≡ r8 new, through no corner), never renamed', n1.lines('data-medium-named-under')[0] && n1.lines('data-medium-named-under')[0][1] === 'named Honesty when there were 2 relatings and no passage yet; since then 1 relating now comes through a corner, and 1 new one comes through no corner', J(n1.lines('data-medium-named-under')));
S().updateSelectedVertexData({ label: '' });
check('§e un-christened, the stage is dropped with the mark (the naming act and its clearing both in the log)', nameStageOf(cur(), ABn.id) === null && namedUnderOf(cur(), ABn.id) === null && S().log[S().log.length - 1].act === 'name' && S().log[S().log.length - 1].christened === false, J(S().log.slice(-1)));

// ═══ §f the device's own lights at a deeper generation ═══
console.log('\n----- §f the deeper light (S11 with her §4): what it links, what it goes through, nobody said it -----');
reset(seeded4());
give('A', 'B', { F7: 'r0' }); give('A', 'C', { F7: 'Φ1' });
S().applyAmboDissectionToCurrent();
S().selectCell(cur().cells.find((cc) => cc.kind === 'core').id);
S().applyAmboDissectionToCurrent();
const G2 = cur(); const AB2 = midOf(G2, byLabel(G2, 'A'), byLabel(G2, 'B')); const AC2 = midOf(G2, byLabel(G2, 'A'), byLabel(G2, 'C')); const ABAC = midOf(G2, AB2.id, AC2.id);
const d = renderAt(G2, ABAC.id);
const holds = (k, s) => s.startsWith('(Φ1 ≡ F7) · (F7 ≡ r0), both holding F7'); // the inherited passage, on its cell's card
const dCard = withPassage(G2, ABAC.id, holds);
const inhLine = (r) => (r.lines('data-medium-passage').find(([, s]) => s.startsWith('(Φ1 ≡ F7) · (F7 ≡ r0), both holding F7')) || [])[1] || '';
const inhEl = (r) => (elementsIn(r.block, 'data-medium-passage').find(([, h]) => /both holding F7/.test(unesc(h))) || ['', ''])[1];
check('§f THE INHERITED PASSAGE, PLACED WHERE IT LIVES (MODES-4 · rows 3–4, D14/D15; the designer\'s 10:57 §3, ratified §218): at ABAC the corner both sides hold is A\'s VIEW — the head `through A, the corner both sides share: 1 passage, read from B–C`; its one line names the two roles here, the role they share, the edge where the passage lives and its reading there: `(Φ1 ≡ F7) · (F7 ≡ r0), both holding F7 Φ1 and r0 aren\'t paired on B–C: A\'s light` (the pair in the passage\'s own order, X\'s side first — her §3; no tail inviting the act D15 refuses; no `~`; NO HAND); no derived light line; the state `not yet looked into`', d.lines('data-medium-corner').some(([, s]) => s === 'through A, the corner both sides share: 1 passage, read from B–C') && inhLine(dCard) === "(Φ1 ≡ F7) · (F7 ≡ r0), both holding F7 Φ1 and r0 aren't paired on B–C: A's light" && !/data-medium-say|data-medium-rule/.test(inhEl(dCard)) && /data-medium-passage-inherited="LIGHT"/.test(inhEl(dCard)) && d.lines('data-medium-light-derived').length === 0 && !/~|no relating between AC and AB says so/.test(inhLine(dCard)) && d.attr('data-medium-state') === 'UNDETECTED', J([d.lines('data-medium-corner'), inhLine(dCard)]));
// F-D15a's second arm, read here: pairing r0 ≡ Φ1 on B–C makes the restated passage COMPOSED — the link reads as the inherited ≡, the face's
give('B', 'C', { r0: 'Φ1' });
const dC = withPassage(cur(), ABAC.id, holds);
check('§f COMPOSED THERE (an inherited ≡, the face\'s — her §3): r0 ≡ Φ1 paired on B–C — the line reads `… — on B–C, through A: your pair Φ1 ≡ r0 — so here (Φ1 ≡ F7) ≡ (F7 ≡ r0), the face\'s` (the pair in the passage\'s order: X\'s side, C\'s Φ1, first; the edge by its stored name B–C), and the sorting\'s face\'s line `also through A, from the pair Φ1 ≡ r0 on B–C: (Φ1 ≡ F7) ≡ (F7 ≡ r0)` — never *said between them*, which he did not', inhLine(dC) === "(Φ1 ≡ F7) · (F7 ≡ r0), both holding F7 Φ1 and r0 are paired on B–C, so these two are one here" && /data-medium-passage-inherited="COMPOSED"/.test(inhEl(dC)) && dC.lines('data-medium-card-inherited').some(([k, s]) => k === 'A' && s === "(Φ1 ≡ F7) ≡ (F7 ≡ r0) · also through A, from the pair Φ1 ≡ r0 on B–C") && !/said between them and through A too: \(Φ1 ≡ F7\) ≡/.test(dC.text), J([inhLine(dC), dC.lines('data-medium-card-inherited')]));
{ const e = E(cur(), 'B', 'C'); S().withdrawRolePair(e.id, ...(e.vertexIds[0] === byLabel(cur(), 'B') ? ['r0', 'Φ1'] : ['Φ1', 'r0'])); }
give('B', 'C', { r0: 'Φ2' });
const dT = withPassage(cur(), ABAC.id, holds);
check('§f A TENSION THERE (her §3): r0 ≡ Φ2 paired on B–C instead — his pair at r0 presses: `(Φ1 ≡ F7) · (F7 ≡ r0), both holding F7 on B–C it comes to Φ1 ≡ r0, but r0 is paired with Φ2`; no hand', inhLine(dT) === "(Φ1 ≡ F7) · (F7 ≡ r0), both holding F7 on B–C it comes to Φ1 ≡ r0, but r0 is paired with Φ2" && /data-medium-passage-inherited="TENSION"/.test(inhEl(dT)) && !/data-medium-say/.test(inhEl(dT)), J([inhLine(dT)]));
check('§f the held form is her second sentence, in the source: `in A\'s light too: … — both hold … — you related them` (⚠ read, not seen: the built solid composes the light\'s ends and the pairing refuses the IS act there — C-8b, B4 §c)', /\$\{nameA\(l\.x\)\} with \$\{nameB\(l\.y\)\}, \$\{linkWords\(l\)\}: \$\{l\.held \? 'related here too' : 'not related here'\}/.test(src));
check('§f a light through the opposite midpoint says the relating it goes through, as he said it: the words `by ${…} ${modeWord(…)} ${…}` (the source), and each light is keyed by what it goes through (`via` in the key — two lights with one pair of ends and different links are two lines)', /`linked in \$\{labelOf\(l\.through\)\}'s light by \$\{nameZ\(l\.link\.corners\[0\], l\.link\.relating\[0\]\)\} \$\{modeWord\(l\.link\.relating\[1\]\)\} \$\{nameZ\(l\.link\.corners\[1\], l\.link\.relating\[2\]\)\}`/.test(src) && /key=\{`\$\{l\.kind\}\|\$\{l\.x\}\|\$\{l\.y\}\|\$\{l\.through\}\|\$\{l\.via\}`\}/.test(src));

// ═══ §g Virgin Land's record ═══
console.log('\n----- §g Virgin Land\'s record at Value–Action -----');
const vlPath = path.join(repoRoot, '.handoff/inbox/coder/2026-09-25_2353_virgin-land_export_break-by-lights_ValueAction.workspace.json');
if (fs.existsSync(vlPath)) {
  const vl = parseWorkspaceImport(JSON.parse(fs.readFileSync(vlPath, 'utf8')));
  const vs = Object.values(vl.shapes).find((s) => s.faces.some((f) => f.data && f.data.triads));
  useGeometryStore.setState({ shapes: { [vs.id]: vs }, shapeOrder: [vs.id], currentShapeId: vs.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], rules: [] });
  const byL = (l) => Object.values(vs.vertices).find((v) => v.data.label === l).id;
  const mid = midOf(vs, byL('Value'), byL('Action'));
  const v = renderAt(vs, mid.id);
  const vp = allPassages(vs, mid.id); // every passage, each on its cell's card
  const vText = vp.map(([, h]) => unesc(h)).join(' ');
  const lights = vp.filter(([, h]) => /data-medium-passage-reading="LIGHT"/.test(h)).length;
  check('§g the customer\'s triads alone: two passages, both `only in … light — through … it would read: … — no relating between Value and Action says so` (Fact\'s and Meaning\'s), the state `not yet looked into`; no coinage printed; no `IS` inside a sentence', lights === 2 && /not related directly: Fact's light/.test(vText) && /not related directly: Meaning's light/.test(vText) && v.attr('data-medium-state') === 'UNDETECTED' && !NEVER.test(v.text) && !/\w IS \w/.test(v.text), v.text.slice(0, 400));
} else note('Virgin Land\'s fixture is not beside the inbox on this checkout — §g skipped');

// ═══ §h where every line sits ═══
console.log('\n----- §h where the lines sit -----');
const ms = readLf('src/components/MidpointSurface.tsx');
check('§h LAYOUT-1 §4 in the source: the choices (`MediumChoices`) and the refusals stand in the pairing pane ABOVE the drawing, the modes block (`MediumModes`) in the point pane\'s modes tab, the traces tab last; the two-pick act reads the chosen mode, the bar and (D13) the direction (IS and no bar: the pairing, as before)', ms.indexOf('<MediumChoices {...mediumProps} />') < ms.indexOf('{half === \'roles\' ? drawing : wordRows}') && ms.indexOf('<MediumRefusals {...mediumProps} />') < ms.indexOf('{half === \'roles\' ? drawing : wordRows}') && /data-midpoint-panel="modes"[^\n]*\n\s*<MediumModes \{\.\.\.mediumProps\} \/>/.test(ms) && ms.indexOf('data-midpoint-panel="modes"') < ms.indexOf('<div data-midpoint-trace="true"') && /if \(mode === IS && !barNext\) giveRolePair\(edgeId, x, y\);\n\s*else giveRelating\(edgeId, mode, x, y, barNext \? '-' : '\+', dir\);/.test(ms));
check('§h a light is never first in its block and never a control: the passage line leads with the passage, the reading follows (an inherited line with her colon, the rest with the dash); the says are the only buttons on a passage', /<span data-medium-passage-legs="true">\{w\.passageWords\(p\)\}<\/span>/.test(src) && /<span>\{w\.readingWords\(p\)\}<\/span>/.test(src) && !/<button[^>]*data-medium-light/.test(src));
check('§h S10 the listing under the drawing carries his relatings in other modes and his bars through the one reader (`instancesOn` · `barsOn`), with `withdrawRelating` as their hand — each printed AS HE MADE IT (D13: `x w y` from A, `y w x` from B), the entry keyed with `|←` where he made it from B; a bar\'s line ends `· barred ·` before its hand', /modeActs = useMemo\(\(\) => \(\{ relatings: instancesOn\(sourceEdge\)\.filter\(\(r\) => r\[0\] !== IS\), bars: barsOn\(sourceEdge\) \}\)/.test(ms) && /const relatingKey = \(r: Relating\): string => `\$\{r\[0\]\}\|\$\{r\[1\]\}\|\$\{r\[2\]\}\$\{dirOf\(r\) === ALONG \? '' : '\|←'\}`;/.test(ms) && /data-medium-relating=\{relatingKey\(r\)\}/.test(ms) && /dirOf\(r\) === ALONG \? `\$\{nA\(r\[1\]\)\} \$\{r\[0\]\} \$\{nB\(r\[2\]\)\}` : `\$\{nB\(r\[2\]\)\} \$\{r\[0\]\} \$\{nA\(r\[1\]\)\}`/.test(ms) && /· barred · `\}/.test(ms));

console.log(`\n${failures === 0 ? 'DIAGNOSE-MODES1-THE-WORDS: ALL PASS — the medium reads in the designer\'s words under the own column: the counts, his modes, the act line with its two states, the passages where they sit (≡ inside, what presses named, no say against his pair or bar, each leg as he said it), his says and rules, one line for the state with its reasons, the name kept with its state, and the deeper light saying what it goes through; none of the researcher\'s coinages printed' : `DIAGNOSE-MODES1-THE-WORDS: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
