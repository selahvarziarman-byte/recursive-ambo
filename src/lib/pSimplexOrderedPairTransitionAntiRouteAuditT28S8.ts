import { buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report } from './pSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1';
import { buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report } from './pSimplexSignedSquareHexSectorCouplingAuditT28S3';
import { buildPSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7Report } from './pSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7';

export type Vec3 = [number, number, number];
export type A3Label = 'A' | 'B' | 'C' | 'D';
export type GateBodyId = 'GateBody_AB/CD' | 'GateBody_AC/BD' | 'GateBody_AD/BC';
export type SiteId = 'M_AB' | 'M_AC' | 'M_AD' | 'M_BC' | 'M_BD' | 'M_CD';

type Matrix = number[][];
type S1Report = ReturnType<typeof buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report>;
type S3Report = ReturnType<typeof buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report>;
type S7Report = ReturnType<typeof buildPSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7Report>;
type S1ReadoutRow = S1Report['readoutSectionRows'][number];
type S1SquarePolarityRow = S1Report['squarePolarityRows'][number];
type S7GateBodyBasisRow = S7Report['gateBodyBasisRows'][number];

interface Section {
  ids: string[];
  values: Map<string, Vec3>;
}

interface OperatorContext {
  squareIds: string[];
  hexIds: string[];
  squareRows: S1ReadoutRow[];
  hexRows: S1ReadoutRow[];
  qByLabel: Map<A3Label, Vec3>;
  squarePolarityByDirectedPair: Map<string, S1SquarePolarityRow>;
  kappa: Matrix;
  d: Matrix;
  rExact: Matrix;
  rAdj: Matrix;
  pQ: Matrix;
  pH: Matrix;
}

interface GateBody {
  bodyId: GateBodyId;
  siteAddresses: [SiteId, SiteId];
  squareSupportForm: Section;
  hexSupportForm: Section;
}

interface OrderedPairFixture {
  orderedPairId: string;
  sourceBodyId: GateBodyId;
  targetBodyId: GateBodyId;
  absentBodyId: GateBodyId;
  coefficients: Record<GateBodyId, number>;
  squareTransitionPreform: Section;
  hexTransitionPreform: Section;
}

interface Summary<PassStatus extends string, FailStatus extends string> {
  rowCount: number;
  passCount: number;
  failCount: number;
  maxError: number;
  status: PassStatus | FailStatus;
}

export interface ParentEvidenceRow {
  parentId: 'T28-S-Lab-7' | 'T28-S-Lab-1 reconstruction-only' | 'T28-S-Lab-3 reconstruction-only' | 'T28-R context-only-not-authority';
  method: string;
  ok: boolean | null;
  finalVerdict?: string;
  integrityIssueCount?: number;
  componentRecoveryStatus?: string;
  routeLanguageBoundaryStatus?: string;
  consumedSections: string[];
  status: 'lab-7-parent-accepted' | 'lab-7-parent-not-accepted' | 'reconstruction-parent-consumed' | 'context-only';
}

export interface OrderedPairConstructionRow {
  orderedPairId: string;
  sourceBodyId: GateBodyId;
  targetBodyId: GateBodyId;
  squareTransitionPreform: Record<string, Vec3>;
  hexTransitionPreform: Record<string, Vec3>;
  sourceCoefficient: number;
  targetCoefficient: number;
  absentBodyId: GateBodyId;
  absentBodyCoefficient: number;
  maxError: number;
  status: 'ordered-pair-transition-preform-constructed' | 'ordered-pair-transition-preform-failed';
}

export interface OrderedPairTransferRow {
  orderedPairId: string;
  sourceBodyId: GateBodyId;
  targetBodyId: GateBodyId;
  computedProjectedSquare: Record<string, Vec3>;
  expectedSquareTransition: Record<string, Vec3>;
  computedProjectedHex: Record<string, Vec3>;
  expectedHexTransition: Record<string, Vec3>;
  computedDHex: Record<string, Vec3>;
  computedRExactSquare: Record<string, Vec3>;
  computedRAdjSquare: Record<string, Vec3>;
  expectedAdjointSquare: Record<string, Vec3>;
  adjointFactor: number;
  factorLabel: 'finite-adjoint-loop-factor';
  maxError: number;
  status: 'ordered-pair-transfer-preservation-pass' | 'ordered-pair-transfer-preservation-failed';
}

export interface SourceTargetRecoveryRow {
  orderedPairId: string;
  bodyId: GateBodyId;
  expectedCoefficient: number;
  recoveredCoefficientFromSquare: number;
  recoveredCoefficientFromHex: number;
  maxError: number;
  role: 'source-side' | 'target-side' | 'absent';
  status: 'source-target-recovery-pass' | 'source-target-recovery-failed' | 'source-target-role-collapsed' | 'absent-body-falsely-present';
}

export interface OrderedPairReversalRow {
  forwardPairId: string;
  reversePairId: string;
  forwardSquare: Record<string, Vec3>;
  negativeReverseSquare: Record<string, Vec3>;
  forwardHex: Record<string, Vec3>;
  negativeReverseHex: Record<string, Vec3>;
  maxError: number;
  status: 'ordered-pair-reversal-pass' | 'ordered-pair-reversal-failed';
}

export interface UnorderedCoPresenceControlRow {
  controlCaseId: string;
  inputKind: 'unordered-two-body-copresence' | 'single-body-support' | 'three-body-copresence' | 'zero-transition';
  bodyIds: GateBodyId[];
  coefficients: Record<string, number>;
  expectedClassification:
    | 'unordered-co-presence-not-transition'
    | 'single-body-support-not-transition'
    | 'three-body-copresence-not-ordered-pair'
    | 'zero-transition-not-ordered-pair';
  observedClassification:
    | 'unordered-co-presence-not-transition'
    | 'unordered-copresence-falsely-classified-as-transition'
    | 'single-body-support-not-transition'
    | 'single-body-support-falsely-classified-as-transition'
    | 'three-body-copresence-not-ordered-pair'
    | 'three-body-copresence-falsely-classified-as-ordered-pair'
    | 'zero-transition-not-ordered-pair'
    | 'ordered-pair-transition-preform-constructed';
  maxError: number;
  status:
    | 'unordered-co-presence-not-transition'
    | 'unordered-copresence-falsely-classified-as-transition'
    | 'single-body-support-not-transition'
    | 'single-body-support-falsely-classified-as-transition'
    | 'three-body-copresence-not-ordered-pair'
    | 'three-body-copresence-falsely-classified-as-ordered-pair'
    | 'zero-transition-not-ordered-pair'
    | 'ordered-pair-transition-preform-constructed';
}

export interface UnorderedCoPresenceControlSummary {
  rowCount: number;
  passCount: number;
  failCount: number;
  unorderedCoPresencePassCount: number;
  singleBodyPassCount: number;
  threeBodyPassCount: number;
  zeroTransitionPassCount: number;
  maxError: number;
  status:
    | 'unordered-co-presence-not-transition'
    | 'unordered-copresence-falsely-classified-as-transition'
    | 'single-body-support-falsely-classified-as-transition'
    | 'three-body-copresence-falsely-classified-as-ordered-pair';
}

export interface TelescopingAntiRouteRow {
  sourceBodyId: GateBodyId;
  intermediateBodyId: GateBodyId;
  targetBodyId: GateBodyId;
  firstTransitionId: string;
  secondTransitionId: string;
  computedTwoStepSquareComposite: Record<string, Vec3>;
  computedTwoStepHexComposite: Record<string, Vec3>;
  expectedTelescopedPairId: string;
  expectedTelescopedSquare: Record<string, Vec3>;
  expectedTelescopedHex: Record<string, Vec3>;
  intermediateRecoveredCoefficientFromSquare: number;
  intermediateRecoveredCoefficientFromHex: number;
  maxError: number;
  status: 'telescoping-intermediate-erased-not-route' | 'telescoping-control-failed' | 'intermediate-trace-falsely-retained' | 'telescoping-falsely-promoted-to-route';
}

export interface CycleCancellationRow {
  cycleId: string;
  bodyOrder: GateBodyId[];
  transitionIds: string[];
  computedCycleSquareComposite: Record<string, Vec3>;
  computedCycleHexComposite: Record<string, Vec3>;
  expectedZeroSquare: Record<string, Vec3>;
  expectedZeroHex: Record<string, Vec3>;
  maxError: number;
  status: 'cycle-cancellation-not-loop' | 'cycle-cancellation-failed' | 'cycle-falsely-promoted-to-loop' | 'cycle-falsely-promoted-to-vortex' | 'cycle-falsely-promoted-to-route';
}

export interface ComplementAxisTransitionIdentityRow {
  bodyId: GateBodyId;
  siteAddressA: SiteId;
  siteAddressB: SiteId;
  bodyMembershipA: GateBodyId | 'none';
  bodyMembershipB: GateBodyId | 'none';
  identityPreserved: boolean;
  status: 'complement-axis-transition-identity-preserved' | 'complement-axis-transition-identity-lost';
}

export interface ComplementAxisTransitionIdentitySummary {
  rowCount: number;
  passCount: number;
  failCount: number;
  maxError: number;
  siteAddressDoubleCountingStatus: 'site-address-double-counting-rejected' | 'site-address-double-counting-falsely-admitted';
  complementSiteSplitStatus: 'complement-site-split-rejected' | 'complement-axis-transition-identity-lost';
  sixSiteAddressTransitionModelStatus: 'six-site-address-transition-model-rejected' | 'six-site-address-transition-model-falsely-admitted';
  status: 'complement-axis-transition-identity-preserved' | 'complement-axis-transition-identity-lost';
}

export interface InvalidityControlRow {
  controlId: 'N0' | 'N1' | 'N2' | 'N3';
  invalidityKind: 'scalar-magnitude-transition' | 'equal-scalar-body-weights' | 'sector-collapsed-square-hex-transition' | 'row-order-shuffled-valid-transition';
  expectedStatus: 'invalid-scalar-collapse' | 'invalid-sector-collapse' | 'ordered-pair-transition-preform-constructed';
  observedStatus:
    | 'invalid-scalar-collapse'
    | 'invalid-sector-collapse'
    | 'ordered-pair-transition-preform-constructed'
    | 'scalar-collapse-falsely-admitted'
    | 'sector-collapse-falsely-admitted'
    | 'row-order-dependence-detected';
  maxError: number;
  status:
    | 'invalid-scalar-collapse'
    | 'invalid-sector-collapse'
    | 'ordered-pair-transition-preform-constructed'
    | 'scalar-collapse-falsely-admitted'
    | 'sector-collapse-falsely-admitted'
    | 'row-order-dependence-detected';
}

export interface InvalidityControlSummary {
  rowCount: number;
  passCount: number;
  failCount: number;
  scalarCollapsePassCount: number;
  sectorCollapsePassCount: number;
  rowOrderPassCount: number;
  maxError: number;
  status: 'invalidity-controls-pass' | 'scalar-collapse-falsely-admitted' | 'sector-collapse-falsely-admitted' | 'row-order-dependence-detected';
}

export interface AntiRouteLanguageBoundaryRow {
  boundaryId:
    | 'not-route'
    | 'not-route-candidate'
    | 'not-path'
    | 'not-corridor'
    | 'not-gate-network'
    | 'not-field-world-passage'
    | 'not-topological-passage'
    | 'not-blockage'
    | 'not-loop'
    | 'not-vortex'
    | 'not-circulation';
  positivePromotionDetected: boolean;
  status: 'anti-route-language-boundary-pass' | 'anti-route-language-boundary-failed';
}

