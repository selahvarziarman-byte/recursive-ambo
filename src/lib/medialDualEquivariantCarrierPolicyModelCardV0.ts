import {
  buildOctonionVsA3MedialCarrierDiscriminatorV0Report,
  type HypothesisVerdictRow as SourceHypothesisVerdictRow,
  type OctonionVsA3MedialCarrierDiscriminatorV0Report,
} from './octonionVsA3MedialCarrierDiscriminatorV0';

export type MedialDualPolicyCandidateStatus =
  | 'supported-local-hub-candidate'
  | 'blocked-by-source-diagnostic-failure';

export type MedialDualHypothesisRuling =
  | 'rejected'
  | 'live-local-hub-candidate'
  | 'unresolved';

export interface MedialDualCarrierPolicyEvidenceSnapshotV0 {
  flagCount: number;
  distinctFlagCount: number;
  signedLiftFlagCount: number;
  distinctSignedLiftCount: number;
  canonicalTriangleCount: number;
  canonicalTriangleOrderedProductCount: number;
  canonicalTriangleClosurePassCount: number;
  canonicalTriangleClosureFailCount: number;
  canonicalSquareCycleCount: number;
  canonicalSquareHolonomyVariantCount: number;
  squareHolonomyPassCount: number;
  squareHolonomyFailCount: number;
  fanoCompleteQuadrangleCount: number;
  quadrangleLabelingCount: number;
  gaugeTriangleClosureFailureCount: number;
  gaugeSquareHolonomyFailureCount: number;
  gaugeQuotientLossAnomalyCount: number;
  cuboctahedronBridgeStatus: string;
  cubeG1CuboctahedronBridgeStatus: string;
  tetraG2CoreCuboctahedronBridgeStatus: string;
  cubeG1MedialHubStatus: string;
  cubePrimalCarrierAssignmentStatus: string;
}

export interface MedialDualHypothesisRulingRowV0 {
  hypothesisId: 'H1' | 'H2' | 'H3';
  ruling: MedialDualHypothesisRuling;
  meaning: string;
  evidence: string;
  sourceVerdict: SourceHypothesisVerdictRow['verdict'] | 'missing';
  sourceReason: string;
}

export interface MedialDualCarrierComponentRowV0 {
  componentId:
    | 'a3-s4-medial-flag-incidence-base'
    | 'fano-octonionic-local-multiplicative-fiber'
    | 'provenance-genealogy-state';
  role: string;
  evidenceFromDiscriminator: string;
  limitation: string;
}

export interface MedialDualAuthorizedClaimRowV0 {
  claimId: string;
  claim: string;
}

export interface MedialDualForbiddenPromotionRowV0 {
  promotionId: string;
  warning: string;
}

export interface MedialDualNextProofObligationRowV0 {
  phase: 'Phase 3' | 'Phase 4';
  obligationId: string;
  obligation: string;
}

export interface MedialDualEquivariantCarrierPolicyModelCardV0Issue {
  code: string;
  message: string;
}

export interface MedialDualEquivariantCarrierPolicyModelCardV0Report {
  method: 'medial-dual-equivariant-carrier-policy-model-card-v0';
  modelCardScope: 'local-tetra-octa-cube-medial-hub-policy-only';
  sourceDiagnosticMethod: 'octonion-vs-a3-medial-carrier-discriminator-v0';
  sourceDiagnosticOk: boolean;
  policyCandidateStatus: MedialDualPolicyCandidateStatus;
  ratificationStatus: 'local-hub-policy-candidate-not-universal-law';
  generalFieldLawStatus: 'not-proven';
  universalOctonionStatus: 'not-proven';
  cubePrimalSourcehoodStatus: 'not-proven';
  fieldCueUnblockStatus: 'not-authorized';
  s0Status: 'not-authorized';
  uiStatus: 'no-ui';
  shapeMutationStatus: 'no-shape-mutation';
  packetWriteStatus: 'no-packet-write';
  carrierPolicyId: 'medial-dual-equivariant-carrier-policy-v0';
  evidenceSnapshot: MedialDualCarrierPolicyEvidenceSnapshotV0;
  hypothesisRulings: MedialDualHypothesisRulingRowV0[];
  carrierComponents: MedialDualCarrierComponentRowV0[];
  authorizedClaims: MedialDualAuthorizedClaimRowV0[];
  forbiddenPromotions: MedialDualForbiddenPromotionRowV0[];
  nextProofObligations: MedialDualNextProofObligationRowV0[];
  sourceDiagnosticIssueCount: number;
  issues: MedialDualEquivariantCarrierPolicyModelCardV0Issue[];
  ok: boolean;
}

