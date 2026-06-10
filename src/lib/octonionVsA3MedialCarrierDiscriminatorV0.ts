import { createSeedShape } from '../data/seeds';
import { applyAmboDissection, canApplyAmboDissection } from './ambo';

export type OctonionVsA3HypothesisId = 'H1' | 'H2' | 'H3';
export type A3PrimalLabel = 'A' | 'B' | 'C' | 'D';
export type FanoUnitId = 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7';
export type SignedBasisUnitId = '1' | FanoUnitId;
export type FanoSign = '+' | '-';
export type A3FlagId = `${A3PrimalLabel}->${A3PrimalLabel}`;

export interface A3MedialFlagRow {
  flagId: A3FlagId;
  sharedPrimalVertex: A3PrimalLabel;
  omittedPrimalVertex: A3PrimalLabel;
  rootCoordinate: Record<A3PrimalLabel, -1 | 0 | 1>;
  status: 'a3-s4-medial-flag-token';
}

export interface SignedFanoLiftRow {
  flagId: A3FlagId;
  orderedPrimalPair: readonly [A3PrimalLabel, A3PrimalLabel];
  signedLift: string;
  carrierRay: string;
  productUnit: FanoUnitId;
  sign: FanoSign;
  quotientIdentityStatus: 'medial-flag-identity-not-preserved-by-bare-signed-lift';
}

export interface TriangleClosureRow {
  triangleId: string;
  orderedProductId: string;
  leftFlagId: A3FlagId;
  rightFlagId: A3FlagId;
  targetFlagId: A3FlagId;
  productSignedLift: string;
  targetCarrierRay: string;
  closureStatus: 'pass' | 'fail';
}

export interface SquareHolonomyRow {
  squareCycleId: string;
  squareHolonomyVariantId: string;
  orientationVariant:
    | 'forward-rotation-0'
    | 'forward-rotation-1'
    | 'forward-rotation-2'
    | 'forward-rotation-3'
    | 'reverse-rotation-0'
    | 'reverse-rotation-1'
    | 'reverse-rotation-2'
    | 'reverse-rotation-3';
  flagCycle: A3FlagId[];
  signedLiftCycle: string[];
  leftAssociatedProduct: string;
  holonomyStatus: 'pass' | 'fail';
}

export interface FanoCompleteQuadrangleRow {
  quadrangleId: string;
  units: FanoUnitId[];
  labelingCount: 24;
  quotientLossAnomalyCount: number;
  triangleClosureFailureCount: number;
  squareHolonomyFailureCount: number;
  flagRecoveryFailureCount: number;
}

export interface RepoSeedBridgeRow {
  seedKey: 'tetrahedron' | 'octahedron' | 'cube';
  seedExists: boolean;
  edgeCount: number;
  expectedEdgeCount: number;
  edgeCountStatus: 'pass' | 'fail';
  amboSupportStatus: 'supported' | 'not-supported';
}

export interface HypothesisVerdictRow {
  hypothesisId: OctonionVsA3HypothesisId;
  verdict: 'rejected' | 'live' | 'unresolved';
  reason: string;
}

export interface OctonionVsA3MedialCarrierDiscriminatorV0Summary {
  method: 'octonion-vs-a3-medial-carrier-discriminator-v0';
  diagnosticScope: 'tetra-octa-cube-medial-hub-carrier-discriminator-only';
  candidateStatus: 'local-hub-candidate-not-ratified';
  flagCount: number;
  distinctFlagCount: number;
  flagRecoveryStatus: 'pass' | 'fail';
  flagDiscriminatorStatus: 'non-discriminating';
  signedLiftFlagCount: number;
  distinctSignedLiftCount: number;
  signedLiftQuotientLossStatus: 'pass-as-warning' | 'fail';
  signedLiftDiscriminatesAgainst: 'H1';
  signedLiftQuotientLossExplanation: 'bare signed octonion unit is too coarse because it loses medial flag identity';
  canonicalTriangleCount: number;
  canonicalTriangleOrderedProductCount: number;
  canonicalTriangleClosurePassCount: number;
  canonicalTriangleClosureFailCount: number;
  triangleClosureStatus: 'pass' | 'fail';
  triangleDiscriminatorStatus: 'discriminating';
  canonicalSquareCycleCount: number;
  canonicalSquareHolonomyVariantCount: number;
  squareHolonomyPassCount: number;
  squareHolonomyFailCount: number;
  squareHolonomyStatus: 'pass' | 'fail';
  squareDiscriminatorStatus: 'discriminating';
  fanoCompleteQuadrangleCount: number;
  quadrangleLabelingCount: number;
  gaugeFlagRecoveryFailureCount: number;
  gaugeTriangleClosureFailureCount: number;
  gaugeSquareHolonomyFailureCount: number;
  gaugeQuotientLossAnomalyCount: number;
  gaugeRobustnessStatus: 'pass' | 'fail';
  tetraSeedStatus: 'pass' | 'fail';
  octaSeedStatus: 'pass' | 'fail';
  cubeSeedStatus: 'pass' | 'fail';
  tetraAmboSupportStatus: 'supported' | 'not-supported';
  octaAmboSupportStatus: 'supported' | 'not-supported';
  cubeAmboSupportStatus: 'supported' | 'not-supported';
  cuboctahedronBridgeStatus:
    | 'verified-via-octahedron-ambo-core'
    | 'mathematical-expectation-repo-execution-unresolved'
    | 'failed';
  cubeG1CuboctahedronBridgeStatus:
    | 'verified-via-cube-ambo-core'
    | 'mathematical-expectation-repo-execution-unresolved'
    | 'failed';
  tetraG2CoreCuboctahedronBridgeStatus:
    | 'verified-via-tetra-g1-octa-core-ambo'
    | 'mathematical-expectation-repo-execution-unresolved'
    | 'failed';
  cubeG1MedialHubStatus: 'cube-g1-as-cuboctahedral-medial-object-via-dual-provenance-only';
  cubePrimalCarrierAssignmentStatus: 'not-solved-independent-cube-primal-sourcehood';
  generalFieldLawStatus: 'not-proven';
  universalOctonionStatus: 'not-proven';
  cubePrimalSourcehoodStatus: 'not-proven';
  fieldCueUnblockStatus: 'not-authorized';
  s0Status: 'not-authorized';
  uiStatus: 'no-ui';
  shapeMutationStatus: 'no-shape-mutation';
  packetWriteStatus: 'no-packet-write';
}

