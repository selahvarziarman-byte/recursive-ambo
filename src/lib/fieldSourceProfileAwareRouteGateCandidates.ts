import {
  buildFieldRouteGateCandidateReport,
  type FieldRouteGateCandidateMethod,
  type FieldRouteGateCandidateOptions,
  type FieldRouteGateCandidatePhaseContinuityStatus,
  type FieldRouteGateCandidateReport,
  type FieldRouteGateCandidateSemanticStatus,
  type FieldRouteGateCandidateStatus,
  type FieldRouteGateCandidateTopologyStatus,
} from './fieldAtlasRouteGateCandidates';
import type { ProfileAwareShapeResolvedSurfaceAtlasResult } from './fieldSourceProfileAwareShapeResolvedSurfaceAtlas';

export type ProfileAwareRouteGateCandidateIssueCode =
  | 'surface-atlas-report-not-ok'
  | 'sampled-surface-atlas-unavailable'
  | 'route-gate-report-build-failed'
  | 'route-gate-source-policy-mismatch'
  | 'route-gate-status-mismatch'
  | 'route-gate-semantic-status-mismatch'
  | 'route-gate-topology-status-mismatch'
  | 'route-gate-phase-continuity-status-mismatch'
  | 'route-gate-graph-semantic-status-mismatch'
  | 'route-gate-graph-topology-status-mismatch'
  | 'route-gate-graph-route-gate-status-mismatch'
  | 'route-gate-graph-phase-continuity-status-mismatch'
  | 'route-gate-candidate-status-mismatch'
  | 'route-gate-candidate-source-policy-mismatch'
  | 'route-gate-candidate-semantic-status-mismatch'
  | 'route-gate-candidate-topology-status-mismatch'
  | 'route-gate-candidate-phase-continuity-status-mismatch'
  | 'route-gate-candidate-claim-status-mismatch'
  | 'route-gate-empty-chart-count'
  | 'route-gate-empty-sample-count'
  | 'route-gate-empty-source-count'
  | 'route-gate-empty-node-count';

