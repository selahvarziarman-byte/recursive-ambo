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
const { registeredOperations } = require(path.join(
  repoRoot,
  'src/operations/registry.ts',
));

const EXPECTED_SITE_IDS = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const FIELD_CUE_METHOD = 'field-cue-v0-diagnostic';
const FIELD_CUE_SCOPE = 'field-cue-v0-one-ambo-tetrahedron-only';
const FIELD_CUE_POLICY_ID = 'field-cue-v0-one-ambo-tetrahedron';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const ALLOWED_RELATION_MATURITIES = new Set([
  'candidate-reference',
  'candidate-relation',
]);
const FORBIDDEN_CLAIM_KEYS = [
  'confirmedGate',
  'confirmedRoute',
  'confirmedLoop',
  'confirmedVortex',
  'confirmedRegion',
  'confirmedPhaseTransformationEcology',
  'fieldSemanticRoleProfile',
  'matureFieldParticipation',
  'matureFieldCueRelation',
];
const failures = [];

console.log('FieldCueV0 diagnostics');

const report = buildFieldCueV0Report();

runReportBoundaryDiagnostic(report);
runCueCoverageDiagnostic(report);
runCueBoundaryDiagnostic(report);
runInheritanceDiagnostic(report);
runEmittedSourceDiagnostic(report);
runCandidateMaturityDiagnostic(report);
runMutationAndRegistryDiagnostic(report);
runNamingPressureDiagnostic(report);
runCoherenceDiagnostic(report);
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
  console.log('Diagnostics passed.');
}

function runReportBoundaryDiagnostic(report) {
  expectEqual(report.method, FIELD_CUE_METHOD, 'report method');
  expectEqual(report.diagnosticScope, FIELD_CUE_SCOPE, 'report scope');
  expectEqual(report.fieldCuePolicyId, FIELD_CUE_POLICY_ID, 'field cue policy');
  expectEqual(
    report.eventScopeStatus,
    'one-ambo-tetrahedron-proving-event',
    'report event scope',
  );
  expectEqual(
    report.fieldLayerStatus,
    'event-bound-profile-aware-prototype',
    'report field layer status',
  );
  expectEqual(
    report.generalityStatus,
    'not-general-field-layer',
    'report generality',
  );
  expectEqual(report.portabilityStatus, 'untested', 'report portability');
  expectEqual(report.sourcePolicyId, SOURCE_POLICY_ID, 'report source policy id');
  expectEqual(
    report.sourcePolicyStatus,
    'policy-relative',
    'report source policy status',
  );
  expectEqual(
    report.semanticStatus,
    'not-semantic-naming',
    'report semantic status',
  );
  expectEqual(
    report.topologyStatus,
    'not-topology-workspace',
    'report topology status',
  );
  expectEqual(
    report.packetWriteStatus,
    'not-packet-writing',
    'report packet write status',
  );
  expectEqual(
    report.shapeMutationStatus,
    'not-shape-mutation',
    'report shape mutation status',
  );
  expectEqual(report.provingEventOperation, 'ambo-dissection', 'event operation');
  expectEqual(report.provingEventGenerationDepth, 1, 'event generation depth');

  console.log('report boundary: PASS');
}

function runCueCoverageDiagnostic(report) {
  expectEqual(report.cueCount, 6, 'cue count');
  expectEqual(report.cues.length, 6, 'cue array count');

  const siteIds = report.cues.map((cue) => cue.siteId).sort();
  expectArrayEqual(siteIds, [...EXPECTED_SITE_IDS].sort(), 'cue site ids');

  console.log('cue coverage: PASS');
}

function runCueBoundaryDiagnostic(report) {
  for (const cue of report.cues) {
    expectEqual(
      cue.eventScopeStatus,
      'one-ambo-tetrahedron-proving-event',
      `${cue.siteId} event scope`,
    );
    expectEqual(
      cue.fieldLayerStatus,
      'event-bound-profile-aware-prototype',
      `${cue.siteId} field layer status`,
    );
    expectEqual(
      cue.generalityStatus,
      'not-general-field-layer',
      `${cue.siteId} generality`,
    );
    expectEqual(cue.portabilityStatus, 'untested', `${cue.siteId} portability`);
    expectEqual(
      cue.sourcePolicyStatus,
      'policy-relative',
      `${cue.siteId} source policy status`,
    );
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
    expectEqual(
      cue.fieldCuePolicyId,
      FIELD_CUE_POLICY_ID,
      `${cue.siteId} field cue policy`,
    );
    expectEqual(
      cue.sourcePolicyId,
      SOURCE_POLICY_ID,
      `${cue.siteId} source policy id`,
    );
    expectEqual(
      cue.siteKind,
      'generated-midpoint-child',
      `${cue.siteId} site kind`,
    );
  }

  console.log('cue boundary flags: PASS');
}

