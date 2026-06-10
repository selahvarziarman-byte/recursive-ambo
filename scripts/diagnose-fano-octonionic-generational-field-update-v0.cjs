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
  'src/lib/fanoOctonionicGenerationalFieldUpdateV0.ts',
);
const packagePath = path.join(repoRoot, 'package.json');
const {
  buildFanoOctonionicGenerationalFieldUpdateV0Report,
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
  'G2_CARRIER',
  'SECOND_GENERATION_SOURCE',
  'RECURSIVE_AMBO_G2',
  'ALWAYS_ON_RESPONSE_FIELD',
  'UI_FIELD_RENDER',
  'TRISON_RESIDUAL',
  'SEMANTIC_GENERATION_LABEL',
  'SPECTRAL_KERNEL',
  'OCTONIONIC_LAPLACIAN',
];

const failures = [];
const report = buildFanoOctonionicGenerationalFieldUpdateV0Report();
const tableSource = readRequiredFile(
  tablePath,
  'Fano octonionic generational field update source',
);
const packageSource = readRequiredFile(packagePath, 'package.json');

runAssertions(report, { tableSource, packageSource });
printReport(report);

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
  const summary = report.summary;

  expectEqual(report.ok, true, 'report ok');
  expectEqual(
    report.method,
    'fano-octonionic-generational-field-update-v0',
    'method',
  );
  expectEqual(
    report.f1DependencyStatus,
    'derived-from-f1-carrier-graph-field',
    'F1 dependency status',
  );
  expectEqual(
    report.f2DependencyStatus,
    'derived-from-f2-spatial-support-projection',
    'F2 dependency status',
  );
  expectEqual(summary.graphSetCount, 3, 'graph set count');
  expectEqual(summary.generationSnapshotRowCount, 6, 'generation snapshot row count');
  expectEqual(summary.generationTransitionRowCount, 3, 'generation transition row count');
  expectEqual(summary.activeSourceMembershipRowCount, 42, 'active source membership row count');
  expectEqual(summary.persistentSourceMembershipRowCount, 12, 'persistent source membership row count');
  expectEqual(summary.bornSourceMembershipRowCount, 18, 'born source membership row count');
  expectEqual(summary.edgeAvailabilityRowCount, 108, 'edge availability row count');
  expectEqual(summary.baselineContributionSelectionRowCount, 462, 'baseline contribution selection row count');
  expectEqual(
    summary.responseProbeContributionAvailabilityRowCount,
    990,
    'response probe contribution availability row count',
  );
  expectEqual(
    summary.structuralBirthSupportAvailabilityRowCount,
    198,
    'structural birth support availability row count',
  );
  expectEqual(summary.baselineFieldAggregateRowCount, 66, 'baseline field aggregate row count');
  expectEqual(summary.baselineFieldDeltaRowCount, 33, 'baseline field delta row count');
  expectEqual(summary.recompositionSummaryRowCount, 3, 'recomposition summary row count');
  expectEqual(summary.g0TotalActiveSourceCount, 12, 'G0 total active source count');
  expectEqual(summary.g1TotalActiveSourceCount, 30, 'G1 total active source count');
  expectEqual(summary.totalBornSourceCount, 18, 'total born source count');
  expectEqual(summary.totalNewEdgeCount, 108, 'total new edge count');
  expectEqual(
    summary.sourcePopulationUpdateStatus,
    'active-sources-g1-equals-g0-plus-born-sources',
    'source population update status',
  );
  expectEqual(
    summary.carrierGraphUpdateStatus,
    'first-birth-carrier-graph-added-without-g2-carrier-invention',
    'carrier graph update status',
  );
  expectEqual(
    summary.spatialProjectionUpdateStatus,
    'f2-spatial-support-reused-for-generation-snapshots',
    'spatial projection update status',
  );
  expectEqual(
    summary.fieldRecompositionStatus,
    'g1-baseline-field-recomposed-from-g0-plus-born-child-contributions',
    'field recomposition status',
  );
  expectEqual(
    summary.baselineDeltaConsistencyStatus,
    'generation-delta-equals-born-source-contribution-sum',
    'baseline delta consistency status',
  );
  expectEqual(
    summary.responseProbeStatus,
    'response-probes-available-excluded-from-baseline',
    'response probe status',
  );
  expectEqual(
    summary.structuralBirthStatus,
    'birth-edges-structural-support-not-field-emission',
    'structural birth status',
  );
  expectEqual(
    summary.noG2CarrierStatus,
    'no-second-generation-carriers-invented',
    'no later carrier status',
  );
  expectEqual(summary.uiStatus, 'no-ui', 'UI status');
  expectEqual(
    summary.semanticLabelStatus,
    'not-attached-placeholders-only',
    'semantic label status',
  );
  expectEqual(summary.trisonSemanticStatus, 'not-computed-in-g0', 'Trison semantic status');
  expectEqual(
    summary.recommendedNextGate,
    'S0 - Fano-Trison Semantic Residual Model Card',
    'recommended next gate',
  );
  expectEqual(
    report.generationSnapshotRows
      .filter((row) => row.generationIndex === 0)
      .every(
        (row) =>
          row.activeChildSourceCount === 0 &&
          row.activeGraphEdgeCount === 0 &&
          row.baselineContributionCount === 44,
      ),
    true,
    'G0 snapshots are primal only',
  );
  expectEqual(
    report.generationSnapshotRows
      .filter((row) => row.generationIndex === 1)
      .every(
        (row) =>
          row.activeChildSourceCount === 6 &&
          row.activeGraphEdgeCount === 36 &&
          row.baselineContributionCount === 110,
      ),
    true,
    'G1 snapshots include first-born children and graph edges',
  );
  expectEqual(
    report.baselineContributionSelectionRows.every(
      (row) => row.ownerKind === 'node',
    ),
    true,
    'baseline selections contain node contributions only',
  );
  expectEqual(
    report.responseProbeContributionAvailabilityRows.every(
      (row) =>
        row.baselineInclusionStatus ===
        'excluded-from-generation-baseline-field',
    ),
    true,
    'response probes are excluded from baseline',
  );
  expectEqual(
    report.baselineFieldDeltaRows.every(
      (row) =>
        Math.abs(row.realDelta - row.bornSourceContributionRealSum) <= 1e-9 &&
        Math.abs(row.imagDelta - row.bornSourceContributionImagSum) <= 1e-9,
    ),
    true,
    'baseline deltas equal born child contribution sums',
  );
  expectEqual(
    hasPackageScript(
      sources.packageSource,
      'diagnose:fano-octonionic-generational-field-update-v0',
    ),
    true,
    'package script exists',
  );
  expectEqual(
    sources.tableSource.includes('Math.random'),
    false,
    'source avoids Math.random',
  );

  for (const { label, pattern } of FORBIDDEN_IMPORT_PATTERNS) {
    expectEqual(pattern.test(sources.tableSource), false, `no ${label}`);
  }

  for (const sourceName of FORBIDDEN_SOURCE_NAMES) {
    expectEqual(
      sources.tableSource.includes(sourceName),
      false,
      `source avoids forbidden name ${sourceName}`,
    );
  }
}

