export type PSimplexT28C0ChannelId = 'P' | 'S' | 'V' | 'K' | 'G';
export type PSimplexT28C0BranchRef = 'wgate/arf-w1-root-frame-v0';
export type PSimplexT28C0EvidenceStream =
  | 'scalar-propagation-field-atlas'
  | 'structured-source-state'
  | 'p-simplex-vector-order-parameter'
  | 'relation-locality-k3-sampling'
  | 'p2-one-third-germ-readout';
export type PSimplexT28C0MaturityStatus =
  | 'diagnostic-only'
  | 'candidate-only'
  | 'boundary-only'
  | 'source-skeleton-only'
  | 'not-found';
export type PSimplexT28C0FieldResidueRisk = 'none' | 'low' | 'medium' | 'high';
export type PSimplexT28C0EligibilityStatus =
  | 'eligible'
  | 'eligible-boundary-only'
  | 'eligible-but-quarantined'
  | 'ineligible-missing-repo-object'
  | 'ineligible-missing-builder'
  | 'ineligible-missing-package-script'
  | 'ineligible-foreign-or-stale-stream'
  | 'ineligible-field-residue-risk';
export type PSimplexT28C0AxisTransverseMaterialStatus =
  | 'available-computed'
  | 'available-closed-enum'
  | 'available-skeleton-only'
  | 'available-boundary-only'
  | 'unavailable'
  | 'not-applicable';
export type PSimplexT28C0BranchCollapseRisk = 'none' | 'low' | 'medium' | 'high';
export type PSimplexT28C0SummaryVerdict =
  | 'eligible-for-cross-projection-audit'
  | 'eligible-but-P-channel-quarantined'
  | 'eligible-but-G-channel-boundary-only'
  | 'eligible-but-requires-researcher-survival-metric'
  | 'ineligible-missing-candidate-definition'
  | 'ineligible-missing-channel-provenance'
  | 'ineligible-missing-computed-axis-transverse-fields'
  | 'ineligible-branch-collapse-risk'
  | 'ineligible-field-resurrection-risk'
  | 'ineligible-forbidden-promotion-detected';
export type PSimplexT28C0ForbiddenMaturity =
  | 'not-route'
  | 'not-gate'
  | 'not-loop'
  | 'not-vortex'
  | 'not-support-region'
  | 'not-topology'
  | 'not-fieldcue'
  | 'not-semantic-naming'
  | 'not-runtime';

export interface PSimplexT28C0SourceFileProbe {
  exists: boolean;
  text: string;
}

export interface PSimplexT28C0RepoProbe {
  branchRef: string;
  currentBranchRef: string | null;
  packageScripts: Record<string, string>;
  sourceFiles: Record<string, PSimplexT28C0SourceFileProbe>;
}

export interface PSimplexT28C0CandidateRow {
  candidateId: 'ATD-H0';
  candidateName: 'axis/transverse discrimination hypothesis';
  candidateOrigin: 'researcher-proposed-after-T28-B-reconciliation';
  priorAcceptedObject: false;
  candidateStatus: 'newly-proposed-research-hypothesis';
  maturityStatus: 'pre-feature-eligibility-only';
  survivalAuditAllowed: boolean;
  survivalAuditBlockedReasons: string[];
  forbiddenMaturity: PSimplexT28C0ForbiddenMaturity[];
}

export interface PSimplexT28C0ChannelProvenanceRow {
  channelId: PSimplexT28C0ChannelId;
  channelName: string;
  repoPaths: string[];
  missingRepoPaths: string[];
  builderFunctions: string[];
  missingBuilderEvidenceGroups: string[];
  packageScripts: string[];
  missingPackageScripts: string[];
  branchRef: PSimplexT28C0BranchRef;
  evidenceStream: PSimplexT28C0EvidenceStream;
  diagnosticScope: string[];
  foundStatusVocabulary: string[];
  missingStatusVocabulary: string[];
  maturityStatus: PSimplexT28C0MaturityStatus;
  positiveEvidenceAllowed: boolean;
  boundaryOnly: boolean;
  fieldResidueRisk: PSimplexT28C0FieldResidueRisk;
  forbiddenUses: string[];
  eligibilityStatus: PSimplexT28C0EligibilityStatus;
}

export interface PSimplexT28C0AxisTransverseAvailabilityRow {
  channelId: PSimplexT28C0ChannelId;
  axisTransverseMaterialStatus: PSimplexT28C0AxisTransverseMaterialStatus;
  exampleFields: string[];
  canSupportLaterSurvivalTest: boolean;
  canOnlyConstrainLaterSurvivalTest: boolean;
  notes: string[];
}

export interface PSimplexT28C0BranchEvidenceGuard {
  allChannelsSameRepo: boolean;
  allChannelsSameBranchRef: boolean;
  foreignBranchEvidenceDetected: boolean;
  staleFieldResidueDetected: boolean;
  teamArmanOrW2EvidenceDetected: boolean;
  fieldResidueQuarantined: boolean;
  branchCollapseRisk: PSimplexT28C0BranchCollapseRisk;
}

export interface PSimplexT28C0BoundaryRow {
  boundaryId:
    | 'not-fieldcue'
    | 'not-semantic-naming'
    | 'not-topology'
    | 'not-route-gate-confirmation'
    | 'not-loop-vortex-support-region'
    | 'not-runtime-substrate'
    | 'not-generated-site-reading'
    | 'not-closed-A3-response'
    | 'not-body-response'
    | 'not-field-resurrection'
    | 'not-survival-audit';
  statement: string;
  enforced: true;
}

