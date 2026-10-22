#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// THE ONE IS PREDICATE FOR EDGE AND SEAM — GROUP 4 · slice 2 (ADR 0031 §9.76 (4), the researcher's 11:27, ratified — claims §512; §9.75 and its ADDENDUM of 13:58, claims
// §507 and §521; the designer's 14:05 sentence; Arman's Δ239 "no matter the price" and Δ242 "the coder's order as given"). The checks an IS pair of two moments must
// pass live once (src/lib/isPredicate.ts) and are read by the Ambo's medial-edge act and the Manuscript's seam act alike: D15 (the shared coordinate) and THE MARKS
// (a pulled-back mark is a value AT the moment; one moment cannot carry two values of one word — the shared parent's words read at the parent's coordinate of each
// end, one cast one key; UNKNOWN and an omission no value), in the designer's sentence; at the seam the stone by composition through every seam beside.
// THE ACCEPTANCE (the researcher's 13:58, reproduced from the substrate at the coder's hand before the build): on Virgin Land's 19:54 record dissected again, at
// Accumulation–Class, 204 pairs = 31 refused by D15 + 117 refused by Production's two marks (52 on `used up in the making` alone · 36 on `lasts beyond the act` alone ·
// 29 on both — by the SET of conflicting marks per pair) + 56 taken; `(IS, the variable capital, the keep)` REFUSED on both words; `(IS, the credit sale, the largesse)`
// TAKEN; `(IS, the wage fund, the keep)` by D15. At the seam of his torus (the Δ238 case): what the Ambo refuses the seam refuses, in the same words.
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
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const I = req('src/manuscript/identificationImageModel.ts');
const D = req('src/manuscript/doorTransportModel.ts');
const PO = req('src/manuscript/writtenFormModel.ts');
const P = req('src/lib/isPredicate.ts');
const { columnSpaceOf, termWordsOf, instancesFrom } = req('src/lib/instanceSpace.ts');
const { spaceOf, nameIn, edgeKind } = req('src/lib/spaceOf.ts');
const { transportStepOf, transportSpaceOf } = req('src/lib/transport.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { MidpointSurface, midpointViewOf } = req('src/components/MidpointSurface.tsx');
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
const unesc = (t) => t.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const text = (html) => unesc(html.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
console.log('THE ONE IS PREDICATE FOR EDGE AND SEAM — §9.76 (4) on the 19:54 record at Accumulation–Class (204 = 31 + 117 + 56, her sentence) and at the seams of his torus\n');
const S = () => useGeometryStore.getState();
const FIXTURE = 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json';
S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, FIXTURE), 'utf8')));
const sh0 = S().shapes[S().currentShapeId];
S().selectCell(sh0.cells.find((c) => /core/.test(c.id)).id);
S().applyAmboDissectionToCurrent();
const sh = () => S().shapes[S().currentShapeId];
const lab = (v) => sh().vertices[v]?.data.label || v;
const byLabel = (l) => Object.values(sh().vertices).find((v) => v.data.label === l);
const A = byLabel('Accumulation'); const B = byLabel('Class'); const Pr = byLabel('Production'); const Fi = byLabel('Finance'); const Di = byLabel('Distribution');
const e = edgeBetween(sh().edges, A.id, B.id);
const first = e.vertexIds[0] === A.id;
const records = childRecordsOf(S());
const nm = (c, id) => termWordsOf(sh(), c, id, { records });
const cA = columnSpaceOf(sh(), A.id); const cB = columnSpaceOf(sh(), B.id);
const byName = (col, c, name) => col.roles.map((r) => r.id).find((id) => nm(c, id) === name);
const vc = byName(cA, A.id, 'the variable capital'); const wf = byName(cA, A.id, 'the wage fund'); const fc = byName(cA, A.id, 'the fixed capital'); const cs = byName(cA, A.id, 'the credit sale');
const keep = byName(cB, B.id, 'the keep'); const lg = byName(cB, B.id, 'the largesse');
const Pspace = spaceOf(sh(), Pr.id).space;
const coordA = (x) => instancesFrom(sh(), Pr.id, Fi.id).find((k) => k.key === x); const coordB = (y) => instancesFrom(sh(), Pr.id, Di.id).find((k) => k.key === y);
check('§0 THE RECORD: the 19:54 record dissected again; Accumulation (Finance–Production\'s child) and Class (Production–Distribution\'s child) share Production, whose nine roles carry two caster words as marks (`lasts beyond the act`, `used up in the making`; values yes · no · UNKNOWN); the columns hold 17 and 12 moments; his names found',
  !!A && !!B && !!Pr && !!e && cA.roles.length === 17 && cB.roles.length === 12 && !!vc && !!wf && !!fc && !!cs && !!keep && !!lg && Pspace.roles.length === 9
    && Pspace.roles.every((r) => Object.keys(r.types ?? {}).sort().join('|') === 'lasts beyond the act|used up in the making'),
  { columns: [cA.roles.length, cB.roles.length], marks: Pspace.roles.map((r) => `${nameIn(Pspace, r.id)}: ${J(r.types)}`).slice(0, 3) });

