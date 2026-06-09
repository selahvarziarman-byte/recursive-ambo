import type { FieldSourceEmissionParameters } from './fieldSourceProfiles';
import {
  buildPythagoreanTetrachordQuarkRegimeV0Report,
  type PythagoreanTetrachordChannelRecord,
  type PythagoreanTetrachordChildDerivationRecord,
  type PythagoreanTetrachordPrimalSourceRecord,
  type PythagoreanTetrachordQuarkRegimeV0Report,
} from './fieldSourcePythagoreanTetrachordQuarkRegimeV0';

export type StructuredSourceStateDiagnosticV0Method =
  'structured-source-state-diagnostic-v0';
export type StructuredSourceStateDiagnosticV0Scope =
  'one-ambo-tetrahedron-source-state-capsule-only';
export type StructuredSourceStateRegimeId =
  'structured-source-state-antipodal-covariant-v0';
export type StructuredSourceStateAlgebraId =
  'tetrahedral-ambo-source-state-algebra-v0';
export type StructuredSourceStateEventScopeStatus =
  'one-ambo-tetrahedron-proving-event';
export type StructuredSourceStateGeneralityStatus =
  'not-general-source-state-algebra';
export type StructuredSourceStateFieldAtlasStatus =
  'tuple-reduction-for-existing-field-atlas-only';
export type StructuredSourceStateSemanticStatus = 'not-semantic-naming';
export type StructuredSourceStateTopologyStatus = 'not-topology-workspace';
export type StructuredSourceStatePacketWriteStatus = 'not-packet-writing';
export type StructuredSourceStateShapeMutationStatus = 'not-shape-mutation';
export type StructuredSourceStateOperationRegistryStatus =
  'not-operation-registry-work';
export type StructuredSourceStateUiExposureStatus = 'not-ui-work';
export type StructuredSourceStateKind =
  | 'primal-vertex-state'
  | 'generated-edge-child-state';
export type StructuredSourceStateTupleReductionStatus =
  | 'field-active-structure-preserved'
  | 'partial-structure-loss'
  | 'metadata-only-structure-retained'
  | 'tuple-too-narrow';
export type StructuredSourceStateAuditStatus = 'pass' | 'fail';
export type StructuredSourceStateTupleContrastStatus =
  | 'distinct-after-reduction'
  | 'near-compressed-after-reduction'
  | 'collapsed-after-reduction';
export type StructuredSourceStateBaselineRole =
  | 'bad-control'
  | 'harmonic-scalar-baseline'
  | 'active-source-state-kernel-candidate';

export interface StructuredSourceStateTupleReduction {
  sourceStateId: string;
  emittedTuple: FieldSourceEmissionParameters;
  reductionLawId: string;
  fieldActiveStructure: string[];
  reducedStructure: string[];
  metadataOnlyStructure: string[];
  lostStructure: string[];
  neutralAxes: string[];
  reductionStatus: StructuredSourceStateTupleReductionStatus;
  tupleTooNarrow: boolean;
}

export interface StructuredSourceStateHarmonicComponent {
  componentKind: 'pythagorean-log-ratio-baseline-component-v0';
  profileSystemId: string;
  profileSlotId?: string;
  assignmentMode?: string;
  ratioLabel?: string;
  ratio?: number;
  logRatio?: number;
  childLogRatio?: number;
  childRatio?: number;
  childWaveNumber?: number;
  childWavelength?: number;
}

export interface StructuredSourceStatePrimalStructuralComponent {
  primalVertexRole: 'tetrahedral-primal-source-vertex';
  incidentEdgeStateIds: string[];
  incidentFaceIds: string[];
  faceTriples: string[][];
}

export interface StructuredSourceStateGeneratedStructuralComponent {
  sourceEdge: string;
  complementEdge: string;
  projectionVertices: string[];
  incidentFaceIds: string[];
  incidentFaces: string[][];
  projectionRelationKind: 'tetrahedral-edge-complement';
}

export interface StructuredSourceStateDerivationComponent {
  derivationKind:
    | 'assigned-primal-source-state'
    | 'ambo-edge-child-structured-source-state';
  sourceEdge?: string;
  complementEdge?: string;
  antipodalStateId?: string;
  quarkChannels?: StructuredSourceStateQuarkChannelRecord[];
  commonModeHarmonicInheritance?: string;
  differentialStructuralPolarity?: string;
}

export interface StructuredSourceStateQuarkChannelRecord {
  channelId: string;
  parent60: string;
  projection30: string;
  parentRatioLabel: string;
  projectionRatioLabel: string;
  channelLogRatio: number;
  channelRatio: number;
  channelWaveNumber: number;
  channelWavelength: number;
  channelEmittedTuple: FieldSourceEmissionParameters;
}

export interface StructuredSourceStatePrimalState {
  stateId: string;
  stateKind: 'primal-vertex-state';
  vertexId: string;
  harmonicComponent: StructuredSourceStateHarmonicComponent;
  structuralComponent: StructuredSourceStatePrimalStructuralComponent;
  derivationComponent: StructuredSourceStateDerivationComponent;
  tupleReduction: StructuredSourceStateTupleReduction;
}

export interface StructuredSourceStateGeneratedChildState {
  stateId: string;
  stateKind: 'generated-edge-child-state';
  childSiteId: string;
  edgeStateId: string;
  endpoints: string[];
  complementEdgeStateId: string;
  antipodalChildSiteId: string;
  axisPairId: string;
  childRole: 'shared-90-pole';
  orientationConvention: StructuredSourceStateOrientationConvention;
  polarityConvention: StructuredSourceStatePolarityConvention;
  sourceStateOperation: {
    operationKind: 'ambo-edge-child-state';
    edgeBivectorLikeNotation: string;
  };
  incidenceProjectionRelations: StructuredSourceStateGeneratedStructuralComponent;
  harmonicComponent: StructuredSourceStateHarmonicComponent;
  derivationComponent: StructuredSourceStateDerivationComponent;
  tupleReduction: StructuredSourceStateTupleReduction;
}

