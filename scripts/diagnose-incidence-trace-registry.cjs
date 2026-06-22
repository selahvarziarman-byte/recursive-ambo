#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  }).outputText;

  module._compile(output, filename);
};

const repoRoot = path.resolve(__dirname, '..');
// Requiring the real registry module is the mock-solution guard: delete
// incidenceTraceRegistry.ts and this require throws.
const { buildIncidenceTraceRegistry, decomposeLink } = require(
  path.join(repoRoot, 'src/lib/incidenceTraceRegistry.ts'),
);
const { createSeedShape } = require(path.join(repoRoot, 'src/data/seeds.ts'));
const { applyAmboDissection } = require(path.join(repoRoot, 'src/lib/ambo.ts'));
// atomicRegistry is the REGRESSION ANCHOR — imported ONLY by the diagnostic (the
// module under test must NOT import it). Trace△ (face-mediation) readings are
// checked one-for-one against its supported edge-mediation contexts.
const { buildAtomicRegistryReport } = require(path.join(repoRoot, 'src/lib/atomicRegistry.ts'));

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`PASS - ${label}`);
  } else {
    console.log(`FAIL - ${label}`);
    failures += 1;
  }
}

// g1 = the gen-1 ambo-dissection of a seed's seed-cell.
const g1 = (seed) => {
  const sh = createSeedShape(seed);
  const c = sh.cells.find((x) => x.kind === 'seed');
  return applyAmboDissection(sh, c.id);
};
const scopedMidpoints = (sh) =>
  Object.values(sh.vertices).filter(
    (v) => v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2,
  );
const sameSet = (a, b) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && [...sa].every((x) => sb.has(x));
};

// ---- fixtures: tetra g1 (dissect seed) + g2 (dissect the gen-1 octa core) ----
const s1 = applyAmboDissection(createSeedShape('tetrahedron'));
const octaCoreId = s1.generations[s1.generations.length - 1].createdCellIds[0];
const s2 = applyAmboDissection(s1, octaCoreId);
const report = buildIncidenceTraceRegistry(s2);
const cubo = report.cellBodies.find((b) => b.cellTopology === 'cuboctahedron');

// ===================== STATUS LINES (spec preamble literals) ================
check('method exact = incidence-trace-registry-v0', report.method === 'incidence-trace-registry-v0');
check('scope exact = incidence-only', report.scope === 'incidence-only');
check('semanticStatus exact = not-semantic-naming', report.semanticStatus === 'not-semantic-naming');
check('shapeMutationStatus exact = not-shape-mutation', report.shapeMutationStatus === 'not-shape-mutation');
check('packetWriteStatus exact = not-packet-writing', report.packetWriteStatus === 'not-packet-writing');

// ===================== CUBOCTAHEDRON BODY (spec §4 numbers) =================
check('a cuboctahedron cellBody is present', Boolean(cubo));
check('cubo.squareCount === 6', cubo && cubo.squareCount === 6);
check('cubo.vertexCount === 12', cubo && cubo.vertexCount === 12);
check('cubo.policyPrecheckStatus === applicable', cubo && cubo.policyPrecheckStatus === 'applicable');
check('cubo.matchingCount === 2 (the pyritohedral chiral pair)', cubo && cubo.matchingCount === 2);
check('cubo.status === multiple', cubo && cubo.status === 'multiple');
check('cubo.selectedMatching === null (registry does NOT select)', cubo && cubo.selectedMatching === null);

// ===================== SQUARE-PYRAMID RESIDUE BODIES (§4 BINDING RULE) =======
const squarePyramidBodies = report.cellBodies.filter((b) =>
  String(b.cellTopology).includes('square-pyramid'),
);
check('square-pyramid residue cellBodies are present (>=1)', squarePyramidBodies.length >= 1);
check('every square-pyramid residue cellBody has status === not-applicable-by-count',
  squarePyramidBodies.length >= 1 &&
    squarePyramidBodies.every((b) => b.status === 'not-applicable-by-count'));

// ===================== HONESTY / GENERAL ====================================
check('report.issues is empty on clean tetra g1+g2 shape',
  Array.isArray(report.issues) && report.issues.length === 0);

// ===================== P2: per-site Trace△ ONE-FOR-ONE (3 seeds) =============
// For each seed's g1, build the registry and compare face-mediation to the
// REAL atomicRegistry per scoped midpoint. tetra & octa: atomicRegistry
// SUPPORTED (2 triangle contexts each). cube: atomicRegistry UNSUPPORTED
// (non-triangular-context) — its square contexts are exactly what Trace□ serves.

function faceMediationReadings(site) {
  return site.readings.filter((r) => r.contextKind === 'face-mediation');
}

