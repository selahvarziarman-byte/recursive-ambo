#!/usr/bin/env node

// DIAGNOSTIC — THE EXIT (engineer-chartered 2026-07-16, re-charter of the DEAD
// SEAL_THE_SEAM; SEAL-BEFORE-BUILD — BUILT BLIND to `.handoff/SEAL_THE_EXIT.md`,
// SHA-256 a1587899…1049, natively measured; every pin below is the builder's
// own measurement).
//
// THE LAW THIS ENFORCES: A LOOP'S EXIT CONDITION MUST TEST EVERY WALL IT MUST
// CLEAR. connectedSum applies FOUR walls (:98 faces, :122 equal rims, :127
// distinct corners, :132 no parallel rim pair). Three seals died aiming at
// single walls: the chord seal targeted :98 and missed :127; the rim's exit
// tested :127 and missed :132; the seam seal aimed the wrong mechanism at
// :132 and would have broken a working payoff (RP²#RP² = the Klein). THE EXIT
// adds the one missing conjunct — the disk rim must be ENDPOINT-FAITHFUL
// (:132's own predicate, re-derived, never imported from the frozen wall) —
// and the loop simply bisects one pass deeper where needed.
//
// THE PAYOFFS, all measured here: T²#T² = THE GENUS-2 (χ=−2, orientable) ·
// RP²#RP² still the Klein (the clause the coder's stop saved) · Klein#Klein =
// cross-caps 4 · RP²#T² = cross-caps 3 (Dyck's surface — the engine's own
// answer, reported not assumed).
//
// BOTH WRONG MECHANISMS CARRIED IN-MEMORY (never from a git ref):
//   (a) the OLD EXIT (:127 only) — T² exits at 1 pass with 2 parallel pairs
//       and the sum visibly refuses at :132 (the mechanism at HEAD today);
//   (b) the SEW REWIRE (the dead seal's recipe: cut → disjoint-union →
//       sewBoundaryCircles) — RP²#RP² visibly refused (the Möbius rim will
//       not walk): the cure that would have broken the payoff, kept as a
//       permanent exhibit.
//
// NON-MOVEMENT: this build touches NOT_FROZEN surface only. connectedSum.ts
// (including :132), complexIdentification.ts and multiform.ts are pinned
// byte-identical to HEAD below.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
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

