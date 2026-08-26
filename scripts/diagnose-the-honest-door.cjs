#!/usr/bin/env node

// DIAGNOSTIC — B.0 · THE HONEST DOOR (engineer-chartered 2026-07-15,
// researcher-ruled: THE ENGINE IS EUCLIDEAN · mothership-ratified;
// SEAL-BEFORE-BUILD — BUILT BLIND to `.handoff/SEAL_THE_DOOR_STOPS_LYING.md`,
// SHA-256 fab02d7e…e77e2, natively confirmed against the on-repo record
// docs/governance/PLATONIC_ENGINE_B0_HONEST_DOOR_SEALED_HASH.txt; every pin
// below is the builder's own measurement).
//
// THE LIE THIS KILLS (LAW 15 — a necessary condition is not a verdict):
// geometryFromTower read k = edgeLinks[].memberEdgeIds.length — the EDGE-CLASS
// SIZE — and called k<4 "S³", k>4 "H³", non-uniform "mixed"; buildAperture then
// refused every sound form whose kind was not E3: "the recession law reads S³
// — only the E³ transport is built; nothing is drawn." But the engine's cube
// is Euclidean (90° dihedrals, ambient ℝ³ isometries): cube/~ is ALWAYS a
// Euclidean cone-manifold, and a k≠4 class is a CONE EDGE at angle k×90° —
// never a curved ambient. The door named a geometry the substrate cannot hold
// and refused 36 of the 79 sound forms for it. B.0 deletes ONE refusal and
// relabels; ⛔ THE TRANSPORT IS UNCHANGED (the cell-local face-map step
// p←g(p), v←R·v IS the geodesic flow on a Euclidean cone-manifold — ratified).
//
// SCOPE: B.0 = the 36 SOUND cone forms. The 97 FOLDED forms stay refused
// upstream at buildPersonDomainVerdict with no domain (their body is 0.2).
//
// THE CLAUSES: 1 DRAWS (79 ok, the 36 newly-drawn are exactly the sound k≠4
// set) · 2 NO LIE (512-sweep strings free of S³/H³/spherical/hyperbolic) ·
// 3 HONEST CONE ANGLES (the {2,2,4,4} cone form: cone edges at 180°; traces
// non-empty) · 4 NON-MOVEMENT (flat forms: label + trace buffers byte-identical
// to the HEAD-compiled reader) · 5 FOLDED UNTOUCHED (verdicts byte-identical;
// none draws) · 6 ★ BOTH WRONG MECHANISMS CARRIED IN-MEMORY (the kept-refusal
// gate draws only 43; the S³-emitting labeler trips the no-lie sweep — both
// cross-validated against the real HEAD mechanism while the window is open).
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
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));

const { createSeedShape } = req('src/data/seeds.ts');
const A = req('src/manuscript/apertureModel.ts');
const P = req('src/manuscript/apertureProbes.ts');

