import type { FieldSourceEmissionParameters } from './fieldSourceProfiles';
import type { TetrahedralAmboChildContext } from './fieldSourceChildContexts';
import type { FieldChildSourceProfileDerivationReport } from './fieldSourceChildDerivations';

export type ChildProfileDegeneracyStatus =
  | 'nondegenerate'
  | 'same-as-antipodal'
  | 'same-as-other-child'
  | 'phase-cancellation'
  | 'undefined-circular-mean'
  | 'fallback-used';

export type DegeneracyRelationKind = 'antipodal' | 'non-antipodal';

export interface ChildEmissionTupleComparison {
  firstChildVertexId: string;
  secondChildVertexId: string;
  relationKind: DegeneracyRelationKind;
  sameTuple: boolean;
  amplitudeDelta: number;
  waveNumberDelta: number;
  phaseDelta: number;
  attenuationDelta: number;
}

export interface ChildDegeneracyObservation {
  childVertexId: string;
  sourceEdgeId: string;
  complementEdgeId: string;
  antipodalChildVertexId: string;
  hasDerivedParameters: boolean;
  statuses: ChildProfileDegeneracyStatus[];
  sameAsAntipodalChildVertexIds: string[];
  sameAsOtherChildVertexIds: string[];
}

export type FieldSourceChildDegeneracyIssueCode =
  | 'missing-child-derivation-report'
  | 'invalid-child-derivation-count'
  | 'duplicate-child-derivation-report'
  | 'child-derivation-report-context-mismatch'
  | 'child-derivation-payload-context-mismatch'
  | 'child-derivation-report-not-in-contexts'
  | 'missing-antipodal-child-derivation'
  | 'missing-derived-parameters'
  | 'channel-structure-erased'
  | 'non-finite-derived-parameter';

