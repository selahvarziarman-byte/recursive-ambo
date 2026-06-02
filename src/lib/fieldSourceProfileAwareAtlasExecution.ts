import type { Vec3 } from '../types/geometry';
import type { FieldAtlasSample, FieldAtlasSource } from './fieldAtlas';
import { sampleFieldAtlasAtPoint } from './fieldAtlas';
import type { ProfileAwareAtlasSourceEntry } from './fieldSourceProfileAwareAtlasAdapter';

export type ProfileAwareAtlasExecutionStatus = 'profile-aware-atlas-executed';
export type ProfileAwareAtlasExecutionPolicyRelativityStatus = 'policy-relative';
export type ProfileAwareAtlasExecutionContrastPolicyNote =
  'old-policy-not-assumed-invariant';
export type ProfileAwareAtlasExecutionDiagnosticScope =
  | 'bounded-tetrahedral-position-fixture-only'
  | 'explicit-position-map-bounded-samples-only';
export type ProfileAwareAtlasPositionMapInput =
  | Record<string, Vec3>
  | ReadonlyMap<string, Vec3>;

export type ProfileAwareAtlasExecutionIssueCode =
  | 'unexpected-atlas-source-kind'
  | 'non-finite-atlas-source-parameter'
  | 'missing-diagnostic-position'
  | 'non-finite-diagnostic-position'
  | 'non-finite-sample-position'
  | 'no-executable-atlas-sources'
  | 'non-finite-sample-psi'
  | 'non-finite-sample-intensity'
  | 'negative-sample-intensity'
  | 'non-finite-sample-phase'
  | 'missing-contribution-magnitude'
  | 'non-finite-contribution-magnitude'
  | 'negative-contribution-magnitude'
  | 'missing-contribution-ratio'
  | 'non-finite-contribution-ratio'
  | 'negative-contribution-ratio'
  | 'contribution-ratio-sum-mismatch';

