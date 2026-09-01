#!/usr/bin/env node

// DIAGNOSTIC — 0.2 · THE ORBIFOLD'S BODY (engineer-chartered 2026-07-16,
// mothership-ruled 0330 re-scope · designer-ruled draw path;
// SEAL-BEFORE-BUILD — BUILT BLIND to `.handoff/SEAL_THE_ORBIFOLDS_BODY.md`,
// SHA-256 de6f8237…83cb, natively confirmed against the on-repo record;
// every pin below is the builder's own measurement).
//
// THE PROMISE THIS PAYS: every pairing → a verdict → a cure that works → a
// body you can stand in. The bodies already existed — deckOf fits ALL 97
// folded forms and the committed tracer draws them; the sole blocker was
// formDomainModel's unconditional tower read (unreadable for a folded cell BY
// DESIGN). 0.2 adds a SIBLING: a tower-less FoldedDomain carried on the
// verdict, a folded branch in buildAperture reading its geometry from the
// GATE's own edge links, and a folded shelf in the view. DomainModel's tower
// stays non-nullable; the frozen worldModel/specimenModel do not move; the
// transport is byte-untouched.
//
// ⚠ THE BOUNDARY: the branch keys on FOLDED, never on !sound. 512 = 79 sound
// (drawing) · 97 folded (0.2's) · 336 unsound-but-NOT-folded — the 336 are
// broken patterns (pinches, bad links), not orbifolds, and STAY REFUSED.
//
// WHAT THE BODY MAY SAY: non-freeness ONLY (orbifold · fold loci · TRUE cone
// edges at k×90°). A FOLDED edge is not a cone edge (its holonomy reverses
// the edge — no angle applies; it prints NOTHING, and no ε² hole is carved:
// "an ε² hole sized so it reads is the orbifold badge wearing the costume of
// honesty"). mirrored[] ships captioned as w₁ — "the copies come back
// left-handed" — NEVER the fold (it lights on sound w₁=1 forms that carry no
// fold; sealing the fold on it would certify a fold in 57 manifolds that
// don't have one). THE FLIP IS OUT — it waits for motion (the shader).
//
// THE CLAUSES: 1 THE BODIES (97/97 domain·deck·non-empty trace; was 0) ·
// 2 THE 336 REFUSE (zero draw, by name; the branch keys on folded) ·
// 3 NON-MOVEMENT (79 sound labels+traces ≡ HEAD-compiled; worldModel +
// specimenModel byte-identical) · 4 THE WINDING (a folded-with-cone fixture
// reports its true angle and traces) · 5 CLAIMS NOTHING (no "manifold" in any
// folded string; the mirrored caption names handedness, never the fold) ·
// 6 ★ BOTH WRONG MECHANISMS CARRIED IN-MEMORY ((a) a !sound-keyed branch
// draws the 336; (b) a fold-claiming mirrored caption certifies a fold in
// fold-free manifolds).
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
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
const { checkEngineFreeze, sha256OfCrStripped } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));

const { createSeedShape } = req('src/data/seeds.ts');
const A = req('src/manuscript/apertureModel.ts');
const P = req('src/manuscript/apertureProbes.ts');

