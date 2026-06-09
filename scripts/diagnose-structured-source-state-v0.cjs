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
  'src/lib/structuredSourceStateDiagnosticV0.ts',
);
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const {
  buildStructuredSourceStateDiagnosticV0Report,
} = require(diagnosticSourcePath);

const failures = [];
const report = buildStructuredSourceStateDiagnosticV0Report();
const diagnosticSource = fs.readFileSync(diagnosticSourcePath, 'utf8');
const registrySource = fs.readFileSync(registryPath, 'utf8');

runAssertions(report, {
  diagnosticSource,
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
  expectEqual(report.ok, true, 'report ok');
  expectEqual(
    report.method,
    'structured-source-state-diagnostic-v0',
    'method',
  );
  expectEqual(
    report.diagnosticScope,
    'one-ambo-tetrahedron-source-state-capsule-only',
    'diagnostic scope',
  );
  expectEqual(
    report.sourceStateRegimeId,
    'structured-source-state-antipodal-covariant-v0',
    'source-state regime id',
  );
  expectEqual(
    report.sourceStateAlgebraId,
    'tetrahedral-ambo-source-state-algebra-v0',
    'source-state algebra id',
  );
  expectEqual(report.summary.primalStateCount, 4, 'primal state count');
  expectEqual(report.primalStates.length, 4, 'primal state array count');
  expectEqual(
    report.summary.generatedChildStateCount,
    6,
    'generated child state count',
  );
  expectEqual(
    report.generatedChildStates.length,
    6,
    'generated child state array count',
  );
  expectEqual(report.summary.complementAxisCount, 3, 'complement axis count');
  expectEqual(report.complementAxes.length, 3, 'complement axis array count');
  expectEqual(
    report.complementInvolutionAudit.status,
    'pass',
    'complement involution status',
  );
  expectEqual(
    report.antipodalCovarianceAudit.status,
    'pass',
    'antipodal covariance status',
  );
  expectEqual(
    report.antipodalCovarianceAudit.passCount,
    3,
    'antipodal covariance pass count',
  );
  expectEqual(
    report.structuralCovarianceAudit.status,
    'pass',
    'structural covariance status',
  );
  expectEqual(
    report.unknownFeatureRetentionAudit.status,
    'pass',
    'unknown feature retention status',
  );
  expectEqual(
    report.baselineComparison.status,
    'pass',
    'baseline comparison status',
  );

  const allStates = [...report.primalStates, ...report.generatedChildStates];

  expectEqual(
    report.summary.tupleReductionCount,
    allStates.length,
    'tuple reduction count',
  );

  for (const state of allStates) {
    const reduction = state.tupleReduction;

    expectTruthy(reduction, `${state.stateId} tuple reduction exists`);
    expectTruthy(reduction.emittedTuple, `${state.stateId} emitted tuple exists`);
    expectArray(reduction.fieldActiveStructure, `${state.stateId} fieldActiveStructure`);
    expectArray(reduction.reducedStructure, `${state.stateId} reducedStructure`);
    expectArray(
      reduction.metadataOnlyStructure,
      `${state.stateId} metadataOnlyStructure`,
    );
    expectArray(reduction.lostStructure, `${state.stateId} lostStructure`);
    expectArray(reduction.neutralAxes, `${state.stateId} neutralAxes`);
  }

  expectEqual(
    report.generatedChildStates.some(
      (state) =>
        state.tupleReduction.tupleTooNarrow ||
        state.tupleReduction.reductionStatus === 'partial-structure-loss',
    ),
    true,
    'at least one generated child reports tuple-too-narrow or partial loss',
  );
  expectEqual(
    report.baselineComparison.rows.some((row) => row.role === 'bad-control'),
    true,
    'baseline includes uniform bad control',
  );
  expectEqual(
    report.baselineComparison.rows.some(
      (row) => row.role === 'harmonic-scalar-baseline',
    ),
    true,
    'baseline includes Pythagorean scalar baseline',
  );
  expectEqual(
    report.baselineComparison.rows.some(
      (row) => row.role === 'active-source-state-kernel-candidate',
    ),
    true,
    'baseline includes structured source-state regime',
  );
  expectEqual(
    /from\s+['"].*fieldCueV0|require\([^)]*fieldCueV0/i.test(
      sources.diagnosticSource,
    ),
    false,
    'diagnostic source does not import FieldCueV0',
  );
  expectEqual(
    /from\s+['"].*generatedSiteReadingV0|require\([^)]*generatedSiteReadingV0/i.test(
      sources.diagnosticSource,
    ),
    false,
    'diagnostic source does not import GeneratedSiteReadingV0',
  );
  expectEqual(
    Object.keys(require.cache).some((modulePath) =>
      /fieldCueV0|generatedSiteReadingV0/i.test(modulePath),
    ),
    false,
    'diagnostic runtime did not load FieldCueV0 or GeneratedSiteReadingV0',
  );
  expectEqual(
    /structured[-_ ]?source[-_ ]?state|source[-_ ]?state[-_ ]?algebra|structuredSourceStateDiagnostic/i.test(
      sources.registrySource,
    ),
    false,
    'operation registry has no structured source-state operation',
  );
}

function printCompactReport(report) {
  console.log('StructuredSourceStateDiagnosticV0 diagnostics');
  console.log(`regime id: ${report.sourceStateRegimeId}`);
  console.log(`algebra id: ${report.sourceStateAlgebraId}`);
  console.log(`scope: ${report.diagnosticScope}`);
  console.log(`field atlas status: ${report.fieldAtlasStatus}`);
  console.log('');

  console.log('primal states');
  for (const state of report.primalStates) {
    console.log(
      `${state.vertexId}: ${state.stateId} | ratio ${
        state.harmonicComponent.ratioLabel
      } | reduction ${state.tupleReduction.reductionStatus} | tupleTooNarrow ${
        state.tupleReduction.tupleTooNarrow
      }`,
    );
  }

  console.log('');
  console.log('generated states');
  for (const state of report.generatedChildStates) {
    console.log(
      `${state.edgeStateId}: ${state.childSiteId} | complement ${
        state.complementEdgeStateId
      } | antipode ${state.antipodalChildSiteId} | axis ${
        state.axisPairId
      } | reduction ${state.tupleReduction.reductionStatus}`,
    );
  }

  console.log('');
  console.log('complement axes');
  for (const axis of report.complementAxes) {
    console.log(
      `${axis.axisPairId}: ${axis.edgeStateIds.join('<->')} | ${axis.childSiteIds.join(
        '<->',
      )}`,
    );
  }

  console.log('');
  console.log('tuple reduction statuses');
  for (const state of [...report.primalStates, ...report.generatedChildStates]) {
    console.log(
      `${state.stateId}: ${state.tupleReduction.reductionStatus} | active ${
        state.tupleReduction.fieldActiveStructure.length
      } | metadata ${state.tupleReduction.metadataOnlyStructure.length} | lost ${
        state.tupleReduction.lostStructure.length
      }`,
    );
  }

  console.log('');
  console.log(
    `antipodal covariance: ${report.antipodalCovarianceAudit.status} (${report.antipodalCovarianceAudit.passCount}/3)`,
  );
  for (const row of report.antipodalCovarianceAudit.rows) {
    console.log(
      `${row.edgeStateId}<->${row.complementEdgeStateId}: ${row.covarianceStatus} | ${row.tupleContrastStatus}`,
    );
  }

  console.log('');
  console.log(
    `structural covariance: ${report.structuralCovarianceAudit.status} (${report.structuralCovarianceAudit.passCount}/${report.structuralCovarianceAudit.rows.length})`,
  );
  console.log(
    `unknown feature retention: ${report.unknownFeatureRetentionAudit.status} | can reveal beyond antipodality ${report.unknownFeatureRetentionAudit.canRevealFeaturesBeyondAntipodality}`,
  );
  console.log(`baseline comparison: ${report.baselineComparison.status}`);
  for (const row of report.baselineComparison.rows) {
    console.log(`${row.role}: ${row.baselineId} | ${row.status}`);
  }

  console.log('');
  console.log(
    `summary: primal ${report.summary.primalStateCount}, generated ${report.summary.generatedChildStateCount}, axes ${report.summary.complementAxisCount}, reductions ${report.summary.tupleReductionCount}`,
  );
  console.log(
    `structure counts: field-active ${report.summary.fieldActiveStructureCount}, metadata-only ${report.summary.metadataOnlyStructureCount}, lost ${report.summary.lostStructureCount}, tuple-too-narrow ${report.summary.tupleTooNarrowCount}`,
  );
  console.log(`issue count: ${report.issueCount}`);
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`);
  }
}

function expectTruthy(value, label) {
  if (!value) {
    failures.push(`${label}: expected truthy value`);
  }
}

function expectArray(value, label) {
  if (!Array.isArray(value)) {
    failures.push(`${label}: expected array, got ${formatValue(value)}`);
  }
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}
