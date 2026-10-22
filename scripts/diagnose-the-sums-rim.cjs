#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// HIS PAIRS GIVEN AT A CONNECTED SUM'S RIM — GROUP 4 · slice 5a′ (Arman's Δ248, "Yes, build it now"; ADR 0031 §9.76 (2): "connected sum, both records side by side, the
// seam's transports given and never computed"; the designer's 21:49 rim words; her 21:41 fixes — collapse's words with their route, and the removal's notice cured at the
// strip, claims §536). The sum's rim is read as seams from its OWN provenance (each rim corner `assemble`, one source in each summand — nothing computed), and D19's
// machinery opens on it unchanged: the identification section, the door's act at a rim edge, the merged point. On two lifts of two universes (Virgin Land's Property export
// with the coder's generation-2 acts, and her 19:54 record), summed by the page's own combine (enacted without a body: the render finds no faithful complex, measured).
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
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry, birthChild } = req('src/manuscript/genesisModel.ts');
const I = req('src/manuscript/identificationImageModel.ts');
const B = req('src/manuscript/bornRecordModel.ts');
const { IdentificationImageSection } = req('src/manuscript/IdentificationImageSection.tsx');
const { transportSpaceOf } = req('src/lib/transport.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const REL = req('src/lib/relatings.ts');
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
const unesc = (t) => t.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const text = (html) => unesc(html.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
console.log('HIS PAIRS GIVEN AT A CONNECTED SUM\'S RIM — §9.76 (2) on Δ248: the rim read as seams from the sum\'s own provenance, D19\'s section opened on it, his pair taken at a rim edge\n');
const S = () => useGeometryStore.getState();
const sh = () => S().shapes[S().currentShapeId];
const PROPERTY = 'scripts/fixtures/altitude/property-export-with-the-coders-generation-2-acts_for-the-eye.workspace.json';
const R1954 = 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json';
const importOf = (f) => S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, f), 'utf8')));
const liftFaces = (faceIds) => { S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection(); for (const id of faceIds) S().toggleLiftSelection({ kind: 'face', id }); const before = useLiftStore.getState().queue.length; S().liftSelectionToManuscript(); return loadUniverseSnapshot(useLiftStore.getState().queue[before].file); };
const twoTris = (shape) => { const tris = shape.faces.filter((f) => f.vertexIds.length === 3); for (const a of tris) for (const b of tris) if (a !== b && a.vertexIds.filter((v) => b.vertexIds.includes(v)).length === 2) return [a.id, b.id]; return null; };

// ═══ §0 THE SUM: two lifts of two universes, summed by the page's own combine ═══
importOf(PROPERTY); const eA = liftFaces(twoTris(sh())); const fA = placeShelfEntry(eA, 0);
importOf(R1954); const eB = liftFaces(twoTris(sh())); const fB = placeShelfEntry(eB, 1);
const born = birthChild(fA.shape, fB.shape, 2, fA.shape.faces[0], fB.shape.faces[0]);
const sum = born.ok ? born.born : born.enacted;
const ctxOf = (seamRecords) => ({ carriedOf: (id) => (id === fA.shape.id ? eA.loaded.ancestors ?? [] : id === fB.shape.id ? eB.loaded.ancestors ?? [] : []), formOf: (id) => [fA, fB].find((w) => w.shape.id === id) ?? null, seamRecords, factsOf: (id) => (id === fA.shape.id ? eA.loaded.lexicon ?? null : id === fB.shape.id ? eB.loaded.lexicon ?? null : null), recordsOf: () => null, rulesOf: () => null });
const U = sum ? B.summandsOf(sum.parentShapes, ctxOf([])) : { reason: 'no sum' };
check('§0 THE SUM: two lifts of two universes (their ids disjoint) summed by the page\'s combine — enacted (on these records without a body: the render finds no faithful complex), born of TWO summands and no single parent; the chain\'s one producer holds the two records side by side',
  !!sum && sum.opId === 'connect-sum' && !sum.parentShape && (sum.parentShapes || []).length === 2 && !('reason' in U),
  { sum: sum && sum.title, reason: 'reason' in U ? U.reason : undefined });

