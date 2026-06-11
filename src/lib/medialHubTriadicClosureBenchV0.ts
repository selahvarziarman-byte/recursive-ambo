import { createSeedShape } from '../data/seeds';
import { applyAmboDissection, canApplyAmboDissection } from './ambo';
import {
  buildHubLayerSourceStateCapsuleV0Report,
  type HubLayerSourceStateCapsuleV0Report,
} from './hubLayerSourceStateCapsuleV0';
import {
  buildOctaFirstBirthCarrierBaseV0Report,
  type OctaFirstBirthCarrierBaseV0Report,
} from './octaFirstBirthCarrierBaseV0';
import {
  buildOctonionVsA3MedialCarrierDiscriminatorV0Report,
  type OctonionVsA3MedialCarrierDiscriminatorV0Report,
} from './octonionVsA3MedialCarrierDiscriminatorV0';
import type { Face, Shape, Vec3 } from '../types/geometry';

export type BenchFanoUnit = 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7';
export type BenchSignedBasisUnit = '1' | BenchFanoUnit;
export type BenchSign = '+' | '-';

export interface BenchSignedBasis {
  sign: BenchSign;
  unit: BenchSignedBasisUnit;
}

export interface BenchIssue {
  code: string;
  message: string;
}

export interface BenchR6LiftRowV0 {
  childId: string;
  edgeId: string;
  fromVertexId: string;
  toVertexId: string;
  signedLift: string;
  reusePartnerChildId: string | null;
  crossCheckAgainstBranchA: 'agrees' | 'disagrees' | 'missing';
}

export interface BenchR12CarrierRowV0 {
  childId: string;
  orderedRootIdentity: string;
  positiveClassPairIndex: number;
  negativeClassPairIndex: number;
  signedLift: string;
  antipodalChildId: string;
  antipodalRootIsNegation: boolean;
}

export interface BenchFacePairRecordV0 {
  pairIndex: number;
  positiveClassFaceId: string;
  negativeClassFaceId: string;
  normal: Vec3;
  hexagonChildIds: string[];
}

export interface BenchTriadRowV0 {
  triadId: string;
  hexagonIndex: number;
  alternationClass: 'A' | 'B';
  memberChildIds: [string, string, string];
  additivePositionSum: Vec3;
  additivePositionSumMagnitude: number;
  productR6: string;
  productR12: string;
}

export interface BenchControlTriadRowV0 {
  triadId: string;
  hexagonIndex: number;
  alternationClass: 'A' | 'B';
  memberFlagIds: [string, string, string];
  additiveRootSum: number[];
  additiveRootSumMagnitude: number;
  product: string;
}

export interface BenchAntipodalPairRowV0 {
  hexagonIndex: number;
  pairId: string;
  leftId: string;
  rightId: string;
  leftLift: string;
  rightLift: string;
  signRelation: 'opposite-sign' | 'same-sign' | 'different-ray';
}

export interface BenchValueDistributionV0 {
  label: string;
  counts: Array<{ value: string; count: number }>;
}

export interface BenchGaugeSweepV0 {
  sweepId: string;
  labelingCount: number;
  validLabelingCount: number;
  invalidLabelingCount: number;
  triadProductDistributions: BenchValueDistributionV0[];
  antipodalSignRelationCounts: Array<{ value: string; count: number }>;
  squareHolonomyValueCounts: Array<{ value: string; count: number }>;
}

export interface BenchAnchorRowV0 {
  id: string;
  anchor: Vec3;
  chain: string;
}

export interface BenchMetricsV0 {
  metricsId: string;
  anchorCount: number;
  distinctAnchorCount: number;
  collisionGroups: string[][];
  distinctRadii: number[];
  edgeLength: number | null;
  adjacentPairCount: number;
  distinctAdjacencyAngitudesDegrees: number[];
  distinctEdgeOverRadiusRatios: number[];
  centralPlaneCensus: Array<{ memberCount: number; planeCount: number }>;
}

export interface BenchHexagonCorrespondenceRowV0 {
  correspondenceId: string;
  hexagonIndex: number;
  carrierMemberIds: string[];
  anchorImageDistinctCount: number;
  anchorsCoplanarThroughOrigin: boolean;
  inHexagonDistinctAdjacencyAnglesDegrees: number[];
  inHexagonDistinctEdgeOverRadiusRatios: number[];
  triadAnchorSumMagnitudes: number[];
  anchorGreatCircleIdentified: boolean;
  algebraicTriadProducts: string[];
}

export interface BenchLedgerRowV0 {
  ledgerId: string;
  context: string;
  measurement: string;
  derivationStatus: '';
}

export interface MedialHubTriadicClosureBenchV0Report {
  method: 'medial-hub-triadic-closure-bench-v0';
  diagnosticScope: 'station-iii-bench-2-computes-and-reports-only';
  verdictStatus: 'no-verdict-declared-d3-judged-by-auditor-against-tribunal';
  fieldCueUnblockStatus: 'not-authorized';
  s0Status: 'not-authorized';
  uiStatus: 'no-ui';
  shapeMutationStatus: 'no-shape-mutation';
  packetWriteStatus: 'no-packet-write';
  operationRegistryStatus: 'not-operation-registry-work';
  topologyStatus: 'not-topology-workspace';
  crossCheckedReports: Record<
    'discriminator' | 'octaCarrierBase' | 'hubCapsule',
    { method: string; ok: boolean; usage: string }
  >;
  part0: {
    r6Rows: BenchR6LiftRowV0[];
    r6DistinctLiftCount: number;
    r6CrossCheckAgreementCount: number;
    facePairs: BenchFacePairRecordV0[];
    indexRecoveryStatement: string;
    r12Rows: BenchR12CarrierRowV0[];
    r12DistinctLiftValueCount: number;
    r12DistinctRootIdentityCount: number;
    r12CanonicalQuadrangle: string[];
  };
  part1: {
    triadSelectionRule: string;
    bracketing: string;
    octaTriads: BenchTriadRowV0[];
    r12GaugeSweep: BenchGaugeSweepV0;
    r6GaugeSweep: BenchGaugeSweepV0;
    bench1AccumulationR6: BenchAntipodalPairRowV0[];
    bench1AccumulationR12: BenchAntipodalPairRowV0[];
  };
  part2: {
    projectionChainR12: string;
    projectionChainR6: string;
    r12Anchors: BenchAnchorRowV0[];
    r6Anchors: BenchAnchorRowV0[];
    r12Metrics: BenchMetricsV0;
    r6Metrics: BenchMetricsV0;
  };
  part3: {
    r12Correspondence: BenchHexagonCorrespondenceRowV0[];
    r6Correspondence: BenchHexagonCorrespondenceRowV0[];
  };
  part4: {
    controlLiftCrossCheckAgreementCount: number;
    controlTriads: BenchControlTriadRowV0[];
    controlGaugeSweep: BenchGaugeSweepV0;
    controlAntipodalPairs: BenchAntipodalPairRowV0[];
    projectionChainControl: string;
    controlAnchors: BenchAnchorRowV0[];
    controlMetrics: BenchMetricsV0;
    controlCorrespondence: BenchHexagonCorrespondenceRowV0[];
  };
  part5: BenchLedgerRowV0[];
  integrityIssueCount: number;
  integrityIssues: BenchIssue[];
  ok: boolean;
}

const ORIENTED_FANO_TRIPLES: readonly [number, number, number][] = [
  [1, 2, 3],
  [1, 4, 5],
  [1, 7, 6],
  [2, 4, 6],
  [2, 5, 7],
  [3, 4, 7],
  [3, 6, 5],
];
const POSITION_EPSILON = 1e-6;
const ANGLE_DECIMALS = 4;

