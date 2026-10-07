#!/usr/bin/env node

// DIAGNOSTIC — STAMP THE-THIRD-RESOLUTION · D19 (2026-10-06): THE IDENTIFICATION'S DIRECT IMAGE — the Manuscript's concept layer (the
// researcher's ruling §2, chartered by reference 09-30 10:49; ADR 0031 §9.19; R-D6 closed). The reader: src/manuscript/identificationImageModel.ts
// (NOT_FROZEN) — the carried record QUOTIENTED along the identification (the image record), read by the readers that exist.
//
// §0 purity and the manifest · §1 F-D19a on run 1's committed torus (ta/saves/manuscript_torus_word.page.json): the one corner holds the four
// children side by side, no identity among them, k = 0, the seams `no transport yet` — never `holds no concept-space`; the card's section
// rendered · §2 THE SEAM ACT through the door model (C-11a): the whole line-pair taken; the pushout makes two roles one · §3 F-D19b on the
// band (abcB) over the same record with his relatings added: one seam act makes two instances one and OPENS a path through the other edge's
// face — k = 1 by D18's values and by the paths (two readers) · §4 F-D19c THE JOIN'S DIRECTION on the band and the twist: a relating and its
// counterpart written the same way in the two edges' stored orders meet run the other way exactly where the corner pairing CROSSES the stored
// ends — the band's preserving pair crosses on the single-face word path (the frozen module's own convention), the twist's reversing pair runs
// parallel, so the ruling's sentence reads the other way round there (measured and SAID, the mechanism pinned); a symmetric mode dissolves it ·
// §5 F-D19d THE SUB-CASE on the doors witness's prism (42 × 42 door pairs): with IS-only transports the merged corner's child IS the pushout over
// e — |A| + |B| − |e| roles, every pair one role, role for role · §6 the surface routes a born identification to its own section.
//
// Run: node scripts/diagnose-the-identification-image.cjs

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, ok, detail) => { console.log(`${ok ? 'PASS' : 'FAIL'} - ${name}${!ok && detail !== undefined ? ` — ${detail}` : ''}`); if (!ok) failures += 1; };
const note = (line) => console.log(`      · ${line}`);

const I = req('src/manuscript/identificationImageModel.ts');
const { loadUniverseSnapshot } = req('src/manuscript/genesisModel.ts');
const SO = req('src/lib/sorting.ts');
const REL = req('src/lib/relatings.ts');
const RS = req('src/lib/respects.ts');
const CI = req('src/lib/complexIdentification.ts');
const D = req('src/manuscript/doorTransportModel.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { childSpaceOf } = req('src/lib/instanceSpace.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { IdentificationImageSection } = req('src/manuscript/IdentificationImageSection.tsx');
const React = require('react');
const { renderToString } = require('react-dom/server');
const visibleText = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, '\'').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

console.log('THE IDENTIFICATION\'S DIRECT IMAGE — D19 (the third resolution)\n');

// ═══ §0 purity · the manifest ═══
console.log('----- §0 purity and the manifest -----');
const src = readLf('src/manuscript/identificationImageModel.ts');
check('§0 the model is react-free and store-free, and the frozen identification is READ through its exports, never edited (its parser imported; no `.identification` write)', !/from 'react'|useGeometryStore|useManuscriptPageStore/.test(src) && /parseIdentificationSuffix/.test(src) && /from '\.\.\/lib\/complexIdentification'/.test(src));
check('§0 the two new files are classified NOT_FROZEN in the manifest at this landing (the completeness law)', /^NOT_FROZEN src\/manuscript\/identificationImageModel\.ts /m.test(readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt')) && /^NOT_FROZEN src\/manuscript\/IdentificationImageSection\.tsx /m.test(readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt')));

