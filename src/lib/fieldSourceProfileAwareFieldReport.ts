import type { ProfileAwareFieldSourcePolicyDiagnosticReport } from './fieldSourceProfileAwarePolicy';

export type ProfileAwareFieldReportIntegrationStatus =
  | 'diagnostic-envelope-only'
  | 'not-field-atlas-integration';

export type ProfileAwareFieldReportRelativityStatus =
  | 'policy-relative'
  | 'policy-missing'
  | 'policy-invalid';

export interface ProfileAwareWrappedFieldReportSummary {
  reportId: string;
  reportKind: string;
  sourcePolicyId?: string;
  fieldSourceCount?: number;
  generatedChildSourceCount?: number;
  fallbackCount?: number;
  unresolvedChildSourceCount?: number;
  degeneracyStatusCount?: number;
  notes?: string[];
}

export type ProfileAwareFieldReportEnvelopeIssueCode =
  | 'profile-aware-policy-report-not-ok'
  | 'missing-source-policy-id'
  | 'profile-aware-policy-id-mismatch'
  | 'missing-profile-system-id'
  | 'missing-profile-setup-id'
  | 'missing-child-inheritance-grammar-id'
  | 'missing-wrapped-field-report'
  | 'wrapped-field-report-policy-missing'
  | 'wrapped-field-report-policy-mismatch'
  | 'wrapped-field-report-source-count-mismatch'
  | 'wrapped-field-report-generated-child-count-mismatch'
  | 'wrapped-field-report-fallback-count-mismatch'
  | 'wrapped-field-report-unresolved-count-mismatch'
  | 'wrapped-field-report-degeneracy-count-mismatch'
  | 'wrapped-field-report-forbidden-integration-property'
  | 'unexpected-field-atlas-integration'
  | 'unexpected-field-atlas-mutation'
  | 'unexpected-field-atlas-source-policy-mutation';

