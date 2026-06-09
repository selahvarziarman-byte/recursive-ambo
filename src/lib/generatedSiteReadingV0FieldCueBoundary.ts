import {
  buildFieldCueV0Report,
  type FieldCueV0Report,
} from './fieldCueV0';
import {
  buildFieldCueV0MultiProjectionDisplayAdapterReport,
  type FieldCueV0MultiProjectionDisplayAdapterReport,
} from './fieldCueV0MultiProjectionDisplayAdapter';

export type GeneratedSiteReadingV0FieldCueBoundaryMethod =
  'generated-site-reading-v0-fieldcue-boundary';
export type GeneratedSiteReadingV0FieldCueBoundaryParentGate = 'Gate D5';
export type GeneratedSiteReadingV0FieldCueBoundarySourceGate = 'Gate D4';
export type GeneratedSiteReadingV0FieldCueSourceStatus =
  'fieldcue-v0-report-consumed';
export type GeneratedSiteReadingV0DisplayBoundaryStatus =
  'mounted-fieldcue-display-consumed-as-boundary-status';
export type GeneratedSiteReadingV0AcceptedSourceStateRegimeId =
  'multi-projection-source-state-v0';
export type GeneratedSiteReadingV0Status = 'blocked';
export type GeneratedSiteReadingConsumptionStatus =
  'boundary-ready-not-consumed';
export type GeneratedSiteReadingRuntimeStatus = 'not-promoted';
export type GeneratedSiteReadingSemanticNamingStatus = 'not-auto-naming';
export type GeneratedSiteReadingTopologyStatus = 'not-topology-workspace';
export type GeneratedSiteReadingPacketWriteStatus = 'not-packet-writing';
export type GeneratedSiteReadingOperationRegistryStatus =
  'not-operation-registry-work';
export type GeneratedSiteReadingRawFieldWitnessStatus =
  'failed-insufficient-not-source-signature';
export type GeneratedSiteReadingStructuralWitnessStatus =
  'consumable-under-declared-basis-with-warning';
export type GeneratedSiteReadingReductionLawAdoptionStatus = 'not-adopted';
export type GeneratedSiteReadingLegacyUiStatus =
  'legacy-ui-quarantined-not-authoritative';
export type GeneratedSiteReadingDiagnosticIntegrityStatus = 'pass' | 'fail';
export type GeneratedSiteReadingBoundaryReadinessStatus =
  | 'generated-site-reading-fieldcue-boundary-ready'
  | 'generated-site-reading-fieldcue-boundary-failed';
export type GeneratedSiteReadingRecommendedNextGate =
  | 'Gate D6 - GeneratedSiteReadingV0 FieldCue Consumption Adapter'
  | 'Gate D5-review'
  | 'Gate D4-revisit';

export type GeneratedSiteReadingFieldCueEvidenceStatus =
  'available-as-bounded-fieldcue-evidence';
export type GeneratedSiteReadingUseEligibility =
  'eligible-for-later-generated-site-reading-adapter';
export type GeneratedSiteReadingRelationUseEligibility =
  'eligible-as-warning-bearing-structural-fieldcue-evidence';
export type GeneratedSiteReadingFieldCueRequiredWarning =
  | 'raw-field-visibility-not-proven'
  | 'scalar-tuple-not-source-signature'
  | 'structural-witness-under-declared-basis'
  | 'not-semantic-naming';
export type GeneratedSiteReadingForbiddenInterpretation =
  | 'do-not-read-as-raw-field-proof'
  | 'do-not-read-as-semantic-name'
  | 'do-not-read-as-generated-site-final-meaning'
  | 'do-not-drop-misleading-risk';

export type GeneratedSiteReadingV0FieldCueBoundaryIssueCode =
  | 'missing-fieldcue-report'
  | 'fieldcue-report-not-ok'
  | 'missing-display-boundary-report'
  | 'display-boundary-report-not-ok'
  | 'missing-generated-site-fieldcue-rows'
  | 'missing-generated-site-relation-evidence-rows'
  | 'raw-field-visible-claim-leaked'
  | 'missing-misleading-risk-warning'
  | 'scalar-tuple-treated-as-source-signature'
  | 'structural-witness-treated-as-semantic-naming'
  | 'generated-site-reading-promoted-too-early'
  | 'generated-site-reading-import-detected'
  | 'ui-component-import-detected'
  | 'topology-leak'
  | 'packet-writing-leak'
  | 'operation-registry-contaminated';

