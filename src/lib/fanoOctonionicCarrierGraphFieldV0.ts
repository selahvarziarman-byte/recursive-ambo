import {
  buildFanoOctonionicLocalChannelTableV0Report,
} from './fanoOctonionicLocalChannelTableV0';
import {
  buildHarmonicEmissionProfilesV0Report,
  type HarmonicProfileSetRow,
  type PrimalProfileAttachmentRow,
} from './harmonicEmissionProfilesV0';
import {
  buildFanoOctonionicChildEmissionEnvelopeV0Report,
  type FanoChildEmissionChannelKernelRow,
  type FanoChildEmissionEnvelopeRow,
} from './fanoOctonionicChildEmissionEnvelopeV0';
import {
  type FanoCarrierRay,
  type FanoOrderedLiftId,
  type FanoPairTokenId,
  type FanoPrimalSourceId,
  type FanoSign,
  type FanoSignedLift,
  type FanoSourcePair,
  type FanoUnitId,
} from './fanoOctonionicCarrierTableV0';

export type FanoCarrierGraphEdgeFamily =
  | 'birth-edge'
  | 'parent-return-edge'
  | 'projection-loop-edge'
  | 'complement-coupling-edge';

export type FanoCarrierGraphNodeRole =
  | 'primal-source-node'
  | 'child-source-node';

export type FanoCarrierGraphActivationStatus =
  | 'intrinsic-free-emission'
  | 'structural-birth-link-not-free-emission'
  | 'available-response-not-free-emission';

export type FanoCarrierGraphSpatialSupportKind =
  | 'primal-vertex-support-placeholder'
  | 'child-midpoint-support-placeholder'
  | 'birth-hyperedge-support-placeholder'
  | 'channel-edge-support-placeholder'
  | 'complement-axis-support-placeholder';

export interface FanoCarrierGraphSetRow {
  graphId: string;
  profileSetId: string;
  profileFamilyId: string;
  generationIndex: 0;
  graphStatus: 'carrier-channel-graph-field-ready';
}

export interface FanoCarrierGraphPrimalNodeRow {
  graphId: string;
  profileSetId: string;
  nodeId: string;
  sourceSlotId: FanoPrimalSourceId;
  nodeRole: 'primal-source-node';
  generationIndex: 0;
  carrierUnit: FanoUnitId;
  signedCarrier: FanoSignedLift;
  carrierRay: FanoCarrierRay;
  intrinsicEmissionSource: 'e0-primal-profile';
  profileId: string;
  oscillatorProfileStatus: 'e0-intrinsic-primal-oscillator-profile';
  freeEmissionStatus: 'intrinsic-free-emission';
  semanticLabelStatus: 'not-attached-placeholders-only';
  spatialSupportPlaceholderId: string;
  spatialSupportKind: 'primal-vertex-support-placeholder';
}

export interface FanoCarrierGraphChildNodeRow {
  graphId: string;
  profileSetId: string;
  nodeId: string;
  childTokenId: FanoPairTokenId;
  nodeRole: 'child-source-node';
  generationIndex: 1;
  canonicalLiftId: FanoOrderedLiftId;
  signedLift: FanoSignedLift;
  carrierRay: FanoCarrierRay;
  parentSet: FanoSourcePair;
  projectedSourceSet: FanoSourcePair;
  complementTokenId: FanoPairTokenId;
  intrinsicEmissionSource: 'e1-child-emission-envelope';
  envelopeId: string;
  oscillatorProfileStatus: 'e1-intrinsic-child-birth-emission';
  freeEmissionStatus: 'intrinsic-free-emission';
  semanticLabelStatus: 'not-attached-placeholders-only';
  spatialSupportPlaceholderId: string;
  spatialSupportKind: 'child-midpoint-support-placeholder';
}

export type FanoCarrierGraphNodeRow =
  | FanoCarrierGraphPrimalNodeRow
  | FanoCarrierGraphChildNodeRow;

export interface FanoCarrierGraphBirthEdgeRow {
  edgeId: string;
  graphId: string;
  profileSetId: string;
  edgeFamily: 'birth-edge';
  edgeArity: 'binary-source-to-child';
  sourceNodeIds: [string, string];
  targetNodeIds: [string];
  childTokenId: FanoPairTokenId;
  canonicalLiftId: FanoOrderedLiftId;
  signedLift: FanoSignedLift;
  carrierRay: FanoCarrierRay;
  carrierTransportStatus: 'canonical-child-lift-from-e1-envelope';
  activationStatus: 'structural-birth-link-not-free-emission';
  responseStatus: 'not-response-kernel';
  weight: number;
  weightStatus: 'finite-v0-weight-no-free-tuning';
  spatialSupportPlaceholderId: string;
  spatialSupportKind: 'birth-hyperedge-support-placeholder';
  derivationStatus: 'derived-from-e1-child-envelope-parent-set';
}

export interface FanoCarrierGraphResponseEdgeRow {
  edgeId: string;
  graphId: string;
  profileSetId: string;
  edgeFamily: 'parent-return-edge' | 'projection-loop-edge';
  edgeArity: 'directed-response-channel';
  sourceNodeIds: [string];
  actionNodeId: string;
  targetNodeIds: [string];
  childTokenId: FanoPairTokenId;
  actionSourceId: FanoPrimalSourceId;
  expectedRecoveredSourceId: FanoPrimalSourceId;
  childLeftSignedResult: FanoSignedLift;
  sourceLeftSignedResult: FanoSignedLift;
  carrierTransportStatus:
    | 'derived-from-e1-parent-return-kernel'
    | 'derived-from-e1-projection-loop-kernel';
  activationStatus: 'available-response-not-free-emission';
  responseStatus: 'response-kernel-not-always-on';
  weight: number;
  weightStatus: 'finite-v0-weight-no-free-tuning';
  spatialSupportPlaceholderId: string;
  spatialSupportKind: 'channel-edge-support-placeholder';
  derivationStatus:
    | 'derived-from-e1-parent-return-kernel'
    | 'derived-from-e1-projection-loop-kernel';
}