export interface PSimplexT28C0FalsifierRow {
  falsifierId:
    | 'F1'
    | 'F2'
    | 'F3'
    | 'F4'
    | 'F5'
    | 'F6'
    | 'F7'
    | 'F8'
    | 'F9'
    | 'F10'
    | 'F11';
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export interface PSimplexT28C0EligibilitySummary {
  eligibleChannelCount: number;
  ineligibleChannelCount: number;
  quarantinedChannelCount: number;
  boundaryOnlyChannelCount: number;
  positiveEvidenceChannelCount: number;
  axisTransverseSupportCandidateChannels: PSimplexT28C0ChannelId[];
  constraintOnlyChannels: PSimplexT28C0ChannelId[];
  blockedReasons: string[];
  laterAuditPreconditions: string[];
}

export interface PSimplexT28C0Report {
  method: 'p-simplex-cross-projection-provenance-eligibility-preflight-t28c0';
  diagnosticScope: 'cross-projection-provenance-and-eligibility-preflight-only';
  branchRef: PSimplexT28C0BranchRef;
  candidateRow: PSimplexT28C0CandidateRow;
  channelProvenanceRows: PSimplexT28C0ChannelProvenanceRow[];
  axisTransverseAvailabilityRows: PSimplexT28C0AxisTransverseAvailabilityRow[];
  branchEvidenceGuard: PSimplexT28C0BranchEvidenceGuard;
  boundaryRows: PSimplexT28C0BoundaryRow[];
  falsifierRows: PSimplexT28C0FalsifierRow[];
  eligibilitySummary: PSimplexT28C0EligibilitySummary;
  summaryVerdict: PSimplexT28C0SummaryVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface BuilderEvidenceGroup {
  groupId: string;
  tokens: readonly string[];
}

interface ChannelDefinition {
  channelId: PSimplexT28C0ChannelId;
  channelName: string;
  repoPaths: readonly string[];
  builderEvidenceGroups: readonly BuilderEvidenceGroup[];
  packageScripts: readonly string[];
  evidenceStream: PSimplexT28C0EvidenceStream;
  diagnosticScope: readonly string[];
  statusVocabulary: readonly string[];
  defaultMaturityStatus: Exclude<PSimplexT28C0MaturityStatus, 'not-found'>;
  defaultFieldResidueRisk: PSimplexT28C0FieldResidueRisk;
  forbiddenUses: readonly string[];
  boundaryOnly: boolean;
}

const BRANCH_REF: PSimplexT28C0BranchRef = 'wgate/arf-w1-root-frame-v0';
const FORBIDDEN_MATURITY: readonly PSimplexT28C0ForbiddenMaturity[] = [
  'not-route',
  'not-gate',
  'not-loop',
  'not-vortex',
  'not-support-region',
  'not-topology',
  'not-fieldcue',
  'not-semantic-naming',
  'not-runtime',
];
const FORBIDDEN_VERDICTS = [
  'acts-v0-survives',
  'fieldworld-feature-confirmed',
  'route-confirmed',
  'gate-confirmed',
  'fieldcue-ready',
  'generated-site-reading-ready',
] as const;
const CHANNEL_DEFINITIONS: readonly ChannelDefinition[] = [
  {
    channelId: 'P',
    channelName: 'scalar propagation / field residue',
    repoPaths: [
      'src/lib/fieldAtlas.ts',
      'src/lib/fieldAtlasRouteGateCandidates.ts',
      'src/lib/fieldSourceProfileAwareRouteGateCandidates.ts',
    ],
    builderEvidenceGroups: [
      {
        groupId: 'field-route-gate-candidate-builder',
        tokens: ['buildFieldRouteGateCandidateReport', 'buildFieldRouteGateCandidate', 'buildFieldRouteGateCandidates'],
      },
      {
        groupId: 'profile-aware-route-gate-candidate-builder',
        tokens: ['buildProfileAwareRouteGateCandidateDiagnosticReport', 'buildFieldSourceProfileAwareRouteGate'],
      },
    ],
    packageScripts: ['diagnose:field-atlas', 'diagnose:field-source-profile-aware-route-gate-candidates'],
    evidenceStream: 'scalar-propagation-field-atlas',
    diagnosticScope: ['scalar-field-observations', 'route-gate-candidate-only-boundary'],
    statusVocabulary: [
      'field-route-gate-candidates-v0',
      'candidate-only',
      'not-semantic-naming',
      'not-topology-workspace',
      'insufficient-for-confirmed-route',
      'insufficient-for-confirmed-gate',
    ],
    defaultMaturityStatus: 'candidate-only',
    defaultFieldResidueRisk: 'high',
    boundaryOnly: false,
    forbiddenUses: [
      'must-not-confirm-routes',
      'must-not-confirm-gates',
      'must-not-confirm-topology',
      'must-not-confirm-semantics',
      'must-not-create-FieldCue',
    ],
  },
  {
    channelId: 'S',
    channelName: 'structured source-state / structural projection',
    repoPaths: [
      'src/lib/structuredSourceStateDiagnosticV0.ts',
      'src/lib/structuredSourceStateMultiProjectionStructuralChannelV0.ts',
    ],
    builderEvidenceGroups: [
      { groupId: 'structured-source-state-builder', tokens: ['buildStructuredSourceStateDiagnosticV0Report'] },
      {
        groupId: 'multi-projection-structural-channel-builder',
        tokens: ['buildStructuredSourceStateMultiProjectionStructuralChannelV0Report'],
      },
    ],
    packageScripts: [
      'diagnose:structured-source-state-v0',
      'diagnose:structured-source-state-multi-projection-structural-channel-v0',
    ],
    evidenceStream: 'structured-source-state',
    diagnosticScope: ['source-state-skeleton', 'structural-projection-visibility'],
    statusVocabulary: [
      'structured-source-state-multi-projection-structural-channel-v0',
      'multi-projection-structural-channel-diagnostic-only',
      'not-semantic-naming',
      'not-topology-workspace',
      'not-packet-writing',
      'not-shape-mutation',
    ],
    defaultMaturityStatus: 'source-skeleton-only',
    defaultFieldResidueRisk: 'low',
    boundaryOnly: true,
    forbiddenUses: ['must-not-prove-field-behavior', 'must-not-prove-emergence-by-itself'],
  },
  {
    channelId: 'V',
    channelName: 'P-simplex vector order parameter',
    repoPaths: ['src/lib/pSimplexVectorOrderParameterDiagnosticV0.ts'],
    builderEvidenceGroups: [
      {
        groupId: 'p-simplex-vector-order-parameter-builder',
        tokens: ['buildPSimplexVectorOrderParameterDiagnosticV0Report'],
      },
      { groupId: 'p-simplex-vector-order-computed-row', tokens: ['PSimplexChildAxisPairRowV0', 'axisResult'] },
    ],
    packageScripts: ['diagnose:p-simplex-vector-order-parameter-v0'],
    evidenceStream: 'p-simplex-vector-order-parameter',
    diagnosticScope: ['R3-vector-order-behavior', 'axis-result-closed-vocabulary'],
    statusVocabulary: [
      'axis-preserved',
      'axis-flipped',
      'axis-cancelled',
      'axis-bent',
      'threshold-sensitive',
      'source-population-amputated',
      'PSimplexChildAxisPairRowV0',
    ],
    defaultMaturityStatus: 'diagnostic-only',
    defaultFieldResidueRisk: 'none',
    boundaryOnly: false,
    forbiddenUses: ['must-not-be-treated-as-full-field-implementation', 'must-not-be-treated-as-LG-solver'],
  },
  {
    channelId: 'K',
    channelName: 'relation/locality/K3 sampling',
    repoPaths: [
      'src/lib/pSimplexVectorOrderParameterLocalityDiagnosticV0.ts',
      'src/lib/pSimplexRelationAuditedSamplingDiagnosticV0.ts',
      'src/lib/pSimplexGeometryGraphSamplingGateK3V0.ts',
    ],
    builderEvidenceGroups: [
      {
        groupId: 'p-simplex-vector-order-locality-builder',
        tokens: ['buildPSimplexVectorOrderParameterLocalityDiagnosticV0Report'],
      },
      {
        groupId: 'p-simplex-relation-audited-sampling-builder',
        tokens: ['buildPSimplexRelationAuditedSamplingDiagnosticV0Report'],
      },
      { groupId: 'p-simplex-k3-sampling-builder', tokens: ['buildPSimplexGeometryGraphSamplingGateK3V0Report'] },
    ],
    packageScripts: [
      'diagnose:p-simplex-vector-order-parameter-locality-v0',
      'diagnose:p-simplex-relation-audited-sampling-v0',
      'diagnose:p-simplex-geometry-graph-sampling-k3-v0',
    ],
    evidenceStream: 'relation-locality-k3-sampling',
    diagnosticScope: ['relation-kernel-locality-evidence', 'K3-sample-family-closed-vocabulary'],
    statusVocabulary: [
      'K3-G',
      'K3-E',
      'K3-A-primary',
      'K3-A-complement',
      'K3-T',
      'graph-distance',
      'euclidean-radial',
      'axis-preserved',
      'axis-flipped',
      'axis-cancelled',
      'unreadable-under-axis-policy',
      'localitySensitive',
      'kernelArtifactRisk',
    ],
    defaultMaturityStatus: 'diagnostic-only',
    defaultFieldResidueRisk: 'low',
    boundaryOnly: false,
    forbiddenUses: [
      'must-not-confirm-routes',
      'must-not-confirm-walks',
      'must-not-confirm-holonomy',
      'must-not-confirm-topology',
      'must-not-confirm-dense-field-ecology',
    ],
  },
  {
    channelId: 'G',
    channelName: 'P2(1/3) germ/readout boundary',
    repoPaths: [
      'src/lib/pSimplexP2OneThirdNonlinearAxisBranchContinuationAuditT27.ts',
      'src/lib/pSimplexP2OneThirdSixSiteConvention2GermPressureWitnessMapT28A.ts',
    ],
    builderEvidenceGroups: [
      {
        groupId: 'p2-one-third-nonlinear-branch-builder',
        tokens: ['buildPSimplexP2OneThirdNonlinearAxisBranchContinuationAuditT27Report'],
      },
      {
        groupId: 'p2-one-third-six-site-witness-map-builder',
        tokens: ['buildPSimplexP2OneThirdSixSiteConvention2GermPressureWitnessMapT28AReport'],
      },
    ],
    packageScripts: [
      'diagnose:p-simplex-p2-one-third-nonlinear-axis-branch-continuation-audit-t27',
      'diagnose:p-simplex-p2-one-third-six-site-convention2-germ-pressure-witness-map-t28a',
    ],
    evidenceStream: 'p2-one-third-germ-readout',
    diagnosticScope: ['germ-readout-boundary', 'six-site-witness-boundary'],
    statusVocabulary: [
      'P2-one-third-nonlinear-axis-branch-confirmed',
      'six-site-pressure-witness-map-coherent',
      'finite-amplitude-germ-stability-witness',
      'structural-pressure-primitive-not-fieldcue',
      'not-closed-response',
      'not-fieldcue',
      'not-semantic-naming',
      'not-topology-workspace',
      'not-runtime-substrate',
    ],
    defaultMaturityStatus: 'boundary-only',
    defaultFieldResidueRisk: 'low',
    boundaryOnly: true,
    forbiddenUses: [
      'must-not-prove-spatial-propagation',
      'must-not-prove-field-world-feature-survival',
      'must-not-prove-route-gate-behavior',
      'must-not-close-A3-response',
      'must-not-create-FieldCue',
      'must-not-authorize-runtime-adoption',
    ],
  },
];

export function buildPSimplexCrossProjectionProvenanceEligibilityPreflightT28C0Report(
  probe: PSimplexT28C0RepoProbe,
): PSimplexT28C0Report {
  const channelProvenanceRows = CHANNEL_DEFINITIONS.map((definition) => buildChannelProvenanceRow(definition, probe));
  const axisTransverseAvailabilityRows = channelProvenanceRows.map((row) => buildAxisTransverseAvailabilityRow(row, probe));
  const branchEvidenceGuard = buildBranchEvidenceGuard(channelProvenanceRows, probe);
  const boundaryRows = buildBoundaryRows();
  const preliminarySummaryVerdict = classifySummaryVerdict({
    candidatePriorAccepted: false,
    channelProvenanceRows,
    axisTransverseAvailabilityRows,
    branchEvidenceGuard,
    boundaryRows,
    survivalMetricPlaceholderPresent: survivalMetricPlaceholderPresent(probe),
  });
  const eligibilitySummary = buildEligibilitySummary(
    channelProvenanceRows,
    axisTransverseAvailabilityRows,
    preliminarySummaryVerdict,
  );
  const candidateRow = buildCandidateRow(preliminarySummaryVerdict, eligibilitySummary);
  const falsifierRows = buildFalsifierRows({
    candidateRow,
    channelProvenanceRows,
    axisTransverseAvailabilityRows,
    branchEvidenceGuard,
    boundaryRows,
    summaryVerdict: preliminarySummaryVerdict,
  });
  const summaryVerdict = classifySummaryVerdict({
    candidatePriorAccepted: candidateRow.priorAcceptedObject,
    channelProvenanceRows,
    axisTransverseAvailabilityRows,
    branchEvidenceGuard,
    boundaryRows,
    survivalMetricPlaceholderPresent: survivalMetricPlaceholderPresent(probe),
  });
  const integrityIssues = buildIntegrityIssues({
    candidateRow,
    channelProvenanceRows,
    axisTransverseAvailabilityRows,
    branchEvidenceGuard,
    boundaryRows,
    falsifierRows,
    eligibilitySummary,
    summaryVerdict,
  });

  return {
    method: 'p-simplex-cross-projection-provenance-eligibility-preflight-t28c0',
    diagnosticScope: 'cross-projection-provenance-and-eligibility-preflight-only',
    branchRef: BRANCH_REF,
    candidateRow,
    channelProvenanceRows,
    axisTransverseAvailabilityRows,
    branchEvidenceGuard,
    boundaryRows,
    falsifierRows,
    eligibilitySummary,
    summaryVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0,
  };
}

function buildChannelProvenanceRow(
  definition: ChannelDefinition,
  probe: PSimplexT28C0RepoProbe,
): PSimplexT28C0ChannelProvenanceRow {
  const sourceText = sourceTextFor(definition.repoPaths, probe);
  const missingRepoPaths = definition.repoPaths.filter((repoPath) => !sourceExists(repoPath, probe));
  const builderFunctions = unique(
    definition.builderEvidenceGroups.flatMap((group) => group.tokens.filter((token) => sourceText.includes(token))),
  );
  const missingBuilderEvidenceGroups = definition.builderEvidenceGroups
    .filter((group) => !group.tokens.some((token) => sourceText.includes(token)))
    .map((group) => group.groupId);
  const packageScripts = definition.packageScripts.filter((script) => Object.prototype.hasOwnProperty.call(probe.packageScripts, script));
  const missingPackageScripts = definition.packageScripts.filter((script) => !Object.prototype.hasOwnProperty.call(probe.packageScripts, script));
  const foundStatusVocabulary = definition.statusVocabulary.filter((token) => sourceText.includes(token));
  const missingStatusVocabulary = definition.statusVocabulary.filter((token) => !sourceText.includes(token));
  const maturityStatus = missingRepoPaths.length > 0 ? 'not-found' : definition.defaultMaturityStatus;
  const fieldResidueRisk = definition.defaultFieldResidueRisk;
  const positiveEvidenceAllowed = positiveEvidenceAllowedFor(definition.channelId, sourceText, missingRepoPaths, missingBuilderEvidenceGroups);
  const boundaryOnly = definition.boundaryOnly;
  const eligibilityStatus = classifyChannelEligibilityStatus({
    definition,
    missingRepoPaths,
    missingBuilderEvidenceGroups,
    missingPackageScripts,
    foundStatusVocabulary,
    sourceText,
  });

  return {
    channelId: definition.channelId,
    channelName: definition.channelName,
    repoPaths: [...definition.repoPaths],
    missingRepoPaths,
    builderFunctions,
    missingBuilderEvidenceGroups,
    packageScripts,
    missingPackageScripts,
    branchRef: BRANCH_REF,
    evidenceStream: definition.evidenceStream,
    diagnosticScope: [...definition.diagnosticScope],
    foundStatusVocabulary,
    missingStatusVocabulary,
    maturityStatus,
    positiveEvidenceAllowed,
    boundaryOnly,
    fieldResidueRisk,
    forbiddenUses: [...definition.forbiddenUses],
    eligibilityStatus,
  };
}

function classifyChannelEligibilityStatus(args: {
  definition: ChannelDefinition;
  missingRepoPaths: readonly string[];
  missingBuilderEvidenceGroups: readonly string[];
  missingPackageScripts: readonly string[];
  foundStatusVocabulary: readonly string[];
  sourceText: string;
}): PSimplexT28C0EligibilityStatus {
  if (args.missingRepoPaths.length > 0) {
    return 'ineligible-missing-repo-object';
  }

  if (sourceHasForeignOrStaleMarker(args.sourceText)) {
    return 'ineligible-foreign-or-stale-stream';
  }

  if (args.missingBuilderEvidenceGroups.length > 0) {
    return 'ineligible-missing-builder';
  }

  if (args.missingPackageScripts.length > 0) {
    return 'ineligible-missing-package-script';
  }

  if (args.definition.channelId === 'P') {
    return pChannelQuarantineBoundaryPasses(args.foundStatusVocabulary)
      ? 'eligible-but-quarantined'
      : 'ineligible-field-residue-risk';
  }

  if (args.definition.boundaryOnly) {
    return 'eligible-boundary-only';
  }

  return 'eligible';
}

function buildAxisTransverseAvailabilityRow(
  row: PSimplexT28C0ChannelProvenanceRow,
  probe: PSimplexT28C0RepoProbe,
): PSimplexT28C0AxisTransverseAvailabilityRow {
  const sourceText = sourceTextFor(row.repoPaths, probe);

  if (row.maturityStatus === 'not-found') {
    return {
      channelId: row.channelId,
      axisTransverseMaterialStatus: 'unavailable',
      exampleFields: [],
      canSupportLaterSurvivalTest: false,
      canOnlyConstrainLaterSurvivalTest: false,
      notes: ['One or more required repo paths are missing, so no axis/transverse availability is claimed.'],
    };
  }

  if (row.channelId === 'S') {
    return {
      channelId: row.channelId,
      axisTransverseMaterialStatus: 'available-skeleton-only',
      exampleFields: availableTokens(sourceText, [
        'edge',
        'complement',
        'antipodal',
        'axisPair',
        'projection',
        'structuralProjection',
      ]),
      canSupportLaterSurvivalTest: false,
      canOnlyConstrainLaterSurvivalTest: true,
      notes: ['S-channel provides source-state skeleton/provenance only; it cannot prove feature survival by itself.'],
    };
  }

  if (row.channelId === 'G') {
    return {
      channelId: row.channelId,
      axisTransverseMaterialStatus: 'available-boundary-only',
      exampleFields: availableTokens(sourceText, [
        'axisDominanceStatus',
        'exactGermContrastStatus',
        'antipodalCovarianceStatus',
        'bodyShadowMarginStatus',
        'not-fieldcue',
      ]),
      canSupportLaterSurvivalTest: false,
      canOnlyConstrainLaterSurvivalTest: true,
      notes: ['G-channel bounds germ/readout interpretation; it is not spatial propagation evidence.'],
    };
  }

  if (row.channelId === 'V') {
    const computed = sourceText.includes('PSimplexChildAxisPairRowV0') && sourceText.includes('axisResult');
    const closedEnum = ['axis-preserved', 'axis-flipped', 'axis-cancelled', 'axis-bent', 'threshold-sensitive'].every((token) =>
      sourceText.includes(token),
    );

    return {
      channelId: row.channelId,
      axisTransverseMaterialStatus: computed ? 'available-computed' : closedEnum ? 'available-closed-enum' : 'unavailable',
      exampleFields: availableTokens(sourceText, [
        'axisResult',
        'signedAxisPair',
        'sourcePopulationStatus',
        'alignmentScore',
        'threshold-sensitive',
      ]),
      canSupportLaterSurvivalTest: computed || closedEnum,
      canOnlyConstrainLaterSurvivalTest: false,
      notes: ['V-channel exposes closed axis-result vocabulary and computed child-axis row material.'],
    };
  }

  if (row.channelId === 'K') {
    const computed =
      ['K3-G', 'K3-E', 'K3-A-primary', 'K3-A-complement', 'K3-T'].every((token) => sourceText.includes(token)) &&
      sourceText.includes('localitySensitive') &&
      sourceText.includes('kernelArtifactRisk');
    const closedEnum = ['axis-preserved', 'axis-flipped', 'axis-cancelled', 'unreadable-under-axis-policy'].every((token) =>
      sourceText.includes(token),
    );

    return {
      channelId: row.channelId,
      axisTransverseMaterialStatus: computed ? 'available-computed' : closedEnum ? 'available-closed-enum' : 'unavailable',
      exampleFields: availableTokens(sourceText, [
        'K3-G',
        'K3-E',
        'K3-A-primary',
        'K3-A-complement',
        'K3-T',
        'graph-distance',
        'euclidean-radial',
        'localitySensitive',
        'kernelArtifactRisk',
      ]),
      canSupportLaterSurvivalTest: computed || closedEnum,
      canOnlyConstrainLaterSurvivalTest: false,
      notes: ['K-channel exposes K3 relation/locality sample families and closed readability/status vocabulary.'],
    };
  }

  return {
    channelId: row.channelId,
    axisTransverseMaterialStatus: pChannelComputedMaterialAvailable(sourceText)
      ? 'available-computed'
      : 'not-applicable',
    exampleFields: availableTokens(sourceText, ['psi', 'intensity', 'phase', 'contributionMagnitude', 'contributionRatio']),
    canSupportLaterSurvivalTest: false,
    canOnlyConstrainLaterSurvivalTest: true,
    notes: [
      'P-channel scalar field material is field-residue risky and remains quarantined unless a later same-object ATD relation is defined.',
    ],
  };
}

function buildBranchEvidenceGuard(
  channelRows: readonly PSimplexT28C0ChannelProvenanceRow[],
  probe: PSimplexT28C0RepoProbe,
): PSimplexT28C0BranchEvidenceGuard {
  const allSourceText = sourceTextFor(channelRows.flatMap((row) => row.repoPaths), probe);
  const currentBranchMatches = probe.currentBranchRef === BRANCH_REF;
  const allChannelsSameRepo = channelRows.every(
    (row) => row.missingRepoPaths.length === 0 && row.repoPaths.every((repoPath) => repoPath.startsWith('src/lib/')),
  );
  const allChannelsSameBranchRef = currentBranchMatches && channelRows.every((row) => row.branchRef === BRANCH_REF);
  const foreignBranchEvidenceDetected = !currentBranchMatches || sourceHasForeignOrStaleMarker(allSourceText);
  const teamArmanOrW2EvidenceDetected = sourceHasTeamArmanOrW2Marker(allSourceText);
  const pChannel = channelRows.find((row) => row.channelId === 'P');
  const staleFieldResidueDetected = pChannel?.maturityStatus === 'candidate-only' && pChannel.fieldResidueRisk === 'high';
  const fieldResidueQuarantined =
    pChannel?.eligibilityStatus === 'eligible-but-quarantined' &&
    pChannel.foundStatusVocabulary.includes('candidate-only') &&
    pChannel.foundStatusVocabulary.includes('insufficient-for-confirmed-route') &&
    pChannel.foundStatusVocabulary.includes('insufficient-for-confirmed-gate');
  const branchCollapseRisk = classifyBranchCollapseRisk({
    foreignBranchEvidenceDetected,
    teamArmanOrW2EvidenceDetected,
    staleFieldResidueDetected,
    fieldResidueQuarantined,
  });

  return {
    allChannelsSameRepo,
    allChannelsSameBranchRef,
    foreignBranchEvidenceDetected,
    staleFieldResidueDetected,
    teamArmanOrW2EvidenceDetected,
    fieldResidueQuarantined,
    branchCollapseRisk,
  };
}

function classifyBranchCollapseRisk(args: {
  foreignBranchEvidenceDetected: boolean;
  teamArmanOrW2EvidenceDetected: boolean;
  staleFieldResidueDetected: boolean;
  fieldResidueQuarantined: boolean;
}): PSimplexT28C0BranchCollapseRisk {
  if (args.foreignBranchEvidenceDetected || args.teamArmanOrW2EvidenceDetected) {
    return 'high';
  }

  if (args.staleFieldResidueDetected && !args.fieldResidueQuarantined) {
    return 'high';
  }

  if (args.staleFieldResidueDetected && args.fieldResidueQuarantined) {
    return 'medium';
  }

  return 'none';
}

function buildBoundaryRows(): PSimplexT28C0BoundaryRow[] {
  return [
    {
      boundaryId: 'not-fieldcue',
      statement: 'Preflight does not create, detect, or authorize FieldCue.',
      enforced: true,
    },
    {
      boundaryId: 'not-semantic-naming',
      statement: 'ATD-H0 and channel rows are not semantic naming claims.',
      enforced: true,
    },
    {
      boundaryId: 'not-topology',
      statement: 'No topology workspace or topology operation is promoted.',
      enforced: true,
    },
    {
      boundaryId: 'not-route-gate-confirmation',
      statement: 'Route/gate candidate residue is not route or gate confirmation.',
      enforced: true,
    },
    {
      boundaryId: 'not-loop-vortex-support-region',
      statement: 'No loop, vortex, or support-region interpretation is introduced.',
      enforced: true,
    },
    {
      boundaryId: 'not-runtime-substrate',
      statement: 'No runtime substrate or runtime behavior is adopted.',
      enforced: true,
    },
    {
      boundaryId: 'not-generated-site-reading',
      statement: 'This preflight does not create generated-site reading.',
      enforced: true,
    },
    {
      boundaryId: 'not-closed-A3-response',
      statement: 'A3 remains unclosed response; germ evidence is boundary-only where applicable.',
      enforced: true,
    },
    {
      boundaryId: 'not-body-response',
      statement: 'Body-shadow or bodyward terms are not body response.',
      enforced: true,
    },
    {
      boundaryId: 'not-field-resurrection',
      statement: 'Field residue is quarantined and not resurrected into accepted field behavior.',
      enforced: true,
    },
    {
      boundaryId: 'not-survival-audit',
      statement: 'This report is only a provenance and eligibility preflight, not a survival audit.',
      enforced: true,
    },
  ];
}

function buildCandidateRow(
  summaryVerdict: PSimplexT28C0SummaryVerdict,
  eligibilitySummary: PSimplexT28C0EligibilitySummary,
): PSimplexT28C0CandidateRow {
  const ineligible = summaryVerdict.startsWith('ineligible-');

  return {
    candidateId: 'ATD-H0',
    candidateName: 'axis/transverse discrimination hypothesis',
    candidateOrigin: 'researcher-proposed-after-T28-B-reconciliation',
    priorAcceptedObject: false,
    candidateStatus: 'newly-proposed-research-hypothesis',
    maturityStatus: 'pre-feature-eligibility-only',
    survivalAuditAllowed: !ineligible,
    survivalAuditBlockedReasons: eligibilitySummary.blockedReasons,
    forbiddenMaturity: [...FORBIDDEN_MATURITY],
  };
}

function buildFalsifierRows(args: {
  candidateRow: PSimplexT28C0CandidateRow;
  channelProvenanceRows: readonly PSimplexT28C0ChannelProvenanceRow[];
  axisTransverseAvailabilityRows: readonly PSimplexT28C0AxisTransverseAvailabilityRow[];
  branchEvidenceGuard: PSimplexT28C0BranchEvidenceGuard;
  boundaryRows: readonly PSimplexT28C0BoundaryRow[];
  summaryVerdict: PSimplexT28C0SummaryVerdict;
}): PSimplexT28C0FalsifierRow[] {
  const pChannel = requiredChannel(args.channelProvenanceRows, 'P');
  const sChannel = requiredChannel(args.channelProvenanceRows, 'S');
  const gChannel = requiredChannel(args.channelProvenanceRows, 'G');
  const vAvailability = requiredAvailability(args.axisTransverseAvailabilityRows, 'V');
  const kAvailability = requiredAvailability(args.axisTransverseAvailabilityRows, 'K');
  const forbiddenPromotionDetected = forbiddenPromotionPresent(args.candidateRow, args.channelProvenanceRows, args.boundaryRows);

  return [
    falsifierRow(
      'F1',
      'ATD-H0 is treated as an accepted prior object.',
      args.candidateRow.priorAcceptedObject,
      `priorAcceptedObject=${args.candidateRow.priorAcceptedObject}; candidateStatus=${args.candidateRow.candidateStatus}.`,
    ),
    falsifierRow(
      'F2',
      'Any channel lacks repo path provenance.',
      args.channelProvenanceRows.some((row) => row.missingRepoPaths.length > 0),
      `${args.channelProvenanceRows.filter((row) => row.missingRepoPaths.length === 0).length}/${CHANNEL_DEFINITIONS.length} channels have all required repo paths.`,
    ),
    falsifierRow(
      'F3',
      'Any channel lacks a builder function or script where expected.',
      args.channelProvenanceRows.some(
        (row) => row.missingBuilderEvidenceGroups.length > 0 || row.missingPackageScripts.length > 0,
      ),
      `${args.channelProvenanceRows.filter((row) => row.missingBuilderEvidenceGroups.length === 0 && row.missingPackageScripts.length === 0).length}/${CHANNEL_DEFINITIONS.length} channels have builder and script evidence.`,
    ),
    falsifierRow(
      'F4',
      'Any channel is imported from a foreign/stale branch without explicit quarantine.',
      args.branchEvidenceGuard.branchCollapseRisk === 'high',
      `foreignBranchEvidenceDetected=${args.branchEvidenceGuard.foreignBranchEvidenceDetected}; teamArmanOrW2EvidenceDetected=${args.branchEvidenceGuard.teamArmanOrW2EvidenceDetected}; fieldResidueQuarantined=${args.branchEvidenceGuard.fieldResidueQuarantined}.`,
    ),
    falsifierRow(
      'F5',
      'S-channel is allowed to prove feature survival by itself.',
      sChannel.positiveEvidenceAllowed || !sChannel.boundaryOnly,
      `S positiveEvidenceAllowed=${sChannel.positiveEvidenceAllowed}; boundaryOnly=${sChannel.boundaryOnly}.`,
    ),
    falsifierRow(
      'F6',
      'P-channel route/gate candidates are treated as mature routes/gates.',
      pChannel.eligibilityStatus !== 'eligible-but-quarantined' && pChannel.eligibilityStatus !== 'ineligible-field-residue-risk',
      `P maturityStatus=${pChannel.maturityStatus}; eligibilityStatus=${pChannel.eligibilityStatus}.`,
    ),
    falsifierRow(
      'F7',
      'G-channel is treated as spatial propagation.',
      gChannel.positiveEvidenceAllowed || !gChannel.boundaryOnly,
      `G positiveEvidenceAllowed=${gChannel.positiveEvidenceAllowed}; boundaryOnly=${gChannel.boundaryOnly}.`,
    ),
    falsifierRow(
      'F8',
      'V/K statuses are vocabulary-mapped without computed rows or closed enums.',
      (vAvailability.canSupportLaterSurvivalTest &&
        !['available-computed', 'available-closed-enum'].includes(vAvailability.axisTransverseMaterialStatus)) ||
        (kAvailability.canSupportLaterSurvivalTest &&
          !['available-computed', 'available-closed-enum'].includes(kAvailability.axisTransverseMaterialStatus)),
      `V=${vAvailability.axisTransverseMaterialStatus}; K=${kAvailability.axisTransverseMaterialStatus}.`,
    ),
    falsifierRow(
      'F9',
      '"Non-contradictory" evidence is counted as support.',
      args.channelProvenanceRows.some(
        (row) =>
          row.positiveEvidenceAllowed &&
          (row.boundaryOnly || row.maturityStatus === 'source-skeleton-only' || row.eligibilityStatus === 'eligible-but-quarantined'),
      ),
      `Positive evidence channels: ${args.channelProvenanceRows
        .filter((row) => row.positiveEvidenceAllowed)
        .map((row) => row.channelId)
        .join(',')}.`,
    ),
    falsifierRow(
      'F10',
      'The report contains any FieldCue, semantic naming, topology, route/gate maturity, loop/vortex/support-region, or runtime promotion.',
      forbiddenPromotionDetected,
      'Forbidden promotion is checked through candidate maturity, channel maturity/status fields, and enforced boundary rows.',
    ),
    falsifierRow(
      'F11',
      'The top-level verdict is PASS/survival instead of eligibility/precheck.',
      !allowedSummaryVerdict(args.summaryVerdict),
      `summaryVerdict=${args.summaryVerdict}.`,
    ),
  ];
}

function buildEligibilitySummary(
  channelRows: readonly PSimplexT28C0ChannelProvenanceRow[],
  availabilityRows: readonly PSimplexT28C0AxisTransverseAvailabilityRow[],
  summaryVerdict: PSimplexT28C0SummaryVerdict,
): PSimplexT28C0EligibilitySummary {
  const eligibleRows = channelRows.filter((row) => row.eligibilityStatus.startsWith('eligible'));
  const ineligibleRows = channelRows.filter((row) => row.eligibilityStatus.startsWith('ineligible'));
  const axisTransverseSupportCandidateChannels = availabilityRows
    .filter((row) => row.canSupportLaterSurvivalTest)
    .map((row) => row.channelId);
  const constraintOnlyChannels = availabilityRows
    .filter((row) => row.canOnlyConstrainLaterSurvivalTest)
    .map((row) => row.channelId);
  const blockedReasons = buildBlockedReasons(channelRows, availabilityRows, summaryVerdict);

  return {
    eligibleChannelCount: eligibleRows.length,
    ineligibleChannelCount: ineligibleRows.length,
    quarantinedChannelCount: channelRows.filter((row) => row.eligibilityStatus === 'eligible-but-quarantined').length,
    boundaryOnlyChannelCount: channelRows.filter((row) => row.boundaryOnly).length,
    positiveEvidenceChannelCount: channelRows.filter((row) => row.positiveEvidenceAllowed).length,
    axisTransverseSupportCandidateChannels,
    constraintOnlyChannels,
    blockedReasons,
    laterAuditPreconditions: [
      'researcher-defined survival metric',
      'exact axis/transverse object shared across channels',
      'null model separating preloaded witness from cross-channel evidence',
      'rule for counting P-channel evidence without route/gate promotion',
      'rule for using G-channel only as readout boundary',
    ],
  };
}

function buildBlockedReasons(
  channelRows: readonly PSimplexT28C0ChannelProvenanceRow[],
  availabilityRows: readonly PSimplexT28C0AxisTransverseAvailabilityRow[],
  summaryVerdict: PSimplexT28C0SummaryVerdict,
): string[] {
  const reasons: string[] = [];
  const ineligibleRows = channelRows.filter((row) => row.eligibilityStatus.startsWith('ineligible'));

  if (ineligibleRows.length > 0) {
    reasons.push(`ineligible-channel-provenance:${ineligibleRows.map((row) => row.channelId).join(',')}`);
  }

  if (!availabilityRows.some((row) => row.channelId === 'V' && row.canSupportLaterSurvivalTest)) {
    reasons.push('V-channel lacks computed or closed-enum axis/transverse material');
  }

  if (!availabilityRows.some((row) => row.channelId === 'K' && row.canSupportLaterSurvivalTest)) {
    reasons.push('K-channel lacks computed or closed-enum axis/transverse material');
  }

  if (summaryVerdict === 'eligible-but-requires-researcher-survival-metric') {
    reasons.push('researcher-defined survival metric required before survival audit execution');
  }

  if (channelRows.some((row) => row.channelId === 'P' && row.eligibilityStatus === 'eligible-but-quarantined')) {
    reasons.push('P-channel field residue remains quarantined and cannot count as mature route/gate support');
  }

  if (channelRows.some((row) => row.channelId === 'G' && row.boundaryOnly)) {
    reasons.push('G-channel is boundary-only and cannot prove spatial propagation');
  }

  return unique(reasons);
}

function classifySummaryVerdict(args: {
  candidatePriorAccepted: boolean;
  channelProvenanceRows: readonly PSimplexT28C0ChannelProvenanceRow[];
  axisTransverseAvailabilityRows: readonly PSimplexT28C0AxisTransverseAvailabilityRow[];
  branchEvidenceGuard: PSimplexT28C0BranchEvidenceGuard;
  boundaryRows: readonly PSimplexT28C0BoundaryRow[];
  survivalMetricPlaceholderPresent: boolean;
}): PSimplexT28C0SummaryVerdict {
  if (args.candidatePriorAccepted) {
    return 'ineligible-missing-candidate-definition';
  }

  if (forbiddenPromotionPresent(null, args.channelProvenanceRows, args.boundaryRows)) {
    return 'ineligible-forbidden-promotion-detected';
  }

  if (args.branchEvidenceGuard.branchCollapseRisk === 'high') {
    return 'ineligible-branch-collapse-risk';
  }

  if (args.branchEvidenceGuard.staleFieldResidueDetected && !args.branchEvidenceGuard.fieldResidueQuarantined) {
    return 'ineligible-field-resurrection-risk';
  }

  if (
    !args.branchEvidenceGuard.allChannelsSameRepo ||
    !args.branchEvidenceGuard.allChannelsSameBranchRef ||
    args.channelProvenanceRows.some((row) =>
      [
        'ineligible-missing-repo-object',
        'ineligible-missing-builder',
        'ineligible-missing-package-script',
        'ineligible-foreign-or-stale-stream',
      ].includes(row.eligibilityStatus),
    )
  ) {
    return 'ineligible-missing-channel-provenance';
  }

  const vAvailability = requiredAvailability(args.axisTransverseAvailabilityRows, 'V');
  const kAvailability = requiredAvailability(args.axisTransverseAvailabilityRows, 'K');

  if (!vAvailability.canSupportLaterSurvivalTest && !kAvailability.canSupportLaterSurvivalTest) {
    return 'ineligible-missing-computed-axis-transverse-fields';
  }

  if (!args.survivalMetricPlaceholderPresent) {
    return 'eligible-but-requires-researcher-survival-metric';
  }

  if (args.branchEvidenceGuard.fieldResidueQuarantined) {
    return 'eligible-but-P-channel-quarantined';
  }

  if (args.channelProvenanceRows.some((row) => row.channelId === 'G' && row.boundaryOnly)) {
    return 'eligible-but-G-channel-boundary-only';
  }

  return 'eligible-for-cross-projection-audit';
}

function buildIntegrityIssues(args: {
  candidateRow: PSimplexT28C0CandidateRow;
  channelProvenanceRows: readonly PSimplexT28C0ChannelProvenanceRow[];
  axisTransverseAvailabilityRows: readonly PSimplexT28C0AxisTransverseAvailabilityRow[];
  branchEvidenceGuard: PSimplexT28C0BranchEvidenceGuard;
  boundaryRows: readonly PSimplexT28C0BoundaryRow[];
  falsifierRows: readonly PSimplexT28C0FalsifierRow[];
  eligibilitySummary: PSimplexT28C0EligibilitySummary;
  summaryVerdict: PSimplexT28C0SummaryVerdict;
}): string[] {
  const issues: string[] = [];

  if (!args.candidateRow || args.candidateRow.candidateId !== 'ATD-H0') {
    issues.push('Report omits required ATD-H0 candidate row.');
  }

  if (args.channelProvenanceRows.length !== CHANNEL_DEFINITIONS.length) {
    issues.push(`Expected ${CHANNEL_DEFINITIONS.length} channel provenance rows, got ${args.channelProvenanceRows.length}.`);
  }

  if (!CHANNEL_DEFINITIONS.every((definition) => args.channelProvenanceRows.some((row) => row.channelId === definition.channelId))) {
    issues.push('Report omits one or more required channel rows.');
  }

  if (args.axisTransverseAvailabilityRows.length !== CHANNEL_DEFINITIONS.length) {
    issues.push(
      `Expected ${CHANNEL_DEFINITIONS.length} axis/transverse availability rows, got ${args.axisTransverseAvailabilityRows.length}.`,
    );
  }

  if (args.boundaryRows.length !== 11 || args.boundaryRows.some((row) => !row.enforced)) {
    issues.push('Report omits one or more required enforced boundary rows.');
  }

  if (FORBIDDEN_VERDICTS.some((verdict) => verdict === (args.summaryVerdict as string))) {
    issues.push('Report uses a forbidden survival/feature verdict.');
  }

  if (!allowedSummaryVerdict(args.summaryVerdict)) {
    issues.push('Report uses a summaryVerdict outside the T28-C0 eligibility/preflight vocabulary.');
  }

  if (args.summaryVerdict.startsWith('ineligible-') && args.candidateRow.survivalAuditAllowed) {
    issues.push('Report says survivalAuditAllowed=true while summaryVerdict is ineligible.');
  }

  if (args.falsifierRows.some((row) => row.triggered) && !args.summaryVerdict.startsWith('ineligible-')) {
    issues.push('Triggered falsifier did not drive an ineligible summaryVerdict.');
  }

  const countedEligible = args.channelProvenanceRows.filter((row) => row.eligibilityStatus.startsWith('eligible')).length;
  const countedIneligible = args.channelProvenanceRows.filter((row) => row.eligibilityStatus.startsWith('ineligible')).length;

  if (
    args.eligibilitySummary.eligibleChannelCount !== countedEligible ||
    args.eligibilitySummary.ineligibleChannelCount !== countedIneligible
  ) {
    issues.push('Eligibility summary channel counts are inconsistent with channel rows.');
  }

  if (args.branchEvidenceGuard.allChannelsSameBranchRef && args.summaryVerdict === 'ineligible-branch-collapse-risk') {
    issues.push('Branch guard reports same branch while summaryVerdict reports branch collapse risk.');
  }

  return unique(issues);
}

function positiveEvidenceAllowedFor(
  channelId: PSimplexT28C0ChannelId,
  sourceText: string,
  missingRepoPaths: readonly string[],
  missingBuilderEvidenceGroups: readonly string[],
): boolean {
  if (missingRepoPaths.length > 0 || missingBuilderEvidenceGroups.length > 0) {
    return false;
  }

  if (channelId === 'V') {
    return sourceText.includes('PSimplexChildAxisPairRowV0') && sourceText.includes('axisResult');
  }

  if (channelId === 'K') {
    return ['K3-G', 'K3-E', 'K3-A-primary', 'K3-A-complement', 'K3-T'].every((token) => sourceText.includes(token));
  }

  return false;
}

function pChannelQuarantineBoundaryPasses(foundStatusVocabulary: readonly string[]): boolean {
  return [
    'candidate-only',
    'not-semantic-naming',
    'not-topology-workspace',
    'insufficient-for-confirmed-route',
    'insufficient-for-confirmed-gate',
  ].every((token) => foundStatusVocabulary.includes(token));
}

function pChannelComputedMaterialAvailable(sourceText: string): boolean {
  return ['psi', 'intensity', 'phase'].some((token) => sourceText.includes(token));
}

function forbiddenPromotionPresent(
  candidateRow: PSimplexT28C0CandidateRow | null,
  channelRows: readonly PSimplexT28C0ChannelProvenanceRow[],
  boundaryRows: readonly PSimplexT28C0BoundaryRow[],
): boolean {
  const candidatePromoted =
    candidateRow !== null &&
    (candidateRow.priorAcceptedObject ||
      candidateRow.candidateStatus !== 'newly-proposed-research-hypothesis' ||
      candidateRow.maturityStatus !== 'pre-feature-eligibility-only' ||
      !FORBIDDEN_MATURITY.every((status) => candidateRow.forbiddenMaturity.includes(status)));
  const channelPromoted = channelRows.some(
    (row) =>
      (row.channelId === 'P' && row.maturityStatus !== 'candidate-only' && row.maturityStatus !== 'not-found') ||
      (row.channelId === 'S' && (row.positiveEvidenceAllowed || !row.boundaryOnly)) ||
      (row.channelId === 'G' && (row.positiveEvidenceAllowed || !row.boundaryOnly)),
  );
  const boundariesMissing = buildBoundaryRows().some(
    (required) => !boundaryRows.some((row) => row.boundaryId === required.boundaryId && row.enforced),
  );

  return candidatePromoted || channelPromoted || boundariesMissing;
}

function survivalMetricPlaceholderPresent(probe: PSimplexT28C0RepoProbe): boolean {
  const allSourceText = sourceTextFor(Object.keys(probe.sourceFiles), probe);

  return ['ATD-H0-survival-metric-placeholder', 'axis-transverse-survival-metric', 'researcher-defined survival metric'].some(
    (token) => allSourceText.includes(token),
  );
}

function sourceTextFor(repoPaths: readonly string[], probe: PSimplexT28C0RepoProbe): string {
  return repoPaths.map((repoPath) => probe.sourceFiles[repoPath]?.text ?? '').join('\n');
}

function sourceExists(repoPath: string, probe: PSimplexT28C0RepoProbe): boolean {
  return probe.sourceFiles[repoPath]?.exists === true;
}

function sourceHasForeignOrStaleMarker(sourceText: string): boolean {
  return /foreign-branch|foreign branch|stale-branch|stale branch|team-arman|teamArman|\bW2\b/u.test(sourceText);
}

function sourceHasTeamArmanOrW2Marker(sourceText: string): boolean {
  return /team-arman|teamArman|\bW2\b/u.test(sourceText);
}

function availableTokens(sourceText: string, tokens: readonly string[]): string[] {
  return tokens.filter((token) => sourceText.includes(token));
}

function allowedSummaryVerdict(summaryVerdict: string): summaryVerdict is PSimplexT28C0SummaryVerdict {
  return [
    'eligible-for-cross-projection-audit',
    'eligible-but-P-channel-quarantined',
    'eligible-but-G-channel-boundary-only',
    'eligible-but-requires-researcher-survival-metric',
    'ineligible-missing-candidate-definition',
    'ineligible-missing-channel-provenance',
    'ineligible-missing-computed-axis-transverse-fields',
    'ineligible-branch-collapse-risk',
    'ineligible-field-resurrection-risk',
    'ineligible-forbidden-promotion-detected',
  ].includes(summaryVerdict);
}

function requiredChannel(
  rows: readonly PSimplexT28C0ChannelProvenanceRow[],
  channelId: PSimplexT28C0ChannelId,
): PSimplexT28C0ChannelProvenanceRow {
  const row = rows.find((entry) => entry.channelId === channelId);

  if (!row) {
    throw new Error(`Missing T28-C0 channel row ${channelId}`);
  }

  return row;
}

function requiredAvailability(
  rows: readonly PSimplexT28C0AxisTransverseAvailabilityRow[],
  channelId: PSimplexT28C0ChannelId,
): PSimplexT28C0AxisTransverseAvailabilityRow {
  const row = rows.find((entry) => entry.channelId === channelId);

  if (!row) {
    throw new Error(`Missing T28-C0 axis/transverse availability row ${channelId}`);
  }

  return row;
}

function falsifierRow(
  falsifierId: PSimplexT28C0FalsifierRow['falsifierId'],
  description: string,
  triggered: boolean,
  evidence: string,
): PSimplexT28C0FalsifierRow {
  return {
    falsifierId,
    description,
    triggered,
    evidence,
    status: triggered ? 'triggered' : 'clear',
  };
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}
