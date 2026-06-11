import {
  buildMedialDualEquivariantCarrierPolicyModelCardV0Report,
  type MedialDualEquivariantCarrierPolicyModelCardV0Report,
} from './medialDualEquivariantCarrierPolicyModelCardV0';
import {
  buildOctonionVsA3MedialCarrierDiscriminatorV0Report,
  type OctonionVsA3MedialCarrierDiscriminatorV0Report,
} from './octonionVsA3MedialCarrierDiscriminatorV0';

export type HubLayerPrimalLabel = 'A' | 'B' | 'C' | 'D';
export type HubLayerFanoUnit = 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7';
export type HubLayerSignedBasisUnit = '1' | HubLayerFanoUnit;
export type HubLayerSign = '+' | '-';
export type HubLayerFlagId = `${HubLayerPrimalLabel}->${HubLayerPrimalLabel}`;

export interface HubLayerSignedBasis {
  sign: HubLayerSign;
  unit: HubLayerSignedBasisUnit;
}

// Gate C.5 visibility vocabulary, carried as local literals (vocabulary reuse,
// not a module dependency on the tetra-G1 capsule).
export type HubLayerGateC5VisibilityStatus =
  | 'raw-field-visible'
  | 'propagation-transformed'
  | 'depropagation-recoverable'
  | 'structural-channel-visible'
  | 'source-state-only'
  | 'tuple-projection-lost'
  | 'misleading-if-read-as-raw-field'
  | 'unsupported';

export type HubLayerTransportedSignIdentityStatus =
  | 'transported-and-identity-verified'
  | 'transport-mismatch';

export type HubLayerAgreementStatus =
  | 'agrees-with-upstream'
  | 'disagrees-with-upstream';

export interface HubLayerFlagStateV0 {
  flagStateId: string;
  flagId: HubLayerFlagId;
  sharedPrimalVertex: HubLayerPrimalLabel;
  omittedPrimalVertex: HubLayerPrimalLabel;
  rootCoordinate: Record<HubLayerPrimalLabel, -1 | 0 | 1>;
  recomputedSignedLift: HubLayerSignedBasis;
  recomputedSignedLiftLabel: string;
  upstreamSignedLift: string;
  transportedSignIdentityStatus: HubLayerTransportedSignIdentityStatus;
  carrierRay: string;
  reverseFlagId: HubLayerFlagId;
  antipodalAxisId: string;
  orderedIdentityStatus: 'distinct-ordered-flag-state';
  gateC5VisibilityStatus: HubLayerGateC5VisibilityStatus;
  tupleReductionStatus: HubLayerGateC5VisibilityStatus;
}

export interface HubLayerAntipodalFlagAxisV0 {
  axisId: string;
  flagIds: [HubLayerFlagId, HubLayerFlagId];
  carrierRay: string;
  signedLiftPair: [string, string];
  recomputedOppositionStatus: 'same-ray-opposite-sign' | 'flattened-or-mismatched';
  rootNegationStatus: 'root-negation-verified' | 'root-negation-failed';
  upstreamAgreementStatus: HubLayerAgreementStatus;
  gateC5VisibilityStatus: HubLayerGateC5VisibilityStatus;
  tupleReductionStatus: HubLayerGateC5VisibilityStatus;
}

export interface HubLayerRayGroupV0 {
  carrierRay: string;
  axisIds: string[];
  flagIds: HubLayerFlagId[];
  signedLifts: string[];
}

export interface HubLayerTriangleOrderedProductRowV0 {
  orderedProductId: string;
  leftFlagId: HubLayerFlagId;
  rightFlagId: HubLayerFlagId;
  targetFlagId: HubLayerFlagId;
  recomputedProduct: string;
  upstreamProduct: string;
  productAgreementStatus: HubLayerAgreementStatus;
  recomputedClosureStatus: 'pass' | 'fail';
  upstreamClosureStatus: 'pass' | 'fail';
  closureAgreementStatus: HubLayerAgreementStatus;
}

export interface HubLayerTriangleClosureRelationV0 {
  relationId: string;
  flagIds: HubLayerFlagId[];
  orderedProductRows: HubLayerTriangleOrderedProductRowV0[];
  rowCount: number;
  agreementCount: number;
  recomputedClosurePassCount: number;
  relationAgreementStatus: HubLayerAgreementStatus;
  gateC5VisibilityStatus: HubLayerGateC5VisibilityStatus;
  tupleReductionStatus: HubLayerGateC5VisibilityStatus;
}

export interface HubLayerSquareHolonomyVariantRowV0 {
  squareHolonomyVariantId: string;
  orientationVariant: string;
  flagCycle: HubLayerFlagId[];
  recomputedLeftAssociatedProduct: string;
  upstreamLeftAssociatedProduct: string;
  productAgreementStatus: HubLayerAgreementStatus;
  recomputedHolonomyStatus: 'pass' | 'fail';
  upstreamHolonomyStatus: 'pass' | 'fail';
  holonomyAgreementStatus: HubLayerAgreementStatus;
}

export interface HubLayerSquareHolonomyRelationV0 {
  relationId: string;
  canonicalFlagCycle: HubLayerFlagId[];
  variantRows: HubLayerSquareHolonomyVariantRowV0[];
  rowCount: number;
  agreementCount: number;
  recomputedHolonomyPassCount: number;
  relationAgreementStatus: HubLayerAgreementStatus;
  gateC5VisibilityStatus: HubLayerGateC5VisibilityStatus;
  tupleReductionStatus: HubLayerGateC5VisibilityStatus;
}

export interface HubLayerGaugeRobustnessMetaV0 {
  quadrangleCount: number;
  labelingCount: number;
  flagRecoveryFailureCount: number;
  triangleClosureFailureCount: number;
  squareHolonomyFailureCount: number;
  quotientLossAnomalyCount: number;
  upstreamGaugeRobustnessStatus: string;
  invarianceKind: 'fano-complete-quadrangle-carrier-gauge';
  invarianceDistinction: 'distinct-from-s4-vertex-relabeling';
  recomputationStatus: 'declared-meta-property-not-recomputed';
  gateC5VisibilityStatus: HubLayerGateC5VisibilityStatus;
  tupleReductionStatus: HubLayerGateC5VisibilityStatus;
}

export interface HubLayerProvenanceRouteV0 {
  routeId: string;
  routeKind: 'tetra-g2-core' | 'octa-g1' | 'cube-g1';
  upstreamBridgeStatus: string;
  coreTopologies: Array<string | null>;
  medialHubStatus: string | null;
  gateC5VisibilityStatus: HubLayerGateC5VisibilityStatus;
  tupleReductionStatus: HubLayerGateC5VisibilityStatus;
}

export interface HubLayerOpenBoundaryV0 {
  boundaryId: 'cube-primal-sourcehood';
  upstreamStatus: string;
  boundaryStatus: 'declared-open-boundary-not-absorbed';
  corroboration: string[];
}

