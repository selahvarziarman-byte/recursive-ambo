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
const boundarySourcePath = path.join(
  repoRoot,
  'src/lib/generatedSiteReadingV0FieldCueBoundary.ts',
);
const packagePath = path.join(repoRoot, 'package.json');
const {
  buildGeneratedSiteReadingV0FieldCueBoundaryReport,
} = require(boundarySourcePath);

const SCRIPT_NAME = 'diagnose:generated-site-reading-v0-fieldcue-boundary';
const SCRIPT_COMMAND =
  'node scripts/diagnose-generated-site-reading-v0-fieldcue-boundary.cjs';
const REQUIRED_CHILD_WARNINGS = [
  'raw-field-visibility-not-proven',
  'scalar-tuple-not-source-signature',
  'structural-witness-under-declared-basis',
  'not-semantic-naming',
];
const REQUIRED_FORBIDDEN_INTERPRETATIONS = [
  'do-not-read-as-raw-field-proof',
  'do-not-read-as-semantic-name',
  'do-not-read-as-generated-site-final-meaning',
  'do-not-drop-misleading-risk',
];

const failures = [];
const boundarySource = readRequiredFile(
  boundarySourcePath,
  'GeneratedSiteReadingV0 FieldCue boundary source',
);
const runnerSource = readRequiredFile(
  __filename,
  'GeneratedSiteReadingV0 FieldCue boundary diagnostic runner',
);
const packageSource = readRequiredFile(packagePath, 'package.json');
const report = buildGeneratedSiteReadingV0FieldCueBoundaryReport();

