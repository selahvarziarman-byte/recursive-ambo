import type { FieldChartSemanticRole } from './fieldAtlas';
import {
  buildClosedSurfaceSeamAwareSampleGraph,
  type ClosedSurfaceSeamAwareSampleGraph,
  type ClosedSurfaceSeamAwareSampleGraphEdge,
  type SurfaceSampleGraphNode,
} from './fieldAtlasSampleGraph';
import type {
  SampledClosedShapeSurfaceAtlas,
  SurfaceChartAtlasSample,
} from './fieldAtlasSurfaceSampling';

export type FieldRouteGateCandidateMethod = 'field-route-gate-candidates-v0';
export type FieldRouteGateCandidateScope = 'closed-surface-seam-aware';
export type FieldRouteGateCandidateStatus = 'candidate-only';
export type FieldRouteGateCandidateSemanticStatus = 'not-semantic-naming';
export type FieldRouteGateCandidateTopologyStatus = 'not-topology-workspace';
export type FieldRouteGateCandidatePhaseContinuityStatus =
  'not-global-phase-continuity';
export type FieldRouteGateCandidateKind =
  | 'gate-candidate'
  | 'route-candidate'
  | 'blocked-or-failed-route-candidate';
export type FieldRouteGateCandidateReliability = 'bounded-diagnostic' | 'low-confidence';

export interface FieldRouteGateCandidateOptions {
  maxGateCandidates?: number;
  maxRouteCandidates?: number;
  maxBlockedRouteCandidates?: number;
  gateRelativeIntensityMax?: number;
  gateMinEffectiveSourceCount?: number;
  routeEndpointRelativeIntensityMin?: number;
  maxRoutePathEdges?: number;
}

export interface ResolvedFieldRouteGateCandidateOptions {
  maxGateCandidates: number;
  maxRouteCandidates: number;
  maxBlockedRouteCandidates: number;
  gateRelativeIntensityMax: number;
  gateMinEffectiveSourceCount: number;
  routeEndpointRelativeIntensityMin: number;
  maxRoutePathEdges: number;
}

export interface FieldRouteGateIntensitySummary {
  min: number;
  max: number;
  average: number;
}

export interface FieldRouteGateContributionMixtureSummary {
  averageEffectiveSourceCount: number;
  maxTopContributionRatio: number;
  mixedSampleCount: number;
}

export interface FieldRouteGateCandidate {
  candidateId: string;
  candidateKind: FieldRouteGateCandidateKind;
  status: FieldRouteGateCandidateStatus;
  semanticStatus: FieldRouteGateCandidateSemanticStatus;
  topologyStatus: FieldRouteGateCandidateTopologyStatus;
  phaseContinuityStatus: FieldRouteGateCandidatePhaseContinuityStatus;
  sourcePolicyNames: string[];
  sampleIds: string[];
  chartIds: string[];
  chartSemanticRoles: FieldChartSemanticRole[];
  edgeIds: string[];
  seamEdgesInvolved: boolean;
  pathLength?: number;
  intensitySummary: FieldRouteGateIntensitySummary;
  contributionMixtureSummary: FieldRouteGateContributionMixtureSummary;
  reliability: FieldRouteGateCandidateReliability;
  reason: string;
}

export interface FieldRouteGateCandidateSummary {
  totalCandidateCount: number;
  gateCandidateCount: number;
  routeCandidateCount: number;
  blockedRouteCandidateCount: number;
}

export interface FieldRouteGateCandidateGraphSummary {
  graphKind: ClosedSurfaceSeamAwareSampleGraph['kind'];
  strategy: ClosedSurfaceSeamAwareSampleGraph['strategy'];
  scope: ClosedSurfaceSeamAwareSampleGraph['scope'];
  semanticStatus: ClosedSurfaceSeamAwareSampleGraph['semanticStatus'];
  topologyStatus: ClosedSurfaceSeamAwareSampleGraph['topologyStatus'];
  routeGateStatus: ClosedSurfaceSeamAwareSampleGraph['routeGateStatus'];
  phaseContinuityStatus: ClosedSurfaceSeamAwareSampleGraph['phaseContinuityStatus'];
  nodeCount: number;
  chartLocalEdgeCount: number;
  seamEdgeCount: number;
  totalEdgeCount: number;
  connectedComponentCount: number;
  isolatedNodeCount: number;
}