type MultiProjectionConsumption = FieldCueV0Report['multiProjectionConsumption'];
type FieldCueChildRow =
  MultiProjectionConsumption['cueRowsByGeneratedChild'][number];
type FieldCueRelationRow = MultiProjectionConsumption['relationCueRows'][number];

export interface GeneratedSiteReadingV0FieldCueBoundaryIssue {
  code: GeneratedSiteReadingV0FieldCueBoundaryIssueCode;
  message: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface GeneratedSiteFieldCueRow {
  childSiteId: string;
  sourceStateId: string;
  fieldCueEvidenceStatus: GeneratedSiteReadingFieldCueEvidenceStatus;
  propagationEvidence: {
    carrierWaveNumber: number;
    carrierPhase: number;
    attenuation: number;
    rawPropagationStatus: FieldCueChildRow['propagationCue']['rawPropagationStatus'];
    interpretation: FieldCueChildRow['propagationCue']['cueInterpretation'];
  };
  structuralEvidence: {
    structuralProjectionStatus: FieldCueChildRow['structuralCue']['structuralProjectionStatus'];
    relationCarrierStatus: FieldCueChildRow['structuralCue']['relationCarrierStatus'];
    interpretation: FieldCueChildRow['structuralCue']['cueInterpretation'];
  };
  reductionHonesty: {
    emittedTupleStatus: FieldCueChildRow['reductionHonesty']['emittedTupleStatus'];
    sourceSignatureStatus: FieldCueChildRow['reductionHonesty']['sourceSignatureStatus'];
    tupleLossWarning: true;
  };
  generatedSiteUseEligibility: GeneratedSiteReadingUseEligibility;
  requiredWarnings: GeneratedSiteReadingFieldCueRequiredWarning[];
}

export interface GeneratedSiteRelationEvidenceRow {
  relationId: string;
  leftChildSiteId: string;
  rightChildSiteId: string;
  sourceStateRelation: FieldCueRelationRow['sourceStateRelation'];
  rawFieldCueStatus: FieldCueRelationRow['rawFieldCueStatus'];
  structuralChannelCueStatus: FieldCueRelationRow['structuralChannelCueStatus'];
  depropagationCueStatus: FieldCueRelationRow['depropagationCueStatus'];
  relationVisibilityStatuses: FieldCueRelationRow['relationVisibilityStatuses'];
  misleadingRisk: boolean;
  fieldCueWarning: string;
  generatedSiteReadingWarning: string;
  relationUseEligibility: GeneratedSiteReadingRelationUseEligibility;
  forbiddenInterpretations: GeneratedSiteReadingForbiddenInterpretation[];
}

export interface GeneratedSiteBoundarySummary {
  childEvidenceRowCount: number;
  relationEvidenceRowCount: number;
  rawFieldVisibleClaimCount: number;
  misleadingRiskRowCount: number;
  tupleLossWarningCount: number;
  semanticNamingClaimCount: number;
  generatedSiteReadingBlocked: true;
  generatedSiteConsumptionAuthorized: false;
  boundaryReady: boolean;
}

export interface GeneratedSiteReadingNextStepRecommendation {
  recommendedNextGate: GeneratedSiteReadingRecommendedNextGate;
  d6MayIntegrateBoundaryIntoGeneratedSiteReadingV0: boolean;
  d6MustStillNotAutoName: true;
}

export interface GeneratedSiteReadingV0FieldCueBoundaryReport {
  method: GeneratedSiteReadingV0FieldCueBoundaryMethod;
  parentGate: GeneratedSiteReadingV0FieldCueBoundaryParentGate;
  sourceGate: GeneratedSiteReadingV0FieldCueBoundarySourceGate;
  fieldCueSourceStatus: GeneratedSiteReadingV0FieldCueSourceStatus;
  displayBoundaryStatus: GeneratedSiteReadingV0DisplayBoundaryStatus;
  acceptedSourceStateRegimeId: GeneratedSiteReadingV0AcceptedSourceStateRegimeId;
  generatedSiteReadingV0Status: GeneratedSiteReadingV0Status;
  generatedSiteReadingConsumptionStatus: GeneratedSiteReadingConsumptionStatus;
  generatedSiteReadingRuntimeStatus: GeneratedSiteReadingRuntimeStatus;
  semanticNamingStatus: GeneratedSiteReadingSemanticNamingStatus;
  topologyStatus: GeneratedSiteReadingTopologyStatus;
  packetWriteStatus: GeneratedSiteReadingPacketWriteStatus;
  operationRegistryStatus: GeneratedSiteReadingOperationRegistryStatus;
  rawFieldWitnessStatus: GeneratedSiteReadingRawFieldWitnessStatus;
  structuralWitnessStatus: GeneratedSiteReadingStructuralWitnessStatus;
  reductionLawAdoptionStatus: GeneratedSiteReadingReductionLawAdoptionStatus;
  legacyUiStatus: GeneratedSiteReadingLegacyUiStatus;
  generatedSiteFieldCueRows: GeneratedSiteFieldCueRow[];
  generatedSiteRelationEvidenceRows: GeneratedSiteRelationEvidenceRow[];
  generatedSiteBoundarySummary: GeneratedSiteBoundarySummary;
  nextStepRecommendation: GeneratedSiteReadingNextStepRecommendation;
  diagnosticIntegrityStatus: GeneratedSiteReadingDiagnosticIntegrityStatus;
  boundaryReadinessStatus: GeneratedSiteReadingBoundaryReadinessStatus;
  recommendedNextGate: GeneratedSiteReadingRecommendedNextGate;
  integrityIssueCount: number;
  integrityIssues: GeneratedSiteReadingV0FieldCueBoundaryIssue[];
  ok: boolean;
}

const METHOD: GeneratedSiteReadingV0FieldCueBoundaryMethod =
  'generated-site-reading-v0-fieldcue-boundary';
const PARENT_GATE: GeneratedSiteReadingV0FieldCueBoundaryParentGate = 'Gate D5';
const SOURCE_GATE: GeneratedSiteReadingV0FieldCueBoundarySourceGate = 'Gate D4';
const FIELD_CUE_SOURCE_STATUS: GeneratedSiteReadingV0FieldCueSourceStatus =
  'fieldcue-v0-report-consumed';
const DISPLAY_BOUNDARY_STATUS: GeneratedSiteReadingV0DisplayBoundaryStatus =
  'mounted-fieldcue-display-consumed-as-boundary-status';
const ACCEPTED_SOURCE_STATE_REGIME_ID: GeneratedSiteReadingV0AcceptedSourceStateRegimeId =
  'multi-projection-source-state-v0';
const GENERATED_SITE_READING_V0_STATUS: GeneratedSiteReadingV0Status = 'blocked';
const GENERATED_SITE_READING_CONSUMPTION_STATUS: GeneratedSiteReadingConsumptionStatus =
  'boundary-ready-not-consumed';
const GENERATED_SITE_READING_RUNTIME_STATUS: GeneratedSiteReadingRuntimeStatus =
  'not-promoted';
const SEMANTIC_NAMING_STATUS: GeneratedSiteReadingSemanticNamingStatus =
  'not-auto-naming';
const TOPOLOGY_STATUS: GeneratedSiteReadingTopologyStatus =
  'not-topology-workspace';
const PACKET_WRITE_STATUS: GeneratedSiteReadingPacketWriteStatus =
  'not-packet-writing';
const OPERATION_REGISTRY_STATUS: GeneratedSiteReadingOperationRegistryStatus =
  'not-operation-registry-work';
const RAW_FIELD_WITNESS_STATUS: GeneratedSiteReadingRawFieldWitnessStatus =
  'failed-insufficient-not-source-signature';
const STRUCTURAL_WITNESS_STATUS: GeneratedSiteReadingStructuralWitnessStatus =
  'consumable-under-declared-basis-with-warning';
const REDUCTION_LAW_ADOPTION_STATUS: GeneratedSiteReadingReductionLawAdoptionStatus =
  'not-adopted';
const LEGACY_UI_STATUS: GeneratedSiteReadingLegacyUiStatus =
  'legacy-ui-quarantined-not-authoritative';
const FIELD_CUE_EVIDENCE_STATUS: GeneratedSiteReadingFieldCueEvidenceStatus =
  'available-as-bounded-fieldcue-evidence';
const GENERATED_SITE_USE_ELIGIBILITY: GeneratedSiteReadingUseEligibility =
  'eligible-for-later-generated-site-reading-adapter';
const RELATION_USE_ELIGIBILITY: GeneratedSiteReadingRelationUseEligibility =
  'eligible-as-warning-bearing-structural-fieldcue-evidence';
const D6_NEXT_GATE: GeneratedSiteReadingRecommendedNextGate =
  'Gate D6 - GeneratedSiteReadingV0 FieldCue Consumption Adapter';

const REQUIRED_CHILD_WARNINGS: GeneratedSiteReadingFieldCueRequiredWarning[] = [
  'raw-field-visibility-not-proven',
  'scalar-tuple-not-source-signature',
  'structural-witness-under-declared-basis',
  'not-semantic-naming',
];

const FORBIDDEN_RELATION_INTERPRETATIONS: GeneratedSiteReadingForbiddenInterpretation[] =
  [
    'do-not-read-as-raw-field-proof',
    'do-not-read-as-semantic-name',
    'do-not-read-as-generated-site-final-meaning',
    'do-not-drop-misleading-risk',
  ];

export function buildGeneratedSiteReadingV0FieldCueBoundaryReport(
  fieldCueReport: FieldCueV0Report | null = buildFieldCueV0Report(),
  displayBoundaryReport: FieldCueV0MultiProjectionDisplayAdapterReport | null =
    buildFieldCueV0MultiProjectionDisplayAdapterReport(),
): GeneratedSiteReadingV0FieldCueBoundaryReport {
  const multiProjectionConsumption =
    fieldCueReport?.multiProjectionConsumption ?? null;
  const generatedSiteFieldCueRows = multiProjectionConsumption
    ? buildGeneratedSiteFieldCueRows(
        multiProjectionConsumption.cueRowsByGeneratedChild,
      )
    : [];
  const generatedSiteRelationEvidenceRows = multiProjectionConsumption
    ? buildGeneratedSiteRelationEvidenceRows(
        multiProjectionConsumption.relationCueRows,
      )
    : [];
  const integrityIssues = buildIntegrityIssues({
    fieldCueReport,
    displayBoundaryReport,
    generatedSiteFieldCueRows,
    generatedSiteRelationEvidenceRows,
  });
  const diagnosticIntegrityStatus: GeneratedSiteReadingDiagnosticIntegrityStatus =
    integrityIssues.length === 0 ? 'pass' : 'fail';
  const generatedSiteBoundarySummary = buildGeneratedSiteBoundarySummary({
    generatedSiteFieldCueRows,
    generatedSiteRelationEvidenceRows,
    integrityIssueCount: integrityIssues.length,
  });
  const boundaryReadinessStatus: GeneratedSiteReadingBoundaryReadinessStatus =
    generatedSiteBoundarySummary.boundaryReady
      ? 'generated-site-reading-fieldcue-boundary-ready'
      : 'generated-site-reading-fieldcue-boundary-failed';
  const recommendedNextGate = pickRecommendedNextGate({
    fieldCueReport,
    displayBoundaryReport,
    diagnosticIntegrityStatus,
    boundaryReadinessStatus,
  });

  return {
    method: METHOD,
    parentGate: PARENT_GATE,
    sourceGate: SOURCE_GATE,
    fieldCueSourceStatus: FIELD_CUE_SOURCE_STATUS,
    displayBoundaryStatus: DISPLAY_BOUNDARY_STATUS,
    acceptedSourceStateRegimeId: ACCEPTED_SOURCE_STATE_REGIME_ID,
    generatedSiteReadingV0Status: GENERATED_SITE_READING_V0_STATUS,
    generatedSiteReadingConsumptionStatus:
      GENERATED_SITE_READING_CONSUMPTION_STATUS,
    generatedSiteReadingRuntimeStatus: GENERATED_SITE_READING_RUNTIME_STATUS,
    semanticNamingStatus: SEMANTIC_NAMING_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    rawFieldWitnessStatus: RAW_FIELD_WITNESS_STATUS,
    structuralWitnessStatus: STRUCTURAL_WITNESS_STATUS,
    reductionLawAdoptionStatus: REDUCTION_LAW_ADOPTION_STATUS,
    legacyUiStatus: LEGACY_UI_STATUS,
    generatedSiteFieldCueRows,
    generatedSiteRelationEvidenceRows,
    generatedSiteBoundarySummary,
    nextStepRecommendation: {
      recommendedNextGate,
      d6MayIntegrateBoundaryIntoGeneratedSiteReadingV0:
        recommendedNextGate === D6_NEXT_GATE,
      d6MustStillNotAutoName: true,
    },
    diagnosticIntegrityStatus,
    boundaryReadinessStatus,
    recommendedNextGate,
    integrityIssueCount: integrityIssues.length,
    integrityIssues,
    ok: diagnosticIntegrityStatus === 'pass',
  };
}

function buildGeneratedSiteFieldCueRows(
  childRows: MultiProjectionConsumption['cueRowsByGeneratedChild'],
): GeneratedSiteFieldCueRow[] {
  return childRows.map((row) => ({
    childSiteId: row.childSiteId,
    sourceStateId: row.sourceStateId,
    fieldCueEvidenceStatus: FIELD_CUE_EVIDENCE_STATUS,
    propagationEvidence: {
      carrierWaveNumber: row.propagationCue.carrierWaveNumber,
      carrierPhase: row.propagationCue.carrierPhase,
      attenuation: row.propagationCue.attenuation,
      rawPropagationStatus: row.propagationCue.rawPropagationStatus,
      interpretation: row.propagationCue.cueInterpretation,
    },
    structuralEvidence: {
      structuralProjectionStatus:
        row.structuralCue.structuralProjectionStatus,
      relationCarrierStatus: row.structuralCue.relationCarrierStatus,
      interpretation: row.structuralCue.cueInterpretation,
    },
    reductionHonesty: {
      emittedTupleStatus: row.reductionHonesty.emittedTupleStatus,
      sourceSignatureStatus: row.reductionHonesty.sourceSignatureStatus,
      tupleLossWarning: row.reductionHonesty.tupleLossWarning,
    },
    generatedSiteUseEligibility: GENERATED_SITE_USE_ELIGIBILITY,
    requiredWarnings: [...REQUIRED_CHILD_WARNINGS],
  }));
}

function buildGeneratedSiteRelationEvidenceRows(
  relationRows: MultiProjectionConsumption['relationCueRows'],
): GeneratedSiteRelationEvidenceRow[] {
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
    fieldCueWarning: row.cueWarning,
    generatedSiteReadingWarning:
      'GeneratedSiteReadingV0 may later consume this only as warning-bearing FieldCue evidence; it is not final generated-site meaning.',
    relationUseEligibility: RELATION_USE_ELIGIBILITY,
    forbiddenInterpretations: [...FORBIDDEN_RELATION_INTERPRETATIONS],
  }));
}

