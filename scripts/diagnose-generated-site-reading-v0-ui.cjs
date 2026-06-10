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
const displayAdapterPath = path.join(
  repoRoot,
  'src/lib/generatedSiteReadingV0FieldCueDisplayAdapter.ts',
);
const displayComponentPath = path.join(
  repoRoot,
  'src/components/GeneratedSiteReadingV0FieldCueDisplay.tsx',
);
const generatedPanelPath = path.join(
  repoRoot,
  'src/components/GeneratedSiteReadingV0Panel.tsx',
);
const inspectorPath = path.join(repoRoot, 'src/components/FieldAtlasInspector.tsx');
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const packagePath = path.join(repoRoot, 'package.json');
const {
  buildGeneratedSiteReadingV0FieldCueUiBoundaryReport,
} = require(uiBoundaryPath);
const {
  buildGeneratedSiteReadingV0FieldCueDisplayAdapterReport,
} = require(displayAdapterPath);

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
const displayAdapterSource = readRequiredFile(
  displayAdapterPath,
  'GeneratedSiteReadingV0 FieldCue display adapter library',
);
const displayComponentSource = readRequiredFile(
  displayComponentPath,
  'GeneratedSiteReadingV0 FieldCue display component',
);
const generatedPanelSource = readRequiredFile(
  generatedPanelPath,
  'GeneratedSiteReadingV0Panel component',
);
const inspectorSource = readRequiredFile(
  inspectorPath,
  'FieldAtlasInspector component',
);
const registrySource = readRequiredFile(registryPath, 'operation registry');
const packageSource = readRequiredFile(packagePath, 'package.json');
const runnerSource = fs.readFileSync(__filename, 'utf8');
const uiBoundaryReport = buildGeneratedSiteReadingV0FieldCueUiBoundaryReport();
const displayAdapterReport =
  buildGeneratedSiteReadingV0FieldCueDisplayAdapterReport();

if (
  uiBoundarySource &&
  displayAdapterSource &&
  displayComponentSource &&
  generatedPanelSource &&
  inspectorSource &&
  registrySource &&
  packageSource
) {
  runD7BoundaryDiagnostic(uiBoundaryReport);
  runD8DisplayAdapterDiagnostic(displayAdapterReport);
  runD8DisplayPayloadDiagnostic(displayAdapterReport);
  runSourceIsolationDiagnostic({
    uiBoundarySource,
    displayAdapterSource,
    displayComponentSource,
    generatedPanelSource,
    inspectorSource,
    registrySource,
    packageSource,
    runnerSource,
  });
}

printCompactReport(uiBoundaryReport, displayAdapterReport);

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

function runD7BoundaryDiagnostic(report) {
  expectEqual(
    report.diagnosticIntegrityStatus,
    'pass',
    'D7 diagnostic integrity status',
  );
  expectEqual(
    report.uiBoundaryReadinessStatus,
    'generated-site-reading-fieldcue-ui-boundary-ready',
    'D7 UI boundary readiness status',
  );
  expectEqual(
    report.generatedSiteUiBoundaryStatus,
    'fieldcue-evidence-ui-boundary-ready',
    'D7 generated-site UI boundary status',
  );
  expectEqual(
    report.generatedSiteReadingV0UiStatus,
    'boundary-ready-not-rendered',
    'D7 GeneratedSiteReadingV0 UI status',
  );
  expectEqual(
    report.generatedSiteReadingV0RenderStatus,
    'boundary-consumed-by-mounted-display',
    'D7 GeneratedSiteReadingV0 render status',
  );
  expectEqual(
    report.generatedSiteUiBoundarySummary.generatedSiteUiRowCount,
    6,
    'D7 generated-site UI row count',
  );
  expectEqual(
    report.generatedSiteUiBoundarySummary.uniqueRelationUiRowCount,
    3,
    'D7 unique relation UI row count',
  );
  expectEqual(
    report.generatedSiteUiBoundarySummary.renderAuthorized,
    false,
    'D7 render authorization',
  );
}

