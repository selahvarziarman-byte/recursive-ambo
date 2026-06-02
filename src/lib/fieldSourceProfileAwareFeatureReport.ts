import {
  buildFieldFeatureReportFromAtlas,
  type FieldFeatureReportOptions,
  type FieldFeatureReportStatus,
  type FieldFeatureReportObservationStatus,
  type FieldFeatureReportSemanticStatus,
  type FieldFeatureReportMethod,
} from './fieldAtlasFeatureReport';
import type { ProfileAwareShapeResolvedSurfaceAtlasResult } from './fieldSourceProfileAwareShapeResolvedSurfaceAtlas';

export type ProfileAwareFeatureReportIssueCode =
  | 'surface-atlas-report-not-ok'
  | 'sampled-surface-atlas-unavailable'
  | 'feature-report-build-failed'
  | 'feature-report-source-policy-mismatch'
  | 'feature-report-semantic-status-mismatch'
  | 'feature-report-observation-status-mismatch'
  | 'feature-report-empty-chart-count'
  | 'feature-report-empty-sample-count'
  | 'feature-report-empty-source-count';

export interface ProfileAwareFeatureReportIssue {
  code: ProfileAwareFeatureReportIssueCode;
  message: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface BuildProfileAwareFeatureReportArgs {
  surfaceAtlasResult: ProfileAwareShapeResolvedSurfaceAtlasResult;
  featureReportOptions?: FieldFeatureReportOptions;
  reportIdSuffix?: string;
}

export interface ProfileAwareFeatureReportDiagnosticReport {
  reportId: string;
  method: 'profile-aware-field-feature-report-diagnostic-v0';
  diagnosticScope: 'profile-aware-shape-resolved-feature-report-only';
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  policyRelativityStatus: 'policy-relative';
  contrastPolicyNote: 'old-policy-not-assumed-invariant';
  semanticStatus: FieldFeatureReportSemanticStatus;
  observationStatus: FieldFeatureReportObservationStatus;
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
  fieldAtlasMutationStatus: 'not-mutated';
  featureReportMethod?: FieldFeatureReportMethod;
  featureReportStatus?: FieldFeatureReportStatus;
  totalObservationCount: number;
  cancellationLikeObservationCount: number;
  highIntensityAnchorObservationCount: number;
  ambiguousObservationCount: number;
  nonCandidateObservationCount: number;
  chartCount: number;
  sampleCount: number;
  atlasInputSourceCount: number;
  executableSourceCount: number;
  fallbackChildSourceCount: number;
  unresolvedChildSourceCount: number;
  degeneracyStatusCount: number;
  issueCount: number;
  ok: boolean;
  issues: ProfileAwareFeatureReportIssue[];
}

const METHOD = 'profile-aware-field-feature-report-diagnostic-v0';
const DIAGNOSTIC_SCOPE = 'profile-aware-shape-resolved-feature-report-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const CONTRAST_POLICY_NOTE = 'old-policy-not-assumed-invariant';
const SEMANTIC_STATUS: FieldFeatureReportSemanticStatus = 'not-semantic-naming';
const OBSERVATION_STATUS: FieldFeatureReportObservationStatus = 'report-candidate';

export function buildProfileAwareFeatureReportDiagnosticReport(
  args: BuildProfileAwareFeatureReportArgs,
): ProfileAwareFeatureReportDiagnosticReport {
  const issues: ProfileAwareFeatureReportIssue[] = [];
  const surfaceReport = args.surfaceAtlasResult.report;
  let featureReport:
    | ReturnType<typeof buildFieldFeatureReportFromAtlas>
    | undefined;

  if (!surfaceReport.ok) {
    issues.push({
      code: 'surface-atlas-report-not-ok',
      message: 'Profile-aware feature report cannot be accepted because the shape-resolved surface atlas report is not ok.',
      details: {
        surfaceAtlasIssueCount: surfaceReport.issueCount,
      },
    });
  }

  if (!args.surfaceAtlasResult.sampledAtlas) {
    issues.push({
      code: 'sampled-surface-atlas-unavailable',
      message: 'Profile-aware feature report cannot run because no sampled surface atlas payload was available.',
    });
  }

  if (surfaceReport.ok && args.surfaceAtlasResult.sampledAtlas) {
    try {
      featureReport = buildFieldFeatureReportFromAtlas(
        args.surfaceAtlasResult.sampledAtlas,
        args.featureReportOptions,
      );
    } catch (error) {
      issues.push({
        code: 'feature-report-build-failed',
        message: 'Existing field feature report machinery failed on the profile-aware sampled atlas.',
        details: {
          reason: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  if (featureReport) {
    appendFeatureReportIssues(featureReport, issues);
  }

  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:${args.reportIdSuffix ?? surfaceReport.reportId}`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    sourcePolicyId: SOURCE_POLICY_ID,
    policyRelativityStatus: 'policy-relative',
    contrastPolicyNote: CONTRAST_POLICY_NOTE,
    semanticStatus: featureReport?.semanticStatus ?? SEMANTIC_STATUS,
    observationStatus: OBSERVATION_STATUS,
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated',
    fieldAtlasMutationStatus: 'not-mutated',
    ...(featureReport ? { featureReportMethod: featureReport.method } : {}),
    ...(featureReport ? { featureReportStatus: featureReport.status } : {}),
    totalObservationCount: featureReport?.observationSummary.totalObservations ?? 0,
    cancellationLikeObservationCount:
      featureReport?.observationSummary.cancellationLikeCount ?? 0,
    highIntensityAnchorObservationCount:
      featureReport?.observationSummary.highIntensityAnchorCount ?? 0,
    ambiguousObservationCount: featureReport?.observationSummary.ambiguousCount ?? 0,
    nonCandidateObservationCount: featureReport
      ? featureReport.observations.filter(
          (observation) => observation.status !== OBSERVATION_STATUS,
        ).length
      : 0,
    chartCount: featureReport?.atlasSummary.chartCount ?? surfaceReport.chartCount,
    sampleCount: featureReport?.atlasSummary.sampleCount ?? surfaceReport.sampleCount,
    atlasInputSourceCount: surfaceReport.atlasInputSourceCount,
    executableSourceCount:
      featureReport?.sourceSummary.totalSources ?? surfaceReport.executableSourceCount,
    fallbackChildSourceCount: surfaceReport.fallbackChildSourceCount,
    unresolvedChildSourceCount: surfaceReport.unresolvedChildSourceCount,
    degeneracyStatusCount: surfaceReport.degeneracyStatusCount,
    issueCount,
    ok: issueCount === 0,
    issues,
  };
}

function appendFeatureReportIssues(
  featureReport: ReturnType<typeof buildFieldFeatureReportFromAtlas>,
  issues: ProfileAwareFeatureReportIssue[],
): void {
  const sourcePolicyNames = featureReport.sourceSummary.sourcePolicyNames;
  const nonCandidateObservationCount = featureReport.observations.filter(
    (observation) => observation.status !== OBSERVATION_STATUS,
  ).length;

  if (
    sourcePolicyNames.length !== 1 ||
    sourcePolicyNames[0] !== SOURCE_POLICY_ID
  ) {
    issues.push({
      code: 'feature-report-source-policy-mismatch',
      message: 'Feature report source policy metadata does not match the profile-aware source policy.',
      details: {
        sourcePolicyNameCount: sourcePolicyNames.length,
        expectedSourcePolicyId: SOURCE_POLICY_ID,
        actualSourcePolicyNames: sourcePolicyNames.join(','),
      },
    });
  }

  if (featureReport.semanticStatus !== SEMANTIC_STATUS) {
    issues.push({
      code: 'feature-report-semantic-status-mismatch',
      message: 'Feature report unexpectedly changed semantic status.',
      details: {
        expectedSemanticStatus: SEMANTIC_STATUS,
        actualSemanticStatus: featureReport.semanticStatus,
      },
    });
  }

  if (nonCandidateObservationCount > 0) {
    issues.push({
      code: 'feature-report-observation-status-mismatch',
      message: 'Feature report produced observations outside report-candidate status.',
      details: {
        nonCandidateObservationCount,
      },
    });
  }

  if (featureReport.atlasSummary.chartCount <= 0) {
    issues.push({
      code: 'feature-report-empty-chart-count',
      message: 'Feature report atlas summary has no charts.',
    });
  }

  if (featureReport.atlasSummary.sampleCount <= 0) {
    issues.push({
      code: 'feature-report-empty-sample-count',
      message: 'Feature report atlas summary has no samples.',
    });
  }

  if (featureReport.sourceSummary.totalSources <= 0) {
    issues.push({
      code: 'feature-report-empty-source-count',
      message: 'Feature report source summary has no sources.',
    });
  }
}
