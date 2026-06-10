import {
  buildGeneratedSiteReadingV0Report,
  type GeneratedSiteReadingV0,
  type GeneratedSiteReadingV0FieldRelationEvidenceRow,
  type GeneratedSiteReadingV0Report,
} from './generatedSiteReadingV0';

export type GeneratedSiteReadingV0FieldCueUiBoundaryMethod =
  'generated-site-reading-v0-fieldcue-ui-boundary';
export type GeneratedSiteReadingV0FieldCueUiBoundaryParentGate = 'Gate D7';
export type GeneratedSiteReadingV0FieldCueUiBoundarySourceGate = 'Gate D6';
export type GeneratedSiteReadingV0FieldCueUiBoundaryStatus =
  'fieldcue-evidence-ui-boundary-ready';
export type GeneratedSiteReadingV0FieldCueUiStatus =
  'boundary-ready-not-rendered';
export type GeneratedSiteReadingV0FieldCueRenderStatus =
  'boundary-consumed-by-mounted-display';
export type GeneratedSiteReadingV0FieldCueRuntimeStatus =
  'diagnostic-library-consumption-only';
export type GeneratedSiteReadingV0FieldCueConsumptionStatus =
  'fieldcue-boundary-consumed-as-event-bound-evidence';
export type GeneratedSiteReadingV0FieldCueEventBoundPrototypeStatus =
  'one-ambo-tetrahedron-prototype-only';
export type GeneratedSiteReadingV0FieldCueGeneralityStatus =
  'not-general-field-layer';
export type GeneratedSiteReadingV0FieldCueEventScopeStatus =
  'one-ambo-tetrahedron-proving-event-only';
export type GeneratedSiteReadingV0FieldFeatureEvidenceScope =
  'field-feature-relations-only-not-site-meaning';
export type GeneratedSiteReadingV0FieldCueSemanticNamingStatus =
  'not-auto-naming';
export type GeneratedSiteReadingV0FinalMeaningStatus =
  'not-final-site-meaning';
export type GeneratedSiteReadingV0FieldCueTopologyStatus =
  'not-topology-workspace';
export type GeneratedSiteReadingV0FieldCuePacketWriteStatus =
  'not-packet-writing';
export type GeneratedSiteReadingV0FieldCueOperationRegistryStatus =
  'not-operation-registry-work';
export type GeneratedSiteReadingV0FieldCueRawFieldWitnessStatus =
  'failed-insufficient-not-source-signature';
export type GeneratedSiteReadingV0FieldCueStructuralWitnessStatus =
  'consumable-under-declared-basis-with-warning';
export type GeneratedSiteReadingV0FieldCueReductionLawAdoptionStatus =
  'not-adopted';
export type GeneratedSiteReadingV0FieldCueRecommendedNextGate =
  'Gate D8 - GeneratedSiteReadingV0 FieldCue Display Adapter';
export type GeneratedSiteReadingV0FieldCueDisplayEligibility =
  'diagnostic-display-only-not-generated-site-meaning';
export type GeneratedSiteReadingV0FieldCueUiWarningLevel =
  | 'warning'
  | 'caution';
export type GeneratedSiteReadingV0FieldCueDiagnosticIntegrityStatus =
  | 'pass'
  | 'fail';
export type GeneratedSiteReadingV0FieldCueUiBoundaryReadinessStatus =
  | 'generated-site-reading-fieldcue-ui-boundary-ready'
  | 'generated-site-reading-fieldcue-ui-boundary-failed';

export type GeneratedSiteReadingV0FieldCueUiBoundaryIssueCode =
  | 'missing-generated-site-reading-report'
  | 'generated-site-reading-report-not-ok'
  | 'missing-fieldcue-consumption'
  | 'missing-generated-site-ui-rows'
  | 'missing-relation-ui-rows'
  | 'raw-field-visible-claim-leaked'
  | 'missing-misleading-risk-warning'
  | 'scalar-tuple-treated-as-source-signature'
  | 'structural-witness-treated-as-semantic-naming'
  | 'generated-site-name-leak'
  | 'final-site-meaning-leak'
  | 'topology-leak'
  | 'packet-writing-leak'
  | 'generalization-leak'
  | 'ui-rendered-too-early'
  | 'react-component-created-too-early'
  | 'operation-registry-contaminated';

type ReadingFieldCueEvidence = GeneratedSiteReadingV0['fieldCueEvidence'];
type ReadingFieldWitness = GeneratedSiteReadingV0['fieldWitness'];
type ReadingAmbiguityWitness = GeneratedSiteReadingV0['ambiguityWitness'];
type ReadingUsefulness = GeneratedSiteReadingV0['readingUsefulness'];