// ═══ §1 THE CENSUS THROUGH THE STORE: 204 = 31 D15 + 117 marks + 56 taken ═══
const act = (x, y) => { if (first) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); const ref = S().midpointRefusals[e.id] || null; const rec = sh().edges.find((z) => z.id === e.id).identification; const taken = !ref && !!rec && rec.roles.some(([a, b]) => (first ? a === x && b === y : a === y && b === x)); return { taken, ref }; };
const undo = (x, y) => { if (first) S().withdrawRolePair(e.id, x, y); else S().withdrawRolePair(e.id, y, x); useGeometryStore.setState({ midpointRefusals: {} }); };
const clear = () => useGeometryStore.setState({ midpointRefusals: {} });
// THE INDEPENDENT READING of the marks (the probe's, not the module's): Production's roles' types at the two coordinates, two values of one word
const marksByHand = (x, y) => { const iu = coordA(x); const iv = coordB(y); if (!iu || !iv || iu.p === iv.p) return null; const tx = Pspace.roles.find((r) => r.id === iu.p).types || {}; const ty = Pspace.roles.find((r) => r.id === iv.p).types || {}; const ws = []; for (const k of Object.keys(tx)) { const a = tx[k]; const b = ty[k]; if (a === undefined || b === undefined || a === 'UNKNOWN' || b === 'UNKNOWN') continue; if (a !== b) ws.push(k); } return ws.sort(); };
const quoted = (form) => [...(form || '').matchAll(/“([^”]+)”/g)].map((m) => m[1]).sort();
const MARKS_RE = /^(.+) and (.+) can't be one moment: Production's “(lasts beyond the act|used up in the making)” is (yes|no) at (the [a-z ]+) \((.+)'s\) and (yes|no) at (the [a-z ]+) \((.+)'s\)(?:, and its “(lasts beyond the act|used up in the making)” is (yes|no) at (the [a-z ]+) and (yes|no) at (the [a-z ]+))?$/;
const census = { n: 0, d15: 0, marks: 0, taken: 0, other: 0, bySet: {}, perWord: {}, byHandAgree: 0, grammar: 0, withOpen: 0, withSolid: 0, orderCastFirst: 0, otherForms: {} };
for (const ra of cA.roles) for (const rb of cB.roles) {
  census.n += 1; const r = act(ra.id, rb.id);
  if (r.taken) { census.taken += 1; undo(ra.id, rb.id); continue; }
  const ref = r.ref;
  if (ref && ref.solid) { census.d15 += 1; clear(); continue; }
  const words = quoted(ref && ref.form);
  if (ref && ref.form && MARKS_RE.test(ref.form)) {
    census.marks += 1; census.grammar += 1;
    const key = words.join(' + '); census.bySet[key] = (census.bySet[key] || 0) + 1;
    for (const w of words) census.perWord[w] = (census.perWord[w] || 0) + 1;
    if (J(words) === J(marksByHand(ra.id, rb.id))) census.byHandAgree += 1;
    if (ref.solid) census.withSolid += 1;
    const m = MARKS_RE.exec(ref.form);
    if (m[1] === nm(A.id, ra.id) && m[2] === nm(B.id, rb.id) && m[6] === m[1] && m[9] === m[2] && (!m[10] || m[3] === 'lasts beyond the act')) census.orderCastFirst += 1;
  } else { census.other += 1; const f = (ref && (ref.form || (ref.conflicts && ref.conflicts.length ? 'conflicts' : ref.dependency ? 'dependency' : '?'))) || 'nothing happened'; census.otherForms[f.slice(0, 90)] = (census.otherForms[f.slice(0, 90)] || 0) + 1; }
  clear();
}
note(`the census: ${J(census)}`);
check('§1 ★★★ THE CENSUS THROUGH THE STORE (the researcher\'s 13:58, the acceptance): 204 pairs — 31 refused by D15 (the shared Production coordinate, with its data), 117 refused by THE MARKS in the designer\'s sentence (by the SET of conflicting words: 52 on `used up in the making` alone · 36 on `lasts beyond the act` alone · 29 on both; per word 81 · 65), 56 TAKEN (each withdrawn again), nothing else; every marks refusal names exactly the words the cast\'s roles disagree on at the two coordinates (the independent reading, 117 of 117), carries no `solid` and no `open`, names the two moments by his names and their coordinates by the cast\'s, and says the words in the cast\'s own order (`lasts beyond the act` first where both)',
  census.n === 204 && census.d15 === 31 && census.marks === 117 && census.taken === 56 && census.other === 0 && census.grammar === 117 && census.byHandAgree === 117 && census.withSolid === 0 && census.orderCastFirst === 117
    && census.bySet['used up in the making'] === 52 && census.bySet['lasts beyond the act'] === 36 && census.bySet['lasts beyond the act + used up in the making'] === 29 && census.perWord['used up in the making'] === 81 && census.perWord['lasts beyond the act'] === 65,
  census);

