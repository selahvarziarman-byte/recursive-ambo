#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// FOUR OF HIS OPERATIONS CARRY THE CONCEPT LAYER — GROUP 4 · slice 5a (ADR 0031 §9.76 (2), the researcher's 11:27, ratified — claims §512; Δ239, Δ242, Δ247). Each with
// its one falsifier: COLLAPSE, an identification by the construction, REFUSED by name while an IS relating stands on a collapsed edge (the stone); CUT keeps every corner and
// edge, the removed face's records carried unread; CONNECTED SUM, both records side by side, the seam's transports given (his) and never computed; REMOVE and UNDO by D17
// (his acts are input; a later act un-says none). On the eye's Property fixture (Virgin Land's 12:10 export with the coder's generation-2 acts) and the 19:54 record.
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
const { useGeometryStore, childRecordsOf } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry, birthChild } = req('src/manuscript/genesisModel.ts');
const { applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const B = req('src/manuscript/bornRecordModel.ts');
const { liftedConceptOf } = req('src/manuscript/liftedConceptModel.ts');
const { useManuscriptPageStore } = req('src/manuscript/pageStore.ts');
const { columnSpaceOf } = req('src/lib/instanceSpace.ts');
const { transportSpaceOf } = req('src/lib/transport.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { altitudeHeld } = req('src/lib/altitude.ts');
const REL = req('src/lib/relatings.ts');
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
console.log('FOUR OF HIS OPERATIONS CARRY THE CONCEPT LAYER — §9.76 (2): collapse refused by name, cut carried unread, the sum side by side, remove and undo by D17\n');
const S = () => useGeometryStore.getState();
const sh = () => S().shapes[S().currentShapeId];
const PROPERTY = 'scripts/fixtures/altitude/property-export-with-the-coders-generation-2-acts_for-the-eye.workspace.json';
const R1954 = 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json';
const importOf = (f) => S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, f), 'utf8')));
const liftFaces = (faceIds) => { S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection(); for (const id of faceIds) S().toggleLiftSelection({ kind: 'face', id }); const before = useLiftStore.getState().queue.length; S().liftSelectionToManuscript(); return loadUniverseSnapshot(useLiftStore.getState().queue[before].file); };
const lab = (shape, v) => shape.vertices[v]?.data.label || v;

// ═══ §0 THE RECORD ═══
importOf(PROPERTY);
const G = sh();
const sq = G.faces.find((f) => f.vertexIds.length === 4 && f.vertexIds.map((v) => lab(G, v)).every((l) => /Property/.test(l)));
const sides = sq ? sq.vertexIds.map((a, k) => edgeBetween(G.edges, a, sq.vertexIds[(k + 1) % sq.vertexIds.length])) : [];
const sideIS = sides.map((e) => (e ? REL.relatingsOn(e, { records: childRecordsOf(S()) }).filter((r) => r[0] === REL.IS && r[3] === '+').length : -1));
check('§0 THE RECORD: the eye\'s Property fixture — the square of the generation-2 core around Property, its four sides holding no relating (measured: the coder\'s generation-2 pairs stand one level up)',
  !!sq && sides.every(Boolean) && sideIS.every((n) => n === 0), { square: sq && sq.vertexIds.map((v) => lab(G, v)), sideIS });

