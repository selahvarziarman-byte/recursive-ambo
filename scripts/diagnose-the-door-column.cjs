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
// GESTURE attribution is PER-OP (engineer-mandated 2026-07-23; GESTURE = the
// person acts on THEIR OWN form; CATALOGUE = the product is handed a CLASS
// NAME and builds a representative):
//   gestureProd(op) := a NAMED person surface invokes THIS op — a WIRE, a
//     chain of (file, token) hops asserted on the rev's own blobs: a dock
//     word's chain (writtenFormModel lists the id → the registry invokes the
//     function), an affordance model's invocation (genesisModel's combine ·
//     handGestureModel's fold/chord · apertureModel's build ops), or a person
//     BUTTON driving a store's op-specific ACTION (Panels.tsx → geometryStore
//     → the op: the LIFT and THICKEN buttons, measured at :325/:352).
//   ⛔ NEVER import-closure: a store IMPORTING an op earns nothing (the old
//     per-file mechanism false-positived every op a gesture-bearing file
//     imports); a green tick means a wire, and every wire prints.
//   DEV gestures (unchanged, per-file closure — the dev shell's diagnosis):
//     playground/playgroundOperations.ts + store/playgroundStore.ts.
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
//   PRODUCTION, no wire, no catalogue      ⚠ PRODUCTION — built, no person door  (was "via neither door" ← refineToDisk @8d5e344)
//   PRODUCTION + a gesture WIRE            ✅ PRODUCTION — the person acts               ← connectedSum (unchanged)
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
const GESTURE_DEV_ROOTS = ['src/playground/playgroundOperations.ts', 'src/store/playgroundStore.ts'];
const CATALOGUE_ROOTS = ['src/manuscript/standardBodies.ts'];