function runInheritanceDiagnostic(report) {
  for (const cue of report.cues) {
    const axis = cue.inheritanceAxis;

    expectTruthy(axis, `${cue.siteId} inheritance axis exists`);
    expectTruthy(axis.sourceEdgeId, `${cue.siteId} source edge`);
    expectEqual(
      axis.parentVertexIds.length,
      2,
      `${cue.siteId} parent vertex count`,
    );
    expectEqual(
      axis.projectionVertexIds.length,
      2,
      `${cue.siteId} projection vertex count`,
    );
    expectTruthy(axis.complementEdgeId, `${cue.siteId} complement edge`);
    expectEqual(
      axis.complementEdgeVertexIds.length,
      2,
      `${cue.siteId} complement vertex count`,
    );
    expectTruthy(
      axis.antipodalChildSiteId,
      `${cue.siteId} antipodal child site`,
    );
    expectEqual(axis.childRole, 'shared-90-pole', `${cue.siteId} child role`);
    expectTruthy(
      axis.inheritanceGrammarId,
      `${cue.siteId} inheritance grammar`,
    );
    expectTruthy(axis.mergeKind, `${cue.siteId} merge kind`);
  }

  console.log('inheritance axis: PASS');
}

function runEmittedSourceDiagnostic(report) {
  for (const cue of report.cues) {
    const signature = cue.emittedSourceSignature;
    const axis = cue.inheritanceAxis;
    const hasEmission = Boolean(signature.emissionTuple);
    const hasExplicitUnsupportedState = [
      'fallback',
      'unresolved',
      'unsupported',
    ].includes(axis.inheritanceStatus);

    expectTruthy(signature, `${cue.siteId} source signature exists`);
    expectTruthy(
      hasEmission || hasExplicitUnsupportedState || !signature.fieldReady,
      `${cue.siteId} emitted source or explicit unsupported state`,
    );
    expectTruthy(signature.tupleSummary, `${cue.siteId} tuple summary`);
    if (typeof signature.sourceProbeRef !== 'undefined') {
      expectEqual(
        typeof signature.sourceProbeRef,
        'string',
        `${cue.siteId} source probe ref type`,
      );
    }
  }

  console.log('emitted source signatures: PASS');
}

function runCandidateMaturityDiagnostic(report) {
  for (const cue of report.cues) {
    expectNoForbiddenClaimKeys(cue, `${cue.siteId} cue`);
    expectNoForbiddenClaimKeys(
      cue.candidateFieldWorldAxis,
      `${cue.siteId} candidate axis`,
    );

    for (const relation of cue.candidateFieldWorldAxis.candidateRelations) {
      expectTruthy(
        ALLOWED_RELATION_MATURITIES.has(relation.relationMaturity),
        `${cue.siteId} relation ${relation.targetId} maturity`,
      );
      if (typeof relation.probeRef !== 'undefined') {
        expectEqual(
          typeof relation.probeRef,
          'string',
          `${cue.siteId} relation ${relation.targetId} probe ref type`,
        );
        expectTruthy(
          ALLOWED_RELATION_MATURITIES.has(relation.relationMaturity),
          `${cue.siteId} relation ${relation.targetId} probe ref does not promote maturity`,
        );
      }
      if (typeof relation.sampleProbeRefs !== 'undefined') {
        expectArrayOfStrings(
          relation.sampleProbeRefs,
          `${cue.siteId} relation ${relation.targetId} sample probe refs`,
        );
      }
      if (typeof relation.chartProbeRefs !== 'undefined') {
        expectArrayOfStrings(
          relation.chartProbeRefs,
          `${cue.siteId} relation ${relation.targetId} chart probe refs`,
        );
      }
      expectTruthy(
        relation.meaningfulContributionRule,
        `${cue.siteId} relation ${relation.targetId} meaningful contribution rule`,
      );
      expectTruthy(
        relation.evidenceBasis.some((entry) =>
          entry.startsWith('contribution-rule:'),
        ),
        `${cue.siteId} relation ${relation.targetId} contribution-rule evidence`,
      );
      expectEqual(
        typeof relation.sourceContributionRatio,
        'number',
        `${cue.siteId} relation ${relation.targetId} source contribution ratio type`,
      );
      if (typeof relation.sourceContributionRatio === 'number') {
        expectTruthy(
          Number.isFinite(relation.sourceContributionRatio),
          `${cue.siteId} relation ${relation.targetId} finite source contribution ratio`,
        );
      }
      if (typeof relation.sourceContributionRank !== 'undefined') {
        expectAtLeast(
          relation.sourceContributionRank,
          1,
          `${cue.siteId} relation ${relation.targetId} source contribution rank`,
        );
      }
      if (typeof relation.sourceContributionBaseline !== 'undefined') {
        expectTruthy(
          relation.sourceContributionBaseline > 0,
          `${cue.siteId} relation ${relation.targetId} source contribution baseline`,
        );
      }
      expectNoForbiddenClaimKeys(
        relation,
        `${cue.siteId} relation ${relation.targetId}`,
      );
      expectIncludes(
        ['feature-observation', 'route-gate-candidate', 'support-region-candidate'],
        relation.targetKind,
        `${cue.siteId} relation target kind`,
      );
      expectTruthy(
        relation.caveats.some((caveat) => caveat.includes('candidate')),
        `${cue.siteId} relation ${relation.targetId} candidate caveat`,
      );
    }
  }

  console.log('candidate maturity boundaries: PASS');
}

