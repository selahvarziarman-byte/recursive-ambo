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
const localChannelTablePath = path.join(
  repoRoot,
  'src/lib/fanoOctonionicLocalChannelTableV0.ts',
);
const packagePath = path.join(repoRoot, 'package.json');
const {
  buildFanoOctonionicLocalChannelTableV0Report,
} = require(localChannelTablePath);

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
    label: 'FieldCue import',
    pattern:
      /from\s+['"][^'"]*FieldCue|from\s+['"][^'"]*fieldCue|require\(\s*['"][^'"]*(?:FieldCue|fieldCue)/i,
  },
  {
    label: 'GeneratedSiteReading import',
    pattern:
      /from\s+['"][^'"]*GeneratedSiteReading|from\s+['"][^'"]*generatedSiteReading|require\(\s*['"][^'"]*(?:GeneratedSiteReading|generatedSiteReading)/i,
  },
  {
    label: 'components import',
    pattern:
      /from\s+['"][^'"]*[/\\]components[/\\]|require\(\s*['"][^'"]*[/\\]components[/\\]/i,
  },
];
const FORBIDDEN_SOURCE_NAMES = [
  'LOCAL_CHANNEL_MAP',
  'HARDCODED_LOCAL_CHANNEL',
  'MANUAL_LOCAL_CHANNEL',
  'PARENT_RETURN_MAP',
  'PROJECTION_LOOP_MAP',
];

const failures = [];
const report = buildFanoOctonionicLocalChannelTableV0Report();
const localChannelSource = readRequiredFile(
  localChannelTablePath,
  'Fano octonionic local channel table source',
);
const packageSource = readRequiredFile(packagePath, 'package.json');

runAssertions(report, { localChannelSource, packageSource });
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
  expectEqual(report.method, 'fano-octonionic-local-channel-table-v0', 'method');
  expectEqual(
    report.summary.method,
    'fano-octonionic-local-channel-table-v0',
    'summary method',
  );
  expectEqual(
    report.summary.canonicalChildCarrierCount,
    6,
    'canonical child carrier count',
  );
  expectEqual(report.summary.localChannelRowCount, 24, 'local channel row count');
  expectEqual(
    report.summary.parentReturnChannelCount,
    12,
    'parent return channel count',
  );
  expectEqual(
    report.summary.projectionLoopChannelCount,
    12,
    'projection loop channel count',
  );
  expectEqual(
    report.summary.childLeftRecoveryOkCount,
    24,
    'child-left recovery ok count',
  );
  expectEqual(
    report.summary.sourceLeftOrientationWitnessCount,
    24,
    'source-left orientation witness count',
  );
  expectEqual(
    report.summary.c0CarrierDependencyStatus,
    'derived-from-c0-strict-carrier-table',
    'C0 carrier dependency status',
  );
  expectEqual(
    report.summary.semanticLabelStatus,
    'not-attached-placeholders-only',
    'semantic label status',
  );
  expectEqual(
    report.summary.associatorStatus,
    'not-computed-in-c1-local-channel-inputs-ready',
    'associator status',
  );
  expectEqual(
    report.summary.spinorBridgeStatus,
    'signed-lift-local-channel-data-ready-not-spinor-representation',
    'spinor bridge status',
  );
  expectEqual(
    report.summary.emissionStatus,
    'not-attached-in-c1',
    'emission status',
  );
  expectEqual(report.summary.uiStatus, 'no-ui', 'UI status');
  expectEqual(
    report.summary.recommendedNextGate,
    'A0 - Fano-Octonionic Associator Projection Table',
    'recommended next gate',
  );
  expectEqual(
    report.canonicalChildCarrierStates.every(
      (state) => state.sourceTokenStatus === 'semantic-label-not-attached',
    ),
    true,
    'semantic labels remain unattached',
  );
  expectEqual(
    report.canonicalChildCarrierStates.every(
      (state) =>
        state.spinorBridgeStatus ===
        'signed-lift-local-channel-data-ready-not-spinor-representation',
    ),
    true,
    'spinor bridge data remains non-representational',
  );
  expectEqual(
    report.localChannelRows.every(
      (row) =>
        row.childLeftRecoveryStatus === 'recovered-expected-source-ray' &&
        row.childLeftRecoveredSourceId === row.expectedRecoveredSourceId,
    ),
    true,
    'every child-left row recovers expected source ray',
  );
  expectEqual(
    report.localChannelRows.every(
      (row) =>
        row.sourceLeftOrientationRelation ===
          'same-ray-opposite-signed-orientation' &&
        row.sourceLeftResultRay === row.childLeftResultRay &&
        row.sourceLeftSignedResult.slice(0, 1) !==
          row.childLeftSignedResult.slice(0, 1),
    ),
    true,
    'every source-left row witnesses reverse-order orientation',
  );
  expectEqual(
    report.localChannelRows.every((row) => Boolean(row.derivationStatus)),
    true,
    'every row has derivation status',
  );
  expectEqual(report.summary.semanticLabelStatus.includes('attached'), true, 'semantic label placeholder text present');
  expectEqual(
    report.summary.emissionStatus,
    'not-attached-in-c1',
    'emission not attached',
  );
  expectEqual(report.summary.uiStatus, 'no-ui', 'UI not attached');
  expectEqual(
    hasPackageScript(
      sources.packageSource,
      'diagnose:fano-octonionic-local-channel-table-v0',
    ),
    true,
    'package script exists',
  );

  for (const { label, pattern } of FORBIDDEN_IMPORT_PATTERNS) {
    expectEqual(pattern.test(sources.localChannelSource), false, `no ${label}`);
  }

  for (const sourceName of FORBIDDEN_SOURCE_NAMES) {
    expectEqual(
      sources.localChannelSource.includes(sourceName),
      false,
      `source avoids hard-coded local channel name ${sourceName}`,
    );
  }
}

