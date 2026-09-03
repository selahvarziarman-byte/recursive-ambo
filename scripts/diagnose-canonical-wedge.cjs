#!/usr/bin/env node

// DIAGNOSTIC — THE CANONICAL WEDGE (researcher-pinned, ADR 0021 §6.0-bis;
// SEAL-BEFORE-BUILD — BUILT BLIND to `.handoff/SEAL_CANONICAL_WEDGE.md`,
// SHA-256 6b623e0f…679da; every pin below is the builder's own measurement).
//
// THE BUG THIS FIXES: `identifyOnComplex` took its mode reference from
// `wedgeDirections(complex)` — FIRST WRITER WINS over the face ARRAY — so on
// an INTERIOR edge (two wedges, opposite traversals) the reference was
// whichever face happened to be listed first: a shipped operation that was a
// function of the complex AND its array order. Free edges have ONE wedge, so
// every sealed surface (rims, sews, connectedSum, depth-4) was never touched.
//
// THE RULE (researcher, derived): σ = −s_A·s_B (preserving), where s_X = the
// sign with which X's CANONICAL WEDGE traverses X's STORED arrow, and the
// canonical wedge = the incident wedge on the face of SMALLEST COMMITTED
// FACE-ID — never array position, never a fixed sign (both proposed fixed
// signs were gauge-dependent: each true under one storage convention only).
// Where the selector is NOT total (both wedges of a declared edge on ONE
// face) it REFUSES BY NAME — the tiebreak is a researcher pin not yet ruled.
//
// THE THREE CLAUSES, each proving its teeth:
//   1 EXECUTE WHAT YOU WITNESS — every witnessed case asserts via==='general'.
//   2 TRAP-SENSITIVITY, PLURALLY — the ARRAY-ORDER mechanism (an IN-MEMORY
//     mutant of the working engine, restoring the shipped first-writer-wins
//     reference) VISIBLY FAILS the relabelling test; a RAW FIXED-SIGN mutant
//     VISIBLY FAILS the re-storage test.
//   3 RE-STORAGE INVARIANCE, HARDENED — a PROPER, NON-UNIFORM subset flip that
//     SPLITS an identified pair (s_A·s_B: +1→−1) must not move the result by
//     one byte; the fixed-sign mutant FAILS on that subset AND the UNIFORM
//     flip FAILS TO CATCH it (it moves s_A and s_B together — a subset a
//     fixed-sign rule survives is not a witness).
//   §5 INDEPENDENCE — the two invariance clauses are BLIND to each other's
//     bug: the table is emitted from REAL RUNS so no future refactor drops
//     either as "redundant".
//
// ⚠ THE WITNESS LAW (engineer-ruled on this build's audit, 2026-07-12 — the
// sibling of "a seal must execute what it claims to witness"): a
// trap-sensitivity witness must CARRY its own wrong mechanism — an in-memory
// mutant — and must NEVER BORROW it from a git ref the build is about to
// destroy. A seal must not depend on the bug still existing. THE WITNESS MUST
// OUTLIVE THE COMMIT. (The first cut of this diagnostic mounted the
// array-order mechanism on `git show HEAD:` — which Arman's commit of the fix
// overwrites: two Clause-2 legs would have INVERTED post-commit and the
// free-edge legs gone vacuous. Every wrong mechanism below is now carried
// in-memory; NO leg of this diagnostic depends on HEAD being unfixed. §g's
// engine-freeze check reads the on-repo manifest of content hashes — this
// diagnostic makes no HEAD reads at all.)
//
// ★ THE HIGHEST BAR (§6.1): free-edge behaviour must not move by ONE BYTE —
// rims both modes, the parallel-class tubes, and the DEPTH-4 CHAIN at every
// generation are byte-compared against the CARRIED array-order mechanism:
// the valence-1 reduction itself, stated as a PERMANENT, falsifiable claim —
// the canonical rule and the array-order rule agree on every free-edge
// surface and differ ONLY where the wedge is ambiguous. It can never go
// vacuous and never goes stale. The valence-1 rule is DERIVED; if the change
// moved a rim, the change would be wrong, not the rim.
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