const { loadForm, assemble } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { executeCustomGlue } = req('src/playground/customGluing.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { connectedSum } = req('src/lib/connectedSum.ts');
const { bisectSurface, refineToDisk } = req('src/lib/surfaceRefinement.ts');
const { cutCell } = req('src/lib/cutOperation.ts');
const { materializeCutResult } = req('src/lib/materializeOperation.ts');
const { sewBoundaryCircles } = req('src/lib/complexIdentification.ts');

// the ONE plumbing read (pinned by name in the flagship's HEAD-read
// inventory): the three frozen engine files this build must NOT move
const headBlobOf = (file) => execSync(`git cat-file blob HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the exit: the loop already clears the wall — it just stopped one bisection short (blind concretes)\n');

// ═════ the fixtures — the zoo, born through the committed word ops ════════════════
const REV = 'reversing';
const PRES = 'preserving';
const WORDS = {
  'RP2-4gon': { n: 4, w: [{ edgeA: 0, edgeB: 2, mode: REV }, { edgeA: 1, edgeB: 3, mode: REV }], expectPasses: 1 },
  'RP2-2gon': { n: 2, w: [{ edgeA: 0, edgeB: 1, mode: REV }], expectPasses: 2 },
  'T2': { n: 4, w: [{ edgeA: 0, edgeB: 2, mode: PRES }, { edgeA: 1, edgeB: 3, mode: PRES }], expectPasses: 2 },
  'Klein': { n: 4, w: [{ edgeA: 0, edgeB: 2, mode: PRES }, { edgeA: 1, edgeB: 3, mode: REV }], expectPasses: 2 },
};
const bear = (kind, ns) => {
  const { n, w } = WORDS[kind];
  const poly = loadForm(nGon(n), ns);
  const born = executeCustomGlue(poly, poly.faces[0], w, null);
  return { poly, born };
};
const refine = (kind, ns) => {
  const fx = bear(kind, ns);
  const out = refineToDisk(fx.born, fx.poly);
  const disk = out.shape.faces.find((f) => f.id.endsWith(':disk'));
  return { ...fx, refined: out.shape, passes: out.refinement.passes, disk };
};
const pairKeyOf = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
// :132's own census, re-derived (never imported from the frozen wall): edge
// instances per unordered endpoint pair, counted along a face's rim
const rimParallelPairs = (shape, cycle) => {
  let bad = 0;
  for (let k = 0; k < cycle.length; k += 1) {
    const a = cycle[k];
    const b = cycle[(k + 1) % cycle.length];
    const instances = shape.edges.filter(
      (e) => (e.vertexIds[0] === a && e.vertexIds[1] === b) || (e.vertexIds[0] === b && e.vertexIds[1] === a),
    ).length;
    if (instances > 1) bad += 1;
  }
  return bad;
};
const shapeParallelPairs = (shape) => {
  const count = new Map();
  for (const e of shape.edges) {
    const key = pairKeyOf(e.vertexIds[0], e.vertexIds[1]);
    count.set(key, (count.get(key) ?? 0) + 1);
  }
  return [...count.values()].filter((c) => c > 1).length;
};
const invProj = (r) => ({
  chi: r.chi,
  chiCert: r.chiCertified,
  cls: r.classification,
  boundary: r.boundary,
  nonOrientable: r.cert ? r.cert.nonOrientable : null,
  b1: r.cert ? r.cert.b1 : null,
});

// ═════ [1] the exit tests every wall — all four forms, printed ════════════════════
console.log('----- [1] THE EXIT TESTS EVERY WALL: the four walls on the exit disk of ALL FOUR zoo forms (clause 1) -----');
const built = {};
check('★ EVERY WALL, EVERY FORM, PRINTED — on each exit disk: faces = 2 (:98 clears), disk-len = 3 on all four (:122 clears pairwise — any two zoo disks match automatically), all corners DISTINCT (:127), and ZERO parallel rim pairs (:132 — the conjunct the old exit never asked). Not the one read last: all four',
  Object.keys(WORDS).every((kind) => {
    const f = refine(kind, `x${kind}`);
    built[kind] = f;
    const distinct = new Set(f.disk.vertexIds).size === f.disk.vertexIds.length;
    const rimPar = rimParallelPairs(f.refined, f.disk.vertexIds);
    const shapePar = shapeParallelPairs(f.refined);
    note(`${kind}: faces=${f.refined.faces.length} · disk-len=${f.disk.vertexIds.length} · distinct=${distinct} · parallel rim pairs=${rimPar} (whole shape: ${shapePar})`);
    return f.refined.faces.length === 2 && f.disk.vertexIds.length === 3 && distinct && rimPar === 0;
  }));

// ═════ [2] the measured pass-counts ═══════════════════════════════════════════════
console.log('\n----- [2] THE LOOP TERMINATES — the pass-counts are the ENGINE\'s own numbers (clause 2) -----');
check('★ MEASURED pass-counts: RP²-4gon 1 · RP²-2gon 2 · T² 2 · Klein 2 — the engine agrees with the engineer\'s falsifier table (measured FIRST, pinned after; had the engine disagreed, the disagreement would be REPORTED, never tuned away). T²/Klein went 1 → 2: exactly the one pass that breaks their parallel halves h(a,1)/h(a,2)',
  Object.keys(WORDS).every((kind) => {
    note(`${kind}: passes=${built[kind].passes} (table says ${WORDS[kind].expectPasses})`);
    return built[kind].passes === WORDS[kind].expectPasses;
  }));

// ═════ [3] ★★ the genus-2 ═════════════════════════════════════════════════════════
console.log('\n----- [3] ★★ T² # T² = THE GENUS-2: the refusal before, the handle after (clause 3) -----');
// the OLD EXIT, carried in-memory (the mechanism at HEAD): bisect once, then
// cut the FIRST :127-satisfying chord — no parallel-rim question asked
const oldExitRefine = (kind, ns) => {
  const fx = bear(kind, ns);
  const one = bisectSurface(fx.born, fx.poly);
  const shape = one.shape;
  const cycle = shape.faces[0].vertexIds;
  const n = cycle.length;
  const rimPairs = new Set();
  for (let k = 0; k < n; k += 1) rimPairs.add(pairKeyOf(cycle[k], cycle[(k + 1) % n]));
  for (let i = 0; i < n; i += 1) {
    for (let d = 2; d <= n - 2; d += 1) {
      const j = (i + d) % n;
      const arc = [];
      for (let k = i; ; k = (k + 1) % n) {
        arc.push(cycle[k]);
        if (k === j) break;
      }
      if (new Set(arc).size !== arc.length) continue;
      if (cycle[i] === cycle[j]) continue;
      if (rimPairs.has(pairKeyOf(cycle[i], cycle[j]))) continue;
      const rest = [];
      for (let k = j; ; k = (k + 1) % n) {
        rest.push(cycle[k]);
        if (k === i) break;
      }
      const face = shape.faces[0];
      const mutant = {
        ...shape,
        edges: [
          ...shape.edges,
          { id: `mut:${ns}:chord`, vertexIds: [cycle[i], cycle[j]], sourceVertexIds: [cycle[i], cycle[j]] },
        ],
        faces: [
          { ...face, id: `${face.id}:disk`, vertexIds: arc },
          { ...face, id: `${face.id}:rest`, vertexIds: rest },
        ],
      };
      return { ...fx, refined: mutant, disk: mutant.faces[0], passes: 1 };
    }
  }
  throw new Error('mutant: the old exit found no :127 chord — cannot carry the mechanism');
};
check('★★ THE GENUS-2 LANDS. Before (the OLD EXIT carried in-memory — T² at 1 pass, its disk :127-clean): connectedSum REFUSES verbatim at the parallel-rim wall ("a rim carries PARALLEL edge instances… Subdivide first"). After (the committed refineToDisk, 2 passes): T² # T² SUCCEEDS — χ = −2 · χ_cert = −2 · w₁ = 0 (orientable) · "genus 2 (closed, orientable)" · closed · certified through the DIRECT translation. Adding a handle stops being an incantation',
  (() => {
    const oldA = oldExitRefine('T2', 'oldT2A');
    const oldB = oldExitRefine('T2', 'oldT2B');
    let refusal = null;
    try {
      connectedSum(oldA.refined, oldB.refined, { faceA: oldA.disk, faceB: oldB.disk });
    } catch (error) {
      refusal = error.message;
    }
    const A = refine('T2', 'g2A');
    const B = refine('T2', 'g2B');
    const sum = connectedSum(A.refined, B.refined, { faceA: A.disk, faceB: B.disk });
    const inv = readFormInvariants(sum.shape, [A.refined, B.refined]);
    note(`before: "${refusal ? refusal.slice(0, 96) : 'NO REFUSAL?!'}…"`);
    note(`after:  χ=${inv.chi} · χ_cert=${inv.chiCertified} · "${inv.classification}" · ${inv.boundary} · nonOrientable=${inv.cert ? inv.cert.nonOrientable : '?'} · b₁=${inv.cert ? inv.cert.b1 : '?'} · via ${inv.complexSource}`);
    return refusal !== null && refusal.includes('PARALLEL edge instances') && refusal.includes('Subdivide first') &&
      inv.chi === -2 && inv.chiCertified === -2 && inv.classification === 'genus 2 (closed, orientable)' &&
      inv.boundary === 'closed' && inv.cert !== null && inv.cert.nonOrientable === false && inv.complexSource === 'direct';
  })());

// ═════ [4] the saved regression ═══════════════════════════════════════════════════
console.log('\n----- [4] REGRESSION: RP² # RP² still yields THE KLEIN — the clause the stop saved (clause 4) -----');
check('★ RP² # RP² = THE KLEIN, unchanged: χ = 0 · "cross-caps 2 (closed, non-orientable)" · closed · via direct — on BOTH presentations (4-gon at 1 pass, 2-gon at 2). The dead seam seal\'s rewire would have turned THIS into a refusal; the exit leaves RP² byte-for-byte on its old path (its disks were already parallel-free)',
  (() => {
    const cases = [
      ['RP2-4gon', 'RP2-4gon'],
      ['RP2-2gon', 'RP2-2gon'],
    ];
    return cases.every(([ka, kb]) => {
      const A = refine(ka, `kA${ka}${kb}`);
      const B = refine(kb, `kB${ka}${kb}`);
      const sum = connectedSum(A.refined, B.refined, { faceA: A.disk, faceB: B.disk });
      const inv = readFormInvariants(sum.shape, [A.refined, B.refined]);
      note(`${ka} # ${kb}: χ=${inv.chi} · "${inv.classification}" · via ${inv.complexSource}`);
      return inv.chi === 0 && inv.classification === 'cross-caps 2 (closed, non-orientable)' &&
        inv.boundary === 'closed' && inv.complexSource === 'direct';
    });
  })());

