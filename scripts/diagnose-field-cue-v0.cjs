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
const diagnosticSourcePath = path.join(repoRoot, 'src/lib/fieldCueV0.ts');
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const {
  buildFieldCueV0Report,
} = require(diagnosticSourcePath);
const { registeredOperations } = require(registryPath);

const EXPECTED_SITE_IDS = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const FIELD_CUE_METHOD = 'field-cue-v0-diagnostic';
const FIELD_CUE_SCOPE = 'field-cue-v0-one-ambo-tetrahedron-only';
const FIELD_CUE_POLICY_ID = 'field-cue-v0-one-ambo-tetrahedron';
const SOURCE_POLICY_ID = 'pythagorean-tetrachord-quark-proving-policy-v0';
const PROVING_REGIME_ID = 'pythagorean-tetrachord-quark-regime-v0';
const SOURCE_PROFILE_SYSTEM_ID = 'pythagorean-tetrachord-primal-profile-system-v0';
const CHILD_INHERITANCE_GRAMMAR_ID =
  'tetrahedral-quark-log-wave-number-inheritance-v0';
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
const diagnosticSource = fs.readFileSync(diagnosticSourcePath, 'utf8');
const runnerSource = fs.readFileSync(__filename, 'utf8');
const registrySource = fs.readFileSync(registryPath, 'utf8');
const diagnosticSources = {
  diagnosticSource,
  runnerSource,
  registrySource,
};

runReportBoundaryDiagnostic(report);
runMultiProjectionIntegrationDiagnostic(report, diagnosticSources);
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
    report.sourceSignatureProvenance.provingRegimeId,
    PROVING_REGIME_ID,
    'report proving regime id',
  );
  expectEqual(
    report.sourceSignatureProvenance.sourceProfileSystemId,
    SOURCE_PROFILE_SYSTEM_ID,
    'report source profile system id',
  );
  expectEqual(
    report.sourceSignatureProvenance.childInheritanceGrammarId,
    CHILD_INHERITANCE_GRAMMAR_ID,
    'report child inheritance grammar id',
  );
  expectEqual(
    report.sourceSignatureProvenance.sourcePolicyId,
    SOURCE_POLICY_ID,
    'report source-signature provenance source policy id',
  );
  expectEqual(
    report.sourceSignatureProvenance.baseWaveNumberCalibration
      .baseWaveNumberCalibrationStatus,
    'human-specified-v0',
    'report base wave-number calibration status',
  );
  expectApprox(
    report.sourceSignatureProvenance.baseWaveNumberCalibration
      .wavelengthToEdgeRatio,
    1 / 8,
    'report wavelength to edge ratio',
  );
  expectEqual(
    report.sourceSignatureProvenance.eventShellProvenance.shellScalingApplication,
    'record-only-v0',
    'report shell scaling application',
  );
  expectIncludes(
    report.sourceSignatureProvenance.activeDifferentiatingAxes,
    'waveNumber',
    'report active axes include waveNumber',
  );
  expectIncludes(
    report.sourceSignatureProvenance.activeDifferentiatingAxes,
    'phase',
    'report active axes include phase',
  );
  expectIncludes(
    report.sourceSignatureProvenance.neutralAxes,
    'amplitude',
    'report neutral axes include amplitude',
  );
  expectIncludes(
    report.sourceSignatureProvenance.neutralAxes,
    'attenuation',
    'report neutral axes include attenuation',
  );
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