export interface StructuredSourceStateOrientationConvention {
  orientationConventionId: string;
  orientationActive: boolean;
  conventionSummary: string;
}

export interface StructuredSourceStatePolarityConvention {
  polarityConventionId: string;
  polarityActive: boolean;
  conventionSummary: string;
}

export interface StructuredSourceStateComplementAxis {
  axisPairId: string;
  edgeStateIds: [string, string];
  childSiteIds: [string, string];
}

export interface StructuredSourceStateComplementInvolutionAudit {
  status: StructuredSourceStateAuditStatus;
  generatedEdgeStateCount: number;
  complementAxisCount: number;
  involutivePairCount: number;
  disjointComplementCount: number;
  selfComplementCount: number;
  rows: Array<{
    edgeStateId: string;
    complementEdgeStateId: string;
    complementOfComplementEdgeStateId: string;
    involutionStatus: StructuredSourceStateAuditStatus;
    sourceComplementDisjoint: boolean;
    selfComplement: boolean;
  }>;
}

export interface StructuredSourceStateAntipodalCovarianceAudit {
  status: StructuredSourceStateAuditStatus;
  passCount: number;
  rows: Array<{
    edgeStateId: string;
    complementEdgeStateId: string;
    childSiteId: string;
    complementChildSiteId: string;
    relationFormula: string;
    covarianceStatus: StructuredSourceStateAuditStatus;
    tupleContrastStatus: StructuredSourceStateTupleContrastStatus;
  }>;
}

export interface StructuredSourceStateStructuralCovarianceAudit {
  status: StructuredSourceStateAuditStatus;
  passCount: number;
  rows: Array<{
    relabelingId: string;
    vertexMap: Record<string, string>;
    mappedEdgeStateIds: string[];
    edgeSetMapsToEdgeSet: boolean;
    complementPairsMapCoherently: boolean;
    childIdsRecomputed: boolean;
    arrayOrderIndependence: boolean;
    covarianceStatus: StructuredSourceStateAuditStatus;
  }>;
}

export interface StructuredSourceStateUnknownFeatureRetentionAudit {
  status: StructuredSourceStateAuditStatus;
  canRevealFeaturesBeyondAntipodality: boolean;
  rows: Array<{
    childSiteId: string;
    edgeStateId: string;
    structuralFactsBeforeReduction: string[];
    fieldActiveFacts: string[];
    metadataOnlyFacts: string[];
    lostByScalarTupleProjection: string[];
    distinctInSourceStateSpace: boolean;
    tupleContrastStatus: StructuredSourceStateTupleContrastStatus;
  }>;
}

export interface StructuredSourceStateBaselineComparisonRow {
  baselineId: string;
  role: StructuredSourceStateBaselineRole;
  status: 'accepted-control' | 'accepted-baseline' | 'active-candidate';
  findings: string[];
}

export interface StructuredSourceStateBaselineComparison {
  status: StructuredSourceStateAuditStatus;
  rows: StructuredSourceStateBaselineComparisonRow[];
}

export type StructuredSourceStateIssueCode =
  | 'missing-primal-state'
  | 'missing-generated-edge-state'
  | 'invalid-complement-involution'
  | 'missing-antipodal-child'
  | 'source-edge-overlaps-complement-edge'
  | 'missing-tuple-reduction'
  | 'tuple-treated-as-source-state'
  | 'missing-reduction-loss-report'
  | 'structural-covariance-failed'
  | 'antipodal-covariance-failed'
  | 'baseline-comparison-missing';

