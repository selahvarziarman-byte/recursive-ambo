import {
  buildFanoOctonionicCarrierTableV0Report,
  multiplyFanoUnits,
  type FanoCarrierRay,
  type FanoOrderedLiftId,
  type FanoPairTokenId,
  type FanoPrimalSourceId,
  type FanoSign,
  type FanoSignedLift,
  type FanoSourcePair,
  type FanoUnitId,
} from './fanoOctonionicCarrierTableV0';

export type FanoLocalChannelActionSourceRole =
  | 'parent-source'
  | 'projected-source';

export type FanoLocalChannelFamily =
  | 'child-parent-return'
  | 'child-projection-loop';

export type FanoLocalChannelRecoveryStatus =
  | 'recovered-expected-source-ray'
  | 'failed-to-recover-expected-source-ray';

export type FanoSourceLeftOrientationRelation =
  | 'same-ray-opposite-signed-orientation'
  | 'orientation-witness-mismatch';

export interface FanoCanonicalChildCarrierState {
  tokenId: FanoPairTokenId;
  parentSet: FanoSourcePair;
  projectedSourceSet: FanoSourcePair;
  canonicalLiftId: FanoOrderedLiftId;
  signedLift: FanoSignedLift;
  carrierRay: FanoCarrierRay;
  orientationSign: FanoSign;
  productUnit: FanoUnitId;
  complementTokenId: FanoPairTokenId;
  sourceTokenStatus: 'semantic-label-not-attached';
  spinorBridgeStatus: 'signed-lift-local-channel-data-ready-not-spinor-representation';
}

export interface FanoLocalChannelRow {
  childTokenId: FanoPairTokenId;
  childCanonicalLiftId: FanoOrderedLiftId;
  childSignedLift: FanoSignedLift;
  actionSourceId: FanoPrimalSourceId;
  actionSourceRole: FanoLocalChannelActionSourceRole;
  expectedRecoveredSourceId: FanoPrimalSourceId;
  channelFamily: FanoLocalChannelFamily;
  childLeftOperation: string;
  childLeftSignedResult: FanoSignedLift;
  childLeftResultRay: FanoCarrierRay;
  childLeftRecoveredSourceId: FanoPrimalSourceId;
  childLeftRecoveryStatus: FanoLocalChannelRecoveryStatus;
  sourceLeftOperation: string;
  sourceLeftSignedResult: FanoSignedLift;
  sourceLeftResultRay: FanoCarrierRay;
  sourceLeftRecoveredSourceId: FanoPrimalSourceId;
  sourceLeftOrientationRelation: FanoSourceLeftOrientationRelation;
  derivationStatus: 'derived-from-c0-signed-child-lift-and-fano-multiplication';
}

export interface FanoOctonionicLocalChannelTableV0Summary {
  method: 'fano-octonionic-local-channel-table-v0';
  canonicalChildCarrierCount: number;
  localChannelRowCount: number;
  parentReturnChannelCount: number;
  projectionLoopChannelCount: number;
  childLeftRecoveryOkCount: number;
  sourceLeftOrientationWitnessCount: number;
  c0CarrierDependencyStatus: 'derived-from-c0-strict-carrier-table';
  semanticLabelStatus: 'not-attached-placeholders-only';
  associatorStatus: 'not-computed-in-c1-local-channel-inputs-ready';
  spinorBridgeStatus: 'signed-lift-local-channel-data-ready-not-spinor-representation';
  emissionStatus: 'not-attached-in-c1';
  uiStatus: 'no-ui';
  recommendedNextGate: 'A0 - Fano-Octonionic Associator Projection Table';
}

export interface FanoOctonionicLocalChannelTableV0Issue {
  code: string;
  message: string;
}

export interface FanoOctonionicLocalChannelTableV0Report {
  method: 'fano-octonionic-local-channel-table-v0';
  canonicalChildCarrierStates: FanoCanonicalChildCarrierState[];
  localChannelRows: FanoLocalChannelRow[];
  summary: FanoOctonionicLocalChannelTableV0Summary;
  issues: FanoOctonionicLocalChannelTableV0Issue[];
  ok: boolean;
}

const PRIMAL_SOURCE_ORDER: readonly FanoPrimalSourceId[] = [
  'A',
  'B',
  'C',
  'D',
];

const DERIVATION_STATUS =
  'derived-from-c0-signed-child-lift-and-fano-multiplication';
const SOURCE_TOKEN_STATUS = 'semantic-label-not-attached';
const SPINOR_BRIDGE_STATUS =
  'signed-lift-local-channel-data-ready-not-spinor-representation';

