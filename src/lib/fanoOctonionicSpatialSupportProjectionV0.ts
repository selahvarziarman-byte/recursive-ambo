import {
  buildFanoOctonionicCarrierGraphFieldV0Report,
  type FanoCarrierGraphActivationStatus,
  type FanoCarrierGraphChildNodeRow,
  type FanoCarrierGraphEdgeRow,
  type FanoCarrierGraphNodeRow,
  type FanoCarrierGraphPrimalNodeRow,
  type FanoCarrierGraphSetRow,
  type FanoCarrierGraphSpatialSupportKind,
  type FanoCarrierTransportRow,
} from './fanoOctonionicCarrierGraphFieldV0';
import {
  buildHarmonicEmissionProfilesV0Report,
  type HarmonicEmissionProfileRow,
  type HarmonicFrequencyRatio,
} from './harmonicEmissionProfilesV0';
import {
  buildFanoOctonionicChildEmissionEnvelopeV0Report,
  type FanoChildEmissionEnvelopeRow,
} from './fanoOctonionicChildEmissionEnvelopeV0';

type FanoPrimalSourceId = FanoCarrierGraphPrimalNodeRow['sourceSlotId'];
type FanoPairTokenId = FanoCarrierGraphChildNodeRow['childTokenId'];

export interface FanoSpatialCoordinate {
  x: number;
  y: number;
  z: number;
}

export type FanoSpatialAnchorKind =
  | 'tetra-vertex-anchor'
  | 'child-edge-midpoint-anchor';

export type FanoSpatialSupportLawId =
  | 'barycentric-primal-vertex-support-v0'
  | 'barycentric-child-midpoint-edge-basis-v0'
  | 'binary-birth-midpoint-basis-v0'
  | 'action-mediated-channel-polyline-support-v0'
  | 'complement-axis-segment-support-v0';

export type FanoSpatialSupportGeometryKind =
  | 'tetra-vertex-barycentric-coordinate'
  | 'child-edge-midpoint-barycentric-basis'
  | 'binary-birth-midpoint-basis'
  | 'action-mediated-polyline'
  | 'complement-axis-segment';

export interface FanoSpatialAnchorRow {
  spatialAnchorId: string;
  graphId: string;
  nodeId: string;
  sourceToken: FanoPrimalSourceId | FanoPairTokenId;
  anchorKind: FanoSpatialAnchorKind;
  coordinate: FanoSpatialCoordinate;
  coordinateLawStatus: 'regular-tetrahedron-centered-coordinate-frame-v0';
}

export interface FanoSpatialSupportFunctionRow {
  supportFunctionId: string;
  graphId: string;
  ownerKind: 'node' | 'edge';
  ownerId: string;
  supportKind: FanoCarrierGraphSpatialSupportKind;
  supportLawId: FanoSpatialSupportLawId;
  anchorNodeIds: string[];
  actionNodeId: string | null;
  targetNodeIds: string[];
  supportGeometryKind: FanoSpatialSupportGeometryKind;
  coordinateStatus: 'coordinates-computed-in-f2';
  carrierGraphDependencyStatus: 'derived-from-f1-spatial-support-placeholder';
  continuousProjectionStatus: 'support-function-ready-for-sampling';
}

export interface FanoSpatialSamplePointRow {
  samplePointId: string;
  graphId: string;
  sampleToken: FanoPrimalSourceId | FanoPairTokenId | 'O';
  sampleKind:
    | 'tetra-vertex-sample'
    | 'child-edge-midpoint-sample'
    | 'centroid-sample';
  coordinate: FanoSpatialCoordinate;
  coordinateLawStatus: 'regular-tetrahedron-centered-coordinate-frame-v0';
}

export interface FanoSpatialSupportSampleRow {
  supportSampleId: string;
  graphId: string;
  samplePointId: string;
  supportFunctionId: string;
  ownerKind: 'node' | 'edge';
  ownerId: string;
  supportKind: FanoCarrierGraphSpatialSupportKind;
  supportLawId: FanoSpatialSupportLawId;
  supportValue: number;
  supportDistance: number;
  finiteValueStatus: 'finite-support-sample';
  continuousProjectionStatus: 'continuous-support-function-evaluated';
}

export interface FanoFieldContributionSampleRow {
  contributionId: string;
  graphId: string;
  samplePointId: string;
  ownerKind: 'node' | 'edge';
  ownerId: string;
  contributionFamily:
    | 'baseline-intrinsic-node'
    | 'unit-response-probe-edge';
  baselineInclusionStatus:
    | 'included-in-baseline-free-field'
    | 'excluded-from-baseline-available-response';
  activationStatus: FanoCarrierGraphActivationStatus;
  activationMode:
    | 'baseline-intrinsic-free-emission'
    | 'unit-response-probe-not-baseline';
  supportValue: number;
  supportDistance: number;
  weight: number;
  amplitude: number;
  attenuation: number;
  attenuationFactor: number;
  effectiveAmplitude: number;
  phaseRadiansAtT0: number;
  frequencyRatio: HarmonicFrequencyRatio;
  realCoefficient: number;
  imagCoefficient: number;
  carrierStateOrTransportResult: string;
  carrierProjectionStatus: 'carrier-retained-not-reduced-to-phase';
  observableStatus: 'complex-coefficient-is-field-observable-not-source-ontology';
  spatialProjectionStatus: 'continuous-spatial-support-sampled';
  sourceEmissionProfileId: string | null;
  sourceEmissionEnvelopeId: string | null;
  actionNodeId: string | null;
  targetNodeIds: string[];
}