export interface FieldRouteGateCandidateReport {
  reportId: string;
  method: FieldRouteGateCandidateMethod;
  scope: FieldRouteGateCandidateScope;
  status: FieldRouteGateCandidateStatus;
  semanticStatus: FieldRouteGateCandidateSemanticStatus;
  topologyStatus: FieldRouteGateCandidateTopologyStatus;
  phaseContinuityStatus: FieldRouteGateCandidatePhaseContinuityStatus;
  sourcePolicyNames: string[];
  graphSummary: FieldRouteGateCandidateGraphSummary;
  candidateSummary: FieldRouteGateCandidateSummary;
  candidates: FieldRouteGateCandidate[];
  options: ResolvedFieldRouteGateCandidateOptions;
}

interface CandidateBuildContext {
  sourcePolicyNames: string[];
  sampleById: Map<string, SurfaceChartAtlasSample>;
  nodeById: Map<string, SurfaceSampleGraphNode>;
  edgeById: Map<string, ClosedSurfaceSeamAwareSampleGraphEdge>;
  edgesBySampleId: Map<string, ClosedSurfaceSeamAwareSampleGraphEdge[]>;
  neighborsBySampleId: Map<string, GraphNeighbor[]>;
  intensityRange: { min: number; max: number };
}

interface GraphNeighbor {
  sampleId: string;
  edgeId: string;
}

interface BoundedPath {
  sampleIds: string[];
  edgeIds: string[];
}

const METHOD: FieldRouteGateCandidateMethod = 'field-route-gate-candidates-v0';
const SCOPE: FieldRouteGateCandidateScope = 'closed-surface-seam-aware';
const STATUS: FieldRouteGateCandidateStatus = 'candidate-only';
const SEMANTIC_STATUS: FieldRouteGateCandidateSemanticStatus = 'not-semantic-naming';
const TOPOLOGY_STATUS: FieldRouteGateCandidateTopologyStatus = 'not-topology-workspace';
const PHASE_CONTINUITY_STATUS: FieldRouteGateCandidatePhaseContinuityStatus =
  'not-global-phase-continuity';
const DEFAULT_MAX_GATE_CANDIDATES = 8;
const DEFAULT_MAX_ROUTE_CANDIDATES = 4;
const DEFAULT_MAX_BLOCKED_ROUTE_CANDIDATES = 8;
const DEFAULT_GATE_RELATIVE_INTENSITY_MAX = 0.35;
const DEFAULT_GATE_MIN_EFFECTIVE_SOURCE_COUNT = 1.5;
const DEFAULT_ROUTE_ENDPOINT_RELATIVE_INTENSITY_MIN = 0.75;
const DEFAULT_MAX_ROUTE_PATH_EDGES = 6;

export function buildFieldRouteGateCandidateReport(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
  options: FieldRouteGateCandidateOptions = {},
): FieldRouteGateCandidateReport {
  const resolvedOptions = resolveFieldRouteGateCandidateOptions(options);
  const seamAwareGraph = buildClosedSurfaceSeamAwareSampleGraph(sampledAtlas);
  const context = buildCandidateContext(sampledAtlas, seamAwareGraph);
  const gateCandidates = buildGateCandidates(seamAwareGraph, context, resolvedOptions);
  const routeCandidates = buildRouteCandidates(seamAwareGraph, context, resolvedOptions);
  const blockedCandidates = buildBlockedRouteCandidates(
    seamAwareGraph,
    context,
    resolvedOptions,
  );
  const candidates = [...gateCandidates, ...routeCandidates, ...blockedCandidates];

  return {
    reportId: `field-route-gate-candidates-v0:${sampledAtlas.domain.id}`,
    method: METHOD,
    scope: SCOPE,
    status: STATUS,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    phaseContinuityStatus: PHASE_CONTINUITY_STATUS,
    sourcePolicyNames: context.sourcePolicyNames,
    graphSummary: buildGraphSummary(seamAwareGraph),
    candidateSummary: buildCandidateSummary(candidates),
    candidates,
    options: resolvedOptions,
  };
}