function printReport(report) {
  console.log('G0 FanoOctonionicGenerationalFieldUpdateV0 diagnostics');
  console.log('');
  printSnapshotSummary(report);
  console.log('');
  printTransitionSummary(report);
  console.log('');
  printMembershipCounts(report);
  console.log('');
  printAggregateCounts(report);
  console.log('');
  printDeltaSamples(report);
  console.log('');
  printCompactReport(report);
}

function printSnapshotSummary(report) {
  console.log('generation snapshot summary');

  for (const row of report.generationSnapshotRows) {
    console.log(
      `${row.snapshotId}: g${row.generationIndex} active=${row.activeSourceCount} primal=${row.activePrimalSourceCount} child=${row.activeChildSourceCount} edges=${row.activeGraphEdgeCount} baseline=${row.baselineContributionCount}`,
    );
  }
}

function printTransitionSummary(report) {
  console.log('transition summary');

  for (const row of report.generationTransitionRows) {
    console.log(
      `${row.transitionId}: persistent=${row.persistentSourceCount} born=${row.bornSourceCount} retired=${row.retiredSourceCount} newEdges=${row.newEdgeCount}`,
    );
  }
}

function printMembershipCounts(report) {
  console.log('active source membership counts');
  console.log(`total memberships: ${report.summary.activeSourceMembershipRowCount}`);
  console.log(`persistent roots: ${report.summary.persistentSourceMembershipRowCount}`);
  console.log(`born children: ${report.summary.bornSourceMembershipRowCount}`);
}

