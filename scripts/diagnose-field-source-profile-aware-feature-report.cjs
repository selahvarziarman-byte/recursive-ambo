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
  buildProfileAwareFeatureReportDiagnosticReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwareFeatureReport.ts'));

const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];
const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const SURFACE_SAMPLE_BOUND = 96;
const failures = [];

console.log('Field source profile-aware feature report diagnostics');

runHappyFeatureReportDiagnostic();
runSurfaceAtlasFailureDiagnostic();
runAdapterDefaultInputOnlyDiagnostic();
runNoInvarianceClaimDiagnostic();

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

function runHappyFeatureReportDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const shape = applyAmboDissection(createSeedShape('tetrahedron'));
  const beforeShapeJson = JSON.stringify(shape);
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const surfaceAtlasResult = buildSurfaceAtlasResult({
    adapterReport,
    shape,
    resolverReport,
  });
  const featureReport = buildProfileAwareFeatureReportDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'happy-profile-aware-feature-report',
  });

  expectEqual(resolverReport.ok, true, 'happy resolver ok');
  expectEqual(surfaceAtlasResult.report.ok, true, 'happy surface atlas ok');
  expectEqual(featureReport.ok, true, 'happy feature report ok');
  expectEqual(
    featureReport.method,
    'profile-aware-field-feature-report-diagnostic-v0',
    'happy feature report method',
  );
  expectEqual(
    featureReport.diagnosticScope,
    'profile-aware-shape-resolved-feature-report-only',
    'happy feature report scope',
  );
  expectEqual(
    featureReport.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'happy feature report source policy id',
  );
  expectEqual(
    featureReport.policyRelativityStatus,
    'policy-relative',
    'happy feature report relativity',
  );
  expectEqual(
    featureReport.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'happy feature report contrast note',
  );
  expectEqual(
    featureReport.semanticStatus,
    'not-semantic-naming',
    'happy feature report semantic status',
  );
  expectEqual(
    featureReport.observationStatus,
    'report-candidate',
    'happy feature report observation status',
  );
  expectEqual(
    featureReport.featureReportMethod,
    'field-feature-report-v0',
    'happy wrapped feature report method',
  );
  expectEqual(
    featureReport.featureReportStatus,
    'supported',
    'happy wrapped feature report status',
  );
  expectAtLeast(featureReport.chartCount, 1, 'happy feature report chart count');
  expectAtLeast(featureReport.sampleCount, 1, 'happy feature report sample count');
  expectAtMost(
    featureReport.sampleCount,
    SURFACE_SAMPLE_BOUND,
    'happy feature report bounded sample count',
  );
  expectAtLeast(
    featureReport.executableSourceCount,
    1,
    'happy feature report executable source count',
  );
  expectEqual(
    featureReport.atlasInputSourceCount,
    adapterReport.atlasInputSourceCount,
    'happy feature report atlas input source count',
  );
  expectEqual(
    featureReport.executableSourceCount,
    adapterReport.atlasInputSourceCount,
    'happy feature report executable source count matches adapter',
  );
  expectEqual(
    featureReport.fallbackChildSourceCount,
    adapterReport.fallbackChildSourceCount,
    'happy feature report fallback count',
  );
  expectEqual(
    featureReport.unresolvedChildSourceCount,
    adapterReport.unresolvedChildSourceCount,
    'happy feature report unresolved count',
  );
  expectEqual(
    featureReport.degeneracyStatusCount,
    adapterReport.degeneracyStatusCount,
    'happy feature report degeneracy count',
  );
  expectEqual(
    featureReport.nonCandidateObservationCount,
    0,
    'happy feature report non-candidate observation count',
  );
  expectEqual(
    featureReport.totalObservationCount,
    featureReport.cancellationLikeObservationCount +
      featureReport.highIntensityAnchorObservationCount +
      featureReport.ambiguousObservationCount,
    'happy feature report observation kind total',
  );

  if (JSON.stringify(shape) !== beforeShapeJson) {
    recordFailure('happy feature report diagnostic mutated the Shape');
  }

  printFeatureReport('happy feature report', featureReport);
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
  const featureReport = buildProfileAwareFeatureReportDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'resolver-failure-profile-aware-feature-report',
  });

  expectEqual(resolverReport.ok, false, 'failure resolver ok');
  expectEqual(surfaceAtlasResult.report.ok, false, 'failure surface atlas ok');
  expectEqual(featureReport.ok, false, 'failure feature report ok');
  expectIssueCode(
    featureReport,
    'surface-atlas-report-not-ok',
    'failure feature report surface issue',
  );
  expectIssueCode(
    featureReport,
    'sampled-surface-atlas-unavailable',
    'failure feature report sampled atlas issue',
  );
  expectEqual(
    featureReport.featureReportStatus,
    undefined,
    'failure feature report status',
  );
  expectEqual(
    featureReport.totalObservationCount,
    0,
    'failure feature report observation count',
  );

  printFeatureReport('surface atlas failure feature report', featureReport);
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
  const featureReport = buildProfileAwareFeatureReportDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'no-invariance-profile-aware-feature-report',
  });

  expectNoOwnProperty(featureReport, 'invariant', 'no invariant property');
  expectNoOwnProperty(
    featureReport,
    'invariantWithDefaultPolicy',
    'no invariantWithDefaultPolicy property',
  );
  expectNoOwnProperty(
    featureReport,
    'preservesOldFeatures',
    'no preservesOldFeatures property',
  );
  expectNoOwnProperty(
    featureReport,
    'oldFeaturesStillHold',
    'no oldFeaturesStillHold property',
  );

  console.log('no old-policy invariance claim: PASS');
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
    reportIdSuffix: `${args.adapterReport.reportId}:feature-report-surface-atlas`,
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

function printFeatureReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  feature status: ${report.featureReportStatus ?? 'not-built'}`);
  console.log(`  semantic: ${report.semanticStatus}`);
  console.log(`  charts: ${report.chartCount}`);
  console.log(`  samples: ${report.sampleCount}`);
  console.log(`  sources: ${report.executableSourceCount}/${report.atlasInputSourceCount}`);
  console.log(
    `  observations: total=${report.totalObservationCount} cancellation=${report.cancellationLikeObservationCount} high=${report.highIntensityAnchorObservationCount} ambiguous=${report.ambiguousObservationCount}`,
  );
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
