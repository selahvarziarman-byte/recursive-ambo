#!/usr/bin/env node

// DIAGNOSTIC — 0.3 · THE CERTIFICATE (engineer-chartered 2026-07-16,
// researcher-proved · mothership-ruled; SEAL-BEFORE-BUILD — BUILT BLIND to
// `.handoff/SEAL_THE_CERTIFICATE.md`, SHA-256 42647890…c1db, natively
// confirmed; every pin below is the builder's own measurement).
//
// WHAT THIS EXECUTES: the arc's strongest claim — THE 97 ARE NOT MANIFOLDS —
// which was proven and then lived in a researcher's scratchpad, the one place
// a certificate cannot survive ("a certificate that lives in someone's
// scratchpad is the differential-oracle mistake, repeating — it must be a
// WITNESS LEG, executed, not reported"). This leg is a READING of what the
// committed engine already says: subdivide each folded form with the
// committed op, re-glue, read the committed gate, locate each fold's midpoint
// FROM THE FOLD ITSELF, and read that midpoint's vertex link.
//
// ★ THE DECIDER (it is what refuted the axis, in this leg's own words):
//   A cone AXIS is a MANIFOLD point — its link is S², χ=2 — AND THE GATE
//   WOULD HAVE PASSED IT. The gate refuses 97/97. An RP² link is a definitive
//   NON-MANIFOLD certificate: in a PL 3-manifold EVERY vertex link is S².
//
// ⚠ MATCH BY MEMBERSHIP: the gate's vertexLinks are keyed by `vertexClass` —
// a union-find ROOT — with `memberVertexIds` beside it. A midpoint is a
// MEMBER, not (usually) the root. The id-against-key lookup found almost
// nothing on a correct engine and nearly shipped a false failure — it rides
// below as the carried wrong mechanism it is. (`vertexClass` itself is an
// honest name — it really is a class; the hazard was the caller's assumption,
// and no field is renamed here.)
//
// ⛔ A READING, NOT AN EDIT: no engine, no gate, no op, no transport, no
// person-facing text moved. The subdivide notice's wording (ruled: it MAY say
// "not a manifold") rides a LATER run, not this one. This file has ZERO git
// reads — it is state-independent on both sides of the commit.
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
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));

const { createSeedShape } = req('src/data/seeds.ts');
const { readSeedCell, glueFaces, flipGlueFaces } = req('src/lib/faceIdentification.ts');
const { readLevel3Tower } = req('src/lib/level3Invariants.ts');
const { bisectEdges, liftPairingsToBisected, midpointVertexId } = req('src/lib/level3Subdivision.ts');
const A = req('src/manuscript/apertureModel.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the certificate: the 97 are not manifolds — subdivision bought the right to say it, and this leg is where it can never be wrong twice (blind concretes)\n');

const cube = createSeedShape('cube');
const seed = readSeedCell(cube);
const bis = bisectEdges(seed);
const f = (k) => `face:cube:${k}`;
const AXES = [['left', 'right'], ['front', 'back'], ['bottom', 'top']];
const menus = AXES.map(([a, b]) => A.dihedralMapCandidates(cube, f(a), f(b)));
const pairingsFor = (i, j, k) => [menus[0][i], menus[1][j], menus[2][k]].map((c, idx) => ({
  faceA: f(AXES[idx][0]), faceB: f(AXES[idx][1]), mode: c.derivedMode, map: c.map,
}));
const glue = (sd, ps) => (ps.some((p) => p.mode === 'reversing') ? flipGlueFaces(sd, ps) : glueFaces(sd, ps));

// ═════ the certificate, executed once — every leg reads from it ═══════════════════
let foldedForms = 0;
let midpointsLocated = 0; // one per folded-edge verdict, READ FROM THE FOLD
let membershipHits = 0;
let idAgainstKeyHits = 0; // the carried wrong lookup (the bug that happened)
const chiHist = new Map();
let s2Links = 0;
let subdividedSound = 0;
let subdividedRefused = 0;
for (let i = 0; i < 8; i += 1) for (let j = 0; j < 8; j += 1) for (let k = 0; k < 8; k += 1) {
  const ps = pairingsFor(i, j, k);
  const before = readLevel3Tower(glue(seed, ps));
  if (!before.folded) continue;
  foldedForms += 1;
  // 1. subdivide with the COMMITTED op; re-glue; read the COMMITTED gate
  const after = readLevel3Tower(glue(bis, liftPairingsToBisected(seed, ps)));
  const gate = after.folded ? after.gate : after.tower.gate;
  if (!after.folded && after.tower.sound) subdividedSound += 1;
  else subdividedRefused += 1;
  // 2. locate each fold's midpoint — READ FROM THE FOLD (never hard-coded:
  //    the gate's own folded-edge verdict → repEdgeId → the seed edge →
  //    midpointVertexId(rep.a, rep.b). LAW 21: a probe aimed at the label
  //    instead of the object finds nothing, and the true mark gets
  //    pronounced absent.)
  for (const fail of before.gate.failures) {
    if (fail.kind !== 'folded-edge') continue;
    const rep = seed.edges.find((e) => e.id === fail.repEdgeId);
    if (!rep) continue;
    const m = midpointVertexId(rep.a, rep.b);
    midpointsLocated += 1;
    // 3. the midpoint's vertex link — MATCHED BY MEMBERSHIP (a midpoint is a
    //    MEMBER of its class; vertexClass is the union-find root)
    const link = gate.vertexLinks.find((v) => v.memberVertexIds.includes(m));
    if (link) {
      membershipHits += 1;
      chiHist.set(link.chi, (chiHist.get(link.chi) ?? 0) + 1);
      if (link.chi === 2) s2Links += 1;
    }
    // the carried wrong lookup, tallied beside it (exhibited in [d])
    if (gate.vertexLinks.some((v) => v.vertexClass === m)) idAgainstKeyHits += 1;
  }
}
const hist = [...chiHist.entries()].sort((a, b) => a[0] - b[0]);

