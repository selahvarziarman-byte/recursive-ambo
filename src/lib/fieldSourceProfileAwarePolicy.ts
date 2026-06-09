import type {
  FieldSourceEmissionParameters,
  FieldSourceProfileAssignmentDiagnosticReport,
} from './fieldSourceProfiles';
import type { TetrahedralAmboChildContext } from './fieldSourceChildContexts';
import type { FieldChildSourceProfileDerivationReport } from './fieldSourceChildDerivations';
import type {
  ChildProfileDegeneracyStatus,
  FieldSourceChildDegeneracyReport,
} from './fieldSourceChildDegeneracy';

export type ProfileAwareSourceKind =
  | 'primal-assigned'
  | 'generated-child-derived'
  | 'generated-child-fallback'
  | 'generated-child-unresolved';

export type ProfileAwareSourceReadiness =
  | 'field-ready'
  | 'fallback-not-field-ready'
  | 'unresolved-not-field-ready';

export type ProfileAwareFieldSourcePolicyId =
  | 'profile-aware-quark-child-inheritance-v0'
  | 'pythagorean-tetrachord-quark-proving-policy-v0';

export interface ProfileAwareSourceEntry {
  sourceId: string;
  vertexId: string;
  sourceKind: ProfileAwareSourceKind;
  readiness: ProfileAwareSourceReadiness;
  emissionParameters?: FieldSourceEmissionParameters;
  profileId?: string;
  profileSystemId?: string;
  assignmentMode?: 'manual' | 'default-proving-fixture';
  sourceEdgeId?: string;
  complementEdgeId?: string;
  antipodalChildVertexId?: string;
  childRole?: 'shared-90-pole';
  childLocalStatus?: string;
  fallbackKind?: string;
  fallbackReason?: string;
  degeneracyStatuses?: ChildProfileDegeneracyStatus[];
  sameAsAntipodalChildVertexIds?: string[];
  sameAsOtherChildVertexIds?: string[];
}

export type ProfileAwareFieldSourcePolicyIssueCode =
  | 'profile-assignment-report-not-ok'
  | 'missing-profile-system-id'
  | 'missing-profile-setup-id'
  | 'missing-child-inheritance-grammar-id'
  | 'missing-primal-source-entry'
  | 'duplicate-source-entry'
  | 'missing-child-context'
  | 'missing-child-derivation-report'
  | 'child-derivation-report-context-mismatch'
  | 'child-derivation-payload-context-mismatch'
  | 'child-derivation-report-not-in-contexts'
  | 'duplicate-child-derivation-report'
  | 'child-derivation-report-not-ok-without-fallback'
  | 'child-source-missing-derived-parameters-without-fallback'
  | 'child-degeneracy-report-not-ok'
  | 'child-degeneracy-observation-missing'
  | 'child-degeneracy-observation-context-mismatch'
  | 'child-degeneracy-observation-not-in-contexts'
  | 'duplicate-child-degeneracy-observation'
  | 'non-finite-source-emission-parameter'
  | 'source-count-mismatch'
  | 'unexpected-field-atlas-integration';

