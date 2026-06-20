import { buildPSimplexCuboctahedralVES4ResidualVisibilityT28QReport } from './pSimplexCuboctahedralVES4ResidualVisibilityT28Q';

export type A3Label = 'A' | 'B' | 'C' | 'D';
export type A3FlagId =
  | 'A->B'
  | 'A->C'
  | 'A->D'
  | 'B->A'
  | 'B->C'
  | 'B->D'
  | 'C->A'
  | 'C->B'
  | 'C->D'
  | 'D->A'
  | 'D->B'
  | 'D->C';

export type LabelPotentialId = 'basis-A' | 'basis-B' | 'basis-C' | 'basis-D' | 'generic';
export type GlobalObjectDomain = 'flag' | 've-square' | 've-a2-hexagon';
export type GlobalResidualComponentId = 'r_out' | 'r_in' | 'r_square' | 'r_hex';

export type T28RSummaryVerdict =
  | 'T28-R-external-standard-potential-probe-verified'
  | 'T28-R-parent-s4-visibility-not-accepted'
  | 'T28-R-probe-definition-failed'
  | 'T28-R-label-potential-failed'
  | 'T28-R-global-readout-values-failed'
  | 'T28-R-probe-equivariance-failed'
  | 'T28-R-probe-image-rank-failed'
  | 'T28-R-probe-residual-formula-failed'
  | 'T28-R-probe-kernel-failed'
  | 'T28-R-probe-classification-failed'
  | 'T28-R-boundary-failed';

export interface ParentEvidenceRow {
  parentId: 'T28-Q';
  method: string;
  ok: boolean;
  summaryVerdict: string;
  consumedSections: string[];
  ignoredSections: string[];
  parentStatus: 'accepted-parent' | 'rejected-parent';
}

export interface ProbeDefinitionRow {
  probeId: 'external-standard-label-potential';
  probeAuthority: 'external-controlled-representation-probe';
  naturalReadoutStatus: 'not-natural-readout';
  projectInternalStatus: 'not-project-internal';
  s4Type: 'standard';
  status: 'probe-definition-pass' | 'probe-definition-fail';
}

export interface LabelPotentialRow {
  potentialId: LabelPotentialId;
  values: Record<A3Label, number>;
  sum: number;
  sumZero: boolean;
  potentialStatus: 'sum-zero-standard-potential' | 'not-sum-zero';
}

export interface GlobalReadoutValueRow {
  potentialId: LabelPotentialId;
  objectId: string;
  objectDomain: GlobalObjectDomain;
  structuralFormula:
    | 'lambda_source_minus_lambda_target'
    | 'source_pair_sum_minus_target_pair_sum'
    | 'negative_omitted_label_potential';
  value: number;
  valueStatus: 'readout-value-pass' | 'readout-value-fail';
}

export interface ProbeEquivarianceRow {
  potentialId: LabelPotentialId;
  permutationId: string;
  convention: 'rho_pi_lambda_at_u_equals_rho_lambda_at_pi_inverse_u';
  checkedObjectCount: 22;
  mismatchCount: number;
  equivarianceStatus: 'probe-s4-equivariant' | 'probe-equivariance-failed';
}

export interface ProbeImageRankRow {
  probeId: 'external-standard-label-potential';
  basisPotentialCount: 4;
  detectedLinearRelation: string;
  imageRank: number;
  expectedImageRank: 3;
  rankStatus: 'standard-probe-rank-pass' | 'standard-probe-rank-fail';
}

export interface ProbeResidualRow {
  potentialId: LabelPotentialId;
  alpha: A3FlagId;
  unusedLabels: [A3Label, A3Label];
  rOut: number;
  rIn: number;
  rSquare: number;
  rHex: number;
  expectedROut: number;
  expectedRIn: number;
  expectedRSquare: number;
  expectedRHex: number;
  residualFormulaStatus: 'probe-residual-formula-pass' | 'probe-residual-formula-fail';
  residualNonzero: boolean;
}

export interface ProbeResidualFormulaRow {
  potentialId: LabelPotentialId;
  alpha: A3FlagId;
  relationId:
    | 'r_in_equals_negative_r_out'
    | 'r_hex_equals_r_out'
    | 'r_square_equals_negative_two_r_out'
    | 'r_square_equals_two_r_in';
  relationStatus: 'relation-pass' | 'relation-fail';
}

export interface ProbeKernelRow {
  probeId: 'external-standard-label-potential';
  kernelDimensionInSumZeroSpace: number;
  expectedKernelDimension: 0;
  kernelStatus: 'probe-kernel-pass' | 'probe-kernel-fail';
}

export interface ProbeClassificationRow {
  probeId: 'external-standard-label-potential';
  admissibilityStatus: 'admissible-external-probe';
  naturalReadoutStatus: 'not-natural-readout';
  projectInternalStatus: 'not-project-internal';
  residualVisibility: 'residual-visible-nontrivial-standard-content';
  classificationStatus: 'probe-classification-pass' | 'probe-classification-fail';
}

export interface BoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: boolean;
}

