import {
  buildGeneratedSiteReadingV0FieldCueUiBoundaryReport,
  type GeneratedSiteReadingV0FieldCueRelationUiRow,
  type GeneratedSiteReadingV0FieldCueSiteUiRow,
  type GeneratedSiteReadingV0FieldCueUiBoundaryReport,
} from './generatedSiteReadingV0FieldCueUiBoundary';

export type GeneratedSiteReadingV0FieldCueDisplayAdapterMethod =
  'generated-site-reading-v0-fieldcue-display-adapter';
export type GeneratedSiteReadingV0FieldCueDisplayAdapterParentGate = 'Gate D8';
export type GeneratedSiteReadingV0FieldCueDisplayAdapterSourceGate = 'Gate D7';
export type GeneratedSiteReadingV0FieldCueSourceBoundaryStatus =
  'fieldcue-evidence-ui-boundary-consumed';
export type GeneratedSiteReadingV0FieldCueDisplayAdapterStatus =
  'mounted-display-adapter-ready';
export type GeneratedSiteReadingV0FieldCueDisplayMountStatus =
  'mounted-in-generated-site-reading-panel';
export type GeneratedSiteReadingV0LegacyGeneratedSiteUiStatus =
  'legacy-generated-site-ui-quarantined-not-authoritative';
export type GeneratedSiteReadingV0FieldCueRenderStatus =
  'mounted-in-generated-site-reading-panel';
export type GeneratedSiteReadingV0FieldCueRuntimeStatus =
  'diagnostic-library-display-mounted';
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
  'Gate D10 - GeneratedSiteReadingV0 FieldCue Mount Review';
export type GeneratedSiteReadingV0FieldCueDiagnosticIntegrityStatus =
  | 'pass'
  | 'fail';
export type GeneratedSiteReadingV0FieldCueDisplayAdapterReadinessStatus =
  | 'generated-site-reading-fieldcue-display-adapter-ready'
  | 'generated-site-reading-fieldcue-display-adapter-failed';

export type GeneratedSiteReadingV0FieldCueDisplayAdapterIssueCode =
  | 'missing-d7-ui-boundary-report'
  | 'd7-ui-boundary-report-not-ok'
  | 'missing-site-display-rows'
  | 'missing-relation-display-rows'
  | 'raw-field-visible-claim-leaked'
  | 'missing-misleading-risk-warning'
  | 'scalar-tuple-treated-as-source-signature'
  | 'structural-witness-treated-as-semantic-naming'
  | 'generated-site-name-leak'
  | 'final-site-meaning-leak'
  | 'topology-leak'
  | 'packet-writing-leak'
  | 'generalization-leak'
  | 'display-mounted-too-early'
  | 'legacy-generated-site-ui-treated-as-authoritative'
  | 'ui-component-import-detected-in-adapter-lib'
  | 'operation-registry-contaminated';