export function buildMedialHubTriadicClosureBenchV0Report(): MedialHubTriadicClosureBenchV0Report {
  const issues: BenchIssue[] = [];
  const disc = buildOctonionVsA3MedialCarrierDiscriminatorV0Report();
  const branchA = buildOctaFirstBirthCarrierBaseV0Report();
  const hubCapsule = buildHubLayerSourceStateCapsuleV0Report();
  const octa = createSeedShape('octahedron');
  const ambo = canApplyAmboDissection(octa) ? applyAmboDissection(octa) : null;
  const core = ambo?.cells.find((cell) => cell.kind === 'core' && cell.topology === 'cuboctahedron');

  if (!ambo || !core) {
    issues.push({
      code: 'octa-ambo-core-underivable',
      message: 'Octahedron ambo core is unavailable; the bench is not grounded (mock-solution tripwire).',
    });
  }

  if (!disc.ok || !branchA.ok || !hubCapsule.ok) {
    issues.push({
      code: 'cross-checked-report-not-ok',
      message: `Cross-checked reports must be ok: disc=${disc.ok}, branchA=${branchA.ok}, hubCapsule=${hubCapsule.ok}.`,
    });
  }

  // ---------- octa frame, classes, R6 base (re-derived; Branch A pipeline duplicated) ----------
  const frame = deriveOctaFrame(octa, issues);
  const faceRecords = deriveFaceClassRecords(octa, frame, issues);
  const edgeDirections = deriveEdgeDirections(octa, faceRecords, issues);
  const children = ambo && core ? deriveChildren(octa, ambo, core.vertexIds, issues) : [];
  const r6LiftByChildId = new Map<string, BenchSignedBasis>();

  for (const child of children) {
    const direction = edgeDirections.get(unorderedPairKey(child.endpointIds[0], child.endpointIds[1]));

    if (!direction) {
      issues.push({
        code: 'r6-child-edge-direction-missing',
        message: `Child ${child.childId} has no derived edge direction.`,
      });
      continue;
    }

    const fromCarrier = frame.carrierByVertexId.get(direction.fromVertexId);
    const toCarrier = frame.carrierByVertexId.get(direction.toVertexId);

    if (!fromCarrier || !toCarrier) {
      issues.push({
        code: 'r6-carrier-missing',
        message: `Child ${child.childId} endpoints lack derived R6 carriers.`,
      });
      continue;
    }

    r6LiftByChildId.set(child.childId, multiplyBench(fromCarrier, toCarrier));
  }

  const branchALiftByChildId = new Map(
    branchA.edgeChildLiftRows.map((row) => [row.childVertexId, row.recomputedSignedLift]),
  );
  const r6Rows: BenchR6LiftRowV0[] = children.map((child) => {
    const direction = edgeDirections.get(
      unorderedPairKey(child.endpointIds[0], child.endpointIds[1]),
    );
    const lift = r6LiftByChildId.get(child.childId);
    const liftLabel = lift ? formatBench(lift) : 'missing';
    const branchALift = branchALiftByChildId.get(child.childId);
    const reusePartner = children.find(
      (candidate) =>
        candidate.childId !== child.childId &&
        formatBench(r6LiftByChildId.get(candidate.childId) ?? { sign: '+', unit: '1' }) === liftLabel,
    );

    return {
      childId: child.childId,
      edgeId: direction?.edgeId ?? 'missing',
      fromVertexId: direction?.fromVertexId ?? 'missing',
      toVertexId: direction?.toVertexId ?? 'missing',
      signedLift: liftLabel,
      reusePartnerChildId: reusePartner?.childId ?? null,
      crossCheckAgainstBranchA:
        branchALift === undefined ? 'missing' : branchALift === liftLabel ? 'agrees' : 'disagrees',
    };
  });
  const r6CrossCheckAgreementCount = r6Rows.filter(
    (row) => row.crossCheckAgainstBranchA === 'agrees',
  ).length;

  if (r6CrossCheckAgreementCount !== r6Rows.length || r6Rows.length !== 12) {
    issues.push({
      code: 'r6-cross-check-failed',
      message: `R6 re-derivation must agree with Branch A on 12/12 lifts; got ${r6CrossCheckAgreementCount}/${r6Rows.length}.`,
    });
  }

  // ---------- PART 0: face pairs (the four indices) and the R12 base ----------
  const facePairs = deriveFacePairs(octa, faceRecords, children, issues);
  const r12 = deriveR12Base(children, facePairs, issues);

  // ---------- PART 1: hexagons, triads, sweeps, accumulation ----------
  const hexagons = facePairs.map((pair) => pair.hexagonChildIds);
  const octaTriadMembers = deriveTriadMembers(
    hexagons,
    (childId) => children.find((child) => child.childId === childId)?.position ?? [0, 0, 0],
    facePairs.map((pair) => pair.normal),
    issues,
    'octa',
  );
  const octaTriads: BenchTriadRowV0[] = octaTriadMembers.map((triad) => {
    const positions = triad.memberIds.map(
      (childId) => children.find((child) => child.childId === childId)?.position ?? [0, 0, 0],
    ) as [Vec3, Vec3, Vec3];
    const additive = addVec3(addVec3(positions[0], positions[1]), positions[2]);

    return {
      triadId: triad.triadId,
      hexagonIndex: triad.hexagonIndex,
      alternationClass: triad.alternationClass,
      memberChildIds: triad.memberIds as [string, string, string],
      additivePositionSum: additive,
      additivePositionSumMagnitude: round(magnitude(additive)),
      productR6: formatBench(
        leftAssociatedProduct(triad.memberIds.map((childId) => requireBenchLift(r6LiftByChildId, childId, issues))),
      ),
      productR12: formatBench(
        leftAssociatedProduct(
          triad.memberIds.map((childId) => requireBenchLift(r12.liftByChildId, childId, issues)),
        ),
      ),
    };
  });
  const coreSquares = ambo && core ? deriveCoreSquares(ambo, core.faceIds, issues) : [];
  const antipodalChildPairs = deriveAntipodalChildPairs(children, issues);
  const bench1AccumulationR6 = buildAccumulationRows(
    hexagons,
    antipodalChildPairs,
    r6LiftByChildId,
  );
  const bench1AccumulationR12 = buildAccumulationRows(
    hexagons,
    antipodalChildPairs,
    r12.liftByChildId,
  );
  const r12GaugeSweep = runQuadrangleGaugeSweep({
    sweepId: 'octa-r12-quadrangle-sweep-7x24',
    indexCount: 4,
    liftPairs: children.map((child) => {
      const row = r12.rowByChildId.get(child.childId);

      return {
        id: child.childId,
        leftIndex: row?.positiveClassPairIndex ?? 1,
        rightIndex: row?.negativeClassPairIndex ?? 2,
      };
    }),
    triads: octaTriadMembers,
    antipodalPairs: antipodalChildPairs,
    squares: coreSquares,
    issues,
  });
  const r6GaugeSweep = runLineGaugeSweep({
    sweepId: 'octa-r6-line-sweep-7x6',
    frame,
    octa,
    edgeDirections,
    children,
    triads: octaTriadMembers,
    antipodalPairs: antipodalChildPairs,
    squares: coreSquares,
    issues,
  });

  // ---------- PART 2: carrier-derived anchors and metrics ----------
  const r12Anchors: BenchAnchorRowV0[] = children.map((child) => {
    const row = r12.rowByChildId.get(child.childId);
    const positivePair = facePairs.find((pair) => pair.pairIndex === row?.positiveClassPairIndex);
    const negativePair = facePairs.find((pair) => pair.pairIndex === row?.negativeClassPairIndex);
    const anchor =
      positivePair && negativePair
        ? subtractVec3(positivePair.normal, negativePair.normal)
        : ([0, 0, 0] as Vec3);

    return {
      id: child.childId,
      anchor,
      chain: `carrier root (${row?.orderedRootIdentity ?? 'missing'}) -> index directions u_i, u_j = positive-class face outward normals of pairs ${row?.positiveClassPairIndex}/${row?.negativeClassPairIndex} -> anchor = u_i - u_j`,
    };
  });
  const r6Anchors: BenchAnchorRowV0[] = children.map((child) => {
    const lift = r6LiftByChildId.get(child.childId) ?? { sign: '+' as BenchSign, unit: '1' as BenchSignedBasisUnit };
    const axis = frame.axes.find((candidate) => candidate.assignedUnit === lift.unit);
    const pole = axis ? octa.vertices[axis.positivePoleVertexId].position : ([0, 0, 0] as Vec3);
    const anchor = lift.sign === '+' ? pole : scaleVec3(pole, -1);

    return {
      id: child.childId,
      anchor,
      chain: `R6 lift ${formatBench(lift)} -> ray determines axis ${axis?.axisIndex ?? 'missing'} (F2 ray->axis law), sign determines pole -> anchor = sign * positive-pole position`,
    };
  });
  const r12Metrics = computeMetrics('octa-r12-metrics', r12Anchors);
  const r6Metrics = computeMetrics('octa-r6-metrics', r6Anchors);

  // ---------- PART 3: survival correspondence ----------
  const r12Correspondence = buildCorrespondence(
    'octa-r12',
    hexagons,
    r12Anchors,
    octaTriads.map((triad) => ({
      hexagonIndex: triad.hexagonIndex,
      memberIds: triad.memberChildIds,
      productLabel: triad.productR12,
    })),
  );
  const r6Correspondence = buildCorrespondence(
    'octa-r6',
    hexagons,
    r6Anchors,
    octaTriads.map((triad) => ({
      hexagonIndex: triad.hexagonIndex,
      memberIds: triad.memberChildIds,
      productLabel: triad.productR6,
    })),
  );

  // ---------- PART 4: tetra-hub control ----------
  const control = buildControlRoute(disc, hubCapsule, issues);

  // ---------- PART 5: anomaly ledger ----------
  const r6Antipodality = antipodalChildPairs.map((pair) => ({
    pairId: pair.pairId,
    left: formatBench(requireBenchLift(r6LiftByChildId, pair.leftChildId, issues)),
    right: formatBench(requireBenchLift(r6LiftByChildId, pair.rightChildId, issues)),
  }));
  const r12Antipodality = antipodalChildPairs.map((pair) => ({
    pairId: pair.pairId,
    left: formatBench(requireBenchLift(r12.liftByChildId, pair.leftChildId, issues)),
    right: formatBench(requireBenchLift(r12.liftByChildId, pair.rightChildId, issues)),
  }));
  const r6Holonomy = computeSquareHolonomyCounts(coreSquares, r6LiftByChildId, issues);
  const r12Holonomy = computeSquareHolonomyCounts(coreSquares, r12.liftByChildId, issues);
  const part5 = buildLedger({
    r6Holonomy,
    r12Holonomy,
    r6Antipodality,
    r12Antipodality,
    r6Rows,
    r12Rows: r12.rows,
    octaTriads,
    controlTriads: control.controlTriads,
    r12Metrics,
    r6Metrics,
    controlMetrics: control.controlMetrics,
    r12GaugeSweep,
    r6GaugeSweep,
    controlGaugeSweep: control.controlGaugeSweep,
    r12Correspondence,
    r6Correspondence,
    controlCorrespondence: control.controlCorrespondence,
  });

  issues.push(
    ...buildBenchIntegrityIssues({
      children,
      facePairs,
      hexagons,
      octaTriads,
      r12Rows: r12.rows,
      r12GaugeSweep,
      r6GaugeSweep,
      control,
      part5,
      r12Anchors,
      r6Anchors,
    }),
  );

  const dedupedIssues = dedupeIssues(issues);

  return {
    method: 'medial-hub-triadic-closure-bench-v0',
    diagnosticScope: 'station-iii-bench-2-computes-and-reports-only',
    verdictStatus: 'no-verdict-declared-d3-judged-by-auditor-against-tribunal',
    fieldCueUnblockStatus: 'not-authorized',
    s0Status: 'not-authorized',
    uiStatus: 'no-ui',
    shapeMutationStatus: 'no-shape-mutation',
    packetWriteStatus: 'no-packet-write',
    operationRegistryStatus: 'not-operation-registry-work',
    topologyStatus: 'not-topology-workspace',
    crossCheckedReports: {
      discriminator: { method: disc.method, ok: disc.ok, usage: 'primal-assignment-atoms + control flag atoms; never a pass/fail criterion' },
      octaCarrierBase: { method: branchA.method, ok: branchA.ok, usage: 'cross-check-only for the re-derived R6 lifts' },
      hubCapsule: { method: hubCapsule.method, ok: hubCapsule.ok, usage: 'cross-check-only for the re-derived control lifts' },
    },
    part0: {
      r6Rows,
      r6DistinctLiftCount: distinctCount(r6Rows.map((row) => row.signedLift)),
      r6CrossCheckAgreementCount,
      facePairs,
      indexRecoveryStatement:
        'the four A3 indices are recovered on the octa route as the four antipodal octa-face pairs (positive-class face + its antipode; the antipodal map swaps alternation classes), equivalently the four hexagonal great-circle planes of the core; each child\'s ordered root is eps_i - eps_j with i = the face-pair of its positive-class incident face and j = the face-pair of its negative-class incident face',
      r12Rows: r12.rows,
      r12DistinctLiftValueCount: distinctCount(r12.rows.map((row) => row.signedLift)),
      r12DistinctRootIdentityCount: distinctCount(r12.rows.map((row) => row.orderedRootIdentity)),
      r12CanonicalQuadrangle: r12.canonicalQuadrangle,
    },
    part1: {
      triadSelectionRule:
        'per hexagon, order the 6 members by angle in the hexagon plane; the two alternation classes (positions 0,2,4 and 1,3,5) are the two inscribed triangles; both reported',
      bracketing: '(lift(alpha) * lift(beta)) * lift(gamma), left-associated, capsule-local Fano product',
      octaTriads,
      r12GaugeSweep,
      r6GaugeSweep,
      bench1AccumulationR6,
      bench1AccumulationR12,
    },
    part2: {
      projectionChainR12:
        'carrier root identity (from face-pair classes) -> index direction u_m = outward normal of pair m\'s positive-class face (computed from octa face geometry) -> anchor = u_i - u_j; canonical cuboctahedron coordinates are never an input',
      projectionChainR6:
        'R6 signed lift -> ray determines the spatial axis (F2 complement-pairs-become-axes law), sign determines the pole -> anchor = sign * axis positive-pole position',
      r12Anchors,
      r6Anchors,
      r12Metrics,
      r6Metrics,
    },
    part3: {
      r12Correspondence,
      r6Correspondence,
    },
    part4: control,
    part5,
    integrityIssueCount: dedupedIssues.length,
    integrityIssues: dedupedIssues,
    ok: dedupedIssues.length === 0,
  };
}

