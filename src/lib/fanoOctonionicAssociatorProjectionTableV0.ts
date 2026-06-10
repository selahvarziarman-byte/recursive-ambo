import {
  type FanoCanonicalChildCarrierState,
  buildFanoOctonionicLocalChannelTableV0Report,
} from './fanoOctonionicLocalChannelTableV0';
import {
  multiplyFanoUnits,
  type FanoCarrierRay,
  type FanoPairTokenId,
  type FanoPrimalSourceId,
  type FanoSign,
  type FanoSignedLift,
  type FanoSourcePair,
  type FanoUnitId,
} from './fanoOctonionicCarrierTableV0';

export type FanoParentOrderStatus =
  | 'matches-canonical-child-lift-order'
  | 'reverse-of-canonical-child-lift-order';

export type FanoCarrierDisplacementKind =
  | 'nonzero-opposite-signed-same-ray'
  | 'zero-same-signed-same-ray'
  | 'different-ray-composite';

export interface FanoFormalAssociatorRow {
  rowId: string;
  childTokenId: FanoPairTokenId;
  projectionSourceId: FanoPrimalSourceId;
  focusParentId: FanoPrimalSourceId;
  otherParentId: FanoPrimalSourceId;
  parentOrderStatus: FanoParentOrderStatus;
  formalAssociatorExpression: string;
  radixPathLabel: string;
  formalLoopPathLabel: string;
  radixSignedResult: FanoSignedLift;
  formalLoopSignedResult: FanoSignedLift;
  radixResultRay: FanoCarrierRay;
  formalLoopResultRay: FanoCarrierRay;
  formalAssociatorDisplacement: string;
  formalAssociatorDisplacementKind: FanoCarrierDisplacementKind;
  formalAssociatorStatus: 'computed-from-fano-bracketing';
  trisonBridgeStatus: 'formal-associator-carrier-residue-ready-not-semantic-reading';
}

export interface FanoCanonicalProjectionDisplacementRow {
  rowId: string;
  childTokenId: FanoPairTokenId;
  projectionSourceId: FanoPrimalSourceId;
  focusParentId: FanoPrimalSourceId;
  otherParentId: FanoPrimalSourceId;
  canonicalChildLiftId: string;
  canonicalChildSignedLift: FanoSignedLift;
  parentOrderStatus: FanoParentOrderStatus;
  radixPathLabel: string;
  canonicalLoopPathLabel: string;
  radixSignedResult: FanoSignedLift;
  canonicalLoopSignedResult: FanoSignedLift;
  radixResultRay: FanoCarrierRay;
  canonicalLoopResultRay: FanoCarrierRay;
  canonicalProjectionDisplacement: string;
  canonicalProjectionDisplacementKind: FanoCarrierDisplacementKind;
  projectionResidualStatus: 'computed-relative-to-c1-canonical-child-lift';
  trisonBridgeStatus: 'canonical-projection-residue-ready-for-later-trison-reading';
}

export interface FanoOctonionicAssociatorProjectionTableV0Summary {
  method: 'fano-octonionic-associator-projection-table-v0';
  c1DependencyStatus: 'derived-from-c1-local-channel-table';
  formalAssociatorRowCount: number;
  formalAssociatorNonzeroCount: number;
  formalAssociatorZeroCount: number;
  formalAssociatorDifferentRayCount: number;
  canonicalProjectionDisplacementRowCount: number;
  canonicalProjectionNonzeroCount: number;
  canonicalProjectionZeroCount: number;
  canonicalProjectionDifferentRayCount: number;
  parentOrderMatchedCount: number;
  parentOrderReversedCount: number;
  trisonBridgeStatus: 'carrier-residue-tables-ready-for-later-trison-reading';
  spinorBridgeStatus: 'associator-displacement-data-ready-not-spinor-representation';
  semanticLabelStatus: 'not-attached-placeholders-only';
  emissionStatus: 'not-attached-in-a0';
  uiStatus: 'no-ui';
  recommendedNextGate: 'E0 - Finite Harmonic Emission Profile Library';
}

