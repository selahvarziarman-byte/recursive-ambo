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

const failures = [];

console.log('Field source child derivation diagnostics');

runHappyTetrahedralDerivationDiagnostic();
runMismatchedQuarkChannelReportDiagnostic();
runChannelPairMismatchDiagnostic();
runChannelReportFailureDiagnostic();
runInvalidChannelCountDiagnostic();
runNonFiniteChannelParameterDiagnostic();
runUndefinedCircularMeanDiagnostic();

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

function runHappyTetrahedralDerivationDiagnostic() {
  const { childContext, quarkChannelReport } = buildBaseFixture();
  const report = buildTetrahedralChildSourceProfileDerivationReport({
    childContext,
    quarkChannelReport,
  });

  expectEqual(report.ok, true, 'happy derivation report ok');
  expectEqual(report.childVertexId, 'M_AB', 'happy derivation child vertex id');
  expectEqual(report.sourceEdgeId, 'AB', 'happy derivation source edge id');
  expectEqual(report.complementEdgeId, 'CD', 'happy derivation complement edge id');
  expectEqual(report.antipodalChildVertexId, 'M_CD', 'happy derivation antipodal child id');
  expectEqual(report.channelCount, 4, 'happy derivation channel count');
  expectEqual(report.finiteChannelCount, 4, 'happy derivation finite channel count');
  expectEqual(report.mergeKind, 'four-channel-merge', 'happy derivation merge kind');
  expectEqual(report.hasDerivedParameters, true, 'happy derivation has derived parameters');
  expectEqual(report.fallbackCount, 0, 'happy derivation fallback count');
  expectEqual(report.issueCount, 0, 'happy derivation issue count');
  expectNoOwnProperty(report, 'childProfile', 'happy derivation report child profile');
  expectNoOwnProperty(report, 'fieldSourcePolicy', 'happy derivation report field source policy');
  expectNoOwnProperty(report, 'sourcePolicy', 'happy derivation report source policy');

  if (!report.derivation) {
    recordFailure('happy derivation should include derivation payload');
  } else {
    expectEqual(
      report.derivation.quarkChannels.length,
      4,
      'happy derivation preserved quark channel count',
    );
    expectEqual(
      report.derivation.localStatus,
      'derived',
      'happy derivation local status',
    );
    expectNoOwnProperty(
      report.derivation,
      'childProfile',
      'happy derivation payload child profile',
    );
    expectNoOwnProperty(
      report.derivation,
      'fieldSourcePolicy',
      'happy derivation payload field source policy',
    );
    expectNoOwnProperty(
      report.derivation,
      'sourcePolicy',
      'happy derivation payload source policy',
    );

    if (!report.derivation.derivedParameters) {
      recordFailure('happy derivation should include derived parameters');
    } else {
      expectFinite(
        report.derivation.derivedParameters.amplitude,
        'happy derived amplitude finite',
      );
      expectFinite(
        report.derivation.derivedParameters.waveNumber,
        'happy derived waveNumber finite',
      );
      expectFinite(report.derivation.derivedParameters.phase, 'happy derived phase finite');
      expectFinite(
        report.derivation.derivedParameters.attenuation,
        'happy derived attenuation finite',
      );
    }
  }

  printReport('happy derivation', report);
}

function runMismatchedQuarkChannelReportDiagnostic() {
  const { childContext, contexts, profileByVertexId } = buildBaseFixture();
  const mismatchedChildContext = findChildContext(contexts, 'M_AC');
  const quarkChannelReport = buildTetrahedralQuarkChannelReport({
    childContext: mismatchedChildContext,
    profileByVertexId,
  });
  const report = buildTetrahedralChildSourceProfileDerivationReport({
    childContext,
    quarkChannelReport,
  });

  expectEqual(quarkChannelReport.ok, true, 'mismatched channel report fixture ok');
  expectEqual(report.ok, false, 'mismatched channel report derivation ok');
  expectAnyIssueCode(
    report,
    ['quark-channel-report-child-mismatch', 'quark-channel-report-context-mismatch'],
    'mismatched channel report issue',
  );
  expectEqual(
    report.hasDerivedParameters,
    false,
    'mismatched channel report has derived parameters',
  );
  expectIssueCode(report, 'fallback-used', 'mismatched channel report fallback issue');

  printReport('mismatched channel report', report);
}

function runChannelPairMismatchDiagnostic() {
  const { childContext, quarkChannelReport } = buildBaseFixture();
  const tamperedReport = {
    ...quarkChannelReport,
    channelCount: 4,
    finiteChannelCount: 4,
    quarkChannels: quarkChannelReport.quarkChannels.map((channel, index) =>
      index === 0
        ? {
            ...cloneChannel(channel),
            parent60: 'A',
            projection30: 'D',
          }
        : cloneChannel(channel),
    ),
  };
  const report = buildTetrahedralChildSourceProfileDerivationReport({
    childContext,
    quarkChannelReport: tamperedReport,
  });

  expectEqual(report.ok, false, 'channel pair mismatch derivation ok');
  expectIssueCode(report, 'quark-channel-pair-mismatch', 'channel pair mismatch issue');
  expectEqual(report.hasDerivedParameters, false, 'channel pair mismatch has derived parameters');

  printReport('channel pair mismatch', report);
}