const { identify, sewBoundaryCircles, acquireComplex } = req('src/lib/complexIdentification.ts');
const { acquireFaithfulComplex } = req('src/manuscript/surfaceClassifier.ts');
const { analyzeGlobalW1 } = req('src/lib/globalW1.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { cutCell } = req('src/lib/cutOperation.ts');
const { materializeCutResult } = req('src/lib/materializeOperation.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const copyOf = (shape, prefix) => deserializeSnapshot(serializeSnapshot(shape, prefix)).shape;

// ---------------------------------------------------------------------------
// in-memory WRONG-MECHANISM mutants of the WORKING engine — both CARRIED, per
// the witness law above (never borrowed from a git ref): ARRAY-ORDER restores
// the shipped first-writer-wins reference (the bug); RAW FIXED-SIGN restores
// the rejected stored-arrow pin (s ≡ +1). Anchor hit-counts are asserted: a
// moved engine fails LOUDLY, never silently un-mutates.
// ---------------------------------------------------------------------------
const ciPath = path.join(repoRoot, 'src', 'lib', 'complexIdentification.ts');
const workSource = fs.readFileSync(ciPath, 'utf8');
function compileVariant(label, source, replacements = []) {
  let src = source;
  for (const { find, replace, count } of replacements) {
    const hits = src.split(find).length - 1;
    if (hits !== count) {
      throw new Error(`variant ${label}: anchor "${find.slice(0, 48)}…" hit ${hits}×, expected ${count} — re-anchor, never skip`);
    }
    src = src.split(find).join(replace);
  }
  const fake = path.join(path.dirname(ciPath), `complexIdentification.__${label}__.ts`);
  const m = new Module(fake, module);
  m.filename = fake;
  m.paths = Module._nodeModulePaths(path.dirname(fake));
  m._compile(ts.transpileModule(src, { ...TRANSPILE_OPTIONS, fileName: fake }).outputText, fake);
  return m.exports;
}
const arrayOrderCI = compileVariant('arrayOrder', workSource, [
  { find: '    const sA = canonicalDirOf(cycleA[i]);', replace: '    const sA = wedgeDirections(complex).get(cycleA[i]) ?? 1;', count: 1 },
  { find: '    const sB = canonicalDirOf(cycleB[i]);', replace: '    const sB = wedgeDirections(complex).get(cycleB[i]) ?? 1;', count: 1 },
  { find: '    return canonicalDirOf(id) === 1 ? [e.u, e.v] : [e.v, e.u];', replace: '    return (wedgeDirections(complex).get(id) ?? 1) === 1 ? [e.u, e.v] : [e.v, e.u];', count: 1 },
]);
const fixedSignCI = compileVariant('fixedSign', workSource, [
  { find: '    const sA = canonicalDirOf(cycleA[i]);', replace: '    const sA = 1 as 1 | -1;', count: 1 },
  { find: '    const sB = canonicalDirOf(cycleB[i]);', replace: '    const sB = 1 as 1 | -1;', count: 1 },
  { find: '    return canonicalDirOf(id) === 1 ? [e.u, e.v] : [e.v, e.u];', replace: '    return [e.u, e.v] as [VertexId, VertexId];', count: 1 },
]);

// fixtures --------------------------------------------------------------------
const freshCyl = (prefix) => copyOf(immerseSurface({ surface: 'cylinder', resolution: 4 }).shape, prefix);
const tube4x1 = (prefix) => loadForm(() => ({
  name: 'tube4x1',
  vertices: [
    { id: 'a0', position: [1, 0, 0] }, { id: 'a1', position: [0, 0, 1] }, { id: 'a2', position: [-1, 0, 0] }, { id: 'a3', position: [0, 0, -1] },
    { id: 'b0', position: [1, 1, 0] }, { id: 'b1', position: [0, 1, 1] }, { id: 'b2', position: [-1, 1, 0] }, { id: 'b3', position: [0, 1, -1] },
  ],
  faces: [0, 1, 2, 3].map((i) => ({ vertexIds: [`a${i}`, `a${(i + 1) % 4}`, `b${(i + 1) % 4}`, `b${i}`] })),
}), prefix);
const tube8x1 = (prefix) => loadForm(() => ({
  name: 'tube8x1',
  vertices: [
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ id: `a${i}`, position: [Math.cos((i * Math.PI) / 4), 0, Math.sin((i * Math.PI) / 4)] })),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ id: `b${i}`, position: [Math.cos((i * Math.PI) / 4), 1, Math.sin((i * Math.PI) / 4)] })),
  ],
  faces: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ vertexIds: [`a${i}`, `a${(i + 1) % 8}`, `b${(i + 1) % 8}`, `b${i}`] })),
}), prefix);

