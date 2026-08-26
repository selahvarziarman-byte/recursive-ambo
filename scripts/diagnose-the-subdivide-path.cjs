#!/usr/bin/env node

// DIAGNOSTIC — THE SUBDIVIDE PATH (C.1's item zero; engineer-chartered
// 2026-07-16, SEAL-BEFORE-BUILD — BUILT BLIND to
// `.handoff/SEAL_THE_SUBDIVIDE_PATH.md`, SHA-256 78660720…1f73, natively
// measured; every pin below is the builder's own measurement at a930f28).
//
// THE DEADLOCK THIS CURES: two 1-face forms (two RP²s) — the combine gate
// PASSES (`combineGateFor` on the lone faces is legal) and the sum REFUSES
// (`connectedSum`'s single-face wall: "…has a single face — cutting its only
// face leaves no surface. Subdivide first…"). The engine names its own cure
// and the manuscript offered no subdivide: `refineToDisk` appeared ZERO times
// in ManuscriptView.tsx and genesisModel.ts. The cure is ONE useMemo —
// ManuscriptView's `combineGate` now refines a 1-face target through the
// committed rim op before the gate, so the person picks a port face on the
// refined form (`…:disk` / `…:rest`, never a default) and the birth receives
// the same shape the panel showed.
//
// WHAT THIS WITNESS PINS (the pure layer the view routes through — headless,
// `refineToDisk` and `birthChild` are pure):
//   [1] the deadlock, reproduced: lone-face gate legal:true AND the birth
//       refuses naming the cure ("has a single face" + "Subdivide first");
//   [2] post-refine: 2 faces, the `:disk` a 3-corner triangle beside `:rest`
//       (re-derived HERE — never imported from another witness's assertion);
//   [3] THE PAYOFF: birthChild on the two `:disk` ports → ok:true — the child
//       of RP²#RP². Its χ / w₁ / b₁ / cell census are PRINTED, not asserted
//       (the engineer has not derived them on this path; a printed number is
//       a measurement, an asserted one would be a laundered guess);
//   [4] the `:rest` port honestly refused: ok:false, the frozen wall's own
//       reason PRINTED verbatim (expected: the rim-length refusal).
//
// NON-MOVEMENT: this build touches NO frozen file — genesisModel.ts and
// connectedSum.ts are pinned byte-identical by the freeze flagship; the cure
// lives in NOT_FROZEN view code (ManuscriptView.tsx) only.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

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

const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { executeCustomGlue } = req('src/playground/customGluing.ts');
const { combineGateFor, birthChild } = req('src/manuscript/genesisModel.ts');
const { refineToDisk } = req('src/lib/surfaceRefinement.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the subdivide path: the engine tells the person to subdivide — the gate now performs it (blind concretes)\n');

// ═════ the fixtures — two RP²s born through the committed word op ═══════════
// (the antipodal square: edges 0↔2 and 1↔3, both reversing — distinct source
// namespaces, so the two forms stay distinct universes)
const REV = 'reversing';
const RP2_WORD = [
  { edgeA: 0, edgeB: 2, mode: REV },
  { edgeA: 1, edgeB: 3, mode: REV },
];
const bear = (ns) => {
  const poly = loadForm(nGon(4), ns);
  const born = executeCustomGlue(poly, poly.faces[0], RP2_WORD, null);
  return { poly, born };
};
const A = bear('sdpA');
const B = bear('sdpB');

// ───── [1] the deadlock, reproduced: the gate PASSES and the sum REFUSES ────
console.log('----- [1] the deadlock: lone-face gate legal, birth refuses naming the cure -----');
check('both RP²s carry exactly ONE face (the deadlock precondition)', A.born.faces.length === 1 && B.born.faces.length === 1);
const loneA = A.born.faces[0];
const loneB = B.born.faces[0];
const loneGate = combineGateFor(A.born, B.born, loneA, loneB);
check('combineGateFor(a, b, loneFaceA, loneFaceB).legal === true — the visible gate PASSES', loneGate.legal === true);
const dead = birthChild(A.born, B.born, 9101, loneA, loneB);
check('birthChild on the lone faces → ok:false — the sum REFUSES behind the passed gate', dead.ok === false);
check('…and the refusal names the disease ("has a single face") AND the cure ("Subdivide first")',
  dead.ok === false && dead.reason.includes('has a single face') && dead.reason.includes('Subdivide first'));
if (dead.ok === false) note(`the verdict, verbatim: ${dead.reason}`);