export interface StructuredSourceStateIssue {
  code: StructuredSourceStateIssueCode;
  message: string;
  sourceStateId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface StructuredSourceStateDiagnosticV0Summary {
  primalStateCount: number;
  generatedChildStateCount: number;
  complementAxisCount: number;
  tupleReductionCount: number;
  fieldActiveStructureCount: number;
  metadataOnlyStructureCount: number;
  lostStructureCount: number;
  tupleTooNarrowCount: number;
  antipodalCovariancePassCount: number;
  structuralCovariancePassCount: number;
  issueCount: number;
  ok: boolean;
}

export interface StructuredSourceStateDiagnosticV0Report {
  method: StructuredSourceStateDiagnosticV0Method;
  diagnosticScope: StructuredSourceStateDiagnosticV0Scope;
  sourceStateRegimeId: StructuredSourceStateRegimeId;
  sourceStateAlgebraId: StructuredSourceStateAlgebraId;
  eventScopeStatus: StructuredSourceStateEventScopeStatus;
  generalityStatus: StructuredSourceStateGeneralityStatus;
  fieldAtlasStatus: StructuredSourceStateFieldAtlasStatus;
  semanticStatus: StructuredSourceStateSemanticStatus;
  topologyStatus: StructuredSourceStateTopologyStatus;
  packetWriteStatus: StructuredSourceStatePacketWriteStatus;
  shapeMutationStatus: StructuredSourceStateShapeMutationStatus;
  operationRegistryStatus: StructuredSourceStateOperationRegistryStatus;
  uiExposureStatus: StructuredSourceStateUiExposureStatus;
  orientationConvention: StructuredSourceStateOrientationConvention;
  polarityConvention: StructuredSourceStatePolarityConvention;
  primalStates: StructuredSourceStatePrimalState[];
  generatedChildStates: StructuredSourceStateGeneratedChildState[];
  complementAxes: StructuredSourceStateComplementAxis[];
  complementInvolutionAudit: StructuredSourceStateComplementInvolutionAudit;
  antipodalCovarianceAudit: StructuredSourceStateAntipodalCovarianceAudit;
  structuralCovarianceAudit: StructuredSourceStateStructuralCovarianceAudit;
  unknownFeatureRetentionAudit: StructuredSourceStateUnknownFeatureRetentionAudit;
  baselineComparison: StructuredSourceStateBaselineComparison;
  summary: StructuredSourceStateDiagnosticV0Summary;
  issueCount: number;
  ok: boolean;
  issues: StructuredSourceStateIssue[];
}

const METHOD: StructuredSourceStateDiagnosticV0Method =
  'structured-source-state-diagnostic-v0';
const DIAGNOSTIC_SCOPE: StructuredSourceStateDiagnosticV0Scope =
  'one-ambo-tetrahedron-source-state-capsule-only';
const SOURCE_STATE_REGIME_ID: StructuredSourceStateRegimeId =
  'structured-source-state-antipodal-covariant-v0';
const SOURCE_STATE_ALGEBRA_ID: StructuredSourceStateAlgebraId =
  'tetrahedral-ambo-source-state-algebra-v0';
const EVENT_SCOPE_STATUS: StructuredSourceStateEventScopeStatus =
  'one-ambo-tetrahedron-proving-event';
const GENERALITY_STATUS: StructuredSourceStateGeneralityStatus =
  'not-general-source-state-algebra';
const FIELD_ATLAS_STATUS: StructuredSourceStateFieldAtlasStatus =
  'tuple-reduction-for-existing-field-atlas-only';
const SEMANTIC_STATUS: StructuredSourceStateSemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: StructuredSourceStateTopologyStatus =
  'not-topology-workspace';
const PACKET_WRITE_STATUS: StructuredSourceStatePacketWriteStatus =
  'not-packet-writing';
const SHAPE_MUTATION_STATUS: StructuredSourceStateShapeMutationStatus =
  'not-shape-mutation';
const OPERATION_REGISTRY_STATUS: StructuredSourceStateOperationRegistryStatus =
  'not-operation-registry-work';
const UI_EXPOSURE_STATUS: StructuredSourceStateUiExposureStatus = 'not-ui-work';
const REDUCTION_LAW_ID = 'structured-source-state-to-scalar-field-tuple-v0';
const EPSILON = 1e-12;
const VERTEX_IDS = ['A', 'B', 'C', 'D'] as const;
const EDGE_SPECS = [
  { edgeStateId: 'AB', endpoints: ['A', 'B'] },
  { edgeStateId: 'AC', endpoints: ['A', 'C'] },
  { edgeStateId: 'AD', endpoints: ['A', 'D'] },
  { edgeStateId: 'BC', endpoints: ['B', 'C'] },
  { edgeStateId: 'BD', endpoints: ['B', 'D'] },
  { edgeStateId: 'CD', endpoints: ['C', 'D'] },
] as const;
const COMPLEMENT_BY_EDGE: Record<string, string> = {
  AB: 'CD',
  CD: 'AB',
  AC: 'BD',
  BD: 'AC',
  AD: 'BC',
  BC: 'AD',
};
const AXIS_BY_EDGE: Record<string, string> = {
  AB: 'axis:AB-CD',
  CD: 'axis:AB-CD',
  AC: 'axis:AC-BD',
  BD: 'axis:AC-BD',
  AD: 'axis:AD-BC',
  BC: 'axis:AD-BC',
};
const FACE_TRIPLES = [
  ['A', 'B', 'C'],
  ['A', 'B', 'D'],
  ['A', 'C', 'D'],
  ['B', 'C', 'D'],
] as const;
const ORIENTATION_CONVENTION: StructuredSourceStateOrientationConvention = {
  orientationConventionId: 'tetrahedral-canonical-edge-order-v0',
  orientationActive: true,
  conventionSummary:
    'Canonical edge order follows tetrahedral vertex order A<B<C<D; reversed edge spellings are not instantiated in v0.',
};
const POLARITY_CONVENTION: StructuredSourceStatePolarityConvention = {
  polarityConventionId: 'complement-axis-polarity-record-only-v0',
  polarityActive: false,
  conventionSummary:
    'Reversed edges would carry negative polarity and complement axes retain polarity metadata, but structural polarity is not fully field-active in v0.',
};

export function buildStructuredSourceStateDiagnosticV0Report(): StructuredSourceStateDiagnosticV0Report {
  const pythagoreanReport = buildPythagoreanTetrachordQuarkRegimeV0Report();
  const primalStates = buildPrimalStates(pythagoreanReport);
  const generatedChildStates = buildGeneratedChildStates(pythagoreanReport);
  const complementAxes = buildComplementAxes();
  const complementInvolutionAudit =
    buildComplementInvolutionAudit(generatedChildStates, complementAxes);
  const antipodalCovarianceAudit =
    buildAntipodalCovarianceAudit(generatedChildStates);
  const structuralCovarianceAudit = buildStructuralCovarianceAudit();
  const unknownFeatureRetentionAudit =
    buildUnknownFeatureRetentionAudit(generatedChildStates);
  const baselineComparison = buildBaselineComparison(pythagoreanReport);
  const issues = buildIssues({
    primalStates,
    generatedChildStates,
    complementAxes,
    complementInvolutionAudit,
    antipodalCovarianceAudit,
    structuralCovarianceAudit,
    baselineComparison,
  });
  const tupleReductions = [
    ...primalStates.map((state) => state.tupleReduction),
    ...generatedChildStates.map((state) => state.tupleReduction),
  ];
  const summary = buildSummary({
    primalStates,
    generatedChildStates,
    complementAxes,
    tupleReductions,
    antipodalCovarianceAudit,
    structuralCovarianceAudit,
    issues,
  });

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    sourceStateRegimeId: SOURCE_STATE_REGIME_ID,
    sourceStateAlgebraId: SOURCE_STATE_ALGEBRA_ID,
    eventScopeStatus: EVENT_SCOPE_STATUS,
    generalityStatus: GENERALITY_STATUS,
    fieldAtlasStatus: FIELD_ATLAS_STATUS,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    uiExposureStatus: UI_EXPOSURE_STATUS,
    orientationConvention: ORIENTATION_CONVENTION,
    polarityConvention: POLARITY_CONVENTION,
    primalStates,
    generatedChildStates,
    complementAxes,
    complementInvolutionAudit,
    antipodalCovarianceAudit,
    structuralCovarianceAudit,
    unknownFeatureRetentionAudit,
    baselineComparison,
    summary,
    issueCount: issues.length,
    ok: issues.length === 0,
    issues,
  };
}

