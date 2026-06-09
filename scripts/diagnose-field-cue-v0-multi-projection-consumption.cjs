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
  'src/lib/fieldCueV0MultiProjectionConsumption.ts',
);
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const {
  buildFieldCueV0MultiProjectionConsumptionReport,
} = require(diagnosticSourcePath);

const failures = [];
const report = buildFieldCueV0MultiProjectionConsumptionReport();
const diagnosticSource = fs.readFileSync(diagnosticSourcePath, 'utf8');
const runnerSource = fs.readFileSync(__filename, 'utf8');
const registrySource = fs.readFileSync(registryPath, 'utf8');

runAssertions(report, {
  diagnosticSource,
  runnerSource,
  registrySource,
});
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
    report.method,
    'field-cue-v0-multi-projection-consumption',
    'method',
  );
  expectEqual(report.parentGate, 'Gate D0', 'parent gate');
  expectEqual(
    report.acceptedSourceStateRegimeId,
    'multi-projection-source-state-v0',
    'accepted source-state regime',
  );
  expectEqual(
    report.sourceStateBasis,
    'structured-source-state-signature',
    'source-state basis',
  );
  expectEqual(
    report.adapterScope,
    'diagnostic-only-consumption-adapter',
    'adapter scope',
  );

  expectEqual(
    report.sourceReportIdentity.sourceReportConsumedStatus,
    'c4l-d3-source-report-consumed',
    'C.4L-D3 source report consumed',
  );
  expectEqual(
    report.sourceReportIdentity.sourceParentGate,
    'Gate C.4L-D3',
    'C.4L-D3 source parent gate',
  );
  expectEqual(
    report.sourceReportIdentity.sourceProjectionModelId,
    'multi-projection-source-state-v0',
    'source projection model',
  );
  expectEqual(
    report.sourceReportIdentity.sourceCandidateLawId,
    'c4l-s2-structural-carrier-split-v0',
    'source candidate law id',
  );
  expectEqual(
    report.sourceReportIdentity.sourceReportOk,
    true,
    'source report ok',
  );
  expectEqual(
    report.sourceReportIdentity.sourceReductionLawAdoptionStatus,
    'not-adopted',
    'source reduction law adoption status',
  );

  expectEqual(
    report.consumedProjectionSummary.generatedChildProjectionCount,
    6,
    'generated child projection count',
  );
  expectEqual(
    report.consumedProjectionSummary.propagationProjectionCount,
    6,
    'propagation projection count',
  );
  expectEqual(
    report.consumedProjectionSummary.structuralProjectionCount,
    6,
    'structural projection count',
  );
  expectEqual(
    report.consumedProjectionSummary.relationVisibilityRowCount,
    3,
    'relation visibility row count',
  );
  expectEqual(
    report.consumedProjectionSummary.structuralOperationPairCount,
    3,
    'structural operation pair count',
  );
  expectEqual(report.cueRowsByGeneratedChild.length, 6, 'child cue row count');
  expectEqual(report.relationCueRows.length, 3, 'relation cue row count');

  expectEqual(
    report.cueRowsByGeneratedChild.every(
      (row) =>
        row.propagationCue.cueInterpretation ===
          'ordinary-propagation-witness-not-full-source-signature' &&
        row.structuralCue.cueInterpretation ===
          'structural-relation-witness-under-declared-basis',
    ),
    true,
    'child cue rows preserve propagation/structural split',
  );
  expectEqual(
    report.cueRowsByGeneratedChild.every(
      (row) =>
        row.reductionHonesty.emittedTupleStatus ===
          'propagation-facing-reduction-only' &&
        row.reductionHonesty.sourceSignatureStatus ===
          'structured-source-state-not-scalar-tuple' &&
        row.reductionHonesty.tupleLossWarning === true,
    ),
    true,
    'scalar tuple is not treated as source signature',
  );
  expectEqual(
    report.reductionHonestySummary.rawFieldBehaviorStatus,
    'failed-insufficient',
    'raw field behavior remains failed/insufficient',
  );
  expectEqual(
    report.reductionHonestySummary.reductionLawAdoptionStatus,
    'not-adopted',
    'adapter reduction law adoption status',
  );

  expectEqual(
    report.relationCueRows.some(
      (row) =>
        row.rawFieldCueStatus === 'raw-field-visible' ||
        row.relationVisibilityStatuses.includes('raw-field-visible'),
    ),
    false,
    'raw-field-passed is not claimed',
  );
  expectEqual(
    report.relationCueRows.every(
      (row) =>
        row.misleadingRisk === true &&
        row.relationVisibilityStatuses.includes(
          'misleading-if-read-as-raw-field',
        ) &&
        row.cueWarning.includes('Raw field visibility is not proven') &&
        row.cueWarning.includes('declared basis') &&
        row.cueWarning.includes('misleading-if-read-as-raw-field'),
    ),
    true,
    'misleading-risk warnings exist',
  );

  expectEqual(
    report.fieldCueV0Status,
    'blocked-pending-multi-projection-adaptation',
    'top-level FieldCueV0 status',
  );
  expectEqual(
    report.fieldCueBoundary.fieldCueV0Status,
    'blocked-pending-multi-projection-adaptation',
    'FieldCueV0 remains blocked',
  );
  expectEqual(
    report.generatedSiteReadingV0Status,
    'blocked',
    'top-level GeneratedSiteReadingV0 status',
  );
  expectEqual(
    report.fieldCueBoundary.generatedSiteReadingV0Status,
    'blocked',
    'GeneratedSiteReadingV0 remains blocked',
  );
  expectEqual(
    report.runtimePromotionStatus,
    'not-promoted',
    'runtime promotion status',
  );
  expectEqual(
    report.fieldCueBoundary.runtimePromotionStatus,
    'not-promoted',
    'boundary runtime promotion status',
  );
  expectEqual(
    report.adapterConsumptionStatus,
    'fieldcue-multi-projection-consumption-supported',
    'adapter consumption status',
  );
  expectEqual(report.recommendedNextGate, 'Gate D1', 'recommended next gate');
  expectEqual(report.semanticStatus, 'not-semantic-naming', 'semantic status');
  expectEqual(report.topologyStatus, 'not-topology-workspace', 'topology status');
  expectEqual(report.packetWriteStatus, 'not-packet-writing', 'packet write status');
  expectEqual(
    report.fieldAtlasMutationStatus,
    'not-mutated',
    'field atlas mutation status',
  );
  expectEqual(
    report.operationRegistryStatus,
    'not-operation-registry-work',
    'operation registry status',
  );
  expectEqual(report.integrityIssueCount, 0, 'integrity issue count');

  expectEqual(
    containsGeneratedSiteReadingV0Import(sources.diagnosticSource),
    false,
    'diagnostic source does not import GeneratedSiteReadingV0',
  );
  expectEqual(
    containsGeneratedSiteReadingV0Import(sources.runnerSource),
    false,
    'diagnostic runner does not import GeneratedSiteReadingV0',
  );
  expectEqual(
    containsUiComponentImport(sources.diagnosticSource),
    false,
    'diagnostic source does not import UI components',
  );
  expectEqual(
    containsUiComponentImport(sources.runnerSource),
    false,
    'diagnostic runner does not import UI components',
  );
  expectEqual(
    Object.keys(require.cache).some((modulePath) =>
      /generatedSiteReadingV0/i.test(modulePath),
    ),
    false,
    'diagnostic runtime did not load GeneratedSiteReadingV0',
  );
  expectEqual(
    Object.keys(require.cache).some((modulePath) =>
      /src[\\/]components[\\/]|FieldCueV0Panel|GeneratedSiteReadingV0Panel/i.test(
        modulePath,
      ),
    ),
    false,
    'diagnostic runtime did not load UI components',
  );
  expectEqual(
    /field[-_ ]?cue|fieldCueV0MultiProjectionConsumption|Gate D0|multi[-_ ]?projection[-_ ]?consumption/i.test(
      sources.registrySource,
    ),
    false,
    'operation registry has no FieldCueV0 multi-projection consumption work',
  );
}