export function buildFanoOctonionicLocalChannelTableV0Report(): FanoOctonionicLocalChannelTableV0Report {
  const c0Report = buildFanoOctonionicCarrierTableV0Report();
  const primalCarrierUnitBySourceId = buildPrimalCarrierUnitBySourceId(c0Report);
  const sourceIdByCarrierUnit = buildSourceIdByCarrierUnit(c0Report);
  const parentSetByTokenId = buildParentSetByTokenId(c0Report);
  const canonicalChildCarrierStates = buildCanonicalChildCarrierStates({
    parentSetByTokenId,
    quotientRows: c0Report.antipodalQuotientRows,
  });
  const localChannelRows = canonicalChildCarrierStates.flatMap((state) =>
    PRIMAL_SOURCE_ORDER.map((sourceId) =>
      buildLocalChannelRow({
        state,
        actionSourceId: sourceId,
        primalCarrierUnitBySourceId,
        sourceIdByCarrierUnit,
      }),
    ),
  );
  const summary = buildSummary({
    canonicalChildCarrierStates,
    localChannelRows,
  });
  const issues = buildIssues({
    c0Ok: c0Report.ok,
    canonicalChildCarrierStates,
    localChannelRows,
    summary,
  });

  return {
    method: 'fano-octonionic-local-channel-table-v0',
    canonicalChildCarrierStates,
    localChannelRows,
    summary,
    issues,
    ok: issues.length === 0,
  };
}

function buildCanonicalChildCarrierStates(args: {
  parentSetByTokenId: Map<FanoPairTokenId, FanoSourcePair>;
  quotientRows: ReturnType<
    typeof buildFanoOctonionicCarrierTableV0Report
  >['antipodalQuotientRows'];
}): FanoCanonicalChildCarrierState[] {
  return args.quotientRows.flatMap((row) => [
    buildCanonicalChildCarrierState({
      tokenId: row.positiveTokenId,
      complementTokenId: row.negativeTokenId,
      canonicalLiftId: row.positiveLiftId,
      signedLift: row.positiveSignedLift,
      carrierRay: row.carrierRay,
      parentSetByTokenId: args.parentSetByTokenId,
    }),
    buildCanonicalChildCarrierState({
      tokenId: row.negativeTokenId,
      complementTokenId: row.positiveTokenId,
      canonicalLiftId: row.negativeLiftId,
      signedLift: row.negativeSignedLift,
      carrierRay: row.carrierRay,
      parentSetByTokenId: args.parentSetByTokenId,
    }),
  ]);
}

function buildCanonicalChildCarrierState(args: {
  tokenId: FanoPairTokenId;
  complementTokenId: FanoPairTokenId;
  canonicalLiftId: FanoOrderedLiftId;
  signedLift: FanoSignedLift;
  carrierRay: FanoCarrierRay;
  parentSetByTokenId: Map<FanoPairTokenId, FanoSourcePair>;
}): FanoCanonicalChildCarrierState {
  const parentSet = getParentSet(args.parentSetByTokenId, args.tokenId);
  const projectedSourceSet = buildProjectedSourceSet(parentSet);
  const orientationSign = getSignedLiftSign(args.signedLift);
  const productUnit = getSignedLiftUnit(args.signedLift);

  return {
    tokenId: args.tokenId,
    parentSet,
    projectedSourceSet,
    canonicalLiftId: args.canonicalLiftId,
    signedLift: args.signedLift,
    carrierRay: args.carrierRay,
    orientationSign,
    productUnit,
    complementTokenId: args.complementTokenId,
    sourceTokenStatus: SOURCE_TOKEN_STATUS,
    spinorBridgeStatus: SPINOR_BRIDGE_STATUS,
  };
}