export interface HubLayerTupleReductionDeclarationV0 {
  sourceSignatureStatus: string;
  emittedTupleStatus: string;
  reductionLawContext: string;
  lostUnderScalarTupleReduction: string[];
  quotientEvidence: string;
}

export interface HubLayerRecomputationSummaryV0 {
  flagStateCount: number;
  liftIdentityVerifiedCount: number;
  distinctRecomputedSignedLiftCount: number;
  antipodalAxisCount: number;
  antipodalAxisVerifiedCount: number;
  triangleProductRowCount: number;
  triangleProductAgreementCount: number;
  squareVariantRowCount: number;
  squareVariantAgreementCount: number;
}

export interface HubLayerSourceStateCapsuleV0Issue {
  code: string;
  message: string;
}

export interface HubLayerSourceStateCapsuleV0Report {
  method: 'hub-layer-source-state-capsule-v0';
  capsuleScope: 'hub-layer-cuboctahedral-12-flag-source-state-capsule-only';
  generalityStatus: 'local-hub-capsule-not-a-general-field-schema';
  fieldActiveStatus: 'nothing-field-active';
  tetraG1RegimeStatus: 'tetra-g1-structured-source-state-regime-not-amended';
  fieldCueUnblockStatus: 'not-authorized';
  s0Status: 'not-authorized';
  uiStatus: 'no-ui';
  shapeMutationStatus: 'no-shape-mutation';
  packetWriteStatus: 'no-packet-write';
  operationRegistryStatus: 'not-operation-registry-work';
  topologyStatus: 'not-topology-workspace';
  consumedReports: {
    discriminator: { method: string; ok: boolean; issueCount: number };
    modelCard: { method: string; ok: boolean; issueCount: number };
  };
  primalCarrierAssignment: Record<HubLayerPrimalLabel, HubLayerFanoUnit>;
  flagStates: HubLayerFlagStateV0[];
  antipodalAxes: HubLayerAntipodalFlagAxisV0[];
  rayGroups: HubLayerRayGroupV0[];
  triangleClosureRelations: HubLayerTriangleClosureRelationV0[];
  squareHolonomyRelations: HubLayerSquareHolonomyRelationV0[];
  gaugeRobustnessMeta: HubLayerGaugeRobustnessMetaV0;
  provenanceRoutes: HubLayerProvenanceRouteV0[];
  openBoundaries: HubLayerOpenBoundaryV0[];
  tupleReductionDeclaration: HubLayerTupleReductionDeclarationV0;
  recomputationSummary: HubLayerRecomputationSummaryV0;
  integrityIssueCount: number;
  integrityIssues: HubLayerSourceStateCapsuleV0Issue[];
  ok: boolean;
}

type DiscReport = OctonionVsA3MedialCarrierDiscriminatorV0Report;
type CardReport = MedialDualEquivariantCarrierPolicyModelCardV0Report;
type DiscFlagRow = DiscReport['flagRows'][number];
type DiscSignedLiftRow = DiscReport['signedLiftRows'][number];
type DiscTriangleRow = DiscReport['triangleClosureRows'][number];
type DiscSquareRow = DiscReport['squareHolonomyRows'][number];

const METHOD = 'hub-layer-source-state-capsule-v0' as const;
const CAPSULE_SCOPE =
  'hub-layer-cuboctahedral-12-flag-source-state-capsule-only' as const;
const SOURCE_STATE_ONLY: HubLayerGateC5VisibilityStatus = 'source-state-only';
const TUPLE_PROJECTION_LOST: HubLayerGateC5VisibilityStatus = 'tuple-projection-lost';
const EXPECTED_CUBE_MEDIAL_HUB_STATUS =
  'cube-g1-as-cuboctahedral-medial-object-via-dual-provenance-only';
const EXPECTED_CUBE_PRIMAL_BOUNDARY_STATUS =
  'not-solved-independent-cube-primal-sourcehood';

const GATE_C5_VOCABULARY: readonly HubLayerGateC5VisibilityStatus[] = [
  'raw-field-visible',
  'propagation-transformed',
  'depropagation-recoverable',
  'structural-channel-visible',
  'source-state-only',
  'tuple-projection-lost',
  'misleading-if-read-as-raw-field',
  'unsupported',
];

const PRIMAL_LABELS: readonly HubLayerPrimalLabel[] = ['A', 'B', 'C', 'D'];

// Capsule-local finite Fano signed-basis product: the 7 oriented triples plus
// sign parity on basis symbols only. Hub-scoped; not general algebra
// infrastructure. Convention agreement with the upstream discriminator is not
// assumed - it is verified by the 12 lift identity checks and the 48+48
// triangle/holonomy cross-checks; any drift fails the diagnostic.
const HUB_ORIENTED_FANO_TRIPLES: readonly [number, number, number][] = [
  [1, 2, 3],
  [1, 4, 5],
  [1, 7, 6],
  [2, 4, 6],
  [2, 5, 7],
  [3, 4, 7],
  [3, 6, 5],
];

export function buildHubLayerSourceStateCapsuleV0Report(): HubLayerSourceStateCapsuleV0Report {
  const disc = buildOctonionVsA3MedialCarrierDiscriminatorV0Report();
  const card = buildMedialDualEquivariantCarrierPolicyModelCardV0Report();
  const integrityIssues: HubLayerSourceStateCapsuleV0Issue[] = [];
  const primalCarrierAssignment = copyPrimalAssignment(disc, integrityIssues);
  const flagStates = buildFlagStates(disc, primalCarrierAssignment, integrityIssues);
  const liftByFlagId = new Map(
    flagStates.map((state) => [state.flagId as string, state.recomputedSignedLift]),
  );
  const antipodalAxes = buildAntipodalAxes(flagStates, disc, integrityIssues);
  const rayGroups = buildRayGroups(flagStates, antipodalAxes, integrityIssues);
  const triangleClosureRelations = buildTriangleClosureRelations(
    disc.triangleClosureRows,
    liftByFlagId,
    integrityIssues,
  );
  const squareHolonomyRelations = buildSquareHolonomyRelations(
    disc.squareHolonomyRows,
    liftByFlagId,
    integrityIssues,
  );
  const gaugeRobustnessMeta = buildGaugeRobustnessMeta(disc, integrityIssues);
  const provenanceRoutes = buildProvenanceRoutes(disc, integrityIssues);
  const openBoundaries = buildOpenBoundaries(disc, card, integrityIssues);
  const recomputationSummary = buildRecomputationSummary({
    flagStates,
    antipodalAxes,
    triangleClosureRelations,
    squareHolonomyRelations,
  });
  const tupleReductionDeclaration = buildTupleReductionDeclaration(
    disc,
    card,
    recomputationSummary,
  );

  integrityIssues.push(
    ...buildCapsuleIntegrityIssues({
      disc,
      card,
      flagStates,
      antipodalAxes,
      rayGroups,
      triangleClosureRelations,
      squareHolonomyRelations,
      gaugeRobustnessMeta,
      provenanceRoutes,
      openBoundaries,
      tupleReductionDeclaration,
      recomputationSummary,
    }),
  );

  const dedupedIssues = dedupeIssues(integrityIssues);

  return {
    method: METHOD,
    capsuleScope: CAPSULE_SCOPE,
    generalityStatus: 'local-hub-capsule-not-a-general-field-schema',
    fieldActiveStatus: 'nothing-field-active',
    tetraG1RegimeStatus: 'tetra-g1-structured-source-state-regime-not-amended',
    fieldCueUnblockStatus: 'not-authorized',
    s0Status: 'not-authorized',
    uiStatus: 'no-ui',
    shapeMutationStatus: 'no-shape-mutation',
    packetWriteStatus: 'no-packet-write',
    operationRegistryStatus: 'not-operation-registry-work',
    topologyStatus: 'not-topology-workspace',
    consumedReports: {
      discriminator: { method: disc.method, ok: disc.ok, issueCount: disc.issues.length },
      modelCard: { method: card.method, ok: card.ok, issueCount: card.issues.length },
    },
    primalCarrierAssignment,
    flagStates,
    antipodalAxes,
    rayGroups,
    triangleClosureRelations,
    squareHolonomyRelations,
    gaugeRobustnessMeta,
    provenanceRoutes,
    openBoundaries,
    tupleReductionDeclaration,
    recomputationSummary,
    integrityIssueCount: dedupedIssues.length,
    integrityIssues: dedupedIssues,
    ok: dedupedIssues.length === 0,
  };
}

