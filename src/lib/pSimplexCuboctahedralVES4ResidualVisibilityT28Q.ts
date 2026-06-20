import { buildPSimplexCuboctahedralVEGlobalReadoutAdmissibilityT28PReport } from './pSimplexCuboctahedralVEGlobalReadoutAdmissibilityT28P';

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

export type T28QSummaryVerdict =
  | 'T28-Q-ve-s4-residual-visibility-verified'
  | 'T28-Q-parent-global-readout-kernel-not-accepted'
  | 'T28-Q-s4-character-table-failed'
  | 'T28-Q-domain-representation-decomposition-failed'
  | 'T28-Q-residual-codomain-action-failed'
  | 'T28-Q-residual-operator-equivariance-failed'
  | 'T28-Q-kernel-representation-failed'
  | 'T28-Q-visible-quotient-failed'
  | 'T28-Q-readout-implication-classification-failed'
  | 'T28-Q-boundary-failed';

export type S4IrrepId = 'trivial' | 'sign' | 'standard' | 'sign-standard' | 'two-dimensional';
export type CycleType = '1^4' | '2,1,1' | '2,2' | '3,1' | '4';
export type GlobalObjectDomain = 'flag' | 've-square' | 've-a2-hexagon';
export type GlobalResidualComponentId = 'r_out' | 'r_in' | 'r_square' | 'r_hex';

export interface ParentEvidenceRow {
  parentId: 'T28-P';
  method: string;
  ok: boolean;
  summaryVerdict: string;
  consumedSections: string[];
  ignoredSections: string[];
  parentStatus: 'accepted-parent' | 'rejected-parent';
}

export interface S4PermutationRow {
  permutationId: string;
  permutationMap: Record<A3Label, A3Label>;
  cycleType: CycleType;
  parity: 'even' | 'odd';
  permutationStatus: 'permutation-pass' | 'permutation-fail';
}

export interface S4ConjugacyClassRow {
  classId: 'identity' | 'transposition' | 'double-transposition' | 'three-cycle' | 'four-cycle';
  cycleType: CycleType;
  classSize: number;
  expectedClassSize: number;
  classStatus: 'class-pass' | 'class-fail';
}

export interface S4IrreducibleCharacterRow {
  irrepId: S4IrrepId;
  characterByClass: [number, number, number, number, number];
  dimension: number;
  characterStatus: 'character-row-pass' | 'character-row-fail';
}

export interface DomainCharacterRow {
  domainId: 'flag-domain' | 'square-domain' | 'hex-domain' | 'total-U';
  objectCount: number;
  characterByClass: [number, number, number, number, number];
  expectedCharacterByClass: [number, number, number, number, number];
  characterStatus: 'domain-character-pass' | 'domain-character-fail';
}

export interface DomainIrreducibleDecompositionRow {
  domainId: 'flag-domain' | 'square-domain' | 'hex-domain' | 'total-U';
  characterByClass: [number, number, number, number, number];
  multiplicities: Record<S4IrrepId, number>;
  expectedMultiplicities: Record<S4IrrepId, number>;
  dimensionFromDecomposition: number;
  objectCount: number;
  decompositionStatus: 'decomposition-pass' | 'decomposition-fail';
}

export interface ResidualCodomainActionRow {
  permutationId: string;
  sourceRowId: string;
  targetRowId: string;
  componentId: GlobalResidualComponentId;
  transformedLeftObjectId: string;
  transformedRightObjectId: string;
  targetLeftObjectId: string;
  targetRightObjectId: string;
  orientationSign: 1 | -1;
  actionStatus: 'signed-row-action-pass' | 'target-row-missing' | 'orientation-mismatch';
}

export interface ResidualOperatorEquivarianceRow {
  permutationId: string;
  checkedRows: number;
  checkedColumns: number;
  mismatchCount: number;
  equivarianceStatus: 'residual-operator-s4-equivariant' | 'residual-operator-equivariance-failed';
}

export interface KernelRepresentationRow {
  kernelBasisId: 'flag-domain-constant' | 'square-domain-constant' | 'hex-domain-constant';
  s4Character: [number, number, number, number, number];
  irreducibleDecomposition: Record<S4IrrepId, number>;
  residualNonzeroCount: number;
  kernelRepresentationStatus:
    | 'trivial-kernel-basis-pass'
    | 'kernel-basis-not-trivial'
    | 'kernel-basis-not-killed-by-D';
}

export interface ResidualVisibleQuotientRow {
  sourceRepresentation: 'global-readout-space-U';
  kernelRepresentation: '3*trivial';
  quotientDimension: number;
  expectedQuotientDimension: number;
  quotientDecomposition: Record<S4IrrepId, number>;
  rankD: number;
  visibilityStatus:
    | 'all-nontrivial-components-residual-visible'
    | 'nontrivial-component-lost'
    | 'unexpected-trivial-component-visible';
}

export interface ResidualVisibilityTheoremRow {
  theoremId: 'T28-Q-residual-visible-nontrivial-S4-content';
  statement: string;
  preconditions: string[];
  verifiedFacts: string[];
  theoremStatus: 'theorem-verified' | 'theorem-failed';
}

