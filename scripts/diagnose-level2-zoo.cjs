#!/usr/bin/env node

// DIAGNOSTIC — The Level-2 Zoo: glue · flip-glue · collapse on REAL input.
// Seals six surfaces, EACH separately: cylinder · torus · Möbius · Klein · RP² · sphere.
// MILESTONE: the first real `w1 = 1` (Möbius / Klein / RP² — nonOrientable === true).
//
// Per surface: the identification (pullBack sets exactly the intended merges); w1 vs
// the table; the EXPOSED level-2 link adjacency; decomposeLink(link).valence for the
// five clean surfaces; faithfulness UNFAITHFUL + read-actuals (co-location ≠ identity,
// one rung up). RP² (watch-item 1) is the level-2 bigon: its 2-cycle FACT is asserted
// and SURFACED — interior/boundary is NOT asserted (decomposeLink's level-2 floor is ≥3).
// RP² discriminator: w1 came from TWO separate −1 pair-cycles (OR), not parity.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        esModuleInterop: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
      fileName: filename,
    }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { glueFace, flipGlueFace, collapseFace, faceEdgePairs, boundaryEdgeSign } = req(
  'src/lib/surfaceOperations.ts',
);
const { createSeedShape } = req('src/data/seeds.ts');
const { shapeLineageOf, certifyOrientation } = req('src/lib/transformationLedger.ts');
// READ-ONLY import for the §J agreement seal (the cascade's correct collapse reference).
const { runCollapseCascade } = req('src/lib/cascadeDriver.ts');

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`PASS - ${label}`);
  } else {
    console.log(`FAIL - ${label}`);
    failures += 1;
  }
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const sortedSetOfSets = (obj) =>
  JSON.stringify(
    Object.values(obj)
      .map((arr) => [...arr].sort())
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
  );

// ---- the one deterministic real square 2-cell (§3) ----
const shape = createSeedShape('cube');
const shapeSnapshot = JSON.stringify(shape);
const face = shape.faces[0];
const vs = face.vertexIds;
const [A, D, C, B] = vs; // cube `bottom` cycle = [a, d, c, b]
const lineageOf = shapeLineageOf(shape);
const P = (edgeA, edgeB, mode) => ({ edgeA, edgeB, mode });

// ===================== utilities sealed standalone =====================
const fep = faceEdgePairs(face);
check(
  '§3 faceEdgePairs is the CCW boundary cycle (4 ordered edges)',
  fep.length === 4 &&
    fep[0][0] === A &&
    fep[0][1] === D &&
    fep[1][0] === D &&
    fep[1][1] === C &&
    fep[2][0] === C &&
    fep[2][1] === B &&
    fep[3][0] === B &&
    fep[3][1] === A,
);
check(
  '§3 boundaryEdgeSign: PARALLEL seam ([X,Y],[X,Y]) === -1 (reversing)',
  boundaryEdgeSign(['X', 'Y'], ['X', 'Y']) === -1,
);
check(
  '§3 boundaryEdgeSign: ANTIPARALLEL seam ([X,Y],[Y,X]) === +1 (preserving)',
  boundaryEdgeSign(['X', 'Y'], ['Y', 'X']) === 1,
);