function copyPrimalAssignment(
  disc: DiscReport,
  issues: HubLayerSourceStateCapsuleV0Issue[],
): Record<HubLayerPrimalLabel, HubLayerFanoUnit> {
  const assignment = disc.primalCarrierAssignment;
  const units = PRIMAL_LABELS.map((label) => assignment?.[label]);

  if (units.some((unit) => unit === undefined)) {
    issues.push({
      code: 'primal-carrier-assignment-incomplete',
      message:
        'Upstream primalCarrierAssignment is missing one or more of A-D (mock-solution tripwire).',
    });
  }

  if (new Set(units.filter(Boolean)).size !== PRIMAL_LABELS.length) {
    issues.push({
      code: 'primal-carrier-assignment-degenerate',
      message: 'Upstream primalCarrierAssignment units are not pairwise distinct.',
    });
  }

  return {
    A: assignment?.A ?? 'e1',
    B: assignment?.B ?? 'e2',
    C: assignment?.C ?? 'e4',
    D: assignment?.D ?? 'e7',
  };
}

function buildFlagStates(
  disc: DiscReport,
  assignment: Record<HubLayerPrimalLabel, HubLayerFanoUnit>,
  issues: HubLayerSourceStateCapsuleV0Issue[],
): HubLayerFlagStateV0[] {
  const upstreamLiftByFlagId = new Map<string, DiscSignedLiftRow>(
    disc.signedLiftRows.map((row) => [row.flagId, row]),
  );

  return disc.flagRows.map((flagRow: DiscFlagRow) => {
    const shared = flagRow.sharedPrimalVertex as HubLayerPrimalLabel;
    const omitted = flagRow.omittedPrimalVertex as HubLayerPrimalLabel;
    const flagId = flagRow.flagId as HubLayerFlagId;
    const reverseFlagId = `${omitted}->${shared}` as HubLayerFlagId;
    const recomputedSignedLift = multiplyHubSignedBasis(
      { sign: '+', unit: assignment[shared] },
      { sign: '+', unit: assignment[omitted] },
    );
    const recomputedSignedLiftLabel = formatHubSignedBasis(recomputedSignedLift);

    if (recomputedSignedLift.unit === '1') {
      issues.push({
        code: 'flag-lift-scalar-degenerate',
        message: `Recomputed lift for ${flagId} degenerated to a scalar; carrier ray undefined.`,
      });
    }

    const upstreamRow = upstreamLiftByFlagId.get(flagId);
    const upstreamSignedLift = upstreamRow?.signedLift ?? 'missing-upstream-row';
    const transported =
      upstreamRow !== undefined &&
      upstreamRow.productUnit === recomputedSignedLift.unit &&
      upstreamRow.sign === recomputedSignedLift.sign &&
      upstreamRow.signedLift === recomputedSignedLiftLabel;
    const transportedSignIdentityStatus: HubLayerTransportedSignIdentityStatus = transported
      ? 'transported-and-identity-verified'
      : 'transport-mismatch';

    if (!transported) {
      issues.push({
        code: `transported-sign-identity-failed:${flagId}`,
        message: `Recomputed lift ${recomputedSignedLiftLabel} for ${flagId} does not identity-match upstream '${upstreamSignedLift}'; the sign cannot be presented as transported.`,
      });
    }

    return {
      flagStateId: `hub-flag-state:${flagId}`,
      flagId,
      sharedPrimalVertex: shared,
      omittedPrimalVertex: omitted,
      rootCoordinate: { ...flagRow.rootCoordinate },
      recomputedSignedLift,
      recomputedSignedLiftLabel,
      upstreamSignedLift,
      transportedSignIdentityStatus,
      carrierRay: `ray:${recomputedSignedLift.unit}`,
      reverseFlagId,
      antipodalAxisId: axisIdForFlagPair(flagId, reverseFlagId),
      orderedIdentityStatus: 'distinct-ordered-flag-state',
      gateC5VisibilityStatus: SOURCE_STATE_ONLY,
      tupleReductionStatus: TUPLE_PROJECTION_LOST,
    };
  });
}

