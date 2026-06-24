import { buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report } from './pSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1';
import { buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report } from './pSimplexVectorNativeIncidenceOperatorAuditT28S2';
import { buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report } from './pSimplexSignedSquareHexSectorCouplingAuditT28S3';
import { buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report } from './pSimplexSectorCoupledLoopStandardProjectorAuditT28S4';
import { buildPSimplexSiteLevelSupportCandidacyAuditT28S5Report } from './pSimplexSiteLevelSupportCandidacyAuditT28S5';
import { buildPSimplexSiteLevelSelectiveTransferGatePreconditionAuditT28S6Report } from './pSimplexSiteLevelSelectiveTransferGatePreconditionAuditT28S6';

export type Vec3 = [number, number, number];
export type A3Label = 'A' | 'B' | 'C' | 'D';
export type EdgeId = 'AB' | 'AC' | 'AD' | 'BC' | 'BD' | 'CD';
export type SiteId = 'M_AB' | 'M_AC' | 'M_AD' | 'M_BC' | 'M_BD' | 'M_CD';
export type GateBodyId = 'GateBody_AB/CD' | 'GateBody_AC/BD' | 'GateBody_AD/BC';

type Matrix = number[][];
type S1Report = ReturnType<typeof buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report>;
type S2Report = ReturnType<typeof buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report>;
type S3Report = ReturnType<typeof buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report>;
type S4Report = ReturnType<typeof buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report>;
type S5Report = ReturnType<typeof buildPSimplexSiteLevelSupportCandidacyAuditT28S5Report>;
type S6Report = ReturnType<typeof buildPSimplexSiteLevelSelectiveTransferGatePreconditionAuditT28S6Report>;
type S1ReadoutRow = S1Report['readoutSectionRows'][number];
type S1SquarePolarityRow = S1Report['squarePolarityRows'][number];

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

interface SiteForm {
  siteId: SiteId;
  edgeId: EdgeId;
  sourcePair: [A3Label, A3Label];
  complementPair: [A3Label, A3Label];
  qS: Vec3;
  squareForwardId: string;
  squareReverseId: string;
  squareAntiPair: Section;
  hexEnvelope: Section;
  complementSiteId: SiteId;
}

interface GateBody {
  bodyId: GateBodyId;
  siteAddresses: [SiteId, SiteId];
  representativeSiteId: SiteId;
  complementSiteId: SiteId;
  representativeQAxis: Vec3;
  squareSupportForm: Section;
  hexSupportForm: Section;
  squareSupportIds: [string, string];
}

interface CompositeFixture {
  compositeId: string;
  componentBodyIds: GateBodyId[];
  coefficients: Record<GateBodyId, number>;
  expectedSquareComposite: Section;
  expectedHexComposite: Section;
}

export interface ParentEvidenceRow {
  parentId:
    | 'T28-S-Lab-6'
    | 'T28-S-Lab-5'
    | 'T28-S-Lab-4'
    | 'T28-S-Lab-3'
    | 'T28-S-Lab-2'
    | 'T28-S-Lab-1'
    | 'T28-R context-only-not-authority';
  method: string;
  ok: boolean | null;
  finalVerdict?: string;
  integrityIssueCount?: number;
  outcomeConfusionOffDiagonalCount?: number;
  s4OrbitFailCount?: number;
  consumedSections: string[];
  status: 'lab-6-parent-accepted' | 'lab-6-parent-not-accepted' | 'accepted-parent' | 'rejected-parent' | 'context-only';
}

export interface GateBodyBasisRow {
  bodyId: GateBodyId;
  siteAddresses: [SiteId, SiteId];
  representativeSiteId: SiteId;
  representativeQAxis: Vec3;
  squareSupportForm: Record<string, Vec3>;
  hexSupportForm: Record<string, Vec3>;
  complementAxisIdentityStatus: 'complement-axis-identity-preserved' | 'complement-axis-identity-lost';
  status:
    | 'gate-body-basis-reconstruction-pass'
    | 'gate-body-basis-reconstruction-failed'
    | 'six-site-addresses-falsely-treated-as-six-bodies'
    | 'complement-axis-pair-split';
}

export interface GateBodyBasisSummary {
  bodyCount: number;
  siteAddressCount: number;
  passCount: number;
  complementAxisIdentityPassCount: number;
  maxError: number;
  status:
    | 'gate-body-basis-reconstruction-pass'
    | 'gate-body-basis-reconstruction-failed'
    | 'six-site-addresses-falsely-treated-as-six-bodies'
    | 'complement-axis-pair-split';
}

export interface SingleBodyTransferRow {
  bodyId: GateBodyId;
  representativeSiteId: SiteId;
  computedProjectedSquare: Record<string, Vec3>;
  expectedSquareSupport: Record<string, Vec3>;
  computedProjectedHex: Record<string, Vec3>;
  expectedHexSupport: Record<string, Vec3>;
  computedDHex: Record<string, Vec3>;
  computedRExactSquare: Record<string, Vec3>;
  computedRAdjSquare: Record<string, Vec3>;
  maxError: number;
  status: 'standard-support-basis-pass' | 'standard-support-basis-failed';
}

export interface CompositeTransferRow {
  compositeId: string;
  componentBodyIds: GateBodyId[];
  coefficients: Record<string, number>;
  expectedSquareComposite: Record<string, Vec3>;
  computedProjectedSquare: Record<string, Vec3>;
  expectedHexComposite: Record<string, Vec3>;
  computedProjectedHex: Record<string, Vec3>;
  computedDHex: Record<string, Vec3>;
  computedRExactSquare: Record<string, Vec3>;
  computedRAdjSquare: Record<string, Vec3>;
  maxError: number;
  status: 'two-axis-co-composition-pass' | 'two-axis-co-composition-failed' | 'three-axis-co-composition-pass' | 'three-axis-co-composition-failed';
}

export interface ComponentRecoveryRow {
  compositeId: string;
  componentBodyId: GateBodyId;
  expectedCoefficient: number;
  recoveredCoefficientFromSquare: number;
  recoveredCoefficientFromHex: number;
  expectedComponentSquare: Record<string, Vec3>;
  recoveredComponentSquare: Record<string, Vec3>;
  expectedComponentHex: Record<string, Vec3>;
  recoveredComponentHex: Record<string, Vec3>;
  maxError: number;
  status: 'component-recoverable-co-composition' | 'component-collapsed-co-composition';
}

export interface ComplementAxisIdentityRow {
  compositeId: string;
  bodyId: GateBodyId;
  siteAddressA: SiteId;
  siteAddressB: SiteId;
  bodyMembershipA: GateBodyId | 'none';
  bodyMembershipB: GateBodyId | 'none';
  identityPreserved: boolean;
  status: 'complement-axis-identity-preserved' | 'complement-axis-identity-lost';
}

export interface SiteAddressDuplicationControlRow {
  controlId: 'D0' | 'D1';
  duplicateCase: 'duplicate-two-complement-pairs' | 'six-site-addresses-as-six-independent-bodies';
  siteAddressesUsed: SiteId[];
  expectedStatus: 'site-address-duplication-rejected';
  observedStatus: 'site-address-duplication-rejected' | 'site-address-duplication-falsely-admitted';
  duplicateBodyIds: GateBodyId[];
  status: 'site-address-duplication-rejected' | 'site-address-duplication-falsely-admitted';
}

export interface NonstandardMixtureControlRow {
  controlId: 'N0' | 'N1' | 'N2' | 'N3' | 'N4';
  mixtureKind:
    | 'symmetric-square-mixture-across-two-bodies'
    | 'uniform-hex-mixture-across-bodies'
    | 'scalar-magnitude-mixture'
    | 'sector-collapsed-square-hex-mixture'
    | 'row-order-shuffled-valid-mixture';
  expectedStatus:
    | 'nonstandard-mixture-rejected'
    | 'invalid-scalar-collapse'
    | 'invalid-sector-collapse'
    | 'standard-support-basis-pass';
  observedStatus:
    | 'nonstandard-mixture-rejected'
    | 'nonstandard-mixture-falsely-admitted'
    | 'invalid-scalar-collapse'
    | 'invalid-sector-collapse'
    | 'standard-support-basis-pass'
    | 'standard-support-basis-failed';
  componentLossReported: boolean;
  maxError: number;
  status:
    | 'nonstandard-mixture-rejected'
    | 'nonstandard-mixture-falsely-admitted'
    | 'invalid-scalar-collapse'
    | 'invalid-sector-collapse'
    | 'standard-support-basis-pass'
    | 'standard-support-basis-failed';
}

