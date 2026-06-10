export type FanoPrimalSourceId = 'A' | 'B' | 'C' | 'D';
export type FanoUnitId = 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7';
export type FanoSign = '+' | '-';
export type FanoPairTokenId =
  | 'M_AB'
  | 'M_AC'
  | 'M_AD'
  | 'M_BC'
  | 'M_BD'
  | 'M_CD';

export type FanoCarrierRay = `ray:${FanoUnitId}`;
export type FanoSignedLift = `${FanoSign}${FanoUnitId}`;
export type FanoOrderedLiftId = `${FanoPrimalSourceId}·${FanoPrimalSourceId}`;
export type FanoSourcePair = readonly [
  FanoPrimalSourceId,
  FanoPrimalSourceId,
];

export interface FanoPrimalCarrierRow {
  sourceId: FanoPrimalSourceId;
  carrierUnit: FanoUnitId;
  sourceRole: 'primal-source';
  profileStatus: 'carrier-only-emission-profile-not-attached-in-c0';
}

export interface FanoPairSourceTokenRow {
  tokenId: FanoPairTokenId;
  unorderedParentSet: FanoSourcePair;
  tokenRole: 'born-source-token';
  pairIdentityPreserved: true;
}

export interface FanoSpinorBridgeData {
  spinorBridgeStatus: 'signed-lift-data-ready-not-spinor-representation';
  carrierRay: FanoCarrierRay;
  signedLift: FanoSignedLift;
  orientationSign: FanoSign;
  orderedLift: FanoOrderedLiftId;
  sourceTokenId: FanoPairTokenId;
}

export interface FanoOrderedCarrierLiftRow {
  liftId: FanoOrderedLiftId;
  tokenId: FanoPairTokenId;
  orderedParents: FanoSourcePair;
  unorderedParentSet: FanoSourcePair;
  productUnit: FanoUnitId;
  sign: FanoSign;
  carrierRay: FanoCarrierRay;
  signedLift: FanoSignedLift;
  spinorBridgeData: FanoSpinorBridgeData;
}

export interface FanoAntipodalLiftCandidateRow {
  candidateId: string;
  positiveLiftId: FanoOrderedLiftId;
  negativeLiftId: FanoOrderedLiftId;
  positiveTokenId: FanoPairTokenId;
  negativeTokenId: FanoPairTokenId;
  positiveSignedLift: FanoSignedLift;
  negativeSignedLift: FanoSignedLift;
  carrierRay: FanoCarrierRay;
  tokenPairKey: string;
  orientedLiftPair: string;
  familiarTokenPair: string;
  distinctSourceTokens: true;
  disjointParentSets: true;
  sameCarrierRay: true;
  oppositeSign: true;
  derivationStatus: 'derived-from-ordered-lift-table';
}

export interface FanoAntipodalQuotientGroupRow {
  groupId: string;
  tokenPairKey: string;
  carrierRay: FanoCarrierRay;
  candidateCount: number;
  candidateLiftPairs: string[];
  canonicalLiftPair: string;
  canonicalTokenPair: string;
  canonicalSelectionRule: 'lexicographic-token-first-positive-lift-after-derived-candidates';
  quotientDerivationStatus: 'grouped-from-derived-antipodal-lift-candidates';
}

export interface FanoAntipodalQuotientRow {
  antipodalPairId: string;
  positiveLiftId: FanoOrderedLiftId;
  negativeLiftId: FanoOrderedLiftId;
  positiveTokenId: FanoPairTokenId;
  negativeTokenId: FanoPairTokenId;
  positiveSignedLift: FanoSignedLift;
  negativeSignedLift: FanoSignedLift;
  carrierRay: FanoCarrierRay;
  distinctSourceTokens: true;
  disjointParentSets: true;
  sameCarrierRay: true;
  oppositeSign: true;
  quotientRelation: 'distinct-token-same-ray-opposite-signed-lift';
  conjugacyStatus: 'octonionic-conjugate-orientation';
  spinorReadinessStatus: 'antipodal-signed-lift-data-ready-for-later-spinor-formalization';
}

