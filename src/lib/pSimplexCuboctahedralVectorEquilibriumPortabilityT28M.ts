import { createSeedShape } from '../data/seeds';
import type { Cell, CellTopology, Face, SeedKey, Shape, Vec3, VertexId } from '../types/geometry';
import { applyAmboDissection, canApplyAmboDissection } from './ambo';
import {
  deriveCellEdges,
  getCellTopologySignature,
  type CellTopologySignature,
} from './topologySignature';
import {
  buildOctonionVsA3MedialCarrierDiscriminatorV0Report,
  type A3FlagId,
  type A3MedialFlagRow,
  type A3PrimalLabel,
  type OctonionVsA3MedialCarrierDiscriminatorV0Report,
  type SquareHolonomyRow,
  type TriangleClosureRow,
} from './octonionVsA3MedialCarrierDiscriminatorV0';
import {
  buildMedialDualEquivariantCarrierPolicyModelCardV0Report,
  type MedialDualEquivariantCarrierPolicyModelCardV0Report,
} from './medialDualEquivariantCarrierPolicyModelCardV0';

export type PSimplexCuboctahedralVectorEquilibriumPortabilityT28MSummaryVerdict =
  | 'T28-M-cuboctahedral-vector-equilibrium-eligible'
  | 'T28-M-dies-at-cuboctahedron-topology'
  | 'T28-M-dies-at-root-flag-identity'
  | 'T28-M-dies-at-antipodal-root-pairing'
  | 'T28-M-dies-at-central-hexagon-planes'
  | 'T28-M-dies-at-triangle-closure'
  | 'T28-M-dies-at-square-holonomy'
  | 'T28-M-dies-at-metric-equilibrium'
  | 'T28-M-dies-at-vertex-figure-alternation'
  | 'T28-M-dies-at-provenance-bridge'
  | 'T28-M-under-specified-restoration-control'
  | 'T28-M-boundary-failed';

export type PSimplexT28MLineageId =
  | 'octa-g1-cuboctahedron-core'
  | 'cube-g1-cuboctahedron-core'
  | 'tetra-g2-cuboctahedron-core';
export type PSimplexT28MBranchRef = 'wgate/arf-w1-root-frame-v0';
export type PSimplexT28MPreflightStatus = 'preflight-pass' | 'preflight-fail' | 'warning-only';
export type PSimplexT28MDefectClass =
  | 'cuboctahedron-topology-defect'
  | 'root-flag-identity-defect'
  | 'antipodal-root-pairing-defect'
  | 'central-hexagon-plane-defect'
  | 'triangle-closure-defect'
  | 'square-holonomy-defect'
  | 'metric-equilibrium-defect'
  | 'vertex-figure-alternation-defect'
  | 'provenance-bridge-defect'
  | 'projection-loss-defect';
export type PSimplexT28MBridgeAuthority =
  | 'canonical-preflight-convention-only'
  | 'natural-geometric-recovery'
  | 'lineage-edge-derived';

export interface PSimplexT28MParentEvidenceRow {
  parentId:
    | 'seed-shape-factory'
    | 'ambo-dissection-engine'
    | 'topology-signature-engine'
    | 'octonion-vs-a3-medial-carrier-discriminator-v0'
    | 'medial-dual-equivariant-carrier-policy-model-card-v0';
  builderName: string;
  importStatus: 'imported' | 'failed';
  ok: boolean;
  diagnosticScope: string | null;
  rowLevelEvidenceUsed: string[];
  usedFor:
    | 'source-lineage-construction'
    | 'cuboctahedron-topology-and-metric'
    | 'a3-root-flag-closure-holonomy'
    | 'policy-boundary-and-provenance';
}

export interface PSimplexT28MSourceLineageRow {
  lineageId: PSimplexT28MLineageId;
  seedKey: 'tetrahedron' | 'octahedron' | 'cube';
  operationPath: string[];
  sourceOperationChain: string[];
  sourceCellTopologyPath: string[];
  targetCellId: string | null;
  targetGenerationDepth: number | null;
  targetKind: string | null;
  targetTopology: string | null;
  sourceOperation: string | null;
  parentCellId: string | null;
  latestGenerationId: string | null;
  latestGenerationCreatedCellIds: string[];
  selectionRule:
    | 'kind-core-topology-cuboctahedron-generation-sourceOperation-latestGeneration-readiness-enabled'
    | 'missing-target';
  readinessStatus: string | null;
  topologySignatureStatus: 'cuboctahedron-signature-pass' | 'cuboctahedron-signature-fail';
  canApplyAmboToTarget: boolean;
  lineageDistinctnessKey: string;
  lineageStatus: 'selected-cuboctahedron-core' | 'missing-cuboctahedron-core';
}

export interface PSimplexT28MCuboctahedronTopologyRow {
  lineageId: PSimplexT28MLineageId;
  cellId: string | null;
  topology: string | null;
  vertexCount: number;
  edgeCount: number;
  faceCount: number;
  triangularFaceCount: number;
  squareFaceCount: number;
  faceSizeHistogram: Record<number, number>;
  vertexDegreeHistogram: Record<number, number>;
  hasOrderedFaces: boolean;
  hasValidDerivedEdges: boolean;
  hasValidVertexIncidentRings: boolean;
  readinessStatus: string | null;
  topologyStatus: 'cuboctahedron-verified' | 'cuboctahedron-missing-or-malformed';
}

export interface PSimplexT28MRootFlagVertexBridgeRow {
  lineageId: PSimplexT28MLineageId;
  canonicalVertexIndex: number;
  cellVertexId: string | null;
  flagId: A3FlagId;
  sharedPrimalVertex: A3PrimalLabel;
  omittedPrimalVertex: A3PrimalLabel;
  rootCoordinate: Record<A3PrimalLabel, -1 | 0 | 1>;
  bridgeBasis: 'canonical-order-with-explicit-boundary';
  bridgeAuthority: PSimplexT28MBridgeAuthority;
  bridgeStatus: 'bridged' | 'missing-cell-vertex' | 'missing-flag-token';
}

export interface PSimplexT28MAntipodalRootPairRow {
  pairId: string;
  leftFlagId: A3FlagId;
  rightFlagId: A3FlagId;
  bridgeVertexPairs: Array<{
    lineageId: PSimplexT28MLineageId;
    leftVertexId: string | null;
    rightVertexId: string | null;
  }>;
  rootCoordinateSum: Record<A3PrimalLabel, number>;
  antipodalStatus: 'clean-antipodal-pair' | 'missing-antipodal-pair' | 'non-opposite-root-coordinates';
}

export interface PSimplexT28MCentralHexagonRow {
  hexagonId: string;
  pivotPrimalVertex: A3PrimalLabel;
  flagIds: A3FlagId[];
  internalEdgePairs: Array<[A3FlagId, A3FlagId]>;
  antipodalPairIds: string[];
  degreeHistogram: Record<number, number>;
  connectedCycle: boolean;
  hexagonStatus: 'central-hexagon-cycle' | 'central-hexagon-defect';
}

export interface PSimplexT28MCentralHexagonIncidenceRow {
  flagId: A3FlagId;
  incidentHexagonIds: string[];
  incidentHexagonCount: number;
  incidenceStatus: 'two-hexagon-incidence' | 'incidence-defect';
}

export interface PSimplexT28MTriangleClosureBridgeRow {
  lineageId: PSimplexT28MLineageId;
  triangleFaceId: string | null;
  faceVertexIds: string[];
  triangleId: string | null;
  mappedFlagTriple: A3FlagId[];
  actualFaceFlagIds: A3FlagId[];
  actualFaceFlagSetKey: string;
  mappedFlagSetKey: string;
  actualFaceMatchesMappedFlags: boolean;
  orderedProductIds: string[];
  discriminatorOrderedProductCount: number;
  closurePassCount: number;
  closureFailCount: number;
  faceFlagBridgeStatus:
    | 'actual-face-flags-match-discriminator-triangle'
    | 'actual-face-flags-do-not-match-discriminator-triangle'
    | 'missing-vertex-flag-bridge'
    | 'canonical-index-only-not-accepted';
  bridgeBasis: 'actual-face-vertex-flags-plus-discriminator-row' | 'canonical-index-only';
  closureBridgeStatus: 'triangle-closure-bridged' | 'triangle-closure-defect';
}

export interface PSimplexT28MSquareHolonomyBridgeRow {
  lineageId: PSimplexT28MLineageId;
  squareFaceId: string | null;
  faceVertexIds: string[];
  squareCycleId: string | null;
  mappedFlagCycle: A3FlagId[];
  actualFaceFlagIds: A3FlagId[];
  actualFaceFlagSetKey: string;
  mappedFlagSetKey: string;
  actualFaceMatchesMappedFlags: boolean;
  orientationVariantIds: string[];
  holonomyVariantCount: number;
  holonomyPassCount: number;
  holonomyFailCount: number;
  leftAssociatedProducts: string[];
  faceFlagBridgeStatus:
    | 'actual-face-flags-match-discriminator-square'
    | 'actual-face-flags-do-not-match-discriminator-square'
    | 'missing-vertex-flag-bridge'
    | 'canonical-index-only-not-accepted';
  bridgeBasis: 'actual-face-vertex-flags-plus-discriminator-row' | 'canonical-index-only';
  holonomyBridgeStatus: 'square-holonomy-bridged' | 'square-holonomy-defect';
}

export interface PSimplexT28MMetricEquilibriumRow {
  lineageId: PSimplexT28MLineageId;
  cellId: string | null;
  centroid: Vec3;
  vertexCount: number;
  edgeCount: number;
  radiusValues: number[];
  edgeLengthValues: number[];
  minRadius: number;
  maxRadius: number;
  radiusSpread: number;
  minEdgeLength: number;
  maxEdgeLength: number;
  edgeLengthSpread: number;
  meanRadius: number;
  meanEdgeLength: number;
  radiusEdgeDifference: number;
  tolerance: number;
  fallbackTolerance: number;
  metricStatus:
    | 'r-equals-edge-preserved'
    | 'r-equals-edge-preserved-with-fallback-tolerance'
    | 'metric-equilibrium-defect';
}

export interface PSimplexT28MVertexFigureAlternationRow {
  lineageId: PSimplexT28MLineageId;
  vertexId: string | null;
  incidentFaceIds: string[];
  incidentFaceSizes: number[];
  cyclicFaceSizeSequence: number[];
  triangleIncidentCount: number;
  squareIncidentCount: number;
  incidentFaceGraphDegreeHistogram: Record<number, number>;
  alternationStatus: '3-4-3-4-vertex-figure' | 'vertex-figure-defect';
}

export interface PSimplexT28MProvenanceBridgeRow {
  rowId: 'tetra-octa-cube-cuboctahedral-provenance-bridge';
  lineageIds: PSimplexT28MLineageId[];
  distinctSeedKeys: SeedKey[];
  distinctOperationPaths: string[];
  lineageDistinctnessKeys: string[];
  distinctLineageDistinctnessKeyCount: number;
  parentCuboctahedronBridgeStatuses: string[];
  policyCandidateStatus: string;
  cubePrimalSourcehoodStatus: string;
  provenanceStatus:
    | 'three-distinct-cuboctahedral-provenance-paths-with-cube-primal-sourcehood-unsolved'
    | 'provenance-defect';
}

export interface PSimplexT28MProjectionLossRow {
  projectionId: 'signed-fano-lift' | 'scalar-tuple' | 'topology-only';
  retainedData: string[];
  lostData: string[];
  restorationDependency: string[];
  projectionLossStatus:
    | 'lossy-but-restorable-with-provenance'
    | 'structurally-destructive'
    | 'lossless-for-current-preflight';
  blocksPreflight: boolean;
}

export interface PSimplexT28MRestorationControlRow {
  controlId: string;
  defectClass: PSimplexT28MDefectClass;
  controlType: 'detect-and-block' | 'restore-with-provenance' | 'boundary-warning';
  passLaw: string;
  requiredEvidence: string[];
  controlStatus: 'restoration-control-defined' | 'restoration-control-under-specified';
}

export interface PSimplexT28MDefectRow {
  defectClass: PSimplexT28MDefectClass;
  detected: boolean;
  blockingStatus: 'not-detected' | 'blocking-if-detected';
  restorationControlId: string;
  evidence: string;
}

export interface PSimplexT28MPortabilityVerdictRow {
  axisId:
    | 'source-lineage'
    | 'cuboctahedron-topology'
    | 'root-flag-identity'
    | 'antipodal-root-pairing'
    | 'central-hexagon-planes'
    | 'triangle-closure'
    | 'square-holonomy'
    | 'metric-equilibrium'
    | 'vertex-figure-alternation'
    | 'provenance-bridge'
    | 'restoration-control'
    | 'projection-loss';
  status: PSimplexT28MPreflightStatus;
  evidence: string;
}

export interface PSimplexT28MBoundaryRow {
  boundaryId:
    | 'not-residual-law-proof'
    | 'not-K3-T-portability-proof'
    | 'not-mature-field'
    | 'not-field-world-generalization'
    | 'not-FieldCue'
    | 'not-semantic-naming'
    | 'not-topology-authorization'
    | 'not-route'
    | 'not-gate'
    | 'not-corridor'
    | 'not-runtime'
    | 'not-field-resurrection'
    | 'not-universal-octonions'
    | 'not-cube-primal-sourcehood'
    | 'not-natural-geometric-flag-recovery'
    | 'not-canonical-order-as-intrinsic-identity'
    | 'not-shape-mutation'
    | 'not-packet-write'
    | 'not-ui';
  statement: string;
  enforced: true;
}

