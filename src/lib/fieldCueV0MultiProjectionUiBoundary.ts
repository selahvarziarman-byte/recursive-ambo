import {
  buildFieldCueV0Report,
  type FieldCueV0Report,
} from './fieldCueV0';

export type FieldCueV0MultiProjectionUiBoundaryStatus =
  'multi-projection-fieldcue-boundary-ready';
export type FieldCueV0MultiProjectionRenderStatus = 'not-rendered-this-branch';
export type FieldCueV0MultiProjectionGeneratedSiteBoundaryStatus =
  'blocked-not-consuming-fieldcue-yet';
export type FieldCueV0MultiProjectionRuntimePromotionStatus = 'not-promoted';
export type FieldCueV0MultiProjectionSemanticStatus = 'not-semantic-naming';
export type FieldCueV0MultiProjectionTopologyStatus = 'not-topology-workspace';
export type FieldCueV0MultiProjectionPacketWriteStatus = 'not-packet-writing';
export type FieldCueV0MultiProjectionOperationRegistryStatus =
  'not-operation-registry-work';
export type FieldCueV0MultiProjectionSourceReportStatus =
  'fieldcue-v0-d1-report-consumed';
export type FieldCueV0MultiProjectionDiagnosticIntegrityStatus =
  | 'pass'
  | 'fail';
export type FieldCueV0MultiProjectionGeneratedSiteReadingConsumptionStatus =
  'not-authorized';
export type FieldCueV0MultiProjectionUiWarningLevel = 'warning';
export type FieldCueV0MultiProjectionDisplayEligibility =
  'diagnostic-display-only-not-generated-site-reading';
export type FieldCueV0MultiProjectionRecommendedNextGate =
  'Gate D3 - FieldCueV0 Multi-Projection Display Adapter';

export type FieldCueV0MultiProjectionUiBoundaryIssueCode =
  | 'missing-fieldcue-d1-report'
  | 'fieldcue-d1-report-not-ok'
  | 'missing-multi-projection-section'
  | 'missing-child-boundary-rows'
  | 'missing-relation-boundary-rows'
  | 'raw-field-visible-claim-leaked'
  | 'missing-misleading-risk-warning'
  | 'scalar-tuple-treated-as-source-signature'
  | 'generated-site-reading-unblocked-too-early'
  | 'generated-site-reading-import-detected'
  | 'ui-rendering-changed-too-early'
  | 'semantic-naming-leak'
  | 'topology-leak'
  | 'packet-writing-leak'
  | 'operation-registry-contaminated';

type MultiProjectionConsumption =
  FieldCueV0Report['multiProjectionConsumption'];
type ChildCueRow = MultiProjectionConsumption['cueRowsByGeneratedChild'][number];
type RelationCueRow = MultiProjectionConsumption['relationCueRows'][number];