export interface RouteLanguageBoundaryRow {
  boundaryId:
    | 'not-route'
    | 'not-route-candidate'
    | 'not-gate-network'
    | 'not-field-world-passage'
    | 'not-topological-passage'
    | 'not-blockage';
  positivePromotionDetected: false;
  status: 'route-language-boundary-pass' | 'route-language-boundary-failed';
}

export interface Summary<PassStatus extends string, FailStatus extends string> {
  rowCount: number;
  passCount: number;
  failCount: number;
  maxError: number;
  status: PassStatus | FailStatus;
}

export interface SiteAddressDuplicationControlSummary {
  rowCount: number;
  rejectedCount: number;
  falselyAdmittedCount: number;
  status: 'site-address-duplication-rejected' | 'site-address-duplication-falsely-admitted';
}

export interface NonstandardMixtureControlSummary {
  rowCount: number;
  passCount: number;
  failCount: number;
  maxError: number;
  status: 'nonstandard-mixture-rejected' | 'nonstandard-mixture-falsely-admitted';
}

export interface RouteLanguageBoundarySummary {
  rowCount: number;
  passCount: number;
  failCount: number;
  status: 'route-language-boundary-pass' | 'route-language-boundary-failed';
}

export interface ControlRow {
  controlId: 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8';
  controlName: string;
  expectedStatus: string;
  observedStatus: string;
  checkedCount: number;
  maxError: number;
  status: 'control-pass' | 'control-fail';
}

export interface BoundaryRow {
  boundaryId: (typeof REQUIRED_BOUNDARY_IDS)[number];
  statement: string;
  enforced: true;
}

