#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// THE LEGS CARRIED — GROUP 4 · slice 5b (ADR 0031 §9.76 (2), the researcher's 11:27, ratified — claims §512; the mothership's 10-27 STAMP on Arman's Δ251 "fable is back.
// begin"; slice 6 struck, Δ250). THICKEN: two copies read the same record — every corner's two levels read its space, every edge's two copies read the edge's relatings;
// the SEGMENT LEG between a corner's two levels is a construction leg of D14's kind carrying the identity: the cargo crosses it as itself, an IS act on it is refused as
// carried (§9.10), a mode relating on it is an ordinary entry. REFINE is carry: a midpoint corner reads the subdivided edge's child, its two half-edges the coordinate legs;
// a chord across a face holds nothing; the parts of a split face read the parent's records where the apex and the end survive. The falsifiers: §9.76 (6)'s Thicken and
// Chord lines. On the 19:54 record (the band on the page's own route — the store's thicken, the shelf, the load, the placing) and the Property record (the chord).
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
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const { invokePrimitive } = req('src/manuscript/writtenFormModel.ts');
const B = req('src/manuscript/bornRecordModel.ts');
const SR = req('src/lib/surfaceRefinement.ts');
const T = req('src/lib/transport.ts');
const { edgeKind, copySourceOf } = req('src/lib/spaceOf.ts');
const { edgeBetween, edgeNameOf } = req('src/lib/faceReading.ts');
const { instancesWithInherited } = req('src/lib/instanceSpace.ts');
/** an edge's content as the medium holds it (B1): his relatings and bars, and the inherited IS (D15) — on these records the octahedron's edges hold the inherited IS alone */
const contentOf = (shape, e) => (e ? instancesWithInherited(shape, e).length + REL.barsOn(e).length : null);
const REL = req('src/lib/relatings.ts');
const P = req('src/lib/isPredicate.ts');
const WR = req('src/lib/walkRoutes.ts');
const ALT = req('src/lib/altitude.ts');
const { liftedConceptOf } = req('src/manuscript/liftedConceptModel.ts');
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
console.log('THE LEGS CARRIED — §9.76 (2): thicken (two copies, the segment leg the identity) and refine (the midpoint the edge\'s child, the half-edges legs, the chord nothing)\n');
const S = () => useGeometryStore.getState();
const sh = () => S().shapes[S().currentShapeId];
const R1954 = 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json';
const PROPERTY = 'scripts/fixtures/altitude/property-export-with-the-coders-generation-2-acts_for-the-eye.workspace.json';
const importOf = (f) => S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, f), 'utf8')));
const lift = (sel) => { S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection(); for (const x of sel) S().toggleLiftSelection(x); const before = useLiftStore.getState().queue.length; S().liftSelectionToManuscript(); return loadUniverseSnapshot(useLiftStore.getState().queue[before].file); };
const lab = (shape, v) => shape.vertices[v]?.data.label || v;
const roleIds = (record, v) => (T.transportSpaceOf(record, v)?.space.roles ?? []).map((r) => r.id);