// ═════ [5] Klein # Klein ══════════════════════════════════════════════════════════
console.log('\n----- [5] Klein # Klein succeeds (clause 5) -----');
check('Klein # Klein SUCCEEDS: χ = −2 · non-orientable ("cross-caps 4 (closed, non-orientable)") · closed · via direct',
  (() => {
    const A = refine('Klein', 'kkA');
    const B = refine('Klein', 'kkB');
    const sum = connectedSum(A.refined, B.refined, { faceA: A.disk, faceB: B.disk });
    const inv = readFormInvariants(sum.shape, [A.refined, B.refined]);
    note(`Klein # Klein: χ=${inv.chi} · "${inv.classification}" · nonOrientable=${inv.cert ? inv.cert.nonOrientable : '?'}`);
    return inv.chi === -2 && inv.classification === 'cross-caps 4 (closed, non-orientable)' &&
      inv.cert !== null && inv.cert.nonOrientable === true && inv.complexSource === 'direct';
  })());

// ═════ [6] ★ RP² # T² — the incantation, measured ═════════════════════════════════
console.log('\n----- [6] ★ RP² # T² — MEASURED AND REPORTED (clause 6) -----');
check('★ RP² # T² — the ENGINE\'s own answer, reported: χ = −1 · "cross-caps 3 (closed, non-orientable)" · closed · via direct. (The researcher\'s classification names this DYCK\'S SURFACE — three crosscaps; the engine\'s reading MATCHES it. This is the incantation that started the whole arc, now an executed op)',
  (() => {
    const A = refine('RP2-4gon', 'dyA');
    const B = refine('T2', 'dyB');
    const sum = connectedSum(A.refined, B.refined, { faceA: A.disk, faceB: B.disk });
    const inv = readFormInvariants(sum.shape, [A.refined, B.refined]);
    note(`RP² # T²: χ=${inv.chi} · χ_cert=${inv.chiCertified} · "${inv.classification}" · ${inv.boundary} · nonOrientable=${inv.cert ? inv.cert.nonOrientable : '?'} · b₁=${inv.cert ? inv.cert.b1 : '?'}`);
    return inv.chi === -1 && inv.chiCertified === -1 && inv.classification === 'cross-caps 3 (closed, non-orientable)' &&
      inv.boundary === 'closed' && inv.cert !== null && inv.cert.nonOrientable === true && inv.complexSource === 'direct';
  })());