export interface FanoCarrierGraphComplementEdgeRow {
  edgeId: string;
  graphId: string;
  profileSetId: string;
  edgeFamily: 'complement-coupling-edge';
  edgeArity: 'directed-complement-channel';
  sourceNodeIds: [string];
  targetNodeIds: [string];
  childTokenId: FanoPairTokenId;
  complementTokenId: FanoPairTokenId;
  sharedCarrierRay: FanoCarrierRay;
  sourceChildSignedLift: FanoSignedLift;
  complementChildSignedLift: FanoSignedLift;
  sourceCarrierRay: FanoCarrierRay;
  complementCarrierRay: FanoCarrierRay;
  complementOrientationRelation: 'same-ray-opposite-signed-lift';
  conjugacyStatus: 'octonionic-conjugate-orientation';
  carrierTransportStatus: 'derived-from-e1-complement-coupling-kernel';
  activationStatus: 'available-response-not-free-emission';
  responseStatus: 'response-kernel-not-always-on';
  weight: number;
  weightStatus: 'finite-v0-weight-no-free-tuning';
  spatialSupportPlaceholderId: string;
  spatialSupportKind: 'complement-axis-support-placeholder';
  derivationStatus: 'derived-from-e1-complement-coupling-kernel';
}

export type FanoCarrierGraphEdgeRow =
  | FanoCarrierGraphBirthEdgeRow
  | FanoCarrierGraphResponseEdgeRow
  | FanoCarrierGraphComplementEdgeRow;

export interface FanoCarrierTransportRow {
  transportId: string;
  graphId: string;
  edgeId: string;
  edgeFamily: FanoCarrierGraphEdgeFamily;
  sourceCarrierState: string[];
  actionCarrierState: string | null;
  targetCarrierState: string[];
  carrierOperationLabel: string;
  transportResult: string;
  transportStatus: string;
  bracketingStatus:
    | 'one-step-no-associative-collapse'
    | 'binary-birth-bracketing-preserved';
  derivationStatus: string;
}

export interface FanoCarrierGraphActivationWeightRow {
  activationWeightId: string;
  graphId: string;
  ownerKind: 'node' | 'edge';
  ownerId: string;
  activationStatus: FanoCarrierGraphActivationStatus;
  weight: number;
  weightStatus: 'finite-v0-weight-no-free-tuning';
  activationSourceStatus:
    | 'node-intrinsic-emission'
    | 'edge-activation-policy-v0';
}

export interface FanoCarrierGraphPathSumReadinessRow {
  pathId: string;
  graphId: string;
  edgeSequence: [string];
  pathLength: 1;
  pathWeight: number;
  pathActivationStatus: FanoCarrierGraphActivationStatus;
  carrierTransportId: string;
  sourceEmissionNodeId: string | [string, string];
  bracketingStatus:
    | 'one-step-no-associative-collapse'
    | 'binary-birth-bracketing-preserved';
  pathContributionStatus: 'ready-for-finite-path-sum-not-spectral-kernel';
}

export interface FanoCarrierGraphSpatialSupportPlaceholderRow {
  spatialSupportPlaceholderId: string;
  graphId: string;
  ownerKind: 'node' | 'edge';
  ownerId: string;
  supportKind: FanoCarrierGraphSpatialSupportKind;
  anchorReference: string;
  continuousProjectionStatus: 'placeholder-for-f2-continuous-spatial-support';
  coordinateStatus: 'not-computed-in-f1';
  f2BridgeStatus: 'required-input-for-f2';
}

export interface FanoOctonionicCarrierGraphFieldV0Summary {
  method: 'fano-octonionic-carrier-graph-field-v0';
  graphSetCount: number;
  graphNodeCount: number;
  primalSourceNodeCount: number;
  childSourceNodeCount: number;
  graphEdgeCount: number;
  birthEdgeCount: number;
  parentReturnEdgeCount: number;
  projectionLoopEdgeCount: number;
  complementCouplingEdgeCount: number;
  carrierTransportRowCount: number;
  complementSignedTransportRowCount: number;
  nodeActivationWeightRowCount: number;
  edgeActivationWeightRowCount: number;
  totalActivationWeightRowCount: number;
  pathSumReadinessRowCount: number;
  nodeSpatialSupportPlaceholderCount: number;
  edgeSpatialSupportPlaceholderCount: number;
  totalSpatialSupportPlaceholderCount: number;
  graphLawStatus: 'carrier-connection-graph-field-v0';
  transportLawStatus: 'finite-one-step-path-readiness-no-spectral-kernel';
  complementSignedTransportStatus: 'same-ray-opposite-signed-lift-preserved';
  activationLawStatus: 'intrinsic-free-emission-vs-available-response-preserved';
  weightLawStatus: 'unit-v0-weights-no-free-tuning';
  birthArityStatus: 'binary-birth-preserved-not-flattened';
  spatialBridgeStatus: 'f2-spatial-support-placeholders-ready';
  continuousProjectionStatus: 'not-computed-in-f1-next-gate-f2';
  semanticLabelStatus: 'not-attached-placeholders-only';
  trisonSemanticStatus: 'not-computed-in-f1';
  spinorBridgeStatus: 'not-in-f1-carrier-bridge-preserved-upstream';
  uiStatus: 'no-ui';
  recommendedNextGate: 'F2 - Continuous Spatial Support Projection Table';
}

export interface FanoOctonionicCarrierGraphFieldV0Issue {
  code: string;
  message: string;
}

