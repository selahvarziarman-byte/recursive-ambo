#!/usr/bin/env node

// DIAGNOSTIC — THE SUBDIVISION (ARC 0.1; engineer-chartered 2026-07-14,
// researcher-ruled · mothership-ratified — ADR 0022 §3 restated;
// SEAL-BEFORE-BUILD — BUILT BLIND to `.handoff/SEAL_THE_SUBDIVISION.md`,
// SHA-256 080adb52…2496, verified raw on the real bytes; every pin below is
// the builder's own measurement).
//
// THE LIE THIS KILLS (LAW 14 — A CURE MUST BE A DOOR, NOT A THEOREM): the
// folded-edge wall told the person "subdivide to resolve the fold, and the
// gate will read it" — and no subdivision existed. 97 of 512 door pairings
// named exactly what the person built, then pointed at a door that did not
// exist. The door exists now: bisect the 1-skeleton (UNIFORMLY — all 12
// edges; partial bisection breaks paired-face congruence), keep ONE cell,
// lift the pairings (midpoint → midpoint of the edge's image), re-glue, and
// let the gate read the finer cells. The fold becomes two half-edges the
// identification simply swaps, with a genuine vertex fixed at the middle.
//
// ⚠ THE PRECONDITION, BY LINE: edge bisection suffices EXACTLY WHILE
// faceIdentification.ts:316 (no self-paired face) is enforced — a mirror face
// would let a FACE fold, and the barycentric cure returns. The op's header
// states this, citing the line; this witness greps both sides of the cite.
//
// ⛔ CLAIM NOTHING: subdivision makes the orbifold LEGIBLE, not a manifold.
// Whatever the gate says of the finer cells is the honest reading (measured
// here: all 97 read `vertex-link` refusals — the cone point, now visible
// instead of illegible). The finer question — is the underlying space ALSO a
// manifold? — is ARC 0.3, its own seal, and NOTHING here answers it.
//
// THE FOUR CLAUSES:
//   1 EXECUTE WHAT YOU WITNESS — every subdivided case asserts the fold is
//     GONE and the midpoint is a genuine VERTEX of the complex.
//   2 CARRY BOTH WRONG MECHANISMS (the witness outlives the commit):
//     (a) PARTIAL bisection visibly breaks paired-face congruence — the
//         validator THROWS — where uniform bisection passes;
//     (b) the UN-subdivided complex still carries the folded verdict where
//         the subdivided one does not.
//   3 ★ SUBDIVISION IS A HOMEOMORPHISM — the invariants must not move:
//     T³ before ≡ after (χ 0 · w₁ 0 · H₁ Z³), FLIP before ≡ after
//     (χ 0 · w₁ 1 · H₁ Z²⊕Z/2). Any invariant that moves = the subdivision
//     is WRONG.
//   4 NON-MOVEMENT — when subdivision is not invoked, all 415 sound and all
//     97 folded verdicts read byte-identically to HEAD; the gate, the tower,
//     faceIdentification: untouched.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

'use strict';
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
const { checkEngineFreeze, sha256OfCrStripped } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));

const { createSeedShape } = req('src/data/seeds.ts');
const { readSeedCell, glueFaces, flipGlueFaces } = req('src/lib/faceIdentification.ts');
const { readLevel3Tower } = req('src/lib/level3Invariants.ts');
const SUB = req('src/lib/level3Subdivision.ts');
const A = req('src/manuscript/apertureModel.ts');

