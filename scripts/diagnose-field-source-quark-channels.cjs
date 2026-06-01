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
  QUARK_CHILD_PARENT_DISTANCE,
  QUARK_CHILD_PROJECTION_DISTANCE,
  QUARK_PARENT_PROJECTION_DISTANCE,
  QUARK_PARENT_WEIGHT,
  QUARK_PROJECTION_WEIGHT,
  buildTetrahedralQuarkChannelReport,
  weightedCircularMeanRadians,
  weightedMean,
} = require(path.join(repoRoot, 'src/lib/fieldSourceQuarkChannels.ts'));

const failures = [];

console.log('Field source Quark channel diagnostics');

runWeightedScalarDiagnostic();
runWeightedCircularPhaseDiagnostic();
runHappyTetrahedralChannelDiagnostic();
runMissingParentProfileDiagnostic();
runMissingProjectionProfileDiagnostic();
runNonFiniteParentProfileDiagnostic();
runNonFiniteProjectionProfileDiagnostic();

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

function runWeightedScalarDiagnostic() {
  const actual = weightedMean(1, 2, QUARK_PARENT_WEIGHT, QUARK_PROJECTION_WEIGHT);
  const expected =
    (QUARK_PARENT_WEIGHT * 1 + QUARK_PROJECTION_WEIGHT * 2) /
    (QUARK_PARENT_WEIGHT + QUARK_PROJECTION_WEIGHT);

  expectApprox(actual, expected, 1e-12, 'weighted scalar diagnostic');
  console.log(`weighted scalar: ${sameApprox(actual, expected, 1e-12) ? 'PASS' : 'FAIL'}`);
}

function runWeightedCircularPhaseDiagnostic() {
  const actual = weightedCircularMeanRadians(
    0,
    Math.PI / 2,
    QUARK_PARENT_WEIGHT,
    QUARK_PROJECTION_WEIGHT,
  );
  const expected = Math.PI / 6;

  expectApprox(actual, expected, 1e-12, 'weighted circular phase diagnostic');
  console.log(`weighted phase: ${sameApprox(actual, expected, 1e-12) ? 'PASS' : 'FAIL'}`);
}

function runHappyTetrahedralChannelDiagnostic() {
  const { childContext, profileByVertexId } = buildBaseFixture();
  const report = buildTetrahedralQuarkChannelReport({
    childContext,
    profileByVertexId,
  });

  expectEqual(report.ok, true, 'happy tetrahedral channel report ok');
  expectEqual(report.channelCount, 4, 'happy tetrahedral channel count');
  expectEqual(report.finiteChannelCount, 4, 'happy tetrahedral finite channel count');
  expectEqual(report.issueCount, 0, 'happy tetrahedral issue count');
  expectEqual(report.channelScope, 'intermediate-quark-channel-only', 'happy channel scope');
  expectEqual(Boolean(report.childProfile), false, 'happy report should not expose child profile');
  expectChannelPairs(report, ['A-C', 'B-C', 'A-D', 'B-D'], 'happy channel pairs');

  for (const channel of report.quarkChannels) {
    expectEqual(channel.child90, 'M_AB', `${channel.channelId} child90`);
    expectIncludes(['A', 'B'], channel.parent60, `${channel.channelId} parent60`);
    expectIncludes(['C', 'D'], channel.projection30, `${channel.channelId} projection30`);
    expectApprox(channel.parentWeight, QUARK_PARENT_WEIGHT, 1e-12, `${channel.channelId} parent weight`);
    expectApprox(
      channel.projectionWeight,
      QUARK_PROJECTION_WEIGHT,
      1e-12,
      `${channel.channelId} projection weight`,
    );
    expectApprox(
      channel.ratio.childParent,
      QUARK_CHILD_PARENT_DISTANCE,
      1e-12,
      `${channel.channelId} child-parent ratio`,
    );
    expectApprox(
      channel.ratio.childProjection,
      QUARK_CHILD_PROJECTION_DISTANCE,
      1e-12,
      `${channel.channelId} child-projection ratio`,
    );
    expectApprox(
      channel.ratio.parentProjection,
      QUARK_PARENT_PROJECTION_DISTANCE,
      1e-12,
      `${channel.channelId} parent-projection ratio`,
    );
  }

  printReport('happy tetrahedral M_AB', report);
}

