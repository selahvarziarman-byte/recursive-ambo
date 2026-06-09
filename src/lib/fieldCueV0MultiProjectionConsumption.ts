import {
  buildStructuredSourceStateMultiProjectionStructuralChannelV0Report,
  type StructuredSourceStateAntipodalRelationVisibilityRow,
  type StructuredSourceStateGeneratedChildProjection,
  type StructuredSourceStateMultiProjectionStructuralChannelV0Report,
  type StructuredSourceStateRelationVisibilityStatus,
} from './structuredSourceStateMultiProjectionStructuralChannelV0';

export type FieldCueV0MultiProjectionConsumptionMethod =
  'field-cue-v0-multi-projection-consumption';
export type FieldCueV0MultiProjectionConsumptionParentGate = 'Gate D0';
export type FieldCueV0MultiProjectionAcceptedSourceStateRegimeId =
  'multi-projection-source-state-v0';
export type FieldCueV0MultiProjectionSourceStateBasis =
  'structured-source-state-signature';
export type FieldCueV0MultiProjectionAdapterScope =
  'diagnostic-only-consumption-adapter';
export type FieldCueV0MultiProjectionFieldCueV0Status =
  'blocked-pending-multi-projection-adaptation';
export type FieldCueV0MultiProjectionGeneratedSiteReadingV0Status = 'blocked';
export type FieldCueV0MultiProjectionRuntimePromotionStatus = 'not-promoted';
export type FieldCueV0MultiProjectionSemanticStatus = 'not-semantic-naming';
export type FieldCueV0MultiProjectionTopologyStatus = 'not-topology-workspace';
export type FieldCueV0MultiProjectionPacketWriteStatus = 'not-packet-writing';
export type FieldCueV0MultiProjectionFieldAtlasMutationStatus = 'not-mutated';
export type FieldCueV0MultiProjectionOperationRegistryStatus =
  'not-operation-registry-work';
export type FieldCueV0MultiProjectionAdapterProductStatus =
  'adapter-supported-not-runtime-promoted';
export type FieldCueV0MultiProjectionDiagnosticIntegrityStatus = 'pass' | 'fail';
export type FieldCueV0MultiProjectionAdapterConsumptionStatus =
  | 'fieldcue-multi-projection-consumption-supported'
  | 'fieldcue-multi-projection-consumption-failed';
export type FieldCueV0MultiProjectionRecommendedNextGate =
  | 'Gate D1'
  | 'Gate D0-review'
  | 'Gate C5-revisit';
export type FieldCueV0MultiProjectionCueInterpretation =
  | 'ordinary-propagation-witness-not-full-source-signature'
  | 'structural-relation-witness-under-declared-basis';
export type FieldCueV0MultiProjectionRelationCarrierStatus =
  'source-state-structural-witness';
export type FieldCueV0MultiProjectionEmittedTupleStatus =
  'propagation-facing-reduction-only';
export type FieldCueV0MultiProjectionSourceSignatureStatus =
  'structured-source-state-not-scalar-tuple';
export type FieldCueV0MultiProjectionSourceReportConsumedStatus =
  | 'c4l-d3-source-report-consumed'
  | 'c4l-d3-source-report-missing';

export type FieldCueV0MultiProjectionConsumptionIssueCode =
  | 'missing-c4l-d3-source-report'
  | 'c4l-d3-source-report-not-ok'
  | 'missing-propagation-projections'
  | 'missing-structural-projections'
  | 'missing-relation-visibility-rows'
  | 'missing-structural-operations'
  | 'raw-field-marked-as-passed'
  | 'scalar-tuple-treated-as-source-signature'
  | 'missing-misleading-risk-warning'
  | 'fieldcue-promoted-too-early'
  | 'generated-site-reading-unblocked-too-early'
  | 'semantic-naming-leak'
  | 'topology-leak'
  | 'packet-writing-leak'
  | 'generated-site-reading-import-detected'
  | 'ui-import-detected'
  | 'operation-registry-contaminated';