export interface ProfileAwareFieldSourcePolicyIssue {
  code: ProfileAwareFieldSourcePolicyIssueCode;
  message: string;
  sourceId?: string;
  vertexId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface ProfileAwareFieldSourcePolicyDiagnosticReport {
  reportId: string;
  method: 'profile-aware-field-source-policy-diagnostic-v0';
  diagnosticScope: 'profile-aware-source-policy-diagnostic-only';
  sourcePolicyId: ProfileAwareFieldSourcePolicyId;
  fieldAtlasIntegrationStatus: 'not-integrated';
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  profileSystemId?: string;
  profileSetupId?: string;
  childInheritanceGrammarId?: string;
  primalSourceCount: number;
  assignedPrimalSourceCount: number;
  childContextCount: number;
  childSourceCount: number;
  derivedChildSourceCount: number;
  fallbackChildSourceCount: number;
  unresolvedChildSourceCount: number;
  fieldReadySourceCount: number;
  totalSourceEntryCount: number;
  degeneracyObservationCount: number;
  degeneracyStatusCount: number;
  sameAsAntipodalCount: number;
  sameAsOtherChildCount: number;
  fallbackCount: number;
  issueCount: number;
  ok: boolean;
  sources: ProfileAwareSourceEntry[];
  issues: ProfileAwareFieldSourcePolicyIssue[];
}

export interface BuildProfileAwareFieldSourcePolicyDiagnosticReportArgs {
  profileAssignmentReport: FieldSourceProfileAssignmentDiagnosticReport;
  childContexts: TetrahedralAmboChildContext[];
  childDerivationReports: FieldChildSourceProfileDerivationReport[];
  childDegeneracyReport: FieldSourceChildDegeneracyReport;
}

const EXPECTED_TETRAHEDRAL_CHILD_CONTEXT_COUNT = 6;
const METHOD = 'profile-aware-field-source-policy-diagnostic-v0';
const DIAGNOSTIC_SCOPE = 'profile-aware-source-policy-diagnostic-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const FIELD_ATLAS_INTEGRATION_STATUS = 'not-integrated';
const SHAPE_MUTATION_STATUS = 'not-shape-mutation';
const PACKET_WRITE_STATUS = 'not-packet-writing';

export function buildProfileAwareFieldSourcePolicyDiagnosticReport(
  args: BuildProfileAwareFieldSourcePolicyDiagnosticReportArgs,
): ProfileAwareFieldSourcePolicyDiagnosticReport {
  const issues: ProfileAwareFieldSourcePolicyIssue[] = [];
  const profileAssignmentReport = args.profileAssignmentReport;
  const childContexts = args.childContexts.map(cloneChildContext);
  const childContextByVertexId = new Map(
    childContexts.map((context) => [context.childVertexId, context]),
  );
  const childDerivationReportByVertexId = firstByChildVertexId(
    args.childDerivationReports,
  );
  const degeneracyObservationByChildVertexId = firstByChildVertexId(
    args.childDegeneracyReport.observations,
  );
  const sources: ProfileAwareSourceEntry[] = [];

  appendProfileAssignmentIssues(profileAssignmentReport, issues);
  appendChildContextIssues(childContexts, issues);
  appendChildDerivationReportCollectionIssues(
    args.childDerivationReports,
    childContextByVertexId,
    issues,
  );
  appendChildDegeneracyObservationCollectionIssues(
    args.childDegeneracyReport.observations,
    childContextByVertexId,
    issues,
  );

  if (!args.childDegeneracyReport.ok) {
    issues.push({
      code: 'child-degeneracy-report-not-ok',
      message: 'Child degeneracy report is not ok.',
      details: {
        degeneracyIssueCount: args.childDegeneracyReport.issueCount,
      },
    });
  }

  for (const assignedSource of profileAssignmentReport.assignedSources) {
    sources.push({
      sourceId: assignedSource.sourceId,
      vertexId: assignedSource.vertexId,
      sourceKind: 'primal-assigned',
      readiness: 'field-ready',
      emissionParameters: copyEmissionParameters(assignedSource),
      profileId: assignedSource.profileId,
      profileSystemId: assignedSource.profileSystemId,
      assignmentMode: assignedSource.assignmentMode,
    });
  }

  for (const vertexId of profileAssignmentReport.activePrimalVertexIds) {
    const hasAssignedSource = profileAssignmentReport.assignedSources.some(
      (assignedSource) => assignedSource.vertexId === vertexId,
    );

    if (!hasAssignedSource) {
      issues.push({
        code: 'missing-primal-source-entry',
        message: `Active primal vertex ${vertexId} has no profile-aware source entry.`,
        vertexId,
      });
    }
  }

  for (const childContext of childContexts) {
    const derivationReport = childDerivationReportByVertexId.get(childContext.childVertexId);
    const degeneracyObservation = degeneracyObservationByChildVertexId.get(
      childContext.childVertexId,
    );
    let derivationReportMatchesContext = false;
    let degeneracyObservationMatchesContext = false;

    if (!derivationReport) {
      issues.push({
        code: 'missing-child-derivation-report',
        message: `Missing child derivation report for ${childContext.childVertexId}.`,
        vertexId: childContext.childVertexId,
      });
    } else {
      derivationReportMatchesContext = appendChildDerivationReportContextIssues(
        childContext,
        derivationReport,
        issues,
      );
    }

    if (!degeneracyObservation) {
      issues.push({
        code: 'child-degeneracy-observation-missing',
        message: `Missing child degeneracy observation for ${childContext.childVertexId}.`,
        vertexId: childContext.childVertexId,
      });
    } else {
      degeneracyObservationMatchesContext = appendChildDegeneracyObservationContextIssues(
        childContext,
        degeneracyObservation,
        issues,
      );
    }

    sources.push(
      buildChildSourceEntry({
        childContext,
        derivationReport,
        derivationReportMatchesContext,
        degeneracyObservation: degeneracyObservationMatchesContext
          ? degeneracyObservation
          : undefined,
        issues,
      }),
    );
  }

  appendSourceIntegrityIssues(sources, issues);

  const assignedPrimalSourceCount = sources.filter(
    (source) => source.sourceKind === 'primal-assigned',
  ).length;
  const childSourceCount = sources.filter((source) =>
    source.sourceKind.startsWith('generated-child-'),
  ).length;
  const derivedChildSourceCount = sources.filter(
    (source) => source.sourceKind === 'generated-child-derived',
  ).length;
  const fallbackChildSourceCount = sources.filter(
    (source) => source.sourceKind === 'generated-child-fallback',
  ).length;
  const unresolvedChildSourceCount = sources.filter(
    (source) => source.sourceKind === 'generated-child-unresolved',
  ).length;
  const fieldReadySourceCount = sources.filter(
    (source) => source.readiness === 'field-ready',
  ).length;
  const degeneracyStatusCount = sources.reduce(
    (sum, source) => sum + (source.degeneracyStatuses?.length ?? 0),
    0,
  );
  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:${profileAssignmentReport.setupId ?? 'missing-setup'}:${
      childContexts.length
    }`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    sourcePolicyId: SOURCE_POLICY_ID,
    fieldAtlasIntegrationStatus: FIELD_ATLAS_INTEGRATION_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    ...(profileAssignmentReport.profileSystemId
      ? { profileSystemId: profileAssignmentReport.profileSystemId }
      : {}),
    ...(profileAssignmentReport.setupId
      ? { profileSetupId: profileAssignmentReport.setupId }
      : {}),
    ...(profileAssignmentReport.childInheritanceGrammarId
      ? { childInheritanceGrammarId: profileAssignmentReport.childInheritanceGrammarId }
      : {}),
    primalSourceCount: profileAssignmentReport.activePrimalVertexCount,
    assignedPrimalSourceCount,
    childContextCount: childContexts.length,
    childSourceCount,
    derivedChildSourceCount,
    fallbackChildSourceCount,
    unresolvedChildSourceCount,
    fieldReadySourceCount,
    totalSourceEntryCount: sources.length,
    degeneracyObservationCount: args.childDegeneracyReport.observations.length,
    degeneracyStatusCount,
    sameAsAntipodalCount: args.childDegeneracyReport.sameAsAntipodalCount,
    sameAsOtherChildCount: args.childDegeneracyReport.sameAsOtherChildCount,
    fallbackCount: fallbackChildSourceCount,
    issueCount,
    ok: issueCount === 0,
    sources,
    issues,
  };
}

interface BuildChildSourceEntryArgs {
  childContext: TetrahedralAmboChildContext;
  derivationReport: FieldChildSourceProfileDerivationReport | undefined;
  derivationReportMatchesContext: boolean;
  degeneracyObservation:
    | FieldSourceChildDegeneracyReport['observations'][number]
    | undefined;
  issues: ProfileAwareFieldSourcePolicyIssue[];
}

function buildChildSourceEntry(args: BuildChildSourceEntryArgs): ProfileAwareSourceEntry {
  const {
    childContext,
    derivationReport,
    derivationReportMatchesContext,
    degeneracyObservation,
    issues,
  } = args;
  const derivedParameters = derivationReportMatchesContext
    ? derivationReport?.derivation?.derivedParameters
    : undefined;
  const hasExplicitFallback = Boolean(
    derivationReport &&
      (derivationReport.fallbackCount > 0 ||
        derivationReport.derivation?.localStatus === 'fallback-used' ||
        derivationReport.derivation?.localStatus === 'undefined-circular-mean' ||
        derivationReport.issues.some((issue) => issue.code === 'fallback-used')),
  );
  const childLocalStatus =
    derivationReportMatchesContext || hasExplicitFallback
      ? derivationReport?.derivation?.localStatus
      : undefined;
  const fallback = hasExplicitFallback ? derivationReport?.derivation?.fallback : undefined;
  let sourceKind: ProfileAwareSourceKind = 'generated-child-unresolved';
  let readiness: ProfileAwareSourceReadiness = 'unresolved-not-field-ready';

  if (derivedParameters) {
    sourceKind = 'generated-child-derived';
    readiness = 'field-ready';
  } else if (hasExplicitFallback) {
    sourceKind = 'generated-child-fallback';
    readiness = 'fallback-not-field-ready';
  } else if (derivationReport && derivationReportMatchesContext) {
    issues.push({
      code: 'child-source-missing-derived-parameters-without-fallback',
      message: `Child source ${childContext.childVertexId} has no derived parameters and no explicit fallback.`,
      vertexId: childContext.childVertexId,
    });
  }

  if (
    derivationReport &&
    derivationReportMatchesContext &&
    !derivationReport.ok &&
    !hasExplicitFallback
  ) {
    issues.push({
      code: 'child-derivation-report-not-ok-without-fallback',
      message: `Child derivation report ${childContext.childVertexId} is not ok and has no explicit fallback.`,
      vertexId: childContext.childVertexId,
      details: {
        derivationIssueCount: derivationReport.issueCount,
      },
    });
  }

  return {
    sourceId: `profile-aware-child-source:${childContext.childVertexId}`,
    vertexId: childContext.childVertexId,
    sourceKind,
    readiness,
    ...(derivedParameters ? { emissionParameters: { ...derivedParameters } } : {}),
    sourceEdgeId: childContext.sourceEdgeId,
    complementEdgeId: childContext.complementEdgeId,
    antipodalChildVertexId: childContext.antipodalChildVertexId,
    childRole: childContext.childRole,
    ...(childLocalStatus ? { childLocalStatus } : {}),
    ...(fallback
      ? {
          fallbackKind: fallback.fallbackKind,
          fallbackReason: fallback.reason,
        }
      : {}),
    ...(degeneracyObservation
      ? {
          degeneracyStatuses: [...degeneracyObservation.statuses],
          sameAsAntipodalChildVertexIds: [
            ...degeneracyObservation.sameAsAntipodalChildVertexIds,
          ],
          sameAsOtherChildVertexIds: [
            ...degeneracyObservation.sameAsOtherChildVertexIds,
          ],
        }
      : {}),
  };
}

function appendProfileAssignmentIssues(
  report: FieldSourceProfileAssignmentDiagnosticReport,
  issues: ProfileAwareFieldSourcePolicyIssue[],
): void {
  if (!report.ok) {
    issues.push({
      code: 'profile-assignment-report-not-ok',
      message: 'Profile assignment report is not ok.',
      details: {
        profileAssignmentIssueCount: report.issueCount,
      },
    });
  }

  if (!report.profileSystemId) {
    issues.push({
      code: 'missing-profile-system-id',
      message: 'Profile assignment report is missing profileSystemId.',
    });
  }

  if (!report.setupId) {
    issues.push({
      code: 'missing-profile-setup-id',
      message: 'Profile assignment report is missing setupId.',
    });
  }

  if (!report.childInheritanceGrammarId) {
    issues.push({
      code: 'missing-child-inheritance-grammar-id',
      message: 'Profile assignment report is missing childInheritanceGrammarId.',
    });
  }
}

function appendChildContextIssues(
  childContexts: TetrahedralAmboChildContext[],
  issues: ProfileAwareFieldSourcePolicyIssue[],
): void {
  const childVertexIds = childContexts.map((context) => context.childVertexId);
  const uniqueChildVertexIdCount = new Set(childVertexIds).size;

  if (
    childContexts.length !== EXPECTED_TETRAHEDRAL_CHILD_CONTEXT_COUNT ||
    uniqueChildVertexIdCount !== EXPECTED_TETRAHEDRAL_CHILD_CONTEXT_COUNT
  ) {
    issues.push({
      code: 'missing-child-context',
      message: `Expected six unique child contexts, got ${childContexts.length} contexts and ${uniqueChildVertexIdCount} unique child ids.`,
      details: {
        expectedChildContextCount: EXPECTED_TETRAHEDRAL_CHILD_CONTEXT_COUNT,
        childContextCount: childContexts.length,
        uniqueChildContextCount: uniqueChildVertexIdCount,
      },
    });
  }
}

function appendChildDerivationReportCollectionIssues(
  reports: FieldChildSourceProfileDerivationReport[],
  childContextByVertexId: Map<string, TetrahedralAmboChildContext>,
  issues: ProfileAwareFieldSourcePolicyIssue[],
): void {
  const countsByChildVertexId = countByChildVertexId(reports);

  for (const [childVertexId, count] of countsByChildVertexId) {
    if (count > 1) {
      issues.push({
        code: 'duplicate-child-derivation-report',
        message: `Child derivation report ${childVertexId} appears more than once.`,
        vertexId: childVertexId,
        details: {
          reportCount: count,
        },
      });
    }
  }

  for (const report of reports) {
    if (!childContextByVertexId.has(report.childVertexId)) {
      issues.push({
        code: 'child-derivation-report-not-in-contexts',
        message: `Child derivation report ${report.childVertexId} is not in the active child contexts.`,
        vertexId: report.childVertexId,
      });
    }
  }
}

function appendChildDegeneracyObservationCollectionIssues(
  observations: FieldSourceChildDegeneracyReport['observations'],
  childContextByVertexId: Map<string, TetrahedralAmboChildContext>,
  issues: ProfileAwareFieldSourcePolicyIssue[],
): void {
  const countsByChildVertexId = countByChildVertexId(observations);

  for (const [childVertexId, count] of countsByChildVertexId) {
    if (count > 1) {
      issues.push({
        code: 'duplicate-child-degeneracy-observation',
        message: `Child degeneracy observation ${childVertexId} appears more than once.`,
        vertexId: childVertexId,
        details: {
          observationCount: count,
        },
      });
    }
  }

  for (const observation of observations) {
    if (!childContextByVertexId.has(observation.childVertexId)) {
      issues.push({
        code: 'child-degeneracy-observation-not-in-contexts',
        message: `Child degeneracy observation ${observation.childVertexId} is not in the active child contexts.`,
        vertexId: observation.childVertexId,
      });
    }
  }
}

function appendChildDerivationReportContextIssues(
  childContext: TetrahedralAmboChildContext,
  report: FieldChildSourceProfileDerivationReport,
  issues: ProfileAwareFieldSourcePolicyIssue[],
): boolean {
  const reportMatchesContext =
    report.childVertexId === childContext.childVertexId &&
    report.sourceEdgeId === childContext.sourceEdgeId &&
    report.complementEdgeId === childContext.complementEdgeId &&
    report.antipodalChildVertexId === childContext.antipodalChildVertexId;
  const derivation = report.derivation;
  const payloadMatchesContext =
    !derivation ||
    (derivation.childVertexId === childContext.childVertexId &&
      derivation.sourceEdgeId === childContext.sourceEdgeId &&
      derivation.complementEdgeId === childContext.complementEdgeId &&
      derivation.antipodalChildVertexId === childContext.antipodalChildVertexId &&
      sameUnorderedPair(
        derivation.sourceEdgeVertexIds,
        childContext.sourceEdgeVertexIds,
      ) &&
      sameUnorderedPair(
        derivation.complementEdgeVertexIds,
        childContext.complementEdgeVertexIds,
      ) &&
      sameUnorderedPair(derivation.projectionVertexIds, childContext.projectionVertexIds));

  if (!reportMatchesContext) {
    issues.push({
      code: 'child-derivation-report-context-mismatch',
      message: `Child derivation report ${report.childVertexId} does not match active child context ${childContext.childVertexId}.`,
      vertexId: childContext.childVertexId,
      details: {
        expectedChildVertexId: childContext.childVertexId,
        actualChildVertexId: report.childVertexId,
        expectedSourceEdgeId: childContext.sourceEdgeId,
        actualSourceEdgeId: report.sourceEdgeId,
        expectedComplementEdgeId: childContext.complementEdgeId,
        actualComplementEdgeId: report.complementEdgeId,
        expectedAntipodalChildVertexId: childContext.antipodalChildVertexId,
        actualAntipodalChildVertexId: report.antipodalChildVertexId,
      },
    });
  }

  if (!payloadMatchesContext && derivation) {
    issues.push({
      code: 'child-derivation-payload-context-mismatch',
      message: `Child derivation payload ${derivation.childVertexId} does not match active child context ${childContext.childVertexId}.`,
      vertexId: childContext.childVertexId,
      details: {
        expectedChildVertexId: childContext.childVertexId,
        actualChildVertexId: derivation.childVertexId,
        expectedSourceEdgeId: childContext.sourceEdgeId,
        actualSourceEdgeId: derivation.sourceEdgeId,
        expectedComplementEdgeId: childContext.complementEdgeId,
        actualComplementEdgeId: derivation.complementEdgeId,
        expectedAntipodalChildVertexId: childContext.antipodalChildVertexId,
        actualAntipodalChildVertexId: derivation.antipodalChildVertexId,
        expectedSourceEdgeVertexIds: formatPair(childContext.sourceEdgeVertexIds),
        actualSourceEdgeVertexIds: formatPair(derivation.sourceEdgeVertexIds),
        expectedComplementEdgeVertexIds: formatPair(
          childContext.complementEdgeVertexIds,
        ),
        actualComplementEdgeVertexIds: formatPair(derivation.complementEdgeVertexIds),
        expectedProjectionVertexIds: formatPair(childContext.projectionVertexIds),
        actualProjectionVertexIds: formatPair(derivation.projectionVertexIds),
      },
    });
  }

  return reportMatchesContext && payloadMatchesContext;
}

function appendChildDegeneracyObservationContextIssues(
  childContext: TetrahedralAmboChildContext,
  observation: FieldSourceChildDegeneracyReport['observations'][number],
  issues: ProfileAwareFieldSourcePolicyIssue[],
): boolean {
  const observationMatchesContext =
    observation.childVertexId === childContext.childVertexId &&
    observation.sourceEdgeId === childContext.sourceEdgeId &&
    observation.complementEdgeId === childContext.complementEdgeId &&
    observation.antipodalChildVertexId === childContext.antipodalChildVertexId;

  if (!observationMatchesContext) {
    issues.push({
      code: 'child-degeneracy-observation-context-mismatch',
      message: `Child degeneracy observation ${observation.childVertexId} does not match active child context ${childContext.childVertexId}.`,
      vertexId: childContext.childVertexId,
      details: {
        expectedChildVertexId: childContext.childVertexId,
        actualChildVertexId: observation.childVertexId,
        expectedSourceEdgeId: childContext.sourceEdgeId,
        actualSourceEdgeId: observation.sourceEdgeId,
        expectedComplementEdgeId: childContext.complementEdgeId,
        actualComplementEdgeId: observation.complementEdgeId,
        expectedAntipodalChildVertexId: childContext.antipodalChildVertexId,
        actualAntipodalChildVertexId: observation.antipodalChildVertexId,
      },
    });
  }

  return observationMatchesContext;
}

function appendSourceIntegrityIssues(
  sources: ProfileAwareSourceEntry[],
  issues: ProfileAwareFieldSourcePolicyIssue[],
): void {
  const duplicateSourceIds = collectDuplicateIds(sources.map((source) => source.sourceId));

  for (const sourceId of duplicateSourceIds) {
    issues.push({
      code: 'duplicate-source-entry',
      message: `Source entry ${sourceId} appears more than once.`,
      sourceId,
    });
  }

  for (const source of sources) {
    if (source.readiness !== 'field-ready') {
      continue;
    }

    if (!source.emissionParameters || !isFiniteEmissionParameters(source.emissionParameters)) {
      issues.push({
        code: 'non-finite-source-emission-parameter',
        message: `Field-ready source ${source.sourceId} has missing or non-finite emission parameters.`,
        sourceId: source.sourceId,
        vertexId: source.vertexId,
      });
    }
  }

  if (FIELD_ATLAS_INTEGRATION_STATUS !== 'not-integrated') {
    issues.push({
      code: 'unexpected-field-atlas-integration',
      message: 'Profile-aware policy diagnostic unexpectedly reports field atlas integration.',
    });
  }

  const assignedPrimalSourceCount = sources.filter(
    (source) => source.sourceKind === 'primal-assigned',
  ).length;
  const childSourceCount = sources.filter((source) =>
    source.sourceKind.startsWith('generated-child-'),
  ).length;

  if (sources.length !== assignedPrimalSourceCount + childSourceCount) {
    issues.push({
      code: 'source-count-mismatch',
      message: 'Profile-aware source entry count does not match primal plus child source counts.',
      details: {
        totalSourceEntryCount: sources.length,
        assignedPrimalSourceCount,
        childSourceCount,
      },
    });
  }
}

function copyEmissionParameters(
  source: FieldSourceEmissionParameters,
): FieldSourceEmissionParameters {
  return {
    amplitude: source.amplitude,
    waveNumber: source.waveNumber,
    phase: source.phase,
    attenuation: source.attenuation,
  };
}

function isFiniteEmissionParameters(parameters: FieldSourceEmissionParameters): boolean {
  return (
    Number.isFinite(parameters.amplitude) &&
    Number.isFinite(parameters.waveNumber) &&
    Number.isFinite(parameters.phase) &&
    Number.isFinite(parameters.attenuation)
  );
}

function cloneChildContext(context: TetrahedralAmboChildContext): TetrahedralAmboChildContext {
  return {
    ...context,
    sourceEdgeVertexIds: [...context.sourceEdgeVertexIds],
    complementEdgeVertexIds: [...context.complementEdgeVertexIds],
    projectionVertexIds: [...context.projectionVertexIds],
  };
}

function firstByChildVertexId<T extends { childVertexId: string }>(items: T[]): Map<string, T> {
  const itemsByChildVertexId = new Map<string, T>();

  for (const item of items) {
    if (!itemsByChildVertexId.has(item.childVertexId)) {
      itemsByChildVertexId.set(item.childVertexId, item);
    }
  }

  return itemsByChildVertexId;
}

function countByChildVertexId<T extends { childVertexId: string }>(
  items: T[],
): Map<string, number> {
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item.childVertexId, (counts.get(item.childVertexId) ?? 0) + 1);
  }

  return counts;
}

function sameUnorderedPair(
  first: readonly string[] | undefined,
  second: readonly string[] | undefined,
): boolean {
  if (!first || !second || first.length !== 2 || second.length !== 2) {
    return false;
  }

  return (
    (first[0] === second[0] && first[1] === second[1]) ||
    (first[0] === second[1] && first[1] === second[0])
  );
}

function formatPair(pair: readonly string[] | undefined): string {
  return pair ? pair.join('|') : 'missing';
}

function collectDuplicateIds(ids: string[]): string[] {
  const counts = new Map<string, number>();

  for (const id of ids) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  return Array.from(counts)
    .filter(([, count]) => count > 1)
    .map(([id]) => id);
}