// ═══ §2 THE FALSIFIER'S PAIRS ═══
const SENTENCE = 'the variable capital and the keep can\'t be one moment: Production\'s “lasts beyond the act” is yes at the capacity (the variable capital\'s) and no at the reproduction (the keep\'s), and its “used up in the making” is yes at the capacity and no at the reproduction';
const r1 = act(vc, keep); const f1 = r1.ref && r1.ref.form; clear();
const r2 = act(cs, lg); const rec2 = sh().edges.find((z) => z.id === e.id).identification; if (r2.taken) undo(cs, lg); clear();
const r3 = act(wf, keep); const s3 = r3.ref && r3.ref.solid; clear();
check('§2 ★★★ THE FALSIFIER (the researcher\'s 13:58): `(IS, the variable capital, the keep)` REFUSED — yes and yes at the capacity, no and no at the reproduction — in the designer\'s 14:05 sentence verbatim, two words (`, and its “…” is … at … and … at …`), nothing standing; `(IS, the credit sale, the largesse)` TAKEN — the product and the surplus carry yes and no alike — one pair in the record, withdrawn again; `(IS, the wage fund, the keep)` refused by D15 first — both hold the reproduction, the passage sentence with its data (a shared coordinate carries one set of marks, so no mark can conflict there: D15 is first by construction)',
  !r1.taken && f1 === SENTENCE && !(r1.ref && r1.ref.solid) && r2.taken && !!rec2 && rec2.roles.length === 1 && !r3.taken && !!s3 && s3.role === 'the reproduction' && /^both hold the reproduction, so together they are the passage/.test(r3.ref.form),
  { r1: f1, r2: { taken: r2.taken, roles: rec2 && rec2.roles.length }, r3: r3.ref && r3.ref.form });
// UNKNOWN is no value: a pair whose coordinates differ only where one side is UNKNOWN (the purpose's `lasts beyond the act`) is TAKEN
const unknownPair = (() => { for (const ra of cA.roles) for (const rb of cB.roles) { const iu = coordA(ra.id); const iv = coordB(rb.id); if (!iu || !iv || iu.p === iv.p) continue; const tx = Pspace.roles.find((r) => r.id === iu.p).types || {}; const ty = Pspace.roles.find((r) => r.id === iv.p).types || {}; const unknownSomewhere = Object.keys(tx).some((k) => (tx[k] === 'UNKNOWN') !== (ty[k] === 'UNKNOWN')); const conflictElsewhere = Object.keys(tx).some((k) => tx[k] !== 'UNKNOWN' && ty[k] !== 'UNKNOWN' && tx[k] !== ty[k]); if (unknownSomewhere && !conflictElsewhere) return { x: ra.id, y: rb.id, at: [nameIn(Pspace, iu.p), nameIn(Pspace, iv.p)], tx, ty }; } return null; })();
if (unknownPair) { const ru = act(unknownPair.x, unknownPair.y); if (ru.taken) undo(unknownPair.x, unknownPair.y); clear();
  check('§2 ★★ UNKNOWN IS NO VALUE (the ADDENDUM): a pair whose coordinates disagree only where one side is UNKNOWN, agreeing on every word both value, is TAKEN', ru.taken, { pair: [nm(A.id, unknownPair.x), nm(B.id, unknownPair.y)], at: unknownPair.at, tx: unknownPair.tx, ty: unknownPair.ty }); }