export interface FanoOctonionicSpatialSupportProjectionV0Summary {
  method: 'fano-octonionic-spatial-support-projection-v0';
  graphSetCount: number;
  nodeSpatialAnchorRowCount: number;
  nodeSupportFunctionRowCount: number;
  edgeSupportFunctionRowCount: number;
  totalSupportFunctionRowCount: number;
  samplePointRowCount: number;
  nodeSupportSampleRowCount: number;
  edgeSupportSampleRowCount: number;
  supportSampleRowCount: number;
  baselineIntrinsicContributionRowCount: number;
  responseProbeContributionRowCount: number;
  structuralBirthSupportSampleRowCount: number;
  totalFieldContributionSampleRowCount: number;
  finiteSupportSampleStatus: 'all-support-samples-finite';
  finiteContributionStatus: 'all-field-contribution-samples-finite';
  coordinateLawStatus: 'regular-tetrahedron-centered-coordinate-frame-v0';
  supportLawStatus: 'barycentric-node-and-action-mediated-edge-support-v0';
  complementAxisSpatializationStatus: 'signed-complement-midpoints-form-octahedral-axes';
  birthSpatializationStatus: 'binary-birth-arity-preserved-spatially-supported-by-midpoint-basis';
  responseActivationStatus: 'response-probes-sampled-separately-from-baseline';
  carrierProjectionStatus: 'carrier-retained-not-reduced-to-phase';
  observableStatus: 'complex-coefficient-is-field-observable-not-source-ontology';
  spatialProjectionStatus: 'continuous-spatial-support-sampled';
  uiStatus: 'no-ui';
  semanticLabelStatus: 'not-attached-placeholders-only';
  trisonSemanticStatus: 'not-computed-in-f2';
  generationalFieldUpdateStatus: 'not-computed-in-f2';
  recommendedNextGate: 'G0 - Generational Field Update Table';
}

export interface FanoOctonionicSpatialSupportProjectionV0Issue {
  code: string;
  message: string;
}

export interface FanoOctonionicSpatialSupportProjectionV0Report {
  method: 'fano-octonionic-spatial-support-projection-v0';
  f1DependencyStatus: 'derived-from-f1-carrier-graph-field';
  e0DependencyStatus: 'e0-used-to-resolve-primal-oscillator-coefficients';
  e1DependencyStatus: 'e1-used-to-resolve-child-oscillator-coefficients';
  graphSetRows: FanoCarrierGraphSetRow[];
  spatialAnchorRows: FanoSpatialAnchorRow[];
  supportFunctionRows: FanoSpatialSupportFunctionRow[];
  samplePointRows: FanoSpatialSamplePointRow[];
  supportSampleRows: FanoSpatialSupportSampleRow[];
  fieldContributionSampleRows: FanoFieldContributionSampleRow[];
  summary: FanoOctonionicSpatialSupportProjectionV0Summary;
  issues: FanoOctonionicSpatialSupportProjectionV0Issue[];
  ok: boolean;
}

interface BarycentricCoordinates {
  A: number;
  B: number;
  C: number;
  D: number;
}

interface ResolvedEmission {
  amplitude: number;
  attenuation: number;
  phaseRadiansAtT0: number;
  frequencyRatio: HarmonicFrequencyRatio;
  sourceEmissionProfileId: string | null;
  sourceEmissionEnvelopeId: string | null;
}

const SOURCE_SAMPLE_ORDER: readonly FanoPrimalSourceId[] = [
  'A',
  'B',
  'C',
  'D',
];
const CHILD_SAMPLE_ORDER: readonly FanoPairTokenId[] = [
  'M_AB',
  'M_AC',
  'M_AD',
  'M_BC',
  'M_BD',
  'M_CD',
];
const TETRA_COORDINATES: Record<FanoPrimalSourceId, FanoSpatialCoordinate> = {
  A: { x: 1, y: 1, z: 1 },
  B: { x: 1, y: -1, z: -1 },
  C: { x: -1, y: 1, z: -1 },
  D: { x: -1, y: -1, z: 1 },
};

export function buildFanoOctonionicSpatialSupportProjectionV0Report(): FanoOctonionicSpatialSupportProjectionV0Report {
  const f1Report = buildFanoOctonionicCarrierGraphFieldV0Report();
  const e0Report = buildHarmonicEmissionProfilesV0Report();
  const e1Report = buildFanoOctonionicChildEmissionEnvelopeV0Report();
  const spatialAnchorRows = buildSpatialAnchorRows(f1Report.nodeRows);
  const supportFunctionRows = buildSupportFunctionRows({
    nodeRows: f1Report.nodeRows,
    edgeRows: f1Report.edgeRows,
    placeholderRows: f1Report.spatialSupportPlaceholderRows,
  });
  const samplePointRows = buildSamplePointRows({
    graphSetRows: f1Report.graphSetRows,
    nodeRows: f1Report.nodeRows,
  });
  const supportSampleRows = buildSupportSampleRows({
    supportFunctionRows,
    samplePointRows,
    nodeRows: f1Report.nodeRows,
    edgeRows: f1Report.edgeRows,
    spatialAnchorRows,
  });
  const fieldContributionSampleRows = buildFieldContributionSampleRows({
    supportSampleRows,
    supportFunctionRows,
    nodeRows: f1Report.nodeRows,
    edgeRows: f1Report.edgeRows,
    activationWeightRows: f1Report.activationWeightRows,
    carrierTransportRows: f1Report.carrierTransportRows,
    profileRows: e0Report.profileRows,
    childEmissionEnvelopes: e1Report.childEmissionEnvelopes,
  });
  const summary = buildSummary({
    graphSetRows: f1Report.graphSetRows,
    spatialAnchorRows,
    supportFunctionRows,
    samplePointRows,
    supportSampleRows,
    fieldContributionSampleRows,
    edgeRows: f1Report.edgeRows,
  });
  const issues = buildIssues({
    f1Ok: f1Report.ok,
    e0Ok: e0Report.ok,
    e1Ok: e1Report.ok,
    nodeRows: f1Report.nodeRows,
    edgeRows: f1Report.edgeRows,
    spatialAnchorRows,
    supportFunctionRows,
    supportSampleRows,
    fieldContributionSampleRows,
    summary,
  });

  return {
    method: 'fano-octonionic-spatial-support-projection-v0',
    f1DependencyStatus: 'derived-from-f1-carrier-graph-field',
    e0DependencyStatus: 'e0-used-to-resolve-primal-oscillator-coefficients',
    e1DependencyStatus: 'e1-used-to-resolve-child-oscillator-coefficients',
    graphSetRows: f1Report.graphSetRows,
    spatialAnchorRows,
    supportFunctionRows,
    samplePointRows,
    supportSampleRows,
    fieldContributionSampleRows,
    summary,
    issues,
    ok: issues.length === 0,
  };
}