function runD8DisplayAdapterDiagnostic(report) {
  expectEqual(
    report.method,
    'generated-site-reading-v0-fieldcue-display-adapter',
    'D8 method',
  );
  expectEqual(report.parentGate, 'Gate D8', 'D8 parent gate');
  expectEqual(report.sourceGate, 'Gate D7', 'D8 source gate');
  expectEqual(
    report.sourceBoundaryStatus,
    'fieldcue-evidence-ui-boundary-consumed',
    'D8 source boundary status',
  );
  expectEqual(
    report.displayAdapterStatus,
    'mounted-display-adapter-ready',
    'display adapter status',
  );
  expectEqual(
    report.displayMountStatus,
    'mounted-in-generated-site-reading-panel',
    'display mount status',
  );
  expectEqual(
    report.legacyGeneratedSiteUiStatus,
    'legacy-generated-site-ui-quarantined-not-authoritative',
    'legacy GeneratedSiteReadingV0 UI status',
  );
  expectEqual(
    report.generatedSiteReadingV0RenderStatus,
    'mounted-in-generated-site-reading-panel',
    'GeneratedSiteReadingV0 render status',
  );
  expectEqual(
    report.generatedSiteReadingV0RuntimeStatus,
    'diagnostic-library-display-mounted',
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
    report.diagnosticIntegrityStatus,
    'pass',
    'D8 diagnostic integrity status',
  );
  expectEqual(
    report.displayAdapterReadinessStatus,
    'generated-site-reading-fieldcue-display-adapter-ready',
    'D8 display adapter readiness status',
  );
  expectEqual(
    report.recommendedNextGate,
    'Gate D10 - GeneratedSiteReadingV0 FieldCue Mount Review',
    'D8 recommended next gate',
  );
  expectEqual(report.issueCount, 0, 'D8 issue count');
  expectEqual(report.ok, true, 'D8 ok');
}