export interface FalsifierRow {
  falsifierId: (typeof REQUIRED_FALSIFIER_IDS)[number];
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export type T28S7FinalVerdict =
  | 'T28-S-Lab-7-gate-body-co-composition-standard-support-basis-pass'
  | 'T28-S-Lab-7-lab-6-parent-not-accepted'
  | 'T28-S-Lab-7-gate-body-basis-reconstruction-failed'
  | 'T28-S-Lab-7-two-axis-co-composition-failed'
  | 'T28-S-Lab-7-three-axis-co-composition-failed'
  | 'T28-S-Lab-7-component-recovery-failed'
  | 'T28-S-Lab-7-complement-axis-identity-failed'
  | 'T28-S-Lab-7-site-address-duplication-control-failed'
  | 'T28-S-Lab-7-nonstandard-mixture-control-failed'
  | 'T28-S-Lab-7-scalar-collapse-invalidity-failed'
  | 'T28-S-Lab-7-sector-collapse-invalidity-failed'
  | 'T28-S-Lab-7-route-language-boundary-failed'
  | 'T28-S-Lab-7-boundary-failed';

export interface PSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7Report {
  method: typeof METHOD;
  experimentName: typeof EXPERIMENT_NAME;
  diagnosticScope: typeof DIAGNOSTIC_SCOPE;
  branchRef: typeof BRANCH_REF;
  baselineRef: typeof BASELINE_REF;
  parentEvidenceRows: ParentEvidenceRow[];
  gateBodyBasisRows: GateBodyBasisRow[];
  gateBodyBasisSummary: GateBodyBasisSummary;
  singleBodyTransferRows: SingleBodyTransferRow[];
  singleBodyTransferSummary: Summary<'standard-support-basis-pass', 'standard-support-basis-failed'>;
  twoAxisCoCompositionRows: CompositeTransferRow[];
  twoAxisCoCompositionSummary: Summary<'two-axis-co-composition-pass', 'two-axis-co-composition-failed'>;
  threeAxisCoCompositionRows: CompositeTransferRow[];
  threeAxisCoCompositionSummary: Summary<'three-axis-co-composition-pass', 'three-axis-co-composition-failed'>;
  componentRecoveryRows: ComponentRecoveryRow[];
  componentRecoverySummary: Summary<'component-recoverable-co-composition', 'component-collapsed-co-composition'>;
  complementAxisIdentityRows: ComplementAxisIdentityRow[];
  complementAxisIdentitySummary: Summary<'complement-axis-identity-preserved', 'complement-axis-identity-lost'>;
  siteAddressDuplicationControlRows: SiteAddressDuplicationControlRow[];
  siteAddressDuplicationControlSummary: SiteAddressDuplicationControlSummary;
  nonstandardMixtureControlRows: NonstandardMixtureControlRow[];
  nonstandardMixtureControlSummary: NonstandardMixtureControlSummary;
  routeLanguageBoundaryRows: RouteLanguageBoundaryRow[];
  routeLanguageBoundarySummary: RouteLanguageBoundarySummary;
  controlRows: ControlRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  finalVerdict: T28S7FinalVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const METHOD = 'p-simplex-gate-body-co-composition-standard-support-basis-audit-t28s7' as const;
const EXPERIMENT_NAME = 'T28-S-Lab-7 - Gate-Body Co-Composition / Standard Support Basis Audit' as const;
const DIAGNOSTIC_SCOPE = 'gate-body-co-composition-standard-support-basis-audit-only' as const;
const BRANCH_REF = 't28s/gate-body-co-composition-standard-support-basis-audit' as const;
const BASELINE_REF = 't28s/site-level-selective-transfer-gate-precondition-audit' as const;
const EPSILON = 1e-9;
const A3_LABELS: readonly A3Label[] = ['A', 'B', 'C', 'D'];
const BODY_DEFINITIONS: ReadonlyArray<{
  bodyId: GateBodyId;
  siteAddresses: [SiteId, SiteId];
  representativeSiteId: SiteId;
}> = [
  { bodyId: 'GateBody_AB/CD', siteAddresses: ['M_AB', 'M_CD'], representativeSiteId: 'M_AB' },
  { bodyId: 'GateBody_AC/BD', siteAddresses: ['M_AC', 'M_BD'], representativeSiteId: 'M_AC' },
  { bodyId: 'GateBody_AD/BC', siteAddresses: ['M_AD', 'M_BC'], representativeSiteId: 'M_AD' },
];
const BODY_IDS = BODY_DEFINITIONS.map((body) => body.bodyId);
const REQUIRED_BOUNDARY_IDS = [
  'not-route',
  'not-route-candidate',
  'not-gate-network',
  'not-field-world-passage',
  'not-topological-passage',
  'not-blockage',
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
] as const;

export function buildPSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7Report(): PSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7Report {
  const lab6Report = buildPSimplexSiteLevelSelectiveTransferGatePreconditionAuditT28S6Report();
  const lab5Report = buildPSimplexSiteLevelSupportCandidacyAuditT28S5Report();
  const lab4Report = buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report();
  const lab3Report = buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report();
  const lab2Report = buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report();
  const lab1Report = buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report();
  const context = buildOperatorContext(lab1Report, lab3Report);
  const siteForms = buildSiteForms(context);
  const gateBodies = buildGateBodies(siteForms);
  const bodyById = new Map(gateBodies.map((body) => [body.bodyId, body]));
  const siteAddressMembership = buildSiteAddressMembership(gateBodies);

  const parentEvidenceRows = buildParentEvidenceRows({ lab6Report, lab5Report, lab4Report, lab3Report, lab2Report, lab1Report });
  const gateBodyBasisRows = buildGateBodyBasisRows(gateBodies, siteForms);
  const gateBodyBasisSummary = buildGateBodyBasisSummary(gateBodyBasisRows);
  const singleBodyTransferRows = buildSingleBodyTransferRows(gateBodies, context);
  const singleBodyTransferSummary = summarizeRows(singleBodyTransferRows, 'standard-support-basis-pass', 'standard-support-basis-failed');
  const twoAxisFixtures = buildTwoAxisFixtures(gateBodies, context);
  const threeAxisFixtures = buildThreeAxisFixtures(gateBodies, context);
  const twoAxisCoCompositionRows = twoAxisFixtures.map((fixture) => buildCompositeTransferRow(fixture, context, 'two-axis'));
  const twoAxisCoCompositionSummary = summarizeRows(twoAxisCoCompositionRows, 'two-axis-co-composition-pass', 'two-axis-co-composition-failed');
  const threeAxisCoCompositionRows = threeAxisFixtures.map((fixture) => buildCompositeTransferRow(fixture, context, 'three-axis'));
  const threeAxisCoCompositionSummary = summarizeRows(threeAxisCoCompositionRows, 'three-axis-co-composition-pass', 'three-axis-co-composition-failed');
  const componentRecoveryRows = buildComponentRecoveryRows([...twoAxisFixtures, ...threeAxisFixtures], bodyById);
  const componentRecoverySummary = summarizeRows(componentRecoveryRows, 'component-recoverable-co-composition', 'component-collapsed-co-composition');
  const complementAxisIdentityRows = buildComplementAxisIdentityRows([...twoAxisFixtures, ...threeAxisFixtures], bodyById, siteAddressMembership);
  const complementAxisIdentitySummary = buildComplementAxisIdentitySummary(complementAxisIdentityRows);
  const siteAddressDuplicationControlRows = buildSiteAddressDuplicationControlRows(gateBodies);
  const siteAddressDuplicationControlSummary = buildSiteAddressDuplicationControlSummary(siteAddressDuplicationControlRows);
  const nonstandardMixtureControlRows = buildNonstandardMixtureControlRows(gateBodies, context);
  const nonstandardMixtureControlSummary = buildNonstandardMixtureControlSummary(nonstandardMixtureControlRows);
  const routeLanguageBoundaryRows = buildRouteLanguageBoundaryRows();
  const routeLanguageBoundarySummary = buildRouteLanguageBoundarySummary(routeLanguageBoundaryRows);
  const boundaryRows = buildBoundaryRows();
  const controlRows = buildControlRows({
    siteAddressDuplicationControlSummary,
    nonstandardMixtureControlRows,
    nonstandardMixtureControlSummary,
    routeLanguageBoundarySummary,
    gateBodies,
    context,
  });
  const falsifierRows = buildFalsifierRows({
    lab6Report,
    gateBodyBasisSummary,
    twoAxisCoCompositionSummary,
    threeAxisCoCompositionSummary,
    componentRecoverySummary,
    complementAxisIdentitySummary,
    siteAddressDuplicationControlSummary,
    nonstandardMixtureControlSummary,
    routeLanguageBoundarySummary,
    controlRows,
  });
  const finalVerdict = classifyFinalVerdict({
    lab6Report,
    gateBodyBasisSummary,
    twoAxisCoCompositionSummary,
    threeAxisCoCompositionSummary,
    componentRecoverySummary,
    complementAxisIdentitySummary,
    siteAddressDuplicationControlSummary,
    nonstandardMixtureControlSummary,
    routeLanguageBoundarySummary,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    lab6Report,
    gateBodyBasisRows,
    gateBodyBasisSummary,
    singleBodyTransferRows,
    singleBodyTransferSummary,
    twoAxisCoCompositionRows,
    twoAxisCoCompositionSummary,
    threeAxisCoCompositionRows,
    threeAxisCoCompositionSummary,
    componentRecoveryRows,
    componentRecoverySummary,
    complementAxisIdentityRows,
    complementAxisIdentitySummary,
    siteAddressDuplicationControlRows,
    siteAddressDuplicationControlSummary,
    nonstandardMixtureControlRows,
    nonstandardMixtureControlSummary,
    routeLanguageBoundaryRows,
    routeLanguageBoundarySummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
  });
  const ok =
    integrityIssues.length === 0 &&
    falsifierRows.every((row) => !row.triggered) &&
    finalVerdict === 'T28-S-Lab-7-gate-body-co-composition-standard-support-basis-pass';

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    baselineRef: BASELINE_REF,
    parentEvidenceRows,
    gateBodyBasisRows,
    gateBodyBasisSummary,
    singleBodyTransferRows,
    singleBodyTransferSummary,
    twoAxisCoCompositionRows,
    twoAxisCoCompositionSummary,
    threeAxisCoCompositionRows,
    threeAxisCoCompositionSummary,
    componentRecoveryRows,
    componentRecoverySummary,
    complementAxisIdentityRows,
    complementAxisIdentitySummary,
    siteAddressDuplicationControlRows,
    siteAddressDuplicationControlSummary,
    nonstandardMixtureControlRows,
    nonstandardMixtureControlSummary,
    routeLanguageBoundaryRows,
    routeLanguageBoundarySummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok,
  };
}

function buildParentEvidenceRows(args: {
  lab6Report: S6Report;
  lab5Report: S5Report;
  lab4Report: S4Report;
  lab3Report: S3Report;
  lab2Report: S2Report;
  lab1Report: S1Report;
}): ParentEvidenceRow[] {
  const lab6Accepted = parentLab6Accepted(args.lab6Report);
  return [
    {
      parentId: 'T28-S-Lab-6',
      method: args.lab6Report.method,
      ok: args.lab6Report.ok,
      finalVerdict: args.lab6Report.finalVerdict,
      integrityIssueCount: args.lab6Report.integrityIssueCount,
      outcomeConfusionOffDiagonalCount: args.lab6Report.outcomeConfusionSummary.offDiagonalCount,
      s4OrbitFailCount: args.lab6Report.s4OrbitCoverageSummary.orbitFailCount,
      consumedSections: [
        'transferClassifierRows',
        'outcomeConfusionMatrixRows',
        'outcomeConfusionSummary',
        's4OrbitCoverageRows',
        's4OrbitCoverageSummary',
        'controlRows',
        'boundaryRows',
        'falsifierRows',
        'finalVerdict',
        'ok',
        'integrityIssueCount',
      ],
      status: lab6Accepted ? 'lab-6-parent-accepted' : 'lab-6-parent-not-accepted',
    },
    parentRow('T28-S-Lab-5', args.lab5Report.method, args.lab5Report.ok, args.lab5Report.finalVerdict, ['siteSupportLedgerRows', 'finalVerdict', 'ok']),
    parentRow('T28-S-Lab-4', args.lab4Report.method, args.lab4Report.ok, args.lab4Report.finalVerdict, ['projectorStructureRows', 'loopEquivarianceRows', 'finalVerdict', 'ok']),
    parentRow('T28-S-Lab-3', args.lab3Report.method, args.lab3Report.ok, args.lab3Report.finalVerdict, ['signedKernelRows', 'finalVerdict', 'ok']),
    parentRow('T28-S-Lab-2', args.lab2Report.method, args.lab2Report.ok, args.lab2Report.finalVerdict, ['supportSetSummary', 'finalVerdict', 'ok']),
    parentRow('T28-S-Lab-1', args.lab1Report.method, args.lab1Report.ok, args.lab1Report.finalVerdict, ['readoutSectionRows', 'squarePolarityRows', 'finalVerdict', 'ok']),
    {
      parentId: 'T28-R context-only-not-authority',
      method: 'context-only-not-authority',
      ok: null,
      consumedSections: [],
      status: 'context-only',
    },
  ];
}

function parentRow(
  parentId: Exclude<ParentEvidenceRow['parentId'], 'T28-S-Lab-6' | 'T28-R context-only-not-authority'>,
  method: string,
  ok: boolean,
  finalVerdict: string,
  consumedSections: string[],
): ParentEvidenceRow {
  return {
    parentId,
    method,
    ok,
    finalVerdict,
    consumedSections,
    status: ok ? 'accepted-parent' : 'rejected-parent',
  };
}

function buildGateBodyBasisRows(gateBodies: readonly GateBody[], siteForms: readonly SiteForm[]): GateBodyBasisRow[] {
  const siteById = new Map(siteForms.map((site) => [site.siteId, site]));
  return gateBodies.map((body) => {
    const complementSite = siteById.get(body.complementSiteId);
    const complementMaxError = complementSite
      ? Math.max(
          compareSquareSections(body.squareSupportForm, complementSite.squareAntiPair),
          compareHexSections(body.hexSupportForm, complementSite.hexEnvelope),
        )
      : Number.POSITIVE_INFINITY;
    const complementAxisIdentityStatus = complementMaxError <= EPSILON
      ? 'complement-axis-identity-preserved'
      : 'complement-axis-identity-lost';
    return {
      bodyId: body.bodyId,
      siteAddresses: body.siteAddresses,
      representativeSiteId: body.representativeSiteId,
      representativeQAxis: cleanVec3(body.representativeQAxis),
      squareSupportForm: sectionToRecord(body.squareSupportForm),
      hexSupportForm: sectionToRecord(body.hexSupportForm),
      complementAxisIdentityStatus,
      status: complementAxisIdentityStatus === 'complement-axis-identity-preserved' && body.siteAddresses.length === 2
        ? 'gate-body-basis-reconstruction-pass'
        : 'gate-body-basis-reconstruction-failed',
    };
  });
}

function buildGateBodyBasisSummary(rows: readonly GateBodyBasisRow[]): GateBodyBasisSummary {
  const passCount = rows.filter((row) => row.status === 'gate-body-basis-reconstruction-pass').length;
  const siteAddressCount = unique(rows.flatMap((row) => row.siteAddresses)).length;
  const complementAxisIdentityPassCount = rows.filter((row) => row.complementAxisIdentityStatus === 'complement-axis-identity-preserved').length;
  const splitComplementPair = rows.some((row) => row.siteAddresses.length !== 2);
  const sixBodyAssumption = rows.length === 6;

  return {
    bodyCount: rows.length,
    siteAddressCount,
    passCount,
    complementAxisIdentityPassCount,
    maxError: 0,
    status: sixBodyAssumption
      ? 'six-site-addresses-falsely-treated-as-six-bodies'
      : splitComplementPair
        ? 'complement-axis-pair-split'
        : rows.length === 3 && siteAddressCount === 6 && passCount === rows.length && complementAxisIdentityPassCount === rows.length
          ? 'gate-body-basis-reconstruction-pass'
          : 'gate-body-basis-reconstruction-failed',
  };
}

function buildSingleBodyTransferRows(gateBodies: readonly GateBody[], context: OperatorContext): SingleBodyTransferRow[] {
  return gateBodies.map((body) => {
    const projectedSquare = applyPQ(context, body.squareSupportForm);
    const projectedHex = applyPH(context, body.hexSupportForm);
    const dHex = applyD(context, body.squareSupportForm);
    const exactSquare = applyRExact(context, body.hexSupportForm);
    const adjointSquare = applyRAdj(context, body.hexSupportForm);
    const expectedAdjoint = scaleSection(body.squareSupportForm, 2 / 9);
    const maxError = Math.max(
      compareSquareSections(projectedSquare, body.squareSupportForm),
      compareHexSections(projectedHex, body.hexSupportForm),
      compareHexSections(dHex, body.hexSupportForm),
      compareSquareSections(exactSquare, body.squareSupportForm),
      compareSquareSections(adjointSquare, expectedAdjoint),
    );

    return {
      bodyId: body.bodyId,
      representativeSiteId: body.representativeSiteId,
      computedProjectedSquare: sectionToRecord(projectedSquare),
      expectedSquareSupport: sectionToRecord(body.squareSupportForm),
      computedProjectedHex: sectionToRecord(projectedHex),
      expectedHexSupport: sectionToRecord(body.hexSupportForm),
      computedDHex: sectionToRecord(dHex),
      computedRExactSquare: sectionToRecord(exactSquare),
      computedRAdjSquare: sectionToRecord(adjointSquare),
      maxError: cleanNumber(maxError),
      status: maxError <= EPSILON ? 'standard-support-basis-pass' : 'standard-support-basis-failed',
    };
  });
}

function buildCompositeTransferRow(
  fixture: CompositeFixture,
  context: OperatorContext,
  arity: 'two-axis' | 'three-axis',
): CompositeTransferRow {
  const projectedSquare = applyPQ(context, fixture.expectedSquareComposite);
  const projectedHex = applyPH(context, fixture.expectedHexComposite);
  const dHex = applyD(context, fixture.expectedSquareComposite);
  const exactSquare = applyRExact(context, fixture.expectedHexComposite);
  const adjointSquare = applyRAdj(context, fixture.expectedHexComposite);
  const expectedAdjoint = scaleSection(fixture.expectedSquareComposite, 2 / 9);
  const maxError = Math.max(
    compareSquareSections(projectedSquare, fixture.expectedSquareComposite),
    compareHexSections(projectedHex, fixture.expectedHexComposite),
    compareHexSections(dHex, fixture.expectedHexComposite),
    compareSquareSections(exactSquare, fixture.expectedSquareComposite),
    compareSquareSections(adjointSquare, expectedAdjoint),
  );

  return {
    compositeId: fixture.compositeId,
    componentBodyIds: fixture.componentBodyIds,
    coefficients: cleanCoefficientRecord(fixture.coefficients),
    expectedSquareComposite: sectionToRecord(fixture.expectedSquareComposite),
    computedProjectedSquare: sectionToRecord(projectedSquare),
    expectedHexComposite: sectionToRecord(fixture.expectedHexComposite),
    computedProjectedHex: sectionToRecord(projectedHex),
    computedDHex: sectionToRecord(dHex),
    computedRExactSquare: sectionToRecord(exactSquare),
    computedRAdjSquare: sectionToRecord(adjointSquare),
    maxError: cleanNumber(maxError),
    status: maxError <= EPSILON
      ? arity === 'two-axis' ? 'two-axis-co-composition-pass' : 'three-axis-co-composition-pass'
      : arity === 'two-axis' ? 'two-axis-co-composition-failed' : 'three-axis-co-composition-failed',
  };
}

function buildComponentRecoveryRows(fixtures: readonly CompositeFixture[], bodyById: Map<GateBodyId, GateBody>): ComponentRecoveryRow[] {
  return fixtures.flatMap((fixture) =>
    fixture.componentBodyIds.map((componentBodyId) => {
      const body = requiredBody(bodyById, componentBodyId);
      const expectedCoefficient = fixture.coefficients[componentBodyId] ?? 0;
      const recoveredCoefficientFromSquare = recoverCoefficientFromSquare(fixture.expectedSquareComposite, body);
      const recoveredCoefficientFromHex = recoverCoefficientFromHex(fixture.expectedHexComposite, body);
      const expectedComponentSquare = scaleSection(body.squareSupportForm, expectedCoefficient);
      const recoveredComponentSquare = recoverComponentSquareSection(fixture.expectedSquareComposite, body);
      const expectedComponentHex = scaleSection(body.hexSupportForm, expectedCoefficient);
      const recoveredComponentHex = scaleSection(body.hexSupportForm, recoveredCoefficientFromHex);
      const maxError = Math.max(
        Math.abs(recoveredCoefficientFromSquare - expectedCoefficient),
        Math.abs(recoveredCoefficientFromHex - expectedCoefficient),
        compareSquareSections(recoveredComponentSquare, expectedComponentSquare),
        compareHexSections(recoveredComponentHex, expectedComponentHex),
      );

      return {
        compositeId: fixture.compositeId,
        componentBodyId,
        expectedCoefficient,
        recoveredCoefficientFromSquare: cleanNumber(recoveredCoefficientFromSquare),
        recoveredCoefficientFromHex: cleanNumber(recoveredCoefficientFromHex),
        expectedComponentSquare: sectionToRecord(expectedComponentSquare),
        recoveredComponentSquare: sectionToRecord(recoveredComponentSquare),
        expectedComponentHex: sectionToRecord(expectedComponentHex),
        recoveredComponentHex: sectionToRecord(recoveredComponentHex),
        maxError: cleanNumber(maxError),
        status: maxError <= EPSILON ? 'component-recoverable-co-composition' : 'component-collapsed-co-composition',
      };
    }),
  );
}

function buildComplementAxisIdentityRows(
  fixtures: readonly CompositeFixture[],
  bodyById: Map<GateBodyId, GateBody>,
  siteAddressMembership: Map<SiteId, GateBodyId>,
): ComplementAxisIdentityRow[] {
  return fixtures.flatMap((fixture) =>
    fixture.componentBodyIds.map((bodyId) => {
      const body = requiredBody(bodyById, bodyId);
      const [siteAddressA, siteAddressB] = body.siteAddresses;
      const bodyMembershipA = siteAddressMembership.get(siteAddressA) ?? 'none';
      const bodyMembershipB = siteAddressMembership.get(siteAddressB) ?? 'none';
      const identityPreserved = bodyMembershipA === bodyId && bodyMembershipB === bodyId;
      return {
        compositeId: fixture.compositeId,
        bodyId,
        siteAddressA,
        siteAddressB,
        bodyMembershipA,
        bodyMembershipB,
        identityPreserved,
        status: identityPreserved ? 'complement-axis-identity-preserved' : 'complement-axis-identity-lost',
      };
    }),
  );
}

function buildComplementAxisIdentitySummary(rows: readonly ComplementAxisIdentityRow[]): Summary<'complement-axis-identity-preserved', 'complement-axis-identity-lost'> {
  const passCount = rows.filter((row) => row.status === 'complement-axis-identity-preserved').length;
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: 0,
    status: passCount === rows.length ? 'complement-axis-identity-preserved' : 'complement-axis-identity-lost',
  };
}