export interface PSimplexT28MFalsifierRow {
  falsifierId:
    | 'F1'
    | 'F2'
    | 'F3'
    | 'F4'
    | 'F5'
    | 'F6'
    | 'F7'
    | 'F8'
    | 'F9'
    | 'F10'
    | 'F11'
    | 'F12'
    | 'F13'
    | 'F14'
    | 'F15'
    | 'F16'
    | 'F17'
    | 'F18'
    | 'F19'
    | 'F20'
    | 'F21';
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export interface PSimplexCuboctahedralVectorEquilibriumPortabilityT28MReport {
  method: 'p-simplex-cuboctahedral-vector-equilibrium-portability-t28m';
  diagnosticScope: 'cuboctahedral-structural-observability-preflight-only';
  branchRef: PSimplexT28MBranchRef;
  parentEvidenceRows: PSimplexT28MParentEvidenceRow[];
  sourceLineageRows: PSimplexT28MSourceLineageRow[];
  cuboctahedronTopologyRows: PSimplexT28MCuboctahedronTopologyRow[];
  rootFlagVertexBridgeRows: PSimplexT28MRootFlagVertexBridgeRow[];
  antipodalRootPairRows: PSimplexT28MAntipodalRootPairRow[];
  centralHexagonRows: PSimplexT28MCentralHexagonRow[];
  centralHexagonIncidenceRows: PSimplexT28MCentralHexagonIncidenceRow[];
  triangleClosureBridgeRows: PSimplexT28MTriangleClosureBridgeRow[];
  squareHolonomyBridgeRows: PSimplexT28MSquareHolonomyBridgeRow[];
  metricEquilibriumRows: PSimplexT28MMetricEquilibriumRow[];
  vertexFigureAlternationRows: PSimplexT28MVertexFigureAlternationRow[];
  provenanceBridgeRows: PSimplexT28MProvenanceBridgeRow[];
  projectionLossRows: PSimplexT28MProjectionLossRow[];
  restorationControlRows: PSimplexT28MRestorationControlRow[];
  defectRows: PSimplexT28MDefectRow[];
  portabilityVerdictRows: PSimplexT28MPortabilityVerdictRow[];
  boundaryRows: PSimplexT28MBoundaryRow[];
  falsifierRows: PSimplexT28MFalsifierRow[];
  summaryVerdict: PSimplexCuboctahedralVectorEquilibriumPortabilityT28MSummaryVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface CuboctahedralLineageContext {
  lineageId: PSimplexT28MLineageId;
  seedKey: 'tetrahedron' | 'octahedron' | 'cube';
  operationPath: string[];
  sourceOperationChain: string[];
  sourceCellTopologyPath: string[];
  shape: Shape | null;
  cell: Cell | null;
  signature: CellTopologySignature | null;
  latestGenerationId: string | null;
  latestGenerationCreatedCellIds: string[];
  canApplyAmboToTarget: boolean;
}

interface CanonicalTriangleGroup {
  triangleId: string;
  rows: TriangleClosureRow[];
  flagIds: A3FlagId[];
}

interface CanonicalSquareGroup {
  squareCycleId: string;
  rows: SquareHolonomyRow[];
  flagIds: A3FlagId[];
}

const METHOD = 'p-simplex-cuboctahedral-vector-equilibrium-portability-t28m' as const;
const DIAGNOSTIC_SCOPE = 'cuboctahedral-structural-observability-preflight-only' as const;
const BRANCH_REF: PSimplexT28MBranchRef = 'wgate/arf-w1-root-frame-v0';
const NUMERIC_TOLERANCE = 1e-9;
const FALLBACK_GEOMETRY_TOLERANCE = 1e-6;
const PRIMAL_LABELS: readonly A3PrimalLabel[] = ['A', 'B', 'C', 'D'];
const EXPECTED_COUNTS = {
  sourceLineageRows: 3,
  cuboctahedronTopologyRows: 3,
  rootFlagVertexBridgeRows: 36,
  antipodalRootPairRows: 6,
  centralHexagonRows: 4,
  centralHexagonIncidenceRows: 12,
  triangleClosureBridgeRows: 24,
  squareHolonomyBridgeRows: 18,
  metricEquilibriumRows: 3,
  vertexFigureAlternationRows: 36,
  projectionLossRows: 3,
  restorationControlRows: 10,
  defectRows: 10,
} as const;
const REQUIRED_BOUNDARY_IDS = [
  'not-residual-law-proof',
  'not-K3-T-portability-proof',
  'not-mature-field',
  'not-field-world-generalization',
  'not-FieldCue',
  'not-semantic-naming',
  'not-topology-authorization',
  'not-route',
  'not-gate',
  'not-corridor',
  'not-runtime',
  'not-field-resurrection',
  'not-universal-octonions',
  'not-cube-primal-sourcehood',
  'not-natural-geometric-flag-recovery',
  'not-canonical-order-as-intrinsic-identity',
  'not-shape-mutation',
  'not-packet-write',
  'not-ui',
] as const;
const REQUIRED_FALSIFIER_IDS = [
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'F13',
  'F14',
  'F15',
  'F16',
  'F17',
  'F18',
  'F19',
  'F20',
  'F21',
] as const;
const ALLOWED_SUMMARY_VERDICTS: readonly PSimplexCuboctahedralVectorEquilibriumPortabilityT28MSummaryVerdict[] = [
  'T28-M-cuboctahedral-vector-equilibrium-eligible',
  'T28-M-dies-at-cuboctahedron-topology',
  'T28-M-dies-at-root-flag-identity',
  'T28-M-dies-at-antipodal-root-pairing',
  'T28-M-dies-at-central-hexagon-planes',
  'T28-M-dies-at-triangle-closure',
  'T28-M-dies-at-square-holonomy',
  'T28-M-dies-at-metric-equilibrium',
  'T28-M-dies-at-vertex-figure-alternation',
  'T28-M-dies-at-provenance-bridge',
  'T28-M-under-specified-restoration-control',
  'T28-M-boundary-failed',
];

export function buildPSimplexCuboctahedralVectorEquilibriumPortabilityT28MReport(): PSimplexCuboctahedralVectorEquilibriumPortabilityT28MReport {
  const discriminatorReport = buildOctonionVsA3MedialCarrierDiscriminatorV0Report();
  const policyReport = buildMedialDualEquivariantCarrierPolicyModelCardV0Report();
  const contexts = buildCuboctahedralLineageContexts();
  const parentEvidenceRows = buildParentEvidenceRows(discriminatorReport, policyReport);
  const sourceLineageRows = contexts.map(buildSourceLineageRow);
  const cuboctahedronTopologyRows = contexts.map(buildCuboctahedronTopologyRow);
  const rootFlagVertexBridgeRows = buildRootFlagVertexBridgeRows(contexts, discriminatorReport.flagRows);
  const vertexFlagMapByLineage = buildVertexFlagMapByLineage(rootFlagVertexBridgeRows);
  const antipodalRootPairRows = buildAntipodalRootPairRows(rootFlagVertexBridgeRows, discriminatorReport.flagRows);
  const centralHexagonRows = buildCentralHexagonRows(discriminatorReport.flagRows, antipodalRootPairRows);
  const centralHexagonIncidenceRows = buildCentralHexagonIncidenceRows(discriminatorReport.flagRows, centralHexagonRows);
  const triangleClosureBridgeRows = buildTriangleClosureBridgeRows(
    contexts,
    discriminatorReport.triangleClosureRows,
    vertexFlagMapByLineage,
  );
  const squareHolonomyBridgeRows = buildSquareHolonomyBridgeRows(
    contexts,
    discriminatorReport.squareHolonomyRows,
    vertexFlagMapByLineage,
  );
  const metricEquilibriumRows = contexts.map(buildMetricEquilibriumRow);
  const vertexFigureAlternationRows = buildVertexFigureAlternationRows(contexts);
  const provenanceBridgeRows = buildProvenanceBridgeRows(sourceLineageRows, discriminatorReport, policyReport);
  const projectionLossRows = buildProjectionLossRows();
  const restorationControlRows = buildRestorationControlRows();
  const defectRows = buildDefectRows({
    cuboctahedronTopologyRows,
    rootFlagVertexBridgeRows,
    antipodalRootPairRows,
    centralHexagonRows,
    centralHexagonIncidenceRows,
    triangleClosureBridgeRows,
    squareHolonomyBridgeRows,
    metricEquilibriumRows,
    vertexFigureAlternationRows,
    provenanceBridgeRows,
    projectionLossRows,
    restorationControlRows,
  });
  const portabilityVerdictRows = buildPortabilityVerdictRows({
    sourceLineageRows,
    cuboctahedronTopologyRows,
    rootFlagVertexBridgeRows,
    antipodalRootPairRows,
    centralHexagonRows,
    centralHexagonIncidenceRows,
    triangleClosureBridgeRows,
    squareHolonomyBridgeRows,
    metricEquilibriumRows,
    vertexFigureAlternationRows,
    provenanceBridgeRows,
    projectionLossRows,
    restorationControlRows,
  });
  const boundaryRows = buildBoundaryRows();
  const preliminarySummaryVerdict = classifySummaryVerdict({
    boundaryFailed: boundaryRows.some((row) => !row.enforced),
    sourceLineageRows,
    cuboctahedronTopologyRows,
    rootFlagVertexBridgeRows,
    antipodalRootPairRows,
    centralHexagonRows,
    centralHexagonIncidenceRows,
    triangleClosureBridgeRows,
    squareHolonomyBridgeRows,
    metricEquilibriumRows,
    vertexFigureAlternationRows,
    provenanceBridgeRows,
    restorationControlRows,
    defectRows,
  });
  const falsifierRows = buildFalsifierRows({
    parentEvidenceRows,
    sourceLineageRows,
    cuboctahedronTopologyRows,
    rootFlagVertexBridgeRows,
    antipodalRootPairRows,
    centralHexagonRows,
    centralHexagonIncidenceRows,
    triangleClosureBridgeRows,
    squareHolonomyBridgeRows,
    metricEquilibriumRows,
    vertexFigureAlternationRows,
    provenanceBridgeRows,
    projectionLossRows,
    restorationControlRows,
    defectRows,
    boundaryRows,
    summaryVerdict: preliminarySummaryVerdict,
  });
  const boundaryFailed = falsifierRows.some((row) => boundaryFalsifierId(row.falsifierId) && row.triggered);
  const summaryVerdict = classifySummaryVerdict({
    boundaryFailed,
    sourceLineageRows,
    cuboctahedronTopologyRows,
    rootFlagVertexBridgeRows,
    antipodalRootPairRows,
    centralHexagonRows,
    centralHexagonIncidenceRows,
    triangleClosureBridgeRows,
    squareHolonomyBridgeRows,
    metricEquilibriumRows,
    vertexFigureAlternationRows,
    provenanceBridgeRows,
    restorationControlRows,
    defectRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    sourceLineageRows,
    cuboctahedronTopologyRows,
    rootFlagVertexBridgeRows,
    antipodalRootPairRows,
    centralHexagonRows,
    centralHexagonIncidenceRows,
    triangleClosureBridgeRows,
    squareHolonomyBridgeRows,
    metricEquilibriumRows,
    vertexFigureAlternationRows,
    provenanceBridgeRows,
    projectionLossRows,
    restorationControlRows,
    defectRows,
    portabilityVerdictRows,
    boundaryRows,
    falsifierRows,
    summaryVerdict,
  });

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    parentEvidenceRows,
    sourceLineageRows,
    cuboctahedronTopologyRows,
    rootFlagVertexBridgeRows,
    antipodalRootPairRows,
    centralHexagonRows,
    centralHexagonIncidenceRows,
    triangleClosureBridgeRows,
    squareHolonomyBridgeRows,
    metricEquilibriumRows,
    vertexFigureAlternationRows,
    provenanceBridgeRows,
    projectionLossRows,
    restorationControlRows,
    defectRows,
    portabilityVerdictRows,
    boundaryRows,
    falsifierRows,
    summaryVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0,
  };
}

function buildParentEvidenceRows(
  discriminatorReport: OctonionVsA3MedialCarrierDiscriminatorV0Report,
  policyReport: MedialDualEquivariantCarrierPolicyModelCardV0Report,
): PSimplexT28MParentEvidenceRow[] {
  return [
    {
      parentId: 'seed-shape-factory',
      builderName: 'createSeedShape',
      importStatus: 'imported',
      ok: true,
      diagnosticScope: 'tetra-octa-cube-seed-shape-factory',
      rowLevelEvidenceUsed: ['seed cells', 'seed faces', 'seed vertex positions'],
      usedFor: 'source-lineage-construction',
    },
    {
      parentId: 'ambo-dissection-engine',
      builderName: 'applyAmboDissection / canApplyAmboDissection',
      importStatus: 'imported',
      ok: true,
      diagnosticScope: 'ambo-dissection-core-selection',
      rowLevelEvidenceUsed: ['createdCellIds', 'sourceOperation', 'generationDepth', 'core cells'],
      usedFor: 'source-lineage-construction',
    },
    {
      parentId: 'topology-signature-engine',
      builderName: 'getCellTopologySignature / deriveCellEdges',
      importStatus: 'imported',
      ok: true,
      diagnosticScope: 'cell-topology-signature-and-derived-edge-readiness',
      rowLevelEvidenceUsed: [
        'vertexCount',
        'edgeCount',
        'faceCount',
        'faceSizeHistogram',
        'vertexDegreeHistogram',
        'readinessStatus',
      ],
      usedFor: 'cuboctahedron-topology-and-metric',
    },
    {
      parentId: 'octonion-vs-a3-medial-carrier-discriminator-v0',
      builderName: 'buildOctonionVsA3MedialCarrierDiscriminatorV0Report',
      importStatus: discriminatorReport ? 'imported' : 'failed',
      ok: discriminatorReport.ok === true,
      diagnosticScope: discriminatorReport.diagnosticScope,
      rowLevelEvidenceUsed: [
        'flagRows',
        'triangleClosureRows',
        'squareHolonomyRows',
        'cuboctahedronBridge',
        'dualOctaCubeProvenance',
      ],
      usedFor: 'a3-root-flag-closure-holonomy',
    },
    {
      parentId: 'medial-dual-equivariant-carrier-policy-model-card-v0',
      builderName: 'buildMedialDualEquivariantCarrierPolicyModelCardV0Report',
      importStatus: policyReport ? 'imported' : 'failed',
      ok: policyReport.ok === true,
      diagnosticScope: policyReport.modelCardScope,
      rowLevelEvidenceUsed: ['sourceDiagnosticOk', 'policyCandidateStatus', 'forbiddenPromotions', 'nextProofObligations'],
      usedFor: 'policy-boundary-and-provenance',
    },
  ];
}

function buildCuboctahedralLineageContexts(): CuboctahedralLineageContext[] {
  return [buildOctaG1Context(), buildCubeG1Context(), buildTetraG2Context()];
}

function buildOctaG1Context(): CuboctahedralLineageContext {
  const seedShape = createSeedShape('octahedron');
  const seedCell = selectSeedCell(seedShape, 'octahedron');
  const shape = seedCell && canApplyAmboDissection(seedShape, seedCell.id)
    ? applyAmboDissection(seedShape, seedCell.id)
    : null;

  return buildLineageContext({
    lineageId: 'octa-g1-cuboctahedron-core',
    seedKey: 'octahedron',
    operationPath: ['octahedron seed', 'g1 cuboctahedron core'],
    sourceOperationChain: ['seed:octahedron', 'ambo-dissection:octahedron->cuboctahedron'],
    sourceCellTopologyPath: ['octahedron', 'cuboctahedron'],
    shape,
    generationDepth: 1,
  });
}

function buildCubeG1Context(): CuboctahedralLineageContext {
  const seedShape = createSeedShape('cube');
  const seedCell = selectSeedCell(seedShape, 'cube');
  const shape = seedCell && canApplyAmboDissection(seedShape, seedCell.id)
    ? applyAmboDissection(seedShape, seedCell.id)
    : null;

  return buildLineageContext({
    lineageId: 'cube-g1-cuboctahedron-core',
    seedKey: 'cube',
    operationPath: ['cube seed', 'g1 cuboctahedron core'],
    sourceOperationChain: ['seed:cube', 'ambo-dissection:cube->cuboctahedron'],
    sourceCellTopologyPath: ['cube', 'cuboctahedron'],
    shape,
    generationDepth: 1,
  });
}

function buildTetraG2Context(): CuboctahedralLineageContext {
  const seedShape = createSeedShape('tetrahedron');
  const seedCell = selectSeedCell(seedShape, 'tetrahedron');
  const shapeG1 = seedCell && canApplyAmboDissection(seedShape, seedCell.id)
    ? applyAmboDissection(seedShape, seedCell.id)
    : null;
  const octaCore = shapeG1 ? selectLatestCoreCellByCombinedRule(shapeG1, 'octahedron', 1) : null;
  const shapeG2 = shapeG1 && octaCore && canApplyAmboDissection(shapeG1, octaCore.id)
    ? applyAmboDissection(shapeG1, octaCore.id)
    : null;

  return buildLineageContext({
    lineageId: 'tetra-g2-cuboctahedron-core',
    seedKey: 'tetrahedron',
    operationPath: ['tetrahedron seed', 'g1 octahedron core', 'g2 cuboctahedron core'],
    sourceOperationChain: [
      'seed:tetrahedron',
      'ambo-dissection:tetrahedron->octahedron',
      'ambo-dissection:octahedron->cuboctahedron',
    ],
    sourceCellTopologyPath: ['tetrahedron', 'octahedron', 'cuboctahedron'],
    shape: shapeG2,
    generationDepth: 2,
  });
}

function buildLineageContext(args: {
  lineageId: PSimplexT28MLineageId;
  seedKey: 'tetrahedron' | 'octahedron' | 'cube';
  operationPath: string[];
  sourceOperationChain: string[];
  sourceCellTopologyPath: string[];
  shape: Shape | null;
  generationDepth: number;
}): CuboctahedralLineageContext {
  const cell = args.shape ? selectLatestCoreCellByCombinedRule(args.shape, 'cuboctahedron', args.generationDepth) : null;
  const signature = args.shape && cell ? getCellTopologySignature(args.shape, cell) : null;
  const latestGeneration = args.shape ? latestGenerationForDepth(args.shape, args.generationDepth) : null;

  return {
    lineageId: args.lineageId,
    seedKey: args.seedKey,
    operationPath: args.operationPath,
    sourceOperationChain: args.sourceOperationChain,
    sourceCellTopologyPath: args.sourceCellTopologyPath,
    shape: args.shape,
    cell,
    signature,
    latestGenerationId: latestGeneration?.id ?? null,
    latestGenerationCreatedCellIds: latestGeneration?.createdCellIds ?? [],
    canApplyAmboToTarget: Boolean(args.shape && cell && canApplyAmboDissection(args.shape, cell.id)),
  };
}

function buildSourceLineageRow(context: CuboctahedralLineageContext): PSimplexT28MSourceLineageRow {
  return {
    lineageId: context.lineageId,
    seedKey: context.seedKey,
    operationPath: [...context.operationPath],
    sourceOperationChain: [...context.sourceOperationChain],
    sourceCellTopologyPath: [...context.sourceCellTopologyPath],
    targetCellId: context.cell?.id ?? null,
    targetGenerationDepth: context.cell?.generationDepth ?? null,
    targetKind: context.cell?.kind ?? null,
    targetTopology: context.cell?.topology ?? null,
    sourceOperation: context.cell?.sourceOperation ?? null,
    parentCellId: context.cell?.parentCellId ?? null,
    latestGenerationId: context.latestGenerationId,
    latestGenerationCreatedCellIds: [...context.latestGenerationCreatedCellIds],
    selectionRule: context.cell
      ? 'kind-core-topology-cuboctahedron-generation-sourceOperation-latestGeneration-readiness-enabled'
      : 'missing-target',
    readinessStatus: context.signature?.readinessStatus ?? null,
    topologySignatureStatus: cuboctahedronSignaturePass(context.signature)
      ? 'cuboctahedron-signature-pass'
      : 'cuboctahedron-signature-fail',
    canApplyAmboToTarget: context.canApplyAmboToTarget,
    lineageDistinctnessKey: lineageDistinctnessKey(context),
    lineageStatus: context.cell ? 'selected-cuboctahedron-core' : 'missing-cuboctahedron-core',
  };
}

function buildCuboctahedronTopologyRow(context: CuboctahedralLineageContext): PSimplexT28MCuboctahedronTopologyRow {
  const faces = context.shape && context.cell ? getCellFaces(context.shape, context.cell) : [];
  const signature = context.signature;
  const pass = cuboctahedronSignaturePass(signature);

  return {
    lineageId: context.lineageId,
    cellId: context.cell?.id ?? null,
    topology: signature?.topology ?? null,
    vertexCount: signature?.vertexCount ?? 0,
    edgeCount: signature?.edgeCount ?? 0,
    faceCount: signature?.faceCount ?? 0,
    triangularFaceCount: faces.filter((face) => face.vertexIds.length === 3).length,
    squareFaceCount: faces.filter((face) => face.vertexIds.length === 4).length,
    faceSizeHistogram: signature?.faceSizeHistogram ?? {},
    vertexDegreeHistogram: signature?.vertexDegreeHistogram ?? {},
    hasOrderedFaces: signature?.hasOrderedFaces ?? false,
    hasValidDerivedEdges: signature?.hasValidDerivedEdges ?? false,
    hasValidVertexIncidentRings: signature?.hasValidVertexIncidentRings ?? false,
    readinessStatus: signature?.readinessStatus ?? null,
    topologyStatus: pass ? 'cuboctahedron-verified' : 'cuboctahedron-missing-or-malformed',
  };
}

function cuboctahedronSignaturePass(signature: CellTopologySignature | null): boolean {
  return Boolean(
    signature?.topology === 'cuboctahedron' &&
      signature.vertexCount === 12 &&
      signature.edgeCount === 24 &&
      signature.faceCount === 14 &&
      signature.faceSizeHistogram[3] === 8 &&
      signature.faceSizeHistogram[4] === 6 &&
      signature.vertexDegreeHistogram[4] === 12 &&
      signature.readinessStatus === 'enabled' &&
      signature.hasOrderedFaces &&
      signature.hasValidDerivedEdges &&
      signature.hasValidVertexIncidentRings,
  );
}

function lineageDistinctnessKey(context: CuboctahedralLineageContext): string {
  return [
    `seedKey=${context.seedKey}`,
    `operationPath=${context.operationPath.join(' -> ')}`,
    `targetGenerationDepth=${context.cell?.generationDepth ?? 'missing'}`,
    `targetCellId=${context.cell?.id ?? 'missing'}`,
  ].join('|');
}

function buildRootFlagVertexBridgeRows(
  contexts: readonly CuboctahedralLineageContext[],
  flagRows: readonly A3MedialFlagRow[],
): PSimplexT28MRootFlagVertexBridgeRow[] {
  const flags = canonicalFlagRows(flagRows);

  return contexts.flatMap((context) => {
    const vertexIds = context.shape && context.cell ? canonicalCellVertexIds(context.shape, context.cell) : [];

    return flags.map((flagRow, index) => ({
      lineageId: context.lineageId,
      canonicalVertexIndex: index,
      cellVertexId: vertexIds[index] ?? null,
      flagId: flagRow.flagId,
      sharedPrimalVertex: flagRow.sharedPrimalVertex,
      omittedPrimalVertex: flagRow.omittedPrimalVertex,
      rootCoordinate: flagRow.rootCoordinate,
      bridgeBasis: 'canonical-order-with-explicit-boundary' as const,
      bridgeAuthority: 'canonical-preflight-convention-only' as const,
      bridgeStatus:
        vertexIds[index] && flagRow.status === 'a3-s4-medial-flag-token'
          ? 'bridged'
          : vertexIds[index]
            ? 'missing-flag-token'
            : 'missing-cell-vertex',
    }));
  });
}

function buildVertexFlagMapByLineage(
  bridgeRows: readonly PSimplexT28MRootFlagVertexBridgeRow[],
): Map<PSimplexT28MLineageId, Map<string, A3FlagId>> {
  const maps = new Map<PSimplexT28MLineageId, Map<string, A3FlagId>>();

  for (const row of bridgeRows) {
    if (!row.cellVertexId || row.bridgeStatus !== 'bridged') {
      continue;
    }

    if (!maps.has(row.lineageId)) {
      maps.set(row.lineageId, new Map<string, A3FlagId>());
    }

    maps.get(row.lineageId)?.set(row.cellVertexId, row.flagId);
  }

  return maps;
}

function buildAntipodalRootPairRows(
  bridgeRows: readonly PSimplexT28MRootFlagVertexBridgeRow[],
  flagRows: readonly A3MedialFlagRow[],
): PSimplexT28MAntipodalRootPairRow[] {
  const flagsById = new Map(flagRows.map((row) => [row.flagId, row]));
  const lineages = unique(bridgeRows.map((row) => row.lineageId)).sort(lineageSort);
  const pairs: PSimplexT28MAntipodalRootPairRow[] = [];

  for (const left of canonicalFlagRows(flagRows)) {
    const rightFlagId = flagId(left.omittedPrimalVertex, left.sharedPrimalVertex);

    if (flagOrder(left.flagId) > flagOrder(rightFlagId)) {
      continue;
    }

    const right = flagsById.get(rightFlagId);
    const rootCoordinateSum = addRootCoordinates(left.rootCoordinate, right?.rootCoordinate ?? zeroRootCoordinate());
    const bridgeVertexPairs = lineages.map((lineageId) => ({
      lineageId,
      leftVertexId: bridgeRows.find((row) => row.lineageId === lineageId && row.flagId === left.flagId)?.cellVertexId ?? null,
      rightVertexId: bridgeRows.find((row) => row.lineageId === lineageId && row.flagId === rightFlagId)?.cellVertexId ?? null,
    }));
    const cleanOpposite = PRIMAL_LABELS.every((label) => rootCoordinateSum[label] === 0);

    pairs.push({
      pairId: `antipodal-${orderedPairKey(left.sharedPrimalVertex, left.omittedPrimalVertex)}`,
      leftFlagId: left.flagId,
      rightFlagId,
      bridgeVertexPairs,
      rootCoordinateSum,
      antipodalStatus:
        right && bridgeVertexPairs.every((pair) => pair.leftVertexId && pair.rightVertexId) && cleanOpposite
          ? 'clean-antipodal-pair'
          : right
            ? 'non-opposite-root-coordinates'
            : 'missing-antipodal-pair',
    });
  }

  return pairs;
}

function buildCentralHexagonRows(
  flagRows: readonly A3MedialFlagRow[],
  antipodalRows: readonly PSimplexT28MAntipodalRootPairRow[],
): PSimplexT28MCentralHexagonRow[] {
  return PRIMAL_LABELS.map((pivotPrimalVertex) => {
    const flagIds = canonicalFlagRows(flagRows)
      .filter(
        (row) =>
          row.sharedPrimalVertex === pivotPrimalVertex || row.omittedPrimalVertex === pivotPrimalVertex,
      )
      .map((row) => row.flagId);
    const internalEdgePairs = buildAdjacentFlagPairs(flagIds);
    const degreeHistogram = histogram(flagIds.map((flag) => flagDegree(flag, internalEdgePairs)));
    const connectedCycle = isConnectedCycle(flagIds, internalEdgePairs);
    const antipodalPairIds = antipodalRows
      .filter((row) => flagIds.includes(row.leftFlagId) && flagIds.includes(row.rightFlagId))
      .map((row) => row.pairId)
      .sort();
    const pass =
      flagIds.length === 6 &&
      internalEdgePairs.length === 6 &&
      degreeHistogram[2] === 6 &&
      connectedCycle &&
      antipodalPairIds.length === 3;

    return {
      hexagonId: `central-hexagon-${pivotPrimalVertex}`,
      pivotPrimalVertex,
      flagIds,
      internalEdgePairs,
      antipodalPairIds,
      degreeHistogram,
      connectedCycle,
      hexagonStatus: pass ? 'central-hexagon-cycle' : 'central-hexagon-defect',
    };
  });
}

function buildCentralHexagonIncidenceRows(
  flagRows: readonly A3MedialFlagRow[],
  hexagonRows: readonly PSimplexT28MCentralHexagonRow[],
): PSimplexT28MCentralHexagonIncidenceRow[] {
  return canonicalFlagRows(flagRows).map((flagRow) => {
    const incidentHexagonIds = hexagonRows
      .filter((row) => row.flagIds.includes(flagRow.flagId))
      .map((row) => row.hexagonId)
      .sort();

    return {
      flagId: flagRow.flagId,
      incidentHexagonIds,
      incidentHexagonCount: incidentHexagonIds.length,
      incidenceStatus: incidentHexagonIds.length === 2 ? 'two-hexagon-incidence' : 'incidence-defect',
    };
  });
}

function buildTriangleClosureBridgeRows(
  contexts: readonly CuboctahedralLineageContext[],
  triangleRows: readonly TriangleClosureRow[],
  vertexFlagMapByLineage: Map<PSimplexT28MLineageId, Map<string, A3FlagId>>,
): PSimplexT28MTriangleClosureBridgeRow[] {
  const canonicalGroups = buildCanonicalTriangleGroups(triangleRows);
  const canonicalGroupsBySetKey = groupByFlagSetKey(canonicalGroups);

  return contexts.flatMap((context) => {
    const triangleFaces = context.shape && context.cell
      ? getCellFaces(context.shape, context.cell).filter((face) => face.vertexIds.length === 3).sort(faceSort)
      : [];
    const vertexFlagMap = vertexFlagMapByLineage.get(context.lineageId) ?? new Map<string, A3FlagId>();

    return Array.from({ length: 8 }, (_, index) => {
      const face = triangleFaces[index] ?? null;
      const actualFaceFlagIds = face
        ? face.vertexIds.map((vertexId) => vertexFlagMap.get(vertexId)).filter(isA3FlagId)
        : [];
      const actualFaceFlagSetKey = flagSetKey(actualFaceFlagIds);
      const group = canonicalGroupsBySetKey.get(actualFaceFlagSetKey) ?? canonicalGroups[index] ?? null;
      const mappedFlagTriple = group?.flagIds ?? [];
      const mappedFlagSetKey = flagSetKey(mappedFlagTriple);
      const missingVertexFlagBridge = Boolean(face && actualFaceFlagIds.length !== face.vertexIds.length);
      const actualFaceMatchesMappedFlags = Boolean(
        face && group && !missingVertexFlagBridge && sameFlagSet(actualFaceFlagIds, mappedFlagTriple),
      );
      const closurePassCount = group?.rows.filter((row) => row.closureStatus === 'pass').length ?? 0;
      const closureFailCount = group?.rows.filter((row) => row.closureStatus === 'fail').length ?? 0;
      const faceFlagBridgeStatus = triangleFaceFlagBridgeStatus({
        face,
        group,
        missingVertexFlagBridge,
        actualFaceMatchesMappedFlags,
      });
      const pass = Boolean(
        actualFaceMatchesMappedFlags &&
          group &&
          group.rows.length === 6 &&
          closurePassCount === 6 &&
          closureFailCount === 0,
      );

      return {
        lineageId: context.lineageId,
        triangleFaceId: face?.id ?? null,
        faceVertexIds: face?.vertexIds ?? [],
        triangleId: group?.triangleId ?? null,
        mappedFlagTriple,
        actualFaceFlagIds,
        actualFaceFlagSetKey,
        mappedFlagSetKey,
        actualFaceMatchesMappedFlags,
        orderedProductIds: unique(group?.rows.map((row) => row.orderedProductId) ?? []).sort(),
        discriminatorOrderedProductCount: group?.rows.length ?? 0,
        closurePassCount,
        closureFailCount,
        faceFlagBridgeStatus,
        bridgeBasis: 'actual-face-vertex-flags-plus-discriminator-row',
        closureBridgeStatus: pass ? 'triangle-closure-bridged' : 'triangle-closure-defect',
      };
    });
  });
}

function buildSquareHolonomyBridgeRows(
  contexts: readonly CuboctahedralLineageContext[],
  squareRows: readonly SquareHolonomyRow[],
  vertexFlagMapByLineage: Map<PSimplexT28MLineageId, Map<string, A3FlagId>>,
): PSimplexT28MSquareHolonomyBridgeRow[] {
  const canonicalGroups = buildCanonicalSquareGroups(squareRows);
  const canonicalGroupsBySetKey = groupByFlagSetKey(canonicalGroups);

  return contexts.flatMap((context) => {
    const squareFaces = context.shape && context.cell
      ? getCellFaces(context.shape, context.cell).filter((face) => face.vertexIds.length === 4).sort(faceSort)
      : [];
    const vertexFlagMap = vertexFlagMapByLineage.get(context.lineageId) ?? new Map<string, A3FlagId>();

    return Array.from({ length: 6 }, (_, index) => {
      const face = squareFaces[index] ?? null;
      const actualFaceFlagIds = face
        ? face.vertexIds.map((vertexId) => vertexFlagMap.get(vertexId)).filter(isA3FlagId)
        : [];
      const actualFaceFlagSetKey = flagSetKey(actualFaceFlagIds);
      const group = canonicalGroupsBySetKey.get(actualFaceFlagSetKey) ?? canonicalGroups[index] ?? null;
      const mappedFlagCycle = group?.flagIds ?? [];
      const mappedFlagSetKey = flagSetKey(mappedFlagCycle);
      const missingVertexFlagBridge = Boolean(face && actualFaceFlagIds.length !== face.vertexIds.length);
      const actualFaceMatchesMappedFlags = Boolean(
        face && group && !missingVertexFlagBridge && sameFlagSet(actualFaceFlagIds, mappedFlagCycle),
      );
      const holonomyPassCount = group?.rows.filter((row) => row.holonomyStatus === 'pass').length ?? 0;
      const holonomyFailCount = group?.rows.filter((row) => row.holonomyStatus === 'fail').length ?? 0;
      const faceFlagBridgeStatus = squareFaceFlagBridgeStatus({
        face,
        group,
        missingVertexFlagBridge,
        actualFaceMatchesMappedFlags,
      });
      const pass = Boolean(
        actualFaceMatchesMappedFlags &&
          group &&
          group.rows.length === 8 &&
          holonomyPassCount === 8 &&
          holonomyFailCount === 0,
      );

      return {
        lineageId: context.lineageId,
        squareFaceId: face?.id ?? null,
        faceVertexIds: face?.vertexIds ?? [],
        squareCycleId: group?.squareCycleId ?? null,
        mappedFlagCycle,
        actualFaceFlagIds,
        actualFaceFlagSetKey,
        mappedFlagSetKey,
        actualFaceMatchesMappedFlags,
        orientationVariantIds: unique(group?.rows.map((row) => row.orientationVariant) ?? []).sort(),
        holonomyVariantCount: group?.rows.length ?? 0,
        holonomyPassCount,
        holonomyFailCount,
        leftAssociatedProducts: unique(group?.rows.map((row) => row.leftAssociatedProduct) ?? []).sort(),
        faceFlagBridgeStatus,
        bridgeBasis: 'actual-face-vertex-flags-plus-discriminator-row',
        holonomyBridgeStatus: pass ? 'square-holonomy-bridged' : 'square-holonomy-defect',
      };
    });
  });
}

function buildMetricEquilibriumRow(context: CuboctahedralLineageContext): PSimplexT28MMetricEquilibriumRow {
  if (!context.shape || !context.cell) {
    return emptyMetricRow(context.lineageId);
  }

  const shape = context.shape;
  const cell = context.cell;
  const positions: Vec3[] = cell.vertexIds.map((vertexId) => shape.vertices[vertexId]?.position ?? [0, 0, 0]);
  const centroid = cleanVec3(scaleVec3(sumVec3(positions), positions.length > 0 ? 1 / positions.length : 0));
  const radiusValues = positions.map((position) => cleanNumber(distanceVec3(position, centroid))).sort(numberSort);
  const edgeLengthValues = deriveCellEdges(shape, cell)
    .map((edge) =>
      cleanNumber(
        distanceVec3(
          shape.vertices[edge.vertexIds[0]]?.position ?? [0, 0, 0],
          shape.vertices[edge.vertexIds[1]]?.position ?? [0, 0, 0],
        ),
      ),
    )
    .sort(numberSort);
  const minRadius = minOrZero(radiusValues);
  const maxRadius = maxOrZero(radiusValues);
  const minEdgeLength = minOrZero(edgeLengthValues);
  const maxEdgeLength = maxOrZero(edgeLengthValues);
  const radiusSpread = cleanNumber(maxRadius - minRadius);
  const edgeLengthSpread = cleanNumber(maxEdgeLength - minEdgeLength);
  const meanRadius = cleanNumber(mean(radiusValues));
  const meanEdgeLength = cleanNumber(mean(edgeLengthValues));
  const radiusEdgeDifference = cleanNumber(Math.abs(meanRadius - meanEdgeLength));
  const strictPass =
    radiusValues.length === 12 &&
    edgeLengthValues.length === 24 &&
    radiusSpread <= NUMERIC_TOLERANCE &&
    edgeLengthSpread <= NUMERIC_TOLERANCE &&
    radiusEdgeDifference <= NUMERIC_TOLERANCE;
  const fallbackPass =
    radiusValues.length === 12 &&
    edgeLengthValues.length === 24 &&
    radiusSpread <= FALLBACK_GEOMETRY_TOLERANCE &&
    edgeLengthSpread <= FALLBACK_GEOMETRY_TOLERANCE &&
    radiusEdgeDifference <= FALLBACK_GEOMETRY_TOLERANCE;

  return {
    lineageId: context.lineageId,
    cellId: context.cell.id,
    centroid,
    vertexCount: radiusValues.length,
    edgeCount: edgeLengthValues.length,
    radiusValues,
    edgeLengthValues,
    minRadius,
    maxRadius,
    radiusSpread,
    minEdgeLength,
    maxEdgeLength,
    edgeLengthSpread,
    meanRadius,
    meanEdgeLength,
    radiusEdgeDifference,
    tolerance: NUMERIC_TOLERANCE,
    fallbackTolerance: FALLBACK_GEOMETRY_TOLERANCE,
    metricStatus: strictPass
      ? 'r-equals-edge-preserved'
      : fallbackPass
        ? 'r-equals-edge-preserved-with-fallback-tolerance'
        : 'metric-equilibrium-defect',
  };
}

function buildVertexFigureAlternationRows(
  contexts: readonly CuboctahedralLineageContext[],
): PSimplexT28MVertexFigureAlternationRow[] {
  return contexts.flatMap((context) => {
    const vertexIds = context.shape && context.cell ? canonicalCellVertexIds(context.shape, context.cell) : [];

    return Array.from({ length: 12 }, (_, index) => {
      const vertexId = vertexIds[index] ?? null;
      return buildVertexFigureAlternationRow(context, vertexId);
    });
  });
}

function buildVertexFigureAlternationRow(
  context: CuboctahedralLineageContext,
  vertexId: string | null,
): PSimplexT28MVertexFigureAlternationRow {
  if (!context.shape || !context.cell || !vertexId) {
    return {
      lineageId: context.lineageId,
      vertexId,
      incidentFaceIds: [],
      incidentFaceSizes: [],
      cyclicFaceSizeSequence: [],
      triangleIncidentCount: 0,
      squareIncidentCount: 0,
      incidentFaceGraphDegreeHistogram: {},
      alternationStatus: 'vertex-figure-defect',
    };
  }

  const incidentFaces = getCellFaces(context.shape, context.cell)
    .filter((face) => face.vertexIds.includes(vertexId))
    .sort(faceSort);
  const incidentFaceSizes = incidentFaces.map((face) => face.vertexIds.length).sort(numberSort);
  const adjacency = buildIncidentFaceAdjacency(incidentFaces, vertexId);
  const cyclicFaces = walkFaceCycle(incidentFaces, adjacency);
  const cyclicFaceSizeSequence = cyclicFaces.map((face) => face.vertexIds.length);
  const triangleIncidentCount = incidentFaceSizes.filter((size) => size === 3).length;
  const squareIncidentCount = incidentFaceSizes.filter((size) => size === 4).length;
  const degreeHistogram = histogram(incidentFaces.map((face) => adjacency.get(face.id)?.size ?? 0));
  const pass =
    incidentFaces.length === 4 &&
    triangleIncidentCount === 2 &&
    squareIncidentCount === 2 &&
    degreeHistogram[2] === 4 &&
    isAlternatingFaceSizeCycle(cyclicFaceSizeSequence);

  return {
    lineageId: context.lineageId,
    vertexId,
    incidentFaceIds: incidentFaces.map((face) => face.id),
    incidentFaceSizes,
    cyclicFaceSizeSequence,
    triangleIncidentCount,
    squareIncidentCount,
    incidentFaceGraphDegreeHistogram: degreeHistogram,
    alternationStatus: pass ? '3-4-3-4-vertex-figure' : 'vertex-figure-defect',
  };
}

function buildProvenanceBridgeRows(
  sourceLineageRows: readonly PSimplexT28MSourceLineageRow[],
  discriminatorReport: OctonionVsA3MedialCarrierDiscriminatorV0Report,
  policyReport: MedialDualEquivariantCarrierPolicyModelCardV0Report,
): PSimplexT28MProvenanceBridgeRow[] {
  const lineageIds = sourceLineageRows.map((row) => row.lineageId);
  const distinctSeedKeys = unique(sourceLineageRows.map((row) => row.seedKey)).sort();
  const distinctOperationPaths = unique(sourceLineageRows.map((row) => row.operationPath.join(' -> '))).sort();
  const lineageDistinctnessKeys = sourceLineageRows.map((row) => row.lineageDistinctnessKey);
  const distinctLineageDistinctnessKeyCount = new Set(lineageDistinctnessKeys).size;
  const parentCuboctahedronBridgeStatuses = [
    discriminatorReport.cuboctahedronBridge.status,
    discriminatorReport.cubeG1CuboctahedronBridge.status,
    discriminatorReport.tetraG2CoreCuboctahedronBridge.status,
  ];
  const pass =
    sourceLineageRows.length === 3 &&
    sourceLineageRows.every((row) => row.targetTopology === 'cuboctahedron') &&
    distinctSeedKeys.length === 3 &&
    distinctOperationPaths.length === 3 &&
    lineageDistinctnessKeys.length === 3 &&
    distinctLineageDistinctnessKeyCount === 3 &&
    parentCuboctahedronBridgeStatuses.every((status) => status.startsWith('verified-')) &&
    discriminatorReport.dualOctaCubeProvenance.cubePrimalCarrierAssignmentStatus ===
      'not-solved-independent-cube-primal-sourcehood' &&
    policyReport.cubePrimalSourcehoodStatus === 'not-proven';

  return [
    {
      rowId: 'tetra-octa-cube-cuboctahedral-provenance-bridge',
      lineageIds,
      distinctSeedKeys,
      distinctOperationPaths,
      lineageDistinctnessKeys,
      distinctLineageDistinctnessKeyCount,
      parentCuboctahedronBridgeStatuses,
      policyCandidateStatus: policyReport.policyCandidateStatus,
      cubePrimalSourcehoodStatus: discriminatorReport.dualOctaCubeProvenance.cubePrimalCarrierAssignmentStatus,
      provenanceStatus: pass
        ? 'three-distinct-cuboctahedral-provenance-paths-with-cube-primal-sourcehood-unsolved'
        : 'provenance-defect',
    },
  ];
}

function buildProjectionLossRows(): PSimplexT28MProjectionLossRow[] {
  return [
    {
      projectionId: 'signed-fano-lift',
      retainedData: ['six signed carrier rays', 'local multiplicative orientation evidence'],
      lostData: ['twelve directed A3 root flags collapse to six antipodal rays'],
      restorationDependency: ['A3 flag rows', 'root flag vertex bridge rows', 'provenance bridge'],
      projectionLossStatus: 'lossy-but-restorable-with-provenance',
      blocksPreflight: false,
    },
    {
      projectionId: 'scalar-tuple',
      retainedData: ['coordinate tuple values only'],
      lostData: ['incidence order', 'directed flag identity', 'closure and holonomy witness rows'],
      restorationDependency: ['external row-level A3 structural evidence'],
      projectionLossStatus: 'structurally-destructive',
      blocksPreflight: false,
    },
    {
      projectionId: 'topology-only',
      retainedData: ['12V/24E/14F cuboctahedral counts', '3/4 face-size histogram'],
      lostData: ['canonical A3 root labels', 'antipodal pairing names', 'provenance path'],
      restorationDependency: ['root flag bridge rows', 'source lineage rows'],
      projectionLossStatus: 'lossy-but-restorable-with-provenance',
      blocksPreflight: false,
    },
  ];
}

function projectionLossClassifiedHonestly(rows: readonly PSimplexT28MProjectionLossRow[]): boolean {
  const requiredStatuses: Record<PSimplexT28MProjectionLossRow['projectionId'], PSimplexT28MProjectionLossRow['projectionLossStatus']> = {
    'signed-fano-lift': 'lossy-but-restorable-with-provenance',
    'scalar-tuple': 'structurally-destructive',
    'topology-only': 'lossy-but-restorable-with-provenance',
  };

  return (
    rows.length === 3 &&
    rows.every((row) => {
      const expectedStatus = requiredStatuses[row.projectionId];
      const lossRecorded = row.lostData.length > 0;
      const destructive = row.projectionLossStatus === 'structurally-destructive';
      const restorable = row.projectionLossStatus === 'lossy-but-restorable-with-provenance' &&
        row.restorationDependency.length > 0;

      return expectedStatus === row.projectionLossStatus && lossRecorded && (destructive || restorable);
    })
  );
}

function buildRestorationControlRows(): PSimplexT28MRestorationControlRow[] {
  return [
    restorationControl(
      'control-cuboctahedron-topology',
      'cuboctahedron-topology-defect',
      'detect-and-block',
      'All three generated core cells must be 12V/24E/14F cuboctahedra with 8 triangular faces, 6 square faces, degree-4 vertices, ordered faces, and enabled readiness.',
      ['cuboctahedronTopologyRows'],
    ),
    restorationControl(
      'control-root-flag-identity',
      'root-flag-identity-defect',
      'restore-with-provenance',
      'Each cuboctahedron vertex is bridged to one of the 12 directed A3 medial flags using canonical order and explicit non-intrinsic boundary rows.',
      ['rootFlagVertexBridgeRows', 'boundaryRows'],
    ),
    restorationControl(
      'control-antipodal-root-pairing',
      'antipodal-root-pairing-defect',
      'detect-and-block',
      'The six unordered directed-root pairs must sum to zero root coordinates and must have bridged vertices in every lineage.',
      ['antipodalRootPairRows'],
    ),
    restorationControl(
      'control-central-hexagon-planes',
      'central-hexagon-plane-defect',
      'detect-and-block',
      'Each primal pivot must induce one six-flag cycle with three antipodal pairs, and each directed flag must occur in exactly two such cycles.',
      ['centralHexagonRows', 'centralHexagonIncidenceRows'],
    ),
    restorationControl(
      'control-triangle-closure',
      'triangle-closure-defect',
      'detect-and-block',
      'Every actual triangular face is paired with one canonical A3 triangle group whose six ordered discriminator products all pass.',
      ['triangleClosureBridgeRows', 'octonion-vs-a3-medial-carrier-discriminator-v0.triangleClosureRows'],
    ),
    restorationControl(
      'control-square-holonomy',
      'square-holonomy-defect',
      'detect-and-block',
      'Every actual square face is paired with one canonical A3 square group whose eight discriminator holonomy variants all pass.',
      ['squareHolonomyBridgeRows', 'octonion-vs-a3-medial-carrier-discriminator-v0.squareHolonomyRows'],
    ),
    restorationControl(
      'control-metric-equilibrium',
      'metric-equilibrium-defect',
      'detect-and-block',
      'Each generated cuboctahedron must have constant vertex radius, constant edge length, and equal mean radius and mean edge length under the declared tolerance.',
      ['metricEquilibriumRows'],
    ),
    restorationControl(
      'control-vertex-figure-alternation',
      'vertex-figure-alternation-defect',
      'detect-and-block',
      'Each generated cuboctahedron vertex must have four incident faces in alternating 3-4-3-4 cyclic order.',
      ['vertexFigureAlternationRows'],
    ),
    restorationControl(
      'control-provenance-bridge',
      'provenance-bridge-defect',
      'boundary-warning',
      'Three distinct cuboctahedral provenance paths are required, and cube medial provenance must remain separated from independent cube primal sourcehood.',
      ['sourceLineageRows', 'provenanceBridgeRows', 'projectionLossRows'],
    ),
    restorationControl(
      'control-projection-loss',
      'projection-loss-defect',
      'restore-with-provenance',
      'projection-loss-defect: input = projectionLossRows; restoration = provenance/flag/structure metadata; pass if each lost observable is either explicitly restorable or marked structurally destructive.',
      ['projectionLossRows', 'rootFlagVertexBridgeRows', 'provenanceBridgeRows'],
    ),
  ];
}

function buildDefectRows(args: {
  cuboctahedronTopologyRows: readonly PSimplexT28MCuboctahedronTopologyRow[];
  rootFlagVertexBridgeRows: readonly PSimplexT28MRootFlagVertexBridgeRow[];
  antipodalRootPairRows: readonly PSimplexT28MAntipodalRootPairRow[];
  centralHexagonRows: readonly PSimplexT28MCentralHexagonRow[];
  centralHexagonIncidenceRows: readonly PSimplexT28MCentralHexagonIncidenceRow[];
  triangleClosureBridgeRows: readonly PSimplexT28MTriangleClosureBridgeRow[];
  squareHolonomyBridgeRows: readonly PSimplexT28MSquareHolonomyBridgeRow[];
  metricEquilibriumRows: readonly PSimplexT28MMetricEquilibriumRow[];
  vertexFigureAlternationRows: readonly PSimplexT28MVertexFigureAlternationRow[];
  provenanceBridgeRows: readonly PSimplexT28MProvenanceBridgeRow[];
  projectionLossRows: readonly PSimplexT28MProjectionLossRow[];
  restorationControlRows: readonly PSimplexT28MRestorationControlRow[];
}): PSimplexT28MDefectRow[] {
  return [
    defectRow(
      'cuboctahedron-topology-defect',
      args.cuboctahedronTopologyRows.some((row) => row.topologyStatus !== 'cuboctahedron-verified'),
      'control-cuboctahedron-topology',
      `${args.cuboctahedronTopologyRows.filter((row) => row.topologyStatus === 'cuboctahedron-verified').length}/3 topology rows verified.`,
    ),
    defectRow(
      'root-flag-identity-defect',
      args.rootFlagVertexBridgeRows.some((row) => row.bridgeStatus !== 'bridged'),
      'control-root-flag-identity',
      `${args.rootFlagVertexBridgeRows.filter((row) => row.bridgeStatus === 'bridged').length}/36 root flag bridge rows bridged.`,
    ),
    defectRow(
      'antipodal-root-pairing-defect',
      args.antipodalRootPairRows.some((row) => row.antipodalStatus !== 'clean-antipodal-pair'),
      'control-antipodal-root-pairing',
      `${args.antipodalRootPairRows.filter((row) => row.antipodalStatus === 'clean-antipodal-pair').length}/6 antipodal pairs clean.`,
    ),
    defectRow(
      'central-hexagon-plane-defect',
      args.centralHexagonRows.some((row) => row.hexagonStatus !== 'central-hexagon-cycle') ||
        args.centralHexagonIncidenceRows.some((row) => row.incidenceStatus !== 'two-hexagon-incidence'),
      'control-central-hexagon-planes',
      `${args.centralHexagonRows.filter((row) => row.hexagonStatus === 'central-hexagon-cycle').length}/4 hexagons and ${args.centralHexagonIncidenceRows.filter((row) => row.incidenceStatus === 'two-hexagon-incidence').length}/12 incidences pass.`,
    ),
    defectRow(
      'triangle-closure-defect',
      args.triangleClosureBridgeRows.some((row) => row.closureBridgeStatus !== 'triangle-closure-bridged'),
      'control-triangle-closure',
      `${args.triangleClosureBridgeRows.filter((row) => row.closureBridgeStatus === 'triangle-closure-bridged').length}/24 triangle closure bridges pass.`,
    ),
    defectRow(
      'square-holonomy-defect',
      args.squareHolonomyBridgeRows.some((row) => row.holonomyBridgeStatus !== 'square-holonomy-bridged'),
      'control-square-holonomy',
      `${args.squareHolonomyBridgeRows.filter((row) => row.holonomyBridgeStatus === 'square-holonomy-bridged').length}/18 square holonomy bridges pass.`,
    ),
    defectRow(
      'metric-equilibrium-defect',
      args.metricEquilibriumRows.some((row) => row.metricStatus === 'metric-equilibrium-defect'),
      'control-metric-equilibrium',
      `${args.metricEquilibriumRows.filter((row) => row.metricStatus !== 'metric-equilibrium-defect').length}/3 metric rows preserve radius=edge.`,
    ),
    defectRow(
      'vertex-figure-alternation-defect',
      args.vertexFigureAlternationRows.some((row) => row.alternationStatus !== '3-4-3-4-vertex-figure'),
      'control-vertex-figure-alternation',
      `${args.vertexFigureAlternationRows.filter((row) => row.alternationStatus === '3-4-3-4-vertex-figure').length}/36 vertex figure rows alternate.`,
    ),
    defectRow(
      'provenance-bridge-defect',
      args.provenanceBridgeRows.some(
        (row) =>
          row.provenanceStatus !==
          'three-distinct-cuboctahedral-provenance-paths-with-cube-primal-sourcehood-unsolved',
      ) ||
        args.restorationControlRows.some((row) => row.controlStatus !== 'restoration-control-defined'),
      'control-provenance-bridge',
      `${args.provenanceBridgeRows.filter((row) => row.provenanceStatus === 'three-distinct-cuboctahedral-provenance-paths-with-cube-primal-sourcehood-unsolved').length}/1 provenance rows pass.`,
    ),
    defectRow(
      'projection-loss-defect',
      !projectionLossClassifiedHonestly(args.projectionLossRows),
      'control-projection-loss',
      args.projectionLossRows.map((row) => `${row.projectionId}:${row.projectionLossStatus}`).join(', '),
    ),
  ];
}

function buildPortabilityVerdictRows(args: {
  sourceLineageRows: readonly PSimplexT28MSourceLineageRow[];
  cuboctahedronTopologyRows: readonly PSimplexT28MCuboctahedronTopologyRow[];
  rootFlagVertexBridgeRows: readonly PSimplexT28MRootFlagVertexBridgeRow[];
  antipodalRootPairRows: readonly PSimplexT28MAntipodalRootPairRow[];
  centralHexagonRows: readonly PSimplexT28MCentralHexagonRow[];
  centralHexagonIncidenceRows: readonly PSimplexT28MCentralHexagonIncidenceRow[];
  triangleClosureBridgeRows: readonly PSimplexT28MTriangleClosureBridgeRow[];
  squareHolonomyBridgeRows: readonly PSimplexT28MSquareHolonomyBridgeRow[];
  metricEquilibriumRows: readonly PSimplexT28MMetricEquilibriumRow[];
  vertexFigureAlternationRows: readonly PSimplexT28MVertexFigureAlternationRow[];
  provenanceBridgeRows: readonly PSimplexT28MProvenanceBridgeRow[];
  projectionLossRows: readonly PSimplexT28MProjectionLossRow[];
  restorationControlRows: readonly PSimplexT28MRestorationControlRow[];
}): PSimplexT28MPortabilityVerdictRow[] {
  return [
    portabilityVerdict(
      'source-lineage',
      args.sourceLineageRows.every((row) => row.lineageStatus === 'selected-cuboctahedron-core'),
      `${args.sourceLineageRows.filter((row) => row.lineageStatus === 'selected-cuboctahedron-core').length}/3 lineages selected.`,
    ),
    portabilityVerdict(
      'cuboctahedron-topology',
      args.cuboctahedronTopologyRows.every((row) => row.topologyStatus === 'cuboctahedron-verified'),
      `${args.cuboctahedronTopologyRows.filter((row) => row.topologyStatus === 'cuboctahedron-verified').length}/3 topology rows verified.`,
    ),
    portabilityVerdict(
      'root-flag-identity',
      args.rootFlagVertexBridgeRows.every((row) => row.bridgeStatus === 'bridged'),
      `${args.rootFlagVertexBridgeRows.filter((row) => row.bridgeStatus === 'bridged').length}/36 bridge rows pass.`,
    ),
    portabilityVerdict(
      'antipodal-root-pairing',
      args.antipodalRootPairRows.every((row) => row.antipodalStatus === 'clean-antipodal-pair'),
      `${args.antipodalRootPairRows.filter((row) => row.antipodalStatus === 'clean-antipodal-pair').length}/6 antipodal rows pass.`,
    ),
    portabilityVerdict(
      'central-hexagon-planes',
      args.centralHexagonRows.every((row) => row.hexagonStatus === 'central-hexagon-cycle') &&
        args.centralHexagonIncidenceRows.every((row) => row.incidenceStatus === 'two-hexagon-incidence'),
      `${args.centralHexagonRows.filter((row) => row.hexagonStatus === 'central-hexagon-cycle').length}/4 hexagons, ${args.centralHexagonIncidenceRows.filter((row) => row.incidenceStatus === 'two-hexagon-incidence').length}/12 incidences pass.`,
    ),
    portabilityVerdict(
      'triangle-closure',
      args.triangleClosureBridgeRows.every((row) => row.closureBridgeStatus === 'triangle-closure-bridged'),
      `${args.triangleClosureBridgeRows.filter((row) => row.closureBridgeStatus === 'triangle-closure-bridged').length}/24 triangle closure bridge rows pass.`,
    ),
    portabilityVerdict(
      'square-holonomy',
      args.squareHolonomyBridgeRows.every((row) => row.holonomyBridgeStatus === 'square-holonomy-bridged'),
      `${args.squareHolonomyBridgeRows.filter((row) => row.holonomyBridgeStatus === 'square-holonomy-bridged').length}/18 square holonomy bridge rows pass.`,
    ),
    portabilityVerdict(
      'metric-equilibrium',
      args.metricEquilibriumRows.every((row) => row.metricStatus !== 'metric-equilibrium-defect'),
      `${args.metricEquilibriumRows.filter((row) => row.metricStatus !== 'metric-equilibrium-defect').length}/3 metric rows pass.`,
    ),
    portabilityVerdict(
      'vertex-figure-alternation',
      args.vertexFigureAlternationRows.every((row) => row.alternationStatus === '3-4-3-4-vertex-figure'),
      `${args.vertexFigureAlternationRows.filter((row) => row.alternationStatus === '3-4-3-4-vertex-figure').length}/36 vertex figure rows pass.`,
    ),
    portabilityVerdict(
      'provenance-bridge',
      args.provenanceBridgeRows.every(
        (row) =>
          row.provenanceStatus ===
          'three-distinct-cuboctahedral-provenance-paths-with-cube-primal-sourcehood-unsolved',
      ),
      `${args.provenanceBridgeRows.filter((row) => row.provenanceStatus === 'three-distinct-cuboctahedral-provenance-paths-with-cube-primal-sourcehood-unsolved').length}/1 provenance rows pass.`,
    ),
    portabilityVerdict(
      'restoration-control',
      args.restorationControlRows.every((row) => row.controlStatus === 'restoration-control-defined'),
      `${args.restorationControlRows.filter((row) => row.controlStatus === 'restoration-control-defined').length}/10 restoration controls defined.`,
    ),
    {
      axisId: 'projection-loss',
      status: 'warning-only',
      evidence: `${args.projectionLossRows.length}/3 projection-loss rows classified; scalar tuple remains structurally destructive and is not counted as safe evidence.`,
    },
  ];
}

function buildBoundaryRows(): PSimplexT28MBoundaryRow[] {
  return [
    boundary('not-residual-law-proof', 'This preflight does not prove a residual law.'),
    boundary('not-K3-T-portability-proof', 'This preflight does not prove K3-T portability.'),
    boundary('not-mature-field', 'This preflight does not promote the evidence to a mature field.'),
    boundary('not-field-world-generalization', 'This preflight does not generalize to a field-world claim.'),
    boundary('not-FieldCue', 'This preflight does not create or unblock FieldCue.'),
    boundary('not-semantic-naming', 'This preflight does not authorize semantic naming.'),
    boundary('not-topology-authorization', 'This preflight does not authorize a downstream topology workspace.'),
    boundary('not-route', 'This preflight does not confirm routes.'),
    boundary('not-gate', 'This preflight does not confirm gates.'),
    boundary('not-corridor', 'This preflight does not confirm corridors.'),
    boundary('not-runtime', 'This preflight does not authorize runtime adoption.'),
    boundary('not-field-resurrection', 'This preflight does not resurrect quarantined field evidence.'),
    boundary('not-universal-octonions', 'This preflight does not prove universal octonionic behavior.'),
    boundary('not-cube-primal-sourcehood', 'This preflight keeps cube primal sourcehood unsolved.'),
    boundary('not-natural-geometric-flag-recovery', 'A3 root flag recovery is canonical-row evidence, not natural geometric recovery.'),
    boundary('not-canonical-order-as-intrinsic-identity', 'Canonical vertex order is not treated as intrinsic identity.'),
    boundary('not-shape-mutation', 'This preflight does not mutate persisted shapes.'),
    boundary('not-packet-write', 'This preflight does not write packets.'),
    boundary('not-ui', 'This preflight adds no UI.'),
  ];
}

function buildFalsifierRows(args: {
  parentEvidenceRows: readonly PSimplexT28MParentEvidenceRow[];
  sourceLineageRows: readonly PSimplexT28MSourceLineageRow[];
  cuboctahedronTopologyRows: readonly PSimplexT28MCuboctahedronTopologyRow[];
  rootFlagVertexBridgeRows: readonly PSimplexT28MRootFlagVertexBridgeRow[];
  antipodalRootPairRows: readonly PSimplexT28MAntipodalRootPairRow[];
  centralHexagonRows: readonly PSimplexT28MCentralHexagonRow[];
  centralHexagonIncidenceRows: readonly PSimplexT28MCentralHexagonIncidenceRow[];
  triangleClosureBridgeRows: readonly PSimplexT28MTriangleClosureBridgeRow[];
  squareHolonomyBridgeRows: readonly PSimplexT28MSquareHolonomyBridgeRow[];
  metricEquilibriumRows: readonly PSimplexT28MMetricEquilibriumRow[];
  vertexFigureAlternationRows: readonly PSimplexT28MVertexFigureAlternationRow[];
  provenanceBridgeRows: readonly PSimplexT28MProvenanceBridgeRow[];
  projectionLossRows: readonly PSimplexT28MProjectionLossRow[];
  restorationControlRows: readonly PSimplexT28MRestorationControlRow[];
  defectRows: readonly PSimplexT28MDefectRow[];
  boundaryRows: readonly PSimplexT28MBoundaryRow[];
  summaryVerdict: PSimplexCuboctahedralVectorEquilibriumPortabilityT28MSummaryVerdict;
}): PSimplexT28MFalsifierRow[] {
  return [
    falsifierRow(
      'F1',
      'The report promotes the preflight to a residual law or K3-T portability proof.',
      args.summaryVerdict.includes('residual') || args.summaryVerdict.includes('K3-T'),
      `summaryVerdict=${args.summaryVerdict}.`,
    ),
    falsifierRow(
      'F2',
      'The three cuboctahedral source lineages are missing or not generated by Ambo core selection.',
      args.sourceLineageRows.length !== 3 ||
        args.sourceLineageRows.some((row) => row.lineageStatus !== 'selected-cuboctahedron-core'),
      `${args.sourceLineageRows.filter((row) => row.lineageStatus === 'selected-cuboctahedron-core').length}/3 source lineages selected.`,
    ),
    falsifierRow(
      'F3',
      'Projection loss is treated as safe without provenance or row restoration controls.',
      args.projectionLossRows.some((row) => row.projectionId === 'scalar-tuple' && row.projectionLossStatus !== 'structurally-destructive') ||
        args.projectionLossRows.some((row) => row.blocksPreflight),
      args.projectionLossRows.map((row) => `${row.projectionId}:${row.projectionLossStatus}`).join(', '),
    ),
    falsifierRow(
      'F4',
      'Cuboctahedron topology rows fail the required 12V/24E/14F and face/degree checks.',
      args.cuboctahedronTopologyRows.some((row) => row.topologyStatus !== 'cuboctahedron-verified'),
      `${args.cuboctahedronTopologyRows.filter((row) => row.topologyStatus === 'cuboctahedron-verified').length}/3 topology rows verified.`,
    ),
    falsifierRow(
      'F5',
      'The A3 root flag bridge does not preserve all 12 directed flag identities in all three lineages.',
      args.rootFlagVertexBridgeRows.length !== 36 ||
        args.rootFlagVertexBridgeRows.some((row) => row.bridgeStatus !== 'bridged'),
      `${args.rootFlagVertexBridgeRows.filter((row) => row.bridgeStatus === 'bridged').length}/36 bridge rows pass.`,
    ),
    falsifierRow(
      'F6',
      'Antipodal root pairing is missing or non-opposite.',
      args.antipodalRootPairRows.length !== 6 ||
        args.antipodalRootPairRows.some((row) => row.antipodalStatus !== 'clean-antipodal-pair'),
      `${args.antipodalRootPairRows.filter((row) => row.antipodalStatus === 'clean-antipodal-pair').length}/6 antipodal rows pass.`,
    ),
    falsifierRow(
      'F7',
      'Central hexagon cycles or two-hexagon flag incidences fail.',
      args.centralHexagonRows.length !== 4 ||
        args.centralHexagonRows.some((row) => row.hexagonStatus !== 'central-hexagon-cycle') ||
        args.centralHexagonIncidenceRows.length !== 12 ||
        args.centralHexagonIncidenceRows.some((row) => row.incidenceStatus !== 'two-hexagon-incidence'),
      `${args.centralHexagonRows.filter((row) => row.hexagonStatus === 'central-hexagon-cycle').length}/4 hexagons, ${args.centralHexagonIncidenceRows.filter((row) => row.incidenceStatus === 'two-hexagon-incidence').length}/12 incidences pass.`,
    ),
    falsifierRow(
      'F8',
      'Triangle closure bridge rows fail to connect actual triangular faces to passing discriminator closure rows.',
      args.triangleClosureBridgeRows.length !== 24 ||
        args.triangleClosureBridgeRows.some((row) => row.closureBridgeStatus !== 'triangle-closure-bridged'),
      `${args.triangleClosureBridgeRows.filter((row) => row.closureBridgeStatus === 'triangle-closure-bridged').length}/24 triangle bridge rows pass.`,
    ),
    falsifierRow(
      'F9',
      'Square holonomy bridge rows fail to connect actual square faces to passing discriminator holonomy rows.',
      args.squareHolonomyBridgeRows.length !== 18 ||
        args.squareHolonomyBridgeRows.some((row) => row.holonomyBridgeStatus !== 'square-holonomy-bridged'),
      `${args.squareHolonomyBridgeRows.filter((row) => row.holonomyBridgeStatus === 'square-holonomy-bridged').length}/18 square bridge rows pass.`,
    ),
    falsifierRow(
      'F10',
      'Metric equilibrium fails constant radius, constant edge length, or radius=edge checks.',
      args.metricEquilibriumRows.length !== 3 ||
        args.metricEquilibriumRows.some((row) => row.metricStatus === 'metric-equilibrium-defect'),
      args.metricEquilibriumRows.map((row) => `${row.lineageId}:${row.metricStatus}`).join(', '),
    ),
    falsifierRow(
      'F11',
      'Vertex figures fail 3-4-3-4 alternation.',
      args.vertexFigureAlternationRows.length !== 36 ||
        args.vertexFigureAlternationRows.some((row) => row.alternationStatus !== '3-4-3-4-vertex-figure'),
      `${args.vertexFigureAlternationRows.filter((row) => row.alternationStatus === '3-4-3-4-vertex-figure').length}/36 vertex figure rows pass.`,
    ),
    falsifierRow(
      'F12',
      'Provenance bridge collapses distinct tetra/octa/cube cuboctahedral paths or solves cube primal sourcehood.',
      args.provenanceBridgeRows.some(
        (row) =>
          row.provenanceStatus !==
          'three-distinct-cuboctahedral-provenance-paths-with-cube-primal-sourcehood-unsolved',
      ),
      args.provenanceBridgeRows.map((row) => `${row.rowId}:${row.provenanceStatus}`).join(', '),
    ),
    falsifierRow(
      'F13',
      'Required boundary rows are missing or unenforced.',
      REQUIRED_BOUNDARY_IDS.some(
        (boundaryId) => !args.boundaryRows.some((row) => row.boundaryId === boundaryId && row.enforced),
      ),
      `${args.boundaryRows.filter((row) => row.enforced).length}/${REQUIRED_BOUNDARY_IDS.length} boundary rows enforced.`,
    ),
    falsifierRow(
      'F14',
      'Parent reports are only name-checked and no row-level parent evidence is used.',
      args.parentEvidenceRows.some((row) => !row.ok || row.rowLevelEvidenceUsed.length === 0),
      args.parentEvidenceRows.map((row) => `${row.parentId}:${row.ok ? 'ok' : 'not-ok'}:${row.rowLevelEvidenceUsed.length}`).join(', '),
    ),
    falsifierRow(
      'F15',
      'Canonical order is treated as intrinsic natural root recovery.',
      !args.boundaryRows.some((row) => row.boundaryId === 'not-natural-geometric-flag-recovery') ||
        !args.boundaryRows.some((row) => row.boundaryId === 'not-canonical-order-as-intrinsic-identity') ||
        args.rootFlagVertexBridgeRows.some((row) => row.bridgeBasis !== 'canonical-order-with-explicit-boundary'),
      'Root flag bridge rows use canonical-order-with-explicit-boundary and boundary rows mark the limitation.',
    ),
    falsifierRow(
      'F16',
      'Projection-loss rows do not preserve the lossy/restorable/destructive distinction.',
      args.projectionLossRows.length !== 3 ||
        !args.projectionLossRows.some((row) => row.projectionLossStatus === 'structurally-destructive') ||
        !args.projectionLossRows.some((row) => row.projectionLossStatus === 'lossy-but-restorable-with-provenance'),
      args.projectionLossRows.map((row) => `${row.projectionId}:${row.projectionLossStatus}`).join(', '),
    ),
    falsifierRow(
      'F17',
      'Restoration control rows are under-specified for one or more defect classes.',
      args.restorationControlRows.length !== 10 ||
        args.restorationControlRows.some((row) => row.controlStatus !== 'restoration-control-defined'),
      `${args.restorationControlRows.filter((row) => row.controlStatus === 'restoration-control-defined').length}/10 restoration controls defined.`,
    ),
    falsifierRow(
      'F18',
      'Triangle closure bridge is claimed although actual face vertex flags do not match mapped discriminator triangle flags.',
      args.triangleClosureBridgeRows.some(
        (row) => row.closureBridgeStatus === 'triangle-closure-bridged' && !row.actualFaceMatchesMappedFlags,
      ),
      `${args.triangleClosureBridgeRows.filter((row) => row.closureBridgeStatus === 'triangle-closure-bridged' && row.actualFaceMatchesMappedFlags).length}/${args.triangleClosureBridgeRows.length} triangle rows claim only verified actual flag matches.`,
    ),
    falsifierRow(
      'F19',
      'Square holonomy bridge is claimed although actual face vertex flags do not match mapped discriminator square flags.',
      args.squareHolonomyBridgeRows.some(
        (row) => row.holonomyBridgeStatus === 'square-holonomy-bridged' && !row.actualFaceMatchesMappedFlags,
      ),
      `${args.squareHolonomyBridgeRows.filter((row) => row.holonomyBridgeStatus === 'square-holonomy-bridged' && row.actualFaceMatchesMappedFlags).length}/${args.squareHolonomyBridgeRows.length} square rows claim only verified actual flag matches.`,
    ),
    falsifierRow(
      'F20',
      'Canonical index pairing is used as triangle/square bridge without actual face-flag verification.',
      args.triangleClosureBridgeRows.some((row) => row.bridgeBasis === 'canonical-index-only') ||
        args.squareHolonomyBridgeRows.some((row) => row.bridgeBasis === 'canonical-index-only'),
      `triangleCanonicalIndexOnly=${args.triangleClosureBridgeRows.filter((row) => row.bridgeBasis === 'canonical-index-only').length}; squareCanonicalIndexOnly=${args.squareHolonomyBridgeRows.filter((row) => row.bridgeBasis === 'canonical-index-only').length}.`,
    ),
    falsifierRow(
      'F21',
      'Projection-loss defect class is missing from defect/restoration rows.',
      !args.defectRows.some((row) => row.defectClass === 'projection-loss-defect') ||
        !args.restorationControlRows.some((row) => row.controlId === 'control-projection-loss'),
      `projectionLossDefectRows=${args.defectRows.filter((row) => row.defectClass === 'projection-loss-defect').length}; projectionLossControls=${args.restorationControlRows.filter((row) => row.controlId === 'control-projection-loss').length}.`,
    ),
  ];
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly PSimplexT28MParentEvidenceRow[];
  sourceLineageRows: readonly PSimplexT28MSourceLineageRow[];
  cuboctahedronTopologyRows: readonly PSimplexT28MCuboctahedronTopologyRow[];
  rootFlagVertexBridgeRows: readonly PSimplexT28MRootFlagVertexBridgeRow[];
  antipodalRootPairRows: readonly PSimplexT28MAntipodalRootPairRow[];
  centralHexagonRows: readonly PSimplexT28MCentralHexagonRow[];
  centralHexagonIncidenceRows: readonly PSimplexT28MCentralHexagonIncidenceRow[];
  triangleClosureBridgeRows: readonly PSimplexT28MTriangleClosureBridgeRow[];
  squareHolonomyBridgeRows: readonly PSimplexT28MSquareHolonomyBridgeRow[];
  metricEquilibriumRows: readonly PSimplexT28MMetricEquilibriumRow[];
  vertexFigureAlternationRows: readonly PSimplexT28MVertexFigureAlternationRow[];
  provenanceBridgeRows: readonly PSimplexT28MProvenanceBridgeRow[];
  projectionLossRows: readonly PSimplexT28MProjectionLossRow[];
  restorationControlRows: readonly PSimplexT28MRestorationControlRow[];
  defectRows: readonly PSimplexT28MDefectRow[];
  portabilityVerdictRows: readonly PSimplexT28MPortabilityVerdictRow[];
  boundaryRows: readonly PSimplexT28MBoundaryRow[];
  falsifierRows: readonly PSimplexT28MFalsifierRow[];
  summaryVerdict: PSimplexCuboctahedralVectorEquilibriumPortabilityT28MSummaryVerdict;
}): string[] {
  const issues: string[] = [];

  checkCount(issues, 'sourceLineageRows', args.sourceLineageRows.length, EXPECTED_COUNTS.sourceLineageRows);
  checkCount(issues, 'cuboctahedronTopologyRows', args.cuboctahedronTopologyRows.length, EXPECTED_COUNTS.cuboctahedronTopologyRows);
  checkCount(issues, 'rootFlagVertexBridgeRows', args.rootFlagVertexBridgeRows.length, EXPECTED_COUNTS.rootFlagVertexBridgeRows);
  checkCount(issues, 'antipodalRootPairRows', args.antipodalRootPairRows.length, EXPECTED_COUNTS.antipodalRootPairRows);
  checkCount(issues, 'centralHexagonRows', args.centralHexagonRows.length, EXPECTED_COUNTS.centralHexagonRows);
  checkCount(
    issues,
    'centralHexagonIncidenceRows',
    args.centralHexagonIncidenceRows.length,
    EXPECTED_COUNTS.centralHexagonIncidenceRows,
  );
  checkCount(
    issues,
    'triangleClosureBridgeRows',
    args.triangleClosureBridgeRows.length,
    EXPECTED_COUNTS.triangleClosureBridgeRows,
  );
  checkCount(
    issues,
    'squareHolonomyBridgeRows',
    args.squareHolonomyBridgeRows.length,
    EXPECTED_COUNTS.squareHolonomyBridgeRows,
  );
  checkCount(issues, 'metricEquilibriumRows', args.metricEquilibriumRows.length, EXPECTED_COUNTS.metricEquilibriumRows);
  checkCount(
    issues,
    'vertexFigureAlternationRows',
    args.vertexFigureAlternationRows.length,
    EXPECTED_COUNTS.vertexFigureAlternationRows,
  );
  checkCount(issues, 'projectionLossRows', args.projectionLossRows.length, EXPECTED_COUNTS.projectionLossRows);
  checkCount(issues, 'restorationControlRows', args.restorationControlRows.length, EXPECTED_COUNTS.restorationControlRows);
  checkCount(issues, 'defectRows', args.defectRows.length, EXPECTED_COUNTS.defectRows);

  if (!ALLOWED_SUMMARY_VERDICTS.includes(args.summaryVerdict)) {
    issues.push(`summaryVerdict ${args.summaryVerdict} is outside the allowed T28-M verdict vocabulary.`);
  }

  if (REQUIRED_BOUNDARY_IDS.some((boundaryId) => !args.boundaryRows.some((row) => row.boundaryId === boundaryId && row.enforced))) {
    issues.push('One or more required T28-M boundary rows are missing or unenforced.');
  }

  if (REQUIRED_FALSIFIER_IDS.some((falsifierId) => !args.falsifierRows.some((row) => row.falsifierId === falsifierId))) {
    issues.push('One or more required T28-M falsifier rows are missing.');
  }

  if (args.parentEvidenceRows.some((row) => row.rowLevelEvidenceUsed.length === 0)) {
    issues.push('Parent evidence rows must cite row-level evidence usage.');
  }

  if (args.rootFlagVertexBridgeRows.some((row) => row.bridgeAuthority !== 'canonical-preflight-convention-only')) {
    issues.push('Root flag bridge rows must not claim natural geometric recovery in T28-M-R1.');
  }

  const bridgeLineageCounts = countBy(args.rootFlagVertexBridgeRows, (row) => row.lineageId);
  if (Object.values(bridgeLineageCounts).some((count) => count !== 12)) {
    issues.push('Each cuboctahedral lineage must have exactly 12 root flag vertex bridge rows.');
  }

  const vertexFigureLineageCounts = countBy(args.vertexFigureAlternationRows, (row) => row.lineageId);
  if (Object.values(vertexFigureLineageCounts).some((count) => count !== 12)) {
    issues.push('Each cuboctahedral lineage must have exactly 12 vertex figure alternation rows.');
  }

  const triangleLineageCounts = countBy(args.triangleClosureBridgeRows, (row) => row.lineageId);
  if (Object.values(triangleLineageCounts).some((count) => count !== 8)) {
    issues.push('Each cuboctahedral lineage must have exactly 8 triangle closure bridge rows.');
  }

  const squareLineageCounts = countBy(args.squareHolonomyBridgeRows, (row) => row.lineageId);
  if (Object.values(squareLineageCounts).some((count) => count !== 6)) {
    issues.push('Each cuboctahedral lineage must have exactly 6 square holonomy bridge rows.');
  }

  if (args.provenanceBridgeRows.length !== 1) {
    issues.push(`Expected 1 provenance bridge row, got ${args.provenanceBridgeRows.length}.`);
  }

  if (args.defectRows.length !== args.restorationControlRows.length) {
    issues.push('Defect rows and restoration controls must cover the same defect classes.');
  }

  if (
    args.triangleClosureBridgeRows.some(
      (row) => row.closureBridgeStatus === 'triangle-closure-bridged' && row.actualFaceMatchesMappedFlags !== true,
    )
  ) {
    issues.push('A triangle bridge row passes while actualFaceMatchesMappedFlags is not true.');
  }

  if (
    args.squareHolonomyBridgeRows.some(
      (row) => row.holonomyBridgeStatus === 'square-holonomy-bridged' && row.actualFaceMatchesMappedFlags !== true,
    )
  ) {
    issues.push('A square bridge row passes while actualFaceMatchesMappedFlags is not true.');
  }

  if (
    args.triangleClosureBridgeRows.some(
      (row) => row.bridgeBasis === 'canonical-index-only' && row.closureBridgeStatus === 'triangle-closure-bridged',
    )
  ) {
    issues.push('A triangle bridge row uses canonical-index-only basis and still passes.');
  }

  if (
    args.squareHolonomyBridgeRows.some(
      (row) => row.bridgeBasis === 'canonical-index-only' && row.holonomyBridgeStatus === 'square-holonomy-bridged',
    )
  ) {
    issues.push('A square bridge row uses canonical-index-only basis and still passes.');
  }

  if (
    args.triangleClosureBridgeRows.some(
      (row) => row.actualFaceFlagIds.length === 0 || row.actualFaceFlagIds.length !== row.faceVertexIds.length,
    )
  ) {
    issues.push('One or more triangle bridge rows are missing actualFaceFlagIds from the vertex-flag bridge.');
  }

  if (
    args.squareHolonomyBridgeRows.some(
      (row) => row.actualFaceFlagIds.length === 0 || row.actualFaceFlagIds.length !== row.faceVertexIds.length,
    )
  ) {
    issues.push('One or more square bridge rows are missing actualFaceFlagIds from the vertex-flag bridge.');
  }

  if (args.sourceLineageRows.some((row) => row.lineageDistinctnessKey.length === 0)) {
    issues.push('One or more source lineage rows are missing lineageDistinctnessKey.');
  }

  const lineageDistinctnessKeys = args.sourceLineageRows.map((row) => row.lineageDistinctnessKey);
  if (new Set(lineageDistinctnessKeys).size !== lineageDistinctnessKeys.length) {
    issues.push('Source lineage rows contain duplicate lineageDistinctnessKey values.');
  }

  if (!args.defectRows.some((row) => row.defectClass === 'projection-loss-defect')) {
    issues.push('Report omits the projection-loss-defect row.');
  }

  if (!args.restorationControlRows.some((row) => row.controlId === 'control-projection-loss')) {
    issues.push('Report omits the control-projection-loss restoration control.');
  }

  if (!args.projectionLossRows.some((row) => row.projectionId === 'scalar-tuple' && row.projectionLossStatus === 'structurally-destructive')) {
    issues.push('Scalar tuple projection loss must remain classified as structurally destructive.');
  }

  if (!args.portabilityVerdictRows.some((row) => row.axisId === 'projection-loss' && row.status === 'warning-only')) {
    issues.push('Projection-loss portability verdict row must remain warning-only.');
  }

  if (args.falsifierRows.some((row) => boundaryFalsifierId(row.falsifierId) && row.triggered) && args.summaryVerdict !== 'T28-M-boundary-failed') {
    issues.push('Boundary falsifier triggered without the boundary-failed summary verdict.');
  }

  return unique(issues);
}