export interface FanoOctonionicCarrierTableV0Summary {
  primalCarrierCount: number;
  pairTokenCount: number;
  orderedLiftCount: number;
  carrierRayCount: number;
  antipodalLiftCandidateCount: number;
  antipodalQuotientGroupCount: number;
  antipodalQuotientCount: number;
  candidateLiftPairs: string[];
  familiarTokenPairs: string[];
  orientedLiftPairs: string[];
  spinorBridgeStatus: 'signed-lift-data-ready-not-spinor-representation';
  complementDerivationStatus: 'derived-from-lift-table';
  hardCodedComplementMapStatus: 'not-used-as-source-of-truth';
  candidateDerivationStatus: 'all-antipodal-lift-candidates-derived-from-ordered-lift-table';
  quotientGroupingStatus: 'grouped-from-derived-antipodal-lift-candidates';
  representativeSelectionStatus: 'selected-from-derived-candidate-groups';
  representativeSelectionRule: 'lexicographic-token-first-positive-lift-after-derived-candidates';
  rootAFilterStatus: 'not-used';
  emissionStatus: 'not-attached-in-c0';
  uiStatus: 'no-ui';
  recommendedNextGate: 'C1 - Fano-Octonionic Local Channel Table Prototype';
}

export interface FanoOctonionicCarrierTableV0Issue {
  code: string;
  message: string;
}

export interface FanoOctonionicCarrierTableV0Report {
  method: 'fano-octonionic-carrier-table-v0';
  canonicalQuadrangleStatus: 'canonical-primal-carriers-ready';
  primalCarrierRows: FanoPrimalCarrierRow[];
  pairTokenRows: FanoPairSourceTokenRow[];
  orderedLiftRows: FanoOrderedCarrierLiftRow[];
  antipodalLiftCandidateRows: FanoAntipodalLiftCandidateRow[];
  antipodalQuotientGroupRows: FanoAntipodalQuotientGroupRow[];
  antipodalQuotientRows: FanoAntipodalQuotientRow[];
  summary: FanoOctonionicCarrierTableV0Summary;
  issues: FanoOctonionicCarrierTableV0Issue[];
  ok: boolean;
}

type FanoUnitNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const PRIMAL_SOURCE_ORDER: readonly FanoPrimalSourceId[] = [
  'A',
  'B',
  'C',
  'D',
];

const CANONICAL_PRIMAL_CARRIERS: Record<FanoPrimalSourceId, FanoUnitId> = {
  A: 'e1',
  B: 'e2',
  C: 'e4',
  D: 'e7',
};

const ORIENTED_FANO_TRIPLES: readonly [
  FanoUnitNumber,
  FanoUnitNumber,
  FanoUnitNumber,
][] = [
  [1, 2, 3],
  [1, 4, 5],
  [1, 7, 6],
  [2, 4, 6],
  [2, 5, 7],
  [3, 4, 7],
  [3, 6, 5],
];

const EXPECTED_CANDIDATE_LIFT_PAIRS = [
  'A·B/D·C',
  'C·D/B·A',
  'A·C/B·D',
  'D·B/C·A',
  'A·D/C·B',
  'B·C/D·A',
];
const EXPECTED_ORIENTED_LIFT_PAIRS = [
  'A·B/D·C',
  'A·C/B·D',
  'A·D/C·B',
];
const REPRESENTATIVE_SELECTION_RULE =
  'lexicographic-token-first-positive-lift-after-derived-candidates';