// the ONE plumbing read (pinned by name in the flagship's HEAD-read
// inventory): non-movement — byte-identity + the HEAD-compiled tower reader
// THE APP COLUMN riding fix (2026-07-18): the baseline is PINNED to 01da8ed
// (the small run — the tree this arc built against). The old spelling read
// HEAD:, which post-commit compares the committed file against ITSELF — a
// non-movement clause that cannot detect movement.
const headBlobOf = (file) => execSync(`git cat-file blob 01da8ed:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log('the subdivision: the wall\'s cure is a door that exists — bisect the edges, and the fold becomes two half-edges with a real vertex in the middle (blind concretes)\n');

const cubeShape = createSeedShape('cube');
const seed = readSeedCell(cubeShape);
const f = (k) => `face:cube:${k}`;
const AXES = [['left', 'right'], ['front', 'back'], ['bottom', 'top']];
const menus = AXES.map(([a, b]) => A.dihedralMapCandidates(cubeShape, f(a), f(b)));
const rowsFor = (i, j, k) => AXES.map(([a, b], idx) => ({ faceA: f(a), faceB: f(b), candidateKey: menus[idx][[i, j, k][idx]].key }));
const pairingsFor = (i, j, k) => [menus[0][i], menus[1][j], menus[2][k]].map((c, idx) => ({
  faceA: f(AXES[idx][0]),
  faceB: f(AXES[idx][1]),
  mode: c.derivedMode,
  map: c.map,
}));
const glue = (sd, ps) => (ps.some((p) => p.mode === 'reversing') ? flipGlueFaces(sd, ps) : glueFaces(sd, ps));

// ═════ [a] battery 1 + 6 — the op: counts stated; the precondition cited by line ══
console.log('----- [a] bisectEdges(cube): 20 v · 24 e · 6 octagons · 1 cell; the header cites the line it depends on -----');
const bis = SUB.bisectEdges(seed);
check('battery 1 — bisectEdges(cube) = 20 vertices (8 + 12 midpoints) · 24 half-edges · 6 OCTAGONAL faces · 1 cell, and every octagon ALTERNATES corner/midpoint (the cycle carries the 8-cycle in the existing type — no new cell kind)',
  bis.vertexIds.length === 20 && bis.edges.length === 24 && bis.faces.length === 6 &&
  bis.faces.every((face) => face.cycle.length === 8) &&
  bis.faces.every((face) => face.cycle.every((v, idx) => (idx % 2 === 0 ? seed.vertexIds.includes(v) : v.startsWith('mid:')))) &&
  new Set(bis.vertexIds).size === 20 && seed.vertexIds.every((v) => bis.vertexIds.includes(v)));
note(`counts: ${bis.vertexIds.length} v · ${bis.edges.length} e · ${bis.faces.length} f (all 8-cycles) · 1 cell`);
const subSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/level3Subdivision.ts'), 'utf8');
const fiSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/faceIdentification.ts'), 'utf8');
const fiLine316 = fiSrc.split(/\r?\n/)[315];
check('battery 6 — THE PRECONDITION IS IN THE OP\'S HEADER, CITING THE LINE: level3Subdivision names `faceIdentification.ts:316` (one grep finds it), and line 316 still IS the no-self-paired-face guard the specialization stands on',
  subSrc.includes('faceIdentification.ts:316') &&
  fiLine316.includes('pairing.faceA === pairing.faceB') && fiLine316.includes('cannot pair with itself'));
note(`the cited line, live: "${fiLine316.trim().slice(0, 96)}…"`);

// ═════ [b] battery 2 — all 97 folds resolve; m is a vertex; the gate returns a verdict ══
console.log('\n----- [b] ★ CLAUSE 1 — the 512 sweep: every fold resolves under subdivision; the midpoint is a REAL vertex; the gate speaks (battery 2) -----');
let foldedBefore = 0;
let stillFoldedAfter = 0;
let mVertexOk = 0;
let soundAfter = 0;
const failureKinds = new Map();
const foldedCombos = [];
const sweepReadings = []; // [combo, un-subdivided reading JSON] — for the clause-4 HEAD equivalence
for (let i = 0; i < 8; i += 1) for (let j = 0; j < 8; j += 1) for (let k = 0; k < 8; k += 1) {
  const ps = pairingsFor(i, j, k);
  const before = readLevel3Tower(glue(seed, ps));
  sweepReadings.push([[i, j, k], JSON.stringify({ folded: before.folded, chi: before.folded ? before.chi : before.tower.chi, sound: before.folded ? false : before.tower.sound, h1: before.folded ? null : before.tower.homology.H1.pretty })]);
  if (!before.folded) continue;
  foldedBefore += 1;
  foldedCombos.push({ combo: [i, j, k], foldedEdgeClasses: before.foldedEdgeClasses });
  const lifted = SUB.liftPairingsToBisected(seed, ps);
  const complexAfter = glue(bis, lifted);
  const after = readLevel3Tower(complexAfter);
  if (after.folded) { stillFoldedAfter += 1; continue; }
  // the previously folded edge's midpoint: a GENUINE vertex — present in the
  // finer complex's vertex set, carrying its own class
  const rep = seed.edges.find((e) => e.id === before.foldedEdgeClasses[0]);
  const m = rep ? SUB.midpointVertexId(rep.a, rep.b) : null;
  if (m && complexAfter.originalVertices.includes(m) && typeof complexAfter.vertexClassOf(m) === 'string') mVertexOk += 1;
  if (after.tower.sound) soundAfter += 1;
  else for (const fail of after.tower.gate.failures) failureKinds.set(fail.kind, (failureKinds.get(fail.kind) ?? 0) + 1);
}
check('★ CLAUSE 1 — EXECUTE WHAT YOU WITNESS: 97 of 512 fold before; after subdivision ZERO folds survive (no `folded-edge` verdict on any bisected complex) and all 97 midpoints are genuine VERTICES of the finer complex — present in vertexIds, each carrying its own class',
  foldedBefore === 97 && stillFoldedAfter === 0 && mVertexOk === 97);
check('…and the gate RETURNS A VERDICT on every subdivided case — measured and stated plainly, CLAIMING NOTHING: 0 of 97 read sound; 97 of 97 are refused by the S² gate on `vertex-link` failures (the fold\'s cone point, now LEGIBLE to the gate instead of illegible to the orientation reader). Whether the underlying space is also a manifold is ARC 0.3\'s question, not answered here',
  soundAfter === 0 && [...failureKinds.keys()].length === 1 && failureKinds.has('vertex-link'));
note(`subdivided outcomes: sound ${soundAfter} · vertex-link-refused ${foldedBefore - stillFoldedAfter - soundAfter} (vertex-link failures counted: ${failureKinds.get('vertex-link') ?? 0})`);

// ═════ [c] ★ CLAUSE 3 — subdivision is a homeomorphism: the invariants must not move ══
console.log('\n----- [c] ★ CLAUSE 3 — sound forms: T³ and FLIP read IDENTICALLY before and after subdivision (battery 3) -----');
const invariantsOf = (ps, sd) => {
  const r = readLevel3Tower(glue(sd, ps));
  if (r.folded) return { folded: true };
  return { folded: false, sound: r.tower.sound, chi: r.tower.chi, w1: r.tower.w1.w1, H1: r.tower.homology.H1.pretty, orientable: r.tower.orientable };
};
const findCombo = (want) => {
  for (let i = 0; i < 8; i += 1) for (let j = 0; j < 8; j += 1) for (let k = 0; k < 8; k += 1) {
    const inv = invariantsOf(pairingsFor(i, j, k), seed);
    if (!inv.folded && inv.sound && want(inv)) return [i, j, k];
  }
  throw new Error('fixture combo not found');
};
const t3Combo = findCombo((inv) => inv.H1 === 'Z^3' && inv.w1 === 0);
const flipCombo = findCombo((inv) => inv.H1 === 'Z^2 ⊕ Z/2' && inv.w1 === 1);
const t3Ps = pairingsFor(...t3Combo);
const flipPs = pairingsFor(...flipCombo);
const t3Before = invariantsOf(t3Ps, seed);
const t3After = invariantsOf(SUB.liftPairingsToBisected(seed, t3Ps), bis);
const flipBefore = invariantsOf(flipPs, seed);
const flipAfter = invariantsOf(SUB.liftPairingsToBisected(seed, flipPs), bis);
check('★ CLAUSE 3 — T³ before ≡ T³ after: sound · χ 0 · w₁ 0 · H₁ Z³ · orientable — subdivision changed the CELLS (8→20 vertices), not the SPACE (any moved invariant = the subdivision is WRONG)',
  eq(t3Before, t3After) && t3Before.sound === true && t3Before.chi === 0 && t3Before.w1 === 0 && t3Before.H1 === 'Z^3' && t3Before.orientable === true);
check('…and the NON-ORIENTABLE sound form agrees: FLIP before ≡ FLIP after — sound · χ 0 · w₁ 1 · H₁ Z²⊕Z/2 · non-orientable (the homeomorphism check holds on both sides of w₁)',
  eq(flipBefore, flipAfter) && flipBefore.sound === true && flipBefore.w1 === 1 && flipBefore.H1 === 'Z^2 ⊕ Z/2' && flipBefore.orientable === false);
note(`T³: ${JSON.stringify(t3After)} · FLIP: ${JSON.stringify(flipAfter)}`);

// ═════ [d] ★ CLAUSE 2 — both wrong mechanisms, carried in-memory ══════════════════
console.log('\n----- [d] ★ CLAUSE 2 — partial bisection visibly breaks congruence; the un-subdivided complex still folds (battery 4) -----');
// (a) THE CARRIED WRONG MECHANISM — PARTIAL bisection (only the folded edges):
// the same rewrite, restricted to a chosen edge set. Incident faces become
// 5/6-gons while their PARTNERS stay 4-gons — the validator's congruence
// guard throws. Carried in-memory; the witness outlives the commit.
const partialBisectMutant = (sd, edgeIds) => {
  const chosen = new Set(edgeIds);
  const mids = new Map();
  const edges = [];
  for (const edge of sd.edges) {
    if (!chosen.has(edge.id)) { edges.push(edge); continue; }
    const m = SUB.midpointVertexId(edge.a, edge.b);
    mids.set(edge.a < edge.b ? `${edge.a}~${edge.b}` : `${edge.b}~${edge.a}`, m);
    edges.push({ id: `${edge.id}:h1`, a: edge.a, b: m }, { id: `${edge.id}:h2`, a: m, b: edge.b });
  }
  const faces = sd.faces.map((face) => ({
    id: face.id,
    cycle: face.cycle.flatMap((u, idx) => {
      const w = face.cycle[(idx + 1) % face.cycle.length];
      const m = mids.get(u < w ? `${u}~${w}` : `${w}~${u}`);
      return m ? [u, m] : [u];
    }),
  }));
  return {
    cellId: sd.cellId,
    vertexIds: [...sd.vertexIds, ...[...mids.values()]],
    edges,
    faces,
  };
};
const foldedFixture = foldedCombos[0];
const foldedPs = pairingsFor(...foldedFixture.combo);
const foldedEdgeRep = seed.edges.find((e) => e.id === foldedFixture.foldedEdgeClasses[0]) ?? seed.edges[0];
const partialSeed = partialBisectMutant(seed, [foldedEdgeRep.id]);
const partialOutcome = (() => {
  try {
    // the maps still name only original corners — the mutant's faces carry the
    // midpoint, so paired cycles are no longer congruent (5-gon vs 4-gon)
    glue(partialSeed, foldedPs);
    return { threw: false, message: null };
  } catch (error) {
    return { threw: true, message: String(error.message) };
  }
})();
check('★ CLAUSE 2(a) — PARTIAL bisection (only the folded edge), carried in-memory, VISIBLY BREAKS paired-face congruence: the validator THROWS naming the non-congruent cycles — where UNIFORM bisection of the same pairing passes the validator and re-glues clean',
  partialOutcome.threw === true && /not congruent|congruence|cycle/i.test(partialOutcome.message) &&
  (() => { try { glue(bis, SUB.liftPairingsToBisected(seed, foldedPs)); return true; } catch { return false; } })());
note(`partial mutant threw: "${(partialOutcome.message ?? '').slice(0, 110)}…"`);
check('★ CLAUSE 2(b) — the UN-subdivided complex still carries the `folded-edge` verdict where the subdivided one does not (same pairing, same engine — only the cell structure moved)',
  (() => {
    const before = readLevel3Tower(glue(seed, foldedPs));
    const after = readLevel3Tower(glue(bis, SUB.liftPairingsToBisected(seed, foldedPs)));
    return before.folded === true && after.folded === false;
  })());

// ═════ [e] battery 5 — the cure is REACHABLE from the wall: the door exists ═══════
console.log('\n----- [e] the door: reachable from the folded verdict, in the model and in the view (battery 5) -----');
const foldedRows = rowsFor(...foldedFixture.combo);
const doorResult = A.subdivideAndReadPersonDomain(cubeShape, foldedRows);
check('the model\'s door WORKS on the exact rows that folded: subdivideAndReadPersonDomain returns the finer counts (20 v · 24 e · 6 f · 1 c as classes read them: v/e/f are the complex\'s own union-find counts) and the gate\'s verdict VERBATIM — the fold is gone, and the reading carries ONLY {counts, reading} (no interpretation field smuggled in)',
  eq(Object.keys(doorResult).sort(), ['counts', 'reading']) &&
  doorResult.reading.folded === false &&
  doorResult.counts.c === 1 &&
  (() => {
    const wallVerdict = A.buildPersonDomainVerdict(cubeShape, foldedRows, 'w', 'wall');
    return wallVerdict.folded === true && wallVerdict.wall.includes('subdivide to resolve the fold');
  })());
note(`door counts (class-level): ${JSON.stringify(doorResult.counts)} · reading.folded: ${doorResult.reading.folded} · gate kinds: ${doorResult.reading.folded ? '-' : [...new Set(doorResult.reading.tower.gate.failures.map((x) => x.kind))].join(',') || 'none (sound)'}`);
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
const chromeSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptChrome.tsx'), 'utf8');
check('the door is WIRED where the wall shows: the view snapshots the folded rows on the folded verdict (setApertureFoldedRows beside setApertureNotice(verdict.wall)), hands onSubdivide to the panel exactly when they exist, and the panel renders the subdivide button under the notice ("subdivide — resolve the fold; the gate reads again")',
  viewSrc.includes('setApertureFoldedRows(apertureRows.map((row) => ({ ...row })))') &&
  viewSrc.includes('onSubdivide={apertureFoldedRows ? handleApertureSubdivide : null}') &&
  viewSrc.includes('subdivideAndReadPersonDomain(cubeSeed, apertureFoldedRows)') &&
  chromeSrc.includes('onSubdivide: (() => void) | null;') &&
  chromeSrc.includes('subdivide — resolve the fold; the gate reads again'));
check('⛔ NOTHING IS CLAIMED: the subdivide handler\'s user-facing notice templates never say "manifold" (the gate\'s own numbers and failure kinds speak; the finer question is ARC 0.3\'s, unanswered here)',
  (() => {
    const start = viewSrc.indexOf('const handleApertureSubdivide');
    const block = viewSrc.slice(start, viewSrc.indexOf('}, [cubeSeed, apertureFoldedRows]);', start));
    const templates = block.match(/`[^`]*`/g) ?? [];
    return start > 0 && templates.length >= 3 && templates.every((t) => !/manifold/i.test(t));
  })());

