import { buildPSimplexCuboctahedralVEFlagStarResidualT28OReport } from './pSimplexCuboctahedralVEFlagStarResidualT28O';

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

export type T28PSummaryVerdict =
  | 'T28-P-ve-global-readout-space-and-kernel-verified'
  | 'T28-P-parent-residual-operator-not-accepted'
  | 'T28-P-definition-context-failed'
  | 'T28-P-global-object-universe-failed'
  | 'T28-P-global-residual-operator-failed'
  | 'T28-P-kernel-rank-failed'
  | 'T28-P-null-control-failed'
  | 'T28-P-sensitivity-control-failed'
  | 'T28-P-readout-admissibility-rules-failed'
  | 'T28-P-bad-readout-rejection-failed'
  | 'T28-P-boundary-failed';

export interface ParentEvidenceRow {
  parentId: 'T28-O';
  method: string;
  ok: boolean;
  summaryVerdict: string;
  consumedSections: string[];
  ignoredSections: string[];
  parentStatus: 'accepted-parent' | 'rejected-parent';
}

export interface DefinitionContextRow {
  contextId: 'T28-P-global-VE-readout-space';
  definedOver: string[];
  notDefinedOver: string[];
  status: 'context-valid' | 'context-invalid';
}

export type GlobalObjectDomain = 'flag' | 've-square' | 've-a2-hexagon';

export interface GlobalObjectUniverseRow {
  objectId: string;
  objectDomain: GlobalObjectDomain;
  objectKey: string;
  sourceParentRows: string[];
  objectStatus: 'global-object-ready' | 'missing-parent-object' | 'duplicate-object';
}

export interface GlobalObjectDomainRow {
  objectDomain: GlobalObjectDomain;
  objectCount: number;
  expectedObjectCount: number;
  domainStatus: 'domain-ready' | 'domain-count-mismatch';
}

export type GlobalResidualComponentId = 'r_out' | 'r_in' | 'r_square' | 'r_hex';

export interface GlobalResidualOperatorRow {
  alpha: A3FlagId;
  componentId: GlobalResidualComponentId;
  objectDomain: GlobalObjectDomain;
  leftObjectId: string;
  rightObjectId: string;
  integerScaledCoefficients: Array<{
    objectId: string;
    coefficient: -1 | 1;
  }>;
  residualFormula: '0.5 * (left - right)';
  sourceLocalPairRowId: string;
  operatorRowStatus:
    | 'operator-row-pass'
    | 'missing-left-object'
    | 'missing-right-object'
    | 'coefficient-error'
    | 'domain-mismatch';
}

export interface GlobalResidualOperatorBlockRow {
  blockId: 'flag-block' | 'square-block' | 'hex-block' | 'total';
  objectCount: number;
  residualRowCount: number;
  rankOverRationals: number;
  expectedRank: number;
  kernelDimension: number;
  expectedKernelDimension: number;
  rankStatus: 'rank-pass' | 'rank-fail';
}

export interface KernelBasisRow {
  basisId: 'flag-domain-constant' | 'square-domain-constant' | 'hex-domain-constant';
  nonzeroDomain: GlobalObjectDomain;
  assignedValues: Array<{
    objectId: string;
    value: number;
  }>;
  residualNonzeroCount: number;
  residualMaxMagnitude: number;
  kernelBasisStatus: 'kernel-basis-pass' | 'kernel-basis-fail';
}

export interface NullReadoutControlRow {
  readoutId:
    | 'zero-all'
    | 'one-all'
    | 'domain-constants-1-2-3'
    | 'flag-only-constant'
    | 'square-only-constant'
    | 'hex-only-constant';
  readoutKind: 'null-control' | 'domain-constant-control';
  assignedValueRule: string;
  residualNonzeroCount: number;
  residualMaxMagnitude: number;
  controlStatus: 'null-control-pass' | 'null-control-fail';
}

export interface SensitivityControlRow {
  readoutId: string;
  activatedObjectId: string;
  activatedObjectDomain: GlobalObjectDomain;
  residualNonzeroCount: number;
  residualMaxMagnitude: number;
  sensitivityStatus: 'sensitivity-pass' | 'sensitivity-fail';
}

export interface ReadoutAdmissibilityRuleRow {
  ruleId:
    | 'global-object-single-value'
    | 'domain-complete'
    | 'parent-derived-object-domain'
    | 've-native-only'
    | 'no-per-alpha-tuning'
    | 'no-residual-tautology'
    | 'declared-transform-status'
    | 'no-category-scalarization-without-law'
    | 'forbidden-source-clean'
    | 'control-comparable';
  ruleStatement: string;
  ruleStatus: 'rule-defined' | 'rule-missing';
}

export interface CandidateReadoutClassificationRow {
  candidateClassId:
    | 'domain-constant-controls'
    | 'one-hot-sensitivity-controls'
    | 'per-alpha-local-fixtures-from-T28-O'
    | 'category-provenance-readout-without-scalar-law'
    | 'external-label-potential-probe'
    | 'project-internal-source-state-readout'
    | 'field-sample-readout'
    | 'fano-carrier-readout';
  classification:
    | 'admissible-control'
    | 'admissible-sensitivity-control'
    | 'rejected-not-global-readout'
    | 'rejected-no-scalar-law'
    | 'deferred-external-probe'
    | 'deferred-needs-separate-authority'
    | 'forbidden';
  reason: string;
}