export interface FanoOctonionicAssociatorProjectionTableV0Issue {
  code: string;
  message: string;
}

export interface FanoOctonionicAssociatorProjectionTableV0Report {
  method: 'fano-octonionic-associator-projection-table-v0';
  formalAssociatorRows: FanoFormalAssociatorRow[];
  canonicalProjectionDisplacementRows: FanoCanonicalProjectionDisplacementRow[];
  summary: FanoOctonionicAssociatorProjectionTableV0Summary;
  issues: FanoOctonionicAssociatorProjectionTableV0Issue[];
  ok: boolean;
}

interface SignedCarrierComputation {
  signedResult: FanoSignedLift;
  resultRay: FanoCarrierRay;
}

interface CarrierDisplacement {
  displacement: string;
  kind: FanoCarrierDisplacementKind;
}

const FORMAL_ASSOCIATOR_STATUS = 'computed-from-fano-bracketing';
const PROJECTION_RESIDUAL_STATUS =
  'computed-relative-to-c1-canonical-child-lift';
const FORMAL_TRISON_BRIDGE_STATUS =
  'formal-associator-carrier-residue-ready-not-semantic-reading';
const CANONICAL_TRISON_BRIDGE_STATUS =
  'canonical-projection-residue-ready-for-later-trison-reading';

export function buildFanoOctonionicAssociatorProjectionTableV0Report(): FanoOctonionicAssociatorProjectionTableV0Report {
  const c1Report = buildFanoOctonionicLocalChannelTableV0Report();
  const sourceCarrierUnitBySourceId =
    buildSourceCarrierUnitBySourceId(c1Report);
  const formalAssociatorRows: FanoFormalAssociatorRow[] = [];
  const canonicalProjectionDisplacementRows: FanoCanonicalProjectionDisplacementRow[] =
    [];

  for (const state of c1Report.canonicalChildCarrierStates) {
    const canonicalParentOrder = parseCanonicalParentOrder(
      state.canonicalLiftId,
    );

    for (const projectionSourceId of state.projectedSourceSet) {
      for (const focusParentId of state.parentSet) {
        const otherParentId = getOtherParentId(state.parentSet, focusParentId);
        const parentOrderStatus = getParentOrderStatus({
          canonicalParentOrder,
          focusParentId,
          otherParentId,
        });
        const sharedInput = {
          state,
          projectionSourceId,
          focusParentId,
          otherParentId,
          parentOrderStatus,
          sourceCarrierUnitBySourceId,
        };

        formalAssociatorRows.push(buildFormalAssociatorRow(sharedInput));
        canonicalProjectionDisplacementRows.push(
          buildCanonicalProjectionDisplacementRow(sharedInput),
        );
      }
    }
  }

  const summary = buildSummary({
    formalAssociatorRows,
    canonicalProjectionDisplacementRows,
  });
  const issues = buildIssues({
    c1Ok: c1Report.ok,
    formalAssociatorRows,
    canonicalProjectionDisplacementRows,
    summary,
  });

  return {
    method: 'fano-octonionic-associator-projection-table-v0',
    formalAssociatorRows,
    canonicalProjectionDisplacementRows,
    summary,
    issues,
    ok: issues.length === 0,
  };
}