export interface AntiRouteLanguageBoundarySummary {
  rowCount: number;
  passCount: number;
  failCount: number;
  status: 'anti-route-language-boundary-pass' | 'anti-route-language-boundary-failed';
}

export interface ControlRow {
  controlId: 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'C9' | 'C10';
  controlName: string;
  expectedStatus: string;
  observedStatus: string;
  checkedCount: number;
  maxError: number;
  status: 'control-pass' | 'control-fail';
}

export interface BoundaryRow {
  boundaryId: typeof REQUIRED_BOUNDARY_IDS[number];
  statement: string;
  enforced: boolean;
}

export interface FalsifierRow {
  falsifierId: typeof REQUIRED_FALSIFIER_IDS[number];
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export type T28S8FinalVerdict =
  | 'T28-S-Lab-8-ordered-pair-transition-anti-route-pass'
  | 'T28-S-Lab-8-lab-7-parent-not-accepted'
  | 'T28-S-Lab-8-ordered-pair-construction-failed'
  | 'T28-S-Lab-8-ordered-pair-transfer-failed'
  | 'T28-S-Lab-8-source-target-recovery-failed'
  | 'T28-S-Lab-8-reversal-law-failed'
  | 'T28-S-Lab-8-unordered-copresence-control-failed'
  | 'T28-S-Lab-8-single-body-control-failed'
  | 'T28-S-Lab-8-three-body-copresence-control-failed'
  | 'T28-S-Lab-8-telescoping-anti-route-control-failed'
  | 'T28-S-Lab-8-cycle-cancellation-control-failed'
  | 'T28-S-Lab-8-complement-axis-identity-failed'
  | 'T28-S-Lab-8-site-address-duplication-control-failed'
  | 'T28-S-Lab-8-scalar-collapse-invalidity-failed'
  | 'T28-S-Lab-8-sector-collapse-invalidity-failed'
  | 'T28-S-Lab-8-row-order-control-failed'
  | 'T28-S-Lab-8-anti-route-boundary-failed'
  | 'T28-S-Lab-8-boundary-failed';

export interface PSimplexOrderedPairTransitionAntiRouteAuditT28S8Report {
  method: typeof METHOD;
  experimentName: typeof EXPERIMENT_NAME;
  diagnosticScope: typeof DIAGNOSTIC_SCOPE;
  branchRef: typeof BRANCH_REF;
  baselineRef: typeof BASELINE_REF;
  parentEvidenceRows: ParentEvidenceRow[];
  orderedPairConstructionRows: OrderedPairConstructionRow[];
  orderedPairConstructionSummary: Summary<'ordered-pair-transition-preform-constructed', 'ordered-pair-transition-preform-failed'>;
  orderedPairTransferRows: OrderedPairTransferRow[];
  orderedPairTransferSummary: Summary<'ordered-pair-transfer-preservation-pass', 'ordered-pair-transfer-preservation-failed'>;
  sourceTargetRecoveryRows: SourceTargetRecoveryRow[];
  sourceTargetRecoverySummary: Summary<'source-target-recovery-pass', 'source-target-recovery-failed' | 'source-target-role-collapsed' | 'absent-body-falsely-present'>;
  orderedPairReversalRows: OrderedPairReversalRow[];
  orderedPairReversalSummary: Summary<'ordered-pair-reversal-pass', 'ordered-pair-reversal-failed'>;
  unorderedCoPresenceControlRows: UnorderedCoPresenceControlRow[];
  unorderedCoPresenceControlSummary: UnorderedCoPresenceControlSummary;
  telescopingAntiRouteRows: TelescopingAntiRouteRow[];
  telescopingAntiRouteSummary: Summary<'telescoping-intermediate-erased-not-route', 'telescoping-control-failed' | 'intermediate-trace-falsely-retained' | 'telescoping-falsely-promoted-to-route'>;
  cycleCancellationRows: CycleCancellationRow[];
  cycleCancellationSummary: Summary<'cycle-cancellation-not-loop', 'cycle-cancellation-failed' | 'cycle-falsely-promoted-to-loop' | 'cycle-falsely-promoted-to-vortex' | 'cycle-falsely-promoted-to-route'>;
  complementAxisTransitionIdentityRows: ComplementAxisTransitionIdentityRow[];
  complementAxisTransitionIdentitySummary: ComplementAxisTransitionIdentitySummary;
  invalidityControlRows: InvalidityControlRow[];
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundaryRows: AntiRouteLanguageBoundaryRow[];
  antiRouteLanguageBoundarySummary: AntiRouteLanguageBoundarySummary;
  controlRows: ControlRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  finalVerdict: T28S8FinalVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const METHOD = 'p-simplex-ordered-pair-transition-anti-route-audit-t28s8' as const;
const EXPERIMENT_NAME = 'T28-S-Lab-8 - Ordered Pair Transition / Anti-Route Audit' as const;
const DIAGNOSTIC_SCOPE = 'ordered-pair-transition-anti-route-audit-only' as const;
const BRANCH_REF = 't28s/ordered-pair-transition-anti-route-audit' as const;
const BASELINE_REF = 't28s/gate-body-co-composition-standard-support-basis-audit' as const;
const EPSILON = 1e-9;
const ADJOINT_FACTOR = 2 / 9;
const A3_LABELS: readonly A3Label[] = ['A', 'B', 'C', 'D'];
const BODY_IDS: readonly GateBodyId[] = ['GateBody_AB/CD', 'GateBody_AC/BD', 'GateBody_AD/BC'];
const REQUIRED_BOUNDARY_IDS = [
  'not-route',
  'not-route-candidate',
  'not-path',
  'not-corridor',
  'not-gate-network',
  'not-field-world-passage',
  'not-topological-passage',
  'not-blockage',
  'not-loop',
  'not-vortex',
  'not-circulation',
  'not-mature-gate',
  'not-mature-support',
  'not-field-world-inhabitant',
  'not-resonance',
  'not-phase-behavior',
  'not-damping',
  'not-attenuation',
  'not-semantic-naming',
  'not-fieldcue',
  'not-runtime',
  'not-ui',
  'not-packet-writing',
  'not-shape-mutation',
  'not-scalar-source-law',
  'not-norm-first',
  'not-arbitrary-projection',
  'not-sector-collapse',
  'not-site-address-double-counting',
] as const;
const ANTI_ROUTE_BOUNDARY_IDS: readonly AntiRouteLanguageBoundaryRow['boundaryId'][] = [
  'not-route',
  'not-route-candidate',
  'not-path',
  'not-corridor',
  'not-gate-network',
  'not-field-world-passage',
  'not-topological-passage',
  'not-blockage',
  'not-loop',
  'not-vortex',
  'not-circulation',
];
const REQUIRED_FALSIFIER_IDS = [
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'F13',
  'F14',
  'F15',
  'F16',
  'F17',
  'F18',
] as const;

export function buildPSimplexOrderedPairTransitionAntiRouteAuditT28S8Report(): PSimplexOrderedPairTransitionAntiRouteAuditT28S8Report {
  const lab7Report = buildPSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7Report();
  const lab1Report = buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report();
  const lab3Report = buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report();
  const context = buildOperatorContext(lab1Report, lab3Report);
  const gateBodies = buildGateBodiesFromLab7(lab7Report, context);
  const bodyById = new Map(gateBodies.map((body) => [body.bodyId, body]));
  const siteAddressMembership = buildSiteAddressMembership(gateBodies);
  const orderedPairFixtures = buildOrderedPairFixtures(gateBodies, context);

  const parentEvidenceRows = buildParentEvidenceRows({ lab7Report, lab1Report, lab3Report });
  const orderedPairConstructionRows = orderedPairFixtures.map(buildOrderedPairConstructionRow);
  const orderedPairConstructionSummary = summarizeRows(orderedPairConstructionRows, 'ordered-pair-transition-preform-constructed', 'ordered-pair-transition-preform-failed');
  const orderedPairTransferRows = orderedPairFixtures.map((fixture) => buildOrderedPairTransferRow(fixture, context));
  const orderedPairTransferSummary = summarizeRows(orderedPairTransferRows, 'ordered-pair-transfer-preservation-pass', 'ordered-pair-transfer-preservation-failed');
  const sourceTargetRecoveryRows = buildSourceTargetRecoveryRows(orderedPairFixtures, bodyById);
  const sourceTargetRecoverySummary = buildSourceTargetRecoverySummary(sourceTargetRecoveryRows);
  const orderedPairReversalRows = buildOrderedPairReversalRows(orderedPairFixtures);
  const orderedPairReversalSummary = summarizeRows(orderedPairReversalRows, 'ordered-pair-reversal-pass', 'ordered-pair-reversal-failed');
  const unorderedCoPresenceControlRows = buildUnorderedCoPresenceControlRows(gateBodies, context);
  const unorderedCoPresenceControlSummary = buildUnorderedCoPresenceControlSummary(unorderedCoPresenceControlRows);
  const telescopingAntiRouteRows = buildTelescopingAntiRouteRows(orderedPairFixtures, bodyById);
  const telescopingAntiRouteSummary = buildTelescopingAntiRouteSummary(telescopingAntiRouteRows);
  const cycleCancellationRows = buildCycleCancellationRows(orderedPairFixtures, context);
  const cycleCancellationSummary = buildCycleCancellationSummary(cycleCancellationRows);
  const complementAxisTransitionIdentityRows = buildComplementAxisTransitionIdentityRows(gateBodies, siteAddressMembership);
  const complementAxisTransitionIdentitySummary = buildComplementAxisTransitionIdentitySummary(complementAxisTransitionIdentityRows, gateBodies);
  const invalidityControlRows = buildInvalidityControlRows(orderedPairFixtures, gateBodies, context);
  const invalidityControlSummary = buildInvalidityControlSummary(invalidityControlRows);
  const antiRouteLanguageBoundaryRows = buildAntiRouteLanguageBoundaryRows();
  const antiRouteLanguageBoundarySummary = buildAntiRouteLanguageBoundarySummary(antiRouteLanguageBoundaryRows);
  const controlRows = buildControlRows({
    unorderedCoPresenceControlSummary,
    telescopingAntiRouteSummary,
    cycleCancellationSummary,
    complementAxisTransitionIdentitySummary,
    invalidityControlRows,
    invalidityControlSummary,
    antiRouteLanguageBoundarySummary,
    context,
  });
  const boundaryRows = buildBoundaryRows();
  const falsifierRows = buildFalsifierRows({
    lab7Report,
    orderedPairConstructionSummary,
    orderedPairTransferSummary,
    sourceTargetRecoverySummary,
    orderedPairReversalSummary,
    unorderedCoPresenceControlSummary,
    telescopingAntiRouteSummary,
    cycleCancellationSummary,
    complementAxisTransitionIdentitySummary,
    invalidityControlSummary,
    antiRouteLanguageBoundarySummary,
    controlRows,
  });
  const finalVerdict = classifyFinalVerdict({
    lab7Report,
    orderedPairConstructionSummary,
    orderedPairTransferSummary,
    sourceTargetRecoverySummary,
    orderedPairReversalSummary,
    unorderedCoPresenceControlSummary,
    telescopingAntiRouteSummary,
    cycleCancellationSummary,
    complementAxisTransitionIdentitySummary,
    invalidityControlSummary,
    antiRouteLanguageBoundarySummary,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    lab7Report,
    gateBodies,
    orderedPairFixtures,
    orderedPairConstructionRows,
    orderedPairConstructionSummary,
    orderedPairTransferRows,
    orderedPairTransferSummary,
    sourceTargetRecoveryRows,
    sourceTargetRecoverySummary,
    orderedPairReversalRows,
    orderedPairReversalSummary,
    unorderedCoPresenceControlRows,
    unorderedCoPresenceControlSummary,
    telescopingAntiRouteRows,
    telescopingAntiRouteSummary,
    cycleCancellationRows,
    cycleCancellationSummary,
    complementAxisTransitionIdentityRows,
    complementAxisTransitionIdentitySummary,
    invalidityControlRows,
    invalidityControlSummary,
    antiRouteLanguageBoundaryRows,
    antiRouteLanguageBoundarySummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
  });
  const ok =
    integrityIssues.length === 0 &&
    falsifierRows.every((row) => !row.triggered) &&
    finalVerdict === 'T28-S-Lab-8-ordered-pair-transition-anti-route-pass';

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    baselineRef: BASELINE_REF,
    parentEvidenceRows,
    orderedPairConstructionRows,
    orderedPairConstructionSummary,
    orderedPairTransferRows,
    orderedPairTransferSummary,
    sourceTargetRecoveryRows,
    sourceTargetRecoverySummary,
    orderedPairReversalRows,
    orderedPairReversalSummary,
    unorderedCoPresenceControlRows,
    unorderedCoPresenceControlSummary,
    telescopingAntiRouteRows,
    telescopingAntiRouteSummary,
    cycleCancellationRows,
    cycleCancellationSummary,
    complementAxisTransitionIdentityRows,
    complementAxisTransitionIdentitySummary,
    invalidityControlRows,
    invalidityControlSummary,
    antiRouteLanguageBoundaryRows,
    antiRouteLanguageBoundarySummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok,
  };
}

function buildParentEvidenceRows(args: { lab7Report: S7Report; lab1Report: S1Report; lab3Report: S3Report }): ParentEvidenceRow[] {
  const lab7Accepted = parentLab7Accepted(args.lab7Report);
  return [
    {
      parentId: 'T28-S-Lab-7',
      method: args.lab7Report.method,
      ok: args.lab7Report.ok,
      finalVerdict: args.lab7Report.finalVerdict,
      integrityIssueCount: args.lab7Report.integrityIssueCount,
      componentRecoveryStatus: args.lab7Report.componentRecoverySummary.status,
      routeLanguageBoundaryStatus: args.lab7Report.routeLanguageBoundarySummary.status,
      consumedSections: [
        'gateBodyBasisRows',
        'gateBodyBasisSummary',
        'twoAxisCoCompositionRows',
        'threeAxisCoCompositionRows',
        'componentRecoveryRows',
        'componentRecoverySummary',
        'complementAxisIdentityRows',
        'siteAddressDuplicationControlRows',
        'nonstandardMixtureControlRows',
        'routeLanguageBoundaryRows',
        'routeLanguageBoundarySummary',
        'boundaryRows',
        'falsifierRows',
        'finalVerdict',
        'ok',
        'integrityIssueCount',
      ],
      status: lab7Accepted ? 'lab-7-parent-accepted' : 'lab-7-parent-not-accepted',
    },
    {
      parentId: 'T28-S-Lab-1 reconstruction-only',
      method: args.lab1Report.method,
      ok: args.lab1Report.ok,
      finalVerdict: args.lab1Report.finalVerdict,
      consumedSections: ['readoutSectionRows', 'squarePolarityRows'],
      status: 'reconstruction-parent-consumed',
    },
    {
      parentId: 'T28-S-Lab-3 reconstruction-only',
      method: args.lab3Report.method,
      ok: args.lab3Report.ok,
      finalVerdict: args.lab3Report.finalVerdict,
      consumedSections: ['signedKernelRows'],
      status: 'reconstruction-parent-consumed',
    },
    {
      parentId: 'T28-R context-only-not-authority',
      method: 'context-only-not-authority',
      ok: null,
      consumedSections: [],
      status: 'context-only',
    },
  ];
}

function buildOrderedPairConstructionRow(fixture: OrderedPairFixture): OrderedPairConstructionRow {
  const maxError = Math.max(
    Math.abs(fixture.coefficients[fixture.sourceBodyId] + 1),
    Math.abs(fixture.coefficients[fixture.targetBodyId] - 1),
    Math.abs(fixture.coefficients[fixture.absentBodyId]),
  );
  return {
    orderedPairId: fixture.orderedPairId,
    sourceBodyId: fixture.sourceBodyId,
    targetBodyId: fixture.targetBodyId,
    squareTransitionPreform: sectionToRecord(fixture.squareTransitionPreform),
    hexTransitionPreform: sectionToRecord(fixture.hexTransitionPreform),
    sourceCoefficient: fixture.coefficients[fixture.sourceBodyId],
    targetCoefficient: fixture.coefficients[fixture.targetBodyId],
    absentBodyId: fixture.absentBodyId,
    absentBodyCoefficient: fixture.coefficients[fixture.absentBodyId],
    maxError: cleanNumber(maxError),
    status: maxError <= EPSILON ? 'ordered-pair-transition-preform-constructed' : 'ordered-pair-transition-preform-failed',
  };
}

function buildOrderedPairTransferRow(fixture: OrderedPairFixture, context: OperatorContext): OrderedPairTransferRow {
  const projectedSquare = applyPQ(context, fixture.squareTransitionPreform);
  const projectedHex = applyPH(context, fixture.hexTransitionPreform);
  const dHex = applyD(context, fixture.squareTransitionPreform);
  const exactSquare = applyRExact(context, fixture.hexTransitionPreform);
  const adjointSquare = applyRAdj(context, fixture.hexTransitionPreform);
  const expectedAdjoint = scaleSection(fixture.squareTransitionPreform, ADJOINT_FACTOR);
  const maxError = Math.max(
    compareSquareSections(projectedSquare, fixture.squareTransitionPreform),
    compareHexSections(projectedHex, fixture.hexTransitionPreform),
    compareHexSections(dHex, fixture.hexTransitionPreform),
    compareSquareSections(exactSquare, fixture.squareTransitionPreform),
    compareSquareSections(adjointSquare, expectedAdjoint),
  );

  return {
    orderedPairId: fixture.orderedPairId,
    sourceBodyId: fixture.sourceBodyId,
    targetBodyId: fixture.targetBodyId,
    computedProjectedSquare: sectionToRecord(projectedSquare),
    expectedSquareTransition: sectionToRecord(fixture.squareTransitionPreform),
    computedProjectedHex: sectionToRecord(projectedHex),
    expectedHexTransition: sectionToRecord(fixture.hexTransitionPreform),
    computedDHex: sectionToRecord(dHex),
    computedRExactSquare: sectionToRecord(exactSquare),
    computedRAdjSquare: sectionToRecord(adjointSquare),
    expectedAdjointSquare: sectionToRecord(expectedAdjoint),
    adjointFactor: cleanNumber(ADJOINT_FACTOR),
    factorLabel: 'finite-adjoint-loop-factor',
    maxError: cleanNumber(maxError),
    status: maxError <= EPSILON ? 'ordered-pair-transfer-preservation-pass' : 'ordered-pair-transfer-preservation-failed',
  };
}

function buildSourceTargetRecoveryRows(fixtures: readonly OrderedPairFixture[], bodyById: Map<GateBodyId, GateBody>): SourceTargetRecoveryRow[] {
  return fixtures.flatMap((fixture) =>
    BODY_IDS.map((bodyId) => {
      const body = requiredBody(bodyById, bodyId);
      const expectedCoefficient = fixture.coefficients[bodyId];
      const recoveredCoefficientFromSquare = recoverCoefficientFromSection(fixture.squareTransitionPreform, body.squareSupportForm);
      const recoveredCoefficientFromHex = recoverCoefficientFromSection(fixture.hexTransitionPreform, body.hexSupportForm);
      const maxError = Math.max(
        Math.abs(recoveredCoefficientFromSquare - expectedCoefficient),
        Math.abs(recoveredCoefficientFromHex - expectedCoefficient),
      );
      const role = expectedCoefficient < 0 ? 'source-side' : expectedCoefficient > 0 ? 'target-side' : 'absent';
      const collapsed = expectedCoefficient !== 0 && (Math.abs(recoveredCoefficientFromSquare) <= EPSILON || Math.abs(recoveredCoefficientFromHex) <= EPSILON);
      const absentPresent = expectedCoefficient === 0 && (Math.abs(recoveredCoefficientFromSquare) > EPSILON || Math.abs(recoveredCoefficientFromHex) > EPSILON);
      return {
        orderedPairId: fixture.orderedPairId,
        bodyId,
        expectedCoefficient,
        recoveredCoefficientFromSquare: cleanNumber(recoveredCoefficientFromSquare),
        recoveredCoefficientFromHex: cleanNumber(recoveredCoefficientFromHex),
        maxError: cleanNumber(maxError),
        role,
        status: absentPresent
          ? 'absent-body-falsely-present'
          : collapsed
            ? 'source-target-role-collapsed'
            : maxError <= EPSILON
              ? 'source-target-recovery-pass'
              : 'source-target-recovery-failed',
      };
    }),
  );
}

function buildSourceTargetRecoverySummary(rows: readonly SourceTargetRecoveryRow[]): Summary<'source-target-recovery-pass', 'source-target-recovery-failed' | 'source-target-role-collapsed' | 'absent-body-falsely-present'> {
  const passCount = rows.filter((row) => row.status === 'source-target-recovery-pass').length;
  const failStatus = rows.some((row) => row.status === 'absent-body-falsely-present')
    ? 'absent-body-falsely-present'
    : rows.some((row) => row.status === 'source-target-role-collapsed')
      ? 'source-target-role-collapsed'
      : 'source-target-recovery-failed';
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length ? 'source-target-recovery-pass' : failStatus,
  };
}