// ═════ [7] subdivision invariance at the deeper counts ════════════════════════════
console.log('\n----- [7] SUBDIVISION INVARIANCE at the DEEPER pass-counts (clause 7) -----');
check('★ χ · w₁ · homology (b₁) · classification · boundary are BYTE-IDENTICAL before/after on ALL FOUR forms at their NEW pass-counts — before certifies through the committed replay RECOVERY, after through the DIRECT translation (the deeper exit leaves fully endpoint-faithful forms): two independent routes, one truth, now on the whole zoo',
  Object.keys(WORDS).every((kind) => {
    const f = built[kind];
    const before = readFormInvariants(f.born, [f.poly]);
    const after = readFormInvariants(f.refined, [f.poly]);
    const same = JSON.stringify(invProj(before)) === JSON.stringify(invProj(after));
    note(`${kind}: (${before.complexSource}→${after.complexSource}) ${JSON.stringify(invProj(after))} · identical=${same}`);
    return same && before.complexSource === 'recovered' && after.complexSource === 'direct';
  }));

// ═════ [8] both wrong mechanisms, in-memory ═══════════════════════════════════════
console.log('\n----- [8] THE MUTANTS: both wrong mechanisms carried in-memory, both visibly failing (clause 8) -----');
check('★ MUTANT (a) — THE OLD EXIT (:127 only, the mechanism at HEAD): T² exits at 1 pass, its disk is distinct-cornered, and the shape still carries 2 parallel endpoint pairs — the sum is VISIBLY REFUSED at :132 ("a rim carries PARALLEL edge instances… Subdivide first"). The wall was never wrong; the exit just never asked its question',
  (() => {
    const A = oldExitRefine('T2', 'muA');
    const B = oldExitRefine('T2', 'muB');
    const distinct = new Set(A.disk.vertexIds).size === A.disk.vertexIds.length;
    const parallels = shapeParallelPairs(A.refined);
    let refusal = null;
    try {
      connectedSum(A.refined, B.refined, { faceA: A.disk, faceB: B.disk });
    } catch (error) {
      refusal = error.message;
    }
    note(`old exit: passes=1 · disk distinct=${distinct} · shape parallel pairs=${parallels} · sum: "${refusal ? refusal.slice(0, 84) : 'SUCCEEDED?!'}…"`);
    return distinct && parallels === 2 && refusal !== null &&
      refusal.includes('PARALLEL edge instances') && refusal.includes('Subdivide first');
  })());
