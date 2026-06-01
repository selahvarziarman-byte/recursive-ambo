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

const failures = [];

console.log('Field source child degeneracy diagnostics');

runBaselineDegeneracyDiagnostic();
runReportContextMismatchDiagnostic();
runDerivationPayloadMismatchDiagnostic();
runForeignReportDiagnostic();
runSameAsAntipodalDiagnostic();
runSameAsOtherChildDiagnostic();
runMissingChildReportDiagnostic();
runDuplicateChildReportDiagnostic();
runNonFiniteDerivedParameterDiagnostic();

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

function runBaselineDegeneracyDiagnostic() {
  const { childContexts, derivationReports } = buildBaseFixture();
  const report = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports,
  });

  expectEqual(report.ok, true, 'baseline report ok');
  expectEqual(report.childCount, 6, 'baseline child count');
  expectEqual(report.expectedChildCount, 6, 'baseline expected child count');
  expectEqual(report.antipodalPairCount, 3, 'baseline antipodal pair count');
  expectEqual(report.observations.length, 6, 'baseline observation count');
  expectEqual(
    report.comparisonCount,
    chooseTwo(report.derivedChildCount),
    'baseline comparison count',
  );

  for (const observation of report.observations) {
    if (observation.statuses.length === 0) {
      recordFailure(`baseline ${observation.childVertexId}: expected at least one status`);
    }
  }

  expectEqual(
    report.fallbackChildCount,
    countObservationsWithStatus(report, 'fallback-used'),
    'baseline fallback status count',
  );
  expectEqual(
    report.undefinedCircularMeanChildCount,
    countObservationsWithStatus(report, 'undefined-circular-mean'),
    'baseline undefined circular mean status count',
  );

  printReport('baseline report', report);
}

function runReportContextMismatchDiagnostic() {
  const { childContexts, derivationReports } = buildBaseFixture();
  const tamperedReports = derivationReports.map((derivationReport) =>
    derivationReport.childVertexId === 'M_AB'
      ? {
          ...cloneDerivationReport(derivationReport),
          sourceEdgeId: 'AC',
        }
      : cloneDerivationReport(derivationReport),
  );
  const report = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: tamperedReports,
  });

  expectEqual(report.ok, false, 'report context mismatch ok');
  expectIssueCode(
    report,
    'child-derivation-report-context-mismatch',
    'report context mismatch issue',
  );

  printReport('report context mismatch', report);
}

function runDerivationPayloadMismatchDiagnostic() {
  const { childContexts, derivationReports } = buildBaseFixture();
  const tamperedReports = derivationReports.map((derivationReport) => {
    const cloned = cloneDerivationReport(derivationReport);

    if (cloned.childVertexId !== 'M_AB' || !cloned.derivation) {
      return cloned;
    }

    cloned.derivation = {
      ...cloned.derivation,
      antipodalChildVertexId: 'M_AC',
    };

    return cloned;
  });
  const report = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: tamperedReports,
  });

  expectEqual(report.ok, false, 'derivation payload mismatch ok');
  expectIssueCode(
    report,
    'child-derivation-payload-context-mismatch',
    'derivation payload mismatch issue',
  );

  printReport('derivation payload mismatch', report);
}

function runForeignReportDiagnostic() {
  const { childContexts, derivationReports } = buildBaseFixture();
  const foreignReport = {
    ...cloneDerivationReport(
      derivationReports.find((derivationReport) => derivationReport.childVertexId === 'M_CD'),
    ),
    childVertexId: 'M_FOREIGN',
  };
  const report = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: [
      ...derivationReports
        .filter((derivationReport) => derivationReport.childVertexId !== 'M_CD')
        .map(cloneDerivationReport),
      foreignReport,
    ],
  });

  expectEqual(report.ok, false, 'foreign report ok');
  expectAnyIssueCode(
    report,
    ['child-derivation-report-not-in-contexts', 'missing-child-derivation-report'],
    'foreign report issue',
  );

  printReport('foreign report', report);
}

function runSameAsAntipodalDiagnostic() {
  const { childContexts, derivationReports } = buildBaseFixture();
  const sourceParameters = getDerivedParameters(derivationReports, 'M_AB');
  const tamperedReports = derivationReports.map((report) =>
    report.childVertexId === 'M_CD'
      ? withDerivedParameters(report, sourceParameters)
      : cloneDerivationReport(report),
  );
  const report = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: tamperedReports,
  });
  const firstObservation = findObservation(report, 'M_AB');
  const secondObservation = findObservation(report, 'M_CD');
  const foundStatus =
    firstObservation.statuses.includes('same-as-antipodal') ||
    secondObservation.statuses.includes('same-as-antipodal');
  const foundPartner =
    firstObservation.sameAsAntipodalChildVertexIds.includes('M_CD') ||
    secondObservation.sameAsAntipodalChildVertexIds.includes('M_AB');

  expectEqual(report.ok, true, 'same-as-antipodal report ok');
  expectAtLeast(report.sameAsAntipodalCount, 1, 'same-as-antipodal count');

  if (!foundStatus) {
    recordFailure('same-as-antipodal: expected M_AB or M_CD status');
  }

  if (!foundPartner) {
    recordFailure('same-as-antipodal: expected M_AB/M_CD partner reference');
  }

  printReport('same-as-antipodal', report);
}

