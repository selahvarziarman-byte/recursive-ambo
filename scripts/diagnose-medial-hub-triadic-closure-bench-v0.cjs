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
const reportPath = path.join(repoRoot, 'src/lib/medialHubTriadicClosureBenchV0.ts');
const { buildMedialHubTriadicClosureBenchV0Report } = require(reportPath);

const report = buildMedialHubTriadicClosureBenchV0Report();

printHeader(report);
printPart0(report);
printPart1(report);
printPart2(report);
printPart3(report);
printPart4(report);
printPart5(report);
printIntegrity(report);

if (!report.ok) {
  process.exitCode = 1;
}

function vec(v) {
  return `(${v.map((x) => Number(x.toFixed(4))).join(', ')})`;
}

function counts(rows) {
  return rows.map((row) => `${row.value} x${row.count}`).join(', ');
}

function printHeader(report) {
  console.log('MedialHubTriadicClosureBenchV0 diagnostics (Station III, Bench 2)');
  console.log('');
  console.log(`method: ${report.method}`);
  console.log(`diagnosticScope: ${report.diagnosticScope}`);
  console.log(`verdictStatus: ${report.verdictStatus}`);
  console.log(`fieldCueUnblockStatus: ${report.fieldCueUnblockStatus}`);
  console.log(`s0Status: ${report.s0Status}`);
  console.log(`uiStatus: ${report.uiStatus}`);
  console.log(`shapeMutationStatus: ${report.shapeMutationStatus}`);
  console.log(`packetWriteStatus: ${report.packetWriteStatus}`);
  console.log(`operationRegistryStatus: ${report.operationRegistryStatus}`);
  console.log(`topologyStatus: ${report.topologyStatus}`);
  console.log('');
  console.log('cross-checked reports');

  for (const [label, entry] of Object.entries(report.crossCheckedReports)) {
    console.log(`${label}: method=${entry.method} | ok=${entry.ok} | usage=${entry.usage}`);
  }
}

function printPart0(report) {
  const part = report.part0;

  console.log('');
  console.log('=== PART 0: two carrier resolutions ===');
  console.log('');
  console.log(
    `R6 base (re-derived; Branch A pipeline duplicated): ${part.r6Rows.length} children, ${part.r6DistinctLiftCount} distinct signed lifts, cross-check agreement ${part.r6CrossCheckAgreementCount}/${part.r6Rows.length}`,
  );

  for (const row of part.r6Rows) {
    console.log(
      `  ${row.childId} | edge=${row.edgeId} | ${row.fromVertexId} -> ${row.toVertexId} | lift=${row.signedLift} | reuse partner=${row.reusePartnerChildId} | branch-A cross-check=${row.crossCheckAgainstBranchA}`,
    );
  }

  console.log('');
  console.log(`index recovery (octa route): ${part.indexRecoveryStatement}`);
  console.log('');
  console.log('the four indices (antipodal octa-face pairs / hexagonal great circles)');

  for (const pair of part.facePairs) {
    console.log(
      `  index ${pair.pairIndex}: positive-class face=${pair.positiveClassFaceId} | negative-class face=${pair.negativeClassFaceId} | plane normal=${vec(pair.normal)} | hexagon members=${pair.hexagonChildIds.length}`,
    );
  }

  console.log('');
  console.log(
    `R12 base (root-level-resolved): ${part.r12Rows.length} carriers, ${part.r12DistinctRootIdentityCount} distinct ordered root identities, ${part.r12DistinctLiftValueCount} distinct signed lift values, canonical quadrangle=(${part.r12CanonicalQuadrangle.join(', ')})`,
  );

  for (const row of part.r12Rows) {
    console.log(
      `  ${row.childId} | root=${row.orderedRootIdentity} | lift=${row.signedLift} | antipode=${row.antipodalChildId} (root negated=${row.antipodalRootIsNegation})`,
    );
  }
}