else note('§2 no pair on this record differs only by an UNKNOWN — the clause stands by construction (valueAt), unexercised here');

// ═══ §3 THE SURFACE: the refusal as the person reads it — her sentence, `clear`, no `open` ═══
{
  const r = act(vc, keep); const refusal = r.ref;
  const mid = Object.values(sh().vertices).find((v) => v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(A.id) && v.createdBy.sourceVertexIds.includes(B.id));
  const view = midpointViewOf(sh(), mid.id);
  const html = view ? unesc(renderToString(React.createElement(MidpointSurface, { shape: sh(), site: view.site, resolved: view.resolved, refusal, remade: null })).replace(/<!-- -->/g, '')) : '';
  const box = (html.match(/<div data-midpoint-refusal="[^"]*"[\s\S]*?<\/div>/) || [''])[0];
  const t = text(box);
  check('§3 ★★ ON THE SURFACE (the designer\'s 14:05): the pairing tab\'s box reads `not taken — ' + SENTENCE.slice(0, 60) + '…` — where D15\'s passage sentence stands — with ONE hand, `clear` (the attempt withdrawn), and NO `open` (nothing elsewhere settles it: the marks are the parent\'s)',
    view !== null && box !== '' && t.includes(`not taken — ${SENTENCE}`) && (box.match(/data-midpoint-withdraw-attempt/g) || []).length === 1 && t.includes('clear') && !/data-midpoint-open-site/.test(box),
    { box: t.slice(0, 200) });
  clear();
}

// ═══ §4 THE ONE-TO-ONE STANDS BEHIND THE MARKS: with `the credit sale ≡ the largesse` standing, a second partner for the credit sale that AGREES on the marks is refused by the one-to-one law ═══
{
  const r = act(cs, lg);
  const agree = cB.roles.map((rb) => rb.id).find((y) => y !== lg && coordB(y) && coordA(cs) && coordB(y).p !== coordA(cs).p && (marksByHand(cs, y) || []).length === 0);
  const r2b = agree ? act(cs, agree) : null; clear();
  check('§4 ★★ THE ONE-TO-ONE LAW stands where the marks pass: with `the credit sale ≡ the largesse` standing, `the credit sale ≡ <a moment agreeing on both marks>` is refused `… is already paired with the largesse, and a role takes one partner` (the marks never reach a pair the record already refuses by its form? no — the marks come first, and this pair passes them)',
    r.taken && !!agree && !!r2b && !r2b.taken && r2b.ref && r2b.ref.form === 'the credit sale is already paired with the largesse, and a role takes one partner' && !!r2b.ref.prior,
    { agree: agree && nm(B.id, agree), form: r2b && r2b.ref && r2b.ref.form });
  undo(cs, lg); clear();
}
check('§4 ★ the control: the record holds nothing on this edge again', (sh().edges.find((z) => z.id === e.id).identification?.roles ?? []).length === 0);

// ═══ §5 THE SEAM — his torus (the Δ238 case): the square lifted alone after relatings around Class, glued into a torus; the seam refuses what the Ambo refuses, in the same words ═══
// the four gen-1 medial edges around Class hold a pair and a relating each (probe-two-acts' acts), so the square's corners hold moments
S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, FIXTURE), 'utf8')));
const G1 = sh();
const V = Object.keys(G1.vertices).find((v) => G1.vertices[v].data.label === 'Class');
const around = G1.edges.filter((z) => z.vertexIds.includes(V) && G1.vertices[z.vertexIds.find((x) => x !== V)].createdBy.operation !== 'seed');
{ const recs = childRecordsOf(S());
  for (const z of around) {
    const [a, b] = z.vertexIds; const ca = columnSpaceOf(G1, a, { records: recs }); const cb = columnSpaceOf(G1, b, { records: recs });
    if (!ca || !cb) continue;
    let taken = null;
    for (const ra of ca.roles) { for (const rb of cb.roles) { S().giveRolePair(z.id, ra.id, rb.id); if (!S().midpointRefusals[z.id]) { taken = [ra.id, rb.id]; break; } useGeometryStore.setState({ midpointRefusals: {} }); } if (taken) break; }
    if (taken) for (const ra of ca.roles) { let done = false; for (const rb of cb.roles) { if (ra.id === taken[0] || rb.id === taken[1]) continue; if (S().giveRelating(z.id, 'is honoured as', ra.id, rb.id, '+') === null) { done = true; break; } } if (done) break; }
  } }
