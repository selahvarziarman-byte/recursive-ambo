import type { Shape, Vec3 } from '../types/geometry';
import {
  buildClosedShapeSurfaceSourceDomain,
  sampleFieldAtlasAtPoint,
  type ClosedShapeSurfaceSourceDomain,
  type FieldAtlasSample,
  type FieldAtlasSource,
} from './fieldAtlas';
import {
  buildSurfaceChartSamplePoints,
  type SurfaceChartAtlasSample,
  type SurfaceChartSamplingOptions,
} from './fieldAtlasSurfaceSampling';
import type { ProfileAwareAtlasSourceEntry } from './fieldSourceProfileAwareAtlasAdapter';
import type { ProfileAwareShapePositionResolverReport } from './fieldSourceProfileAwareShapePositionResolver';

export type ProfileAwareShapeResolvedSurfaceAtlasIssueCode =
  | 'shape-position-resolver-not-ok'
  | 'closed-surface-domain-build-failed'
  | 'unexpected-atlas-source-kind'
  | 'non-finite-atlas-source-parameter'
  | 'missing-resolved-source-position'
  | 'non-finite-resolved-source-position'
  | 'no-executable-atlas-sources'
  | 'non-finite-surface-sample-position'
  | 'no-surface-samples'
  | 'surface-sample-count-exceeds-bound'
  | 'non-finite-sample-psi'
  | 'non-finite-sample-intensity'
  | 'negative-sample-intensity'
  | 'non-finite-sample-phase'
  | 'missing-contribution-ratio'
  | 'non-finite-contribution-ratio'
  | 'negative-contribution-ratio'
  | 'contribution-ratio-sum-mismatch';