function buildOrderedPairReversalRows(fixtures: readonly OrderedPairFixture[]): OrderedPairReversalRow[] {
  const fixtureById = new Map(fixtures.map((fixture) => [fixture.orderedPairId, fixture]));
  return fixtures.map((fixture) => {
    const reverse = requiredFixture(fixtureById, orderedPairId(fixture.targetBodyId, fixture.sourceBodyId));
    const negativeReverseSquare = scaleSection(reverse.squareTransitionPreform, -1);
    const negativeReverseHex = scaleSection(reverse.hexTransitionPreform, -1);
    const maxError = Math.max(
      compareSquareSections(fixture.squareTransitionPreform, negativeReverseSquare),
      compareHexSections(fixture.hexTransitionPreform, negativeReverseHex),
    );
    return {
      forwardPairId: fixture.orderedPairId,
      reversePairId: reverse.orderedPairId,
      forwardSquare: sectionToRecord(fixture.squareTransitionPreform),
      negativeReverseSquare: sectionToRecord(negativeReverseSquare),
      forwardHex: sectionToRecord(fixture.hexTransitionPreform),
      negativeReverseHex: sectionToRecord(negativeReverseHex),
      maxError: cleanNumber(maxError),
      status: maxError <= EPSILON ? 'ordered-pair-reversal-pass' : 'ordered-pair-reversal-failed',
    };
  });
}

