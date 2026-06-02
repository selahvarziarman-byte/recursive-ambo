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

const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];
const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const failures = [];

console.log('Field source profile-aware atlas adapter diagnostics');

runHappyAdapterDiagnostic();
runExplicitFallbackExclusionDiagnostic();
runSourcePolicyMismatchDiagnostic();
runPolicySourceCountMismatchDiagnostic();
runFallbackCountMismatchDiagnostic();
runDegeneracyStatusCountMismatchDiagnostic();
runPolicyClaimsFieldAtlasIntegrationDiagnostic();
runNonFiniteFieldReadySourceDiagnostic();
runNoFieldReadySourceDiagnostic();
runNoInvarianceClaimDiagnostic();
runExecutionStatusDiagnostic();

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

function runHappyAdapterDiagnostic() {
  const { adapterReport } = buildBaseFixture();

  expectEqual(adapterReport.ok, true, 'happy adapter ok');
  expectEqual(
    adapterReport.method,
    'profile-aware-field-atlas-adapter-diagnostic-v0',
    'happy adapter method',
  );
  expectEqual(
    adapterReport.diagnosticScope,
    'profile-aware-field-atlas-adapter-only',
    'happy adapter diagnostic scope',
  );
  expectEqual(
    adapterReport.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'happy adapter source policy id',
  );
  expectEqual(
    adapterReport.policyRelativityStatus,
    'policy-relative',
    'happy adapter relativity',
  );
  expectEqual(
    adapterReport.fieldAtlasMutationStatus,
    'not-mutated',
    'happy adapter field atlas mutation status',
  );
  expectEqual(
    adapterReport.fieldAtlasSourcePolicyMutationStatus,
    'not-mutated',
    'happy adapter field atlas source policy mutation status',
  );
  expectEqual(
    adapterReport.shapeMutationStatus,
    'not-shape-mutation',
    'happy adapter shape mutation status',
  );
  expectEqual(
    adapterReport.packetWriteStatus,
    'not-packet-writing',
    'happy adapter packet write status',
  );
  expectEqual(
    adapterReport.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'happy adapter contrast policy note',
  );
  expectEqual(
    adapterReport.atlasInputSourceCount,
    adapterReport.fieldReadySourceCount,
    'happy adapter input source count',
  );
  expectEqual(adapterReport.primalAtlasSourceCount, 4, 'happy primal atlas source count');
  expectAtLeast(adapterReport.childAtlasSourceCount, 0, 'happy child atlas source count');
  expectNoOwnProperty(adapterReport, 'sourcePolicyFunction', 'happy source policy function');
  expectNoOwnProperty(adapterReport, 'fieldAtlasPolicy', 'happy field atlas policy');
  expectNoOwnProperty(adapterReport, 'packetWrites', 'happy packet writes');

  printReport('happy adapter', adapterReport);
}

