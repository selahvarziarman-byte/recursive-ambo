import {
  buildTetrahedralAmboChildContexts,
  createTetrahedralVertexFixture,
  type TetrahedralAmboChildContext,
} from './fieldSourceChildContexts';
import type { FieldSourceEmissionParameters } from './fieldSourceProfiles';
import {
  QUARK_PARENT_WEIGHT,
  QUARK_PROJECTION_WEIGHT,
} from './fieldSourceQuarkChannels';

export type PythagoreanTetrachordProvingRegimeId =
  'pythagorean-tetrachord-quark-regime-v0';
export type PythagoreanTetrachordSourceProfileSystemId =
  'pythagorean-tetrachord-primal-profile-system-v0';
export type PythagoreanTetrachordChildInheritanceGrammarId =
  'tetrahedral-quark-log-wave-number-inheritance-v0';
export type PythagoreanTetrachordSourcePolicyId =
  'pythagorean-tetrachord-quark-proving-policy-v0';
export type PythagoreanTetrachordBoundaryStatus =
  | 'not-semantic-naming'
  | 'not-topology-workspace'
  | 'not-packet-writing'
  | 'not-shape-mutation'
  | 'not-operation-registry-work';
export type PythagoreanTetrachordStatus = 'pass' | 'fail';
export type PythagoreanTetrachordHumanLegibilityStatus =
  | 'useful'
  | 'weak'
  | 'misleading';
export type PythagoreanTetrachordChildReadinessStatus =
  | 'all-field-ready'
  | 'partial-fallback'
  | 'failed';
export type PythagoreanTetrachordCircularMergeStatus =
  | 'derived'
  | 'undefined-circular-mean'
  | 'fallback';
export type PythagoreanTetrachordLocalDerivationStatus =
  | 'derived'
  | 'undefined-circular-mean'
  | 'fallback-used';
export type PythagoreanTetrachordAssignmentMode =
  'default-proving-fixture';
export type PythagoreanTetrachordShellScalingApplication =
  'record-only-v0';
export type PythagoreanTetrachordDifferentiatingAxis =
  | 'waveNumber'
  | 'phase';
export type PythagoreanTetrachordNeutralAxis =
  | 'amplitude'
  | 'attenuation';

export interface PythagoreanTetrachordRatioSlot {
  slotId: string;
  slotIndex: number;
  ratioLabel: string;
  numerator: number;
  denominator: number;
  ratio: number;
  logRatio: number;
  log2Ratio: number;
  assignedVertexId: string;
  assignmentMode: PythagoreanTetrachordAssignmentMode;
  assignmentProvenance: {
    assignedVertexId: string;
    assignmentMode: PythagoreanTetrachordAssignmentMode;
    statement: string;
  };
}

export interface PythagoreanTetrachordBaseWaveNumberCalibration {
  baseWaveNumberCalibrationStatus: 'human-specified-v0';
  baseWaveNumberCalibrationAuditStatus: PythagoreanTetrachordStatus;
  referenceEdgeLengthKind: 'normalized-primal-tetrahedron-edge-v0';
  referenceEdgeLengthValue: number;
  wavelengthToEdgeRatioLabel: '1/8';
  wavelengthToEdgeRatio: number;
  edgeToWavelengthRatio: number;
  referenceWavelength: number;
  baseWaveNumber: number;
  expectedBaseWaveNumber: number;
  calibrationRationale: string;
}

export interface PythagoreanTetrachordEventShellProvenance {
  eventShellProvenanceId: string;
  parentSolid: 'tetrahedron';
  generatedCore: 'midpoint-octahedron';
  parentEdgeLength: number;
  childCoreEdgeLength: number;
  parentCircumradius: number;
  parentInradius: number;
  parentShellRatio: number;
  childCircumradius: number;
  childInradius: number;
  childShellRatio: number;
  circumradiusContraction: number;
  expectedCircumradiusContraction: number;
  inradiusPreserved: boolean;
  localGlobalSqrt3Coherence: PythagoreanTetrachordStatus;
  shellScalingApplication: PythagoreanTetrachordShellScalingApplication;
  shellScalingRationale: string;
  eventShellProvenanceStatus: PythagoreanTetrachordStatus;
}

export interface PythagoreanTetrachordPrimalSourceRecord
  extends FieldSourceEmissionParameters {
  sourceId: string;
  vertexId: string;
  slotId: string;
  slotIndex: number;
  ratioLabel: string;
  ratio: number;
  logRatio: number;
  log2Ratio: number;
  wavelength: number;
  assignmentMode: PythagoreanTetrachordAssignmentMode;
  assignmentProvenance: PythagoreanTetrachordRatioSlot['assignmentProvenance'];
  activeDifferentiatingAxes: PythagoreanTetrachordDifferentiatingAxis[];
  neutralAxes: PythagoreanTetrachordNeutralAxis[];
}

export interface PythagoreanTetrachordChannelRecord {
  channelId: string;
  childId: string;
  parent60: string;
  projection30: string;
  parentWeight: number;
  projectionWeight: number;
  parentSlotId: string;
  parentRatioLabel: string;
  parentRatio: number;
  parentLogRatio: number;
  projectionSlotId: string;
  projectionRatioLabel: string;
  projectionRatio: number;
  projectionLogRatio: number;
  channelLogRatio: number;
  channelRatio: number;
  channelWaveNumber: number;
  channelWavelength: number;
  channelEmittedTuple: FieldSourceEmissionParameters;
  channelDerivationLawId: PythagoreanTetrachordChildInheritanceGrammarId;
}

