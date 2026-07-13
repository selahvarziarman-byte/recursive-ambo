#!/usr/bin/env node
// diagnose-the-small-run.cjs — THE SMALL RUN (engineer-sealed, SHA-256
// 2eb45568…9060 confirmed natively; built blind 2026-07-14 at baseline 5f3aecc).
//
// Four builds, one simple run:
//   §1 CLOSE THE FREEZE UNDER IMPORTS — a frozen file is only as frozen as its
//      dependencies. The manifest grew 27 → 44 (the objective criterion: a file
//      imported by a frozen file is frozen, transitively) and src/types joined
//      the completeness scan (the blind spot in the blind-spot check).
//   §2 NAME THE WALL BEFORE THE DOOR — on a form the single-face gate refuses
//      for EVERY face, the person was prompted to pick a face. A refusal must
//      name the reason that CANNOT be cured before the one that can. The order
//      moved in validateCustomPairings AND in the panel's own seam; no reason
//      string changed.
//   §3 GUARD EVERY HEAD-READ IDIOM — the flagship (diagnose-engine-freeze.cjs)
//      now pins committed-blob reads by EVERY spelling; asserted here by
//      running it and pinning its verdict lines.
//   §4 MAKE THE UNREADABLE FILE READABLE — faceIdentification.ts carried two
//      raw NUL bytes (the pairKey separator, LOAD-BEARING string content), so
//      greps treated the LEVEL-3 CORE as binary and silently skipped it: every
//      content audit of it was a false negative. The raw bytes are now spelled
//      as escapes (cooked values IDENTICAL — the mandate's own falsifier
//      forbids a semantic change, so plain deletion was never lawful), and the
//      freeze checker FAILS on any NUL in any frozen file, forever.
//
// Clause 2 mutants carried: (a) the pre-closure 27-path manifest; (b) the
// git-show-only inventory + the planted plumbing-spelled guard (inside the
// flagship, pinned here); (c) the pre-order refusal ladder; (d) the NUL-bearing
// file, reconstructed by exact inverse substitution.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execSync } = require('node:child_process');
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
const { checkEngineFreeze, sha256OfCrStripped, ROOTS } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));

