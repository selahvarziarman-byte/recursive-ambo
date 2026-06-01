import type { FieldChartSemanticRole } from './fieldAtlas';
import type {
  SampledClosedShapeSurfaceAtlas,
  SurfaceChartAtlasSample,
} from './fieldAtlasSurfaceSampling';
import type { FaceId, Vec3 } from '../types/geometry';

export type SurfaceSampleGraphAdjacencyStrategy =
  | 'chart-local-barycentric-lattice-v1'
  | 'chart-local-nearest-neighbor-fallback-v1'
  | 'mixed-chart-local-v1';

export type ChartSampleGraphAdjacencyStrategy = Exclude<
  SurfaceSampleGraphAdjacencyStrategy,
  'mixed-chart-local-v1'
>;

export type SurfaceSampleGraphScope = 'chart-local-only';
export type SurfaceSampleGraphGlobalContinuity = 'none';
export type SurfaceSampleGraphEdgeKind = 'chart-local-neighbor';
export type ClosedSurfaceSeamAwareSampleGraphKind =
  'closed-surface-seam-aware-sample-graph-v0';
export type ClosedSurfaceSeamAwareSampleGraphStrategy =
  'geometric-boundary-coincidence-v0';
export type ClosedSurfaceSeamAwareSampleGraphScope = 'closed-surface-seam-aware';
export type ClosedSurfaceSeamAwareSampleGraphSemanticStatus = 'not-semantic-identity';
export type ClosedSurfaceSeamAwareSampleGraphTopologyStatus = 'not-topology-workspace';
export type ClosedSurfaceSeamAwareSampleGraphRouteGateStatus =
  'not-route-or-gate-extraction';
export type ClosedSurfaceSeamAwareSampleGraphPhaseContinuityStatus =
  'not-global-phase-continuity';
export type ClosedSurfaceSeamEdgeKind = 'closed-surface-seam-neighbor';
export type ClosedSurfaceSeamReasonKind = 'no-compatible-boundary-coincidence';

export interface SurfaceSampleGraphNode {
  sampleId: string;
  sampleOrder: number;
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  localChartPosition: [number, number];
  barycentric: [number, number, number];
  barycentricIndices?: [number, number, number];
  subdivisions?: number;
  intensity: number;
  phase: number;
  isChartBoundary: boolean;
}

export interface SurfaceSampleGraphEdge {
  edgeId: string;
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  sampleIds: [string, string];
  localDistance: number;
  edgeKind: SurfaceSampleGraphEdgeKind;
}

export interface ClosedSurfaceSeamGraphEdge {
  edgeId: string;
  edgeKind: ClosedSurfaceSeamEdgeKind;
  sampleIds: [string, string];
  chartIds: [string, string];
  sourceFaceIds: [FaceId, FaceId];
  worldDistance: number;
  strategy: ClosedSurfaceSeamAwareSampleGraphStrategy;
  semanticStatus: ClosedSurfaceSeamAwareSampleGraphSemanticStatus;
}

export interface ClosedSurfaceSeamReason {
  reasonKind: ClosedSurfaceSeamReasonKind;
  reason: string;
  boundarySampleCount: number;
}

export interface ChartSampleGraphSummary {
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  nodeCount: number;
  edgeCount: number;
  boundaryNodeCount: number;
  isolatedNodeCount: number;
  adjacencyStrategy: ChartSampleGraphAdjacencyStrategy;
  underconnected: boolean;
  underconnectedReason?: string;
}

export interface ChartSampleGraph {
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  nodes: SurfaceSampleGraphNode[];
  edges: SurfaceSampleGraphEdge[];
  summary: ChartSampleGraphSummary;
  adjacencyStrategy: ChartSampleGraphAdjacencyStrategy;
  scope: SurfaceSampleGraphScope;
  globalSurfaceContinuity: SurfaceSampleGraphGlobalContinuity;
}

export interface SurfaceSampleGraphSummary {
  chartCount: number;
  totalNodeCount: number;
  totalEdgeCount: number;
  isolatedNodeCount: number;
  boundaryNodeCount: number;
  underconnectedChartCount: number;
  adjacencyStrategy: SurfaceSampleGraphAdjacencyStrategy;
  scope: SurfaceSampleGraphScope;
  globalSurfaceContinuity: SurfaceSampleGraphGlobalContinuity;
  chartSummaries: ChartSampleGraphSummary[];
}

