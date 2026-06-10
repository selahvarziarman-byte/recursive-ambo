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
  'src/lib/fanoOctonionicCarrierGraphFieldV0.ts',
);
const packagePath = path.join(repoRoot, 'package.json');
const {
  buildFanoOctonionicCarrierGraphFieldV0Report,
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
  'OCTONIONIC_LAPLACIAN',
  'SPECTRAL_KERNEL',
  'EXP_T_L',
  'ALWAYS_ON_RESPONSE',
  'FLATTENED_BIRTH_EDGE',
  'SEMANTIC_GRAPH_LABEL',
  'TRISON_RESIDUAL',
  'UI_FIELD_RENDER',
];

const failures = [];
const report = buildFanoOctonionicCarrierGraphFieldV0Report();
const tableSource = readRequiredFile(
  tablePath,
  'Fano octonionic carrier graph field source',
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
  expectEqual(report.method, 'fano-octonionic-carrier-graph-field-v0', 'method');
  expectEqual(
    report.c1DependencyStatus,
    'derived-from-c1-local-channel-table',
    'C1 dependency status',
  );
  expectEqual(
    report.e0DependencyStatus,
    'derived-from-e0-profile-library',
    'E0 dependency status',
  );
  expectEqual(
    report.e1DependencyStatus,
    'derived-from-e1-child-emission-envelopes',
    'E1 dependency status',
  );
  expectEqual(report.summary.graphSetCount, 3, 'graph set count');
  expectEqual(report.summary.graphNodeCount, 30, 'graph node count');
  expectEqual(
    report.summary.primalSourceNodeCount,
    12,
    'primal source node count',
  );
  expectEqual(
    report.summary.childSourceNodeCount,
    18,
    'child source node count',
  );
  expectEqual(report.summary.graphEdgeCount, 108, 'graph edge count');
  expectEqual(report.summary.birthEdgeCount, 18, 'birth edge count');
  expectEqual(
    report.summary.parentReturnEdgeCount,
    36,
    'parent return edge count',
  );
  expectEqual(
    report.summary.projectionLoopEdgeCount,
    36,
    'projection loop edge count',
  );
  expectEqual(
    report.summary.complementCouplingEdgeCount,
    18,
    'complement coupling edge count',
  );
  expectEqual(
    report.summary.carrierTransportRowCount,
    108,
    'carrier transport row count',
  );
  expectEqual(
    report.summary.complementSignedTransportRowCount,
    18,
    'complement signed transport row count',
  );
  expectEqual(
    report.summary.nodeActivationWeightRowCount,
    30,
    'node activation/weight row count',
  );
  expectEqual(
    report.summary.edgeActivationWeightRowCount,
    108,
    'edge activation/weight row count',
  );
  expectEqual(
    report.summary.totalActivationWeightRowCount,
    138,
    'total activation/weight row count',
  );
  expectEqual(
    report.summary.pathSumReadinessRowCount,
    108,
    'path-sum readiness row count',
  );
  expectEqual(
    report.summary.nodeSpatialSupportPlaceholderCount,
    30,
    'node spatial support placeholder count',
  );
  expectEqual(
    report.summary.edgeSpatialSupportPlaceholderCount,
    108,
    'edge spatial support placeholder count',
  );
  expectEqual(
    report.summary.totalSpatialSupportPlaceholderCount,
    138,
    'total spatial support placeholder count',
  );
  expectEqual(
    report.summary.graphLawStatus,
    'carrier-connection-graph-field-v0',
    'graph law status',
  );
  expectEqual(
    report.summary.transportLawStatus,
    'finite-one-step-path-readiness-no-spectral-kernel',
    'transport law status',
  );
  expectEqual(
    report.summary.complementSignedTransportStatus,
    'same-ray-opposite-signed-lift-preserved',
    'complement signed transport status',
  );
  expectEqual(
    report.summary.activationLawStatus,
    'intrinsic-free-emission-vs-available-response-preserved',
    'activation law status',
  );
  expectEqual(
    report.summary.weightLawStatus,
    'unit-v0-weights-no-free-tuning',
    'weight law status',
  );
  expectEqual(
    report.summary.birthArityStatus,
    'binary-birth-preserved-not-flattened',
    'birth arity status',
  );
  expectEqual(
    report.summary.spatialBridgeStatus,
    'f2-spatial-support-placeholders-ready',
    'spatial bridge status',
  );
  expectEqual(
    report.summary.continuousProjectionStatus,
    'not-computed-in-f1-next-gate-f2',
    'continuous projection status',
  );
  expectEqual(
    report.summary.semanticLabelStatus,
    'not-attached-placeholders-only',
    'semantic label status',
  );
  expectEqual(
    report.summary.trisonSemanticStatus,
    'not-computed-in-f1',
    'Trison semantic status',
  );
  expectEqual(
    report.summary.spinorBridgeStatus,
    'not-in-f1-carrier-bridge-preserved-upstream',
    'spinor bridge status',
  );
  expectEqual(report.summary.uiStatus, 'no-ui', 'UI status');
  expectEqual(
    report.summary.recommendedNextGate,
    'F2 - Continuous Spatial Support Projection Table',
    'recommended next gate',
  );
  expectEqual(
    report.edgeRows
      .filter((row) => row.edgeFamily === 'birth-edge')
      .every(
        (row) =>
          row.edgeArity === 'binary-source-to-child' &&
          row.sourceNodeIds.length === 2,
      ),
    true,
    'birth edges preserve binary arity',
  );
  expectEqual(
    report.edgeRows
      .filter((row) => row.edgeFamily !== 'birth-edge')
      .every(
        (row) =>
          row.activationStatus === 'available-response-not-free-emission' &&
          row.responseStatus === 'response-kernel-not-always-on',
      ),
    true,
    'response edges are available kernels rather than free emissions',
  );
  expectEqual(
    report.edgeRows
      .filter((row) => row.edgeFamily === 'complement-coupling-edge')
      .every(
        (row) =>
          row.sourceChildSignedLift &&
          row.complementChildSignedLift &&
          row.sourceCarrierRay === row.complementCarrierRay &&
          signOf(row.sourceChildSignedLift) !==
            signOf(row.complementChildSignedLift),
      ),
    true,
    'complement edges preserve same-ray opposite-signed lifts',
  );
  expectEqual(
    report.carrierTransportRows
      .filter((row) => row.edgeFamily === 'complement-coupling-edge')
      .every(
        (row) =>
          !row.transportResult.startsWith('ray:') &&
          row.transportResult.includes('->'),
      ),
    true,
    'complement carrier transport rows use signed lift transitions',
  );
  expectEqual(
    report.activationWeightRows.every(
      (row) => Number.isFinite(row.weight) && row.weight >= 0,
    ),
    true,
    'activation weights are finite and non-negative',
  );
  expectEqual(
    report.nodeRows.every((nodeRow) =>
      report.spatialSupportPlaceholderRows.some(
        (supportRow) =>
          supportRow.ownerKind === 'node' &&
          supportRow.ownerId === nodeRow.nodeId,
      ),
    ),
    true,
    'every node has spatial support placeholder',
  );
  expectEqual(
    report.edgeRows.every((edgeRow) =>
      report.spatialSupportPlaceholderRows.some(
        (supportRow) =>
          supportRow.ownerKind === 'edge' &&
          supportRow.ownerId === edgeRow.edgeId,
      ),
    ),
    true,
    'every edge has spatial support placeholder',
  );
  expectEqual(
    hasPackageScript(
      sources.packageSource,
      'diagnose:fano-octonionic-carrier-graph-field-v0',
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

function printTables(report) {
  console.log('F1 FanoOctonionicCarrierGraphFieldV0 diagnostics');
  console.log('');
  console.log('graph sets');

  for (const row of report.graphSetRows) {
    console.log(`${row.graphId}: ${row.profileSetId} | ${row.graphStatus}`);
  }

  console.log('');
  console.log('node summary rows');

  for (const row of report.nodeRows) {
    if (row.nodeRole === 'primal-source-node') {
      console.log(
        `${row.nodeId}: primal ${row.sourceSlotId} | ${row.signedCarrier} | ${row.profileId} | ${row.spatialSupportKind}`,
      );
    } else {
      console.log(
        `${row.nodeId}: child ${row.childTokenId} | ${formatLabel(row.canonicalLiftId)} ${row.signedLift} | parents ${row.parentSet.join('/')} | ${row.envelopeId} | ${row.spatialSupportKind}`,
      );
    }
  }

  console.log('');
  console.log('edge summary rows by family');

  for (const edgeFamily of [
    'birth-edge',
    'parent-return-edge',
    'projection-loop-edge',
    'complement-coupling-edge',
  ]) {
    console.log(edgeFamily);
    for (const row of report.edgeRows.filter(
      (edgeRow) => edgeRow.edgeFamily === edgeFamily,
    )) {
      console.log(
        `  ${formatLabel(row.edgeId)}: ${row.sourceNodeIds.map(formatLabel).join(' + ')} -> ${row.targetNodeIds.map(formatLabel).join(' + ')} | ${row.activationStatus} | weight ${row.weight}`,
      );
    }
  }

  console.log('');
  console.log(`carrier transport rows: ${report.carrierTransportRows.length}`);
  console.log('complement transport samples');

  const firstGraphId = report.graphSetRows[0]?.graphId;
  const complementTransportSamples = report.edgeRows
    .filter(
      (row) =>
        row.edgeFamily === 'complement-coupling-edge' &&
        row.graphId === firstGraphId,
    )
    .map((edgeRow) => {
      const transportRow = report.carrierTransportRows.find(
        (row) => row.edgeId === edgeRow.edgeId,
      );

      return {
        edgeRow,
        transportRow,
      };
    });

  for (const { edgeRow, transportRow } of complementTransportSamples) {
    console.log(
      `${edgeRow.childTokenId} -> ${edgeRow.complementTokenId} | ${edgeRow.sourceChildSignedLift} -> ${edgeRow.complementChildSignedLift} | ${edgeRow.sourceCarrierRay} | ${transportRow?.transportResult ?? 'missing-transport'}`,
    );
  }

  console.log(
    `activation/weight rows: node ${report.summary.nodeActivationWeightRowCount}, edge ${report.summary.edgeActivationWeightRowCount}`,
  );
  console.log(`path-sum readiness rows: ${report.pathSumReadinessRows.length}`);
  console.log(
    `spatial support placeholders: node ${report.summary.nodeSpatialSupportPlaceholderCount}, edge ${report.summary.edgeSpatialSupportPlaceholderCount}`,
  );
  console.log('');
  console.log('summary');
}

function printCompactReport(report) {
  const summary = report.summary;

  console.log(`graphSetCount: ${summary.graphSetCount}`);
  console.log(`graphNodeCount: ${summary.graphNodeCount}`);
  console.log(`primalSourceNodeCount: ${summary.primalSourceNodeCount}`);
  console.log(`childSourceNodeCount: ${summary.childSourceNodeCount}`);
  console.log(`graphEdgeCount: ${summary.graphEdgeCount}`);
  console.log(`birthEdgeCount: ${summary.birthEdgeCount}`);
  console.log(`parentReturnEdgeCount: ${summary.parentReturnEdgeCount}`);
  console.log(`projectionLoopEdgeCount: ${summary.projectionLoopEdgeCount}`);
  console.log(
    `complementCouplingEdgeCount: ${summary.complementCouplingEdgeCount}`,
  );
  console.log(`carrierTransportRowCount: ${summary.carrierTransportRowCount}`);
  console.log(
    `complementSignedTransportRowCount: ${summary.complementSignedTransportRowCount}`,
  );
  console.log(
    `nodeActivationWeightRowCount: ${summary.nodeActivationWeightRowCount}`,
  );
  console.log(
    `edgeActivationWeightRowCount: ${summary.edgeActivationWeightRowCount}`,
  );
  console.log(
    `totalActivationWeightRowCount: ${summary.totalActivationWeightRowCount}`,
  );
  console.log(`pathSumReadinessRowCount: ${summary.pathSumReadinessRowCount}`);
  console.log(
    `nodeSpatialSupportPlaceholderCount: ${summary.nodeSpatialSupportPlaceholderCount}`,
  );
  console.log(
    `edgeSpatialSupportPlaceholderCount: ${summary.edgeSpatialSupportPlaceholderCount}`,
  );
  console.log(
    `totalSpatialSupportPlaceholderCount: ${summary.totalSpatialSupportPlaceholderCount}`,
  );
  console.log(`graphLawStatus: ${summary.graphLawStatus}`);
  console.log(`transportLawStatus: ${summary.transportLawStatus}`);
  console.log(
    `complementSignedTransportStatus: ${summary.complementSignedTransportStatus}`,
  );
  console.log(`activationLawStatus: ${summary.activationLawStatus}`);
  console.log(`weightLawStatus: ${summary.weightLawStatus}`);
  console.log(`birthArityStatus: ${summary.birthArityStatus}`);
  console.log(`spatialBridgeStatus: ${summary.spatialBridgeStatus}`);
  console.log(`continuousProjectionStatus: ${summary.continuousProjectionStatus}`);
  console.log(`semanticLabelStatus: ${summary.semanticLabelStatus}`);
  console.log(`trisonSemanticStatus: ${summary.trisonSemanticStatus}`);
  console.log(`spinorBridgeStatus: ${summary.spinorBridgeStatus}`);
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

function formatLabel(value) {
  return String(value).replace(/·/g, '*').replace(/Â·/g, '*');
}

function signOf(signedLift) {
  return String(signedLift).slice(0, 1);
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