function buildGateCandidates(
  seamAwareGraph: ClosedSurfaceSeamAwareSampleGraph,
  context: CandidateBuildContext,
  options: ResolvedFieldRouteGateCandidateOptions,
): FieldRouteGateCandidate[] {
  return seamAwareGraph.nodes
    .map((node) => {
      const sample = context.sampleById.get(node.sampleId);

      if (!sample) {
        return null;
      }

      const relativeIntensity = relativeIntensityOf(sample, context.intensityRange);
      const mixture = summarizeContributionMixture([sample]);
      const incidentEdges = context.edgesBySampleId.get(node.sampleId) ?? [];
      const seamEdgesInvolved = incidentEdges.some(isSeamAwareEdge);
      const locallyConnective = incidentEdges.length >= 3 || seamEdgesInvolved;

      if (
        relativeIntensity > options.gateRelativeIntensityMax ||
        mixture.averageEffectiveSourceCount < options.gateMinEffectiveSourceCount ||
        !locallyConnective
      ) {
        return null;
      }

      const edgeIds = incidentEdges.map((edge) => edge.edgeId).sort().slice(0, 6);
      const involvedSampleIds = getSampleIdsForEdges(incidentEdges)
        .filter((sampleId, index, sampleIds) => sampleIds.indexOf(sampleId) === index)
        .sort()
        .slice(0, 8);
      const chartIds = getChartIdsForSampleIds(involvedSampleIds, context);
      const chartSemanticRoles = getChartSemanticRolesForSampleIds(involvedSampleIds, context);
      const chartLocalEdgeCount = incidentEdges.filter((edge) => !isSeamAwareEdge(edge)).length;
      const seamEdgeCount = incidentEdges.filter(isSeamAwareEdge).length;

      return {
        candidate: buildCandidate({
          candidateId: `field-route-gate-candidate:v0:gate:${node.sampleId}`,
          candidateKind: 'gate-candidate',
          sampleIds: involvedSampleIds,
          chartIds,
          chartSemanticRoles,
          edgeIds,
          seamEdgesInvolved,
          sourcePolicyNames: context.sourcePolicyNames,
          intensitySummary: summarizeIntensity([sample]),
          contributionMixtureSummary: mixture,
          reliability: seamEdgesInvolved ? 'bounded-diagnostic' : 'low-confidence',
          reason:
            `Low relative intensity ${formatNumber(relativeIntensity)} with mixed source contribution ` +
            `effectiveSourceCount=${formatNumber(mixture.averageEffectiveSourceCount)}. ` +
            `Incident graph support includes ${chartLocalEdgeCount} chart-local edge(s) and ` +
            `${seamEdgeCount} seam edge(s). Candidate-only, not a confirmed gate or semantic site.`,
        }),
        relativeIntensity,
        effectiveSourceCount: mixture.averageEffectiveSourceCount,
        seamEdgesInvolved,
      };
    })
    .filter(
      (
        item,
      ): item is {
        candidate: FieldRouteGateCandidate;
        relativeIntensity: number;
        effectiveSourceCount: number;
        seamEdgesInvolved: boolean;
      } => Boolean(item),
    )
    .sort(
      (first, second) =>
        Number(second.seamEdgesInvolved) - Number(first.seamEdgesInvolved) ||
        first.relativeIntensity - second.relativeIntensity ||
        second.effectiveSourceCount - first.effectiveSourceCount ||
        first.candidate.candidateId.localeCompare(second.candidate.candidateId),
    )
    .slice(0, options.maxGateCandidates)
    .map((item) => item.candidate);
}