export interface SurfaceSampleGraph {
  nodes: SurfaceSampleGraphNode[];
  edges: SurfaceSampleGraphEdge[];
  chartGraphs: ChartSampleGraph[];
  summary: SurfaceSampleGraphSummary;
  adjacencyStrategy: SurfaceSampleGraphAdjacencyStrategy;
  scope: SurfaceSampleGraphScope;
  globalSurfaceContinuity: SurfaceSampleGraphGlobalContinuity;
}

export type ClosedSurfaceSeamAwareSampleGraphEdge =
  | SurfaceSampleGraphEdge
  | ClosedSurfaceSeamGraphEdge;

export interface ClosedSurfaceSeamAwareSampleGraphSummary {
  nodeCount: number;
  chartLocalEdgeCount: number;
  seamEdgeCount: number;
  totalEdgeCount: number;
  connectedComponentCount: number;
  isolatedNodeCount: number;
  chartsRepresented: number;
  unsupportedOrAmbiguousSeamReasonCount: number;
}

export interface ClosedSurfaceSeamAwareSampleGraph {
  kind: ClosedSurfaceSeamAwareSampleGraphKind;
  strategy: ClosedSurfaceSeamAwareSampleGraphStrategy;
  scope: ClosedSurfaceSeamAwareSampleGraphScope;
  semanticStatus: ClosedSurfaceSeamAwareSampleGraphSemanticStatus;
  topologyStatus: ClosedSurfaceSeamAwareSampleGraphTopologyStatus;
  routeGateStatus: ClosedSurfaceSeamAwareSampleGraphRouteGateStatus;
  phaseContinuityStatus: ClosedSurfaceSeamAwareSampleGraphPhaseContinuityStatus;
  sourceChartLocalGraph: SurfaceSampleGraph;
  nodes: SurfaceSampleGraphNode[];
  chartLocalEdges: SurfaceSampleGraphEdge[];
  seamEdges: ClosedSurfaceSeamGraphEdge[];
  edges: ClosedSurfaceSeamAwareSampleGraphEdge[];
  seamReasons: ClosedSurfaceSeamReason[];
  summary: ClosedSurfaceSeamAwareSampleGraphSummary;
}

const SCOPE: SurfaceSampleGraphScope = 'chart-local-only';
const GLOBAL_SURFACE_CONTINUITY: SurfaceSampleGraphGlobalContinuity = 'none';
const SEAM_GRAPH_KIND: ClosedSurfaceSeamAwareSampleGraphKind =
  'closed-surface-seam-aware-sample-graph-v0';
const SEAM_STRATEGY: ClosedSurfaceSeamAwareSampleGraphStrategy =
  'geometric-boundary-coincidence-v0';
const SEAM_SCOPE: ClosedSurfaceSeamAwareSampleGraphScope = 'closed-surface-seam-aware';
const SEAM_SEMANTIC_STATUS: ClosedSurfaceSeamAwareSampleGraphSemanticStatus =
  'not-semantic-identity';
const SEAM_TOPOLOGY_STATUS: ClosedSurfaceSeamAwareSampleGraphTopologyStatus =
  'not-topology-workspace';
const SEAM_ROUTE_GATE_STATUS: ClosedSurfaceSeamAwareSampleGraphRouteGateStatus =
  'not-route-or-gate-extraction';
const SEAM_PHASE_CONTINUITY_STATUS: ClosedSurfaceSeamAwareSampleGraphPhaseContinuityStatus =
  'not-global-phase-continuity';
const LATTICE_STRATEGY: ChartSampleGraphAdjacencyStrategy =
  'chart-local-barycentric-lattice-v1';
const FALLBACK_STRATEGY: ChartSampleGraphAdjacencyStrategy =
  'chart-local-nearest-neighbor-fallback-v1';
const BOUNDARY_EPSILON = 1e-12;
const SEAM_POSITION_TOLERANCE = 1e-9;

