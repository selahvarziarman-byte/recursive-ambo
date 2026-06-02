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
const { createSeedShape } = require(path.join(repoRoot, 'src/data/seeds.ts'));
const { applyAmboDissection } = require(path.join(repoRoot, 'src/lib/ambo.ts'));
const {
  buildTetrahedralAmboChildContexts,
  createTetrahedralVertexFixture,
} = require(path.join(repoRoot, 'src/lib/fieldSourceChildContexts.ts'));
const {
  buildPrimalProfileAssignmentDiagnosticReport,
  createTetrahedronFieldSourceProfileSetupFixture,
  createTetrahedronPrimalProfileAssignmentFixture,
  createUniformCirclePrimalProfileSystemFixture,
  generateFieldSourceProfiles,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfiles.ts'));
const {
  buildTetrahedralQuarkChannelReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceQuarkChannels.ts'));
const {
  buildTetrahedralChildSourceProfileDerivationReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceChildDerivations.ts'));
const {
  buildTetrahedralChildProfileDegeneracyReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceChildDegeneracy.ts'));
const {
  buildProfileAwareFieldSourcePolicyDiagnosticReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwarePolicy.ts'));
const {
  buildProfileAwareAtlasAdapterReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwareAtlasAdapter.ts'));
const {
  buildProfileAwareShapePositionResolverReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwareShapePositionResolver.ts'));
const {
  buildProfileAwareShapeResolvedSurfaceAtlas,
} = require(path.join(
  repoRoot,
  'src/lib/fieldSourceProfileAwareShapeResolvedSurfaceAtlas.ts',
));
const {
  buildProfileAwareRouteGateCandidateDiagnosticReport,
} = require(path.join(
  repoRoot,
  'src/lib/fieldSourceProfileAwareRouteGateCandidates.ts',
));

const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];
const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const SURFACE_SAMPLE_BOUND = 96;
const failures = [];

console.log('Field source profile-aware route/gate candidate diagnostics');

runHappyRouteGateCandidateDiagnostic();
runSurfaceAtlasFailureDiagnostic();
runAdapterDefaultInputOnlyDiagnostic();
runNoInvarianceClaimDiagnostic();
runCandidateOnlyTruthBoundaryDiagnostic();

if (failures.length) {
  console.error('');
  console.error('Diagnostics failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log('');
  console.log('Diagnostics passed.');
}

function runHappyRouteGateCandidateDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const shape = applyAmboDissection(createSeedShape('tetrahedron'));
  const beforeShapeJson = JSON.stringify(shape);
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const surfaceAtlasResult = buildSurfaceAtlasResult({
    adapterReport,
    shape,
    resolverReport,
  });
  const routeGateReport = buildProfileAwareRouteGateCandidateDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'happy-profile-aware-route-gate-candidates',
  });

  expectEqual(resolverReport.ok, true, 'happy resolver ok');
  expectEqual(surfaceAtlasResult.report.ok, true, 'happy surface atlas ok');
  expectEqual(routeGateReport.ok, true, 'happy route/gate report ok');
  expectEqual(
    routeGateReport.method,
    'profile-aware-route-gate-candidates-diagnostic-v0',
    'happy route/gate method',
  );
  expectEqual(
    routeGateReport.diagnosticScope,
    'profile-aware-shape-resolved-route-gate-candidates-only',
    'happy route/gate scope',
  );
  expectEqual(
    routeGateReport.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'happy route/gate source policy id',
  );
  expectEqual(
    routeGateReport.policyRelativityStatus,
    'policy-relative',
    'happy route/gate relativity',
  );
  expectEqual(
    routeGateReport.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'happy route/gate contrast note',
  );
  expectEqual(
    routeGateReport.semanticStatus,
    'not-semantic-naming',
    'happy route/gate semantic status',
  );
  expectEqual(
    routeGateReport.topologyStatus,
    'not-topology-workspace',
    'happy route/gate topology status',
  );
  expectEqual(
    routeGateReport.phaseContinuityStatus,
    'not-global-phase-continuity',
    'happy route/gate phase status',
  );
  expectEqual(
    routeGateReport.candidateStatus,
    'candidate-only',
    'happy route/gate candidate status',
  );
  expectEqual(
    routeGateReport.graphRouteGateStatus,
    'not-route-or-gate-extraction',
    'happy route/gate graph route status',
  );
  expectEqual(
    routeGateReport.routeGateReportMethod,
    'field-route-gate-candidates-v0',
    'happy wrapped route/gate method',
  );
  expectEqual(
    routeGateReport.routeGateReportScope,
    'closed-surface-seam-aware',
    'happy wrapped route/gate scope',
  );
  expectAtLeast(routeGateReport.chartCount, 1, 'happy route/gate chart count');
  expectAtLeast(routeGateReport.sampleCount, 1, 'happy route/gate sample count');
  expectAtMost(
    routeGateReport.sampleCount,
    SURFACE_SAMPLE_BOUND,
    'happy route/gate bounded sample count',
  );
  expectAtLeast(routeGateReport.nodeCount, 1, 'happy route/gate node count');
  expectEqual(
    routeGateReport.atlasInputSourceCount,
    adapterReport.atlasInputSourceCount,
    'happy route/gate atlas input source count',
  );
  expectEqual(
    routeGateReport.executableSourceCount,
    adapterReport.atlasInputSourceCount,
    'happy route/gate executable source count matches adapter',
  );
  expectEqual(
    routeGateReport.fallbackChildSourceCount,
    adapterReport.fallbackChildSourceCount,
    'happy route/gate fallback count',
  );
  expectEqual(
    routeGateReport.unresolvedChildSourceCount,
    adapterReport.unresolvedChildSourceCount,
    'happy route/gate unresolved count',
  );
  expectEqual(
    routeGateReport.degeneracyStatusCount,
    adapterReport.degeneracyStatusCount,
    'happy route/gate degeneracy count',
  );
  expectEqual(
    routeGateReport.totalCandidateCount,
    routeGateReport.gateCandidateCount +
      routeGateReport.routeCandidateCount +
      routeGateReport.blockedRouteCandidateCount,
    'happy route/gate candidate kind total',
  );
  expectEqual(
    routeGateReport.nonCandidateStatusCount,
    0,
    'happy route/gate non-candidate status count',
  );
  expectEqual(
    routeGateReport.invalidCandidateClaimStatusCount,
    0,
    'happy route/gate invalid claim status count',
  );

  if (JSON.stringify(shape) !== beforeShapeJson) {
    recordFailure('happy route/gate diagnostic mutated the Shape');
  }

  printRouteGateReport('happy route/gate candidates', routeGateReport);
}

function runSurfaceAtlasFailureDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const shape = createSeedShape('tetrahedron');
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const surfaceAtlasResult = buildSurfaceAtlasResult({
    adapterReport,
    shape,
    resolverReport,
  });
  const routeGateReport = buildProfileAwareRouteGateCandidateDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'resolver-failure-profile-aware-route-gate-candidates',
  });

  expectEqual(resolverReport.ok, false, 'failure resolver ok');
  expectEqual(surfaceAtlasResult.report.ok, false, 'failure surface atlas ok');
  expectEqual(routeGateReport.ok, false, 'failure route/gate report ok');
  expectIssueCode(
    routeGateReport,
    'surface-atlas-report-not-ok',
    'failure route/gate surface issue',
  );
  expectIssueCode(
    routeGateReport,
    'sampled-surface-atlas-unavailable',
    'failure route/gate sampled atlas issue',
  );
  expectEqual(
    routeGateReport.routeGateReportMethod,
    undefined,
    'failure wrapped route/gate method',
  );
  expectEqual(routeGateReport.nodeCount, 0, 'failure route/gate node count');
  expectEqual(
    routeGateReport.totalCandidateCount,
    0,
    'failure route/gate candidate count',
  );

  printRouteGateReport('surface atlas failure route/gate candidates', routeGateReport);
}

function runAdapterDefaultInputOnlyDiagnostic() {
  const { adapterReport } = buildBaseFixture();

  expectEqual(
    adapterReport.fieldAtlasExecutionStatus,
    'input-built-not-executed',
    'adapter default execution status',
  );
  expectEqual(
    adapterReport.fieldAtlasMutationStatus,
    'not-mutated',
    'adapter default mutation status',
  );

  console.log('adapter default input-only status: PASS');
}

function runNoInvarianceClaimDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const shape = applyAmboDissection(createSeedShape('tetrahedron'));
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const surfaceAtlasResult = buildSurfaceAtlasResult({
    adapterReport,
    shape,
    resolverReport,
  });
  const routeGateReport = buildProfileAwareRouteGateCandidateDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'no-invariance-profile-aware-route-gate-candidates',
  });

  expectNoOwnProperty(routeGateReport, 'invariant', 'no invariant property');
  expectNoOwnProperty(
    routeGateReport,
    'invariantWithDefaultPolicy',
    'no invariantWithDefaultPolicy property',
  );
  expectNoOwnProperty(
    routeGateReport,
    'preservesOldRouteGateCandidates',
    'no preservesOldRouteGateCandidates property',
  );
  expectNoOwnProperty(
    routeGateReport,
    'oldRouteGateCandidatesStillHold',
    'no oldRouteGateCandidatesStillHold property',
  );
  expectNoOwnProperty(
    routeGateReport,
    'matchesDefaultRouteGateCandidates',
    'no matchesDefaultRouteGateCandidates property',
  );
  expectNoOwnProperty(
    routeGateReport,
    'defaultPolicyInvariant',
    'no defaultPolicyInvariant property',
  );

  console.log('no old-policy invariance claim: PASS');
}

function runCandidateOnlyTruthBoundaryDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const shape = applyAmboDissection(createSeedShape('tetrahedron'));
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const surfaceAtlasResult = buildSurfaceAtlasResult({
    adapterReport,
    shape,
    resolverReport,
  });
  const routeGateReport = buildProfileAwareRouteGateCandidateDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'candidate-only-profile-aware-route-gate-candidates',
  });

  expectEqual(routeGateReport.ok, true, 'candidate-only report ok');
  expectEqual(
    routeGateReport.candidateStatus,
    'candidate-only',
    'candidate-only status',
  );
  expectEqual(
    routeGateReport.semanticStatus,
    'not-semantic-naming',
    'candidate-only semantic status',
  );
  expectEqual(
    routeGateReport.topologyStatus,
    'not-topology-workspace',
    'candidate-only topology status',
  );
  expectEqual(
    routeGateReport.phaseContinuityStatus,
    'not-global-phase-continuity',
    'candidate-only phase continuity status',
  );
  expectEqual(
    routeGateReport.graphRouteGateStatus,
    'not-route-or-gate-extraction',
    'candidate-only graph route/gate status',
  );
  expectEqual(
    routeGateReport.nonCandidateStatusCount,
    0,
    'candidate-only non-candidate status count',
  );
  expectEqual(
    routeGateReport.invalidCandidateClaimStatusCount,
    0,
    'candidate-only invalid claim status count',
  );

  console.log('candidate-only route/gate truth boundary: PASS');
}

