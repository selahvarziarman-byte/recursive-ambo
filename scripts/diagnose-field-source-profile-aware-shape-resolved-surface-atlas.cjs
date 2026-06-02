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
  buildProfileAwareShapeResolvedSurfaceAtlasReport,
} = require(path.join(
  repoRoot,
  'src/lib/fieldSourceProfileAwareShapeResolvedSurfaceAtlas.ts',
));

const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];
const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const SURFACE_SAMPLE_BOUND = 96;
const RATIO_SUM_TOLERANCE = 1e-9;
const failures = [];

console.log('Field source profile-aware Shape-resolved surface atlas diagnostics');

runHappyShapeResolvedSurfaceAtlasDiagnostic();
runResolverFailureDiagnostic();
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

function runHappyShapeResolvedSurfaceAtlasDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const shape = applyAmboDissection(createSeedShape('tetrahedron'));
  const beforeShapeJson = JSON.stringify(shape);
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const surfaceAtlasReport = buildSurfaceAtlasReport({
    adapterReport,
    shape,
    resolverReport,
  });

  expectEqual(resolverReport.ok, true, 'happy resolver ok');
  expectEqual(resolverReport.resolvedPrimalCount, 4, 'happy resolver primal count');
  expectEqual(resolverReport.resolvedChildCount, 6, 'happy resolver child count');
  expectEqual(
    resolverReport.totalResolvedPositionCount,
    10,
    'happy resolver total position count',
  );
  expectEqual(surfaceAtlasReport.ok, true, 'happy surface atlas ok');
  expectEqual(
    surfaceAtlasReport.method,
    'profile-aware-shape-resolved-surface-atlas-diagnostic-v0',
    'happy surface atlas method',
  );
  expectEqual(
    surfaceAtlasReport.diagnosticScope,
    'shape-resolved-closed-surface-sampling-only',
    'happy surface atlas scope',
  );
  expectEqual(
    surfaceAtlasReport.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'happy surface atlas source policy id',
  );
  expectEqual(
    surfaceAtlasReport.policyRelativityStatus,
    'policy-relative',
    'happy surface atlas relativity',
  );
  expectEqual(
    surfaceAtlasReport.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'happy surface atlas contrast note',
  );
  expectEqual(
    surfaceAtlasReport.shapeMutationStatus,
    'not-shape-mutation',
    'happy surface atlas shape mutation status',
  );
  expectEqual(
    surfaceAtlasReport.packetWriteStatus,
    'not-packet-writing',
    'happy surface atlas packet write status',
  );
  expectEqual(
    surfaceAtlasReport.fieldAtlasSourcePolicyMutationStatus,
    'not-mutated',
    'happy surface atlas source policy mutation status',
  );
  expectEqual(
    surfaceAtlasReport.fieldAtlasMutationStatus,
    'not-mutated',
    'happy surface atlas mutation status',
  );
  expectEqual(
    surfaceAtlasReport.domainKind,
    'closed-shape-surface-reference',
    'happy surface atlas domain kind',
  );
  expectAtLeast(surfaceAtlasReport.chartCount, 1, 'happy surface atlas chart count');
  expectAtLeast(surfaceAtlasReport.sampleCount, 1, 'happy surface atlas sample count');
  expectAtMost(
    surfaceAtlasReport.sampleCount,
    SURFACE_SAMPLE_BOUND,
    'happy surface atlas bounded sample count',
  );
  expectEqual(
    surfaceAtlasReport.atlasInputSourceCount,
    adapterReport.atlasInputSourceCount,
    'happy surface atlas input source count',
  );
  expectEqual(
    surfaceAtlasReport.executableSourceCount,
    adapterReport.atlasInputSourceCount,
    'happy surface atlas executable source count',
  );
  expectEqual(
    surfaceAtlasReport.primalAtlasSourceCount,
    adapterReport.primalAtlasSourceCount,
    'happy surface atlas primal source count',
  );
  expectEqual(
    surfaceAtlasReport.childAtlasSourceCount,
    adapterReport.childAtlasSourceCount,
    'happy surface atlas child source count',
  );
  expectEqual(
    surfaceAtlasReport.fallbackChildSourceCount,
    adapterReport.fallbackChildSourceCount,
    'happy surface atlas fallback count',
  );
  expectEqual(
    surfaceAtlasReport.unresolvedChildSourceCount,
    adapterReport.unresolvedChildSourceCount,
    'happy surface atlas unresolved count',
  );
  expectEqual(
    surfaceAtlasReport.degeneracyStatusCount,
    adapterReport.degeneracyStatusCount,
    'happy surface atlas degeneracy count',
  );
  expectEqual(
    surfaceAtlasReport.contributionRatioSummary.invalidSampleCount,
    0,
    'happy surface atlas invalid ratio sample count',
  );
  expectAtMost(
    surfaceAtlasReport.contributionRatioSummary.maxRatioSumError ?? 0,
    RATIO_SUM_TOLERANCE,
    'happy surface atlas max ratio sum error',
  );
  expectEqual(
    surfaceAtlasReport.intensitySummary.nonFiniteCount,
    0,
    'happy surface atlas finite intensities',
  );
  expectEqual(
    surfaceAtlasReport.phaseSummary.nonFiniteCount,
    0,
    'happy surface atlas finite phases',
  );

  if (JSON.stringify(shape) !== beforeShapeJson) {
    recordFailure('happy surface atlas diagnostic mutated the Shape');
  }

  printSurfaceAtlasReport('happy surface atlas', surfaceAtlasReport);
}

function runResolverFailureDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const shape = createSeedShape('tetrahedron');
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const surfaceAtlasReport = buildSurfaceAtlasReport({
    adapterReport,
    shape,
    resolverReport,
  });

  expectEqual(resolverReport.ok, false, 'resolver failure resolver ok');
  expectIssueCode(
    resolverReport,
    'unsupported-shape-context',
    'resolver failure issue',
  );
  expectEqual(surfaceAtlasReport.ok, false, 'resolver failure surface atlas ok');
  expectIssueCode(
    surfaceAtlasReport,
    'shape-position-resolver-not-ok',
    'resolver failure surface atlas issue',
  );
  expectEqual(
    surfaceAtlasReport.executableSourceCount,
    0,
    'resolver failure executable source count',
  );
  expectEqual(
    surfaceAtlasReport.sampleCount,
    0,
    'resolver failure sample count',
  );

  printSurfaceAtlasReport('resolver failure surface atlas', surfaceAtlasReport);
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
  const surfaceAtlasReport = buildSurfaceAtlasReport({
    adapterReport,
    shape,
    resolverReport,
  });

  expectNoOwnProperty(surfaceAtlasReport, 'invariant', 'no invariant property');
  expectNoOwnProperty(
    surfaceAtlasReport,
    'invariantWithDefaultPolicy',
    'no invariantWithDefaultPolicy property',
  );
  expectNoOwnProperty(
    surfaceAtlasReport,
    'preservesOldFeatures',
    'no preservesOldFeatures property',
  );
  expectNoOwnProperty(
    surfaceAtlasReport,
    'oldFeaturesStillHold',
    'no oldFeaturesStillHold property',
  );

  console.log('no old-policy invariance claim: PASS');
}

function buildSurfaceAtlasReport(args) {
  return buildProfileAwareShapeResolvedSurfaceAtlasReport({
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
    reportIdSuffix: `${args.adapterReport.reportId}:shape-resolved-surface`,
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

function printSurfaceAtlasReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  shape: ${report.shapeId}`);
  console.log(`  domain: ${report.domainId ?? 'none'} (${report.domainKind ?? 'none'})`);
  console.log(`  charts: ${report.chartCount}`);
  console.log(`  samples: ${report.sampleCount}/${report.sampleCountBound}`);
  console.log(`  atlas input sources: ${report.atlasInputSourceCount}`);
  console.log(`  executable sources: ${report.executableSourceCount}`);
  console.log(
    `  ratio sums: invalid=${report.contributionRatioSummary.invalidSampleCount} maxError=${formatNumber(
      report.contributionRatioSummary.maxRatioSumError,
    )}`,
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

function formatNumber(value) {
  if (value === null || value === undefined) {
    return 'n/a';
  }

  if (!Number.isFinite(value)) {
    return String(value);
  }

  if (Math.abs(value) < 1e-12) {
    return '0';
  }

  return value.toPrecision(6);
}

function recordFailure(message) {
  failures.push(message);
}
