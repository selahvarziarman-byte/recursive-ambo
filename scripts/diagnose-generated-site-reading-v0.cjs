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
const diagnosticSourcePath = path.join(
  repoRoot,
  'src/lib/generatedSiteReadingV0.ts',
);
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const {
  buildGeneratedSiteReadingV0Report,
} = require(diagnosticSourcePath);
const { registeredOperations } = require(registryPath);

const EXPECTED_SITE_IDS = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const METHOD = 'generated-site-reading-v0-diagnostic';
const DIAGNOSTIC_SCOPE =
  'generated-site-reading-v0-one-ambo-tetrahedron-only';
const READING_POLICY_ID = 'generated-site-reading-v0-one-ambo-tetrahedron';
const PROVING_REGIME_ID = 'pythagorean-tetrachord-quark-regime-v0';
const SOURCE_PROFILE_SYSTEM_ID = 'pythagorean-tetrachord-primal-profile-system-v0';
const CHILD_INHERITANCE_GRAMMAR_ID =
  'tetrahedral-quark-log-wave-number-inheritance-v0';
const FIELD_CUE_CONSUMPTION_STATUS =
  'fieldcue-boundary-consumed-as-event-bound-evidence';
const EVENT_BOUND_PROTOTYPE_STATUS = 'one-ambo-tetrahedron-prototype-only';
const FIELD_LAYER_GENERALITY_STATUS = 'not-general-field-layer';
const GENERATED_SITE_READING_RUNTIME_STATUS =
  'diagnostic-library-consumption-only';
const GENERATED_SITE_READING_UI_STATUS = 'not-ui-work';
const GENERATED_SITE_READING_NAMING_STATUS = 'not-auto-naming';
const FIELD_LAYER_EVENT_SCOPE_STATUS =
  'one-ambo-tetrahedron-proving-event-only';
const RECOMMENDED_NEXT_GATE =
  'Gate D7 - GeneratedSiteReadingV0 FieldCue UI Boundary';
const REQUIRED_FIELDCUE_FORBIDDEN_INTERPRETATIONS = [
  'do-not-read-as-site-name',
  'do-not-read-as-final-site-meaning',
  'do-not-read-as-raw-field-proof',
  'do-not-read-as-semantic-truth',
  'do-not-generalize-beyond-one-ambo-tetrahedron',
];
const REQUIRED_CHILD_WARNINGS = [
  'raw-field-visibility-not-proven',
  'scalar-tuple-not-source-signature',
  'structural-witness-under-declared-basis',
  'not-semantic-naming',
];
const REQUIRED_RELATION_FORBIDDEN_INTERPRETATIONS = [
  'do-not-read-as-raw-field-proof',
  'do-not-read-as-semantic-name',
  'do-not-read-as-generated-site-final-meaning',
  'do-not-drop-misleading-risk',
];
const FORBIDDEN_MATURE_CLAIMS = [
  'confirmed gate',
  'confirmed route',
  'confirmed region',
  'confirmed loop',
  'confirmed vortex',
  'gate blocks',
  'route carries',
  'region governs',
  'vortex organizes',
  'phase corridor',
  'topology import',
];
const failures = [];

console.log('GeneratedSiteReadingV0 diagnostics');

const diagnosticSource = fs.readFileSync(diagnosticSourcePath, 'utf8');
const runnerSource = fs.readFileSync(__filename, 'utf8');
const registrySource = fs.readFileSync(registryPath, 'utf8');
const report = buildGeneratedSiteReadingV0Report();
const diagnosticSources = {
  diagnosticSource,
  runnerSource,
  registrySource,
};

runReportBoundaryDiagnostic(report);
runReadingCoverageDiagnostic(report);
runWitnessDiagnostic(report);
runFieldCueConsumptionDiagnostic(report);
runNamingAndBoundaryDiagnostic(report);
runMutationRegistryAndImportDiagnostic(report, diagnosticSources);
runMatureClaimDiagnostic(report);
runCoherenceDiagnostic(report);
printCompactSummary(report);

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