export function buildFanoOctonionicCarrierTableV0Report(): FanoOctonionicCarrierTableV0Report {
  const primalCarrierRows = buildPrimalCarrierRows();
  const pairTokenRows = buildPairTokenRows();
  const orderedLiftRows = buildOrderedLiftRows(pairTokenRows);
  const antipodalLiftCandidateRows =
    buildAntipodalLiftCandidateRows(orderedLiftRows);
  const antipodalQuotientGroupRows = buildAntipodalQuotientGroupRows(
    antipodalLiftCandidateRows,
  );
  const antipodalQuotientRows = buildAntipodalQuotientRows({
    candidateRows: antipodalLiftCandidateRows,
    groupRows: antipodalQuotientGroupRows,
  });
  const summary = buildSummary({
    primalCarrierRows,
    pairTokenRows,
    orderedLiftRows,
    antipodalLiftCandidateRows,
    antipodalQuotientGroupRows,
    antipodalQuotientRows,
  });
  const issues = buildIssues({
    orderedLiftRows,
    antipodalLiftCandidateRows,
    antipodalQuotientGroupRows,
    summary,
  });

  return {
    method: 'fano-octonionic-carrier-table-v0',
    canonicalQuadrangleStatus: 'canonical-primal-carriers-ready',
    primalCarrierRows,
    pairTokenRows,
    orderedLiftRows,
    antipodalLiftCandidateRows,
    antipodalQuotientGroupRows,
    antipodalQuotientRows,
    summary,
    issues,
    ok: issues.length === 0,
  };
}

function buildPrimalCarrierRows(): FanoPrimalCarrierRow[] {
  return PRIMAL_SOURCE_ORDER.map((sourceId) => ({
    sourceId,
    carrierUnit: CANONICAL_PRIMAL_CARRIERS[sourceId],
    sourceRole: 'primal-source',
    profileStatus: 'carrier-only-emission-profile-not-attached-in-c0',
  }));
}

function buildPairTokenRows(): FanoPairSourceTokenRow[] {
  const rows: FanoPairSourceTokenRow[] = [];

  for (let leftIndex = 0; leftIndex < PRIMAL_SOURCE_ORDER.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < PRIMAL_SOURCE_ORDER.length;
      rightIndex += 1
    ) {
      const unorderedParentSet = [
        PRIMAL_SOURCE_ORDER[leftIndex],
        PRIMAL_SOURCE_ORDER[rightIndex],
      ] as const;

      rows.push({
        tokenId: buildPairTokenId(unorderedParentSet),
        unorderedParentSet,
        tokenRole: 'born-source-token',
        pairIdentityPreserved: true,
      });
    }
  }

  return rows;
}

function buildOrderedLiftRows(
  pairTokenRows: FanoPairSourceTokenRow[],
): FanoOrderedCarrierLiftRow[] {
  return pairTokenRows.flatMap((tokenRow) => {
    const [left, right] = tokenRow.unorderedParentSet;

    return [
      buildOrderedLiftRow(tokenRow, [left, right]),
      buildOrderedLiftRow(tokenRow, [right, left]),
    ];
  });
}

function buildOrderedLiftRow(
  tokenRow: FanoPairSourceTokenRow,
  orderedParents: FanoSourcePair,
): FanoOrderedCarrierLiftRow {
  const [left, right] = orderedParents;
  const product = multiplyFanoUnits(
    CANONICAL_PRIMAL_CARRIERS[left],
    CANONICAL_PRIMAL_CARRIERS[right],
  );
  const liftId = `${left}·${right}` as FanoOrderedLiftId;
  const carrierRay = `ray:${product.productUnit}` as FanoCarrierRay;
  const signedLift = `${product.sign}${product.productUnit}` as FanoSignedLift;

  return {
    liftId,
    tokenId: tokenRow.tokenId,
    orderedParents,
    unorderedParentSet: tokenRow.unorderedParentSet,
    productUnit: product.productUnit,
    sign: product.sign,
    carrierRay,
    signedLift,
    spinorBridgeData: {
      spinorBridgeStatus: 'signed-lift-data-ready-not-spinor-representation',
      carrierRay,
      signedLift,
      orientationSign: product.sign,
      orderedLift: liftId,
      sourceTokenId: tokenRow.tokenId,
    },
  };
}