export interface FanoOctonionicCarrierGraphFieldV0Report {
  method: 'fano-octonionic-carrier-graph-field-v0';
  c1DependencyStatus: 'derived-from-c1-local-channel-table';
  e0DependencyStatus: 'derived-from-e0-profile-library';
  e1DependencyStatus: 'derived-from-e1-child-emission-envelopes';
  graphSetRows: FanoCarrierGraphSetRow[];
  nodeRows: FanoCarrierGraphNodeRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
  carrierTransportRows: FanoCarrierTransportRow[];
  activationWeightRows: FanoCarrierGraphActivationWeightRow[];
  pathSumReadinessRows: FanoCarrierGraphPathSumReadinessRow[];
  spatialSupportPlaceholderRows: FanoCarrierGraphSpatialSupportPlaceholderRow[];
  summary: FanoOctonionicCarrierGraphFieldV0Summary;
  issues: FanoOctonionicCarrierGraphFieldV0Issue[];
  ok: boolean;
}

const UNIT_WEIGHT = 1;

export function buildFanoOctonionicCarrierGraphFieldV0Report(): FanoOctonionicCarrierGraphFieldV0Report {
  const c1Report = buildFanoOctonionicLocalChannelTableV0Report();
  const e0Report = buildHarmonicEmissionProfilesV0Report();
  const e1Report = buildFanoOctonionicChildEmissionEnvelopeV0Report();
  const graphSetRows = e0Report.profileSetRows.map(buildGraphSetRow);
  const nodeRows = graphSetRows.flatMap((graphSetRow) => [
    ...buildPrimalNodeRows({
      graphSetRow,
      primalProfileAttachmentRows: e0Report.primalProfileAttachmentRows,
    }),
    ...buildChildNodeRows({
      graphSetRow,
      envelopes: e1Report.childEmissionEnvelopes,
    }),
  ]);
  const edgeRows = graphSetRows.flatMap((graphSetRow) =>
    buildEdgeRows({
      graphSetRow,
      envelopes: e1Report.childEmissionEnvelopes,
    }),
  );
  const carrierTransportRows = buildCarrierTransportRows({ edgeRows, nodeRows });
  const activationWeightRows = buildActivationWeightRows({ nodeRows, edgeRows });
  const pathSumReadinessRows = buildPathSumReadinessRows({
    edgeRows,
    carrierTransportRows,
  });
  const spatialSupportPlaceholderRows = buildSpatialSupportPlaceholderRows({
    nodeRows,
    edgeRows,
  });
  const summary = buildSummary({
    graphSetRows,
    nodeRows,
    edgeRows,
    carrierTransportRows,
    activationWeightRows,
    pathSumReadinessRows,
    spatialSupportPlaceholderRows,
  });
  const issues = buildIssues({
    c1Ok: c1Report.ok,
    e0Ok: e0Report.ok,
    e1Ok: e1Report.ok,
    nodeRows,
    edgeRows,
    carrierTransportRows,
    activationWeightRows,
    pathSumReadinessRows,
    spatialSupportPlaceholderRows,
    summary,
  });

  return {
    method: 'fano-octonionic-carrier-graph-field-v0',
    c1DependencyStatus: 'derived-from-c1-local-channel-table',
    e0DependencyStatus: 'derived-from-e0-profile-library',
    e1DependencyStatus: 'derived-from-e1-child-emission-envelopes',
    graphSetRows,
    nodeRows,
    edgeRows,
    carrierTransportRows,
    activationWeightRows,
    pathSumReadinessRows,
    spatialSupportPlaceholderRows,
    summary,
    issues,
    ok: issues.length === 0,
  };
}

function buildGraphSetRow(
  profileSetRow: HarmonicProfileSetRow,
): FanoCarrierGraphSetRow {
  return {
    graphId: graphId(profileSetRow.profileSetId),
    profileSetId: profileSetRow.profileSetId,
    profileFamilyId: profileSetRow.profileFamilyId,
    generationIndex: 0,
    graphStatus: 'carrier-channel-graph-field-ready',
  };
}

function buildPrimalNodeRows(args: {
  graphSetRow: FanoCarrierGraphSetRow;
  primalProfileAttachmentRows: PrimalProfileAttachmentRow[];
}): FanoCarrierGraphPrimalNodeRow[] {
  return args.primalProfileAttachmentRows
    .filter((row) => row.profileSetId === args.graphSetRow.profileSetId)
    .map((attachmentRow) => {
      const nodeId = primalNodeId(
        args.graphSetRow.graphId,
        attachmentRow.sourceSlotId,
      );

      return {
        graphId: args.graphSetRow.graphId,
        profileSetId: args.graphSetRow.profileSetId,
        nodeId,
        sourceSlotId: attachmentRow.sourceSlotId,
        nodeRole: 'primal-source-node',
        generationIndex: 0,
        carrierUnit: attachmentRow.c0CarrierUnit,
        signedCarrier: `+${attachmentRow.c0CarrierUnit}` as FanoSignedLift,
        carrierRay: `ray:${attachmentRow.c0CarrierUnit}` as FanoCarrierRay,
        intrinsicEmissionSource: 'e0-primal-profile',
        profileId: attachmentRow.profileId,
        oscillatorProfileStatus: 'e0-intrinsic-primal-oscillator-profile',
        freeEmissionStatus: 'intrinsic-free-emission',
        semanticLabelStatus: 'not-attached-placeholders-only',
        spatialSupportPlaceholderId: supportId(nodeId),
        spatialSupportKind: 'primal-vertex-support-placeholder',
      };
    });
}

function buildChildNodeRows(args: {
  graphSetRow: FanoCarrierGraphSetRow;
  envelopes: FanoChildEmissionEnvelopeRow[];
}): FanoCarrierGraphChildNodeRow[] {
  return args.envelopes
    .filter((envelope) => envelope.profileSetId === args.graphSetRow.profileSetId)
    .map((envelope) => {
      const nodeId = childNodeId(args.graphSetRow.graphId, envelope.childTokenId);

      return {
        graphId: args.graphSetRow.graphId,
        profileSetId: args.graphSetRow.profileSetId,
        nodeId,
        childTokenId: envelope.childTokenId,
        nodeRole: 'child-source-node',
        generationIndex: 1,
        canonicalLiftId: envelope.childCanonicalLiftId,
        signedLift: envelope.childSignedLift,
        carrierRay: envelope.carrierRay,
        parentSet: envelope.parentSet,
        projectedSourceSet: envelope.projectedSourceSet,
        complementTokenId: envelope.complementTokenId,
        intrinsicEmissionSource: 'e1-child-emission-envelope',
        envelopeId: envelope.envelopeId,
        oscillatorProfileStatus: 'e1-intrinsic-child-birth-emission',
        freeEmissionStatus: 'intrinsic-free-emission',
        semanticLabelStatus: 'not-attached-placeholders-only',
        spatialSupportPlaceholderId: supportId(nodeId),
        spatialSupportKind: 'child-midpoint-support-placeholder',
      };
    });
}