export interface OctonionVsA3MedialCarrierDiscriminatorV0Issue {
  code: string;
  message: string;
}

export interface OctonionVsA3MedialCarrierDiscriminatorV0Report {
  method: 'octonion-vs-a3-medial-carrier-discriminator-v0';
  diagnosticScope: 'tetra-octa-cube-medial-hub-carrier-discriminator-only';
  candidateStatus: 'local-hub-candidate-not-ratified';
  primalCarrierAssignment: Record<A3PrimalLabel, FanoUnitId>;
  flagRows: A3MedialFlagRow[];
  signedLiftRows: SignedFanoLiftRow[];
  triangleClosureRows: TriangleClosureRow[];
  squareHolonomyRows: SquareHolonomyRow[];
  fanoCompleteQuadrangleRows: FanoCompleteQuadrangleRow[];
  repoSeedBridgeRows: RepoSeedBridgeRow[];
  cuboctahedronBridge: {
    status: OctonionVsA3MedialCarrierDiscriminatorV0Summary['cuboctahedronBridgeStatus'];
    source: 'octahedron-ambo-core' | 'unresolved';
    coreTopology: string | null;
    canApplyAmboToCuboctahedronCore: boolean;
  };
  cubeG1CuboctahedronBridge: {
    status: OctonionVsA3MedialCarrierDiscriminatorV0Summary['cubeG1CuboctahedronBridgeStatus'];
    source: 'cube-ambo-core' | 'unresolved';
    coreTopology: string | null;
  };
  tetraG2CoreCuboctahedronBridge: {
    status: OctonionVsA3MedialCarrierDiscriminatorV0Summary['tetraG2CoreCuboctahedronBridgeStatus'];
    source: 'tetra-g1-octa-core-ambo' | 'unresolved';
    g1CoreTopology: string | null;
    g2CoreTopology: string | null;
  };
  dualOctaCubeProvenance: {
    cubeG1MedialHubStatus: OctonionVsA3MedialCarrierDiscriminatorV0Summary['cubeG1MedialHubStatus'];
    cubePrimalCarrierAssignmentStatus: OctonionVsA3MedialCarrierDiscriminatorV0Summary['cubePrimalCarrierAssignmentStatus'];
  };
  hypothesisVerdicts: HypothesisVerdictRow[];
  summary: OctonionVsA3MedialCarrierDiscriminatorV0Summary;
  issues: OctonionVsA3MedialCarrierDiscriminatorV0Issue[];
  ok: boolean;
}

interface SignedBasis {
  sign: FanoSign;
  unit: SignedBasisUnitId;
}

const PRIMAL_LABELS: readonly A3PrimalLabel[] = ['A', 'B', 'C', 'D'];
const FANO_UNITS: readonly FanoUnitId[] = ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7'];
const CANONICAL_FANO_QUADRANGLE: Record<A3PrimalLabel, FanoUnitId> = {
  A: 'e1',
  B: 'e2',
  C: 'e4',
  D: 'e7',
};
const ORIENTED_FANO_TRIPLES: readonly [number, number, number][] = [
  [1, 2, 3],
  [1, 4, 5],
  [1, 7, 6],
  [2, 4, 6],
  [2, 5, 7],
  [3, 4, 7],
  [3, 6, 5],
];

export function buildOctonionVsA3MedialCarrierDiscriminatorV0Report(): OctonionVsA3MedialCarrierDiscriminatorV0Report {
  const flagRows = buildA3MedialFlagRows();
  const signedLiftRows = buildSignedLiftRows(flagRows, CANONICAL_FANO_QUADRANGLE);
  const triangleFlagSets = findTriangleFlagSets(flagRows);
  const squareFlagCycles = findSquareFlagCycles(flagRows);
  const triangleClosureRows = buildTriangleClosureRows(
    triangleFlagSets,
    CANONICAL_FANO_QUADRANGLE,
  );
  const squareHolonomyRows = buildSquareHolonomyRows(
    squareFlagCycles,
    CANONICAL_FANO_QUADRANGLE,
  );
  const fanoCompleteQuadrangleRows = buildFanoCompleteQuadrangleRows(
    flagRows,
    triangleFlagSets,
    squareFlagCycles,
  );
  const repoBridge = buildRepoSeedAmboBridgeReport();
  const summary = buildSummary({
    flagRows,
    signedLiftRows,
    triangleClosureRows,
    squareHolonomyRows,
    fanoCompleteQuadrangleRows,
    repoSeedBridgeRows: repoBridge.rows,
    cuboctahedronBridgeStatus: repoBridge.cuboctahedronBridge.status,
    cubeG1CuboctahedronBridgeStatus:
      repoBridge.cubeG1CuboctahedronBridge.status,
    tetraG2CoreCuboctahedronBridgeStatus:
      repoBridge.tetraG2CoreCuboctahedronBridge.status,
  });
  const issues = buildIssues(summary);
  const hypothesisVerdicts = buildHypothesisVerdicts(issues.length === 0);

  return {
    method: 'octonion-vs-a3-medial-carrier-discriminator-v0',
    diagnosticScope: 'tetra-octa-cube-medial-hub-carrier-discriminator-only',
    candidateStatus: 'local-hub-candidate-not-ratified',
    primalCarrierAssignment: CANONICAL_FANO_QUADRANGLE,
    flagRows,
    signedLiftRows,
    triangleClosureRows,
    squareHolonomyRows,
    fanoCompleteQuadrangleRows,
    repoSeedBridgeRows: repoBridge.rows,
    cuboctahedronBridge: repoBridge.cuboctahedronBridge,
    cubeG1CuboctahedronBridge: repoBridge.cubeG1CuboctahedronBridge,
    tetraG2CoreCuboctahedronBridge:
      repoBridge.tetraG2CoreCuboctahedronBridge,
    dualOctaCubeProvenance: {
      cubeG1MedialHubStatus:
        'cube-g1-as-cuboctahedral-medial-object-via-dual-provenance-only',
      cubePrimalCarrierAssignmentStatus:
        'not-solved-independent-cube-primal-sourcehood',
    },
    hypothesisVerdicts,
    summary,
    issues,
    ok: issues.length === 0,
  };
}