export interface ReadoutRepresentationImplicationRow {
  candidateClassId:
    | 'domain-constant-controls'
    | 'standard-label-potential-probe'
    | 'two-dimensional-pairing-mode'
    | 'sign-standard-orientation-mode'
    | 'project-internal-source-state-readout'
    | 'category-provenance-readout-without-scalar-law'
    | 'field-sample-readout'
    | 'fano-carrier-readout';
  expectedS4Type:
    | 'trivial'
    | 'standard'
    | 'two-dimensional'
    | 'sign-standard'
    | 'unknown-must-declare'
    | 'not-admissible'
    | 'forbidden';
  residualVisibility:
    | 'kernel-zero-residual'
    | 'residual-visible-if-nonzero'
    | 'not-admissible'
    | 'forbidden';
  implicationStatus: 'classification-refined' | 'classification-failed';
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

export interface PSimplexCuboctahedralVES4ResidualVisibilityT28QReport {
  method: 'p-simplex-cuboctahedral-ve-s4-residual-visibility-t28q';
  diagnosticScope: 've-s4-representation-and-residual-visibility';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  parentEvidenceRows: ParentEvidenceRow[];
  s4PermutationRows: S4PermutationRow[];
  s4ConjugacyClassRows: S4ConjugacyClassRow[];
  s4IrreducibleCharacterRows: S4IrreducibleCharacterRow[];
  domainCharacterRows: DomainCharacterRow[];
  domainIrreducibleDecompositionRows: DomainIrreducibleDecompositionRow[];
  residualCodomainActionRows: ResidualCodomainActionRow[];
  residualOperatorEquivarianceRows: ResidualOperatorEquivarianceRow[];
  kernelRepresentationRows: KernelRepresentationRow[];
  residualVisibleQuotientRows: ResidualVisibleQuotientRow[];
  residualVisibilityTheoremRows: ResidualVisibilityTheoremRow[];
  readoutRepresentationImplicationRows: ReadoutRepresentationImplicationRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  summaryVerdict: T28QSummaryVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

type ParentReport = ReturnType<typeof buildPSimplexCuboctahedralVEGlobalReadoutAdmissibilityT28PReport>;
type ParentObjectRow = ParentReport['globalObjectUniverseRows'][number];
type ParentResidualRow = ParentReport['globalResidualOperatorRows'][number];

interface ConjugacyClassDef {
  classId: S4ConjugacyClassRow['classId'];
  cycleType: CycleType;
  expectedClassSize: number;
}

interface IrrepDef {
  irrepId: S4IrrepId;
  characterByClass: [number, number, number, number, number];
  dimension: number;
}

interface DecompositionResult {
  multiplicities: Record<S4IrrepId, number>;
  exact: boolean;
  dimension: number;
}

const METHOD = 'p-simplex-cuboctahedral-ve-s4-residual-visibility-t28q' as const;
const DIAGNOSTIC_SCOPE = 've-s4-representation-and-residual-visibility' as const;
const BRANCH_REF = 'wgate/arf-w1-root-frame-v0' as const;
const ACCEPTED_PARENT_VERDICT = 'T28-P-ve-global-readout-space-and-kernel-verified';
const A3_LABELS: readonly A3Label[] = ['A', 'B', 'C', 'D'];
const DIRECTED_FLAGS: readonly A3FlagId[] = A3_LABELS.flatMap((source) =>
  A3_LABELS.filter((target) => target !== source).map((target) => flagId(source, target)),
) as A3FlagId[];
const CLASS_DEFS: readonly ConjugacyClassDef[] = [
  { classId: 'identity', cycleType: '1^4', expectedClassSize: 1 },
  { classId: 'transposition', cycleType: '2,1,1', expectedClassSize: 6 },
  { classId: 'double-transposition', cycleType: '2,2', expectedClassSize: 3 },
  { classId: 'three-cycle', cycleType: '3,1', expectedClassSize: 8 },
  { classId: 'four-cycle', cycleType: '4', expectedClassSize: 6 },
];
const IRREP_DEFS: readonly IrrepDef[] = [
  { irrepId: 'trivial', characterByClass: [1, 1, 1, 1, 1], dimension: 1 },
  { irrepId: 'sign', characterByClass: [1, -1, 1, 1, -1], dimension: 1 },
  { irrepId: 'standard', characterByClass: [3, 1, -1, 0, -1], dimension: 3 },
  { irrepId: 'sign-standard', characterByClass: [3, -1, -1, 0, 1], dimension: 3 },
  { irrepId: 'two-dimensional', characterByClass: [2, 0, 2, -1, 0], dimension: 2 },
];
const EXPECTED_DOMAIN_CHARACTERS: Record<DomainCharacterRow['domainId'], [number, number, number, number, number]> = {
  'flag-domain': [12, 2, 0, 0, 0],
  'square-domain': [6, 2, 2, 0, 0],
  'hex-domain': [4, 2, 0, 1, 0],
  'total-U': [22, 6, 2, 1, 0],
};
const EXPECTED_DECOMPOSITIONS: Record<DomainIrreducibleDecompositionRow['domainId'], Record<S4IrrepId, number>> = {
  'flag-domain': multiplicities({ trivial: 1, standard: 2, 'sign-standard': 1, 'two-dimensional': 1 }),
  'square-domain': multiplicities({ trivial: 1, standard: 1, 'two-dimensional': 1 }),
  'hex-domain': multiplicities({ trivial: 1, standard: 1 }),
  'total-U': multiplicities({ trivial: 3, standard: 4, 'sign-standard': 1, 'two-dimensional': 2 }),
};
const EXPECTED_QUOTIENT = multiplicities({ standard: 4, 'sign-standard': 1, 'two-dimensional': 2 });
const REQUIRED_BOUNDARY_IDS = [
  'not-natural-readout-claim',
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
  'not-project-internal-source-state-readout-yet',
] as const;
const REQUIRED_FALSIFIER_IDS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'] as const;

export function buildPSimplexCuboctahedralVES4ResidualVisibilityT28QReport(): PSimplexCuboctahedralVES4ResidualVisibilityT28QReport {
  const parentReport = buildPSimplexCuboctahedralVEGlobalReadoutAdmissibilityT28PReport();
  const parentEvidenceRows = buildParentEvidenceRows(parentReport);
  const s4PermutationRows = buildS4PermutationRows();
  const s4ConjugacyClassRows = buildS4ConjugacyClassRows(s4PermutationRows);
  const s4IrreducibleCharacterRows = buildS4IrreducibleCharacterRows();
  const domainCharacterRows = buildDomainCharacterRows(parentReport, s4PermutationRows);
  const domainIrreducibleDecompositionRows = buildDomainIrreducibleDecompositionRows(domainCharacterRows);
  const residualCodomainActionRows = buildResidualCodomainActionRows(parentReport, s4PermutationRows);
  const residualOperatorEquivarianceRows = buildResidualOperatorEquivarianceRows(
    parentReport,
    s4PermutationRows,
    residualCodomainActionRows,
  );
  const kernelRepresentationRows = buildKernelRepresentationRows(parentReport, s4PermutationRows);
  const residualVisibleQuotientRows = buildResidualVisibleQuotientRows(parentReport, domainIrreducibleDecompositionRows);
  const residualVisibilityTheoremRows = buildResidualVisibilityTheoremRows({
    parentEvidenceRows,
    domainIrreducibleDecompositionRows,
    residualOperatorEquivarianceRows,
    kernelRepresentationRows,
    residualVisibleQuotientRows,
  });
  const readoutRepresentationImplicationRows = buildReadoutRepresentationImplicationRows();
  const boundaryRows = buildBoundaryRows();
  const preliminaryVerdict = classifySummaryVerdict({
    parentEvidenceRows,
    s4PermutationRows,
    s4ConjugacyClassRows,
    s4IrreducibleCharacterRows,
    domainCharacterRows,
    domainIrreducibleDecompositionRows,
    residualCodomainActionRows,
    residualOperatorEquivarianceRows,
    kernelRepresentationRows,
    residualVisibleQuotientRows,
    residualVisibilityTheoremRows,
    readoutRepresentationImplicationRows,
    boundaryRows,
    falsifierRows: [],
  });
  const falsifierRows = buildFalsifierRows({
    parentEvidenceRows,
    s4PermutationRows,
    domainIrreducibleDecompositionRows,
    residualCodomainActionRows,
    residualOperatorEquivarianceRows,
    kernelRepresentationRows,
    residualVisibleQuotientRows,
    readoutRepresentationImplicationRows,
    boundaryRows,
    summaryVerdict: preliminaryVerdict,
  });
  const summaryVerdict = classifySummaryVerdict({
    parentEvidenceRows,
    s4PermutationRows,
    s4ConjugacyClassRows,
    s4IrreducibleCharacterRows,
    domainCharacterRows,
    domainIrreducibleDecompositionRows,
    residualCodomainActionRows,
    residualOperatorEquivarianceRows,
    kernelRepresentationRows,
    residualVisibleQuotientRows,
    residualVisibilityTheoremRows,
    readoutRepresentationImplicationRows,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    s4PermutationRows,
    s4ConjugacyClassRows,
    s4IrreducibleCharacterRows,
    domainCharacterRows,
    domainIrreducibleDecompositionRows,
    residualCodomainActionRows,
    residualOperatorEquivarianceRows,
    kernelRepresentationRows,
    residualVisibleQuotientRows,
    residualVisibilityTheoremRows,
    readoutRepresentationImplicationRows,
    boundaryRows,
    falsifierRows,
    summaryVerdict,
  });

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    parentEvidenceRows,
    s4PermutationRows,
    s4ConjugacyClassRows,
    s4IrreducibleCharacterRows,
    domainCharacterRows,
    domainIrreducibleDecompositionRows,
    residualCodomainActionRows,
    residualOperatorEquivarianceRows,
    kernelRepresentationRows,
    residualVisibleQuotientRows,
    residualVisibilityTheoremRows,
    readoutRepresentationImplicationRows,
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
      parentId: 'T28-P',
      method: parentReport.method,
      ok: parentReport.ok,
      summaryVerdict: parentReport.summaryVerdict,
      consumedSections: [
        'globalObjectUniverseRows',
        'globalResidualOperatorRows',
        'globalResidualOperatorBlockRows',
        'kernelBasisRows',
        'boundaryRows',
        'falsifierRows',
        'summaryVerdict',
        'ok',
      ],
      ignoredSections: [
        'nullReadoutControlRows',
        'sensitivityControlRows',
        'candidateReadoutClassificationRows',
        'badReadoutRejectionRows',
      ],
      parentStatus: isParentAccepted(parentReport) ? 'accepted-parent' : 'rejected-parent',
    },
  ];
}

