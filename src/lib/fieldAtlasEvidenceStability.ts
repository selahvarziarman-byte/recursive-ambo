import {
  DEFAULT_FIELD_ATLAS_SOURCE_POLICY,
  PARENT_INHERITANCE_FIELD_ATLAS_SOURCE_POLICY,
  type FieldAtlasSourcePolicy,
} from './fieldAtlas';
import {
  buildFieldFeatureReportFromAtlas,
  type SupportedFieldFeatureReport,
} from './fieldAtlasFeatureReport';
import {
  buildFieldRouteGateCandidateReport,
  type FieldRouteGateCandidateReport,
} from './fieldAtlasRouteGateCandidates';
import {
  buildFieldSupportRegionCandidateReport,
  type FieldSupportRegionCandidateReport,
} from './fieldAtlasSupportRegionCandidates';
import {
  sampleClosedShapeSurfaceAtlas,
  type SampledClosedShapeSurfaceAtlas,
} from './fieldAtlasSurfaceSampling';
import type { Shape } from '../types/geometry';

export type FieldEvidenceStabilityMethod = 'field-evidence-stability-v0';
export type FieldEvidenceStabilityStatus = 'diagnostic-only';
export type FieldEvidenceStabilitySemanticStatus = 'not-semantic-naming';
export type FieldEvidenceStabilityTopologyStatus = 'not-topology-workspace';
export type FieldEvidenceStabilityPhaseContinuityStatus =
  'not-global-phase-continuity';
export type FieldEvidenceStabilityLabel =
  | 'stable-counts'
  | 'sampling-sensitive'
  | 'policy-sensitive'
  | 'saturated'
  | 'mixed-instability';
export type FieldEvidenceStabilityLayer =
  | 'field-feature-report-v0'
  | 'field-route-gate-candidates-v0'
  | 'field-support-region-candidates-v0';
export type FieldEvidenceVariantStatus = 'built';

export interface FieldEvidenceStabilityCaseInput {
  caseLabel: string;
  shape: Shape;
}

export interface FieldEvidenceStabilityOptions {
  samplingSubdivisions?: number[];
  sourcePolicies?: FieldAtlasSourcePolicy[];
}

export interface ResolvedFieldEvidenceStabilityOptions {
  samplingSubdivisions: number[];
  sourcePolicies: FieldAtlasSourcePolicy[];
}

export interface FieldEvidenceCountVariance {
  layer: FieldEvidenceStabilityLayer;
  countKey: string;
  min: number;
  max: number;
  changed: boolean;
}

export interface FieldEvidenceSensitivitySummary {
  sensitive: boolean;
  changedKeys: string[];
}

export interface FieldEvidenceMaxBucketSaturationFlags {
  routeGateGatesReachedMax: boolean;
  routeGateRoutesReachedMax: boolean;
  routeGateBlockedReachedMax: boolean;
  supportRegionSupportClassesReachedMax: boolean;
  supportRegionRegionsReachedMax: boolean;
  supportRegionConstraintsReachedMax: boolean;
  supportRegionRouteFailuresReachedMax: boolean;
  anyMaxBucketSaturated: boolean;
}

export interface FieldEvidenceVariantLayerSummary {
  layer: FieldEvidenceStabilityLayer;
  totalCount: number;
  countsByKind: Record<string, number>;
  computationalOnlyCandidateCount: number;
  seamInvolvedCandidateCount: number;
  maxBucketSaturation: FieldEvidenceMaxBucketSaturationFlags;
}

export interface FieldEvidenceStabilityVariantSummary {
  variantId: string;
  variantStatus: FieldEvidenceVariantStatus;
  caseLabel: string;
  samplingSubdivisions: number;
  sourcePolicyName: string;
  sourcePolicyNames: string[];
  sampleCount: number;
  chartCount: number;
  layerSummaries: FieldEvidenceVariantLayerSummary[];
  computationalOnlyCandidateCount: number;
  seamInvolvedCandidateCount: number;
  maxBucketSaturation: FieldEvidenceMaxBucketSaturationFlags;
}