export interface ProfileAwareRouteGateCandidateIssue {
  code: ProfileAwareRouteGateCandidateIssueCode;
  message: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface BuildProfileAwareRouteGateCandidateReportArgs {
  surfaceAtlasResult: ProfileAwareShapeResolvedSurfaceAtlasResult;
  routeGateOptions?: FieldRouteGateCandidateOptions;
  reportIdSuffix?: string;
}

export interface ProfileAwareRouteGateCandidateDiagnosticReport {
  reportId: string;
  method: 'profile-aware-route-gate-candidates-diagnostic-v0';
  diagnosticScope: 'profile-aware-shape-resolved-route-gate-candidates-only';
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  policyRelativityStatus: 'policy-relative';
  contrastPolicyNote: 'old-policy-not-assumed-invariant';
  semanticStatus: FieldRouteGateCandidateSemanticStatus;
  topologyStatus: FieldRouteGateCandidateTopologyStatus;
  phaseContinuityStatus: FieldRouteGateCandidatePhaseContinuityStatus;
  candidateStatus: FieldRouteGateCandidateStatus;
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
  fieldAtlasMutationStatus: 'not-mutated';
  routeGateReportMethod?: FieldRouteGateCandidateMethod;
  routeGateReportScope?: FieldRouteGateCandidateReport['scope'];
  graphRouteGateStatus?: FieldRouteGateCandidateReport['graphSummary']['routeGateStatus'];
  nodeCount: number;
  chartLocalEdgeCount: number;
  seamEdgeCount: number;
  totalEdgeCount: number;
  totalCandidateCount: number;
  gateCandidateCount: number;
  routeCandidateCount: number;
  blockedRouteCandidateCount: number;
  nonCandidateStatusCount: number;
  invalidCandidateClaimStatusCount: number;
  chartCount: number;
  sampleCount: number;
  atlasInputSourceCount: number;
  executableSourceCount: number;
  fallbackChildSourceCount: number;
  unresolvedChildSourceCount: number;
  degeneracyStatusCount: number;
  issueCount: number;
  ok: boolean;
  issues: ProfileAwareRouteGateCandidateIssue[];
}

const METHOD = 'profile-aware-route-gate-candidates-diagnostic-v0';
const DIAGNOSTIC_SCOPE =
  'profile-aware-shape-resolved-route-gate-candidates-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const CONTRAST_POLICY_NOTE = 'old-policy-not-assumed-invariant';
const CANDIDATE_STATUS: FieldRouteGateCandidateStatus = 'candidate-only';
const SEMANTIC_STATUS: FieldRouteGateCandidateSemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: FieldRouteGateCandidateTopologyStatus =
  'not-topology-workspace';
const PHASE_CONTINUITY_STATUS: FieldRouteGateCandidatePhaseContinuityStatus =
  'not-global-phase-continuity';
const GRAPH_SEMANTIC_STATUS = 'not-semantic-identity';
const GRAPH_ROUTE_GATE_STATUS = 'not-route-or-gate-extraction';

export function buildProfileAwareRouteGateCandidateDiagnosticReport(
  args: BuildProfileAwareRouteGateCandidateReportArgs,
): ProfileAwareRouteGateCandidateDiagnosticReport {
  const issues: ProfileAwareRouteGateCandidateIssue[] = [];
  const surfaceReport = args.surfaceAtlasResult.report;
  let routeGateReport: FieldRouteGateCandidateReport | undefined;

  if (!surfaceReport.ok) {
    issues.push({
      code: 'surface-atlas-report-not-ok',
      message:
        'Profile-aware route/gate candidate report cannot be accepted because the shape-resolved surface atlas report is not ok.',
      details: {
        surfaceAtlasIssueCount: surfaceReport.issueCount,
      },
    });
  }

  if (!args.surfaceAtlasResult.sampledAtlas) {
    issues.push({
      code: 'sampled-surface-atlas-unavailable',
      message:
        'Profile-aware route/gate candidate report cannot run because no sampled surface atlas payload was available.',
    });
  }

  if (surfaceReport.ok && args.surfaceAtlasResult.sampledAtlas) {
    try {
      routeGateReport = buildFieldRouteGateCandidateReport(
        args.surfaceAtlasResult.sampledAtlas,
        args.routeGateOptions,
      );
    } catch (error) {
      issues.push({
        code: 'route-gate-report-build-failed',
        message:
          'Existing route/gate candidate machinery failed on the profile-aware sampled atlas.',
        details: {
          reason: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  if (routeGateReport) {
    appendRouteGateReportIssues(
      routeGateReport,
      {
        chartCount: surfaceReport.chartCount,
        sampleCount: surfaceReport.sampleCount,
        executableSourceCount: surfaceReport.executableSourceCount,
      },
      issues,
    );
  }

  const nonCandidateStatusCount =
    routeGateReport?.candidates.filter(
      (candidate) => candidate.status !== CANDIDATE_STATUS,
    ).length ?? 0;
  const invalidCandidateClaimStatusCount =
    routeGateReport?.candidates.filter((candidate) => !hasExpectedClaimStatus(candidate))
      .length ?? 0;
  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:${args.reportIdSuffix ?? surfaceReport.reportId}`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    sourcePolicyId: SOURCE_POLICY_ID,
    policyRelativityStatus: 'policy-relative',
    contrastPolicyNote: CONTRAST_POLICY_NOTE,
    semanticStatus: routeGateReport?.semanticStatus ?? SEMANTIC_STATUS,
    topologyStatus: routeGateReport?.topologyStatus ?? TOPOLOGY_STATUS,
    phaseContinuityStatus:
      routeGateReport?.phaseContinuityStatus ?? PHASE_CONTINUITY_STATUS,
    candidateStatus: routeGateReport?.status ?? CANDIDATE_STATUS,
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated',
    fieldAtlasMutationStatus: 'not-mutated',
    ...(routeGateReport
      ? { routeGateReportMethod: routeGateReport.method }
      : {}),
    ...(routeGateReport ? { routeGateReportScope: routeGateReport.scope } : {}),
    ...(routeGateReport
      ? { graphRouteGateStatus: routeGateReport.graphSummary.routeGateStatus }
      : {}),
    nodeCount: routeGateReport?.graphSummary.nodeCount ?? 0,
    chartLocalEdgeCount: routeGateReport?.graphSummary.chartLocalEdgeCount ?? 0,
    seamEdgeCount: routeGateReport?.graphSummary.seamEdgeCount ?? 0,
    totalEdgeCount: routeGateReport?.graphSummary.totalEdgeCount ?? 0,
    totalCandidateCount:
      routeGateReport?.candidateSummary.totalCandidateCount ?? 0,
    gateCandidateCount:
      routeGateReport?.candidateSummary.gateCandidateCount ?? 0,
    routeCandidateCount:
      routeGateReport?.candidateSummary.routeCandidateCount ?? 0,
    blockedRouteCandidateCount:
      routeGateReport?.candidateSummary.blockedRouteCandidateCount ?? 0,
    nonCandidateStatusCount,
    invalidCandidateClaimStatusCount,
    chartCount: surfaceReport.chartCount,
    sampleCount: surfaceReport.sampleCount,
    atlasInputSourceCount: surfaceReport.atlasInputSourceCount,
    executableSourceCount: surfaceReport.executableSourceCount,
    fallbackChildSourceCount: surfaceReport.fallbackChildSourceCount,
    unresolvedChildSourceCount: surfaceReport.unresolvedChildSourceCount,
    degeneracyStatusCount: surfaceReport.degeneracyStatusCount,
    issueCount,
    ok: issueCount === 0,
    issues,
  };
}

function appendRouteGateReportIssues(
  routeGateReport: FieldRouteGateCandidateReport,
  surfaceCounts: {
    chartCount: number;
    sampleCount: number;
    executableSourceCount: number;
  },
  issues: ProfileAwareRouteGateCandidateIssue[],
): void {
  const sourcePolicyNames = routeGateReport.sourcePolicyNames;
  const candidateSourcePolicyMismatchCount = routeGateReport.candidates.filter(
    (candidate) => !isProfileAwareSourcePolicyList(candidate.sourcePolicyNames),
  ).length;
  const nonCandidateStatusCount = routeGateReport.candidates.filter(
    (candidate) => candidate.status !== CANDIDATE_STATUS,
  ).length;
  const candidateSemanticMismatchCount = routeGateReport.candidates.filter(
    (candidate) => candidate.semanticStatus !== SEMANTIC_STATUS,
  ).length;
  const candidateTopologyMismatchCount = routeGateReport.candidates.filter(
    (candidate) => candidate.topologyStatus !== TOPOLOGY_STATUS,
  ).length;
  const candidatePhaseContinuityMismatchCount = routeGateReport.candidates.filter(
    (candidate) => candidate.phaseContinuityStatus !== PHASE_CONTINUITY_STATUS,
  ).length;
  const invalidCandidateClaimStatusCount = routeGateReport.candidates.filter(
    (candidate) => !hasExpectedClaimStatus(candidate),
  ).length;

  if (!isProfileAwareSourcePolicyList(sourcePolicyNames)) {
    issues.push({
      code: 'route-gate-source-policy-mismatch',
      message:
        'Route/gate report source policy metadata does not match the profile-aware source policy.',
      details: {
        sourcePolicyNameCount: sourcePolicyNames.length,
        expectedSourcePolicyId: SOURCE_POLICY_ID,
        actualSourcePolicyNames: sourcePolicyNames.join(','),
      },
    });
  }

  if (routeGateReport.status !== CANDIDATE_STATUS) {
    issues.push({
      code: 'route-gate-status-mismatch',
      message: 'Route/gate report unexpectedly changed candidate status.',
      details: {
        expectedStatus: CANDIDATE_STATUS,
        actualStatus: routeGateReport.status,
      },
    });
  }

  if (routeGateReport.semanticStatus !== SEMANTIC_STATUS) {
    issues.push({
      code: 'route-gate-semantic-status-mismatch',
      message: 'Route/gate report unexpectedly changed semantic status.',
      details: {
        expectedSemanticStatus: SEMANTIC_STATUS,
        actualSemanticStatus: routeGateReport.semanticStatus,
      },
    });
  }

  if (routeGateReport.topologyStatus !== TOPOLOGY_STATUS) {
    issues.push({
      code: 'route-gate-topology-status-mismatch',
      message: 'Route/gate report unexpectedly changed topology status.',
      details: {
        expectedTopologyStatus: TOPOLOGY_STATUS,
        actualTopologyStatus: routeGateReport.topologyStatus,
      },
    });
  }

  if (routeGateReport.phaseContinuityStatus !== PHASE_CONTINUITY_STATUS) {
    issues.push({
      code: 'route-gate-phase-continuity-status-mismatch',
      message: 'Route/gate report unexpectedly changed phase continuity status.',
      details: {
        expectedPhaseContinuityStatus: PHASE_CONTINUITY_STATUS,
        actualPhaseContinuityStatus: routeGateReport.phaseContinuityStatus,
      },
    });
  }

  if (routeGateReport.graphSummary.semanticStatus !== GRAPH_SEMANTIC_STATUS) {
    issues.push({
      code: 'route-gate-graph-semantic-status-mismatch',
      message:
        'Route/gate report graph summary unexpectedly changed semantic identity status.',
      details: {
        expectedGraphSemanticStatus: GRAPH_SEMANTIC_STATUS,
        actualGraphSemanticStatus: routeGateReport.graphSummary.semanticStatus,
      },
    });
  }

  if (routeGateReport.graphSummary.topologyStatus !== TOPOLOGY_STATUS) {
    issues.push({
      code: 'route-gate-graph-topology-status-mismatch',
      message:
        'Route/gate report graph summary unexpectedly changed topology status.',
      details: {
        expectedTopologyStatus: TOPOLOGY_STATUS,
        actualTopologyStatus: routeGateReport.graphSummary.topologyStatus,
      },
    });
  }

  if (routeGateReport.graphSummary.routeGateStatus !== GRAPH_ROUTE_GATE_STATUS) {
    issues.push({
      code: 'route-gate-graph-route-gate-status-mismatch',
      message:
        'Route/gate report graph summary unexpectedly claimed route/gate extraction.',
      details: {
        expectedGraphRouteGateStatus: GRAPH_ROUTE_GATE_STATUS,
        actualGraphRouteGateStatus: routeGateReport.graphSummary.routeGateStatus,
      },
    });
  }

  if (routeGateReport.graphSummary.phaseContinuityStatus !== PHASE_CONTINUITY_STATUS) {
    issues.push({
      code: 'route-gate-graph-phase-continuity-status-mismatch',
      message:
        'Route/gate report graph summary unexpectedly changed phase continuity status.',
      details: {
        expectedPhaseContinuityStatus: PHASE_CONTINUITY_STATUS,
        actualPhaseContinuityStatus:
          routeGateReport.graphSummary.phaseContinuityStatus,
      },
    });
  }

  if (nonCandidateStatusCount > 0) {
    issues.push({
      code: 'route-gate-candidate-status-mismatch',
      message: 'Route/gate report produced candidates outside candidate-only status.',
      details: {
        nonCandidateStatusCount,
      },
    });
  }

  if (candidateSourcePolicyMismatchCount > 0) {
    issues.push({
      code: 'route-gate-candidate-source-policy-mismatch',
      message:
        'Route/gate report produced candidates whose source policy metadata is not profile-aware.',
      details: {
        candidateSourcePolicyMismatchCount,
      },
    });
  }

  if (candidateSemanticMismatchCount > 0) {
    issues.push({
      code: 'route-gate-candidate-semantic-status-mismatch',
      message: 'Route/gate report produced candidates outside not-semantic-naming status.',
      details: {
        candidateSemanticMismatchCount,
      },
    });
  }

  if (candidateTopologyMismatchCount > 0) {
    issues.push({
      code: 'route-gate-candidate-topology-status-mismatch',
      message: 'Route/gate report produced candidates outside not-topology-workspace status.',
      details: {
        candidateTopologyMismatchCount,
      },
    });
  }

  if (candidatePhaseContinuityMismatchCount > 0) {
    issues.push({
      code: 'route-gate-candidate-phase-continuity-status-mismatch',
      message:
        'Route/gate report produced candidates outside not-global-phase-continuity status.',
      details: {
        candidatePhaseContinuityMismatchCount,
      },
    });
  }

  if (invalidCandidateClaimStatusCount > 0) {
    issues.push({
      code: 'route-gate-candidate-claim-status-mismatch',
      message:
        'Route/gate report produced candidates whose claim status no longer matches their candidate kind.',
      details: {
        invalidCandidateClaimStatusCount,
      },
    });
  }

  if (surfaceCounts.chartCount <= 0) {
    issues.push({
      code: 'route-gate-empty-chart-count',
      message: 'Route/gate diagnostic has no sampled surface charts.',
    });
  }

  if (surfaceCounts.sampleCount <= 0) {
    issues.push({
      code: 'route-gate-empty-sample-count',
      message: 'Route/gate diagnostic has no sampled surface samples.',
    });
  }

  if (routeGateReport.graphSummary.nodeCount <= 0) {
    issues.push({
      code: 'route-gate-empty-node-count',
      message: 'Route/gate report graph summary has no sampled surface nodes.',
    });
  }

  if (surfaceCounts.executableSourceCount <= 0) {
    issues.push({
      code: 'route-gate-empty-source-count',
      message: 'Route/gate diagnostic has no executable profile-aware sources.',
    });
  }
}

function isProfileAwareSourcePolicyList(sourcePolicyNames: readonly string[]): boolean {
  return (
    sourcePolicyNames.length === 1 &&
    sourcePolicyNames[0] === SOURCE_POLICY_ID
  );
}

function hasExpectedClaimStatus(
  candidate: FieldRouteGateCandidateReport['candidates'][number],
): boolean {
  if (candidate.candidateKind === 'gate-candidate') {
    return candidate.claimStatus === 'insufficient-for-confirmed-gate';
  }

  if (candidate.candidateKind === 'route-candidate') {
    return candidate.claimStatus === 'insufficient-for-confirmed-route';
  }

  return (
    candidate.candidateKind === 'blocked-or-failed-route-candidate' &&
    candidate.claimStatus === 'diagnostic-only'
  );
}
