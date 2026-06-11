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
  'src/lib/medialCarrierSourceStateSurvivalAuditV1.ts',
);
const {
  buildMedialCarrierSourceStateSurvivalAuditV1Report,
} = require(reportPath);

const report = buildMedialCarrierSourceStateSurvivalAuditV1Report();

printStatus(report);
printConsumedReports(report);
printBaseline(report);
printClassificationRows(report);
printAggregates(report);
printSurvivalComponents(report);
printDecisionD1(report);
printVerdict(report);
printDeltaSummary(report);
printIntegrity(report);

if (!report.ok) {
  process.exitCode = 1;
}

function printStatus(report) {
  console.log('MedialCarrierSourceStateSurvivalAuditV1 diagnostics');
  console.log('');
  console.log(`method: ${report.method}`);
  console.log(`diagnosticScope: ${report.diagnosticScope}`);
  console.log(`regionSetIds: ${report.regionSetIds.join(', ')}`);
  console.log(`regionSetDescription: ${report.regionSetDescription}`);
  console.log(`tetraG1RegimeStatus: ${report.tetraG1RegimeStatus}`);
  console.log(`v0FrozenStatus: ${report.v0FrozenStatus}`);
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

function printBaseline(report) {
  console.log('');
  console.log(`baselineIdentityStatus: ${report.baselineIdentityStatus}`);
  console.log('ratified Station I baseline (sharpening 2 constants)');

  for (const cell of report.ratifiedBaseline) {
    console.log(`  ${cell.objectId}: ${cell.survivalBucket} / ${cell.projectionChannel}`);
  }
}

function printClassificationRows(report) {
  console.log('');
  console.log('classification rows (v0 -> v1)');

  for (const row of report.rows) {
    console.log('');
    console.log(
      `${row.objectId} | v0: ${row.v0SurvivalBucket}/${row.v0ProjectionChannel} -> v1: ${row.survivalBucket}/${row.projectionChannel} | changed=${row.changed} | tier=${row.locatorTier}`,
    );
    console.log(`  reachability: ${row.reachabilityAnnotation}`);

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
  console.log('aggregates (v1)');

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
  console.log('survival components (v1)');
  console.log(`baseSurvives: ${report.baseSurvives}`);
  console.log(`fiberSurvives: ${report.fiberSurvives}`);
}

function printDecisionD1(report) {
  console.log('');
  console.log('decision d1 (v1)');
  console.log(`decisionD1Rule: ${report.decisionD1Rule}`);
  console.log(`decisionD1Triggered: ${report.decisionD1Triggered}`);
}

function printVerdict(report) {
  console.log('');
  console.log('post-lift sourceStateRealVerdict');
  console.log(report.sourceStateRealVerdict);
}

function printDeltaSummary(report) {
  console.log('');
  console.log('v0 -> v1 delta summary');
  console.log(report.deltaSummary);
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