function runExplicitFallbackExclusionDiagnostic() {
  const { adapterReport } = buildBaseFixture({
    invalidChannelCountChildVertexId: 'M_AB',
  });

  expectEqual(adapterReport.ok, true, 'fallback exclusion adapter ok');
  expectAtLeast(adapterReport.fallbackChildSourceCount, 1, 'fallback exclusion count');
  expectEqual(
    adapterReport.atlasInputSourceCount,
    adapterReport.fieldReadySourceCount,
    'fallback exclusion input count',
  );
  expectEqual(
    adapterReport.unresolvedChildSourceCount,
    0,
    'fallback exclusion unresolved child count',
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

  printReport('fallback exclusion', adapterReport);
}

function runSourcePolicyMismatchDiagnostic() {
  const fixture = buildBaseFixture();
  const profileAwarePolicyReport = {
    ...fixture.profileAwarePolicyReport,
    sourcePolicyId: 'default-field-atlas-source-policy',
  };
  const adapterReport = buildAdapterReport(profileAwarePolicyReport);

  expectEqual(adapterReport.ok, false, 'source policy mismatch adapter ok');
  expectIssueCode(
    adapterReport,
    'source-policy-id-mismatch',
    'source policy mismatch issue',
  );

  printReport('source policy mismatch', adapterReport);
}

function runPolicySourceCountMismatchDiagnostic() {
  const fixture = buildBaseFixture();
  const profileAwarePolicyReport = {
    ...clonePolicyReport(fixture.profileAwarePolicyReport),
    fieldReadySourceCount: fixture.profileAwarePolicyReport.fieldReadySourceCount + 1,
  };
  const adapterReport = buildAdapterReport(profileAwarePolicyReport);

  expectEqual(adapterReport.ok, false, 'policy source count mismatch adapter ok');
  expectIssueCode(
    adapterReport,
    'policy-source-count-mismatch',
    'policy source count mismatch issue',
  );

  printReport('policy source count mismatch', adapterReport);
}

function runFallbackCountMismatchDiagnostic() {
  const fixture = buildBaseFixture();
  const profileAwarePolicyReport = {
    ...clonePolicyReport(fixture.profileAwarePolicyReport),
    fallbackChildSourceCount: fixture.profileAwarePolicyReport.fallbackChildSourceCount + 1,
  };
  const adapterReport = buildAdapterReport(profileAwarePolicyReport);

  expectEqual(adapterReport.ok, false, 'fallback count mismatch adapter ok');
  expectIssueCode(
    adapterReport,
    'policy-source-count-mismatch',
    'fallback count mismatch issue',
  );

  printReport('fallback count mismatch', adapterReport);
}

function runDegeneracyStatusCountMismatchDiagnostic() {
  const fixture = buildBaseFixture();
  const profileAwarePolicyReport = {
    ...clonePolicyReport(fixture.profileAwarePolicyReport),
    degeneracyStatusCount: fixture.profileAwarePolicyReport.degeneracyStatusCount + 1,
  };
  const adapterReport = buildAdapterReport(profileAwarePolicyReport);

  expectEqual(adapterReport.ok, false, 'degeneracy status count mismatch adapter ok');
  expectIssueCode(
    adapterReport,
    'policy-source-count-mismatch',
    'degeneracy status count mismatch issue',
  );

  printReport('degeneracy status count mismatch', adapterReport);
}

function runPolicyClaimsFieldAtlasIntegrationDiagnostic() {
  const fixture = buildBaseFixture();
  const profileAwarePolicyReport = {
    ...clonePolicyReport(fixture.profileAwarePolicyReport),
    fieldAtlasIntegrationStatus: 'integrated',
  };
  const adapterReport = buildAdapterReport(profileAwarePolicyReport);

  expectEqual(adapterReport.ok, false, 'policy claims field atlas integration adapter ok');
  expectIssueCode(
    adapterReport,
    'unexpected-field-atlas-integration',
    'policy claims field atlas integration issue',
  );

  printReport('policy claims field atlas integration', adapterReport);
}

function runNonFiniteFieldReadySourceDiagnostic() {
  const fixture = buildBaseFixture();
  const profileAwarePolicyReport = clonePolicyReport(fixture.profileAwarePolicyReport);
  const firstFieldReadySource = profileAwarePolicyReport.sources.find(
    (source) => source.readiness === 'field-ready' && source.emissionParameters,
  );

  if (!firstFieldReadySource) {
    recordFailure('non-finite source: field-ready source was unavailable');
    return;
  }

  firstFieldReadySource.emissionParameters = {
    ...firstFieldReadySource.emissionParameters,
    amplitude: Number.NaN,
  };

  const adapterReport = buildAdapterReport(profileAwarePolicyReport);

  expectEqual(adapterReport.ok, false, 'non-finite source adapter ok');
  expectIssueCode(
    adapterReport,
    'non-finite-atlas-source-parameter',
    'non-finite source issue',
  );

  printReport('non-finite source', adapterReport);
}

function runNoFieldReadySourceDiagnostic() {
  const fixture = buildBaseFixture();
  const profileAwarePolicyReport = {
    ...clonePolicyReport(fixture.profileAwarePolicyReport),
    fieldReadySourceCount: 0,
    sources: fixture.profileAwarePolicyReport.sources.map((source) => ({
      ...source,
      sourceKind:
        source.sourceKind === 'primal-assigned'
          ? 'generated-child-unresolved'
          : source.sourceKind,
      readiness: 'unresolved-not-field-ready',
      emissionParameters: undefined,
    })),
  };
  const adapterReport = buildAdapterReport(profileAwarePolicyReport);

  expectEqual(adapterReport.ok, false, 'no field-ready source adapter ok');
  expectIssueCode(
    adapterReport,
    'no-field-ready-sources',
    'no field-ready source issue',
  );

  printReport('no field-ready source', adapterReport);
}

function runNoInvarianceClaimDiagnostic() {
  const { adapterReport } = buildBaseFixture();

  expectEqual(
    adapterReport.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'no invariance claim contrast note',
  );
  expectNoOwnProperty(adapterReport, 'invariant', 'no invariant property');
  expectNoOwnProperty(
    adapterReport,
    'invariantWithDefaultPolicy',
    'no invariantWithDefaultPolicy property',
  );
  expectNoOwnProperty(
    adapterReport,
    'preservesOldFeatures',
    'no preservesOldFeatures property',
  );
  expectNoOwnProperty(
    adapterReport,
    'oldFeaturesStillHold',
    'no oldFeaturesStillHold property',
  );

  printReport('no invariance claim', adapterReport);
}

function runExecutionStatusDiagnostic() {
  const { adapterReport } = buildBaseFixture();

  if (adapterReport.fieldAtlasExecutionStatus === 'profile-aware-atlas-executed') {
    expectAtLeast(adapterReport.fieldAtlasSampleCount ?? 0, 1, 'executed sample count');
  } else {
    expectEqual(
      adapterReport.fieldAtlasExecutionStatus,
      'input-built-not-executed',
      'input-only execution status',
    );
    expectEqual(
      adapterReport.fieldAtlasMutationStatus,
      'not-mutated',
      'input-only field atlas mutation status',
    );
  }

  printReport('execution/input status', adapterReport);
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
  const adapterReport = buildAdapterReport(profileAwarePolicyReport);

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

function buildAdapterReport(profileAwarePolicyReport) {
  return buildProfileAwareAtlasAdapterReport({
    profileAwarePolicyReport,
  });
}

function buildInvalidChannelCountQuarkChannelReport(report) {
  return {
    ...report,
    channelCount: 3,
    finiteChannelCount: 3,
    quarkChannels: report.quarkChannels.slice(0, 3).map(cloneChannel),
  };
}

function clonePolicyReport(report) {
  return {
    ...report,
    sources: report.sources.map((source) => ({
      ...source,
      emissionParameters: source.emissionParameters
        ? {
            ...source.emissionParameters,
          }
        : undefined,
      degeneracyStatuses: source.degeneracyStatuses
        ? [...source.degeneracyStatuses]
        : undefined,
      sameAsAntipodalChildVertexIds: source.sameAsAntipodalChildVertexIds
        ? [...source.sameAsAntipodalChildVertexIds]
        : undefined,
      sameAsOtherChildVertexIds: source.sameAsOtherChildVertexIds
        ? [...source.sameAsOtherChildVertexIds]
        : undefined,
    })),
    issues: report.issues.map((issue) => ({
      ...issue,
      details: issue.details
        ? {
            ...issue.details,
          }
        : undefined,
    })),
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

function printReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  execution status: ${report.fieldAtlasExecutionStatus}`);
  console.log(`  atlas input sources: ${report.atlasInputSourceCount}`);
  console.log(`  primal atlas sources: ${report.primalAtlasSourceCount}`);
  console.log(`  child atlas sources: ${report.childAtlasSourceCount}`);
  console.log(`  fallback child sources: ${report.fallbackChildSourceCount}`);
  console.log(`  unresolved child sources: ${report.unresolvedChildSourceCount}`);
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

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    recordFailure(`${label}: expected ${expected}, got ${actual}`);
  }
}

function recordFailure(message) {
  failures.push(message);
}