// the ONE plumbing read (pinned by name in the flagship's HEAD-read inventory):
// §4 reconstruction fidelity · §2 old-order fidelity · §6 behaviour deltas
const headBlobOf = (file) => execSync(`git cat-file blob HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
// the ONE rev-anchored grep (pinned by name): the §4 grep-blindness exhibit
const gitGrepHead = (args) => {
  try {
    return { status: 0, stdout: execSync(`git grep ${args} HEAD -- src/lib/faceIdentification.ts`, { cwd: repoRoot, encoding: 'utf8' }) };
  } catch (error) {
    return { status: error.status ?? 1, stdout: (error.stdout ?? '').toString() };
  }
};

const NUL0 = String.fromCharCode(0);
const ESC = String.fromCharCode(92) + 'u0000'; // the six-character escape spelling

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the small run: the freeze closes under imports · the wall speaks before the door · every HEAD-read idiom is pinned · the unreadable file reads again\n');

// ═════ [a] §1 — THE FREEZE, CLOSED UNDER IMPORTS (battery 1) ══════════════════════
console.log('----- [a] §1 the closed freeze: ok at 44, src/types scanned, the closure re-measured -----');
const freeze = checkEngineFreeze();
check('★ CLAUSE 1 — EXECUTE WHAT YOU WITNESS: checkEngineFreeze() runs and reports ok with the ENLARGED set — checked 44 (> the pre-closure 27: THE COUNT GREW) · drifted [] · missing [] · unlisted [] (src/types now IN scope) · nulled []',
  freeze.ok === true && freeze.checked === 44 && freeze.checked > 27 &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 &&
  freeze.unlisted.length === 0 && freeze.nulled.length === 0 &&
  ROOTS.includes('src/types'));
note(`frozen count: 27 → ${freeze.checked} · completeness roots: ${ROOTS.join(' · ')}`);
const CLOSURE_ADDS = [
  'src/data/seeds.ts', 'src/lib/dualization.ts', 'src/lib/faceIdentification.ts',
  'src/lib/ids.ts', 'src/lib/level3Homology.ts', 'src/lib/level3Invariants.ts',
  'src/lib/level3LinkExtractor.ts', 'src/lib/level3Orientation.ts',
  'src/lib/level3SoundnessGate.ts', 'src/lib/level3W1.ts', 'src/lib/lineage.ts',
  'src/lib/packets.ts', 'src/lib/shape.ts', 'src/lib/surfaceDual.ts',
  'src/manuscript/writtenFormModel.ts', 'src/playground/primitiveCatalogue.ts',
  'src/types/geometry.ts',
];
check('the 17 closure adds are FROZEN by name — the engineer\'s five (types/geometry · ids · lineage · shape · writtenFormModel) plus the twelve the transitive closure reached (the level3 tower · faceIdentification · packets · dualization · surfaceDual · seeds · primitiveCatalogue)',
  CLOSURE_ADDS.length === 17 && CLOSURE_ADDS.every((f) => freeze.frozen.includes(f)));

// the §8 falsifier, EXECUTED (never assumed): re-measure the transitive import
// closure of the frozen set over the working tree — every project file any
// frozen file imports, transitively, must itself be frozen.
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map((l) => l.split('//')[0]).join('\n');
const importSpecsOf = (file) => {
  const src = stripComments(fs.readFileSync(path.join(repoRoot, file), 'utf8'));
  const specs = new Set();
  const re = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|import\s*['"]([^'"]+)['"]|require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  let m;
  while ((m = re.exec(src))) specs.add(m[1] ?? m[2] ?? m[3] ?? m[4]);
  return [...specs];
};
const resolveSpec = (fromFile, spec) => {
  if (!spec.startsWith('.') && !spec.startsWith('src/')) return null; // a package import
  const base = spec.startsWith('.')
    ? path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), spec))
    : spec;
  for (const cand of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]) {
    if (fs.existsSync(path.join(repoRoot, cand)) && fs.statSync(path.join(repoRoot, cand)).isFile()) return cand;
  }
  return `UNRESOLVED:${base}`;
};
check('★ the freeze is IMPORT-CLOSED, re-measured from the graph itself: a BFS over every frozen file\'s imports (relative + src-rooted, comment-stripped) reaches ONLY frozen files — zero unfrozen reachable, zero unresolved relative specs (the §8 falsifier: "any file imported by a frozen file remains unfrozen → HARD FAIL")',
  (() => {
    const frozenSet = new Set(freeze.frozen);
    const seen = new Set(freeze.frozen);
    const queue = [...freeze.frozen];
    const escaped = [];
    const unresolved = [];
    while (queue.length) {
      const f = queue.shift();
      for (const spec of importSpecsOf(f)) {
        const r = resolveSpec(f, spec);
        if (r === null) continue;
        if (r.startsWith('UNRESOLVED:')) { unresolved.push(`${f} -> ${r}`); continue; }
        if (!frozenSet.has(r)) escaped.push(`${f} -> ${r}`);
        if (!seen.has(r)) { seen.add(r); queue.push(r); }
      }
    }
    if (escaped.length) note(`ESCAPED the freeze: ${escaped.join(' · ')}`);
    if (unresolved.length) note(`unresolved: ${unresolved.join(' · ')}`);
    return escaped.length === 0 && unresolved.length === 0;
  })());

// ═════ [b] ★ CLAUSE 2(a) — the pre-closure manifest, carried, and its blindness ══
console.log('\n----- [b] the carried pre-closure manifest: 27 paths that could not see an edit to the types or the id-minting -----');
// verbatim the FROZEN paths of the manifest as it stood at 5f3aecc (literals —
// THE WITNESS OUTLIVES THE COMMIT; never read back from a git ref)
const PRE_CLOSURE_FROZEN = [
  'src/lib/complexIdentification.ts', 'src/lib/connectedSum.ts', 'src/lib/cutOperation.ts',
  'src/lib/genealogyDag.ts', 'src/lib/globalW1.ts', 'src/lib/incidenceTraceRegistry.ts',
  'src/lib/materializeOperation.ts', 'src/lib/multiform.ts', 'src/lib/surfaceImmersion.ts',
  'src/lib/surfaceOperations.ts', 'src/lib/transformationLedger.ts',
  'src/manuscript/InkedDomain.tsx', 'src/manuscript/InkedForm.tsx', 'src/manuscript/classBodyModel.ts',
  'src/manuscript/genesisModel.ts', 'src/manuscript/inkedFormModel.ts', 'src/manuscript/optionBModel.ts',
  'src/manuscript/specimenModel.ts', 'src/manuscript/standardBodies.ts', 'src/manuscript/surfaceClassifier.ts',
  'src/manuscript/worldModel.ts',
  'src/playground/bornFormRouting.ts', 'src/playground/customGluing.ts', 'src/playground/formInvariants.ts',
  'src/playground/genealogyLayout.ts', 'src/playground/playgroundOperations.ts', 'src/playground/snapshot.ts',
];
check('the carried list IS the pre-closure manifest: exactly 27 paths, every one still frozen today, DISJOINT from the 17 adds — and neither ids.ts nor types/geometry.ts is in it (the hole, named)',
  PRE_CLOSURE_FROZEN.length === 27 &&
  PRE_CLOSURE_FROZEN.every((f) => freeze.frozen.includes(f)) &&
  CLOSURE_ADDS.every((f) => !PRE_CLOSURE_FROZEN.includes(f)) &&
  !PRE_CLOSURE_FROZEN.includes('src/lib/ids.ts') && !PRE_CLOSURE_FROZEN.includes('src/types/geometry.ts'));
// the old mechanism, EXECUTED in shape: hash-compare each LISTED file (override
// or disk) against its pristine disk content — coverage is the mechanism.
const oldManifestCatches = (overrides) => {
  const caught = [];
  for (const file of PRE_CLOSURE_FROZEN) {
    const disk = fs.readFileSync(path.join(repoRoot, file), 'utf8');
    const content = Object.prototype.hasOwnProperty.call(overrides, file) ? overrides[file] : disk;
    if (sha256OfCrStripped(content) !== sha256OfCrStripped(disk)) caught.push(file);
  }
  return caught;
};
const flipChar = (src) => src.slice(0, 100) + (src[100] === 'X' ? 'Y' : 'X') + src.slice(101);
check('★ CLAUSE 2(a) — the pre-closure manifest VISIBLY MISSES an unsanctioned in-memory edit to ids.ts AND to types/geometry.ts (zero catches — id-minting and the core types could change and no guard fired) while the CLOSED manifest CATCHES each, naming exactly the file — and the carried mechanism is REAL: on a file its list DOES cover it catches',
  (() => {
    const results = [];
    for (const target of ['src/lib/ids.ts', 'src/types/geometry.ts']) {
      const edited = flipChar(fs.readFileSync(path.join(repoRoot, target), 'utf8'));
      const oldVerdict = oldManifestCatches({ [target]: edited });
      const closedVerdict = checkEngineFreeze({ overrides: { [target]: edited } });
      note(`${target}: pre-closure catches [${oldVerdict.join(', ') || 'NOTHING — the miss'}] · closed manifest drifted [${closedVerdict.drifted.join(', ')}]`);
      results.push(oldVerdict.length === 0 && closedVerdict.ok === false &&
        closedVerdict.drifted.length === 1 && closedVerdict.drifted[0] === target);
    }
    const covered = 'src/playground/customGluing.ts';
    const coveredEdit = flipChar(fs.readFileSync(path.join(repoRoot, covered), 'utf8'));
    const realCatch = oldManifestCatches({ [covered]: coveredEdit });
    results.push(realCatch.length === 1 && realCatch[0] === covered);
    return results.every(Boolean);
  })());

// ═════ [c] §2 — THE WALL BEFORE THE DOOR (battery 3) ══════════════════════════════
console.log('\n----- [c] §2 custom glue: the form-level refusal fires before any prompt a pick could satisfy -----');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { validateCustomPairings, previewCustomGlue, executeCustomGlue } = req('src/playground/customGluing.ts');
const { singleFaceGateReason } = req('src/playground/playgroundOperations.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');

const torus16 = immerseSurface({ surface: 'torus', resolution: 4 }).shape;
const wall = singleFaceGateReason(torus16);
const PROMPT = 'Select a face to glue.';
check('the fixture is the engineer\'s: the committed torus at resolution 4 is a 16-FACE form, and the single-face gate refuses it as a COMPLEX (the wall exists and is not the prompt)',
  torus16.faces.length === 16 && typeof wall === 'string' && wall.includes('COMPLEX (16 faces)') && wall !== PROMPT);
check('★ §2 LIVE — THE WALL BEFORE THE DOOR: with NO face picked, validateCustomPairings(null, [], torus16) names the FORM-level wall (verbatim the gate authority\'s reason), never the pick prompt — while the committed two-argument formless call (which cannot see the form) still speaks the prompt, exactly as before',
  validateCustomPairings(null, [], torus16) === wall &&
  validateCustomPairings(null, []) === PROMPT);
check('…and NO PICK CAN HELP: all 16 faces, each offered a syntactically perfect pairing, refuse with the SAME wall — the pick prompt was a false promise on this form (the mandate\'s measurement, reproduced)',
  torus16.faces.every((face) => validateCustomPairings(face, [{ edgeA: 0, edgeB: 2, mode: 'preserving' }], torus16) === wall));

// ★ CLAUSE 2(c) — the pre-order ladder, carried TOTAL and faithful: the old
// ladder differs from the fixed one at EXACTLY face === null (for a non-null
// face both ladders pass the face rung and meet the gate next), so the mutant
// is one honest line, not a strawman sketch.
const oldOrderValidate = (face, pairings, form, parentShape) =>
  (!face ? PROMPT : validateCustomPairings(face, pairings, form, parentShape));
// HEAD-compiled customGluing — the REAL mechanism at HEAD (its imports resolve
// to the working tree through the require hook; only this module's own ladder
// is at stake). HEAD-state-aware: pre-commit HEAD carries the OLD order and
// cross-validates the mutant while the window is open; post-commit HEAD IS the
// fixed order and the mutant rides as the permanent carried mechanism.
const headGluingSrc = headBlobOf('src/playground/customGluing.ts');
const headGluing = (() => {
  const M = require('node:module');
  const m = new M.Module('customGluing.head.ts');
  m.filename = path.join(repoRoot, 'src/playground/__head_customGluing.ts');
  m.paths = M.Module._nodeModulePaths(path.dirname(m.filename));
  m._compile(
    ts.transpileModule(headGluingSrc, { ...TRANSPILE_OPTIONS, fileName: m.filename }).outputText,
    m.filename,
  );
  return m.exports;
})();
const PROMPT_RUNG = "if (!face) return 'Select a face to glue.';";
const GATE_RUNG = 'if (form && form.faces.length !== 1) {';
const headLadderIsOld = headGluingSrc.indexOf(PROMPT_RUNG) < headGluingSrc.indexOf(GATE_RUNG);
check('★ CLAUSE 2(c) — the carried PRE-ORDER refusal VISIBLY emits the futile prompt where the fixed one names the wall — and the mutant is proven REAL against the mechanism itself: pre-commit the HEAD-compiled validator (the shipped old order) agrees with the mutant byte-for-byte on the exhibit; post-commit HEAD carries the fixed order and the working ladder is gate-first',
  (() => {
    const mutantSays = oldOrderValidate(null, [], torus16);
    const fixedSays = validateCustomPairings(null, [], torus16);
    const headSays = headGluing.validateCustomPairings(null, [], torus16);
    note(`no face picked on the 16-face torus — old order: "${mutantSays}" · fixed: "${fixedSays.slice(0, 62)}…" · HEAD (${headLadderIsOld ? 'pre-commit, OLD order' : 'post-commit, fixed'}): "${String(headSays).slice(0, 62)}${String(headSays).length > 62 ? '…' : ''}"`);
    const exhibit = mutantSays === PROMPT && fixedSays === wall;
    const workingSrc = fs.readFileSync(path.join(repoRoot, 'src/playground/customGluing.ts'), 'utf8');
    const workingIsFixed = workingSrc.indexOf(GATE_RUNG) >= 0 && workingSrc.indexOf(PROMPT_RUNG) >= 0 &&
      workingSrc.indexOf(GATE_RUNG) < workingSrc.indexOf(PROMPT_RUNG);
    const fidelity = headLadderIsOld ? headSays === mutantSays : headSays === fixedSays;
    return exhibit && workingIsFixed && fidelity;
  })());

// the panel's own seam — structural pins: the gate authority is consulted
// FIRST, before any synthesized prompt (the ternary is lawful)
const panelSrc = fs.readFileSync(path.join(repoRoot, 'src/components/PlaygroundOperationsPanel.tsx'), 'utf8');
check('the PANEL is lawful: it imports the gate authority (singleFaceGateReason), consults it into glueFormGateReason BEFORE the gluePreview ternary, makes the gate the ternary\'s FIRST arm, and the no-face display span names the wall (?? the pick prompt) instead of synthesizing the prompt unconditionally',
  /singleFaceGateReason,/.test(panelSrc) &&
  panelSrc.indexOf('const glueFormGateReason = singleFaceGateReason(shape);') >= 0 &&
  panelSrc.indexOf('const glueFormGateReason = singleFaceGateReason(shape);') < panelSrc.indexOf('const gluePreview =') &&
  /const gluePreview = glueFormGateReason\s*\n?\s*\? \{ ok: false as const, reason: glueFormGateReason \}/.test(panelSrc) &&
  panelSrc.includes("glueFormGateReason ?? 'Select a face (click it in the viewport) to build a pairing.'"));

// no reason STRING changed: the multiset of string literals in the working
// validator equals HEAD's (the reorder moved lines, never words). Pre-commit
// this compares across the real edit; post-commit it is the same content.
const literalsOf = (src) => {
  const stripped = stripComments(src);
  const found = [];
  const re = /(['"`])(?:\\.|(?!\1)[^\\\n])*\1/g;
  let m;
  while ((m = re.exec(stripped))) found.push(m[0]);
  return found.sort();
};
check('NO REASON STRING CHANGED (§7): the sorted multiset of string literals in working customGluing.ts is IDENTICAL to HEAD\'s — the order moved, not one word',
  JSON.stringify(literalsOf(fs.readFileSync(path.join(repoRoot, 'src/playground/customGluing.ts'), 'utf8'))) ===
  JSON.stringify(literalsOf(headGluingSrc)));

