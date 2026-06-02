import { createSeedShape } from '../data/seeds';
import { applyAmboDissection } from './ambo';
import {
  buildTetrahedralAmboChildContexts,
  createTetrahedralVertexFixture,
} from './fieldSourceChildContexts';
import {
  buildTetrahedralChildSourceProfileDerivationReport,
} from './fieldSourceChildDerivations';
import {
  buildTetrahedralChildProfileDegeneracyReport,
} from './fieldSourceChildDegeneracy';
import {
  buildProfileAwareAtlasAdapterReport,
  type ProfileAwareAtlasAdapterReport,
} from './fieldSourceProfileAwareAtlasAdapter';
import {
  buildProfileAwareFeatureReportDiagnosticReport,
} from './fieldSourceProfileAwareFeatureReport';
import {
  buildProfileAwareFieldSourcePolicyDiagnosticReport,
} from './fieldSourceProfileAwarePolicy';
import {
  buildProfileAwareRouteGateCandidateDiagnosticReport,
} from './fieldSourceProfileAwareRouteGateCandidates';
import {
  buildProfileAwareShapePositionResolverReport,
} from './fieldSourceProfileAwareShapePositionResolver';
import {
  buildProfileAwareShapeResolvedSurfaceAtlas,
} from './fieldSourceProfileAwareShapeResolvedSurfaceAtlas';
import {
  buildProfileAwareSupportRegionCandidateDiagnosticReport,
} from './fieldSourceProfileAwareSupportRegionCandidates';
import {
  buildPrimalProfileAssignmentDiagnosticReport,
  createTetrahedronFieldSourceProfileSetupFixture,
  createTetrahedronPrimalProfileAssignmentFixture,
  createUniformCirclePrimalProfileSystemFixture,
  generateFieldSourceProfiles,
  type FieldSourceProfileSystem,
} from './fieldSourceProfiles';
import {
  buildTetrahedralQuarkChannelReport,
} from './fieldSourceQuarkChannels';

export type ProfileAwareEvidenceStabilityIssueCode =
  | 'variant-build-failed'
  | 'variant-report-not-ok'
  | 'variant-source-policy-mismatch'
  | 'variant-semantic-status-mismatch'
  | 'variant-topology-status-mismatch'
  | 'variant-phase-continuity-status-mismatch'
  | 'variant-feature-observation-status-mismatch'
  | 'variant-route-gate-status-mismatch'
  | 'variant-support-region-status-mismatch'
  | 'unexpected-shape-mutation'
  | 'adapter-default-execution-mutated';