function runD8DisplayPayloadDiagnostic(report) {
  expectEqual(
    report.headerModel.title,
    'GeneratedSiteReadingV0 FieldCue Evidence',
    'header title',
  );
  expectEqual(
    report.headerModel.subtitle.includes('Event-bound prototype evidence only') &&
      report.headerModel.subtitle.includes('not generated-site meaning'),
    true,
    'header subtitle states event-bound evidence only and not meaning',
  );
  for (const badge of [
    'one-Ambo tetrahedron only',
    'not general field layer',
    'raw field insufficient',
    'structural witness under declared basis',
    'not semantic naming',
  ]) {
    expectEqual(
      report.headerModel.statusBadges.includes(badge),
      true,
      `header badge ${badge}`,
    );
  }

  const summary = report.displaySummary;

  expectEqual(summary.siteDisplayRowCount, 6, 'site display row count');
  expectEqual(summary.relationDisplayRowCount, 3, 'relation display row count');
  expectEqual(
    summary.siteRelationEvidenceRowCount,
    6,
    'site relation evidence row count',
  );
  expectEqual(summary.rawFieldVisibleClaimCount, 0, 'raw field visible claim count');
  expectEqual(
    summary.misleadingRiskRelationCount,
    3,
    'misleading risk relation count',
  );
  expectEqual(summary.tupleLossWarningCount, 6, 'tuple loss warning count');
  expectEqual(summary.semanticNamingClaimCount, 0, 'semantic naming claim count');
  expectEqual(summary.finalMeaningClaimCount, 0, 'final meaning claim count');
  expectEqual(
    summary.generalizedFieldLayerClaimCount,
    0,
    'generalized field layer claim count',
  );
  expectEqual(summary.eventBoundPrototypeRowCount, 6, 'event-bound row count');
  expectEqual(summary.notGeneralFieldLayerRowCount, 6, 'not-general row count');
  expectEqual(summary.mountedInApp, true, 'mounted in app');
  expectEqual(
    summary.legacyGeneratedSiteUiAuthoritative,
    false,
    'legacy GeneratedSiteReadingV0 UI authoritative',
  );
  expectEqual(summary.displayAdapterReady, true, 'display adapter ready');

  expectEqual(report.siteDisplayRows.length, 6, 'site display rows length');
  expectEqual(
    report.siteDisplayRows.every(
      (row) =>
        row.displayWarningText ===
          'This is event-bound FieldCue evidence, not site meaning.' &&
        row.eventBoundPrototypeStatus ===
          'one-ambo-tetrahedron-prototype-only' &&
        row.fieldLayerGeneralityStatus === 'not-general-field-layer' &&
        row.fieldFeatureEvidenceScope ===
          'field-feature-relations-only-not-site-meaning' &&
        row.reductionDisplay.tupleLossWarning === true &&
        arraysEqual(row.requiredWarnings, REQUIRED_SITE_WARNINGS) &&
        arraysEqual(
          row.forbiddenInterpretations,
          REQUIRED_SITE_FORBIDDEN_INTERPRETATIONS,
        ),
    ),
    true,
    'site display rows preserve warnings and boundaries',
  );

  expectEqual(
    report.relationDisplayRows.length,
    3,
    'relation display rows length',
  );
  expectEqual(
    report.relationDisplayRows.some(
      (row) =>
        row.rawFieldCueStatus === 'raw-field-visible' ||
        row.relationVisibilityStatuses.includes('raw-field-visible'),
    ),
    false,
    'no raw-field-visible claim',
  );
  expectEqual(
    report.relationDisplayRows.every(
      (row) =>
        row.misleadingRisk === true &&
        row.displayWarningText ===
          'Do not read this relation as raw field proof, semantic name, or final generated-site meaning.' &&
        row.warningText.includes('raw field proof') &&
        row.warningText.includes('semantic name') &&
        row.warningText.includes('final generated-site meaning') &&
        arraysEqual(
          row.forbiddenInterpretations,
          REQUIRED_RELATION_FORBIDDEN_INTERPRETATIONS,
        ),
    ),
    true,
    'relation display rows preserve misleading-risk and forbidden interpretations',
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
    /buildGeneratedSiteReadingV0FieldCueUiBoundaryReport/.test(
      sources.displayAdapterSource,
    ),
    true,
    'display adapter consumes D7 UI boundary',
  );
  expectEqual(
    containsAdapterForbiddenImport(sources.displayAdapterSource),
    false,
    'display adapter avoids forbidden imports',
  );
  expectEqual(
    containsReactUiImport(sources.displayAdapterSource),
    false,
    'display adapter lib does not import React UI components',
  );
  expectEqual(
    /buildGeneratedSiteReadingV0FieldCueDisplayAdapterReport|buildGeneratedSiteReadingV0FieldCueUiBoundaryReport|buildGeneratedSiteReadingV0Report|buildFieldCueV0Report/.test(
      sources.displayComponentSource,
    ),
    false,
    'display component does not import builders',
  );
  expectEqual(
    containsGeneratedSiteReadingV0ProperImport(sources.displayComponentSource),
    false,
    'display component does not import GeneratedSiteReadingV0 proper',
  );
  expectEqual(
    containsFieldCueV0Import(sources.displayComponentSource),
    false,
    'display component does not import FieldCueV0',
  );
  expectEqual(
    containsFieldAtlasImport(sources.displayComponentSource) ||
      containsFieldAtlasImport(sources.displayAdapterSource) ||
      containsFieldAtlasImport(sources.runnerSource),
    false,
    'no fieldAtlas import',
  );
  expectEqual(
    containsStoreImport(sources.displayComponentSource) ||
      containsStoreImport(sources.displayAdapterSource) ||
      containsStoreImport(sources.runnerSource),
    false,
    'no store import',
  );
  expectEqual(
    containsOperationRegistryImport(sources.displayComponentSource) ||
      containsOperationRegistryImport(sources.displayAdapterSource),
    false,
    'display files do not import operation registry',
  );
  expectEqual(uiRuntimeModuleLoaded(), false, 'no runtime UI module is loaded');
  expectEqual(
    importsDisplayComponent(sources.generatedPanelSource),
    true,
    'GeneratedSiteReadingV0Panel imports GeneratedSiteReadingV0FieldCueDisplay',
  );
  expectEqual(
    /buildGeneratedSiteReadingV0FieldCueDisplayAdapterReport/.test(
      sources.generatedPanelSource,
    ),
    true,
    'GeneratedSiteReadingV0Panel imports or uses display adapter builder',
  );
  expectEqual(
    isDisplayMounted(sources.generatedPanelSource),
    true,
    'GeneratedSiteReadingV0Panel renders GeneratedSiteReadingV0FieldCueDisplay',
  );
  expectEqual(
    isDisplayMounted(sources.inspectorSource) ||
      importsDisplayComponent(sources.inspectorSource),
    false,
    'FieldAtlasInspector does not import or mount display component directly',
  );
  expectEqual(
    /<GeneratedSiteReadingV0Panel\s+shape=\{shape\}\s*\/>/.test(
      sources.inspectorSource,
    ),
    true,
    'FieldAtlasInspector still renders GeneratedSiteReadingV0Panel as before',
  );
  expectEqual(
    sources.generatedPanelSource.includes(
      'Legacy GeneratedSiteReadingV0 diagnostic details',
    ) &&
      sources.generatedPanelSource.includes('not authoritative') &&
      /<details[\s\S]*?<summary[\s\S]*?Legacy GeneratedSiteReadingV0 diagnostic details[\s\S]*?not authoritative[\s\S]*?<\/summary>/.test(
        sources.generatedPanelSource,
      ),
    true,
    'legacy GeneratedSiteReadingV0 panel content is quarantined',
  );
  expectEqual(
    /generated-site-reading-v0-fieldcue-display|GeneratedSiteReadingV0FieldCueDisplay/i.test(
      sources.registrySource,
    ),
    false,
    'no operation registry contamination',
  );
  for (const phrase of [
    'one-Ambo tetrahedron only',
    'not general field layer',
    'raw field visibility is not proven',
    'emitted tuple is not full source signature',
    'structural witness is under declared basis',
    'not site meaning',
    'No auto-name',
  ]) {
    expectEqual(
      sources.displayComponentSource.includes(phrase),
      true,
      `display component visibly shows "${phrase}"`,
    );
  }
  for (const forbiddenPattern of [
    /(?<!not )final site meaning/i,
    /(?<!not )semantic naming/i,
    /confirmed gates?|confirmed routes?|confirmed loops?|confirmed vortices|confirmed regions?/i,
    /topology maturity/i,
  ]) {
    expectEqual(
      forbiddenPattern.test(sources.displayComponentSource),
      false,
      `display component avoids forbidden positive language ${forbiddenPattern}`,
    );
  }
}