export interface FieldEvidenceLayerStabilitySummary {
  layer: FieldEvidenceStabilityLayer;
  countVarianceByCandidateKind: FieldEvidenceCountVariance[];
  sourcePolicySensitivity: FieldEvidenceSensitivitySummary;
  samplingSensitivity: FieldEvidenceSensitivitySummary;
  maxBucketSaturation: FieldEvidenceMaxBucketSaturationFlags;
  computationalOnlyDependence: boolean;
  seamEdgeDependence: boolean;
  stabilityLabels: FieldEvidenceStabilityLabel[];
}

export interface FieldEvidenceCaseStabilitySummary {
  caseLabel: string;
  variantCount: number;
  variants: FieldEvidenceStabilityVariantSummary[];
  countVarianceByCandidateKind: FieldEvidenceCountVariance[];
  layerSummaries: FieldEvidenceLayerStabilitySummary[];
  sourcePolicySensitivity: FieldEvidenceSensitivitySummary;
  samplingSensitivity: FieldEvidenceSensitivitySummary;
  maxBucketSaturation: FieldEvidenceMaxBucketSaturationFlags;
  computationalOnlyDependence: boolean;
  seamEdgeDependence: boolean;
  stabilityLabels: FieldEvidenceStabilityLabel[];
  notes: string[];
  warnings: string[];
}

export interface FieldEvidenceStabilityReport {
  reportId: string;
  method: FieldEvidenceStabilityMethod;
  status: FieldEvidenceStabilityStatus;
  semanticStatus: FieldEvidenceStabilitySemanticStatus;
  topologyStatus: FieldEvidenceStabilityTopologyStatus;
  phaseContinuityStatus: FieldEvidenceStabilityPhaseContinuityStatus;
  casesCompared: string[];
  samplingSubdivisionsCompared: number[];
  sourcePoliciesCompared: string[];
  caseSummaries: FieldEvidenceCaseStabilitySummary[];
  layerSummaries: FieldEvidenceLayerStabilitySummary[];
  notes: string[];
  warnings: string[];
  options: ResolvedFieldEvidenceStabilityOptions;
}

const METHOD: FieldEvidenceStabilityMethod = 'field-evidence-stability-v0';
const STATUS: FieldEvidenceStabilityStatus = 'diagnostic-only';
const SEMANTIC_STATUS: FieldEvidenceStabilitySemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: FieldEvidenceStabilityTopologyStatus =
  'not-topology-workspace';
const PHASE_CONTINUITY_STATUS: FieldEvidenceStabilityPhaseContinuityStatus =
  'not-global-phase-continuity';
const DEFAULT_SAMPLING_SUBDIVISIONS = [1, 2, 3];
const DEFAULT_SOURCE_POLICIES = [
  DEFAULT_FIELD_ATLAS_SOURCE_POLICY,
  PARENT_INHERITANCE_FIELD_ATLAS_SOURCE_POLICY,
];
const LAYERS: FieldEvidenceStabilityLayer[] = [
  'field-feature-report-v0',
  'field-route-gate-candidates-v0',
  'field-support-region-candidates-v0',
];

export function buildFieldEvidenceStabilityReportForShape(
  shape: Shape,
  caseLabel: string,
  options: FieldEvidenceStabilityOptions = {},
): FieldEvidenceStabilityReport {
  return buildFieldEvidenceStabilityReport(
    [{ caseLabel, shape }],
    options,
  );
}

