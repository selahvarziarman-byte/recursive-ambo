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
  buildProfileAwareAtlasExecutionReport,
} from './fieldSourceProfileAwareAtlasExecution';
import {
  buildProfileAwareEvidenceStabilityReport,
  type ProfileAwareEvidenceStabilityCountKey,
  type ProfileAwareEvidenceStabilityMaxBucketSaturationFlags,
} from './fieldSourceProfileAwareEvidenceStability';
import {
  buildProfileAwareFeatureReportDiagnosticReport,
  type ProfileAwareFeatureReportDiagnosticReport,
} from './fieldSourceProfileAwareFeatureReport';
import {
  buildProfileAwareFeatureStabilityReport,
} from './fieldSourceProfileAwareFeatureStability';
import {
  buildProfileAwareFieldSourcePolicyDiagnosticReport,
  type ProfileAwareFieldSourcePolicyDiagnosticReport,
} from './fieldSourceProfileAwarePolicy';
import {
  buildProfileAwareRouteGateCandidateDiagnosticReport,
  type ProfileAwareRouteGateCandidateDiagnosticReport,
} from './fieldSourceProfileAwareRouteGateCandidates';
import {
  buildProfileAwareShapePositionResolverReport,
} from './fieldSourceProfileAwareShapePositionResolver';
import {
  buildProfileAwareShapeResolvedSurfaceAtlas,
  type ProfileAwareShapeResolvedSurfaceAtlasReport,
} from './fieldSourceProfileAwareShapeResolvedSurfaceAtlas';
import {
  buildProfileAwareSupportRegionCandidateDiagnosticReport,
  type ProfileAwareSupportRegionCandidateDiagnosticReport,
} from './fieldSourceProfileAwareSupportRegionCandidates';
import {
  buildPrimalProfileAssignmentDiagnosticReport,
  createTetrahedronFieldSourceProfileSetupFixture,
  createTetrahedronPrimalProfileAssignmentFixture,
  createUniformCirclePrimalProfileSystemFixture,
  generateFieldSourceProfiles,
} from './fieldSourceProfiles';
import {
  buildTetrahedralQuarkChannelReport,
} from './fieldSourceQuarkChannels';

export type ProfileAwareFieldStackSummaryIssueCode =
  | 'layer-report-not-ok'
  | 'adapter-default-execution-mutated'
  | 'feature-observation-status-mismatch'
  | 'route-gate-candidate-status-mismatch'
  | 'support-region-candidate-status-mismatch'
  | 'feature-count-mismatch'
  | 'route-gate-count-mismatch'
  | 'support-region-count-mismatch'
  | 'unexpected-shape-mutation';

