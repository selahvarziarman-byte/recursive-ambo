import {
  buildFieldFeatureReportFromAtlas,
  type FieldFeatureObservationKind,
  type FieldFeatureReportObservation,
} from './fieldAtlasFeatureReport';
import {
  buildClosedSurfaceSeamAwareSampleGraph,
  type ClosedSurfaceSeamAwareSampleGraph,
  type ClosedSurfaceSeamAwareSampleGraphEdge,
} from './fieldAtlasSampleGraph';
import {
  buildFieldRouteGateCandidateReport,
  type FieldRouteGateCandidate,
} from './fieldAtlasRouteGateCandidates';
import type {
  SampledClosedShapeSurfaceAtlas,
  SurfaceChartAtlasSample,
} from './fieldAtlasSurfaceSampling';

export type FieldSupportRegionCandidateMethod =
  'field-support-region-candidates-v0';
export type FieldSupportRegionCandidateScope = 'closed-surface-seam-aware';
export type FieldSupportRegionCandidateStatus = 'candidate-only';
export type FieldSupportRegionCandidateSemanticStatus = 'not-semantic-naming';
export type FieldSupportRegionCandidateTopologyStatus =
  'not-topology-workspace';
export type FieldSupportRegionCandidatePhaseContinuityStatus =
  'not-global-phase-continuity';
export type FieldSupportRegionCandidateKind =
  | 'support-class-candidate'
  | 'region-candidate'
  | 'constraint-site-candidate'
  | 'route-failure-region-candidate';
export type FieldSupportRegionSupportKind =
  | 'cancellation-support'
  | 'high-intensity-anchor-support'
  | 'mixed-contribution-support'
  | 'ambiguous-computational-support'
  | 'gate-adjacent-constraint'
  | 'route-path-constraint'
  | 'route-failure-ambiguity'
  | 'seam-supported-cluster'
  | 'chart-local-cluster';
export type FieldSupportRegionCandidateReliability =
  | 'bounded-diagnostic'
  | 'low-confidence';

export interface FieldSupportRegionCandidateOptions {
  maxSupportClassCandidates?: number;
  maxRegionCandidates?: number;
  maxConstraintSiteCandidates?: number;
  maxRouteFailureRegionCandidates?: number;
  regionGraphRadius?: number;
  maxRegionSamples?: number;
}

export interface ResolvedFieldSupportRegionCandidateOptions {
  maxSupportClassCandidates: number;
  maxRegionCandidates: number;
  maxConstraintSiteCandidates: number;
  maxRouteFailureRegionCandidates: number;
  regionGraphRadius: number;
  maxRegionSamples: number;
}

export interface FieldSupportRegionEvidenceSummary {
  sampleCount: number;
  chartCount: number;
  seamEdgeCount: number;
  chartLocalEdgeCount: number;
  averageIntensity: number;
  minIntensity: number;
  maxIntensity: number;
  averageEffectiveSourceCount: number;
  maxTopContributionRatio: number;
  fieldFeatureObservationCount: number;
  routeGateCandidateCount: number;
  computationalOnlySampleCount: number;
}

export interface FieldSupportRegionCandidate {
  candidateId: string;
  candidateKind: FieldSupportRegionCandidateKind;
  supportKind: FieldSupportRegionSupportKind;
  status: FieldSupportRegionCandidateStatus;
  semanticStatus: FieldSupportRegionCandidateSemanticStatus;
  topologyStatus: FieldSupportRegionCandidateTopologyStatus;
  phaseContinuityStatus: FieldSupportRegionCandidatePhaseContinuityStatus;
  sourcePolicyNames: string[];
  sampleIds: string[];
  chartIds: string[];
  edgeIds: string[];
  observationIds: string[];
  routeGateCandidateIds: string[];
  seamEdgesInvolved: boolean;
  computationalOnlyInvolved: boolean;
  evidenceSummary: FieldSupportRegionEvidenceSummary;
  reason: string;
  reliability: FieldSupportRegionCandidateReliability;
}

export interface FieldSupportRegionCandidateSummary {
  totalCandidateCount: number;
  supportClassCandidateCount: number;
  regionCandidateCount: number;
  constraintSiteCandidateCount: number;
  routeFailureRegionCandidateCount: number;
}