function runReportBoundaryDiagnostic(report) {
  expectEqual(report.method, METHOD, 'report method');
  expectEqual(report.diagnosticScope, DIAGNOSTIC_SCOPE, 'report scope');
  expectEqual(report.readingPolicyId, READING_POLICY_ID, 'reading policy');
  expectEqual(
    report.eventScopeStatus,
    'one-ambo-tetrahedron-proving-event',
    'event scope',
  );
  expectEqual(
    report.fieldLayerStatus,
    'event-bound-profile-aware-prototype',
    'field layer status',
  );
  expectEqual(
    report.generalityStatus,
    'not-general-reading-layer',
    'generality status',
  );
  expectEqual(report.portabilityStatus, 'untested', 'portability status');
  expectEqual(
    report.semanticStatus,
    'not-semantic-naming',
    'semantic status',
  );
  expectEqual(
    report.topologyStatus,
    'not-topology-workspace',
    'topology status',
  );
  expectEqual(
    report.packetWriteStatus,
    'not-packet-writing',
    'packet write status',
  );
  expectEqual(
    report.shapeMutationStatus,
    'not-shape-mutation',
    'shape mutation status',
  );
  expectEqual(
    report.namingStateStatus,
    'not-implemented',
    'naming state status',
  );
  expectEqual(
    report.humanNamingAuthorityStatus,
    'human-names',
    'human naming authority',
  );
  expectEqual(
    report.generatedSiteReadingV0FieldCueConsumptionStatus,
    FIELD_CUE_CONSUMPTION_STATUS,
    'GeneratedSiteReadingV0 FieldCue consumption status',
  );
  expectEqual(
    report.generatedSiteReadingV0RuntimeStatus,
    GENERATED_SITE_READING_RUNTIME_STATUS,
    'GeneratedSiteReadingV0 runtime status',
  );
  expectEqual(
    report.generatedSiteReadingV0UiStatus,
    GENERATED_SITE_READING_UI_STATUS,
    'GeneratedSiteReadingV0 UI status',
  );
  expectEqual(
    report.generatedSiteReadingV0NamingStatus,
    GENERATED_SITE_READING_NAMING_STATUS,
    'GeneratedSiteReadingV0 naming status',
  );
  expectEqual(
    report.generatedSiteReadingV0GeneralizationStatus,
    FIELD_LAYER_GENERALITY_STATUS,
    'GeneratedSiteReadingV0 generalization status',
  );
  expectEqual(
    report.fieldLayerEventScopeStatus,
    FIELD_LAYER_EVENT_SCOPE_STATUS,
    'field layer event scope status',
  );
  expectEqual(report.provingEventOperation, 'ambo-dissection', 'event operation');
  expectEqual(report.provingEventGenerationDepth, 1, 'event generation depth');
  expectEqual(
    report.recommendedNextGate,
    RECOMMENDED_NEXT_GATE,
    'recommended next gate',
  );

  console.log('report boundary: PASS');
}

function runReadingCoverageDiagnostic(report) {
  expectEqual(report.readingCount, 6, 'reading count');
  expectEqual(report.readings.length, 6, 'reading array count');

  const siteIds = report.readings.map((reading) => reading.siteId).sort();
  expectArrayEqual(siteIds, [...EXPECTED_SITE_IDS].sort(), 'reading site ids');

  console.log('reading coverage: PASS');
}