export interface ProfileAwareFieldStackSummaryIssue {
  code: ProfileAwareFieldStackSummaryIssueCode;
  message: string;
  layer?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface ProfileAwareFieldStackSummaryReport {
  reportId: string;
  method: 'profile-aware-field-stack-summary-diagnostic-v0';
  diagnosticScope: 'profile-aware-field-stack-summary-only';
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  policyRelativityStatus: 'policy-relative';
  contrastPolicyNote: 'old-policy-not-assumed-invariant';
  integrationStatus: 'diagnostic-only';
  runtimeIntegrationStatus: 'not-runtime-integrated';
  uiExposureStatus: 'not-ui-exposed';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  phaseContinuityStatus: 'not-global-phase-continuity';
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
  fieldAtlasMutationStatus: 'not-mutated';
  profileAwarePolicyOk: boolean;
  atlasAdapterOk: boolean;
  atlasExecutionOk: boolean;
  shapePositionResolverOk: boolean;
  surfaceAtlasOk: boolean;
  featureReportOk: boolean;
  featureStabilityOk: boolean;
  routeGateOk: boolean;
  supportRegionOk: boolean;
  evidenceStabilityOk: boolean;
  allLayersOk: boolean;
  adapterDefaultExecutionStatus: ProfileAwareAtlasAdapterReport['fieldAtlasExecutionStatus'];
  explicitAtlasExecutionStatus: 'profile-aware-atlas-executed';
  featureObservationStatus: ProfileAwareFeatureReportDiagnosticReport['observationStatus'];
  routeGateCandidateStatus: ProfileAwareRouteGateCandidateDiagnosticReport['candidateStatus'];
  supportRegionCandidateStatus: ProfileAwareSupportRegionCandidateDiagnosticReport['candidateStatus'];
  evidenceStabilitySensitivityStatus: 'reported-as-sensitivity-not-failure';
  primalSourceCount: number;
  childSourceCount: number;
  fieldReadySourceCount: number;
  fallbackChildSourceCount: number;
  unresolvedChildSourceCount: number;
  executableSourceCount: number;
  degeneracyStatusCount: number;
  shapeId: string;
  domainId?: string;
  domainKind?: ProfileAwareShapeResolvedSurfaceAtlasReport['domainKind'];
  chartCount: number;
  sampleCount: number;
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
  variantCount: number;
  samplingSensitive: boolean;
  profileSetupSensitive: boolean;
  changedCountKeys: ProfileAwareEvidenceStabilityCountKey[];
  maxBucketSaturation: ProfileAwareEvidenceStabilityMaxBucketSaturationFlags;
  issueCount: number;
  ok: boolean;
  issues: ProfileAwareFieldStackSummaryIssue[];
}

interface BuiltProfileAwareSourceChain {
  profileAwarePolicyReport: ProfileAwareFieldSourcePolicyDiagnosticReport;
  adapterReport: ProfileAwareAtlasAdapterReport;
}

const METHOD = 'profile-aware-field-stack-summary-diagnostic-v0';
const DIAGNOSTIC_SCOPE = 'profile-aware-field-stack-summary-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const CONTRAST_POLICY_NOTE = 'old-policy-not-assumed-invariant';
const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];

const SURFACE_SAMPLING_OPTIONS = {
  subdivisions: 1,
  maxSamples: 96,
};

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