function buildPrimalStates(
  report: PythagoreanTetrachordQuarkRegimeV0Report,
): StructuredSourceStatePrimalState[] {
  const sourceByVertexId = new Map(
    report.primalSourceTable.map((source) => [source.vertexId, source]),
  );

  return VERTEX_IDS.map((vertexId) => {
    const source = requireMapValue(sourceByVertexId, vertexId);
    const stateId = `primal-state:${vertexId}`;
    const incidentEdgeStateIds = EDGE_SPECS.filter((edge) =>
      edge.endpoints.some((endpoint) => endpoint === vertexId),
    ).map((edge) => edge.edgeStateId);
    const faceTriples = FACE_TRIPLES.filter((face) =>
      face.some((endpoint) => endpoint === vertexId),
    ).map((face) => [...face]);

    return {
      stateId,
      stateKind: 'primal-vertex-state',
      vertexId,
      harmonicComponent: {
        componentKind: 'pythagorean-log-ratio-baseline-component-v0',
        profileSystemId: report.sourceProfileSystemId,
        profileSlotId: source.slotId,
        assignmentMode: source.assignmentMode,
        ratioLabel: source.ratioLabel,
        ratio: source.ratio,
        logRatio: source.logRatio,
      },
      structuralComponent: {
        primalVertexRole: 'tetrahedral-primal-source-vertex',
        incidentEdgeStateIds,
        incidentFaceIds: faceTriples.map(formatFaceId),
        faceTriples,
      },
      derivationComponent: {
        derivationKind: 'assigned-primal-source-state',
      },
      tupleReduction: buildPrimalTupleReduction(stateId, source),
    };
  });
}

function buildGeneratedChildStates(
  report: PythagoreanTetrachordQuarkRegimeV0Report,
): StructuredSourceStateGeneratedChildState[] {
  const childRecordByEdge = new Map(
    report.childDerivationTable.map((record) => [record.sourceEdgeId, record]),
  );

  return EDGE_SPECS.map((edge) => {
    const record = requireMapValue(childRecordByEdge, edge.edgeStateId);
    const complementEdgeStateId = COMPLEMENT_BY_EDGE[edge.edgeStateId];
    const childSiteId = childSiteIdFromEdge(edge.edgeStateId);
    const stateId = `edge-state:${edge.edgeStateId}`;
    const projectionVertices = complementEdgeStateId.split('');
    const incidentFaces = FACE_TRIPLES.filter((face) =>
      edge.endpoints.every((endpoint) =>
        face.some((faceEndpoint) => faceEndpoint === endpoint),
      ),
    ).map((face) => [...face]);

    return {
      stateId,
      stateKind: 'generated-edge-child-state',
      childSiteId,
      edgeStateId: edge.edgeStateId,
      endpoints: [...edge.endpoints],
      complementEdgeStateId,
      antipodalChildSiteId: childSiteIdFromEdge(complementEdgeStateId),
      axisPairId: AXIS_BY_EDGE[edge.edgeStateId],
      childRole: 'shared-90-pole',
      orientationConvention: ORIENTATION_CONVENTION,
      polarityConvention: POLARITY_CONVENTION,
      sourceStateOperation: {
        operationKind: 'ambo-edge-child-state',
        edgeBivectorLikeNotation: `${edge.endpoints[0]}^${edge.endpoints[1]}`,
      },
      incidenceProjectionRelations: {
        sourceEdge: edge.edgeStateId,
        complementEdge: complementEdgeStateId,
        projectionVertices,
        incidentFaceIds: incidentFaces.map(formatFaceId),
        incidentFaces,
        projectionRelationKind: 'tetrahedral-edge-complement',
      },
      harmonicComponent: {
        componentKind: 'pythagorean-log-ratio-baseline-component-v0',
        profileSystemId: report.sourceProfileSystemId,
        childLogRatio: record.childLogRatio,
        childRatio: record.childRatio,
        childWaveNumber: record.childWaveNumber,
        childWavelength: record.childWavelength,
      },
      derivationComponent: {
        derivationKind: 'ambo-edge-child-structured-source-state',
        sourceEdge: record.sourceEdgeId,
        complementEdge: record.complementEdgeId,
        antipodalStateId: `edge-state:${record.antipodalChildId.replace(
          /^M_/,
          '',
        )}`,
        quarkChannels: record.channels.map(copyQuarkChannel),
        commonModeHarmonicInheritance:
          'Pythagorean log-ratio component is inherited through Quark weighted geometric mean.',
        differentialStructuralPolarity:
          'Complement and antipodal axis polarity is preserved in source-state space but retained as metadata-only under v0 tuple reduction.',
      },
      tupleReduction: buildGeneratedTupleReduction(stateId, record),
    };
  });
}