export function buildFieldEvidenceStabilityReport(
  cases: FieldEvidenceStabilityCaseInput[],
  options: FieldEvidenceStabilityOptions = {},
): FieldEvidenceStabilityReport {
  const resolvedOptions = resolveFieldEvidenceStabilityOptions(options);
  const caseSummaries = cases.map((caseInput) =>
    buildCaseSummary(caseInput, resolvedOptions),
  );
  const allVariants = caseSummaries.flatMap((caseSummary) => caseSummary.variants);
  const layerSummaries = buildLayerSummaries(allVariants);

  return {
    reportId: `field-evidence-stability-v0:${cases
      .map((caseInput) => sanitizeIdFragment(caseInput.caseLabel))
      .join('+') || 'empty'}`,
    method: METHOD,
    status: STATUS,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    phaseContinuityStatus: PHASE_CONTINUITY_STATUS,
    casesCompared: cases.map((caseInput) => caseInput.caseLabel),
    samplingSubdivisionsCompared: [...resolvedOptions.samplingSubdivisions],
    sourcePoliciesCompared: resolvedOptions.sourcePolicies.map((policy) => policy.name),
    caseSummaries,
    layerSummaries,
    notes: uniqueSorted(caseSummaries.flatMap((caseSummary) => caseSummary.notes)),
    warnings: uniqueSorted(caseSummaries.flatMap((caseSummary) => caseSummary.warnings)),
    options: resolvedOptions,
  };
}

function buildCaseSummary(
  caseInput: FieldEvidenceStabilityCaseInput,
  options: ResolvedFieldEvidenceStabilityOptions,
): FieldEvidenceCaseStabilitySummary {
  const variants = options.samplingSubdivisions.flatMap((subdivisions) =>
    options.sourcePolicies.map((sourcePolicy) =>
      buildVariantSummary(caseInput, subdivisions, sourcePolicy),
    ),
  );
  const layerSummaries = buildLayerSummaries(variants);
  const countVarianceByCandidateKind = buildCountVariance(variants);
  const sourcePolicySensitivity = buildSourcePolicySensitivity(variants);
  const samplingSensitivity = buildSamplingSensitivity(variants);
  const maxBucketSaturation = mergeMaxBucketSaturation(
    variants.map((variant) => variant.maxBucketSaturation),
  );
  const computationalOnlyDependence = variants.some(
    (variant) => variant.computationalOnlyCandidateCount > 0,
  );
  const seamEdgeDependence = variants.some(
    (variant) => variant.seamInvolvedCandidateCount > 0,
  );
  const stabilityLabels = buildStabilityLabels(
    samplingSensitivity.sensitive,
    sourcePolicySensitivity.sensitive,
    maxBucketSaturation.anyMaxBucketSaturated,
  );

  return {
    caseLabel: caseInput.caseLabel,
    variantCount: variants.length,
    variants,
    countVarianceByCandidateKind,
    layerSummaries,
    sourcePolicySensitivity,
    samplingSensitivity,
    maxBucketSaturation,
    computationalOnlyDependence,
    seamEdgeDependence,
    stabilityLabels,
    notes: buildNotes(
      samplingSensitivity,
      sourcePolicySensitivity,
      maxBucketSaturation,
      computationalOnlyDependence,
      seamEdgeDependence,
    ),
    warnings: buildWarnings(maxBucketSaturation),
  };
}