function classifySummaryVerdict(args: {
  boundaryFailed: boolean;
  sourceLineageRows: readonly PSimplexT28MSourceLineageRow[];
  cuboctahedronTopologyRows: readonly PSimplexT28MCuboctahedronTopologyRow[];
  rootFlagVertexBridgeRows: readonly PSimplexT28MRootFlagVertexBridgeRow[];
  antipodalRootPairRows: readonly PSimplexT28MAntipodalRootPairRow[];
  centralHexagonRows: readonly PSimplexT28MCentralHexagonRow[];
  centralHexagonIncidenceRows: readonly PSimplexT28MCentralHexagonIncidenceRow[];
  triangleClosureBridgeRows: readonly PSimplexT28MTriangleClosureBridgeRow[];
  squareHolonomyBridgeRows: readonly PSimplexT28MSquareHolonomyBridgeRow[];
  metricEquilibriumRows: readonly PSimplexT28MMetricEquilibriumRow[];
  vertexFigureAlternationRows: readonly PSimplexT28MVertexFigureAlternationRow[];
  provenanceBridgeRows: readonly PSimplexT28MProvenanceBridgeRow[];
  restorationControlRows: readonly PSimplexT28MRestorationControlRow[];
  defectRows: readonly PSimplexT28MDefectRow[];
}): PSimplexCuboctahedralVectorEquilibriumPortabilityT28MSummaryVerdict {
  if (args.boundaryFailed) {
    return 'T28-M-boundary-failed';
  }

  if (
    args.sourceLineageRows.some((row) => row.lineageStatus !== 'selected-cuboctahedron-core') ||
    args.cuboctahedronTopologyRows.some((row) => row.topologyStatus !== 'cuboctahedron-verified')
  ) {
    return 'T28-M-dies-at-cuboctahedron-topology';
  }

  if (args.rootFlagVertexBridgeRows.some((row) => row.bridgeStatus !== 'bridged')) {
    return 'T28-M-dies-at-root-flag-identity';
  }

  if (args.antipodalRootPairRows.some((row) => row.antipodalStatus !== 'clean-antipodal-pair')) {
    return 'T28-M-dies-at-antipodal-root-pairing';
  }

  if (
    args.centralHexagonRows.some((row) => row.hexagonStatus !== 'central-hexagon-cycle') ||
    args.centralHexagonIncidenceRows.some((row) => row.incidenceStatus !== 'two-hexagon-incidence')
  ) {
    return 'T28-M-dies-at-central-hexagon-planes';
  }

  if (
    args.triangleClosureBridgeRows.some(
      (row) =>
        row.closureBridgeStatus !== 'triangle-closure-bridged' ||
        row.actualFaceMatchesMappedFlags !== true ||
        row.bridgeBasis === 'canonical-index-only',
    )
  ) {
    return 'T28-M-dies-at-triangle-closure';
  }

  if (
    args.squareHolonomyBridgeRows.some(
      (row) =>
        row.holonomyBridgeStatus !== 'square-holonomy-bridged' ||
        row.actualFaceMatchesMappedFlags !== true ||
        row.bridgeBasis === 'canonical-index-only',
    )
  ) {
    return 'T28-M-dies-at-square-holonomy';
  }

  if (args.metricEquilibriumRows.some((row) => row.metricStatus === 'metric-equilibrium-defect')) {
    return 'T28-M-dies-at-metric-equilibrium';
  }

  if (args.vertexFigureAlternationRows.some((row) => row.alternationStatus !== '3-4-3-4-vertex-figure')) {
    return 'T28-M-dies-at-vertex-figure-alternation';
  }

  if (
    args.provenanceBridgeRows.some(
      (row) =>
        row.provenanceStatus !==
        'three-distinct-cuboctahedral-provenance-paths-with-cube-primal-sourcehood-unsolved',
    )
  ) {
    return 'T28-M-dies-at-provenance-bridge';
  }

  if (
    args.restorationControlRows.some((row) => row.controlStatus !== 'restoration-control-defined') ||
    !args.restorationControlRows.some((row) => row.controlId === 'control-projection-loss') ||
    !args.defectRows.some((row) => row.defectClass === 'projection-loss-defect')
  ) {
    return 'T28-M-under-specified-restoration-control';
  }

  return 'T28-M-cuboctahedral-vector-equilibrium-eligible';
}