// ═══ §0 THE BAND ON THE PAGE'S OWN ROUTE: the store's thicken, the shelf, the load, the placing — read by the chain through its base ═══
importOf(R1954);
const G = sh();
const relOn = (a, b) => { const e = edgeBetween(G.edges, a, b); return e ? REL.relatingsOn(e).length : -1; };
// a face of the gen-1 CORE (the octahedron): three children for corners, three medial edges holding his pairings — the face the eye lifts too (the core cell lists these faces)
const tri = G.faces.find((f) => f.vertexIds.length === 3 && f.vertexIds.every((v) => G.vertices[v].createdBy.operation !== 'seed') && J(f.vertexIds.map((v) => lab(G, v)).sort()) === J(['Accumulation', 'Finance–Consumption', 'Livelihood']));
// HIS PAIR on a medial edge of the face, given at the Ambo by the page's own act before the lift (on the 19:54 record the octahedron's edges hold nothing of his yet; his
// 15 relatings stand on the seed edges, which are not the lifted face's edges): the first pair the one predicate takes, measured by the edge's instances after the act
const { columnSpaceOf } = req('src/lib/instanceSpace.ts'); const { instancesOn } = REL;
let given = null;
for (let k = 0; k < 3 && !given; k += 1) {
  const e = edgeBetween(G.edges, tri.vertexIds[k], tri.vertexIds[(k + 1) % 3]);
  const cA = columnSpaceOf(G, e.vertexIds[0]); const cB = columnSpaceOf(G, e.vertexIds[1]);
  if (!cA || !cB) continue;
  for (const x of cA.roles) { for (const y of cB.roles) { S().giveRolePair(e.id, x.id, y.id); const now = sh().edges.find((z) => z.id === e.id); if (instancesOn(now).length > 0) { given = { edge: e.id, x: x.id, y: y.id, instances: instancesOn(now).length }; break; } } if (given) break; }
}
note(`§0 the face ${tri.vertexIds.map((v) => lab(G, v)).join(' · ')} — his pair given at the Ambo on one of its sides: ${J(given)}`);
const eT = lift([{ kind: 'face', id: tri.id }]); const base = placeShelfEntry(eT, 0);
const seg = invokePrimitive('segment', 1);
const qBefore = useLiftStore.getState().queue.length;
const minted = S().thickenManuscript(base.shape, seg.shape);
const file = useLiftStore.getState().queue[qBefore].file;
const eB = loadUniverseSnapshot(file); const band = placeShelfEntry(eB, 2);
const forms = new Map([[base.shape.id, base], [band.shape.id, band]]);
const entries = new Map([[base.shape.id, eT], [band.shape.id, eB]]);
const ctx = { carriedOf: (id) => entries.get(id)?.loaded.ancestors ?? [], formOf: (id) => forms.get(id) ?? null, seamRecords: [], factsOf: () => null, recordsOf: () => null, rulesOf: () => null, sourceOf: (id) => entries.get(id)?.loaded.provenance.source ?? null };
const Fb = B.formRecordOf(band, ctx);
const Fbase = B.formRecordOf(base, ctx);
const img = Fb.state === 'read' ? Fb.record : null;
const record = Fbase.state === 'read' ? Fbase.record : null;
const copies = Object.values(band.shape.vertices);
const copyRows = img && record ? copies.map((v) => { const s = copySourceOf(img, v.id); return [lab(img, v.id), s ? lab(record, s) : null, roleIds(img, v.id).length, s ? roleIds(record, s).length : null]; }) : [];
check('§0 ★★★ THE BAND ON THE PAGE\'S ROUTE READS ITS BASE\'S RECORD (§9.76 (2): both copies read the same): the triangle lifted and placed, the page\'s own Segment invoked, the store\'s `thickenManuscript` minting the band onto the shelf (its file carrying the base shape alone, its ids prefixed by the base\'s id — D8), the band loaded and placed as a LOADED form (opId null); the chain reads it through its base form on the page (`sourceOf` the file\'s source, which IS the base\'s shape id) — `via: provenance`, one act `thicken → <the band>`, the root the universe; every corner of the band a COPY on the image (`product`, one source) reading its source\'s space — the same roles, twice',
  !!minted && band.opId === null && band.shape.genealogy.operation === 'product' && Fb.state === 'read' && Fb.via === 'provenance' && Fb.acts.length === 1 && /^thicken → .+ × I$/.test(Fb.acts[0]) && Fb.rootName === record.name && copies.length === 2 * Object.keys(base.shape.vertices).length && copyRows.every(([, s, a, b]) => s !== null && a === b && a > 0),
  { via: Fb.state === 'read' ? Fb.via : Fb.reason, acts: Fb.state === 'read' ? Fb.acts : null, copies: copyRows.length, rows: copyRows.slice(0, 4) });

// ═══ §1 THE COPIED EDGES read the record's edge between their sources; the segment legs hold nothing ═══
const copySrcOf = (v) => band.shape.vertices[v].createdBy.sourceVertexIds[0].replace(`${eB.loaded.provenance.source}:`, '');
const edgeRows = img ? band.shape.edges.map((e) => { const ie = img.edges.find((x) => x.id === e.id); const [a, b] = e.vertexIds.map(copySrcOf); const segment = a === b; const re = segment ? null : edgeBetween(record.edges, a, b); return { id: e.id.slice(-14), segment, image: ie ? contentOf(img, ie) : null, bars: ie ? REL.barsOn(ie).length : null, record: re ? contentOf(record, re) : null, recordBars: re ? REL.barsOn(re).length : null, held: ie ? ie.identification !== undefined || ie.data !== undefined : null }; }) : [];
const copied = edgeRows.filter((r) => !r.segment); const legs = edgeRows.filter((r) => r.segment);
check('§1 ★★ EVERY EDGE BECOMES TWO COPIES, EACH READING THE EDGE\'S RELATINGS AND BARS: each copied edge on the image holds exactly the record edge between its sources\' content — his relatings and bars, and the inherited IS (D15, read through the copies as through their sources; on these records the octahedron\'s edges hold the inherited IS alone — carried, not zero everywhere); the SEGMENT LEGS (both ends copies of one corner) hold nothing — no relating, no record, structure read by `segmentOf`',
  copied.length === 2 * base.shape.edges.length && copied.every((r) => r.image === r.record && r.bars === r.recordBars) && copied.some((r) => r.image > 0) && legs.length === Object.keys(base.shape.vertices).length && legs.every((r) => r.image === 0 && r.held === false),
  { copied: copied.length, withContent: copied.filter((r) => r.image > 0).length, sample: copied.filter((r) => r.image > 0).slice(0, 2), legs: legs.length });