// ═════ [a] THE CERTIFICATE — located from the fold, matched by membership ═════════
console.log('----- [a] ★ the certificate executes: 200 midpoints, every one located FROM THE FOLD and matched BY MEMBERSHIP -----');
check('★ THE CERTIFICATE EXECUTES: all 97 folded forms subdivide through the COMMITTED op and re-read through the COMMITTED gate; all 200 fold midpoints are LOCATED FROM THE FOLD ITSELF (folded-edge verdict → repEdgeId → the seed edge → midpointVertexId — zero hard-coded vertices, zero positions) and every one is FOUND by membership (memberVertexIds.includes) — 200/200',
  foldedForms === 97 && midpointsLocated === 200 && membershipHits === 200);
note(`folded forms: ${foldedForms} · midpoints located: ${midpointsLocated} · membership hits: ${membershipHits}/200`);

// ═════ [b] ★ THE DECIDER — RP², never S²; the axis is refuted ═════════════════════
console.log('\n----- [b] ★ the decider: a cone AXIS would be a MANIFOLD point (link S², χ=2) and the gate would have PASSED it — the links read RP² and the gate refuses 97/97 -----');
console.log(`  χ histogram of the 200 midpoint links: ${hist.map(([chi, count]) => `χ=${chi} × ${count}`).join(' · ')}`);
console.log(`  links reading S² (χ=2): ${s2Links} · subdivided gate tally: sound ${subdividedSound} · refused ${subdividedRefused}`);
check('★ THE DECIDER — THE 97 ARE NOT MANIFOLDS, EXECUTED: every one of the 200 fold-midpoint links reads χ=1 (RP²) and ZERO read S² (χ=2). A cone AXIS is a MANIFOLD point — its link is S², χ=2 — and the gate would have PASSED it; the gate refuses 97/97 (sound 0 · refused 97). An RP² link is a definitive NON-MANIFOLD certificate: in a PL 3-manifold EVERY vertex link is S²',
  JSON.stringify(hist) === JSON.stringify([[1, 200]]) && s2Links === 0 &&
  subdividedSound === 0 && subdividedRefused === 97);

// ═════ [c] ★ CLAUSE 4(a) — the S²-reporting reader, carried, visibly failing ══════
console.log('\n----- [c] ★ the carried S²-reader: the claim that would make the 97 manifolds, contradicted 200/200 -----');
// THE CARRIED WRONG MECHANISM (a): a reader that reports every fold-midpoint
// link as S² (χ=2) — the exact claim under which the 97 would be manifolds.
const s2Reader = () => ({ chi: 2, surface: 'S²' });
check('★ CLAUSE 4(a) — the S²-REPORTING reader, carried in-memory, VISIBLY FAILS: it claims χ=2 at every fold midpoint — the claim that would make the 97 manifolds — and the measured links contradict it 200 out of 200 (every real link reads χ=1)',
  (() => {
    const mutantClaims = midpointsLocated; // it would claim S² at every midpoint
    const contradicted = (chiHist.get(1) ?? 0); // every measured χ=1 refutes it
    note(`mutant claims S² at ${mutantClaims} midpoints · contradicted by measurement at ${contradicted} (χ=${s2Reader().chi} claimed vs χ=1 measured)`);
    return mutantClaims === 200 && contradicted === 200 && s2Reader().chi !== 1;
  })());

// ═════ [d] ★ CLAUSE 4(b) — the id-against-key lookup, carried, visibly failing ════
console.log('\n----- [d] ★ the carried id-against-key lookup: the bug that actually happened — a false failure on a correct engine -----');
check('★ CLAUSE 4(b) — the ID-AGAINST-KEY lookup (midpoint id matched against `vertexClass`, the union-find root), carried in-memory, VISIBLY FAILS the 200/200 pin: it finds only 34 of 200 (the 166 whose class root is another member get pronounced ABSENT — a false failure on a correct engine, the bug that actually happened; measured here at 34, not 0: some midpoints happen to BE their class root, which makes the lookup\'s partial success the most dangerous kind of wrong)',
  idAgainstKeyHits === 34 && idAgainstKeyHits < membershipHits && membershipHits === 200);
note(`id-against-key finds: ${idAgainstKeyHits}/200 · membership finds: ${membershipHits}/200 · falsely absent: ${200 - idAgainstKeyHits}`);

// ═════ [e] the freeze — additive build; the certified thing is untouched ══════════
console.log('\n----- [e] the freeze: ok · 44 · no drift (a reading, not an edit — you may not change the thing you certify) -----');
const freeze = checkEngineFreeze();
check('THE ENGINE FREEZE MANIFEST is untouched: ok · checked 44 · drifted [] · missing [] · unlisted [] · nulled [] — this build is ONE witness file; the op, the gate, the tower and the transport it certifies are byte-identical to what the manifest already sealed',
  freeze.ok === true && freeze.checked === 44 &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 &&
  freeze.unlisted.length === 0 && freeze.nulled.length === 0);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