// the MERGE-PARTITION signature: face-order-free, id-stable — minted classes
// as sorted member sets + χ + the quotient degree sequence (the mandate's own
// discriminators: χ moves on shared-endpoint pairs; the degree sequence is
// what separates the χ-blind disjoint case).
const partitionSig = (result) => {
  const classes = Object.values(result.shape.vertices)
    .map((v) => (v.createdBy && v.createdBy.shapeId === result.shape.id ? [...v.createdBy.sourceVertexIds].sort().join('~') : v.id))
    .sort();
  const chi = result.complex.vertices.length - result.complex.edges.length + result.complex.faces.length;
  const deg = new Map();
  for (const e of result.complex.edges) {
    deg.set(e.u, (deg.get(e.u) ?? 0) + 1);
    deg.set(e.v, (deg.get(e.v) ?? 0) + 1);
  }
  return { key: JSON.stringify({ classes, chi, degrees: [...deg.values()].sort((x, y) => x - y) }), chi, degrees: [...deg.values()].sort((x, y) => x - y) };
};
// an interior pair of the cylinder: (first interior edge, a shared-endpoint
// partner) and (first interior edge, an endpoint-disjoint partner)
const interiorPairsOf = (form) => {
  const acq = acquireFaithfulComplex(form, null);
  const w = new Map();
  for (const e of acq.complex.edges) w.set(e.id, 0);
  for (const f of acq.complex.faces) for (const s of f.boundary) w.set(s.edge, (w.get(s.edge) ?? 0) + 1);
  const interior = acq.complex.edges.filter((e) => w.get(e.id) === 2);
  const a = interior[0];
  const touches = (x, y) => x.u === y.u || x.u === y.v || x.v === y.u || x.v === y.v;
  return {
    shared: [a.id, interior.find((e) => e !== a && touches(e, a)).id],
    disjoint: [a.id, interior.find((e) => e !== a && !touches(e, a)).id],
  };
};

console.log('the canonical wedge: identifyOnComplex becomes a function of its own input (blind concretes)\n');

// ═════ [a] ★ THE HIGHEST BAR — free-edge non-movement, stated permanently ════
// (the valence-1 reduction: the canonical rule and the CARRIED array-order
// rule must agree BYTE-FOR-BYTE on every free-edge surface — a claim that can
// never go vacuous and never goes stale, unlike a HEAD-differential)
console.log('----- [a] ★ free-edge surfaces: canonical ≡ array-order, BYTE-IDENTICAL (any movement = the change is wrong, not the rim) -----');
const rimPairEq = (mode) => {
  const mine = sewBoundaryCircles(freshCyl('cwA'), mode);
  const theirs = arrayOrderCI.sewBoundaryCircles(freshCyl('cwA'), mode);
  return mine.via === 'general' && theirs.via === 'general' && eq(mine, theirs);
};
check('cylinder rims, BOTH modes (torus / Klein): shape, complex, ledger, gate, seam ids, spec — the canonical engine ≡ the carried array-order mechanism, byte-for-byte, via general (valence 1 has ONE wedge: the rules provably coincide, and this leg falsifies that forever)',
  rimPairEq('preserving') && rimPairEq('reversing'));
const tubeEq = (make, prefix, mode) => {
  const mine = sewBoundaryCircles(make(prefix), mode);
  const theirs = arrayOrderCI.sewBoundaryCircles(make(prefix), mode);
  return mine.via === 'general' && eq(mine, theirs);
};
check('the parallel-class tubes (4×1 both modes; 8×1 with the n/2 seam): canonical ≡ array-order, byte-for-byte',
  tubeEq(tube4x1, 'cwB', 'preserving') && tubeEq(tube4x1, 'cwB', 'reversing') && tubeEq(tube8x1, 'ub7', 'preserving'));