// ═══ §2 THE SEGMENT LEG: the identity — the step, the ground, the ways; unprinted in a route's words ═══
const legEdge = band.shape.edges.find((e) => copySrcOf(e.vertexIds[0]) === copySrcOf(e.vertexIds[1]) && roleIds(img, e.vertexIds[0]).length > 1);
const [c0, c1] = legEdge.vertexIds; const roles = roleIds(img, c0);
const step = T.transportStepOf(img, c0, c1); const back = T.transportStepOf(img, c1, c0); const ground = T.transportGroundOf(img, c0, c1); const ways = T.transportWaysOf(img, c0, c1);
const identity = (m) => !!m && m.size === roles.length && roles.every((x) => m.get(x) === x);
const roadsOf = (w) => [...(w?.values() ?? [])].flat();
check('§2 ★★★ THE SEGMENT LEG CARRIES EVERY ROLE TO ITSELF (D14\'s kind, the ×I fibre\'s identity): `segmentOf` names the one corner both ends copy; the STEP across it is the identity on the corner\'s roles, both ways, and so is the GROUND (M1: structure, not his pair); the WAYS are one road per role with the wordless word `identity`, to itself; a route\'s words print nothing for it and it names no light (as the coordinate leg)',
  T.segmentOf(img, c0, c1) === copySrcOf(c0) && edgeKind(img, c0, c1) === 'medial' && identity(step) && identity(back) && identity(ground) && roadsOf(ways).length === roles.length && roadsOf(ways).every((r) => r.word === T.IDENTITY && !r.against) && roles.every((x) => ways.get(x)?.[0].to === x) && J(WR.wordsOf([T.IDENTITY, REL.IS])) === J([REL.IS_GLYPH]) && WR.isNamedWords([T.IDENTITY]) === false && WR.compositeOfSteps([{ word: T.IDENTITY, against: false }], []).kind === 'is',
  { leg: `${lab(img, c0)}–${lab(img, c1)}`, roles: roles.length, step: step && [...step].slice(0, 2), ways: roadsOf(ways).slice(0, 2) });

// ═══ §3 THE PREDICATE: an IS act across the leg refused as carried; a mode relating on it ordinary ═══
const same = P.isPairRefusalAt(img, c0, c1, roles[0], roles[0]);
const other = P.isPairRefusalAt(img, c0, c1, roles[0], roles[1]);
const copiedEdge = band.shape.edges.find((e) => copySrcOf(e.vertexIds[0]) !== copySrcOf(e.vertexIds[1]) && roleIds(img, e.vertexIds[0]).length > 0 && roleIds(img, e.vertexIds[1]).length > 0);
const onCopied = copiedEdge ? P.isPairRefusalAt(img, copiedEdge.vertexIds[0], copiedEdge.vertexIds[1], roleIds(img, copiedEdge.vertexIds[0])[0], roleIds(img, copiedEdge.vertexIds[1])[0]) : null;
const k = img.edges.findIndex((x) => x.id === legEdge.id);
const img2 = { ...img, edges: img.edges.map((x, i) => (i === k ? REL.withRelating(x, REL.relating('is laid out as', roles[0], roles[1], '+')) : x)) };
const ways2 = T.transportWaysOf(img2, c0, c1); const step2 = T.transportStepOf(img2, c0, c1);
const modeRoad = roadsOf(ways2).find((r) => r.word === 'is laid out as');
check('§3 ★★★ AN IS ACT ON THE LEG IS REFUSED AS CARRIED (§9.10, M1\'s words; the mechanism refuses, the surface never asks): `x ≡ x` across the thickness — `kind: carried`, the one role at both levels, `… is already carried across <A>–<B> as itself — the thickness holds it`; `x ≡ y` — carried too, the stone\'s form (`pairing them would make x and y one moment of <corner>`); the same predicate on a COPIED edge of two corners is not the carried kind; A MODE RELATING ON THE LEG IS AN ORDINARY ENTRY: given on it, it is a road beside the identity roads and the step (IS-only) is the identity still',
  !!same && same.kind === 'carried' && same.carried.same === true && /^.+ is already carried across .+ as itself — the thickness holds it$/.test(same.form)
    && !!other && other.kind === 'carried' && other.carried.same === false && /^not paired — the thickness carries .+ to itself and .+ to itself; pairing them would make .+ and .+ one moment of .+$/.test(other.form)
    && (!onCopied || onCopied.kind !== 'carried') && !!modeRoad && modeRoad.to === roles[1] && roadsOf(ways2).length === roles.length + 1 && identity(step2),
  { same: same && same.form.slice(0, 120), other: other && other.form.slice(0, 140), onCopied: onCopied && onCopied.kind, mode: modeRoad });

