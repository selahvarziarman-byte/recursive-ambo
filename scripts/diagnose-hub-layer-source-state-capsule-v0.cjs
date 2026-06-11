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
const reportPath = path.join(repoRoot, 'src/lib/hubLayerSourceStateCapsuleV0.ts');
const { buildHubLayerSourceStateCapsuleV0Report } = require(reportPath);

const report = buildHubLayerSourceStateCapsuleV0Report();

printStatus(report);
printConsumedReports(report);
printPrimalAssignment(report);
printFlagStates(report);
printAntipodalAxes(report);
printRayGroups(report);
printTriangleRelations(report);
printSquareRelations(report);
printRecomputationSummary(report);
printGaugeMeta(report);
printProvenanceRoutes(report);
printOpenBoundaries(report);
printTupleReductionDeclaration(report);
printIntegrity(report);

if (!report.ok) {
  process.exitCode = 1;
}

function printStatus(report) {
  console.log('HubLayerSourceStateCapsuleV0 diagnostics');
  console.log('');
  console.log(`method: ${report.method}`);
  console.log(`capsuleScope: ${report.capsuleScope}`);
  console.log(`generalityStatus: ${report.generalityStatus}`);
  console.log(`fieldActiveStatus: ${report.fieldActiveStatus}`);
  console.log(`tetraG1RegimeStatus: ${report.tetraG1RegimeStatus}`);
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

function printPrimalAssignment(report) {
  console.log('');
  console.log('primal carrier assignment (atom)');
  console.log(
    Object.entries(report.primalCarrierAssignment)
      .map(([label, unit]) => `${label}=${unit}`)
      .join(' '),
  );
}

function printFlagStates(report) {
  console.log('');
  console.log(`flag states (${report.flagStates.length})`);

  for (const state of report.flagStates) {
    console.log(
      `${state.flagId} | recomputed=${state.recomputedSignedLiftLabel} | upstream=${state.upstreamSignedLift} | ${state.transportedSignIdentityStatus} | ${state.carrierRay} | reverse=${state.reverseFlagId} | c5=${state.gateC5VisibilityStatus} | reduction=${state.tupleReductionStatus}`,
    );
  }
}

function printAntipodalAxes(report) {
  console.log('');
  console.log(`antipodal flag axes (${report.antipodalAxes.length})`);

  for (const axis of report.antipodalAxes) {
    console.log(
      `${axis.axisId} | ${axis.carrierRay} | lifts=${axis.signedLiftPair.join('/')} | ${axis.recomputedOppositionStatus} | ${axis.rootNegationStatus} | ${axis.upstreamAgreementStatus} | c5=${axis.gateC5VisibilityStatus} | reduction=${axis.tupleReductionStatus}`,
    );
  }
}

function printRayGroups(report) {
  console.log('');
  console.log(`ray groups (${report.rayGroups.length})`);

  for (const group of report.rayGroups) {
    const flags = group.flagIds
      .map((flagId, index) => `${flagId}(${group.signedLifts[index]})`)
      .join(', ');

    console.log(`${group.carrierRay} | axes=${group.axisIds.length} | flags=${flags}`);
  }
}

function printTriangleRelations(report) {
  console.log('');
  console.log(`triangle closure relations (${report.triangleClosureRelations.length})`);

  for (const relation of report.triangleClosureRelations) {
    const sample = relation.orderedProductRows[0];

    console.log(
      `${relation.relationId} | products ${relation.agreementCount}/${relation.rowCount} agree | recomputed closure pass=${relation.recomputedClosurePassCount}/${relation.rowCount} | ${relation.relationAgreementStatus} | c5=${relation.gateC5VisibilityStatus} | reduction=${relation.tupleReductionStatus}`,
    );

    if (sample) {
      console.log(
        `  sample: ${sample.leftFlagId} * ${sample.rightFlagId} = ${sample.recomputedProduct} -> target ${sample.targetFlagId} (upstream ${sample.upstreamProduct}, ${sample.productAgreementStatus})`,
      );
    }
  }
}

function printSquareRelations(report) {
  console.log('');
  console.log(`square holonomy relations (${report.squareHolonomyRelations.length})`);

  for (const relation of report.squareHolonomyRelations) {
    const sample = relation.variantRows[0];

    console.log(
      `${relation.relationId} | variants ${relation.agreementCount}/${relation.rowCount} agree | recomputed holonomy pass=${relation.recomputedHolonomyPassCount}/${relation.rowCount} | ${relation.relationAgreementStatus} | c5=${relation.gateC5VisibilityStatus} | reduction=${relation.tupleReductionStatus}`,
    );
    console.log(`  canonical cycle: ${relation.canonicalFlagCycle.join(' -> ')}`);

    if (sample) {
      console.log(
        `  sample: ${sample.orientationVariant} left-associated product = ${sample.recomputedLeftAssociatedProduct} (upstream ${sample.upstreamLeftAssociatedProduct}, ${sample.productAgreementStatus})`,
      );
    }
  }
}

function printRecomputationSummary(report) {
  const summary = report.recomputationSummary;

  console.log('');
  console.log('recomputation summary');
  console.log(
    `liftIdentityVerified: ${summary.liftIdentityVerifiedCount}/${summary.flagStateCount}`,
  );
  console.log(
    `distinctRecomputedSignedLiftCount: ${summary.distinctRecomputedSignedLiftCount} (over ${summary.flagStateCount} ordered flag states - quotient recorded, not collapsed)`,
  );
  console.log(
    `antipodalAxesVerified: ${summary.antipodalAxisVerifiedCount}/${summary.antipodalAxisCount}`,
  );
  console.log(
    `triangleProductAgreement: ${summary.triangleProductAgreementCount}/${summary.triangleProductRowCount}`,
  );
  console.log(
    `squareVariantAgreement: ${summary.squareVariantAgreementCount}/${summary.squareVariantRowCount}`,
  );
}

function printGaugeMeta(report) {
  const meta = report.gaugeRobustnessMeta;

  console.log('');
  console.log('gauge robustness meta (declared meta-property)');
  console.log(
    `quadrangles=${meta.quadrangleCount} | labelings=${meta.labelingCount} | failures: flagRecovery=${meta.flagRecoveryFailureCount}, triangleClosure=${meta.triangleClosureFailureCount}, squareHolonomy=${meta.squareHolonomyFailureCount}, quotientLoss=${meta.quotientLossAnomalyCount}`,
  );
  console.log(`upstreamGaugeRobustnessStatus: ${meta.upstreamGaugeRobustnessStatus}`);
  console.log(`invarianceKind: ${meta.invarianceKind}`);
  console.log(`invarianceDistinction: ${meta.invarianceDistinction}`);
  console.log(`recomputationStatus: ${meta.recomputationStatus}`);
  console.log(`c5=${meta.gateC5VisibilityStatus} | reduction=${meta.tupleReductionStatus}`);
}

function printProvenanceRoutes(report) {
  console.log('');
  console.log(`provenance routes (${report.provenanceRoutes.length})`);

  for (const route of report.provenanceRoutes) {
    const medialHub = route.medialHubStatus
      ? ` | medialHubStatus=${route.medialHubStatus}`
      : '';

    console.log(
      `${route.routeKind} | ${route.upstreamBridgeStatus} | topologies=${route.coreTopologies.join(',')}${medialHub} | c5=${route.gateC5VisibilityStatus} | reduction=${route.tupleReductionStatus}`,
    );
  }
}

function printOpenBoundaries(report) {
  console.log('');
  console.log(`open boundaries (${report.openBoundaries.length})`);

  for (const boundary of report.openBoundaries) {
    console.log(`${boundary.boundaryId} | ${boundary.upstreamStatus} | ${boundary.boundaryStatus}`);

    for (const line of boundary.corroboration) {
      console.log(`  corroboration: ${line}`);
    }
  }
}

function printTupleReductionDeclaration(report) {
  const declaration = report.tupleReductionDeclaration;

  console.log('');
  console.log('tuple reduction declaration');
  console.log(`sourceSignatureStatus: ${declaration.sourceSignatureStatus}`);
  console.log(`emittedTupleStatus: ${declaration.emittedTupleStatus}`);
  console.log(`reductionLawContext: ${declaration.reductionLawContext}`);

  for (const lost of declaration.lostUnderScalarTupleReduction) {
    console.log(`  lost: ${lost}`);
  }

  console.log(`quotientEvidence: ${declaration.quotientEvidence}`);
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