// ═════ [f] battery 7 + CLAUSE 4 — non-movement when subdivision is not invoked ════
console.log('\n----- [f] ★ CLAUSE 4 — non-movement: the gate/tower/faceIdentification untouched; all 512 un-subdivided readings ≡ HEAD (battery 7) -----');
// THE CENSUS + THE REPRESENTATIVE (2026-07-16, sealed 9832a89c…f2d4): the
// sanctioned rename (edgeClass → repEdgeId + classRoot on the folded-edge
// failure) moves the gate and its reader pre-commit — re-sealed in the
// manifest in the same change; ratified in diagnose-the-census.cjs. Carved
// here; inert post-commit. Everything else must still not move.
check('the READ PATH did not move (census pair carved, re-sealed): level3{Orientation,W1,Homology,LinkExtractor} are CR-insensitively BYTE-IDENTICAL to the 01da8ed BASELINE — the tree this arc built against, pinned so the clause can detect movement forever (the old HEAD: spelling compared the committed file against itself post-commit; THE APP COLUMN riding fix, 2026-07-18) — and faceIdentification carries EXACTLY the one sanctioned movement since that baseline: THE BOUNDED FORM (2026-07-18, sealed eb9bfcb4…d598c, manifest re-sealed in the same change) split the matching predicate — `count > 1` throws the byte-identical message, `count !== 1` is gone; the manifest hash is its guard now — the subdivision is a new module BESIDE the engine, never inside it',
  ['src/lib/level3Orientation.ts', 'src/lib/level3W1.ts', 'src/lib/level3Homology.ts', 'src/lib/level3LinkExtractor.ts']
    .every((file) => sha256OfCrStripped(fs.readFileSync(path.join(repoRoot, file), 'utf8')) === sha256OfCrStripped(headBlobOf(file))) &&
  (() => {
    const work = fs.readFileSync(path.join(repoRoot, 'src/lib/faceIdentification.ts'), 'utf8');
    return work.includes('if (count > 1) {') && !work.includes('if (count !== 1) {') &&
      work.includes('appears in ${count} pairs — a perfect matching needs exactly 1');
  })());