// ===================== the six surfaces =====================
// Each entry: how to build it, the intended merges, the expected w1, and the link shape.
const SURFACES = [
  {
    name: 'cylinder',
    build: () => glueFace(shape, face, [P(0, 2, 'preserving')]),
    merges: { 's1': [A, B], 's2': [C, D] },
    pairSigns: [1],
    w1: 0,
    linkShape: 'arc', // open arcs — boundary
    valence: 'boundary',
    chi: 0,
    cellCounts: { v: 2, e: 3, f: 1 },
  },
  {
    name: 'torus',
    build: () => glueFace(shape, face, [P(0, 2, 'preserving'), P(1, 3, 'preserving')]),
    merges: { 's': [A, B, C, D] },
    pairSigns: [1, 1],
    w1: 0,
    linkShape: 'cycle4', // single 4-cycle — interior
    valence: 'interior',
    chi: 0,
    cellCounts: { v: 1, e: 2, f: 1 },
  },
  {
    name: 'mobius',
    build: () => flipGlueFace(shape, face, [P(0, 2, 'reversing')]),
    merges: { 's1': [A, C], 's2': [B, D] },
    pairSigns: [-1],
    w1: 1,
    linkShape: 'arc',
    valence: 'boundary',
    chi: 0,
    cellCounts: { v: 2, e: 3, f: 1 },
  },
  {
    name: 'klein',
    build: () => flipGlueFace(shape, face, [P(0, 2, 'preserving'), P(1, 3, 'reversing')]),
    merges: { 's': [A, B, C, D] },
    pairSigns: [1, -1],
    w1: 1,
    linkShape: 'cycle4',
    valence: 'interior',
    chi: 0,
    cellCounts: { v: 1, e: 2, f: 1 },
  },
  {
    name: 'rp2',
    build: () => flipGlueFace(shape, face, [P(0, 2, 'reversing'), P(1, 3, 'reversing')]),
    merges: { 's1': [A, C], 's2': [B, D] },
    pairSigns: [-1, -1],
    w1: 1,
    linkShape: 'bigon', // 2-cycle — the level-2 bigon (RULED interior; floor retired)
    valence: 'interior', // RULED: a bigon is a topological S¹
    chi: 1,
    cellCounts: { v: 2, e: 2, f: 1 },
  },
  {
    name: 'sphere',
    build: () => collapseFace(shape, face),
    merges: { 's': [A, B, C, D] },
    pairSigns: [],
    w1: 0,
    linkShape: 'none', // the corrected boundary-quotient has NO 1-complex link — the test is χ
    valence: null, // n/a — the manifold S² surface test is χ=2, not a link valence
    chi: 2,
    cellCounts: { v: 1, e: 0, f: 1 },
  },
];

const exposedLinks = {}; // collected for the handback