function runMissingParentProfileDiagnostic() {
  const { childContext, profileByVertexId } = buildBaseFixture();

  profileByVertexId.delete('A');

  const report = buildTetrahedralQuarkChannelReport({
    childContext,
    profileByVertexId,
  });

  expectEqual(report.ok, false, 'missing parent report ok');
  expectIssueCode(report, 'missing-parent-profile', 'missing parent issue');

  printReport('missing parent profile', report);
}

function runMissingProjectionProfileDiagnostic() {
  const { childContext, profileByVertexId } = buildBaseFixture();

  profileByVertexId.delete('C');

  const report = buildTetrahedralQuarkChannelReport({
    childContext,
    profileByVertexId,
  });

  expectEqual(report.ok, false, 'missing projection report ok');
  expectIssueCode(report, 'missing-projection-profile', 'missing projection issue');

  printReport('missing projection profile', report);
}

function runNonFiniteParentProfileDiagnostic() {
  const { childContext, profileByVertexId } = buildBaseFixture();
  const profile = profileByVertexId.get('A');

  profileByVertexId.set('A', {
    ...profile,
    amplitude: Number.NaN,
  });

  const report = buildTetrahedralQuarkChannelReport({
    childContext,
    profileByVertexId,
  });

  expectEqual(report.ok, false, 'non-finite parent report ok');
  expectIssueCode(report, 'non-finite-parent-profile', 'non-finite parent issue');

  printReport('non-finite parent profile', report);
}

function runNonFiniteProjectionProfileDiagnostic() {
  const { childContext, profileByVertexId } = buildBaseFixture();
  const profile = profileByVertexId.get('C');

  profileByVertexId.set('C', {
    ...profile,
    phase: Number.NaN,
  });

  const report = buildTetrahedralQuarkChannelReport({
    childContext,
    profileByVertexId,
  });

  expectEqual(report.ok, false, 'non-finite projection report ok');
  expectIssueCode(report, 'non-finite-projection-profile', 'non-finite projection issue');

  printReport('non-finite projection profile', report);
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
  const childContext = buildTetrahedralAmboChildContexts(vertexIds).find(
    (context) => context.childVertexId === 'M_AB',
  );

  if (!childContext) {
    throw new Error('M_AB child context was not available.');
  }

  return {
    childContext,
    profileByVertexId,
  };
}

function printReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  channel count: ${report.channelCount}`);
  console.log(`  finite channels: ${report.finiteChannelCount}`);
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

function expectChannelPairs(report, expectedPairs, label) {
  const actualPairs = report.quarkChannels
    .map((channel) => `${channel.parent60}-${channel.projection30}`)
    .sort();
  const expected = [...expectedPairs].sort();

  if (actualPairs.length !== expected.length) {
    recordFailure(`${label}: expected ${expected.length} pairs, got ${actualPairs.length}`);
    return;
  }

  for (let index = 0; index < expected.length; index += 1) {
    expectEqual(actualPairs[index], expected[index], `${label} pair ${index}`);
  }
}

function expectIssueCode(report, code, label) {
  if (!report.issues.some((issue) => issue.code === code)) {
    recordFailure(`${label}: expected issue ${code}`);
  }
}

function expectIncludes(values, actual, label) {
  if (!values.includes(actual)) {
    recordFailure(`${label}: expected one of ${values.join(', ')}, got ${actual}`);
  }
}

function expectApprox(actual, expected, epsilon, label) {
  if (!sameApprox(actual, expected, epsilon)) {
    recordFailure(`${label}: expected ${expected}, got ${actual}`);
  }
}

function sameApprox(actual, expected, epsilon) {
  return Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual - expected) <= epsilon;
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    recordFailure(`${label}: expected ${expected}, got ${actual}`);
  }
}

function recordFailure(message) {
  failures.push(message);
}
