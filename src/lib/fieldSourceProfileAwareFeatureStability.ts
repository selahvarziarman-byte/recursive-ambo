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
  buildProfileAwareFeatureReportDiagnosticReport,
} from './fieldSourceProfileAwareFeatureReport';
import {
  buildProfileAwareAtlasAdapterReport,
  type ProfileAwareAtlasAdapterReport,
} from './fieldSourceProfileAwareAtlasAdapter';
import {
  buildProfileAwareFieldSourcePolicyDiagnosticReport,
} from './fieldSourceProfileAwarePolicy';
import {
  buildProfileAwareShapePositionResolverReport,
} from './fieldSourceProfileAwareShapePositionResolver';
import {
  buildProfileAwareShapeResolvedSurfaceAtlas,
} from './fieldSourceProfileAwareShapeResolvedSurfaceAtlas';
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

export type ProfileAwareFeatureStabilityIssueCode =
  | 'variant-build-failed'
  | 'variant-report-not-ok'
  | 'variant-source-policy-mismatch'
  | 'variant-semantic-status-mismatch'
  | 'variant-observation-status-mismatch'
  | 'unexpected-shape-mutation'
  | 'adapter-default-execution-mutated';

export interface ProfileAwareFeatureStabilityIssue {
  code: ProfileAwareFeatureStabilityIssueCode;
  message: string;
  variantId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface ProfileAwareFeatureStabilityVariantReport {
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
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  semanticStatus: 'not-semantic-naming';
  observationStatus: 'report-candidate';
  shapeMutationDetected: boolean;
  ok: boolean;
  issueCount: number;
}

export interface ProfileAwareFeatureStabilityCountRange {
  min: number;
  max: number;
}

export interface ProfileAwareFeatureStabilitySensitivitySummary {
  samplingSensitive: boolean;
  profileSetupSensitive: boolean;
  changedCountKeys: string[];
  observationCountRanges: {
    totalObservationCount: ProfileAwareFeatureStabilityCountRange;
    cancellationLikeObservationCount: ProfileAwareFeatureStabilityCountRange;
    highIntensityAnchorObservationCount: ProfileAwareFeatureStabilityCountRange;
    ambiguousObservationCount: ProfileAwareFeatureStabilityCountRange;
  };
}

export interface ProfileAwareFeatureStabilityReport {
  reportId: string;
  method: 'profile-aware-feature-stability-diagnostic-v0';
  diagnosticScope: 'profile-aware-feature-report-stability-only';
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  policyRelativityStatus: 'policy-relative';
  contrastPolicyNote: 'old-policy-not-assumed-invariant';
  semanticStatus: 'not-semantic-naming';
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
  fieldAtlasMutationStatus: 'not-mutated';
  variantCount: number;
  samplingVariantCount: number;
  profileSetupVariantCount: number;
  variants: ProfileAwareFeatureStabilityVariantReport[];
  sensitivitySummary: ProfileAwareFeatureStabilitySensitivitySummary;
  issueCount: number;
  ok: boolean;
  issues: ProfileAwareFeatureStabilityIssue[];
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

const METHOD = 'profile-aware-feature-stability-diagnostic-v0';
const DIAGNOSTIC_SCOPE = 'profile-aware-feature-report-stability-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const CONTRAST_POLICY_NOTE = 'old-policy-not-assumed-invariant';
const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];
const COUNT_KEYS = [
  'chartCount',
  'sampleCount',
  'executableSourceCount',
  'totalObservationCount',
  'cancellationLikeObservationCount',
  'highIntensityAnchorObservationCount',
  'ambiguousObservationCount',
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

export function buildProfileAwareFeatureStabilityReport(): ProfileAwareFeatureStabilityReport {
  const issues: ProfileAwareFeatureStabilityIssue[] = [];
  const variants: ProfileAwareFeatureStabilityVariantReport[] = [];

  for (const profileSetupVariant of PROFILE_SETUP_VARIANTS) {
    for (const samplingVariant of SAMPLING_VARIANTS) {
      const variantId = `${profileSetupVariant.label}:${samplingVariant.label}`;

      try {
        const variant = buildFeatureStabilityVariant({
          variantId,
          profileSetupVariant,
          samplingVariant,
        });

        variants.push(variant);
        appendVariantIssues(variant, issues);
      } catch (error) {
        issues.push({
          code: 'variant-build-failed',
          message: `Profile-aware feature stability variant ${variantId} failed to build.`,
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
      message: 'Profile-aware atlas adapter default execution status changed unexpectedly.',
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

function buildFeatureStabilityVariant(args: {
  variantId: string;
  profileSetupVariant: ProfileSetupVariantSpec;
  samplingVariant: SamplingVariantSpec;
}): ProfileAwareFeatureStabilityVariantReport {
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

  const shapeWasMutated = JSON.stringify(shape) !== beforeShapeJson;

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
    sourcePolicyId: featureReport.sourcePolicyId,
    semanticStatus: featureReport.semanticStatus,
    observationStatus: featureReport.observationStatus,
    shapeMutationDetected: shapeWasMutated,
    ok: featureReport.ok && !shapeWasMutated,
    issueCount: featureReport.issueCount + (shapeWasMutated ? 1 : 0),
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
  variant: ProfileAwareFeatureStabilityVariantReport,
  issues: ProfileAwareFeatureStabilityIssue[],
): void {
  if (!variant.ok) {
    issues.push({
      code: 'variant-report-not-ok',
      message: `Profile-aware feature stability variant ${variant.variantId} did not build cleanly.`,
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

  if (variant.observationStatus !== 'report-candidate') {
    issues.push({
      code: 'variant-observation-status-mismatch',
      message: `Variant ${variant.variantId} changed observation status.`,
      variantId: variant.variantId,
      details: {
        observationStatus: variant.observationStatus,
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
  variants: ProfileAwareFeatureStabilityVariantReport[],
): ProfileAwareFeatureStabilitySensitivitySummary {
  const changedCountKeys = COUNT_KEYS.filter((key) => hasChangedCount(variants, key));
  const samplingSensitive = hasSensitivePairs(
    variants,
    'profileSetupLabel',
    'samplingSubdivisions',
  );
  const profileSetupSensitive = hasSensitivePairs(
    variants,
    'samplingSubdivisions',
    'profileSetupLabel',
  );

  return {
    samplingSensitive,
    profileSetupSensitive,
    changedCountKeys,
    observationCountRanges: {
      totalObservationCount: getRange(variants, 'totalObservationCount'),
      cancellationLikeObservationCount: getRange(
        variants,
        'cancellationLikeObservationCount',
      ),
      highIntensityAnchorObservationCount: getRange(
        variants,
        'highIntensityAnchorObservationCount',
      ),
      ambiguousObservationCount: getRange(variants, 'ambiguousObservationCount'),
    },
  };
}

function hasChangedCount(
  variants: ProfileAwareFeatureStabilityVariantReport[],
  key: (typeof COUNT_KEYS)[number],
): boolean {
  return new Set(variants.map((variant) => variant[key])).size > 1;
}

function hasSensitivePairs(
  variants: ProfileAwareFeatureStabilityVariantReport[],
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
  variants: ProfileAwareFeatureStabilityVariantReport[],
  key:
    | 'totalObservationCount'
    | 'cancellationLikeObservationCount'
    | 'highIntensityAnchorObservationCount'
    | 'ambiguousObservationCount',
): ProfileAwareFeatureStabilityCountRange {
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
