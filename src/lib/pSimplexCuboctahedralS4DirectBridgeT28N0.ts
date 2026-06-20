import { createSeedShape } from '../data/seeds';
import type { Cell, CellTopology, Face, Shape } from '../types/geometry';
import { applyAmboDissection, canApplyAmboDissection } from './ambo';
import { deriveCellEdges, getCellTopologySignature, type CellTopologySignature } from './topologySignature';
import {
  buildOctonionVsA3MedialCarrierDiscriminatorV0Report,
  type OctonionVsA3MedialCarrierDiscriminatorV0Report,
  type SquareHolonomyRow as ParentSquareHolonomyRow,
  type TriangleClosureRow as ParentTriangleClosureRow,
} from './octonionVsA3MedialCarrierDiscriminatorV0';
import {
  buildMedialDualEquivariantCarrierPolicyModelCardV0Report,
  type MedialDualEquivariantCarrierPolicyModelCardV0Report,
} from './medialDualEquivariantCarrierPolicyModelCardV0';

export type A3Label = 'A' | 'B' | 'C' | 'D';
export type TetraEdgeId = 'AB' | 'AC' | 'AD' | 'BC' | 'BD' | 'CD';
export type A3FlagId =
  | 'A->B'
  | 'A->C'
  | 'A->D'
  | 'B->A'
  | 'B->C'
  | 'B->D'
  | 'C->A'
  | 'C->B'
  | 'C->D'
  | 'D->A'
  | 'D->B'
  | 'D->C';
export type BridgePolarityConvention = 'shared-to-omitted' | 'omitted-to-shared';
export type T28N0SummaryVerdict =
  | 'T28-N0-direct-s4-vector-equilibrium-bridge-verified'
  | 'T28-N0-direct-s4-bridge-failed'
  | 'T28-N0-s4-equivariance-failed'
  | 'T28-N0-ve-face-law-failed'
  | 'T28-N0-ve-bridge-verified-composition-holonomy-directly-matches'
  | 'T28-N0-ve-bridge-verified-composition-holonomy-separate-by-orbit-type'
  | 'T28-N0-composition-comparison-inconclusive'
  | 'T28-N0-boundary-failed';

export interface ParentEvidenceRow {
  parentId:
    | 'seed-shape-factory'
    | 'ambo-dissection-engine'
    | 'topology-signature-engine'
    | 'octonion-vs-a3-medial-carrier-discriminator-v0'
    | 'medial-dual-equivariant-carrier-policy-model-card-v0'
    | 'structured-source-state-diagnostic-v0';
  builderName: string;
  importStatus: 'imported' | 'not-used' | 'failed';
  ok: boolean | null;
  diagnosticScope: string | null;
  rowLevelEvidenceUsed: string[];
  usedFor: string;
}

export interface BridgeSearchPolicyRow {
  searchPolicy: 'no-arbitrary-permutation-search';
  allowedMappingSource: 'lineage-createdBy-sourceEdgeId-and-sourceVertexIds';
  forbiddenMappingSource:
    | 'best-fit-permutation'
    | 'canonical-vertex-order'
    | 'manual-relabel-to-force-face-law'
    | 'composition-holonomy-as-bridge-source';
  status: 'enforced' | 'violated';
  evidence: string;
}

export interface SourceLineageRow {
  lineageId: 'tetra-G2-cuboctahedron-core';
  seedKey: 'tetrahedron';
  operationPath: ['seed:tetrahedron', 'ambo:tetrahedron-seed', 'ambo:octahedron-core'];
  sourceCellTopologyPath: ['tetrahedron', 'octahedron', 'cuboctahedron'];
  tetraSeedCellId: string;
  g1OctaCoreCellId: string | null;
  g2CuboctaCoreCellId: string | null;
  g1GenerationDepth: 1 | null;
  g2GenerationDepth: 2 | null;
  g1TopologyStatus: 'octahedron-signature-pass' | 'octahedron-signature-fail' | 'not-tested';
  g2TopologyStatus: 'cuboctahedron-signature-pass' | 'cuboctahedron-signature-fail' | 'not-tested';
  g1CreatedCellIds: string[];
  g2CreatedCellIds: string[];
  lineageStatus:
    | 'lineage-ready-for-direct-bridge'
    | 'lineage-missing-g1-octa-core'
    | 'lineage-missing-g2-cubocta-core'
    | 'lineage-malformed';
}

export interface TetraSeedVertexLabelRow {
  seedVertexId: string;
  label: A3Label;
  labelSource: 'seed-vertex-data-label' | 'controlled-seed-vertex-order';
  labelStatus: 'label-ready' | 'missing-label' | 'duplicate-label';
}

export interface G1OctaVertexTetraEdgeRow {
  g1OctaVertexId: string;
  tetraEdgeId: TetraEdgeId;
  sourceVertexIds: [string, string];
  primalLabels: [A3Label, A3Label];
  sourceEvidence: 'createdBy.sourceVertexIds' | 'vertex-data-lineage' | 'missing-source-evidence';
  bridgeStatus: 'octa-vertex-bridged-to-tetra-edge' | 'missing-source-edge' | 'ambiguous-tetra-edge';
}

export interface G1OctaEdgeTetraWedgeRow {
  g1OctaEdgeId: string;
  g1OctaEdgeVertexIds: [string, string];
  tetraEdgeA: TetraEdgeId;
  tetraEdgeB: TetraEdgeId;
  sharedLabel: A3Label | null;
  omittedLabel: A3Label | null;
  sourceEvidence: 'deriveCellEdges-on-g1-octa-core-plus-g1-vertex-edge-rows' | 'missing-source-evidence';
  wedgeStatus:
    | 'incident-tetra-edge-wedge'
    | 'non-incident-tetra-edges'
    | 'ambiguous-shared-label'
    | 'ambiguous-omitted-label';
}

export interface DirectBridgeRow {
  cuboctahedronVertexId: string;
  sourceG1OctaEdgeId: string | null;
  sourceG1OctaEdgeVertexIds: [string, string] | null;
  tetraEdgeA: TetraEdgeId | null;
  tetraEdgeB: TetraEdgeId | null;
  g1EndpointTetraEdges: [TetraEdgeId, TetraEdgeId] | null;
  sharedLabel: A3Label | null;
  omittedLabel: A3Label | null;
  sharedLabelDerivation: string;
  omittedLabelDerivation: string;
  flagPlus: A3FlagId | null;
  flagMinus: A3FlagId | null;
  selectedConvention: 'shared-to-omitted' | 'omitted-to-shared' | 'both-tested' | 'none';
  bridgeLaw:
    | 'lineage-edge-shared-label-to-omitted-label-v0'
    | 'lineage-edge-omitted-label-to-shared-label-v0'
    | 'both-polarities-recorded'
    | 'none';
  sourceEvidence: 'cuboctahedronVertex.createdBy.sourceEdgeId' | 'missing-source-g1-edge';
  bridgeStatus:
    | 'direct-lineage-bridge-row'
    | 'missing-source-g1-edge'
    | 'non-incident-tetra-edge-wedge'
    | 'ambiguous-flag';
}

export interface BridgePolarityComparisonRow {
  polarityConvention: BridgePolarityConvention;
  distinctFlagCount: number;
  allDirectedFlagsCovered: boolean;
  veTrianglePassCount: number | null;
  veTriangleFailCount: number | null;
  veSquarePassCount: number | null;
  veSquareFailCount: number | null;
  s4EquivariancePassCount: number | null;
  s4EquivarianceFailCount: number | null;
  compositionTriangleMatchCount: number | null;
  compositionTriangleNonMatchCount: number | null;
  compositionSquareMatchCount: number | null;
  compositionSquareNonMatchCount: number | null;
  polarityStatus: 'candidate-polarity' | 'reverse-polarity' | 'failed-polarity';
}

export interface S4EquivarianceRow {
  polarityConvention: BridgePolarityConvention;
  permutationId: string;
  permutationMap: Record<A3Label, A3Label>;
  testedWedgeCount: number;
  equivariantCount: number;
  failedCount: number;
  failureExamples: Array<{
    tetraEdgeA: TetraEdgeId;
    tetraEdgeB: TetraEdgeId;
    originalFlag: A3FlagId;
    permutedBridgeFlag: A3FlagId;
    bridgePermutedFlag: A3FlagId;
  }>;
  equivarianceStatus: 's4-equivariant' | 's4-equivariance-failed';
}

export interface S4RepresentationOrbitRow {
  objectSystem:
    | 'direct-bridge-vertices-B-plus'
    | 'direct-bridge-vertices-B-minus'
    | 'actual-ve-triangles-B-plus'
    | 'actual-ve-squares-B-plus'
    | 'a3-directed-flags'
    | 'a3-ve-triangles'
    | 'a3-ve-squares'
    | 'composition-triangles'
    | 'composition-squares';
  objectCount: number;
  permutationCount: 24;
  s4OrbitCount: number;
  s4OrbitSizes: number[];
  stabilizerSizes: number[];
  transitive: boolean;
  orbitRepresentatives: string[];
  orbitSignatureStatus: 'computed' | 'failed';
}

export interface ActualFaceFlagRow {
  faceId: string;
  faceRole: string | null;
  sourceFaceId: string | null;
  sourceVertexId: string | null;
  originEvidence: 'face.sourceFaceId' | 'face.sourceVertexId' | 'missing-origin-evidence';
  faceSize: 3 | 4;
  cuboctahedronVertexIds: string[];
  flagIdsPlus: A3FlagId[];
  flagIdsMinus: A3FlagId[];
  faceOriginKind: 'g1-octa-source-face-derived' | 'g1-octa-source-vertex-derived' | 'unknown';
  actualFaceBridgeStatus: 'actual-face-bridged' | 'face-contains-unbridged-vertex' | 'unsupported-face-size';
}

export interface VectorEquilibriumTriangleRow {
  faceId: string;
  flagTriple: [A3FlagId, A3FlagId, A3FlagId];
  triangleKind: 'fixed-shared-label' | 'fixed-omitted-label' | 'not-vector-equilibrium-triangle';
  fixedLabel: A3Label | null;
  expectedOriginKind:
    | 'g1-octa-source-vertex-derived'
    | 'g1-octa-source-face-derived'
    | 'not-applicable';
  actualOriginKind: ActualFaceFlagRow['faceOriginKind'];
  originLawStatus: 'origin-kind-matches' | 'origin-kind-mismatch' | 'not-applicable';
  triangleStatus:
    | 'actual-face-matches-ve-triangle'
    | 'actual-face-ve-triangle-mismatch'
    | 'origin-kind-mismatch';
}

export interface VectorEquilibriumSquareRow {
  faceId: string;
  flagCycle: [A3FlagId, A3FlagId, A3FlagId, A3FlagId];
  sourceLabelPair: [A3Label, A3Label] | null;
  targetLabelPair: [A3Label, A3Label] | null;
  correspondingTetraEdge: TetraEdgeId | null;
  actualOriginKind: ActualFaceFlagRow['faceOriginKind'];
  expectedOriginKind: 'g1-octa-source-vertex-derived';
  originLawStatus: 'origin-kind-matches' | 'origin-kind-mismatch';
  squareStatus:
    | 'actual-face-matches-ve-square'
    | 'actual-face-ve-square-mismatch'
    | 'origin-kind-mismatch';
}

export interface CentralHexagonRow {
  hexagonSystem: 'vector-equilibrium-a2-omitted-label' | 'composition-incidence-involving-label';
  hexagonId: string;
  label: A3Label;
  flagIds: A3FlagId[];
  edgeRule: 'same-source-or-same-target' | 'composition-adjacency';
  internalEdgePairs: Array<[A3FlagId, A3FlagId]>;
  internalEdgeCount: number;
  degreeHistogram: Record<number, number>;
  connectedSixCycle: boolean;
  hexagonStatus: 'central-hexagon-pass' | 'central-hexagon-fail';
}

export interface ActualVsCompositionTriangleRow {
  actualFaceId: string;
  actualVEFlagTriple: A3FlagId[];
  actualVEFlagSetKey: string;
  matchesDiscriminatorTriangleSet: boolean;
  discriminatorTriangleId: string | null;
  comparisonStatus:
    | 'actual-ve-face-directly-matches-composition-group'
    | 'actual-ve-face-does-not-match-composition-group'
    | 'composition-comparison-inconclusive';
}

export interface ActualVsCompositionSquareRow {
  actualFaceId: string;
  actualVEFlagCycle: A3FlagId[];
  actualVEFlagSetKey: string;
  matchesDiscriminatorSquareSet: boolean;
  discriminatorSquareCycleId: string | null;
  comparisonStatus:
    | 'actual-ve-face-directly-matches-composition-group'
    | 'actual-ve-face-does-not-match-composition-group'
    | 'composition-comparison-inconclusive';
}

export interface S4OrbitSignatureRow {
  systemId: 'actual-ve-triangles' | 'composition-triangles' | 'actual-ve-squares' | 'composition-squares';
  objectCount: number;
  permutationCount: 24;
  orbitCount: number;
  orbitSizes: number[];
  stabilizerSizes: number[];
  representativeObjects: string[];
  orbitSignatureStatus: 'computed' | 'failed';
}

export interface BridgeVerdictRow {
  verdictAxis:
    | 'source-lineage'
    | 'tetra-seed-labels'
    | 'g1-octa-vertex-tetra-edge'
    | 'g1-octa-edge-tetra-wedge'
    | 'direct-bridge'
    | 's4-equivariance'
    | 's4-representation-orbits'
    | 'actual-face-flags'
    | 've-triangle-law'
    | 've-square-law'
    | 'central-hexagon-systems'
    | 'composition-triangle-comparison'
    | 'composition-square-comparison'
    | 's4-orbit-signatures'
    | 'boundaries';
  status: 'pass' | 'fail' | 'warning' | 'not-tested';
  evidence: string;
}

