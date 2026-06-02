import type { FieldSourceEmissionParameters } from './fieldSourceProfiles';
import type {
  ProfileAwareFieldSourcePolicyDiagnosticReport,
  ProfileAwareSourceEntry,
} from './fieldSourceProfileAwarePolicy';

export type ProfileAwareAtlasExecutionStatus =
  | 'profile-aware-atlas-executed'
  | 'input-built-not-executed';

export interface ProfileAwareAtlasSourceEntry extends FieldSourceEmissionParameters {
  sourceId: string;
  vertexId: string;
  sourceKind: 'primal-assigned' | 'generated-child-derived';
  sourceEdgeId?: string;
  complementEdgeId?: string;
  antipodalChildVertexId?: string;
}

export type ProfileAwareAtlasAdapterIssueCode =
  | 'profile-aware-policy-report-not-ok'
  | 'missing-source-policy-id'
  | 'source-policy-id-mismatch'
  | 'policy-source-count-mismatch'
  | 'atlas-input-source-count-mismatch'
  | 'no-field-ready-sources'
  | 'non-finite-atlas-source-parameter'
  | 'fallback-source-included-as-field-ready'
  | 'unresolved-source-included-as-field-ready'
  | 'unexpected-field-atlas-integration'
  | 'field-atlas-execution-unavailable'
  | 'field-atlas-execution-failed'
  | 'unexpected-field-atlas-mutation'
  | 'unexpected-field-atlas-source-policy-mutation'
  | 'unexpected-shape-mutation'
  | 'unexpected-packet-write';

