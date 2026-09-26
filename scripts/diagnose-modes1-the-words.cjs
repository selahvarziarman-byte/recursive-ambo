#!/usr/bin/env node

// DIAGNOSTIC — STAMP MODES-1 · B5 (2026-09-26): THE MEDIUM IN THE DESIGNER'S WORDS (her letter of 17:15, ratified for meaning
// §207; D2–D11). The block rendered under node (react-dom/server) at the midpoint AB of the seeded tetrahedron and read as text:
// §0 purity and her three rules by construction (the D-names never in text; `≡` for IS only) · §a THE COUNTS HEAD, the modes with
// IS, the gesture line, the child's line · §b THE PASSAGES read where they sit — `the face's — said between them and through C
// too`, `only in C's light — through C it would read: … — no relating between A and B says so`, `against your bar`, `not yet
// said`; D — `no passage yet` · §c HIS ACTS: a mode declared and a relating given (its sentence, its hand), a bar (`barred by
// you`), a rule (`you named it: …`), a say (`you said: that is "…"`), an exception (`except here`), a disagreement across faces
// (`your says differ`) · §d THE STATES, one line with a count: `not yet looked into` · `nothing theirs alone` · `all the face's` ·
// `nothing against it` · the pocket · §e THE NAME KEPT WITH ITS STATE (D11): `named when it was: …` · §f THE DEVICE'S OWN LIGHTS at
// a deeper generation: `only in A's light: … nobody said it` · §g Virgin Land's record at Value–Action: triads alone read as
// lights, `not yet looked into` · §h where every line sits (under the own column and the feet; never above the drawing; a light
// never first in its block; every line the same weight).
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
const React = require('react');
const { renderToString } = require('react-dom/server');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json'); const triangle = cast('triangle.cast.json');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const seeded4 = () => { let s = createSeedShape('tetrahedron'); for (const [l, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', triangle]]) s = withCast(s, byLabel(s, l), c); return s; };
const reset = (seeded) => useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], rules: [], liftSelection: [], selectedCellId: null, selectedVertexId: null, selectedEdgeId: null, selectedFaceId: null });
const E = (shape, X, Y) => edgeBetween(shape.edges, byLabel(shape, X), byLabel(shape, Y));
const give = (X, Y, map) => { const e = E(cur(), X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
const oriented = (e, X, x, y) => (e.vertexIds[0] === X ? [x, y] : [y, x]);
const midOf = (shape, u, v) => Object.values(shape.vertices).find((w) => w.createdBy.operation !== 'seed' && w.createdBy.sourceVertexIds.length === 2 && w.createdBy.sourceVertexIds.includes(u) && w.createdBy.sourceVertexIds.includes(v));
const NEVER = /extent|lexicon|instance|verdict|centroid|discordance|vacuous|exhausted|pocket|unruled|coherent|closed|proposal|pushout|\bpath\b|edge [A-Z]{2}\b/i;

/** the surface rendered under node at a midpoint; the medium's block as text and its lines by attribute */
const renderAt = (shape, siteId) => {
  const packet = buildGeneralSitePacketPresenterReport(shape).packets.find((p) => p.trace.siteId === siteId);
  const site = midpointSiteOf(shape, siteId, packet ? packet.trace : null);
  const resolved = spaceOf(shape, siteId);
  const parents = [spaceOf(shape, site.a), spaceOf(shape, site.b)];
  const html = renderToString(React.createElement(MidpointSurface, { shape, site, parents, resolved, refusal: null, remade: null })).replace(/<!-- -->/g, '');
  const start = html.indexOf('<div data-medium="true"');
  if (start < 0) return { html, block: null, text: '', lines: () => [] };
  // the block's HTML: its own div and everything to the trace's div (the next sibling), or the end
  const after = html.indexOf('<div data-midpoint-trace="true"', start);
  const blockHtml = html.slice(start, after > 0 ? after : undefined);
  const text = blockHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').trim();
  const lines = (attr) => [...blockHtml.matchAll(new RegExp(`<span[^>]*${attr}="([^"]*)"[^>]*>([\\s\\S]*?)</span>`, 'g'))].map((m) => [m[1], m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').trim()]);
  const attr = (name) => { const m = blockHtml.match(new RegExp(`<div data-medium="true"[^>]*${name}="([^"]*)"`)); return m ? m[1] : null; };
  return { html, block: blockHtml, text, lines, attr, before: html.slice(0, start) };
};

// ═══ §0 PURITY AND HER THREE RULES ═══
console.log('THE WORDS — B5 (MODES-1)\n\n----- §0 purity and her three rules -----');
const src = readLf('src/components/MediumBlock.tsx');
const textOf = (s) => s.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const printed = [...textOf(src).matchAll(/`([^`]*)`|'([^']*)'|"([^"]*)"/g)].filter((m) => !/[=!]== $/.test(textOf(src).slice(Math.max(0, m.index - 4), m.index))).map((m) => m[1] ?? m[2] ?? m[3]).filter((s) => /[a-z]{3,}/.test(s) && !/^data-|^\.\.\/|^\.\/|className|^h-|^text-|^flex|^underline|^grid|^mt-|^rounded/.test(s) && !/\$\{[^}]*\}$/.test(s) && !/^[a-z]+\|[a-z]+$/.test(s));
const offending = printed.filter((s) => NEVER.test(s.replace(/\$\{[^}]*\}/g, '')));
check('§0 HER RULE 1 BY CONSTRUCTION: no string the block prints carries a researcher\'s coinage (extent · lexicon · instance · verdict · centroid · discordance · vacuous · exhausted · pocket · unruled · coherent · closed · proposal · pushout · path · edge AB) — the D-names live in data attributes only', offending.length === 0, J(offending.slice(0, 6)));
check('§0 HER RULE 3: `≡` is printed for IS alone — the sentence prints `≡` iff the mode is IS, any other mode prints its word', /r\[0\] === IS \? `\$\{nameA\(r\[1\]\)\} ≡ \$\{nameB\(r\[2\]\)\}` : `\$\{nameA\(r\[1\]\)\} \$\{r\[0\]\} \$\{nameB\(r\[2\]\)\}`/.test(src));
check('§0 the block reads B1–B4 and decides nothing: it imports mediumOf, childSpaceOf, lexiconOf, the sorting\'s types and nameIn — no glue, no sorting of its own, no spaceOf', /from '\.\.\/lib\/descent'/.test(src) && !/\bglue\(|sortFromRecords|composedOn|spaceOf\(/.test(textOf(src)));

// ═══ §a the head, the modes, the gesture, the child ═══
console.log('\n----- §a the counts head, the modes, the gesture, the child -----');
reset(seeded4());
give('A', 'B', { F7: 'r0', F13: 'r8', F9: 'r1' }); // (i)
give('A', 'C', { F13: 'Φ8', F9: 'Φ1', F3: 'Φ2' }); // S1
give('C', 'B', { Φ8: 'r0', Φ1: 'r1' }); // Q
S().applyAmboDissectionToCurrent();
const G1 = cur();
const AB = midOf(G1, byLabel(G1, 'A'), byLabel(G1, 'B'));
const r1 = renderAt(G1, AB.id);
check('§a the block renders at the midpoint AB (`data-medium`), under the own column and the feet (after the last foot block, before the trace)', !!r1.block && r1.before.lastIndexOf('data-midpoint-foot=') < r1.before.length && r1.before.includes('data-midpoint-own="glued"'), r1.block ? `block ${r1.block.length} chars` : 'no block');
const head = r1.lines('data-medium-head')[0];
check('§a THE HEAD counts the medium\'s extent and nothing else: `between A and B — 1 mode · 14 × 10 roles · 140 could be related · 3 related · 0 barred`', !!head && head[1] === 'between A and B — 1 mode · 14 × 10 roles · 140 could be related · 3 related · 0 barred', head && head[1]);
check('§a THE MODES line names his modes with IS, chosen, and the bar toggle reads `does not hold`; the gesture line says what two picks make', /your modes:/.test(r1.text) && /data-medium-mode="IS"[^>]*data-medium-mode-chosen="true"/.test(r1.block) && /does not hold/.test(r1.text) && /a relating — pick a point in A and one in B; it reads "A's point ≡ B's point"/.test(r1.text));
check('§a THE CHILD\'s line: `the concept between A and B — made of your 3 relatings`', r1.lines('data-medium-child')[0] && r1.lines('data-medium-child')[0][1] === 'the concept between A and B — made of your 3 relatings', J(r1.lines('data-medium-child')));

// ═══ §b the passages ═══
console.log('\n----- §b the passages, where they sit -----');
const heads = r1.lines('data-medium-view-head').map(([, s]) => s);
check('§b the views: `through C: 2 passages` (F3 → Φ2 reaches no B-role: no passage) and `D — no passage yet: nothing related on A–D or D–B`', J(heads) === J(['through C: 2 passages', 'D — no passage yet: nothing related on A–D or D–B']), J(heads));
const passages = [...r1.block.matchAll(/data-medium-passage="([^"]*)" data-medium-passage-reading="([^"]*)"/g)].map((m) => [m[1], m[2]]);
const passageTexts = r1.lines('data-medium-passage').map(([, s]) => s);
const saysOffered = (r1.block.match(/data-medium-say="composed\|/g) || []).length + (r1.block.match(/data-medium-said="true"/g) || []).length;
check('§b THE READINGS in her words: F13 → Φ8 → r0 with F13 ≡ r8 given sits `against your bar` (the solid\'s one-to-one on F13); F9 → Φ1 → r1 with F9 ≡ r1 given is `the face\'s — said between them and through C too`; F3 → Φ2 reaches no B-role (no passage) — and every passage has its two says or its `you said`', passages.length === 2 && passages.some(([, r]) => r === 'TENSION') && passages.some(([, r]) => r === 'COMPOSED') && passageTexts.some((s) => /against your bar — through C it would say .* — which you barred/.test(s)) && passageTexts.some((s) => /the face's — said between them and through C too: /.test(s)) && saysOffered === passages.length, J({ passages, texts: passageTexts, saysOffered }));
const own = r1.lines('data-medium-own')[0];
const faces = r1.lines('data-medium-faces');
check('§b THE SORTING: `A and B\'s alone — no passage through C or D comes to it: F7 ≡ r0 · F13 ≡ r8` and `the face\'s — said between them and through C too: F9 ≡ r1`', !!own && /^A and B's alone — no passage through C or D comes to it: /.test(own[1]) && /F7 ≡ r0/.test(own[1]) && /F13 ≡ r8/.test(own[1]) && faces.length === 1 && faces[0][1] === "the face's — said between them and through C too: F9 ≡ r1", J({ own: own && own[1], faces }));
const stateLine1 = r1.lines('data-medium-state-line')[0];
check('§b THE STATE is one line with a count, never a grade: with a bar pressed the line counts what is theirs alone and what is the face\'s', !!stateLine1 && stateLine1[1] === "2 relatings theirs alone · 1 relating the face's" && r1.attr('data-medium-coherent') === 'false', stateLine1 && stateLine1[1]);
check('§b NONE OF THE RESEARCHER\'S COINAGES is in the block\'s text', !NEVER.test(r1.text), (r1.text.match(NEVER) || [])[0]);

// ═══ §c his acts ═══
console.log('\n----- §c his acts: a mode, a relating, a bar, a rule, a say, an exception, a disagreement -----');
S().declareMode('carries');
const eAB1 = E(cur(), 'A', 'B'); const A1 = byLabel(cur(), 'A');
S().giveRelating(eAB1.id, 'carries', ...oriented(eAB1, A1, 'F2', 'r3'), '+');
S().giveRelating(eAB1.id, 'resists', ...oriented(eAB1, A1, 'F4', 'r5'), '-');
const r2 = renderAt(cur(), AB.id);
check('§c a mode declared joins the modes line; a relating given reads as HIS SENTENCE with its hand — `F2 carries r3 · withdraw`; a bar reads `barred by you: F4 resists r5`', /data-medium-mode="carries"/.test(r2.block) && r2.lines('data-medium-relating').some(([, s]) => /^F2 carries r3 · withdraw$/.test(s)) && r2.lines('data-medium-bar').some(([, s]) => /^barred by you: F4 resists r5 · withdraw$/.test(s)) && /3 modes · 14 × 10 roles · 420 could be related · 4 related · 1 barred/.test(r2.lines('data-medium-head')[0][1]), J({ head: r2.lines('data-medium-head')[0], relatings: r2.lines('data-medium-relating'), bars: r2.lines('data-medium-bar') }));
// a passage in two modes: F2 carries Φ3 on A–C, Φ3 resists r3 on C–B → UNRULED; then a rule; then a say
const eAC1 = E(cur(), 'A', 'C'); const eCB1 = E(cur(), 'C', 'B'); const C1 = byLabel(cur(), 'C');
S().giveRelating(eAC1.id, 'carries', ...oriented(eAC1, A1, 'F2', 'Φ3'), '+');
S().giveRelating(eCB1.id, 'resists', ...oriented(eCB1, C1, 'Φ3', 'r3'), '+');
const r3 = renderAt(cur(), AB.id);
check('§c a passage in two modes with no rule reads `not yet said`, and the view says `1 passage through C you have not said what it comes to`; the rule gesture offers `name the two in a row: carries, then resists =`', [...r3.block.matchAll(/data-medium-passage-reading="UNRULED"/g)].length === 1 && r3.lines('data-medium-unruled').some(([, s]) => s === '1 passage through C you have not said what it comes to') && /name the two in a row: carries, then resists =/.test(r3.text), J(r3.lines('data-medium-unruled')));
S().nameRule('carries', 'resists', 'carries');
const r4 = renderAt(cur(), AB.id);
check('§c THE RULE named reads `you named it: carries, then resists = carries — your word for the two in a row; holds on every passage with those two`; the passage now sits `the face\'s` (F2 carries r3 is the face\'s through C)', r4.lines('data-medium-rule').some(([, s]) => /^you named it: carries, then resists = carries — your word for the two in a row; holds on every passage with those two · withdraw$/.test(s)) && r4.lines('data-medium-faces').some(([, s]) => /F2 carries r3/.test(s)), J(r4.lines('data-medium-rule')));
const fABC = cur().faces.find((f) => f.vertexIds.length === 3 && ['A', 'B', 'C'].every((l) => f.vertexIds.includes(byLabel(cur(), l))));
const iA = fABC.vertexIds.indexOf(A1); const iB = fABC.vertexIds.indexOf(byLabel(cur(), 'B'));
S().giveVerdict(fABC.id, { base: [iA, iB], x: 'F2', w: 'carries', z: 'Φ3', w2: 'resists', y: 'r3', w3: 'resists', verdict: 'composed' });
const r5 = renderAt(cur(), AB.id);
check('§c A SAY against the rule reads `you said: that is "F2 resists r3"` with `except here — you said this passage is "resists"`, and the rule\'s line carries `— yours, with 1 exception`', r5.lines('data-medium-said').some(([, s]) => s === 'you said: that is "F2 resists r3"') && r5.lines('data-medium-exception').some(([, s]) => s === 'except here — you said this passage is "resists"') && r5.lines('data-medium-rule').some(([, s]) => /— yours, with 1 exception/.test(s)), J({ said: r5.lines('data-medium-said'), exception: r5.lines('data-medium-exception') }));
S().giveVerdict(fABC.id, { base: [iA, iB], x: 'F2', w: 'carries', z: 'Φ3', w2: 'resists', y: 'r3', w3: 'resists', verdict: 'not' });
const r6 = renderAt(cur(), AB.id);
check('§c `that is not it` reads `you said: that is not it` on the passage', r6.block.includes('data-medium-passage-reading="NOT"') && /you said: that is not it/.test(r6.text));
// a disagreement across faces: the same word-pair said differently through D
const fABD = cur().faces.find((f) => f.vertexIds.length === 3 && ['A', 'B', 'D'].every((l) => f.vertexIds.includes(byLabel(cur(), l))));
const eAD1 = E(cur(), 'A', 'D'); const eDB1 = E(cur(), 'D', 'B'); const D1 = byLabel(cur(), 'D');
S().giveRelating(eAD1.id, 'carries', ...oriented(eAD1, A1, 'F2', 'x'), '+');
S().giveRelating(eDB1.id, 'resists', ...oriented(eDB1, D1, 'x', 'r3'), '+');
S().giveVerdict(fABC.id, { base: [iA, iB], x: 'F2', w: 'carries', z: 'Φ3', w2: 'resists', y: 'r3', w3: 'sustains', verdict: 'composed' });
S().giveVerdict(fABD.id, { base: [fABD.vertexIds.indexOf(A1), fABD.vertexIds.indexOf(byLabel(cur(), 'B'))], x: 'F2', w: 'carries', z: 'x', w2: 'resists', y: 'r3', w3: 'grounds', verdict: 'composed' });
const r7 = renderAt(cur(), AB.id);
check('§c A DISAGREEMENT across the faces reads `your says differ across the faces: through C you said "sustains", through D you said "grounds"` — both kept, and the state line is not `nothing against it`', r7.lines('data-medium-says-differ').some(([, s]) => s === 'your says differ across the faces: through C you said "sustains", through D you said "grounds"') && r7.attr('data-medium-coherent') === 'false', J(r7.lines('data-medium-says-differ')));

// ═══ §d the states ═══
console.log('\n----- §d the states, one line with a count -----');
reset(seeded4());
S().applyAmboDissectionToCurrent();
const G0 = cur(); const AB0 = midOf(G0, byLabel(G0, 'A'), byLabel(G0, 'B'));
const u = renderAt(G0, AB0.id);
check('§d UNDETECTED: `A and B together, as two — not yet looked into: nothing related between them yet` — never "nothing there"', u.lines('data-medium-state-line')[0] && u.lines('data-medium-state-line')[0][1] === 'A and B together, as two — not yet looked into: nothing related between them yet' && !/nothing there/.test(u.text), J(u.lines('data-medium-state-line')));
reset(seeded4());
give('A', 'B', { F9: 'r1' }); give('A', 'C', { F9: 'Φ1' }); give('C', 'B', { Φ1: 'r1' });
S().applyAmboDissectionToCurrent();
const Gx = cur(); const ABx = midOf(Gx, byLabel(Gx, 'A'), byLabel(Gx, 'B'));
const x = renderAt(Gx, ABx.id);
check('§d CLOSED (a finding, never a goal): the one relating is the face\'s through C — `all the face\'s — nothing theirs alone, nothing only in a corner\'s light`; the own line reads `nothing theirs alone — all 1 relating is also said through C or D`', x.lines('data-medium-state-line')[0][1] === "all the face's — nothing theirs alone, nothing only in a corner's light" && x.lines('data-medium-own')[0][1] === 'nothing theirs alone — all 1 relating is also said through C or D' && x.attr('data-medium-closed') === 'true', J({ state: x.lines('data-medium-state-line'), own: x.lines('data-medium-own') }));
reset(seeded4());
give('A', 'B', { F9: 'r1', F7: 'r0' }); give('A', 'C', { F9: 'Φ1' }); give('C', 'B', { Φ1: 'r1' });
S().applyAmboDissectionToCurrent();
const Gc = cur(); const ABc = midOf(Gc, byLabel(Gc, 'A'), byLabel(Gc, 'B'));
const c = renderAt(Gc, ABc.id);
check('§d COHERENT: one theirs alone and one the face\'s, nothing against it — `nothing against it — no bar pressed, no say differs, the views agree on what is theirs alone`', c.lines('data-medium-state-line')[0][1] === 'nothing against it — no bar pressed, no say differs, the views agree on what is theirs alone' && c.attr('data-medium-coherent') === 'true', J(c.lines('data-medium-state-line')));
reset(seeded4());
give('A', 'B', { F9: 'r1', F7: 'r0' }); give('A', 'C', { F9: 'Φ1' }); give('C', 'B', { Φ1: 'r1' }); give('A', 'D', { F7: 'x' }); give('D', 'B', { x: 'r0' });
S().applyAmboDissectionToCurrent();
const Gp = cur(); const ABp = midOf(Gp, byLabel(Gp, 'A'), byLabel(Gp, 'B'));
const p = renderAt(Gp, ABp.id);
check('§d THE POCKET: through C, F7 ≡ r0 is theirs alone; through D, F9 ≡ r1 is — `the views leave different things alone — … — nothing is theirs alone under both`', /^the views leave different things alone — .* — nothing is theirs alone under both$/.test(p.lines('data-medium-state-line')[0][1]) && p.attr('data-medium-state') === 'POCKET', J(p.lines('data-medium-state-line')));

// ═══ §e the name kept with its state ═══
console.log('\n----- §e the name kept with the state it was given under (D11) -----');
reset(seeded4());
give('A', 'B', { F9: 'r1', F7: 'r0' });
S().applyAmboDissectionToCurrent();
const Gn = cur(); const ABn = midOf(Gn, byLabel(Gn, 'A'), byLabel(Gn, 'B'));
useGeometryStore.setState({ selectedVertexId: ABn.id });
S().updateSelectedVertexData({ label: 'Honesty' });
const named0 = namedUnderOf(cur(), ABn.id);
check('§e christening the midpoint records the state the name was given under — 2 relatings, both theirs alone (role keys, no id)', !!named0 && named0.relatings === 2 && named0.own.length === 2 && named0.own.every((k) => /^IS\|/.test(k)), J(named0));
give('A', 'C', { F9: 'Φ1' }); give('C', 'B', { Φ1: 'r1' }); give('A', 'B', { F13: 'r8' });
const n1 = renderAt(cur(), ABn.id);
check('§e the line reads `named when it was: Honesty — given when 2 relatings were said; since then, 1 left what is theirs alone · 1 entered` — the name kept, what moved listed, never renamed', n1.lines('data-medium-named-under')[0] && n1.lines('data-medium-named-under')[0][1] === 'named when it was: Honesty — given when 2 relatings were said; since then, 1 left what is theirs alone · 1 entered', J(n1.lines('data-medium-named-under')));
S().updateSelectedVertexData({ label: '' });
check('§e un-christened, the state is dropped with the mark', namedUnderOf(cur(), ABn.id) === null);

// ═══ §f the device's own lights at a deeper generation ═══
console.log('\n----- §f the device\'s own lights (D10) -----');
reset(seeded4());
give('A', 'B', { F7: 'r0' }); give('A', 'C', { F7: 'Φ1' });
S().applyAmboDissectionToCurrent();
S().selectCell(cur().cells.find((cc) => cc.kind === 'core').id);
S().applyAmboDissectionToCurrent();
const G2 = cur(); const AB2 = midOf(G2, byLabel(G2, 'A'), byLabel(G2, 'B')); const AC2 = midOf(G2, byLabel(G2, 'A'), byLabel(G2, 'C')); const ABAC = midOf(G2, AB2.id, AC2.id);
const d = renderAt(G2, ABAC.id);
check('§f at ABAC the derivable link reads as the device\'s own light: `only in A\'s light: F7≡r0 ~ Φ1≡F7 — the device can see it through A, nobody said it` (in the edge\'s own orientation), and the state is `not yet looked into`', d.lines('data-medium-light-derived').some(([k, s]) => k === 'shared-coordinate' && /^only in A's light: (F7≡r0 ~ Φ1≡F7|Φ1≡F7 ~ F7≡r0) — the device can see it through A, nobody said it$/.test(s)) && /not yet looked into/.test(d.lines('data-medium-state-line')[0][1]), J(d.lines('data-medium-light-derived')));

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
  const lights = [...v.block.matchAll(/data-medium-passage-reading="LIGHT"/g)].length;
  check('§g the customer\'s triads alone: two passages, both `only in … light — through … it would read: … — no relating between Value and Action says so` (Fact\'s and Meaning\'s), the state `not yet looked into`; no coinage printed', lights === 2 && /only in Fact's light — through Fact it would read: /.test(v.text) && /only in Meaning's light — through Meaning it would read: /.test(v.text) && /Value and Action together, as two — not yet looked into/.test(v.text) && !NEVER.test(v.text), J({ lights, state: v.lines('data-medium-state-line') }));
} else note('Virgin Land\'s fixture is not beside the inbox on this checkout — §g skipped');

// ═══ §h where every line sits ═══
console.log('\n----- §h where the lines sit -----');
const ms = readLf('src/components/MidpointSurface.tsx');
check('§h the block is rendered after the own column and the feet and before the trace — never above the drawing; the two-pick act reads the chosen mode and the bar (IS and no bar: the pairing, as before)', /<MediumBlock shape=\{shape\} edge=\{sourceEdge\}[^\n]*\n\s*\{\/\* THE TRACE/.test(ms) && /if \(mode === IS && !barNext\) giveRolePair\(edgeId, x, y\);\n\s*else giveRelating\(edgeId, mode, x, y, barNext \? '-' : '\+'\);/.test(ms) && /setMode\(IS\);\n\s*setBarNext\(false\);\n\s*\}, \[site\.siteId\]\);/.test(ms));
check('§h a light is never first in its block and never a control: the passage line leads with the passage, the reading follows; the says are the only buttons on a passage', /`\$\{passageWords\(p\)\} — \$\{readingWords\(p, lz\)\}`/.test(src) && !/<button[^>]*data-medium-light/.test(src));

console.log(`\n${failures === 0 ? 'DIAGNOSE-MODES1-THE-WORDS: ALL PASS — the medium reads in the designer\'s words under the own column: the counts, his modes and relatings, the passages where they sit, his says and rules, one line for the state, the name kept with its state, and the device\'s own lights; none of the researcher\'s coinages is printed' : `DIAGNOSE-MODES1-THE-WORDS: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