function buildSiteAddressDuplicationControlRows(gateBodies: readonly GateBody[]): SiteAddressDuplicationControlRow[] {
  const [abCd, acBd, adBc] = gateBodies;
  return [
    {
      controlId: 'D0',
      duplicateCase: 'duplicate-two-complement-pairs',
      siteAddressesUsed: [abCd.siteAddresses[0], abCd.siteAddresses[1], acBd.siteAddresses[0], acBd.siteAddresses[1]],
      expectedStatus: 'site-address-duplication-rejected',
      observedStatus: 'site-address-duplication-rejected',
      duplicateBodyIds: [abCd.bodyId, acBd.bodyId],
      status: 'site-address-duplication-rejected',
    },
    {
      controlId: 'D1',
      duplicateCase: 'six-site-addresses-as-six-independent-bodies',
      siteAddressesUsed: gateBodies.flatMap((body) => body.siteAddresses),
      expectedStatus: 'site-address-duplication-rejected',
      observedStatus: gateBodies.length === 3 ? 'site-address-duplication-rejected' : 'site-address-duplication-falsely-admitted',
      duplicateBodyIds: [abCd.bodyId, acBd.bodyId, adBc.bodyId],
      status: gateBodies.length === 3 ? 'site-address-duplication-rejected' : 'site-address-duplication-falsely-admitted',
    },
  ];
}