export function buildProfileAwareFieldStackSummaryReport(): ProfileAwareFieldStackSummaryReport {
  const issues: ProfileAwareFieldStackSummaryIssue[] = [];
  const shape = applyAmboDissection(createSeedShape('tetrahedron'));
  const beforeShapeJson = JSON.stringify(shape);
  const { profileAwarePolicyReport, adapterReport } =
    buildProfileAwareSourceChain();
  const sourceCountMetadata = {
    fieldReadySourceCount: adapterReport.fieldReadySourceCount,
    fallbackChildSourceCount: adapterReport.fallbackChildSourceCount,
    unresolvedChildSourceCount: adapterReport.unresolvedChildSourceCount,
    degeneracyStatusCount: adapterReport.degeneracyStatusCount,
  };
  const atlasExecutionReport = buildProfileAwareAtlasExecutionReport(
    adapterReport.atlasSources,
    {
      reportIdSuffix: 'profile-aware-stack-summary',
      profileSystemId: adapterReport.profileSystemId,
      profileSetupId: adapterReport.profileSetupId,
      childInheritanceGrammarId: adapterReport.childInheritanceGrammarId,
      sourceCountMetadata,
    },
  );
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const surfaceAtlasResult = buildProfileAwareShapeResolvedSurfaceAtlas({
    shape,
    atlasSources: adapterReport.atlasSources,
    resolverReport,
    samplingOptions: SURFACE_SAMPLING_OPTIONS,
    sourceCountMetadata,
    reportIdSuffix: 'profile-aware-stack-summary',
  });
  const featureReport = buildProfileAwareFeatureReportDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'profile-aware-stack-summary',
  });
  const featureStabilityReport = buildProfileAwareFeatureStabilityReport();
  const routeGateReport = buildProfileAwareRouteGateCandidateDiagnosticReport({
    surfaceAtlasResult,
    routeGateOptions: ROUTE_GATE_OPTIONS,
    reportIdSuffix: 'profile-aware-stack-summary',
  });
  const supportRegionReport =
    buildProfileAwareSupportRegionCandidateDiagnosticReport({
      surfaceAtlasResult,
      supportRegionOptions: SUPPORT_REGION_OPTIONS,
      reportIdSuffix: 'profile-aware-stack-summary',
    });
  const evidenceStabilityReport = buildProfileAwareEvidenceStabilityReport();
  const shapeWasMutated = JSON.stringify(shape) !== beforeShapeJson;

  appendLayerIssues(
    [
      ['profileAwarePolicy', profileAwarePolicyReport.ok, profileAwarePolicyReport.issueCount],
      ['atlasAdapter', adapterReport.ok, adapterReport.issueCount],
      ['atlasExecution', atlasExecutionReport.ok, atlasExecutionReport.issueCount],
      ['shapePositionResolver', resolverReport.ok, resolverReport.issueCount],
      ['surfaceAtlas', surfaceAtlasResult.report.ok, surfaceAtlasResult.report.issueCount],
      ['featureReport', featureReport.ok, featureReport.issueCount],
      ['featureStability', featureStabilityReport.ok, featureStabilityReport.issueCount],
      ['routeGate', routeGateReport.ok, routeGateReport.issueCount],
      ['supportRegion', supportRegionReport.ok, supportRegionReport.issueCount],
      [
        'evidenceStability',
        evidenceStabilityReport.ok,
        evidenceStabilityReport.issueCount,
      ],
    ],
    issues,
  );
  appendBoundaryIssues(
    {
      adapterReport,
      featureReport,
      routeGateReport,
      supportRegionReport,
      shapeWasMutated,
    },
    issues,
  );
  appendCountCoherenceIssues(
    {
      featureReport,
      routeGateReport,
      supportRegionReport,
    },
    issues,
  );

  const profileAwarePolicyOk = profileAwarePolicyReport.ok;
  const atlasAdapterOk = adapterReport.ok;
  const atlasExecutionOk = atlasExecutionReport.ok;
  const shapePositionResolverOk = resolverReport.ok;
  const surfaceAtlasOk = surfaceAtlasResult.report.ok;
  const featureReportOk = featureReport.ok;
  const featureStabilityOk = featureStabilityReport.ok;
  const routeGateOk = routeGateReport.ok;
  const supportRegionOk = supportRegionReport.ok;
  const evidenceStabilityOk = evidenceStabilityReport.ok;
  const allLayersOk =
    profileAwarePolicyOk &&
    atlasAdapterOk &&
    atlasExecutionOk &&
    shapePositionResolverOk &&
    surfaceAtlasOk &&
    featureReportOk &&
    featureStabilityOk &&
    routeGateOk &&
    supportRegionOk &&
    evidenceStabilityOk;
  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:tetrahedron-one-ambo`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    sourcePolicyId: SOURCE_POLICY_ID,
    policyRelativityStatus: 'policy-relative',
    contrastPolicyNote: CONTRAST_POLICY_NOTE,
    integrationStatus: 'diagnostic-only',
    runtimeIntegrationStatus: 'not-runtime-integrated',
    uiExposureStatus: 'not-ui-exposed',
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    phaseContinuityStatus: 'not-global-phase-continuity',
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated',
    fieldAtlasMutationStatus: 'not-mutated',
    profileAwarePolicyOk,
    atlasAdapterOk,
    atlasExecutionOk,
    shapePositionResolverOk,
    surfaceAtlasOk,
    featureReportOk,
    featureStabilityOk,
    routeGateOk,
    supportRegionOk,
    evidenceStabilityOk,
    allLayersOk,
    adapterDefaultExecutionStatus: adapterReport.fieldAtlasExecutionStatus,
    explicitAtlasExecutionStatus: atlasExecutionReport.fieldAtlasExecutionStatus,
    featureObservationStatus: featureReport.observationStatus,
    routeGateCandidateStatus: routeGateReport.candidateStatus,
    supportRegionCandidateStatus: supportRegionReport.candidateStatus,
    evidenceStabilitySensitivityStatus: 'reported-as-sensitivity-not-failure',
    primalSourceCount: profileAwarePolicyReport.primalSourceCount,
    childSourceCount: profileAwarePolicyReport.childSourceCount,
    fieldReadySourceCount: profileAwarePolicyReport.fieldReadySourceCount,
    fallbackChildSourceCount: profileAwarePolicyReport.fallbackChildSourceCount,
    unresolvedChildSourceCount: profileAwarePolicyReport.unresolvedChildSourceCount,
    executableSourceCount: surfaceAtlasResult.report.executableSourceCount,
    degeneracyStatusCount: profileAwarePolicyReport.degeneracyStatusCount,
    shapeId: surfaceAtlasResult.report.shapeId,
    ...(surfaceAtlasResult.report.domainId
      ? { domainId: surfaceAtlasResult.report.domainId }
      : {}),
    ...(surfaceAtlasResult.report.domainKind
      ? { domainKind: surfaceAtlasResult.report.domainKind }
      : {}),
    chartCount: surfaceAtlasResult.report.chartCount,
    sampleCount: surfaceAtlasResult.report.sampleCount,
    totalObservationCount: featureReport.totalObservationCount,
    cancellationLikeObservationCount:
      featureReport.cancellationLikeObservationCount,
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
    variantCount: evidenceStabilityReport.variantCount,
    samplingSensitive:
      evidenceStabilityReport.sensitivitySummary.samplingSensitive,
    profileSetupSensitive:
      evidenceStabilityReport.sensitivitySummary.profileSetupSensitive,
    changedCountKeys: [
      ...evidenceStabilityReport.sensitivitySummary.changedCountKeys,
    ],
    maxBucketSaturation: {
      ...evidenceStabilityReport.sensitivitySummary.maxBucketSaturation,
    },
    issueCount,
    ok: allLayersOk && issueCount === 0,
    issues,
  };
}

function buildProfileAwareSourceChain(): BuiltProfileAwareSourceChain {
  const vertexIds = createTetrahedralVertexFixture();
  const profileSystem = createUniformCirclePrimalProfileSystemFixture();
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

  return {
    profileAwarePolicyReport,
    adapterReport,
  };
}

function appendLayerIssues(
  layers: Array<[layer: string, ok: boolean, issueCount: number]>,
  issues: ProfileAwareFieldStackSummaryIssue[],
): void {
  for (const [layer, ok, issueCount] of layers) {
    if (ok) {
      continue;
    }

    issues.push({
      code: 'layer-report-not-ok',
      message: `Profile-aware stack summary layer ${layer} did not build cleanly.`,
      layer,
      details: {
        layerIssueCount: issueCount,
      },
    });
  }
}

function appendBoundaryIssues(
  args: {
    adapterReport: ProfileAwareAtlasAdapterReport;
    featureReport: ProfileAwareFeatureReportDiagnosticReport;
    routeGateReport: ProfileAwareRouteGateCandidateDiagnosticReport;
    supportRegionReport: ProfileAwareSupportRegionCandidateDiagnosticReport;
    shapeWasMutated: boolean;
  },
  issues: ProfileAwareFieldStackSummaryIssue[],
): void {
  if (args.adapterReport.fieldAtlasExecutionStatus !== 'input-built-not-executed') {
    issues.push({
      code: 'adapter-default-execution-mutated',
      message:
        'Profile-aware stack summary expected the atlas adapter default to remain input-built-not-executed.',
      layer: 'atlasAdapter',
      details: {
        fieldAtlasExecutionStatus: args.adapterReport.fieldAtlasExecutionStatus,
      },
    });
  }

  if (
    args.featureReport.observationStatus !== 'report-candidate' ||
    args.featureReport.nonCandidateObservationCount > 0
  ) {
    issues.push({
      code: 'feature-observation-status-mismatch',
      message:
        'Profile-aware stack summary expected feature observations to remain report-candidate.',
      layer: 'featureReport',
      details: {
        nonCandidateObservationCount:
          args.featureReport.nonCandidateObservationCount,
      },
    });
  }

  if (
    args.routeGateReport.candidateStatus !== 'candidate-only' ||
    args.routeGateReport.nonCandidateStatusCount > 0
  ) {
    issues.push({
      code: 'route-gate-candidate-status-mismatch',
      message:
        'Profile-aware stack summary expected route/gate reports to remain candidate-only.',
      layer: 'routeGate',
      details: {
        nonCandidateStatusCount: args.routeGateReport.nonCandidateStatusCount,
      },
    });
  }

  if (
    args.supportRegionReport.candidateStatus !== 'candidate-only' ||
    args.supportRegionReport.nonCandidateStatusCount > 0
  ) {
    issues.push({
      code: 'support-region-candidate-status-mismatch',
      message:
        'Profile-aware stack summary expected support/region reports to remain candidate-only.',
      layer: 'supportRegion',
      details: {
        nonCandidateStatusCount: args.supportRegionReport.nonCandidateStatusCount,
      },
    });
  }

  if (args.shapeWasMutated) {
    issues.push({
      code: 'unexpected-shape-mutation',
      message: 'Profile-aware stack summary unexpectedly mutated the diagnostic Shape.',
      details: {
        shapeMutationDetected: true,
      },
    });
  }
}

function appendCountCoherenceIssues(
  args: {
    featureReport: ProfileAwareFeatureReportDiagnosticReport;
    routeGateReport: ProfileAwareRouteGateCandidateDiagnosticReport;
    supportRegionReport: ProfileAwareSupportRegionCandidateDiagnosticReport;
  },
  issues: ProfileAwareFieldStackSummaryIssue[],
): void {
  const featureCountTotal =
    args.featureReport.cancellationLikeObservationCount +
    args.featureReport.highIntensityAnchorObservationCount +
    args.featureReport.ambiguousObservationCount;

  if (args.featureReport.totalObservationCount !== featureCountTotal) {
    issues.push({
      code: 'feature-count-mismatch',
      message:
        'Profile-aware stack summary feature observation counts are not internally coherent.',
      layer: 'featureReport',
      details: {
        totalObservationCount: args.featureReport.totalObservationCount,
        derivedObservationCount: featureCountTotal,
      },
    });
  }

  const routeGateCountTotal =
    args.routeGateReport.gateCandidateCount +
    args.routeGateReport.routeCandidateCount +
    args.routeGateReport.blockedRouteCandidateCount;

  if (args.routeGateReport.totalCandidateCount !== routeGateCountTotal) {
    issues.push({
      code: 'route-gate-count-mismatch',
      message:
        'Profile-aware stack summary route/gate candidate counts are not internally coherent.',
      layer: 'routeGate',
      details: {
        totalCandidateCount: args.routeGateReport.totalCandidateCount,
        derivedCandidateCount: routeGateCountTotal,
      },
    });
  }

  const supportRegionCountTotal =
    args.supportRegionReport.supportClassCandidateCount +
    args.supportRegionReport.regionCandidateCount +
    args.supportRegionReport.constraintSiteCandidateCount +
    args.supportRegionReport.routeFailureRegionCandidateCount;

  if (args.supportRegionReport.totalCandidateCount !== supportRegionCountTotal) {
    issues.push({
      code: 'support-region-count-mismatch',
      message:
        'Profile-aware stack summary support/region candidate counts are not internally coherent.',
      layer: 'supportRegion',
      details: {
        totalCandidateCount: args.supportRegionReport.totalCandidateCount,
        derivedCandidateCount: supportRegionCountTotal,
      },
    });
  }
}