function buildAntipodalLiftCandidateRows(
  orderedLiftRows: FanoOrderedCarrierLiftRow[],
): FanoAntipodalLiftCandidateRow[] {
  const candidateRows: FanoAntipodalLiftCandidateRow[] = [];

  for (const positiveLift of orderedLiftRows) {
    if (positiveLift.sign !== '+') {
      continue;
    }

    for (const negativeLift of orderedLiftRows) {
      if (
        negativeLift.sign !== '-' ||
        positiveLift.tokenId === negativeLift.tokenId ||
        !areDisjointParentSets(
          positiveLift.unorderedParentSet,
          negativeLift.unorderedParentSet,
        ) ||
        positiveLift.carrierRay !== negativeLift.carrierRay
      ) {
        continue;
      }

      candidateRows.push(buildAntipodalLiftCandidateRow(positiveLift, negativeLift));
    }
  }

  return sortCandidateRows(candidateRows);
}

function buildAntipodalLiftCandidateRow(
  positiveLift: FanoOrderedCarrierLiftRow,
  negativeLift: FanoOrderedCarrierLiftRow,
): FanoAntipodalLiftCandidateRow {
  const tokenPairKey = buildTokenPairKey(
    positiveLift.tokenId,
    negativeLift.tokenId,
  );
  const orientedLiftPair = `${positiveLift.liftId}/${negativeLift.liftId}`;

  return {
    candidateId: `candidate:${orientedLiftPair}`,
    positiveLiftId: positiveLift.liftId,
    negativeLiftId: negativeLift.liftId,
    positiveTokenId: positiveLift.tokenId,
    negativeTokenId: negativeLift.tokenId,
    positiveSignedLift: positiveLift.signedLift,
    negativeSignedLift: negativeLift.signedLift,
    carrierRay: positiveLift.carrierRay,
    tokenPairKey,
    orientedLiftPair,
    familiarTokenPair: tokenPairKey,
    distinctSourceTokens: true,
    disjointParentSets: true,
    sameCarrierRay: true,
    oppositeSign: true,
    derivationStatus: 'derived-from-ordered-lift-table',
  };
}

function buildAntipodalQuotientGroupRows(
  candidateRows: FanoAntipodalLiftCandidateRow[],
): FanoAntipodalQuotientGroupRow[] {
  const candidateRowsByGroupKey = new Map<
    string,
    FanoAntipodalLiftCandidateRow[]
  >();

  for (const candidateRow of candidateRows) {
    const groupKey = buildQuotientGroupKey(candidateRow);
    const rows = candidateRowsByGroupKey.get(groupKey) ?? [];

    rows.push(candidateRow);
    candidateRowsByGroupKey.set(groupKey, rows);
  }

  return [...candidateRowsByGroupKey.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([groupKey, rows]) => {
      const sortedRows = sortCandidateRows(rows);
      const canonicalCandidate = pickCanonicalCandidate(sortedRows);

      return {
        groupId: `group:${groupKey}`,
        tokenPairKey: canonicalCandidate.tokenPairKey,
        carrierRay: canonicalCandidate.carrierRay,
        candidateCount: sortedRows.length,
        candidateLiftPairs: sortedRows.map((row) => row.orientedLiftPair),
        canonicalLiftPair: canonicalCandidate.orientedLiftPair,
        canonicalTokenPair: canonicalCandidate.familiarTokenPair,
        canonicalSelectionRule: REPRESENTATIVE_SELECTION_RULE,
        quotientDerivationStatus:
          'grouped-from-derived-antipodal-lift-candidates',
      };
    });
}