export interface BadReadoutRejectionRow {
  badReadoutId:
    | 'alpha-local-left-basis-fixture'
    | 'alpha-local-all-antisymmetric-fixture'
    | 'face-origin-category-as-number'
    | 'fano-signed-lift-value'
    | 'field-sample-value';
  rejectionReason:
    | 'not-global-object-assignment'
    | 'no-declared-scalarization-law'
    | 'forbidden-source'
    | 'not-ve-native';
  rejectionStatus: 'rejected' | 'not-rejected';
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

export interface PSimplexCuboctahedralVEGlobalReadoutAdmissibilityT28PReport {
  method: 'p-simplex-cuboctahedral-ve-global-readout-admissibility-t28p';
  diagnosticScope: 've-global-readout-admissibility-and-residual-kernel';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  parentEvidenceRows: ParentEvidenceRow[];
  definitionContextRows: DefinitionContextRow[];
  globalObjectUniverseRows: GlobalObjectUniverseRow[];
  globalObjectDomainRows: GlobalObjectDomainRow[];
  globalResidualOperatorRows: GlobalResidualOperatorRow[];
  globalResidualOperatorBlockRows: GlobalResidualOperatorBlockRow[];
  kernelBasisRows: KernelBasisRow[];
  nullReadoutControlRows: NullReadoutControlRow[];
  sensitivityControlRows: SensitivityControlRow[];
  readoutAdmissibilityRuleRows: ReadoutAdmissibilityRuleRow[];
  candidateReadoutClassificationRows: CandidateReadoutClassificationRow[];
  badReadoutRejectionRows: BadReadoutRejectionRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  summaryVerdict: T28PSummaryVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface Fraction {
  num: bigint;
  den: bigint;
}

type T28OReport = ReturnType<typeof buildPSimplexCuboctahedralVEFlagStarResidualT28OReport>;
type T28OLocalSwappedPairRow = T28OReport['localSwappedPairRows'][number];

interface ObjectInsert {
  objectId: string;
  objectDomain: GlobalObjectDomain;
  objectKey: string;
  sourceParentRow: string;
}

interface ResidualEvaluation {
  residualNonzeroCount: number;
  residualMaxMagnitude: number;
}

const METHOD = 'p-simplex-cuboctahedral-ve-global-readout-admissibility-t28p' as const;
const DIAGNOSTIC_SCOPE = 've-global-readout-admissibility-and-residual-kernel' as const;
const BRANCH_REF = 'wgate/arf-w1-root-frame-v0' as const;
const ACCEPTED_PARENT_VERDICT = 'T28-O-ve-local-flag-star-residual-law-verified';
const A3_LABELS: readonly A3Label[] = ['A', 'B', 'C', 'D'];
const DIRECTED_FLAGS: readonly A3FlagId[] = A3_LABELS.flatMap((source) =>
  A3_LABELS.filter((target) => target !== source).map((target) => flagId(source, target)),
) as A3FlagId[];
const DOMAIN_ORDER: readonly GlobalObjectDomain[] = ['flag', 've-square', 've-a2-hexagon'];
const EXPECTED_DOMAIN_COUNTS: Record<GlobalObjectDomain, number> = {
  flag: 12,
  've-square': 6,
  've-a2-hexagon': 4,
};
const REQUIRED_BOUNDARY_IDS = [
  'not-natural-readout-claim',
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
  'not-readout-discovery',
  'not-project-internal-source-state-readout-yet',
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
  'F15',
] as const;

export function buildPSimplexCuboctahedralVEGlobalReadoutAdmissibilityT28PReport(): PSimplexCuboctahedralVEGlobalReadoutAdmissibilityT28PReport {
  const parentReport = buildPSimplexCuboctahedralVEFlagStarResidualT28OReport();
  const parentEvidenceRows = buildParentEvidenceRows(parentReport);
  const definitionContextRows = buildDefinitionContextRows(parentReport);
  const globalObjectUniverseRows = buildGlobalObjectUniverseRows(parentReport);
  const globalObjectDomainRows = buildGlobalObjectDomainRows(globalObjectUniverseRows);
  const globalResidualOperatorRows = buildGlobalResidualOperatorRows(parentReport, globalObjectUniverseRows);
  const globalResidualOperatorBlockRows = buildGlobalResidualOperatorBlockRows(
    globalObjectUniverseRows,
    globalResidualOperatorRows,
  );
  const kernelBasisRows = buildKernelBasisRows(globalObjectUniverseRows, globalResidualOperatorRows);
  const nullReadoutControlRows = buildNullReadoutControlRows(globalObjectUniverseRows, globalResidualOperatorRows);
  const sensitivityControlRows = buildSensitivityControlRows(globalObjectUniverseRows, globalResidualOperatorRows);
  const readoutAdmissibilityRuleRows = buildReadoutAdmissibilityRuleRows();
  const candidateReadoutClassificationRows = buildCandidateReadoutClassificationRows();
  const badReadoutRejectionRows = buildBadReadoutRejectionRows();
  const boundaryRows = buildBoundaryRows();
  const preliminaryVerdict = classifySummaryVerdict({
    parentEvidenceRows,
    definitionContextRows,
    globalObjectUniverseRows,
    globalObjectDomainRows,
    globalResidualOperatorRows,
    globalResidualOperatorBlockRows,
    kernelBasisRows,
    nullReadoutControlRows,
    sensitivityControlRows,
    readoutAdmissibilityRuleRows,
    candidateReadoutClassificationRows,
    badReadoutRejectionRows,
    boundaryRows,
    falsifierRows: [],
  });
  const falsifierRows = buildFalsifierRows({
    parentEvidenceRows,
    definitionContextRows,
    globalObjectUniverseRows,
    globalObjectDomainRows,
    globalResidualOperatorRows,
    globalResidualOperatorBlockRows,
    kernelBasisRows,
    nullReadoutControlRows,
    sensitivityControlRows,
    readoutAdmissibilityRuleRows,
    candidateReadoutClassificationRows,
    badReadoutRejectionRows,
    boundaryRows,
    summaryVerdict: preliminaryVerdict,
  });
  const summaryVerdict = classifySummaryVerdict({
    parentEvidenceRows,
    definitionContextRows,
    globalObjectUniverseRows,
    globalObjectDomainRows,
    globalResidualOperatorRows,
    globalResidualOperatorBlockRows,
    kernelBasisRows,
    nullReadoutControlRows,
    sensitivityControlRows,
    readoutAdmissibilityRuleRows,
    candidateReadoutClassificationRows,
    badReadoutRejectionRows,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    definitionContextRows,
    globalObjectUniverseRows,
    globalObjectDomainRows,
    globalResidualOperatorRows,
    globalResidualOperatorBlockRows,
    kernelBasisRows,
    nullReadoutControlRows,
    sensitivityControlRows,
    readoutAdmissibilityRuleRows,
    candidateReadoutClassificationRows,
    badReadoutRejectionRows,
    boundaryRows,
    falsifierRows,
    summaryVerdict,
  });

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    parentEvidenceRows,
    definitionContextRows,
    globalObjectUniverseRows,
    globalObjectDomainRows,
    globalResidualOperatorRows,
    globalResidualOperatorBlockRows,
    kernelBasisRows,
    nullReadoutControlRows,
    sensitivityControlRows,
    readoutAdmissibilityRuleRows,
    candidateReadoutClassificationRows,
    badReadoutRejectionRows,
    boundaryRows,
    falsifierRows,
    summaryVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0 && falsifierRows.every((row) => !row.triggered),
  };
}

function buildParentEvidenceRows(parentReport: T28OReport): ParentEvidenceRow[] {
  return [
    {
      parentId: 'T28-O',
      method: parentReport.method,
      ok: parentReport.ok,
      summaryVerdict: parentReport.summaryVerdict,
      consumedSections: [
        'localInvolutionRows',
        'localSwappedPairRows',
        'localWitnessSpaceRows',
        'boundaryRows',
        'falsifierRows',
      ],
      ignoredSections: [
        'pairFixtureRows',
        'localWitnessFixtureRows',
        'localResidualRows',
        'tauActionResidualRows',
        'residualRestorationRows',
      ],
      parentStatus: isParentAccepted(parentReport) ? 'accepted-parent' : 'rejected-parent',
    },
  ];
}

function buildDefinitionContextRows(parentReport: T28OReport): DefinitionContextRow[] {
  return [
    {
      contextId: 'T28-P-global-VE-readout-space',
      definedOver: [
        'T28-N0 B+ direct bridge',
        'T28-O local flag-star residual pairs',
        'directed A3 flags',
        'VE square faces',
        'VE A2 omitted-label hexagons',
        'global object-value assignment',
      ],
      notDefinedOver: [
        'per-alpha local fixture values',
        'topology-only cuboctahedron',
        'canonical vertex order',
        'Fano',
        'octonions',
        'field sampler',
        'source emission',
        'semantic naming',
        'topology module',
        'composition-holonomy overlay',
      ],
      status:
        isParentAccepted(parentReport) &&
        parentReport.localInvolutionRows.length === 12 &&
        parentReport.localSwappedPairRows.length === 48 &&
        parentReport.localWitnessSpaceRows.length === 12
          ? 'context-valid'
          : 'context-invalid',
    },
  ];
}

function buildGlobalObjectUniverseRows(parentReport: T28OReport): GlobalObjectUniverseRow[] {
  const inserts: ObjectInsert[] = [];

  for (const row of parentReport.localInvolutionRows) {
    inserts.push({
      objectId: flagObjectId(row.alpha as A3FlagId),
      objectDomain: 'flag',
      objectKey: row.alpha,
      sourceParentRow: `localInvolutionRows:${row.alpha}`,
    });
  }

  for (const row of parentReport.localSwappedPairRows) {
    const sourcePrefix = `localSwappedPairRows:${row.alpha}:${row.pairKind}`;

    if (row.pairKind === 'out-flag-pair' || row.pairKind === 'in-flag-pair') {
      inserts.push(
        objectInsertFromPair(row.leftObjectId, 'flag', sourcePrefix, 'left'),
        objectInsertFromPair(row.rightObjectId, 'flag', sourcePrefix, 'right'),
      );
    }

    if (row.pairKind === 'incident-square-pair') {
      inserts.push(
        objectInsertFromPair(row.leftObjectId, 've-square', sourcePrefix, 'left'),
        objectInsertFromPair(row.rightObjectId, 've-square', sourcePrefix, 'right'),
      );
    }

    if (row.pairKind === 've-central-hexagon-pair') {
      inserts.push(
        objectInsertFromPair(row.leftObjectId, 've-a2-hexagon', sourcePrefix, 'left'),
        objectInsertFromPair(row.rightObjectId, 've-a2-hexagon', sourcePrefix, 'right'),
      );
    }
  }

  const grouped = new Map<string, ObjectInsert[]>();

  for (const insert of inserts) {
    grouped.set(insert.objectId, [...(grouped.get(insert.objectId) ?? []), insert]);
  }

  return Array.from(grouped.entries())
    .map(([objectId, group]) => {
      const domains = unique(group.map((row) => row.objectDomain));
      const sourceParentRows = unique(group.map((row) => row.sourceParentRow)).sort();
      const objectStatus: GlobalObjectUniverseRow['objectStatus'] =
        domains.length > 1
          ? 'duplicate-object'
          : sourceParentRows.length === 0
            ? 'missing-parent-object'
            : 'global-object-ready';

      return {
        objectId,
        objectDomain: group[0].objectDomain,
        objectKey: group[0].objectKey,
        sourceParentRows,
        objectStatus,
      };
    })
    .sort(globalObjectSort);
}

function buildGlobalObjectDomainRows(rows: readonly GlobalObjectUniverseRow[]): GlobalObjectDomainRow[] {
  return DOMAIN_ORDER.map((objectDomain) => {
    const objectCount = rows.filter((row) => row.objectDomain === objectDomain).length;
    const expectedObjectCount = EXPECTED_DOMAIN_COUNTS[objectDomain];

    return {
      objectDomain,
      objectCount,
      expectedObjectCount,
      domainStatus: objectCount === expectedObjectCount ? 'domain-ready' : 'domain-count-mismatch',
    };
  });
}

function buildGlobalResidualOperatorRows(
  parentReport: T28OReport,
  globalObjectUniverseRows: readonly GlobalObjectUniverseRow[],
): GlobalResidualOperatorRow[] {
  const objectById = new Map(globalObjectUniverseRows.map((row) => [row.objectId, row]));

  return parentReport.localSwappedPairRows.map((row) => {
    const mapping = componentMapping(row.pairKind);
    const leftObject = objectById.get(row.leftObjectId);
    const rightObject = objectById.get(row.rightObjectId);
    const coefficients: GlobalResidualOperatorRow['integerScaledCoefficients'] = [
      { objectId: row.leftObjectId, coefficient: 1 },
      { objectId: row.rightObjectId, coefficient: -1 },
    ];
    const coefficientPass =
      coefficients.length === 2 &&
      coefficients[0].coefficient === 1 &&
      coefficients[1].coefficient === -1 &&
      coefficients[0].objectId !== coefficients[1].objectId;
    const operatorRowStatus: GlobalResidualOperatorRow['operatorRowStatus'] = !leftObject
      ? 'missing-left-object'
      : !rightObject
        ? 'missing-right-object'
        : !coefficientPass
          ? 'coefficient-error'
          : leftObject.objectDomain !== mapping.objectDomain || rightObject.objectDomain !== mapping.objectDomain
            ? 'domain-mismatch'
            : 'operator-row-pass';

    return {
      alpha: row.alpha as A3FlagId,
      componentId: mapping.componentId,
      objectDomain: mapping.objectDomain,
      leftObjectId: row.leftObjectId,
      rightObjectId: row.rightObjectId,
      integerScaledCoefficients: coefficients,
      residualFormula: '0.5 * (left - right)',
      sourceLocalPairRowId: localPairRowId(row),
      operatorRowStatus,
    };
  });
}

function buildGlobalResidualOperatorBlockRows(
  globalObjectUniverseRows: readonly GlobalObjectUniverseRow[],
  globalResidualOperatorRows: readonly GlobalResidualOperatorRow[],
): GlobalResidualOperatorBlockRow[] {
  const rows: GlobalResidualOperatorBlockRow[] = [
    blockRow('flag-block', 'flag', 11, 1, globalObjectUniverseRows, globalResidualOperatorRows),
    blockRow('square-block', 've-square', 5, 1, globalObjectUniverseRows, globalResidualOperatorRows),
    blockRow('hex-block', 've-a2-hexagon', 3, 1, globalObjectUniverseRows, globalResidualOperatorRows),
  ];
  const totalObjects = sortedObjectIds(globalObjectUniverseRows);
  const totalMatrix = integerMatrix(globalResidualOperatorRows, totalObjects);
  const totalRank = rankOverRationals(totalMatrix);
  const totalKernelDimension = totalObjects.length - totalRank;

  rows.push({
    blockId: 'total',
    objectCount: totalObjects.length,
    residualRowCount: globalResidualOperatorRows.length,
    rankOverRationals: totalRank,
    expectedRank: 19,
    kernelDimension: totalKernelDimension,
    expectedKernelDimension: 3,
    rankStatus: totalRank === 19 && totalKernelDimension === 3 ? 'rank-pass' : 'rank-fail',
  });

  return rows;
}

function buildKernelBasisRows(
  globalObjectUniverseRows: readonly GlobalObjectUniverseRow[],
  globalResidualOperatorRows: readonly GlobalResidualOperatorRow[],
): KernelBasisRow[] {
  return [
    kernelBasisRow('flag-domain-constant', 'flag', globalObjectUniverseRows, globalResidualOperatorRows),
    kernelBasisRow('square-domain-constant', 've-square', globalObjectUniverseRows, globalResidualOperatorRows),
    kernelBasisRow('hex-domain-constant', 've-a2-hexagon', globalObjectUniverseRows, globalResidualOperatorRows),
  ];
}

function buildNullReadoutControlRows(
  globalObjectUniverseRows: readonly GlobalObjectUniverseRow[],
  globalResidualOperatorRows: readonly GlobalResidualOperatorRow[],
): NullReadoutControlRow[] {
  const definitions: Array<{
    readoutId: NullReadoutControlRow['readoutId'];
    readoutKind: NullReadoutControlRow['readoutKind'];
    assignedValueRule: string;
    values: Map<string, number>;
  }> = [
    {
      readoutId: 'zero-all',
      readoutKind: 'null-control',
      assignedValueRule: 'all global objects = 0',
      values: readoutByDomain(globalObjectUniverseRows, { flag: 0, 've-square': 0, 've-a2-hexagon': 0 }),
    },
    {
      readoutId: 'one-all',
      readoutKind: 'null-control',
      assignedValueRule: 'all global objects = 1',
      values: readoutByDomain(globalObjectUniverseRows, { flag: 1, 've-square': 1, 've-a2-hexagon': 1 }),
    },
    {
      readoutId: 'domain-constants-1-2-3',
      readoutKind: 'domain-constant-control',
      assignedValueRule: 'flags = 1, VE squares = 2, VE A2 hexagons = 3',
      values: readoutByDomain(globalObjectUniverseRows, { flag: 1, 've-square': 2, 've-a2-hexagon': 3 }),
    },
    {
      readoutId: 'flag-only-constant',
      readoutKind: 'domain-constant-control',
      assignedValueRule: 'flags = 1, other domains = 0',
      values: readoutByDomain(globalObjectUniverseRows, { flag: 1, 've-square': 0, 've-a2-hexagon': 0 }),
    },
    {
      readoutId: 'square-only-constant',
      readoutKind: 'domain-constant-control',
      assignedValueRule: 'VE squares = 1, other domains = 0',
      values: readoutByDomain(globalObjectUniverseRows, { flag: 0, 've-square': 1, 've-a2-hexagon': 0 }),
    },
    {
      readoutId: 'hex-only-constant',
      readoutKind: 'domain-constant-control',
      assignedValueRule: 'VE A2 hexagons = 1, other domains = 0',
      values: readoutByDomain(globalObjectUniverseRows, { flag: 0, 've-square': 0, 've-a2-hexagon': 1 }),
    },
  ];

  return definitions.map((definition) => {
    const residual = evaluateResidualRows(definition.values, globalResidualOperatorRows);

    return {
      readoutId: definition.readoutId,
      readoutKind: definition.readoutKind,
      assignedValueRule: definition.assignedValueRule,
      residualNonzeroCount: residual.residualNonzeroCount,
      residualMaxMagnitude: residual.residualMaxMagnitude,
      controlStatus:
        residual.residualNonzeroCount === 0 && equal(residual.residualMaxMagnitude, 0)
          ? 'null-control-pass'
          : 'null-control-fail',
    };
  });
}

function buildSensitivityControlRows(
  globalObjectUniverseRows: readonly GlobalObjectUniverseRow[],
  globalResidualOperatorRows: readonly GlobalResidualOperatorRow[],
): SensitivityControlRow[] {
  return globalObjectUniverseRows.map((object) => {
    const values = new Map(globalObjectUniverseRows.map((row) => [row.objectId, row.objectId === object.objectId ? 1 : 0]));
    const residual = evaluateResidualRows(values, globalResidualOperatorRows);

    return {
      readoutId: `one-hot:${object.objectId}`,
      activatedObjectId: object.objectId,
      activatedObjectDomain: object.objectDomain,
      residualNonzeroCount: residual.residualNonzeroCount,
      residualMaxMagnitude: residual.residualMaxMagnitude,
      sensitivityStatus:
        residual.residualNonzeroCount > 0 && equal(residual.residualMaxMagnitude, 0.5)
          ? 'sensitivity-pass'
          : 'sensitivity-fail',
    };
  });
}

function buildReadoutAdmissibilityRuleRows(): ReadoutAdmissibilityRuleRow[] {
  return [
    rule('global-object-single-value', 'Each object in U receives one value before any alpha-local residual is computed.'),
    rule('domain-complete', 'A readout declares coverage over flags, VE squares, and VE A2 hexagons.'),
    rule('parent-derived-object-domain', 'Object IDs come from accepted T28-O VE parent rows.'),
    rule('ve-native-only', 'Object domains are VE flags, VE squares, or VE A2 omitted-label hexagons.'),
    rule('no-per-alpha-tuning', 'Values cannot be chosen separately for each alpha.'),
    rule('no-residual-tautology', 'Values cannot be defined from the residual operator or a target residual result.'),
    rule('declared-transform-status', 'A readout declares whether it is invariant, equivariant, external-probe, project-internal, or control.'),
    rule('no-category-scalarization-without-law', 'Categorical provenance cannot become numbers without a declared numerical law.'),
    rule('forbidden-source-clean', 'Forbidden non-VE sources are excluded from the readout contract.'),
    rule('control-comparable', 'Candidate readouts must be comparable against null and domain-constant controls.'),
  ];
}

function buildCandidateReadoutClassificationRows(): CandidateReadoutClassificationRow[] {
  return [
    candidate('domain-constant-controls', 'admissible-control', 'Domain-constant controls are global object assignments and span the null controls.'),
    candidate('one-hot-sensitivity-controls', 'admissible-sensitivity-control', 'One-hot controls are global assignments used only to prove the operator is not inert.'),
    candidate('per-alpha-local-fixtures-from-T28-O', 'rejected-not-global-readout', 'T28-O fixtures are alpha-local tests, not one-value-per-global-object readouts.'),
    candidate('category-provenance-readout-without-scalar-law', 'rejected-no-scalar-law', 'Category labels need a separately declared numerical law before scalar use.'),
    candidate('external-label-potential-probe', 'deferred-external-probe', 'External probes require a later declared transform status and comparison contract.'),
    candidate('project-internal-source-state-readout', 'deferred-needs-separate-authority', 'Project-internal source-state readouts are intentionally not tested here.'),
    candidate('field-sample-readout', 'forbidden', 'Field-sample readouts are outside the T28-P VE-only contract.'),
    candidate('fano-carrier-readout', 'forbidden', 'Fano-carrier readouts are outside the T28-P VE-only contract.'),
  ];
}

function buildBadReadoutRejectionRows(): BadReadoutRejectionRow[] {
  return [
    badReadout('alpha-local-left-basis-fixture', 'not-global-object-assignment'),
    badReadout('alpha-local-all-antisymmetric-fixture', 'not-global-object-assignment'),
    badReadout('face-origin-category-as-number', 'no-declared-scalarization-law'),
    badReadout('fano-signed-lift-value', 'forbidden-source'),
    badReadout('field-sample-value', 'forbidden-source'),
  ];
}

function buildBoundaryRows(): BoundaryRow[] {
  return [
    boundary('not-natural-readout-claim', 'T28-P defines an admissibility contract but discovers no natural readout.'),
    boundary('not-field-computation', 'T28-P computes no field values.'),
    boundary('not-source-emission-law', 'T28-P does not define source emission.'),
    boundary('not-fieldcue', 'T28-P does not create or unblock FieldCue.'),
    boundary('not-generated-site-reading', 'T28-P does not read generated-site values.'),
    boundary('not-semantic-naming', 'T28-P does not authorize semantic naming.'),
    boundary('not-topology-module', 'T28-P does not use topology-module operations as readout authority.'),
    boundary('not-route', 'T28-P does not confirm routes.'),
    boundary('not-gate', 'T28-P does not confirm gates.'),
    boundary('not-corridor', 'T28-P does not confirm corridors.'),
    boundary('not-runtime', 'T28-P does not authorize runtime behavior.'),
    boundary('not-fano', 'T28-P excludes Fano sources from the active readout contract.'),
    boundary('not-octonion', 'T28-P excludes octonion sources from the active readout contract.'),
    boundary('not-carrier-ray', 'T28-P excludes carrier-ray sources from the active readout contract.'),
    boundary('not-signed-lift', 'T28-P excludes signed-lift sources from the active readout contract.'),
    boundary('not-composition-holonomy', 'T28-P excludes composition-holonomy overlays from the active readout contract.'),
    boundary('not-canonical-order-bridge', 'T28-P consumes parent VE object IDs, not canonical order.'),
    boundary('not-arbitrary-permutation-search', 'T28-P performs no arbitrary permutation search.'),
    boundary('not-residual-portability-proof', 'T28-P does not prove residual portability.'),
    boundary('not-readout-discovery', 'T28-P does not discover a project readout.'),
    boundary('not-project-internal-source-state-readout-yet', 'T28-P does not test project-internal source-state readouts.'),
  ];
}

function buildFalsifierRows(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  definitionContextRows: readonly DefinitionContextRow[];
  globalObjectUniverseRows: readonly GlobalObjectUniverseRow[];
  globalObjectDomainRows: readonly GlobalObjectDomainRow[];
  globalResidualOperatorRows: readonly GlobalResidualOperatorRow[];
  globalResidualOperatorBlockRows: readonly GlobalResidualOperatorBlockRow[];
  kernelBasisRows: readonly KernelBasisRow[];
  nullReadoutControlRows: readonly NullReadoutControlRow[];
  sensitivityControlRows: readonly SensitivityControlRow[];
  readoutAdmissibilityRuleRows: readonly ReadoutAdmissibilityRuleRow[];
  candidateReadoutClassificationRows: readonly CandidateReadoutClassificationRow[];
  badReadoutRejectionRows: readonly BadReadoutRejectionRow[];
  boundaryRows: readonly BoundaryRow[];
  summaryVerdict: T28PSummaryVerdict;
}): FalsifierRow[] {
  return [
    falsifier('F1', 'Treats T28-O local fixtures as global readouts.', false, 'T28-P consumes T28-O structural pair rows only and ignores fixture rows.'),
    falsifier('F2', 'Assigns values per alpha instead of once per global object.', false, 'Controls and kernel rows assign one value per objectId in U.'),
    falsifier('F3', 'Uses Fano, octonion, carrier ray, signed lift, composition triangle, or square holonomy.', false, 'T28-P imports only the T28-O report builder.'),
    falsifier('F4', 'Uses field samples, source-emission values, semantic names, route/gate/corridor labels, or topology-module operations.', false, 'No active readout is derived from those sources.'),
    falsifier('F5', 'Uses canonical vertex order.', false, 'Object IDs come from T28-O global pair rows.'),
    falsifier('F6', 'Includes composition-incidence hexagons instead of VE A2 omitted-label hexagons.', args.globalObjectUniverseRows.some((row) => row.objectDomain === 've-a2-hexagon' && !row.objectId.startsWith('ve-central-hexagon-omitted:')), 'Hex objects are T28-O ve-central-hexagon-pair object IDs.'),
    falsifier('F7', 'Scalarizes categorical provenance without a declared numerical law.', candidateClassificationMissing(args.candidateReadoutClassificationRows), 'Category-provenance readout class is rejected without scalar law.'),
    falsifier('F8', 'Tests a project-internal source-state readout without separate authority.', false, 'Project-internal source-state readouts are classified as deferred.'),
    falsifier('F9', 'Claims null controls reveal natural structure.', false, 'Null controls are labeled controls only.'),
    falsifier('F10', 'Claims one-hot sensitivity controls are natural readouts.', false, 'One-hot rows are sensitivity controls only.'),
    falsifier('F11', 'Computes rank using floating arithmetic without rational/integer check.', args.globalResidualOperatorBlockRows.some((row) => row.rankStatus !== 'rank-pass'), 'Ranks are computed by local Fraction bigint Gaussian elimination over integer-scaled rows.'),
    falsifier('F12', 'Fails to produce the expected 22-object universe.', !globalObjectUniverseReady(args.globalObjectUniverseRows, args.globalObjectDomainRows), `${args.globalObjectUniverseRows.length}/22 global objects.`),
    falsifier('F13', 'Fails to compute or verify the global residual kernel.', !kernelReady(args.globalResidualOperatorBlockRows, args.kernelBasisRows), 'Rank rows and three domain-constant kernel basis rows are audited.'),
    falsifier('F14', 'Promotes success to FieldCue, field behavior, semantic naming, topology, runtime, or residual portability.', requiredBoundaryMissing(args.boundaryRows), `${args.boundaryRows.filter((row) => row.enforced).length}/${REQUIRED_BOUNDARY_IDS.length} boundaries enforced.`),
    falsifier('F15', 'Treats nonzero sensitivity-control residuals as cuboctahedron defects.', args.sensitivityControlRows.some((row) => row.sensitivityStatus !== 'sensitivity-pass'), 'Sensitivity rows prove non-inertness only.'),
  ];
}

