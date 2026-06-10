import { createSeedShape } from '../data/seeds';
import { applyAmboDissection } from './ambo';
import {
  buildFieldCueV0Report,
  type FieldCueV0,
  type FieldCueV0ParticipationStatus,
  type FieldCueV0SiteId,
} from './fieldCueV0';
import {
  buildGeneratedSiteReadingV0FieldCueBoundaryReport,
  type GeneratedSiteFieldCueRow,
  type GeneratedSiteReadingV0FieldCueBoundaryReport,
  type GeneratedSiteRelationEvidenceRow,
} from './generatedSiteReadingV0FieldCueBoundary';

export type GeneratedSiteReadingV0Method =
  'generated-site-reading-v0-diagnostic';
export type GeneratedSiteReadingV0DiagnosticScope =
  'generated-site-reading-v0-one-ambo-tetrahedron-only';
export type GeneratedSiteReadingV0PolicyId =
  'generated-site-reading-v0-one-ambo-tetrahedron';
export type GeneratedSiteReadingV0EventScopeStatus =
  'one-ambo-tetrahedron-proving-event';
export type GeneratedSiteReadingV0FieldLayerStatus =
  'event-bound-profile-aware-prototype';
export type GeneratedSiteReadingV0GeneralityStatus =
  'not-general-reading-layer';
export type GeneratedSiteReadingV0PortabilityStatus = 'untested';
export type GeneratedSiteReadingV0SemanticStatus = 'not-semantic-naming';
export type GeneratedSiteReadingV0TopologyStatus = 'not-topology-workspace';
export type GeneratedSiteReadingV0PacketWriteStatus = 'not-packet-writing';
export type GeneratedSiteReadingV0ShapeMutationStatus = 'not-shape-mutation';
export type GeneratedSiteReadingV0NamingStateStatus = 'not-implemented';
export type GeneratedSiteReadingV0HumanNamingAuthorityStatus = 'human-names';
export type GeneratedSiteReadingV0SiteKind = 'generated-midpoint-child';
export type GeneratedSiteReadingV0GeometryWitnessStatus =
  | 'available'
  | 'unsupported'
  | 'incomplete';
export type GeneratedSiteReadingV0FieldCueStatus =
  | 'available'
  | 'unavailable'
  | 'issue';
export type GeneratedSiteReadingV0AtomicWitnessStatus =
  | 'event-bound-birth-law-available'
  | 'not-atomic-workspace'
  | 'unsupported';
export type GeneratedSiteReadingV0AmbiguityStatus =
  | 'clear-enough-for-inspection'
  | 'candidate-only'
  | 'degenerate'
  | 'sensitive'
  | 'saturated'
  | 'weak'
  | 'unsupported'
  | 'misleading-risk';
export type GeneratedSiteReadingV0NamingPromptStatus = 'question-only';
export type GeneratedSiteReadingV0UsefulnessStatus =
  | 'useful-for-human-inspection'
  | 'weak-field-pressure'
  | 'candidate-only'
  | 'degenerate-warning'
  | 'unsupported'
  | 'misleading-risk';
export type GeneratedSiteReadingV0FieldCueConsumptionStatus =
  'fieldcue-boundary-consumed-as-event-bound-evidence';
export type GeneratedSiteReadingV0EventBoundPrototypeStatus =
  'one-ambo-tetrahedron-prototype-only';
export type GeneratedSiteReadingV0FieldLayerGeneralityStatus =
  'not-general-field-layer';
export type GeneratedSiteReadingV0RuntimeStatus =
  'diagnostic-library-consumption-only';
export type GeneratedSiteReadingV0UiStatus = 'not-ui-work';
export type GeneratedSiteReadingV0NamingStatus = 'not-auto-naming';
export type GeneratedSiteReadingV0GeneralizationStatus =
  'not-general-field-layer';
export type GeneratedSiteReadingV0FieldLayerEventScopeStatus =
  'one-ambo-tetrahedron-proving-event-only';
export type GeneratedSiteReadingV0RecommendedNextGate =
  'Gate D7 - GeneratedSiteReadingV0 FieldCue UI Boundary';
export type GeneratedSiteReadingV0DiagnosticIntegrityStatus = 'pass' | 'fail';
export type GeneratedSiteReadingV0FieldCueUseEligibility =
  'eligible-for-generated-site-reading-as-warning-bearing-evidence';
export type GeneratedSiteReadingV0FieldFeatureEvidenceScope =
  'field-feature-relations-only-not-site-meaning';
export type GeneratedSiteReadingV0FieldCueForbiddenInterpretation =
  | 'do-not-read-as-site-name'
  | 'do-not-read-as-final-site-meaning'
  | 'do-not-read-as-raw-field-proof'
  | 'do-not-read-as-semantic-truth'
  | 'do-not-generalize-beyond-one-ambo-tetrahedron';

export interface GeneratedSiteReadingV0GeometryWitness {
  birthOperation: 'ambo-dissection';
  generationDepth: 1;
  sourceEdgeId?: string;
  parentVertexIds: string[];
  complementEdgeId?: string;
  complementEdgeVertexIds: string[];
  antipodalChildSiteId?: string;
  structuralRoleSummary: string;
  geometryWitnessStatus: GeneratedSiteReadingV0GeometryWitnessStatus;
}

export interface GeneratedSiteReadingV0FieldCandidateReferenceCounts {
  total: number;
  feature: number;
  routeGate: number;
  supportRegion: number;
}

export interface GeneratedSiteReadingV0FieldWitness {
  fieldCueStatus: GeneratedSiteReadingV0FieldCueStatus;
  fieldCueId?: string;
  fieldParticipationStatus?: FieldCueV0ParticipationStatus;
  fieldInheritanceStatus?: string;
  sourceRegimeId?: string;
  sourceProfileSystemId?: string;
  childInheritanceGrammarId?: string;
  sourceSignatureStatus?: 'field-ready' | 'unavailable' | 'issue';
  baseWaveNumberCalibrationStatus?: string;
  pairSumUniquenessStatus?: string;
  shellScalingApplication?: string;
  activeDifferentiatingAxes?: string[];
  neutralAxes?: string[];
  childLogRatio?: number;
  childRatio?: number;
  childWavelength?: number;
  fieldPressureSummary?: string;
  fieldCandidateReferenceCounts: GeneratedSiteReadingV0FieldCandidateReferenceCounts;
  fieldWarningStatuses: FieldCueV0ParticipationStatus[];
  fieldNamingQuestions: string[];
  fieldWitnessCaveats: string[];
}

export interface GeneratedSiteReadingV0AtomicWitness {
  atomicWitnessStatus: GeneratedSiteReadingV0AtomicWitnessStatus;
  sourceEdgeId?: string;
  complementEdgeId?: string;
  projectionVertexIds: string[];
  antipodalChildSiteId?: string;
  childRole?: 'shared-90-pole';
  inheritanceGrammarId?: string;
  mergeKind?: string;
  birthLawSummary: string;
}

export interface GeneratedSiteReadingV0AmbiguityWitness {
  ambiguityStatus: GeneratedSiteReadingV0AmbiguityStatus;
  ambiguityWarnings: string[];
  unsupportedCaveats: string[];
}

export interface GeneratedSiteReadingV0HumanNamingPrompt {
  namingPromptStatus: GeneratedSiteReadingV0NamingPromptStatus;
  primaryNamingQuestion: string;
  secondaryNamingQuestions: string[];
  forbiddenConclusions: string[];
}

export interface GeneratedSiteReadingV0ReadingUsefulness {
  readingUsefulnessStatus: GeneratedSiteReadingV0UsefulnessStatus;
  usefulnessSummary: string;
}