function buildVariantSummary(
  caseInput: FieldEvidenceStabilityCaseInput,
  samplingSubdivisions: number,
  sourcePolicy: FieldAtlasSourcePolicy,
): FieldEvidenceStabilityVariantSummary {
  const sampledAtlas = sampleClosedShapeSurfaceAtlas(caseInput.shape, {
    subdivisions: samplingSubdivisions,
    sourcePolicy,
  });
  const featureReport = buildFieldFeatureReportFromAtlas(sampledAtlas);
  const routeGateReport = buildFieldRouteGateCandidateReport(sampledAtlas);
  const supportRegionReport = buildFieldSupportRegionCandidateReport(sampledAtlas);
  const maxBucketSaturation = buildMaxBucketSaturationFlags(
    routeGateReport,
    supportRegionReport,
  );
  const layerSummaries = buildVariantLayerSummaries(
    featureReport,
    routeGateReport,
    supportRegionReport,
    maxBucketSaturation,
  );

  return {
    variantId:
      `field-evidence-stability:v0:${sanitizeIdFragment(caseInput.caseLabel)}` +
      `:subdivisions-${samplingSubdivisions}:policy-${sanitizeIdFragment(sourcePolicy.name)}`,
    variantStatus: 'built',
    caseLabel: caseInput.caseLabel,
    samplingSubdivisions,
    sourcePolicyName: sourcePolicy.name,
    sourcePolicyNames: getSourcePolicyNames(sampledAtlas),
    sampleCount: sampledAtlas.samples.length,
    chartCount: sampledAtlas.domain.surfaceCharts.length,
    layerSummaries,
    computationalOnlyCandidateCount: layerSummaries.reduce(
      (sum, layerSummary) => sum + layerSummary.computationalOnlyCandidateCount,
      0,
    ),
    seamInvolvedCandidateCount: layerSummaries.reduce(
      (sum, layerSummary) => sum + layerSummary.seamInvolvedCandidateCount,
      0,
    ),
    maxBucketSaturation,
  };
}

function buildVariantLayerSummaries(
  featureReport: SupportedFieldFeatureReport,
  routeGateReport: FieldRouteGateCandidateReport,
  supportRegionReport: FieldSupportRegionCandidateReport,
  maxBucketSaturation: FieldEvidenceMaxBucketSaturationFlags,
): FieldEvidenceVariantLayerSummary[] {
  return [
    {
      layer: 'field-feature-report-v0',
      totalCount: featureReport.observationSummary.totalObservations,
      countsByKind: {
        total: featureReport.observationSummary.totalObservations,
        'cancellation-like-site-candidate':
          featureReport.observationSummary.cancellationLikeCount,
        'high-intensity-anchor-candidate':
          featureReport.observationSummary.highIntensityAnchorCount,
        'ambiguous-field-site': featureReport.observationSummary.ambiguousCount,
      },
      computationalOnlyCandidateCount:
        featureReport.observationSummary.computationalOnlyObservationCount,
      seamInvolvedCandidateCount: 0,
      maxBucketSaturation: emptyMaxBucketSaturationFlags(),
    },
    {
      layer: 'field-route-gate-candidates-v0',
      totalCount: routeGateReport.candidateSummary.totalCandidateCount,
      countsByKind: {
        total: routeGateReport.candidateSummary.totalCandidateCount,
        'gate-candidate': routeGateReport.candidateSummary.gateCandidateCount,
        'route-candidate': routeGateReport.candidateSummary.routeCandidateCount,
        'blocked-or-failed-route-candidate':
          routeGateReport.candidateSummary.blockedRouteCandidateCount,
      },
      computationalOnlyCandidateCount: routeGateReport.candidates.filter(
        (candidate) => candidate.evidenceProfile.computationalOnlySampleCount > 0,
      ).length,
      seamInvolvedCandidateCount: routeGateReport.candidates.filter(
        (candidate) => candidate.seamEdgesInvolved,
      ).length,
      maxBucketSaturation: {
        ...emptyMaxBucketSaturationFlags(),
        routeGateGatesReachedMax: maxBucketSaturation.routeGateGatesReachedMax,
        routeGateRoutesReachedMax: maxBucketSaturation.routeGateRoutesReachedMax,
        routeGateBlockedReachedMax: maxBucketSaturation.routeGateBlockedReachedMax,
        anyMaxBucketSaturated:
          maxBucketSaturation.routeGateGatesReachedMax ||
          maxBucketSaturation.routeGateRoutesReachedMax ||
          maxBucketSaturation.routeGateBlockedReachedMax,
      },
    },
    {
      layer: 'field-support-region-candidates-v0',
      totalCount: supportRegionReport.candidateSummary.totalCandidateCount,
      countsByKind: {
        total: supportRegionReport.candidateSummary.totalCandidateCount,
        'support-class-candidate':
          supportRegionReport.candidateSummary.supportClassCandidateCount,
        'region-candidate': supportRegionReport.candidateSummary.regionCandidateCount,
        'constraint-site-candidate':
          supportRegionReport.candidateSummary.constraintSiteCandidateCount,
        'route-failure-region-candidate':
          supportRegionReport.candidateSummary.routeFailureRegionCandidateCount,
      },
      computationalOnlyCandidateCount: supportRegionReport.candidates.filter(
        (candidate) => candidate.computationalOnlyInvolved,
      ).length,
      seamInvolvedCandidateCount: supportRegionReport.candidates.filter(
        (candidate) => candidate.seamEdgesInvolved,
      ).length,
      maxBucketSaturation: {
        ...emptyMaxBucketSaturationFlags(),
        supportRegionSupportClassesReachedMax:
          maxBucketSaturation.supportRegionSupportClassesReachedMax,
        supportRegionRegionsReachedMax:
          maxBucketSaturation.supportRegionRegionsReachedMax,
        supportRegionConstraintsReachedMax:
          maxBucketSaturation.supportRegionConstraintsReachedMax,
        supportRegionRouteFailuresReachedMax:
          maxBucketSaturation.supportRegionRouteFailuresReachedMax,
        anyMaxBucketSaturated:
          maxBucketSaturation.supportRegionSupportClassesReachedMax ||
          maxBucketSaturation.supportRegionRegionsReachedMax ||
          maxBucketSaturation.supportRegionConstraintsReachedMax ||
          maxBucketSaturation.supportRegionRouteFailuresReachedMax,
      },
    },
  ];
}