// ═══ §1 COLLAPSE REFUSED BY NAME while an IS relating stands on a collapsed edge ═══
const chainOf = (entry, form) => ({ carriedOf: (id) => (id === form.shape.id ? entry.loaded.ancestors ?? [] : []), formOf: () => null, seamRecords: [], factsOf: () => entry.loaded.lexicon ?? null, recordsOf: () => null, rulesOf: () => entry.loaded.records?.rules ?? null });
const e0 = liftFaces([sq.id]); const sq0 = placeShelfEntry(e0, 0);
const R0 = B.formRecordOf(sq0, chainOf(e0, sq0));
const ref0 = R0.state === 'read' ? B.collapseRefusalOf(R0.record, sq0.shape.faces[0].vertexIds) : 'no record';
// a lawful IS pair on a side, given at the Ambo
let given = null;
for (const e of sides) {
  const [a, b] = e.vertexIds; const recs = childRecordsOf(S()); const cA = columnSpaceOf(sh(), a, { records: recs }); const cB = columnSpaceOf(sh(), b, { records: recs });
  if (!cA || !cB) continue;
  for (const x of cA.roles) { for (const y of cB.roles) { S().giveRolePair(e.id, x.id, y.id); if (!S().midpointRefusals[e.id] && REL.relatingsOn(sh().edges.find((z) => z.id === e.id)).some((r) => r[0] === REL.IS && r[1] === x.id && r[2] === y.id)) { given = { edge: e.id, x: x.id, y: y.id, ends: [lab(sh(), a), lab(sh(), b)] }; break; } useGeometryStore.setState({ midpointRefusals: {} }); } if (given) break; }
  if (given) break;
}
note(`§1 a lawful IS pair given on a side at the Ambo: ${J(given)} — on this record every pair of these few moments is refused by the one predicate (D15 or the marks), so the refusal cannot arise here`);
// THE POSITIVE CONTROL (the mechanism's — the stone's control in slice 2 took the same form): an IS relating set on a side of the lifted record by hand
const recHand = R0.state === 'read' ? JSON.parse(JSON.stringify(R0.record)) : null;
const cycH = sq0.shape.faces[0].vertexIds;
const sideH = recHand ? edgeBetween(recHand.edges, cycH[0], cycH[1]) : null;
const xH = sideH ? (transportSpaceOf(recHand, sideH.vertexIds[0])?.space.roles[0]?.id ?? null) : null;
const yH = sideH ? (transportSpaceOf(recHand, sideH.vertexIds[1])?.space.roles[0]?.id ?? null) : null;
if (sideH && xH && yH) { const k = recHand.edges.indexOf(sideH); recHand.edges[k] = REL.withRelating(sideH, REL.relating(REL.IS, xH, yH, '+')); }
const ref1 = recHand && xH && yH ? B.collapseRefusalOf(recHand, cycH) : null;
const sideNames = sideH ? [lab(recHand, sideH.vertexIds[0]), lab(recHand, sideH.vertexIds[1])] : [];
const view = src('src/manuscript/ManuscriptView.tsx');
check('§1 ★★★ COLLAPSE REFUSED BY NAME (§9.76 (2): the stone — two moments of one corner made one): the square lifted with its sides bare collapses (no refusal — and on this record no lawful IS pair can stand on a side, measured, so the page never meets the refusal here); THE POSITIVE CONTROL — an IS relating set on a side of the lifted record by hand — refuses the collapse naming the pair and the side, `not collapsed — <x> ≡ <y> stands on <A>–<B>; this collapse would make them one, and they are two moments of one corner`; the view refuses it at pick time (the dock\'s and the menu\'s row, the words its reason) and at the act',
  ref0 === null && given === null && !!sideH && !!ref1 && ref1.edge.id === sideH.id && /^not collapsed — .+ ≡ .+ stands on .+–.+; this collapse would make them one, and they are two moments of one corner$/.test(ref1.words) && ref1.words.includes(`stands on ${sideNames[0]}–${sideNames[1]}`)
    && view.includes("return collapseRefusalOf(R.record, face.vertexIds, R.records ? { records: R.records } : {})?.words ?? null;") && (view.match(/return withCollapseRefusal\(operationAvailabilityFor\(/g) || []).length === 2 && view.includes("if (operationId === 'collapse-sphere') { const words = collapseRefusal(key); if (words) { closeMenus(); setOpNotice(words); return; } }"),
  { bare: ref0, refused: ref1 && ref1.words });

// ═══ §2 CUT KEEPS EVERY CORNER AND EDGE, THE REMOVED FACE'S RECORDS CARRIED UNREAD ═══
importOf(PROPERTY);
const G2 = sh();
const said = G2.faces.find((f) => f.vertexIds.length === 3 && f.vertexIds.every((v) => G2.vertices[v].createdBy.operation !== 'seed' && G2.vertices[v].createdBy.sourceVertexIds.every((x) => G2.vertices[x] && G2.vertices[x].createdBy.operation !== 'seed')) && f.vertexIds.some((_, slot) => altitudeHeld(f, slot).length > 0));
const e2 = liftFaces([said.id]); const tri = placeShelfEntry(e2, 2);
const cutR = applyPlaygroundOperationTo('cut', tri.shape, null, 9, 8, [tri.shape], tri.shape.faces[0].id);
const cutForm = cutR.ok ? cutR.born : cutR.enacted;
const ctx2 = { carriedOf: (id) => (id === tri.shape.id ? e2.loaded.ancestors ?? [] : []), formOf: (id) => [tri].find((w) => w.shape.id === id) ?? null, seamRecords: [], factsOf: () => null };
const F2 = cutForm ? B.formRecordOf(cutForm, ctx2) : null;
const carriedFace = F2 && F2.state === 'read' ? F2.record.faces.find((f) => f.id === said.id || f.id.endsWith(said.id.split(':').pop())) : null;
const heldThere = carriedFace ? carriedFace.vertexIds.reduce((n, _, slot) => n + altitudeHeld(carriedFace, slot).length, 0) : 0;
const C2 = F2 && F2.state === 'read' ? liftedConceptOf(cutForm, [], undefined, F2) : null;
check('§2 ★★ CUT KEEPS EVERY CORNER AND EDGE, THE REMOVED FACE\'S RECORDS CARRIED UNREAD: the triangle holding a saying (Capital–Property\'s light) lifted and cut — the cut form reads its three corners on the derived record, and the record still holds the removed face WITH its saying (carried), while the cut form reads no face (unread: it has none)',
  !!said && !!cutForm && cutForm.shape.faces.length === 0 && !!F2 && F2.state === 'read' && !!carriedFace && heldThere >= 1 && !!C2 && C2.state === 'read' && C2.vertices.length === 3 && C2.faces.length === 0,
  { saying: said && said.vertexIds.map((v) => lab(G2, v)), cut: cutForm && cutForm.title, held: heldThere, rows: C2 && C2.state === 'read' ? [C2.vertices.length, C2.faces.length] : C2 });

// ═══ §3 CONNECTED SUM: BOTH RECORDS SIDE BY SIDE, THE SEAM'S TRANSPORTS GIVEN AND NEVER COMPUTED ═══
const twoTris = (shape) => { const tris = shape.faces.filter((f) => f.vertexIds.length === 3); for (const a of tris) for (const b of tris) if (a !== b && a.vertexIds.filter((v) => b.vertexIds.includes(v)).length === 2) return [a.id, b.id]; return null; };
importOf(PROPERTY); const eA = liftFaces(twoTris(sh())); const fA = placeShelfEntry(eA, 3);
importOf(R1954); const eB = liftFaces(twoTris(sh())); const fB = placeShelfEntry(eB, 4);
const sum = birthChild(fA.shape, fB.shape, 5, fA.shape.faces[0], fB.shape.faces[0]);
const sumForm = sum.ok ? sum.born : sum.enacted;
const ctx3 = (seamRecords) => ({ carriedOf: (id) => (id === fA.shape.id ? eA.loaded.ancestors ?? [] : id === fB.shape.id ? eB.loaded.ancestors ?? [] : []), formOf: (id) => [fA, fB].find((w) => w.shape.id === id) ?? null, seamRecords, factsOf: (id) => (id === fA.shape.id ? eA.loaded.lexicon ?? null : id === fB.shape.id ? eB.loaded.lexicon ?? null : null), recordsOf: () => null, rulesOf: (id) => (id === fA.shape.id ? eA.loaded.records?.rules ?? null : id === fB.shape.id ? eB.loaded.records?.rules ?? null : null) });
const F3 = sumForm ? B.formRecordOf(sumForm, ctx3([])) : null;
const rims = sumForm ? Object.values(sumForm.shape.vertices).filter((v) => !fA.shape.vertices[v.id] && !fB.shape.vertices[v.id]) : [];
const rolesAt = (shape, v) => { const r = transportSpaceOf(shape, v); return r ? r.space.roles.length : 0; };
const rimRows = F3 && F3.state === 'read' ? rims.map((v) => { const [a, b] = v.createdBy.sourceVertexIds; const recA = (eA.loaded.ancestors ?? []).find((x) => x.vertices[a]) ; const recB = (eB.loaded.ancestors ?? []).find((x) => x.vertices[b]); return { v: v.id, op: v.createdBy.operation, union: rolesAt(F3.record, v.id), members: [recA ? rolesAt(recA, a) : -1, recB ? rolesAt(recB, b) : -1], ends: [a, b] }; }) : [];
const keptA = Object.keys(fA.shape.vertices).find((v) => sumForm && sumForm.shape.vertices[v]);
const recA0 = (eA.loaded.ancestors ?? []).find((x) => x.vertices[keptA]);
// HIS transport on a rim corner (the model's input; the page's route for it at a sum is not built — said in the letter)
const rimWithRoles = rimRows.find((r) => r.members[0] > 0 && r.members[1] > 0);
let joinedBy = null;
if (rimWithRoles) {
  const recA = (eA.loaded.ancestors ?? []).find((x) => x.vertices[rimWithRoles.ends[0]]); const recB = (eB.loaded.ancestors ?? []).find((x) => x.vertices[rimWithRoles.ends[1]]);
  const x = transportSpaceOf(recA, rimWithRoles.ends[0]).space.roles[0].id; const y = transportSpaceOf(recB, rimWithRoles.ends[1]).space.roles[0].id;
  const F3b = B.formRecordOf(sumForm, ctx3([{ formId: sumForm.shape.id, seam: 0, transports: [{ corners: [rimWithRoles.ends[0], rimWithRoles.ends[1]], roles: [[x, y]], types: [] }] }]));
  joinedBy = F3b.state === 'read' ? rolesAt(F3b.record, rimWithRoles.v) : null;
}
check('§3 ★★★ CONNECTED SUM, BOTH RECORDS SIDE BY SIDE (§9.76 (2)): two lifts of two universes (their ids disjoint, measured) summed — the chain reads the sum through its provenance on the two records side by side (`via: provenance`, the root named `X and Y`); each rim corner the sum merged (`assemble`, one source in each record) holds its two members\' moments together, joined by NOTHING (the union\'s count is the members\' sum — never computed); a kept corner reads as on its own record; HIS transport on a rim corner joins one pair (the count one less) — given, never computed',
  !!sumForm && sumForm.opId === 'connect-sum' && (sumForm.parentShapes || []).length === 2 && !!F3 && F3.state === 'read' && F3.via === 'provenance' && / and /.test(F3.rootName) && rims.length >= 1 && rimRows.every((r) => r.op === 'assemble' && r.members.every((n) => n >= 0) && r.union === r.members[0] + r.members[1])
    && !!keptA && !!recA0 && rolesAt(F3.record, keptA) === rolesAt(recA0, keptA) && (!rimWithRoles || joinedBy === rimWithRoles.union - 1),
  { sum: sumForm && sumForm.title, state: F3 && F3.state, root: F3 && F3.rootName, rims: rimRows.map((r) => [r.op, r.union, r.members]), joinedBy, reason: F3 && F3.state === 'none' ? F3.reason : undefined });

// ═══ §4 REMOVE AND UNDO BY D17 ═══
// (a) the page store: his seam records stay when the form is removed, and are read again when undo brings it back
const P = useManuscriptPageStore;
P.getState().setWritten([{ form: fA, home: [0, 0, 0] }]);
const t0 = { corners: ['x', 'y'], roles: [['p', 'q']], types: [] };
P.getState().recordSeamTransports(fA.shape.id, 0, [t0]);
P.getState().removeForm(fA.id);
const afterRemove = P.getState().seamRecords.filter((r) => r.formId === fA.shape.id).length;
P.getState().undoLastAct();
const afterUndo = P.getState().seamRecords.filter((r) => r.formId === fA.shape.id).length;
const back = P.getState().written.some((w) => w.form.id === fA.id);
// (b) the chain through a REMOVED born parent: the square (lifted), the band (glued of it), the skeleton (cut of the band); the band removed from the page
importOf(PROPERTY); const eS = liftFaces([sh().faces.find((f) => f.vertexIds.length === 4 && f.vertexIds.map((v) => lab(sh(), v)).every((l) => /Property/.test(l))).id]); const square = placeShelfEntry(eS, 6);
const bandR = applyPlaygroundOperationTo('glue-cylinder', square.shape, null, 7, 8, [square.shape], null);
const band = bandR.ok ? bandR.born : null;
const skelR = band ? applyPlaygroundOperationTo('cut', band.shape, band.parentShape ?? null, 8, 8, [band.shape], band.shape.faces[0]?.id ?? null) : null;
const skeleton = skelR && skelR.ok ? skelR.born : skelR && skelR.enacted ? skelR.enacted : null;
const pageWritten = [square, skeleton].filter(Boolean); // the band removed
const pageActs = band ? [{ kind: 'remove', formId: band.id, entry: { form: band, home: [0, 0, 0] } }] : [];
const viewFormOf = (id) => pageWritten.find((w) => w.shape.id === id) ?? [...pageActs].reverse().find((a) => a.kind === 'remove' && a.entry?.form.shape.id === id)?.entry?.form ?? null;
const ctx4 = (formOf) => ({ carriedOf: (id) => (id === square.shape.id ? eS.loaded.ancestors ?? [] : []), formOf, seamRecords: [], factsOf: () => null });
const F4 = skeleton ? B.formRecordOf(skeleton, ctx4(viewFormOf)) : null;
const F4old = skeleton ? B.formRecordOf(skeleton, ctx4((id) => pageWritten.find((w) => w.shape.id === id) ?? null)) : null;
const store = src('src/manuscript/pageStore.ts');
check('§4 ★★ REMOVE AND UNDO BY D17 (his acts are input; a later act un-says none): his seam records STAY when the form is removed and are read again when undo brings it back (before: dropped at the removal, and undo restored the form without them); a child of a REMOVED born parent still reads through it — the skeleton cut of the band reads `through 2 acts` with the band removed (the chain finds it through its remove act), where without that it read nothing (`the parent carries no record`)',
  afterRemove === 1 && afterUndo === 1 && back && !!skeleton && !!F4 && F4.state === 'read' && F4.acts.length === 2 && !!F4old && F4old.state === 'none' && /the parent carries no record/.test(F4old.reason)
    && !/seamRecords: s\.seamRecords\.filter\(\(r\) => r\.formId !== entry\.form\.shape\.id\)/.test(store) && view.includes("?? [...acts].reverse().find((a) => a.kind === 'remove' && a.entry?.form.shape.id === shapeId)?.entry?.form ?? null,") && view.includes("const parentForm = chainCtx.formOf(parentShape.id) ??"),
  { seams: [afterRemove, afterUndo, back], skeleton: skeleton && skeleton.title, through: F4 && (F4.state === 'read' ? F4.acts : F4.reason), old: F4old && (F4old.state === 'none' ? F4old.reason : F4old.state) });

// ═══ §5 BY CONSTRUCTION ═══
const chain = src('src/manuscript/bornRecordModel.ts');
check('§5 ★ BY CONSTRUCTION: one refusal for collapse (`collapseRefusalOf`, the chain module\'s, read by the view at the row and the act); one reading of a sum (`sideBySideOf` and the chain\'s two-parent branch through `provenanceRecordOf` — no transport computed, his given ones read); the connected sum\'s old absence words gone from the chain',
  /export function collapseRefusalOf\(/.test(chain) && /export function sideBySideOf\(/.test(chain) && /const side = sideBySideOf\(reads\.map\(\(P\) => P\.record\)\);/.test(chain) && !/not carried through a connected sum yet/.test(chain),
  'source pins');

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-ACTS-CARRIED: ALL PASS — collapse refused by name while an IS relating stands on a collapsed edge; cut carries the removed face\'s records unread; the sum reads both records side by side, joined only by his transports; remove and undo by D17' : `DIAGNOSE-THE-ACTS-CARRIED: ${failures} FAIL`}`);
process.exit(failures === 0 ? 0 : 1);