const REQUIRED_COMPONENT_IDS = [
  'a3-s4-medial-flag-incidence-base',
  'fano-octonionic-local-multiplicative-fiber',
  'provenance-genealogy-state',
] as const;

const NUMERIC_EVIDENCE_KEYS = [
  'flagCount',
  'distinctFlagCount',
  'signedLiftFlagCount',
  'distinctSignedLiftCount',
  'canonicalTriangleCount',
  'canonicalTriangleOrderedProductCount',
  'canonicalTriangleClosurePassCount',
  'canonicalTriangleClosureFailCount',
  'canonicalSquareCycleCount',
  'canonicalSquareHolonomyVariantCount',
  'squareHolonomyPassCount',
  'squareHolonomyFailCount',
  'fanoCompleteQuadrangleCount',
  'quadrangleLabelingCount',
  'gaugeTriangleClosureFailureCount',
  'gaugeSquareHolonomyFailureCount',
  'gaugeQuotientLossAnomalyCount',
] as const satisfies readonly (keyof MedialDualCarrierPolicyEvidenceSnapshotV0)[];

export function buildMedialDualEquivariantCarrierPolicyModelCardV0Report(): MedialDualEquivariantCarrierPolicyModelCardV0Report {
  const sourceReport = buildOctonionVsA3MedialCarrierDiscriminatorV0Report();
  const evidenceSnapshot = buildEvidenceSnapshot(sourceReport);
  const hypothesisRulings = buildHypothesisRulings(sourceReport);
  const policyCandidateStatus = selectPolicyCandidateStatus({
    sourceDiagnosticOk: sourceReport.ok,
    hypothesisRulings,
  });
  const carrierComponents = buildCarrierComponents(evidenceSnapshot);
  const authorizedClaims = buildAuthorizedClaims();
  const forbiddenPromotions = buildForbiddenPromotions();
  const nextProofObligations = buildNextProofObligations();
  const reportWithoutIssues = {
    method: 'medial-dual-equivariant-carrier-policy-model-card-v0' as const,
    modelCardScope: 'local-tetra-octa-cube-medial-hub-policy-only' as const,
    sourceDiagnosticMethod: sourceReport.method,
    sourceDiagnosticOk: sourceReport.ok,
    policyCandidateStatus,
    ratificationStatus: 'local-hub-policy-candidate-not-universal-law' as const,
    generalFieldLawStatus: 'not-proven' as const,
    universalOctonionStatus: 'not-proven' as const,
    cubePrimalSourcehoodStatus: 'not-proven' as const,
    fieldCueUnblockStatus: 'not-authorized' as const,
    s0Status: 'not-authorized' as const,
    uiStatus: 'no-ui' as const,
    shapeMutationStatus: 'no-shape-mutation' as const,
    packetWriteStatus: 'no-packet-write' as const,
    carrierPolicyId: 'medial-dual-equivariant-carrier-policy-v0' as const,
    evidenceSnapshot,
    hypothesisRulings,
    carrierComponents,
    authorizedClaims,
    forbiddenPromotions,
    nextProofObligations,
    sourceDiagnosticIssueCount: sourceReport.issues.length,
  };
  const issues = buildIssues(reportWithoutIssues);

  return {
    ...reportWithoutIssues,
    issues,
    ok: issues.length === 0,
  };
}