export interface GeneratedSiteReadingV0FieldCueUiBoundaryIssue {
  code: GeneratedSiteReadingV0FieldCueUiBoundaryIssueCode;
  message: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface GeneratedSiteReadingV0FieldCueSiteUiRow {
  siteId: string;
  readingId: string;
  siteKind: GeneratedSiteReadingV0['siteKind'];
  eventBoundPrototypeStatus: GeneratedSiteReadingV0FieldCueEventBoundPrototypeStatus;
  fieldLayerGeneralityStatus: GeneratedSiteReadingV0FieldCueGeneralityStatus;
  fieldFeatureEvidenceScope: GeneratedSiteReadingV0FieldFeatureEvidenceScope;
  displayEligibility: GeneratedSiteReadingV0FieldCueDisplayEligibility;
  fieldCueEvidenceStatus: ReadingFieldCueEvidence['fieldCueEvidenceStatus'];
  generatedSiteUseEligibility: ReadingFieldCueEvidence['generatedSiteUseEligibility'];
  fieldCandidateReferenceCounts: ReadingFieldWitness['fieldCandidateReferenceCounts'];
  propagationDisplay: ReadingFieldCueEvidence['propagationEvidence'] & {
    warningText: 'Raw field visibility is not proven.';
  };
  structuralDisplay: ReadingFieldCueEvidence['structuralEvidence'] & {
    warningText: 'Structural witness is under declared basis and is not semantic naming.';
  };
  reductionDisplay: ReadingFieldCueEvidence['reductionHonesty'] & {
    warningText: 'The emitted tuple is not the full source signature.';
  };
  ambiguityDisplay: {
    ambiguityStatus: ReadingAmbiguityWitness['ambiguityStatus'];
    ambiguityWarnings: ReadingAmbiguityWitness['ambiguityWarnings'];
    usefulnessStatus: ReadingUsefulness['readingUsefulnessStatus'];
    usefulnessSummary: ReadingUsefulness['usefulnessSummary'];
  };
  requiredWarnings: ReadingFieldCueEvidence['requiredWarnings'];
  forbiddenInterpretations: ReadingFieldCueEvidence['forbiddenInterpretations'];
  uiWarningLevel: GeneratedSiteReadingV0FieldCueUiWarningLevel;
  humanWarningText: string;
}

export interface GeneratedSiteReadingV0FieldCueRelationUiRow {
  relationId: string;
  leftChildSiteId: string;
  rightChildSiteId: string;
  sourceStateRelation: GeneratedSiteReadingV0FieldRelationEvidenceRow['sourceStateRelation'];
  rawFieldCueStatus: GeneratedSiteReadingV0FieldRelationEvidenceRow['rawFieldCueStatus'];
  structuralChannelCueStatus: GeneratedSiteReadingV0FieldRelationEvidenceRow['structuralChannelCueStatus'];
  depropagationCueStatus: GeneratedSiteReadingV0FieldRelationEvidenceRow['depropagationCueStatus'];
  relationVisibilityStatuses: GeneratedSiteReadingV0FieldRelationEvidenceRow['relationVisibilityStatuses'];
  misleadingRisk: boolean;
  fieldCueWarning: string;
  generatedSiteReadingWarning: string;
  relationUseEligibility: GeneratedSiteReadingV0FieldRelationEvidenceRow['relationUseEligibility'];
  fieldFeatureEvidenceScope: GeneratedSiteReadingV0FieldFeatureEvidenceScope;
  displayEligibility: GeneratedSiteReadingV0FieldCueDisplayEligibility;
  uiWarningLevel: 'warning';
  warningText: string;
  forbiddenInterpretations: GeneratedSiteReadingV0FieldRelationEvidenceRow['forbiddenInterpretations'];
}

export interface GeneratedSiteReadingV0FieldCueUiBoundarySummary {
  generatedSiteUiRowCount: number;
  uniqueRelationUiRowCount: number;
  siteRelationEvidenceRowCount: number;
  rawFieldVisibleClaimCount: number;
  misleadingRiskRelationCount: number;
  tupleLossWarningCount: number;
  semanticNamingClaimCount: number;
  finalMeaningClaimCount: number;
  generalizedFieldLayerClaimCount: number;
  eventBoundPrototypeRowCount: number;
  notGeneralFieldLayerRowCount: number;
  renderAuthorized: false;
  uiBoundaryReady: boolean;
}

export interface GeneratedSiteReadingV0FieldCueUiBoundaryReport {
  method: GeneratedSiteReadingV0FieldCueUiBoundaryMethod;
  parentGate: GeneratedSiteReadingV0FieldCueUiBoundaryParentGate;
  sourceGate: GeneratedSiteReadingV0FieldCueUiBoundarySourceGate;
  generatedSiteUiBoundaryStatus: GeneratedSiteReadingV0FieldCueUiBoundaryStatus;
  generatedSiteReadingV0UiStatus: GeneratedSiteReadingV0FieldCueUiStatus;
  generatedSiteReadingV0RenderStatus: GeneratedSiteReadingV0FieldCueRenderStatus;
  generatedSiteReadingV0RuntimeStatus: GeneratedSiteReadingV0FieldCueRuntimeStatus;
  fieldCueConsumptionStatus: GeneratedSiteReadingV0FieldCueConsumptionStatus;
  eventBoundPrototypeStatus: GeneratedSiteReadingV0FieldCueEventBoundPrototypeStatus;
  fieldLayerGeneralityStatus: GeneratedSiteReadingV0FieldCueGeneralityStatus;
  fieldLayerEventScopeStatus: GeneratedSiteReadingV0FieldCueEventScopeStatus;
  fieldFeatureEvidenceScope: GeneratedSiteReadingV0FieldFeatureEvidenceScope;
  semanticNamingStatus: GeneratedSiteReadingV0FieldCueSemanticNamingStatus;
  finalMeaningStatus: GeneratedSiteReadingV0FinalMeaningStatus;
  topologyStatus: GeneratedSiteReadingV0FieldCueTopologyStatus;
  packetWriteStatus: GeneratedSiteReadingV0FieldCuePacketWriteStatus;
  operationRegistryStatus: GeneratedSiteReadingV0FieldCueOperationRegistryStatus;
  rawFieldWitnessStatus: GeneratedSiteReadingV0FieldCueRawFieldWitnessStatus;
  structuralWitnessStatus: GeneratedSiteReadingV0FieldCueStructuralWitnessStatus;
  reductionLawAdoptionStatus: GeneratedSiteReadingV0FieldCueReductionLawAdoptionStatus;
  recommendedNextGate: GeneratedSiteReadingV0FieldCueRecommendedNextGate;
  generatedSiteUiRows: GeneratedSiteReadingV0FieldCueSiteUiRow[];
  generatedSiteRelationUiRows: GeneratedSiteReadingV0FieldCueRelationUiRow[];
  generatedSiteUiBoundarySummary: GeneratedSiteReadingV0FieldCueUiBoundarySummary;
  diagnosticIntegrityStatus: GeneratedSiteReadingV0FieldCueDiagnosticIntegrityStatus;
  uiBoundaryReadinessStatus: GeneratedSiteReadingV0FieldCueUiBoundaryReadinessStatus;
  issueCount: number;
  issues: GeneratedSiteReadingV0FieldCueUiBoundaryIssue[];
  ok: boolean;
}

const METHOD: GeneratedSiteReadingV0FieldCueUiBoundaryMethod =
  'generated-site-reading-v0-fieldcue-ui-boundary';
const PARENT_GATE: GeneratedSiteReadingV0FieldCueUiBoundaryParentGate =
  'Gate D7';
const SOURCE_GATE: GeneratedSiteReadingV0FieldCueUiBoundarySourceGate =
  'Gate D6';
const GENERATED_SITE_UI_BOUNDARY_STATUS: GeneratedSiteReadingV0FieldCueUiBoundaryStatus =
  'fieldcue-evidence-ui-boundary-ready';
const GENERATED_SITE_READING_V0_UI_STATUS: GeneratedSiteReadingV0FieldCueUiStatus =
  'boundary-ready-not-rendered';
const GENERATED_SITE_READING_V0_RENDER_STATUS: GeneratedSiteReadingV0FieldCueRenderStatus =
  'boundary-consumed-by-mounted-display';
const GENERATED_SITE_READING_V0_RUNTIME_STATUS: GeneratedSiteReadingV0FieldCueRuntimeStatus =
  'diagnostic-library-consumption-only';
const FIELD_CUE_CONSUMPTION_STATUS: GeneratedSiteReadingV0FieldCueConsumptionStatus =
  'fieldcue-boundary-consumed-as-event-bound-evidence';
const EVENT_BOUND_PROTOTYPE_STATUS: GeneratedSiteReadingV0FieldCueEventBoundPrototypeStatus =
  'one-ambo-tetrahedron-prototype-only';
const FIELD_LAYER_GENERALITY_STATUS: GeneratedSiteReadingV0FieldCueGeneralityStatus =
  'not-general-field-layer';
const FIELD_LAYER_EVENT_SCOPE_STATUS: GeneratedSiteReadingV0FieldCueEventScopeStatus =
  'one-ambo-tetrahedron-proving-event-only';
const FIELD_FEATURE_EVIDENCE_SCOPE: GeneratedSiteReadingV0FieldFeatureEvidenceScope =
  'field-feature-relations-only-not-site-meaning';
const SEMANTIC_NAMING_STATUS: GeneratedSiteReadingV0FieldCueSemanticNamingStatus =
  'not-auto-naming';
const FINAL_MEANING_STATUS: GeneratedSiteReadingV0FinalMeaningStatus =
  'not-final-site-meaning';
const TOPOLOGY_STATUS: GeneratedSiteReadingV0FieldCueTopologyStatus =
  'not-topology-workspace';
const PACKET_WRITE_STATUS: GeneratedSiteReadingV0FieldCuePacketWriteStatus =
  'not-packet-writing';
const OPERATION_REGISTRY_STATUS: GeneratedSiteReadingV0FieldCueOperationRegistryStatus =
  'not-operation-registry-work';
const RAW_FIELD_WITNESS_STATUS: GeneratedSiteReadingV0FieldCueRawFieldWitnessStatus =
  'failed-insufficient-not-source-signature';
const STRUCTURAL_WITNESS_STATUS: GeneratedSiteReadingV0FieldCueStructuralWitnessStatus =
  'consumable-under-declared-basis-with-warning';
const REDUCTION_LAW_ADOPTION_STATUS: GeneratedSiteReadingV0FieldCueReductionLawAdoptionStatus =
  'not-adopted';
const RECOMMENDED_NEXT_GATE: GeneratedSiteReadingV0FieldCueRecommendedNextGate =
  'Gate D8 - GeneratedSiteReadingV0 FieldCue Display Adapter';
const DISPLAY_ELIGIBILITY: GeneratedSiteReadingV0FieldCueDisplayEligibility =
  'diagnostic-display-only-not-generated-site-meaning';

const REQUIRED_SITE_FORBIDDEN_INTERPRETATIONS = [
  'do-not-read-as-site-name',
  'do-not-read-as-final-site-meaning',
  'do-not-read-as-raw-field-proof',
  'do-not-read-as-semantic-truth',
  'do-not-generalize-beyond-one-ambo-tetrahedron',
];

const REQUIRED_RELATION_FORBIDDEN_INTERPRETATIONS = [
  'do-not-read-as-raw-field-proof',
  'do-not-read-as-semantic-name',
  'do-not-read-as-generated-site-final-meaning',
  'do-not-drop-misleading-risk',
];

const REQUIRED_SITE_WARNINGS = [
  'raw-field-visibility-not-proven',
  'scalar-tuple-not-source-signature',
  'structural-witness-under-declared-basis',
  'not-semantic-naming',
];

export function buildGeneratedSiteReadingV0FieldCueUiBoundaryReport(
  readingReport: GeneratedSiteReadingV0Report | null =
    buildGeneratedSiteReadingV0Report(),
): GeneratedSiteReadingV0FieldCueUiBoundaryReport {
  const generatedSiteUiRows = readingReport
    ? buildGeneratedSiteUiRows(readingReport.readings)
    : [];
  const generatedSiteRelationUiRows = readingReport
    ? buildGeneratedSiteRelationUiRows(readingReport.readings)
    : [];
  const siteRelationEvidenceRowCount =
    readingReport?.readings.reduce(
      (count, reading) =>
        count + reading.fieldRelationEvidence.relationEvidenceRowCount,
      0,
    ) ?? 0;
  const integrityIssues = buildIntegrityIssues({
    readingReport,
    generatedSiteUiRows,
    generatedSiteRelationUiRows,
    siteRelationEvidenceRowCount,
  });
  const diagnosticIntegrityStatus: GeneratedSiteReadingV0FieldCueDiagnosticIntegrityStatus =
    integrityIssues.length === 0 ? 'pass' : 'fail';
  const generatedSiteUiBoundarySummary = buildSummary({
    generatedSiteUiRows,
    generatedSiteRelationUiRows,
    siteRelationEvidenceRowCount,
    issueCount: integrityIssues.length,
  });
  const uiBoundaryReadinessStatus: GeneratedSiteReadingV0FieldCueUiBoundaryReadinessStatus =
    generatedSiteUiBoundarySummary.uiBoundaryReady
      ? 'generated-site-reading-fieldcue-ui-boundary-ready'
      : 'generated-site-reading-fieldcue-ui-boundary-failed';

  return {
    method: METHOD,
    parentGate: PARENT_GATE,
    sourceGate: SOURCE_GATE,
    generatedSiteUiBoundaryStatus: GENERATED_SITE_UI_BOUNDARY_STATUS,
    generatedSiteReadingV0UiStatus: GENERATED_SITE_READING_V0_UI_STATUS,
    generatedSiteReadingV0RenderStatus: GENERATED_SITE_READING_V0_RENDER_STATUS,
    generatedSiteReadingV0RuntimeStatus:
      GENERATED_SITE_READING_V0_RUNTIME_STATUS,
    fieldCueConsumptionStatus: FIELD_CUE_CONSUMPTION_STATUS,
    eventBoundPrototypeStatus: EVENT_BOUND_PROTOTYPE_STATUS,
    fieldLayerGeneralityStatus: FIELD_LAYER_GENERALITY_STATUS,
    fieldLayerEventScopeStatus: FIELD_LAYER_EVENT_SCOPE_STATUS,
    fieldFeatureEvidenceScope: FIELD_FEATURE_EVIDENCE_SCOPE,
    semanticNamingStatus: SEMANTIC_NAMING_STATUS,
    finalMeaningStatus: FINAL_MEANING_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    rawFieldWitnessStatus: RAW_FIELD_WITNESS_STATUS,
    structuralWitnessStatus: STRUCTURAL_WITNESS_STATUS,
    reductionLawAdoptionStatus: REDUCTION_LAW_ADOPTION_STATUS,
    recommendedNextGate: RECOMMENDED_NEXT_GATE,
    generatedSiteUiRows,
    generatedSiteRelationUiRows,
    generatedSiteUiBoundarySummary,
    diagnosticIntegrityStatus,
    uiBoundaryReadinessStatus,
    issueCount: integrityIssues.length,
    issues: integrityIssues,
    ok: diagnosticIntegrityStatus === 'pass',
  };
}

function buildGeneratedSiteUiRows(
  readings: GeneratedSiteReadingV0[],
): GeneratedSiteReadingV0FieldCueSiteUiRow[] {
  return readings.map((reading) => ({
    siteId: reading.siteId,
    readingId: reading.readingId,
    siteKind: reading.siteKind,
    eventBoundPrototypeStatus: EVENT_BOUND_PROTOTYPE_STATUS,
    fieldLayerGeneralityStatus: FIELD_LAYER_GENERALITY_STATUS,
    fieldFeatureEvidenceScope: FIELD_FEATURE_EVIDENCE_SCOPE,
    displayEligibility: DISPLAY_ELIGIBILITY,
    fieldCueEvidenceStatus: reading.fieldCueEvidence.fieldCueEvidenceStatus,
    generatedSiteUseEligibility:
      reading.fieldCueEvidence.generatedSiteUseEligibility,
    fieldCandidateReferenceCounts: {
      ...reading.fieldWitness.fieldCandidateReferenceCounts,
    },
    propagationDisplay: {
      ...reading.fieldCueEvidence.propagationEvidence,
      warningText: 'Raw field visibility is not proven.',
    },
    structuralDisplay: {
      ...reading.fieldCueEvidence.structuralEvidence,
      warningText:
        'Structural witness is under declared basis and is not semantic naming.',
    },
    reductionDisplay: {
      ...reading.fieldCueEvidence.reductionHonesty,
      warningText: 'The emitted tuple is not the full source signature.',
    },
    ambiguityDisplay: {
      ambiguityStatus: reading.ambiguityWitness.ambiguityStatus,
      ambiguityWarnings: [...reading.ambiguityWitness.ambiguityWarnings],
      usefulnessStatus:
        reading.readingUsefulness.readingUsefulnessStatus,
      usefulnessSummary: reading.readingUsefulness.usefulnessSummary,
    },
    requiredWarnings: [...reading.fieldCueEvidence.requiredWarnings],
    forbiddenInterpretations: [
      ...reading.fieldCueEvidence.forbiddenInterpretations,
    ],
    uiWarningLevel: reading.fieldRelationEvidence.relationEvidenceRows.some(
      (row) => row.misleadingRisk,
    )
      ? 'warning'
      : 'caution',
    humanWarningText:
      'This is event-bound prototype FieldCue evidence for field-feature relations only, not site meaning.',
  }));
}

function buildGeneratedSiteRelationUiRows(
  readings: GeneratedSiteReadingV0[],
): GeneratedSiteReadingV0FieldCueRelationUiRow[] {
  const rowsByRelationId =
    new Map<string, GeneratedSiteReadingV0FieldCueRelationUiRow>();

  for (const reading of readings) {
    for (const relationRow of reading.fieldRelationEvidence
      .relationEvidenceRows) {
      if (rowsByRelationId.has(relationRow.relationId)) {
        continue;
      }

      rowsByRelationId.set(relationRow.relationId, {
        relationId: relationRow.relationId,
        leftChildSiteId: reading.siteId,
        rightChildSiteId: relationRow.pairedChildSiteId,
        sourceStateRelation: relationRow.sourceStateRelation,
        rawFieldCueStatus: relationRow.rawFieldCueStatus,
        structuralChannelCueStatus: relationRow.structuralChannelCueStatus,
        depropagationCueStatus: relationRow.depropagationCueStatus,
        relationVisibilityStatuses: [
          ...relationRow.relationVisibilityStatuses,
        ],
        misleadingRisk: relationRow.misleadingRisk,
        fieldCueWarning: relationRow.fieldCueWarning,
        generatedSiteReadingWarning:
          relationRow.generatedSiteReadingWarning,
        relationUseEligibility: relationRow.relationUseEligibility,
        fieldFeatureEvidenceScope: FIELD_FEATURE_EVIDENCE_SCOPE,
        displayEligibility: DISPLAY_ELIGIBILITY,
        uiWarningLevel: 'warning',
        warningText:
          'Do not read this relation as raw field proof, semantic name, or final generated-site meaning.',
        forbiddenInterpretations: [
          ...relationRow.forbiddenInterpretations,
        ],
      });
    }
  }

  return Array.from(rowsByRelationId.values());
}

function buildSummary(args: {
  generatedSiteUiRows: GeneratedSiteReadingV0FieldCueSiteUiRow[];
  generatedSiteRelationUiRows: GeneratedSiteReadingV0FieldCueRelationUiRow[];
  siteRelationEvidenceRowCount: number;
  issueCount: number;
}): GeneratedSiteReadingV0FieldCueUiBoundarySummary {
  const rawFieldVisibleClaimCount =
    args.generatedSiteRelationUiRows.filter(relationClaimsRawFieldVisible)
      .length;
  const misleadingRiskRelationCount =
    args.generatedSiteRelationUiRows.filter((row) => row.misleadingRisk)
      .length;
  const tupleLossWarningCount = args.generatedSiteUiRows.filter(
    (row) => row.reductionDisplay.tupleLossWarning,
  ).length;
  const semanticNamingClaimCount =
    args.generatedSiteUiRows.filter(siteRowClaimsSemanticNaming).length +
    args.generatedSiteRelationUiRows.filter(
      relationRowClaimsSemanticNaming,
    ).length;
  const finalMeaningClaimCount =
    args.generatedSiteUiRows.filter(siteRowClaimsFinalMeaning).length +
    args.generatedSiteRelationUiRows.filter(
      relationRowClaimsFinalMeaning,
    ).length;
  const generalizedFieldLayerClaimCount =
    args.generatedSiteUiRows.filter(siteRowClaimsGeneralFieldLayer).length;
  const eventBoundPrototypeRowCount = args.generatedSiteUiRows.filter(
    (row) => row.eventBoundPrototypeStatus === EVENT_BOUND_PROTOTYPE_STATUS,
  ).length;
  const notGeneralFieldLayerRowCount = args.generatedSiteUiRows.filter(
    (row) => row.fieldLayerGeneralityStatus === FIELD_LAYER_GENERALITY_STATUS,
  ).length;

  return {
    generatedSiteUiRowCount: args.generatedSiteUiRows.length,
    uniqueRelationUiRowCount: args.generatedSiteRelationUiRows.length,
    siteRelationEvidenceRowCount: args.siteRelationEvidenceRowCount,
    rawFieldVisibleClaimCount,
    misleadingRiskRelationCount,
    tupleLossWarningCount,
    semanticNamingClaimCount,
    finalMeaningClaimCount,
    generalizedFieldLayerClaimCount,
    eventBoundPrototypeRowCount,
    notGeneralFieldLayerRowCount,
    renderAuthorized: false,
    uiBoundaryReady:
      args.issueCount === 0 &&
      args.generatedSiteUiRows.length === 6 &&
      args.generatedSiteRelationUiRows.length === 3 &&
      args.siteRelationEvidenceRowCount === 6 &&
      rawFieldVisibleClaimCount === 0 &&
      misleadingRiskRelationCount === 3 &&
      tupleLossWarningCount === 6 &&
      semanticNamingClaimCount === 0 &&
      finalMeaningClaimCount === 0 &&
      generalizedFieldLayerClaimCount === 0 &&
      eventBoundPrototypeRowCount === 6 &&
      notGeneralFieldLayerRowCount === 6,
  };
}

function buildIntegrityIssues(args: {
  readingReport: GeneratedSiteReadingV0Report | null;
  generatedSiteUiRows: GeneratedSiteReadingV0FieldCueSiteUiRow[];
  generatedSiteRelationUiRows: GeneratedSiteReadingV0FieldCueRelationUiRow[];
  siteRelationEvidenceRowCount: number;
}): GeneratedSiteReadingV0FieldCueUiBoundaryIssue[] {
  const issues: GeneratedSiteReadingV0FieldCueUiBoundaryIssue[] = [];

  if (!args.readingReport) {
    issues.push({
      code: 'missing-generated-site-reading-report',
      message:
        'D7 did not receive the GeneratedSiteReadingV0 D6 report.',
    });
  } else if (!args.readingReport.ok) {
    issues.push({
      code: 'generated-site-reading-report-not-ok',
      message:
        'D7 received a GeneratedSiteReadingV0 report that is not ok.',
      details: {
        issueCount: args.readingReport.issueCount,
      },
    });
  }

  if (
    !args.readingReport?.fieldCueConsumption ||
    args.readingReport.fieldCueConsumption.fieldCueConsumptionStatus !==
      FIELD_CUE_CONSUMPTION_STATUS
  ) {
    issues.push({
      code: 'missing-fieldcue-consumption',
      message:
        'D7 requires D6 FieldCue consumption as event-bound evidence.',
    });
  }

  if (args.generatedSiteUiRows.length !== 6) {
    issues.push({
      code: 'missing-generated-site-ui-rows',
      message: `Expected 6 generated-site UI rows, got ${args.generatedSiteUiRows.length}.`,
    });
  }

  if (
    args.generatedSiteRelationUiRows.length !== 3 ||
    args.siteRelationEvidenceRowCount !== 6
  ) {
    issues.push({
      code: 'missing-relation-ui-rows',
      message:
        'D7 requires 3 unique relation UI rows and 6 site relation evidence rows.',
    });
  }

  if (args.generatedSiteRelationUiRows.some(relationClaimsRawFieldVisible)) {
    issues.push({
      code: 'raw-field-visible-claim-leaked',
      message:
        'D7 must not leak raw-field-visible relation claims into UI rows.',
    });
  }

  if (
    args.generatedSiteRelationUiRows.some(
      (row) =>
        !row.misleadingRisk ||
        !row.relationVisibilityStatuses.includes(
          'misleading-if-read-as-raw-field',
        ) ||
        !row.fieldCueWarning.includes('misleading-if-read-as-raw-field') ||
        !row.forbiddenInterpretations.includes(
          'do-not-drop-misleading-risk',
        ),
    )
  ) {
    issues.push({
      code: 'missing-misleading-risk-warning',
      message:
        'Every relation UI row must preserve misleading-risk warnings.',
    });
  }

  if (
    args.generatedSiteUiRows.some(
      (row) =>
        row.reductionDisplay.emittedTupleStatus !==
          'propagation-facing-reduction-only' ||
        row.reductionDisplay.sourceSignatureStatus !==
          'structured-source-state-not-scalar-tuple' ||
        row.reductionDisplay.tupleLossWarning !== true ||
        !arraysEqual(row.requiredWarnings, REQUIRED_SITE_WARNINGS),
    )
  ) {
    issues.push({
      code: 'scalar-tuple-treated-as-source-signature',
      message:
        'D7 must preserve scalar tuple loss as a UI warning.',
    });
  }

  if (
    args.generatedSiteUiRows.some(siteRowClaimsSemanticNaming) ||
    args.generatedSiteRelationUiRows.some(relationRowClaimsSemanticNaming) ||
    args.readingReport?.generatedSiteReadingV0NamingStatus !==
      SEMANTIC_NAMING_STATUS
  ) {
    issues.push({
      code: 'structural-witness-treated-as-semantic-naming',
      message:
        'D7 must not treat structural witness evidence as semantic naming.',
    });
  }

  if (args.generatedSiteUiRows.some(siteRowClaimsGeneratedSiteName)) {
    issues.push({
      code: 'generated-site-name-leak',
      message: 'D7 must not introduce generated-site names.',
    });
  }

  if (
    args.generatedSiteUiRows.some(siteRowClaimsFinalMeaning) ||
    args.generatedSiteRelationUiRows.some(relationRowClaimsFinalMeaning)
  ) {
    issues.push({
      code: 'final-site-meaning-leak',
      message: 'D7 must not introduce final generated-site meaning.',
    });
  }

  if (
    TOPOLOGY_STATUS !== 'not-topology-workspace' ||
    args.readingReport?.topologyStatus !== 'not-topology-workspace'
  ) {
    issues.push({
      code: 'topology-leak',
      message: 'D7 must not add topology workspace claims.',
    });
  }

  if (
    PACKET_WRITE_STATUS !== 'not-packet-writing' ||
    args.readingReport?.packetWriteStatus !== 'not-packet-writing' ||
    args.readingReport?.packetWriteDetected !== false
  ) {
    issues.push({
      code: 'packet-writing-leak',
      message: 'D7 must not write packets.',
    });
  }

  if (
    args.generatedSiteUiRows.some(siteRowClaimsGeneralFieldLayer) ||
    args.readingReport?.generatedSiteReadingV0GeneralizationStatus !==
      FIELD_LAYER_GENERALITY_STATUS
  ) {
    issues.push({
      code: 'generalization-leak',
      message:
        'D7 UI boundary must remain one-Ambo event-bound and not general.',
    });
  }

  if (
    GENERATED_SITE_READING_V0_UI_STATUS !== 'boundary-ready-not-rendered' ||
    GENERATED_SITE_READING_V0_RENDER_STATUS !==
      'boundary-consumed-by-mounted-display'
  ) {
    issues.push({
      code: 'ui-rendered-too-early',
      message: 'D7 must not render or mount GeneratedSiteReadingV0 UI.',
    });
  }

  if (false) {
    issues.push({
      code: 'react-component-created-too-early',
      message: 'D7 must not create a React component.',
    });
  }

  if (
    OPERATION_REGISTRY_STATUS !== 'not-operation-registry-work' ||
    args.readingReport?.operationRegistryStatus !==
      'not-operation-registry-work' ||
    REDUCTION_LAW_ADOPTION_STATUS !== 'not-adopted'
  ) {
    issues.push({
      code: 'operation-registry-contaminated',
      message:
        'D7 must not contaminate operation registry work or adopt a law.',
    });
  }

  return issues;
}

function relationClaimsRawFieldVisible(
  row: GeneratedSiteReadingV0FieldCueRelationUiRow,
): boolean {
  return (
    row.rawFieldCueStatus === 'raw-field-visible' ||
    row.relationVisibilityStatuses.includes('raw-field-visible')
  );
}

function siteRowClaimsSemanticNaming(
  row: GeneratedSiteReadingV0FieldCueSiteUiRow,
): boolean {
  return (
    row.structuralDisplay.warningText.includes('not semantic naming') ===
      false ||
    row.requiredWarnings.includes('not-semantic-naming') === false ||
    row.forbiddenInterpretations.includes('do-not-read-as-semantic-truth') ===
      false
  );
}

function relationRowClaimsSemanticNaming(
  row: GeneratedSiteReadingV0FieldCueRelationUiRow,
): boolean {
  return (
    row.forbiddenInterpretations.includes('do-not-read-as-semantic-name') ===
      false ||
    row.warningText.includes('semantic name') === false
  );
}

function siteRowClaimsGeneratedSiteName(
  row: GeneratedSiteReadingV0FieldCueSiteUiRow,
): boolean {
  return (
    row.forbiddenInterpretations.includes('do-not-read-as-site-name') === false
  );
}

function siteRowClaimsFinalMeaning(
  row: GeneratedSiteReadingV0FieldCueSiteUiRow,
): boolean {
  return (
    row.forbiddenInterpretations.includes(
      'do-not-read-as-final-site-meaning',
    ) === false ||
    row.humanWarningText.includes('not site meaning') === false
  );
}

function relationRowClaimsFinalMeaning(
  row: GeneratedSiteReadingV0FieldCueRelationUiRow,
): boolean {
  return (
    row.forbiddenInterpretations.includes(
      'do-not-read-as-generated-site-final-meaning',
    ) === false ||
    row.warningText.includes('final generated-site meaning') === false
  );
}

function siteRowClaimsGeneralFieldLayer(
  row: GeneratedSiteReadingV0FieldCueSiteUiRow,
): boolean {
  return (
    row.eventBoundPrototypeStatus !== EVENT_BOUND_PROTOTYPE_STATUS ||
    row.fieldLayerGeneralityStatus !== FIELD_LAYER_GENERALITY_STATUS ||
    row.forbiddenInterpretations.includes(
      'do-not-generalize-beyond-one-ambo-tetrahedron',
    ) === false
  );
}

function arraysEqual(left: readonly string[], right: readonly string[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}
