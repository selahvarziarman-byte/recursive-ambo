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
  buildPrimalProfileAssignmentDiagnosticReport,
  createTetrahedronFieldSourceProfileSetupFixture,
  createTetrahedronPrimalProfileAssignmentFixture,
  createUniformCirclePrimalProfileSystemFixture,
  generateFieldSourceProfiles,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfiles.ts'));

const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];
const failures = [];

console.log('Field source profile diagnostics');

runHappyPathDiagnostic();
runMissingAssignmentDiagnostic();
runDuplicateAssignmentDiagnostic();
runUnknownProfileDiagnostic();
runGeneratedProfileSystemMismatchDiagnostic();
runGeneratedProfileDefinitionMismatchDiagnostic();
runMissingSetupDiagnostic();
runDuplicateActivePrimalVertexDiagnostic();

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

function runHappyPathDiagnostic() {
  const { system, profiles, assignments, setup } = buildBaseFixture();
  const report = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem: system,
    setup,
    activePrimalVertexIds: ACTIVE_TETRAHEDRON_PRIMAL_VERTICES,
  });

  expectEqual(report.profileSystemId, system.systemId, 'happy path profile system id');
  expectEqual(report.setupId, setup.setupId, 'happy path setup id');
  expectEqual(report.profileCount, profiles.length, 'happy path generated profile count');
  expectEqual(
    report.activePrimalVertexCount,
    ACTIVE_TETRAHEDRON_PRIMAL_VERTICES.length,
    'happy path active primal vertex count',
  );
  expectEqual(report.assignmentCount, assignments.length, 'happy path assignment count');
  expectEqual(report.assignedSourceCount, 4, 'happy path assigned source count');
  expectEqual(report.issueCount, 0, 'happy path issue count');
  expectEqual(report.ok, true, 'happy path report ok');
  expectEqual(
    report.assignmentScope,
    'field-layer-setup-only',
    'happy path assignment scope',
  );
  expectEqual(
    report.shapeMutationStatus,
    'not-shape-mutation',
    'happy path shape mutation status',
  );

  printReport('happy path', report);
}

function runMissingAssignmentDiagnostic() {
  const { system, assignments } = buildBaseFixture();
  const missingAssignments = assignments.filter((assignment) => assignment.vertexId !== 'D');
  const setup = createTetrahedronFieldSourceProfileSetupFixture(system, missingAssignments);
  const report = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem: system,
    setup,
    activePrimalVertexIds: ACTIVE_TETRAHEDRON_PRIMAL_VERTICES,
  });

  expectEqual(report.ok, false, 'missing assignment report ok');
  expectEqual(report.missingAssignmentCount, 1, 'missing assignment count');
  expectIssueCode(report, 'missing-primal-assignment', 'missing assignment issue');
  expectEqual(report.assignedSourceCount, 3, 'missing assignment assigned source count');

  printReport('missing assignment', report);
}

function runDuplicateAssignmentDiagnostic() {
  const { system, profiles, assignments } = buildBaseFixture();
  const duplicateAssignments = [
    ...assignments,
    {
      vertexId: 'A',
      profileId: profiles[1].profileId,
      assignmentMode: 'manual',
    },
  ];
  const setup = createTetrahedronFieldSourceProfileSetupFixture(system, duplicateAssignments);
  const report = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem: system,
    setup,
    activePrimalVertexIds: ACTIVE_TETRAHEDRON_PRIMAL_VERTICES,
  });

  expectEqual(report.ok, false, 'duplicate assignment report ok');
  expectEqual(report.duplicateAssignmentCount, 1, 'duplicate assignment count');
  expectIssueCode(report, 'duplicate-primal-assignment', 'duplicate assignment issue');
  expectEqual(report.assignedSourceCount, 3, 'duplicate assignment assigned source count');

  printReport('duplicate assignment', report);
}

function runUnknownProfileDiagnostic() {
  const { system, assignments } = buildBaseFixture();
  const unknownProfileAssignments = assignments.map((assignment) =>
    assignment.vertexId === 'D'
      ? {
          ...assignment,
          profileId: 'field-source-profile:missing-profile-system:99',
        }
      : assignment,
  );
  const setup = createTetrahedronFieldSourceProfileSetupFixture(system, unknownProfileAssignments);
  const report = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem: system,
    setup,
    activePrimalVertexIds: ACTIVE_TETRAHEDRON_PRIMAL_VERTICES,
  });

  expectEqual(report.ok, false, 'unknown profile report ok');
  expectEqual(report.unknownProfileAssignmentCount, 1, 'unknown profile assignment count');
  expectIssueCode(
    report,
    'assignment-references-unknown-profile',
    'unknown profile assignment issue',
  );
  expectEqual(report.assignedSourceCount, 3, 'unknown profile assigned source count');

  printReport('unknown profile', report);
}

