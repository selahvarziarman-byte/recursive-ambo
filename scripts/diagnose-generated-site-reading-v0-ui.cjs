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
const uiBoundaryPath = path.join(
  repoRoot,
  'src/lib/generatedSiteReadingV0FieldCueUiBoundary.ts',
);
const readingSourcePath = path.join(
  repoRoot,
  'src/lib/generatedSiteReadingV0.ts',
);
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const packagePath = path.join(repoRoot, 'package.json');
const {
  buildGeneratedSiteReadingV0FieldCueUiBoundaryReport,
} = require(uiBoundaryPath);

const REQUIRED_SITE_WARNINGS = [
  'raw-field-visibility-not-proven',
  'scalar-tuple-not-source-signature',
  'structural-witness-under-declared-basis',
  'not-semantic-naming',
];
const REQUIRED_SITE_FORBIDDEN_INTERPRETATIONS = [
  'do-not-read-as-site-name',
  'do-not-read-as-final-site-meaning',
  'do-not-read-as-raw-field-proof',
  'do-not-read-as-semantic-truth',
  'do-not-generalize-beyond-one-ambo-tetrahedron',
];
const REQUIRED_RELATION_FORBIDDEN_INTERPRETATIONS = [
  'do-not-read-as-raw-field-proof',
  'do-not-read-as-semantic-name',
  'do-not-read-as-generated-site-final-meaning',
  'do-not-drop-misleading-risk',
];
const failures = [];

const uiBoundarySource = readRequiredFile(
  uiBoundaryPath,
  'GeneratedSiteReadingV0 FieldCue UI boundary library',
);
const readingSource = readRequiredFile(
  readingSourcePath,
  'GeneratedSiteReadingV0 source',
);
const registrySource = readRequiredFile(registryPath, 'operation registry');
const packageSource = readRequiredFile(packagePath, 'package.json');
const runnerSource = fs.readFileSync(__filename, 'utf8');
const report = buildGeneratedSiteReadingV0FieldCueUiBoundaryReport();

if (uiBoundarySource && readingSource && registrySource && packageSource) {
  runBoundaryReportDiagnostic(report);
  runSiteRowsDiagnostic(report);
  runRelationRowsDiagnostic(report);
  runSourceIsolationDiagnostic({
    uiBoundarySource,
    readingSource,
    registrySource,
    packageSource,
    runnerSource,
  });
}

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

