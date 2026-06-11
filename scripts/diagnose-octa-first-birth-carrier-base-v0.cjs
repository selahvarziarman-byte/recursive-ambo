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
const reportPath = path.join(repoRoot, 'src/lib/octaFirstBirthCarrierBaseV0.ts');
const { buildOctaFirstBirthCarrierBaseV0Report } = require(reportPath);

const report = buildOctaFirstBirthCarrierBaseV0Report();

printStatus(report);
printReferenceReports(report);
printGeometry(report);
printAssignment(report);
printOrientationPolicy(report);
printLifts(report);
printTriangles(report);
printSquares(report);
printAntipodality(report);
printComparison(report);
printClassGaugeCheck(report);
printVerdict(report);
printIntegrity(report);

if (!report.ok) {
  process.exitCode = 1;
}

function printStatus(report) {
  console.log('OctaFirstBirthCarrierBaseV0 diagnostics');
  console.log('');
  console.log(`method: ${report.method}`);
  console.log(`diagnosticScope: ${report.diagnosticScope}`);
  console.log(`generalityStatus: ${report.generalityStatus}`);
  console.log(`decisionContext: ${report.decisionContext}`);
  console.log(`fieldCueUnblockStatus: ${report.fieldCueUnblockStatus}`);
  console.log(`s0Status: ${report.s0Status}`);
  console.log(`uiStatus: ${report.uiStatus}`);
  console.log(`shapeMutationStatus: ${report.shapeMutationStatus}`);
  console.log(`packetWriteStatus: ${report.packetWriteStatus}`);
  console.log(`operationRegistryStatus: ${report.operationRegistryStatus}`);
  console.log(`topologyStatus: ${report.topologyStatus}`);
}

function printReferenceReports(report) {
  console.log('');
  console.log('reference reports (reference-law-only; octa facts never read from them)');

  for (const [label, reference] of Object.entries(report.referenceReports)) {
    console.log(
      `${label}: method=${reference.method} | ok=${reference.ok} | issueCount=${reference.issueCount} | usage=${reference.usage}`,
    );
  }
}

function printGeometry(report) {
  const geometry = report.octaGeometry;

  console.log('');
  console.log('octa geometry (derived from createSeedShape + applyAmboDissection)');
  console.log(
    `vertices=${geometry.vertexCount} | edges=${geometry.edgeCount} | faces=${geometry.faceCount} | centerIsOrigin=${geometry.centerIsOrigin}`,
  );
  console.log(
    `core topology=${geometry.coreCellTopology} | children=${geometry.childCount} | core triangles=${geometry.coreTriangleCount} | core squares=${geometry.coreSquareCount} | antipodal child pairs=${geometry.antipodalChildPairCount}`,
  );
}

function printAssignment(report) {
  const assignment = report.primalCarrierAssignment;

  console.log('');
  console.log('octa primal carrier assignment');
  console.log(`assignmentPolicyId: ${assignment.assignmentPolicyId}`);
  console.log(`derivedFromFeature: ${assignment.derivedFromFeature}`);
  console.log(`justification: ${assignment.justification}`);
  console.log(`frameDeterminant: ${assignment.frameDeterminant}`);
  console.log(`orientedFanoLine: (${assignment.orientedFanoLine.join(', ')})`);

  for (const axis of assignment.axes) {
    console.log(
      `axis ${axis.axisIndex}: +pole=${axis.positivePoleVertexId} (${axis.positivePolePosition.join(',')}) -> +${axis.assignedUnit}; -pole=${axis.negativePoleVertexId} -> -${axis.assignedUnit} | poleSelection=${axis.poleSelection}`,
    );
  }

  console.log(
    `lineClosureSelfCheck: carrier(p1)*carrier(p2)=${assignment.lineClosureSelfCheck.product}, expected carrier(p3)=${assignment.lineClosureSelfCheck.expected} -> ${assignment.lineClosureSelfCheck.status}`,
  );
  console.log(
    `tetra distinctness: octa unit set [${assignment.tetraQuadrangleDistinctness.octaUnitSet.join(', ')}] | isFanoLine=${assignment.tetraQuadrangleDistinctness.unitSetIsFanoLine} | tetra quadrangle [${assignment.tetraQuadrangleDistinctness.tetraQuadrangleSet.join(', ')}] | distinct=${assignment.tetraQuadrangleDistinctness.distinctFromTetraAssignment}`,
  );
}

function printOrientationPolicy(report) {
  const policy = report.orientationPolicy;

  console.log('');
  console.log('octa edge orientation policy');
  console.log(`orientationPolicyId: ${policy.orientationPolicyId}`);
  console.log(`derivedFromFeature: ${policy.derivedFromFeature}`);
  console.log(`justification: ${policy.justification}`);
  console.log(`lexicographicSortingUsed: ${policy.lexicographicSortingUsed}`);
  console.log(
    `face classes: positive=${policy.positiveClassFaceCount} negative=${policy.negativeClassFaceCount} | classesEdgeDisjoint=${policy.classesEdgeDisjoint} | everyEdgeBoundsOneFacePerClass=${policy.everyEdgeBoundsOneFacePerClass}`,
  );

  for (const record of policy.faceClassRecords) {
    console.log(
      `  face ${record.faceId} | class=${record.faceClass} | signProduct=${record.signProduct} | outwardCycle=${record.outwardCycle.join(' -> ')}`,
    );
  }

  console.log('edge orientation rows (canonical direction from positive-class face boundary)');

  for (const row of policy.edgeOrientationRows) {
    console.log(
      `  ${row.edgeId}: ${row.fromVertexId} -> ${row.toVertexId} | orienting face=${row.orientingFaceId} (positive class) | negative-class face=${row.negativeClassFaceId} induces reverse=${row.negativeClassInducesReverse}`,
    );
  }
}

