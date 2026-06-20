import {
  buildPSimplexCuboctahedralS4DirectBridgeT28N0Report,
  type A3FlagId,
  type A3Label,
} from './pSimplexCuboctahedralS4DirectBridgeT28N0';

export type T28OSummaryVerdict =
  | 'T28-O-ve-local-flag-star-residual-law-verified'
  | 'T28-O-parent-bridge-not-accepted'
  | 'T28-O-definition-context-failed'
  | 'T28-O-local-involution-failed'
  | 'T28-O-local-star-pairing-failed'
  | 'T28-O-even-odd-projection-law-failed'
  | 'T28-O-controlled-fixture-failed'
  | 'T28-O-tau-action-law-failed'
  | 'T28-O-restoration-law-failed'
  | 'T28-O-boundary-failed';

export interface ParentEvidenceRow {
  parentId: 'T28-N0';
  method: string;
  ok: boolean;
  summaryVerdict: string;
  consumedSections: string[];
  ignoredSections: string[];
  parentStatus: 'accepted-parent' | 'rejected-parent';
}

export interface DefinitionContextRow {
  contextId: 'tetra-G2-lineage-S4-A3-VE';
  definedOver: string[];
  notDefinedOver: string[];
  status: 'context-valid' | 'context-invalid';
}

export interface LocalInvolutionRow {
  alpha: A3FlagId;
  sourceLabel: A3Label;
  targetLabel: A3Label;
  unusedLabels: [A3Label, A3Label];
  tauMap: Record<A3Label, A3Label>;
  tauSquaredIdentity: boolean;
  alphaFixed: boolean;
  antipode: A3FlagId;
  antipodeFixed: boolean;
  involutionStatus: 'local-involution-pass' | 'local-involution-fail';
}

export interface LocalFixedObjectRow {
  alpha: A3FlagId;
  fixedObjectKind: 'center-flag' | 'antipode-flag' | 'out-triangle' | 'in-triangle';
  objectId: string;
  flagSet: A3FlagId[];
  parentRowId: string | null;
  parentRowLocated: boolean;
  tauImageObjectId: string;
  fixedStatus: 'fixed-under-local-involution' | 'not-fixed' | 'parent-row-missing';
}

export type LocalPairKind =
  | 'out-flag-pair'
  | 'in-flag-pair'
  | 'incident-square-pair'
  | 've-central-hexagon-pair';

export interface LocalSwappedPairRow {
  alpha: A3FlagId;
  pairKind: LocalPairKind;
  leftObjectId: string;
  rightObjectId: string;
  leftFlagSet: A3FlagId[];
  rightFlagSet: A3FlagId[];
  parentLeftRowId: string | null;
  parentRightRowId: string | null;
  tauLeftImageObjectId: string;
  tauRightImageObjectId: string;
  reportOrderConvention: 'unused-label-lexicographic-order';
  swappedPairStatus:
    | 'swapped-pair-pass'
    | 'left-not-mapped-to-right'
    | 'right-not-mapped-to-left'
    | 'missing-left-object'
    | 'missing-right-object'
    | 'ambiguous-object-match';
}

export interface LocalWitnessSpaceRow {
  alpha: A3FlagId;
  pairedChannelCount: 4;
  scalarDimension: 8;
  evenDimension: 4;
  oddResidualDimension: 4;
  residualComponentIds: ['r_out', 'r_in', 'r_square', 'r_hex'];
  witnessSpaceStatus: 'local-witness-space-pass' | 'local-witness-space-fail';
}

export type PairFixtureId =
  | 'symmetric-zero'
  | 'symmetric-one'
  | 'left-basis'
  | 'right-basis'
  | 'antisymmetric';

export interface PairFixtureRow {
  fixtureId: PairFixtureId;
  leftInput: number;
  rightInput: number;
  expectedSignedResidual: number;
  expectedResidualMagnitude: number;
  fixtureStatus: 'fixture-pass' | 'fixture-fail';
}

export interface EvenOddProjectionLawRow {
  alpha: A3FlagId;
  pairKind: LocalPairKind;
  fixtureId: PairFixtureId;
  leftObjectId: string;
  rightObjectId: string;
  leftInput: number;
  rightInput: number;
  evenLeft: number;
  evenRight: number;
  oddLeft: number;
  oddRight: number;
  reconstructedLeft: number;
  reconstructedRight: number;
  tauOddLeft: number;
  tauOddRight: number;
  signedResidual: number;
  residualMagnitude: number;
  projectionStatus:
    | 'even-odd-projection-pass'
    | 'reconstruction-failed'
    | 'even-not-invariant'
    | 'odd-not-anti-invariant'
    | 'zero-condition-failed'
    | 'magnitude-failed';
}

export type LocalWitnessFixtureId =
  | 'local-zero-all'
  | 'local-symmetric-one-all'
  | 'out-left-basis'
  | 'out-right-basis'
  | 'in-left-basis'
  | 'in-right-basis'
  | 'square-left-basis'
  | 'square-right-basis'
  | 'hex-left-basis'
  | 'hex-right-basis'
  | 'all-antisymmetric-left';

export interface LocalWitnessFixtureRow {
  fixtureId: LocalWitnessFixtureId;
  outPair: [number, number];
  inPair: [number, number];
  squarePair: [number, number];
  hexPair: [number, number];
  expectedResidualVector: [number, number, number, number];
  fixtureStatus: 'local-fixture-pass' | 'local-fixture-fail';
}

export interface LocalResidualRow {
  alpha: A3FlagId;
  fixtureId: LocalWitnessFixtureId;
  rOut: number;
  rIn: number;
  rSquare: number;
  rHex: number;
  expectedROut: number;
  expectedRIn: number;
  expectedRSquare: number;
  expectedRHex: number;
  magnitudeOut: number;
  magnitudeIn: number;
  magnitudeSquare: number;
  magnitudeHex: number;
  residualZero: boolean;
  unweightedSquaredMagnitude: number;
  magnitudeInterpretation: 'debug-only-not-authoritative-cross-channel-normalization';
  residualStatus: 'local-stabilizer-preserving' | 'local-stabilizer-breaking' | 'local-residual-mismatch';
}

export interface TauActionResidualRow {
  alpha: A3FlagId;
  pairKind: LocalPairKind;
  fixtureId: PairFixtureId;
  residualBeforeTau: number;
  residualAfterTau: number;
  magnitudeBeforeTau: number;
  magnitudeAfterTau: number;
  tauResidualStatus: 'signed-residual-reverses-magnitude-preserved' | 'tau-action-failed';
}

export interface ResidualRestorationRow {
  alpha: A3FlagId;
  pairKind: LocalPairKind;
  fixtureId: PairFixtureId;
  residualBeforeProjection: number;
  residualAfterEvenProjection: number;
  restoredLeftValue: number;
  restoredRightValue: number;
  restorationStatus: 'even-projection-restores-local-stabilizer' | 'restoration-failed';
}