function selectSeedCell(shape: Shape, topology: CellTopology): Cell | null {
  return shape.cells.find((cell) => cell.kind === 'seed' && cell.topology === topology) ?? null;
}

function selectLatestCoreCellByCombinedRule(shape: Shape, topology: CellTopology, generationDepth: number): Cell | null {
  const generation = latestGenerationForDepth(shape, generationDepth);
  const createdCellIds = new Set(generation?.createdCellIds ?? []);

  return (
    sortedCells(shape.cells).find((cell) => {
      if (
        cell.kind !== 'core' ||
        cell.topology !== topology ||
        cell.generationDepth !== generationDepth ||
        cell.sourceOperation !== 'ambo-dissection' ||
        !createdCellIds.has(cell.id)
      ) {
        return false;
      }

      return getCellTopologySignature(shape, cell).readinessStatus === 'enabled';
    }) ?? null
  );
}

function latestGenerationForDepth(shape: Shape, generationDepth: number): Shape['generations'][number] | null {
  return [...shape.generations].reverse().find((generation) => generation.depth === generationDepth) ?? null;
}

function getCellFaces(shape: Shape, cell: Cell): Face[] {
  const facesById = new Map(shape.faces.map((face) => [face.id, face]));

  return cell.faceIds
    .map((faceId) => facesById.get(faceId))
    .filter((face): face is Face => Boolean(face));
}

