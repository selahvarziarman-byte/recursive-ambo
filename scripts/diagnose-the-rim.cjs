#!/usr/bin/env node

// DIAGNOSTIC — THE RIM (engineer-chartered 2026-07-16, mothership-chartered
// ARC 0.0 REFINE · researcher-defined 1600; SEAL-BEFORE-BUILD — BUILT BLIND to
// `.handoff/SEAL_THE_RIM.md`, SHA-256 e5e2e7fb…4dde, natively measured; every
// pin below is the builder's own measurement).
//
// THE LIE THIS KILLS (LAW 14 at level 2): connectedSum names "Subdivide
// first" at FOUR walls and no subdivision existed — the whole polygon-word
// zoo (RP², T², Klein), which is what the person actually begets, could not
// be summed at all. The chord seal (c7918d3c — DEAD) targeted the single-face
// wall and never read the quotient-cycle wall two lines below it; the coder's
// stop killed it. THE CURE IS THE PAIR, and the order is the whole of it:
// BISECT until the rim can spare a distinct-cornered disk, THEN CHORD.
//
// Neither half works alone — the seal's spine, carried as mutants below:
//   (a) CHORD alone: mints no vertex → the class count is frozen → every
//       sub-face repeats a corner → :129 refuses (the pigeonhole).
//   (b) BISECTION alone: the bisected RP² rim is [p,m_a,q,m_b,p,m_a,q,m_b] —
//       still repeats → :129 refuses.
//
// REFINE IS NOT A BIRTH: same id, same genealogy, zero DAG nodes, zero
// pentimenti, type-claim 'resolution', carrier surjective new→old.
//
// ⚠ MEASURED, NOT SOURCED: the pass-counts below are the ENGINE's own numbers
// (the researcher's table predicted them from the word alone; the engine
// agrees — had it disagreed, the engine wins and the seal gets re-cut).
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