export interface ProfileAwareAtlasAdapterIssue {
  code: ProfileAwareAtlasAdapterIssueCode;
  message: string;
  sourceId?: string;
  vertexId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface ProfileAwareAtlasExecutionResult {
  sampleCount: number;
  featureSummary?: object;
}

export interface ProfileAwareAtlasAdapterReport {
  reportId: string;
  method: 'profile-aware-field-atlas-adapter-diagnostic-v0';
  diagnosticScope: 'profile-aware-field-atlas-adapter-only';
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  fieldAtlasMutationStatus: 'not-mutated';
  fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  policyRelativityStatus: 'policy-relative';
  profileSystemId?: string;
  profileSetupId?: string;
  childInheritanceGrammarId?: string;
  profileAwarePolicyOk: boolean;
  totalPolicySourceCount: number;
  fieldReadySourceCount: number;
  atlasInputSourceCount: number;
  primalAtlasSourceCount: number;
  childAtlasSourceCount: number;
  fallbackChildSourceCount: number;
  unresolvedChildSourceCount: number;
  degeneracyStatusCount: number;
  sameAsAntipodalCount: number;
  sameAsOtherChildCount: number;
  fieldAtlasExecutionStatus: ProfileAwareAtlasExecutionStatus;
  fieldAtlasExecutionReason?: string;
  fieldAtlasSampleCount?: number;
  fieldAtlasFeatureSummary?: object;
  contrastPolicyNote: 'old-policy-not-assumed-invariant';
  issueCount: number;
  ok: boolean;
  atlasSources: ProfileAwareAtlasSourceEntry[];
  issues: ProfileAwareAtlasAdapterIssue[];
}

export interface BuildProfileAwareAtlasAdapterReportArgs {
  profileAwarePolicyReport: ProfileAwareFieldSourcePolicyDiagnosticReport;
  executeAtlasInput?: (
    atlasSources: ProfileAwareAtlasSourceEntry[],
  ) => ProfileAwareAtlasExecutionResult;
}

const METHOD = 'profile-aware-field-atlas-adapter-diagnostic-v0';
const DIAGNOSTIC_SCOPE = 'profile-aware-field-atlas-adapter-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const FIELD_ATLAS_MUTATION_STATUS = 'not-mutated';
const FIELD_ATLAS_SOURCE_POLICY_MUTATION_STATUS = 'not-mutated';
const SHAPE_MUTATION_STATUS = 'not-shape-mutation';
const PACKET_WRITE_STATUS = 'not-packet-writing';
const CONTRAST_POLICY_NOTE = 'old-policy-not-assumed-invariant';
const INPUT_BUILT_NOT_EXECUTED_REASON =
  'Existing field atlas execution remains source-domain/Shape oriented; this diagnostic builds policy-relative atlas input only.';

export function buildProfileAwareAtlasAdapterReport(
  args: BuildProfileAwareAtlasAdapterReportArgs,
): ProfileAwareAtlasAdapterReport {
  const issues: ProfileAwareAtlasAdapterIssue[] = [];
  const policyReport = args.profileAwarePolicyReport;
  const actualSourceCounts = countPolicySources(policyReport.sources);
  const atlasSources = buildAtlasSources(policyReport.sources, issues);

  appendPolicyIssues(policyReport, issues);
  appendPolicySourceCountIssues(policyReport, actualSourceCounts, issues);
  appendAtlasInputSourceCountIssues(atlasSources, actualSourceCounts, issues);
  appendAtlasSourceIssues(atlasSources, issues);
  appendBoundaryIssues(policyReport, issues);

  let fieldAtlasExecutionStatus: ProfileAwareAtlasExecutionStatus =
    'input-built-not-executed';
  let fieldAtlasExecutionReason: string | undefined = INPUT_BUILT_NOT_EXECUTED_REASON;
  let fieldAtlasSampleCount: number | undefined;
  let fieldAtlasFeatureSummary: object | undefined;

  if (args.executeAtlasInput) {
    try {
      const executionResult = args.executeAtlasInput(atlasSources);

      fieldAtlasExecutionStatus = 'profile-aware-atlas-executed';
      fieldAtlasExecutionReason = undefined;
      fieldAtlasSampleCount = executionResult.sampleCount;
      fieldAtlasFeatureSummary = executionResult.featureSummary;
    } catch (error) {
      issues.push({
        code: 'field-atlas-execution-failed',
        message: 'Profile-aware atlas execution callback failed.',
        details: {
          reason: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:${policyReport.reportId}`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    sourcePolicyId: SOURCE_POLICY_ID,
    fieldAtlasMutationStatus: FIELD_ATLAS_MUTATION_STATUS,
    fieldAtlasSourcePolicyMutationStatus: FIELD_ATLAS_SOURCE_POLICY_MUTATION_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    policyRelativityStatus: 'policy-relative',
    ...(policyReport.profileSystemId ? { profileSystemId: policyReport.profileSystemId } : {}),
    ...(policyReport.profileSetupId ? { profileSetupId: policyReport.profileSetupId } : {}),
    ...(policyReport.childInheritanceGrammarId
      ? { childInheritanceGrammarId: policyReport.childInheritanceGrammarId }
      : {}),
    profileAwarePolicyOk: policyReport.ok,
    totalPolicySourceCount: actualSourceCounts.totalPolicySourceCount,
    fieldReadySourceCount: actualSourceCounts.fieldReadySourceCount,
    atlasInputSourceCount: atlasSources.length,
    primalAtlasSourceCount: atlasSources.filter(
      (source) => source.sourceKind === 'primal-assigned',
    ).length,
    childAtlasSourceCount: atlasSources.filter(
      (source) => source.sourceKind === 'generated-child-derived',
    ).length,
    fallbackChildSourceCount: actualSourceCounts.fallbackChildSourceCount,
    unresolvedChildSourceCount: actualSourceCounts.unresolvedChildSourceCount,
    degeneracyStatusCount: actualSourceCounts.degeneracyStatusCount,
    sameAsAntipodalCount: policyReport.sameAsAntipodalCount,
    sameAsOtherChildCount: policyReport.sameAsOtherChildCount,
    fieldAtlasExecutionStatus,
    ...(fieldAtlasExecutionReason ? { fieldAtlasExecutionReason } : {}),
    ...(fieldAtlasSampleCount !== undefined ? { fieldAtlasSampleCount } : {}),
    ...(fieldAtlasFeatureSummary ? { fieldAtlasFeatureSummary } : {}),
    contrastPolicyNote: CONTRAST_POLICY_NOTE,
    issueCount,
    ok: issueCount === 0,
    atlasSources,
    issues,
  };
}

interface ActualPolicySourceCounts {
  totalPolicySourceCount: number;
  fieldReadySourceCount: number;
  fallbackChildSourceCount: number;
  unresolvedChildSourceCount: number;
  degeneracyStatusCount: number;
  finiteFieldReadyAllowedAtlasSourceCount: number;
}

function countPolicySources(sources: ProfileAwareSourceEntry[]): ActualPolicySourceCounts {
  return {
    totalPolicySourceCount: sources.length,
    fieldReadySourceCount: sources.filter((source) => source.readiness === 'field-ready')
      .length,
    fallbackChildSourceCount: sources.filter(
      (source) => source.sourceKind === 'generated-child-fallback',
    ).length,
    unresolvedChildSourceCount: sources.filter(
      (source) => source.sourceKind === 'generated-child-unresolved',
    ).length,
    degeneracyStatusCount: sources.reduce(
      (sum, source) => sum + (source.degeneracyStatuses?.length ?? 0),
      0,
    ),
    finiteFieldReadyAllowedAtlasSourceCount: sources.filter(
      (source) =>
        source.readiness === 'field-ready' &&
        isAllowedAtlasSourceKind(source.sourceKind) &&
        Boolean(
          source.emissionParameters &&
            isFiniteEmissionParameters(source.emissionParameters),
        ),
    ).length,
  };
}

function buildAtlasSources(
  sources: ProfileAwareSourceEntry[],
  issues: ProfileAwareAtlasAdapterIssue[],
): ProfileAwareAtlasSourceEntry[] {
  const atlasSources: ProfileAwareAtlasSourceEntry[] = [];

  for (const source of sources) {
    if (source.readiness !== 'field-ready') {
      continue;
    }

    if (source.sourceKind === 'generated-child-fallback') {
      issues.push({
        code: 'fallback-source-included-as-field-ready',
        message: `Fallback source ${source.sourceId} is marked field-ready.`,
        sourceId: source.sourceId,
        vertexId: source.vertexId,
      });
      continue;
    }

    if (source.sourceKind === 'generated-child-unresolved') {
      issues.push({
        code: 'unresolved-source-included-as-field-ready',
        message: `Unresolved source ${source.sourceId} is marked field-ready.`,
        sourceId: source.sourceId,
        vertexId: source.vertexId,
      });
      continue;
    }

    if (!isAllowedAtlasSourceKind(source.sourceKind)) {
      continue;
    }

    if (
      !source.emissionParameters ||
      !isFiniteEmissionParameters(source.emissionParameters)
    ) {
      issues.push({
        code: 'non-finite-atlas-source-parameter',
        message: `Field-ready source ${source.sourceId} has missing or non-finite emission parameters.`,
        sourceId: source.sourceId,
        vertexId: source.vertexId,
      });
      continue;
    }

    atlasSources.push({
      sourceId: source.sourceId,
      vertexId: source.vertexId,
      sourceKind: source.sourceKind,
      amplitude: source.emissionParameters.amplitude,
      waveNumber: source.emissionParameters.waveNumber,
      phase: source.emissionParameters.phase,
      attenuation: source.emissionParameters.attenuation,
      ...(source.sourceEdgeId ? { sourceEdgeId: source.sourceEdgeId } : {}),
      ...(source.complementEdgeId ? { complementEdgeId: source.complementEdgeId } : {}),
      ...(source.antipodalChildVertexId
        ? { antipodalChildVertexId: source.antipodalChildVertexId }
        : {}),
    });
  }

  return atlasSources;
}

function isAllowedAtlasSourceKind(
  sourceKind: ProfileAwareSourceEntry['sourceKind'],
): sourceKind is ProfileAwareAtlasSourceEntry['sourceKind'] {
  return sourceKind === 'primal-assigned' || sourceKind === 'generated-child-derived';
}

function appendPolicyIssues(
  report: ProfileAwareFieldSourcePolicyDiagnosticReport,
  issues: ProfileAwareAtlasAdapterIssue[],
): void {
  if (!report.ok) {
    issues.push({
      code: 'profile-aware-policy-report-not-ok',
      message: 'Profile-aware source policy report is not ok.',
      details: {
        policyIssueCount: report.issueCount,
      },
    });
  }

  if (!report.sourcePolicyId) {
    issues.push({
      code: 'missing-source-policy-id',
      message: 'Profile-aware source policy report is missing sourcePolicyId.',
    });
  } else if (report.sourcePolicyId !== SOURCE_POLICY_ID) {
    issues.push({
      code: 'source-policy-id-mismatch',
      message: 'Profile-aware source policy report has an unexpected sourcePolicyId.',
      details: {
        expectedSourcePolicyId: SOURCE_POLICY_ID,
        actualSourcePolicyId: report.sourcePolicyId,
      },
    });
  }
}

function appendPolicySourceCountIssues(
  report: ProfileAwareFieldSourcePolicyDiagnosticReport,
  actualCounts: ActualPolicySourceCounts,
  issues: ProfileAwareAtlasAdapterIssue[],
): void {
  const mismatches = [
    report.totalSourceEntryCount !== actualCounts.totalPolicySourceCount,
    report.fieldReadySourceCount !== actualCounts.fieldReadySourceCount,
    report.fallbackChildSourceCount !== actualCounts.fallbackChildSourceCount,
    report.unresolvedChildSourceCount !== actualCounts.unresolvedChildSourceCount,
    report.degeneracyStatusCount !== actualCounts.degeneracyStatusCount,
  ];

  if (!mismatches.some(Boolean)) {
    return;
  }

  issues.push({
    code: 'policy-source-count-mismatch',
    message: 'Profile-aware policy source count metadata does not match source entries.',
    details: {
      reportedTotalPolicySourceCount: report.totalSourceEntryCount,
      actualTotalPolicySourceCount: actualCounts.totalPolicySourceCount,
      reportedFieldReadySourceCount: report.fieldReadySourceCount,
      actualFieldReadySourceCount: actualCounts.fieldReadySourceCount,
      reportedFallbackChildSourceCount: report.fallbackChildSourceCount,
      actualFallbackChildSourceCount: actualCounts.fallbackChildSourceCount,
      reportedUnresolvedChildSourceCount: report.unresolvedChildSourceCount,
      actualUnresolvedChildSourceCount: actualCounts.unresolvedChildSourceCount,
      reportedDegeneracyStatusCount: report.degeneracyStatusCount,
      actualDegeneracyStatusCount: actualCounts.degeneracyStatusCount,
    },
  });
}

function appendAtlasInputSourceCountIssues(
  atlasSources: ProfileAwareAtlasSourceEntry[],
  actualCounts: ActualPolicySourceCounts,
  issues: ProfileAwareAtlasAdapterIssue[],
): void {
  if (atlasSources.length === actualCounts.finiteFieldReadyAllowedAtlasSourceCount) {
    return;
  }

  issues.push({
    code: 'atlas-input-source-count-mismatch',
    message:
      'Profile-aware atlas input source count does not match finite field-ready allowed source entries.',
    details: {
      atlasInputSourceCount: atlasSources.length,
      finiteFieldReadyAllowedAtlasSourceCount:
        actualCounts.finiteFieldReadyAllowedAtlasSourceCount,
    },
  });
}

function appendAtlasSourceIssues(
  atlasSources: ProfileAwareAtlasSourceEntry[],
  issues: ProfileAwareAtlasAdapterIssue[],
): void {
  if (atlasSources.length === 0) {
    issues.push({
      code: 'no-field-ready-sources',
      message: 'Profile-aware atlas input has no field-ready finite sources.',
    });
  }
}

function appendBoundaryIssues(
  report: ProfileAwareFieldSourcePolicyDiagnosticReport,
  issues: ProfileAwareAtlasAdapterIssue[],
): void {
  if (report.fieldAtlasIntegrationStatus !== 'not-integrated') {
    issues.push({
      code: 'unexpected-field-atlas-integration',
      message: 'Profile-aware policy report unexpectedly claims field atlas integration.',
      details: {
        fieldAtlasIntegrationStatus: report.fieldAtlasIntegrationStatus,
      },
    });
  }

  if (FIELD_ATLAS_MUTATION_STATUS !== 'not-mutated') {
    issues.push({
      code: 'unexpected-field-atlas-mutation',
      message: 'Profile-aware atlas adapter unexpectedly claims field atlas mutation.',
    });
  }

  if (FIELD_ATLAS_SOURCE_POLICY_MUTATION_STATUS !== 'not-mutated') {
    issues.push({
      code: 'unexpected-field-atlas-source-policy-mutation',
      message:
        'Profile-aware atlas adapter unexpectedly claims field atlas source policy mutation.',
    });
  }

  if (SHAPE_MUTATION_STATUS !== 'not-shape-mutation') {
    issues.push({
      code: 'unexpected-shape-mutation',
      message: 'Profile-aware atlas adapter unexpectedly claims shape mutation.',
    });
  }

  if (PACKET_WRITE_STATUS !== 'not-packet-writing') {
    issues.push({
      code: 'unexpected-packet-write',
      message: 'Profile-aware atlas adapter unexpectedly claims packet writes.',
    });
  }

  if (report.shapeMutationStatus !== 'not-shape-mutation') {
    issues.push({
      code: 'unexpected-shape-mutation',
      message: 'Profile-aware policy report unexpectedly claims shape mutation.',
    });
  }

  if (report.packetWriteStatus !== 'not-packet-writing') {
    issues.push({
      code: 'unexpected-packet-write',
      message: 'Profile-aware policy report unexpectedly claims packet writes.',
    });
  }
}

function isFiniteEmissionParameters(parameters: FieldSourceEmissionParameters): boolean {
  return (
    Number.isFinite(parameters.amplitude) &&
    Number.isFinite(parameters.waveNumber) &&
    Number.isFinite(parameters.phase) &&
    Number.isFinite(parameters.attenuation)
  );
}