// ═══ §1 THE RIM AS SEAMS, READ FROM THE SUM'S OWN PROVENANCE ═══
const side = 'reason' in U ? null : U.side;
const rim = side ? I.sumSeamsOf(sum.shape, [fA.shape, fB.shape], side) : { reason: 'no side' };
// the independent reading: each assemble vertex's two sources split by membership
const recordedPairs = Object.values(sum.shape.vertices).filter((v) => v.createdBy.operation === 'assemble' && v.createdBy.sourceVertexIds.length === 2).map((v) => ({ id: v.id, a: v.createdBy.sourceVertexIds.find((x) => fA.shape.vertices[x]), b: v.createdBy.sourceVertexIds.find((x) => fB.shape.vertices[x]) }));
const seamsAgree = !('reason' in rim) && rim.seams.every((s) => {
  const c0 = recordedPairs.find((p) => p.id === s.merged[0]); const c1 = recordedPairs.find((p) => p.id === s.merged[1]);
  return !!c0 && !!c1 && s.a.corners[0] === c0.a && s.a.corners[1] === c1.a && s.b.corners[0] === c0.b && s.b.corners[1] === c1.b && s.mode === null
    && edgeBetween(side.edges, c0.a, c1.a) === s.a.edge && edgeBetween(side.edges, c0.b, c1.b) === s.b.edge
    && s.crossed === (s.b.corners[s.a.corners.indexOf(s.a.edge.vertexIds[0])] !== s.b.edge.vertexIds[0]);
});
const rimEdges = sum.shape.edges.filter((e) => recordedPairs.some((p) => p.id === e.vertexIds[0]) && recordedPairs.some((p) => p.id === e.vertexIds[1]));
check('§1 ★★★ THE RIM AS SEAMS, NOTHING COMPUTED: one seam per rim edge (the sum\'s edges between rim corners), each pairing the first summand\'s edge with the second\'s through the rim corners\' RECORDED pairs (each `assemble` corner\'s two sources, read independently here); no mode (`null` — the sum\'s seam separates); `crossed` read off the two edges\' stored orders',
  !('reason' in rim) && rim.seams.length === rimEdges.length && rim.seams.length === recordedPairs.length && seamsAgree && rim.classes.size === recordedPairs.length,
  { seams: 'reason' in rim ? rim.reason : rim.seams.length, rimEdges: rimEdges.length, corners: recordedPairs.length });

// ═══ §2 THE IMAGE: D19's machinery opens on the sum ═══
const img = side ? I.identificationImageOf(sum, side, [], null, null) : null;
check('§2 ★★ THE IDENTIFICATION SECTION\'S IMAGE OPENS ON THE SUM: `identified`, its summands named by id (the view sets their names as the record line names them), one merged corner per rim corner holding its two members, the head\'s count over the RIM corners (the designer\'s 21:49: `N of 3 rim corners hold a space`), no gluing word',
  !!img && img.state === 'identified' && J(img.sum && img.sum.parentIds) === J([fA.shape.id, fB.shape.id]) && img.corners.length === recordedPairs.length && img.corners.every((c) => c.members.length === 2) && img.cornersTotal === recordedPairs.length && img.held >= 1 && img.held <= img.cornersTotal && img.gluing === null && img.seams.length === rim.seams.length,
  img && img.state === 'identified' ? { corners: img.corners.map((c) => [c.members.length, c.roles]), held: img.held, total: img.cornersTotal } : img);

