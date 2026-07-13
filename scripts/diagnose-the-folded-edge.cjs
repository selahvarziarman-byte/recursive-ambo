#!/usr/bin/env node

// DIAGNOSTIC — THE FOLDED EDGE (engineer-chartered 2026-07-14 on ADR 0022,
// researcher-ruled, mothership-ratified; SEAL-BEFORE-BUILD — BUILT BLIND to
// `.handoff/SEAL_THE_FOLDED_EDGE.md`, SHA-256 82e98032…5b6e, verified raw;
// every pin below is the builder's own measurement).
//
// THE DEFECT THIS KILLS: `level3Orientation.edgeRelDir` THREW (`edge class
// FOLDED`) on 97 of 512 door-reachable pairings — the person picked a
// legitimate map from the face's own dihedral orbit and was handed a stack
// trace. A fold IS a fixed point ⇒ the action is NOT FREE ⇒ the quotient is
// an ORBIFOLD: a correct detection, in the wrong register. 19% of the door
// is the orbifold branch, and it now speaks as a VERDICT: the S² gate reads
// `kind: 'folded-edge'` BEFORE the orientation reader ever runs — THE ORDER
// IS THE FIX — and the wall carries its cure (SUBDIVIDE), asserting EXACTLY
// the non-freeness and NOTHING MORE (orbifold ⇏ non-manifold — the
// researcher's bound).
//
// THE FOUR CLAUSES, each proving its teeth:
//   1 EXECUTE WHAT YOU WITNESS — every folded case refused by the GATE
//     (failures[].kind === 'folded-edge'), never caught as a throw.
//   2 CARRY THE OLD MECHANISM IN-MEMORY — the pre-gate order (gate spoke,
//     nobody listened, orientation ran unconditionally) VISIBLY THROWS where
//     the gated engine refuses by name; byte-anchored to HEAD pre-commit.
//   3 ★ THE ORDER IS THE FIX — the gate-AFTER-orientation mutant still lets
//     the throw escape; only gate-first converts it. Kind without order = VOID.
//   4 ★ NON-MOVEMENT (highest bar) — all 415 non-folded pairings byte-identical
//     to HEAD: gate verdict and tower JSON, per pairing; sealed counts stand.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
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

const { createSeedShape } = req('src/data/seeds.ts');
const A = req('src/manuscript/apertureModel.ts');
const { readSeedCell, glueFaces, flipGlueFaces } = req('src/lib/faceIdentification.ts');
const { classifyLevel3Soundness } = req('src/lib/level3SoundnessGate.ts');
const { buildOrientedChainComplex } = req('src/lib/level3Orientation.ts');
const { level3InvariantTower, readLevel3Tower } = req('src/lib/level3Invariants.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the folded edge: a verdict, not a crash — 19% of the dim-3 door is the orbifold branch (blind concretes)\n');

const cube = createSeedShape('cube');
const f = (k) => `face:cube:${k}`;
const PAIRS = [
  ['left', 'right'],
  ['front', 'back'],
  ['bottom', 'top'],
];
const cands = PAIRS.map(([a, b]) => A.dihedralMapCandidates(cube, f(a), f(b)));
const WALL_TEMPLATE = (edgeClass) =>
  `This identification is not free: it folds edge class ${edgeClass} onto its own reverse, fixing its midpoint. ` +
  `The quotient is an orbifold — it carries a fold locus — not a free-quotient manifold. ` +
  `Its invariants cannot be read on this cell structure (a folded cell has no consistent orientation); ` +
  `subdivide to resolve the fold, and the gate will read it.`;

// ═════ [a] the 512 sweep: 97 refuse by name, zero throws escape the door ════════
console.log('----- [a] the door, all 512 pairings: 97 folded verdicts BY NAME · zero throws (clause 1 · battery 1) -----');
const sweep = [];
let doorThrows = 0;
for (const c0 of cands[0])
  for (const c1 of cands[1])
    for (const c2 of cands[2]) {
      const rows = PAIRS.map(([a, b], i) => ({ faceA: f(a), faceB: f(b), candidateKey: [c0, c1, c2][i].key }));
      try {
        const verdict = A.buildPersonDomainVerdict(cube, rows, 'sw', 'sweep');
        sweep.push({ keys: [c0.key, c1.key, c2.key], rows, verdict });
      } catch (error) {
        doorThrows += 1;
        sweep.push({ keys: [c0.key, c1.key, c2.key], rows, verdict: null, threw: String(error.message) });
      }
    }
const folded = sweep.filter((s) => s.verdict && s.verdict.folded);
const soundSide = sweep.filter((s) => s.verdict && !s.verdict.folded);
check('★ CLAUSE 1 — all 512 door pairings return a VERDICT: exactly 97 folded (the orbifold branch — 19% of the door) + 415 domains; ZERO throws escape the door',
  sweep.length === 512 && doorThrows === 0 && folded.length === 97 && soundSide.length === 415);