// ═══ §1 F-D19a — the committed torus ═══
console.log('\n----- §1 F-D19a: run 1\'s committed torus — four children side by side, k = 0, no transport yet -----');
const pagePath = path.join(repoRoot, '.handoff/REPORTS_CUSTOMER-SIDE_2026-09-28/saves/ta/saves/manuscript_torus_word.page.json');
const page = JSON.parse(fs.readFileSync(pagePath, 'utf8'));
const entry = loadUniverseSnapshot(page.shelfFiles[0]);
const record = entry.loaded.ancestors[0];
const lifted = page.written[0].form; const bornTorus = page.written[1].form;
const lab = (v) => record.vertices[v]?.data.label || v;
const formOf = (born, parentForm) => ({ shape: born.shape, opId: born.opId, provenance: born.provenance, parentShape: parentForm.shape });
const torus = I.identificationImageOf(formOf(bornTorus, lifted), record, []);
const paper = { cardBackground: '#fff', cardBorder: '#ccc', cardInk: '#000' };
const render = (img, standing = []) => renderToString(React.createElement(IdentificationImageSection, { image: img, pick: null, onPick: () => {}, paper, standing, onSeamAct: () => {}, onSeamWithdraw: () => {}, refusal: null }));
check('§1 ★★ THE BORN TORUS IS AN IDENTIFICATION OF THE LIFTED SQUARE (the materialize path\'s slot pairs read, the corner pairing derived from the members): two seams, both preserving, both crossing the stored ends; ONE corner, its four members Thoroughgoing determination · Moment · Cessation · State', torus.state === 'identified' && torus.path === 'materialized' && torus.seams.length === 2 && torus.seams.every((s) => s.mode === 'preserving' && s.crossed) && torus.corners.length === 1 && J(torus.corners[0].members.map((m) => m.label)) === J(['Thoroughgoing determination', 'Moment', 'Cessation', 'State']), J(torus.state === 'identified' ? { path: torus.path, seams: torus.seams.map((s) => [s.mode, s.crossed]), corners: torus.corners.map((c) => c.members.map((m) => m.label)) } : torus));
check('§1 ★★ F-D19a: the one corner holds the FOUR CHILDREN SIDE BY SIDE — 5 + 3 + 6 + 5 = 19 roles, NO identity among them (the door exists, its transport does not yet); the media hold nothing on either edge; k = 0', torus.state === 'identified' && J(torus.corners[0].members.map((m) => m.roles)) === J([5, 3, 6, 5]) && torus.corners[0].roles === 19 && torus.corners[0].identities === 0 && torus.media.every((m) => m.fromA === 0 && m.fromB === 0 && m.joined === 0 && m.discordances.length === 0) && torus.k === 0 && torus.transportsGiven === 0, torus.state === 'identified' ? J({ roles: torus.corners[0].members.map((m) => m.roles), total: torus.corners[0].roles, k: torus.k }) : torus.state);
check('§1 the image record is the carried record quotiented: 22 − 4 + 1 vertices, 78 − 2 edges (the two seams joined), the faces with a repeated corner dropped', torus.state === 'identified' && Object.keys(torus.image.vertices).length === 19 && torus.image.edges.length === 76 && torus.image.faces.length < record.faces.length, torus.state === 'identified' ? J([Object.keys(torus.image.vertices).length, torus.image.edges.length, torus.image.faces.length]) : '');
const htmlTorus = torus.state === 'identified' ? render(torus) : '';
check('§1 ★★ THE CARD\'S SECTION for the torus: the merged corner `holds 4 children side by side — 5 + 3 + 6 + 5 roles · no transport yet between them`, each seam `no transport yet — the door exists, its transport does not`, no k line (nothing to mark at 0), and NEVER `holds no concept-space`', /data-identification-image="identified"/.test(htmlTorus) && /holds 4 children side by side — 5 \+ 3 \+ 6 \+ 5 roles/.test(visibleText(htmlTorus)) && (htmlTorus.match(/data-image-corner-no-transport/g) || []).length === 1 && (htmlTorus.match(/data-image-seam-empty/g) || []).length === 2 && !/data-image-k=/.test(htmlTorus) && !/holds no concept-space/.test(htmlTorus) && /the door exists, its transport does not/.test(visibleText(htmlTorus)), visibleText(htmlTorus).slice(0, 400));