function buildA3MedialFlagRows(): A3MedialFlagRow[] {
  return PRIMAL_LABELS.flatMap((sharedPrimalVertex) =>
    PRIMAL_LABELS.filter((omittedPrimalVertex) => omittedPrimalVertex !== sharedPrimalVertex).map(
      (omittedPrimalVertex) => ({
        flagId: `${sharedPrimalVertex}->${omittedPrimalVertex}` as A3FlagId,
        sharedPrimalVertex,
        omittedPrimalVertex,
        rootCoordinate: buildRootCoordinate(sharedPrimalVertex, omittedPrimalVertex),
        status: 'a3-s4-medial-flag-token' as const,
      }),
    ),
  );
}

function buildSignedLiftRows(
  flagRows: A3MedialFlagRow[],
  assignment: Record<A3PrimalLabel, FanoUnitId>,
): SignedFanoLiftRow[] {
  return flagRows.map((flagRow) => {
    const lift = signedLiftForFlag(flagRow.flagId, assignment);

    if (lift.unit === '1') {
      throw new Error(`Unexpected scalar signed lift for ${flagRow.flagId}`);
    }

    return {
      flagId: flagRow.flagId,
      orderedPrimalPair: [
        flagRow.sharedPrimalVertex,
        flagRow.omittedPrimalVertex,
      ],
      signedLift: formatSignedBasis(lift),
      carrierRay: `ray:${lift.unit}`,
      productUnit: lift.unit,
      sign: lift.sign,
      quotientIdentityStatus:
        'medial-flag-identity-not-preserved-by-bare-signed-lift',
    };
  });
}

function buildTriangleClosureRows(
  triangleFlagSets: A3FlagId[][],
  assignment: Record<A3PrimalLabel, FanoUnitId>,
): TriangleClosureRow[] {
  return triangleFlagSets.flatMap((triangleFlags, triangleIndex) => {
    const rows: TriangleClosureRow[] = [];

    for (let leftIndex = 0; leftIndex < triangleFlags.length; leftIndex += 1) {
      for (let rightIndex = 0; rightIndex < triangleFlags.length; rightIndex += 1) {
        if (leftIndex === rightIndex) {
          continue;
        }

        const targetIndex = [0, 1, 2].find(
          (index) => index !== leftIndex && index !== rightIndex,
        );

        if (targetIndex === undefined) {
          throw new Error(`No target flag found for triangle ${triangleIndex}`);
        }

        const leftFlagId = triangleFlags[leftIndex];
        const rightFlagId = triangleFlags[rightIndex];
        const targetFlagId = triangleFlags[targetIndex];
        const product = multiplySignedBasis(
          signedLiftForFlag(leftFlagId, assignment),
          signedLiftForFlag(rightFlagId, assignment),
        );
        const targetLift = signedLiftForFlag(targetFlagId, assignment);
        const closureStatus =
          product.unit !== '1' && product.unit === targetLift.unit ? 'pass' : 'fail';

        rows.push({
          triangleId: `triangle:${triangleIndex + 1}:${triangleFlags.join('|')}`,
          orderedProductId: `${leftFlagId}*${rightFlagId}->${targetFlagId}`,
          leftFlagId,
          rightFlagId,
          targetFlagId,
          productSignedLift: formatSignedBasis(product),
          targetCarrierRay: `ray:${targetLift.unit}`,
          closureStatus,
        });
      }
    }

    return rows;
  });
}

function buildSquareHolonomyRows(
  squareFlagCycles: A3FlagId[][],
  assignment: Record<A3PrimalLabel, FanoUnitId>,
): SquareHolonomyRow[] {
  return squareFlagCycles.flatMap((flagCycle, index) => {
    const squareCycleId = `square:${index + 1}:${flagCycle.join('|')}`;

    return buildSquareCycleOrientationVariants(flagCycle).map((variant) => {
      const signedLiftCycle = variant.flagCycle.map((flagId) =>
        signedLiftForFlag(flagId, assignment),
      );
      const leftAssociatedProduct = signedLiftCycle.reduce((product, lift) =>
        multiplySignedBasis(product, lift),
      );

      return {
        squareCycleId,
        squareHolonomyVariantId: `${squareCycleId}:${variant.orientationVariant}`,
        orientationVariant: variant.orientationVariant,
        flagCycle: variant.flagCycle,
        signedLiftCycle: signedLiftCycle.map(formatSignedBasis),
        leftAssociatedProduct: formatSignedBasis(leftAssociatedProduct),
        holonomyStatus:
          leftAssociatedProduct.sign === '+' && leftAssociatedProduct.unit === '1'
            ? 'pass'
            : 'fail',
      };
    });
  });
}

function buildSquareCycleOrientationVariants(flagCycle: A3FlagId[]): Array<{
  orientationVariant: SquareHolonomyRow['orientationVariant'];
  flagCycle: A3FlagId[];
}> {
  const reversedFlagCycle = [...flagCycle].reverse();
  const forwardOrientationVariants = [
    'forward-rotation-0',
    'forward-rotation-1',
    'forward-rotation-2',
    'forward-rotation-3',
  ] as const;
  const reverseOrientationVariants = [
    'reverse-rotation-0',
    'reverse-rotation-1',
    'reverse-rotation-2',
    'reverse-rotation-3',
  ] as const;
  const variants: Array<{
    orientationVariant: SquareHolonomyRow['orientationVariant'];
    flagCycle: A3FlagId[];
  }> = [];

  for (
    let rotationIndex = 0;
    rotationIndex < forwardOrientationVariants.length;
    rotationIndex += 1
  ) {
    variants.push({
      orientationVariant: forwardOrientationVariants[rotationIndex],
      flagCycle: rotateCycle(flagCycle, rotationIndex),
    });
  }

  for (
    let rotationIndex = 0;
    rotationIndex < reverseOrientationVariants.length;
    rotationIndex += 1
  ) {
    variants.push({
      orientationVariant: reverseOrientationVariants[rotationIndex],
      flagCycle: rotateCycle(reversedFlagCycle, rotationIndex),
    });
  }

  return variants;
}

function rotateCycle<TValue>(values: TValue[], rotationIndex: number): TValue[] {
  return [
    ...values.slice(rotationIndex),
    ...values.slice(0, rotationIndex),
  ];
}