// ───── [2] post-refine: the committed rim op, re-derived here ────────────────
console.log('\n----- [2] post-refine: 2 faces — the 3-corner :disk beside the :rest -----');
const refA = refineToDisk(A.born, A.poly);
const refB = refineToDisk(B.born, B.poly);
const suffixCensus = (shape) => ({
  disk: shape.faces.filter((f) => f.id.endsWith(':disk')),
  rest: shape.faces.filter((f) => f.id.endsWith(':rest')),
});
const cenA = suffixCensus(refA.shape);
const cenB = suffixCensus(refB.shape);
check('refined A has exactly 2 faces · one id ends `:disk`, one ends `:rest`',
  refA.shape.faces.length === 2 && cenA.disk.length === 1 && cenA.rest.length === 1);
check('refined B has exactly 2 faces · one id ends `:disk`, one ends `:rest`',
  refB.shape.faces.length === 2 && cenB.disk.length === 1 && cenB.rest.length === 1);
const diskA = cenA.disk[0];
const restA = cenA.rest[0];
const diskB = cenB.disk[0];
check('the `:disk` is a TRIANGLE — vertexIds.length === 3 (the panel line the person reads: "…:disk · 3 corners")',
  diskA.vertexIds.length === 3 && diskB.vertexIds.length === 3);
note(`A refined: ${refA.shape.faces.map((f) => `${f.id.split(':').pop()}·${f.vertexIds.length} corners`).join(' | ')} (passes: ${refA.refinement.passes})`);
note(`B refined: ${refB.shape.faces.map((f) => `${f.id.split(':').pop()}·${f.vertexIds.length} corners`).join(' | ')} (passes: ${refB.refinement.passes})`);

// ───── [3] ★ THE PAYOFF: the disk ports combine — RP² # RP² is BORN ─────────
console.log('\n----- [3] ★ the payoff: birthChild on the two :disk ports → ok:true (invariants PRINTED, never asserted) -----');
const born = birthChild(refA.shape, refB.shape, 9102, diskA, diskB);
check('birthChild(refA, refB, seq, diskA, diskB) → ok:true — the person\'s combine LANDS', born.ok === true);
if (born.ok) {
  const inv = readFormInvariants(born.born.shape);
  note(`the child, MEASURED (printed, not asserted — the spec never held these numbers):`);
  note(`  χ = ${inv.chi} (certified: ${inv.chiCertified}) · classification: ${inv.classification}`);
  note(`  w₁ class: [${inv.cert ? inv.cert.w1Class.join(', ') : 'n-a'}] · nonOrientable: ${inv.cert ? inv.cert.nonOrientable : 'n-a'} · b₁ = ${inv.cert ? inv.cert.b1 : 'n-a'}`);
  note(`  cell census: ${JSON.stringify(inv.cells)}`);
  note(`  born title: "${born.born.title}"`);
}

// ───── [4] the :rest port honestly refused — the frozen wall speaks ─────────
console.log('\n----- [4] the :rest port: refused, the wall\'s own reason PRINTED -----');
const rest = birthChild(refA.shape, refB.shape, 9103, restA, diskB);
check('birthChild(refA, refB, seq, restA, diskB) → ok:false — the 7-corner :rest is not a legal port here', rest.ok === false);
if (rest.ok === false) note(`the refusal, verbatim (the frozen wall's, printed never asserted): ${rest.reason}`);

// ───── [5] B-106 B2 — the catch NAMES what it caught (R-5's kill) ────────────
// The view's `subdivided` helper wraps refineToDisk in a try/catch whose
// pass-through is CORRECT (the committed single-face wall still speaks
// downstream) — but the old bare `catch {` also ate surfaceRefinement's
// internal-consistency alarms wordless (the silent-chip class, third
// register). The cure: the catch captures the error and names it verbatim
// (console.warn with the caught error carried), so no alarm is eaten silent.
console.log('\n----- [5] B2: the combine gate\'s refine catch is NAMED, never bare -----');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
const helperStart = viewSrc.indexOf('const subdivided = (t:');
// the helper closes at its own 4-space indent — an inner `return { … };`
// line (8-space) must not truncate the block before the catch
const helperEnd = viewSrc.indexOf('\n    };', helperStart);
const helperBlock = helperStart >= 0 && helperEnd > helperStart ? viewSrc.slice(helperStart, helperEnd) : '';
check('the `subdivided` helper exists, catches BY NAME (`catch (error)`), speaks (`console.warn` carrying the message head "combine gate: refineToDisk refused" AND the caught error object), and its old bare `catch {` is gone',
  helperBlock.length > 0 &&
  helperBlock.includes('catch (error)') &&
  helperBlock.includes('console.warn(') &&
  helperBlock.includes('combine gate: refineToDisk refused') &&
  /console\.warn\([\s\S]{0,400}?error,\s*\)/.test(helperBlock) &&
  !/catch\s*\{/.test(helperBlock));

// ═════ verdict ═══════════════════════════════════════════════════════════════
console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`} — the subdivide path`);
process.exit(failures === 0 ? 0 : 1);