// ═══ §4 REFINE IS CARRY: a lifted edge subdivided at its midpoint — the new corner reads the edge's child, its half-edges the coordinate legs ═══
const medial = base.shape.edges.map((e) => ({ e, n: (() => { const r = edgeBetween(record.edges, e.vertexIds[0], e.vertexIds[1]); return r ? instancesWithInherited(record, r).length : 0; })() })).sort((a, b) => b.n - a.n)[0];
const bis = SR.bisectAcquiredComplex(base.shape, eT.loaded.ancestors ?? null, [medial.e.id]);
const mid = Object.values(bis.shape.vertices).find((v) => !base.shape.vertices[v.id]);
const refinedForm = { ...base, shape: bis.shape };
const Fr = B.formRecordOf(refinedForm, ctx);
const rimg = Fr.state === 'read' ? Fr.record : null;
const [u, w] = mid.createdBy.sourceVertexIds;
const childRoles = rimg ? roleIds(rimg, mid.id) : [];
const halves = rimg ? [[u, mid.id], [mid.id, w]].map(([a, b]) => ({ kind: edgeKind(rimg, a, b), toParent: T.transportStepOf(rimg, b === mid.id ? b : a, b === mid.id ? a : b), fromParent: T.transportStepOf(rimg, b === mid.id ? a : b, b === mid.id ? b : a), words: [...new Set(roadsOf(T.transportWaysOf(rimg, mid.id, a === mid.id ? b : a)).map((r) => r.word))] })) : [];
const LC = rimg ? liftedConceptOf(refinedForm, eT.loaded.ancestors ?? [], undefined, Fr) : null;
const midRow = LC && LC.state === 'read' ? LC.vertices.find((v) => v.id === mid.id) : null;
check('§4 ★★★ REFINE IS CARRY (§9.76 (2), the Chord falsifier\'s first half): the lifted form\'s medial edge with the most instances (his and the inherited IS) bisected by the page\'s own wordless bisection (the sew preparer\'s) — the midpoint stamped with the edge it subdivides (`sourceEdgeId`, the slice\'s cure of the disclosed inheritance) and its two ends; the chain reads the lift refined in place (`via: provenance`, one act) and the midpoint reads the EDGE\'S CHILD — one instance per relating on the edge; its two half-edges are CORNER edges, the coordinate map from the child to each parent (one coordinate per instance) and the roads from the child named `coordinate`; the card names the midpoint by its two parents and counts its roles',
  !!mid && mid.createdBy.sourceEdgeId === medial.e.id && medial.n > 0 && Fr.state === 'read' && Fr.via === 'provenance' && Fr.acts.length === 1 && childRoles.length === medial.n && halves.length === 2 && halves.every((h) => h.kind === 'corner' && !!h.toParent && h.toParent.size === medial.n && !!h.fromParent && h.words.length === 1 && h.words[0] === T.COORDINATE)
    && !!midRow && midRow.label === `${lab(record, u)}·${lab(record, w)}` && midRow.roles === medial.n,
  { edge: `${lab(record, u)}–${lab(record, w)}`, relatings: medial.n, childRoles: childRoles.length, halves: halves.map((h) => [h.kind, h.toParent && h.toParent.size, h.words]), card: midRow && [midRow.label, midRow.roles] });