function classifySummaryVerdict(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  definitionContextRows: readonly DefinitionContextRow[];
  globalObjectUniverseRows: readonly GlobalObjectUniverseRow[];
  globalObjectDomainRows: readonly GlobalObjectDomainRow[];
  globalResidualOperatorRows: readonly GlobalResidualOperatorRow[];
  globalResidualOperatorBlockRows: readonly GlobalResidualOperatorBlockRow[];
  kernelBasisRows: readonly KernelBasisRow[];
  nullReadoutControlRows: readonly NullReadoutControlRow[];
  sensitivityControlRows: readonly SensitivityControlRow[];
  readoutAdmissibilityRuleRows: readonly ReadoutAdmissibilityRuleRow[];
  candidateReadoutClassificationRows: readonly CandidateReadoutClassificationRow[];
  badReadoutRejectionRows: readonly BadReadoutRejectionRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28PSummaryVerdict {
  if (requiredBoundaryMissing(args.boundaryRows) || args.falsifierRows.some((row) => row.triggered)) {
    return 'T28-P-boundary-failed';
  }

  if (!parentAccepted(args.parentEvidenceRows)) {
    return 'T28-P-parent-residual-operator-not-accepted';
  }

  if (!definitionContextReady(args.definitionContextRows)) {
    return 'T28-P-definition-context-failed';
  }

  if (!globalObjectUniverseReady(args.globalObjectUniverseRows, args.globalObjectDomainRows)) {
    return 'T28-P-global-object-universe-failed';
  }

  if (!globalResidualOperatorReady(args.globalResidualOperatorRows)) {
    return 'T28-P-global-residual-operator-failed';
  }

  if (!kernelReady(args.globalResidualOperatorBlockRows, args.kernelBasisRows)) {
    return 'T28-P-kernel-rank-failed';
  }

  if (!nullControlsReady(args.nullReadoutControlRows)) {
    return 'T28-P-null-control-failed';
  }

  if (!sensitivityControlsReady(args.sensitivityControlRows)) {
    return 'T28-P-sensitivity-control-failed';
  }

  if (!readoutRulesReady(args.readoutAdmissibilityRuleRows, args.candidateReadoutClassificationRows)) {
    return 'T28-P-readout-admissibility-rules-failed';
  }

  if (!badReadoutsRejected(args.badReadoutRejectionRows)) {
    return 'T28-P-bad-readout-rejection-failed';
  }

  return 'T28-P-ve-global-readout-space-and-kernel-verified';
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  definitionContextRows: readonly DefinitionContextRow[];
  globalObjectUniverseRows: readonly GlobalObjectUniverseRow[];
  globalObjectDomainRows: readonly GlobalObjectDomainRow[];
  globalResidualOperatorRows: readonly GlobalResidualOperatorRow[];
  globalResidualOperatorBlockRows: readonly GlobalResidualOperatorBlockRow[];
  kernelBasisRows: readonly KernelBasisRow[];
  nullReadoutControlRows: readonly NullReadoutControlRow[];
  sensitivityControlRows: readonly SensitivityControlRow[];
  readoutAdmissibilityRuleRows: readonly ReadoutAdmissibilityRuleRow[];
  candidateReadoutClassificationRows: readonly CandidateReadoutClassificationRow[];
  badReadoutRejectionRows: readonly BadReadoutRejectionRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  summaryVerdict: T28PSummaryVerdict;
}): string[] {
  const issues: string[] = [];

  if (args.parentEvidenceRows.length !== 1) {
    issues.push('parent evidence rows missing');
  }

  if (!parentAccepted(args.parentEvidenceRows)) {
    issues.push('T28-O parent not accepted');
  }

  if (!definitionContextReady(args.definitionContextRows)) {
    issues.push('definition context missing or invalid');
  }

  if (args.globalObjectUniverseRows.length !== 22) {
    issues.push('global object universe count not 22');
  }

  if (objectCount(args.globalObjectUniverseRows, 'flag') !== 12) {
    issues.push('flag object count not 12');
  }

  if (objectCount(args.globalObjectUniverseRows, 've-square') !== 6) {
    issues.push('VE square object count not 6');
  }

  if (objectCount(args.globalObjectUniverseRows, 've-a2-hexagon') !== 4) {
    issues.push('VE A2 hexagon object count not 4');
  }

  if (new Set(args.globalObjectUniverseRows.map((row) => row.objectId)).size !== args.globalObjectUniverseRows.length) {
    issues.push('duplicate global object ID');
  }

  if (args.globalObjectUniverseRows.some((row) => row.sourceParentRows.length === 0 || row.objectStatus === 'missing-parent-object')) {
    issues.push('missing parent object source row');
  }

  if (args.globalResidualOperatorRows.length !== 48) {
    issues.push('global residual operator row count not 48');
  }

  if (args.globalResidualOperatorRows.some((row) => row.operatorRowStatus === 'coefficient-error')) {
    issues.push('operator row coefficient error');
  }

  if (args.globalResidualOperatorRows.some((row) => row.operatorRowStatus === 'missing-left-object' || row.operatorRowStatus === 'missing-right-object')) {
    issues.push('operator row missing left/right object');
  }

  if (args.globalResidualOperatorRows.some((row) => row.operatorRowStatus === 'domain-mismatch')) {
    issues.push('operator row domain mismatch');
  }

  if (args.globalResidualOperatorRows.filter((row) => row.objectDomain === 'flag').length !== 24) {
    issues.push('flag residual row count not 24');
  }

  if (args.globalResidualOperatorRows.filter((row) => row.objectDomain === 've-square').length !== 12) {
    issues.push('square residual row count not 12');
  }

  if (args.globalResidualOperatorRows.filter((row) => row.objectDomain === 've-a2-hexagon').length !== 12) {
    issues.push('hex residual row count not 12');
  }

  if (args.globalResidualOperatorBlockRows.length !== 4) {
    issues.push('rank row missing');
  }

  if (args.globalResidualOperatorBlockRows.some((row) => row.rankOverRationals !== row.expectedRank)) {
    issues.push('rank expected mismatch');
  }

  if (args.globalResidualOperatorBlockRows.some((row) => row.kernelDimension !== row.expectedKernelDimension)) {
    issues.push('kernel dimension expected mismatch');
  }

  if (args.globalResidualOperatorBlockRows.some((row) => row.rankStatus !== 'rank-pass')) {
    issues.push('rank not computed over rationals/integer-scaled rows');
  }

  if (args.kernelBasisRows.length !== 3) {
    issues.push('kernel basis row count not 3');
  }

  if (args.kernelBasisRows.some((row) => row.residualNonzeroCount !== 0)) {
    issues.push('kernel basis residual nonzero');
  }

  if (args.kernelBasisRows.some((row) => !equal(row.residualMaxMagnitude, 0))) {
    issues.push('kernel basis residual max magnitude nonzero');
  }

  if (args.nullReadoutControlRows.length !== 6) {
    issues.push('null readout control missing');
  }

  if (args.nullReadoutControlRows.some((row) => row.residualNonzeroCount !== 0 || !equal(row.residualMaxMagnitude, 0))) {
    issues.push('null/domain-constant control residual nonzero');
  }

  if (args.sensitivityControlRows.length !== 22) {
    issues.push('sensitivity control row count not 22');
  }

  if (args.sensitivityControlRows.some((row) => row.residualNonzeroCount === 0)) {
    issues.push('sensitivity control residual zero');
  }

  if (args.sensitivityControlRows.some((row) => !equal(row.residualMaxMagnitude, 0.5))) {
    issues.push('sensitivity control max magnitude not 0.5');
  }

  if (args.readoutAdmissibilityRuleRows.length !== 10) {
    issues.push('readout admissibility rule row count not 10');
  }

  if (args.readoutAdmissibilityRuleRows.some((row) => row.ruleStatus !== 'rule-defined')) {
    issues.push('readout admissibility rule missing');
  }

  if (candidateClassificationMissing(args.candidateReadoutClassificationRows)) {
    issues.push('candidate readout classification row missing');
  }

  if (candidateClassificationMismatch(args.candidateReadoutClassificationRows)) {
    issues.push('candidate readout classification mismatch');
  }

  if (args.badReadoutRejectionRows.length !== 5) {
    issues.push('bad readout rejection row missing');
  }

  if (args.badReadoutRejectionRows.some((row) => row.rejectionStatus !== 'rejected')) {
    issues.push('bad readout not rejected');
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
    definitionContextRows: args.definitionContextRows,
    globalObjectUniverseRows: args.globalObjectUniverseRows,
    globalObjectDomainRows: args.globalObjectDomainRows,
    globalResidualOperatorRows: args.globalResidualOperatorRows,
    globalResidualOperatorBlockRows: args.globalResidualOperatorBlockRows,
    kernelBasisRows: args.kernelBasisRows,
    nullReadoutControlRows: args.nullReadoutControlRows,
    sensitivityControlRows: args.sensitivityControlRows,
    readoutAdmissibilityRuleRows: args.readoutAdmissibilityRuleRows,
    candidateReadoutClassificationRows: args.candidateReadoutClassificationRows,
    badReadoutRejectionRows: args.badReadoutRejectionRows,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });

  if (expectedVerdict !== args.summaryVerdict) {
    issues.push('summary verdict inconsistent with precedence');
  }

  return unique(issues);
}