export interface FieldSupportRegionCandidateGraphSummary {
  graphKind: ClosedSurfaceSeamAwareSampleGraph['kind'];
  scope: ClosedSurfaceSeamAwareSampleGraph['scope'];
  semanticStatus: ClosedSurfaceSeamAwareSampleGraph['semanticStatus'];
  topologyStatus: ClosedSurfaceSeamAwareSampleGraph['topologyStatus'];
  phaseContinuityStatus: ClosedSurfaceSeamAwareSampleGraph['phaseContinuityStatus'];
  nodeCount: number;
  chartLocalEdgeCount: number;
  seamEdgeCount: number;
  totalEdgeCount: number;
}

export interface FieldSupportRegionCandidateReport {
  reportId: string;
  method: FieldSupportRegionCandidateMethod;
  scope: FieldSupportRegionCandidateScope;
  status: FieldSupportRegionCandidateStatus;
  semanticStatus: FieldSupportRegionCandidateSemanticStatus;
  topologyStatus: FieldSupportRegionCandidateTopologyStatus;
  phaseContinuityStatus: FieldSupportRegionCandidatePhaseContinuityStatus;
  sourcePolicyNames: string[];
  graphSummary: FieldSupportRegionCandidateGraphSummary;
  candidateSummary: FieldSupportRegionCandidateSummary;
  candidates: FieldSupportRegionCandidate[];
  options: ResolvedFieldSupportRegionCandidateOptions;
}

interface CandidateBuildContext {
  sourcePolicyNames: string[];
  sampleById: Map<string, SurfaceChartAtlasSample>;
  edgesBySampleId: Map<string, ClosedSurfaceSeamAwareSampleGraphEdge[]>;
  edgeById: Map<string, ClosedSurfaceSeamAwareSampleGraphEdge>;
  neighborsBySampleId: Map<string, GraphNeighbor[]>;
}

interface GraphNeighbor {
  sampleId: string;
  edgeId: string;
}

interface CandidateInput {
  candidateId: string;
  candidateKind: FieldSupportRegionCandidateKind;
  supportKind: FieldSupportRegionSupportKind;
  sampleIds: string[];
  edgeIds: string[];
  observationIds?: string[];
  routeGateCandidateIds?: string[];
  reason: string;
  reliability: FieldSupportRegionCandidateReliability;
}

interface RegionCluster {
  sampleIds: string[];
  edgeIds: string[];
}

const METHOD: FieldSupportRegionCandidateMethod =
  'field-support-region-candidates-v0';
const SCOPE: FieldSupportRegionCandidateScope = 'closed-surface-seam-aware';
const STATUS: FieldSupportRegionCandidateStatus = 'candidate-only';
const SEMANTIC_STATUS: FieldSupportRegionCandidateSemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: FieldSupportRegionCandidateTopologyStatus =
  'not-topology-workspace';
const PHASE_CONTINUITY_STATUS: FieldSupportRegionCandidatePhaseContinuityStatus =
  'not-global-phase-continuity';
const DEFAULT_MAX_SUPPORT_CLASS_CANDIDATES = 8;
const DEFAULT_MAX_REGION_CANDIDATES = 6;
const DEFAULT_MAX_CONSTRAINT_SITE_CANDIDATES = 8;
const DEFAULT_MAX_ROUTE_FAILURE_REGION_CANDIDATES = 6;
const DEFAULT_REGION_GRAPH_RADIUS = 1;
const DEFAULT_MAX_REGION_SAMPLES = 8;

