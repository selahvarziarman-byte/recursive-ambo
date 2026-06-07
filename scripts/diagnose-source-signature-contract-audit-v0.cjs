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
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const {
  buildSourceSignatureContractAuditV0Report,
} = require(path.join(repoRoot, 'src/lib/sourceSignatureContractAuditV0.ts'));

const failures = [];
const report = buildSourceSignatureContractAuditV0Report();
const registrySource = fs.existsSync(registryPath)
  ? fs.readFileSync(registryPath, 'utf8')
  : '';

runAssertions(report, registrySource);
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
  console.log('Diagnostic assertions passed.');
}

function runAssertions(report, registrySource) {
  expectTruthy(report, 'report built');
  expectEqual(
    report.method,
    'source-signature-contract-audit-v0',
    'report method',
  );
  expectEqual(
    report.diagnosticScope,
    'one-ambo-tetrahedron-source-signature-audit',
    'diagnostic scope',
  );
  expectEqual(report.diagnosticOk, true, 'diagnostic ok');
  expectEqual(report.structuralContractStatus, 'pass', 'structural contract status');

  if (report.childSignatureReadinessAudit.fallbackChildCount > 0) {
    expectEqual(
      report.provingFixtureUsefulnessStatus,
      'fail',
      'fallback children force proving fixture usefulness fail',
    );
    expectEqual(
      report.provingEventSignatureStatus,
      'fail',
      'fallback children force proving event signature fail',
    );
  }

  if (
    report.childScalarDistinctivenessAudit.childScalarDistinctivenessStatus ===
    'scalar-invariant'
  ) {
    expectEqual(
      report.provingFixtureUsefulnessStatus,
      'fail',
      'child scalar invariance forces proving fixture usefulness fail',
    );
  }

  if (
    report.primalScalarVariationAudit.scalarVariationStatus === 'scalar-invariant'
  ) {
    expectIssueCode(report, 'primal-scalar-invariance');
  }

  if (
    report.phaseMergeAudit.some(
      (row) => row.circularMergeStatus === 'undefined-circular-mean',
    )
  ) {
    expectIssueCode(report, 'phase-circular-mean-cancellation');
  }

  expectEqual(report.issueCount, report.issues.length, 'issue count coherence');
  expectEqual(report.packetWriteStatus, 'not-packet-writing', 'packet write status');
  expectEqual(report.shapeMutationStatus, 'not-shape-mutation', 'shape mutation status');
  expectEqual(
    report.operationRegistryStatus,
    'not-operation-registry-work',
    'operation registry status',
  );
  expectEqual(
    /source[-_ ]?signature[-_ ]?contract|sourceSignatureContractAudit/i.test(
      registrySource,
    ),
    false,
    'operation registry has no source-signature contract audit registration',
  );
}

function printCompactSummary(report) {
  console.log('SourceSignatureContractAuditV0 diagnostics');
  console.log('');
  console.log('Primal profile table');
  for (const slot of report.profileSystem.profileSlots) {
    console.log(
      `${slot.vertexId}: ${slot.profileId} | amp ${formatNumber(
        slot.amplitude,
      )} | wave ${formatNumber(slot.waveNumber)} | phase ${formatNumber(
        slot.phase,
      )} | attenuation ${formatNumber(slot.attenuation)}`,
    );
  }

  console.log('');
  console.log('Child readiness table');
  for (const row of report.childDerivationTable) {
    console.log(
      `${row.childId}: ${row.sourceEdgeId} -> complement ${
        row.complementEdgeId
      } | channels ${row.channelPairs.join(', ')} | derivation ${
        row.localDerivationStatus
      } | field-ready ${row.fieldReady ? 'yes' : 'no'} | readiness ${
        row.fieldReadyStatus
      }`,
    );
  }

  console.log('');
  console.log('Fallback children');
  const fallbackRows = report.childDerivationTable.filter((row) => row.fallbackKind);
  if (fallbackRows.length) {
    for (const row of fallbackRows) {
      console.log(
        `${row.childId}: ${row.fallbackKind} | ${
          row.fallbackReason ?? 'no fallback reason'
        }`,
      );
    }
  } else {
    console.log('none');
  }

  console.log('');
  console.log('Scalar variation summary');
  console.log(
    `primal: amplitude ${report.primalScalarVariationAudit.amplitudeUniqueCount}, wave ${report.primalScalarVariationAudit.waveNumberUniqueCount}, attenuation ${report.primalScalarVariationAudit.attenuationUniqueCount}, phase ${report.primalScalarVariationAudit.phaseUniqueCount} -> ${report.primalScalarVariationAudit.scalarVariationStatus}`,
  );
  console.log(
    `children: amplitude ${report.childScalarDistinctivenessAudit.uniqueAmplitudeCount}, wave ${report.childScalarDistinctivenessAudit.uniqueWaveNumberCount}, attenuation ${report.childScalarDistinctivenessAudit.uniqueAttenuationCount}, phase ${report.childScalarDistinctivenessAudit.uniquePhaseCount} -> ${report.childScalarDistinctivenessAudit.childScalarDistinctivenessStatus}`,
  );

  console.log('');
  console.log(`contract structural status: ${report.structuralContractStatus}`);
  console.log(
    `proving fixture usefulness status: ${report.provingFixtureUsefulnessStatus}`,
  );
  console.log(`proving event signature status: ${report.provingEventSignatureStatus}`);
  console.log(`human legibility status: ${report.humanLegibilityStatus}`);
  console.log(`issue count: ${report.issueCount}`);
  console.log(`issues: ${formatIssueCounts(report)}`);
}

function expectIssueCode(report, code) {
  expectEqual(
    report.issues.some((issue) => issue.code === code),
    true,
    `issue code ${code}`,
  );
}

function formatIssueCounts(report) {
  const counts = new Map();

  for (const issue of report.issues) {
    counts.set(issue.code, (counts.get(issue.code) ?? 0) + 1);
  }

  return Array.from(counts)
    .map(([code, count]) => `${code}=${count}`)
    .join(', ') || 'none';
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toFixed(6) : String(value);
}

function expectTruthy(value, label) {
  if (!value) {
    failures.push(`${label}: expected truthy value`);
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