function buildAntipodalAxes(
  flagStates: HubLayerFlagStateV0[],
  disc: DiscReport,
  issues: HubLayerSourceStateCapsuleV0Issue[],
): HubLayerAntipodalFlagAxisV0[] {
  const stateByFlagId = new Map(flagStates.map((state) => [state.flagId, state]));
  const upstreamByFlagId = new Map<string, DiscSignedLiftRow>(
    disc.signedLiftRows.map((row) => [row.flagId, row]),
  );
  const seenAxisIds = new Set<string>();
  const axes: HubLayerAntipodalFlagAxisV0[] = [];

  for (const state of flagStates) {
    const axisId = state.antipodalAxisId;

    if (seenAxisIds.has(axisId)) {
      continue;
    }

    seenAxisIds.add(axisId);

    const reverseState = stateByFlagId.get(state.reverseFlagId);

    if (!reverseState) {
      issues.push({
        code: 'antipodal-reverse-flag-missing',
        message: `Reverse flag ${state.reverseFlagId} of ${state.flagId} is not instantiated; ordered identity broken.`,
      });
      continue;
    }

    const sameUnit =
      state.recomputedSignedLift.unit === reverseState.recomputedSignedLift.unit;
    const oppositeSign =
      state.recomputedSignedLift.sign !== reverseState.recomputedSignedLift.sign;
    const distinctLifts =
      state.recomputedSignedLiftLabel !== reverseState.recomputedSignedLiftLabel;
    const recomputedOppositionStatus =
      sameUnit && oppositeSign && distinctLifts
        ? ('same-ray-opposite-sign' as const)
        : ('flattened-or-mismatched' as const);
    const rootNegationVerified = PRIMAL_LABELS.every(
      (label) => state.rootCoordinate[label] === -reverseState.rootCoordinate[label],
    );
    const upstreamLeft = upstreamByFlagId.get(state.flagId);
    const upstreamRight = upstreamByFlagId.get(reverseState.flagId);
    const upstreamAgrees =
      upstreamLeft !== undefined &&
      upstreamRight !== undefined &&
      upstreamLeft.productUnit === upstreamRight.productUnit &&
      upstreamLeft.sign !== upstreamRight.sign &&
      upstreamLeft.carrierRay === upstreamRight.carrierRay &&
      upstreamLeft.carrierRay === state.carrierRay;

    if (recomputedOppositionStatus !== 'same-ray-opposite-sign') {
      issues.push({
        code: 'antipodal-axis-flattened',
        message: `Axis ${axisId} failed signed antipodal opposition (${state.recomputedSignedLiftLabel} vs ${reverseState.recomputedSignedLiftLabel}); F1 complement-transport precedent forbids flattening.`,
      });
    }

    if (!rootNegationVerified) {
      issues.push({
        code: 'antipodal-root-negation-failed',
        message: `Axis ${axisId} failed root negation between ${state.flagId} and ${reverseState.flagId}.`,
      });
    }

    if (!upstreamAgrees) {
      issues.push({
        code: 'antipodal-upstream-disagreement',
        message: `Axis ${axisId} disagrees with upstream signed-lift/ray rows.`,
      });
    }

    axes.push({
      axisId,
      flagIds: [state.flagId, reverseState.flagId],
      carrierRay: state.carrierRay,
      signedLiftPair: [
        state.recomputedSignedLiftLabel,
        reverseState.recomputedSignedLiftLabel,
      ],
      recomputedOppositionStatus,
      rootNegationStatus: rootNegationVerified
        ? 'root-negation-verified'
        : 'root-negation-failed',
      upstreamAgreementStatus: upstreamAgrees
        ? 'agrees-with-upstream'
        : 'disagrees-with-upstream',
      gateC5VisibilityStatus: SOURCE_STATE_ONLY,
      tupleReductionStatus: TUPLE_PROJECTION_LOST,
    });
  }

  return axes;
}

function buildRayGroups(
  flagStates: HubLayerFlagStateV0[],
  axes: HubLayerAntipodalFlagAxisV0[],
  issues: HubLayerSourceStateCapsuleV0Issue[],
): HubLayerRayGroupV0[] {
  const groups = new Map<string, HubLayerRayGroupV0>();

  for (const axis of axes) {
    const group = groups.get(axis.carrierRay) ?? {
      carrierRay: axis.carrierRay,
      axisIds: [],
      flagIds: [],
      signedLifts: [],
    };

    group.axisIds.push(axis.axisId);
    groups.set(axis.carrierRay, group);
  }

  for (const state of [...flagStates].sort((left, right) =>
    left.flagId < right.flagId ? -1 : 1,
  )) {
    const group = groups.get(state.carrierRay);

    if (!group) {
      issues.push({
        code: 'ray-group-missing-for-flag',
        message: `Flag ${state.flagId} carries ${state.carrierRay} but no axis-derived ray group exists for it.`,
      });
      continue;
    }

    group.flagIds.push(state.flagId);
    group.signedLifts.push(state.recomputedSignedLiftLabel);
  }

  return [...groups.values()].sort((left, right) =>
    left.carrierRay < right.carrierRay ? -1 : 1,
  );
}

function buildTriangleClosureRelations(
  triangleRows: DiscTriangleRow[],
  liftByFlagId: Map<string, HubLayerSignedBasis>,
  issues: HubLayerSourceStateCapsuleV0Issue[],
): HubLayerTriangleClosureRelationV0[] {
  const rowsByTriangleId = groupBy(triangleRows, (row) => row.triangleId);
  const relations: HubLayerTriangleClosureRelationV0[] = [];

  for (const [triangleId, rows] of rowsByTriangleId) {
    const flagIds = dedupeStrings(
      rows.flatMap((row) => [row.leftFlagId, row.rightFlagId, row.targetFlagId]),
    ).sort() as HubLayerFlagId[];
    const orderedProductRows = rows.map((row) => {
      const leftLift = requireLift(liftByFlagId, row.leftFlagId, issues);
      const rightLift = requireLift(liftByFlagId, row.rightFlagId, issues);
      const targetLift = requireLift(liftByFlagId, row.targetFlagId, issues);
      const recomputed = multiplyHubSignedBasis(leftLift, rightLift);
      const recomputedProduct = formatHubSignedBasis(recomputed);
      const recomputedClosureStatus: 'pass' | 'fail' =
        recomputed.unit !== '1' && recomputed.unit === targetLift.unit ? 'pass' : 'fail';
      const productAgreementStatus: HubLayerAgreementStatus =
        recomputedProduct === row.productSignedLift
          ? 'agrees-with-upstream'
          : 'disagrees-with-upstream';
      const closureAgreementStatus: HubLayerAgreementStatus =
        recomputedClosureStatus === row.closureStatus
          ? 'agrees-with-upstream'
          : 'disagrees-with-upstream';

      if (
        productAgreementStatus !== 'agrees-with-upstream' ||
        closureAgreementStatus !== 'agrees-with-upstream'
      ) {
        issues.push({
          code: 'triangle-product-disagreement',
          message: `Ordered product ${row.orderedProductId}: recomputed ${recomputedProduct}/${recomputedClosureStatus} vs upstream ${row.productSignedLift}/${row.closureStatus}.`,
        });
      }

      return {
        orderedProductId: row.orderedProductId,
        leftFlagId: row.leftFlagId as HubLayerFlagId,
        rightFlagId: row.rightFlagId as HubLayerFlagId,
        targetFlagId: row.targetFlagId as HubLayerFlagId,
        recomputedProduct,
        upstreamProduct: row.productSignedLift,
        productAgreementStatus,
        recomputedClosureStatus,
        upstreamClosureStatus: row.closureStatus,
        closureAgreementStatus,
      };
    });
    const agreementCount = orderedProductRows.filter(
      (row) =>
        row.productAgreementStatus === 'agrees-with-upstream' &&
        row.closureAgreementStatus === 'agrees-with-upstream',
    ).length;

    relations.push({
      relationId: triangleId,
      flagIds,
      orderedProductRows,
      rowCount: orderedProductRows.length,
      agreementCount,
      recomputedClosurePassCount: orderedProductRows.filter(
        (row) => row.recomputedClosureStatus === 'pass',
      ).length,
      relationAgreementStatus:
        agreementCount === orderedProductRows.length
          ? 'agrees-with-upstream'
          : 'disagrees-with-upstream',
      gateC5VisibilityStatus: SOURCE_STATE_ONLY,
      tupleReductionStatus: TUPLE_PROJECTION_LOST,
    });
  }

  return relations;
}

