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
const diagnosticSourcePath = path.join(
  repoRoot,
  'src/lib/structuredSourceStateMultiProjectionStructuralChannelV0.ts',
);
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const {
  buildStructuredSourceStateMultiProjectionStructuralChannelV0Report,
} = require(diagnosticSourcePath);

const failures = [];
const report = buildStructuredSourceStateMultiProjectionStructuralChannelV0Report();
const diagnosticSource = fs.readFileSync(diagnosticSourcePath, 'utf8');
const registrySource = fs.readFileSync(registryPath, 'utf8');

runAssertions(report, {
  diagnosticSource,
  registrySource,
});
printCompactReport(report);

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

function runAssertions(report, sources) {
  expectEqual(report.ok, true, 'report ok means diagnostic integrity only');
  expectEqual(
    report.diagnosticIntegrityStatus,
    'pass',
    'diagnostic integrity status',
  );
  expectEqual(
    report.method,
    'structured-source-state-multi-projection-structural-channel-v0',
    'method',
  );
  expectEqual(
    report.diagnosticScope,
    'multi-projection-structural-channel-diagnostic-only',
    'diagnostic scope',
  );
  expectEqual(report.parentGate, 'Gate C.4L-D3', 'parent gate');
  expectEqual(report.upstreamDesignGate, 'Gate C.4L-D2', 'upstream design gate');
  expectEqual(
    report.upstreamComparisonGate,
    'Gate C.4L-D1',
    'upstream comparison gate',
  );
  expectEqual(report.upstreamFailureGate, 'Gate C.4', 'upstream failure gate');
  expectEqual(
    report.sourceStateRegimeId,
    'structured-source-state-antipodal-covariant-v0',
    'source-state regime',
  );
  expectEqual(
    report.projectionModelId,
    'multi-projection-source-state-v0',
    'projection model id',
  );
  expectEqual(
    report.candidateLawId,
    'c4l-s2-structural-carrier-split-v0',
    'candidate law id',
  );
  expectEqual(report.semanticStatus, 'not-semantic-naming', 'semantic status');
  expectEqual(report.topologyStatus, 'not-topology-workspace', 'topology status');
  expectEqual(report.packetWriteStatus, 'not-packet-writing', 'packet write status');
  expectEqual(report.shapeMutationStatus, 'not-shape-mutation', 'shape mutation status');
  expectEqual(
    report.operationRegistryStatus,
    'not-operation-registry-work',
    'operation registry status',
  );
  expectEqual(report.uiExposureStatus, 'not-ui-work', 'UI exposure status');

  expectEqual(
    report.generatedChildProjections.length,
    6,
    'generated child projection count',
  );
  expectEqual(
    report.propagationProjections.length,
    6,
    'propagation projection count',
  );
  expectEqual(
    report.structuralProjections.length,
    6,
    'structural projection count',
  );

  for (const projection of report.generatedChildProjections) {
    expectTruthy(
      projection.propagationProjection,
      `${projection.sourceStateId} propagation projection exists`,
    );
    expectTruthy(
      projection.structuralProjection,
      `${projection.sourceStateId} structural projection exists`,
    );
    expectEqual(
      projection.propagationProjection.projectionKind,
      'propagation-projection',
      `${projection.sourceStateId} propagation projection kind`,
    );
    expectEqual(
      projection.structuralProjection.projectionKind,
      'structural-projection',
      `${projection.sourceStateId} structural projection kind`,
    );
  }

  expectEqual(
    report.structuralOperations.complementPairs.length,
    3,
    'complement pair count',
  );
  expectEqual(
    report.structuralOperations.structuralComparisonBasis,
    'declared-structural-projection-comparison-v0',
    'structural comparison basis',
  );
  expectEqual(
    report.structuralOperations.recoveryBasis,
    'structural-channel-direct-comparison-v0',
    'recovery basis',
  );

  expectEqual(
    report.antipodalRelationVisibilityRows.length,
    3,
    'antipodal relation visibility row count',
  );

  for (const row of report.antipodalRelationVisibilityRows) {
    expectEqual(
      row.sourceStateRelation,
      'antipodal-opposition',
      `${row.relationId} source-state relation`,
    );
    expectTruthy(
      row.relationVisibilityStatuses.length > 0,
      `${row.relationId} visibility statuses`,
    );
  }

  expectEqual(
    report.structuralChannelDetectorInputAnonymizationStatus,
    'anonymized',
    'structural-channel detector input anonymization',
  );
  expectEqual(
    report.structuralChannelDetectorInputCleanlinessStatus,
    'clean',
    'structural-channel detector input cleanliness',
  );
  expectEqual(
    exposesSourcePosition(report.structuralChannelDetectorInput),
    false,
    'detector input has no source positions',
  );
  expectEqual(
    exposesProbePosition(report.structuralChannelDetectorInput),
    false,
    'detector input has no probe positions',
  );
  expectEqual(
    exposesEmittedTuple(report.structuralChannelDetectorInput),
    false,
    'detector input has no emitted tuple',
  );
  expectEqual(
    exposesLabel(report.structuralChannelDetectorInput),
    false,
    'detector input has no labels',
  );
  expectEqual(
    exposesHiddenTruth(report.structuralChannelDetectorInput),
    false,
    'detector input has no hidden truth',
  );
  expectEqual(
    exposesAxisPair(report.structuralChannelDetectorInput),
    false,
    'detector input has no axis pair',
  );

  expectEqual(
    report.structuralChannelDetectorInput.anonymousSourceIds.every((sourceId) =>
      /^S\d+$/.test(sourceId),
    ),
    true,
    'detector anonymous source ids',
  );
  expectEqual(
    report.structuralChannelDetectorInput.structuralSamples.every((sample) =>
      /^Q\d+$/.test(sample.anonymousStructuralSampleId),
    ),
    true,
    'detector anonymous structural sample ids',
  );

  expectEqual(
    report.c4lS2StructuralChannelRecovery.pairScores.length,
    3,
    'structural channel pair score count',
  );
  expectEqual(
    report.c4lS2StructuralChannelRecovery.pairScores.every((score) =>
      Number.isFinite(score.pairScore),
    ),
    true,
    'structural channel finite pair scores',
  );
  expectTruthy(
    ['pass', 'fail', 'ambiguous'].includes(report.recoveryStatus),
    'structural channel recovery status',
  );
  expectTruthy(
    [
      'structural-channel-witness-supported',
      'structural-channel-witness-failed',
      'structural-channel-witness-ambiguous',
    ].includes(report.structuralChannelCandidateStatus),
    'structural channel candidate status',
  );
  expectTruthy(
    ['Gate C.4L-D4', 'Gate C.4L-D3-review', 'Gate C.4L-revise'].includes(
      report.recommendedNextGate,
    ),
    'recommended next gate',
  );

  expectEqual(
    report.boundaryStatus.fieldCueV0Status,
    'blocked',
    'FieldCueV0 remains blocked',
  );
  expectEqual(
    report.boundaryStatus.generatedSiteReadingV0Status,
    'blocked',
    'GeneratedSiteReadingV0 remains blocked',
  );
  expectEqual(
    report.boundaryStatus.gateC5Status,
    'not-authorized-by-this-diagnostic',
    'Gate C.5 status',
  );
  expectEqual(
    report.boundaryStatus.reductionLawAdoptionStatus,
    'not-adopted',
    'reduction law adoption status',
  );
  expectEqual(
    report.boundaryStatus.fieldAtlasMutationStatus,
    'not-mutated',
    'field atlas mutation status',
  );
  expectEqual(
    report.boundaryStatus.fieldAtlasSourcePolicyMutationStatus,
    'not-mutated',
    'field atlas source policy mutation status',
  );
  expectEqual(
    report.boundaryStatus.operationRegistryStatus,
    'not-operation-registry-work',
    'boundary operation registry status',
  );
  expectEqual(report.integrityIssueCount, 0, 'integrity issue count');

  expectEqual(
    /from\s+['"].*fieldCueV0|require\([^)]*fieldCueV0/i.test(
      sources.diagnosticSource,
    ),
    false,
    'diagnostic source does not import FieldCueV0',
  );
  expectEqual(
    /from\s+['"].*generatedSiteReadingV0|require\([^)]*generatedSiteReadingV0/i.test(
      sources.diagnosticSource,
    ),
    false,
    'diagnostic source does not import GeneratedSiteReadingV0',
  );
  expectEqual(
    Object.keys(require.cache).some((modulePath) =>
      /fieldCueV0|generatedSiteReadingV0/i.test(modulePath),
    ),
    false,
    'diagnostic runtime did not load FieldCueV0 or GeneratedSiteReadingV0',
  );
  expectEqual(
    /multi[-_ ]?projection[-_ ]?structural[-_ ]?channel|c4l[-_ ]?d3|structuredSourceStateMultiProjectionStructuralChannel/i.test(
      sources.registrySource,
    ),
    false,
    'operation registry has no multi-projection structural-channel operation',
  );
}