function runMutationAndRegistryDiagnostic(report) {
  expectEqual(report.shapeMutationDetected, false, 'no shape mutation detected');
  expectEqual(report.packetWriteDetected, false, 'no packet write detected');
  expectEqual(
    report.operationRegistryStatus,
    'not-operation-registry-work',
    'operation registry status',
  );
  expectEqual(
    registeredOperations.some((operation) => /field[-_ ]?cue/i.test(operation.id)),
    false,
    'operation registry has no field cue operation',
  );

  console.log('mutation/write/registry boundary: PASS');
}

function runNamingPressureDiagnostic(report) {
  for (const cue of report.cues) {
    expectAtLeast(
      cue.namingQuestions.length,
      1,
      `${cue.siteId} naming questions`,
    );
    expectEqual(
      cue.namingPressure.semanticStatus,
      'not-semantic-naming',
      `${cue.siteId} naming semantic status`,
    );
    expectAtLeast(
      cue.forbiddenConclusions.length,
      1,
      `${cue.siteId} forbidden conclusions`,
    );
  }

  console.log('naming pressure: PASS');
}

function runCoherenceDiagnostic(report) {
  expectEqual(report.issueCount, report.issues.length, 'issue count coherence');
  expectEqual(report.summary.cueCount, report.cueCount, 'summary cue count');
  expectEqual(report.ok, report.issueCount === 0, 'ok coherence');

  const countedStatuses = report.cues.reduce((count, cue) => {
    count[cue.participationStatus] = (count[cue.participationStatus] ?? 0) + 1;
    return count;
  }, {});

  for (const [status, count] of Object.entries(countedStatuses)) {
    expectEqual(
      report.summary.participationStatusCounts[status],
      count,
      `summary participation ${status}`,
    );
  }

  console.log('report coherence: PASS');
}

function printCompactSummary(report) {
  const candidateCounts = report.summary.candidateReferenceCountsByKind;

  console.log('');
  console.log('FieldCueV0 compact summary');
  console.log(`cue count: ${report.cueCount}`);
  console.log(
    `participation status counts: ${formatCounts(
      report.summary.participationStatusCounts,
    )}`,
  );
  console.log(`degeneracy count: ${report.summary.degeneracyCount}`);
  console.log(
    `candidate references: feature=${candidateCounts['feature-observation']}, route/gate=${candidateCounts['route-gate-candidate']}, support/region=${candidateCounts['support-region-candidate']}`,
  );
  console.log(
    `sensitive/saturated/misleading-risk: ${report.summary.sensitiveCueCount}/${report.summary.saturatedCueCount}/${report.summary.misleadingRiskCueCount}`,
  );
  console.log(`ok / issue count: ${report.ok} / ${report.issueCount}`);
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`);
  }
}

function expectTruthy(value, label) {
  if (!value) {
    failures.push(`${label}: expected truthy value, got ${formatValue(value)}`);
  }
}

function expectAtLeast(actual, expectedMinimum, label) {
  if (actual < expectedMinimum) {
    failures.push(
      `${label}: expected at least ${expectedMinimum}, got ${formatValue(actual)}`,
    );
  }
}

function expectIncludes(values, expected, label) {
  if (!values.includes(expected)) {
    failures.push(`${label}: expected ${formatValue(expected)} in ${formatValue(values)}`);
  }
}

function expectArrayEqual(actual, expected, label) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  if (actualJson !== expectedJson) {
    failures.push(`${label}: expected ${expectedJson}, got ${actualJson}`);
  }
}

function expectArrayOfStrings(actual, label) {
  if (!Array.isArray(actual)) {
    failures.push(`${label}: expected array, got ${formatValue(actual)}`);
    return;
  }

  for (const value of actual) {
    if (typeof value !== 'string') {
      failures.push(`${label}: expected string entries, got ${formatValue(value)}`);
    }
  }
}

function expectNoForbiddenClaimKeys(value, label) {
  for (const key of FORBIDDEN_CLAIM_KEYS) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      failures.push(`${label}: forbidden claim key ${key}`);
    }
  }
}

function formatCounts(counts) {
  return Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => `${key}=${count}`)
    .join(', ') || 'none';
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}