S().selectCell(sh().cells.find((c) => c.kind === 'core').id); S().applyAmboDissectionToCurrent();
const G2 = sh();
const corners = around.map((z) => Object.values(G2.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && z.vertexIds.every((x) => v.createdBy.sourceVertexIds.includes(x))));
const sq = G2.faces.find((f) => f.vertexIds.length === 4 && corners.every((v) => v && f.vertexIds.includes(v.id)));
S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection(); S().toggleLiftSelection({ kind: 'face', id: sq.id });
const before = useLiftStore.getState().queue.length; S().liftSelectionToManuscript();
const entry = loadUniverseSnapshot(useLiftStore.getState().queue[before].file);
const form = placeShelfEntry(entry, 0);
const record = entry.loaded.ancestors.find((a) => sq.vertexIds.every((v) => a.vertices[v])) ?? entry.loaded.ancestors[0];
const t1 = PO.applyPlaygroundOperationTo('glue-torus', form.shape, null, 1, 8, undefined, null);
const torus = t1.ok ? t1.born : null;
const img = torus ? I.identificationImageOf({ shape: torus.shape, opId: 'glue-torus', provenance: 'Glue → Torus (abAB)', parentShape: form.shape }, record, []) : null;
const Rl = { options: {}, names: (c, id) => termWordsOf(record, c, id, {}).replace(/^\((.*)\)$/, '$1') };
check('§5 ★ THE SETUP: the square around Class lifted alone (its corners the four gen-2 midpoints holding moments), the torus borne by the page\'s own path, the image identified with two seams', !!sq && !!torus && !!img && img.state === 'identified' && img.seams.length === 2 && img.corners.length === 1, { seams: img && img.seams.length, corners: img && img.corners.length });
// every pair at every seam corner, read by the predicate and by the seam act
const seamCensus = []; let firstD15 = null; let firstMarks = null; let firstLawful = null;
for (let si = 0; si < img.seams.length; si += 1) {
  const sides = I.seamSidesOf(record, img.seams[si]);
  if ('missing' in sides) { seamCensus.push({ seam: si, missing: sides.missing }); continue; }
  for (let slot = 0; slot < sides.A.corners.length; slot += 1) {
    const U = sides.A.corners[slot]; const Vv = sides.B.corners[slot];
    const c = { seam: si, slot, corners: [lab(U), lab(Vv)], d15: 0, marks: 0, lawful: 0, agree: 0, n: 0 };
    for (const x of sides.A.spaces[slot].roles) for (const y of sides.B.spaces[slot].roles) {
      c.n += 1;
      const v = P.isPairRefusalAt(record, U, Vv, x.id, y.id, Rl);
      const a = I.seamActAt(record, img.seams[si], [], slot, x.id, y.id);
      const kind = v ? v.kind : null;
      if (kind === 'solid') c.d15 += 1; else if (kind === 'marks') c.marks += 1; else c.lawful += 1;
      // the seam act agrees with the predicate: a predicate refusal is the act's `pair` refusal with the same words; a pass is never refused as `pair` by the predicate's kinds
      const asPair = !a.taken && a.refusal && a.refusal.kind === 'pair';
      if ((v && asPair && a.refusal.by === v.kind && a.refusal.words === v.form) || (!v && !(asPair && a.refusal.by !== 'stone'))) c.agree += 1;
      if (v && v.kind === 'solid' && !firstD15) firstD15 = { seam: si, slot, x: x.id, y: y.id, words: v.form, act: a };
      if (v && v.kind === 'marks' && !firstMarks) firstMarks = { seam: si, slot, x: x.id, y: y.id, words: v.form, act: a };
      if (!v && a.taken && !firstLawful) firstLawful = { seam: si, slot, x: x.id, y: y.id, act: a };
    }
    seamCensus.push(c);
  }
}
note(`the seams: ${J(seamCensus)}`);
note(`a D15 pair at the seam: ${firstD15 ? J({ ...firstD15, act: firstD15.act.taken ? 'TAKEN' : firstD15.act.refusal }) : 'none'}`);
note(`a marks pair at the seam: ${firstMarks ? J({ ...firstMarks, act: firstMarks.act.taken ? 'TAKEN' : firstMarks.act.refusal }) : 'none'}`);
note(`a lawful pair taken at the seam: ${firstLawful ? J({ seam: firstLawful.seam, slot: firstLawful.slot, x: firstLawful.x, y: firstLawful.y, transports: firstLawful.act.transports.map((t) => [t.corners.map(lab), t.roles]) }) : 'none'}`);
const sidesFor = (si) => I.seamSidesOf(record, img.seams[si]);
const wordsOf = (si, a) => { const s = sidesFor(si); return D.refusalWords(s.A, s.B, a.refusal, (v) => record.vertices[v]?.data.label?.trim() || v); };
check('§5 ★★★ THE SEAM READS AS THE AMBO READS (§9.76 (4)): at every corner pair of both seams, every pair the predicate refuses — D15 or the marks — the seam act refuses as `pair` with the SAME words, and every pair it passes is never refused by those kinds; a D15 pair exists and is refused in D15\'s own sentence through the door\'s words — two IS ends the pairing one generation down (`not taken — both hold …, so this means pairing … with …, which you do on …`; measured: Accumulation–Livelihood), a mode end the passage; a marks pair exists and is refused in the designer\'s sentence (`… can\'t be one moment: <parent>\'s “…” is … at … (…\'s) and … at … (…\'s)`); a lawful pair is TAKEN with its line',
  seamCensus.every((c) => !c.missing && c.agree === c.n) && seamCensus.some((c) => c.d15 > 0) && seamCensus.some((c) => c.marks > 0) && !!firstD15 && !firstD15.act.taken && firstD15.act.refusal.kind === 'pair' && firstD15.act.refusal.by === 'solid' && /^not taken — (both hold .+, so (this means pairing .+ with .+, which you do on .+|together they are the passage from .+ to .+ through .+)|these are already one: both hold .+)$/.test(wordsOf(firstD15.seam, firstD15.act))
    && !!firstMarks && !firstMarks.act.taken && firstMarks.act.refusal.by === 'marks' && /^not taken — .+ and .+ can't be one moment: .+'s “.+” is .+ at .+ \(.+'s\) and .+ at .+ \(.+'s\)/.test(wordsOf(firstMarks.seam, firstMarks.act)) && !!firstLawful,
  { census: seamCensus, d15: firstD15 && wordsOf(firstD15.seam, firstD15.act), marks: firstMarks && wordsOf(firstMarks.seam, firstMarks.act) });

