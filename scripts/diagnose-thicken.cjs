#!/usr/bin/env node

// DIAGNOSTIC — THICKEN (A.1 rung 1; engineer-chartered 2026-07-18;
// SEAL-BEFORE-BUILD — BUILT BLIND to `.handoff/SEAL_THICKEN.md`, SHA-256
// 039feb1b…82cae, NATIVELY measured — the sandbox's two digests were shadows
// of an edited file and are void; every pin below is the builder's own
// measurement).
//
// THE LINE (the mothership's, replacing her own): rung 1 delivers THE FIRST
// FORM BORN OF A FORM THE PERSON SELECTED OUT OF ANOTHER FORM. NO NEW FORM —
// the band IS the annulus they could already glue from a square (identical
// level-2 readings are a PROOF of sameness; the tower is complete). A NEW
// ANCESTRY: the band from thicken(their lifted loop) is born of THEIR
// CIRCLE and carries that birth-memory. They gain a PARENT.
//
// FORK (b) IS FORCED: the engine's S¹ is an n-CYCLE (V3E3F0 — nGon(1)
// throws; no seed carries a self-loop; the direct bridge refuses self-loops).
// Her law: AN OP'S SPEC MUST BE PINNED ON THE INPUT THE PERSON CAN ACTUALLY
// HAND IT. Rung 1 pins V3E3F0 × I = V6 E9 F3, χ = 0.
//
// THE RIDER RODE (one predicate split in FROZEN surfaceClassifier, re-sealed):
// slotCount === 0 (a GRAPH edge — not free, not a boundary; ∂S¹ = ∅; the lib
// was always right) is ruled apart from slotCount === 1 (a TRUE surface
// boundary). The count!==1 twin, cured the day after its sibling.
//
// ⚠ DISCLOSED WEIGHT (the §4 protocol, extended honestly): §3's own semantics
// — a BIRTH that is NON-CONSUMING under the word `product` — required TWO
// one-word frozen edits the charter did not price: OperationKind gains
// 'product' (types/geometry.ts) and NON_CONSUMING gains 'product'
// (genealogyDag.ts — whose own doctrine held the seat: "once it exists,
// `product`"). Without them the op would lie by word or the DAG would mint a
// pentimento for an un-consumed parent. THREE re-seals total, count 44 — if
// this weight exceeds what the charter intended, the seal is the engineer's
// to void; nothing was smuggled in silence.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
};

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const { checkEngineFreeze, sha256OfCrStripped } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));

// ── the person's surfaces (the payoff leg touches ONLY these — asserted) ──
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { level1Betti, readFormInvariants } = req('src/playground/formInvariants.ts');

// ── instrument surfaces (comparison / ladder / rider legs, never the payoff) ──
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { executeCustomGlue } = req('src/playground/customGluing.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');
const { thicken } = req('src/lib/thicken.ts');
const { acquireComplex, walkBoundaryCircles } = req('src/lib/complexIdentification.ts');
const { readBoundary } = req('src/manuscript/surfaceClassifier.ts');
const F3 = req('src/lib/faceIdentification.ts');

