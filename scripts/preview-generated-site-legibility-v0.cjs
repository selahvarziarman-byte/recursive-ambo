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
  buildSourceSignatureContractAuditV0ComparisonReport,
} = require(path.join(repoRoot, 'src/lib/sourceSignatureContractAuditV0.ts'));
const {
  buildFieldCueV0Report,
} = require(path.join(repoRoot, 'src/lib/fieldCueV0.ts'));
const {
  buildGeneratedSiteReadingV0Report,
} = require(path.join(repoRoot, 'src/lib/generatedSiteReadingV0.ts'));
const { registeredOperations } = require(path.join(
  repoRoot,
  'src/operations/registry.ts',
));

const EXPECTED_READING_COUNT = 6;
const EXPECTED_SITE_IDS = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const EXPECTED_PROVING_REGIME_ID =
  'pythagorean-tetrachord-quark-regime-v0';
const EXPECTED_SHELL_SCALING_APPLICATION = 'record-only-v0';
const OLD_UNIFORM_WAVE_NUMBER = Math.PI;
const failures = [];

const comparisonReport = buildSourceSignatureContractAuditV0ComparisonReport();
const fieldCueReport = buildFieldCueV0Report();
const readingReport = buildGeneratedSiteReadingV0Report();
const cueBySiteId = new Map(
  fieldCueReport.cues.map((cue) => [cue.siteId, cue]),
);

validateReports();