export function buildSurfaceSampleGraph(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
): SurfaceSampleGraph {
  const chartGraphs = sampledAtlas.domain.surfaceCharts.map((chart) =>
    buildChartSampleGraph(sampledAtlas, chart.chartId),
  );
  const nodes = chartGraphs.flatMap((chartGraph) => chartGraph.nodes);
  const edges = chartGraphs.flatMap((chartGraph) => chartGraph.edges);
  const chartSummaries = chartGraphs.map((chartGraph) => chartGraph.summary);
  const adjacencyStrategy = summarizeAdjacencyStrategy(
    chartGraphs.map((chartGraph) => chartGraph.adjacencyStrategy),
  );

  return {
    nodes,
    edges,
    chartGraphs,
    summary: {
      chartCount: sampledAtlas.domain.surfaceCharts.length,
      totalNodeCount: nodes.length,
      totalEdgeCount: edges.length,
      isolatedNodeCount: chartSummaries.reduce(
        (sum, summary) => sum + summary.isolatedNodeCount,
        0,
      ),
      boundaryNodeCount: chartSummaries.reduce(
        (sum, summary) => sum + summary.boundaryNodeCount,
        0,
      ),
      underconnectedChartCount: chartSummaries.filter((summary) => summary.underconnected)
        .length,
      adjacencyStrategy,
      scope: SCOPE,
      globalSurfaceContinuity: GLOBAL_SURFACE_CONTINUITY,
      chartSummaries,
    },
    adjacencyStrategy,
    scope: SCOPE,
    globalSurfaceContinuity: GLOBAL_SURFACE_CONTINUITY,
  };
}

export function buildChartSampleGraph(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
  chartId: string,
): ChartSampleGraph {
  const chart = sampledAtlas.domain.surfaceCharts.find(
    (candidate) => candidate.chartId === chartId,
  );

  if (!chart) {
    throw new Error(`Sample graph chart ${chartId} was not found.`);
  }

  const nodes = sampledAtlas.samples
    .map((sample, sampleOrder) => ({ sample, sampleOrder }))
    .filter(({ sample }) => sample.chartId === chart.chartId)
    .map(({ sample, sampleOrder }) => buildGraphNode(sample, sampleOrder));
  const adjacencyStrategy = hasUsableLatticeMetadata(nodes) ? LATTICE_STRATEGY : FALLBACK_STRATEGY;
  const edges =
    adjacencyStrategy === LATTICE_STRATEGY
      ? buildBarycentricLatticeEdges(nodes)
      : buildNearestNeighborFallbackEdges(nodes);
  const summary = buildChartSummary(
    chart.chartId,
    chart.semanticRole,
    chart.sourceFaceId,
    nodes,
    edges,
    adjacencyStrategy,
  );

  return {
    chartId: chart.chartId,
    chartSemanticRole: chart.semanticRole,
    sourceFaceId: chart.sourceFaceId,
    nodes,
    edges,
    summary,
    adjacencyStrategy,
    scope: SCOPE,
    globalSurfaceContinuity: GLOBAL_SURFACE_CONTINUITY,
  };
}

export function summarizeSurfaceSampleGraph(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
): SurfaceSampleGraphSummary {
  return buildSurfaceSampleGraph(sampledAtlas).summary;
}

export function buildClosedSurfaceSeamAwareSampleGraph(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
): ClosedSurfaceSeamAwareSampleGraph {
  const chartLocalGraph = buildSurfaceSampleGraph(sampledAtlas);
  const seamEdges = buildClosedSurfaceSeamEdges(sampledAtlas, chartLocalGraph.nodes);
  const seamReasons = seamEdges.length
    ? []
    : [buildNoCompatibleBoundaryCoincidenceReason(chartLocalGraph.nodes)];
  const edges: ClosedSurfaceSeamAwareSampleGraphEdge[] = [
    ...chartLocalGraph.edges,
    ...seamEdges,
  ];
  const summary = buildClosedSurfaceSeamAwareSummary(
    chartLocalGraph.nodes,
    chartLocalGraph.edges,
    seamEdges,
    seamReasons,
  );

  return {
    kind: SEAM_GRAPH_KIND,
    strategy: SEAM_STRATEGY,
    scope: SEAM_SCOPE,
    semanticStatus: SEAM_SEMANTIC_STATUS,
    topologyStatus: SEAM_TOPOLOGY_STATUS,
    routeGateStatus: SEAM_ROUTE_GATE_STATUS,
    phaseContinuityStatus: SEAM_PHASE_CONTINUITY_STATUS,
    sourceChartLocalGraph: chartLocalGraph,
    nodes: chartLocalGraph.nodes,
    chartLocalEdges: chartLocalGraph.edges,
    seamEdges,
    edges,
    seamReasons,
    summary,
  };
}