function buildSquareHolonomyRelations(
  squareRows: DiscSquareRow[],
  liftByFlagId: Map<string, HubLayerSignedBasis>,
  issues: HubLayerSourceStateCapsuleV0Issue[],
): HubLayerSquareHolonomyRelationV0[] {
  const rowsByCycleId = groupBy(squareRows, (row) => row.squareCycleId);
  const relations: HubLayerSquareHolonomyRelationV0[] = [];

  for (const [squareCycleId, rows] of rowsByCycleId) {
    const canonicalRow =
      rows.find((row) => row.orientationVariant === 'forward-rotation-0') ?? rows[0];
    const variantRows = rows.map((row) => {
      const lifts = row.flagCycle.map((flagId) =>
        requireLift(liftByFlagId, flagId, issues),
      );
      const recomputed = lifts.reduce((product, lift) =>
        multiplyHubSignedBasis(product, lift),
      );
      const recomputedLeftAssociatedProduct = formatHubSignedBasis(recomputed);
      const recomputedHolonomyStatus: 'pass' | 'fail' =
        recomputed.sign === '+' && recomputed.unit === '1' ? 'pass' : 'fail';
      const productAgreementStatus: HubLayerAgreementStatus =
        recomputedLeftAssociatedProduct === row.leftAssociatedProduct
          ? 'agrees-with-upstream'
          : 'disagrees-with-upstream';
      const holonomyAgreementStatus: HubLayerAgreementStatus =
        recomputedHolonomyStatus === row.holonomyStatus
          ? 'agrees-with-upstream'
          : 'disagrees-with-upstream';

      if (
        productAgreementStatus !== 'agrees-with-upstream' ||
        holonomyAgreementStatus !== 'agrees-with-upstream'
      ) {
        issues.push({
          code: 'square-variant-disagreement',
          message: `Holonomy variant ${row.squareHolonomyVariantId}: recomputed ${recomputedLeftAssociatedProduct}/${recomputedHolonomyStatus} vs upstream ${row.leftAssociatedProduct}/${row.holonomyStatus}.`,
        });
      }

      return {
        squareHolonomyVariantId: row.squareHolonomyVariantId,
        orientationVariant: row.orientationVariant,
        flagCycle: [...row.flagCycle] as HubLayerFlagId[],
        recomputedLeftAssociatedProduct,
        upstreamLeftAssociatedProduct: row.leftAssociatedProduct,
        productAgreementStatus,
        recomputedHolonomyStatus,
        upstreamHolonomyStatus: row.holonomyStatus,
        holonomyAgreementStatus,
      };
    });
    const agreementCount = variantRows.filter(
      (row) =>
        row.productAgreementStatus === 'agrees-with-upstream' &&
        row.holonomyAgreementStatus === 'agrees-with-upstream',
    ).length;

    relations.push({
      relationId: squareCycleId,
      canonicalFlagCycle: [...(canonicalRow?.flagCycle ?? [])] as HubLayerFlagId[],
      variantRows,
      rowCount: variantRows.length,
      agreementCount,
      recomputedHolonomyPassCount: variantRows.filter(
        (row) => row.recomputedHolonomyStatus === 'pass',
      ).length,
      relationAgreementStatus:
        agreementCount === variantRows.length
          ? 'agrees-with-upstream'
          : 'disagrees-with-upstream',
      gateC5VisibilityStatus: SOURCE_STATE_ONLY,
      tupleReductionStatus: TUPLE_PROJECTION_LOST,
    });
  }

  return relations;
}

function buildGaugeRobustnessMeta(
  disc: DiscReport,
  issues: HubLayerSourceStateCapsuleV0Issue[],
): HubLayerGaugeRobustnessMetaV0 {
  const rows = disc.fanoCompleteQuadrangleRows;

  if (rows.length === 0) {
    issues.push({
      code: 'gauge-meta-atoms-missing',
      message: 'Upstream fanoCompleteQuadrangleRows are empty (mock-solution tripwire).',
    });
  }

  return {
    quadrangleCount: rows.length,
    labelingCount: rows.reduce((sum, row) => sum + row.labelingCount, 0),
    flagRecoveryFailureCount: rows.reduce(
      (sum, row) => sum + row.flagRecoveryFailureCount,
      0,
    ),
    triangleClosureFailureCount: rows.reduce(
      (sum, row) => sum + row.triangleClosureFailureCount,
      0,
    ),
    squareHolonomyFailureCount: rows.reduce(
      (sum, row) => sum + row.squareHolonomyFailureCount,
      0,
    ),
    quotientLossAnomalyCount: rows.reduce(
      (sum, row) => sum + row.quotientLossAnomalyCount,
      0,
    ),
    upstreamGaugeRobustnessStatus: disc.summary.gaugeRobustnessStatus,
    invarianceKind: 'fano-complete-quadrangle-carrier-gauge',
    invarianceDistinction: 'distinct-from-s4-vertex-relabeling',
    recomputationStatus: 'declared-meta-property-not-recomputed',
    gateC5VisibilityStatus: SOURCE_STATE_ONLY,
    tupleReductionStatus: TUPLE_PROJECTION_LOST,
  };
}

function buildProvenanceRoutes(
  disc: DiscReport,
  issues: HubLayerSourceStateCapsuleV0Issue[],
): HubLayerProvenanceRouteV0[] {
  const routes: HubLayerProvenanceRouteV0[] = [
    {
      routeId: 'hub-provenance-route:tetra-g2-core',
      routeKind: 'tetra-g2-core',
      upstreamBridgeStatus: disc.tetraG2CoreCuboctahedronBridge.status,
      coreTopologies: [
        disc.tetraG2CoreCuboctahedronBridge.g1CoreTopology,
        disc.tetraG2CoreCuboctahedronBridge.g2CoreTopology,
      ],
      medialHubStatus: null,
      gateC5VisibilityStatus: SOURCE_STATE_ONLY,
      tupleReductionStatus: TUPLE_PROJECTION_LOST,
    },
    {
      routeId: 'hub-provenance-route:octa-g1',
      routeKind: 'octa-g1',
      upstreamBridgeStatus: disc.cuboctahedronBridge.status,
      coreTopologies: [disc.cuboctahedronBridge.coreTopology],
      medialHubStatus: null,
      gateC5VisibilityStatus: SOURCE_STATE_ONLY,
      tupleReductionStatus: TUPLE_PROJECTION_LOST,
    },
    {
      routeId: 'hub-provenance-route:cube-g1',
      routeKind: 'cube-g1',
      upstreamBridgeStatus: disc.cubeG1CuboctahedronBridge.status,
      coreTopologies: [disc.cubeG1CuboctahedronBridge.coreTopology],
      medialHubStatus: disc.dualOctaCubeProvenance.cubeG1MedialHubStatus,
      gateC5VisibilityStatus: SOURCE_STATE_ONLY,
      tupleReductionStatus: TUPLE_PROJECTION_LOST,
    },
  ];

  for (const route of routes) {
    if (!route.upstreamBridgeStatus) {
      issues.push({
        code: 'provenance-route-status-missing',
        message: `Provenance route ${route.routeKind} has no upstream bridge status (mock-solution tripwire).`,
      });
    }
  }

  return routes;
}