function printPart1(report) {
  const part = report.part1;

  console.log('');
  console.log('=== PART 1: algebraic face - triadic closure on the four hexagons ===');
  console.log('');
  console.log(`triad selection rule (pre-registered): ${part.triadSelectionRule}`);
  console.log(`bracketing (pre-registered): ${part.bracketing}`);
  console.log('');
  console.log('octa triads (canonical labeling; additive and multiplicative kept distinct)');

  for (const triad of part.octaTriads) {
    console.log(
      `  ${triad.triadId} [${triad.memberChildIds.join(', ')}]`,
    );
    console.log(
      `    additive position sum = ${vec(triad.additivePositionSum)} (|sum|=${triad.additivePositionSumMagnitude}) | (a*b)*c under R6 = ${triad.productR6} | under R12 = ${triad.productR12}`,
    );
  }

  console.log('');
  console.log(
    `R12 gauge sweep ${part.r12GaugeSweep.sweepId}: ${part.r12GaugeSweep.labelingCount} labelings (valid=${part.r12GaugeSweep.validLabelingCount}, invalid=${part.r12GaugeSweep.invalidLabelingCount})`,
  );

  for (const distribution of part.r12GaugeSweep.triadProductDistributions) {
    console.log(`  ${distribution.label}: ${counts(distribution.counts)}`);
  }

  console.log(
    `  antipodal sign relations across sweep: ${counts(part.r12GaugeSweep.antipodalSignRelationCounts)}`,
  );
  console.log(
    `  square holonomy values across sweep: ${counts(part.r12GaugeSweep.squareHolonomyValueCounts)}`,
  );
  console.log('');
  console.log(
    `R6 gauge sweep ${part.r6GaugeSweep.sweepId}: ${part.r6GaugeSweep.labelingCount} labelings (valid=${part.r6GaugeSweep.validLabelingCount}, invalid=${part.r6GaugeSweep.invalidLabelingCount}; validity = derived line-closure self-check)`,
  );

  for (const distribution of part.r6GaugeSweep.triadProductDistributions) {
    console.log(`  ${distribution.label}: ${counts(distribution.counts)}`);
  }

  console.log(
    `  antipodal sign relations across valid labelings: ${counts(part.r6GaugeSweep.antipodalSignRelationCounts)}`,
  );
  console.log(
    `  square holonomy values across valid labelings: ${counts(part.r6GaugeSweep.squareHolonomyValueCounts)}`,
  );
  console.log('');
  console.log('Bench-1 accumulation (per hexagon antipodal pairs) - R6');

  for (const row of part.bench1AccumulationR6) {
    console.log(
      `  hexagon ${row.hexagonIndex} | ${row.pairId} | ${row.leftLift} vs ${row.rightLift} -> ${row.signRelation}`,
    );
  }

  console.log('');
  console.log('Bench-1 accumulation (per hexagon antipodal pairs) - R12');

  for (const row of part.bench1AccumulationR12) {
    console.log(
      `  hexagon ${row.hexagonIndex} | ${row.pairId} | ${row.leftLift} vs ${row.rightLift} -> ${row.signRelation}`,
    );
  }
}

function printPart2(report) {
  const part = report.part2;

  console.log('');
  console.log('=== PART 2: metric face - carrier-derived spatial anchors ===');
  console.log('');
  console.log(`R12 projection chain: ${part.projectionChainR12}`);
  console.log(`R6 projection chain: ${part.projectionChainR6}`);
  console.log('');
  console.log('R12 anchors');

  for (const row of part.r12Anchors) {
    console.log(`  ${row.id}: anchor=${vec(row.anchor)} | ${row.chain}`);
  }

  console.log('');
  console.log('R6 anchors');

  for (const row of part.r6Anchors) {
    console.log(`  ${row.id}: anchor=${vec(row.anchor)} | ${row.chain}`);
  }

  console.log('');
  printMetrics(part.r12Metrics);
  console.log('');
  printMetrics(part.r6Metrics);
}

function printMetrics(metrics) {
  console.log(`${metrics.metricsId}`);
  console.log(
    `  anchors=${metrics.anchorCount} | distinct=${metrics.distinctAnchorCount} | collision groups=${JSON.stringify(metrics.collisionGroups)}`,
  );
  console.log(
    `  distinct radii=[${metrics.distinctRadii.join(', ')}] | edge length=${metrics.edgeLength} | adjacent pairs=${metrics.adjacentPairCount}`,
  );
  console.log(
    `  distinct adjacency angles (deg)=[${metrics.distinctAdjacencyAngitudesDegrees.join(', ')}] | distinct edge/radius=[${metrics.distinctEdgeOverRadiusRatios.join(', ')}]`,
  );
  console.log(
    `  central plane census: ${metrics.centralPlaneCensus
      .map((entry) => `${entry.memberCount}-anchor planes x${entry.planeCount}`)
      .join(', ')}`,
  );
}