function buildFanoCompleteQuadrangleRows(
  flagRows: A3MedialFlagRow[],
  triangleFlagSets: A3FlagId[][],
  squareFlagCycles: A3FlagId[][],
): FanoCompleteQuadrangleRow[] {
  return combinations([...FANO_UNITS], 4)
    .filter(isCompleteFanoQuadrangle)
    .map((quadrangleUnits, quadrangleIndex) => {
      let quotientLossAnomalyCount = 0;
      let triangleClosureFailureCount = 0;
      let squareHolonomyFailureCount = 0;
      let flagRecoveryFailureCount = 0;

      for (const labeling of permutations(quadrangleUnits)) {
        const assignment = buildAssignment(labeling);
        const signedLiftRows = buildSignedLiftRows(flagRows, assignment);
        const distinctFlagCount = new Set(flagRows.map((row) => row.flagId)).size;
        const distinctSignedLiftCount = new Set(
          signedLiftRows.map((row) => row.signedLift),
        ).size;

        if (flagRows.length !== 12 || distinctFlagCount !== 12) {
          flagRecoveryFailureCount += 1;
        }

        if (signedLiftRows.length !== 12 || distinctSignedLiftCount !== 6) {
          quotientLossAnomalyCount += 1;
        }

        triangleClosureFailureCount += buildTriangleClosureRows(
          triangleFlagSets,
          assignment,
        ).filter((row) => row.closureStatus === 'fail').length;
        squareHolonomyFailureCount += buildSquareHolonomyRows(
          squareFlagCycles,
          assignment,
        ).filter((row) => row.holonomyStatus === 'fail').length;
      }

      return {
        quadrangleId: `fano-complete-quadrangle:${quadrangleIndex + 1}`,
        units: quadrangleUnits,
        labelingCount: 24,
        quotientLossAnomalyCount,
        triangleClosureFailureCount,
        squareHolonomyFailureCount,
        flagRecoveryFailureCount,
      };
    });
}

function buildRepoSeedAmboBridgeReport(): {
  rows: RepoSeedBridgeRow[];
  cuboctahedronBridge: OctonionVsA3MedialCarrierDiscriminatorV0Report['cuboctahedronBridge'];
  cubeG1CuboctahedronBridge: OctonionVsA3MedialCarrierDiscriminatorV0Report['cubeG1CuboctahedronBridge'];
  tetraG2CoreCuboctahedronBridge: OctonionVsA3MedialCarrierDiscriminatorV0Report['tetraG2CoreCuboctahedronBridge'];
} {
  const seeds = [
    { seedKey: 'tetrahedron' as const, expectedEdgeCount: 6 },
    { seedKey: 'octahedron' as const, expectedEdgeCount: 12 },
    { seedKey: 'cube' as const, expectedEdgeCount: 12 },
  ];
  const seedShapes = seeds.map(({ seedKey, expectedEdgeCount }) => {
    const shape = createSeedShape(seedKey);

    return { seedKey, expectedEdgeCount, shape };
  });
  const rows = seedShapes.map(({ seedKey, expectedEdgeCount, shape }) => ({
    seedKey,
    seedExists: true,
    edgeCount: shape.edges.length,
    expectedEdgeCount,
    edgeCountStatus: shape.edges.length === expectedEdgeCount ? 'pass' : 'fail',
    amboSupportStatus: canApplyAmboDissection(shape) ? 'supported' : 'not-supported',
  })) satisfies RepoSeedBridgeRow[];
  const octahedronShape = seedShapes.find((entry) => entry.seedKey === 'octahedron')?.shape;
  const cubeShape = seedShapes.find((entry) => entry.seedKey === 'cube')?.shape;
  const tetrahedronShape = seedShapes.find((entry) => entry.seedKey === 'tetrahedron')?.shape;
  const unresolvedCuboctahedronBridge = {
    status: 'mathematical-expectation-repo-execution-unresolved' as const,
    source: 'unresolved' as const,
    coreTopology: null,
    canApplyAmboToCuboctahedronCore: false,
  };

  let cuboctahedronBridge:
    OctonionVsA3MedialCarrierDiscriminatorV0Report['cuboctahedronBridge'] =
      unresolvedCuboctahedronBridge;
  let cubeG1CuboctahedronBridge =
    buildUnresolvedCubeG1CuboctahedronBridge();
  let tetraG2CoreCuboctahedronBridge =
    buildUnresolvedTetraG2CoreCuboctahedronBridge();

  if (octahedronShape && canApplyAmboDissection(octahedronShape)) {
    const amboOctahedron = applyAmboDissection(octahedronShape);
    const cuboctahedronCore = amboOctahedron.cells.find(
      (cell) => cell.kind === 'core' && cell.topology === 'cuboctahedron',
    );

    if (cuboctahedronCore) {
      const canApplyToCuboctahedronCore = canApplyAmboDissection(
        amboOctahedron,
        cuboctahedronCore.id,
      );

      cuboctahedronBridge = {
        status: canApplyToCuboctahedronCore
          ? 'verified-via-octahedron-ambo-core'
          : 'failed',
        source: 'octahedron-ambo-core',
        coreTopology: cuboctahedronCore.topology ?? null,
        canApplyAmboToCuboctahedronCore: canApplyToCuboctahedronCore,
      };
    }
  }

  if (cubeShape && canApplyAmboDissection(cubeShape)) {
    const amboCube = applyAmboDissection(cubeShape);
    const cubeCuboctahedronCore = amboCube.cells.find(
      (cell) => cell.kind === 'core' && cell.topology === 'cuboctahedron',
    );

    cubeG1CuboctahedronBridge = cubeCuboctahedronCore
      ? {
          status: 'verified-via-cube-ambo-core',
          source: 'cube-ambo-core',
          coreTopology: cubeCuboctahedronCore.topology ?? null,
        }
      : {
          status: 'failed',
          source: 'cube-ambo-core',
          coreTopology: null,
        };
  }

  if (tetrahedronShape && canApplyAmboDissection(tetrahedronShape)) {
    const tetraG1Shape = applyAmboDissection(tetrahedronShape);
    const tetraG1OctaCore = tetraG1Shape.cells.find(
      (cell) => cell.kind === 'core' && cell.topology === 'octahedron',
    );

    if (tetraG1OctaCore && canApplyAmboDissection(tetraG1Shape, tetraG1OctaCore.id)) {
      const tetraG2Shape = applyAmboDissection(tetraG1Shape, tetraG1OctaCore.id);
      const tetraG2CuboctahedronCore = tetraG2Shape.cells.find(
        (cell) => cell.kind === 'core' && cell.topology === 'cuboctahedron',
      );

      tetraG2CoreCuboctahedronBridge = tetraG2CuboctahedronCore
        ? {
            status: 'verified-via-tetra-g1-octa-core-ambo',
            source: 'tetra-g1-octa-core-ambo',
            g1CoreTopology: tetraG1OctaCore.topology ?? null,
            g2CoreTopology: tetraG2CuboctahedronCore.topology ?? null,
          }
        : {
            status: 'failed',
            source: 'tetra-g1-octa-core-ambo',
            g1CoreTopology: tetraG1OctaCore.topology ?? null,
            g2CoreTopology: null,
          };
    }
  }

  return {
    rows,
    cuboctahedronBridge,
    cubeG1CuboctahedronBridge,
    tetraG2CoreCuboctahedronBridge,
  };
}