// ═══ §3 HIS PAIR AT THE RIM: the door's act taken at a rim edge ═══
let act = null; let at = null; const verdicts = {};
if (img && img.state === 'identified') {
  outer: for (const seam of img.seams) {
    const sd = I.seamSidesOf(side, seam); if ('missing' in sd) continue;
    for (const slot of [0, 1]) {
      for (const x of sd.A.spaces[slot].roles) for (const y of sd.B.spaces[slot].roles) {
        const a = I.seamActAt(side, seam, [], slot, x.id, y.id);
        if (a.taken) { act = a; at = { seam: seam.index, slot, x: x.id, y: y.id }; break outer; }
        const k = a.refusal ? a.refusal.kind : 'missing'; verdicts[k] = (verdicts[k] || 0) + 1;
      }
    }
  }
}
note(`§3 the act: ${J(at)} · refusals before it: ${J(verdicts)}`);
const seamRecs = act ? [{ formId: sum.shape.id, seam: at.seam, transports: act.transports }] : [];
const img2 = act ? I.identificationImageOf(sum, side, seamRecs, null, null) : null;
const cornerOf = (image, seamIdx, slot) => image.corners.find((c) => c.id === image.seams[seamIdx].merged[slot]);
const before = act ? cornerOf(img, at.seam, at.slot) : null; const after = act ? cornerOf(img2, at.seam, at.slot) : null;
check('§3 ★★★ HIS PAIR TAKEN AT A RIM EDGE (the acceptance\'s model half — the eye takes it on the page): the door\'s act on a rim edge, a moment of one summand\'s corner paired with a moment of the other\'s, TAKEN — one transport; the rim corner\'s union joins that pair (its roles one fewer, one identity), the pairs he gives read and never computed',
  !!act && act.transports.length >= 1 && !!before && !!after && after.identities >= 1 && after.roles === before.roles - after.identities,
  { at, before: before && [before.roles, before.identities], after: after && [after.roles, after.identities] });

// ═══ §4 THE SECTION, IN THE DESIGNER'S 21:49 WORDS ═══
const named = (image) => ({ ...image, sum: { ...image.sum, names: [fA.title, fB.title] } });
const paper = { cardBackground: '#fff', cardBorder: '#ccc', cardInk: '#000' };
const render = (image, standing) => text(unesc(renderToString(React.createElement(IdentificationImageSection, { image: named(image), pick: null, onPick: () => {}, paper, standing, onSeamAct: () => {}, onSeamWithdraw: () => {}, refusal: null }))));
const t0 = img && img.state === 'identified' ? render(img, []) : '';
const t1 = img2 && img2.state === 'identified' ? render(img2, seamRecs) : '';
const headRe = new RegExp(`read from the records the two lifts carried — ${fA.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} and ${fB.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}, summed along their rims: \\d+ of ${recordedPairs.length} rim corners holds? a space · the acts are the Ambo's, at the sites the words name`);
check('§4 ★★ THE SECTION IN HER WORDS (21:49): the head `read from the records the two lifts carried — <A> and <B>, summed along their rims: N of 3 rim corners hold a space · …` (the summands named as the record line names them — their titles); each seam `rim edge 1 · <A\'s edge> ~ <B\'s edge>`, numbered round the rim, NO mode word; before any pair `the rim carries no role yet`; after his pair the bare rim edges named (`rim edge 2 …` / `rim edges 2 and 3 carry no role yet`) and the rim edge that carries one not',
  headRe.test(t0) && (t0.match(/rim edge \d+ · /g) || []).length === recordedPairs.length && !/ · (preserving|reversing)/.test(t0) && /the rim carries no role yet/.test(t0) && !/the door [a-z]/.test(t0)
    && !!t1 && !/the rim carries no role yet/.test(t1) && /rim edges? [\d, and]+ carr(y|ies) no role yet/.test(t1) && !new RegExp(`rim edge ${at ? at.seam + 1 : -1} carries no role yet`).test(t1),
  { head: (t0.match(/read from the records[^·]*/) || [''])[0].slice(0, 260), seams: t0.match(/rim edge \d+ · [^·]*/g), after: (t1.match(/rim edges? [\d, and]+ carr(y|ies) no role yet/g) || []).slice(0, 3) });