function buildGraphNode(
  sample: SurfaceChartAtlasSample,
  sampleOrder: number,
): SurfaceSampleGraphNode {
  return {
    sampleId: sample.id,
    sampleOrder,
    chartId: sample.chartId,
    chartSemanticRole: sample.chartSemanticRole,
    sourceFaceId: sample.sourceFaceId,
    localChartPosition: [sample.localChartPosition[0], sample.localChartPosition[1]],
    barycentric: [sample.barycentric[0], sample.barycentric[1], sample.barycentric[2]],
    ...(hasBarycentricIndices(sample)
      ? { barycentricIndices: copyBarycentricIndices(sample.barycentricIndices) }
      : {}),
    ...(Number.isInteger(sample.subdivisions) ? { subdivisions: sample.subdivisions } : {}),
    intensity: sample.intensity,
    phase: sample.phase,
    isChartBoundary: isChartBoundarySample(sample),
  };
}

function buildClosedSurfaceSeamEdges(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
  nodes: SurfaceSampleGraphNode[],
): ClosedSurfaceSeamGraphEdge[] {
  const samplePositionById = new Map(
    sampledAtlas.samples.map((sample) => [sample.id, sample.position]),
  );
  const boundaryNodes = nodes.filter((node) => node.isChartBoundary);
  const seamEdgesById = new Map<string, ClosedSurfaceSeamGraphEdge>();

  for (let firstIndex = 0; firstIndex < boundaryNodes.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < boundaryNodes.length;
      secondIndex += 1
    ) {
      const first = boundaryNodes[firstIndex];
      const second = boundaryNodes[secondIndex];

      if (first.chartId === second.chartId) {
        continue;
      }

      const firstPosition = samplePositionById.get(first.sampleId);
      const secondPosition = samplePositionById.get(second.sampleId);

      if (!firstPosition || !secondPosition) {
        continue;
      }

      const worldDistance = distanceVec3(firstPosition, secondPosition);

      if (worldDistance > SEAM_POSITION_TOLERANCE) {
        continue;
      }

      const edge = buildClosedSurfaceSeamEdge(first, second, worldDistance);

      seamEdgesById.set(edge.edgeId, edge);
    }
  }

  return Array.from(seamEdgesById.values()).sort((first, second) =>
    first.edgeId.localeCompare(second.edgeId),
  );
}

function buildClosedSurfaceSeamEdge(
  first: SurfaceSampleGraphNode,
  second: SurfaceSampleGraphNode,
  worldDistance: number,
): ClosedSurfaceSeamGraphEdge {
  const endpoints: [SurfaceSampleGraphNode, SurfaceSampleGraphNode] =
    first.sampleId.localeCompare(second.sampleId) <= 0 ? [first, second] : [second, first];
  const sampleIds = [endpoints[0].sampleId, endpoints[1].sampleId] as [string, string];

  return {
    edgeId: `sample-seam-edge:${sampleIds[0]}:${sampleIds[1]}`,
    edgeKind: 'closed-surface-seam-neighbor',
    sampleIds,
    chartIds: [endpoints[0].chartId, endpoints[1].chartId],
    sourceFaceIds: [endpoints[0].sourceFaceId, endpoints[1].sourceFaceId],
    worldDistance,
    strategy: SEAM_STRATEGY,
    semanticStatus: SEAM_SEMANTIC_STATUS,
  };
}

function buildNoCompatibleBoundaryCoincidenceReason(
  nodes: SurfaceSampleGraphNode[],
): ClosedSurfaceSeamReason {
  const boundarySampleCount = nodes.filter((node) => node.isChartBoundary).length;

  return {
    reasonKind: 'no-compatible-boundary-coincidence',
    reason:
      'No seam edges were emitted because no boundary samples on different charts matched within the geometric-boundary-coincidence-v0 tolerance.',
    boundarySampleCount,
  };
}