export interface FieldSourceChildDegeneracyIssue {
  code: FieldSourceChildDegeneracyIssueCode;
  message: string;
  childVertexId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface FieldSourceChildDegeneracyReport {
  reportId: string;
  method: 'tetrahedral-child-profile-degeneracy-diagnostic-v0';
  diagnosticScope: 'pairwise-child-profile-degeneracy-only';
  childCount: number;
  expectedChildCount: 6;
  derivedChildCount: number;
  fallbackChildCount: number;
  undefinedCircularMeanChildCount: number;
  phaseCancellationChildCount: number;
  sameAsAntipodalCount: number;
  sameAsOtherChildCount: number;
  comparisonCount: number;
  antipodalPairCount: number;
  issueCount: number;
  ok: boolean;
  observations: ChildDegeneracyObservation[];
  comparisons: ChildEmissionTupleComparison[];
  issues: FieldSourceChildDegeneracyIssue[];
}

export interface BuildTetrahedralChildProfileDegeneracyReportArgs {
  childContexts: TetrahedralAmboChildContext[];
  derivationReports: FieldChildSourceProfileDerivationReport[];
  epsilon?: number;
}

const TWO_PI = 2 * Math.PI;
const DEFAULT_EPSILON = 1e-12;
const EXPECTED_TETRAHEDRAL_CHILD_COUNT = 6;
const METHOD = 'tetrahedral-child-profile-degeneracy-diagnostic-v0';
const DIAGNOSTIC_SCOPE = 'pairwise-child-profile-degeneracy-only';
const STATUS_ORDER: ChildProfileDegeneracyStatus[] = [
  'fallback-used',
  'undefined-circular-mean',
  'phase-cancellation',
  'same-as-antipodal',
  'same-as-other-child',
  'nondegenerate',
];

export function normalizePhaseRadians(phase: number): number {
  if (!Number.isFinite(phase)) {
    return phase;
  }

  const normalized = phase % TWO_PI;
  const positive = normalized < 0 ? normalized + TWO_PI : normalized;

  return Object.is(positive, -0) ? 0 : positive;
}

export function circularDistanceRadians(left: number, right: number): number {
  const normalizedLeft = normalizePhaseRadians(left);
  const normalizedRight = normalizePhaseRadians(right);
  const delta = Math.abs(normalizedLeft - normalizedRight);

  return Math.min(delta, TWO_PI - delta);
}

export function compareEmissionTuples(
  firstChildVertexId: string,
  secondChildVertexId: string,
  relationKind: DegeneracyRelationKind,
  left: FieldSourceEmissionParameters,
  right: FieldSourceEmissionParameters,
  epsilon = DEFAULT_EPSILON,
): ChildEmissionTupleComparison {
  const amplitudeDelta = Math.abs(left.amplitude - right.amplitude);
  const waveNumberDelta = Math.abs(left.waveNumber - right.waveNumber);
  const phaseDelta = circularDistanceRadians(left.phase, right.phase);
  const attenuationDelta = Math.abs(left.attenuation - right.attenuation);

  return {
    firstChildVertexId,
    secondChildVertexId,
    relationKind,
    sameTuple:
      amplitudeDelta <= epsilon &&
      waveNumberDelta <= epsilon &&
      phaseDelta <= epsilon &&
      attenuationDelta <= epsilon,
    amplitudeDelta,
    waveNumberDelta,
    phaseDelta,
    attenuationDelta,
  };
}

export function buildTetrahedralChildProfileDegeneracyReport(
  args: BuildTetrahedralChildProfileDegeneracyReportArgs,
): FieldSourceChildDegeneracyReport {
  const epsilon = args.epsilon ?? DEFAULT_EPSILON;
  const childContexts = args.childContexts.map(cloneChildContext);
  const derivationReports = args.derivationReports;
  const issues: FieldSourceChildDegeneracyIssue[] = [];
  const contextByChildVertexId = new Map(
    childContexts.map((context) => [context.childVertexId, context]),
  );
  const duplicateContextIds = collectDuplicateIds(
    childContexts.map((context) => context.childVertexId),
  );
  const reportChildVertexIds = derivationReports.map((report) => report.childVertexId);
  const duplicateReportChildVertexIds = collectDuplicateIds(reportChildVertexIds);
  const reportsByChildVertexId = new Map<string, FieldChildSourceProfileDerivationReport>();

  for (const report of derivationReports) {
    if (!reportsByChildVertexId.has(report.childVertexId)) {
      reportsByChildVertexId.set(report.childVertexId, report);
    }

    if (!contextByChildVertexId.has(report.childVertexId)) {
      issues.push({
        code: 'child-derivation-report-not-in-contexts',
        message: `Child derivation report ${report.childVertexId} is not part of the active child contexts.`,
        childVertexId: report.childVertexId,
      });
    }
  }

  if (
    childContexts.length !== EXPECTED_TETRAHEDRAL_CHILD_COUNT ||
    contextByChildVertexId.size !== EXPECTED_TETRAHEDRAL_CHILD_COUNT
  ) {
    issues.push({
      code: 'invalid-child-derivation-count',
      message: `Expected six unique child contexts, got ${childContexts.length} contexts and ${contextByChildVertexId.size} unique child ids.`,
      details: {
        expectedChildCount: EXPECTED_TETRAHEDRAL_CHILD_COUNT,
        childContextCount: childContexts.length,
        uniqueChildContextCount: contextByChildVertexId.size,
        duplicateChildContextIds: duplicateContextIds.join(',') || null,
      },
    });
  }

  if (
    derivationReports.length !== EXPECTED_TETRAHEDRAL_CHILD_COUNT ||
    reportsByChildVertexId.size !== EXPECTED_TETRAHEDRAL_CHILD_COUNT
  ) {
    issues.push({
      code: 'invalid-child-derivation-count',
      message: `Expected six unique child derivation reports, got ${derivationReports.length} reports and ${reportsByChildVertexId.size} unique child ids.`,
      details: {
        expectedChildCount: EXPECTED_TETRAHEDRAL_CHILD_COUNT,
        derivationReportCount: derivationReports.length,
        uniqueDerivationReportCount: reportsByChildVertexId.size,
      },
    });
  }

  for (const childVertexId of duplicateReportChildVertexIds) {
    issues.push({
      code: 'duplicate-child-derivation-report',
      message: `Child derivation report ${childVertexId} appears more than once.`,
      childVertexId,
      details: {
        reportCount: reportChildVertexIds.filter((candidate) => candidate === childVertexId)
          .length,
      },
    });
  }

  for (const context of childContexts) {
    if (!reportsByChildVertexId.has(context.childVertexId)) {
      issues.push({
        code: 'missing-child-derivation-report',
        message: `Missing child derivation report for ${context.childVertexId}.`,
        childVertexId: context.childVertexId,
      });
    }

    if (!reportsByChildVertexId.has(context.antipodalChildVertexId)) {
      issues.push({
        code: 'missing-antipodal-child-derivation',
        message: `Missing antipodal child derivation report ${context.antipodalChildVertexId} for ${context.childVertexId}.`,
        childVertexId: context.childVertexId,
        details: {
          antipodalChildVertexId: context.antipodalChildVertexId,
        },
      });
    }
  }

  const statusSetsByChildVertexId = new Map<string, Set<ChildProfileDegeneracyStatus>>();
  const sameAsAntipodalByChildVertexId = new Map<string, Set<string>>();
  const sameAsOtherByChildVertexId = new Map<string, Set<string>>();
  const finiteDerivedParametersByChildVertexId = new Map<
    string,
    FieldSourceEmissionParameters
  >();

  for (const context of childContexts) {
    statusSetsByChildVertexId.set(context.childVertexId, new Set());
    sameAsAntipodalByChildVertexId.set(context.childVertexId, new Set());
    sameAsOtherByChildVertexId.set(context.childVertexId, new Set());
  }

  for (const report of reportsByChildVertexId.values()) {
    const context = contextByChildVertexId.get(report.childVertexId);

    if (!context) {
      continue;
    }

    if (!appendDerivationContextIssues(context, report, issues)) {
      continue;
    }

    const statuses = statusSetsByChildVertexId.get(report.childVertexId);
    const derivedParameters = report.derivation?.derivedParameters;
    const hasExplicitFallback =
      report.fallbackCount > 0 || report.derivation?.localStatus === 'fallback-used';
    const hasUndefinedCircularMean =
      report.derivation?.localStatus === 'undefined-circular-mean' ||
      report.issues.some((issue) => issue.code === 'undefined-circular-mean');

    if (hasExplicitFallback) {
      statuses?.add('fallback-used');
    }

    if (hasUndefinedCircularMean) {
      statuses?.add('undefined-circular-mean');
      statuses?.add('phase-cancellation');
    }

    if (report.derivation?.quarkChannels.length !== report.channelCount) {
      issues.push({
        code: 'channel-structure-erased',
        message: `Child derivation report ${report.childVertexId} does not preserve its Quark channel records.`,
        childVertexId: report.childVertexId,
        details: {
          reportedChannelCount: report.channelCount,
          preservedChannelCount: report.derivation?.quarkChannels.length ?? null,
        },
      });
    }

    if (!derivedParameters) {
      if (!hasExplicitFallback && !hasUndefinedCircularMean) {
        issues.push({
          code: 'missing-derived-parameters',
          message: `Child derivation report ${report.childVertexId} has no derived parameters and no explicit fallback status.`,
          childVertexId: report.childVertexId,
        });
      }

      continue;
    }

    const nonFiniteParameters = collectNonFiniteEmissionParameterNames(derivedParameters);

    if (nonFiniteParameters.length > 0) {
      issues.push({
        code: 'non-finite-derived-parameter',
        message: `Child derivation report ${report.childVertexId} claims non-finite derived parameters.`,
        childVertexId: report.childVertexId,
        details: {
          nonFiniteParameters: nonFiniteParameters.join(','),
        },
      });
      continue;
    }

    finiteDerivedParametersByChildVertexId.set(report.childVertexId, {
      ...derivedParameters,
    });
  }

  const comparisons: ChildEmissionTupleComparison[] = [];
  const comparableChildVertexIds = childContexts
    .map((context) => context.childVertexId)
    .filter((childVertexId) => finiteDerivedParametersByChildVertexId.has(childVertexId));

  for (let firstIndex = 0; firstIndex < comparableChildVertexIds.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < comparableChildVertexIds.length;
      secondIndex += 1
    ) {
      const firstChildVertexId = comparableChildVertexIds[firstIndex];
      const secondChildVertexId = comparableChildVertexIds[secondIndex];
      const firstContext = contextByChildVertexId.get(firstChildVertexId);
      const secondContext = contextByChildVertexId.get(secondChildVertexId);
      const firstParameters = finiteDerivedParametersByChildVertexId.get(firstChildVertexId);
      const secondParameters = finiteDerivedParametersByChildVertexId.get(secondChildVertexId);

      if (!firstContext || !secondContext || !firstParameters || !secondParameters) {
        continue;
      }

      const relationKind =
        firstContext.antipodalChildVertexId === secondChildVertexId
          ? 'antipodal'
          : 'non-antipodal';
      const comparison = compareEmissionTuples(
        firstChildVertexId,
        secondChildVertexId,
        relationKind,
        firstParameters,
        secondParameters,
        epsilon,
      );

      comparisons.push(comparison);

      if (!comparison.sameTuple) {
        continue;
      }

      if (comparison.relationKind === 'antipodal') {
        statusSetsByChildVertexId.get(firstChildVertexId)?.add('same-as-antipodal');
        statusSetsByChildVertexId.get(secondChildVertexId)?.add('same-as-antipodal');
        sameAsAntipodalByChildVertexId.get(firstChildVertexId)?.add(secondChildVertexId);
        sameAsAntipodalByChildVertexId.get(secondChildVertexId)?.add(firstChildVertexId);
      } else {
        statusSetsByChildVertexId.get(firstChildVertexId)?.add('same-as-other-child');
        statusSetsByChildVertexId.get(secondChildVertexId)?.add('same-as-other-child');
        sameAsOtherByChildVertexId.get(firstChildVertexId)?.add(secondChildVertexId);
        sameAsOtherByChildVertexId.get(secondChildVertexId)?.add(firstChildVertexId);
      }
    }
  }