const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { executeCustomGlue } = req('src/playground/customGluing.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { connectedSum } = req('src/lib/connectedSum.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');
const { bisectSurface, refineToDisk } = req('src/lib/surfaceRefinement.ts');

// the ONE plumbing read (pinned by name in the flagship's HEAD-read inventory):
// the L3 sibling's byte-identity — the rim is additive, never a refactor
const headBlobOf = (file) => execSync(`git cat-file blob HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the rim: bisect until the rim can spare a distinct-cornered disk, then cut it — and the crosscap becomes a gesture (blind concretes)\n');

// ═════ the fixtures — the zoo, born through the committed word ops ════════════════
const bear = (nSides, word, ns) => {
  const poly = loadForm(nGon(nSides), ns);
  return { born: executeCustomGlue(poly, poly.faces[0], word, null), parent: poly };
};
const REV = 'reversing';
const PRES = 'preserving';
const FIXTURES = {
  'RP2-4gon': { ...bear(4, [{ edgeA: 0, edgeB: 2, mode: REV }, { edgeA: 1, edgeB: 3, mode: REV }], 'rimR4'), expectPasses: 1 },
  'RP2-2gon': { ...bear(2, [{ edgeA: 0, edgeB: 1, mode: REV }], 'rimR2'), expectPasses: 2 },
  // T²/Klein pass-counts moved 1 → 2 under THE EXIT (re-charter, seal
  // a1587899…1049): the exit now also demands a parallel-free disk rim
  // (:132's predicate), and their pass-1 halves still share endpoint pairs
  'T2': { ...bear(4, [{ edgeA: 0, edgeB: 2, mode: PRES }, { edgeA: 1, edgeB: 3, mode: PRES }], 'rimT4'), expectPasses: 2 },
  'Klein': { ...bear(4, [{ edgeA: 0, edgeB: 2, mode: PRES }, { edgeA: 1, edgeB: 3, mode: REV }], 'rimK4'), expectPasses: 2 },
};
const invProj = (r) => ({ chi: r.chi, chiCert: r.chiCertified, cls: r.classification, boundary: r.boundary });

// ═════ [a] the loop terminates; the pass-counts are the engine's own ══════════════
console.log('----- [a] the loop terminates and its pass-count is MEASURED against the gate\'s own rule (clause 1) -----');
const refined = {};
check('★ THE LOOP TERMINATES on all four zoo forms at THE EXIT\'s full rule (distinct corners AND a parallel-free rim), and the MEASURED pass-counts are RP²-4gon 1 · RP²-2gon 2 · T² 2 · Klein 2 (the rim charter measured 1/2/1/1 under the :127-only exit; THE EXIT re-charter deepened T²/Klein by exactly the one pass that breaks their parallel halves) — each result carries exactly TWO faces (the disk and the remainder) and a chord between distinct corners',
  Object.entries(FIXTURES).every(([name, fx]) => {
    const out = refineToDisk(fx.born, fx.parent);
    refined[name] = out;
    const disk = out.shape.faces.find((f) => f.id.endsWith(':disk'));
    const ok = out.refinement.passes === fx.expectPasses &&
      out.shape.faces.length === 2 &&
      out.refinement.chordEdgeId !== null &&
      disk !== undefined && new Set(disk.vertexIds).size === disk.vertexIds.length;
    note(`${name}: passes=${out.refinement.passes} (expected ${fx.expectPasses}) · faces=${out.shape.faces.length} · disk distinct=${disk ? new Set(disk.vertexIds).size === disk.vertexIds.length : '—'}`);
    return ok;
  }));

// ═════ [b] ★ subdivision invariance ═══════════════════════════════════════════════
console.log('\n----- [b] ★ SUBDIVISION INVARIANCE: χ on all four; the full certified readout where the reader can read (clause 2) -----');
check('★ χ IS BYTE-IDENTICAL before/after on ALL FOUR forms (RP²-4gon 1→1 · RP²-2gon 1→1 · T² 0→0 · Klein 0→0) — bisection adds one vertex and one edge per class and the chord adds one edge and one face: χ cannot move, and it did not',
  Object.entries(FIXTURES).every(([name, fx]) => {
    const before = readFormInvariants(fx.born, [fx.parent]);
    const after = readFormInvariants(refined[name].shape, [fx.parent]);
    return before.chi === after.chi;
  }));
check('★ THE FULL CERTIFIED READOUT (χ_cert · classification · boundary) is BYTE-IDENTICAL before/after on BOTH RP² presentations — before it certifies through the committed replay RECOVERY, after through the DIRECT translation (the refinement made the complex endpoint-faithful): two independent routes, one truth — "cross-caps 1 (closed, non-orientable)", χ 1, closed',
  ['RP2-4gon', 'RP2-2gon'].every((name) => {
    const fx = FIXTURES[name];
    const before = readFormInvariants(fx.born, [fx.parent]);
    const after = readFormInvariants(refined[name].shape, [fx.parent]);
    const ok = JSON.stringify(invProj(before)) === JSON.stringify(invProj(after)) &&
      before.complexSource === 'recovered' && after.complexSource === 'direct' &&
      after.classification === 'cross-caps 1 (closed, non-orientable)';
    note(`${name}: before(${before.complexSource}) ≡ after(${after.complexSource}): ${JSON.stringify(invProj(after))}`);
    return ok;
  }));
check('…and the T²/Klein AFTER-forms no longer hit the endpoint-keyed reader debt — THE EXIT re-charter (seal a1587899…1049) cleared it BY DEPTH: the deeper exit leaves ZERO parallel endpoint pairs (the pass-1 halves h(a,1)/h(a,2) that used to collide are split by pass 2), so the DIRECT translation reads them and the FULL certified readout (χ_cert · classification · boundary) is BYTE-IDENTICAL before/after — the debt survives only for shallower outputs (a single bisectSurface pass), and the certified-invariance battery now covers ALL FOUR forms',
  ['T2', 'Klein'].every((name) => {
    const fx = FIXTURES[name];
    const before = readFormInvariants(fx.born, [fx.parent]);
    const after = readFormInvariants(refined[name].shape, [fx.parent]);
    const pairCount = new Map();
    for (const e of refined[name].shape.edges) {
      const [a, b] = e.vertexIds;
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      pairCount.set(key, (pairCount.get(key) ?? 0) + 1);
    }
    const parallels = [...pairCount.values()].filter((c) => c > 1).length;
    note(`${name}: readout(${before.complexSource}→${after.complexSource}) ≡ ${JSON.stringify(invProj(after))} · parallel endpoint pairs: ${parallels}`);
    return JSON.stringify(invProj(before)) === JSON.stringify(invProj(after)) &&
      before.complexSource === 'recovered' && after.complexSource === 'direct' && parallels === 0;
  }));

// ═════ [c] ★ the refusal dies — RP² + RP² = Klein ════════════════════════════════
console.log('\n----- [c] ★ THE REFUSAL DIES: the sum refuses at HEAD; after the pair it yields the Klein bottle (clause 3) -----');
const sumA = { ...bear(4, [{ edgeA: 0, edgeB: 2, mode: REV }, { edgeA: 1, edgeB: 3, mode: REV }], 'sumA'), name: 'A' };
const sumB = { ...bear(4, [{ edgeA: 0, edgeB: 2, mode: REV }, { edgeA: 1, edgeB: 3, mode: REV }], 'sumB'), name: 'B' };
check('★ connectedSum(RP², RP²) REFUSES at HEAD with the single-face wall verbatim ("has a single face — cutting its only face leaves no surface. Subdivide first") — and after refineToDisk on EACH operand (disks passed as the cut faces), it SUCCEEDS and yields THE KLEIN BOTTLE: "cross-caps 2 (closed, non-orientable)" · χ = 0 · certified through the DIRECT translation — the connected sum of two projective planes, as the mandate pins',
  (() => {
    let refusal = null;
    try {
      connectedSum(sumA.born, sumB.born);
    } catch (error) {
      refusal = error.message;
    }
    if (!refusal || !refusal.includes('has a single face') || !refusal.includes('Subdivide first')) return false;
    const ra = refineToDisk(sumA.born, sumA.parent);
    const rb = refineToDisk(sumB.born, sumB.parent);
    const sum = connectedSum(ra.shape, rb.shape, {
      faceA: ra.shape.faces.find((f) => f.id.endsWith(':disk')),
      faceB: rb.shape.faces.find((f) => f.id.endsWith(':disk')),
    });
    const inv = readFormInvariants(sum.shape);
    note(`before: "${refusal.slice(0, 96)}…"`);
    note(`after:  χ=${inv.chi} · χ_cert=${inv.chiCertified} · "${inv.classification}" · ${inv.boundary} · via ${inv.complexSource}`);
    return inv.chi === 0 && inv.chiCertified === 0 &&
      inv.classification === 'cross-caps 2 (closed, non-orientable)' && inv.boundary === 'closed';
  })());

// ═════ [d] refine is NOT a birth ══════════════════════════════════════════════════
console.log('\n----- [d] NOT A BIRTH: zero genealogy nodes, zero pentimenti, ancestry intact, type-claim resolution, carrier surjective (clause 4) -----');
// RECUT (REFINE'S WORD, 2026-07-29 — the ruled ★E1/★E3 movers): the old pin
// "genealogy BYTE-IDENTICAL" described the NAMELESS state (no 'refine' on the
// frozen union, the honest record dropped beside the shape). The word now
// exists and the record RIDES the form, so the TRUE facts are STRONGER:
//   · the genealogy moves by EXACTLY the resolution stamp — word 'refine' +
//     the trace at `genealogy.resolution` (REFERENCE-equal to the returned
//     record); parent pointer, depth, source/created ids, createdAt, id,
//     name, generations all byte-carried;
//   · the DAG is invariant under ADDING the re-expression ([parent, born,
//     refined] ≡ [parent, born] — no node, no edge, no duplicate-id throw:
//     the re-expression is not a second citizen) and the born form STAYS
//     LIVE (a resolution consumes nothing).
check('REFINE MINTS NO GENEALOGY: the refined form keeps its id, name and generations BYTE-IDENTICAL and its genealogy moves by EXACTLY the stamp (word \'refine\' + the riding trace, reference-equal — everything else byte-carried); the genealogy DAG over [parent, born, refined] is node-for-node and edge-for-edge IDENTICAL to the DAG over [parent, born] (nothing was begotten — the re-expression is not a second citizen, no duplicate-id throw, the born form stays LIVE); the recorded type-claim is \'resolution\'',
  Object.entries(FIXTURES).every(([name, fx]) => {
    const out = refined[name];
    const g = { ...out.shape.genealogy };
    delete g.resolution;
    g.operation = fx.born.genealogy.operation;
    const identity = out.shape.id === fx.born.id && out.shape.name === fx.born.name &&
      JSON.stringify(g) === JSON.stringify(fx.born.genealogy) &&
      JSON.stringify(out.shape.generations) === JSON.stringify(fx.born.generations);
    const stamped = out.shape.genealogy.operation === 'refine' &&
      out.shape.genealogy.resolution === out.refinement;
    const dagBefore = buildGenealogyDag([fx.parent, fx.born]);
    let dagAfter = null;
    try {
      dagAfter = buildGenealogyDag([fx.parent, fx.born, out.shape]);
    } catch {
      return false; // the duplicate-id throw would mean the re-expression was read as a citizen
    }
    const dagKey = (d) => JSON.stringify({
      nodes: d.nodes.map((n) => n.id).sort(),
      edges: d.edges.map((e) => `${e.parent}->${e.child}:${e.operation ?? ''}`).sort(),
    });
    return identity && stamped && dagKey(dagBefore) === dagKey(dagAfter) &&
      dagAfter.unconsumedAtEnd.includes(fx.born.id) &&
      out.refinement.typeClaim === 'resolution';
  }));
check('THE CARRIER IS SURJECTIVE new→old: every cell of the refined form (vertices · edges · faces) maps to an old cell whose closure contains it — midpoints and refined edges to the edge they subdivide (bound through the recovery\'s own materialized complex, unambiguous even for parallel loop classes), the disk/remainder/chord to the face — and every OLD cell has a preimage',
  Object.entries(FIXTURES).every(([name, fx]) => {
    const out = refined[name];
    const carrier = out.refinement.carrier;
    const newIds = [
      ...Object.keys(out.shape.vertices),
      ...out.shape.edges.map((e) => e.id),
      ...out.shape.faces.map((f) => f.id),
    ];
    const oldIds = new Set([
      ...Object.keys(fx.born.vertices),
      ...fx.born.edges.map((e) => e.id),
      ...fx.born.faces.map((f) => f.id),
    ]);
    const total = newIds.every((id) => carrier[id] !== undefined && (oldIds.has(carrier[id]) || carrier[id] === id));
    const image = new Set(Object.values(carrier));
    const surjective = [...oldIds].every((id) => image.has(id));
    return total && surjective;
  }));

// ═════ [e] non-movement: the L3 sibling is untouched ══════════════════════════════
console.log('\n----- [e] NON-MOVEMENT: bisectEdges (L3) byte-identical to HEAD; the rim is a sibling, not a refactor (clause 5) -----');
check('level3Subdivision.ts (the L3 bisectEdges) is CR-insensitively BYTE-IDENTICAL to HEAD, and the rim module IMPORTS nothing from it (its header may NAME the sibling; the import specifier must not exist — comment-stripped, source-asserted)',
  sha256OfCrStripped(fs.readFileSync(path.join(repoRoot, 'src/lib/level3Subdivision.ts'), 'utf8')) ===
    sha256OfCrStripped(headBlobOf('src/lib/level3Subdivision.ts')) &&
  (() => {
    const src = fs.readFileSync(path.join(repoRoot, 'src/lib/surfaceRefinement.ts'), 'utf8');
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').split(/\r?\n/).map((l) => l.split('//')[0]).join('\n');
    return !/from\s+['"][^'"]*level3Subdivision['"]/.test(code) && !/require\([^)]*level3Subdivision/.test(code);
  })());

// ═════ [f] ★★ both halves as mutants — the seal's spine ══════════════════════════
console.log('\n----- [f] ★★ the carried halves: each alone is a plausible whole, and each alone dies at the quotient-cycle wall (clause 6) -----');
// (a) CHORD ALONE — the DEAD seal's mechanism, carried: cut the born face at
// the first non-adjacent position pair, ignoring distinctness (no distinct
// arc exists — the pigeonhole), and offer the sum that disk.
const chordAlone = (form) => {
  const face = form.faces[0];
  const cyc = face.vertexIds;
  const n = cyc.length;
  const i = 0;
  const j = 2 % n;
  const arc = [];
  for (let k = i; ; k = (k + 1) % n) { arc.push(cyc[k]); if (k === j) break; }
  const rest = [];
  for (let k = j; ; k = (k + 1) % n) { rest.push(cyc[k]); if (k === i) break; }
  const chordId = `mut:chord:${form.id}`;
  return {
    ...form,
    edges: [...form.edges, { id: chordId, vertexIds: [cyc[i], cyc[j]], sourceVertexIds: [cyc[i], cyc[j]] }],
    faces: [
      { ...face, id: `${face.id}:disk`, vertexIds: arc },
      { ...face, id: `${face.id}:rest`, vertexIds: rest },
    ],
  };
};
check('★ CLAUSE 6(a) — CHORD ALONE, carried in-memory (the DEAD seal c7918d3c\'s mechanism): on the born RP²-4gon NO distinct-cornered arc exists at pass 0 (the pigeonhole: every arc of ≥3 slots from 2 classes repeats — measured), and forcing the cut anyway hands the sum a repeated-corner disk that is VISIBLY REFUSED at the quotient-cycle wall: "passes the same corner twice around its rim… Pick a different face" (R5, the designer’s door)',
  (() => {
    const a = bear(4, [{ edgeA: 0, edgeB: 2, mode: REV }, { edgeA: 1, edgeB: 3, mode: REV }], 'mutCA');
    const b = bear(4, [{ edgeA: 0, edgeB: 2, mode: REV }, { edgeA: 1, edgeB: 3, mode: REV }], 'mutCB');
    const cyc = a.born.faces[0].vertexIds;
    let anyDistinctArc = false;
    for (let i = 0; i < cyc.length && !anyDistinctArc; i += 1) {
      for (let d = 2; d <= cyc.length - 2; d += 1) {
        const arc = [];
        for (let k = i; ; k = (k + 1) % cyc.length) { arc.push(cyc[k]); if (k === (i + d) % cyc.length) break; }
        if (new Set(arc).size === arc.length) anyDistinctArc = true;
      }
    }
    const ca = chordAlone(a.born);
    const cb = chordAlone(b.born);
    let refusal = null;
    try {
      connectedSum(ca, cb, { faceA: ca.faces[0], faceB: cb.faces[0] });
    } catch (error) {
      refusal = error.message;
    }
    note(`distinct arc at pass 0: ${anyDistinctArc} · sum on the forced disk: "${refusal ? refusal.slice(0, 92) : 'SUCCEEDED?!'}…"`);
    return anyDistinctArc === false && refusal !== null &&
      refusal.includes('passes the same corner twice') && refusal.includes('Pick a different face');
  })());
check('★ CLAUSE 6(b) — BISECTION ALONE, carried as the REAL committed half (bisectSurface, one pass, NO chord): the bisected RP² rim reads [p, m_a, q, m_b, p, m_a, q, m_b] — 4 classes, 8 slots, STILL REPEATS (measured — the researcher\'s rim, exactly) — so :129\'s own rule (new Set(cycle).size === cycle.length) CONDEMNS the only available disk, and the sum still REFUSES the chordless single-face form ("has a single face… Subdivide first" — the wall\'s advice after bisection alone is STILL subdivision). Both halves fail alone; the pair is proven to be a pair',
  (() => {
    const a = bear(4, [{ edgeA: 0, edgeB: 2, mode: REV }, { edgeA: 1, edgeB: 3, mode: REV }], 'mutBA');
    const b = bear(4, [{ edgeA: 0, edgeB: 2, mode: REV }, { edgeA: 1, edgeB: 3, mode: REV }], 'mutBB');
    const ba = bisectSurface(a.born, a.parent);
    const bb = bisectSurface(b.born, b.parent);
    const rim = ba.shape.faces[0].vertexIds;
    const rimRepeats = new Set(rim).size !== rim.length;
    const classes = new Set(rim).size;
    let refusal = null;
    try {
      connectedSum(ba.shape, bb.shape);
    } catch (error) {
      refusal = error.message;
    }
    note(`bisected rim: ${rim.length} slots · ${classes} classes · repeats=${rimRepeats} (:129's rule fails on it) · sum: "${refusal ? refusal.slice(0, 76) : 'SUCCEEDED?!'}…"`);
    return ba.shape.faces.length === 1 && ba.refinement.chordEdgeId === null &&
      rim.length === 8 && classes === 4 && rimRepeats && refusal !== null &&
      refusal.includes('has a single face') && refusal.includes('Subdivide first');
  })());

// ═════ [g] the freeze — authoritative, no count restated ═════════════════════════
console.log('\n----- [g] the freeze diagnostic\'s own verdict (no count restated — a memory must not compete with the measurement) -----');
const freeze = checkEngineFreeze();
check('THE ENGINE FREEZE reads ok with zero drift, zero missing, zero unlisted, zero nulled (the rim module rides as a NOT_FROZEN line — the completeness law working; the count is the flagship\'s to pin, not this leg\'s to remember)',
  freeze.ok === true && freeze.drifted.length === 0 && freeze.missing.length === 0 &&
  freeze.unlisted.length === 0 && freeze.nulled.length === 0);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