function buildFormalAssociatorRow(args: {
  state: FanoCanonicalChildCarrierState;
  projectionSourceId: FanoPrimalSourceId;
  focusParentId: FanoPrimalSourceId;
  otherParentId: FanoPrimalSourceId;
  parentOrderStatus: FanoParentOrderStatus;
  sourceCarrierUnitBySourceId: Map<FanoPrimalSourceId, FanoUnitId>;
}): FanoFormalAssociatorRow {
  const radixResult = computeRadixPath(args);
  const parentProduct = multiplySignedCarriers(
    sourceCarrier(args.focusParentId, args.sourceCarrierUnitBySourceId),
    sourceCarrier(args.otherParentId, args.sourceCarrierUnitBySourceId),
  );
  const formalLoopResult = multiplySignedCarriers(
    sourceCarrier(args.projectionSourceId, args.sourceCarrierUnitBySourceId),
    parentProduct.signedResult,
  );
  const displacement = describeDisplacement(radixResult, formalLoopResult);

  return {
    rowId: `formal:${args.state.tokenId}:${args.projectionSourceId}:${args.focusParentId}:${args.otherParentId}`,
    childTokenId: args.state.tokenId,
    projectionSourceId: args.projectionSourceId,
    focusParentId: args.focusParentId,
    otherParentId: args.otherParentId,
    parentOrderStatus: args.parentOrderStatus,
    formalAssociatorExpression: `[${args.projectionSourceId},${args.focusParentId},${args.otherParentId}]`,
    radixPathLabel: `(${args.projectionSourceId}·${args.focusParentId})·${args.otherParentId}`,
    formalLoopPathLabel: `${args.projectionSourceId}·(${args.focusParentId}·${args.otherParentId})`,
    radixSignedResult: radixResult.signedResult,
    formalLoopSignedResult: formalLoopResult.signedResult,
    radixResultRay: radixResult.resultRay,
    formalLoopResultRay: formalLoopResult.resultRay,
    formalAssociatorDisplacement: displacement.displacement,
    formalAssociatorDisplacementKind: displacement.kind,
    formalAssociatorStatus: FORMAL_ASSOCIATOR_STATUS,
    trisonBridgeStatus: FORMAL_TRISON_BRIDGE_STATUS,
  };
}

function buildCanonicalProjectionDisplacementRow(args: {
  state: FanoCanonicalChildCarrierState;
  projectionSourceId: FanoPrimalSourceId;
  focusParentId: FanoPrimalSourceId;
  otherParentId: FanoPrimalSourceId;
  parentOrderStatus: FanoParentOrderStatus;
  sourceCarrierUnitBySourceId: Map<FanoPrimalSourceId, FanoUnitId>;
}): FanoCanonicalProjectionDisplacementRow {
  const radixResult = computeRadixPath(args);
  const canonicalLoopResult = multiplySignedCarriers(
    sourceCarrier(args.projectionSourceId, args.sourceCarrierUnitBySourceId),
    args.state.signedLift,
  );
  const displacement = describeDisplacement(radixResult, canonicalLoopResult);

  return {
    rowId: `canonical-projection:${args.state.tokenId}:${args.projectionSourceId}:${args.focusParentId}:${args.otherParentId}`,
    childTokenId: args.state.tokenId,
    projectionSourceId: args.projectionSourceId,
    focusParentId: args.focusParentId,
    otherParentId: args.otherParentId,
    canonicalChildLiftId: args.state.canonicalLiftId,
    canonicalChildSignedLift: args.state.signedLift,
    parentOrderStatus: args.parentOrderStatus,
    radixPathLabel: `(${args.projectionSourceId}·${args.focusParentId})·${args.otherParentId}`,
    canonicalLoopPathLabel: `${args.projectionSourceId}·${args.state.signedLift}`,
    radixSignedResult: radixResult.signedResult,
    canonicalLoopSignedResult: canonicalLoopResult.signedResult,
    radixResultRay: radixResult.resultRay,
    canonicalLoopResultRay: canonicalLoopResult.resultRay,
    canonicalProjectionDisplacement: displacement.displacement,
    canonicalProjectionDisplacementKind: displacement.kind,
    projectionResidualStatus: PROJECTION_RESIDUAL_STATUS,
    trisonBridgeStatus: CANONICAL_TRISON_BRIDGE_STATUS,
  };
}