export interface PythagoreanTetrachordChildDerivationRecord {
  childId: string;
  sourceEdgeId: string;
  sourceEdgeVertexIds: [string, string];
  complementEdgeId: string;
  complementEdgeVertexIds: [string, string];
  antipodalChildId: string;
  projectionVertexIds: [string, string];
  channelPairs: string[];
  channels: PythagoreanTetrachordChannelRecord[];
  childLogRatio: number;
  childRatio: number;
  childWaveNumber: number;
  childWavelength: number;
  formulaExplanation: string;
  derivedTuple?: FieldSourceEmissionParameters;
  localDerivationStatus: PythagoreanTetrachordLocalDerivationStatus;
  fieldReady: boolean;
  fallbackKind?: 'unresolved-child-source-profile';
  fallbackReason?: string;
  neutralAxes: PythagoreanTetrachordNeutralAxis[];
  activeDifferentiatingAxes: PythagoreanTetrachordDifferentiatingAxis[];
  eventShellProvenanceId: string;
  shellScalingApplication: PythagoreanTetrachordShellScalingApplication;
  childWaveNumberShellScalingApplied: false;
  childAttenuationShellScalingApplied: false;
}

export interface PythagoreanTetrachordPairSumRow {
  edgeId: string;
  vertexIds: [string, string];
  ratioProductLabel: string;
  pairRatioProduct: number;
  pairLogRatioSum: number;
  uniquenessKey: string;
}

export interface PythagoreanTetrachordPairSumUniquenessAudit {
  pairSumUniquenessStatus: PythagoreanTetrachordStatus;
  edgeCount: number;
  uniquePairSumCount: number;
  rows: PythagoreanTetrachordPairSumRow[];
  explanation: string;
}

export interface PythagoreanTetrachordChildReadinessAudit {
  expectedChildCount: 6;
  derivedChildCount: number;
  fallbackChildCount: number;
  unresolvedChildCount: number;
  fieldReadyChildCount: number;
  nonFieldReadyChildCount: number;
  childReadinessStatus: PythagoreanTetrachordChildReadinessStatus;
}

export interface PythagoreanTetrachordPhaseMergeRow {
  childId: string;
  channelPhases: number[];
  circularMergeStatus: PythagoreanTetrachordCircularMergeStatus;
  explanation?: string;
}

export interface PythagoreanTetrachordChildDistinctivenessAudit {
  uniqueAmplitudeCount: number;
  uniqueWaveNumberCount: number;
  uniqueAttenuationCount: number;
  uniquePhaseCount: number;
  uniqueLogRatioCount: number;
  childLogWaveNumberDistinctivenessStatus: PythagoreanTetrachordStatus;
  warning?: string;
}