export interface GeneratedSiteReadingV0FieldCueConsumption {
  sourceBoundaryMethod: GeneratedSiteReadingV0FieldCueBoundaryReport['method'];
  sourceBoundaryGate: GeneratedSiteReadingV0FieldCueBoundaryReport['parentGate'];
  fieldCueConsumptionStatus: GeneratedSiteReadingV0FieldCueConsumptionStatus;
  eventBoundPrototypeStatus: GeneratedSiteReadingV0EventBoundPrototypeStatus;
  fieldLayerGeneralityStatus: GeneratedSiteReadingV0FieldLayerGeneralityStatus;
  portabilityStatus: GeneratedSiteReadingV0PortabilityStatus;
  generatedSiteReadingPromotionStatus: GeneratedSiteReadingV0RuntimeStatus;
  semanticNamingStatus: GeneratedSiteReadingV0NamingStatus;
  topologyStatus: GeneratedSiteReadingV0TopologyStatus;
  packetWriteStatus: GeneratedSiteReadingV0PacketWriteStatus;
  rawFieldWitnessStatus: GeneratedSiteReadingV0FieldCueBoundaryReport['rawFieldWitnessStatus'];
  structuralWitnessStatus: GeneratedSiteReadingV0FieldCueBoundaryReport['structuralWitnessStatus'];
  reductionLawAdoptionStatus: GeneratedSiteReadingV0FieldCueBoundaryReport['reductionLawAdoptionStatus'];
  fieldCueEvidenceRowCount: number;
  fieldCueRelationEvidenceRowCount: number;
  rawFieldVisibleClaimCount: number;
  misleadingRiskRowCount: number;
  tupleLossWarningCount: number;
  semanticNamingClaimCount: number;
}

export interface GeneratedSiteReadingV0FieldCueEvidence {
  childSiteId: string;
  sourceStateId: string;
  fieldCueEvidenceStatus: GeneratedSiteFieldCueRow['fieldCueEvidenceStatus'];
  generatedSiteUseEligibility: GeneratedSiteReadingV0FieldCueUseEligibility;
  eventBoundPrototypeStatus: GeneratedSiteReadingV0EventBoundPrototypeStatus;
  fieldLayerGeneralityStatus: GeneratedSiteReadingV0FieldLayerGeneralityStatus;
  propagationEvidence: GeneratedSiteFieldCueRow['propagationEvidence'];
  structuralEvidence: GeneratedSiteFieldCueRow['structuralEvidence'];
  reductionHonesty: GeneratedSiteFieldCueRow['reductionHonesty'];
  requiredWarnings: GeneratedSiteFieldCueRow['requiredWarnings'];
  fieldFeatureEvidenceScope: GeneratedSiteReadingV0FieldFeatureEvidenceScope;
  forbiddenInterpretations: GeneratedSiteReadingV0FieldCueForbiddenInterpretation[];
}

export interface GeneratedSiteReadingV0FieldRelationEvidenceRow {
  relationId: string;
  pairedChildSiteId: string;
  sourceStateRelation: GeneratedSiteRelationEvidenceRow['sourceStateRelation'];
  rawFieldCueStatus: GeneratedSiteRelationEvidenceRow['rawFieldCueStatus'];
  structuralChannelCueStatus: GeneratedSiteRelationEvidenceRow['structuralChannelCueStatus'];
  depropagationCueStatus: GeneratedSiteRelationEvidenceRow['depropagationCueStatus'];
  relationVisibilityStatuses: GeneratedSiteRelationEvidenceRow['relationVisibilityStatuses'];
  misleadingRisk: boolean;
  fieldCueWarning: string;
  generatedSiteReadingWarning: string;
  relationUseEligibility: GeneratedSiteRelationEvidenceRow['relationUseEligibility'];
  forbiddenInterpretations: GeneratedSiteRelationEvidenceRow['forbiddenInterpretations'];
}

export interface GeneratedSiteReadingV0FieldRelationEvidence {
  fieldFeatureEvidenceScope: GeneratedSiteReadingV0FieldFeatureEvidenceScope;
  relationEvidenceRows: GeneratedSiteReadingV0FieldRelationEvidenceRow[];
  relationEvidenceRowCount: number;
}

export interface GeneratedSiteReadingV0 {
  readingId: string;
  siteId: FieldCueV0SiteId;
  siteKind: GeneratedSiteReadingV0SiteKind;
  eventScopeStatus: GeneratedSiteReadingV0EventScopeStatus;
  generalityStatus: GeneratedSiteReadingV0GeneralityStatus;
  semanticStatus: GeneratedSiteReadingV0SemanticStatus;
  topologyStatus: GeneratedSiteReadingV0TopologyStatus;
  packetWriteStatus: GeneratedSiteReadingV0PacketWriteStatus;
  shapeMutationStatus: GeneratedSiteReadingV0ShapeMutationStatus;
  namingStateStatus: GeneratedSiteReadingV0NamingStateStatus;
  humanNamingAuthorityStatus: GeneratedSiteReadingV0HumanNamingAuthorityStatus;
  geometryWitness: GeneratedSiteReadingV0GeometryWitness;
  fieldWitness: GeneratedSiteReadingV0FieldWitness;
  atomicWitness: GeneratedSiteReadingV0AtomicWitness;
  ambiguityWitness: GeneratedSiteReadingV0AmbiguityWitness;
  humanNamingPrompt: GeneratedSiteReadingV0HumanNamingPrompt;
  readingUsefulness: GeneratedSiteReadingV0ReadingUsefulness;
  fieldCueEvidence: GeneratedSiteReadingV0FieldCueEvidence;
  fieldRelationEvidence: GeneratedSiteReadingV0FieldRelationEvidence;
}