function printCompactReport(uiBoundaryReport, displayAdapterReport) {
  const boundarySummary = uiBoundaryReport.generatedSiteUiBoundarySummary;
  const displaySummary = displayAdapterReport.displaySummary;

  console.log('GeneratedSiteReadingV0 FieldCue UI diagnostics');
  console.log(
    `diagnosticIntegrityStatus: ${uiBoundaryReport.diagnosticIntegrityStatus}`,
  );
  console.log(
    `uiBoundaryReadinessStatus: ${uiBoundaryReport.uiBoundaryReadinessStatus}`,
  );
  console.log(
    `generatedSiteUiBoundaryStatus: ${uiBoundaryReport.generatedSiteUiBoundaryStatus}`,
  );
  console.log(
    `generatedSiteReadingV0UiStatus: ${uiBoundaryReport.generatedSiteReadingV0UiStatus}`,
  );
  console.log(
    `displayAdapterStatus: ${displayAdapterReport.displayAdapterStatus}`,
  );
  console.log(`displayMountStatus: ${displayAdapterReport.displayMountStatus}`);
  console.log(
    `legacyGeneratedSiteUiStatus: ${displayAdapterReport.legacyGeneratedSiteUiStatus}`,
  );
  console.log(
    `generatedSiteReadingV0RenderStatus: ${displayAdapterReport.generatedSiteReadingV0RenderStatus}`,
  );
  console.log(`siteDisplayRowCount: ${displaySummary.siteDisplayRowCount}`);
  console.log(
    `relationDisplayRowCount: ${displaySummary.relationDisplayRowCount}`,
  );
  console.log(`rawFieldVisibleClaimCount: ${displaySummary.rawFieldVisibleClaimCount}`);
  console.log(
    `misleadingRiskRelationCount: ${displaySummary.misleadingRiskRelationCount}`,
  );
  console.log(`tupleLossWarningCount: ${displaySummary.tupleLossWarningCount}`);
  console.log(
    `semanticNamingClaimCount: ${displaySummary.semanticNamingClaimCount}`,
  );
  console.log(
    `finalMeaningClaimCount: ${displaySummary.finalMeaningClaimCount}`,
  );
  console.log(
    `generalizedFieldLayerClaimCount: ${displaySummary.generalizedFieldLayerClaimCount}`,
  );
  console.log(`mountedInApp: ${displaySummary.mountedInApp}`);
  console.log(
    `recommendedNextGate: ${displayAdapterReport.recommendedNextGate}`,
  );
  console.log(`issue count: ${displayAdapterReport.issueCount}`);
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

function containsAdapterForbiddenImport(source) {
  return /from\s+['"][^'"]*(?:generatedSiteReadingV0['"]|generatedSiteReadingV0\.|fieldCueV0|generatedSiteReadingV0FieldCueBoundary|structuredSourceState|fieldAtlas|geometryStore|operations[\\/]registry|components[\\/])|require\(\s*['"][^'"]*(?:generatedSiteReadingV0['"]|generatedSiteReadingV0\.|fieldCueV0|generatedSiteReadingV0FieldCueBoundary|structuredSourceState|fieldAtlas|geometryStore|operations[\\/]registry|components[\\/])/i.test(
    source,
  );
}