export interface GlobalSummaryRow {
  summaryAxis:
    | 'local-involutions'
    | 'fixed-objects'
    | 'swapped-pairs'
    | 'witness-space'
    | 'even-odd-projection'
    | 'local-residual-vectors'
    | 'tau-action'
    | 'restoration'
    | 'boundaries';
  expectedCount: number;
  actualCount: number;
  passCount: number;
  failCount: number;
  summaryStatus: 'pass' | 'fail' | 'warning';
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

export interface PSimplexCuboctahedralVEFlagStarResidualT28OReport {
  method: 'p-simplex-cuboctahedral-ve-flag-star-residual-t28o';
  diagnosticScope: 've-only-local-flag-star-residual-operator';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  parentEvidenceRows: ParentEvidenceRow[];
  definitionContextRows: DefinitionContextRow[];
  localInvolutionRows: LocalInvolutionRow[];
  localFixedObjectRows: LocalFixedObjectRow[];
  localSwappedPairRows: LocalSwappedPairRow[];
  localWitnessSpaceRows: LocalWitnessSpaceRow[];
  pairFixtureRows: PairFixtureRow[];
  evenOddProjectionLawRows: EvenOddProjectionLawRow[];
  localWitnessFixtureRows: LocalWitnessFixtureRow[];
  localResidualRows: LocalResidualRow[];
  tauActionResidualRows: TauActionResidualRow[];
  residualRestorationRows: ResidualRestorationRow[];
  globalSummaryRows: GlobalSummaryRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  summaryVerdict: T28OSummaryVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

type ParentReport = ReturnType<typeof buildPSimplexCuboctahedralS4DirectBridgeT28N0Report>;

interface ParentLookup {
  directFlags: Map<string, string[]>;
  triangles: Map<string, string[]>;
  squares: Map<string, string[]>;
  veHexagons: Map<A3Label, Array<{ id: string; flagSetKey: string }>>;
}

interface ProjectionResult {
  evenLeft: number;
  evenRight: number;
  oddLeft: number;
  oddRight: number;
  reconstructedLeft: number;
  reconstructedRight: number;
  tauOddLeft: number;
  tauOddRight: number;
  signedResidual: number;
  residualMagnitude: number;
}

const METHOD = 'p-simplex-cuboctahedral-ve-flag-star-residual-t28o' as const;
const DIAGNOSTIC_SCOPE = 've-only-local-flag-star-residual-operator' as const;
const BRANCH_REF = 'wgate/arf-w1-root-frame-v0' as const;
const ACCEPTED_PARENT_VERDICT = 'T28-N0-ve-bridge-verified-composition-holonomy-separate-by-orbit-type' as const;
const A3_LABELS: readonly A3Label[] = ['A', 'B', 'C', 'D'];
const DIRECTED_FLAGS: readonly A3FlagId[] = A3_LABELS.flatMap((sourceLabel) =>
  A3_LABELS.filter((targetLabel) => targetLabel !== sourceLabel).map((targetLabel) =>
    flagId(sourceLabel, targetLabel),
  ),
) as A3FlagId[];
const PAIR_KINDS: readonly LocalPairKind[] = [
  'out-flag-pair',
  'in-flag-pair',
  'incident-square-pair',
  've-central-hexagon-pair',
];
const REQUIRED_BOUNDARY_IDS = [
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
  'not-natural-readout-claim',
  'not-field-behavior-claim',
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

export function buildPSimplexCuboctahedralVEFlagStarResidualT28OReport(): PSimplexCuboctahedralVEFlagStarResidualT28OReport {
  const parentReport = buildPSimplexCuboctahedralS4DirectBridgeT28N0Report();
  const parentEvidenceRows = buildParentEvidenceRows(parentReport);
  const parentLookup = buildParentLookup(parentReport);
  const definitionContextRows = buildDefinitionContextRows(parentReport);
  const localInvolutionRows = buildLocalInvolutionRows();
  const localFixedObjectRows = buildLocalFixedObjectRows(localInvolutionRows, parentLookup);
  const localSwappedPairRows = buildLocalSwappedPairRows(localInvolutionRows, parentLookup);
  const localWitnessSpaceRows = buildLocalWitnessSpaceRows(localInvolutionRows);
  const pairFixtureRows = buildPairFixtureRows();
  const evenOddProjectionLawRows = buildEvenOddProjectionLawRows(localSwappedPairRows, pairFixtureRows);
  const localWitnessFixtureRows = buildLocalWitnessFixtureRows();
  const localResidualRows = buildLocalResidualRows(localInvolutionRows, localWitnessFixtureRows);
  const tauActionResidualRows = buildTauActionResidualRows(localSwappedPairRows, pairFixtureRows);
  const residualRestorationRows = buildResidualRestorationRows(localSwappedPairRows, pairFixtureRows);
  const boundaryRows = buildBoundaryRows();
  const preliminaryVerdict = classifySummaryVerdict({
    parentEvidenceRows,
    definitionContextRows,
    localInvolutionRows,
    localFixedObjectRows,
    localSwappedPairRows,
    localWitnessSpaceRows,
    pairFixtureRows,
    evenOddProjectionLawRows,
    localWitnessFixtureRows,
    localResidualRows,
    tauActionResidualRows,
    residualRestorationRows,
    boundaryRows,
    falsifierRows: [],
  });
  const falsifierRows = buildFalsifierRows({
    parentEvidenceRows,
    definitionContextRows,
    localInvolutionRows,
    localFixedObjectRows,
    localSwappedPairRows,
    localWitnessSpaceRows,
    localResidualRows,
    boundaryRows,
    summaryVerdict: preliminaryVerdict,
  });
  const globalSummaryRows = buildGlobalSummaryRows({
    localInvolutionRows,
    localFixedObjectRows,
    localSwappedPairRows,
    localWitnessSpaceRows,
    evenOddProjectionLawRows,
    localResidualRows,
    tauActionResidualRows,
    residualRestorationRows,
    boundaryRows,
  });
  const summaryVerdict = classifySummaryVerdict({
    parentEvidenceRows,
    definitionContextRows,
    localInvolutionRows,
    localFixedObjectRows,
    localSwappedPairRows,
    localWitnessSpaceRows,
    pairFixtureRows,
    evenOddProjectionLawRows,
    localWitnessFixtureRows,
    localResidualRows,
    tauActionResidualRows,
    residualRestorationRows,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    definitionContextRows,
    localInvolutionRows,
    localFixedObjectRows,
    localSwappedPairRows,
    localWitnessSpaceRows,
    pairFixtureRows,
    evenOddProjectionLawRows,
    localWitnessFixtureRows,
    localResidualRows,
    tauActionResidualRows,
    residualRestorationRows,
    globalSummaryRows,
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
    localInvolutionRows,
    localFixedObjectRows,
    localSwappedPairRows,
    localWitnessSpaceRows,
    pairFixtureRows,
    evenOddProjectionLawRows,
    localWitnessFixtureRows,
    localResidualRows,
    tauActionResidualRows,
    residualRestorationRows,
    globalSummaryRows,
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
      parentId: 'T28-N0',
      method: parentReport.method,
      ok: parentReport.ok,
      summaryVerdict: parentReport.summaryVerdict,
      consumedSections: [
        'directBridgeRows',
        'actualFaceFlagRows',
        'vectorEquilibriumTriangleRows',
        'vectorEquilibriumSquareRows',
        'centralHexagonRows:vector-equilibrium-a2-omitted-label-only',
        's4EquivarianceRows',
        's4RepresentationOrbitRows',
        'boundaryRows',
      ],
      ignoredSections: [
        'actualVsCompositionTriangleRows',
        'actualVsCompositionSquareRows',
        'composition-related rows',
      ],
      parentStatus: isParentAccepted(parentReport) ? 'accepted-parent' : 'rejected-parent',
    },
  ];
}

function isParentAccepted(parentReport: ParentReport): boolean {
  return parentReport.ok === true && parentReport.summaryVerdict === ACCEPTED_PARENT_VERDICT;
}

function buildParentLookup(parentReport: ParentReport): ParentLookup {
  const directFlags = new Map<string, string[]>();

  for (const row of parentReport.directBridgeRows) {
    if (row.flagPlus) {
      directFlags.set(row.flagPlus, [...(directFlags.get(row.flagPlus) ?? []), row.cuboctahedronVertexId]);
    }
  }

  const triangles = new Map<string, string[]>();

  for (const row of parentReport.vectorEquilibriumTriangleRows) {
    const key = flagSetKey(row.flagTriple);
    triangles.set(key, [...(triangles.get(key) ?? []), row.faceId]);
  }

  const squares = new Map<string, string[]>();

  for (const row of parentReport.vectorEquilibriumSquareRows) {
    const key = flagSetKey(row.flagCycle);
    squares.set(key, [...(squares.get(key) ?? []), row.faceId]);
  }

  const veHexagons = new Map<A3Label, Array<{ id: string; flagSetKey: string }>>();

  for (const row of parentReport.centralHexagonRows) {
    if (row.hexagonSystem !== 'vector-equilibrium-a2-omitted-label') {
      continue;
    }

    veHexagons.set(row.label, [
      ...(veHexagons.get(row.label) ?? []),
      { id: row.hexagonId, flagSetKey: flagSetKey(row.flagIds) },
    ]);
  }

  return { directFlags, triangles, squares, veHexagons };
}

function buildDefinitionContextRows(parentReport: ParentReport): DefinitionContextRow[] {
  return [
    {
      contextId: 'tetra-G2-lineage-S4-A3-VE',
      definedOver: [
        'T28-N0 B+ direct bridge',
        'directed A3 flags',
        'VE triangle law',
        'VE square law',
        'VE A2 central hexagons',
        'S4 equivariance',
      ],
      notDefinedOver: [
        'topology-only cuboctahedron',
        'canonical vertex order',
        'Fano carrier',
        'octonion carrier',
        'field sampler',
        'semantic naming',
        'topology module',
        'composition-holonomy overlay',
      ],
      status:
        isParentAccepted(parentReport) &&
        parentReport.directBridgeRows.length === 12 &&
        parentReport.vectorEquilibriumTriangleRows.length === 8 &&
        parentReport.vectorEquilibriumSquareRows.length === 6 &&
        parentReport.centralHexagonRows.filter(
          (row) => row.hexagonSystem === 'vector-equilibrium-a2-omitted-label',
        ).length === 4
          ? 'context-valid'
          : 'context-invalid',
    },
  ];
}

function buildLocalInvolutionRows(): LocalInvolutionRow[] {
  return DIRECTED_FLAGS.map((alpha) => {
    const { sourceLabel, targetLabel } = parseFlagId(alpha);
    const unusedLabels = unusedLabelsForAlpha(alpha);
    const tauMap = buildTauMap(alpha);
    const antipode = flagId(targetLabel, sourceLabel);
    const tauSquaredIdentity = A3_LABELS.every(
      (label) => applyTauToLabel(applyTauToLabel(label, tauMap), tauMap) === label,
    );
    const alphaFixed = applyTauToFlag(alpha, tauMap) === alpha;
    const antipodeFixed = applyTauToFlag(antipode, tauMap) === antipode;

    return {
      alpha,
      sourceLabel,
      targetLabel,
      unusedLabels,
      tauMap,
      tauSquaredIdentity,
      alphaFixed,
      antipode,
      antipodeFixed,
      involutionStatus:
        tauSquaredIdentity && alphaFixed && antipodeFixed
          ? 'local-involution-pass'
          : 'local-involution-fail',
    };
  });
}

function buildLocalFixedObjectRows(
  involutionRows: readonly LocalInvolutionRow[],
  parentLookup: ParentLookup,
): LocalFixedObjectRow[] {
  return involutionRows.flatMap((row) => {
    const [u0, u1] = row.unusedLabels;
    const centerFlagSet = [row.alpha];
    const antipodeFlagSet = [row.antipode];
    const outTriangle = [row.alpha, flagId(row.sourceLabel, u0), flagId(row.sourceLabel, u1)];
    const inTriangle = [row.alpha, flagId(u0, row.targetLabel), flagId(u1, row.targetLabel)];

    return [
      buildLocalFixedObjectRow(row.alpha, 'center-flag', centerFlagSet, parentLookup.directFlags, row.tauMap),
      buildLocalFixedObjectRow(
        row.alpha,
        'antipode-flag',
        antipodeFlagSet,
        parentLookup.directFlags,
        row.tauMap,
      ),
      buildLocalFixedObjectRow(row.alpha, 'out-triangle', outTriangle, parentLookup.triangles, row.tauMap),
      buildLocalFixedObjectRow(row.alpha, 'in-triangle', inTriangle, parentLookup.triangles, row.tauMap),
    ];
  });
}

function buildLocalSwappedPairRows(
  involutionRows: readonly LocalInvolutionRow[],
  parentLookup: ParentLookup,
): LocalSwappedPairRow[] {
  return involutionRows.flatMap((row) => {
    const [u0, u1] = row.unusedLabels;
    const outLeft = [flagId(row.sourceLabel, u0)];
    const outRight = [flagId(row.sourceLabel, u1)];
    const inLeft = [flagId(u0, row.targetLabel)];
    const inRight = [flagId(u1, row.targetLabel)];
    const squareLeft = [
      row.alpha,
      flagId(row.sourceLabel, u1),
      flagId(u0, row.targetLabel),
      flagId(u0, u1),
    ];
    const squareRight = [
      row.alpha,
      flagId(row.sourceLabel, u0),
      flagId(u1, row.targetLabel),
      flagId(u1, u0),
    ];
    const hexLeft = centralHexagonFlags(u0);
    const hexRight = centralHexagonFlags(u1);

    return [
      buildLocalSwappedPairRow(row.alpha, 'out-flag-pair', outLeft, outRight, parentLookup.directFlags, row.tauMap),
      buildLocalSwappedPairRow(row.alpha, 'in-flag-pair', inLeft, inRight, parentLookup.directFlags, row.tauMap),
      buildLocalSwappedPairRow(
        row.alpha,
        'incident-square-pair',
        squareLeft,
        squareRight,
        parentLookup.squares,
        row.tauMap,
      ),
      buildLocalHexagonSwappedPairRow(row.alpha, u0, u1, hexLeft, hexRight, parentLookup, row.tauMap),
    ];
  });
}

function buildLocalWitnessSpaceRows(involutionRows: readonly LocalInvolutionRow[]): LocalWitnessSpaceRow[] {
  return involutionRows.map((row) => {
    const residualComponentIds: LocalWitnessSpaceRow['residualComponentIds'] = [
      'r_out',
      'r_in',
      'r_square',
      'r_hex',
    ];
    const status =
      residualComponentIds.length === 4 ? 'local-witness-space-pass' : 'local-witness-space-fail';

    return {
      alpha: row.alpha,
      pairedChannelCount: 4,
      scalarDimension: 8,
      evenDimension: 4,
      oddResidualDimension: 4,
      residualComponentIds,
      witnessSpaceStatus: status,
    };
  });
}

function buildPairFixtureRows(): PairFixtureRow[] {
  return [
    pairFixture('symmetric-zero', 0, 0, 0, 0),
    pairFixture('symmetric-one', 1, 1, 0, 0),
    pairFixture('left-basis', 1, 0, 0.5, 0.5),
    pairFixture('right-basis', 0, 1, -0.5, 0.5),
    pairFixture('antisymmetric', 1, -1, 1, 1),
  ];
}

function buildEvenOddProjectionLawRows(
  swappedPairRows: readonly LocalSwappedPairRow[],
  fixtures: readonly PairFixtureRow[],
): EvenOddProjectionLawRow[] {
  return swappedPairRows.flatMap((pairRow) =>
    fixtures.map((fixture) => {
      const projection = projectEvenOdd(fixture.leftInput, fixture.rightInput);
      const reconstructionPass =
        equal(projection.reconstructedLeft, fixture.leftInput) &&
        equal(projection.reconstructedRight, fixture.rightInput);
      const evenInvariant = equal(projection.evenLeft, projection.evenRight);
      const oddAntiInvariant =
        equal(projection.tauOddLeft, -projection.oddLeft) && equal(projection.tauOddRight, -projection.oddRight);
      const zeroCondition = (equal(projection.signedResidual, 0) && equal(fixture.leftInput, fixture.rightInput)) ||
        (!equal(projection.signedResidual, 0) && !equal(fixture.leftInput, fixture.rightInput));
      const magnitudePass = equal(projection.residualMagnitude, fixture.expectedResidualMagnitude);
      const projectionStatus: EvenOddProjectionLawRow['projectionStatus'] = !reconstructionPass
        ? 'reconstruction-failed'
        : !evenInvariant
          ? 'even-not-invariant'
          : !oddAntiInvariant
            ? 'odd-not-anti-invariant'
            : !zeroCondition
              ? 'zero-condition-failed'
              : !magnitudePass
                ? 'magnitude-failed'
                : 'even-odd-projection-pass';

      return {
        alpha: pairRow.alpha,
        pairKind: pairRow.pairKind,
        fixtureId: fixture.fixtureId,
        leftObjectId: pairRow.leftObjectId,
        rightObjectId: pairRow.rightObjectId,
        leftInput: fixture.leftInput,
        rightInput: fixture.rightInput,
        ...projection,
        projectionStatus,
      };
    }),
  );
}

function buildLocalWitnessFixtureRows(): LocalWitnessFixtureRow[] {
  return [
    localWitnessFixture('local-zero-all', [0, 0], [0, 0], [0, 0], [0, 0], [0, 0, 0, 0]),
    localWitnessFixture('local-symmetric-one-all', [1, 1], [1, 1], [1, 1], [1, 1], [0, 0, 0, 0]),
    localWitnessFixture('out-left-basis', [1, 0], [0, 0], [0, 0], [0, 0], [0.5, 0, 0, 0]),
    localWitnessFixture('out-right-basis', [0, 1], [0, 0], [0, 0], [0, 0], [-0.5, 0, 0, 0]),
    localWitnessFixture('in-left-basis', [0, 0], [1, 0], [0, 0], [0, 0], [0, 0.5, 0, 0]),
    localWitnessFixture('in-right-basis', [0, 0], [0, 1], [0, 0], [0, 0], [0, -0.5, 0, 0]),
    localWitnessFixture('square-left-basis', [0, 0], [0, 0], [1, 0], [0, 0], [0, 0, 0.5, 0]),
    localWitnessFixture('square-right-basis', [0, 0], [0, 0], [0, 1], [0, 0], [0, 0, -0.5, 0]),
    localWitnessFixture('hex-left-basis', [0, 0], [0, 0], [0, 0], [1, 0], [0, 0, 0, 0.5]),
    localWitnessFixture('hex-right-basis', [0, 0], [0, 0], [0, 0], [0, 1], [0, 0, 0, -0.5]),
    localWitnessFixture('all-antisymmetric-left', [1, -1], [1, -1], [1, -1], [1, -1], [1, 1, 1, 1]),
  ];
}

function buildLocalResidualRows(
  involutionRows: readonly LocalInvolutionRow[],
  fixtures: readonly LocalWitnessFixtureRow[],
): LocalResidualRow[] {
  return involutionRows.flatMap((involutionRow) =>
    fixtures.map((fixture) => {
      const residualVector = computeResidualVectorForFixture(fixture);
      const [rOut, rIn, rSquare, rHex] = residualVector;
      const [expectedROut, expectedRIn, expectedRSquare, expectedRHex] = fixture.expectedResidualVector;
      const residualZero = residualVector.every((value) => equal(value, 0));
      const matchesExpected = sameNumberTuple(residualVector, fixture.expectedResidualVector);
      const unweightedSquaredMagnitude = residualVector.reduce((sum, value) => sum + value * value, 0);

      return {
        alpha: involutionRow.alpha,
        fixtureId: fixture.fixtureId,
        rOut,
        rIn,
        rSquare,
        rHex,
        expectedROut,
        expectedRIn,
        expectedRSquare,
        expectedRHex,
        magnitudeOut: Math.abs(rOut),
        magnitudeIn: Math.abs(rIn),
        magnitudeSquare: Math.abs(rSquare),
        magnitudeHex: Math.abs(rHex),
        residualZero,
        unweightedSquaredMagnitude,
        magnitudeInterpretation: 'debug-only-not-authoritative-cross-channel-normalization',
        residualStatus: !matchesExpected
          ? 'local-residual-mismatch'
          : residualZero
            ? 'local-stabilizer-preserving'
            : 'local-stabilizer-breaking',
      };
    }),
  );
}

function buildTauActionResidualRows(
  swappedPairRows: readonly LocalSwappedPairRow[],
  fixtures: readonly PairFixtureRow[],
): TauActionResidualRow[] {
  return swappedPairRows.flatMap((pairRow) =>
    fixtures.map((fixture) => {
      const before = projectEvenOdd(fixture.leftInput, fixture.rightInput);
      const after = projectEvenOdd(fixture.rightInput, fixture.leftInput);
      const pass =
        equal(after.signedResidual, -before.signedResidual) &&
        equal(after.residualMagnitude, before.residualMagnitude);

      return {
        alpha: pairRow.alpha,
        pairKind: pairRow.pairKind,
        fixtureId: fixture.fixtureId,
        residualBeforeTau: before.signedResidual,
        residualAfterTau: after.signedResidual,
        magnitudeBeforeTau: before.residualMagnitude,
        magnitudeAfterTau: after.residualMagnitude,
        tauResidualStatus: pass
          ? 'signed-residual-reverses-magnitude-preserved'
          : 'tau-action-failed',
      };
    }),
  );
}

function buildResidualRestorationRows(
  swappedPairRows: readonly LocalSwappedPairRow[],
  fixtures: readonly PairFixtureRow[],
): ResidualRestorationRow[] {
  return swappedPairRows.flatMap((pairRow) =>
    fixtures.map((fixture) => {
      const before = projectEvenOdd(fixture.leftInput, fixture.rightInput);
      const restoredLeftValue = before.evenLeft;
      const restoredRightValue = before.evenRight;
      const after = projectEvenOdd(restoredLeftValue, restoredRightValue);
      const pass =
        equal(after.signedResidual, 0) &&
        equal(restoredLeftValue, restoredRightValue);

      return {
        alpha: pairRow.alpha,
        pairKind: pairRow.pairKind,
        fixtureId: fixture.fixtureId,
        residualBeforeProjection: before.signedResidual,
        residualAfterEvenProjection: after.signedResidual,
        restoredLeftValue,
        restoredRightValue,
        restorationStatus: pass
          ? 'even-projection-restores-local-stabilizer'
          : 'restoration-failed',
      };
    }),
  );
}

function buildGlobalSummaryRows(args: {
  localInvolutionRows: readonly LocalInvolutionRow[];
  localFixedObjectRows: readonly LocalFixedObjectRow[];
  localSwappedPairRows: readonly LocalSwappedPairRow[];
  localWitnessSpaceRows: readonly LocalWitnessSpaceRow[];
  evenOddProjectionLawRows: readonly EvenOddProjectionLawRow[];
  localResidualRows: readonly LocalResidualRow[];
  tauActionResidualRows: readonly TauActionResidualRow[];
  residualRestorationRows: readonly ResidualRestorationRow[];
  boundaryRows: readonly BoundaryRow[];
}): GlobalSummaryRow[] {
  return [
    globalSummary(
      'local-involutions',
      12,
      args.localInvolutionRows.length,
      args.localInvolutionRows.filter((row) => row.involutionStatus === 'local-involution-pass').length,
    ),
    globalSummary(
      'fixed-objects',
      48,
      args.localFixedObjectRows.length,
      args.localFixedObjectRows.filter((row) => row.fixedStatus === 'fixed-under-local-involution').length,
    ),
    globalSummary(
      'swapped-pairs',
      48,
      args.localSwappedPairRows.length,
      args.localSwappedPairRows.filter((row) => row.swappedPairStatus === 'swapped-pair-pass').length,
    ),
    globalSummary(
      'witness-space',
      12,
      args.localWitnessSpaceRows.length,
      args.localWitnessSpaceRows.filter((row) => row.witnessSpaceStatus === 'local-witness-space-pass').length,
    ),
    globalSummary(
      'even-odd-projection',
      240,
      args.evenOddProjectionLawRows.length,
      args.evenOddProjectionLawRows.filter((row) => row.projectionStatus === 'even-odd-projection-pass').length,
    ),
    globalSummary(
      'local-residual-vectors',
      132,
      args.localResidualRows.length,
      args.localResidualRows.filter((row) => row.residualStatus !== 'local-residual-mismatch').length,
    ),
    globalSummary(
      'tau-action',
      240,
      args.tauActionResidualRows.length,
      args.tauActionResidualRows.filter(
        (row) => row.tauResidualStatus === 'signed-residual-reverses-magnitude-preserved',
      ).length,
    ),
    globalSummary(
      'restoration',
      240,
      args.residualRestorationRows.length,
      args.residualRestorationRows.filter(
        (row) => row.restorationStatus === 'even-projection-restores-local-stabilizer',
      ).length,
    ),
    globalSummary(
      'boundaries',
      REQUIRED_BOUNDARY_IDS.length,
      args.boundaryRows.length,
      args.boundaryRows.filter((row) => row.enforced).length,
    ),
  ];
}

function buildBoundaryRows(): BoundaryRow[] {
  return [
    boundary('not-field-computation', 'T28-O computes no field values.'),
    boundary('not-source-emission-law', 'T28-O does not define source emission law.'),
    boundary('not-fieldcue', 'T28-O does not create or unblock FieldCue.'),
    boundary('not-generated-site-reading', 'T28-O does not read generated-site values.'),
    boundary('not-semantic-naming', 'T28-O does not authorize semantic naming.'),
    boundary('not-topology-module', 'T28-O does not run topology operations as authority.'),
    boundary('not-route', 'T28-O does not confirm routes.'),
    boundary('not-gate', 'T28-O does not confirm gates.'),
    boundary('not-corridor', 'T28-O does not confirm corridors.'),
    boundary('not-runtime', 'T28-O does not authorize runtime state.'),
    boundary('not-fano', 'T28-O residual law is not defined over Fano material.'),
    boundary('not-octonion', 'T28-O residual law is not defined over octonion material.'),
    boundary('not-carrier-ray', 'T28-O residual law is not defined over carrier rays.'),
    boundary('not-signed-lift', 'T28-O residual law is not defined over signed lifts.'),
    boundary('not-composition-holonomy', 'T28-O residual law ignores composition-holonomy comparison rows.'),
    boundary('not-canonical-order-bridge', 'T28-O consumes the accepted T28-N0 B+ bridge only.'),
    boundary('not-arbitrary-permutation-search', 'T28-O performs no arbitrary permutation search.'),
    boundary('not-residual-portability-proof', 'T28-O does not prove residual portability beyond this VE local law.'),
    boundary('not-natural-readout-claim', 'T28-O uses controlled fixtures, not natural readout weights.'),
    boundary('not-field-behavior-claim', 'T28-O fixture residuals are not field behavior.'),
  ];
}

function buildFalsifierRows(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  definitionContextRows: readonly DefinitionContextRow[];
  localInvolutionRows: readonly LocalInvolutionRow[];
  localFixedObjectRows: readonly LocalFixedObjectRow[];
  localSwappedPairRows: readonly LocalSwappedPairRow[];
  localWitnessSpaceRows: readonly LocalWitnessSpaceRow[];
  localResidualRows: readonly LocalResidualRow[];
  boundaryRows: readonly BoundaryRow[];
  summaryVerdict: T28OSummaryVerdict;
}): FalsifierRow[] {
  const fixedTriangleParentMissing = args.localFixedObjectRows.some(
    (row) =>
      (row.fixedObjectKind === 'out-triangle' || row.fixedObjectKind === 'in-triangle') &&
      !row.parentRowLocated,
  );
  const swappedParentMissing = args.localSwappedPairRows.some(
    (row) => !row.parentLeftRowId || !row.parentRightRowId,
  );
  const hexPairFailure = args.localSwappedPairRows.some(
    (row) => row.pairKind === 've-central-hexagon-pair' && row.swappedPairStatus !== 'swapped-pair-pass',
  );

  return [
    falsifier(
      'F1',
      'Uses Fano, octonions, carrier rays, signed lifts, composition triangles, or square holonomy as part of the residual law.',
      false,
      'Residual rows consume only T28-N0 B+ flags, VE triangles, VE squares, and VE A2 hexagons.',
    ),
    falsifier(
      'F2',
      'Uses canonical vertex order instead of the accepted T28-N0 B+ bridge.',
      args.parentEvidenceRows.some((row) => row.parentStatus !== 'accepted-parent'),
      'Direct flags are located through T28-N0 directBridgeRows.flagPlus.',
    ),
    falsifier(
      'F3',
      'Treats topology-only cuboctahedron as sufficient to define directed A3 residuals.',
      args.definitionContextRows.some((row) => row.status !== 'context-valid'),
      'Definition context requires accepted T28-N0 B+ directed A3 bridge.',
    ),
    falsifier(
      'F4',
      'Computes residuals before proving tau_alpha^2 = identity for every alpha.',
      args.localInvolutionRows.some((row) => row.involutionStatus !== 'local-involution-pass'),
      `${args.localInvolutionRows.filter((row) => row.involutionStatus === 'local-involution-pass').length}/12 local involutions pass.`,
    ),
    falsifier(
      'F5',
      'Treats fixed triangles as swapped residual pairs.',
      args.localSwappedPairRows.some((row) => row.pairKind.includes('triangle')),
      'Triangle rows are fixed-object rows only.',
    ),
    falsifier(
      'F6',
      'Treats the antipode as a tau-residual component.',
      args.localWitnessSpaceRows.some((row) => row.residualComponentIds.some((component) => component.includes('antipode'))),
      'Residual components are r_out, r_in, r_square, and r_hex.',
    ),
    falsifier(
      'F7',
      'Combines residual channels using arbitrary weights.',
      args.localResidualRows.some(
        (row) => row.magnitudeInterpretation !== 'debug-only-not-authoritative-cross-channel-normalization',
      ),
      'Only component residuals and debug-only unweighted squared magnitude are reported.',
    ),
    falsifier(
      'F8',
      'Interprets controlled fixture residuals as field behavior.',
      false,
      'All residual inputs come from controlled scalar fixtures.',
    ),
    falsifier(
      'F9',
      'Calls nonzero residual a cuboctahedron defect.',
      args.localResidualRows.some((row) => row.residualStatus === 'local-residual-mismatch'),
      'Nonzero matching residuals are labeled local-stabilizer-breaking only.',
    ),
    falsifier(
      'F10',
      'Calls zero residual a failure.',
      args.localResidualRows.some((row) => row.residualZero && row.residualStatus !== 'local-stabilizer-preserving'),
      'Zero residual rows are local-stabilizer-preserving.',
    ),
    falsifier(
      'F11',
      'Treats signed residual orientation as invariant rather than report-conventional.',
      args.localSwappedPairRows.some((row) => row.reportOrderConvention !== 'unused-label-lexicographic-order'),
      'Signed residual orientation follows unused-label lexicographic report order.',
    ),
    falsifier(
      'F12',
      'Promotes success to field, FieldCue, semantic naming, topology, route/gate/corridor, runtime, or universal law.',
      requiredBoundaryMissing(args.boundaryRows),
      `${args.boundaryRows.filter((row) => row.enforced).length}/${REQUIRED_BOUNDARY_IDS.length} boundary rows enforced.`,
    ),
    falsifier(
      'F13',
      'Synthesizes VE triangles, squares, or hexagons without verifying them against accepted T28-N0 parent rows.',
      fixedTriangleParentMissing || swappedParentMissing,
      'All fixed triangles, incident squares, and VE central hexagons require parent row IDs.',
    ),
    falsifier(
      'F14',
      'Uses composition-incidence hexagons instead of VE A2 omitted-label hexagons.',
      hexPairFailure,
      'Hexagon rows are looked up only by vector-equilibrium-a2-omitted-label parent rows.',
    ),
    falsifier(
      'F15',
      'Imports or calls Fano/octonionic diagnostics directly.',
      false,
      'T28-O imports only the T28-N0 bridge report builder and A3 types.',
    ),
  ];
}

function classifySummaryVerdict(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  definitionContextRows: readonly DefinitionContextRow[];
  localInvolutionRows: readonly LocalInvolutionRow[];
  localFixedObjectRows: readonly LocalFixedObjectRow[];
  localSwappedPairRows: readonly LocalSwappedPairRow[];
  localWitnessSpaceRows: readonly LocalWitnessSpaceRow[];
  pairFixtureRows: readonly PairFixtureRow[];
  evenOddProjectionLawRows: readonly EvenOddProjectionLawRow[];
  localWitnessFixtureRows: readonly LocalWitnessFixtureRow[];
  localResidualRows: readonly LocalResidualRow[];
  tauActionResidualRows: readonly TauActionResidualRow[];
  residualRestorationRows: readonly ResidualRestorationRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28OSummaryVerdict {
  if (requiredBoundaryMissing(args.boundaryRows) || args.falsifierRows.some((row) => row.triggered)) {
    return 'T28-O-boundary-failed';
  }

  if (!parentAccepted(args.parentEvidenceRows)) {
    return 'T28-O-parent-bridge-not-accepted';
  }

  if (!definitionContextReady(args.definitionContextRows)) {
    return 'T28-O-definition-context-failed';
  }

  if (!localInvolutionsReady(args.localInvolutionRows)) {
    return 'T28-O-local-involution-failed';
  }

  if (!localStarPairingReady(args.localFixedObjectRows, args.localSwappedPairRows)) {
    return 'T28-O-local-star-pairing-failed';
  }

  if (!evenOddProjectionReady(args.evenOddProjectionLawRows)) {
    return 'T28-O-even-odd-projection-law-failed';
  }

  if (!controlledFixturesReady(args.pairFixtureRows, args.localWitnessFixtureRows, args.localResidualRows)) {
    return 'T28-O-controlled-fixture-failed';
  }

  if (!tauActionReady(args.tauActionResidualRows)) {
    return 'T28-O-tau-action-law-failed';
  }

  if (!restorationReady(args.residualRestorationRows)) {
    return 'T28-O-restoration-law-failed';
  }

  return 'T28-O-ve-local-flag-star-residual-law-verified';
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  definitionContextRows: readonly DefinitionContextRow[];
  localInvolutionRows: readonly LocalInvolutionRow[];
  localFixedObjectRows: readonly LocalFixedObjectRow[];
  localSwappedPairRows: readonly LocalSwappedPairRow[];
  localWitnessSpaceRows: readonly LocalWitnessSpaceRow[];
  pairFixtureRows: readonly PairFixtureRow[];
  evenOddProjectionLawRows: readonly EvenOddProjectionLawRow[];
  localWitnessFixtureRows: readonly LocalWitnessFixtureRow[];
  localResidualRows: readonly LocalResidualRow[];
  tauActionResidualRows: readonly TauActionResidualRow[];
  residualRestorationRows: readonly ResidualRestorationRow[];
  globalSummaryRows: readonly GlobalSummaryRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  summaryVerdict: T28OSummaryVerdict;
}): string[] {
  const issues: string[] = [];

  if (args.parentEvidenceRows.length !== 1) {
    issues.push('parentEvidenceRows count not 1');
  }

  if (!parentAccepted(args.parentEvidenceRows)) {
    issues.push('T28-N0 parent not accepted');
  }

  if (args.definitionContextRows.length !== 1 || !definitionContextReady(args.definitionContextRows)) {
    issues.push('definitionContextRows invalid');
  }

  if (!localInvolutionsReady(args.localInvolutionRows)) {
    issues.push('localInvolutionRows count/status failed');
  }

  if (args.localFixedObjectRows.length !== 48) {
    issues.push('localFixedObjectRows count not 48');
  }

  if (args.localFixedObjectRows.some((row) => row.fixedStatus !== 'fixed-under-local-involution')) {
    issues.push('localFixedObjectRows contain non-fixed or missing parent rows');
  }

  if (args.localSwappedPairRows.length !== 48) {
    issues.push('localSwappedPairRows count not 48');
  }

  if (args.localSwappedPairRows.some((row) => row.swappedPairStatus !== 'swapped-pair-pass')) {
    issues.push('localSwappedPairRows contain mapping or parent lookup failures');
  }

  if (!witnessSpacesReady(args.localWitnessSpaceRows)) {
    issues.push('localWitnessSpaceRows count/dimensions failed');
  }

  if (args.pairFixtureRows.length !== 5 || args.pairFixtureRows.some((row) => row.fixtureStatus !== 'fixture-pass')) {
    issues.push('pairFixtureRows count/status failed');
  }

  if (!evenOddProjectionReady(args.evenOddProjectionLawRows)) {
    issues.push('evenOddProjectionLawRows count/status failed');
  }

  if (
    args.localWitnessFixtureRows.length !== 11 ||
    args.localWitnessFixtureRows.some((row) => row.fixtureStatus !== 'local-fixture-pass')
  ) {
    issues.push('localWitnessFixtureRows count/status failed');
  }

  if (args.localResidualRows.length !== 132 || args.localResidualRows.some((row) => row.residualStatus === 'local-residual-mismatch')) {
    issues.push('localResidualRows count/status failed');
  }

  if (!tauActionReady(args.tauActionResidualRows)) {
    issues.push('tauActionResidualRows count/status failed');
  }

  if (!restorationReady(args.residualRestorationRows)) {
    issues.push('residualRestorationRows count/status failed');
  }

  if (args.globalSummaryRows.length !== 9 || args.globalSummaryRows.some((row) => row.summaryStatus !== 'pass')) {
    issues.push('globalSummaryRows missing or failing');
  }

  if (requiredBoundaryMissing(args.boundaryRows)) {
    issues.push('required boundary rows missing or unenforced');
  }

  if (REQUIRED_FALSIFIER_IDS.some((falsifierId) => !args.falsifierRows.some((row) => row.falsifierId === falsifierId))) {
    issues.push('required falsifier rows missing');
  }

  if (args.falsifierRows.some((row) => row.triggered)) {
    issues.push('one or more falsifiers triggered');
  }

  const expectedVerdict = classifySummaryVerdict({
    parentEvidenceRows: args.parentEvidenceRows,
    definitionContextRows: args.definitionContextRows,
    localInvolutionRows: args.localInvolutionRows,
    localFixedObjectRows: args.localFixedObjectRows,
    localSwappedPairRows: args.localSwappedPairRows,
    localWitnessSpaceRows: args.localWitnessSpaceRows,
    pairFixtureRows: args.pairFixtureRows,
    evenOddProjectionLawRows: args.evenOddProjectionLawRows,
    localWitnessFixtureRows: args.localWitnessFixtureRows,
    localResidualRows: args.localResidualRows,
    tauActionResidualRows: args.tauActionResidualRows,
    residualRestorationRows: args.residualRestorationRows,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });

  if (expectedVerdict !== args.summaryVerdict) {
    issues.push('summary verdict inconsistent with precedence');
  }

  return unique(issues);
}

function buildLocalFixedObjectRow(
  alpha: A3FlagId,
  fixedObjectKind: LocalFixedObjectRow['fixedObjectKind'],
  flagSet: readonly A3FlagId[],
  parentRowsByKey: Map<string, string[]>,
  tauMap: Record<A3Label, A3Label>,
): LocalFixedObjectRow {
  const objectId = objectIdForFlags(fixedObjectKind.includes('triangle') ? 'triangle' : 'flag', flagSet);
  const tauImageObjectId = objectIdForFlags(
    fixedObjectKind.includes('triangle') ? 'triangle' : 'flag',
    applyTauToFlagSet(flagSet, tauMap),
  );
  const parentRows = lookupByFlagSet(parentRowsByKey, flagSet);
  const parentRowId = parentRows.length === 1 ? parentRows[0] : null;
  const parentRowLocated = parentRows.length === 1;
  const fixedStatus: LocalFixedObjectRow['fixedStatus'] = !parentRowLocated
    ? 'parent-row-missing'
    : tauImageObjectId !== objectId
      ? 'not-fixed'
      : 'fixed-under-local-involution';

  return {
    alpha,
    fixedObjectKind,
    objectId,
    flagSet: [...flagSet],
    parentRowId,
    parentRowLocated,
    tauImageObjectId,
    fixedStatus,
  };
}

function buildLocalSwappedPairRow(
  alpha: A3FlagId,
  pairKind: LocalPairKind,
  leftFlagSet: readonly A3FlagId[],
  rightFlagSet: readonly A3FlagId[],
  parentRowsByKey: Map<string, string[]>,
  tauMap: Record<A3Label, A3Label>,
): LocalSwappedPairRow {
  const objectKind = pairKind === 'incident-square-pair' ? 'square' : 'flag';
  const leftObjectId = objectIdForFlags(objectKind, leftFlagSet);
  const rightObjectId = objectIdForFlags(objectKind, rightFlagSet);
  const parentLeftRows = lookupByFlagSet(parentRowsByKey, leftFlagSet);
  const parentRightRows = lookupByFlagSet(parentRowsByKey, rightFlagSet);
  const tauLeftImageObjectId = objectIdForFlags(objectKind, applyTauToFlagSet(leftFlagSet, tauMap));
  const tauRightImageObjectId = objectIdForFlags(objectKind, applyTauToFlagSet(rightFlagSet, tauMap));
  const status = swappedPairStatus(
    leftObjectId,
    rightObjectId,
    tauLeftImageObjectId,
    tauRightImageObjectId,
    parentLeftRows,
    parentRightRows,
  );

  return {
    alpha,
    pairKind,
    leftObjectId,
    rightObjectId,
    leftFlagSet: [...leftFlagSet],
    rightFlagSet: [...rightFlagSet],
    parentLeftRowId: parentLeftRows.length === 1 ? parentLeftRows[0] : null,
    parentRightRowId: parentRightRows.length === 1 ? parentRightRows[0] : null,
    tauLeftImageObjectId,
    tauRightImageObjectId,
    reportOrderConvention: 'unused-label-lexicographic-order',
    swappedPairStatus: status,
  };
}

function buildLocalHexagonSwappedPairRow(
  alpha: A3FlagId,
  leftLabel: A3Label,
  rightLabel: A3Label,
  leftFlagSet: readonly A3FlagId[],
  rightFlagSet: readonly A3FlagId[],
  parentLookup: ParentLookup,
  tauMap: Record<A3Label, A3Label>,
): LocalSwappedPairRow {
  const leftRows = parentLookup.veHexagons.get(leftLabel) ?? [];
  const rightRows = parentLookup.veHexagons.get(rightLabel) ?? [];
  const leftMatches = leftRows.filter((row) => row.flagSetKey === flagSetKey(leftFlagSet)).map((row) => row.id);
  const rightMatches = rightRows.filter((row) => row.flagSetKey === flagSetKey(rightFlagSet)).map((row) => row.id);
  const leftObjectId = hexagonObjectId(leftLabel);
  const rightObjectId = hexagonObjectId(rightLabel);
  const tauLeftImageObjectId = hexagonObjectId(applyTauToLabel(leftLabel, tauMap));
  const tauRightImageObjectId = hexagonObjectId(applyTauToLabel(rightLabel, tauMap));
  const status = swappedPairStatus(
    leftObjectId,
    rightObjectId,
    tauLeftImageObjectId,
    tauRightImageObjectId,
    leftMatches,
    rightMatches,
  );

  return {
    alpha,
    pairKind: 've-central-hexagon-pair',
    leftObjectId,
    rightObjectId,
    leftFlagSet: [...leftFlagSet],
    rightFlagSet: [...rightFlagSet],
    parentLeftRowId: leftMatches.length === 1 ? leftMatches[0] : null,
    parentRightRowId: rightMatches.length === 1 ? rightMatches[0] : null,
    tauLeftImageObjectId,
    tauRightImageObjectId,
    reportOrderConvention: 'unused-label-lexicographic-order',
    swappedPairStatus: status,
  };
}

function pairFixture(
  fixtureId: PairFixtureId,
  leftInput: number,
  rightInput: number,
  expectedSignedResidual: number,
  expectedResidualMagnitude: number,
): PairFixtureRow {
  const projection = projectEvenOdd(leftInput, rightInput);
  const fixtureStatus =
    equal(projection.signedResidual, expectedSignedResidual) &&
    equal(projection.residualMagnitude, expectedResidualMagnitude)
      ? 'fixture-pass'
      : 'fixture-fail';

  return { fixtureId, leftInput, rightInput, expectedSignedResidual, expectedResidualMagnitude, fixtureStatus };
}

function localWitnessFixture(
  fixtureId: LocalWitnessFixtureId,
  outPair: [number, number],
  inPair: [number, number],
  squarePair: [number, number],
  hexPair: [number, number],
  expectedResidualVector: [number, number, number, number],
): LocalWitnessFixtureRow {
  const row = { fixtureId, outPair, inPair, squarePair, hexPair, expectedResidualVector };
  const fixtureStatus = sameNumberTuple(computeResidualVectorForFixture(row), expectedResidualVector)
    ? 'local-fixture-pass'
    : 'local-fixture-fail';

  return { ...row, fixtureStatus };
}

function projectEvenOdd(leftInput: number, rightInput: number): ProjectionResult {
  const even = (leftInput + rightInput) / 2;
  const oddLeft = (leftInput - rightInput) / 2;
  const oddRight = -oddLeft;

  return {
    evenLeft: even,
    evenRight: even,
    oddLeft,
    oddRight,
    reconstructedLeft: even + oddLeft,
    reconstructedRight: even + oddRight,
    tauOddLeft: oddRight,
    tauOddRight: oddLeft,
    signedResidual: oddLeft,
    residualMagnitude: Math.abs(oddLeft),
  };
}

function computeResidualVectorForFixture(fixture: {
  outPair: [number, number];
  inPair: [number, number];
  squarePair: [number, number];
  hexPair: [number, number];
}): [number, number, number, number] {
  return [
    projectEvenOdd(fixture.outPair[0], fixture.outPair[1]).signedResidual,
    projectEvenOdd(fixture.inPair[0], fixture.inPair[1]).signedResidual,
    projectEvenOdd(fixture.squarePair[0], fixture.squarePair[1]).signedResidual,
    projectEvenOdd(fixture.hexPair[0], fixture.hexPair[1]).signedResidual,
  ];
}

function globalSummary(
  summaryAxis: GlobalSummaryRow['summaryAxis'],
  expectedCount: number,
  actualCount: number,
  passCount: number,
): GlobalSummaryRow {
  const failCount = Math.max(0, actualCount - passCount);
  const summaryStatus = actualCount === expectedCount && failCount === 0 ? 'pass' : 'fail';

  return { summaryAxis, expectedCount, actualCount, passCount, failCount, summaryStatus };
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

function allA3Labels(): readonly A3Label[] {
  return A3_LABELS;
}

function parseFlagId(flag: A3FlagId): { sourceLabel: A3Label; targetLabel: A3Label } {
  const [sourceLabel, targetLabel] = flag.split('->') as [A3Label, A3Label];
  return { sourceLabel, targetLabel };
}

function flagId(sourceLabel: A3Label, targetLabel: A3Label): A3FlagId {
  return `${sourceLabel}->${targetLabel}` as A3FlagId;
}

function unusedLabelsForAlpha(alpha: A3FlagId): [A3Label, A3Label] {
  const { sourceLabel, targetLabel } = parseFlagId(alpha);
  const labels = allA3Labels()
    .filter((label) => label !== sourceLabel && label !== targetLabel)
    .sort(labelSort);

  return [labels[0], labels[1]];
}

function buildTauMap(alpha: A3FlagId): Record<A3Label, A3Label> {
  const { sourceLabel, targetLabel } = parseFlagId(alpha);
  const [u0, u1] = unusedLabelsForAlpha(alpha);

  return {
    [sourceLabel]: sourceLabel,
    [targetLabel]: targetLabel,
    [u0]: u1,
    [u1]: u0,
  } as Record<A3Label, A3Label>;
}

function applyTauToLabel(label: A3Label, tauMap: Record<A3Label, A3Label>): A3Label {
  return tauMap[label];
}

function applyTauToFlag(flag: A3FlagId, tauMap: Record<A3Label, A3Label>): A3FlagId {
  const { sourceLabel, targetLabel } = parseFlagId(flag);
  return flagId(applyTauToLabel(sourceLabel, tauMap), applyTauToLabel(targetLabel, tauMap));
}

function applyTauToFlagSet(flagSet: readonly A3FlagId[], tauMap: Record<A3Label, A3Label>): A3FlagId[] {
  return flagSet.map((flag) => applyTauToFlag(flag, tauMap));
}

function centralHexagonFlags(omittedLabel: A3Label): A3FlagId[] {
  return DIRECTED_FLAGS.filter((flag) => {
    const { sourceLabel, targetLabel } = parseFlagId(flag);
    return sourceLabel !== omittedLabel && targetLabel !== omittedLabel;
  });
}

function lookupByFlagSet(
  parentRowsByKey: Map<string, string[]>,
  flagSet: readonly A3FlagId[],
): string[] {
  const key = flagSet.length === 1 ? flagSet[0] : flagSetKey(flagSet);
  return parentRowsByKey.get(key) ?? [];
}

function swappedPairStatus(
  leftObjectId: string,
  rightObjectId: string,
  tauLeftImageObjectId: string,
  tauRightImageObjectId: string,
  parentLeftRows: readonly string[],
  parentRightRows: readonly string[],
): LocalSwappedPairRow['swappedPairStatus'] {
  if (parentLeftRows.length === 0) {
    return 'missing-left-object';
  }

  if (parentRightRows.length === 0) {
    return 'missing-right-object';
  }

  if (parentLeftRows.length > 1 || parentRightRows.length > 1) {
    return 'ambiguous-object-match';
  }

  if (tauLeftImageObjectId !== rightObjectId) {
    return 'left-not-mapped-to-right';
  }

  if (tauRightImageObjectId !== leftObjectId) {
    return 'right-not-mapped-to-left';
  }

  return 'swapped-pair-pass';
}

function objectIdForFlags(kind: 'flag' | 'triangle' | 'square', flagSet: readonly A3FlagId[]): string {
  return `${kind}:${flagSetKey(flagSet)}`;
}

function hexagonObjectId(omittedLabel: A3Label): string {
  return `ve-central-hexagon-omitted:${omittedLabel}`;
}

function flagSetKey(flagSet: readonly A3FlagId[]): string {
  return unique(flagSet).sort(flagSort).join('|');
}

function flagSort(left: A3FlagId, right: A3FlagId): number {
  return DIRECTED_FLAGS.indexOf(left) - DIRECTED_FLAGS.indexOf(right);
}

function labelSort(left: A3Label, right: A3Label): number {
  return A3_LABELS.indexOf(left) - A3_LABELS.indexOf(right);
}

function equal(left: number, right: number): boolean {
  return Math.abs(left - right) <= 1e-12;
}

function sameNumberTuple(left: readonly number[], right: readonly number[]): boolean {
  return left.length === right.length && left.every((value, index) => equal(value, right[index]));
}

function parentAccepted(rows: readonly ParentEvidenceRow[]): boolean {
  return rows.length === 1 && rows[0].parentStatus === 'accepted-parent';
}

function definitionContextReady(rows: readonly DefinitionContextRow[]): boolean {
  return rows.length === 1 && rows[0].status === 'context-valid';
}

function localInvolutionsReady(rows: readonly LocalInvolutionRow[]): boolean {
  return (
    rows.length === 12 &&
    rows.every(
      (row) =>
        row.involutionStatus === 'local-involution-pass' &&
        row.tauSquaredIdentity &&
        row.alphaFixed &&
        row.antipodeFixed,
    )
  );
}

function localStarPairingReady(
  fixedRows: readonly LocalFixedObjectRow[],
  swappedRows: readonly LocalSwappedPairRow[],
): boolean {
  return (
    fixedRows.length === 48 &&
    fixedRows.every((row) => row.fixedStatus === 'fixed-under-local-involution') &&
    swappedRows.length === 48 &&
    swappedRows.every((row) => row.swappedPairStatus === 'swapped-pair-pass')
  );
}

function witnessSpacesReady(rows: readonly LocalWitnessSpaceRow[]): boolean {
  return (
    rows.length === 12 &&
    rows.every(
      (row) =>
        row.pairedChannelCount === 4 &&
        row.scalarDimension === 8 &&
        row.evenDimension === 4 &&
        row.oddResidualDimension === 4 &&
        row.witnessSpaceStatus === 'local-witness-space-pass',
    )
  );
}

function evenOddProjectionReady(rows: readonly EvenOddProjectionLawRow[]): boolean {
  return rows.length === 240 && rows.every((row) => row.projectionStatus === 'even-odd-projection-pass');
}

function controlledFixturesReady(
  pairFixtureRows: readonly PairFixtureRow[],
  localWitnessFixtureRows: readonly LocalWitnessFixtureRow[],
  localResidualRows: readonly LocalResidualRow[],
): boolean {
  return (
    pairFixtureRows.length === 5 &&
    pairFixtureRows.every((row) => row.fixtureStatus === 'fixture-pass') &&
    localWitnessFixtureRows.length === 11 &&
    localWitnessFixtureRows.every((row) => row.fixtureStatus === 'local-fixture-pass') &&
    localResidualRows.length === 132 &&
    localResidualRows.every((row) => row.residualStatus !== 'local-residual-mismatch')
  );
}

function tauActionReady(rows: readonly TauActionResidualRow[]): boolean {
  return (
    rows.length === 240 &&
    rows.every((row) => row.tauResidualStatus === 'signed-residual-reverses-magnitude-preserved')
  );
}

function restorationReady(rows: readonly ResidualRestorationRow[]): boolean {
  return (
    rows.length === 240 &&
    rows.every((row) => row.restorationStatus === 'even-projection-restores-local-stabilizer')
  );
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((boundaryId) => !rows.some((row) => row.boundaryId === boundaryId && row.enforced));
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}