function runMultiProjectionIntegrationDiagnostic(report, sources) {
  const consumption = report.multiProjectionConsumption;

  expectEqual(
    report.diagnosticIntegrityStatus,
    'pass',
    'D1 diagnostic integrity status',
  );
  expectEqual(
    report.fieldCueV0AdaptationStatus,
    'multi-projection-consumption-integrated-diagnostic-only',
    'FieldCueV0 D1 adaptation status',
  );
  expectEqual(
    report.fieldCueV0RuntimeStatus,
    'not-runtime-promoted',
    'FieldCueV0 runtime promotion status',
  );
  expectEqual(report.fieldCueV0UiStatus, 'not-ui-work', 'FieldCueV0 UI status');
  expectEqual(
    report.generatedSiteReadingV0Status,
    'blocked',
    'GeneratedSiteReadingV0 remains blocked',
  );
  expectEqual(
    report.sourceStateRegimeStatus,
    'multi-projection-source-state-regime-accepted',
    'source-state regime status',
  );
  expectEqual(
    report.rawFieldWitnessStatus,
    'failed-insufficient-not-source-signature',
    'raw field witness status',
  );
  expectEqual(
    report.structuralWitnessStatus,
    'consumed-under-declared-basis',
    'structural witness status',
  );
  expectEqual(
    report.reductionLawAdoptionStatus,
    'not-adopted',
    'FieldCueV0 reduction law adoption status',
  );
  expectEqual(
    report.recommendedNextGate,
    'Gate D2 - FieldCueV0 UI/Generated-Site Boundary Plan',
    'recommended next gate',
  );

  expectTruthy(consumption, 'FieldCueV0 consumes D0 adapter output');
  expectEqual(
    consumption.acceptedSourceStateRegimeId,
    'multi-projection-source-state-v0',
    'accepted source-state regime',
  );
  expectEqual(
    consumption.sourceStateBasis,
    'structured-source-state-signature',
    'source-state basis',
  );
  expectEqual(
    consumption.adapterConsumptionStatus,
    'fieldcue-multi-projection-consumption-supported',
    'adapter consumption status',
  );
  expectEqual(
    consumption.consumedProjectionSummary.generatedChildProjectionCount,
    6,
    'generated child projection count',
  );
  expectEqual(
    consumption.consumedProjectionSummary.propagationProjectionCount,
    6,
    'propagation projection count',
  );
  expectEqual(
    consumption.consumedProjectionSummary.structuralProjectionCount,
    6,
    'structural projection count',
  );
  expectEqual(
    consumption.consumedProjectionSummary.relationVisibilityRowCount,
    3,
    'relation visibility row count',
  );
  expectEqual(
    consumption.consumedProjectionSummary.structuralOperationPairCount,
    3,
    'structural operation pair count',
  );
  expectEqual(
    consumption.cueRowsByGeneratedChild.length,
    6,
    'child cue row count',
  );
  expectEqual(consumption.relationCueRows.length, 3, 'relation cue row count');

  expectEqual(
    consumption.cueRowsByGeneratedChild.every(
      (row) =>
        row.reductionHonesty.emittedTupleStatus ===
          'propagation-facing-reduction-only' &&
        row.reductionHonesty.sourceSignatureStatus ===
          'structured-source-state-not-scalar-tuple' &&
        row.reductionHonesty.tupleLossWarning === true,
    ),
    true,
    'scalar tuple is not source signature',
  );
  expectEqual(
    consumption.reductionHonestySummary.emittedTupleStatus,
    'propagation-facing-reduction-only',
    'reduction honesty emitted tuple status',
  );
  expectEqual(
    consumption.reductionHonestySummary.sourceSignatureStatus,
    'structured-source-state-not-scalar-tuple',
    'reduction honesty source signature status',
  );
  expectEqual(
    consumption.reductionHonestySummary.tupleReductionLossStatus,
    'tuple-reduction-loss-warning-preserved',
    'tuple reduction loss warning status',
  );
  expectEqual(
    consumption.reductionHonestySummary.rawFieldBehaviorStatus,
    'failed-insufficient',
    'raw field behavior remains failed/insufficient',
  );
  expectEqual(
    consumption.reductionHonestySummary.reductionLawAdoptionStatus,
    'not-adopted',
    'D0 reduction law adoption status',
  );

  for (const row of consumption.relationCueRows) {
    expectTruthy(row.relationId, 'relation cue row relation id');
    expectTruthy(row.leftChildSiteId, `${row.relationId} left child site id`);
    expectTruthy(row.rightChildSiteId, `${row.relationId} right child site id`);
    expectEqual(
      row.sourceStateRelation,
      'antipodal-opposition',
      `${row.relationId} source-state relation`,
    );
    expectEqual(
      row.rawFieldCueStatus,
      'misleading-if-read-as-raw-field',
      `${row.relationId} raw field cue status`,
    );
    expectEqual(
      row.structuralChannelCueStatus,
      'structural-channel-visible',
      `${row.relationId} structural channel cue status`,
    );
    expectEqual(
      row.depropagationCueStatus,
      'depropagation-recoverable',
      `${row.relationId} depropagation cue status`,
    );
    expectEqual(
      row.relationVisibilityStatuses.includes('raw-field-visible'),
      false,
      `${row.relationId} raw-field-visible is not claimed`,
    );
    expectEqual(
      row.relationVisibilityStatuses.includes(
        'misleading-if-read-as-raw-field',
      ),
      true,
      `${row.relationId} misleading warning status`,
    );
    expectEqual(
      row.misleadingRisk,
      true,
      `${row.relationId} misleading risk`,
    );
    expectTruthy(
      row.cueWarning.includes('Raw field visibility is not proven'),
      `${row.relationId} raw field warning`,
    );
    expectTruthy(
      row.cueWarning.includes('declared basis'),
      `${row.relationId} declared basis warning`,
    );
    expectTruthy(
      row.cueInterpretation.includes('not as raw propagated field recovery'),
      `${row.relationId} raw recovery caveat`,
    );
    expectEqual(
      row.depropagationCueStatus !== row.rawFieldCueStatus,
      true,
      `${row.relationId} depropagation remains distinct from raw visibility`,
    );
  }

  expectEqual(
    consumption.fieldCueBoundary.fieldCueV0Status,
    'blocked-pending-multi-projection-adaptation',
    'D0 FieldCueV0 boundary status',
  );
  expectEqual(
    consumption.fieldCueBoundary.generatedSiteReadingV0Status,
    'blocked',
    'D0 GeneratedSiteReadingV0 boundary status',
  );
  expectEqual(
    consumption.fieldCueBoundary.runtimePromotionStatus,
    'not-promoted',
    'D0 runtime promotion status',
  );

  expectEqual(
    containsGeneratedSiteReadingV0Import(sources.diagnosticSource),
    false,
    'FieldCueV0 source does not import GeneratedSiteReadingV0',
  );
  expectEqual(
    containsGeneratedSiteReadingV0Import(sources.runnerSource),
    false,
    'FieldCueV0 diagnostic does not import GeneratedSiteReadingV0',
  );
  expectEqual(
    containsUiComponentImport(sources.diagnosticSource),
    false,
    'FieldCueV0 source does not import UI components',
  );
  expectEqual(
    containsUiComponentImport(sources.runnerSource),
    false,
    'FieldCueV0 diagnostic does not import UI components',
  );
  expectEqual(
    Object.keys(require.cache).some((modulePath) =>
      /generatedSiteReadingV0/i.test(modulePath),
    ),
    false,
    'FieldCueV0 diagnostic runtime did not load GeneratedSiteReadingV0',
  );
  expectEqual(
    Object.keys(require.cache).some((modulePath) =>
      /src[\\/]components[\\/]|FieldCueV0Panel|GeneratedSiteReadingV0Panel/i.test(
        modulePath,
      ),
    ),
    false,
    'FieldCueV0 diagnostic runtime did not load UI components',
  );
  expectEqual(
    /fieldCueV0MultiProjectionConsumption|Gate D1|Gate D2|multi[-_ ]?projection[-_ ]?consumption/i.test(
      sources.registrySource,
    ),
    false,
    'operation registry is not contaminated by D1 integration',
  );

  console.log('multi-projection D1 integration: PASS');
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
    expectEqual(
      axis.inheritanceGrammarId,
      CHILD_INHERITANCE_GRAMMAR_ID,
      `${cue.siteId} Pythagorean inheritance grammar`,
    );
    expectTruthy(axis.mergeKind, `${cue.siteId} merge kind`);
    expectEqual(
      axis.inheritanceStatus,
      'complete',
      `${cue.siteId} inheritance status complete`,
    );
    expectEqual(
      axis.provingRegimeId,
      PROVING_REGIME_ID,
      `${cue.siteId} proving regime id`,
    );
    expectEqual(
      axis.childInheritanceGrammarId,
      CHILD_INHERITANCE_GRAMMAR_ID,
      `${cue.siteId} child inheritance grammar id`,
    );
    expectEqual(
      typeof axis.childLogRatio,
      'number',
      `${cue.siteId} child logRatio`,
    );
    expectEqual(typeof axis.childRatio, 'number', `${cue.siteId} child ratio`);
    expectEqual(
      typeof axis.childWavelength,
      'number',
      `${cue.siteId} child wavelength`,
    );
    expectEqual(
      typeof axis.baseWaveNumber,
      'number',
      `${cue.siteId} base wave-number`,
    );
    expectEqual(
      typeof axis.referenceWavelength,
      'number',
      `${cue.siteId} reference wavelength`,
    );
    expectApprox(
      axis.wavelengthToEdgeRatio,
      1 / 8,
      `${cue.siteId} wavelength to edge ratio`,
    );
    expectEqual(
      axis.shellScalingApplication,
      'record-only-v0',
      `${cue.siteId} shell scaling application`,
    );
    expectIncludes(
      axis.activeDifferentiatingAxes ?? [],
      'waveNumber',
      `${cue.siteId} active axes include waveNumber`,
    );
    expectIncludes(
      axis.activeDifferentiatingAxes ?? [],
      'phase',
      `${cue.siteId} active axes include phase`,
    );
    expectIncludes(
      axis.neutralAxes ?? [],
      'amplitude',
      `${cue.siteId} neutral axes include amplitude`,
    );
    expectIncludes(
      axis.neutralAxes ?? [],
      'attenuation',
      `${cue.siteId} neutral axes include attenuation`,
    );

    for (const channel of axis.quarkChannelSummaries) {
      expectEqual(
        typeof channel.parentLogRatio,
        'number',
        `${cue.siteId} ${channel.channelId} parent logRatio`,
      );
      expectEqual(
        typeof channel.projectionLogRatio,
        'number',
        `${cue.siteId} ${channel.channelId} projection logRatio`,
      );
      expectEqual(
        typeof channel.channelLogRatio,
        'number',
        `${cue.siteId} ${channel.channelId} channel logRatio`,
      );
      expectEqual(
        typeof channel.channelRatio,
        'number',
        `${cue.siteId} ${channel.channelId} channel ratio`,
      );
      expectEqual(
        typeof channel.channelWavelength,
        'number',
        `${cue.siteId} ${channel.channelId} channel wavelength`,
      );
      expectEqual(
        channel.channelDerivationLawId,
        CHILD_INHERITANCE_GRAMMAR_ID,
        `${cue.siteId} ${channel.channelId} channel derivation law`,
      );
    }
  }

  console.log('inheritance axis: PASS');
}