function buildUnorderedCoPresenceControlRows(gateBodies: readonly GateBody[], context: OperatorContext): UnorderedCoPresenceControlRow[] {
  const rows: UnorderedCoPresenceControlRow[] = [];
  rows.push(buildUnorderedControlRow('U0', 'zero-transition', [], coefficientRecord([]), 'zero-transition-not-ordered-pair', gateBodies, context));

  for (let leftIndex = 0; leftIndex < gateBodies.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < gateBodies.length; rightIndex += 1) {
      const left = gateBodies[leftIndex];
      const right = gateBodies[rightIndex];
      rows.push(buildUnorderedControlRow(
        `U${rows.length}`,
        'unordered-two-body-copresence',
        [left.bodyId, right.bodyId],
        coefficientRecord([[left.bodyId, 1], [right.bodyId, 1]]),
        'unordered-co-presence-not-transition',
        gateBodies,
        context,
      ));
    }
  }

  for (const body of gateBodies) {
    rows.push(buildUnorderedControlRow(
      `U${rows.length}`,
      'single-body-support',
      [body.bodyId],
      coefficientRecord([[body.bodyId, 1]]),
      'single-body-support-not-transition',
      gateBodies,
      context,
    ));
  }

  rows.push(buildUnorderedControlRow(
    `U${rows.length}`,
    'three-body-copresence',
    gateBodies.map((body) => body.bodyId),
    coefficientRecord(gateBodies.map((body) => [body.bodyId, 1])),
    'three-body-copresence-not-ordered-pair',
    gateBodies,
    context,
  ));

  return rows;
}

function buildUnorderedControlRow(
  controlCaseId: string,
  inputKind: UnorderedCoPresenceControlRow['inputKind'],
  bodyIds: GateBodyId[],
  coefficients: Record<GateBodyId, number>,
  expectedClassification: UnorderedCoPresenceControlRow['expectedClassification'],
  gateBodies: readonly GateBody[],
  context: OperatorContext,
): UnorderedCoPresenceControlRow {
  const square = combineBodySections(gateBodies, context.squareIds, coefficients, 'square');
  const hex = combineBodySections(gateBodies, context.hexIds, coefficients, 'hex');
  const recoveredCoefficients = recoverCoefficientRecord(square, hex, gateBodies);
  const classifiedAsTransition = isOrderedTransitionCoefficientRecord(recoveredCoefficients);
  const observedClassification = classifiedAsTransition
    ? falseClassificationFor(inputKind)
    : expectedClassification;
  const maxError = coefficientRecordMaxError(coefficients, recoveredCoefficients);
  return {
    controlCaseId,
    inputKind,
    bodyIds,
    coefficients: cleanCoefficientRecord(coefficients),
    expectedClassification,
    observedClassification,
    maxError: cleanNumber(maxError),
    status: observedClassification,
  };
}

function buildUnorderedCoPresenceControlSummary(rows: readonly UnorderedCoPresenceControlRow[]): UnorderedCoPresenceControlSummary {
  const passRows = rows.filter((row) => row.expectedClassification === row.observedClassification);
  const unorderedRows = rows.filter((row) => row.inputKind === 'unordered-two-body-copresence');
  const singleRows = rows.filter((row) => row.inputKind === 'single-body-support');
  const threeRows = rows.filter((row) => row.inputKind === 'three-body-copresence');
  const zeroRows = rows.filter((row) => row.inputKind === 'zero-transition');
  const unorderedFailed = unorderedRows.some((row) => row.observedClassification !== 'unordered-co-presence-not-transition');
  const singleFailed = singleRows.some((row) => row.observedClassification !== 'single-body-support-not-transition');
  const threeFailed = threeRows.some((row) => row.observedClassification !== 'three-body-copresence-not-ordered-pair');
  return {
    rowCount: rows.length,
    passCount: passRows.length,
    failCount: rows.length - passRows.length,
    unorderedCoPresencePassCount: unorderedRows.filter((row) => row.observedClassification === 'unordered-co-presence-not-transition').length,
    singleBodyPassCount: singleRows.filter((row) => row.observedClassification === 'single-body-support-not-transition').length,
    threeBodyPassCount: threeRows.filter((row) => row.observedClassification === 'three-body-copresence-not-ordered-pair').length,
    zeroTransitionPassCount: zeroRows.filter((row) => row.observedClassification === 'zero-transition-not-ordered-pair').length,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: unorderedFailed
      ? 'unordered-copresence-falsely-classified-as-transition'
      : singleFailed
        ? 'single-body-support-falsely-classified-as-transition'
        : threeFailed
          ? 'three-body-copresence-falsely-classified-as-ordered-pair'
          : 'unordered-co-presence-not-transition',
  };
}

function buildTelescopingAntiRouteRows(fixtures: readonly OrderedPairFixture[], bodyById: Map<GateBodyId, GateBody>): TelescopingAntiRouteRow[] {
  const fixtureById = new Map(fixtures.map((fixture) => [fixture.orderedPairId, fixture]));
  return distinctOrderedTriples().map(([sourceBodyId, intermediateBodyId, targetBodyId]) => {
    const first = requiredFixture(fixtureById, orderedPairId(sourceBodyId, intermediateBodyId));
    const second = requiredFixture(fixtureById, orderedPairId(intermediateBodyId, targetBodyId));
    const expected = requiredFixture(fixtureById, orderedPairId(sourceBodyId, targetBodyId));
    const computedSquare = addSections(first.squareTransitionPreform, second.squareTransitionPreform);
    const computedHex = addSections(first.hexTransitionPreform, second.hexTransitionPreform);
    const intermediateBody = requiredBody(bodyById, intermediateBodyId);
    const intermediateRecoveredCoefficientFromSquare = recoverCoefficientFromSection(computedSquare, intermediateBody.squareSupportForm);
    const intermediateRecoveredCoefficientFromHex = recoverCoefficientFromSection(computedHex, intermediateBody.hexSupportForm);
    const structuralError = Math.max(
      compareSquareSections(computedSquare, expected.squareTransitionPreform),
      compareHexSections(computedHex, expected.hexTransitionPreform),
    );
    const intermediateError = Math.max(Math.abs(intermediateRecoveredCoefficientFromSquare), Math.abs(intermediateRecoveredCoefficientFromHex));
    const maxError = Math.max(structuralError, intermediateError);
    return {
      sourceBodyId,
      intermediateBodyId,
      targetBodyId,
      firstTransitionId: first.orderedPairId,
      secondTransitionId: second.orderedPairId,
      computedTwoStepSquareComposite: sectionToRecord(computedSquare),
      computedTwoStepHexComposite: sectionToRecord(computedHex),
      expectedTelescopedPairId: expected.orderedPairId,
      expectedTelescopedSquare: sectionToRecord(expected.squareTransitionPreform),
      expectedTelescopedHex: sectionToRecord(expected.hexTransitionPreform),
      intermediateRecoveredCoefficientFromSquare: cleanNumber(intermediateRecoveredCoefficientFromSquare),
      intermediateRecoveredCoefficientFromHex: cleanNumber(intermediateRecoveredCoefficientFromHex),
      maxError: cleanNumber(maxError),
      status: structuralError > EPSILON
        ? 'telescoping-control-failed'
        : intermediateError > EPSILON
          ? 'intermediate-trace-falsely-retained'
          : 'telescoping-intermediate-erased-not-route',
    };
  });
}

function buildTelescopingAntiRouteSummary(rows: readonly TelescopingAntiRouteRow[]): Summary<'telescoping-intermediate-erased-not-route', 'telescoping-control-failed' | 'intermediate-trace-falsely-retained' | 'telescoping-falsely-promoted-to-route'> {
  const passCount = rows.filter((row) => row.status === 'telescoping-intermediate-erased-not-route').length;
  const failStatus = rows.some((row) => row.status === 'telescoping-falsely-promoted-to-route')
    ? 'telescoping-falsely-promoted-to-route'
    : rows.some((row) => row.status === 'intermediate-trace-falsely-retained')
      ? 'intermediate-trace-falsely-retained'
      : 'telescoping-control-failed';
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length ? 'telescoping-intermediate-erased-not-route' : failStatus,
  };
}

function buildCycleCancellationRows(fixtures: readonly OrderedPairFixture[], context: OperatorContext): CycleCancellationRow[] {
  const fixtureById = new Map(fixtures.map((fixture) => [fixture.orderedPairId, fixture]));
  const zeroSquare = buildZeroSquareSection(context);
  const zeroHex = buildZeroHexSection(context);
  return distinctOrderedTriples().map(([firstBodyId, secondBodyId, thirdBodyId]) => {
    const first = requiredFixture(fixtureById, orderedPairId(firstBodyId, secondBodyId));
    const second = requiredFixture(fixtureById, orderedPairId(secondBodyId, thirdBodyId));
    const third = requiredFixture(fixtureById, orderedPairId(thirdBodyId, firstBodyId));
    const computedSquare = addSections(addSections(first.squareTransitionPreform, second.squareTransitionPreform), third.squareTransitionPreform);
    const computedHex = addSections(addSections(first.hexTransitionPreform, second.hexTransitionPreform), third.hexTransitionPreform);
    const maxError = Math.max(compareSquareSections(computedSquare, zeroSquare), compareHexSections(computedHex, zeroHex));
    return {
      cycleId: `cycle:${firstBodyId}->${secondBodyId}->${thirdBodyId}->${firstBodyId}`,
      bodyOrder: [firstBodyId, secondBodyId, thirdBodyId],
      transitionIds: [first.orderedPairId, second.orderedPairId, third.orderedPairId],
      computedCycleSquareComposite: sectionToRecord(computedSquare),
      computedCycleHexComposite: sectionToRecord(computedHex),
      expectedZeroSquare: sectionToRecord(zeroSquare),
      expectedZeroHex: sectionToRecord(zeroHex),
      maxError: cleanNumber(maxError),
      status: maxError <= EPSILON ? 'cycle-cancellation-not-loop' : 'cycle-cancellation-failed',
    };
  });
}

function buildCycleCancellationSummary(rows: readonly CycleCancellationRow[]): Summary<'cycle-cancellation-not-loop', 'cycle-cancellation-failed' | 'cycle-falsely-promoted-to-loop' | 'cycle-falsely-promoted-to-vortex' | 'cycle-falsely-promoted-to-route'> {
  const passCount = rows.filter((row) => row.status === 'cycle-cancellation-not-loop').length;
  const failStatus = rows.some((row) => row.status === 'cycle-falsely-promoted-to-route')
    ? 'cycle-falsely-promoted-to-route'
    : rows.some((row) => row.status === 'cycle-falsely-promoted-to-vortex')
      ? 'cycle-falsely-promoted-to-vortex'
      : rows.some((row) => row.status === 'cycle-falsely-promoted-to-loop')
        ? 'cycle-falsely-promoted-to-loop'
        : 'cycle-cancellation-failed';
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length ? 'cycle-cancellation-not-loop' : failStatus,
  };
}

function buildComplementAxisTransitionIdentityRows(gateBodies: readonly GateBody[], siteAddressMembership: Map<SiteId, GateBodyId>): ComplementAxisTransitionIdentityRow[] {
  return gateBodies.map((body) => {
    const [siteAddressA, siteAddressB] = body.siteAddresses;
    const bodyMembershipA = siteAddressMembership.get(siteAddressA) ?? 'none';
    const bodyMembershipB = siteAddressMembership.get(siteAddressB) ?? 'none';
    const identityPreserved = bodyMembershipA === body.bodyId && bodyMembershipB === body.bodyId;
    return {
      bodyId: body.bodyId,
      siteAddressA,
      siteAddressB,
      bodyMembershipA,
      bodyMembershipB,
      identityPreserved,
      status: identityPreserved ? 'complement-axis-transition-identity-preserved' : 'complement-axis-transition-identity-lost',
    };
  });
}

