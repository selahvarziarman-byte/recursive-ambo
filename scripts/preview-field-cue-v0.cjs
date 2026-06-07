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
const {
  buildFieldCueV0Report,
} = require(path.join(repoRoot, 'src/lib/fieldCueV0.ts'));

const EXPECTED_CUE_COUNT = 6;
const ALLOWED_RELATION_MATURITIES = new Set([
  'candidate-reference',
  'candidate-relation',
]);
const failures = [];

const report = buildFieldCueV0Report();

validateReport(report);

if (failures.length) {
  console.error('FieldCueV0 preview validation failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  printPreview(report);
}

function validateReport(report) {
  expectEqual(report.ok, true, 'report ok');
  expectEqual(report.cueCount, EXPECTED_CUE_COUNT, 'cue count');
  expectEqual(report.cues.length, EXPECTED_CUE_COUNT, 'cue array count');

  for (const cue of report.cues) {
    expectAtLeast(cue.namingQuestions.length, 1, `${cue.siteId} naming questions`);
    expectEqual(
      cue.semanticStatus,
      'not-semantic-naming',
      `${cue.siteId} semantic status`,
    );
    expectEqual(
      cue.topologyStatus,
      'not-topology-workspace',
      `${cue.siteId} topology status`,
    );
    expectEqual(
      cue.packetWriteStatus,
      'not-packet-writing',
      `${cue.siteId} packet write status`,
    );
    expectEqual(
      cue.shapeMutationStatus,
      'not-shape-mutation',
      `${cue.siteId} shape mutation status`,
    );

    for (const relation of cue.candidateFieldWorldAxis.candidateRelations) {
      if (!ALLOWED_RELATION_MATURITIES.has(relation.relationMaturity)) {
        failures.push(
          `${cue.siteId} relation ${relation.targetId} maturity ${relation.relationMaturity}`,
        );
      }
    }
  }
}

function printPreview(report) {
  console.log('FieldCueV0 preview diagnostic');
  console.log(
    `scope ${shortStatus(report.eventScopeStatus)} | ${shortStatus(
      report.generalityStatus,
    )} | not semantic naming | not topology`,
  );

  for (const cue of report.cues) {
    printCueCard(cue);
  }

  printFooter(report);
}

function printCueCard(cue) {
  const axis = cue.inheritanceAxis;
  const candidateAxis = cue.candidateFieldWorldAxis;
  const topRelations = [...candidateAxis.candidateRelations]
    .sort(compareCandidateRelations)
    .slice(0, 3);
  const quarkPairs = axis.quarkChannelSummaries
    .map((channel) => `${channel.parent60}/${channel.projection30}`)
    .slice(0, 4)
    .join(', ');

  console.log('');
  console.log(
    `== ${cue.siteId} | ${cue.participationStatus} | inheritance ${axis.inheritanceStatus} | ${shortStatus(
      cue.eventScopeStatus,
    )} / ${shortStatus(cue.generalityStatus)}`,
  );
  console.log(
    `birth: edge ${axis.sourceEdgeId ?? 'n/a'} | parents ${formatList(
      axis.parentVertexIds,
    )} | projections ${formatList(axis.projectionVertexIds)} | complement ${
      axis.complementEdgeId ?? 'n/a'
    } | antipode ${axis.antipodalChildSiteId ?? 'n/a'} | role ${
      axis.childRole ?? 'n/a'
    }`,
  );
  console.log(
    `quark: ${axis.quarkChannelSummaries.length} channel(s)${
      quarkPairs ? ` (${quarkPairs})` : ''
    }`,
  );
  console.log(`tuple: ${cue.emittedSourceSignature.tupleSummary}`);
  console.log(
    `source probe: ${cue.emittedSourceSignature.sourceProbeRef ?? 'n/a'}`,
  );
  console.log(
    `degeneracy: ${formatList(axis.degeneracyStatuses, 'none')}`,
  );
  console.log(
    `candidates: feature ${candidateAxis.featureObservationReferenceCount} | candidate route/gate ${candidateAxis.routeGateCandidateReferenceCount} | candidate support/region ${candidateAxis.supportRegionCandidateReferenceCount} | maturity ${formatList(
      candidateAxis.relationMaturityStatuses,
      'none',
    )} | warnings ${formatList(cue.warningStatuses, 'none')}`,
  );

  if (topRelations.length) {
    console.log('top candidate refs:');

    for (const relation of topRelations) {
      console.log(
        `  - ${relation.targetKind} ${shortenId(relation.targetId)} | ${relation.relationKind} | ${relation.relationMaturity} | ${relation.participationStatus} | ratio ${formatNumber(
          relation.sourceContributionRatio,
        )} | rank ${relation.sourceContributionRank ?? 'n/a'} | probe ${formatRelationProbe(
          relation,
        )} | rule ${
          relation.meaningfulContributionRule
        } | reliability ${relation.reliability}`,
      );
    }
  } else {
    console.log(
      `missing candidate refs: ${formatList(
        candidateAxis.unsupportedCaveats,
        'none',
      )}`,
    );
  }

  console.log(`pressure: ${cue.fieldPressureSummary}`);
  console.log(
    `naming: ${cue.namingQuestions.slice(0, 3).map((question, index) => `${index + 1}. ${question}`).join(' | ')}`,
  );
  console.log(`warnings: ${formatList(cue.warnings, 'none')}`);
  console.log(
    `forbidden: no naming; candidate evidence is not mature participation; no topology; no packet writes; no general field claim`,
  );
}

function printFooter(report) {
  const candidateCounts = report.summary.candidateReferenceCountsByKind;

  console.log('');
  console.log('FieldCueV0 report footer');
  console.log(
    `ok ${report.ok} | issues ${report.issueCount} | cues ${report.cueCount}`,
  );
  console.log(
    `participation: ${formatCountRecord(report.summary.participationStatusCounts)}`,
  );
  console.log(
    `candidate refs: feature ${candidateCounts['feature-observation']} | candidate route/gate ${candidateCounts['route-gate-candidate']} | candidate support/region ${candidateCounts['support-region-candidate']}`,
  );
  console.log(
    `degenerate ${report.summary.degeneracyCount} | sensitive ${report.summary.sensitiveCueCount} | saturated ${report.summary.saturatedCueCount} | misleading-risk ${report.summary.misleadingRiskCueCount}`,
  );
}

function compareCandidateRelations(left, right) {
  const maturityDelta =
    relationMaturityRank(right.relationMaturity) -
    relationMaturityRank(left.relationMaturity);

  if (maturityDelta !== 0) {
    return maturityDelta;
  }

  const ratioDelta =
    (right.sourceContributionRatio ?? 0) - (left.sourceContributionRatio ?? 0);

  if (ratioDelta !== 0) {
    return ratioDelta;
  }

  return (left.sourceContributionRank ?? 999) - (right.sourceContributionRank ?? 999);
}

function relationMaturityRank(maturity) {
  return maturity === 'candidate-relation' ? 2 : 1;
}

function formatList(values, emptyLabel = 'n/a') {
  return values && values.length ? values.join(', ') : emptyLabel;
}

function formatCountRecord(counts) {
  return Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `${status}=${count}`)
    .join(', ') || 'none';
}

function formatNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Number.parseFloat(value.toFixed(4)).toString()
    : 'n/a';
}

function formatRelationProbe(relation) {
  if (relation.probeRef) {
    return relation.probeRef;
  }

  return relation.sampleProbeRefs?.[0]
    ? `sample-fallback:${relation.sampleProbeRefs[0]}`
    : 'n/a';
}

function shortenId(id) {
  if (id.length <= 34) {
    return id;
  }

  return `${id.slice(0, 18)}...${id.slice(-12)}`;
}

function shortStatus(status) {
  return String(status)
    .replace('one-ambo-tetrahedron-proving-event', 'one-Ambo event')
    .replace('not-general-field-layer', 'not-general')
    .replace('event-bound-profile-aware-prototype', 'event-bound');
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${expected}, got ${actual}`);
  }
}

function expectAtLeast(actual, expectedMinimum, label) {
  if (actual < expectedMinimum) {
    failures.push(`${label}: expected at least ${expectedMinimum}, got ${actual}`);
  }
}