// ═══ §2 the seam act ═══
console.log('\n----- §2 the seam act through the door model: the whole line-pair taken, two roles made one -----');
const seam0 = torus.state === 'identified' ? torus.seams[0] : null;
const sides0 = seam0 ? I.seamSidesOf(record, seam0) : null;
check('§2 the seam\'s two sides read on the record: A State–Cessation with children of 5 and 6 roles, B Moment–Thoroughgoing determination (the paired order) with 3 and 5', !!sides0 && !('missing' in sides0) && J(sides0.A.spaces.map((s) => s.roles.length)) === J([5, 6]) && J(sides0.B.spaces.map((s) => s.roles.length)) === J([3, 5]), sides0 && J('missing' in sides0 ? sides0 : [sides0.A.name, sides0.B.name]));
let act0 = null;
if (sides0 && !('missing' in sides0)) act0 = I.seamActAt(record, seam0, [], 0, sides0.A.spaces[0].roles[0].id, sides0.B.spaces[0].roles[0].id);
const img0 = act0 && act0.taken ? I.identificationImageOf(formOf(bornTorus, lifted), record, [{ formId: bornTorus.shape.id, seam: 0, transports: act0.transports }]) : null;
check('§2 ★★ THE ACT (C-11a\'s, at the seam): the first role of State pointed at the first role of Moment is TAKEN — one transport between the two corners — and the merged corner\'s child has one identity: 19 roles became 18 (the pushout over e); k stays 0 (this record holds no relating on the square\'s media — said)', !!act0 && act0.taken && act0.transports.length === 1 && J(act0.transports[0].corners.map(lab)) === J(['State', 'Moment']) && !!img0 && img0.state === 'identified' && img0.corners[0].identities === 1 && img0.corners[0].roles === 18 && img0.transportsGiven === 1 && img0.k === 0, J(act0 && (act0.taken ? act0.transports.map((t) => [t.corners.map(lab), t.roles.length]) : act0)));
const htmlAct = img0 ? render(img0, [{ formId: bornTorus.shape.id, seam: 0, transports: act0.transports }]) : '';
check('§2 the section with the act standing: the corner `· 1 made one by the seam`, the seam\'s line with its one hand `withdraw`, the other seam still `no transport yet`', /data-image-corner-made-one="1"/.test(htmlAct) && (htmlAct.match(/data-image-seam-line=/g) || []).length === 1 && (htmlAct.match(/data-image-seam-withdraw=/g) || []).length === 1 && (htmlAct.match(/data-image-seam-empty/g) || []).length === 1, visibleText(htmlAct).slice(0, 300));
const withdrawn0 = act0 && act0.taken ? I.seamWithdrawLine(record, seam0, act0.transports, 0, sides0.A.spaces[0].roles[0].id) : null;
check('§2 the one hand: the whole line-pair withdrawn — nothing standing', withdrawn0 !== null && withdrawn0.length === 0, J(withdrawn0));