  const observations = childContexts.map((context) => {
    const statuses = statusSetsByChildVertexId.get(context.childVertexId) ?? new Set();
    const hasDerivedParameters = finiteDerivedParametersByChildVertexId.has(
      context.childVertexId,
    );

    if (statuses.size === 0 && hasDerivedParameters) {
      statuses.add('nondegenerate');
    }

    return {
      childVertexId: context.childVertexId,
      sourceEdgeId: context.sourceEdgeId,
      complementEdgeId: context.complementEdgeId,
      antipodalChildVertexId: context.antipodalChildVertexId,
      hasDerivedParameters,
      statuses: sortStatuses(Array.from(statuses)),
      sameAsAntipodalChildVertexIds: Array.from(
        sameAsAntipodalByChildVertexId.get(context.childVertexId) ?? [],
      ),
      sameAsOtherChildVertexIds: Array.from(
        sameAsOtherByChildVertexId.get(context.childVertexId) ?? [],
      ),
    };
  });
  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:${childContexts.map((context) => context.childVertexId).join('|')}`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    childCount: childContexts.length,
    expectedChildCount: EXPECTED_TETRAHEDRAL_CHILD_COUNT,
    derivedChildCount: finiteDerivedParametersByChildVertexId.size,
    fallbackChildCount: observations.filter((observation) =>
      observation.statuses.includes('fallback-used'),
    ).length,
    undefinedCircularMeanChildCount: observations.filter((observation) =>
      observation.statuses.includes('undefined-circular-mean'),
    ).length,
    phaseCancellationChildCount: observations.filter((observation) =>
      observation.statuses.includes('phase-cancellation'),
    ).length,
    sameAsAntipodalCount: comparisons.filter(
      (comparison) => comparison.sameTuple && comparison.relationKind === 'antipodal',
    ).length,
    sameAsOtherChildCount: comparisons.filter(
      (comparison) => comparison.sameTuple && comparison.relationKind === 'non-antipodal',
    ).length,
    comparisonCount: comparisons.length,
    antipodalPairCount: buildAntipodalPairIds(childContexts).length,
    issueCount,
    ok: issueCount === 0,
    observations,
    comparisons,
    issues,
  };
}

function collectNonFiniteEmissionParameterNames(
  parameters: FieldSourceEmissionParameters,
): string[] {
  const nonFiniteParameters: string[] = [];

  if (!Number.isFinite(parameters.amplitude)) {
    nonFiniteParameters.push('amplitude');
  }

  if (!Number.isFinite(parameters.waveNumber)) {
    nonFiniteParameters.push('waveNumber');
  }

  if (!Number.isFinite(parameters.phase)) {
    nonFiniteParameters.push('phase');
  }

  if (!Number.isFinite(parameters.attenuation)) {
    nonFiniteParameters.push('attenuation');
  }

  return nonFiniteParameters;
}

function appendDerivationContextIssues(
  context: TetrahedralAmboChildContext,
  report: FieldChildSourceProfileDerivationReport,
  issues: FieldSourceChildDegeneracyIssue[],
): boolean {
  const reportMismatches = collectReportContextMismatches(context, report);
  const payloadMismatches = report.derivation
    ? collectPayloadContextMismatches(context, report)
    : [];

  if (reportMismatches.length > 0) {
    issues.push({
      code: 'child-derivation-report-context-mismatch',
      message: `Child derivation report ${report.childVertexId} does not match its active child context.`,
      childVertexId: report.childVertexId,
      details: {
        mismatchedFields: reportMismatches.join(','),
      },
    });
  }

  if (payloadMismatches.length > 0) {
    issues.push({
      code: 'child-derivation-payload-context-mismatch',
      message: `Child derivation payload ${report.childVertexId} does not match its active child context.`,
      childVertexId: report.childVertexId,
      details: {
        mismatchedFields: payloadMismatches.join(','),
      },
    });
  }

  return reportMismatches.length === 0 && payloadMismatches.length === 0;
}

function collectReportContextMismatches(
  context: TetrahedralAmboChildContext,
  report: FieldChildSourceProfileDerivationReport,
): string[] {
  const mismatches: string[] = [];

  if (report.childVertexId !== context.childVertexId) {
    mismatches.push('childVertexId');
  }

  if (report.sourceEdgeId !== context.sourceEdgeId) {
    mismatches.push('sourceEdgeId');
  }

  if (report.complementEdgeId !== context.complementEdgeId) {
    mismatches.push('complementEdgeId');
  }

  if (report.antipodalChildVertexId !== context.antipodalChildVertexId) {
    mismatches.push('antipodalChildVertexId');
  }

  return mismatches;
}

function collectPayloadContextMismatches(
  context: TetrahedralAmboChildContext,
  report: FieldChildSourceProfileDerivationReport,
): string[] {
  const mismatches: string[] = [];
  const derivation = report.derivation;

  if (!derivation) {
    return mismatches;
  }

  if (derivation.childVertexId !== context.childVertexId) {
    mismatches.push('derivation.childVertexId');
  }

  if (derivation.sourceEdgeId !== context.sourceEdgeId) {
    mismatches.push('derivation.sourceEdgeId');
  }

  if (derivation.complementEdgeId !== context.complementEdgeId) {
    mismatches.push('derivation.complementEdgeId');
  }

  if (derivation.antipodalChildVertexId !== context.antipodalChildVertexId) {
    mismatches.push('derivation.antipodalChildVertexId');
  }

  if (!sameUnorderedPair(derivation.sourceEdgeVertexIds, context.sourceEdgeVertexIds)) {
    mismatches.push('derivation.sourceEdgeVertexIds');
  }

  if (!sameUnorderedPair(derivation.complementEdgeVertexIds, context.complementEdgeVertexIds)) {
    mismatches.push('derivation.complementEdgeVertexIds');
  }

  if (!sameUnorderedPair(derivation.projectionVertexIds, context.projectionVertexIds)) {
    mismatches.push('derivation.projectionVertexIds');
  }

  return mismatches;
}

function buildAntipodalPairIds(contexts: TetrahedralAmboChildContext[]): string[] {
  const contextByChildVertexId = new Map(
    contexts.map((context) => [context.childVertexId, context]),
  );
  const pairIds = new Set<string>();

  for (const context of contexts) {
    if (!contextByChildVertexId.has(context.antipodalChildVertexId)) {
      continue;
    }

    pairIds.add(sortPair([context.childVertexId, context.antipodalChildVertexId]).join('<->'));
  }

  return Array.from(pairIds);
}

function cloneChildContext(context: TetrahedralAmboChildContext): TetrahedralAmboChildContext {
  return {
    ...context,
    sourceEdgeVertexIds: copyPair(context.sourceEdgeVertexIds),
    complementEdgeVertexIds: copyPair(context.complementEdgeVertexIds),
    projectionVertexIds: copyPair(context.projectionVertexIds),
  };
}

function sortStatuses(statuses: ChildProfileDegeneracyStatus[]): ChildProfileDegeneracyStatus[] {
  return statuses.sort((left, right) => STATUS_ORDER.indexOf(left) - STATUS_ORDER.indexOf(right));
}

function copyPair(pair: [string, string]): [string, string] {
  return [pair[0], pair[1]];
}

function sortPair(pair: [string, string]): [string, string] {
  return pair[0] <= pair[1] ? [pair[0], pair[1]] : [pair[1], pair[0]];
}

function sameUnorderedPair(left: [string, string], right: [string, string]): boolean {
  const sortedLeft = sortPair(left);
  const sortedRight = sortPair(right);

  return sortedLeft[0] === sortedRight[0] && sortedLeft[1] === sortedRight[1];
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
