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
const tablePath = path.join(repoRoot, 'src/lib/harmonicEmissionProfilesV0.ts');
const packagePath = path.join(repoRoot, 'package.json');
const { buildHarmonicEmissionProfilesV0Report } = require(tablePath);

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
  'RANDOM_PROFILE',
  'FREE_TUNING',
  'SEMANTIC_LABEL_PROFILE',
  'CHILD_EMISSION_ENVELOPE',
];

const failures = [];
const report = buildHarmonicEmissionProfilesV0Report();
const tableSource = readRequiredFile(
  tablePath,
  'harmonic emission profiles source',
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
  expectEqual(report.method, 'harmonic-emission-profiles-v0', 'method');
  expectEqual(
    report.c0DependencyStatus,
    'profile-slots-aligned-to-c0-primal-carriers',
    'C0 dependency status',
  );
  expectEqual(report.summary.method, 'harmonic-emission-profiles-v0', 'summary method');
  expectEqual(report.summary.profileFamilyCount, 3, 'profile family count');
  expectEqual(report.summary.profileSetCount, 3, 'profile set count');
  expectEqual(report.summary.profileRowCount, 12, 'profile row count');
  expectEqual(
    report.summary.primalProfileAttachmentRowCount,
    12,
    'primal profile attachment row count',
  );
  expectEqual(
    report.summary.c0PrimalCarrierCount,
    4,
    'C0 primal carrier count',
  );
  expectEqual(
    report.summary.sourceSlotCountPerSet,
    4,
    'source slot count per set',
  );
  expectEqual(
    report.summary.finiteLibraryStatus,
    'finite-curated-profile-library',
    'finite library status',
  );
  expectEqual(
    report.summary.arbitraryTuningStatus,
    'no-per-run-free-tuning',
    'arbitrary tuning status',
  );
  expectEqual(
    report.summary.carrierEmissionSeparationStatus,
    'carrier-and-emission-separated',
    'carrier emission separation status',
  );
  expectEqual(
    report.summary.spatialProjectionStatus,
    'oscillator-profile-defined-spatial-projection-deferred',
    'spatial projection status',
  );
  expectEqual(
    report.summary.semanticLabelStatus,
    'not-attached-placeholders-only',
    'semantic label status',
  );
  expectEqual(
    report.summary.childEmissionEnvelopeStatus,
    'not-computed-in-e0',
    'child emission envelope status',
  );
  expectEqual(
    report.summary.spinorBridgeStatus,
    'not-in-e0-carrier-bridge-preserved-upstream',
    'spinor bridge status',
  );
  expectEqual(report.summary.uiStatus, 'no-ui', 'UI status');
  expectEqual(
    report.summary.recommendedNextGate,
    'E1 - Fano-Octonionic Child Emission Envelope Table',
    'recommended next gate',
  );
  expectEqual(
    report.profileSetRows.every((row) => hasExactlySourceSlots(row.sourceSlots)),
    true,
    'every profile set has exactly A/B/C/D',
  );
  expectEqual(
    report.profileRows.every((row) => row.amplitude > 0),
    true,
    'every profile has positive amplitude',
  );
  expectEqual(
    report.profileRows.every((row) => row.frequencyRatio.value > 0),
    true,
    'every profile has positive frequency ratio',
  );
  expectEqual(
    report.profileRows.every((row) => Number.isFinite(row.phaseRadians)),
    true,
    'every profile has finite phase',
  );
  expectEqual(
    report.profileRows.every((row) => row.attenuation >= 0),
    true,
    'every profile has non-negative attenuation',
  );
  expectEqual(
    report.profileRows.every(
      (row) =>
        row.sourceSlotStatus ===
        'placeholder-source-slot-not-semantic-label',
    ),
    true,
    'source slots remain placeholders',
  );
  expectEqual(
    report.profileRows.every(
      (row) =>
        row.spatialProjectionStatus ===
        'not-projected-to-spatial-field-in-e0',
    ),
    true,
    'spatial projection remains deferred',
  );
  expectEqual(
    report.primalProfileAttachmentRows.every(
      (row) =>
        row.carrierEmissionSeparationStatus ===
          'carrier-read-from-c0-profile-read-from-e0' &&
        row.attachmentStatus === 'attachable-not-mutating-c0-source',
    ),
    true,
    'attachments separate carrier and emission',
  );
  expectEqual(
    hasPackageScript(
      sources.packageSource,
      'diagnose:harmonic-emission-profiles-v0',
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
  console.log('E0 HarmonicEmissionProfilesV0 diagnostics');
  console.log('');
  console.log('profile families');

  for (const row of report.profileFamilies) {
    console.log(`${row.profileFamilyId}: ${row.purpose}`);
  }

  console.log('');
  console.log('profile rows');

  for (const row of report.profileRows) {
    console.log(
      `${row.profileId}: slot ${row.sourceSlotId} | ratio ${row.frequencyRatio.numerator}/${row.frequencyRatio.denominator} (${row.frequencyRatio.value}) | amplitude ${row.amplitude} | phase ${row.phaseRadians} | attenuation ${row.attenuation}`,
    );
  }

  console.log('');
  console.log('profile set rows');

  for (const row of report.profileSetRows) {
    console.log(
      `${row.profileSetId}: ${row.sourceSlots.join('/')} | ${row.profileIds.join(', ')}`,
    );
  }

  console.log('');
  console.log('primal profile attachment rows');

  for (const row of report.primalProfileAttachmentRows) {
    console.log(
      `${row.profileSetId}/${row.sourceSlotId}: carrier ${row.c0CarrierUnit} | profile ${row.profileId} | ${row.carrierEmissionSeparationStatus}`,
    );
  }

  console.log('');
  console.log('summary');
}

function printCompactReport(report) {
  const summary = report.summary;

  console.log(`profileFamilyCount: ${summary.profileFamilyCount}`);
  console.log(`profileSetCount: ${summary.profileSetCount}`);
  console.log(`profileRowCount: ${summary.profileRowCount}`);
  console.log(
    `primalProfileAttachmentRowCount: ${summary.primalProfileAttachmentRowCount}`,
  );
  console.log(`c0PrimalCarrierCount: ${summary.c0PrimalCarrierCount}`);
  console.log(`sourceSlotCountPerSet: ${summary.sourceSlotCountPerSet}`);
  console.log(`finiteLibraryStatus: ${summary.finiteLibraryStatus}`);
  console.log(`arbitraryTuningStatus: ${summary.arbitraryTuningStatus}`);
  console.log(
    `carrierEmissionSeparationStatus: ${summary.carrierEmissionSeparationStatus}`,
  );
  console.log(`spatialProjectionStatus: ${summary.spatialProjectionStatus}`);
  console.log(`semanticLabelStatus: ${summary.semanticLabelStatus}`);
  console.log(
    `childEmissionEnvelopeStatus: ${summary.childEmissionEnvelopeStatus}`,
  );
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

function hasExactlySourceSlots(sourceSlots) {
  return (
    sourceSlots.length === 4 &&
    ['A', 'B', 'C', 'D'].every((sourceSlotId) =>
      sourceSlots.includes(sourceSlotId),
    )
  );
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