// ═════ [b] the depth-4 chain: canonical ≡ array-order at every generation ════
console.log('\n----- [b] the depth-4 chain: canonical ≡ array-order, byte-identical at EVERY generation -----');
const chainOf = (ci) => {
  const tube = tube8x1('ub7');
  const S1 = ci.sewBoundaryCircles(tube, 'preserving');
  const C1 = materializeCutResult(S1.shape, cutCell(S1.shape, S1.shape.faces[0]));
  const firstFace = S1.shape.faces[0];
  const disjointFace = C1.faces.find((f) => f.vertexIds.every((v) => !firstFace.vertexIds.includes(v)));
  const C2 = materializeCutResult(C1, cutCell(C1, disjointFace));
  const acq1 = ci.acquireComplex(C1, [S1.shape, tube]);
  const acq2 = ci.acquireComplex(C2, [C1, S1.shape, tube]);
  const G4P = ci.sewBoundaryCircles(C2, 'preserving', 0, 1, [C1, S1.shape, tube]);
  const G4R = ci.sewBoundaryCircles(C2, 'reversing', 0, 1, [C1, S1.shape, tube]);
  return { S1, C1, C2, acq1, acq2, G4P, G4R };
};
const mineChain = chainOf({ sewBoundaryCircles, acquireComplex });
const mutantChain = chainOf(arrayOrderCI);
check('gen 1 (sew) · gens 2–3 (chain-acquired cuts) · gen 4 (re-sew, BOTH modes): canonical ≡ array-order, byte-identical at every generation, via general at every identification (every seam on the chain is FREE — the reduction holds four generations deep)',
  mineChain.S1.via === 'general' && mineChain.G4P.via === 'general' && mineChain.G4R.via === 'general' &&
  eq(mineChain.S1, mutantChain.S1) && eq(mineChain.C1, mutantChain.C1) && eq(mineChain.C2, mutantChain.C2) &&
  eq(mineChain.acq1, mutantChain.acq1) && eq(mineChain.acq2, mutantChain.acq2) &&
  eq(mineChain.G4P, mutantChain.G4P) && eq(mineChain.G4R, mutantChain.G4R));
note(`gen4 preserving certifies χ=${analyzeGlobalW1(mineChain.G4P.complex).debug.euler} (genus 2) — unmoved`);

// ═════ [c] the BUG and the FIX — relabelling invariance ══════════════════════
console.log('\n----- [c] rotating shape.faces is a PURE RELABELLING: the array-order mechanism moves (the bug, exhibited on the CARRIED mutant); the canonical engine does not -----');
const ROTATIONS = [0, 3, 7, 11];
const relabellingSigs = (ci, pairKind) => {
  const sigs = new Map(); // key -> {chi, degrees}
  for (const k of ROTATIONS) {
    const form = freshCyl('cwR');
    const rotated = { ...form, faces: [...form.faces.slice(k), ...form.faces.slice(0, k)] };
    const pair = interiorPairsOf(rotated)[pairKind];
    const run = ci.identify(rotated, [pair[0]], [pair[1]], 'preserving');
    if (run.via !== 'general') throw new Error('relabelling case did not execute the enactment');
    const sig = partitionSig(run);
    sigs.set(sig.key, sig);
  }
  return sigs;
};
const bugShared = relabellingSigs(arrayOrderCI, 'shared');
const bugDisjoint = relabellingSigs(arrayOrderCI, 'disjoint');
const mineShared = relabellingSigs({ identify }, 'shared');
const mineDisjoint = relabellingSigs({ identify }, 'disjoint');
check('THE BUG, EXHIBITED — permanently, on the CARRIED array-order mutant: the SAME interior identification under 4 face-array rotations yields ≥2 DISTINCT merge partitions — on both the shared-endpoint and the disjoint-endpoint pair (this leg does NOT depend on HEAD being unfixed; the wrong mechanism lives in this file)',
  bugShared.size >= 2 && bugDisjoint.size >= 2);
note(`array-order shared-endpoint partitions: ${[...bugShared.values()].map((s) => `χ=${s.chi}`).join(' · ')} — χ itself moves under a relabelling`);
note(`array-order disjoint-endpoint partitions: ${[...bugDisjoint.values()].map((s) => `χ=${s.chi} deg=[${s.degrees.join(',')}]`).join(' · ')} — χ is BLIND; the degree sequence separates them`);
check('THE FIX: the canonical engine yields EXACTLY ONE partition across the same rotations, on both pairs — the operation is a function of its input again',
  mineShared.size === 1 && mineDisjoint.size === 1);
note(`canonical shared: χ=${[...mineShared.values()][0].chi} · disjoint: χ=${[...mineDisjoint.values()][0].chi} deg=[${[...mineDisjoint.values()][0].degrees.join(',')}]`);
check('…and the interior result still lands at the GATE, refused as a junction (the merge is a NAMING, not a manifold claim — the meaning comment at the selector is load-bearing)',
  (() => {
    const form = freshCyl('cwR');
    const pair = interiorPairsOf(form).shared;
    const run = identify(form, [pair[0]], [pair[1]], 'preserving');
    return run.gate.manifold === false && run.gate.junctionEdgeIds.length === 1;
  })());

