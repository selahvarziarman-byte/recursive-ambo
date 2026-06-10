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
  'src/lib/medialDualEquivariantCarrierPolicyModelCardV0.ts',
);
const {
  buildMedialDualEquivariantCarrierPolicyModelCardV0Report,
} = require(reportPath);

const report = buildMedialDualEquivariantCarrierPolicyModelCardV0Report();

printStatus(report);
printEvidenceSnapshot(report);
printHypothesisRulings(report);
printAuthorizedClaims(report);
printForbiddenPromotions(report);
printNextProofObligations(report);
printIssues(report);

if (!report.ok) {
  process.exitCode = 1;
}

function printStatus(report) {
  console.log('MedialDualEquivariantCarrierPolicyModelCardV0 diagnostics');
  console.log('');
  console.log(`method: ${report.method}`);
  console.log(`modelCardScope: ${report.modelCardScope}`);
  console.log(`sourceDiagnosticMethod: ${report.sourceDiagnosticMethod}`);
  console.log(`sourceDiagnosticOk: ${report.sourceDiagnosticOk}`);
  console.log(`sourceDiagnosticIssueCount: ${report.sourceDiagnosticIssueCount}`);
  console.log(`policyCandidateStatus: ${report.policyCandidateStatus}`);
  console.log(`ratificationStatus: ${report.ratificationStatus}`);
  console.log(`generalFieldLawStatus: ${report.generalFieldLawStatus}`);
  console.log(`universalOctonionStatus: ${report.universalOctonionStatus}`);
  console.log(`cubePrimalSourcehoodStatus: ${report.cubePrimalSourcehoodStatus}`);
  console.log(`fieldCueUnblockStatus: ${report.fieldCueUnblockStatus}`);
  console.log(`s0Status: ${report.s0Status}`);
  console.log(`uiStatus: ${report.uiStatus}`);
  console.log(`shapeMutationStatus: ${report.shapeMutationStatus}`);
  console.log(`packetWriteStatus: ${report.packetWriteStatus}`);
}

function printEvidenceSnapshot(report) {
  const evidence = report.evidenceSnapshot;

  console.log('');
  console.log('evidence snapshot');
  console.log(`flagCount: ${evidence.flagCount}`);
  console.log(`distinctFlagCount: ${evidence.distinctFlagCount}`);
  console.log(`signedLiftFlagCount: ${evidence.signedLiftFlagCount}`);
  console.log(`distinctSignedLiftCount: ${evidence.distinctSignedLiftCount}`);
  console.log(`canonicalTriangleCount: ${evidence.canonicalTriangleCount}`);
  console.log(
    `canonicalTriangleOrderedProductCount: ${evidence.canonicalTriangleOrderedProductCount}`,
  );
  console.log(
    `canonicalTriangleClosurePassCount: ${evidence.canonicalTriangleClosurePassCount}`,
  );
  console.log(
    `canonicalTriangleClosureFailCount: ${evidence.canonicalTriangleClosureFailCount}`,
  );
  console.log(`canonicalSquareCycleCount: ${evidence.canonicalSquareCycleCount}`);
  console.log(
    `canonicalSquareHolonomyVariantCount: ${evidence.canonicalSquareHolonomyVariantCount}`,
  );
  console.log(`squareHolonomyPassCount: ${evidence.squareHolonomyPassCount}`);
  console.log(`squareHolonomyFailCount: ${evidence.squareHolonomyFailCount}`);
  console.log(
    `fanoCompleteQuadrangleCount: ${evidence.fanoCompleteQuadrangleCount}`,
  );
  console.log(`quadrangleLabelingCount: ${evidence.quadrangleLabelingCount}`);
  console.log(
    `gaugeTriangleClosureFailureCount: ${evidence.gaugeTriangleClosureFailureCount}`,
  );
  console.log(
    `gaugeSquareHolonomyFailureCount: ${evidence.gaugeSquareHolonomyFailureCount}`,
  );
  console.log(
    `gaugeQuotientLossAnomalyCount: ${evidence.gaugeQuotientLossAnomalyCount}`,
  );
  console.log(`cuboctahedronBridgeStatus: ${evidence.cuboctahedronBridgeStatus}`);
  console.log(
    `cubeG1CuboctahedronBridgeStatus: ${evidence.cubeG1CuboctahedronBridgeStatus}`,
  );
  console.log(
    `tetraG2CoreCuboctahedronBridgeStatus: ${evidence.tetraG2CoreCuboctahedronBridgeStatus}`,
  );
  console.log(`cubeG1MedialHubStatus: ${evidence.cubeG1MedialHubStatus}`);
  console.log(
    `cubePrimalCarrierAssignmentStatus: ${evidence.cubePrimalCarrierAssignmentStatus}`,
  );
}

function printHypothesisRulings(report) {
  console.log('');
  console.log('hypothesis rulings');

  for (const row of report.hypothesisRulings) {
    console.log(
      `${row.hypothesisId}: ${row.ruling} | ${row.meaning} | ${row.evidence} | source=${row.sourceVerdict}`,
    );
  }
}

function printAuthorizedClaims(report) {
  console.log('');
  console.log('authorized claims');

  for (const row of report.authorizedClaims) {
    console.log(`${row.claimId}: ${row.claim}`);
  }
}

function printForbiddenPromotions(report) {
  console.log('');
  console.log('forbidden promotions');

  for (const row of report.forbiddenPromotions) {
    console.log(`${row.promotionId}: ${row.warning}`);
  }
}

function printNextProofObligations(report) {
  console.log('');
  console.log('next proof obligations');

  for (const row of report.nextProofObligations) {
    console.log(`${row.phase} ${row.obligationId}: ${row.obligation}`);
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