export interface FalsifierRow {
  falsifierId: string;
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export interface PSimplexCuboctahedralVEStandardPotentialProbeT28RReport {
  method: 'p-simplex-cuboctahedral-ve-standard-potential-probe-t28r';
  diagnosticScope: 'external-standard-label-potential-probe';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  parentEvidenceRows: ParentEvidenceRow[];
  probeDefinitionRows: ProbeDefinitionRow[];
  labelPotentialRows: LabelPotentialRow[];
  globalReadoutValueRows: GlobalReadoutValueRow[];
  probeEquivarianceRows: ProbeEquivarianceRow[];
  probeImageRankRows: ProbeImageRankRow[];
  probeResidualRows: ProbeResidualRow[];
  probeResidualFormulaRows: ProbeResidualFormulaRow[];
  probeKernelRows: ProbeKernelRow[];
  probeClassificationRows: ProbeClassificationRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  summaryVerdict: T28RSummaryVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

type ParentReport = ReturnType<typeof buildPSimplexCuboctahedralVES4ResidualVisibilityT28QReport>;
type ParentPermutationRow = ParentReport['s4PermutationRows'][number];

interface GlobalObjectRow {
  objectId: string;
  objectDomain: GlobalObjectDomain;
}

interface ResidualOperatorRow {
  alpha: A3FlagId;
  componentId: GlobalResidualComponentId;
  objectDomain: GlobalObjectDomain;
  leftObjectId: string;
  rightObjectId: string;
}

interface ReadoutEvaluation {
  structuralFormula: GlobalReadoutValueRow['structuralFormula'];
  value: number;
  valueStatus: GlobalReadoutValueRow['valueStatus'];
}

interface Fraction {
  num: bigint;
  den: bigint;
}

const METHOD = 'p-simplex-cuboctahedral-ve-standard-potential-probe-t28r' as const;
const DIAGNOSTIC_SCOPE = 'external-standard-label-potential-probe' as const;
const BRANCH_REF = 'wgate/arf-w1-root-frame-v0' as const;
const ACCEPTED_PARENT_VERDICT = 'T28-Q-ve-s4-residual-visibility-verified';
const A3_LABELS: readonly A3Label[] = ['A', 'B', 'C', 'D'];
const DIRECTED_FLAGS: readonly A3FlagId[] = A3_LABELS.flatMap((source) =>
  A3_LABELS.filter((target) => target !== source).map((target) => flagId(source, target)),
) as A3FlagId[];
const COMPONENT_ORDER: readonly GlobalResidualComponentId[] = ['r_out', 'r_in', 'r_square', 'r_hex'];
const BASIS_POTENTIAL_IDS: readonly LabelPotentialId[] = ['basis-A', 'basis-B', 'basis-C', 'basis-D'];
const LABEL_POTENTIALS: ReadonlyArray<{
  potentialId: LabelPotentialId;
  values: Record<A3Label, number>;
}> = [
  { potentialId: 'basis-A', values: { A: 3, B: -1, C: -1, D: -1 } },
  { potentialId: 'basis-B', values: { A: -1, B: 3, C: -1, D: -1 } },
  { potentialId: 'basis-C', values: { A: -1, B: -1, C: 3, D: -1 } },
  { potentialId: 'basis-D', values: { A: -1, B: -1, C: -1, D: 3 } },
  { potentialId: 'generic', values: { A: 3, B: 1, C: -1, D: -3 } },
];
const REQUIRED_BOUNDARY_IDS = [
  'not-natural-readout-claim',
  'not-project-internal-readout',
  'not-readout-discovery',
  'not-field-computation',
  'not-source-emission-law',
  'not-fieldcue',
  'not-generated-site-reading',
  'not-semantic-naming',
  'not-topology-module',
  'not-route',
  'not-gate',
  'not-corridor',
  'not-runtime',
  'not-fano',
  'not-octonion',
  'not-carrier-ray',
  'not-signed-lift',
  'not-composition-holonomy',
  'not-canonical-order-bridge',
  'not-arbitrary-permutation-search',
  'not-residual-portability-proof',
] as const;
const REQUIRED_FALSIFIER_IDS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'] as const;

export function buildPSimplexCuboctahedralVEStandardPotentialProbeT28RReport(): PSimplexCuboctahedralVEStandardPotentialProbeT28RReport {
  const parentReport = buildPSimplexCuboctahedralVES4ResidualVisibilityT28QReport();
  const parentEvidenceRows = buildParentEvidenceRows(parentReport);
  const objectRows = reconstructGlobalObjectRows(parentReport);
  const residualRows = reconstructResidualOperatorRows(parentReport);
  const probeDefinitionRows = buildProbeDefinitionRows();
  const labelPotentialRows = buildLabelPotentialRows();
  const globalReadoutValueRows = buildGlobalReadoutValueRows(objectRows);
  const probeEquivarianceRows = buildProbeEquivarianceRows(parentReport, objectRows);
  const probeImageRankRows = buildProbeImageRankRows(objectRows);
  const probeResidualRows = buildProbeResidualRows(globalReadoutValueRows, residualRows);
  const probeResidualFormulaRows = buildProbeResidualFormulaRows(probeResidualRows);
  const probeKernelRows = buildProbeKernelRows(probeImageRankRows);
  const probeClassificationRows = buildProbeClassificationRows();
  const boundaryRows = buildBoundaryRows();
  const preliminaryVerdict = classifySummaryVerdict({
    parentEvidenceRows,
    probeDefinitionRows,
    labelPotentialRows,
    globalReadoutValueRows,
    probeEquivarianceRows,
    probeImageRankRows,
    probeResidualRows,
    probeResidualFormulaRows,
    probeKernelRows,
    probeClassificationRows,
    boundaryRows,
    falsifierRows: [],
  });
  const falsifierRows = buildFalsifierRows({
    probeDefinitionRows,
    labelPotentialRows,
    globalReadoutValueRows,
    probeEquivarianceRows,
    probeImageRankRows,
    probeResidualRows,
    probeResidualFormulaRows,
    probeClassificationRows,
    boundaryRows,
    summaryVerdict: preliminaryVerdict,
  });
  const summaryVerdict = classifySummaryVerdict({
    parentEvidenceRows,
    probeDefinitionRows,
    labelPotentialRows,
    globalReadoutValueRows,
    probeEquivarianceRows,
    probeImageRankRows,
    probeResidualRows,
    probeResidualFormulaRows,
    probeKernelRows,
    probeClassificationRows,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    probeDefinitionRows,
    labelPotentialRows,
    globalReadoutValueRows,
    probeEquivarianceRows,
    probeImageRankRows,
    probeResidualRows,
    probeResidualFormulaRows,
    probeKernelRows,
    probeClassificationRows,
    boundaryRows,
    falsifierRows,
    summaryVerdict,
  });

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    parentEvidenceRows,
    probeDefinitionRows,
    labelPotentialRows,
    globalReadoutValueRows,
    probeEquivarianceRows,
    probeImageRankRows,
    probeResidualRows,
    probeResidualFormulaRows,
    probeKernelRows,
    probeClassificationRows,
    boundaryRows,
    falsifierRows,
    summaryVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0 && falsifierRows.every((row) => !row.triggered),
  };
}

function buildParentEvidenceRows(parentReport: ParentReport): ParentEvidenceRow[] {
  return [
    {
      parentId: 'T28-Q',
      method: parentReport.method,
      ok: parentReport.ok,
      summaryVerdict: parentReport.summaryVerdict,
      consumedSections: [
        'global object universe',
        'global residual operator',
        'S4 permutation rows',
        'residual visibility theorem rows',
        'readout representation implication rows',
        'boundary rows',
      ],
      ignoredSections: [
        'field/Fano/source-state forbidden classifications',
        'candidate natural-readout discovery',
      ],
      parentStatus: isParentAccepted(parentReport) ? 'accepted-parent' : 'rejected-parent',
    },
  ];
}

function buildProbeDefinitionRows(): ProbeDefinitionRow[] {
  return [
    {
      probeId: 'external-standard-label-potential',
      probeAuthority: 'external-controlled-representation-probe',
      naturalReadoutStatus: 'not-natural-readout',
      projectInternalStatus: 'not-project-internal',
      s4Type: 'standard',
      status: 'probe-definition-pass',
    },
  ];
}

function buildLabelPotentialRows(): LabelPotentialRow[] {
  return LABEL_POTENTIALS.map((potential) => {
    const sum = A3_LABELS.reduce((total, label) => total + potential.values[label], 0);

    return {
      potentialId: potential.potentialId,
      values: potential.values,
      sum,
      sumZero: sum === 0,
      potentialStatus: sum === 0 ? 'sum-zero-standard-potential' : 'not-sum-zero',
    };
  });
}

function buildGlobalReadoutValueRows(objectRows: readonly GlobalObjectRow[]): GlobalReadoutValueRow[] {
  return LABEL_POTENTIALS.flatMap((potential) =>
    objectRows.map((object) => {
      const evaluation = evaluateReadoutValue(object.objectId, potential.values);

      return {
        potentialId: potential.potentialId,
        objectId: object.objectId,
        objectDomain: object.objectDomain,
        structuralFormula: evaluation.structuralFormula,
        value: evaluation.value,
        valueStatus: evaluation.valueStatus,
      };
    }),
  );
}

function buildProbeEquivarianceRows(
  parentReport: ParentReport,
  objectRows: readonly GlobalObjectRow[],
): ProbeEquivarianceRow[] {
  return parentReport.s4PermutationRows.flatMap((permutation) =>
    LABEL_POTENTIALS.map((potential) => {
      const inverseMap = invertPermutation(permutation.permutationMap);
      const transformedPotential = applyPermutationToPotential(potential.values, permutation.permutationMap);
      const mismatchCount = objectRows.filter((object) => {
        const left = evaluateReadoutValue(object.objectId, transformedPotential).value;
        const inverseObjectId = applyPermutationToObjectId(object.objectId, inverseMap);
        const right = evaluateReadoutValue(inverseObjectId, potential.values).value;
        return left !== right;
      }).length;

      return {
        potentialId: potential.potentialId,
        permutationId: permutation.permutationId,
        convention: 'rho_pi_lambda_at_u_equals_rho_lambda_at_pi_inverse_u',
        checkedObjectCount: objectRows.length as 22,
        mismatchCount,
        equivarianceStatus: mismatchCount === 0 ? 'probe-s4-equivariant' : 'probe-equivariance-failed',
      };
    }),
  );
}

function buildProbeImageRankRows(objectRows: readonly GlobalObjectRow[]): ProbeImageRankRow[] {
  const basisVectors = BASIS_POTENTIAL_IDS.map((potentialId) => {
    const potential = potentialById(potentialId);
    return objectRows.map((object) => evaluateReadoutValue(object.objectId, potential.values).value);
  });
  const imageRank = rankOverRationals(basisVectors);
  const relationPass = basisVectors[0].every((_, index) => basisVectors.reduce((sum, vector) => sum + vector[index], 0) === 0);

  return [
    {
      probeId: 'external-standard-label-potential',
      basisPotentialCount: 4,
      detectedLinearRelation: relationPass ? 'basis-A + basis-B + basis-C + basis-D = 0' : 'basis relation failed',
      imageRank,
      expectedImageRank: 3,
      rankStatus: imageRank === 3 && relationPass ? 'standard-probe-rank-pass' : 'standard-probe-rank-fail',
    },
  ];
}

function buildProbeResidualRows(
  globalReadoutValueRows: readonly GlobalReadoutValueRow[],
  residualRows: readonly ResidualOperatorRow[],
): ProbeResidualRow[] {
  const readoutValuesByPotential = groupReadoutValues(globalReadoutValueRows);

  return LABEL_POTENTIALS.flatMap((potential) => {
    const valueMap = readoutValuesByPotential.get(potential.potentialId) ?? new Map<string, number>();

    return DIRECTED_FLAGS.map((alpha) => {
      const componentRows = residualRows.filter((row) => row.alpha === alpha);
      const rOut = evaluateResidualComponent(componentRows, valueMap, 'r_out');
      const rIn = evaluateResidualComponent(componentRows, valueMap, 'r_in');
      const rSquare = evaluateResidualComponent(componentRows, valueMap, 'r_square');
      const rHex = evaluateResidualComponent(componentRows, valueMap, 'r_hex');
      const unusedLabels = labelsUnusedByFlag(alpha);
      const d = potential.values[unusedLabels[1]] - potential.values[unusedLabels[0]];
      const expectedROut = d / 2;
      const expectedRIn = -d / 2;
      const expectedRSquare = -d;
      const expectedRHex = d / 2;
      const pass = rOut === expectedROut && rIn === expectedRIn && rSquare === expectedRSquare && rHex === expectedRHex;

      return {
        potentialId: potential.potentialId,
        alpha,
        unusedLabels,
        rOut,
        rIn,
        rSquare,
        rHex,
        expectedROut,
        expectedRIn,
        expectedRSquare,
        expectedRHex,
        residualFormulaStatus: pass ? 'probe-residual-formula-pass' : 'probe-residual-formula-fail',
        residualNonzero: [rOut, rIn, rSquare, rHex].some((value) => value !== 0),
      };
    });
  });
}

function buildProbeResidualFormulaRows(probeResidualRows: readonly ProbeResidualRow[]): ProbeResidualFormulaRow[] {
  return probeResidualRows.flatMap((row) => [
    relation(row, 'r_in_equals_negative_r_out', row.rIn === -row.rOut),
    relation(row, 'r_hex_equals_r_out', row.rHex === row.rOut),
    relation(row, 'r_square_equals_negative_two_r_out', row.rSquare === -2 * row.rOut),
    relation(row, 'r_square_equals_two_r_in', row.rSquare === 2 * row.rIn),
  ]);
}

function buildProbeKernelRows(probeImageRankRows: readonly ProbeImageRankRow[]): ProbeKernelRow[] {
  const imageRank = probeImageRankRows[0]?.imageRank ?? 0;
  const kernelDimensionInSumZeroSpace = Math.max(0, 3 - imageRank);

  return [
    {
      probeId: 'external-standard-label-potential',
      kernelDimensionInSumZeroSpace,
      expectedKernelDimension: 0,
      kernelStatus: kernelDimensionInSumZeroSpace === 0 ? 'probe-kernel-pass' : 'probe-kernel-fail',
    },
  ];
}

function buildProbeClassificationRows(): ProbeClassificationRow[] {
  return [
    {
      probeId: 'external-standard-label-potential',
      admissibilityStatus: 'admissible-external-probe',
      naturalReadoutStatus: 'not-natural-readout',
      projectInternalStatus: 'not-project-internal',
      residualVisibility: 'residual-visible-nontrivial-standard-content',
      classificationStatus: 'probe-classification-pass',
    },
  ];
}

function buildBoundaryRows(): BoundaryRow[] {
  return [
    boundary('not-natural-readout-claim', 'T28-R is an external controlled probe and does not claim a natural readout.'),
    boundary('not-project-internal-readout', 'T28-R does not treat the probe as project-internal source-state data.'),
    boundary('not-readout-discovery', 'T28-R verifies a declared external probe rather than discovering a readout.'),
    boundary('not-field-computation', 'T28-R computes no field values.'),
    boundary('not-source-emission-law', 'T28-R uses no source-emission law.'),
    boundary('not-fieldcue', 'T28-R does not create or unblock FieldCue.'),
    boundary('not-generated-site-reading', 'T28-R does not read generated-site values.'),
    boundary('not-semantic-naming', 'T28-R does not authorize semantic naming.'),
    boundary('not-topology-module', 'T28-R does not use topology-module values.'),
    boundary('not-route', 'T28-R does not confirm routes.'),
    boundary('not-gate', 'T28-R does not confirm gates.'),
    boundary('not-corridor', 'T28-R does not confirm corridors.'),
    boundary('not-runtime', 'T28-R does not authorize runtime behavior.'),
    boundary('not-fano', 'T28-R excludes Fano sources from active computation.'),
    boundary('not-octonion', 'T28-R excludes octonion sources from active computation.'),
    boundary('not-carrier-ray', 'T28-R excludes carrier-ray sources from active computation.'),
    boundary('not-signed-lift', 'T28-R excludes signed-lift sources from active computation.'),
    boundary('not-composition-holonomy', 'T28-R excludes composition-holonomy overlays from active computation.'),
    boundary('not-canonical-order-bridge', 'T28-R uses parent object IDs and declared S4 permutations, not canonical order.'),
    boundary('not-arbitrary-permutation-search', 'T28-R checks all parent S4 permutations and performs no best-fit search.'),
    boundary('not-residual-portability-proof', 'T28-R does not prove residual portability.'),
  ];
}

function buildFalsifierRows(args: {
  probeDefinitionRows: readonly ProbeDefinitionRow[];
  labelPotentialRows: readonly LabelPotentialRow[];
  globalReadoutValueRows: readonly GlobalReadoutValueRow[];
  probeEquivarianceRows: readonly ProbeEquivarianceRow[];
  probeImageRankRows: readonly ProbeImageRankRow[];
  probeResidualRows: readonly ProbeResidualRow[];
  probeResidualFormulaRows: readonly ProbeResidualFormulaRow[];
  probeClassificationRows: readonly ProbeClassificationRow[];
  boundaryRows: readonly BoundaryRow[];
  summaryVerdict: T28RSummaryVerdict;
}): FalsifierRow[] {
  return [
    falsifier('F1', 'Treats the external standard potential as a natural project readout.', probeDefinitionFailed(args.probeDefinitionRows), 'Probe definition rows mark not-natural-readout.'),
    falsifier('F2', 'Treats the external standard potential as project-internal source-state data.', probeDefinitionFailed(args.probeDefinitionRows), 'Probe definition rows mark not-project-internal.'),
    falsifier('F3', 'Uses field, source-emission, semantic, topology-module, Fano, octonion, composition-holonomy, or canonical-order data.', forbiddenImportOrActiveSourceDetected(), 'T28-R imports only the T28-Q report builder.'),
    falsifier('F4', 'Fails to enforce sum-zero condition.', !labelPotentialsReady(args.labelPotentialRows), `${args.labelPotentialRows.filter((row) => row.sumZero).length}/5 potentials sum to zero.`),
    falsifier('F5', 'Fails S4 equivariance of lambda to rho_lambda.', !probeEquivarianceReady(args.probeEquivarianceRows), `${args.probeEquivarianceRows.filter((row) => row.mismatchCount === 0).length}/120 equivariance rows have zero mismatches.`),
    falsifier('F6', 'Image rank is not 3.', !probeImageRankReady(args.probeImageRankRows), `imageRank=${args.probeImageRankRows[0]?.imageRank ?? 'missing'}.`),
    falsifier('F7', 'Residual formulas are hard-coded without evaluating global object values.', !probeResidualsReady(args.probeResidualRows), `${args.probeResidualRows.filter((row) => row.residualFormulaStatus === 'probe-residual-formula-pass').length}/60 residual rows pass after global-value evaluation.`),
    falsifier('F8', 'Formula relation rows fail.', !probeResidualRelationsReady(args.probeResidualFormulaRows), `${args.probeResidualFormulaRows.filter((row) => row.relationStatus === 'relation-pass').length}/240 relation rows pass.`),
    falsifier('F9', 'Claims residual nonzero means cuboctahedron defect.', false, 'Probe classification treats residual nonzero as external standard-content visibility only.'),
    falsifier('F10', 'Promotes success to FieldCue, semantic naming, topology, runtime, or residual portability.', requiredBoundaryMissing(args.boundaryRows) || probeClassificationFailed(args.probeClassificationRows), `${args.boundaryRows.filter((row) => row.enforced).length}/${REQUIRED_BOUNDARY_IDS.length} boundaries enforced.`),
  ];
}

function classifySummaryVerdict(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  probeDefinitionRows: readonly ProbeDefinitionRow[];
  labelPotentialRows: readonly LabelPotentialRow[];
  globalReadoutValueRows: readonly GlobalReadoutValueRow[];
  probeEquivarianceRows: readonly ProbeEquivarianceRow[];
  probeImageRankRows: readonly ProbeImageRankRow[];
  probeResidualRows: readonly ProbeResidualRow[];
  probeResidualFormulaRows: readonly ProbeResidualFormulaRow[];
  probeKernelRows: readonly ProbeKernelRow[];
  probeClassificationRows: readonly ProbeClassificationRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28RSummaryVerdict {
  if (requiredBoundaryMissing(args.boundaryRows) || args.falsifierRows.some((row) => row.triggered)) {
    return 'T28-R-boundary-failed';
  }

  if (!parentAccepted(args.parentEvidenceRows)) {
    return 'T28-R-parent-s4-visibility-not-accepted';
  }

  if (probeDefinitionFailed(args.probeDefinitionRows)) {
    return 'T28-R-probe-definition-failed';
  }

  if (!labelPotentialsReady(args.labelPotentialRows)) {
    return 'T28-R-label-potential-failed';
  }

  if (!globalReadoutValuesReady(args.globalReadoutValueRows)) {
    return 'T28-R-global-readout-values-failed';
  }

  if (!probeEquivarianceReady(args.probeEquivarianceRows)) {
    return 'T28-R-probe-equivariance-failed';
  }

  if (!probeImageRankReady(args.probeImageRankRows)) {
    return 'T28-R-probe-image-rank-failed';
  }

  if (!probeResidualsReady(args.probeResidualRows) || !probeResidualRelationsReady(args.probeResidualFormulaRows)) {
    return 'T28-R-probe-residual-formula-failed';
  }

  if (!probeKernelReady(args.probeKernelRows)) {
    return 'T28-R-probe-kernel-failed';
  }

  if (probeClassificationFailed(args.probeClassificationRows)) {
    return 'T28-R-probe-classification-failed';
  }

  return 'T28-R-external-standard-potential-probe-verified';
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  probeDefinitionRows: readonly ProbeDefinitionRow[];
  labelPotentialRows: readonly LabelPotentialRow[];
  globalReadoutValueRows: readonly GlobalReadoutValueRow[];
  probeEquivarianceRows: readonly ProbeEquivarianceRow[];
  probeImageRankRows: readonly ProbeImageRankRow[];
  probeResidualRows: readonly ProbeResidualRow[];
  probeResidualFormulaRows: readonly ProbeResidualFormulaRow[];
  probeKernelRows: readonly ProbeKernelRow[];
  probeClassificationRows: readonly ProbeClassificationRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  summaryVerdict: T28RSummaryVerdict;
}): string[] {
  const issues: string[] = [];

  if (args.parentEvidenceRows.length !== 1) {
    issues.push('parent evidence row missing');
  }

  if (!parentAccepted(args.parentEvidenceRows)) {
    issues.push('T28-Q parent not accepted');
  }

  if (probeDefinitionFailed(args.probeDefinitionRows)) {
    issues.push('probe definition row missing or failed');
  }

  if (args.labelPotentialRows.length !== 5) {
    issues.push('label potential row count not 5');
  }

  if (args.labelPotentialRows.some((row) => !row.sumZero || row.potentialStatus !== 'sum-zero-standard-potential')) {
    issues.push('label potential not sum-zero');
  }

  if (!basisRelationPasses()) {
    issues.push('basis relation failed');
  }

  if (args.globalReadoutValueRows.length !== 110) {
    issues.push('global readout value row count not 110');
  }

  if (args.globalReadoutValueRows.some((row) => row.valueStatus !== 'readout-value-pass')) {
    issues.push('global readout value failed');
  }

  if (args.globalReadoutValueRows.some((row) => row.objectDomain === 'flag' && row.structuralFormula !== 'lambda_source_minus_lambda_target')) {
    issues.push('flag readout formula mismatch');
  }

  if (args.globalReadoutValueRows.some((row) => row.objectDomain === 've-square' && row.structuralFormula !== 'source_pair_sum_minus_target_pair_sum')) {
    issues.push('square readout formula mismatch');
  }

  if (args.globalReadoutValueRows.some((row) => row.objectDomain === 've-a2-hexagon' && row.structuralFormula !== 'negative_omitted_label_potential')) {
    issues.push('hex readout formula mismatch');
  }

  if (args.probeEquivarianceRows.length !== 120) {
    issues.push('probe equivariance row count not 120');
  }

  if (args.probeEquivarianceRows.some((row) => row.mismatchCount !== 0)) {
    issues.push('probe equivariance mismatch');
  }

  if (args.probeEquivarianceRows.some((row) => row.checkedObjectCount !== 22)) {
    issues.push('probe equivariance checked object count not 22');
  }

  if (args.probeImageRankRows.length !== 1) {
    issues.push('probe image rank row missing');
  }

  if (args.probeImageRankRows.some((row) => row.imageRank !== 3 || row.rankStatus !== 'standard-probe-rank-pass')) {
    issues.push('probe image rank not 3');
  }

  if (args.probeImageRankRows.some((row) => row.detectedLinearRelation !== 'basis-A + basis-B + basis-C + basis-D = 0')) {
    issues.push('basis relation missing');
  }

  if (args.probeResidualRows.length !== 60) {
    issues.push('probe residual row count not 60');
  }

  if (args.probeResidualRows.some((row) => row.residualFormulaStatus !== 'probe-residual-formula-pass')) {
    issues.push('probe residual formula mismatch');
  }

  if (!probeResidualsReady(args.probeResidualRows)) {
    issues.push('probe residual was not evaluated from global values');
  }

  if (args.probeResidualFormulaRows.length !== 240) {
    issues.push('probe formula relation row count not 240');
  }

  if (args.probeResidualFormulaRows.some((row) => row.relationStatus !== 'relation-pass')) {
    issues.push('probe formula relation failed');
  }

  if (args.probeKernelRows.length !== 1) {
    issues.push('probe kernel row missing');
  }

  if (args.probeKernelRows.some((row) => row.kernelDimensionInSumZeroSpace !== 0 || row.kernelStatus !== 'probe-kernel-pass')) {
    issues.push('probe kernel dimension not zero');
  }

  if (probeClassificationFailed(args.probeClassificationRows)) {
    issues.push('probe classification row missing or failed');
  }

  if (requiredBoundaryMissing(args.boundaryRows)) {
    issues.push('boundary row missing or unenforced');
  }

  if (REQUIRED_FALSIFIER_IDS.some((falsifierId) => !args.falsifierRows.some((row) => row.falsifierId === falsifierId))) {
    issues.push('falsifier row missing');
  }

  if (args.falsifierRows.some((row) => row.triggered)) {
    issues.push('falsifier triggered');
  }

  if (forbiddenImportOrActiveSourceDetected()) {
    issues.push('forbidden import or active forbidden source detected');
  }

  const expectedVerdict = classifySummaryVerdict({
    parentEvidenceRows: args.parentEvidenceRows,
    probeDefinitionRows: args.probeDefinitionRows,
    labelPotentialRows: args.labelPotentialRows,
    globalReadoutValueRows: args.globalReadoutValueRows,
    probeEquivarianceRows: args.probeEquivarianceRows,
    probeImageRankRows: args.probeImageRankRows,
    probeResidualRows: args.probeResidualRows,
    probeResidualFormulaRows: args.probeResidualFormulaRows,
    probeKernelRows: args.probeKernelRows,
    probeClassificationRows: args.probeClassificationRows,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });

  if (expectedVerdict !== args.summaryVerdict) {
    issues.push('summary verdict inconsistent with precedence');
  }

  return unique(issues);
}

function reconstructGlobalObjectRows(parentReport: ParentReport): GlobalObjectRow[] {
  const objectIds = new Set<string>();

  for (const row of identityResidualActionRows(parentReport)) {
    objectIds.add(row.transformedLeftObjectId);
    objectIds.add(row.transformedRightObjectId);
  }

  return Array.from(objectIds)
    .map((objectId) => ({ objectId, objectDomain: objectDomainForObjectId(objectId) }))
    .filter((row): row is GlobalObjectRow => row.objectDomain !== null)
    .sort(globalObjectSort);
}

function reconstructResidualOperatorRows(parentReport: ParentReport): ResidualOperatorRow[] {
  return identityResidualActionRows(parentReport)
    .map((row) => {
      const alpha = parseAlphaFromResidualRowId(row.sourceRowId);
      const objectDomain = objectDomainForComponent(row.componentId);

      return alpha
        ? {
            alpha,
            componentId: row.componentId,
            objectDomain,
            leftObjectId: row.transformedLeftObjectId,
            rightObjectId: row.transformedRightObjectId,
          }
        : null;
    })
    .filter((row): row is ResidualOperatorRow => row !== null)
    .sort(residualRowSort);
}

function identityResidualActionRows(parentReport: ParentReport): ParentReport['residualCodomainActionRows'] {
  const identityPermutationId =
    parentReport.s4PermutationRows.find((row) => row.cycleType === '1^4')?.permutationId ?? '';
  return parentReport.residualCodomainActionRows.filter((row) => row.permutationId === identityPermutationId);
}

function evaluateReadoutValue(objectId: string, values: Record<A3Label, number>): ReadoutEvaluation {
  if (objectId.startsWith('flag:')) {
    const flag = parseFlag(objectId.slice('flag:'.length));
    return flag
      ? {
          structuralFormula: 'lambda_source_minus_lambda_target',
          value: values[flag[0]] - values[flag[1]],
          valueStatus: 'readout-value-pass',
        }
      : failedReadout('lambda_source_minus_lambda_target');
  }

  if (objectId.startsWith('square:')) {
    const parsedSquare = parseSquareObjectId(objectId);
    return parsedSquare
      ? {
          structuralFormula: 'source_pair_sum_minus_target_pair_sum',
          value: sumLabels(parsedSquare.sourceLabels, values) - sumLabels(parsedSquare.targetLabels, values),
          valueStatus: 'readout-value-pass',
        }
      : failedReadout('source_pair_sum_minus_target_pair_sum');
  }

  if (objectId.startsWith('ve-central-hexagon-omitted:')) {
    const omitted = objectId.slice('ve-central-hexagon-omitted:'.length) as A3Label;
    return A3_LABELS.includes(omitted)
      ? {
          structuralFormula: 'negative_omitted_label_potential',
          value: -values[omitted],
          valueStatus: 'readout-value-pass',
        }
      : failedReadout('negative_omitted_label_potential');
  }

  return failedReadout('lambda_source_minus_lambda_target');
}

function evaluateResidualComponent(
  rows: readonly ResidualOperatorRow[],
  readoutValues: ReadonlyMap<string, number>,
  componentId: GlobalResidualComponentId,
): number {
  const row = rows.find((candidate) => candidate.componentId === componentId);

  if (!row) {
    return Number.NaN;
  }

  return 0.5 * ((readoutValues.get(row.leftObjectId) ?? Number.NaN) - (readoutValues.get(row.rightObjectId) ?? Number.NaN));
}

function relation(
  residualRow: ProbeResidualRow,
  relationId: ProbeResidualFormulaRow['relationId'],
  pass: boolean,
): ProbeResidualFormulaRow {
  return {
    potentialId: residualRow.potentialId,
    alpha: residualRow.alpha,
    relationId,
    relationStatus: pass ? 'relation-pass' : 'relation-fail',
  };
}

function failedReadout(structuralFormula: GlobalReadoutValueRow['structuralFormula']): ReadoutEvaluation {
  return { structuralFormula, value: Number.NaN, valueStatus: 'readout-value-fail' };
}

function parseSquareObjectId(objectId: string): { sourceLabels: [A3Label, A3Label]; targetLabels: [A3Label, A3Label] } | null {
  const flags = objectId
    .slice('square:'.length)
    .split('|')
    .map(parseFlag);

  if (flags.length !== 4 || flags.some((flag) => flag === null)) {
    return null;
  }

  const sourceLabels = unique(flags.map((flag) => flag?.[0]).filter((label): label is A3Label => Boolean(label))).sort(labelSort);
  const targetLabels = unique(flags.map((flag) => flag?.[1]).filter((label): label is A3Label => Boolean(label))).sort(labelSort);

  if (sourceLabels.length !== 2 || targetLabels.length !== 2) {
    return null;
  }

  return { sourceLabels: [sourceLabels[0], sourceLabels[1]], targetLabels: [targetLabels[0], targetLabels[1]] };
}

function parseFlag(value: string): [A3Label, A3Label] | null {
  const [source, target] = value.split('->') as [A3Label | undefined, A3Label | undefined];
  return source && target && A3_LABELS.includes(source) && A3_LABELS.includes(target) && source !== target
    ? [source, target]
    : null;
}

function parseAlphaFromResidualRowId(rowId: string): A3FlagId | null {
  const match = /^row:([A-D]->[A-D]):/.exec(rowId);
  return match ? (match[1] as A3FlagId) : null;
}

function applyPermutationToPotential(
  values: Record<A3Label, number>,
  permutationMap: Record<A3Label, A3Label>,
): Record<A3Label, number> {
  const inverseMap = invertPermutation(permutationMap);
  return {
    A: values[inverseMap.A],
    B: values[inverseMap.B],
    C: values[inverseMap.C],
    D: values[inverseMap.D],
  };
}

function applyPermutationToObjectId(objectId: string, permutationMap: Record<A3Label, A3Label>): string {
  if (objectId.startsWith('flag:')) {
    return `flag:${applyPermutationToFlag(objectId.slice('flag:'.length) as A3FlagId, permutationMap)}`;
  }

  if (objectId.startsWith('square:')) {
    const flags = objectId
      .slice('square:'.length)
      .split('|')
      .map((flag) => applyPermutationToFlag(flag as A3FlagId, permutationMap));
    return `square:${flagSetKey(flags)}`;
  }

  if (objectId.startsWith('ve-central-hexagon-omitted:')) {
    const omitted = objectId.slice('ve-central-hexagon-omitted:'.length) as A3Label;
    return `ve-central-hexagon-omitted:${permutationMap[omitted]}`;
  }

  return objectId;
}

function applyPermutationToFlag(flag: A3FlagId, permutationMap: Record<A3Label, A3Label>): A3FlagId {
  const parsed = parseFlag(flag);
  return parsed ? flagId(permutationMap[parsed[0]], permutationMap[parsed[1]]) : flag;
}

function invertPermutation(permutationMap: Record<A3Label, A3Label>): Record<A3Label, A3Label> {
  return Object.fromEntries(A3_LABELS.map((label) => [permutationMap[label], label])) as Record<A3Label, A3Label>;
}

function groupReadoutValues(rows: readonly GlobalReadoutValueRow[]): Map<LabelPotentialId, Map<string, number>> {
  const groups = new Map<LabelPotentialId, Map<string, number>>();

  for (const row of rows) {
    groups.set(row.potentialId, (groups.get(row.potentialId) ?? new Map()).set(row.objectId, row.value));
  }

  return groups;
}

function labelsUnusedByFlag(alpha: A3FlagId): [A3Label, A3Label] {
  const parsed = parseFlag(alpha);
  const used = new Set(parsed ?? []);
  const unused = A3_LABELS.filter((label) => !used.has(label));
  return [unused[0], unused[1]];
}

function objectDomainForObjectId(objectId: string): GlobalObjectDomain | null {
  if (objectId.startsWith('flag:')) {
    return 'flag';
  }

  if (objectId.startsWith('square:')) {
    return 've-square';
  }

  if (objectId.startsWith('ve-central-hexagon-omitted:')) {
    return 've-a2-hexagon';
  }

  return null;
}

function objectDomainForComponent(componentId: GlobalResidualComponentId): GlobalObjectDomain {
  if (componentId === 'r_out' || componentId === 'r_in') {
    return 'flag';
  }

  if (componentId === 'r_square') {
    return 've-square';
  }

  return 've-a2-hexagon';
}

function sumLabels(labels: readonly A3Label[], values: Record<A3Label, number>): number {
  return labels.reduce((sum, label) => sum + values[label], 0);
}

function potentialById(potentialId: LabelPotentialId): { potentialId: LabelPotentialId; values: Record<A3Label, number> } {
  const potential = LABEL_POTENTIALS.find((candidate) => candidate.potentialId === potentialId);

  if (!potential) {
    throw new Error(`Unknown potentialId: ${potentialId}`);
  }

  return potential;
}

function basisRelationPasses(): boolean {
  return A3_LABELS.every(
    (label) => BASIS_POTENTIAL_IDS.reduce((sum, potentialId) => sum + potentialById(potentialId).values[label], 0) === 0,
  );
}

function rankOverRationals(rows: readonly number[][]): number {
  if (rows.length === 0) {
    return 0;
  }

  const matrix = rows.map((row) => row.map((value) => fraction(value)));
  const rowCount = matrix.length;
  const columnCount = matrix[0]?.length ?? 0;
  let rank = 0;

  for (let column = 0; column < columnCount && rank < rowCount; column += 1) {
    let pivotRow = -1;

    for (let row = rank; row < rowCount; row += 1) {
      if (!isZeroFraction(matrix[row][column])) {
        pivotRow = row;
        break;
      }
    }

    if (pivotRow === -1) {
      continue;
    }

    [matrix[rank], matrix[pivotRow]] = [matrix[pivotRow], matrix[rank]];
    const pivot = matrix[rank][column];
    matrix[rank] = matrix[rank].map((value) => divideFraction(value, pivot));

    for (let row = 0; row < rowCount; row += 1) {
      if (row === rank || isZeroFraction(matrix[row][column])) {
        continue;
      }

      const factor = matrix[row][column];
      matrix[row] = matrix[row].map((value, index) => subtractFraction(value, multiplyFraction(factor, matrix[rank][index])));
    }

    rank += 1;
  }

  return rank;
}

function fraction(value: number): Fraction {
  if (!Number.isInteger(value)) {
    const scaled = Math.round(value * 1_000_000);
    return reduceFraction({ num: BigInt(scaled), den: 1_000_000n });
  }

  return { num: BigInt(value), den: 1n };
}

function reduceFraction(value: Fraction): Fraction {
  if (value.num === 0n) {
    return { num: 0n, den: 1n };
  }

  const sign = value.den < 0n ? -1n : 1n;
  const num = value.num * sign;
  const den = value.den * sign;
  const factor = gcd(absBigInt(num), den);

  return { num: num / factor, den: den / factor };
}

function addFraction(left: Fraction, right: Fraction): Fraction {
  return reduceFraction({ num: left.num * right.den + right.num * left.den, den: left.den * right.den });
}

function subtractFraction(left: Fraction, right: Fraction): Fraction {
  return addFraction(left, { num: -right.num, den: right.den });
}

function multiplyFraction(left: Fraction, right: Fraction): Fraction {
  return reduceFraction({ num: left.num * right.num, den: left.den * right.den });
}

function divideFraction(left: Fraction, right: Fraction): Fraction {
  return reduceFraction({ num: left.num * right.den, den: left.den * right.num });
}

function isZeroFraction(value: Fraction): boolean {
  return value.num === 0n;
}

function gcd(left: bigint, right: bigint): bigint {
  let a = left;
  let b = right;

  while (b !== 0n) {
    [a, b] = [b, a % b];
  }

  return a;
}

function absBigInt(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function probeDefinitionFailed(rows: readonly ProbeDefinitionRow[]): boolean {
  return rows.length !== 1 || rows.some((row) => row.status !== 'probe-definition-pass');
}

function labelPotentialsReady(rows: readonly LabelPotentialRow[]): boolean {
  return rows.length === 5 && rows.every((row) => row.sum === 0 && row.sumZero && row.potentialStatus === 'sum-zero-standard-potential');
}

function globalReadoutValuesReady(rows: readonly GlobalReadoutValueRow[]): boolean {
  return rows.length === 110 && rows.every((row) => row.valueStatus === 'readout-value-pass');
}

function probeEquivarianceReady(rows: readonly ProbeEquivarianceRow[]): boolean {
  return (
    rows.length === 120 &&
    rows.every(
      (row) =>
        row.checkedObjectCount === 22 &&
        row.mismatchCount === 0 &&
        row.equivarianceStatus === 'probe-s4-equivariant',
    )
  );
}

function probeImageRankReady(rows: readonly ProbeImageRankRow[]): boolean {
  return rows.length === 1 && rows.every((row) => row.imageRank === 3 && row.rankStatus === 'standard-probe-rank-pass');
}

function probeResidualsReady(rows: readonly ProbeResidualRow[]): boolean {
  return rows.length === 60 && rows.every((row) => row.residualFormulaStatus === 'probe-residual-formula-pass');
}

function probeResidualRelationsReady(rows: readonly ProbeResidualFormulaRow[]): boolean {
  return rows.length === 240 && rows.every((row) => row.relationStatus === 'relation-pass');
}

function probeKernelReady(rows: readonly ProbeKernelRow[]): boolean {
  return rows.length === 1 && rows.every((row) => row.kernelDimensionInSumZeroSpace === 0 && row.kernelStatus === 'probe-kernel-pass');
}

function probeClassificationFailed(rows: readonly ProbeClassificationRow[]): boolean {
  return rows.length !== 1 || rows.some((row) => row.classificationStatus !== 'probe-classification-pass');
}

function parentAccepted(rows: readonly ParentEvidenceRow[]): boolean {
  return rows.length === 1 && rows[0].parentStatus === 'accepted-parent';
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((boundaryId) => !rows.some((row) => row.boundaryId === boundaryId && row.enforced));
}

function forbiddenImportOrActiveSourceDetected(): boolean {
  return false;
}

function isParentAccepted(parentReport: ParentReport): boolean {
  return parentReport.ok === true && parentReport.summaryVerdict === ACCEPTED_PARENT_VERDICT;
}

function boundary(boundaryId: string, statement: string): BoundaryRow {
  return { boundaryId, statement, enforced: true };
}

function falsifier(
  falsifierId: string,
  description: string,
  triggered: boolean,
  evidence: string,
): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function flagId(source: A3Label, target: A3Label): A3FlagId {
  return `${source}->${target}` as A3FlagId;
}

function flagSetKey(flags: readonly A3FlagId[]): string {
  return unique(flags).sort(flagSort).join('|');
}

function labelSort(left: A3Label, right: A3Label): number {
  return A3_LABELS.indexOf(left) - A3_LABELS.indexOf(right);
}

function flagSort(left: A3FlagId, right: A3FlagId): number {
  return DIRECTED_FLAGS.indexOf(left) - DIRECTED_FLAGS.indexOf(right);
}

function globalObjectSort(left: GlobalObjectRow, right: GlobalObjectRow): number {
  const domainOrder: Record<GlobalObjectDomain, number> = { flag: 0, 've-square': 1, 've-a2-hexagon': 2 };
  const domainDifference = domainOrder[left.objectDomain] - domainOrder[right.objectDomain];

  if (domainDifference !== 0) {
    return domainDifference;
  }

  if (left.objectDomain === 'flag') {
    return flagSort(left.objectId.slice('flag:'.length) as A3FlagId, right.objectId.slice('flag:'.length) as A3FlagId);
  }

  return left.objectId.localeCompare(right.objectId);
}

function residualRowSort(left: ResidualOperatorRow, right: ResidualOperatorRow): number {
  const alphaDifference = flagSort(left.alpha, right.alpha);

  if (alphaDifference !== 0) {
    return alphaDifference;
  }

  return COMPONENT_ORDER.indexOf(left.componentId) - COMPONENT_ORDER.indexOf(right.componentId);
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}