function buildEvidenceSnapshot(
  sourceReport: OctonionVsA3MedialCarrierDiscriminatorV0Report,
): MedialDualCarrierPolicyEvidenceSnapshotV0 {
  const { summary } = sourceReport;

  return {
    flagCount: summary.flagCount,
    distinctFlagCount: summary.distinctFlagCount,
    signedLiftFlagCount: summary.signedLiftFlagCount,
    distinctSignedLiftCount: summary.distinctSignedLiftCount,
    canonicalTriangleCount: summary.canonicalTriangleCount,
    canonicalTriangleOrderedProductCount:
      summary.canonicalTriangleOrderedProductCount,
    canonicalTriangleClosurePassCount:
      summary.canonicalTriangleClosurePassCount,
    canonicalTriangleClosureFailCount:
      summary.canonicalTriangleClosureFailCount,
    canonicalSquareCycleCount: summary.canonicalSquareCycleCount,
    canonicalSquareHolonomyVariantCount:
      summary.canonicalSquareHolonomyVariantCount,
    squareHolonomyPassCount: summary.squareHolonomyPassCount,
    squareHolonomyFailCount: summary.squareHolonomyFailCount,
    fanoCompleteQuadrangleCount: summary.fanoCompleteQuadrangleCount,
    quadrangleLabelingCount: summary.quadrangleLabelingCount,
    gaugeTriangleClosureFailureCount:
      summary.gaugeTriangleClosureFailureCount,
    gaugeSquareHolonomyFailureCount:
      summary.gaugeSquareHolonomyFailureCount,
    gaugeQuotientLossAnomalyCount:
      summary.gaugeQuotientLossAnomalyCount,
    cuboctahedronBridgeStatus: summary.cuboctahedronBridgeStatus,
    cubeG1CuboctahedronBridgeStatus:
      summary.cubeG1CuboctahedronBridgeStatus,
    tetraG2CoreCuboctahedronBridgeStatus:
      summary.tetraG2CoreCuboctahedronBridgeStatus,
    cubeG1MedialHubStatus: summary.cubeG1MedialHubStatus,
    cubePrimalCarrierAssignmentStatus:
      summary.cubePrimalCarrierAssignmentStatus,
  };
}

function buildHypothesisRulings(
  sourceReport: OctonionVsA3MedialCarrierDiscriminatorV0Report,
): MedialDualHypothesisRulingRowV0[] {
  const h1 = getSourceVerdict(sourceReport, 'H1');
  const h2 = getSourceVerdict(sourceReport, 'H2');
  const h3 = getSourceVerdict(sourceReport, 'H3');
  const h3IsLive = sourceReport.ok && h3?.verdict === 'live';

  return [
    {
      hypothesisId: 'H1',
      ruling: h1?.verdict === 'rejected' ? 'rejected' : 'unresolved',
      meaning: 'bare signed octonion unit is too coarse',
      evidence:
        '12 medial flags collapse to 6 signed lifts',
      sourceVerdict: h1?.verdict ?? 'missing',
      sourceReason: h1?.reason ?? 'missing-source-verdict',
    },
    {
      hypothesisId: 'H2',
      ruling: h2?.verdict === 'rejected' ? 'rejected' : 'unresolved',
      meaning: 'A3 incidence alone is too weak',
      evidence:
        'A3 recovers flags but does not supply Fano multiplication closure or square holonomy',
      sourceVerdict: h2?.verdict ?? 'missing',
      sourceReason: h2?.reason ?? 'missing-source-verdict',
    },
    {
      hypothesisId: 'H3',
      ruling: h3IsLive ? 'live-local-hub-candidate' : 'unresolved',
      meaning:
        'A3/S4 medial-flag base + Fano local multiplicative fiber + provenance survives current discriminator',
      evidence: h3IsLive
        ? 'discriminator ok + closure/holonomy/gauge/bridge checks pass'
        : 'source diagnostic did not authorize a live local-hub ruling',
      sourceVerdict: h3?.verdict ?? 'missing',
      sourceReason: h3?.reason ?? 'missing-source-verdict',
    },
  ];
}