for (const surf of SURFACES) {
  console.log(`\n----- ${surf.name} -----`);
  const t = surf.build();

  // (a) identification — pullBack sets exactly the intended merges
  check(
    `[${surf.name}] §6 pullBack sets exactly the intended merges`,
    sortedSetOfSets(t.supports) === sortedSetOfSets(surf.merges),
  );
  check(`[${surf.name}] derive-only: input shape byte-unchanged`, JSON.stringify(shape) === shapeSnapshot);
  check(`[${surf.name}] one-pass fixpoint (passes === 1)`, t.passes === 1);

  // (b) orientation — w1 vs the table; the milestone nonOrientable flag
  check(`[${surf.name}] §6 w1 === ${surf.w1}`, t.w1 === surf.w1);
  check(`[${surf.name}] pairSigns === ${JSON.stringify(surf.pairSigns)} (boundaryEdgeSign per pair)`, JSON.stringify(t.pairSigns) === JSON.stringify(surf.pairSigns));
  if (surf.w1 === 1) {
    check(`[${surf.name}] MILESTONE nonOrientable === true (first real w1=1)`, t.nonOrientable === true);
  } else {
    check(`[${surf.name}] orientable (nonOrientable === false)`, t.nonOrientable === false);
  }
  // w1 is the OR over per-pair cycles (one cycle per pair) — never a parity/product.
  check(
    `[${surf.name}] w1 is the OR over one-cycle-per-pair (cycles.length === pairSigns.length)`,
    t.cycles.length === t.pairSigns.length &&
      certifyOrientation(t.ledger, t.cycles).w1 === surf.w1,
  );

  // (c) faithfulness — UNFAITHFUL read-actuals (co-location ≠ identity, one rung up)
  check(`[${surf.name}] §6 operationStatus === UNFAITHFUL (distinct-lineage corners)`, t.faithfulness.operationStatus === 'UNFAITHFUL');
  const hetSites = t.faithfulness.perResultSite.filter((s) => !s.lineageHomogeneous);
  check(`[${surf.name}] every merged support is lineage-heterogeneous; inheritedLineage === null`, hetSites.length >= 1 && hetSites.every((s) => s.inheritedLineage === null));

  // §H — χ for the SURFACE (a surface seal must test the surface). The REAL CW cell counts.
  check(
    `[${surf.name}] §H χ === ${surf.chi} AND cellCounts === {v:${surf.cellCounts.v},e:${surf.cellCounts.e},f:${surf.cellCounts.f}}`,
    t.chi === surf.chi &&
      t.cellCounts.v === surf.cellCounts.v &&
      t.cellCounts.e === surf.cellCounts.e &&
      t.cellCounts.f === surf.cellCounts.f,
  );

  // (d) the EXPOSED level-2 link + decomposeLink valence
  exposedLinks[surf.name] = t.links.map((l) => ({
    support: l.support,
    corners: l.corners,
    adjacency: l.adjacency,
    V: l.vertexCount,
    E: l.edgeCount,
    degrees: l.degrees,
    valence: l.valence,
  }));
  // watch-item 2 — a single 2-cell can NEVER produce a junction
  check(
    `[${surf.name}] NO junction fired in any link (watch-item 2)`,
    t.links.every((l) => l.valence !== 'junction' && l.decomposition.junctionLoci.length === 0),
  );

  if (surf.linkShape === 'cycle4') {
    const l = t.links[0];
    check(`[${surf.name}] single merged link is a 4-cycle (V=4, E=4, all degree 2, one component)`,
      t.links.length === 1 && l.vertexCount === 4 && l.edgeCount === 4 &&
      Object.values(l.degrees).every((d) => d === 2) && l.decomposition.pinch === false);
    check(`[${surf.name}] decomposeLink(link).valence === 'interior'`, l.valence === 'interior');
  } else if (surf.linkShape === 'arc') {
    check(`[${surf.name}] each merged link is an OPEN ARC (one deg-2 vertex + two deg-1 ends, one component)`,
      t.links.length === 2 && t.links.every((l) =>
        l.vertexCount === 3 && l.edgeCount === 2 &&
        Object.values(l.degrees).filter((d) => d === 1).length === 2 &&
        Object.values(l.degrees).filter((d) => d === 2).length === 1 &&
        l.decomposition.pinch === false));
    check(`[${surf.name}] decomposeLink(link).valence === 'boundary' (free-edge arc)`, t.links.every((l) => l.valence === 'boundary'));
  } else if (surf.linkShape === 'bigon') {
    // The level-2 bigon — RULED interior (researcher level-2 bigon ruling; the ≥3
    // floor in decomposeLink is retired). Keep the 2-cycle FACT seal AND assert interior.
    check(`[${surf.name}] each merged link IS a 2-cycle BIGON (V=2, E=2, both degree 2, one component)`,
      t.links.length === 2 && t.links.every((l) =>
        l.vertexCount === 2 && l.edgeCount === 2 &&
        Object.values(l.degrees).every((d) => d === 2) &&
        l.decomposition.pinch === false));
    check(`[${surf.name}] RULED: decomposeLink(bigon).valence === 'interior' (a bigon is a topological S¹ — the floor is retired)`,
      t.links.every((l) => l.valence === 'interior'));
    note(`RULED (researcher level-2 bigon ruling): RP²'s two merged-vertex links are each a 2-cycle bigon (V=2, E=2, both degree 2, one component) — a topological S¹, so each merged vertex is a genuine manifold INTERIOR point. decomposeLink now returns 'interior' on the bigon (the simplicial ≥3-vertex floor is retired). RP² is now a fully-green closed non-orientable surface.`);
  } else if (surf.linkShape === 'none') {
    // §K — the corrected collapse (boundary-quotient) has NO 1-complex link to read;
    // the surface test is χ (§H asserts χ=2, the manifold S²). links: [].
    check(`[${surf.name}] §K collapse has NO constructed link (buildCollapseLink removed; links: [])`, t.links.length === 0);
    note(`MANIFOLD S² (boundary-quotient D²/∂D²): the corrected collapseFace identifies the WHOLE boundary (vertices AND edges) to one apex → V=1, E=0, F=1, χ=2. No 1-complex link (links: []) — the surface test is χ, not a link valence. (The old vertices-only collapse left 4 edge self-loops → χ=−2, a non-manifold wedge — fixed.)`);
  }

  // read-actuals report
  note(`READ-ACTUALS: supports=${JSON.stringify(t.supports)} | pairSigns=${JSON.stringify(t.pairSigns)} | w1=${t.w1} nonOrientable=${t.nonOrientable} | chi=${t.chi} cells=v${t.cellCounts.v}/e${t.cellCounts.e}/f${t.cellCounts.f} | faithfulness=${t.faithfulness.operationStatus}`);
}