export function buildFieldSupportRegionCandidateReport(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
  options: FieldSupportRegionCandidateOptions = {},
): FieldSupportRegionCandidateReport {
  const resolvedOptions = resolveFieldSupportRegionCandidateOptions(options);
  const featureReport = buildFieldFeatureReportFromAtlas(sampledAtlas);
  const routeGateReport = buildFieldRouteGateCandidateReport(sampledAtlas);
  const seamAwareGraph = buildClosedSurfaceSeamAwareSampleGraph(sampledAtlas);
  const context = buildCandidateContext(sampledAtlas, seamAwareGraph);
  const supportClassCandidates = buildSupportClassCandidates(
    featureReport.observations,
    context,
    resolvedOptions,
  );
  const constraintSiteCandidates = buildConstraintSiteCandidates(
    routeGateReport.candidates,
    context,
    resolvedOptions,
  );
  const routeFailureRegionCandidates = buildRouteFailureRegionCandidates(
    routeGateReport.candidates,
    context,
    resolvedOptions,
  );
  const regionCandidates = buildRegionCandidates(
    [...supportClassCandidates, ...constraintSiteCandidates, ...routeFailureRegionCandidates],
    context,
    resolvedOptions,
  );
  const candidates = [
    ...supportClassCandidates,
    ...regionCandidates,
    ...constraintSiteCandidates,
    ...routeFailureRegionCandidates,
  ];

  return {
    reportId: `field-support-region-candidates-v0:${sampledAtlas.domain.id}`,
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

function buildSupportClassCandidates(
  observations: FieldFeatureReportObservation[],
  context: CandidateBuildContext,
  options: ResolvedFieldSupportRegionCandidateOptions,
): FieldSupportRegionCandidate[] {
  return groupObservationsByKind(observations)
    .slice(0, options.maxSupportClassCandidates)
    .map(({ observationKind, observations: groupedObservations }) => {
      const sampleIds = uniqueSorted(
        groupedObservations.map((observation) => observation.sampleId),
      );
      const edgeIds = getIncidentEdgeIds(sampleIds, context);
      const supportKind = getSupportKindForObservationGroup(
        observationKind,
        groupedObservations,
      );

      return buildCandidate(
        {
          candidateId: `field-support-region-candidate:v0:support:${observationKind}`,
          candidateKind: 'support-class-candidate',
          supportKind,
          sampleIds,
          edgeIds,
          observationIds: groupedObservations.map((observation) => observation.observationId),
          reason:
            `Support-class candidate grouped from field feature report observations of kind ${observationKind}. ` +
            'This is candidate-only field-report classification, not semantic naming and not a topology claim.',
          reliability: sampleIds.length ? 'bounded-diagnostic' : 'low-confidence',
        },
        context,
      );
    });
}

function buildConstraintSiteCandidates(
  routeGateCandidates: FieldRouteGateCandidate[],
  context: CandidateBuildContext,
  options: ResolvedFieldSupportRegionCandidateOptions,
): FieldSupportRegionCandidate[] {
  return routeGateCandidates
    .filter(
      (candidate) =>
        candidate.candidateKind === 'gate-candidate' ||
        candidate.candidateKind === 'route-candidate',
    )
    .sort((first, second) => first.candidateId.localeCompare(second.candidateId))
    .slice(0, options.maxConstraintSiteCandidates)
    .map((routeGateCandidate) =>
      buildCandidate(
        {
          candidateId: `field-support-region-candidate:v0:constraint:${routeGateCandidate.candidateId}`,
          candidateKind: 'constraint-site-candidate',
          supportKind:
            routeGateCandidate.candidateKind === 'gate-candidate'
              ? 'gate-adjacent-constraint'
              : 'route-path-constraint',
          sampleIds: uniqueSorted(routeGateCandidate.sampleIds),
          edgeIds: uniqueSorted(routeGateCandidate.edgeIds),
          routeGateCandidateIds: [routeGateCandidate.candidateId],
          reason:
            `Constraint-site candidate derived from ${routeGateCandidate.candidateKind} diagnostic substrate. ` +
            'This is a field constraint candidate only, not semantic naming, not topology workspace behavior, and not a route/gate upgrade.',
          reliability: routeGateCandidate.reliability,
        },
        context,
      ),
    );
}

function buildRouteFailureRegionCandidates(
  routeGateCandidates: FieldRouteGateCandidate[],
  context: CandidateBuildContext,
  options: ResolvedFieldSupportRegionCandidateOptions,
): FieldSupportRegionCandidate[] {
  return routeGateCandidates
    .filter((candidate) => candidate.candidateKind === 'blocked-or-failed-route-candidate')
    .sort((first, second) => {
      const firstComputational = Number(
        first.candidateSubtype === 'computational-support-ambiguity',
      );
      const secondComputational = Number(
        second.candidateSubtype === 'computational-support-ambiguity',
      );

      return (
        secondComputational - firstComputational ||
        first.candidateId.localeCompare(second.candidateId)
      );
    })
    .slice(0, options.maxRouteFailureRegionCandidates)
    .map((routeGateCandidate) =>
      buildCandidate(
        {
          candidateId: `field-support-region-candidate:v0:route-failure:${routeGateCandidate.candidateId}`,
          candidateKind: 'route-failure-region-candidate',
          supportKind: 'route-failure-ambiguity',
          sampleIds: uniqueSorted(routeGateCandidate.sampleIds),
          edgeIds: uniqueSorted(routeGateCandidate.edgeIds),
          routeGateCandidateIds: [routeGateCandidate.candidateId],
          reason:
            'Route-failure region candidate groups blocked or ambiguous route diagnostics around sampled field evidence. ' +
            'This is candidate-only diagnostic grouping, not a proved obstruction and not a topological region.',
          reliability: 'low-confidence',
        },
        context,
      ),
    );
}

function buildRegionCandidates(
  sourceCandidates: FieldSupportRegionCandidate[],
  context: CandidateBuildContext,
  options: ResolvedFieldSupportRegionCandidateOptions,
): FieldSupportRegionCandidate[] {
  const candidates: FieldSupportRegionCandidate[] = [];
  const usedSeedSampleIds = new Set<string>();

  for (const sourceCandidate of sourceCandidates) {
    if (candidates.length >= options.maxRegionCandidates) {
      return candidates;
    }

    const seedSampleId = sourceCandidate.sampleIds.find((sampleId) =>
      context.sampleById.has(sampleId),
    );

    if (!seedSampleId || usedSeedSampleIds.has(seedSampleId)) {
      continue;
    }

    usedSeedSampleIds.add(seedSampleId);

    const cluster = buildBoundedRegionCluster(
      seedSampleId,
      context,
      options.regionGraphRadius,
      options.maxRegionSamples,
    );
    const clusterEdges = getEdgesForIds(cluster.edgeIds, context);
    const supportKind = clusterEdges.some(isSeamAwareEdge)
      ? 'seam-supported-cluster'
      : 'chart-local-cluster';

    candidates.push(
      buildCandidate(
        {
          candidateId: `field-support-region-candidate:v0:region:${candidates.length}:${seedSampleId}`,
          candidateKind: 'region-candidate',
          supportKind,
          sampleIds: cluster.sampleIds,
          edgeIds: cluster.edgeIds,
          observationIds: sourceCandidate.observationIds,
          routeGateCandidateIds: sourceCandidate.routeGateCandidateIds,
          reason:
            `Region candidate is a bounded graph/sample cluster candidate around ${sourceCandidate.candidateKind} evidence. ` +
            `The cluster uses radius=${options.regionGraphRadius} over the seam-aware sample graph. ` +
            'It remains candidate-only, not a topological region, not semantic naming, and not global surface continuity.',
          reliability:
            cluster.sampleIds.length > 1 && clusterEdges.some(isSeamAwareEdge)
              ? 'bounded-diagnostic'
              : 'low-confidence',
        },
        context,
      ),
    );
  }

  return candidates;
}

function buildBoundedRegionCluster(
  seedSampleId: string,
  context: CandidateBuildContext,
  maxDistance: number,
  maxSamples: number,
): RegionCluster {
  const visited = new Set<string>([seedSampleId]);
  const queue = [{ sampleId: seedSampleId, distance: 0 }];

  while (queue.length && visited.size < maxSamples) {
    const current = queue.shift();

    if (!current || current.distance >= maxDistance) {
      continue;
    }

    for (const neighbor of context.neighborsBySampleId.get(current.sampleId) ?? []) {
      if (visited.has(neighbor.sampleId)) {
        continue;
      }

      visited.add(neighbor.sampleId);
      queue.push({
        sampleId: neighbor.sampleId,
        distance: current.distance + 1,
      });

      if (visited.size >= maxSamples) {
        break;
      }
    }
  }

  const sampleIds = Array.from(visited).sort();
  const sampleIdSet = new Set(sampleIds);
  const edgeIds = Array.from(
    new Set(
      sampleIds.flatMap((sampleId) =>
        (context.edgesBySampleId.get(sampleId) ?? [])
          .filter((edge) => edge.sampleIds.every((candidateId) => sampleIdSet.has(candidateId)))
          .map((edge) => edge.edgeId),
      ),
    ),
  ).sort();

  return { sampleIds, edgeIds };
}

function buildCandidate(
  input: CandidateInput,
  context: CandidateBuildContext,
): FieldSupportRegionCandidate {
  const sampleIds = uniqueSorted(input.sampleIds);
  const edgeIds = uniqueSorted(input.edgeIds);
  const chartIds = getChartIdsForSampleIds(sampleIds, context);
  const edges = getEdgesForIds(edgeIds, context);
  const seamEdgesInvolved = edges.some(isSeamAwareEdge);
  const computationalOnlyInvolved = countComputationalOnlySamples(sampleIds, context) > 0;
  const observationIds = uniqueSorted(input.observationIds ?? []);
  const routeGateCandidateIds = uniqueSorted(input.routeGateCandidateIds ?? []);

  return {
    candidateId: input.candidateId,
    candidateKind: input.candidateKind,
    supportKind: input.supportKind,
    status: STATUS,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    phaseContinuityStatus: PHASE_CONTINUITY_STATUS,
    sourcePolicyNames: [...context.sourcePolicyNames],
    sampleIds,
    chartIds,
    edgeIds,
    observationIds,
    routeGateCandidateIds,
    seamEdgesInvolved,
    computationalOnlyInvolved,
    evidenceSummary: buildEvidenceSummary(
      sampleIds,
      edgeIds,
      observationIds.length,
      routeGateCandidateIds.length,
      context,
    ),
    reason: input.reason,
    reliability: input.reliability,
  };
}

function buildEvidenceSummary(
  sampleIds: readonly string[],
  edgeIds: readonly string[],
  fieldFeatureObservationCount: number,
  routeGateCandidateCount: number,
  context: CandidateBuildContext,
): FieldSupportRegionEvidenceSummary {
  const samples = getSamplesForIds(sampleIds, context);
  const edges = getEdgesForIds(edgeIds, context);
  const intensities = samples.map((sample) => sample.intensity).filter(Number.isFinite);
  const effectiveSourceCounts = samples.map(getEffectiveSourceCount);
  const topContributionRatios = samples.map(getTopContributionRatio);

  return {
    sampleCount: sampleIds.length,
    chartCount: getChartIdsForSampleIds(sampleIds, context).length,
    seamEdgeCount: edges.filter(isSeamAwareEdge).length,
    chartLocalEdgeCount: edges.filter((edge) => !isSeamAwareEdge(edge)).length,
    averageIntensity: average(intensities),
    minIntensity: intensities.length ? Math.min(...intensities) : 0,
    maxIntensity: intensities.length ? Math.max(...intensities) : 0,
    averageEffectiveSourceCount: average(effectiveSourceCounts),
    maxTopContributionRatio: topContributionRatios.length
      ? Math.max(...topContributionRatios)
      : 0,
    fieldFeatureObservationCount,
    routeGateCandidateCount,
    computationalOnlySampleCount: countComputationalOnlySamples(sampleIds, context),
  };
}

function buildCandidateContext(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
  seamAwareGraph: ClosedSurfaceSeamAwareSampleGraph,
): CandidateBuildContext {
  return {
    sourcePolicyNames: getSourcePolicyNames(sampledAtlas),
    sampleById: new Map(sampledAtlas.samples.map((sample) => [sample.id, sample])),
    edgesBySampleId: buildEdgesBySampleId(seamAwareGraph.edges),
    edgeById: new Map(seamAwareGraph.edges.map((edge) => [edge.edgeId, edge])),
    neighborsBySampleId: buildNeighborsBySampleId(seamAwareGraph.edges),
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

  for (const edgesForSample of edgesBySampleId.values()) {
    edgesForSample.sort((first, second) => first.edgeId.localeCompare(second.edgeId));
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

function buildGraphSummary(
  seamAwareGraph: ClosedSurfaceSeamAwareSampleGraph,
): FieldSupportRegionCandidateGraphSummary {
  return {
    graphKind: seamAwareGraph.kind,
    scope: seamAwareGraph.scope,
    semanticStatus: seamAwareGraph.semanticStatus,
    topologyStatus: seamAwareGraph.topologyStatus,
    phaseContinuityStatus: seamAwareGraph.phaseContinuityStatus,
    nodeCount: seamAwareGraph.summary.nodeCount,
    chartLocalEdgeCount: seamAwareGraph.summary.chartLocalEdgeCount,
    seamEdgeCount: seamAwareGraph.summary.seamEdgeCount,
    totalEdgeCount: seamAwareGraph.summary.totalEdgeCount,
  };
}

function buildCandidateSummary(
  candidates: FieldSupportRegionCandidate[],
): FieldSupportRegionCandidateSummary {
  return {
    totalCandidateCount: candidates.length,
    supportClassCandidateCount: candidates.filter(
      (candidate) => candidate.candidateKind === 'support-class-candidate',
    ).length,
    regionCandidateCount: candidates.filter(
      (candidate) => candidate.candidateKind === 'region-candidate',
    ).length,
    constraintSiteCandidateCount: candidates.filter(
      (candidate) => candidate.candidateKind === 'constraint-site-candidate',
    ).length,
    routeFailureRegionCandidateCount: candidates.filter(
      (candidate) => candidate.candidateKind === 'route-failure-region-candidate',
    ).length,
  };
}

function groupObservationsByKind(
  observations: FieldFeatureReportObservation[],
): Array<{
  observationKind: FieldFeatureObservationKind;
  observations: FieldFeatureReportObservation[];
}> {
  const order: FieldFeatureObservationKind[] = [
    'cancellation-like-site-candidate',
    'high-intensity-anchor-candidate',
    'ambiguous-field-site',
  ];

  return order
    .map((observationKind) => ({
      observationKind,
      observations: observations
        .filter((observation) => observation.observationKind === observationKind)
        .sort((first, second) => first.observationId.localeCompare(second.observationId)),
    }))
    .filter((group) => group.observations.length > 0);
}

function getSupportKindForObservationGroup(
  observationKind: FieldFeatureObservationKind,
  observations: FieldFeatureReportObservation[],
): FieldSupportRegionSupportKind {
  if (observationKind === 'cancellation-like-site-candidate') {
    return 'cancellation-support';
  }

  if (observationKind === 'high-intensity-anchor-candidate') {
    return 'high-intensity-anchor-support';
  }

  if (
    observations.some((observation) => observation.chartSemanticRole === 'computational-only')
  ) {
    return 'ambiguous-computational-support';
  }

  return 'mixed-contribution-support';
}

function getIncidentEdgeIds(
  sampleIds: readonly string[],
  context: CandidateBuildContext,
): string[] {
  return uniqueSorted(
    sampleIds.flatMap((sampleId) =>
      (context.edgesBySampleId.get(sampleId) ?? []).map((edge) => edge.edgeId),
    ),
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

function getChartIdsForSampleIds(
  sampleIds: readonly string[],
  context: CandidateBuildContext,
): string[] {
  return uniqueSorted(
    sampleIds
      .map((sampleId) => context.sampleById.get(sampleId)?.chartId)
      .filter((chartId): chartId is string => Boolean(chartId)),
  );
}

function countComputationalOnlySamples(
  sampleIds: readonly string[],
  context: CandidateBuildContext,
): number {
  return sampleIds.filter(
    (sampleId) => context.sampleById.get(sampleId)?.chartSemanticRole === 'computational-only',
  ).length;
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

function getSourcePolicyNames(sampledAtlas: SampledClosedShapeSurfaceAtlas): string[] {
  return uniqueSorted(
    sampledAtlas.sources
      .map((source) => source.policyName.trim())
      .filter((policyName) => policyName.length > 0),
  );
}

function isSeamAwareEdge(edge: ClosedSurfaceSeamAwareSampleGraphEdge): boolean {
  return edge.edgeKind === 'closed-surface-seam-neighbor';
}

function average(values: number[]): number {
  const finiteValues = values.filter(Number.isFinite);

  if (!finiteValues.length) {
    return 0;
  }

  return finiteValues.reduce((sum, value) => sum + value, 0) / finiteValues.length;
}

function uniqueSorted(values: readonly string[]): string[] {
  return Array.from(new Set(values)).sort();
}

function resolveFieldSupportRegionCandidateOptions(
  options: FieldSupportRegionCandidateOptions,
): ResolvedFieldSupportRegionCandidateOptions {
  return {
    maxSupportClassCandidates: finiteBoundedCount(
      options.maxSupportClassCandidates,
      DEFAULT_MAX_SUPPORT_CLASS_CANDIDATES,
    ),
    maxRegionCandidates: finiteBoundedCount(
      options.maxRegionCandidates,
      DEFAULT_MAX_REGION_CANDIDATES,
    ),
    maxConstraintSiteCandidates: finiteBoundedCount(
      options.maxConstraintSiteCandidates,
      DEFAULT_MAX_CONSTRAINT_SITE_CANDIDATES,
    ),
    maxRouteFailureRegionCandidates: finiteBoundedCount(
      options.maxRouteFailureRegionCandidates,
      DEFAULT_MAX_ROUTE_FAILURE_REGION_CANDIDATES,
    ),
    regionGraphRadius: Math.max(
      0,
      finiteBoundedCount(options.regionGraphRadius, DEFAULT_REGION_GRAPH_RADIUS),
    ),
    maxRegionSamples: Math.max(
      1,
      finiteBoundedCount(options.maxRegionSamples, DEFAULT_MAX_REGION_SAMPLES),
    ),
  };
}

function finiteBoundedCount(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.floor(value));
}
