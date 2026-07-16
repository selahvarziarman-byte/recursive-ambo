#!/usr/bin/env node

// DIAGNOSTIC — THE DOOR COLUMN (engineer-chartered 2026-07-17, completing the
// mothership's 0500 order; SEAL-BEFORE-BUILD — BUILT BLIND to
// `.handoff/SEAL_THE_COLUMN.md`, SHA-256 94f1a8c9…df4a, natively measured).
//
// THE MECHANISM GETS A HOME: this is the door-column instrument — the one
// probe that caught what four seals, two stops and a 145-witness suite
// structurally could not ("connectedSum was reachable and the person still
// could not use it") — PORTED from the gitignored `instruments/` directory
// (one disk, a session that ends, a mount that serves it torn) into a
// TRACKED witness that rides every clone and every suite run.
//
// THE QUESTION, at every arc boundary, for every engine op:
//   GESTURE   = reachable from the person's own gesture surfaces (the unary
//               registry menu + the store's binary actions — they act on
//               THEIR OWN form);
//   CATALOGUE = reachable only from standardBodies/genesisModel (the product
//               is handed a CLASS NAME and builds a representative);
//   NONE      = neither — a door nobody hung (ALIVE, RATIFIED, UNREACHED).
// "Reachable from the app" was never the question.
//
// It reads COMMITTED BYTES ONLY (the object DB via git plumbing, never the
// working tree) — which is also why it survives torn mounts. The CANARIES
// are FATAL: if a file this column KNOWS is live reads as unreachable, the
// run prints nothing but the failure — an instrument that cannot report
// itself broken is a rumour with a shell prompt.
//
// ★★ THE HISTORICAL MUTANT IS FREE: the same column pointed at bd99fb5 (the
// commit BEFORE the gate) must read connectedSum as ⚠ CATALOGUE ONLY — the
// column goes visibly RED on the world where the door is missing. A column
// that cannot go red is a decoration.
//
// Anti-mock: the sources it parses are the committed blobs themselves.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const ts = require('typescript');

const repoRoot = path.resolve(__dirname, '..');
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the door column: for every engine op — the person\'s route, or none (blind concretes)\n');