// --- supported seeds: tetra & octa ---
let firstTetraFaceMediationSite = null;
for (const seed of ['tetrahedron', 'octahedron']) {
  const sh = g1(seed);
  const rep = buildIncidenceTraceRegistry(sh);
  const mids = scopedMidpoints(sh);

  let allTriCount2 = mids.length > 0;
  let allOneForOne = mids.length > 0;
  let allApexSetMatch = mids.length > 0;
  let allPairsMatch = mids.length > 0;
  let allVf2 = mids.length > 0;
  let allSq0 = mids.length > 0;

  for (const mid of mids) {
    const site = rep.sites.find((s) => s.scopedVertexId === mid.id);
    const ar = buildAtomicRegistryReport(sh, mid.id);
    if (!site || ar.status !== 'supported') {
      allTriCount2 = allOneForOne = allApexSetMatch = allPairsMatch = allVf2 = allSq0 = false;
      break;
    }
    const fm = faceMediationReadings(site);
    if (site.triangleTraceCount !== 2) allTriCount2 = false;
    if (site.triangleTraceCount !== ar.triangularFaceContexts.length) allOneForOne = false;

    const fmApexes = fm.map((r) => r.apex);
    const arProj = ar.candidateReadings[0].projectionSourceVertexIds;
    if (!sameSet(fmApexes, arProj)) allApexSetMatch = false;

    // every face-mediation (generatedFaceId, sourceFaceId) matches an atomicRegistry context
    const arPairs = new Set(
      ar.triangularFaceContexts.map((c) => `${c.generatedFaceId}|${c.sourceFaceId}`),
    );
    if (!fm.every((r) => arPairs.has(`${r.generatedFaceId}|${r.sourceFaceId}`))) allPairsMatch = false;

    if (site.vertexFigureCount !== 2) allVf2 = false;
    if (site.squareTraceCount !== 0) allSq0 = false;

    if (seed === 'tetrahedron' && !firstTetraFaceMediationSite && fm.length) {
      firstTetraFaceMediationSite = site;
    }
  }

  const S = seed === 'tetrahedron' ? 'TETRA' : 'OCTA';
  check(`${S} g1: every midpoint triangleTraceCount === 2`, allTriCount2);
  check(`${S} g1: triangleTraceCount === atomicRegistry.triangularFaceContexts.length (one-for-one)`, allOneForOne);
  check(`${S} g1: set(face-mediation apexes) === set(atomicRegistry projectionSourceVertexIds)`, allApexSetMatch);
  check(`${S} g1: every (generatedFaceId, sourceFaceId) matches an atomicRegistry context`, allPairsMatch);
  check(`${S} g1: every midpoint vertexFigureCount === 2`, allVf2);
  check(`${S} g1: every midpoint squareTraceCount === 0`, allSq0);
  check(`${S} g1: report.issues empty`, Array.isArray(rep.issues) && rep.issues.length === 0);
}

// --- unsupported seed: cube (atomicRegistry rejects as non-triangular-context) ---
{
  const sh = g1('cube');
  const rep = buildIncidenceTraceRegistry(sh);
  const mids = scopedMidpoints(sh);

  let allTri0 = mids.length > 0;
  let allUnsupported = mids.length > 0;
  let allSq2 = mids.length > 0;
  let allVf2 = mids.length > 0;

  for (const mid of mids) {
    const site = rep.sites.find((s) => s.scopedVertexId === mid.id);
    const ar = buildAtomicRegistryReport(sh, mid.id);
    if (!site) {
      allTri0 = allUnsupported = allSq2 = allVf2 = false;
      break;
    }
    if (site.triangleTraceCount !== 0) allTri0 = false;
    if (!(ar.status === 'unsupported' && ar.reason === 'non-triangular-context')) allUnsupported = false;
    if (site.squareTraceCount !== 2) allSq2 = false;
    if (site.vertexFigureCount !== 2) allVf2 = false;
  }

  check('CUBE g1: every midpoint triangleTraceCount === 0', allTri0);
  check("CUBE g1: atomicRegistry status === 'unsupported' && reason === 'non-triangular-context'", allUnsupported);
  check('CUBE g1: every midpoint squareTraceCount === 2', allSq2);
  check('CUBE g1: every midpoint vertexFigureCount === 2', allVf2);
  check('CUBE g1: report.issues empty', Array.isArray(rep.issues) && rep.issues.length === 0);
}

// --- ALL: every face-mediation medialCycle has 3 distinct midpoint ids ---
{
  let allMedial3 = true;
  let anyChecked = false;
  for (const seed of ['tetrahedron', 'octahedron', 'cube']) {
    const sh = g1(seed);
    const rep = buildIncidenceTraceRegistry(sh);
    for (const site of rep.sites) {
      for (const r of faceMediationReadings(site)) {
        anyChecked = true;
        if (!(Array.isArray(r.medialCycle) && new Set(r.medialCycle).size === 3)) allMedial3 = false;
      }
    }
  }
  check('ALL g1: every face-mediation medialCycle has 3 distinct midpoint ids', anyChecked && allMedial3);
}