function canonicalCellVertexIds(shape: Shape, cell: Cell): VertexId[] {
  return [...cell.vertexIds].sort((left, right) => {
    const leftPosition = shape.vertices[left]?.position ?? [0, 0, 0];
    const rightPosition = shape.vertices[right]?.position ?? [0, 0, 0];

    return (
      leftPosition[0] - rightPosition[0] ||
      leftPosition[1] - rightPosition[1] ||
      leftPosition[2] - rightPosition[2] ||
      left.localeCompare(right)
    );
  });
}

function canonicalFlagRows(flagRows: readonly A3MedialFlagRow[]): A3MedialFlagRow[] {
  return [...flagRows].sort((left, right) => flagOrder(left.flagId) - flagOrder(right.flagId));
}

function buildCanonicalTriangleGroups(triangleRows: readonly TriangleClosureRow[]): CanonicalTriangleGroup[] {
  return Array.from(groupBy(triangleRows, (row) => row.triangleId).entries())
    .map(([triangleId, rows]) => ({
      triangleId,
      rows: [...rows].sort((left, right) => left.orderedProductId.localeCompare(right.orderedProductId)),
      flagIds: unique(rows.flatMap((row) => [row.leftFlagId, row.rightFlagId, row.targetFlagId])).sort(
        (left, right) => flagOrder(left) - flagOrder(right),
      ),
    }))
    .sort((left, right) => left.triangleId.localeCompare(right.triangleId));
}