function containsReactUiImport(source) {
  return /from\s+['"][^'"]*(?:[/\\]components[/\\]|\.tsx|react)['"]|require\(\s*['"][^'"]*(?:[/\\]components[/\\]|\.tsx|react)['"]\s*\)/i.test(
    source,
  );
}

function containsGeneratedSiteReadingV0ProperImport(source) {
  return /from\s+['"][^'"]*generatedSiteReadingV0(?:\.[cm]?[tj]sx?)?['"]|require\(\s*['"][^'"]*generatedSiteReadingV0(?:\.[cm]?[tj]sx?)?['"]\s*\)/i.test(
    source,
  );
}

function containsFieldCueV0Import(source) {
  return /from\s+['"][^'"]*fieldCueV0(?:\.[cm]?[tj]sx?)?['"]|require\(\s*['"][^'"]*fieldCueV0(?:\.[cm]?[tj]sx?)?['"]\s*\)/i.test(
    source,
  );
}

function containsFieldAtlasImport(source) {
  return /from\s+['"][^'"]*fieldAtlas(?:\.[cm]?[tj]s)?['"]|require\(\s*['"][^'"]*fieldAtlas(?:\.[cm]?[tj]s)?['"]\s*\)/i.test(
    source,
  );
}

function containsStoreImport(source) {
  return /from\s+['"][^'"]*(?:[/\\]store[/\\]|geometryStore)(?:\.[cm]?[tj]sx?)?['"]|require\(\s*['"][^'"]*(?:[/\\]store[/\\]|geometryStore)(?:\.[cm]?[tj]sx?)?['"]\s*\)/i.test(
    source,
  );
}

function containsOperationRegistryImport(source) {
  return /from\s+['"][^'"]*operations[/\\]registry(?:\.[cm]?[tj]s)?['"]|require\(\s*['"][^'"]*operations[/\\]registry(?:\.[cm]?[tj]s)?['"]\s*\)/i.test(
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

function isDisplayMounted(source) {
  return /<GeneratedSiteReadingV0FieldCueDisplay[\s>]/.test(source);
}

function importsDisplayComponent(source) {
  return /from\s+['"][^'"]*GeneratedSiteReadingV0FieldCueDisplay['"]/.test(
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