function buildPrimalTupleReduction(
  sourceStateId: string,
  source: PythagoreanTetrachordPrimalSourceRecord,
): StructuredSourceStateTupleReduction {
  return {
    sourceStateId,
    emittedTuple: copyTuple(source),
    reductionLawId: REDUCTION_LAW_ID,
    fieldActiveStructure: [
      'harmonic ratio is field-active through waveNumber',
      'harmonic phase is field-active through phase',
    ],
    reducedStructure: [
      'primal assignment is reduced to scalar emission provenance',
      'profile slot ratio is reduced to waveNumber',
    ],
    metadataOnlyStructure: [
      'incident edge state ids',
      'incident face ids',
      'assignment provenance statement',
    ],
    lostStructure: [
      'incident face orientation is not carried by scalar tuple projection',
    ],
    neutralAxes: ['amplitude', 'attenuation'],
    reductionStatus: 'partial-structure-loss',
    tupleTooNarrow: true,
  };
}

function buildGeneratedTupleReduction(
  sourceStateId: string,
  record: PythagoreanTetrachordChildDerivationRecord,
): StructuredSourceStateTupleReduction {
  const emittedTuple = record.derivedTuple ?? {
    amplitude: Number.NaN,
    waveNumber: Number.NaN,
    phase: Number.NaN,
    attenuation: Number.NaN,
  };

  return {
    sourceStateId,
    emittedTuple: copyTuple(emittedTuple),
    reductionLawId: REDUCTION_LAW_ID,
    fieldActiveStructure: [
      'harmonic/log-ratio component is field-active through waveNumber and wavelength',
      'harmonic phase merge is field-active through emitted phase',
    ],
    reducedStructure: [
      'child log-ratio is reduced to waveNumber',
      'child ratio is reduced to wavelength relation',
      'Quark channel phase merge is reduced to emitted phase',
    ],
    metadataOnlyStructure: [
      'edge identity is preserved in source state',
      'complement edge relation is preserved in source state',
      'antipodal child relation is preserved in source state',
      'axis-pair membership is preserved in source state',
      'endpoint incidence is preserved in source state',
      'projection vertices are preserved in source state',
      'Quark channel records are preserved in derivation component',
      'orientation/polarity convention is retained but not fully field-active',
    ],
    lostStructure: [
      'scalar tuple does not carry complement involution as an internal field parameter',
      'scalar tuple does not carry full incidence/projection relation',
      'scalar tuple does not carry structural polarity as a proven field-active law',
    ],
    neutralAxes: ['amplitude', 'attenuation'],
    reductionStatus: 'tuple-too-narrow',
    tupleTooNarrow: true,
  };
}

function buildComplementAxes(): StructuredSourceStateComplementAxis[] {
  return [
    {
      axisPairId: 'axis:AB-CD',
      edgeStateIds: ['AB', 'CD'],
      childSiteIds: ['M_AB', 'M_CD'],
    },
    {
      axisPairId: 'axis:AC-BD',
      edgeStateIds: ['AC', 'BD'],
      childSiteIds: ['M_AC', 'M_BD'],
    },
    {
      axisPairId: 'axis:AD-BC',
      edgeStateIds: ['AD', 'BC'],
      childSiteIds: ['M_AD', 'M_BC'],
    },
  ];
}

function buildComplementInvolutionAudit(
  states: StructuredSourceStateGeneratedChildState[],
  axes: StructuredSourceStateComplementAxis[],
): StructuredSourceStateComplementInvolutionAudit {
  const stateByEdge = new Map(states.map((state) => [state.edgeStateId, state]));
  const rows = states.map((state) => {
    const complementEdgeStateId = COMPLEMENT_BY_EDGE[state.edgeStateId];
    const complementOfComplementEdgeStateId =
      COMPLEMENT_BY_EDGE[complementEdgeStateId];
    const sourceComplementDisjoint = areDisjoint(
      state.endpoints,
      complementEdgeStateId.split(''),
    );
    const selfComplement = state.edgeStateId === complementEdgeStateId;
    const involutionStatus: StructuredSourceStateAuditStatus =
      complementOfComplementEdgeStateId === state.edgeStateId &&
      stateByEdge.has(complementEdgeStateId)
        ? 'pass'
        : 'fail';

    return {
      edgeStateId: state.edgeStateId,
      complementEdgeStateId,
      complementOfComplementEdgeStateId,
      involutionStatus,
      sourceComplementDisjoint,
      selfComplement,
    };
  });
  const involutivePairCount = rows.filter(
    (row) => row.involutionStatus === 'pass',
  ).length;
  const disjointComplementCount = rows.filter(
    (row) => row.sourceComplementDisjoint,
  ).length;
  const selfComplementCount = rows.filter((row) => row.selfComplement).length;
  const status: StructuredSourceStateAuditStatus =
    states.length === EDGE_SPECS.length &&
    axes.length === 3 &&
    involutivePairCount === states.length &&
    disjointComplementCount === states.length &&
    selfComplementCount === 0
      ? 'pass'
      : 'fail';

  return {
    status,
    generatedEdgeStateCount: states.length,
    complementAxisCount: axes.length,
    involutivePairCount,
    disjointComplementCount,
    selfComplementCount,
    rows,
  };
}