function buildEdgeRows(args: {
  graphSetRow: FanoCarrierGraphSetRow;
  envelopes: FanoChildEmissionEnvelopeRow[];
}): FanoCarrierGraphEdgeRow[] {
  const profileEnvelopes = args.envelopes.filter(
    (envelope) => envelope.profileSetId === args.graphSetRow.profileSetId,
  );

  return profileEnvelopes.flatMap((envelope) => [
    buildBirthEdge(args.graphSetRow, envelope),
    ...envelope.parentReturnKernelRows.map((kernelRow) =>
      buildResponseEdge(args.graphSetRow, kernelRow, 'parent-return-edge'),
      ),
      ...envelope.projectionLoopKernelRows.map((kernelRow) =>
        buildResponseEdge(args.graphSetRow, kernelRow, 'projection-loop-edge'),
      ),
      buildComplementEdge(args.graphSetRow, envelope, profileEnvelopes),
    ]);
}

function buildBirthEdge(
  graphSetRow: FanoCarrierGraphSetRow,
  envelope: FanoChildEmissionEnvelopeRow,
): FanoCarrierGraphBirthEdgeRow {
  const [leftParent, rightParent] =
    envelope.intrinsicBirthEmission.parentSourceSlotsInCanonicalOrder;
  const edgeId = `${graphSetRow.graphId}:edge:birth:${envelope.childTokenId}`;

  return {
    edgeId,
    graphId: graphSetRow.graphId,
    profileSetId: graphSetRow.profileSetId,
    edgeFamily: 'birth-edge',
    edgeArity: 'binary-source-to-child',
    sourceNodeIds: [
      primalNodeId(graphSetRow.graphId, leftParent),
      primalNodeId(graphSetRow.graphId, rightParent),
    ],
    targetNodeIds: [childNodeId(graphSetRow.graphId, envelope.childTokenId)],
    childTokenId: envelope.childTokenId,
    canonicalLiftId: envelope.childCanonicalLiftId,
    signedLift: envelope.childSignedLift,
    carrierRay: envelope.carrierRay,
    carrierTransportStatus: 'canonical-child-lift-from-e1-envelope',
    activationStatus: 'structural-birth-link-not-free-emission',
    responseStatus: 'not-response-kernel',
    weight: UNIT_WEIGHT,
    weightStatus: 'finite-v0-weight-no-free-tuning',
    spatialSupportPlaceholderId: supportId(edgeId),
    spatialSupportKind: 'birth-hyperedge-support-placeholder',
    derivationStatus: 'derived-from-e1-child-envelope-parent-set',
  };
}

function buildResponseEdge(
  graphSetRow: FanoCarrierGraphSetRow,
  kernelRow: FanoChildEmissionChannelKernelRow,
  edgeFamily: FanoCarrierGraphResponseEdgeRow['edgeFamily'],
): FanoCarrierGraphResponseEdgeRow {
  const edgeId = `${graphSetRow.graphId}:edge:${edgeFamily}:${kernelRow.childTokenId}:${kernelRow.actionSourceId}:${kernelRow.expectedRecoveredSourceId}`;
  const isParentReturn = edgeFamily === 'parent-return-edge';

  return {
    edgeId,
    graphId: graphSetRow.graphId,
    profileSetId: graphSetRow.profileSetId,
    edgeFamily,
    edgeArity: 'directed-response-channel',
    sourceNodeIds: [childNodeId(graphSetRow.graphId, kernelRow.childTokenId)],
    actionNodeId: primalNodeId(graphSetRow.graphId, kernelRow.actionSourceId),
    targetNodeIds: [
      primalNodeId(graphSetRow.graphId, kernelRow.expectedRecoveredSourceId),
    ],
    childTokenId: kernelRow.childTokenId,
    actionSourceId: kernelRow.actionSourceId,
    expectedRecoveredSourceId: kernelRow.expectedRecoveredSourceId,
    childLeftSignedResult: kernelRow.childLeftSignedResult,
    sourceLeftSignedResult: kernelRow.sourceLeftSignedResult,
    carrierTransportStatus: isParentReturn
      ? 'derived-from-e1-parent-return-kernel'
      : 'derived-from-e1-projection-loop-kernel',
    activationStatus: 'available-response-not-free-emission',
    responseStatus: 'response-kernel-not-always-on',
    weight: UNIT_WEIGHT,
    weightStatus: 'finite-v0-weight-no-free-tuning',
    spatialSupportPlaceholderId: supportId(edgeId),
    spatialSupportKind: 'channel-edge-support-placeholder',
    derivationStatus: isParentReturn
      ? 'derived-from-e1-parent-return-kernel'
      : 'derived-from-e1-projection-loop-kernel',
  };
}

