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
        jsx: ts.JsxEmit.ReactJSX, // §14 reads the field LAYER (.tsx) — the field witness's own hook option
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
const { buildArgumentReading, mergedMembersOf, mergedRootsPhrase } = req('src/manuscript/argumentReadingModel.ts');

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
// THE REFERENCE READ (designer-ruled, composing the roles case with its own
// principle): an endpoint/roles POSITION asks WHICH ONE — the thing is never
// absent there, only its name may be — so an unnamed end reads its ADDRESS
// (the id tail), never the absence word; no handle, no count, no index
// (position carries the direction; an address is not a handle — the form
// already has it). THE RUN GLYPH (B-132 §1): the recorded endpoint pair is
// an ORDERED RUN and joins `→` SET TIGHT — the tight setting makes the pair
// one unit under the row's loose ` ← `; `·` read as a set and hid the cycle.
// Recomputed INDEPENDENTLY here from the parent's own packets + the ruled
// rule — never from the model's output.
const expectedRootName = (parentShape, id) => {
  const label = parentShape.vertices[id]?.data?.label?.trim() ?? '';
  if (label.length > 0 && label !== id) return label;
  return id.split(':').pop() ?? id;
};
const packetEndpointName = (parentShape, ids) =>
  ids.map((id) => expectedRootName(parentShape, id)).join('→');