// ----------------------------------------------------------------------------
// octa derivations (duplicated Branch A pipeline; re-derive, never echo)
// ----------------------------------------------------------------------------

interface BenchFrame {
  axes: Array<{
    axisIndex: number;
    positivePoleVertexId: string;
    negativePoleVertexId: string;
    assignedUnit: BenchFanoUnit;
  }>;
  carrierByVertexId: Map<string, BenchSignedBasis>;
  signByVertexId: Map<string, 1 | -1>;
}

interface BenchFaceRecord {
  faceId: string;
  vertexIds: string[];
  outwardCycle: string[];
  faceClass: 'positive' | 'negative';
  outwardNormalDirection: Vec3;
}

interface BenchChild {
  childId: string;
  endpointIds: [string, string];
  position: Vec3;
}

interface BenchTriadMembers {
  triadId: string;
  hexagonIndex: number;
  alternationClass: 'A' | 'B';
  memberIds: string[];
}

interface BenchAntipodalChildPair {
  pairId: string;
  leftChildId: string;
  rightChildId: string;
}

interface BenchSquare {
  squareId: string;
  outwardCycle: string[];
}

function deriveOctaFrame(octa: Shape, issues: BenchIssue[]): BenchFrame {
  const vertexIds = Object.keys(octa.vertices);
  const paired = new Set<string>();
  const pairs: Array<[string, string]> = [];

  for (const vertexId of vertexIds) {
    if (paired.has(vertexId)) {
      continue;
    }

    const antipode = vertexIds.find(
      (candidateId) =>
        candidateId !== vertexId &&
        !paired.has(candidateId) &&
        isZeroVec3(addVec3(octa.vertices[vertexId].position, octa.vertices[candidateId].position)),
    );

    if (!antipode) {
      issues.push({ code: 'bench-axis-underivable', message: `Vertex ${vertexId} has no antipode.` });
      continue;
    }

    paired.add(vertexId);
    paired.add(antipode);
    pairs.push([vertexId, antipode]);
  }

  if (pairs.length !== 3) {
    issues.push({ code: 'bench-axis-count-mismatch', message: `Expected 3 axes, derived ${pairs.length}.` });
  }

  let p3Pair = pairs[2];
  let p3 = p3Pair?.[0];

  if (pairs[0] && pairs[1] && p3Pair) {
    const det = determinant3(
      octa.vertices[pairs[0][0]].position,
      octa.vertices[pairs[1][0]].position,
      octa.vertices[p3Pair[0]].position,
    );

    p3 = det > 0 ? p3Pair[0] : p3Pair[1];
  }

  const lineUnits: BenchFanoUnit[] = ['e1', 'e2', 'e3'];
  const carrierByVertexId = new Map<string, BenchSignedBasis>();
  const signByVertexId = new Map<string, 1 | -1>();
  const axes = pairs.map((pair, index) => {
    const positive = index === 2 && p3 ? p3 : pair[0];
    const negative = positive === pair[0] ? pair[1] : pair[0];

    carrierByVertexId.set(positive, { sign: '+', unit: lineUnits[index] });
    carrierByVertexId.set(negative, { sign: '-', unit: lineUnits[index] });
    signByVertexId.set(positive, 1);
    signByVertexId.set(negative, -1);

    return {
      axisIndex: index + 1,
      positivePoleVertexId: positive,
      negativePoleVertexId: negative,
      assignedUnit: lineUnits[index],
    };
  });

  return { axes, carrierByVertexId, signByVertexId };
}

function deriveFaceClassRecords(
  octa: Shape,
  frame: BenchFrame,
  issues: BenchIssue[],
): BenchFaceRecord[] {
  const records: BenchFaceRecord[] = octa.faces.map((face) => {
    const outwardCycle = orientCycleOutward(face.vertexIds, octa);
    const signProduct = face.vertexIds.reduce<1 | -1>(
      (product, vertexId) => ((product * (frame.signByVertexId.get(vertexId) ?? 0)) >= 0 ? 1 : -1),
      1,
    );
    const normalDirection = face.vertexIds.reduce<Vec3>(
      (sum, vertexId) => addVec3(sum, octa.vertices[vertexId].position),
      [0, 0, 0],
    );

    return {
      faceId: face.id,
      vertexIds: [...face.vertexIds],
      outwardCycle,
      faceClass: signProduct === 1 ? 'positive' : 'negative',
      outwardNormalDirection: normalDirection,
    };
  });
  const positiveCount = records.filter((record) => record.faceClass === 'positive').length;

  if (positiveCount !== 4 || records.length !== 8) {
    issues.push({
      code: 'bench-face-2-coloring-invalid',
      message: `Face alternation 2-coloring must give 4/4 over 8 faces; got ${positiveCount}/${records.length}.`,
    });
  }

  return records;
}

function deriveEdgeDirections(
  octa: Shape,
  faceRecords: BenchFaceRecord[],
  issues: BenchIssue[],
): Map<string, { edgeId: string; fromVertexId: string; toVertexId: string }> {
  const directions = new Map<string, { edgeId: string; fromVertexId: string; toVertexId: string }>();

  for (const edge of octa.edges) {
    const [u, v] = edge.vertexIds;
    const positiveFace = faceRecords.find(
      (record) =>
        record.faceClass === 'positive' &&
        record.vertexIds.includes(u) &&
        record.vertexIds.includes(v),
    );
    const direction = positiveFace ? directedEdgeFromCycle(positiveFace.outwardCycle, u, v) : null;

    if (!direction) {
      issues.push({
        code: 'bench-edge-orientation-underivable',
        message: `Edge ${edge.id} has no positive-class boundary direction.`,
      });
      continue;
    }

    directions.set(unorderedPairKey(u, v), {
      edgeId: edge.id,
      fromVertexId: direction[0],
      toVertexId: direction[1],
    });
  }

  return directions;
}

function deriveChildren(
  octa: Shape,
  ambo: Shape,
  childVertexIds: string[],
  issues: BenchIssue[],
): BenchChild[] {
  const children: BenchChild[] = [];

  for (const childId of childVertexIds) {
    const child = ambo.vertices[childId];
    const sourcePair = child?.createdBy.sourceVertexIds;

    if (!child || !sourcePair || sourcePair.length !== 2) {
      issues.push({ code: 'bench-child-genealogy-missing', message: `Child ${childId} lacks edge genealogy.` });
      continue;
    }

    const expectedMidpoint = scaleVec3(
      addVec3(octa.vertices[sourcePair[0]].position, octa.vertices[sourcePair[1]].position),
      0.5,
    );

    if (!isZeroVec3(subtractVec3(child.position, expectedMidpoint))) {
      issues.push({
        code: 'bench-child-position-disagreement',
        message: `Child ${childId} position does not match its genealogy midpoint.`,
      });
    }

    children.push({
      childId,
      endpointIds: [sourcePair[0], sourcePair[1]],
      position: child.position,
    });
  }

  if (children.length !== 12) {
    issues.push({ code: 'bench-child-count-mismatch', message: `Expected 12 children, derived ${children.length}.` });
  }

  return children;
}