function buildLocalChannelRow(args: {
  state: FanoCanonicalChildCarrierState;
  actionSourceId: FanoPrimalSourceId;
  primalCarrierUnitBySourceId: Map<FanoPrimalSourceId, FanoUnitId>;
  sourceIdByCarrierUnit: Map<FanoUnitId, FanoPrimalSourceId>;
}): FanoLocalChannelRow {
  const actionSourceRole = getActionSourceRole(
    args.state.parentSet,
    args.actionSourceId,
  );
  const recoverySet =
    actionSourceRole === 'parent-source'
      ? args.state.parentSet
      : args.state.projectedSourceSet;
  const expectedRecoveredSourceId = getOtherSourceId(
    recoverySet,
    args.actionSourceId,
  );
  const actionSourceUnit = getPrimalCarrierUnit(
    args.primalCarrierUnitBySourceId,
    args.actionSourceId,
  );
  const childLeftResult = multiplySignedChildLiftBySource({
    childSignedLift: args.state.signedLift,
    sourceUnit: actionSourceUnit,
    sourceIdByCarrierUnit: args.sourceIdByCarrierUnit,
  });
  const sourceLeftResult = multiplySourceBySignedChildLift({
    sourceUnit: actionSourceUnit,
    childSignedLift: args.state.signedLift,
    sourceIdByCarrierUnit: args.sourceIdByCarrierUnit,
  });
  const sourceLeftOrientationRelation =
    childLeftResult.resultRay === sourceLeftResult.resultRay &&
    getSignedLiftSign(childLeftResult.signedResult) !==
      getSignedLiftSign(sourceLeftResult.signedResult)
      ? 'same-ray-opposite-signed-orientation'
      : 'orientation-witness-mismatch';

  return {
    childTokenId: args.state.tokenId,
    childCanonicalLiftId: args.state.canonicalLiftId,
    childSignedLift: args.state.signedLift,
    actionSourceId: args.actionSourceId,
    actionSourceRole,
    expectedRecoveredSourceId,
    channelFamily:
      actionSourceRole === 'parent-source'
        ? 'child-parent-return'
        : 'child-projection-loop',
    childLeftOperation: `${args.state.signedLift}·${args.actionSourceId}`,
    childLeftSignedResult: childLeftResult.signedResult,
    childLeftResultRay: childLeftResult.resultRay,
    childLeftRecoveredSourceId: childLeftResult.recoveredSourceId,
    childLeftRecoveryStatus:
      childLeftResult.recoveredSourceId === expectedRecoveredSourceId
        ? 'recovered-expected-source-ray'
        : 'failed-to-recover-expected-source-ray',
    sourceLeftOperation: `${args.actionSourceId}·${args.state.signedLift}`,
    sourceLeftSignedResult: sourceLeftResult.signedResult,
    sourceLeftResultRay: sourceLeftResult.resultRay,
    sourceLeftRecoveredSourceId: sourceLeftResult.recoveredSourceId,
    sourceLeftOrientationRelation,
    derivationStatus: DERIVATION_STATUS,
  };
}

function buildSummary(args: {
  canonicalChildCarrierStates: FanoCanonicalChildCarrierState[];
  localChannelRows: FanoLocalChannelRow[];
}): FanoOctonionicLocalChannelTableV0Summary {
  return {
    method: 'fano-octonionic-local-channel-table-v0',
    canonicalChildCarrierCount: args.canonicalChildCarrierStates.length,
    localChannelRowCount: args.localChannelRows.length,
    parentReturnChannelCount: args.localChannelRows.filter(
      (row) => row.channelFamily === 'child-parent-return',
    ).length,
    projectionLoopChannelCount: args.localChannelRows.filter(
      (row) => row.channelFamily === 'child-projection-loop',
    ).length,
    childLeftRecoveryOkCount: args.localChannelRows.filter(
      (row) =>
        row.childLeftRecoveryStatus === 'recovered-expected-source-ray' &&
        row.childLeftRecoveredSourceId === row.expectedRecoveredSourceId,
    ).length,
    sourceLeftOrientationWitnessCount: args.localChannelRows.filter(
      (row) =>
        row.sourceLeftOrientationRelation ===
          'same-ray-opposite-signed-orientation' &&
        row.sourceLeftResultRay === row.childLeftResultRay &&
        getSignedLiftSign(row.sourceLeftSignedResult) !==
          getSignedLiftSign(row.childLeftSignedResult),
    ).length,
    c0CarrierDependencyStatus: 'derived-from-c0-strict-carrier-table',
    semanticLabelStatus: 'not-attached-placeholders-only',
    associatorStatus: 'not-computed-in-c1-local-channel-inputs-ready',
    spinorBridgeStatus: SPINOR_BRIDGE_STATUS,
    emissionStatus: 'not-attached-in-c1',
    uiStatus: 'no-ui',
    recommendedNextGate: 'A0 - Fano-Octonionic Associator Projection Table',
  };
}

