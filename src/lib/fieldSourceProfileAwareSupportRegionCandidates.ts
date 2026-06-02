import {
  buildFieldSupportRegionCandidateReport,
  type FieldSupportRegionCandidateMethod,
  type FieldSupportRegionCandidateOptions,
  type FieldSupportRegionCandidatePhaseContinuityStatus,
  type FieldSupportRegionCandidateReport,
  type FieldSupportRegionCandidateSemanticStatus,
  type FieldSupportRegionCandidateStatus,
  type FieldSupportRegionCandidateTopologyStatus,
} from './fieldAtlasSupportRegionCandidates';
import type { ProfileAwareShapeResolvedSurfaceAtlasResult } from './fieldSourceProfileAwareShapeResolvedSurfaceAtlas';

export type ProfileAwareSupportRegionCandidateIssueCode =
  | 'surface-atlas-report-not-ok'
  | 'sampled-surface-atlas-unavailable'
  | 'support-region-report-build-failed'
  | 'support-region-source-policy-mismatch'
  | 'support-region-status-mismatch'
  | 'support-region-semantic-status-mismatch'
  | 'support-region-topology-status-mismatch'
  | 'support-region-phase-continuity-status-mismatch'
  | 'support-region-graph-semantic-status-mismatch'
  | 'support-region-graph-topology-status-mismatch'
  | 'support-region-graph-phase-continuity-status-mismatch'
  | 'support-region-candidate-source-policy-mismatch'
  | 'support-region-candidate-status-mismatch'
  | 'support-region-candidate-semantic-status-mismatch'
  | 'support-region-candidate-topology-status-mismatch'
  | 'support-region-candidate-phase-continuity-status-mismatch'
  | 'support-region-empty-chart-count'
  | 'support-region-empty-sample-count'
  | 'support-region-empty-source-count'
  | 'support-region-empty-node-count';