// ═══ §3 F-D19b — the band over the record with his relatings added ═══
console.log('\n----- §3 F-D19b: the band (abcB) — one seam act makes two instances one and opens a path; k by two readers -----');
const faceOf = (shape) => shape.faces[0];
const sq = faceOf(lifted.shape); const n = sq.vertexIds.length;
const slotEdge = (s) => edgeBetween(lifted.shape.edges, sq.vertexIds[s], sq.vertexIds[(s + 1) % n]);
const eA = slotEdge(0); const eB = slotEdge(2); // State→Cessation ~ Thoroughgoing determination→Moment (the torus's seam 0)
const recEdge = (e) => record.edges.find((x) => x.id === e.id);
const roleAt = (v, i = 0) => { const s = childSpaceOf(record, v); return s && s.roles[i] ? s.roles[i].id : null; };
const [vS, vC] = recEdge(eA).vertexIds; const [vT, vM] = recEdge(eB).vertexIds;
// a face through b in the record — its third corner Z′ — and a face through a (to see a's own views hold no leg)
const facesB = RS.facesThrough(record, recEdge(eB)).filter((f) => f.vertexIds.length === 3);
const Zp = facesB.length ? facesB[0].vertexIds.find((v) => v !== vT && v !== vM) : null;
const s1 = roleAt(vS); const c1 = roleAt(vC); const t1 = roleAt(vT); const m1 = roleAt(vM); const z1 = Zp ? roleAt(Zp) : null;
note(`the band's seam: a ${lab(vS)}→${lab(vC)} (stored ${recEdge(eA).vertexIds.map(lab).join(',')}) ~ b ${lab(vT)}→${lab(vM)} (stored ${recEdge(eB).vertexIds.map(lab).join(',')}) · a face through b: ${facesB.length ? facesB[0].vertexIds.map(lab).join('·') : 'none'} · roles ${J([s1, c1, t1, m1, z1])}`);
const oriented = (edge, from, x, to, y, mode = 'IS') => (edge.vertexIds[0] === from ? REL.relating(mode, x, y, '+', REL.ALONG) : REL.relating(mode, y, x, '+', REL.ALONG));
const withOn = (shape, edge, r) => ({ ...shape, edges: shape.edges.map((e) => (e.id === edge.id ? REL.withRelating(e, r) : e)) });
let rec2 = record;
if (s1 && c1 && t1 && m1 && z1) {
  rec2 = withOn(rec2, recEdge(eA), oriented(recEdge(eA), vS, s1, vC, c1)); // i on a: his pairing s1 ≡ c1 — OWN (a's faces hold no leg)
  rec2 = withOn(rec2, recEdge(eB), oriented(recEdge(eB), vT, t1, vM, m1)); // j on b: t1 ≡ m1
  rec2 = withOn(rec2, edgeBetween(rec2.edges, vT, Zp), oriented(edgeBetween(rec2.edges, vT, Zp), vT, t1, Zp, z1)); // the legs through Z′: t1 ≡ z1′ · z1′ ≡ m1 — j is the face's through Z′
  rec2 = withOn(rec2, edgeBetween(rec2.edges, Zp, vM), oriented(edgeBetween(rec2.edges, Zp, vM), Zp, z1, vM, m1));
}
const edgeIn = (shape, id) => shape.edges.find((e) => e.id === id);
const sortA = SO.sortingOf(rec2, edgeIn(rec2, eA.id), {}, []); const sortB = SO.sortingOf(rec2, edgeIn(rec2, eB.id), {}, []);
const keyI = s1 && c1 ? SO.relKey(oriented(recEdge(eA), vS, s1, vC, c1)) : null;
const keyJ = t1 && m1 ? SO.relKey(oriented(recEdge(eB), vT, t1, vM, m1)) : null;
check('§3 BEFORE the identification (D18\'s values on the record): i = s1 ≡ c1 on a is OWN (its value empty — a\'s faces hold no leg); j = t1 ≡ m1 on b is THE FACE\'S through Z′ (its value holds Z′)', !!sortA && !!sortB && J(sortA.values.get(keyI)) === J([]) && (sortB.values.get(keyJ) || []).length === 1 && sortB.values.get(keyJ)[0] === Zp, J({ i: sortA && sortA.values.get(keyI), j: sortB && sortB.values.get(keyJ) }));
const bandShape = CI.identify(lifted.shape, [eA.id], [eB.id], 'preserving').shape;
const bandForm = { shape: bandShape, opId: 'glue-cylinder', provenance: 'Glue → Cylinder (abcB)', parentShape: lifted.shape };
const band0 = I.identificationImageOf(bandForm, rec2, []);
check('§3 the band: ONE seam (preserving, crossing the stored ends), TWO merged corners — {State, Moment} and {Cessation, Thoroughgoing determination} — its medium holds i from a and j from b, not yet one (no transport)', band0.state === 'identified' && band0.seams.length === 1 && band0.seams[0].mode === 'preserving' && band0.seams[0].crossed && band0.corners.length === 2 && band0.media[0].fromA === 1 && band0.media[0].fromB === 1 && band0.media[0].joined === 0 && band0.k === 0, J(band0.state === 'identified' ? { seams: band0.seams.map((s) => [s.mode, s.crossed, s.a.corners.map(lab), s.b.corners.map(lab)]), corners: band0.corners.map((c) => c.members.map((m) => m.label)), medium: band0.media[0] && [band0.media[0].fromA, band0.media[0].fromB, band0.media[0].joined], k: band0.k } : band0));
const actBand = band0.state === 'identified' ? I.seamActAt(rec2, band0.seams[0], [], 0, s1, m1) : null;
const bandRecords = actBand && actBand.taken ? [{ formId: bandShape.id, seam: 0, transports: actBand.transports }] : [];
const band1 = actBand && actBand.taken ? I.identificationImageOf(bandForm, rec2, bandRecords) : null;
check('§3 ★★ THE ACT s1 ~ m1 at State ~ Moment is TAKEN and FORCES c1 ~ t1 at Cessation ~ Thoroughgoing determination (the whole line-pair, descent at the door): two transports, each corner one identity', !!actBand && actBand.taken && actBand.transports.length === 2 && !!band1 && band1.state === 'identified' && J(band1.corners.map((c) => c.identities)) === J([1, 1]), J(actBand && (actBand.taken ? actBand.transports.map((t) => [t.corners.map(lab), t.roles]) : actBand)));
const bandMedium = band1 && band1.state === 'identified' ? band1.media[0] : null;
const imageEdgeA = band1 && band1.state === 'identified' ? band1.image.edges.find((e) => e.id === eA.id) : null;
const sortImage = imageEdgeA ? SO.sortingOf(band1.image, imageEdgeA, {}, []) : null;
const iKeyAfter = band1 && band1.state === 'identified' ? SO.relKey(band1.media[0].relatings[0]) : null;
const byPaths = sortImage ? sortImage.views.filter((v) => v.paths.some((p) => p.reading === 'COMPOSED' && (p.directs || [p.direct]).includes(iKeyAfter))).map((v) => v.view) : null;
check('§3 ★★ F-D19b — k BY TWO READERS: under the identification with its one act, i and j are ONE relating of the joined medium (joined 1, no discordance), and i\'s value went from empty to {Z′} — k = 1 by D18\'s values; and the image\'s sorting on the joined edge has a COMPOSED path through Z′ whose direct is that relating — the same one instance by the paths', !!bandMedium && bandMedium.joined === 1 && bandMedium.discordances.length === 0 && bandMedium.relatings.length === 1 && band1.k === 1 && band1.kDetail.length === 1 && J(band1.kDetail[0].after) === J([Zp]) && !!byPaths && byPaths.length === 1 && byPaths[0] === Zp, J({ medium: bandMedium && [bandMedium.fromA, bandMedium.fromB, bandMedium.joined, bandMedium.relatings.length], k: band1 && band1.k, detail: band1 && band1.kDetail, byPaths }));
const htmlBand = band1 && band1.state === 'identified' ? render(band1, bandRecords) : '';
check('§3 the section says it: `under this identification 1 relating is also through the seam`; the medium `1 relating on State–Cessation, 1 on Moment–Thoroughgoing determination — 1 one through the seam`', /data-image-k="1"/.test(htmlBand) && /under this identification 1 relating is also through the seam/.test(visibleText(htmlBand)) && /1 one through the seam/.test(visibleText(htmlBand)), visibleText(htmlBand).slice(0, 500));