function runGeneratedProfileSystemMismatchDiagnostic() {
  const { system, profiles, assignments, setup } = buildBaseFixture();
  const wrongSystemProfiles = profiles.map((profile, index) =>
    index === 3
      ? {
          ...profile,
          systemId: 'uniform-circle-primal-profile-system-v0:wrong-system',
        }
      : profile,
  );
  const report = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem: system,
    setup,
    activePrimalVertexIds: ACTIVE_TETRAHEDRON_PRIMAL_VERTICES,
    generatedProfiles: wrongSystemProfiles,
  });

  expectEqual(report.ok, false, 'generated profile system mismatch report ok');
  expectEqual(
    report.generatedProfileSystemMismatchCount,
    1,
    'generated profile system mismatch count',
  );
  expectIssueCode(
    report,
    'generated-profile-system-mismatch',
    'generated profile system mismatch issue',
  );
  expectEqual(
    report.generatedProfileDefinitionMismatchCount,
    1,
    'generated profile system mismatch definition mismatch count',
  );
  expectEqual(report.assignedSourceCount, 3, 'generated profile system mismatch assigned source count');
  expectEqual(assignments.length, 4, 'generated profile system mismatch fixture assignment count');

  printReport('generated profile system mismatch', report);
}

function runGeneratedProfileDefinitionMismatchDiagnostic() {
  const { system, profiles, setup } = buildBaseFixture();
  const arbitraryProfiles = profiles.map((profile, index) =>
    index === 2
      ? {
          ...profile,
          amplitude: profile.amplitude + 0.25,
        }
      : profile,
  );
  const report = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem: system,
    setup,
    activePrimalVertexIds: ACTIVE_TETRAHEDRON_PRIMAL_VERTICES,
    generatedProfiles: arbitraryProfiles,
  });

  expectEqual(report.ok, false, 'generated profile definition mismatch report ok');
  expectEqual(
    report.generatedProfileDefinitionMismatchCount,
    1,
    'generated profile definition mismatch count',
  );
  expectIssueCode(
    report,
    'generated-profile-definition-mismatch',
    'generated profile definition mismatch issue',
  );
  expectEqual(report.assignedSourceCount, 3, 'generated profile definition mismatch assigned source count');

  printReport('generated profile definition mismatch', report);
}

function runMissingSetupDiagnostic() {
  const { system, profiles } = buildBaseFixture();
  const report = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem: system,
    setup: null,
    activePrimalVertexIds: [],
    generatedProfiles: profiles,
  });

  expectEqual(report.ok, false, 'missing setup report ok');
  expectEqual(report.missingSetupCount, 1, 'missing setup count');
  expectIssueCode(report, 'missing-profile-setup', 'missing setup issue');
  expectEqual(report.assignmentCount, 0, 'missing setup assignment count');

  printReport('missing setup', report);
}

function runDuplicateActivePrimalVertexDiagnostic() {
  const { system, setup } = buildBaseFixture();
  const report = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem: system,
    setup,
    activePrimalVertexIds: ['A', 'A', 'B', 'C', 'D'],
  });

  expectEqual(report.ok, false, 'duplicate active primal vertex report ok');
  expectEqual(
    report.duplicateActivePrimalVertexCount,
    1,
    'duplicate active primal vertex count',
  );
  expectIssueCode(
    report,
    'duplicate-active-primal-vertex',
    'duplicate active primal vertex issue',
  );
  expectEqual(report.assignedSourceCount, 4, 'duplicate active primal vertex assigned source count');

  printReport('duplicate active primal vertex', report);
}

function buildBaseFixture() {
  const system = createUniformCirclePrimalProfileSystemFixture();
  const profiles = generateFieldSourceProfiles(system);
  const assignments = createTetrahedronPrimalProfileAssignmentFixture(profiles);
  const setup = createTetrahedronFieldSourceProfileSetupFixture(system, assignments);

  return { system, profiles, assignments, setup };
}

function printReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  profile system: ${report.profileSystemId ?? 'none'}`);
  console.log(`  setup: ${report.setupId ?? 'none'}`);
  console.log(`  generated profiles: ${report.profileCount}`);
  console.log(`  active primal vertices: ${report.activePrimalVertexCount}`);
  console.log(`  assignments: ${report.assignmentCount}`);
  console.log(`  assigned sources: ${report.assignedSourceCount}`);
  console.log(
    `  issues: ${report.issueCount} ` +
      `(missingSetup=${report.missingSetupCount}, ` +
      `activeDuplicate=${report.duplicateActivePrimalVertexCount}, ` +
      `profileCountMismatch=${report.generatedProfileCountMismatchCount}, ` +
      `profileDefinitionMismatch=${report.generatedProfileDefinitionMismatchCount}, ` +
      `profileSystemMismatch=${report.generatedProfileSystemMismatchCount}, ` +
      `missing=${report.missingAssignmentCount}, ` +
      `duplicate=${report.duplicateAssignmentCount}, ` +
      `unknownProfile=${report.unknownProfileAssignmentCount}, ` +
      `nonFinite=${report.nonFiniteProfileCount})`,
  );
}

function expectIssueCode(report, code, label) {
  if (!report.issues.some((issue) => issue.code === code)) {
    recordFailure(`${label}: expected issue ${code}`);
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