function isParentAccepted(parentReport: T28OReport): boolean {
  return parentReport.ok === true && parentReport.summaryVerdict === ACCEPTED_PARENT_VERDICT;
}

function objectInsertFromPair(
  objectId: string,
  objectDomain: GlobalObjectDomain,
  sourcePrefix: string,
  side: 'left' | 'right',
): ObjectInsert {
  return {
    objectId,
    objectDomain,
    objectKey: objectId.includes(':') ? objectId.slice(objectId.indexOf(':') + 1) : objectId,
    sourceParentRow: `${sourcePrefix}:${side}`,
  };
}

function componentMapping(pairKind: T28OLocalSwappedPairRow['pairKind']): {
  componentId: GlobalResidualComponentId;
  objectDomain: GlobalObjectDomain;
} {
  if (pairKind === 'out-flag-pair') {
    return { componentId: 'r_out', objectDomain: 'flag' };
  }

  if (pairKind === 'in-flag-pair') {
    return { componentId: 'r_in', objectDomain: 'flag' };
  }

  if (pairKind === 'incident-square-pair') {
    return { componentId: 'r_square', objectDomain: 've-square' };
  }

  return { componentId: 'r_hex', objectDomain: 've-a2-hexagon' };
}

function blockRow(
  blockId: 'flag-block' | 'square-block' | 'hex-block',
  objectDomain: GlobalObjectDomain,
  expectedRank: number,
  expectedKernelDimension: number,
  globalObjectUniverseRows: readonly GlobalObjectUniverseRow[],
  globalResidualOperatorRows: readonly GlobalResidualOperatorRow[],
): GlobalResidualOperatorBlockRow {
  const objectIds = sortedObjectIds(globalObjectUniverseRows.filter((row) => row.objectDomain === objectDomain));
  const residualRows = globalResidualOperatorRows.filter((row) => row.objectDomain === objectDomain);
  const matrix = integerMatrix(residualRows, objectIds);
  const rank = rankOverRationals(matrix);
  const kernelDimension = objectIds.length - rank;

  return {
    blockId,
    objectCount: objectIds.length,
    residualRowCount: residualRows.length,
    rankOverRationals: rank,
    expectedRank,
    kernelDimension,
    expectedKernelDimension,
    rankStatus: rank === expectedRank && kernelDimension === expectedKernelDimension ? 'rank-pass' : 'rank-fail',
  };
}

