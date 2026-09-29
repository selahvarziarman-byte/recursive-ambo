#!/usr/bin/env node

// DIAGNOSTIC — STAMP MODES-4 (2026-09-29; the second resolution, chartered by reference to its §13; ADR 0031 §9.8, §9.10–§9.14),
// with MARKER MODES-4 · M1 (the coordinate pair refused by name, the designer's 11:00 words), M2 (the surface's forms, the
// designer's 17:32 §1–§3, §5–§6, §8) and M3 (the rule KEY: a chain is one key whichever way it crosses the edge; rules keyed on
// the word pair and the path's SHAPE — chain · fork · join; the researcher's 17:37): THE RECORD AND THE SORTING WITH DIRECTION.
// §a F-D13a THE RECORD — the customer-side agent's run-2 record (record2.cjs: 44 theses, each with the direction the thesis says;
//    the CONVERSE table the agent needed to store them all `→`) reproduces as direction bits with NO NEW WORD: every thesis is one
//    relating in its own word, `←` where the thesis runs from the edge's second corner; every relating the agent stored in a
//    converse word is the same sentence as `←` in the thesis's word; the carry (F-D13c) mirrors x ↔ y AND flips the direction —
//    the sentence preserved (the unit arm; the shape arm counts the surviving seed edges that flip within two dissections).
// §b THE SORTING ON THE PAGE — the designer's 10:16 acts on the eye fixture (A the flow, B Φ, C the T cell): `r3 carries F2` on
//    C–A and `Φ4 carries r3` on B–C read at AB through C as a CHAIN FROM B TO A, its shape said before its legs in the chain's own
//    order (`from B to A: Φ4 carries r3 · r3 carries F2`); the rule gesture in the chain's own order; `carries, then carries =
//    supports` composes `Φ4 supports F2` (M3's example) — a light, then the face's once he says it, recorded `←` on A–B; a FORK
//    (`both from r3: …`) and a JOIN (`both into r3: …`), each its own key, each its own gesture; a declared CONVERSE reads the fork as
//    a chain and the chain's rule reads it; no arrow anywhere in the block's text.
// §c THE MODE'S DECLARATION AND THE DIRECTION CHOICE — her §1 and §2: the converse line, the opaque bit, the two sentence shapes on
//    the act line for the chosen mode, none for IS.
// §d HELD APART (§9.13, the researcher's falsifier) — an opaque mode: the mixed passage composes to nothing, `— held apart: the pair
//    F13 ≡ Φ8 stops at carries`, no hand, not a light, not unsaid; transparent again, the light returns.
// §e M1 — the coordinate pair on a corner edge refused by name in her words: `(F7 ≡ r0) already holds F7 — it is carried there`; a
//    mode word on the same pair an ordinary entry (§9.10).
// §f F-D16 THE REFUSED ROUTE on the agent's final save (g2_verdicts.json): a NOT whose word has a direct standing at the endpoints
//    is that instance's FORM (`— not by way of X, you said`), at Institution–Event, Event–Practical reason and Practical
//    reason–Institution among others — the census printed; a NOT whose endpoints hold no direct in its word attaches to nothing.
//
// Run: node scripts/diagnose-modes4-the-record-and-the-sorting.cjs

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
const { MediumBlock } = req('src/components/MediumBlock.tsx');
const M = req('src/lib/relatings.ts');
const SO = req('src/lib/sorting.ts');
const React = require('react');
const { renderToString } = require('react-dom/server');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json');
const byLabel = (shape, label) => { const v = Object.values(shape.vertices).find((x) => x.data.label === label); return v ? v.id : null; };
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
// THE EYE'S FIXTURE (the eye leg's, MODES-1 · B5 §19): A the flow, B Φ, C the T cell, D Φ
const seededEye = () => { let s = createSeedShape('tetrahedron'); for (const [l, c] of [['A', flow], ['B', phi], ['C', tcell], ['D', phi]]) s = withCast(s, byLabel(s, l), c); return s; };
// the words witness's fixture: A the flow, B the T cell, C Φ
const seededWords = () => { let s = createSeedShape('tetrahedron'); for (const [l, c] of [['A', flow], ['B', tcell], ['C', phi]]) s = withCast(s, byLabel(s, l), c); return s; };
const reset = (seeded) => useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], rules: [], converses: [], opaque: [], liftSelection: [], selectedCellId: null, selectedVertexId: null, selectedEdgeId: null, selectedFaceId: null });
const E = (shape, X, Y) => edgeBetween(shape.edges, byLabel(shape, X), byLabel(shape, Y));
const give = (X, Y, map) => { const e = E(cur(), X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
/** a relating AS HE SAYS IT — the SUBJECT's corner named first: `said('C', 'r3', 'carries', 'A', 'F2')` is C's r3 carries A's F2; the record's x is the edge's first corner's role and the direction follows */
const said = (Xs, subject, w, Yo, object, sign = '+') => { const e = E(cur(), Xs, Yo); const subjectFirst = e.vertexIds[0] === byLabel(cur(), Xs); return S().giveRelating(e.id, w, subjectFirst ? subject : object, subjectFirst ? object : subject, sign, subjectFirst ? '→' : '←'); };
const unsay = (Xs, subject, w, Yo, object) => { const e = E(cur(), Xs, Yo); const subjectFirst = e.vertexIds[0] === byLabel(cur(), Xs); S().withdrawRelating(e.id, w, subjectFirst ? subject : object, subjectFirst ? object : subject, subjectFirst ? '→' : '←'); };
const midOf = (shape, u, v) => Object.values(shape.vertices).find((w) => w.createdBy.operation !== 'seed' && w.createdBy.sourceVertexIds.length === 2 && w.createdBy.sourceVertexIds.includes(u) && w.createdBy.sourceVertexIds.includes(v));
const oriented = (e, X, x, y) => (e.vertexIds[0] === X ? [x, y] : [y, x]);
const unesc = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').trim();
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
const linesIn = (src, attr) => elementsIn(src, attr).map(([v, h]) => [v, unesc(h)]);
/** the surface rendered under node at a midpoint: the block's HTML, its text, its lines by attribute, and the listing before it */
const renderAt = (shape, siteId) => {
  const packet = buildGeneralSitePacketPresenterReport(shape).packets.find((p) => p.trace.siteId === siteId);
  const site = midpointSiteOf(shape, siteId, packet ? packet.trace : null);
  const resolved = spaceOf(shape, siteId);
  const parents = [spaceOf(shape, site.a), spaceOf(shape, site.b)];
  const html = renderToString(React.createElement(MidpointSurface, { shape, site, parents, resolved, refusal: null, remade: null })).replace(/<!-- -->/g, '');
  const start = html.indexOf('<div data-medium="true"');
  if (start < 0) return { html, block: '', text: '', lines: () => [], linesAll: (attr) => linesIn(html, attr), attr: () => null, before: html };
  const after = html.indexOf('<div data-midpoint-trace="true"', start);
  const block = html.slice(start, after > 0 ? after : undefined);
  // the block's OWN div, balanced (the face reading that follows it on the surface is not the medium's text)
  const own = (elementsIn(html, 'data-medium').find(([v]) => v === 'true') || ['', block])[1];
  return { html, block, text: unesc(own), lines: (attr) => linesIn(block, attr), linesAll: (attr) => linesIn(html, attr), attr: (name) => { const m = block.match(new RegExp(`<div data-medium="true"[^>]*${name}="([^"]*)"`)); return m ? m[1] : null; }, before: html.slice(0, start) };
};
/** the block alone, with the act line's state given (the mode, the direction, the bar) — what the person sees after choosing a mode */
const renderBlock = (shape, edge, siteId, la, lb, mode, dir = '→', bar = false) => {
  const html = renderToString(React.createElement(MediumBlock, { shape, edge, siteId, la, lb, options: {}, mode, setMode: () => {}, bar, setBar: () => {}, dir, setDir: () => {} })).replace(/<!-- -->/g, '');
  return { html, text: unesc(html), lines: (attr) => linesIn(html, attr) };
};
const passageLine = (r, key) => (r.lines('data-medium-passage').find(([k]) => k === key) || [])[1] || '';
const passageAttrs = (r, key) => (r.block.match(new RegExp(`<span[^>]*data-medium-passage="${key.replace(/[|]/g, '\\|')}"[^>]*>`)) || [''])[0];
const viewBlockOf = (r, view) => (elementsIn(r.block, 'data-medium-view').find(([v]) => v === view) || ['', ''])[1];

// ═══ §a F-D13a — THE RECORD: the agent's run-2 theses reproduce as direction bits with no new word ═══
console.log('THE RECORD AND THE SORTING WITH DIRECTION — MODES-4 (D13 · M3 · §9.13 · M1 · D16)\n\n----- §a F-D13a: the customer-side record — 44 theses, one word each, `←` where the thesis runs from the second corner; the converse words the agent stored are the same sentences -----');
const recordPath = path.join(repoRoot, '.handoff/REPORTS_CUSTOMER-SIDE_2026-09-28/saves/ta2/record2.cjs');
const savePath = path.join(repoRoot, '.handoff/REPORTS_CUSTOMER-SIDE_2026-09-28/saves/ta2/saves/g1_related.json');
if (fs.existsSync(recordPath) && fs.existsSync(savePath)) {
  const { ROLE, CONVERSE, G1_RELATINGS } = require(recordPath);
  const cornerOfRole = (id) => ({ F: 'Fact', V: 'Value', M: 'Meaning', A: 'Action' })[id[0]];
  const g1 = parseWorkspaceImport(JSON.parse(fs.readFileSync(savePath, 'utf8')));
  const g1Shape = g1.shapes[g1.currentShapeId];
  const label = (id) => g1Shape.vertices[id].data.label;
  // (i) every thesis as ONE relating in its own word: x the edge's first corner's role, `←` where the from-role is the second corner's
  let against = 0; let ownWord = 0; let bad = [];
  const theses = G1_RELATINGS.map(([id, mode, from, to, sign]) => {
    const f = ROLE[from]; const t = ROLE[to];
    const e = edgeBetween(g1Shape.edges, byLabel(g1Shape, cornerOfRole(f)), byLabel(g1Shape, cornerOfRole(t)));
    const fromFirst = label(e.vertexIds[0]) === cornerOfRole(f);
    const r = M.relating(mode, fromFirst ? f : t, fromFirst ? t : f, sign, fromFirst ? '→' : '←');
    if (!fromFirst) against += 1;
    if (r[0] === mode) ownWord += 1;
    if (M.subjectOf(r) !== f || M.objectOf(r) !== t || (r.length === 5 && r[4] !== '←') || (r.length === 4 && !fromFirst)) bad.push(id);
    return { id, mode, f, t, sign, e, r };
  });
  check(`§a (i) EVERY THESIS IS ONE RELATING IN ITS OWN WORD (D13, no INVERSE table): ${theses.length} theses — each reads back its from-role as the SUBJECT and its to-role as the OBJECT through the one reader (subjectOf · objectOf); ${against} of them run from the edge's SECOND corner and carry \`←\` positionally (no vertex id, no second word); ${ownWord} of ${theses.length} keep the thesis's own word`, theses.length === 44 && bad.length === 0 && ownWord === 44 && against > 0, J({ against, bad }));
  // (ii) what the agent STORED (all `→`, the converse word where the thesis ran the other way) is the same sentence as `←` in the thesis's word
  let inConverse = 0; let inOwn = 0; let unmatched = 0; let mismatch = [];
  for (const e of g1Shape.edges) {
    for (const r of M.relatingsHeld(e)) {
      const th = theses.find((t) => t.e.id === e.id && t.sign === r[3] && ((t.r[1] === r[1] && t.r[2] === r[2]) || (t.r[1] === r[2] && t.r[2] === r[1])) && (t.mode === r[0] || CONVERSE[t.mode] === r[0]));
      if (!th) { unmatched += 1; continue; }
      if (r[0] === th.mode) { inOwn += 1; if (M.dirOf(r) !== '→' || M.subjectOf(r) !== th.f) mismatch.push(J(r)); }
      else { inConverse += 1; const asDir = M.relating(th.mode, r[1], r[2], r[3], '←'); if (M.subjectOf(asDir) !== th.f || M.objectOf(asDir) !== th.t) mismatch.push(J([r, asDir])); }
    }
  }
  check(`§a (ii) WHAT THE AGENT STORED reproduces WITHOUT its CONVERSE table: of its ${inOwn + inConverse} stored relatings on the six seed edges, ${inOwn} are in the thesis's own word (\`→\`, the subject the thesis's from-role) and ${inConverse} in a CONVERSE word (\`x c y\` for a thesis \`y w x\`) — each of those is the same sentence as \`(w, x, y, ←)\`, one word, the subject read back as the thesis's from-role; ${unmatched} unmatched`, inConverse > 0 && mismatch.length === 0 && unmatched === 0, J({ inOwn, inConverse, unmatched, mismatch: mismatch.slice(0, 3) }));
} else note('the customer-side record (record2.cjs · g1_related.json) is not on this checkout — §a skipped');
// F-D13c — the carry: mirrored x ↔ y AND the direction flipped; the sentence preserved (the unit arm), and the shape arm measured
{
  const r = M.relating('carries', 'F2', 'Φ3', '+', '←'); // C's Φ3 carries A's F2, stored A first
  const carried = M.carriedRelatings({ relatings: [r, M.relating('grounds', 'F1', 'Φ1', '+')] }, true);
  check('§a F-D13c THE CARRY at a dissection mirrors x ↔ y AND flips the direction — `(carries, F2, Φ3, +, ←)` walked the other way is `(carries, Φ3, F2, +)` and `(grounds, F1, Φ1, +)` is `(grounds, Φ1, F1, +, ←)`: the subject and the object of each are UNCHANGED (the sentence preserved)', J(carried) === J([['carries', 'Φ3', 'F2', '+'], ['grounds', 'Φ1', 'F1', '+', '←']]) && carried.every((c, i) => M.subjectOf(c) === M.subjectOf([r, ['grounds', 'F1', 'Φ1', '+']][i]) && M.objectOf(c) === M.objectOf([r, ['grounds', 'F1', 'Φ1', '+']][i])), J(carried));
  reset(seededEye());
  const G0 = cur();
  const seedEdges0 = G0.edges.map((e) => [e.vertexIds[0], e.vertexIds[1]]);
  said('C', 'r3', 'carries', 'A', 'F2'); said('B', 'Φ4', 'carries', 'C', 'r3');
  S().applyAmboDissectionToCurrent();
  S().selectCell(cur().cells.find((cc) => cc.kind === 'core').id);
  S().applyAmboDissectionToCurrent();
  const G2 = cur();
  const survivors = G2.edges.filter((e) => e.vertexIds.every((v) => G0.vertices[v] && G0.vertices[v].createdBy.operation === 'seed'));
  const flipped = survivors.filter((e) => seedEdges0.some(([a, b]) => a === e.vertexIds[1] && b === e.vertexIds[0]));
  const sentences = (shape, X, Y) => M.relatingsOn(edgeBetween(shape.edges, byLabel(shape, X), byLabel(shape, Y))).filter((x) => x[0] !== M.IS).map((x) => `${M.subjectOf(x)} ${x[0]} ${M.objectOf(x)}`).sort();
  check(`§a F-D13c on the shape: after TWO dissections the seed edges C–A and B–C still read his sentences \`r3 carries F2\` and \`Φ4 carries r3\` through the one reader (${survivors.length} seed edges survive; ${flipped.length} of them flipped their stored order — the shape arm of F-D13c stays unproducible within two, as measured before; the unit arm above is the carry's law)`, J(sentences(G2, 'C', 'A')) === J(['r3 carries F2']) && J(sentences(G2, 'B', 'C')) === J(['Φ4 carries r3']), J({ survivors: survivors.length, flipped: flipped.length, ca: sentences(G2, 'C', 'A'), bc: sentences(G2, 'B', 'C') }));
}

// ═══ §b THE SORTING ON THE PAGE — her 10:16 acts at AB through C ═══
console.log('\n----- §b the designer\'s sighting (F-D13b) and M3\'s example on the page: a chain from B to A · the rule in the chain\'s own order · the light, then the face\'s, recorded `←` · a fork · a join · a converse -----');
reset(seededEye());
note(`the stored orders: A–B ${E(cur(), 'A', 'B').vertexIds[0] === byLabel(cur(), 'A') ? 'A' : 'B'} first · A–C ${E(cur(), 'A', 'C').vertexIds[0] === byLabel(cur(), 'A') ? 'A' : 'C'} first · C–B ${E(cur(), 'C', 'B').vertexIds[0] === byLabel(cur(), 'C') ? 'C' : 'B'} first`);
S().declareMode('carries');
const a1 = said('C', 'r3', 'carries', 'A', 'F2'); const a2 = said('B', 'Φ4', 'carries', 'C', 'r3');
S().applyAmboDissectionToCurrent();
const G1 = cur(); const AB = midOf(G1, byLabel(G1, 'A'), byLabel(G1, 'B'));
const r1 = renderAt(G1, AB.id);
const KEY = 'F2|carries|r3|carries|Φ4|←←';
check('§b F-D13b THE SIGHTING: `r3 carries F2` (C–A) and `Φ4 carries r3` (B–C) taken; at AB through C the passage is a CHAIN FROM B TO A and says so before its legs, in the chain\'s own order — `from B to A: Φ4 carries r3 · r3 carries F2 — not yet said` (her §3; nothing swapped, no arrow); its key carries the senses `←←`; the per-passage word reads from B to A, `that is Φ4 [your word] F2` (her §5), and `that is not it`', a1 === null && a2 === null && passageLine(r1, KEY) === 'from B to A: Φ4 carries r3 · r3 carries F2 — not yet said that is Φ4 F2 that is not it' && /data-medium-passage-shape="chain"/.test(passageAttrs(r1, KEY)) && /data-medium-passage-from="y"/.test(passageAttrs(r1, KEY)) && !/[→←]/.test(r1.text), J([a1, a2, passageLine(r1, KEY), r1.lines('data-medium-passage').map(([k]) => k)]));
check('§b THE RULE GESTURE in the chain\'s own order (M3; her §4): C\'s block offers `name the two in a row: carries, then carries =`; no gesture names a sense, no gesture reads `from B to A`', /data-medium-rule-gesture="carries\|carries"/.test(viewBlockOf(r1, 'C')) && /name the two in a row: carries, then carries =/.test(unesc(viewBlockOf(r1, 'C'))) && !/name the two in a row, from/.test(r1.text), J(r1.lines('data-medium-rule-gesture')));
S().nameRule('carries', 'carries', 'supports');
const r2 = renderAt(cur(), AB.id);
check('§b M3\'s EXAMPLE: `carries, then carries = supports` composes the chain from B to A in ITS OWN DIRECTION — `Φ4 supports F2` — a light (no relating between A and B says so yet): `from B to A: Φ4 carries r3 · r3 carries F2 — only in C\'s light — through C it would read: Φ4 supports F2 — no relating between A and B says so`; the rule line `you named it: carries, then carries = supports — your word for the two in a row; holds on every such passage`', passageLine(r2, KEY).startsWith('from B to A: Φ4 carries r3 · r3 carries F2 — only in C\'s light — through C it would read: Φ4 supports F2 — no relating between A and B says so') && /data-medium-passage-by="rule"/.test(passageAttrs(r2, KEY)) && r2.lines('data-medium-rule').some(([, s]) => s === 'you named it: carries, then carries = supports — your word for the two in a row; holds on every such passage · withdraw'), J([passageLine(r2, KEY), r2.lines('data-medium-rule')]));
const sAB = SO.sortingOf(cur(), E(cur(), 'A', 'B'), {}, S().rules, { converses: S().converses, opaque: S().opaque });
const pC = sAB.views.find((v) => v.view === byLabel(cur(), 'C')).paths[0];
check('§b the sorting\'s own record of it: the path\'s shape `chain`, from `y`, its one key (carries, carries, chain) with the composite `←`, the composite `supports` with `compositeDir ←`, by rule, LIGHT', pC.path.shape === 'chain' && pC.path.from === 'y' && J(pC.path.keys) === J([{ w: 'carries', w2: 'carries', shape: 'chain', dir: '←' }]) && pC.composite === 'supports' && pC.compositeDir === '←' && pC.by === 'rule' && pC.reading === 'LIGHT', J(pC));
// he says it on A–B: B's Φ4 supports A's F2 — recorded `←` where A is stored first
const a3 = said('B', 'Φ4', 'supports', 'A', 'F2');
const r3 = renderAt(cur(), AB.id);
const eAB = E(cur(), 'A', 'B');
const held = M.relatingsHeld(eAB).filter((x) => x[0] === 'supports');
check('§b RECORDED `←` ON A–B (M3): `Φ4 supports F2` given from B is one entry `(supports, F2, Φ4, +, ←)` where A is stored first (or `(supports, Φ4, F2, +)` where B is) — its subject Φ4 through the one reader; the passage now sits `the face\'s — said between them and through C too: Φ4 supports F2`; the face\'s line and the listing under the drawing print HIS sentence, `Φ4 supports F2 · yours · withdraw`, never the swapped one', a3 === null && held.length === 1 && M.subjectOf(held[0]) === 'Φ4' && M.objectOf(held[0]) === 'F2' && (eAB.vertexIds[0] === byLabel(cur(), 'A') ? J(held[0]) === J(['supports', 'F2', 'Φ4', '+', '←']) : J(held[0]) === J(['supports', 'Φ4', 'F2', '+'])) && passageLine(r3, KEY).startsWith('from B to A: Φ4 carries r3 · r3 carries F2 — the face\'s — said between them and through C too: Φ4 supports F2') && r3.lines('data-medium-faces').some(([, s]) => s === 'the face\'s — said between them and through C too: Φ4 supports F2') && r3.linesAll('data-medium-relating').some(([, s]) => s === 'Φ4 supports F2 · yours · withdraw') && !/F2 supports Φ4/.test(r3.html), J({ a3, held, line: passageLine(r3, KEY), faces: r3.lines('data-medium-faces'), listing: r3.linesAll('data-medium-relating') }));
check('§b the state: the one relating is the face\'s — CLOSED, `all the face\'s — nothing theirs alone, nothing only in a corner\'s light`; the own line reads her §8 with one: `nothing theirs alone — its one relating is also said through C or D`', r3.attr('data-medium-state') === 'CLOSED' && r3.lines('data-medium-own')[0][1] === 'nothing theirs alone — its one relating is also said through C or D', J([r3.attr('data-medium-state'), r3.lines('data-medium-own')]));
const a4 = said('A', 'F1', 'supports', 'B', 'Φ1');
const r3b = renderAt(cur(), AB.id);
check('§b her §8 `both relatings`: with a second relating, own, the own line counts — `A and B\'s alone — no passage through C or D comes to it: F1 supports Φ1`; and the source holds the three forms (one · both · all N) in the own line and EXHAUSTED\'s line alike', a4 === null && /^A and B's alone — no passage through C or D comes to it: F1 supports Φ1$/.test(r3b.lines('data-medium-own')[0][1]) && /related === 1 \? 'its one relating is' : related === 2 \? 'both relatings are' : 'all ' \+ related \+ ' relatings are'/.test(fs.readFileSync(path.join(repoRoot, 'src/components/MediumBlock.tsx'), 'utf8')), J(r3b.lines('data-medium-own')));
unsay('A', 'F1', 'supports', 'B', 'Φ1'); unsay('B', 'Φ4', 'supports', 'A', 'F2');
// a FORK: both from r3
unsay('B', 'Φ4', 'carries', 'C', 'r3');
said('C', 'r3', 'grounds', 'B', 'Φ4');
const r4 = renderAt(cur(), AB.id);
const KF = 'F2|carries|r3|grounds|Φ4|←→';
check('§b A FORK (her §3): `r3 carries F2` and `r3 grounds Φ4` read `both from r3: r3 carries F2 · r3 grounds Φ4 — not yet said`; its gesture `name the two from one point: carries and grounds =` (her §4); the chain rule (carries, carries) does not touch it; the per-passage word reads `that is F2 [your word] Φ4`', passageLine(r4, KF) === 'both from r3: r3 carries F2 · r3 grounds Φ4 — not yet said that is F2 Φ4 that is not it' && /data-medium-passage-shape="fork"/.test(passageAttrs(r4, KF)) && /data-medium-rule-gesture="carries\|grounds\|fork"/.test(viewBlockOf(r4, 'C')) && /name the two from one point: carries and grounds =/.test(unesc(viewBlockOf(r4, 'C'))), J([passageLine(r4, KF), r4.lines('data-medium-rule-gesture')]));
S().nameRule('carries', 'grounds', 'siblings', 'fork');
const r5 = renderAt(cur(), AB.id);
check('§b THE FORK RULE named: `you named it: carries and grounds from one point = siblings — your word for the two from one point; holds on every such passage`; the passage composes `F2 siblings Φ4` (the end of the first-named word, carries, the subject) — a light', r5.lines('data-medium-rule').some(([, s]) => s === 'you named it: carries and grounds from one point = siblings — your word for the two from one point; holds on every such passage · withdraw') && passageLine(r5, KF).startsWith('both from r3: r3 carries F2 · r3 grounds Φ4 — only in C\'s light — through C it would read: F2 siblings Φ4 — no relating between A and B says so'), J([r5.lines('data-medium-rule'), passageLine(r5, KF)]));
// a JOIN: both into r3 — the fork rule does not read it
unsay('C', 'r3', 'carries', 'A', 'F2'); unsay('C', 'r3', 'grounds', 'B', 'Φ4');
said('A', 'F2', 'carries', 'C', 'r3'); said('B', 'Φ4', 'grounds', 'C', 'r3');
const r6 = renderAt(cur(), AB.id);
const KJ = 'F2|carries|r3|grounds|Φ4|→←';
check('§b A JOIN (her §3): `F2 carries r3` and `Φ4 grounds r3` read `both into r3: F2 carries r3 · Φ4 grounds r3 — not yet said`; its own gesture `name the two into one point: carries and grounds =`; the FORK rule (carries and grounds from one point) does NOT read it — no `you named it` line in C\'s block (M3: a fork and a join are keys of their own)', passageLine(r6, KJ) === 'both into r3: F2 carries r3 · Φ4 grounds r3 — not yet said that is F2 Φ4 that is not it' && /data-medium-passage-shape="join"/.test(passageAttrs(r6, KJ)) && /data-medium-rule-gesture="carries\|grounds\|join"/.test(viewBlockOf(r6, 'C')) && /name the two into one point: carries and grounds =/.test(unesc(viewBlockOf(r6, 'C'))) && !/data-medium-rule=/.test(viewBlockOf(r6, 'C')), J([passageLine(r6, KJ), r6.lines('data-medium-rule-gesture'), r6.lines('data-medium-rule')]));
// a CONVERSE turns the fork into a chain, and the chain's rule reads it
unsay('A', 'F2', 'carries', 'C', 'r3'); unsay('B', 'Φ4', 'grounds', 'C', 'r3');
said('C', 'r3', 'carries', 'A', 'F2'); said('C', 'r3', 'grounds', 'B', 'Φ4');
S().withdrawRule('carries', 'grounds', 'fork');
S().declareConverse('carries', 'carried-by');
S().nameRule('carried-by', 'grounds', 'leans-on');
const r7 = renderAt(cur(), AB.id);
check('§b A DECLARED CONVERSE reads the fork as a CHAIN (M3; D13): with `carries ↔ carried-by` and the chain rule (carried-by, then grounds) ↦ leans-on, the fork `both from r3: r3 carries F2 · r3 grounds Φ4` composes `F2 leans-on Φ4` — a light — and C\'s block prints the rule that reads it, `you named it: carried-by, then grounds = leans-on — your word for the two in a row; holds on every such passage`; the legs still print as he said them', passageLine(r7, KF).startsWith('both from r3: r3 carries F2 · r3 grounds Φ4 — only in C\'s light — through C it would read: F2 leans-on Φ4 — no relating between A and B says so') && /data-medium-passage-by="rule"/.test(passageAttrs(r7, KF)) && r7.lines('data-medium-rule').some(([, s]) => s === 'you named it: carried-by, then grounds = leans-on — your word for the two in a row; holds on every such passage · withdraw'), J([passageLine(r7, KF), r7.lines('data-medium-rule')]));
S().withdrawConverse('carries');
const r8 = renderAt(cur(), AB.id);
check('§b the converse withdrawn, the fork is a fork again: `not yet said`, its own gesture back', passageLine(r8, KF).startsWith('both from r3: r3 carries F2 · r3 grounds Φ4 — not yet said') && /data-medium-rule-gesture="carries\|grounds\|fork"/.test(viewBlockOf(r8, 'C')), passageLine(r8, KF));

// ═══ §c the mode's declaration and the direction choice (her §1, §2) ═══
console.log('\n----- §c the mode\'s declaration (the converse, the opaque bit) and the direction as a choice on the act line -----');
{
  const e = E(cur(), 'A', 'B');
  const bIS = renderBlock(cur(), e, AB.id, 'A', 'B', 'IS');
  const bC = renderBlock(cur(), e, AB.id, 'A', 'B', 'carries');
  check('§c §2 THE DIRECTION IS A CHOICE ON THE ACT LINE, both sentence shapes written out, the chosen one underlined: `a relating — pick a point in A and one in B; it reads "A\'s point carries B\'s point" · "B\'s point carries A\'s point" — it holds · it does not hold` (`→` chosen); for IS the choice does not appear (`it reads "A\'s point ≡ B\'s point"`)', bC.lines('data-medium-gesture')[0][1] === 'a relating — pick a point in A and one in B; it reads "A\'s point carries B\'s point" · "B\'s point carries A\'s point" — it holds · it does not hold' && /data-medium-dir="→"[^>]*data-medium-dir-chosen="true"/.test(bC.html) && !/data-medium-dir="←"[^>]*data-medium-dir-chosen/.test(bC.html) && bIS.lines('data-medium-gesture')[0][1] === 'a relating — pick a point in A and one in B; it reads "A\'s point ≡ B\'s point" — it holds · it does not hold' && !/data-medium-dir=/.test(bIS.html), J([bC.lines('data-medium-gesture'), bIS.lines('data-medium-gesture')]));
  const bL = renderBlock(cur(), e, AB.id, 'A', 'B', 'carries', '←');
  check('§c `←` chosen: the second shape underlined, the words the same', /data-medium-dir="←"[^>]*data-medium-dir-chosen="true"/.test(bL.html) && !/data-medium-dir="→"[^>]*data-medium-dir-chosen/.test(bL.html) && bL.lines('data-medium-gesture')[0][1] === bC.lines('data-medium-gesture')[0][1]);
  check('§c §1 THE MODE\'S DECLARATION for the chosen mode, never for IS: `carries the other way round:` with a field and NO hand while it is empty; the opaque bit `a pair passes through carries · a pair stops at carries`, passes-through chosen by default; nothing of either under IS', bC.lines('data-medium-converse')[0][1] === 'carries the other way round:' && !/data-medium-converse-name/.test(bC.html) && /data-medium-converse-input="carries"/.test(bC.html) && bC.lines('data-medium-opaque-line')[0][1] === 'a pair passes through carries · a pair stops at carries' && /data-medium-opaque="through"[^>]*data-medium-opaque-chosen="true"/.test(bC.html) && !/data-medium-opaque="stops"[^>]*data-medium-opaque-chosen/.test(bC.html) && bIS.lines('data-medium-converse').length === 0 && bIS.lines('data-medium-opaque-line').length === 0, J([bC.lines('data-medium-converse'), bC.lines('data-medium-opaque-line')]));
  S().declareConverse('carries', 'carried-by');
  const bV = renderBlock(cur(), e, AB.id, 'A', 'B', 'carries');
  check('§c the converse given: `carries the other way round: carried-by — "y carried-by x" is "x carries y" · withdraw` (her §1, verbatim); the store holds one equation per word, IS refused', bV.lines('data-medium-converse')[0][1] === 'carries the other way round: carried-by — "y carried-by x" is "x carries y" · withdraw' && /data-medium-converse-withdraw="carries"/.test(bV.html) && (() => { S().declareConverse('IS', 'same'); S().declareConverse('carries', 'borne-by'); return J(S().converses) === J([['carries', 'borne-by']]); })(), J([bV.lines('data-medium-converse'), S().converses]));
  S().withdrawConverse('carries');
  S().setOpaque('carries', true);
  const bO = renderBlock(cur(), e, AB.id, 'A', 'B', 'carries');
  check('§c the opaque bit chosen: `a pair stops at carries` underlined, `a pair passes through carries` not; IS takes no opaque bit', /data-medium-opaque="stops"[^>]*data-medium-opaque-chosen="true"/.test(bO.html) && !/data-medium-opaque="through"[^>]*data-medium-opaque-chosen/.test(bO.html) && (() => { S().setOpaque('IS', true); return J(S().opaque) === J(['carries']); })(), J(S().opaque));
  S().setOpaque('carries', false);
  check('§c the register rule in the source: the mode, the direction and the bar are the ACT LINE\'s state (the surface\'s, reset on leaving the midpoint with the mode); the converse and the opaque bit are the STORE\'s, persisted with the workspace', (() => { const ms = fs.readFileSync(path.join(repoRoot, 'src/components/MidpointSurface.tsx'), 'utf8'); const st = fs.readFileSync(path.join(repoRoot, 'src/store/geometryStore.ts'), 'utf8'); const wp = fs.readFileSync(path.join(repoRoot, 'src/lib/workspacePersistence.ts'), 'utf8'); return /setMode\(IS\);\r?\n\s*setBarNext\(false\);\r?\n\s*setDir\(ALONG\);/.test(ms) && /converses: state\.converses,/.test(st) && /opaque: state\.opaque,/.test(st) && /converses\?: Array<\[string, string\]>;/.test(wp) && /opaque\?: string\[\];/.test(wp); })());
}

// ═══ §d HELD APART — §9.13, the researcher's falsifier ═══
console.log('\n----- §d held apart: an opaque mode stops the pair; transparent again, the light returns -----');
reset(seededWords());
give('A', 'C', { F13: 'Φ8' });
said('B', 'r9', 'carries', 'C', 'Φ8');
S().applyAmboDissectionToCurrent();
const Gw = cur(); const ABw = midOf(Gw, byLabel(Gw, 'A'), byLabel(Gw, 'B'));
const KM = 'F13|IS|Φ8|carries|r9|→←';
const h0 = renderAt(Gw, ABw.id);
check('§d TRANSPARENT (the default): the mixed passage composes by substitution — `F13 ≡ Φ8 · r9 carries Φ8 — only in C\'s light — through C it would read: r9 carries F13 — no relating between A and B says so`, no shape said (its IS leg is symmetric), no hand', passageLine(h0, KM) === 'F13 ≡ Φ8 · r9 carries Φ8 — only in C\'s light — through C it would read: r9 carries F13 — no relating between A and B says so' && /data-medium-passage-by="substitution"/.test(passageAttrs(h0, KM)), passageLine(h0, KM));
S().setOpaque('carries', true);
const h1 = renderAt(cur(), ABw.id);
const sW = SO.sortingOf(cur(), E(cur(), 'A', 'B'), {}, S().rules, { converses: S().converses, opaque: S().opaque });
const vW = sW.views.find((v) => v.view === byLabel(cur(), 'C'));
check('§d OPAQUE (`a pair stops at carries`): the passage reads `F13 ≡ Φ8 · r9 carries Φ8 — held apart: the pair F13 ≡ Φ8 stops at carries` (her §3, the declaration\'s own words) — reading HELD, NO reading after it, NO hand, counted neither as a light nor as unsaid; the site is not UNRULED by it', passageLine(h1, KM) === 'F13 ≡ Φ8 · r9 carries Φ8 — held apart: the pair F13 ≡ Φ8 stops at carries' && /data-medium-passage-reading="HELD"/.test(passageAttrs(h1, KM)) && !/data-medium-say/.test(elementsIn(h1.block, 'data-medium-passage').find(([k]) => k === KM)[1]) && vW.lights.length === 0 && vW.unruled.length === 0 && vW.paths.length === 1 && h1.attr('data-medium-state') !== 'UNRULED' && h1.lines('data-medium-unruled').length === 0, J([passageLine(h1, KM), h1.attr('data-medium-state'), vW.lights.length, vW.unruled.length]));
S().setOpaque('carries', false);
const h2 = renderAt(cur(), ABw.id);
check('§d TRANSPARENT AGAIN: the light returns (the researcher\'s falsifier, §9.13)', passageLine(h2, KM) === passageLine(h0, KM) && /data-medium-passage-reading="LIGHT"/.test(passageAttrs(h2, KM)), passageLine(h2, KM));

// ═══ §e M1 — the coordinate pair refused by name ═══
console.log('\n----- §e M1: the coordinate pair on a corner edge, refused by name in her words; a mode word on it an ordinary entry -----');
reset(seededWords());
give('A', 'B', { F7: 'r0' });
S().applyAmboDissectionToCurrent();
const Gm = cur(); const ABm = midOf(Gm, byLabel(Gm, 'A'), byLabel(Gm, 'B')); const Am = byLabel(Gm, 'A');
const eAAB = edgeBetween(Gm.edges, Am, ABm.id);
const why = S().giveRelating(eAAB.id, 'IS', ...oriented(eAAB, Am, 'F7', 'F7≡r0'), '+');
check('§e M1 (ADR 0031 §9.10; the designer\'s 11:00 §1): on the corner edge A–AB the IS act on A\'s F7 and AB\'s F7 ≡ r0 (F7 its A-coordinate) is REFUSED BY NAME at the act — `(F7 ≡ r0) already holds F7 — it is carried there` — the subject the relating, `holds` the one structure word; the refusal recorded on the edge (the surface\'s hand `withdraw this attempt`)', why && why.why === '(F7 ≡ r0) already holds F7 — it is carried there' && S().midpointRefusals[eAAB.id] && S().midpointRefusals[eAAB.id].form === '(F7 ≡ r0) already holds F7 — it is carried there', J([why, S().midpointRefusals[eAAB.id] && S().midpointRefusals[eAAB.id].form]));
S().withdrawMidpointAttempt(eAAB.id);
const okMode = S().giveRelating(eAAB.id, 'carries', ...oriented(eAAB, Am, 'F7', 'F7≡r0'), '+');
check('§e a MODE word on the same pair is an ORDINARY entry (§9.10): `F7 carries (F7 ≡ r0)` taken, one relating held on A–AB', okMode === null && M.relatingsHeld(edgeBetween(cur().edges, Am, ABm.id)).length === 1, J([okMode, M.relatingsHeld(edgeBetween(cur().edges, Am, ABm.id))]));
S().withdrawRelating(eAAB.id, 'carries', ...oriented(eAAB, Am, 'F7', 'F7≡r0'));
const whyOther = S().giveRelating(eAAB.id, 'IS', ...oriented(eAAB, Am, 'F1', 'F7≡r0'), '+');
check('§e an IS between a parent\'s role and an instance NOT holding it is refused by the solid\'s own composed identity as before (F1 is carried into its own class), never by M1\'s words', whyOther && /already one with .* by the solid/.test(whyOther.why) && !/carried there/.test(whyOther.why), J(whyOther));
S().withdrawMidpointAttempt(eAAB.id);

// ═══ §f F-D16 — the refused route on the agent's final save ═══
console.log('\n----- §f F-D16: the refused routes on g2_verdicts.json — the instance\'s form, never a state -----');
const g2Path = path.join(repoRoot, '.handoff/REPORTS_CUSTOMER-SIDE_2026-09-28/saves/ta2/saves/g2_verdicts.json');
if (fs.existsSync(g2Path)) {
  const g2 = parseWorkspaceImport(JSON.parse(fs.readFileSync(g2Path, 'utf8')));
  S().importWorkspace(g2);
  const shape = cur();
  const facts = { converses: S().converses, opaque: S().opaque };
  const label = (id) => shape.vertices[id].data.label || id;
  const census = [];
  let nots = 0; let attached = 0;
  for (const e of shape.edges) {
    const s = SO.sortingOf(shape, e, {}, S().rules, facts);
    if (!s) continue;
    const n = s.views.reduce((k, v) => k + v.paths.filter((p) => p.reading === 'NOT').length, 0);
    nots += n;
    if (s.refused.size > 0) { attached += s.refusedRoutes; census.push({ edge: `${label(e.vertexIds[0])}–${label(e.vertexIds[1])}`, routes: s.refusedRoutes, forms: [...s.refused.entries()].map(([k, vs]) => `${k} — not by way of ${vs.map(label).join(' or ')}`), state: s.state }); }
  }
  note(`the census: ${nots} NOT says on the mesh; ${attached} of them attach to a standing instance as a REFUSED ROUTE, on ${census.length} edges: ${J(census)}`);
  const at = (a, b) => census.find((c) => c.edge === `${a}–${b}` || c.edge === `${b}–${a}`);
  check('§f F-D16 (the ruling §4): the NOTs of the Arendt fork attach to standing instances at Institution–Event, Event–Practical reason and Practical reason–Institution as REFUSED ROUTES — each of the three carries at least one; a NOT whose endpoints hold no direct in its word attaches to nothing (the plain NOT: the attached count is below the NOT count); no refused route is a state (the states are the eight tokens only)', !!at('Institution', 'Event') && !!at('Event', 'Practical reason') && !!at('Practical reason', 'Institution') && attached > 0 && attached < nots && census.every((c) => ['UNDETECTED', 'VACUOUS', 'UNRULED', 'POCKET', 'EXHAUSTED', 'CLOSED', 'COHERENT', 'OPEN'].includes(c.state)), J({ nots, attached, edges: census.map((c) => c.edge) }));
  const ie = at('Institution', 'Event');
  const mid = midOf(shape, byLabel(shape, 'Institution'), byLabel(shape, 'Event'));
  const rF = mid ? renderAt(shape, mid.id) : null;
  const formLines = rF ? [...rF.lines('data-medium-own'), ...rF.lines('data-medium-faces'), ...rF.lines('data-medium-pocket-line')].filter(([, s]) => /— not by way of .*, you said/.test(s)) : [];
  check('§f her §6 ON THE PAGE at Institution–Event: wherever the refused instance is listed in the sorting it carries its form — `… — not by way of X, you said` — the passage line keeps `you said: that is not it`; the state line names no refused route', !!ie && !!rF && formLines.length > 0 && /you said: that is not it/.test(rF.text) && !/not by way of/.test(rF.lines('data-medium-state-line')[0][1]), J({ ie, formLines: formLines.map(([, s]) => s.slice(0, 200)), state: rF && rF.lines('data-medium-state-line') }));
} else note('the customer-side save g2_verdicts.json is not on this checkout — §f skipped');

console.log(`\n${failures === 0 ? 'DIAGNOSE-MODES4-THE-RECORD-AND-THE-SORTING: ALL PASS — the direction rides the record positionally and the carry keeps the sentence; the agent\'s converse words reproduce as direction bits with no new word; a chain is one key whichever way it crosses the edge, in its own order and direction, a fork and a join their own keys, a converse reads them as a chain; the shape is said in words and never as an arrow; an opaque mode holds the pair apart; the coordinate pair is refused in her words; a refused route is the instance\'s form' : `DIAGNOSE-MODES4-THE-RECORD-AND-THE-SORTING: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
