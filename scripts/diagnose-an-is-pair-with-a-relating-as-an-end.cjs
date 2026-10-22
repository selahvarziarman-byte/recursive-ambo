#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// AN IS PAIR AT GENERATION 2 TAKES A RELATING IN A MODE AS AN END — ADR 0031 §9.75 (the researcher's 09:15, ratified — claims §507; Arman's Δ235 "settle it now, price first" and
// Δ236 "ride landing C"; the designer's 09:17 sentence). §9.46 (6)'s open item ruled YES under §9.72: at generation ≥ 2 his IS pair may take any moment of a born cast as an end, a
// relating in a mode included — the guard that refused every such pair (`… is a relating in the mode …: whether a pair can take a relating in a mode as an end is not ruled yet`) is
// gone. D15 STAYS as its own predicate: two ends holding ONE role of the parents' shared corner are refused by name with their reason — two IS ends as before (the pairing lives on the
// other parents' edge); a MODE end as the generation-1 passage through that corner, in her sentence, with the same `open` to its site. Measured on Virgin Land's 19:54 record dissected
// again, at Accumulation–Class (the children of Finance–Production and Production–Distribution): 204 pairs = 173 taken + 31 refused by the shared Production coordinate, and the
// researcher's three-pair falsifier.
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
const { columnSpaceOf, termWordsOf, instanceSpaceOf, instanceKey } = req('src/lib/instanceSpace.ts');
const { instancesOn, dirOf } = req('src/lib/relatings.ts');
const { spaceOf, composedOn, edgeKind, stoneOn } = req('src/lib/spaceOf.ts');
const { refusalOf } = req('src/lib/jRegister.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const PRED = req('src/lib/isPredicate.ts'); // GROUP 4 · slice 2: the one IS predicate (D15 and the marks) — the census moves to 204 = 31 + 117 + 56 (its own witness pins the sentence)
const { MidpointSurface, midpointViewOf } = req('src/components/MidpointSurface.tsx');
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
const unesc = (t) => t.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const text = (html) => unesc(html.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
console.log('AN IS PAIR AT GENERATION 2 TAKES A RELATING IN A MODE AS AN END — §9.75 on Virgin Land\'s 19:54 record at Accumulation–Class: 204 · 31 · 173, the three-pair falsifier, her sentence with `open`\n');
const S = () => useGeometryStore.getState();
S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json'), 'utf8')));
const sh0 = S().shapes[S().currentShapeId];
S().selectCell(sh0.cells.find((c) => /core/.test(c.id)).id);
S().applyAmboDissectionToCurrent();
const sh = () => S().shapes[S().currentShapeId];
const lab = (v) => sh().vertices[v]?.data.label || v;
const byLabel = (l) => Object.values(sh().vertices).find((v) => v.data.label === l);
const A = byLabel('Accumulation'); const B = byLabel('Class'); const P = byLabel('Production'); const Fi = byLabel('Finance'); const Di = byLabel('Distribution');
const e = edgeBetween(sh().edges, A.id, B.id);
const midOf = (a, b) => Object.values(sh().vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(a) && v.createdBy.sourceVertexIds.includes(b));
const mid = midOf(A.id, B.id); const midFD = midOf(Fi.id, Di.id);
const first = e.vertexIds[0] === A.id;
const records = childRecordsOf(S());
const nm = (c, id) => termWordsOf(sh(), c, id, { records });
const cA = columnSpaceOf(sh(), A.id); const cB = columnSpaceOf(sh(), B.id);
const byName = (col, c, name) => col.roles.map((r) => r.id).find((id) => nm(c, id) === name);
const vc = byName(cA, A.id, 'the variable capital'); const wf = byName(cA, A.id, 'the wage fund'); const fc = byName(cA, A.id, 'the fixed capital'); const keep = byName(cB, B.id, 'the keep');
const cs = byName(cA, A.id, 'the credit sale'); const lg = byName(cB, B.id, 'the largesse'); // GROUP 4 · slice 2: the pair the marks TAKE (the researcher's 13:58) — the standing pair for the dependency reading below
check('§0 THE RECORD: the 19:54 record dissected again; Accumulation (Finance–Production\'s child) and Class (Production–Distribution\'s child) share Production; their medial edge\'s midpoint is `Accumulation–Class`; the columns hold 17 and 12 moments, every one a relating in a mode (no IS instance on this record); his names stand — the variable capital, the wage fund, the fixed capital at Accumulation, the keep at Class',
  !!A && !!B && !!P && !!e && !!mid && mid.data.label === 'Accumulation–Class' && !!midFD && A.createdBy.sourceVertexIds.includes(P.id) && B.createdBy.sourceVertexIds.includes(P.id) && cA.roles.length === 17 && cB.roles.length === 12 && [...cA.roles, ...cB.roles].every((r) => !/≡/.test(r.id)) && !!vc && !!wf && !!fc && !!keep,
  { mid: mid && mid.data.label, columns: [cA.roles.length, cB.roles.length], keys: { vc, wf, fc, keep }, first });
// ═══ §1 composedOn's reach — the premise of §9.75 (5), measured ═══
const RA = spaceOf(sh(), e.vertexIds[0]); const RB = spaceOf(sh(), e.vertexIds[1]);
const composed = composedOn(sh(), RA, RB, [e.vertexIds[0], e.vertexIds[1]], edgeKind(sh(), e.vertexIds[0], e.vertexIds[1]));
const instKeys = new Set([...cA.roles.map((r) => r.id), ...cB.roles.map((r) => r.id)]);
const onInstances = composed.roles.filter(([a, b]) => instKeys.has(a) || instKeys.has(b)).length;
check('§1 ★★ THE PREMISE OF §9.75 (5), MEASURED: `composedOn` (the anchored IS meet) holds composed pairs on this medial edge, and NONE of them names a child\'s moment — a relating in a mode is no point of the meet — so the D15 refusal for a mode end is ITS OWN predicate (`solidRefusal` read directly, before the composed block), never a branch of the composed check',
  composed.roles.length > 0 && onInstances === 0, { composed: composed.roles.length, onInstances });
// ═══ §2 the census through the STORE: 204 · 31 · 173 ═══
const act = (x, y) => { if (first) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); const ref = S().midpointRefusals[e.id] || null; const rec = sh().edges.find((z) => z.id === e.id).identification; const taken = !ref && !!rec && rec.roles.some(([a, b]) => (first ? a === x && b === y : a === y && b === x)); return { taken, ref }; };
const undo = (x, y) => { if (first) S().withdrawRolePair(e.id, x, y); else S().withdrawRolePair(e.id, y, x); useGeometryStore.setState({ midpointRefusals: {} }); };
const clear = () => useGeometryStore.setState({ midpointRefusals: {} });
const PASSAGE = (role, from, to) => `both hold ${role}, so together they are the passage from ${from} to ${to} through Production, which you decide at Finance–Distribution`;
const census = { taken: 0, refused: 0, marks: 0, byRole: {}, other: 0, otherForms: {}, passageForms: 0, withOpen: 0, edgeFD: 0, unpaired: 0 }; let n = 0;
for (const ra of cA.roles) for (const rb of cB.roles) {
  n += 1; const r = act(ra.id, rb.id);
  if (r.taken) { census.taken += 1; undo(ra.id, rb.id); continue; }
  if (r.ref && !r.ref.solid && / can't be one moment: /.test(r.ref.form || '')) { census.marks += 1; clear(); continue; } // GROUP 4 · slice 2: the marks (§9.75 ADDENDUM) — pinned word by word in diagnose-the-one-is-predicate
  const s = r.ref && r.ref.solid;
  if (s) {
    census.refused += 1; census.byRole[s.role] = (census.byRole[s.role] || 0) + 1;
    if (r.ref.form === PASSAGE(s.role, s.others[0], s.others[1])) census.passageForms += 1;
    if (s.open === midFD.id) census.withOpen += 1;
    if (s.edge && s.edge.includes(Fi.id) && s.edge.includes(Di.id)) census.edgeFD += 1;
    if (s.paired === false) census.unpaired += 1;
  } else { census.other += 1; const f = (r.ref && (r.ref.form || (r.ref.conflicts && r.ref.conflicts.length ? 'conflicts' : r.ref.dependency ? 'dependency' : '?'))) || 'nothing happened'; census.otherForms[f.slice(0, 80)] = (census.otherForms[f.slice(0, 80)] || 0) + 1; }
  clear();
}
note(`the census: ${J(census)}`);
check('§2 ★★ THE CENSUS THROUGH THE STORE (the researcher\'s §9.75 (4), reproduced; GROUP 4 · slice 2 — the ADDENDUM of 13:58: 117 of the 173 once taken are refused by Production\'s two marks, 56 TAKEN): 204 pairs — 56 TAKEN (each withdrawn again), 117 refused by the marks in the designer\'s sentence, and 31 REFUSED by the shared Production coordinate, by its role: the surplus 12 · the reproduction 12 · the instrument 2 · the material 2 · the product 2 · the capacity 1; no other refusal (no `is a relating in the mode`, no stone, no conflict); every one of the 31 says her sentence with that role and the two other ends in his names, carries the passage\'s site as data — the edge Finance–Distribution, unpaired there, `open` to its midpoint',
  n === 204 && census.taken === 56 && census.marks === 117 && census.refused === 31 && census.other === 0 && J(Object.entries(census.byRole).sort()) === J(Object.entries({ 'the surplus': 12, 'the reproduction': 12, 'the instrument': 2, 'the material': 2, 'the product': 2, 'the capacity': 1 }).sort()) && census.passageForms === 31 && census.withOpen === 31 && census.edgeFD === 31 && census.unpaired === 31,
  census);
// ═══ §3 THE THREE-PAIR FALSIFIER (the researcher's §9.75 (4)) ═══
// GROUP 4 · slice 2 (the researcher's 13:58 ADDENDUM, claims §521): `(IS, the variable capital, the keep)` is REFUSED by Production's two marks (yes · yes at the capacity, no · no at the
// reproduction) in the designer's 14:05 sentence — the pair §9.75 (4) took stands no more; `(IS, the credit sale, the largesse)` is the pair the marks take, and it stands for the
// one-to-one and the dependency readings below. The marks sentence itself is pinned word by word in diagnose-the-one-is-predicate
const r0 = act(vc, keep); const f0 = r0.ref && r0.ref.form; clear();
check('§3 ★★ GROUP 4 · slice 2: `(IS, the variable capital, the keep)` REFUSED by the marks — `… can\'t be one moment: Production\'s “…” is yes at the capacity (the variable capital\'s) and no at the reproduction (the keep\'s) …` — no `solid`, nothing standing', !r0.taken && /^the variable capital and the keep can't be one moment: Production's “/.test(f0 || '') && !(r0.ref && r0.ref.solid), { form: f0 });
const r1 = act(cs, lg);
const rec1 = sh().edges.find((z) => z.id === e.id).identification;
const r2 = act(wf, keep); const s2 = r2.ref && r2.ref.solid; clear();
const fcAgree = cB.roles.map((rb) => rb.id).find((y) => y !== lg && PRED.isPairRefusalAt(sh(), A.id, B.id, cs, y, { options: {}, names: nm }) === null); // a second partner for the credit sale that the predicate passes — the one-to-one law's own ground
const r3 = fcAgree ? act(cs, fcAgree) : { taken: false, ref: null }; clear();
check('§3 ★★ THE FALSIFIER (as §9.75 (4) stands under the ADDENDUM): `(IS, the credit sale, the largesse)` TAKEN — one pair standing in the record; `(IS, the wage fund, the keep)` REFUSED — `' + PASSAGE('the reproduction', 'the advance', 'the share') + '` with the solid\'s data (the reproduction · the advance · the share · the edge Finance–Distribution, unpaired · open to its midpoint); with the first standing, `(IS, the credit sale, <a moment the marks pass>)` REFUSED by the one-to-one law in his names — `the keep is already paired with the variable capital, and a role takes one partner`',
  r1.taken && !!rec1 && rec1.roles.length === 1 && !r2.taken && r2.ref && r2.ref.form === PASSAGE('the reproduction', 'the advance', 'the share') && !!s2 && s2.role === 'the reproduction' && J(s2.others) === J(['the advance', 'the share']) && s2.corner === P.id && s2.open === midFD.id && s2.paired === false && J(s2.modes) === J(['is paid as', 'is received as']) && J(s2.corners) === J([Fi.id, Di.id]) && (r2.ref.conflicts || []).length === 0
    && !!fcAgree && !r3.taken && r3.ref && r3.ref.form === 'the credit sale is already paired with the largesse, and a role takes one partner' && !!r3.ref.prior,
  { r1: { taken: r1.taken, roles: rec1 && rec1.roles }, r2: { form: r2.ref && r2.ref.form, solid: s2 && { role: s2.role, others: s2.others, modes: s2.modes, paired: s2.paired, open: s2.open && lab(s2.open) } }, r3: { form: r3.ref && r3.ref.form, prior: r3.ref && r3.ref.prior } });
// ═══ §3b WITH THE PAIR STANDING, A LATER ACT ELSEWHERE IS TAKEN — the dependency reading at the children (measured 10-22 by the Δ238 instrument: every IS pair at Budget–Class was refused `would break the pair advance is spent as capacity ≡ reproduction is received as share at Accumulation–Class: it needs advance is spent as capacity as its own role` — the resolver's glued space holds none of a child's moments) ═══
{
  const standing = (sh().edges.find((z) => z.id === e.id).identification?.roles ?? []).length === 1; // §3's `(IS, the credit sale, the largesse)` still stands (GROUP 4 · slice 2)
  const Bu = byLabel('Budget'); const eBC = edgeBetween(sh().edges, Bu.id, B.id);
  const cBu = columnSpaceOf(sh(), Bu.id); const cCl = columnSpaceOf(sh(), B.id);
  // GROUP 4 · slice 2: `the minimum ≡ the labour` is refused by the marks now (Production's words at the two coordinates) — the pair at Budget–Class is the first the one predicate passes
  const bcFirst = eBC.vertexIds[0] === Bu.id;
  const lawfulBC = (() => { for (const x of cBu.roles) for (const y of cCl.roles) if (PRED.isPairRefusalAt(sh(), Bu.id, B.id, x.id, y.id, { options: {}, names: nm }) === null) return [x.id, y.id]; return [null, null]; })();
  const minimum = lawfulBC[0]; const labour = lawfulBC[1];
  if (bcFirst) S().giveRolePair(eBC.id, minimum, labour); else S().giveRolePair(eBC.id, labour, minimum);
  const refBC = S().midpointRefusals[eBC.id] || null;
  const recBC = sh().edges.find((z) => z.id === eBC.id).identification;
  // the control: the dependency reading still guards — withdrawing at Finance–Production the relating that the standing pair's end IS is refused by name, the relating kept
  const eFP = edgeBetween(sh().edges, Fi.id, P.id);
  const rFP = instancesOn(eFP).find((r) => instanceKey(r[0], r[1], r[2], dirOf(r)) === cs); // the standing pair's own end — the credit sale (GROUP 4 · slice 2)
  const heldBefore = instancesOn(eFP).length;
  if (rFP) S().withdrawRelating(eFP.id, rFP[0], rFP[1], rFP[2], dirOf(rFP));
  const wref = S().relatingRefusals[eFP.id] || null;
  const heldAfter = instancesOn(sh().edges.find((z) => z.id === eFP.id)).length;
  check('§3b ★★ WITH `the credit sale ≡ the largesse` STANDING (GROUP 4 · slice 2: the pair the marks take), the first pair the one predicate passes AT Budget–Class IS TAKEN — one pair recorded there, no dependency refusal (at 3cf0452: `would break the pair … at Accumulation–Class: it needs advance is spent as capacity as its own role`, since the dependency reading took the resolver\'s glued space); THE CONTROL: withdrawing at Finance–Production the relating `advance is spent as capacity` — the standing pair\'s own end — is refused by name as a dependency (`… is one of its ends`), the relating kept',
    standing && !!minimum && !!labour && refBC === null && !!recBC && recBC.roles.length === 1 && !!rFP && !!wref && wref.withdrawal === true && !!wref.dependency && /is one end of .+ at Accumulation–Class/.test(wref.why || '') && heldAfter === heldBefore,
    { standing, keys: { minimum, labour }, refBC: refBC && (refBC.form || (refBC.dependency && refBC.dependency.why)), recBC: recBC && recBC.roles, withdraw: wref && { why: wref.why, dependency: !!wref.dependency }, held: [heldBefore, heldAfter] });
  useGeometryStore.setState({ relatingRefusals: {} });
  if (bcFirst) S().withdrawRolePair(eBC.id, minimum, labour); else S().withdrawRolePair(eBC.id, labour, minimum);
  clear();
  undo(cs, lg);
}
// ═══ §4 THE SURFACE: the refusal as the person reads it, with `open` ═══
{
  const r = act(wf, keep); const refusal = r.ref;
  const view = midpointViewOf(sh(), mid.id);
  const html = view ? unesc(renderToString(React.createElement(MidpointSurface, { shape: sh(), site: view.site, resolved: view.resolved, refusal, remade: null })).replace(/<!-- -->/g, '')) : '';
  const box = (html.match(/<div data-midpoint-refusal="[^"]*"[\s\S]*?<\/div>/) || [''])[0];
  const t = text(box);
  check('§4 ★★ ON THE SURFACE (the designer\'s 09:17): the refusal box reads `not taken — ' + PASSAGE('the reproduction', 'the advance', 'the share') + '` — the moments and the passage\'s ends by his names, the passage said as the modes tab says it, by its two ends and the corner it runs through — with ONE hand `clear` and the same `open Finance–Distribution` as the built sentence takes, the button carrying that midpoint; ONE NAME FOR ONE SITE: the sentence and the button name the site as its midpoint is labelled (`Finance–Distribution`; before this cut the button read `open Distribution–Finance`, the edge\'s stored order); the box\'s data `the reproduction|the advance|the share|unpaired`; no `is a relating in the mode` anywhere on the page',
    view !== null && box !== '' && t.includes(`not taken — ${PASSAGE('the reproduction', 'the advance', 'the share')}`) && (box.match(/data-midpoint-withdraw-attempt/g) || []).length === 1 && t.includes('clear') && new RegExp(`data-midpoint-open-site="${midFD.id}"[^>]*>open Finance–Distribution<`).test(box) && midFD.data.label === 'Finance–Distribution' && !/Distribution–Finance/.test(t) && box.includes('data-midpoint-refusal-solid="the reproduction|the advance|the share|unpaired"') && !/is a relating in the mode/.test(text(html)),
    { box: t.slice(0, 300), midLabel: midFD.data.label });
  clear();
}
// the record as imported: nothing stands (every pair of §3 withdrawn or refused)
clear();
check('§3 ★ the control: the pair withdrawn, the record holds nothing on this edge again', (sh().edges.find((z) => z.id === e.id).identification?.roles ?? []).length === 0);
// ═══ §5 MEASURED, NOT PINNED — the J check and the stone at this edge (§9.75 (5), the third item), for the mothership and the researcher ═══
{
  const inR = (R, id) => R.space.roles.some((r) => r.id === id);
  const heldA = cA.roles.filter((r) => inR(RA, r.id)).length; const heldB = cB.roles.filter((r) => inR(RB, r.id)).length;
  const pairRow = first ? [vc, keep] : [keep, vc];
  const X = first ? RA : RB; const Y = first ? RB : RA;
  const marksOn = (col) => col.roles.filter((r) => Object.keys(r.types || {}).some((k) => k !== 'mode')).length;
  const tv = (cA.roles.find((r) => r.id === vc) || {}).types || {}; const tk = (cB.roles.find((r) => r.id === keep) || {}).types || {};
  const prodA = Object.fromEntries(Object.entries(tv).filter(([k]) => k.startsWith('B:')).map(([k, v]) => [k.slice(2), v])); // at Accumulation Production is the B side
  const prodB = Object.fromEntries(Object.entries(tk).filter(([k]) => k.startsWith('A:')).map(([k, v]) => [k.slice(2), v])); // at Class Production is the A side
  const shared = Object.keys(prodA).filter((k) => k in prodB); const disagree = shared.filter((k) => prodA[k] !== prodB[k]);
  note(`§5 MEASURED (not pinned): the J check (\`refusalOf\`) and the stone (\`stoneOn\`) at this edge are handed the RESOLVER's two spaces, which hold ${heldA} of the ${cA.roles.length} moments of Accumulation and ${heldB} of the ${cB.roles.length} of Class (their roles are the parents' with side prefixes, e.g. ${J(RA.space.roles.slice(0, 3).map((r) => r.id))}) — on every pair of moments both are VACUOUS BY ABSENCE: J ${refusalOf(X.space, Y.space, [pairRow], []).length} conflicts, stone ${J(stoneOn(X, Y, pairRow[0], pairRow[1], 'role'))}.`);
  note(`§5 MEASURED (not pinned): the columns' moments DO carry the parents' marks pulled back (MOLD v7 §8) — ${marksOn(cA)} of ${cA.roles.length} at Accumulation, ${marksOn(cB)} of ${cB.roles.length} at Class (the researcher's "no quality on these moments" is not what the substrate holds); on the falsifier's TAKEN pair the shared parent Production's marks are ${J(prodA)} at the variable capital and ${J(prodB)} at the keep — ${disagree.length} of ${shared.length} shared marks DISAGREE (${J(disagree)}). A J check that read the pulled-back marks (keyed by the parent, not by the side) would refuse the pair §9.75 (4) says is TAKEN — a meaning question, routed to the mothership; nothing built here.`);
  note(`§5 the J check over the two COLUMNS as they are keyed today: ${refusalOf(first ? cA : cB, first ? cB : cA, [pairRow], []).length} conflicts (the mark keys are side-relative — \`B:lasts beyond the act\` at Accumulation is \`A:lasts beyond the act\` at Class — so nothing aligns).`);
}
// ═══ §6 BY CONSTRUCTION ═══
const st = src('src/store/geometryStore.ts');
const pm = src('src/lib/isPredicate.ts');
check('§6 ★ BY CONSTRUCTION: the open-item guard and its sentence are gone from the store (no `modeOf`, no `is a relating in the mode`); THE DEPENDENCY READING AT THE CHILDREN — `SpaceOfOptions.holds`, `brokenBornActs` reading membership through it where handed, `brokenBornActsAtChildren` handing `columnSpaceOf`, the store\'s two sites and the respects\' guard calling that one (no bare `brokenBornActs(` in either); the one IS predicate (`isPairRefusalAt`, src/lib/isPredicate.ts — GROUP 4 · slice 2) is read directly after membership, before the composed block: D15 first, carrying each end\'s mode and the two other parents (`modes`, `corners`), a mode end `passageWords` (her sentence, the site from the corners), two IS ends `solidWords` as before, the solid as data so the surface\'s `open` reads it; then the marks; the names through the one term reader WITH his records (`optsN`, the predicate\'s `names`); the one-to-one refusal names through the same reader',
  !st.includes('is a relating in the mode') && !st.includes('const modeOf = ') && st.includes("const verdict = isPairRefusalAt(shape, edge.vertexIds[0], edge.vertexIds[1], x, y, R);\n    if (verdict) return refuse(verdict.form, [], undefined, undefined, verdict.kind === 'solid' ? verdict.solid : undefined);")
    && pm.includes('modes: [string, string]; // §9.75') && pm.includes('corners: [VertexId, VertexId];') && pm.includes('export const passageWords = (shape: Shape, s: MidpointSolidRefusal): string => {') && pm.includes('? `both hold ${s.role}, so together they are the passage from ${s.others[0]} to ${s.others[1]} through ${labelOf(shape, s.corner)}, which you decide at ${site}`')
    && pm.includes('export const siteWords = (shape: Shape, s: MidpointSolidRefusal): string | null => {') && pm.includes('const site = siteWords(shape, s);') && pm.includes('const e = siteWords(shape, s) as string;') && src('src/components/MidpointSurface.tsx').includes('const solidEdgeWords = solidOpen ? labelOf(shape, solidOpen) : ')
    && st.includes('const optsN = { ...opts, records: childRecordsOf(state) };') && st.includes('const R: IsPredicateReaders = { options: opts, names: (c, id) => termWordsOf(shape, c, id, optsN), tau: types };') && st.includes("if (px) return refuse(`${termWordsOf(shape, edge.vertexIds[0], x, optsN)} is already paired with ${termWordsOf(shape, edge.vertexIds[1], px[1], optsN)}, and a role takes one partner`")
    && src('src/components/MidpointSurface.tsx').includes('const solidOpen = refusal?.solid?.open ?? null;')
    && src('src/lib/spaceOf.ts').includes('holds?: (corner: VertexId, id: string) => boolean;') && src('src/lib/spaceOf.ts').includes("const holdsU = (id: string): boolean => (options.holds ? options.holds(e.vertexIds[0], id) : U.space.roles.some((r) => r.id === id));")
    && src('src/lib/instanceSpace.ts').includes("return brokenBornActs(shape, { ...options, holds: (corner, id) => columnSpaceOf(shape, corner, options, memo)?.roles.some((r) => r.id === id) ?? false }, except);")
    && !/\bbrokenBornActs\(/.test(st) && (st.match(/brokenBornActsAtChildren\(/g) || []).length === 2 && !/\bbrokenBornActs\(/.test(src('src/lib/respects.ts')) && src('src/lib/respects.ts').includes('brokenBornActsAtChildren(shape, { ...options, candidate, meetDependency: false }, edge.id)'));
console.log(`\n${failures === 0 ? 'DIAGNOSE-AN-IS-PAIR-WITH-A-RELATING-AS-AN-END: ALL PASS — at generation 2 his IS pair takes a relating in a mode as an end; a shared coordinate is refused as the passage he decides at its site; 204 · 31 · 173 on the 19:54 record' : `DIAGNOSE-AN-IS-PAIR-WITH-A-RELATING-AS-AN-END: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