function computeRadixPath(args: {
  projectionSourceId: FanoPrimalSourceId;
  focusParentId: FanoPrimalSourceId;
  otherParentId: FanoPrimalSourceId;
  sourceCarrierUnitBySourceId: Map<FanoPrimalSourceId, FanoUnitId>;
}): SignedCarrierComputation {
  const firstProduct = multiplySignedCarriers(
    sourceCarrier(args.projectionSourceId, args.sourceCarrierUnitBySourceId),
    sourceCarrier(args.focusParentId, args.sourceCarrierUnitBySourceId),
  );

  return multiplySignedCarriers(
    firstProduct.signedResult,
    sourceCarrier(args.otherParentId, args.sourceCarrierUnitBySourceId),
  );
}

function buildSummary(args: {
  formalAssociatorRows: FanoFormalAssociatorRow[];
  canonicalProjectionDisplacementRows: FanoCanonicalProjectionDisplacementRow[];
}): FanoOctonionicAssociatorProjectionTableV0Summary {
  return {
    method: 'fano-octonionic-associator-projection-table-v0',
    c1DependencyStatus: 'derived-from-c1-local-channel-table',
    formalAssociatorRowCount: args.formalAssociatorRows.length,
    formalAssociatorNonzeroCount: countCarrierDisplacementKind(
      args.formalAssociatorRows,
      'formalAssociatorDisplacementKind',
      'nonzero-opposite-signed-same-ray',
    ),
    formalAssociatorZeroCount: countCarrierDisplacementKind(
      args.formalAssociatorRows,
      'formalAssociatorDisplacementKind',
      'zero-same-signed-same-ray',
    ),
    formalAssociatorDifferentRayCount: countCarrierDisplacementKind(
      args.formalAssociatorRows,
      'formalAssociatorDisplacementKind',
      'different-ray-composite',
    ),
    canonicalProjectionDisplacementRowCount:
      args.canonicalProjectionDisplacementRows.length,
    canonicalProjectionNonzeroCount: countCarrierDisplacementKind(
      args.canonicalProjectionDisplacementRows,
      'canonicalProjectionDisplacementKind',
      'nonzero-opposite-signed-same-ray',
    ),
    canonicalProjectionZeroCount: countCarrierDisplacementKind(
      args.canonicalProjectionDisplacementRows,
      'canonicalProjectionDisplacementKind',
      'zero-same-signed-same-ray',
    ),
    canonicalProjectionDifferentRayCount: countCarrierDisplacementKind(
      args.canonicalProjectionDisplacementRows,
      'canonicalProjectionDisplacementKind',
      'different-ray-composite',
    ),
    parentOrderMatchedCount: args.formalAssociatorRows.filter(
      (row) => row.parentOrderStatus === 'matches-canonical-child-lift-order',
    ).length,
    parentOrderReversedCount: args.formalAssociatorRows.filter(
      (row) => row.parentOrderStatus === 'reverse-of-canonical-child-lift-order',
    ).length,
    trisonBridgeStatus: 'carrier-residue-tables-ready-for-later-trison-reading',
    spinorBridgeStatus:
      'associator-displacement-data-ready-not-spinor-representation',
    semanticLabelStatus: 'not-attached-placeholders-only',
    emissionStatus: 'not-attached-in-a0',
    uiStatus: 'no-ui',
    recommendedNextGate: 'E0 - Finite Harmonic Emission Profile Library',
  };
}

