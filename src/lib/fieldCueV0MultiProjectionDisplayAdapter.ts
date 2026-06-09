import {
  buildFieldCueV0MultiProjectionUiBoundaryReport,
  type FieldCueV0MultiProjectionUiBoundaryReport,
} from './fieldCueV0MultiProjectionUiBoundary';

export type FieldCueV0MultiProjectionDisplayAdapterMethod =
  'field-cue-v0-multi-projection-display-adapter';
export type FieldCueV0MultiProjectionDisplayAdapterParentGate = 'Gate D3';
export type FieldCueV0MultiProjectionDisplayAdapterSourceBoundaryGate =
  'Gate D2';
export type FieldCueV0MultiProjectionDisplayAdapterStatus =
  'isolated-display-adapter-ready';
export type FieldCueV0MultiProjectionDisplayMountStatus = 'not-mounted';
export type FieldCueV0MultiProjectionLegacyUiStatus =
  'legacy-ui-not-authoritative';
export type FieldCueV0MultiProjectionRenderStatus =
  'adapter-ready-not-rendered-in-app';
export type FieldCueV0MultiProjectionGeneratedSiteReadingV0Status = 'blocked';
export type FieldCueV0MultiProjectionGeneratedSiteReadingConsumptionStatus =
  'not-authorized';
export type FieldCueV0MultiProjectionRuntimePromotionStatus = 'not-promoted';
export type FieldCueV0MultiProjectionSemanticStatus = 'not-semantic-naming';
export type FieldCueV0MultiProjectionTopologyStatus = 'not-topology-workspace';
export type FieldCueV0MultiProjectionPacketWriteStatus = 'not-packet-writing';
export type FieldCueV0MultiProjectionOperationRegistryStatus =
  'not-operation-registry-work';
export type FieldCueV0MultiProjectionRawFieldWitnessStatus =
  'failed-insufficient-not-source-signature';
export type FieldCueV0MultiProjectionStructuralWitnessStatus =
  'consumed-under-declared-basis';
export type FieldCueV0MultiProjectionReductionLawAdoptionStatus =
  'not-adopted';
export type FieldCueV0MultiProjectionDisplayDiagnosticIntegrityStatus =
  | 'pass'
  | 'fail';
export type FieldCueV0MultiProjectionDisplayAdapterReadinessStatus =
  | 'fieldcue-multi-projection-display-adapter-ready'
  | 'fieldcue-multi-projection-display-adapter-failed';
export type FieldCueV0MultiProjectionDisplayRecommendedNextGate =
  | 'Gate D4 - FieldCueV0 Display Mount Decision'
  | 'Gate D3-review'
  | 'Gate D2-revisit';

export type FieldCueV0MultiProjectionDisplayAdapterIssueCode =
  | 'missing-d2-boundary-report'
  | 'd2-boundary-report-not-ok'
  | 'missing-child-display-rows'
  | 'missing-relation-display-rows'
  | 'raw-field-visible-claim-leaked'
  | 'missing-misleading-risk-warning'
  | 'scalar-tuple-treated-as-source-signature'
  | 'structural-witness-treated-as-semantic-naming'
  | 'generated-site-reading-unblocked-too-early'
  | 'display-mounted-too-early'
  | 'legacy-ui-treated-as-authoritative'
  | 'generated-site-reading-import-detected'
  | 'ui-component-import-detected-in-adapter-lib'
  | 'topology-leak'
  | 'packet-writing-leak'
  | 'operation-registry-contaminated';

type UiBoundaryChildRow =
  FieldCueV0MultiProjectionUiBoundaryReport['childBoundaryRows'][number];
type UiBoundaryRelationRow =
  FieldCueV0MultiProjectionUiBoundaryReport['relationBoundaryRows'][number];