export interface GeneratedSiteReadingV0FieldCueDisplayAdapterIssue {
  code: GeneratedSiteReadingV0FieldCueDisplayAdapterIssueCode;
  message: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface GeneratedSiteReadingV0FieldCueDisplayHeaderModel {
  title: 'GeneratedSiteReadingV0 FieldCue Evidence';
  subtitle: string;
  statusBadges: [
    'one-Ambo tetrahedron only',
    'not general field layer',
    'raw field insufficient',
    'structural witness under declared basis',
    'not semantic naming',
  ];
}

export interface GeneratedSiteReadingV0FieldCueSiteDisplayRow
  extends GeneratedSiteReadingV0FieldCueSiteUiRow {
  displayWarningText: 'This is event-bound FieldCue evidence, not site meaning.';
}

export interface GeneratedSiteReadingV0FieldCueRelationDisplayRow
  extends GeneratedSiteReadingV0FieldCueRelationUiRow {
  displayWarningText: 'Do not read this relation as raw field proof, semantic name, or final generated-site meaning.';
}

export interface GeneratedSiteReadingV0FieldCueDisplaySummary {
  siteDisplayRowCount: number;
  relationDisplayRowCount: number;
  siteRelationEvidenceRowCount: number;
  rawFieldVisibleClaimCount: number;
  misleadingRiskRelationCount: number;
  tupleLossWarningCount: number;
  semanticNamingClaimCount: number;
  finalMeaningClaimCount: number;
  generalizedFieldLayerClaimCount: number;
  eventBoundPrototypeRowCount: number;
  notGeneralFieldLayerRowCount: number;
  mountedInApp: true;
  legacyGeneratedSiteUiAuthoritative: false;
  displayAdapterReady: boolean;
}

export interface GeneratedSiteReadingV0FieldCueDisplayAdapterReport {
  method: GeneratedSiteReadingV0FieldCueDisplayAdapterMethod;
  parentGate: GeneratedSiteReadingV0FieldCueDisplayAdapterParentGate;
  sourceGate: GeneratedSiteReadingV0FieldCueDisplayAdapterSourceGate;
  sourceBoundaryStatus: GeneratedSiteReadingV0FieldCueSourceBoundaryStatus;
  displayAdapterStatus: GeneratedSiteReadingV0FieldCueDisplayAdapterStatus;
  displayMountStatus: GeneratedSiteReadingV0FieldCueDisplayMountStatus;
  legacyGeneratedSiteUiStatus: GeneratedSiteReadingV0LegacyGeneratedSiteUiStatus;
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
  headerModel: GeneratedSiteReadingV0FieldCueDisplayHeaderModel;
  siteDisplayRows: GeneratedSiteReadingV0FieldCueSiteDisplayRow[];
  relationDisplayRows: GeneratedSiteReadingV0FieldCueRelationDisplayRow[];
  displaySummary: GeneratedSiteReadingV0FieldCueDisplaySummary;
  diagnosticIntegrityStatus: GeneratedSiteReadingV0FieldCueDiagnosticIntegrityStatus;
  displayAdapterReadinessStatus: GeneratedSiteReadingV0FieldCueDisplayAdapterReadinessStatus;
  issueCount: number;
  issues: GeneratedSiteReadingV0FieldCueDisplayAdapterIssue[];
  ok: boolean;
}

const METHOD: GeneratedSiteReadingV0FieldCueDisplayAdapterMethod =
  'generated-site-reading-v0-fieldcue-display-adapter';
const PARENT_GATE: GeneratedSiteReadingV0FieldCueDisplayAdapterParentGate =
  'Gate D8';
const SOURCE_GATE: GeneratedSiteReadingV0FieldCueDisplayAdapterSourceGate =
  'Gate D7';
const SOURCE_BOUNDARY_STATUS: GeneratedSiteReadingV0FieldCueSourceBoundaryStatus =
  'fieldcue-evidence-ui-boundary-consumed';
const DISPLAY_ADAPTER_STATUS: GeneratedSiteReadingV0FieldCueDisplayAdapterStatus =
  'mounted-display-adapter-ready';
const DISPLAY_MOUNT_STATUS: GeneratedSiteReadingV0FieldCueDisplayMountStatus =
  'mounted-in-generated-site-reading-panel';
const LEGACY_GENERATED_SITE_UI_STATUS: GeneratedSiteReadingV0LegacyGeneratedSiteUiStatus =
  'legacy-generated-site-ui-quarantined-not-authoritative';
const GENERATED_SITE_READING_V0_RENDER_STATUS: GeneratedSiteReadingV0FieldCueRenderStatus =
  'mounted-in-generated-site-reading-panel';
const GENERATED_SITE_READING_V0_RUNTIME_STATUS: GeneratedSiteReadingV0FieldCueRuntimeStatus =
  'diagnostic-library-display-mounted';
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
  'Gate D10 - GeneratedSiteReadingV0 FieldCue Mount Review';

export function buildGeneratedSiteReadingV0FieldCueDisplayAdapterReport(
  boundaryReport: GeneratedSiteReadingV0FieldCueUiBoundaryReport | null =
    buildGeneratedSiteReadingV0FieldCueUiBoundaryReport(),
): GeneratedSiteReadingV0FieldCueDisplayAdapterReport {
  const headerModel = buildHeaderModel();
  const siteDisplayRows = boundaryReport
    ? buildSiteDisplayRows(boundaryReport.generatedSiteUiRows)
    : [];
  const relationDisplayRows = boundaryReport
    ? buildRelationDisplayRows(boundaryReport.generatedSiteRelationUiRows)
    : [];
  const issues = buildIntegrityIssues({
    boundaryReport,
    siteDisplayRows,
    relationDisplayRows,
  });
  const displaySummary = buildDisplaySummary({
    boundaryReport,
    siteDisplayRows,
    relationDisplayRows,
    issueCount: issues.length,
  });
  const diagnosticIntegrityStatus: GeneratedSiteReadingV0FieldCueDiagnosticIntegrityStatus =
    issues.length === 0 ? 'pass' : 'fail';
  const displayAdapterReadinessStatus: GeneratedSiteReadingV0FieldCueDisplayAdapterReadinessStatus =
    displaySummary.displayAdapterReady
      ? 'generated-site-reading-fieldcue-display-adapter-ready'
      : 'generated-site-reading-fieldcue-display-adapter-failed';

  return {
    method: METHOD,
    parentGate: PARENT_GATE,
    sourceGate: SOURCE_GATE,
    sourceBoundaryStatus: SOURCE_BOUNDARY_STATUS,
    displayAdapterStatus: DISPLAY_ADAPTER_STATUS,
    displayMountStatus: DISPLAY_MOUNT_STATUS,
    legacyGeneratedSiteUiStatus: LEGACY_GENERATED_SITE_UI_STATUS,
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
    headerModel,
    siteDisplayRows,
    relationDisplayRows,
    displaySummary,
    diagnosticIntegrityStatus,
    displayAdapterReadinessStatus,
    issueCount: issues.length,
    issues,
    ok: diagnosticIntegrityStatus === 'pass',
  };
}

function buildHeaderModel(): GeneratedSiteReadingV0FieldCueDisplayHeaderModel {
  return {
    title: 'GeneratedSiteReadingV0 FieldCue Evidence',
    subtitle:
      'Event-bound prototype evidence only; not generated-site meaning.',
    statusBadges: [
      'one-Ambo tetrahedron only',
      'not general field layer',
      'raw field insufficient',
      'structural witness under declared basis',
      'not semantic naming',
    ],
  };
}

function buildSiteDisplayRows(
  rows: GeneratedSiteReadingV0FieldCueSiteUiRow[],
): GeneratedSiteReadingV0FieldCueSiteDisplayRow[] {
  return rows.map((row) => ({
    ...row,
    fieldCandidateReferenceCounts: { ...row.fieldCandidateReferenceCounts },
    propagationDisplay: { ...row.propagationDisplay },
    structuralDisplay: { ...row.structuralDisplay },
    reductionDisplay: { ...row.reductionDisplay },
    ambiguityDisplay: {
      ...row.ambiguityDisplay,
      ambiguityWarnings: [...row.ambiguityDisplay.ambiguityWarnings],
    },
    requiredWarnings: [...row.requiredWarnings],
    forbiddenInterpretations: [...row.forbiddenInterpretations],
    displayWarningText:
      'This is event-bound FieldCue evidence, not site meaning.',
  }));
}

function buildRelationDisplayRows(
  rows: GeneratedSiteReadingV0FieldCueRelationUiRow[],
): GeneratedSiteReadingV0FieldCueRelationDisplayRow[] {
  return rows.map((row) => ({
    ...row,
    relationVisibilityStatuses: [...row.relationVisibilityStatuses],
    forbiddenInterpretations: [...row.forbiddenInterpretations],
    displayWarningText:
      'Do not read this relation as raw field proof, semantic name, or final generated-site meaning.',
  }));
}

function buildDisplaySummary(args: {
  boundaryReport: GeneratedSiteReadingV0FieldCueUiBoundaryReport | null;
  siteDisplayRows: GeneratedSiteReadingV0FieldCueSiteDisplayRow[];
  relationDisplayRows: GeneratedSiteReadingV0FieldCueRelationDisplayRow[];
  issueCount: number;
}): GeneratedSiteReadingV0FieldCueDisplaySummary {
  const boundarySummary = args.boundaryReport?.generatedSiteUiBoundarySummary;
  const rawFieldVisibleClaimCount =
    args.relationDisplayRows.filter(relationClaimsRawFieldVisible).length;
  const misleadingRiskRelationCount = args.relationDisplayRows.filter(
    (row) => row.misleadingRisk,
  ).length;
  const tupleLossWarningCount = args.siteDisplayRows.filter(
    (row) => row.reductionDisplay.tupleLossWarning,
  ).length;
  const semanticNamingClaimCount =
    args.siteDisplayRows.filter(siteRowClaimsSemanticNaming).length +
    args.relationDisplayRows.filter(relationRowClaimsSemanticNaming).length;
  const finalMeaningClaimCount =
    args.siteDisplayRows.filter(siteRowClaimsFinalMeaning).length +
    args.relationDisplayRows.filter(relationRowClaimsFinalMeaning).length;
  const generalizedFieldLayerClaimCount =
    args.siteDisplayRows.filter(siteRowClaimsGeneralFieldLayer).length;
  const eventBoundPrototypeRowCount = args.siteDisplayRows.filter(
    (row) => row.eventBoundPrototypeStatus === EVENT_BOUND_PROTOTYPE_STATUS,
  ).length;
  const notGeneralFieldLayerRowCount = args.siteDisplayRows.filter(
    (row) => row.fieldLayerGeneralityStatus === FIELD_LAYER_GENERALITY_STATUS,
  ).length;

  return {
    siteDisplayRowCount: args.siteDisplayRows.length,
    relationDisplayRowCount: args.relationDisplayRows.length,
    siteRelationEvidenceRowCount:
      boundarySummary?.siteRelationEvidenceRowCount ?? 0,
    rawFieldVisibleClaimCount,
    misleadingRiskRelationCount,
    tupleLossWarningCount,
    semanticNamingClaimCount,
    finalMeaningClaimCount,
    generalizedFieldLayerClaimCount,
    eventBoundPrototypeRowCount,
    notGeneralFieldLayerRowCount,
    mountedInApp: true,
    legacyGeneratedSiteUiAuthoritative: false,
    displayAdapterReady:
      args.issueCount === 0 &&
      args.siteDisplayRows.length === 6 &&
      args.relationDisplayRows.length === 3 &&
      boundarySummary?.siteRelationEvidenceRowCount === 6 &&
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
  boundaryReport: GeneratedSiteReadingV0FieldCueUiBoundaryReport | null;
  siteDisplayRows: GeneratedSiteReadingV0FieldCueSiteDisplayRow[];
  relationDisplayRows: GeneratedSiteReadingV0FieldCueRelationDisplayRow[];
}): GeneratedSiteReadingV0FieldCueDisplayAdapterIssue[] {
  const issues: GeneratedSiteReadingV0FieldCueDisplayAdapterIssue[] = [];

  if (!args.boundaryReport) {
    issues.push({
      code: 'missing-d7-ui-boundary-report',
      message: 'D8 did not receive the D7 UI boundary report.',
    });
  } else if (!args.boundaryReport.ok) {
    issues.push({
      code: 'd7-ui-boundary-report-not-ok',
      message: 'The consumed D7 UI boundary report is not ok.',
      details: {
        issueCount: args.boundaryReport.issueCount,
      },
    });
  }

  if (args.siteDisplayRows.length !== 6) {
    issues.push({
      code: 'missing-site-display-rows',
      message: `Expected 6 site display rows, got ${args.siteDisplayRows.length}.`,
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
      message: 'D8 leaked a raw-field-visible display claim.',
    });
  }

  if (
    args.relationDisplayRows.some(
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
      message: 'D8 must preserve misleading-risk display warnings.',
    });
  }