// ═════ [d] re-storage invariance, HARDENED (clause 3) ════════════════════════
console.log('\n----- [d] re-storage: a PROPER NON-UNIFORM subset splitting an identified pair — the result must not move by one byte -----');
const flipEdges = (form, ids) => ({
  ...form,
  edges: form.edges.map((e) => (ids.has(e.id) ? { ...e, vertexIds: [e.vertexIds[1], e.vertexIds[0]] } : e)),
});
const freeDirOf = (form, edgeId) => {
  // the canonical (= unique) wedge sign of a FREE edge vs its stored arrow —
  // measured by the harness itself, to prove the chosen subset SPLITS a pair
  const acq = acquireFaithfulComplex(form, null);
  let dir = null;
  for (const f of acq.complex.faces) for (const s of f.boundary) if (s.edge === edgeId) dir = dir === null ? s.dir : 'interior';
  return dir;
};
const baseCyl = freshCyl('cwS');
const baseSewn = sewBoundaryCircles(baseCyl, 'preserving');
const pairA0 = baseSewn.spec.cycleA[0];
const pairB0 = baseSewn.spec.cycleB[0];
const productBefore = freeDirOf(baseCyl, pairA0) * freeDirOf(baseCyl, pairB0);
const restoredB = flipEdges(baseCyl, new Set([pairB0]));
const productAfter = freeDirOf(restoredB, pairA0) * freeDirOf(restoredB, pairB0);
const rerunB = sewBoundaryCircles(restoredB, 'preserving');
check('the subset SPLITS pair 0 (s_A·s_B measured: +1 → −1) and the canonical result DOES NOT MOVE BY ONE BYTE (shape, complex, ledger, gate, seams, spec all byte-identical)',
  productBefore === 1 && productAfter === -1 && rerunB.via === 'general' && eq(baseSewn, rerunB));
const restoredA = flipEdges(baseCyl, new Set([pairA0]));
const rerunA = sewBoundaryCircles(restoredA, 'preserving');
check('the A-side flip (the seam CARRIER re-stored): vertex classes, ledger, born faces, gate — byte-identical; only the carried gauge of that one class re-expresses (input data, not behaviour)',
  rerunA.via === 'general' &&
  eq(baseSewn.shape.vertices, rerunA.shape.vertices) && eq(baseSewn.ledger, rerunA.ledger) &&
  eq(baseSewn.shape.faces, rerunA.shape.faces) && eq(baseSewn.gate, rerunA.gate) &&
  eq(analyzeGlobalW1(baseSewn.complex).cert, analyzeGlobalW1(rerunA.complex).cert));
const intForm = freshCyl('cwI');
const intPair = interiorPairsOf(intForm).disjoint;
const intBase = identify(intForm, [intPair[0]], [intPair[1]], 'preserving');
const intRerun = identify(flipEdges(intForm, new Set([intPair[1]])), [intPair[0]], [intPair[1]], 'preserving');
check('…and the INTERIOR identification is re-storage-invariant too: the flipped-partner rerun is byte-identical (the canonical wedge flips WITH the stored arrow)',
  intBase.via === 'general' && eq(intBase, intRerun));