export interface FieldCueV0MultiProjectionConsumptionIssue {
  code: FieldCueV0MultiProjectionConsumptionIssueCode;
  message: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface FieldCueV0MultiProjectionConsumedProjectionSummary {
  generatedChildProjectionCount: number;
  propagationProjectionCount: number;
  structuralProjectionCount: number;
  relationVisibilityRowCount: number;
  structuralOperationPairCount: number;
}

export interface FieldCueV0MultiProjectionSourceReportIdentity {
  sourceReportConsumedStatus: FieldCueV0MultiProjectionSourceReportConsumedStatus;
  sourceReportMethod:
    | StructuredSourceStateMultiProjectionStructuralChannelV0Report['method']
    | null;
  sourceParentGate:
    | StructuredSourceStateMultiProjectionStructuralChannelV0Report['parentGate']
    | null;
  sourceProjectionModelId:
    | StructuredSourceStateMultiProjectionStructuralChannelV0Report['projectionModelId']
    | null;
  sourceCandidateLawId:
    | StructuredSourceStateMultiProjectionStructuralChannelV0Report['candidateLawId']
    | null;
  sourceReportOk: boolean;
  sourceDiagnosticIntegrityStatus:
    | StructuredSourceStateMultiProjectionStructuralChannelV0Report['diagnosticIntegrityStatus']
    | null;
  sourceStructuralChannelCandidateStatus:
    | StructuredSourceStateMultiProjectionStructuralChannelV0Report['structuralChannelCandidateStatus']
    | null;
  sourceReductionLawAdoptionStatus:
    | StructuredSourceStateMultiProjectionStructuralChannelV0Report['boundaryStatus']['reductionLawAdoptionStatus']
    | null;
}

export interface FieldCueV0MultiProjectionPropagationCue {
  carrierWaveNumber: number;
  carrierPhase: number;
  attenuation: number;
  rawPropagationStatus: StructuredSourceStateGeneratedChildProjection['propagationProjection']['rawPropagationStatus'];
  rawFieldComputationBasis: StructuredSourceStateGeneratedChildProjection['propagationProjection']['rawFieldComputationBasis'];
  cueInterpretation: 'ordinary-propagation-witness-not-full-source-signature';
}

export interface FieldCueV0MultiProjectionStructuralCue {
  structuralProjectionStatus: StructuredSourceStateGeneratedChildProjection['structuralProjection']['structuralProjectionStatus'];
  relationCarrierStatus: FieldCueV0MultiProjectionRelationCarrierStatus;
  cueInterpretation: 'structural-relation-witness-under-declared-basis';
}

export interface FieldCueV0MultiProjectionReductionHonesty {
  emittedTupleStatus: FieldCueV0MultiProjectionEmittedTupleStatus;
  sourceSignatureStatus: FieldCueV0MultiProjectionSourceSignatureStatus;
  tupleLossWarning: true;
}

export interface FieldCueV0MultiProjectionGeneratedChildCueRow {
  childSiteId: string;
  sourceStateId: string;
  propagationCue: FieldCueV0MultiProjectionPropagationCue;
  structuralCue: FieldCueV0MultiProjectionStructuralCue;
  reductionHonesty: FieldCueV0MultiProjectionReductionHonesty;
}

export interface FieldCueV0MultiProjectionRelationCueRow {
  relationId: string;
  leftChildSiteId: string;
  rightChildSiteId: string;
  sourceStateRelation: StructuredSourceStateAntipodalRelationVisibilityRow['sourceStateRelation'];
  rawFieldCueStatus: StructuredSourceStateRelationVisibilityStatus;
  structuralChannelCueStatus: StructuredSourceStateRelationVisibilityStatus;
  depropagationCueStatus: StructuredSourceStateRelationVisibilityStatus;
  relationVisibilityStatuses: StructuredSourceStateRelationVisibilityStatus[];
  misleadingRisk: boolean;
  cueWarning: string;
  cueInterpretation: string;
}

export interface FieldCueV0MultiProjectionBoundary {
  fieldCueV0Status: FieldCueV0MultiProjectionFieldCueV0Status;
  generatedSiteReadingV0Status: FieldCueV0MultiProjectionGeneratedSiteReadingV0Status;
  runtimePromotionStatus: FieldCueV0MultiProjectionRuntimePromotionStatus;
  adapterProductStatus: FieldCueV0MultiProjectionAdapterProductStatus;
  nextGate: 'Gate D1';
}

export interface FieldCueV0MultiProjectionReductionHonestySummary {
  emittedTupleStatus: FieldCueV0MultiProjectionEmittedTupleStatus;
  sourceSignatureStatus: FieldCueV0MultiProjectionSourceSignatureStatus;
  tupleReductionLossStatus: 'tuple-reduction-loss-warning-preserved';
  rawFieldBehaviorStatus: 'failed-insufficient';
  reductionLawAdoptionStatus:
    | StructuredSourceStateMultiProjectionStructuralChannelV0Report['boundaryStatus']['reductionLawAdoptionStatus']
    | 'not-adopted';
}

export interface FieldCueV0MultiProjectionConsumptionReport {
  method: FieldCueV0MultiProjectionConsumptionMethod;
  parentGate: FieldCueV0MultiProjectionConsumptionParentGate;
  acceptedSourceStateRegimeId: FieldCueV0MultiProjectionAcceptedSourceStateRegimeId;
  sourceStateBasis: FieldCueV0MultiProjectionSourceStateBasis;
  adapterScope: FieldCueV0MultiProjectionAdapterScope;
  fieldCueV0Status: FieldCueV0MultiProjectionFieldCueV0Status;
  generatedSiteReadingV0Status: FieldCueV0MultiProjectionGeneratedSiteReadingV0Status;
  runtimePromotionStatus: FieldCueV0MultiProjectionRuntimePromotionStatus;
  semanticStatus: FieldCueV0MultiProjectionSemanticStatus;
  topologyStatus: FieldCueV0MultiProjectionTopologyStatus;
  packetWriteStatus: FieldCueV0MultiProjectionPacketWriteStatus;
  fieldAtlasMutationStatus: FieldCueV0MultiProjectionFieldAtlasMutationStatus;
  operationRegistryStatus: FieldCueV0MultiProjectionOperationRegistryStatus;
  sourceReportIdentity: FieldCueV0MultiProjectionSourceReportIdentity;
  sourceBoundaryStatus:
    | StructuredSourceStateMultiProjectionStructuralChannelV0Report['boundaryStatus']
    | null;
  consumedProjectionSummary: FieldCueV0MultiProjectionConsumedProjectionSummary;
  reductionHonestySummary: FieldCueV0MultiProjectionReductionHonestySummary;
  cueRowsByGeneratedChild: FieldCueV0MultiProjectionGeneratedChildCueRow[];
  relationCueRows: FieldCueV0MultiProjectionRelationCueRow[];
  fieldCueBoundary: FieldCueV0MultiProjectionBoundary;
  diagnosticIntegrityStatus: FieldCueV0MultiProjectionDiagnosticIntegrityStatus;
  adapterConsumptionStatus: FieldCueV0MultiProjectionAdapterConsumptionStatus;
  recommendedNextGate: FieldCueV0MultiProjectionRecommendedNextGate;
  integrityIssueCount: number;
  integrityIssues: FieldCueV0MultiProjectionConsumptionIssue[];
  ok: boolean;
}

const METHOD: FieldCueV0MultiProjectionConsumptionMethod =
  'field-cue-v0-multi-projection-consumption';
const PARENT_GATE: FieldCueV0MultiProjectionConsumptionParentGate = 'Gate D0';
const ACCEPTED_SOURCE_STATE_REGIME_ID: FieldCueV0MultiProjectionAcceptedSourceStateRegimeId =
  'multi-projection-source-state-v0';
const SOURCE_STATE_BASIS: FieldCueV0MultiProjectionSourceStateBasis =
  'structured-source-state-signature';
const ADAPTER_SCOPE: FieldCueV0MultiProjectionAdapterScope =
  'diagnostic-only-consumption-adapter';
const FIELD_CUE_V0_STATUS: FieldCueV0MultiProjectionFieldCueV0Status =
  'blocked-pending-multi-projection-adaptation';
const GENERATED_SITE_READING_V0_STATUS: FieldCueV0MultiProjectionGeneratedSiteReadingV0Status =
  'blocked';
const RUNTIME_PROMOTION_STATUS: FieldCueV0MultiProjectionRuntimePromotionStatus =
  'not-promoted';
const SEMANTIC_STATUS: FieldCueV0MultiProjectionSemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: FieldCueV0MultiProjectionTopologyStatus =
  'not-topology-workspace';
const PACKET_WRITE_STATUS: FieldCueV0MultiProjectionPacketWriteStatus =
  'not-packet-writing';
const FIELD_ATLAS_MUTATION_STATUS: FieldCueV0MultiProjectionFieldAtlasMutationStatus =
  'not-mutated';
const OPERATION_REGISTRY_STATUS: FieldCueV0MultiProjectionOperationRegistryStatus =
  'not-operation-registry-work';
const ADAPTER_PRODUCT_STATUS: FieldCueV0MultiProjectionAdapterProductStatus =
  'adapter-supported-not-runtime-promoted';
const EMITTED_TUPLE_STATUS: FieldCueV0MultiProjectionEmittedTupleStatus =
  'propagation-facing-reduction-only';
const SOURCE_SIGNATURE_STATUS: FieldCueV0MultiProjectionSourceSignatureStatus =
  'structured-source-state-not-scalar-tuple';

export function buildFieldCueV0MultiProjectionConsumptionReport(
  sourceReport: StructuredSourceStateMultiProjectionStructuralChannelV0Report | null =
    buildStructuredSourceStateMultiProjectionStructuralChannelV0Report(),
): FieldCueV0MultiProjectionConsumptionReport {
  const consumedProjectionSummary = buildConsumedProjectionSummary(sourceReport);
  const cueRowsByGeneratedChild = sourceReport
    ? buildGeneratedChildCueRows(sourceReport.generatedChildProjections)
    : [];
  const relationCueRows = sourceReport
    ? buildRelationCueRows(sourceReport.antipodalRelationVisibilityRows)
    : [];
  const fieldCueBoundary = buildFieldCueBoundary();
  const reductionHonestySummary = buildReductionHonestySummary(sourceReport);
  const integrityIssues = buildIntegrityIssues({
    sourceReport,
    consumedProjectionSummary,
    cueRowsByGeneratedChild,
    relationCueRows,
    fieldCueBoundary,
  });
  const diagnosticIntegrityStatus: FieldCueV0MultiProjectionDiagnosticIntegrityStatus =
    integrityIssues.length === 0 ? 'pass' : 'fail';
  const adapterConsumptionStatus: FieldCueV0MultiProjectionAdapterConsumptionStatus =
    adapterSupportRulesPass({
      sourceReport,
      consumedProjectionSummary,
      cueRowsByGeneratedChild,
      relationCueRows,
      fieldCueBoundary,
    })
      ? 'fieldcue-multi-projection-consumption-supported'
      : 'fieldcue-multi-projection-consumption-failed';
  const recommendedNextGate = pickRecommendedNextGate({
    sourceReport,
    diagnosticIntegrityStatus,
    adapterConsumptionStatus,
  });

  return {
    method: METHOD,
    parentGate: PARENT_GATE,
    acceptedSourceStateRegimeId: ACCEPTED_SOURCE_STATE_REGIME_ID,
    sourceStateBasis: SOURCE_STATE_BASIS,
    adapterScope: ADAPTER_SCOPE,
    fieldCueV0Status: FIELD_CUE_V0_STATUS,
    generatedSiteReadingV0Status: GENERATED_SITE_READING_V0_STATUS,
    runtimePromotionStatus: RUNTIME_PROMOTION_STATUS,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    fieldAtlasMutationStatus: FIELD_ATLAS_MUTATION_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    sourceReportIdentity: buildSourceReportIdentity(sourceReport),
    sourceBoundaryStatus: sourceReport?.boundaryStatus ?? null,
    consumedProjectionSummary,
    reductionHonestySummary,
    cueRowsByGeneratedChild,
    relationCueRows,
    fieldCueBoundary,
    diagnosticIntegrityStatus,
    adapterConsumptionStatus,
    recommendedNextGate,
    integrityIssueCount: integrityIssues.length,
    integrityIssues,
    ok: diagnosticIntegrityStatus === 'pass',
  };
}

function buildSourceReportIdentity(
  sourceReport: StructuredSourceStateMultiProjectionStructuralChannelV0Report | null,
): FieldCueV0MultiProjectionSourceReportIdentity {
  return {
    sourceReportConsumedStatus: sourceReport
      ? 'c4l-d3-source-report-consumed'
      : 'c4l-d3-source-report-missing',
    sourceReportMethod: sourceReport?.method ?? null,
    sourceParentGate: sourceReport?.parentGate ?? null,
    sourceProjectionModelId: sourceReport?.projectionModelId ?? null,
    sourceCandidateLawId: sourceReport?.candidateLawId ?? null,
    sourceReportOk: sourceReport?.ok === true,
    sourceDiagnosticIntegrityStatus:
      sourceReport?.diagnosticIntegrityStatus ?? null,
    sourceStructuralChannelCandidateStatus:
      sourceReport?.structuralChannelCandidateStatus ?? null,
    sourceReductionLawAdoptionStatus:
      sourceReport?.boundaryStatus.reductionLawAdoptionStatus ?? null,
  };
}

function buildConsumedProjectionSummary(
  sourceReport: StructuredSourceStateMultiProjectionStructuralChannelV0Report | null,
): FieldCueV0MultiProjectionConsumedProjectionSummary {
  return {
    generatedChildProjectionCount:
      sourceReport?.generatedChildProjections.length ?? 0,
    propagationProjectionCount: sourceReport?.propagationProjections.length ?? 0,
    structuralProjectionCount: sourceReport?.structuralProjections.length ?? 0,
    relationVisibilityRowCount:
      sourceReport?.antipodalRelationVisibilityRows.length ?? 0,
    structuralOperationPairCount:
      sourceReport?.structuralOperations.complementPairs.length ?? 0,
  };
}

function buildGeneratedChildCueRows(
  generatedChildProjections: StructuredSourceStateGeneratedChildProjection[],
): FieldCueV0MultiProjectionGeneratedChildCueRow[] {
  return generatedChildProjections.map((projection) => ({
    childSiteId: projection.childSiteId,
    sourceStateId: projection.sourceStateId,
    propagationCue: {
      carrierWaveNumber:
        projection.propagationProjection.carrierWaveNumber,
      carrierPhase: projection.propagationProjection.carrierPhase,
      attenuation: projection.propagationProjection.attenuation,
      rawPropagationStatus:
        projection.propagationProjection.rawPropagationStatus,
      rawFieldComputationBasis:
        projection.propagationProjection.rawFieldComputationBasis,
      cueInterpretation:
        'ordinary-propagation-witness-not-full-source-signature',
    },
    structuralCue: {
      structuralProjectionStatus:
        projection.structuralProjection.structuralProjectionStatus,
      relationCarrierStatus: 'source-state-structural-witness',
      cueInterpretation: 'structural-relation-witness-under-declared-basis',
    },
    reductionHonesty: {
      emittedTupleStatus: EMITTED_TUPLE_STATUS,
      sourceSignatureStatus: SOURCE_SIGNATURE_STATUS,
      tupleLossWarning: true,
    },
  }));
}

function buildRelationCueRows(
  relationRows: StructuredSourceStateAntipodalRelationVisibilityRow[],
): FieldCueV0MultiProjectionRelationCueRow[] {
  return relationRows.map((row) => ({
    relationId: row.relationId,
    leftChildSiteId: row.leftChildSiteId,
    rightChildSiteId: row.rightChildSiteId,
    sourceStateRelation: row.sourceStateRelation,
    rawFieldCueStatus: row.rawFieldVisibilityStatus,
    structuralChannelCueStatus: row.structuralChannelVisibilityStatus,
    depropagationCueStatus: row.depropagationVisibilityStatus,
    relationVisibilityStatuses: [...row.relationVisibilityStatuses],
    misleadingRisk: row.relationVisibilityStatuses.includes(
      'misleading-if-read-as-raw-field',
    ),
    cueWarning:
      'Raw field visibility is not proven; structural-channel visibility is accepted only under declared basis; misleading-if-read-as-raw-field must be preserved.',
    cueInterpretation:
      'Antipodality is consumed as a source-state structural relation witness, not as raw propagated field recovery or semantic naming.',
  }));
}

function buildFieldCueBoundary(): FieldCueV0MultiProjectionBoundary {
  return {
    fieldCueV0Status: FIELD_CUE_V0_STATUS,
    generatedSiteReadingV0Status: GENERATED_SITE_READING_V0_STATUS,
    runtimePromotionStatus: RUNTIME_PROMOTION_STATUS,
    adapterProductStatus: ADAPTER_PRODUCT_STATUS,
    nextGate: 'Gate D1',
  };
}

function buildReductionHonestySummary(
  sourceReport: StructuredSourceStateMultiProjectionStructuralChannelV0Report | null,
): FieldCueV0MultiProjectionReductionHonestySummary {
  return {
    emittedTupleStatus: EMITTED_TUPLE_STATUS,
    sourceSignatureStatus: SOURCE_SIGNATURE_STATUS,
    tupleReductionLossStatus: 'tuple-reduction-loss-warning-preserved',
    rawFieldBehaviorStatus: 'failed-insufficient',
    reductionLawAdoptionStatus:
      sourceReport?.boundaryStatus.reductionLawAdoptionStatus ?? 'not-adopted',
  };
}

function buildIntegrityIssues(args: {
  sourceReport: StructuredSourceStateMultiProjectionStructuralChannelV0Report | null;
  consumedProjectionSummary: FieldCueV0MultiProjectionConsumedProjectionSummary;
  cueRowsByGeneratedChild: FieldCueV0MultiProjectionGeneratedChildCueRow[];
  relationCueRows: FieldCueV0MultiProjectionRelationCueRow[];
  fieldCueBoundary: FieldCueV0MultiProjectionBoundary;
}): FieldCueV0MultiProjectionConsumptionIssue[] {
  const issues: FieldCueV0MultiProjectionConsumptionIssue[] = [];

  if (!args.sourceReport) {
    issues.push({
      code: 'missing-c4l-d3-source-report',
      message: 'The Gate D0 adapter did not receive a C.4L-D3 source report.',
    });
  } else if (!args.sourceReport.ok) {
    issues.push({
      code: 'c4l-d3-source-report-not-ok',
      message: 'The consumed C.4L-D3 source report is not diagnostically ok.',
    });
  }

  if (args.consumedProjectionSummary.propagationProjectionCount !== 6) {
    issues.push({
      code: 'missing-propagation-projections',
      message: `Expected 6 propagation projections, got ${args.consumedProjectionSummary.propagationProjectionCount}.`,
    });
  }

  if (args.consumedProjectionSummary.structuralProjectionCount !== 6) {
    issues.push({
      code: 'missing-structural-projections',
      message: `Expected 6 structural projections, got ${args.consumedProjectionSummary.structuralProjectionCount}.`,
    });
  }

  if (args.consumedProjectionSummary.relationVisibilityRowCount !== 3) {
    issues.push({
      code: 'missing-relation-visibility-rows',
      message: `Expected 3 relation visibility rows, got ${args.consumedProjectionSummary.relationVisibilityRowCount}.`,
    });
  }

  if (args.consumedProjectionSummary.structuralOperationPairCount !== 3) {
    issues.push({
      code: 'missing-structural-operations',
      message: `Expected 3 structural operation pairs, got ${args.consumedProjectionSummary.structuralOperationPairCount}.`,
    });
  }

  if (rawFieldMarkedAsPassed(args.sourceReport, args.relationCueRows)) {
    issues.push({
      code: 'raw-field-marked-as-passed',
      message:
        'The adapter must not mark raw propagated field behavior as antipodal recovery.',
    });
  }

  if (scalarTupleTreatedAsSourceSignature(args.cueRowsByGeneratedChild)) {
    issues.push({
      code: 'scalar-tuple-treated-as-source-signature',
      message:
        'The adapter must keep the emitted tuple as a propagation-facing reduction only.',
    });
  }

  if (missingMisleadingRiskWarning(args.relationCueRows)) {
    issues.push({
      code: 'missing-misleading-risk-warning',
      message:
        'Every relation cue row must preserve misleading-if-read-as-raw-field warning status.',
    });
  }

  if (
    args.fieldCueBoundary.fieldCueV0Status !==
      'blocked-pending-multi-projection-adaptation' ||
    args.fieldCueBoundary.runtimePromotionStatus !== 'not-promoted'
  ) {
    issues.push({
      code: 'fieldcue-promoted-too-early',
      message:
        'FieldCueV0 must remain blocked and not runtime-promoted in Gate D0.',
    });
  }

  if (args.fieldCueBoundary.generatedSiteReadingV0Status !== 'blocked') {
    issues.push({
      code: 'generated-site-reading-unblocked-too-early',
      message: 'GeneratedSiteReadingV0 must remain blocked in Gate D0.',
    });
  }

  if (args.sourceReport?.semanticStatus !== 'not-semantic-naming') {
    issues.push({
      code: 'semantic-naming-leak',
      message: 'The consumed source report must not promote semantic naming.',
    });
  }

  if (args.sourceReport?.topologyStatus !== 'not-topology-workspace') {
    issues.push({
      code: 'topology-leak',
      message: 'The consumed source report must not enter topology workspace.',
    });
  }

  if (args.sourceReport?.packetWriteStatus !== 'not-packet-writing') {
    issues.push({
      code: 'packet-writing-leak',
      message: 'The consumed source report must not write packets.',
    });
  }

  if (args.sourceReport?.operationRegistryStatus !== 'not-operation-registry-work') {
    issues.push({
      code: 'operation-registry-contaminated',
      message: 'The consumed source report must not be operation registry work.',
    });
  }

  return issues;
}

function adapterSupportRulesPass(args: {
  sourceReport: StructuredSourceStateMultiProjectionStructuralChannelV0Report | null;
  consumedProjectionSummary: FieldCueV0MultiProjectionConsumedProjectionSummary;
  cueRowsByGeneratedChild: FieldCueV0MultiProjectionGeneratedChildCueRow[];
  relationCueRows: FieldCueV0MultiProjectionRelationCueRow[];
  fieldCueBoundary: FieldCueV0MultiProjectionBoundary;
}): boolean {
  return (
    args.sourceReport?.ok === true &&
    args.consumedProjectionSummary.propagationProjectionCount === 6 &&
    args.consumedProjectionSummary.structuralProjectionCount === 6 &&
    args.consumedProjectionSummary.relationVisibilityRowCount === 3 &&
    args.consumedProjectionSummary.structuralOperationPairCount === 3 &&
    !missingMisleadingRiskWarning(args.relationCueRows) &&
    !rawFieldMarkedAsPassed(args.sourceReport, args.relationCueRows) &&
    !scalarTupleTreatedAsSourceSignature(args.cueRowsByGeneratedChild) &&
    args.fieldCueBoundary.fieldCueV0Status ===
      'blocked-pending-multi-projection-adaptation' &&
    args.fieldCueBoundary.generatedSiteReadingV0Status === 'blocked'
  );
}

function rawFieldMarkedAsPassed(
  sourceReport: StructuredSourceStateMultiProjectionStructuralChannelV0Report | null,
  relationCueRows: FieldCueV0MultiProjectionRelationCueRow[],
): boolean {
  return (
    sourceReport?.upstreamC4LD1Status.r4s1RawBehaviorStatus === 'pass' ||
    relationCueRows.some(
      (row) =>
        row.rawFieldCueStatus === 'raw-field-visible' ||
        row.relationVisibilityStatuses.includes('raw-field-visible'),
    )
  );
}

function scalarTupleTreatedAsSourceSignature(
  cueRows: FieldCueV0MultiProjectionGeneratedChildCueRow[],
): boolean {
  return cueRows.some(
    (row) =>
      row.reductionHonesty.emittedTupleStatus !== EMITTED_TUPLE_STATUS ||
      row.reductionHonesty.sourceSignatureStatus !== SOURCE_SIGNATURE_STATUS ||
      row.reductionHonesty.tupleLossWarning !== true,
  );
}

function missingMisleadingRiskWarning(
  relationCueRows: FieldCueV0MultiProjectionRelationCueRow[],
): boolean {
  return relationCueRows.some(
    (row) =>
      !row.misleadingRisk ||
      !row.relationVisibilityStatuses.includes(
        'misleading-if-read-as-raw-field',
      ) ||
      !row.cueWarning.includes('misleading-if-read-as-raw-field'),
  );
}

function pickRecommendedNextGate(args: {
  sourceReport: StructuredSourceStateMultiProjectionStructuralChannelV0Report | null;
  diagnosticIntegrityStatus: FieldCueV0MultiProjectionDiagnosticIntegrityStatus;
  adapterConsumptionStatus: FieldCueV0MultiProjectionAdapterConsumptionStatus;
}): FieldCueV0MultiProjectionRecommendedNextGate {
  if (!args.sourceReport || !args.sourceReport.ok) {
    return 'Gate C5-revisit';
  }

  if (
    args.diagnosticIntegrityStatus !== 'pass' ||
    args.adapterConsumptionStatus !==
      'fieldcue-multi-projection-consumption-supported'
  ) {
    return 'Gate D0-review';
  }

  return 'Gate D1';
}