// ═══ §5 ONE READING: the chain reads the sum through the same image ═══
const F = sum ? B.formRecordOf(sum, ctxOf(seamRecs)) : null;
const chainCorner = F && F.state === 'read' && after ? transportSpaceOf(F.record, after.id) : null;
check('§5 ★★ ONE READING FOR THE CHAIN AND THE CARD (by construction): the chain reads the sum through its rim read as seams (`via: identification`), and with his pair standing its rim corner holds exactly the roles the section\'s image holds there',
  !!F && F.state === 'read' && F.via === 'identification' && !!chainCorner && !!after && chainCorner.space.roles.length === after.roles,
  { via: F && F.state === 'read' ? F.via : F && F.reason, chain: chainCorner && chainCorner.space.roles.length, image: after && after.roles });

// ═══ §6 THE DESIGNER'S 21:41: collapse's words with their route; the removal's notice cured at the strip (claims §536) ═══
importOf(PROPERTY);
const sq = sh().faces.find((f) => f.vertexIds.length === 4 && f.vertexIds.map((v) => sh().vertices[v].data.label).every((l) => /Property/.test(l)));
const eS = liftFaces([sq.id]); const fS = placeShelfEntry(eS, 3);
const RS = B.formRecordOf(fS, { carriedOf: (id) => (id === fS.shape.id ? eS.loaded.ancestors ?? [] : []), formOf: () => null, seamRecords: [], factsOf: () => null });
const recHand = RS.state === 'read' ? JSON.parse(JSON.stringify(RS.record)) : null;
const cyc = fS.shape.faces[0].vertexIds;
const rolesH = (v) => (transportSpaceOf(recHand, v)?.space.roles ?? []).map((r) => r.id);
// a side whose two corners give at least two distinct pairs (so the several-pairs form is exercised, never passed by absence)
const sidesH = recHand ? cyc.map((v, i) => edgeBetween(recHand.edges, v, cyc[(i + 1) % cyc.length])).filter(Boolean) : [];
const sideH = sidesH.find((e) => rolesH(e.vertexIds[0]).length * rolesH(e.vertexIds[1]).length >= 2) ?? null;
const pairsH = sideH ? rolesH(sideH.vertexIds[0]).flatMap((x) => rolesH(sideH.vertexIds[1]).map((y) => [x, y])).slice(0, 2) : [];
let one = null; let two = null;
if (sideH && pairsH.length === 2) {
  const k = recHand.edges.indexOf(sideH);
  recHand.edges[k] = REL.withRelating(sideH, REL.relating(REL.IS, pairsH[0][0], pairsH[0][1], '+'));
  one = B.collapseRefusalOf(recHand, cyc);
  recHand.edges[k] = REL.withRelating(recHand.edges[k], REL.relating(REL.IS, pairsH[1][0], pairsH[1][1], '+'));
  two = B.collapseRefusalOf(recHand, cyc);
}
const view = src('src/manuscript/ManuscriptView.tsx'); const chrome = src('src/manuscript/ManuscriptChrome.tsx'); const shell = src('src/AppShell.tsx');
check('§6 ★★ COLLAPSE IN THE DESIGNER\'S 21:41 WORDS, WITH ITS ROUTE: one pair — `not collapsed — x ≡ y stands on A–B, and collapsing A–B would leave x and y two moments of one corner. Withdraw it there first`; several — `… x ≡ y and z ≡ w stand on A–B, and collapsing A–B would leave each two moments of one corner. Withdraw them there first`; the door `open A–B` beside them where the Ambo\'s site is found (the record\'s corners back to the Ambo\'s, the site born of A and B), on the dock\'s and the menu\'s row and beside the act\'s notice, through the shell\'s one route into the Ambo',
  !!one && /^not collapsed — .+ ≡ .+ stands on .+–.+, and collapsing .+–.+ would leave .+ and .+ two moments of one corner\. Withdraw it there first$/.test(one.words)
    && !!two && two.pairs.length === 2 && /^not collapsed — .+ ≡ .+ and .+ ≡ .+ stand on .+–.+, and collapsing .+–.+ would leave each two moments of one corner\. Withdraw them there first$/.test(two.words)
    && view.includes('const amboOf = (v: string): string | null => (source && v.startsWith(`${source}:`) ? v.slice(source.length + 1) : null);') && view.includes("label: `open ${r.ends[0]}–${r.ends[1]}`")
    && chrome.includes('export interface RowDoor { label: string; onOpen: () => void }') && (chrome.match(/door=\{op\.door \?\? null\}/g) || []).length === 2 && chrome.includes('<button type="button" data-row-door onMouseDown={(e) => { e.stopPropagation(); door.onOpen(); }}')
    && view.includes('<button type="button" data-op-notice-door') && shell.includes('useGeometryStore.getState().selectVertex(vertexId);') && shell.includes("switchTo('ambo');") && shell.includes('<ManuscriptView onOpenInAmbo={openInAmbo} />'),
  { one: one && one.words.slice(0, 160), two: two && two.words.slice(0, 160) });