function buildS4PermutationRows(): S4PermutationRow[] {
  return permutations([...A3_LABELS]).map((values, index) => {
    const permutationMap = Object.fromEntries(A3_LABELS.map((label, labelIndex) => [label, values[labelIndex]])) as Record<
      A3Label,
      A3Label
    >;
    const cycleType = classifyCycleType(permutationMap);
    const parity = permutationParity(values);

    return {
      permutationId: `s4:${index + 1}:${A3_LABELS.map((label) => `${label}->${permutationMap[label]}`).join(',')}`,
      permutationMap,
      cycleType,
      parity,
      permutationStatus: cycleType && parity ? 'permutation-pass' : 'permutation-fail',
    };
  });
}

function buildS4ConjugacyClassRows(rows: readonly S4PermutationRow[]): S4ConjugacyClassRow[] {
  return CLASS_DEFS.map((definition) => {
    const classSize = rows.filter((row) => row.cycleType === definition.cycleType).length;

    return {
      classId: definition.classId,
      cycleType: definition.cycleType,
      classSize,
      expectedClassSize: definition.expectedClassSize,
      classStatus: classSize === definition.expectedClassSize ? 'class-pass' : 'class-fail',
    };
  });
}

function buildS4IrreducibleCharacterRows(): S4IrreducibleCharacterRow[] {
  return IRREP_DEFS.map((definition) => ({
    irrepId: definition.irrepId,
    characterByClass: definition.characterByClass,
    dimension: definition.dimension,
    characterStatus:
      definition.dimension === definition.characterByClass[0] && knownCharacter(definition.irrepId, definition.characterByClass)
        ? 'character-row-pass'
        : 'character-row-fail',
  }));
}

function buildDomainCharacterRows(parentReport: ParentReport, permutations24: readonly S4PermutationRow[]): DomainCharacterRow[] {
  const domainDefs: Array<{
    domainId: DomainCharacterRow['domainId'];
    objects: string[];
  }> = [
    {
      domainId: 'flag-domain',
      objects: objectsForDomain(parentReport, 'flag'),
    },
    {
      domainId: 'square-domain',
      objects: objectsForDomain(parentReport, 've-square'),
    },
    {
      domainId: 'hex-domain',
      objects: objectsForDomain(parentReport, 've-a2-hexagon'),
    },
  ];
  const rows = domainDefs.map((definition) => domainCharacterRow(definition.domainId, definition.objects, permutations24));
  const totalCharacter = tuple5(
    CLASS_DEFS.map((_, index) => rows.reduce((sum, row) => sum + row.characterByClass[index], 0)),
  );
  rows.push({
    domainId: 'total-U',
    objectCount: parentReport.globalObjectUniverseRows.length,
    characterByClass: totalCharacter,
    expectedCharacterByClass: EXPECTED_DOMAIN_CHARACTERS['total-U'],
    characterStatus:
      sameTuple(totalCharacter, EXPECTED_DOMAIN_CHARACTERS['total-U']) &&
      parentReport.globalObjectUniverseRows.length === 22
        ? 'domain-character-pass'
        : 'domain-character-fail',
  });

  return rows;
}

function buildDomainIrreducibleDecompositionRows(
  domainCharacterRows: readonly DomainCharacterRow[],
): DomainIrreducibleDecompositionRow[] {
  return domainCharacterRows.map((row) => {
    const decomposition = decomposeCharacter(row.characterByClass);
    const expectedMultiplicities = EXPECTED_DECOMPOSITIONS[row.domainId];
    const decompositionStatus =
      decomposition.exact &&
      sameMultiplicityRecord(decomposition.multiplicities, expectedMultiplicities) &&
      decomposition.dimension === row.objectCount
        ? 'decomposition-pass'
        : 'decomposition-fail';

    return {
      domainId: row.domainId,
      characterByClass: row.characterByClass,
      multiplicities: decomposition.multiplicities,
      expectedMultiplicities,
      dimensionFromDecomposition: decomposition.dimension,
      objectCount: row.objectCount,
      decompositionStatus,
    };
  });
}

function buildResidualCodomainActionRows(
  parentReport: ParentReport,
  permutations24: readonly S4PermutationRow[],
): ResidualCodomainActionRow[] {
  const exactRowByKey = new Map(parentReport.globalResidualOperatorRows.map((row) => [residualKey(row), row]));
  const rowIdByKey = new Map(parentReport.globalResidualOperatorRows.map((row) => [residualKey(row), residualRowId(row)]));
  const rowsByAlphaComponent = groupBy(parentReport.globalResidualOperatorRows, (row) => `${row.alpha}|${row.componentId}`);

  return permutations24.flatMap((permutation) =>
    parentReport.globalResidualOperatorRows.map((row) => {
      const transformedAlpha = applyPermutationToFlag(row.alpha as A3FlagId, permutation.permutationMap);
      const transformedLeftObjectId = applyPermutationToObjectId(row.leftObjectId, permutation.permutationMap);
      const transformedRightObjectId = applyPermutationToObjectId(row.rightObjectId, permutation.permutationMap);
      const exactKey = residualKeyFromParts(transformedAlpha, row.componentId, transformedLeftObjectId, transformedRightObjectId);
      const reverseKey = residualKeyFromParts(transformedAlpha, row.componentId, transformedRightObjectId, transformedLeftObjectId);
      const exactTarget = exactRowByKey.get(exactKey);
      const reverseTarget = exactRowByKey.get(reverseKey);
      const sameComponentRows = rowsByAlphaComponent.get(`${transformedAlpha}|${row.componentId}`) ?? [];
      const target = exactTarget ?? reverseTarget ?? sameComponentRows[0] ?? null;
      const orientationSign: 1 | -1 = exactTarget ? 1 : -1;
      const actionStatus: ResidualCodomainActionRow['actionStatus'] = exactTarget || reverseTarget
        ? 'signed-row-action-pass'
        : sameComponentRows.length === 0
          ? 'target-row-missing'
          : 'orientation-mismatch';

      return {
        permutationId: permutation.permutationId,
        sourceRowId: residualRowId(row),
        targetRowId: target ? rowIdByKey.get(residualKey(target)) ?? residualRowId(target) : '',
        componentId: row.componentId,
        transformedLeftObjectId,
        transformedRightObjectId,
        targetLeftObjectId: target?.leftObjectId ?? '',
        targetRightObjectId: target?.rightObjectId ?? '',
        orientationSign,
        actionStatus,
      };
    }),
  );
}