// the ONE plumbing read (pinned by name in the flagship's HEAD-read inventory)
const headBlobOf = (file) => execSync(`git cat-file blob HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

console.log('the honest door: stop naming a geometry the engine cannot hold — a sound cone form draws, and the label tells the truth about the cone edge (blind concretes)\n');

const cube = createSeedShape('cube');
const f = (k) => `face:cube:${k}`;
const AXES = [['left', 'right'], ['front', 'back'], ['bottom', 'top']];
const menus = AXES.map(([a, b]) => A.dihedralMapCandidates(cube, f(a), f(b)));
const rowsFor = (i, j, k) => AXES.map(([a, b], idx) => ({ faceA: f(a), faceB: f(b), candidateKey: menus[idx][[i, j, k][idx]].key }));
const keyOf = (i, j, k) => `${menus[0][i].key}|${menus[1][j].key}|${menus[2][k].key}`;

// the HEAD-compiled aperture reader — the REAL pre-B.0 mechanism, compiled
// in-memory from the committed blob (its imports resolve through the hook to
// working modules; the engine files it reads through are byte-identical to
// HEAD — asserted by the standing witnesses)
const HEAD_A = (() => {
  const src = headBlobOf('src/manuscript/apertureModel.ts');
  const m = new Module.Module('apertureModel.head.ts');
  m.filename = path.join(repoRoot, 'src/manuscript/__head_apertureModel.ts');
  m.paths = Module.Module._nodeModulePaths(path.dirname(m.filename));
  m._compile(ts.transpileModule(src, { ...TRANSPILE_OPTIONS, fileName: m.filename }).outputText, m.filename);
  return m.exports;
})();
const headIsPreB0 = (() => {
  const probe = { gate: { edgeLinks: [{ memberEdgeIds: [1, 2, 3] }, { memberEdgeIds: [1, 2, 3] }] } };
  return /S³|S3/.test(HEAD_A.geometryFromTower(probe).label);
})();
note(`HEAD reader state: ${headIsPreB0 ? 'pre-B.0 (still names S³ — the window is open)' : 'post-B.0 (the commit landed)'}`);

// ═════ the 512 sweep, once — every leg reads from it ═════════════════════════════
const sweep = [];
for (let i = 0; i < 8; i += 1) for (let j = 0; j < 8; j += 1) for (let k = 0; k < 8; k += 1) {
  const rows = rowsFor(i, j, k);
  const verdict = A.buildPersonDomainVerdict(cube, rows, 'hd', 'honest-door');
  sweep.push({ combo: [i, j, k], rows, verdict });
}
const foldedSet = sweep.filter((s) => s.verdict.folded);
const soundSet = sweep.filter((s) => !s.verdict.folded && s.verdict.domain.tower.sound);
const flatSet = soundSet.filter((s) => A.geometryFromTower(s.verdict.domain.tower).kind === 'E3');
const coneSet = soundSet.filter((s) => A.geometryFromTower(s.verdict.domain.tower).kind === 'cone');

// ═════ [a] CLAUSE 1 — DRAWS: all 79 sound forms through the gate, deck fit, non-empty trace ══
console.log('----- [a] ★ DRAWS: every sound form is ok through the gate; the 36 newly-drawn are exactly the sound k≠4 set (clause 1) -----');
const probes = P.buildProbeMeshes();
const probeList = [...probes.maskShells, probes.hand];
let okCount = 0;
let deckOk = 0;
let tracedNonEmpty = 0;
const newlyDrawn = [];
for (const s of soundSet) {
  const gate = A.buildAperture(s.verdict.domain);
  if (!gate.ok) continue;
  okCount += 1;
  if (gate.deck.length > 0) deckOk += 1;
  const g = A.geometryFromTower(s.verdict.domain.tower);
  if (g.kind === 'cone') newlyDrawn.push(s);
  // a small trace must be non-empty (the transport draws the cone form)
  const scene = A.buildApertureScene(cube, null, probeList);
  const trace = A.traceAperture({ deck: gate.deck, scene, width: 20, height: 20 });
  if (trace.counts.litPixels > 0) tracedNonEmpty += 1;
}
check('★ CLAUSE 1 — ALL 79 SOUND FORMS DRAW: buildAperture ok on every one (was 43), the deck fits every one (deckOf refused none — the engineer\'s measurement confirmed), and a small trace is NON-EMPTY on every one; the newly-drawn are EXACTLY the 36 sound k≠4 forms',
  soundSet.length === 79 && okCount === 79 && deckOk === 79 && tracedNonEmpty === 79 &&
  newlyDrawn.length === 36 && coneSet.length === 36 && flatSet.length === 43 &&
  newlyDrawn.every((s) => A.geometryFromTower(s.verdict.domain.tower).n.some((v) => v !== 4)));
note(`sound ${soundSet.length} · gate-ok ${okCount} · deck-ok ${deckOk} · traced non-empty ${tracedNonEmpty} · newly drawn ${newlyDrawn.length} (flat ${flatSet.length})`);

// ═════ [b] CLAUSE 2 — NO LIE: 512 pairings' strings carry no curved-geometry name ═
console.log('\n----- [b] ★ NO LIE: labels, captions, refusal reasons and walls across all 512 — zero curved-geometry names (clause 2) -----');
const FORBIDDEN = /S³|H³|S3\b|H3\b|spherical|hyperbolic/;
check('★ CLAUSE 2 — across ALL 512 door pairings, no person-facing string names a curved geometry: every sound form\'s label and caption, every unsound refusal reason, every folded wall — zero matches for S³ · H³ · S3 · H3 · spherical · hyperbolic',
  (() => {
    let checked = 0;
    for (const s of sweep) {
      if (s.verdict.folded) {
        if (FORBIDDEN.test(s.verdict.wall)) return false;
        checked += 1;
        continue;
      }
      const domain = s.verdict.domain;
      const g = A.geometryFromTower(domain.tower);
      if (FORBIDDEN.test(g.label)) return false;
      const gate = A.buildAperture(domain);
      if (!gate.ok && FORBIDDEN.test(gate.reason)) return false;
      if (gate.ok) {
        const caption = A.apertureCaption(gate.geometry, {
          transports: 0, litPixels: 0, lostRays: 0, maskCopiesVisible: 0,
          handCopiesVisible: 0, handCopiesMirrored: 0, formCopiesVisible: 0,
          formCopiesMirrored: 0, minCopyPixels: 0,
        });
        if (FORBIDDEN.test(caption)) return false;
      }
      checked += 1;
    }
    note(`strings swept: ${checked} pairings (labels · captions · reasons · walls)`);
    return checked === 512;
  })());

// ═════ [c] CLAUSE 3 — HONEST CONE ANGLES on the mandate's fixture ═════════════════
// B-106 §3 (the key-drift cure): the fixture's IDENTITY is its three MAPS —
// the corner correspondences a person reads in the menu — never the
// enumeration keys that once reached them. The old spelling was
// ["d+0","d+0","d+0"] with the title 'd+0 cubed': a candidate re-enumeration
// would have made this leg test a DIFFERENT form while its k-profile assert
// possibly still passed on another — the subject moving under a standing
// witness. Selection is now BY MAP CONTENT (order-free over the map object,
// the rowFor idiom); the key rides as plumbing; an absent or ambiguous match
// THROWS LOUD — the form under test changed, and the witness must go red.
const mapByContent = (a, b, pairs) => {
  const want = Object.entries(pairs);
  const menu = A.dihedralMapCandidates(cube, f(a), f(b));
  const hits = menu.filter((c) =>
    Object.keys(c.map).length === want.length &&
    want.every(([x, y]) => c.map[`vertex:cube:${x}`] === `vertex:cube:${y}`));
  if (hits.length !== 1) {
    throw new Error(
      `the pinned fixture map {${want.map(([x, y]) => `${x}→${y}`).join(' · ')}} on ${a}~${b}: ` +
      `${hits.length} menu candidates match — the form under test changed`,
    );
  }
  return hits[0];
};
// the three reversing axis maps, spelled in the cube's own corner words
const FIXTURE_MAPS = [
  ['left', 'right', { d: 'b', a: 'c', e: 'g', h: 'f' }],
  ['front', 'back', { a: 'c', b: 'd', f: 'h', e: 'g' }],
  ['bottom', 'top', { a: 'e', d: 'f', c: 'g', b: 'h' }],
];
console.log('\n----- [c] the fixture d→b·a→c·e→g·h→f / a→c·b→d·f→h·e→g / a→e·d→f·c→g·b→h (k profile [2,2,4,4]): cone edges at 180° and NOTHING else; the transport traces it (clause 3) -----');
const fixtureRows = FIXTURE_MAPS.map(([a, b, pairs]) => ({ faceA: f(a), faceB: f(b), candidateKey: mapByContent(a, b, pairs).key }));
const fixtureVerdict = A.buildPersonDomainVerdict(cube, fixtureRows, 'fx', 'the {2,2,4,4} cone form');
check('★ CLAUSE 3 — HONEST CONE ANGLES: the fixture form (three reversing axis maps, selected by content) is sound with k = {2,2,4,4}; its label reads "Euclidean cone-manifold" with cone edges 2 × 180° and NO OTHER angle (the two k=4 classes are flat, not cones — the only ° in the label is 180°); the gate is ok and a small trace is NON-EMPTY',
  (() => {
    if (fixtureVerdict.folded || !fixtureVerdict.domain.tower.sound) return false;
    const g = A.geometryFromTower(fixtureVerdict.domain.tower);
    const angles = [...g.label.matchAll(/(\d+)°/g)].map((m) => m[1]);
    const gate = A.buildAperture(fixtureVerdict.domain);
    if (!gate.ok) return false;
    const scene = A.buildApertureScene(cube, null, probeList);
    const trace = A.traceAperture({ deck: gate.deck, scene, width: 24, height: 24 });
    note(`label: "${g.label}" · caption head: "${A.apertureCaption(g, trace.counts).split(' · ').slice(0, 3).join(' · ')}" · lit ${trace.counts.litPixels}/${24 * 24}`);
    return g.kind === 'cone' &&
      [...g.n].sort((a, b) => a - b).join(',') === '2,2,4,4' &&
      g.coneEdges === '2 × 180°' &&
      angles.length > 0 && angles.every((a) => a === '180') &&
      trace.counts.litPixels > 0;
  })());

// ═════ [d] CLAUSE 4 — NON-MOVEMENT: the 43 flat forms byte-identical to HEAD ══════
console.log('\n----- [d] ★ NON-MOVEMENT: every uniform-k=4 sound form — label AND trace buffers byte-identical to the HEAD-compiled reader (clause 4) -----');
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
check('★ CLAUSE 4 — the 43 FLAT forms did not move: for every uniform-k=4 sound form, the working label EQUALS the HEAD-compiled label byte-for-byte, and a small trace\'s buffers (hit · value · echo · mirrored · material · depth · normal) hash IDENTICALLY through both readers',
  (() => {
    let mismatches = 0;
    for (const s of flatSet) {
      const g = A.geometryFromTower(s.verdict.domain.tower);
      const gHead = HEAD_A.geometryFromTower(s.verdict.domain.tower);
      if (g.label !== gHead.label || g.kind !== 'E3' || gHead.kind !== 'E3') { mismatches += 1; continue; }
      const gate = A.buildAperture(s.verdict.domain);
      const gateHead = HEAD_A.buildAperture(s.verdict.domain);
      if (!gate.ok || !gateHead.ok) { mismatches += 1; continue; }
      const scene = A.buildApertureScene(cube, null, probeList);
      const sceneHead = HEAD_A.buildApertureScene(cube, null, probeList);
      const t = A.traceAperture({ deck: gate.deck, scene, width: 16, height: 16 });
      const tHead = HEAD_A.traceAperture({ deck: gateHead.deck, scene: sceneHead, width: 16, height: 16 });
      if (hashTrace(t) !== hashTrace(tHead)) mismatches += 1;
    }
    note(`flat forms compared: ${flatSet.length} · mismatches: ${mismatches}`);
    return flatSet.length === 43 && mismatches === 0;
  })());

// ═════ [e] CLAUSE 5 — FOLDED UNTOUCHED: no body, verdicts byte-identical ══════════
console.log('\n----- [e] the 97 folded forms: no domain, no draw, verdict byte-identical to HEAD (clause 5 — their body is 0.2, not B.0) -----');
check('CLAUSE 5 — FOLDED UNTOUCHED: all 97 folded pairings still return a FOLDED verdict with NO domain (nothing to draw — buildAperture is unreachable for them), and each verdict\'s JSON is byte-identical through the HEAD-compiled reader',
  (() => {
    let mismatches = 0;
    for (const s of foldedSet) {
      const headVerdict = HEAD_A.buildPersonDomainVerdict(cube, s.rows, 'hd', 'honest-door');
      const strip = (v) => JSON.stringify({ folded: v.folded, chi: v.chi, classes: v.foldedEdgeClasses, wall: v.wall });
      if (!s.verdict.folded || !headVerdict.folded || strip(s.verdict) !== strip(headVerdict)) mismatches += 1;
    }
    note(`folded verdicts compared: ${foldedSet.length} · mismatches: ${mismatches}`);
    return foldedSet.length === 97 && mismatches === 0;
  })());

// ═════ [f] ★ CLAUSE 6 — both wrong mechanisms, carried in-memory ══════════════════
console.log('\n----- [f] ★ the carried mutants: the kept refusal draws only 43; the S³-emitting labeler trips the no-lie sweep (clause 6) -----');
// (a) THE KEPT-REFUSAL GATE — the pre-B.0 door, carried verbatim in shape:
// gate ok AND kind !== E3 ⇒ refuse with the old sentence.
const oldLabelOf = (tower) => {
  // the pre-B.0 geometryFromTower, carried verbatim in shape (the labels the
  // door used to speak — S³ off an edge count)
  const n = tower.gate.edgeLinks.map((link) => link.memberEdgeIds.length);
  const uniform = n.length > 0 && n.every((v) => v === n[0]);
  if (uniform && n[0] === 4) return { kind: 'E3', label: `E³ — n=[${n.join(',')}] · 2π/4 = the cube's 90° dihedral` };
  if (uniform && n[0] < 4) return { kind: 'S3', label: `S³ — n=[${n.join(',')}] · angle deficit (2π/${n[0]} > 90°)` };
  if (uniform) return { kind: 'H3', label: `H³ — n=[${n.join(',')}] · angle excess (2π/${n[0]} < 90°)` };
  return { kind: 'mixed', label: `mixed — n=[${n.join(',')}] · no single ambient satisfies the recession law` };
};
const keptRefusalGate = (domain) => {
  const g = oldLabelOf(domain.tower);
  if (g.kind !== 'E3') {
    return { ok: false, reason: `the recession law reads ${g.label} — only the E³ transport is built; nothing is drawn.` };
  }
  return A.buildAperture(domain);
};
check('★ CLAUSE 6(a) — the KEPT-REFUSAL gate, carried in-memory, VISIBLY FAILS clause 1: it draws only 43 of the 79 sound forms (the 36 cone forms refused with the old sentence) — the mechanism B.0 deleted, still deleting light',
  (() => {
    let drawable = 0;
    for (const s of soundSet) if (keptRefusalGate(s.verdict.domain).ok) drawable += 1;
    note(`kept-refusal gate draws: ${drawable}/79 (the honest gate: 79/79)`);
    return drawable === 43;
  })());