// ═══ §4 F-D19c — the join's direction on the band and the twist ═══
console.log('\n----- §4 F-D19c: a directed relating and its counterpart on the band and on the twist — the crossing decides, measured and said -----');
// the record with the mode relatings ALONE on the two edges (no pairing on them — a pairing beside a mode relating on one pair would be D4's
// word discordance across the seam too, true but not the question here): `s1 carries c1` on a and `t1 carries m1` on b, each said from its
// edge's first stored corner — the same word, the same way in each edge's own order
let rec3 = record;
if (s1 && c1 && t1 && m1) {
  rec3 = withOn(rec3, recEdge(eA), oriented(recEdge(eA), vS, s1, vC, c1, 'carries'));
  rec3 = withOn(rec3, recEdge(eB), oriented(recEdge(eB), vT, t1, vM, m1, 'carries'));
}
// two acts per seam — the pair at each corner pair (no IS on the edges, so no line forces the other corner)
const twoActs = (rec, img, pairs) => { let standing = []; for (const [i, x, y] of pairs) { const a = I.seamActAt(rec, img.seams[0], standing, i, x, y); if (!a.taken) return { taken: false, refusal: a }; standing = a.transports; } return { taken: true, transports: standing }; };
const actBand3 = band0.state === 'identified' ? twoActs(rec3, band0, [[0, s1, m1], [1, c1, t1]]) : null;
const band3 = actBand3 && actBand3.taken ? I.identificationImageOf(bandForm, rec3, [{ formId: bandShape.id, seam: 0, transports: actBand3.transports }]) : null;
const twistShape = CI.identify(lifted.shape, [eA.id], [eB.id], 'reversing').shape;
const twistForm = { shape: twistShape, opId: 'flip-glue-mobius', provenance: 'Flip-glue → Möbius (abcb)', parentShape: lifted.shape };
const twist0 = I.identificationImageOf(twistForm, rec3, []);
const twistPairs = twist0.state === 'identified' ? (twist0.seams[0].b.corners[0] === vT ? [[0, s1, t1], [1, c1, m1]] : [[0, s1, m1], [1, c1, t1]]) : [];
const actTwist = twist0.state === 'identified' ? twoActs(rec3, twist0, twistPairs) : null;
const twist3 = actTwist && actTwist.taken ? I.identificationImageOf(twistForm, rec3, [{ formId: twistShape.id, seam: 0, transports: actTwist.transports }]) : null;
const dirDisc = (img) => (img && img.state === 'identified' ? img.media[0].discordances.filter((d) => d.kind === 'direction') : null);
check('§4 ★★ THE BAND (abcB, preserving — on the single-face word path its pairing CROSSES the stored ends: State ~ Moment, Cessation ~ Thoroughgoing determination): `s1 carries c1` meets `t1 carries m1` RUN THE OTHER WAY in a\'s stored order — a discordance of the DIRECTION, both kept, shown (the record carries no lexicon: a converse cannot be read)', !!band3 && band3.state === 'identified' && band3.seams[0].crossed && dirDisc(band3).length === 1 && band3.media[0].discordances.length === 1 && band3.media[0].relatings.filter((r) => r[0] === 'carries').length === 2 && band3.media[0].joined === 0, J(band3 && band3.state === 'identified' ? { crossed: band3.seams[0].crossed, discordances: band3.media[0].discordances.map((d) => [d.kind, d.a, d.b]) } : band3));
check('§4 ★★ THE TWIST (abcb, reversing — its pairing runs PARALLEL to the stored ends: State ~ Thoroughgoing determination, Cessation ~ Moment): the same two records meet ALIGNED — one relating, no discordance. So on this path the ruling\'s F-D19c reads the other way round — the discordance follows the CROSSING of the ends, which the frozen module ties to `reversing` on the general path and to `preserving` on the single-face word path (measured here; the orientability sign itself is the cargo\'s, §5 of the cargo witness)', !!twist3 && twist3.state === 'identified' && !twist3.seams[0].crossed && twist3.seams[0].mode === 'reversing' && dirDisc(twist3).length === 0 && twist3.media[0].joined >= 1, J(twist3 && twist3.state === 'identified' ? { crossed: twist3.seams[0].crossed, mode: twist3.seams[0].mode, joined: twist3.media[0].joined, discordances: twist3.media[0].discordances.length } : twist3));
const band3sym = actBand3 && actBand3.taken ? I.identificationImageOf(bandForm, rec3, [{ formId: bandShape.id, seam: 0, transports: actBand3.transports }], { converses: [['carries', 'carries']], opaque: [] }) : null;
check('§4 ★ A SYMMETRIC MODE DISSOLVES THE BAND\'S DISCORDANCE (the ruling\'s clause): with `carries` declared its own converse the two records are one relating', !!band3sym && band3sym.state === 'identified' && dirDisc(band3sym).length === 0 && band3sym.media[0].discordances.length === 0 && band3sym.media[0].joined === 1 && band3sym.media[0].relatings.length === 1, J(band3sym && band3sym.state === 'identified' ? [band3sym.media[0].joined, band3sym.media[0].discordances.length] : band3sym));
const htmlBand3 = band3 && band3.state === 'identified' ? render(band3, [{ formId: bandShape.id, seam: 0, transports: actBand3.transports }]) : '';
check('§4 the section shows the discordance of the direction in words, with the lexicon\'s absence said', /data-image-discordance="direction"/.test(htmlBand3) && /run the other way — a discordance of the twist \(a converse cannot be read here: the record the lift carried holds no lexicon\)/.test(visibleText(htmlBand3)), visibleText(htmlBand3).slice(0, 600));

