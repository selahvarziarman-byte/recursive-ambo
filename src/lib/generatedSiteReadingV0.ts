import { createSeedShape } from '../data/seeds';
import { applyAmboDissection } from './ambo';
import {
  buildFieldCueV0Report,
  type FieldCueV0,
  type FieldCueV0ParticipationStatus,
  type FieldCueV0SiteId,
} from './fieldCueV0';

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
}

export interface GeneratedSiteReadingV0Issue {
  code:
    | 'canonical-shape-mutated'
    | 'field-cue-report-not-ok'
    | 'invalid-reading-count'
    | 'missing-field-cue'
    | 'unexpected-reading-site-id';
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
  operationRegistryStatus: 'not-operation-registry-work';
  shapeId: string;
  provingEventOperation: 'ambo-dissection';
  provingEventGenerationDepth: 1;
  expectedSiteIds: FieldCueV0SiteId[];
  readingCount: number;
  shapeMutationDetected: boolean;
  packetWriteDetected: false;
  readings: GeneratedSiteReadingV0[];
  summary: GeneratedSiteReadingV0Summary;
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
  const issues: GeneratedSiteReadingV0Issue[] = [];
  const fieldCueBySiteId = new Map(
    fieldCueReport.cues.map((cue) => [cue.siteId, cue]),
  );

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

    if (!fieldCue) {
      issues.push({
        code: 'missing-field-cue',
        message: `GeneratedSiteReadingV0 is missing FieldCueV0 cue ${siteId}.`,
        siteId,
      });
    }

    return buildReading({
      siteId,
      fieldCue,
      fieldCueReportOk: fieldCueReport.ok,
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

  const issueCount = issues.length;
  const ok =
    issueCount === 0 &&
    readings.length === EXPECTED_SITE_IDS.length &&
    !shapeMutationDetected &&
    fieldCueReport.ok;
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
    operationRegistryStatus: 'not-operation-registry-work',
    shapeId: canonicalShape.id,
    provingEventOperation: 'ambo-dissection',
    provingEventGenerationDepth: 1,
    expectedSiteIds: [...EXPECTED_SITE_IDS],
    readingCount: readings.length,
    shapeMutationDetected,
    packetWriteDetected: false,
    readings,
    summary,
    issueCount,
    ok,
    issues,
  };
}

function buildReading(args: {
  siteId: FieldCueV0SiteId;
  fieldCue: FieldCueV0 | undefined;
  fieldCueReportOk: boolean;
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
  };
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

  return {
    fieldCueStatus: fieldCueReportOk ? 'available' : 'issue',
    fieldCueId: fieldCue.cueId,
    fieldParticipationStatus: fieldCue.participationStatus,
    fieldInheritanceStatus: fieldCue.inheritanceAxis.inheritanceStatus,
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