function buildSpatialAnchorRows(
  nodeRows: FanoCarrierGraphNodeRow[],
): FanoSpatialAnchorRow[] {
  return nodeRows.map((nodeRow) => {
    if (nodeRow.nodeRole === 'primal-source-node') {
      return {
        spatialAnchorId: `${nodeRow.nodeId}:spatial-anchor`,
        graphId: nodeRow.graphId,
        nodeId: nodeRow.nodeId,
        sourceToken: nodeRow.sourceSlotId,
        anchorKind: 'tetra-vertex-anchor',
        coordinate: cloneCoordinate(TETRA_COORDINATES[nodeRow.sourceSlotId]),
        coordinateLawStatus: 'regular-tetrahedron-centered-coordinate-frame-v0',
      };
    }

    return {
      spatialAnchorId: `${nodeRow.nodeId}:spatial-anchor`,
      graphId: nodeRow.graphId,
      nodeId: nodeRow.nodeId,
      sourceToken: nodeRow.childTokenId,
      anchorKind: 'child-edge-midpoint-anchor',
      coordinate: midpointForSources(nodeRow.parentSet),
      coordinateLawStatus: 'regular-tetrahedron-centered-coordinate-frame-v0',
    };
  });
}

function buildSupportFunctionRows(args: {
  nodeRows: FanoCarrierGraphNodeRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
  placeholderRows: Array<{
    graphId: string;
    ownerKind: 'node' | 'edge';
    ownerId: string;
    supportKind: FanoCarrierGraphSpatialSupportKind;
  }>;
}): FanoSpatialSupportFunctionRow[] {
  return args.placeholderRows.map((placeholderRow) => {
    if (placeholderRow.ownerKind === 'node') {
      const nodeRow = getNode(args.nodeRows, placeholderRow.ownerId);

      return {
        supportFunctionId: `${placeholderRow.ownerId}:support-function:f2`,
        graphId: placeholderRow.graphId,
        ownerKind: 'node',
        ownerId: placeholderRow.ownerId,
        supportKind: placeholderRow.supportKind,
        supportLawId:
          nodeRow.nodeRole === 'primal-source-node'
            ? 'barycentric-primal-vertex-support-v0'
            : 'barycentric-child-midpoint-edge-basis-v0',
        anchorNodeIds: [nodeRow.nodeId],
        actionNodeId: null,
        targetNodeIds: [],
        supportGeometryKind:
          nodeRow.nodeRole === 'primal-source-node'
            ? 'tetra-vertex-barycentric-coordinate'
            : 'child-edge-midpoint-barycentric-basis',
        coordinateStatus: 'coordinates-computed-in-f2',
        carrierGraphDependencyStatus:
          'derived-from-f1-spatial-support-placeholder',
        continuousProjectionStatus: 'support-function-ready-for-sampling',
      };
    }

    const edgeRow = getEdge(args.edgeRows, placeholderRow.ownerId);

    if (edgeRow.edgeFamily === 'birth-edge') {
      return {
        supportFunctionId: `${placeholderRow.ownerId}:support-function:f2`,
        graphId: placeholderRow.graphId,
        ownerKind: 'edge',
        ownerId: placeholderRow.ownerId,
        supportKind: placeholderRow.supportKind,
        supportLawId: 'binary-birth-midpoint-basis-v0',
        anchorNodeIds: [...edgeRow.sourceNodeIds],
        actionNodeId: null,
        targetNodeIds: [...edgeRow.targetNodeIds],
        supportGeometryKind: 'binary-birth-midpoint-basis',
        coordinateStatus: 'coordinates-computed-in-f2',
        carrierGraphDependencyStatus:
          'derived-from-f1-spatial-support-placeholder',
        continuousProjectionStatus: 'support-function-ready-for-sampling',
      };
    }

    if (edgeRow.edgeFamily === 'complement-coupling-edge') {
      return {
        supportFunctionId: `${placeholderRow.ownerId}:support-function:f2`,
        graphId: placeholderRow.graphId,
        ownerKind: 'edge',
        ownerId: placeholderRow.ownerId,
        supportKind: placeholderRow.supportKind,
        supportLawId: 'complement-axis-segment-support-v0',
        anchorNodeIds: [...edgeRow.sourceNodeIds, ...edgeRow.targetNodeIds],
        actionNodeId: null,
        targetNodeIds: [...edgeRow.targetNodeIds],
        supportGeometryKind: 'complement-axis-segment',
        coordinateStatus: 'coordinates-computed-in-f2',
        carrierGraphDependencyStatus:
          'derived-from-f1-spatial-support-placeholder',
        continuousProjectionStatus: 'support-function-ready-for-sampling',
      };
    }

    return {
      supportFunctionId: `${placeholderRow.ownerId}:support-function:f2`,
      graphId: placeholderRow.graphId,
      ownerKind: 'edge',
      ownerId: placeholderRow.ownerId,
      supportKind: placeholderRow.supportKind,
      supportLawId: 'action-mediated-channel-polyline-support-v0',
      anchorNodeIds: [...edgeRow.sourceNodeIds],
      actionNodeId: edgeRow.actionNodeId,
      targetNodeIds: [...edgeRow.targetNodeIds],
      supportGeometryKind: 'action-mediated-polyline',
      coordinateStatus: 'coordinates-computed-in-f2',
      carrierGraphDependencyStatus:
        'derived-from-f1-spatial-support-placeholder',
      continuousProjectionStatus: 'support-function-ready-for-sampling',
    };
  });
}