function buildAntipodalQuotientRows(args: {
  candidateRows: FanoAntipodalLiftCandidateRow[];
  groupRows: FanoAntipodalQuotientGroupRow[];
}): FanoAntipodalQuotientRow[] {
  return args.groupRows.map((groupRow) => {
    const canonicalCandidate = args.candidateRows.find(
      (candidateRow) =>
        candidateRow.orientedLiftPair === groupRow.canonicalLiftPair &&
        candidateRow.tokenPairKey === groupRow.tokenPairKey &&
        candidateRow.carrierRay === groupRow.carrierRay,
    );

    if (!canonicalCandidate) {
      throw new Error(`No canonical candidate found for ${groupRow.groupId}`);
    }

    return buildAntipodalQuotientRow(canonicalCandidate);
  });
}

function buildAntipodalQuotientRow(
  candidate: FanoAntipodalLiftCandidateRow,
): FanoAntipodalQuotientRow {
  return {
    antipodalPairId: `antipodal:${candidate.tokenPairKey}`,
    positiveLiftId: candidate.positiveLiftId,
    negativeLiftId: candidate.negativeLiftId,
    positiveTokenId: candidate.positiveTokenId,
    negativeTokenId: candidate.negativeTokenId,
    positiveSignedLift: candidate.positiveSignedLift,
    negativeSignedLift: candidate.negativeSignedLift,
    carrierRay: candidate.carrierRay,
    distinctSourceTokens: true,
    disjointParentSets: true,
    sameCarrierRay: true,
    oppositeSign: true,
    quotientRelation: 'distinct-token-same-ray-opposite-signed-lift',
    conjugacyStatus: 'octonionic-conjugate-orientation',
    spinorReadinessStatus:
      'antipodal-signed-lift-data-ready-for-later-spinor-formalization',
  };
}

function buildSummary(args: {
  primalCarrierRows: FanoPrimalCarrierRow[];
  pairTokenRows: FanoPairSourceTokenRow[];
  orderedLiftRows: FanoOrderedCarrierLiftRow[];
  antipodalLiftCandidateRows: FanoAntipodalLiftCandidateRow[];
  antipodalQuotientGroupRows: FanoAntipodalQuotientGroupRow[];
  antipodalQuotientRows: FanoAntipodalQuotientRow[];
}): FanoOctonionicCarrierTableV0Summary {
  return {
    primalCarrierCount: args.primalCarrierRows.length,
    pairTokenCount: args.pairTokenRows.length,
    orderedLiftCount: args.orderedLiftRows.length,
    carrierRayCount: new Set(
      args.orderedLiftRows.map((row) => row.carrierRay),
    ).size,
    antipodalLiftCandidateCount: args.antipodalLiftCandidateRows.length,
    antipodalQuotientGroupCount: args.antipodalQuotientGroupRows.length,
    antipodalQuotientCount: args.antipodalQuotientRows.length,
    candidateLiftPairs: args.antipodalLiftCandidateRows.map(
      (row) => row.orientedLiftPair,
    ),
    familiarTokenPairs: args.antipodalQuotientRows.map(
      (row) => `${row.positiveTokenId}/${row.negativeTokenId}`,
    ),
    orientedLiftPairs: args.antipodalQuotientRows.map(
      (row) => `${row.positiveLiftId}/${row.negativeLiftId}`,
    ),
    spinorBridgeStatus: 'signed-lift-data-ready-not-spinor-representation',
    complementDerivationStatus: 'derived-from-lift-table',
    hardCodedComplementMapStatus: 'not-used-as-source-of-truth',
    candidateDerivationStatus:
      'all-antipodal-lift-candidates-derived-from-ordered-lift-table',
    quotientGroupingStatus: 'grouped-from-derived-antipodal-lift-candidates',
    representativeSelectionStatus: 'selected-from-derived-candidate-groups',
    representativeSelectionRule: REPRESENTATIVE_SELECTION_RULE,
    rootAFilterStatus: 'not-used',
    emissionStatus: 'not-attached-in-c0',
    uiStatus: 'no-ui',
    recommendedNextGate: 'C1 - Fano-Octonionic Local Channel Table Prototype',
  };
}

