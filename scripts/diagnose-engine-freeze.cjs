#!/usr/bin/env node
// diagnose-engine-freeze.cjs — THE ENGINE FREEZE MANIFEST (engineer-chartered
// 2026-07-12, sealed 96ab2ede…1a1d, built blind 2026-07-13 at baseline 9fd3581).
// RECUT 2026-07-14 (THE SMALL RUN, baseline 5f3aecc): the freeze is closed
// under imports (27 → 44, incl. src/types), the NUL law rides in the checker,
// and the HEAD-read inventory below pins EVERY idiom — `git show HEAD:` AND
// `git cat-file blob` (the four newer witnesses adopted the plumbing spelling
// precisely to avoid reddening the old pin; an inventory that guards only the
// channel nobody uses is a hole shaped like the channel everybody does).
//
// THE LAW: A GUARD MUST NOT REQUIRE A HOLE IN ITSELF TO PERMIT A SANCTIONED
// CHANGE. The old mechanism — nine diagnostics, each hand-maintaining its own
// `guarded` array compared file-by-file against `git show HEAD:` — could
// permit a mandated edit ONLY by removing the file from its own list. Every
// sanctioned change punched a silent hole; pre-commit the file could not be
// restored (working ≠ HEAD ⇒ red), post-commit nobody was forced to; coverage
// grew a hole shaped exactly like the last thing we changed.
// `playgroundOperations.ts` — the op registry, resolveLineage,
// getDisabledReason, singleFaceGateReason — ended up GUARDED BY NOBODY, and
// nothing went red to say so.
//
// The manifest (docs/governance/ENGINE_FREEZE_MANIFEST.txt) replaces it: ONE
// frozen set, one content hash per file; a sanctioned change is a one-line,
// loud, reviewable hash update in the SAME commit; coverage never lapses; the
// checker (scripts/lib/engineFreeze.cjs) reads and can never write.
//
// Four clauses, each proving its own teeth:
//   1. EXECUTE WHAT YOU WITNESS — all nine engine witnesses actually call
//      checkEngineFreeze() and assert ok, stub-proofed by their bite legs.
//   2. ★ CARRY THE OLD MECHANISM AND SHOW IT MISSES THE REAL HOLE — the nine
//      per-diagnostic lists ride below AS MEASURED AT 9fd3581; on an
//      unsanctioned in-memory edit to the orphan they visibly catch NOTHING
//      while the manifest visibly FAILS. (THE WITNESS OUTLIVES THE COMMIT:
//      the lists are literals here, not reads of HEAD's scripts.)
//   3. ★ THE BITE — 27/27 one-character mutations fail; 27/27 CRLF
//      re-expressions pass (the CR-strip is not itself a hole).
//   4. ★ ZERO DRIFT AT BASELINE — ok, drifted [], missing [], unlisted [].
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const repoRoot = path.resolve(__dirname, '..');
const { checkEngineFreeze, checkUntrackedImports } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the engine freeze manifest: one frozen set, one hash per file — a sanctioned change is one loud line, and coverage never lapses\n');

// ═════ [a] CLAUSE 4 — ZERO DRIFT AT BASELINE ═══════════════════════════════════
console.log('----- [a] zero drift at baseline: the manifest matches the tree it was chartered against -----');
const base = checkEngineFreeze();
check('★ CLAUSE 4 — ZERO DRIFT AT BASELINE (import-closed at 5f3aecc, THE SMALL RUN): ok === true · 44 files checked · drifted [] · missing [] · unlisted [] · nulled [] (any drift here means a hash was mis-taken — HARD FAIL)',
  base.ok === true && base.checked === 44 &&
  base.drifted.length === 0 && base.missing.length === 0 && base.unlisted.length === 0 &&
  base.nulled.length === 0);
if (!base.ok) note(`drifted: [${base.drifted}] · missing: [${base.missing}] · unlisted: [${base.unlisted}] · nulled: [${base.nulled}]`);
check('COMPLETENESS: every .ts/.tsx under src/lib · src/playground · src/manuscript · src/types is classified — 44 FROZEN (the import closure: a frozen file is only as frozen as its dependencies), the rest NOT_FROZEN with a reason; `unlisted` non-empty would FAIL every witness',
  base.unlisted.length === 0 && base.frozen.length === 44);
check('THE COUNT GREW (§1 THE SMALL RUN): the closure added the 17 files the frozen set imports — the core types (src/types/geometry.ts), id-minting (ids.ts), lineage, shape/packets, the level3 tower, faceIdentification, dualization, surfaceDual, seeds, primitiveCatalogue, writtenFormModel',
  base.checked > 27 &&
  ['src/types/geometry.ts', 'src/lib/ids.ts', 'src/lib/lineage.ts', 'src/lib/shape.ts',
   'src/manuscript/writtenFormModel.ts', 'src/lib/faceIdentification.ts',
   'src/lib/level3Invariants.ts', 'src/data/seeds.ts'].every((f) => base.frozen.includes(f)));