// ===================== P3: per-reading DETAIL (face-coherence + vertex-figure) ====
// Sealed numbers grounded by the researcher's probe.
let firstCubeFaceCoherence = null;
let firstOctaVertexFigure = null;

// --- CUBE g1: face-coherence (Trace□ + Coh□) detail ---
{
  const sh = g1('cube');
  const rep = buildIncidenceTraceRegistry(sh);
  const vById = sh.vertices;
  let any = false;
  let cand2 = true;
  let real = true;
  let notParent = true;
  let oppReal = true;
  let oppMedial = true;
  let routesOk = true;
  let cohStatus = true;
  let cohRes = true;
  for (const site of rep.sites) {
    const parents = new Set(site.parents);
    for (const r of site.readings) {
      if (r.contextKind !== 'face-coherence') continue;
      any = true;
      if (Array.isArray(r.candidateApexes) && r.candidateApexes.length === 2) {
        if (!r.candidateApexes.every((v) => Boolean(vById[v]))) real = false;
        if (r.candidateApexes.some((v) => parents.has(v))) notParent = false;
      } else {
        cand2 = false;
      }
      if (!(r.opposite && vById[r.opposite] && vById[r.opposite].createdBy.operation === 'ambo-dissection')) {
        oppReal = false;
      }
      if (!(r.opposite && Array.isArray(r.medialCycle) && r.medialCycle.includes(r.opposite))) {
        oppMedial = false;
      }
      if (!(Array.isArray(r.routes) && r.routes.length === 2 && r.routes.every((p) => Array.isArray(p)))) {
        routesOk = false;
      }
      if (!(r.coh && r.coh.status === 'two-candidate-apexes')) cohStatus = false;
      if (!(r.coh && r.coh.resolution === 'deferred-to-source-square-diagonalization')) cohRes = false;
      if (!firstCubeFaceCoherence) firstCubeFaceCoherence = r;
    }
  }
  check('CUBE g1: face-coherence readings exist', any);
  check('CUBE g1: every face-coherence candidateApexes.length === 2', any && cand2);
  check('CUBE g1: every candidateApex is a real source vertex', any && real);
  check('CUBE g1: no candidateApex equals a parent', any && notParent);
  check('CUBE g1: every opposite is a real generated midpoint', any && oppReal);
  check('CUBE g1: every opposite ∈ its reading medialCycle', any && oppMedial);
  check('CUBE g1: every routes is a length-2 array of source-vertex paths', any && routesOk);
  check("CUBE g1: every coh.status === 'two-candidate-apexes'", any && cohStatus);
  check("CUBE g1: every coh.resolution === 'deferred-to-source-square-diagonalization'", any && cohRes);
}

// --- OCTA g1: vertex-figure deg-4 -> GlobalSquareResolution link ---
{
  const sh = g1('octahedron');
  const rep = buildIncidenceTraceRegistry(sh);
  const cuboBody = rep.cellBodies.find((b) => b.cellTopology === 'cuboctahedron');
  let any = false;
  let deg4 = true;
  let linkOk = true;
  for (const site of rep.sites) {
    for (const r of site.readings) {
      if (r.contextKind !== 'vertex-figure') continue;
      any = true;
      if (r.degree !== 4) deg4 = false;
      if (!(cuboBody && r.globalSquareResolutionLink === cuboBody.cellId)) linkOk = false;
      if (!firstOctaVertexFigure) firstOctaVertexFigure = r;
    }
  }
  check('OCTA g1: vertex-figure readings exist', any);
  check('OCTA g1: every vertex-figure degree === 4', any && deg4);
  check('OCTA g1: a cuboctahedron cellBody is present', Boolean(cuboBody));
  check('OCTA g1: every vertex-figure globalSquareResolutionLink === cuboctahedron cellBody cellId', any && linkOk);
  check('OCTA g1: that cuboctahedron cellBody.matchingCount === 2', Boolean(cuboBody) && cuboBody.matchingCount === 2);
}

// --- TETRA g1: vertex-figure deg-3 -> no GSR link ---
{
  const sh = g1('tetrahedron');
  const rep = buildIncidenceTraceRegistry(sh);
  let any = false;
  let deg3 = true;
  let linkNull = true;
  for (const site of rep.sites) {
    for (const r of site.readings) {
      if (r.contextKind !== 'vertex-figure') continue;
      any = true;
      if (r.degree !== 3) deg3 = false;
      if (r.globalSquareResolutionLink !== null) linkNull = false;
    }
  }
  check('TETRA g1: vertex-figure readings exist', any);
  check('TETRA g1: every vertex-figure degree === 3', any && deg3);
  check('TETRA g1: every vertex-figure globalSquareResolutionLink === null', any && linkNull);
}

