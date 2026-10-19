#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// THE SAME UNDER HIS EQUATIONS — ONE PREDICATE FOR "THE SAME STATEMENT" (D13; VL 44 and 45: the mothership's 15:28 and 16:05)
//
// `sameStatement` and `statementKey` in relatings.ts are the one reader every comparison of two statements goes through: the loop's
// fill verdict (44, childLoops), the shape rule's count on the modes head (45, MediumBlock), beside the meets line and the sorting's
// `spellingsOf`. For the shape rule the direction is taken RELATIVE TO THE WALK — the shape's own start, where a rule's subject end is —
// so one rule's word applied along two passages reads one outcome whichever corner each starts from (the pair's direction split
// `carries` across two edges, measured in modes1-the-words §c), the converse read the other way round from the walk folds onto it, and
// a decision in the same word the other way round from the walk is another relation (M6 (1)). On Virgin Land's 15:54 export its three
// converse pairs were each typed in the prompt's order from OPPOSITE corners: one relation on the corners, two relations on the walk —
// the head keeps them apart and now tells twin words apart. THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the readers are RUN.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
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
const { ALONG, AGAINST, sameStatement, statementKey } = req('src/lib/relatings.ts');
const { verdictsOn } = req('src/lib/sorting.ts');
const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const { spaceOf } = req('src/lib/spaceOf.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const unesc = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8');

console.log('THE SAME UNDER HIS EQUATIONS — one predicate for the same statement (VL 44 and 45)\n');

// ═══ §1 THE PREDICATE ON ITS OWN CASES ═══
const facts = { converses: [['is drawn from', 'is divided as'], ['is at once', 'is at once']], opaque: [] };
check('§1 ★★ THE SAME WORD READ THE SAME WAY is the same; read the other way round it is another sentence (D13: a word running both ways on one edge is two sentences)',
  sameStatement(facts, 'is drawn from', ALONG, 'is drawn from', ALONG) && !sameStatement(facts, 'is drawn from', ALONG, 'is drawn from', AGAINST));
check('§1 ★★ THE DECLARED CONVERSE READ THE OTHER WAY ROUND is the same statement (his equation); read the same way it is not; two words no equation joins are not',
  sameStatement(facts, 'is drawn from', ALONG, 'is divided as', AGAINST) && sameStatement(facts, 'is divided as', AGAINST, 'is drawn from', ALONG) && !sameStatement(facts, 'is drawn from', ALONG, 'is divided as', ALONG) && !sameStatement(facts, 'is drawn from', ALONG, 'is received as', AGAINST));
check('§1 ★ BOTH WAYS: an undirected statement (null) is the same as either way of its word or its converse; a self-converse word reads both ways',
  sameStatement(facts, 'is drawn from', null, 'is drawn from', AGAINST) && sameStatement(facts, 'is divided as', null, 'is drawn from', ALONG) && sameStatement(facts, 'is at once', ALONG, 'is at once', AGAINST));
check('§1 ★★ THE KEY agrees with the predicate: equal keys exactly where `sameStatement` holds — the converse folded onto the alphabetically first word with its direction turned, the self-converse and the undirected `both`',
  statementKey(facts, 'is drawn from', ALONG) === statementKey(facts, 'is divided as', AGAINST) && statementKey(facts, 'is drawn from', ALONG) !== statementKey(facts, 'is divided as', ALONG) && statementKey(facts, 'is drawn from', ALONG) !== statementKey(facts, 'is drawn from', AGAINST) && statementKey(facts, 'is at once', ALONG) === statementKey(facts, 'is at once', AGAINST) && statementKey(facts, 'is divided as', null) === statementKey(facts, 'is drawn from', null) && statementKey(facts, 'is received as', ALONG) !== statementKey(facts, 'is drawn from', ALONG),
  { a: statementKey(facts, 'is drawn from', ALONG), b: statementKey(facts, 'is divided as', AGAINST), self: statementKey(facts, 'is at once', ALONG), both: statementKey(facts, 'is divided as', null) });