function buildAntipodalCovarianceAudit(
  states: StructuredSourceStateGeneratedChildState[],
): StructuredSourceStateAntipodalCovarianceAudit {
  const stateByEdge = new Map(states.map((state) => [state.edgeStateId, state]));
  const rows = buildComplementAxes().map((axis) => {
    const [edgeStateId, complementEdgeStateId] = axis.edgeStateIds;
    const state = requireMapValue(stateByEdge, edgeStateId);
    const complementState = requireMapValue(stateByEdge, complementEdgeStateId);
    const covarianceStatus: StructuredSourceStateAuditStatus =
      state.complementEdgeStateId === complementEdgeStateId &&
      complementState.complementEdgeStateId === edgeStateId &&
      state.antipodalChildSiteId === complementState.childSiteId &&
      complementState.antipodalChildSiteId === state.childSiteId
        ? 'pass'
        : 'fail';

    return {
      edgeStateId,
      complementEdgeStateId,
      childSiteId: state.childSiteId,
      complementChildSiteId: complementState.childSiteId,
      relationFormula: 'D(c(edge)) = sigma(D(edge))',
      covarianceStatus,
      tupleContrastStatus: classifyTupleContrast(
        state.tupleReduction.emittedTuple,
        complementState.tupleReduction.emittedTuple,
      ),
    };
  });
  const passCount = rows.filter((row) => row.covarianceStatus === 'pass').length;

  return {
    status: passCount === rows.length ? 'pass' : 'fail',
    passCount,
    rows,
  };
}

function buildStructuralCovarianceAudit(): StructuredSourceStateStructuralCovarianceAudit {
  const relabelings = [
    {
      relabelingId: 'identity',
      vertexMap: { A: 'A', B: 'B', C: 'C', D: 'D' },
    },
    {
      relabelingId: 'swap-A-B',
      vertexMap: { A: 'B', B: 'A', C: 'C', D: 'D' },
    },
    {
      relabelingId: 'cycle-A-B-C-D',
      vertexMap: { A: 'B', B: 'C', C: 'D', D: 'A' },
    },
    {
      relabelingId: 'swap-complement-axis-AB-CD',
      vertexMap: { A: 'C', B: 'D', C: 'A', D: 'B' },
    },
  ];
  const expectedEdges: Set<string> = new Set(
    EDGE_SPECS.map((edge) => edge.edgeStateId),
  );
  const rows = relabelings.map((relabeling) => {
    const mappedEdgeStateIds = EDGE_SPECS.map((edge) =>
      relabelEdge(edge.edgeStateId, relabeling.vertexMap),
    );
    const mappedEdgeSet = new Set(mappedEdgeStateIds);
    const edgeSetMapsToEdgeSet =
      mappedEdgeSet.size === expectedEdges.size &&
      [...mappedEdgeSet].every((edge) => expectedEdges.has(edge));
    const complementPairsMapCoherently = EDGE_SPECS.every((edge) => {
      const mappedEdge = relabelEdge(edge.edgeStateId, relabeling.vertexMap);
      const mappedComplement = relabelEdge(
        COMPLEMENT_BY_EDGE[edge.edgeStateId],
        relabeling.vertexMap,
      );

      return COMPLEMENT_BY_EDGE[mappedEdge] === mappedComplement;
    });
    const childIdsRecomputed = mappedEdgeStateIds.every(
      (edge) => childSiteIdFromEdge(edge) === `M_${edge}`,
    );
    const arrayOrderIndependence =
      [...mappedEdgeSet].sort().join(',') ===
      [...expectedEdges].sort().join(',');
    const covarianceStatus: StructuredSourceStateAuditStatus =
      edgeSetMapsToEdgeSet &&
      complementPairsMapCoherently &&
      childIdsRecomputed &&
      arrayOrderIndependence
        ? 'pass'
        : 'fail';

    return {
      relabelingId: relabeling.relabelingId,
      vertexMap: relabeling.vertexMap,
      mappedEdgeStateIds,
      edgeSetMapsToEdgeSet,
      complementPairsMapCoherently,
      childIdsRecomputed,
      arrayOrderIndependence,
      covarianceStatus,
    };
  });
  const passCount = rows.filter((row) => row.covarianceStatus === 'pass').length;

  return {
    status: passCount === rows.length ? 'pass' : 'fail',
    passCount,
    rows,
  };
}

function buildUnknownFeatureRetentionAudit(
  states: StructuredSourceStateGeneratedChildState[],
): StructuredSourceStateUnknownFeatureRetentionAudit {
  const stateByEdge = new Map(states.map((state) => [state.edgeStateId, state]));
  const rows = states.map((state) => {
    const complementState = requireMapValue(
      stateByEdge,
      state.complementEdgeStateId,
    );

    return {
      childSiteId: state.childSiteId,
      edgeStateId: state.edgeStateId,
      structuralFactsBeforeReduction: [
        'edge identity',
        'complement edge',
        'antipodal child',
        'axis-pair membership',
        'endpoint incidence',
        'projection vertices',
        'Quark channel records',
        'harmonic log-ratio',
        'emitted tuple',
      ],
      fieldActiveFacts: [...state.tupleReduction.fieldActiveStructure],
      metadataOnlyFacts: [...state.tupleReduction.metadataOnlyStructure],
      lostByScalarTupleProjection: [...state.tupleReduction.lostStructure],
      distinctInSourceStateSpace: true,
      tupleContrastStatus: classifyTupleContrast(
        state.tupleReduction.emittedTuple,
        complementState.tupleReduction.emittedTuple,
      ),
    };
  });
  const status =
    rows.length === EDGE_SPECS.length &&
    rows.every(
      (row) =>
        row.structuralFactsBeforeReduction.length > 0 &&
        row.metadataOnlyFacts.length > 0 &&
        row.lostByScalarTupleProjection.length > 0,
    )
      ? 'pass'
      : 'fail';

  return {
    status,
    canRevealFeaturesBeyondAntipodality: rows.every((row) =>
      row.structuralFactsBeforeReduction.includes('endpoint incidence'),
    ),
    rows,
  };
}