function buildRouteCandidates(
  seamAwareGraph: ClosedSurfaceSeamAwareSampleGraph,
  context: CandidateBuildContext,
  options: ResolvedFieldRouteGateCandidateOptions,
): FieldRouteGateCandidate[] {
  const endpoints = getRouteEndpointCandidates(seamAwareGraph, context, options);
  const candidates: FieldRouteGateCandidate[] = [];
  const seenEndpointPairs = new Set<string>();

  for (let firstIndex = 0; firstIndex < endpoints.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < endpoints.length; secondIndex += 1) {
      if (candidates.length >= options.maxRouteCandidates) {
        return candidates;
      }

      const first = endpoints[firstIndex];
      const second = endpoints[secondIndex];
      const pairKey = [first.sampleId, second.sampleId].sort().join('\u001f');

      if (seenEndpointPairs.has(pairKey)) {
        continue;
      }

      seenEndpointPairs.add(pairKey);

      const path = findBoundedPath(
        first.sampleId,
        second.sampleId,
        context.neighborsBySampleId,
        options.maxRoutePathEdges,
      );

      if (!path || path.edgeIds.length === 0) {
        continue;
      }

      const pathSamples = getSamplesForIds(path.sampleIds, context);

      if (!pathSamples.length || pathSamples.some((sample) => !Number.isFinite(sample.intensity))) {
        continue;
      }

      const pathEdges = getEdgesForIds(path.edgeIds, context);
      const seamEdgesInvolved = pathEdges.some(isSeamAwareEdge);

      candidates.push(
        buildCandidate({
          candidateId: `field-route-gate-candidate:v0:route:${candidates.length}:${path.sampleIds[0]}:${path.sampleIds[path.sampleIds.length - 1]}`,
          candidateKind: 'route-candidate',
          sampleIds: path.sampleIds,
          chartIds: getChartIdsForSampleIds(path.sampleIds, context),
          chartSemanticRoles: getChartSemanticRolesForSampleIds(path.sampleIds, context),
          edgeIds: path.edgeIds,
          seamEdgesInvolved,
          sourcePolicyNames: context.sourcePolicyNames,
          pathLength: path.edgeIds.length,
          intensitySummary: summarizeIntensity(pathSamples),
          contributionMixtureSummary: summarizeContributionMixture(pathSamples),
          reliability: seamEdgesInvolved ? 'bounded-diagnostic' : 'low-confidence',
          reason:
            `Short bounded path of ${path.edgeIds.length} edge(s) between high-intensity samples ` +
            `over the seam-aware graph. Path includes ${countSeamEdges(pathEdges)} seam edge(s) ` +
            `and ${pathEdges.length - countSeamEdges(pathEdges)} chart-local edge(s). ` +
            'Candidate-only, not a confirmed route, support region, or semantic site.',
        }),
      );
    }
  }

  return candidates;
}