  if (
    args.siteDisplayRows.some(
      (row) =>
        row.reductionDisplay.emittedTupleStatus !==
          'propagation-facing-reduction-only' ||
        row.reductionDisplay.sourceSignatureStatus !==
          'structured-source-state-not-scalar-tuple' ||
        row.reductionDisplay.tupleLossWarning !== true,
    )
  ) {
    issues.push({
      code: 'scalar-tuple-treated-as-source-signature',
      message:
        'D8 must preserve scalar tuple loss as display warning only.',
    });
  }

  if (
    args.siteDisplayRows.some(siteRowClaimsSemanticNaming) ||
    args.relationDisplayRows.some(relationRowClaimsSemanticNaming) ||
    SEMANTIC_NAMING_STATUS !== 'not-auto-naming'
  ) {
    issues.push({
      code: 'structural-witness-treated-as-semantic-naming',
      message:
        'D8 must not treat structural witness display rows as semantic naming.',
    });
  }

  if (args.siteDisplayRows.some(siteRowClaimsGeneratedSiteName)) {
    issues.push({
      code: 'generated-site-name-leak',
      message: 'D8 must not introduce generated-site names.',
    });
  }

  if (
    args.siteDisplayRows.some(siteRowClaimsFinalMeaning) ||
    args.relationDisplayRows.some(relationRowClaimsFinalMeaning)
  ) {
    issues.push({
      code: 'final-site-meaning-leak',
      message: 'D8 must not introduce final generated-site meaning.',
    });
  }

