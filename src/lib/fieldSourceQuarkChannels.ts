import type { FieldSourceProfile } from './fieldSourceProfiles';
import { isFiniteEmissionParameters } from './fieldSourceProfiles';
import type { TetrahedralAmboChildContext } from './fieldSourceChildContexts';

export const QUARK_PARENT_WEIGHT = Math.sqrt(3);
export const QUARK_PROJECTION_WEIGHT = 1;
export const QUARK_CHILD_PARENT_DISTANCE = 1;
export const QUARK_CHILD_PROJECTION_DISTANCE = Math.sqrt(3);
export const QUARK_PARENT_PROJECTION_DISTANCE = 2;

export interface QuarkChannelParameters {
  amplitude: number;
  waveNumber: number;
  phase: number;
  attenuation: number;
}

export interface QuarkChannelRatio {
  parentWeight: number;
  projectionWeight: number;
  childParent: number;
  childProjection: number;
  parentProjection: number;
}

export interface QuarkChannelRecord {
  channelId: string;
  channelScope: 'intermediate-quark-channel-only';
  child90: string;
  parent60: string;
  projection30: string;
  parentProfileId: string;
  projectionProfileId: string;
  parentWeight: number;
  projectionWeight: number;
  ratio: QuarkChannelRatio;
  channelParameters: QuarkChannelParameters;
}

export type QuarkChannelDiagnosticIssueCode =
  | 'missing-parent-profile'
  | 'missing-projection-profile'
  | 'non-finite-parent-profile'
  | 'non-finite-projection-profile'
  | 'non-finite-channel-parameter'
  | 'invalid-channel-count'
  | 'projection-treated-as-parent'
  | 'unexpected-parent-vertex'
  | 'unexpected-projection-vertex';

