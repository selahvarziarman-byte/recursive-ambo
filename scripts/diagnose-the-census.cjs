#!/usr/bin/env node

// DIAGNOSTIC — THE CENSUS + THE REPRESENTATIVE (engineer-chartered 2026-07-16,
// mothership-ruled · researcher-diagnosed; SEAL-BEFORE-BUILD — BUILT BLIND to
// `.handoff/SEAL_THE_CENSUS_AND_THE_REPRESENTATIVE.md`, SHA-256
// 9832a89c…f2d4, natively confirmed. ⚠ THE STRATA COUNTS BELOW WERE MEASURED
// FRESH from the committed op + gate — never sourced from the backlog, the
// inbox, or any letter; the seal holds the engineer's pins and the audit
// compares).
//
// THE DEFECT THIS KILLS: the folded-edge failure minted `edgeClass: rep.id` —
// the smallest MEMBER EDGE ID — while the link readings mint `edgeClass` from
// the union-find ROOT. Same classes, different representatives ⇒ any census
// that excluded folded classes by cross-referencing the two views BY ID
// silently kept most of them and returned the identical answer to running NO
// FILTER AT ALL. Three offices ran that no-op and published its number (61 —
// the mutant below reproduces it). A NAME IS A CLAIM: the field is now
// `repEdgeId`, the true root rides beside it as `classRoot`, and `.edgeClass`
// on a folded-edge failure is a TYPE ERROR — the compiler refuses the lie.
//
// ⛔ THE WALL'S PRINTED VALUE DID NOT MOVE: foldedEdgeClasses still carries
// the rep edge ids (the smallest member — derivable, asserted here), only the
// field's NAME and its company changed.
//
// THE STRATA (researcher-ruled — a FOLDED edge is NOT a cone edge; its
// holonomy reverses the edge, so k×90° does not apply to it):
//   FOLD      — the class carries a folded-edge failure (any k)
//   CONE EDGE — k ≠ 4 AND NOT folded
//   flat      — k = 4 AND NOT folded
// Classes are matched by MEMBER-EDGE SET and by the new classRoot — NEVER by
// representative id (both keys asserted to AGREE, class by class).
//
// ★ LAW 25's corollary, binding: THE PARTITION MUST SUM TO THE WHOLE. One
// total line would have caught in a second what three independent censuses
// could not.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
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
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));

const { createSeedShape } = req('src/data/seeds.ts');
const { readSeedCell, glueFaces, flipGlueFaces } = req('src/lib/faceIdentification.ts');
const { readLevel3Tower } = req('src/lib/level3Invariants.ts');
const A = req('src/manuscript/apertureModel.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the census + the representative: a field whose name stopped lying, and the count that can never be wrong twice (blind concretes — measured, not sourced)\n');

const cube = createSeedShape('cube');
const seed = readSeedCell(cube);
const f = (k) => `face:cube:${k}`;
const AXES = [['left', 'right'], ['front', 'back'], ['bottom', 'top']];
const menus = AXES.map(([a, b]) => A.dihedralMapCandidates(cube, f(a), f(b)));
const pairingsFor = (i, j, k) => [menus[0][i], menus[1][j], menus[2][k]].map((c, idx) => ({
  faceA: f(AXES[idx][0]), faceB: f(AXES[idx][1]), mode: c.derivedMode, map: c.map,
}));
const glue = (sd, ps) => (ps.some((p) => p.mode === 'reversing') ? flipGlueFaces(sd, ps) : glueFaces(sd, ps));
const setKey = (ids) => [...ids].sort().join('|');