function printTables(report) {
  console.log('C1 FanoOctonionicLocalChannelTableV0 diagnostics');
  console.log('');
  console.log('canonical child carrier states');

  for (const state of report.canonicalChildCarrierStates) {
    console.log(
      `${state.tokenId}: parents ${state.parentSet.join('/')} | projected ${state.projectedSourceSet.join('/')} | ${state.canonicalLiftId} | ${state.signedLift} | ${state.carrierRay} | complement ${state.complementTokenId}`,
    );
  }

  console.log('');
  console.log('local channel rows');

  for (const row of report.localChannelRows) {
    console.log(
      `${row.childTokenId}/${row.actionSourceId}: ${row.channelFamily} | expected ${row.expectedRecoveredSourceId} | child-left ${row.childLeftOperation} -> ${row.childLeftSignedResult} ${row.childLeftResultRay} ${row.childLeftRecoveredSourceId} | source-left ${row.sourceLeftOperation} -> ${row.sourceLeftSignedResult} ${row.sourceLeftResultRay} ${row.sourceLeftRecoveredSourceId} | ${row.sourceLeftOrientationRelation}`,
    );
  }

  console.log('');
  console.log('summary');
}

function printCompactReport(report) {
  const summary = report.summary;

  console.log(
    `canonicalChildCarrierCount: ${summary.canonicalChildCarrierCount}`,
  );
  console.log(`localChannelRowCount: ${summary.localChannelRowCount}`);
  console.log(
    `parentReturnChannelCount: ${summary.parentReturnChannelCount}`,
  );
  console.log(
    `projectionLoopChannelCount: ${summary.projectionLoopChannelCount}`,
  );
  console.log(
    `childLeftRecoveryOkCount: ${summary.childLeftRecoveryOkCount}`,
  );
  console.log(
    `sourceLeftOrientationWitnessCount: ${summary.sourceLeftOrientationWitnessCount}`,
  );
  console.log(
    `c0CarrierDependencyStatus: ${summary.c0CarrierDependencyStatus}`,
  );
  console.log(`semanticLabelStatus: ${summary.semanticLabelStatus}`);
  console.log(`associatorStatus: ${summary.associatorStatus}`);
  console.log(`spinorBridgeStatus: ${summary.spinorBridgeStatus}`);
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