function deriveFacePairs(
  octa: Shape,
  faceRecords: BenchFaceRecord[],
  children: BenchChild[],
  issues: BenchIssue[],
): BenchFacePairRecordV0[] {
  const positiveFaces = faceRecords.filter((record) => record.faceClass === 'positive');
  const pairs: BenchFacePairRecordV0[] = [];

  positiveFaces.forEach((positiveFace, index) => {
    const antipodalVertexIds = positiveFace.vertexIds.map((vertexId) => {
      const position = scaleVec3(octa.vertices[vertexId].position, -1);

      return Object.keys(octa.vertices).find((candidateId) =>
        isZeroVec3(subtractVec3(octa.vertices[candidateId].position, position)),
      );
    });
    const negativeFace = faceRecords.find(
      (record) =>
        record.faceId !== positiveFace.faceId &&
        antipodalVertexIds.every((vertexId) => vertexId && record.vertexIds.includes(vertexId)),
    );

    if (!negativeFace) {
      issues.push({
        code: 'bench-face-pair-underivable',
        message: `Positive-class face ${positiveFace.faceId} has no antipodal partner face.`,
      });
      return;
    }

    if (negativeFace.faceClass !== 'negative') {
      issues.push({
        code: 'bench-face-pair-class-violation',
        message: `Antipode of positive-class face ${positiveFace.faceId} is not negative-class; alternation/antipodality structure broken.`,
      });
    }

    const normal = positiveFace.outwardNormalDirection;
    const hexagonChildIds = children
      .filter((child) => Math.abs(dotVec3(child.position, normal)) <= POSITION_EPSILON)
      .map((child) => child.childId);

    pairs.push({
      pairIndex: index + 1,
      positiveClassFaceId: positiveFace.faceId,
      negativeClassFaceId: negativeFace.faceId,
      normal,
      hexagonChildIds,
    });
  });

  if (pairs.length !== 4 || pairs.some((pair) => pair.hexagonChildIds.length !== 6)) {
    issues.push({
      code: 'bench-hexagon-census-mismatch',
      message: `Expected 4 face pairs each with a 6-child hexagon; got ${pairs
        .map((pair) => `${pair.pairIndex}:${pair.hexagonChildIds.length}`)
        .join(', ')}.`,
    });
  }

  for (const child of children) {
    const onCount = pairs.filter((pair) => pair.hexagonChildIds.includes(child.childId)).length;

    if (onCount !== 2) {
      issues.push({
        code: 'bench-child-hexagon-incidence-mismatch',
        message: `Child ${child.childId} lies on ${onCount} hexagons; expected exactly 2.`,
      });
    }
  }

  return pairs;
}

function deriveR12Base(
  children: BenchChild[],
  facePairs: BenchFacePairRecordV0[],
  issues: BenchIssue[],
): {
  rows: BenchR12CarrierRowV0[];
  rowByChildId: Map<string, BenchR12CarrierRowV0>;
  liftByChildId: Map<string, BenchSignedBasis>;
  canonicalQuadrangle: string[];
} {
  const canonicalQuadrangle: BenchFanoUnit[] = ['e1', 'e2', 'e4', 'e7'];
  const rows: BenchR12CarrierRowV0[] = [];
  const liftByChildId = new Map<string, BenchSignedBasis>();
  const identityByChildId = new Map<string, { i: number; j: number }>();

  for (const child of children) {
    const offPairs = facePairs.filter((pair) => !pair.hexagonChildIds.includes(child.childId));

    if (offPairs.length !== 2) {
      issues.push({
        code: 'bench-r12-root-indices-underivable',
        message: `Child ${child.childId} is off ${offPairs.length} hexagons; root indices underivable.`,
      });
      continue;
    }

    // Order: i = pair whose positive-class face is incident to the child's edge.
    const incidentPositivePair = offPairs.find((pair) =>
      Math.abs(dotVec3(child.position, pair.normal)) > POSITION_EPSILON &&
      dotVec3(child.position, pair.normal) > 0,
    );
    const otherPair = offPairs.find((pair) => pair !== incidentPositivePair);

    if (!incidentPositivePair || !otherPair) {
      issues.push({
        code: 'bench-r12-order-underivable',
        message: `Child ${child.childId} ordered root indices underivable from face classes.`,
      });
      continue;
    }

    identityByChildId.set(child.childId, {
      i: incidentPositivePair.pairIndex,
      j: otherPair.pairIndex,
    });
  }

  for (const child of children) {
    const identity = identityByChildId.get(child.childId);

    if (!identity) {
      continue;
    }

    const lift = multiplyBench(
      { sign: '+', unit: canonicalQuadrangle[identity.i - 1] },
      { sign: '+', unit: canonicalQuadrangle[identity.j - 1] },
    );
    const antipodalChild = children.find(
      (candidate) =>
        candidate.childId !== child.childId &&
        isZeroVec3(addVec3(candidate.position, child.position)),
    );
    const antipodalIdentity = antipodalChild
      ? identityByChildId.get(antipodalChild.childId)
      : undefined;
    const antipodalRootIsNegation =
      antipodalIdentity !== undefined &&
      antipodalIdentity.i === identity.j &&
      antipodalIdentity.j === identity.i;

    if (!antipodalRootIsNegation) {
      issues.push({
        code: 'bench-r12-antipodal-root-not-negated',
        message: `Child ${child.childId} antipodal root identity is not the negation of its own.`,
      });
    }

    liftByChildId.set(child.childId, lift);
    rows.push({
      childId: child.childId,
      orderedRootIdentity: `eps_${identity.i}-eps_${identity.j}`,
      positiveClassPairIndex: identity.i,
      negativeClassPairIndex: identity.j,
      signedLift: formatBench(lift),
      antipodalChildId: antipodalChild?.childId ?? 'missing',
      antipodalRootIsNegation,
    });
  }

  const rowByChildId = new Map(rows.map((row) => [row.childId, row]));

  if (rows.length !== 12 || distinctCount(rows.map((row) => row.orderedRootIdentity)) !== 12) {
    issues.push({
      code: 'bench-r12-root-identity-census-mismatch',
      message: `Expected 12 distinct ordered root identities; got ${rows.length} rows / ${distinctCount(
        rows.map((row) => row.orderedRootIdentity),
      )} distinct.`,
    });
  }

  return { rows, rowByChildId, liftByChildId, canonicalQuadrangle };
}

// NOTE on the R12 order derivation above: a child lies ON the two hexagons whose
// pairs are NOT its root indices, and OFF the two hexagons of its root indices;
// being off hexagon m means position . n_m != 0. The sign of that dot product
// distinguishes the child's two off-pairs: positive against the pair whose
// positive-class face is incident to the child's source edge (the outward side),
// negative against the other. That sign IS the class structure of the incident
// faces, so i (first index) = the off-pair with positive dot, j = the off-pair
// with negative dot.

function deriveTriadMembers(
  hexagons: string[][],
  positionOf: (id: string) => Vec3 | number[],
  hexagonNormals: Array<Vec3 | number[]>,
  issues: BenchIssue[],
  routeLabel: string,
): BenchTriadMembers[] {
  const triads: BenchTriadMembers[] = [];

  hexagons.forEach((memberIds, hexagonIndexZero) => {
    if (memberIds.length !== 6) {
      issues.push({
        code: 'bench-hexagon-size-mismatch',
        message: `${routeLabel} hexagon ${hexagonIndexZero + 1} has ${memberIds.length} members; expected 6.`,
      });
      return;
    }

    const positions = memberIds.map((id) => [...positionOf(id)]);
    const basis = planeBasis(positions, hexagonNormals[hexagonIndexZero] as number[]);

    if (!basis) {
      issues.push({
        code: 'bench-hexagon-plane-basis-underivable',
        message: `${routeLabel} hexagon ${hexagonIndexZero + 1} plane basis underivable.`,
      });
      return;
    }

    const ordered = memberIds
      .map((id, index) => ({
        id,
        angle: Math.atan2(
          dotN(positions[index], basis.b2),
          dotN(positions[index], basis.b1),
        ),
      }))
      .sort((left, right) => left.angle - right.angle)
      .map((entry) => entry.id);

    triads.push({
      triadId: `${routeLabel}-hexagon-${hexagonIndexZero + 1}-triad-A`,
      hexagonIndex: hexagonIndexZero + 1,
      alternationClass: 'A',
      memberIds: [ordered[0], ordered[2], ordered[4]],
    });
    triads.push({
      triadId: `${routeLabel}-hexagon-${hexagonIndexZero + 1}-triad-B`,
      hexagonIndex: hexagonIndexZero + 1,
      alternationClass: 'B',
      memberIds: [ordered[1], ordered[3], ordered[5]],
    });
  });

  return triads;
}

function deriveAntipodalChildPairs(
  children: BenchChild[],
  issues: BenchIssue[],
): BenchAntipodalChildPair[] {
  const pairs: BenchAntipodalChildPair[] = [];
  const paired = new Set<string>();

  for (const child of children) {
    if (paired.has(child.childId)) {
      continue;
    }

    const partner = children.find(
      (candidate) =>
        candidate.childId !== child.childId &&
        !paired.has(candidate.childId) &&
        isZeroVec3(addVec3(candidate.position, child.position)),
    );

    if (!partner) {
      issues.push({
        code: 'bench-antipodal-child-unpaired',
        message: `Child ${child.childId} has no geometric antipode.`,
      });
      continue;
    }

    paired.add(child.childId);
    paired.add(partner.childId);
    pairs.push({
      pairId: `antipodal:${child.childId}|${partner.childId}`,
      leftChildId: child.childId,
      rightChildId: partner.childId,
    });
  }

  return pairs;
}

function deriveCoreSquares(ambo: Shape, faceIds: string[], issues: BenchIssue[]): BenchSquare[] {
  const squares: BenchSquare[] = [];

  for (const faceId of faceIds) {
    const face = ambo.faces.find((candidate) => candidate.id === faceId);

    if (!face) {
      issues.push({ code: 'bench-core-face-missing', message: `Core face ${faceId} missing.` });
      continue;
    }

    if (face.vertexIds.length === 4) {
      squares.push({
        squareId: face.id,
        outwardCycle: orientCycleOutward(face.vertexIds, ambo),
      });
    }
  }

  if (squares.length !== 6) {
    issues.push({
      code: 'bench-core-square-census-mismatch',
      message: `Expected 6 core squares, derived ${squares.length}.`,
    });
  }

  return squares;
}