// the ONE plumbing read (pinned in the flagship's HEAD-read inventory):
// non-movement ×6 + the manifest re-seal differential (arrival-branched)
const headBlobOf = (file) => execSync(`git cat-file blob HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log("thicken: the person's own circle becomes a band, and the band remembers (blind concretes)\n");

// ═════ [1] ★★★ the person's route — a LIFT, not a fixture ═════════════════════════
console.log("----- [1] ★★★ THE PERSON'S ROUTE, PASTED: three edge rows, no face → the circle → the band (clause 1) -----");
// This function drives the AMBO STORE and the shelf channel and NOTHING under
// src/lib — the circle is the person's own lift, never a hand-built fixture
// (a hand-built circle is exactly how a proof-of-life becomes a lie).
function personsThickenRoute() {
  const G = () => useGeometryStore.getState();
  const shape = G().shapes[G().currentShapeId];
  const face = shape.faces[0];
  const edgeIds = [];
  for (let k = 0; k < face.vertexIds.length; k += 1) {
    const u = face.vertexIds[k];
    const w = face.vertexIds[(k + 1) % face.vertexIds.length];
    const e = shape.edges.find(
      (x) => (x.vertexIds[0] === u && x.vertexIds[1] === w) || (x.vertexIds[0] === w && x.vertexIds[1] === u),
    );
    if (e) edgeIds.push(e.id);
  }
  for (const id of edgeIds) G().toggleLiftSelection({ kind: 'edge', id });
  const bandTitle = G().thickenLiftToManuscript();
  const queue = useLiftStore.getState().queue;
  return { shape, edgeIds, bandTitle, circleFile: queue[queue.length - 2].file, bandFile: queue[queue.length - 1].file };
}
const R = personsThickenRoute();
const circle = R.circleFile.shape;
const band = R.bandFile.shape;
check('★★★ THE LIFT BECOMES A BAND THAT REMEMBERS: shift-click the THREE EDGE ROWS of a tetra face (never the face — nothing pulls the face above an edge), thicken → the shelf carries TWO forms: the person\'s circle (V3 · E3 · F0, b₁ = 1 — THEIR S¹, from the store\'s own lift) and the band (V6 · E9 · F3, χ = 0), whose genealogy reads operation \'product\' with parentShapeId NAMING THEIR CIRCLE — the pointer rides the shelf FILE verbatim (snapshot.ts\'s own design: "the original pointer stays inside the snapshot file untouched"; the LOADED view re-roots to null by the same committed design, a name not a doorway). The route\'s source is self-asserted to touch nothing under src/lib',
  (() => {
    const b1 = level1Betti(circle).b1;
    const chi = Object.keys(band.vertices).length - band.edges.length + band.faces.length;
    note(`the lift: ${R.edgeIds.length} edge rows · circle V${Object.keys(circle.vertices).length} E${circle.edges.length} F${circle.faces.length} · b₁=${b1}`);
    note(`the band: "${R.bandTitle}" · V${Object.keys(band.vertices).length} E${band.edges.length} F${band.faces.length} C${band.cells.length} · χ=${chi}`);
    note(`band.genealogy: operation=${band.genealogy.operation} · parentShapeId === circle.id: ${band.genealogy.parentShapeId === circle.id}`);
    const src = personsThickenRoute.toString();
    return R.edgeIds.length === 3 &&
      Object.keys(circle.vertices).length === 3 && circle.edges.length === 3 && circle.faces.length === 0 && b1 === 1 &&
      Object.keys(band.vertices).length === 6 && band.edges.length === 9 && band.faces.length === 3 &&
      band.cells.length === 0 && chi === 0 &&
      band.genealogy.operation === 'product' && band.genealogy.parentShapeId === circle.id &&
      !src.includes('src/lib');
  })());

// ═════ [2] the ancestry is the payoff ═════════════════════════════════════════════
console.log('\n----- [2] THE ANCESTRY IS THE PAYOFF: non-consuming, no pentimento (clause 2) -----');
check('THE CHILD RESOLVES TO THE LIFTED LOOP AND THE PARENT STAYS ALIVE: the genealogy DAG over the shelf\'s two forms reads exactly one edge — the circle begets the band — and `product` reads NON-CONSUMING: the circle is STILL LIVE at the end of the population walk (no death, no pentimento; π_A recovers the parent exactly, so nothing was consumed — the seat genealogyDag\'s own doctrine held for `product` is filled, not forced)',
  (() => {
    const dag = buildGenealogyDag([circle, band]);
    const edges = dag.edges.filter((e) => e.child === band.id);
    const live = dag.liveAtEnd;
    const liveHas = (id) => (live instanceof Set ? live.has(id) : Array.isArray(live) ? live.includes(id) : false);
    note(`edges into the band: ${edges.length} — parent: ${edges[0] ? edges[0].parent.slice(0, 52) : 'NONE'}`);
    note(`liveAtEnd: circle=${liveHas(circle.id)} · band=${liveHas(band.id)}`);
    return edges.length === 1 && edges[0].parent === circle.id && liveHas(circle.id) && liveHas(band.id);
  })());

// ═════ [3] no "new form" claim — the same surface, said plainly ═══════════════════
console.log('\n----- [3] ⛔ NO NEW FORM: the band beside the square\'s annulus — the same surface (clause 3) -----');
check('THE BAND IS THE ANNULUS THE PERSON COULD ALWAYS GLUE: glueFace(square, one pair) → V2 E3 F1 and thicken(their circle) → V6 E9 F3 read IDENTICALLY through the committed level-2 reader (χ = 0 · open · the same classification) and both carry exactly TWO true boundary circles — they are THE SAME SURFACE (the level-2 tower is complete, so identical readings are a PROOF of sameness, never a blindness). What differs is the ANCESTRY: one is born of a square, the other of the person\'s own circle',
  (() => {
    const sq = loadForm(nGon(4), 'thkSame');
    const annulus = executeCustomGlue(sq, sq.faces[0], [{ edgeA: 0, edgeB: 2, mode: 'preserving' }], null);
    const annInv = readFormInvariants(annulus, [sq]);
    const bandInv = readFormInvariants(band, [circle]);
    const annB = readBoundary(acquireComplex(annulus, [sq]).complex);
    const bandB = readBoundary(acquireComplex(band, []).complex);
    note(`annulus: χ=${annInv.chi} · "${annInv.classification}" · ${annInv.boundary} · boundary circles=${annB.circles}`);
    note(`band:    χ=${bandInv.chi} · "${bandInv.classification}" · ${bandInv.boundary} · boundary circles=${bandB.circles}`);
    return annInv.chi === 0 && bandInv.chi === 0 &&
      annInv.classification === bandInv.classification && annInv.boundary === bandInv.boundary &&
      annB.circles === 2 && bandB.circles === 2;
  })());

// ═════ [4] invariance alone cannot seal — dimension and boundary discriminate ═════
console.log('\n----- [4] ⚠ NOT ON INVARIANCE ALONE: χ cannot tell thicken from a no-op — dimension and boundary can (clause 4, researcher-binding) -----');
check('THE DISCRIMINATORS ARE PINNED: χ is 0 on BOTH sides of the product (I is contractible — χ can never tell thicken from a no-op, exactly as it cannot tell refine from one), so this seal stands on what DOES move: the DIMENSION (the circle has zero 2-cells; the band has three) and the BOUNDARY (the circle\'s ∂ is EMPTY — 0 true boundary circles, 3 graph edges; the band\'s ∂ is TWO circles)',
  (() => {
    const circleB = readBoundary(acquireComplex(circle, []).complex);
    const bandB = readBoundary(acquireComplex(band, []).complex);
    const chiCircle = Object.keys(circle.vertices).length - circle.edges.length;
    const chiBand = Object.keys(band.vertices).length - band.edges.length + band.faces.length;
    note(`χ: circle=${chiCircle} · band=${chiBand} — equal (0 = 0): non-discriminating, as the researcher ruled`);
    note(`dimension: circle F=${circle.faces.length} → band F=${band.faces.length} · boundary: circle circles=${circleB.circles} (graph=${circleB.graphEdgeIds.length}) → band circles=${bandB.circles}`);
    return chiCircle === 0 && chiBand === 0 &&
      circle.faces.length === 0 && band.faces.length === 3 &&
      circleB.circles === 0 && circleB.graphEdgeIds.length === 3 && bandB.circles === 2;
  })());

// ═════ [5] the rider — the two readers agree on the person's own form ═════════════
console.log('\n----- [5] THE RIDER RODE: ∂S¹ = ∅ — a graph edge is not a boundary (clause 5) -----');
check('★ THE WELL-FORMED LIE IS DEAD: `readBoundary` on the person\'s lifted circle reads circles: 0 with its three edges classified as GRAPH edges (zero face slots — 1-complex material, NOT free, NOT a boundary), never "1 boundary circle" about a circle whose boundary is EMPTY — and `walkBoundaryCircles` still nulls on it, unchanged ("dangling edges — not a surface boundary"): the two readers AGREE on the person\'s own form. The closed world is untouched: a closed T² reads 0 free / 0 graph, and the annulus\'s TWO true boundary circles still count (the slotCount === 1 arm is byte-untouched)',
  (() => {
    const acq = acquireComplex(circle, []);
    const br = readBoundary(acq.complex);
    const walk = walkBoundaryCircles(acq.complex);
    const sqT = loadForm(nGon(4), 'thkRider');
    const t2 = executeCustomGlue(sqT, sqT.faces[0], [
      { edgeA: 0, edgeB: 2, mode: 'preserving' },
      { edgeA: 1, edgeB: 3, mode: 'preserving' },
    ], null);
    const t2B = readBoundary(acquireComplex(t2, [sqT]).complex);
    note(`circle: circles=${br.circles} · free=${br.freeEdgeIds.length} · graph=${br.graphEdgeIds.length} · walk=${walk === null ? 'null' : 'circles?!'}`);
    note(`closed T²: circles=${t2B.circles} · free=${t2B.freeEdgeIds.length} · graph=${t2B.graphEdgeIds.length}`);
    return br.circles === 0 && br.freeEdgeIds.length === 0 && br.graphEdgeIds.length === 3 && walk === null &&
      t2B.circles === 0 && t2B.freeEdgeIds.length === 0 && t2B.graphEdgeIds.length === 0;
  })());

// ═════ [6] non-movement ═══════════════════════════════════════════════════════════
console.log('\n----- [6] NON-MOVEMENT: the six named files are byte-identical to HEAD (clause 6) -----');
check('faceIdentification · level3SoundnessGate · connectedSum · multiform · surfaceRefinement · level3Invariants are CR-insensitively BYTE-IDENTICAL to HEAD — this run\'s frozen surgery is EXACTLY the three disclosed files (types/geometry · genealogyDag · surfaceClassifier), nothing else',
  ['src/lib/faceIdentification.ts', 'src/lib/level3SoundnessGate.ts', 'src/lib/connectedSum.ts',
   'src/lib/multiform.ts', 'src/lib/surfaceRefinement.ts', 'src/lib/level3Invariants.ts'].every(
    (file) => sha256OfCrStripped(fs.readFileSync(path.join(repoRoot, file), 'utf8')) === sha256OfCrStripped(headBlobOf(file)),
  ));

// ═════ [7] the ladder — rung 2 reaches, rung 3 reports its wall ═══════════════════
console.log('\n----- [7] THE LADDER: rung 2 (thicken T² — the chain REACHES) · rung 3 (the T³ arithmetic + the honest wall) (clauses 7–8) -----');
check('★ RUNG 2 STANDS AND THE ACQUISITION CHAIN REACHES ITS SECOND REAL CALLER: the quotient T²\'s complex arrives through the chain (source: \'recovered\' — the committed replay; at THE SEAM the chain returned NULL for parentless unions, and rung 2\'s plain born form is exactly what it CAN reach — measured, the researcher\'s long-owed item meets a caller and answers) · thicken(T²) = V2 E5 F4 C1, χ = 0 — the n_k law on a quotient input (2·1 · 2·2+1 · 2·1+2 · 0+1) · and the BOUND is a door: thicken on the 3-form refuses VERBATIM ("the product of two surfaces is a 4-manifold; this engine stops at 3.")',
  (() => {
    const sq2 = loadForm(nGon(4), 'thkR2');
    const t2 = executeCustomGlue(sq2, sq2.faces[0], [
      { edgeA: 0, edgeB: 2, mode: 'preserving' },
      { edgeA: 1, edgeB: 3, mode: 'preserving' },
    ], null);
    const acq = acquireComplex(t2, [sq2]);
    note(`T² acquisition: ${acq ? acq.source : 'NULL — the STOP condition'}`);
    if (!acq) return false;
    const bandT2 = thicken(t2);
    const s = bandT2.shape;
    const chi = Object.keys(s.vertices).length - s.edges.length + s.faces.length - s.cells.length;
    note(`thicken(T²): V${Object.keys(s.vertices).length} E${s.edges.length} F${s.faces.length} C${s.cells.length} · χ=${chi}`);
    let refusal = null;
    try {
      thicken(s);
    } catch (error) {
      refusal = error.message;
    }
    note(`the bound: "${refusal ?? 'NO REFUSAL?!'}"`);
    return acq.source === 'recovered' &&
      Object.keys(s.vertices).length === 2 && s.edges.length === 5 && s.faces.length === 4 && s.cells.length === 1 &&
      chi === 0 && refusal === 'thicken: the product of two surfaces is a 4-manifold; this engine stops at 3.';
  })());
check('RUNG 3 REPORTS AND STOPS (as the mandate allows): identifying the T²-band\'s two boundary tori (f×0 ~ f×1) WOULD land the committed T³ cell-for-cell by arithmetic (V2E5F4C1 → identify one vertex pair, two edge pairs, one face pair → V1 E3 F3 C1 — the committed 3-torus\'s exact counts), and readSeedCell now accepts the band (4 faces) — but the identification door itself refuses the QUOTIENT rim: the pairing map is a bijection over cycle CORNERS, and the band-of-T²\'s face cycles are degenerate (one vertex class repeated) — the same quotient-degeneracy the rim module solved at level 2 by working at the (polygon, word) level. The wall is MEASURED and NAMED; hanging that door is its own run',
  (() => {
    const sq3 = loadForm(nGon(4), 'thkR3');
    const t2 = executeCustomGlue(sq3, sq3.faces[0], [
      { edgeA: 0, edgeB: 2, mode: 'preserving' },
      { edgeA: 1, edgeB: 3, mode: 'preserving' },
    ], null);
    const bandT2 = thicken(t2);
    let seedOk = false;
    let wall = null;
    try {
      const seed = F3.readSeedCell(bandT2.shape);
      seedOk = seed.faces.length === 4;
      const f0 = seed.faces.find((f) => f.id.endsWith('@0'));
      const f1 = seed.faces.find((f) => f.id.endsWith('@1'));
      const map = {};
      for (const v of f0.cycle) map[v] = v.replace(/@0$/, '@1');
      F3.glueFaces(seed, [{ faceA: f0.id, faceB: f1.id, mode: 'preserving', map }]);
      wall = 'IDENTIFICATION SUCCEEDED — re-measure rung 3';
    } catch (error) {
      wall = error.message;
    }
    note(`readSeedCell(band of T²): ${seedOk ? '4 faces — accepted' : 'refused'}`);
    note(`the identification wall: "${String(wall).slice(0, 110)}"`);
    return seedOk && wall !== null && wall !== 'IDENTIFICATION SUCCEEDED — re-measure rung 3';
  })());

// ═════ [8] the freeze: three re-seals, count 44, arrival-branched ═════════════════
console.log('\n----- [8] THE FREEZE: three re-seals in the same change, count 44 -----');
const freeze = checkEngineFreeze(repoRoot);
check('THE MANIFEST CARRIES THIS RUN\'S EXACT WEIGHT: the freeze reads ok at 45 with zero drift (the three sanctioned hash lines — types/geometry · genealogyDag · surfaceClassifier — moved IN THIS SAME CHANGE, and thicken.ts rides as a NOT_FROZEN line, the completeness law); the manifest\'s set-differential vs HEAD is EXACTLY those four lines (three replaced hashes + one new NOT_FROZEN entry) — or EMPTY with the new hashes present, once the re-seal has ARRIVED at HEAD',
  (() => {
    const work = fs.readFileSync(path.join(repoRoot, 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'), 'utf8').split(/\r?\n/);
    const head = headBlobOf('docs/governance/ENGINE_FREEZE_MANIFEST.txt').split(/\r?\n/);
    const headSet = new Set(head);
    const workSet = new Set(work);
    // C.1 THE FIELD IN THE SPECIMEN (2026-07-17, sealed 390c9046…c607): a later
    // arc's completeness-law lines (its two new NOT_FROZEN classifications) may
    // ride the same tree pre-commit — stripped from THIS differential on BOTH
    // sides, by NAME (this leg weighs THICKEN's own manifest surface, not the
    // campaign's; any unnamed line still breaks it); ratified in
    // diagnose-the-field-in-the-specimen.cjs.
    const LATER_ARC_LINES = [
      'NOT_FROZEN src/manuscript/InkedFieldLayer.tsx',
      'NOT_FROZEN src/manuscript/fieldWorker.ts',
    ];
    const notLaterArc = (l) => !LATER_ARC_LINES.some((p) => l.startsWith(p));
    const workOnly = work.filter((l) => !headSet.has(l)).filter(notLaterArc);
    const headOnly = head.filter((l) => !workSet.has(l)).filter(notLaterArc);
    note(`freeze: ok=${freeze.ok} checked=${freeze.checked} · manifest lines: +${workOnly.length} / −${headOnly.length} vs HEAD`);
    for (const l of workOnly) note(`  + ${l.slice(0, 76)}`);
    const preCommit = workOnly.length === 4 && headOnly.length === 3 &&
      ['src/types/geometry.ts', 'src/lib/genealogyDag.ts', 'src/manuscript/surfaceClassifier.ts'].every(
        (f) => workOnly.some((l) => l.includes(f)) && headOnly.some((l) => l.includes(f)),
      ) && workOnly.some((l) => l.includes('NOT_FROZEN src/lib/thicken.ts'));
    const arrived = workOnly.length === 0 && headOnly.length === 0 &&
      headBlobOf('docs/governance/ENGINE_FREEZE_MANIFEST.txt').includes(
        sha256OfCrStripped(fs.readFileSync(path.join(repoRoot, 'src/types/geometry.ts'), 'utf8')),
      );
    note(arrived ? 'the re-seal has ARRIVED at HEAD' : 'pre-commit: the four lines ride this change');
    return freeze.ok === true && freeze.checked === 45 && (preCommit || arrived);
  })());

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