function buildOpenBoundaries(
  disc: DiscReport,
  card: CardReport,
  issues: HubLayerSourceStateCapsuleV0Issue[],
): HubLayerOpenBoundaryV0[] {
  const upstreamStatus = disc.dualOctaCubeProvenance.cubePrimalCarrierAssignmentStatus;
  const forbiddenPromotion = card.forbiddenPromotions.find(
    (row) => row.promotionId === 'no-independent-cube-primal-sourcehood',
  );

  if (!upstreamStatus) {
    issues.push({
      code: 'open-boundary-atoms-missing',
      message: 'Upstream cube primal sourcehood boundary status is absent (mock-solution tripwire).',
    });
  }

  return [
    {
      boundaryId: 'cube-primal-sourcehood',
      upstreamStatus,
      boundaryStatus: 'declared-open-boundary-not-absorbed',
      corroboration: [
        `disc.summary.cubePrimalSourcehoodStatus='${disc.summary.cubePrimalSourcehoodStatus}'`,
        `card.cubePrimalSourcehoodStatus='${card.cubePrimalSourcehoodStatus}'`,
        `card.forbiddenPromotions['no-independent-cube-primal-sourcehood']='${forbiddenPromotion?.warning ?? 'missing'}'`,
      ],
    },
  ];
}

function buildRecomputationSummary(args: {
  flagStates: HubLayerFlagStateV0[];
  antipodalAxes: HubLayerAntipodalFlagAxisV0[];
  triangleClosureRelations: HubLayerTriangleClosureRelationV0[];
  squareHolonomyRelations: HubLayerSquareHolonomyRelationV0[];
}): HubLayerRecomputationSummaryV0 {
  return {
    flagStateCount: args.flagStates.length,
    liftIdentityVerifiedCount: args.flagStates.filter(
      (state) => state.transportedSignIdentityStatus === 'transported-and-identity-verified',
    ).length,
    distinctRecomputedSignedLiftCount: new Set(
      args.flagStates.map((state) => state.recomputedSignedLiftLabel),
    ).size,
    antipodalAxisCount: args.antipodalAxes.length,
    antipodalAxisVerifiedCount: args.antipodalAxes.filter(
      (axis) =>
        axis.recomputedOppositionStatus === 'same-ray-opposite-sign' &&
        axis.rootNegationStatus === 'root-negation-verified' &&
        axis.upstreamAgreementStatus === 'agrees-with-upstream',
    ).length,
    triangleProductRowCount: args.triangleClosureRelations.reduce(
      (sum, relation) => sum + relation.rowCount,
      0,
    ),
    triangleProductAgreementCount: args.triangleClosureRelations.reduce(
      (sum, relation) => sum + relation.agreementCount,
      0,
    ),
    squareVariantRowCount: args.squareHolonomyRelations.reduce(
      (sum, relation) => sum + relation.rowCount,
      0,
    ),
    squareVariantAgreementCount: args.squareHolonomyRelations.reduce(
      (sum, relation) => sum + relation.agreementCount,
      0,
    ),
  };
}

function buildTupleReductionDeclaration(
  disc: DiscReport,
  card: CardReport,
  summary: HubLayerRecomputationSummaryV0,
): HubLayerTupleReductionDeclarationV0 {
  return {
    sourceSignatureStatus:
      'structured-source-state-is-the-source-signature (this hub-layer capsule)',
    emittedTupleStatus:
      'no-hub-layer-emitted-tuple-defined - any scalar tuple is a field-facing reduction only, never the source signature',
    reductionLawContext:
      'declared against the existing v0 scalar emission tuple family (amplitude/waveNumber/phase/attenuation), which carries harmonic content only',
    lostUnderScalarTupleReduction: [
      'ordered flag identity (12 ordered flags; bare signed lift already collapses them to 6 - a scalar tuple carries even less)',
      'signed Fano lift unit-and-sign structure',
      'antipodal flag-axis opposition (same ray, opposite sign)',
      'triangle multiplication-closure relations',
      'square-cycle holonomy relations',
      'complete-quadrangle gauge robustness meta-property',
      'tetra-g2-core / octa-g1 / cube-g1 provenance routes',
    ],
    quotientEvidence: `upstream distinctFlagCount=${disc.summary.distinctFlagCount} vs distinctSignedLiftCount=${disc.summary.distinctSignedLiftCount} (card cross-cite: ${card.evidenceSnapshot.distinctFlagCount}/${card.evidenceSnapshot.distinctSignedLiftCount}); capsule recomputed distinct lifts=${summary.distinctRecomputedSignedLiftCount} over ${summary.flagStateCount} flag states`,
  };
}