check('§1 (E1) the relations read the RECORDED correspondence (measured substrate: fresh ids + sourceVertexIds, the partner ABSORBED): 2 surviving relation rows each NAMED by its source edge\'s endpoint REFERENCE reads (name-or-address, the ordered run joined `→` SET TIGHT — `v0→v1` style, recomputed independently), 2 ABSORBED partners named likewise, and the words count 4→1 · 4→2 · 2 absorbed',
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
// §1b (B-2026-08-25-A §2) — THE COUNT FORM, pinned FROM THE RULE (the
// designer's table verbatim, never from the new output): when two terms in
// a composed sentence cannot be told apart by their names, the sentence
// COUNTS them instead of indexing them — set notation manufactures a token
// per slot; the count form has no slot to fill.
// ---------------------------------------------------------------------------
console.log('\n----- §1b (COUNT FORM) ★★ the merged line counts what it cannot tell apart -----');
check('§1b (COUNT FORM) ★★ HER TABLE, case for case: both named → {AB, CD} · neither named → two unnamed roots · one named → {AB, one unnamed root} · a real collision → two roots named AB — and the live torus row carries FOUR nulls in rootOwnNames (no handle, no word) whose phrase reads `four unnamed roots`, never the false sentence {unnamed, unnamed, …}',
  mergedRootsPhrase(['AB', 'CD']) === '{AB, CD}' &&
    mergedRootsPhrase([null, null]) === 'two unnamed roots' &&
    mergedRootsPhrase(['AB', null]) === '{AB, one unnamed root}' &&
    mergedRootsPhrase(['AB', 'AB']) === 'two roots named AB' &&
    torusReading.conceptRows[0].rootOwnNames.length === 4 &&
    torusReading.conceptRows[0].rootOwnNames.every((n) => n === null) &&
    mergedRootsPhrase(torusReading.conceptRows[0].rootOwnNames) === 'four unnamed roots');

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
check('§5 (E6) THE TWO HANDS + THE SECTIONS ARE WIRED: the view carries the SIGN_HAND stack (DejaVu Sans + symbol fallbacks), mounts ArgumentMapSection with the argument prop (multiline JSX since D2 threaded the emphasis through it), renders the `certificate` receipt with expand-in-place state (setCertificateOpen), and passes the argument prop from the selectedArgument memo',
  viewSrc.includes('const SIGN_HAND') &&
    /<ArgumentMapSection\s+argument=\{argument\}/.test(viewSrc) &&
    viewSrc.includes('setCertificateOpen') &&
    viewSrc.includes('argument={selectedArgument}'));
const allRowText = [
  ...torusReading.conceptRows.map((r) => `${r.label} ${r.rootLabels.join(' ')}`),
  ...torusReading.relationRows.map((r) => r.label),
  torusReading.words,
].join(' ');
check('§5 (E6) THE SCRATCH TEST (structural, B-132 recut): the MAP rows and words carry NO invariant token — and the routing constant is DEAD: the model no longer carries certificateLabels (kinds are DECLARED per specimen row at the producer; a classification that matches on display copy changes when someone improves the wording)',
  !/χ|genus|w₁|H₁/.test(allRowText) &&
    !('certificateLabels' in torusReading));

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
check('§7 (P2·E1) ★★ THE RELATION MAP FROM THE WORD: □⟶𝕋² reads TWO attributed pairs recovered through the committed replay-verified word (recoverBornSurface — parsed from the born id, byte-verified), matching the independent recomputation SET-FOR-SET, both preserving; NOT "absorbed", NOT endpoint-inferred. THE REFERENCE READ: unnamed ends read their ADDRESSES (never the absence word — each slot distinct), no handle owed, and the record keeps the role in the slot INDICES',
  torusRecovery !== null &&
    torusReading.wordRows !== null &&
    torusReading.wordRows.length === 2 &&
    modelPairs.length === 2 &&
    modelPairs.every((p, i) => p === expectedPairs[i]) &&
    torusReading.wordRows.every((w) => w.mode === 'preserving') &&
    new Set(torusReading.wordRows.flatMap((w) => w.slotIndices)).size === 4 &&
    torusReading.wordRows.every((w) => w.slotNames.every((s) => !s.includes('unnamed'))));
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
check('§8 (P2·E4) …AND THE FORM\'S RUNG (on the P6 surface — THE CONFORMAL ASCENT, R2-corrected framing: the number is the IDEALIZE\'s, count-only by construction, never a metric claim about the drawn dual\'s positions): the dodecahedron reads deficit π/5 = 36° UNIFORM ×20 ⟺ angleSum 108⊕108⊕108 = 324° at every concept (was 300° on the icosahedron), Σδ = 4π BY THE IDEALIZE, the seal HOLDS — while the shelf-carrier card REFUSES the stance honestly (the materialized dual shape\'s minted faces are UN-STAMPED — a stance-stamp-class gap in frozen dualization.ts, routed up)',
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
// B-103 §2e recut: keyed by conceptId, the === contract — with the class
// label falling to the guard, two rows can honestly share 'unnamed' and a
// label-keyed map collapses (the exact collision the id key exists for)
const coneStanceById = new Map((coneReading.stance ?? []).map((r) => [r.conceptId, r]));
const coneLocals = coneReading.verdict?.locals ?? [];
const coneLocalsAgree = (locals) =>
  locals.length > 0 &&
  locals.every((l) => {
    const s = coneStanceById.get(l.conceptId);
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
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
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
check('§10 (E-DISTINCT-ID + E-COSMETIC-ID) ★★ TWO different edges from ONE shape mint DISTINCT shape ids (`lift:edge:<hash>:from:<shape>` — the id names WHICH entity, with ONE kind prefix — the SLICE2 un-doubling), both load placeable, and their LOADED ids stay distinct — the sheet dedup (keyed on shape.id, source-pinned in §11) admits BOTH; the collision that refused the second edge is dead',
  liftAC.shape.id !== liftBD.shape.id &&
    liftAC.shape.id === `lift:${eAC.id}:from:${amboD.id}` &&
    liftBD.shape.id === `lift:${eBD.id}:from:${amboD.id}` &&
    !/edge:edge:/.test(liftAC.shape.id) &&
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
check('§10 (E-LIFTED-TYPING, Phase-C recut) ★★ CONCEPTS TYPE `lifted` WITH THE LIFE-LINE; RELATIONS READ THEIR SOURCE-ROLE THROUGH THE LIFT (researcher 2240 — a relation is a meaning that persists): the coarse A-C (seed-story endpoints) reads `born` — a premise; both halves (a minted midpoint endpoint) read `derived`; the C corner\'s life-line reads "seed corner of the tetrahedron"; the header speaks "lifted from Ambo Dissection Tetrahedron"; the words say "lifted whole"',
  liftReading.op === 'patch-lift' &&
    liftReading.conceptRows.every((r) => r.typing === 'lifted') &&
    liftReading.relationRows.filter((r) => r.typing === 'born').length === 1 &&
    liftReading.relationRows.filter((r) => r.typing === 'derived').length === 2 &&
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
check('§10 (E-FACE-CARRY→MANIFOLD) ★★ THE FACE LIFTS AS A MANIFOLD DISK (PHASE B — coarse-as-relation): 6 vertices + 9 LIVE edges (6 halves + 3 chords — the finer subdivision IS the boundary) + 4 LIVE faces (the core mid-face + 3 residues; the coarse face is a RECORDED relation, not a live layer), NO mark; the words read "lifted whole" unflagged',
  Object.keys(faceForm.shape.vertices).length === 6 &&
    faceForm.shape.edges.length === 9 &&
    faceForm.shape.faces.length === 4 &&
    faceForm.shape.faces.some((f) => f.role === 'dissection-core-face') &&
    faceForm.shape.faces.filter((f) => f.role === 'dissection-residue-face').length === 3 &&
    faceReading.grainMarks.length === 0 &&
    faceReading.words.includes('lifted whole') &&
    !faceReading.words.includes('finer structure not carried'));
// PHASE B (SEAL_PHASE_B_MANIFOLD) — the 4-surface bar, judged independently
const { readVertexCurvatures: readCurvB } = req('src/lib/conformalAtom.ts');
const { acquireComplex: acquireB } = req('src/lib/complexIdentification.ts');
const manifoldShape = faceForm.shape;
const degreeB = {};
for (const e of manifoldShape.edges) for (const v of e.vertexIds) degreeB[v] = (degreeB[v] ?? 0) + 1;
const edgeFaceCount = new Map(manifoldShape.edges.map((e) => [e.id, 0]));
for (const f of manifoldShape.faces) {
  const vs = f.vertexIds;
  for (let i = 0; i < vs.length; i += 1) {
    const a = vs[i];
    const b = vs[(i + 1) % vs.length];
    for (const e of manifoldShape.edges) {
      if ((e.vertexIds[0] === a && e.vertexIds[1] === b) || (e.vertexIds[0] === b && e.vertexIds[1] === a)) {
        edgeFaceCount.set(e.id, (edgeFaceCount.get(e.id) ?? 0) + 1);
      }
    }
  }
}
const boundaryEdges = manifoldShape.edges.filter((e) => edgeFaceCount.get(e.id) === 1);
// the degree-2 boundary walk — every boundary vertex crossed exactly once
const walkAdj = new Map();
for (const e of boundaryEdges) {
  walkAdj.set(e.vertexIds[0], [...(walkAdj.get(e.vertexIds[0]) ?? []), e.vertexIds[1]]);
  walkAdj.set(e.vertexIds[1], [...(walkAdj.get(e.vertexIds[1]) ?? []), e.vertexIds[0]]);
}
let walkOk = boundaryEdges.length === 6 && [...walkAdj.values()].every((n) => n.length === 2);
if (walkOk) {
  const start = boundaryEdges[0].vertexIds[0];
  const visited = new Set([start]);
  let prev = null;
  let cur = start;
  for (let steps = 0; steps < 12; steps += 1) {
    const next = (walkAdj.get(cur) ?? []).find((n) => n !== prev);
    if (!next) break;
    prev = cur;
    cur = next;
    if (cur === start) break;
    visited.add(cur);
  }
  walkOk = cur === start && visited.size === 6;
}
let stanceB = null;
try {
  const acq = acquireB(manifoldShape, [manifoldShape]);
  stanceB = acq ? readCurvB(manifoldShape, acq.complex) : null;
} catch {
  stanceB = null;
}
const stanceDeg = (x) => Math.round(((x * 180) / Math.PI) * 10) / 10;
check('§10 (E-MANIFOLD) ★★ THE 4-SURFACE BAR: no junction (corners degree 2, midpoints degree 4 — a manifold boundary fan), the boundary WALKS degree-2 through all 6 vertices, and the STANCE MEASURES (no junction throw): corners 120° ×3 + midpoints 0° ×3 = Σ 360° — the coarse face\'s own stance by SUBDIVISION INVARIANCE',
  Object.values(degreeB).every((d) => d === 2 || d === 4) &&
    walkOk &&
    stanceB !== null &&
    stanceB.length === 6 &&
    stanceB.every((r) => r.valence === 'boundary') &&
    stanceB.filter((r) => stanceDeg(r.curvature) === 120).length === 3 &&
    stanceB.filter((r) => Math.abs(stanceDeg(r.curvature)) < 1e-9).length === 3);
const composedB = faceLift.closure.composedRelations ?? [];
const composedEdges = composedB.filter((r) => r.kind === 'edge' && r.relation === 'composed-of');
const composedFaces = composedB.filter((r) => r.kind === 'face' && r.relation === 'composed-of');
const liveEdgeIdsB = new Set(faceLift.shape.edges.map((e) => e.id));
const liveFaceIdsB = new Set(faceLift.shape.faces.map((f) => f.id));
check('§10 (E-COARSE-AS-RELATION) ★★ EACH COARSE SIDE IS A COMPOSED RELATION, NOT A LIVE EDGE: 3 edge records, each a 2-half PATH between seed corners whose parts are LIVE and whose composed id is NOT (nothing erased — the union of halves IS the side); the coarse FACE rides as 1 composed record over the 4 live tiles; the stamps survive the committed load on the NAMED field (#37 GAP 1: `composes` on every part, loader-re-rooted — the data blob is retired)',
  composedEdges.length === 3 &&
    composedEdges.every(
      (r) =>
        r.parts.length === 2 &&
        r.parts.every((p) => liveEdgeIdsB.has(p)) &&
        !liveEdgeIdsB.has(r.id) &&
        r.sourceVertexIds.length === 2 &&
        r.sourceVertexIds.every((v) => seedTetra.vertices[v]),
    ) &&
    composedFaces.length === 1 &&
    composedFaces[0].parts.length === 4 &&
    composedFaces[0].parts.every((p) => liveFaceIdsB.has(p)) &&
    !liveFaceIdsB.has(composedFaces[0].id) &&
    manifoldShape.edges.filter((e) => e.composes).length === 6 &&
    manifoldShape.faces.filter((f) => f.composes).length === 4 &&
    manifoldShape.edges.every((e) => !(e.data && e.data.composes)) &&
    manifoldShape.faces.every((f) => !(f.data && f.data.composes)));
// E-TWIN: select BOTH records of a shared wall (the dissection writes one per
// cell) as a 2-entity region — ONE lives, the twin becomes SHARED-BY
const twinPair = (() => {
  for (const fa of amboD.faces) {
    for (const fb of amboD.faces) {
      if (fa.id === fb.id) continue;
      const setA = [...fa.vertexIds].sort().join('|');
      const setB = [...fb.vertexIds].sort().join('|');
      if (setA === setB) return [fa, fb];
    }
  }
  return null;
})();
const twinLift = twinPair
  ? liftSubComplex(amboD, [
      { kind: 'face', id: twinPair[0].id },
      { kind: 'face', id: twinPair[1].id },
    ])
  : null;
const twinRecords = twinLift ? (twinLift.closure.composedRelations ?? []).filter((r) => r.relation === 'shared-by' && r.kind === 'face') : [];
check('§10 (E-TWIN-SHARED-BY) ★ A SHARED WALL IS ONE LIVE FACE + A SHARED-BY RELATION: lifting both twin records of a dissection wall keeps ONE live face; the duplicate is recorded (the kept copy\'s NAMED `sharedBy` field names it — #37 GAP 1), never N live layers',
  twinLift !== null &&
    twinLift.shape.faces.length === 1 &&
    twinRecords.length === 1 &&
    twinRecords[0].parts[0] === twinLift.shape.faces[0].id &&
    Array.isArray(twinLift.shape.faces[0].sharedBy) &&
    twinLift.shape.faces[0].sharedBy.includes(twinRecords[0].id));
// S3 — THE CO-WOUND REGION (SEAL_S3_BLACK_TRIANGLE_S4_SURFACE_LOCK): the
// dissection's medial cell arrived ANTI-wound (Newell·ref −1.000, the
// engineer's probe) — the lift now co-orients every coplanar carried face
const newellS3 = (face, verts) => {
  const pts = face.vertexIds.map((id) => verts[id]?.position);
  if (pts.some((p) => !p) || pts.length < 3) return null;
  let nx = 0, ny = 0, nz = 0;
  for (let i = 0; i < pts.length; i += 1) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    nx += (p[1] - q[1]) * (p[2] + q[2]);
    ny += (p[2] - q[2]) * (p[0] + q[0]);
    nz += (p[0] - q[0]) * (p[1] + q[1]);
  }
  const len = Math.hypot(nx, ny, nz);
  return len > 1e-12 ? [nx / len, ny / len, nz / len] : null;
};
check('§10 (E-S3-WINDING) ★ THE COPLANAR REGION CO-WINDS: every live face of the lifted manifold disk winds WITH the reference (Newell·ref +1.000 — the anti-wound medial cell is co-oriented AT THE LIFT, the source of the winding; a black back-face fill owns no cell)',
  (() => {
    const normals = manifoldShape.faces.map((f) => newellS3(f, manifoldShape.vertices)).filter(Boolean);
    return (
      normals.length === 4 &&
      normals.every((n) => n[0] * normals[0][0] + n[1] * normals[0][1] + n[2] * normals[0][2] > 0.999)
    );
  })());
// E-NUL: the delimiter is the ESCAPE now — the file is pure text
const liftBytes = fs.readFileSync(path.join(repoRoot, 'src/lib/subComplexLift.ts'));
check('§10 (E-NUL) THE FILE IS TEXT: zero NUL bytes in subComplexLift.ts (the delimiter is the `\\0` ESCAPE — runtime-identical key, git-diffable source; the pre-fix blob was binary and blinded the diff audits)',
  !liftBytes.includes(0) && liftBytes.toString('utf8').includes('`${a}\\0${b}`'));

// ═══════════════════════════════════════════════════════════════════════════
// PHASE C (SEAL_PHASE_C_CARD_REGISTRY) — THE CARD READS THE REGISTRY: the
// coarse seed relations surface as COMPOSED-PATH rows; the two-sided bar
// (no name without a PLACE · no real relation DROPPED) is judged by
// independent comparators and both plants bite.
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n----- §12 (PHASE C) ★★ the coarse relation surfaces as a composed path — the two-sided bar -----');
const composedRows = faceReading.composedRelationRows;
const liveEdgeIdSet = new Set(manifoldShape.edges.map((e) => e.id));
const liveFaceIdSet = new Set(manifoldShape.faces.map((f) => f.id));
note(`composed rows: ${composedRows.map((r) => `${r.label} ← ${r.pathLabels.join(' ∘ ')} (${r.typing}/${r.kind})`).join(' · ')}`);
check('§12 (E-SURFACE) ★★ EACH COARSE SEED RELATION SURFACES AS A COMPOSED PATH read from the Phase-B registry: 3 rows (one per dropped side), each `A·B ← A·AB ∘ AB·B`-shaped — a 2-part ordered LIVE path between ·-joined seed-corner names; NOT absent, NOT a live-edge duplicate (the ids stay off the live set); the words count them honestly ("+ 3 composed seed relations", never a bare 9)',
  composedRows.filter((r) => r.kind === 'composed-of').length === 3 &&
    composedRows
      .filter((r) => r.kind === 'composed-of')
      .every(
        (r) =>
          r.pathIds.length === 2 &&
          r.pathIds.every((p) => liveEdgeIdSet.has(p)) &&
          !liveEdgeIdSet.has(r.id) &&
          r.label.includes('·') &&
          r.pathLabels.length === 2 &&
          r.pathLabels.every((p) => p.includes('·')),
      ) &&
    faceReading.words.includes('+ 3 composed seed relations') &&
    faceReading.words.includes('9 finer relations'));
// the INDEPENDENT place judge — every named relation resolves to a DRAWN
// place: a live edge (finer rows) or a path through live parts (composed)
const placeJudge = (reading, liveEdges, liveFaces) =>
  reading.relationRows.every((r) => liveEdges.has(r.resultId)) &&
  reading.composedRelationRows.every(
    (r) =>
      r.pathIds.length > 0 &&
      r.pathIds.every((p) => (r.kind === 'shared-by' ? liveEdges.has(p) || liveFaces.has(p) : liveEdges.has(p))),
  );
const phantomCard = {
  ...faceReading,
  composedRelationRows: faceReading.composedRelationRows.map((r, i) =>
    i === 0 ? { ...r, pathIds: ['edge:FABRICATED-NO-PLACE'] } : r,
  ),
};
check('§12 (E-NO-PHANTOM) ★★ NO NAME WITHOUT A PLACE — and the plant bites: every named relation resolves to a drawn place (a live edge, or a path through live parts); a composed row doctored to a fabricated path FAILS the same judge that greens the real card (Arman\'s original letter-with-no-place cannot recur)',
  placeJudge(faceReading, liveEdgeIdSet, liveFaceIdSet) === true &&
    placeJudge(phantomCard, liveEdgeIdSet, liveFaceIdSet) === false);
// the INDEPENDENT drop judge — the shape's own registry census must equal
// the surfaced count (nothing recorded may vanish from the card)
const dropJudge = (reading, shapeX) => {
  const registry = new Set();
  for (const e of shapeX.edges) {
    const c = e.composes; // #37 GAP 1: the NAMED field is the registry
    if (c && c.kind === 'edge' && typeof c.id === 'string') registry.add(c.id);
  }
  return reading.composedRelationRows.filter((r) => r.kind === 'composed-of').length === registry.size;
};
const droppedCard = { ...faceReading, composedRelationRows: faceReading.composedRelationRows.filter((r) => r.kind !== 'composed-of') };
check('§12 (E-NO-DROP) ★★ NO REAL RELATION SILENTLY DROPPED — and the plant bites: the surfaced composed count equals the shape\'s own registry census (the NAMED `composes` stamps, #37 GAP 1); a card that hides them FAILS the same judge',
  dropJudge(faceReading, manifoldShape) === true && dropJudge(droppedCard, manifoldShape) === false);
check('§12 (E-TYPING) THE SOURCE-ROLE THROUGH THE LIFT (researcher 2240): each composed seed relation reads `born` (a premise — seed-story endpoints); every live finer row on the face card reads `derived` (a minted midpoint endpoint); the A-C edge card splits the same way (coarse `born` · halves `derived` — §10\'s recut)',
  composedRows.filter((r) => r.kind === 'composed-of').every((r) => r.typing === 'born') &&
    faceReading.relationRows.every((r) => r.typing === 'derived'));
const twinForm = twinLift ? loadLift(twinLift, 517) : null;
const twinReading = twinForm ? buildArgumentReading(twinForm) : null;
note(`twin card: ${twinReading ? twinReading.composedRelationRows.map((r) => `${r.label} (${r.kind})`).join(' · ') : 'no twin subject'}`);
check('§12 (E-SHARED-BY) ★ A SHARED WALL SURFACES ONCE: the twin-region card carries exactly ONE shared-by row whose place is the ONE live wall (the LOADED live face id — the load prefixes structural ids) — never N duplicate rows, never dropped',
  twinReading !== null &&
    twinReading.composedRelationRows.filter((r) => r.kind === 'shared-by').length === 1 &&
    twinReading.composedRelationRows.find((r) => r.kind === 'shared-by')?.pathIds[0] === twinForm.shape.faces[0].id);
const viewSrcC = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('§12 (VIEW) THE COMPOSED ROW RENDERS WITH ITS PATH (source-pinned): the view maps `composedRelationRows` with the ∘-joined path labels and the honest suffix words',
  viewSrcC.includes('argument.composedRelationRows.map') &&
    viewSrcC.includes("pathLabels.join(' ∘ ')") &&
    viewSrcC.includes('composed seed relation') &&
    viewSrcC.includes('shared wall'));
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
check('§10 (PLANT) ★★ THE DROPPED SUBDIVISION BITES: the pre-cure endpoints-only closure (grain silently omitted, no mark) FAILS the carried-or-marked judge that greens BOTH real lifts (the edge AND the face: grain CARRIED whole — slice 2) — the binding bar is structural, not a wish',
  carriedOrMarked(liftReading) === true &&
    carriedOrMarked(faceReading) === true &&
    carriedOrMarked(bareReading) === false);
// SLICE2 (the binding bar's other half): a GENUINELY un-carriable interior
// stray still MARKS. No committed op mints a stranded interior vertex (a
// vertex inside a face with no connecting finer edge), so this boundary
// branch is exercised as a UNIT-PROBE: a minimal Shape-typed fixture (honest
// labels, real positions) fed to the REAL downwardClosure — the one
// non-engine-minted subject in this witness, disclosed.
const strayFixture = {
  id: 'shape:probe:stray',
  name: 'stray probe',
  vertices: {
    'vertex:probe:a': { id: 'vertex:probe:a', position: [0, 0, 0], data: { label: 'A', notes: '', color: '#000', tags: [], custom: {} }, createdBy: { shapeId: 'shape:probe:stray', operation: 'seed', sourceVertexIds: [] } },
    'vertex:probe:b': { id: 'vertex:probe:b', position: [4, 0, 0], data: { label: 'B', notes: '', color: '#000', tags: [], custom: {} }, createdBy: { shapeId: 'shape:probe:stray', operation: 'seed', sourceVertexIds: [] } },
    'vertex:probe:c': { id: 'vertex:probe:c', position: [0, 4, 0], data: { label: 'C', notes: '', color: '#000', tags: [], custom: {} }, createdBy: { shapeId: 'shape:probe:stray', operation: 'seed', sourceVertexIds: [] } },
    'vertex:probe:stray': { id: 'vertex:probe:stray', position: [1, 1, 0], data: { label: 'S', notes: '', color: '#000', tags: [], custom: {} }, createdBy: { shapeId: 'shape:probe:stray', operation: 'seed', sourceVertexIds: [] } },
  },
  edges: [
    { id: 'edge:probe:ab', vertexIds: ['vertex:probe:a', 'vertex:probe:b'], sourceVertexIds: ['vertex:probe:a', 'vertex:probe:b'] },
    { id: 'edge:probe:bc', vertexIds: ['vertex:probe:b', 'vertex:probe:c'], sourceVertexIds: ['vertex:probe:b', 'vertex:probe:c'] },
    { id: 'edge:probe:ca', vertexIds: ['vertex:probe:c', 'vertex:probe:a'], sourceVertexIds: ['vertex:probe:c', 'vertex:probe:a'] },
  ],
  faces: [{ id: 'face:probe:abc', vertexIds: ['vertex:probe:a', 'vertex:probe:b', 'vertex:probe:c'], role: 'seed-face' }],
  cells: [],
  generations: [],
  genealogy: { parentShapeId: null, operation: 'seed', generationDepth: 0, sourceVertexIds: [], createdVertexIds: [], createdAt: '' },
};
const { downwardClosure: probeClosure } = req('src/lib/subComplexLift.ts');
const strayClosure = probeClosure(strayFixture, [{ kind: 'face', id: 'face:probe:abc' }]);
check('§10 (E-FACE-CARRY) THE UN-CARRIABLE STRAY STILL MARKS (the binding bar\'s boundary, unit-probed on the REAL downwardClosure — disclosed fixture): an interior vertex with NO connecting finer edge is NOT pulled (the connectivity gate) and the face carries the honest "coarse face; finer structure not carried" mark — never a silent drop, never a broken lift',
  !strayClosure.vertexIds.includes('vertex:probe:stray') &&
    (strayClosure.grainMarks ?? []).some((m) => m.kind === 'face' && m.mark === 'coarse face; finer structure not carried'));

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
check('§11 (WALK) ★ SEED + INVOKE (B-2026-08-24-B §6 recut): the seed tetrahedron\'s card reads its 4 corners by their REAL packet names A·B·C·D (all born, their own roots); the invoked square reads its BORN corners as TRUE ABSENCE — the packets MEASURE empty AND the ROW register carries NO suffix (four rows, each exactly `unnamed` — the figure disambiguates, never a positional index in the name slot) — both judged by the independent packet comparator',
  seedWalk.op === 'seed' &&
    ['A', 'B', 'C', 'D'].every((name) => seedWalk.conceptRows.some((r) => r.label === name)) &&
    seedWalk.conceptRows.every((r) => r.typing === 'born') &&
    packetJudge(seedWalk, seedTetra) &&
    Object.values(sqHost.shape.vertices).every((v) => ((v.data?.label ?? '').trim()) === '') &&
    seedReading.conceptRows.length === 4 &&
    seedReading.conceptRows.every((r) => r.label === 'unnamed') &&
    packetJudge(seedReading, sqHost.shape));
const cutApplied = applyPlaygroundOperationTo('cut', triHost.shape, null, 611, 8, [], triHost.shape.faces[0].id);
const cutWalk = cutApplied.ok ? buildArgumentReading(cutApplied.born) : null;
const collapseApplied = applyPlaygroundOperationTo('collapse-sphere', sqHost.shape, null, 612, 8, [], null);
const collapseWalk = collapseApplied.ok ? buildArgumentReading(collapseApplied.born) : null;
note(`cut: ${cutWalk ? cutWalk.conceptRows.map((r) => `${r.label}(${r.typing})`).join(' ') : cutApplied.reason} · collapse: ${collapseWalk ? collapseWalk.conceptRows.map((r) => `${r.label}(${r.typing})`).join(' ') : collapseApplied.reason}`);
check('§11 (WALK, B-103 §2e recut) ★ GLUE + FLIP-GLUE + CUT + COLLAPSE: COMPOSED requires nameable sources — the identified class of four TRUE ABSENCES falls through the compose-over-absent guard and reads \'unnamed\' (the handle-dressed composition unnamed·A·unnamed·B·… is DEAD: absence dressed as presence bypassed the guard); the klein likewise judged; the cut form keeps its corners\' honest absences; the collapse-born class falls to the guard too — every card packet-judged',
  torusReading.conceptRows[0].label === 'unnamed' &&
    packetJudge(torusReading, torus.shape) &&
    packetJudge(kleinReading, kleinApplied.born.shape) &&
    cutWalk !== null &&
    cutWalk.conceptRows.filter((r) => r.label === 'unnamed').length >= 3 &&
    cutWalk.conceptRows.every((r) => !/^unnamed·[A-Z]\d*$/.test(r.label)) &&
    packetJudge(cutWalk, cutApplied.born.shape) &&
    collapseWalk !== null &&
    collapseWalk.conceptRows.every((r) => r.label === 'unnamed') &&
    collapseWalk.conceptRows.every((r) => !r.label.includes('·')) &&
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
check('§11 (WALK + E-DERIVED) ★ PRODUCT + DUAL + AMBO + REFINE: the ×I band\'s copies read through their sources\' real names (A/C/AC + the ·X index — the copy mints id-as-label); the dual carrier is packet-judged (born-of-face rows ride §3); the ambo universe reads 4 SURVIVED corners A–D + 6 midpoints AB..CD typed `derived` (SLICE2, researcher 1900: a mint-from-many whose sources PERSIST — never `identified`, which is a unification of ABSORBED sources) with its relations `derived` likewise and its own op word; the refined cone keeps its BIRTH op (`glue` — refine is a RESOLUTION, not a birth; the trace rides `genealogy.resolution`) and mints finer concepts without erasing a name — every card packet-judged',
  bandWalk.op === 'product' &&
    bandWalk.conceptRows.every((r) => ['A', 'C', 'AC'].includes(r.label.replace(/·[A-Z]\d*$/, ''))) &&
    packetJudge(bandWalk, bandLift.shape) &&
    packetJudge(dualReading, dualShape) &&
    amboWalk.op === 'ambo-dissection' &&
    ['A', 'B', 'C', 'D'].every((name) => amboWalk.conceptRows.some((r) => r.label === name && r.typing === 'survived')) &&
    ['AB', 'AC', 'AD', 'BC', 'BD', 'CD'].every((name) => amboWalk.conceptRows.some((r) => r.label === name && r.typing === 'derived')) &&
    amboWalk.relationRows.every((r) => r.typing === 'derived') &&
    amboWalk.header.gloss === 'corners cut to midpoints — the ambo dissection' &&
    packetJudge(amboWalk, amboD) &&
    refineWalk.op === 'glue' &&
    refined.refinement?.typeClaim === 'resolution' &&
    refineWalk.conceptRows.length > (coneReading?.conceptRows.length ?? 0) &&
    packetJudge(refineWalk, refined.shape));
// E-DERIVED both ways + the persist-PLANT: the discriminator is recomputed
// INDEPENDENTLY from the substrate (sources ∈ result.vertices) and judges
// every ≥2-source concept row; forcing a persisting mint to `identified`
// fails the same judge that greens the real cards
const persistJudge = (reading, shapeX) =>
  reading.conceptRows.every((row) => {
    if (row.typing !== 'identified' && row.typing !== 'derived') return true;
    if (row.sourceIds.length < 2) return true;
    const persist = row.sourceIds.every((s) => Boolean(shapeX.vertices[s]));
    return row.typing === (persist ? 'derived' : 'identified');
  });
const forcedIdentified = {
  ...amboWalk,
  conceptRows: amboWalk.conceptRows.map((r) => (r.typing === 'derived' ? { ...r, typing: 'identified' } : r)),
};
check('§11 (E-DERIVED) ★ THE SPLIT IS THE SUBSTRATE\'S, BOTH WAYS: the ambo midpoints read `derived` (sources persist) while the glue-torus class stays `identified` (sources absorbed) — each judged by the INDEPENDENT persist-recomputation — and THE PLANT BITES: the ambo mints forced to `identified` FAIL the same judge that greens the real cards',
  persistJudge(amboWalk, amboD) === true &&
    persistJudge(torusReading, torus.shape) === true &&
    torusReading.conceptRows[0].typing === 'identified' &&
    persistJudge(forcedIdentified, amboD) === false);
// D16 (B-2026-08-23-C §4) + TASK D (§5): the card takes the door's resolver
// ENTIRE — with the view's reach handed in, a ×I copy reads its source's
// REAL name + the LEVEL MARK (the menu's own strings), every copy distinct
// BY THE MARK (no ·letter rides any copy); and the FACE register names every
// face through the composer that exists — never the face id. The resolver
// here is the witness's own reach over the band's base universes (label
// positive, never an id-copy) — the same contract the view's resolver keeps.
const bandResolver = (sourceIds) => {
  const ref = sourceIds[0];
  const v = liftAC.shape.vertices[ref] ?? amboD.vertices[ref];
  const raw = (v?.data?.label ?? '').trim();
  return raw.length > 0 && raw !== ref ? raw : null;
};
const bandWalkD16 = buildArgumentReading(wrapCarrier(bandLift.shape, liftAC.shape, 'band-d16'), bandResolver);
note(`d16 band: ${bandWalkD16.conceptRows.map((r) => r.label).join(' ')} · faces ${bandWalkD16.faceRows.map((f) => f.label).join(' | ')}`);
check('§11 (D16+FACES) ★ THE CARD TAKES THE DOOR\'S RESOLVER ENTIRE + THE FACE REGISTER: with the reach handed in the ×I copies read source-name + level mark (A₀/A₁/C₀/C₁/AC₀/AC₁ — reach and mark, the menu\'s strings), ALL DISTINCT by the mark alone (no ·letter on any copy), relation source readings carry NO raw id, and faceRows names every face by composed corners (the ambo card\'s faces read their midpoint compositions) — never a face id',
  bandWalkD16.conceptRows.every((r) => /^(A|C|AC)[₀₁]$/.test(r.label)) &&
    new Set(bandWalkD16.conceptRows.map((r) => r.label)).size === bandWalkD16.conceptRows.length &&
    bandWalkD16.relationRows.every((r) => (r.rootLabels[0] ?? '').length > 0 && !(r.rootLabels[0] ?? '').includes(':')) &&
    bandWalkD16.faceRows.length === bandLift.shape.faces.length &&
    bandWalkD16.faceRows.every((f) => f.label.length > 0 && !f.label.includes('face:')) &&
    amboWalk.faceRows.length === amboD.faces.length &&
    amboWalk.faceRows.some((f) => /^[A-Z]{1,2}(·[A-Z]{1,2}){2,}$/.test(f.label)));
const viewSrcNow = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('§11 (VIEW) THE LIFT + THE DERIVED WORD RENDER (source-pinned): the view draws the life-line (`origin.display` + the ", lifted" branch), renders the grain marks (⚠ + `argument.grainMarks`), counts `lifted` in the grouped line, keys the sheet dedup on `shape.id` (the exact predicate the distinct id unblocks), and speaks `— derived` for a persisting mint (never "identified")',
  viewSrcNow.includes('origin.display') &&
    viewSrcNow.includes('argument.grainMarks') &&
    viewSrcNow.includes('`${lifted} lifted`') &&
    viewSrcNow.includes('w.form.shape.id === item.entry.loaded.shape.id') &&
    viewSrcNow.includes(' — derived'));
// §12 M3 (SEAL_M3_PERSISTENCE) — THE DIED MEMORIAL AT THE MODEL: the read is
// total; the positive case is a CONSTRUCTED death (the plant pattern — the
// comparator is the real one, only the input is minted, because MEASURED at
// HEAD no committed door produces a true death: fold/cut/dual/collapse/glue/
// sew/chord+cut all absorb or survive their vertices).
check('§12 (M3) ★ THE DIED READ IS TOTAL + REACHABLE-EMPTY (measured): a CONSTRUCTED true death (a parent corner absent from the child, absorbed by no row — the same ONE filter the count uses) surfaces its IDENTITY by packet name in `diedConceptRows` with the count derived from the rows; the REAL cut/fold walks read died 0 (every committed door absorbs or survives — the memorial is reachable-empty until an op can kill); the merged class carries `ownName` null (the ring composes `p ← {…}` from it — never an invented letter) while a survivor keeps its own name',
  (() => {
    const base = cutApplied.born;
    const victim = Object.keys(base.shape.vertices).sort()[2];
    const vertices = {};
    for (const [id, v] of Object.entries(base.shape.vertices)) if (id !== victim) vertices[id] = v;
    const pruned = {
      ...base,
      shape: {
        ...base.shape,
        vertices,
        edges: base.shape.edges.filter((e) => !e.vertexIds.includes(victim)),
        faces: base.shape.faces.filter((f) => !f.vertexIds.includes(victim)),
      },
    };
    const diedWalk = buildArgumentReading(pruned);
    const memorial = diedWalk.diedConceptRows;
    note(`m3 victim=${victim} memorial: ${memorial.map((m) => `${m.id}=${m.label}`).join(' · ') || '(empty)'}`);
    return (
      diedWalk.diedConcepts === memorial.length &&
      memorial.length === 1 &&
      memorial[0].id === victim &&
      memorial[0].label === 'unnamed' &&
      cutWalk !== null &&
      cutWalk.diedConceptRows.length === 0 &&
      cutWalk.diedConcepts === 0 &&
      coneReading !== null &&
      coneReading.diedConceptRows.length === 0 &&
      coneReading.conceptRows.some((r) => r.typing === 'identified' && r.ownName === null) &&
      // B-2026-08-23-C recut: the cone's survivor is a BORN-unnamed corner
      // now (the producer-stop) — its ownName is HONESTLY null, judged
      // against its own empty packet; the survivor-KEEPS-its-name law is
      // pinned where a name exists (the seed walk: every corner owned)
      coneReading.conceptRows.some(
        (r) =>
          r.typing === 'survived' &&
          r.ownName === null &&
          ((cone.shape.vertices[r.resultId]?.data?.label ?? '').trim() === ''),
      ) &&
      seedWalk.conceptRows.every((r) => r.ownName !== null)
    );
  })());
// §13 THE RING ANCHOR RESOLVER (SEAL_THE_RING_ANCHOR_RESOLVER) — the TOTAL
// verdict at the model: 4 modes RENDER anchors, 2 REFUSE with open sentences;
// the immersion map anchors ON the surface with the dihedral corner
// assignment FORCED by gluing consistency (the naive cycle image fails the
// cylinder — measured; unplaced 0 proves the search found the closing image).
const { resolveRingAnchors } = req('src/components/ringAnchorResolver.ts');
check('§13 (RESOLVER) ★ TOTAL OVER THE UNION — 4 RENDER + 2 DECLARE: the glue-TORUS anchors 3/3 (unplaced 0) with every point ON the immersion surface; the glue-CYLINDER anchors 5/5 (unplaced 0) with its two rim classes at DISTINCT heights (the dihedral search closed an assignment the naive cycle fails); plain/skeleton/faithful anchor as before (the M3 fan intact); classBody + bodiless REFUSE with their own sentences (the frame + the committed reason) — never a silent null',
  (() => {
    const torusApplied2 = applyPlaygroundOperationTo('glue-torus', sqHost.shape, null, 921, 8, [], null);
    const cylApplied = applyPlaygroundOperationTo('glue-cylinder', sqHost.shape, null, 922, 8, [], null);
    if (!torusApplied2.ok || !cylApplied.ok) return false;
    const torusRes = resolveRingAnchors(torusApplied2.born, buildArgumentReading(torusApplied2.born));
    const cylRes = resolveRingAnchors(cylApplied.born, buildArgumentReading(cylApplied.born));
    const onTorus = ([x, y, z]) => {
      // the torus immersion's own implicit surface: (√(x²+z²) − R0)² + y² = r0²
      const ring = Math.hypot(x, z) - 2.75;
      return Math.abs(Math.hypot(ring, y) - 1.25) < 1e-6;
    };
    const torusOk =
      torusRes.kind === 'anchored' &&
      torusRes.anchors.size === 3 &&
      torusRes.unplaced.length === 0 &&
      [...torusRes.anchors.values()].every(onTorus);
    const cylConcepts = cylRes.kind === 'anchored'
      ? [...cylRes.anchors.entries()].filter(([id]) => cylApplied.born.shape.vertices[id]).map(([, p]) => p)
      : [];
    const cylOk =
      cylRes.kind === 'anchored' &&
      cylRes.anchors.size === 5 &&
      cylRes.unplaced.length === 0 &&
      cylConcepts.length === 2 &&
      Math.abs(cylConcepts[0][1] - cylConcepts[1][1]) > 2;
    const fanRes = resolveRingAnchors(cone, buildArgumentReading(cone));
    const plainRes = resolveRingAnchors(triHost, buildArgumentReading(triHost));
    const skelRes = resolveRingAnchors(cutApplied.born, buildArgumentReading(cutApplied.born));
    const bodilessRes = resolveRingAnchors(
      { ...triHost, render: { mode: 'bodiless', reason: 'a pinch — the classify route throws', shape: triHost.shape } },
      buildArgumentReading(triHost),
    );
    const { buildClassBodyModel } = req('src/manuscript/classBodyModel.ts');
    let classRes = null;
    try {
      const cb = buildClassBodyModel(torusApplied2.born.shape, [torusApplied2.born.shape, sqHost.shape]);
      classRes = resolveRingAnchors({ ...torusApplied2.born, render: { mode: 'classBody', model: cb } }, buildArgumentReading(torusApplied2.born));
    } catch {
      classRes = null;
    }
    return (
      torusOk &&
      cylOk &&
      fanRes.kind === 'anchored' && fanRes.unplaced.length === 0 &&
      plainRes.kind === 'anchored' && plainRes.unplaced.length === 0 &&
      skelRes.kind === 'anchored' && skelRes.unplaced.length === 0 &&
      bodilessRes.kind === 'refused' && bodilessRes.refusal.includes('a pinch') &&
      classRes !== null && classRes.kind === 'refused' && classRes.refusal.includes('chosen representative')
    );
  })());
// §14 THE TEST SPECIMENS (SEAL_THE_FIELD_DOOR_AND_TEST_SPECIMENS) — the two
// reachability FINDINGS, measured through the real modules (the probe-not-
// assume law): the designer's 10-mark immersion and four-register body are
// both UNREACHABLE at HEAD, and the witness pins WHY, by name.
check('§14 (SPECIMENS) ★ THE TWO REACHABILITY FINDINGS HOLD: (a) the 10-mark immersion — refineToDisk REFUSES an invoked primitive (the rim op refines born word-forms; the refusal names the birth-word recovery) AND the bisected torus LOSES its render route (the recovery refuses the refined quotient — routing throws); (b) the four-register body — every reachable plain body measures b₁ = 0 (no generator loops to recede) while the immersion that DOES draw loops declares the deficit not-applicable — so the reachable maximum is the plain 3-register (field + deficit + key) and the leg stands it up live',
  (() => {
    const { refineToDisk, bisectSurface: bisect2 } = req('src/lib/surfaceRefinement.ts');
    const { routeWrittenRender } = req('src/manuscript/writtenFormModel.ts');
    const { readDeficitForRender } = req('src/manuscript/deficitRegisterModel.ts');
    const { deriveOptionBGenerators } = req('src/manuscript/optionBModel.ts');
    let refineRefused = false;
    try {
      refineToDisk(sqHost.shape, [sqHost.shape]);
    } catch (e) {
      refineRefused = String(e.message).includes('cannot recover');
    }
    let routeLost = false;
    try {
      const t = applyPlaygroundOperationTo('glue-torus', sqHost.shape, null, 941, 8, [], null);
      const bis = bisect2(t.born.shape, sqHost.shape);
      try {
        routeWrittenRender(bis.shape, [t.born.shape, sqHost.shape], 8);
      } catch {
        routeLost = true;
      }
    } catch {
      routeLost = false;
    }
    let b1Zero = false;
    try {
      b1Zero = deriveOptionBGenerators(sqHost.shape).b1 === 0 && deriveOptionBGenerators(triHost.shape).b1 === 0;
    } catch {
      b1Zero = false;
    }
    let deficitNA = false;
    try {
      const t2 = applyPlaygroundOperationTo('glue-torus', sqHost.shape, null, 942, 8, [], null);
      const dr = readDeficitForRender(t2.born.render, [t2.born.shape, sqHost.shape]);
      deficitNA = dr.kind === 'not-applicable' && dr.mode === 'immersion';
    } catch {
      deficitNA = false;
    }
    // finding #3 (the field-door arc's third): the flat reachable bodies'
    // fields are DEGENERATE-BAND (not plated — the layer honestly draws
    // nothing even with the door open); the plated bodies live behind
    // unreachable flows
    let fieldDegenerate = false;
    try {
      const { computeFieldForShape } = req('src/lib/fieldForShape.ts');
      const { buildFieldInkModel } = req('src/manuscript/InkedFieldLayer.tsx');
      const fm = buildFieldInkModel(sqHost.shape, computeFieldForShape(sqHost.shape));
      fieldDegenerate = fm.plated === false && fm.refusal === 'degenerate-band';
    } catch {
      fieldDegenerate = false;
    }
    return refineRefused && routeLost && b1Zero && deficitNA && fieldDegenerate;
  })());
// #37 GAP 1+2 (B-2026-08-22-B) — THE PROMOTED RECORD ACROSS THE DOUBLE HOP,
// and the retired world's file still loads. One hop cannot see the nesting
// bug: hop under TWO DIFFERENT sources — the doorway refs (parts /
// sourceVertexIds) re-root WITH the ids they name and stay ===-live BOTH
// hops; the record id and each sharedBy entry ride VERBATIM (nothing
// nests). LEGACY CONTROL: a pre-promotion file (stamps riding the opaque
// data blob) is LIFTED to the named fields on load — blob keys stripped,
// unrelated data preserved — and the card reads the same rows off it.
{
  const rawShape = faceLift.shape;
  const hop1 = deserializeSnapshot(serializeSnapshot(rawShape, 'hop-a', [])).shape;
  const hop2 = deserializeSnapshot(serializeSnapshot(hop1, 'hop-b', [])).shape;
  const liveByEq = (s) => {
    const eIds = new Set(s.edges.map((e) => e.id));
    const vIds = new Set(Object.keys(s.vertices));
    const fIds = new Set(s.faces.map((f) => f.id));
    return s.edges.filter((e) => e.composes).every((e) =>
      e.composes.parts.every((p) => (e.composes.kind === 'edge' ? eIds.has(p) : fIds.has(p))) &&
      e.composes.sourceVertexIds.every((v) => vIds.has(v)),
    ) && s.faces.filter((f) => f.composes).every((f) => f.composes.parts.every((p) => fIds.has(p)));
  };
  const recordIds = (s) => [...s.edges, ...s.faces].filter((x) => x.composes).map((x) => x.composes.id).sort();
  check('§13 (#37 GAP 1+2) THE PROMOTED RECORD SURVIVES THE DOUBLE HOP: 6+4 stamps both hops, every doorway ref ===-live in its own hop\'s id space, and the record ids VERBATIM across raw → hop1 → hop2 (nothing nests)',
    hop1.edges.filter((e) => e.composes).length === 6 &&
      hop1.faces.filter((f) => f.composes).length === 4 &&
      hop2.edges.filter((e) => e.composes).length === 6 &&
      hop2.faces.filter((f) => f.composes).length === 4 &&
      liveByEq(hop1) && liveByEq(hop2) &&
      JSON.stringify(recordIds(rawShape)) === JSON.stringify(recordIds(hop1)) &&
      JSON.stringify(recordIds(hop1)) === JSON.stringify(recordIds(hop2)));
  // the legacy file: demote the raw lift's structural stamps into data blobs
  // (a byte-faithful pre-promotion shape), then load it through the door
  const legacy = JSON.parse(JSON.stringify(rawShape));
  for (const pool of [legacy.edges, legacy.faces]) {
    for (const x of pool) {
      if (x.composes) { x.data = { ...(x.data ?? {}), composes: x.composes }; delete x.composes; }
      if (x.sharedBy) { x.data = { ...(x.data ?? {}), sharedBy: x.sharedBy }; delete x.sharedBy; }
    }
  }
  const legacyFile = JSON.parse(JSON.stringify(serializeSnapshot(legacy, 'legacy-src', [])));
  const migrated = deserializeSnapshot(legacyFile).shape;
  const migratedReading = buildArgumentReading(placeShelfEntry(loadUniverseSnapshot(legacyFile), 613));
  check('§13 (LEGACY CONTROL) A PRE-PROMOTION FILE STILL LOADS WHOLE: the data-blob stamps are LIFTED to the named fields (6+4, ===-live), the blob keys are STRIPPED (one home), and the card reads the same composed rows off the migrated form',
    migrated.edges.filter((e) => e.composes).length === 6 &&
      migrated.faces.filter((f) => f.composes).length === 4 &&
      migrated.edges.every((e) => !(e.data && e.data.composes)) &&
      migrated.faces.every((f) => !(f.data && f.data.composes)) &&
      liveByEq(migrated) &&
      migratedReading.composedRelationRows.filter((r) => r.kind === 'composed-of').length ===
        faceReading.composedRelationRows.filter((r) => r.kind === 'composed-of').length);
}
check('§11 (E-NO-UNION) NOTHING FROZEN MOVED: ambo.ts (the mechanism is the LIFT — the T-junction stays real) · InkedForm.tsx (the flat-body guard is ADAPTER-HELD) · types/geometry.ts · lib/shape.ts · store/geometryStore.ts · genesisModel.ts · faithfulBodyModel.ts · inkedFormModel.ts · the MANIFEST — all BYTE-IDENTICAL to HEAD (no union, no new file, no new row owed)',
  ['src/lib/ambo.ts', 'src/manuscript/InkedForm.tsx', 'src/types/geometry.ts', 'src/lib/shape.ts', 'src/store/geometryStore.ts', 'src/manuscript/genesisModel.ts', 'src/manuscript/faithfulBodyModel.ts', 'src/manuscript/inkedFormModel.ts', 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'].every(headEq));

// ===========================================================================
// §14 (B-130 A.2/A.4/A.5/A.6) — THE ARGUMENT COMPARTMENT, structurally
// ===========================================================================
console.log('\n----- §14 (B-130) the argument compartment: one state, closed face counts, verdict never without the map -----');
{
  const cardSrc = viewSrc.slice(viewSrc.indexOf('function SpecimenCard'), viewSrc.indexOf('const faceLabel'));
  check('§14 ⛔ A.6 BY CONSTRUCTION — ONE STATE FOR THE WHOLE READING: ArgumentMapSection mounts exactly once in SpecimenCard, inside the `argumentPresented ?` branch, and NO per-section open state exists (mapOpen/verdictOpen/stanceOpen/incidenceOpen are absent) — so `verdict open while the map is closed` is a state the mechanism cannot express',
    (cardSrc.match(/<ArgumentMapSection/g) ?? []).length === 1 &&
    /argumentPresented \? \(\s*<ArgumentMapSection/.test(cardSrc) &&
    !/mapOpen|verdictOpen|stanceOpen|incidenceOpen/.test(cardSrc));
  check('§14 ⛔ A.6 THE CLOSED FACE SAYS HOW MUCH, NEVER WHAT IT CONCLUDES: the closed branch renders the map’s own O-line (header.source ⟶ header.result — MAP FIRST even closed) + the COUNTED words line, and touches neither verdict nor stance nor incidence',
    (() => {
      const closed = cardSrc.slice(cardSrc.indexOf('data-argument-closed'), cardSrc.indexOf('</div>\n          )}'));
      return closed.includes('argument.header.source') && closed.includes('argument.header.result') &&
        closed.includes('argument.words') &&
        !/argument\.verdict|argument\.stance|argument\.incidence/.test(closed);
    })());
  check('§14 ⛔ A.4 — DEFAULT-CLOSED IS THE ARGUMENT’S ALONE, EARNED: argumentOpen starts false (her 646 px measurement), the door toggles it (the person’s "called for"), and the SYSTEM presents without writing the person’s state — emphasis intersecting the compartment’s own row ids presents it for the duration (attention promotes; data-presence never does: no `argument &&`-style auto-open exists)',
    cardSrc.includes('const [argumentOpen, setArgumentOpen] = useState(false)') &&
    cardSrc.includes('data-argument-door') &&
    cardSrc.includes('setArgumentOpen((open) => !open)') &&
    /argumentOpen \|\| \(argumentRowIds !== null && \(emphasizedIds \?\? \[\]\)\.some\(\(id\) => argumentRowIds\.has\(id\)\)\)/.test(cardSrc));
  check('§14 ⛔ A.5 — CLOSED-WITH-CONTENT ≠ EMPTY, BY CONSTRUCTION: an absent reading renders NO compartment at all (the `{argument ?` guard — a true absence, the ordinary unmarked), so the closed face (heading + O-line + counts) can never be mistaken for emptiness; the compartment declares its state machine-readably (data-compartment-state)',
    /\{argument \? \(/.test(cardSrc) &&
    cardSrc.includes('data-compartment-argument') &&
    cardSrc.includes("data-compartment-state={argumentPresented ? 'open' : 'closed'}"));
  check('§14 ⛔ A.1/A.3 (recut by T1 §1) — BOUNDED IN THE CARD’S OWN FRAME, AND THE ACTS DO NOT RIDE THE COLUMN: the height bound is `calc(100% − …)` derived from the card’s own declared top (one source — never `100vh`, whose frame diverged from the card’s containing block by 52 px in her drive and ran the open card 38 px past every screen), the reading scrolls in its own region, and the acts block sits AFTER the scroll region as the fixed footer (flexShrink: 0)',
    (() => {
      const wholeView = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
      return wholeView.includes('const SPECIMEN_CARD_TOP = 64') &&
        wholeView.includes('const SPECIMEN_CARD_BREATH = 14') &&
        cardSrc.includes('top: SPECIMEN_CARD_TOP') &&
        cardSrc.includes('maxHeight: `calc(100% - ${SPECIMEN_CARD_TOP + SPECIMEN_CARD_BREATH}px)`') &&
        !cardSrc.includes('100vh') &&
        cardSrc.includes('data-specimen-scroll') &&
        cardSrc.indexOf('data-form-acts') > cardSrc.indexOf('data-specimen-scroll') &&
        cardSrc.slice(cardSrc.indexOf('data-form-acts'), cardSrc.indexOf('data-form-acts') + 200).includes('flexShrink: 0');
    })());
}

// ===========================================================================
// §15 (B-131 §3/§5) — the callout is the christening's mark; the chrome floor
// ===========================================================================
console.log('\n----- §15 (B-131) the prongs come off unnamed; the absence said once; the chrome floor -----');
{
  const chromeSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptChrome.tsx'), 'utf8');
  check('§15 ⛔ §3.1+§3.3 — THE CALLOUT IS RESERVED FOR THE CHRISTENED CORNER (her ruling: the defect and the christening gesture are one device, pointed the right way round): the ring’s concept marks filter on the STRUCTURAL absence carrier (`ownName !== null` — never a match on the absence word), and the relation letters are untouched',
    viewSrc.includes('.filter((r) => r.ownName !== null)') &&
    !/label === 'unnamed'|label !== 'unnamed'/.test(viewSrc.slice(viewSrc.indexOf('<CorrespondenceRing'), viewSrc.indexOf('<CorrespondenceRing') + 3000)));
  check('§15 ⛔ §3.2 — THE ABSENCE IS SAID ONCE, AT THE FORM’S GRAIN: the card’s corner-absence line renders ONLY in the all-unnamed state (every ownName null, at least one concept) — a partly named form’s remaining absences are the ordinary, unmarked. ⚠ the string is HERS (her example line, standing until her wording lands)',
    viewSrc.includes('data-corner-absence') &&
    /argument && argument\.conceptRows\.length > 0 && argument\.conceptRows\.every\(\(r\) => r\.ownName === null\)/.test(viewSrc));
  check('§15 ⛔ §5 — THE CHROME LAYER’S ONE DECLARED FLOOR: CHROME_LAYER_Z = 50 exported once, ABOVE the drei label range [40,0] and BELOW the windows and menus (60) — so the card-behind-window law holds by NUMBER — and the specimen card (the measured third site) carries it',
    chromeSrc.includes('export const CHROME_LAYER_Z = 50') &&
    chromeSrc.includes('zIndex: 60') &&
    viewSrc.includes('zIndex: CHROME_LAYER_Z') &&
    (viewSrc.match(/zIndexRange=\{\[40, 0\]\}/g) ?? []).length > 0);
}

console.log(
  `\n--- THE ARGUMENT-READING CARD — the MAP is the spine, Phase 2 completes the reading, THE LIFT carries identity + grain (the packet is the name, 'lifted' the typing, the id names WHICH entity — one kind prefix, the grain CARRIED edge AND face-interior with the mark only for the un-carriable, 'derived' split from 'identified' on the persist-discriminator): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