function buildIssues(args: {
  orderedLiftRows: FanoOrderedCarrierLiftRow[];
  antipodalLiftCandidateRows: FanoAntipodalLiftCandidateRow[];
  antipodalQuotientGroupRows: FanoAntipodalQuotientGroupRow[];
  summary: FanoOctonionicCarrierTableV0Summary;
}): FanoOctonionicCarrierTableV0Issue[] {
  const issues: FanoOctonionicCarrierTableV0Issue[] = [];

  expectCount(issues, args.summary.primalCarrierCount, 4, 'primal-carrier-count');
  expectCount(issues, args.summary.pairTokenCount, 6, 'pair-token-count');
  expectCount(issues, args.summary.orderedLiftCount, 12, 'ordered-lift-count');
  expectCount(issues, args.summary.carrierRayCount, 3, 'carrier-ray-count');
  expectCount(
    issues,
    args.summary.antipodalLiftCandidateCount,
    6,
    'antipodal-lift-candidate-count',
  );
  expectCount(
    issues,
    args.summary.antipodalQuotientGroupCount,
    3,
    'antipodal-quotient-group-count',
  );
  expectCount(
    issues,
    args.summary.antipodalQuotientCount,
    3,
    'antipodal-quotient-count',
  );

  for (const groupRow of args.antipodalQuotientGroupRows) {
    if (groupRow.candidateCount !== 2) {
      issues.push(
        issue(
          'unexpected-group-candidate-count',
          `${groupRow.groupId}: ${groupRow.candidateCount}`,
        ),
      );
    }
  }

  if (!arraysEqual(args.summary.candidateLiftPairs, EXPECTED_CANDIDATE_LIFT_PAIRS)) {
    issues.push(
      issue(
        'unexpected-candidate-lift-pairs',
        args.summary.candidateLiftPairs.join(', '),
      ),
    );
  }

  if (!arraysEqual(args.summary.orientedLiftPairs, EXPECTED_ORIENTED_LIFT_PAIRS)) {
    issues.push(
      issue(
        'unexpected-oriented-lift-pairs',
        args.summary.orientedLiftPairs.join(', '),
      ),
    );
  }

  if (
    args.summary.representativeSelectionStatus !==
    'selected-from-derived-candidate-groups'
  ) {
    issues.push(
      issue(
        'representative-selection-not-derived',
        args.summary.representativeSelectionStatus,
      ),
    );
  }

  if (args.summary.rootAFilterStatus !== 'not-used') {
    issues.push(issue('root-a-filter-used', args.summary.rootAFilterStatus));
  }

  if (
    args.antipodalLiftCandidateRows.some(
      (row) => row.derivationStatus !== 'derived-from-ordered-lift-table',
    )
  ) {
    issues.push(
      issue(
        'candidate-not-derived-from-ordered-lift-table',
        'candidate derivation status mismatch',
      ),
    );
  }

  for (const row of args.antipodalLiftCandidateRows) {
    if (
      !row.distinctSourceTokens ||
      !row.disjointParentSets ||
      !row.sameCarrierRay ||
      !row.oppositeSign
    ) {
      issues.push(issue('invalid-antipodal-candidate', row.candidateId));
    }
  }

  if (args.summary.complementDerivationStatus !== 'derived-from-lift-table') {
    issues.push(
      issue(
        'complement-not-derived-from-lift-table',
        args.summary.complementDerivationStatus,
      ),
    );
  }

  if (
    args.summary.hardCodedComplementMapStatus !== 'not-used-as-source-of-truth'
  ) {
    issues.push(
      issue(
        'hard-coded-complement-map-used',
        args.summary.hardCodedComplementMapStatus,
      ),
    );
  }

  if (
    args.orderedLiftRows.some(
      (row) =>
        row.spinorBridgeData.spinorBridgeStatus !==
          'signed-lift-data-ready-not-spinor-representation' ||
        row.spinorBridgeData.carrierRay !== row.carrierRay ||
        row.spinorBridgeData.signedLift !== row.signedLift,
    )
  ) {
    issues.push(issue('missing-spinor-bridge-data', 'ordered lift rows'));
  }

  if (args.summary.uiStatus !== 'no-ui') {
    issues.push(issue('ui-status-leak', args.summary.uiStatus));
  }

  return issues;
}