export interface ProfileAwareShapeResolvedSurfaceAtlasIssue {
  code: ProfileAwareShapeResolvedSurfaceAtlasIssueCode;
  message: string;
  sourceId?: string;
  vertexId?: string;
  sampleId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface ProfileAwareShapeResolvedSurfaceAtlasSourceCountMetadata {
  fieldReadySourceCount?: number;
  fallbackChildSourceCount?: number;
  unresolvedChildSourceCount?: number;
  degeneracyStatusCount?: number;
}

export interface BuildProfileAwareShapeResolvedSurfaceAtlasReportArgs {
  shape: Shape;
  atlasSources: ProfileAwareAtlasSourceEntry[];
  resolverReport: ProfileAwareShapePositionResolverReport;
  samplingOptions?: SurfaceChartSamplingOptions;
  sourceCountMetadata?: ProfileAwareShapeResolvedSurfaceAtlasSourceCountMetadata;
  reportIdSuffix?: string;
}

export interface ProfileAwareShapeResolvedSurfaceAtlasNumberSummary {
  min: number | null;
  max: number | null;
  mean: number | null;
  finiteCount: number;
  nonFiniteCount: number;
}

export interface ProfileAwareShapeResolvedSurfaceAtlasContributionRatioSummary {
  sampleCount: number;
  validatedSampleCount: number;
  invalidSampleCount: number;
  minRatio: number | null;
  maxRatio: number | null;
  minRatioSum: number | null;
  maxRatioSum: number | null;
  maxRatioSumError: number | null;
}

export interface ProfileAwareShapeResolvedSurfaceAtlasReport {
  reportId: string;
  method: 'profile-aware-shape-resolved-surface-atlas-diagnostic-v0';
  diagnosticScope: 'shape-resolved-closed-surface-sampling-only';
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  policyRelativityStatus: 'policy-relative';
  contrastPolicyNote: 'old-policy-not-assumed-invariant';
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
  fieldAtlasMutationStatus: 'not-mutated';
  shapeId: string;
  domainId?: string;
  domainKind?: ClosedShapeSurfaceSourceDomain['kind'];
  chartCount: number;
  sampleCount: number;
  sampleCountBound: number;
  atlasInputSourceCount: number;
  executableSourceCount: number;
  primalAtlasSourceCount: number;
  childAtlasSourceCount: number;
  fallbackChildSourceCount: number;
  unresolvedChildSourceCount: number;
  degeneracyStatusCount: number;
  contributionRatioSummary: ProfileAwareShapeResolvedSurfaceAtlasContributionRatioSummary;
  intensitySummary: ProfileAwareShapeResolvedSurfaceAtlasNumberSummary;
  phaseSummary: ProfileAwareShapeResolvedSurfaceAtlasNumberSummary;
  issueCount: number;
  ok: boolean;
  issues: ProfileAwareShapeResolvedSurfaceAtlasIssue[];
}

interface PositionedProfileAwareSurfaceSource {
  adapterSource: ProfileAwareAtlasSourceEntry;
  fieldAtlasSource: FieldAtlasSource;
}

const METHOD = 'profile-aware-shape-resolved-surface-atlas-diagnostic-v0';
const DIAGNOSTIC_SCOPE = 'shape-resolved-closed-surface-sampling-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const CONTRAST_POLICY_NOTE = 'old-policy-not-assumed-invariant';
const RATIO_SUM_TOLERANCE = 1e-9;
const DEFAULT_SURFACE_SUBDIVISIONS = 1;
const DEFAULT_SURFACE_SAMPLE_BOUND = 96;

export function buildProfileAwareShapeResolvedSurfaceAtlasReport(
  args: BuildProfileAwareShapeResolvedSurfaceAtlasReportArgs,
): ProfileAwareShapeResolvedSurfaceAtlasReport {
  const issues: ProfileAwareShapeResolvedSurfaceAtlasIssue[] = [];
  const samplingOptions = {
    subdivisions: args.samplingOptions?.subdivisions ?? DEFAULT_SURFACE_SUBDIVISIONS,
    maxSamples: args.samplingOptions?.maxSamples ?? DEFAULT_SURFACE_SAMPLE_BOUND,
  };
  const sampleCountBound = samplingOptions.maxSamples;
  let domain: ClosedShapeSurfaceSourceDomain | undefined;
  let samples: SurfaceChartAtlasSample[] = [];

  if (!args.resolverReport.ok) {
    issues.push({
      code: 'shape-position-resolver-not-ok',
      message: 'Shape-resolved surface atlas cannot sample because the Shape position resolver report is not ok.',
      details: {
        resolverIssueCount: args.resolverReport.issueCount,
      },
    });
  }

  try {
    domain = buildClosedShapeSurfaceSourceDomain(args.shape);
  } catch (error) {
    issues.push({
      code: 'closed-surface-domain-build-failed',
      message: 'Closed Shape surface domain construction failed.',
      details: {
        reason: error instanceof Error ? error.message : String(error),
      },
    });
  }

  const positionedSources = args.resolverReport.ok
    ? buildPositionedProfileAwareSurfaceSources(args.atlasSources, args.resolverReport, issues)
    : [];
  const executableSources = positionedSources.map((source) => source.fieldAtlasSource);

  if (args.resolverReport.ok && executableSources.length === 0) {
    issues.push({
      code: 'no-executable-atlas-sources',
      message: 'Shape-resolved surface atlas has no executable profile-aware sources.',
    });
  }

  if (args.resolverReport.ok && domain && executableSources.length > 0) {
    const samplePoints = buildSurfaceChartSamplePoints(domain, samplingOptions);

    if (samplePoints.length === 0) {
      issues.push({
        code: 'no-surface-samples',
        message: 'Closed Shape surface sampling produced no bounded sample points.',
      });
    }

    if (samplePoints.length > sampleCountBound) {
      issues.push({
        code: 'surface-sample-count-exceeds-bound',
        message: 'Closed Shape surface sampling exceeded the requested diagnostic sample bound.',
        details: {
          sampleCount: samplePoints.length,
          sampleCountBound,
        },
      });
    }

    samples = samplePoints
      .filter((samplePoint) => {
        if (isFiniteVec3(samplePoint.position)) {
          return true;
        }

        issues.push({
          code: 'non-finite-surface-sample-position',
          message: `Surface sample ${samplePoint.id} has a non-finite position.`,
          sampleId: samplePoint.id,
        });
        return false;
      })
      .map((samplePoint) => {
        const sample = sampleFieldAtlasAtPoint(executableSources, samplePoint.position, {
          sampleId: samplePoint.id,
          localChartPosition: samplePoint.localChartPosition,
          barycentric: samplePoint.barycentric,
          chartId: samplePoint.chartId,
          chartSemanticRole: samplePoint.chartSemanticRole,
        });

        return {
          ...sample,
          localChartPosition: samplePoint.localChartPosition,
          barycentric: samplePoint.barycentric,
          barycentricIndices: samplePoint.barycentricIndices,
          subdivisions: samplePoint.subdivisions,
          chartId: samplePoint.chartId,
          chartSemanticRole: samplePoint.chartSemanticRole,
          sourceFaceId: samplePoint.sourceFaceId,
        };
      });
  }

  for (const sample of samples) {
    appendSurfaceSampleIssues(sample, executableSources.length, issues);
  }

  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:${args.reportIdSuffix ?? args.shape.id}`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    sourcePolicyId: SOURCE_POLICY_ID,
    policyRelativityStatus: 'policy-relative',
    contrastPolicyNote: CONTRAST_POLICY_NOTE,
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated',
    fieldAtlasMutationStatus: 'not-mutated',
    shapeId: args.shape.id,
    ...(domain ? { domainId: domain.id, domainKind: domain.kind } : {}),
    chartCount: domain?.surfaceCharts.length ?? 0,
    sampleCount: samples.length,
    sampleCountBound,
    atlasInputSourceCount: args.atlasSources.length,
    executableSourceCount: executableSources.length,
    primalAtlasSourceCount: args.atlasSources.filter(
      (source) => source.sourceKind === 'primal-assigned',
    ).length,
    childAtlasSourceCount: args.atlasSources.filter(
      (source) => source.sourceKind === 'generated-child-derived',
    ).length,
    fallbackChildSourceCount: args.sourceCountMetadata?.fallbackChildSourceCount ?? 0,
    unresolvedChildSourceCount:
      args.sourceCountMetadata?.unresolvedChildSourceCount ?? 0,
    degeneracyStatusCount: args.sourceCountMetadata?.degeneracyStatusCount ?? 0,
    contributionRatioSummary: summarizeContributionRatios(samples),
    intensitySummary: summarizeNumbers(samples.map((sample) => sample.intensity)),
    phaseSummary: summarizeNumbers(samples.map((sample) => sample.phase)),
    issueCount,
    ok: issueCount === 0,
    issues,
  };
}

function buildPositionedProfileAwareSurfaceSources(
  atlasSources: ProfileAwareAtlasSourceEntry[],
  resolverReport: ProfileAwareShapePositionResolverReport,
  issues: ProfileAwareShapeResolvedSurfaceAtlasIssue[],
): PositionedProfileAwareSurfaceSource[] {
  const positionedSources: PositionedProfileAwareSurfaceSource[] = [];

  atlasSources.forEach((source, sourceOrder) => {
    const runtimeSourceKind = String(source.sourceKind);

    if (
      runtimeSourceKind !== 'primal-assigned' &&
      runtimeSourceKind !== 'generated-child-derived'
    ) {
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

    const position = resolverReport.positionByVertexId[source.vertexId];

    if (!position) {
      issues.push({
        code: 'missing-resolved-source-position',
        message: `Source ${source.sourceId} references ${source.vertexId}, which has no Shape-resolved position.`,
        sourceId: source.sourceId,
        vertexId: source.vertexId,
      });
      return;
    }

    if (!isFiniteVec3(position)) {
      issues.push({
        code: 'non-finite-resolved-source-position',
        message: `Source ${source.sourceId} resolved to a non-finite Shape position.`,
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
        sourceOrder,
        policyName: SOURCE_POLICY_ID,
        label: source.vertexId,
      },
    });
  });

  return positionedSources;
}

function appendSurfaceSampleIssues(
  sample: FieldAtlasSample,
  executableSourceCount: number,
  issues: ProfileAwareShapeResolvedSurfaceAtlasIssue[],
): void {
  if (!Number.isFinite(sample.psi.re) || !Number.isFinite(sample.psi.im)) {
    issues.push({
      code: 'non-finite-sample-psi',
      message: `Surface sample ${sample.id} produced non-finite psi.`,
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
      message: `Surface sample ${sample.id} produced non-finite intensity.`,
      sampleId: sample.id,
      details: {
        intensity: sample.intensity,
      },
    });
  } else if (sample.intensity < 0) {
    issues.push({
      code: 'negative-sample-intensity',
      message: `Surface sample ${sample.id} produced negative intensity.`,
      sampleId: sample.id,
      details: {
        intensity: sample.intensity,
      },
    });
  }

  if (!Number.isFinite(sample.phase)) {
    issues.push({
      code: 'non-finite-sample-phase',
      message: `Surface sample ${sample.id} produced non-finite phase.`,
      sampleId: sample.id,
      details: {
        phase: sample.phase,
      },
    });
  }

  if (sample.contributionRatios.length !== executableSourceCount) {
    issues.push({
      code: 'missing-contribution-ratio',
      message: `Surface sample ${sample.id} contribution ratio count does not match executable source count.`,
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
        message: `Surface sample ${sample.id} has a non-finite contribution ratio.`,
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
        message: `Surface sample ${sample.id} has a negative contribution ratio.`,
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
      message: `Surface sample ${sample.id} contribution ratios do not sum to approximately 1.`,
      sampleId: sample.id,
      details: {
        ratioSum,
        expectedRatioSum: 1,
        tolerance: RATIO_SUM_TOLERANCE,
      },
    });
  }
}

function summarizeNumbers(
  values: number[],
): ProfileAwareShapeResolvedSurfaceAtlasNumberSummary {
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
): ProfileAwareShapeResolvedSurfaceAtlasContributionRatioSummary {
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
