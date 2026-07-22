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
//     lib/subComplexLift — the person's second door) +
//     manuscript/handGestureModel.ts (H2 THE PERSON'S HANDS: the FOLD — the
//     7th dock word over customGluing's committed seam — and the AIMED CHORD
//     — subdivideFace as the person's own reshape + the combine fork).
//   DEV gestures: playground/playgroundOperations.ts + store/playgroundStore.ts.
//   CATALOGUE: manuscript/standardBodies.ts ONLY.
//
// Committed bytes only (the object DB) · canaries FATAL (a broken instrument
// prints nothing but the failure) · the bd99fb5 historical mutant SHARPENED —
// and the column now tells FOUR states (THE REFINE IS NOT A GESTURE,
// 2026-07-17: the person invokes COMBINE, never REFINE — the refine is the
// door satisfying combine's precondition, plumbing not an act; consistent
// with the committed REFINE IS NOT A BIRTH, typeClaim 'resolution'):
//   NONE      @bd99fb5                     ⛔ unbuilt (no door anywhere)
//   DEV-ONLY                               ⚠ built for the WRONG PERSON — a door nobody ships
//   PRODUCTION, no gesture, no catalogue   ⚠ in the PRODUCTION app but via NEITHER DOOR  ← refineToDisk @8d5e344
//   PRODUCTION + gesture                   ✅ PRODUCTION — the person acts               ← connectedSum (unchanged)
// It separates "THE PERSON ACTS" (connectedSum) from "THE DOOR WORKS"
// (refineToDisk) across real history — which is the only reason it exists.
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
  // H2 ADDENDUM (engineer-required, reversing the H1 "no subdivideFace row"
  // call): the column keys by FILE, and H2 gave this file's subdivideFace a
  // person gesture while refineToDisk stayed combine-plumbing — a single
  // function-named label would now attribute "the person acts" to the WRONG
  // function on the one instrument built to tell them apart. The key names
  // BOTH functions with their true statuses; the attribution is FALSIFIABLE,
  // not decorative — [b] reads the gesture root's blob and asserts it imports
  // subdivideFace (and the manuscript refineToDisk-naming pin stays at 1).
  'subdivideFace (THE AIMED CHORD — gesture) · refineToDisk (THE EXIT) — plumbing': 'src/lib/surfaceRefinement.ts',
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
  // H1 (chartered rider): the general fold joins the column. (H1's companion
  // note — "subdivideFace gets no row of its own" — is REVERSED above by the
  // H2 addendum: the shared file-row now names both functions.)
  'customGluing (the general fold)': 'src/playground/customGluing.ts',
};
const PRODUCTION_ROOTS = ['src/AppShell.tsx'];
const MAIN_ROOTS = ['src/main.tsx'];
const GESTURE_PROD_ROOTS = ['src/manuscript/genesisModel.ts', 'src/manuscript/writtenFormModel.ts', 'src/store/geometryStore.ts', 'src/manuscript/handGestureModel.ts'];
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
check('★★ THE COLUMN SEPARATES "THE PERSON ACTS" FROM "THE DOOR WORKS" — RE-CUT AT H2 (THE PERSON\'S HANDS): the H1/H2 arc CLOSED the two walls this column existed to state. ★ customGluing (the general fold) reads ✅ PRODUCTION AS A GESTURE — the 7th dock word (the fold panel consumes the committed validate/preview/execute through handGestureModel, a production gesture root; DEV-ONLY was the 13th row\'s truth from H1 until this commit and the old pin died with it, loud) · ★ surfaceRefinement\'s row reads ✅ PRODUCTION AS A GESTURE too, and the ROW NAMES THE BEARER (the H2 addendum, reversing H1\'s no-subdivideFace-row call): the label attributes the gesture to subdivideFace (THE AIMED CHORD — the person\'s own reshape + the combine fork, via the same gesture root) and marks refineToDisk as the plumbing it remains, exactly as ruled 2026-07-17 (the person invokes COMBINE or aims the CHORD, never REFINE); the attribution is asserted mechanically — the gesture root\'s blob imports subdivideFace, and the naming pin below proves it never names the refine — and gestureDev stays TRUE, the playground prototype remains wired · the manuscript NAMES refineToDisk: exactly 1 file (ManuscriptView — grepCount counts FILES), naming it exactly 4 times (derived: the import, two doctrine comments, the call — item zero landed at 16341e2; H2 added ZERO namings by construction) · connectedSum reads ✅ PRODUCTION (genesisModel:birthChild — the person\'s port-face combine) AND its production door now REFINES FIRST (the view\'s gate satisfies the precondition before birthChild runs) · subComplexLift (THE AMBO LIFT) reads ✅ PRODUCTION · sew/cut/assemble/dual read ✅ PRODUCTION (the manuscript dock drives the registry) · patchLift + closeEdgeIntoCircle read ⛔ NONE — unchanged, CORRECT, printed, never widened away · and the PARTITION SUMS: every row exactly one of PRODUCTION/DEV-ONLY/NONE, PRODUCTION ∩ DEV = ∅ by construction and measured',
  (() => {
    headCol = columnAt('HEAD');
    const manuscriptFilesNamingRefine = headCol.grepCount('src/manuscript/', 'refineToDisk');
    const refineNamingsInView = (headCol.src['src/manuscript/ManuscriptView.tsx'].match(/refineToDisk/g) ?? []).length;
    printColumn(headCol, {
      'connectedSum (add a handle/crosscap)': manuscriptFilesNamingRefine === 1
        ? '  ← REFINES FIRST (the view\'s combine gate satisfies the precondition — plumbing, not a gesture)'
        : '  ← RAW?!',
    });
    const r = headCol.rows;
    const overlap = [...headCol.production].filter((f) => headCol.dev.has(f)).length;
    const partitionOk = Object.values(r).every((row) => !row.present || ['PRODUCTION', 'DEV-ONLY', 'NONE'].includes(row.app));
    note(`PRODUCTION ∩ DEV = ${overlap} (by construction) · manuscript files naming refineToDisk: ${manuscriptFilesNamingRefine} · namings inside ManuscriptView: ${refineNamingsInView}`);
    // THICKEN (2026-07-18): the ×I product must read PRODUCTION — the lift is
    // its route (geometryStore, a production gesture root, imports it); if it
    // reads DEV-ONLY or NONE the person's route is not wired and THICKEN's
    // seal has failed its own §2. Absent at older revs (the historical leg
    // skips rows whose file is not at the rev).
    const thickenRow = r['thicken (A.1 — the ×I product)'];
    const REFINE_ROW = 'subdivideFace (THE AIMED CHORD — gesture) · refineToDisk (THE EXIT) — plumbing';
    // H2 ADDENDUM — the label's attribution is a CLAIM, so it carries its
    // mechanical read: the gesture root imports subdivideFace (the chord),
    // and the standing manuscript pin (refineToDisk-naming files === 1,
    // ManuscriptView only) already proves the root never names the refine.
    const gestureRootBlob = headCol.src['src/manuscript/handGestureModel.ts'] ?? '';
    const chordBearsTheGesture = gestureRootBlob.includes('subdivideFace');
    note(`the gesture-bearer, read from the root: handGestureModel imports subdivideFace = ${chordBearsTheGesture} (the refine stays plumbing — the naming pin holds at 1)`);
    return (!thickenRow.present || (thickenRow.app === 'PRODUCTION' && thickenRow.gestureProd === true)) &&
      r[REFINE_ROW].app === 'PRODUCTION' &&
      // H2 re-cut: the FILE gained the person gesture (subdivideFace via the
      // handGestureModel root) — the row's gestureProd flipped TRUE and the
      // route reads the green tick; the old `gestureProd === false` pin was
      // FALSIFIED BY DESIGN at this commit (the falsified-pin flavor: loud).
      r[REFINE_ROW].gestureDev === true && r[REFINE_ROW].gestureProd === true &&
      r[REFINE_ROW].route === '✅ PRODUCTION — the person acts (the manuscript\'s own doors)' &&
      chordBearsTheGesture &&
      // H2: the general fold's row — the arc's own proof, pinned. DEV-ONLY
      // (H1's 13th row) died here; the fold is the person's 7th dock word.
      r['customGluing (the general fold)'].app === 'PRODUCTION' &&
      r['customGluing (the general fold)'].gestureProd === true &&
      r['customGluing (the general fold)'].route === '✅ PRODUCTION — the person acts (the manuscript\'s own doors)' &&
      r['connectedSum (add a handle/crosscap)'].app === 'PRODUCTION' &&
      r['connectedSum (add a handle/crosscap)'].gestureProd === true &&
      manuscriptFilesNamingRefine === 1 && refineNamingsInView === 4 &&
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
console.log('\n----- [c] ★★ THE HISTORICAL MUTANT, SHARPENED: unbuilt → built-for-the-wrong-person — TWO FIXED STAGES, no foot in the present (clause 6) -----');
check('★★ THE COLUMN TELLS "UNBUILT" FROM "BUILT FOR THE WRONG PERSON" ACROSS REAL HISTORY — BOTH REVS FIXED (A HISTORY LEG HAS NO FOOT IN THE PRESENT, 2026-07-17: a claim about the past that depends on the present is a category error): at bd99fb5 (pre-gate) refineToDisk reads ⛔ NONE (the module existed, no app imported it) · at cb507c4 (THE GATE — the commit that hung the door, verified an ancestor of HEAD) it reads ⚠ DEV-ONLY (in the playground shell — the prototype) · at NEITHER fixed rev does it read ✅ — the third stage, PRODUCTION via the view\'s combine gate, is the PRESENT and lives in [b], where a HEAD read belongs. Beside it, the corrected history the misfiled root hid: connectedSum reads ✅ PRODUCTION even at bd99fb5 (genesisModel\'s birthChild predates the gate — the production combine existed all along, RAW; the first cut\'s "CATALOGUE ONLY at bd99fb5" was the misfile\'s artifact, LAW 25) · and the gate\'s own arrival is FIXED HISTORY: applyCombineToSelection in 2 src files at cb507c4 (derived at the fixed rev, never at HEAD), 0 at bd99fb5',
  (() => {
    const oldCol = columnAt('bd99fb5');
    // A HISTORY LEG HAS NO FOOT IN THE PRESENT (2026-07-17): this leg asserts
    // HISTORY, and history is fixed — its second subject is cb507c4 (THE GATE,
    // an ancestor of HEAD), never any moving rev. The living third stage is
    // [b]'s to assert at the tip, forever; nothing here may move when it does.
    const gateCol = columnAt('cb507c4');
    const oldRefine = oldCol.rows['subdivideFace (THE AIMED CHORD — gesture) · refineToDisk (THE EXIT) — plumbing'];
    const gateRefine = gateCol.rows['subdivideFace (THE AIMED CHORD — gesture) · refineToDisk (THE EXIT) — plumbing'];
    const oldSum = oldCol.rows['connectedSum (add a handle/crosscap)'];
    note(`refineToDisk @bd99fb5: APP=${oldRefine.app} · "${oldRefine.route}"`);
    note(`refineToDisk @cb507c4 (the gate): APP=${gateRefine.app} · "${gateRefine.route}"`);
    note(`✅ at either fixed rev? ${oldRefine.route.includes('✅') || gateRefine.route.includes('✅') ? 'YES?!' : 'no — never'}`);
    note(`connectedSum @bd99fb5: APP=${oldSum.app} · gestureProd=${oldSum.gestureProd} (the production combine predates the gate — raw)`);
    const gateCount = gateCol.files.filter((f) => gateCol.src[f].includes('applyCombineToSelection')).length;
    const oldCount = oldCol.files.filter((f) => oldCol.src[f].includes('applyCombineToSelection')).length;
    note(`applyCombineToSelection: ${gateCount} src file(s) at cb507c4 (the gate) · ${oldCount} at bd99fb5`);
    return oldRefine.app === 'NONE' && gateRefine.app === 'DEV-ONLY' &&
      !oldRefine.route.includes('✅') && !gateRefine.route.includes('✅') &&
      oldSum.app === 'PRODUCTION' && oldSum.gestureProd === true &&
      gateCount === 2 && oldCount === 0;
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