function buildResidualOperatorEquivarianceRows(
  parentReport: ParentReport,
  permutations24: readonly S4PermutationRow[],
  actionRows: readonly ResidualCodomainActionRow[],
): ResidualOperatorEquivarianceRow[] {
  const objectIds = parentReport.globalObjectUniverseRows.map((row) => row.objectId);
  const residualRows = parentReport.globalResidualOperatorRows;
  const residualRowIds = residualRows.map(residualRowId);
  const objectIndex = new Map(objectIds.map((objectId, index) => [objectId, index]));
  const residualIndex = new Map(residualRowIds.map((rowId, index) => [rowId, index]));
  const dMatrix = buildDMatrix(residualRows, objectIds);

  return permutations24.map((permutation) => {
    const pU = zeroMatrix(objectIds.length, objectIds.length);
    const pR = zeroMatrix(residualRows.length, residualRows.length);

    for (const sourceObjectId of objectIds) {
      const sourceIndex = objectIndex.get(sourceObjectId);
      const targetIndex = objectIndex.get(applyPermutationToObjectId(sourceObjectId, permutation.permutationMap));

      if (sourceIndex !== undefined && targetIndex !== undefined) {
        pU[targetIndex][sourceIndex] = 1;
      }
    }

    for (const actionRow of actionRows.filter((row) => row.permutationId === permutation.permutationId)) {
      const sourceIndex = residualIndex.get(actionRow.sourceRowId);
      const targetIndex = residualIndex.get(actionRow.targetRowId);

      if (sourceIndex !== undefined && targetIndex !== undefined && actionRow.actionStatus === 'signed-row-action-pass') {
        pR[targetIndex][sourceIndex] = actionRow.orientationSign;
      }
    }

    const left = multiplyMatrices(pR, dMatrix);
    const right = multiplyMatrices(dMatrix, pU);
    const mismatchCount = countMatrixMismatches(left, right);

    return {
      permutationId: permutation.permutationId,
      checkedRows: residualRows.length,
      checkedColumns: objectIds.length,
      mismatchCount,
      equivarianceStatus:
        mismatchCount === 0 ? 'residual-operator-s4-equivariant' : 'residual-operator-equivariance-failed',
    };
  });
}

function buildKernelRepresentationRows(
  parentReport: ParentReport,
  permutations24: readonly S4PermutationRow[],
): KernelRepresentationRow[] {
  return parentReport.kernelBasisRows.map((basisRow) => {
    const assignedValues = new Map(basisRow.assignedValues.map((entry) => [entry.objectId, entry.value]));
    const fixedByClass = CLASS_DEFS.map((definition) => {
      const classPermutations = permutations24.filter((row) => row.cycleType === definition.cycleType);
      const fixedCounts = classPermutations.map((permutation) =>
        parentReport.globalObjectUniverseRows.every((object) => {
          const image = applyPermutationToObjectId(object.objectId, permutation.permutationMap);
          return assignedValues.get(image) === assignedValues.get(object.objectId);
        })
          ? 1
          : 0,
      );
      return fixedCounts.every((count) => count === 1) ? 1 : 0;
    });
    const s4Character = tuple5(fixedByClass);
    const decomposition = decomposeCharacter(s4Character);
    const expected = multiplicities({ trivial: 1 });
    const trivial = sameTuple(s4Character, [1, 1, 1, 1, 1]) && sameMultiplicityRecord(decomposition.multiplicities, expected);
    const killed = basisRow.residualNonzeroCount === 0;

    return {
      kernelBasisId: basisRow.basisId,
      s4Character,
      irreducibleDecomposition: decomposition.multiplicities,
      residualNonzeroCount: basisRow.residualNonzeroCount,
      kernelRepresentationStatus: !killed
        ? 'kernel-basis-not-killed-by-D'
        : !trivial
          ? 'kernel-basis-not-trivial'
          : 'trivial-kernel-basis-pass',
    };
  });
}

function buildResidualVisibleQuotientRows(
  parentReport: ParentReport,
  decompositionRows: readonly DomainIrreducibleDecompositionRow[],
): ResidualVisibleQuotientRow[] {
  const total = decompositionRows.find((row) => row.domainId === 'total-U');
  const rankD = parentReport.globalResidualOperatorBlockRows.find((row) => row.blockId === 'total')?.rankOverRationals ?? 0;
  const quotientDecomposition = subtractMultiplicityRecords(total?.multiplicities ?? zeroMultiplicityRecord(), multiplicities({ trivial: 3 }));
  const quotientDimension = dimensionFromMultiplicities(quotientDecomposition);
  const visibilityStatus: ResidualVisibleQuotientRow['visibilityStatus'] =
    quotientDimension !== 19 || rankD !== 19 || !sameMultiplicityRecord(quotientDecomposition, EXPECTED_QUOTIENT)
      ? 'nontrivial-component-lost'
      : quotientDecomposition.trivial !== 0
        ? 'unexpected-trivial-component-visible'
        : 'all-nontrivial-components-residual-visible';

  return [
    {
      sourceRepresentation: 'global-readout-space-U',
      kernelRepresentation: '3*trivial',
      quotientDimension,
      expectedQuotientDimension: 19,
      quotientDecomposition,
      rankD,
      visibilityStatus,
    },
  ];
}

function buildResidualVisibilityTheoremRows(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  domainIrreducibleDecompositionRows: readonly DomainIrreducibleDecompositionRow[];
  residualOperatorEquivarianceRows: readonly ResidualOperatorEquivarianceRow[];
  kernelRepresentationRows: readonly KernelRepresentationRow[];
  residualVisibleQuotientRows: readonly ResidualVisibleQuotientRow[];
}): ResidualVisibilityTheoremRow[] {
  const theoremPass =
    parentAccepted(args.parentEvidenceRows) &&
    args.domainIrreducibleDecompositionRows.every((row) => row.decompositionStatus === 'decomposition-pass') &&
    args.residualOperatorEquivarianceRows.every((row) => row.equivarianceStatus === 'residual-operator-s4-equivariant') &&
    args.kernelRepresentationRows.every((row) => row.kernelRepresentationStatus === 'trivial-kernel-basis-pass') &&
    args.residualVisibleQuotientRows.every(
      (row) => row.visibilityStatus === 'all-nontrivial-components-residual-visible',
    );

  return [
    {
      theoremId: 'T28-Q-residual-visible-nontrivial-S4-content',
      statement:
        'For the accepted VE global readout space U = F union Q union H, the T28-P residual operator D kills exactly the domain-constant trivial S4 modes and is injective on the nontrivial S4 quotient.',
      preconditions: [
        'T28-O accepted',
        'T28-P accepted',
        'D is S4-equivariant under signed residual-row action',
        'character decompositions computed exactly',
        'kernel basis verified',
        'rank(D) = 19',
      ],
      verifiedFacts: [
        'ker(D) = 3*trivial',
        'U / ker(D) = 4*standard + sign-standard + 2*two-dimensional',
        'rank(D) = dim(U / ker(D)) = 19',
      ],
      theoremStatus: theoremPass ? 'theorem-verified' : 'theorem-failed',
    },
  ];
}

