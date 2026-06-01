import type { FieldSourceEmissionParameters } from './fieldSourceProfiles';
import type { TetrahedralAmboChildContext } from './fieldSourceChildContexts';
import {
  QUARK_CHILD_PARENT_DISTANCE,
  QUARK_CHILD_PROJECTION_DISTANCE,
  QUARK_PARENT_PROJECTION_DISTANCE,
  QUARK_PARENT_WEIGHT,
  QUARK_PROJECTION_WEIGHT,
} from './fieldSourceQuarkChannels';
import type {
  QuarkChannelParameters,
  QuarkChannelRecord,
  TetrahedralQuarkChannelReport,
} from './fieldSourceQuarkChannels';

export type FieldSourceProfileFallbackKind =
  | 'unresolved-child-source-profile'
  | 'deterministic-baseline-for-diagnostics';

export interface FieldSourceProfileFallback {
  fallbackKind: FieldSourceProfileFallbackKind;
  reason: string;
}

export type ChildDerivationLocalStatus =
  | 'derived'
  | 'fallback-used'
  | 'undefined-circular-mean';

export interface FieldChildSourceProfileDerivation {
  childVertexId: string;
  childRole: 'shared-90-pole';
  sourceEdgeId: string;
  sourceEdgeVertexIds: [string, string];
  complementEdgeId: string;
  complementEdgeVertexIds: [string, string];
  antipodalChildVertexId: string;
  projectionVertexIds: [string, string];
  grammarId: 'tetrahedral-edge-complement-quark-inheritance-v0';
  quarkChannels: QuarkChannelRecord[];
  ratio: {
    parentWeight: number;
    projectionWeight: number;
    childParent: number;
    childProjection: number;
    parentProjection: number;
  };
  mergeKind: 'four-channel-merge';
  derivedParameters?: FieldSourceEmissionParameters;
  localStatus: ChildDerivationLocalStatus;
  fallback?: FieldSourceProfileFallback;
}

export type FieldChildDerivationDiagnosticIssueCode =
  | 'missing-quark-channel-report'
  | 'quark-channel-report-not-ok'
  | 'quark-channel-report-child-mismatch'
  | 'quark-channel-report-context-mismatch'
  | 'quark-channel-child-mismatch'
  | 'quark-channel-pair-mismatch'
  | 'quark-channel-ratio-mismatch'
  | 'invalid-four-channel-count'
  | 'non-finite-channel-parameter'
  | 'undefined-circular-mean'
  | 'missing-derived-parameters'
  | 'fallback-used'
  | 'wrong-merge-kind'
  | 'channel-structure-erased';

