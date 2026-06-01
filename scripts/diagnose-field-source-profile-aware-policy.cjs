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

const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];
const failures = [];

console.log('Field source profile-aware policy diagnostics');

runHappyPolicyDiagnostic();
runDegeneracyMetadataPropagationDiagnostic();
runExplicitFallbackChildDiagnostic();
runMissingChildDerivationDiagnostic();
runChildDerivationReportContextMismatchDiagnostic();
runChildDerivationPayloadMismatchDiagnostic();
runForeignChildDerivationReportDiagnostic();
runDuplicateChildDerivationReportDiagnostic();
runDegeneracyObservationContextMismatchDiagnostic();
runForeignAndDuplicateDegeneracyObservationDiagnostic();
runProfileAssignmentFailureDiagnostic();
runNonFiniteSourceEntryDiagnostic();
runMissingDegeneracyObservationDiagnostic();

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

function runHappyPolicyDiagnostic() {
  const { policyReport } = buildBaseFixture();

  expectEqual(policyReport.ok, true, 'happy policy ok');
  expectEqual(
    policyReport.sourcePolicyId,
    'profile-aware-quark-child-inheritance-v0',
    'happy policy source policy id',
  );
  expectEqual(
    policyReport.fieldAtlasIntegrationStatus,
    'not-integrated',
    'happy policy field atlas integration status',
  );
  expectEqual(
    policyReport.shapeMutationStatus,
    'not-shape-mutation',
    'happy policy shape mutation status',
  );
  expectEqual(
    policyReport.packetWriteStatus,
    'not-packet-writing',
    'happy policy packet write status',
  );
  expectEqual(policyReport.assignedPrimalSourceCount, 4, 'happy assigned primal count');
  expectEqual(policyReport.childContextCount, 6, 'happy child context count');
  expectEqual(policyReport.childSourceCount, 6, 'happy child source count');
  expectEqual(policyReport.totalSourceEntryCount, 10, 'happy total source entry count');
  expectAtLeast(policyReport.fieldReadySourceCount, 4, 'happy field-ready source count');
  expectUniqueSourceIds(policyReport, 'happy unique source ids');
  expectNoOwnProperty(policyReport, 'fieldAtlasPolicy', 'happy field atlas policy');
  expectNoOwnProperty(policyReport, 'sourcePolicyFunction', 'happy source policy function');
  expectNoOwnProperty(policyReport, 'packetWrites', 'happy packet writes');

  printReport('happy policy', policyReport);
}