function buildSamplePointRows(args: {
  graphSetRows: FanoCarrierGraphSetRow[];
  nodeRows: FanoCarrierGraphNodeRow[];
}): FanoSpatialSamplePointRow[] {
  return args.graphSetRows.flatMap((graphSetRow) => {
    const graphNodeRows = args.nodeRows.filter(
      (nodeRow) => nodeRow.graphId === graphSetRow.graphId,
    );
    const vertexSamples = SOURCE_SAMPLE_ORDER.map((sourceId) => ({
      samplePointId: `${graphSetRow.graphId}:sample:${sourceId}`,
      graphId: graphSetRow.graphId,
      sampleToken: sourceId,
      sampleKind: 'tetra-vertex-sample' as const,
      coordinate: cloneCoordinate(TETRA_COORDINATES[sourceId]),
      coordinateLawStatus:
        'regular-tetrahedron-centered-coordinate-frame-v0' as const,
    }));
    const childSamples = CHILD_SAMPLE_ORDER.map((tokenId) => {
      const childNode = graphNodeRows.find(
        (nodeRow): nodeRow is FanoCarrierGraphChildNodeRow =>
          nodeRow.nodeRole === 'child-source-node' &&
          nodeRow.childTokenId === tokenId,
      );

      if (!childNode) {
        throw new Error(`No child node found for ${graphSetRow.graphId}:${tokenId}`);
      }

      return {
        samplePointId: `${graphSetRow.graphId}:sample:${tokenId}`,
        graphId: graphSetRow.graphId,
        sampleToken: tokenId,
        sampleKind: 'child-edge-midpoint-sample' as const,
        coordinate: midpointForSources(childNode.parentSet),
        coordinateLawStatus:
          'regular-tetrahedron-centered-coordinate-frame-v0' as const,
      };
    });

    return [
      ...vertexSamples,
      ...childSamples,
      {
        samplePointId: `${graphSetRow.graphId}:sample:O`,
        graphId: graphSetRow.graphId,
        sampleToken: 'O' as const,
        sampleKind: 'centroid-sample' as const,
        coordinate: { x: 0, y: 0, z: 0 },
        coordinateLawStatus:
          'regular-tetrahedron-centered-coordinate-frame-v0' as const,
      },
    ];
  });
}

function buildSupportSampleRows(args: {
  supportFunctionRows: FanoSpatialSupportFunctionRow[];
  samplePointRows: FanoSpatialSamplePointRow[];
  nodeRows: FanoCarrierGraphNodeRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
  spatialAnchorRows: FanoSpatialAnchorRow[];
}): FanoSpatialSupportSampleRow[] {
  return args.supportFunctionRows.flatMap((supportFunctionRow) =>
    args.samplePointRows
      .filter((samplePointRow) => samplePointRow.graphId === supportFunctionRow.graphId)
      .map((samplePointRow) => {
        const evaluation = evaluateSupportFunction({
          supportFunctionRow,
          samplePointRow,
          nodeRows: args.nodeRows,
          edgeRows: args.edgeRows,
          spatialAnchorRows: args.spatialAnchorRows,
        });

        return {
          supportSampleId: `${supportFunctionRow.supportFunctionId}:sample:${lastIdSegment(samplePointRow.samplePointId)}`,
          graphId: supportFunctionRow.graphId,
          samplePointId: samplePointRow.samplePointId,
          supportFunctionId: supportFunctionRow.supportFunctionId,
          ownerKind: supportFunctionRow.ownerKind,
          ownerId: supportFunctionRow.ownerId,
          supportKind: supportFunctionRow.supportKind,
          supportLawId: supportFunctionRow.supportLawId,
          supportValue: evaluation.supportValue,
          supportDistance: evaluation.supportDistance,
          finiteValueStatus: 'finite-support-sample',
          continuousProjectionStatus: 'continuous-support-function-evaluated',
        };
      }),
  );
}

function buildFieldContributionSampleRows(args: {
  supportSampleRows: FanoSpatialSupportSampleRow[];
  supportFunctionRows: FanoSpatialSupportFunctionRow[];
  nodeRows: FanoCarrierGraphNodeRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
  activationWeightRows: Array<{
    ownerKind: 'node' | 'edge';
    ownerId: string;
    activationStatus: FanoCarrierGraphActivationStatus;
    weight: number;
  }>;
  carrierTransportRows: FanoCarrierTransportRow[];
  profileRows: HarmonicEmissionProfileRow[];
  childEmissionEnvelopes: FanoChildEmissionEnvelopeRow[];
}): FanoFieldContributionSampleRow[] {
  return args.supportSampleRows.flatMap((supportSampleRow) => {
    const supportFunctionRow = getSupportFunction(
      args.supportFunctionRows,
      supportSampleRow.supportFunctionId,
    );

    if (supportSampleRow.ownerKind === 'node') {
      const nodeRow = getNode(args.nodeRows, supportSampleRow.ownerId);
      const activationWeightRow = getActivationWeight(
        args.activationWeightRows,
        'node',
        nodeRow.nodeId,
      );
      const emission = resolveNodeEmission({
        nodeRow,
        profileRows: args.profileRows,
        childEmissionEnvelopes: args.childEmissionEnvelopes,
      });

      return [
        buildContributionRow({
          contributionId: `${supportSampleRow.supportSampleId}:baseline-contribution`,
          supportSampleRow,
          ownerKind: 'node',
          ownerId: nodeRow.nodeId,
          contributionFamily: 'baseline-intrinsic-node',
          baselineInclusionStatus: 'included-in-baseline-free-field',
          activationStatus: activationWeightRow.activationStatus,
          activationMode: 'baseline-intrinsic-free-emission',
          weight: activationWeightRow.weight,
          emission,
          carrierStateOrTransportResult: carrierStateForNode(nodeRow),
          actionNodeId: null,
          targetNodeIds: [],
        }),
      ];
    }

    const edgeRow = getEdge(args.edgeRows, supportSampleRow.ownerId);

    if (edgeRow.edgeFamily === 'birth-edge') {
      return [];
    }

    const sourceNodeId = edgeRow.sourceNodeIds[0];
    const sourceNode = getNode(args.nodeRows, sourceNodeId);
    const activationWeightRow = getActivationWeight(
      args.activationWeightRows,
      'edge',
      edgeRow.edgeId,
    );
    const emission = resolveResponseProbeEmission({
      sourceNode,
      childEmissionEnvelopes: args.childEmissionEnvelopes,
    });
    const transportRow = getCarrierTransport(
      args.carrierTransportRows,
      edgeRow.edgeId,
    );

    return [
      buildContributionRow({
        contributionId: `${supportSampleRow.supportSampleId}:response-probe-contribution`,
        supportSampleRow,
        ownerKind: 'edge',
        ownerId: edgeRow.edgeId,
        contributionFamily: 'unit-response-probe-edge',
        baselineInclusionStatus: 'excluded-from-baseline-available-response',
        activationStatus: activationWeightRow.activationStatus,
        activationMode: 'unit-response-probe-not-baseline',
        weight: activationWeightRow.weight,
        emission,
        carrierStateOrTransportResult: transportRow.transportResult,
        actionNodeId: supportFunctionRow.actionNodeId,
        targetNodeIds: [...supportFunctionRow.targetNodeIds],
      }),
    ];
  });
}

