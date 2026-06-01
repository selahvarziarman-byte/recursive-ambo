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
  buildTetrahedralAmboChildContextDiagnosticReport,
  buildTetrahedralAmboChildContexts,
  createTetrahedralVertexFixture,
} = require(path.join(repoRoot, 'src/lib/fieldSourceChildContexts.ts'));

const failures = [];

console.log('Field source child-context diagnostics');

runHappyPathDiagnostic();
runDuplicateVertexDiagnostic();
runForeignTetrahedronContextsDiagnostic();
runMissingAntipodalTamperDiagnostic();
runAntipodalComplementEdgeTamperDiagnostic();
runProjectionMismatchTamperDiagnostic();
runSourceComplementOverlapTamperDiagnostic();

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
  const vertexIds = createTetrahedralVertexFixture();
  const report = buildTetrahedralAmboChildContextDiagnosticReport({ vertexIds });

  expectEqual(report.ok, true, 'happy path report ok');
  expectEqual(report.uniquePrimalVertexCount, 4, 'happy path unique primal vertex count');
  expectEqual(report.childContextCount, 6, 'happy path child context count');
  expectEqual(report.uniqueChildCount, 6, 'happy path unique child count');
  expectEqual(report.sourceEdgeCount, 6, 'happy path source edge count');
  expectEqual(report.complementPairCount, 3, 'happy path complement pair count');
  expectEqual(report.antipodalPairCount, 3, 'happy path antipodal pair count');
  expectEqual(report.invalidContextCount, 0, 'happy path invalid context count');
  expectEqual(report.issueCount, 0, 'happy path issue count');
  expectEqual(
    report.contextScope,
    'field-source-child-context-diagnostic-only',
    'happy path context scope',
  );
  expectEqual(
    report.shapeMutationStatus,
    'not-shape-mutation',
    'happy path shape mutation status',
  );
  expectAntipodalEdgePair(report, 'AB', 'CD', 'happy path AB<->CD');
  expectAntipodalEdgePair(report, 'AC', 'BD', 'happy path AC<->BD');
  expectAntipodalEdgePair(report, 'AD', 'BC', 'happy path AD<->BC');

  printReport('happy path', report);
}

function runDuplicateVertexDiagnostic() {
  const report = buildTetrahedralAmboChildContextDiagnosticReport({
    vertexIds: ['A', 'A', 'C', 'D'],
  });

  expectEqual(report.ok, false, 'duplicate vertex report ok');
  expectIssueCode(report, 'duplicate-tetrahedron-vertex-id', 'duplicate vertex issue');
  expectEqual(report.childContextCount, 0, 'duplicate vertex child context count');

  printReport('duplicate vertex input', report);
}

function runForeignTetrahedronContextsDiagnostic() {
  const report = buildTetrahedralAmboChildContextDiagnosticReport({
    vertexIds: createTetrahedralVertexFixture(),
    contexts: buildTetrahedralAmboChildContexts(['W', 'X', 'Y', 'Z']),
  });

  expectEqual(report.ok, false, 'foreign tetrahedron contexts report ok');
  expectAnyIssueCode(
    report,
    ['child-context-uses-non-primal-vertex', 'source-edge-not-in-active-tetrahedron'],
    'foreign tetrahedron contexts issue',
  );
  expectEqual(report.childContextCount, 6, 'foreign tetrahedron contexts child context count');

  printReport('foreign tetrahedron contexts', report);
}

function runMissingAntipodalTamperDiagnostic() {
  const contexts = buildTetrahedralAmboChildContexts(createTetrahedralVertexFixture());
  const tamperedContexts = contexts.map((context, index) =>
    index === 0
      ? {
          ...context,
          antipodalChildVertexId: 'M_MISSING',
        }
      : context,
  );
  const report = buildTetrahedralAmboChildContextDiagnosticReport({
    vertexIds: createTetrahedralVertexFixture(),
    contexts: tamperedContexts,
  });

  expectEqual(report.ok, false, 'missing antipodal report ok');
  expectIssueCode(report, 'missing-antipodal-child', 'missing antipodal issue');

  printReport('missing antipodal tamper', report);
}

function runAntipodalComplementEdgeTamperDiagnostic() {
  const contexts = buildTetrahedralAmboChildContexts(createTetrahedralVertexFixture());
  const tamperedContexts = contexts.map((context) =>
    context.childVertexId === 'M_AB'
      ? {
          ...context,
          complementEdgeId: 'BD',
        }
      : context,
  );
  const report = buildTetrahedralAmboChildContextDiagnosticReport({
    vertexIds: createTetrahedralVertexFixture(),
    contexts: tamperedContexts,
  });

  expectEqual(report.ok, false, 'antipodal complement-edge tamper report ok');
  expectAnyIssueCode(
    report,
    ['antipodal-child-not-complement-edge', 'antipodal-source-edge-mismatch'],
    'antipodal complement-edge tamper issue',
  );

  printReport('antipodal complement-edge tamper', report);
}

function runProjectionMismatchTamperDiagnostic() {
  const contexts = buildTetrahedralAmboChildContexts(createTetrahedralVertexFixture());
  const tamperedContexts = contexts.map((context, index) =>
    index === 1
      ? {
          ...context,
          projectionVertexIds: ['A', 'D'],
        }
      : context,
  );
  const report = buildTetrahedralAmboChildContextDiagnosticReport({
    vertexIds: createTetrahedralVertexFixture(),
    contexts: tamperedContexts,
  });

  expectEqual(report.ok, false, 'projection mismatch report ok');
  expectIssueCode(
    report,
    'projection-vertices-not-complement-edge',
    'projection mismatch issue',
  );

  printReport('projection mismatch tamper', report);
}

function runSourceComplementOverlapTamperDiagnostic() {
  const contexts = buildTetrahedralAmboChildContexts(createTetrahedralVertexFixture());
  const tamperedContexts = contexts.map((context, index) =>
    index === 2
      ? {
          ...context,
          complementEdgeId: 'AB',
          complementEdgeVertexIds: ['A', 'B'],
          projectionVertexIds: ['A', 'B'],
        }
      : context,
  );
  const report = buildTetrahedralAmboChildContextDiagnosticReport({
    vertexIds: createTetrahedralVertexFixture(),
    contexts: tamperedContexts,
  });

  expectEqual(report.ok, false, 'source/complement overlap report ok');
  expectIssueCode(
    report,
    'source-edge-overlaps-complement-edge',
    'source/complement overlap issue',
  );

  printReport('source/complement overlap tamper', report);
}

function printReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  child contexts: ${report.childContextCount}`);
  console.log(`  unique children: ${report.uniqueChildCount}`);
  console.log(`  source edges: ${report.sourceEdgeCount}`);
  console.log(`  complement pairs: ${report.complementPairCount}`);
  console.log(`  antipodal pairs: ${report.antipodalPairCount}`);
  console.log(`  invalid contexts: ${report.invalidContextCount}`);
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

function expectAntipodalEdgePair(report, firstEdgeId, secondEdgeId, label) {
  const expected = [firstEdgeId, secondEdgeId].sort().join('|');
  const found = report.antipodalPairs.some(
    (pair) => [...pair.sourceEdgeIds].sort().join('|') === expected,
  );

  if (!found) {
    recordFailure(`${label}: expected antipodal source-edge pair ${firstEdgeId}<->${secondEdgeId}`);
  }
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

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    recordFailure(`${label}: expected ${expected}, got ${actual}`);
  }
}

function recordFailure(message) {
  failures.push(message);
}