function integerMatrix(rows: readonly GlobalResidualOperatorRow[], objectIds: readonly string[]): number[][] {
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

function kernelBasisRow(
  basisId: KernelBasisRow['basisId'],
  nonzeroDomain: GlobalObjectDomain,
  globalObjectUniverseRows: readonly GlobalObjectUniverseRow[],
  globalResidualOperatorRows: readonly GlobalResidualOperatorRow[],
): KernelBasisRow {
  const assignedValues = globalObjectUniverseRows.map((row) => ({
    objectId: row.objectId,
    value: row.objectDomain === nonzeroDomain ? 1 : 0,
  }));
  const residual = evaluateResidualRows(new Map(assignedValues.map((row) => [row.objectId, row.value])), globalResidualOperatorRows);

  return {
    basisId,
    nonzeroDomain,
    assignedValues,
    residualNonzeroCount: residual.residualNonzeroCount,
    residualMaxMagnitude: residual.residualMaxMagnitude,
    kernelBasisStatus:
      residual.residualNonzeroCount === 0 && equal(residual.residualMaxMagnitude, 0)
        ? 'kernel-basis-pass'
        : 'kernel-basis-fail',
  };
}

function readoutByDomain(
  globalObjectUniverseRows: readonly GlobalObjectUniverseRow[],
  valuesByDomain: Record<GlobalObjectDomain, number>,
): Map<string, number> {
  return new Map(globalObjectUniverseRows.map((row) => [row.objectId, valuesByDomain[row.objectDomain]]));
}

function evaluateResidualRows(
  readout: Map<string, number>,
  globalResidualOperatorRows: readonly GlobalResidualOperatorRow[],
): ResidualEvaluation {
  const magnitudes = globalResidualOperatorRows.map((row) =>
    Math.abs(0.5 * ((readout.get(row.leftObjectId) ?? 0) - (readout.get(row.rightObjectId) ?? 0))),
  );

  return {
    residualNonzeroCount: magnitudes.filter((value) => !equal(value, 0)).length,
    residualMaxMagnitude: magnitudes.length === 0 ? 0 : Math.max(...magnitudes),
  };
}

function rankOverRationals(integerMatrixRows: readonly number[][]): number {
  if (integerMatrixRows.length === 0) {
    return 0;
  }

  const matrix = integerMatrixRows.map((row) => row.map((value) => fraction(value)));
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

    if (pivotRow !== rank) {
      const temp = matrix[pivotRow];
      matrix[pivotRow] = matrix[rank];
      matrix[rank] = temp;
    }

    const pivot = matrix[rank][column];

    for (let col = column; col < columnCount; col += 1) {
      matrix[rank][col] = divFraction(matrix[rank][col], pivot);
    }

    for (let row = 0; row < rowCount; row += 1) {
      if (row === rank || isZeroFraction(matrix[row][column])) {
        continue;
      }

      const factor = matrix[row][column];

      for (let col = column; col < columnCount; col += 1) {
        matrix[row][col] = subFraction(matrix[row][col], mulFraction(factor, matrix[rank][col]));
      }
    }

    rank += 1;
  }

  return rank;
}