// --- ALL seeds: face-mediation readings keep every P3 field null (P2 shape preserved); issues empty ---
{
  let anyFm = false;
  let allNull = true;
  let issuesEmpty = true;
  for (const seed of ['tetrahedron', 'octahedron', 'cube']) {
    const sh = g1(seed);
    const rep = buildIncidenceTraceRegistry(sh);
    if (!(Array.isArray(rep.issues) && rep.issues.length === 0)) issuesEmpty = false;
    for (const site of rep.sites) {
      for (const r of site.readings) {
        if (r.contextKind !== 'face-mediation') continue;
        anyFm = true;
        if (
          !(
            r.candidateApexes === null &&
            r.opposite === null &&
            r.routes === null &&
            r.coh === null &&
            r.degree === null &&
            r.globalSquareResolutionLink === null
          )
        ) {
          allNull = false;
        }
      }
    }
  }
  check('ALL g1: face-mediation readings keep candidateApexes/opposite/routes/coh/degree/globalSquareResolutionLink === null', anyFm && allNull);
  check('ALL g1: report.issues empty (P3 detail builds)', issuesEmpty);
}

// ===================== P4: per-target tally (registry v0 accounting) =========
// Internal-consistency seals on the existing s2 cuboctahedron fixture (tetra
// g1+g2): the tally must agree with a direct recount of report.sites[].readings.
let s2TargetTally = null;
let bTwinTargetTally = null;
{
  const tally = report.targetTally;
  s2TargetTally = tally;
  const allReadings = report.sites.flatMap((s) => s.readings);
  const countKind = (k) => allReadings.filter((r) => r.contextKind === k).length;
  const censusSum = Object.values(tally.coreFaceSizeCensus).reduce((a, b) => a + b, 0);

  check('P4 s2: targetMidpointCount === report.sites.length', tally.targetMidpointCount === report.sites.length);
  // §A: census is a SIZE cross-check; the candidate*/vertexFigure counts are DERIVATION.
  check('P5 §A s2: sum(coreFaceSizeCensus) === total readings across all sites', censusSum === allReadings.length);
  check('P5 §A s2: contextsDroppedByLegacyAtomicRegistry === candidateSquareReadings + vertexFigureCount',
    tally.contextsDroppedByLegacyAtomicRegistry === tally.candidateSquareReadings + tally.vertexFigureCount);
  check('P5 §A s2: candidateTriangleReadings === #face-mediation readings',
    tally.candidateTriangleReadings === countKind('face-mediation'));
  check('P5 §A s2: candidateSquareReadings === #face-coherence readings',
    tally.candidateSquareReadings === countKind('face-coherence'));
  check('P5 §A s2: vertexFigureCount === #vertex-figure readings',
    tally.vertexFigureCount === countKind('vertex-figure'));
  check('P5 §A s2: candidateTriangle + candidateSquare + vertexFigure === total readings (derivation triple partitions)',
    tally.candidateTriangleReadings + tally.candidateSquareReadings + tally.vertexFigureCount === allReadings.length);
  // §A divergence self-test: SIZE != DERIVATION (proves the derivation axis does real work).
  check('P5 §A s2: DIVERGENCE — coreFaceSizeCensus["4gon"] === 24 AND candidateSquareReadings === 0',
    tally.coreFaceSizeCensus['4gon'] === 24 && tally.candidateSquareReadings === 0);
  check("P4 s2: bTwinCollapsePolicy === 'none'", tally.bTwinCollapsePolicy === 'none');
  check('P4 s2: bTwinGroupsSeen === 0 (nested single-cell-per-step chain — no B-twins)',
    tally.bTwinGroupsSeen === 0);
}

// B-twin detection seal (researcher-specified fixture — exercises a NON-zero
// count so the field is not vacuously sealed). Octahedron g1 -> dissect the core
// -> dissect a gen-1 residue (shares a source edge with the core).
{
  const o0 = createSeedShape('octahedron');
  const oSeed = o0.cells.find((c) => c.kind === 'seed');
  const o1 = applyAmboDissection(o0, oSeed.id); // gen-1: cuboctahedron core + square-pyramid residues
  const core1 = o1.cells.find((c) => c.topology === 'cuboctahedron'); // the gen-1 core
  const o2 = applyAmboDissection(o1, core1.id); // ambo(core)
  const res1 = o1.cells
    .filter((c) => c.kind === 'residue')
    .sort((a, b) => a.id.localeCompare(b.id))[0]; // a gen-1 residue (square-pyramid), deterministic
  const o3 = applyAmboDissection(o2, res1.id); // ambo(residue) — shares a source edge with the core
  const repBT = buildIncidenceTraceRegistry(o3);
  bTwinTargetTally = repBT.targetTally;

  // SEAL (researcher-measured). A mismatch is a FINDING for the engineer/
  // researcher — do NOT coerce the field to fit the seal.
  check('P4 B-twin fixture: repBT.targetTally.bTwinGroupsSeen === 4 (researcher-measured)',
    repBT.targetTally.bTwinGroupsSeen === 4);
  check('P4 B-twin fixture: repBT.issues empty', Array.isArray(repBT.issues) && repBT.issues.length === 0);
}