function printAggregateCounts(report) {
  console.log('baseline aggregate counts');
  console.log(`aggregate rows: ${report.summary.baselineFieldAggregateRowCount}`);
  console.log(`delta rows: ${report.summary.baselineFieldDeltaRowCount}`);
  console.log(`selection rows: ${report.summary.baselineContributionSelectionRowCount}`);
}

function printDeltaSamples(report) {
  console.log('delta consistency samples');

  for (const row of report.baselineFieldDeltaRows.slice(0, 6)) {
    console.log(
      `${row.deltaId}: d=(${formatNumber(row.realDelta)}, ${formatNumber(row.imagDelta)}) born=(${formatNumber(row.bornSourceContributionRealSum)}, ${formatNumber(row.bornSourceContributionImagSum)}) | ${row.deltaConsistencyStatus}`,
    );
  }
}

function printCompactReport(report) {
  const summary = report.summary;

  console.log(`graphSetCount: ${summary.graphSetCount}`);
  console.log(`generationSnapshotRowCount: ${summary.generationSnapshotRowCount}`);
  console.log(`generationTransitionRowCount: ${summary.generationTransitionRowCount}`);
  console.log(`activeSourceMembershipRowCount: ${summary.activeSourceMembershipRowCount}`);
  console.log(`persistentSourceMembershipRowCount: ${summary.persistentSourceMembershipRowCount}`);
  console.log(`bornSourceMembershipRowCount: ${summary.bornSourceMembershipRowCount}`);
  console.log(`edgeAvailabilityRowCount: ${summary.edgeAvailabilityRowCount}`);
  console.log(
    `baselineContributionSelectionRowCount: ${summary.baselineContributionSelectionRowCount}`,
  );
  console.log(
    `responseProbeContributionAvailabilityRowCount: ${summary.responseProbeContributionAvailabilityRowCount}`,
  );
  console.log(
    `structuralBirthSupportAvailabilityRowCount: ${summary.structuralBirthSupportAvailabilityRowCount}`,
  );
  console.log(`baselineFieldAggregateRowCount: ${summary.baselineFieldAggregateRowCount}`);
  console.log(`baselineFieldDeltaRowCount: ${summary.baselineFieldDeltaRowCount}`);
  console.log(`recompositionSummaryRowCount: ${summary.recompositionSummaryRowCount}`);
  console.log(`g0TotalActiveSourceCount: ${summary.g0TotalActiveSourceCount}`);
  console.log(`g1TotalActiveSourceCount: ${summary.g1TotalActiveSourceCount}`);
  console.log(`totalBornSourceCount: ${summary.totalBornSourceCount}`);
  console.log(`totalNewEdgeCount: ${summary.totalNewEdgeCount}`);
  console.log(`sourcePopulationUpdateStatus: ${summary.sourcePopulationUpdateStatus}`);
  console.log(`carrierGraphUpdateStatus: ${summary.carrierGraphUpdateStatus}`);
  console.log(`spatialProjectionUpdateStatus: ${summary.spatialProjectionUpdateStatus}`);
  console.log(`fieldRecompositionStatus: ${summary.fieldRecompositionStatus}`);
  console.log(`baselineDeltaConsistencyStatus: ${summary.baselineDeltaConsistencyStatus}`);
  console.log(`responseProbeStatus: ${summary.responseProbeStatus}`);
  console.log(`structuralBirthStatus: ${summary.structuralBirthStatus}`);
  console.log(`noG2CarrierStatus: ${summary.noG2CarrierStatus}`);
  console.log(`uiStatus: ${summary.uiStatus}`);
  console.log(`semanticLabelStatus: ${summary.semanticLabelStatus}`);
  console.log(`trisonSemanticStatus: ${summary.trisonSemanticStatus}`);
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

function formatNumber(value) {
  return Number.isFinite(value) ? value.toFixed(12) : String(value);
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}