function buildUnresolvedCubeG1CuboctahedronBridge(): OctonionVsA3MedialCarrierDiscriminatorV0Report['cubeG1CuboctahedronBridge'] {
  return {
    status: 'mathematical-expectation-repo-execution-unresolved',
    source: 'unresolved',
    coreTopology: null,
  };
}

function buildUnresolvedTetraG2CoreCuboctahedronBridge(): OctonionVsA3MedialCarrierDiscriminatorV0Report['tetraG2CoreCuboctahedronBridge'] {
  return {
    status: 'mathematical-expectation-repo-execution-unresolved',
    source: 'unresolved',
    g1CoreTopology: null,
    g2CoreTopology: null,
  };
}

function buildHypothesisVerdicts(discriminatorChecksPassed: boolean): HypothesisVerdictRow[] {
  return [
    {
      hypothesisId: 'H1',
      verdict: 'rejected',
      reason:
        'bare-signed-octonion-unit-collapses-12-medial-flags-to-6-signed-lifts',
    },
    {
      hypothesisId: 'H2',
      verdict: 'rejected',
      reason:
        'a3-incidence-recovers-12-flags-but-does-not-supply-fano-multiplication-closure-or-square-holonomy',
    },
    {
      hypothesisId: 'H3',
      verdict: discriminatorChecksPassed ? 'live' : 'unresolved',
      reason: discriminatorChecksPassed
        ? 'a3-medial-flag-base-plus-fano-local-fiber-plus-provenance-survives-current-medial-hub-discriminator'
        : 'a3-medial-flag-base-plus-fano-local-fiber-plus-provenance-not-ratified-because-discriminator-checks-failed',
    },
  ];
}

function buildSummary(args: {
  flagRows: A3MedialFlagRow[];
  signedLiftRows: SignedFanoLiftRow[];
  triangleClosureRows: TriangleClosureRow[];
  squareHolonomyRows: SquareHolonomyRow[];
  fanoCompleteQuadrangleRows: FanoCompleteQuadrangleRow[];
  repoSeedBridgeRows: RepoSeedBridgeRow[];
  cuboctahedronBridgeStatus: OctonionVsA3MedialCarrierDiscriminatorV0Summary['cuboctahedronBridgeStatus'];
  cubeG1CuboctahedronBridgeStatus: OctonionVsA3MedialCarrierDiscriminatorV0Summary['cubeG1CuboctahedronBridgeStatus'];
  tetraG2CoreCuboctahedronBridgeStatus: OctonionVsA3MedialCarrierDiscriminatorV0Summary['tetraG2CoreCuboctahedronBridgeStatus'];
}): OctonionVsA3MedialCarrierDiscriminatorV0Summary {
  const distinctFlagCount = new Set(args.flagRows.map((row) => row.flagId)).size;
  const distinctSignedLiftCount = new Set(
    args.signedLiftRows.map((row) => row.signedLift),
  ).size;
  const gaugeFlagRecoveryFailureCount = args.fanoCompleteQuadrangleRows.reduce(
    (sum, row) => sum + row.flagRecoveryFailureCount,
    0,
  );
  const gaugeTriangleClosureFailureCount = args.fanoCompleteQuadrangleRows.reduce(
    (sum, row) => sum + row.triangleClosureFailureCount,
    0,
  );
  const gaugeSquareHolonomyFailureCount = args.fanoCompleteQuadrangleRows.reduce(
    (sum, row) => sum + row.squareHolonomyFailureCount,
    0,
  );
  const gaugeQuotientLossAnomalyCount = args.fanoCompleteQuadrangleRows.reduce(
    (sum, row) => sum + row.quotientLossAnomalyCount,
    0,
  );
  const tetraRow = getSeedBridgeRow(args.repoSeedBridgeRows, 'tetrahedron');
  const octaRow = getSeedBridgeRow(args.repoSeedBridgeRows, 'octahedron');
  const cubeRow = getSeedBridgeRow(args.repoSeedBridgeRows, 'cube');

  return {
    method: 'octonion-vs-a3-medial-carrier-discriminator-v0',
    diagnosticScope: 'tetra-octa-cube-medial-hub-carrier-discriminator-only',
    candidateStatus: 'local-hub-candidate-not-ratified',
    flagCount: args.flagRows.length,
    distinctFlagCount,
    flagRecoveryStatus:
      args.flagRows.length === 12 && distinctFlagCount === 12 ? 'pass' : 'fail',
    flagDiscriminatorStatus: 'non-discriminating',
    signedLiftFlagCount: args.signedLiftRows.length,
    distinctSignedLiftCount,
    signedLiftQuotientLossStatus:
      args.signedLiftRows.length === 12 && distinctSignedLiftCount === 6
        ? 'pass-as-warning'
        : 'fail',
    signedLiftDiscriminatesAgainst: 'H1',
    signedLiftQuotientLossExplanation:
      'bare signed octonion unit is too coarse because it loses medial flag identity',
    canonicalTriangleCount: new Set(
      args.triangleClosureRows.map((row) => row.triangleId),
    ).size,
    canonicalTriangleOrderedProductCount: args.triangleClosureRows.length,
    canonicalTriangleClosurePassCount: args.triangleClosureRows.filter(
      (row) => row.closureStatus === 'pass',
    ).length,
    canonicalTriangleClosureFailCount: args.triangleClosureRows.filter(
      (row) => row.closureStatus === 'fail',
    ).length,
    triangleClosureStatus: args.triangleClosureRows.every(
      (row) => row.closureStatus === 'pass',
    )
      ? 'pass'
      : 'fail',
    triangleDiscriminatorStatus: 'discriminating',
    canonicalSquareCycleCount: new Set(
      args.squareHolonomyRows.map((row) => row.squareCycleId),
    ).size,
    canonicalSquareHolonomyVariantCount: args.squareHolonomyRows.length,
    squareHolonomyPassCount: args.squareHolonomyRows.filter(
      (row) => row.holonomyStatus === 'pass',
    ).length,
    squareHolonomyFailCount: args.squareHolonomyRows.filter(
      (row) => row.holonomyStatus === 'fail',
    ).length,
    squareHolonomyStatus: args.squareHolonomyRows.every(
      (row) => row.holonomyStatus === 'pass',
    )
      ? 'pass'
      : 'fail',
    squareDiscriminatorStatus: 'discriminating',
    fanoCompleteQuadrangleCount: args.fanoCompleteQuadrangleRows.length,
    quadrangleLabelingCount: args.fanoCompleteQuadrangleRows.reduce(
      (sum, row) => sum + row.labelingCount,
      0,
    ),
    gaugeFlagRecoveryFailureCount,
    gaugeTriangleClosureFailureCount,
    gaugeSquareHolonomyFailureCount,
    gaugeQuotientLossAnomalyCount,
    gaugeRobustnessStatus:
      args.fanoCompleteQuadrangleRows.length === 7 &&
      gaugeFlagRecoveryFailureCount === 0 &&
      gaugeTriangleClosureFailureCount === 0 &&
      gaugeSquareHolonomyFailureCount === 0 &&
      gaugeQuotientLossAnomalyCount === 0
        ? 'pass'
        : 'fail',
    tetraSeedStatus: tetraRow?.edgeCountStatus ?? 'fail',
    octaSeedStatus: octaRow?.edgeCountStatus ?? 'fail',
    cubeSeedStatus: cubeRow?.edgeCountStatus ?? 'fail',
    tetraAmboSupportStatus: tetraRow?.amboSupportStatus ?? 'not-supported',
    octaAmboSupportStatus: octaRow?.amboSupportStatus ?? 'not-supported',
    cubeAmboSupportStatus: cubeRow?.amboSupportStatus ?? 'not-supported',
    cuboctahedronBridgeStatus: args.cuboctahedronBridgeStatus,
    cubeG1CuboctahedronBridgeStatus: args.cubeG1CuboctahedronBridgeStatus,
    tetraG2CoreCuboctahedronBridgeStatus:
      args.tetraG2CoreCuboctahedronBridgeStatus,
    cubeG1MedialHubStatus:
      'cube-g1-as-cuboctahedral-medial-object-via-dual-provenance-only',
    cubePrimalCarrierAssignmentStatus:
      'not-solved-independent-cube-primal-sourcehood',
    generalFieldLawStatus: 'not-proven',
    universalOctonionStatus: 'not-proven',
    cubePrimalSourcehoodStatus: 'not-proven',
    fieldCueUnblockStatus: 'not-authorized',
    s0Status: 'not-authorized',
    uiStatus: 'no-ui',
    shapeMutationStatus: 'no-shape-mutation',
    packetWriteStatus: 'no-packet-write',
  };
}