export interface GeneratedSiteReadingV0Issue {
  code:
    | 'canonical-shape-mutated'
    | 'field-cue-report-not-ok'
    | 'invalid-reading-count'
    | 'missing-field-cue'
    | 'unexpected-reading-site-id'
    | 'missing-fieldcue-boundary-report'
    | 'fieldcue-boundary-report-not-ok'
    | 'missing-fieldcue-consumption-section'
    | 'missing-fieldcue-evidence-for-site'
    | 'missing-field-relation-evidence'
    | 'raw-field-visible-claim-leaked'
    | 'missing-misleading-risk-warning'
    | 'scalar-tuple-treated-as-source-signature'
    | 'structural-witness-treated-as-semantic-naming'
    | 'generated-site-name-leak'
    | 'final-site-meaning-leak'
    | 'topology-leak'
    | 'packet-writing-leak'
    | 'generalization-leak'
    | 'generated-site-ui-promoted-too-early'
    | 'operation-registry-contaminated';
  message: string;
  siteId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface GeneratedSiteReadingV0Summary {
  readingCount: number;
  readingsByUsefulnessStatus: Record<GeneratedSiteReadingV0UsefulnessStatus, number>;
  readingsByAmbiguityStatus: Record<GeneratedSiteReadingV0AmbiguityStatus, number>;
  fieldCueAvailableCount: number;
  fieldCueCandidateOnlyCount: number;
  degenerateReadingCount: number;
  weakFieldPressureReadingCount: number;
  unsupportedReadingCount: number;
  issueCount: number;
  ok: boolean;
}

export interface GeneratedSiteReadingV0Report {
  reportId: string;
  method: GeneratedSiteReadingV0Method;
  diagnosticScope: GeneratedSiteReadingV0DiagnosticScope;
  readingPolicyId: GeneratedSiteReadingV0PolicyId;
  eventScopeStatus: GeneratedSiteReadingV0EventScopeStatus;
  fieldLayerStatus: GeneratedSiteReadingV0FieldLayerStatus;
  generalityStatus: GeneratedSiteReadingV0GeneralityStatus;
  portabilityStatus: GeneratedSiteReadingV0PortabilityStatus;
  semanticStatus: GeneratedSiteReadingV0SemanticStatus;
  topologyStatus: GeneratedSiteReadingV0TopologyStatus;
  packetWriteStatus: GeneratedSiteReadingV0PacketWriteStatus;
  shapeMutationStatus: GeneratedSiteReadingV0ShapeMutationStatus;
  namingStateStatus: GeneratedSiteReadingV0NamingStateStatus;
  humanNamingAuthorityStatus: GeneratedSiteReadingV0HumanNamingAuthorityStatus;
  generatedSiteReadingV0FieldCueConsumptionStatus: GeneratedSiteReadingV0FieldCueConsumptionStatus;
  generatedSiteReadingV0RuntimeStatus: GeneratedSiteReadingV0RuntimeStatus;
  generatedSiteReadingV0UiStatus: GeneratedSiteReadingV0UiStatus;
  generatedSiteReadingV0NamingStatus: GeneratedSiteReadingV0NamingStatus;
  generatedSiteReadingV0GeneralizationStatus: GeneratedSiteReadingV0GeneralizationStatus;
  fieldLayerEventScopeStatus: GeneratedSiteReadingV0FieldLayerEventScopeStatus;
  operationRegistryStatus: 'not-operation-registry-work';
  shapeId: string;
  provingEventOperation: 'ambo-dissection';
  provingEventGenerationDepth: 1;
  expectedSiteIds: FieldCueV0SiteId[];
  readingCount: number;
  shapeMutationDetected: boolean;
  packetWriteDetected: false;
  fieldCueConsumption: GeneratedSiteReadingV0FieldCueConsumption;
  readings: GeneratedSiteReadingV0[];
  summary: GeneratedSiteReadingV0Summary;
  diagnosticIntegrityStatus: GeneratedSiteReadingV0DiagnosticIntegrityStatus;
  recommendedNextGate: GeneratedSiteReadingV0RecommendedNextGate;
  issueCount: number;
  ok: boolean;
  issues: GeneratedSiteReadingV0Issue[];
}

const METHOD: GeneratedSiteReadingV0Method =
  'generated-site-reading-v0-diagnostic';
const DIAGNOSTIC_SCOPE: GeneratedSiteReadingV0DiagnosticScope =
  'generated-site-reading-v0-one-ambo-tetrahedron-only';
const READING_POLICY_ID: GeneratedSiteReadingV0PolicyId =
  'generated-site-reading-v0-one-ambo-tetrahedron';
const EVENT_SCOPE_STATUS: GeneratedSiteReadingV0EventScopeStatus =
  'one-ambo-tetrahedron-proving-event';
const FIELD_LAYER_STATUS: GeneratedSiteReadingV0FieldLayerStatus =
  'event-bound-profile-aware-prototype';
const GENERALITY_STATUS: GeneratedSiteReadingV0GeneralityStatus =
  'not-general-reading-layer';
const PORTABILITY_STATUS: GeneratedSiteReadingV0PortabilityStatus = 'untested';
const SEMANTIC_STATUS: GeneratedSiteReadingV0SemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: GeneratedSiteReadingV0TopologyStatus =
  'not-topology-workspace';
const PACKET_WRITE_STATUS: GeneratedSiteReadingV0PacketWriteStatus =
  'not-packet-writing';
const SHAPE_MUTATION_STATUS: GeneratedSiteReadingV0ShapeMutationStatus =
  'not-shape-mutation';
const NAMING_STATE_STATUS: GeneratedSiteReadingV0NamingStateStatus =
  'not-implemented';
const HUMAN_NAMING_AUTHORITY_STATUS: GeneratedSiteReadingV0HumanNamingAuthorityStatus =
  'human-names';
const FIELDCUE_CONSUMPTION_STATUS: GeneratedSiteReadingV0FieldCueConsumptionStatus =
  'fieldcue-boundary-consumed-as-event-bound-evidence';
const EVENT_BOUND_PROTOTYPE_STATUS: GeneratedSiteReadingV0EventBoundPrototypeStatus =
  'one-ambo-tetrahedron-prototype-only';
const FIELD_LAYER_GENERALITY_STATUS: GeneratedSiteReadingV0FieldLayerGeneralityStatus =
  'not-general-field-layer';
const GENERATED_SITE_READING_RUNTIME_STATUS: GeneratedSiteReadingV0RuntimeStatus =
  'diagnostic-library-consumption-only';
const GENERATED_SITE_READING_UI_STATUS: GeneratedSiteReadingV0UiStatus =
  'not-ui-work';
const GENERATED_SITE_READING_NAMING_STATUS: GeneratedSiteReadingV0NamingStatus =
  'not-auto-naming';
const GENERATED_SITE_READING_GENERALIZATION_STATUS: GeneratedSiteReadingV0GeneralizationStatus =
  'not-general-field-layer';
const FIELD_LAYER_EVENT_SCOPE_STATUS: GeneratedSiteReadingV0FieldLayerEventScopeStatus =
  'one-ambo-tetrahedron-proving-event-only';
const RECOMMENDED_NEXT_GATE: GeneratedSiteReadingV0RecommendedNextGate =
  'Gate D7 - GeneratedSiteReadingV0 FieldCue UI Boundary';
const GENERATED_SITE_USE_ELIGIBILITY: GeneratedSiteReadingV0FieldCueUseEligibility =
  'eligible-for-generated-site-reading-as-warning-bearing-evidence';
const FIELD_FEATURE_EVIDENCE_SCOPE: GeneratedSiteReadingV0FieldFeatureEvidenceScope =
  'field-feature-relations-only-not-site-meaning';
const FIELDCUE_FORBIDDEN_INTERPRETATIONS: GeneratedSiteReadingV0FieldCueForbiddenInterpretation[] =
  [
    'do-not-read-as-site-name',
    'do-not-read-as-final-site-meaning',
    'do-not-read-as-raw-field-proof',
    'do-not-read-as-semantic-truth',
    'do-not-generalize-beyond-one-ambo-tetrahedron',
  ];
const EXPECTED_SITE_IDS: FieldCueV0SiteId[] = [
  'M_AB',
  'M_AC',
  'M_AD',
  'M_BC',
  'M_BD',
  'M_CD',
];

export function buildGeneratedSiteReadingV0Report(): GeneratedSiteReadingV0Report {
  const canonicalShape = applyAmboDissection(createSeedShape('tetrahedron'));
  const beforeShapeJson = JSON.stringify(canonicalShape);
  const fieldCueReport = buildFieldCueV0Report();
  const fieldCueBoundaryReport =
    buildGeneratedSiteReadingV0FieldCueBoundaryReport(fieldCueReport);
  const issues: GeneratedSiteReadingV0Issue[] = [];
  const fieldCueBySiteId = new Map(
    fieldCueReport.cues.map((cue) => [cue.siteId, cue]),
  );
  const fieldCueBoundaryRowsBySiteId = new Map(
    fieldCueBoundaryReport.generatedSiteFieldCueRows.map((row) => [
      row.childSiteId,
      row,
    ]),
  );
  const fieldRelationRowsBySiteId = buildFieldRelationRowsBySiteId(
    fieldCueBoundaryReport.generatedSiteRelationEvidenceRows,
  );
  const fieldCueConsumption = buildFieldCueConsumption(fieldCueBoundaryReport);

  if (!fieldCueReport.ok) {
    issues.push({
      code: 'field-cue-report-not-ok',
      message:
        'GeneratedSiteReadingV0 received a non-ok FieldCueV0 report.',
      details: {
        fieldCueIssueCount: fieldCueReport.issueCount,
      },
    });
  }

  const readings = EXPECTED_SITE_IDS.map((siteId) => {
    const fieldCue = fieldCueBySiteId.get(siteId);
    const fieldCueEvidenceRow = fieldCueBoundaryRowsBySiteId.get(siteId);
    const fieldRelationEvidenceRows = fieldRelationRowsBySiteId.get(siteId) ?? [];

    if (!fieldCue) {
      issues.push({
        code: 'missing-field-cue',
        message: `GeneratedSiteReadingV0 is missing FieldCueV0 cue ${siteId}.`,
        siteId,
      });
    }

    if (!fieldCueEvidenceRow) {
      issues.push({
        code: 'missing-fieldcue-evidence-for-site',
        message: `GeneratedSiteReadingV0 is missing D5 FieldCue evidence for ${siteId}.`,
        siteId,
      });
    }

    return buildReading({
      siteId,
      fieldCue,
      fieldCueReportOk: fieldCueReport.ok,
      fieldCueEvidenceRow,
      fieldRelationEvidenceRows,
    });
  });

  const shapeMutationDetected =
    JSON.stringify(canonicalShape) !== beforeShapeJson;

  if (shapeMutationDetected) {
    issues.push({
      code: 'canonical-shape-mutated',
      message:
        'GeneratedSiteReadingV0 report building mutated the canonical proving Shape.',
    });
  }

  if (readings.length !== EXPECTED_SITE_IDS.length) {
    issues.push({
      code: 'invalid-reading-count',
      message: 'GeneratedSiteReadingV0 produced an unexpected reading count.',
      details: {
        expectedReadingCount: EXPECTED_SITE_IDS.length,
        actualReadingCount: readings.length,
      },
    });
  }

  for (const reading of readings) {
    if (!EXPECTED_SITE_IDS.includes(reading.siteId)) {
      issues.push({
        code: 'unexpected-reading-site-id',
        message: `GeneratedSiteReadingV0 produced unexpected reading site ${reading.siteId}.`,
        siteId: reading.siteId,
      });
    }
  }

  issues.push(
    ...buildFieldCueConsumptionIssues({
      fieldCueBoundaryReport,
      fieldCueConsumption,
      readings,
    }),
  );

  const issueCount = issues.length;
  const diagnosticIntegrityStatus: GeneratedSiteReadingV0DiagnosticIntegrityStatus =
    issueCount === 0 ? 'pass' : 'fail';
  const ok =
    issueCount === 0 &&
    readings.length === EXPECTED_SITE_IDS.length &&
    !shapeMutationDetected &&
    fieldCueReport.ok &&
    fieldCueBoundaryReport.ok;
  const summary = buildSummary(readings, issueCount, ok);

  return {
    reportId: `${METHOD}:one-ambo-tetrahedron`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    readingPolicyId: READING_POLICY_ID,
    eventScopeStatus: EVENT_SCOPE_STATUS,
    fieldLayerStatus: FIELD_LAYER_STATUS,
    generalityStatus: GENERALITY_STATUS,
    portabilityStatus: PORTABILITY_STATUS,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    namingStateStatus: NAMING_STATE_STATUS,
    humanNamingAuthorityStatus: HUMAN_NAMING_AUTHORITY_STATUS,
    generatedSiteReadingV0FieldCueConsumptionStatus:
      FIELDCUE_CONSUMPTION_STATUS,
    generatedSiteReadingV0RuntimeStatus: GENERATED_SITE_READING_RUNTIME_STATUS,
    generatedSiteReadingV0UiStatus: GENERATED_SITE_READING_UI_STATUS,
    generatedSiteReadingV0NamingStatus: GENERATED_SITE_READING_NAMING_STATUS,
    generatedSiteReadingV0GeneralizationStatus:
      GENERATED_SITE_READING_GENERALIZATION_STATUS,
    fieldLayerEventScopeStatus: FIELD_LAYER_EVENT_SCOPE_STATUS,
    operationRegistryStatus: 'not-operation-registry-work',
    shapeId: canonicalShape.id,
    provingEventOperation: 'ambo-dissection',
    provingEventGenerationDepth: 1,
    expectedSiteIds: [...EXPECTED_SITE_IDS],
    readingCount: readings.length,
    shapeMutationDetected,
    packetWriteDetected: false,
    fieldCueConsumption,
    readings,
    summary,
    diagnosticIntegrityStatus,
    recommendedNextGate: RECOMMENDED_NEXT_GATE,
    issueCount,
    ok,
    issues,
  };
}

function buildReading(args: {
  siteId: FieldCueV0SiteId;
  fieldCue: FieldCueV0 | undefined;
  fieldCueReportOk: boolean;
  fieldCueEvidenceRow: GeneratedSiteFieldCueRow | undefined;
  fieldRelationEvidenceRows: GeneratedSiteReadingV0FieldRelationEvidenceRow[];
}): GeneratedSiteReadingV0 {
  const readingId = `${READING_POLICY_ID}:${args.siteId}`;
  const geometryWitness = buildGeometryWitness(args.fieldCue);
  const fieldWitness = buildFieldWitness(args.fieldCue, args.fieldCueReportOk);
  const atomicWitness = buildAtomicWitness(args.fieldCue);
  const ambiguityWitness = buildAmbiguityWitness(args.fieldCue, fieldWitness);
  const humanNamingPrompt = buildHumanNamingPrompt(args.fieldCue);
  const readingUsefulness = buildReadingUsefulness({
    fieldWitness,
    ambiguityWitness,
  });
  const fieldCueEvidence = buildFieldCueEvidence({
    siteId: args.siteId,
    fieldCueEvidenceRow: args.fieldCueEvidenceRow,
  });
  const fieldRelationEvidence = buildFieldRelationEvidence(
    args.fieldRelationEvidenceRows,
  );

  return {
    readingId,
    siteId: args.siteId,
    siteKind: 'generated-midpoint-child',
    eventScopeStatus: EVENT_SCOPE_STATUS,
    generalityStatus: GENERALITY_STATUS,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    namingStateStatus: NAMING_STATE_STATUS,
    humanNamingAuthorityStatus: HUMAN_NAMING_AUTHORITY_STATUS,
    geometryWitness,
    fieldWitness,
    atomicWitness,
    ambiguityWitness,
    humanNamingPrompt,
    readingUsefulness,
    fieldCueEvidence,
    fieldRelationEvidence,
  };
}

function buildFieldCueConsumption(
  boundaryReport: GeneratedSiteReadingV0FieldCueBoundaryReport,
): GeneratedSiteReadingV0FieldCueConsumption {
  const summary = boundaryReport.generatedSiteBoundarySummary;

  return {
    sourceBoundaryMethod: boundaryReport.method,
    sourceBoundaryGate: boundaryReport.parentGate,
    fieldCueConsumptionStatus: FIELDCUE_CONSUMPTION_STATUS,
    eventBoundPrototypeStatus: EVENT_BOUND_PROTOTYPE_STATUS,
    fieldLayerGeneralityStatus: FIELD_LAYER_GENERALITY_STATUS,
    portabilityStatus: PORTABILITY_STATUS,
    generatedSiteReadingPromotionStatus:
      GENERATED_SITE_READING_RUNTIME_STATUS,
    semanticNamingStatus: GENERATED_SITE_READING_NAMING_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    rawFieldWitnessStatus: boundaryReport.rawFieldWitnessStatus,
    structuralWitnessStatus: boundaryReport.structuralWitnessStatus,
    reductionLawAdoptionStatus: boundaryReport.reductionLawAdoptionStatus,
    fieldCueEvidenceRowCount: summary.childEvidenceRowCount,
    fieldCueRelationEvidenceRowCount: summary.relationEvidenceRowCount,
    rawFieldVisibleClaimCount: summary.rawFieldVisibleClaimCount,
    misleadingRiskRowCount: summary.misleadingRiskRowCount,
    tupleLossWarningCount: summary.tupleLossWarningCount,
    semanticNamingClaimCount: summary.semanticNamingClaimCount,
  };
}

function buildFieldCueEvidence(args: {
  siteId: FieldCueV0SiteId;
  fieldCueEvidenceRow: GeneratedSiteFieldCueRow | undefined;
}): GeneratedSiteReadingV0FieldCueEvidence {
  const row = args.fieldCueEvidenceRow;

  return {
    childSiteId: row?.childSiteId ?? args.siteId,
    sourceStateId: row?.sourceStateId ?? 'missing-source-state',
    fieldCueEvidenceStatus:
      row?.fieldCueEvidenceStatus ?? 'available-as-bounded-fieldcue-evidence',
    generatedSiteUseEligibility: GENERATED_SITE_USE_ELIGIBILITY,
    eventBoundPrototypeStatus: EVENT_BOUND_PROTOTYPE_STATUS,
    fieldLayerGeneralityStatus: FIELD_LAYER_GENERALITY_STATUS,
    propagationEvidence: row?.propagationEvidence ?? {
      carrierWaveNumber: 0,
      carrierPhase: 0,
      attenuation: 0,
      rawPropagationStatus: 'missing-or-non-finite',
      interpretation:
        'ordinary-propagation-witness-not-full-source-signature',
    },
    structuralEvidence: row?.structuralEvidence ?? {
      structuralProjectionStatus: 'missing-structural-relation',
      relationCarrierStatus: 'source-state-structural-witness',
      interpretation:
        'structural-relation-witness-under-declared-basis',
    },
    reductionHonesty: row?.reductionHonesty ?? {
      emittedTupleStatus: 'propagation-facing-reduction-only',
      sourceSignatureStatus: 'structured-source-state-not-scalar-tuple',
      tupleLossWarning: true,
    },
    requiredWarnings: [
      ...(row?.requiredWarnings ?? [
        'raw-field-visibility-not-proven',
        'scalar-tuple-not-source-signature',
        'structural-witness-under-declared-basis',
        'not-semantic-naming',
      ]),
    ],
    fieldFeatureEvidenceScope: FIELD_FEATURE_EVIDENCE_SCOPE,
    forbiddenInterpretations: [...FIELDCUE_FORBIDDEN_INTERPRETATIONS],
  };
}

function buildFieldRelationEvidence(
  relationEvidenceRows: GeneratedSiteReadingV0FieldRelationEvidenceRow[],
): GeneratedSiteReadingV0FieldRelationEvidence {
  return {
    fieldFeatureEvidenceScope: FIELD_FEATURE_EVIDENCE_SCOPE,
    relationEvidenceRows: relationEvidenceRows.map((row) => ({
      ...row,
      relationVisibilityStatuses: [...row.relationVisibilityStatuses],
      forbiddenInterpretations: [...row.forbiddenInterpretations],
    })),
    relationEvidenceRowCount: relationEvidenceRows.length,
  };
}

function buildFieldRelationRowsBySiteId(
  relationRows: GeneratedSiteRelationEvidenceRow[],
): Map<string, GeneratedSiteReadingV0FieldRelationEvidenceRow[]> {
  const rowsBySiteId = new Map<string, GeneratedSiteReadingV0FieldRelationEvidenceRow[]>();

  for (const row of relationRows) {
    addRelationRowForSite(rowsBySiteId, row.leftChildSiteId, {
      relationId: row.relationId,
      pairedChildSiteId: row.rightChildSiteId,
      sourceStateRelation: row.sourceStateRelation,
      rawFieldCueStatus: row.rawFieldCueStatus,
      structuralChannelCueStatus: row.structuralChannelCueStatus,
      depropagationCueStatus: row.depropagationCueStatus,
      relationVisibilityStatuses: [...row.relationVisibilityStatuses],
      misleadingRisk: row.misleadingRisk,
      fieldCueWarning: row.fieldCueWarning,
      generatedSiteReadingWarning: row.generatedSiteReadingWarning,
      relationUseEligibility: row.relationUseEligibility,
      forbiddenInterpretations: [...row.forbiddenInterpretations],
    });
    addRelationRowForSite(rowsBySiteId, row.rightChildSiteId, {
      relationId: row.relationId,
      pairedChildSiteId: row.leftChildSiteId,
      sourceStateRelation: row.sourceStateRelation,
      rawFieldCueStatus: row.rawFieldCueStatus,
      structuralChannelCueStatus: row.structuralChannelCueStatus,
      depropagationCueStatus: row.depropagationCueStatus,
      relationVisibilityStatuses: [...row.relationVisibilityStatuses],
      misleadingRisk: row.misleadingRisk,
      fieldCueWarning: row.fieldCueWarning,
      generatedSiteReadingWarning: row.generatedSiteReadingWarning,
      relationUseEligibility: row.relationUseEligibility,
      forbiddenInterpretations: [...row.forbiddenInterpretations],
    });
  }

  return rowsBySiteId;
}

function addRelationRowForSite(
  rowsBySiteId: Map<string, GeneratedSiteReadingV0FieldRelationEvidenceRow[]>,
  siteId: string,
  row: GeneratedSiteReadingV0FieldRelationEvidenceRow,
): void {
  const rows = rowsBySiteId.get(siteId) ?? [];

  rows.push(row);
  rowsBySiteId.set(siteId, rows);
}

function buildFieldCueConsumptionIssues(args: {
  fieldCueBoundaryReport: GeneratedSiteReadingV0FieldCueBoundaryReport | null;
  fieldCueConsumption: GeneratedSiteReadingV0FieldCueConsumption | null;
  readings: GeneratedSiteReadingV0[];
}): GeneratedSiteReadingV0Issue[] {
  const issues: GeneratedSiteReadingV0Issue[] = [];
  const boundaryReport = args.fieldCueBoundaryReport;
  const consumption = args.fieldCueConsumption;

  if (!boundaryReport) {
    issues.push({
      code: 'missing-fieldcue-boundary-report',
      message: 'GeneratedSiteReadingV0 did not receive the Gate D5 boundary report.',
    });
  } else if (!boundaryReport.ok) {
    issues.push({
      code: 'fieldcue-boundary-report-not-ok',
      message: 'The consumed Gate D5 FieldCue boundary report is not ok.',
      details: {
        boundaryIssueCount: boundaryReport.integrityIssueCount,
      },
    });
  }

  if (!consumption) {
    issues.push({
      code: 'missing-fieldcue-consumption-section',
      message:
        'GeneratedSiteReadingV0 did not build a FieldCue consumption section.',
    });
    return issues;
  }

  if (
    consumption.sourceBoundaryMethod !==
      'generated-site-reading-v0-fieldcue-boundary' ||
    consumption.sourceBoundaryGate !== 'Gate D5' ||
    consumption.fieldCueConsumptionStatus !== FIELDCUE_CONSUMPTION_STATUS
  ) {
    issues.push({
      code: 'missing-fieldcue-consumption-section',
      message:
        'GeneratedSiteReadingV0 did not consume the Gate D5 FieldCue boundary as D6 evidence.',
    });
  }

  if (
    args.readings.some(
      (reading) =>
        reading.fieldCueEvidence.childSiteId !== reading.siteId ||
        reading.fieldCueEvidence.fieldCueEvidenceStatus !==
          'available-as-bounded-fieldcue-evidence' ||
        reading.fieldCueEvidence.generatedSiteUseEligibility !==
          GENERATED_SITE_USE_ELIGIBILITY ||
        reading.fieldCueEvidence.fieldFeatureEvidenceScope !==
          FIELD_FEATURE_EVIDENCE_SCOPE,
    ) ||
    consumption.fieldCueEvidenceRowCount !== 6
  ) {
    issues.push({
      code: 'missing-fieldcue-evidence-for-site',
      message:
        'Every generated-site reading must carry bounded FieldCue evidence.',
    });
  }

  if (
    uniqueRelationEvidenceIds(args.readings).length !== 3 ||
    consumption.fieldCueRelationEvidenceRowCount !== 3 ||
    args.readings.some(
      (reading) => reading.fieldRelationEvidence.relationEvidenceRowCount === 0,
    )
  ) {
    issues.push({
      code: 'missing-field-relation-evidence',
      message:
        'GeneratedSiteReadingV0 must carry the three warning-bearing relation evidence rows.',
    });
  }

  if (
    consumption.rawFieldVisibleClaimCount !== 0 ||
    args.readings.some((reading) =>
      reading.fieldRelationEvidence.relationEvidenceRows.some(
        relationClaimsRawFieldVisible,
      ),
    )
  ) {
    issues.push({
      code: 'raw-field-visible-claim-leaked',
      message:
        'GeneratedSiteReadingV0 must not claim raw propagated field visibility.',
    });
  }

  if (
    consumption.misleadingRiskRowCount !== 3 ||
    args.readings.some((reading) =>
      reading.fieldRelationEvidence.relationEvidenceRows.some(
        (row) =>
          !row.misleadingRisk ||
          !row.relationVisibilityStatuses.includes(
            'misleading-if-read-as-raw-field',
          ) ||
          !row.fieldCueWarning.includes('misleading-if-read-as-raw-field') ||
          !row.forbiddenInterpretations.includes(
            'do-not-drop-misleading-risk',
          ),
      ),
    )
  ) {
    issues.push({
      code: 'missing-misleading-risk-warning',
      message:
        'GeneratedSiteReadingV0 must preserve misleading-risk warnings.',
    });
  }

  if (
    consumption.tupleLossWarningCount !== 6 ||
    args.readings.some(
      (reading) =>
        reading.fieldCueEvidence.reductionHonesty.emittedTupleStatus !==
          'propagation-facing-reduction-only' ||
        reading.fieldCueEvidence.reductionHonesty.sourceSignatureStatus !==
          'structured-source-state-not-scalar-tuple' ||
        reading.fieldCueEvidence.reductionHonesty.tupleLossWarning !== true,
    )
  ) {
    issues.push({
      code: 'scalar-tuple-treated-as-source-signature',
      message:
        'GeneratedSiteReadingV0 must keep scalar tuple output as a reduction warning.',
    });
  }

  if (
    consumption.semanticNamingClaimCount !== 0 ||
    args.readings.some(readingTreatsStructuralEvidenceAsSemanticNaming)
  ) {
    issues.push({
      code: 'structural-witness-treated-as-semantic-naming',
      message:
        'GeneratedSiteReadingV0 must not treat structural witness evidence as semantic naming.',
    });
  }

  if (args.readings.some(readingHasGeneratedSiteNameLeak)) {
    issues.push({
      code: 'generated-site-name-leak',
      message: 'GeneratedSiteReadingV0 must not produce generated-site names.',
    });
  }

  if (args.readings.some(readingHasFinalSiteMeaningLeak)) {
    issues.push({
      code: 'final-site-meaning-leak',
      message:
        'GeneratedSiteReadingV0 must not produce final generated-site meaning.',
    });
  }

  if (
    consumption.topologyStatus !== 'not-topology-workspace' ||
    args.readings.some(
      (reading) => reading.topologyStatus !== 'not-topology-workspace',
    )
  ) {
    issues.push({
      code: 'topology-leak',
      message: 'GeneratedSiteReadingV0 must not add topology maturity.',
    });
  }

  if (
    consumption.packetWriteStatus !== 'not-packet-writing' ||
    args.readings.some(
      (reading) => reading.packetWriteStatus !== 'not-packet-writing',
    )
  ) {
    issues.push({
      code: 'packet-writing-leak',
      message: 'GeneratedSiteReadingV0 must not write packets.',
    });
  }

  if (
    consumption.eventBoundPrototypeStatus !== EVENT_BOUND_PROTOTYPE_STATUS ||
    consumption.fieldLayerGeneralityStatus !== FIELD_LAYER_GENERALITY_STATUS ||
    args.readings.some(
      (reading) =>
        reading.fieldCueEvidence.eventBoundPrototypeStatus !==
          EVENT_BOUND_PROTOTYPE_STATUS ||
        reading.fieldCueEvidence.fieldLayerGeneralityStatus !==
          FIELD_LAYER_GENERALITY_STATUS,
    )
  ) {
    issues.push({
      code: 'generalization-leak',
      message:
        'GeneratedSiteReadingV0 FieldCue evidence must remain one-Ambo event-bound only.',
    });
  }

  if (GENERATED_SITE_READING_UI_STATUS !== 'not-ui-work') {
    issues.push({
      code: 'generated-site-ui-promoted-too-early',
      message: 'Gate D6 must not promote GeneratedSiteReadingV0 UI.',
    });
  }

  if (
    consumption.reductionLawAdoptionStatus !== 'not-adopted' ||
    consumption.generatedSiteReadingPromotionStatus !==
      GENERATED_SITE_READING_RUNTIME_STATUS
  ) {
    issues.push({
      code: 'operation-registry-contaminated',
      message:
        'GeneratedSiteReadingV0 must not adopt a runtime law or contaminate operation registry work.',
    });
  }

  return issues;
}

function relationClaimsRawFieldVisible(
  row: GeneratedSiteReadingV0FieldRelationEvidenceRow,
): boolean {
  return (
    row.rawFieldCueStatus === 'raw-field-visible' ||
    row.relationVisibilityStatuses.includes('raw-field-visible')
  );
}

function uniqueRelationEvidenceIds(
  readings: GeneratedSiteReadingV0[],
): string[] {
  return Array.from(
    new Set(
      readings.flatMap((reading) =>
        reading.fieldRelationEvidence.relationEvidenceRows.map(
          (row) => row.relationId,
        ),
      ),
    ),
  );
}

function readingTreatsStructuralEvidenceAsSemanticNaming(
  reading: GeneratedSiteReadingV0,
): boolean {
  return (
    reading.semanticStatus !== 'not-semantic-naming' ||
    reading.fieldCueEvidence.requiredWarnings.includes('not-semantic-naming') ===
      false ||
    reading.fieldCueEvidence.forbiddenInterpretations.includes(
      'do-not-read-as-semantic-truth',
    ) === false
  );
}

function readingHasGeneratedSiteNameLeak(
  reading: GeneratedSiteReadingV0,
): boolean {
  return hasForbiddenOwnKey(reading, [
    'generatedSiteName',
    'siteName',
    'finalName',
    'conceptName',
    'semanticName',
  ]);
}

function readingHasFinalSiteMeaningLeak(reading: GeneratedSiteReadingV0): boolean {
  return hasForbiddenOwnKey(reading, [
    'finalSiteMeaning',
    'siteMeaning',
    'finalMeaning',
    'semanticMeaning',
  ]);
}

function hasForbiddenOwnKey(
  value: unknown,
  forbiddenKeys: string[],
): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return forbiddenKeys.some((key) =>
    Object.prototype.hasOwnProperty.call(value, key),
  );
}