// the 512 un-subdivided readings vs the BASELINE-COMPILED tower reader — the
// modules the 01da8ed baseline carries, compiled in-memory (their imports
// resolve to working files proven byte-identical above)
const headInvariants = (() => {
  const src = headBlobOf('src/lib/level3Invariants.ts');
  const m = new Module.Module('level3Invariants.head.ts');
  m.filename = path.join(repoRoot, 'src/lib/__head_level3Invariants.ts');
  m.paths = Module.Module._nodeModulePaths(path.dirname(m.filename));
  m._compile(ts.transpileModule(src, { ...TRANSPILE_OPTIONS, fileName: m.filename }).outputText, m.filename);
  return m.exports;
})();
check('★ CLAUSE 4 — all 512 un-subdivided verdicts read BYTE-IDENTICALLY through the HEAD-compiled tower reader: 415 sound-side readings and 97 folded verdicts, JSON-equal per pairing (when the person does not invoke subdivide, NOTHING moved)',
  (() => {
    let mismatches = 0;
    for (const [[i, j, k], workingJson] of sweepReadings) {
      const r = headInvariants.readLevel3Tower(glue(seed, pairingsFor(i, j, k)));
      const headJson = JSON.stringify({ folded: r.folded, chi: r.folded ? r.chi : r.tower.chi, sound: r.folded ? false : r.tower.sound, h1: r.folded ? null : r.tower.homology.H1.pretty });
      if (headJson !== workingJson) mismatches += 1;
    }
    note(`512 readings compared against the HEAD-compiled reader · mismatches: ${mismatches}`);
    return mismatches === 0;
  })());
const freeze = checkEngineFreeze();
check('THE ENGINE FREEZE MANIFEST: ok at 45 (import-closed) · drifted [] · missing [] · unlisted [] (the new subdivision module rides as a NOT_FROZEN line — the completeness law working) · nulled []',
  freeze.ok === true && freeze.checked === 45 &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 && freeze.unlisted.length === 0 && freeze.nulled.length === 0);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