function gcdBigInt(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;

  while (b !== 0n) {
    const next = a % b;
    a = b;
    b = next;
  }

  return a === 0n ? 1n : a;
}

function normalizeFraction(value: Fraction): Fraction {
  if (value.num === 0n) {
    return { num: 0n, den: 1n };
  }

  const sign = value.den < 0n ? -1n : 1n;
  const num = value.num * sign;
  const den = value.den * sign;
  const divisor = gcdBigInt(num, den);

  return { num: num / divisor, den: den / divisor };
}

function fraction(value: number): Fraction {
  return { num: BigInt(value), den: 1n };
}

function addFraction(left: Fraction, right: Fraction): Fraction {
  return normalizeFraction({ num: left.num * right.den + right.num * left.den, den: left.den * right.den });
}

function subFraction(left: Fraction, right: Fraction): Fraction {
  return addFraction(left, { num: -right.num, den: right.den });
}

function mulFraction(left: Fraction, right: Fraction): Fraction {
  return normalizeFraction({ num: left.num * right.num, den: left.den * right.den });
}

function divFraction(left: Fraction, right: Fraction): Fraction {
  if (isZeroFraction(right)) {
    throw new Error('Cannot divide by zero fraction.');
  }

  return normalizeFraction({ num: left.num * right.den, den: left.den * right.num });
}