function buildIssues(args: {
  c0Ok: boolean;
  canonicalChildCarrierStates: FanoCanonicalChildCarrierState[];
  localChannelRows: FanoLocalChannelRow[];
  summary: FanoOctonionicLocalChannelTableV0Summary;
}): FanoOctonionicLocalChannelTableV0Issue[] {
  const issues: FanoOctonionicLocalChannelTableV0Issue[] = [];

  if (!args.c0Ok) {
    issues.push(issue('c0-report-not-ok', 'C0 carrier table report is not ok'));
  }

  expectCount(
    issues,
    args.summary.canonicalChildCarrierCount,
    6,
    'canonical-child-carrier-count',
  );
  expectCount(
    issues,
    args.summary.localChannelRowCount,
    24,
    'local-channel-row-count',
  );
  expectCount(
    issues,
    args.summary.parentReturnChannelCount,
    12,
    'parent-return-channel-count',
  );
  expectCount(
    issues,
    args.summary.projectionLoopChannelCount,
    12,
    'projection-loop-channel-count',
  );
  expectCount(
    issues,
    args.summary.childLeftRecoveryOkCount,
    24,
    'child-left-recovery-ok-count',
  );
  expectCount(
    issues,
    args.summary.sourceLeftOrientationWitnessCount,
    24,
    'source-left-orientation-witness-count',
  );

  for (const row of args.localChannelRows) {
    if (
      row.childLeftRecoveryStatus !== 'recovered-expected-source-ray' ||
      row.childLeftRecoveredSourceId !== row.expectedRecoveredSourceId
    ) {
      issues.push(
        issue(
          'child-left-recovery-failed',
          `${row.childTokenId}/${row.actionSourceId} expected ${row.expectedRecoveredSourceId}, got ${row.childLeftRecoveredSourceId}`,
        ),
      );
    }

    if (row.sourceLeftResultRay !== row.childLeftResultRay) {
      issues.push(
        issue(
          'source-left-ray-mismatch',
          `${row.childTokenId}/${row.actionSourceId} child-left ${row.childLeftResultRay}, source-left ${row.sourceLeftResultRay}`,
        ),
      );
    }

    if (
      getSignedLiftSign(row.sourceLeftSignedResult) ===
      getSignedLiftSign(row.childLeftSignedResult)
    ) {
      issues.push(
        issue(
          'source-left-orientation-sign-not-reversed',
          `${row.childTokenId}/${row.actionSourceId} child-left ${row.childLeftSignedResult}, source-left ${row.sourceLeftSignedResult}`,
        ),
      );
    }

    if (row.derivationStatus !== DERIVATION_STATUS) {
      issues.push(
        issue(
          'local-channel-row-not-derived',
          `${row.childTokenId}/${row.actionSourceId}`,
        ),
      );
    }
  }

  if (
    args.canonicalChildCarrierStates.some(
      (state) => state.sourceTokenStatus !== SOURCE_TOKEN_STATUS,
    ) ||
    args.summary.semanticLabelStatus !== 'not-attached-placeholders-only'
  ) {
    issues.push(
      issue('semantic-label-attached', 'semantic labels must remain unattached'),
    );
  }

  if (
    args.canonicalChildCarrierStates.some(
      (state) => state.spinorBridgeStatus !== SPINOR_BRIDGE_STATUS,
    ) ||
    args.summary.spinorBridgeStatus !== SPINOR_BRIDGE_STATUS
  ) {
    issues.push(
      issue(
        'spinor-representation-claimed',
        'C1 must only preserve signed-lift local channel data',
      ),
    );
  }

  if (args.summary.emissionStatus !== 'not-attached-in-c1') {
    issues.push(issue('emission-attached', args.summary.emissionStatus));
  }

  if (args.summary.uiStatus !== 'no-ui') {
    issues.push(issue('ui-attached', args.summary.uiStatus));
  }

  return issues;
}

function multiplySignedChildLiftBySource(args: {
  childSignedLift: FanoSignedLift;
  sourceUnit: FanoUnitId;
  sourceIdByCarrierUnit: Map<FanoUnitId, FanoPrimalSourceId>;
}): {
  signedResult: FanoSignedLift;
  resultRay: FanoCarrierRay;
  recoveredSourceId: FanoPrimalSourceId;
} {
  const childSign = getSignedLiftSign(args.childSignedLift);
  const childUnit = getSignedLiftUnit(args.childSignedLift);
  const product = multiplyFanoUnits(childUnit, args.sourceUnit);
  const resultSign = combineSigns(childSign, product.sign);

  return buildSignedPrimalResult({
    productUnit: product.productUnit,
    sign: resultSign,
    sourceIdByCarrierUnit: args.sourceIdByCarrierUnit,
  });
}