function buildClosedSurfaceSeamAwareSummary(
  nodes: SurfaceSampleGraphNode[],
  chartLocalEdges: SurfaceSampleGraphEdge[],
  seamEdges: ClosedSurfaceSeamGraphEdge[],
  seamReasons: ClosedSurfaceSeamReason[],
): ClosedSurfaceSeamAwareSampleGraphSummary {
  const edges: ClosedSurfaceSeamAwareSampleGraphEdge[] = [
    ...chartLocalEdges,
    ...seamEdges,
  ];

  return {
    nodeCount: nodes.length,
    chartLocalEdgeCount: chartLocalEdges.length,
    seamEdgeCount: seamEdges.length,
    totalEdgeCount: edges.length,
    connectedComponentCount: countConnectedComponents(nodes, edges),
    isolatedNodeCount: countIsolatedNodes(nodes, edges),
    chartsRepresented: new Set(nodes.map((node) => node.chartId)).size,
    unsupportedOrAmbiguousSeamReasonCount: seamReasons.length,
  };
}

function buildBarycentricLatticeEdges(
  nodes: SurfaceSampleGraphNode[],
): SurfaceSampleGraphEdge[] {
  const edges: SurfaceSampleGraphEdge[] = [];

  for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < nodes.length; secondIndex += 1) {
      const first = nodes[firstIndex];
      const second = nodes[secondIndex];

      if (
        first.barycentricIndices &&
        second.barycentricIndices &&
        isElementaryTriangularLatticeStep(first.barycentricIndices, second.barycentricIndices)
      ) {
        edges.push(buildGraphEdge(first, second));
      }
    }
  }

  return edges;
}

function buildNearestNeighborFallbackEdges(
  nodes: SurfaceSampleGraphNode[],
): SurfaceSampleGraphEdge[] {
  const edgesByKey = new Map<string, SurfaceSampleGraphEdge>();

  for (const node of nodes) {
    const nearest = nodes
      .filter((candidate) => candidate.sampleId !== node.sampleId)
      .map((candidate) => ({
        node: candidate,
        distance: localDistance(node.localChartPosition, candidate.localChartPosition),
      }))
      .filter((candidate) => Number.isFinite(candidate.distance))
      .sort(
        (first, second) =>
          first.distance - second.distance || first.node.sampleId.localeCompare(second.node.sampleId),
      )[0];

    if (nearest) {
      const edge = buildGraphEdge(node, nearest.node);

      edgesByKey.set(edge.edgeId, edge);
    }
  }

  return Array.from(edgesByKey.values()).sort((first, second) =>
    first.edgeId.localeCompare(second.edgeId),
  );
}

function buildGraphEdge(
  first: SurfaceSampleGraphNode,
  second: SurfaceSampleGraphNode,
): SurfaceSampleGraphEdge {
  const sampleIds = [first.sampleId, second.sampleId].sort() as [string, string];

  return {
    edgeId: `sample-edge:${first.chartId}:${sampleIds[0]}:${sampleIds[1]}`,
    chartId: first.chartId,
    chartSemanticRole: first.chartSemanticRole,
    sourceFaceId: first.sourceFaceId,
    sampleIds,
    localDistance: localDistance(first.localChartPosition, second.localChartPosition),
    edgeKind: 'chart-local-neighbor',
  };
}

function buildChartSummary(
  chartId: string,
  chartSemanticRole: FieldChartSemanticRole,
  sourceFaceId: FaceId,
  nodes: SurfaceSampleGraphNode[],
  edges: SurfaceSampleGraphEdge[],
  adjacencyStrategy: ChartSampleGraphAdjacencyStrategy,
): ChartSampleGraphSummary {
  const connectedSampleIds = new Set(
    edges.flatMap((edge) => [edge.sampleIds[0], edge.sampleIds[1]]),
  );
  const isolatedNodeCount = nodes.filter((node) => !connectedSampleIds.has(node.sampleId)).length;
  const underconnectedReason = getUnderconnectedReason(nodes, isolatedNodeCount);

  return {
    chartId,
    chartSemanticRole,
    sourceFaceId,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    boundaryNodeCount: nodes.filter((node) => node.isChartBoundary).length,
    isolatedNodeCount,
    adjacencyStrategy,
    underconnected: Boolean(underconnectedReason),
    ...(underconnectedReason ? { underconnectedReason } : {}),
  };
}

function getUnderconnectedReason(
  nodes: SurfaceSampleGraphNode[],
  isolatedNodeCount: number,
): string | null {
  if (!nodes.length) {
    return 'Chart has no sampled nodes under the current sampling bounds.';
  }

  if (isolatedNodeCount > 0) {
    return `${isolatedNodeCount} chart-local sample node(s) have no graph neighbors under the current sampling bounds.`;
  }

  return null;
}

