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
  'src/lib/fanoOctonionicSpatialSupportProjectionV0.ts',
);
const packagePath = path.join(repoRoot, 'package.json');
const {
  buildFanoOctonionicSpatialSupportProjectionV0Report,
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
  'RADIAL_WAVE_ONTOLOGY',
  'POINT_PHASE_SOURCE',
  'ALWAYS_ON_RESPONSE_FIELD',
  'UI_FIELD_RENDER',
  'SHADER_FIELD',
  'TRISON_RESIDUAL',
  'GENERATIONAL_FIELD_UPDATE',
  'SPECTRAL_KERNEL',
  'OCTONIONIC_LAPLACIAN',
];

const failures = [];
const report = buildFanoOctonionicSpatialSupportProjectionV0Report();
const tableSource = readRequiredFile(
  tablePath,
  'Fano octonionic spatial support projection source',
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
    'fano-octonionic-spatial-support-projection-v0',
    'method',
  );
  expectEqual(
    report.f1DependencyStatus,
    'derived-from-f1-carrier-graph-field',
    'F1 dependency status',
  );
  expectEqual(
    report.e0DependencyStatus,
    'e0-used-to-resolve-primal-oscillator-coefficients',
    'E0 dependency status',
  );
  expectEqual(
    report.e1DependencyStatus,
    'e1-used-to-resolve-child-oscillator-coefficients',
    'E1 dependency status',
  );
  expectEqual(summary.graphSetCount, 3, 'graph set count');
  expectEqual(summary.nodeSpatialAnchorRowCount, 30, 'node spatial anchor row count');
  expectEqual(summary.nodeSupportFunctionRowCount, 30, 'node support function row count');
  expectEqual(summary.edgeSupportFunctionRowCount, 108, 'edge support function row count');
  expectEqual(summary.totalSupportFunctionRowCount, 138, 'total support function row count');
  expectEqual(summary.samplePointRowCount, 33, 'sample point row count');
  expectEqual(summary.nodeSupportSampleRowCount, 330, 'node support sample row count');
  expectEqual(summary.edgeSupportSampleRowCount, 1188, 'edge support sample row count');
  expectEqual(summary.supportSampleRowCount, 1518, 'support sample row count');
  expectEqual(
    summary.baselineIntrinsicContributionRowCount,
    330,
    'baseline intrinsic contribution row count',
  );
  expectEqual(
    summary.responseProbeContributionRowCount,
    990,
    'response probe contribution row count',
  );
  expectEqual(
    summary.structuralBirthSupportSampleRowCount,
    198,
    'structural birth support sample row count',
  );
  expectEqual(
    summary.totalFieldContributionSampleRowCount,
    1320,
    'total field contribution sample row count',
  );
  expectEqual(summary.finiteSupportSampleStatus, 'all-support-samples-finite', 'finite support sample status');
  expectEqual(
    summary.finiteContributionStatus,
    'all-field-contribution-samples-finite',
    'finite contribution status',
  );
  expectEqual(
    summary.coordinateLawStatus,
    'regular-tetrahedron-centered-coordinate-frame-v0',
    'coordinate law status',
  );
  expectEqual(
    summary.supportLawStatus,
    'barycentric-node-and-action-mediated-edge-support-v0',
    'support law status',
  );
  expectEqual(
    summary.complementAxisSpatializationStatus,
    'signed-complement-midpoints-form-octahedral-axes',
    'complement axis spatialization status',
  );
  expectEqual(
    summary.birthSpatializationStatus,
    'binary-birth-arity-preserved-spatially-supported-by-midpoint-basis',
    'birth spatialization status',
  );
  expectEqual(
    summary.responseActivationStatus,
    'response-probes-sampled-separately-from-baseline',
    'response activation status',
  );
  expectEqual(
    summary.carrierProjectionStatus,
    'carrier-retained-not-reduced-to-phase',
    'carrier projection status',
  );
  expectEqual(
    summary.observableStatus,
    'complex-coefficient-is-field-observable-not-source-ontology',
    'observable status',
  );
  expectEqual(
    summary.spatialProjectionStatus,
    'continuous-spatial-support-sampled',
    'spatial projection status',
  );
  expectEqual(summary.uiStatus, 'no-ui', 'UI status');
  expectEqual(
    summary.semanticLabelStatus,
    'not-attached-placeholders-only',
    'semantic label status',
  );
  expectEqual(summary.trisonSemanticStatus, 'not-computed-in-f2', 'Trison semantic status');
  expectEqual(
    summary.generationalFieldUpdateStatus,
    'not-computed-in-f2',
    'generational field update status',
  );
  expectEqual(
    summary.recommendedNextGate,
    'G0 - Generational Field Update Table',
    'recommended next gate',
  );
  expectEqual(
    report.supportSampleRows.every(
      (row) =>
        Number.isFinite(row.supportValue) &&
        Number.isFinite(row.supportDistance) &&
        row.supportValue >= 0,
    ),
    true,
    'support samples are finite and non-negative',
  );
  expectEqual(
    report.fieldContributionSampleRows.every(
      (row) =>
        Number.isFinite(row.realCoefficient) &&
        Number.isFinite(row.imagCoefficient) &&
        Number.isFinite(row.effectiveAmplitude) &&
        Number.isFinite(row.attenuationFactor),
    ),
    true,
    'field contribution samples are finite',
  );
  expectEqual(
    report.fieldContributionSampleRows
      .filter((row) => row.ownerKind === 'edge')
      .every(
        (row) =>
          row.baselineInclusionStatus ===
          'excluded-from-baseline-available-response',
      ),
    true,
    'response edge probes are excluded from baseline',
  );
  expectEqual(
    report.fieldContributionSampleRows.every(
      (row) =>
        row.carrierProjectionStatus === 'carrier-retained-not-reduced-to-phase',
    ),
    true,
    'carrier is retained on contribution rows',
  );
  expectEqual(
    report.fieldContributionSampleRows
      .filter((row) => row.contributionFamily === 'unit-response-probe-edge')
      .every((row) => Boolean(row.sourceEmissionEnvelopeId)),
    true,
    'response probes resolve source child emission',
  );
  expectEqual(
    hasPackageScript(
      sources.packageSource,
      'diagnose:fano-octonionic-spatial-support-projection-v0',
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
  console.log('F2 FanoOctonionicSpatialSupportProjectionV0 diagnostics');
  console.log('');
  printCoordinateFrame();
  console.log('');
  console.log(`graph set count: ${report.graphSetRows.length}`);
  console.log('');
  printAnchorSummary(report);
  console.log('');
  printSupportFunctionCounts(report);
  console.log('');
  console.log(`sample point rows: ${report.samplePointRows.length}`);
  console.log('');
  printSupportSampleCounts(report);
  console.log('');
  console.log(
    `baseline contribution rows: ${report.summary.baselineIntrinsicContributionRowCount}`,
  );
  console.log(
    `response-probe contribution rows: ${report.summary.responseProbeContributionRowCount}`,
  );
  console.log('');
  printComplementAxisSampleCheck(report);
  console.log('');
  printCompactReport(report);
}

function printCoordinateFrame() {
  console.log('coordinate frame');
  console.log('A: (1, 1, 1)');
  console.log('B: (1, -1, -1)');
  console.log('C: (-1, 1, -1)');
  console.log('D: (-1, -1, 1)');
}

function printAnchorSummary(report) {
  const vertexAnchorCount = report.spatialAnchorRows.filter(
    (row) => row.anchorKind === 'tetra-vertex-anchor',
  ).length;
  const childAnchorCount = report.spatialAnchorRows.filter(
    (row) => row.anchorKind === 'child-edge-midpoint-anchor',
  ).length;

  console.log('anchor summary');
  console.log(`tetra vertex anchors: ${vertexAnchorCount}`);
  console.log(`child midpoint anchors: ${childAnchorCount}`);
  console.log(`total anchors: ${report.spatialAnchorRows.length}`);
}

function printSupportFunctionCounts(report) {
  console.log('support function counts');
  console.log(`node support functions: ${report.summary.nodeSupportFunctionRowCount}`);
  console.log(`edge support functions: ${report.summary.edgeSupportFunctionRowCount}`);
  console.log(`total support functions: ${report.summary.totalSupportFunctionRowCount}`);
}

function printSupportSampleCounts(report) {
  console.log('support sample counts');
  console.log(`node support samples: ${report.summary.nodeSupportSampleRowCount}`);
  console.log(`edge support samples: ${report.summary.edgeSupportSampleRowCount}`);
  console.log(`total support samples: ${report.summary.supportSampleRowCount}`);
}

function printComplementAxisSampleCheck(report) {
  const firstGraphId = report.graphSetRows[0]?.graphId;
  const pairs = [
    ['M_AB', 'M_CD', 'x-axis'],
    ['M_AC', 'M_BD', 'y-axis'],
    ['M_AD', 'M_BC', 'z-axis'],
  ];

  console.log('complement-axis sample check');

  for (const [leftToken, rightToken, axisLabel] of pairs) {
    const leftAnchor = report.spatialAnchorRows.find(
      (row) => row.graphId === firstGraphId && row.sourceToken === leftToken,
    );
    const rightAnchor = report.spatialAnchorRows.find(
      (row) => row.graphId === firstGraphId && row.sourceToken === rightToken,
    );

    console.log(
      `${leftToken} ${formatCoordinate(leftAnchor?.coordinate)} / ${rightToken} ${formatCoordinate(rightAnchor?.coordinate)} | ${axisLabel}`,
    );
  }
}

function printCompactReport(report) {
  const summary = report.summary;

  console.log(`graphSetCount: ${summary.graphSetCount}`);
  console.log(`nodeSpatialAnchorRowCount: ${summary.nodeSpatialAnchorRowCount}`);
  console.log(`nodeSupportFunctionRowCount: ${summary.nodeSupportFunctionRowCount}`);
  console.log(`edgeSupportFunctionRowCount: ${summary.edgeSupportFunctionRowCount}`);
  console.log(`totalSupportFunctionRowCount: ${summary.totalSupportFunctionRowCount}`);
  console.log(`samplePointRowCount: ${summary.samplePointRowCount}`);
  console.log(`nodeSupportSampleRowCount: ${summary.nodeSupportSampleRowCount}`);
  console.log(`edgeSupportSampleRowCount: ${summary.edgeSupportSampleRowCount}`);
  console.log(`supportSampleRowCount: ${summary.supportSampleRowCount}`);
  console.log(
    `baselineIntrinsicContributionRowCount: ${summary.baselineIntrinsicContributionRowCount}`,
  );
  console.log(
    `responseProbeContributionRowCount: ${summary.responseProbeContributionRowCount}`,
  );
  console.log(
    `structuralBirthSupportSampleRowCount: ${summary.structuralBirthSupportSampleRowCount}`,
  );
  console.log(
    `totalFieldContributionSampleRowCount: ${summary.totalFieldContributionSampleRowCount}`,
  );
  console.log(`finiteSupportSampleStatus: ${summary.finiteSupportSampleStatus}`);
  console.log(`finiteContributionStatus: ${summary.finiteContributionStatus}`);
  console.log(`coordinateLawStatus: ${summary.coordinateLawStatus}`);
  console.log(`supportLawStatus: ${summary.supportLawStatus}`);
  console.log(
    `complementAxisSpatializationStatus: ${summary.complementAxisSpatializationStatus}`,
  );
  console.log(`birthSpatializationStatus: ${summary.birthSpatializationStatus}`);
  console.log(`responseActivationStatus: ${summary.responseActivationStatus}`);
  console.log(`carrierProjectionStatus: ${summary.carrierProjectionStatus}`);
  console.log(`observableStatus: ${summary.observableStatus}`);
  console.log(`spatialProjectionStatus: ${summary.spatialProjectionStatus}`);
  console.log(`uiStatus: ${summary.uiStatus}`);
  console.log(`semanticLabelStatus: ${summary.semanticLabelStatus}`);
  console.log(`trisonSemanticStatus: ${summary.trisonSemanticStatus}`);
  console.log(
    `generationalFieldUpdateStatus: ${summary.generationalFieldUpdateStatus}`,
  );
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

function formatCoordinate(coordinate) {
  if (!coordinate) {
    return '(missing)';
  }

  return `(${coordinate.x}, ${coordinate.y}, ${coordinate.z})`;
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