check('★ MUTANT (b) — THE SEW REWIRE (the DEAD seal 50fda3f4\'s own recipe, in-memory: cut both rims → assemble the disjoint union with NO merges → sewBoundaryCircles): RP² # RP² is VISIBLY REFUSED — the punctured Möbius piece\'s free skeleton does not walk coherently. The killed hypothesis, kept as a permanent exhibit: this cure would have broken the working payoff that clause [4] just re-proved',
  (() => {
    const A = refine('RP2-4gon', 'swA');
    const B = refine('RP2-4gon', 'swB');
    const punc = (f) => materializeCutResult(f.refined, cutCell(f.refined, f.disk));
    const pA = punc(A);
    const pB = punc(B);
    const union = assemble([pA, pB], { merges: [] }).shape;
    let refusal = null;
    try {
      sewBoundaryCircles(union, 'preserving', 0, 1, [pA, pB, A.refined, B.refined, A.born, B.born, A.poly, B.poly]);
    } catch (error) {
      refusal = error.message;
    }
    note(`the dead seal's recipe on the payoff pair: "${refusal ? refusal.slice(0, 96) : 'SUCCEEDED?!'}…"`);
    return refusal !== null && refusal.includes('not a disjoint union of coherent circles');
  })());

// ═════ [9] non-movement ═══════════════════════════════════════════════════════════
console.log('\n----- [9] NON-MOVEMENT: the frozen engine did not move (clause 9) -----');
check('connectedSum.ts (including :132 — NOT deleted, NOT relaxed), complexIdentification.ts and multiform.ts are CR-insensitively BYTE-IDENTICAL to HEAD — this build touched NOT_FROZEN surface only (surfaceRefinement.ts and witnesses)',
  ['src/lib/connectedSum.ts', 'src/lib/complexIdentification.ts', 'src/lib/multiform.ts'].every(
    (file) => sha256OfCrStripped(fs.readFileSync(path.join(repoRoot, file), 'utf8')) === sha256OfCrStripped(headBlobOf(file)),
  ));

// ═════ [10] the freeze reads ok ═══════════════════════════════════════════════════
console.log('\n----- [10] the freeze is green (no manifest motion in this build) -----');
const freeze = checkEngineFreeze(repoRoot);
check('THE ENGINE FREEZE reads ok with zero drift, zero missing, zero unlisted, zero nulled — no frozen file moved, so no manifest hash was re-sealed (the count stays the flagship\'s to pin)',
  freeze.ok);

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