function buildGeometryWitness(
  fieldCue: FieldCueV0 | undefined,
): GeneratedSiteReadingV0GeometryWitness {
  const axis = fieldCue?.inheritanceAxis;
  const geometryWitnessStatus: GeneratedSiteReadingV0GeometryWitnessStatus =
    !axis
      ? 'unsupported'
      : axis.sourceEdgeId &&
          axis.parentVertexIds.length === 2 &&
          axis.complementEdgeId &&
          axis.complementEdgeVertexIds.length === 2 &&
          axis.antipodalChildSiteId
        ? 'available'
        : 'incomplete';

  return {
    birthOperation: 'ambo-dissection',
    generationDepth: 1,
    ...(axis?.sourceEdgeId ? { sourceEdgeId: axis.sourceEdgeId } : {}),
    parentVertexIds: [...(axis?.parentVertexIds ?? [])],
    ...(axis?.complementEdgeId ? { complementEdgeId: axis.complementEdgeId } : {}),
    complementEdgeVertexIds: [...(axis?.complementEdgeVertexIds ?? [])],
    ...(axis?.antipodalChildSiteId
      ? { antipodalChildSiteId: axis.antipodalChildSiteId }
      : {}),
    structuralRoleSummary: buildStructuralRoleSummary(fieldCue),
    geometryWitnessStatus,
  };
}