function buildGeneratedSiteBoundarySummary(args: {
  generatedSiteFieldCueRows: GeneratedSiteFieldCueRow[];
  generatedSiteRelationEvidenceRows: GeneratedSiteRelationEvidenceRow[];
  integrityIssueCount: number;
}): GeneratedSiteBoundarySummary {
  const rawFieldVisibleClaimCount =
    args.generatedSiteRelationEvidenceRows.filter(relationClaimsRawFieldVisible)
      .length;
  const misleadingRiskRowCount = args.generatedSiteRelationEvidenceRows.filter(
    (row) => row.misleadingRisk,
  ).length;
  const tupleLossWarningCount = args.generatedSiteFieldCueRows.filter(
    (row) => row.reductionHonesty.tupleLossWarning,
  ).length;
  const semanticNamingClaimCount = countSemanticNamingClaims({
    generatedSiteFieldCueRows: args.generatedSiteFieldCueRows,
    generatedSiteRelationEvidenceRows: args.generatedSiteRelationEvidenceRows,
  });

  return {
    childEvidenceRowCount: args.generatedSiteFieldCueRows.length,
    relationEvidenceRowCount: args.generatedSiteRelationEvidenceRows.length,
    rawFieldVisibleClaimCount,
    misleadingRiskRowCount,
    tupleLossWarningCount,
    semanticNamingClaimCount,
    generatedSiteReadingBlocked: true,
    generatedSiteConsumptionAuthorized: false,
    boundaryReady:
      args.integrityIssueCount === 0 &&
      args.generatedSiteFieldCueRows.length === 6 &&
      args.generatedSiteRelationEvidenceRows.length === 3 &&
      rawFieldVisibleClaimCount === 0 &&
      misleadingRiskRowCount === 3 &&
      tupleLossWarningCount === 6 &&
      semanticNamingClaimCount === 0,
  };
}