function buildSurfaceAtlasResult(args) {
  return buildProfileAwareShapeResolvedSurfaceAtlas({
    shape: args.shape,
    atlasSources: args.adapterReport.atlasSources,
    resolverReport: args.resolverReport,
    samplingOptions: {
      subdivisions: 1,
      maxSamples: SURFACE_SAMPLE_BOUND,
    },
    sourceCountMetadata: {
      fallbackChildSourceCount: args.adapterReport.fallbackChildSourceCount,
      unresolvedChildSourceCount: args.adapterReport.unresolvedChildSourceCount,
      degeneracyStatusCount: args.adapterReport.degeneracyStatusCount,
    },
    reportIdSuffix: `${args.adapterReport.reportId}:route-gate-surface-atlas`,
  });
}

function buildBaseFixture() {
  const vertexIds = createTetrahedralVertexFixture();
  const profileSystem = createUniformCirclePrimalProfileSystemFixture();
  const profiles = generateFieldSourceProfiles(profileSystem);
  const assignments = createTetrahedronPrimalProfileAssignmentFixture(profiles);
  const setup = createTetrahedronFieldSourceProfileSetupFixture(profileSystem, assignments);
  const profileAssignmentReport = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem,
    setup,
    activePrimalVertexIds: ACTIVE_TETRAHEDRON_PRIMAL_VERTICES,
  });
  const profileById = new Map(profiles.map((profile) => [profile.profileId, profile]));
  const profileByVertexId = new Map(
    assignments.map((assignment) => [assignment.vertexId, profileById.get(assignment.profileId)]),
  );
  const childContexts = buildTetrahedralAmboChildContexts(vertexIds);
  const childDerivationReports = childContexts.map((childContext) => {
    const quarkChannelReport = buildTetrahedralQuarkChannelReport({
      childContext,
      profileByVertexId,
    });

    return buildTetrahedralChildSourceProfileDerivationReport({
      childContext,
      quarkChannelReport,
    });
  });
  const childDegeneracyReport = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: childDerivationReports,
  });
  const profileAwarePolicyReport = buildProfileAwareFieldSourcePolicyDiagnosticReport({
    profileAssignmentReport,
    childContexts,
    childDerivationReports,
    childDegeneracyReport,
  });
  const adapterReport = buildProfileAwareAtlasAdapterReport({
    profileAwarePolicyReport,
  });

  return {
    profileSystem,
    profiles,
    assignments,
    setup,
    profileAssignmentReport,
    profileByVertexId,
    childContexts,
    childDerivationReports,
    childDegeneracyReport,
    profileAwarePolicyReport,
    adapterReport,
  };
}

function printRouteGateReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  method: ${report.routeGateReportMethod ?? 'not-built'}`);
  console.log(`  semantic/topology/phase: ${report.semanticStatus}/${report.topologyStatus}/${report.phaseContinuityStatus}`);
  console.log(`  candidate status: ${report.candidateStatus}`);
  console.log(`  graph route/gate status: ${report.graphRouteGateStatus ?? 'not-built'}`);
  console.log(`  charts: ${report.chartCount}`);
  console.log(`  samples: ${report.sampleCount}`);
  console.log(`  nodes: ${report.nodeCount}`);
  console.log(
    `  edges: chartLocal=${report.chartLocalEdgeCount} seam=${report.seamEdgeCount} total=${report.totalEdgeCount}`,
  );
  console.log(
    `  candidates: total=${report.totalCandidateCount} gate=${report.gateCandidateCount} route=${report.routeCandidateCount} blocked=${report.blockedRouteCandidateCount}`,
  );
  console.log(`  sources: ${report.executableSourceCount}/${report.atlasInputSourceCount}`);
  console.log(`  issues: ${report.issueCount}${formatIssueCounts(report)}`);
}

function formatIssueCounts(report) {
  const counts = new Map();

  for (const issue of report.issues) {
    counts.set(issue.code, (counts.get(issue.code) ?? 0) + 1);
  }

  if (counts.size === 0) {
    return '';
  }

  return ` (${Array.from(counts)
    .map(([code, count]) => `${code}=${count}`)
    .join(', ')})`;
}

function expectIssueCode(report, code, label) {
  if (!report.issues.some((issue) => issue.code === code)) {
    recordFailure(`${label}: expected issue ${code}`);
  }
}

function expectNoOwnProperty(value, property, label) {
  if (Object.prototype.hasOwnProperty.call(value, property)) {
    recordFailure(`${label}: did not expect property ${property}`);
  }
}

function expectAtLeast(actual, expectedMinimum, label) {
  if (actual < expectedMinimum) {
    recordFailure(`${label}: expected at least ${expectedMinimum}, got ${actual}`);
  }
}

function expectAtMost(actual, expectedMaximum, label) {
  if (actual > expectedMaximum) {
    recordFailure(`${label}: expected at most ${expectedMaximum}, got ${actual}`);
  }
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    recordFailure(`${label}: expected ${expected}, got ${actual}`);
  }
}

function recordFailure(message) {
  failures.push(message);
}