function buildFieldWitness(
  fieldCue: FieldCueV0 | undefined,
  fieldCueReportOk: boolean,
): GeneratedSiteReadingV0FieldWitness {
  if (!fieldCue) {
    return {
      fieldCueStatus: 'unavailable',
      fieldCandidateReferenceCounts: createEmptyCandidateReferenceCounts(),
      fieldWarningStatuses: ['unsupported'],
      fieldNamingQuestions: [],
      fieldWitnessCaveats: [
        'FieldCueV0 cue unavailable for this generated site.',
        'field witness unavailable',
        'not semantic naming',
        'not topology',
      ],
    };
  }

  const candidateAxis = fieldCue.candidateFieldWorldAxis;
  const sourceProvenance = fieldCue.sourceSignatureProvenance;
  const sourceSignatureStatus =
    fieldCue.inheritanceAxis.inheritanceStatus === 'complete' &&
    fieldCue.emittedSourceSignature.fieldReady
      ? 'field-ready'
      : fieldCueReportOk
        ? 'issue'
        : 'unavailable';

  return {
    fieldCueStatus: fieldCueReportOk ? 'available' : 'issue',
    fieldCueId: fieldCue.cueId,
    fieldParticipationStatus: fieldCue.participationStatus,
    fieldInheritanceStatus: fieldCue.inheritanceAxis.inheritanceStatus,
    sourceRegimeId: sourceProvenance.provingRegimeId,
    sourceProfileSystemId: sourceProvenance.sourceProfileSystemId,
    childInheritanceGrammarId: sourceProvenance.childInheritanceGrammarId,
    sourceSignatureStatus,
    baseWaveNumberCalibrationStatus:
      sourceProvenance.baseWaveNumberCalibration
        .baseWaveNumberCalibrationStatus,
    pairSumUniquenessStatus: sourceProvenance.pairSumUniquenessStatus,
    shellScalingApplication:
      sourceProvenance.eventShellProvenance.shellScalingApplication,
    activeDifferentiatingAxes: [...sourceProvenance.activeDifferentiatingAxes],
    neutralAxes: [...sourceProvenance.neutralAxes],
    ...(sourceProvenance.childLogRatio !== undefined
      ? { childLogRatio: sourceProvenance.childLogRatio }
      : {}),
    ...(sourceProvenance.childRatio !== undefined
      ? { childRatio: sourceProvenance.childRatio }
      : {}),
    ...(sourceProvenance.childWavelength !== undefined
      ? { childWavelength: sourceProvenance.childWavelength }
      : {}),
    fieldPressureSummary: fieldCue.fieldPressureSummary,
    fieldCandidateReferenceCounts: {
      total: candidateAxis.candidateReferenceCount,
      feature: candidateAxis.featureObservationReferenceCount,
      routeGate: candidateAxis.routeGateCandidateReferenceCount,
      supportRegion: candidateAxis.supportRegionCandidateReferenceCount,
    },
    fieldWarningStatuses: [...fieldCue.warningStatuses],
    fieldNamingQuestions: [...fieldCue.namingQuestions],
    fieldWitnessCaveats: uniqueStrings([
      'FieldCueV0 is candidate-only field witness evidence.',
      'not semantic naming',
      'not topology',
      'not packet writing',
      'not general field layer',
      ...candidateAxis.unsupportedCaveats,
    ]),
  };
}

