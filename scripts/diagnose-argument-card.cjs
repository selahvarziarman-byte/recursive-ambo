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
check('§1 (E1) the relations read the RECORDED correspondence (measured substrate: fresh ids + sourceVertexIds, the partner ABSORBED — the spec\'s mat:-relation-name does not exist on edges, flagged): 2 surviving relation rows each lettered by its source edge\'s endpoints (2 letters within A–D), 2 ABSORBED partners lettered likewise, and the words count 4→1 · 4→2 · 2 absorbed',
  torusReading !== null &&
    torusReading.relationRows.length === 2 &&
    torusReading.relationRows.every(
      (r) => r.typing === 'survived' && /^[A-D]{2}$/.test(r.rootLabels[0] ?? ''),
    ) &&
    torusReading.absorbedRelations.length === 2 &&
    torusReading.absorbedRelations.every((s) => /^[A-D]{2}$/.test(s)) &&
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

console.log(
  `\n--- THE ARGUMENT-READING CARD, Phase 1 — the MAP is the spine (the birth op's argument from the substrate: roots named by primalMultiset, typing read not invented, invariants demoted to the receipt): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