if (failures.length) {
  console.error('Generated site legibility preview validation failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log(buildPreviewLines().join('\n'));
}

function buildPreviewLines() {
  const sourceProvenance = fieldCueReport.sourceSignatureProvenance;
  const calibration = sourceProvenance.baseWaveNumberCalibration;
  const shell = sourceProvenance.eventShellProvenance;
  const lines = [
    'Generated Site Legibility Preview V0',
    `Gate 1 source-signature proving: ${comparisonReport.gate1SourceSignatureProvingStatus}`,
    `Gate 2 downstream source integration: ${comparisonReport.gate2DownstreamSourceIntegrationStatus}`,
    `source regime id: ${sourceProvenance.provingRegimeId}`,
    `source profile system id: ${sourceProvenance.sourceProfileSystemId}`,
    `child inheritance grammar id: ${sourceProvenance.childInheritanceGrammarId}`,
    `source policy id: ${sourceProvenance.sourcePolicyId}`,
    'calibration:',
    `  wavelength-edge ratio: 1/8 (${formatNumber(
      calibration.wavelengthToEdgeRatio,
    )})`,
    `  reference wavelength: ${formatNumber(calibration.referenceWavelength)}`,
    `  baseWaveNumber: ${formatNumber(calibration.baseWaveNumber)}`,
    'shell:',
    `  parent shell ratio: ${formatNumber(shell.parentShellRatio)}`,
    `  child shell ratio: ${formatNumber(shell.childShellRatio)}`,
    `  circumradius contraction: ${formatNumber(
      shell.circumradiusContraction,
    )}`,
    `  shell scaling application: ${shell.shellScalingApplication}`,
  ];

  for (const reading of readingReport.readings) {
    const cue = cueBySiteId.get(reading.siteId);

    lines.push('', ...buildSiteLines(reading, cue));
  }

  lines.push('', ...buildSummaryTableLines(), '', ...buildLegibilityStatusLines());

  return lines;
}

function buildSiteLines(reading, cue) {
  const geometry = reading.geometryWitness;
  const field = reading.fieldWitness;
  const naming = reading.humanNamingPrompt;
  const counts = field.fieldCandidateReferenceCounts;
  const provenance = cue?.sourceSignatureProvenance;
  const emissionTuple = cue?.emittedSourceSignature.emissionTuple;
  const channels = cue?.inheritanceAxis.quarkChannelSummaries ?? [];
  const forbiddenConclusions = [
    ...naming.forbiddenConclusions,
    'Human names remain human-authored.',
  ];

  return [
    `== ${reading.siteId}`,
    `site: source edge ${geometry.sourceEdgeId ?? 'n/a'} | complement edge ${
      geometry.complementEdgeId ?? 'n/a'
    } | antipode ${geometry.antipodalChildSiteId ?? 'n/a'} | source-signature ${
      field.sourceSignatureStatus ?? 'n/a'
    } | field participation ${
      field.fieldParticipationStatus ?? 'n/a'
    } | reading usefulness ${
      reading.readingUsefulness.readingUsefulnessStatus
    } | ambiguity ${reading.ambiguityWitness.ambiguityStatus}`,
    'Source inheritance:',
    `  harmonic slots: ${formatHarmonicSlots(
      provenance?.assignedHarmonicSlots,
    )}`,
    `  child logRatio: ${formatNumber(
      provenance?.childLogRatio,
    )} | ratio: ${formatNumber(
      provenance?.childRatio,
    )} | waveNumber: ${formatNumber(
      provenance?.childWaveNumber,
    )} | wavelength: ${formatNumber(
      provenance?.childWavelength,
    )} | emitted phase: ${formatNumber(emissionTuple?.phase)}`,
    `  neutral axes: ${formatList(provenance?.neutralAxes, 'none')}`,
    `  active axes: ${formatList(
      provenance?.activeDifferentiatingAxes,
      'none',
    )}`,
    `  shell scaling: ${
      provenance?.eventShellProvenance.shellScalingApplication ?? 'n/a'
    }`,
    field.sourceSignatureStatus === 'field-ready'
      ? '  Source signature is field-ready under Pythagorean proving regime.'
      : '  Source signature is not field-ready.',
    'Quark provenance:',
    `  channel pairs: ${formatList(
      channels.map((channel) => `${channel.parent60}/${channel.projection30}`),
      'none',
    )}`,
    ...channels.map((channel) => `  - ${formatChannel(channel)}`),
    'Field-world:',
    `  participation: ${field.fieldParticipationStatus ?? 'n/a'}`,
    `  pressure: ${field.fieldPressureSummary ?? 'n/a'}`,
    `  candidate refs: feature ${counts.feature} | route/gate ${
      counts.routeGate
    } | support/region ${counts.supportRegion}`,
    `  warning statuses: ${formatList(field.fieldWarningStatuses, 'none')}`,
    '  Field-world evidence remains candidate-only/sensitive/saturated where applicable; this is not mature topology.',
    'Naming:',
    `  primary: ${naming.primaryNamingQuestion}`,
    `  secondary: ${formatList(
      naming.secondaryNamingQuestions.slice(0, 2),
      'none',
    )}`,
    `  forbidden conclusions: ${formatList(forbiddenConclusions, 'none')}`,
  ];
}

function buildSummaryTableLines() {
  const lines = [
    'Compact summary table:',
    'site | source edge | ratio | waveNumber | wavelength | phase | source ready | field participation | reading usefulness',
  ];

  for (const reading of readingReport.readings) {
    const cue = cueBySiteId.get(reading.siteId);
    const provenance = cue?.sourceSignatureProvenance;
    const emissionTuple = cue?.emittedSourceSignature.emissionTuple;

    lines.push(
      [
        reading.siteId,
        reading.geometryWitness.sourceEdgeId ?? 'n/a',
        formatNumber(provenance?.childRatio),
        formatNumber(provenance?.childWaveNumber),
        formatNumber(provenance?.childWavelength),
        formatNumber(emissionTuple?.phase),
        reading.fieldWitness.sourceSignatureStatus ?? 'n/a',
        reading.fieldWitness.fieldParticipationStatus ?? 'n/a',
        reading.readingUsefulness.readingUsefulnessStatus,
      ].join(' | '),
    );
  }

  return lines;
}

function buildLegibilityStatusLines() {
  const sourceInheritanceLegibilityStatus = getSourceInheritanceLegibilityStatus();
  const fieldWorldLegibilityStatus = getFieldWorldLegibilityStatus();
  const namingPressureLegibilityStatus = getNamingPressureLegibilityStatus();
  const overallGeneratedSiteLegibilityPreviewStatus =
    sourceInheritanceLegibilityStatus === 'pass' &&
    fieldWorldLegibilityStatus === 'honest'
      ? 'pass'
      : 'fail';

  return [
    'Legibility statuses:',
    `sourceInheritanceLegibilityStatus: ${sourceInheritanceLegibilityStatus}`,
    `fieldWorldLegibilityStatus: ${fieldWorldLegibilityStatus}`,
    `namingPressureLegibilityStatus: ${namingPressureLegibilityStatus}`,
    `overallGeneratedSiteLegibilityPreviewStatus: ${overallGeneratedSiteLegibilityPreviewStatus}`,
  ];
}

function validateReports() {
  expectEqual(
    comparisonReport.gate1SourceSignatureProvingStatus,
    'pass',
    'Gate 1 source-signature proving',
  );
  expectEqual(
    comparisonReport.gate2DownstreamSourceIntegrationStatus,
    'pass',
    'Gate 2 downstream source integration',
  );
  expectEqual(readingReport.readingCount, EXPECTED_READING_COUNT, 'reading count');
  expectEqual(
    readingReport.readings.length,
    EXPECTED_READING_COUNT,
    'reading array count',
  );
  expectArrayEqual(
    readingReport.readings.map((reading) => reading.siteId).sort(),
    [...EXPECTED_SITE_IDS].sort(),
    'reading site ids',
  );
  assertRegistryHasNoLegibilityOperation();

  for (const reading of readingReport.readings) {
    validateReading(reading);
  }
}

function validateReading(reading) {
  const cue = cueBySiteId.get(reading.siteId);
  const field = reading.fieldWitness;

  expectTruthy(cue, `${reading.siteId} cue exists`);
  expectEqual(
    field.sourceSignatureStatus,
    'field-ready',
    `${reading.siteId} source signature status`,
  );
  expectFiniteNumber(field.childRatio, `${reading.siteId} field child ratio`);
  expectFiniteNumber(
    field.childWavelength,
    `${reading.siteId} field child wavelength`,
  );
  expectEqual(
    field.shellScalingApplication,
    EXPECTED_SHELL_SCALING_APPLICATION,
    `${reading.siteId} reading shell scaling`,
  );
  expectEqual(
    reading.semanticStatus,
    'not-semantic-naming',
    `${reading.siteId} semantic status`,
  );
  expectEqual(
    reading.topologyStatus,
    'not-topology-workspace',
    `${reading.siteId} topology status`,
  );
  expectEqual(
    reading.packetWriteStatus,
    'not-packet-writing',
    `${reading.siteId} packet write status`,
  );
  expectEqual(
    reading.shapeMutationStatus,
    'not-shape-mutation',
    `${reading.siteId} shape mutation status`,
  );
  expectEqual(
    reading.namingStateStatus,
    'not-implemented',
    `${reading.siteId} naming state status`,
  );
  expectEqual(
    reading.humanNamingPrompt.namingPromptStatus,
    'question-only',
    `${reading.siteId} naming prompt status`,
  );
  expectTruthy(
    reading.humanNamingPrompt.primaryNamingQuestion,
    `${reading.siteId} primary naming question`,
  );
  expectAtLeast(
    reading.humanNamingPrompt.forbiddenConclusions.length,
    1,
    `${reading.siteId} forbidden conclusions`,
  );

  if (!cue) {
    return;
  }

  const provenance = cue.sourceSignatureProvenance;
  const emissionTuple = cue.emittedSourceSignature.emissionTuple;

  expectEqual(
    provenance.provingRegimeId,
    EXPECTED_PROVING_REGIME_ID,
    `${reading.siteId} Pythagorean provenance`,
  );
  expectFiniteNumber(
    provenance.childRatio,
    `${reading.siteId} provenance child ratio`,
  );
  expectFiniteNumber(
    provenance.childWavelength,
    `${reading.siteId} provenance child wavelength`,
  );
  expectEqual(
    provenance.eventShellProvenance.shellScalingApplication,
    EXPECTED_SHELL_SCALING_APPLICATION,
    `${reading.siteId} provenance shell scaling`,
  );
  expectEqual(
    cue.inheritanceAxis.shellScalingApplication,
    EXPECTED_SHELL_SCALING_APPLICATION,
    `${reading.siteId} inheritance shell scaling`,
  );
  expectEqual(
    cue.sourceSignatureProvenance.childWaveNumberShellScalingApplied,
    false,
    `${reading.siteId} wave number shell scaling applied`,
  );
  expectEqual(
    cue.sourceSignatureProvenance.childAttenuationShellScalingApplied,
    false,
    `${reading.siteId} attenuation shell scaling applied`,
  );
  expectAtLeast(
    cue.inheritanceAxis.quarkChannelSummaries.length,
    4,
    `${reading.siteId} quark channels`,
  );
  expectTruthy(
    cue.sourceSignatureProvenance.assignedHarmonicSlots.length,
    `${reading.siteId} assigned harmonic slots`,
  );
  expectFiniteNumber(
    emissionTuple?.waveNumber,
    `${reading.siteId} emitted waveNumber`,
  );

  if (isAlmostEqual(emissionTuple?.waveNumber, OLD_UNIFORM_WAVE_NUMBER)) {
    failures.push(`${reading.siteId} emitted waveNumber still equals Math.PI`);
  }
}

function getSourceInheritanceLegibilityStatus() {
  return readingReport.readings.every((reading) => {
    const cue = cueBySiteId.get(reading.siteId);

    return (
      reading.fieldWitness.sourceSignatureStatus === 'field-ready' &&
      Number.isFinite(reading.fieldWitness.childRatio) &&
      Number.isFinite(reading.fieldWitness.childWavelength) &&
      cue?.sourceSignatureProvenance.provingRegimeId ===
        EXPECTED_PROVING_REGIME_ID &&
      Number.isFinite(cue.sourceSignatureProvenance.childRatio) &&
      Number.isFinite(cue.sourceSignatureProvenance.childWavelength)
    );
  })
    ? 'pass'
    : 'fail';
}

function getFieldWorldLegibilityStatus() {
  return readingReport.readings.every(
    (reading) =>
      reading.semanticStatus === 'not-semantic-naming' &&
      reading.topologyStatus === 'not-topology-workspace' &&
      reading.packetWriteStatus === 'not-packet-writing' &&
      reading.fieldWitness.fieldWitnessCaveats.some((caveat) =>
        caveat.toLowerCase().includes('candidate-only'),
      ),
  )
    ? 'honest'
    : 'weak';
}

function getNamingPressureLegibilityStatus() {
  return readingReport.readings.every(
    (reading) =>
      Boolean(reading.humanNamingPrompt.primaryNamingQuestion) &&
      reading.humanNamingPrompt.forbiddenConclusions.length > 0,
  )
    ? 'usable'
    : 'weak';
}

function assertRegistryHasNoLegibilityOperation() {
  const forbiddenOperationPattern =
    /generated[-_ ]?site[-_ ]?legibility|legibility[-_ ]?preview/i;

  for (const operation of registeredOperations) {
    const searchableText = [
      operation.id,
      operation.name,
      operation.label,
      operation.description,
    ]
      .filter(Boolean)
      .join(' ');

    if (forbiddenOperationPattern.test(searchableText)) {
      failures.push(`operation registry contains preview operation: ${operation.id}`);
    }
  }
}

function formatChannel(channel) {
  return [
    `parent/projection ${channel.parent60}/${channel.projection30}`,
    `parent ratio ${channel.parentRatioLabel ?? 'n/a'}`,
    `projection ratio ${channel.projectionRatioLabel ?? 'n/a'}`,
    `logRatio ${formatNumber(channel.channelLogRatio)}`,
    `ratio ${formatNumber(channel.channelRatio)}`,
    `wavelength ${formatNumber(channel.channelWavelength)}`,
    `phase ${formatNumber(channel.channelParameters.phase)}`,
  ].join(' | ');
}

function formatHarmonicSlots(slots) {
  return slots && slots.length
    ? slots
        .map((slot) => `${slot.vertexId} -> ${slot.ratioLabel}`)
        .join(', ')
    : 'none';
}

function formatList(values, emptyLabel = 'n/a') {
  return values && values.length ? values.join(', ') : emptyLabel;
}

function formatNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Number.parseFloat(value.toFixed(6)).toString()
    : 'n/a';
}

function isAlmostEqual(left, right) {
  return (
    typeof left === 'number' &&
    Number.isFinite(left) &&
    Math.abs(left - right) < 1e-9
  );
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`);
  }
}

function expectTruthy(value, label) {
  if (!value) {
    failures.push(`${label}: expected truthy value, got ${formatValue(value)}`);
  }
}

function expectAtLeast(actual, expectedMinimum, label) {
  if (actual < expectedMinimum) {
    failures.push(
      `${label}: expected at least ${expectedMinimum}, got ${formatValue(actual)}`,
    );
  }
}

function expectFiniteNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    failures.push(`${label}: expected finite number, got ${formatValue(value)}`);
  }
}

function expectArrayEqual(actual, expected, label) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  if (actualJson !== expectedJson) {
    failures.push(`${label}: expected ${expectedJson}, got ${actualJson}`);
  }
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}