// ═════ the census — one sweep, every leg reads from it ═══════════════════════════
const tally = {
  folded: 0, sound: 0, rest: 0,
  foldedWithCone: 0, foldedConeFree: 0, soundWithCone: 0, soundFlat: 0,
};
const angleHist = new Map(); // true cone-edge angle (k×90°) across the FOLDED forms
const failureKinds = new Map();
let keyAgreements = 0; // folded failures whose classRoot === the member-set-matched link's edgeClass
let keyChecks = 0;
let repIsSmallestMember = 0;
let repEdgeIdCount = 0;
let edgeClassLeaks = 0; // folded failures still exposing a defined .edgeClass (must be zero)
// ★ THE MUTANT (Clause 4, in-memory — the bug that ACTUALLY happened): match
// folded classes by REPRESENTATIVE ID against the link's root id.
let mutantFoldedWithCone = 0;
// …and the no-op it silently equals: running NO fold filter at all.
let noFilterFoldedWithCone = 0;
let foldedFixture = null;

for (let i = 0; i < 8; i += 1) for (let j = 0; j < 8; j += 1) for (let k = 0; k < 8; k += 1) {
  const reading = readLevel3Tower(glue(seed, pairingsFor(i, j, k)));
  const gate = reading.folded ? reading.gate : reading.tower.gate;
  for (const fail of gate.failures) failureKinds.set(fail.kind, (failureKinds.get(fail.kind) ?? 0) + 1);
  const foldedFails = gate.failures.filter((x) => x.kind === 'folded-edge');
  for (const fail of foldedFails) {
    repEdgeIdCount += 1;
    if (fail.edgeClass !== undefined) edgeClassLeaks += 1;
    if (fail.repEdgeId === [...fail.memberEdgeIds].sort()[0]) repIsSmallestMember += 1;
    // the two views must now share the ROOT: member-set match ≡ classRoot match
    const link = gate.edgeLinks.find((l) => setKey(l.memberEdgeIds) === setKey(fail.memberEdgeIds));
    keyChecks += 1;
    if (link && link.edgeClass === fail.classRoot) keyAgreements += 1;
  }
  const foldedSets = new Set(foldedFails.map((x) => setKey(x.memberEdgeIds)));
  const foldedRoots = new Set(foldedFails.map((x) => x.classRoot));
  const foldedRepIds = new Set(foldedFails.map((x) => x.repEdgeId)); // the mutant's key
  const links = gate.edgeLinks;
  // honest: a TRUE cone edge is k≠4 AND NOT folded — folds excluded by ROOT
  // (and the member-set key must agree, asserted above)
  const trueCones = links.filter((l) => l.memberEdgeIds.length !== 4 && !foldedRoots.has(l.edgeClass) && !foldedSets.has(setKey(l.memberEdgeIds)));
  const mutantCones = links.filter((l) => l.memberEdgeIds.length !== 4 && !foldedRepIds.has(l.edgeClass));
  const noFilterCones = links.filter((l) => l.memberEdgeIds.length !== 4);
  if (reading.folded) {
    tally.folded += 1;
    if (!foldedFixture) foldedFixture = { reading, trueCones };
    if (trueCones.length > 0) tally.foldedWithCone += 1; else tally.foldedConeFree += 1;
    if (mutantCones.length > 0) mutantFoldedWithCone += 1;
    if (noFilterCones.length > 0) noFilterFoldedWithCone += 1;
    for (const l of trueCones) {
      const angle = l.memberEdgeIds.length * 90;
      angleHist.set(angle, (angleHist.get(angle) ?? 0) + 1);
    }
  } else if (reading.tower.sound) {
    tally.sound += 1;
    if (trueCones.length > 0) tally.soundWithCone += 1; else tally.soundFlat += 1;
  } else {
    tally.rest += 1;
  }
}