// ═══ §5 F-D19d — the sub-case on the doors witness's prism ═══
console.log('\n----- §5 F-D19d: IS-only — the merged corner\'s child IS the pushout over e, role for role, over the 42 × 42 door pairs -----');
const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json');
const inv = (m) => { const o = new Map(); for (const [k, v] of m) o.set(v, k); return o; };
const toMap = (o) => new Map(Object.entries(o));
const HAND_TF = { A: { r9: 'F8', r1: 'F7', r0: 'F1', r2: 'F12', r8: 'F13' }, "B'": { r9: 'F3', r1: 'F9', r0: 'F5', r7: 'F13', r8: 'F1', r2: 'F7' }, C: { r9: 'F12', r1: 'F13', r0: 'F9', r6: 'F1', r2: 'F3' }, D: { r9: 'F12', r1: 'F1', r0: 'F2', r7: 'F7', r2: 'F5' }, S1: { r0: 'F13', r1: 'F9', r2: 'F1', r4: 'F12', r6: 'F3', r8: 'F7' }, S4: { r0: 'F13', r1: 'F9', r2: 'F1', r6: 'F3', r7: 'F5', r8: 'F7' }, S2: { r0: 'F9', r1: 'F3', r2: 'F13', r6: 'F10', r7: 'F5', r8: 'F12' } };
const HAND_TP = { P: { r0: 'Φ1', r1: 'Φ2', r2: 'Φ7', r4: 'Φ5', r6: 'Φ3' }, Q: { r9: 'Φ6', r1: 'Φ1', r0: 'Φ8', r7: 'Φ5', r6: 'Φ2' }, R: { r0: 'Φ1', r1: 'Φ6', r7: 'Φ5', r2: 'Φ7', r4: 'Φ8' } };
const J_FP = { '(i)': { F7: 'Φ1', F8: 'Φ2', F5: 'Φ7' }, '(ii)': { F1: 'Φ3', F2: 'Φ2', F3: 'Φ4', F5: 'Φ1' } };
const facesJ = {};
for (const fp of Object.keys(J_FP)) for (const tf of Object.keys(HAND_TF)) for (const tp of Object.keys(HAND_TP)) facesJ[`${fp}+${tf}+${tp}`] = [inv(toMap(HAND_TF[tf])), toMap(HAND_TP[tp]), inv(toMap(J_FP[fp]))];
const names = Object.keys(facesJ);
const seedV = (id, castX) => ({ id, position: [0, 0, 0], data: { label: id, notes: '', color: '#000', tags: [], custom: {}, cast: castX }, createdBy: { shapeId: 'prism', operation: 'seed', sourceVertexIds: [] } });
const prism = { id: 'prism', name: 'the prism', vertices: { F: seedV('F', flow), T: seedV('T', tcell), 'Φ': seedV('Φ', phi), "F'": seedV("F'", flow), "T'": seedV("T'", tcell), "Φ'": seedV("Φ'", phi) }, edges: [], faces: [], cells: [], generations: [], genealogy: { parentShapeId: null } };
let doors = 0; let taken = 0; let roleForRole = 0; const departures = [];
for (const na of names) for (const nb of names) {
  doors += 1;
  const A = D.sideFrom(['F', 'T', 'Φ'], [flow, tcell, phi], facesJ[na], 'F·T·Φ');
  const B = D.sideFrom(["F'", "T'", "Φ'"], [flow, tcell, phi], facesJ[nb], "F'·T'·Φ'");
  const act = D.actAt(A, B, [], 0, 'F1', 'F1');
  if (!act.taken) continue;
  taken += 1;
  const e0 = act.e[0];
  const push = I.pushoutChildOf(prism, ['F', "F'"], act.transports);
  const expected = flow.roles.length * 2 - e0.size;
  const pairsOne = [...e0].every(([x, y]) => { const r = push.space.roles.find((z) => z.id === `${x}@F`); return !!r && /≡/.test(r.label || '') && !push.space.roles.some((z) => z.id === `${y}@F'`); });
  if (push.space.roles.length === expected && push.identities === e0.size && pairsOne) roleForRole += 1;
  else if (departures.length < 5) departures.push(`${na} ~ ${nb}: roles ${push.space.roles.length} vs ${expected} · identities ${push.identities} vs ${e0.size} · pairs ${pairsOne}`);
}
note(`F-D19d: ${doors} door pairs · the act F1 ↦ F1 at F taken on ${taken} · the pushout role for role on ${roleForRole}`);
check(`§5 ★★ F-D19d THE SUB-CASE: on every door of the 42 × 42 where F1 ↦ F1 at F is taken (${taken}), the merged corner's child under the door's e has 14 + 14 − |e_F| roles, |e_F| identities, and every pair of e is ONE role labelled with both sentences — the door model's pushout, role for role`, doors === 1764 && taken > 0 && roleForRole === taken, departures.join(' ⏎ '));