export interface FieldChildDerivationDiagnosticIssue {
  code: FieldChildDerivationDiagnosticIssueCode;
  message: string;
  childVertexId?: string;
  channelId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface FieldChildSourceProfileDerivationReport {
  reportId: string;
  method: 'tetrahedral-child-source-profile-derivation-diagnostic-v0';
  derivationScope: 'diagnostic-child-source-profile-derivation-only';
  childVertexId: string;
  sourceEdgeId: string;
  complementEdgeId: string;
  antipodalChildVertexId: string;
  channelCount: number;
  finiteChannelCount: number;
  mergeKind: 'four-channel-merge';
  hasDerivedParameters: boolean;
  fallbackCount: number;
  issueCount: number;
  ok: boolean;
  derivation?: FieldChildSourceProfileDerivation;
  issues: FieldChildDerivationDiagnosticIssue[];
}

export interface BuildTetrahedralChildSourceProfileDerivationReportArgs {
  childContext: TetrahedralAmboChildContext;
  quarkChannelReport?: TetrahedralQuarkChannelReport | null;
  fallbackKind?: FieldSourceProfileFallbackKind;
  circularMeanEpsilon?: number;
}

export interface CircularMeanRadiansResult {
  phase?: number;
  magnitude: number;
  ok: boolean;
}

export interface FourQuarkChannelParameterMergeResult {
  channelCount: number;
  finiteChannelCount: number;
  mergeKind: 'four-channel-merge';
  derivedParameters?: FieldSourceEmissionParameters;
  localStatus: ChildDerivationLocalStatus;
  fallback?: FieldSourceProfileFallback;
}

const TWO_PI = 2 * Math.PI;
const EXPECTED_QUARK_CHANNEL_COUNT = 4;
const CIRCULAR_MEAN_EPSILON = 1e-12;
const DEFAULT_FALLBACK_KIND: FieldSourceProfileFallbackKind = 'unresolved-child-source-profile';
const CHILD_SOURCE_DERIVATION_METHOD =
  'tetrahedral-child-source-profile-derivation-diagnostic-v0';
const CHILD_SOURCE_DERIVATION_SCOPE = 'diagnostic-child-source-profile-derivation-only';
const GRAMMAR_ID = 'tetrahedral-edge-complement-quark-inheritance-v0';
const MERGE_KIND = 'four-channel-merge';

export function normalizePhaseRadians(phase: number): number {
  if (!Number.isFinite(phase)) {
    return phase;
  }

  const normalized = phase % TWO_PI;
  const positive = normalized < 0 ? normalized + TWO_PI : normalized;

  return Object.is(positive, -0) ? 0 : positive;
}

export function arithmeticMean(values: number[]): number {
  if (values.length === 0) {
    return Number.NaN;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function circularMeanRadians(
  phases: number[],
  epsilon = CIRCULAR_MEAN_EPSILON,
): CircularMeanRadiansResult {
  const x = phases.reduce((sum, phase) => sum + Math.cos(phase), 0);
  const y = phases.reduce((sum, phase) => sum + Math.sin(phase), 0);
  const magnitude = Math.sqrt(x * x + y * y);

  if (magnitude < epsilon) {
    return {
      magnitude,
      ok: false,
    };
  }

  return {
    phase: normalizePhaseRadians(Math.atan2(y, x)),
    magnitude,
    ok: true,
  };
}

export function mergeFourQuarkChannelParameters(
  channels: QuarkChannelRecord[],
  fallbackKind: FieldSourceProfileFallbackKind = DEFAULT_FALLBACK_KIND,
  circularMeanEpsilon = CIRCULAR_MEAN_EPSILON,
): FourQuarkChannelParameterMergeResult {
  const finiteChannelCount = channels.filter((channel) =>
    isFiniteChannelParameters(channel.channelParameters),
  ).length;

  if (channels.length !== EXPECTED_QUARK_CHANNEL_COUNT) {
    return {
      channelCount: channels.length,
      finiteChannelCount,
      mergeKind: MERGE_KIND,
      localStatus: 'fallback-used',
      fallback: {
        fallbackKind,
        reason: `Expected four Quark channels, got ${channels.length}.`,
      },
    };
  }

  if (finiteChannelCount !== EXPECTED_QUARK_CHANNEL_COUNT) {
    return {
      channelCount: channels.length,
      finiteChannelCount,
      mergeKind: MERGE_KIND,
      localStatus: 'fallback-used',
      fallback: {
        fallbackKind,
        reason: 'At least one Quark channel contains a non-finite parameter.',
      },
    };
  }

  const phaseMean = circularMeanRadians(
    channels.map((channel) => channel.channelParameters.phase),
    circularMeanEpsilon,
  );

  if (!phaseMean.ok || phaseMean.phase === undefined) {
    return {
      channelCount: channels.length,
      finiteChannelCount,
      mergeKind: MERGE_KIND,
      localStatus: 'undefined-circular-mean',
      fallback: {
        fallbackKind,
        reason: 'The four-channel phase circular mean is undefined.',
      },
    };
  }

  return {
    channelCount: channels.length,
    finiteChannelCount,
    mergeKind: MERGE_KIND,
    localStatus: 'derived',
    derivedParameters: {
      amplitude: arithmeticMean(
        channels.map((channel) => channel.channelParameters.amplitude),
      ),
      waveNumber: arithmeticMean(
        channels.map((channel) => channel.channelParameters.waveNumber),
      ),
      phase: phaseMean.phase,
      attenuation: arithmeticMean(
        channels.map((channel) => channel.channelParameters.attenuation),
      ),
    },
  };
}

export function buildTetrahedralChildSourceProfileDerivationReport(
  args: BuildTetrahedralChildSourceProfileDerivationReportArgs,
): FieldChildSourceProfileDerivationReport {
  const issues: FieldChildDerivationDiagnosticIssue[] = [];
  const fallbackKind = args.fallbackKind ?? DEFAULT_FALLBACK_KIND;
  const quarkChannelReport = args.quarkChannelReport ?? null;
  const quarkChannels = (quarkChannelReport?.quarkChannels ?? []).map(cloneQuarkChannel);
  const finiteChannelCount = quarkChannels.filter((channel) =>
    isFiniteChannelParameters(channel.channelParameters),
  ).length;
  let fallbackReason: string | undefined;
  let derivedParameters: FieldSourceEmissionParameters | undefined;
  let localStatus: ChildDerivationLocalStatus = 'fallback-used';

  if (!quarkChannelReport) {
    issues.push({
      code: 'missing-quark-channel-report',
      message: `Missing Quark channel report for child ${args.childContext.childVertexId}.`,
      childVertexId: args.childContext.childVertexId,
    });
    fallbackReason = 'No Quark channel report was provided.';
  } else {
    if (!quarkChannelReport.ok) {
      issues.push({
        code: 'quark-channel-report-not-ok',
        message: `Quark channel report for child ${args.childContext.childVertexId} is not ok.`,
        childVertexId: args.childContext.childVertexId,
        details: {
          quarkIssueCount: quarkChannelReport.issueCount,
        },
      });
      fallbackReason = fallbackReason ?? 'The Quark channel report is not ok.';
    }

    if (quarkChannelReport.channelCount !== quarkChannels.length) {
      issues.push({
        code: 'channel-structure-erased',
        message: 'Quark channel report metadata does not match the preserved channel records.',
        childVertexId: args.childContext.childVertexId,
        details: {
          reportedChannelCount: quarkChannelReport.channelCount,
          preservedChannelCount: quarkChannels.length,
        },
      });
      fallbackReason =
        fallbackReason ?? 'The Quark channel records do not match the reported channel count.';
    }

    fallbackReason =
      fallbackReason ??
      appendQuarkChannelStructureIssues(
        args.childContext,
        quarkChannelReport,
        quarkChannels,
        issues,
      );
  }

  if (args.childContext.mergeTarget !== MERGE_KIND) {
    issues.push({
      code: 'wrong-merge-kind',
      message: `Child ${args.childContext.childVertexId} does not target a four-channel merge.`,
      childVertexId: args.childContext.childVertexId,
      details: {
        expectedMergeKind: MERGE_KIND,
        actualMergeKind: args.childContext.mergeTarget,
      },
    });
    fallbackReason = fallbackReason ?? 'The child context does not target a four-channel merge.';
  }

  if (quarkChannels.length !== EXPECTED_QUARK_CHANNEL_COUNT) {
    issues.push({
      code: 'invalid-four-channel-count',
      message: `Expected four Quark channels for child ${args.childContext.childVertexId}, got ${quarkChannels.length}.`,
      childVertexId: args.childContext.childVertexId,
      details: {
        expectedChannelCount: EXPECTED_QUARK_CHANNEL_COUNT,
        channelCount: quarkChannels.length,
      },
    });
    fallbackReason = fallbackReason ?? `Expected four Quark channels, got ${quarkChannels.length}.`;
  }

  for (const channel of quarkChannels) {
    if (!isFiniteChannelParameters(channel.channelParameters)) {
      issues.push({
        code: 'non-finite-channel-parameter',
        message: `Quark channel ${channel.channelId} contains a non-finite parameter.`,
        childVertexId: args.childContext.childVertexId,
        channelId: channel.channelId,
      });
      fallbackReason =
        fallbackReason ?? `Quark channel ${channel.channelId} contains a non-finite parameter.`;
    }
  }

  const canAttemptMerge =
    Boolean(quarkChannelReport?.ok) &&
    args.childContext.mergeTarget === MERGE_KIND &&
    quarkChannels.length === EXPECTED_QUARK_CHANNEL_COUNT &&
    finiteChannelCount === EXPECTED_QUARK_CHANNEL_COUNT &&
    issues.length === 0;

  if (canAttemptMerge) {
    const mergeResult = mergeFourQuarkChannelParameters(
      quarkChannels,
      fallbackKind,
      args.circularMeanEpsilon,
    );

    localStatus = mergeResult.localStatus;
    derivedParameters = mergeResult.derivedParameters;

    if (mergeResult.localStatus === 'undefined-circular-mean') {
      issues.push({
        code: 'undefined-circular-mean',
        message: `Four-channel phase circular mean is undefined for child ${args.childContext.childVertexId}.`,
        childVertexId: args.childContext.childVertexId,
      });
    }

    fallbackReason = fallbackReason ?? mergeResult.fallback?.reason;
  }

  if (derivedParameters) {
    localStatus = 'derived';
  }

  const fallback = fallbackReason
    ? {
        fallbackKind,
        reason: fallbackReason,
      }
    : undefined;

  if (fallback) {
    issues.push({
      code: 'fallback-used',
      message: `Child ${args.childContext.childVertexId} derivation used an explicit fallback.`,
      childVertexId: args.childContext.childVertexId,
      details: {
        fallbackKind: fallback.fallbackKind,
      },
    });
  }

  if (!derivedParameters) {
    issues.push({
      code: 'missing-derived-parameters',
      message: `Child ${args.childContext.childVertexId} has no derived emission parameters.`,
      childVertexId: args.childContext.childVertexId,
    });
  }

  const derivation: FieldChildSourceProfileDerivation = {
    childVertexId: args.childContext.childVertexId,
    childRole: args.childContext.childRole,
    sourceEdgeId: args.childContext.sourceEdgeId,
    sourceEdgeVertexIds: copyPair(args.childContext.sourceEdgeVertexIds),
    complementEdgeId: args.childContext.complementEdgeId,
    complementEdgeVertexIds: copyPair(args.childContext.complementEdgeVertexIds),
    antipodalChildVertexId: args.childContext.antipodalChildVertexId,
    projectionVertexIds: copyPair(args.childContext.projectionVertexIds),
    grammarId: GRAMMAR_ID,
    quarkChannels,
    ratio: {
      parentWeight: QUARK_PARENT_WEIGHT,
      projectionWeight: QUARK_PROJECTION_WEIGHT,
      childParent: QUARK_CHILD_PARENT_DISTANCE,
      childProjection: QUARK_CHILD_PROJECTION_DISTANCE,
      parentProjection: QUARK_PARENT_PROJECTION_DISTANCE,
    },
    mergeKind: MERGE_KIND,
    ...(derivedParameters ? { derivedParameters } : {}),
    localStatus,
    ...(fallback ? { fallback } : {}),
  };
  const issueCount = issues.length;

  return {
    reportId: `${CHILD_SOURCE_DERIVATION_METHOD}:${args.childContext.childVertexId}`,
    method: CHILD_SOURCE_DERIVATION_METHOD,
    derivationScope: CHILD_SOURCE_DERIVATION_SCOPE,
    childVertexId: args.childContext.childVertexId,
    sourceEdgeId: args.childContext.sourceEdgeId,
    complementEdgeId: args.childContext.complementEdgeId,
    antipodalChildVertexId: args.childContext.antipodalChildVertexId,
    channelCount: quarkChannels.length,
    finiteChannelCount,
    mergeKind: MERGE_KIND,
    hasDerivedParameters: Boolean(derivedParameters),
    fallbackCount: fallback ? 1 : 0,
    issueCount,
    ok: issueCount === 0 && Boolean(derivedParameters),
    derivation,
    issues,
  };
}

function isFiniteChannelParameters(params: QuarkChannelParameters): boolean {
  return (
    Number.isFinite(params.amplitude) &&
    Number.isFinite(params.waveNumber) &&
    Number.isFinite(params.phase) &&
    Number.isFinite(params.attenuation)
  );
}

function appendQuarkChannelStructureIssues(
  childContext: TetrahedralAmboChildContext,
  quarkChannelReport: TetrahedralQuarkChannelReport,
  quarkChannels: QuarkChannelRecord[],
  issues: FieldChildDerivationDiagnosticIssue[],
): string | undefined {
  let fallbackReason: string | undefined;

  if (quarkChannelReport.childVertexId !== childContext.childVertexId) {
    issues.push({
      code: 'quark-channel-report-child-mismatch',
      message: `Quark channel report child ${quarkChannelReport.childVertexId} does not match context child ${childContext.childVertexId}.`,
      childVertexId: childContext.childVertexId,
      details: {
        reportChildVertexId: quarkChannelReport.childVertexId,
      },
    });
    fallbackReason =
      fallbackReason ?? 'The Quark channel report does not belong to the supplied child context.';
  }

  const reportContextMismatches = collectQuarkChannelReportContextMismatches(
    childContext,
    quarkChannelReport,
  );

  if (reportContextMismatches.length > 0) {
    issues.push({
      code: 'quark-channel-report-context-mismatch',
      message: `Quark channel report context does not match child context ${childContext.childVertexId}.`,
      childVertexId: childContext.childVertexId,
      details: {
        mismatchedFields: reportContextMismatches.join(','),
        reportSourceEdgeId: quarkChannelReport.sourceEdgeId,
        reportComplementEdgeId: quarkChannelReport.complementEdgeId,
        reportProjectionVertexIds: quarkChannelReport.projectionVertexIds.join(','),
      },
    });
    fallbackReason =
      fallbackReason ?? 'The Quark channel report context does not match the supplied child context.';
  }

  for (const channel of quarkChannels) {
    if (channel.child90 !== childContext.childVertexId) {
      issues.push({
        code: 'quark-channel-child-mismatch',
        message: `Quark channel ${channel.channelId} child ${channel.child90} does not match context child ${childContext.childVertexId}.`,
        childVertexId: childContext.childVertexId,
        channelId: channel.channelId,
        details: {
          channelChildVertexId: channel.child90,
        },
      });
      fallbackReason =
        fallbackReason ?? 'At least one Quark channel does not belong to the supplied child context.';
    }
  }

  const expectedPairKeys = buildExpectedChannelPairKeys(childContext);
  const expectedPairKeySet = new Set(expectedPairKeys);
  const actualPairCounts = countBy(
    quarkChannels.map((channel) => buildChannelPairKey(channel.parent60, channel.projection30)),
  );
  const missingPairKeys = expectedPairKeys.filter((pairKey) => !actualPairCounts.has(pairKey));
  const extraPairKeys = Array.from(actualPairCounts.keys()).filter(
    (pairKey) => !expectedPairKeySet.has(pairKey),
  );
  const duplicatePairKeys = Array.from(actualPairCounts)
    .filter(([, count]) => count > 1)
    .map(([pairKey]) => pairKey);

  if (
    missingPairKeys.length > 0 ||
    extraPairKeys.length > 0 ||
    duplicatePairKeys.length > 0
  ) {
    issues.push({
      code: 'quark-channel-pair-mismatch',
      message: `Quark channel pairs do not exactly match child context ${childContext.childVertexId}.`,
      childVertexId: childContext.childVertexId,
      details: {
        expectedPairs: expectedPairKeys.join(','),
        actualPairs: Array.from(actualPairCounts.keys()).join(','),
        missingPairs: missingPairKeys.join(',') || null,
        extraPairs: extraPairKeys.join(',') || null,
        duplicatePairs: duplicatePairKeys.join(',') || null,
      },
    });
    fallbackReason =
      fallbackReason ?? 'The Quark channel pair set does not match the supplied child context.';
  }

  for (const channel of quarkChannels) {
    const ratioMismatches = collectQuarkChannelRatioMismatches(channel);

    if (ratioMismatches.length > 0) {
      issues.push({
        code: 'quark-channel-ratio-mismatch',
        message: `Quark channel ${channel.channelId} does not use the expected tetrahedral ratio constants.`,
        childVertexId: childContext.childVertexId,
        channelId: channel.channelId,
        details: {
          mismatchedFields: ratioMismatches.join(','),
        },
      });
      fallbackReason =
        fallbackReason ?? 'At least one Quark channel does not use the expected ratio constants.';
    }
  }

  return fallbackReason;
}

function collectQuarkChannelReportContextMismatches(
  childContext: TetrahedralAmboChildContext,
  quarkChannelReport: TetrahedralQuarkChannelReport,
): string[] {
  const mismatches: string[] = [];

  if (quarkChannelReport.sourceEdgeId !== childContext.sourceEdgeId) {
    mismatches.push('sourceEdgeId');
  }

  if (quarkChannelReport.complementEdgeId !== childContext.complementEdgeId) {
    mismatches.push('complementEdgeId');
  }

  if (!sameUnorderedPair(quarkChannelReport.projectionVertexIds, childContext.projectionVertexIds)) {
    mismatches.push('projectionVertexIds');
  }

  return mismatches;
}

function buildExpectedChannelPairKeys(childContext: TetrahedralAmboChildContext): string[] {
  const parentVertexIds = childContext.sourceEdgeVertexIds;
  const projectionVertexIds = childContext.projectionVertexIds;

  return [
    buildChannelPairKey(parentVertexIds[0], projectionVertexIds[0]),
    buildChannelPairKey(parentVertexIds[1], projectionVertexIds[0]),
    buildChannelPairKey(parentVertexIds[0], projectionVertexIds[1]),
    buildChannelPairKey(parentVertexIds[1], projectionVertexIds[1]),
  ];
}

function buildChannelPairKey(parent60: string, projection30: string): string {
  return `${parent60}->${projection30}`;
}

function collectQuarkChannelRatioMismatches(channel: QuarkChannelRecord): string[] {
  const mismatches: string[] = [];

  if (!sameNumber(channel.parentWeight, QUARK_PARENT_WEIGHT)) {
    mismatches.push('parentWeight');
  }

  if (!sameNumber(channel.projectionWeight, QUARK_PROJECTION_WEIGHT)) {
    mismatches.push('projectionWeight');
  }

  if (!sameNumber(channel.ratio.parentWeight, QUARK_PARENT_WEIGHT)) {
    mismatches.push('ratio.parentWeight');
  }

  if (!sameNumber(channel.ratio.projectionWeight, QUARK_PROJECTION_WEIGHT)) {
    mismatches.push('ratio.projectionWeight');
  }

  if (!sameNumber(channel.ratio.childParent, QUARK_CHILD_PARENT_DISTANCE)) {
    mismatches.push('ratio.childParent');
  }

  if (!sameNumber(channel.ratio.childProjection, QUARK_CHILD_PROJECTION_DISTANCE)) {
    mismatches.push('ratio.childProjection');
  }

  if (!sameNumber(channel.ratio.parentProjection, QUARK_PARENT_PROJECTION_DISTANCE)) {
    mismatches.push('ratio.parentProjection');
  }

  return mismatches;
}

function cloneQuarkChannel(channel: QuarkChannelRecord): QuarkChannelRecord {
  return {
    ...channel,
    ratio: {
      ...channel.ratio,
    },
    channelParameters: {
      ...channel.channelParameters,
    },
  };
}

function copyPair(pair: [string, string]): [string, string] {
  return [pair[0], pair[1]];
}

function sameUnorderedPair(left: [string, string], right: [string, string]): boolean {
  const sortedLeft = sortPair(left);
  const sortedRight = sortPair(right);

  return sortedLeft[0] === sortedRight[0] && sortedLeft[1] === sortedRight[1];
}

function sortPair(pair: [string, string]): [string, string] {
  return pair[0] <= pair[1] ? [pair[0], pair[1]] : [pair[1], pair[0]];
}

function sameNumber(left: number, right: number): boolean {
  return Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) <= 1e-12;
}

function countBy(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return counts;
}