function buildLayerSummaries(
  variants: FieldEvidenceStabilityVariantSummary[],
): FieldEvidenceLayerStabilitySummary[] {
  return LAYERS.map((layer) => {
    const countVarianceByCandidateKind = buildCountVariance(variants, layer);
    const sourcePolicySensitivity = buildSourcePolicySensitivity(variants, layer);
    const samplingSensitivity = buildSamplingSensitivity(variants, layer);
    const layerVariantSummaries = variants
      .map((variant) => getVariantLayerSummary(variant, layer))
      .filter(
        (summary): summary is FieldEvidenceVariantLayerSummary => Boolean(summary),
      );
    const maxBucketSaturation = mergeMaxBucketSaturation(
      layerVariantSummaries.map((summary) => summary.maxBucketSaturation),
    );
    const computationalOnlyDependence = layerVariantSummaries.some(
      (summary) => summary.computationalOnlyCandidateCount > 0,
    );
    const seamEdgeDependence = layerVariantSummaries.some(
      (summary) => summary.seamInvolvedCandidateCount > 0,
    );

    return {
      layer,
      countVarianceByCandidateKind,
      sourcePolicySensitivity,
      samplingSensitivity,
      maxBucketSaturation,
      computationalOnlyDependence,
      seamEdgeDependence,
      stabilityLabels: buildStabilityLabels(
        samplingSensitivity.sensitive,
        sourcePolicySensitivity.sensitive,
        maxBucketSaturation.anyMaxBucketSaturated,
      ),
    };
  });
}

function buildCountVariance(
  variants: FieldEvidenceStabilityVariantSummary[],
  layerFilter?: FieldEvidenceStabilityLayer,
): FieldEvidenceCountVariance[] {
  return getCountKeys(variants, layerFilter).map((countKey) => {
    const values = variants
      .map((variant) => getCountValue(variant, countKey, layerFilter))
      .filter((value): value is number => typeof value === 'number');

    return {
      layer: countKey.layer,
      countKey: countKey.countKey,
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
      changed: values.length ? Math.min(...values) !== Math.max(...values) : false,
    };
  });
}

