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
  buildProfileAwareAtlasExecutionReport,
  buildProfileAwareAtlasExecutionReportFromPositionMap,
  createDiagnosticTetrahedralPositionFixture,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwareAtlasExecution.ts'));

const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];
const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const RATIO_SUM_TOLERANCE = 1e-9;
const failures = [];

console.log('Field source profile-aware atlas execution diagnostics');

runDiagnosticPositionFixture();
runHappyExecutionDiagnostic();
runExplicitPositionMapExecutionDiagnostic();
runFallbackExclusionExecutionDiagnostic();
runExplicitPositionMapMissingPositionDiagnostic();
runNonFiniteSourceParameterDiagnostic();
runUnexpectedSourceKindDiagnostic();
runAdapterDefaultInputOnlyDiagnostic();
runAdapterExecutionCallbackDiagnostic();
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

function runDiagnosticPositionFixture() {
  const positions = createDiagnosticTetrahedralPositionFixture();

  expectEqual(Object.keys(positions).length, 10, 'position fixture count');
  expectVec3(positions.A, [1, 1, 1], 'position fixture A');
  expectVec3(positions.B, [-1, -1, 1], 'position fixture B');
  expectVec3(positions.C, [-1, 1, -1], 'position fixture C');
  expectVec3(positions.D, [1, -1, -1], 'position fixture D');
  expectVec3(positions.M_AB, [0, 0, 1], 'position fixture M_AB');
  expectVec3(positions.M_AC, [0, 1, 0], 'position fixture M_AC');
  expectVec3(positions.M_AD, [1, 0, 0], 'position fixture M_AD');
  expectVec3(positions.M_BC, [-1, 0, 0], 'position fixture M_BC');
  expectVec3(positions.M_BD, [0, -1, 0], 'position fixture M_BD');
  expectVec3(positions.M_CD, [0, 0, -1], 'position fixture M_CD');

  console.log('position fixture: PASS');
}

function runHappyExecutionDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const executionReport = buildExecutionReport(adapterReport);

  expectEqual(executionReport.ok, true, 'happy execution ok');
  expectEqual(
    executionReport.method,
    'profile-aware-field-atlas-execution-diagnostic-v0',
    'happy execution method',
  );
  expectEqual(
    executionReport.diagnosticScope,
    'bounded-tetrahedral-position-fixture-only',
    'happy execution diagnostic scope',
  );
  expectEqual(
    executionReport.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'happy execution source policy id',
  );
  expectEqual(
    executionReport.fieldAtlasExecutionStatus,
    'profile-aware-atlas-executed',
    'happy execution status',
  );
  expectEqual(
    executionReport.policyRelativityStatus,
    'policy-relative',
    'happy execution relativity',
  );
  expectEqual(
    executionReport.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'happy execution contrast note',
  );
  expectEqual(
    executionReport.shapeMutationStatus,
    'not-shape-mutation',
    'happy execution shape mutation status',
  );
  expectEqual(
    executionReport.packetWriteStatus,
    'not-packet-writing',
    'happy execution packet write status',
  );
  expectEqual(
    executionReport.fieldAtlasSourcePolicyMutationStatus,
    'not-mutated',
    'happy execution source policy mutation status',
  );
  expectEqual(
    executionReport.fieldAtlasMutationStatus,
    'not-mutated',
    'happy execution field atlas mutation status',
  );
  expectEqual(
    executionReport.fieldReadySourceCount,
    adapterReport.fieldReadySourceCount,
    'happy execution field-ready source count',
  );
  expectEqual(
    executionReport.atlasInputSourceCount,
    adapterReport.atlasInputSourceCount,
    'happy execution atlas input source count',
  );
  expectEqual(
    executionReport.primalAtlasSourceCount,
    adapterReport.primalAtlasSourceCount,
    'happy execution primal source count',
  );
  expectEqual(
    executionReport.childAtlasSourceCount,
    adapterReport.childAtlasSourceCount,
    'happy execution child source count',
  );
  expectEqual(
    executionReport.fallbackChildSourceCount,
    adapterReport.fallbackChildSourceCount,
    'happy execution fallback metadata count',
  );
  expectEqual(
    executionReport.unresolvedChildSourceCount,
    adapterReport.unresolvedChildSourceCount,
    'happy execution unresolved metadata count',
  );
  expectEqual(
    executionReport.degeneracyStatusCount,
    adapterReport.degeneracyStatusCount,
    'happy execution degeneracy metadata count',
  );
  expectEqual(
    executionReport.executableSourceCount,
    adapterReport.atlasInputSourceCount,
    'happy execution executable source count',
  );
  expectEqual(
    executionReport.sampleCount,
    executionReport.executableSourceCount + 1,
    'happy execution bounded sample count',
  );
  expectEqual(
    executionReport.contributionRatioSummary.invalidSampleCount,
    0,
    'happy execution contribution ratio invalid sample count',
  );
  expectAtMost(
    executionReport.contributionRatioSummary.maxRatioSumError ?? 0,
    RATIO_SUM_TOLERANCE,
    'happy execution max ratio sum error',
  );
  expectFiniteSamples(executionReport, 'happy execution');

  printExecutionReport('happy execution', executionReport);
}

function runExplicitPositionMapExecutionDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const executionReport = buildExplicitPositionExecutionReport(adapterReport);

  expectEqual(executionReport.ok, true, 'explicit position execution ok');
  expectEqual(
    executionReport.diagnosticScope,
    'explicit-position-map-bounded-samples-only',
    'explicit position diagnostic scope',
  );
  expectEqual(
    executionReport.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'explicit position source policy id',
  );
  expectEqual(
    executionReport.fieldAtlasExecutionStatus,
    'profile-aware-atlas-executed',
    'explicit position execution status',
  );
  expectEqual(
    executionReport.policyRelativityStatus,
    'policy-relative',
    'explicit position relativity',
  );
  expectEqual(
    executionReport.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'explicit position contrast note',
  );
  expectEqual(
    executionReport.shapeMutationStatus,
    'not-shape-mutation',
    'explicit position shape mutation status',
  );
  expectEqual(
    executionReport.packetWriteStatus,
    'not-packet-writing',
    'explicit position packet write status',
  );
  expectEqual(
    executionReport.fieldAtlasSourcePolicyMutationStatus,
    'not-mutated',
    'explicit position source policy mutation status',
  );
  expectEqual(
    executionReport.fieldAtlasMutationStatus,
    'not-mutated',
    'explicit position field atlas mutation status',
  );
  expectNoOwnProperty(
    executionReport,
    'diagnosticPositionFixtureId',
    'explicit position fixture id',
  );
  expectEqual(
    executionReport.executableSourceCount,
    adapterReport.atlasInputSourceCount,
    'explicit position executable source count',
  );
  expectEqual(
    executionReport.sampleCount,
    executionReport.executableSourceCount + 1,
    'explicit position bounded sample count',
  );
  expectEqual(
    executionReport.contributionRatioSummary.invalidSampleCount,
    0,
    'explicit position contribution ratio invalid sample count',
  );
  expectFiniteSamples(executionReport, 'explicit position');

  printExecutionReport('explicit position map', executionReport);
}

function runFallbackExclusionExecutionDiagnostic() {
  const { adapterReport } = buildBaseFixture({
    invalidChannelCountChildVertexId: 'M_AB',
  });
  const executionReport = buildExecutionReport(adapterReport);

  expectEqual(executionReport.ok, true, 'fallback exclusion execution ok');
  expectAtLeast(
    executionReport.fallbackChildSourceCount,
    1,
    'fallback exclusion metadata count',
  );
  expectEqual(
    executionReport.atlasInputSourceCount,
    adapterReport.atlasSources.length,
    'fallback exclusion atlas input count',
  );
  expectEqual(
    executionReport.executableSourceCount,
    adapterReport.atlasSources.length,
    'fallback exclusion executable source count',
  );

  if (
    adapterReport.atlasSources.some(
      (source) =>
        source.sourceKind !== 'primal-assigned' &&
        source.sourceKind !== 'generated-child-derived',
    )
  ) {
    recordFailure('fallback exclusion: fallback or unresolved source appeared in atlasSources');
  }

  printExecutionReport('fallback exclusion', executionReport);
}

function runExplicitPositionMapMissingPositionDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const positions = createDiagnosticTetrahedralPositionFixture();
  const missingVertexId = adapterReport.atlasSources[0].vertexId;

  delete positions[missingVertexId];

  const executionReport = buildExplicitPositionExecutionReport(adapterReport, {
    positionByVertexId: positions,
  });

  expectEqual(executionReport.ok, false, 'explicit missing position execution ok');
  expectIssueCode(
    executionReport,
    'missing-diagnostic-position',
    'explicit missing position issue',
  );
  expectEqual(
    executionReport.missingPositionSourceCount,
    1,
    'explicit missing position source count',
  );
  expectEqual(
    executionReport.executableSourceCount,
    adapterReport.atlasInputSourceCount - 1,
    'explicit missing position executable count',
  );

  printExecutionReport('explicit missing position', executionReport);
}

function runNonFiniteSourceParameterDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const atlasSources = adapterReport.atlasSources.map((source, index) =>
    index === 0
      ? {
          ...source,
          amplitude: Number.NaN,
        }
      : { ...source },
  );
  const executionReport = buildExecutionReport(adapterReport, { atlasSources });

  expectEqual(executionReport.ok, false, 'non-finite source execution ok');
  expectIssueCode(
    executionReport,
    'non-finite-atlas-source-parameter',
    'non-finite source issue',
  );
  expectEqual(
    executionReport.executableSourceCount,
    adapterReport.atlasInputSourceCount - 1,
    'non-finite source executable count',
  );

  printExecutionReport('non-finite source', executionReport);
}

function runUnexpectedSourceKindDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const atlasSources = adapterReport.atlasSources.map((source, index) =>
    index === 0
      ? {
          ...source,
          sourceKind: 'generated-child-fallback',
        }
      : { ...source },
  );
  const executionReport = buildExecutionReport(adapterReport, { atlasSources });

  expectEqual(executionReport.ok, false, 'unexpected source kind execution ok');
  expectIssueCode(
    executionReport,
    'unexpected-atlas-source-kind',
    'unexpected source kind issue',
  );
  expectEqual(
    executionReport.executableSourceCount,
    adapterReport.atlasInputSourceCount - 1,
    'unexpected source kind executable count',
  );

  printExecutionReport('unexpected source kind', executionReport);
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
    'adapter default field atlas mutation status',
  );

  console.log('adapter default input-only status: PASS');
}

function runAdapterExecutionCallbackDiagnostic() {
  const { profileAwarePolicyReport } = buildBaseFixture();
  let callbackExecutionReport = null;
  const adapterReport = buildProfileAwareAtlasAdapterReport({
    profileAwarePolicyReport,
    executeAtlasInput(atlasSources) {
      callbackExecutionReport = buildProfileAwareAtlasExecutionReport(atlasSources, {
        reportIdSuffix: 'adapter-callback',
      });

      return {
        sampleCount: callbackExecutionReport.sampleCount,
        featureSummary: {
          executionOk: callbackExecutionReport.ok,
          executableSourceCount: callbackExecutionReport.executableSourceCount,
          diagnosticScope: callbackExecutionReport.diagnosticScope,
        },
      };
    },
  });

  if (!callbackExecutionReport) {
    recordFailure('adapter callback: execution callback was not invoked');
    return;
  }

  expectEqual(
    adapterReport.fieldAtlasExecutionStatus,
    'profile-aware-atlas-executed',
    'adapter callback execution status',
  );
  expectEqual(
    adapterReport.fieldAtlasSampleCount,
    callbackExecutionReport.sampleCount,
    'adapter callback sample count',
  );
  expectEqual(
    adapterReport.fieldAtlasFeatureSummary.executionOk,
    true,
    'adapter callback feature summary ok',
  );
  expectEqual(
    adapterReport.fieldAtlasFeatureSummary.executableSourceCount,
    callbackExecutionReport.executableSourceCount,
    'adapter callback feature summary executable count',
  );
  expectNoOwnProperty(
    adapterReport,
    'fieldAtlasExecutionReason',
    'adapter callback execution reason',
  );

  printExecutionReport('adapter callback execution', callbackExecutionReport);
}

function runNoInvarianceClaimDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const executionReport = buildExecutionReport(adapterReport);

  expectEqual(
    executionReport.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'no invariance claim contrast note',
  );
  expectNoOwnProperty(executionReport, 'invariant', 'no invariant property');
  expectNoOwnProperty(
    executionReport,
    'invariantWithDefaultPolicy',
    'no invariantWithDefaultPolicy property',
  );
  expectNoOwnProperty(
    executionReport,
    'preservesOldFeatures',
    'no preservesOldFeatures property',
  );
  expectNoOwnProperty(
    executionReport,
    'oldFeaturesStillHold',
    'no oldFeaturesStillHold property',
  );

  console.log('no old-policy invariance claim: PASS');
}