export interface FieldCueV0MultiProjectionUiBoundaryIssue {
  code: FieldCueV0MultiProjectionUiBoundaryIssueCode;
  message: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface FieldCueV0MultiProjectionChildBoundaryRow {
  childSiteId: string;
  sourceStateId: string;
  propagationSummary: {
    carrierWaveNumber: number;
    carrierPhase: number;
    attenuation: number;
    rawPropagationStatus: ChildCueRow['propagationCue']['rawPropagationStatus'];
    interpretation: 'ordinary-propagation-witness-not-full-source-signature';
  };
  structuralSummary: {
    structuralProjectionStatus: ChildCueRow['structuralCue']['structuralProjectionStatus'];
    relationCarrierStatus: ChildCueRow['structuralCue']['relationCarrierStatus'];
    interpretation: 'structural-relation-witness-under-declared-basis';
  };
  reductionHonesty: {
    emittedTupleStatus: ChildCueRow['reductionHonesty']['emittedTupleStatus'];
    sourceSignatureStatus: ChildCueRow['reductionHonesty']['sourceSignatureStatus'];
    tupleLossWarning: true;
  };
}

export interface FieldCueV0MultiProjectionRelationBoundaryRow {
  relationId: string;
  leftChildSiteId: string;
  rightChildSiteId: string;
  sourceStateRelation: RelationCueRow['sourceStateRelation'];
  rawFieldCueStatus: RelationCueRow['rawFieldCueStatus'];
  structuralChannelCueStatus: RelationCueRow['structuralChannelCueStatus'];
  depropagationCueStatus: RelationCueRow['depropagationCueStatus'];
  relationVisibilityStatuses: RelationCueRow['relationVisibilityStatuses'];
  misleadingRisk: boolean;
  cueWarning: string;
  cueInterpretation: string;
  uiWarningLevel: FieldCueV0MultiProjectionUiWarningLevel;
  displayEligibility: FieldCueV0MultiProjectionDisplayEligibility;
}

export interface FieldCueV0MultiProjectionGeneratedSiteBoundary {
  generatedSiteReadingV0Status: 'blocked';
  generatedSiteReadingConsumptionStatus: FieldCueV0MultiProjectionGeneratedSiteReadingConsumptionStatus;
  generatedSiteReadingReason: 'FieldCueV0 boundary is prepared but GeneratedSiteReadingV0 has not been adapted.';
}

export interface FieldCueV0MultiProjectionUiBoundarySummary {
  childBoundaryRowCount: number;
  relationBoundaryRowCount: number;
  misleadingRiskRowCount: number;
  rawFieldVisibleClaimCount: number;
  structuralChannelVisibleRowCount: number;
  tupleLossWarningCount: number;
  boundaryReady: boolean;
}

export interface FieldCueV0MultiProjectionUiBoundaryReport {
  method: 'field-cue-v0-multi-projection-ui-boundary';
  parentGate: 'Gate D2';
  fieldCueV0UiBoundaryStatus: FieldCueV0MultiProjectionUiBoundaryStatus;
  fieldCueV0RenderStatus: FieldCueV0MultiProjectionRenderStatus;
  generatedSiteReadingBoundaryStatus: FieldCueV0MultiProjectionGeneratedSiteBoundaryStatus;
  runtimePromotionStatus: FieldCueV0MultiProjectionRuntimePromotionStatus;
  semanticStatus: FieldCueV0MultiProjectionSemanticStatus;
  topologyStatus: FieldCueV0MultiProjectionTopologyStatus;
  packetWriteStatus: FieldCueV0MultiProjectionPacketWriteStatus;
  operationRegistryStatus: FieldCueV0MultiProjectionOperationRegistryStatus;
  sourceReportStatus: FieldCueV0MultiProjectionSourceReportStatus;
  acceptedSourceStateRegimeId: MultiProjectionConsumption['acceptedSourceStateRegimeId'];
  rawFieldWitnessStatus: FieldCueV0Report['rawFieldWitnessStatus'];
  structuralWitnessStatus: FieldCueV0Report['structuralWitnessStatus'];
  reductionLawAdoptionStatus: FieldCueV0Report['reductionLawAdoptionStatus'];
  childBoundaryRows: FieldCueV0MultiProjectionChildBoundaryRow[];
  relationBoundaryRows: FieldCueV0MultiProjectionRelationBoundaryRow[];
  generatedSiteBoundary: FieldCueV0MultiProjectionGeneratedSiteBoundary;
  uiBoundarySummary: FieldCueV0MultiProjectionUiBoundarySummary;
  diagnosticIntegrityStatus: FieldCueV0MultiProjectionDiagnosticIntegrityStatus;
  recommendedNextGate: FieldCueV0MultiProjectionRecommendedNextGate;
  issueCount: number;
  issues: FieldCueV0MultiProjectionUiBoundaryIssue[];
  ok: boolean;
}

const METHOD = 'field-cue-v0-multi-projection-ui-boundary' as const;
const PARENT_GATE = 'Gate D2' as const;
const FIELD_CUE_V0_UI_BOUNDARY_STATUS: FieldCueV0MultiProjectionUiBoundaryStatus =
  'multi-projection-fieldcue-boundary-ready';
const FIELD_CUE_V0_RENDER_STATUS: FieldCueV0MultiProjectionRenderStatus =
  'not-rendered-this-branch';
const GENERATED_SITE_READING_BOUNDARY_STATUS: FieldCueV0MultiProjectionGeneratedSiteBoundaryStatus =
  'blocked-not-consuming-fieldcue-yet';
const RUNTIME_PROMOTION_STATUS: FieldCueV0MultiProjectionRuntimePromotionStatus =
  'not-promoted';
const SEMANTIC_STATUS: FieldCueV0MultiProjectionSemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: FieldCueV0MultiProjectionTopologyStatus =
  'not-topology-workspace';
const PACKET_WRITE_STATUS: FieldCueV0MultiProjectionPacketWriteStatus =
  'not-packet-writing';
const OPERATION_REGISTRY_STATUS: FieldCueV0MultiProjectionOperationRegistryStatus =
  'not-operation-registry-work';
const SOURCE_REPORT_STATUS: FieldCueV0MultiProjectionSourceReportStatus =
  'fieldcue-v0-d1-report-consumed';
const RECOMMENDED_NEXT_GATE: FieldCueV0MultiProjectionRecommendedNextGate =
  'Gate D3 - FieldCueV0 Multi-Projection Display Adapter';

export function buildFieldCueV0MultiProjectionUiBoundaryReport(
  fieldCueReport: FieldCueV0Report | null = buildFieldCueV0Report(),
): FieldCueV0MultiProjectionUiBoundaryReport {
  const multiProjectionConsumption =
    fieldCueReport?.multiProjectionConsumption ?? null;
  const childBoundaryRows = multiProjectionConsumption
    ? buildChildBoundaryRows(multiProjectionConsumption.cueRowsByGeneratedChild)
    : [];
  const relationBoundaryRows = multiProjectionConsumption
    ? buildRelationBoundaryRows(multiProjectionConsumption.relationCueRows)
    : [];
  const generatedSiteBoundary = buildGeneratedSiteBoundary();
  const issues = buildIssues({
    fieldCueReport,
    multiProjectionConsumption,
    childBoundaryRows,
    relationBoundaryRows,
    generatedSiteBoundary,
  });
  const diagnosticIntegrityStatus: FieldCueV0MultiProjectionDiagnosticIntegrityStatus =
    issues.length === 0 ? 'pass' : 'fail';
  const uiBoundarySummary = buildUiBoundarySummary({
    childBoundaryRows,
    relationBoundaryRows,
    issueCount: issues.length,
  });

  return {
    method: METHOD,
    parentGate: PARENT_GATE,
    fieldCueV0UiBoundaryStatus: FIELD_CUE_V0_UI_BOUNDARY_STATUS,
    fieldCueV0RenderStatus: FIELD_CUE_V0_RENDER_STATUS,
    generatedSiteReadingBoundaryStatus: GENERATED_SITE_READING_BOUNDARY_STATUS,
    runtimePromotionStatus: RUNTIME_PROMOTION_STATUS,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    sourceReportStatus: SOURCE_REPORT_STATUS,
    acceptedSourceStateRegimeId:
      multiProjectionConsumption?.acceptedSourceStateRegimeId ??
      'multi-projection-source-state-v0',
    rawFieldWitnessStatus:
      fieldCueReport?.rawFieldWitnessStatus ??
      'failed-insufficient-not-source-signature',
    structuralWitnessStatus:
      fieldCueReport?.structuralWitnessStatus ?? 'consumed-under-declared-basis',
    reductionLawAdoptionStatus:
      fieldCueReport?.reductionLawAdoptionStatus ?? 'not-adopted',
    childBoundaryRows,
    relationBoundaryRows,
    generatedSiteBoundary,
    uiBoundarySummary,
    diagnosticIntegrityStatus,
    recommendedNextGate: RECOMMENDED_NEXT_GATE,
    issueCount: issues.length,
    issues,
    ok: diagnosticIntegrityStatus === 'pass',
  };
}

function buildChildBoundaryRows(
  cueRows: MultiProjectionConsumption['cueRowsByGeneratedChild'],
): FieldCueV0MultiProjectionChildBoundaryRow[] {
  return cueRows.map((row) => ({
    childSiteId: row.childSiteId,
    sourceStateId: row.sourceStateId,
    propagationSummary: {
      carrierWaveNumber: row.propagationCue.carrierWaveNumber,
      carrierPhase: row.propagationCue.carrierPhase,
      attenuation: row.propagationCue.attenuation,
      rawPropagationStatus: row.propagationCue.rawPropagationStatus,
      interpretation: row.propagationCue.cueInterpretation,
    },
    structuralSummary: {
      structuralProjectionStatus: row.structuralCue.structuralProjectionStatus,
      relationCarrierStatus: row.structuralCue.relationCarrierStatus,
      interpretation: row.structuralCue.cueInterpretation,
    },
    reductionHonesty: {
      emittedTupleStatus: row.reductionHonesty.emittedTupleStatus,
      sourceSignatureStatus: row.reductionHonesty.sourceSignatureStatus,
      tupleLossWarning: row.reductionHonesty.tupleLossWarning,
    },
  }));
}

function buildRelationBoundaryRows(
  relationRows: MultiProjectionConsumption['relationCueRows'],
): FieldCueV0MultiProjectionRelationBoundaryRow[] {
  return relationRows.map((row) => ({
    relationId: row.relationId,
    leftChildSiteId: row.leftChildSiteId,
    rightChildSiteId: row.rightChildSiteId,
    sourceStateRelation: row.sourceStateRelation,
    rawFieldCueStatus: row.rawFieldCueStatus,
    structuralChannelCueStatus: row.structuralChannelCueStatus,
    depropagationCueStatus: row.depropagationCueStatus,
    relationVisibilityStatuses: [...row.relationVisibilityStatuses],
    misleadingRisk: row.misleadingRisk,
    cueWarning: row.cueWarning,
    cueInterpretation: row.cueInterpretation,
    uiWarningLevel: 'warning',
    displayEligibility: 'diagnostic-display-only-not-generated-site-reading',
  }));
}

function buildGeneratedSiteBoundary(): FieldCueV0MultiProjectionGeneratedSiteBoundary {
  return {
    generatedSiteReadingV0Status: 'blocked',
    generatedSiteReadingConsumptionStatus: 'not-authorized',
    generatedSiteReadingReason:
      'FieldCueV0 boundary is prepared but GeneratedSiteReadingV0 has not been adapted.',
  };
}

function buildUiBoundarySummary(args: {
  childBoundaryRows: FieldCueV0MultiProjectionChildBoundaryRow[];
  relationBoundaryRows: FieldCueV0MultiProjectionRelationBoundaryRow[];
  issueCount: number;
}): FieldCueV0MultiProjectionUiBoundarySummary {
  const rawFieldVisibleClaimCount = args.relationBoundaryRows.filter((row) =>
    relationClaimsRawFieldVisible(row),
  ).length;
  const misleadingRiskRowCount = args.relationBoundaryRows.filter(
    (row) => row.misleadingRisk,
  ).length;
  const structuralChannelVisibleRowCount = args.relationBoundaryRows.filter(
    (row) => row.structuralChannelCueStatus === 'structural-channel-visible',
  ).length;
  const tupleLossWarningCount = args.childBoundaryRows.filter(
    (row) => row.reductionHonesty.tupleLossWarning,
  ).length;

  return {
    childBoundaryRowCount: args.childBoundaryRows.length,
    relationBoundaryRowCount: args.relationBoundaryRows.length,
    misleadingRiskRowCount,
    rawFieldVisibleClaimCount,
    structuralChannelVisibleRowCount,
    tupleLossWarningCount,
    boundaryReady:
      args.issueCount === 0 &&
      args.childBoundaryRows.length === 6 &&
      args.relationBoundaryRows.length === 3 &&
      rawFieldVisibleClaimCount === 0 &&
      misleadingRiskRowCount === 3 &&
      tupleLossWarningCount === 6,
  };
}

function buildIssues(args: {
  fieldCueReport: FieldCueV0Report | null;
  multiProjectionConsumption: MultiProjectionConsumption | null;
  childBoundaryRows: FieldCueV0MultiProjectionChildBoundaryRow[];
  relationBoundaryRows: FieldCueV0MultiProjectionRelationBoundaryRow[];
  generatedSiteBoundary: FieldCueV0MultiProjectionGeneratedSiteBoundary;
}): FieldCueV0MultiProjectionUiBoundaryIssue[] {
  const issues: FieldCueV0MultiProjectionUiBoundaryIssue[] = [];

  if (!args.fieldCueReport) {
    issues.push({
      code: 'missing-fieldcue-d1-report',
      message: 'The D2 UI boundary did not receive a FieldCueV0 D1 report.',
    });
  } else if (!args.fieldCueReport.ok) {
    issues.push({
      code: 'fieldcue-d1-report-not-ok',
      message: 'The FieldCueV0 D1 report is not diagnostically ok.',
      details: {
        fieldCueIssueCount: args.fieldCueReport.issueCount,
      },
    });
  }

  if (!args.multiProjectionConsumption) {
    issues.push({
      code: 'missing-multi-projection-section',
      message: 'The FieldCueV0 D1 report has no multi-projection section.',
    });
  }

  if (args.childBoundaryRows.length !== 6) {
    issues.push({
      code: 'missing-child-boundary-rows',
      message: `Expected 6 child boundary rows, got ${args.childBoundaryRows.length}.`,
    });
  }

  if (args.relationBoundaryRows.length !== 3) {
    issues.push({
      code: 'missing-relation-boundary-rows',
      message: `Expected 3 relation boundary rows, got ${args.relationBoundaryRows.length}.`,
    });
  }

  if (args.relationBoundaryRows.some(relationClaimsRawFieldVisible)) {
    issues.push({
      code: 'raw-field-visible-claim-leaked',
      message: 'The D2 boundary leaked a raw-field-visible relation claim.',
    });
  }

  if (
    args.relationBoundaryRows.some(
      (row) =>
        !row.misleadingRisk ||
        !row.relationVisibilityStatuses.includes(
          'misleading-if-read-as-raw-field',
        ) ||
        !row.cueWarning.includes('misleading-if-read-as-raw-field'),
    )
  ) {
    issues.push({
      code: 'missing-misleading-risk-warning',
      message:
        'The D2 boundary must preserve misleading-if-read-as-raw-field warnings.',
    });
  }

  if (
    args.childBoundaryRows.some(
      (row) =>
        row.reductionHonesty.emittedTupleStatus !==
          'propagation-facing-reduction-only' ||
        row.reductionHonesty.sourceSignatureStatus !==
          'structured-source-state-not-scalar-tuple' ||
        row.reductionHonesty.tupleLossWarning !== true,
    ) ||
    args.fieldCueReport?.reductionLawAdoptionStatus !== 'not-adopted'
  ) {
    issues.push({
      code: 'scalar-tuple-treated-as-source-signature',
      message:
        'The D2 boundary must keep scalar tuples as propagation reductions only.',
    });
  }

  if (
    args.generatedSiteBoundary.generatedSiteReadingV0Status !== 'blocked' ||
    args.generatedSiteBoundary.generatedSiteReadingConsumptionStatus !==
      'not-authorized' ||
    args.fieldCueReport?.generatedSiteReadingV0Status !== 'blocked'
  ) {
    issues.push({
      code: 'generated-site-reading-unblocked-too-early',
      message: 'GeneratedSiteReadingV0 must remain blocked at the D2 boundary.',
    });
  }

  if (
    FIELD_CUE_V0_RENDER_STATUS !== 'not-rendered-this-branch' ||
    args.fieldCueReport?.fieldCueV0UiStatus !== 'not-ui-work'
  ) {
    issues.push({
      code: 'ui-rendering-changed-too-early',
      message: 'D2 prepares a UI-safe payload but must not render it.',
    });
  }

  if (args.fieldCueReport?.semanticStatus !== 'not-semantic-naming') {
    issues.push({
      code: 'semantic-naming-leak',
      message: 'D2 must not introduce semantic naming.',
    });
  }

  if (args.fieldCueReport?.topologyStatus !== 'not-topology-workspace') {
    issues.push({
      code: 'topology-leak',
      message: 'D2 must not enter topology workspace.',
    });
  }

  if (args.fieldCueReport?.packetWriteStatus !== 'not-packet-writing') {
    issues.push({
      code: 'packet-writing-leak',
      message: 'D2 must not write packets.',
    });
  }

  if (args.fieldCueReport?.operationRegistryStatus !== 'not-operation-registry-work') {
    issues.push({
      code: 'operation-registry-contaminated',
      message: 'D2 must not contaminate operation registry work.',
    });
  }

  return issues;
}

function relationClaimsRawFieldVisible(
  row: FieldCueV0MultiProjectionRelationBoundaryRow,
): boolean {
  return (
    row.rawFieldCueStatus === 'raw-field-visible' ||
    row.relationVisibilityStatuses.includes('raw-field-visible')
  );
}