function buildContributionRow(args: {
  contributionId: string;
  supportSampleRow: FanoSpatialSupportSampleRow;
  ownerKind: 'node' | 'edge';
  ownerId: string;
  contributionFamily:
    | 'baseline-intrinsic-node'
    | 'unit-response-probe-edge';
  baselineInclusionStatus:
    | 'included-in-baseline-free-field'
    | 'excluded-from-baseline-available-response';
  activationStatus: FanoCarrierGraphActivationStatus;
  activationMode:
    | 'baseline-intrinsic-free-emission'
    | 'unit-response-probe-not-baseline';
  weight: number;
  emission: ResolvedEmission;
  carrierStateOrTransportResult: string;
  actionNodeId: string | null;
  targetNodeIds: string[];
}): FanoFieldContributionSampleRow {
  const attenuationFactor = Math.exp(
    -args.emission.attenuation * args.supportSampleRow.supportDistance,
  );
  const effectiveAmplitude =
    args.weight *
    args.emission.amplitude *
    args.supportSampleRow.supportValue *
    attenuationFactor;

  return {
    contributionId: args.contributionId,
    graphId: args.supportSampleRow.graphId,
    samplePointId: args.supportSampleRow.samplePointId,
    ownerKind: args.ownerKind,
    ownerId: args.ownerId,
    contributionFamily: args.contributionFamily,
    baselineInclusionStatus: args.baselineInclusionStatus,
    activationStatus: args.activationStatus,
    activationMode: args.activationMode,
    supportValue: args.supportSampleRow.supportValue,
    supportDistance: args.supportSampleRow.supportDistance,
    weight: args.weight,
    amplitude: args.emission.amplitude,
    attenuation: args.emission.attenuation,
    attenuationFactor,
    effectiveAmplitude,
    phaseRadiansAtT0: args.emission.phaseRadiansAtT0,
    frequencyRatio: args.emission.frequencyRatio,
    realCoefficient:
      effectiveAmplitude * Math.cos(args.emission.phaseRadiansAtT0),
    imagCoefficient:
      effectiveAmplitude * Math.sin(args.emission.phaseRadiansAtT0),
    carrierStateOrTransportResult: args.carrierStateOrTransportResult,
    carrierProjectionStatus: 'carrier-retained-not-reduced-to-phase',
    observableStatus:
      'complex-coefficient-is-field-observable-not-source-ontology',
    spatialProjectionStatus: 'continuous-spatial-support-sampled',
    sourceEmissionProfileId: args.emission.sourceEmissionProfileId,
    sourceEmissionEnvelopeId: args.emission.sourceEmissionEnvelopeId,
    actionNodeId: args.actionNodeId,
    targetNodeIds: args.targetNodeIds,
  };
}

function evaluateSupportFunction(args: {
  supportFunctionRow: FanoSpatialSupportFunctionRow;
  samplePointRow: FanoSpatialSamplePointRow;
  nodeRows: FanoCarrierGraphNodeRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
  spatialAnchorRows: FanoSpatialAnchorRow[];
}): {
  supportValue: number;
  supportDistance: number;
} {
  const supportFunctionRow = args.supportFunctionRow;
  const point = args.samplePointRow.coordinate;

  if (supportFunctionRow.ownerKind === 'node') {
    const nodeRow = getNode(args.nodeRows, supportFunctionRow.ownerId);
    const anchor = getAnchor(args.spatialAnchorRows, nodeRow.nodeId);

    if (nodeRow.nodeRole === 'primal-source-node') {
      const lambdas = barycentricCoordinates(point);
      const supportValue = positivePart(lambdas[nodeRow.sourceSlotId]);

      return {
        supportValue,
        supportDistance: distance(point, anchor.coordinate),
      };
    }

    return {
      supportValue: midpointBasis(point, nodeRow.parentSet),
      supportDistance: distance(point, anchor.coordinate),
    };
  }

  const edgeRow = getEdge(args.edgeRows, supportFunctionRow.ownerId);

  if (edgeRow.edgeFamily === 'birth-edge') {
    const targetNode = getNode(args.nodeRows, edgeRow.targetNodeIds[0]);

    if (targetNode.nodeRole !== 'child-source-node') {
      throw new Error(`Birth edge target is not a child node ${edgeRow.edgeId}`);
    }

    return {
      supportValue: midpointBasis(point, targetNode.parentSet),
      supportDistance: distance(point, midpointForSources(targetNode.parentSet)),
    };
  }

  if (edgeRow.edgeFamily === 'complement-coupling-edge') {
    const sourceAnchor = getAnchor(args.spatialAnchorRows, edgeRow.sourceNodeIds[0]);
    const targetAnchor = getAnchor(args.spatialAnchorRows, edgeRow.targetNodeIds[0]);
    const supportDistance = distanceToSegment(
      point,
      sourceAnchor.coordinate,
      targetAnchor.coordinate,
    );
    const segmentLength = distance(sourceAnchor.coordinate, targetAnchor.coordinate);

    return {
      supportValue: rationalDistanceSupport(supportDistance, segmentLength),
      supportDistance,
    };
  }

  const sourceAnchor = getAnchor(args.spatialAnchorRows, edgeRow.sourceNodeIds[0]);
  const actionAnchor = getAnchor(args.spatialAnchorRows, edgeRow.actionNodeId);
  const targetAnchor = getAnchor(args.spatialAnchorRows, edgeRow.targetNodeIds[0]);
  const polyline = [
    sourceAnchor.coordinate,
    actionAnchor.coordinate,
    targetAnchor.coordinate,
  ];
  const supportDistance = distanceToPolyline(point, polyline);
  const supportScale = minimumPositiveSegmentLength(polyline);

  return {
    supportValue: rationalDistanceSupport(supportDistance, supportScale),
    supportDistance,
  };
}

