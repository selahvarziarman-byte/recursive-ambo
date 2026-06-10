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
  'src/lib/octonionVsA3MedialCarrierDiscriminatorV0.ts',
);
const {
  buildOctonionVsA3MedialCarrierDiscriminatorV0Report,
} = require(reportPath);

const report = buildOctonionVsA3MedialCarrierDiscriminatorV0Report();

printSummary(report);
printHypothesisVerdicts(report);
printIssues(report);

if (!report.ok) {
  process.exitCode = 1;
}

function printSummary(report) {
  const summary = report.summary;

  console.log('OctonionVsA3MedialCarrierDiscriminatorV0 diagnostics');
  console.log('');
  console.log(`method: ${report.method}`);
  console.log(`diagnosticScope: ${report.diagnosticScope}`);
  console.log(`candidateStatus: ${report.candidateStatus}`);
  console.log(`flagCount: ${summary.flagCount}`);
  console.log(`distinctFlagCount: ${summary.distinctFlagCount}`);
  console.log(`flagRecoveryStatus: ${summary.flagRecoveryStatus}`);
  console.log(`flagDiscriminatorStatus: ${summary.flagDiscriminatorStatus}`);
  console.log(`signedLiftFlagCount: ${summary.signedLiftFlagCount}`);
  console.log(`distinctSignedLiftCount: ${summary.distinctSignedLiftCount}`);
  console.log(
    `signedLiftQuotientLossStatus: ${summary.signedLiftQuotientLossStatus}`,
  );
  console.log(
    `signedLiftDiscriminatesAgainst: ${summary.signedLiftDiscriminatesAgainst}`,
  );
  console.log(`canonicalTriangleCount: ${summary.canonicalTriangleCount}`);
  console.log(
    `canonicalTriangleOrderedProductCount: ${summary.canonicalTriangleOrderedProductCount}`,
  );
  console.log(
    `canonicalTriangleClosurePassCount: ${summary.canonicalTriangleClosurePassCount}`,
  );
  console.log(
    `canonicalTriangleClosureFailCount: ${summary.canonicalTriangleClosureFailCount}`,
  );
  console.log(`triangleClosureStatus: ${summary.triangleClosureStatus}`);
  console.log(`canonicalSquareCycleCount: ${summary.canonicalSquareCycleCount}`);
  console.log(
    `canonicalSquareHolonomyVariantCount: ${summary.canonicalSquareHolonomyVariantCount}`,
  );
  console.log(`squareHolonomyPassCount: ${summary.squareHolonomyPassCount}`);
  console.log(`squareHolonomyFailCount: ${summary.squareHolonomyFailCount}`);
  console.log(`squareHolonomyStatus: ${summary.squareHolonomyStatus}`);
  console.log(
    `fanoCompleteQuadrangleCount: ${summary.fanoCompleteQuadrangleCount}`,
  );
  console.log(`quadrangleLabelingCount: ${summary.quadrangleLabelingCount}`);
  console.log(
    `gaugeFlagRecoveryFailureCount: ${summary.gaugeFlagRecoveryFailureCount}`,
  );
  console.log(
    `gaugeTriangleClosureFailureCount: ${summary.gaugeTriangleClosureFailureCount}`,
  );
  console.log(
    `gaugeSquareHolonomyFailureCount: ${summary.gaugeSquareHolonomyFailureCount}`,
  );
  console.log(
    `gaugeQuotientLossAnomalyCount: ${summary.gaugeQuotientLossAnomalyCount}`,
  );
  console.log(`gaugeRobustnessStatus: ${summary.gaugeRobustnessStatus}`);
  console.log(`tetraSeedStatus: ${summary.tetraSeedStatus}`);
  console.log(`octaSeedStatus: ${summary.octaSeedStatus}`);
  console.log(`cubeSeedStatus: ${summary.cubeSeedStatus}`);
  console.log(`tetraAmboSupportStatus: ${summary.tetraAmboSupportStatus}`);
  console.log(`octaAmboSupportStatus: ${summary.octaAmboSupportStatus}`);
  console.log(`cubeAmboSupportStatus: ${summary.cubeAmboSupportStatus}`);
  console.log(`cuboctahedronBridgeStatus: ${summary.cuboctahedronBridgeStatus}`);
  console.log(
    `cubeG1CuboctahedronBridgeStatus: ${summary.cubeG1CuboctahedronBridgeStatus}`,
  );
  console.log(
    `tetraG2CoreCuboctahedronBridgeStatus: ${summary.tetraG2CoreCuboctahedronBridgeStatus}`,
  );
  console.log(`cubeG1MedialHubStatus: ${summary.cubeG1MedialHubStatus}`);
  console.log(
    `cubePrimalCarrierAssignmentStatus: ${summary.cubePrimalCarrierAssignmentStatus}`,
  );
  console.log(`generalFieldLawStatus: ${summary.generalFieldLawStatus}`);
  console.log(`universalOctonionStatus: ${summary.universalOctonionStatus}`);
  console.log(`cubePrimalSourcehoodStatus: ${summary.cubePrimalSourcehoodStatus}`);
  console.log(`fieldCueUnblockStatus: ${summary.fieldCueUnblockStatus}`);
  console.log(`s0Status: ${summary.s0Status}`);
  console.log(`uiStatus: ${summary.uiStatus}`);
  console.log(`shapeMutationStatus: ${summary.shapeMutationStatus}`);
  console.log(`packetWriteStatus: ${summary.packetWriteStatus}`);
}

function printHypothesisVerdicts(report) {
  console.log('');
  console.log('hypothesis verdicts');

  for (const row of report.hypothesisVerdicts) {
    console.log(`${row.hypothesisId}: ${row.verdict} | ${row.reason}`);
  }
}

function printIssues(report) {
  console.log('');

  if (!report.issues.length) {
    console.log('Diagnostics passed.');
    return;
  }

  console.error('Diagnostics failed:');

  for (const issue of report.issues) {
    console.error(`- ${issue.code}: ${issue.message}`);
  }
}