function multiplySourceBySignedChildLift(args: {
  sourceUnit: FanoUnitId;
  childSignedLift: FanoSignedLift;
  sourceIdByCarrierUnit: Map<FanoUnitId, FanoPrimalSourceId>;
}): {
  signedResult: FanoSignedLift;
  resultRay: FanoCarrierRay;
  recoveredSourceId: FanoPrimalSourceId;
} {
  const childSign = getSignedLiftSign(args.childSignedLift);
  const childUnit = getSignedLiftUnit(args.childSignedLift);
  const product = multiplyFanoUnits(args.sourceUnit, childUnit);
  const resultSign = combineSigns(product.sign, childSign);

  return buildSignedPrimalResult({
    productUnit: product.productUnit,
    sign: resultSign,
    sourceIdByCarrierUnit: args.sourceIdByCarrierUnit,
  });
}

function buildSignedPrimalResult(args: {
  productUnit: FanoUnitId;
  sign: FanoSign;
  sourceIdByCarrierUnit: Map<FanoUnitId, FanoPrimalSourceId>;
}): {
  signedResult: FanoSignedLift;
  resultRay: FanoCarrierRay;
  recoveredSourceId: FanoPrimalSourceId;
} {
  const recoveredSourceId = args.sourceIdByCarrierUnit.get(args.productUnit);

  if (!recoveredSourceId) {
    throw new Error(`No primal source carrier found for ${args.productUnit}`);
  }

  return {
    signedResult: `${args.sign}${args.productUnit}` as FanoSignedLift,
    resultRay: `ray:${args.productUnit}` as FanoCarrierRay,
    recoveredSourceId,
  };
}

function buildPrimalCarrierUnitBySourceId(
  c0Report: ReturnType<typeof buildFanoOctonionicCarrierTableV0Report>,
): Map<FanoPrimalSourceId, FanoUnitId> {
  return new Map(
    c0Report.primalCarrierRows.map((row) => [row.sourceId, row.carrierUnit]),
  );
}

function buildSourceIdByCarrierUnit(
  c0Report: ReturnType<typeof buildFanoOctonionicCarrierTableV0Report>,
): Map<FanoUnitId, FanoPrimalSourceId> {
  return new Map(
    c0Report.primalCarrierRows.map((row) => [row.carrierUnit, row.sourceId]),
  );
}

function buildParentSetByTokenId(
  c0Report: ReturnType<typeof buildFanoOctonionicCarrierTableV0Report>,
): Map<FanoPairTokenId, FanoSourcePair> {
  return new Map(
    c0Report.pairTokenRows.map((row) => [
      row.tokenId,
      row.unorderedParentSet,
    ]),
  );
}

function buildProjectedSourceSet(parentSet: FanoSourcePair): FanoSourcePair {
  return PRIMAL_SOURCE_ORDER.filter(
    (sourceId) => !parentSet.includes(sourceId),
  ) as unknown as FanoSourcePair;
}

function getActionSourceRole(
  parentSet: FanoSourcePair,
  actionSourceId: FanoPrimalSourceId,
): FanoLocalChannelActionSourceRole {
  return parentSet.includes(actionSourceId)
    ? 'parent-source'
    : 'projected-source';
}

function getOtherSourceId(
  sourceSet: FanoSourcePair,
  actionSourceId: FanoPrimalSourceId,
): FanoPrimalSourceId {
  const recoveredSourceId = sourceSet.find(
    (sourceId) => sourceId !== actionSourceId,
  );

  if (!recoveredSourceId) {
    throw new Error(`No recovery partner found for ${actionSourceId}`);
  }

  return recoveredSourceId;
}

function getParentSet(
  parentSetByTokenId: Map<FanoPairTokenId, FanoSourcePair>,
  tokenId: FanoPairTokenId,
): FanoSourcePair {
  const parentSet = parentSetByTokenId.get(tokenId);

  if (!parentSet) {
    throw new Error(`No parent set found for ${tokenId}`);
  }

  return parentSet;
}

function getPrimalCarrierUnit(
  primalCarrierUnitBySourceId: Map<FanoPrimalSourceId, FanoUnitId>,
  sourceId: FanoPrimalSourceId,
): FanoUnitId {
  const carrierUnit = primalCarrierUnitBySourceId.get(sourceId);

  if (!carrierUnit) {
    throw new Error(`No primal carrier unit found for ${sourceId}`);
  }

  return carrierUnit;
}

function getSignedLiftSign(signedLift: FanoSignedLift): FanoSign {
  return signedLift.slice(0, 1) as FanoSign;
}

function getSignedLiftUnit(signedLift: FanoSignedLift): FanoUnitId {
  return signedLift.slice(1) as FanoUnitId;
}

function combineSigns(left: FanoSign, right: FanoSign): FanoSign {
  return left === right ? '+' : '-';
}

function expectCount(
  issues: FanoOctonionicLocalChannelTableV0Issue[],
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
): FanoOctonionicLocalChannelTableV0Issue {
  return { code, message };
}