function printCompactReport(report) {
  console.log('StructuredSourceStateMultiProjectionStructuralChannelV0 diagnostics');
  console.log(`parent gate: ${report.parentGate}`);
  console.log(`upstream design gate: ${report.upstreamDesignGate}`);
  console.log(`upstream comparison gate: ${report.upstreamComparisonGate}`);
  console.log(`projectionModelId: ${report.projectionModelId}`);
  console.log(`candidateLawId: ${report.candidateLawId}`);
  console.log(`diagnosticIntegrityStatus: ${report.diagnosticIntegrityStatus}`);
  console.log('');

  console.log('projection model');
  console.log(
    `generated child projection count: ${report.generatedChildProjections.length}`,
  );
  console.log(`propagation projection count: ${report.propagationProjections.length}`);
  console.log(`structural projection count: ${report.structuralProjections.length}`);
  console.log(`relation visibility count: ${report.antipodalRelationVisibilityRows.length}`);
  console.log('');

  console.log('structural channel recovery');
  console.log(
    `status: ${report.recoveryStatus} | recovered ${report.recoveredTruthPairCount}/3 | false positives ${report.falsePositiveCount} | ambiguity ${report.ambiguityCount} | confidence ${formatNumber(
      report.c4lS2StructuralChannelRecovery.confidence,
    )}`,
  );
  console.log(`structuralChannelCandidateStatus: ${report.structuralChannelCandidateStatus}`);
  console.log(`recommendedNextGate: ${report.recommendedNextGate}`);
  console.log('');

  console.log('boundary status');
  console.log(`FieldCueV0 status: ${report.boundaryStatus.fieldCueV0Status}`);
  console.log(
    `GeneratedSiteReadingV0 status: ${report.boundaryStatus.generatedSiteReadingV0Status}`,
  );
  console.log(`Gate C.5 status: ${report.boundaryStatus.gateC5Status}`);
  console.log(
    `reduction law adoption status: ${report.boundaryStatus.reductionLawAdoptionStatus}`,
  );
  console.log(
    `field atlas mutation status: ${report.boundaryStatus.fieldAtlasMutationStatus}`,
  );
  console.log(
    `field atlas source policy mutation status: ${report.boundaryStatus.fieldAtlasSourcePolicyMutationStatus}`,
  );
  console.log(`operation registry status: ${report.boundaryStatus.operationRegistryStatus}`);
  console.log(`integrity issue count: ${report.integrityIssueCount}`);
}

function exposesSourcePosition(input) {
  return objectHasKeyMatching(input, /sourcePosition|position/i);
}

function exposesProbePosition(input) {
  return objectHasKeyMatching(input, /probePosition|samplePosition/i);
}

function exposesEmittedTuple(input) {
  return objectHasKeyMatching(input, /emittedTuple|waveNumber|attenuation|amplitude/i);
}

function exposesLabel(input) {
  return objectHasKeyMatching(input, /label|edgeStateId|childSiteId|complement/i);
}

function exposesHiddenTruth(input) {
  return objectHasKeyMatching(input, /hidden|truth|antipodal/i);
}

function exposesAxisPair(input) {
  return objectHasKeyMatching(input, /axisPair|axisId|axis:/i);
}

function objectHasKeyMatching(value, pattern) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((child) => objectHasKeyMatching(child, pattern));
  }

  return Object.entries(value).some(
    ([key, child]) => pattern.test(key) || objectHasKeyMatching(child, pattern),
  );
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(
      `${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`,
    );
  }
}

function expectTruthy(value, label) {
  if (!value) {
    failures.push(`${label}: expected truthy value`);
  }
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toFixed(6) : String(value);
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}