function buildSourcePolicySensitivity(
  variants: FieldEvidenceStabilityVariantSummary[],
  layerFilter?: FieldEvidenceStabilityLayer,
): FieldEvidenceSensitivitySummary {
  const changedKeys = new Set<string>();
  const countKeys = getCountKeys(variants, layerFilter);
  const subdivisions = uniqueNumbers(
    variants.map((variant) => variant.samplingSubdivisions),
  );

  for (const subdivisionsValue of subdivisions) {
    const matchingVariants = variants.filter(
      (variant) => variant.samplingSubdivisions === subdivisionsValue,
    );

    for (const countKey of countKeys) {
      const values = matchingVariants
        .map((variant) => getCountValue(variant, countKey, layerFilter))
        .filter((value): value is number => typeof value === 'number');

      if (new Set(values).size > 1) {
        changedKeys.add(formatCountKey(countKey));
      }
    }
  }

  return {
    sensitive: changedKeys.size > 0,
    changedKeys: Array.from(changedKeys).sort(),
  };
}

function buildSamplingSensitivity(
  variants: FieldEvidenceStabilityVariantSummary[],
  layerFilter?: FieldEvidenceStabilityLayer,
): FieldEvidenceSensitivitySummary {
  const changedKeys = new Set<string>();
  const countKeys = getCountKeys(variants, layerFilter);
  const sourcePolicyNames = uniqueSorted(
    variants.map((variant) => variant.sourcePolicyName),
  );

  for (const sourcePolicyName of sourcePolicyNames) {
    const matchingVariants = variants.filter(
      (variant) => variant.sourcePolicyName === sourcePolicyName,
    );

    for (const countKey of countKeys) {
      const values = matchingVariants
        .map((variant) => getCountValue(variant, countKey, layerFilter))
        .filter((value): value is number => typeof value === 'number');

      if (new Set(values).size > 1) {
        changedKeys.add(formatCountKey(countKey));
      }
    }
  }

  return {
    sensitive: changedKeys.size > 0,
    changedKeys: Array.from(changedKeys).sort(),
  };
}

function getCountKeys(
  variants: FieldEvidenceStabilityVariantSummary[],
  layerFilter?: FieldEvidenceStabilityLayer,
): Array<{ layer: FieldEvidenceStabilityLayer; countKey: string }> {
  const keysByName = new Map<string, { layer: FieldEvidenceStabilityLayer; countKey: string }>();

  for (const variant of variants) {
    for (const layerSummary of variant.layerSummaries) {
      if (layerFilter && layerSummary.layer !== layerFilter) {
        continue;
      }

      for (const countKey of Object.keys(layerSummary.countsByKind)) {
        keysByName.set(formatCountKey({ layer: layerSummary.layer, countKey }), {
          layer: layerSummary.layer,
          countKey,
        });
      }
    }
  }

  return Array.from(keysByName.values()).sort((first, second) =>
    formatCountKey(first).localeCompare(formatCountKey(second)),
  );
}

function getCountValue(
  variant: FieldEvidenceStabilityVariantSummary,
  countKey: { layer: FieldEvidenceStabilityLayer; countKey: string },
  layerFilter?: FieldEvidenceStabilityLayer,
): number | null {
  if (layerFilter && countKey.layer !== layerFilter) {
    return null;
  }

  const layerSummary = getVariantLayerSummary(variant, countKey.layer);

  return layerSummary?.countsByKind[countKey.countKey] ?? null;
}

function getVariantLayerSummary(
  variant: FieldEvidenceStabilityVariantSummary,
  layer: FieldEvidenceStabilityLayer,
): FieldEvidenceVariantLayerSummary | undefined {
  return variant.layerSummaries.find((layerSummary) => layerSummary.layer === layer);
}