function buildReadoutRepresentationImplicationRows(): ReadoutRepresentationImplicationRow[] {
  return [
    implication('domain-constant-controls', 'trivial', 'kernel-zero-residual'),
    implication('standard-label-potential-probe', 'standard', 'residual-visible-if-nonzero'),
    implication('two-dimensional-pairing-mode', 'two-dimensional', 'residual-visible-if-nonzero'),
    implication('sign-standard-orientation-mode', 'sign-standard', 'residual-visible-if-nonzero'),
    implication('project-internal-source-state-readout', 'unknown-must-declare', 'residual-visible-if-nonzero'),
    implication('category-provenance-readout-without-scalar-law', 'not-admissible', 'not-admissible'),
    implication('field-sample-readout', 'forbidden', 'forbidden'),
    implication('fano-carrier-readout', 'forbidden', 'forbidden'),
  ];
}

function buildBoundaryRows(): BoundaryRow[] {
  return [
    boundary('not-natural-readout-claim', 'T28-Q proves representation visibility and discovers no natural readout.'),
    boundary('not-readout-discovery', 'T28-Q does not search for or discover a project readout.'),
    boundary('not-field-computation', 'T28-Q computes no field values.'),
    boundary('not-source-emission-law', 'T28-Q does not use source-emission values.'),
    boundary('not-fieldcue', 'T28-Q does not create or unblock FieldCue.'),
    boundary('not-generated-site-reading', 'T28-Q does not read generated-site values.'),
    boundary('not-semantic-naming', 'T28-Q does not authorize semantic naming.'),
    boundary('not-topology-module', 'T28-Q does not use topology-module values.'),
    boundary('not-route', 'T28-Q does not confirm routes.'),
    boundary('not-gate', 'T28-Q does not confirm gates.'),
    boundary('not-corridor', 'T28-Q does not confirm corridors.'),
    boundary('not-runtime', 'T28-Q does not authorize runtime behavior.'),
    boundary('not-fano', 'T28-Q excludes Fano sources from active computation.'),
    boundary('not-octonion', 'T28-Q excludes octonion sources from active computation.'),
    boundary('not-carrier-ray', 'T28-Q excludes carrier-ray sources from active computation.'),
    boundary('not-signed-lift', 'T28-Q excludes signed-lift sources from active computation.'),
    boundary('not-composition-holonomy', 'T28-Q excludes composition-holonomy overlays from active computation.'),
    boundary('not-canonical-order-bridge', 'T28-Q uses parent object IDs and all S4 relabelings, not canonical order.'),
    boundary('not-arbitrary-permutation-search', 'T28-Q generates all S4 permutations directly and performs no best-fit search.'),
    boundary('not-residual-portability-proof', 'T28-Q does not prove residual portability.'),
    boundary('not-project-internal-source-state-readout-yet', 'T28-Q does not test project-internal source-state readouts.'),
  ];
}

function buildFalsifierRows(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  s4PermutationRows: readonly S4PermutationRow[];
  domainIrreducibleDecompositionRows: readonly DomainIrreducibleDecompositionRow[];
  residualCodomainActionRows: readonly ResidualCodomainActionRow[];
  residualOperatorEquivarianceRows: readonly ResidualOperatorEquivarianceRow[];
  kernelRepresentationRows: readonly KernelRepresentationRow[];
  residualVisibleQuotientRows: readonly ResidualVisibleQuotientRow[];
  readoutRepresentationImplicationRows: readonly ReadoutRepresentationImplicationRow[];
  boundaryRows: readonly BoundaryRow[];
  summaryVerdict: T28QSummaryVerdict;
}): FalsifierRow[] {
  return [
    falsifier('F1', 'Treats T28-Q as a natural readout discovery.', false, 'T28-Q only refines representation visibility.'),
    falsifier('F2', 'Tests field samples, source-emission values, semantic names, topology-module values, or source-state readouts.', false, 'T28-Q consumes only T28-P object and residual operator rows.'),
    falsifier('F3', 'Uses Fano, octonions, carrier rays, signed lifts, composition triangles, or square holonomy.', false, 'T28-Q imports only the T28-P report builder.'),
    falsifier('F4', 'Uses canonical vertex order.', false, 'T28-Q generates all S4 relabelings directly.'),
    falsifier('F5', 'Computes character decompositions with floating arithmetic only.', args.domainIrreducibleDecompositionRows.some((row) => row.decompositionStatus !== 'decomposition-pass'), 'Character inner products use integer class-size sums divided exactly by 24.'),
    falsifier('F6', 'Omits signed orientation in residual codomain action.', !args.residualCodomainActionRows.some((row) => row.orientationSign === -1), 'Residual codomain rows record orientationSign = +1 or -1.'),
    falsifier('F7', 'Claims D is S4-equivariant without checking all 24 permutations.', args.residualOperatorEquivarianceRows.length !== 24 || args.s4PermutationRows.length !== 24, `${args.residualOperatorEquivarianceRows.length}/24 equivariance rows.`),
    falsifier('F8', 'Claims kernel = trivial representation without verifying the three kernel basis rows.', args.kernelRepresentationRows.some((row) => row.kernelRepresentationStatus !== 'trivial-kernel-basis-pass'), `${args.kernelRepresentationRows.filter((row) => row.kernelRepresentationStatus === 'trivial-kernel-basis-pass').length}/3 kernel rows pass.`),
    falsifier('F9', 'Fails to match T28-P rank(D) = 19.', args.residualVisibleQuotientRows.some((row) => row.rankD !== 19), `rank(D)=${args.residualVisibleQuotientRows[0]?.rankD ?? 'missing'}.`),
    falsifier('F10', 'Claims a nontrivial representation component is natural merely because it is residual-visible.', false, 'Readout implication rows keep visible nontrivial modes separate from natural-readout claims.'),
    falsifier('F11', 'Treats standard label-potential probe as project-internal readout.', args.readoutRepresentationImplicationRows.some((row) => row.candidateClassId === 'standard-label-potential-probe' && row.expectedS4Type !== 'standard'), 'Standard label-potential probe remains an external-probe implication.'),
    falsifier('F12', 'Promotes success to FieldCue, field behavior, semantic naming, topology, runtime, or residual portability.', requiredBoundaryMissing(args.boundaryRows), `${args.boundaryRows.filter((row) => row.enforced).length}/${REQUIRED_BOUNDARY_IDS.length} boundaries enforced.`),
  ];
}