// ═══ §5 THE CHORD HOLDS NOTHING; the parts of a split face read the parent's records only where the apex and the end survive ═══
importOf(PROPERTY);
const G2 = sh();
const sq = G2.faces.find((f) => f.vertexIds.length === 4);
const eQ = lift([{ kind: 'face', id: sq.id }]); const qform = placeShelfEntry(eQ, 3);
forms.set(qform.shape.id, qform); entries.set(qform.shape.id, eQ);
const face = qform.shape.faces[0];
const chorded = SR.subdivideFace(qform.shape, face, face.vertexIds[0], face.vertexIds[2]);
const chordE = chorded.shape.edges.find((e) => e.id === chorded.refinement.chordEdgeId);
const Fq = B.formRecordOf({ ...qform, shape: chorded.shape }, ctx);
const qrec = B.formRecordOf(qform, ctx).record;
const chordOnImage = Fq.state === 'read' ? Fq.record.edges.find((x) => x.id === chordE.id) : null;
// THE TRAP: a record edge between the chord's two corners (one added by hand, with a relating) must not be read as the chord's — the chord's source is the face
const trapRec = { ...qrec, edges: [...qrec.edges, REL.withRelating({ id: 'trap-edge', vertexIds: [chordE.vertexIds[0], chordE.vertexIds[1]], sourceVertexIds: [chordE.vertexIds[0], chordE.vertexIds[1]] }, REL.relating(REL.IS, roleIds(qrec, chordE.vertexIds[0])[0] ?? 'x', roleIds(qrec, chordE.vertexIds[1])[0] ?? 'y', '+'))] };
const trapped = B.provenanceRecordOf(trapRec, chorded.shape, [], 'refine');
const trappedChord = trapped.state === 'derived' ? trapped.image.edges.find((x) => x.id === chordE.id) : null;
const plainBorn = { ...chorded.shape, edges: chorded.shape.edges.map((e) => (e.id === chordE.id ? { id: e.id, vertexIds: e.vertexIds, sourceVertexIds: e.sourceVertexIds } : e)) };
const unmarked = B.provenanceRecordOf(trapRec, plainBorn, [], 'refine');
const unmarkedChord = unmarked.state === 'derived' ? unmarked.image.edges.find((x) => x.id === chordE.id) : null;
const altOn4 = G2.faces.filter((f) => f.vertexIds.length > 3).reduce((n, f) => n + [0, 1, 2, 3].reduce((m, kk) => m + ALT.altitudeHeld(f, kk).length, 0), 0);
const altOn3 = G2.faces.filter((f) => f.vertexIds.length === 3).reduce((n, f) => n + [0, 1, 2].reduce((m, kk) => m + ALT.altitudeHeld(f, kk).length, 0), 0);
check('§5 ★★ A CHORD ACROSS A FACE HOLDS NOTHING (§9.76 (2); the Chord falsifier\'s second half): the lifted square chorded by the page\'s own subdivide — the chord\'s source is the FACE it crosses (`sourceFaceId`, at both chord mints) — the chain reads the lift refined in place and the chord on the image holds no relating and no record; THE TRAP — a record edge between the chord\'s two corners, with a relating, added by hand: the chord still holds nothing (face-sourced, never resolved by its ends), while the same born edge without the face mark would read that edge (the control that the mark decides); the parts of the split face carry no altitude records on these records (Δ250: a square has no altitude — measured, none on any face with four corners, all on triangles)',
  !!chordE && chordE.sourceFaceId === face.id && Fq.state === 'read' && Fq.via === 'provenance' && !!chordOnImage && REL.relatingsOn(chordOnImage).length === 0 && chordOnImage.identification === undefined && chordOnImage.data === undefined
    && !!trappedChord && REL.relatingsOn(trappedChord).length === 0 && !!unmarkedChord && REL.relatingsOn(unmarkedChord).length === 1 && altOn4 === 0 && altOn3 > 0,
  { chord: chordE && chordE.id.slice(-12), via: Fq.state === 'read' ? Fq.via : Fq.reason, trapped: trappedChord && REL.relatingsOn(trappedChord).length, unmarked: unmarkedChord && REL.relatingsOn(unmarkedChord).length, altitudes: { onTriangles: altOn3, onSquares: altOn4 } });