function buildComplementEdge(
  graphSetRow: FanoCarrierGraphSetRow,
  envelope: FanoChildEmissionEnvelopeRow,
  profileEnvelopes: FanoChildEmissionEnvelopeRow[],
): FanoCarrierGraphComplementEdgeRow {
  const edgeId = `${graphSetRow.graphId}:edge:complement:${envelope.childTokenId}:${envelope.complementTokenId}`;
  const complementEnvelope = profileEnvelopes.find(
    (candidate) =>
      candidate.profileSetId === envelope.profileSetId &&
      candidate.childTokenId === envelope.complementTokenId,
  );

  if (!complementEnvelope) {
    throw new Error(
      `No complement envelope found for ${envelope.childTokenId} in ${envelope.profileSetId}`,
    );
  }

  if (envelope.carrierRay !== complementEnvelope.carrierRay) {
    throw new Error(
      `Complement carrier ray mismatch for ${envelope.childTokenId}/${envelope.complementTokenId}: ${envelope.carrierRay} vs ${complementEnvelope.carrierRay}`,
    );
  }

  if (
    getSignedLiftSign(envelope.childSignedLift) ===
    getSignedLiftSign(complementEnvelope.childSignedLift)
  ) {
    throw new Error(
      `Complement signed lift sign mismatch for ${envelope.childTokenId}/${envelope.complementTokenId}: ${envelope.childSignedLift} vs ${complementEnvelope.childSignedLift}`,
    );
  }

  return {
    edgeId,
    graphId: graphSetRow.graphId,
    profileSetId: graphSetRow.profileSetId,
    edgeFamily: 'complement-coupling-edge',
    edgeArity: 'directed-complement-channel',
    sourceNodeIds: [childNodeId(graphSetRow.graphId, envelope.childTokenId)],
    targetNodeIds: [
      childNodeId(graphSetRow.graphId, envelope.complementTokenId),
    ],
    childTokenId: envelope.childTokenId,
    complementTokenId: envelope.complementTokenId,
    sharedCarrierRay: envelope.complementCouplingKernelRow.sharedCarrierRay,
    sourceChildSignedLift: envelope.childSignedLift,
    complementChildSignedLift: complementEnvelope.childSignedLift,
    sourceCarrierRay: envelope.carrierRay,
    complementCarrierRay: complementEnvelope.carrierRay,
    complementOrientationRelation: 'same-ray-opposite-signed-lift',
    conjugacyStatus: 'octonionic-conjugate-orientation',
    carrierTransportStatus: 'derived-from-e1-complement-coupling-kernel',
    activationStatus: 'available-response-not-free-emission',
    responseStatus: 'response-kernel-not-always-on',
    weight: UNIT_WEIGHT,
    weightStatus: 'finite-v0-weight-no-free-tuning',
    spatialSupportPlaceholderId: supportId(edgeId),
    spatialSupportKind: 'complement-axis-support-placeholder',
    derivationStatus: 'derived-from-e1-complement-coupling-kernel',
  };
}

function buildCarrierTransportRows(args: {
  edgeRows: FanoCarrierGraphEdgeRow[];
  nodeRows: FanoCarrierGraphNodeRow[];
}): FanoCarrierTransportRow[] {
  return args.edgeRows.map((edgeRow) => {
    const transportId = `${edgeRow.edgeId}:transport`;

    if (edgeRow.edgeFamily === 'birth-edge') {
      return {
        transportId,
        graphId: edgeRow.graphId,
        edgeId: edgeRow.edgeId,
        edgeFamily: edgeRow.edgeFamily,
        sourceCarrierState: edgeRow.sourceNodeIds.map((nodeId) =>
          nodeCarrierState(args.nodeRows, nodeId),
        ),
        actionCarrierState: edgeRow.signedLift,
        targetCarrierState: edgeRow.targetNodeIds.map((nodeId) =>
          nodeCarrierState(args.nodeRows, nodeId),
        ),
        carrierOperationLabel: `${asciiLift(edgeRow.canonicalLiftId)} => ${edgeRow.signedLift}`,
        transportResult: edgeRow.signedLift,
        transportStatus: edgeRow.carrierTransportStatus,
        bracketingStatus: 'binary-birth-bracketing-preserved',
        derivationStatus: edgeRow.derivationStatus,
      };
    }

    if (edgeRow.edgeFamily === 'complement-coupling-edge') {
      return {
        transportId,
        graphId: edgeRow.graphId,
        edgeId: edgeRow.edgeId,
        edgeFamily: edgeRow.edgeFamily,
        sourceCarrierState: [edgeRow.sourceChildSignedLift],
        actionCarrierState: null,
        targetCarrierState: [edgeRow.complementChildSignedLift],
        carrierOperationLabel: `${edgeRow.childTokenId}<->${edgeRow.complementTokenId}`,
        transportResult: `${edgeRow.sourceChildSignedLift}->${edgeRow.complementChildSignedLift}|${edgeRow.complementOrientationRelation}`,
        transportStatus: edgeRow.carrierTransportStatus,
        bracketingStatus: 'one-step-no-associative-collapse',
        derivationStatus: edgeRow.derivationStatus,
      };
    }

    return {
      transportId,
      graphId: edgeRow.graphId,
      edgeId: edgeRow.edgeId,
      edgeFamily: edgeRow.edgeFamily,
      sourceCarrierState: edgeRow.sourceNodeIds.map((nodeId) =>
        nodeCarrierState(args.nodeRows, nodeId),
      ),
      actionCarrierState: nodeCarrierState(args.nodeRows, edgeRow.actionNodeId),
      targetCarrierState: edgeRow.targetNodeIds.map((nodeId) =>
        nodeCarrierState(args.nodeRows, nodeId),
      ),
      carrierOperationLabel: `${edgeRow.childTokenId}*${edgeRow.actionSourceId}->${edgeRow.expectedRecoveredSourceId}`,
      transportResult: `${edgeRow.childLeftSignedResult}|source-left:${edgeRow.sourceLeftSignedResult}`,
      transportStatus: edgeRow.carrierTransportStatus,
      bracketingStatus: 'one-step-no-associative-collapse',
      derivationStatus: edgeRow.derivationStatus,
    };
  });
}