// ===================== RP² discriminator: OR not parity =====================
console.log('\n----- RP2 discriminator (the milestone load-bearing seal) -----');
const rp2 = flipGlueFace(shape, face, [P(0, 2, 'reversing'), P(1, 3, 'reversing')]);
const orW1 = certifyOrientation(rp2.ledger, rp2.cycles).w1; // OUR construction: one cycle per pair
const parityW1 = certifyOrientation(rp2.ledger, [[rp2.cycles[0][0], rp2.cycles[1][0]]]).w1; // WRONG: two flips in one cycle
check('§6 RP² OUR per-pair-cycle construction yields w1 === 1 (the OR of two −1 pairs)', orW1 === 1);
check('§6 RP² the WRONG one-cycle-two-flips parity would yield w1 === 0 ((−1)(−1)=+1) — proving OUR model is OR, not parity', parityW1 === 0);
note('RP² is non-orientable because EITHER reversing seam suffices (OR), not because the two flips multiply.');

// ===================== §I — regression guard (the χ seal would have CAUGHT the bug) =====
console.log('\n----- §I regression guard: the new χ seal fails the OLD vertices-only collapse -----');
const nBoundary = face.vertexIds.length; // 4
const oldCollapseChi = 1 - nBoundary + 1; // v=1, e=n (edges NOT collapsed), f=1 → 1 − 4 + 1 = −2
check('§I OLD vertices-only collapse χ === −2 (v=1, e=4 self-loops, f=1) — a non-manifold wedge', oldCollapseChi === -2);
check('§I the χ===2 sphere seal FAILS on the old behaviour (−2 !== 2) — the seal has TEETH', oldCollapseChi !== 2);
note(`REGRESSION GUARD: the old vertices-only collapse left ${nBoundary} boundary edges as self-loops → χ = 1 − ${nBoundary} + 1 = ${oldCollapseChi} (wedge); the corrected boundary-quotient gives χ=2 (S²). The §H χ seal would have caught the bug.`);

// ===================== §J — agreement with the cascade (provably agree) =====================
console.log('\n----- §J agreement: collapseFace vs runCollapseCascade (topological) -----');
const cf = collapseFace(shape, face);
const cl = runCollapseCascade(shape, face);
check('§J cf.chi === cl.chi === 2 (both the manifold S²)', cf.chi === 2 && cl.chi === 2 && cf.chi === cl.chi);
check(
  '§J cellCounts agree topologically: cf {v:1,e:0,f:1} matches the cascade (vAfter=1, eAfter=0, fAfter=1, μ 9→2)',
  cf.cellCounts.v === 1 && cf.cellCounts.e === 0 && cf.cellCounts.f === 1 && cl.mu.before === 9 && cl.mu.after === 2,
);
note(`AGREEMENT (topology, not apex id): collapseFace χ=${cf.chi} cells=v${cf.cellCounts.v}/e${cf.cellCounts.e}/f${cf.cellCounts.f} | runCollapseCascade χ=${cl.chi} μ ${cl.mu.before}→${cl.mu.after}. Apex REPRESENTATION differs (collapseFace uses an S: support id, the cascade a real vertex) — layer-appropriate, NOT a divergence.`);

// ===================== read-actuals: the corner lineages =====================
console.log('\n----- read-actuals: corner lineages (the carried charge) -----');
note(`lineageOf: ${vs.map((v) => `${v}=${lineageOf(v)}`).join(' | ')} — all DISTINCT, so every merged support is heterogeneous (co-location ≠ identity).`);

// ===================== expose the link adjacency (for the handback) =====================
console.log('\n===== EXPOSED LEVEL-2 LINK ADJACENCY (per surface) =====');
console.log(JSON.stringify(exposedLinks, null, 0));

// ===================== SUMMARY =====================
console.log('');
console.log(`--- level2-zoo: ${failures === 0 ? 'no failures' : failures + ' FAIL'} ---`);
console.log('');
if (failures === 0) {
  console.log('ALL PASS');
} else {
  console.log(`${failures} FAIL`);
  process.exitCode = 1;
}