function buildCanonicalSquareGroups(squareRows: readonly SquareHolonomyRow[]): CanonicalSquareGroup[] {
  return Array.from(groupBy(squareRows, (row) => row.squareCycleId).entries())
    .map(([squareCycleId, rows]) => ({
      squareCycleId,
      rows: [...rows].sort((left, right) => left.squareHolonomyVariantId.localeCompare(right.squareHolonomyVariantId)),
      flagIds: rows[0]?.flagCycle ? [...rows[0].flagCycle] : [],
    }))
    .sort((left, right) => left.squareCycleId.localeCompare(right.squareCycleId));
}

function groupByFlagSetKey<T extends { flagIds: A3FlagId[] }>(groups: readonly T[]): Map<string, T> {
  const grouped = new Map<string, T>();

  for (const group of groups) {
    const key = flagSetKey(group.flagIds);

    if (!grouped.has(key)) {
      grouped.set(key, group);
    }
  }

  return grouped;
}

function flagSetKey(flagIds: readonly A3FlagId[]): string {
  return unique(flagIds)
    .sort((left, right) => flagOrder(left) - flagOrder(right))
    .join('|');
}

function sameFlagSet(left: readonly A3FlagId[], right: readonly A3FlagId[]): boolean {
  return left.length === right.length && new Set(left).size === left.length && flagSetKey(left) === flagSetKey(right);
}

