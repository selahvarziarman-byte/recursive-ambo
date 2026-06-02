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
  buildProfileAwareSupportRegionCandidateDiagnosticReport,
} = require(path.join(
  repoRoot,
  'src/lib/fieldSourceProfileAwareSupportRegionCandidates.ts',
));

const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];
const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const SURFACE_SAMPLE_BOUND = 96;
const failures = [];

console.log('Field source profile-aware support/region candidate diagnostics');

runHappySupportRegionCandidateDiagnostic();
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

function runHappySupportRegionCandidateDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const shape = applyAmboDissection(createSeedShape('tetrahedron'));
  const beforeShapeJson = JSON.stringify(shape);
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const surfaceAtlasResult = buildSurfaceAtlasResult({
    adapterReport,
    shape,
    resolverReport,
  });
  const supportRegionReport = buildProfileAwareSupportRegionCandidateDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'happy-profile-aware-support-region-candidates',
  });

  expectEqual(resolverReport.ok, true, 'happy resolver ok');
  expectEqual(surfaceAtlasResult.report.ok, true, 'happy surface atlas ok');
  expectEqual(supportRegionReport.ok, true, 'happy support/region report ok');
  expectEqual(
    supportRegionReport.method,
    'profile-aware-support-region-candidates-diagnostic-v0',
    'happy support/region method',
  );
  expectEqual(
    supportRegionReport.diagnosticScope,
    'profile-aware-shape-resolved-support-region-candidates-only',
    'happy support/region scope',
  );
  expectEqual(
    supportRegionReport.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'happy support/region source policy id',
  );
  expectEqual(
    supportRegionReport.policyRelativityStatus,
    'policy-relative',
    'happy support/region relativity',
  );
  expectEqual(
    supportRegionReport.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'happy support/region contrast note',
  );
  expectEqual(
    supportRegionReport.semanticStatus,
    'not-semantic-naming',
    'happy support/region semantic status',
  );
  expectEqual(
    supportRegionReport.topologyStatus,
    'not-topology-workspace',
    'happy support/region topology status',
  );
  expectEqual(
    supportRegionReport.phaseContinuityStatus,
    'not-global-phase-continuity',
    'happy support/region phase status',
  );
  expectEqual(
    supportRegionReport.candidateStatus,
    'candidate-only',
    'happy support/region candidate status',
  );
  expectEqual(
    supportRegionReport.supportRegionReportMethod,
    'field-support-region-candidates-v0',
    'happy wrapped support/region method',
  );
  expectEqual(
    supportRegionReport.supportRegionReportScope,
    'closed-surface-seam-aware',
    'happy wrapped support/region scope',
  );
  expectAtLeast(
    supportRegionReport.chartCount,
    1,
    'happy support/region chart count',
  );
  expectAtLeast(
    supportRegionReport.sampleCount,
    1,
    'happy support/region sample count',
  );
  expectAtMost(
    supportRegionReport.sampleCount,
    SURFACE_SAMPLE_BOUND,
    'happy support/region bounded sample count',
  );
  expectAtLeast(
    supportRegionReport.nodeCount,
    1,
    'happy support/region node count',
  );
  expectEqual(
    supportRegionReport.atlasInputSourceCount,
    adapterReport.atlasInputSourceCount,
    'happy support/region atlas input source count',
  );
  expectEqual(
    supportRegionReport.executableSourceCount,
    adapterReport.atlasInputSourceCount,
    'happy support/region executable source count matches adapter',
  );
  expectEqual(
    supportRegionReport.fallbackChildSourceCount,
    adapterReport.fallbackChildSourceCount,
    'happy support/region fallback count',
  );
  expectEqual(
    supportRegionReport.unresolvedChildSourceCount,
    adapterReport.unresolvedChildSourceCount,
    'happy support/region unresolved count',
  );
  expectEqual(
    supportRegionReport.degeneracyStatusCount,
    adapterReport.degeneracyStatusCount,
    'happy support/region degeneracy count',
  );
  expectEqual(
    supportRegionReport.totalCandidateCount,
    supportRegionReport.supportClassCandidateCount +
      supportRegionReport.regionCandidateCount +
      supportRegionReport.constraintSiteCandidateCount +
      supportRegionReport.routeFailureRegionCandidateCount,
    'happy support/region candidate kind total',
  );
  expectEqual(
    supportRegionReport.nonCandidateStatusCount,
    0,
    'happy support/region non-candidate status count',
  );
  expectEqual(
    supportRegionReport.invalidCandidateStatusCount,
    0,
    'happy support/region invalid candidate status count',
  );

  if (JSON.stringify(shape) !== beforeShapeJson) {
    recordFailure('happy support/region diagnostic mutated the Shape');
  }

  printSupportRegionReport('happy support/region candidates', supportRegionReport);
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
  const supportRegionReport = buildProfileAwareSupportRegionCandidateDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'resolver-failure-profile-aware-support-region-candidates',
  });

  expectEqual(resolverReport.ok, false, 'failure resolver ok');
  expectEqual(surfaceAtlasResult.report.ok, false, 'failure surface atlas ok');
  expectEqual(supportRegionReport.ok, false, 'failure support/region report ok');
  expectIssueCode(
    supportRegionReport,
    'surface-atlas-report-not-ok',
    'failure support/region surface issue',
  );
  expectIssueCode(
    supportRegionReport,
    'sampled-surface-atlas-unavailable',
    'failure support/region sampled atlas issue',
  );
  expectEqual(
    supportRegionReport.supportRegionReportMethod,
    undefined,
    'failure wrapped support/region method',
  );
  expectEqual(
    supportRegionReport.nodeCount,
    0,
    'failure support/region node count',
  );
  expectEqual(
    supportRegionReport.totalCandidateCount,
    0,
    'failure support/region candidate count',
  );

  printSupportRegionReport(
    'surface atlas failure support/region candidates',
    supportRegionReport,
  );
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
  const supportRegionReport = buildProfileAwareSupportRegionCandidateDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'no-invariance-profile-aware-support-region-candidates',
  });

  expectNoOwnProperty(supportRegionReport, 'invariant', 'no invariant property');
  expectNoOwnProperty(
    supportRegionReport,
    'invariantWithDefaultPolicy',
    'no invariantWithDefaultPolicy property',
  );
  expectNoOwnProperty(
    supportRegionReport,
    'preservesOldSupportRegionCandidates',
    'no preservesOldSupportRegionCandidates property',
  );
  expectNoOwnProperty(
    supportRegionReport,
    'oldSupportRegionCandidatesStillHold',
    'no oldSupportRegionCandidatesStillHold property',
  );
  expectNoOwnProperty(
    supportRegionReport,
    'matchesDefaultSupportRegionCandidates',
    'no matchesDefaultSupportRegionCandidates property',
  );
  expectNoOwnProperty(
    supportRegionReport,
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
  const supportRegionReport = buildProfileAwareSupportRegionCandidateDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'candidate-only-profile-aware-support-region-candidates',
  });

  expectEqual(supportRegionReport.ok, true, 'candidate-only report ok');
  expectEqual(
    supportRegionReport.candidateStatus,
    'candidate-only',
    'candidate-only status',
  );
  expectEqual(
    supportRegionReport.semanticStatus,
    'not-semantic-naming',
    'candidate-only semantic status',
  );
  expectEqual(
    supportRegionReport.topologyStatus,
    'not-topology-workspace',
    'candidate-only topology status',
  );
  expectEqual(
    supportRegionReport.phaseContinuityStatus,
    'not-global-phase-continuity',
    'candidate-only phase continuity status',
  );
  expectEqual(
    supportRegionReport.nonCandidateStatusCount,
    0,
    'candidate-only non-candidate status count',
  );
  expectEqual(
    supportRegionReport.invalidCandidateStatusCount,
    0,
    'candidate-only invalid candidate status count',
  );

  console.log('candidate-only support/region truth boundary: PASS');
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
    reportIdSuffix: `${args.adapterReport.reportId}:support-region-surface-atlas`,
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

function printSupportRegionReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  method: ${report.supportRegionReportMethod ?? 'not-built'}`);
  console.log(`  semantic/topology/phase: ${report.semanticStatus}/${report.topologyStatus}/${report.phaseContinuityStatus}`);
  console.log(`  candidate status: ${report.candidateStatus}`);
  console.log(`  charts: ${report.chartCount}`);
  console.log(`  samples: ${report.sampleCount}`);
  console.log(`  nodes: ${report.nodeCount}`);
  console.log(
    `  edges: chartLocal=${report.chartLocalEdgeCount} seam=${report.seamEdgeCount} total=${report.totalEdgeCount}`,
  );
  console.log(
    `  candidates: total=${report.totalCandidateCount} support=${report.supportClassCandidateCount} region=${report.regionCandidateCount} constraint=${report.constraintSiteCandidateCount} routeFailure=${report.routeFailureRegionCandidateCount}`,
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
