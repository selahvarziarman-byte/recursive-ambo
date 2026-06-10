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
  'src/lib/fanoOctonionicChildEmissionEnvelopeV0.ts',
);
const packagePath = path.join(repoRoot, 'package.json');
const {
  buildFanoOctonionicChildEmissionEnvelopeV0Report,
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
  'RANDOM_EMISSION',
  'FREE_TUNING',
  'ALWAYS_ON_CHANNEL_EMISSION',
  'SEMANTIC_CHILD_LABEL',
  'TRISON_RESIDUAL',
  'GENERATIONAL_FIELD_UPDATE',
];

const failures = [];
const report = buildFanoOctonionicChildEmissionEnvelopeV0Report();
const tableSource = readRequiredFile(
  tablePath,
  'Fano octonionic child emission envelope source',
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
    'fano-octonionic-child-emission-envelope-v0',
    'method',
  );
  expectEqual(
    report.summary.method,
    'fano-octonionic-child-emission-envelope-v0',
    'summary method',
  );
  expectEqual(
    report.summary.c1DependencyStatus,
    'derived-from-c1-local-channel-table',
    'C1 dependency status',
  );
  expectEqual(
    report.summary.e0DependencyStatus,
    'derived-from-e0-finite-profile-library',
    'E0 dependency status',
  );
  expectEqual(report.summary.profileSetCount, 3, 'profile set count');
  expectEqual(
    report.summary.canonicalChildCarrierCount,
    6,
    'canonical child carrier count',
  );
  expectEqual(
    report.summary.childEmissionEnvelopeCount,
    18,
    'child emission envelope count',
  );
  expectEqual(
    report.summary.intrinsicBirthEmissionCount,
    18,
    'intrinsic birth emission count',
  );
  expectEqual(
    report.summary.parentReturnKernelRowCount,
    36,
    'parent return kernel row count',
  );
  expectEqual(
    report.summary.projectionLoopKernelRowCount,
    36,
    'projection loop kernel row count',
  );
  expectEqual(
    report.summary.complementCouplingKernelRowCount,
    18,
    'complement coupling kernel row count',
  );
  expectEqual(
    report.summary.totalChannelKernelRowCount,
    90,
    'total channel kernel row count',
  );
  expectEqual(
    report.summary.birthLawStatus,
    'candidate-product-modulation-octave-folded-v0',
    'birth law status',
  );
  expectEqual(
    report.summary.frequencyNormalizationStatus,
    'octave-folded-to-unit-octave',
    'frequency normalization status',
  );
  expectEqual(
    report.summary.freeEmissionStatus,
    'intrinsic-birth-emission-only',
    'free emission status',
  );
  expectEqual(
    report.summary.channelResponseStatus,
    'local-channels-available-not-always-on',
    'channel response status',
  );
  expectEqual(
    report.summary.carrierPhaseProjectionStatus,
    'signed-lift-phase-offset-applied-without-reducing-carrier',
    'carrier phase projection status',
  );
  expectEqual(
    report.summary.carrierEmissionSeparationStatus,
    'carrier-and-emission-separated',
    'carrier emission separation status',
  );
  expectEqual(
    report.summary.spatialProjectionStatus,
    'not-projected-to-spatial-field-in-e1',
    'spatial projection status',
  );
  expectEqual(
    report.summary.semanticLabelStatus,
    'not-attached-placeholders-only',
    'semantic label status',
  );
  expectEqual(
    report.summary.generationalFieldUpdateStatus,
    'not-computed-in-e1',
    'generational field update status',
  );
  expectEqual(
    report.summary.trisonSemanticStatus,
    'not-computed-in-e1',
    'Trison semantic status',
  );
  expectEqual(
    report.summary.spinorBridgeStatus,
    'not-in-e1-carrier-bridge-preserved-upstream',
    'spinor bridge status',
  );
  expectEqual(report.summary.uiStatus, 'no-ui', 'UI status');
  expectEqual(
    report.summary.recommendedNextGate,
    'S0 - Fano-Trison Semantic Residual Model Card',
    'recommended next gate',
  );
  expectEqual(
    report.childEmissionEnvelopes.every(
      (envelope) =>
        envelope.parentReturnKernelRows.length === 2 &&
        envelope.projectionLoopKernelRows.length === 2 &&
        Boolean(envelope.complementCouplingKernelRow),
    ),
    true,
    'every envelope has expected kernels',
  );
  expectEqual(
    report.childEmissionEnvelopes.every(
      (envelope) =>
        envelope.freeEmissionStatus === 'intrinsic-birth-emission-only' &&
        envelope.channelResponseStatus ===
          'local-channels-available-not-always-on',
    ),
    true,
    'channels are responses rather than always-on emissions',
  );
  expectEqual(
    report.childEmissionEnvelopes.every((envelope) =>
      [
        ...envelope.parentReturnKernelRows,
        ...envelope.projectionLoopKernelRows,
        envelope.complementCouplingKernelRow,
      ].every(
        (row) =>
          row.activationStatus === 'available-response-not-free-emission',
      ),
    ),
    true,
    'all channel kernels are available responses',
  );
  expectEqual(
    report.childEmissionEnvelopes.every(
      (envelope) => envelope.intrinsicBirthEmission.amplitude > 0,
    ),
    true,
    'all birth amplitudes are positive',
  );
  expectEqual(
    report.childEmissionEnvelopes.every(
      (envelope) =>
        envelope.intrinsicBirthEmission.foldedFrequencyRatio.value >= 1 &&
        envelope.intrinsicBirthEmission.foldedFrequencyRatio.value < 2,
    ),
    true,
    'all folded ratios are in the unit octave',
  );
  expectEqual(
    report.childEmissionEnvelopes.every(
      (envelope) =>
        Number.isFinite(envelope.intrinsicBirthEmission.phaseRadians) &&
        envelope.intrinsicBirthEmission.phaseRadians >= 0 &&
        envelope.intrinsicBirthEmission.phaseRadians < Math.PI * 2,
    ),
    true,
    'all phases are normalized',
  );
  expectEqual(
    hasPackageScript(
      sources.packageSource,
      'diagnose:fano-octonionic-child-emission-envelope-v0',
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
  console.log('E1 FanoOctonionicChildEmissionEnvelopeV0 diagnostics');
  console.log('');
  console.log('envelope rows');

  for (const envelope of report.childEmissionEnvelopes) {
    console.log(
      `${formatLabel(envelope.envelopeId)}: profileSet ${envelope.profileSetId} | child ${envelope.childTokenId} ${formatLabel(envelope.childCanonicalLiftId)} ${envelope.childSignedLift} | parents ${envelope.parentSet.join('/')} | projected ${envelope.projectedSourceSet.join('/')} | complement ${envelope.complementTokenId}`,
    );
  }

  console.log('');
  console.log('intrinsic birth emissions');

  for (const envelope of report.childEmissionEnvelopes) {
    const emission = envelope.intrinsicBirthEmission;
    console.log(
      `${formatLabel(envelope.envelopeId)}: parents ${emission.parentSourceSlotsInCanonicalOrder.join('*')} | profiles ${emission.parentProfileIdsInCanonicalOrder.join(' + ')} | raw ${formatRatio(emission.rawFrequencyRatio)} | folded ${formatRatio(emission.foldedFrequencyRatio)} | folds ${emission.octaveFoldCount} | phase ${emission.phaseRadians} | attenuation ${emission.attenuation}`,
    );
  }

  console.log('');
  console.log('channel kernel counts by envelope');

  for (const envelope of report.childEmissionEnvelopes) {
    console.log(
      `${formatLabel(envelope.envelopeId)}: parentReturn ${envelope.parentReturnKernelRows.length} | projectionLoop ${envelope.projectionLoopKernelRows.length} | complementCoupling 1`,
    );
  }

  console.log('');
  console.log('summary');
}

function printCompactReport(report) {
  const summary = report.summary;

  console.log(`profileSetCount: ${summary.profileSetCount}`);
  console.log(
    `canonicalChildCarrierCount: ${summary.canonicalChildCarrierCount}`,
  );
  console.log(
    `childEmissionEnvelopeCount: ${summary.childEmissionEnvelopeCount}`,
  );
  console.log(
    `intrinsicBirthEmissionCount: ${summary.intrinsicBirthEmissionCount}`,
  );
  console.log(
    `parentReturnKernelRowCount: ${summary.parentReturnKernelRowCount}`,
  );
  console.log(
    `projectionLoopKernelRowCount: ${summary.projectionLoopKernelRowCount}`,
  );
  console.log(
    `complementCouplingKernelRowCount: ${summary.complementCouplingKernelRowCount}`,
  );
  console.log(
    `totalChannelKernelRowCount: ${summary.totalChannelKernelRowCount}`,
  );
  console.log(`birthLawStatus: ${summary.birthLawStatus}`);
  console.log(
    `frequencyNormalizationStatus: ${summary.frequencyNormalizationStatus}`,
  );
  console.log(`freeEmissionStatus: ${summary.freeEmissionStatus}`);
  console.log(`channelResponseStatus: ${summary.channelResponseStatus}`);
  console.log(
    `carrierPhaseProjectionStatus: ${summary.carrierPhaseProjectionStatus}`,
  );
  console.log(
    `carrierEmissionSeparationStatus: ${summary.carrierEmissionSeparationStatus}`,
  );
  console.log(`spatialProjectionStatus: ${summary.spatialProjectionStatus}`);
  console.log(`semanticLabelStatus: ${summary.semanticLabelStatus}`);
  console.log(
    `generationalFieldUpdateStatus: ${summary.generationalFieldUpdateStatus}`,
  );
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

function formatRatio(ratio) {
  return `${ratio.numerator}/${ratio.denominator} (${ratio.value})`;
}

function formatLabel(label) {
  return String(label).replace(/·/g, '*').replace(/Â·/g, '*');
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