if (boundarySource && runnerSource && packageSource) {
  runAssertions(report, {
    boundarySource,
    runnerSource,
    packageSource,
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
  console.log('Diagnostic assertions passed.');
}

function runAssertions(report, sources) {
  expectEqual(report.ok, true, 'report ok means diagnostic integrity only');
  expectEqual(
    report.diagnosticIntegrityStatus,
    'pass',
    'diagnostic integrity status',
  );
  expectEqual(
    report.boundaryReadinessStatus,
    'generated-site-reading-fieldcue-boundary-ready',
    'boundary readiness status',
  );
  expectEqual(
    report.method,
    'generated-site-reading-v0-fieldcue-boundary',
    'method',
  );
  expectEqual(report.parentGate, 'Gate D5', 'parent gate');
  expectEqual(report.sourceGate, 'Gate D4', 'source gate');
  expectEqual(
    report.fieldCueSourceStatus,
    'fieldcue-v0-report-consumed',
    'FieldCue report consumed',
  );
  expectEqual(
    report.displayBoundaryStatus,
    'mounted-fieldcue-display-consumed-as-boundary-status',
    'mounted display boundary consumed',
  );
  expectEqual(
    report.acceptedSourceStateRegimeId,
    'multi-projection-source-state-v0',
    'accepted source-state regime',
  );
  expectEqual(
    report.generatedSiteReadingV0Status,
    'blocked',
    'GeneratedSiteReadingV0 status',
  );
  expectEqual(
    report.generatedSiteReadingConsumptionStatus,
    'boundary-ready-not-consumed',
    'GeneratedSiteReadingV0 consumption status',
  );
  expectEqual(
    report.generatedSiteReadingRuntimeStatus,
    'not-promoted',
    'GeneratedSiteReadingV0 runtime status',
  );
  expectEqual(
    report.semanticNamingStatus,
    'not-auto-naming',
    'semantic naming status',
  );
  expectEqual(report.topologyStatus, 'not-topology-workspace', 'topology status');
  expectEqual(report.packetWriteStatus, 'not-packet-writing', 'packet write status');
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
    report.legacyUiStatus,
    'legacy-ui-quarantined-not-authoritative',
    'legacy UI status',
  );

  expectEqual(
    report.generatedSiteFieldCueRows.length,
    6,
    'generated site FieldCue row count',
  );
  expectEqual(
    report.generatedSiteRelationEvidenceRows.length,
    3,
    'generated site relation evidence row count',
  );
  expectEqual(
    report.generatedSiteBoundarySummary.childEvidenceRowCount,
    6,
    'summary child evidence row count',
  );
  expectEqual(
    report.generatedSiteBoundarySummary.relationEvidenceRowCount,
    3,
    'summary relation evidence row count',
  );
  expectEqual(
    report.generatedSiteBoundarySummary.rawFieldVisibleClaimCount,
    0,
    'raw field visible claim count',
  );
  expectEqual(
    report.generatedSiteBoundarySummary.misleadingRiskRowCount,
    3,
    'misleading risk row count',
  );
  expectEqual(
    report.generatedSiteBoundarySummary.tupleLossWarningCount,
    6,
    'tuple loss warning count',
  );
  expectEqual(
    report.generatedSiteBoundarySummary.semanticNamingClaimCount,
    0,
    'semantic naming claim count',
  );
  expectEqual(
    report.generatedSiteBoundarySummary.generatedSiteReadingBlocked,
    true,
    'GeneratedSiteReadingV0 remains blocked',
  );
  expectEqual(
    report.generatedSiteBoundarySummary.generatedSiteConsumptionAuthorized,
    false,
    'GeneratedSiteReadingV0 consumption is not authorized',
  );
  expectEqual(
    report.generatedSiteBoundarySummary.boundaryReady,
    true,
    'boundary ready only after integrity checks pass',
  );

  expectEqual(
    report.generatedSiteFieldCueRows.every((row) =>
      arraysEqual(row.requiredWarnings, REQUIRED_CHILD_WARNINGS),
    ),
    true,
    'every child row has the required warnings',
  );
  expectEqual(
    report.generatedSiteFieldCueRows.every(
      (row) =>
        row.fieldCueEvidenceStatus ===
          'available-as-bounded-fieldcue-evidence' &&
        row.generatedSiteUseEligibility ===
          'eligible-for-later-generated-site-reading-adapter' &&
        row.reductionHonesty.emittedTupleStatus ===
          'propagation-facing-reduction-only' &&
        row.reductionHonesty.sourceSignatureStatus ===
          'structured-source-state-not-scalar-tuple' &&
        row.reductionHonesty.tupleLossWarning === true,
    ),
    true,
    'child rows preserve bounded FieldCue evidence and tuple warning',
  );
  expectEqual(
    report.generatedSiteRelationEvidenceRows.every((row) =>
      arraysEqual(row.forbiddenInterpretations, REQUIRED_FORBIDDEN_INTERPRETATIONS),
    ),
    true,
    'every relation row has forbidden interpretations',
  );
  expectEqual(
    report.generatedSiteRelationEvidenceRows.every(
      (row) =>
        row.relationUseEligibility ===
          'eligible-as-warning-bearing-structural-fieldcue-evidence' &&
        row.misleadingRisk === true &&
        row.relationVisibilityStatuses.includes(
          'misleading-if-read-as-raw-field',
        ) &&
        row.fieldCueWarning.includes('misleading-if-read-as-raw-field') &&
        row.generatedSiteReadingWarning.includes('warning-bearing FieldCue'),
    ),
    true,
    'relation rows preserve warning-bearing structural FieldCue evidence',
  );
  expectEqual(
    report.generatedSiteRelationEvidenceRows.some(
      (row) =>
        row.rawFieldCueStatus === 'raw-field-visible' ||
        row.relationVisibilityStatuses.includes('raw-field-visible'),
    ),
    false,
    'raw-field-visible is not claimed',
  );

  expectEqual(
    report.nextStepRecommendation.recommendedNextGate,
    'Gate D6 - GeneratedSiteReadingV0 FieldCue Consumption Adapter',
    'next step recommendation gate',
  );
  expectEqual(
    report.nextStepRecommendation
      .d6MayIntegrateBoundaryIntoGeneratedSiteReadingV0,
    true,
    'D6 may integrate boundary into GeneratedSiteReadingV0',
  );
  expectEqual(
    report.nextStepRecommendation.d6MustStillNotAutoName,
    true,
    'D6 still must not auto-name',
  );
  expectEqual(
    report.recommendedNextGate,
    'Gate D6 - GeneratedSiteReadingV0 FieldCue Consumption Adapter',
    'recommended next gate',
  );
  expectEqual(report.integrityIssueCount, 0, 'integrity issue count');

  expectEqual(
    containsGeneratedSiteReadingV0Import(sources.boundarySource),
    false,
    'boundary source does not import GeneratedSiteReadingV0',
  );
  expectEqual(
    containsGeneratedSiteReadingV0Import(sources.runnerSource),
    false,
    'diagnostic runner does not import GeneratedSiteReadingV0',
  );
  expectEqual(
    generatedSiteReadingV0RuntimeModuleLoaded(),
    false,
    'diagnostic runtime did not load GeneratedSiteReadingV0',
  );
  expectEqual(
    containsUiComponentImport(sources.boundarySource),
    false,
    'boundary source does not import React UI components',
  );
  expectEqual(
    containsUiComponentImport(sources.runnerSource),
    false,
    'diagnostic runner does not import React UI components',
  );
  expectEqual(
    uiComponentRuntimeModuleLoaded(),
    false,
    'diagnostic runtime did not load React UI components',
  );
  expectEqual(
    containsOperationRegistryImport(sources.boundarySource),
    false,
    'boundary source does not import operation registry',
  );
  expectEqual(
    containsOperationRegistryImport(sources.runnerSource),
    false,
    'diagnostic runner does not import operation registry',
  );
  expectEqual(
    report.integrityIssues.some(
      (issue) => issue.code === 'operation-registry-contaminated',
    ),
    false,
    'operation registry is not contaminated',
  );
  expectEqual(
    hasPackageScript(sources.packageSource, SCRIPT_NAME, SCRIPT_COMMAND),
    true,
    `${SCRIPT_NAME} package script exists`,
  );
}

function printCompactReport(report) {
  console.log('GeneratedSiteReadingV0 FieldCue boundary diagnostics');
  console.log(`diagnosticIntegrityStatus: ${report.diagnosticIntegrityStatus}`);
  console.log(`boundaryReadinessStatus: ${report.boundaryReadinessStatus}`);
  console.log(`fieldCueSourceStatus: ${report.fieldCueSourceStatus}`);
  console.log(`displayBoundaryStatus: ${report.displayBoundaryStatus}`);
  console.log(
    `generatedSiteReadingV0Status: ${report.generatedSiteReadingV0Status}`,
  );
  console.log(
    `generatedSiteReadingConsumptionStatus: ${report.generatedSiteReadingConsumptionStatus}`,
  );
  console.log(
    `childEvidenceRowCount: ${report.generatedSiteBoundarySummary.childEvidenceRowCount}`,
  );
  console.log(
    `relationEvidenceRowCount: ${report.generatedSiteBoundarySummary.relationEvidenceRowCount}`,
  );
  console.log(
    `rawFieldVisibleClaimCount: ${report.generatedSiteBoundarySummary.rawFieldVisibleClaimCount}`,
  );
  console.log(
    `misleadingRiskRowCount: ${report.generatedSiteBoundarySummary.misleadingRiskRowCount}`,
  );
  console.log(
    `tupleLossWarningCount: ${report.generatedSiteBoundarySummary.tupleLossWarningCount}`,
  );
  console.log(
    `semanticNamingClaimCount: ${report.generatedSiteBoundarySummary.semanticNamingClaimCount}`,
  );
  console.log(`recommendedNextGate: ${report.recommendedNextGate}`);
  console.log(`integrity issue count: ${report.integrityIssueCount}`);
}

function readRequiredFile(filePath, label) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    failures.push(`${label}: could not read ${filePath}: ${error.message}`);
    return null;
  }
}