// ── the column, rev-parameterized (committed bytes only) ──────────────────────
// the ONE plumbing blob read (pinned in the flagship's HEAD-read inventory)
const blobAt = (rev, file) => execSync(`git cat-file blob ${rev}:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
// the ONE tree listing (rev-anchored; names only — every verdict reads blobs)
const srcFilesAt = (rev) => execSync(`git ls-tree -r --name-only ${rev} -- src`, { cwd: repoRoot, encoding: 'utf8' })
  .split(/\r?\n/).filter((f) => /\.tsx?$/.test(f));

const OPS = {
  'connectedSum (add a handle/crosscap)': 'src/lib/connectedSum.ts',
  'refineToDisk (THE EXIT)': 'src/lib/surfaceRefinement.ts',
  'sewBoundaryCircles': 'src/lib/complexIdentification.ts',
  'cutCell': 'src/lib/cutOperation.ts',
  'assemble (multiform)': 'src/lib/multiform.ts',
  'surfaceDual': 'src/lib/surfaceDual.ts',
  'patchLift (route-B)': 'src/lib/patchLift.ts',
  'closeEdgeIntoCircle': 'src/lib/closeEdgeIntoCircle.ts',
  'faceIdentification': 'src/lib/faceIdentification.ts',
  'level3SoundnessGate': 'src/lib/level3SoundnessGate.ts',
};
// THE TWO DOORS — and they are NOT the same thing. The gesture surface is the
// unary OP MENU plus the STORE's own actions (the committed binary gestures —
// assemble, combine — are store actions by ratified shape; a census rooted
// only at the registry is blind to every arity-2 gesture by construction).
const GESTURE_ROOTS = ['src/playground/playgroundOperations.ts', 'src/store/playgroundStore.ts'];
const CATALOGUE_ROOTS = ['src/manuscript/standardBodies.ts', 'src/manuscript/genesisModel.ts'];
const APP_ROOTS = ['src/main.tsx'];

const columnAt = (rev) => {
  const files = srcFilesAt(rev);
  const src = {};
  for (const f of files) src[f] = blobAt(rev, f);
  const resolve = (from, spec) => {
    if (!spec.startsWith('.')) return null;
    const p = path.posix.normalize(path.posix.join(path.posix.dirname(from), spec));
    for (const c of [p, `${p}.ts`, `${p}.tsx`, `${p}/index.ts`, `${p}/index.tsx`]) {
      if (src[c] !== undefined) return c;
    }
    return null;
  };
  const importsOf = (f) => ts.preProcessFile(src[f], true, true).importedFiles.map((i) => resolve(f, i.fileName)).filter(Boolean);
  const closure = (entries) => {
    const seen = new Set();
    const stack = entries.filter((e) => src[e] !== undefined);
    while (stack.length) {
      const f = stack.pop();
      if (!f || seen.has(f) || src[f] === undefined) continue;
      seen.add(f);
      for (const d of importsOf(f)) stack.push(d);
    }
    return seen;
  };
  const gesture = closure(GESTURE_ROOTS);
  const catalogue = closure(CATALOGUE_ROOTS);
  const app = closure(APP_ROOTS);
  // THE CANARIES — FATAL. Files this column KNOWS are live must read as
  // reachable, or the whole run is a broken instrument and says ONLY that
  // (no plausible column may be printed over a dead resolver).
  const canaries = [
    ['src/lib/multiform.ts reachable by GESTURE (assemble is a committed gesture)', gesture.has('src/lib/multiform.ts')],
    ['src/lib/connectedSum.ts reachable by CATALOGUE (standardBodies sums bodies)', catalogue.has('src/lib/connectedSum.ts')],
    ['src/store/playgroundStore.ts inside APP (main → shell → panel → store)', app.has('src/store/playgroundStore.ts')],
    ['the GESTURE closure is non-trivial (> 5 files)', gesture.size > 5],
  ];
  const dead = canaries.filter(([, ok]) => !ok);
  if (dead.length > 0) {
    throw new Error(`DOOR-COLUMN CANARY DEAD at ${rev}: ${dead.map(([name]) => name).join(' · ')} — the instrument is broken; no column printed`);
  }
  const rows = {};
  for (const [name, f] of Object.entries(OPS)) {
    if (src[f] === undefined) {
      rows[name] = { present: false };
      continue;
    }
    const g = gesture.has(f);
    const c = catalogue.has(f);
    const a = app.has(f);
    const route = g
      ? 'PLAYGROUND_OPERATIONS / the store — the person acts'
      : c
        ? '⚠ CATALOGUE ONLY — the product builds a named class; NOT a gesture'
        : a
          ? '⚠ in APP but via neither door'
          : '⛔ NONE';
    rows[name] = { present: true, gesture: g, catalogue: c, app: a, route };
  }
  const importersOf = (target) => Object.keys(src).filter((f) => f !== target && importsOf(f).includes(target));
  return { rev, files, src, rows, importersOf };
};

const printColumn = (col) => {
  note(`── the door column @ ${col.rev} ──`);
  note('op                                     GESTURE  CATALOGUE  APP  route');
  for (const [name, row] of Object.entries(col.rows)) {
    if (!row.present) {
      note(`${name.padEnd(38)} FILE NOT AT ${col.rev}`);
      continue;
    }
    note(`${name.padEnd(38)} ${(row.gesture ? '  ✓' : '  —').padEnd(8)} ${(row.catalogue ? '  ✓' : '  —').padEnd(10)} ${(row.app ? '✓' : '—').padEnd(4)} ${row.route}`);
  }
};

// ═════ [a] tracked — the entire point of the build ════════════════════════════════
console.log('----- [a] TRACKED: this witness rides the staging line (clause 1) -----');
check('★ THE MECHANISM HAS A HOME: scripts/diagnose-the-door-column.cjs is NOT gitignored (git check-ignore refuses it) — it rides every clone and every suite run, unlike the instruments/ probe drawer it was ported from (gitignored by design, one disk, a session that ends)',
  (() => {
    let ignored = true;
    try {
      execSync('git check-ignore scripts/diagnose-the-door-column.cjs', { cwd: repoRoot, encoding: 'utf8', stdio: 'pipe' });
      ignored = true; // exit 0 = ignored
    } catch {
      ignored = false; // exit 1 = not ignored
    }
    note(`git check-ignore: ${ignored ? 'IGNORED?!' : 'not ignored'}`);
    return !ignored;
  })());

// ═════ [b] the column at HEAD, printed and pinned ═════════════════════════════════
console.log('\n----- [b] THE COLUMN AT HEAD: every op, the person\'s route or none (clause 3) -----');
let headCol = null;
check('★ THE COLUMN AT HEAD, PRINTED AND PINNED: connectedSum → GESTURE ✓ (the gate) · refineToDisk → GESTURE ✓ (reached through the gate\'s store path — no longer "NOBODY in src/") · sewBoundaryCircles / cutCell / assemble / surfaceDual → GESTURE ✓ · and patchLift + closeEdgeIntoCircle → ⛔ NONE, which is CORRECT AND PRINTED, never widened away: they are the researcher\'s "ALIVE, RATIFIED, UNREACHED" population — doors nobody hung, not rot. The ledger even knows the patch-lift birth (genealogyDag carries \'patch-lift\' in GLUE_KINDS) while NO src file imports the constructor: the column\'s job is to keep saying so at every arc boundary until someone hangs the door — exactly as it would have said about connectedSum for four seals, had it existed',
  (() => {
    headCol = columnAt('HEAD');
    printColumn(headCol);
    const r = headCol.rows;
    const patchLiftImporters = headCol.importersOf('src/lib/patchLift.ts');
    const ledgerKnows = (headCol.src['src/lib/genealogyDag.ts'] ?? '').includes('patch-lift');
    note(`patchLift importers in src/: ${patchLiftImporters.length === 0 ? '⛔ NOBODY' : patchLiftImporters.join(', ')} · genealogyDag names 'patch-lift': ${ledgerKnows} — the ledger knows a birth the person cannot perform`);
    const refineImporters = headCol.importersOf('src/lib/surfaceRefinement.ts');
    note(`refineToDisk importers in src/: ${refineImporters.join(', ') || 'NOBODY'}`);
    return r['connectedSum (add a handle/crosscap)'].gesture === true &&
      r['refineToDisk (THE EXIT)'].gesture === true &&
      r['sewBoundaryCircles'].gesture === true &&
      r['cutCell'].gesture === true &&
      r['assemble (multiform)'].gesture === true &&
      r['surfaceDual'].gesture === true &&
      r['patchLift (route-B)'].gesture === false && r['patchLift (route-B)'].catalogue === false &&
      r['patchLift (route-B)'].route === '⛔ NONE' &&
      r['closeEdgeIntoCircle'].gesture === false && r['closeEdgeIntoCircle'].catalogue === false &&
      r['closeEdgeIntoCircle'].route === '⛔ NONE' &&
      patchLiftImporters.length === 0 && ledgerKnows &&
      refineImporters.includes('src/store/playgroundStore.ts');
  })());

// ═════ [c] ★★ the historical mutant — the column goes red ═════════════════════════
console.log('\n----- [c] ★★ THE HISTORICAL MUTANT: the same column at bd99fb5, the world before the door (clause 2) -----');
check('★★ THE COLUMN CAN GO RED — pointed at bd99fb5 (HEAD~1, the commit BEFORE the gate) the SAME column reads connectedSum as ⚠ CATALOGUE ONLY (gesture —, catalogue ✓) and the GESTURE-✓ expectation VISIBLY FAILS on that world; measured beside it: `applyCombineToSelection` lives in 2 src files at cb507c4 and 0 at bd99fb5. The instrument proves itself against the world it was built to catch — a column that cannot go red is a decoration',
  (() => {
    const oldCol = columnAt('bd99fb5');
    const oldRow = oldCol.rows['connectedSum (add a handle/crosscap)'];
    note(`@bd99fb5: connectedSum → GESTURE=${oldRow.gesture ? '✓' : '—'} CATALOGUE=${oldRow.catalogue ? '✓' : '—'} · "${oldRow.route}"`);
    const headExpectationOnOldWorld = oldRow.gesture === true;
    note(`the GESTURE-✓ expectation applied to bd99fb5: ${headExpectationOnOldWorld ? 'PASS?!' : 'FAIL — red, exactly where the door is missing'}`);
    const countFilesWith = (col, token) => Object.values(col.src).filter((s) => s.includes(token)).length;
    const nowCount = countFilesWith(headCol, 'applyCombineToSelection');
    const oldCount = countFilesWith(oldCol, 'applyCombineToSelection');
    note(`applyCombineToSelection: ${nowCount} src file(s) at HEAD · ${oldCount} at bd99fb5`);
    const oldRefineImporters = oldCol.importersOf('src/lib/surfaceRefinement.ts');
    note(`refineToDisk importers @bd99fb5: ${oldRefineImporters.join(', ') || '⛔ NOBODY in src/'}`);
    return oldRow.gesture === false && oldRow.catalogue === true &&
      oldRow.route.includes('CATALOGUE ONLY') && !headExpectationOnOldWorld &&
      nowCount === 2 && oldCount === 0 && oldRefineImporters.length === 0;
  })());

// ═════ [d] the gate's absence branch is dead ══════════════════════════════════════
console.log('\n----- [d] THE GATE\'S ABSENCE BRANCH DIES: an optional guard is not a guard (clause 4) -----');
check('THE ABSENCE BRANCH IS GONE: diagnose-the-gate.cjs no longer carries the "ABSENT … nothing to run here" note — its door-column leg now runs THIS TRACKED WITNESS, so on any clone the column either runs or the leg FAILS LOUD (a check that stops checking while reporting green was the disease; the tracked home is the cure)',
  (() => {
    const gateSrc = fs.readFileSync(path.join(repoRoot, 'scripts', 'diagnose-the-gate.cjs'), 'utf8');
    const absenceGone = !gateSrc.includes('nothing to run here') && !gateSrc.includes('ABSENT on this checkout');
    const retargeted = gateSrc.includes('diagnose-the-door-column.cjs');
    note(`absence note present=${!absenceGone} · gate leg targets the tracked column=${retargeted}`);
    return absenceGone && retargeted;
  })());

// ═════ [e] the freeze reads ok ════════════════════════════════════════════════════
console.log('\n----- [e] the freeze is green (zero frozen files in this build) -----');
const freeze = checkEngineFreeze(repoRoot);
check('THE ENGINE FREEZE reads ok with zero drift, zero missing, zero unlisted, zero nulled — this build ships witnesses only (the column, the gate\'s retargeted leg, the flagship allowlist line)',
  freeze.ok);

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