export interface PythagoreanTetrachordIssue {
  code: string;
  message: string;
  childId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface PythagoreanTetrachordQuarkRegimeV0Report {
  reportId: string;
  provingRegimeId: PythagoreanTetrachordProvingRegimeId;
  sourceProfileSystemId: PythagoreanTetrachordSourceProfileSystemId;
  childInheritanceGrammarId: PythagoreanTetrachordChildInheritanceGrammarId;
  sourcePolicyId: PythagoreanTetrachordSourcePolicyId;
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  packetWriteStatus: 'not-packet-writing';
  shapeMutationStatus: 'not-shape-mutation';
  operationRegistryStatus: 'not-operation-registry-work';
  shellScalingApplication: PythagoreanTetrachordShellScalingApplication;
  profileSlots: PythagoreanTetrachordRatioSlot[];
  assignmentProvenance: Array<PythagoreanTetrachordRatioSlot['assignmentProvenance']>;
  baseWaveNumberCalibration: PythagoreanTetrachordBaseWaveNumberCalibration;
  eventShellProvenance: PythagoreanTetrachordEventShellProvenance;
  activeDifferentiatingAxes: PythagoreanTetrachordDifferentiatingAxis[];
  neutralAxes: PythagoreanTetrachordNeutralAxis[];
  primalSourceTable: PythagoreanTetrachordPrimalSourceRecord[];
  childDerivationTable: PythagoreanTetrachordChildDerivationRecord[];
  pairSumUniquenessAudit: PythagoreanTetrachordPairSumUniquenessAudit;
  childReadinessAudit: PythagoreanTetrachordChildReadinessAudit;
  phaseMergeAudit: PythagoreanTetrachordPhaseMergeRow[];
  childDistinctivenessAudit: PythagoreanTetrachordChildDistinctivenessAudit;
  structuralContractStatus: PythagoreanTetrachordStatus;
  provingFixtureUsefulnessStatus: PythagoreanTetrachordStatus;
  provingEventSignatureStatus: PythagoreanTetrachordStatus;
  humanLegibilityStatus: PythagoreanTetrachordHumanLegibilityStatus;
  issueCount: number;
  issues: PythagoreanTetrachordIssue[];
  ok: boolean;
}

const PROVING_REGIME_ID: PythagoreanTetrachordProvingRegimeId =
  'pythagorean-tetrachord-quark-regime-v0';
const SOURCE_PROFILE_SYSTEM_ID: PythagoreanTetrachordSourceProfileSystemId =
  'pythagorean-tetrachord-primal-profile-system-v0';
const CHILD_INHERITANCE_GRAMMAR_ID: PythagoreanTetrachordChildInheritanceGrammarId =
  'tetrahedral-quark-log-wave-number-inheritance-v0';
const SOURCE_POLICY_ID: PythagoreanTetrachordSourcePolicyId =
  'pythagorean-tetrachord-quark-proving-policy-v0';
const SEMANTIC_STATUS = 'not-semantic-naming' as const;
const TOPOLOGY_STATUS = 'not-topology-workspace' as const;
const PACKET_WRITE_STATUS = 'not-packet-writing' as const;
const SHAPE_MUTATION_STATUS = 'not-shape-mutation' as const;
const OPERATION_REGISTRY_STATUS = 'not-operation-registry-work' as const;
const SHELL_SCALING_APPLICATION: PythagoreanTetrachordShellScalingApplication =
  'record-only-v0';
const ACTIVE_DIFFERENTIATING_AXES: PythagoreanTetrachordDifferentiatingAxis[] = [
  'waveNumber',
  'phase',
];
const NEUTRAL_AXES: PythagoreanTetrachordNeutralAxis[] = [
  'amplitude',
  'attenuation',
];
const BASE_AMPLITUDE = 1;
const BASE_ATTENUATION = 0.05;
const PHASE_ORIGIN = 0;
const EXPECTED_CHILD_COUNT = 6 as const;
const TOLERANCE = 1e-12;

const SLOT_SPECS = [
  { ratioLabel: '1/1', numerator: 1, denominator: 1 },
  { ratioLabel: '9/8', numerator: 9, denominator: 8 },
  { ratioLabel: '81/64', numerator: 81, denominator: 64 },
  { ratioLabel: '4/3', numerator: 4, denominator: 3 },
] as const;

export function buildPythagoreanTetrachordQuarkRegimeV0Report(): PythagoreanTetrachordQuarkRegimeV0Report {
  const calibration = buildBaseWaveNumberCalibration();
  const profileSlots = buildProfileSlots();
  const primalSourceTable = buildPrimalSourceTable(profileSlots, calibration);
  const primalSourceByVertexId = new Map(
    primalSourceTable.map((source) => [source.vertexId, source]),
  );
  const eventShellProvenance = buildEventShellProvenance(
    calibration.referenceEdgeLengthValue,
  );
  const childContexts = buildTetrahedralAmboChildContexts([
    ...createTetrahedralVertexFixture(),
  ]);
  const childDerivationTable = childContexts.map((context) =>
    buildChildDerivationRecord({
      context,
      primalSourceByVertexId,
      calibration,
      eventShellProvenance,
    }),
  );
  const pairSumUniquenessAudit = buildPairSumUniquenessAudit(profileSlots);
  const childReadinessAudit = buildChildReadinessAudit(childDerivationTable);
  const phaseMergeAudit = buildPhaseMergeAudit(childDerivationTable);
  const childDistinctivenessAudit =
    buildChildDistinctivenessAudit(childDerivationTable);
  const structuralContractStatus = pickStructuralContractStatus({
    calibration,
    eventShellProvenance,
    profileSlots,
    primalSourceTable,
    childDerivationTable,
    pairSumUniquenessAudit,
  });
  const provingFixtureUsefulnessStatus = pickProvingFixtureUsefulnessStatus({
    calibration,
    eventShellProvenance,
    pairSumUniquenessAudit,
    childReadinessAudit,
    phaseMergeAudit,
    childDistinctivenessAudit,
  });
  const provingEventSignatureStatus: PythagoreanTetrachordStatus =
    structuralContractStatus === 'pass' &&
    provingFixtureUsefulnessStatus === 'pass' &&
    childReadinessAudit.fieldReadyChildCount === EXPECTED_CHILD_COUNT
      ? 'pass'
      : 'fail';
  const humanLegibilityStatus: PythagoreanTetrachordHumanLegibilityStatus =
    provingEventSignatureStatus === 'pass' ? 'useful' : 'misleading';
  const issues = buildIssues({
    calibration,
    eventShellProvenance,
    pairSumUniquenessAudit,
    childReadinessAudit,
    phaseMergeAudit,
    childDistinctivenessAudit,
    structuralContractStatus,
    provingFixtureUsefulnessStatus,
    provingEventSignatureStatus,
    childDerivationTable,
  });
  const issueCount = issues.length;

  return {
    reportId: `${PROVING_REGIME_ID}:one-ambo-tetrahedron`,
    provingRegimeId: PROVING_REGIME_ID,
    sourceProfileSystemId: SOURCE_PROFILE_SYSTEM_ID,
    childInheritanceGrammarId: CHILD_INHERITANCE_GRAMMAR_ID,
    sourcePolicyId: SOURCE_POLICY_ID,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    shellScalingApplication: SHELL_SCALING_APPLICATION,
    profileSlots,
    assignmentProvenance: profileSlots.map((slot) => slot.assignmentProvenance),
    baseWaveNumberCalibration: calibration,
    eventShellProvenance,
    activeDifferentiatingAxes: [...ACTIVE_DIFFERENTIATING_AXES],
    neutralAxes: [...NEUTRAL_AXES],
    primalSourceTable,
    childDerivationTable,
    pairSumUniquenessAudit,
    childReadinessAudit,
    phaseMergeAudit,
    childDistinctivenessAudit,
    structuralContractStatus,
    provingFixtureUsefulnessStatus,
    provingEventSignatureStatus,
    humanLegibilityStatus,
    issueCount,
    issues,
    ok: issueCount === 0 && provingEventSignatureStatus === 'pass',
  };
}

function buildBaseWaveNumberCalibration(): PythagoreanTetrachordBaseWaveNumberCalibration {
  const referenceEdgeLengthValue = 1;
  const wavelengthToEdgeRatio = 1 / 8;
  const edgeToWavelengthRatio = 8;
  const referenceWavelength = referenceEdgeLengthValue * wavelengthToEdgeRatio;
  const baseWaveNumber = (2 * Math.PI) / referenceWavelength;
  const expectedBaseWaveNumber = (16 * Math.PI) / referenceEdgeLengthValue;
  const baseWaveNumberCalibrationAuditStatus =
    !sameNumber(baseWaveNumber, Math.PI) &&
    sameNumber(referenceWavelength, referenceEdgeLengthValue / 8) &&
    sameNumber(baseWaveNumber, expectedBaseWaveNumber)
      ? 'pass'
      : 'fail';

  return {
    baseWaveNumberCalibrationStatus: 'human-specified-v0',
    baseWaveNumberCalibrationAuditStatus,
    referenceEdgeLengthKind: 'normalized-primal-tetrahedron-edge-v0',
    referenceEdgeLengthValue,
    wavelengthToEdgeRatioLabel: '1/8',
    wavelengthToEdgeRatio,
    edgeToWavelengthRatio,
    referenceWavelength,
    baseWaveNumber,
    expectedBaseWaveNumber,
    calibrationRationale:
      'Human-specified v0 resonance law: the 1/1 primal harmonic slot has reference wavelength equal to one eighth of the primal tetrahedron edge / equilateral face side. Other tetrachord slots derive from that reference by harmonic ratio.',
  };
}

function buildProfileSlots(): PythagoreanTetrachordRatioSlot[] {
  const vertexIds = createTetrahedralVertexFixture();

  return SLOT_SPECS.map((slot, slotIndex) => {
    const assignedVertexId = vertexIds[slotIndex];
    const ratio = slot.numerator / slot.denominator;
    const ratioLabel = slot.ratioLabel;

    return {
      slotId: `pythagorean-tetrachord-slot:${formatIndex(slotIndex)}`,
      slotIndex,
      ratioLabel,
      numerator: slot.numerator,
      denominator: slot.denominator,
      ratio,
      logRatio: Math.log(ratio),
      log2Ratio: Math.log2(ratio),
      assignedVertexId,
      assignmentMode: 'default-proving-fixture',
      assignmentProvenance: {
        assignedVertexId,
        assignmentMode: 'default-proving-fixture',
        statement: `In this active setup, vertex ${assignedVertexId} is assigned to harmonic slot ${ratioLabel}.`,
      },
    };
  });
}

function buildPrimalSourceTable(
  slots: PythagoreanTetrachordRatioSlot[],
  calibration: PythagoreanTetrachordBaseWaveNumberCalibration,
): PythagoreanTetrachordPrimalSourceRecord[] {
  return slots.map((slot) => ({
    sourceId: `pythagorean-tetrachord-primal-source:${slot.assignedVertexId}`,
    vertexId: slot.assignedVertexId,
    slotId: slot.slotId,
    slotIndex: slot.slotIndex,
    ratioLabel: slot.ratioLabel,
    ratio: slot.ratio,
    logRatio: slot.logRatio,
    log2Ratio: slot.log2Ratio,
    amplitude: BASE_AMPLITUDE,
    waveNumber: calibration.baseWaveNumber * slot.ratio,
    wavelength: calibration.referenceWavelength / slot.ratio,
    phase: normalizePhaseRadians(PHASE_ORIGIN + 2 * Math.PI * slot.log2Ratio),
    attenuation: BASE_ATTENUATION,
    assignmentMode: slot.assignmentMode,
    assignmentProvenance: slot.assignmentProvenance,
    activeDifferentiatingAxes: [...ACTIVE_DIFFERENTIATING_AXES],
    neutralAxes: [...NEUTRAL_AXES],
  }));
}

function buildEventShellProvenance(
  edgeLength: number,
): PythagoreanTetrachordEventShellProvenance {
  const parentCircumradius = (edgeLength * Math.sqrt(6)) / 4;
  const parentInradius = (edgeLength * Math.sqrt(6)) / 12;
  const childCircumradius = (edgeLength * Math.sqrt(2)) / 4;
  const childInradius = (edgeLength * Math.sqrt(6)) / 12;
  const parentShellRatio = parentCircumradius / parentInradius;
  const childShellRatio = childCircumradius / childInradius;
  const circumradiusContraction = parentCircumradius / childCircumradius;
  const expectedCircumradiusContraction = Math.sqrt(3);
  const inradiusPreserved = sameNumber(parentInradius, childInradius);
  const localGlobalSqrt3Coherence =
    sameNumber(QUARK_PARENT_WEIGHT, Math.sqrt(3)) &&
    sameNumber(circumradiusContraction, Math.sqrt(3)) &&
    sameNumber(childShellRatio, Math.sqrt(3))
      ? 'pass'
      : 'fail';
  const eventShellProvenanceStatus =
    sameNumber(parentShellRatio, 3) &&
    sameNumber(childShellRatio, Math.sqrt(3)) &&
    sameNumber(circumradiusContraction, expectedCircumradiusContraction) &&
    inradiusPreserved &&
    localGlobalSqrt3Coherence === 'pass'
      ? 'pass'
      : 'fail';

  return {
    eventShellProvenanceId:
      'tetrahedron-to-midpoint-octahedron-shell-provenance-v0',
    parentSolid: 'tetrahedron',
    generatedCore: 'midpoint-octahedron',
    parentEdgeLength: edgeLength,
    childCoreEdgeLength: edgeLength / 2,
    parentCircumradius,
    parentInradius,
    parentShellRatio,
    childCircumradius,
    childInradius,
    childShellRatio,
    circumradiusContraction,
    expectedCircumradiusContraction,
    inradiusPreserved,
    localGlobalSqrt3Coherence,
    shellScalingApplication: SHELL_SCALING_APPLICATION,
    shellScalingRationale:
      'The tetrahedron to midpoint-octahedron shell contraction is recorded as event provenance. It is not applied as an emitted tuple multiplier in v0 because source positions and Quark weighting already carry geometric structure.',
    eventShellProvenanceStatus,
  };
}

function buildChildDerivationRecord(args: {
  context: TetrahedralAmboChildContext;
  primalSourceByVertexId: Map<string, PythagoreanTetrachordPrimalSourceRecord>;
  calibration: PythagoreanTetrachordBaseWaveNumberCalibration;
  eventShellProvenance: PythagoreanTetrachordEventShellProvenance;
}): PythagoreanTetrachordChildDerivationRecord {
  const channels = buildChildChannels(args);
  const channelPairs = channels.map(
    (channel) => `${channel.parent60}/${channel.projection30}`,
  );
  const phaseMean = circularMeanRadians(
    channels.map((channel) => channel.channelEmittedTuple.phase),
  );
  const childLogRatio =
    channels.reduce((sum, channel) => sum + channel.channelLogRatio, 0) /
    channels.length;
  const childRatio = Math.exp(childLogRatio);
  const childWaveNumber = args.calibration.baseWaveNumber * childRatio;
  const childWavelength = args.calibration.referenceWavelength / childRatio;
  let derivedTuple: FieldSourceEmissionParameters | undefined;
  let fallbackReason: string | undefined;

  if (phaseMean.ok && phaseMean.phase !== undefined) {
    const childPhase = phaseMean.phase;

    derivedTuple = {
      amplitude: BASE_AMPLITUDE,
      waveNumber: childWaveNumber,
      phase: childPhase,
      attenuation: BASE_ATTENUATION,
    };
  } else {
    fallbackReason = 'The four-channel phase circular mean is undefined.';
  }

  return {
    childId: args.context.childVertexId,
    sourceEdgeId: args.context.sourceEdgeId,
    sourceEdgeVertexIds: copyPair(args.context.sourceEdgeVertexIds),
    complementEdgeId: args.context.complementEdgeId,
    complementEdgeVertexIds: copyPair(args.context.complementEdgeVertexIds),
    antipodalChildId: args.context.antipodalChildVertexId,
    projectionVertexIds: copyPair(args.context.projectionVertexIds),
    channelPairs,
    channels,
    childLogRatio,
    childRatio,
    childWaveNumber,
    childWavelength,
    formulaExplanation: buildChildFormulaExplanation(args.context),
    ...(derivedTuple ? { derivedTuple } : {}),
    localDerivationStatus: fallbackReason
      ? 'undefined-circular-mean'
      : 'derived',
    fieldReady: Boolean(derivedTuple),
    ...(fallbackReason
      ? {
          fallbackKind: 'unresolved-child-source-profile' as const,
          fallbackReason,
        }
      : {}),
    neutralAxes: [...NEUTRAL_AXES],
    activeDifferentiatingAxes: [...ACTIVE_DIFFERENTIATING_AXES],
    eventShellProvenanceId: args.eventShellProvenance.eventShellProvenanceId,
    shellScalingApplication: SHELL_SCALING_APPLICATION,
    childWaveNumberShellScalingApplied: false,
    childAttenuationShellScalingApplied: false,
  };
}

function buildChildChannels(args: {
  context: TetrahedralAmboChildContext;
  primalSourceByVertexId: Map<string, PythagoreanTetrachordPrimalSourceRecord>;
  calibration: PythagoreanTetrachordBaseWaveNumberCalibration;
}): PythagoreanTetrachordChannelRecord[] {
  const [sourceA, sourceB] = args.context.sourceEdgeVertexIds;
  const [projectionA, projectionB] = args.context.projectionVertexIds;
  const channelPairs: Array<[string, string]> = [
    [sourceA, projectionA],
    [sourceB, projectionA],
    [sourceA, projectionB],
    [sourceB, projectionB],
  ];

  return channelPairs.map(([parent60, projection30]) => {
    const parentSource = requirePrimalSource(
      args.primalSourceByVertexId,
      parent60,
    );
    const projectionSource = requirePrimalSource(
      args.primalSourceByVertexId,
      projection30,
    );
    const channelLogRatio =
      (QUARK_PARENT_WEIGHT * parentSource.logRatio +
        QUARK_PROJECTION_WEIGHT * projectionSource.logRatio) /
      (QUARK_PARENT_WEIGHT + QUARK_PROJECTION_WEIGHT);
    const channelRatio = Math.exp(channelLogRatio);
    const channelWaveNumber = args.calibration.baseWaveNumber * channelRatio;
    const channelWavelength = args.calibration.referenceWavelength / channelRatio;
    const phase = weightedCircularMeanRadians(
      parentSource.phase,
      projectionSource.phase,
      QUARK_PARENT_WEIGHT,
      QUARK_PROJECTION_WEIGHT,
    );

    return {
      channelId: `pythagorean-tetrachord-quark-channel:${args.context.childVertexId}:${parent60}60:${projection30}30`,
      childId: args.context.childVertexId,
      parent60,
      projection30,
      parentWeight: QUARK_PARENT_WEIGHT,
      projectionWeight: QUARK_PROJECTION_WEIGHT,
      parentSlotId: parentSource.slotId,
      parentRatioLabel: parentSource.ratioLabel,
      parentRatio: parentSource.ratio,
      parentLogRatio: parentSource.logRatio,
      projectionSlotId: projectionSource.slotId,
      projectionRatioLabel: projectionSource.ratioLabel,
      projectionRatio: projectionSource.ratio,
      projectionLogRatio: projectionSource.logRatio,
      channelLogRatio,
      channelRatio,
      channelWaveNumber,
      channelWavelength,
      channelEmittedTuple: {
        amplitude: BASE_AMPLITUDE,
        waveNumber: channelWaveNumber,
        phase,
        attenuation: BASE_ATTENUATION,
      },
      channelDerivationLawId: CHILD_INHERITANCE_GRAMMAR_ID,
    };
  });
}

function buildPairSumUniquenessAudit(
  slots: PythagoreanTetrachordRatioSlot[],
): PythagoreanTetrachordPairSumUniquenessAudit {
  const slotByVertexId = new Map(slots.map((slot) => [slot.assignedVertexId, slot]));
  const rows = buildTetrahedralAmboChildContexts([
    ...createTetrahedralVertexFixture(),
  ]).map((context) => {
    const left = requireSlot(slotByVertexId, context.sourceEdgeVertexIds[0]);
    const right = requireSlot(slotByVertexId, context.sourceEdgeVertexIds[1]);
    const numerator = left.numerator * right.numerator;
    const denominator = left.denominator * right.denominator;
    const reduced = reduceFraction(numerator, denominator);
    const pairLogRatioSum = left.logRatio + right.logRatio;

    return {
      edgeId: context.sourceEdgeId,
      vertexIds: copyPair(context.sourceEdgeVertexIds),
      ratioProductLabel: `${reduced.numerator}/${reduced.denominator}`,
      pairRatioProduct: left.ratio * right.ratio,
      pairLogRatioSum,
      uniquenessKey: pairLogRatioSum.toFixed(12),
    };
  });
  const uniquePairSumCount = new Set(rows.map((row) => row.uniquenessKey)).size;
  const pairSumUniquenessStatus =
    uniquePairSumCount === rows.length ? 'pass' : 'fail';

  return {
    pairSumUniquenessStatus,
    edgeCount: rows.length,
    uniquePairSumCount,
    rows,
    explanation:
      'Pair-sum uniqueness proves non-collapse only on the child log-wave-number axis for this proving event.',
  };
}

function buildChildReadinessAudit(
  rows: PythagoreanTetrachordChildDerivationRecord[],
): PythagoreanTetrachordChildReadinessAudit {
  const derivedChildCount = rows.filter((row) => row.derivedTuple).length;
  const fallbackChildCount = rows.filter((row) => row.fallbackKind).length;
  const unresolvedChildCount = rows.filter(
    (row) => !row.derivedTuple && !row.fallbackKind,
  ).length;
  const fieldReadyChildCount = rows.filter((row) => row.fieldReady).length;
  const nonFieldReadyChildCount = EXPECTED_CHILD_COUNT - fieldReadyChildCount;
  const childReadinessStatus: PythagoreanTetrachordChildReadinessStatus =
    fieldReadyChildCount === EXPECTED_CHILD_COUNT
      ? 'all-field-ready'
      : fallbackChildCount > 0 || derivedChildCount > 0
        ? 'partial-fallback'
        : 'failed';

  return {
    expectedChildCount: EXPECTED_CHILD_COUNT,
    derivedChildCount,
    fallbackChildCount,
    unresolvedChildCount,
    fieldReadyChildCount,
    nonFieldReadyChildCount,
    childReadinessStatus,
  };
}

function buildPhaseMergeAudit(
  rows: PythagoreanTetrachordChildDerivationRecord[],
): PythagoreanTetrachordPhaseMergeRow[] {
  return rows.map((row) => {
    const circularMergeStatus = pickCircularMergeStatus(row);

    return {
      childId: row.childId,
      channelPhases: row.channels.map(
        (channel) => channel.channelEmittedTuple.phase,
      ),
      circularMergeStatus,
      ...(circularMergeStatus === 'undefined-circular-mean'
        ? {
            explanation:
              'Four-channel phase circular mean cancelled under the Pythagorean tetrachord proving candidate.',
          }
        : {}),
    };
  });
}

function buildChildDistinctivenessAudit(
  rows: PythagoreanTetrachordChildDerivationRecord[],
): PythagoreanTetrachordChildDistinctivenessAudit {
  const derivedRows = rows.filter((row) => row.derivedTuple);
  const uniqueAmplitudeCount = uniqueNumericCount(
    derivedRows.map((row) => row.derivedTuple?.amplitude ?? Number.NaN),
  );
  const uniqueWaveNumberCount = uniqueNumericCount(
    derivedRows.map((row) => row.derivedTuple?.waveNumber ?? Number.NaN),
  );
  const uniqueAttenuationCount = uniqueNumericCount(
    derivedRows.map((row) => row.derivedTuple?.attenuation ?? Number.NaN),
  );
  const uniquePhaseCount = uniqueNumericCount(
    derivedRows.map((row) => row.derivedTuple?.phase ?? Number.NaN),
  );
  const uniqueLogRatioCount = uniqueNumericCount(
    derivedRows.map((row) => row.childLogRatio),
  );
  const childLogWaveNumberDistinctivenessStatus =
    uniqueLogRatioCount === EXPECTED_CHILD_COUNT &&
    uniqueWaveNumberCount === EXPECTED_CHILD_COUNT
      ? 'pass'
      : 'fail';

  return {
    uniqueAmplitudeCount,
    uniqueWaveNumberCount,
    uniqueAttenuationCount,
    uniquePhaseCount,
    uniqueLogRatioCount,
    childLogWaveNumberDistinctivenessStatus,
    ...(childLogWaveNumberDistinctivenessStatus === 'fail'
      ? {
          warning:
            'Child log-wave-number signatures collapsed under the proving candidate.',
        }
      : {}),
  };
}

function pickStructuralContractStatus(args: {
  calibration: PythagoreanTetrachordBaseWaveNumberCalibration;
  eventShellProvenance: PythagoreanTetrachordEventShellProvenance;
  profileSlots: PythagoreanTetrachordRatioSlot[];
  primalSourceTable: PythagoreanTetrachordPrimalSourceRecord[];
  childDerivationTable: PythagoreanTetrachordChildDerivationRecord[];
  pairSumUniquenessAudit: PythagoreanTetrachordPairSumUniquenessAudit;
}): PythagoreanTetrachordStatus {
  const finiteProfileSlots = args.profileSlots.every((slot) =>
    [
      slot.ratio,
      slot.logRatio,
      slot.log2Ratio,
    ].every(Number.isFinite),
  );
  const finitePrimalSources = args.primalSourceTable.every((source) =>
    [
      source.amplitude,
      source.waveNumber,
      source.phase,
      source.attenuation,
      source.wavelength,
    ].every(Number.isFinite),
  );
  const childStructureAvailable =
    args.childDerivationTable.length === EXPECTED_CHILD_COUNT &&
    args.childDerivationTable.every(
      (row) =>
        row.sourceEdgeId &&
        row.complementEdgeId &&
        row.antipodalChildId &&
        row.projectionVertexIds.length === 2 &&
        row.channels.length === 4,
    );

  return args.calibration.baseWaveNumberCalibrationAuditStatus === 'pass' &&
    args.eventShellProvenance.eventShellProvenanceStatus === 'pass' &&
    args.profileSlots.length === 4 &&
    args.primalSourceTable.length === 4 &&
    finiteProfileSlots &&
    finitePrimalSources &&
    childStructureAvailable &&
    args.pairSumUniquenessAudit.edgeCount === EXPECTED_CHILD_COUNT
    ? 'pass'
    : 'fail';
}

function pickProvingFixtureUsefulnessStatus(args: {
  calibration: PythagoreanTetrachordBaseWaveNumberCalibration;
  eventShellProvenance: PythagoreanTetrachordEventShellProvenance;
  pairSumUniquenessAudit: PythagoreanTetrachordPairSumUniquenessAudit;
  childReadinessAudit: PythagoreanTetrachordChildReadinessAudit;
  phaseMergeAudit: PythagoreanTetrachordPhaseMergeRow[];
  childDistinctivenessAudit: PythagoreanTetrachordChildDistinctivenessAudit;
}): PythagoreanTetrachordStatus {
  const hasPhaseCancellation = args.phaseMergeAudit.some(
    (row) => row.circularMergeStatus === 'undefined-circular-mean',
  );

  return args.calibration.baseWaveNumberCalibrationAuditStatus === 'pass' &&
    args.eventShellProvenance.eventShellProvenanceStatus === 'pass' &&
    args.pairSumUniquenessAudit.pairSumUniquenessStatus === 'pass' &&
    args.childReadinessAudit.fieldReadyChildCount === EXPECTED_CHILD_COUNT &&
    args.childReadinessAudit.fallbackChildCount === 0 &&
    args.childReadinessAudit.unresolvedChildCount === 0 &&
    !hasPhaseCancellation &&
    args.childDistinctivenessAudit.childLogWaveNumberDistinctivenessStatus === 'pass'
    ? 'pass'
    : 'fail';
}

function buildIssues(args: {
  calibration: PythagoreanTetrachordBaseWaveNumberCalibration;
  eventShellProvenance: PythagoreanTetrachordEventShellProvenance;
  pairSumUniquenessAudit: PythagoreanTetrachordPairSumUniquenessAudit;
  childReadinessAudit: PythagoreanTetrachordChildReadinessAudit;
  phaseMergeAudit: PythagoreanTetrachordPhaseMergeRow[];
  childDistinctivenessAudit: PythagoreanTetrachordChildDistinctivenessAudit;
  structuralContractStatus: PythagoreanTetrachordStatus;
  provingFixtureUsefulnessStatus: PythagoreanTetrachordStatus;
  provingEventSignatureStatus: PythagoreanTetrachordStatus;
  childDerivationTable: PythagoreanTetrachordChildDerivationRecord[];
}): PythagoreanTetrachordIssue[] {
  const issues: PythagoreanTetrachordIssue[] = [];

  if (args.calibration.baseWaveNumberCalibrationAuditStatus !== 'pass') {
    issues.push({
      code: 'base-wave-number-calibration-failed',
      message:
        'Base wave number calibration does not satisfy the human-specified 1:8 edge/wavelength law.',
      details: {
        baseWaveNumber: args.calibration.baseWaveNumber,
        expectedBaseWaveNumber: args.calibration.expectedBaseWaveNumber,
        referenceWavelength: args.calibration.referenceWavelength,
      },
    });
  }

  if (args.eventShellProvenance.eventShellProvenanceStatus !== 'pass') {
    issues.push({
      code: 'event-shell-provenance-failed',
      message:
        'Keplerian tetrahedron to midpoint-octahedron shell provenance failed.',
    });
  }

  if (args.pairSumUniquenessAudit.pairSumUniquenessStatus !== 'pass') {
    issues.push({
      code: 'pair-sum-uniqueness-failed',
      message:
        'Six edge pair sums are not unique on the child log-wave-number axis.',
    });
  }

  if (args.childReadinessAudit.fieldReadyChildCount !== EXPECTED_CHILD_COUNT) {
    issues.push({
      code: 'child-readiness-failed',
      message:
        'The Pythagorean tetrachord proving candidate did not produce six field-ready child signatures.',
      details: {
        fieldReadyChildCount: args.childReadinessAudit.fieldReadyChildCount,
        fallbackChildCount: args.childReadinessAudit.fallbackChildCount,
        unresolvedChildCount: args.childReadinessAudit.unresolvedChildCount,
      },
    });
  }

  for (const row of args.phaseMergeAudit) {
    if (row.circularMergeStatus === 'undefined-circular-mean') {
      issues.push({
        code: 'phase-circular-mean-cancellation',
        message:
          row.explanation ??
          'Four-channel phase circular mean cancelled under the proving candidate.',
        childId: row.childId,
      });
    }
  }

  for (const row of args.childDerivationTable) {
    if (row.fallbackKind) {
      issues.push({
        code: 'child-signature-fallback',
        message: `Child ${row.childId} fell back under the proving candidate.`,
        childId: row.childId,
        details: {
          fallbackReason: row.fallbackReason ?? null,
        },
      });
    }
  }

  if (
    args.childDistinctivenessAudit.childLogWaveNumberDistinctivenessStatus !==
    'pass'
  ) {
    issues.push({
      code: 'child-log-wave-number-collapse',
      message:
        args.childDistinctivenessAudit.warning ??
        'Child log-wave-number signatures are not distinct.',
    });
  }

  if (args.structuralContractStatus !== 'pass') {
    issues.push({
      code: 'structural-contract-failed',
      message:
        'The Pythagorean tetrachord proving candidate failed structural contract checks.',
    });
  }

  if (args.provingFixtureUsefulnessStatus !== 'pass') {
    issues.push({
      code: 'proving-fixture-not-useful',
      message:
        'The Pythagorean tetrachord proving candidate is not useful as the source-signature proving fixture.',
    });
  }

  if (args.provingEventSignatureStatus !== 'pass') {
    issues.push({
      code: 'proving-event-signature-failed',
      message:
        'The Pythagorean tetrachord proving candidate did not pass the one-Ambo source-signature event.',
    });
  }

  return issues;
}

function pickCircularMergeStatus(
  row: PythagoreanTetrachordChildDerivationRecord,
): PythagoreanTetrachordCircularMergeStatus {
  if (row.localDerivationStatus === 'derived') {
    return 'derived';
  }

  if (row.localDerivationStatus === 'undefined-circular-mean') {
    return 'undefined-circular-mean';
  }

  return 'fallback';
}

function buildChildFormulaExplanation(context: TetrahedralAmboChildContext): string {
  return `child logRatio = [sqrt(3) * (${context.sourceEdgeVertexIds[0]} + ${context.sourceEdgeVertexIds[1]}) + (${context.projectionVertexIds[0]} + ${context.projectionVertexIds[1]})] / [2 * (sqrt(3) + 1)] for source edge ${context.sourceEdgeId} under complement ${context.complementEdgeId}.`;
}

function weightedCircularMeanRadians(
  parentPhase: number,
  projectionPhase: number,
  parentWeight: number,
  projectionWeight: number,
): number {
  const x =
    parentWeight * Math.cos(parentPhase) +
    projectionWeight * Math.cos(projectionPhase);
  const y =
    parentWeight * Math.sin(parentPhase) +
    projectionWeight * Math.sin(projectionPhase);

  return normalizePhaseRadians(Math.atan2(y, x));
}

function circularMeanRadians(
  phases: number[],
): { phase?: number; magnitude: number; ok: boolean } {
  const x = phases.reduce((sum, phase) => sum + Math.cos(phase), 0);
  const y = phases.reduce((sum, phase) => sum + Math.sin(phase), 0);
  const magnitude = Math.sqrt(x * x + y * y);

  if (magnitude < TOLERANCE) {
    return {
      magnitude,
      ok: false,
    };
  }

  return {
    phase: normalizePhaseRadians(Math.atan2(y, x)),
    magnitude,
    ok: true,
  };
}

function normalizePhaseRadians(phase: number): number {
  if (!Number.isFinite(phase)) {
    return phase;
  }

  const twoPi = 2 * Math.PI;
  const normalized = phase % twoPi;
  const positive = normalized < 0 ? normalized + twoPi : normalized;

  return Object.is(positive, -0) ? 0 : positive;
}

function requirePrimalSource(
  sourceByVertexId: Map<string, PythagoreanTetrachordPrimalSourceRecord>,
  vertexId: string,
): PythagoreanTetrachordPrimalSourceRecord {
  const source = sourceByVertexId.get(vertexId);

  if (!source) {
    throw new Error(`Missing Pythagorean tetrachord source for vertex ${vertexId}.`);
  }

  return source;
}

function requireSlot(
  slotByVertexId: Map<string, PythagoreanTetrachordRatioSlot>,
  vertexId: string,
): PythagoreanTetrachordRatioSlot {
  const slot = slotByVertexId.get(vertexId);

  if (!slot) {
    throw new Error(`Missing Pythagorean tetrachord slot for vertex ${vertexId}.`);
  }

  return slot;
}

function reduceFraction(
  numerator: number,
  denominator: number,
): { numerator: number; denominator: number } {
  const divisor = greatestCommonDivisor(numerator, denominator);

  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

function greatestCommonDivisor(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);

  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }

  return a || 1;
}

function copyPair(pair: [string, string]): [string, string] {
  return [pair[0], pair[1]];
}

function uniqueNumericCount(values: number[]): number {
  return new Set(values.map(formatNumericKey)).size;
}

function formatNumericKey(value: number): string {
  return Number.isFinite(value) ? value.toFixed(12) : String(value);
}

function formatIndex(index: number): string {
  return String(index).padStart(2, '0');
}

function sameNumber(left: number, right: number): boolean {
  return (
    Number.isFinite(left) &&
    Number.isFinite(right) &&
    Math.abs(left - right) <= TOLERANCE
  );
}