check('★ CLAUSE 6(b) — the S³-EMITTING labeler, carried in-memory, VISIBLY TRIPS clause 2: on the sound n=[3,3,3,3] forms its label contains "S³" (the exact string the no-lie sweep forbids) — where the honest labeler names a Euclidean cone-manifold at 4 × 270°',
  (() => {
    const s333 = soundSet.find((s) => A.geometryFromTower(s.verdict.domain.tower).n.every((v) => v === 3));
    if (!s333) return false;
    const mutantLabel = oldLabelOf(s333.verdict.domain.tower).label;
    const honestLabel = A.geometryFromTower(s333.verdict.domain.tower).label;
    note(`mutant: "${mutantLabel.slice(0, 60)}" · honest: "${honestLabel.slice(0, 72)}"`);
    return FORBIDDEN.test(mutantLabel) && !FORBIDDEN.test(honestLabel) &&
      honestLabel.includes('Euclidean cone-manifold') && honestLabel.includes('4 × 270°');
  })());
// fidelity, while the window is open: pre-commit the HEAD reader IS the old
// mechanism — the carried mutants must agree with it byte-for-byte on labels
// and refusal verdicts; post-commit HEAD is the honest door and the mutants
// ride alone (proven-not-strawman in the closed window).
check('…and the carried mutants are REAL, not strawmen: pre-commit, the HEAD-compiled reader\'s labels agree byte-for-byte with the carried old labeler on ALL 79 sound forms, and its gate verdicts (ok/refusal-reason) agree with the kept-refusal gate on all 79; post-commit, HEAD equals the working honest door on the same surface',
  (() => {
    let agree = 0;
    for (const s of soundSet) {
      const tower = s.verdict.domain.tower;
      if (headIsPreB0) {
        const headLabel = HEAD_A.geometryFromTower(tower).label;
        const headGate = HEAD_A.buildAperture(s.verdict.domain);
        const mutGate = keptRefusalGate(s.verdict.domain);
        const gateAgrees = headGate.ok === mutGate.ok && (headGate.ok || headGate.reason === mutGate.reason);
        if (headLabel === oldLabelOf(tower).label && gateAgrees) agree += 1;
      } else {
        const headLabel = HEAD_A.geometryFromTower(tower).label;
        const headGate = HEAD_A.buildAperture(s.verdict.domain);
        const workGate = A.buildAperture(s.verdict.domain);
        if (headLabel === A.geometryFromTower(tower).label && headGate.ok === workGate.ok) agree += 1;
      }
    }
    note(`fidelity surface: ${agree}/79 agree (${headIsPreB0 ? 'vs the shipped old mechanism — the window' : 'vs the committed honest door'})`);
    return agree === 79;
  })());

// ═════ [g] the freeze — and the file's honest classification ═════════════════════
console.log('\n----- [g] the freeze holds; apertureModel rides as NOT_FROZEN (its classification at this baseline — see the handback disclosure) -----');
const freeze = checkEngineFreeze();
check('THE ENGINE FREEZE MANIFEST: ok at 45 · drifted [] · missing [] · unlisted [] · nulled [] (apertureModel.ts is classified NOT_FROZEN at this baseline — no hash line exists to move; the mandate\'s premise that it is frozen is handed back as a disclosure)',
  freeze.ok === true && freeze.checked === 46 &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 &&
  freeze.unlisted.length === 0 && freeze.nulled.length === 0);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