function buildIssues(args: {
  c1Ok: boolean;
  formalAssociatorRows: FanoFormalAssociatorRow[];
  canonicalProjectionDisplacementRows: FanoCanonicalProjectionDisplacementRow[];
  summary: FanoOctonionicAssociatorProjectionTableV0Summary;
}): FanoOctonionicAssociatorProjectionTableV0Issue[] {
  const issues: FanoOctonionicAssociatorProjectionTableV0Issue[] = [];

  if (!args.c1Ok) {
    issues.push(issue('c1-report-not-ok', 'C1 local channel report is not ok'));
  }

  expectCount(
    issues,
    args.summary.formalAssociatorRowCount,
    24,
    'formal-associator-row-count',
  );
  expectCount(
    issues,
    args.summary.canonicalProjectionDisplacementRowCount,
    24,
    'canonical-projection-displacement-row-count',
  );
  expectCount(
    issues,
    args.summary.formalAssociatorNonzeroCount,
    24,
    'formal-associator-nonzero-count',
  );
  expectCount(
    issues,
    args.summary.formalAssociatorZeroCount,
    0,
    'formal-associator-zero-count',
  );
  expectCount(
    issues,
    args.summary.formalAssociatorDifferentRayCount,
    0,
    'formal-associator-different-ray-count',
  );
  expectCount(
    issues,
    args.summary.canonicalProjectionNonzeroCount,
    12,
    'canonical-projection-nonzero-count',
  );
  expectCount(
    issues,
    args.summary.canonicalProjectionZeroCount,
    12,
    'canonical-projection-zero-count',
  );
  expectCount(
    issues,
    args.summary.canonicalProjectionDifferentRayCount,
    0,
    'canonical-projection-different-ray-count',
  );
  expectCount(
    issues,
    args.summary.parentOrderMatchedCount,
    12,
    'parent-order-matched-count',
  );
  expectCount(
    issues,
    args.summary.parentOrderReversedCount,
    12,
    'parent-order-reversed-count',
  );

  if (
    args.formalAssociatorRows.some(
      (row) => row.formalAssociatorStatus !== FORMAL_ASSOCIATOR_STATUS,
    )
  ) {
    issues.push(
      issue(
        'formal-associator-status-mismatch',
        'formal rows must be computed from Fano bracketing',
      ),
    );
  }

  if (
    args.canonicalProjectionDisplacementRows.some(
      (row) => row.projectionResidualStatus !== PROJECTION_RESIDUAL_STATUS,
    )
  ) {
    issues.push(
      issue(
        'projection-residual-status-mismatch',
        'canonical rows must be relative to C1 canonical child lifts',
      ),
    );
  }

  if (
    args.summary.semanticLabelStatus !== 'not-attached-placeholders-only'
  ) {
    issues.push(
      issue('semantic-label-attached', 'semantic labels must remain unattached'),
    );
  }

  if (args.summary.emissionStatus !== 'not-attached-in-a0') {
    issues.push(issue('emission-attached', args.summary.emissionStatus));
  }

  if (
    args.summary.spinorBridgeStatus !==
    'associator-displacement-data-ready-not-spinor-representation'
  ) {
    issues.push(
      issue(
        'spinor-representation-claimed',
        'A0 must only preserve associator displacement data',
      ),
    );
  }

  if (args.summary.uiStatus !== 'no-ui') {
    issues.push(issue('ui-attached', args.summary.uiStatus));
  }

  return issues;
}

function describeDisplacement(
  radixResult: SignedCarrierComputation,
  loopResult: SignedCarrierComputation,
): CarrierDisplacement {
  if (radixResult.resultRay !== loopResult.resultRay) {
    return {
      displacement: `composite(${radixResult.signedResult},${loopResult.signedResult})`,
      kind: 'different-ray-composite',
    };
  }

  const radixSign = getSignedCarrierSign(radixResult.signedResult);
  const loopSign = getSignedCarrierSign(loopResult.signedResult);

  if (radixSign === loopSign) {
    return {
      displacement: '0',
      kind: 'zero-same-signed-same-ray',
    };
  }

  return {
    displacement: `${radixSign}2${getSignedCarrierUnit(radixResult.signedResult)}`,
    kind: 'nonzero-opposite-signed-same-ray',
  };
}

function multiplySignedCarriers(
  left: FanoSignedLift,
  right: FanoSignedLift,
): SignedCarrierComputation {
  const leftSign = getSignedCarrierSign(left);
  const rightSign = getSignedCarrierSign(right);
  const product = multiplyFanoUnits(
    getSignedCarrierUnit(left),
    getSignedCarrierUnit(right),
  );
  const resultSign = combineSigns(combineSigns(leftSign, rightSign), product.sign);

  return {
    signedResult: `${resultSign}${product.productUnit}` as FanoSignedLift,
    resultRay: `ray:${product.productUnit}` as FanoCarrierRay,
  };
}