// ═══ §6 THE STONE BY COMPOSITION THROUGH SEAMS (§9.76 (4), the torus's two doors): a pair on the other door that would make two moments of one corner one, through the record's IS steps and the pairs standing on both doors ═══
{
  // an independent reader of the composition: a BFS over the explicit graph — the record's IS steps on seed and medial edges, and the standing pairs of both doors with the candidate's
  const graphOf = (pairs) => { const adj = new Map(); const add = (a, b) => { if (!adj.has(a)) adj.set(a, []); if (!adj.has(b)) adj.set(b, []); adj.get(a).push(b); adj.get(b).push(a); };
    for (const z of record.edges) { const [a, b] = z.vertexIds; if (edgeKind(record, a, b) === 'corner') continue; const step = transportStepOf(record, a, b, {}); if (!step) continue; for (const [x, y] of step) add(`${a}|${x}`, `${b}|${y}`); }
    for (const p of pairs) for (const [x, y] of p.roles) add(`${p.corners[0]}|${x}`, `${p.corners[1]}|${y}`);
    return adj; };
  const pathBetween = (adj, from, to) => { const prev = new Map([[from, null]]); const q = [from]; while (q.length) { const n = q.shift(); if (n === to) break; for (const m of adj.get(n) || []) if (!prev.has(m)) { prev.set(m, n); q.push(m); } } if (!prev.has(to)) return null; const out = []; for (let n = to; n !== null; n = prev.get(n)) out.unshift(n); return out; };
  let found = null; let tried = 0;
  if (firstLawful) {
    const standing0 = firstLawful.act.transports; // door firstLawful.seam's pairs stand
    const other = 1 - firstLawful.seam;
    const sides = sidesFor(other);
    outer: for (let slot = 0; slot < sides.A.corners.length; slot += 1) for (const x of sides.A.spaces[slot].roles) for (const y of sides.B.spaces[slot].roles) {
      tried += 1;
      const a = I.seamActAt(record, img.seams[other], standing0, slot, x.id, y.id);
      if (!a.taken && a.refusal.kind === 'pair' && a.refusal.by === 'stone') {
        const alone = I.seamActAt(record, img.seams[other], [], slot, x.id, y.id); // the control: the same pair with nothing standing on the first door
        // the stone's two moments by hand: the corner named and a path between them through the explicit graph with both doors' pairs
        const st = P.compositionStoneOf(record, standing0, [...standing0, ...(alone.taken ? alone.transports : [])], Rl);
        const adj = graphOf([...standing0, ...(alone.taken ? alone.transports : [])]);
        const pathH = st ? pathBetween(adj, `${st.corner}|${st.roles[0]}`, `${st.corner}|${st.roles[1]}`) : null;
        found = { slot, x: x.id, y: y.id, words: wordsOf(other, a), alone: alone.taken ? 'TAKEN alone' : alone.refusal, stone: st && { corner: lab(st.corner), roles: st.words }, path: pathH && pathH.map((n) => { const [c, r] = n.split('|'); return `${lab(c)}: ${Rl.names(c, r)}`; }) };
        break outer;
      }
    }
  }
  note(`the stone by composition: ${found ? J(found) : `none among ${tried} pairs on the other door with the first door's line standing`}`);
  if (found) check('§6 ★★★ THE STONE BY COMPOSITION THROUGH THE TORUS\'S TWO DOORS (§9.76 (4)): with a line standing on one door, a pair on the other door is refused `this pair would make … and … one, and they are two moments of <corner>` — TAKEN alone (the control: the stone is this act\'s, with the other door\'s line standing), the two moments distinct and joined by a path through the record\'s IS steps and both doors\' pairs (an independent BFS over the explicit graph)',
    !!found.stone && found.alone === 'TAKEN alone' && /^not taken — this pair would make .+ and .+ one, and they are two moments of .+$/.test(found.words) && Array.isArray(found.path) && found.path.length >= 2 && found.stone.roles[0] !== found.stone.roles[1],
    found);
  else check('§6 ★ THE STONE BY COMPOSITION, unexercised through the seam act on this record: no pair on the other door closes on two moments of one corner with the first door\'s line standing — the square\'s corners hold 2 · 0 · 2 · 2 moments and the record\'s IS steps are few (the vacuous control, said; the mechanism\'s positive control is §6b)', true, { tried });
  // §6b THE POSITIVE CONTROL of the mechanism (LAW 24): two hand-made pairings of the record's corners — X.m1 ↔ Y.n1 standing, then Y.n1 ↔ X.m2 — compose to X.m1 ~ X.m2, two moments of X: the stone, named; neither alone is one
  // the lifted form's corners by the addresses the lift keeps (`snapshot:…` before the universe's id — the record holds those; the Ambo shape's bare ids it does not)
  const holders = Object.keys(form.shape.vertices).map((v) => { const t = transportSpaceOf(record, v); return { v, roles: t ? t.space.roles.map((r) => r.id) : [] }; }).filter((h) => h.roles.length >= 2);
  const X = holders[0]; const Y = holders.find((h) => h.v !== X.v);
  if (X && Y) {
    const pairA = { corners: [X.v, Y.v], roles: [[X.roles[0], Y.roles[0]]] };
    const pairB = { corners: [Y.v, X.v], roles: [[Y.roles[0], X.roles[1]]] };
    const stA = P.compositionStoneOf(record, [], [pairA], Rl);
    const stAB = P.compositionStoneOf(record, [pairA], [pairA, pairB], Rl);
    const stBA = P.compositionStoneOf(record, [pairB], [pairA, pairB], Rl);
    const adj = graphOf([pairA, pairB]);
    const pathH = stAB ? pathBetween(adj, `${stAB.corner}|${stAB.roles[0]}`, `${stAB.corner}|${stAB.roles[1]}`) : null;
    check('§6b ★★ THE POSITIVE CONTROL of the stone by composition: on the lifted record, X.m1 ↔ Y.n1 alone makes no stone; with it standing, Y.n1 ↔ X.m2 makes X.m1 and X.m2 one — the stone at X naming the two moments, `this pair would make … and … one, and they are two moments of X` — and the same the other way round (whichever pair came second); an independent BFS finds the path X.m1 → Y.n1 → X.m2 through the explicit graph',
      stA === null && !!stAB && stAB.corner === X.v && J([...stAB.roles].sort()) === J([X.roles[0], X.roles[1]].sort()) && !!stBA && stBA.corner === X.v && /^this pair would make .+ and .+ one, and they are two moments of .+$/.test(P.compositionStoneWords(record, stAB)) && Array.isArray(pathH) && pathH.length === 3 && pathH[1] === `${Y.v}|${Y.roles[0]}`,
      { X: lab(X.v), Y: lab(Y.v), words: stAB && P.compositionStoneWords(record, stAB), path: pathH && pathH.map((n) => { const [c, r] = n.split('|'); return `${lab(c)}: ${Rl.names(c, r)}`; }) });
  } else check('§6b the positive control needs two corners holding two moments each on the record', false, { holders: holders.map((h) => [lab(h.v), h.roles.length]) });
}

// ═══ §7 BY CONSTRUCTION ═══
const store = src('src/store/geometryStore.ts'); const door = src('src/manuscript/doorTransportModel.ts'); const imageM = src('src/manuscript/identificationImageModel.ts'); const mod = src('src/lib/isPredicate.ts'); const surface = src('src/components/MidpointSurface.tsx'); const view = src('src/manuscript/ManuscriptView.tsx'); const manifest = src('docs/governance/ENGINE_FREEZE_MANIFEST.txt');
const sentenceSites = ['src/lib', 'src/store', 'src/manuscript', 'src/components'].flatMap((d) => { const out = []; const walk = (dir) => { for (const f of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, f.name); if (f.isDirectory()) walk(p); else if (/\.tsx?$/.test(f.name) && /can't be one moment|so together they are the passage/.test(fs.readFileSync(p, 'utf8'))) out.push(path.relative(repoRoot, p).split(path.sep).join('/')); } }; walk(path.join(repoRoot, d)); return out; });
check('§7 ★★ BY CONSTRUCTION — ONE PREDICATE, ONE PRODUCER: the store\'s midpoint act reads `isPairRefusalAt` (D15 then the marks) and `sharedCoordinateOf` for the composed pair, and holds no `solidRefusal`/`passageWords`/`siteWords` of its own; the door\'s `actAt` takes `check` and `compose`, reads the check on every pair the extension touches before the record, the composition after; `seamActAt` hands both from the predicate; the sentences (`can\'t be one moment`, `so together they are the passage`) are produced in src/lib/isPredicate.ts and nowhere else; the surface reads `valueWords` from the module and defines none; the view hands EVERY seam\'s standing pairs to the seam act; the module classified NOT_FROZEN in the manifest',
  /isPairRefusalAt\(shape, edge\.vertexIds\[0\], edge\.vertexIds\[1\], x, y, R\)/.test(store) && /sharedCoordinateOf\(shape, edge\.vertexIds\[0\], edge\.vertexIds\[1\], pair\[0\], pair\[1\], R\)/.test(store) && !/const solidRefusal = |const passageWords = |const siteWords = /.test(store) && /export type \{ MidpointSolidRefusal \} from '\.\.\/lib\/isPredicate'/.test(store)
    && /check\?: \(c: number, a: string, b: string\) => DoorRefusal \| null, compose\?: \(transports: DoorTransport\[\]\) => DoorRefusal \| null\): DoorActResult/.test(door) && /if \(check\) for \(const \[a, b\] of ext\.e\[c\]\) \{ const r = check\(c, a, b\); if \(r\) return \{ taken: false, refusal: r \}; \}\n    const conflicts = refusalOf/.test(door) && /const transports = transportsFrom\(A, B, e, standing\);\n  if \(compose\) \{ const r = compose\(transports\); if \(r\) return \{ taken: false, refusal: r \}; \}/.test(door)
    && /isPairRefusalAt\(record, S\.A\.corners\[c\], S\.B\.corners\[c\], a, b, R\)/.test(imageM) && /compositionStoneOf\(record, standing, \[\.\.\.others, \.\.\.transports\], R\)/.test(imageM) && /return actAt\(S\.A, S\.B, standing, i, x, y, check, compose\);/.test(imageM)
    && J(sentenceSites) === J(['src/lib/isPredicate.ts']) && /import \{ valueWords \} from '\.\.\/lib\/isPredicate';/.test(surface) && !/const valueWords = /.test(surface)
    && /seamActAt\(img\.record, img\.seams\[seam\], seamRecords\.filter\(\(r\) => r\.formId === img\.formId\)\.flatMap\(\(r\) => r\.transports\), i, x, y\)/.test(view) && /^NOT_FROZEN src\/lib\/isPredicate\.ts — GROUP 4 · slice 2/m.test(manifest) && /export function compositionStoneOf\(record: Shape, before: CornerPairs\[\], after: CornerPairs\[\]/.test(mod),
  { sentenceSites });

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-ONE-IS-PREDICATE: ALL PASS — D15 and the marks in one reader for edge and seam; 204 = 31 + 117 + 56 in her sentence; the seam refuses what the Ambo refuses; the stone by composition through the doors' : `DIAGNOSE-THE-ONE-IS-PREDICATE: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