// ===================== P5 §B: GlueCoh-v2 per-site manifold gate =============
// g1 (every seed): each site's incident core-faces form a closed fan of 4 ->
// the vertex link is a single 4-cycle -> status 'glued'.
let firstGluedSite = null;
for (const seed of ['tetrahedron', 'octahedron', 'cube']) {
  const sh = g1(seed);
  const rep = buildIncidenceTraceRegistry(sh);
  let allGlued = rep.sites.length > 0;
  for (const site of rep.sites) {
    const gc = site.glueCoh;
    if (
      !(
        gc &&
        gc.contextCount === 4 &&
        gc.linkVertexCount === 4 &&
        gc.linkIsSingleCycle === true &&
        gc.status === 'glued'
      )
    ) {
      allGlued = false;
    }
    if (!firstGluedSite && gc && gc.status === 'glued') firstGluedSite = site;
  }
  const S = seed === 'tetrahedron' ? 'TETRA' : seed === 'octahedron' ? 'OCTA' : 'CUBE';
  check(`${S} g1: every site glueCoh {contextCount:4, linkVertexCount:4, linkIsSingleCycle:true, status:'glued'}`, allGlued);
}

// s2 (tetra g1+g2): a MIX — retired gen-1 midpoints have 0 core-contexts
// ('no-core-context'); live midpoints are 'glued' single cycles.
{
  let ok = report.sites.length > 0;
  let noCore = 0;
  let glued = 0;
  for (const site of report.sites) {
    const gc = site.glueCoh;
    if (gc.contextCount === 0) {
      noCore += 1;
      if (gc.status !== 'no-core-context') ok = false;
    } else {
      glued += 1;
      if (!(gc.status === 'glued' && gc.linkIsSingleCycle === true)) ok = false;
    }
  }
  check('P5 §B s2: every site is (0 ctx -> no-core-context) OR (>0 ctx -> glued single-cycle)', ok);
  check('P5 §B s2: MIX present — >=1 no-core-context AND >=1 glued (both branches exercised)',
    noCore >= 1 && glued >= 1);
}

// ALL fixtures: no site is 'non-manifold-overlap'; report.issues stays empty.
{
  let noOverlap = true;
  let issuesEmpty = true;
  const fixtures = [report];
  for (const seed of ['tetrahedron', 'octahedron', 'cube']) {
    fixtures.push(buildIncidenceTraceRegistry(g1(seed)));
  }
  for (const rep of fixtures) {
    if (!(Array.isArray(rep.issues) && rep.issues.length === 0)) issuesEmpty = false;
    for (const site of rep.sites) {
      if (site.glueCoh.status === 'non-manifold-overlap') noOverlap = false;
    }
  }
  check('P5 §B ALL fixtures: NO site status === non-manifold-overlap', noOverlap);
  check('P5 §B ALL fixtures: report.issues empty (glueCoh builds clean)', issuesEmpty);
}

// ===================== P7 §B: four-valued split on SYNTHETIC links ===========
// Feed explicit adjacency Maps DIRECTLY to decomposeLink. These STAND IN for
// post-identification (quotient) links — the rigid substrate never produces them
// (§C proves it). Each edge is added as TWO half-edges (undirected), exactly the
// way buildSiteGlueCoh builds the real link. The committed 'non-manifold-overlap'
// FUSED boundary (valence 1) with branch/pinch (valence >2); this SPLITS them —
// boundary lands 'boundary' (MANIFOLD), branch/pinch land 'junction'.
const undirected = (edges) => {
  const m = new Map();
  const add = (a, b) => {
    const list = m.get(a);
    if (list) list.push(b);
    else m.set(a, [b]);
  };
  for (const [a, b] of edges) {
    add(a, b);
    add(b, a);
  }
  return m;
};