function buildIntegrityIssues(args: {
  fieldCueReport: FieldCueV0Report | null;
  displayBoundaryReport: FieldCueV0MultiProjectionDisplayAdapterReport | null;
  generatedSiteFieldCueRows: GeneratedSiteFieldCueRow[];
  generatedSiteRelationEvidenceRows: GeneratedSiteRelationEvidenceRow[];
}): GeneratedSiteReadingV0FieldCueBoundaryIssue[] {
  const issues: GeneratedSiteReadingV0FieldCueBoundaryIssue[] = [];

  if (!args.fieldCueReport) {
    issues.push({
      code: 'missing-fieldcue-report',
      message: 'Gate D5 did not receive a FieldCueV0 report.',
    });
  } else if (!args.fieldCueReport.ok) {
    issues.push({
      code: 'fieldcue-report-not-ok',
      message: 'The consumed FieldCueV0 report is not diagnostically ok.',
      details: {
        fieldCueIssueCount: args.fieldCueReport.issueCount,
      },
    });
  }

  if (!args.displayBoundaryReport) {
    issues.push({
      code: 'missing-display-boundary-report',
      message: 'Gate D5 did not receive the mounted FieldCue display report.',
    });
  } else if (!args.displayBoundaryReport.ok) {
    issues.push({
      code: 'display-boundary-report-not-ok',
      message:
        'The consumed mounted FieldCue display boundary report is not ok.',
      details: {
        displayBoundaryIssueCount: args.displayBoundaryReport.integrityIssueCount,
      },
    });
  }

  if (args.generatedSiteFieldCueRows.length !== 6) {
    issues.push({
      code: 'missing-generated-site-fieldcue-rows',
      message: `Expected 6 generated-site FieldCue rows, got ${args.generatedSiteFieldCueRows.length}.`,
    });
  }

  if (args.generatedSiteRelationEvidenceRows.length !== 3) {
    issues.push({
      code: 'missing-generated-site-relation-evidence-rows',
      message: `Expected 3 generated-site relation evidence rows, got ${args.generatedSiteRelationEvidenceRows.length}.`,
    });
  }

  if (
    args.generatedSiteRelationEvidenceRows.some(relationClaimsRawFieldVisible)
  ) {
    issues.push({
      code: 'raw-field-visible-claim-leaked',
      message: 'Gate D5 leaked a raw-field-visible relation claim.',
    });
  }

  if (
    args.generatedSiteRelationEvidenceRows.some(
      (row) =>
        !row.misleadingRisk ||
        !row.relationVisibilityStatuses.includes(
          'misleading-if-read-as-raw-field',
        ) ||
        !row.fieldCueWarning.includes('misleading-if-read-as-raw-field') ||
        !row.forbiddenInterpretations.includes('do-not-drop-misleading-risk'),
    )
  ) {
    issues.push({
      code: 'missing-misleading-risk-warning',
      message:
        'Every generated-site relation evidence row must preserve misleading-risk warnings.',
    });
  }

  if (
    args.generatedSiteFieldCueRows.some(
      (row) =>
        row.reductionHonesty.emittedTupleStatus !==
          'propagation-facing-reduction-only' ||
        row.reductionHonesty.sourceSignatureStatus !==
          'structured-source-state-not-scalar-tuple' ||
        row.reductionHonesty.tupleLossWarning !== true ||
        !requiredWarningsExactlyMatch(row.requiredWarnings),
    ) ||
    args.fieldCueReport?.reductionLawAdoptionStatus !== 'not-adopted'
  ) {
    issues.push({
      code: 'scalar-tuple-treated-as-source-signature',
      message:
        'D5 must preserve scalar tuple loss as a warning, not a full source signature.',
    });
  }

  if (
    countSemanticNamingClaims({
      generatedSiteFieldCueRows: args.generatedSiteFieldCueRows,
      generatedSiteRelationEvidenceRows: args.generatedSiteRelationEvidenceRows,
    }) > 0 ||
    args.fieldCueReport?.semanticStatus !== 'not-semantic-naming'
  ) {
    issues.push({
      code: 'structural-witness-treated-as-semantic-naming',
      message:
        'D5 must not treat structural FieldCue evidence as semantic naming.',
    });
  }

  if (
    GENERATED_SITE_READING_V0_STATUS !== 'blocked' ||
    GENERATED_SITE_READING_RUNTIME_STATUS !== 'not-promoted' ||
    args.fieldCueReport?.generatedSiteReadingV0Status !== 'blocked' ||
    args.displayBoundaryReport?.generatedSiteReadingV0Status !== 'blocked' ||
    args.displayBoundaryReport?.generatedSiteReadingConsumptionStatus !==
      'not-authorized'
  ) {
    issues.push({
      code: 'generated-site-reading-promoted-too-early',
      message:
        'GeneratedSiteReadingV0 must remain blocked and unconsumed in Gate D5.',
    });
  }

  if (
    args.fieldCueReport?.topologyStatus !== 'not-topology-workspace' ||
    args.displayBoundaryReport?.topologyStatus !== 'not-topology-workspace' ||
    TOPOLOGY_STATUS !== 'not-topology-workspace'
  ) {
    issues.push({
      code: 'topology-leak',
      message: 'D5 must not enter topology workspace.',
    });
  }

  if (
    args.fieldCueReport?.packetWriteStatus !== 'not-packet-writing' ||
    args.displayBoundaryReport?.packetWriteStatus !== 'not-packet-writing' ||
    PACKET_WRITE_STATUS !== 'not-packet-writing'
  ) {
    issues.push({
      code: 'packet-writing-leak',
      message: 'D5 must not write packets.',
    });
  }

  if (
    args.fieldCueReport?.operationRegistryStatus !==
      'not-operation-registry-work' ||
    args.displayBoundaryReport?.operationRegistryStatus !==
      'not-operation-registry-work' ||
    OPERATION_REGISTRY_STATUS !== 'not-operation-registry-work' ||
    REDUCTION_LAW_ADOPTION_STATUS !== 'not-adopted'
  ) {
    issues.push({
      code: 'operation-registry-contaminated',
      message:
        'D5 must not contaminate operation registry work or adopt a reduction law.',
    });
  }

  return issues;
}