function selectPolicyCandidateStatus(args: {
  sourceDiagnosticOk: boolean;
  hypothesisRulings: MedialDualHypothesisRulingRowV0[];
}): MedialDualPolicyCandidateStatus {
  return args.sourceDiagnosticOk &&
    getRuling(args.hypothesisRulings, 'H1')?.ruling === 'rejected' &&
    getRuling(args.hypothesisRulings, 'H2')?.ruling === 'rejected' &&
    getRuling(args.hypothesisRulings, 'H3')?.ruling ===
      'live-local-hub-candidate'
    ? 'supported-local-hub-candidate'
    : 'blocked-by-source-diagnostic-failure';
}

function buildCarrierComponents(
  evidence: MedialDualCarrierPolicyEvidenceSnapshotV0,
): MedialDualCarrierComponentRowV0[] {
  return [
    {
      componentId: 'a3-s4-medial-flag-incidence-base',
      role: 'recovers 12 ordered medial flags',
      evidenceFromDiscriminator: `${evidence.flagCount} flags / ${evidence.distinctFlagCount} distinct flags`,
      limitation: 'non-discriminating by itself',
    },
    {
      componentId: 'fano-octonionic-local-multiplicative-fiber',
      role: 'supplies triangle multiplication closure and square holonomy',
      evidenceFromDiscriminator:
        `${evidence.canonicalTriangleClosurePassCount} triangle products pass, ${evidence.squareHolonomyPassCount} square holonomy variants pass, ${evidence.quadrangleLabelingCount} Fano quadrangle labelings checked`,
      limitation: 'tested only over Fano complete quadrangle labelings',
    },
    {
      componentId: 'provenance-genealogy-state',
      role:
        'prevents cube/octa/tetra-core medial hub from collapsing into false identity',
      evidenceFromDiscriminator:
        `${evidence.tetraG2CoreCuboctahedronBridgeStatus}; ${evidence.cuboctahedronBridgeStatus}; ${evidence.cubeG1CuboctahedronBridgeStatus}; ${evidence.cubeG1MedialHubStatus}`,
      limitation: 'does not solve cube primal carrier assignment',
    },
  ];
}

function buildAuthorizedClaims(): MedialDualAuthorizedClaimRowV0[] {
  return [
    {
      claimId: 'survives-current-medial-hub-discriminator',
      claim:
        'The Medial-Dual candidate survives the current tetra-octa-cube medial-hub discriminator.',
    },
    {
      claimId: 'bare-signed-octonion-insufficient',
      claim: 'Bare signed octonion carrier is insufficient.',
    },
    {
      claimId: 'a3-s4-incidence-alone-insufficient',
      claim: 'A3/S4 incidence alone is insufficient.',
    },
    {
      claimId: 'three-component-carrier-required',
      claim:
        'The current live carrier object must include incidence, Fano local multiplication, and provenance.',
    },
    {
      claimId: 'repo-bridge-verifies-cuboctahedral-hub-access',
      claim:
        'The repo bridge verifies tetra G2-core, octa G1, and cube G1 cuboctahedral hub access.',
    },
    {
      claimId: 'supports-local-hub-policy-candidate',
      claim: 'This supports a local hub policy candidate.',
    },
  ];
}