function buildSummary(args: {
  graphSetRows: FanoCarrierGraphSetRow[];
  spatialAnchorRows: FanoSpatialAnchorRow[];
  supportFunctionRows: FanoSpatialSupportFunctionRow[];
  samplePointRows: FanoSpatialSamplePointRow[];
  supportSampleRows: FanoSpatialSupportSampleRow[];
  fieldContributionSampleRows: FanoFieldContributionSampleRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
}): FanoOctonionicSpatialSupportProjectionV0Summary {
  return {
    method: 'fano-octonionic-spatial-support-projection-v0',
    graphSetCount: args.graphSetRows.length,
    nodeSpatialAnchorRowCount: args.spatialAnchorRows.length,
    nodeSupportFunctionRowCount: args.supportFunctionRows.filter(
      (row) => row.ownerKind === 'node',
    ).length,
    edgeSupportFunctionRowCount: args.supportFunctionRows.filter(
      (row) => row.ownerKind === 'edge',
    ).length,
    totalSupportFunctionRowCount: args.supportFunctionRows.length,
    samplePointRowCount: args.samplePointRows.length,
    nodeSupportSampleRowCount: args.supportSampleRows.filter(
      (row) => row.ownerKind === 'node',
    ).length,
    edgeSupportSampleRowCount: args.supportSampleRows.filter(
      (row) => row.ownerKind === 'edge',
    ).length,
    supportSampleRowCount: args.supportSampleRows.length,
    baselineIntrinsicContributionRowCount:
      args.fieldContributionSampleRows.filter(
        (row) => row.contributionFamily === 'baseline-intrinsic-node',
      ).length,
    responseProbeContributionRowCount: args.fieldContributionSampleRows.filter(
      (row) => row.contributionFamily === 'unit-response-probe-edge',
    ).length,
    structuralBirthSupportSampleRowCount: args.supportSampleRows.filter(
      (row) =>
        row.ownerKind === 'edge' &&
        getEdge(args.edgeRows, row.ownerId).edgeFamily === 'birth-edge',
    ).length,
    totalFieldContributionSampleRowCount:
      args.fieldContributionSampleRows.length,
    finiteSupportSampleStatus: 'all-support-samples-finite',
    finiteContributionStatus: 'all-field-contribution-samples-finite',
    coordinateLawStatus: 'regular-tetrahedron-centered-coordinate-frame-v0',
    supportLawStatus: 'barycentric-node-and-action-mediated-edge-support-v0',
    complementAxisSpatializationStatus:
      'signed-complement-midpoints-form-octahedral-axes',
    birthSpatializationStatus:
      'binary-birth-arity-preserved-spatially-supported-by-midpoint-basis',
    responseActivationStatus:
      'response-probes-sampled-separately-from-baseline',
    carrierProjectionStatus: 'carrier-retained-not-reduced-to-phase',
    observableStatus:
      'complex-coefficient-is-field-observable-not-source-ontology',
    spatialProjectionStatus: 'continuous-spatial-support-sampled',
    uiStatus: 'no-ui',
    semanticLabelStatus: 'not-attached-placeholders-only',
    trisonSemanticStatus: 'not-computed-in-f2',
    generationalFieldUpdateStatus: 'not-computed-in-f2',
    recommendedNextGate: 'G0 - Generational Field Update Table',
  };
}

function buildIssues(args: {
  f1Ok: boolean;
  e0Ok: boolean;
  e1Ok: boolean;
  nodeRows: FanoCarrierGraphNodeRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
  spatialAnchorRows: FanoSpatialAnchorRow[];
  supportFunctionRows: FanoSpatialSupportFunctionRow[];
  supportSampleRows: FanoSpatialSupportSampleRow[];
  fieldContributionSampleRows: FanoFieldContributionSampleRow[];
  summary: FanoOctonionicSpatialSupportProjectionV0Summary;
}): FanoOctonionicSpatialSupportProjectionV0Issue[] {
  const issues: FanoOctonionicSpatialSupportProjectionV0Issue[] = [];

  if (!args.f1Ok) {
    issues.push(issue('f1-report-not-ok', 'F1 carrier graph field report is not ok'));
  }

  if (!args.e0Ok) {
    issues.push(issue('e0-report-not-ok', 'E0 profile report is not ok'));
  }

  if (!args.e1Ok) {
    issues.push(issue('e1-report-not-ok', 'E1 envelope report is not ok'));
  }

  expectCount(issues, args.summary.graphSetCount, 3, 'graph-set-count');
  expectCount(
    issues,
    args.summary.nodeSpatialAnchorRowCount,
    30,
    'node-spatial-anchor-row-count',
  );
  expectCount(
    issues,
    args.summary.nodeSupportFunctionRowCount,
    30,
    'node-support-function-row-count',
  );
  expectCount(
    issues,
    args.summary.edgeSupportFunctionRowCount,
    108,
    'edge-support-function-row-count',
  );
  expectCount(
    issues,
    args.summary.totalSupportFunctionRowCount,
    138,
    'total-support-function-row-count',
  );
  expectCount(
    issues,
    args.summary.samplePointRowCount,
    33,
    'sample-point-row-count',
  );
  expectCount(
    issues,
    args.summary.supportSampleRowCount,
    1518,
    'support-sample-row-count',
  );
  expectCount(
    issues,
    args.summary.nodeSupportSampleRowCount,
    330,
    'node-support-sample-row-count',
  );
  expectCount(
    issues,
    args.summary.edgeSupportSampleRowCount,
    1188,
    'edge-support-sample-row-count',
  );
  expectCount(
    issues,
    args.summary.baselineIntrinsicContributionRowCount,
    330,
    'baseline-intrinsic-contribution-row-count',
  );
  expectCount(
    issues,
    args.summary.responseProbeContributionRowCount,
    990,
    'response-probe-contribution-row-count',
  );
  expectCount(
    issues,
    args.summary.structuralBirthSupportSampleRowCount,
    198,
    'structural-birth-support-sample-row-count',
  );
  expectCount(
    issues,
    args.summary.totalFieldContributionSampleRowCount,
    1320,
    'total-field-contribution-sample-row-count',
  );

  for (const nodeRow of args.nodeRows) {
    if (!args.spatialAnchorRows.some((row) => row.nodeId === nodeRow.nodeId)) {
      issues.push(issue('node-missing-spatial-anchor', nodeRow.nodeId));
    }

    if (
      !args.supportFunctionRows.some(
        (row) => row.ownerKind === 'node' && row.ownerId === nodeRow.nodeId,
      )
    ) {
      issues.push(issue('node-missing-support-function', nodeRow.nodeId));
    }
  }

  for (const edgeRow of args.edgeRows) {
    if (
      !args.supportFunctionRows.some(
        (row) => row.ownerKind === 'edge' && row.ownerId === edgeRow.edgeId,
      )
    ) {
      issues.push(issue('edge-missing-support-function', edgeRow.edgeId));
    }
  }

  for (const row of args.supportSampleRows) {
    if (!Number.isFinite(row.supportValue) || !Number.isFinite(row.supportDistance)) {
      issues.push(issue('non-finite-support-sample', row.supportSampleId));
    }

    if (row.supportValue < 0) {
      issues.push(issue('negative-support-sample', row.supportSampleId));
    }
  }

  for (const row of args.fieldContributionSampleRows) {
    const finiteContribution =
      Number.isFinite(row.realCoefficient) &&
      Number.isFinite(row.imagCoefficient) &&
      Number.isFinite(row.effectiveAmplitude) &&
      Number.isFinite(row.attenuationFactor);

    if (!finiteContribution) {
      issues.push(issue('non-finite-field-contribution', row.contributionId));
    }

    if (!row.carrierStateOrTransportResult) {
      issues.push(issue('contribution-missing-carrier-state', row.contributionId));
    }

    if (row.carrierProjectionStatus !== 'carrier-retained-not-reduced-to-phase') {
      issues.push(issue('carrier-reduced-to-phase', row.contributionId));
    }

    if (
      row.contributionFamily === 'unit-response-probe-edge' &&
      row.baselineInclusionStatus !== 'excluded-from-baseline-available-response'
    ) {
      issues.push(issue('response-edge-included-in-baseline', row.contributionId));
    }

    if (
      row.contributionFamily === 'unit-response-probe-edge' &&
      !row.sourceEmissionEnvelopeId
    ) {
      issues.push(issue('response-probe-missing-source-child-emission', row.contributionId));
    }
  }

  const birthEdgeIds = new Set(
    args.edgeRows
      .filter((row) => row.edgeFamily === 'birth-edge')
      .map((row) => row.edgeId),
  );

  for (const row of args.fieldContributionSampleRows) {
    if (row.ownerKind === 'edge' && birthEdgeIds.has(row.ownerId)) {
      issues.push(issue('birth-edge-has-field-contribution', row.contributionId));
    }
  }

  if (args.summary.semanticLabelStatus !== 'not-attached-placeholders-only') {
    issues.push(issue('semantic-label-attached', args.summary.semanticLabelStatus));
  }

  if (args.summary.trisonSemanticStatus !== 'not-computed-in-f2') {
    issues.push(issue('trison-semantic-computed', args.summary.trisonSemanticStatus));
  }

  if (args.summary.generationalFieldUpdateStatus !== 'not-computed-in-f2') {
    issues.push(
      issue(
        'generational-field-update-computed',
        args.summary.generationalFieldUpdateStatus,
      ),
    );
  }

  return issues;
}