export interface FieldCueV0MultiProjectionDisplayAdapterIssue {
  code: FieldCueV0MultiProjectionDisplayAdapterIssueCode;
  message: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface FieldCueV0MultiProjectionDisplayHeaderModel {
  title: 'FieldCueV0 Multi-Projection Witness';
  subtitle: string;
  statusBadges: [
    'multi-projection source-state',
    'raw field insufficient',
    'structural witness under declared basis',
    'generated-site reading blocked',
  ];
}

export interface FieldCueV0MultiProjectionChildDisplayRow {
  childSiteId: string;
  sourceStateId: string;
  propagationLabel: 'Propagation witness';
  propagationSummary: UiBoundaryChildRow['propagationSummary'];
  structuralLabel: 'Structural witness';
  structuralSummary: UiBoundaryChildRow['structuralSummary'];
  reductionWarning: {
    emittedTupleStatus: UiBoundaryChildRow['reductionHonesty']['emittedTupleStatus'];
    sourceSignatureStatus: UiBoundaryChildRow['reductionHonesty']['sourceSignatureStatus'];
    tupleLossWarning: true;
    displayWarningText: 'The emitted tuple is not the full source signature.';
  };
}

export interface FieldCueV0MultiProjectionRelationDisplayRow {
  relationId: string;
  leftChildSiteId: string;
  rightChildSiteId: string;
  sourceStateRelation: UiBoundaryRelationRow['sourceStateRelation'];
  rawFieldCueStatus: UiBoundaryRelationRow['rawFieldCueStatus'];
  structuralChannelCueStatus: UiBoundaryRelationRow['structuralChannelCueStatus'];
  depropagationCueStatus: UiBoundaryRelationRow['depropagationCueStatus'];
  relationVisibilityStatuses: UiBoundaryRelationRow['relationVisibilityStatuses'];
  misleadingRisk: boolean;
  uiWarningLevel: UiBoundaryRelationRow['uiWarningLevel'];
  displayEligibility: UiBoundaryRelationRow['displayEligibility'];
  warningText: string;
  interpretationText: string;
}

export interface FieldCueV0MultiProjectionDisplaySummary {
  childDisplayRowCount: number;
  relationDisplayRowCount: number;
  rawFieldVisibleClaimCount: number;
  misleadingRiskRowCount: number;
  tupleLossWarningCount: number;
  structuralChannelVisibleRowCount: number;
  generatedSiteReadingBlocked: true;
  mountedInApp: false;
  legacyUiAuthoritative: false;
  displayAdapterReady: boolean;
}

export interface FieldCueV0MultiProjectionDisplayAdapterReport {
  method: FieldCueV0MultiProjectionDisplayAdapterMethod;
  parentGate: FieldCueV0MultiProjectionDisplayAdapterParentGate;
  sourceBoundaryGate: FieldCueV0MultiProjectionDisplayAdapterSourceBoundaryGate;
  acceptedSourceStateRegimeId: 'multi-projection-source-state-v0';
  displayAdapterStatus: FieldCueV0MultiProjectionDisplayAdapterStatus;
  displayMountStatus: FieldCueV0MultiProjectionDisplayMountStatus;
  legacyUiStatus: FieldCueV0MultiProjectionLegacyUiStatus;
  fieldCueV0RenderStatus: FieldCueV0MultiProjectionRenderStatus;
  generatedSiteReadingV0Status: FieldCueV0MultiProjectionGeneratedSiteReadingV0Status;
  generatedSiteReadingConsumptionStatus: FieldCueV0MultiProjectionGeneratedSiteReadingConsumptionStatus;
  runtimePromotionStatus: FieldCueV0MultiProjectionRuntimePromotionStatus;
  semanticStatus: FieldCueV0MultiProjectionSemanticStatus;
  topologyStatus: FieldCueV0MultiProjectionTopologyStatus;
  packetWriteStatus: FieldCueV0MultiProjectionPacketWriteStatus;
  operationRegistryStatus: FieldCueV0MultiProjectionOperationRegistryStatus;
  rawFieldWitnessStatus: FieldCueV0MultiProjectionRawFieldWitnessStatus;
  structuralWitnessStatus: FieldCueV0MultiProjectionStructuralWitnessStatus;
  reductionLawAdoptionStatus: FieldCueV0MultiProjectionReductionLawAdoptionStatus;
  headerModel: FieldCueV0MultiProjectionDisplayHeaderModel;
  childDisplayRows: FieldCueV0MultiProjectionChildDisplayRow[];
  relationDisplayRows: FieldCueV0MultiProjectionRelationDisplayRow[];
  displaySummary: FieldCueV0MultiProjectionDisplaySummary;
  diagnosticIntegrityStatus: FieldCueV0MultiProjectionDisplayDiagnosticIntegrityStatus;
  displayAdapterReadinessStatus: FieldCueV0MultiProjectionDisplayAdapterReadinessStatus;
  recommendedNextGate: FieldCueV0MultiProjectionDisplayRecommendedNextGate;
  integrityIssueCount: number;
  integrityIssues: FieldCueV0MultiProjectionDisplayAdapterIssue[];
  ok: boolean;
}

const METHOD: FieldCueV0MultiProjectionDisplayAdapterMethod =
  'field-cue-v0-multi-projection-display-adapter';
const PARENT_GATE: FieldCueV0MultiProjectionDisplayAdapterParentGate = 'Gate D3';
const SOURCE_BOUNDARY_GATE: FieldCueV0MultiProjectionDisplayAdapterSourceBoundaryGate =
  'Gate D2';
const DISPLAY_ADAPTER_STATUS: FieldCueV0MultiProjectionDisplayAdapterStatus =
  'isolated-display-adapter-ready';
const DISPLAY_MOUNT_STATUS: FieldCueV0MultiProjectionDisplayMountStatus =
  'not-mounted';
const LEGACY_UI_STATUS: FieldCueV0MultiProjectionLegacyUiStatus =
  'legacy-ui-not-authoritative';
const FIELD_CUE_V0_RENDER_STATUS: FieldCueV0MultiProjectionRenderStatus =
  'adapter-ready-not-rendered-in-app';
const GENERATED_SITE_READING_V0_STATUS: FieldCueV0MultiProjectionGeneratedSiteReadingV0Status =
  'blocked';
const GENERATED_SITE_READING_CONSUMPTION_STATUS: FieldCueV0MultiProjectionGeneratedSiteReadingConsumptionStatus =
  'not-authorized';
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
const RAW_FIELD_WITNESS_STATUS: FieldCueV0MultiProjectionRawFieldWitnessStatus =
  'failed-insufficient-not-source-signature';
const STRUCTURAL_WITNESS_STATUS: FieldCueV0MultiProjectionStructuralWitnessStatus =
  'consumed-under-declared-basis';
const REDUCTION_LAW_ADOPTION_STATUS: FieldCueV0MultiProjectionReductionLawAdoptionStatus =
  'not-adopted';

export function buildFieldCueV0MultiProjectionDisplayAdapterReport(
  boundaryReport: FieldCueV0MultiProjectionUiBoundaryReport | null =
    buildFieldCueV0MultiProjectionUiBoundaryReport(),
): FieldCueV0MultiProjectionDisplayAdapterReport {
  const headerModel = buildHeaderModel();
  const childDisplayRows = boundaryReport
    ? buildChildDisplayRows(boundaryReport.childBoundaryRows)
    : [];
  const relationDisplayRows = boundaryReport
    ? buildRelationDisplayRows(boundaryReport.relationBoundaryRows)
    : [];
  const integrityIssues = buildIntegrityIssues({
    boundaryReport,
    childDisplayRows,
    relationDisplayRows,
  });
  const displaySummary = buildDisplaySummary({
    childDisplayRows,
    relationDisplayRows,
    integrityIssueCount: integrityIssues.length,
  });
  const diagnosticIntegrityStatus: FieldCueV0MultiProjectionDisplayDiagnosticIntegrityStatus =
    integrityIssues.length === 0 ? 'pass' : 'fail';
  const displayAdapterReadinessStatus: FieldCueV0MultiProjectionDisplayAdapterReadinessStatus =
    displaySummary.displayAdapterReady
      ? 'fieldcue-multi-projection-display-adapter-ready'
      : 'fieldcue-multi-projection-display-adapter-failed';

  return {
    method: METHOD,
    parentGate: PARENT_GATE,
    sourceBoundaryGate: SOURCE_BOUNDARY_GATE,
    acceptedSourceStateRegimeId: 'multi-projection-source-state-v0',
    displayAdapterStatus: DISPLAY_ADAPTER_STATUS,
    displayMountStatus: DISPLAY_MOUNT_STATUS,
    legacyUiStatus: LEGACY_UI_STATUS,
    fieldCueV0RenderStatus: FIELD_CUE_V0_RENDER_STATUS,
    generatedSiteReadingV0Status: GENERATED_SITE_READING_V0_STATUS,
    generatedSiteReadingConsumptionStatus:
      GENERATED_SITE_READING_CONSUMPTION_STATUS,
    runtimePromotionStatus: RUNTIME_PROMOTION_STATUS,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    rawFieldWitnessStatus: RAW_FIELD_WITNESS_STATUS,
    structuralWitnessStatus: STRUCTURAL_WITNESS_STATUS,
    reductionLawAdoptionStatus: REDUCTION_LAW_ADOPTION_STATUS,
    headerModel,
    childDisplayRows,
    relationDisplayRows,
    displaySummary,
    diagnosticIntegrityStatus,
    displayAdapterReadinessStatus,
    recommendedNextGate: pickRecommendedNextGate(
      boundaryReport,
      diagnosticIntegrityStatus,
      displayAdapterReadinessStatus,
    ),
    integrityIssueCount: integrityIssues.length,
    integrityIssues,
    ok: diagnosticIntegrityStatus === 'pass',
  };
}

function buildHeaderModel(): FieldCueV0MultiProjectionDisplayHeaderModel {
  return {
    title: 'FieldCueV0 Multi-Projection Witness',
    subtitle:
      'Source-state witness for propagation and structural visibility; it is not semantic naming.',
    statusBadges: [
      'multi-projection source-state',
      'raw field insufficient',
      'structural witness under declared basis',
      'generated-site reading blocked',
    ],
  };
}

function buildChildDisplayRows(
  childBoundaryRows: UiBoundaryChildRow[],
): FieldCueV0MultiProjectionChildDisplayRow[] {
  return childBoundaryRows.map((row) => ({
    childSiteId: row.childSiteId,
    sourceStateId: row.sourceStateId,
    propagationLabel: 'Propagation witness',
    propagationSummary: { ...row.propagationSummary },
    structuralLabel: 'Structural witness',
    structuralSummary: { ...row.structuralSummary },
    reductionWarning: {
      emittedTupleStatus: row.reductionHonesty.emittedTupleStatus,
      sourceSignatureStatus: row.reductionHonesty.sourceSignatureStatus,
      tupleLossWarning: row.reductionHonesty.tupleLossWarning,
      displayWarningText: 'The emitted tuple is not the full source signature.',
    },
  }));
}

function buildRelationDisplayRows(
  relationBoundaryRows: UiBoundaryRelationRow[],
): FieldCueV0MultiProjectionRelationDisplayRow[] {
  return relationBoundaryRows.map((row) => ({
    relationId: row.relationId,
    leftChildSiteId: row.leftChildSiteId,
    rightChildSiteId: row.rightChildSiteId,
    sourceStateRelation: row.sourceStateRelation,
    rawFieldCueStatus: row.rawFieldCueStatus,
    structuralChannelCueStatus: row.structuralChannelCueStatus,
    depropagationCueStatus: row.depropagationCueStatus,
    relationVisibilityStatuses: [...row.relationVisibilityStatuses],
    misleadingRisk: row.misleadingRisk,
    uiWarningLevel: row.uiWarningLevel,
    displayEligibility: row.displayEligibility,
    warningText:
      'Raw field visibility is not proven; this row preserves the misleading-if-read-as-raw-field warning.',
    interpretationText:
      'Structural-channel visibility is under declared basis and is not semantic naming.',
  }));
}

function buildDisplaySummary(args: {
  childDisplayRows: FieldCueV0MultiProjectionChildDisplayRow[];
  relationDisplayRows: FieldCueV0MultiProjectionRelationDisplayRow[];
  integrityIssueCount: number;
}): FieldCueV0MultiProjectionDisplaySummary {
  const rawFieldVisibleClaimCount = args.relationDisplayRows.filter((row) =>
    relationClaimsRawFieldVisible(row),
  ).length;
  const misleadingRiskRowCount = args.relationDisplayRows.filter(
    (row) => row.misleadingRisk,
  ).length;
  const tupleLossWarningCount = args.childDisplayRows.filter(
    (row) => row.reductionWarning.tupleLossWarning,
  ).length;
  const structuralChannelVisibleRowCount = args.relationDisplayRows.filter(
    (row) => row.structuralChannelCueStatus === 'structural-channel-visible',
  ).length;

  return {
    childDisplayRowCount: args.childDisplayRows.length,
    relationDisplayRowCount: args.relationDisplayRows.length,
    rawFieldVisibleClaimCount,
    misleadingRiskRowCount,
    tupleLossWarningCount,
    structuralChannelVisibleRowCount,
    generatedSiteReadingBlocked: true,
    mountedInApp: false,
    legacyUiAuthoritative: false,
    displayAdapterReady:
      args.integrityIssueCount === 0 &&
      args.childDisplayRows.length === 6 &&
      args.relationDisplayRows.length === 3 &&
      rawFieldVisibleClaimCount === 0 &&
      misleadingRiskRowCount === 3 &&
      tupleLossWarningCount === 6 &&
      structuralChannelVisibleRowCount === 3,
  };
}

function buildIntegrityIssues(args: {
  boundaryReport: FieldCueV0MultiProjectionUiBoundaryReport | null;
  childDisplayRows: FieldCueV0MultiProjectionChildDisplayRow[];
  relationDisplayRows: FieldCueV0MultiProjectionRelationDisplayRow[];
}): FieldCueV0MultiProjectionDisplayAdapterIssue[] {
  const issues: FieldCueV0MultiProjectionDisplayAdapterIssue[] = [];

  if (!args.boundaryReport) {
    issues.push({
      code: 'missing-d2-boundary-report',
      message: 'The display adapter did not receive a Gate D2 boundary report.',
    });
  } else if (!args.boundaryReport.ok) {
    issues.push({
      code: 'd2-boundary-report-not-ok',
      message: 'The consumed Gate D2 boundary report is not ok.',
      details: {
        d2IssueCount: args.boundaryReport.issueCount,
      },
    });
  }

  if (args.childDisplayRows.length !== 6) {
    issues.push({
      code: 'missing-child-display-rows',
      message: `Expected 6 child display rows, got ${args.childDisplayRows.length}.`,
    });
  }

  if (args.relationDisplayRows.length !== 3) {
    issues.push({
      code: 'missing-relation-display-rows',
      message: `Expected 3 relation display rows, got ${args.relationDisplayRows.length}.`,
    });
  }

  if (args.relationDisplayRows.some(relationClaimsRawFieldVisible)) {
    issues.push({
      code: 'raw-field-visible-claim-leaked',
      message: 'The display adapter leaked a raw-field-visible claim.',
    });
  }

  if (
    args.relationDisplayRows.some(
      (row) =>
        !row.misleadingRisk ||
        !row.relationVisibilityStatuses.includes(
          'misleading-if-read-as-raw-field',
        ) ||
        !row.warningText.includes('Raw field visibility is not proven'),
    )
  ) {
    issues.push({
      code: 'missing-misleading-risk-warning',
      message:
        'The display adapter must preserve misleading-risk warning language.',
    });
  }

  if (
    args.childDisplayRows.some(
      (row) =>
        row.reductionWarning.emittedTupleStatus !==
          'propagation-facing-reduction-only' ||
        row.reductionWarning.sourceSignatureStatus !==
          'structured-source-state-not-scalar-tuple' ||
        row.reductionWarning.tupleLossWarning !== true,
    )
  ) {
    issues.push({
      code: 'scalar-tuple-treated-as-source-signature',
      message:
        'The display adapter must keep emitted tuple display as a reduction warning.',
    });
  }

  if (
    args.relationDisplayRows.some(
      (row) =>
        !row.interpretationText.includes('under declared basis') ||
        !row.interpretationText.includes('not semantic naming'),
    )
  ) {
    issues.push({
      code: 'structural-witness-treated-as-semantic-naming',
      message:
        'The display adapter must not treat structural witness rows as semantic naming.',
    });
  }

  if (
    GENERATED_SITE_READING_V0_STATUS !== 'blocked' ||
    GENERATED_SITE_READING_CONSUMPTION_STATUS !== 'not-authorized'
  ) {
    issues.push({
      code: 'generated-site-reading-unblocked-too-early',
      message: 'Generated-site reading must remain blocked in D3.',
    });
  }

  if (DISPLAY_MOUNT_STATUS !== 'not-mounted') {
    issues.push({
      code: 'display-mounted-too-early',
      message: 'The D3 display adapter must remain unmounted.',
    });
  }

  if (LEGACY_UI_STATUS !== 'legacy-ui-not-authoritative') {
    issues.push({
      code: 'legacy-ui-treated-as-authoritative',
      message: 'The legacy UI must not be authoritative for D3.',
    });
  }

  if (TOPOLOGY_STATUS !== 'not-topology-workspace') {
    issues.push({
      code: 'topology-leak',
      message: 'D3 must not enter topology workspace.',
    });
  }

  if (PACKET_WRITE_STATUS !== 'not-packet-writing') {
    issues.push({
      code: 'packet-writing-leak',
      message: 'D3 must not write packets.',
    });
  }

  if (OPERATION_REGISTRY_STATUS !== 'not-operation-registry-work') {
    issues.push({
      code: 'operation-registry-contaminated',
      message: 'D3 must not contaminate operation registry work.',
    });
  }

  return issues;
}

function pickRecommendedNextGate(
  boundaryReport: FieldCueV0MultiProjectionUiBoundaryReport | null,
  diagnosticIntegrityStatus: FieldCueV0MultiProjectionDisplayDiagnosticIntegrityStatus,
  readinessStatus: FieldCueV0MultiProjectionDisplayAdapterReadinessStatus,
): FieldCueV0MultiProjectionDisplayRecommendedNextGate {
  if (!boundaryReport || !boundaryReport.ok) {
    return 'Gate D2-revisit';
  }

  if (
    diagnosticIntegrityStatus !== 'pass' ||
    readinessStatus !== 'fieldcue-multi-projection-display-adapter-ready'
  ) {
    return 'Gate D3-review';
  }

  return 'Gate D4 - FieldCueV0 Display Mount Decision';
}

function relationClaimsRawFieldVisible(
  row: FieldCueV0MultiProjectionRelationDisplayRow,
): boolean {
  return (
    row.rawFieldCueStatus === 'raw-field-visible' ||
    row.relationVisibilityStatuses.includes('raw-field-visible')
  );
}