function buildForbiddenPromotions(): MedialDualForbiddenPromotionRowV0[] {
  return [
    {
      promotionId: 'no-universal-all-shape-carrier-law',
      warning: 'do not claim universal all-shape carrier law',
    },
    {
      promotionId: 'no-universal-octonion-field-law',
      warning: 'do not claim universal octonion field law',
    },
    {
      promotionId: 'no-independent-cube-primal-sourcehood',
      warning: 'do not claim independent cube primal sourcehood',
    },
    {
      promotionId: 'no-s0',
      warning: 'do not proceed to S0 from this alone',
    },
    {
      promotionId: 'no-fieldcue-v0',
      warning: 'do not unblock FieldCueV0 from this alone',
    },
    {
      promotionId: 'no-ui',
      warning: 'do not build UI',
    },
    {
      promotionId: 'no-general-algebra-infrastructure',
      warning: 'do not introduce general algebra infrastructure',
    },
    {
      promotionId: 'no-full-field-generalization-from-finite-success',
      warning:
        'do not treat finite discriminator success as full field generalization',
    },
    {
      promotionId: 'no-prose-replacement-for-portability-tests',
      warning: 'do not replace future portability tests with prose',
    },
  ];
}

function buildNextProofObligations(): MedialDualNextProofObligationRowV0[] {
  return [
    {
      phase: 'Phase 3',
      obligationId: 'structured-source-state-survival-audit',
      obligation: 'structured source-state survival audit',
    },
    {
      phase: 'Phase 3',
      obligationId: 'carrier-policy-survival-into-source-state',
      obligation:
        'determine what carrier-policy structure survives into source state',
    },
    {
      phase: 'Phase 3',
      obligationId: 'tuple-reduction-classification',
      obligation:
        'determine what becomes field-active, metadata-only, provenance-only, or lost in tuple reduction',
    },
    {
      phase: 'Phase 4',
      obligationId: 'field-generalization-portability-model',
      obligation: 'field generalization / portability model',
    },
    {
      phase: 'Phase 4',
      obligationId: 'field-object-portability-classification',
      obligation:
        'classify field objects as shape-polymorphic, carrier-policy-dependent, spatial-support-policy-dependent, tetra/Fano-specific, diagnostic-only, blocked, or unsafe-to-universalize',
    },
  ];
}