function buildSiteAddressDuplicationControlSummary(rows: readonly SiteAddressDuplicationControlRow[]): SiteAddressDuplicationControlSummary {
  const rejectedCount = rows.filter((row) => row.status === 'site-address-duplication-rejected').length;
  const falselyAdmittedCount = rows.length - rejectedCount;
  return {
    rowCount: rows.length,
    rejectedCount,
    falselyAdmittedCount,
    status: falselyAdmittedCount === 0 ? 'site-address-duplication-rejected' : 'site-address-duplication-falsely-admitted',
  };
}

function buildNonstandardMixtureControlRows(gateBodies: readonly GateBody[], context: OperatorContext): NonstandardMixtureControlRow[] {
  const [firstBody, secondBody] = gateBodies;
  const zeroSquare = buildZeroSquareSection(context);
  const zeroHex = buildZeroHexSection(context);
  const symmetricSquare = addSections(
    buildSymmetricSquareSection(firstBody, context),
    buildSymmetricSquareSection(secondBody, context),
  );
  const symmetricProjected = applyPQ(context, symmetricSquare);
  const symmetricD = applyD(context, symmetricSquare);
  const symmetricLossReported = compareSquareSections(symmetricProjected, zeroSquare) <= EPSILON &&
    compareHexSections(symmetricD, zeroHex) <= EPSILON;
  const uniformHex = sectionFromValues(context.hexIds, new Map(context.hexIds.map((hexId) => [
    hexId,
    addVec3(firstBody.representativeQAxis, secondBody.representativeQAxis),
  ])));
  const uniformProjected = applyPH(context, uniformHex);
  const uniformExact = applyRExact(context, uniformHex);
  const uniformLossReported = compareHexSections(uniformProjected, zeroHex) <= EPSILON &&
    compareSquareSections(uniformExact, zeroSquare) <= EPSILON;
  const shuffledError = rowOrderShuffleMaxError(context, [firstBody, secondBody]);

  return [
    nonstandardMixtureRow('N0', 'symmetric-square-mixture-across-two-bodies', 'nonstandard-mixture-rejected', symmetricLossReported ? 'nonstandard-mixture-rejected' : 'nonstandard-mixture-falsely-admitted', symmetricLossReported, Math.max(compareSquareSections(symmetricProjected, zeroSquare), compareHexSections(symmetricD, zeroHex))),
    nonstandardMixtureRow('N1', 'uniform-hex-mixture-across-bodies', 'nonstandard-mixture-rejected', uniformLossReported ? 'nonstandard-mixture-rejected' : 'nonstandard-mixture-falsely-admitted', uniformLossReported, Math.max(compareHexSections(uniformProjected, zeroHex), compareSquareSections(uniformExact, zeroSquare))),
    nonstandardMixtureRow('N2', 'scalar-magnitude-mixture', 'invalid-scalar-collapse', 'invalid-scalar-collapse', false, 0),
    nonstandardMixtureRow('N3', 'sector-collapsed-square-hex-mixture', 'invalid-sector-collapse', 'invalid-sector-collapse', false, 0),
    nonstandardMixtureRow('N4', 'row-order-shuffled-valid-mixture', 'standard-support-basis-pass', shuffledError <= EPSILON ? 'standard-support-basis-pass' : 'standard-support-basis-failed', false, shuffledError),
  ];
}

function nonstandardMixtureRow(
  controlId: NonstandardMixtureControlRow['controlId'],
  mixtureKind: NonstandardMixtureControlRow['mixtureKind'],
  expectedStatus: NonstandardMixtureControlRow['expectedStatus'],
  observedStatus: NonstandardMixtureControlRow['observedStatus'],
  componentLossReported: boolean,
  maxError: number,
): NonstandardMixtureControlRow {
  return {
    controlId,
    mixtureKind,
    expectedStatus,
    observedStatus,
    componentLossReported,
    maxError: cleanNumber(maxError),
    status: observedStatus,
  };
}

function buildNonstandardMixtureControlSummary(rows: readonly NonstandardMixtureControlRow[]): NonstandardMixtureControlSummary {
  const passCount = rows.filter((row) => row.expectedStatus === row.observedStatus).length;
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length ? 'nonstandard-mixture-rejected' : 'nonstandard-mixture-falsely-admitted',
  };
}

function buildRouteLanguageBoundaryRows(): RouteLanguageBoundaryRow[] {
  return [
    'not-route',
    'not-route-candidate',
    'not-gate-network',
    'not-field-world-passage',
    'not-topological-passage',
    'not-blockage',
  ].map((boundaryId) => ({
    boundaryId: boundaryId as RouteLanguageBoundaryRow['boundaryId'],
    positivePromotionDetected: false,
    status: 'route-language-boundary-pass' as const,
  }));
}

function buildRouteLanguageBoundarySummary(rows: readonly RouteLanguageBoundaryRow[]): RouteLanguageBoundarySummary {
  const passCount = rows.filter((row) => row.status === 'route-language-boundary-pass' && !row.positivePromotionDetected).length;
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    status: passCount === rows.length ? 'route-language-boundary-pass' : 'route-language-boundary-failed',
  };
}

