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
  },
  {
    name: 'torus',
    build: () => glueFace(shape, face, [P(0, 2, 'preserving'), P(1, 3, 'preserving')]),
    merges: { 's': [A, B, C, D] },
    pairSigns: [1, 1],
    w1: 0,
    linkShape: 'cycle4', // single 4-cycle — interior
    valence: 'interior',
  },
  {
    name: 'mobius',
    build: () => flipGlueFace(shape, face, [P(0, 2, 'reversing')]),
    merges: { 's1': [A, C], 's2': [B, D] },
    pairSigns: [-1],
    w1: 1,
    linkShape: 'arc',
    valence: 'boundary',
  },
  {
    name: 'klein',
    build: () => flipGlueFace(shape, face, [P(0, 2, 'preserving'), P(1, 3, 'reversing')]),
    merges: { 's': [A, B, C, D] },
    pairSigns: [1, -1],
    w1: 1,
    linkShape: 'cycle4',
    valence: 'interior',
  },
  {
    name: 'rp2',
    build: () => flipGlueFace(shape, face, [P(0, 2, 'reversing'), P(1, 3, 'reversing')]),
    merges: { 's1': [A, C], 's2': [B, D] },
    pairSigns: [-1, -1],
    w1: 1,
    linkShape: 'bigon', // 2-cycle — the level-2 bigon (watch-item 1, deferred)
    valence: null, // NOT asserted — surfaced
  },
  {
    name: 'sphere',
    build: () => collapseFace(shape, face),
    merges: { 's': [A, B, C, D] },
    pairSigns: [],
    w1: 0,
    linkShape: 'cycle4', // cone base — interior
    valence: 'interior',
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
    // WATCH-ITEM 1 — the level-2 bigon. Assert the FACT (2-cycle), do NOT assert interior/boundary.
    check(`[${surf.name}] WATCH-ITEM 1: each merged link IS a 2-cycle BIGON (V=2, E=2, both degree 2, one component)`,
      t.links.length === 2 && t.links.every((l) =>
        l.vertexCount === 2 && l.edgeCount === 2 &&
        Object.values(l.degrees).every((d) => d === 2) &&
        l.decomposition.pinch === false));
    note(`SURFACED (deferred): RP²'s merged-vertex link is a 2-cycle bigon. decomposeLink returns '${t.links[0].valence}' on it (its level-2/S¹ interior floor is ≥3 vertices), so interior/boundary is NOT asserted here — the level-2 bigon is the open researcher question (the analogue of the level-1 degree-2 ruling). RP²'s ledger / faithfulness / w1 still seal green; only its valence is the surfaced finding.`);
  }

  // read-actuals report
  note(`READ-ACTUALS: supports=${JSON.stringify(t.supports)} | pairSigns=${JSON.stringify(t.pairSigns)} | w1=${t.w1} nonOrientable=${t.nonOrientable} | faithfulness=${t.faithfulness.operationStatus}`);
}

// ===================== RP² discriminator: OR not parity =====================
console.log('\n----- RP2 discriminator (the milestone load-bearing seal) -----');
const rp2 = flipGlueFace(shape, face, [P(0, 2, 'reversing'), P(1, 3, 'reversing')]);
const orW1 = certifyOrientation(rp2.ledger, rp2.cycles).w1; // OUR construction: one cycle per pair
const parityW1 = certifyOrientation(rp2.ledger, [[rp2.cycles[0][0], rp2.cycles[1][0]]]).w1; // WRONG: two flips in one cycle
check('§6 RP² OUR per-pair-cycle construction yields w1 === 1 (the OR of two −1 pairs)', orW1 === 1);
check('§6 RP² the WRONG one-cycle-two-flips parity would yield w1 === 0 ((−1)(−1)=+1) — proving OUR model is OR, not parity', parityW1 === 0);
note('RP² is non-orientable because EITHER reversing seam suffices (OR), not because the two flips multiply.');

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