// (1) closed 4-cycle a-b-c-d-a (all deg 2, 1 comp) -> interior
{
  const dec = decomposeLink(undirected([['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'a']]));
  check('P7 §B closed-4cycle: strata.length === 1', dec.strata.length === 1);
  check('P7 §B closed-4cycle: strata[0].closed === true', Boolean(dec.strata[0]) && dec.strata[0].closed === true);
  check('P7 §B closed-4cycle: strata[0].vertices === {a,b,c,d}',
    Boolean(dec.strata[0]) && dec.strata[0].vertices.length === 4 && sameSet(dec.strata[0].vertices, ['a', 'b', 'c', 'd']));
  check('P7 §B closed-4cycle: junctionLoci.length === 0', dec.junctionLoci.length === 0);
  check('P7 §B closed-4cycle: pinch === false', dec.pinch === false);
  check("P7 §B closed-4cycle: valence === 'interior'", dec.valence === 'interior');
  check("P7 §B closed-4cycle: throughPairingStatus === 'deferred' (hook only)", dec.throughPairingStatus === 'deferred');
}

// (2) boundary arc a-b-c (deg 1,2,1; 1 comp, open) -> boundary (kept MANIFOLD)
{
  const dec = decomposeLink(undirected([['a', 'b'], ['b', 'c']]));
  check('P7 §B boundary-arc: strata.length === 1', dec.strata.length === 1);
  check('P7 §B boundary-arc: strata[0].closed === false (a bounded arc)', Boolean(dec.strata[0]) && dec.strata[0].closed === false);
  check('P7 §B boundary-arc: strata[0].vertices === {a,b,c}',
    Boolean(dec.strata[0]) && dec.strata[0].vertices.length === 3 && sameSet(dec.strata[0].vertices, ['a', 'b', 'c']));
  check('P7 §B boundary-arc: junctionLoci.length === 0', dec.junctionLoci.length === 0);
  check('P7 §B boundary-arc: pinch === false', dec.pinch === false);
  check("P7 §B boundary-arc: valence === 'boundary' (NOT junction — the split)", dec.valence === 'boundary');
}

// (3) branch: center j + three length-2 arms j-a1-a2 / j-b1-b2 / j-c1-c2 (j deg 3) -> junction
{
  const dec = decomposeLink(
    undirected([['j', 'a1'], ['a1', 'a2'], ['j', 'b1'], ['b1', 'b2'], ['j', 'c1'], ['c1', 'c2']]),
  );
  check('P7 §B branch: strata.length === 3 (the walled arcs)', dec.strata.length === 3);
  check('P7 §B branch: every stratum is a bounded arc (closed === false)',
    dec.strata.length === 3 && dec.strata.every((s) => s.closed === false));
  check('P7 §B branch: every stratum has exactly 2 vertices (a length-2 arm)',
    dec.strata.length === 3 && dec.strata.every((s) => s.vertices.length === 2));
  check('P7 §B branch: no stratum contains the junction j (it is a WALL)',
    dec.strata.every((s) => !s.vertices.includes('j')));
  check('P7 §B branch: junctionLoci.length === 1', dec.junctionLoci.length === 1);
  check("P7 §B branch: junctionLoci[0] === {at:'j', degree:3}",
    Boolean(dec.junctionLoci[0]) && dec.junctionLoci[0].at === 'j' && dec.junctionLoci[0].degree === 3);
  check('P7 §B branch: pinch === false (j joins all arms — one component)', dec.pinch === false);
  check("P7 §B branch: valence === 'junction'", dec.valence === 'junction');
}

// (4) pinch: two disjoint triangles {a,b,c},{d,e,f} (all deg 2, 2 comps) -> junction
{
  const dec = decomposeLink(
    undirected([['a', 'b'], ['b', 'c'], ['c', 'a'], ['d', 'e'], ['e', 'f'], ['f', 'd']]),
  );
  check('P7 §B pinch: strata.length === 2', dec.strata.length === 2);
  check('P7 §B pinch: both strata closed === true', dec.strata.length === 2 && dec.strata.every((s) => s.closed === true));
  check('P7 §B pinch: junctionLoci.length === 0 (no degree>2 — it is a vertex-pinch)', dec.junctionLoci.length === 0);
  check('P7 §B pinch: pinch === true (2 connected components)', dec.pinch === true);
  check("P7 §B pinch: valence === 'junction'", dec.valence === 'junction');
}

// THE SPLIT, stated once: boundary and branch/pinch land on DIFFERENT valences.
{
  const boundary = decomposeLink(undirected([['a', 'b'], ['b', 'c']]));
  const branch = decomposeLink(undirected([['j', 'a1'], ['a1', 'a2'], ['j', 'b1'], ['b1', 'b2'], ['j', 'c1'], ['c1', 'c2']]));
  const pinch = decomposeLink(undirected([['a', 'b'], ['b', 'c'], ['c', 'a'], ['d', 'e'], ['e', 'f'], ['f', 'd']]));
  check('P7 §B SPLIT: boundary.valence !== branch.valence !== (it is no longer fused)',
    boundary.valence === 'boundary' && branch.valence === 'junction' && pinch.valence === 'junction' && boundary.valence !== branch.valence);
}

// ===================== §A: the ≥3 floor is RETIRED (researcher level-2 bigon ruling) =====
// interior ⟺ a single cycle S¹ at ANY length (every link-vertex degree 2, one
// component) — the simplicial ≥3-vertex floor is dropped. A bigon (length 2) and a
// self-loop (length 1) are legitimate S¹s; arcs / branches / pinches stay rejected.
{
  // BIGON: 2 vertices, 2 edges between them, both degree 2, one component -> interior (was 'boundary').
  const bigon = decomposeLink(undirected([['a', 'b'], ['a', 'b']]));
  check('§A bigon: valence === interior (was boundary under the ≥3 floor — the ruling)', bigon.valence === 'interior');
  check('§A bigon: 2 vertices, both degree 2', bigon.strata.length === 1 && sameSet(bigon.strata[0].vertices, ['a', 'b']));
  check('§A bigon: junctionLoci.length === 0 && pinch === false (a genuine single cycle)', bigon.junctionLoci.length === 0 && bigon.pinch === false);
  check('§A bigon: strata[0].closed === true (the cycle is closed)', Boolean(bigon.strata[0]) && bigon.strata[0].closed === true);

  // SELF-LOOP: 1 vertex with a loop edge, degree 2, one component -> interior (S¹ length 1).
  const selfLoop = decomposeLink(undirected([['a', 'a']]));
  check('§A self-loop: valence === interior (S¹ length 1 — the ruling)', selfLoop.valence === 'interior');
  check('§A self-loop: 1 vertex, degree 2, one component', selfLoop.strata.length === 1 && selfLoop.strata[0].vertices.length === 1 && selfLoop.junctionLoci.length === 0 && selfLoop.pinch === false);

  // STILL REJECTED — arc (degree-1 ends) stays boundary.
  const arc = decomposeLink(undirected([['a', 'b'], ['b', 'c']]));
  check('§A still-rejected ARC: valence === boundary (degree-1 ends, not a cycle)', arc.valence === 'boundary');

  // STILL REJECTED — figure-8 (one degree-4 branch vertex: two loops at one vertex) stays junction.
  const fig8 = decomposeLink(undirected([['a', 'a'], ['a', 'a']]));
  check('§A still-rejected FIGURE-8: valence === junction (one degree-4 branch vertex)', fig8.valence === 'junction' && fig8.junctionLoci.length === 1 && fig8.junctionLoci[0].degree === 4);

  // STILL REJECTED — two disjoint loops (2 components, all degree 2) stays junction via pinch.
  const twoLoops = decomposeLink(undirected([['a', 'a'], ['b', 'b']]));
  check('§A still-rejected TWO-DISJOINT-LOOPS: valence === junction (pinch — 2 components)', twoLoops.valence === 'junction' && twoLoops.pinch === true && twoLoops.junctionLoci.length === 0);

  // UNCHANGED — a ≥3 cycle (triangle) stays interior (the floor-drop changes nothing here).
  const triangle = decomposeLink(undirected([['a', 'b'], ['b', 'c'], ['c', 'a']]));
  check('§A unchanged ≥3 cycle (triangle): valence === interior', triangle.valence === 'interior' && triangle.junctionLoci.length === 0 && triangle.pinch === false);
}

// ===================== P7 §C: REGRESSION — rigid substrate has NO junctions ==
// Across every built body the diagnostic uses (tetra/octa/cube g1 AND the multi-
// gen octa -> ambo -> ambo(core) -> ambo(residue) fixture), the rigid vertex-link
// is ALWAYS one closed cycle: valence 'interior', status 'glued', a single closed
// stratum, no junction loci, no pinch. Retired midpoints (0 contexts) ->
// 'no-core-context'. HONESTY: a real site with contextCount 1 or 2 (neither 0 nor
// a >=3 closed fan) is NOT force-bucketed — it is collected and reported.
let p7RegressionFindings = [];
{
  const o0 = createSeedShape('octahedron');
  const oSeed = o0.cells.find((c) => c.kind === 'seed');
  const o1 = applyAmboDissection(o0, oSeed.id);
  const core1 = o1.cells.find((c) => c.topology === 'cuboctahedron');
  const o2 = applyAmboDissection(o1, core1.id);
  const res1 = o1.cells
    .filter((c) => c.kind === 'residue')
    .sort((a, b) => a.id.localeCompare(b.id))[0];
  const o3 = applyAmboDissection(o2, res1.id);

  const fixtures = [
    ['TETRA g1', buildIncidenceTraceRegistry(g1('tetrahedron'))],
    ['OCTA g1', buildIncidenceTraceRegistry(g1('octahedron'))],
    ['CUBE g1', buildIncidenceTraceRegistry(g1('cube'))],
    ['octa->ambo->ambo(core)->ambo(residue)', buildIncidenceTraceRegistry(o3)],
  ];

  let allInteriorOk = true;
  let allRetiredOk = true;
  let noBoundary = true;
  let noJunction = true;
  let anyInterior = false;
  let anyRetired = false;
  const oddContextSites = []; // contextCount 1 or 2 — a finding, never force-bucketed

  for (const [name, rep] of fixtures) {
    for (const site of rep.sites) {
      const gc = site.glueCoh;
      if (gc.contextCount === 0) {
        anyRetired = true;
        if (gc.status !== 'no-core-context') allRetiredOk = false;
      } else if (gc.contextCount >= 3) {
        anyInterior = true;
        if (
          !(
            gc.status === 'glued' &&
            gc.valence === 'interior' &&
            Array.isArray(gc.strata) &&
            gc.strata.length === 1 &&
            gc.strata[0].closed === true &&
            Array.isArray(gc.junctionLoci) &&
            gc.junctionLoci.length === 0 &&
            gc.pinch === false
          )
        ) {
          allInteriorOk = false;
        }
      } else {
        oddContextSites.push(
          `${name}:${site.scopedVertexId}(ctx=${gc.contextCount},valence=${gc.valence},status=${gc.status})`,
        );
      }
      if (gc.valence === 'boundary' || gc.status === 'boundary') noBoundary = false;
      if (gc.valence === 'junction' || gc.status === 'junction') noJunction = false;
    }
  }
  p7RegressionFindings = oddContextSites;

  check('P7 §C: contextCount>=3 sites exist (regression is non-vacuous)', anyInterior);
  check('P7 §C: retired (0-context) sites exist (the multi-gen fixture)', anyRetired);
  check('P7 §C: every contextCount>=3 site is glued/interior/1-closed-stratum/0-junction/no-pinch', allInteriorOk);
  check("P7 §C: every retired (0-context) site is 'no-core-context'", allRetiredOk);
  check('P7 §C: NO real site is boundary (the rigid link is never a free arc)', noBoundary);
  check('P7 §C: NO real site is junction (the rigid link is never a branch/pinch)', noJunction);
  check(
    `P7 §C: NO real site has contextCount 1 or 2 (honesty — finding count: ${oddContextSites.length})`,
    oddContextSites.length === 0,
  );
  if (oddContextSites.length) {
    console.log('FINDING (P7 §C) — unexpected rigid-substrate boundary / odd-context sites:');
    for (const s of oddContextSites) console.log('  ' + s);
  }
}

// ===================== eyeball: the full cuboctahedron cellBody =============
console.log('\n--- full cuboctahedron cellBody (GlobalSquareResolution) ---');
console.log(JSON.stringify(cubo, null, 2));

// ===================== eyeball: one face-mediation site (tetra g1) ==========
console.log('\n--- one face-mediation SiteIncidenceReading (tetra g1 midpoint) ---');
console.log(JSON.stringify(firstTetraFaceMediationSite, null, 2));

// ===================== eyeball: P3 detail readings ==========================
console.log('\n--- one face-coherence RelationalReading (cube g1) ---');
console.log(JSON.stringify(firstCubeFaceCoherence, null, 2));
console.log('\n--- one vertex-figure deg-4 RelationalReading (octa g1) ---');
console.log(JSON.stringify(firstOctaVertexFigure, null, 2));

// ===================== eyeball: P4 per-target tally =========================
console.log('\n--- s2 targetTally (per-target tally; tetra g1+g2) ---');
console.log(JSON.stringify(s2TargetTally, null, 2));
console.log('\n--- B-twin-fixture targetTally (octa g1 -> core -> residue) ---');
console.log(JSON.stringify(bTwinTargetTally, null, 2));

// ===================== eyeball: P5 §B one glued site's glueCoh =============
console.log('\n--- one glued SiteIncidenceReading.glueCoh (g1; now carries strata/junctionLoci/pinch/valence) ---');
console.log(JSON.stringify(firstGluedSite ? firstGluedSite.glueCoh : null, null, 2));
console.log('\n--- s2 glueCoh status split (no-core-context vs glued) ---');
console.log(
  JSON.stringify(
    report.sites.reduce((acc, s) => {
      acc[s.glueCoh.status] = (acc[s.glueCoh.status] || 0) + 1;
      return acc;
    }, {}),
    null,
    2,
  ),
);

// ===================== eyeball: P7 §B junction decompositions ===============
console.log('\n--- P7 §B branch decomposition (junction; 3 walled arcs, one deg-3 locus) ---');
console.log(
  JSON.stringify(
    decomposeLink(undirected([['j', 'a1'], ['a1', 'a2'], ['j', 'b1'], ['b1', 'b2'], ['j', 'c1'], ['c1', 'c2']])),
    null,
    2,
  ),
);
console.log('\n--- P7 §B pinch decomposition (junction; two closed strata, pinch=true) ---');
console.log(
  JSON.stringify(
    decomposeLink(undirected([['a', 'b'], ['b', 'c'], ['c', 'a'], ['d', 'e'], ['e', 'f'], ['f', 'd']])),
    null,
    2,
  ),
);
console.log('\n--- P7 §B boundary-arc decomposition (boundary; one open stratum, kept MANIFOLD) ---');
console.log(JSON.stringify(decomposeLink(undirected([['a', 'b'], ['b', 'c']])), null, 2));
console.log(
  `\n--- P7 §C rigid-substrate odd-context (ctx 1|2) findings: ${p7RegressionFindings.length} ---`,
);

console.log(`\n${failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)'}`);
process.exit(failures === 0 ? 0 : 1);