export interface ProfileAwareFieldReportEnvelopeIssue {
  code: ProfileAwareFieldReportEnvelopeIssueCode;
  message: string;
  reportId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface ProfileAwareFieldReportDiagnosticEnvelope {
  reportId: string;
  method: 'profile-aware-field-report-envelope-diagnostic-v0';
  diagnosticScope: 'profile-aware-field-report-envelope-only';
  integrationStatus: 'diagnostic-envelope-only';
  fieldAtlasMutationStatus: 'not-mutated';
  fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
  fieldAtlasIntegrationStatus: 'not-field-atlas-integration';
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  profileSystemId?: string;
  profileSetupId?: string;
  childInheritanceGrammarId?: string;
  profileAwarePolicyOk: boolean;
  primalSourceCount: number;
  assignedPrimalSourceCount: number;
  childSourceCount: number;
  derivedChildSourceCount: number;
  fallbackChildSourceCount: number;
  unresolvedChildSourceCount: number;
  fieldReadySourceCount: number;
  degeneracyObservationCount: number;
  degeneracyStatusCount: number;
  sameAsAntipodalCount: number;
  sameAsOtherChildCount: number;
  fallbackCount: number;
  wrappedFieldReport: ProfileAwareWrappedFieldReportSummary;
  relativityStatus: ProfileAwareFieldReportRelativityStatus;
  issueCount: number;
  ok: boolean;
  issues: ProfileAwareFieldReportEnvelopeIssue[];
}

export interface BuildProfileAwareFieldReportDiagnosticEnvelopeArgs {
  profileAwarePolicyReport: ProfileAwareFieldSourcePolicyDiagnosticReport;
  wrappedFieldReport?: ProfileAwareWrappedFieldReportSummary | null;
}

const METHOD = 'profile-aware-field-report-envelope-diagnostic-v0';
const DIAGNOSTIC_SCOPE = 'profile-aware-field-report-envelope-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const INTEGRATION_STATUS = 'diagnostic-envelope-only';
const FIELD_ATLAS_MUTATION_STATUS = 'not-mutated';
const FIELD_ATLAS_SOURCE_POLICY_MUTATION_STATUS = 'not-mutated';
const FIELD_ATLAS_INTEGRATION_STATUS = 'not-field-atlas-integration';
const FORBIDDEN_WRAPPED_FIELD_REPORT_KEYS = [
  'fieldAtlasPolicy',
  'sourcePolicyFunction',
  'packetWrites',
] as const;

export function buildProfileAwareFieldReportDiagnosticEnvelope(
  args: BuildProfileAwareFieldReportDiagnosticEnvelopeArgs,
): ProfileAwareFieldReportDiagnosticEnvelope {
  const issues: ProfileAwareFieldReportEnvelopeIssue[] = [];
  const profileAwarePolicyReport = args.profileAwarePolicyReport;
  const wrappedFieldReport = copyWrappedFieldReport(args.wrappedFieldReport);
  const relativityStatus = getRelativityStatus(args.wrappedFieldReport);

  appendPolicyMetadataIssues(profileAwarePolicyReport, issues);
  appendWrappedFieldReportIssues(
    args.wrappedFieldReport,
    profileAwarePolicyReport,
    issues,
  );
  appendStatusIssues(issues);

  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:${profileAwarePolicyReport.reportId}:${wrappedFieldReport.reportId}`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    integrationStatus: INTEGRATION_STATUS,
    fieldAtlasMutationStatus: FIELD_ATLAS_MUTATION_STATUS,
    fieldAtlasSourcePolicyMutationStatus: FIELD_ATLAS_SOURCE_POLICY_MUTATION_STATUS,
    fieldAtlasIntegrationStatus: FIELD_ATLAS_INTEGRATION_STATUS,
    sourcePolicyId: SOURCE_POLICY_ID,
    ...(profileAwarePolicyReport.profileSystemId
      ? { profileSystemId: profileAwarePolicyReport.profileSystemId }
      : {}),
    ...(profileAwarePolicyReport.profileSetupId
      ? { profileSetupId: profileAwarePolicyReport.profileSetupId }
      : {}),
    ...(profileAwarePolicyReport.childInheritanceGrammarId
      ? { childInheritanceGrammarId: profileAwarePolicyReport.childInheritanceGrammarId }
      : {}),
    profileAwarePolicyOk: profileAwarePolicyReport.ok,
    primalSourceCount: profileAwarePolicyReport.primalSourceCount,
    assignedPrimalSourceCount: profileAwarePolicyReport.assignedPrimalSourceCount,
    childSourceCount: profileAwarePolicyReport.childSourceCount,
    derivedChildSourceCount: profileAwarePolicyReport.derivedChildSourceCount,
    fallbackChildSourceCount: profileAwarePolicyReport.fallbackChildSourceCount,
    unresolvedChildSourceCount: profileAwarePolicyReport.unresolvedChildSourceCount,
    fieldReadySourceCount: profileAwarePolicyReport.fieldReadySourceCount,
    degeneracyObservationCount: profileAwarePolicyReport.degeneracyObservationCount,
    degeneracyStatusCount: profileAwarePolicyReport.degeneracyStatusCount,
    sameAsAntipodalCount: profileAwarePolicyReport.sameAsAntipodalCount,
    sameAsOtherChildCount: profileAwarePolicyReport.sameAsOtherChildCount,
    fallbackCount: profileAwarePolicyReport.fallbackCount,
    wrappedFieldReport,
    relativityStatus,
    issueCount,
    ok: issueCount === 0,
    issues,
  };
}

function appendPolicyMetadataIssues(
  report: ProfileAwareFieldSourcePolicyDiagnosticReport,
  issues: ProfileAwareFieldReportEnvelopeIssue[],
): void {
  if (!report.ok) {
    issues.push({
      code: 'profile-aware-policy-report-not-ok',
      message: 'Profile-aware source policy report is not ok.',
      reportId: report.reportId,
      details: {
        policyIssueCount: report.issueCount,
      },
    });
  }

  if (!report.sourcePolicyId) {
    issues.push({
      code: 'missing-source-policy-id',
      message: 'Profile-aware source policy report is missing sourcePolicyId.',
      reportId: report.reportId,
    });
  } else if (report.sourcePolicyId !== SOURCE_POLICY_ID) {
    issues.push({
      code: 'profile-aware-policy-id-mismatch',
      message: 'Profile-aware source policy report has an unexpected sourcePolicyId.',
      reportId: report.reportId,
      details: {
        expectedSourcePolicyId: SOURCE_POLICY_ID,
        actualSourcePolicyId: report.sourcePolicyId,
      },
    });
  }

  if (!report.profileSystemId) {
    issues.push({
      code: 'missing-profile-system-id',
      message: 'Profile-aware source policy report is missing profileSystemId.',
      reportId: report.reportId,
    });
  }

  if (!report.profileSetupId) {
    issues.push({
      code: 'missing-profile-setup-id',
      message: 'Profile-aware source policy report is missing profileSetupId.',
      reportId: report.reportId,
    });
  }

  if (!report.childInheritanceGrammarId) {
    issues.push({
      code: 'missing-child-inheritance-grammar-id',
      message: 'Profile-aware source policy report is missing childInheritanceGrammarId.',
      reportId: report.reportId,
    });
  }
}

function appendWrappedFieldReportIssues(
  wrappedFieldReport: ProfileAwareWrappedFieldReportSummary | null | undefined,
  profileAwarePolicyReport: ProfileAwareFieldSourcePolicyDiagnosticReport,
  issues: ProfileAwareFieldReportEnvelopeIssue[],
): void {
  if (!wrappedFieldReport) {
    issues.push({
      code: 'missing-wrapped-field-report',
      message: 'Missing wrapped field report summary.',
    });
    return;
  }

  for (const forbiddenKey of FORBIDDEN_WRAPPED_FIELD_REPORT_KEYS) {
    if (Object.prototype.hasOwnProperty.call(wrappedFieldReport, forbiddenKey)) {
      issues.push({
        code: 'wrapped-field-report-forbidden-integration-property',
        message: `Wrapped field report ${wrappedFieldReport.reportId} exposes forbidden integration property ${forbiddenKey}.`,
        reportId: wrappedFieldReport.reportId,
        details: {
          forbiddenProperty: forbiddenKey,
        },
      });
    }
  }

  if (!wrappedFieldReport.sourcePolicyId) {
    issues.push({
      code: 'wrapped-field-report-policy-missing',
      message: `Wrapped field report ${wrappedFieldReport.reportId} is missing sourcePolicyId.`,
      reportId: wrappedFieldReport.reportId,
    });
  } else if (wrappedFieldReport.sourcePolicyId !== SOURCE_POLICY_ID) {
    issues.push({
      code: 'wrapped-field-report-policy-mismatch',
      message: `Wrapped field report ${wrappedFieldReport.reportId} sourcePolicyId does not match the profile-aware source policy.`,
      reportId: wrappedFieldReport.reportId,
      details: {
        expectedSourcePolicyId: SOURCE_POLICY_ID,
        actualSourcePolicyId: wrappedFieldReport.sourcePolicyId,
      },
    });
  }

  appendOptionalCountMismatchIssue({
    actual: wrappedFieldReport.fieldSourceCount,
    expected: profileAwarePolicyReport.fieldReadySourceCount,
    code: 'wrapped-field-report-source-count-mismatch',
    label: 'fieldSourceCount',
    reportId: wrappedFieldReport.reportId,
    issues,
  });
  appendOptionalCountMismatchIssue({
    actual: wrappedFieldReport.generatedChildSourceCount,
    expected: profileAwarePolicyReport.childSourceCount,
    code: 'wrapped-field-report-generated-child-count-mismatch',
    label: 'generatedChildSourceCount',
    reportId: wrappedFieldReport.reportId,
    issues,
  });
  appendOptionalCountMismatchIssue({
    actual: wrappedFieldReport.fallbackCount,
    expected: profileAwarePolicyReport.fallbackCount,
    code: 'wrapped-field-report-fallback-count-mismatch',
    label: 'fallbackCount',
    reportId: wrappedFieldReport.reportId,
    issues,
  });
  appendOptionalCountMismatchIssue({
    actual: wrappedFieldReport.unresolvedChildSourceCount,
    expected: profileAwarePolicyReport.unresolvedChildSourceCount,
    code: 'wrapped-field-report-unresolved-count-mismatch',
    label: 'unresolvedChildSourceCount',
    reportId: wrappedFieldReport.reportId,
    issues,
  });
  appendOptionalCountMismatchIssue({
    actual: wrappedFieldReport.degeneracyStatusCount,
    expected: profileAwarePolicyReport.degeneracyStatusCount,
    code: 'wrapped-field-report-degeneracy-count-mismatch',
    label: 'degeneracyStatusCount',
    reportId: wrappedFieldReport.reportId,
    issues,
  });
}

interface OptionalCountMismatchArgs {
  actual: number | undefined;
  expected: number;
  code: ProfileAwareFieldReportEnvelopeIssueCode;
  label: string;
  reportId: string;
  issues: ProfileAwareFieldReportEnvelopeIssue[];
}

function appendOptionalCountMismatchIssue(args: OptionalCountMismatchArgs): void {
  if (args.actual === undefined || args.actual === args.expected) {
    return;
  }

  args.issues.push({
    code: args.code,
    message: `Wrapped field report ${args.reportId} ${args.label} does not match the profile-aware source policy report.`,
    reportId: args.reportId,
    details: {
      expectedCount: args.expected,
      actualCount: args.actual,
    },
  });
}

function appendStatusIssues(issues: ProfileAwareFieldReportEnvelopeIssue[]): void {
  if (INTEGRATION_STATUS !== 'diagnostic-envelope-only') {
    issues.push({
      code: 'unexpected-field-atlas-integration',
      message: 'Profile-aware field report envelope unexpectedly claims real integration.',
    });
  }

  if (FIELD_ATLAS_INTEGRATION_STATUS !== 'not-field-atlas-integration') {
    issues.push({
      code: 'unexpected-field-atlas-integration',
      message: 'Profile-aware field report envelope unexpectedly claims field atlas integration.',
    });
  }

  if (FIELD_ATLAS_MUTATION_STATUS !== 'not-mutated') {
    issues.push({
      code: 'unexpected-field-atlas-mutation',
      message: 'Profile-aware field report envelope unexpectedly claims field atlas mutation.',
    });
  }

  if (FIELD_ATLAS_SOURCE_POLICY_MUTATION_STATUS !== 'not-mutated') {
    issues.push({
      code: 'unexpected-field-atlas-source-policy-mutation',
      message:
        'Profile-aware field report envelope unexpectedly claims field atlas source policy mutation.',
    });
  }
}

function getRelativityStatus(
  wrappedFieldReport: ProfileAwareWrappedFieldReportSummary | null | undefined,
): ProfileAwareFieldReportRelativityStatus {
  if (!wrappedFieldReport?.sourcePolicyId) {
    return 'policy-missing';
  }

  return wrappedFieldReport.sourcePolicyId === SOURCE_POLICY_ID
    ? 'policy-relative'
    : 'policy-invalid';
}

function copyWrappedFieldReport(
  wrappedFieldReport: ProfileAwareWrappedFieldReportSummary | null | undefined,
): ProfileAwareWrappedFieldReportSummary {
  if (!wrappedFieldReport) {
    return {
      reportId: 'missing-wrapped-field-report',
      reportKind: 'missing',
    };
  }

  const sanitized: ProfileAwareWrappedFieldReportSummary = {
    reportId: wrappedFieldReport.reportId,
    reportKind: wrappedFieldReport.reportKind,
  };

  if (wrappedFieldReport.sourcePolicyId !== undefined) {
    sanitized.sourcePolicyId = wrappedFieldReport.sourcePolicyId;
  }

  if (wrappedFieldReport.fieldSourceCount !== undefined) {
    sanitized.fieldSourceCount = wrappedFieldReport.fieldSourceCount;
  }

  if (wrappedFieldReport.generatedChildSourceCount !== undefined) {
    sanitized.generatedChildSourceCount = wrappedFieldReport.generatedChildSourceCount;
  }

  if (wrappedFieldReport.fallbackCount !== undefined) {
    sanitized.fallbackCount = wrappedFieldReport.fallbackCount;
  }

  if (wrappedFieldReport.unresolvedChildSourceCount !== undefined) {
    sanitized.unresolvedChildSourceCount = wrappedFieldReport.unresolvedChildSourceCount;
  }

  if (wrappedFieldReport.degeneracyStatusCount !== undefined) {
    sanitized.degeneracyStatusCount = wrappedFieldReport.degeneracyStatusCount;
  }

  if (wrappedFieldReport.notes !== undefined) {
    sanitized.notes = [...wrappedFieldReport.notes];
  }

  return sanitized;
}