function buildActivationWeightRows(args: {
  nodeRows: FanoCarrierGraphNodeRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
}): FanoCarrierGraphActivationWeightRow[] {
  return [
    ...args.nodeRows.map((nodeRow) => ({
      activationWeightId: `${nodeRow.nodeId}:activation-weight`,
      graphId: nodeRow.graphId,
      ownerKind: 'node' as const,
      ownerId: nodeRow.nodeId,
      activationStatus: 'intrinsic-free-emission' as const,
      weight: UNIT_WEIGHT,
      weightStatus: 'finite-v0-weight-no-free-tuning' as const,
      activationSourceStatus: 'node-intrinsic-emission' as const,
    })),
    ...args.edgeRows.map((edgeRow) => ({
      activationWeightId: `${edgeRow.edgeId}:activation-weight`,
      graphId: edgeRow.graphId,
      ownerKind: 'edge' as const,
      ownerId: edgeRow.edgeId,
      activationStatus: edgeRow.activationStatus,
      weight: edgeRow.weight,
      weightStatus: edgeRow.weightStatus,
      activationSourceStatus: 'edge-activation-policy-v0' as const,
    })),
  ];
}

function buildPathSumReadinessRows(args: {
  edgeRows: FanoCarrierGraphEdgeRow[];
  carrierTransportRows: FanoCarrierTransportRow[];
}): FanoCarrierGraphPathSumReadinessRow[] {
  return args.edgeRows.map((edgeRow) => {
    const transportRow = args.carrierTransportRows.find(
      (row) => row.edgeId === edgeRow.edgeId,
    );

    if (!transportRow) {
      throw new Error(`No transport row found for ${edgeRow.edgeId}`);
    }

    return {
      pathId: `${edgeRow.edgeId}:path:one-step`,
      graphId: edgeRow.graphId,
      edgeSequence: [edgeRow.edgeId],
      pathLength: 1,
      pathWeight: edgeRow.weight,
      pathActivationStatus: edgeRow.activationStatus,
      carrierTransportId: transportRow.transportId,
      sourceEmissionNodeId:
        edgeRow.edgeFamily === 'birth-edge'
          ? edgeRow.sourceNodeIds
          : edgeRow.sourceNodeIds[0],
      bracketingStatus:
        edgeRow.edgeFamily === 'birth-edge'
          ? 'binary-birth-bracketing-preserved'
          : 'one-step-no-associative-collapse',
      pathContributionStatus: 'ready-for-finite-path-sum-not-spectral-kernel',
    };
  });
}

function buildSpatialSupportPlaceholderRows(args: {
  nodeRows: FanoCarrierGraphNodeRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
}): FanoCarrierGraphSpatialSupportPlaceholderRow[] {
  return [
    ...args.nodeRows.map((nodeRow) => ({
      spatialSupportPlaceholderId: nodeRow.spatialSupportPlaceholderId,
      graphId: nodeRow.graphId,
      ownerKind: 'node' as const,
      ownerId: nodeRow.nodeId,
      supportKind: nodeRow.spatialSupportKind,
      anchorReference: nodeAnchorReference(nodeRow),
      continuousProjectionStatus:
        'placeholder-for-f2-continuous-spatial-support' as const,
      coordinateStatus: 'not-computed-in-f1' as const,
      f2BridgeStatus: 'required-input-for-f2' as const,
    })),
    ...args.edgeRows.map((edgeRow) => ({
      spatialSupportPlaceholderId: edgeRow.spatialSupportPlaceholderId,
      graphId: edgeRow.graphId,
      ownerKind: 'edge' as const,
      ownerId: edgeRow.edgeId,
      supportKind: edgeRow.spatialSupportKind,
      anchorReference: edgeAnchorReference(edgeRow),
      continuousProjectionStatus:
        'placeholder-for-f2-continuous-spatial-support' as const,
      coordinateStatus: 'not-computed-in-f1' as const,
      f2BridgeStatus: 'required-input-for-f2' as const,
    })),
  ];
}

function buildSummary(args: {
  graphSetRows: FanoCarrierGraphSetRow[];
  nodeRows: FanoCarrierGraphNodeRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
  carrierTransportRows: FanoCarrierTransportRow[];
  activationWeightRows: FanoCarrierGraphActivationWeightRow[];
  pathSumReadinessRows: FanoCarrierGraphPathSumReadinessRow[];
  spatialSupportPlaceholderRows: FanoCarrierGraphSpatialSupportPlaceholderRow[];
}): FanoOctonionicCarrierGraphFieldV0Summary {
  const nodeActivationWeightRowCount = args.activationWeightRows.filter(
    (row) => row.ownerKind === 'node',
  ).length;
  const edgeActivationWeightRowCount = args.activationWeightRows.filter(
    (row) => row.ownerKind === 'edge',
  ).length;
  const nodeSpatialSupportPlaceholderCount =
    args.spatialSupportPlaceholderRows.filter((row) => row.ownerKind === 'node')
      .length;
  const edgeSpatialSupportPlaceholderCount =
    args.spatialSupportPlaceholderRows.filter((row) => row.ownerKind === 'edge')
      .length;

  return {
    method: 'fano-octonionic-carrier-graph-field-v0',
    graphSetCount: args.graphSetRows.length,
    graphNodeCount: args.nodeRows.length,
    primalSourceNodeCount: args.nodeRows.filter(
      (row) => row.nodeRole === 'primal-source-node',
    ).length,
    childSourceNodeCount: args.nodeRows.filter(
      (row) => row.nodeRole === 'child-source-node',
    ).length,
    graphEdgeCount: args.edgeRows.length,
    birthEdgeCount: countEdges(args.edgeRows, 'birth-edge'),
    parentReturnEdgeCount: countEdges(args.edgeRows, 'parent-return-edge'),
    projectionLoopEdgeCount: countEdges(args.edgeRows, 'projection-loop-edge'),
    complementCouplingEdgeCount: countEdges(
      args.edgeRows,
      'complement-coupling-edge',
    ),
    carrierTransportRowCount: args.carrierTransportRows.length,
    complementSignedTransportRowCount: args.carrierTransportRows.filter(
      (row) =>
        row.edgeFamily === 'complement-coupling-edge' &&
        !row.transportResult.startsWith('ray:') &&
        row.transportResult.includes('->'),
    ).length,
    nodeActivationWeightRowCount,
    edgeActivationWeightRowCount,
    totalActivationWeightRowCount:
      nodeActivationWeightRowCount + edgeActivationWeightRowCount,
    pathSumReadinessRowCount: args.pathSumReadinessRows.length,
    nodeSpatialSupportPlaceholderCount,
    edgeSpatialSupportPlaceholderCount,
    totalSpatialSupportPlaceholderCount:
      nodeSpatialSupportPlaceholderCount + edgeSpatialSupportPlaceholderCount,
    graphLawStatus: 'carrier-connection-graph-field-v0',
    transportLawStatus: 'finite-one-step-path-readiness-no-spectral-kernel',
    complementSignedTransportStatus:
      'same-ray-opposite-signed-lift-preserved',
    activationLawStatus:
      'intrinsic-free-emission-vs-available-response-preserved',
    weightLawStatus: 'unit-v0-weights-no-free-tuning',
    birthArityStatus: 'binary-birth-preserved-not-flattened',
    spatialBridgeStatus: 'f2-spatial-support-placeholders-ready',
    continuousProjectionStatus: 'not-computed-in-f1-next-gate-f2',
    semanticLabelStatus: 'not-attached-placeholders-only',
    trisonSemanticStatus: 'not-computed-in-f1',
    spinorBridgeStatus: 'not-in-f1-carrier-bridge-preserved-upstream',
    uiStatus: 'no-ui',
    recommendedNextGate: 'F2 - Continuous Spatial Support Projection Table',
  };
}