check('…and every folded case was refused BY THE GATE, not caught: each verdict\'s gate carries failures[0].kind === \'folded-edge\' (the verdict leads the failure list — the refusal-order law) with the fold\'s member edges recorded',
  folded.every((s) => {
    const first = s.verdict.gate.failures[0];
    return first && first.kind === 'folded-edge' && Array.isArray(first.memberEdgeIds) && first.memberEdgeIds.length > 0;
  }));
note(`folded: ${folded.length}/512 · domains: ${soundSide.length}/512 · door throws: ${doorThrows}`);

// ═════ [b] the wall: names the fold, says orbifold, offers the cure — and NOTHING more ═
console.log('\n----- [b] the wall carries its cure and asserts EXACTLY the non-freeness (battery 3 — the researcher\'s bound) -----');
check('every folded wall is the researcher-ruled text VERBATIM: names the edge class · "not free" · "orbifold" · "fold locus" · "subdivide to resolve the fold" — and says NOTHING about the underlying space\'s manifoldness (the phrase "not a free-quotient manifold" is the ruled wording; the substring "not a manifold" appears NOWHERE)',
  folded.every((s) => {
    const wall = s.verdict.wall;
    return (
      wall === WALL_TEMPLATE(s.verdict.foldedEdgeClasses[0]) &&
      wall.includes(s.verdict.foldedEdgeClasses[0]) &&
      wall.includes('not free') &&
      wall.includes('orbifold') &&
      wall.includes('fold locus') &&
      wall.includes('subdivide to resolve the fold') &&
      !wall.includes('not a manifold')
    );
  }));
note(`a wall, verbatim: "${folded[0].verdict.wall.slice(0, 150)}…"`);

// ═════ [c] CLAUSE 2 — the old order, carried, visibly throwing ═══════════════════
console.log('\n----- [c] ★ the carried pre-gate order: the gate spoke, nobody listened, orientation threw (clause 2) -----');
// THE CARRIED OLD MECHANISM (in-memory — the witness outlives the commit):
// the shipped tower ORDER, recomposed verbatim from the working exports —
// gate first but UNCONSULTED, orientation unconditional.
const oldOrderTower = (complex) => {
  const gate = classifyLevel3Soundness(complex); // the gate ran…
  const oriented = buildOrientedChainComplex(complex); // …but orientation ran UNCONDITIONALLY — the old order
  return { gate, oriented };
};
const foldedFixture = folded[0];
const complexOf = (rows) => {
  const pairings = rows.map((row, i) => {
    const candidate = A.dihedralMapCandidates(cube, row.faceA, row.faceB).find((c) => c.key === row.candidateKey);
    return { faceA: row.faceA, faceB: row.faceB, mode: candidate.derivedMode, map: candidate.map };
  });
  const seed = readSeedCell(cube);
  return pairings.some((p) => p.mode === 'reversing') ? flipGlueFaces(seed, pairings) : glueFaces(seed, pairings);
};
const foldedComplex = complexOf(foldedFixture.rows);
let oldThrew = null;
try {
  oldOrderTower(foldedComplex);
} catch (error) {
  oldThrew = String(error.message);
}
check('★ CLAUSE 2 — the carried old order VISIBLY THROWS (`edge class … FOLDED`) on the very pairing the gated engine refuses by name — the same complex, two registers: a stack trace then, a verdict now',
  oldThrew !== null && /FOLDED/.test(oldThrew) &&
  foldedFixture.verdict.folded === true && foldedFixture.verdict.gate.failures[0].kind === 'folded-edge');