function runSameAsOtherChildDiagnostic() {
  const { childContexts, derivationReports } = buildBaseFixture();
  const sourceParameters = getDerivedParameters(derivationReports, 'M_AB');
  const tamperedReports = derivationReports.map((report) =>
    report.childVertexId === 'M_AD'
      ? withDerivedParameters(report, sourceParameters)
      : cloneDerivationReport(report),
  );
  const report = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: tamperedReports,
  });
  const firstObservation = findObservation(report, 'M_AB');
  const secondObservation = findObservation(report, 'M_AD');
  const foundStatus =
    firstObservation.statuses.includes('same-as-other-child') ||
    secondObservation.statuses.includes('same-as-other-child');
  const foundPartner =
    firstObservation.sameAsOtherChildVertexIds.includes('M_AD') ||
    secondObservation.sameAsOtherChildVertexIds.includes('M_AB');

  expectEqual(report.ok, true, 'same-as-other-child report ok');
  expectAtLeast(report.sameAsOtherChildCount, 1, 'same-as-other-child count');

  if (!foundStatus) {
    recordFailure('same-as-other-child: expected M_AB or M_AD status');
  }

  if (!foundPartner) {
    recordFailure('same-as-other-child: expected M_AB/M_AD partner reference');
  }

  printReport('same-as-other-child', report);
}

function runMissingChildReportDiagnostic() {
  const { childContexts, derivationReports } = buildBaseFixture();
  const report = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: derivationReports
      .filter((derivationReport) => derivationReport.childVertexId !== 'M_CD')
      .map(cloneDerivationReport),
  });

  expectEqual(report.ok, false, 'missing child report ok');
  expectAnyIssueCode(
    report,
    ['missing-child-derivation-report', 'invalid-child-derivation-count'],
    'missing child report issue',
  );

  printReport('missing child report', report);
}

function runDuplicateChildReportDiagnostic() {
  const { childContexts, derivationReports } = buildBaseFixture();
  const report = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: [
      ...derivationReports.map(cloneDerivationReport),
      cloneDerivationReport(derivationReports[0]),
    ],
  });

  expectEqual(report.ok, false, 'duplicate child report ok');
  expectIssueCode(
    report,
    'duplicate-child-derivation-report',
    'duplicate child report issue',
  );

  printReport('duplicate child report', report);
}

function runNonFiniteDerivedParameterDiagnostic() {
  const { childContexts, derivationReports } = buildBaseFixture();
  const tamperedReports = derivationReports.map((report) => {
    if (report.childVertexId !== 'M_AB') {
      return cloneDerivationReport(report);
    }

    const derivedParameters = getDerivedParameters(derivationReports, 'M_AB');

    return withDerivedParameters(report, {
      ...derivedParameters,
      amplitude: Number.NaN,
    });
  });
  const report = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: tamperedReports,
  });

  expectEqual(report.ok, false, 'non-finite derived parameter report ok');
  expectIssueCode(
    report,
    'non-finite-derived-parameter',
    'non-finite derived parameter issue',
  );

  printReport('non-finite derived parameter', report);
}

function buildBaseFixture() {
  const vertexIds = createTetrahedralVertexFixture();
  const profileSystem = createUniformCirclePrimalProfileSystemFixture();
  const profiles = generateFieldSourceProfiles(profileSystem);
  const assignments = createTetrahedronPrimalProfileAssignmentFixture(profiles);
  const profileById = new Map(profiles.map((profile) => [profile.profileId, profile]));
  const profileByVertexId = new Map(
    assignments.map((assignment) => [assignment.vertexId, profileById.get(assignment.profileId)]),
  );
  const childContexts = buildTetrahedralAmboChildContexts(vertexIds);
  const derivationReports = childContexts.map((childContext) => {
    const quarkChannelReport = buildTetrahedralQuarkChannelReport({
      childContext,
      profileByVertexId,
    });

    return buildTetrahedralChildSourceProfileDerivationReport({
      childContext,
      quarkChannelReport,
    });
  });

  return {
    childContexts,
    derivationReports,
  };
}

function printReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  child count: ${report.childCount}`);
  console.log(`  derived children: ${report.derivedChildCount}`);
  console.log(`  fallback children: ${report.fallbackChildCount}`);
  console.log(`  undefined circular mean children: ${report.undefinedCircularMeanChildCount}`);
  console.log(`  phase cancellation children: ${report.phaseCancellationChildCount}`);
  console.log(`  same-as-antipodal: ${report.sameAsAntipodalCount}`);
  console.log(`  same-as-other-child: ${report.sameAsOtherChildCount}`);
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
          quarkChannels: report.derivation.quarkChannels.map((channel) => ({
            ...channel,
            ratio: {
              ...channel.ratio,
            },
            channelParameters: {
              ...channel.channelParameters,
            },
          })),
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

function findObservation(report, childVertexId) {
  const observation = report.observations.find(
    (candidate) => candidate.childVertexId === childVertexId,
  );

  if (!observation) {
    throw new Error(`${childVertexId} observation was not available.`);
  }

  return observation;
}

function countObservationsWithStatus(report, status) {
  return report.observations.filter((observation) => observation.statuses.includes(status)).length;
}

function chooseTwo(value) {
  return (value * (value - 1)) / 2;
}

function expectIssueCode(report, code, label) {
  if (!report.issues.some((issue) => issue.code === code)) {
    recordFailure(`${label}: expected issue ${code}`);
  }
}

function expectAnyIssueCode(report, codes, label) {
  if (!codes.some((code) => report.issues.some((issue) => issue.code === code))) {
    recordFailure(`${label}: expected one of ${codes.join(', ')}`);
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