function buildIssues(args: {
  c1Ok: boolean;
  e0Ok: boolean;
  e1Ok: boolean;
  nodeRows: FanoCarrierGraphNodeRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
  carrierTransportRows: FanoCarrierTransportRow[];
  activationWeightRows: FanoCarrierGraphActivationWeightRow[];
  pathSumReadinessRows: FanoCarrierGraphPathSumReadinessRow[];
  spatialSupportPlaceholderRows: FanoCarrierGraphSpatialSupportPlaceholderRow[];
  summary: FanoOctonionicCarrierGraphFieldV0Summary;
}): FanoOctonionicCarrierGraphFieldV0Issue[] {
  const issues: FanoOctonionicCarrierGraphFieldV0Issue[] = [];

  if (!args.c1Ok) {
    issues.push(issue('c1-report-not-ok', 'C1 local channel report is not ok'));
  }

  if (!args.e0Ok) {
    issues.push(issue('e0-report-not-ok', 'E0 profile report is not ok'));
  }

  if (!args.e1Ok) {
    issues.push(issue('e1-report-not-ok', 'E1 envelope report is not ok'));
  }

  expectCount(issues, args.summary.graphSetCount, 3, 'graph-set-count');
  expectCount(issues, args.summary.graphNodeCount, 30, 'graph-node-count');
  expectCount(
    issues,
    args.summary.primalSourceNodeCount,
    12,
    'primal-source-node-count',
  );
  expectCount(
    issues,
    args.summary.childSourceNodeCount,
    18,
    'child-source-node-count',
  );
  expectCount(issues, args.summary.graphEdgeCount, 108, 'graph-edge-count');
  expectCount(issues, args.summary.birthEdgeCount, 18, 'birth-edge-count');
  expectCount(
    issues,
    args.summary.parentReturnEdgeCount,
    36,
    'parent-return-edge-count',
  );
  expectCount(
    issues,
    args.summary.projectionLoopEdgeCount,
    36,
    'projection-loop-edge-count',
  );
  expectCount(
    issues,
    args.summary.complementCouplingEdgeCount,
    18,
    'complement-coupling-edge-count',
  );
  expectCount(
    issues,
    args.summary.carrierTransportRowCount,
    108,
    'carrier-transport-row-count',
  );
  expectCount(
    issues,
    args.summary.complementSignedTransportRowCount,
    18,
    'complement-signed-transport-row-count',
  );
  expectCount(
    issues,
    args.summary.pathSumReadinessRowCount,
    108,
    'path-sum-readiness-row-count',
  );
  expectCount(
    issues,
    args.summary.nodeSpatialSupportPlaceholderCount,
    30,
    'node-spatial-support-placeholder-count',
  );
  expectCount(
    issues,
    args.summary.edgeSpatialSupportPlaceholderCount,
    108,
    'edge-spatial-support-placeholder-count',
  );
  expectCount(
    issues,
    args.summary.totalSpatialSupportPlaceholderCount,
    138,
    'total-spatial-support-placeholder-count',
  );

  for (const edgeRow of args.edgeRows) {
    if (edgeRow.edgeFamily === 'birth-edge') {
      if (
        edgeRow.edgeArity !== 'binary-source-to-child' ||
        edgeRow.sourceNodeIds.length !== 2
      ) {
        issues.push(issue('birth-edge-not-binary', edgeRow.edgeId));
      }
      continue;
    }

    const responseActivationStatus: string = edgeRow.activationStatus;

    if (responseActivationStatus !== 'available-response-not-free-emission') {
      issues.push(issue('response-edge-activation-mismatch', edgeRow.edgeId));
    }

    if (edgeRow.edgeFamily === 'complement-coupling-edge') {
      if (!edgeRow.sourceChildSignedLift) {
        issues.push(
          issue('complement-edge-missing-source-signed-lift', edgeRow.edgeId),
        );
      }

      if (!edgeRow.complementChildSignedLift) {
        issues.push(
          issue(
            'complement-edge-missing-complement-signed-lift',
            edgeRow.edgeId,
          ),
        );
      }

      if (edgeRow.sourceCarrierRay !== edgeRow.complementCarrierRay) {
        issues.push(
          issue('complement-edge-carrier-ray-mismatch', edgeRow.edgeId),
        );
      }

      if (
        getSignedLiftSign(edgeRow.sourceChildSignedLift) ===
        getSignedLiftSign(edgeRow.complementChildSignedLift)
      ) {
        issues.push(
          issue('complement-edge-signed-lift-sign-not-opposed', edgeRow.edgeId),
        );
      }
    }
  }

  for (const row of args.carrierTransportRows.filter(
    (transportRow) => transportRow.edgeFamily === 'complement-coupling-edge',
  )) {
    if (row.transportResult.startsWith('ray:')) {
      issues.push(
        issue('complement-transport-collapsed-to-carrier-ray', row.transportId),
      );
    }

    if (!row.transportResult.includes('->')) {
      issues.push(
        issue(
          'complement-transport-missing-signed-lift-transition',
          row.transportId,
        ),
      );
    }
  }

  for (const row of args.activationWeightRows) {
    if (!Number.isFinite(row.weight) || row.weight < 0) {
      issues.push(issue('invalid-activation-weight', row.activationWeightId));
    }

    if (
      row.ownerKind === 'edge' &&
      row.activationStatus === 'intrinsic-free-emission'
    ) {
      issues.push(issue('response-edge-marked-free-emission', row.ownerId));
    }
  }

  for (const edgeRow of args.edgeRows) {
    if (!Number.isFinite(edgeRow.weight) || edgeRow.weight < 0) {
      issues.push(issue('invalid-edge-weight', edgeRow.edgeId));
    }
  }

  for (const nodeRow of args.nodeRows) {
    if (
      !args.spatialSupportPlaceholderRows.some(
        (row) =>
          row.ownerKind === 'node' &&
          row.ownerId === nodeRow.nodeId &&
          row.spatialSupportPlaceholderId === nodeRow.spatialSupportPlaceholderId,
      )
    ) {
      issues.push(issue('node-missing-spatial-placeholder', nodeRow.nodeId));
    }
  }

  for (const edgeRow of args.edgeRows) {
    if (
      !args.spatialSupportPlaceholderRows.some(
        (row) =>
          row.ownerKind === 'edge' &&
          row.ownerId === edgeRow.edgeId &&
          row.spatialSupportPlaceholderId ===
            edgeRow.spatialSupportPlaceholderId,
      )
    ) {
      issues.push(issue('edge-missing-spatial-placeholder', edgeRow.edgeId));
    }
  }

  if (args.summary.continuousProjectionStatus !== 'not-computed-in-f1-next-gate-f2') {
    issues.push(
      issue(
        'continuous-projection-computed',
        args.summary.continuousProjectionStatus,
      ),
    );
  }

  if (
    args.summary.complementSignedTransportStatus !==
    'same-ray-opposite-signed-lift-preserved'
  ) {
    issues.push(
      issue(
        'complement-signed-transport-status-mismatch',
        args.summary.complementSignedTransportStatus,
      ),
    );
  }

  if (args.summary.semanticLabelStatus !== 'not-attached-placeholders-only') {
    issues.push(issue('semantic-label-attached', args.summary.semanticLabelStatus));
  }

  if (args.summary.trisonSemanticStatus !== 'not-computed-in-f1') {
    issues.push(issue('trison-semantic-computed', args.summary.trisonSemanticStatus));
  }

  if (args.summary.uiStatus !== 'no-ui') {
    issues.push(issue('ui-attached', args.summary.uiStatus));
  }

  return issues;
}