function buildAtomicWitness(
  fieldCue: FieldCueV0 | undefined,
): GeneratedSiteReadingV0AtomicWitness {
  const axis = fieldCue?.inheritanceAxis;

  if (!axis) {
    return {
      atomicWitnessStatus: 'unsupported',
      projectionVertexIds: [],
      birthLawSummary:
        'Birth-law witness unavailable because the FieldCueV0 inheritance axis is unavailable.',
    };
  }

  const hasBirthLaw =
    axis.sourceEdgeId &&
    axis.complementEdgeId &&
    axis.projectionVertexIds.length > 0 &&
    axis.childRole === 'shared-90-pole';

  return {
    atomicWitnessStatus: hasBirthLaw
      ? 'event-bound-birth-law-available'
      : 'not-atomic-workspace',
    ...(axis.sourceEdgeId ? { sourceEdgeId: axis.sourceEdgeId } : {}),
    ...(axis.complementEdgeId ? { complementEdgeId: axis.complementEdgeId } : {}),
    projectionVertexIds: [...axis.projectionVertexIds],
    ...(axis.antipodalChildSiteId
      ? { antipodalChildSiteId: axis.antipodalChildSiteId }
      : {}),
    ...(axis.childRole ? { childRole: axis.childRole } : {}),
    ...(axis.inheritanceGrammarId
      ? { inheritanceGrammarId: axis.inheritanceGrammarId }
      : {}),
    ...(axis.mergeKind ? { mergeKind: axis.mergeKind } : {}),
    birthLawSummary: hasBirthLaw
      ? 'Event-bound birth-law witness from tetrahedral edge-complement Quark inheritance; not an atomic workspace.'
      : 'Only bounded birth-law context is available; not an atomic workspace.',
  };
}