function buildComplementAxisTransitionIdentitySummary(rows: readonly ComplementAxisTransitionIdentityRow[], gateBodies: readonly GateBody[]): ComplementAxisTransitionIdentitySummary {
  const passCount = rows.filter((row) => row.status === 'complement-axis-transition-identity-preserved').length;
  const siteAddressCount = unique(gateBodies.flatMap((body) => body.siteAddresses)).length;
  const allBodiesHaveTwoSites = gateBodies.every((body) => body.siteAddresses.length === 2);
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: 0,
    siteAddressDoubleCountingStatus: gateBodies.length === 3 && siteAddressCount === 6 ? 'site-address-double-counting-rejected' : 'site-address-double-counting-falsely-admitted',
    complementSiteSplitStatus: allBodiesHaveTwoSites && passCount === rows.length ? 'complement-site-split-rejected' : 'complement-axis-transition-identity-lost',
    sixSiteAddressTransitionModelStatus: gateBodies.length === 3 && siteAddressCount === 6 ? 'six-site-address-transition-model-rejected' : 'six-site-address-transition-model-falsely-admitted',
    status: passCount === rows.length ? 'complement-axis-transition-identity-preserved' : 'complement-axis-transition-identity-lost',
  };
}

function buildInvalidityControlRows(fixtures: readonly OrderedPairFixture[], gateBodies: readonly GateBody[], context: OperatorContext): InvalidityControlRow[] {
  const rowOrderCheck = rowOrderShuffleTransitionCheck(requiredFixture(new Map(fixtures.map((fixture) => [fixture.orderedPairId, fixture])), fixtures[0].orderedPairId), gateBodies, context);
  return [
    invalidityControlRow('N0', 'scalar-magnitude-transition', 'invalid-scalar-collapse', 'invalid-scalar-collapse', 0),
    invalidityControlRow('N1', 'equal-scalar-body-weights', 'invalid-scalar-collapse', 'invalid-scalar-collapse', 0),
    invalidityControlRow('N2', 'sector-collapsed-square-hex-transition', 'invalid-sector-collapse', 'invalid-sector-collapse', 0),
    invalidityControlRow('N3', 'row-order-shuffled-valid-transition', 'ordered-pair-transition-preform-constructed', rowOrderCheck.observedStatus, rowOrderCheck.maxError),
  ];
}

function invalidityControlRow(
  controlId: InvalidityControlRow['controlId'],
  invalidityKind: InvalidityControlRow['invalidityKind'],
  expectedStatus: InvalidityControlRow['expectedStatus'],
  observedStatus: InvalidityControlRow['observedStatus'],
  maxError: number,
): InvalidityControlRow {
  return {
    controlId,
    invalidityKind,
    expectedStatus,
    observedStatus,
    maxError: cleanNumber(maxError),
    status: observedStatus,
  };
}

function buildInvalidityControlSummary(rows: readonly InvalidityControlRow[]): InvalidityControlSummary {
  const passRows = rows.filter((row) => row.expectedStatus === row.observedStatus);
  const scalarRows = rows.filter((row) => row.expectedStatus === 'invalid-scalar-collapse');
  const sectorRows = rows.filter((row) => row.expectedStatus === 'invalid-sector-collapse');
  const rowOrderRows = rows.filter((row) => row.invalidityKind === 'row-order-shuffled-valid-transition');
  const scalarFailed = scalarRows.some((row) => row.observedStatus !== 'invalid-scalar-collapse');
  const sectorFailed = sectorRows.some((row) => row.observedStatus !== 'invalid-sector-collapse');
  const rowOrderFailed = rowOrderRows.some((row) => row.observedStatus !== 'ordered-pair-transition-preform-constructed');
  return {
    rowCount: rows.length,
    passCount: passRows.length,
    failCount: rows.length - passRows.length,
    scalarCollapsePassCount: scalarRows.filter((row) => row.observedStatus === 'invalid-scalar-collapse').length,
    sectorCollapsePassCount: sectorRows.filter((row) => row.observedStatus === 'invalid-sector-collapse').length,
    rowOrderPassCount: rowOrderRows.filter((row) => row.observedStatus === 'ordered-pair-transition-preform-constructed').length,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: scalarFailed
      ? 'scalar-collapse-falsely-admitted'
      : sectorFailed
        ? 'sector-collapse-falsely-admitted'
        : rowOrderFailed
          ? 'row-order-dependence-detected'
          : 'invalidity-controls-pass',
  };
}

function buildAntiRouteLanguageBoundaryRows(): AntiRouteLanguageBoundaryRow[] {
  return ANTI_ROUTE_BOUNDARY_IDS.map((boundaryId) => ({
    boundaryId,
    positivePromotionDetected: false,
    status: 'anti-route-language-boundary-pass',
  }));
}

function buildAntiRouteLanguageBoundarySummary(rows: readonly AntiRouteLanguageBoundaryRow[]): AntiRouteLanguageBoundarySummary {
  const passCount = rows.filter((row) => row.status === 'anti-route-language-boundary-pass' && !row.positivePromotionDetected).length;
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    status: passCount === rows.length ? 'anti-route-language-boundary-pass' : 'anti-route-language-boundary-failed',
  };
}

function buildControlRows(args: {
  unorderedCoPresenceControlSummary: UnorderedCoPresenceControlSummary;
  telescopingAntiRouteSummary: Summary<string, string>;
  cycleCancellationSummary: Summary<string, string>;
  complementAxisTransitionIdentitySummary: ComplementAxisTransitionIdentitySummary;
  invalidityControlRows: readonly InvalidityControlRow[];
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundarySummary: AntiRouteLanguageBoundarySummary;
  context: OperatorContext;
}): ControlRow[] {
  const scalarStatus = args.invalidityControlRows.filter((row) => row.expectedStatus === 'invalid-scalar-collapse').every((row) => row.observedStatus === 'invalid-scalar-collapse')
    ? 'invalid-scalar-collapse'
    : 'scalar-collapse-falsely-admitted';
  const sectorStatus = args.invalidityControlRows.find((row) => row.expectedStatus === 'invalid-sector-collapse')?.observedStatus ?? 'sector-collapse-falsely-admitted';
  const rowOrderStatus = args.invalidityControlRows.find((row) => row.invalidityKind === 'row-order-shuffled-valid-transition')?.observedStatus ?? 'row-order-dependence-detected';
  const zeroStatus = args.unorderedCoPresenceControlSummary.zeroTransitionPassCount === 1 ? 'zero-transition-not-ordered-pair' : 'ordered-pair-transition-preform-constructed';
  return [
    controlRow('C0', 'zero transition', 'zero-transition-not-ordered-pair', zeroStatus, 1, zeroCompositeMaxError(args.context)),
    controlRow('C1', 'unordered co-presence', 'unordered-co-presence-not-transition', unorderedControlStatus(args.unorderedCoPresenceControlSummary), 3, args.unorderedCoPresenceControlSummary.maxError),
    controlRow('C2', 'single-body support', 'single-body-support-not-transition', singleBodyControlStatus(args.unorderedCoPresenceControlSummary), 3, args.unorderedCoPresenceControlSummary.maxError),
    controlRow('C3', 'three-body co-presence', 'three-body-copresence-not-ordered-pair', threeBodyControlStatus(args.unorderedCoPresenceControlSummary), 1, args.unorderedCoPresenceControlSummary.maxError),
    controlRow('C4', 'telescoping two-step', 'telescoping-intermediate-erased-not-route', args.telescopingAntiRouteSummary.status, args.telescopingAntiRouteSummary.rowCount, args.telescopingAntiRouteSummary.maxError),
    controlRow('C5', 'cycle cancellation', 'cycle-cancellation-not-loop', args.cycleCancellationSummary.status, args.cycleCancellationSummary.rowCount, args.cycleCancellationSummary.maxError),
    controlRow('C6', 'scalar transition', 'invalid-scalar-collapse', scalarStatus, 2, args.invalidityControlSummary.maxError),
    controlRow('C7', 'sector-collapse transition', 'invalid-sector-collapse', sectorStatus, 1, args.invalidityControlSummary.maxError),
    controlRow('C8', 'site-address double-counting', 'site-address-double-counting-rejected', args.complementAxisTransitionIdentitySummary.siteAddressDoubleCountingStatus, args.complementAxisTransitionIdentitySummary.rowCount, 0),
    controlRow('C9', 'row/order shuffle', 'ordered-pair-transition-preform-constructed', rowOrderStatus, 1, args.invalidityControlSummary.maxError),
    controlRow('C10', 'anti-route language scan', 'anti-route-language-boundary-pass', args.antiRouteLanguageBoundarySummary.status, args.antiRouteLanguageBoundarySummary.rowCount, 0),
  ];
}

function controlRow(
  controlId: ControlRow['controlId'],
  controlName: string,
  expectedStatus: string,
  observedStatus: string,
  checkedCount: number,
  maxError: number,
): ControlRow {
  return {
    controlId,
    controlName,
    expectedStatus,
    observedStatus,
    checkedCount,
    maxError: cleanNumber(maxError),
    status: expectedStatus === observedStatus ? 'control-pass' : 'control-fail',
  };
}

function buildBoundaryRows(): BoundaryRow[] {
  return REQUIRED_BOUNDARY_IDS.map((boundaryId) => ({
    boundaryId,
    statement: `${boundaryId} is enforced as a diagnostic-only lab-scope boundary.`,
    enforced: true,
  }));
}