function resolveNodeEmission(args: {
  nodeRow: FanoCarrierGraphNodeRow;
  profileRows: HarmonicEmissionProfileRow[];
  childEmissionEnvelopes: FanoChildEmissionEnvelopeRow[];
}): ResolvedEmission {
  const nodeRow = args.nodeRow;

  if (nodeRow.nodeRole === 'primal-source-node') {
    const profileRow = args.profileRows.find(
      (row) => row.profileId === nodeRow.profileId,
    );

    if (!profileRow) {
      throw new Error(`No E0 profile found for ${nodeRow.profileId}`);
    }

    return {
      amplitude: profileRow.amplitude,
      attenuation: profileRow.attenuation,
      phaseRadiansAtT0: profileRow.phaseRadians,
      frequencyRatio: profileRow.frequencyRatio,
      sourceEmissionProfileId: profileRow.profileId,
      sourceEmissionEnvelopeId: null,
    };
  }

  const envelope = getEnvelope(args.childEmissionEnvelopes, nodeRow.envelopeId);
  const emission = envelope.intrinsicBirthEmission;

  return {
    amplitude: emission.amplitude,
    attenuation: emission.attenuation,
    phaseRadiansAtT0: emission.phaseRadians,
    frequencyRatio: emission.foldedFrequencyRatio,
    sourceEmissionProfileId: null,
    sourceEmissionEnvelopeId: envelope.envelopeId,
  };
}

function resolveResponseProbeEmission(args: {
  sourceNode: FanoCarrierGraphNodeRow;
  childEmissionEnvelopes: FanoChildEmissionEnvelopeRow[];
}): ResolvedEmission {
  const sourceNode = args.sourceNode;

  if (sourceNode.nodeRole !== 'child-source-node') {
    throw new Error(`Response probe source is not a child node ${sourceNode.nodeId}`);
  }

  const envelope = getEnvelope(args.childEmissionEnvelopes, sourceNode.envelopeId);
  const emission = envelope.intrinsicBirthEmission;

  return {
    amplitude: emission.amplitude,
    attenuation: emission.attenuation,
    phaseRadiansAtT0: emission.phaseRadians,
    frequencyRatio: emission.foldedFrequencyRatio,
    sourceEmissionProfileId: null,
    sourceEmissionEnvelopeId: envelope.envelopeId,
  };
}

function carrierStateForNode(nodeRow: FanoCarrierGraphNodeRow): string {
  return nodeRow.nodeRole === 'primal-source-node'
    ? nodeRow.signedCarrier
    : nodeRow.signedLift;
}

function midpointBasis(
  point: FanoSpatialCoordinate,
  sourcePair: readonly [FanoPrimalSourceId, FanoPrimalSourceId],
): number {
  const lambdas = barycentricCoordinates(point);
  const [leftSource, rightSource] = sourcePair;

  return (
    4 *
    positivePart(lambdas[leftSource]) *
    positivePart(lambdas[rightSource])
  );
}

function barycentricCoordinates(point: FanoSpatialCoordinate): BarycentricCoordinates {
  return {
    A: (1 + point.x + point.y + point.z) / 4,
    B: (1 + point.x - point.y - point.z) / 4,
    C: (1 - point.x + point.y - point.z) / 4,
    D: (1 - point.x - point.y + point.z) / 4,
  };
}

function midpointForSources(
  sourcePair: readonly [FanoPrimalSourceId, FanoPrimalSourceId],
): FanoSpatialCoordinate {
  const [leftSource, rightSource] = sourcePair;
  const left = TETRA_COORDINATES[leftSource];
  const right = TETRA_COORDINATES[rightSource];

  return scale(add(left, right), 0.5);
}

function rationalDistanceSupport(distanceValue: number, supportScale: number): number {
  if (supportScale <= 0) {
    return 0;
  }

  const scaledDistance = distanceValue / supportScale;

  return 1 / (1 + scaledDistance * scaledDistance);
}