// ═══ §5b THE RE-SLOT: a split part reads the parent's altitude records by corner, never by slot as they lie — the positive control on a triangle with records ═══
const triWithAlt = G2.faces.find((f) => f.vertexIds.length === 3 && [0, 1, 2].some((kk) => ALT.altitudeHeld(f, kk).length > 0));
const eA = lift([{ kind: 'face', id: triWithAlt.id }]); const aform = placeShelfEntry(eA, 4);
forms.set(aform.shape.id, aform); entries.set(aform.shape.id, eA);
const arec = B.formRecordOf(aform, ctx).record;
const sameSet = (a, b) => a.length === b.length && a.every((v) => b.includes(v));
const parentFace = arec.faces.find((f) => sameSet(f.vertexIds, aform.shape.faces[0].vertexIds)) ?? arec.faces.find((f) => f.id.endsWith(triWithAlt.id));
const rotated = [parentFace.vertexIds[1], parentFace.vertexIds[2], parentFace.vertexIds[0]]; // the same corners, rotated: every apex and end survives, every slot moves
const partShape = { ...aform.shape, faces: [{ ...parentFace, id: `${parentFace.id}:disk`, vertexIds: rotated }], genealogy: { ...aform.shape.genealogy, resolution: { typeClaim: 'resolution', passes: 0, chordEdgeId: null, carrier: { [`${parentFace.id}:disk`]: parentFace.id } } } };
const Dp = B.provenanceRecordOf(arec, partShape, [], 'refine');
const part = Dp.state === 'derived' ? Dp.image.faces.find((f) => f.id === `${parentFace.id}:disk`) : null;
const entriesBy = (f, apexId) => ALT.altitudeHeld(f, f.vertexIds.indexOf(apexId)).map((e) => [e[0], e[1], e[2], f.vertexIds[e[0] === 'say' ? e[3] : e[1]], e[e[0] === 'say' ? 4 : 2]].join('|')).sort();
const sameByCorner = !!part && parentFace.vertexIds.every((apex) => J(entriesBy(parentFace, apex)) === J(entriesBy(part, apex)));
const verbatim = !!part && J(ALT.altitudeHeld(part, 0)) === J(ALT.altitudeHeld(parentFace, 0));
const dropped = (() => { const two = { ...partShape, faces: [{ ...parentFace, id: `${parentFace.id}:rest`, vertexIds: [parentFace.vertexIds[0], parentFace.vertexIds[1], 'absent-corner'] }], genealogy: { ...partShape.genealogy, resolution: { ...partShape.genealogy.resolution, carrier: { [`${parentFace.id}:rest`]: parentFace.id } } } }; const D2 = B.provenanceRecordOf({ ...arec, vertices: { ...arec.vertices, 'absent-corner': { ...arec.vertices[parentFace.vertexIds[2]], id: 'absent-corner' } } }, two, [], 'refine'); const f2 = D2.state === 'derived' ? D2.image.faces.find((f) => f.id === `${parentFace.id}:rest`) : null; return f2 ? [0, 1, 2].reduce((n, kk) => n + ALT.altitudeHeld(f2, kk).length, 0) : null; })();
const total = [0, 1, 2].reduce((n, kk) => n + ALT.altitudeHeld(parentFace, kk).length, 0);
const kept = (() => { const a = parentFace.vertexIds[0], b = parentFace.vertexIds[1]; return [0, 1, 2].reduce((n, kk) => n + ALT.altitudeHeld(parentFace, kk).filter((e) => [a, b].includes(parentFace.vertexIds[kk]) && [a, b].includes(parentFace.vertexIds[e[0] === 'say' ? e[3] : e[1]])).length, 0); })();
check('§5b ★ THE PARTS READ THE PARENT\'S RECORDS WHERE THE APEX AND THE END SURVIVE (the positive control, on a triangle of the Property record holding altitude entries): a part keeping the three corners rotated reads every entry at the same apex and end by CORNER — not the parent\'s slots verbatim (a verbatim copy misfiles each saying under another apex); a part that keeps two corners and takes a third from elsewhere reads only the entries whose apex and end are among the two kept',
  !!triWithAlt && total > 0 && sameByCorner && !verbatim && dropped === kept,
  { face: triWithAlt && triWithAlt.vertexIds.map((v) => lab(G2, v)).join('·'), total, verbatim, byCorner: sameByCorner, kept, dropped });