export interface ProfileAwareEvidenceStabilityIssue {
  code: ProfileAwareEvidenceStabilityIssueCode;
  message: string;
  variantId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface ProfileAwareEvidenceStabilityMaxBucketSaturationFlags {
  routeGateGatesReachedMax: boolean;
  routeGateRoutesReachedMax: boolean;
  routeGateBlockedReachedMax: boolean;
  supportRegionSupportClassesReachedMax: boolean;
  supportRegionRegionsReachedMax: boolean;
  supportRegionConstraintsReachedMax: boolean;
  supportRegionRouteFailuresReachedMax: boolean;
  anyMaxBucketSaturated: boolean;
}

export interface ProfileAwareEvidenceStabilityVariantReport {
  variantId: string;
  samplingSubdivisions: number;
  profileSetupLabel: string;
  chartCount: number;
  sampleCount: number;
  executableSourceCount: number;
  totalObservationCount: number;
  cancellationLikeObservationCount: number;
  highIntensityAnchorObservationCount: number;
  ambiguousObservationCount: number;
  totalRouteGateCandidateCount: number;
  gateCandidateCount: number;
  routeCandidateCount: number;
  blockedRouteCandidateCount: number;
  totalSupportRegionCandidateCount: number;
  supportClassCandidateCount: number;
  regionCandidateCount: number;
  constraintSiteCandidateCount: number;
  routeFailureRegionCandidateCount: number;
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  phaseContinuityStatus: 'not-global-phase-continuity';
  featureObservationStatus: 'report-candidate';
  routeGateCandidateStatus: 'candidate-only';
  supportRegionCandidateStatus: 'candidate-only';
  featureNonCandidateObservationCount: number;
  routeGateNonCandidateStatusCount: number;
  supportRegionNonCandidateStatusCount: number;
  shapeMutationDetected: boolean;
  maxBucketSaturation: ProfileAwareEvidenceStabilityMaxBucketSaturationFlags;
  ok: boolean;
  issueCount: number;
}

export interface ProfileAwareEvidenceStabilityCountRange {
  min: number;
  max: number;
}

export type ProfileAwareEvidenceStabilityCountKey =
  (typeof COUNT_KEYS)[number];

export interface ProfileAwareEvidenceStabilitySensitivitySummary {
  samplingSensitive: boolean;
  profileSetupSensitive: boolean;
  changedCountKeys: ProfileAwareEvidenceStabilityCountKey[];
  featureChangedCountKeys: ProfileAwareEvidenceStabilityCountKey[];
  routeGateChangedCountKeys: ProfileAwareEvidenceStabilityCountKey[];
  supportRegionChangedCountKeys: ProfileAwareEvidenceStabilityCountKey[];
  countRanges: Record<
    ProfileAwareEvidenceStabilityCountKey,
    ProfileAwareEvidenceStabilityCountRange
  >;
  maxBucketSaturation: ProfileAwareEvidenceStabilityMaxBucketSaturationFlags;
}

export interface ProfileAwareEvidenceStabilityReport {
  reportId: string;
  method: 'profile-aware-evidence-stability-diagnostic-v0';
  diagnosticScope: 'profile-aware-full-candidate-stack-stability-only';
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  policyRelativityStatus: 'policy-relative';
  contrastPolicyNote: 'old-policy-not-assumed-invariant';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  phaseContinuityStatus: 'not-global-phase-continuity';
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
  fieldAtlasMutationStatus: 'not-mutated';
  variantCount: number;
  samplingVariantCount: number;
  profileSetupVariantCount: number;
  variants: ProfileAwareEvidenceStabilityVariantReport[];
  sensitivitySummary: ProfileAwareEvidenceStabilitySensitivitySummary;
  issueCount: number;
  ok: boolean;
  issues: ProfileAwareEvidenceStabilityIssue[];
}

interface SamplingVariantSpec {
  label: string;
  subdivisions: number;
  maxSamples: number;
}

interface ProfileSetupVariantSpec {
  label: string;
  buildProfileSystem: () => FieldSourceProfileSystem;
}

interface BuiltProfileAwareChain {
  adapterReport: ProfileAwareAtlasAdapterReport;
}

const METHOD = 'profile-aware-evidence-stability-diagnostic-v0';
const DIAGNOSTIC_SCOPE = 'profile-aware-full-candidate-stack-stability-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const CONTRAST_POLICY_NOTE = 'old-policy-not-assumed-invariant';
const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];

const ROUTE_GATE_OPTIONS = {
  maxGateCandidates: 8,
  maxRouteCandidates: 4,
  maxBlockedRouteCandidates: 8,
};

const SUPPORT_REGION_OPTIONS = {
  maxSupportClassCandidates: 8,
  maxRegionCandidates: 6,
  maxConstraintSiteCandidates: 8,
  maxRouteFailureRegionCandidates: 6,
};

const COUNT_KEYS = [
  'chartCount',
  'sampleCount',
  'executableSourceCount',
  'totalObservationCount',
  'cancellationLikeObservationCount',
  'highIntensityAnchorObservationCount',
  'ambiguousObservationCount',
  'totalRouteGateCandidateCount',
  'gateCandidateCount',
  'routeCandidateCount',
  'blockedRouteCandidateCount',
  'totalSupportRegionCandidateCount',
  'supportClassCandidateCount',
  'regionCandidateCount',
  'constraintSiteCandidateCount',
  'routeFailureRegionCandidateCount',
] as const;