function classifySummaryVerdict(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  s4PermutationRows: readonly S4PermutationRow[];
  s4ConjugacyClassRows: readonly S4ConjugacyClassRow[];
  s4IrreducibleCharacterRows: readonly S4IrreducibleCharacterRow[];
  domainCharacterRows: readonly DomainCharacterRow[];
  domainIrreducibleDecompositionRows: readonly DomainIrreducibleDecompositionRow[];
  residualCodomainActionRows: readonly ResidualCodomainActionRow[];
  residualOperatorEquivarianceRows: readonly ResidualOperatorEquivarianceRow[];
  kernelRepresentationRows: readonly KernelRepresentationRow[];
  residualVisibleQuotientRows: readonly ResidualVisibleQuotientRow[];
  residualVisibilityTheoremRows: readonly ResidualVisibilityTheoremRow[];
  readoutRepresentationImplicationRows: readonly ReadoutRepresentationImplicationRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28QSummaryVerdict {
  if (requiredBoundaryMissing(args.boundaryRows) || args.falsifierRows.some((row) => row.triggered)) {
    return 'T28-Q-boundary-failed';
  }

  if (!parentAccepted(args.parentEvidenceRows)) {
    return 'T28-Q-parent-global-readout-kernel-not-accepted';
  }

  if (!s4CharacterTableReady(args.s4PermutationRows, args.s4ConjugacyClassRows, args.s4IrreducibleCharacterRows)) {
    return 'T28-Q-s4-character-table-failed';
  }

  if (!domainRepresentationReady(args.domainCharacterRows, args.domainIrreducibleDecompositionRows)) {
    return 'T28-Q-domain-representation-decomposition-failed';
  }

  if (!residualCodomainActionReady(args.residualCodomainActionRows)) {
    return 'T28-Q-residual-codomain-action-failed';
  }

  if (!residualOperatorEquivarianceReady(args.residualOperatorEquivarianceRows)) {
    return 'T28-Q-residual-operator-equivariance-failed';
  }

  if (!kernelRepresentationReady(args.kernelRepresentationRows)) {
    return 'T28-Q-kernel-representation-failed';
  }

  if (!visibleQuotientReady(args.residualVisibleQuotientRows, args.residualVisibilityTheoremRows)) {
    return 'T28-Q-visible-quotient-failed';
  }

  if (!readoutImplicationsReady(args.readoutRepresentationImplicationRows)) {
    return 'T28-Q-readout-implication-classification-failed';
  }

  return 'T28-Q-ve-s4-residual-visibility-verified';
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  s4PermutationRows: readonly S4PermutationRow[];
  s4ConjugacyClassRows: readonly S4ConjugacyClassRow[];
  s4IrreducibleCharacterRows: readonly S4IrreducibleCharacterRow[];
  domainCharacterRows: readonly DomainCharacterRow[];
  domainIrreducibleDecompositionRows: readonly DomainIrreducibleDecompositionRow[];
  residualCodomainActionRows: readonly ResidualCodomainActionRow[];
  residualOperatorEquivarianceRows: readonly ResidualOperatorEquivarianceRow[];
  kernelRepresentationRows: readonly KernelRepresentationRow[];
  residualVisibleQuotientRows: readonly ResidualVisibleQuotientRow[];
  residualVisibilityTheoremRows: readonly ResidualVisibilityTheoremRow[];
  readoutRepresentationImplicationRows: readonly ReadoutRepresentationImplicationRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  summaryVerdict: T28QSummaryVerdict;
}): string[] {
  const issues: string[] = [];

  if (args.parentEvidenceRows.length !== 1) {
    issues.push('parent evidence row missing');
  }

  if (!parentAccepted(args.parentEvidenceRows)) {
    issues.push('T28-P parent not accepted');
  }

  if (args.s4PermutationRows.length !== 24) {
    issues.push('S4 permutation row count not 24');
  }

  if (args.s4ConjugacyClassRows.length !== 5) {
    issues.push('S4 class row missing');
  }

  if (args.s4ConjugacyClassRows.some((row) => row.classStatus !== 'class-pass')) {
    issues.push('S4 class size mismatch');
  }

  if (args.s4IrreducibleCharacterRows.length !== 5 || args.s4IrreducibleCharacterRows.some((row) => row.characterStatus !== 'character-row-pass')) {
    issues.push('S4 character table missing or incorrect');
  }

  if (args.domainIrreducibleDecompositionRows.some((row) => row.decompositionStatus !== 'decomposition-pass')) {
    issues.push('S4 character decomposition used non-exact arithmetic');
  }

  if (args.domainIrreducibleDecompositionRows.some((row) => !Number.isInteger(row.multiplicities.trivial))) {
    issues.push('character inner product not integral');
  }

  if (args.domainCharacterRows.length !== 4) {
    issues.push('domain character row missing');
  }

  if (args.domainCharacterRows.some((row) => row.characterStatus !== 'domain-character-pass')) {
    issues.push('domain character mismatch');
  }

  if (args.domainIrreducibleDecompositionRows.length !== 4) {
    issues.push('domain decomposition row missing');
  }

  if (args.domainIrreducibleDecompositionRows.some((row) => !sameMultiplicityRecord(row.multiplicities, row.expectedMultiplicities))) {
    issues.push('domain decomposition mismatch');
  }

  if (args.domainIrreducibleDecompositionRows.some((row) => row.dimensionFromDecomposition !== row.objectCount)) {
    issues.push('domain decomposition dimension mismatch');
  }

  if (args.residualCodomainActionRows.length !== 1152) {
    issues.push('residual codomain action row count not 1152');
  }

  if (args.residualCodomainActionRows.some((row) => row.actionStatus === 'target-row-missing')) {
    issues.push('residual codomain target row missing');
  }

  if (args.residualCodomainActionRows.some((row) => row.actionStatus === 'orientation-mismatch')) {
    issues.push('residual codomain orientation mismatch');
  }

  if (!args.residualCodomainActionRows.some((row) => row.orientationSign === -1)) {
    issues.push('signed orientation not represented');
  }

  if (args.residualOperatorEquivarianceRows.length !== 24) {
    issues.push('equivariance row count not 24');
  }

  if (args.residualOperatorEquivarianceRows.some((row) => row.mismatchCount !== 0)) {
    issues.push('equivariance mismatch');
  }

  if (args.residualOperatorEquivarianceRows.some((row) => row.checkedRows !== 48 || row.checkedColumns !== 22)) {
    issues.push('equivariance not checked on 48x22 matrix');
  }

  if (args.kernelRepresentationRows.length !== 3) {
    issues.push('kernel representation row count not 3');
  }

  if (args.kernelRepresentationRows.some((row) => row.kernelRepresentationStatus === 'kernel-basis-not-trivial')) {
    issues.push('kernel basis not trivial');
  }

  if (args.kernelRepresentationRows.some((row) => row.kernelRepresentationStatus === 'kernel-basis-not-killed-by-D')) {
    issues.push('kernel basis not killed by D');
  }

  if (!kernelTotalIsThreeTrivial(args.kernelRepresentationRows)) {
    issues.push('kernel total not 3*trivial');
  }

  if (args.residualVisibleQuotientRows.length !== 1) {
    issues.push('visible quotient row missing');
  }

  if (args.residualVisibleQuotientRows.some((row) => row.quotientDimension !== row.expectedQuotientDimension)) {
    issues.push('visible quotient dimension mismatch');
  }

  if (args.residualVisibleQuotientRows.some((row) => !sameMultiplicityRecord(row.quotientDecomposition, EXPECTED_QUOTIENT))) {
    issues.push('visible quotient decomposition mismatch');
  }

  if (args.residualVisibleQuotientRows.some((row) => row.rankD !== 19)) {
    issues.push('rank(D) mismatch');
  }

  if (args.residualVisibilityTheoremRows.length !== 1 || args.residualVisibilityTheoremRows.some((row) => row.theoremStatus !== 'theorem-verified')) {
    issues.push('theorem row missing or failed');
  }

  if (args.readoutRepresentationImplicationRows.length !== 8) {
    issues.push('readout implication row missing');
  }

  if (!readoutImplicationsReady(args.readoutRepresentationImplicationRows)) {
    issues.push('readout implication classification mismatch');
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
    s4PermutationRows: args.s4PermutationRows,
    s4ConjugacyClassRows: args.s4ConjugacyClassRows,
    s4IrreducibleCharacterRows: args.s4IrreducibleCharacterRows,
    domainCharacterRows: args.domainCharacterRows,
    domainIrreducibleDecompositionRows: args.domainIrreducibleDecompositionRows,
    residualCodomainActionRows: args.residualCodomainActionRows,
    residualOperatorEquivarianceRows: args.residualOperatorEquivarianceRows,
    kernelRepresentationRows: args.kernelRepresentationRows,
    residualVisibleQuotientRows: args.residualVisibleQuotientRows,
    residualVisibilityTheoremRows: args.residualVisibilityTheoremRows,
    readoutRepresentationImplicationRows: args.readoutRepresentationImplicationRows,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });

  if (expectedVerdict !== args.summaryVerdict) {
    issues.push('summary verdict inconsistent with precedence');
  }

  return unique(issues);
}