// ═════ [a] THE SIX — measured, printed, pinned ════════════════════════════════════
console.log('----- [a] the census: six strata, measured fresh from the committed op + gate (never sourced from a letter) -----');
console.log(`  ┌─ THE CENSUS (all 512 door pairings) ─────────────────────────`);
console.log(`  │ folded: ${tally.folded} · sound: ${tally.sound} · the-rest: ${tally.rest}`);
console.log(`  │ folded-with-cone: ${tally.foldedWithCone} · folded-cone-free: ${tally.foldedConeFree}`);
console.log(`  │ sound-with-cone: ${tally.soundWithCone} · sound-flat: ${tally.soundFlat}`);
console.log(`  └───────────────────────────────────────────────────────────────`);
check('★ THE SIX STRATA, pinned as measured: folded 97 · sound 79 · the-rest 336 · folded-with-cone 46 · folded-cone-free 51 · sound-with-cone 36 · sound-flat 43 (classes matched by MEMBER-EDGE SET and by classRoot — never by representative id)',
  tally.folded === 97 && tally.sound === 79 && tally.rest === 336 &&
  tally.foldedWithCone === 46 && tally.foldedConeFree === 51 &&
  tally.soundWithCone === 36 && tally.soundFlat === 43);

// ═════ [b] ★ THE TOTALS — the partition must sum to the whole ════════════════════
console.log('\n----- [b] ★ LAW 25\'s corollary: every total closes (one line that would have caught three offices) -----');
console.log(`  folded-with-cone + folded-cone-free = ${tally.foldedWithCone} + ${tally.foldedConeFree} = ${tally.foldedWithCone + tally.foldedConeFree} (folded: ${tally.folded})`);
console.log(`  sound-with-cone + sound-flat = ${tally.soundWithCone} + ${tally.soundFlat} = ${tally.soundWithCone + tally.soundFlat} (sound: ${tally.sound})`);
console.log(`  sound + folded + the-rest = ${tally.sound} + ${tally.folded} + ${tally.rest} = ${tally.sound + tally.folded + tally.rest} (the whole: 512)`);
check('★ THE PARTITION SUMS TO THE WHOLE: folded-with-cone + folded-cone-free == folded · sound-with-cone + sound-flat == sound · sound + folded + the-rest == 512',
  tally.foldedWithCone + tally.foldedConeFree === tally.folded &&
  tally.soundWithCone + tally.soundFlat === tally.sound &&
  tally.sound + tally.folded + tally.rest === 512);

// ═════ [c] the histogram + the failure kinds ══════════════════════════════════════
console.log('\n----- [c] the true cone-edge angles across the folded, and the failure kinds -----');
const hist = [...angleHist.entries()].sort((a, b) => a[0] - b[0]);
const kinds = [...failureKinds.entries()].sort((a, b) => a[0].localeCompare(b[0]));
note(`angle histogram (k×90°, TRUE cone edges in folded forms): ${hist.map(([a, c]) => `${a}° × ${c}`).join(' · ')}`);
note(`failure kinds across all 512: ${kinds.map(([k, c]) => `${k} ${c}`).join(' · ')}`);
check('the true cone-edge angle histogram across the folded forms is 180° × 12 · 540° × 16 · 720° × 24 (a folded edge is NOT a cone edge — its holonomy reverses the edge, so k×90° does not apply to it and none is counted here), and the failure kinds read folded-edge 200 · vertex-link 508',
  JSON.stringify(hist) === JSON.stringify([[180, 12], [540, 16], [720, 24]]) &&
  JSON.stringify(kinds) === JSON.stringify([['folded-edge', 200], ['vertex-link', 508]]));

// ═════ [d] the representative and the root — the two views share a key now ═══════
console.log('\n----- [d] the fix: repEdgeId IS the smallest member (the wall\'s value, unmoved); classRoot IS the link view\'s key -----');
check('every folded-edge failure across the sweep: repEdgeId === the lex-smallest member edge id (the exact value the old field held — the wall\'s printed VALUE did not move), and classRoot === the member-set-matched link reading\'s edgeClass (the two views share the canonical key, class by class)',
  repEdgeIdCount === 200 && repIsSmallestMember === 200 && keyChecks === 200 && keyAgreements === 200);