function buildAmbiguityWitness(
  fieldCue: FieldCueV0 | undefined,
  fieldWitness: GeneratedSiteReadingV0FieldWitness,
): GeneratedSiteReadingV0AmbiguityWitness {
  if (!fieldCue) {
    return {
      ambiguityStatus: 'unsupported',
      ambiguityWarnings: ['Field cue unavailable.'],
      unsupportedCaveats: [...fieldWitness.fieldWitnessCaveats],
    };
  }

  const warningStatuses = fieldCue.warningStatuses;
  const degeneracyStatuses = fieldCue.inheritanceAxis.degeneracyStatuses;
  const ambiguityStatus = pickAmbiguityStatus(fieldCue);
  const unsupportedCaveats = uniqueStrings([
    ...fieldWitness.fieldWitnessCaveats.filter((caveat) =>
      caveat.toLowerCase().includes('unavailable') ||
      caveat.toLowerCase().includes('unsupported') ||
      caveat.toLowerCase().includes('weak'),
    ),
    ...(fieldCue.candidateFieldWorldAxis.candidateReferenceCount === 0
      ? ['No candidate field participation was found for this site under V0.']
      : []),
  ]);

  return {
    ambiguityStatus,
    ambiguityWarnings: uniqueStrings([
      ...warningStatuses.map((status) => `field-warning-status:${status}`),
      ...fieldCue.warnings,
      ...degeneracyStatuses.map((status) => `degeneracy-status:${status}`),
    ]),
    unsupportedCaveats,
  };
}