// THE PER-OP GESTURE WIRES — one entry per OPS row that has a person door;
// each wire is a CHAIN of [file, token] hops, and the wire holds iff EVERY
// hop's blob (at the rev being read) contains its token. Ops absent here have
// NO person door and may never wear the green tick.
const GESTURE_WIRES = {
  'connectedSum (add a handle/crosscap)': [
    [['src/manuscript/genesisModel.ts', 'connectedSum(']], // birthChild — the port-face combine
  ],
  'subdivideFace (THE AIMED CHORD — gesture) · refineToDisk (THE EXIT) — plumbing': [
    [['src/manuscript/handGestureModel.ts', 'subdivideFace(']], // the aimed chord (H2)
  ],
  'thicken (A.1 — the ×I product)': [
    // the AMBO panel's own button drives the op-specific store action — the
    // person door the per-file mechanism could not NAME (and the no-door
    // premise could not see): Panels "Thicken … × I → Manuscript"
    [['src/components/Panels.tsx', 'thickenLiftToManuscript'], ['src/store/geometryStore.ts', 'thicken(']],
  ],
  'subComplexLift (THE AMBO LIFT)': [
    [['src/components/Panels.tsx', 'liftSelectionToManuscript'], ['src/store/geometryStore.ts', 'liftSubComplex(']], // R1 — the lift button
  ],
  'sewBoundaryCircles': [
    [['src/manuscript/writtenFormModel.ts', "'sew-boundary-preserving'"], ['src/playground/playgroundOperations.ts', 'sewBoundaryCircles(']],
  ],
  'cutCell': [
    [['src/manuscript/writtenFormModel.ts', "operationIds: ['cut']"], ['src/playground/playgroundOperations.ts', 'cutCell(']],
  ],
  'assemble (multiform)': [
    // the person's combine RUNS assemble through the committed macro — both
    // hops asserted: the surface invokes connectedSum; the macro invokes assemble
    [['src/manuscript/genesisModel.ts', 'connectedSum('], ['src/lib/connectedSum.ts', 'assemble(']],
  ],
  'surfaceDual': [
    [['src/manuscript/writtenFormModel.ts', "operationIds: ['dual']"], ['src/playground/playgroundOperations.ts', 'surfaceDual(']],
  ],
  'faceIdentification': [
    [['src/manuscript/apertureModel.ts', 'glueFaces(']], // the aperture's build ops
  ],
  'level3SoundnessGate': [
    [['src/manuscript/apertureModel.ts', 'readLevel3Tower('], ['src/lib/level3Invariants.ts', 'classifyLevel3Soundness(']],
  ],
  'customGluing (the general fold)': [
    [['src/manuscript/handGestureModel.ts', 'executeCustomGlue(']], // the fold panel (H2)
  ],
  'closeEdgeIntoCircle': [
    // P1 (DOORS, 2026-07-24): the FOLD word on a SEGMENT — the view's fold
    // toggle drives the op-specific store door, and the door mints the loop
    // through the op's own carrier (closeSegmentIntoLoop → closeEdgeIntoCircle)
    [['src/manuscript/ManuscriptView.tsx', 'closeSegmentManuscript'], ['src/store/geometryStore.ts', 'closeSegmentIntoLoop(']],
  ],
};
const wireProd = (name, src) =>
  (GESTURE_WIRES[name] ?? []).some((chain) =>
    chain.every(([file, token]) => src[file] !== undefined && src[file].includes(token)));

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
    ['src/lib/multiform.ts reachable by BOTH gesture registers (assemble: the person\'s combine-macro wire holds AND the dev closure reaches it)', wireProd('assemble (multiform)', src) && gestureDev.has('src/lib/multiform.ts')],
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
    const gp = wireProd(name, src); // PER-OP: a named person surface invokes THIS op, or no tick
    const gd = gestureDev.has(f);
    const cat = catalogue.has(f);
    const app = production.has(f) ? 'PRODUCTION' : dev.has(f) ? 'DEV-ONLY' : 'NONE';
    const route =
      app === 'PRODUCTION' && gp
        ? '✅ PRODUCTION — the person acts (the manuscript\'s own doors)'
        : app === 'PRODUCTION' && cat
          ? '⚠ CATALOGUE ONLY — the product builds a named class; NOT a gesture'
          : app === 'PRODUCTION'
            ? '⚠ PRODUCTION — built, no person door'
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
check('★★ THE COLUMN SEPARATES "THE PERSON ACTS" FROM "THE DOOR WORKS" — RE-CUT PER-OP (2026-07-23, engineer-mandated): a green tick is a WIRE — a NAMED person surface invoking THIS op (a dock word\'s id + the registry\'s call · an affordance model\'s own invocation · a person BUTTON driving an op-specific store action) — never a file\'s import closure, which false-positived every op a gesture-bearing file imports. The wires PRINT, per-op, and the BUILT-BUT-UNREACHABLE class is enumerated whole beneath the column. ★ THE MANDATE\'S EXPECTED THICKEN FLIP DID NOT SURVIVE THE MEASUREMENT: thicken\'s wire is REAL — the ambo panel\'s own "Thicken … × I → Manuscript" button (Panels.tsx) drives geometryStore.thickenLiftToManuscript → thicken(); the tick is earned per-op, the old mechanism was right by accident, and the no-door premise is corrected in the handback · the CONTROLS hold per-op: connectedSum (genesisModel\'s birthChild) · subdivideFace (handGestureModel\'s chord; refineToDisk stays plumbing exactly as ruled 2026-07-17, the row naming both) · customGluing (the fold panel) · sew/cut/dual (dock word + registry call) · assemble (the combine\'s committed macro runs it — both hops asserted) · subComplexLift (the R1 lift button) · faceIdentification + level3SoundnessGate (the aperture\'s build ops) · the manuscript NAMES refineToDisk: exactly 1 file, exactly 4 times (unchanged) · closeEdgeIntoCircle EARNED its tick (P1\'s fold-on-a-segment door — the wire asserted; the old ⛔ NONE pin died with the doorlessness it pinned, 2026-07-24) · patchLift reads ⛔ NONE — printed, never widened away (P4: not person-holdable input) · and the PARTITION SUMS: every row exactly one of PRODUCTION/DEV-ONLY/NONE, PRODUCTION ∩ DEV = ∅ by construction and measured',
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
    // THICKEN (2026-07-18; PER-OP 2026-07-23): the ×I product must read
    // PRODUCTION with the person's WIRE — the AMBO panel's thicken button
    // driving the op-specific store action (Panels.tsx → geometryStore →
    // thicken; measured). If it reads DEV-ONLY/NONE the person's route is not
    // wired and THICKEN's seal has failed its own §2. Absent at older revs
    // (the historical leg skips rows whose file is not at the rev).
    const thickenRow = r['thicken (A.1 — the ×I product)'];
    const REFINE_ROW = 'subdivideFace (THE AIMED CHORD — gesture) · refineToDisk (THE EXIT) — plumbing';
    // PER-OP (2026-07-23): every green tick above is a WIRE, and the wires
    // print — the built-but-unreachable class is the column's own enumeration.
    const wired = Object.keys(GESTURE_WIRES).filter((n) => r[n] && r[n].present && wireProd(n, headCol.src));
    note(`the wires verified per-op (${wired.length}): ${wired.map((n) => n.split(' ')[0]).join(' · ')}`);
    const unreachable = Object.entries(r).filter(([, row]) => row.present && !row.route.startsWith('✅'));
    note(`── THE BUILT-BUT-UNREACHABLE CLASS @ HEAD (${unreachable.length} row${unreachable.length === 1 ? '' : 's'}) ──`);
    for (const [n, row] of unreachable) note(`   ${n} — ${row.app} — ${row.route}`);
    // ⚠ THE MANDATE'S EXPECTED THICKEN FLIP DID NOT SURVIVE THE SUBSTRATE:
    // the person's door is the AMBO panel's own button ("Thicken … × I →
    // Manuscript", Panels.tsx) driving the op-specific store action — a NAMED
    // wire, so the tick is EARNED per-op (the old per-file mechanism was right
    // about thicken by accident; the premise "no person door" was wrong on
    // the measurement, reported in the handback).
    return (!thickenRow.present || (thickenRow.app === 'PRODUCTION' && thickenRow.gestureProd === true)) &&
      r[REFINE_ROW].app === 'PRODUCTION' &&
      // H2 re-cut: the FILE gained the person gesture (subdivideFace via the
      // handGestureModel root) — the row's gestureProd flipped TRUE and the
      // route reads the green tick; the old `gestureProd === false` pin was
      // FALSIFIED BY DESIGN at this commit (the falsified-pin flavor: loud).
      r[REFINE_ROW].gestureDev === true && r[REFINE_ROW].gestureProd === true &&
      r[REFINE_ROW].route === '✅ PRODUCTION — the person acts (the manuscript\'s own doors)' &&
      // per-op: every control's wire must hold (the chord's old bespoke read
      // is subsumed — its wire is GESTURE_WIRES' subdivideFace chain)
      Object.keys(GESTURE_WIRES).every((n) => !r[n] || !r[n].present || wireProd(n, headCol.src) === r[n].gestureProd) &&
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
      ['patchLift (route-B)'].every(
        (op) => r[op].app === 'NONE' && !r[op].gestureProd && !r[op].gestureDev && !r[op].catalogue && r[op].route.includes('⛔ NONE'),
      ) &&
      // P1-USABLE RULED RECUT (2026-07-24): closeEdgeIntoCircle EARNED its
      // person door — the FOLD word on a SEGMENT (view fold-toggle →
      // closeSegmentManuscript → closeSegmentIntoLoop, the wire above). The
      // old ⛔ NONE pin died with the doorlessness it pinned; patchLift STAYS
      // NONE (P4: its input — an X_K midpoint's star — is not person-holdable).
      r['closeEdgeIntoCircle'].app === 'PRODUCTION' &&
      r['closeEdgeIntoCircle'].gestureProd === true &&
      r['closeEdgeIntoCircle'].route === '✅ PRODUCTION — the person acts (the manuscript\'s own doors)' &&
      // CUT 1b RULED RECUT (2026-07-28): THE LAID BODY has a PRODUCTION wire —
      // the manuscript view (a PRODUCTION module, canary above) lays a born
      // form's OWN cells through the new laidBodyModel, which consumes the
      // FROZEN classifier and the FROZEN canonical bodies BY IMPORT. The same
      // [file, token] hop idiom as GESTURE_WIRES, on the rev's own blobs:
      // render doors are wires too — built-but-unwired would be the old lie.
      [
        ['src/manuscript/ManuscriptView.tsx', 'tryLaidBodyModel('],
        ['src/manuscript/ManuscriptView.tsx', 'markRimRefinedForSew('],
        ['src/manuscript/laidBodyModel.ts', 'export function tryLaidBodyModel'],
        ['src/manuscript/laidBodyModel.ts', 'export function cutComplexToDisk'],
        ['src/manuscript/laidBodyModel.ts', "from './surfaceClassifier'"],
        ['src/manuscript/laidBodyModel.ts', "from '../lib/surfaceImmersion'"],
      ].every(([file, token]) => headCol.src[file] !== undefined && headCol.src[file].includes(token)) &&
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
