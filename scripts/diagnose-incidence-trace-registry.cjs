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
const { buildIncidenceTraceRegistry } = require(
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

console.log(`\n${failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)'}`);
process.exit(failures === 0 ? 0 : 1);