// ═════ [e] the INDEPENDENCE TABLE (§5) — from real runs ══════════════════════
console.log('\n----- [e] the two invariance clauses are INDEPENDENT — each blind to the other\'s bug (measured, not argued) -----');
const relabellingVerdict = (ci) => {
  const sigs = relabellingSigs(ci, 'disjoint');
  return sigs.size === 1 ? 'PASSES' : 'CAUGHT';
};
const restorageVerdict = (ci) => {
  const base = ci.sewBoundaryCircles(freshCyl('cwS'), 'preserving');
  const rerun = ci.sewBoundaryCircles(flipEdges(freshCyl('cwS'), new Set([base.spec.cycleB[0]])), 'preserving');
  return eq(partitionSig(base).key, partitionSig(rerun).key) ? 'PASSES' : 'CAUGHT';
};
const table = [
  { mechanism: 'ARRAY-ORDER s (the shipped bug — carried in-memory)', relabelling: relabellingVerdict(arrayOrderCI), restorage: restorageVerdict(arrayOrderCI), expect: ['CAUGHT', 'PASSES'] },
  { mechanism: 'RAW FIXED-SIGN (the rejected pin — stored arrows, s ≡ +1)', relabelling: relabellingVerdict(fixedSignCI), restorage: restorageVerdict(fixedSignCI), expect: ['PASSES', 'CAUGHT'] },
  { mechanism: 'CANONICAL WEDGE (the rule)', relabelling: relabellingVerdict({ identify, sewBoundaryCircles }), restorage: restorageVerdict({ identify, sewBoundaryCircles }), expect: ['PASSES', 'PASSES'] },
];
console.log('  ┌────────────────────────────────────────────────────────────┬──────────────┬──────────────┐');
console.log('  │ mechanism                                                  │ relabelling  │ re-storage   │');
console.log('  ├────────────────────────────────────────────────────────────┼──────────────┼──────────────┤');
for (const row of table) {
  console.log(`  │ ${row.mechanism.padEnd(58)} │ ${row.relabelling.padEnd(12)} │ ${row.restorage.padEnd(12)} │`);
}
console.log('  └────────────────────────────────────────────────────────────┴──────────────┴──────────────┘');
check('the ARRAY-ORDER mechanism is CAUGHT by relabelling and PASSES re-storage — the re-storage clause is BLIND to the array-order bug',
  table[0].relabelling === 'CAUGHT' && table[0].restorage === 'PASSES');
check('the RAW FIXED-SIGN mechanism PASSES relabelling and is CAUGHT by re-storage — the relabelling clause is BLIND to the fixed-sign bug (a seal with only one clause passes a wrong mechanism)',
  table[1].relabelling === 'PASSES' && table[1].restorage === 'CAUGHT');
check('the CANONICAL rule is invariant under BOTH — and only it',
  table[2].relabelling === 'PASSES' && table[2].restorage === 'PASSES');
// clause 3's teeth, both jaws: the fixed-sign failure is REAL topology, and
// the UNIFORM flip fails to catch it
const fsBase = fixedSignCI.sewBoundaryCircles(freshCyl('cwS'), 'preserving');
const fsSplit = fixedSignCI.sewBoundaryCircles(flipEdges(freshCyl('cwS'), new Set([fsBase.spec.cycleB[0]])), 'preserving');
const fsSplitCert = analyzeGlobalW1(fsSplit.complex);
check('the fixed-sign failure is a REAL corruption, certified: the split-subset rerun no longer builds the torus (the sealed surface silently inverts)',
  !eq(partitionSig(fsBase).key, partitionSig(fsSplit).key) &&
  !(fsSplitCert.debug.euler === 0 && !fsSplitCert.cert.nonOrientable));
note(`fixed-sign on the split subset: χ=${fsSplitCert.debug.euler} w₁=${fsSplitCert.cert.nonOrientable ? 1 : 0} (the torus reads χ=0 w₁=0)`);
const allEdgeIds = new Set(freshCyl('cwS').edges.map((e) => e.id));
const fsUniform = fixedSignCI.sewBoundaryCircles(flipEdges(freshCyl('cwS'), allEdgeIds), 'preserving');
check('★ and the UNIFORM flip FAILS TO CATCH it: flipping ALL edges moves s_A and s_B together, s_A·s_B is unchanged, and the WRONG rule sails through — a subset a fixed-sign rule survives is not a witness',
  eq(partitionSig(fsBase).key, partitionSig(fsUniform).key));

// ═════ [f] the §3 refusal — by name, on the live route ═══════════════════════
console.log('\n----- [f] the selector is NOT TOTAL: both wedges on one face → REFUSED BY NAME, never guessed -----');
const tubeF = tube4x1('cwT');
const acqF = acquireFaithfulComplex(tubeF, null);
const wF = new Map();
for (const e of acqF.complex.edges) wF.set(e.id, 0);
for (const f of acqF.complex.faces) for (const s of f.boundary) wF.set(s.edge, (wF.get(s.edge) ?? 0) + 1);
const face0Free = acqF.complex.faces[0].boundary.map((s) => s.edge).filter((id) => wF.get(id) === 1);
const gen1 = identify(tubeF, [face0Free[0]], [face0Free[1]], 'preserving');
check("the fixture is REACHABLE through the engine's own doors: identifying two free edges of ONE face (via 'general') births a class whose BOTH wedges lie on that face",
  gen1.via === 'general' && face0Free.length === 2 &&
  gen1.complex.faces[0].boundary.filter((s) => s.edge === gen1.seamEdgeIds[0]).length === 2);