function buildMaxBucketSaturationFlags(
  routeGateReport: FieldRouteGateCandidateReport,
  supportRegionReport: FieldSupportRegionCandidateReport,
): FieldEvidenceMaxBucketSaturationFlags {
  const flags = {
    routeGateGatesReachedMax:
      routeGateReport.candidateSummary.gateCandidateCount >=
      routeGateReport.options.maxGateCandidates,
    routeGateRoutesReachedMax:
      routeGateReport.candidateSummary.routeCandidateCount >=
      routeGateReport.options.maxRouteCandidates,
    routeGateBlockedReachedMax:
      routeGateReport.candidateSummary.blockedRouteCandidateCount >=
      routeGateReport.options.maxBlockedRouteCandidates,
    supportRegionSupportClassesReachedMax:
      supportRegionReport.candidateSummary.supportClassCandidateCount >=
      supportRegionReport.options.maxSupportClassCandidates,
    supportRegionRegionsReachedMax:
      supportRegionReport.candidateSummary.regionCandidateCount >=
      supportRegionReport.options.maxRegionCandidates,
    supportRegionConstraintsReachedMax:
      supportRegionReport.candidateSummary.constraintSiteCandidateCount >=
      supportRegionReport.options.maxConstraintSiteCandidates,
    supportRegionRouteFailuresReachedMax:
      supportRegionReport.candidateSummary.routeFailureRegionCandidateCount >=
      supportRegionReport.options.maxRouteFailureRegionCandidates,
  };

  return {
    ...flags,
    anyMaxBucketSaturated: Object.values(flags).some(Boolean),
  };
}

function mergeMaxBucketSaturation(
  flags: FieldEvidenceMaxBucketSaturationFlags[],
): FieldEvidenceMaxBucketSaturationFlags {
  const merged = flags.reduce(
    (accumulator, current) => ({
      routeGateGatesReachedMax:
        accumulator.routeGateGatesReachedMax || current.routeGateGatesReachedMax,
      routeGateRoutesReachedMax:
        accumulator.routeGateRoutesReachedMax || current.routeGateRoutesReachedMax,
      routeGateBlockedReachedMax:
        accumulator.routeGateBlockedReachedMax || current.routeGateBlockedReachedMax,
      supportRegionSupportClassesReachedMax:
        accumulator.supportRegionSupportClassesReachedMax ||
        current.supportRegionSupportClassesReachedMax,
      supportRegionRegionsReachedMax:
        accumulator.supportRegionRegionsReachedMax ||
        current.supportRegionRegionsReachedMax,
      supportRegionConstraintsReachedMax:
        accumulator.supportRegionConstraintsReachedMax ||
        current.supportRegionConstraintsReachedMax,
      supportRegionRouteFailuresReachedMax:
        accumulator.supportRegionRouteFailuresReachedMax ||
        current.supportRegionRouteFailuresReachedMax,
      anyMaxBucketSaturated:
        accumulator.anyMaxBucketSaturated || current.anyMaxBucketSaturated,
    }),
    emptyMaxBucketSaturationFlags(),
  );

  return {
    ...merged,
    anyMaxBucketSaturated:
      merged.routeGateGatesReachedMax ||
      merged.routeGateRoutesReachedMax ||
      merged.routeGateBlockedReachedMax ||
      merged.supportRegionSupportClassesReachedMax ||
      merged.supportRegionRegionsReachedMax ||
      merged.supportRegionConstraintsReachedMax ||
      merged.supportRegionRouteFailuresReachedMax,
  };
}

function emptyMaxBucketSaturationFlags(): FieldEvidenceMaxBucketSaturationFlags {
  return {
    routeGateGatesReachedMax: false,
    routeGateRoutesReachedMax: false,
    routeGateBlockedReachedMax: false,
    supportRegionSupportClassesReachedMax: false,
    supportRegionRegionsReachedMax: false,
    supportRegionConstraintsReachedMax: false,
    supportRegionRouteFailuresReachedMax: false,
    anyMaxBucketSaturated: false,
  };
}