function runBoundaryReportDiagnostic(report) {
  expectEqual(
    report.method,
    'generated-site-reading-v0-fieldcue-ui-boundary',
    'method',
  );
  expectEqual(report.parentGate, 'Gate D7', 'parent gate');
  expectEqual(report.sourceGate, 'Gate D6', 'source gate');
  expectEqual(
    report.diagnosticIntegrityStatus,
    'pass',
    'diagnostic integrity status',
  );
  expectEqual(
    report.uiBoundaryReadinessStatus,
    'generated-site-reading-fieldcue-ui-boundary-ready',
    'UI boundary readiness status',
  );
  expectEqual(
    report.generatedSiteUiBoundaryStatus,
    'fieldcue-evidence-ui-boundary-ready',
    'generated-site UI boundary status',
  );
  expectEqual(
    report.generatedSiteReadingV0UiStatus,
    'boundary-ready-not-rendered',
    'GeneratedSiteReadingV0 UI status',
  );
  expectEqual(
    report.generatedSiteReadingV0RenderStatus,
    'not-rendered-this-branch',
    'GeneratedSiteReadingV0 render status',
  );
  expectEqual(
    report.generatedSiteReadingV0RuntimeStatus,
    'diagnostic-library-consumption-only',
    'GeneratedSiteReadingV0 runtime status',
  );
  expectEqual(
    report.fieldCueConsumptionStatus,
    'fieldcue-boundary-consumed-as-event-bound-evidence',
    'FieldCue consumption status',
  );
  expectEqual(
    report.eventBoundPrototypeStatus,
    'one-ambo-tetrahedron-prototype-only',
    'event-bound prototype status',
  );
  expectEqual(
    report.fieldLayerGeneralityStatus,
    'not-general-field-layer',
    'field layer generality status',
  );
  expectEqual(
    report.fieldLayerEventScopeStatus,
    'one-ambo-tetrahedron-proving-event-only',
    'field layer event scope status',
  );
  expectEqual(
    report.fieldFeatureEvidenceScope,
    'field-feature-relations-only-not-site-meaning',
    'field feature evidence scope',
  );
  expectEqual(report.semanticNamingStatus, 'not-auto-naming', 'semantic naming');
  expectEqual(
    report.finalMeaningStatus,
    'not-final-site-meaning',
    'final meaning status',
  );
  expectEqual(report.topologyStatus, 'not-topology-workspace', 'topology');
  expectEqual(report.packetWriteStatus, 'not-packet-writing', 'packet writing');
  expectEqual(
    report.operationRegistryStatus,
    'not-operation-registry-work',
    'operation registry status',
  );
  expectEqual(
    report.rawFieldWitnessStatus,
    'failed-insufficient-not-source-signature',
    'raw field witness status',
  );
  expectEqual(
    report.structuralWitnessStatus,
    'consumable-under-declared-basis-with-warning',
    'structural witness status',
  );
  expectEqual(
    report.reductionLawAdoptionStatus,
    'not-adopted',
    'reduction law adoption status',
  );
  expectEqual(
    report.recommendedNextGate,
    'Gate D8 - GeneratedSiteReadingV0 FieldCue Display Adapter',
    'recommended next gate',
  );

  const summary = report.generatedSiteUiBoundarySummary;

  expectEqual(summary.generatedSiteUiRowCount, 6, 'generated-site UI row count');
  expectEqual(summary.uniqueRelationUiRowCount, 3, 'unique relation UI row count');
  expectEqual(
    summary.siteRelationEvidenceRowCount,
    6,
    'site relation evidence row count',
  );
  expectEqual(
    summary.rawFieldVisibleClaimCount,
    0,
    'raw field visible claim count',
  );
  expectEqual(
    summary.misleadingRiskRelationCount,
    3,
    'misleading risk relation count',
  );
  expectEqual(summary.tupleLossWarningCount, 6, 'tuple loss warning count');
  expectEqual(
    summary.semanticNamingClaimCount,
    0,
    'semantic naming claim count',
  );
  expectEqual(summary.finalMeaningClaimCount, 0, 'final meaning claim count');
  expectEqual(
    summary.generalizedFieldLayerClaimCount,
    0,
    'generalized field layer claim count',
  );
  expectEqual(
    summary.eventBoundPrototypeRowCount,
    6,
    'event-bound prototype row count',
  );
  expectEqual(
    summary.notGeneralFieldLayerRowCount,
    6,
    'not-general field layer row count',
  );
  expectEqual(summary.renderAuthorized, false, 'render authorized');
  expectEqual(summary.uiBoundaryReady, true, 'UI boundary ready');
  expectEqual(report.issueCount, 0, 'issue count');
  expectEqual(report.ok, true, 'ok');
}