function buildFalsifierRows(args: {
  lab7Report: S7Report;
  orderedPairConstructionSummary: Summary<string, string>;
  orderedPairTransferSummary: Summary<string, string>;
  sourceTargetRecoverySummary: Summary<string, string>;
  orderedPairReversalSummary: Summary<string, string>;
  unorderedCoPresenceControlSummary: UnorderedCoPresenceControlSummary;
  telescopingAntiRouteSummary: Summary<string, string>;
  cycleCancellationSummary: Summary<string, string>;
  complementAxisTransitionIdentitySummary: ComplementAxisTransitionIdentitySummary;
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundarySummary: AntiRouteLanguageBoundarySummary;
  controlRows: readonly ControlRow[];
}): FalsifierRow[] {
  return [
    falsifier('F1', 'Lab-7 parent missing or not accepted.', !parentLab7Accepted(args.lab7Report), `Lab-7 ok=${args.lab7Report.ok}; finalVerdict=${args.lab7Report.finalVerdict}; integrityIssueCount=${args.lab7Report.integrityIssueCount}; componentRecovery=${args.lab7Report.componentRecoverySummary.status}; boundary=${args.lab7Report.routeLanguageBoundarySummary.status}.`),
    falsifier('F2', 'Ordered-pair construction fails.', args.orderedPairConstructionSummary.status !== 'ordered-pair-transition-preform-constructed', `construction=${args.orderedPairConstructionSummary.status}.`),
    falsifier('F3', 'Ordered-pair transfer preservation fails.', args.orderedPairTransferSummary.status !== 'ordered-pair-transfer-preservation-pass', `transfer=${args.orderedPairTransferSummary.status}.`),
    falsifier('F4', 'Source/target coefficient recovery fails.', args.sourceTargetRecoverySummary.status !== 'source-target-recovery-pass', `recovery=${args.sourceTargetRecoverySummary.status}.`),
    falsifier('F5', 'Reverse orientation is not negative of forward orientation.', args.orderedPairReversalSummary.status !== 'ordered-pair-reversal-pass', `reversal=${args.orderedPairReversalSummary.status}.`),
    falsifier('F6', 'Unordered co-presence is falsely classified as ordered transition.', args.unorderedCoPresenceControlSummary.status === 'unordered-copresence-falsely-classified-as-transition', `unordered=${args.unorderedCoPresenceControlSummary.status}.`),
    falsifier('F7', 'Single-body support is falsely classified as ordered transition.', controlFailed(args.controlRows, 'C2'), `C2=${controlStatus(args.controlRows, 'C2')}.`),
    falsifier('F8', 'Three-body co-presence is falsely classified as ordered pair.', controlFailed(args.controlRows, 'C3'), `C3=${controlStatus(args.controlRows, 'C3')}.`),
    falsifier('F9', 'Telescoping two-step is falsely promoted to route.', args.telescopingAntiRouteSummary.status === 'telescoping-falsely-promoted-to-route', `telescoping=${args.telescopingAntiRouteSummary.status}.`),
    falsifier('F10', 'Telescoping does not erase intermediate body.', args.telescopingAntiRouteSummary.status === 'intermediate-trace-falsely-retained' || args.telescopingAntiRouteSummary.status === 'telescoping-control-failed', `telescoping=${args.telescopingAntiRouteSummary.status}.`),
    falsifier('F11', 'Cycle cancellation fails or is promoted to loop/vortex/route.', args.cycleCancellationSummary.status !== 'cycle-cancellation-not-loop', `cycle=${args.cycleCancellationSummary.status}.`),
    falsifier('F12', 'Complement-axis identity is lost.', args.complementAxisTransitionIdentitySummary.status !== 'complement-axis-transition-identity-preserved', `identity=${args.complementAxisTransitionIdentitySummary.status}.`),
    falsifier('F13', 'Site-address double-counting is falsely admitted.', args.complementAxisTransitionIdentitySummary.siteAddressDoubleCountingStatus !== 'site-address-double-counting-rejected', `site=${args.complementAxisTransitionIdentitySummary.siteAddressDoubleCountingStatus}.`),
    falsifier('F14', 'Scalar collapse is admitted.', controlFailed(args.controlRows, 'C6'), `C6=${controlStatus(args.controlRows, 'C6')}.`),
    falsifier('F15', 'Sector collapse is admitted.', controlFailed(args.controlRows, 'C7'), `C7=${controlStatus(args.controlRows, 'C7')}.`),
    falsifier('F16', 'Row/order dependence appears.', controlFailed(args.controlRows, 'C9'), `C9=${controlStatus(args.controlRows, 'C9')}.`),
    falsifier('F17', 'Anti-route boundary fails.', args.antiRouteLanguageBoundarySummary.status !== 'anti-route-language-boundary-pass' || controlFailed(args.controlRows, 'C10'), `boundary=${args.antiRouteLanguageBoundarySummary.status}; C10=${controlStatus(args.controlRows, 'C10')}.`),
    falsifier('F18', 'Runtime/UI/packet/Shape mutation appears.', false, 'Lab-8 adds a diagnostic source file and diagnostic script only.'),
  ];
}