function runDegeneracyMetadataPropagationDiagnostic() {
  const fixture = buildBaseFixture();
  const sourceParameters = getDerivedParameters(fixture.childDerivationReports, 'M_AB');
  const childDerivationReports = fixture.childDerivationReports.map((report) =>
    report.childVertexId === 'M_CD'
      ? withDerivedParameters(report, sourceParameters)
      : cloneDerivationReport(report),
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
  const firstSource = findSource(policyReport, 'M_AB');
  const secondSource = findSource(policyReport, 'M_CD');
  const foundStatus =
    firstSource.degeneracyStatuses?.includes('same-as-antipodal') ||
    secondSource.degeneracyStatuses?.includes('same-as-antipodal');
  const foundPartner =
    firstSource.sameAsAntipodalChildVertexIds?.includes('M_CD') ||
    secondSource.sameAsAntipodalChildVertexIds?.includes('M_AB');

  expectEqual(policyReport.ok, true, 'degeneracy propagation ok');
  expectAtLeast(
    policyReport.sameAsAntipodalCount,
    1,
    'degeneracy propagation same-as-antipodal count',
  );

  if (!foundStatus) {
    recordFailure('degeneracy propagation: expected M_AB or M_CD same-as-antipodal status');
  }

  if (!foundPartner) {
    recordFailure('degeneracy propagation: expected M_AB/M_CD partner reference');
  }

  printReport('degeneracy propagation', policyReport);
}

function runExplicitFallbackChildDiagnostic() {
  const fixture = buildBaseFixture();
  const childDerivationReports = fixture.childDerivationReports.map((report) =>
    report.childVertexId === 'M_AB'
      ? buildInvalidChannelCountDerivationReport(
          findChildContext(fixture.childContexts, 'M_AB'),
          fixture.profileByVertexId,
        )
      : cloneDerivationReport(report),
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
  const fallbackSource = findSource(policyReport, 'M_AB');

  expectEqual(policyReport.ok, true, 'explicit fallback policy ok');
  expectAtLeast(policyReport.fallbackChildSourceCount, 1, 'explicit fallback child count');
  expectEqual(
    fallbackSource.sourceKind,
    'generated-child-fallback',
    'explicit fallback source kind',
  );
  expectEqual(
    fallbackSource.readiness,
    'fallback-not-field-ready',
    'explicit fallback readiness',
  );
  expectAtLeast(policyReport.fallbackCount, 1, 'explicit fallback count');

  printReport('explicit fallback child', policyReport);
}

function runMissingChildDerivationDiagnostic() {
  const fixture = buildBaseFixture();
  const childDerivationReports = fixture.childDerivationReports
    .filter((report) => report.childVertexId !== 'M_CD')
    .map(cloneDerivationReport);
  const childDegeneracyReport = buildTetrahedralChildProfileDegeneracyReport({
    childContexts: fixture.childContexts,
    derivationReports: childDerivationReports,
  });
  const policyReport = buildPolicyReport({
    ...fixture,
    childDerivationReports,
    childDegeneracyReport,
  });

  expectEqual(policyReport.ok, false, 'missing child derivation policy ok');
  expectIssueCode(
    policyReport,
    'missing-child-derivation-report',
    'missing child derivation issue',
  );

  printReport('missing child derivation', policyReport);
}

function runChildDerivationReportContextMismatchDiagnostic() {
  const fixture = buildBaseFixture();
  const childDerivationReports = fixture.childDerivationReports.map((report) => {
    const cloned = cloneDerivationReport(report);

    return cloned.childVertexId === 'M_AB'
      ? {
          ...cloned,
          sourceEdgeId: 'AC',
        }
      : cloned;
  });
  const policyReport = buildPolicyReport({
    ...fixture,
    childDerivationReports,
  });
  const source = findSource(policyReport, 'M_AB');

  expectEqual(policyReport.ok, false, 'child derivation report context mismatch ok');
  expectIssueCode(
    policyReport,
    'child-derivation-report-context-mismatch',
    'child derivation report context mismatch issue',
  );
  expectSourceNotFieldReady(source, 'child derivation report context mismatch source');

  printReport('child derivation report context mismatch', policyReport);
}

function runChildDerivationPayloadMismatchDiagnostic() {
  const fixture = buildBaseFixture();
  const childDerivationReports = fixture.childDerivationReports.map((report) => {
    const cloned = cloneDerivationReport(report);

    if (cloned.childVertexId === 'M_AB') {
      cloned.derivation = {
        ...cloned.derivation,
        sourceEdgeId: 'AC',
      };
    }

    return cloned;
  });
  const policyReport = buildPolicyReport({
    ...fixture,
    childDerivationReports,
  });
  const source = findSource(policyReport, 'M_AB');

  expectEqual(policyReport.ok, false, 'child derivation payload mismatch ok');
  expectIssueCode(
    policyReport,
    'child-derivation-payload-context-mismatch',
    'child derivation payload mismatch issue',
  );
  expectSourceNotFieldReady(source, 'child derivation payload mismatch source');

  printReport('child derivation payload mismatch', policyReport);
}

function runForeignChildDerivationReportDiagnostic() {
  const fixture = buildBaseFixture();
  const foreignReport = {
    ...cloneDerivationReport(findDerivationReport(fixture.childDerivationReports, 'M_AB')),
    childVertexId: 'M_WX',
  };
  const childDerivationReports = [
    ...fixture.childDerivationReports.map(cloneDerivationReport),
    foreignReport,
  ];
  const policyReport = buildPolicyReport({
    ...fixture,
    childDerivationReports,
  });

  expectEqual(policyReport.ok, false, 'foreign child derivation report ok');
  expectIssueCode(
    policyReport,
    'child-derivation-report-not-in-contexts',
    'foreign child derivation report issue',
  );

  printReport('foreign child derivation report', policyReport);
}

function runDuplicateChildDerivationReportDiagnostic() {
  const fixture = buildBaseFixture();
  const childDerivationReports = [
    ...fixture.childDerivationReports.map(cloneDerivationReport),
    cloneDerivationReport(findDerivationReport(fixture.childDerivationReports, 'M_AB')),
  ];
  const policyReport = buildPolicyReport({
    ...fixture,
    childDerivationReports,
  });

  expectEqual(policyReport.ok, false, 'duplicate child derivation report ok');
  expectIssueCode(
    policyReport,
    'duplicate-child-derivation-report',
    'duplicate child derivation report issue',
  );

  printReport('duplicate child derivation report', policyReport);
}

function runDegeneracyObservationContextMismatchDiagnostic() {
  const fixture = buildBaseFixture();
  const childDegeneracyReport = cloneDegeneracyReport(fixture.childDegeneracyReport);

  childDegeneracyReport.observations = childDegeneracyReport.observations.map(
    (observation) =>
      observation.childVertexId === 'M_AB'
        ? {
            ...observation,
            sourceEdgeId: 'AC',
          }
        : observation,
  );

  const policyReport = buildPolicyReport({
    ...fixture,
    childDegeneracyReport,
  });
  const source = findSource(policyReport, 'M_AB');

  expectEqual(policyReport.ok, false, 'degeneracy observation context mismatch ok');
  expectIssueCode(
    policyReport,
    'child-degeneracy-observation-context-mismatch',
    'degeneracy observation context mismatch issue',
  );
  expectNoDegeneracyStatuses(source, 'degeneracy observation context mismatch source');

  printReport('degeneracy observation context mismatch', policyReport);
}

function runForeignAndDuplicateDegeneracyObservationDiagnostic() {
  const fixture = buildBaseFixture();
  const childDegeneracyReport = cloneDegeneracyReport(fixture.childDegeneracyReport);
  const foreignObservation = {
    ...cloneObservation(findObservation(childDegeneracyReport.observations, 'M_AB')),
    childVertexId: 'M_WX',
  };

  childDegeneracyReport.observations = [
    ...childDegeneracyReport.observations,
    cloneObservation(findObservation(childDegeneracyReport.observations, 'M_AB')),
    foreignObservation,
  ];

  const policyReport = buildPolicyReport({
    ...fixture,
    childDegeneracyReport,
  });

  expectEqual(policyReport.ok, false, 'foreign and duplicate degeneracy observation ok');
  expectIssueCode(
    policyReport,
    'child-degeneracy-observation-not-in-contexts',
    'foreign degeneracy observation issue',
  );
  expectIssueCode(
    policyReport,
    'duplicate-child-degeneracy-observation',
    'duplicate degeneracy observation issue',
  );

  printReport('foreign and duplicate degeneracy observation', policyReport);
}

function runProfileAssignmentFailureDiagnostic() {
  const fixture = buildBaseFixture();
  const missingAssignments = fixture.assignments.filter(
    (assignment) => assignment.vertexId !== 'D',
  );
  const setup = createTetrahedronFieldSourceProfileSetupFixture(
    fixture.profileSystem,
    missingAssignments,
  );
  const profileAssignmentReport = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem: fixture.profileSystem,
    setup,
    activePrimalVertexIds: ACTIVE_TETRAHEDRON_PRIMAL_VERTICES,
  });
  const policyReport = buildPolicyReport({
    ...fixture,
    profileAssignmentReport,
  });

  expectEqual(policyReport.ok, false, 'profile assignment failure policy ok');
  expectIssueCode(
    policyReport,
    'profile-assignment-report-not-ok',
    'profile assignment failure issue',
  );

  if (policyReport.assignedPrimalSourceCount >= 4) {
    recordFailure(
      `profile assignment failure: expected fewer than 4 assigned primal sources, got ${policyReport.assignedPrimalSourceCount}`,
    );
  }

  printReport('profile assignment failure', policyReport);
}