function nodeAnchorReference(nodeRow: FanoCarrierGraphNodeRow): string {
  if (nodeRow.nodeRole === 'primal-source-node') {
    return `tetra-vertex:${nodeRow.sourceSlotId}`;
  }

  return `edge-midpoint:${nodeRow.parentSet.join('/')}`;
}

function edgeAnchorReference(edgeRow: FanoCarrierGraphEdgeRow): string {
  if (edgeRow.edgeFamily === 'birth-edge') {
    return `birth-support:${edgeRow.sourceNodeIds
      .map((nodeId) => lastIdSegment(nodeId))
      .join('/')}->${edgeRow.childTokenId}`;
  }

  if (edgeRow.edgeFamily === 'complement-coupling-edge') {
    return `complement-axis:${edgeRow.childTokenId}/${edgeRow.complementTokenId}`;
  }

  return `channel-support:${edgeRow.childTokenId}->${edgeRow.expectedRecoveredSourceId} via ${edgeRow.actionSourceId}`;
}

function nodeCarrierState(
  nodeRows: FanoCarrierGraphNodeRow[],
  nodeId: string,
): string {
  const nodeRow = nodeRows.find((row) => row.nodeId === nodeId);

  if (!nodeRow) {
    throw new Error(`No node row found for ${nodeId}`);
  }

  return nodeRow.nodeRole === 'primal-source-node'
    ? nodeRow.signedCarrier
    : nodeRow.signedLift;
}

function countEdges(
  edgeRows: FanoCarrierGraphEdgeRow[],
  edgeFamily: FanoCarrierGraphEdgeFamily,
): number {
  return edgeRows.filter((row) => row.edgeFamily === edgeFamily).length;
}

function graphId(profileSetId: string): string {
  return `carrier-graph:${profileSetId}`;
}

function primalNodeId(
  graphIdValue: string,
  sourceSlotId: FanoPrimalSourceId,
): string {
  return `${graphIdValue}:primal:${sourceSlotId}`;
}

function childNodeId(
  graphIdValue: string,
  childTokenId: FanoPairTokenId,
): string {
  return `${graphIdValue}:child:${childTokenId}`;
}

function supportId(ownerId: string): string {
  return `${ownerId}:spatial-support`;
}

function asciiLift(value: string): string {
  return value.replace(/·/g, '*');
}

function lastIdSegment(value: string): string {
  const segments = value.split(':');

  return segments[segments.length - 1] ?? value;
}

function getSignedLiftSign(signedLift: FanoSignedLift): FanoSign {
  return signedLift.slice(0, 1) as FanoSign;
}

function expectCount(
  issues: FanoOctonionicCarrierGraphFieldV0Issue[],
  actual: number,
  expected: number,
  code: string,
) {
  if (actual !== expected) {
    issues.push(issue(code, `expected ${expected}, got ${actual}`));
  }
}

function issue(
  code: string,
  message: string,
): FanoOctonionicCarrierGraphFieldV0Issue {
  return { code, message };
}