function distanceToPolyline(
  point: FanoSpatialCoordinate,
  polyline: FanoSpatialCoordinate[],
): number {
  let minimumDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < polyline.length - 1; index += 1) {
    minimumDistance = Math.min(
      minimumDistance,
      distanceToSegment(point, polyline[index], polyline[index + 1]),
    );
  }

  return minimumDistance;
}

function distanceToSegment(
  point: FanoSpatialCoordinate,
  segmentStart: FanoSpatialCoordinate,
  segmentEnd: FanoSpatialCoordinate,
): number {
  const segment = subtract(segmentEnd, segmentStart);
  const pointOffset = subtract(point, segmentStart);
  const segmentLengthSquared = dot(segment, segment);

  if (segmentLengthSquared === 0) {
    return distance(point, segmentStart);
  }

  const projection = clamp(dot(pointOffset, segment) / segmentLengthSquared, 0, 1);
  const closestPoint = add(segmentStart, scale(segment, projection));

  return distance(point, closestPoint);
}

function minimumPositiveSegmentLength(polyline: FanoSpatialCoordinate[]): number {
  const segmentLengths: number[] = [];

  for (let index = 0; index < polyline.length - 1; index += 1) {
    const segmentLength = distance(polyline[index], polyline[index + 1]);

    if (segmentLength > 0) {
      segmentLengths.push(segmentLength);
    }
  }

  if (!segmentLengths.length) {
    return 1;
  }

  return Math.min(...segmentLengths);
}

function positivePart(value: number): number {
  return Math.max(0, value);
}

function add(
  left: FanoSpatialCoordinate,
  right: FanoSpatialCoordinate,
): FanoSpatialCoordinate {
  return {
    x: left.x + right.x,
    y: left.y + right.y,
    z: left.z + right.z,
  };
}

function subtract(
  left: FanoSpatialCoordinate,
  right: FanoSpatialCoordinate,
): FanoSpatialCoordinate {
  return {
    x: left.x - right.x,
    y: left.y - right.y,
    z: left.z - right.z,
  };
}

function scale(
  coordinate: FanoSpatialCoordinate,
  factor: number,
): FanoSpatialCoordinate {
  return {
    x: coordinate.x * factor,
    y: coordinate.y * factor,
    z: coordinate.z * factor,
  };
}

function dot(
  left: FanoSpatialCoordinate,
  right: FanoSpatialCoordinate,
): number {
  return left.x * right.x + left.y * right.y + left.z * right.z;
}

function distance(
  left: FanoSpatialCoordinate,
  right: FanoSpatialCoordinate,
): number {
  return Math.sqrt(
    (left.x - right.x) * (left.x - right.x) +
      (left.y - right.y) * (left.y - right.y) +
      (left.z - right.z) * (left.z - right.z),
  );
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function cloneCoordinate(coordinate: FanoSpatialCoordinate): FanoSpatialCoordinate {
  return { x: coordinate.x, y: coordinate.y, z: coordinate.z };
}

function getNode(
  nodeRows: FanoCarrierGraphNodeRow[],
  nodeId: string,
): FanoCarrierGraphNodeRow {
  const nodeRow = nodeRows.find((row) => row.nodeId === nodeId);

  if (!nodeRow) {
    throw new Error(`No node row found for ${nodeId}`);
  }

  return nodeRow;
}

function getEdge(
  edgeRows: FanoCarrierGraphEdgeRow[],
  edgeId: string,
): FanoCarrierGraphEdgeRow {
  const edgeRow = edgeRows.find((row) => row.edgeId === edgeId);

  if (!edgeRow) {
    throw new Error(`No edge row found for ${edgeId}`);
  }

  return edgeRow;
}

function getAnchor(
  spatialAnchorRows: FanoSpatialAnchorRow[],
  nodeId: string,
): FanoSpatialAnchorRow {
  const anchorRow = spatialAnchorRows.find((row) => row.nodeId === nodeId);

  if (!anchorRow) {
    throw new Error(`No spatial anchor found for ${nodeId}`);
  }

  return anchorRow;
}

function getSupportFunction(
  supportFunctionRows: FanoSpatialSupportFunctionRow[],
  supportFunctionId: string,
): FanoSpatialSupportFunctionRow {
  const supportFunctionRow = supportFunctionRows.find(
    (row) => row.supportFunctionId === supportFunctionId,
  );

  if (!supportFunctionRow) {
    throw new Error(`No support function found for ${supportFunctionId}`);
  }

  return supportFunctionRow;
}

function getEnvelope(
  childEmissionEnvelopes: FanoChildEmissionEnvelopeRow[],
  envelopeId: string,
): FanoChildEmissionEnvelopeRow {
  const envelope = childEmissionEnvelopes.find(
    (row) => row.envelopeId === envelopeId,
  );

  if (!envelope) {
    throw new Error(`No child emission envelope found for ${envelopeId}`);
  }

  return envelope;
}

function getActivationWeight(
  activationWeightRows: Array<{
    ownerKind: 'node' | 'edge';
    ownerId: string;
    activationStatus: FanoCarrierGraphActivationStatus;
    weight: number;
  }>,
  ownerKind: 'node' | 'edge',
  ownerId: string,
): {
  activationStatus: FanoCarrierGraphActivationStatus;
  weight: number;
} {
  const row = activationWeightRows.find(
    (candidate) =>
      candidate.ownerKind === ownerKind && candidate.ownerId === ownerId,
  );

  if (!row) {
    throw new Error(`No activation weight row found for ${ownerKind}:${ownerId}`);
  }

  return row;
}

function getCarrierTransport(
  carrierTransportRows: FanoCarrierTransportRow[],
  edgeId: string,
): FanoCarrierTransportRow {
  const row = carrierTransportRows.find(
    (candidate) => candidate.edgeId === edgeId,
  );

  if (!row) {
    throw new Error(`No carrier transport row found for ${edgeId}`);
  }

  return row;
}

function lastIdSegment(value: string): string {
  const segments = value.split(':');

  return segments[segments.length - 1] ?? value;
}

function expectCount(
  issues: FanoOctonionicSpatialSupportProjectionV0Issue[],
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
): FanoOctonionicSpatialSupportProjectionV0Issue {
  return { code, message };
}