function buildStabilityLabels(
  samplingSensitive: boolean,
  policySensitive: boolean,
  saturated: boolean,
): FieldEvidenceStabilityLabel[] {
  const labels: FieldEvidenceStabilityLabel[] = [];

  if (saturated) {
    labels.push('saturated');
  }

  if (samplingSensitive && policySensitive) {
    labels.push('mixed-instability');
  } else if (samplingSensitive) {
    labels.push('sampling-sensitive');
  } else if (policySensitive) {
    labels.push('policy-sensitive');
  }

  return labels.length ? labels : ['stable-counts'];
}

function buildNotes(
  samplingSensitivity: FieldEvidenceSensitivitySummary,
  sourcePolicySensitivity: FieldEvidenceSensitivitySummary,
  maxBucketSaturation: FieldEvidenceMaxBucketSaturationFlags,
  computationalOnlyDependence: boolean,
  seamEdgeDependence: boolean,
): string[] {
  return [
    samplingSensitivity.sensitive
      ? 'Counts changed across sampling subdivisions; existing diagnostics are parameter-sensitive.'
      : '',
    sourcePolicySensitivity.sensitive
      ? 'Counts changed across source policies; existing diagnostics remain policy-relative.'
      : '',
    maxBucketSaturation.anyMaxBucketSaturated
      ? 'At least one bounded candidate bucket reached its configured maximum.'
      : '',
    computationalOnlyDependence
      ? 'At least one count depends on computational-only chart support.'
      : '',
    seamEdgeDependence
      ? 'At least one count depends on seam-aware sample graph edges.'
      : '',
  ].filter((note) => note.length > 0);
}

function buildWarnings(
  maxBucketSaturation: FieldEvidenceMaxBucketSaturationFlags,
): string[] {
  return maxBucketSaturation.anyMaxBucketSaturated
    ? ['Saturated candidate buckets may hide additional count variance.']
    : [];
}

function getSourcePolicyNames(sampledAtlas: SampledClosedShapeSurfaceAtlas): string[] {
  return uniqueSorted(
    sampledAtlas.sources
      .map((source) => source.policyName.trim())
      .filter((policyName) => policyName.length > 0),
  );
}

function resolveFieldEvidenceStabilityOptions(
  options: FieldEvidenceStabilityOptions,
): ResolvedFieldEvidenceStabilityOptions {
  return {
    samplingSubdivisions: normalizeSubdivisions(
      options.samplingSubdivisions ?? DEFAULT_SAMPLING_SUBDIVISIONS,
    ),
    sourcePolicies: normalizeSourcePolicies(
      options.sourcePolicies ?? DEFAULT_SOURCE_POLICIES,
    ),
  };
}

function normalizeSubdivisions(subdivisions: number[]): number[] {
  const normalized = uniqueNumbers(
    subdivisions
      .filter((subdivision) => Number.isFinite(subdivision))
      .map((subdivision) => Math.max(1, Math.floor(subdivision))),
  );

  return normalized.length ? normalized : [...DEFAULT_SAMPLING_SUBDIVISIONS];
}

function normalizeSourcePolicies(
  sourcePolicies: FieldAtlasSourcePolicy[],
): FieldAtlasSourcePolicy[] {
  const policiesByName = new Map<string, FieldAtlasSourcePolicy>();

  for (const sourcePolicy of sourcePolicies) {
    if (sourcePolicy.name.trim().length) {
      policiesByName.set(sourcePolicy.name, sourcePolicy);
    }
  }

  return policiesByName.size
    ? Array.from(policiesByName.values())
    : [...DEFAULT_SOURCE_POLICIES];
}

function formatCountKey(countKey: {
  layer: FieldEvidenceStabilityLayer;
  countKey: string;
}): string {
  return `${countKey.layer}:${countKey.countKey}`;
}

function sanitizeIdFragment(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'case';
}

function uniqueSorted(values: readonly string[]): string[] {
  return Array.from(new Set(values)).sort();
}

function uniqueNumbers(values: readonly number[]): number[] {
  return Array.from(new Set(values)).sort((first, second) => first - second);
}