function buildAccumulationRows(
  hexagons: string[][],
  pairs: BenchAntipodalChildPair[],
  liftById: Map<string, BenchSignedBasis>,
): BenchAntipodalPairRowV0[] {
  const rows: BenchAntipodalPairRowV0[] = [];

  hexagons.forEach((memberIds, hexagonIndexZero) => {
    for (const pair of pairs) {
      if (!memberIds.includes(pair.leftChildId) || !memberIds.includes(pair.rightChildId)) {
        continue;
      }

      const left = liftById.get(pair.leftChildId) ?? { sign: '+' as BenchSign, unit: '1' as BenchSignedBasisUnit };
      const right = liftById.get(pair.rightChildId) ?? { sign: '+' as BenchSign, unit: '1' as BenchSignedBasisUnit };

      rows.push({
        hexagonIndex: hexagonIndexZero + 1,
        pairId: pair.pairId,
        leftId: pair.leftChildId,
        rightId: pair.rightChildId,
        leftLift: formatBench(left),
        rightLift: formatBench(right),
        signRelation:
          left.unit === right.unit
            ? left.sign !== right.sign
              ? 'opposite-sign'
              : 'same-sign'
            : 'different-ray',
      });
    }
  });

  return rows;
}

// ----------------------------------------------------------------------------
// gauge sweeps
// ----------------------------------------------------------------------------

function runQuadrangleGaugeSweep(args: {
  sweepId: string;
  indexCount: number;
  liftPairs: Array<{ id: string; leftIndex: number; rightIndex: number }>;
  triads: BenchTriadMembers[];
  antipodalPairs: Array<{ pairId: string; leftChildId: string; rightChildId: string }>;
  squares: BenchSquare[];
  issues: BenchIssue[];
}): BenchGaugeSweepV0 {
  const quadrangles = combinations([1, 2, 3, 4, 5, 6, 7], 4).filter(isCompleteQuadrangle);

  if (quadrangles.length !== 7) {
    args.issues.push({
      code: 'bench-quadrangle-enumeration-mismatch',
      message: `Expected 7 complete quadrangles, enumerated ${quadrangles.length}.`,
    });
  }

  const triadCounters = args.triads.map(() => new Map<string, number>());
  const antipodalCounter = new Map<string, number>();
  const holonomyCounter = new Map<string, number>();
  let labelingCount = 0;

  for (const quadrangle of quadrangles) {
    for (const labeling of permutations(quadrangle)) {
      labelingCount += 1;

      const liftById = new Map<string, BenchSignedBasis>();

      for (const pair of args.liftPairs) {
        liftById.set(
          pair.id,
          multiplyBench(
            { sign: '+', unit: `e${labeling[pair.leftIndex - 1]}` as BenchFanoUnit },
            { sign: '+', unit: `e${labeling[pair.rightIndex - 1]}` as BenchFanoUnit },
          ),
        );
      }

      accumulateSweep(liftById, args.triads, args.antipodalPairs, args.squares, triadCounters, antipodalCounter, holonomyCounter);
    }
  }

  return {
    sweepId: args.sweepId,
    labelingCount,
    validLabelingCount: labelingCount,
    invalidLabelingCount: 0,
    triadProductDistributions: args.triads.map((triad, index) => ({
      label: triad.triadId,
      counts: counterToRows(triadCounters[index]),
    })),
    antipodalSignRelationCounts: counterToRows(antipodalCounter),
    squareHolonomyValueCounts: counterToRows(holonomyCounter),
  };
}

function runLineGaugeSweep(args: {
  sweepId: string;
  frame: BenchFrame;
  octa: Shape;
  edgeDirections: Map<string, { edgeId: string; fromVertexId: string; toVertexId: string }>;
  children: BenchChild[];
  triads: BenchTriadMembers[];
  antipodalPairs: Array<{ pairId: string; leftChildId: string; rightChildId: string }>;
  squares: BenchSquare[];
  issues: BenchIssue[];
}): BenchGaugeSweepV0 {
  const triadCounters = args.triads.map(() => new Map<string, number>());
  const antipodalCounter = new Map<string, number>();
  const holonomyCounter = new Map<string, number>();
  let labelingCount = 0;
  let validLabelingCount = 0;

  for (const line of ORIENTED_FANO_TRIPLES) {
    for (const labeling of permutations([...line])) {
      labelingCount += 1;

      const units = labeling.map((value) => `e${value}` as BenchFanoUnit);
      const selfCheck = multiplyBench({ sign: '+', unit: units[0] }, { sign: '+', unit: units[1] });
      const isValid = selfCheck.sign === '+' && selfCheck.unit === units[2];

      if (!isValid) {
        continue;
      }

      validLabelingCount += 1;

      const carrierByVertexId = new Map<string, BenchSignedBasis>();

      args.frame.axes.forEach((axis, index) => {
        carrierByVertexId.set(axis.positivePoleVertexId, { sign: '+', unit: units[index] });
        carrierByVertexId.set(axis.negativePoleVertexId, { sign: '-', unit: units[index] });
      });

      const liftById = new Map<string, BenchSignedBasis>();

      for (const child of args.children) {
        const direction = args.edgeDirections.get(
          unorderedPairKey(child.endpointIds[0], child.endpointIds[1]),
        );
        const fromCarrier = direction ? carrierByVertexId.get(direction.fromVertexId) : undefined;
        const toCarrier = direction ? carrierByVertexId.get(direction.toVertexId) : undefined;

        if (fromCarrier && toCarrier) {
          liftById.set(child.childId, multiplyBench(fromCarrier, toCarrier));
        }
      }

      accumulateSweep(liftById, args.triads, args.antipodalPairs, args.squares, triadCounters, antipodalCounter, holonomyCounter);
    }
  }

  return {
    sweepId: args.sweepId,
    labelingCount,
    validLabelingCount,
    invalidLabelingCount: labelingCount - validLabelingCount,
    triadProductDistributions: args.triads.map((triad, index) => ({
      label: triad.triadId,
      counts: counterToRows(triadCounters[index]),
    })),
    antipodalSignRelationCounts: counterToRows(antipodalCounter),
    squareHolonomyValueCounts: counterToRows(holonomyCounter),
  };
}

function accumulateSweep(
  liftById: Map<string, BenchSignedBasis>,
  triads: BenchTriadMembers[],
  antipodalPairs: Array<{ pairId: string; leftChildId: string; rightChildId: string }>,
  squares: BenchSquare[],
  triadCounters: Array<Map<string, number>>,
  antipodalCounter: Map<string, number>,
  holonomyCounter: Map<string, number>,
): void {
  triads.forEach((triad, index) => {
    const product = leftAssociatedProduct(
      triad.memberIds.map((id) => liftById.get(id) ?? { sign: '+' as BenchSign, unit: '1' as BenchSignedBasisUnit }),
    );

    increment(triadCounters[index], formatBench(product));
  });

  for (const pair of antipodalPairs) {
    const left = liftById.get(pair.leftChildId);
    const right = liftById.get(pair.rightChildId);

    if (!left || !right) {
      continue;
    }

    increment(
      antipodalCounter,
      left.unit === right.unit
        ? left.sign !== right.sign
          ? 'opposite-sign'
          : 'same-sign'
        : 'different-ray',
    );
  }

  for (const square of squares) {
    const cycles = squareVariants(square.outwardCycle);

    for (const cycle of cycles) {
      const product = leftAssociatedProduct(
        cycle.map((id) => liftById.get(id) ?? { sign: '+' as BenchSign, unit: '1' as BenchSignedBasisUnit }),
      );

      increment(holonomyCounter, formatBench(product));
    }
  }
}

function squareVariants(cycle: string[]): string[][] {
  const reversed = [...cycle].reverse();
  const variants: string[][] = [];

  for (let rotation = 0; rotation < 4; rotation += 1) {
    variants.push(rotate(cycle, rotation));
  }

  for (let rotation = 0; rotation < 4; rotation += 1) {
    variants.push(rotate(reversed, rotation));
  }

  return variants;
}

// ----------------------------------------------------------------------------
// metrics, planes, correspondence
// ----------------------------------------------------------------------------

function computeMetrics(metricsId: string, anchorRows: BenchAnchorRowV0[]): BenchMetricsV0 {
  const anchors = anchorRows.map((row) => row.anchor);
  const distinct: Vec3[] = [];
  const collisionGroups = new Map<string, string[]>();

  for (const row of anchorRows) {
    const key = vecKey(row.anchor);
    const group = collisionGroups.get(key) ?? [];

    group.push(row.id);
    collisionGroups.set(key, group);

    if (!distinct.some((candidate) => isZeroVec3(subtractVec3(candidate, row.anchor)))) {
      distinct.push(row.anchor);
    }
  }

  const radii = dedupeNumbers(distinct.map((anchor) => magnitude(anchor)));
  const distances: number[] = [];

  for (let i = 0; i < distinct.length; i += 1) {
    for (let j = i + 1; j < distinct.length; j += 1) {
      distances.push(magnitude(subtractVec3(distinct[i], distinct[j])));
    }
  }

  const rawPositiveDistances = distances.filter((value) => value > POSITION_EPSILON);
  const rawEdgeLength = rawPositiveDistances.length ? Math.min(...rawPositiveDistances) : null;
  const edgeLength = rawEdgeLength;
  const adjacentPairs: Array<[Vec3, Vec3]> = [];

  if (rawEdgeLength !== null) {
    for (let i = 0; i < distinct.length; i += 1) {
      for (let j = i + 1; j < distinct.length; j += 1) {
        if (
          Math.abs(magnitude(subtractVec3(distinct[i], distinct[j])) - rawEdgeLength) <=
          POSITION_EPSILON
        ) {
          adjacentPairs.push([distinct[i], distinct[j]]);
        }
      }
    }
  }

  const angles = dedupeNumbers(
    adjacentPairs.map(([a, b]) =>
      (Math.acos(clamp(dotVec3(a, b) / (magnitude(a) * magnitude(b)), -1, 1)) * 180) / Math.PI,
    ),
  );
  const ratios = dedupeNumbers(
    adjacentPairs.flatMap(([a, b]) => {
      const edge = magnitude(subtractVec3(a, b));

      return [edge / magnitude(a), edge / magnitude(b)];
    }),
  );

  return {
    metricsId,
    anchorCount: anchorRows.length,
    distinctAnchorCount: distinct.length,
    collisionGroups: [...collisionGroups.values()].filter((group) => group.length > 1),
    distinctRadii: radii,
    edgeLength: edgeLength === null ? null : round(edgeLength),
    adjacentPairCount: adjacentPairs.length,
    distinctAdjacencyAngitudesDegrees: angles,
    distinctEdgeOverRadiusRatios: ratios,
    centralPlaneCensus: centralPlaneCensus(distinct),
  };
}

