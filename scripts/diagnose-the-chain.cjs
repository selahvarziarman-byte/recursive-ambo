#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// THE PULLBACK CHAIN — GROUP 4 · slice 1 (ADR 0031 §9.76 (1); the mothership's 13:27 STAMP on Arman's Δ239 and Δ242; the researcher's 11:27, ratified — claims §512).
// A form born on the page carries its concept record DERIVED from its parent's by the act, along the shape's own provenance, at every depth, stored nowhere — the built
// image record of one identification made the law of every act. His case first (the Δ238 measure of 12:50): Virgin Land's 19:54 record with relatings around Class, the
// square of the re-dissected core around Class lifted alone, the torus in ONE act and in TWO acts (the band, then the torus on the band through the page's own operation
// path) — the two read the SAME point; via the carried record alone (the reading before this slice) the second act lost the concepts. Then each kind of provenance:
// a copy (thicken), a merge by the construction (collapse), a face-sourced corner (dualize, OPEN), kept corners (cut), and the chain's absence said.
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
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
const { useGeometryStore, childRecordsOf } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const { applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const I = req('src/manuscript/identificationImageModel.ts');
const B = req('src/manuscript/bornRecordModel.ts');
const { liftedConceptOf } = req('src/manuscript/liftedConceptModel.ts');
const { thicken } = req('src/lib/thicken.ts');
const { columnSpaceOf } = req('src/lib/instanceSpace.ts');
const { transportSpaceOf } = req('src/lib/transport.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
console.log('THE PULLBACK CHAIN — a form born on the page reads the record derived from its parent\'s by the act, at every depth (GROUP 4 · slice 1)\n');
// ═══ §0 HIS CASE: the 19:54 record, relatings around Class, the square lifted alone ═══
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json'), 'utf8')));
const G1 = cur();
const lab = (sh, v) => sh.vertices[v]?.data.label || v;
const byLabel = (sh, l) => Object.keys(sh.vertices).find((v) => sh.vertices[v].data.label === l);
const V = byLabel(G1, 'Class');
const around = G1.edges.filter((e) => e.vertexIds.includes(V) && G1.vertices[e.vertexIds.find((x) => x !== V)].createdBy.operation !== 'seed');
const records = childRecordsOf(S());
let given = 0;
for (const e of around) {
  const [a, b] = e.vertexIds; const cA = columnSpaceOf(G1, a, { records }); const cB = columnSpaceOf(G1, b, { records });
  if (!cA || !cB) continue;
  let taken = null;
  for (const ra of cA.roles) { for (const rb of cB.roles) { S().giveRolePair(e.id, ra.id, rb.id); if (!S().midpointRefusals[e.id]) { taken = [ra.id, rb.id]; break; } useGeometryStore.setState({ midpointRefusals: {} }); } if (taken) break; }
  if (taken) { given += 1; for (const ra of cA.roles) { let done = false; for (const rb of cB.roles) { if (ra.id === taken[0] || rb.id === taken[1]) continue; if (S().giveRelating(e.id, 'is honoured as', ra.id, rb.id, '+') === null) { done = true; given += 1; break; } } if (done) break; } }
}
S().selectCell(cur().cells.find((c) => c.kind === 'core').id); S().applyAmboDissectionToCurrent();
const G2 = cur();
const corners = around.map((e) => Object.values(G2.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && e.vertexIds.every((x) => v.createdBy.sourceVertexIds.includes(x))));
const sq = G2.faces.find((f) => f.vertexIds.length === 4 && corners.every((v) => v && f.vertexIds.includes(v.id)));
S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection(); S().toggleLiftSelection({ kind: 'face', id: sq.id });
const before = useLiftStore.getState().queue.length; S().liftSelectionToManuscript();
const entry = loadUniverseSnapshot(useLiftStore.getState().queue[before].file);
const square = placeShelfEntry(entry, 0);
const ancestors = entry.loaded.ancestors ?? [];
const cyc = square.shape.faces[0].vertexIds;
const E = [0, 1, 2, 3].map((i) => edgeBetween(square.shape.edges, cyc[i], cyc[(i + 1) % 4]));
check('§0 THE RECORD: six acts on the three gen-1 medial edges around Class that hold columns (an IS pair and a relating in a mode on each), the core dissected again, the square around Class lifted alone — one face, four corners, one carried ancestor', given === 6 && !!sq && square.shape.faces.length === 1 && Object.keys(square.shape.vertices).length === 4 && ancestors.length === 1 && square.opId === null, { given, corners: cyc.map((v) => lab(square.shape, v)), ancestors: ancestors.length });
// the page's chain context, as the view builds it: the shelf (the square), the written forms (the square and every form born below)
const written = [square];
const ctx = { carriedOf: (id) => (id === square.shape.id ? ancestors : []), formOf: (id) => written.find((w) => w.shape.id === id) ?? null, seamRecords: [], factsOf: (id) => (id === square.shape.id ? entry.loaded.lexicon ?? null : null) };
const bornOf = (opId, parent, pickedFace = null) => { const r = applyPlaygroundOperationTo(opId, parent.shape, parent.parentShape ?? null, written.length + 1, 8, [parent.shape], pickedFace); if (!r.ok) return { refused: r.reason }; written.push(r.born); return r.born; };
const pointOf = (img) => (img.state === 'identified' ? { members: img.corners.map((c) => c.members.map((m) => `${m.label}:${m.roles}`)), roles: img.corners.map((c) => c.roles), ids: img.corners.map((c) => c.identities), labels: img.corners.flatMap((c) => c.space.roles.map((r) => r.label.replace(/ of [^|]*$/, ''))).sort() } : { state: img.state });
// ═══ §1 THE LIFTED FORM reads the carried record (the lift's rule, unchanged) ═══
const F0 = B.formRecordOf(square, ctx);
check('§1 ★ A LIFTED FORM reads the record the lift carried — `via: carried`, depth 0, the ancestor by id (the lift\'s own rule, as before)', F0.state === 'read' && F0.via === 'carried' && F0.depth === 0 && F0.record === ancestors[0] && B.chainWords(F0) === 'read from the record the lift carried', F0.state === 'read' ? [F0.via, F0.depth] : F0);
// ═══ §2 THE TORUS IN ONE ACT: the chain's record IS the identification's image ═══
const torus1 = bornOf('glue-torus', square);
const F1 = torus1.refused ? null : B.formRecordOf(torus1, ctx);
const img1 = torus1.refused ? null : I.identificationImageOf(torus1, ancestors[0], []);
check('§2 ★★ THE TORUS IN ONE ACT: the chain derives the born form\'s record from the square\'s by the identification — `via: identification`, one act deep — and it IS D19\'s image record (the same vertices, the one merged corner holding the four children\'s six moments)',
  !!F1 && F1.state === 'read' && F1.via === 'identification' && F1.depth === 0 && F1.chain.length === 2 && !!img1 && img1.state === 'identified' && J(Object.keys(F1.record.vertices).sort()) === J(Object.keys(img1.image.vertices).sort()) && img1.corners.length === 1 && img1.corners[0].members.length === 4 && img1.corners[0].roles === 6,
  { F1: F1 && (F1.state === 'read' ? [F1.via, F1.depth, F1.chain] : F1), point: img1 && pointOf(img1) });
// the card's reading of the born form ON ITS DERIVED RECORD: the merged corner holds the union's six roles
const C1 = torus1.refused ? null : liftedConceptOf(torus1, [], undefined, F1);
check('§2 ★★ THE CARD READS THE BORN FORM ON ITS DERIVED RECORD (`liftedConceptOf` with the chain): state `read`, `via: identification`, its one corner held and resolved with the union\'s 6 roles; the chain\'s line says so',
  !!C1 && C1.state === 'read' && C1.via === 'identification' && C1.held === 1 && C1.resolved === 1 && C1.vertices.length === 1 && C1.vertices[0].roles === 6 && /^read from the record derived by this act \(.+\) from its parent's — the record the lift carried$/.test(C1.chain),
  C1 && (C1.state === 'read' ? { via: C1.via, held: C1.held, resolved: C1.resolved, rows: C1.vertices.map((v) => [v.label, v.space, v.roles]), chain: C1.chain } : C1));
// ═══ §3 THE TORUS IN TWO ACTS reads the same point — the chain at depth 1 ═══
const band = bornOf('glue-cylinder', square);
const torus2 = band.refused ? { refused: band.refused } : bornOf('glue-torus', band);
const Fb = band.refused ? null : B.formRecordOf(band, ctx);
const F2 = torus2.refused ? null : B.formRecordOf(torus2, ctx);
const img2 = torus2.refused || !F2 || F2.state !== 'read' ? null : I.identificationImageOf(torus2, B.formRecordOf(band, ctx).record, []);
const img2old = torus2.refused ? null : I.identificationImageOf(torus2, ancestors[0], []);
const same = img1 && img2 && img1.state === 'identified' && img2.state === 'identified' && img1.corners[0].roles === img2.corners[0].roles && J(pointOf(img1).labels) === J(pointOf(img2).labels);
check('§3 ★★ THE TORUS IN TWO ACTS READS THE SAME POINT (§9.76 (6)\'s falsifier): the band (a~A) born of the square, then the torus (b~B) born of the band through the page\'s own operation path; the chain reads the band\'s record as the square\'s image (depth 1) and the torus\'s as the band\'s image (depth 2, three steps to the lift) — ONE corner of the band\'s two merged corners, the same 6 roles by the same words as the one-act torus\'s point; read on the carried record alone (the view before this slice) the second act held 0 roles — the concepts lost, his observation',
  !!Fb && Fb.state === 'read' && Fb.via === 'identification' && Fb.depth === 0 && !!F2 && F2.state === 'read' && F2.via === 'identification' && F2.chain.length === 3 && !!img2 && img2.state === 'identified' && img2.corners.length === 1 && img2.corners[0].members.length === 2 && img2.corners[0].roles === 6 && same === true && !!img2old && img2old.state === 'identified' && img2old.corners[0].roles === 0,
  { band: Fb && (Fb.state === 'read' ? [Fb.via, Fb.depth] : Fb), torus2: F2 && (F2.state === 'read' ? [F2.via, F2.depth, F2.chain.length] : F2), point2: img2 && pointOf(img2), old: img2old && pointOf(img2old), same });
// ═══ §4 THICKEN: the copies read the same (provenance) ═══
let thick = null; let thickWhy = '';
try { thick = thicken(square.shape); } catch (err) { thickWhy = String(err.message).slice(0, 160); }
const thickForm = thick ? { shape: thick.shape ?? thick, opId: 'thicken', provenance: 'thicken — the square × I', parentShape: square.shape } : null;
if (thickForm) written.push(thickForm);
const Ft = thickForm ? B.formRecordOf(thickForm, ctx) : null;
const Pt = thickForm ? B.provenanceRecordOf(ancestors[0], thickForm.shape, []) : null;
const copyRows = thickForm && Ft && Ft.state === 'read' ? Object.values(thickForm.shape.vertices).filter((v) => v.createdBy.operation === 'product').map((v) => { const src = v.createdBy.sourceVertexIds[0]; const a = transportSpaceOf(ancestors[0], src); const b = transportSpaceOf(Ft.record, v.id); return [lab(ancestors[0], src), a ? a.space.roles.length : null, b ? b.space.roles.length : null]; }) : [];
check('§4 ★★ THICKEN — THE COPIES READ THE SAME (§9.76 (2); the provenance path): the square × I born on the page reads a record derived by provenance (`via: provenance`); its eight corners are ALL copies (`product`, one source each — the two levels of each corner) and each holds its source\'s space, the same roles (2 · 0 · 2 · 2, twice); the segment leg between a corner\'s two levels is slice 5b\'s',
  !!thickForm && !!Ft && Ft.state === 'read' && Ft.via === 'provenance' && !!Pt && Pt.state === 'derived' && Pt.copies === 8 && Pt.merged === 0 && copyRows.length === 8 && copyRows.every(([, a, b]) => a === b && a !== null) && J(copyRows.map(([, a]) => a).sort()) === J([0, 0, 2, 2, 2, 2, 2, 2]),
  { why: thickWhy, Ft: Ft && (Ft.state === 'read' ? Ft.via : Ft), P: Pt && (Pt.state === 'derived' ? [Pt.merged, Pt.copies, Pt.children, Pt.empty] : Pt), copies: copyRows });
// ═══ §5 COLLAPSE: a merge by the construction — the union, joined by nothing ═══
const coll = bornOf('collapse-sphere', square);
const Fc = coll.refused ? null : B.formRecordOf(coll, ctx);
const Pc = coll.refused ? null : B.provenanceRecordOf(ancestors[0], coll.shape, []);
const collMerged = coll.refused ? [] : Object.values(coll.shape.vertices).filter((v) => v.createdBy.sourceVertexIds.length >= 2 && !ancestors[0].vertices[v.id]);
const collSpace = Fc && Fc.state === 'read' && collMerged.length ? transportSpaceOf(Fc.record, collMerged[0].id) : null;
check('§5 ★★ COLLAPSE — A MERGE BY THE CONSTRUCTION reads the union of its members\' spaces, joined by nothing (no pairs of his): the collapsed square\'s merged corner holds its members\' moments side by side (6 roles over the four children, 0 identities); refused later while an IS relating stands on a collapsed edge is slice 5a\'s',
  !coll.refused && !!Fc && Fc.state === 'read' && Fc.via === 'provenance' && !!Pc && Pc.state === 'derived' && Pc.merged >= 1 && collMerged.length >= 1 && !!collSpace && collSpace.space.roles.length === 6,
  { refused: coll.refused, Fc: Fc && (Fc.state === 'read' ? Fc.via : Fc), P: Pc && (Pc.state === 'derived' ? [Pc.merged, Pc.copies, Pc.children, Pc.empty] : Pc), merged: collMerged.map((v) => [v.createdBy.operation, v.createdBy.sourceVertexIds.length]), roles: collSpace && collSpace.space.roles.length });
// ═══ §6 DUALIZE: a face-sourced corner holds nothing, said (the dual OPEN, §9.76 (5)) ═══
// the page's own dual refuses both forms at hand (the square: `dual undefined on bounded surfaces`; the torus: `carries quotient cells`) — the dual's reading on the page is OPEN
// (§9.76 (5)); the chain's RULE for a face-sourced corner is pinned on the provenance the dual writes (`dualization`, the face's corners as sources), over the square's record
const dualTry = bornOf('dual', square);
const dualShape = { ...square.shape, id: `${square.shape.id}:dual-by-hand`, vertices: { 'v:dual': { id: 'v:dual', position: [0, 0, 0], data: { label: 'the face' }, createdBy: { shapeId: 'x', operation: 'dualization', sourceVertexIds: [...cyc] } } }, edges: [], faces: [], cells: [], genealogy: { ...square.shape.genealogy, operation: 'dualization' } };
const dualForm = { shape: dualShape, opId: 'dual', provenance: 'dualize — by hand, as the dual writes its corner', parentShape: square.shape };
const Fd = B.formRecordOf(dualForm, ctx);
const Pd = B.provenanceRecordOf(ancestors[0], dualShape, []);
const dualRows = Fd.state === 'read' ? liftedConceptOf(dualForm, [], undefined, Fd) : null;
check('§6 ★ DUALIZE — a corner whose source is a FACE holds no cast (§9.76 (5), the dual OPEN): a corner born by `dualization` with the face\'s four corners as its sources reads NOTHING on the derived record (`empty`, no union of the face\'s corners fabricated) and the card says `holds no space`; the page\'s own dual refuses the square (bounded) and the torus (quotient cells) today, said',
  Fd.state === 'read' && Fd.via === 'provenance' && Pd.state === 'derived' && Pd.empty === 1 && Pd.merged === 0 && !!dualRows && dualRows.state === 'read' && dualRows.resolved === 0 && dualRows.vertices.length === 1 && dualRows.vertices[0].space === 'none' && /^surfaceDual: /.test(dualTry.refused || ''),
  { P: Pd.state === 'derived' ? [Pd.merged, Pd.copies, Pd.children, Pd.empty] : Pd, rows: dualRows && dualRows.state === 'read' ? dualRows.vertices.map((v) => [v.label, v.space, v.absence]) : dualRows, pageDual: (dualTry.refused || '').slice(0, 80) });
// ═══ §7 CUT: kept corners read the record's own ═══
const cutF = bornOf('cut', square, square.shape.faces[0].id);
const Fcut = cutF.refused ? null : B.formRecordOf(cutF, ctx);
const Ccut = Fcut && Fcut.state === 'read' ? liftedConceptOf(cutF, [], undefined, Fcut) : null;
check('§7 ★ CUT keeps every corner and edge (§9.76 (2)): the square cut along its face reads its four corners on the derived record as the square does — the same four spaces (2 · 0 · 2 · 2 roles), the removed face carried unread',
  !cutF.refused && !!Fcut && Fcut.state === 'read' && !!Ccut && Ccut.state === 'read' && Ccut.vertices.length === 4 && J(Ccut.vertices.map((v) => v.roles).sort()) === J([0, 2, 2, 2]),
  { refused: cutF.refused, rows: Ccut && Ccut.state === 'read' ? Ccut.vertices.map((v) => [v.label, v.roles]) : Ccut });
// ═══ §8 THE CHAIN'S ABSENCE, SAID ═══
const orphan = { ...torus1, parentShape: { ...square.shape, id: 'shape:unknown' } };
const Fo = torus1.refused ? null : B.formRecordOf(orphan, ctx);
const Co = torus1.refused ? null : liftedConceptOf(orphan, [], undefined, Fo);
const unknown = { shape: { ...square.shape, id: 'shape:odd', vertices: { ...square.shape.vertices, 'v:odd': { id: 'v:odd', position: [0, 0, 0], data: { label: 'odd' }, createdBy: { shapeId: 'shape:odd', operation: 'invoke', sourceVertexIds: [cyc[0], cyc[1], cyc[2]] } } } }, opId: 'odd-act', provenance: 'an act the chain does not know', parentShape: square.shape };
const Fu = B.formRecordOf(unknown, ctx);
check('§8 ★★ THE CHAIN\'S ABSENCE IS SAID, NEVER GUESSED: a born form whose parent is not on the page and carries no record — `none`, `the parent carries no record — nothing carried …`, and the card says `born on the page (…) — nothing to read: …`; a vertex born by an act the chain does not read yet — `none`, naming the act (`invoke`) and the vertex, no union fabricated',
  !!Fo && Fo.state === 'none' && /the parent carries no record — nothing carried/.test(Fo.reason) && !!Co && Co.state === 'born-on-page' && /^the parent carries no record/.test(Co.reason) && Fu.state === 'none' && /an act the chain does not read yet — invoke \(v:odd\)/.test(Fu.reason),
  { Fo: Fo && Fo.reason, Co: Co && Co.state, Fu: Fu.reason });
// ═══ §9 BY CONSTRUCTION ═══
const model = src('src/manuscript/bornRecordModel.ts'); const lifted = src('src/manuscript/liftedConceptModel.ts'); const view = src('src/manuscript/ManuscriptView.tsx'); const manifest = src('docs/governance/ENGINE_FREEZE_MANIFEST.txt');
check('§9 ★ BY CONSTRUCTION: the chain is one reader (`formRecordOf`: a lifted form the carried record, a born form its parent\'s record derived — by seams through `imageRecordOf`, else by provenance — recursing on the parent); `liftedConceptOf` takes the chain\'s record for a born form and keeps `born-on-page` only as the chain\'s absence with its reason; the view hands the chain to the card and to the identification image\'s parent record; the model is react-free and classified NOT_FROZEN',
  /export function formRecordOf\(form: ChainForm, ctx: ChainContext, depth = 0, seen: Set<string> = new Set\(\)\): FormRecord/.test(model) && /const P = formRecordOf\(parentForm, ctx, depth \+ 1, seen\);/.test(model) && /const S = seamsOf\(form\.shape, parentShape\);/.test(model) && /const D = provenanceRecordOf\(P\.record, form\.shape, ctx\.seamRecords\);/.test(model) && !/from 'react'|useGeometryStore|zustand/.test(model)
    && /if \(form\.opId !== null && \(!derived \|\| derived\.state !== 'read'\)\) return \{ state: 'born-on-page', provenance: form\.provenance, reason: derived \? derived\.reason : 'the chain was not read' \};/.test(lifted) && /derived\.state === 'read' \? derived\.record : carriedRecordOf\(form\.shape, carried\)/.test(lifted)
    && /formRecordOf\(entry\.form, chainCtx\)/.test(view) && /const PR = formRecordOf\(parentForm, chainCtx\);/.test(view) && /^NOT_FROZEN src\/manuscript\/bornRecordModel\.ts — GROUP 4 · slice 1/m.test(manifest));
console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-CHAIN: ALL PASS — a form born on the page reads the record derived from its parent\'s by the act, at every depth; the torus in two acts reads the point of the torus in one' : `DIAGNOSE-THE-CHAIN: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