function runSiteRowsDiagnostic(report) {
  expectEqual(report.generatedSiteUiRows.length, 6, 'site UI rows length');
  expectEqual(
    report.generatedSiteUiRows.every(
      (row) =>
        row.eventBoundPrototypeStatus ===
          'one-ambo-tetrahedron-prototype-only',
    ),
    true,
    'every site row has event-bound prototype status',
  );
  expectEqual(
    report.generatedSiteUiRows.every(
      (row) => row.fieldLayerGeneralityStatus === 'not-general-field-layer',
    ),
    true,
    'every site row has not-general-field-layer status',
  );
  expectEqual(
    report.generatedSiteUiRows.every(
      (row) =>
        row.fieldFeatureEvidenceScope ===
        'field-feature-relations-only-not-site-meaning',
    ),
    true,
    'every site row has field-feature evidence scope',
  );
  expectEqual(
    report.generatedSiteUiRows.every(
      (row) =>
        row.displayEligibility ===
          'diagnostic-display-only-not-generated-site-meaning' &&
        row.humanWarningText.includes('event-bound prototype FieldCue evidence') &&
        row.humanWarningText.includes('not site meaning'),
    ),
    true,
    'every site row preserves display eligibility and human warning',
  );
  expectEqual(
    report.generatedSiteUiRows.every((row) =>
      arraysEqual(row.requiredWarnings, REQUIRED_SITE_WARNINGS),
    ),
    true,
    'every site row has required warnings',
  );
  expectEqual(
    report.generatedSiteUiRows.every((row) =>
      arraysEqual(
        row.forbiddenInterpretations,
        REQUIRED_SITE_FORBIDDEN_INTERPRETATIONS,
      ),
    ),
    true,
    'every site row forbids site name, final meaning, raw-field proof, semantic truth, and generalization',
  );
  expectEqual(
    report.generatedSiteUiRows.every(
      (row) =>
        row.propagationDisplay.warningText ===
          'Raw field visibility is not proven.' &&
        row.structuralDisplay.warningText ===
          'Structural witness is under declared basis and is not semantic naming.' &&
        row.reductionDisplay.warningText ===
          'The emitted tuple is not the full source signature.' &&
        row.reductionDisplay.tupleLossWarning === true,
    ),
    true,
    'every site row carries propagation, structural, and tuple warnings',
  );
  expectEqual(
    report.generatedSiteUiRows.every((row) => row.uiWarningLevel === 'warning'),
    true,
    'every site row with misleading relation evidence has warning level',
  );
}

function runRelationRowsDiagnostic(report) {
  expectEqual(
    report.generatedSiteRelationUiRows.length,
    3,
    'relation UI rows length',
  );
  expectEqual(
    report.generatedSiteRelationUiRows.some(
      (row) =>
        row.rawFieldCueStatus === 'raw-field-visible' ||
        row.relationVisibilityStatuses.includes('raw-field-visible'),
    ),
    false,
    'raw-field-visible is not claimed',
  );
  expectEqual(
    report.generatedSiteRelationUiRows.every(
      (row) =>
        row.misleadingRisk === true &&
        row.uiWarningLevel === 'warning' &&
        row.relationVisibilityStatuses.includes(
          'misleading-if-read-as-raw-field',
        ) &&
        row.fieldCueWarning.includes('misleading-if-read-as-raw-field') &&
        row.warningText.includes('raw field proof') &&
        row.warningText.includes('semantic name') &&
        row.warningText.includes('final generated-site meaning') &&
        row.displayEligibility ===
          'diagnostic-display-only-not-generated-site-meaning' &&
        row.fieldFeatureEvidenceScope ===
          'field-feature-relations-only-not-site-meaning',
    ),
    true,
    'every relation row preserves misleading-risk warning and display boundary',
  );
  expectEqual(
    report.generatedSiteRelationUiRows.every((row) =>
      arraysEqual(
        row.forbiddenInterpretations,
        REQUIRED_RELATION_FORBIDDEN_INTERPRETATIONS,
      ),
    ),
    true,
    'every relation row forbids raw-field proof, semantic name, final meaning, and dropping misleading risk',
  );
}