function pickRecommendedNextGate(args: {
  fieldCueReport: FieldCueV0Report | null;
  displayBoundaryReport: FieldCueV0MultiProjectionDisplayAdapterReport | null;
  diagnosticIntegrityStatus: GeneratedSiteReadingDiagnosticIntegrityStatus;
  boundaryReadinessStatus: GeneratedSiteReadingBoundaryReadinessStatus;
}): GeneratedSiteReadingRecommendedNextGate {
  if (!args.fieldCueReport?.ok || !args.displayBoundaryReport?.ok) {
    return 'Gate D4-revisit';
  }

  if (
    args.diagnosticIntegrityStatus !== 'pass' ||
    args.boundaryReadinessStatus !==
      'generated-site-reading-fieldcue-boundary-ready'
  ) {
    return 'Gate D5-review';
  }

  return D6_NEXT_GATE;
}

function relationClaimsRawFieldVisible(
  row: GeneratedSiteRelationEvidenceRow,
): boolean {
  return (
    row.rawFieldCueStatus === 'raw-field-visible' ||
    row.relationVisibilityStatuses.includes('raw-field-visible')
  );
}

function countSemanticNamingClaims(args: {
  generatedSiteFieldCueRows: GeneratedSiteFieldCueRow[];
  generatedSiteRelationEvidenceRows: GeneratedSiteRelationEvidenceRow[];
}): number {
  const childClaims = args.generatedSiteFieldCueRows.filter((row) =>
    String(row.structuralEvidence.interpretation).includes('semantic-name'),
  ).length;
  const relationClaims = args.generatedSiteRelationEvidenceRows.filter(
    (row) =>
      !row.forbiddenInterpretations.includes('do-not-read-as-semantic-name') ||
      String(row.generatedSiteReadingWarning).includes(
        'automatic semantic name',
      ),
  ).length;

  return childClaims + relationClaims;
}

function requiredWarningsExactlyMatch(
  warnings: GeneratedSiteReadingFieldCueRequiredWarning[],
): boolean {
  return (
    warnings.length === REQUIRED_CHILD_WARNINGS.length &&
    REQUIRED_CHILD_WARNINGS.every((warning, index) => warnings[index] === warning)
  );
}