let refusal = '';
try {
  const other = gen1.complex.edges.find((e) => e.id !== gen1.seamEdgeIds[0]).id;
  identify(gen1.shape, [gen1.seamEdgeIds[0]], [other], 'preserving', [tubeF]);
} catch (error) {
  refusal = String(error.message);
}
check('declaring that class refuses BY NAME — the edge and the face are named; the tiebreak is the researcher\'s, not the code\'s (dir-based and slot-index tiebreaks are forbidden traps)',
  refusal.includes('the canonical wedge is ambiguous') &&
  refusal.includes(gen1.seamEdgeIds[0]) &&
  refusal.includes('lie on face "') &&
  refusal.includes('a researcher pin not yet ruled'));
note(`refusal: ${refusal.slice(0, 150)}…`);

// ═════ [g] guards ═════════════════════════════════════════════════════════════
console.log('\n----- [g] no-regression: the fix lives in ONE selector; everything else is frozen -----');
const crStrip = (s) => s.replace(/\r/g, '');
// complexIdentification carries THIS mandate's sanctioned BEHAVIORAL edit (the
// canonical-wedge selector; ADR 0021 §6.0-bis) — ratified by §a/§b's HEAD
// byte-differential (free edges unmoved) + §c/§d/§e (the interior fix and its
// invariances). The §7 meaning comment must be present — it is load-bearing:
check('the selector carries the researcher\'s MEANING comment (the interior mode is a NAMING; THE FORM UNIFIES, THE MEANING DOES NOT) and the canonical-wedge rule text',
  (() => {
    const src = crStrip(fs.readFileSync(ciPath, 'utf8'));
    return src.includes('THE FORM UNIFIES; THE MEANING DOES NOT') &&
      src.includes('SMALLEST COMMITTED FACE-ID') &&
      src.includes('the canonical wedge is ambiguous') &&
      src.includes('ADR 0021 §6.0-bis');
  })());
// THE ENGINE FREEZE MANIFEST (engineer-chartered 2026-07-12): the old
// per-diagnostic HEAD-differential guard REQUIRED A HOLE IN ITSELF to permit
// any sanctioned change (a carve-out — silent, and permanent unless a human
// remembered; `playgroundOperations.ts` ended up guarded by NOBODY). The
// engine is now frozen by ONE on-repo manifest of content hashes
// (docs/governance/ENGINE_FREEZE_MANIFEST.txt): a sanctioned change is a
// one-line hash update in the SAME commit, and coverage never lapses. The
// shared checker READS the manifest and can never write it.
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
const freeze = checkEngineFreeze();
// 27 → 44 (2026-07-14, THE SMALL RUN): the freeze closed under imports — a
// frozen file is only as frozen as its dependencies; src/types joined the scan.
check('THE ENGINE FREEZE MANIFEST: all 45 frozen engine files (import-closed) match their manifest hashes and every source file under the engine roots is classified — drifted [] · missing [] · unlisted []',
  freeze.ok === true && freeze.checked === 48 /* 47 → 48: cornerCycleName.ts joined the frozen set at the A-3b closure cure (2d9eb97) — the ONE corner-cycle composer frozen beside its frozen consumer */ &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 && freeze.unlisted.length === 0);
if (!freeze.ok) note(`drifted: [${freeze.drifted}] · missing: [${freeze.missing}] · unlisted: [${freeze.unlisted}]`);
// THE FREEZE CHECK STILL BITES (stub-proof — a checker that cannot fail is dead):
const FREEZE_SENTINEL = 'src/lib/incidenceTraceRegistry.ts';
const sentinelContent = fs.readFileSync(path.join(repoRoot, FREEZE_SENTINEL), 'utf8');
const sentinelFlipped = sentinelContent.slice(0, 100) + (sentinelContent[100] === 'X' ? 'Y' : 'X') + sentinelContent.slice(101);
const freezeBite = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelFlipped } });
const freezeCrlf = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelContent.replace(/\r/g, '').replace(/\n/g, '\r\n') } });
check('…and the freeze check still BITES: a one-character in-memory mutation of the sentinel FAILS it (exactly that file drifts) while the CRLF re-expression PASSES (CR-insensitive — no false wolf)',
  freezeBite.ok === false && freezeBite.drifted.length === 1 && freezeBite.drifted[0] === FREEZE_SENTINEL &&
  freezeCrlf.ok === true);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