function centralPlaneCensus(anchors: Vec3[]): Array<{ memberCount: number; planeCount: number }> {
  const planes = new Map<string, Set<number>>();

  for (let i = 0; i < anchors.length; i += 1) {
    for (let j = i + 1; j < anchors.length; j += 1) {
      const normal = crossVec3(anchors[i], anchors[j]);

      if (magnitude(normal) <= POSITION_EPSILON) {
        continue;
      }

      const unit = canonicalDirection(normalizeVec3(normal));
      const key = vecKey(unit);
      const members = planes.get(key) ?? new Set<number>();

      anchors.forEach((anchor, index) => {
        if (Math.abs(dotVec3(anchor, unit)) <= POSITION_EPSILON) {
          members.add(index);
        }
      });
      planes.set(key, members);
    }
  }

  const histogram = new Map<number, number>();

  for (const members of planes.values()) {
    histogram.set(members.size, (histogram.get(members.size) ?? 0) + 1);
  }

  return [...histogram.entries()]
    .map(([memberCount, planeCount]) => ({ memberCount, planeCount }))
    .sort((left, right) => left.memberCount - right.memberCount);
}

function buildCorrespondence(
  routeLabel: string,
  hexagons: string[][],
  anchorRows: BenchAnchorRowV0[],
  triads: Array<{ hexagonIndex: number; memberIds: readonly string[]; productLabel: string }>,
): BenchHexagonCorrespondenceRowV0[] {
  const anchorById = new Map(anchorRows.map((row) => [row.id, row.anchor]));
  const allDistinctAnchors: Vec3[] = [];

  for (const row of anchorRows) {
    if (!allDistinctAnchors.some((candidate) => isZeroVec3(subtractVec3(candidate, row.anchor)))) {
      allDistinctAnchors.push(row.anchor);
    }
  }

  return hexagons.map((memberIds, hexagonIndexZero) => {
    const hexagonIndex = hexagonIndexZero + 1;
    const anchors = memberIds
      .map((id) => anchorById.get(id))
      .filter((anchor): anchor is Vec3 => anchor !== undefined);
    const distinct: Vec3[] = [];

    for (const anchor of anchors) {
      if (!distinct.some((candidate) => isZeroVec3(subtractVec3(candidate, anchor)))) {
        distinct.push(anchor);
      }
    }

    let coplanar = false;
    let planeNormal: Vec3 | null = null;

    for (let i = 0; i < distinct.length && !planeNormal; i += 1) {
      for (let j = i + 1; j < distinct.length && !planeNormal; j += 1) {
        const normal = crossVec3(distinct[i], distinct[j]);

        if (magnitude(normal) > POSITION_EPSILON) {
          planeNormal = normalizeVec3(normal);
        }
      }
    }

    if (planeNormal) {
      coplanar = distinct.every(
        (anchor) => Math.abs(dotVec3(anchor, planeNormal as Vec3)) <= POSITION_EPSILON,
      );
    }

    const inHexAngles: number[] = [];
    const inHexRatios: number[] = [];

    if (coplanar && planeNormal && distinct.length >= 3) {
      const basis = planeBasis(distinct.map((anchor) => [...anchor]), [...(planeNormal as Vec3)]);

      if (basis) {
        const ordered = distinct
          .map((anchor) => ({
            anchor,
            angle: Math.atan2(dotN([...anchor], basis.b2), dotN([...anchor], basis.b1)),
          }))
          .sort((left, right) => left.angle - right.angle)
          .map((entry) => entry.anchor);

        for (let index = 0; index < ordered.length; index += 1) {
          const current = ordered[index];
          const next = ordered[(index + 1) % ordered.length];
          const angle =
            (Math.acos(
              clamp(dotVec3(current, next) / (magnitude(current) * magnitude(next)), -1, 1),
            ) *
              180) /
            Math.PI;

          inHexAngles.push(angle);
          inHexRatios.push(magnitude(subtractVec3(current, next)) / magnitude(current));
        }
      }
    }

    const censusPlaneIdentified =
      distinct.length === 6 &&
      coplanar &&
      planeNormal !== null &&
      allDistinctAnchors.filter(
        (anchor) => Math.abs(dotVec3(anchor, planeNormal as Vec3)) <= POSITION_EPSILON,
      ).length === 6;
    const hexagonTriads = triads.filter((triad) => triad.hexagonIndex === hexagonIndex);
    const triadAnchorSumMagnitudes = hexagonTriads.map((triad) => {
      const sum = triad.memberIds.reduce<Vec3>(
        (accumulator, id) => addVec3(accumulator, anchorById.get(id) ?? [0, 0, 0]),
        [0, 0, 0],
      );

      return round(magnitude(sum));
    });

    return {
      correspondenceId: `${routeLabel}-hexagon-${hexagonIndex}`,
      hexagonIndex,
      carrierMemberIds: memberIds,
      anchorImageDistinctCount: distinct.length,
      anchorsCoplanarThroughOrigin: coplanar,
      inHexagonDistinctAdjacencyAnglesDegrees: dedupeNumbers(inHexAngles),
      inHexagonDistinctEdgeOverRadiusRatios: dedupeNumbers(inHexRatios),
      triadAnchorSumMagnitudes,
      anchorGreatCircleIdentified: censusPlaneIdentified,
      algebraicTriadProducts: hexagonTriads.map((triad) => triad.productLabel),
    };
  });
}

// ----------------------------------------------------------------------------
// tetra-hub control route
// ----------------------------------------------------------------------------

function buildControlRoute(
  disc: OctonionVsA3MedialCarrierDiscriminatorV0Report,
  hubCapsule: HubLayerSourceStateCapsuleV0Report,
  issues: BenchIssue[],
): MedialHubTriadicClosureBenchV0Report['part4'] {
  const indexLabels = ['A', 'B', 'C', 'D'] as const;
  const flags = disc.flagRows.map((row) => ({
    flagId: row.flagId as string,
    shared: row.sharedPrimalVertex as string,
    omitted: row.omittedPrimalVertex as string,
    root: indexLabels.map((label) => row.rootCoordinate[label]),
  }));
  const liftByFlagId = new Map<string, BenchSignedBasis>();

  for (const flag of flags) {
    liftByFlagId.set(
      flag.flagId,
      multiplyBench(
        { sign: '+', unit: disc.primalCarrierAssignment[flag.shared as 'A'] as BenchFanoUnit },
        { sign: '+', unit: disc.primalCarrierAssignment[flag.omitted as 'A'] as BenchFanoUnit },
      ),
    );
  }

  const capsuleLiftByFlagId = new Map(
    hubCapsule.flagStates.map((state) => [state.flagId as string, state.recomputedSignedLiftLabel]),
  );
  const controlLiftCrossCheckAgreementCount = flags.filter(
    (flag) => capsuleLiftByFlagId.get(flag.flagId) === formatBench(liftByFlagId.get(flag.flagId) ?? { sign: '+', unit: '1' }),
  ).length;

  if (controlLiftCrossCheckAgreementCount !== 12) {
    issues.push({
      code: 'control-lift-cross-check-failed',
      message: `Control lifts must agree with the hub capsule on 12/12; got ${controlLiftCrossCheckAgreementCount}/12.`,
    });
  }

  const hexagons: string[][] = indexLabels.map((label, indexZero) =>
    flags.filter((flag) => flag.root[indexZero] === 0).map((flag) => flag.flagId),
  );

  if (hexagons.some((hexagon) => hexagon.length !== 6)) {
    issues.push({
      code: 'control-hexagon-census-mismatch',
      message: `Control hexagons must each have 6 flags; got ${hexagons
        .map((hexagon) => hexagon.length)
        .join(', ')}.`,
    });
  }

  const rootByFlagId = new Map(flags.map((flag) => [flag.flagId, flag.root]));
  const hexagonNormals = indexLabels.map((_, indexZero) => {
    const normal = [0, 0, 0, 0];

    normal[indexZero] = 1;

    return normal;
  });
  const controlTriadMembers = deriveTriadMembers(
    hexagons,
    (flagId) => rootByFlagId.get(flagId) ?? [0, 0, 0, 0],
    hexagonNormals,
    issues,
    'control',
  );
  const controlTriads: BenchControlTriadRowV0[] = controlTriadMembers.map((triad) => {
    const roots = triad.memberIds.map((flagId) => rootByFlagId.get(flagId) ?? [0, 0, 0, 0]);
    const additive = roots.reduce(
      (sum, root) => sum.map((value, index) => value + root[index]),
      [0, 0, 0, 0],
    );

    return {
      triadId: triad.triadId,
      hexagonIndex: triad.hexagonIndex,
      alternationClass: triad.alternationClass,
      memberFlagIds: triad.memberIds as [string, string, string],
      additiveRootSum: additive,
      additiveRootSumMagnitude: round(Math.sqrt(additive.reduce((sum, value) => sum + value * value, 0))),
      product: formatBench(
        leftAssociatedProduct(triad.memberIds.map((flagId) => requireBenchLift(liftByFlagId, flagId, issues))),
      ),
    };
  });
  const reverseFlagId = (flagId: string): string => {
    const [shared, omitted] = flagId.split('->');

    return `${omitted}->${shared}`;
  };
  const controlAntipodalPairsRaw = flags
    .filter((flag) => flag.flagId < reverseFlagId(flag.flagId))
    .map((flag) => ({
      pairId: `antipodal:${flag.flagId}|${reverseFlagId(flag.flagId)}`,
      leftChildId: flag.flagId,
      rightChildId: reverseFlagId(flag.flagId),
    }));
  const controlAntipodalPairs = buildAccumulationRows(hexagons, controlAntipodalPairsRaw, liftByFlagId);
  const controlGaugeSweep = runQuadrangleGaugeSweep({
    sweepId: 'control-quadrangle-sweep-7x24',
    indexCount: 4,
    liftPairs: flags.map((flag) => ({
      id: flag.flagId,
      leftIndex: indexLabels.indexOf(flag.shared as 'A') + 1,
      rightIndex: indexLabels.indexOf(flag.omitted as 'A') + 1,
    })),
    triads: controlTriadMembers,
    antipodalPairs: controlAntipodalPairsRaw,
    squares: [],
    issues,
  });
  const tetra = createSeedShape('tetrahedron');
  const tetraPositionByLabel = new Map<string, Vec3>();

  for (const vertex of Object.values(tetra.vertices)) {
    tetraPositionByLabel.set(vertex.data.label as string, vertex.position);
  }

  const controlAnchors: BenchAnchorRowV0[] = flags.map((flag) => {
    const sharedPosition = tetraPositionByLabel.get(flag.shared) ?? ([0, 0, 0] as Vec3);
    const omittedPosition = tetraPositionByLabel.get(flag.omitted) ?? ([0, 0, 0] as Vec3);

    return {
      id: flag.flagId,
      anchor: subtractVec3(sharedPosition, omittedPosition),
      chain: `carrier root identity ${flag.flagId} -> index directions = tetra seed vertex positions (the mechanism's own tetra frame) -> anchor = pos(shared) - pos(omitted)`,
    };
  });
  const controlMetrics = computeMetrics('control-metrics', controlAnchors);
  const controlCorrespondence = buildCorrespondence(
    'control',
    hexagons,
    controlAnchors,
    controlTriads.map((triad) => ({
      hexagonIndex: triad.hexagonIndex,
      memberIds: triad.memberFlagIds,
      productLabel: triad.product,
    })),
  );

  return {
    controlLiftCrossCheckAgreementCount,
    controlTriads,
    controlGaugeSweep,
    controlAntipodalPairs,
    projectionChainControl:
      'control anchors: index directions u_A..u_D = tetra seed vertex positions; anchor(flag X->Y) = pos(X) - pos(Y); carrier-derived via the flag root identity',
    controlAnchors,
    controlMetrics,
    controlCorrespondence,
  };
}