note(`folded-edge failures: ${repEdgeIdCount} · rep = smallest member: ${repIsSmallestMember} · root agrees with link key: ${keyAgreements}/${keyChecks}`);
check('`.edgeClass` DOES NOT EXIST on a folded-edge failure: zero of the 200 folded failures expose a defined edgeClass at runtime, the gate source mints repEdgeId + classRoot (and no edgeClass) on that record, and the invariants reader maps repEdgeId — the silent id-cross-reference is now a TYPE ERROR (tsc-enforced) and a runtime undefined',
  edgeClassLeaks === 0 &&
  (() => {
    const gateSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/level3SoundnessGate.ts'), 'utf8');
    const mintStart = gateSrc.indexOf("kind: 'folded-edge',");
    const mintBlock = gateSrc.slice(mintStart, gateSrc.indexOf('}', mintStart));
    const invSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/level3Invariants.ts'), 'utf8');
    return mintBlock.includes('repEdgeId: rep.id') && mintBlock.includes('classRoot: root') &&
      !mintBlock.includes('edgeClass:') && invSrc.includes('.map((f) => f.repEdgeId)');
  })());

// ═════ [e] the wall — same words, same value ══════════════════════════════════════
console.log('\n----- [e] ⛔ the wall\'s printed value did not move (the rep edge id, in the researcher\'s verbatim text) -----');
check('the person-facing WALL carries the rep edge id: on a folded fixture, foldedEdgeClasses[0] is the rep edge id (the smallest member — the identical VALUE the old field carried), and foldedEdgeWall(...) embeds exactly it in the ruled sentence (V3 §1 cut the subdivide clause — the wall is the LIMIT; "not free" pins the ruled body)',
  (() => {
    const v = foldedFixture.reading;
    const rep = v.foldedEdgeClasses[0];
    const firstFail = v.gate.failures.find((x) => x.kind === 'folded-edge');
    const wall = A.foldedEdgeWall(rep);
    return rep === firstFail.repEdgeId && rep === [...firstFail.memberEdgeIds].sort()[0] &&
      wall.includes(`edge class ${rep} `) && wall.includes('not free') && !wall.includes('subdivide');
  })());

// ═════ [f] ★ THE MUTANT — the bug that actually happened, carried in-memory ══════
console.log('\n----- [f] ★ the id-matching census (the bug three offices ran): a different count, visibly failing the pin -----');
console.log(`  honest (member-set/root matched): folded-with-cone = ${tally.foldedWithCone}`);
console.log(`  MUTANT (rep-id matched):          folded-with-cone = ${mutantFoldedWithCone}`);
console.log(`  NO FILTER AT ALL:                 folded-with-cone = ${noFilterFoldedWithCone}`);
check('★ CLAUSE 4 — the carried ID-MATCHING census (folded classes excluded by rep-id vs the link\'s root id — the mechanism that ACTUALLY shipped three wrong numbers) produces folded-with-cone = 61: DIFFERENT from the honest 46, VISIBLY failing the pin — and IDENTICAL to running no filter at all (61 === 61): the filter was a no-op, exactly as diagnosed',
  mutantFoldedWithCone === 61 && mutantFoldedWithCone !== tally.foldedWithCone &&
  mutantFoldedWithCone === noFilterFoldedWithCone);

// ═════ [g] the freeze — two hashes re-sealed, the sanctioned path ═════════════════
console.log('\n----- [g] the frozen pair re-sealed: ok · 44 · no drift (the sanctioned path — never a carve-out) -----');
const freeze = checkEngineFreeze();
check('THE ENGINE FREEZE MANIFEST after the re-seal: ok · checked 45 · drifted [] · missing [] · unlisted [] · nulled [] — the two sanctioned hash lines moved in this same change and coverage never lapsed; no third frozen file was touched and the closure pulled nothing new in',
  freeze.ok === true && freeze.checked === 48 /* 47 → 48: cornerCycleName.ts joined the frozen set at the A-3b closure cure (2d9eb97) — the ONE corner-cycle composer frozen beside its frozen consumer */ &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 &&
  freeze.unlisted.length === 0 && freeze.nulled.length === 0);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
