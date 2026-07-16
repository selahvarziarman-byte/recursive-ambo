#!/usr/bin/env node

// DIAGNOSTIC — THE DOOR COLUMN (engineer-chartered 2026-07-17, THE COLUMN;
// re-cut 2026-07-18, THE APP COLUMN — mothership STEP 0: "one column, not one
// root"; SEAL-BEFORE-BUILD — BUILT BLIND to `.handoff/SEAL_THE_APP_COLUMN.md`,
// SHA-256 04096576…65ff, natively measured).
//
// THE MECHANISM: for every engine op, THE PERSON'S ROUTE — or none. Ported
// from the gitignored instruments/ drawer (THE COLUMN) and then taught the
// one distinction its first cut lacked (THE APP COLUMN): it called the DEV
// SHELL "the person" and PASSED the exact case it was built to catch (LAW 9 —
// the instrument must not carry the property it measures).
//
// THE PARTITION — by ROOT CLOSURE, never by regex (a `dev &&` regex would
// scan for a fact living in a different file from the edge it must cut:
// main.tsx STATICALLY imports the dev shell and gates it at the RENDER site):
//   PRODUCTION = closure('src/AppShell.tsx')      — Ambo ⇄ Manuscript. The
//                ManuscriptView MODULE is production (AppShell lazy-loads
//                it) though ?manuscript is also a dev route — the module is
//                production; the route is dev; it is never marked DEV.
//   DEV        = closure('src/main.tsx') MINUS PRODUCTION — excluded by
//                CONSTRUCTION (the playground shell and its store).
// Every op row reads exactly one of PRODUCTION · DEV-ONLY · NONE, and the
// two non-production diagnoses NEVER merge — they need different cures:
//   NONE     = unbuilt (no door anywhere);
//   DEV-ONLY = built for the wrong person (a door nobody ships) — NEVER ✅.
//
// GESTURE roots by app (GESTURE = the person acts on THEIR OWN form;
// CATALOGUE = the product is handed a CLASS NAME and builds a representative):
//   PRODUCTION gestures: manuscript/genesisModel.ts (birthChild — the
//     person's port-face combine since 2026-07-12; misfiled as CATALOGUE by
//     both seats until 2026-07-18, LAW 25) + manuscript/writtenFormModel.ts
//     (the dock) + store/geometryStore.ts (THE AMBO LIFT →
//     lib/subComplexLift — the person's second door).
//   DEV gestures: playground/playgroundOperations.ts + store/playgroundStore.ts.
//   CATALOGUE: manuscript/standardBodies.ts ONLY.
//
// Committed bytes only (the object DB) · canaries FATAL (a broken instrument
// prints nothing but the failure) · the bd99fb5 historical mutant SHARPENED:
// refineToDisk reads NONE before the gate, DEV-ONLY after it, ✅ at neither —
// the column distinguishes "unbuilt" from "built for the wrong person"
// across real history, which is the only reason it exists.
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

console.log('the door column: for every engine op — the person\'s route, or none; and WHICH person (blind concretes)\n');