function buildHumanNamingPrompt(
  fieldCue: FieldCueV0 | undefined,
): GeneratedSiteReadingV0HumanNamingPrompt {
  const fieldQuestions = fieldCue?.namingQuestions ?? [];
  const primaryNamingQuestion =
    'What, if anything, can dwell at this generated site?';
  const secondaryNamingQuestions = uniqueStrings([
    'Does the source-edge relation dominate the reading, or does field pressure alter it?',
    'Should this site be named, rejected, suspended, or revised?',
    ...fieldQuestions.slice(0, 2),
  ]);

  return {
    namingPromptStatus: 'question-only',
    primaryNamingQuestion,
    secondaryNamingQuestions,
    forbiddenConclusions: [
      'No concept name is assigned by this reading.',
      'No final semantic assignment is made.',
      'No packet writing or naming persistence is performed.',
      'No topology claim is made.',
    ],
  };
}

function buildReadingUsefulness(args: {
  fieldWitness: GeneratedSiteReadingV0FieldWitness;
  ambiguityWitness: GeneratedSiteReadingV0AmbiguityWitness;
}): GeneratedSiteReadingV0ReadingUsefulness {
  const fieldReferenceCount =
    args.fieldWitness.fieldCandidateReferenceCounts.total;

  if (args.fieldWitness.fieldCueStatus === 'unavailable') {
    return {
      readingUsefulnessStatus: 'unsupported',
      usefulnessSummary:
        'Generated-site reading is unsupported because the field witness is unavailable.',
    };
  }

  if (args.ambiguityWitness.ambiguityStatus === 'degenerate') {
    return {
      readingUsefulnessStatus: 'degenerate-warning',
      usefulnessSummary:
        'Generated-site reading is useful mainly as a degeneracy warning for human inspection.',
    };
  }

  if (args.ambiguityWitness.ambiguityStatus === 'misleading-risk') {
    return {
      readingUsefulnessStatus: 'misleading-risk',
      usefulnessSummary:
        'Generated-site reading has candidate evidence, but warning states make it risky to overread.',
    };
  }

  if (fieldReferenceCount === 0) {
    return {
      readingUsefulnessStatus: 'weak-field-pressure',
      usefulnessSummary:
        'Generated-site reading preserves geometry and birth-law context, but field pressure is weak under V0.',
    };
  }

  if (args.ambiguityWitness.ambiguityStatus === 'candidate-only') {
    return {
      readingUsefulnessStatus: 'candidate-only',
      usefulnessSummary:
        'Generated-site reading is useful as candidate-only pressure for human inspection.',
    };
  }

  return {
    readingUsefulnessStatus: 'useful-for-human-inspection',
    usefulnessSummary:
      'Generated-site reading gathers geometry, birth-law, and field witness pressure for human inspection only.',
  };
}

function pickAmbiguityStatus(
  fieldCue: FieldCueV0,
): GeneratedSiteReadingV0AmbiguityStatus {
  const warningStatuses = fieldCue.warningStatuses;

  if (
    fieldCue.participationStatus === 'unsupported' ||
    fieldCue.inheritanceAxis.inheritanceStatus === 'unresolved'
  ) {
    return 'unsupported';
  }

  if (
    warningStatuses.includes('degenerate') ||
    fieldCue.inheritanceAxis.degeneracyStatuses.some(
      (status) => status !== 'nondegenerate',
    )
  ) {
    return 'degenerate';
  }

  if (warningStatuses.includes('misleading-risk')) {
    return 'misleading-risk';
  }

  if (warningStatuses.includes('sensitive')) {
    return 'sensitive';
  }

  if (warningStatuses.includes('saturated')) {
    return 'saturated';
  }

  if (fieldCue.candidateFieldWorldAxis.candidateReferenceCount > 0) {
    return 'candidate-only';
  }

  if (
    fieldCue.participationStatus === 'weak' ||
    fieldCue.participationStatus === 'not-applicable'
  ) {
    return 'weak';
  }

  return 'clear-enough-for-inspection';
}

function buildStructuralRoleSummary(fieldCue: FieldCueV0 | undefined): string {
  const axis = fieldCue?.inheritanceAxis;

  if (!axis) {
    return 'Geometry witness unavailable for this generated site.';
  }

  const sourceEdge = axis.sourceEdgeId ?? 'unknown source edge';
  const complementEdge = axis.complementEdgeId ?? 'unknown complement edge';
  const antipodalChild = axis.antipodalChildSiteId ?? 'unknown antipodal child';

  return `Generated midpoint child on ${sourceEdge}; paired with complement ${complementEdge}; antipodal child ${antipodalChild}.`;
}

function buildSummary(
  readings: GeneratedSiteReadingV0[],
  issueCount: number,
  ok: boolean,
): GeneratedSiteReadingV0Summary {
  const readingsByUsefulnessStatus = createUsefulnessStatusCounts();
  const readingsByAmbiguityStatus = createAmbiguityStatusCounts();

  for (const reading of readings) {
    readingsByUsefulnessStatus[
      reading.readingUsefulness.readingUsefulnessStatus
    ] += 1;
    readingsByAmbiguityStatus[
      reading.ambiguityWitness.ambiguityStatus
    ] += 1;
  }

  return {
    readingCount: readings.length,
    readingsByUsefulnessStatus,
    readingsByAmbiguityStatus,
    fieldCueAvailableCount: readings.filter(
      (reading) => reading.fieldWitness.fieldCueStatus === 'available',
    ).length,
    fieldCueCandidateOnlyCount: readings.filter(
      (reading) =>
        reading.fieldWitness.fieldCandidateReferenceCounts.total > 0,
    ).length,
    degenerateReadingCount: readings.filter(
      (reading) =>
        reading.ambiguityWitness.ambiguityStatus === 'degenerate',
    ).length,
    weakFieldPressureReadingCount: readings.filter(
      (reading) =>
        reading.readingUsefulness.readingUsefulnessStatus ===
        'weak-field-pressure',
    ).length,
    unsupportedReadingCount: readings.filter(
      (reading) =>
        reading.readingUsefulness.readingUsefulnessStatus === 'unsupported',
    ).length,
    issueCount,
    ok,
  };
}

function createEmptyCandidateReferenceCounts(): GeneratedSiteReadingV0FieldCandidateReferenceCounts {
  return {
    total: 0,
    feature: 0,
    routeGate: 0,
    supportRegion: 0,
  };
}

function createUsefulnessStatusCounts(): Record<
  GeneratedSiteReadingV0UsefulnessStatus,
  number
> {
  return {
    'useful-for-human-inspection': 0,
    'weak-field-pressure': 0,
    'candidate-only': 0,
    'degenerate-warning': 0,
    unsupported: 0,
    'misleading-risk': 0,
  };
}

function createAmbiguityStatusCounts(): Record<
  GeneratedSiteReadingV0AmbiguityStatus,
  number
> {
  return {
    'clear-enough-for-inspection': 0,
    'candidate-only': 0,
    degenerate: 0,
    sensitive: 0,
    saturated: 0,
    weak: 0,
    unsupported: 0,
    'misleading-risk': 0,
  };
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values));
}