function buildIssues(
  summary: OctonionVsA3MedialCarrierDiscriminatorV0Summary,
): OctonionVsA3MedialCarrierDiscriminatorV0Issue[] {
  const issues: OctonionVsA3MedialCarrierDiscriminatorV0Issue[] = [];

  if (summary.flagCount !== 12 || summary.distinctFlagCount !== 12) {
    issues.push(issue('missing-12-a3-flags', 'Expected 12 distinct A3 medial flags.'));
  }

  if (summary.signedLiftQuotientLossStatus !== 'pass-as-warning') {
    issues.push(
      issue(
        'signed-lift-quotient-loss-absent',
        'Expected 12 medial flags to collapse to 6 signed Fano lifts under H1.',
      ),
    );
  }

  if (summary.canonicalTriangleCount !== 8) {
    issues.push(
      issue(
        'canonical-triangle-count-mismatch',
        `Expected 8 cuboctahedral triangle faces, got ${summary.canonicalTriangleCount}.`,
      ),
    );
  }

  if (summary.canonicalTriangleOrderedProductCount !== 48) {
    issues.push(
      issue(
        'canonical-triangle-ordered-product-count-mismatch',
        `Expected 48 ordered triangle products, got ${summary.canonicalTriangleOrderedProductCount}.`,
      ),
    );
  }

  if (summary.canonicalTriangleClosureFailCount !== 0) {
    issues.push(issue('triangle-closure-failure', 'Canonical triangle closure failed.'));
  }

  if (summary.canonicalSquareCycleCount !== 6) {
    issues.push(
      issue(
        'canonical-square-cycle-count-mismatch',
        `Expected 6 cuboctahedral square cycles, got ${summary.canonicalSquareCycleCount}.`,
      ),
    );
  }

  if (summary.canonicalSquareHolonomyVariantCount !== 48) {
    issues.push(
      issue(
        'canonical-square-holonomy-variant-count-mismatch',
        `Expected 48 square holonomy orientation variants, got ${summary.canonicalSquareHolonomyVariantCount}.`,
      ),
    );
  }

  if (summary.squareHolonomyFailCount !== 0) {
    issues.push(issue('square-holonomy-failure', 'Canonical square holonomy failed.'));
  }

  if (summary.fanoCompleteQuadrangleCount !== 7) {
    issues.push(
      issue(
        'fano-complete-quadrangle-count-mismatch',
        `Expected 7 Fano complete quadrangles, got ${summary.fanoCompleteQuadrangleCount}.`,
      ),
    );
  }

  if (summary.quadrangleLabelingCount !== 168) {
    issues.push(
      issue(
        'quadrangle-labeling-count-mismatch',
        `Expected 168 Fano complete-quadrangle labelings, got ${summary.quadrangleLabelingCount}.`,
      ),
    );
  }

  if (summary.gaugeRobustnessStatus !== 'pass') {
    issues.push(issue('gauge-robustness-failure', 'Gauge robustness checks failed.'));
  }

  if (summary.tetraSeedStatus !== 'pass') {
    issues.push(
      issue('tetra-seed-bridge-failed', 'Tetrahedron seed bridge did not pass.'),
    );
  }

  if (summary.octaSeedStatus !== 'pass') {
    issues.push(
      issue('octa-seed-bridge-failed', 'Octahedron seed bridge did not pass.'),
    );
  }

  if (summary.cubeSeedStatus !== 'pass') {
    issues.push(
      issue('cube-seed-bridge-failed', 'Cube seed bridge did not pass.'),
    );
  }

  if (summary.tetraAmboSupportStatus !== 'supported') {
    issues.push(
      issue('tetra-ambo-support-failed', 'Tetrahedron Ambo support was not verified.'),
    );
  }

  if (summary.octaAmboSupportStatus !== 'supported') {
    issues.push(
      issue('octa-ambo-support-failed', 'Octahedron Ambo support was not verified.'),
    );
  }

  if (summary.cubeAmboSupportStatus !== 'supported') {
    issues.push(
      issue('cube-ambo-support-failed', 'Cube Ambo support was not verified.'),
    );
  }

  if (summary.cuboctahedronBridgeStatus !== 'verified-via-octahedron-ambo-core') {
    issues.push(
      issue(
        'octa-g1-cuboctahedron-bridge-not-verified',
        'Octahedron G1 cuboctahedron bridge was not verified.',
      ),
    );
  }

  if (summary.cubeG1CuboctahedronBridgeStatus !== 'verified-via-cube-ambo-core') {
    issues.push(
      issue(
        'cube-g1-cuboctahedron-bridge-not-verified',
        'Cube G1 cuboctahedron bridge was not verified.',
      ),
    );
  }

  if (
    summary.tetraG2CoreCuboctahedronBridgeStatus !==
    'verified-via-tetra-g1-octa-core-ambo'
  ) {
    issues.push(
      issue(
        'tetra-g2-core-cuboctahedron-bridge-not-verified',
        'Tetrahedron G2 cuboctahedron bridge was not verified.',
      ),
    );
  }

  if (
    summary.cubeG1MedialHubStatus !==
      'cube-g1-as-cuboctahedral-medial-object-via-dual-provenance-only' ||
    summary.cubePrimalCarrierAssignmentStatus !==
      'not-solved-independent-cube-primal-sourcehood'
  ) {
    issues.push(
      issue(
        'cube-medial-provenance-conflated-with-cube-primal-sourcehood',
        'Cube G1 medial provenance must not solve cube primal carrier assignment.',
      ),
    );
  }

  if (
    summary.generalFieldLawStatus !== 'not-proven' ||
    summary.universalOctonionStatus !== 'not-proven' ||
    summary.cubePrimalSourcehoodStatus !== 'not-proven'
  ) {
    issues.push(
      issue(
        'universal-field-law-implied',
        'Diagnostic statuses must not imply universal field law.',
      ),
    );
  }

  if (
    summary.fieldCueUnblockStatus !== 'not-authorized' ||
    summary.s0Status !== 'not-authorized' ||
    summary.uiStatus !== 'no-ui'
  ) {
    issues.push(
      issue(
        'downstream-authorization-implied',
        'Diagnostic must not authorize FieldCueV0, S0, or UI.',
      ),
    );
  }

  return issues;
}