function isA3FlagId(value: A3FlagId | undefined): value is A3FlagId {
  return typeof value === 'string';
}

function triangleFaceFlagBridgeStatus(args: {
  face: Face | null;
  group: CanonicalTriangleGroup | null;
  missingVertexFlagBridge: boolean;
  actualFaceMatchesMappedFlags: boolean;
}): PSimplexT28MTriangleClosureBridgeRow['faceFlagBridgeStatus'] {
  if (!args.face || !args.group) {
    return 'canonical-index-only-not-accepted';
  }

  if (args.missingVertexFlagBridge) {
    return 'missing-vertex-flag-bridge';
  }

  return args.actualFaceMatchesMappedFlags
    ? 'actual-face-flags-match-discriminator-triangle'
    : 'actual-face-flags-do-not-match-discriminator-triangle';
}

function squareFaceFlagBridgeStatus(args: {
  face: Face | null;
  group: CanonicalSquareGroup | null;
  missingVertexFlagBridge: boolean;
  actualFaceMatchesMappedFlags: boolean;
}): PSimplexT28MSquareHolonomyBridgeRow['faceFlagBridgeStatus'] {
  if (!args.face || !args.group) {
    return 'canonical-index-only-not-accepted';
  }

  if (args.missingVertexFlagBridge) {
    return 'missing-vertex-flag-bridge';
  }

  return args.actualFaceMatchesMappedFlags
    ? 'actual-face-flags-match-discriminator-square'
    : 'actual-face-flags-do-not-match-discriminator-square';
}