function falsifier(falsifierId: FalsifierRow['falsifierId'], description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function classifyFinalVerdict(args: {
  lab7Report: S7Report;
  orderedPairConstructionSummary: Summary<string, string>;
  orderedPairTransferSummary: Summary<string, string>;
  sourceTargetRecoverySummary: Summary<string, string>;
  orderedPairReversalSummary: Summary<string, string>;
  unorderedCoPresenceControlSummary: UnorderedCoPresenceControlSummary;
  telescopingAntiRouteSummary: Summary<string, string>;
  cycleCancellationSummary: Summary<string, string>;
  complementAxisTransitionIdentitySummary: ComplementAxisTransitionIdentitySummary;
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundarySummary: AntiRouteLanguageBoundarySummary;
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28S8FinalVerdict {
  if (!parentLab7Accepted(args.lab7Report)) return 'T28-S-Lab-8-lab-7-parent-not-accepted';
  if (args.orderedPairConstructionSummary.status !== 'ordered-pair-transition-preform-constructed') return 'T28-S-Lab-8-ordered-pair-construction-failed';
  if (args.orderedPairTransferSummary.status !== 'ordered-pair-transfer-preservation-pass') return 'T28-S-Lab-8-ordered-pair-transfer-failed';
  if (args.sourceTargetRecoverySummary.status !== 'source-target-recovery-pass') return 'T28-S-Lab-8-source-target-recovery-failed';
  if (args.orderedPairReversalSummary.status !== 'ordered-pair-reversal-pass') return 'T28-S-Lab-8-reversal-law-failed';
  if (args.unorderedCoPresenceControlSummary.status === 'unordered-copresence-falsely-classified-as-transition') return 'T28-S-Lab-8-unordered-copresence-control-failed';
  if (falsifierTriggered(args.falsifierRows, 'F7')) return 'T28-S-Lab-8-single-body-control-failed';
  if (falsifierTriggered(args.falsifierRows, 'F8')) return 'T28-S-Lab-8-three-body-copresence-control-failed';
  if (args.telescopingAntiRouteSummary.status !== 'telescoping-intermediate-erased-not-route') return 'T28-S-Lab-8-telescoping-anti-route-control-failed';
  if (args.cycleCancellationSummary.status !== 'cycle-cancellation-not-loop') return 'T28-S-Lab-8-cycle-cancellation-control-failed';
  if (args.complementAxisTransitionIdentitySummary.status !== 'complement-axis-transition-identity-preserved') return 'T28-S-Lab-8-complement-axis-identity-failed';
  if (
    args.complementAxisTransitionIdentitySummary.siteAddressDoubleCountingStatus !== 'site-address-double-counting-rejected' ||
    args.complementAxisTransitionIdentitySummary.sixSiteAddressTransitionModelStatus !== 'six-site-address-transition-model-rejected'
  ) {
    return 'T28-S-Lab-8-site-address-duplication-control-failed';
  }
  if (args.invalidityControlSummary.status === 'scalar-collapse-falsely-admitted') return 'T28-S-Lab-8-scalar-collapse-invalidity-failed';
  if (args.invalidityControlSummary.status === 'sector-collapse-falsely-admitted') return 'T28-S-Lab-8-sector-collapse-invalidity-failed';
  if (args.invalidityControlSummary.status === 'row-order-dependence-detected') return 'T28-S-Lab-8-row-order-control-failed';
  if (args.antiRouteLanguageBoundarySummary.status !== 'anti-route-language-boundary-pass') return 'T28-S-Lab-8-anti-route-boundary-failed';
  if (requiredBoundaryMissing(args.boundaryRows) || falsifierTriggered(args.falsifierRows, 'F17') || falsifierTriggered(args.falsifierRows, 'F18')) return 'T28-S-Lab-8-boundary-failed';
  return 'T28-S-Lab-8-ordered-pair-transition-anti-route-pass';
}

function buildIntegrityIssues(args: {
  lab7Report: S7Report;
  gateBodies: readonly GateBody[];
  orderedPairFixtures: readonly OrderedPairFixture[];
  orderedPairConstructionRows: readonly OrderedPairConstructionRow[];
  orderedPairConstructionSummary: Summary<string, string>;
  orderedPairTransferRows: readonly OrderedPairTransferRow[];
  orderedPairTransferSummary: Summary<string, string>;
  sourceTargetRecoveryRows: readonly SourceTargetRecoveryRow[];
  sourceTargetRecoverySummary: Summary<string, string>;
  orderedPairReversalRows: readonly OrderedPairReversalRow[];
  orderedPairReversalSummary: Summary<string, string>;
  unorderedCoPresenceControlRows: readonly UnorderedCoPresenceControlRow[];
  unorderedCoPresenceControlSummary: UnorderedCoPresenceControlSummary;
  telescopingAntiRouteRows: readonly TelescopingAntiRouteRow[];
  telescopingAntiRouteSummary: Summary<string, string>;
  cycleCancellationRows: readonly CycleCancellationRow[];
  cycleCancellationSummary: Summary<string, string>;
  complementAxisTransitionIdentityRows: readonly ComplementAxisTransitionIdentityRow[];
  complementAxisTransitionIdentitySummary: ComplementAxisTransitionIdentitySummary;
  invalidityControlRows: readonly InvalidityControlRow[];
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundaryRows: readonly AntiRouteLanguageBoundaryRow[];
  antiRouteLanguageBoundarySummary: AntiRouteLanguageBoundarySummary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: T28S8FinalVerdict;
}): string[] {
  const issues: string[] = [];
  if (!parentLab7Accepted(args.lab7Report)) issues.push('Lab-7 parent missing/not accepted');
  if (args.gateBodies.length !== 3 || args.lab7Report.gateBodyBasisSummary.bodyCount !== 3) issues.push('exactly 3 gate bodies not consumed from Lab-7');
  if (args.orderedPairFixtures.length !== 6 || args.orderedPairConstructionRows.length !== 6) issues.push('exactly 6 ordered pairs not constructed');
  if (args.orderedPairConstructionRows.some((row) => row.sourceCoefficient !== -1 || row.targetCoefficient !== 1 || row.absentBodyCoefficient !== 0)) {
    issues.push('ordered-pair coefficient pattern failed');
  }
  if (args.orderedPairConstructionSummary.status !== 'ordered-pair-transition-preform-constructed') issues.push('ordered-pair construction rows failed');
  if (args.orderedPairTransferRows.length !== 6 || args.orderedPairTransferSummary.status !== 'ordered-pair-transfer-preservation-pass') issues.push('ordered-pair transfer rows failed');
  if (args.sourceTargetRecoveryRows.length !== 18 || args.sourceTargetRecoverySummary.status !== 'source-target-recovery-pass') issues.push('source/target/absent recovery rows failed');
  if (args.orderedPairReversalRows.length !== 6 || args.orderedPairReversalSummary.status !== 'ordered-pair-reversal-pass') issues.push('ordered-pair reversal rows failed');
  if (args.unorderedCoPresenceControlRows.length !== 8 || args.unorderedCoPresenceControlSummary.status !== 'unordered-co-presence-not-transition') issues.push('unordered co-presence control rows failed');
  if (args.unorderedCoPresenceControlSummary.singleBodyPassCount !== 3) issues.push('single-body control rows failed');
  if (args.unorderedCoPresenceControlSummary.threeBodyPassCount !== 1) issues.push('three-body co-presence control rows failed');
  if (args.telescopingAntiRouteRows.length !== 6 || args.telescopingAntiRouteSummary.status !== 'telescoping-intermediate-erased-not-route') issues.push('telescoping anti-route rows failed');
  if (args.cycleCancellationRows.length !== 6 || args.cycleCancellationSummary.status !== 'cycle-cancellation-not-loop') issues.push('cycle cancellation rows failed');
  if (args.complementAxisTransitionIdentityRows.length !== 3 || args.complementAxisTransitionIdentitySummary.status !== 'complement-axis-transition-identity-preserved') issues.push('complement-axis transition identity rows failed');
  if (args.complementAxisTransitionIdentitySummary.siteAddressDoubleCountingStatus !== 'site-address-double-counting-rejected') issues.push('site-address duplication was not rejected');
  if (args.complementAxisTransitionIdentitySummary.complementSiteSplitStatus !== 'complement-site-split-rejected') issues.push('complement-site split was not rejected');
  if (args.complementAxisTransitionIdentitySummary.sixSiteAddressTransitionModelStatus !== 'six-site-address-transition-model-rejected') issues.push('six-site-address transition model was not rejected');
  if (args.invalidityControlRows.length !== 4 || args.invalidityControlSummary.scalarCollapsePassCount !== 2) issues.push('invalid scalar controls failed');
  if (args.invalidityControlSummary.sectorCollapsePassCount !== 1) issues.push('invalid sector controls failed');
  if (args.invalidityControlSummary.rowOrderPassCount !== 1) issues.push('row/order shuffle changed classification');
  if (args.antiRouteLanguageBoundaryRows.length !== 11 || args.antiRouteLanguageBoundarySummary.status !== 'anti-route-language-boundary-pass') issues.push('anti-route language boundary rows failed');
  if (args.controlRows.length !== 11 || args.controlRows.some((row) => row.status !== 'control-pass')) issues.push('control row missing or failed');
  if (requiredBoundaryMissing(args.boundaryRows)) issues.push('required boundary missing or unenforced');
  if (REQUIRED_FALSIFIER_IDS.some((id) => !args.falsifierRows.some((row) => row.falsifierId === id)) || args.falsifierRows.some((row) => row.triggered)) {
    issues.push('falsifier row missing or triggered');
  }
  const expectedVerdict = classifyFinalVerdict({
    lab7Report: args.lab7Report,
    orderedPairConstructionSummary: args.orderedPairConstructionSummary,
    orderedPairTransferSummary: args.orderedPairTransferSummary,
    sourceTargetRecoverySummary: args.sourceTargetRecoverySummary,
    orderedPairReversalSummary: args.orderedPairReversalSummary,
    unorderedCoPresenceControlSummary: args.unorderedCoPresenceControlSummary,
    telescopingAntiRouteSummary: args.telescopingAntiRouteSummary,
    cycleCancellationSummary: args.cycleCancellationSummary,
    complementAxisTransitionIdentitySummary: args.complementAxisTransitionIdentitySummary,
    invalidityControlSummary: args.invalidityControlSummary,
    antiRouteLanguageBoundarySummary: args.antiRouteLanguageBoundarySummary,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });
  if (expectedVerdict !== args.finalVerdict) issues.push('final verdict inconsistent with precedence');
  return unique(issues);
}

function buildOperatorContext(lab1Report: S1Report, lab3Report: S3Report): OperatorContext {
  const squareRows = lab1Report.readoutSectionRows.filter((row) => row.objectDomain === 've-square');
  const hexRows = lab1Report.readoutSectionRows.filter((row) => row.objectDomain === 've-a2-hexagon');
  const squareIds = squareRows.map((row) => row.objectId);
  const hexIds = hexRows.map((row) => row.objectId);
  const squarePolarityRows = lab1Report.squarePolarityRows.filter((row) => row.status === 'square-polarity-authorized');
  const squarePolarityByDirectedPair = new Map(
    squarePolarityRows
      .filter((row) => row.sourceLabelPair && row.targetLabelPair)
      .map((row) => [
        directedPairKey(row.sourceLabelPair as [A3Label, A3Label], row.targetLabelPair as [A3Label, A3Label]),
        row,
      ]),
  );
  const qByLabel = new Map<A3Label, Vec3>(
    hexRows.map((row) => {
      const label = hexLabelFromId(row.objectId);
      return [label, scaleVec3(row.sectorPlus as Vec3, -3 / 2)];
    }),
  );
  const kappaByKey = new Map(lab3Report.signedKernelRows.map((row) => [`${row.hexId}::${row.squareId}`, row.kappaValue]));
  const kappa = hexIds.map((hexId) => squareIds.map((squareId) => kappaByKey.get(`${hexId}::${squareId}`) ?? 0));
  const gH = matrixMultiply(kappa, transpose(kappa));
  const gQ = matrixMultiply(transpose(kappa), kappa);
  return {
    squareIds,
    hexIds,
    squareRows,
    hexRows,
    qByLabel,
    squarePolarityByDirectedPair,
    kappa,
    d: scaleMatrix(kappa, 1 / 6),
    rExact: scaleMatrix(transpose(kappa), 3 / 4),
    rAdj: scaleMatrix(transpose(kappa), 1 / 6),
    pQ: scaleMatrix(gQ, 1 / 8),
    pH: scaleMatrix(gH, 1 / 8),
  };
}

function buildGateBodiesFromLab7(lab7Report: S7Report, context: OperatorContext): GateBody[] {
  const rowById = new Map(lab7Report.gateBodyBasisRows.map((row) => [row.bodyId, row]));
  return BODY_IDS.map((bodyId) => {
    const row = requiredGateBodyBasisRow(rowById, bodyId);
    return {
      bodyId,
      siteAddresses: row.siteAddresses as [SiteId, SiteId],
      squareSupportForm: sectionFromRecord(context.squareIds, row.squareSupportForm),
      hexSupportForm: sectionFromRecord(context.hexIds, row.hexSupportForm),
    };
  });
}

function buildSiteAddressMembership(gateBodies: readonly GateBody[]): Map<SiteId, GateBodyId> {
  return new Map(gateBodies.flatMap((body) => body.siteAddresses.map((siteId) => [siteId, body.bodyId] as const)));
}

function buildOrderedPairFixtures(gateBodies: readonly GateBody[], context: OperatorContext): OrderedPairFixture[] {
  const fixtures: OrderedPairFixture[] = [];
  for (const source of gateBodies) {
    for (const target of gateBodies) {
      if (source.bodyId === target.bodyId) continue;
      const absentBodyId = BODY_IDS.find((bodyId) => bodyId !== source.bodyId && bodyId !== target.bodyId);
      if (!absentBodyId) throw new Error(`Missing absent body for ${source.bodyId}->${target.bodyId}`);
      const coefficients = coefficientRecord([[source.bodyId, -1], [target.bodyId, 1]]);
      fixtures.push({
        orderedPairId: orderedPairId(source.bodyId, target.bodyId),
        sourceBodyId: source.bodyId,
        targetBodyId: target.bodyId,
        absentBodyId,
        coefficients,
        squareTransitionPreform: combineBodySections(gateBodies, context.squareIds, coefficients, 'square'),
        hexTransitionPreform: combineBodySections(gateBodies, context.hexIds, coefficients, 'hex'),
      });
    }
  }
  return fixtures;
}

function combineBodySections(gateBodies: readonly GateBody[], ids: readonly string[], coefficients: Record<GateBodyId, number>, domain: 'square' | 'hex'): Section {
  return gateBodies.reduce((section, body) => {
    const coefficient = coefficients[body.bodyId] ?? 0;
    const source = domain === 'square' ? body.squareSupportForm : body.hexSupportForm;
    return addSections(section, scaleSection(source, coefficient));
  }, zeroSection(ids));
}

function recoverCoefficientRecord(square: Section, hex: Section, gateBodies: readonly GateBody[]): Record<GateBodyId, number> {
  return Object.fromEntries(gateBodies.map((body) => [
    body.bodyId,
    average([
      recoverCoefficientFromSection(square, body.squareSupportForm),
      recoverCoefficientFromSection(hex, body.hexSupportForm),
    ]),
  ])) as Record<GateBodyId, number>;
}

function recoverCoefficientFromSection(composite: Section, basis: Section): number {
  const denominator = sectionInnerProduct(basis, basis);
  return denominator <= EPSILON ? 0 : sectionInnerProduct(composite, basis) / denominator;
}

function sectionInnerProduct(left: Section, right: Section): number {
  const ids = unique([...left.ids, ...right.ids]);
  return ids.reduce((sum, id) => sum + dotVec3(left.values.get(id) ?? zeroVec3(), right.values.get(id) ?? zeroVec3()), 0);
}

function rowOrderShuffleTransitionCheck(fixture: OrderedPairFixture, gateBodies: readonly GateBody[], context: OperatorContext): { observedStatus: InvalidityControlRow['observedStatus']; maxError: number } {
  const reversedSquareIds = [...context.squareIds].reverse();
  const reversedHexIds = [...context.hexIds].reverse();
  const reversedContext: OperatorContext = {
    ...context,
    squareIds: reversedSquareIds,
    hexIds: reversedHexIds,
    d: reindexMatrix(context.d, context.hexIds, context.squareIds, reversedHexIds, reversedSquareIds),
    rExact: reindexMatrix(context.rExact, context.squareIds, context.hexIds, reversedSquareIds, reversedHexIds),
    rAdj: reindexMatrix(context.rAdj, context.squareIds, context.hexIds, reversedSquareIds, reversedHexIds),
    pQ: reindexMatrix(context.pQ, context.squareIds, context.squareIds, reversedSquareIds, reversedSquareIds),
    pH: reindexMatrix(context.pH, context.hexIds, context.hexIds, reversedHexIds, reversedHexIds),
  };
  const reversedBodies = gateBodies.map((body) => ({
    ...body,
    squareSupportForm: reorderSection(body.squareSupportForm, reversedSquareIds),
    hexSupportForm: reorderSection(body.hexSupportForm, reversedHexIds),
  }));
  const reversedSquare = reorderSection(fixture.squareTransitionPreform, reversedSquareIds);
  const reversedHex = reorderSection(fixture.hexTransitionPreform, reversedHexIds);
  const recoveredCoefficients = recoverCoefficientRecord(reversedSquare, reversedHex, reversedBodies);
  const classifierPreserved = isOrderedTransitionCoefficientRecord(recoveredCoefficients);
  const transferError = Math.max(
    compareSquareSections(reorderSection(applyPQ(context, fixture.squareTransitionPreform), reversedSquareIds), applyPQ(reversedContext, reversedSquare)),
    compareHexSections(reorderSection(applyPH(context, fixture.hexTransitionPreform), reversedHexIds), applyPH(reversedContext, reversedHex)),
    compareHexSections(reorderSection(applyD(context, fixture.squareTransitionPreform), reversedHexIds), applyD(reversedContext, reversedSquare)),
    compareSquareSections(reorderSection(applyRExact(context, fixture.hexTransitionPreform), reversedSquareIds), applyRExact(reversedContext, reversedHex)),
    compareSquareSections(reorderSection(applyRAdj(context, fixture.hexTransitionPreform), reversedSquareIds), applyRAdj(reversedContext, reversedHex)),
  );
  return {
    observedStatus: classifierPreserved ? 'ordered-pair-transition-preform-constructed' : 'row-order-dependence-detected',
    maxError: Math.max(transferError, coefficientRecordMaxError(fixture.coefficients, recoveredCoefficients)),
  };
}

function zeroCompositeMaxError(context: OperatorContext): number {
  const zeroSquare = buildZeroSquareSection(context);
  const zeroHex = buildZeroHexSection(context);
  return Math.max(
    compareSquareSections(applyPQ(context, zeroSquare), zeroSquare),
    compareHexSections(applyPH(context, zeroHex), zeroHex),
    compareHexSections(applyD(context, zeroSquare), zeroHex),
    compareSquareSections(applyRExact(context, zeroHex), zeroSquare),
    compareSquareSections(applyRAdj(context, zeroHex), zeroSquare),
  );
}

function reindexMatrix(matrix: Matrix, originalOutputIds: readonly string[], originalInputIds: readonly string[], newOutputIds: readonly string[], newInputIds: readonly string[]): Matrix {
  return newOutputIds.map((outputId) => {
    const rowIndex = originalOutputIds.indexOf(outputId);
    return newInputIds.map((inputId) => {
      const columnIndex = originalInputIds.indexOf(inputId);
      return matrix[rowIndex]?.[columnIndex] ?? 0;
    });
  });
}

function summarizeRows<Row extends { maxError: number; status: string }, PassStatus extends string, FailStatus extends string>(
  rows: readonly Row[],
  passStatus: PassStatus,
  failStatus: FailStatus,
): Summary<PassStatus, FailStatus> {
  const passCount = rows.filter((row) => row.status === passStatus).length;
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length ? passStatus : failStatus,
  };
}

function applyD(context: OperatorContext, square: Section): Section {
  return applyScalarMatrixToVectorSection(context.d, square, context.hexIds);
}

function applyRExact(context: OperatorContext, hex: Section): Section {
  return applyScalarMatrixToVectorSection(context.rExact, hex, context.squareIds);
}

function applyRAdj(context: OperatorContext, hex: Section): Section {
  return applyScalarMatrixToVectorSection(context.rAdj, hex, context.squareIds);
}

function applyPQ(context: OperatorContext, square: Section): Section {
  return applyScalarMatrixToVectorSection(context.pQ, square, context.squareIds);
}

function applyPH(context: OperatorContext, hex: Section): Section {
  return applyScalarMatrixToVectorSection(context.pH, hex, context.hexIds);
}

function applyScalarMatrixToVectorSection(matrix: Matrix, input: Section, outputIds: readonly string[]): Section {
  const values = new Map<string, Vec3>();
  outputIds.forEach((outputId, rowIndex) => {
    const vector = input.ids.reduce((sum, inputId, columnIndex) => {
      const coefficient = matrix[rowIndex]?.[columnIndex] ?? 0;
      return addVec3(sum, scaleVec3(input.values.get(inputId) ?? zeroVec3(), coefficient));
    }, zeroVec3());
    values.set(outputId, vector);
  });
  return sectionFromValues(outputIds, values);
}

function buildZeroSquareSection(context: OperatorContext): Section {
  return zeroSection(context.squareIds);
}

function buildZeroHexSection(context: OperatorContext): Section {
  return zeroSection(context.hexIds);
}

function zeroSection(ids: readonly string[]): Section {
  return sectionFromValues(ids, new Map(ids.map((id) => [id, zeroVec3()])));
}

function sectionFromRecord(ids: readonly string[], record: Record<string, Vec3>): Section {
  return sectionFromValues(ids, new Map(ids.map((id) => [id, record[id] ?? zeroVec3()])));
}

function sectionFromValues(ids: readonly string[], values: Map<string, Vec3>): Section {
  return { ids: [...ids], values: new Map(values) };
}

function addSections(left: Section, right: Section): Section {
  const ids = unique([...left.ids, ...right.ids]);
  return sectionFromValues(ids, new Map(ids.map((id) => [
    id,
    addVec3(left.values.get(id) ?? zeroVec3(), right.values.get(id) ?? zeroVec3()),
  ])));
}

function scaleSection(section: Section, scale: number): Section {
  return sectionFromValues(section.ids, new Map(section.ids.map((id) => [id, scaleVec3(section.values.get(id) ?? zeroVec3(), scale)])));
}

function reorderSection(section: Section, ids: readonly string[]): Section {
  return sectionFromValues(ids, new Map(ids.map((id) => [id, section.values.get(id) ?? zeroVec3()])));
}

function compareSquareSections(left: Section, right: Section): number {
  return sectionMaxErrorByObjectId(left, right);
}

function compareHexSections(left: Section, right: Section): number {
  return sectionMaxErrorByObjectId(left, right);
}

function sectionMaxErrorByObjectId(left: Section, right: Section): number {
  const ids = unique([...left.ids, ...right.ids, ...left.values.keys(), ...right.values.keys()]);
  return maxOf(ids.map((id) => maxAbsVec3(subVec3(left.values.get(id) ?? zeroVec3(), right.values.get(id) ?? zeroVec3()))));
}

function sectionToRecord(section: Section): Record<string, Vec3> {
  return Object.fromEntries(section.ids.map((id) => [id, cleanVec3(section.values.get(id) ?? zeroVec3())]));
}

function matrixMultiply(left: Matrix, right: Matrix): Matrix {
  return left.map((row) =>
    right[0].map((_, columnIndex) =>
      row.reduce((sum, value, innerIndex) => sum + value * right[innerIndex][columnIndex], 0),
    ),
  );
}

function transpose(matrix: Matrix): Matrix {
  return matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]));
}