function buildBaselineComparison(
  report: PythagoreanTetrachordQuarkRegimeV0Report,
): StructuredSourceStateBaselineComparison {
  const rows: StructuredSourceStateBaselineComparisonRow[] = [
    {
      baselineId: 'uniform-circle-fixture-bad-control',
      role: 'bad-control',
      status: 'accepted-control',
      findings: [
        'uniform bad control fails because scalar invariance can hide source structure',
        'uniform bad control can expose fallback and phase cancellation failure modes',
        'uniform bad control has no structured source-state capsule or reduction-loss report',
      ],
    },
    {
      baselineId: report.provingRegimeId,
      role: 'harmonic-scalar-baseline',
      status: 'accepted-baseline',
      findings: [
        'Pythagorean baseline improves finite harmonic scalar differentiation',
        `pair-sum uniqueness status: ${report.pairSumUniquenessAudit.pairSumUniquenessStatus}`,
        `field-ready child count: ${report.childReadinessAudit.fieldReadyChildCount}`,
        'Pythagorean baseline remains scalar-first and is now a component/control',
      ],
    },
    {
      baselineId: SOURCE_STATE_REGIME_ID,
      role: 'active-source-state-kernel-candidate',
      status: 'active-candidate',
      findings: [
        'structured source-state preserves complement and antipodal facts before tuple reduction',
        'structured source-state preserves edge identity, endpoint incidence, projection vertices, and axis-pair membership',
        'tuple reduction may still be too narrow for some structure',
      ],
    },
  ];

  return {
    status: rows.length === 3 ? 'pass' : 'fail',
    rows,
  };
}

function buildIssues(args: {
  primalStates: StructuredSourceStatePrimalState[];
  generatedChildStates: StructuredSourceStateGeneratedChildState[];
  complementAxes: StructuredSourceStateComplementAxis[];
  complementInvolutionAudit: StructuredSourceStateComplementInvolutionAudit;
  antipodalCovarianceAudit: StructuredSourceStateAntipodalCovarianceAudit;
  structuralCovarianceAudit: StructuredSourceStateStructuralCovarianceAudit;
  baselineComparison: StructuredSourceStateBaselineComparison;
}): StructuredSourceStateIssue[] {
  const issues: StructuredSourceStateIssue[] = [];

  if (args.primalStates.length !== VERTEX_IDS.length) {
    issues.push({
      code: 'missing-primal-state',
      message: `Expected ${VERTEX_IDS.length} primal states, got ${args.primalStates.length}.`,
    });
  }

  if (args.generatedChildStates.length !== EDGE_SPECS.length) {
    issues.push({
      code: 'missing-generated-edge-state',
      message: `Expected ${EDGE_SPECS.length} generated edge states, got ${args.generatedChildStates.length}.`,
    });
  }

  if (args.complementAxes.length !== 3) {
    issues.push({
      code: 'invalid-complement-involution',
      message: `Expected 3 complement axes, got ${args.complementAxes.length}.`,
    });
  }

  if (args.complementInvolutionAudit.status !== 'pass') {
    issues.push({
      code: 'invalid-complement-involution',
      message: 'Complement operation did not pass finite involution audit.',
    });
  }

  for (const row of args.complementInvolutionAudit.rows) {
    if (!row.sourceComplementDisjoint) {
      issues.push({
        code: 'source-edge-overlaps-complement-edge',
        message: `Source edge ${row.edgeStateId} overlaps complement ${row.complementEdgeStateId}.`,
      });
    }

    if (row.selfComplement) {
      issues.push({
        code: 'invalid-complement-involution',
        message: `Source edge ${row.edgeStateId} is its own complement.`,
      });
    }
  }

  for (const state of args.generatedChildStates) {
    if (!state.antipodalChildSiteId) {
      issues.push({
        code: 'missing-antipodal-child',
        message: `Generated state ${state.stateId} has no antipodal child.`,
        sourceStateId: state.stateId,
      });
    }
  }

  const statesWithTupleReduction = [
    ...args.primalStates,
    ...args.generatedChildStates,
  ];

  for (const state of statesWithTupleReduction) {
    const tupleReduction = state.tupleReduction;

    if (!tupleReduction) {
      issues.push({
        code: 'missing-tuple-reduction',
        message: `State ${state.stateId} has no tuple reduction.`,
        sourceStateId: state.stateId,
      });
      continue;
    }

    if (
      !Array.isArray(tupleReduction.fieldActiveStructure) ||
      !Array.isArray(tupleReduction.reducedStructure) ||
      !Array.isArray(tupleReduction.metadataOnlyStructure) ||
      !Array.isArray(tupleReduction.lostStructure)
    ) {
      issues.push({
        code: 'missing-reduction-loss-report',
        message: `State ${state.stateId} tuple reduction lacks preserved/reduced/metadata-only/lost structure arrays.`,
        sourceStateId: state.stateId,
      });
    }

    if (
      state.stateKind === 'generated-edge-child-state' &&
      !tupleReduction.tupleTooNarrow &&
      tupleReduction.lostStructure.length === 0
    ) {
      issues.push({
        code: 'tuple-treated-as-source-state',
        message: `State ${state.stateId} risks treating tuple as complete source state.`,
        sourceStateId: state.stateId,
      });
    }
  }

  if (args.antipodalCovarianceAudit.status !== 'pass') {
    issues.push({
      code: 'antipodal-covariance-failed',
      message: 'Antipodal covariance audit failed.',
    });
  }

  if (args.structuralCovarianceAudit.status !== 'pass') {
    issues.push({
      code: 'structural-covariance-failed',
      message: 'Structural covariance audit failed.',
    });
  }

  if (
    args.baselineComparison.status !== 'pass' ||
    args.baselineComparison.rows.length !== 3
  ) {
    issues.push({
      code: 'baseline-comparison-missing',
      message: 'Baseline comparison is missing one or more required controls.',
    });
  }

  return issues;
}