function runChannelReportFailureDiagnostic() {
  const { childContext, profileByVertexId } = buildBaseFixture();
  const missingParentProfiles = new Map(profileByVertexId);

  missingParentProfiles.delete('A');

  const quarkChannelReport = buildTetrahedralQuarkChannelReport({
    childContext,
    profileByVertexId: missingParentProfiles,
  });
  const report = buildTetrahedralChildSourceProfileDerivationReport({
    childContext,
    quarkChannelReport,
  });

  expectEqual(quarkChannelReport.ok, false, 'channel report failure fixture ok');
  expectEqual(report.ok, false, 'channel report failure derivation ok');
  expectIssueCode(
    report,
    'quark-channel-report-not-ok',
    'channel report failure derivation issue',
  );
  expectEqual(
    report.hasDerivedParameters,
    false,
    'channel report failure has derived parameters',
  );
  expectIssueCode(report, 'fallback-used', 'channel report failure fallback issue');

  printReport('channel report failure', report);
}

function runInvalidChannelCountDiagnostic() {
  const { childContext, quarkChannelReport } = buildBaseFixture();
  const tamperedReport = {
    ...quarkChannelReport,
    channelCount: 3,
    finiteChannelCount: 3,
    quarkChannels: quarkChannelReport.quarkChannels.slice(0, 3).map(cloneChannel),
  };
  const report = buildTetrahedralChildSourceProfileDerivationReport({
    childContext,
    quarkChannelReport: tamperedReport,
  });

  expectEqual(report.ok, false, 'invalid channel count derivation ok');
  expectIssueCode(report, 'invalid-four-channel-count', 'invalid channel count issue');
  expectIssueCode(report, 'fallback-used', 'invalid channel count fallback issue');

  printReport('invalid channel count', report);
}

function runNonFiniteChannelParameterDiagnostic() {
  const { childContext, quarkChannelReport } = buildBaseFixture();
  const tamperedReport = {
    ...quarkChannelReport,
    finiteChannelCount: 3,
    quarkChannels: quarkChannelReport.quarkChannels.map((channel, index) =>
      index === 0
        ? {
            ...cloneChannel(channel),
            channelParameters: {
              ...channel.channelParameters,
              amplitude: Number.NaN,
            },
          }
        : cloneChannel(channel),
    ),
  };
  const report = buildTetrahedralChildSourceProfileDerivationReport({
    childContext,
    quarkChannelReport: tamperedReport,
  });

  expectEqual(report.ok, false, 'non-finite channel parameter derivation ok');
  expectIssueCode(
    report,
    'non-finite-channel-parameter',
    'non-finite channel parameter issue',
  );
  expectIssueCode(report, 'fallback-used', 'non-finite channel parameter fallback issue');

  printReport('non-finite channel parameter', report);
}

function runUndefinedCircularMeanDiagnostic() {
  const { childContext, quarkChannelReport } = buildBaseFixture();
  const phases = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  const tamperedReport = {
    ...quarkChannelReport,
    finiteChannelCount: 4,
    quarkChannels: quarkChannelReport.quarkChannels.map((channel, index) => ({
      ...cloneChannel(channel),
      channelParameters: {
        ...channel.channelParameters,
        phase: phases[index],
      },
    })),
  };
  const report = buildTetrahedralChildSourceProfileDerivationReport({
    childContext,
    quarkChannelReport: tamperedReport,
  });

  expectEqual(report.ok, false, 'undefined circular mean derivation ok');
  expectIssueCode(report, 'undefined-circular-mean', 'undefined circular mean issue');
  expectIssueCode(report, 'fallback-used', 'undefined circular mean fallback issue');
  expectEqual(
    report.hasDerivedParameters,
    false,
    'undefined circular mean has derived parameters',
  );

  if (report.derivation?.derivedParameters) {
    recordFailure('undefined circular mean should not include derived parameters');
  }

  printReport('undefined circular mean', report);
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
  const contexts = buildTetrahedralAmboChildContexts(vertexIds);
  const childContext = findChildContext(contexts, 'M_AB');

  const quarkChannelReport = buildTetrahedralQuarkChannelReport({
    childContext,
    profileByVertexId,
  });

  return {
    childContext,
    contexts,
    profileByVertexId,
    quarkChannelReport,
  };
}

function findChildContext(contexts, childVertexId) {
  const childContext = contexts.find((context) => context.childVertexId === childVertexId);

  if (!childContext) {
    throw new Error(`${childVertexId} child context was not available.`);
  }

  return childContext;
}

function printReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  channel count: ${report.channelCount}`);
  console.log(`  finite channels: ${report.finiteChannelCount}`);
  console.log(`  has derived parameters: ${report.hasDerivedParameters}`);
  console.log(`  fallback count: ${report.fallbackCount}`);
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

function expectNoOwnProperty(value, property, label) {
  if (Object.prototype.hasOwnProperty.call(value, property)) {
    recordFailure(`${label}: did not expect property ${property}`);
  }
}

function expectFinite(actual, label) {
  if (!Number.isFinite(actual)) {
    recordFailure(`${label}: expected finite number, got ${actual}`);
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