function runWitnessDiagnostic(report) {
  for (const reading of report.readings) {
    expectTruthy(
      reading.geometryWitness,
      `${reading.siteId} geometry witness exists`,
    );
    expectIncludes(
      ['available', 'unsupported', 'incomplete'],
      reading.geometryWitness.geometryWitnessStatus,
      `${reading.siteId} geometry witness status`,
    );
    expectTruthy(
      reading.fieldWitness,
      `${reading.siteId} field witness exists`,
    );
    expectTruthy(
      reading.fieldWitness.fieldCueId ||
        reading.fieldWitness.fieldCueStatus === 'unavailable',
      `${reading.siteId} field witness cue reference or unavailable status`,
    );
    expectEqual(
      reading.fieldWitness.sourceRegimeId,
      PROVING_REGIME_ID,
      `${reading.siteId} source regime id`,
    );
    expectEqual(
      reading.fieldWitness.sourceProfileSystemId,
      SOURCE_PROFILE_SYSTEM_ID,
      `${reading.siteId} source profile system id`,
    );
    expectEqual(
      reading.fieldWitness.childInheritanceGrammarId,
      CHILD_INHERITANCE_GRAMMAR_ID,
      `${reading.siteId} child inheritance grammar id`,
    );
    expectEqual(
      reading.fieldWitness.sourceSignatureStatus,
      'field-ready',
      `${reading.siteId} source signature status`,
    );
    expectEqual(
      reading.fieldWitness.fieldInheritanceStatus,
      'complete',
      `${reading.siteId} field inheritance status`,
    );
    expectEqual(
      reading.fieldWitness.baseWaveNumberCalibrationStatus,
      'human-specified-v0',
      `${reading.siteId} base wave-number calibration status`,
    );
    expectEqual(
      reading.fieldWitness.pairSumUniquenessStatus,
      'pass',
      `${reading.siteId} pair-sum uniqueness status`,
    );
    expectEqual(
      reading.fieldWitness.shellScalingApplication,
      'record-only-v0',
      `${reading.siteId} shell scaling application`,
    );
    expectIncludes(
      reading.fieldWitness.activeDifferentiatingAxes ?? [],
      'waveNumber',
      `${reading.siteId} active axes include waveNumber`,
    );
    expectIncludes(
      reading.fieldWitness.activeDifferentiatingAxes ?? [],
      'phase',
      `${reading.siteId} active axes include phase`,
    );
    expectIncludes(
      reading.fieldWitness.neutralAxes ?? [],
      'amplitude',
      `${reading.siteId} neutral axes include amplitude`,
    );
    expectIncludes(
      reading.fieldWitness.neutralAxes ?? [],
      'attenuation',
      `${reading.siteId} neutral axes include attenuation`,
    );
    expectEqual(
      typeof reading.fieldWitness.childLogRatio,
      'number',
      `${reading.siteId} child logRatio`,
    );
    expectEqual(
      typeof reading.fieldWitness.childRatio,
      'number',
      `${reading.siteId} child ratio`,
    );
    expectEqual(
      typeof reading.fieldWitness.childWavelength,
      'number',
      `${reading.siteId} child wavelength`,
    );
    expectTruthy(
      reading.atomicWitness,
      `${reading.siteId} birth-law witness exists`,
    );
    expectIncludes(
      [
        'event-bound-birth-law-available',
        'not-atomic-workspace',
        'unsupported',
      ],
      reading.atomicWitness.atomicWitnessStatus,
      `${reading.siteId} birth-law witness status`,
    );
  }

  console.log('witness sections: PASS');
}