function buildCapsuleIntegrityIssues(args: {
  disc: DiscReport;
  card: CardReport;
  flagStates: HubLayerFlagStateV0[];
  antipodalAxes: HubLayerAntipodalFlagAxisV0[];
  rayGroups: HubLayerRayGroupV0[];
  triangleClosureRelations: HubLayerTriangleClosureRelationV0[];
  squareHolonomyRelations: HubLayerSquareHolonomyRelationV0[];
  gaugeRobustnessMeta: HubLayerGaugeRobustnessMetaV0;
  provenanceRoutes: HubLayerProvenanceRouteV0[];
  openBoundaries: HubLayerOpenBoundaryV0[];
  tupleReductionDeclaration: HubLayerTupleReductionDeclarationV0;
  recomputationSummary: HubLayerRecomputationSummaryV0;
}): HubLayerSourceStateCapsuleV0Issue[] {
  const issues: HubLayerSourceStateCapsuleV0Issue[] = [];
  const {
    disc,
    card,
    flagStates,
    antipodalAxes,
    rayGroups,
    triangleClosureRelations,
    squareHolonomyRelations,
    gaugeRobustnessMeta,
    provenanceRoutes,
    openBoundaries,
    tupleReductionDeclaration,
    recomputationSummary,
  } = args;

  if (disc.method !== 'octonion-vs-a3-medial-carrier-discriminator-v0' || !disc.ok) {
    issues.push({
      code: 'consumed-discriminator-invalid',
      message: `Discriminator report method='${disc.method}', ok=${disc.ok}; capsule preconditions fail.`,
    });
  }

  if (card.method !== 'medial-dual-equivariant-carrier-policy-model-card-v0' || !card.ok) {
    issues.push({
      code: 'consumed-model-card-invalid',
      message: `Model card report method='${card.method}', ok=${card.ok}; capsule preconditions fail.`,
    });
  }

  const flagIds = flagStates.map((state) => state.flagId);
  const upstreamFlagIds = disc.flagRows.map((row) => row.flagId);

  if (
    flagStates.length !== 12 ||
    new Set(flagIds).size !== 12 ||
    upstreamFlagIds.length !== 12 ||
    !upstreamFlagIds.every((flagId) => flagIds.includes(flagId as HubLayerFlagId))
  ) {
    issues.push({
      code: 'flag-state-bijection-violation',
      message: `Expected 12 distinct flag states bijective with upstream flagRows; got ${flagStates.length} states over ${upstreamFlagIds.length} upstream rows.`,
    });
  }

  for (const state of flagStates) {
    const reverseState = flagStates.find(
      (candidate) => candidate.flagId === state.reverseFlagId,
    );

    if (
      !reverseState ||
      reverseState.reverseFlagId !== state.flagId ||
      reverseState.flagId === state.flagId
    ) {
      issues.push({
        code: 'reverse-involution-violation',
        message: `Reverse map is not a fixed-point-free involution at ${state.flagId}.`,
      });
    }
  }

  if (
    recomputationSummary.distinctRecomputedSignedLiftCount !==
    disc.summary.distinctSignedLiftCount
  ) {
    issues.push({
      code: 'signed-lift-quotient-disagreement',
      message: `Capsule recomputed ${recomputationSummary.distinctRecomputedSignedLiftCount} distinct lifts; upstream reports ${disc.summary.distinctSignedLiftCount}.`,
    });
  }

  if (
    card.evidenceSnapshot.distinctFlagCount !== disc.summary.distinctFlagCount ||
    card.evidenceSnapshot.distinctSignedLiftCount !== disc.summary.distinctSignedLiftCount
  ) {
    issues.push({
      code: 'card-evidence-disagreement',
      message: 'Model card evidence snapshot disagrees with discriminator summary counts.',
    });
  }

  if (
    recomputationSummary.liftIdentityVerifiedCount !== recomputationSummary.flagStateCount
  ) {
    issues.push({
      code: 'transported-sign-identity-incomplete',
      message: `Only ${recomputationSummary.liftIdentityVerifiedCount}/${recomputationSummary.flagStateCount} flag lifts identity-verified against upstream.`,
    });
  }

  if (antipodalAxes.length !== 6) {
    issues.push({
      code: 'antipodal-axis-count-mismatch',
      message: `Expected 6 antipodal flag axes, got ${antipodalAxes.length}.`,
    });
  }

  if (recomputationSummary.antipodalAxisVerifiedCount !== antipodalAxes.length) {
    issues.push({
      code: 'antipodal-axis-verification-incomplete',
      message: `Only ${recomputationSummary.antipodalAxisVerifiedCount}/${antipodalAxes.length} axes fully verified (opposition + root negation + upstream agreement).`,
    });
  }

  if (
    rayGroups.length !== 3 ||
    rayGroups.some((group) => group.axisIds.length !== 2 || group.flagIds.length !== 4)
  ) {
    issues.push({
      code: 'ray-group-shape-mismatch',
      message: `Expected 3 ray groups of 2 axes / 4 flags each; got ${rayGroups
        .map((group) => `${group.carrierRay}:${group.axisIds.length}/${group.flagIds.length}`)
        .join(', ')}.`,
    });
  }

  if (
    triangleClosureRelations.length !== 8 ||
    recomputationSummary.triangleProductRowCount !== 48
  ) {
    issues.push({
      code: 'triangle-relation-shape-mismatch',
      message: `Expected 8 triangle relations over 48 ordered products; got ${triangleClosureRelations.length} relations over ${recomputationSummary.triangleProductRowCount} rows.`,
    });
  }

  if (
    recomputationSummary.triangleProductAgreementCount !==
    recomputationSummary.triangleProductRowCount
  ) {
    issues.push({
      code: 'triangle-recomputation-disagreement',
      message: `Triangle recomputation agrees on ${recomputationSummary.triangleProductAgreementCount}/${recomputationSummary.triangleProductRowCount} ordered products.`,
    });
  }

  if (
    squareHolonomyRelations.length !== 6 ||
    recomputationSummary.squareVariantRowCount !== 48
  ) {
    issues.push({
      code: 'square-relation-shape-mismatch',
      message: `Expected 6 square relations over 48 orientation variants; got ${squareHolonomyRelations.length} relations over ${recomputationSummary.squareVariantRowCount} rows.`,
    });
  }

  if (
    recomputationSummary.squareVariantAgreementCount !==
    recomputationSummary.squareVariantRowCount
  ) {
    issues.push({
      code: 'square-recomputation-disagreement',
      message: `Square holonomy recomputation agrees on ${recomputationSummary.squareVariantAgreementCount}/${recomputationSummary.squareVariantRowCount} variants.`,
    });
  }

  if (
    gaugeRobustnessMeta.quadrangleCount !== 7 ||
    gaugeRobustnessMeta.labelingCount !== 168 ||
    !gaugeRobustnessMeta.upstreamGaugeRobustnessStatus
  ) {
    issues.push({
      code: 'gauge-meta-mismatch',
      message: `Gauge meta expected 7 quadrangles / 168 labelings with an upstream status; got ${gaugeRobustnessMeta.quadrangleCount}/${gaugeRobustnessMeta.labelingCount}/'${gaugeRobustnessMeta.upstreamGaugeRobustnessStatus}'.`,
    });
  }

  if (provenanceRoutes.length !== 3) {
    issues.push({
      code: 'provenance-route-count-mismatch',
      message: `Expected 3 provenance routes, got ${provenanceRoutes.length}.`,
    });
  }

  const cubeRoute = provenanceRoutes.find((route) => route.routeKind === 'cube-g1');

  if (cubeRoute?.medialHubStatus !== EXPECTED_CUBE_MEDIAL_HUB_STATUS) {
    issues.push({
      code: 'cube-dual-provenance-wording-lost',
      message: `Cube route medialHubStatus is '${cubeRoute?.medialHubStatus ?? 'missing'}'; the dual-provenance-only wording must be preserved verbatim.`,
    });
  }

  const boundary = openBoundaries[0];

  if (
    openBoundaries.length !== 1 ||
    boundary?.upstreamStatus !== EXPECTED_CUBE_PRIMAL_BOUNDARY_STATUS ||
    boundary?.boundaryStatus !== 'declared-open-boundary-not-absorbed'
  ) {
    issues.push({
      code: 'open-boundary-not-open',
      message: `Cube primal sourcehood must remain a declared open boundary with verbatim status '${EXPECTED_CUBE_PRIMAL_BOUNDARY_STATUS}'; got '${boundary?.upstreamStatus ?? 'missing'}'.`,
    });
  }

  const statusBearingRecords: Array<{
    id: string;
    visibility: HubLayerGateC5VisibilityStatus;
    reduction: HubLayerGateC5VisibilityStatus;
  }> = [
    ...flagStates.map((state) => ({
      id: state.flagStateId,
      visibility: state.gateC5VisibilityStatus,
      reduction: state.tupleReductionStatus,
    })),
    ...antipodalAxes.map((axis) => ({
      id: axis.axisId,
      visibility: axis.gateC5VisibilityStatus,
      reduction: axis.tupleReductionStatus,
    })),
    ...triangleClosureRelations.map((relation) => ({
      id: relation.relationId,
      visibility: relation.gateC5VisibilityStatus,
      reduction: relation.tupleReductionStatus,
    })),
    ...squareHolonomyRelations.map((relation) => ({
      id: relation.relationId,
      visibility: relation.gateC5VisibilityStatus,
      reduction: relation.tupleReductionStatus,
    })),
    {
      id: 'gauge-robustness-meta',
      visibility: gaugeRobustnessMeta.gateC5VisibilityStatus,
      reduction: gaugeRobustnessMeta.tupleReductionStatus,
    },
    ...provenanceRoutes.map((route) => ({
      id: route.routeId,
      visibility: route.gateC5VisibilityStatus,
      reduction: route.tupleReductionStatus,
    })),
  ];

  for (const record of statusBearingRecords) {
    if (
      !GATE_C5_VOCABULARY.includes(record.visibility) ||
      !GATE_C5_VOCABULARY.includes(record.reduction)
    ) {
      issues.push({
        code: 'gate-c5-status-out-of-vocabulary',
        message: `${record.id} carries a status outside the Gate C.5 vocabulary.`,
      });
    }

    if (record.visibility !== 'source-state-only') {
      issues.push({
        code: 'field-activity-claimed',
        message: `${record.id} claims visibility '${record.visibility}'; the capsule is source-state-only (nothing field-active).`,
      });
    }

    if (record.reduction !== 'tuple-projection-lost') {
      issues.push({
        code: 'tuple-reduction-status-invalid',
        message: `${record.id} carries tuple-reduction status '${record.reduction}'; expected tuple-projection-lost.`,
      });
    }
  }

  if (
    tupleReductionDeclaration.lostUnderScalarTupleReduction.length === 0 ||
    !tupleReductionDeclaration.quotientEvidence.includes(
      String(recomputationSummary.flagStateCount),
    ) ||
    !tupleReductionDeclaration.quotientEvidence.includes(
      String(recomputationSummary.distinctRecomputedSignedLiftCount),
    )
  ) {
    issues.push({
      code: 'tuple-declaration-invalid',
      message:
        'Tuple-reduction declaration must enumerate losses and cite the 12-vs-6 quotient evidence.',
    });
  }

  const numericValues = [
    recomputationSummary.flagStateCount,
    recomputationSummary.liftIdentityVerifiedCount,
    recomputationSummary.distinctRecomputedSignedLiftCount,
    recomputationSummary.antipodalAxisCount,
    recomputationSummary.antipodalAxisVerifiedCount,
    recomputationSummary.triangleProductRowCount,
    recomputationSummary.triangleProductAgreementCount,
    recomputationSummary.squareVariantRowCount,
    recomputationSummary.squareVariantAgreementCount,
    gaugeRobustnessMeta.quadrangleCount,
    gaugeRobustnessMeta.labelingCount,
  ];

  if (numericValues.some((value) => !Number.isFinite(value))) {
    issues.push({
      code: 'non-finite-count',
      message: 'One or more capsule counts is non-finite.',
    });
  }

  return issues;
}