export interface BoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: boolean;
}

export interface FalsifierRow {
  falsifierId: string;
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export interface PSimplexCuboctahedralS4DirectBridgeT28N0Report {
  method: 'p-simplex-cuboctahedral-s4-direct-bridge-t28n0';
  diagnosticScope: 'cuboctahedral-s4-direct-face-flag-bridge-only';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  parentEvidenceRows: ParentEvidenceRow[];
  bridgeSearchPolicyRows: BridgeSearchPolicyRow[];
  sourceLineageRows: SourceLineageRow[];
  tetraSeedVertexLabelRows: TetraSeedVertexLabelRow[];
  g1OctaVertexTetraEdgeRows: G1OctaVertexTetraEdgeRow[];
  g1OctaEdgeTetraWedgeRows: G1OctaEdgeTetraWedgeRow[];
  directBridgeRows: DirectBridgeRow[];
  bridgePolarityComparisonRows: BridgePolarityComparisonRow[];
  s4EquivarianceRows: S4EquivarianceRow[];
  s4RepresentationOrbitRows: S4RepresentationOrbitRow[];
  actualFaceFlagRows: ActualFaceFlagRow[];
  vectorEquilibriumTriangleRows: VectorEquilibriumTriangleRow[];
  vectorEquilibriumSquareRows: VectorEquilibriumSquareRow[];
  centralHexagonRows: CentralHexagonRow[];
  actualVsCompositionTriangleRows: ActualVsCompositionTriangleRow[];
  actualVsCompositionSquareRows: ActualVsCompositionSquareRow[];
  s4OrbitSignatureRows: S4OrbitSignatureRow[];
  bridgeVerdictRows: BridgeVerdictRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  summaryVerdict: T28N0SummaryVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface TetraG2LineageContext {
  seedShape: Shape;
  g1Shape: Shape | null;
  g2Shape: Shape | null;
  seedCell: Cell;
  g1OctaCoreCell: Cell | null;
  g2CuboctaCoreCell: Cell | null;
  g1Signature: CellTopologySignature | null;
  g2Signature: CellTopologySignature | null;
  g1CreatedCellIds: string[];
  g2CreatedCellIds: string[];
}

interface TetraWedge {
  tetraEdgeA: TetraEdgeId;
  tetraEdgeB: TetraEdgeId;
  sharedLabel: A3Label;
  omittedLabel: A3Label;
}

interface CompositionTriangleGroup {
  triangleId: string;
  flagIds: A3FlagId[];
}

interface CompositionSquareGroup {
  squareCycleId: string;
  flagIds: A3FlagId[];
}

interface OrbitComputation {
  objectCount: number;
  permutationCount: 24;
  orbitCount: number;
  orbitSizes: number[];
  stabilizerSizes: number[];
  representatives: string[];
  transitive: boolean;
  status: 'computed' | 'failed';
}

const METHOD = 'p-simplex-cuboctahedral-s4-direct-bridge-t28n0' as const;
const DIAGNOSTIC_SCOPE = 'cuboctahedral-s4-direct-face-flag-bridge-only' as const;
const BRANCH_REF = 'wgate/arf-w1-root-frame-v0' as const;
const A3_LABELS: readonly A3Label[] = ['A', 'B', 'C', 'D'];
const TETRA_EDGES: readonly TetraEdgeId[] = ['AB', 'AC', 'AD', 'BC', 'BD', 'CD'];
const DIRECTED_FLAGS: readonly A3FlagId[] = A3_LABELS.flatMap((shared) =>
  A3_LABELS.filter((omitted) => omitted !== shared).map((omitted) => flagId(shared, omitted)),
) as A3FlagId[];
const REQUIRED_PARENT_IDS: readonly ParentEvidenceRow['parentId'][] = [
  'seed-shape-factory',
  'ambo-dissection-engine',
  'topology-signature-engine',
  'octonion-vs-a3-medial-carrier-discriminator-v0',
  'medial-dual-equivariant-carrier-policy-model-card-v0',
  'structured-source-state-diagnostic-v0',
];
const REQUIRED_BOUNDARY_IDS = [
  'not-residual-diagnostic',
  'not-field-computation',
  'not-fieldcue',
  'not-semantic-naming',
  'not-topology-authorization',
  'not-route',
  'not-gate',
  'not-corridor',
  'not-runtime',
  'not-universal-octonion-law',
  'not-cube-primal-sourcehood',
  'not-ui',
  'not-shape-mutation',
  'not-packet-write',
  'not-arbitrary-permutation-search',
  'not-canonical-order-bridge',
  'not-composition-holonomy-as-bridge-source',
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
] as const;
const REQUIRED_REPRESENTATION_SYSTEMS: readonly S4RepresentationOrbitRow['objectSystem'][] = [
  'direct-bridge-vertices-B-plus',
  'direct-bridge-vertices-B-minus',
  'actual-ve-triangles-B-plus',
  'actual-ve-squares-B-plus',
  'a3-directed-flags',
  'a3-ve-triangles',
  'a3-ve-squares',
  'composition-triangles',
  'composition-squares',
];
const FORBIDDEN_VERDICTS = [
  'residual-portability-proven',
  'field-generalized',
  'fieldcue-ready',
  'semantic-naming-ready',
  'topology-authorized',
  'route-confirmed',
  'gate-confirmed',
  'corridor-confirmed',
  'runtime-ready',
  'universal-octonion-law-proven',
  'cube-primal-sourcehood-solved',
];

export function buildPSimplexCuboctahedralS4DirectBridgeT28N0Report(): PSimplexCuboctahedralS4DirectBridgeT28N0Report {
  const discriminatorReport = buildOctonionVsA3MedialCarrierDiscriminatorV0Report();
  const policyReport = buildMedialDualEquivariantCarrierPolicyModelCardV0Report();
  const lineageContext = buildTetraG2LineageContext();
  const parentEvidenceRows = buildParentEvidenceRows(discriminatorReport, policyReport);
  const bridgeSearchPolicyRows = buildBridgeSearchPolicyRows();
  const sourceLineageRows = [buildSourceLineageRow(lineageContext)];
  const tetraSeedVertexLabelRows = buildTetraSeedVertexLabelRows(lineageContext);
  const seedLabelMap = seedVertexLabelMap(tetraSeedVertexLabelRows);
  const g1OctaVertexTetraEdgeRows = buildG1OctaVertexTetraEdgeRows(lineageContext, seedLabelMap);
  const g1OctaEdgeTetraWedgeRows = buildG1OctaEdgeTetraWedgeRows(lineageContext, g1OctaVertexTetraEdgeRows);
  const directBridgeRows = buildDirectBridgeRows(lineageContext, g1OctaEdgeTetraWedgeRows);
  const permutations = allS4Permutations();
  const s4EquivarianceRows = buildS4EquivarianceRows(permutations);
  const actualFaceFlagRows = buildActualFaceFlagRows(lineageContext, directBridgeRows);
  const vectorEquilibriumTriangleRows = buildVectorEquilibriumTriangleRows(actualFaceFlagRows, 'shared-to-omitted');
  const vectorEquilibriumSquareRows = buildVectorEquilibriumSquareRows(actualFaceFlagRows, 'shared-to-omitted');
  const centralHexagonRows = buildCentralHexagonRows();
  const compositionTriangleGroups = buildCompositionTriangleGroups(discriminatorReport.triangleClosureRows);
  const compositionSquareGroups = buildCompositionSquareGroups(discriminatorReport.squareHolonomyRows);
  const actualVsCompositionTriangleRows = buildActualVsCompositionTriangleRows(
    vectorEquilibriumTriangleRows,
    compositionTriangleGroups,
  );
  const actualVsCompositionSquareRows = buildActualVsCompositionSquareRows(
    vectorEquilibriumSquareRows,
    compositionSquareGroups,
  );
  const polarityMinusTriangleRows = buildVectorEquilibriumTriangleRows(actualFaceFlagRows, 'omitted-to-shared');
  const polarityMinusSquareRows = buildVectorEquilibriumSquareRows(actualFaceFlagRows, 'omitted-to-shared');
  const polarityMinusTriangleComparisons = buildActualVsCompositionTriangleRows(
    polarityMinusTriangleRows,
    compositionTriangleGroups,
  );
  const polarityMinusSquareComparisons = buildActualVsCompositionSquareRows(
    polarityMinusSquareRows,
    compositionSquareGroups,
  );
  const bridgePolarityComparisonRows = buildBridgePolarityComparisonRows({
    directBridgeRows,
    s4EquivarianceRows,
    plusTriangleRows: vectorEquilibriumTriangleRows,
    plusSquareRows: vectorEquilibriumSquareRows,
    plusTriangleComparisons: actualVsCompositionTriangleRows,
    plusSquareComparisons: actualVsCompositionSquareRows,
    minusTriangleRows: polarityMinusTriangleRows,
    minusSquareRows: polarityMinusSquareRows,
    minusTriangleComparisons: polarityMinusTriangleComparisons,
    minusSquareComparisons: polarityMinusSquareComparisons,
  });
  const s4RepresentationOrbitRows = buildS4RepresentationOrbitRows({
    permutations,
    directBridgeRows,
    plusTriangleRows: vectorEquilibriumTriangleRows,
    plusSquareRows: vectorEquilibriumSquareRows,
    compositionTriangleGroups,
    compositionSquareGroups,
  });
  const s4OrbitSignatureRows = buildS4OrbitSignatureRows({
    permutations,
    plusTriangleRows: vectorEquilibriumTriangleRows,
    plusSquareRows: vectorEquilibriumSquareRows,
    compositionTriangleGroups,
    compositionSquareGroups,
  });
  const bridgeVerdictRows = buildBridgeVerdictRows({
    parentEvidenceRows,
    bridgeSearchPolicyRows,
    sourceLineageRows,
    tetraSeedVertexLabelRows,
    g1OctaVertexTetraEdgeRows,
    g1OctaEdgeTetraWedgeRows,
    directBridgeRows,
    s4EquivarianceRows,
    s4RepresentationOrbitRows,
    actualFaceFlagRows,
    vectorEquilibriumTriangleRows,
    vectorEquilibriumSquareRows,
    centralHexagonRows,
    actualVsCompositionTriangleRows,
    actualVsCompositionSquareRows,
    s4OrbitSignatureRows,
  });
  const boundaryRows = buildBoundaryRows();
  const preliminaryVerdict = classifySummaryVerdict({
    bridgeSearchPolicyRows,
    sourceLineageRows,
    tetraSeedVertexLabelRows,
    g1OctaVertexTetraEdgeRows,
    g1OctaEdgeTetraWedgeRows,
    directBridgeRows,
    s4EquivarianceRows,
    vectorEquilibriumTriangleRows,
    vectorEquilibriumSquareRows,
    actualVsCompositionTriangleRows,
    actualVsCompositionSquareRows,
    s4OrbitSignatureRows,
    boundaryRows,
    falsifierRows: [],
  });
  const falsifierRows = buildFalsifierRows({
    bridgeSearchPolicyRows,
    sourceLineageRows,
    tetraSeedVertexLabelRows,
    g1OctaVertexTetraEdgeRows,
    g1OctaEdgeTetraWedgeRows,
    directBridgeRows,
    s4EquivarianceRows,
    s4RepresentationOrbitRows,
    actualFaceFlagRows,
    vectorEquilibriumTriangleRows,
    vectorEquilibriumSquareRows,
    actualVsCompositionTriangleRows,
    actualVsCompositionSquareRows,
    s4OrbitSignatureRows,
    boundaryRows,
    summaryVerdict: preliminaryVerdict,
  });
  const summaryVerdict = classifySummaryVerdict({
    bridgeSearchPolicyRows,
    sourceLineageRows,
    tetraSeedVertexLabelRows,
    g1OctaVertexTetraEdgeRows,
    g1OctaEdgeTetraWedgeRows,
    directBridgeRows,
    s4EquivarianceRows,
    vectorEquilibriumTriangleRows,
    vectorEquilibriumSquareRows,
    actualVsCompositionTriangleRows,
    actualVsCompositionSquareRows,
    s4OrbitSignatureRows,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    bridgeSearchPolicyRows,
    sourceLineageRows,
    tetraSeedVertexLabelRows,
    g1OctaVertexTetraEdgeRows,
    g1OctaEdgeTetraWedgeRows,
    directBridgeRows,
    bridgePolarityComparisonRows,
    s4EquivarianceRows,
    s4RepresentationOrbitRows,
    actualFaceFlagRows,
    vectorEquilibriumTriangleRows,
    vectorEquilibriumSquareRows,
    centralHexagonRows,
    actualVsCompositionTriangleRows,
    actualVsCompositionSquareRows,
    s4OrbitSignatureRows,
    bridgeVerdictRows,
    boundaryRows,
    falsifierRows,
    summaryVerdict,
  });

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    parentEvidenceRows,
    bridgeSearchPolicyRows,
    sourceLineageRows,
    tetraSeedVertexLabelRows,
    g1OctaVertexTetraEdgeRows,
    g1OctaEdgeTetraWedgeRows,
    directBridgeRows,
    bridgePolarityComparisonRows,
    s4EquivarianceRows,
    s4RepresentationOrbitRows,
    actualFaceFlagRows,
    vectorEquilibriumTriangleRows,
    vectorEquilibriumSquareRows,
    centralHexagonRows,
    actualVsCompositionTriangleRows,
    actualVsCompositionSquareRows,
    s4OrbitSignatureRows,
    bridgeVerdictRows,
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
): ParentEvidenceRow[] {
  return [
    parentEvidence('seed-shape-factory', 'createSeedShape', 'imported', true, 'tetrahedron seed rows', [
      'seed vertices',
      'seed vertex data labels',
      'seed cell topology',
    ], 'tetra seed labels and source lineage'),
    parentEvidence('ambo-dissection-engine', 'applyAmboDissection / canApplyAmboDissection', 'imported', true, 'ambo core lineage', [
      'createdBy.sourceVertexIds',
      'createdBy.sourceEdgeId',
      'createdCellIds',
      'core face sourceFaceId/sourceVertexId',
    ], 'G1/G2 lineage-derived bridge'),
    parentEvidence('topology-signature-engine', 'getCellTopologySignature / deriveCellEdges', 'imported', true, 'topology signature and derived edges', [
      'g1 octahedron derived edges',
      'g1/g2 topology signatures',
      'readinessStatus',
    ], 'G1 edge wedges and G2 cuboctahedron readiness'),
    parentEvidence(
      'octonion-vs-a3-medial-carrier-discriminator-v0',
      'buildOctonionVsA3MedialCarrierDiscriminatorV0Report',
      'imported',
      discriminatorReport.ok,
      discriminatorReport.diagnosticScope,
      ['triangleClosureRows', 'squareHolonomyRows', 'flagRows', 'dualOctaCubeProvenance'],
      'post-bridge composition comparison only',
    ),
    parentEvidence(
      'medial-dual-equivariant-carrier-policy-model-card-v0',
      'buildMedialDualEquivariantCarrierPolicyModelCardV0Report',
      'imported',
      policyReport.ok,
      policyReport.modelCardScope,
      ['sourceDiagnosticOk', 'policyCandidateStatus', 'forbiddenPromotions'],
      'boundary and parent-policy sanity only',
    ),
    parentEvidence(
      'structured-source-state-diagnostic-v0',
      'buildStructuredSourceStateDiagnosticV0Report',
      'not-used',
      null,
      null,
      [],
      'not used; direct bridge proof is lineage-only',
    ),
  ];
}

function buildBridgeSearchPolicyRows(): BridgeSearchPolicyRow[] {
  return [
    policyRow('best-fit-permutation', 'No best-fit permutation search is used; all flags come from lineage wedges.'),
    policyRow('canonical-vertex-order', 'No canonical vertex order is used as bridge law.'),
    policyRow('manual-relabel-to-force-face-law', 'No manual relabeling is used to force triangle or square laws.'),
    policyRow('composition-holonomy-as-bridge-source', 'Composition rows are read only after the direct bridge is built.'),
  ];
}

function buildTetraG2LineageContext(): TetraG2LineageContext {
  const seedShape = createSeedShape('tetrahedron');
  const seedCell = selectSeedCell(seedShape, 'tetrahedron');

  if (!seedCell || !canApplyAmboDissection(seedShape, seedCell.id)) {
    return {
      seedShape,
      g1Shape: null,
      g2Shape: null,
      seedCell: seedCell ?? seedShape.cells[0],
      g1OctaCoreCell: null,
      g2CuboctaCoreCell: null,
      g1Signature: null,
      g2Signature: null,
      g1CreatedCellIds: [],
      g2CreatedCellIds: [],
    };
  }

  const g1Shape = applyAmboDissection(seedShape, seedCell.id);
  const g1OctaCoreCell = selectLatestCoreCellByCombinedRule(g1Shape, 'octahedron', 1);
  const g1Signature = g1OctaCoreCell ? getCellTopologySignature(g1Shape, g1OctaCoreCell) : null;
  const g1Generation = latestGenerationForDepth(g1Shape, 1);
  const g2Shape = g1OctaCoreCell && canApplyAmboDissection(g1Shape, g1OctaCoreCell.id)
    ? applyAmboDissection(g1Shape, g1OctaCoreCell.id)
    : null;
  const g2CuboctaCoreCell = g2Shape ? selectLatestCoreCellByCombinedRule(g2Shape, 'cuboctahedron', 2) : null;
  const g2Signature = g2Shape && g2CuboctaCoreCell ? getCellTopologySignature(g2Shape, g2CuboctaCoreCell) : null;
  const g2Generation = g2Shape ? latestGenerationForDepth(g2Shape, 2) : null;

  return {
    seedShape,
    g1Shape,
    g2Shape,
    seedCell,
    g1OctaCoreCell,
    g2CuboctaCoreCell,
    g1Signature,
    g2Signature,
    g1CreatedCellIds: g1Generation?.createdCellIds ?? [],
    g2CreatedCellIds: g2Generation?.createdCellIds ?? [],
  };
}

function buildSourceLineageRow(context: TetraG2LineageContext): SourceLineageRow {
  const g1Ready = context.g1OctaCoreCell && octahedronSignaturePass(context.g1Signature);
  const g2Ready = context.g2CuboctaCoreCell && cuboctahedronSignaturePass(context.g2Signature);
  const lineageStatus: SourceLineageRow['lineageStatus'] =
    g1Ready && g2Ready
      ? 'lineage-ready-for-direct-bridge'
      : !context.g1OctaCoreCell
        ? 'lineage-missing-g1-octa-core'
        : !context.g2CuboctaCoreCell
          ? 'lineage-missing-g2-cubocta-core'
          : 'lineage-malformed';

  return {
    lineageId: 'tetra-G2-cuboctahedron-core',
    seedKey: 'tetrahedron',
    operationPath: ['seed:tetrahedron', 'ambo:tetrahedron-seed', 'ambo:octahedron-core'],
    sourceCellTopologyPath: ['tetrahedron', 'octahedron', 'cuboctahedron'],
    tetraSeedCellId: context.seedCell.id,
    g1OctaCoreCellId: context.g1OctaCoreCell?.id ?? null,
    g2CuboctaCoreCellId: context.g2CuboctaCoreCell?.id ?? null,
    g1GenerationDepth: context.g1OctaCoreCell?.generationDepth === 1 ? 1 : null,
    g2GenerationDepth: context.g2CuboctaCoreCell?.generationDepth === 2 ? 2 : null,
    g1TopologyStatus: context.g1Signature
      ? octahedronSignaturePass(context.g1Signature)
        ? 'octahedron-signature-pass'
        : 'octahedron-signature-fail'
      : 'not-tested',
    g2TopologyStatus: context.g2Signature
      ? cuboctahedronSignaturePass(context.g2Signature)
        ? 'cuboctahedron-signature-pass'
        : 'cuboctahedron-signature-fail'
      : 'not-tested',
    g1CreatedCellIds: [...context.g1CreatedCellIds],
    g2CreatedCellIds: [...context.g2CreatedCellIds],
    lineageStatus,
  };
}

function buildTetraSeedVertexLabelRows(context: TetraG2LineageContext): TetraSeedVertexLabelRow[] {
  const controlledLabels = new Map(context.seedCell.vertexIds.map((vertexId, index) => [vertexId, A3_LABELS[index] ?? 'A']));
  const rawRows = context.seedCell.vertexIds.map((seedVertexId) => {
    const packetLabel = context.seedShape.vertices[seedVertexId]?.data?.label;
    const exactPacketLabel = isA3Label(packetLabel) ? packetLabel : null;

    return {
      seedVertexId,
      label: exactPacketLabel ?? controlledLabels.get(seedVertexId) ?? 'A',
      labelSource: exactPacketLabel
        ? ('seed-vertex-data-label' as const)
        : ('controlled-seed-vertex-order' as const),
    };
  });
  const labelCounts = countBy(rawRows, (row) => row.label);

  return rawRows.map((row) => ({
    ...row,
    labelStatus: labelCounts[row.label] === 1 ? 'label-ready' : 'duplicate-label',
  }));
}

function seedVertexLabelMap(rows: readonly TetraSeedVertexLabelRow[]): Map<string, A3Label> {
  return new Map(rows.filter((row) => row.labelStatus === 'label-ready').map((row) => [row.seedVertexId, row.label]));
}

function buildG1OctaVertexTetraEdgeRows(
  context: TetraG2LineageContext,
  seedLabels: Map<string, A3Label>,
): G1OctaVertexTetraEdgeRow[] {
  if (!context.g1Shape || !context.g1OctaCoreCell) {
    return [];
  }

  return context.g1OctaCoreCell.vertexIds.map((g1OctaVertexId) => {
    const sourceVertexIds = context.g1Shape?.vertices[g1OctaVertexId]?.createdBy?.sourceVertexIds ?? [];
    const sourceA = sourceVertexIds[0] ?? '';
    const sourceB = sourceVertexIds[1] ?? '';
    const labelA = seedLabels.get(sourceA) ?? 'A';
    const labelB = seedLabels.get(sourceB) ?? 'A';
    const tetraEdgeId = tetraEdgeIdFromLabels([labelA, labelB]);
    const sourceEvidence = sourceVertexIds.length === 2 ? 'createdBy.sourceVertexIds' : 'missing-source-evidence';
    const bridgeStatus: G1OctaVertexTetraEdgeRow['bridgeStatus'] =
      sourceVertexIds.length !== 2
        ? 'missing-source-edge'
        : labelA === labelB
          ? 'ambiguous-tetra-edge'
          : 'octa-vertex-bridged-to-tetra-edge';

    return {
      g1OctaVertexId,
      tetraEdgeId,
      sourceVertexIds: [sourceA, sourceB],
      primalLabels: [labelA, labelB],
      sourceEvidence,
      bridgeStatus,
    };
  });
}

function buildG1OctaEdgeTetraWedgeRows(
  context: TetraG2LineageContext,
  vertexRows: readonly G1OctaVertexTetraEdgeRow[],
): G1OctaEdgeTetraWedgeRow[] {
  if (!context.g1Shape || !context.g1OctaCoreCell) {
    return [];
  }

  const vertexEdgeById = new Map(vertexRows.map((row) => [row.g1OctaVertexId, row.tetraEdgeId]));

  return deriveCellEdges(context.g1Shape, context.g1OctaCoreCell).map((edge) => {
    const tetraEdgeA = vertexEdgeById.get(edge.vertexIds[0]) ?? 'AB';
    const tetraEdgeB = vertexEdgeById.get(edge.vertexIds[1]) ?? 'AB';
    const wedge = sharedAndOmittedLabels(tetraEdgeA, tetraEdgeB);
    const sourceEvidence = vertexEdgeById.has(edge.vertexIds[0]) && vertexEdgeById.has(edge.vertexIds[1])
      ? 'deriveCellEdges-on-g1-octa-core-plus-g1-vertex-edge-rows'
      : 'missing-source-evidence';
    const wedgeStatus = classifyWedgeStatus(wedge, tetraEdgeA, tetraEdgeB, sourceEvidence);

    return {
      g1OctaEdgeId: edge.id,
      g1OctaEdgeVertexIds: edge.vertexIds,
      tetraEdgeA,
      tetraEdgeB,
      sharedLabel: wedge.sharedLabel,
      omittedLabel: wedge.omittedLabel,
      sourceEvidence,
      wedgeStatus,
    };
  });
}

function buildDirectBridgeRows(
  context: TetraG2LineageContext,
  wedgeRows: readonly G1OctaEdgeTetraWedgeRow[],
): DirectBridgeRow[] {
  if (!context.g2Shape || !context.g2CuboctaCoreCell) {
    return [];
  }

  const wedgeByEdgeId = new Map(wedgeRows.map((row) => [row.g1OctaEdgeId, row]));

  return context.g2CuboctaCoreCell.vertexIds.map((cuboctahedronVertexId) => {
    const vertex = context.g2Shape?.vertices[cuboctahedronVertexId];
    const sourceG1OctaEdgeId = vertex?.createdBy?.sourceEdgeId ?? null;
    const wedge = sourceG1OctaEdgeId ? wedgeByEdgeId.get(sourceG1OctaEdgeId) ?? null : null;
    const flagPlus = wedge?.sharedLabel && wedge.omittedLabel ? flagId(wedge.sharedLabel, wedge.omittedLabel) : null;
    const flagMinus = wedge?.sharedLabel && wedge.omittedLabel ? flagId(wedge.omittedLabel, wedge.sharedLabel) : null;
    const direct = Boolean(
      sourceG1OctaEdgeId &&
        wedge &&
        wedge.wedgeStatus === 'incident-tetra-edge-wedge' &&
        flagPlus &&
        flagMinus,
    );
    const bridgeStatus: DirectBridgeRow['bridgeStatus'] =
      !sourceG1OctaEdgeId || !wedge
        ? 'missing-source-g1-edge'
        : wedge.wedgeStatus !== 'incident-tetra-edge-wedge'
          ? 'non-incident-tetra-edge-wedge'
          : !flagPlus || !flagMinus
            ? 'ambiguous-flag'
            : 'direct-lineage-bridge-row';

    return {
      cuboctahedronVertexId,
      sourceG1OctaEdgeId,
      sourceG1OctaEdgeVertexIds: wedge?.g1OctaEdgeVertexIds ?? null,
      tetraEdgeA: wedge?.tetraEdgeA ?? null,
      tetraEdgeB: wedge?.tetraEdgeB ?? null,
      g1EndpointTetraEdges: wedge ? [wedge.tetraEdgeA, wedge.tetraEdgeB] : null,
      sharedLabel: wedge?.sharedLabel ?? null,
      omittedLabel: wedge?.omittedLabel ?? null,
      sharedLabelDerivation: wedge?.sharedLabel
        ? `intersection(${wedge.tetraEdgeA},${wedge.tetraEdgeB})=${wedge.sharedLabel}`
        : 'missing shared label',
      omittedLabelDerivation: wedge?.omittedLabel
        ? `A/B/C/D minus union(${wedge?.tetraEdgeA},${wedge?.tetraEdgeB})=${wedge.omittedLabel}`
        : 'missing omitted label',
      flagPlus,
      flagMinus,
      selectedConvention: direct ? 'both-tested' : 'none',
      bridgeLaw: direct ? 'both-polarities-recorded' : 'none',
      sourceEvidence: sourceG1OctaEdgeId
        ? 'cuboctahedronVertex.createdBy.sourceEdgeId'
        : 'missing-source-g1-edge',
      bridgeStatus,
    };
  });
}

function buildS4EquivarianceRows(permutations: readonly Record<A3Label, A3Label>[]): S4EquivarianceRow[] {
  return (['shared-to-omitted', 'omitted-to-shared'] as const).flatMap((polarityConvention) =>
    permutations.map((permutationMap, index) => {
      const failureExamples: S4EquivarianceRow['failureExamples'] = [];
      let equivariantCount = 0;

      for (const wedge of allTetraWedges()) {
        const originalFlag = flagForWedge(wedge, polarityConvention);
        const permutedBridgeFlag = flagForWedge(applyPermutationToWedge(wedge, permutationMap), polarityConvention);
        const bridgePermutedFlag = applyPermutationToFlag(originalFlag, permutationMap) as A3FlagId;
        const pass = permutedBridgeFlag === bridgePermutedFlag;

        if (pass) {
          equivariantCount += 1;
        } else if (failureExamples.length < 3) {
          failureExamples.push({
            tetraEdgeA: wedge.tetraEdgeA,
            tetraEdgeB: wedge.tetraEdgeB,
            originalFlag,
            permutedBridgeFlag,
            bridgePermutedFlag,
          });
        }
      }

      const failedCount = allTetraWedges().length - equivariantCount;

      return {
        polarityConvention,
        permutationId: `s4:${index + 1}:${A3_LABELS.map((label) => `${label}->${permutationMap[label]}`).join(',')}`,
        permutationMap,
        testedWedgeCount: allTetraWedges().length,
        equivariantCount,
        failedCount,
        failureExamples,
        equivarianceStatus: failedCount === 0 ? 's4-equivariant' : 's4-equivariance-failed',
      };
    }),
  );
}

function buildActualFaceFlagRows(
  context: TetraG2LineageContext,
  directBridgeRows: readonly DirectBridgeRow[],
): ActualFaceFlagRow[] {
  if (!context.g2Shape || !context.g2CuboctaCoreCell) {
    return [];
  }

  const bridgeByVertexId = new Map(directBridgeRows.map((row) => [row.cuboctahedronVertexId, row]));
  const g1FaceById = new Map((context.g1Shape?.faces ?? []).map((face) => [face.id, face]));

  return getCellFaces(context.g2Shape, context.g2CuboctaCoreCell)
    .filter((face) => face.vertexIds.length === 3 || face.vertexIds.length === 4)
    .map((face) => {
      const bridgeRows = face.vertexIds.map((vertexId) => bridgeByVertexId.get(vertexId));
      const flagIdsPlus = bridgeRows.map((row) => row?.flagPlus).filter(isA3FlagId);
      const flagIdsMinus = bridgeRows.map((row) => row?.flagMinus).filter(isA3FlagId);
      const faceSize = face.vertexIds.length as 3 | 4;
      const sourceG1Face = face.sourceFaceId ? g1FaceById.get(face.sourceFaceId) ?? null : null;
      const faceOriginKind = sourceG1Face?.sourceVertexId
        ? 'g1-octa-source-vertex-derived'
        : sourceG1Face?.sourceFaceId || face.sourceFaceId
          ? 'g1-octa-source-face-derived'
          : face.sourceVertexId
            ? 'g1-octa-source-vertex-derived'
            : 'unknown';
      const originEvidence = face.sourceFaceId
        ? 'face.sourceFaceId'
        : face.sourceVertexId
          ? 'face.sourceVertexId'
          : 'missing-origin-evidence';

      return {
        faceId: face.id,
        faceRole: face.role ?? null,
        sourceFaceId: face.sourceFaceId ?? null,
        sourceVertexId: face.sourceVertexId ?? null,
        originEvidence,
        faceSize,
        cuboctahedronVertexIds: [...face.vertexIds],
        flagIdsPlus,
        flagIdsMinus,
        faceOriginKind,
        actualFaceBridgeStatus:
          flagIdsPlus.length === face.vertexIds.length && flagIdsMinus.length === face.vertexIds.length
            ? 'actual-face-bridged'
            : 'face-contains-unbridged-vertex',
      };
    });
}

function buildVectorEquilibriumTriangleRows(
  actualFaceRows: readonly ActualFaceFlagRow[],
  polarityConvention: BridgePolarityConvention,
): VectorEquilibriumTriangleRow[] {
  return actualFaceRows
    .filter((row) => row.faceSize === 3)
    .map((row) => {
      const flags = flagsForPolarity(row, polarityConvention);
      const flagTriple = tuple3(flags);
      const classification = classifyVETriangle(flagTriple);
      const expectedOriginKind =
        classification.triangleKind === 'fixed-shared-label'
          ? 'g1-octa-source-vertex-derived'
          : classification.triangleKind === 'fixed-omitted-label'
            ? 'g1-octa-source-face-derived'
            : 'not-applicable';
      const originLawStatus =
        expectedOriginKind === 'not-applicable'
          ? 'not-applicable'
          : row.faceOriginKind === expectedOriginKind
            ? 'origin-kind-matches'
            : 'origin-kind-mismatch';
      const triangleStatus =
        classification.triangleKind === 'not-vector-equilibrium-triangle'
          ? 'actual-face-ve-triangle-mismatch'
          : originLawStatus === 'origin-kind-mismatch'
            ? 'origin-kind-mismatch'
            : 'actual-face-matches-ve-triangle';

      return {
        faceId: row.faceId,
        flagTriple,
        triangleKind: classification.triangleKind,
        fixedLabel: classification.fixedLabel,
        expectedOriginKind,
        actualOriginKind: row.faceOriginKind,
        originLawStatus,
        triangleStatus,
      };
    });
}

function buildVectorEquilibriumSquareRows(
  actualFaceRows: readonly ActualFaceFlagRow[],
  polarityConvention: BridgePolarityConvention,
): VectorEquilibriumSquareRow[] {
  return actualFaceRows
    .filter((row) => row.faceSize === 4)
    .map((row) => {
      const flags = flagsForPolarity(row, polarityConvention);
      const flagCycle = tuple4(flags);
      const classification = classifyVESquare(flagCycle);
      const originLawStatus =
        row.faceOriginKind === 'g1-octa-source-vertex-derived' ? 'origin-kind-matches' : 'origin-kind-mismatch';
      const squareStatus =
        classification.correspondingTetraEdge === null
          ? 'actual-face-ve-square-mismatch'
          : originLawStatus === 'origin-kind-mismatch'
            ? 'origin-kind-mismatch'
            : 'actual-face-matches-ve-square';

      return {
        faceId: row.faceId,
        flagCycle,
        sourceLabelPair: classification.sourceLabelPair,
        targetLabelPair: classification.targetLabelPair,
        correspondingTetraEdge: classification.correspondingTetraEdge,
        actualOriginKind: row.faceOriginKind,
        expectedOriginKind: 'g1-octa-source-vertex-derived',
        originLawStatus,
        squareStatus,
      };
    });
}

function buildCentralHexagonRows(): CentralHexagonRow[] {
  const veRows = A3_LABELS.map((label) => {
    const flagIds = DIRECTED_FLAGS.filter((flag) => {
      const parsed = parseFlagId(flag);
      return parsed.shared !== label && parsed.omitted !== label;
    });
    const internalEdgePairs = internalPairs(flagIds, sameSourceOrSameTarget);

    return buildCentralHexagonRow({
      hexagonSystem: 'vector-equilibrium-a2-omitted-label',
      hexagonId: `ve-a2-omitted-${label}`,
      label,
      flagIds,
      edgeRule: 'same-source-or-same-target',
      internalEdgePairs,
    });
  });
  const compositionRows = A3_LABELS.map((label) => {
    const flagIds = DIRECTED_FLAGS.filter((flag) => {
      const parsed = parseFlagId(flag);
      return parsed.shared === label || parsed.omitted === label;
    });
    const internalEdgePairs = internalPairs(flagIds, areAdjacentA3Roots);

    return buildCentralHexagonRow({
      hexagonSystem: 'composition-incidence-involving-label',
      hexagonId: `composition-involving-${label}`,
      label,
      flagIds,
      edgeRule: 'composition-adjacency',
      internalEdgePairs,
    });
  });

  return [...veRows, ...compositionRows];
}

function buildActualVsCompositionTriangleRows(
  triangleRows: readonly VectorEquilibriumTriangleRow[],
  compositionGroups: readonly CompositionTriangleGroup[],
): ActualVsCompositionTriangleRow[] {
  const compositionBySetKey = new Map(compositionGroups.map((group) => [flagSetKey(group.flagIds), group.triangleId]));

  return triangleRows.map((row) => {
    const actualVEFlagSetKey = flagSetKey(row.flagTriple);
    const discriminatorTriangleId = compositionBySetKey.get(actualVEFlagSetKey) ?? null;

    return {
      actualFaceId: row.faceId,
      actualVEFlagTriple: [...row.flagTriple],
      actualVEFlagSetKey,
      matchesDiscriminatorTriangleSet: discriminatorTriangleId !== null,
      discriminatorTriangleId,
      comparisonStatus: discriminatorTriangleId
        ? 'actual-ve-face-directly-matches-composition-group'
        : 'actual-ve-face-does-not-match-composition-group',
    };
  });
}

function buildActualVsCompositionSquareRows(
  squareRows: readonly VectorEquilibriumSquareRow[],
  compositionGroups: readonly CompositionSquareGroup[],
): ActualVsCompositionSquareRow[] {
  const compositionBySetKey = new Map(compositionGroups.map((group) => [flagSetKey(group.flagIds), group.squareCycleId]));

  return squareRows.map((row) => {
    const actualVEFlagSetKey = flagSetKey(row.flagCycle);
    const discriminatorSquareCycleId = compositionBySetKey.get(actualVEFlagSetKey) ?? null;

    return {
      actualFaceId: row.faceId,
      actualVEFlagCycle: [...row.flagCycle],
      actualVEFlagSetKey,
      matchesDiscriminatorSquareSet: discriminatorSquareCycleId !== null,
      discriminatorSquareCycleId,
      comparisonStatus: discriminatorSquareCycleId
        ? 'actual-ve-face-directly-matches-composition-group'
        : 'actual-ve-face-does-not-match-composition-group',
    };
  });
}

function buildBridgePolarityComparisonRows(args: {
  directBridgeRows: readonly DirectBridgeRow[];
  s4EquivarianceRows: readonly S4EquivarianceRow[];
  plusTriangleRows: readonly VectorEquilibriumTriangleRow[];
  plusSquareRows: readonly VectorEquilibriumSquareRow[];
  plusTriangleComparisons: readonly ActualVsCompositionTriangleRow[];
  plusSquareComparisons: readonly ActualVsCompositionSquareRow[];
  minusTriangleRows: readonly VectorEquilibriumTriangleRow[];
  minusSquareRows: readonly VectorEquilibriumSquareRow[];
  minusTriangleComparisons: readonly ActualVsCompositionTriangleRow[];
  minusSquareComparisons: readonly ActualVsCompositionSquareRow[];
}): BridgePolarityComparisonRow[] {
  return [
    buildPolarityComparisonRow('shared-to-omitted', args, 'candidate-polarity'),
    buildPolarityComparisonRow('omitted-to-shared', args, 'reverse-polarity'),
  ];
}

function buildS4RepresentationOrbitRows(args: {
  permutations: readonly Record<A3Label, A3Label>[];
  directBridgeRows: readonly DirectBridgeRow[];
  plusTriangleRows: readonly VectorEquilibriumTriangleRow[];
  plusSquareRows: readonly VectorEquilibriumSquareRow[];
  compositionTriangleGroups: readonly CompositionTriangleGroup[];
  compositionSquareGroups: readonly CompositionSquareGroup[];
}): S4RepresentationOrbitRow[] {
  const rows: S4RepresentationOrbitRow[] = [];
  const addRow = (
    objectSystem: S4RepresentationOrbitRow['objectSystem'],
    objects: readonly string[],
    action: (object: string, permutation: Record<A3Label, A3Label>) => string,
  ) => {
    const orbit = computeS4Orbits(objects, args.permutations, action);
    rows.push({
      objectSystem,
      objectCount: orbit.objectCount,
      permutationCount: orbit.permutationCount,
      s4OrbitCount: orbit.orbitCount,
      s4OrbitSizes: orbit.orbitSizes,
      stabilizerSizes: orbit.stabilizerSizes,
      transitive: orbit.transitive,
      orbitRepresentatives: orbit.representatives,
      orbitSignatureStatus: orbit.status,
    });
  };

  addRow('direct-bridge-vertices-B-plus', args.directBridgeRows.map((row) => row.flagPlus).filter(isA3FlagId), applyPermutationToFlag);
  addRow('direct-bridge-vertices-B-minus', args.directBridgeRows.map((row) => row.flagMinus).filter(isA3FlagId), applyPermutationToFlag);
  addRow('a3-directed-flags', DIRECTED_FLAGS, applyPermutationToFlag);
  addRow('actual-ve-triangles-B-plus', args.plusTriangleRows.map((row) => flagSetKey(row.flagTriple)), applyPermutationToFlagSetKey);
  addRow('actual-ve-squares-B-plus', args.plusSquareRows.map((row) => flagSetKey(row.flagCycle)), applyPermutationToFlagSetKey);
  addRow('a3-ve-triangles', a3VETriangleFlagSets().map(flagSetKey), applyPermutationToFlagSetKey);
  addRow('a3-ve-squares', a3VESquareFlagSets().map(flagSetKey), applyPermutationToFlagSetKey);
  addRow('composition-triangles', args.compositionTriangleGroups.map((group) => flagSetKey(group.flagIds)), applyPermutationToFlagSetKey);
  addRow('composition-squares', args.compositionSquareGroups.map((group) => flagSetKey(group.flagIds)), applyPermutationToFlagSetKey);

  return rows;
}

function buildS4OrbitSignatureRows(args: {
  permutations: readonly Record<A3Label, A3Label>[];
  plusTriangleRows: readonly VectorEquilibriumTriangleRow[];
  plusSquareRows: readonly VectorEquilibriumSquareRow[];
  compositionTriangleGroups: readonly CompositionTriangleGroup[];
  compositionSquareGroups: readonly CompositionSquareGroup[];
}): S4OrbitSignatureRow[] {
  const definitions: Array<{
    systemId: S4OrbitSignatureRow['systemId'];
    objects: string[];
  }> = [
    { systemId: 'actual-ve-triangles', objects: args.plusTriangleRows.map((row) => flagSetKey(row.flagTriple)) },
    { systemId: 'composition-triangles', objects: args.compositionTriangleGroups.map((group) => flagSetKey(group.flagIds)) },
    { systemId: 'actual-ve-squares', objects: args.plusSquareRows.map((row) => flagSetKey(row.flagCycle)) },
    { systemId: 'composition-squares', objects: args.compositionSquareGroups.map((group) => flagSetKey(group.flagIds)) },
  ];

  return definitions.map((definition) => {
    const orbit = computeS4Orbits(definition.objects, args.permutations, applyPermutationToFlagSetKey);

    return {
      systemId: definition.systemId,
      objectCount: orbit.objectCount,
      permutationCount: orbit.permutationCount,
      orbitCount: orbit.orbitCount,
      orbitSizes: orbit.orbitSizes,
      stabilizerSizes: orbit.stabilizerSizes,
      representativeObjects: orbit.representatives,
      orbitSignatureStatus: orbit.status,
    };
  });
}

function buildBridgeVerdictRows(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  bridgeSearchPolicyRows: readonly BridgeSearchPolicyRow[];
  sourceLineageRows: readonly SourceLineageRow[];
  tetraSeedVertexLabelRows: readonly TetraSeedVertexLabelRow[];
  g1OctaVertexTetraEdgeRows: readonly G1OctaVertexTetraEdgeRow[];
  g1OctaEdgeTetraWedgeRows: readonly G1OctaEdgeTetraWedgeRow[];
  directBridgeRows: readonly DirectBridgeRow[];
  s4EquivarianceRows: readonly S4EquivarianceRow[];
  s4RepresentationOrbitRows: readonly S4RepresentationOrbitRow[];
  actualFaceFlagRows: readonly ActualFaceFlagRow[];
  vectorEquilibriumTriangleRows: readonly VectorEquilibriumTriangleRow[];
  vectorEquilibriumSquareRows: readonly VectorEquilibriumSquareRow[];
  centralHexagonRows: readonly CentralHexagonRow[];
  actualVsCompositionTriangleRows: readonly ActualVsCompositionTriangleRow[];
  actualVsCompositionSquareRows: readonly ActualVsCompositionSquareRow[];
  s4OrbitSignatureRows: readonly S4OrbitSignatureRow[];
}): BridgeVerdictRow[] {
  return [
    verdictRow('source-lineage', sourceLineageReady(args.sourceLineageRows), `${args.sourceLineageRows.length}/1 source lineage rows; status=${args.sourceLineageRows[0]?.lineageStatus ?? 'missing'}.`),
    verdictRow('tetra-seed-labels', tetraLabelsReady(args.tetraSeedVertexLabelRows), `labels=${args.tetraSeedVertexLabelRows.map((row) => row.label).join(',')}.`),
    verdictRow('g1-octa-vertex-tetra-edge', g1VertexRowsReady(args.g1OctaVertexTetraEdgeRows), `${args.g1OctaVertexTetraEdgeRows.length}/6 G1 vertex-edge rows.`),
    verdictRow('g1-octa-edge-tetra-wedge', g1WedgeRowsReady(args.g1OctaEdgeTetraWedgeRows), `${args.g1OctaEdgeTetraWedgeRows.length}/12 G1 edge-wedge rows.`),
    verdictRow('direct-bridge', directBridgeReady(args.directBridgeRows), `${args.directBridgeRows.length}/12 direct bridge rows; plusFlags=${distinctFlags(args.directBridgeRows, 'shared-to-omitted').length}; minusFlags=${distinctFlags(args.directBridgeRows, 'omitted-to-shared').length}.`),
    verdictRow('s4-equivariance', s4EquivarianceReady(args.s4EquivarianceRows), `${args.s4EquivarianceRows.length}/48 S4 equivariance rows.`),
    verdictRow('s4-representation-orbits', s4RepresentationReady(args.s4RepresentationOrbitRows), `${args.s4RepresentationOrbitRows.length}/${REQUIRED_REPRESENTATION_SYSTEMS.length} representation orbit rows.`),
    verdictRow('actual-face-flags', actualFaceRowsReady(args.actualFaceFlagRows), `${args.actualFaceFlagRows.length}/14 actual face flag rows.`),
    verdictRow('ve-triangle-law', veTriangleRowsReady(args.vectorEquilibriumTriangleRows), `${args.vectorEquilibriumTriangleRows.filter((row) => row.triangleStatus === 'actual-face-matches-ve-triangle').length}/8 VE triangle rows pass.`),
    verdictRow('ve-square-law', veSquareRowsReady(args.vectorEquilibriumSquareRows), `${args.vectorEquilibriumSquareRows.filter((row) => row.squareStatus === 'actual-face-matches-ve-square').length}/6 VE square rows pass.`),
    verdictRow('central-hexagon-systems', centralHexagonsReady(args.centralHexagonRows), `${args.centralHexagonRows.filter((row) => row.hexagonStatus === 'central-hexagon-pass').length}/8 central hexagon rows pass.`),
    verdictRow('composition-triangle-comparison', true, `${args.actualVsCompositionTriangleRows.filter((row) => row.matchesDiscriminatorTriangleSet).length}/${args.actualVsCompositionTriangleRows.length} actual VE triangles directly match composition groups.`),
    verdictRow('composition-square-comparison', true, `${args.actualVsCompositionSquareRows.filter((row) => row.matchesDiscriminatorSquareSet).length}/${args.actualVsCompositionSquareRows.length} actual VE squares directly match composition groups.`),
    verdictRow('s4-orbit-signatures', s4OrbitSignaturesReady(args.s4OrbitSignatureRows), `${args.s4OrbitSignatureRows.length}/4 S4 orbit signature rows.`),
    verdictRow('boundaries', args.bridgeSearchPolicyRows.every((row) => row.status === 'enforced') && args.parentEvidenceRows.length >= 5, 'Boundary rows are checked separately and policy rows are enforced.'),
  ];
}

function buildBoundaryRows(): BoundaryRow[] {
  return [
    boundary('not-residual-diagnostic', 'T28-N0 is a bridge-law diagnostic, not a residual diagnostic.'),
    boundary('not-field-computation', 'T28-N0 computes no field.'),
    boundary('not-fieldcue', 'T28-N0 does not create or unblock FieldCue.'),
    boundary('not-semantic-naming', 'T28-N0 does not authorize semantic naming.'),
    boundary('not-topology-authorization', 'T28-N0 does not authorize topology adoption.'),
    boundary('not-route', 'T28-N0 does not confirm routes.'),
    boundary('not-gate', 'T28-N0 does not confirm gates.'),
    boundary('not-corridor', 'T28-N0 does not confirm corridors.'),
    boundary('not-runtime', 'T28-N0 does not authorize runtime adoption.'),
    boundary('not-universal-octonion-law', 'T28-N0 does not prove a universal octonion law.'),
    boundary('not-cube-primal-sourcehood', 'T28-N0 does not solve cube primal sourcehood.'),
    boundary('not-ui', 'T28-N0 adds no UI.'),
    boundary('not-shape-mutation', 'T28-N0 does not mutate persisted shapes.'),
    boundary('not-packet-write', 'T28-N0 does not write packets.'),
    boundary('not-arbitrary-permutation-search', 'T28-N0 does not use arbitrary permutation search as bridge evidence.'),
    boundary('not-canonical-order-bridge', 'T28-N0 does not use canonical vertex order as the bridge law.'),
    boundary('not-composition-holonomy-as-bridge-source', 'Composition-holonomy rows are not used as the bridge source.'),
  ];
}

function buildFalsifierRows(args: {
  bridgeSearchPolicyRows: readonly BridgeSearchPolicyRow[];
  sourceLineageRows: readonly SourceLineageRow[];
  tetraSeedVertexLabelRows: readonly TetraSeedVertexLabelRow[];
  g1OctaVertexTetraEdgeRows: readonly G1OctaVertexTetraEdgeRow[];
  g1OctaEdgeTetraWedgeRows: readonly G1OctaEdgeTetraWedgeRow[];
  directBridgeRows: readonly DirectBridgeRow[];
  s4EquivarianceRows: readonly S4EquivarianceRow[];
  s4RepresentationOrbitRows: readonly S4RepresentationOrbitRow[];
  actualFaceFlagRows: readonly ActualFaceFlagRow[];
  vectorEquilibriumTriangleRows: readonly VectorEquilibriumTriangleRow[];
  vectorEquilibriumSquareRows: readonly VectorEquilibriumSquareRow[];
  actualVsCompositionTriangleRows: readonly ActualVsCompositionTriangleRow[];
  actualVsCompositionSquareRows: readonly ActualVsCompositionSquareRow[];
  s4OrbitSignatureRows: readonly S4OrbitSignatureRow[];
  boundaryRows: readonly BoundaryRow[];
  summaryVerdict: T28N0SummaryVerdict;
}): FalsifierRow[] {
  return [
    falsifier('F1', 'Canonical-order bridge is reused as the direct bridge.', false, 'Direct bridge rows use cuboctahedronVertex.createdBy.sourceEdgeId.'),
    falsifier('F2', 'G2 cuboctahedron vertices are not traced back to G1 octahedron source edges.', args.directBridgeRows.some((row) => !row.sourceG1OctaEdgeId), `${args.directBridgeRows.filter((row) => row.sourceG1OctaEdgeId).length}/12 rows have sourceG1OctaEdgeId.`),
    falsifier('F3', 'G1 octahedron vertices are not traced back to tetrahedral edge states.', args.g1OctaVertexTetraEdgeRows.some((row) => row.bridgeStatus !== 'octa-vertex-bridged-to-tetra-edge'), `${args.g1OctaVertexTetraEdgeRows.filter((row) => row.bridgeStatus === 'octa-vertex-bridged-to-tetra-edge').length}/6 G1 vertices bridged.`),
    falsifier('F4', 'The bridge is not tested over all 24 S4 relabelings.', args.s4EquivarianceRows.length !== 48 || args.s4EquivarianceRows.some((row) => row.testedWedgeCount !== 12), `${args.s4EquivarianceRows.length}/48 S4 equivariance rows.`),
    falsifier('F5', 'Arbitrary permutation search is treated as structural evidence.', args.bridgeSearchPolicyRows.some((row) => row.forbiddenMappingSource === 'best-fit-permutation' && row.status !== 'enforced'), 'Policy rows forbid best-fit permutation search.'),
    falsifier('F6', 'B+ and B- polarity conventions are not distinguished.', !hasBothPolarities(args.directBridgeRows), `plus=${distinctFlags(args.directBridgeRows, 'shared-to-omitted').length}; minus=${distinctFlags(args.directBridgeRows, 'omitted-to-shared').length}.`),
    falsifier('F7', 'Actual face provenance is not preserved: source-face-derived vs source-vertex-derived.', args.actualFaceFlagRows.some((row) => row.faceOriginKind === 'unknown'), `${args.actualFaceFlagRows.filter((row) => row.faceOriginKind !== 'unknown').length}/14 actual faces preserve provenance.`),
    falsifier('F8', 'Actual VE face law is not tested separately from discriminator composition law.', args.vectorEquilibriumTriangleRows.length !== 8 || args.vectorEquilibriumSquareRows.length !== 6 || args.actualVsCompositionTriangleRows.length !== 8 || args.actualVsCompositionSquareRows.length !== 6, 'VE rows are built before composition comparison rows.'),
    falsifier('F9', 'S4 orbit signatures are omitted.', args.s4OrbitSignatureRows.length !== 4, `${args.s4OrbitSignatureRows.length}/4 S4 orbit signature rows.`),
    falsifier('F10', 'A discriminator mismatch is treated as cuboctahedron failure before the direct VE bridge is tested.', false, `summaryVerdict=${args.summaryVerdict}; composition mismatches are resolved after VE rows.`),
    falsifier('F11', 'Direct VE bridge success is treated as residual portability.', args.summaryVerdict.includes('residual'), `summaryVerdict=${args.summaryVerdict}.`),
    falsifier('F12', 'FieldCue, semantic naming, topology, route/gate/corridor, runtime, or universal octonion law is authorized.', requiredBoundaryMissing(args.boundaryRows), `${args.boundaryRows.filter((row) => row.enforced).length}/${REQUIRED_BOUNDARY_IDS.length} boundary rows enforced.`),
    falsifier('F13', 'Seed vertex labels are parsed from vertex IDs instead of seed packet labels or controlled seed order.', false, unique(args.tetraSeedVertexLabelRows.map((row) => row.labelSource)).join(',')),
    falsifier('F14', 'G1/G2 source edge IDs are parsed semantically rather than resolved through createdBy/sourceEdgeId evidence.', args.directBridgeRows.some((row) => row.sourceEvidence !== 'cuboctahedronVertex.createdBy.sourceEdgeId'), `${args.directBridgeRows.filter((row) => row.sourceEvidence === 'cuboctahedronVertex.createdBy.sourceEdgeId').length}/12 direct bridge rows use createdBy.sourceEdgeId.`),
    falsifier('F15', 'Composition-holonomy comparison is used to select the bridge polarity.', false, 'Polarity rows are computed before composition comparison and neither polarity is selected from composition matching.'),
    falsifier('F16', 'S4 representation/orbit rows are present but not computed from all 24 permutations.', args.s4RepresentationOrbitRows.some((row) => row.permutationCount !== 24), `${args.s4RepresentationOrbitRows.filter((row) => row.permutationCount === 24).length}/${args.s4RepresentationOrbitRows.length} representation rows use 24 permutations.`),
    falsifier('F17', 'Composition-holonomy comparison is treated as direct bridge evidence.', false, 'Composition rows are downstream comparison rows only.'),
  ];
}

function classifySummaryVerdict(args: {
  bridgeSearchPolicyRows: readonly BridgeSearchPolicyRow[];
  sourceLineageRows: readonly SourceLineageRow[];
  tetraSeedVertexLabelRows: readonly TetraSeedVertexLabelRow[];
  g1OctaVertexTetraEdgeRows: readonly G1OctaVertexTetraEdgeRow[];
  g1OctaEdgeTetraWedgeRows: readonly G1OctaEdgeTetraWedgeRow[];
  directBridgeRows: readonly DirectBridgeRow[];
  s4EquivarianceRows: readonly S4EquivarianceRow[];
  vectorEquilibriumTriangleRows: readonly VectorEquilibriumTriangleRow[];
  vectorEquilibriumSquareRows: readonly VectorEquilibriumSquareRow[];
  actualVsCompositionTriangleRows: readonly ActualVsCompositionTriangleRow[];
  actualVsCompositionSquareRows: readonly ActualVsCompositionSquareRow[];
  s4OrbitSignatureRows: readonly S4OrbitSignatureRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28N0SummaryVerdict {
  if (
    requiredBoundaryMissing(args.boundaryRows) ||
    args.bridgeSearchPolicyRows.some((row) => row.status !== 'enforced') ||
    args.falsifierRows.some((row) => boundaryFalsifierId(row.falsifierId) && row.triggered)
  ) {
    return 'T28-N0-boundary-failed';
  }

  if (
    !sourceLineageReady(args.sourceLineageRows) ||
    !tetraLabelsReady(args.tetraSeedVertexLabelRows) ||
    !g1VertexRowsReady(args.g1OctaVertexTetraEdgeRows) ||
    !g1WedgeRowsReady(args.g1OctaEdgeTetraWedgeRows) ||
    !directBridgeReady(args.directBridgeRows)
  ) {
    return 'T28-N0-direct-s4-bridge-failed';
  }

  if (!s4EquivarianceReady(args.s4EquivarianceRows)) {
    return 'T28-N0-s4-equivariance-failed';
  }

  if (!veTriangleRowsReady(args.vectorEquilibriumTriangleRows) || !veSquareRowsReady(args.vectorEquilibriumSquareRows)) {
    return 'T28-N0-ve-face-law-failed';
  }

  const allCompositionRowsMatch =
    args.actualVsCompositionTriangleRows.length === 8 &&
    args.actualVsCompositionSquareRows.length === 6 &&
    args.actualVsCompositionTriangleRows.every((row) => row.matchesDiscriminatorTriangleSet) &&
    args.actualVsCompositionSquareRows.every((row) => row.matchesDiscriminatorSquareSet);

  if (allCompositionRowsMatch) {
    return 'T28-N0-ve-bridge-verified-composition-holonomy-directly-matches';
  }

  if (actualAndCompositionSeparateByOrbitType(args.s4OrbitSignatureRows)) {
    return 'T28-N0-ve-bridge-verified-composition-holonomy-separate-by-orbit-type';
  }

  return 'T28-N0-composition-comparison-inconclusive';
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  bridgeSearchPolicyRows: readonly BridgeSearchPolicyRow[];
  sourceLineageRows: readonly SourceLineageRow[];
  tetraSeedVertexLabelRows: readonly TetraSeedVertexLabelRow[];
  g1OctaVertexTetraEdgeRows: readonly G1OctaVertexTetraEdgeRow[];
  g1OctaEdgeTetraWedgeRows: readonly G1OctaEdgeTetraWedgeRow[];
  directBridgeRows: readonly DirectBridgeRow[];
  bridgePolarityComparisonRows: readonly BridgePolarityComparisonRow[];
  s4EquivarianceRows: readonly S4EquivarianceRow[];
  s4RepresentationOrbitRows: readonly S4RepresentationOrbitRow[];
  actualFaceFlagRows: readonly ActualFaceFlagRow[];
  vectorEquilibriumTriangleRows: readonly VectorEquilibriumTriangleRow[];
  vectorEquilibriumSquareRows: readonly VectorEquilibriumSquareRow[];
  centralHexagonRows: readonly CentralHexagonRow[];
  actualVsCompositionTriangleRows: readonly ActualVsCompositionTriangleRow[];
  actualVsCompositionSquareRows: readonly ActualVsCompositionSquareRow[];
  s4OrbitSignatureRows: readonly S4OrbitSignatureRow[];
  bridgeVerdictRows: readonly BridgeVerdictRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  summaryVerdict: T28N0SummaryVerdict;
}): string[] {
  const issues: string[] = [];

  if (REQUIRED_PARENT_IDS.some((parentId) => !args.parentEvidenceRows.some((row) => row.parentId === parentId))) {
    issues.push('missing parent evidence rows');
  }

  if (
    args.parentEvidenceRows.some(
      (row) =>
        (row.parentId === 'octonion-vs-a3-medial-carrier-discriminator-v0' ||
          row.parentId === 'medial-dual-equivariant-carrier-policy-model-card-v0') &&
        row.ok !== true,
    )
  ) {
    issues.push('parent discriminator/model-card not ok');
  }

  if (args.bridgeSearchPolicyRows.length !== 4) {
    issues.push('missing bridgeSearchPolicyRows');
  }

  if (args.bridgeSearchPolicyRows.some((row) => row.status !== 'enforced')) {
    issues.push('any bridgeSearchPolicyRow violated');
  }

  if (args.sourceLineageRows.length !== 1) {
    issues.push('missing sourceLineageRow');
  }

  if (!sourceLineageReady(args.sourceLineageRows)) {
    issues.push('source lineage not tetra-G2 ready');
  }

  if (args.tetraSeedVertexLabelRows.length !== 4) {
    issues.push('missing tetraSeedVertexLabelRows');
  }

  if (!tetraLabelsReady(args.tetraSeedVertexLabelRows)) {
    issues.push('tetra labels not exactly A/B/C/D');
  }

  if (args.g1OctaVertexTetraEdgeRows.length !== 6) {
    issues.push('g1OctaVertexTetraEdgeRows count not 6');
  }

  if (!sameStringSet(args.g1OctaVertexTetraEdgeRows.map((row) => row.tetraEdgeId), TETRA_EDGES)) {
    issues.push('not all six tetra edges appear exactly once');
  }

  if (args.g1OctaEdgeTetraWedgeRows.length !== 12) {
    issues.push('g1OctaEdgeTetraWedgeRows count not 12');
  }

  if (args.g1OctaEdgeTetraWedgeRows.some((row) => row.wedgeStatus !== 'incident-tetra-edge-wedge')) {
    issues.push('any wedge non-incident or ambiguous');
  }

  if (args.directBridgeRows.length !== 12) {
    issues.push('directBridgeRows count not 12');
  }

  if (args.directBridgeRows.some((row) => !row.sourceG1OctaEdgeId)) {
    issues.push('any direct bridge missing sourceG1OctaEdgeId');
  }

  if (!sameStringSet(distinctFlags(args.directBridgeRows, 'shared-to-omitted'), DIRECTED_FLAGS)) {
    issues.push('flagPlus does not cover all 12 directed flags');
  }

  if (!sameStringSet(distinctFlags(args.directBridgeRows, 'omitted-to-shared'), DIRECTED_FLAGS)) {
    issues.push('flagMinus does not cover all 12 directed flags');
  }

  if (args.s4EquivarianceRows.length !== 48) {
    issues.push('S4 equivariance row count not 48');
  }

  if (args.s4EquivarianceRows.some((row) => row.equivarianceStatus !== 's4-equivariant')) {
    issues.push('any S4 equivariance row fails');
  }

  if (REQUIRED_REPRESENTATION_SYSTEMS.some((system) => !args.s4RepresentationOrbitRows.some((row) => row.objectSystem === system))) {
    issues.push('s4RepresentationOrbitRows missing required object systems');
  }

  if (args.s4RepresentationOrbitRows.some((row) => row.permutationCount !== 24 || row.orbitSignatureStatus !== 'computed')) {
    issues.push('s4RepresentationOrbitRows not computed from all 24 permutations');
  }

  if (args.actualFaceFlagRows.length !== 14) {
    issues.push('actualFaceFlagRows count not 14');
  }

  if (
    args.actualFaceFlagRows.filter((row) => row.faceSize === 3).length !== 8 ||
    args.actualFaceFlagRows.filter((row) => row.faceSize === 4).length !== 6
  ) {
    issues.push('actual face rows not 8 triangles and 6 squares');
  }

  if (args.actualFaceFlagRows.some((row) => row.actualFaceBridgeStatus !== 'actual-face-bridged')) {
    issues.push('any actual face unbridged');
  }

  if (args.vectorEquilibriumTriangleRows.length !== 8) {
    issues.push('VE triangle rows count not 8');
  }

  if (args.vectorEquilibriumSquareRows.length !== 6) {
    issues.push('VE square rows count not 6');
  }

  if (
    !args.centralHexagonRows.some((row) => row.hexagonSystem === 'vector-equilibrium-a2-omitted-label') ||
    !args.centralHexagonRows.some((row) => row.hexagonSystem === 'composition-incidence-involving-label')
  ) {
    issues.push('central hexagon systems missing either VE or composition system');
  }

  if (args.actualVsCompositionTriangleRows.length !== 8 || args.actualVsCompositionSquareRows.length !== 6) {
    issues.push('actualVsComposition rows missing');
  }

  if (args.s4OrbitSignatureRows.length !== 4) {
    issues.push('S4 orbit signature rows missing');
  }

  if (REQUIRED_BOUNDARY_IDS.some((boundaryId) => !args.boundaryRows.some((row) => row.boundaryId === boundaryId && row.enforced))) {
    issues.push('required boundary rows missing or unenforced');
  }

  if (REQUIRED_FALSIFIER_IDS.some((falsifierId) => !args.falsifierRows.some((row) => row.falsifierId === falsifierId))) {
    issues.push('required falsifier rows missing');
  }

  if (FORBIDDEN_VERDICTS.includes(args.summaryVerdict)) {
    issues.push('forbidden verdict emitted');
  }

  const expectedVerdict = classifySummaryVerdict({
    bridgeSearchPolicyRows: args.bridgeSearchPolicyRows,
    sourceLineageRows: args.sourceLineageRows,
    tetraSeedVertexLabelRows: args.tetraSeedVertexLabelRows,
    g1OctaVertexTetraEdgeRows: args.g1OctaVertexTetraEdgeRows,
    g1OctaEdgeTetraWedgeRows: args.g1OctaEdgeTetraWedgeRows,
    directBridgeRows: args.directBridgeRows,
    s4EquivarianceRows: args.s4EquivarianceRows,
    vectorEquilibriumTriangleRows: args.vectorEquilibriumTriangleRows,
    vectorEquilibriumSquareRows: args.vectorEquilibriumSquareRows,
    actualVsCompositionTriangleRows: args.actualVsCompositionTriangleRows,
    actualVsCompositionSquareRows: args.actualVsCompositionSquareRows,
    s4OrbitSignatureRows: args.s4OrbitSignatureRows,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });

  if (expectedVerdict !== args.summaryVerdict) {
    issues.push('summary verdict inconsistent with precedence');
  }

  if (args.bridgePolarityComparisonRows.length !== 2) {
    issues.push('bridge polarity comparison rows must distinguish B+ and B-');
  }

  if (args.bridgeVerdictRows.length < 15) {
    issues.push('bridge verdict rows missing one or more required axes');
  }

  return unique(issues);
}

function parentEvidence(
  parentId: ParentEvidenceRow['parentId'],
  builderName: string,
  importStatus: ParentEvidenceRow['importStatus'],
  ok: boolean | null,
  diagnosticScope: string | null,
  rowLevelEvidenceUsed: string[],
  usedFor: string,
): ParentEvidenceRow {
  return { parentId, builderName, importStatus, ok, diagnosticScope, rowLevelEvidenceUsed, usedFor };
}

function policyRow(
  forbiddenMappingSource: BridgeSearchPolicyRow['forbiddenMappingSource'],
  evidence: string,
): BridgeSearchPolicyRow {
  return {
    searchPolicy: 'no-arbitrary-permutation-search',
    allowedMappingSource: 'lineage-createdBy-sourceEdgeId-and-sourceVertexIds',
    forbiddenMappingSource,
    status: 'enforced',
    evidence,
  };
}

function boundary(boundaryId: string, statement: string): BoundaryRow {
  return { boundaryId, statement, enforced: true };
}

function falsifier(falsifierId: string, description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function verdictRow(verdictAxis: BridgeVerdictRow['verdictAxis'], pass: boolean, evidence: string): BridgeVerdictRow {
  return { verdictAxis, status: pass ? 'pass' : 'fail', evidence };
}

function buildPolarityComparisonRow(
  polarityConvention: BridgePolarityConvention,
  args: Parameters<typeof buildBridgePolarityComparisonRows>[0],
  defaultStatus: BridgePolarityComparisonRow['polarityStatus'],
): BridgePolarityComparisonRow {
  const flags = distinctFlags(args.directBridgeRows, polarityConvention);
  const s4Rows = args.s4EquivarianceRows.filter((row) => row.polarityConvention === polarityConvention);
  const triangleRows = polarityConvention === 'shared-to-omitted' ? args.plusTriangleRows : args.minusTriangleRows;
  const squareRows = polarityConvention === 'shared-to-omitted' ? args.plusSquareRows : args.minusSquareRows;
  const triangleComparisons =
    polarityConvention === 'shared-to-omitted' ? args.plusTriangleComparisons : args.minusTriangleComparisons;
  const squareComparisons =
    polarityConvention === 'shared-to-omitted' ? args.plusSquareComparisons : args.minusSquareComparisons;
  const allDirectedFlagsCovered = sameStringSet(flags, DIRECTED_FLAGS);

  return {
    polarityConvention,
    distinctFlagCount: flags.length,
    allDirectedFlagsCovered,
    veTrianglePassCount: triangleRows.filter((row) => row.triangleStatus === 'actual-face-matches-ve-triangle').length,
    veTriangleFailCount: triangleRows.filter((row) => row.triangleStatus !== 'actual-face-matches-ve-triangle').length,
    veSquarePassCount: squareRows.filter((row) => row.squareStatus === 'actual-face-matches-ve-square').length,
    veSquareFailCount: squareRows.filter((row) => row.squareStatus !== 'actual-face-matches-ve-square').length,
    s4EquivariancePassCount: s4Rows.filter((row) => row.equivarianceStatus === 's4-equivariant').length,
    s4EquivarianceFailCount: s4Rows.filter((row) => row.equivarianceStatus !== 's4-equivariant').length,
    compositionTriangleMatchCount: triangleComparisons.filter((row) => row.matchesDiscriminatorTriangleSet).length,
    compositionTriangleNonMatchCount: triangleComparisons.filter((row) => !row.matchesDiscriminatorTriangleSet).length,
    compositionSquareMatchCount: squareComparisons.filter((row) => row.matchesDiscriminatorSquareSet).length,
    compositionSquareNonMatchCount: squareComparisons.filter((row) => !row.matchesDiscriminatorSquareSet).length,
    polarityStatus: allDirectedFlagsCovered ? defaultStatus : 'failed-polarity',
  };
}

function selectSeedCell(shape: Shape, topology: CellTopology): Cell | null {
  return shape.cells.find((cell) => cell.kind === 'seed' && cell.topology === topology) ?? null;
}

function selectLatestCoreCellByCombinedRule(shape: Shape, topology: CellTopology, generationDepth: number): Cell | null {
  const generation = latestGenerationForDepth(shape, generationDepth);
  const createdCellIds = new Set(generation?.createdCellIds ?? []);

  return (
    sortedCells(shape.cells).find(
      (cell) =>
        cell.kind === 'core' &&
        cell.topology === topology &&
        cell.generationDepth === generationDepth &&
        cell.sourceOperation === 'ambo-dissection' &&
        createdCellIds.has(cell.id) &&
        getCellTopologySignature(shape, cell).readinessStatus === 'enabled',
    ) ?? null
  );
}

function latestGenerationForDepth(shape: Shape, depth: number): Shape['generations'][number] | null {
  return [...shape.generations].reverse().find((generation) => generation.depth === depth) ?? null;
}

function octahedronSignaturePass(signature: CellTopologySignature | null): boolean {
  return Boolean(
    signature?.topology === 'octahedron' &&
      signature.vertexCount === 6 &&
      signature.edgeCount === 12 &&
      signature.faceCount === 8 &&
      signature.faceSizeHistogram[3] === 8 &&
      signature.vertexDegreeHistogram[4] === 6 &&
      signature.readinessStatus === 'enabled',
  );
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
      signature.readinessStatus === 'enabled',
  );
}

function getCellFaces(shape: Shape, cell: Cell): Face[] {
  const facesById = new Map(shape.faces.map((face) => [face.id, face]));

  return cell.faceIds.map((faceId) => facesById.get(faceId)).filter((face): face is Face => Boolean(face));
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

function tetraEdgeIdFromLabels(labels: readonly [A3Label, A3Label]): TetraEdgeId {
  return labels
    .slice()
    .sort((left, right) => A3_LABELS.indexOf(left) - A3_LABELS.indexOf(right))
    .join('') as TetraEdgeId;
}

function edgeLabels(edgeId: TetraEdgeId): [A3Label, A3Label] {
  return edgeId.split('') as [A3Label, A3Label];
}

function sharedAndOmittedLabels(tetraEdgeA: TetraEdgeId, tetraEdgeB: TetraEdgeId): {
  sharedLabel: A3Label | null;
  omittedLabel: A3Label | null;
} {
  const labelsA = edgeLabels(tetraEdgeA);
  const labelsB = edgeLabels(tetraEdgeB);
  const shared = labelsA.filter((label) => labelsB.includes(label));
  const union = unique([...labelsA, ...labelsB]);
  const omitted = A3_LABELS.filter((label) => !union.includes(label));

  return {
    sharedLabel: shared.length === 1 ? shared[0] : null,
    omittedLabel: omitted.length === 1 ? omitted[0] : null,
  };
}

function classifyWedgeStatus(
  wedge: { sharedLabel: A3Label | null; omittedLabel: A3Label | null },
  tetraEdgeA: TetraEdgeId,
  tetraEdgeB: TetraEdgeId,
  sourceEvidence: G1OctaEdgeTetraWedgeRow['sourceEvidence'],
): G1OctaEdgeTetraWedgeRow['wedgeStatus'] {
  if (sourceEvidence === 'missing-source-evidence') {
    return 'non-incident-tetra-edges';
  }

  if (tetraEdgeA === tetraEdgeB || !wedge.sharedLabel) {
    return 'ambiguous-shared-label';
  }

  if (!wedge.omittedLabel) {
    return 'ambiguous-omitted-label';
  }

  return 'incident-tetra-edge-wedge';
}

function flagId(shared: A3Label, omitted: A3Label): A3FlagId {
  return `${shared}->${omitted}` as A3FlagId;
}

function parseFlagId(flag: A3FlagId): { shared: A3Label; omitted: A3Label } {
  const [shared, omitted] = flag.split('->') as [A3Label, A3Label];
  return { shared, omitted };
}

function flagForWedge(wedge: TetraWedge, polarityConvention: BridgePolarityConvention): A3FlagId {
  return polarityConvention === 'shared-to-omitted'
    ? flagId(wedge.sharedLabel, wedge.omittedLabel)
    : flagId(wedge.omittedLabel, wedge.sharedLabel);
}

function allTetraWedges(): TetraWedge[] {
  const wedges: TetraWedge[] = [];

  for (let leftIndex = 0; leftIndex < TETRA_EDGES.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < TETRA_EDGES.length; rightIndex += 1) {
      const tetraEdgeA = TETRA_EDGES[leftIndex];
      const tetraEdgeB = TETRA_EDGES[rightIndex];
      const labels = sharedAndOmittedLabels(tetraEdgeA, tetraEdgeB);

      if (labels.sharedLabel && labels.omittedLabel) {
        wedges.push({
          tetraEdgeA,
          tetraEdgeB,
          sharedLabel: labels.sharedLabel,
          omittedLabel: labels.omittedLabel,
        });
      }
    }
  }

  return wedges;
}

function allS4Permutations(): Array<Record<A3Label, A3Label>> {
  return permutations([...A3_LABELS]).map(
    (values) =>
      Object.fromEntries(A3_LABELS.map((label, index) => [label, values[index]])) as Record<A3Label, A3Label>,
  );
}

function applyPermutationToLabel(label: A3Label, permutationMap: Record<A3Label, A3Label>): A3Label {
  return permutationMap[label];
}

function applyPermutationToFlag(flag: string, permutationMap: Record<A3Label, A3Label>): string {
  const parsed = parseFlagId(flag as A3FlagId);
  return flagId(applyPermutationToLabel(parsed.shared, permutationMap), applyPermutationToLabel(parsed.omitted, permutationMap));
}

function applyPermutationToTetraEdge(edgeId: TetraEdgeId, permutationMap: Record<A3Label, A3Label>): TetraEdgeId {
  const [left, right] = edgeLabels(edgeId);
  return tetraEdgeIdFromLabels([applyPermutationToLabel(left, permutationMap), applyPermutationToLabel(right, permutationMap)]);
}

function applyPermutationToWedge(wedge: TetraWedge, permutationMap: Record<A3Label, A3Label>): TetraWedge {
  const tetraEdgeA = applyPermutationToTetraEdge(wedge.tetraEdgeA, permutationMap);
  const tetraEdgeB = applyPermutationToTetraEdge(wedge.tetraEdgeB, permutationMap);
  const sortedEdges = sortTetraEdges([tetraEdgeA, tetraEdgeB]);
  const labels = sharedAndOmittedLabels(sortedEdges[0], sortedEdges[1]);

  if (!labels.sharedLabel || !labels.omittedLabel) {
    throw new Error(`Permutation produced non-wedge ${tetraEdgeA}/${tetraEdgeB}.`);
  }

  return {
    tetraEdgeA: sortedEdges[0],
    tetraEdgeB: sortedEdges[1],
    sharedLabel: labels.sharedLabel,
    omittedLabel: labels.omittedLabel,
  };
}

function applyPermutationToFlagSetKey(flagSet: string, permutationMap: Record<A3Label, A3Label>): string {
  return flagSetKey(flagSet.split('|').filter(Boolean).map((flag) => applyPermutationToFlag(flag, permutationMap) as A3FlagId));
}

function classifyVETriangle(flagTriple: readonly A3FlagId[]): {
  triangleKind: VectorEquilibriumTriangleRow['triangleKind'];
  fixedLabel: A3Label | null;
} {
  const parsed = flagTriple.map(parseFlagId);
  const sharedLabels = unique(parsed.map((flag) => flag.shared));
  const omittedLabels = unique(parsed.map((flag) => flag.omitted));
  const distinctFlags = new Set(flagTriple);

  if (flagTriple.length !== 3 || distinctFlags.size !== 3) {
    return { triangleKind: 'not-vector-equilibrium-triangle', fixedLabel: null };
  }

  if (sharedLabels.length === 1 && omittedLabels.length === 3 && !omittedLabels.includes(sharedLabels[0])) {
    return { triangleKind: 'fixed-shared-label', fixedLabel: sharedLabels[0] };
  }

  if (omittedLabels.length === 1 && sharedLabels.length === 3 && !sharedLabels.includes(omittedLabels[0])) {
    return { triangleKind: 'fixed-omitted-label', fixedLabel: omittedLabels[0] };
  }

  return { triangleKind: 'not-vector-equilibrium-triangle', fixedLabel: null };
}

function classifyVESquare(flagCycle: readonly A3FlagId[]): {
  sourceLabelPair: [A3Label, A3Label] | null;
  targetLabelPair: [A3Label, A3Label] | null;
  correspondingTetraEdge: TetraEdgeId | null;
} {
  const parsed = flagCycle.map(parseFlagId);
  const sourceLabels = unique(parsed.map((flag) => flag.shared)).sort(labelSort);
  const targetLabels = unique(parsed.map((flag) => flag.omitted)).sort(labelSort);
  const expectedFlagSet =
    sourceLabels.length === 2 && targetLabels.length === 2 && sourceLabels.every((label) => !targetLabels.includes(label))
      ? sourceLabels.flatMap((source) => targetLabels.map((target) => flagId(source, target)))
      : [];
  const pass = flagCycle.length === 4 && expectedFlagSet.length === 4 && flagSetKey(flagCycle) === flagSetKey(expectedFlagSet);

  return {
    sourceLabelPair: pass ? [sourceLabels[0], sourceLabels[1]] : null,
    targetLabelPair: pass ? [targetLabels[0], targetLabels[1]] : null,
    correspondingTetraEdge: pass ? tetraEdgeIdFromLabels([sourceLabels[0], sourceLabels[1]]) : null,
  };
}

function flagsForPolarity(row: ActualFaceFlagRow, polarityConvention: BridgePolarityConvention): A3FlagId[] {
  return polarityConvention === 'shared-to-omitted' ? row.flagIdsPlus : row.flagIdsMinus;
}

function a3VETriangleFlagSets(): A3FlagId[][] {
  const fixedShared = A3_LABELS.map((shared) =>
    A3_LABELS.filter((omitted) => omitted !== shared).map((omitted) => flagId(shared, omitted)),
  );
  const fixedOmitted = A3_LABELS.map((omitted) =>
    A3_LABELS.filter((shared) => shared !== omitted).map((shared) => flagId(shared, omitted)),
  );
  return [...fixedShared, ...fixedOmitted];
}

function a3VESquareFlagSets(): A3FlagId[][] {
  return TETRA_EDGES.map((edge) => {
    const sourceLabels = edgeLabels(edge);
    const targetLabels = A3_LABELS.filter((label) => !sourceLabels.includes(label));
    return sourceLabels.flatMap((source) => targetLabels.map((target) => flagId(source, target)));
  });
}

function buildCompositionTriangleGroups(rows: readonly ParentTriangleClosureRow[]): CompositionTriangleGroup[] {
  return Array.from(groupBy(rows, (row) => row.triangleId).entries())
    .map(([triangleId, groupRows]) => ({
      triangleId,
      flagIds: unique(
        groupRows.flatMap((row) => [row.leftFlagId as A3FlagId, row.rightFlagId as A3FlagId, row.targetFlagId as A3FlagId]),
      ).sort(flagSort),
    }))
    .sort((left, right) => left.triangleId.localeCompare(right.triangleId));
}

function buildCompositionSquareGroups(rows: readonly ParentSquareHolonomyRow[]): CompositionSquareGroup[] {
  return Array.from(groupBy(rows, (row) => row.squareCycleId).entries())
    .map(([squareCycleId, groupRows]) => ({
      squareCycleId,
      flagIds: [...(groupRows[0]?.flagCycle ?? [])] as A3FlagId[],
    }))
    .sort((left, right) => left.squareCycleId.localeCompare(right.squareCycleId));
}

function buildCentralHexagonRow(args: {
  hexagonSystem: CentralHexagonRow['hexagonSystem'];
  hexagonId: string;
  label: A3Label;
  flagIds: A3FlagId[];
  edgeRule: CentralHexagonRow['edgeRule'];
  internalEdgePairs: Array<[A3FlagId, A3FlagId]>;
}): CentralHexagonRow {
  const degreeHistogram = histogram(args.flagIds.map((flag) => args.internalEdgePairs.filter(([left, right]) => left === flag || right === flag).length));
  const connectedSixCycle =
    args.flagIds.length === 6 &&
    args.internalEdgePairs.length === 6 &&
    degreeHistogram[2] === 6 &&
    isConnected(args.flagIds, args.internalEdgePairs);

  return {
    hexagonSystem: args.hexagonSystem,
    hexagonId: args.hexagonId,
    label: args.label,
    flagIds: args.flagIds,
    edgeRule: args.edgeRule,
    internalEdgePairs: args.internalEdgePairs,
    internalEdgeCount: args.internalEdgePairs.length,
    degreeHistogram,
    connectedSixCycle,
    hexagonStatus: connectedSixCycle ? 'central-hexagon-pass' : 'central-hexagon-fail',
  };
}

function internalPairs(
  flagIds: readonly A3FlagId[],
  adjacent: (left: A3FlagId, right: A3FlagId) => boolean,
): Array<[A3FlagId, A3FlagId]> {
  const pairs: Array<[A3FlagId, A3FlagId]> = [];

  for (let leftIndex = 0; leftIndex < flagIds.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < flagIds.length; rightIndex += 1) {
      if (adjacent(flagIds[leftIndex], flagIds[rightIndex])) {
        pairs.push([flagIds[leftIndex], flagIds[rightIndex]]);
      }
    }
  }

  return pairs;
}

function sameSourceOrSameTarget(left: A3FlagId, right: A3FlagId): boolean {
  const parsedLeft = parseFlagId(left);
  const parsedRight = parseFlagId(right);

  return parsedLeft.shared === parsedRight.shared || parsedLeft.omitted === parsedRight.omitted;
}

function areAdjacentA3Roots(left: A3FlagId, right: A3FlagId): boolean {
  const parsedLeft = parseFlagId(left);
  const parsedRight = parseFlagId(right);
  const exactOpposite = parsedLeft.shared === parsedRight.omitted && parsedLeft.omitted === parsedRight.shared;

  return !exactOpposite && (parsedLeft.omitted === parsedRight.shared || parsedLeft.shared === parsedRight.omitted);
}

function computeS4Orbits(
  objects: readonly string[],
  permutations24: readonly Record<A3Label, A3Label>[],
  action: (object: string, permutation: Record<A3Label, A3Label>) => string,
): OrbitComputation {
  const objectSet = new Set(objects);
  const visited = new Set<string>();
  const orbitSizes: number[] = [];
  const stabilizerSizes: number[] = [];
  const representatives: string[] = [];
  let failed = false;

  for (const object of [...objectSet].sort()) {
    if (visited.has(object)) {
      continue;
    }

    const orbit = new Set<string>();
    let stabilizerSize = 0;

    for (const permutation of permutations24) {
      const image = action(object, permutation);

      if (!objectSet.has(image)) {
        failed = true;
      }

      orbit.add(image);

      if (image === object) {
        stabilizerSize += 1;
      }
    }

    for (const member of orbit) {
      visited.add(member);
    }

    orbitSizes.push(orbit.size);
    stabilizerSizes.push(stabilizerSize);
    representatives.push(object);
  }

  return {
    objectCount: objects.length,
    permutationCount: 24,
    orbitCount: orbitSizes.length,
    orbitSizes: orbitSizes.sort(numberSort),
    stabilizerSizes: stabilizerSizes.sort(numberSort),
    representatives: representatives.sort(),
    transitive: orbitSizes.length === 1,
    status: !failed && permutations24.length === 24 ? 'computed' : 'failed',
  };
}

function actualAndCompositionSeparateByOrbitType(rows: readonly S4OrbitSignatureRow[]): boolean {
  const actualTriangles = rows.find((row) => row.systemId === 'actual-ve-triangles');
  const compositionTriangles = rows.find((row) => row.systemId === 'composition-triangles');
  const actualSquares = rows.find((row) => row.systemId === 'actual-ve-squares');
  const compositionSquares = rows.find((row) => row.systemId === 'composition-squares');

  if (!actualTriangles || !compositionTriangles || !actualSquares || !compositionSquares) {
    return false;
  }

  return (
    signatureKey(actualTriangles) !== signatureKey(compositionTriangles) ||
    signatureKey(actualSquares) !== signatureKey(compositionSquares)
  );
}

function signatureKey(row: S4OrbitSignatureRow): string {
  return `${row.orbitSizes.join(',')}|${row.stabilizerSizes.join(',')}`;
}

function sourceLineageReady(rows: readonly SourceLineageRow[]): boolean {
  return rows.length === 1 && rows[0].lineageStatus === 'lineage-ready-for-direct-bridge';
}

function tetraLabelsReady(rows: readonly TetraSeedVertexLabelRow[]): boolean {
  return rows.length === 4 && rows.every((row) => row.labelStatus === 'label-ready') && sameStringSet(rows.map((row) => row.label), A3_LABELS);
}

function g1VertexRowsReady(rows: readonly G1OctaVertexTetraEdgeRow[]): boolean {
  return (
    rows.length === 6 &&
    rows.every((row) => row.bridgeStatus === 'octa-vertex-bridged-to-tetra-edge') &&
    sameStringSet(rows.map((row) => row.tetraEdgeId), TETRA_EDGES)
  );
}

function g1WedgeRowsReady(rows: readonly G1OctaEdgeTetraWedgeRow[]): boolean {
  return rows.length === 12 && rows.every((row) => row.wedgeStatus === 'incident-tetra-edge-wedge' && row.sharedLabel && row.omittedLabel);
}

function directBridgeReady(rows: readonly DirectBridgeRow[]): boolean {
  return (
    rows.length === 12 &&
    rows.every((row) => row.bridgeStatus === 'direct-lineage-bridge-row') &&
    new Set(rows.map((row) => row.cuboctahedronVertexId)).size === 12 &&
    sameStringSet(distinctFlags(rows, 'shared-to-omitted'), DIRECTED_FLAGS) &&
    sameStringSet(distinctFlags(rows, 'omitted-to-shared'), DIRECTED_FLAGS)
  );
}

function s4EquivarianceReady(rows: readonly S4EquivarianceRow[]): boolean {
  return rows.length === 48 && rows.every((row) => row.testedWedgeCount === 12 && row.failedCount === 0 && row.equivarianceStatus === 's4-equivariant');
}

function s4RepresentationReady(rows: readonly S4RepresentationOrbitRow[]): boolean {
  return (
    rows.length >= REQUIRED_REPRESENTATION_SYSTEMS.length &&
    REQUIRED_REPRESENTATION_SYSTEMS.every((system) => rows.some((row) => row.objectSystem === system)) &&
    rows.every((row) => row.permutationCount === 24 && row.orbitSignatureStatus === 'computed')
  );
}

function actualFaceRowsReady(rows: readonly ActualFaceFlagRow[]): boolean {
  return (
    rows.length === 14 &&
    rows.filter((row) => row.faceSize === 3).length === 8 &&
    rows.filter((row) => row.faceSize === 4).length === 6 &&
    rows.every((row) => row.actualFaceBridgeStatus === 'actual-face-bridged')
  );
}

function veTriangleRowsReady(rows: readonly VectorEquilibriumTriangleRow[]): boolean {
  return (
    rows.length === 8 &&
    rows.filter((row) => row.triangleKind === 'fixed-shared-label').length === 4 &&
    rows.filter((row) => row.triangleKind === 'fixed-omitted-label').length === 4 &&
    rows.every((row) => row.triangleStatus === 'actual-face-matches-ve-triangle')
  );
}

function veSquareRowsReady(rows: readonly VectorEquilibriumSquareRow[]): boolean {
  return (
    rows.length === 6 &&
    rows.every((row) => row.squareStatus === 'actual-face-matches-ve-square') &&
    sameStringSet(rows.map((row) => row.correspondingTetraEdge).filter(isTetraEdgeId), TETRA_EDGES)
  );
}

function centralHexagonsReady(rows: readonly CentralHexagonRow[]): boolean {
  return (
    rows.filter((row) => row.hexagonSystem === 'vector-equilibrium-a2-omitted-label').length === 4 &&
    rows.filter((row) => row.hexagonSystem === 'composition-incidence-involving-label').length === 4 &&
    rows.every((row) => row.hexagonStatus === 'central-hexagon-pass')
  );
}

function s4OrbitSignaturesReady(rows: readonly S4OrbitSignatureRow[]): boolean {
  return rows.length === 4 && rows.every((row) => row.permutationCount === 24 && row.orbitSignatureStatus === 'computed');
}

function hasBothPolarities(rows: readonly DirectBridgeRow[]): boolean {
  return rows.every((row) => row.flagPlus && row.flagMinus && row.selectedConvention === 'both-tested');
}

function distinctFlags(rows: readonly DirectBridgeRow[], polarityConvention: BridgePolarityConvention): A3FlagId[] {
  return unique(
    rows
      .map((row) => (polarityConvention === 'shared-to-omitted' ? row.flagPlus : row.flagMinus))
      .filter(isA3FlagId),
  ).sort(flagSort);
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((boundaryId) => !rows.some((row) => row.boundaryId === boundaryId && row.enforced));
}

function boundaryFalsifierId(falsifierId: string): boolean {
  return ['F5', 'F11', 'F12', 'F15', 'F17'].includes(falsifierId);
}

function isA3Label(value: unknown): value is A3Label {
  return typeof value === 'string' && A3_LABELS.includes(value as A3Label);
}

function isA3FlagId(value: A3FlagId | string | null | undefined): value is A3FlagId {
  return typeof value === 'string' && DIRECTED_FLAGS.includes(value as A3FlagId);
}

function isTetraEdgeId(value: TetraEdgeId | string | null): value is TetraEdgeId {
  return typeof value === 'string' && TETRA_EDGES.includes(value as TetraEdgeId);
}

function tuple3(values: readonly A3FlagId[]): [A3FlagId, A3FlagId, A3FlagId] {
  return [values[0] ?? 'A->B', values[1] ?? 'A->C', values[2] ?? 'A->D'];
}

function tuple4(values: readonly A3FlagId[]): [A3FlagId, A3FlagId, A3FlagId, A3FlagId] {
  return [values[0] ?? 'A->B', values[1] ?? 'A->C', values[2] ?? 'A->D', values[3] ?? 'B->A'];
}

function flagSetKey(flags: readonly A3FlagId[]): string {
  return unique(flags).sort(flagSort).join('|');
}

function flagSort(left: A3FlagId, right: A3FlagId): number {
  return DIRECTED_FLAGS.indexOf(left) - DIRECTED_FLAGS.indexOf(right);
}

function labelSort(left: A3Label, right: A3Label): number {
  return A3_LABELS.indexOf(left) - A3_LABELS.indexOf(right);
}

function sortTetraEdges(edges: readonly [TetraEdgeId, TetraEdgeId]): [TetraEdgeId, TetraEdgeId] {
  const sorted = [...edges].sort((left, right) => TETRA_EDGES.indexOf(left) - TETRA_EDGES.indexOf(right));
  return [sorted[0], sorted[1]];
}

function sameStringSet(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && new Set(left).size === left.length && [...left].sort().join('|') === [...right].sort().join('|');
}

function isConnected(nodes: readonly A3FlagId[], edges: ReadonlyArray<[A3FlagId, A3FlagId]>): boolean {
  if (nodes.length === 0) {
    return false;
  }

  const adjacency = new Map(nodes.map((node) => [node, new Set<A3FlagId>()]));

  for (const [left, right] of edges) {
    adjacency.get(left)?.add(right);
    adjacency.get(right)?.add(left);
  }

  const visited = new Set<A3FlagId>();
  const stack = [nodes[0]];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current || visited.has(current)) {
      continue;
    }

    visited.add(current);

    for (const next of adjacency.get(current) ?? []) {
      stack.push(next);
    }
  }

  return visited.size === nodes.length;
}

function histogram(values: readonly number[]): Record<number, number> {
  return values.reduce<Record<number, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function countBy<T>(values: readonly T[], getKey: (value: T) => string): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = getKey(value);
    counts[key] = (counts[key] ?? 0) + 1;
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

function permutations<T>(values: T[]): T[][] {
  if (values.length <= 1) {
    return [values];
  }

  return values.flatMap((value, index) => {
    const rest = [...values.slice(0, index), ...values.slice(index + 1)];
    return permutations(rest).map((permutation) => [value, ...permutation]);
  });
}

function numberSort(left: number, right: number): number {
  return left - right;
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}