function printLifts(report) {
  console.log('');
  console.log(`edge-child signed lifts (${report.edgeChildLiftRows.length})`);

  for (const row of report.edgeChildLiftRows) {
    console.log(
      `${row.childVertexId} | edge=${row.edgeId} | ${row.fromVertexId}(${row.fromCarrier}) -> ${row.toVertexId}(${row.toCarrier}) | lift=${row.recomputedSignedLift} | reverse=${row.reverseOrderLift} (oppositeSign=${row.reverseIsOppositeSign}) | genealogy/midpoint=${row.genealogyMatchesMidpointPosition}`,
    );
  }
}

function printTriangles(report) {
  console.log('');
  console.log(`triangle closure relations (${report.triangleClosureRelations.length})`);

  for (const relation of report.triangleClosureRelations) {
    console.log(
      `${relation.coreFaceId} | sourceOctaFace=${relation.sourceOctaFaceId} | products ${relation.passCount}/${relation.rowCount} close up to sign`,
    );

    const sample = relation.productRows[0];

    if (sample) {
      console.log(
        `  sample: lift(${sample.leftChildId}) * lift(${sample.rightChildId}) = ${sample.recomputedProduct} vs third ${sample.thirdChildLift} -> ${sample.closureUpToSignStatus}`,
      );
    }
  }
}

function printSquares(report) {
  console.log('');
  console.log(`square holonomy relations (${report.squareHolonomyRelations.length})`);

  for (const relation of report.squareHolonomyRelations) {
    console.log(
      `${relation.coreFaceId} | sourceOctaVertex=${relation.sourceOctaVertexId} | variants ${relation.passCount}/${relation.rowCount} equal '+1'`,
    );
    console.log(`  outward cycle: ${relation.outwardChildCycle.join(' -> ')}`);

    for (const variant of relation.variantRows) {
      console.log(
        `  ${variant.orientationVariant}: left-associated product = ${variant.recomputedLeftAssociatedProduct} -> ${variant.holonomyStatus}`,
      );
    }
  }
}

function printAntipodality(report) {
  console.log('');
  console.log(`signed antipodality pairs (${report.antipodalPairRows.length})`);

  for (const row of report.antipodalPairRows) {
    console.log(
      `${row.pairId} | ${row.leftLift} vs ${row.rightLift} | sameUnit=${row.sameUnit} oppositeSign=${row.oppositeSign} -> ${row.oppositionStatus}`,
    );
  }
}

function printComparison(report) {
  console.log('');
  console.log('comparison to reference law (octa-derived vs reference; compare, never copy)');

  for (const row of report.comparisonToReference) {
    console.log(`${row.relationFamily}:`);
    console.log(`  octa-derived: ${row.octaDerivedSummary}`);
    console.log(`  reference law: ${row.referenceLaw}`);
    console.log(`  reference citation: ${row.referenceCitation}`);
    console.log(`  octaSatisfiesLaw: ${row.octaSatisfiesLaw}`);
  }
}

function printClassGaugeCheck(report) {
  const check = report.classGaugeCheck;

  console.log('');
  console.log('orientation class gauge check (positive vs negative alternation class)');
  console.log(
    `positive class outcomes: closure=${check.positiveClassOutcomes.closureAllPass} holonomy=${check.positiveClassOutcomes.holonomyAllPlusOne} antipodality=${check.positiveClassOutcomes.antipodalityAllOppositeSign}`,
  );
  console.log(
    `negative class outcomes: closure=${check.negativeClassOutcomes.closureAllPass} holonomy=${check.negativeClassOutcomes.holonomyAllPlusOne} antipodality=${check.negativeClassOutcomes.antipodalityAllOppositeSign}`,
  );
  console.log(
    `relationOutcomesInvariantUnderClassGauge: ${check.relationOutcomesInvariantUnderClassGauge}`,
  );
}

function printVerdict(report) {
  console.log('');
  console.log('relation family results');
  console.log(
    `triangle closure: ${report.relationFamilyResults.closurePassCount}/${report.relationFamilyResults.closureRowCount} (allPass=${report.relationFamilyResults.closureAllPass})`,
  );
  console.log(
    `square holonomy: ${report.relationFamilyResults.holonomyPassCount}/${report.relationFamilyResults.holonomyRowCount} (allPlusOne=${report.relationFamilyResults.holonomyAllPlusOne})`,
  );
  console.log(
    `signed antipodality: ${report.relationFamilyResults.antipodalityPassCount}/${report.relationFamilyResults.antipodalityPairCount} (allOppositeSign=${report.relationFamilyResults.antipodalityAllOppositeSign})`,
  );
  console.log('');
  console.log(`reproductionVerdict: ${report.reproductionVerdict}`);
  console.log(`reproductionVerdictDerivation: ${report.reproductionVerdictDerivation}`);
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