function buildBlockedRouteCandidates(
  seamAwareGraph: ClosedSurfaceSeamAwareSampleGraph,
  context: CandidateBuildContext,
  options: ResolvedFieldRouteGateCandidateOptions,
): FieldRouteGateCandidate[] {
  const candidates: FieldRouteGateCandidate[] = [];

  for (const seamReason of seamAwareGraph.seamReasons) {
    if (candidates.length >= options.maxBlockedRouteCandidates) {
      return candidates;
    }

    candidates.push(
      buildCandidate({
        candidateId: `field-route-gate-candidate:v0:blocked:${seamReason.reasonKind}`,
        candidateKind: 'blocked-or-failed-route-candidate',
        sampleIds: [],
        chartIds: [],
        chartSemanticRoles: [],
        edgeIds: [],
        seamEdgesInvolved: false,
        sourcePolicyNames: context.sourcePolicyNames,
        intensitySummary: summarizeIntensity([]),
        contributionMixtureSummary: summarizeContributionMixture([]),
        reliability: 'low-confidence',
        reason:
          `${seamReason.reason} Blocked-or-failed route candidate only; no route/gate is confirmed.`,
      }),
    );
  }

  const ambiguousEdges = seamAwareGraph.edges
    .filter((edge) => edge.sampleIds.some((sampleId) => isComputationalOnlySample(sampleId, context)))
    .sort((first, second) => {
      const firstIsSeam = isSeamAwareEdge(first);
      const secondIsSeam = isSeamAwareEdge(second);

      return (
        Number(secondIsSeam) - Number(firstIsSeam) ||
        first.edgeId.localeCompare(second.edgeId)
      );
    });

  for (const edge of ambiguousEdges) {
    if (candidates.length >= options.maxBlockedRouteCandidates) {
      return candidates;
    }

    const samples = getSamplesForIds(edge.sampleIds, context);
    const seamEdgesInvolved = isSeamAwareEdge(edge);

    candidates.push(
      buildCandidate({
        candidateId: `field-route-gate-candidate:v0:blocked:${edge.edgeId}`,
        candidateKind: 'blocked-or-failed-route-candidate',
        sampleIds: [...edge.sampleIds],
        chartIds: getChartIdsForSampleIds(edge.sampleIds, context),
        chartSemanticRoles: getChartSemanticRolesForSampleIds(edge.sampleIds, context),
        edgeIds: [edge.edgeId],
        seamEdgesInvolved,
        sourcePolicyNames: context.sourcePolicyNames,
        pathLength: 1,
        intensitySummary: summarizeIntensity(samples),
        contributionMixtureSummary: summarizeContributionMixture(samples),
        reliability: 'low-confidence',
        reason:
          `Candidate relation crosses computational-only chart support through a ${
            seamEdgesInvolved ? 'seam' : 'chart-local'
          } edge. This preserves ambiguity as blocked-or-failed-route-candidate only, ` +
          'not a confirmed route/gate or topology claim.',
      }),
    );
  }

  return candidates;
}

function getRouteEndpointCandidates(
  seamAwareGraph: ClosedSurfaceSeamAwareSampleGraph,
  context: CandidateBuildContext,
  options: ResolvedFieldRouteGateCandidateOptions,
): SurfaceSampleGraphNode[] {
  const finiteNodes = seamAwareGraph.nodes.filter((node) => {
    const sample = context.sampleById.get(node.sampleId);

    return Boolean(sample && Number.isFinite(sample.intensity));
  });
  const highIntensityNodes = finiteNodes.filter((node) => {
    const sample = context.sampleById.get(node.sampleId);

    return (
      sample &&
      relativeIntensityOf(sample, context.intensityRange) >=
        options.routeEndpointRelativeIntensityMin
    );
  });
  return highIntensityNodes
    .sort((first, second) => {
      const firstSample = context.sampleById.get(first.sampleId);
      const secondSample = context.sampleById.get(second.sampleId);

      return (
        (secondSample?.intensity ?? 0) - (firstSample?.intensity ?? 0) ||
        first.sampleId.localeCompare(second.sampleId)
      );
    })
    .slice(0, 8);
}

function findBoundedPath(
  startSampleId: string,
  targetSampleId: string,
  neighborsBySampleId: Map<string, GraphNeighbor[]>,
  maxEdges: number,
): BoundedPath | null {
  const queue: BoundedPath[] = [{ sampleIds: [startSampleId], edgeIds: [] }];

  while (queue.length) {
    const path = queue.shift();

    if (!path) {
      continue;
    }

    const currentSampleId = path.sampleIds[path.sampleIds.length - 1];

    if (currentSampleId === targetSampleId) {
      return path;
    }

    if (path.edgeIds.length >= maxEdges) {
      continue;
    }

    for (const neighbor of neighborsBySampleId.get(currentSampleId) ?? []) {
      if (path.sampleIds.includes(neighbor.sampleId)) {
        continue;
      }

      queue.push({
        sampleIds: [...path.sampleIds, neighbor.sampleId],
        edgeIds: [...path.edgeIds, neighbor.edgeId],
      });
    }
  }

  return null;
}