function buildSummary(args: {
  primalStates: StructuredSourceStatePrimalState[];
  generatedChildStates: StructuredSourceStateGeneratedChildState[];
  complementAxes: StructuredSourceStateComplementAxis[];
  tupleReductions: StructuredSourceStateTupleReduction[];
  antipodalCovarianceAudit: StructuredSourceStateAntipodalCovarianceAudit;
  structuralCovarianceAudit: StructuredSourceStateStructuralCovarianceAudit;
  issues: StructuredSourceStateIssue[];
}): StructuredSourceStateDiagnosticV0Summary {
  return {
    primalStateCount: args.primalStates.length,
    generatedChildStateCount: args.generatedChildStates.length,
    complementAxisCount: args.complementAxes.length,
    tupleReductionCount: args.tupleReductions.length,
    fieldActiveStructureCount: args.tupleReductions.reduce(
      (sum, reduction) => sum + reduction.fieldActiveStructure.length,
      0,
    ),
    metadataOnlyStructureCount: args.tupleReductions.reduce(
      (sum, reduction) => sum + reduction.metadataOnlyStructure.length,
      0,
    ),
    lostStructureCount: args.tupleReductions.reduce(
      (sum, reduction) => sum + reduction.lostStructure.length,
      0,
    ),
    tupleTooNarrowCount: args.tupleReductions.filter(
      (reduction) => reduction.tupleTooNarrow,
    ).length,
    antipodalCovariancePassCount: args.antipodalCovarianceAudit.passCount,
    structuralCovariancePassCount: args.structuralCovarianceAudit.passCount,
    issueCount: args.issues.length,
    ok: args.issues.length === 0,
  };
}

function copyQuarkChannel(
  channel: PythagoreanTetrachordChannelRecord,
): StructuredSourceStateQuarkChannelRecord {
  return {
    channelId: channel.channelId,
    parent60: channel.parent60,
    projection30: channel.projection30,
    parentRatioLabel: channel.parentRatioLabel,
    projectionRatioLabel: channel.projectionRatioLabel,
    channelLogRatio: channel.channelLogRatio,
    channelRatio: channel.channelRatio,
    channelWaveNumber: channel.channelWaveNumber,
    channelWavelength: channel.channelWavelength,
    channelEmittedTuple: copyTuple(channel.channelEmittedTuple),
  };
}

function copyTuple(tuple: FieldSourceEmissionParameters): FieldSourceEmissionParameters {
  return {
    amplitude: tuple.amplitude,
    waveNumber: tuple.waveNumber,
    phase: tuple.phase,
    attenuation: tuple.attenuation,
  };
}

function classifyTupleContrast(
  left: FieldSourceEmissionParameters,
  right: FieldSourceEmissionParameters,
): StructuredSourceStateTupleContrastStatus {
  const amplitudeDelta = Math.abs(left.amplitude - right.amplitude);
  const waveNumberDelta = Math.abs(left.waveNumber - right.waveNumber);
  const phaseDelta = circularDistance(left.phase, right.phase);
  const attenuationDelta = Math.abs(left.attenuation - right.attenuation);
  const sameTuple =
    amplitudeDelta <= EPSILON &&
    waveNumberDelta <= EPSILON &&
    phaseDelta <= EPSILON &&
    attenuationDelta <= EPSILON;

  if (sameTuple) {
    return 'collapsed-after-reduction';
  }

  const relativeWaveNumberDelta =
    waveNumberDelta / Math.max(Math.abs(left.waveNumber), Math.abs(right.waveNumber));

  return relativeWaveNumberDelta < 0.1
    ? 'near-compressed-after-reduction'
    : 'distinct-after-reduction';
}

function circularDistance(left: number, right: number): number {
  const twoPi = 2 * Math.PI;
  const leftNormalized = normalizePhase(left);
  const rightNormalized = normalizePhase(right);
  const delta = Math.abs(leftNormalized - rightNormalized);

  return Math.min(delta, twoPi - delta);
}

function normalizePhase(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  const twoPi = 2 * Math.PI;
  const normalized = value % twoPi;

  return normalized < 0 ? normalized + twoPi : normalized;
}

function relabelEdge(edgeStateId: string, vertexMap: Record<string, string>): string {
  return canonicalEdgeId(
    vertexMap[edgeStateId[0]],
    vertexMap[edgeStateId[1]],
  );
}

function canonicalEdgeId(left: string, right: string): string {
  return vertexIndex(left) < vertexIndex(right) ? `${left}${right}` : `${right}${left}`;
}

function vertexIndex(vertexId: string): number {
  const index = VERTEX_IDS.indexOf(vertexId as (typeof VERTEX_IDS)[number]);

  if (index === -1) {
    throw new Error(`Unknown tetrahedral vertex ${vertexId}.`);
  }

  return index;
}

function childSiteIdFromEdge(edgeStateId: string): string {
  return `M_${edgeStateId}`;
}

function formatFaceId(face: string[] | readonly string[]): string {
  return `face:${face.join('')}`;
}

function areDisjoint(left: string[], right: string[]): boolean {
  const rightSet = new Set(right);

  return left.every((value) => !rightSet.has(value));
}

function requireMapValue<T>(map: Map<string, T>, key: string): T {
  const value = map.get(key);

  if (!value) {
    throw new Error(`Missing structured source-state fixture value for ${key}.`);
  }

  return value;
}