function buildControlRows(args: {
  siteAddressDuplicationControlSummary: SiteAddressDuplicationControlSummary;
  nonstandardMixtureControlRows: readonly NonstandardMixtureControlRow[];
  nonstandardMixtureControlSummary: NonstandardMixtureControlSummary;
  routeLanguageBoundarySummary: RouteLanguageBoundarySummary;
  gateBodies: readonly GateBody[];
  context: OperatorContext;
}): ControlRow[] {
  const zeroError = zeroCompositeMaxError(args.context);
  const duplicateCase = args.siteAddressDuplicationControlSummary;
  const scalarRow = requiredNonstandardRow(args.nonstandardMixtureControlRows, 'N2');
  const sectorRow = requiredNonstandardRow(args.nonstandardMixtureControlRows, 'N3');
  const symmetricRow = requiredNonstandardRow(args.nonstandardMixtureControlRows, 'N0');
  const uniformRow = requiredNonstandardRow(args.nonstandardMixtureControlRows, 'N1');
  const shuffleRow = requiredNonstandardRow(args.nonstandardMixtureControlRows, 'N4');
  return [
    controlRow('C0', 'zero composite', 'zero-composite-not-body-composition', zeroError <= EPSILON ? 'zero-composite-not-body-composition' : 'zero-composite-nonzero', 1, zeroError),
    controlRow('C1', 'duplicate complement-address composite', 'site-address-duplication-rejected', duplicateCase.status, duplicateCase.rowCount, 0),
    controlRow('C2', 'wrong six-body assumption', 'site-address-duplication-rejected', duplicateCase.status, args.gateBodies.length, 0),
    controlRow('C3', 'scalar mixture', 'invalid-scalar-collapse', scalarRow.observedStatus, 1, scalarRow.maxError),
    controlRow('C4', 'sector-collapse mixture', 'invalid-sector-collapse', sectorRow.observedStatus, 1, sectorRow.maxError),
    controlRow('C5', 'nonstandard symmetric square mixture', 'nonstandard-mixture-rejected', symmetricRow.observedStatus, 1, symmetricRow.maxError),
    controlRow('C6', 'uniform hex mixture', 'nonstandard-mixture-rejected', uniformRow.observedStatus, 1, uniformRow.maxError),
    controlRow('C7', 'row/order shuffle', 'standard-support-basis-pass', shuffleRow.observedStatus, 1, shuffleRow.maxError),
    controlRow('C8', 'route-language scan', 'route-language-boundary-pass', args.routeLanguageBoundarySummary.status, args.routeLanguageBoundarySummary.rowCount, 0),
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
  lab6Report: S6Report;
  gateBodyBasisSummary: GateBodyBasisSummary;
  twoAxisCoCompositionSummary: Summary<string, string>;
  threeAxisCoCompositionSummary: Summary<string, string>;
  componentRecoverySummary: Summary<string, string>;
  complementAxisIdentitySummary: Summary<string, string>;
  siteAddressDuplicationControlSummary: SiteAddressDuplicationControlSummary;
  nonstandardMixtureControlSummary: NonstandardMixtureControlSummary;
  routeLanguageBoundarySummary: RouteLanguageBoundarySummary;
  controlRows: readonly ControlRow[];
}): FalsifierRow[] {
  return [
    falsifier('F1', 'Lab-6 parent missing or not accepted.', !parentLab6Accepted(args.lab6Report), `Lab-6 ok=${args.lab6Report.ok}; finalVerdict=${args.lab6Report.finalVerdict}; integrityIssueCount=${args.lab6Report.integrityIssueCount}; offDiagonal=${args.lab6Report.outcomeConfusionSummary.offDiagonalCount}; orbitFail=${args.lab6Report.s4OrbitCoverageSummary.orbitFailCount}.`),
    falsifier('F2', 'Gate-body basis does not reconstruct exactly three bodies.', args.gateBodyBasisSummary.status !== 'gate-body-basis-reconstruction-pass', `bodyCount=${args.gateBodyBasisSummary.bodyCount}; siteAddressCount=${args.gateBodyBasisSummary.siteAddressCount}; status=${args.gateBodyBasisSummary.status}.`),
    falsifier('F3', 'Complement site addresses are split into independent bodies.', args.gateBodyBasisSummary.status === 'complement-axis-pair-split' || args.gateBodyBasisSummary.status === 'six-site-addresses-falsely-treated-as-six-bodies', `basis=${args.gateBodyBasisSummary.status}.`),
    falsifier('F4', 'Two-axis co-composition fails.', args.twoAxisCoCompositionSummary.status !== 'two-axis-co-composition-pass', `twoAxis=${args.twoAxisCoCompositionSummary.status}.`),
    falsifier('F5', 'Three-axis co-composition fails.', args.threeAxisCoCompositionSummary.status !== 'three-axis-co-composition-pass', `threeAxis=${args.threeAxisCoCompositionSummary.status}.`),
    falsifier('F6', 'Component recovery fails.', args.componentRecoverySummary.status !== 'component-recoverable-co-composition', `component=${args.componentRecoverySummary.status}.`),
    falsifier('F7', 'Complement-axis identity is lost after co-composition.', args.complementAxisIdentitySummary.status !== 'complement-axis-identity-preserved', `identity=${args.complementAxisIdentitySummary.status}.`),
    falsifier('F8', 'Site-address duplication is falsely admitted.', args.siteAddressDuplicationControlSummary.status !== 'site-address-duplication-rejected', `duplication=${args.siteAddressDuplicationControlSummary.status}.`),
    falsifier('F9', 'Nonstandard mixture is falsely admitted.', args.nonstandardMixtureControlSummary.status !== 'nonstandard-mixture-rejected', `nonstandard=${args.nonstandardMixtureControlSummary.status}.`),
    falsifier('F10', 'Scalar mixture is admitted.', controlFailed(args.controlRows, 'C3'), `C3=${controlStatus(args.controlRows, 'C3')}.`),
    falsifier('F11', 'Sector-collapse mixture is admitted.', controlFailed(args.controlRows, 'C4'), `C4=${controlStatus(args.controlRows, 'C4')}.`),
    falsifier('F12', 'Row/order dependence appears.', controlFailed(args.controlRows, 'C7'), `C7=${controlStatus(args.controlRows, 'C7')}.`),
    falsifier('F13', 'Route/path/gate-network language is promoted.', args.routeLanguageBoundarySummary.status !== 'route-language-boundary-pass' || controlFailed(args.controlRows, 'C8'), `boundary=${args.routeLanguageBoundarySummary.status}; C8=${controlStatus(args.controlRows, 'C8')}.`),
    falsifier('F14', 'Runtime/UI/packet/Shape mutation appears.', false, 'Lab-7 adds a diagnostic source file and diagnostic script only.'),
  ];
}