// ═══ §6 THE INTERMEDIATES: a midpoint the record lacks, consumed by a merge in the same act (the sew's rim), read through the parent shape ═══
const y = Object.keys(base.shape.vertices).find((v) => v !== u && v !== w);
const mergedId = 'merged:m+y';
const sewn = { ...bis.shape, id: `${bis.shape.id}:sewn`, vertices: Object.fromEntries([...Object.entries(bis.shape.vertices).filter(([id]) => id !== mid.id && id !== y), [mergedId, { ...bis.shape.vertices[y], id: mergedId, data: { ...bis.shape.vertices[y].data, label: '' }, createdBy: { shapeId: 'sewn', operation: 'glue', sourceVertexIds: [mid.id, y] } }]]), edges: bis.shape.edges.map((e) => ({ ...e, vertexIds: e.vertexIds.map((v) => (v === mid.id || v === y ? mergedId : v)), sourceVertexIds: e.sourceVertexIds.map((v) => (v === mid.id || v === y ? mergedId : v)) })).filter((e) => e.vertexIds[0] !== e.vertexIds[1]), faces: bis.shape.faces.map((f) => ({ ...f, vertexIds: f.vertexIds.map((v) => (v === mid.id || v === y ? mergedId : v)) })), genealogy: { ...bis.shape.genealogy, operation: 'glue', parentShapeId: bis.shape.id } };
const withParent = B.provenanceRecordOf(record, sewn, [], 'glue', bis.shape);
const without = B.provenanceRecordOf(record, sewn, [], 'glue', null);
const rolesWith = withParent.state === 'derived' ? roleIds(withParent.image, mergedId).length : null;
const rolesWithout = without.state === 'derived' ? roleIds(without.image, mergedId).length : null;
check('§6 ★★ A MIDPOINT CONSUMED BY THE SAME ACT THAT MADE IT IS READ THROUGH THE PARENT SHAPE (the page\'s sew: the rim bisected and merged in one act — the midpoint is on no form of the page): a born form whose merged class names the bisected lift\'s midpoint and another corner — with the parent shape handed in, the class holds the midpoint\'s child side by side with the corner\'s (the roles of both); without it the chain cannot read the class and SAYS so (`unknown` — the act not carried through, never a class silently short of a member) — the falsifier of the carry',
  !!given && withParent.state === 'derived' && without.state === 'unknown' && rolesWith === medial.n + roleIds(record, y).length && medial.n > 0,
  { withParent: rolesWith, without: without.state, midpoint: medial.n, corner: roleIds(record, y).length });

// ═══ §7 BY CONSTRUCTION — the readers, by source ═══
const spaceSrc = src('src/lib/spaceOf.ts'); const inst = src('src/lib/instanceSpace.ts'); const tr = src('src/lib/transport.ts'); const walk = src('src/lib/walkRoutes.ts'); const cargo = src('src/manuscript/cargoModel.ts');
const pred = src('src/lib/isPredicate.ts'); const refine = src('src/lib/surfaceRefinement.ts'); const chain = src('src/manuscript/bornRecordModel.ts'); const view = src('src/manuscript/ManuscriptView.tsx'); const chrome = src('src/manuscript/ManuscriptChrome.tsx'); const lifted = src('src/manuscript/liftedConceptModel.ts');
check('§7 ★★ BY CONSTRUCTION: a copy reads its source in the ONE resolver (`copySourceOf`, read by `spaceOf`, `childSpaceOf`, `transportSpaceOf`, `generationOf`); the segment leg is read by structure in the transport (`segmentOf` in the step, the ground and the ways; `IDENTITY` its wordless road) and exempted with the coordinate leg in the route words and the walk\'s words; the predicate reads the carried refusal FIRST; the wordless bisection stamps `sourceEdgeId`, both chord mints `sourceFaceId`; the chain reads a refined midpoint by that stamp BEFORE the merge rule, keeps a copy a copy, resolves a copied edge through the copies\' sources, never a segment or a chord, and takes the parent shape for the intermediates; the card reads every form through the chain; the view hands the loaded source; the strip starts at the shelf\'s right edge',
  /export const copySourceOf = /.test(spaceSrc) && /copySourceOf\(shape, vertexId\) !== null/.test(spaceSrc) && /copy !== null \? generationOf\(shape, copy, memo\)/.test(spaceSrc) && /copySourceOf\(shape, v\) !== null/.test(inst)
    && /export function segmentOf\(/.test(tr) && /export const IDENTITY = 'identity';/.test(tr) && (tr.match(/const seg = segmentOf\(record, a, b\);/g) || []).length === 2 && /const copy = copySourceOf\(record, v\);\n  if \(copy !== null\) return transportSpaceOf\(record, copy, memo, childMemo\);/.test(tr)
    && (walk.match(/IDENTITY/g) || []).length >= 5 && (cargo.match(/IDENTITY/g) || []).length >= 4 && /as itself/.test(cargo)
    && /const carried = carriedRefusalOf\(shape, U, V, x, y\);\n  if \(carried\) return \{ kind: 'carried', carried, form: carriedWords\(shape, carried, R\) \};\n  const solid = sharedCoordinateOf/.test(pred)
    && /sourceVertexIds: \[edge\.u, edge\.v\],\n(.*\n){2}\s*sourceEdgeId: edge\.id,/.test(refine) && (refine.match(/sourceFaceId: (own|face)\.id/g) || []).length === 2
    && /const refined = refineChildOf\(record, v\);\n    if \(refined\)/.test(chain) && chain.indexOf('const refined = refineChildOf(record, v);') < chain.indexOf('if (MERGE_KINDS.has(op) && sources.length >= 2) {') && /operation: 'product', sourceVertexIds: \[sources\[0\]\]/.test(chain) && /const segment = s0 === s1 && s0 !== e\.vertexIds\[0\];\n    const chord = e\.sourceFaceId !== undefined;/.test(chain) && /parent: Shape \| null = null\): ProvenanceReading/.test(chain) && /sourceOf\?: \(shapeId: string\) => string \| null;/.test(chain)
    && /liftedConceptOf\(entry\.form, shelfAncestors\.get\(entry\.form\.shape\.id\) \?\? \[\], resolveAbsentLabel, formRecordOf\(entry\.form, chainCtx\)\)/.test(view) && /sourceOf: \(shapeId\) => shelf\.find/.test(view) && /const read = derived && derived\.state === 'read' \? derived : null;/.test(lifted)
    && /export const STRIP_LEFT = 14 \+ 208 \+ 12;/.test(chrome) && /left: STRIP_LEFT,/.test(chrome),
  { ok: true });