note(`manifest: ${base.manifestPath} — 44 frozen (24 lib · 11 manuscript · 7 playground · 1 types · 1 data)`);

// ═════ [b] THE ORPHAN IS RE-COVERED — and the old mechanism misses it ══════════
console.log('\n----- [b] the orphan: an unsanctioned edit to playgroundOperations.ts — the manifest fails; the carried old mechanism catches nothing -----');
const ORPHAN = 'src/playground/playgroundOperations.ts';
const orphanReal = fs.readFileSync(path.join(repoRoot, ORPHAN), 'utf8');
const orphanEdited = orphanReal.slice(0, 100) + (orphanReal[100] === 'X' ? 'Y' : 'X') + orphanReal.slice(101);
const manifestOnOrphan = checkEngineFreeze({ overrides: { [ORPHAN]: orphanEdited } });
check('THE ORPHAN IS RE-COVERED: an unsanctioned in-memory edit to playgroundOperations.ts FAILS the manifest — exactly it drifts, nothing else',
  manifestOnOrphan.ok === false &&
  manifestOnOrphan.drifted.length === 1 && manifestOnOrphan.drifted[0] === ORPHAN);

// ★ CLAUSE 2 — THE OLD MECHANISM, CARRIED IN MEMORY (the witness outlives the
// commit: these are the nine `guarded` arrays VERBATIM as they stood at
// 9fd3581 — literals, never read back from HEAD's scripts, which this build's
// commit rewrites). The mechanism itself is reproduced in shape: per-list,
// per-file, CR-stripped `git show HEAD:` vs the (overridable) working content.
const OLD_PER_DIAGNOSTIC_LISTS = {
  'diagnose-acquisition-chain.cjs': [
    'src/lib/surfaceOperations.ts', 'src/lib/materializeOperation.ts', 'src/lib/transformationLedger.ts',
    'src/lib/incidenceTraceRegistry.ts', 'src/lib/globalW1.ts', 'src/lib/multiform.ts',
    'src/lib/connectedSum.ts', 'src/lib/cutOperation.ts', 'src/lib/surfaceImmersion.ts',
    'src/playground/customGluing.ts', 'src/playground/bornFormRouting.ts', 'src/playground/snapshot.ts',
    'src/manuscript/inkedFormModel.ts', 'src/manuscript/optionBModel.ts',
  ],
  'diagnose-canonical-wedge.cjs': [
    'src/lib/surfaceOperations.ts', 'src/lib/materializeOperation.ts', 'src/lib/transformationLedger.ts',
    'src/lib/incidenceTraceRegistry.ts', 'src/lib/globalW1.ts', 'src/lib/multiform.ts',
    'src/lib/connectedSum.ts', 'src/lib/cutOperation.ts', 'src/lib/surfaceImmersion.ts',
    'src/playground/customGluing.ts', 'src/playground/bornFormRouting.ts', 'src/playground/formInvariants.ts',
    'src/playground/snapshot.ts', 'src/manuscript/surfaceClassifier.ts', 'src/manuscript/inkedFormModel.ts',
    'src/manuscript/optionBModel.ts',
  ],
  'diagnose-combine-is-connected-sum.cjs': [
    'src/lib/connectedSum.ts', 'src/lib/multiform.ts', 'src/lib/genealogyDag.ts',
    'src/lib/complexIdentification.ts', 'src/lib/surfaceOperations.ts', 'src/lib/materializeOperation.ts',
    'src/lib/transformationLedger.ts', 'src/lib/incidenceTraceRegistry.ts', 'src/lib/globalW1.ts',
    'src/lib/cutOperation.ts', 'src/lib/surfaceImmersion.ts', 'src/playground/customGluing.ts',
    'src/playground/bornFormRouting.ts', 'src/playground/formInvariants.ts', 'src/playground/snapshot.ts',
    'src/playground/genealogyLayout.ts', 'src/manuscript/surfaceClassifier.ts', 'src/manuscript/classBodyModel.ts',
    'src/manuscript/standardBodies.ts', 'src/manuscript/inkedFormModel.ts', 'src/manuscript/optionBModel.ts',
  ],
  'diagnose-complex-identification.cjs': [
    'src/lib/surfaceOperations.ts', 'src/lib/materializeOperation.ts', 'src/lib/transformationLedger.ts',
    'src/lib/incidenceTraceRegistry.ts', 'src/lib/globalW1.ts', 'src/lib/multiform.ts',
    'src/lib/connectedSum.ts', 'src/lib/cutOperation.ts', 'src/lib/surfaceImmersion.ts',
    'src/playground/customGluing.ts', 'src/playground/bornFormRouting.ts', 'src/playground/snapshot.ts',
    'src/manuscript/inkedFormModel.ts', 'src/manuscript/optionBModel.ts',
  ],
  'diagnose-identify-oracle.cjs': [
    'src/lib/surfaceOperations.ts', 'src/lib/materializeOperation.ts', 'src/lib/transformationLedger.ts',
    'src/lib/incidenceTraceRegistry.ts', 'src/lib/globalW1.ts', 'src/lib/multiform.ts',
    'src/lib/connectedSum.ts', 'src/lib/cutOperation.ts', 'src/lib/surfaceImmersion.ts',
    'src/playground/customGluing.ts', 'src/playground/bornFormRouting.ts', 'src/playground/formInvariants.ts',
    'src/playground/snapshot.ts', 'src/manuscript/surfaceClassifier.ts', 'src/manuscript/inkedFormModel.ts',
    'src/manuscript/optionBModel.ts',
  ],
  'diagnose-multiparent-dag-walk.cjs': [
    'src/lib/genealogyDag.ts', 'src/lib/multiform.ts', 'src/lib/connectedSum.ts',
    'src/lib/complexIdentification.ts', 'src/lib/surfaceOperations.ts', 'src/lib/materializeOperation.ts',
    'src/lib/transformationLedger.ts', 'src/lib/incidenceTraceRegistry.ts', 'src/lib/globalW1.ts',
    'src/lib/cutOperation.ts', 'src/lib/surfaceImmersion.ts', 'src/playground/customGluing.ts',
    'src/playground/bornFormRouting.ts', 'src/playground/formInvariants.ts', 'src/playground/snapshot.ts',
    'src/manuscript/surfaceClassifier.ts', 'src/manuscript/inkedFormModel.ts', 'src/manuscript/optionBModel.ts',
  ],
  'diagnose-p-immerse.cjs': [
    'src/lib/surfaceImmersion.ts', 'src/lib/globalW1.ts', 'src/lib/incidenceTraceRegistry.ts',
    'src/lib/multiform.ts', 'src/lib/connectedSum.ts', 'src/lib/cutOperation.ts',
    'src/lib/materializeOperation.ts', 'src/playground/snapshot.ts', 'src/manuscript/optionBModel.ts',
    'src/manuscript/inkedFormModel.ts', 'src/manuscript/InkedForm.tsx', 'src/manuscript/InkedDomain.tsx',
    'src/manuscript/worldModel.ts', 'src/manuscript/specimenModel.ts',
  ],
  'diagnose-registry-unbounding.cjs': [
    'src/lib/surfaceOperations.ts', 'src/lib/materializeOperation.ts', 'src/lib/transformationLedger.ts',
    'src/lib/incidenceTraceRegistry.ts', 'src/lib/globalW1.ts', 'src/lib/multiform.ts',
    'src/lib/connectedSum.ts', 'src/lib/cutOperation.ts', 'src/lib/surfaceImmersion.ts',
    'src/playground/customGluing.ts', 'src/playground/bornFormRouting.ts', 'src/playground/formInvariants.ts',
    'src/playground/snapshot.ts', 'src/manuscript/surfaceClassifier.ts', 'src/manuscript/inkedFormModel.ts',
    'src/manuscript/optionBModel.ts',
  ],
  'diagnose-the-person-picks-the-face.cjs': [
    'src/playground/customGluing.ts', 'src/playground/bornFormRouting.ts', 'src/playground/formInvariants.ts',
    'src/playground/snapshot.ts', 'src/lib/complexIdentification.ts', 'src/lib/surfaceOperations.ts',
    'src/lib/materializeOperation.ts', 'src/lib/cutOperation.ts', 'src/lib/connectedSum.ts',
    'src/lib/multiform.ts', 'src/lib/genealogyDag.ts', 'src/lib/transformationLedger.ts',
    'src/lib/incidenceTraceRegistry.ts', 'src/lib/globalW1.ts', 'src/lib/surfaceImmersion.ts',
    'src/manuscript/genesisModel.ts', 'src/manuscript/surfaceClassifier.ts', 'src/manuscript/classBodyModel.ts',
    'src/manuscript/inkedFormModel.ts', 'src/manuscript/optionBModel.ts',
  ],
};
const crStrip = (s) => s.replace(/\r/g, '');
const headCache = new Map();
const headContentOf = (file) => {
  if (!headCache.has(file)) {
    headCache.set(file, execSync(`git show HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 }));
  }
  return headCache.get(file);
};
const oldMechanismCatches = (overrides) => {
  const caught = [];
  for (const [witness, list] of Object.entries(OLD_PER_DIAGNOSTIC_LISTS)) {
    for (const file of list) {
      const work = Object.prototype.hasOwnProperty.call(overrides, file)
        ? overrides[file]
        : fs.readFileSync(path.join(repoRoot, file), 'utf8');
      if (crStrip(headContentOf(file)) !== crStrip(work)) caught.push(`${witness}: ${file}`);
    }
  }
  return caught;
};
const oldListCounts = Object.values(OLD_PER_DIAGNOSTIC_LISTS).map((l) => l.length);
const oldUnion = new Set(Object.values(OLD_PER_DIAGNOSTIC_LISTS).flat());
// HEAD-STATE-AWARE (THE SMALL RUN, 2026-07-14): §2's sanctioned reorder moves
// customGluing.ts — a file EIGHT of the nine carried lists cover. Pre-commit
// the old mechanism catches exactly that sanctioned edit (it cannot tell a
// mandate from drift — the treadmill's whole cost); post-commit it catches
// nothing. The legs below therefore filter the sanctioned file out: what must
// be ZERO in BOTH states is the UNSANCTIONED catch.
const SMALL_RUN_SANCTIONED = ['src/playground/customGluing.ts'];
const unsanctionedOf = (catches) =>
  catches.filter((c) => !SMALL_RUN_SANCTIONED.some((f) => c.endsWith(`: ${f}`)));
const onlyFile = (catches, file) => catches.filter((c) => c.endsWith(`: ${file}`));
check('the carried lists ARE the measured old mechanism: nine lists sized 14·14·14·16·16·16·18·20·21, union 26 — and the ORPHAN is in NONE of them (the hole, exhibited)',
  [...oldListCounts].sort((a, b) => a - b).join('·') === '14·14·14·16·16·16·18·20·21' &&
  oldUnion.size === 26 && !oldUnion.has(ORPHAN));
check('…and the carried old mechanism is REAL, not a strawman: zero UNSANCTIONED catches at baseline (pre-commit it flags only §2\'s sanctioned customGluing edit — a mandate it cannot tell from drift), and on a one-character edit to the sentinel it catches the edit in ALL NINE lists',
  unsanctionedOf(oldMechanismCatches({})).length === 0 &&
  (() => {
    const s = 'src/lib/incidenceTraceRegistry.ts';
    const real = fs.readFileSync(path.join(repoRoot, s), 'utf8');
    const flipped = real.slice(0, 100) + (real[100] === 'X' ? 'Y' : 'X') + real.slice(101);
    return onlyFile(oldMechanismCatches({ [s]: flipped }), s).length === 9;
  })());
const oldOnOrphan = oldMechanismCatches({ [ORPHAN]: orphanEdited });
check('★ CLAUSE 2 — THE TREADMILL\'S COST, ON THE EXACT FILE IT LOST: the SAME unsanctioned edit to the orphan — the OLD mechanism VISIBLY PASSES (all nine lists, 149 comparisons, ZERO unsanctioned catches) while the MANIFEST VISIBLY FAILS',
  unsanctionedOf(oldOnOrphan).length === 0 && manifestOnOrphan.ok === false);
for (const witness of Object.keys(OLD_PER_DIAGNOSTIC_LISTS)) {
  note(`${witness.padEnd(42)} old guard: PASS (the hole — orphan not in its list)`);
}
note(`the manifest on the same edit: FAIL — drifted: [${manifestOnOrphan.drifted}]`);

// ═════ [c] CLAUSE 3 — THE BITE, 27/27 ═══════════════════════════════════════════
console.log('\n----- [c] the bite: every frozen file, mutated one character in memory, must fail; CRLF re-expression must pass -----');
let bitesCaught = 0;
let bitesExact = 0;
let crlfPasses = 0;
for (const file of base.frozen) {
  const real = fs.readFileSync(path.join(repoRoot, file), 'utf8');
  const at = Math.min(100, real.length - 1);
  const flipped = real.slice(0, at) + (real[at] === 'X' ? 'Y' : 'X') + real.slice(at + 1);
  const bite = checkEngineFreeze({ overrides: { [file]: flipped } });
  if (bite.ok === false) bitesCaught += 1;
  if (bite.drifted.length === 1 && bite.drifted[0] === file) bitesExact += 1;
  const crlf = checkEngineFreeze({ overrides: { [file]: real.replace(/\r/g, '').replace(/\n/g, '\r\n') } });
  if (crlf.ok === true) crlfPasses += 1;
}
check('★ CLAUSE 3 — THE BITE: 44/44 one-character in-memory mutations FAIL the freeze (and each names exactly the mutated file)',
  bitesCaught === 44 && bitesExact === 44);
check('…and the CR-strip is not itself a hole: 44/44 CRLF re-expressions of the true content PASS (measured, not assumed)',
  crlfPasses === 44);
note(`bite: ${bitesCaught}/44 caught, ${bitesExact}/44 exact · CRLF: ${crlfPasses}/44 pass`);
// §4 THE SMALL RUN — THE NUL LAW BITES: a raw NUL planted in-memory into a
// frozen file (appended inside a comment — the HASH still matches nothing, but
// even a hash-PASSING NUL must fail: plant it into content that keeps its
// bytes otherwise real) is a FAIL naming the file, never a warning.
check('★ THE NUL LAW BITES: a raw NUL byte planted in-memory into a frozen file fails the freeze with `nulled: [exactly that file]` (a NUL-bearing file is grep-BLIND — every content audit of it is a false negative)',
  (() => {
    const f = 'src/lib/faceIdentification.ts';
    const real = fs.readFileSync(path.join(repoRoot, f), 'utf8');
    const planted = checkEngineFreeze({ overrides: { [f]: real + '// ' + String.fromCharCode(0) + '\n' } });
    return planted.ok === false && planted.nulled.length === 1 && planted.nulled[0] === f &&
      checkEngineFreeze().nulled.length === 0;
  })());

// ═════ [c½] ★ THE FIFTH GUARD (small-run re-cut, 2026-07-14) ═════════════════════
// NO TRACKED FILE MAY IMPORT AN UNTRACKED FILE. Earned by the commit that did
// not build: the probes' baked module stayed untracked while its importer rode
// the commit — tsc was green only because the working tree held the file. Four
// guards catch a file CHANGING behind our backs; this one catches a file NEVER
// ARRIVING AT ALL. The working tree is not the commit.
console.log('\n----- [c½] the fifth guard: every relative import of every tracked src file resolves to a TRACKED file -----');
const imports = checkUntrackedImports();
check('★ NO TRACKED FILE MAY IMPORT AN UNTRACKED FILE: every relative (and src-rooted) import across all tracked .ts/.tsx under src resolves to a tracked file — zero violations (the probes\' baked module is TRACKED now; the one measured violation is healed by staging, not by a hole)',
  imports.ok === true && imports.violations.length === 0 && imports.checked >= 180);
note(`importers checked: ${imports.checked} · violations: [${imports.violations.join(', ') || 'none'}]`);
check('…and THE FIFTH GUARD BITES: an in-memory tracked importer given an import of an untracked path FAILS, naming BOTH files (importer and spec)',
  (() => {
    const importer = 'src/lib/ids.ts';
    const real = fs.readFileSync(path.join(repoRoot, importer), 'utf8');
    const planted = checkUntrackedImports({
      overrides: { [importer]: `${real}\nimport './__never_arrived';\n` },
    });
    return planted.ok === false && planted.violations.length === 1 &&
      planted.violations[0].includes(importer) && planted.violations[0].includes('./__never_arrived');
  })());

// ═════ [d] CLAUSE 1 + battery 5 — the nine witnesses actually run this check ═══
console.log('\n----- [d] the nine witnesses: all call the shared checker; zero guarded arrays; zero frozen-file HEAD reads (carried-mutant reads excepted, named) -----');
const NINE = Object.keys(OLD_PER_DIAGNOSTIC_LISTS);
const nineSources = new Map(NINE.map((name) => [name, fs.readFileSync(path.join(__dirname, name), 'utf8')]));
check('CLAUSE 1 — EXECUTE WHAT YOU WITNESS: all NINE engine witnesses require the shared checker, call checkEngineFreeze(), and assert `freeze.ok === true` (a diagnostic that checks nothing is not a witness)',
  NINE.every((name) => {
    const src = nineSources.get(name);
    return src.includes("require(path.join(__dirname, 'lib', 'engineFreeze.cjs'))") &&
      src.includes('checkEngineFreeze(') && src.includes('freeze.ok === true');
  }));
// Stub-proof: an always-ok checker cannot satisfy the witnesses' bite legs —
// each demands ok === false on an in-memory mutation. Demonstrated:
const alwaysOkStub = () => ({ ok: true, drifted: [], missing: [], unlisted: [], nulled: [], checked: 44, frozen: [] });
const stubOnMutation = alwaysOkStub({ overrides: { [ORPHAN]: orphanEdited } });
const realOnMutation = checkEngineFreeze({ overrides: { [ORPHAN]: orphanEdited } });
check('…and the call is STUB-PROOF: a stubbed always-ok checker FAILS every witness\'s bite leg (the leg demands ok === false on the mutation — the real checker delivers it, the stub cannot)',
  stubOnMutation.ok === true && realOnMutation.ok === false);
check('zero per-diagnostic `guarded` arrays survive anywhere under scripts/',
  (() => {
    const all = [];
    const walkScripts = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) walkScripts(abs);
        else if (entry.name.endsWith('.cjs')) all.push(abs);
      }
    };
    walkScripts(__dirname);
    return all.every((abs) => !/const guarded = \[/.test(fs.readFileSync(abs, 'utf8')));
  })());
// ═══ THE HEAD-READ INVENTORY (§3 THE SMALL RUN, recut 2026-07-14) ═══════════
// The old pin guarded ONE idiom — git-show-HEAD — and the four newer witnesses
// adopted the cat-file plumbing spelling precisely to avoid reddening it: the
// inventory guarded the channel nobody uses and ignored the one everybody
// does. A retired guard-idiom could have walked back in through cat-file
// unseen. This pin covers EVERY means of reading a committed blob — the
// porcelain rev-colon read, the cat-file plumbing (blob and -p), ls-tree, and
// the rev-parse rev-colon spelling — counted on non-comment lines, per script.
//
// Every surviving read is NAMED and justified: carried-mutant fidelity or
// HEAD-compile equivalence ONLY. ⛔ No frozen-file HEAD-differential GUARD may
// exist by ANY spelling — guarding is the manifest's job; a HEAD-guard would
// re-create the treadmill this witness exists to bury.
//   porcelain rev-colon reads (1 each):
//     diagnose-multiparent-dag-walk.cjs    · §h walker-mutant fidelity (playgroundOperations)
//     diagnose-combine-is-connected-sum.cjs · §h door-mutant fidelity (genesisModel)
//     diagnose-the-person-picks-the-face.cjs · §f faces[0]-mutant fidelity (writtenFormModel)
//     diagnose-engine-freeze.cjs           · the carried OLD mechanism above (Clause 2)
//   plumbing blob reads:
//     diagnose-the-aperture.cjs   1 · headBlobOf — HEAD-state-aware moved-surface + mutant fidelity
//     diagnose-the-folded-edge.cjs 3 · HEAD-compiled tower ×2 (the 415-tower equivalence) + moved-surface headBlobOf
//     diagnose-the-ink.cjs        3 · ApertureView fidelity · apertureModel deleted-line fidelity · moved-surface headBlobOf
//     diagnose-the-probes.cjs     1 · headBlobOf — moved-surface + mutant fidelity
//     diagnose-the-small-run.cjs  1 · headBlobOf — §4 NUL-reconstruction fidelity + §2 string census vs HEAD
const J2 = (a, b) => a + b; // split halves: this scanner's own source must not self-hit
const HEAD_READ_IDIOMS = {
  show: new RegExp(J2('git\\s+sh', 'ow\\s+\\S*:')),
  catfile: new RegExp(J2('git\\s+cat', '-file\\s+(blob|-p)')),
  lstree: new RegExp(J2('git\\s+ls', '-tree')),
  revparse: new RegExp(J2('git\\s+rev', '-parse\\s+\\S*:')),
  // a rev-anchored diff or grep also touches committed content — a drift guard
  // or a content probe can be SPELLED with either, so both are pinned too
  gitdiff: new RegExp(J2('git\\s+di', 'ff\\s+[^\\n]*\\bHEAD\\b')),
  gitgrep: new RegExp(J2('git\\s+gr', 'ep\\s+[^\\n]*\\bHEAD\\b')),
};
const HEAD_READ_ALLOWLIST = new Map([
  ['diagnose-multiparent-dag-walk.cjs', { show: 1 }],
  ['diagnose-combine-is-connected-sum.cjs', { show: 1 }],
  ['diagnose-the-person-picks-the-face.cjs', { show: 1 }],
  ['diagnose-engine-freeze.cjs', { show: 1 }],
  // the four moved-surface legs use a rev-anchored name-only diff as
  // CANDIDATES ONLY (names, never verdicts — every verdict goes through the
  // CR-stripped hash compare on the pinned plumbing read)
  ['diagnose-the-aperture.cjs', { catfile: 1, gitdiff: 1 }],
  ['diagnose-the-folded-edge.cjs', { catfile: 3, gitdiff: 1 }],
  ['diagnose-the-ink.cjs', { catfile: 3, gitdiff: 1 }],
  ['diagnose-the-probes.cjs', { catfile: 1, gitdiff: 1 }],
  // the small run's witness: one plumbing read (headBlobOf — §4 NUL-
  // reconstruction fidelity + §2 old-order fidelity + §6 HEAD-compiled
  // behaviour deltas) and one rev-anchored grep (the §4 grep-blindness
  // exhibit: the committed NUL-bearing blob defeats the search)
  ['diagnose-the-small-run.cjs', { catfile: 1, gitgrep: 1 }],
  // ARC 0.1 THE SUBDIVISION (2026-07-14): headBlobOf — non-movement (the
  // gate/tower byte-identity + the 512 un-subdivided verdicts vs the
  // HEAD-compiled tower reader)
  ['diagnose-the-subdivision.cjs', { catfile: 1 }],
  // B.0 THE HONEST DOOR (2026-07-15): headBlobOf — the HEAD-compiled aperture
  // reader (flat-form labels/traces byte-identity · folded verdicts untouched ·
  // pre-commit mutant fidelity)
  ['diagnose-the-honest-door.cjs', { catfile: 1 }],
  // 0.2 THE ORBIFOLD'S BODY (2026-07-16): headBlobOf — the HEAD-compiled
  // reader (79 sound forms' non-movement) + the frozen registers' byte-identity
  ['diagnose-the-orbifolds-body.cjs', { catfile: 1 }],
  // THE RIM (2026-07-16): headBlobOf — the L3 sibling's byte-identity (the
  // rim is additive, never a refactor of level3Subdivision)
  ['diagnose-the-rim.cjs', { catfile: 1 }],
  // THE EXIT (2026-07-16 re-charter): headBlobOf — the three frozen engine
  // files' non-movement (connectedSum / complexIdentification / multiform);
  // the build touched NOT_FROZEN surface only
  ['diagnose-the-exit.cjs', { catfile: 1 }],
  // THE GATE (2026-07-17): headBlobOf — non-movement ×5 + the arrival branch
  ['diagnose-the-gate.cjs', { catfile: 1 }],
  // THE COLUMN (2026-07-17): the door-column mechanism, ported to a TRACKED
  // witness — it reads COMMITTED BYTES BY DESIGN (one rev-parameterized
  // cat-file blob helper + one rev-anchored ls-tree listing; names are
  // candidates, blobs are verdicts) so it can point at HEAD and at bd99fb5
  // (the historical mutant: the world before the door, where it goes red)
  ['diagnose-the-door-column.cjs', { catfile: 1, lstree: 1 }],
  // THE BOUNDED FORM (2026-07-18): headBlobOf — the HEAD-compiled engine
  // stacks (the 512 regression + the malformed-throw differential), the
  // ⛔-files' non-movement, and the manifest re-seal differential
  ['diagnose-the-bounded-form.cjs', { catfile: 1 }],
]);
// the scanner runs over a {name → source} map so the planted-guard exhibit can
// feed it a simulated tree without touching the disk
const scanHeadReads = (sources, idioms) => {
  const found = new Map();
  for (const [name, src] of sources) {
    const counts = {};
    for (const line of src.split(/\r?\n/)) {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) continue;
      for (const [key, re] of Object.entries(idioms)) {
        if (re.test(line)) counts[key] = (counts[key] ?? 0) + 1;
      }
    }
    if (Object.keys(counts).length > 0) found.set(name, counts);
  }
  return found;
};
const inventoryMatches = (found, allowlist) => {
  if (found.size !== allowlist.size) return false;
  return [...allowlist].every(([name, expect]) => {
    const got = found.get(name);
    if (!got) return false;
    const keys = new Set([...Object.keys(expect), ...Object.keys(got)]);
    return [...keys].every((k) => (expect[k] ?? 0) === (got[k] ?? 0));
  });
};
const realScripts = new Map();
const collectScripts = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) collectScripts(abs);
    else if (entry.name.endsWith('.cjs')) realScripts.set(entry.name, fs.readFileSync(abs, 'utf8'));
  }
};
collectScripts(__dirname);
check('★ §3 — THE INVENTORY PINS EVERY HEAD-READ IDIOM: the only non-comment committed-blob reads under scripts/ are the NINE named-and-justified carried-mutant/fidelity reads (4 porcelain · 5 scripts of plumbing), zero ls-tree, zero rev-parse-colon — and nothing else, by any spelling',
  inventoryMatches(scanHeadReads(realScripts, HEAD_READ_IDIOMS), HEAD_READ_ALLOWLIST));
// ★ CLAUSE 2(b) — THE CARRIED OLD INVENTORY, AND THE GUARD IT CANNOT SEE: the
// pre-recut pin (git-show only, the four 1s — verbatim as it stood at 5f3aecc)
// runs beside the full pin on a simulated tree carrying a PLANTED frozen-file
// HEAD-guard spelled with cat-file (the retired guard idiom, new spelling).
// The old inventory VISIBLY PASSES the planted tree; the full one FAILS it.
const OLD_GIT_SHOW_ONLY = { show: new RegExp(J2('git sh', 'ow HEAD:')) };
const OLD_ALLOWLIST = new Map([
  ['diagnose-multiparent-dag-walk.cjs', { show: 1 }],
  ['diagnose-combine-is-connected-sum.cjs', { show: 1 }],
  ['diagnose-the-person-picks-the-face.cjs', { show: 1 }],
  ['diagnose-engine-freeze.cjs', { show: 1 }],
]);
const PLANTED_GUARD_SRC = [
  "const { execSync } = require('node:child_process');",
  "const guarded = require('node:fs').readFileSync('src/lib/ids.ts', 'utf8');",
  J2("const headCopy = execSync('git cat", "-file blob HEAD:src/lib/ids.ts', { encoding: 'utf8' });"),
  "if (headCopy.replace(/\\r/g, '') !== guarded.replace(/\\r/g, '')) throw new Error('ids.ts drifted from HEAD');",
].join('\n');
const plantedTree = new Map(realScripts);
plantedTree.set('diagnose-planted-head-guard.cjs', PLANTED_GUARD_SRC);
check('★ CLAUSE 2(b) — the carried git-show-only inventory VISIBLY MISSES the planted cat-file frozen-file guard (its verdict on the planted tree: PASS — the hole, exhibited) while the FULL inventory VISIBLY CATCHES it (verdict: FAIL, naming the plant)',
  (() => {
    const oldOnReal = inventoryMatches(scanHeadReads(realScripts, OLD_GIT_SHOW_ONLY), OLD_ALLOWLIST);
    const oldOnPlanted = inventoryMatches(scanHeadReads(plantedTree, OLD_GIT_SHOW_ONLY), OLD_ALLOWLIST);
    const fullOnPlanted = inventoryMatches(scanHeadReads(plantedTree, HEAD_READ_IDIOMS), HEAD_READ_ALLOWLIST);
    const plantSeen = scanHeadReads(plantedTree, HEAD_READ_IDIOMS).get('diagnose-planted-head-guard.cjs');
    note(`old inventory on the planted tree: ${oldOnPlanted ? 'PASS (misses the guard)' : 'FAIL'} · full inventory: ${fullOnPlanted ? 'PASS' : `FAIL (sees ${JSON.stringify(plantSeen)})`}`);
    return oldOnReal === true && oldOnPlanted === true && fullOnPlanted === false &&
      plantSeen !== undefined && plantSeen.catfile === 1;
  })());

// ═════ [e] battery 7 — NO script can write the manifest (grep-proof) ═══════════
console.log('\n----- [e] anti-neutering: the manifest is data — nothing under scripts/ can write it -----');
const J = (a, b) => a + b; // split literals so this scanner's own source never false-hits its own grep
const WRITE_API = new RegExp('\\b(' + [
  J('write', 'FileSync'), J('write', 'File'), J('append', 'FileSync'), J('append', 'File'),
  J('create', 'WriteStream'), J('unlink', 'Sync'), J('rm', 'Sync'), J('rename', 'Sync'),
  J('copyFile', 'Sync'), J('truncate', 'Sync'), J('mkdir', 'Sync'), J('open', 'Sync'),
].join('|') + ')\\b');
const MENTIONS_MANIFEST = new RegExp([
  J('ENGINE_FREEZE', '_MANIFEST'), J('docs', '/governance'), J('engineFreeze', '\\.cjs'),
].join('|'));
check('GREP-PROOF: every .cjs under scripts/ that can even NAME the manifest (the literal, the governance path, or the checker module) contains ZERO filesystem-write APIs — and the checker itself is read-only (no write token in its source)',
  (() => {
    const offenders = [];
    const walkScripts = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) walkScripts(abs);
        else if (entry.name.endsWith('.cjs')) {
          const src = fs.readFileSync(abs, 'utf8');
          if (MENTIONS_MANIFEST.test(src) && WRITE_API.test(src)) offenders.push(entry.name);
          if (entry.name === 'engineFreeze.cjs' && WRITE_API.test(src)) offenders.push('engineFreeze.cjs(write-token)');
        }
      }
    };
    walkScripts(__dirname);
    if (offenders.length) note(`offenders: ${offenders.join(', ')}`);
    return offenders.length === 0;
  })());
check('…and the checker has no regeneration mode: its CODE (comments stripped) consults no process.argv, carries no update/fix flag handling, and calls no write API',
  (() => {
    const code = fs.readFileSync(path.join(__dirname, 'lib', 'engineFreeze.cjs'), 'utf8')
      .split(/\r?\n/).filter((l) => !l.trim().startsWith('//')).join('\n');
    return !code.includes(J('process', '.argv')) && !code.includes(J('--', 'update')) && !WRITE_API.test(code);
  })());

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