export interface ProfileAwareSupportRegionCandidateIssue {
  code: ProfileAwareSupportRegionCandidateIssueCode;
  message: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface BuildProfileAwareSupportRegionCandidateReportArgs {
  surfaceAtlasResult: ProfileAwareShapeResolvedSurfaceAtlasResult;
  supportRegionOptions?: FieldSupportRegionCandidateOptions;
  reportIdSuffix?: string;
}

export interface ProfileAwareSupportRegionCandidateDiagnosticReport {
  reportId: string;
  method: 'profile-aware-support-region-candidates-diagnostic-v0';
  diagnosticScope: 'profile-aware-shape-resolved-support-region-candidates-only';
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  policyRelativityStatus: 'policy-relative';
  contrastPolicyNote: 'old-policy-not-assumed-invariant';
  semanticStatus: FieldSupportRegionCandidateSemanticStatus;
  topologyStatus: FieldSupportRegionCandidateTopologyStatus;
  phaseContinuityStatus: FieldSupportRegionCandidatePhaseContinuityStatus;
  candidateStatus: FieldSupportRegionCandidateStatus;
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
  fieldAtlasMutationStatus: 'not-mutated';
  supportRegionReportMethod?: FieldSupportRegionCandidateMethod;
  supportRegionReportScope?: FieldSupportRegionCandidateReport['scope'];
  nodeCount: number;
  chartLocalEdgeCount: number;
  seamEdgeCount: number;
  totalEdgeCount: number;
  totalCandidateCount: number;
  supportClassCandidateCount: number;
  regionCandidateCount: number;
  constraintSiteCandidateCount: number;
  routeFailureRegionCandidateCount: number;
  nonCandidateStatusCount: number;
  invalidCandidateStatusCount: number;
  chartCount: number;
  sampleCount: number;
  atlasInputSourceCount: number;
  executableSourceCount: number;
  fallbackChildSourceCount: number;
  unresolvedChildSourceCount: number;
  degeneracyStatusCount: number;
  issueCount: number;
  ok: boolean;
  issues: ProfileAwareSupportRegionCandidateIssue[];
}

const METHOD = 'profile-aware-support-region-candidates-diagnostic-v0';
const DIAGNOSTIC_SCOPE =
  'profile-aware-shape-resolved-support-region-candidates-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const CONTRAST_POLICY_NOTE = 'old-policy-not-assumed-invariant';
const CANDIDATE_STATUS: FieldSupportRegionCandidateStatus = 'candidate-only';
const SEMANTIC_STATUS: FieldSupportRegionCandidateSemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: FieldSupportRegionCandidateTopologyStatus =
  'not-topology-workspace';
const PHASE_CONTINUITY_STATUS: FieldSupportRegionCandidatePhaseContinuityStatus =
  'not-global-phase-continuity';
const GRAPH_SEMANTIC_STATUS = 'not-semantic-identity';

export function buildProfileAwareSupportRegionCandidateDiagnosticReport(
  args: BuildProfileAwareSupportRegionCandidateReportArgs,
): ProfileAwareSupportRegionCandidateDiagnosticReport {
  const issues: ProfileAwareSupportRegionCandidateIssue[] = [];
  const surfaceReport = args.surfaceAtlasResult.report;
  let supportRegionReport: FieldSupportRegionCandidateReport | undefined;

  if (!surfaceReport.ok) {
    issues.push({
      code: 'surface-atlas-report-not-ok',
      message:
        'Profile-aware support/region candidate report cannot be accepted because the shape-resolved surface atlas report is not ok.',
      details: {
        surfaceAtlasIssueCount: surfaceReport.issueCount,
      },
    });
  }

  if (!args.surfaceAtlasResult.sampledAtlas) {
    issues.push({
      code: 'sampled-surface-atlas-unavailable',
      message:
        'Profile-aware support/region candidate report cannot run because no sampled surface atlas payload was available.',
    });
  }

  if (surfaceReport.ok && args.surfaceAtlasResult.sampledAtlas) {
    try {
      supportRegionReport = buildFieldSupportRegionCandidateReport(
        args.surfaceAtlasResult.sampledAtlas,
        args.supportRegionOptions,
      );
    } catch (error) {
      issues.push({
        code: 'support-region-report-build-failed',
        message:
          'Existing support/region candidate machinery failed on the profile-aware sampled atlas.',
        details: {
          reason: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  if (supportRegionReport) {
    appendSupportRegionReportIssues(
      supportRegionReport,
      {
        chartCount: surfaceReport.chartCount,
        sampleCount: surfaceReport.sampleCount,
        executableSourceCount: surfaceReport.executableSourceCount,
      },
      issues,
    );
  }

  const nonCandidateStatusCount =
    supportRegionReport?.candidates.filter(
      (candidate) => candidate.status !== CANDIDATE_STATUS,
    ).length ?? 0;
  const invalidCandidateStatusCount = nonCandidateStatusCount;
  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:${args.reportIdSuffix ?? surfaceReport.reportId}`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    sourcePolicyId: SOURCE_POLICY_ID,
    policyRelativityStatus: 'policy-relative',
    contrastPolicyNote: CONTRAST_POLICY_NOTE,
    semanticStatus: supportRegionReport?.semanticStatus ?? SEMANTIC_STATUS,
    topologyStatus: supportRegionReport?.topologyStatus ?? TOPOLOGY_STATUS,
    phaseContinuityStatus:
      supportRegionReport?.phaseContinuityStatus ?? PHASE_CONTINUITY_STATUS,
    candidateStatus: supportRegionReport?.status ?? CANDIDATE_STATUS,
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated',
    fieldAtlasMutationStatus: 'not-mutated',
    ...(supportRegionReport
      ? { supportRegionReportMethod: supportRegionReport.method }
      : {}),
    ...(supportRegionReport
      ? { supportRegionReportScope: supportRegionReport.scope }
      : {}),
    nodeCount: supportRegionReport?.graphSummary.nodeCount ?? 0,
    chartLocalEdgeCount:
      supportRegionReport?.graphSummary.chartLocalEdgeCount ?? 0,
    seamEdgeCount: supportRegionReport?.graphSummary.seamEdgeCount ?? 0,
    totalEdgeCount: supportRegionReport?.graphSummary.totalEdgeCount ?? 0,
    totalCandidateCount:
      supportRegionReport?.candidateSummary.totalCandidateCount ?? 0,
    supportClassCandidateCount:
      supportRegionReport?.candidateSummary.supportClassCandidateCount ?? 0,
    regionCandidateCount:
      supportRegionReport?.candidateSummary.regionCandidateCount ?? 0,
    constraintSiteCandidateCount:
      supportRegionReport?.candidateSummary.constraintSiteCandidateCount ?? 0,
    routeFailureRegionCandidateCount:
      supportRegionReport?.candidateSummary.routeFailureRegionCandidateCount ?? 0,
    nonCandidateStatusCount,
    invalidCandidateStatusCount,
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

function appendSupportRegionReportIssues(
  supportRegionReport: FieldSupportRegionCandidateReport,
  surfaceCounts: {
    chartCount: number;
    sampleCount: number;
    executableSourceCount: number;
  },
  issues: ProfileAwareSupportRegionCandidateIssue[],
): void {
  const sourcePolicyNames = supportRegionReport.sourcePolicyNames;
  const nonCandidateStatusCount = supportRegionReport.candidates.filter(
    (candidate) => candidate.status !== CANDIDATE_STATUS,
  ).length;
  const candidateSourcePolicyMismatchCount = supportRegionReport.candidates.filter(
    (candidate) => !isProfileAwareSourcePolicyList(candidate.sourcePolicyNames),
  ).length;
  const candidateSemanticMismatchCount = supportRegionReport.candidates.filter(
    (candidate) => candidate.semanticStatus !== SEMANTIC_STATUS,
  ).length;
  const candidateTopologyMismatchCount = supportRegionReport.candidates.filter(
    (candidate) => candidate.topologyStatus !== TOPOLOGY_STATUS,
  ).length;
  const candidatePhaseContinuityMismatchCount =
    supportRegionReport.candidates.filter(
      (candidate) => candidate.phaseContinuityStatus !== PHASE_CONTINUITY_STATUS,
    ).length;

  if (!isProfileAwareSourcePolicyList(sourcePolicyNames)) {
    issues.push({
      code: 'support-region-source-policy-mismatch',
      message:
        'Support/region report source policy metadata does not match the profile-aware source policy.',
      details: {
        sourcePolicyNameCount: sourcePolicyNames.length,
        expectedSourcePolicyId: SOURCE_POLICY_ID,
        actualSourcePolicyNames: sourcePolicyNames.join(','),
      },
    });
  }

  if (supportRegionReport.status !== CANDIDATE_STATUS) {
    issues.push({
      code: 'support-region-status-mismatch',
      message:
        'Support/region report unexpectedly changed candidate status.',
      details: {
        expectedStatus: CANDIDATE_STATUS,
        actualStatus: supportRegionReport.status,
      },
    });
  }

  if (supportRegionReport.semanticStatus !== SEMANTIC_STATUS) {
    issues.push({
      code: 'support-region-semantic-status-mismatch',
      message:
        'Support/region report unexpectedly changed semantic status.',
      details: {
        expectedSemanticStatus: SEMANTIC_STATUS,
        actualSemanticStatus: supportRegionReport.semanticStatus,
      },
    });
  }

  if (supportRegionReport.topologyStatus !== TOPOLOGY_STATUS) {
    issues.push({
      code: 'support-region-topology-status-mismatch',
      message:
        'Support/region report unexpectedly changed topology status.',
      details: {
        expectedTopologyStatus: TOPOLOGY_STATUS,
        actualTopologyStatus: supportRegionReport.topologyStatus,
      },
    });
  }

  if (supportRegionReport.phaseContinuityStatus !== PHASE_CONTINUITY_STATUS) {
    issues.push({
      code: 'support-region-phase-continuity-status-mismatch',
      message:
        'Support/region report unexpectedly changed phase continuity status.',
      details: {
        expectedPhaseContinuityStatus: PHASE_CONTINUITY_STATUS,
        actualPhaseContinuityStatus:
          supportRegionReport.phaseContinuityStatus,
      },
    });
  }

  if (supportRegionReport.graphSummary.semanticStatus !== GRAPH_SEMANTIC_STATUS) {
    issues.push({
      code: 'support-region-graph-semantic-status-mismatch',
      message:
        'Support/region report graph summary unexpectedly changed semantic identity status.',
      details: {
        expectedGraphSemanticStatus: GRAPH_SEMANTIC_STATUS,
        actualGraphSemanticStatus:
          supportRegionReport.graphSummary.semanticStatus,
      },
    });
  }

  if (supportRegionReport.graphSummary.topologyStatus !== TOPOLOGY_STATUS) {
    issues.push({
      code: 'support-region-graph-topology-status-mismatch',
      message:
        'Support/region report graph summary unexpectedly changed topology status.',
      details: {
        expectedTopologyStatus: TOPOLOGY_STATUS,
        actualTopologyStatus: supportRegionReport.graphSummary.topologyStatus,
      },
    });
  }

  if (
    supportRegionReport.graphSummary.phaseContinuityStatus !==
    PHASE_CONTINUITY_STATUS
  ) {
    issues.push({
      code: 'support-region-graph-phase-continuity-status-mismatch',
      message:
        'Support/region report graph summary unexpectedly changed phase continuity status.',
      details: {
        expectedPhaseContinuityStatus: PHASE_CONTINUITY_STATUS,
        actualPhaseContinuityStatus:
          supportRegionReport.graphSummary.phaseContinuityStatus,
      },
    });
  }

  if (candidateSourcePolicyMismatchCount > 0) {
    issues.push({
      code: 'support-region-candidate-source-policy-mismatch',
      message:
        'Support/region report produced candidates whose source policy metadata is not profile-aware.',
      details: {
        candidateSourcePolicyMismatchCount,
      },
    });
  }

  if (nonCandidateStatusCount > 0) {
    issues.push({
      code: 'support-region-candidate-status-mismatch',
      message:
        'Support/region report produced candidates outside candidate-only status.',
      details: {
        nonCandidateStatusCount,
      },
    });
  }

  if (candidateSemanticMismatchCount > 0) {
    issues.push({
      code: 'support-region-candidate-semantic-status-mismatch',
      message:
        'Support/region report produced candidates outside not-semantic-naming status.',
      details: {
        candidateSemanticMismatchCount,
      },
    });
  }

  if (candidateTopologyMismatchCount > 0) {
    issues.push({
      code: 'support-region-candidate-topology-status-mismatch',
      message:
        'Support/region report produced candidates outside not-topology-workspace status.',
      details: {
        candidateTopologyMismatchCount,
      },
    });
  }

  if (candidatePhaseContinuityMismatchCount > 0) {
    issues.push({
      code: 'support-region-candidate-phase-continuity-status-mismatch',
      message:
        'Support/region report produced candidates outside not-global-phase-continuity status.',
      details: {
        candidatePhaseContinuityMismatchCount,
      },
    });
  }

  if (surfaceCounts.chartCount <= 0) {
    issues.push({
      code: 'support-region-empty-chart-count',
      message: 'Support/region diagnostic has no sampled surface charts.',
    });
  }

  if (surfaceCounts.sampleCount <= 0) {
    issues.push({
      code: 'support-region-empty-sample-count',
      message: 'Support/region diagnostic has no sampled surface samples.',
    });
  }

  if (supportRegionReport.graphSummary.nodeCount <= 0) {
    issues.push({
      code: 'support-region-empty-node-count',
      message:
        'Support/region report graph summary has no sampled surface nodes.',
    });
  }

  if (surfaceCounts.executableSourceCount <= 0) {
    issues.push({
      code: 'support-region-empty-source-count',
      message:
        'Support/region diagnostic has no executable profile-aware sources.',
    });
  }
}

function isProfileAwareSourcePolicyList(sourcePolicyNames: readonly string[]): boolean {
  return (
    sourcePolicyNames.length === 1 &&
    sourcePolicyNames[0] === SOURCE_POLICY_ID
  );
}