function printCorrespondence(rows) {
  for (const row of rows) {
    console.log(`  ${row.correspondenceId}:`);
    console.log(
      `    carrier members=[${row.carrierMemberIds.join(', ')}]`,
    );
    console.log(
      `    anchor image distinct=${row.anchorImageDistinctCount} | coplanar through origin=${row.anchorsCoplanarThroughOrigin} | anchor great circle identified=${row.anchorGreatCircleIdentified}`,
    );
    console.log(
      `    in-hexagon adjacency angles (deg)=[${row.inHexagonDistinctAdjacencyAnglesDegrees.join(', ')}] | in-hexagon edge/radius=[${row.inHexagonDistinctEdgeOverRadiusRatios.join(', ')}]`,
    );
    console.log(
      `    triad anchor |sums|=[${row.triadAnchorSumMagnitudes.join(', ')}] | algebraic triad products=[${row.algebraicTriadProducts.join(', ')}]`,
    );
  }
}

function printPart3(report) {
  console.log('');
  console.log('=== PART 3: survival across the projection ===');
  console.log('');
  console.log('R12 correspondence (per hexagon)');
  printCorrespondence(report.part3.r12Correspondence);
  console.log('');
  console.log('R6 correspondence (per hexagon)');
  printCorrespondence(report.part3.r6Correspondence);
}

function printPart4(report) {
  const part = report.part4;

  console.log('');
  console.log('=== PART 4: tetra-hub control (Parts 1-3 unchanged on the tetra route) ===');
  console.log('');
  console.log(
    `control lift cross-check vs hub capsule: ${part.controlLiftCrossCheckAgreementCount}/12 agree (re-derived from disc.primalCarrierAssignment atoms)`,
  );
  console.log('');
  console.log('control triads (canonical labeling)');

  for (const triad of part.controlTriads) {
    console.log(`  ${triad.triadId} [${triad.memberFlagIds.join(', ')}]`);
    console.log(
      `    additive root sum = (${triad.additiveRootSum.join(', ')}) (|sum|=${triad.additiveRootSumMagnitude}) | (a*b)*c = ${triad.product}`,
    );
  }

  console.log('');
  console.log(
    `control gauge sweep ${part.controlGaugeSweep.sweepId}: ${part.controlGaugeSweep.labelingCount} labelings`,
  );

  for (const distribution of part.controlGaugeSweep.triadProductDistributions) {
    console.log(`  ${distribution.label}: ${counts(distribution.counts)}`);
  }

  console.log(
    `  antipodal sign relations across sweep: ${counts(part.controlGaugeSweep.antipodalSignRelationCounts)}`,
  );
  console.log('');
  console.log('control antipodal pairs (per hexagon; canonical labeling)');

  for (const row of part.controlAntipodalPairs) {
    console.log(
      `  hexagon ${row.hexagonIndex} | ${row.pairId} | ${row.leftLift} vs ${row.rightLift} -> ${row.signRelation}`,
    );
  }

  console.log('');
  console.log(`control projection chain: ${part.projectionChainControl}`);
  console.log('');
  console.log('control anchors');

  for (const row of part.controlAnchors) {
    console.log(`  ${row.id}: anchor=${vec(row.anchor)}`);
  }

  console.log('');
  printMetrics(part.controlMetrics);
  console.log('');
  console.log('control correspondence (per hexagon)');
  printCorrespondence(part.controlCorrespondence);
}

function printPart5(report) {
  console.log('');
  console.log('=== PART 5: anomaly ledger (derivation status left empty for the auditor) ===');

  for (const row of report.part5) {
    console.log('');
    console.log(`${row.ledgerId} [${row.context}]`);
    console.log(`  measurement: ${row.measurement}`);
    console.log(`  derivationStatus: '${row.derivationStatus}'`);
  }
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