function runFieldCueConsumptionDiagnostic(report) {
  const consumption = report.fieldCueConsumption;

  expectTruthy(consumption, 'FieldCue consumption section exists');
  expectEqual(
    consumption.sourceBoundaryMethod,
    'generated-site-reading-v0-fieldcue-boundary',
    'FieldCue source boundary method',
  );
  expectEqual(consumption.sourceBoundaryGate, 'Gate D5', 'FieldCue source gate');
  expectEqual(
    consumption.fieldCueConsumptionStatus,
    FIELD_CUE_CONSUMPTION_STATUS,
    'FieldCue consumption status',
  );
  expectEqual(
    consumption.eventBoundPrototypeStatus,
    EVENT_BOUND_PROTOTYPE_STATUS,
    'event-bound prototype status',
  );
  expectEqual(
    consumption.fieldLayerGeneralityStatus,
    FIELD_LAYER_GENERALITY_STATUS,
    'field layer generality status',
  );
  expectEqual(consumption.portabilityStatus, 'untested', 'portability status');
  expectEqual(
    consumption.generatedSiteReadingPromotionStatus,
    GENERATED_SITE_READING_RUNTIME_STATUS,
    'generated-site reading promotion status',
  );
  expectEqual(
    consumption.semanticNamingStatus,
    GENERATED_SITE_READING_NAMING_STATUS,
    'semantic naming status',
  );
  expectEqual(
    consumption.topologyStatus,
    'not-topology-workspace',
    'consumption topology status',
  );
  expectEqual(
    consumption.packetWriteStatus,
    'not-packet-writing',
    'consumption packet write status',
  );
  expectEqual(
    consumption.rawFieldWitnessStatus,
    'failed-insufficient-not-source-signature',
    'raw field witness status',
  );
  expectEqual(
    consumption.structuralWitnessStatus,
    'consumable-under-declared-basis-with-warning',
    'structural witness status',
  );
  expectEqual(
    consumption.reductionLawAdoptionStatus,
    'not-adopted',
    'reduction law adoption status',
  );
  expectEqual(
    consumption.fieldCueEvidenceRowCount,
    6,
    'FieldCue evidence row count',
  );
  expectEqual(
    consumption.fieldCueRelationEvidenceRowCount,
    3,
    'FieldCue relation evidence row count',
  );
  expectEqual(
    consumption.rawFieldVisibleClaimCount,
    0,
    'raw field visible claim count',
  );
  expectEqual(
    consumption.misleadingRiskRowCount,
    3,
    'misleading risk row count',
  );
  expectEqual(
    consumption.tupleLossWarningCount,
    6,
    'tuple loss warning count',
  );
  expectEqual(
    consumption.semanticNamingClaimCount,
    0,
    'semantic naming claim count',
  );

  const fieldCueEvidenceRows = report.readings.map(
    (reading) => reading.fieldCueEvidence,
  );
  expectEqual(
    fieldCueEvidenceRows.filter(Boolean).length,
    6,
    'each reading has FieldCue evidence',
  );
  expectEqual(
    fieldCueEvidenceRows.every(
      (evidence) =>
        evidence.fieldCueEvidenceStatus ===
          'available-as-bounded-fieldcue-evidence' &&
        evidence.generatedSiteUseEligibility ===
          'eligible-for-generated-site-reading-as-warning-bearing-evidence' &&
        evidence.eventBoundPrototypeStatus === EVENT_BOUND_PROTOTYPE_STATUS &&
        evidence.fieldLayerGeneralityStatus ===
          FIELD_LAYER_GENERALITY_STATUS &&
        evidence.fieldFeatureEvidenceScope ===
          'field-feature-relations-only-not-site-meaning' &&
        arraysEqual(evidence.requiredWarnings, REQUIRED_CHILD_WARNINGS) &&
        arraysEqual(
          evidence.forbiddenInterpretations,
          REQUIRED_FIELDCUE_FORBIDDEN_INTERPRETATIONS,
        ),
    ),
    true,
    'every FieldCue evidence section preserves warning-bearing D6 scope',
  );
  expectEqual(
    fieldCueEvidenceRows.every(
      (evidence) =>
        evidence.reductionHonesty.emittedTupleStatus ===
          'propagation-facing-reduction-only' &&
        evidence.reductionHonesty.sourceSignatureStatus ===
          'structured-source-state-not-scalar-tuple' &&
        evidence.reductionHonesty.tupleLossWarning === true,
    ),
    true,
    'every FieldCue evidence section preserves tuple loss warning',
  );

  const relationRows = report.readings.flatMap(
    (reading) => reading.fieldRelationEvidence.relationEvidenceRows,
  );
  const uniqueRelationIds = Array.from(
    new Set(relationRows.map((row) => row.relationId)),
  );
  expectEqual(uniqueRelationIds.length, 3, 'unique relation evidence row count');
  expectEqual(
    report.readings.every(
      (reading) =>
        reading.fieldRelationEvidence.fieldFeatureEvidenceScope ===
          'field-feature-relations-only-not-site-meaning' &&
        reading.fieldRelationEvidence.relationEvidenceRowCount > 0,
    ),
    true,
    'each reading has relation evidence for its paired child',
  );
  expectEqual(
    relationRows.some(
      (row) =>
        row.rawFieldCueStatus === 'raw-field-visible' ||
        row.relationVisibilityStatuses.includes('raw-field-visible'),
    ),
    false,
    'raw-field-visible is not claimed',
  );
  expectEqual(
    relationRows.every(
      (row) =>
        row.misleadingRisk === true &&
        row.relationVisibilityStatuses.includes(
          'misleading-if-read-as-raw-field',
        ) &&
        row.fieldCueWarning.includes('misleading-if-read-as-raw-field') &&
        row.generatedSiteReadingWarning.includes('warning-bearing FieldCue') &&
        arraysEqual(
          row.forbiddenInterpretations,
          REQUIRED_RELATION_FORBIDDEN_INTERPRETATIONS,
        ),
    ),
    true,
    'relation evidence preserves misleading-risk and forbidden interpretations',
  );

  console.log('FieldCue consumption: PASS');
}

function runNamingAndBoundaryDiagnostic(report) {
  for (const reading of report.readings) {
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
      reading.humanNamingAuthorityStatus,
      'human-names',
      `${reading.siteId} human naming authority`,
    );
    expectEqual(
      reading.humanNamingPrompt.namingPromptStatus,
      'question-only',
      `${reading.siteId} naming prompt status`,
    );
    expectAtLeast(
      countNamingQuestions(reading),
      1,
      `${reading.siteId} naming question count`,
    );
    expectNoForbiddenNameFields(reading, `${reading.siteId} reading`);
    expectNoForbiddenMeaningFields(reading, `${reading.siteId} reading`);
  }

  console.log('naming and boundary statuses: PASS');
}