// ═══ §2 BY CONSTRUCTION — the readers read the one predicate; the shape rule reads the direction relative to the walk ═══
const cl = src('src/lib/childLoops.ts'); const mb = src('src/components/MediumBlock.tsx'); const rl = src('src/lib/relatings.ts');
check('§2 ★★ ONE READER: the loop records\' `same` and `sameAnswers` read `sameStatement`; the shape rule\'s outcomes are keyed by `statementKey` — for a path with the direction RELATIVE TO THE WALK (`relToWalk`), for a bond with its own; no letter-for-letter comparison of a decision\'s word is left in the shape rule; a twin word the other way round is told apart in the differ line',
  /sameSaying = \(w1: string, d1: Dir, w2: string, d2: Dir\): boolean => sameStatement\(facts, w1, d1, w2, d2\)/.test(cl) && /statementKey\(m\.facts, d, relToWalk\(p\)\)/.test(mb) && /const relToWalk = \(p: ReadPath\): Dir \| null => \(p\.undirected \|\| p\.compositeDir === null \? null : p\.compositeDir === walkDir\(p\) \? ALONG : AGAINST\);/.test(mb) && /statementKey\(m\.facts, d, rb\.compositeDir\)/.test(mb) && /add\(so, hereEdge, p\.path\.x, p\.path\.y, pathDecisionKey\(p\), pathDecision\(p\)\)/.test(mb) && !/add\(so, hereEdge, p\.path\.x, p\.path\.y, pathDecision\(p\)\)/.test(mb) && /the other way round` : w; }/.test(mb) && /export function sameStatement\(/.test(rl) && /export function statementKey\(/.test(rl));

// ═══ §3 VIRGIN LAND'S 15:54 EXPORT — Distribution–Consumption, every passage decided ═══
const S = () => useGeometryStore.getState();
const FIX = path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1554_Distribution-Consumption_13-relatings-2-bars_all-passages-decided.workspace.json');
S().importWorkspace(JSON.parse(fs.readFileSync(FIX, 'utf8')));
const shape = () => S().shapes[S().currentShapeId];
const byLabel = (l) => Object.keys(shape().vertices).find((v) => shape().vertices[v].data.label === l);
const Dist = byLabel('Distribution'); const Cons = byLabel('Consumption');
const siteDC = Object.values(shape().vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(Dist) && v.createdBy.sourceVertexIds.includes(Cons)).id;
const hisFacts = () => ({ converses: S().converses, opaque: S().opaque });
const renderHead = () => {
  useGeometryStore.setState({ modesView: null, modesDiffer: { siteId: siteDC, open: true, shapes: [] } });
  const sh = shape();
  const packet = buildGeneralSitePacketPresenterReport(sh).packets.find((p) => p.trace.siteId === siteDC);
  const site = midpointSiteOf(sh, siteDC, packet ? packet.trace : null);
  const html = renderToString(React.createElement(MidpointSurface, { shape: sh, site, parents: [spaceOf(sh, site.a), spaceOf(sh, site.b)], resolved: spaceOf(sh, siteDC), refusal: null, remade: null })).replace(/<!-- -->/g, '');
  const differ = html.match(/data-medium-differ-shapes="(\d+)"/);
  const shapes = [...html.matchAll(/data-medium-differ-shape="([^"]+)"[^>]*>([^<]*)</g)].map((m) => [unesc(m[1]), unesc(m[2]).trim()]);
  return { differ: differ ? Number(differ[1]) : 0, shapes };
};
const r0 = renderHead();
console.log(`\n----- §3 Virgin Land's 15:54 export at Distribution–Consumption — ${S().converses.length} converse pairs declared -----`);
check('§3 ★★ ITS THREE PAIRS ARE ONE STATEMENT ON THE CORNERS (his equation): `is given as ↔ is provided as`, `is consumed as ↔ is the consuming of`, `is met as ↔ is the meeting of`, each read the other way round, is the same statement about its two roles',
  [['is given as', 'is provided as'], ['is consumed as', 'is the consuming of'], ['is met as', 'is the meeting of']].every(([a, b]) => sameStatement(hisFacts(), a, ALONG, b, AGAINST) && !sameStatement(hisFacts(), a, ALONG, b, ALONG)));
check('§3 ★★ AND TWO RELATIONS ON THE WALK, so the head keeps them apart: each pair was typed in the prompt\'s order on passages walked from OPPOSITE corners, so relative to the shape\'s start the one says `the start … the end` and the other `the end … the start` — no single rule (one word, one subject end) covers both; the head reads `decisions differ in 3 shapes`, as 04f1c05 did, with both words shown',
  r0.differ === 3 && r0.shapes.length === 3 && r0.shapes.some(([, t]) => /is met as then is received as — is met as: 1 pair · is the meeting of: 1 pair/.test(t)), r0);
// the fold, in the walk's own terms: the passage decided `is the meeting of` re-decided (a) in `is met as` read from the walk's start, (b) in `is the meeting of` the other way round
const faceDC = (w3) => { for (const f of shape().faces) { if (!f.vertexIds.includes(Dist) || !f.vertexIds.includes(Cons)) continue; const rec = verdictsOn(f).find((v) => v.verdict === 'composed' && v.w3 === w3); if (rec) return { faceId: f.id, rec }; } return null; };
const meet = faceDC('is the meeting of'); const met = faceDC('is met as');
const walkOf = (rec) => (rec.dirs ? null : ALONG); // the records carry no `dirs` here (both legs along), so the path is walked x → y
const redoA = meet ? S().giveVerdict(meet.faceId, { ...meet.rec, w3: 'is met as', w3dir: met.rec.w3dir ?? ALONG }) : 'no passage decided in `is the meeting of`';
const r1 = renderHead();
check('§3 ★★ THE FOLD IN THE WALK\'S TERMS (a): the passage decided `is the meeting of` re-decided `is met as` read as the other was — one rule now covers both — and the head reads `decisions differ in 2 shapes`, that shape gone',
  redoA === null && r1.differ === 2 && !r1.shapes.some(([id]) => /is met as\|is received as/.test(id)), { redoA, head: r1, walk: walkOf(meet ? meet.rec : {}) });
const redoB = meet ? S().giveVerdict(meet.faceId, { ...meet.rec, w3: 'is the meeting of', w3dir: (met.rec.w3dir ?? ALONG) === ALONG ? AGAINST : ALONG }) : 'no passage';
const r2 = renderHead();
check('§3 ★★ THE FOLD IN THE WALK\'S TERMS (b): the same passage re-decided `is the meeting of` THE OTHER WAY ROUND — the converse read the other way round is the same statement, relative to the walk too — and the head still reads 2 shapes',
  redoB === null && r2.differ === 2 && !r2.shapes.some(([id]) => /is met as\|is received as/.test(id)), { redoB, head: r2 });
const redoC = meet ? S().giveVerdict(meet.faceId, { ...meet.rec, w3: 'is lived as', w3dir: met.rec.w3dir ?? ALONG }) : 'no passage';
const r3 = renderHead();
check('§3 ★★ A DIFFERENCE THAT STAYS: re-decided `is lived as` — a word no equation of his joins to `is met as` — the shape differs again (`is met as: 1 pair · is lived as: 1 pair`), 3 shapes',
  redoC === null && r3.differ === 3 && r3.shapes.some(([, t]) => /is met as then is received as — /.test(t) && /is met as: 1 pair/.test(t) && /is lived as: 1 pair/.test(t)), { redoC, head: r3 });

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-SAME-UNDER-HIS-EQUATIONS: ALL PASS — one predicate for the same statement, read by the loop\'s fill and the shape rule\'s count (relative to the walk); on Virgin Land\'s 15:54 export the converse pairs are one statement on the corners and two relations on the walk, and the head keeps them apart; the fold holds in the walk\'s own terms' : `DIAGNOSE-THE-SAME-UNDER-HIS-EQUATIONS: ${failures} FAIL`}`);
if (failures) process.exitCode = 1;