// the door still opens, and NOTHING ELSE moved: the refusal ladder agrees with
// the HEAD-compiled validator on a battery of states — pre-commit the delta is
// EXACTLY the exhibited state (form present, no face); post-commit zero delta.
const square = loadForm(nGon(4), 'smallrun');
const sqFace = square.faces[0];
const t16face = torus16.faces[0];
check('★ CLAUSE 3 — NON-MOVEMENT, enumerated: across eleven validator states (formless calls, per-pair degeneracies, the open door, the walled form) the working ladder and the HEAD-compiled ladder agree EVERYWHERE except — pre-commit only — the single exhibited state; and the door still OPENS: a lawful two-pair word on the 4-gon validates null, previews ok with identical certificates, and an invalid execute still THROWS in both',
  (() => {
    const STATES = [
      ['formful, no face (THE EXHIBIT)', null, [], torus16, null],
      ['formless, no face', null, [], undefined, null],
      ['formless, face, empty word', sqFace, [], undefined, null],
      ['formless, face, perfect pair', sqFace, [{ edgeA: 0, edgeB: 2, mode: 'preserving' }], undefined, null],
      ['formful walled, face, perfect pair', t16face, [{ edgeA: 0, edgeB: 2, mode: 'preserving' }], torus16, null],
      ['self-pair', sqFace, [{ edgeA: 1, edgeB: 1, mode: 'preserving' }], square, null],
      ['edge reused', sqFace, [{ edgeA: 0, edgeB: 2, mode: 'preserving' }, { edgeA: 0, edgeB: 3, mode: 'reversing' }], square, null],
      ['out of range', sqFace, [{ edgeA: 0, edgeB: 9, mode: 'preserving' }], square, null],
      ['bad mode', sqFace, [{ edgeA: 0, edgeB: 2, mode: 'sideways' }], square, null],
      ['empty word on the open form', sqFace, [], square, null],
      ['the open door (abab-style two pairs)', sqFace, [{ edgeA: 0, edgeB: 2, mode: 'preserving' }, { edgeA: 1, edgeB: 3, mode: 'preserving' }], square, null],
    ];
    const deltas = [];
    for (const [label, face, pairings, form, parent] of STATES) {
      const now = validateCustomPairings(face, pairings, form, parent);
      const head = headGluing.validateCustomPairings(face, pairings, form, parent);
      if (now !== head) deltas.push(label);
    }
    note(`states diverging from HEAD: [${deltas.join(' · ') || 'none'}] (${headLadderIsOld ? 'pre-commit: exactly the exhibit expected' : 'post-commit: none expected'})`);
    const deltaOk = headLadderIsOld
      ? deltas.length === 1 && deltas[0] === 'formful, no face (THE EXHIBIT)'
      : deltas.length === 0;
    const doorNow = validateCustomPairings(sqFace, STATES[10][2], square, null);
    const previewNow = previewCustomGlue(square, sqFace, STATES[10][2], null);
    const previewHead = headGluing.previewCustomGlue(square, sqFace, STATES[10][2], null);
    const throwsNow = (() => { try { executeCustomGlue(square, sqFace, [], null); return false; } catch { return true; } })();
    const throwsHead = (() => { try { headGluing.executeCustomGlue(square, sqFace, [], null); return false; } catch { return true; } })();
    return deltaOk && doorNow === null && previewNow.ok === true &&
      JSON.stringify(previewNow) === JSON.stringify(previewHead) && throwsNow && throwsHead;
  })());

