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
  buildProfileAwareFieldReportDiagnosticEnvelope,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwareFieldReport.ts'));

const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];
const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const failures = [];

console.log('Field source profile-aware field-report envelope diagnostics');

runHappyEnvelopeDiagnostic();
runMissingSourcePolicyDiagnostic();
runWrongSourcePolicyDiagnostic();
runCorruptedUpstreamPolicyIdDiagnostic();
runCountMismatchDiagnostic();
runFallbackMetadataDiagnostic();
runProfileAwarePolicyNotOkDiagnostic();
runWrappedReportForbiddenIntegrationPropertyDiagnostic();
runNoRealIntegrationDiagnostic();

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

function runHappyEnvelopeDiagnostic() {
  const { envelope, wrappedFieldReport } = buildBaseFixture();

  expectEqual(envelope.ok, true, 'happy envelope ok');
  expectEqual(
    envelope.method,
    'profile-aware-field-report-envelope-diagnostic-v0',
    'happy envelope method',
  );
  expectEqual(
    envelope.diagnosticScope,
    'profile-aware-field-report-envelope-only',
    'happy envelope diagnostic scope',
  );
  expectEqual(
    envelope.integrationStatus,
    'diagnostic-envelope-only',
    'happy envelope integration status',
  );
  expectEqual(
    envelope.fieldAtlasMutationStatus,
    'not-mutated',
    'happy envelope field atlas mutation status',
  );
  expectEqual(
    envelope.fieldAtlasSourcePolicyMutationStatus,
    'not-mutated',
    'happy envelope field atlas source policy mutation status',
  );
  expectEqual(
    envelope.fieldAtlasIntegrationStatus,
    'not-field-atlas-integration',
    'happy envelope field atlas integration status',
  );
  expectEqual(envelope.relativityStatus, 'policy-relative', 'happy envelope relativity');
  expectEqual(
    envelope.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'happy envelope source policy id',
  );
  expectEqual(
    wrappedFieldReport.sourcePolicyId,
    envelope.sourcePolicyId,
    'happy wrapped source policy id',
  );
  expectNoOwnProperty(envelope, 'fieldAtlasPolicy', 'happy envelope field atlas policy');
  expectNoOwnProperty(envelope, 'sourcePolicyFunction', 'happy envelope source policy function');
  expectNoOwnProperty(envelope, 'packetWrites', 'happy envelope packet writes');

  printReport('happy envelope', envelope);
}

function runMissingSourcePolicyDiagnostic() {
  const fixture = buildBaseFixture();
  const wrappedFieldReport = buildWrappedFieldReport(fixture.policyReport);

  delete wrappedFieldReport.sourcePolicyId;

  const envelope = buildEnvelope(fixture.policyReport, wrappedFieldReport);

  expectEqual(envelope.ok, false, 'missing source policy envelope ok');
  expectIssueCode(
    envelope,
    'wrapped-field-report-policy-missing',
    'missing source policy issue',
  );
  expectEqual(envelope.relativityStatus, 'policy-missing', 'missing source policy relativity');

  printReport('missing source policy', envelope);
}

function runWrongSourcePolicyDiagnostic() {
  const fixture = buildBaseFixture();
  const wrappedFieldReport = buildWrappedFieldReport(fixture.policyReport, {
    sourcePolicyId: 'default-field-atlas-source-policy',
  });
  const envelope = buildEnvelope(fixture.policyReport, wrappedFieldReport);

  expectEqual(envelope.ok, false, 'wrong source policy envelope ok');
  expectIssueCode(
    envelope,
    'wrapped-field-report-policy-mismatch',
    'wrong source policy issue',
  );
  expectEqual(envelope.relativityStatus, 'policy-invalid', 'wrong source policy relativity');

  printReport('wrong source policy', envelope);
}

function runCorruptedUpstreamPolicyIdDiagnostic() {
  const fixture = buildBaseFixture();
  const policyReport = {
    ...fixture.policyReport,
    sourcePolicyId: 'default-field-atlas-source-policy',
  };
  const wrappedFieldReport = buildWrappedFieldReport(policyReport, {
    sourcePolicyId: 'default-field-atlas-source-policy',
  });
  const envelope = buildEnvelope(policyReport, wrappedFieldReport);

  expectEqual(envelope.ok, false, 'corrupted upstream policy id envelope ok');
  expectIssueCode(
    envelope,
    'profile-aware-policy-id-mismatch',
    'corrupted upstream policy id issue',
  );
  expectIssueCode(
    envelope,
    'wrapped-field-report-policy-mismatch',
    'corrupted upstream wrapped policy id issue',
  );
  expectEqual(
    envelope.relativityStatus,
    'policy-invalid',
    'corrupted upstream policy id relativity',
  );

  printReport('corrupted upstream policy id', envelope);
}