function sourceCarrier(
  sourceId: FanoPrimalSourceId,
  sourceCarrierUnitBySourceId: Map<FanoPrimalSourceId, FanoUnitId>,
): FanoSignedLift {
  const unit = sourceCarrierUnitBySourceId.get(sourceId);

  if (!unit) {
    throw new Error(`No C1-derived carrier unit found for ${sourceId}`);
  }

  return `+${unit}` as FanoSignedLift;
}

function buildSourceCarrierUnitBySourceId(
  c1Report: ReturnType<typeof buildFanoOctonionicLocalChannelTableV0Report>,
): Map<FanoPrimalSourceId, FanoUnitId> {
  const unitBySourceId = new Map<FanoPrimalSourceId, FanoUnitId>();

  for (const row of c1Report.localChannelRows) {
    const unit = getCarrierRayUnit(row.childLeftResultRay);
    const existingUnit = unitBySourceId.get(row.childLeftRecoveredSourceId);

    if (existingUnit && existingUnit !== unit) {
      throw new Error(
        `Conflicting C1-derived carrier units for ${row.childLeftRecoveredSourceId}: ${existingUnit} and ${unit}`,
      );
    }

    unitBySourceId.set(row.childLeftRecoveredSourceId, unit);
  }

  return unitBySourceId;
}

function parseCanonicalParentOrder(
  canonicalLiftId: string,
): FanoSourcePair {
  const [left, right] = canonicalLiftId.split('·');

  if (!isPrimalSourceId(left) || !isPrimalSourceId(right)) {
    throw new Error(`Invalid canonical child lift id ${canonicalLiftId}`);
  }

  return [left, right];
}

function getParentOrderStatus(args: {
  canonicalParentOrder: FanoSourcePair;
  focusParentId: FanoPrimalSourceId;
  otherParentId: FanoPrimalSourceId;
}): FanoParentOrderStatus {
  return args.canonicalParentOrder[0] === args.focusParentId &&
    args.canonicalParentOrder[1] === args.otherParentId
    ? 'matches-canonical-child-lift-order'
    : 'reverse-of-canonical-child-lift-order';
}

function getOtherParentId(
  parentSet: FanoSourcePair,
  focusParentId: FanoPrimalSourceId,
): FanoPrimalSourceId {
  const otherParentId = parentSet.find(
    (sourceId) => sourceId !== focusParentId,
  );

  if (!otherParentId) {
    throw new Error(`No other parent found for ${focusParentId}`);
  }

  return otherParentId;
}

function getCarrierRayUnit(ray: FanoCarrierRay): FanoUnitId {
  return ray.slice('ray:'.length) as FanoUnitId;
}

function getSignedCarrierSign(signedCarrier: FanoSignedLift): FanoSign {
  return signedCarrier.slice(0, 1) as FanoSign;
}

function getSignedCarrierUnit(signedCarrier: FanoSignedLift): FanoUnitId {
  return signedCarrier.slice(1) as FanoUnitId;
}

function combineSigns(left: FanoSign, right: FanoSign): FanoSign {
  return left === right ? '+' : '-';
}

function isPrimalSourceId(value: string | undefined): value is FanoPrimalSourceId {
  return value === 'A' || value === 'B' || value === 'C' || value === 'D';
}

function countCarrierDisplacementKind<
  TRow extends Record<TKey, FanoCarrierDisplacementKind>,
  TKey extends keyof TRow,
>(rows: TRow[], key: TKey, kind: FanoCarrierDisplacementKind): number {
  return rows.filter((row) => row[key] === kind).length;
}

function expectCount(
  issues: FanoOctonionicAssociatorProjectionTableV0Issue[],
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
): FanoOctonionicAssociatorProjectionTableV0Issue {
  return { code, message };
}