const FEATURE_COUNT_KEYS = [
  'totalObservationCount',
  'cancellationLikeObservationCount',
  'highIntensityAnchorObservationCount',
  'ambiguousObservationCount',
] as const;

const ROUTE_GATE_COUNT_KEYS = [
  'totalRouteGateCandidateCount',
  'gateCandidateCount',
  'routeCandidateCount',
  'blockedRouteCandidateCount',
] as const;

const SUPPORT_REGION_COUNT_KEYS = [
  'totalSupportRegionCandidateCount',
  'supportClassCandidateCount',
  'regionCandidateCount',
  'constraintSiteCandidateCount',
  'routeFailureRegionCandidateCount',
] as const;

const SAMPLING_VARIANTS: SamplingVariantSpec[] = [
  { label: 'subdivisions-1', subdivisions: 1, maxSamples: 96 },
  { label: 'subdivisions-2', subdivisions: 2, maxSamples: 128 },
];

const PROFILE_SETUP_VARIANTS: ProfileSetupVariantSpec[] = [
  {
    label: 'baseline-profile-setup',
    buildProfileSystem: () => createUniformCirclePrimalProfileSystemFixture(),
  },
  {
    label: 'phase-shifted-profile-setup',
    buildProfileSystem: () => ({
      ...createUniformCirclePrimalProfileSystemFixture(),
      systemId: 'uniform-circle-primal-profile-system-v0:4:phase-shift-pi-8',
      label: 'uniform-circle-4-slot-primal-profile-system-phase-shift-pi-8',
      phaseOrigin: Math.PI / 8,
      description:
        'Diagnostic finite profile system with a bounded phase-origin shift.',
    }),
  },
];