// ── the column, rev-parameterized (committed bytes only) ──────────────────────
// the ONE plumbing blob read (pinned in the flagship's HEAD-read inventory)
const blobAt = (rev, file) => execSync(`git cat-file blob ${rev}:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
// the ONE tree listing (rev-anchored; names only — every verdict reads blobs)
const srcFilesAt = (rev) => execSync(`git ls-tree -r --name-only ${rev} -- src`, { cwd: repoRoot, encoding: 'utf8' })
  .split(/\r?\n/).filter((f) => /\.tsx?$/.test(f));

const OPS = {
  'connectedSum (add a handle/crosscap)': 'src/lib/connectedSum.ts',
  'refineToDisk (THE EXIT)': 'src/lib/surfaceRefinement.ts',
  'thicken (A.1 — the ×I product)': 'src/lib/thicken.ts',
  'subComplexLift (THE AMBO LIFT)': 'src/lib/subComplexLift.ts',
  'sewBoundaryCircles': 'src/lib/complexIdentification.ts',
  'cutCell': 'src/lib/cutOperation.ts',
  'assemble (multiform)': 'src/lib/multiform.ts',
  'surfaceDual': 'src/lib/surfaceDual.ts',
  'patchLift (route-B)': 'src/lib/patchLift.ts',
  'closeEdgeIntoCircle': 'src/lib/closeEdgeIntoCircle.ts',
  'faceIdentification': 'src/lib/faceIdentification.ts',
  'level3SoundnessGate': 'src/lib/level3SoundnessGate.ts',
};
const PRODUCTION_ROOTS = ['src/AppShell.tsx'];
const MAIN_ROOTS = ['src/main.tsx'];
const GESTURE_PROD_ROOTS = ['src/manuscript/genesisModel.ts', 'src/manuscript/writtenFormModel.ts', 'src/store/geometryStore.ts'];
const GESTURE_DEV_ROOTS = ['src/playground/playgroundOperations.ts', 'src/store/playgroundStore.ts'];
const CATALOGUE_ROOTS = ['src/manuscript/standardBodies.ts'];

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
  // ts.preProcessFile detects DYNAMIC imports too — AppShell's
  // React.lazy(() => import('./manuscript/ManuscriptView')) is a real edge
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
  const production = closure(PRODUCTION_ROOTS);
  const main = closure(MAIN_ROOTS);
  const dev = new Set([...main].filter((f) => !production.has(f))); // disjoint BY CONSTRUCTION
  const gestureProd = closure(GESTURE_PROD_ROOTS);
  const gestureDev = closure(GESTURE_DEV_ROOTS);
  const catalogue = closure(CATALOGUE_ROOTS);
  // THE CANARIES — FATAL. Files this column KNOWS are live must read where it
  // knows them to be, or the whole run is a broken instrument and says ONLY
  // that (no plausible column may be printed over a dead resolver).
  const canaries = [
    ['ManuscriptView is PRODUCTION (the MODULE ships; the ?manuscript route being dev never marks it DEV)', production.has('src/manuscript/ManuscriptView.tsx')],
    ['the Playground shell is NOT production (AppShell carries zero Playground refs)', !production.has('src/components/Playground.tsx')],
    ['the Playground shell IS the dev closure (main.tsx statically imports it; the dev&& gate is at the render site)', dev.has('src/components/Playground.tsx')],
    ['src/lib/connectedSum.ts reachable by CATALOGUE (standardBodies sums bodies)', catalogue.has('src/lib/connectedSum.ts')],
    ['src/lib/multiform.ts reachable by BOTH gesture registers (assemble is a committed gesture everywhere)', gestureProd.has('src/lib/multiform.ts') && gestureDev.has('src/lib/multiform.ts')],
    ['the PRODUCTION closure is non-trivial (> 20 files)', production.size > 20],
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
    const gp = gestureProd.has(f);
    const gd = gestureDev.has(f);
    const cat = catalogue.has(f);
    const app = production.has(f) ? 'PRODUCTION' : dev.has(f) ? 'DEV-ONLY' : 'NONE';
    const route =
      app === 'PRODUCTION' && gp
        ? '✅ PRODUCTION — the person acts (the manuscript\'s own doors)'
        : app === 'PRODUCTION' && cat
          ? '⚠ CATALOGUE ONLY — the product builds a named class; NOT a gesture'
          : app === 'PRODUCTION'
            ? '⚠ in the PRODUCTION app but via neither door'
            : app === 'DEV-ONLY'
              ? '⚠ DEV-ONLY — built for the wrong person: a door nobody ships (never the green tick)'
              : '⛔ NONE — unbuilt (no door anywhere)';
    rows[name] = { present: true, gestureProd: gp, gestureDev: gd, catalogue: cat, app, route };
  }
  const importersOf = (target) => Object.keys(src).filter((f) => f !== target && importsOf(f).includes(target));
  const grepCount = (dirPrefix, token) => files.filter((f) => f.startsWith(dirPrefix) && src[f].includes(token)).length;
  return { rev, files, src, rows, importersOf, grepCount, production, dev };
};

const mark = (b) => (b ? ' ✓' : ' —');
const printColumn = (col, annotations = {}) => {
  note(`── the door column @ ${col.rev} ──`);
  note('op                                    G-PROD  G-DEV  CATALOGUE  APP         route');
  for (const [name, row] of Object.entries(col.rows)) {
    if (!row.present) {
      note(`${name.padEnd(37)} FILE NOT AT ${col.rev}`);
      continue;
    }
    const extra = annotations[name] ?? '';
    note(`${name.padEnd(37)} ${mark(row.gestureProd).padEnd(7)} ${mark(row.gestureDev).padEnd(6)} ${mark(row.catalogue).padEnd(10)} ${row.app.padEnd(11)} ${row.route}${extra}`);
  }
};

// ═════ [a] tracked — the point of THE COLUMN ══════════════════════════════════════
console.log('----- [a] TRACKED: this witness rides the staging line -----');
check('★ THE MECHANISM HAS A HOME: scripts/diagnose-the-door-column.cjs is NOT gitignored (git check-ignore refuses it) — it rides every clone and every suite run',
  (() => {
    let ignored = true;
    try {
      execSync('git check-ignore scripts/diagnose-the-door-column.cjs', { cwd: repoRoot, encoding: 'utf8', stdio: 'pipe' });
      ignored = true;
    } catch {
      ignored = false;
    }
    note(`git check-ignore: ${ignored ? 'IGNORED?!' : 'not ignored'}`);
    return !ignored;
  })());

// ═════ [b] ★★ the column at HEAD — one column, which person ═══════════════════════
console.log('\n----- [b] ★★ THE COLUMN AT HEAD: PRODUCTION · DEV-ONLY · NONE — never merged, never ✅ for the dev shell (clauses 1–5) -----');
let headCol = null;
check('★★ THE COLUMN STOPS CALLING THE DEV SHELL "THE PERSON": refineToDisk reads DEV-ONLY — NOT ✅ (yesterday it printed "the person acts"; that was LAW 9, the instrument carrying the property it measures — THE GATE is the dev-register PROTOTYPE, and there is only one real person) · connectedSum reads ✅ PRODUCTION (genesisModel:birthChild — the person\'s port-face combine, a GESTURE root since 2026-07-12, misfiled as catalogue until now) AND its row carries RAW, NO REFINE (zero src/manuscript files name refineToDisk — the production door does not refine; C.1\'s item zero, stated by the instrument) · subComplexLift (THE AMBO LIFT) reads ✅ PRODUCTION — the person\'s second door, which the column had never seen · sew/cut/assemble/dual read ✅ PRODUCTION (the manuscript dock drives the registry) · patchLift + closeEdgeIntoCircle read ⛔ NONE — unchanged, CORRECT, printed, never widened away · and the PARTITION SUMS: every row exactly one of PRODUCTION/DEV-ONLY/NONE, PRODUCTION ∩ DEV = ∅ by construction and measured',
  (() => {
    headCol = columnAt('HEAD');
    const rawNoRefine = headCol.grepCount('src/manuscript/', 'refineToDisk') === 0;
    printColumn(headCol, {
      'connectedSum (add a handle/crosscap)': rawNoRefine ? '  ← RAW, NO REFINE (no manuscript file names refineToDisk)' : '  ← REFINED?!',
    });
    const r = headCol.rows;
    const overlap = [...headCol.production].filter((f) => headCol.dev.has(f)).length;
    const partitionOk = Object.values(r).every((row) => !row.present || ['PRODUCTION', 'DEV-ONLY', 'NONE'].includes(row.app));
    note(`PRODUCTION ∩ DEV = ${overlap} (by construction) · manuscript files naming refineToDisk: ${headCol.grepCount('src/manuscript/', 'refineToDisk')}`);
    // THICKEN (2026-07-18): the ×I product must read PRODUCTION — the lift is
    // its route (geometryStore, a production gesture root, imports it); if it
    // reads DEV-ONLY or NONE the person's route is not wired and THICKEN's
    // seal has failed its own §2. Absent at older revs (the historical leg
    // skips rows whose file is not at the rev).
    const thickenRow = r['thicken (A.1 — the ×I product)'];
    return (!thickenRow.present || (thickenRow.app === 'PRODUCTION' && thickenRow.gestureProd === true)) &&
      r['refineToDisk (THE EXIT)'].app === 'DEV-ONLY' &&
      r['refineToDisk (THE EXIT)'].gestureDev === true && r['refineToDisk (THE EXIT)'].gestureProd === false &&
      !r['refineToDisk (THE EXIT)'].route.includes('✅') &&
      r['connectedSum (add a handle/crosscap)'].app === 'PRODUCTION' &&
      r['connectedSum (add a handle/crosscap)'].gestureProd === true && rawNoRefine &&
      r['subComplexLift (THE AMBO LIFT)'].app === 'PRODUCTION' && r['subComplexLift (THE AMBO LIFT)'].gestureProd === true &&
      ['sewBoundaryCircles', 'cutCell', 'assemble (multiform)', 'surfaceDual'].every(
        (op) => r[op].app === 'PRODUCTION' && r[op].gestureProd === true,
      ) &&
      ['patchLift (route-B)', 'closeEdgeIntoCircle'].every(
        (op) => r[op].app === 'NONE' && !r[op].gestureProd && !r[op].gestureDev && !r[op].catalogue && r[op].route.includes('⛔ NONE'),
      ) &&
      overlap === 0 && partitionOk;
  })());

// ═════ [c] ★★ the sharpened historical mutant ═════════════════════════════════════
console.log('\n----- [c] ★★ THE HISTORICAL MUTANT, SHARPENED: unbuilt → built-for-the-wrong-person, never ✅ (clause 6) -----');
check('★★ THE COLUMN TELLS "UNBUILT" FROM "BUILT FOR THE WRONG PERSON" ACROSS REAL HISTORY: at bd99fb5 (pre-gate) refineToDisk reads ⛔ NONE (the module existed, no app imported it) · at HEAD (post-gate) it reads ⚠ DEV-ONLY (the gate hung its door in the playground shell — the prototype) · at NEITHER rev does it read ✅. Beside it, the corrected history the misfiled root hid: connectedSum reads ✅ PRODUCTION even at bd99fb5 (genesisModel\'s birthChild predates the gate — the production combine existed all along, RAW; the first cut\'s "CATALOGUE ONLY at bd99fb5" was the misfile\'s artifact, LAW 25) · and the gate\'s own arrival stays measured: applyCombineToSelection in 2 src files at HEAD, 0 at bd99fb5',
  (() => {
    const oldCol = columnAt('bd99fb5');
    const oldRefine = oldCol.rows['refineToDisk (THE EXIT)'];
    const newRefine = headCol.rows['refineToDisk (THE EXIT)'];
    const oldSum = oldCol.rows['connectedSum (add a handle/crosscap)'];
    note(`refineToDisk @bd99fb5: APP=${oldRefine.app} · "${oldRefine.route}"`);
    note(`refineToDisk @HEAD   : APP=${newRefine.app} · "${newRefine.route}"`);
    note(`✅ at either rev? ${oldRefine.route.includes('✅') || newRefine.route.includes('✅') ? 'YES?!' : 'no — never'}`);
    note(`connectedSum @bd99fb5: APP=${oldSum.app} · gestureProd=${oldSum.gestureProd} (the production combine predates the gate — raw)`);
    const nowCount = headCol.files.filter((f) => headCol.src[f].includes('applyCombineToSelection')).length;
    const oldCount = oldCol.files.filter((f) => oldCol.src[f].includes('applyCombineToSelection')).length;
    note(`applyCombineToSelection: ${nowCount} src file(s) at HEAD · ${oldCount} at bd99fb5`);
    return oldRefine.app === 'NONE' && newRefine.app === 'DEV-ONLY' &&
      !oldRefine.route.includes('✅') && !newRefine.route.includes('✅') &&
      oldSum.app === 'PRODUCTION' && oldSum.gestureProd === true &&
      nowCount === 2 && oldCount === 0;
  })());

// ═════ [d] the gate's absence branch stays dead ═══════════════════════════════════
console.log('\n----- [d] THE GATE\'S ABSENCE BRANCH STAYS DEAD: an optional guard is not a guard -----');
check('THE ABSENCE BRANCH IS GONE: diagnose-the-gate.cjs carries no "ABSENT … nothing to run here" note — its door-column leg runs THIS TRACKED WITNESS, so on any clone the column either runs or the leg FAILS LOUD',
  (() => {
    const gateSrc = fs.readFileSync(path.join(repoRoot, 'scripts', 'diagnose-the-gate.cjs'), 'utf8');
    const absenceGone = !gateSrc.includes('nothing to run here') && !gateSrc.includes('ABSENT on this checkout');
    const retargeted = gateSrc.includes('diagnose-the-door-column.cjs');
    note(`absence note present=${!absenceGone} · gate leg targets the tracked column=${retargeted}`);
    return absenceGone && retargeted;
  })());

// ═════ [e] the freeze reads ok ════════════════════════════════════════════════════
console.log('\n----- [e] the freeze is green (zero frozen files, zero src files in this build) -----');
const freeze = checkEngineFreeze(repoRoot);
check('THE ENGINE FREEZE reads ok with zero drift, zero missing, zero unlisted, zero nulled — this build ships witnesses and governance records only',
  freeze.ok);

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