function runCountMismatchDiagnostic() {
  const fixture = buildBaseFixture();
  const wrappedFieldReport = buildWrappedFieldReport(fixture.policyReport, {
    fieldSourceCount: fixture.policyReport.fieldReadySourceCount + 1,
  });
  const envelope = buildEnvelope(fixture.policyReport, wrappedFieldReport);

  expectEqual(envelope.ok, false, 'count mismatch envelope ok');
  expectIssueCode(
    envelope,
    'wrapped-field-report-source-count-mismatch',
    'count mismatch issue',
  );

  printReport('count mismatch', envelope);
}

function runFallbackMetadataDiagnostic() {
  const fixture = buildBaseFixture();
  const childDerivationReports = fixture.childDerivationReports.map((report) =>
    report.childVertexId === 'M_AB'
      ? buildInvalidChannelCountDerivationReport(
          findChildContext(fixture.childContexts, 'M_AB'),
          fixture.profileByVertexId,
        )
      : report,
  );
  const childDegeneracyReport = buildTetrahedralChildProfileDegeneracyReport({
    childContexts: fixture.childContexts,
    derivationReports: childDerivationReports,
  });
  const policyReport = buildPolicyReport({
    ...fixture,
    childDerivationReports,
    childDegeneracyReport,
  });
  const wrappedFieldReport = buildWrappedFieldReport(policyReport);
  const envelope = buildEnvelope(policyReport, wrappedFieldReport);

  expectEqual(envelope.ok, true, 'fallback metadata envelope ok');
  expectAtLeast(envelope.fallbackCount, 1, 'fallback metadata fallback count');
  expectEqual(
    envelope.wrappedFieldReport.fallbackCount,
    envelope.fallbackCount,
    'fallback metadata wrapped fallback count',
  );
  expectEqual(
    envelope.wrappedFieldReport.unresolvedChildSourceCount,
    envelope.unresolvedChildSourceCount,
    'fallback metadata wrapped unresolved count',
  );

  printReport('fallback metadata', envelope);
}

function runProfileAwarePolicyNotOkDiagnostic() {
  const fixture = buildBaseFixture();
  const childDerivationReports = fixture.childDerivationReports.filter(
    (report) => report.childVertexId !== 'M_CD',
  );
  const childDegeneracyReport = buildTetrahedralChildProfileDegeneracyReport({
    childContexts: fixture.childContexts,
    derivationReports: childDerivationReports,
  });
  const policyReport = buildPolicyReport({
    ...fixture,
    childDerivationReports,
    childDegeneracyReport,
  });
  const envelope = buildEnvelope(policyReport, buildWrappedFieldReport(policyReport));

  expectEqual(envelope.ok, false, 'profile-aware policy not ok envelope ok');
  expectIssueCode(
    envelope,
    'profile-aware-policy-report-not-ok',
    'profile-aware policy not ok issue',
  );

  printReport('profile-aware policy not ok', envelope);
}

function runWrappedReportForbiddenIntegrationPropertyDiagnostic() {
  const fixture = buildBaseFixture();
  const wrappedFieldReport = buildWrappedFieldReport(fixture.policyReport, {
    fieldAtlasPolicy: {
      name: 'not-allowed-in-envelope',
    },
    sourcePolicyFunction: 'not-allowed-in-envelope',
  });
  const envelope = buildEnvelope(fixture.policyReport, wrappedFieldReport);

  expectEqual(envelope.ok, false, 'wrapped forbidden integration property envelope ok');
  expectIssueCode(
    envelope,
    'wrapped-field-report-forbidden-integration-property',
    'wrapped forbidden integration property issue',
  );
  expectNoOwnProperty(
    envelope.wrappedFieldReport,
    'fieldAtlasPolicy',
    'wrapped forbidden field atlas policy exposure',
  );
  expectNoOwnProperty(
    envelope.wrappedFieldReport,
    'sourcePolicyFunction',
    'wrapped forbidden source policy function exposure',
  );
  expectNoOwnProperty(
    envelope.wrappedFieldReport,
    'packetWrites',
    'wrapped forbidden packet writes exposure',
  );

  printReport('wrapped forbidden integration property', envelope);
}