function hasUsableLatticeMetadata(nodes: SurfaceSampleGraphNode[]): boolean {
  return nodes.every((node) => {
    const subdivisions = node.subdivisions;

    return Boolean(
      node.barycentricIndices &&
      typeof subdivisions === 'number' &&
      Number.isInteger(subdivisions) &&
      subdivisions >= 1 &&
      node.barycentricIndices.every((index) => Number.isInteger(index) && index >= 0) &&
      node.barycentricIndices.reduce((sum, index) => sum + index, 0) === subdivisions
    );
  });
}

function hasBarycentricIndices(
  sample: SurfaceChartAtlasSample,
): sample is SurfaceChartAtlasSample & {
  barycentricIndices: [number, number, number];
} {
  return (
    Array.isArray(sample.barycentricIndices) &&
    sample.barycentricIndices.length === 3 &&
    sample.barycentricIndices.every((index) => Number.isInteger(index))
  );
}

function copyBarycentricIndices(
  indices: [number, number, number],
): [number, number, number] {
  return [indices[0], indices[1], indices[2]];
}

function isElementaryTriangularLatticeStep(
  first: [number, number, number],
  second: [number, number, number],
): boolean {
  const deltas = first.map((value, index) => Math.abs(value - second[index]));

  return deltas.reduce((sum, delta) => sum + delta, 0) === 2 && Math.max(...deltas) === 1;
}

function isChartBoundarySample(sample: SurfaceChartAtlasSample): boolean {
  const maybeIndices = (sample as { barycentricIndices?: unknown }).barycentricIndices;

  if (
    Array.isArray(maybeIndices) &&
    maybeIndices.length === 3 &&
    maybeIndices.every((index) => Number.isInteger(index))
  ) {
    return maybeIndices.some((index) => index === 0);
  }

  return sample.barycentric.some(
    (coordinate: number) => Math.abs(coordinate) <= BOUNDARY_EPSILON,
  );
}

function summarizeAdjacencyStrategy(
  strategies: ChartSampleGraphAdjacencyStrategy[],
): SurfaceSampleGraphAdjacencyStrategy {
  const uniqueStrategies = new Set(strategies);

  if (uniqueStrategies.size === 1) {
    return strategies[0] ?? LATTICE_STRATEGY;
  }

  return 'mixed-chart-local-v1';
}

function localDistance(first: [number, number], second: [number, number]): number {
  const du = first[0] - second[0];
  const dv = first[1] - second[1];

  return Math.hypot(du, dv);
}

function countConnectedComponents(
  nodes: SurfaceSampleGraphNode[],
  edges: Array<{ sampleIds: [string, string] }>,
): number {
  if (!nodes.length) {
    return 0;
  }

  const neighborsBySampleId = new Map(
    nodes.map((node) => [node.sampleId, [] as string[]]),
  );

  for (const edge of edges) {
    const [firstSampleId, secondSampleId] = edge.sampleIds;

    neighborsBySampleId.get(firstSampleId)?.push(secondSampleId);
    neighborsBySampleId.get(secondSampleId)?.push(firstSampleId);
  }

  const visited = new Set<string>();
  let componentCount = 0;

  for (const node of nodes) {
    if (visited.has(node.sampleId)) {
      continue;
    }

    componentCount += 1;

    const stack = [node.sampleId];

    while (stack.length) {
      const sampleId = stack.pop();

      if (!sampleId || visited.has(sampleId)) {
        continue;
      }

      visited.add(sampleId);

      for (const neighborId of neighborsBySampleId.get(sampleId) ?? []) {
        if (!visited.has(neighborId)) {
          stack.push(neighborId);
        }
      }
    }
  }

  return componentCount;
}

function countIsolatedNodes(
  nodes: SurfaceSampleGraphNode[],
  edges: Array<{ sampleIds: [string, string] }>,
): number {
  const connectedSampleIds = new Set(
    edges.flatMap((edge) => [edge.sampleIds[0], edge.sampleIds[1]]),
  );

  return nodes.filter((node) => !connectedSampleIds.has(node.sampleId)).length;
}

function distanceVec3(first: Vec3, second: Vec3): number {
  const dx = first[0] - second[0];
  const dy = first[1] - second[1];
  const dz = first[2] - second[2];

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