// ═════ [d] §3 — THE FLAGSHIP PINS EVERY IDIOM (battery 4) ═════════════════════════
console.log('\n----- [d] §3 the flagship, executed: the full-idiom inventory + the planted-guard exhibit -----');
check('★ CLAUSE 1 — the flagship RUNS and passes: its inventory pins every HEAD-read idiom (the nine named reads, nothing else by any spelling), and its Clause 2(b) exhibit shows the carried git-show-only inventory PASSING the planted plumbing-spelled frozen-file guard that the full inventory FAILS by name',
  (() => {
    let out;
    try {
      out = execSync('node scripts/diagnose-engine-freeze.cjs', { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
    } catch (error) {
      note(`flagship exited nonzero: ${String((error.stdout ?? '').toString()).split('\n').filter((l) => l.startsWith('FAIL')).join(' | ')}`);
      return false;
    }
    return out.includes('ALL PASS') &&
      out.includes('PASS - ★ §3 — THE INVENTORY PINS EVERY HEAD-READ IDIOM') &&
      out.includes('PASS - ★ CLAUSE 2(b)') &&
      out.includes('misses the guard');
  })());

// ═════ [e] §4 — THE UNREADABLE FILE (battery 5) ═══════════════════════════════════
console.log('\n----- [e] §4 faceIdentification.ts: readable again, semantics untouched, the NUL law standing -----');
const FI = 'src/lib/faceIdentification.ts';
const fiWork = fs.readFileSync(path.join(repoRoot, FI), 'utf8');
const escapeCount = fiWork.split(ESC).length - 1;
check('the LEVEL-3 CORE is readable again: zero raw NUL bytes in the working file; the pairKey separator is spelled as the six-character escape at exactly its 2 sites; and a real content search finds `flipGlueFaces` (the working-tree grep: count ≥ 1, exit 0)',
  !fiWork.includes(NUL0) && escapeCount === 2 && fiWork.includes('flipGlueFaces') &&
  (() => {
    try {
      const out = execSync('git grep -I -c flipGlueFaces -- src/lib/faceIdentification.ts', { cwd: repoRoot, encoding: 'utf8' });
      return Number(out.split(':').pop()) >= 1;
    } catch { return false; }
  })());
// the carried NUL-bearing original: the EXACT INVERSE substitution (escape →
// raw byte at the 2 sites). Pre-commit this reconstruction is proven
// byte-identical to HEAD's blob — closing the strawman window while it is open.
const fiReconstructed = fiWork.split(ESC).join(NUL0);
const fiHead = headBlobOf(FI);
const headIsNulled = fiHead.includes(NUL0);
check('★ CLAUSE 2(d) — THE LIE, EXHIBITED ON THE REAL TOOL: the NUL-bearing file DEFEATS a grep for a string it DEMONSTRABLY contains — pre-commit, the committed blob (proven byte-identical to the carried reconstruction) makes the binary-skipping search return NOTHING (silent exit 1) for `flipGlueFaces` while the binary-tolerant count finds it 5 times; post-commit HEAD equals the readable working bytes and the reconstruction carries the mechanism',
  (() => {
    const recNulled = fiReconstructed.includes(NUL0) && fiReconstructed.includes('flipGlueFaces') &&
      fiReconstructed.split(NUL0).length - 1 === 2;
    if (headIsNulled) {
      const fidelity = fiReconstructed === fiHead;
      const blind = gitGrepHead('-I -c flipGlueFaces');
      const tolerant = gitGrepHead('-c flipGlueFaces');
      const tolerantCount = Number((tolerant.stdout.split(':').pop() ?? '').trim());
      note(`pre-commit window: reconstruction === HEAD blob: ${fidelity} · blind search: exit ${blind.status}, output ${JSON.stringify(blind.stdout.trim())} · tolerant count: ${tolerantCount}`);
      return recNulled && fidelity && blind.status !== 0 && blind.stdout.trim() === '' &&
        tolerant.status === 0 && tolerantCount >= 1;
    }
    note('post-commit: HEAD blob is the readable content; the reconstruction carries the NUL-bearing mechanism (its fidelity to the old blob was proven in the pre-commit window)');
    return recNulled && sha256OfCrStripped(fiHead) === sha256OfCrStripped(fiWork);
  })());
check('★ THE STANDING GUARD BITES: a raw NUL planted in-memory into the frozen faceIdentification.ts FAILS the freeze with nulled naming exactly that file — a FAIL, never a warning — and the clean tree reports nulled []',
  (() => {
    const planted = checkEngineFreeze({ overrides: { [FI]: fiWork + '// ' + NUL0 } });
    return planted.ok === false && planted.nulled.length === 1 && planted.nulled[0] === FI &&
      checkEngineFreeze().nulled.length === 0;
  })());
// ★ CLAUSE 3 — semantic identity, proven two ways:
//   (i) the AST: node-kind + cooked-literal sequence of the NUL-bearing
//       original and the escaped working file are IDENTICAL (the cooked value
//       of the template is the same NUL either way; only the SPELLING moved)
//   (ii) the runtime: both compiled side by side, the committed level-3 calls
//        return byte-identical JSON on the committed cube fixtures
const astSeq = (src) => {
  const sf = ts.createSourceFile('fi.ts', src, ts.ScriptTarget.ES2020, false, ts.ScriptKind.TS);
  const seq = [];
  const walk = (node) => {
    seq.push(ts.SyntaxKind[node.kind]);
    // cooked text of identifiers/literals/template parts — NOT the SourceFile
    // root, whose .text is the whole raw source (raw ≠ raw is the point)
    if (typeof node.text === 'string' && node.kind !== ts.SyntaxKind.SourceFile) seq.push(node.text);
    ts.forEachChild(node, walk);
  };
  walk(sf);
  return seq;
};
check('★ CLAUSE 3(i) — AST identity: the reconstruction (raw NULs) and the working file (escapes) parse to IDENTICAL node-kind + cooked-text sequences, while their raw bytes differ at exactly the 2 substitution sites (+10 bytes)',
  (() => {
    const a = astSeq(fiReconstructed);
    const b = astSeq(fiWork);
    const astEqual = a.length === b.length && a.every((x, i) => x === b[i]);
    note(`AST nodes+texts compared: ${a.length} · raw byte lengths: ${fiReconstructed.length} vs ${fiWork.length}`);
    return astEqual && fiWork.length === fiReconstructed.length + 10 && fiReconstructed !== fiWork;
  })());
const compileFi = (src, tag) => {
  const M = require('node:module');
  const m = new M.Module(`faceIdentification.${tag}.ts`);
  m.filename = path.join(repoRoot, `src/lib/__${tag}_faceIdentification.ts`);
  m.paths = M.Module._nodeModulePaths(path.dirname(m.filename));
  m._compile(ts.transpileModule(src, { ...TRANSPILE_OPTIONS, fileName: m.filename }).outputText, m.filename);
  return m.exports;
};
check('★ CLAUSE 3(ii) — runtime identity: the NUL-bearing original and the escaped working file, compiled side by side, return BYTE-IDENTICAL JSON for readSeedCell(cube), glueFaces(cube, the T³ pattern) and flipGlueFaces on the same word — the pair keys the separator mints are the same keys',
  (() => {
    const OLD = compileFi(fiReconstructed, 'old');
    const NEW = compileFi(fiWork, 'new');
    const { createSeedShape } = req('src/data/seeds.ts');
    const cubeShape = createSeedShape('cube');
    const positionOf = new Map(Object.values(cubeShape.vertices).map((v) => [v.id, v.position]));
    const run = (mod) => {
      const cube = mod.readSeedCell(cubeShape);
      const face = (key) => cube.faces.find((f) => f.id === `face:cube:${key}`);
      const translationMap = (faceA, faceB, axis) => {
        const map = {};
        const targets = faceB.cycle.map((id) => ({ id, p: positionOf.get(id) }));
        for (const u of faceA.cycle) {
          const p = positionOf.get(u);
          const want = [0, 1, 2].map((i) => (i === axis ? p[i] + 2 : p[i]));
          const hit = targets.find((t) => t.p[0] === want[0] && t.p[1] === want[1] && t.p[2] === want[2]);
          if (!hit) throw new Error(`no translation image for ${u}`);
          map[u] = hit.id;
        }
        return map;
      };
      const pattern = [
        { faceA: face('left').id, faceB: face('right').id, mode: 'preserving', map: translationMap(face('left'), face('right'), 0) },
        { faceA: face('front').id, faceB: face('back').id, mode: 'preserving', map: translationMap(face('front'), face('back'), 1) },
        { faceA: face('bottom').id, faceB: face('top').id, mode: 'preserving', map: translationMap(face('bottom'), face('top'), 2) },
      ];
      const attempt = (fn) => { try { return fn(); } catch (error) { return `THREW: ${error.message}`; } };
      return JSON.stringify({
        cell: cube,
        glued: attempt(() => mod.glueFaces(cube, pattern)),
        flipped: attempt(() => mod.flipGlueFaces(cube, pattern)),
      });
    };
    const a = run(OLD);
    const b = run(NEW);
    note(`payload bytes compared: ${a.length}`);
    return a === b && a.length > 1000;
  })());

// ═════ [f] battery 6 — nothing else moved ═════════════════════════════════════════
console.log('\n----- [f] non-movement: the authority and the tower byte-identical to HEAD; the freeze green -----');
check('the gate AUTHORITY and the LEVEL-3 TOWER did not move: playgroundOperations.ts and level3{SoundnessGate,Invariants,Orientation,W1,Homology,LinkExtractor}.ts are CR-insensitively identical to HEAD (the small run reordered a consumer and re-spelled two bytes — it touched no rule)',
  ['src/playground/playgroundOperations.ts', 'src/lib/level3SoundnessGate.ts', 'src/lib/level3Invariants.ts',
   'src/lib/level3Orientation.ts', 'src/lib/level3W1.ts', 'src/lib/level3Homology.ts', 'src/lib/level3LinkExtractor.ts']
    .every((f) => sha256OfCrStripped(fs.readFileSync(path.join(repoRoot, f), 'utf8')) === sha256OfCrStripped(headBlobOf(f))));

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
