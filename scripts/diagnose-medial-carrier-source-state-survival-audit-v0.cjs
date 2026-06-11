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
const reportPath = path.join(
  repoRoot,
  'src/lib/medialCarrierSourceStateSurvivalAuditV0.ts',
);
const {
  buildMedialCarrierSourceStateSurvivalAuditV0Report,
} = require(reportPath);

const report = buildMedialCarrierSourceStateSurvivalAuditV0Report();

printStatus(report);
printConsumedReports(report);
printClassificationRows(report);
printAggregates(report);
printSurvivalComponents(report);
printDecisionD1(report);
printVerdict(report);
printIntegrity(report);

if (!report.ok) {
  process.exitCode = 1;
}

function printStatus(report) {
  console.log('MedialCarrierSourceStateSurvivalAuditV0 diagnostics');
  console.log('');
  console.log(`method: ${report.method}`);
  console.log(`diagnosticScope: ${report.diagnosticScope}`);
  console.log(`regimeAmendmentStatus: ${report.regimeAmendmentStatus}`);
  console.log(`fieldCueUnblockStatus: ${report.fieldCueUnblockStatus}`);
  console.log(`s0Status: ${report.s0Status}`);
  console.log(`uiStatus: ${report.uiStatus}`);
  console.log(`shapeMutationStatus: ${report.shapeMutationStatus}`);
  console.log(`packetWriteStatus: ${report.packetWriteStatus}`);
  console.log(`operationRegistryStatus: ${report.operationRegistryStatus}`);
  console.log(`topologyStatus: ${report.topologyStatus}`);
}

function printConsumedReports(report) {
  console.log('');
  console.log('consumed reports');

  for (const [label, consumed] of Object.entries(report.consumedReports)) {
    console.log(
      `${label}: method=${consumed.method} | ok=${consumed.ok} | issueCount=${consumed.issueCount}`,
    );
  }
}

function printClassificationRows(report) {
  console.log('');
  console.log('classification rows');

  for (const row of report.rows) {
    console.log('');
    console.log(
      `${row.objectId} | ${row.survivalBucket} | ${row.projectionChannel} | ${row.locatorTier}`,
    );

    for (const entry of row.derivationBasis) {
      console.log(`  basis: ${entry}`);
    }

    for (const caveat of row.caveats) {
      console.log(`  caveat: ${caveat}`);
    }
  }
}

function printAggregates(report) {
  console.log('');
  console.log('aggregates');

  for (const [bucket, count] of Object.entries(report.bucketCounts)) {
    console.log(`bucket ${bucket}: ${count}`);
  }

  for (const [channel, count] of Object.entries(report.channelCounts)) {
    console.log(`channel ${channel}: ${count}`);
  }

  console.log(`sourceStateRealCount: ${report.sourceStateRealCount}`);
  console.log(`sideTableCount: ${report.sideTableCount}`);
  console.log(`orphanCount: ${report.orphanCount}`);
}

function printSurvivalComponents(report) {
  console.log('');
  console.log('survival components');
  console.log(`baseSurvives: ${report.baseSurvives}`);
  console.log(`fiberSurvives: ${report.fiberSurvives}`);
}

function printDecisionD1(report) {
  console.log('');
  console.log('decision d1');
  console.log(`decisionD1Rule: ${report.decisionD1Rule}`);
  console.log(`decisionD1Triggered: ${report.decisionD1Triggered}`);
}

function printVerdict(report) {
  console.log('');
  console.log('sourceStateRealVerdict');
  console.log(report.sourceStateRealVerdict);
}

function printIntegrity(report) {
  console.log('');
  console.log(`integrity issue count: ${report.integrityIssueCount}`);

  if (!report.integrityIssues.length) {
    console.log('Diagnostic assertions passed.');
    return;
  }

  console.error('Diagnostic assertions failed:');

  for (const issue of report.integrityIssues) {
    console.error(`- ${issue.code}: ${issue.message}`);
  }
}