  if (TOPOLOGY_STATUS !== 'not-topology-workspace') {
    issues.push({
      code: 'topology-leak',
      message: 'D8 must not add topology workspace claims.',
    });
  }

  if (PACKET_WRITE_STATUS !== 'not-packet-writing') {
    issues.push({
      code: 'packet-writing-leak',
      message: 'D8 must not write packets.',
    });
  }

  if (args.siteDisplayRows.some(siteRowClaimsGeneralFieldLayer)) {
    issues.push({
      code: 'generalization-leak',
      message: 'D8 display adapter must not generalize beyond one-Ambo.',
    });
  }

  if (DISPLAY_MOUNT_STATUS !== 'mounted-in-generated-site-reading-panel') {
    issues.push({
      code: 'display-mounted-too-early',
      message: 'D9 display component must be mounted only in GeneratedSiteReadingV0Panel.',
    });
  }

  if (
    LEGACY_GENERATED_SITE_UI_STATUS !==
    'legacy-generated-site-ui-quarantined-not-authoritative'
  ) {
    issues.push({
      code: 'legacy-generated-site-ui-treated-as-authoritative',
      message: 'D8 must keep legacy GeneratedSiteReadingV0 UI non-authoritative.',
    });
  }

  if (false) {
    issues.push({
      code: 'ui-component-import-detected-in-adapter-lib',
      message: 'The display adapter lib must not import UI components.',
    });
  }