function runMutationRegistryAndImportDiagnostic(report, sources) {
  expectEqual(report.shapeMutationDetected, false, 'shape mutation detected');
  expectEqual(report.packetWriteDetected, false, 'packet write detected');
  expectEqual(
    report.operationRegistryStatus,
    'not-operation-registry-work',
    'operation registry status',
  );
  expectEqual(
    registeredOperations.some((operation) =>
      /generated[-_ ]?site[-_ ]?reading|reading[-_ ]?v0/i.test(operation.id),
    ),
    false,
    'operation registry has no generated-site reading operation',
  );
  expectEqual(
    /generated[-_ ]?site[-_ ]?reading|GeneratedSiteReadingV0/i.test(
      sources.registrySource,
    ),
    false,
    'operation registry source has no GeneratedSiteReadingV0 contamination',
  );
  expectEqual(
    containsUiImport(sources.diagnosticSource) ||
      containsUiImport(sources.runnerSource) ||
      uiRuntimeModuleLoaded(),
    false,
    'no UI import or runtime UI load',
  );
  expectEqual(
    containsFieldAtlasImport(sources.diagnosticSource) ||
      containsFieldAtlasImport(sources.runnerSource),
    false,
    'no fieldAtlas import',
  );
  expectEqual(
    containsStoreImport(sources.diagnosticSource) ||
      containsStoreImport(sources.runnerSource),
    false,
    'no store import',
  );

  console.log('mutation/write/registry/import boundary: PASS');
}

function runMatureClaimDiagnostic(report) {
  const reportText = JSON.stringify(report).toLowerCase();

  for (const phrase of FORBIDDEN_MATURE_CLAIMS) {
    expectEqual(
      reportText.includes(phrase),
      false,
      `forbidden mature claim "${phrase}"`,
    );
  }

  expectEqual(
    containsForbiddenOwnKeyDeep(report, [
      'topologyMaturity',
      'confirmedGate',
      'confirmedRoute',
      'confirmedLoop',
      'confirmedVortex',
      'confirmedRegion',
      'finalSiteMeaning',
      'siteMeaning',
      'generatedSiteName',
      'semanticName',
    ]),
    false,
    'no mature topology/name/final-meaning fields',
  );

  console.log('mature claim boundary: PASS');
}

function runCoherenceDiagnostic(report) {
  expectEqual(report.issueCount, report.issues.length, 'issue count coherence');
  expectEqual(report.summary.issueCount, report.issueCount, 'summary issue count');
  expectEqual(report.summary.ok, report.ok, 'summary ok');
  expectEqual(report.summary.readingCount, report.readingCount, 'summary reading count');
  expectEqual(report.ok, report.issueCount === 0, 'ok coherence');
  expectEqual(
    report.diagnosticIntegrityStatus,
    report.issueCount === 0 ? 'pass' : 'fail',
    'diagnostic integrity coherence',
  );

  const usefulnessCounts = countBy(
    report.readings,
    (reading) => reading.readingUsefulness.readingUsefulnessStatus,
  );
  const ambiguityCounts = countBy(
    report.readings,
    (reading) => reading.ambiguityWitness.ambiguityStatus,
  );

  for (const [status, count] of Object.entries(usefulnessCounts)) {
    expectEqual(
      report.summary.readingsByUsefulnessStatus[status],
      count,
      `summary usefulness ${status}`,
    );
  }

  for (const [status, count] of Object.entries(ambiguityCounts)) {
    expectEqual(
      report.summary.readingsByAmbiguityStatus[status],
      count,
      `summary ambiguity ${status}`,
    );
  }

  console.log('report coherence: PASS');
}