function buildCandidateContext(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
  seamAwareGraph: ClosedSurfaceSeamAwareSampleGraph,
): CandidateBuildContext {
  const sampleById = new Map(sampledAtlas.samples.map((sample) => [sample.id, sample]));
  const nodeById = new Map(seamAwareGraph.nodes.map((node) => [node.sampleId, node]));
  const edgeById = new Map(seamAwareGraph.edges.map((edge) => [edge.edgeId, edge]));
  const edgesBySampleId = buildEdgesBySampleId(seamAwareGraph.edges);

  return {
    sourcePolicyNames: getSourcePolicyNames(sampledAtlas),
    sampleById,
    nodeById,
    edgeById,
    edgesBySampleId,
    neighborsBySampleId: buildNeighborsBySampleId(seamAwareGraph.edges),
    intensityRange: getIntensityRange(sampledAtlas.samples),
  };
}

function buildEdgesBySampleId(
  edges: ClosedSurfaceSeamAwareSampleGraphEdge[],
): Map<string, ClosedSurfaceSeamAwareSampleGraphEdge[]> {
  const edgesBySampleId = new Map<string, ClosedSurfaceSeamAwareSampleGraphEdge[]>();

  for (const edge of edges) {
    for (const sampleId of edge.sampleIds) {
      const sampleEdges = edgesBySampleId.get(sampleId) ?? [];

      sampleEdges.push(edge);
      edgesBySampleId.set(sampleId, sampleEdges);
    }
  }

  return edgesBySampleId;
}

function buildNeighborsBySampleId(
  edges: ClosedSurfaceSeamAwareSampleGraphEdge[],
): Map<string, GraphNeighbor[]> {
  const neighborsBySampleId = new Map<string, GraphNeighbor[]>();

  for (const edge of edges) {
    const [firstSampleId, secondSampleId] = edge.sampleIds;

    appendNeighbor(neighborsBySampleId, firstSampleId, {
      sampleId: secondSampleId,
      edgeId: edge.edgeId,
    });
    appendNeighbor(neighborsBySampleId, secondSampleId, {
      sampleId: firstSampleId,
      edgeId: edge.edgeId,
    });
  }

  for (const neighbors of neighborsBySampleId.values()) {
    neighbors.sort(
      (first, second) =>
        first.sampleId.localeCompare(second.sampleId) ||
        first.edgeId.localeCompare(second.edgeId),
    );
  }

  return neighborsBySampleId;
}

function appendNeighbor(
  neighborsBySampleId: Map<string, GraphNeighbor[]>,
  sampleId: string,
  neighbor: GraphNeighbor,
): void {
  const neighbors = neighborsBySampleId.get(sampleId) ?? [];

  neighbors.push(neighbor);
  neighborsBySampleId.set(sampleId, neighbors);
}

function buildCandidate(
  candidate: Omit<
    FieldRouteGateCandidate,
    'status' | 'semanticStatus' | 'topologyStatus' | 'phaseContinuityStatus' | 'sourcePolicyNames'
  > & {
    sourcePolicyNames?: string[];
  },
): FieldRouteGateCandidate {
  return {
    ...candidate,
    status: STATUS,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    phaseContinuityStatus: PHASE_CONTINUITY_STATUS,
    sourcePolicyNames: candidate.sourcePolicyNames ?? [],
  };
}

function buildGraphSummary(
  seamAwareGraph: ClosedSurfaceSeamAwareSampleGraph,
): FieldRouteGateCandidateGraphSummary {
  return {
    graphKind: seamAwareGraph.kind,
    strategy: seamAwareGraph.strategy,
    scope: seamAwareGraph.scope,
    semanticStatus: seamAwareGraph.semanticStatus,
    topologyStatus: seamAwareGraph.topologyStatus,
    routeGateStatus: seamAwareGraph.routeGateStatus,
    phaseContinuityStatus: seamAwareGraph.phaseContinuityStatus,
    nodeCount: seamAwareGraph.summary.nodeCount,
    chartLocalEdgeCount: seamAwareGraph.summary.chartLocalEdgeCount,
    seamEdgeCount: seamAwareGraph.summary.seamEdgeCount,
    totalEdgeCount: seamAwareGraph.summary.totalEdgeCount,
    connectedComponentCount: seamAwareGraph.summary.connectedComponentCount,
    isolatedNodeCount: seamAwareGraph.summary.isolatedNodeCount,
  };
}