function buildRootCoordinate(
  sharedPrimalVertex: A3PrimalLabel,
  omittedPrimalVertex: A3PrimalLabel,
): Record<A3PrimalLabel, -1 | 0 | 1> {
  return {
    A: coordinateForLabel('A', sharedPrimalVertex, omittedPrimalVertex),
    B: coordinateForLabel('B', sharedPrimalVertex, omittedPrimalVertex),
    C: coordinateForLabel('C', sharedPrimalVertex, omittedPrimalVertex),
    D: coordinateForLabel('D', sharedPrimalVertex, omittedPrimalVertex),
  };
}

function coordinateForLabel(
  label: A3PrimalLabel,
  sharedPrimalVertex: A3PrimalLabel,
  omittedPrimalVertex: A3PrimalLabel,
): -1 | 0 | 1 {
  if (label === sharedPrimalVertex) {
    return 1;
  }

  if (label === omittedPrimalVertex) {
    return -1;
  }

  return 0;
}

function findTriangleFlagSets(flagRows: A3MedialFlagRow[]): A3FlagId[][] {
  const flagIds = flagRows.map((row) => row.flagId);
  const triangles: A3FlagId[][] = [];

  for (let a = 0; a < flagIds.length; a += 1) {
    for (let b = a + 1; b < flagIds.length; b += 1) {
      for (let c = b + 1; c < flagIds.length; c += 1) {
        const candidate = [flagIds[a], flagIds[b], flagIds[c]];

        if (
          areAdjacentA3Roots(candidate[0], candidate[1]) &&
          areAdjacentA3Roots(candidate[0], candidate[2]) &&
          areAdjacentA3Roots(candidate[1], candidate[2])
        ) {
          triangles.push(candidate);
        }
      }
    }
  }

  return triangles;
}

function findSquareFlagCycles(flagRows: A3MedialFlagRow[]): A3FlagId[][] {
  const flagIds = flagRows.map((row) => row.flagId);
  const squareCycles: A3FlagId[][] = [];

  for (let a = 0; a < flagIds.length; a += 1) {
    for (let b = a + 1; b < flagIds.length; b += 1) {
      for (let c = b + 1; c < flagIds.length; c += 1) {
        for (let d = c + 1; d < flagIds.length; d += 1) {
          const candidate = [flagIds[a], flagIds[b], flagIds[c], flagIds[d]];
          const edgePairs = getInternalAdjacencyPairs(candidate);

          if (!isChordlessSquare(edgePairs)) {
            continue;
          }

          squareCycles.push(orderSquareCycle(candidate));
        }
      }
    }
  }

  return squareCycles;
}

function getInternalAdjacencyPairs(flagIds: A3FlagId[]): Array<readonly [number, number]> {
  const edgePairs: Array<readonly [number, number]> = [];

  for (let leftIndex = 0; leftIndex < flagIds.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < flagIds.length; rightIndex += 1) {
      if (areAdjacentA3Roots(flagIds[leftIndex], flagIds[rightIndex])) {
        edgePairs.push([leftIndex, rightIndex]);
      }
    }
  }

  return edgePairs;
}

function isChordlessSquare(edgePairs: Array<readonly [number, number]>): boolean {
  if (edgePairs.length !== 4) {
    return false;
  }

  const degrees = [0, 0, 0, 0];

  for (const [leftIndex, rightIndex] of edgePairs) {
    degrees[leftIndex] += 1;
    degrees[rightIndex] += 1;
  }

  return degrees.every((degree) => degree === 2);
}