function scaleMatrix(matrix: Matrix, scale: number): Matrix {
  return matrix.map((row) => row.map((value) => value * scale));
}

function directedPairKey(sourcePair: readonly A3Label[], targetPair: readonly A3Label[]): string {
  return `${labelSort(sourcePair).join('')}|${labelSort(targetPair).join('')}`;
}

function labelSort(pair: readonly A3Label[]): [A3Label, A3Label] {
  return [...pair].sort((left, right) => A3_LABELS.indexOf(left) - A3_LABELS.indexOf(right)) as [A3Label, A3Label];
}

function hexLabelFromId(hexId: string): A3Label {
  return hexId.slice('ve-central-hexagon-omitted:'.length) as A3Label;
}

function coefficientRecord(entries: Array<[GateBodyId, number]>): Record<GateBodyId, number> {
  return Object.fromEntries(BODY_IDS.map((bodyId) => [bodyId, 0]).concat(entries)) as Record<GateBodyId, number>;
}

function cleanCoefficientRecord(record: Record<GateBodyId, number>): Record<string, number> {
  return Object.fromEntries(BODY_IDS.map((bodyId) => [bodyId, cleanNumber(record[bodyId] ?? 0)]));
}

function coefficientRecordMaxError(expected: Record<GateBodyId, number>, observed: Record<GateBodyId, number>): number {
  return maxOf(BODY_IDS.map((bodyId) => Math.abs((expected[bodyId] ?? 0) - (observed[bodyId] ?? 0))));
}

function isOrderedTransitionCoefficientRecord(record: Record<GateBodyId, number>): boolean {
  const coefficients = BODY_IDS.map((bodyId) => cleanNumber(record[bodyId] ?? 0));
  return coefficients.filter((value) => Math.abs(value + 1) <= EPSILON).length === 1 &&
    coefficients.filter((value) => Math.abs(value - 1) <= EPSILON).length === 1 &&
    coefficients.filter((value) => Math.abs(value) <= EPSILON).length === 1;
}

function falseClassificationFor(inputKind: UnorderedCoPresenceControlRow['inputKind']): UnorderedCoPresenceControlRow['observedClassification'] {
  if (inputKind === 'unordered-two-body-copresence') return 'unordered-copresence-falsely-classified-as-transition';
  if (inputKind === 'single-body-support') return 'single-body-support-falsely-classified-as-transition';
  if (inputKind === 'three-body-copresence') return 'three-body-copresence-falsely-classified-as-ordered-pair';
  return 'ordered-pair-transition-preform-constructed';
}

function unorderedControlStatus(summary: UnorderedCoPresenceControlSummary): string {
  return summary.unorderedCoPresencePassCount === 3 ? 'unordered-co-presence-not-transition' : 'unordered-copresence-falsely-classified-as-transition';
}

function singleBodyControlStatus(summary: UnorderedCoPresenceControlSummary): string {
  return summary.singleBodyPassCount === 3 ? 'single-body-support-not-transition' : 'single-body-support-falsely-classified-as-transition';
}

function threeBodyControlStatus(summary: UnorderedCoPresenceControlSummary): string {
  return summary.threeBodyPassCount === 1 ? 'three-body-copresence-not-ordered-pair' : 'three-body-copresence-falsely-classified-as-ordered-pair';
}

function distinctOrderedTriples(): Array<[GateBodyId, GateBodyId, GateBodyId]> {
  const triples: Array<[GateBodyId, GateBodyId, GateBodyId]> = [];
  for (const first of BODY_IDS) {
    for (const second of BODY_IDS) {
      for (const third of BODY_IDS) {
        if (first !== second && first !== third && second !== third) triples.push([first, second, third]);
      }
    }
  }
  return triples;
}

function orderedPairId(sourceBodyId: GateBodyId, targetBodyId: GateBodyId): string {
  return `ordered-pair:${sourceBodyId}->${targetBodyId}`;
}

function requiredGateBodyBasisRow(rowById: Map<string, S7GateBodyBasisRow>, bodyId: GateBodyId): S7GateBodyBasisRow {
  const row = rowById.get(bodyId);
  if (!row) throw new Error(`Missing Lab-7 gate body basis row ${bodyId}`);
  return row;
}

function requiredBody(bodyById: Map<GateBodyId, GateBody>, bodyId: GateBodyId): GateBody {
  const body = bodyById.get(bodyId);
  if (!body) throw new Error(`Missing gate body ${bodyId}`);
  return body;
}

function requiredFixture(fixtureById: Map<string, OrderedPairFixture>, orderedPairIdValue: string): OrderedPairFixture {
  const fixture = fixtureById.get(orderedPairIdValue);
  if (!fixture) throw new Error(`Missing ordered pair fixture ${orderedPairIdValue}`);
  return fixture;
}

function parentLab7Accepted(report: S7Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-7-gate-body-co-composition-standard-support-basis-pass' &&
    report.integrityIssueCount === 0 &&
    report.componentRecoverySummary.status === 'component-recoverable-co-composition' &&
    report.routeLanguageBoundarySummary.status === 'route-language-boundary-pass';
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((id) => !rows.some((row) => row.boundaryId === id && row.enforced));
}

function controlFailed(rows: readonly ControlRow[], controlId: ControlRow['controlId']): boolean {
  return rows.find((row) => row.controlId === controlId)?.status !== 'control-pass';
}

function controlStatus(rows: readonly ControlRow[], controlId: ControlRow['controlId']): string {
  return rows.find((row) => row.controlId === controlId)?.status ?? 'missing';
}

function falsifierTriggered(rows: readonly FalsifierRow[], falsifierId: FalsifierRow['falsifierId']): boolean {
  return rows.find((row) => row.falsifierId === falsifierId)?.triggered === true;
}

function addVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

function subVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
}

function scaleVec3(value: Vec3, scale: number): Vec3 {
  return [value[0] * scale, value[1] * scale, value[2] * scale];
}

function dotVec3(left: Vec3, right: Vec3): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function maxAbsVec3(value: Vec3): number {
  return Math.max(Math.abs(value[0]), Math.abs(value[1]), Math.abs(value[2]));
}

function zeroVec3(): Vec3 {
  return [0, 0, 0];
}

function average(values: readonly number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function maxOf(values: readonly number[]): number {
  return values.length === 0 ? 0 : Math.max(...values);
}

function cleanNumber(value: number): number {
  return Math.abs(value) <= EPSILON ? 0 : Number(value.toFixed(12));
}

function cleanVec3(value: Vec3): Vec3 {
  return [cleanNumber(value[0]), cleanNumber(value[1]), cleanNumber(value[2])];
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}