function buildIssues(
  report: Omit<MedialDualEquivariantCarrierPolicyModelCardV0Report, 'issues' | 'ok'>,
): MedialDualEquivariantCarrierPolicyModelCardV0Issue[] {
  const issues: MedialDualEquivariantCarrierPolicyModelCardV0Issue[] = [];
  const h1 = getRuling(report.hypothesisRulings, 'H1');
  const h2 = getRuling(report.hypothesisRulings, 'H2');
  const h3 = getRuling(report.hypothesisRulings, 'H3');

  if (!report.sourceDiagnosticOk) {
    issues.push(issue('source-diagnostic-not-ok', 'Source discriminator report is not ok.'));
  }

  if (h3?.sourceVerdict !== 'live') {
    issues.push(issue('source-h3-not-live', 'Source discriminator H3 verdict is not live.'));
  }

  if (h1?.sourceVerdict !== 'rejected') {
    issues.push(issue('source-h1-not-rejected', 'Source discriminator H1 verdict is not rejected.'));
  }

  if (h2?.sourceVerdict !== 'rejected') {
    issues.push(issue('source-h2-not-rejected', 'Source discriminator H2 verdict is not rejected.'));
  }

  if (
    report.policyCandidateStatus === 'supported-local-hub-candidate' &&
    !report.sourceDiagnosticOk
  ) {
    issues.push(
      issue(
        'policy-supported-while-source-failed',
        'Policy candidate cannot be supported while source diagnostic failed.',
      ),
    );
  }

  if (
    report.generalFieldLawStatus !== 'not-proven' ||
    report.universalOctonionStatus !== 'not-proven' ||
    report.cubePrimalSourcehoodStatus !== 'not-proven' ||
    report.ratificationStatus !== 'local-hub-policy-candidate-not-universal-law'
  ) {
    issues.push(
      issue(
        'universal-status-implied',
        'Model card statuses must not imply universal field law.',
      ),
    );
  }

  if (
    report.fieldCueUnblockStatus !== 'not-authorized' ||
    report.s0Status !== 'not-authorized' ||
    report.uiStatus !== 'no-ui'
  ) {
    issues.push(
      issue(
        'downstream-authorization-implied',
        'Model card must not authorize FieldCueV0, S0, or UI.',
      ),
    );
  }

  if (
    report.evidenceSnapshot.cubePrimalCarrierAssignmentStatus !==
    'not-solved-independent-cube-primal-sourcehood'
  ) {
    issues.push(
      issue(
        'cube-primal-sourcehood-claimed',
        'Cube primal carrier assignment must remain unsolved.',
      ),
    );
  }

  if (
    report.evidenceSnapshot.cubeG1MedialHubStatus !==
    'cube-g1-as-cuboctahedral-medial-object-via-dual-provenance-only'
  ) {
    issues.push(
      issue(
        'cube-medial-provenance-wording-lost',
        'Cube G1 medial hub status must preserve dual-provenance-only wording.',
      ),
    );
  }

  for (const key of NUMERIC_EVIDENCE_KEYS) {
    const value = report.evidenceSnapshot[key];

    if (typeof value !== 'number' || !Number.isFinite(value)) {
      issues.push(
        issue('evidence-snapshot-numeric-field-invalid', `${key} is not finite.`),
      );
    }
  }

  for (const key of [
    'cuboctahedronBridgeStatus',
    'cubeG1CuboctahedronBridgeStatus',
    'tetraG2CoreCuboctahedronBridgeStatus',
    'cubeG1MedialHubStatus',
    'cubePrimalCarrierAssignmentStatus',
  ] as const) {
    if (!report.evidenceSnapshot[key]) {
      issues.push(issue('evidence-snapshot-field-missing', `${key} is missing.`));
    }
  }

  const componentIds = new Set(
    report.carrierComponents.map((component) => component.componentId),
  );

  for (const componentId of REQUIRED_COMPONENT_IDS) {
    if (!componentIds.has(componentId)) {
      issues.push(issue('carrier-component-missing', `${componentId} missing.`));
    }
  }

  for (const claim of report.authorizedClaims) {
    if (/\buniversal\b|\bgeneral(?:ized|ization|ize)?\b/i.test(claim.claim)) {
      issues.push(
        issue(
          'authorized-claim-too-broad',
          `${claim.claimId} includes language beyond the tested local hub scope.`,
        ),
      );
    }
  }

  const forbiddenPromotionText = report.forbiddenPromotions
    .map((promotion) => promotion.warning.toLowerCase())
    .join('\n');
  const requiredForbiddenFragments = [
    'universal',
    'cube primal sourcehood',
    's0',
    'fieldcue',
    'ui',
  ];

  for (const fragment of requiredForbiddenFragments) {
    if (!forbiddenPromotionText.includes(fragment)) {
      issues.push(
        issue(
          'forbidden-promotion-required-fragment-missing',
          `${fragment} warning missing.`,
        ),
      );
    }
  }

  return issues;
}

function getSourceVerdict(
  sourceReport: OctonionVsA3MedialCarrierDiscriminatorV0Report,
  hypothesisId: MedialDualHypothesisRulingRowV0['hypothesisId'],
): SourceHypothesisVerdictRow | undefined {
  return sourceReport.hypothesisVerdicts.find(
    (row) => row.hypothesisId === hypothesisId,
  );
}

function getRuling(
  rulings: MedialDualHypothesisRulingRowV0[],
  hypothesisId: MedialDualHypothesisRulingRowV0['hypothesisId'],
): MedialDualHypothesisRulingRowV0 | undefined {
  return rulings.find((row) => row.hypothesisId === hypothesisId);
}

function issue(
  code: string,
  message: string,
): MedialDualEquivariantCarrierPolicyModelCardV0Issue {
  return { code, message };
}