note(`the old throw: "${oldThrew.slice(0, 110)}…"`);
// fidelity: the carried order IS the committed code — byte-anchored to HEAD
// while HEAD still carries it; the branch retires onto its own detection.
const headTowerSrc = execSync('git cat-file blob HEAD:src/lib/level3Invariants.ts', { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
if (!headTowerSrc.includes('readLevel3Tower')) {
  check('PRE-COMMIT FIDELITY: HEAD\'s committed tower carries the carried mutant\'s exact order — `classifyLevel3Soundness` immediately followed by an UNCONDITIONAL `buildOrientedChainComplex` (the two adjacent lines, byte-anchored) and no folded short-circuit',
    headTowerSrc.includes('  const gate = classifyLevel3Soundness(complex);\n  const oriented = buildOrientedChainComplex(complex);') &&
    !headTowerSrc.includes('folded-edge'));
  note('HEAD carries the old order — the fidelity byte-anchor ran LIVE (this branch retires with the commit; the mutant is then already proven)');
} else {
  check('POST-COMMIT: HEAD carries the gate-first verdict (readLevel3Tower + the folded short-circuit) — the carried mutant\'s fidelity was byte-anchored pre-commit while HEAD still had the old order, and its wrongness stays visible above (the throw)',
    headTowerSrc.includes('readLevel3Tower') && headTowerSrc.includes('folded-edge'));
  note('HEAD carries the verdict — the pre-commit fidelity branch has retired on its own detection, as designed');
}

// ═════ [d] CLAUSE 3 — the ORDER is the fix; kind without order is VOID ═══════════
console.log('\n----- [d] ★ the gate-AFTER mutant: the kind exists, the order is wrong, the throw still escapes (clause 3) -----');
// THE CARRIED WRONG ORDER: gate placed AFTER orientation — the working gate
// HAS the folded-edge kind, but the throw fires before it can speak.
const gateLastTower = (complex) => {
  const oriented = buildOrientedChainComplex(complex); // ← the throw escapes HERE…
  const gate = classifyLevel3Soundness(complex); // …and the gate (kind and all) never speaks
  return { oriented, gate };
};
let gateLastThrew = null;
try {
  gateLastTower(foldedComplex);
} catch (error) {
  gateLastThrew = String(error.message);
}
check('★ CLAUSE 3 — THE ORDER IS THE FIX, proven: with the gate placed AFTER orientation (carried in-memory, the WORKING gate with the folded-edge kind available), the throw STILL escapes — the kind alone converts nothing; only gate-first turns the crash into the verdict',
  gateLastThrew !== null && /FOLDED/.test(gateLastThrew) &&
  readLevel3Tower(foldedComplex).folded === true);
note('kind without order = VOID — measured, not asserted');

// ═════ [e] battery 5 — the orientation throw survives as a programmer-guard ═════
console.log('\n----- [e] the throws survive as programmer-guards — unreachable from the door (battery 5) -----');
const orientationSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/level3Orientation.ts'), 'utf8');
let directThrow = null;
try {
  buildOrientedChainComplex(foldedComplex);
} catch (error) {
  directThrow = String(error.message);
}
let towerGuardThrow = null;
try {
  level3InvariantTower(foldedComplex);
} catch (error) {
  towerGuardThrow = String(error.message);
}
check('level3Orientation\'s FOLDED throw is NOT deleted (source-asserted) and still fires on a direct bypass call — but the door never reaches it (the [a] sweep: zero throws); level3InvariantTower\'s old signature now guards gate-first with the verdict\'s name (the second programmer-guard, disclosed)',
  orientationSrc.includes('is FOLDED onto itself') &&
  directThrow !== null && /FOLDED/.test(directThrow) &&
  towerGuardThrow !== null && /folded-edge/.test(towerGuardThrow) && /readLevel3Tower/.test(towerGuardThrow));

// ═════ [f] battery 4 — the aperture draws nothing and says so ════════════════════
console.log('\n----- [f] the door surfaces the wall; nothing joins the world; the aperture draws nothing (battery 4) -----');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('the view consumes the VERDICT: a folded glue sets the notice to the WALL and returns before any domain is born (source-asserted: buildPersonDomainVerdict consumed · setApertureNotice(verdict.wall) · the early return precedes setBuiltDomains) — nothing joins the band, so the aperture draws nothing, and the wall says why',
  viewSrc.includes('buildPersonDomainVerdict(') &&
  viewSrc.includes('setApertureNotice(verdict.wall);') &&
  /if \(verdict\.folded\) \{[\s\S]{0,220}return;[\s\S]{0,80}\}/.test(viewSrc) &&
  viewSrc.indexOf('setApertureNotice(verdict.wall);') < viewSrc.indexOf('setBuiltDomains((cur) => [...cur, domain]);'));

// ═════ [g] CLAUSE 4 — non-movement: the 415 byte-identical to HEAD ═══════════════
console.log('\n----- [g] ★ non-movement: gate verdict + tower JSON per non-folded pairing, vs the HEAD-compiled engine (clause 4 · battery 2) -----');
const compileHead = (relPath, fakeName) => {
  const src = execSync(`git cat-file blob HEAD:${relPath}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
  const fake = path.join(repoRoot, 'src', 'lib', fakeName);
  const m = new Module(fake, module);
  m.filename = fake;
  m.paths = Module._nodeModulePaths(path.dirname(fake));
  m._compile(ts.transpileModule(src, { ...TRANSPILE_OPTIONS, fileName: fake }).outputText, fake);
  return m.exports;
};
const headGateModule = compileHead('src/lib/level3SoundnessGate.ts', 'level3SoundnessGate.__head__.ts');
const headTowerModule = compileHead('src/lib/level3Invariants.ts', 'level3Invariants.__head__.ts');
let towerMismatches = 0;
let gateMismatches = 0;
for (const s of soundSide) {
  const complex = complexOf(s.rows);
  const workGate = classifyLevel3Soundness(complex);
  const headGate = headGateModule.classifyLevel3Soundness(complex);
  if (JSON.stringify(workGate) !== JSON.stringify(headGate)) gateMismatches += 1;
  const workTower = s.verdict.domain.tower;
  const headTower = headTowerModule.level3InvariantTower(complex);
  if (JSON.stringify(workTower) !== JSON.stringify(headTower)) towerMismatches += 1;
}
check('★ CLAUSE 4 — NON-MOVEMENT, the highest bar: for ALL 415 non-folded pairings the gate report and the FULL tower (χ · w₁ · H₁ · matrices · gluing bits) are JSON-identical between the working engine and the HEAD-compiled engine — the 97 are the ONLY behaviour that moves',
  gateMismatches === 0 && towerMismatches === 0 && soundSide.length === 415);
note(`415 pairings × (gate + tower) compared vs HEAD-compiled: ${gateMismatches} gate mismatches · ${towerMismatches} tower mismatches`);
// the CANONICAL fixtures (the same rows every prior witness pinned — a
// different reflected space has its own honest counts; the seal's numbers
// belong to THESE decks)
const { buildThreeTorusDomain } = req('src/manuscript/worldModel.ts');
const t3Committed = buildThreeTorusDomain();
const rowFor = (a, b) => {
  const committed = t3Committed.complex.pairings.find((p) => p.faceA === f(a));
  const match = A.dihedralMapCandidates(cube, f(a), f(b)).find((c) =>
    Object.entries(committed.map).every(([x, y]) => c.map[x] === y));
  return { faceA: f(a), faceB: f(b), candidateKey: match.key };
};
const t3Rows = [rowFor('left', 'right'), rowFor('front', 'back'), rowFor('bottom', 'top')];
const lrReflected = A.dihedralMapCandidates(cube, f('left'), f('right')).filter((c) => c.derivedMode === 'reversing');
const t3Verdict = A.buildPersonDomainVerdict(cube, t3Rows, 'p-t3', 'T³');
const flipVerdict = A.buildPersonDomainVerdict(cube, [{ ...t3Rows[0], candidateKey: lrReflected[0].key }, t3Rows[1], t3Rows[2]], 'p-flip', 'FLIP');
const t3Gate = A.buildAperture(t3Verdict.domain);
const flipGate = A.buildAperture(flipVerdict.domain);
const scene = A.buildApertureScene(cube, null);
const traceT3 = A.traceAperture({ deck: t3Gate.deck, scene, width: 110, height: 110 });
const traceFlip = A.traceAperture({ deck: flipGate.deck, scene, width: 110, height: 110 });
check('…and the SEALED COUNTS stand through the verdict door: a door-built T³ → 0 reversed coils; a door-built reflected space (w₁=1, H₁=Z²⊕Z/2) → 8 coils visible, 2 LEFT-handed — the aperture\'s render inputs unmoved',
  traceT3.counts.coilCopiesMirrored === 0 &&
  traceFlip.counts.coilCopiesVisible === 8 && traceFlip.counts.coilCopiesMirrored === 2);
note(`T³ coils ${traceT3.counts.coilCopiesVisible} (0 mirrored) · FLIP coils ${traceFlip.counts.coilCopiesVisible} (${traceFlip.counts.coilCopiesMirrored} left-handed)`);

// ═════ [h] the diff surface + the freeze ═════════════════════════════════════════
console.log('\n----- [h] the sanctioned surface, CR-insensitively; the freeze holds -----');
const { sha256OfCrStripped, checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
const headBlobOf = (file) => execSync(`git cat-file blob HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
const movedCrInsensitive = (file) =>
  sha256OfCrStripped(fs.readFileSync(path.join(repoRoot, file), 'utf8')) !== sha256OfCrStripped(headBlobOf(file));
const allowed = new Set([
  'src/lib/level3SoundnessGate.ts',
  'src/lib/level3Invariants.ts',
  'src/manuscript/apertureModel.ts',
  'src/manuscript/ManuscriptView.tsx',
]);
const moved = execSync('git diff HEAD --name-only -- src', { cwd: repoRoot, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((file) => movedCrInsensitive(file));
check('the CR-insensitive content-moved surface is exactly the mandate\'s four files (the gate verdict · the gate-first order · the verdict door · the view\'s consumption) — no frozen file, no renderer, no ink; the engine-freeze manifest holds at 27',
  moved.every((file) => allowed.has(file)) &&
  (() => {
    const freeze = checkEngineFreeze();
    return freeze.ok === true && freeze.checked === 27 && freeze.unlisted.length === 0;
  })());
note(`content-moved vs HEAD: [${moved.join(', ') || 'empty'}]`);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
