#!/usr/bin/env node

// DIAGNOSTIC — THE ARGUMENT-READING CARD, Phase 1: THE MAP (the spine).
// (Seal SEAL_THE_ARGUMENT_CARD; researcher spec 2142; ADR 0024.)
//
// THE CLAUSES (phase-1 scope — map/typing/certificate/gates; incidence·
// stance·verdict are Phase 2):
//   E1 ★★ THE MAPS FROM THE TRACE — the canonical subjects read their rows
//        from the SUBSTRATE: □⟶𝕋² one identified concept ← the 4 parent
//        corners, roots == primalMultiset (recomputed INDEPENDENTLY, never
//        trusted); △⟶cone apex SURVIVES alone + rim identified from the two
//        folded corners; the dual trade reads born-OF-face (p ⟷ f — the
//        manuscript-reachable dual subject; the icosa⟶dodeca canonical rides
//        the same read); the invoked seed reads all-born honestly.
//   E5 ★★ THE PLANT BITES — a fabricated root not in primalMultiset (and a
//        doctored words-line) FAIL the same comparators that green the real
//        rows: the card draws the trace, never invents it.
//   E6 THE GATES — the sign hand + the map section + the expand-in-place
//        certificate are wired in the view (source-pinned); the map rows
//        carry NO invariant token (the scratch test — invariants live only
//        in the demoted receipt).
//   E7 FROZEN + NO UNION — lineage.ts / conformalAtom.ts / specimenModel.ts /
//        writtenFormModel.ts byte-identical to HEAD; the manifest carries the
//        new file's NOT_FROZEN completeness row (a cures-at-HEAD compare).
//   §10-§11 THE LIFT — IDENTITY & GRAIN (SEAL_THE_LIFT_IDENTITY_AND_GRAIN):
//        the packet IS the name (a real "C"/"fact" reads itself, a
//        placeholder reads "unnamed", never a positional letter); 'lifted'
//        is the typing with the life-line read through `createdBy`; the
//        lift id names WHICH entity (two edges both place); the grain is
//        carried (edge A-AC-C) or honestly MARKED (face interior — slice 1);
//        the fabricated-letter + dropped-subdivision plants bite; the WALK
//        judges every card-reachable OperationKind by the packet comparator.
//
// Anti-mock: the REAL TS modules through the transpile hook.

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        esModuleInterop: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
      fileName: filename,
    }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { invokePrimitive, applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { applyFoldTo } = req('src/manuscript/handGestureModel.ts');
const { computeSeedCornerAngles } = req('src/lib/conformalAtom.ts');
const { primalMultiset } = req('src/lib/lineage.ts');
const { buildArgumentReading, mergedMembersOf } = req('src/manuscript/argumentReadingModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);

const wireForm = (form) => {
  const owned = computeSeedCornerAngles(form.shape);
  return {
    ...form,
    shape: owned,
    render: form.render.mode === 'plain' ? { ...form.render, shape: owned } : form.render,
  };
};

// the INDEPENDENT comparator — the witness recomputes the trace itself and
// judges the model's rows against it (E5's plants must FAIL exactly this)
const rowsAgreeWithSubstrate = (reading, shape) => {
  const memo = new Map();
  return reading.conceptRows.every((row) => {
    const truth = [...primalMultiset(row.resultId, shape, memo).keys()].sort();
    return (
      row.rootIds.length === truth.length &&
      row.rootIds.every((id, i) => id === truth[i]) &&
      row.sourceIds.every((s) => typeof s === 'string' && s.length > 0)
    );
  });
};

console.log('THE ARGUMENT-READING CARD — Phase 1: the MAP is the spine (the birth op\'s argument, from the substrate)\n');

// ---------------------------------------------------------------------------
// §1 (E1) ★★ □⟶𝕋² — one identified concept ← the four corners
// ---------------------------------------------------------------------------
console.log('----- §1 (E1) ★★ the torus map: •p ← the 4 atomic roots, via primalMultiset -----');
const sqHost = wireForm(invokePrimitive('square', 970));
const torusApplied = applyPlaygroundOperationTo('glue-torus', sqHost.shape, null, 971, 8, [], null);
const torus = torusApplied.ok ? torusApplied.born : null;
const torusReading = torus ? buildArgumentReading(torus) : null;
note(torusReading ? `op=${torusReading.op} · header ${torusReading.header.source} ⟶ ${torusReading.header.result} · words "${torusReading.words}"` : 'torus not born');
check('§1 (E1) ★★ THE TORUS MAP READS THE TRACE: ONE concept row, IDENTIFIED, 4 one-generation sources, and its roots EXACTLY equal the independently recomputed primalMultiset (4 atomic corners of the ORIGINAL square — named, never invented)',
  torusReading !== null &&
    torusReading.conceptRows.length === 1 &&
    torusReading.conceptRows[0].typing === 'identified' &&
    torusReading.conceptRows[0].sourceIds.length === 4 &&
    torusReading.conceptRows[0].rootIds.length === 4 &&
    rowsAgreeWithSubstrate(torusReading, torus.shape));
// THE IDENTITY LAW (SEAL_THE_LIFT_IDENTITY_AND_GRAIN — recut): endpoints are
// named by their REAL packet labels now (the invoked square's corners are
// minted v0..v3 — measured), never positional letters. The expected names are
// recomputed INDEPENDENTLY from the parent's own packets.
const packetEndpointName = (parentShape, ids) => {
  const parts = ids.map((id) => {
    const label = parentShape.vertices[id]?.data?.label?.trim() ?? '';
    return label.length > 0 && label !== id ? label : (id.split(':').pop() ?? id);
  });
  return parts.every((p) => p.length === 1) ? parts.join('') : parts.join('·');
};
check('§1 (E1) the relations read the RECORDED correspondence (measured substrate: fresh ids + sourceVertexIds, the partner ABSORBED): 2 surviving relation rows each NAMED by its source edge\'s endpoint PACKETS (v0·v1 style — the real minted names, recomputed independently), 2 ABSORBED partners named likewise, and the words count 4→1 · 4→2 · 2 absorbed',
  torusReading !== null &&
    torusReading.relationRows.length === 2 &&
    torusReading.relationRows.every(
      (r) => r.typing === 'survived' && r.rootLabels[0] === packetEndpointName(torus.parentShape, r.sourceIds),
    ) &&
    torusReading.absorbedRelations.length === 2 &&
    (() => {
      const childEdgeIds = new Set(torus.shape.edges.map((e) => e.id));
      const expectedAbsorbed = torus.parentShape.edges
        .filter((e) => !childEdgeIds.has(e.id))
        .map((e) => packetEndpointName(torus.parentShape, e.vertexIds));
      return (
        expectedAbsorbed.length === 2 &&
        torusReading.absorbedRelations.every((s) => expectedAbsorbed.includes(s))
      );
    })() &&
    torusReading.words.includes('4 concepts become 1') &&
    torusReading.words.includes('4 relations become 2') &&
    torusReading.words.includes('2 absorbed') &&
    !torusReading.words.includes('die'));
check('§1 (E1) the header speaks the map: source □ (the parent 4-gon) ⟶ result 𝕋² (the drawn immersion class)',
  torusReading !== null && torusReading.header.source === '□' && torusReading.header.result === '𝕋²');

// ---------------------------------------------------------------------------
// §2 (E1) ★★ △⟶cone — the apex survives alone; the rim folds together
// ---------------------------------------------------------------------------
console.log('\n----- §2 (E1) ★★ the cone map: •apex survives (alone) · •rim ← the two folded corners -----');
const triHost = wireForm(invokePrimitive('triangle', 972));
const coneFolded = applyFoldTo(triHost.shape, null, [], [{ edgeA: 0, edgeB: 1, mode: 'preserving' }], 973, 8);
const cone = coneFolded.ok ? coneFolded.born : null;
const coneReading = cone ? buildArgumentReading(cone) : null;
const coneApexRow = coneReading?.conceptRows.find((r) => r.typing === 'survived') ?? null;
const coneRimRow = coneReading?.conceptRows.find((r) => r.typing === 'identified') ?? null;
note(coneReading ? `concepts: ${coneReading.conceptRows.map((r) => `${r.typing}(${r.rootLabels.join('')})`).join(' · ')} · relations: ${coneReading.relationRows.map((r) => r.typing).join(' · ')}` : 'cone not born');
check('§2 (E1) ★★ THE CONE MAP: exactly 2 concept rows — the APEX SURVIVES with ONE root (alone; the retained-verbatim corner, typed by presence-in-parent — the spec-letter widening, flagged) and the RIM is IDENTIFIED from the 2 folded corners; roots agree with the recomputed multiset',
  coneReading !== null &&
    coneReading.conceptRows.length === 2 &&
    coneApexRow !== null &&
    coneApexRow.rootIds.length === 1 &&
    coneRimRow !== null &&
    coneRimRow.sourceIds.length === 2 &&
    coneRimRow.rootIds.length === 2 &&
    rowsAgreeWithSubstrate(coneReading, cone.shape));
check('§2 (E1) the cone\'s relations: 2 surviving rows (the seam\'s rep + the rim loop, endpoint-lettered) and ONE absorbed partner (the other glued edge — identified into the seam, never dead)',
  coneReading !== null &&
    coneReading.relationRows.length === 2 &&
    coneReading.relationRows.every((r) => r.typing === 'survived' && (r.rootLabels[0] ?? '').length >= 2) &&
    coneReading.absorbedRelations.length === 1 &&
    coneReading.words.includes('1 absorbed'));

// ---------------------------------------------------------------------------
// §3 (E1) the dual trade (p ⟷ f) + the invoked seed (all born, honest)
// ---------------------------------------------------------------------------
console.log('\n----- §3 (E1) the dual trade reads born-OF-face; the raw invoke reads the seed honestly -----');
// MEASURED + FLAGGED: the manuscript 'dual' op REFUSES every reachable
// written subject today (open primitives: boundary; the torus quotient: the
// bridge refusal) — the dual trade enters the written band via the SHELF
// (an ambo-universe load). The mechanism clause therefore reads a COMMITTED
// playground dual (applyDualization on the cube seed) through the shelf's
// own carrier pattern — real substrate shapes, the app's carrier type.
// …and the committed dual accepts ONLY the pyritohedral-icosahedron core
// (measured: the cube seed refuses), so the subject is the SEALED canonical
// itself — the full ascent, then its dual: icosa ⟶ dodeca.
const { applyDualization } = req('src/lib/dualization.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { applyPyritohedralDiagonalization } = req('src/lib/pyritohedralDiagonalization.ts');
const { isCellActiveFrontier } = req('src/lib/cellLifecycle.ts');
let ascent = createSeedShape('cube');
const ascentSeed = ascent.cells.find((c) => isCellActiveFrontier(ascent, c.id) && c.kind === 'seed');
ascent = applyAmboDissection(ascent, ascentSeed.id);
const ascentCubo = ascent.cells.find((c) => isCellActiveFrontier(ascent, c.id) && c.topology === 'cuboctahedron');
ascent = applyPyritohedralDiagonalization(ascent, ascentCubo.id);
const ascentIcosa = ascent.cells.find((c) => c.topology === 'pyritohedral-icosahedron');
const dualShape = applyDualization(ascent, ascentIcosa.id);
const dualCarrier = {
  id: 'w-dual-carrier',
  title: 'dodecahedron — loaded',
  shape: dualShape,
  parentShape: ascent,
  opId: 'dual',
  provenance: 'witness carrier (the shelf-load pattern)',
  render: { mode: 'bodiless', reason: 'witness carrier', shape: dualShape },
};
const dualReading = buildArgumentReading(dualCarrier);
note(`dual: op=${dualReading.op} · concepts ${dualReading.conceptRows.map((r) => `${r.typing}${r.bornOf ? `⟷${r.bornOf}` : ''}`).join(' · ').slice(0, 120)}`);
check('§3 (E1) THE DUAL TRADE: the committed dual\'s concepts read born-OF-FACE (p ⟷ f — the sourceFaceId trade the icosa⟶dodeca canonical rides; the manuscript reaches dual-borns via the shelf — the in-band `dual` op refuses every written subject today, measured + flagged)',
  dualReading.conceptRows.length > 0 &&
    dualReading.conceptRows.some((r) => r.bornOf === 'face'));
const seedReading = buildArgumentReading(sqHost);
check('§3 (E1) THE RAW INVOKE IS HONEST: the seed square reads op `seed`, 4 concepts all BORN with themselves as roots, and the words-line says the seed\'s own',
  seedReading.op === 'seed' &&
    seedReading.conceptRows.length === 4 &&
    seedReading.conceptRows.every((r) => r.typing === 'born' && r.rootIds.length === 1 && r.rootIds[0] === r.resultId) &&
    seedReading.words.includes("the seed's own"));

// ---------------------------------------------------------------------------
// §4 (E5) ★★ THE PLANTS BITE — fabrication fails the same comparator
// ---------------------------------------------------------------------------
console.log('\n----- §4 (E5) ★★ the plants: a fabricated root and a doctored words-line FAIL the comparators -----');
const fabricated = {
  ...torusReading,
  conceptRows: torusReading.conceptRows.map((r, i) =>
    i === 0 ? { ...r, rootIds: [...r.rootIds.slice(0, 3), 'FABRICATED:root'] } : r,
  ),
};
check('§4 (E5) ★★ THE FABRICATED-SOURCE PLANT BITES: a root swapped for one NOT in primalMultiset fails the independent comparator that greens the real rows (the map draws the trace, never invents it)',
  rowsAgreeWithSubstrate(torusReading, torus.shape) === true &&
    rowsAgreeWithSubstrate(fabricated, torus.shape) === false);
const truthWords = `${Object.keys(torus.parentShape.vertices).length} concepts become ${torusReading.conceptRows.length} · ${torus.parentShape.edges.length} relations become ${torusReading.relationRows.length}`;
check('§4 (E5) THE WORDS-LINE IS COUNTED, NOT COMPOSED FREE: the model\'s words open with the recounted parent→child numbers verbatim; a doctored line ("5 concepts…") disagrees',
  torusReading.words.startsWith(truthWords) && !'5 concepts become 1 · 4 relations become 2'.startsWith(truthWords));

// ---------------------------------------------------------------------------
// §5 (E6) the gates — the two hands, the map section, the demoted receipt
// ---------------------------------------------------------------------------
console.log('\n----- §5 (E6) the gates: sign hand wired · map section mounted · certificate demoted, expand-in-place · the scratch test -----');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('§5 (E6) THE TWO HANDS + THE SECTIONS ARE WIRED: the view carries the SIGN_HAND stack (DejaVu Sans + symbol fallbacks), mounts ArgumentMapSection, renders the `certificate` receipt with expand-in-place state (setCertificateOpen), and passes the argument prop from the selectedArgument memo',
  viewSrc.includes('const SIGN_HAND') &&
    viewSrc.includes('<ArgumentMapSection argument={argument}') &&
    viewSrc.includes('setCertificateOpen') &&
    viewSrc.includes('argument={selectedArgument}'));
const allRowText = [
  ...torusReading.conceptRows.map((r) => `${r.label} ${r.rootLabels.join(' ')}`),
  ...torusReading.relationRows.map((r) => r.label),
  torusReading.words,
].join(' ');
check('§5 (E6) THE SCRATCH TEST (structural): the MAP rows and words carry NO invariant token (χ · genus · w₁ · H₁ live ONLY in the demoted certificate; the model routes them by certificateLabels)',
  !/χ|genus|w₁|H₁/.test(allRowText) &&
    torusReading.certificateLabels.includes('χ') &&
    torusReading.certificateLabels.includes('H₁'));

// ---------------------------------------------------------------------------
// §6 (E7) frozen + the completeness row
// ---------------------------------------------------------------------------
console.log('\n----- §6 (E7) the frozen boundary + the new file is ROWED -----');
const headEq = (p) => {
  const working = fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r/g, '');
  const head = execFileSync('git', ['show', `HEAD:${p}`], { cwd: repoRoot, encoding: 'utf8' }).replace(/\r/g, '');
  return working === head;
};
check('§6 (E7) FROZEN READ-ONLY: lineage.ts (primalMultiset) · conformalAtom.ts · specimenModel.ts (the frozen reading type — untouched; the argument rides its OWN prop) · writtenFormModel.ts BYTE-IDENTICAL to HEAD',
  ['src/lib/lineage.ts', 'src/lib/conformalAtom.ts', 'src/manuscript/specimenModel.ts', 'src/manuscript/writtenFormModel.ts'].every(headEq));
const manifest = fs.readFileSync(path.join(repoRoot, 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'), 'utf8');
check('§6 (E7) THE COMPLETENESS ROW: the new argumentReadingModel.ts carries its NOT_FROZEN row (the closure witness fails any unlisted src/** file) — a cures-at-HEAD manifest compare pre-commit, green at the sim tip',
  manifest.includes('NOT_FROZEN src/manuscript/argumentReadingModel.ts'));

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 2 (SEAL_ARGUMENT_CARD_PHASE2) — the RELATION half of the spine + the
// reading on it: the word-attributed pairing (via the COMMITTED replay-
// verified recovery — the registry's `pairings` is closure-private on the
// FROZEN playgroundOperations, the grounding correction flagged in the
// handback), incidence ∘ the map, stance WITH the acquired complex, the
// closure-gated verdict, the gloss, the honest fallback + header polish.
// ═══════════════════════════════════════════════════════════════════════════
const { recoverBornSurface } = req('src/playground/bornFormRouting.ts');

console.log('\n----- §7 (P2·E1/E2) ★★ the relation map FROM THE WORD — and the plants -----');
const torusRecovery = recoverBornSurface(torus.shape, torus.parentShape);
const slotNameOf = (face, slot) => {
  const n = face.vertexIds.length;
  // THE IDENTITY LAW (recut): slots are named by the parent corners' REAL
  // packet labels — recomputed here from the packets themselves, never from
  // the model's own output
  return packetEndpointName(torus.parentShape, [face.vertexIds[slot % n], face.vertexIds[(slot + 1) % n]]);
};
const expectedPairs = torusRecovery
  ? torusRecovery.pairings.map((p) => [slotNameOf(torusRecovery.parentFace, p.edgeA), slotNameOf(torusRecovery.parentFace, p.edgeB)].join('+'))
  : [];
const modelPairs = (torusReading.wordRows ?? []).map((w) => w.slotNames.join('+'));
note(`torus word: model [${modelPairs.join(' · ')}] vs recomputed [${expectedPairs.join(' · ')}]`);
check('§7 (P2·E1) ★★ THE RELATION MAP FROM THE WORD: □⟶𝕋² reads TWO attributed pairs recovered through the committed replay-verified word (recoverBornSurface — parsed from the born id, byte-verified), matching the independent recomputation SET-FOR-SET — a ← {AB,CD} · b ← {BC,DA}, both preserving; NOT "absorbed", NOT endpoint-inferred',
  torusRecovery !== null &&
    torusReading.wordRows !== null &&
    torusReading.wordRows.length === 2 &&
    modelPairs.length === 2 &&
    modelPairs.every((p, i) => p === expectedPairs[i]) &&
    torusReading.wordRows.every((w) => w.mode === 'preserving') &&
    new Set(torusReading.wordRows.flatMap((w) => w.slotNames)).size === 4);
const kleinHost = wireForm(invokePrimitive('square', 976));
const kleinApplied = applyPlaygroundOperationTo('flip-glue-klein', kleinHost.shape, null, 977, 8, [], null);
const kleinReading = kleinApplied.ok ? buildArgumentReading(kleinApplied.born) : null;
check('§7 (P2·E1) THE MODE RIDES: the Klein word (abaB) reads its second pair REVERSING (b⁻¹) while the torus\'s both preserve — the a-vs-a⁻¹ distinction comes from the committed word, never a guess',
  kleinReading !== null &&
    kleinReading.wordRows !== null &&
    kleinReading.wordRows.length === 2 &&
    kleinReading.wordRows[0].mode === 'preserving' &&
    kleinReading.wordRows[1].mode === 'reversing');
const doctoredPairs = modelPairs.map((p, i) => (i === 0 ? 'AB+DA' : p));
check('§7 (P2·E2) ★★ THE WRONG-PAIRING PLANT BITES: a doctored attribution (a ← {AB,DA}) disagrees with the recomputed committed word — the same comparator that greens the real rows',
  doctoredPairs.every((p, i) => p === expectedPairs[i]) === false);
check('§7 (P2·E2) ★★ NO FABRICATION WHERE NO WORD: the dual carrier (no recoverable word) reads wordRows === null and keeps the Phase-1 absorbed fallback — a pairing is never invented',
  dualReading.wordRows === null);

console.log('\n----- §8 (P2·E3/E4) ★★ incidence descends from the map · stance sums the sources -----');
const torusIncidence = torusReading.incidence ?? [];
const torusStance = torusReading.stance ?? [];
note(`torus incidence: ${torusIncidence.map((r) => `${[...new Set(r.relationLetters)].join('⊾')}@${r.conceptLabel} (${r.relationLetters.length} slots)`).join(' · ')}`);
check('§8 (P2·E3) ★★ INCIDENCE DESCENDS FROM THE MAP (the corner-flank walk over the oriented boundary — the only read that splits parallel self-loops): the torus\'s one concept is flanked a·b at each of its 4 corners — 8 flank letters, 2 distinct (a⊾b@p), not self-only',
  torusIncidence.length === 1 &&
    torusIncidence[0].relationLetters.length === 8 &&
    new Set(torusIncidence[0].relationLetters).size === 2 &&
    !torusIncidence[0].selfOnly);
const coneIncidence = coneReading.incidence ?? [];
const coneApexIncidence = coneIncidence.find((r) => r.conceptId === coneApexRow.resultId) ?? null;
check('§8 (P2·E3) ★★ THE CONE\'S APEX MEETS ONLY ITSELF: seam ⌐ seam @ apex — ONE relation, no partner (the substrate\'s one-relation-no-cross, the deficit\'s cause — invisible in any invariant list)',
  coneApexIncidence !== null && coneApexIncidence.selfOnly === true && new Set(coneApexIncidence.relationLetters).size === 1);
const torusStanceRow = torusStance[0] ?? null;
const coneStanceApex = (coneReading.stance ?? []).find((r) => r.conceptId === coneApexRow.resultId) ?? null;
const coneStanceRim = (coneReading.stance ?? []).find((r) => r.conceptId === coneRimRow.resultId) ?? null;
note(`stance: torus p=${torusStanceRow?.angleSumDeg}° [${torusStanceRow?.cornersDeg.join('⊕')}] · cone apex=${coneStanceApex?.angleSumDeg}° rim=${coneStanceRim?.angleSumDeg}°`);
check('§8 (P2·E4) ★★ STANCE SUMS THE SOURCE STANCES (read WITH the acquired complex): torus p: 90⊕90⊕90⊕90 = 360°; cone apex: 60 = 60° (one corner) · rim: 60⊕60 = 120°',
  torusStanceRow !== null &&
    torusStanceRow.angleSumDeg === 360 &&
    torusStanceRow.cornersDeg.length === 4 &&
    torusStanceRow.cornersDeg.every((c) => c === 90) &&
    coneStanceApex !== null &&
    coneStanceApex.angleSumDeg === 60 &&
    coneStanceApex.cornersDeg.length === 1 &&
    coneStanceRim !== null &&
    coneStanceRim.angleSumDeg === 120 &&
    coneStanceRim.valence === 'boundary');
// the dodeca stance (icosa⟶dodeca "was 300 / now 324"): MEASURED — the
// MATERIALIZED dual shape's minted faces carry NO cornerAngles (the P6
// count-only stamp lives on buildDualCorrespondenceModel.dualFaces, not the
// shape — a stance-stamp-class gap in the FROZEN dualization.ts, ROUTED UP);
// so the shelf-carrier card REFUSES the stance honestly (asserted), and the
// Form's number is verified on the P6 surface itself — the committed
// correspondence model + the ideal-dual seal, the P6 witness's own idiom
const { buildDualCorrespondenceModel } = req('src/lib/dualView.ts');
const { readIdealDualSeal } = req('src/lib/conformalAtom.ts');
const icosaCellForDual = ascent.cells.find((c) => c.topology === 'pyritohedral-icosahedron');
const dodecaModel = buildDualCorrespondenceModel(ascent, icosaCellForDual, 'dodecahedron');
const dodecaSeal = readIdealDualSeal(dodecaModel.dualFaces, 2);
const dodecaDeficits = Object.values(dodecaSeal.deficits);
check('§8 (P2·E4) …AND THE FORM\'S RUNG (on the P6 surface): the dodecahedron reads deficit π/5 = 36° UNIFORM ×20 ⟺ angleSum 108⊕108⊕108 = 324° at every concept (was 300° on the icosahedron), Σδ = 4π, the seal HOLDS — while the shelf-carrier card REFUSES the stance honestly (the materialized dual shape\'s minted faces are UN-STAMPED — a stance-stamp-class gap in frozen dualization.ts, routed up)',
  dodecaDeficits.length === 20 &&
    dodecaDeficits.every((d) => Math.abs(d - Math.PI / 5) < 1e-9) &&
    Math.abs(dodecaSeal.totalDeficit - 4 * Math.PI) < 1e-9 &&
    dodecaSeal.stampHolds &&
    dualReading.refusal !== null);

console.log('\n----- §9 (P2·E5/E6) ★★ the verdict gates on closure · the fallback + polish are honest -----');
const torusVerdict = torusReading.verdict;
const coneVerdict = coneReading.verdict;
const squareVerdict = seedReading.verdict;
note(`verdicts: torus "${torusVerdict?.global}" atForm=${torusVerdict?.atForm} · cone "${coneVerdict?.global}" · square "${squareVerdict?.global}"`);
check('§9 (P2·E5) ★★ THE VERDICT GATES ON CLOSURE: the torus (closed) reads Σδ = 0 ⇄ tiles · uniform → at its Form; the △⟶cone (BOUNDED) reads open · local-cone with the apex +300° local — NEVER "curls up"; the invoked square (BOUNDED, Σ=+360°) reads open — the flat disk is NOT a global curl',
  torusVerdict !== null &&
    torusVerdict.closed === true &&
    torusVerdict.global === 'Σδ = 0 ⇄ tiles' &&
    torusVerdict.atForm === true &&
    coneVerdict !== null &&
    coneVerdict.closed === false &&
    coneVerdict.global === 'open · local-cone' &&
    !coneVerdict.global.includes('curls') &&
    coneVerdict.locals.some((l) => l.curvatureDeg === 300 && l.kind === 'cone') &&
    squareVerdict !== null &&
    squareVerdict.closed === false &&
    squareVerdict.global === 'open · local-cone');
check('§9 (P2·E6) THE FALLBACK + THE POLISH: the dual carrier keeps absorbed (no fabricated pairing, from §7) AND the fold-born header now speaks its class word — `disk`, not the raw op',
  coneReading.header.result === 'disk' && dualReading.wordRows === null);
// THE RIM-TURN SPLIT (mothership 1230; SEAL_RIM_TURN_SPLIT): the locals'
// kinds judged against an INDEPENDENT recomputation from the readings' own
// acquired valence + sign — a boundary +δ is the rim BENDING, never a cone
const expectedLocalKind = (valence, curvatureDeg) =>
  valence === 'boundary' && curvatureDeg > 0 ? 'rim-turn' : curvatureDeg > 0 ? 'cone' : 'saddle';
const coneStanceByLabel = new Map((coneReading.stance ?? []).map((r) => [r.conceptLabel, r]));
const coneLocals = coneReading.verdict?.locals ?? [];
const coneLocalsAgree = (locals) =>
  locals.length > 0 &&
  locals.every((l) => {
    const s = coneStanceByLabel.get(l.conceptLabel);
    return s !== undefined && l.kind === expectedLocalKind(s.valence, l.curvatureDeg);
  });
note(`cone locals: ${coneLocals.map((l) => `${l.conceptLabel} ${l.curvatureDeg > 0 ? '+' : ''}${l.curvatureDeg}° ${l.kind}`).join(' · ')}`);
check('§9 (SPLIT) ★ THE RIM-TURN SPLIT IS REAL: the △⟶cone reads its TWO +δ locals with DISTINCT kinds — the interior apex (+300°) a `cone`, the boundary rim (+60°) a `rim-turn`, never `cone` — and EVERY local kind equals the independent valence+sign recomputation (the valence the acquired complex carries)',
  coneLocals.some((l) => l.kind === 'cone' && l.curvatureDeg === 300) &&
    coneLocals.some((l) => l.kind === 'rim-turn' && l.curvatureDeg === 60) &&
    !coneLocals.some((l) => l.kind === 'cone' && l.curvatureDeg === 60) &&
    coneLocalsAgree(coneLocals));
const plantedLocals = coneLocals.map((l) => (l.kind === 'rim-turn' ? { ...l, kind: 'cone' } : l));
check('§9 (SPLIT) THE PLANT BITES: the rim local forced to `cone` FAILS the same valence recomputation that greens the real locals — a boundary concept can never read `cone`',
  coneLocalsAgree(plantedLocals) === false);
check('§9 (P2·E7) THE VIEW WIRES THE READING (source-pinned): incidence — carried · stance — through the map · verdict — consequence sections + the gloss quote render from the argument; the verdict is a consequence-clause (no invariant token in the global line)',
  (() => {
    const src = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
    return (
      src.includes('incidence — carried') &&
      src.includes('stance — through the map') &&
      src.includes('verdict — consequence') &&
      src.includes('argument.gloss') &&
      !/χ|genus|H₁/.test(torusVerdict.global)
    );
  })());

// ═══════════════════════════════════════════════════════════════════════════
// THE LIFT — IDENTITY & GRAIN (SEAL_THE_LIFT_IDENTITY_AND_GRAIN): the packet
// IS the name · 'lifted' is the typing · the id names WHICH entity · the
// grain is carried-or-MARKED (slice 1: edge grain CARRIED, face interior
// MARKED — the binding bar holds). Every subject engine-minted through the
// committed doors; the comparators recompute from the SUBSTRATE; plants bite.
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n----- §10 (LIFT) ★★ identity · lifted typing · distinct id · grain carried-or-marked -----');
const { getOperation } = req('src/operations/registry.ts');
const { liftSubComplex, extractSubShape } = req('src/lib/subComplexLift.ts');
const { serializeSnapshot } = req('src/playground/snapshot.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const seedTetra = createSeedShape('tetrahedron');
const amboD = getOperation('ambo-dissection').execute({ shape: seedTetra, selectedCellId: null, selectedCell: null });
const cornerA = 'vertex:tetrahedron:a';
const cornerC = 'vertex:tetrahedron:c';
const edgeBetween = (shapeX, u, v) =>
  shapeX.edges.find(
    (e) => (e.vertexIds[0] === u && e.vertexIds[1] === v) || (e.vertexIds[0] === v && e.vertexIds[1] === u),
  );
const eAC = edgeBetween(amboD, cornerA, cornerC);
const eBD = edgeBetween(amboD, 'vertex:tetrahedron:b', 'vertex:tetrahedron:d');
const liftAC = liftSubComplex(amboD, [{ kind: 'edge', id: eAC.id }]);
const liftBD = liftSubComplex(amboD, [{ kind: 'edge', id: eBD.id }]);
const loadLift = (lifted, seq) => placeShelfEntry(loadUniverseSnapshot(serializeSnapshot(lifted.shape, amboD.id, [])), seq);
const loadedAC = loadUniverseSnapshot(serializeSnapshot(liftAC.shape, amboD.id, []));
const loadedBD = loadUniverseSnapshot(serializeSnapshot(liftBD.shape, amboD.id, []));
check('§10 (E-DISTINCT-ID) ★★ TWO different edges from ONE shape mint DISTINCT shape ids (`lift:edge:<edgeId>:from:<shape>` — the id names WHICH entity), both load placeable, and their LOADED ids stay distinct — the sheet dedup (keyed on shape.id, source-pinned in §11) admits BOTH; the collision that refused the second edge is dead',
  liftAC.shape.id !== liftBD.shape.id &&
    liftAC.shape.id.includes(eAC.id) &&
    liftBD.shape.id.includes(eBD.id) &&
    loadedAC.placeable === true &&
    loadedBD.placeable === true &&
    loadedAC.loaded.shape.id !== loadedBD.loaded.shape.id);
const liftForm = placeShelfEntry(loadedAC, 511);
const liftReading = buildArgumentReading(liftForm);
const liftedShape = liftForm.shape;
note(`lift card: ${liftReading.header.source} ⟶ ${liftReading.header.result} · "${liftReading.header.gloss}" · ${liftReading.conceptRows.map((r) => `${r.label}(${r.typing})`).join(' · ')}`);
const liftedPacketLabels = Object.values(liftedShape.vertices).map((v) => v.data.label);
check('§10 (E-GRAIN) ★★ THE A-AC-C GRAIN RIDES THE EDGE LIFT (Arman\'s case): the lifted coarse A-C carries 3 vertices (the T-junction: both corners + the collinear midpoint, packets intact) + 3 edges (the coarse span + both half-edges) — and NOTHING was refused, so the card carries NO grain mark',
  Object.keys(liftedShape.vertices).length === 3 &&
    liftedShape.edges.length === 3 &&
    new Set(liftedPacketLabels).size === 3 &&
    ['A', 'C', 'AC'].every((name) => liftedPacketLabels.includes(name)) &&
    liftReading.grainMarks.length === 0);
check('§10 (E-IDENTITY) ★★ THE REAL NAME READS ITSELF — the card\'s concept labels are EXACTLY the packets\' own {A, C, AC}; the positional fabrication is DEAD: the real "C" never reads "B" (the OLD sorted-root lettering minted exactly that here — measured pre-cure), and no row falls to a raw id tail',
  liftReading.conceptRows.length === 3 &&
    ['A', 'C', 'AC'].every((name) => liftReading.conceptRows.some((r) => r.label === name)) &&
    !liftReading.conceptRows.some((r) => r.label === 'B') &&
    liftReading.conceptRows.every((r) => ['A', 'C', 'AC'].includes(r.label)));
check('§10 (E-LIFTED-TYPING) ★★ \'lifted\' IS THE TYPING, THE LIFE-LINE READS THROUGH: every concept AND relation types `lifted` (never born/invoked); the C corner\'s life-line reads "seed corner of the tetrahedron" (subject + source universe + lineage, `createdBy` verbatim); the midpoint\'s origin op is `ambo-dissection`; the header speaks "lifted from Ambo Dissection Tetrahedron" — not "invoked"; the words say "lifted whole"',
  liftReading.op === 'patch-lift' &&
    liftReading.conceptRows.every((r) => r.typing === 'lifted') &&
    liftReading.relationRows.every((r) => r.typing === 'lifted') &&
    liftReading.conceptRows.find((r) => r.label === 'C')?.origin?.display === 'seed corner of the tetrahedron' &&
    liftReading.conceptRows.find((r) => r.label === 'AC')?.origin?.op === 'ambo-dissection' &&
    liftReading.header.source === 'Ambo Dissection Tetrahedron' &&
    liftReading.header.gloss === 'lifted from Ambo Dissection Tetrahedron' &&
    liftReading.words.includes('lifted whole'));
// the FACE lift — slice 1's binding bar: the side grain (A-AC-C on every
// side) is CARRIED, the strictly-2D interior (the mid-face + the residue
// dissection, coplanar-contained — detected geometrically) is honestly MARKED
const coarseFace = amboD.faces.find(
  (f) => f.role === 'parent-cell-face' && f.vertexIds.every((v) => seedTetra.vertices[v]),
);
const faceLift = liftSubComplex(amboD, [{ kind: 'face', id: coarseFace.id }]);
const faceForm = loadLift(faceLift, 512);
const faceReading = buildArgumentReading(faceForm);
note(`face lift: v=${Object.keys(faceForm.shape.vertices).length} e=${faceForm.shape.edges.length} · marks=${JSON.stringify(faceReading.grainMarks)}`);
check('§10 (E-GRAIN) ★★ THE FACE CARRIES ITS SIDES\' GRAIN AND MARKS ITS INTERIOR (slice 1, the binding bar): the coarse face lifts 6 vertices (3 corners + 3 side midpoints) + 9 edges (3 coarse sides + 6 half-edges), and the card carries the honest mark "coarse face; finer structure not carried" — surfaced in the words too; NEVER a silently bare coarse face',
  Object.keys(faceForm.shape.vertices).length === 6 &&
    faceForm.shape.edges.length === 9 &&
    faceReading.grainMarks.includes('coarse face; finer structure not carried') &&
    faceReading.words.includes('finer structure not carried'));
// THE USER'S OWN NAME — the committed doors end-to-end: the workspace store's
// ambo → selectVertex → updateSelectedVertexData (the packet editor's door)
// → the lift → the card reads the person's word; a blanked packet reads
// `unnamed`, never a fabricated letter
const { useGeometryStore } = req('src/store/geometryStore.ts');
useGeometryStore.getState().applyOperationToSelection('ambo-dissection');
const workShape0 = useGeometryStore.getState().shapes[useGeometryStore.getState().currentShapeId];
const workAC = edgeBetween(workShape0, cornerA, cornerC);
useGeometryStore.getState().selectVertex(cornerC);
useGeometryStore.getState().updateSelectedVertexData({ label: 'fact' });
useGeometryStore.getState().selectVertex(cornerA);
useGeometryStore.getState().updateSelectedVertexData({ label: '   ' });
const workShape = useGeometryStore.getState().shapes[useGeometryStore.getState().currentShapeId];
const renamedLift = liftSubComplex(workShape, [{ kind: 'edge', id: workAC.id }]);
const renamedForm = placeShelfEntry(loadUniverseSnapshot(serializeSnapshot(renamedLift.shape, workShape.id, [])), 513);
const renamedReading = buildArgumentReading(renamedForm);
note(`renamed card: ${renamedReading.conceptRows.map((r) => r.label).join(' · ')}`);
check('§10 (E-IDENTITY) ★★ THE USER\'S NAME + THE PLACEHOLDER, through the committed doors (store ambo → selectVertex → updateSelectedVertexData → lift → load): the corner renamed "fact" reads "fact"; the corner blanked to whitespace reads "unnamed" — NEVER a fabricated letter, NEVER the erased name resurrected',
  renamedReading.conceptRows.some((r) => r.label === 'fact') &&
    renamedReading.conceptRows.some((r) => r.label === 'unnamed') &&
    !renamedReading.conceptRows.some((r) => r.label === 'A' || r.label === 'B'));

console.log('\n----- §10 (PLANTS) ★★ a fabricated letter · a dropped subdivision — both bite -----');
// the INDEPENDENT packet judge: a concept whose vertex carries a real,
// non-degenerate packet label MUST read exactly that label (modulo the ·X
// disambiguating index) — recomputed from the SHAPE, never from the model
const packetJudge = (reading, shapeX) =>
  reading.conceptRows.every((row) => {
    const packet = shapeX.vertices[row.resultId]?.data;
    const own = packet && typeof packet.label === 'string' ? packet.label.trim() : '';
    if (own.length > 0 && own !== row.resultId) {
      return row.label.replace(/·[A-Z]\d*$/, '') === own;
    }
    return true; // degenerate/absent packets are judged by the other clauses
  });
const fabricatedCard = {
  ...liftReading,
  conceptRows: liftReading.conceptRows.map((r) => (r.label === 'C' ? { ...r, label: 'B' } : r)),
};
check('§10 (PLANT) ★★ THE FABRICATED LETTER BITES: forcing the positional "B" over the real packet "C" FAILS the independent packet judge that greens the real card',
  packetJudge(liftReading, liftedShape) === true && packetJudge(fabricatedCard, liftedShape) === false);
// the dropped subdivision: the PRE-CURE closure (endpoints only, no mark),
// hand-built and run through the SAME committed extraction + load — a
// silently bare lift (no AC, no mark) fails the carried-or-marked judge
const bareClosure = { cellIds: [], faceIds: [], edgeIds: [eAC.id], vertexIds: [cornerA, cornerC] };
const bareLift = extractSubShape(amboD, bareClosure, `edge:${eAC.id}`);
const bareForm = placeShelfEntry(loadUniverseSnapshot(serializeSnapshot(bareLift.shape, amboD.id, [])), 514);
const bareReading = buildArgumentReading(bareForm);
const carriedOrMarked = (reading) =>
  reading.conceptRows.some((r) => r.label === 'AC') || reading.grainMarks.length > 0;
check('§10 (PLANT) ★★ THE DROPPED SUBDIVISION BITES: the pre-cure endpoints-only closure (grain silently omitted, no mark) FAILS the carried-or-marked judge that greens BOTH real lifts (the edge: grain carried · the face: interior marked) — the binding bar is structural, not a wish',
  carriedOrMarked(liftReading) === true &&
    carriedOrMarked(faceReading) === true &&
    carriedOrMarked(bareReading) === false);

// ═══════════════════════════════════════════════════════════════════════════
// §11 THE WALK — every OperationKind reads packet identity (the witness bar:
// seed/invoke · glue/flip-glue · cut · collapse · product · patch-lift ★§10 ·
// dual · ambo · refine). Registry census (measured): the walkable doors are
// the playground ops + ambo-dissection (≡ the ambo group) + the P2 dual
// carrier + thicken (product) + bisectSurface (refine); `assemble` and
// `pyritohedral-diagonalization` have no card-reachable birth door today —
// their op-words ride the reasoned `the <op> move` fall-through (never
// silent). The invoked-primitive leg is §3's (loadForm mints op `seed` —
// measured; the OP_WORDS `invoke` entry stands honest-but-dormant).
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n----- §11 (WALK) every birth-op reads packet identity + its word + its typing -----');
const { thicken } = req('src/lib/thicken.ts');
const { bisectSurface } = req('src/lib/surfaceRefinement.ts');
const wrapCarrier = (shapeX, parentX, title) => ({
  id: `w-walk-${title}`,
  title,
  shape: shapeX,
  parentShape: parentX,
  opId: null,
  provenance: 'witness carrier (the shelf-load pattern)',
  render: { mode: 'bodiless', reason: 'witness carrier', shape: shapeX },
});
const seedWalk = buildArgumentReading(wrapCarrier(seedTetra, null, 'seed'));
check('§11 (WALK) ★ SEED + INVOKE: the seed tetrahedron\'s card reads its 4 corners by their REAL packet names A·B·C·D (all born, their own roots); the invoked square (§3\'s leg) reads v0..v3 — both judged by the independent packet comparator',
  seedWalk.op === 'seed' &&
    ['A', 'B', 'C', 'D'].every((name) => seedWalk.conceptRows.some((r) => r.label === name)) &&
    seedWalk.conceptRows.every((r) => r.typing === 'born') &&
    packetJudge(seedWalk, seedTetra) &&
    ['v0', 'v1', 'v2', 'v3'].every((name) => seedReading.conceptRows.some((r) => r.label === name)) &&
    packetJudge(seedReading, sqHost.shape));
const cutApplied = applyPlaygroundOperationTo('cut', triHost.shape, null, 611, 8, [], triHost.shape.faces[0].id);
const cutWalk = cutApplied.ok ? buildArgumentReading(cutApplied.born) : null;
const collapseApplied = applyPlaygroundOperationTo('collapse-sphere', sqHost.shape, null, 612, 8, [], null);
const collapseWalk = collapseApplied.ok ? buildArgumentReading(collapseApplied.born) : null;
note(`cut: ${cutWalk ? cutWalk.conceptRows.map((r) => `${r.label}(${r.typing})`).join(' ') : cutApplied.reason} · collapse: ${collapseWalk ? collapseWalk.conceptRows.map((r) => `${r.label}(${r.typing})`).join(' ') : collapseApplied.reason}`);
check('§11 (WALK) ★ GLUE + FLIP-GLUE + CUT + COLLAPSE: the torus\'s identified class reads THROUGH its members\' real names (v0·v1·v2·v3 — the id-as-label mint has no independent name, so the members\' packets speak); the klein likewise judged; the cut form keeps its corners\' real names; the collapse-born class reads through its members — every card packet-judged',
  torusReading.conceptRows[0].label === 'v0·v1·v2·v3' &&
    packetJudge(torusReading, torus.shape) &&
    packetJudge(kleinReading, kleinApplied.born.shape) &&
    cutWalk !== null &&
    ['v0', 'v1', 'v2'].every((name) => cutWalk.conceptRows.some((r) => r.label === name)) &&
    packetJudge(cutWalk, cutApplied.born.shape) &&
    collapseWalk !== null &&
    collapseWalk.conceptRows.every((r) => r.label.split('·').every((part) => /^v\d$|^[A-Z]\d*$/.test(part))) &&
    packetJudge(collapseWalk, collapseApplied.born.shape));
const bandLift = thicken(liftAC.shape);
const bandWalk = buildArgumentReading(wrapCarrier(bandLift.shape, liftAC.shape, 'band'));
// the refine door refines BORN WORD-FORMS (measured: the raw invoked polygon
// refuses — "the rim op refines born word-forms"); the subject is the
// fold-born cone, its resolution a re-expression that keeps op `refine`
const refined = bisectSurface(cone.shape, triHost.shape);
const refineWalk = buildArgumentReading(wrapCarrier(refined.shape, triHost.shape, 'refined'));
const amboWalk = buildArgumentReading(wrapCarrier(amboD, seedTetra, 'ambo'));
note(`product: ${bandWalk.conceptRows.map((r) => r.label).join(' ')} · refine op=${refineWalk.op} res=${refined.refinement?.typeClaim ?? 'none'} ${refineWalk.conceptRows.map((r) => r.label).join(' ')} · ambo ${amboWalk.conceptRows.map((r) => `${r.label}(${r.typing})`).join(' ')}`);
check('§11 (WALK) ★ PRODUCT + DUAL + AMBO + REFINE: the ×I band\'s copies read through their sources\' real names (A/C/AC + the ·X index — the copy mints id-as-label); the dual carrier is packet-judged (born-of-face rows ride §3); the ambo universe reads 4 SURVIVED corners A–D + 6 midpoints AB..CD (typed `identified` — the ratified ≥2-sources rule\'s letter, flagged) with its own op word; the refined cone keeps its BIRTH op (`glue` — refine is a RESOLUTION, not a birth; the trace rides `genealogy.resolution`) and mints finer concepts without erasing a name — every card packet-judged',
  bandWalk.op === 'product' &&
    bandWalk.conceptRows.every((r) => ['A', 'C', 'AC'].includes(r.label.replace(/·[A-Z]\d*$/, ''))) &&
    packetJudge(bandWalk, bandLift.shape) &&
    packetJudge(dualReading, dualShape) &&
    amboWalk.op === 'ambo-dissection' &&
    ['A', 'B', 'C', 'D'].every((name) => amboWalk.conceptRows.some((r) => r.label === name && r.typing === 'survived')) &&
    ['AB', 'AC', 'AD', 'BC', 'BD', 'CD'].every((name) => amboWalk.conceptRows.some((r) => r.label === name && r.typing === 'identified')) &&
    amboWalk.header.gloss === 'corners cut to midpoints — the ambo dissection' &&
    packetJudge(amboWalk, amboD) &&
    refineWalk.op === 'glue' &&
    refined.refinement?.typeClaim === 'resolution' &&
    refineWalk.conceptRows.length > (coneReading?.conceptRows.length ?? 0) &&
    packetJudge(refineWalk, refined.shape));
const viewSrcNow = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('§11 (VIEW) THE LIFT RENDERS (source-pinned): the view draws the life-line (`origin.display` + the ", lifted" branch), renders the grain marks (⚠ + `argument.grainMarks`), counts `lifted` in the grouped line, and keys the sheet dedup on `shape.id` (the exact predicate the distinct id unblocks)',
  viewSrcNow.includes('origin.display') &&
    viewSrcNow.includes('argument.grainMarks') &&
    viewSrcNow.includes('`${lifted} lifted`') &&
    viewSrcNow.includes('w.form.shape.id === item.entry.loaded.shape.id'));
check('§11 (E-NO-UNION) NOTHING FROZEN MOVED: ambo.ts (the mechanism is the LIFT, not the ambo — the T-junction stays real) · types/geometry.ts · lib/shape.ts · store/geometryStore.ts · the MANIFEST — all BYTE-IDENTICAL to HEAD (no union, no new file, no new row owed)',
  ['src/lib/ambo.ts', 'src/types/geometry.ts', 'src/lib/shape.ts', 'src/store/geometryStore.ts', 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'].every(headEq));

console.log(
  `\n--- THE ARGUMENT-READING CARD — the MAP is the spine, Phase 2 completes the reading, THE LIFT carries identity + grain (the packet is the name, 'lifted' the typing, the id names WHICH entity, the grain carried-or-marked): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