function containsGeneratedSiteReadingV0Import(source) {
  return /from\s+['"][^'"]*(?:^|[/\\])?generatedSiteReadingV0(?:\.[cm]?[tj]sx?)?['"]|require\(\s*['"][^'"]*(?:^|[/\\])?generatedSiteReadingV0(?:\.[cm]?[tj]sx?)?['"]\s*\)/i.test(
    source,
  );
}

function generatedSiteReadingV0RuntimeModuleLoaded() {
  return Object.keys(require.cache).some((modulePath) => {
    const normalizedPath = modulePath.replace(/\\/g, '/');

    return /\/src\/lib\/generatedSiteReadingV0\.(?:ts|js|tsx|jsx)$/i.test(
      normalizedPath,
    );
  });
}

function containsUiComponentImport(source) {
  return /from\s+['"][^'"]*(?:[/\\]components[/\\]|\.tsx|react)['"]|require\(\s*['"][^'"]*(?:[/\\]components[/\\]|\.tsx|react)['"]\s*\)/i.test(
    source,
  );
}

function uiComponentRuntimeModuleLoaded() {
  return Object.keys(require.cache).some((modulePath) =>
    /src[\\/]components[\\/]|\.tsx$/i.test(modulePath),
  );
}

function containsOperationRegistryImport(source) {
  return /from\s+['"][^'"]*operations[/\\]registry(?:\.[cm]?[tj]s)?['"]|require\(\s*['"][^'"]*operations[/\\]registry(?:\.[cm]?[tj]s)?['"]\s*\)/i.test(
    source,
  );
}

function hasPackageScript(packageSource, scriptName, expectedCommand) {
  try {
    const packageJson = JSON.parse(packageSource);

    return packageJson.scripts?.[scriptName] === expectedCommand;
  } catch (error) {
    failures.push(`package.json parse: ${error.message}`);
    return false;
  }
}

function arraysEqual(left, right) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(
      `${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`,
    );
  }
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}