function printCompactSummary(report) {
  console.log('');
  console.log('GeneratedSiteReadingV0 compact summary');
  console.log(`diagnosticIntegrityStatus: ${report.diagnosticIntegrityStatus}`);
  console.log(`reading count: ${report.readingCount}`);
  console.log(
    `fieldCueConsumptionStatus: ${report.fieldCueConsumption.fieldCueConsumptionStatus}`,
  );
  console.log(
    `fieldCue evidence row count: ${report.fieldCueConsumption.fieldCueEvidenceRowCount}`,
  );
  console.log(
    `field relation evidence row count: ${report.fieldCueConsumption.fieldCueRelationEvidenceRowCount}`,
  );
  console.log(
    `rawFieldVisibleClaimCount: ${report.fieldCueConsumption.rawFieldVisibleClaimCount}`,
  );
  console.log(
    `misleadingRiskRowCount: ${report.fieldCueConsumption.misleadingRiskRowCount}`,
  );
  console.log(
    `tupleLossWarningCount: ${report.fieldCueConsumption.tupleLossWarningCount}`,
  );
  console.log(
    `semanticNamingClaimCount: ${report.fieldCueConsumption.semanticNamingClaimCount}`,
  );
  console.log(
    `eventBoundPrototypeStatus: ${report.fieldCueConsumption.eventBoundPrototypeStatus}`,
  );
  console.log(
    `fieldLayerGeneralityStatus: ${report.fieldCueConsumption.fieldLayerGeneralityStatus}`,
  );
  console.log(
    `generatedSiteReadingV0RuntimeStatus: ${report.generatedSiteReadingV0RuntimeStatus}`,
  );
  console.log(
    `generatedSiteReadingV0NamingStatus: ${report.generatedSiteReadingV0NamingStatus}`,
  );
  console.log(`recommendedNextGate: ${report.recommendedNextGate}`);
  console.log(`issue count: ${report.issueCount}`);
}

function countNamingQuestions(reading) {
  return [
    reading.humanNamingPrompt.primaryNamingQuestion,
    ...reading.humanNamingPrompt.secondaryNamingQuestions,
  ].filter(Boolean).length;
}

function expectNoForbiddenNameFields(value, label) {
  for (const key of [
    'generatedSiteName',
    'siteName',
    'finalName',
    'conceptName',
    'semanticName',
  ]) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      failures.push(`${label}: forbidden name field ${key}`);
    }
  }
}

function expectNoForbiddenMeaningFields(value, label) {
  for (const key of [
    'finalSiteMeaning',
    'siteMeaning',
    'finalMeaning',
    'semanticMeaning',
  ]) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      failures.push(`${label}: forbidden final-meaning field ${key}`);
    }
  }
}

function containsForbiddenOwnKeyDeep(value, forbiddenKeys) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  for (const key of Object.keys(value)) {
    if (forbiddenKeys.includes(key)) {
      return true;
    }

    const nestedValue = value[key];

    if (Array.isArray(nestedValue)) {
      if (nestedValue.some((item) => containsForbiddenOwnKeyDeep(item, forbiddenKeys))) {
        return true;
      }
    } else if (containsForbiddenOwnKeyDeep(nestedValue, forbiddenKeys)) {
      return true;
    }
  }

  return false;
}

function containsUiImport(source) {
  return /from\s+['"][^'"]*(?:[/\\]components[/\\]|\.tsx|react)['"]|require\(\s*['"][^'"]*(?:[/\\]components[/\\]|\.tsx|react)['"]\s*\)/i.test(
    source,
  );
}

function containsFieldAtlasImport(source) {
  return /from\s+['"][^'"]*fieldAtlas(?:\.[cm]?[tj]s)?['"]|require\(\s*['"][^'"]*fieldAtlas(?:\.[cm]?[tj]s)?['"]\s*\)/i.test(
    source,
  );
}

function containsStoreImport(source) {
  return /from\s+['"][^'"]*(?:[/\\]store[/\\]|geometryStore)(?:\.[cm]?[tj]s)?['"]|require\(\s*['"][^'"]*(?:[/\\]store[/\\]|geometryStore)(?:\.[cm]?[tj]s)?['"]\s*\)/i.test(
    source,
  );
}

function uiRuntimeModuleLoaded() {
  return Object.keys(require.cache).some((modulePath) =>
    /src[\\/]components[\\/]|\.tsx$|node_modules[\\/]react[\\/]/i.test(
      modulePath,
    ),
  );
}

function countBy(values, getKey) {
  return values.reduce((counts, value) => {
    const key = getKey(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function arraysEqual(left, right) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
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

function expectIncludes(values, expected, label) {
  if (!values.includes(expected)) {
    failures.push(`${label}: expected ${formatValue(expected)} in ${formatValue(values)}`);
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