function multiplyHubSignedBasis(
  left: HubLayerSignedBasis,
  right: HubLayerSignedBasis,
): HubLayerSignedBasis {
  if (left.unit === '1') {
    return { sign: hubSignParity(left.sign, right.sign), unit: right.unit };
  }

  if (right.unit === '1') {
    return { sign: hubSignParity(left.sign, right.sign), unit: left.unit };
  }

  if (left.unit === right.unit) {
    return { sign: hubSignParity(left.sign, right.sign, '-'), unit: '1' };
  }

  const leftNumber = hubUnitNumber(left.unit);
  const rightNumber = hubUnitNumber(right.unit);

  for (const [first, second, third] of HUB_ORIENTED_FANO_TRIPLES) {
    for (const [cycleLeft, cycleRight, cycleProduct] of [
      [first, second, third],
      [second, third, first],
      [third, first, second],
    ] as const) {
      if (leftNumber === cycleLeft && rightNumber === cycleRight) {
        return {
          sign: hubSignParity(left.sign, right.sign, '+'),
          unit: hubUnitId(cycleProduct),
        };
      }

      if (leftNumber === cycleRight && rightNumber === cycleLeft) {
        return {
          sign: hubSignParity(left.sign, right.sign, '-'),
          unit: hubUnitId(cycleProduct),
        };
      }
    }
  }

  throw new Error(`hub capsule: unsupported Fano product ${left.unit}*${right.unit}`);
}

function hubSignParity(...signs: HubLayerSign[]): HubLayerSign {
  return signs.filter((sign) => sign === '-').length % 2 === 0 ? '+' : '-';
}

function hubUnitNumber(unit: HubLayerFanoUnit): number {
  return Number(unit.slice(1));
}

function hubUnitId(unitNumberValue: number): HubLayerFanoUnit {
  return `e${unitNumberValue}` as HubLayerFanoUnit;
}

function formatHubSignedBasis(value: HubLayerSignedBasis): string {
  return `${value.sign}${value.unit}`;
}

function axisIdForFlagPair(left: HubLayerFlagId, right: HubLayerFlagId): string {
  const ordered = [left, right].sort();

  return `hub-antipodal-axis:${ordered[0]}|${ordered[1]}`;
}

function requireLift(
  liftByFlagId: Map<string, HubLayerSignedBasis>,
  flagId: string,
  issues: HubLayerSourceStateCapsuleV0Issue[],
): HubLayerSignedBasis {
  const lift = liftByFlagId.get(flagId);

  if (!lift) {
    issues.push({
      code: 'flag-lift-missing-for-relation',
      message: `No capsule-resident lift exists for ${flagId}; relation recomputation is not grounded.`,
    });

    return { sign: '+', unit: '1' };
  }

  return lift;
}

function groupBy<TValue>(
  values: TValue[],
  keyOf: (value: TValue) => string,
): Map<string, TValue[]> {
  const groups = new Map<string, TValue[]>();

  for (const value of values) {
    const key = keyOf(value);
    const group = groups.get(key) ?? [];

    group.push(value);
    groups.set(key, group);
  }

  return groups;
}

function dedupeStrings(values: string[]): string[] {
  return [...new Set(values)];
}

function dedupeIssues(
  issues: HubLayerSourceStateCapsuleV0Issue[],
): HubLayerSourceStateCapsuleV0Issue[] {
  const seen = new Set<string>();

  return issues.filter((issue) => {
    const key = `${issue.code}:${issue.message}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