// ----------------------------------------------------------------------------
// ledger and integrity
// ----------------------------------------------------------------------------

function buildLedger(args: {
  r6Holonomy: Array<{ value: string; count: number }>;
  r12Holonomy: Array<{ value: string; count: number }>;
  r6Antipodality: Array<{ pairId: string; left: string; right: string }>;
  r12Antipodality: Array<{ pairId: string; left: string; right: string }>;
  r6Rows: BenchR6LiftRowV0[];
  r12Rows: BenchR12CarrierRowV0[];
  octaTriads: BenchTriadRowV0[];
  controlTriads: BenchControlTriadRowV0[];
  r12Metrics: BenchMetricsV0;
  r6Metrics: BenchMetricsV0;
  controlMetrics: BenchMetricsV0;
  r12GaugeSweep: BenchGaugeSweepV0;
  r6GaugeSweep: BenchGaugeSweepV0;
  controlGaugeSweep: BenchGaugeSweepV0;
  r12Correspondence: BenchHexagonCorrespondenceRowV0[];
  r6Correspondence: BenchHexagonCorrespondenceRowV0[];
  controlCorrespondence: BenchHexagonCorrespondenceRowV0[];
}): BenchLedgerRowV0[] {
  const rows: BenchLedgerRowV0[] = [];
  const push = (ledgerId: string, context: string, measurement: string) =>
    rows.push({ ledgerId, context, measurement, derivationStatus: '' });
  const antipodalitySummary = (
    entries: Array<{ pairId: string; left: string; right: string }>,
  ): string =>
    entries
      .map((entry) => `${entry.pairId}: ${entry.left} vs ${entry.right}`)
      .join('; ');
  const countsSummary = (counts: Array<{ value: string; count: number }>): string =>
    counts.map((entry) => `${entry.value} x${entry.count}`).join(', ');

  push(
    'ledger-r6-square-holonomy-recomputed',
    'octa-R6 (recomputed in this run from re-derived lifts; canonical labeling)',
    `48 left-associated square-cycle products: ${countsSummary(args.r6Holonomy)}`,
  );
  push(
    'ledger-r6-signed-antipodality-recomputed',
    'octa-R6 (recomputed in this run; canonical labeling)',
    antipodalitySummary(args.r6Antipodality),
  );
  push(
    'ledger-r12-square-holonomy',
    'octa-R12 (new measurement; canonical labeling)',
    `48 left-associated square-cycle products: ${countsSummary(args.r12Holonomy)}`,
  );
  push(
    'ledger-r12-signed-antipodality',
    'octa-R12 (new measurement; canonical labeling)',
    antipodalitySummary(args.r12Antipodality),
  );
  push(
    'ledger-r6-vs-r12-lift-delta',
    'octa R6 vs R12',
    `R6 distinct lift values=${distinctCount(args.r6Rows.map((row) => row.signedLift))} over 12 children (each value reused by 2 children); R12 distinct lift values=${distinctCount(
      args.r12Rows.map((row) => row.signedLift),
    )} with ${distinctCount(args.r12Rows.map((row) => row.orderedRootIdentity))} distinct ordered root identities`,
  );
  push(
    'ledger-r6-vs-r12-triad-products',
    'octa R6 vs R12 (canonical labeling)',
    args.octaTriads
      .map((triad) => `${triad.triadId}: R6=${triad.productR6}, R12=${triad.productR12}`)
      .join('; '),
  );
  push(
    'ledger-additive-vs-multiplicative',
    'octa (both registers, canonical labeling)',
    args.octaTriads
      .map(
        (triad) =>
          `${triad.triadId}: additive |sum|=${triad.additivePositionSumMagnitude}, multiplicative R12=(${triad.productR12})`,
      )
      .join('; '),
  );
  push(
    'ledger-metric-delta',
    'octa R6 vs R12 vs control',
    `R6: distinctAnchors=${args.r6Metrics.distinctAnchorCount}/12, angles=[${args.r6Metrics.distinctAdjacencyAngitudesDegrees.join(', ')}], edge/radius=[${args.r6Metrics.distinctEdgeOverRadiusRatios.join(', ')}]; R12: distinctAnchors=${args.r12Metrics.distinctAnchorCount}/12, angles=[${args.r12Metrics.distinctAdjacencyAngitudesDegrees.join(', ')}], edge/radius=[${args.r12Metrics.distinctEdgeOverRadiusRatios.join(', ')}]; control: distinctAnchors=${args.controlMetrics.distinctAnchorCount}/12, angles=[${args.controlMetrics.distinctAdjacencyAngitudesDegrees.join(', ')}], edge/radius=[${args.controlMetrics.distinctEdgeOverRadiusRatios.join(', ')}]`,
  );
  push(
    'ledger-gauge-sweep-aggregates',
    'octa R12 / octa R6 / control sweeps',
    `R12 sweep (${args.r12GaugeSweep.labelingCount} labelings): antipodal ${countsSummary(args.r12GaugeSweep.antipodalSignRelationCounts)}; holonomy ${countsSummary(args.r12GaugeSweep.squareHolonomyValueCounts)}. R6 sweep (${args.r6GaugeSweep.validLabelingCount}/${args.r6GaugeSweep.labelingCount} valid): antipodal ${countsSummary(args.r6GaugeSweep.antipodalSignRelationCounts)}; holonomy ${countsSummary(args.r6GaugeSweep.squareHolonomyValueCounts)}. Control sweep (${args.controlGaugeSweep.labelingCount} labelings): antipodal ${countsSummary(args.controlGaugeSweep.antipodalSignRelationCounts)}.`,
  );
  push(
    'ledger-octa-r12-vs-control-triads',
    'octa R12 vs tetra control (canonical labeling)',
    `octa R12 triad products: [${args.octaTriads.map((triad) => triad.productR12).join(', ')}]; control triad products: [${args.controlTriads.map((triad) => triad.product).join(', ')}]`,
  );
  push(
    'ledger-correspondence-summary',
    'octa R12 / octa R6 / control (Part 3)',
    `R12 great-circle identified: [${args.r12Correspondence.map((row) => row.anchorGreatCircleIdentified).join(', ')}]; R6: [${args.r6Correspondence.map((row) => row.anchorGreatCircleIdentified).join(', ')}]; control: [${args.controlCorrespondence.map((row) => row.anchorGreatCircleIdentified).join(', ')}]`,
  );

  return rows;
}

function computeSquareHolonomyCounts(
  squares: BenchSquare[],
  liftById: Map<string, BenchSignedBasis>,
  issues: BenchIssue[],
): Array<{ value: string; count: number }> {
  const counter = new Map<string, number>();

  for (const square of squares) {
    for (const cycle of squareVariants(square.outwardCycle)) {
      const product = leftAssociatedProduct(
        cycle.map((id) => requireBenchLift(liftById, id, issues)),
      );

      increment(counter, formatBench(product));
    }
  }

  return counterToRows(counter);
}