function buildAdjacentFlagPairs(flagIds: readonly A3FlagId[]): Array<[A3FlagId, A3FlagId]> {
  const pairs: Array<[A3FlagId, A3FlagId]> = [];

  for (let leftIndex = 0; leftIndex < flagIds.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < flagIds.length; rightIndex += 1) {
      const left = flagIds[leftIndex];
      const right = flagIds[rightIndex];

      if (areAdjacentA3Roots(left, right)) {
        pairs.push([left, right]);
      }
    }
  }

  return pairs.sort(([leftA, leftB], [rightA, rightB]) => leftA.localeCompare(rightA) || leftB.localeCompare(rightB));
}

function areAdjacentA3Roots(leftFlagId: A3FlagId, rightFlagId: A3FlagId): boolean {
  const left = parseFlagId(leftFlagId);
  const right = parseFlagId(rightFlagId);
  const exactOpposite = left.shared === right.omitted && left.omitted === right.shared;

  return !exactOpposite && (left.omitted === right.shared || left.shared === right.omitted);
}

function parseFlagId(flag: A3FlagId): { shared: A3PrimalLabel; omitted: A3PrimalLabel } {
  const [shared, omitted] = flag.split('->') as [A3PrimalLabel, A3PrimalLabel];

  return { shared, omitted };
}

function flagId(shared: A3PrimalLabel, omitted: A3PrimalLabel): A3FlagId {
  return `${shared}->${omitted}`;
}

function flagOrder(flag: A3FlagId): number {
  const parsed = parseFlagId(flag);

  return PRIMAL_LABELS.indexOf(parsed.shared) * PRIMAL_LABELS.length + PRIMAL_LABELS.indexOf(parsed.omitted);
}

function orderedPairKey(left: A3PrimalLabel, right: A3PrimalLabel): string {
  return [left, right].sort((a, b) => PRIMAL_LABELS.indexOf(a) - PRIMAL_LABELS.indexOf(b)).join('-');
}

function addRootCoordinates(
  left: Record<A3PrimalLabel, number>,
  right: Record<A3PrimalLabel, number>,
): Record<A3PrimalLabel, number> {
  return {
    A: (left.A ?? 0) + (right.A ?? 0),
    B: (left.B ?? 0) + (right.B ?? 0),
    C: (left.C ?? 0) + (right.C ?? 0),
    D: (left.D ?? 0) + (right.D ?? 0),
  };
}

function zeroRootCoordinate(): Record<A3PrimalLabel, 0> {
  return { A: 0, B: 0, C: 0, D: 0 };
}

function flagDegree(flagIdValue: A3FlagId, edgePairs: ReadonlyArray<[A3FlagId, A3FlagId]>): number {
  return edgePairs.filter(([left, right]) => left === flagIdValue || right === flagIdValue).length;
}

function isConnectedCycle(flagIds: readonly A3FlagId[], edgePairs: ReadonlyArray<[A3FlagId, A3FlagId]>): boolean {
  if (flagIds.length === 0 || edgePairs.length !== flagIds.length) {
    return false;
  }

  const adjacency = new Map(flagIds.map((flag) => [flag, new Set<A3FlagId>()]));

  for (const [left, right] of edgePairs) {
    adjacency.get(left)?.add(right);
    adjacency.get(right)?.add(left);
  }

  if (Array.from(adjacency.values()).some((neighbors) => neighbors.size !== 2)) {
    return false;
  }

  const start = flagIds[0];
  const visited = new Set<A3FlagId>([start]);
  const stack = [start];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    for (const neighbor of adjacency.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }

  return visited.size === flagIds.length;
}

function buildIncidentFaceAdjacency(faces: readonly Face[], vertexId: string): Map<string, Set<string>> {
  const adjacency = new Map(faces.map((face) => [face.id, new Set<string>()]));

  for (let leftIndex = 0; leftIndex < faces.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < faces.length; rightIndex += 1) {
      const left = faces[leftIndex];
      const right = faces[rightIndex];
      const sharedVertices = left.vertexIds.filter((id) => right.vertexIds.includes(id));

      if (sharedVertices.includes(vertexId) && sharedVertices.length === 2) {
        adjacency.get(left.id)?.add(right.id);
        adjacency.get(right.id)?.add(left.id);
      }
    }
  }

  return adjacency;
}

function walkFaceCycle(faces: readonly Face[], adjacency: Map<string, Set<string>>): Face[] {
  if (faces.length === 0) {
    return [];
  }

  const byId = new Map(faces.map((face) => [face.id, face]));
  const ordered: Face[] = [];
  const start = faces[0];
  let previous: string | null = null;
  let current: string | null = start.id;
  const visited = new Set<string>();

  while (current && !visited.has(current) && ordered.length < faces.length) {
    const face = byId.get(current);

    if (!face) {
      break;
    }

    ordered.push(face);
    visited.add(current);

    const nextFaceId: string | undefined = [...(adjacency.get(current) ?? [])]
      .sort()
      .find((candidate) => candidate !== previous && !visited.has(candidate));
    previous = current;
    current = nextFaceId ?? null;
  }

  return ordered;
}

function isAlternatingFaceSizeCycle(sequence: readonly number[]): boolean {
  if (sequence.length !== 4) {
    return false;
  }

  return sequence.every((size, index) => size !== sequence[(index + 1) % sequence.length]) &&
    sequence.filter((size) => size === 3).length === 2 &&
    sequence.filter((size) => size === 4).length === 2;
}

function emptyMetricRow(lineageId: PSimplexT28MLineageId): PSimplexT28MMetricEquilibriumRow {
  return {
    lineageId,
    cellId: null,
    centroid: [0, 0, 0],
    vertexCount: 0,
    edgeCount: 0,
    radiusValues: [],
    edgeLengthValues: [],
    minRadius: 0,
    maxRadius: 0,
    radiusSpread: 0,
    minEdgeLength: 0,
    maxEdgeLength: 0,
    edgeLengthSpread: 0,
    meanRadius: 0,
    meanEdgeLength: 0,
    radiusEdgeDifference: 0,
    tolerance: NUMERIC_TOLERANCE,
    fallbackTolerance: FALLBACK_GEOMETRY_TOLERANCE,
    metricStatus: 'metric-equilibrium-defect',
  };
}

function restorationControl(
  controlId: string,
  defectClass: PSimplexT28MDefectClass,
  controlType: PSimplexT28MRestorationControlRow['controlType'],
  passLaw: string,
  requiredEvidence: string[],
): PSimplexT28MRestorationControlRow {
  return {
    controlId,
    defectClass,
    controlType,
    passLaw,
    requiredEvidence,
    controlStatus: passLaw.length > 0 && requiredEvidence.length > 0
      ? 'restoration-control-defined'
      : 'restoration-control-under-specified',
  };
}

function defectRow(
  defectClass: PSimplexT28MDefectClass,
  detected: boolean,
  restorationControlId: string,
  evidence: string,
): PSimplexT28MDefectRow {
  return {
    defectClass,
    detected,
    blockingStatus: detected ? 'blocking-if-detected' : 'not-detected',
    restorationControlId,
    evidence,
  };
}

function portabilityVerdict(
  axisId: Exclude<PSimplexT28MPortabilityVerdictRow['axisId'], 'projection-loss'>,
  pass: boolean,
  evidence: string,
): PSimplexT28MPortabilityVerdictRow {
  return {
    axisId,
    status: pass ? 'preflight-pass' : 'preflight-fail',
    evidence,
  };
}

function boundary(boundaryId: PSimplexT28MBoundaryRow['boundaryId'], statement: string): PSimplexT28MBoundaryRow {
  return { boundaryId, statement, enforced: true };
}

function falsifierRow(
  falsifierId: PSimplexT28MFalsifierRow['falsifierId'],
  description: string,
  triggered: boolean,
  evidence: string,
): PSimplexT28MFalsifierRow {
  return {
    falsifierId,
    description,
    triggered,
    evidence,
    status: triggered ? 'triggered' : 'clear',
  };
}

function boundaryFalsifierId(falsifierId: PSimplexT28MFalsifierRow['falsifierId']): boolean {
  return ['F1', 'F3', 'F13', 'F15'].includes(falsifierId);
}

function checkCount(issues: string[], label: string, actual: number, expected: number): void {
  if (actual !== expected) {
    issues.push(`Expected ${expected} ${label}, got ${actual}.`);
  }
}

function sortedCells(cells: readonly Cell[]): Cell[] {
  return [...cells].sort(
    (left, right) =>
      left.generationDepth - right.generationDepth ||
      (left.topology ?? '').localeCompare(right.topology ?? '') ||
      left.kind.localeCompare(right.kind) ||
      left.id.localeCompare(right.id),
  );
}

function faceSort(left: Face, right: Face): number {
  return left.vertexIds.length - right.vertexIds.length || left.id.localeCompare(right.id);
}

function lineageSort(left: PSimplexT28MLineageId, right: PSimplexT28MLineageId): number {
  const order: readonly PSimplexT28MLineageId[] = [
    'octa-g1-cuboctahedron-core',
    'cube-g1-cuboctahedron-core',
    'tetra-g2-cuboctahedron-core',
  ];

  return order.indexOf(left) - order.indexOf(right);
}

function sumVec3(values: readonly Vec3[]): Vec3 {
  return values.reduce<Vec3>((sum, value) => [sum[0] + value[0], sum[1] + value[1], sum[2] + value[2]], [0, 0, 0]);
}

function scaleVec3(value: Vec3, scale: number): Vec3 {
  return [value[0] * scale, value[1] * scale, value[2] * scale];
}

function subVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
}

function dotVec3(left: Vec3, right: Vec3): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function normVec3(value: Vec3): number {
  return Math.sqrt(dotVec3(value, value));
}

function distanceVec3(left: Vec3, right: Vec3): number {
  return normVec3(subVec3(left, right));
}

function cleanVec3(value: Vec3): Vec3 {
  return [cleanNumber(value[0]), cleanNumber(value[1]), cleanNumber(value[2])];
}

function cleanNumber(value: number): number {
  if (Math.abs(value) <= NUMERIC_TOLERANCE) {
    return 0;
  }

  return Number(value.toFixed(12));
}

function minOrZero(values: readonly number[]): number {
  return values.length > 0 ? cleanNumber(Math.min(...values)) : 0;
}

function maxOrZero(values: readonly number[]): number {
  return values.length > 0 ? cleanNumber(Math.max(...values)) : 0;
}

function mean(values: readonly number[]): number {
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function numberSort(left: number, right: number): number {
  return left - right;
}

function histogram(values: readonly number[]): Record<number, number> {
  return values.reduce<Record<number, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function groupBy<T, K>(values: readonly T[], getKey: (value: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();

  for (const value of values) {
    const key = getKey(value);
    groups.set(key, [...(groups.get(key) ?? []), value]);
  }

  return groups;
}

function countBy<T>(values: readonly T[], getKey: (value: T) => string): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = getKey(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}
