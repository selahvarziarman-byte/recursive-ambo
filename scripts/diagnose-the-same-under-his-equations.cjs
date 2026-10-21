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

// ═══ §2 BY CONSTRUCTION — the readers read the one predicate; the shape rule reads the direction IN THE KEY'S FRAME (the designer's 11:40 (A); the mothership's 11:50 RULED) ═══
const cl = src('src/lib/childLoops.ts'); const mb = src('src/components/MediumBlock.tsx'); const rl = src('src/lib/relatings.ts'); const so = src('src/lib/sorting.ts');
check('§2 ★★ ONE READER: the loop records\' `same` and `sameAnswers` read `sameStatement`; the shape rule\'s outcomes are keyed by `statementKey` through `outcomeKeyOf` (sorting.ts) — for a path with the direction IN THE FRAME OF THE KEY by which it belongs to the shape (`p.compositeDir === key.dir ? ALONG : AGAINST`, the rule line\'s own exception predicate), for a bond with its own; the modes head reads it per matched key, the site\'s disagreement flag reads it over every key a passage carries and over the bonds (`disagreementsOf`); nothing relative to the walk\'s own start remains; a twin word the other way round is told apart in the differ line',
  /sameSaying = \(w1: string, d1: Dir, w2: string, d2: Dir\): boolean => sameStatement\(facts, w1, d1, w2, d2\)/.test(cl)
    && /export const outcomeKeyOf = \(facts: LexiconFacts, p: ReadPath, key: RuleKey\): string \| null => \{ const d = pathDecisionOf\(p\); return d === null \? null : d === 0 \? '' : statementKey\(facts, d, p\.undirected \|\| p\.compositeDir === null \? null : p\.compositeDir === key\.dir \? ALONG : AGAINST\); \};/.test(so)
    && /export const bondOutcomeKeyOf = \(facts: LexiconFacts, rb: ReadBond\): string \| null => \{ const d = bondDecisionOf\(rb\); return d === null \? null : d === 0 \? '' : statementKey\(facts, d, rb\.compositeDir\); \};/.test(so)
    && /for \(const p of v\.paths\) for \(const k of p\.path\.keys\) add\('f\|' \+ shapeIdOf\(k\), outcomeKeyOf\(facts, p, k\)\);/.test(so) && /const disagreements = disagreementsOf\(out, facts\);\n\s*const disagreement = disagreements\.length > 0;/.test(so)
    && /const kk = p\.path\.keys\.find\(\(k\) => 'f\|' \+ keyId\(k\) === id\); if \(kk\) add\(so, hereEdge, p\.path\.x, p\.path\.y, outcomeKeyOf\(m\.facts, p, kk\), pathDecision\(p\)\);/.test(mb) && /bondOutcomeKeyOf\(m\.facts, rb\), bondDecision\(rb\)/.test(mb)
    && !/relToWalk|walkDir\(|pathDecisionKey|bondDecisionKey/.test(mb) && /the other way round` : w; }/.test(mb) && /export function sameStatement\(/.test(rl) && /export function statementKey\(/.test(rl));

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
  useGeometryStore.setState({ modesView: null, modesDiffer: { siteId: siteDC, open: true, shapes: [] } }); // the head's words are the designer's 11:40 (C): `no single rule fits the decisions in N shapes · show`
  const sh = shape();
  const packet = buildGeneralSitePacketPresenterReport(sh).packets.find((p) => p.trace.siteId === siteDC);
  const site = midpointSiteOf(sh, siteDC, packet ? packet.trace : null);
  const html = renderToString(React.createElement(MidpointSurface, { shape: sh, site, parents: [spaceOf(sh, site.a), spaceOf(sh, site.b)], resolved: spaceOf(sh, siteDC), refusal: null, remade: null })).replace(/<!-- -->/g, '');
  const differ = html.match(/data-medium-differ-shapes="(\d+)"/);
  if (differ && !/no single rule fits the decisions in \d+ shapes? · /.test(unesc(html))) return { differ: -1, shapes: [], words: 'the head does not read `no single rule fits the decisions in N shapes · `' };
  const shapes = [...html.matchAll(/data-medium-differ-shape="([^"]+)"[^>]*>([^<]*)</g)].map((m) => [unesc(m[1]), unesc(m[2]).trim()]);
  return { differ: differ ? Number(differ[1]) : 0, shapes };
};
const r0 = renderHead();
console.log(`\n----- §3 Virgin Land's 15:54 export at Distribution–Consumption — ${S().converses.length} converse pairs declared -----`);
check('§3 ★★ ITS THREE PAIRS ARE ONE STATEMENT ON THE CORNERS (his equation): `is given as ↔ is provided as`, `is consumed as ↔ is the consuming of`, `is met as ↔ is the meeting of`, each read the other way round, is the same statement about its two roles',
  [['is given as', 'is provided as'], ['is consumed as', 'is the consuming of'], ['is met as', 'is the meeting of']].every(([a, b]) => sameStatement(hisFacts(), a, ALONG, b, AGAINST) && !sameStatement(hisFacts(), a, ALONG, b, ALONG)));
check('§3 ★★ HER THREE SHAPES DROP OUT (Virgin Land\'s 45 as the designer read it, 11:40 (A); the mothership\'s 11:50 RULED): each shape holds a chain walked from Consumption\'s end and a fork in Production\'s light joining it through his converse by the SAME key `…|chain|←`; read in that key\'s frame the two decisions are one statement (`the need is met as the share`), so no shape differs and the head prints nothing — where 04f1c05 and 6d95aba read `decisions differ in 3 shapes` (the MARKER 3 reading "two relations on the walk" falls for them, and claims §442 with it)',
  r0.differ === 0 && r0.shapes.length === 0, r0);
// the fold in the KEY's frame: the fork's passage re-decided in `is met as` — in one direction it reads as the chain's decision reads (one outcome, no shape), in the other it is the
// same word the other way round, another relation (M6 (1)); then in `is the meeting of` the other way round of the agreeing case — his converse, the same statement
const faceDC = (w3) => { for (const f of shape().faces) { if (!f.vertexIds.includes(Dist) || !f.vertexIds.includes(Cons)) continue; const rec = verdictsOn(f).find((v) => v.verdict === 'composed' && v.w3 === w3); if (rec) return { faceId: f.id, rec }; } return null; };
const meet = faceDC('is the meeting of');
const tryDir = (dir) => { const r = meet ? S().giveVerdict(meet.faceId, { ...meet.rec, w3: 'is met as', w3dir: dir }) : 'no passage decided in `is the meeting of`'; return { r, head: renderHead() }; };
const tA = tryDir(ALONG); const tB = tryDir(AGAINST);
const agreeing = tA.head.differ === 0 ? ALONG : tB.head.differ === 0 ? AGAINST : null;
const other = agreeing === ALONG ? tB : tA;
check('§3 ★★ THE FOLD IN THE KEY\'S FRAME (a): the fork\'s passage re-decided `is met as` — in exactly ONE direction it reads as the chain\'s decision reads in the key\'s frame (no shape differs); in the other it is `is met as` the other way round, another relation (M6 (1)): the shape differs, `is met as: 1 pair · is met as, the other way round: 1 pair`',
  tA.r === null && tB.r === null && agreeing !== null && other.head.differ === 1 && other.head.shapes.length === 1 && /is met as then is received as — is met as: 1 pair · is met as, the other way round: 1 pair/.test(other.head.shapes[0][1]), { along: tA.head, against: tB.head, agreeing });
const redoB = meet && agreeing !== null ? S().giveVerdict(meet.faceId, { ...meet.rec, w3: 'is the meeting of', w3dir: agreeing === ALONG ? AGAINST : ALONG }) : 'no agreeing direction';
const r2 = renderHead();
check('§3 ★★ THE FOLD IN THE KEY\'S FRAME (b): the same passage re-decided `is the meeting of` THE OTHER WAY ROUND of the agreeing case — his converse read the other way round is the same statement in the key\'s frame too — no shape differs',
  redoB === null && r2.differ === 0, { redoB, head: r2 });
const redoC = meet && agreeing !== null ? S().giveVerdict(meet.faceId, { ...meet.rec, w3: 'is lived as', w3dir: agreeing }) : 'no passage';
const r3 = renderHead();
check('§3 ★★ A DIFFERENCE THAT STAYS: re-decided `is lived as` — a word no equation of his joins to `is met as` — the shape differs (`is lived as: 1 pair · is met as: 1 pair`), 1 shape, under the head\'s words `no single rule fits the decisions in 1 shape`',
  redoC === null && r3.differ === 1 && r3.shapes.some(([, t]) => /is met as then is received as — /.test(t) && /is met as: 1 pair/.test(t) && /is lived as: 1 pair/.test(t)), { redoC, head: r3 });

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-SAME-UNDER-HIS-EQUATIONS: ALL PASS — one predicate for the same statement, read by the loop\'s fill and the shape rule\'s count in the key\'s frame (the rule line\'s own); on Virgin Land\'s 15:54 export the converse pairs are one statement and her three shapes drop out of the head; the fold holds in the key\'s frame' : `DIAGNOSE-THE-SAME-UNDER-HIS-EQUATIONS: ${failures} FAIL`}`);
if (failures) process.exitCode = 1;