function buildBenchIntegrityIssues(args: {
  children: BenchChild[];
  facePairs: BenchFacePairRecordV0[];
  hexagons: string[][];
  octaTriads: BenchTriadRowV0[];
  r12Rows: BenchR12CarrierRowV0[];
  r12GaugeSweep: BenchGaugeSweepV0;
  r6GaugeSweep: BenchGaugeSweepV0;
  control: MedialHubTriadicClosureBenchV0Report['part4'];
  part5: BenchLedgerRowV0[];
  r12Anchors: BenchAnchorRowV0[];
  r6Anchors: BenchAnchorRowV0[];
}): BenchIssue[] {
  const issues: BenchIssue[] = [];

  if (args.octaTriads.length !== 8) {
    issues.push({
      code: 'bench-octa-triad-census-mismatch',
      message: `Expected 8 octa triads (4 hexagons x 2 alternation classes), got ${args.octaTriads.length}.`,
    });
  }

  if (args.control.controlTriads.length !== 8) {
    issues.push({
      code: 'bench-control-triad-census-mismatch',
      message: `Expected 8 control triads, got ${args.control.controlTriads.length}.`,
    });
  }

  if (args.r12GaugeSweep.labelingCount !== 168) {
    issues.push({
      code: 'bench-r12-sweep-count-mismatch',
      message: `R12 sweep must enumerate 168 labelings, got ${args.r12GaugeSweep.labelingCount}.`,
    });
  }

  if (args.control.controlGaugeSweep.labelingCount !== 168) {
    issues.push({
      code: 'bench-control-sweep-count-mismatch',
      message: `Control sweep must enumerate 168 labelings, got ${args.control.controlGaugeSweep.labelingCount}.`,
    });
  }

  if (args.r6GaugeSweep.labelingCount !== 42) {
    issues.push({
      code: 'bench-r6-sweep-count-mismatch',
      message: `R6 sweep must enumerate 42 line labelings, got ${args.r6GaugeSweep.labelingCount}.`,
    });
  }

  if (args.r12Anchors.length !== args.children.length || args.r6Anchors.length !== args.children.length) {
    issues.push({
      code: 'bench-anchor-census-mismatch',
      message: `Anchors must cover all children: r12=${args.r12Anchors.length}, r6=${args.r6Anchors.length}, children=${args.children.length}.`,
    });
  }

  if (args.r12Anchors.some((row) => !row.chain) || args.r6Anchors.some((row) => !row.chain)) {
    issues.push({
      code: 'bench-anchor-chain-missing',
      message: 'Every anchor row must document its carrier-derived projection chain.',
    });
  }

  if (args.part5.length === 0 || args.part5.some((row) => row.derivationStatus !== '')) {
    issues.push({
      code: 'bench-ledger-malformed',
      message: 'Anomaly ledger must be non-empty with every derivationStatus left empty for the auditor.',
    });
  }

  return issues;
}

// ----------------------------------------------------------------------------
// finite Fano product and helpers
// ----------------------------------------------------------------------------

function multiplyBench(left: BenchSignedBasis, right: BenchSignedBasis): BenchSignedBasis {
  if (left.unit === '1') {
    return { sign: parity(left.sign, right.sign), unit: right.unit };
  }

  if (right.unit === '1') {
    return { sign: parity(left.sign, right.sign), unit: left.unit };
  }

  if (left.unit === right.unit) {
    return { sign: parity(left.sign, right.sign, '-'), unit: '1' };
  }

  const leftNumber = Number(left.unit.slice(1));
  const rightNumber = Number(right.unit.slice(1));

  for (const [a, b, c] of ORIENTED_FANO_TRIPLES) {
    for (const [x, y, z] of [
      [a, b, c],
      [b, c, a],
      [c, a, b],
    ] as const) {
      if (leftNumber === x && rightNumber === y) {
        return { sign: parity(left.sign, right.sign, '+'), unit: `e${z}` as BenchFanoUnit };
      }

      if (leftNumber === y && rightNumber === x) {
        return { sign: parity(left.sign, right.sign, '-'), unit: `e${z}` as BenchFanoUnit };
      }
    }
  }

  throw new Error(`bench: unsupported Fano product ${left.unit}*${right.unit}`);
}

function leftAssociatedProduct(lifts: BenchSignedBasis[]): BenchSignedBasis {
  return lifts.reduce((accumulator, lift) => multiplyBench(accumulator, lift));
}

function parity(...signs: BenchSign[]): BenchSign {
  return signs.filter((sign) => sign === '-').length % 2 === 0 ? '+' : '-';
}

function formatBench(value: BenchSignedBasis): string {
  return `${value.sign}${value.unit}`;
}

function requireBenchLift(
  liftById: Map<string, BenchSignedBasis>,
  id: string,
  issues: BenchIssue[],
): BenchSignedBasis {
  const lift = liftById.get(id);

  if (!lift) {
    issues.push({ code: 'bench-lift-missing', message: `No lift derived for ${id}.` });

    return { sign: '+', unit: '1' };
  }

  return lift;
}

function isCompleteQuadrangle(units: number[]): boolean {
  return !ORIENTED_FANO_TRIPLES.some(
    (triple) => triple.filter((value) => units.includes(value)).length === 3,
  );
}

function combinations<T>(values: T[], size: number): T[][] {
  const rows: T[][] = [];

  const visit = (startIndex: number, selected: T[]): void => {
    if (selected.length === size) {
      rows.push([...selected]);
      return;
    }

    for (let index = startIndex; index <= values.length - (size - selected.length); index += 1) {
      selected.push(values[index]);
      visit(index + 1, selected);
      selected.pop();
    }
  };

  visit(0, []);

  return rows;
}

function permutations<T>(values: T[]): T[][] {
  if (!values.length) {
    return [[]];
  }

  return values.flatMap((value, index) =>
    permutations([...values.slice(0, index), ...values.slice(index + 1)]).map((suffix) => [
      value,
      ...suffix,
    ]),
  );
}

function increment(counter: Map<string, number>, key: string): void {
  counter.set(key, (counter.get(key) ?? 0) + 1);
}

function counterToRows(counter: Map<string, number>): Array<{ value: string; count: number }> {
  return [...counter.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((left, right) => (left.value < right.value ? -1 : 1));
}

function orientCycleOutward(vertexIds: string[], shape: Shape): string[] {
  const positions = vertexIds.map((vertexId) => shape.vertices[vertexId].position);
  const centroid = positions.reduce<Vec3>(
    (sum, position) => addVec3(sum, position),
    [0, 0, 0],
  );
  let nx = 0;
  let ny = 0;
  let nz = 0;

  for (let index = 0; index < positions.length; index += 1) {
    const current = positions[index];
    const next = positions[(index + 1) % positions.length];

    nx += (current[1] - next[1]) * (current[2] + next[2]);
    ny += (current[2] - next[2]) * (current[0] + next[0]);
    nz += (current[0] - next[0]) * (current[1] + next[1]);
  }

  return nx * centroid[0] + ny * centroid[1] + nz * centroid[2] >= 0
    ? [...vertexIds]
    : [...vertexIds].reverse();
}

function directedEdgeFromCycle(cycle: string[], u: string, v: string): [string, string] | null {
  for (let index = 0; index < cycle.length; index += 1) {
    const current = cycle[index];
    const next = cycle[(index + 1) % cycle.length];

    if (current === u && next === v) {
      return [u, v];
    }

    if (current === v && next === u) {
      return [v, u];
    }
  }

  return null;
}

function planeBasis(
  positions: number[][],
  preferredNormal: number[],
): { b1: number[]; b2: number[] } | null {
  const first = positions.find((position) => normN(position) > POSITION_EPSILON);

  if (!first) {
    return null;
  }

  const b1 = scaleN(first, 1 / normN(first));
  let b2: number[] | null = null;

  if (preferredNormal.length === 3 && normN(preferredNormal) > POSITION_EPSILON) {
    const cross = crossVec3(
      normalizeVec3(preferredNormal as Vec3),
      [b1[0], b1[1], b1[2]] as Vec3,
    );

    if (magnitude(cross) > POSITION_EPSILON) {
      b2 = [...cross];
    }
  }

  if (!b2) {
    for (const position of positions) {
      const projection = subtractN(position, scaleN(b1, dotN(position, b1)));

      if (normN(projection) > POSITION_EPSILON) {
        b2 = scaleN(projection, 1 / normN(projection));
        break;
      }
    }
  }

  return b2 ? { b1, b2 } : null;
}

function rotate<T>(values: T[], rotation: number): T[] {
  return [...values.slice(rotation), ...values.slice(0, rotation)];
}

function unorderedPairKey(left: string, right: string): string {
  return left < right ? `${left}|${right}` : `${right}|${left}`;
}

function addVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

function subtractVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
}

function scaleVec3(value: Vec3, factor: number): Vec3 {
  return [value[0] * factor, value[1] * factor, value[2] * factor];
}

function dotVec3(left: Vec3, right: Vec3): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function crossVec3(left: Vec3, right: Vec3): Vec3 {
  return [
    left[1] * right[2] - left[2] * right[1],
    left[2] * right[0] - left[0] * right[2],
    left[0] * right[1] - left[1] * right[0],
  ];
}

function magnitude(value: Vec3): number {
  return Math.sqrt(dotVec3(value, value));
}

function normalizeVec3(value: Vec3): Vec3 {
  const length = magnitude(value);

  return length <= POSITION_EPSILON ? [0, 0, 0] : scaleVec3(value, 1 / length);
}

function canonicalDirection(value: Vec3): Vec3 {
  for (const component of value) {
    if (Math.abs(component) > POSITION_EPSILON) {
      return component > 0 ? value : scaleVec3(value, -1);
    }
  }

  return value;
}

function isZeroVec3(value: Vec3): boolean {
  return (
    Math.abs(value[0]) <= POSITION_EPSILON &&
    Math.abs(value[1]) <= POSITION_EPSILON &&
    Math.abs(value[2]) <= POSITION_EPSILON
  );
}

function determinant3(a: Vec3, b: Vec3, c: Vec3): number {
  return (
    a[0] * (b[1] * c[2] - b[2] * c[1]) -
    a[1] * (b[0] * c[2] - b[2] * c[0]) +
    a[2] * (b[0] * c[1] - b[1] * c[0])
  );
}

function dotN(left: number[], right: number[]): number {
  return left.reduce((sum, value, index) => sum + value * (right[index] ?? 0), 0);
}

function normN(value: number[]): number {
  return Math.sqrt(dotN(value, value));
}

function scaleN(value: number[], factor: number): number[] {
  return value.map((component) => component * factor);
}

function subtractN(left: number[], right: number[]): number[] {
  return left.map((component, index) => component - (right[index] ?? 0));
}

function vecKey(value: Vec3): string {
  return value.map((component) => component.toFixed(6)).join(',');
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number): number {
  return Number(value.toFixed(ANGLE_DECIMALS));
}

function dedupeNumbers(values: number[]): number[] {
  return [...new Set(values.map((value) => round(value)))].sort((left, right) => left - right);
}

function distinctCount(values: string[]): number {
  return new Set(values).size;
}

function dedupeIssues(issues: BenchIssue[]): BenchIssue[] {
  const seen = new Set<string>();

  return issues.filter((issue) => {
    const key = `${issue.code}:${issue.message}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