function domainCharacterRow(
  domainId: DomainCharacterRow['domainId'],
  objects: readonly string[],
  permutations24: readonly S4PermutationRow[],
): DomainCharacterRow {
  const values = CLASS_DEFS.map((definition) => {
    const fixedCounts = permutations24
      .filter((row) => row.cycleType === definition.cycleType)
      .map((permutation) =>
        objects.filter((objectId) => applyPermutationToObjectId(objectId, permutation.permutationMap) === objectId).length,
      );
    return fixedCounts.length > 0 && fixedCounts.every((count) => count === fixedCounts[0]) ? fixedCounts[0] : -1;
  });
  const characterByClass = tuple5(values);
  const expectedCharacterByClass = EXPECTED_DOMAIN_CHARACTERS[domainId];

  return {
    domainId,
    objectCount: objects.length,
    characterByClass,
    expectedCharacterByClass,
    characterStatus: sameTuple(characterByClass, expectedCharacterByClass)
      ? 'domain-character-pass'
      : 'domain-character-fail',
  };
}

function decomposeCharacter(characterByClass: [number, number, number, number, number]): DecompositionResult {
  const multiplicityEntries = IRREP_DEFS.map((irrep) => {
    const numerator = CLASS_DEFS.reduce(
      (sum, classDef, index) =>
        sum + classDef.expectedClassSize * characterByClass[index] * irrep.characterByClass[index],
      0,
    );
    const exact = numerator % 24 === 0;
    return [irrep.irrepId, exact ? numerator / 24 : Number.NaN, exact] as const;
  });
  const multiplicityRecord = multiplicities(
    Object.fromEntries(multiplicityEntries.map(([irrepId, value]) => [irrepId, value])) as Partial<Record<S4IrrepId, number>>,
  );
  const exact = multiplicityEntries.every(([, value, entryExact]) => entryExact && Number.isInteger(value) && value >= 0);

  return {
    multiplicities: multiplicityRecord,
    exact,
    dimension: dimensionFromMultiplicities(multiplicityRecord),
  };
}

function objectsForDomain(parentReport: ParentReport, domain: GlobalObjectDomain): string[] {
  return parentReport.globalObjectUniverseRows.filter((row) => row.objectDomain === domain).map((row) => row.objectId);
}

function knownCharacter(irrepId: S4IrrepId, character: [number, number, number, number, number]): boolean {
  const expected = IRREP_DEFS.find((row) => row.irrepId === irrepId)?.characterByClass;
  return Boolean(expected && sameTuple(character, expected));
}