export interface QuarkChannelDiagnosticIssue {
  code: QuarkChannelDiagnosticIssueCode;
  message: string;
  childVertexId?: string;
  channelId?: string;
  vertexId?: string;
  profileId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface TetrahedralQuarkChannelReport {
  reportId: string;
  method: 'tetrahedral-quark-channel-diagnostic-v0';
  channelScope: 'intermediate-quark-channel-only';
  childVertexId: string;
  sourceEdgeId: string;
  complementEdgeId: string;
  projectionVertexIds: [string, string];
  channelCount: number;
  finiteChannelCount: number;
  issueCount: number;
  ok: boolean;
  quarkChannels: QuarkChannelRecord[];
  issues: QuarkChannelDiagnosticIssue[];
}

export interface BuildQuarkChannelRecordArgs {
  child90: string;
  parent60: string;
  projection30: string;
  parentProfile: FieldSourceProfile;
  projectionProfile: FieldSourceProfile;
}

export interface BuildTetrahedralQuarkChannelReportArgs {
  childContext: TetrahedralAmboChildContext;
  profileByVertexId: Map<string, FieldSourceProfile> | Record<string, FieldSourceProfile>;
}

const EXPECTED_TETRAHEDRAL_QUARK_CHANNEL_COUNT = 4;

export function normalizePhaseRadians(phase: number): number {
  if (!Number.isFinite(phase)) {
    return phase;
  }

  const twoPi = 2 * Math.PI;
  const normalized = phase % twoPi;
  const positive = normalized < 0 ? normalized + twoPi : normalized;

  return Object.is(positive, -0) ? 0 : positive;
}

export function weightedMean(
  parentValue: number,
  projectionValue: number,
  parentWeight: number,
  projectionWeight: number,
): number {
  return (
    (parentWeight * parentValue + projectionWeight * projectionValue) /
    (parentWeight + projectionWeight)
  );
}

export function weightedCircularMeanRadians(
  parentPhase: number,
  projectionPhase: number,
  parentWeight: number,
  projectionWeight: number,
): number {
  const x =
    parentWeight * Math.cos(parentPhase) +
    projectionWeight * Math.cos(projectionPhase);
  const y =
    parentWeight * Math.sin(parentPhase) +
    projectionWeight * Math.sin(projectionPhase);

  return normalizePhaseRadians(Math.atan2(y, x));
}

export function buildQuarkChannelRecord(
  args: BuildQuarkChannelRecordArgs,
): QuarkChannelRecord {
  const parentWeight = QUARK_PARENT_WEIGHT;
  const projectionWeight = QUARK_PROJECTION_WEIGHT;

  return {
    channelId: `quark-channel:${args.child90}:${args.parent60}60:${args.projection30}30`,
    channelScope: 'intermediate-quark-channel-only',
    child90: args.child90,
    parent60: args.parent60,
    projection30: args.projection30,
    parentProfileId: args.parentProfile.profileId,
    projectionProfileId: args.projectionProfile.profileId,
    parentWeight,
    projectionWeight,
    ratio: {
      parentWeight,
      projectionWeight,
      childParent: QUARK_CHILD_PARENT_DISTANCE,
      childProjection: QUARK_CHILD_PROJECTION_DISTANCE,
      parentProjection: QUARK_PARENT_PROJECTION_DISTANCE,
    },
    channelParameters: {
      amplitude: weightedMean(
        args.parentProfile.amplitude,
        args.projectionProfile.amplitude,
        parentWeight,
        projectionWeight,
      ),
      waveNumber: weightedMean(
        args.parentProfile.waveNumber,
        args.projectionProfile.waveNumber,
        parentWeight,
        projectionWeight,
      ),
      phase: weightedCircularMeanRadians(
        args.parentProfile.phase,
        args.projectionProfile.phase,
        parentWeight,
        projectionWeight,
      ),
      attenuation: weightedMean(
        args.parentProfile.attenuation,
        args.projectionProfile.attenuation,
        parentWeight,
        projectionWeight,
      ),
    },
  };
}

export function buildTetrahedralQuarkChannelReport(
  args: BuildTetrahedralQuarkChannelReportArgs,
): TetrahedralQuarkChannelReport {
  const issues: QuarkChannelDiagnosticIssue[] = [];
  const profileByVertexId = toProfileMap(args.profileByVertexId);
  const parentVertexIds = args.childContext.sourceEdgeVertexIds;
  const projectionVertexIds = args.childContext.projectionVertexIds;
  const parentVertexIdSet = new Set(parentVertexIds);
  const projectionVertexIdSet = new Set(projectionVertexIds);
  const requestedChannelPairs = [
    [parentVertexIds[0], projectionVertexIds[0]],
    [parentVertexIds[1], projectionVertexIds[0]],
    [parentVertexIds[0], projectionVertexIds[1]],
    [parentVertexIds[1], projectionVertexIds[1]],
  ] as Array<[string, string]>;
  const quarkChannels: QuarkChannelRecord[] = [];

  for (const parentVertexId of parentVertexIds) {
    if (!args.childContext.sourceEdgeVertexIds.includes(parentVertexId)) {
      issues.push({
        code: 'unexpected-parent-vertex',
        message: `Unexpected parent vertex ${parentVertexId}.`,
        childVertexId: args.childContext.childVertexId,
        vertexId: parentVertexId,
      });
    }

    if (projectionVertexIdSet.has(parentVertexId)) {
      issues.push({
        code: 'projection-treated-as-parent',
        message: `Projection vertex ${parentVertexId} was treated as a parent.`,
        childVertexId: args.childContext.childVertexId,
        vertexId: parentVertexId,
      });
    }
  }

  for (const projectionVertexId of projectionVertexIds) {
    if (!args.childContext.projectionVertexIds.includes(projectionVertexId)) {
      issues.push({
        code: 'unexpected-projection-vertex',
        message: `Unexpected projection vertex ${projectionVertexId}.`,
        childVertexId: args.childContext.childVertexId,
        vertexId: projectionVertexId,
      });
    }

    if (parentVertexIdSet.has(projectionVertexId)) {
      issues.push({
        code: 'projection-treated-as-parent',
        message: `Vertex ${projectionVertexId} appears as both parent and projection.`,
        childVertexId: args.childContext.childVertexId,
        vertexId: projectionVertexId,
      });
    }
  }

  for (const [parentVertexId, projectionVertexId] of requestedChannelPairs) {
    const parentProfile = profileByVertexId.get(parentVertexId);
    const projectionProfile = profileByVertexId.get(projectionVertexId);

    if (!parentProfile) {
      issues.push({
        code: 'missing-parent-profile',
        message: `Missing parent profile for ${parentVertexId}.`,
        childVertexId: args.childContext.childVertexId,
        vertexId: parentVertexId,
      });
    } else if (!isFiniteEmissionParameters(parentProfile)) {
      issues.push({
        code: 'non-finite-parent-profile',
        message: `Parent profile for ${parentVertexId} contains a non-finite parameter.`,
        childVertexId: args.childContext.childVertexId,
        vertexId: parentVertexId,
        profileId: parentProfile.profileId,
      });
    }

    if (!projectionProfile) {
      issues.push({
        code: 'missing-projection-profile',
        message: `Missing projection profile for ${projectionVertexId}.`,
        childVertexId: args.childContext.childVertexId,
        vertexId: projectionVertexId,
      });
    } else if (!isFiniteEmissionParameters(projectionProfile)) {
      issues.push({
        code: 'non-finite-projection-profile',
        message: `Projection profile for ${projectionVertexId} contains a non-finite parameter.`,
        childVertexId: args.childContext.childVertexId,
        vertexId: projectionVertexId,
        profileId: projectionProfile.profileId,
      });
    }

    if (
      parentProfile &&
      projectionProfile &&
      isFiniteEmissionParameters(parentProfile) &&
      isFiniteEmissionParameters(projectionProfile)
    ) {
      const channel = buildQuarkChannelRecord({
        child90: args.childContext.childVertexId,
        parent60: parentVertexId,
        projection30: projectionVertexId,
        parentProfile,
        projectionProfile,
      });

      quarkChannels.push(channel);

      if (!isFiniteChannelParameters(channel.channelParameters)) {
        issues.push({
          code: 'non-finite-channel-parameter',
          message: `Channel ${channel.channelId} contains a non-finite parameter.`,
          childVertexId: args.childContext.childVertexId,
          channelId: channel.channelId,
        });
      }
    }
  }

  if (quarkChannels.length !== EXPECTED_TETRAHEDRAL_QUARK_CHANNEL_COUNT) {
    issues.push({
      code: 'invalid-channel-count',
      message: `Expected four tetrahedral Quark channels, got ${quarkChannels.length}.`,
      childVertexId: args.childContext.childVertexId,
      details: {
        expectedChannelCount: EXPECTED_TETRAHEDRAL_QUARK_CHANNEL_COUNT,
        channelCount: quarkChannels.length,
      },
    });
  }

  const finiteChannelCount = quarkChannels.filter((channel) =>
    isFiniteChannelParameters(channel.channelParameters),
  ).length;
  const issueCount = issues.length;

  return {
    reportId: `tetrahedral-quark-channel-diagnostic-v0:${args.childContext.childVertexId}`,
    method: 'tetrahedral-quark-channel-diagnostic-v0',
    channelScope: 'intermediate-quark-channel-only',
    childVertexId: args.childContext.childVertexId,
    sourceEdgeId: args.childContext.sourceEdgeId,
    complementEdgeId: args.childContext.complementEdgeId,
    projectionVertexIds: [
      args.childContext.projectionVertexIds[0],
      args.childContext.projectionVertexIds[1],
    ],
    channelCount: quarkChannels.length,
    finiteChannelCount,
    issueCount,
    ok: issueCount === 0,
    quarkChannels,
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

function toProfileMap(
  profileByVertexId: Map<string, FieldSourceProfile> | Record<string, FieldSourceProfile>,
): Map<string, FieldSourceProfile> {
  if (profileByVertexId instanceof Map) {
    return new Map(profileByVertexId);
  }

  return new Map(Object.entries(profileByVertexId));
}