function runSourceIsolationDiagnostic(sources) {
  expectEqual(
    hasPackageScript(
      sources.packageSource,
      'diagnose:generated-site-reading-v0-ui',
    ),
    true,
    'diagnose:generated-site-reading-v0-ui package script exists',
  );
  expectEqual(
    /buildGeneratedSiteReadingV0Report/.test(sources.uiBoundarySource),
    true,
    'UI boundary consumes GeneratedSiteReadingV0 report',
  );
  expectEqual(
    containsForbiddenSourceImport(sources.uiBoundarySource) ||
      containsForbiddenSourceImport(sources.runnerSource),
    false,
    'UI boundary and runner avoid forbidden source imports',
  );
  expectEqual(
    containsReactUiImport(sources.uiBoundarySource) ||
      containsReactUiImport(sources.runnerSource),
    false,
    'no React UI component import',
  );
  expectEqual(
    createsReactComponent(sources.uiBoundarySource),
    false,
    'no React component is created',
  );
  expectEqual(uiRuntimeModuleLoaded(), false, 'no runtime UI module is loaded');
  expectEqual(
    containsFieldAtlasImport(sources.uiBoundarySource) ||
      containsFieldAtlasImport(sources.runnerSource),
    false,
    'no fieldAtlas import',
  );
  expectEqual(
    containsStoreImport(sources.uiBoundarySource) ||
      containsStoreImport(sources.runnerSource),
    false,
    'no store import',
  );
  expectEqual(
    /generated[-_ ]?site[-_ ]?reading|fieldcue[-_ ]?ui[-_ ]?boundary/i.test(
      sources.registrySource,
    ),
    false,
    'no operation registry contamination',
  );
  expectEqual(
    /from\s+['"][^'"]*fieldCueV0|require\(\s*['"][^'"]*fieldCueV0|structuredSourceState|fieldAtlas|geometryStore|operations[\\/]registry/i.test(
      sources.uiBoundarySource,
    ),
    false,
    'UI boundary does not consume FieldCueV0, C.4L-D3, fieldAtlas, store, or registry',
  );
}

function printCompactReport(report) {
  const summary = report.generatedSiteUiBoundarySummary;

  console.log('GeneratedSiteReadingV0 FieldCue UI boundary diagnostics');
  console.log(`diagnosticIntegrityStatus: ${report.diagnosticIntegrityStatus}`);
  console.log(`uiBoundaryReadinessStatus: ${report.uiBoundaryReadinessStatus}`);
  console.log(
    `generatedSiteUiBoundaryStatus: ${report.generatedSiteUiBoundaryStatus}`,
  );
  console.log(
    `generatedSiteReadingV0UiStatus: ${report.generatedSiteReadingV0UiStatus}`,
  );
  console.log(
    `generatedSiteReadingV0RenderStatus: ${report.generatedSiteReadingV0RenderStatus}`,
  );
  console.log(`generatedSiteUiRowCount: ${summary.generatedSiteUiRowCount}`);
  console.log(`uniqueRelationUiRowCount: ${summary.uniqueRelationUiRowCount}`);
  console.log(
    `siteRelationEvidenceRowCount: ${summary.siteRelationEvidenceRowCount}`,
  );
  console.log(`rawFieldVisibleClaimCount: ${summary.rawFieldVisibleClaimCount}`);
  console.log(
    `misleadingRiskRelationCount: ${summary.misleadingRiskRelationCount}`,
  );
  console.log(`tupleLossWarningCount: ${summary.tupleLossWarningCount}`);
  console.log(`semanticNamingClaimCount: ${summary.semanticNamingClaimCount}`);
  console.log(`finalMeaningClaimCount: ${summary.finalMeaningClaimCount}`);
  console.log(
    `generalizedFieldLayerClaimCount: ${summary.generalizedFieldLayerClaimCount}`,
  );
  console.log(`eventBoundPrototypeStatus: ${report.eventBoundPrototypeStatus}`);
  console.log(`fieldLayerGeneralityStatus: ${report.fieldLayerGeneralityStatus}`);
  console.log(`renderAuthorized: ${summary.renderAuthorized}`);
  console.log(`recommendedNextGate: ${report.recommendedNextGate}`);
  console.log(`issue count: ${report.issueCount}`);
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

function containsForbiddenSourceImport(source) {
  return /from\s+['"][^'"]*(?:structuredSourceState|fieldCueV0|generatedSiteReadingV0FieldCueBoundary)|require\(\s*['"][^'"]*(?:structuredSourceState|fieldCueV0|generatedSiteReadingV0FieldCueBoundary)/i.test(
    source,
  );
}

function containsReactUiImport(source) {
  return /from\s+['"][^'"]*(?:[/\\]components[/\\]|\.tsx|react)['"]|require\(\s*['"][^'"]*(?:[/\\]components[/\\]|\.tsx|react)['"]\s*\)/i.test(
    source,
  );
}

function createsReactComponent(source) {
  return /React\.createElement|jsxDEV|_jsx\(|return\s*\(\s*<[A-Z][A-Za-z0-9]*/.test(
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

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}