function orderSquareCycle(flagIds: A3FlagId[]): A3FlagId[] {
  const orderedIndexes = [0];
  let previousIndex = -1;
  let currentIndex = 0;

  while (orderedIndexes.length < flagIds.length) {
    const nextIndex = flagIds.findIndex(
      (candidateFlagId, candidateIndex) =>
        candidateIndex !== currentIndex &&
        candidateIndex !== previousIndex &&
        !orderedIndexes.includes(candidateIndex) &&
        areAdjacentA3Roots(flagIds[currentIndex], candidateFlagId),
    );

    if (nextIndex === -1) {
      throw new Error(`Unable to order square cycle ${flagIds.join(',')}`);
    }

    previousIndex = currentIndex;
    currentIndex = nextIndex;
    orderedIndexes.push(currentIndex);
  }

  return orderedIndexes.map((index) => flagIds[index]);
}

function areAdjacentA3Roots(leftFlagId: A3FlagId, rightFlagId: A3FlagId): boolean {
  const left = parseFlagId(leftFlagId);
  const right = parseFlagId(rightFlagId);
  const exactOpposite =
    left.sharedPrimalVertex === right.omittedPrimalVertex &&
    left.omittedPrimalVertex === right.sharedPrimalVertex;

  return (
    !exactOpposite &&
    (left.omittedPrimalVertex === right.sharedPrimalVertex ||
      left.sharedPrimalVertex === right.omittedPrimalVertex)
  );
}

function signedLiftForFlag(
  flagId: A3FlagId,
  assignment: Record<A3PrimalLabel, FanoUnitId>,
): SignedBasis {
  const flag = parseFlagId(flagId);

  return multiplySignedBasis(
    { sign: '+', unit: assignment[flag.sharedPrimalVertex] },
    { sign: '+', unit: assignment[flag.omittedPrimalVertex] },
  );
}

function multiplySignedBasis(left: SignedBasis, right: SignedBasis): SignedBasis {
  const unsignedProduct = multiplyUnsignedBasis(left.unit, right.unit);

  return {
    sign: combineSigns(left.sign, right.sign, unsignedProduct.sign),
    unit: unsignedProduct.unit,
  };
}

function multiplyUnsignedBasis(
  left: SignedBasisUnitId,
  right: SignedBasisUnitId,
): SignedBasis {
  if (left === '1') {
    return { sign: '+', unit: right };
  }

  if (right === '1') {
    return { sign: '+', unit: left };
  }

  if (left === right) {
    return { sign: '-', unit: '1' };
  }

  const leftNumber = unitNumber(left);
  const rightNumber = unitNumber(right);

  for (const [first, second, third] of ORIENTED_FANO_TRIPLES) {
    for (const [cycleLeft, cycleRight, cycleProduct] of [
      [first, second, third],
      [second, third, first],
      [third, first, second],
    ] as const) {
      if (leftNumber === cycleLeft && rightNumber === cycleRight) {
        return { sign: '+', unit: unitId(cycleProduct) };
      }

      if (leftNumber === cycleRight && rightNumber === cycleLeft) {
        return { sign: '-', unit: unitId(cycleProduct) };
      }
    }
  }

  throw new Error(`Unsupported Fano product ${left}*${right}`);
}

function parseFlagId(flagId: A3FlagId): {
  sharedPrimalVertex: A3PrimalLabel;
  omittedPrimalVertex: A3PrimalLabel;
} {
  const [sharedPrimalVertex, omittedPrimalVertex] = flagId.split('->');

  if (!isPrimalLabel(sharedPrimalVertex) || !isPrimalLabel(omittedPrimalVertex)) {
    throw new Error(`Invalid A3 flag ${flagId}`);
  }

  return { sharedPrimalVertex, omittedPrimalVertex };
}

function isCompleteFanoQuadrangle(units: FanoUnitId[]): boolean {
  return !ORIENTED_FANO_TRIPLES.some((triple) => {
    const lineUnits = triple.map(unitId);

    return lineUnits.filter((unit) => units.includes(unit)).length === 3;
  });
}

function buildAssignment(units: FanoUnitId[]): Record<A3PrimalLabel, FanoUnitId> {
  const [A, B, C, D] = units;

  if (!A || !B || !C || !D) {
    throw new Error('Fano quadrangle labeling requires four units.');
  }

  return { A, B, C, D };
}

function combinations<TValue>(values: TValue[], size: number): TValue[][] {
  const rows: TValue[][] = [];

  function visit(startIndex: number, selected: TValue[]) {
    if (selected.length === size) {
      rows.push([...selected]);
      return;
    }

    for (
      let index = startIndex;
      index <= values.length - (size - selected.length);
      index += 1
    ) {
      selected.push(values[index]);
      visit(index + 1, selected);
      selected.pop();
    }
  }

  visit(0, []);

  return rows;
}

function permutations<TValue>(values: TValue[]): TValue[][] {
  if (!values.length) {
    return [[]];
  }

  return values.flatMap((value, index) =>
    permutations([...values.slice(0, index), ...values.slice(index + 1)]).map(
      (suffix) => [value, ...suffix],
    ),
  );
}

function combineSigns(...signs: FanoSign[]): FanoSign {
  return signs.filter((sign) => sign === '-').length % 2 === 0 ? '+' : '-';
}

function formatSignedBasis(value: SignedBasis): string {
  return `${value.sign}${value.unit}`;
}

function unitNumber(unitIdValue: FanoUnitId): number {
  return Number(unitIdValue.slice(1));
}

function unitId(unitNumberValue: number): FanoUnitId {
  return `e${unitNumberValue}` as FanoUnitId;
}

function isPrimalLabel(value: string | undefined): value is A3PrimalLabel {
  return value === 'A' || value === 'B' || value === 'C' || value === 'D';
}

function getSeedBridgeRow(
  rows: RepoSeedBridgeRow[],
  seedKey: RepoSeedBridgeRow['seedKey'],
): RepoSeedBridgeRow | undefined {
  return rows.find((row) => row.seedKey === seedKey);
}

function issue(
  code: string,
  message: string,
): OctonionVsA3MedialCarrierDiscriminatorV0Issue {
  return { code, message };
}