// ═══ §6 the surface ═══
console.log('\n----- §6 the surface: a born identification routes to its own section; the drawing on the image record -----');
const view = readLf('src/manuscript/ManuscriptView.tsx');
check('§6 ★ THE CARD ROUTES a born identification to IdentificationImageSection BEFORE the lift\'s section (the line `holds no concept-space` would be false for it), hands it the page store\'s seam records and the acts through the door model, and draws a picked merged corner on the IMAGE record through the one resolver', /image && image\.state === 'identified' && onConceptPick && onSeamAct && onSeamWithdraw \? \(/.test(view) && /identificationImageOf\(entry\.form, record, seamRecords, facts\)/.test(view) && /seamActAt\(img\.record, img\.seams\[seam\]/.test(view) && /<CastInsidePanel shape=\{identificationImage\.image\} vertexId=/.test(view));
const store = readLf('src/manuscript/pageStore.ts'); const snap = readLf('src/manuscript/pageSnapshot.ts');
check('§6 ★ THE RECORD, NOT THE READING: the page store keeps the seam transports (replaced whole per seam; a removed form\'s go with it; a seam act marks the page unsaved) and the page file carries them as an additive field read as absent on earlier files; nothing of the image is stored', /recordSeamTransports: \(formId, seam, transports\) =>/.test(store) && /seamRecords: s\.seamRecords\.filter\(\(r\) => r\.formId !== entry\.form\.shape\.id\)/.test(store) && /s\.seamRecords\.map\(\(r\) => \[r\.formId, r\.seam/.test(store) && /seamRecords: Array\.isArray\(file\.seamRecords\) \? file\.seamRecords : \[\]/.test(snap) && /seamRecords: records\.seamRecords,/.test(snap) && !/image:/.test(snap));

// ═══ §7 M2 — the lexicon's facts ride the lift FILE (the snapshot spend, e0dedd8) ═══
console.log('\n----- §7 M2: the lift file carries the lexicon\'s facts — the band\'s discordance dissolves THROUGH A FILE; a file saved before the spend says the absence -----');
{
  const SN = req('src/playground/snapshot.ts');
  const facts = { converses: [['carries', 'carries']], opaque: [] };
  const fileWith = SN.serializeSnapshot(rec3, 'u-m2', [], 'the source universe', facts);
  const fileWithout = SN.serializeSnapshot(rec3, 'u-m2', [], 'the source universe');
  const loadedWith = SN.deserializeSnapshot(fileWith); const loadedWithout = SN.deserializeSnapshot(fileWithout);
  check('§7 ★★ THE FILE CARRIES THE FACTS exactly when the writer hands them: `lexicon` on the file and on the loaded form deep-equal to the store\'s facts; a file written without them has NO slot (byte-shaped as before) and loads with none — a true absence, never fabricated', J(fileWith.lexicon) === J(facts) && J(loadedWith.lexicon) === J(facts) && !('lexicon' in fileWithout) && !('lexicon' in loadedWithout), J([fileWith.lexicon, loadedWith.lexicon, 'lexicon' in fileWithout]));
  const malformed = { ...fileWith, lexicon: { converses: 'carries', opaque: [] } };
  check('§7 a malformed slot is not carried and not touched (the load never lies, never fabricates): the loaded form holds no lexicon; the file keeps what lay there', !('lexicon' in SN.deserializeSnapshot(malformed)) && malformed.lexicon.converses === 'carries');
  const viaFile = actBand3 && actBand3.taken ? I.identificationImageOf(bandForm, rec3, [{ formId: bandShape.id, seam: 0, transports: actBand3.transports }], loadedWith.lexicon) : null;
  const viaOld = actBand3 && actBand3.taken ? I.identificationImageOf(bandForm, rec3, [{ formId: bandShape.id, seam: 0, transports: actBand3.transports }], loadedWithout.lexicon ?? null) : null;
  check('§7 ★★ THE FALSIFIER (the mothership\'s M2): `carries` declared its own converse in the store, carried by the lift file and read OFF THE FILE — the band\'s discordance of the direction DISSOLVES into one relating (`lexiconCarried` true); the same act over a file saved before the spend keeps the discordance and says the absence (`lexiconCarried` false)', !!viaFile && viaFile.state === 'identified' && viaFile.lexiconCarried === true && viaFile.media[0].discordances.length === 0 && viaFile.media[0].joined === 1 && !!viaOld && viaOld.state === 'identified' && viaOld.lexiconCarried === false && dirDisc(viaOld).length === 1, J([viaFile && viaFile.state, viaFile && viaFile.lexiconCarried, viaOld && viaOld.lexiconCarried]));
  const htmlVia = viaFile && viaFile.state === 'identified' ? render(viaFile, [{ formId: bandShape.id, seam: 0, transports: actBand3.transports }]) : '';
  const htmlOld = viaOld && viaOld.state === 'identified' ? render(viaOld, [{ formId: bandShape.id, seam: 0, transports: actBand3.transports }]) : '';
  check('§7 the section: through the file no discordance line and no absence clause; over the older file the discordance with the absence said', !/data-image-discordance/.test(htmlVia) && !/holds no lexicon/.test(htmlVia) && /data-image-discordance="direction"/.test(htmlOld) && /a converse cannot be read here: the record the lift carried holds no lexicon/.test(visibleText(htmlOld)));
  const storeSrc = readLf('src/store/geometryStore.ts');
  check('§7 ★ THE WRITERS: every lift site in the store hands the facts to the file — six `serializeSnapshot(…)` calls, six `lexiconFactsOf(get())`, the facts the store holds (`converses`, `opaque`) and nothing else', (storeSrc.match(/serializeSnapshot\(/g) || []).length === 6 && (storeSrc.match(/lexiconFactsOf\(get\(\)\)/g) || []).length === 6 && /const lexiconFactsOf = \(s: \{ converses: Array<\[string, string\]>; opaque: string\[\] \}\): SnapshotLexicon => \(\{ converses: s\.converses, opaque: s\.opaque \}\);/.test(storeSrc));
  check('§7 ★ THE READER: the view hands the image the facts off the shelf item that placed the parent (`entry.loaded.lexicon`, the frozen loader\'s own output) — null on an older file', /const parentItem = shelf\.find\(\(s\) => s\.entry\.loaded\.shape\.id === entry\.form\.parentShape\?\.id\);\n\s*const facts = parentItem\?\.entry\.loaded\.lexicon \?\? null;\n\s*return identificationImageOf\(entry\.form, record, seamRecords, facts\);/.test(view));
}

console.log(`\nDIAGNOSE-THE-IDENTIFICATION-IMAGE: ${failures === 0 ? 'ALL PASS — the record\'s children are carried through the seams, met where the person says; the image is derived at every read' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