// the door is never dimmed with the refused row it sits in (seen at the eye: inside the row's dimming it read as refused too) — the row dims its label and its reason,
// the door stands after the dimmed span, outside it
const rowAt = chrome.indexOf('function MenuRow('); const rowEnd = chrome.indexOf('\n}\n', rowAt); const row = rowAt >= 0 && rowEnd > rowAt ? chrome.slice(rowAt, rowEnd) : '';
const dimAt = row.indexOf('<span style={{ opacity: disabled ? 0.65 * 0.45 : 0.65 }}>'); const dimEnd = row.indexOf('</span>', dimAt); const doorAt = row.indexOf('data-row-door');
check('§6 ★ A REFUSED ROW DIMS ITS WORDS, NEVER ITS DOOR (seen at the eye at slice 5a′: the collapse refusal\'s `open A–B` inside the refused row\'s dimming read as refused too — the grey says "not available", and the door is): the row\'s container carries no opacity; its label dims at 0.45 and its reason at 0.65 × 0.45 in a span that closes BEFORE the door',
  !!row && !/style=\{\{\s*padding: '4px 8px',[^}]*opacity:/.test(row) && row.includes("<div style={{ whiteSpace: 'nowrap', opacity: disabled ? 0.45 : 1 }}>{label}</div>") && dimAt > 0 && dimEnd > dimAt && doorAt > dimEnd,
  { dimAt, dimEnd, doorAt });
const panels = (chrome + view).match(/right: 14,\n\s*(top: [^\n]*\n\s*)?width: 264,/g) || [];
check('§6 ★ THE REMOVAL\'S NOTICE CURED AT THE STRIP (claims §536 — U.2 stands: `undo` acts on an act, and after a remove there is no card to hold it): the record strip ends at the card column\'s left edge (`STRIP_RIGHT = 14 + 264 + 12` — every right-column panel stands at `right: 14`, 264 wide, counted here), its record and acts lines wrap inside it (no entry held to one line), and `undo` stays at the end of the acts line, over nothing',
  chrome.includes('export const STRIP_RIGHT = 14 + 264 + 12;') && chrome.includes('right: STRIP_RIGHT,') && panels.length >= 4 && (chrome.match(/minWidth: 0, overflowWrap: 'anywhere'/g) || []).length >= 2 && !/<span key=\{entry\.childId\} style=\{\{ whiteSpace: 'nowrap' \}\}>/.test(chrome) && chrome.includes('data-undo-act'),
  { panels: panels.length });

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-SUMS-RIM: ALL PASS — the sum\'s rim read as seams from its own provenance; D19\'s section opened on it in the designer\'s words; his pair taken at a rim edge and read by the chain and the card alike; collapse\'s words with their route; the strip clear of the card' : `DIAGNOSE-THE-SUMS-RIM: ${failures} FAIL`}`);
process.exit(failures === 0 ? 0 : 1);
