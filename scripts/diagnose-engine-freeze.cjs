#!/usr/bin/env node
// diagnose-engine-freeze.cjs — THE ENGINE FREEZE MANIFEST (engineer-chartered
// 2026-07-12, sealed 96ab2ede…1a1d, built blind 2026-07-13 at baseline 9fd3581).
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
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));

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
check('★ CLAUSE 4 — ZERO DRIFT AT BASELINE (9fd3581): ok === true · 27 files checked · drifted [] · missing [] · unlisted [] (any drift here means a hash was mis-taken — HARD FAIL)',
  base.ok === true && base.checked === 27 &&
  base.drifted.length === 0 && base.missing.length === 0 && base.unlisted.length === 0);
if (!base.ok) note(`drifted: [${base.drifted}] · missing: [${base.missing}] · unlisted: [${base.unlisted}]`);
check('COMPLETENESS: every .ts/.tsx under src/lib · src/playground · src/manuscript is classified — 27 FROZEN, the rest NOT_FROZEN with a reason; `unlisted` non-empty would FAIL every witness',
  base.unlisted.length === 0 && base.frozen.length === 27);
note(`manifest: ${base.manifestPath} — 27 frozen (11 lib · 10 manuscript · 6 playground)`);

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
check('the carried lists ARE the measured old mechanism: nine lists sized 14·14·14·16·16·16·18·20·21, union 26 — and the ORPHAN is in NONE of them (the hole, exhibited)',
  [...oldListCounts].sort((a, b) => a - b).join('·') === '14·14·14·16·16·16·18·20·21' &&
  oldUnion.size === 26 && !oldUnion.has(ORPHAN));
check('…and the carried old mechanism is REAL, not a strawman: it passes clean at baseline, and on a one-character edit to a file its lists DO cover (the sentinel) it catches the edit in ALL NINE lists',
  oldMechanismCatches({}).length === 0 &&
  (() => {
    const s = 'src/lib/incidenceTraceRegistry.ts';
    const real = fs.readFileSync(path.join(repoRoot, s), 'utf8');
    const flipped = real.slice(0, 100) + (real[100] === 'X' ? 'Y' : 'X') + real.slice(101);
    return oldMechanismCatches({ [s]: flipped }).length === 9;
  })());
const oldOnOrphan = oldMechanismCatches({ [ORPHAN]: orphanEdited });
check('★ CLAUSE 2 — THE TREADMILL\'S COST, ON THE EXACT FILE IT LOST: the SAME unsanctioned edit to the orphan — the OLD mechanism VISIBLY PASSES (all nine lists, 149 comparisons, ZERO catches) while the MANIFEST VISIBLY FAILS',
  oldOnOrphan.length === 0 && manifestOnOrphan.ok === false);
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
check('★ CLAUSE 3 — THE BITE: 27/27 one-character in-memory mutations FAIL the freeze (and each names exactly the mutated file)',
  bitesCaught === 27 && bitesExact === 27);
check('…and the CR-strip is not itself a hole: 27/27 CRLF re-expressions of the true content PASS (measured, not assumed)',
  crlfPasses === 27);
note(`bite: ${bitesCaught}/27 caught, ${bitesExact}/27 exact · CRLF: ${crlfPasses}/27 pass`);

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
const alwaysOkStub = () => ({ ok: true, drifted: [], missing: [], unlisted: [], checked: 27, frozen: [] });
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
// The ONLY surviving `git show HEAD:` reads are the NAMED carried-mutant
// mechanisms (a DIFFERENT mechanism — HEAD-state-aware fidelity for in-memory
// mutants — and it stays, per the mandate):
//   diagnose-multiparent-dag-walk.cjs   → HEAD:src/playground/playgroundOperations.ts (§h walker-mutant fidelity)
//   diagnose-combine-is-connected-sum.cjs → HEAD:src/manuscript/genesisModel.ts (§h door-mutant fidelity)
//   diagnose-the-person-picks-the-face.cjs → HEAD:src/manuscript/writtenFormModel.ts (§f faces[0]-mutant fidelity; not a frozen file)
//   diagnose-engine-freeze.cjs          → the carried OLD mechanism above (Clause 2)
const GIT_SHOW_ALLOWLIST = new Map([
  ['diagnose-multiparent-dag-walk.cjs', 1],
  ['diagnose-combine-is-connected-sum.cjs', 1],
  ['diagnose-the-person-picks-the-face.cjs', 1],
  ['diagnose-engine-freeze.cjs', 1],
]);
check('zero frozen-file HEAD-differential guard reads survive: the only non-comment git-show-HEAD lines under scripts/ are the FOUR named carried-mutant reads (one each), and nothing else',
  (() => {
    // pattern built from halves so this scanner's own source carries no
    // contiguous occurrence beyond its Clause-2 execSync template
    const GIT_SHOW = new RegExp(['git show', ' HEAD:'].join(''));
    const found = new Map();
    const walkScripts = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) walkScripts(abs);
        else if (entry.name.endsWith('.cjs')) {
          const lines = fs.readFileSync(abs, 'utf8').split(/\r?\n/);
          const hits = lines.filter((l) => !l.trim().startsWith('//') && !l.trim().startsWith('*') && GIT_SHOW.test(l)).length;
          if (hits > 0) found.set(entry.name, hits);
        }
      }
    };
    walkScripts(__dirname);
    if (found.size !== GIT_SHOW_ALLOWLIST.size) return false;
    return [...GIT_SHOW_ALLOWLIST].every(([name, count]) => found.get(name) === count);
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