function runNoRealIntegrationDiagnostic() {
  const { envelope } = buildBaseFixture();

  expectEqual(
    envelope.fieldAtlasIntegrationStatus,
    'not-field-atlas-integration',
    'no real integration field atlas status',
  );
  expectEqual(
    envelope.integrationStatus,
    'diagnostic-envelope-only',
    'no real integration envelope status',
  );
  expectNoOwnProperty(envelope, 'fieldAtlasPolicy', 'no real integration field atlas policy');
  expectNoOwnProperty(
    envelope,
    'sourcePolicyFunction',
    'no real integration source policy function',
  );
  expectNoOwnProperty(envelope, 'packetWrites', 'no real integration packet writes');

  printReport('no real integration', envelope);
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
  const policyReport = buildPolicyReport({
    profileAssignmentReport,
    childContexts,
    childDerivationReports,
    childDegeneracyReport,
  });
  const wrappedFieldReport = buildWrappedFieldReport(policyReport);
  const envelope = buildEnvelope(policyReport, wrappedFieldReport);

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
    policyReport,
    wrappedFieldReport,
    envelope,
  };
}

function buildPolicyReport(args) {
  return buildProfileAwareFieldSourcePolicyDiagnosticReport({
    profileAssignmentReport: args.profileAssignmentReport,
    childContexts: args.childContexts,
    childDerivationReports: args.childDerivationReports,
    childDegeneracyReport: args.childDegeneracyReport,
  });
}

function buildWrappedFieldReport(policyReport, overrides = {}) {
  return {
    reportId: `field-feature-report-v0:profile-aware-envelope-fixture:${policyReport.reportId}`,
    reportKind: 'field-feature-report-v0',
    sourcePolicyId: policyReport.sourcePolicyId,
    fieldSourceCount: policyReport.fieldReadySourceCount,
    generatedChildSourceCount: policyReport.childSourceCount,
    fallbackCount: policyReport.fallbackCount,
    unresolvedChildSourceCount: policyReport.unresolvedChildSourceCount,
    degeneracyStatusCount: policyReport.degeneracyStatusCount,
    notes: ['diagnostic summary only; field atlas remains unmodified'],
    ...overrides,
  };
}

function buildEnvelope(policyReport, wrappedFieldReport) {
  return buildProfileAwareFieldReportDiagnosticEnvelope({
    profileAwarePolicyReport: policyReport,
    wrappedFieldReport,
  });
}

function buildInvalidChannelCountDerivationReport(childContext, profileByVertexId) {
  const quarkChannelReport = buildTetrahedralQuarkChannelReport({
    childContext,
    profileByVertexId,
  });
  const tamperedReport = {
    ...quarkChannelReport,
    channelCount: 3,
    finiteChannelCount: 3,
    quarkChannels: quarkChannelReport.quarkChannels.slice(0, 3).map(cloneChannel),
  };

  return buildTetrahedralChildSourceProfileDerivationReport({
    childContext,
    quarkChannelReport: tamperedReport,
  });
}

function printReport(label, envelope) {
  console.log(`${label}: ${envelope.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  source policy id: ${envelope.sourcePolicyId}`);
  console.log(`  field-ready sources: ${envelope.fieldReadySourceCount}`);
  console.log(`  child sources: ${envelope.childSourceCount}`);
  console.log(`  fallback count: ${envelope.fallbackCount}`);
  console.log(`  unresolved child sources: ${envelope.unresolvedChildSourceCount}`);
  console.log(`  degeneracy statuses: ${envelope.degeneracyStatusCount}`);
  console.log(`  relativity: ${envelope.relativityStatus}`);
  console.log(`  issues: ${envelope.issueCount}${formatIssueCounts(envelope)}`);
}

function formatIssueCounts(envelope) {
  const counts = new Map();

  for (const issue of envelope.issues) {
    counts.set(issue.code, (counts.get(issue.code) ?? 0) + 1);
  }

  if (counts.size === 0) {
    return '';
  }

  return ` (${Array.from(counts)
    .map(([code, count]) => `${code}=${count}`)
    .join(', ')})`;
}

function findChildContext(childContexts, childVertexId) {
  const childContext = childContexts.find((context) => context.childVertexId === childVertexId);

  if (!childContext) {
    throw new Error(`${childVertexId} child context was not available.`);
  }

  return childContext;
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

function expectIssueCode(envelope, code, label) {
  if (!envelope.issues.some((issue) => issue.code === code)) {
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