function buildCandidateSummary(
  candidates: FieldRouteGateCandidate[],
): FieldRouteGateCandidateSummary {
  return {
    totalCandidateCount: candidates.length,
    gateCandidateCount: candidates.filter(
      (candidate) => candidate.candidateKind === 'gate-candidate',
    ).length,
    routeCandidateCount: candidates.filter(
      (candidate) => candidate.candidateKind === 'route-candidate',
    ).length,
    blockedRouteCandidateCount: candidates.filter(
      (candidate) => candidate.candidateKind === 'blocked-or-failed-route-candidate',
    ).length,
  };
}

function summarizeIntensity(samples: SurfaceChartAtlasSample[]): FieldRouteGateIntensitySummary {
  const finiteValues = samples.map((sample) => sample.intensity).filter(Number.isFinite);

  if (!finiteValues.length) {
    return { min: 0, max: 0, average: 0 };
  }

  return {
    min: Math.min(...finiteValues),
    max: Math.max(...finiteValues),
    average: finiteValues.reduce((sum, value) => sum + value, 0) / finiteValues.length,
  };
}

function summarizeContributionMixture(
  samples: SurfaceChartAtlasSample[],
): FieldRouteGateContributionMixtureSummary {
  if (!samples.length) {
    return {
      averageEffectiveSourceCount: 0,
      maxTopContributionRatio: 0,
      mixedSampleCount: 0,
    };
  }

  const effectiveSourceCounts = samples.map(getEffectiveSourceCount);
  const topContributionRatios = samples.map(getTopContributionRatio);

  return {
    averageEffectiveSourceCount:
      effectiveSourceCounts.reduce((sum, value) => sum + value, 0) / samples.length,
    maxTopContributionRatio: Math.max(...topContributionRatios),
    mixedSampleCount: samples.filter(
      (sample) => getEffectiveSourceCount(sample) >= 1.5 && getTopContributionRatio(sample) <= 0.85,
    ).length,
  };
}

function getEffectiveSourceCount(sample: SurfaceChartAtlasSample): number {
  const ratioSquares = sample.contributionRatios.reduce(
    (sum, ratio) => sum + ratio.value * ratio.value,
    0,
  );

  return ratioSquares > 0 ? 1 / ratioSquares : 0;
}

function getTopContributionRatio(sample: SurfaceChartAtlasSample): number {
  return sample.contributionRatios.reduce(
    (maximum, ratio) => Math.max(maximum, ratio.value),
    0,
  );
}

function getSamplesForIds(
  sampleIds: readonly string[],
  context: CandidateBuildContext,
): SurfaceChartAtlasSample[] {
  return sampleIds
    .map((sampleId) => context.sampleById.get(sampleId))
    .filter((sample): sample is SurfaceChartAtlasSample => Boolean(sample));
}

function getEdgesForIds(
  edgeIds: readonly string[],
  context: CandidateBuildContext,
): ClosedSurfaceSeamAwareSampleGraphEdge[] {
  return edgeIds
    .map((edgeId) => context.edgeById.get(edgeId))
    .filter((edge): edge is ClosedSurfaceSeamAwareSampleGraphEdge => Boolean(edge));
}

function getSampleIdsForEdges(edges: ClosedSurfaceSeamAwareSampleGraphEdge[]): string[] {
  return edges.flatMap((edge) => [edge.sampleIds[0], edge.sampleIds[1]]);
}

function getChartIdsForSampleIds(
  sampleIds: readonly string[],
  context: CandidateBuildContext,
): string[] {
  return Array.from(
    new Set(
      sampleIds
        .map((sampleId) => context.nodeById.get(sampleId)?.chartId)
        .filter((chartId): chartId is string => Boolean(chartId)),
    ),
  ).sort();
}