function printCompactReport(report) {
  console.log('FieldCueV0 multi-projection consumption diagnostics');
  console.log(`diagnosticIntegrityStatus: ${report.diagnosticIntegrityStatus}`);
  console.log(
    `acceptedSourceStateRegimeId: ${report.acceptedSourceStateRegimeId}`,
  );
  console.log(`sourceStateBasis: ${report.sourceStateBasis}`);
  console.log(`child cue row count: ${report.cueRowsByGeneratedChild.length}`);
  console.log(`relation cue row count: ${report.relationCueRows.length}`);
  console.log(`adapterConsumptionStatus: ${report.adapterConsumptionStatus}`);
  console.log(`fieldCueV0Status: ${report.fieldCueV0Status}`);
  console.log(
    `generatedSiteReadingV0Status: ${report.generatedSiteReadingV0Status}`,
  );
  console.log(`runtimePromotionStatus: ${report.runtimePromotionStatus}`);
  console.log(`recommendedNextGate: ${report.recommendedNextGate}`);
  console.log(`integrity issue count: ${report.integrityIssueCount}`);
}

function containsGeneratedSiteReadingV0Import(source) {
  return /from\s+['"][^'"]*generatedSiteReadingV0|require\([^)]*generatedSiteReadingV0/i.test(
    source,
  );
}

function containsUiComponentImport(source) {
  return /from\s+['"][^'"]*(?:components|FieldCueV0Panel|GeneratedSiteReadingV0Panel|\.tsx)|require\([^)]*(?:components|FieldCueV0Panel|GeneratedSiteReadingV0Panel|\.tsx)/i.test(
    source,
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