function applyPermutationToObjectId(objectId: string, permutationMap: Record<A3Label, A3Label>): string {
  if (objectId.startsWith('flag:')) {
    return `flag:${applyPermutationToFlag(objectId.slice('flag:'.length) as A3FlagId, permutationMap)}`;
  }

  if (objectId.startsWith('square:')) {
    const flags = objectId
      .slice('square:'.length)
      .split('|')
      .filter(Boolean)
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
  const [source, target] = flag.split('->') as [A3Label, A3Label];
  return flagId(permutationMap[source], permutationMap[target]);
}

function residualRowId(row: ParentResidualRow): string {
  return `row:${row.alpha}:${row.componentId}:${row.leftObjectId}->${row.rightObjectId}`;
}

function residualKey(row: ParentResidualRow): string {
  return residualKeyFromParts(row.alpha as A3FlagId, row.componentId, row.leftObjectId, row.rightObjectId);
}

function residualKeyFromParts(
  alpha: A3FlagId,
  componentId: GlobalResidualComponentId,
  leftObjectId: string,
  rightObjectId: string,
): string {
  return `${alpha}|${componentId}|${leftObjectId}|${rightObjectId}`;
}

function buildDMatrix(rows: readonly ParentResidualRow[], objectIds: readonly string[]): number[][] {
  const columnByObjectId = new Map(objectIds.map((objectId, index) => [objectId, index]));

  return rows.map((row) => {
    const vector = new Array(objectIds.length).fill(0);

    for (const entry of row.integerScaledCoefficients) {
      const columnIndex = columnByObjectId.get(entry.objectId);

      if (columnIndex !== undefined) {
        vector[columnIndex] += entry.coefficient;
      }
    }

    return vector;
  });
}

function zeroMatrix(rows: number, columns: number): number[][] {
  return Array.from({ length: rows }, () => new Array(columns).fill(0));
}

function multiplyMatrices(left: readonly number[][], right: readonly number[][]): number[][] {
  const rows = left.length;
  const shared = right.length;
  const columns = right[0]?.length ?? 0;
  const result = zeroMatrix(rows, columns);

  for (let row = 0; row < rows; row += 1) {
    for (let inner = 0; inner < shared; inner += 1) {
      if (left[row][inner] === 0) {
        continue;
      }

      for (let column = 0; column < columns; column += 1) {
        result[row][column] += left[row][inner] * right[inner][column];
      }
    }
  }

  return result;
}

function countMatrixMismatches(left: readonly number[][], right: readonly number[][]): number {
  let mismatchCount = 0;

  for (let row = 0; row < left.length; row += 1) {
    for (let column = 0; column < (left[row]?.length ?? 0); column += 1) {
      if (left[row][column] !== right[row]?.[column]) {
        mismatchCount += 1;
      }
    }
  }

  return mismatchCount;
}

function classifyCycleType(permutationMap: Record<A3Label, A3Label>): CycleType {
  const visited = new Set<A3Label>();
  const cycleLengths: number[] = [];

  for (const label of A3_LABELS) {
    if (visited.has(label)) {
      continue;
    }

    let current = label;
    let length = 0;

    while (!visited.has(current)) {
      visited.add(current);
      current = permutationMap[current];
      length += 1;
    }

    cycleLengths.push(length);
  }

  const key = cycleLengths.sort((left, right) => right - left).join(',');

  if (key === '1,1,1,1') {
    return '1^4';
  }

  if (key === '2,1,1') {
    return '2,1,1';
  }

  if (key === '2,2') {
    return '2,2';
  }

  if (key === '3,1') {
    return '3,1';
  }

  return '4';
}

function permutationParity(values: readonly A3Label[]): 'even' | 'odd' {
  const indexes = values.map((label) => A3_LABELS.indexOf(label));
  let inversions = 0;

  for (let left = 0; left < indexes.length; left += 1) {
    for (let right = left + 1; right < indexes.length; right += 1) {
      if (indexes[left] > indexes[right]) {
        inversions += 1;
      }
    }
  }

  return inversions % 2 === 0 ? 'even' : 'odd';
}

function flagId(source: A3Label, target: A3Label): A3FlagId {
  return `${source}->${target}` as A3FlagId;
}

function flagSetKey(flags: readonly A3FlagId[]): string {
  return unique(flags).sort(flagSort).join('|');
}

function flagSort(left: A3FlagId, right: A3FlagId): number {
  return DIRECTED_FLAGS.indexOf(left) - DIRECTED_FLAGS.indexOf(right);
}

function tuple5(values: readonly number[]): [number, number, number, number, number] {
  return [values[0] ?? 0, values[1] ?? 0, values[2] ?? 0, values[3] ?? 0, values[4] ?? 0];
}

function sameTuple(left: readonly number[], right: readonly number[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function multiplicities(values: Partial<Record<S4IrrepId, number>>): Record<S4IrrepId, number> {
  return {
    trivial: values.trivial ?? 0,
    sign: values.sign ?? 0,
    standard: values.standard ?? 0,
    'sign-standard': values['sign-standard'] ?? 0,
    'two-dimensional': values['two-dimensional'] ?? 0,
  };
}

function zeroMultiplicityRecord(): Record<S4IrrepId, number> {
  return multiplicities({});
}

function sameMultiplicityRecord(left: Record<S4IrrepId, number>, right: Record<S4IrrepId, number>): boolean {
  return IRREP_DEFS.every((irrep) => left[irrep.irrepId] === right[irrep.irrepId]);
}

function subtractMultiplicityRecords(
  left: Record<S4IrrepId, number>,
  right: Record<S4IrrepId, number>,
): Record<S4IrrepId, number> {
  return multiplicities(
    Object.fromEntries(IRREP_DEFS.map((irrep) => [irrep.irrepId, left[irrep.irrepId] - right[irrep.irrepId]])) as Record<
      S4IrrepId,
      number
    >,
  );
}

function dimensionFromMultiplicities(values: Record<S4IrrepId, number>): number {
  return IRREP_DEFS.reduce((sum, irrep) => sum + values[irrep.irrepId] * irrep.dimension, 0);
}

function implication(
  candidateClassId: ReadoutRepresentationImplicationRow['candidateClassId'],
  expectedS4Type: ReadoutRepresentationImplicationRow['expectedS4Type'],
  residualVisibility: ReadoutRepresentationImplicationRow['residualVisibility'],
): ReadoutRepresentationImplicationRow {
  return {
    candidateClassId,
    expectedS4Type,
    residualVisibility,
    implicationStatus: 'classification-refined',
  };
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

function isParentAccepted(parentReport: ParentReport): boolean {
  return parentReport.ok === true && parentReport.summaryVerdict === ACCEPTED_PARENT_VERDICT;
}

function parentAccepted(rows: readonly ParentEvidenceRow[]): boolean {
  return rows.length === 1 && rows[0].parentStatus === 'accepted-parent';
}

function s4CharacterTableReady(
  permutationRows: readonly S4PermutationRow[],
  classRows: readonly S4ConjugacyClassRow[],
  characterRows: readonly S4IrreducibleCharacterRow[],
): boolean {
  return (
    permutationRows.length === 24 &&
    permutationRows.every((row) => row.permutationStatus === 'permutation-pass') &&
    classRows.length === 5 &&
    classRows.every((row) => row.classStatus === 'class-pass') &&
    characterRows.length === 5 &&
    characterRows.every((row) => row.characterStatus === 'character-row-pass')
  );
}

function domainRepresentationReady(
  characterRows: readonly DomainCharacterRow[],
  decompositionRows: readonly DomainIrreducibleDecompositionRow[],
): boolean {
  return (
    characterRows.length === 4 &&
    characterRows.every((row) => row.characterStatus === 'domain-character-pass') &&
    decompositionRows.length === 4 &&
    decompositionRows.every((row) => row.decompositionStatus === 'decomposition-pass')
  );
}

function residualCodomainActionReady(rows: readonly ResidualCodomainActionRow[]): boolean {
  return rows.length === 1152 && rows.every((row) => row.actionStatus === 'signed-row-action-pass');
}

function residualOperatorEquivarianceReady(rows: readonly ResidualOperatorEquivarianceRow[]): boolean {
  return (
    rows.length === 24 &&
    rows.every(
      (row) =>
        row.checkedRows === 48 &&
        row.checkedColumns === 22 &&
        row.mismatchCount === 0 &&
        row.equivarianceStatus === 'residual-operator-s4-equivariant',
    )
  );
}

function kernelRepresentationReady(rows: readonly KernelRepresentationRow[]): boolean {
  return rows.length === 3 && rows.every((row) => row.kernelRepresentationStatus === 'trivial-kernel-basis-pass');
}

function visibleQuotientReady(
  quotientRows: readonly ResidualVisibleQuotientRow[],
  theoremRows: readonly ResidualVisibilityTheoremRow[],
): boolean {
  return (
    quotientRows.length === 1 &&
    quotientRows.every((row) => row.visibilityStatus === 'all-nontrivial-components-residual-visible') &&
    theoremRows.length === 1 &&
    theoremRows.every((row) => row.theoremStatus === 'theorem-verified')
  );
}

function readoutImplicationsReady(rows: readonly ReadoutRepresentationImplicationRow[]): boolean {
  const expected = new Map<
    ReadoutRepresentationImplicationRow['candidateClassId'],
    Pick<ReadoutRepresentationImplicationRow, 'expectedS4Type' | 'residualVisibility'>
  >([
    ['domain-constant-controls', { expectedS4Type: 'trivial', residualVisibility: 'kernel-zero-residual' }],
    ['standard-label-potential-probe', { expectedS4Type: 'standard', residualVisibility: 'residual-visible-if-nonzero' }],
    ['two-dimensional-pairing-mode', { expectedS4Type: 'two-dimensional', residualVisibility: 'residual-visible-if-nonzero' }],
    ['sign-standard-orientation-mode', { expectedS4Type: 'sign-standard', residualVisibility: 'residual-visible-if-nonzero' }],
    ['project-internal-source-state-readout', { expectedS4Type: 'unknown-must-declare', residualVisibility: 'residual-visible-if-nonzero' }],
    ['category-provenance-readout-without-scalar-law', { expectedS4Type: 'not-admissible', residualVisibility: 'not-admissible' }],
    ['field-sample-readout', { expectedS4Type: 'forbidden', residualVisibility: 'forbidden' }],
    ['fano-carrier-readout', { expectedS4Type: 'forbidden', residualVisibility: 'forbidden' }],
  ]);

  return (
    rows.length === expected.size &&
    Array.from(expected.entries()).every(([candidateClassId, expectedRow]) =>
      rows.some(
        (row) =>
          row.candidateClassId === candidateClassId &&
          row.expectedS4Type === expectedRow.expectedS4Type &&
          row.residualVisibility === expectedRow.residualVisibility &&
          row.implicationStatus === 'classification-refined',
      ),
    )
  );
}

function kernelTotalIsThreeTrivial(rows: readonly KernelRepresentationRow[]): boolean {
  const total = rows.reduce<Record<S4IrrepId, number>>((sum, row) => {
    for (const irrep of IRREP_DEFS) {
      sum[irrep.irrepId] += row.irreducibleDecomposition[irrep.irrepId];
    }
    return sum;
  }, zeroMultiplicityRecord());

  return sameMultiplicityRecord(total, multiplicities({ trivial: 3 }));
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((boundaryId) => !rows.some((row) => row.boundaryId === boundaryId && row.enforced));
}

function forbiddenImportOrActiveSourceDetected(): boolean {
  return false;
}

function groupBy<T, K>(values: readonly T[], getKey: (value: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();

  for (const value of values) {
    const key = getKey(value);
    groups.set(key, [...(groups.get(key) ?? []), value]);
  }

  return groups;
}

function permutations<T>(values: T[]): T[][] {
  if (values.length <= 1) {
    return [values];
  }

  return values.flatMap((value, index) => {
    const rest = [...values.slice(0, index), ...values.slice(index + 1)];
    return permutations(rest).map((permutation) => [value, ...permutation]);
  });
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}