// ═══ §8 THE DESIGNER'S 23:20 WORDS: the edge's name page-wide; the summands; the note; the picker ═══
const sites = ['src/manuscript/bornRecordModel.ts', 'src/manuscript/identificationImageModel.ts', 'src/manuscript/IdentificationImageSection.tsx', 'src/manuscript/ManuscriptView.tsx', 'src/manuscript/cargoModel.ts', 'src/manuscript/sinceLiftModel.ts', 'src/components/MidpointSurface.tsx'].map((f) => [f, (src(f).match(/edgeNameOf\(/g) || []).length]);
const compound = B.collapseRefusalOf({ ...arec, edges: arec.edges.map((e) => ({ ...e })) }, [], {});
check('§8 ★★ THE DESIGNER\'S 23:20: (2) ONE EDGE-NAME COMPOSER PAGE-WIDE — `A–B` for plain names, a SPACED dash where a corner\'s name holds one (`Capital–Reproduction – Capital–Property`), read by the collapse words, the identification section\'s seams and lines, the door label, the walk\'s words, the since-lift words and the midpoint surface\'s edge names (sites counted by file); (1) the summands named by their corners and their universe (`summandNameOf`); (5) the bodiless note\'s junction ids named as the card names them (`bodilessWords`); (6) the picker closed when the combine is done (`pickerClosedFor`, both exits); (7) the strip from the shelf\'s right edge',
  edgeNameOf('A', 'B') === 'A–B' && edgeNameOf('Capital–Reproduction', 'Capital–Property') === 'Capital–Reproduction – Capital–Property' && edgeNameOf('Class', 'Capital–Property') === 'Class – Capital–Property' && sites.every(([, n]) => n >= 1) && sites.reduce((n, [, c]) => n + c, 0) >= 12 && compound === null
    && /const summandNameOf = useCallback\(\(shapeId: string\): string => \{/.test(view) && /return Rd\.state === 'read' \? `\$\{corners\} of \$\{Rd\.rootName\}` : corners;/.test(view) && /names: \[summandNameOf\(identificationImage\.sum\.parentIds\[0\]\), summandNameOf\(identificationImage\.sum\.parentIds\[1\]\)\]/.test(view)
    && /no faithful body — \{bodilessWords\(render\.reason, render\.shape\)\}/.test(view) && /const bodilessWords = useCallback\(\(reason: string, shape: Shape\): string => reason\.replace\(/.test(view)
    && (view.match(/setPickerClosedFor\(/g) || []).length >= 2 && /if \(!selected \|\| combineWith \|\| selected === pickerClosedFor\) return null;/.test(view) && (view.match(/delete next\[combineGate\.aKey\]; delete next\[combineGate\.bKey\];/g) || []).length === 2,
  { sites });

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-LEGS-CARRIED: ALL PASS — the band reads its base through the page\'s own route, its copies and copied edges reading the same; the segment leg the identity, an IS across it refused as carried, a mode on it ordinary; a refined midpoint the edge\'s child with its half-edges as legs; a chord nothing; a split part\'s records by corner' : `DIAGNOSE-THE-LEGS-CARRIED: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