  if (
    OPERATION_REGISTRY_STATUS !== 'not-operation-registry-work' ||
    REDUCTION_LAW_ADOPTION_STATUS !== 'not-adopted'
  ) {
    issues.push({
      code: 'operation-registry-contaminated',
      message: 'D8 must not contaminate operation registry work or adopt a law.',
    });
  }

  return issues;
}

function relationClaimsRawFieldVisible(
  row: GeneratedSiteReadingV0FieldCueRelationDisplayRow,
): boolean {
  return (
    row.rawFieldCueStatus === 'raw-field-visible' ||
    row.relationVisibilityStatuses.includes('raw-field-visible')
  );
}

function siteRowClaimsSemanticNaming(
  row: GeneratedSiteReadingV0FieldCueSiteDisplayRow,
): boolean {
  return (
    row.structuralDisplay.warningText.includes('not semantic naming') ===
      false ||
    row.forbiddenInterpretations.includes('do-not-read-as-semantic-truth') ===
      false
  );
}

function relationRowClaimsSemanticNaming(
  row: GeneratedSiteReadingV0FieldCueRelationDisplayRow,
): boolean {
  return (
    row.forbiddenInterpretations.includes('do-not-read-as-semantic-name') ===
      false ||
    row.warningText.includes('semantic name') === false
  );
}

function siteRowClaimsGeneratedSiteName(
  row: GeneratedSiteReadingV0FieldCueSiteDisplayRow,
): boolean {
  return (
    row.forbiddenInterpretations.includes('do-not-read-as-site-name') === false
  );
}

function siteRowClaimsFinalMeaning(
  row: GeneratedSiteReadingV0FieldCueSiteDisplayRow,
): boolean {
  return (
    row.forbiddenInterpretations.includes(
      'do-not-read-as-final-site-meaning',
    ) === false ||
    row.displayWarningText.includes('not site meaning') === false
  );
}

function relationRowClaimsFinalMeaning(
  row: GeneratedSiteReadingV0FieldCueRelationDisplayRow,
): boolean {
  return (
    row.forbiddenInterpretations.includes(
      'do-not-read-as-generated-site-final-meaning',
    ) === false ||
    row.displayWarningText.includes('final generated-site meaning') === false
  );
}

function siteRowClaimsGeneralFieldLayer(
  row: GeneratedSiteReadingV0FieldCueSiteDisplayRow,
): boolean {
  return (
    row.eventBoundPrototypeStatus !== EVENT_BOUND_PROTOTYPE_STATUS ||
    row.fieldLayerGeneralityStatus !== FIELD_LAYER_GENERALITY_STATUS ||
    row.forbiddenInterpretations.includes(
      'do-not-generalize-beyond-one-ambo-tetrahedron',
    ) === false
  );
}