function runNonFiniteSourceEntryDiagnostic() {
  const fixture = buildBaseFixture();
  const sourceParameters = getDerivedParameters(fixture.childDerivationReports, 'M_AB');
  const childDerivationReports = fixture.childDerivationReports.map((report) =>
    report.childVertexId === 'M_AB'
      ? withDerivedParameters(report, {
          ...sourceParameters,
          amplitude: Number.NaN,
        })
      : cloneDerivationReport(report),
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

  expectEqual(policyReport.ok, false, 'non-finite source entry policy ok');
  expectIssueCode(
    policyReport,
    'non-finite-source-emission-parameter',
    'non-finite source entry issue',
  );

  printReport('non-finite source entry', policyReport);
}

function runMissingDegeneracyObservationDiagnostic() {
  const fixture = buildBaseFixture();
  const childDegeneracyReport = {
    ...cloneDegeneracyReport(fixture.childDegeneracyReport),
    observations: fixture.childDegeneracyReport.observations
      .filter((observation) => observation.childVertexId !== 'M_AB')
      .map(cloneObservation),
  };
  const policyReport = buildPolicyReport({
    ...fixture,
    childDegeneracyReport,
  });

  expectEqual(policyReport.ok, false, 'missing degeneracy observation policy ok');
  expectIssueCode(
    policyReport,
    'child-degeneracy-observation-missing',
    'missing degeneracy observation issue',
  );

  printReport('missing degeneracy observation', policyReport);
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

function printReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  assigned primal sources: ${report.assignedPrimalSourceCount}`);
  console.log(`  child sources: ${report.childSourceCount}`);
  console.log(`  derived child sources: ${report.derivedChildSourceCount}`);
  console.log(`  fallback child sources: ${report.fallbackChildSourceCount}`);
  console.log(`  unresolved child sources: ${report.unresolvedChildSourceCount}`);
  console.log(`  field-ready sources: ${report.fieldReadySourceCount}`);
  console.log(`  degeneracy statuses: ${report.degeneracyStatusCount}`);
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

function getDerivedParameters(derivationReports, childVertexId) {
  const report = derivationReports.find(
    (candidate) => candidate.childVertexId === childVertexId,
  );

  if (!report?.derivation?.derivedParameters) {
    throw new Error(`${childVertexId} derived parameters were not available.`);
  }

  return {
    ...report.derivation.derivedParameters,
  };
}

function withDerivedParameters(report, derivedParameters) {
  const cloned = cloneDerivationReport(report);

  cloned.hasDerivedParameters = true;
  cloned.derivation = {
    ...cloned.derivation,
    derivedParameters: {
      ...derivedParameters,
    },
  };

  return cloned;
}

function cloneDerivationReport(report) {
  return {
    ...report,
    derivation: report.derivation
      ? {
          ...report.derivation,
          sourceEdgeVertexIds: [...report.derivation.sourceEdgeVertexIds],
          complementEdgeVertexIds: [...report.derivation.complementEdgeVertexIds],
          projectionVertexIds: [...report.derivation.projectionVertexIds],
          ratio: {
            ...report.derivation.ratio,
          },
          derivedParameters: report.derivation.derivedParameters
            ? {
                ...report.derivation.derivedParameters,
              }
            : undefined,
          fallback: report.derivation.fallback
            ? {
                ...report.derivation.fallback,
              }
            : undefined,
          quarkChannels: report.derivation.quarkChannels.map(cloneChannel),
        }
      : undefined,
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

function cloneDegeneracyReport(report) {
  return {
    ...report,
    observations: report.observations.map(cloneObservation),
    comparisons: report.comparisons.map((comparison) => ({ ...comparison })),
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

function cloneObservation(observation) {
  return {
    ...observation,
    statuses: [...observation.statuses],
    sameAsAntipodalChildVertexIds: [...observation.sameAsAntipodalChildVertexIds],
    sameAsOtherChildVertexIds: [...observation.sameAsOtherChildVertexIds],
  };
}

function findChildContext(childContexts, childVertexId) {
  const childContext = childContexts.find((context) => context.childVertexId === childVertexId);

  if (!childContext) {
    throw new Error(`${childVertexId} child context was not available.`);
  }

  return childContext;
}

function findDerivationReport(derivationReports, childVertexId) {
  const derivationReport = derivationReports.find(
    (candidate) => candidate.childVertexId === childVertexId,
  );

  if (!derivationReport) {
    throw new Error(`${childVertexId} child derivation report was not available.`);
  }

  return derivationReport;
}

function findObservation(observations, childVertexId) {
  const observation = observations.find(
    (candidate) => candidate.childVertexId === childVertexId,
  );

  if (!observation) {
    throw new Error(`${childVertexId} degeneracy observation was not available.`);
  }

  return observation;
}

function findSource(report, vertexId) {
  const source = report.sources.find((candidate) => candidate.vertexId === vertexId);

  if (!source) {
    throw new Error(`${vertexId} profile-aware source was not available.`);
  }

  return source;
}

function expectUniqueSourceIds(report, label) {
  const sourceIds = report.sources.map((source) => source.sourceId);
  const uniqueSourceIds = new Set(sourceIds);

  if (uniqueSourceIds.size !== sourceIds.length) {
    recordFailure(`${label}: expected unique source ids`);
  }
}

function expectSourceNotFieldReady(source, label) {
  if (source.readiness === 'field-ready') {
    recordFailure(`${label}: expected source not to be field-ready`);
  }

  if (Object.prototype.hasOwnProperty.call(source, 'emissionParameters')) {
    recordFailure(`${label}: did not expect derived emission parameters`);
  }
}

function expectNoDegeneracyStatuses(source, label) {
  if (source.degeneracyStatuses !== undefined) {
    recordFailure(`${label}: did not expect degeneracy statuses to propagate`);
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