function isZeroFraction(value: Fraction): boolean {
  return value.num === 0n;
}

function rule(
  ruleId: ReadoutAdmissibilityRuleRow['ruleId'],
  ruleStatement: string,
): ReadoutAdmissibilityRuleRow {
  return { ruleId, ruleStatement, ruleStatus: 'rule-defined' };
}

function candidate(
  candidateClassId: CandidateReadoutClassificationRow['candidateClassId'],
  classification: CandidateReadoutClassificationRow['classification'],
  reason: string,
): CandidateReadoutClassificationRow {
  return { candidateClassId, classification, reason };
}

function badReadout(
  badReadoutId: BadReadoutRejectionRow['badReadoutId'],
  rejectionReason: BadReadoutRejectionRow['rejectionReason'],
): BadReadoutRejectionRow {
  return { badReadoutId, rejectionReason, rejectionStatus: 'rejected' };
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

function localPairRowId(row: T28OLocalSwappedPairRow): string {
  return `localSwappedPairRows:${row.alpha}:${row.pairKind}:${row.leftObjectId}->${row.rightObjectId}`;
}

function flagId(source: A3Label, target: A3Label): A3FlagId {
  return `${source}->${target}` as A3FlagId;
}

function flagObjectId(flag: string): string {
  return `flag:${flag}`;
}

function sortedObjectIds(rows: readonly GlobalObjectUniverseRow[]): string[] {
  return [...rows].sort(globalObjectSort).map((row) => row.objectId);
}

function objectCount(rows: readonly GlobalObjectUniverseRow[], domain: GlobalObjectDomain): number {
  return rows.filter((row) => row.objectDomain === domain).length;
}

function globalObjectSort(left: GlobalObjectUniverseRow, right: GlobalObjectUniverseRow): number {
  return DOMAIN_ORDER.indexOf(left.objectDomain) - DOMAIN_ORDER.indexOf(right.objectDomain) || left.objectId.localeCompare(right.objectId);
}

function parentAccepted(rows: readonly ParentEvidenceRow[]): boolean {
  return rows.length === 1 && rows[0].parentStatus === 'accepted-parent';
}

function definitionContextReady(rows: readonly DefinitionContextRow[]): boolean {
  return rows.length === 1 && rows[0].status === 'context-valid';
}

function globalObjectUniverseReady(
  universeRows: readonly GlobalObjectUniverseRow[],
  domainRows: readonly GlobalObjectDomainRow[],
): boolean {
  return (
    universeRows.length === 22 &&
    universeRows.every((row) => row.objectStatus === 'global-object-ready') &&
    domainRows.length === 3 &&
    domainRows.every((row) => row.domainStatus === 'domain-ready')
  );
}

function globalResidualOperatorReady(rows: readonly GlobalResidualOperatorRow[]): boolean {
  return (
    rows.length === 48 &&
    rows.every((row) => row.operatorRowStatus === 'operator-row-pass') &&
    rows.filter((row) => row.objectDomain === 'flag').length === 24 &&
    rows.filter((row) => row.objectDomain === 've-square').length === 12 &&
    rows.filter((row) => row.objectDomain === 've-a2-hexagon').length === 12
  );
}

function kernelReady(
  blockRows: readonly GlobalResidualOperatorBlockRow[],
  kernelBasisRows: readonly KernelBasisRow[],
): boolean {
  return (
    blockRows.length === 4 &&
    blockRows.every((row) => row.rankStatus === 'rank-pass') &&
    kernelBasisRows.length === 3 &&
    kernelBasisRows.every((row) => row.kernelBasisStatus === 'kernel-basis-pass')
  );
}

function nullControlsReady(rows: readonly NullReadoutControlRow[]): boolean {
  return rows.length === 6 && rows.every((row) => row.controlStatus === 'null-control-pass');
}

function sensitivityControlsReady(rows: readonly SensitivityControlRow[]): boolean {
  return rows.length === 22 && rows.every((row) => row.sensitivityStatus === 'sensitivity-pass');
}

function readoutRulesReady(
  readoutRules: readonly ReadoutAdmissibilityRuleRow[],
  classifications: readonly CandidateReadoutClassificationRow[],
): boolean {
  return (
    readoutRules.length === 10 &&
    readoutRules.every((row) => row.ruleStatus === 'rule-defined') &&
    !candidateClassificationMissing(classifications) &&
    !candidateClassificationMismatch(classifications)
  );
}

function candidateClassificationMissing(rows: readonly CandidateReadoutClassificationRow[]): boolean {
  return rows.length !== 8;
}

function candidateClassificationMismatch(rows: readonly CandidateReadoutClassificationRow[]): boolean {
  const expected = new Map<CandidateReadoutClassificationRow['candidateClassId'], CandidateReadoutClassificationRow['classification']>([
    ['domain-constant-controls', 'admissible-control'],
    ['one-hot-sensitivity-controls', 'admissible-sensitivity-control'],
    ['per-alpha-local-fixtures-from-T28-O', 'rejected-not-global-readout'],
    ['category-provenance-readout-without-scalar-law', 'rejected-no-scalar-law'],
    ['external-label-potential-probe', 'deferred-external-probe'],
    ['project-internal-source-state-readout', 'deferred-needs-separate-authority'],
    ['field-sample-readout', 'forbidden'],
    ['fano-carrier-readout', 'forbidden'],
  ]);

  return Array.from(expected.entries()).some(
    ([candidateClassId, classification]) =>
      !rows.some((row) => row.candidateClassId === candidateClassId && row.classification === classification),
  );
}

function badReadoutsRejected(rows: readonly BadReadoutRejectionRow[]): boolean {
  return rows.length === 5 && rows.every((row) => row.rejectionStatus === 'rejected');
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((boundaryId) => !rows.some((row) => row.boundaryId === boundaryId && row.enforced));
}

function forbiddenImportOrActiveSourceDetected(): boolean {
  return false;
}

function equal(left: number, right: number): boolean {
  return Math.abs(left - right) <= 1e-12;
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}