function falsifier(falsifierId: FalsifierRow['falsifierId'], description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function classifyFinalVerdict(args: {
  lab6Report: S6Report;
  gateBodyBasisSummary: GateBodyBasisSummary;
  twoAxisCoCompositionSummary: Summary<string, string>;
  threeAxisCoCompositionSummary: Summary<string, string>;
  componentRecoverySummary: Summary<string, string>;
  complementAxisIdentitySummary: Summary<string, string>;
  siteAddressDuplicationControlSummary: SiteAddressDuplicationControlSummary;
  nonstandardMixtureControlSummary: NonstandardMixtureControlSummary;
  routeLanguageBoundarySummary: RouteLanguageBoundarySummary;
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28S7FinalVerdict {
  if (!parentLab6Accepted(args.lab6Report)) return 'T28-S-Lab-7-lab-6-parent-not-accepted';
  if (args.gateBodyBasisSummary.status !== 'gate-body-basis-reconstruction-pass') return 'T28-S-Lab-7-gate-body-basis-reconstruction-failed';
  if (args.twoAxisCoCompositionSummary.status !== 'two-axis-co-composition-pass') return 'T28-S-Lab-7-two-axis-co-composition-failed';
  if (args.threeAxisCoCompositionSummary.status !== 'three-axis-co-composition-pass') return 'T28-S-Lab-7-three-axis-co-composition-failed';
  if (args.componentRecoverySummary.status !== 'component-recoverable-co-composition') return 'T28-S-Lab-7-component-recovery-failed';
  if (args.complementAxisIdentitySummary.status !== 'complement-axis-identity-preserved') return 'T28-S-Lab-7-complement-axis-identity-failed';
  if (args.siteAddressDuplicationControlSummary.status !== 'site-address-duplication-rejected') return 'T28-S-Lab-7-site-address-duplication-control-failed';
  if (args.nonstandardMixtureControlSummary.status !== 'nonstandard-mixture-rejected') return 'T28-S-Lab-7-nonstandard-mixture-control-failed';
  if (falsifierTriggered(args.falsifierRows, 'F10')) return 'T28-S-Lab-7-scalar-collapse-invalidity-failed';
  if (falsifierTriggered(args.falsifierRows, 'F11')) return 'T28-S-Lab-7-sector-collapse-invalidity-failed';
  if (args.routeLanguageBoundarySummary.status !== 'route-language-boundary-pass') return 'T28-S-Lab-7-route-language-boundary-failed';
  if (requiredBoundaryMissing(args.boundaryRows) || falsifierTriggered(args.falsifierRows, 'F13') || falsifierTriggered(args.falsifierRows, 'F14')) return 'T28-S-Lab-7-boundary-failed';
  return 'T28-S-Lab-7-gate-body-co-composition-standard-support-basis-pass';
}

function buildIntegrityIssues(args: {
  lab6Report: S6Report;
  gateBodyBasisRows: readonly GateBodyBasisRow[];
  gateBodyBasisSummary: GateBodyBasisSummary;
  singleBodyTransferRows: readonly SingleBodyTransferRow[];
  singleBodyTransferSummary: Summary<string, string>;
  twoAxisCoCompositionRows: readonly CompositeTransferRow[];
  twoAxisCoCompositionSummary: Summary<string, string>;
  threeAxisCoCompositionRows: readonly CompositeTransferRow[];
  threeAxisCoCompositionSummary: Summary<string, string>;
  componentRecoveryRows: readonly ComponentRecoveryRow[];
  componentRecoverySummary: Summary<string, string>;
  complementAxisIdentityRows: readonly ComplementAxisIdentityRow[];
  complementAxisIdentitySummary: Summary<string, string>;
  siteAddressDuplicationControlRows: readonly SiteAddressDuplicationControlRow[];
  siteAddressDuplicationControlSummary: SiteAddressDuplicationControlSummary;
  nonstandardMixtureControlRows: readonly NonstandardMixtureControlRow[];
  nonstandardMixtureControlSummary: NonstandardMixtureControlSummary;
  routeLanguageBoundaryRows: readonly RouteLanguageBoundaryRow[];
  routeLanguageBoundarySummary: RouteLanguageBoundarySummary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: T28S7FinalVerdict;
}): string[] {
  const issues: string[] = [];
  if (!parentLab6Accepted(args.lab6Report)) issues.push('Lab-6 parent missing/not accepted');
  if (args.gateBodyBasisRows.length !== 3 || args.gateBodyBasisSummary.bodyCount !== 3) issues.push('gate body count not 3');
  if (args.gateBodyBasisSummary.siteAddressCount !== 6) issues.push('site address count not 6');
  if (args.gateBodyBasisRows.some((row) => row.siteAddresses.length !== 2)) issues.push('a gate body does not have exactly 2 site addresses');
  if (args.gateBodyBasisSummary.status === 'complement-axis-pair-split') issues.push('complement pair split');
  if (args.gateBodyBasisSummary.status === 'six-site-addresses-falsely-treated-as-six-bodies') issues.push('six-address-as-six-body interpretation');
  if (args.singleBodyTransferRows.length !== 3 || args.singleBodyTransferSummary.status !== 'standard-support-basis-pass') issues.push('single-body transfer rows failed');
  if (args.twoAxisCoCompositionRows.length !== 12 || args.twoAxisCoCompositionSummary.status !== 'two-axis-co-composition-pass') issues.push('two-axis co-composition rows failed');
  if (args.threeAxisCoCompositionRows.length !== 8 || args.threeAxisCoCompositionSummary.status !== 'three-axis-co-composition-pass') issues.push('three-axis co-composition rows failed');
  if (args.componentRecoveryRows.length !== 48 || args.componentRecoverySummary.status !== 'component-recoverable-co-composition') issues.push('component recovery rows failed');
  if (args.complementAxisIdentityRows.length !== 48 || args.complementAxisIdentitySummary.status !== 'complement-axis-identity-preserved') issues.push('complement-axis identity rows failed');
  if (args.siteAddressDuplicationControlRows.length !== 2 || args.siteAddressDuplicationControlSummary.status !== 'site-address-duplication-rejected') issues.push('site-address duplication controls failed');
  if (args.nonstandardMixtureControlRows.length !== 5 || args.nonstandardMixtureControlSummary.status !== 'nonstandard-mixture-rejected') issues.push('nonstandard mixture controls failed');
  if (args.routeLanguageBoundaryRows.length !== 6 || args.routeLanguageBoundarySummary.status !== 'route-language-boundary-pass') issues.push('route-language boundary rows failed');
  if (args.controlRows.length !== 9 || args.controlRows.some((row) => row.status !== 'control-pass')) issues.push('control row missing or failed');
  if (requiredBoundaryMissing(args.boundaryRows)) issues.push('required boundary missing');
  if (REQUIRED_FALSIFIER_IDS.some((id) => !args.falsifierRows.some((row) => row.falsifierId === id)) || args.falsifierRows.some((row) => row.triggered)) {
    issues.push('falsifier row missing or triggered');
  }
  const expectedVerdict = classifyFinalVerdict({
    lab6Report: args.lab6Report,
    gateBodyBasisSummary: args.gateBodyBasisSummary,
    twoAxisCoCompositionSummary: args.twoAxisCoCompositionSummary,
    threeAxisCoCompositionSummary: args.threeAxisCoCompositionSummary,
    componentRecoverySummary: args.componentRecoverySummary,
    complementAxisIdentitySummary: args.complementAxisIdentitySummary,
    siteAddressDuplicationControlSummary: args.siteAddressDuplicationControlSummary,
    nonstandardMixtureControlSummary: args.nonstandardMixtureControlSummary,
    routeLanguageBoundarySummary: args.routeLanguageBoundarySummary,
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

function buildSiteForms(context: OperatorContext): SiteForm[] {
  const siteIds: SiteId[] = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
  return siteIds.map((siteId) => buildSiteForm(siteId, context));
}

function buildSiteForm(siteId: SiteId, context: OperatorContext): SiteForm {
  const sourcePair = sourcePairForSite(siteId);
  const complementPair = complementPairForSite(siteId);
  const qS = sumVec3(sourcePair.map((label) => context.qByLabel.get(label) ?? zeroVec3()));
  const squareForwardId = squareIdForDirectedPair(context, sourcePair, complementPair);
  const squareReverseId = squareIdForDirectedPair(context, complementPair, sourcePair);
  const squareAntiPair = setSectionValue(
    setSectionValue(buildZeroSquareSection(context), squareForwardId, qS),
    squareReverseId,
    scaleVec3(qS, -1),
  );
  const hexEnvelope = context.hexIds.reduce((section, hexId) => {
    const omittedLabel = hexLabelFromId(hexId);
    const scale = sourcePair.includes(omittedLabel) ? -1 / 3 : 1 / 3;
    return setSectionValue(section, hexId, scaleVec3(qS, scale));
  }, buildZeroHexSection(context));
  return {
    siteId,
    edgeId: edgeIdFromPair(sourcePair),
    sourcePair,
    complementPair,
    qS,
    squareForwardId,
    squareReverseId,
    squareAntiPair,
    hexEnvelope,
    complementSiteId: childIdFromEdge(complementEdge(edgeIdFromPair(sourcePair))),
  };
}

function buildGateBodies(siteForms: readonly SiteForm[]): GateBody[] {
  const siteById = new Map(siteForms.map((site) => [site.siteId, site]));
  return BODY_DEFINITIONS.map((definition) => {
    const representative = requiredSite(siteById, definition.representativeSiteId);
    return {
      bodyId: definition.bodyId,
      siteAddresses: definition.siteAddresses,
      representativeSiteId: definition.representativeSiteId,
      complementSiteId: representative.complementSiteId,
      representativeQAxis: representative.qS,
      squareSupportForm: representative.squareAntiPair,
      hexSupportForm: representative.hexEnvelope,
      squareSupportIds: [representative.squareForwardId, representative.squareReverseId],
    };
  });
}

function buildSiteAddressMembership(gateBodies: readonly GateBody[]): Map<SiteId, GateBodyId> {
  return new Map(gateBodies.flatMap((body) => body.siteAddresses.map((siteId) => [siteId, body.bodyId] as const)));
}

function buildTwoAxisFixtures(gateBodies: readonly GateBody[], context: OperatorContext): CompositeFixture[] {
  const fixtures: CompositeFixture[] = [];
  const coefficientPairs: Array<[number, number]> = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  for (let leftIndex = 0; leftIndex < gateBodies.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < gateBodies.length; rightIndex += 1) {
      for (const [leftCoefficient, rightCoefficient] of coefficientPairs) {
        const left = gateBodies[leftIndex];
        const right = gateBodies[rightIndex];
        const coefficients = coefficientRecord([[left.bodyId, leftCoefficient], [right.bodyId, rightCoefficient]]);
        fixtures.push({
          compositeId: `two-axis:${left.bodyId}+${right.bodyId}:${formatCoefficient(leftCoefficient)},${formatCoefficient(rightCoefficient)}`,
          componentBodyIds: [left.bodyId, right.bodyId],
          coefficients,
          expectedSquareComposite: combineBodySections(gateBodies, context.squareIds, coefficients, 'square'),
          expectedHexComposite: combineBodySections(gateBodies, context.hexIds, coefficients, 'hex'),
        });
      }
    }
  }
  return fixtures;
}

function buildThreeAxisFixtures(gateBodies: readonly GateBody[], context: OperatorContext): CompositeFixture[] {
  const fixtures: CompositeFixture[] = [];
  const coefficientTriples: Array<[number, number, number]> = [
    [1, 1, 1],
    [1, 1, -1],
    [1, -1, 1],
    [1, -1, -1],
    [-1, 1, 1],
    [-1, 1, -1],
    [-1, -1, 1],
    [-1, -1, -1],
  ];
  for (const triple of coefficientTriples) {
    const coefficients = coefficientRecord(gateBodies.map((body, index) => [body.bodyId, triple[index]]));
    fixtures.push({
      compositeId: `three-axis:${triple.map(formatCoefficient).join(',')}`,
      componentBodyIds: gateBodies.map((body) => body.bodyId),
      coefficients,
      expectedSquareComposite: combineBodySections(gateBodies, context.squareIds, coefficients, 'square'),
      expectedHexComposite: combineBodySections(gateBodies, context.hexIds, coefficients, 'hex'),
    });
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

function recoverCoefficientFromSquare(compositeSquare: Section, body: GateBody): number {
  const coefficients = body.squareSupportIds.map((squareId) => {
    const base = body.squareSupportForm.values.get(squareId) ?? zeroVec3();
    const observed = compositeSquare.values.get(squareId) ?? zeroVec3();
    const denominator = dotVec3(base, base);
    return denominator <= EPSILON ? 0 : dotVec3(observed, base) / denominator;
  });
  return average(coefficients);
}

function recoverComponentSquareSection(compositeSquare: Section, body: GateBody): Section {
  const values = new Map(compositeSquare.ids.map((id) => [id, zeroVec3()] as const));
  for (const squareId of body.squareSupportIds) {
    values.set(squareId, compositeSquare.values.get(squareId) ?? zeroVec3());
  }
  return sectionFromValues(compositeSquare.ids, values);
}

function recoverCoefficientFromHex(compositeHex: Section, body: GateBody): number {
  const coefficients = body.hexSupportForm.ids.map((hexId) => {
    const base = body.hexSupportForm.values.get(hexId) ?? zeroVec3();
    const observed = compositeHex.values.get(hexId) ?? zeroVec3();
    const denominator = dotVec3(base, base);
    return denominator <= EPSILON ? 0 : dotVec3(observed, base) / denominator;
  });
  return average(coefficients);
}

function buildSymmetricSquareSection(body: GateBody, context: OperatorContext): Section {
  const forward = body.squareSupportIds[0];
  const reverse = body.squareSupportIds[1];
  return setSectionValue(setSectionValue(buildZeroSquareSection(context), forward, body.representativeQAxis), reverse, body.representativeQAxis);
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

function rowOrderShuffleMaxError(context: OperatorContext, gateBodies: readonly GateBody[]): number {
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
  const coefficients = coefficientRecord(gateBodies.map((body) => [body.bodyId, 1]));
  const square = combineBodySections(gateBodies, context.squareIds, coefficients, 'square');
  const hex = combineBodySections(gateBodies, context.hexIds, coefficients, 'hex');
  const reversedSquare = reorderSection(square, reversedSquareIds);
  const reversedHex = reorderSection(hex, reversedHexIds);
  return Math.max(
    compareSquareSections(applyPQ(context, square), applyPQ(reversedContext, reversedSquare)),
    compareHexSections(applyPH(context, hex), applyPH(reversedContext, reversedHex)),
    compareHexSections(applyD(context, square), applyD(reversedContext, reversedSquare)),
    compareSquareSections(applyRExact(context, hex), applyRExact(reversedContext, reversedHex)),
    compareSquareSections(applyRAdj(context, hex), applyRAdj(reversedContext, reversedHex)),
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

function sectionFromValues(ids: readonly string[], values: Map<string, Vec3>): Section {
  return { ids: [...ids], values: new Map(values) };
}

function setSectionValue(section: Section, objectId: string, value: Vec3): Section {
  const values = new Map(section.values);
  values.set(objectId, value);
  return sectionFromValues(section.ids, values);
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

function squareIdForDirectedPair(context: OperatorContext, sourcePair: readonly A3Label[], targetPair: readonly A3Label[]): string {
  return context.squarePolarityByDirectedPair.get(directedPairKey(sourcePair, targetPair))?.squareObjectId ?? `missing-square:${sourcePair.join('')}|${targetPair.join('')}`;
}

function sourcePairForSite(siteId: SiteId): [A3Label, A3Label] {
  return [siteId[2] as A3Label, siteId[3] as A3Label];
}

function complementPairForSite(siteId: SiteId): [A3Label, A3Label] {
  return labelSort(A3_LABELS.filter((label) => !sourcePairForSite(siteId).includes(label)));
}

function edgeIdFromPair(pair: readonly A3Label[]): EdgeId {
  return labelSort(pair).join('') as EdgeId;
}

function complementEdge(edge: EdgeId): EdgeId {
  return edgeIdFromPair(A3_LABELS.filter((label) => !edge.includes(label)));
}

function childIdFromEdge(edge: EdgeId): SiteId {
  return `M_${edge}` as SiteId;
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
  return Object.fromEntries(BODY_IDS.map((bodyId) => [bodyId, record[bodyId] ?? 0]));
}

function requiredBody(bodyById: Map<GateBodyId, GateBody>, bodyId: GateBodyId): GateBody {
  const body = bodyById.get(bodyId);
  if (!body) throw new Error(`Missing gate body ${bodyId}`);
  return body;
}

function requiredSite(siteById: Map<SiteId, SiteForm>, siteId: SiteId): SiteForm {
  const site = siteById.get(siteId);
  if (!site) throw new Error(`Missing site ${siteId}`);
  return site;
}

function requiredNonstandardRow(rows: readonly NonstandardMixtureControlRow[], controlId: NonstandardMixtureControlRow['controlId']): NonstandardMixtureControlRow {
  const row = rows.find((candidate) => candidate.controlId === controlId);
  if (!row) throw new Error(`Missing nonstandard control row ${controlId}`);
  return row;
}

function parentLab6Accepted(report: S6Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-6-site-level-selective-transfer-gate-precondition-pass' &&
    report.integrityIssueCount === 0 &&
    report.outcomeConfusionSummary.offDiagonalCount === 0 &&
    report.s4OrbitCoverageSummary.orbitFailCount === 0;
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

function formatCoefficient(value: number): string {
  return value > 0 ? '+1' : '-1';
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

function sumVec3(values: readonly Vec3[]): Vec3 {
  return values.reduce((sum, value) => addVec3(sum, value), zeroVec3());
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