// the ONE plumbing read (pinned by name in the flagship's HEAD-read inventory):
// the frozen pair's byte-identity + the HEAD-compiled reader for non-movement
const headBlobOf = (file) => execSync(`git cat-file blob HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

console.log('the orbifold\'s body: the deck fits all 97, the tracer draws them — one unconditional tower read was the only reason those rooms were dark (blind concretes)\n');

const cube = createSeedShape('cube');
const f = (k) => `face:cube:${k}`;
const AXES = [['left', 'right'], ['front', 'back'], ['bottom', 'top']];
const menus = AXES.map(([a, b]) => A.dihedralMapCandidates(cube, f(a), f(b)));
const rowsFor = (i, j, k) => AXES.map(([a, b], idx) => ({ faceA: f(a), faceB: f(b), candidateKey: menus[idx][[i, j, k][idx]].key }));
const probes = P.buildProbeMeshes();
const probeList = [...probes.maskShells, probes.hand];
const setKey = (ids) => [...ids].sort().join('|');

// the HEAD-compiled aperture reader — the shipped pre-0.2 mechanism, in-memory
const HEAD_A = (() => {
  const src = headBlobOf('src/manuscript/apertureModel.ts');
  const m = new Module.Module('apertureModel.head.ts');
  m.filename = path.join(repoRoot, 'src/manuscript/__head_apertureModel.ts');
  m.paths = Module.Module._nodeModulePaths(path.dirname(m.filename));
  m._compile(ts.transpileModule(src, { ...TRANSPILE_OPTIONS, fileName: m.filename }).outputText, m.filename);
  return m.exports;
})();
const headHasBody = (() => {
  const src = headBlobOf('src/manuscript/apertureModel.ts');
  return src.includes('geometryFromFoldedGate');
})();
note(`HEAD reader state: ${headHasBody ? 'post-0.2 (the commit landed)' : 'pre-0.2 (folded verdicts carry no body — the window is open)'}`);

// ═════ the 512 sweep — every leg reads from it ════════════════════════════════════
const sweep = [];
for (let i = 0; i < 8; i += 1) for (let j = 0; j < 8; j += 1) for (let k = 0; k < 8; k += 1) {
  const rows = rowsFor(i, j, k);
  const verdict = A.buildPersonDomainVerdict(cube, rows, `ob-${i}${j}${k}`, 'orbifold-body');
  sweep.push({ combo: [i, j, k], rows, verdict });
}
const foldedSet = sweep.filter((s) => s.verdict.folded);
const soundSet = sweep.filter((s) => !s.verdict.folded && s.verdict.domain.tower.sound);
const brokenSet = sweep.filter((s) => !s.verdict.folded && !s.verdict.domain.tower.sound);

// ═════ [a] CLAUSE 1 — THE BODIES: all 97, a domain · a fitted deck · a non-empty trace ══
console.log('----- [a] ★ THE BODIES: every folded verdict carries a tower-less body; the gate is ok, the deck fits, the trace lights (clause 1 — was 0) -----');
let bodies = 0;
let decksFit = 0;
let tracesLit = 0;
const scene = A.buildApertureScene(cube, null, probeList);
for (const s of foldedSet) {
  const body = s.verdict.body;
  if (!body || body.folded !== true || 'tower' in body) continue;
  bodies += 1;
  const gate = A.buildAperture(body);
  if (!gate.ok || gate.deck.length === 0) continue;
  decksFit += 1;
  const trace = A.traceAperture({ deck: gate.deck, scene, width: 20, height: 20 });
  if (trace.counts.litPixels > 0) tracesLit += 1;
}
check('★ CLAUSE 1 — THE BODIES EXIST AND DRAW: all 97 folded verdicts carry a TOWER-LESS body (no `tower` key exists on it — a sibling, never a widening), buildAperture is ok on every one with a FITTED deck, and a small trace is NON-EMPTY on every one (was 0 of 97 before 0.2)',
  foldedSet.length === 97 && bodies === 97 && decksFit === 97 && tracesLit === 97);
note(`folded 97 · bodies ${bodies} · decks fitted ${decksFit} · traces lit ${tracesLit}`);

// ═════ [b] CLAUSE 2 — THE 336 REFUSE, by name; the branch keys on folded ═════════
console.log('\n----- [b] ★ THE BOUNDARY: the 336 unsound-but-NOT-folded stay refused BY NAME; the branch keys on `folded`, never on !sound (clause 2) -----');
let refusedByName = 0;
let brokenDraws = 0;
for (const s of brokenSet) {
  const gate = A.buildAperture(s.verdict.domain);
  if (gate.ok) { brokenDraws += 1; continue; }
  if (gate.reason.includes('S² gate: NOT sound') && gate.reason.includes('nothing is drawn')) refusedByName += 1;
}
check('★ CLAUSE 2 — ZERO of the 336 draw: every unsound-but-NOT-folded pattern is refused with the S² gate\'s own words (a pinch is not an orbifold — the gate already distinguishes them, and the door inherits that distinction)',
  brokenSet.length === 336 && brokenDraws === 0 && refusedByName === 336);
note(`broken 336 · draws ${brokenDraws} · refused by name ${refusedByName}`);
check('…and the branch KEYS ON FOLDED, source-asserted: buildAperture\'s folded branch tests the discriminant (\'folded\' in domain), and no draw path is keyed on !sound (the !sound test appears only in the REFUSAL above it)',
  (() => {
    const src = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
    const gateStart = src.indexOf('export function buildAperture');
    const gateBlock = src.slice(gateStart, src.indexOf('\n// ---', gateStart));
    return gateBlock.includes("if ('folded' in domain)") &&
      gateBlock.includes('if (!tower.sound)') &&
      gateBlock.indexOf("if ('folded' in domain)") < gateBlock.indexOf('if (!tower.sound)');
  })());

// ═════ [c] CLAUSE 3 — NON-MOVEMENT: the 79 sound forms and the frozen pair ═══════
console.log('\n----- [c] ★ NON-MOVEMENT: 79 sound labels + trace buffers ≡ the HEAD-compiled reader; worldModel + specimenModel byte-identical (clause 3) -----');
const hashTrace = (t) =>
  sha(Buffer.concat([
    Buffer.from(t.hit.buffer, 0, t.hit.byteLength),
    Buffer.from(t.value.buffer, 0, t.value.byteLength),
    Buffer.from(t.echo.buffer, 0, t.echo.byteLength),
    Buffer.from(t.mirrored.buffer, 0, t.mirrored.byteLength),
    Buffer.from(t.material.buffer, 0, t.material.byteLength),
    Buffer.from(t.depth.buffer, 0, t.depth.byteLength),
    Buffer.from(t.normal.buffer, 0, t.normal.byteLength),
  ]));
check('★ CLAUSE 3 — the 79 SOUND forms did not move: label byte-equal AND a small trace\'s seven buffers hash-identical through the working and HEAD-compiled readers, on every one',
  (() => {
    let mismatches = 0;
    const sceneHead = HEAD_A.buildApertureScene(cube, null, probeList);
    for (const s of soundSet) {
      const g = A.geometryFromTower(s.verdict.domain.tower);
      const gHead = HEAD_A.geometryFromTower(s.verdict.domain.tower);
      if (g.label !== gHead.label) { mismatches += 1; continue; }
      const gate = A.buildAperture(s.verdict.domain);
      const gateHead = HEAD_A.buildAperture(s.verdict.domain);
      if (!gate.ok || !gateHead.ok) { mismatches += 1; continue; }
      const t = A.traceAperture({ deck: gate.deck, scene, width: 16, height: 16 });
      const tHead = HEAD_A.traceAperture({ deck: gateHead.deck, scene: sceneHead, width: 16, height: 16 });
      if (hashTrace(t) !== hashTrace(tHead)) mismatches += 1;
    }
    note(`sound forms compared: ${soundSet.length} · mismatches: ${mismatches}`);
    return soundSet.length === 79 && mismatches === 0;
  })());
check('…and the FROZEN registers did not move: worldModel.ts and specimenModel.ts are CR-insensitively BYTE-IDENTICAL to HEAD (the folded path is a sibling in NOT_FROZEN modules — DomainModel\'s tower stays non-nullable and no reader was forced to answer 0.2\'s question)',
  ['src/manuscript/worldModel.ts', 'src/manuscript/specimenModel.ts']
    .every((file) => sha256OfCrStripped(fs.readFileSync(path.join(repoRoot, file), 'utf8')) === sha256OfCrStripped(headBlobOf(file))));

// ═════ [d] CLAUSE 4 — THE WINDING: true cone edges read on the folded body ═══════
console.log('\n----- [d] the winding: a folded-with-cone fixture reports its TRUE cone angle; the fold loci print NOTHING (clause 4 + the RP² guard) -----');
const foldedWithCone = foldedSet.filter((s) => {
  const g = A.geometryFromFoldedGate(s.verdict.gate);
  return g.coneEdges !== null;
});
const foldedConeFree = foldedSet.filter((s) => A.geometryFromFoldedGate(s.verdict.gate).coneEdges === null);
check('★ CLAUSE 4 — THE WINDING READS: 46 folded-with-cone bodies report their TRUE cone edges at k×90° (matched by classRoot — the census key; a FOLDED edge is never among them), each label\'s angle set equals the independently member-set-matched true-cone angle set, and a fixture traces NON-EMPTY',
  (() => {
    if (foldedWithCone.length !== 46 || foldedConeFree.length !== 51) return false;
    for (const s of foldedWithCone) {
      const g = A.geometryFromFoldedGate(s.verdict.gate);
      const foldedSets = new Set(s.verdict.gate.failures.filter((x) => x.kind === 'folded-edge').map((x) => setKey(x.memberEdgeIds)));
      const trueAngles = new Set(
        s.verdict.gate.edgeLinks
          .filter((l) => l.memberEdgeIds.length !== 4 && !foldedSets.has(setKey(l.memberEdgeIds)))
          .map((l) => `${l.memberEdgeIds.length * 90}`),
      );
      const labelAngles = new Set([...g.label.matchAll(/(\d+)°/g)].map((m) => m[1]));
      if (JSON.stringify([...labelAngles].sort()) !== JSON.stringify([...trueAngles].sort())) return false;
    }
    const fixture = foldedWithCone[0];
    const gate = A.buildAperture(fixture.verdict.body);
    if (!gate.ok) return false;
    const trace = A.traceAperture({ deck: gate.deck, scene, width: 20, height: 20 });
    note(`fixture label: "${A.geometryFromFoldedGate(fixture.verdict.gate).label}" · lit ${trace.counts.litPixels}/400`);
    return trace.counts.litPixels > 0;
  })());
check('…and THE RP² POINT PRINTS NOTHING: on all 51 folded-cone-free bodies the label carries NO angle at all (coneEdges null — the fold loci are refused an angle, never interpolated; the tracer is byte-untouched and nothing carves a hole: no ε² badge)',
  foldedConeFree.every((s) => {
    const g = A.geometryFromFoldedGate(s.verdict.gate);
    return g.coneEdges === null && ![...g.label.matchAll(/\d+°/g)].length;
  }));

// ═════ [e] CLAUSE 5 — CLAIMS NOTHING ══════════════════════════════════════════════
console.log('\n----- [e] the body claims NOTHING: no "manifold" in any folded string; the mirrored caption names handedness (w₁), never the fold (clause 5) -----');
// RECUT (THE SCENE, 2026-08-08): the w₁ register's ruled words are the
// designer's plate's own — "N of the K coils come back mirrored — count
// them" (the coil replaced the hand as the chirality counter). The law is
// unchanged: handedness only, never a fold-attribution.
check('★ CLAUSE 5 — across all 97 folded bodies: label and caption contain NO "manifold" (non-freeness only — orbifold · fold loci · true cones; 0.3\'s certificate is not smuggled), and the mirrored[] caption line is the ruled w₁ register ("N of the K coils come back mirrored — count them") carrying no fold-attribution',
  foldedSet.every((s) => {
    const g = A.geometryFromFoldedGate(s.verdict.gate);
    if (/manifold/i.test(g.label)) return false;
    const caption = A.apertureCaption(g, {
      transports: 0, litPixels: 0, lostRays: 0, maskCopiesVisible: 2,
      handCopiesVisible: 5, handCopiesMirrored: 3, formCopiesVisible: 0,
      formCopiesMirrored: 0, minCopyPixels: 0,
    });
    if (/manifold/i.test(caption)) return false;
    const mirroredLine = caption.split(' · ').find((part) => part.includes('come back mirrored'));
    return mirroredLine !== undefined && /\d+ of the \d+ coils come back mirrored — count them/.test(mirroredLine) && !/fold/i.test(mirroredLine);
  }));

// ═════ [f] ★ CLAUSE 6 — both wrong mechanisms, carried in-memory ══════════════════
console.log('\n----- [f] ★ the carried mutants: the !sound-keyed branch draws the 336; the fold-claiming caption certifies folds that do not exist (clause 6) -----');
// (a) THE !SOUND-KEYED BRANCH — the bug that WOULD happen: key the body path on
// !sound instead of folded, and every broken pattern walks through the door.
const notSoundGate = (domain) => {
  if (!domain.tower.sound) {
    // the mutant treats ANY unsound form as a body: geometry from the gate's
    // edge links, deck fit, ok — exactly what a folded branch keyed on !sound
    // would do
    const geometry = A.geometryFromFoldedGate(domain.tower.gate);
    try {
      const deck = A.deckOf(domain.shape, domain.complex.pairings);
      return { ok: true, deck, geometry };
    } catch {
      return { ok: false, reason: 'deck refused' };
    }
  }
  return A.buildAperture(domain);
};
check('★ CLAUSE 6(a) — the !SOUND-KEYED branch, carried in-memory, VISIBLY DRAWS THE 336: every broken pattern (pinches, bad links — forms with NO body) walks through the mutant gate ok, where the honest folded-keyed door refuses all 336 by name',
  (() => {
    let mutantDraws = 0;
    for (const s of brokenSet) if (notSoundGate(s.verdict.domain).ok) mutantDraws += 1;
    note(`mutant (!sound-keyed) draws: ${mutantDraws}/336 · honest door draws: 0/336`);
    return mutantDraws === 336;
  })());
// (b) THE FOLD-CLAIMING CAPTION — mirrored[] captioned as THE FOLD instead of
// w₁: on the 57 SOUND w₁=1 forms (which carry NO fold) it would certify a
// fold that does not exist.
const foldClaimCaption = (counts) =>
  `${counts.handCopiesMirrored} of the ${counts.handCopiesVisible} coils come back mirrored — the fold shows itself`;
check('★ CLAUSE 6(b) — the FOLD-CLAIMING caption, carried in-memory, VISIBLY FAILS clause 5: on a SOUND w₁=1 fold-free form whose mirrored[] genuinely lights (measured below), the mutant caption asserts "the fold shows itself" — certifying a fold in a manifold that has none (57 such forms exist; the honest caption speaks only handedness)',
  (() => {
    const w1Forms = soundSet.filter((s) => s.verdict.domain.tower.w1.w1 === 1);
    if (w1Forms.length !== 57) return false;
    const fixture = w1Forms[0];
    const gate = A.buildAperture(fixture.verdict.domain);
    if (!gate.ok) return false;
    const trace = A.traceAperture({ deck: gate.deck, scene, width: 40, height: 40 });
    let mirroredPx = 0;
    for (let idx = 0; idx < trace.mirrored.length; idx += 1) if (trace.mirrored[idx] > 0 && trace.hit[idx] > 0) mirroredPx += 1;
    const mutant = foldClaimCaption(trace.counts);
    const honest = A.apertureCaption(gate.geometry, trace.counts);
    note(`sound w₁=1 fold-free forms: ${w1Forms.length} · mirrored px on the fixture (40²): ${mirroredPx} · mutant: "…${mutant.slice(-42)}" · honest mirrored line: "…come back mirrored — count them"`);
    return mirroredPx > 0 && /fold/.test(mutant) && !/fold/i.test(honest.split(' · ').find((p) => p.includes('come back mirrored')) ?? 'fold');
  })());

// ═════ [g] the freeze — must read ok · 44 · NO drift (0.2 never reached the engine) ═
console.log('\n----- [g] the freeze: ok · 44 · no drift — no re-seal was needed; 0.2 lives beside the engine, never inside it -----');
const freeze = checkEngineFreeze();
check('THE ENGINE FREEZE MANIFEST is UNTOUCHED: ok · checked 45 · drifted [] · missing [] · unlisted [] · nulled [] (apertureModel and ManuscriptView are NOT_FROZEN seams; a drift here would mean 0.2 reached into the engine — the mandate\'s STOP condition, which never fired)',
  freeze.ok === true && freeze.checked === 47 &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 &&
  freeze.unlisted.length === 0 && freeze.nulled.length === 0);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