function runEmittedSourceDiagnostic(report) {
  for (const cue of report.cues) {
    const signature = cue.emittedSourceSignature;
    const axis = cue.inheritanceAxis;
    const provenance = cue.sourceSignatureProvenance;
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
    expectEqual(signature.fieldReady, true, `${cue.siteId} field-ready signature`);
    expectEqual(axis.inheritanceStatus, 'complete', `${cue.siteId} complete inheritance`);
    expectEqual(axis.fallbackKind, undefined, `${cue.siteId} no fallback kind`);
    expectEqual(axis.unresolved, false, `${cue.siteId} not unresolved`);
    expectEqual(
      provenance.provingRegimeId,
      PROVING_REGIME_ID,
      `${cue.siteId} source provenance regime`,
    );
    expectEqual(
      provenance.sourceProfileSystemId,
      SOURCE_PROFILE_SYSTEM_ID,
      `${cue.siteId} source provenance profile system`,
    );
    expectEqual(
      provenance.childInheritanceGrammarId,
      CHILD_INHERITANCE_GRAMMAR_ID,
      `${cue.siteId} source provenance child inheritance grammar`,
    );
    expectEqual(
      provenance.baseWaveNumberCalibration.baseWaveNumberCalibrationStatus,
      'human-specified-v0',
      `${cue.siteId} base wave-number calibration status`,
    );
    expectApprox(
      provenance.baseWaveNumberCalibration.wavelengthToEdgeRatio,
      1 / 8,
      `${cue.siteId} wavelength to edge ratio`,
    );
    expectEqual(
      provenance.eventShellProvenance.shellScalingApplication,
      'record-only-v0',
      `${cue.siteId} shell scaling application`,
    );
    expectIncludes(
      provenance.activeDifferentiatingAxes,
      'waveNumber',
      `${cue.siteId} active axes include waveNumber`,
    );
    expectIncludes(
      provenance.activeDifferentiatingAxes,
      'phase',
      `${cue.siteId} active axes include phase`,
    );
    expectIncludes(
      provenance.neutralAxes,
      'amplitude',
      `${cue.siteId} neutral axes include amplitude`,
    );
    expectIncludes(
      provenance.neutralAxes,
      'attenuation',
      `${cue.siteId} neutral axes include attenuation`,
    );

    if (signature.emissionTuple) {
      expectNotApprox(
        signature.emissionTuple.waveNumber,
        Math.PI,
        `${cue.siteId} emitted wave-number is not old Math.PI fixture`,
      );
      expectApprox(
        signature.emissionTuple.waveNumber,
        provenance.baseWaveNumberCalibration.baseWaveNumber *
          (provenance.childRatio ?? Number.NaN),
        `${cue.siteId} emitted wave-number follows base * childRatio`,
      );
      expectNotApprox(
        signature.emissionTuple.waveNumber,
        provenance.baseWaveNumberCalibration.baseWaveNumber *
          (provenance.childRatio ?? Number.NaN) *
          Math.sqrt(3),
        `${cue.siteId} emitted wave-number has no shell sqrt3 multiplier`,
      );
      expectApprox(
        signature.emissionTuple.attenuation,
        0.05,
        `${cue.siteId} emitted attenuation remains neutral`,
      );
      expectNotApprox(
        signature.emissionTuple.attenuation,
        0.05 * Math.sqrt(3),
        `${cue.siteId} emitted attenuation has no shell sqrt3 multiplier`,
      );
    }

    expectEqual(
      provenance.childWaveNumberShellScalingApplied,
      false,
      `${cue.siteId} child wave-number shell scaling flag`,
    );
    expectEqual(
      provenance.childAttenuationShellScalingApplied,
      false,
      `${cue.siteId} child attenuation shell scaling flag`,
    );
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
  expectEqual(
    report.diagnosticIntegrityStatus,
    report.issueCount === 0 ? 'pass' : 'fail',
    'diagnostic integrity coherence',
  );

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
  const consumption = report.multiProjectionConsumption;

  console.log('');
  console.log('FieldCueV0 compact summary');
  console.log(`diagnosticIntegrityStatus: ${report.diagnosticIntegrityStatus}`);
  console.log(`fieldCueV0AdaptationStatus: ${report.fieldCueV0AdaptationStatus}`);
  console.log(
    `acceptedSourceStateRegimeId: ${consumption.acceptedSourceStateRegimeId}`,
  );
  console.log(`adapterConsumptionStatus: ${consumption.adapterConsumptionStatus}`);
  console.log(`child cue row count: ${consumption.cueRowsByGeneratedChild.length}`);
  console.log(`relation cue row count: ${consumption.relationCueRows.length}`);
  console.log(`rawFieldWitnessStatus: ${report.rawFieldWitnessStatus}`);
  console.log(`structuralWitnessStatus: ${report.structuralWitnessStatus}`);
  console.log(`fieldCueV0RuntimeStatus: ${report.fieldCueV0RuntimeStatus}`);
  console.log(
    `generatedSiteReadingV0Status: ${report.generatedSiteReadingV0Status}`,
  );
  console.log(`recommendedNextGate: ${report.recommendedNextGate}`);
  console.log('');
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

function containsGeneratedSiteReadingV0Import(source) {
  return /from\s+['"][^'"]*generatedSiteReadingV0|require\([^)]*generatedSiteReadingV0/i.test(
    source,
  );
}

function containsUiComponentImport(source) {
  return /from\s+['"][^'"]*(?:components|FieldCueV0Panel|GeneratedSiteReadingV0Panel|\.tsx)|require\([^)]*(?:components|FieldCueV0Panel|GeneratedSiteReadingV0Panel|\.tsx)/i.test(
    source,
  );
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`);
  }
}

function expectApprox(actual, expected, label, tolerance = 1e-9) {
  if (
    !Number.isFinite(actual) ||
    !Number.isFinite(expected) ||
    Math.abs(actual - expected) > tolerance
  ) {
    failures.push(
      `${label}: expected approximately ${formatValue(expected)}, got ${formatValue(actual)}`,
    );
  }
}

function expectNotApprox(actual, unexpected, label, tolerance = 1e-9) {
  if (
    Number.isFinite(actual) &&
    Number.isFinite(unexpected) &&
    Math.abs(actual - unexpected) <= tolerance
  ) {
    failures.push(
      `${label}: expected not approximately ${formatValue(unexpected)}, got ${formatValue(actual)}`,
    );
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