function buildExecutionReport(adapterReport, options = {}) {
  return buildProfileAwareAtlasExecutionReport(
    options.atlasSources ?? adapterReport.atlasSources,
    {
      reportIdSuffix: adapterReport.reportId,
      profileSystemId: adapterReport.profileSystemId,
      profileSetupId: adapterReport.profileSetupId,
      childInheritanceGrammarId: adapterReport.childInheritanceGrammarId,
      sourceCountMetadata: {
        fieldReadySourceCount: adapterReport.fieldReadySourceCount,
        fallbackChildSourceCount: adapterReport.fallbackChildSourceCount,
        unresolvedChildSourceCount: adapterReport.unresolvedChildSourceCount,
        degeneracyStatusCount: adapterReport.degeneracyStatusCount,
      },
    },
  );
}

function buildExplicitPositionExecutionReport(adapterReport, options = {}) {
  return buildProfileAwareAtlasExecutionReportFromPositionMap(
    options.atlasSources ?? adapterReport.atlasSources,
    options.positionByVertexId ?? createDiagnosticTetrahedralPositionFixture(),
    {
      reportIdSuffix: `${adapterReport.reportId}:explicit-position-map`,
      profileSystemId: adapterReport.profileSystemId,
      profileSetupId: adapterReport.profileSetupId,
      childInheritanceGrammarId: adapterReport.childInheritanceGrammarId,
      sourceCountMetadata: {
        fieldReadySourceCount: adapterReport.fieldReadySourceCount,
        fallbackChildSourceCount: adapterReport.fallbackChildSourceCount,
        unresolvedChildSourceCount: adapterReport.unresolvedChildSourceCount,
        degeneracyStatusCount: adapterReport.degeneracyStatusCount,
      },
      samplePoints: [
        {
          id: 'tetrahedron:centroid',
          position: [0, 0, 0],
        },
      ],
    },
  );
}

function buildBaseFixture(options = {}) {
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
    const resolvedQuarkChannelReport =
      options.invalidChannelCountChildVertexId === childContext.childVertexId
        ? buildInvalidChannelCountQuarkChannelReport(quarkChannelReport)
        : quarkChannelReport;

    return buildTetrahedralChildSourceProfileDerivationReport({
      childContext,
      quarkChannelReport: resolvedQuarkChannelReport,
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

function buildInvalidChannelCountQuarkChannelReport(report) {
  return {
    ...report,
    channelCount: 3,
    finiteChannelCount: 3,
    quarkChannels: report.quarkChannels.slice(0, 3).map(cloneChannel),
  };
}

function cloneChannel(channel) {
  return {
    ...channel,
    ratio: {
      ...channel.ratio,
    },
    channelParameters: {
      ...channel.channelParameters,
    },
  };
}

function printExecutionReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  execution status: ${report.fieldAtlasExecutionStatus}`);
  console.log(`  atlas input sources: ${report.atlasInputSourceCount}`);
  console.log(`  executable sources: ${report.executableSourceCount}`);
  console.log(`  samples: ${report.sampleCount}`);
  console.log(
    `  intensity: min=${formatNumber(report.intensitySummary.min)} max=${formatNumber(
      report.intensitySummary.max,
    )} mean=${formatNumber(report.intensitySummary.mean)}`,
  );
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

function expectFiniteSamples(report, label) {
  for (const sample of report.sampleSummaries) {
    expectFinite(sample.psi.re, `${label} ${sample.sampleId} psi.re`);
    expectFinite(sample.psi.im, `${label} ${sample.sampleId} psi.im`);
    expectFiniteNonnegative(sample.intensity, `${label} ${sample.sampleId} intensity`);
    expectFinite(sample.phase, `${label} ${sample.sampleId} phase`);
    expectAtLeast(
      sample.contributionCount,
      report.executableSourceCount,
      `${label} ${sample.sampleId} contribution count`,
    );
    expectApprox(
      sample.contributionRatioSum,
      1,
      RATIO_SUM_TOLERANCE,
      `${label} ${sample.sampleId} ratio sum`,
    );
  }
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

function expectFinite(value, label) {
  if (!Number.isFinite(value)) {
    recordFailure(`${label}: expected finite number, got ${value}`);
  }
}

function expectFiniteNonnegative(value, label) {
  expectFinite(value, label);

  if (value < 0) {
    recordFailure(`${label}: expected nonnegative number, got ${value}`);
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

function expectApprox(actual, expected, tolerance, label) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    recordFailure(
      `${label}: expected ${formatNumber(expected)} +/- ${formatNumber(
        tolerance,
      )}, got ${formatNumber(actual)}`,
    );
  }
}

function expectVec3(actual, expected, label) {
  if (!actual) {
    recordFailure(`${label}: missing position`);
    return;
  }

  for (let index = 0; index < 3; index += 1) {
    expectApprox(actual[index], expected[index], 0, `${label}[${index}]`);
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