export function multiplyFanoUnits(
  left: FanoUnitId,
  right: FanoUnitId,
): { productUnit: FanoUnitId; sign: FanoSign } {
  const leftNumber = unitNumber(left);
  const rightNumber = unitNumber(right);

  for (const [first, second, third] of ORIENTED_FANO_TRIPLES) {
    for (const [cycleLeft, cycleRight, cycleProduct] of [
      [first, second, third],
      [second, third, first],
      [third, first, second],
    ] as const) {
      if (leftNumber === cycleLeft && rightNumber === cycleRight) {
        return { productUnit: unitId(cycleProduct), sign: '+' };
      }

      if (leftNumber === cycleRight && rightNumber === cycleLeft) {
        return { productUnit: unitId(cycleProduct), sign: '-' };
      }
    }
  }

  throw new Error(`Unsupported Fano product ${left}·${right}`);
}

function buildPairTokenId(parentSet: FanoSourcePair): FanoPairTokenId {
  return `M_${parentSet[0]}${parentSet[1]}` as FanoPairTokenId;
}

function buildTokenPairKey(
  left: FanoPairTokenId,
  right: FanoPairTokenId,
): string {
  return [left, right].sort((a, b) => a.localeCompare(b)).join('/');
}

function buildQuotientGroupKey(row: FanoAntipodalLiftCandidateRow): string {
  return `${row.tokenPairKey}|${row.carrierRay}`;
}

function pickCanonicalCandidate(
  candidateRows: FanoAntipodalLiftCandidateRow[],
): FanoAntipodalLiftCandidateRow {
  const firstToken = candidateRows[0]?.tokenPairKey.split('/')[0];
  const canonicalCandidate = candidateRows.find(
    (row) => row.positiveTokenId === firstToken,
  );

  if (!canonicalCandidate) {
    throw new Error(`No canonical candidate found for ${firstToken ?? 'empty group'}`);
  }

  return canonicalCandidate;
}

function sortCandidateRows(
  candidateRows: FanoAntipodalLiftCandidateRow[],
): FanoAntipodalLiftCandidateRow[] {
  return [...candidateRows].sort((left, right) => {
    const groupDelta = left.tokenPairKey.localeCompare(right.tokenPairKey);

    if (groupDelta !== 0) {
      return groupDelta;
    }

    const leftFirstToken = left.tokenPairKey.split('/')[0];
    const rightFirstToken = right.tokenPairKey.split('/')[0];
    const leftCanonicalRank = left.positiveTokenId === leftFirstToken ? 0 : 1;
    const rightCanonicalRank = right.positiveTokenId === rightFirstToken ? 0 : 1;

    return (
      leftCanonicalRank - rightCanonicalRank ||
      left.orientedLiftPair.localeCompare(right.orientedLiftPair)
    );
  });
}

function areDisjointParentSets(
  left: FanoSourcePair,
  right: FanoSourcePair,
): boolean {
  return left.every((sourceId) => !right.includes(sourceId));
}

function unitNumber(unitId: FanoUnitId): FanoUnitNumber {
  return Number(unitId.slice(1)) as FanoUnitNumber;
}

function unitId(unitNumber: FanoUnitNumber): FanoUnitId {
  return `e${unitNumber}` as FanoUnitId;
}

function expectCount(
  issues: FanoOctonionicCarrierTableV0Issue[],
  actual: number,
  expected: number,
  code: string,
) {
  if (actual !== expected) {
    issues.push(issue(code, `expected ${expected}, got ${actual}`));
  }
}

function issue(
  code: string,
  message: string,
): FanoOctonionicCarrierTableV0Issue {
  return { code, message };
}

function arraysEqual(left: string[], right: string[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}