export interface ProfileAwareAtlasExecutionIssue {
  code: ProfileAwareAtlasExecutionIssueCode;
  message: string;
  sourceId?: string;
  vertexId?: string;
  sampleId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface ProfileAwareAtlasExecutionSourceCountMetadata {
  fieldReadySourceCount?: number;
  fallbackChildSourceCount?: number;
  unresolvedChildSourceCount?: number;
  degeneracyStatusCount?: number;
}

export interface BuildProfileAwareAtlasExecutionReportOptions {
  reportIdSuffix?: string;
  profileSystemId?: string;
  profileSetupId?: string;
  childInheritanceGrammarId?: string;
  sourceCountMetadata?: ProfileAwareAtlasExecutionSourceCountMetadata;
}

export interface ProfileAwareAtlasExecutionSamplePoint {
  id: string;
  position: Vec3;
}

export interface BuildProfileAwareAtlasExecutionReportFromPositionsOptions
  extends BuildProfileAwareAtlasExecutionReportOptions {
  samplePoints?: ProfileAwareAtlasExecutionSamplePoint[];
  includeExecutableSourcePositionSamples?: boolean;
  diagnosticScope?: ProfileAwareAtlasExecutionDiagnosticScope;
  diagnosticPositionFixtureId?: 'regular-tetrahedron-midpoint-fixture-v0';
}

export interface ProfileAwareAtlasExecutionNumberSummary {
  min: number | null;
  max: number | null;
  mean: number | null;
  finiteCount: number;
  nonFiniteCount: number;
}

export interface ProfileAwareAtlasExecutionContributionRatioSummary {
  sampleCount: number;
  validatedSampleCount: number;
  invalidSampleCount: number;
  minRatio: number | null;
  maxRatio: number | null;
  minRatioSum: number | null;
  maxRatioSum: number | null;
  maxRatioSumError: number | null;
}

export interface ProfileAwareAtlasExecutionSampleSummary {
  sampleId: string;
  position: Vec3;
  psi: {
    re: number;
    im: number;
  };
  intensity: number;
  phase: number;
  contributionCount: number;
  contributionRatioSum: number;
  dominantContributionSourceId?: string;
  dominantContributionRatio?: number;
}

export interface ProfileAwareAtlasExecutionReport {
  reportId: string;
  method: 'profile-aware-field-atlas-execution-diagnostic-v0';
  diagnosticScope: ProfileAwareAtlasExecutionDiagnosticScope;
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  profileSystemId?: string;
  profileSetupId?: string;
  childInheritanceGrammarId?: string;
  fieldAtlasExecutionStatus: ProfileAwareAtlasExecutionStatus;
  policyRelativityStatus: ProfileAwareAtlasExecutionPolicyRelativityStatus;
  contrastPolicyNote: ProfileAwareAtlasExecutionContrastPolicyNote;
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
  fieldAtlasMutationStatus: 'not-mutated';
  diagnosticPositionFixtureId?: 'regular-tetrahedron-midpoint-fixture-v0';
  fieldReadySourceCount: number;
  atlasInputSourceCount: number;
  primalAtlasSourceCount: number;
  childAtlasSourceCount: number;
  fallbackChildSourceCount: number;
  unresolvedChildSourceCount: number;
  degeneracyStatusCount: number;
  executableSourceCount: number;
  missingPositionSourceCount: number;
  sampleCount: number;
  intensitySummary: ProfileAwareAtlasExecutionNumberSummary;
  phaseSummary: ProfileAwareAtlasExecutionNumberSummary;
  contributionRatioSummary: ProfileAwareAtlasExecutionContributionRatioSummary;
  issueCount: number;
  ok: boolean;
  sampleSummaries: ProfileAwareAtlasExecutionSampleSummary[];
  issues: ProfileAwareAtlasExecutionIssue[];
}

interface PositionedProfileAwareSource {
  adapterSource: ProfileAwareAtlasSourceEntry;
  fieldAtlasSource: FieldAtlasSource;
}

const METHOD = 'profile-aware-field-atlas-execution-diagnostic-v0';
const TETRAHEDRAL_FIXTURE_DIAGNOSTIC_SCOPE =
  'bounded-tetrahedral-position-fixture-only';
const EXPLICIT_POSITION_MAP_DIAGNOSTIC_SCOPE =
  'explicit-position-map-bounded-samples-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const POLICY_NAME = SOURCE_POLICY_ID;
const DIAGNOSTIC_POSITION_FIXTURE_ID = 'regular-tetrahedron-midpoint-fixture-v0';
const RATIO_SUM_TOLERANCE = 1e-9;
const TETRAHEDRON_CENTROID_SAMPLE_POINT: ProfileAwareAtlasExecutionSamplePoint = {
  id: 'tetrahedron:centroid',
  position: [0, 0, 0],
};

const PRIMAL_POSITIONS: Record<string, Vec3> = {
  A: [1, 1, 1],
  B: [-1, -1, 1],
  C: [-1, 1, -1],
  D: [1, -1, -1],
};

const EDGE_VERTEX_IDS: Array<[string, string]> = [
  ['A', 'B'],
  ['A', 'C'],
  ['A', 'D'],
  ['B', 'C'],
  ['B', 'D'],
  ['C', 'D'],
];

export function createDiagnosticTetrahedralPositionFixture(): Record<string, Vec3> {
  const positions: Record<string, Vec3> = {};

  for (const [vertexId, position] of Object.entries(PRIMAL_POSITIONS)) {
    positions[vertexId] = copyVec3(position);
  }

  for (const [firstVertexId, secondVertexId] of EDGE_VERTEX_IDS) {
    const first = PRIMAL_POSITIONS[firstVertexId];
    const second = PRIMAL_POSITIONS[secondVertexId];

    positions[`M_${firstVertexId}${secondVertexId}`] = midpointVec3(first, second);
  }

  return positions;
}

export function buildProfileAwareAtlasExecutionReport(
  atlasSources: ProfileAwareAtlasSourceEntry[],
  options: BuildProfileAwareAtlasExecutionReportOptions = {},
): ProfileAwareAtlasExecutionReport {
  return buildProfileAwareAtlasExecutionReportFromPositionMap(
    atlasSources,
    createDiagnosticTetrahedralPositionFixture(),
    {
      ...options,
      reportIdSuffix: options.reportIdSuffix ?? 'bounded-tetrahedral-fixture',
      diagnosticScope: TETRAHEDRAL_FIXTURE_DIAGNOSTIC_SCOPE,
      diagnosticPositionFixtureId: DIAGNOSTIC_POSITION_FIXTURE_ID,
      samplePoints: [TETRAHEDRON_CENTROID_SAMPLE_POINT],
      includeExecutableSourcePositionSamples: true,
    },
  );
}

export function buildProfileAwareAtlasExecutionReportFromPositionMap(
  atlasSources: ProfileAwareAtlasSourceEntry[],
  positionByVertexId: ProfileAwareAtlasPositionMapInput,
  options: BuildProfileAwareAtlasExecutionReportFromPositionsOptions = {},
): ProfileAwareAtlasExecutionReport {
  const issues: ProfileAwareAtlasExecutionIssue[] = [];
  const positionedSources = buildPositionedSources(
    atlasSources,
    positionByVertexId,
    issues,
  );
  const fieldAtlasSources = positionedSources.map((source) => source.fieldAtlasSource);
  const samplePoints = buildBoundedSamplePoints(positionedSources, options, issues);
  const samples = samplePoints.map((samplePoint) =>
    sampleFieldAtlasAtPoint(fieldAtlasSources, samplePoint.position, {
      sampleId: samplePoint.id,
    }),
  );

  if (fieldAtlasSources.length === 0) {
    issues.push({
      code: 'no-executable-atlas-sources',
      message: 'Profile-aware atlas execution has no positioned executable sources.',
    });
  }

  for (const sample of samples) {
    appendSampleIssues(sample, fieldAtlasSources.length, issues);
  }

  const sampleSummaries = samples.map(summarizeSample);
  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:${options.reportIdSuffix ?? 'explicit-position-map'}`,
    method: METHOD,
    diagnosticScope:
      options.diagnosticScope ?? EXPLICIT_POSITION_MAP_DIAGNOSTIC_SCOPE,
    sourcePolicyId: SOURCE_POLICY_ID,
    ...(options.profileSystemId ? { profileSystemId: options.profileSystemId } : {}),
    ...(options.profileSetupId ? { profileSetupId: options.profileSetupId } : {}),
    ...(options.childInheritanceGrammarId
      ? { childInheritanceGrammarId: options.childInheritanceGrammarId }
      : {}),
    fieldAtlasExecutionStatus: 'profile-aware-atlas-executed',
    policyRelativityStatus: 'policy-relative',
    contrastPolicyNote: 'old-policy-not-assumed-invariant',
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated',
    fieldAtlasMutationStatus: 'not-mutated',
    ...(options.diagnosticPositionFixtureId
      ? { diagnosticPositionFixtureId: options.diagnosticPositionFixtureId }
      : {}),
    fieldReadySourceCount:
      options.sourceCountMetadata?.fieldReadySourceCount ?? atlasSources.length,
    atlasInputSourceCount: atlasSources.length,
    primalAtlasSourceCount: atlasSources.filter(
      (source) => source.sourceKind === 'primal-assigned',
    ).length,
    childAtlasSourceCount: atlasSources.filter(
      (source) => source.sourceKind === 'generated-child-derived',
    ).length,
    fallbackChildSourceCount:
      options.sourceCountMetadata?.fallbackChildSourceCount ?? 0,
    unresolvedChildSourceCount:
      options.sourceCountMetadata?.unresolvedChildSourceCount ?? 0,
    degeneracyStatusCount: options.sourceCountMetadata?.degeneracyStatusCount ?? 0,
    executableSourceCount: fieldAtlasSources.length,
    missingPositionSourceCount: issues.filter(
      (issue) => issue.code === 'missing-diagnostic-position',
    ).length,
    sampleCount: samples.length,
    intensitySummary: summarizeNumbers(samples.map((sample) => sample.intensity)),
    phaseSummary: summarizeNumbers(samples.map((sample) => sample.phase)),
    contributionRatioSummary: summarizeContributionRatios(samples),
    issueCount,
    ok: issueCount === 0,
    sampleSummaries,
    issues,
  };
}

function buildPositionedSources(
  atlasSources: ProfileAwareAtlasSourceEntry[],
  positionByVertexId: ProfileAwareAtlasPositionMapInput,
  issues: ProfileAwareAtlasExecutionIssue[],
): PositionedProfileAwareSource[] {
  const positionedSources: PositionedProfileAwareSource[] = [];

  atlasSources.forEach((source, sourceIndex) => {
    const runtimeSourceKind = String(source.sourceKind);

    if (!isAllowedExecutionSourceKind(runtimeSourceKind)) {
      issues.push({
        code: 'unexpected-atlas-source-kind',
        message: `Source ${source.sourceId} has unexpected atlas source kind ${runtimeSourceKind}.`,
        sourceId: source.sourceId,
        vertexId: source.vertexId,
        details: {
          sourceKind: runtimeSourceKind,
        },
      });
      return;
    }

    if (!hasFiniteEmissionParameters(source)) {
      issues.push({
        code: 'non-finite-atlas-source-parameter',
        message: `Source ${source.sourceId} has non-finite emission parameters.`,
        sourceId: source.sourceId,
        vertexId: source.vertexId,
      });
      return;
    }

    const position = resolvePosition(positionByVertexId, source.vertexId);

    if (!position) {
      issues.push({
        code: 'missing-diagnostic-position',
        message: `Source ${source.sourceId} references vertex ${source.vertexId}, which has no caller-supplied execution position.`,
        sourceId: source.sourceId,
        vertexId: source.vertexId,
      });
      return;
    }

    if (!isFiniteVec3(position)) {
      issues.push({
        code: 'non-finite-diagnostic-position',
        message: `Source ${source.sourceId} resolved to a non-finite diagnostic position.`,
        sourceId: source.sourceId,
        vertexId: source.vertexId,
      });
      return;
    }

    positionedSources.push({
      adapterSource: source,
      fieldAtlasSource: {
        sourceId: source.sourceId,
        vertexId: source.vertexId,
        position: copyVec3(position),
        amplitude: source.amplitude,
        waveNumber: source.waveNumber,
        phase: source.phase,
        attenuation: source.attenuation,
        sourceKind:
          source.sourceKind === 'primal-assigned' ? 'seed' : 'ambo-midpoint-child',
        sourceOrder: sourceIndex,
        policyName: POLICY_NAME,
        label: source.vertexId,
      },
    });
  });

  return positionedSources;
}

function buildBoundedSamplePoints(
  positionedSources: PositionedProfileAwareSource[],
  options: BuildProfileAwareAtlasExecutionReportFromPositionsOptions,
  issues: ProfileAwareAtlasExecutionIssue[],
): ProfileAwareAtlasExecutionSamplePoint[] {
  const samplePoints: ProfileAwareAtlasExecutionSamplePoint[] = [];
  const includeSourcePositionSamples =
    options.includeExecutableSourcePositionSamples ?? true;

  if (includeSourcePositionSamples) {
    samplePoints.push(
      ...positionedSources.map((source) => ({
        id: `source-position:${source.adapterSource.sourceId}`,
        position: copyVec3(source.fieldAtlasSource.position),
      })),
    );
  }

  for (const samplePoint of options.samplePoints ?? []) {
    if (!isFiniteVec3(samplePoint.position)) {
      issues.push({
        code: 'non-finite-sample-position',
        message: `Sample point ${samplePoint.id} has a non-finite position.`,
        sampleId: samplePoint.id,
      });
      continue;
    }

    samplePoints.push({
      id: samplePoint.id,
      position: copyVec3(samplePoint.position),
    });
  }

  return samplePoints;
}

function appendSampleIssues(
  sample: FieldAtlasSample,
  executableSourceCount: number,
  issues: ProfileAwareAtlasExecutionIssue[],
): void {
  if (!Number.isFinite(sample.psi.re) || !Number.isFinite(sample.psi.im)) {
    issues.push({
      code: 'non-finite-sample-psi',
      message: `Sample ${sample.id} produced non-finite psi.`,
      sampleId: sample.id,
      details: {
        psiRe: sample.psi.re,
        psiIm: sample.psi.im,
      },
    });
  }

  if (!Number.isFinite(sample.intensity)) {
    issues.push({
      code: 'non-finite-sample-intensity',
      message: `Sample ${sample.id} produced non-finite intensity.`,
      sampleId: sample.id,
      details: {
        intensity: sample.intensity,
      },
    });
  } else if (sample.intensity < 0) {
    issues.push({
      code: 'negative-sample-intensity',
      message: `Sample ${sample.id} produced negative intensity.`,
      sampleId: sample.id,
      details: {
        intensity: sample.intensity,
      },
    });
  }

  if (!Number.isFinite(sample.phase)) {
    issues.push({
      code: 'non-finite-sample-phase',
      message: `Sample ${sample.id} produced non-finite phase.`,
      sampleId: sample.id,
      details: {
        phase: sample.phase,
      },
    });
  }

  if (sample.contributionMagnitudes.length !== executableSourceCount) {
    issues.push({
      code: 'missing-contribution-magnitude',
      message: `Sample ${sample.id} contribution magnitude count does not match executable source count.`,
      sampleId: sample.id,
      details: {
        contributionMagnitudeCount: sample.contributionMagnitudes.length,
        executableSourceCount,
      },
    });
  }

  for (const magnitude of sample.contributionMagnitudes) {
    if (!Number.isFinite(magnitude.value)) {
      issues.push({
        code: 'non-finite-contribution-magnitude',
        message: `Sample ${sample.id} has a non-finite contribution magnitude.`,
        sampleId: sample.id,
        sourceId: magnitude.sourceId,
        vertexId: magnitude.vertexId,
        details: {
          value: magnitude.value,
        },
      });
    } else if (magnitude.value < 0) {
      issues.push({
        code: 'negative-contribution-magnitude',
        message: `Sample ${sample.id} has a negative contribution magnitude.`,
        sampleId: sample.id,
        sourceId: magnitude.sourceId,
        vertexId: magnitude.vertexId,
        details: {
          value: magnitude.value,
        },
      });
    }
  }

  if (sample.contributionRatios.length !== executableSourceCount) {
    issues.push({
      code: 'missing-contribution-ratio',
      message: `Sample ${sample.id} contribution ratio count does not match executable source count.`,
      sampleId: sample.id,
      details: {
        contributionRatioCount: sample.contributionRatios.length,
        executableSourceCount,
      },
    });
  }

  for (const ratio of sample.contributionRatios) {
    if (!Number.isFinite(ratio.value)) {
      issues.push({
        code: 'non-finite-contribution-ratio',
        message: `Sample ${sample.id} has a non-finite contribution ratio.`,
        sampleId: sample.id,
        sourceId: ratio.sourceId,
        vertexId: ratio.vertexId,
        details: {
          value: ratio.value,
        },
      });
    } else if (ratio.value < 0) {
      issues.push({
        code: 'negative-contribution-ratio',
        message: `Sample ${sample.id} has a negative contribution ratio.`,
        sampleId: sample.id,
        sourceId: ratio.sourceId,
        vertexId: ratio.vertexId,
        details: {
          value: ratio.value,
        },
      });
    }
  }

  if (executableSourceCount === 0) {
    return;
  }

  const ratioSum = sample.contributionRatios.reduce(
    (sum, ratio) => sum + ratio.value,
    0,
  );

  if (
    !Number.isFinite(ratioSum) ||
    Math.abs(ratioSum - 1) > RATIO_SUM_TOLERANCE
  ) {
    issues.push({
      code: 'contribution-ratio-sum-mismatch',
      message: `Sample ${sample.id} contribution ratios do not sum to approximately 1.`,
      sampleId: sample.id,
      details: {
        ratioSum,
        expectedRatioSum: 1,
        tolerance: RATIO_SUM_TOLERANCE,
      },
    });
  }
}

function summarizeSample(sample: FieldAtlasSample): ProfileAwareAtlasExecutionSampleSummary {
  const contributionRatioSum = sample.contributionRatios.reduce(
    (sum, ratio) => sum + ratio.value,
    0,
  );
  const dominantRatio = sample.contributionRatios.reduce<
    FieldAtlasSample['contributionRatios'][number] | undefined
  >((dominant, ratio) => {
    if (!dominant || ratio.value > dominant.value) {
      return ratio;
    }

    return dominant;
  }, undefined);

  return {
    sampleId: sample.id,
    position: copyVec3(sample.position),
    psi: {
      re: sample.psi.re,
      im: sample.psi.im,
    },
    intensity: sample.intensity,
    phase: sample.phase,
    contributionCount: sample.contributionRatios.length,
    contributionRatioSum,
    ...(dominantRatio
      ? {
          dominantContributionSourceId: dominantRatio.sourceId,
          dominantContributionRatio: dominantRatio.value,
        }
      : {}),
  };
}

function summarizeNumbers(values: number[]): ProfileAwareAtlasExecutionNumberSummary {
  const finiteValues = values.filter((value) => Number.isFinite(value));
  const finiteCount = finiteValues.length;

  if (finiteCount === 0) {
    return {
      min: null,
      max: null,
      mean: null,
      finiteCount,
      nonFiniteCount: values.length - finiteCount,
    };
  }

  return {
    min: Math.min(...finiteValues),
    max: Math.max(...finiteValues),
    mean: finiteValues.reduce((sum, value) => sum + value, 0) / finiteCount,
    finiteCount,
    nonFiniteCount: values.length - finiteCount,
  };
}

function summarizeContributionRatios(
  samples: FieldAtlasSample[],
): ProfileAwareAtlasExecutionContributionRatioSummary {
  const ratios = samples.flatMap((sample) =>
    sample.contributionRatios.map((ratio) => ratio.value),
  );
  const finiteRatios = ratios.filter((ratio) => Number.isFinite(ratio));
  const ratioSums = samples.map((sample) =>
    sample.contributionRatios.reduce((sum, ratio) => sum + ratio.value, 0),
  );
  const finiteRatioSums = ratioSums.filter((ratioSum) => Number.isFinite(ratioSum));
  const ratioSumErrors = finiteRatioSums.map((ratioSum) => Math.abs(ratioSum - 1));
  const invalidSampleCount = ratioSums.filter(
    (ratioSum) =>
      !Number.isFinite(ratioSum) || Math.abs(ratioSum - 1) > RATIO_SUM_TOLERANCE,
  ).length;

  return {
    sampleCount: samples.length,
    validatedSampleCount: samples.length - invalidSampleCount,
    invalidSampleCount,
    minRatio: finiteRatios.length > 0 ? Math.min(...finiteRatios) : null,
    maxRatio: finiteRatios.length > 0 ? Math.max(...finiteRatios) : null,
    minRatioSum: finiteRatioSums.length > 0 ? Math.min(...finiteRatioSums) : null,
    maxRatioSum: finiteRatioSums.length > 0 ? Math.max(...finiteRatioSums) : null,
    maxRatioSumError:
      ratioSumErrors.length > 0 ? Math.max(...ratioSumErrors) : null,
  };
}

function hasFiniteEmissionParameters(source: ProfileAwareAtlasSourceEntry): boolean {
  return (
    Number.isFinite(source.amplitude) &&
    Number.isFinite(source.waveNumber) &&
    Number.isFinite(source.phase) &&
    Number.isFinite(source.attenuation)
  );
}

function isAllowedExecutionSourceKind(
  sourceKind: string,
): sourceKind is ProfileAwareAtlasSourceEntry['sourceKind'] {
  return sourceKind === 'primal-assigned' || sourceKind === 'generated-child-derived';
}

function resolvePosition(
  positionByVertexId: ProfileAwareAtlasPositionMapInput,
  vertexId: string,
): Vec3 | undefined {
  if (isReadonlyMap(positionByVertexId)) {
    return positionByVertexId.get(vertexId);
  }

  return positionByVertexId[vertexId];
}

function isReadonlyMap(
  positionByVertexId: ProfileAwareAtlasPositionMapInput,
): positionByVertexId is ReadonlyMap<string, Vec3> {
  return typeof (positionByVertexId as ReadonlyMap<string, Vec3>).get === 'function';
}

function midpointVec3(first: Vec3, second: Vec3): Vec3 {
  return [
    (first[0] + second[0]) / 2,
    (first[1] + second[1]) / 2,
    (first[2] + second[2]) / 2,
  ];
}

function copyVec3(position: Vec3): Vec3 {
  return [position[0], position[1], position[2]];
}

function isFiniteVec3(position: Vec3): boolean {
  return (
    Number.isFinite(position[0]) &&
    Number.isFinite(position[1]) &&
    Number.isFinite(position[2])
  );
}
