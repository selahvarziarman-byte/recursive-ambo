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
const tablePath = path.join(
  repoRoot,
  'src/lib/fanoOctonionicAssociatorProjectionTableV0.ts',
);
const packagePath = path.join(repoRoot, 'package.json');
const {
  buildFanoOctonionicAssociatorProjectionTableV0Report,
} = require(tablePath);

const FORBIDDEN_IMPORT_PATTERNS = [
  {
    label: 'React import',
    pattern: /from\s+['"][^'"]*react['"]|require\(\s*['"]react['"]\s*\)/i,
  },
  {
    label: 'store import',
    pattern:
      /from\s+['"][^'"]*(?:[/\\]store[/\\]|geometryStore)|require\(\s*['"][^'"]*(?:[/\\]store[/\\]|geometryStore)/i,
  },
  {
    label: 'components import',
    pattern:
      /from\s+['"][^'"]*[/\\]components[/\\]|require\(\s*['"][^'"]*[/\\]components[/\\]/i,
  },
  {
    label: 'FieldCue import',
    pattern:
      /from\s+['"][^'"]*FieldCue|from\s+['"][^'"]*fieldCue|require\(\s*['"][^'"]*(?:FieldCue|fieldCue)/i,
  },
  {
    label: 'GeneratedSiteReading import',
    pattern:
      /from\s+['"][^'"]*GeneratedSiteReading|from\s+['"][^'"]*generatedSiteReading|require\(\s*['"][^'"]*(?:GeneratedSiteReading|generatedSiteReading)/i,
  },
];
const FORBIDDEN_SOURCE_NAMES = [
  'ASSOCIATOR_MAP',
  'HARDCODED_ASSOCIATOR',
  'MANUAL_ASSOCIATOR',
  'PROJECTION_DISPLACEMENT_MAP',
  'HARDCODED_PROJECTION',
  'MANUAL_PROJECTION',
];

const failures = [];
const report = buildFanoOctonionicAssociatorProjectionTableV0Report();
const tableSource = readRequiredFile(
  tablePath,
  'Fano octonionic associator projection table source',
);
const packageSource = readRequiredFile(packagePath, 'package.json');

runAssertions(report, { tableSource, packageSource });
printTables(report);
printCompactReport(report);

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

function runAssertions(report, sources) {
  expectEqual(report.ok, true, 'report ok');
  expectEqual(
    report.method,
    'fano-octonionic-associator-projection-table-v0',
    'method',
  );
  expectEqual(
    report.summary.method,
    'fano-octonionic-associator-projection-table-v0',
    'summary method',
  );
  expectEqual(
    report.summary.formalAssociatorRowCount,
    24,
    'formal associator row count',
  );
  expectEqual(
    report.summary.formalAssociatorNonzeroCount,
    24,
    'formal associator nonzero count',
  );
  expectEqual(
    report.summary.formalAssociatorZeroCount,
    0,
    'formal associator zero count',
  );
  expectEqual(
    report.summary.formalAssociatorDifferentRayCount,
    0,
    'formal associator different ray count',
  );
  expectEqual(
    report.summary.canonicalProjectionDisplacementRowCount,
    24,
    'canonical projection displacement row count',
  );
  expectEqual(
    report.summary.canonicalProjectionNonzeroCount,
    12,
    'canonical projection nonzero count',
  );
  expectEqual(
    report.summary.canonicalProjectionZeroCount,
    12,
    'canonical projection zero count',
  );
  expectEqual(
    report.summary.canonicalProjectionDifferentRayCount,
    0,
    'canonical projection different ray count',
  );
  expectEqual(
    report.summary.parentOrderMatchedCount,
    12,
    'parent order matched count',
  );
  expectEqual(
    report.summary.parentOrderReversedCount,
    12,
    'parent order reversed count',
  );
  expectEqual(
    report.summary.c1DependencyStatus,
    'derived-from-c1-local-channel-table',
    'C1 dependency status',
  );
  expectEqual(
    report.summary.trisonBridgeStatus,
    'carrier-residue-tables-ready-for-later-trison-reading',
    'trison bridge status',
  );
  expectEqual(
    report.summary.spinorBridgeStatus,
    'associator-displacement-data-ready-not-spinor-representation',
    'spinor bridge status',
  );
  expectEqual(
    report.summary.semanticLabelStatus,
    'not-attached-placeholders-only',
    'semantic label status',
  );
  expectEqual(
    report.summary.emissionStatus,
    'not-attached-in-a0',
    'emission status',
  );
  expectEqual(report.summary.uiStatus, 'no-ui', 'UI status');
  expectEqual(
    report.summary.recommendedNextGate,
    'E0 - Finite Harmonic Emission Profile Library',
    'recommended next gate',
  );
  expectEqual(
    report.formalAssociatorRows.every(
      (row) => row.formalAssociatorStatus === 'computed-from-fano-bracketing',
    ),
    true,
    'formal rows are computed from Fano bracketing',
  );
  expectEqual(
    report.canonicalProjectionDisplacementRows.every(
      (row) =>
        row.projectionResidualStatus ===
        'computed-relative-to-c1-canonical-child-lift',
    ),
    true,
    'canonical rows are computed relative to C1 child lifts',
  );
  expectEqual(
    report.canonicalProjectionDisplacementRows.every((row) =>
      Boolean(row.canonicalChildLiftId && row.canonicalChildSignedLift),
    ),
    true,
    'canonical rows preserve C1 canonical child lifts',
  );
  expectEqual(
    hasPackageScript(
      sources.packageSource,
      'diagnose:fano-octonionic-associator-projection-table-v0',
    ),
    true,
    'package script exists',
  );

  for (const { label, pattern } of FORBIDDEN_IMPORT_PATTERNS) {
    expectEqual(pattern.test(sources.tableSource), false, `no ${label}`);
  }

  for (const sourceName of FORBIDDEN_SOURCE_NAMES) {
    expectEqual(
      sources.tableSource.includes(sourceName),
      false,
      `source avoids hard-coded result table name ${sourceName}`,
    );
  }
}

function printTables(report) {
  console.log('A0 FanoOctonionicAssociatorProjectionTableV0 diagnostics');
  console.log('');
  console.log('formal associator rows');

  for (const row of report.formalAssociatorRows) {
    console.log(
      `${row.rowId}: ${row.radixPathLabel} -> ${row.radixSignedResult} ${row.radixResultRay} | ${row.formalLoopPathLabel} -> ${row.formalLoopSignedResult} ${row.formalLoopResultRay} | ${row.formalAssociatorDisplacement} | ${row.formalAssociatorDisplacementKind} | ${row.parentOrderStatus}`,
    );
  }

  console.log('');
  console.log('canonical projection displacement rows');

  for (const row of report.canonicalProjectionDisplacementRows) {
    console.log(
      `${row.rowId}: ${row.radixPathLabel} -> ${row.radixSignedResult} ${row.radixResultRay} | ${row.canonicalLoopPathLabel} -> ${row.canonicalLoopSignedResult} ${row.canonicalLoopResultRay} | ${row.canonicalProjectionDisplacement} | ${row.canonicalProjectionDisplacementKind} | ${row.parentOrderStatus}`,
    );
  }

  console.log('');
  console.log('summary');
}

function printCompactReport(report) {
  const summary = report.summary;

  console.log(`formalAssociatorRowCount: ${summary.formalAssociatorRowCount}`);
  console.log(
    `formalAssociatorNonzeroCount: ${summary.formalAssociatorNonzeroCount}`,
  );
  console.log(`formalAssociatorZeroCount: ${summary.formalAssociatorZeroCount}`);
  console.log(
    `formalAssociatorDifferentRayCount: ${summary.formalAssociatorDifferentRayCount}`,
  );
  console.log(
    `canonicalProjectionDisplacementRowCount: ${summary.canonicalProjectionDisplacementRowCount}`,
  );
  console.log(
    `canonicalProjectionNonzeroCount: ${summary.canonicalProjectionNonzeroCount}`,
  );
  console.log(
    `canonicalProjectionZeroCount: ${summary.canonicalProjectionZeroCount}`,
  );
  console.log(
    `canonicalProjectionDifferentRayCount: ${summary.canonicalProjectionDifferentRayCount}`,
  );
  console.log(`parentOrderMatchedCount: ${summary.parentOrderMatchedCount}`);
  console.log(`parentOrderReversedCount: ${summary.parentOrderReversedCount}`);
  console.log(`c1DependencyStatus: ${summary.c1DependencyStatus}`);
  console.log(`trisonBridgeStatus: ${summary.trisonBridgeStatus}`);
  console.log(`spinorBridgeStatus: ${summary.spinorBridgeStatus}`);
  console.log(`semanticLabelStatus: ${summary.semanticLabelStatus}`);
  console.log(`emissionStatus: ${summary.emissionStatus}`);
  console.log(`uiStatus: ${summary.uiStatus}`);
  console.log(`recommendedNextGate: ${summary.recommendedNextGate}`);
  console.log(`issue count: ${report.issues.length}`);
}

function readRequiredFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    failures.push(`${label} missing at ${path.relative(repoRoot, filePath)}`);
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
}

function hasPackageScript(source, scriptName) {
  try {
    const packageJson = JSON.parse(source);

    return Object.prototype.hasOwnProperty.call(
      packageJson.scripts ?? {},
      scriptName,
    );
  } catch (error) {
    failures.push(`package.json parse failed: ${formatError(error)}`);
    return false;
  }
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`);
  }
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}