function getChartSemanticRolesForSampleIds(
  sampleIds: readonly string[],
  context: CandidateBuildContext,
): FieldChartSemanticRole[] {
  return Array.from(
    new Set(
      sampleIds
        .map((sampleId) => context.nodeById.get(sampleId)?.chartSemanticRole)
        .filter((role): role is FieldChartSemanticRole => Boolean(role)),
    ),
  ).sort();
}

function isComputationalOnlySample(sampleId: string, context: CandidateBuildContext): boolean {
  return context.nodeById.get(sampleId)?.chartSemanticRole === 'computational-only';
}

function relativeIntensityOf(
  sample: SurfaceChartAtlasSample,
  range: { min: number; max: number },
): number {
  const span = range.max - range.min;

  if (!Number.isFinite(sample.intensity) || span <= 1e-12) {
    return 0.5;
  }

  return Math.min(1, Math.max(0, (sample.intensity - range.min) / span));
}

function getIntensityRange(samples: SurfaceChartAtlasSample[]): { min: number; max: number } {
  const finiteValues = samples.map((sample) => sample.intensity).filter(Number.isFinite);

  if (!finiteValues.length) {
    return { min: 0, max: 0 };
  }

  return finiteValues.reduce(
    (range, value) => ({
      min: Math.min(range.min, value),
      max: Math.max(range.max, value),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  );
}

function getSourcePolicyNames(sampledAtlas: SampledClosedShapeSurfaceAtlas): string[] {
  return Array.from(
    new Set(
      sampledAtlas.sources
        .map((source) => source.policyName.trim())
        .filter((policyName) => policyName.length > 0),
    ),
  ).sort();
}

function isSeamAwareEdge(edge: ClosedSurfaceSeamAwareSampleGraphEdge): boolean {
  return edge.edgeKind === 'closed-surface-seam-neighbor';
}

function countSeamEdges(edges: ClosedSurfaceSeamAwareSampleGraphEdge[]): number {
  return edges.filter(isSeamAwareEdge).length;
}

function resolveFieldRouteGateCandidateOptions(
  options: FieldRouteGateCandidateOptions,
): ResolvedFieldRouteGateCandidateOptions {
  return {
    maxGateCandidates: finiteBoundedCount(
      options.maxGateCandidates,
      DEFAULT_MAX_GATE_CANDIDATES,
    ),
    maxRouteCandidates: finiteBoundedCount(
      options.maxRouteCandidates,
      DEFAULT_MAX_ROUTE_CANDIDATES,
    ),
    maxBlockedRouteCandidates: finiteBoundedCount(
      options.maxBlockedRouteCandidates,
      DEFAULT_MAX_BLOCKED_ROUTE_CANDIDATES,
    ),
    gateRelativeIntensityMax: clamp(
      finiteNonnegative(
        options.gateRelativeIntensityMax,
        DEFAULT_GATE_RELATIVE_INTENSITY_MAX,
      ),
      0,
      1,
    ),
    gateMinEffectiveSourceCount: finiteNonnegative(
      options.gateMinEffectiveSourceCount,
      DEFAULT_GATE_MIN_EFFECTIVE_SOURCE_COUNT,
    ),
    routeEndpointRelativeIntensityMin: clamp(
      finiteNonnegative(
        options.routeEndpointRelativeIntensityMin,
        DEFAULT_ROUTE_ENDPOINT_RELATIVE_INTENSITY_MIN,
      ),
      0,
      1,
    ),
    maxRoutePathEdges: Math.max(
      1,
      finiteBoundedCount(options.maxRoutePathEdges, DEFAULT_MAX_ROUTE_PATH_EDGES),
    ),
  };
}

function finiteBoundedCount(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.floor(value));
}

function finiteNonnegative(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function formatNumber(value: number): string {
  return Number.isFinite(value) ? value.toExponential(3) : String(value);
}