export function buildProfileAwareEvidenceStabilityReport(): ProfileAwareEvidenceStabilityReport {
  const issues: ProfileAwareEvidenceStabilityIssue[] = [];
  const variants: ProfileAwareEvidenceStabilityVariantReport[] = [];

  for (const profileSetupVariant of PROFILE_SETUP_VARIANTS) {
    for (const samplingVariant of SAMPLING_VARIANTS) {
      const variantId = `${profileSetupVariant.label}:${samplingVariant.label}`;

      try {
        const variant = buildEvidenceStabilityVariant({
          variantId,
          profileSetupVariant,
          samplingVariant,
        });

        variants.push(variant);
        appendVariantIssues(variant, issues);
      } catch (error) {
        issues.push({
          code: 'variant-build-failed',
          message: `Profile-aware evidence stability variant ${variantId} failed to build.`,
          variantId,
          details: {
            reason: error instanceof Error ? error.message : String(error),
          },
        });
      }
    }
  }

  const adapterDefaultReport = buildProfileAwareChain(
    PROFILE_SETUP_VARIANTS[0].buildProfileSystem(),
  ).adapterReport;

  if (adapterDefaultReport.fieldAtlasExecutionStatus !== 'input-built-not-executed') {
    issues.push({
      code: 'adapter-default-execution-mutated',
      message:
        'Profile-aware atlas adapter default execution status changed unexpectedly.',
      details: {
        fieldAtlasExecutionStatus: adapterDefaultReport.fieldAtlasExecutionStatus,
      },
    });
  }

  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:tetrahedron-one-ambo:${variants.length}`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    sourcePolicyId: SOURCE_POLICY_ID,
    policyRelativityStatus: 'policy-relative',
    contrastPolicyNote: CONTRAST_POLICY_NOTE,
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    phaseContinuityStatus: 'not-global-phase-continuity',
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated',
    fieldAtlasMutationStatus: 'not-mutated',
    variantCount: variants.length,
    samplingVariantCount: SAMPLING_VARIANTS.length,
    profileSetupVariantCount: PROFILE_SETUP_VARIANTS.length,
    variants,
    sensitivitySummary: buildSensitivitySummary(variants),
    issueCount,
    ok: issueCount === 0,
    issues,
  };
}

function buildEvidenceStabilityVariant(args: {
  variantId: string;
  profileSetupVariant: ProfileSetupVariantSpec;
  samplingVariant: SamplingVariantSpec;
}): ProfileAwareEvidenceStabilityVariantReport {
  const shape = applyAmboDissection(createSeedShape('tetrahedron'));
  const beforeShapeJson = JSON.stringify(shape);
  const { adapterReport } = buildProfileAwareChain(
    args.profileSetupVariant.buildProfileSystem(),
  );
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const surfaceAtlasResult = buildProfileAwareShapeResolvedSurfaceAtlas({
    shape,
    atlasSources: adapterReport.atlasSources,
    resolverReport,
    samplingOptions: {
      subdivisions: args.samplingVariant.subdivisions,
      maxSamples: args.samplingVariant.maxSamples,
    },
    sourceCountMetadata: {
      fallbackChildSourceCount: adapterReport.fallbackChildSourceCount,
      unresolvedChildSourceCount: adapterReport.unresolvedChildSourceCount,
      degeneracyStatusCount: adapterReport.degeneracyStatusCount,
    },
    reportIdSuffix: args.variantId,
  });
  const featureReport = buildProfileAwareFeatureReportDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: args.variantId,
  });
  const routeGateReport = buildProfileAwareRouteGateCandidateDiagnosticReport({
    surfaceAtlasResult,
    routeGateOptions: ROUTE_GATE_OPTIONS,
    reportIdSuffix: args.variantId,
  });
  const supportRegionReport =
    buildProfileAwareSupportRegionCandidateDiagnosticReport({
      surfaceAtlasResult,
      supportRegionOptions: SUPPORT_REGION_OPTIONS,
      reportIdSuffix: args.variantId,
    });
  const shapeWasMutated = JSON.stringify(shape) !== beforeShapeJson;
  const issueCount =
    featureReport.issueCount +
    routeGateReport.issueCount +
    supportRegionReport.issueCount +
    (shapeWasMutated ? 1 : 0);

  return {
    variantId: args.variantId,
    samplingSubdivisions: args.samplingVariant.subdivisions,
    profileSetupLabel: args.profileSetupVariant.label,
    chartCount: featureReport.chartCount,
    sampleCount: featureReport.sampleCount,
    executableSourceCount: featureReport.executableSourceCount,
    totalObservationCount: featureReport.totalObservationCount,
    cancellationLikeObservationCount: featureReport.cancellationLikeObservationCount,
    highIntensityAnchorObservationCount:
      featureReport.highIntensityAnchorObservationCount,
    ambiguousObservationCount: featureReport.ambiguousObservationCount,
    totalRouteGateCandidateCount: routeGateReport.totalCandidateCount,
    gateCandidateCount: routeGateReport.gateCandidateCount,
    routeCandidateCount: routeGateReport.routeCandidateCount,
    blockedRouteCandidateCount: routeGateReport.blockedRouteCandidateCount,
    totalSupportRegionCandidateCount: supportRegionReport.totalCandidateCount,
    supportClassCandidateCount: supportRegionReport.supportClassCandidateCount,
    regionCandidateCount: supportRegionReport.regionCandidateCount,
    constraintSiteCandidateCount: supportRegionReport.constraintSiteCandidateCount,
    routeFailureRegionCandidateCount:
      supportRegionReport.routeFailureRegionCandidateCount,
    sourcePolicyId: featureReport.sourcePolicyId,
    semanticStatus: featureReport.semanticStatus,
    topologyStatus: routeGateReport.topologyStatus,
    phaseContinuityStatus: routeGateReport.phaseContinuityStatus,
    featureObservationStatus: featureReport.observationStatus,
    routeGateCandidateStatus: routeGateReport.candidateStatus,
    supportRegionCandidateStatus: supportRegionReport.candidateStatus,
    featureNonCandidateObservationCount:
      featureReport.nonCandidateObservationCount,
    routeGateNonCandidateStatusCount: routeGateReport.nonCandidateStatusCount,
    supportRegionNonCandidateStatusCount:
      supportRegionReport.nonCandidateStatusCount,
    shapeMutationDetected: shapeWasMutated,
    maxBucketSaturation: buildMaxBucketSaturationFlags(
      routeGateReport,
      supportRegionReport,
    ),
    ok:
      featureReport.ok &&
      routeGateReport.ok &&
      supportRegionReport.ok &&
      !shapeWasMutated,
    issueCount,
  };
}

function buildProfileAwareChain(profileSystem: FieldSourceProfileSystem): BuiltProfileAwareChain {
  const vertexIds = createTetrahedralVertexFixture();
  const profiles = generateFieldSourceProfiles(profileSystem);
  const assignments = createTetrahedronPrimalProfileAssignmentFixture(profiles);
  const setup = createTetrahedronFieldSourceProfileSetupFixture(
    profileSystem,
    assignments,
  );
  const profileAssignmentReport = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem,
    setup,
    activePrimalVertexIds: ACTIVE_TETRAHEDRON_PRIMAL_VERTICES,
  });
  const profileById = new Map(profiles.map((profile) => [profile.profileId, profile]));
  const profileByVertexId = new Map<string, (typeof profiles)[number]>();

  for (const assignment of assignments) {
    const profile = profileById.get(assignment.profileId);

    if (profile) {
      profileByVertexId.set(assignment.vertexId, profile);
    }
  }

  const childContexts = buildTetrahedralAmboChildContexts(vertexIds);
  const childDerivationReports = childContexts.map((childContext) => {
    const quarkChannelReport = buildTetrahedralQuarkChannelReport({
      childContext,
      profileByVertexId,
    });

    return buildTetrahedralChildSourceProfileDerivationReport({
      childContext,
      quarkChannelReport,
    });
  });
  const childDegeneracyReport = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: childDerivationReports,
  });
  const profileAwarePolicyReport =
    buildProfileAwareFieldSourcePolicyDiagnosticReport({
      profileAssignmentReport,
      childContexts,
      childDerivationReports,
      childDegeneracyReport,
    });
  const adapterReport = buildProfileAwareAtlasAdapterReport({
    profileAwarePolicyReport,
  });

  return { adapterReport };
}

function appendVariantIssues(
  variant: ProfileAwareEvidenceStabilityVariantReport,
  issues: ProfileAwareEvidenceStabilityIssue[],
): void {
  if (!variant.ok) {
    issues.push({
      code: 'variant-report-not-ok',
      message: `Profile-aware evidence stability variant ${variant.variantId} did not build cleanly.`,
      variantId: variant.variantId,
      details: {
        variantIssueCount: variant.issueCount,
      },
    });
  }

  if (variant.sourcePolicyId !== SOURCE_POLICY_ID) {
    issues.push({
      code: 'variant-source-policy-mismatch',
      message: `Variant ${variant.variantId} is not marked with the profile-aware source policy.`,
      variantId: variant.variantId,
      details: {
        expectedSourcePolicyId: SOURCE_POLICY_ID,
        actualSourcePolicyId: variant.sourcePolicyId,
      },
    });
  }

  if (variant.semanticStatus !== 'not-semantic-naming') {
    issues.push({
      code: 'variant-semantic-status-mismatch',
      message: `Variant ${variant.variantId} changed semantic status.`,
      variantId: variant.variantId,
      details: {
        semanticStatus: variant.semanticStatus,
      },
    });
  }

  if (variant.topologyStatus !== 'not-topology-workspace') {
    issues.push({
      code: 'variant-topology-status-mismatch',
      message: `Variant ${variant.variantId} changed topology status.`,
      variantId: variant.variantId,
      details: {
        topologyStatus: variant.topologyStatus,
      },
    });
  }

  if (variant.phaseContinuityStatus !== 'not-global-phase-continuity') {
    issues.push({
      code: 'variant-phase-continuity-status-mismatch',
      message: `Variant ${variant.variantId} changed phase continuity status.`,
      variantId: variant.variantId,
      details: {
        phaseContinuityStatus: variant.phaseContinuityStatus,
      },
    });
  }

  if (
    variant.featureObservationStatus !== 'report-candidate' ||
    variant.featureNonCandidateObservationCount > 0
  ) {
    issues.push({
      code: 'variant-feature-observation-status-mismatch',
      message: `Variant ${variant.variantId} changed feature observation status.`,
      variantId: variant.variantId,
      details: {
        featureObservationStatus: variant.featureObservationStatus,
        featureNonCandidateObservationCount:
          variant.featureNonCandidateObservationCount,
      },
    });
  }

  if (
    variant.routeGateCandidateStatus !== 'candidate-only' ||
    variant.routeGateNonCandidateStatusCount > 0
  ) {
    issues.push({
      code: 'variant-route-gate-status-mismatch',
      message: `Variant ${variant.variantId} changed route/gate candidate status.`,
      variantId: variant.variantId,
      details: {
        routeGateCandidateStatus: variant.routeGateCandidateStatus,
        routeGateNonCandidateStatusCount:
          variant.routeGateNonCandidateStatusCount,
      },
    });
  }

  if (
    variant.supportRegionCandidateStatus !== 'candidate-only' ||
    variant.supportRegionNonCandidateStatusCount > 0
  ) {
    issues.push({
      code: 'variant-support-region-status-mismatch',
      message: `Variant ${variant.variantId} changed support/region candidate status.`,
      variantId: variant.variantId,
      details: {
        supportRegionCandidateStatus: variant.supportRegionCandidateStatus,
        supportRegionNonCandidateStatusCount:
          variant.supportRegionNonCandidateStatusCount,
      },
    });
  }

  if (variant.shapeMutationDetected) {
    issues.push({
      code: 'unexpected-shape-mutation',
      message: `Variant ${variant.variantId} mutated the diagnostic Shape.`,
      variantId: variant.variantId,
      details: {
        shapeMutationDetected: true,
      },
    });
  }
}

function buildSensitivitySummary(
  variants: ProfileAwareEvidenceStabilityVariantReport[],
): ProfileAwareEvidenceStabilitySensitivitySummary {
  const changedCountKeys = COUNT_KEYS.filter((key) => hasChangedCount(variants, key));
  const featureChangedCountKeys = FEATURE_COUNT_KEYS.filter((key) =>
    hasChangedCount(variants, key),
  );
  const routeGateChangedCountKeys = ROUTE_GATE_COUNT_KEYS.filter((key) =>
    hasChangedCount(variants, key),
  );
  const supportRegionChangedCountKeys = SUPPORT_REGION_COUNT_KEYS.filter((key) =>
    hasChangedCount(variants, key),
  );

  return {
    samplingSensitive: hasSensitivePairs(
      variants,
      'profileSetupLabel',
      'samplingSubdivisions',
    ),
    profileSetupSensitive: hasSensitivePairs(
      variants,
      'samplingSubdivisions',
      'profileSetupLabel',
    ),
    changedCountKeys,
    featureChangedCountKeys,
    routeGateChangedCountKeys,
    supportRegionChangedCountKeys,
    countRanges: buildCountRanges(variants),
    maxBucketSaturation: mergeMaxBucketSaturation(
      variants.map((variant) => variant.maxBucketSaturation),
    ),
  };
}

function buildMaxBucketSaturationFlags(
  routeGateReport: ReturnType<typeof buildProfileAwareRouteGateCandidateDiagnosticReport>,
  supportRegionReport: ReturnType<
    typeof buildProfileAwareSupportRegionCandidateDiagnosticReport
  >,
): ProfileAwareEvidenceStabilityMaxBucketSaturationFlags {
  const flags = {
    routeGateGatesReachedMax:
      routeGateReport.gateCandidateCount >= ROUTE_GATE_OPTIONS.maxGateCandidates,
    routeGateRoutesReachedMax:
      routeGateReport.routeCandidateCount >= ROUTE_GATE_OPTIONS.maxRouteCandidates,
    routeGateBlockedReachedMax:
      routeGateReport.blockedRouteCandidateCount >=
      ROUTE_GATE_OPTIONS.maxBlockedRouteCandidates,
    supportRegionSupportClassesReachedMax:
      supportRegionReport.supportClassCandidateCount >=
      SUPPORT_REGION_OPTIONS.maxSupportClassCandidates,
    supportRegionRegionsReachedMax:
      supportRegionReport.regionCandidateCount >=
      SUPPORT_REGION_OPTIONS.maxRegionCandidates,
    supportRegionConstraintsReachedMax:
      supportRegionReport.constraintSiteCandidateCount >=
      SUPPORT_REGION_OPTIONS.maxConstraintSiteCandidates,
    supportRegionRouteFailuresReachedMax:
      supportRegionReport.routeFailureRegionCandidateCount >=
      SUPPORT_REGION_OPTIONS.maxRouteFailureRegionCandidates,
  };

  return {
    ...flags,
    anyMaxBucketSaturated: Object.values(flags).some(Boolean),
  };
}

function mergeMaxBucketSaturation(
  flags: ProfileAwareEvidenceStabilityMaxBucketSaturationFlags[],
): ProfileAwareEvidenceStabilityMaxBucketSaturationFlags {
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

function emptyMaxBucketSaturationFlags(): ProfileAwareEvidenceStabilityMaxBucketSaturationFlags {
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

function buildCountRanges(
  variants: ProfileAwareEvidenceStabilityVariantReport[],
): Record<
  ProfileAwareEvidenceStabilityCountKey,
  ProfileAwareEvidenceStabilityCountRange
> {
  return COUNT_KEYS.reduce(
    (ranges, key) => ({
      ...ranges,
      [key]: getRange(variants, key),
    }),
    {} as Record<
      ProfileAwareEvidenceStabilityCountKey,
      ProfileAwareEvidenceStabilityCountRange
    >,
  );
}

function hasChangedCount(
  variants: ProfileAwareEvidenceStabilityVariantReport[],
  key: ProfileAwareEvidenceStabilityCountKey,
): boolean {
  return new Set(variants.map((variant) => variant[key])).size > 1;
}

function hasSensitivePairs(
  variants: ProfileAwareEvidenceStabilityVariantReport[],
  stableKey: 'profileSetupLabel' | 'samplingSubdivisions',
  changedAxisKey: 'profileSetupLabel' | 'samplingSubdivisions',
): boolean {
  const stableValues = new Set(variants.map((variant) => variant[stableKey]));

  for (const stableValue of stableValues) {
    const matchingVariants = variants.filter(
      (variant) => variant[stableKey] === stableValue,
    );
    const changedAxisValues = new Set(
      matchingVariants.map((variant) => variant[changedAxisKey]),
    );

    if (changedAxisValues.size < 2) {
      continue;
    }

    if (COUNT_KEYS.some((key) => hasChangedCount(matchingVariants, key))) {
      return true;
    }
  }

  return false;
}

function getRange(
  variants: ProfileAwareEvidenceStabilityVariantReport[],
  key: ProfileAwareEvidenceStabilityCountKey,
): ProfileAwareEvidenceStabilityCountRange {
  if (variants.length === 0) {
    return { min: 0, max: 0 };
  }

  return variants.reduce(
    (range, variant) => ({
      min: Math.min(range.min, variant[key]),
      max: Math.max(range.max, variant[key]),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  );
}
