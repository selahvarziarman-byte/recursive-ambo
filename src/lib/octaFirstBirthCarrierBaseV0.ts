import { createSeedShape } from '../data/seeds';
import { applyAmboDissection, canApplyAmboDissection } from './ambo';
import {
  buildMedialDualEquivariantCarrierPolicyModelCardV0Report,
  type MedialDualEquivariantCarrierPolicyModelCardV0Report,
} from './medialDualEquivariantCarrierPolicyModelCardV0';
import {
  buildOctonionVsA3MedialCarrierDiscriminatorV0Report,
  type OctonionVsA3MedialCarrierDiscriminatorV0Report,
} from './octonionVsA3MedialCarrierDiscriminatorV0';
import type { Face, Shape, Vec3 } from '../types/geometry';

export type OctaFanoUnit = 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7';
export type OctaSignedBasisUnit = '1' | OctaFanoUnit;
export type OctaSign = '+' | '-';

export interface OctaSignedBasis {
  sign: OctaSign;
  unit: OctaSignedBasisUnit;
}

export interface OctaAntipodalAxisRecordV0 {
  axisIndex: 1 | 2 | 3;
  positivePoleVertexId: string;
  negativePoleVertexId: string;
  positivePolePosition: Vec3;
  poleSelection: 'gauge-first-encountered' | 'forced-by-right-handed-frame';
  assignedUnit: OctaFanoUnit;
}

export interface OctaPrimalCarrierAssignmentV0 {
  assignmentPolicyId: 'octa-axis-signed-pole-assignment-v0';
  derivedFromFeature: 'three-antipodal-vertex-axes + global right-handed orientation (det[p1,p2,p3] > 0)';
  justification: string;
  axes: OctaAntipodalAxisRecordV0[];
  frameDeterminant: number;
  orientedFanoLine: [OctaFanoUnit, OctaFanoUnit, OctaFanoUnit];
  carrierByVertexId: Record<string, string>;
  lineClosureSelfCheck: {
    product: string;
    expected: string;
    status: 'verified' | 'failed';
  };
  tetraQuadrangleDistinctness: {
    octaUnitSet: OctaFanoUnit[];
    unitSetIsFanoLine: boolean;
    tetraQuadrangleSet: OctaFanoUnit[];
    distinctFromTetraAssignment: boolean;
  };
}

export interface OctaFaceClassRecordV0 {
  faceId: string;
  vertexIds: string[];
  outwardCycle: string[];
  signProduct: 1 | -1;
  faceClass: 'positive' | 'negative';
}

export interface OctaEdgeOrientationRowV0 {
  edgeId: string;
  fromVertexId: string;
  toVertexId: string;
  orientingFaceId: string;
  orientingFaceClass: 'positive';
  negativeClassFaceId: string;
  negativeClassInducesReverse: boolean;
}

export interface OctaEdgeOrientationPolicyV0 {
  orientationPolicyId: 'octa-positive-face-class-boundary-orientation-v0';
  derivedFromFeature: 'global-outward-orientation + tetrahedral-face-2-coloring (stella octangula alternation classes)';
  justification: string;
  lexicographicSortingUsed: false;
  faceClassRecords: OctaFaceClassRecordV0[];
  positiveClassFaceCount: number;
  negativeClassFaceCount: number;
  classesEdgeDisjoint: boolean;
  everyEdgeBoundsOneFacePerClass: boolean;
  edgeOrientationRows: OctaEdgeOrientationRowV0[];
}

export interface OctaEdgeChildLiftRowV0 {
  childVertexId: string;
  edgeId: string;
  fromVertexId: string;
  toVertexId: string;
  fromCarrier: string;
  toCarrier: string;
  recomputedSignedLift: string;
  reverseOrderLift: string;
  reverseIsOppositeSign: boolean;
  genealogyMatchesMidpointPosition: boolean;
}

export interface OctaTriangleClosureProductRowV0 {
  orderedProductId: string;
  leftChildId: string;
  rightChildId: string;
  thirdChildId: string;
  recomputedProduct: string;
  thirdChildLift: string;
  closureUpToSignStatus: 'pass' | 'fail';
}

export interface OctaTriangleClosureRelationRowV0 {
  coreFaceId: string;
  sourceOctaFaceId: string | null;
  childIds: string[];
  productRows: OctaTriangleClosureProductRowV0[];
  passCount: number;
  rowCount: number;
}

export interface OctaSquareHolonomyVariantRowV0 {
  variantId: string;
  orientationVariant: string;
  childCycle: string[];
  recomputedLeftAssociatedProduct: string;
  holonomyStatus: 'pass' | 'fail';
}

export interface OctaSquareHolonomyRelationRowV0 {
  coreFaceId: string;
  sourceOctaVertexId: string | null;
  outwardChildCycle: string[];
  variantRows: OctaSquareHolonomyVariantRowV0[];
  passCount: number;
  rowCount: number;
}

export interface OctaAntipodalPairRowV0 {
  pairId: string;
  leftChildId: string;
  rightChildId: string;
  leftLift: string;
  rightLift: string;
  sameUnit: boolean;
  oppositeSign: boolean;
  oppositionStatus: 'same-ray-opposite-sign' | 'same-ray-same-sign' | 'different-ray';
}

export interface OctaRelationFamilyComparisonRowV0 {
  relationFamily: 'triangle-closure' | 'square-holonomy' | 'signed-antipodality';
  octaDerivedSummary: string;
  referenceLaw: string;
  referenceCitation: string;
  octaSatisfiesLaw: boolean;
}

export interface OctaClassGaugeCheckV0 {
  positiveClassOutcomes: {
    closureAllPass: boolean;
    holonomyAllPlusOne: boolean;
    antipodalityAllOppositeSign: boolean;
  };
  negativeClassOutcomes: {
    closureAllPass: boolean;
    holonomyAllPlusOne: boolean;
    antipodalityAllOppositeSign: boolean;
  };
  relationOutcomesInvariantUnderClassGauge: boolean;
}

export interface OctaFirstBirthCarrierBaseV0Issue {
  code: string;
  message: string;
}

export type OctaReproductionVerdict =
  | 'cuboctahedral-hub-reproduced'
  | 'not-reproduced'
  | 'reproduced-with-deviation';

export interface OctaFirstBirthCarrierBaseV0Report {
  method: 'octa-first-birth-carrier-base-v0';
  diagnosticScope: 'octa-first-birth-cuboctahedral-hub-test-only';
  generalityStatus: 'not-a-universal-law-claim';
  decisionContext: 'station-iii-branch-a-decisive-d3-input';
  fieldCueUnblockStatus: 'not-authorized';
  s0Status: 'not-authorized';
  uiStatus: 'no-ui';
  shapeMutationStatus: 'no-shape-mutation';
  packetWriteStatus: 'no-packet-write';
  operationRegistryStatus: 'not-operation-registry-work';
  topologyStatus: 'not-topology-workspace';
  referenceReports: {
    discriminator: { method: string; ok: boolean; issueCount: number; usage: 'reference-law-only' };
    modelCard: { method: string; ok: boolean; issueCount: number; usage: 'reference-law-only' };
  };
  octaGeometry: {
    vertexCount: number;
    edgeCount: number;
    faceCount: number;
    centerIsOrigin: boolean;
    coreCellTopology: string | null;
    childCount: number;
    coreTriangleCount: number;
    coreSquareCount: number;
    antipodalChildPairCount: number;
  };
  primalCarrierAssignment: OctaPrimalCarrierAssignmentV0;
  orientationPolicy: OctaEdgeOrientationPolicyV0;
  edgeChildLiftRows: OctaEdgeChildLiftRowV0[];
  triangleClosureRelations: OctaTriangleClosureRelationRowV0[];
  squareHolonomyRelations: OctaSquareHolonomyRelationRowV0[];
  antipodalPairRows: OctaAntipodalPairRowV0[];
  relationFamilyResults: {
    closureAllPass: boolean;
    closurePassCount: number;
    closureRowCount: number;
    holonomyAllPlusOne: boolean;
    holonomyPassCount: number;
    holonomyRowCount: number;
    antipodalityAllOppositeSign: boolean;
    antipodalityPassCount: number;
    antipodalityPairCount: number;
  };
  comparisonToReference: OctaRelationFamilyComparisonRowV0[];
  classGaugeCheck: OctaClassGaugeCheckV0;
  reproductionVerdict: OctaReproductionVerdict;
  reproductionVerdictDerivation: string;
  integrityIssueCount: number;
  integrityIssues: OctaFirstBirthCarrierBaseV0Issue[];
  ok: boolean;
}

const METHOD = 'octa-first-birth-carrier-base-v0' as const;
const EPSILON = 1e-9;
const ORIENTED_FANO_TRIPLES: readonly [number, number, number][] = [
  [1, 2, 3],
  [1, 4, 5],
  [1, 7, 6],
  [2, 4, 6],
  [2, 5, 7],
  [3, 4, 7],
  [3, 6, 5],
];
const ORIENTED_FANO_LINE: [OctaFanoUnit, OctaFanoUnit, OctaFanoUnit] = ['e1', 'e2', 'e3'];
const TETRA_QUADRANGLE_SET: OctaFanoUnit[] = ['e1', 'e2', 'e4', 'e7'];

interface DerivedOctaFrame {
  axes: OctaAntipodalAxisRecordV0[];
  frameDeterminant: number;
  carrierByVertexId: Map<string, OctaSignedBasis>;
}

interface DerivedOrientation {
  faceClassRecords: OctaFaceClassRecordV0[];
  edgeOrientationRows: OctaEdgeOrientationRowV0[];
  classesEdgeDisjoint: boolean;
  everyEdgeBoundsOneFacePerClass: boolean;
}

interface RelationOutcomes {
  closureAllPass: boolean;
  holonomyAllPlusOne: boolean;
  antipodalityAllOppositeSign: boolean;
}

export function buildOctaFirstBirthCarrierBaseV0Report(): OctaFirstBirthCarrierBaseV0Report {
  const issues: OctaFirstBirthCarrierBaseV0Issue[] = [];
  const disc = buildOctonionVsA3MedialCarrierDiscriminatorV0Report();
  const card = buildMedialDualEquivariantCarrierPolicyModelCardV0Report();
  const octa = createSeedShape('octahedron');
  const vertexIds = Object.keys(octa.vertices);
  const centerIsOrigin = isApproximatelyZero(
    averagePosition(vertexIds.map((vertexId) => octa.vertices[vertexId].position)),
  );

  if (vertexIds.length !== 6 || octa.edges.length !== 12 || octa.faces.length !== 8) {
    issues.push({
      code: 'octa-seed-geometry-malformed',
      message: `Octahedron seed must provide 6 vertices / 12 edges / 8 faces; got ${vertexIds.length}/${octa.edges.length}/${octa.faces.length} (mock-solution tripwire).`,
    });
  }

  if (!centerIsOrigin) {
    issues.push({
      code: 'octa-center-not-origin',
      message: 'Octahedron vertex average is not the origin; outward orientation underivable.',
    });
  }

  const frame = deriveOctaFrame(octa, issues);
  const primalCarrierAssignment = buildPrimalCarrierAssignment(frame, issues);
  const orientation = deriveOrientation(octa, frame, 'positive', issues);
  const orientationPolicy = buildOrientationPolicy(orientation);
  const ambo = canApplyAmboDissection(octa) ? applyAmboDissection(octa) : null;

  if (!ambo) {
    issues.push({
      code: 'octa-ambo-unavailable',
      message: 'applyAmboDissection is not applicable to the octahedron seed (mock-solution tripwire).',
    });
  }

  const core = ambo?.cells.find(
    (cell) => cell.kind === 'core' && cell.topology === 'cuboctahedron',
  );

  if (ambo && !core) {
    issues.push({
      code: 'octa-cuboctahedron-core-missing',
      message: 'Ambo(octahedron) did not produce a cuboctahedron core cell.',
    });
  }

  const edgeChildLiftRows =
    ambo && core ? buildEdgeChildLiftRows(octa, ambo, core.vertexIds, frame, orientation, issues) : [];
  const liftByChildId = new Map(
    edgeChildLiftRows.map((row) => [row.childVertexId, parseSignedBasis(row.recomputedSignedLift)]),
  );
  const coreFaces = ambo && core ? core.faceIds.map((faceId) => requireFace(ambo, faceId, issues)) : [];
  const triangleFaces = coreFaces.filter((face) => face && face.vertexIds.length === 3) as Face[];
  const squareFaces = coreFaces.filter((face) => face && face.vertexIds.length === 4) as Face[];

  if (ambo && core && (triangleFaces.length !== 8 || squareFaces.length !== 6)) {
    issues.push({
      code: 'octa-core-face-census-mismatch',
      message: `Cuboctahedron core must expose 8 triangles and 6 squares; got ${triangleFaces.length}/${squareFaces.length}.`,
    });
  }

  const triangleClosureRelations = ambo
    ? triangleFaces.map((face) => buildTriangleRelation(face, ambo, liftByChildId, issues))
    : [];
  const squareHolonomyRelations = ambo
    ? squareFaces.map((face) => buildSquareRelation(face, ambo, liftByChildId, issues))
    : [];
  const antipodalPairRows = ambo && core
    ? buildAntipodalPairRows(ambo, core.vertexIds, liftByChildId, issues)
    : [];

  const closureRowCount = triangleClosureRelations.reduce((sum, row) => sum + row.rowCount, 0);
  const closurePassCount = triangleClosureRelations.reduce((sum, row) => sum + row.passCount, 0);
  const holonomyRowCount = squareHolonomyRelations.reduce((sum, row) => sum + row.rowCount, 0);
  const holonomyPassCount = squareHolonomyRelations.reduce((sum, row) => sum + row.passCount, 0);
  const antipodalityPassCount = antipodalPairRows.filter(
    (row) => row.oppositionStatus === 'same-ray-opposite-sign',
  ).length;
  const relationFamilyResults = {
    closureAllPass: closureRowCount > 0 && closurePassCount === closureRowCount,
    closurePassCount,
    closureRowCount,
    holonomyAllPlusOne: holonomyRowCount > 0 && holonomyPassCount === holonomyRowCount,
    holonomyPassCount,
    holonomyRowCount,
    antipodalityAllOppositeSign:
      antipodalPairRows.length > 0 && antipodalityPassCount === antipodalPairRows.length,
    antipodalityPassCount,
    antipodalityPairCount: antipodalPairRows.length,
  };
  const comparisonToReference = buildComparisonToReference(disc, card, relationFamilyResults);
  const classGaugeCheck = buildClassGaugeCheck(
    octa,
    ambo,
    core?.vertexIds ?? [],
    triangleFaces,
    squareFaces,
    frame,
    {
      closureAllPass: relationFamilyResults.closureAllPass,
      holonomyAllPlusOne: relationFamilyResults.holonomyAllPlusOne,
      antipodalityAllOppositeSign: relationFamilyResults.antipodalityAllOppositeSign,
    },
    issues,
  );
  const familiesSatisfied = [
    relationFamilyResults.closureAllPass,
    relationFamilyResults.holonomyAllPlusOne,
    relationFamilyResults.antipodalityAllOppositeSign,
  ].filter(Boolean).length;
  const reproductionVerdict: OctaReproductionVerdict =
    familiesSatisfied === 3
      ? 'cuboctahedral-hub-reproduced'
      : familiesSatisfied === 0
        ? 'not-reproduced'
        : 'reproduced-with-deviation';
  const reproductionVerdictDerivation = `derived from relation-family results: closureAllPass=${relationFamilyResults.closureAllPass} (${closurePassCount}/${closureRowCount}), holonomyAllPlusOne=${relationFamilyResults.holonomyAllPlusOne} (${holonomyPassCount}/${holonomyRowCount}), antipodalityAllOppositeSign=${relationFamilyResults.antipodalityAllOppositeSign} (${antipodalityPassCount}/${antipodalPairRows.length}); familiesSatisfied=${familiesSatisfied}/3 -> ${familiesSatisfied === 3 ? 'cuboctahedral-hub-reproduced' : familiesSatisfied === 0 ? 'not-reproduced' : 'reproduced-with-deviation'}`;

  issues.push(
    ...buildIntegrityIssues({
      disc,
      card,
      octaGeometryOk:
        vertexIds.length === 6 && octa.edges.length === 12 && octa.faces.length === 8,
      orientationPolicy,
      primalCarrierAssignment,
      edgeChildLiftRows,
      triangleClosureRelations,
      squareHolonomyRelations,
      antipodalPairRows,
      comparisonToReference,
      reproductionVerdict,
      familiesSatisfied,
    }),
  );

  const dedupedIssues = dedupeIssues(issues);

  return {
    method: METHOD,
    diagnosticScope: 'octa-first-birth-cuboctahedral-hub-test-only',
    generalityStatus: 'not-a-universal-law-claim',
    decisionContext: 'station-iii-branch-a-decisive-d3-input',
    fieldCueUnblockStatus: 'not-authorized',
    s0Status: 'not-authorized',
    uiStatus: 'no-ui',
    shapeMutationStatus: 'no-shape-mutation',
    packetWriteStatus: 'no-packet-write',
    operationRegistryStatus: 'not-operation-registry-work',
    topologyStatus: 'not-topology-workspace',
    referenceReports: {
      discriminator: {
        method: disc.method,
        ok: disc.ok,
        issueCount: disc.issues.length,
        usage: 'reference-law-only',
      },
      modelCard: {
        method: card.method,
        ok: card.ok,
        issueCount: card.issues.length,
        usage: 'reference-law-only',
      },
    },
    octaGeometry: {
      vertexCount: vertexIds.length,
      edgeCount: octa.edges.length,
      faceCount: octa.faces.length,
      centerIsOrigin,
      coreCellTopology: core?.topology ?? null,
      childCount: core?.vertexIds.length ?? 0,
      coreTriangleCount: triangleFaces.length,
      coreSquareCount: squareFaces.length,
      antipodalChildPairCount: antipodalPairRows.length,
    },
    primalCarrierAssignment,
    orientationPolicy,
    edgeChildLiftRows,
    triangleClosureRelations,
    squareHolonomyRelations,
    antipodalPairRows,
    relationFamilyResults,
    comparisonToReference,
    classGaugeCheck,
    reproductionVerdict,
    reproductionVerdictDerivation,
    integrityIssueCount: dedupedIssues.length,
    integrityIssues: dedupedIssues,
    ok: dedupedIssues.length === 0,
  };
}

function deriveOctaFrame(
  octa: Shape,
  issues: OctaFirstBirthCarrierBaseV0Issue[],
): DerivedOctaFrame {
  const vertexIds = Object.keys(octa.vertices);
  const paired = new Set<string>();
  const pairs: Array<[string, string]> = [];

  for (const vertexId of vertexIds) {
    if (paired.has(vertexId)) {
      continue;
    }

    const position = octa.vertices[vertexId].position;
    const antipode = vertexIds.find(
      (candidateId) =>
        candidateId !== vertexId &&
        !paired.has(candidateId) &&
        isApproximatelyZero(addVectors(position, octa.vertices[candidateId].position)),
    );

    if (!antipode) {
      issues.push({
        code: 'octa-antipodal-axis-underivable',
        message: `Vertex ${vertexId} has no antipodal partner; the three-axis structure is underivable.`,
      });
      continue;
    }

    paired.add(vertexId);
    paired.add(antipode);
    pairs.push([vertexId, antipode]);
  }

  if (pairs.length !== 3) {
    issues.push({
      code: 'octa-axis-count-mismatch',
      message: `Expected exactly 3 antipodal axes, derived ${pairs.length}.`,
    });
  }

  const p1 = pairs[0]?.[0];
  const p2 = pairs[1]?.[0];
  const axis3 = pairs[2];
  let frameDeterminant = 0;
  let p3 = axis3?.[0];
  let p3Forced = false;

  if (p1 && p2 && axis3) {
    const candidateDet = determinant3(
      octa.vertices[p1].position,
      octa.vertices[p2].position,
      octa.vertices[axis3[0]].position,
    );

    if (Math.abs(candidateDet) <= EPSILON) {
      issues.push({
        code: 'octa-frame-degenerate',
        message: 'det[p1, p2, p3-candidate] is zero; right-handed frame underivable.',
      });
    }

    if (candidateDet > 0) {
      p3 = axis3[0];
      frameDeterminant = candidateDet;
    } else {
      p3 = axis3[1];
      frameDeterminant = determinant3(
        octa.vertices[p1].position,
        octa.vertices[p2].position,
        octa.vertices[p3].position,
      );
    }

    p3Forced = true;
  }

  const orderedAxes: Array<{ positive: string; negative: string; forced: boolean }> = [];

  if (p1 && pairs[0]) {
    orderedAxes.push({ positive: p1, negative: pairs[0][1], forced: false });
  }

  if (p2 && pairs[1]) {
    orderedAxes.push({ positive: p2, negative: pairs[1][1], forced: false });
  }

  if (p3 && axis3) {
    orderedAxes.push({
      positive: p3,
      negative: axis3[0] === p3 ? axis3[1] : axis3[0],
      forced: p3Forced,
    });
  }

  const carrierByVertexId = new Map<string, OctaSignedBasis>();
  const axes: OctaAntipodalAxisRecordV0[] = orderedAxes.map((axis, index) => {
    const unit = ORIENTED_FANO_LINE[index];

    carrierByVertexId.set(axis.positive, { sign: '+', unit });
    carrierByVertexId.set(axis.negative, { sign: '-', unit });

    return {
      axisIndex: (index + 1) as 1 | 2 | 3,
      positivePoleVertexId: axis.positive,
      negativePoleVertexId: axis.negative,
      positivePolePosition: octa.vertices[axis.positive].position,
      poleSelection: axis.forced ? 'forced-by-right-handed-frame' : 'gauge-first-encountered',
      assignedUnit: unit,
    };
  });

  return { axes, frameDeterminant, carrierByVertexId };
}

function buildPrimalCarrierAssignment(
  frame: DerivedOctaFrame,
  issues: OctaFirstBirthCarrierBaseV0Issue[],
): OctaPrimalCarrierAssignmentV0 {
  const p1 = frame.axes[0];
  const p2 = frame.axes[1];
  const p3 = frame.axes[2];
  const selfCheckProduct =
    p1 && p2
      ? multiplyOctaSignedBasis(
          frame.carrierByVertexId.get(p1.positivePoleVertexId) ?? { sign: '+', unit: '1' },
          frame.carrierByVertexId.get(p2.positivePoleVertexId) ?? { sign: '+', unit: '1' },
        )
      : { sign: '+' as OctaSign, unit: '1' as OctaSignedBasisUnit };
  const expected = p3
    ? frame.carrierByVertexId.get(p3.positivePoleVertexId) ?? { sign: '+' as OctaSign, unit: '1' as OctaSignedBasisUnit }
    : { sign: '+' as OctaSign, unit: '1' as OctaSignedBasisUnit };
  const selfCheckStatus =
    selfCheckProduct.sign === expected.sign && selfCheckProduct.unit === expected.unit
      ? 'verified'
      : 'failed';

  if (selfCheckStatus === 'failed') {
    issues.push({
      code: 'octa-line-closure-self-check-failed',
      message: `carrier(p1)*carrier(p2)=${formatSignedBasis(selfCheckProduct)} does not equal carrier(p3)=${formatSignedBasis(expected)}; orientation/algebra correspondence broken.`,
    });
  }

  const octaUnitSet = [...new Set(frame.axes.map((axis) => axis.assignedUnit))];
  const unitSetIsFanoLine = ORIENTED_FANO_TRIPLES.some((triple) => {
    const lineUnits = triple.map((value) => `e${value}` as OctaFanoUnit);

    return (
      octaUnitSet.length === 3 && lineUnits.every((unit) => octaUnitSet.includes(unit))
    );
  });
  const distinctFromTetraAssignment =
    octaUnitSet.length !== TETRA_QUADRANGLE_SET.length ||
    !TETRA_QUADRANGLE_SET.every((unit) => octaUnitSet.includes(unit));

  if (!unitSetIsFanoLine) {
    issues.push({
      code: 'octa-unit-set-not-a-fano-line',
      message: `Octa carrier units [${octaUnitSet.join(', ')}] are not a collinear Fano triple.`,
    });
  }

  if (!distinctFromTetraAssignment) {
    issues.push({
      code: 'octa-assignment-borrows-tetra-quadrangle',
      message: 'Octa assignment equals the tetra complete-quadrangle set; anti-fake-abstraction violation.',
    });
  }

  return {
    assignmentPolicyId: 'octa-axis-signed-pole-assignment-v0',
    derivedFromFeature:
      'three-antipodal-vertex-axes + global right-handed orientation (det[p1,p2,p3] > 0)',
    justification:
      '6 carriers from 3 axes x 2 signs is the octahedral-native derivation: antipodal vertex pairs are the structure the octahedron has and the tetrahedron lacks. The axes map to the three units of an oriented Fano line because the line is the unique algebraic object whose cyclic closure (e_a*e_b=e_c cyclically) mirrors the cyclic relation of a right-handed 3-axis frame; the poles take the two signs of the axis unit. This is the opposite selection criterion to the tetra complete quadrangle (no three collinear), not a renaming of it.',
    axes: frame.axes,
    frameDeterminant: frame.frameDeterminant,
    orientedFanoLine: ORIENTED_FANO_LINE,
    carrierByVertexId: Object.fromEntries(
      [...frame.carrierByVertexId.entries()].map(([vertexId, carrier]) => [
        vertexId,
        formatSignedBasis(carrier),
      ]),
    ),
    lineClosureSelfCheck: {
      product: formatSignedBasis(selfCheckProduct),
      expected: formatSignedBasis(expected),
      status: selfCheckStatus,
    },
    tetraQuadrangleDistinctness: {
      octaUnitSet,
      unitSetIsFanoLine,
      tetraQuadrangleSet: TETRA_QUADRANGLE_SET,
      distinctFromTetraAssignment,
    },
  };
}

function deriveOrientation(
  octa: Shape,
  frame: DerivedOctaFrame,
  positiveClassSelector: 'positive' | 'negative',
  issues: OctaFirstBirthCarrierBaseV0Issue[],
): DerivedOrientation {
  const signByVertexId = new Map<string, 1 | -1>();

  for (const axis of frame.axes) {
    signByVertexId.set(axis.positivePoleVertexId, 1);
    signByVertexId.set(axis.negativePoleVertexId, -1);
  }

  const faceClassRecords: OctaFaceClassRecordV0[] = octa.faces.map((face) => {
    const outwardCycle = orientCycleOutward(face.vertexIds, octa);
    const signProduct = face.vertexIds.reduce<1 | -1>(
      (product, vertexId) => ((product * (signByVertexId.get(vertexId) ?? 0)) >= 0 ? 1 : -1),
      1,
    );
    const faceClass: 'positive' | 'negative' =
      (positiveClassSelector === 'positive' ? signProduct === 1 : signProduct === -1)
        ? 'positive'
        : 'negative';

    return {
      faceId: face.id,
      vertexIds: [...face.vertexIds],
      outwardCycle,
      signProduct,
      faceClass,
    };
  });
  const positiveFaces = faceClassRecords.filter((record) => record.faceClass === 'positive');
  const negativeFaces = faceClassRecords.filter((record) => record.faceClass === 'negative');
  const classesEdgeDisjoint = ['positive', 'negative'].every((className) => {
    const classFaces = faceClassRecords.filter((record) => record.faceClass === className);

    return classFaces.every((left, leftIndex) =>
      classFaces.every((right, rightIndex) => {
        if (leftIndex >= rightIndex) {
          return true;
        }

        const shared = left.vertexIds.filter((vertexId) => right.vertexIds.includes(vertexId));

        return shared.length < 2;
      }),
    );
  });

  if (positiveFaces.length !== 4 || negativeFaces.length !== 4) {
    issues.push({
      code: 'octa-face-2-coloring-invalid',
      message: `Tetrahedral face 2-coloring must give 4/4 faces; got ${positiveFaces.length}/${negativeFaces.length}.`,
    });
  }

  if (!classesEdgeDisjoint) {
    issues.push({
      code: 'octa-face-classes-not-edge-disjoint',
      message: 'Same-class octa faces share an edge; alternation 2-coloring invalid.',
    });
  }

  let everyEdgeBoundsOneFacePerClass = true;
  const edgeOrientationRows: OctaEdgeOrientationRowV0[] = octa.edges.map((edge) => {
    const [u, v] = edge.vertexIds;
    const incident = faceClassRecords.filter(
      (record) => record.vertexIds.includes(u) && record.vertexIds.includes(v),
    );
    const positiveFace = incident.find((record) => record.faceClass === 'positive');
    const negativeFace = incident.find((record) => record.faceClass === 'negative');

    if (incident.length !== 2 || !positiveFace || !negativeFace) {
      everyEdgeBoundsOneFacePerClass = false;
      issues.push({
        code: 'octa-edge-face-incidence-malformed',
        message: `Edge ${edge.id} must bound exactly one positive-class and one negative-class face; got ${incident.length} incident faces.`,
      });

      return {
        edgeId: edge.id,
        fromVertexId: u,
        toVertexId: v,
        orientingFaceId: positiveFace?.faceId ?? 'missing',
        orientingFaceClass: 'positive' as const,
        negativeClassFaceId: negativeFace?.faceId ?? 'missing',
        negativeClassInducesReverse: false,
      };
    }

    const direction = directedEdgeFromCycle(positiveFace.outwardCycle, u, v);
    const negativeDirection = directedEdgeFromCycle(negativeFace.outwardCycle, u, v);
    const negativeClassInducesReverse =
      direction !== null &&
      negativeDirection !== null &&
      direction[0] === negativeDirection[1] &&
      direction[1] === negativeDirection[0];

    if (!direction) {
      issues.push({
        code: 'octa-orientation-underivable',
        message: `Positive-class face ${positiveFace.faceId} does not traverse edge ${edge.id}; orientation underivable.`,
      });
    }

    if (!negativeClassInducesReverse) {
      issues.push({
        code: 'octa-reverse-orientation-check-failed',
        message: `Negative-class face ${negativeFace.faceId} does not induce the reverse direction for edge ${edge.id}.`,
      });
    }

    return {
      edgeId: edge.id,
      fromVertexId: direction ? direction[0] : u,
      toVertexId: direction ? direction[1] : v,
      orientingFaceId: positiveFace.faceId,
      orientingFaceClass: 'positive' as const,
      negativeClassFaceId: negativeFace.faceId,
      negativeClassInducesReverse,
    };
  });

  return {
    faceClassRecords,
    edgeOrientationRows,
    classesEdgeDisjoint,
    everyEdgeBoundsOneFacePerClass,
  };
}

function buildOrientationPolicy(orientation: DerivedOrientation): OctaEdgeOrientationPolicyV0 {
  return {
    orientationPolicyId: 'octa-positive-face-class-boundary-orientation-v0',
    derivedFromFeature:
      'global-outward-orientation + tetrahedral-face-2-coloring (stella octangula alternation classes)',
    justification:
      'Each edge takes its direction from the outward-oriented boundary cycle of its unique positive-class incident face. The two-faces-per-edge ambiguity of consistent face-boundary orientation is resolved by the octahedral alternation 2-coloring (each edge bounds exactly one face of each class), so the reverse edge direction is the one induced by the other class and carries the opposite ordered-product sign. No vertex-ID sorting participates in orientation.',
    lexicographicSortingUsed: false,
    faceClassRecords: orientation.faceClassRecords,
    positiveClassFaceCount: orientation.faceClassRecords.filter(
      (record) => record.faceClass === 'positive',
    ).length,
    negativeClassFaceCount: orientation.faceClassRecords.filter(
      (record) => record.faceClass === 'negative',
    ).length,
    classesEdgeDisjoint: orientation.classesEdgeDisjoint,
    everyEdgeBoundsOneFacePerClass: orientation.everyEdgeBoundsOneFacePerClass,
    edgeOrientationRows: orientation.edgeOrientationRows,
  };
}

function buildEdgeChildLiftRows(
  octa: Shape,
  ambo: Shape,
  childVertexIds: string[],
  frame: DerivedOctaFrame,
  orientation: DerivedOrientation,
  issues: OctaFirstBirthCarrierBaseV0Issue[],
): OctaEdgeChildLiftRowV0[] {
  const orientationByEdgeKey = new Map(
    orientation.edgeOrientationRows.map((row) => [
      unorderedPairKey(row.fromVertexId, row.toVertexId),
      row,
    ]),
  );
  const rows: OctaEdgeChildLiftRowV0[] = [];

  for (const childVertexId of childVertexIds) {
    const child = ambo.vertices[childVertexId];

    if (!child) {
      issues.push({
        code: 'octa-child-vertex-missing',
        message: `Core child ${childVertexId} is not present in the ambo shape.`,
      });
      continue;
    }

    const sourcePair = child.createdBy.sourceVertexIds;

    if (sourcePair.length !== 2) {
      issues.push({
        code: 'octa-child-genealogy-missing',
        message: `Core child ${childVertexId} does not carry a two-endpoint source genealogy.`,
      });
      continue;
    }

    const orientationRow = orientationByEdgeKey.get(
      unorderedPairKey(sourcePair[0], sourcePair[1]),
    );

    if (!orientationRow) {
      issues.push({
        code: 'octa-child-edge-unmatched',
        message: `Core child ${childVertexId} genealogy pair does not match any octa edge.`,
      });
      continue;
    }

    const fromCarrier = frame.carrierByVertexId.get(orientationRow.fromVertexId);
    const toCarrier = frame.carrierByVertexId.get(orientationRow.toVertexId);

    if (!fromCarrier || !toCarrier) {
      issues.push({
        code: 'octa-carrier-missing-for-edge',
        message: `Edge ${orientationRow.edgeId} endpoints lack derived carriers.`,
      });
      continue;
    }

    const lift = multiplyOctaSignedBasis(fromCarrier, toCarrier);
    const reverseLift = multiplyOctaSignedBasis(toCarrier, fromCarrier);
    const expectedMidpoint = scaleVector(
      addVectors(
        octa.vertices[orientationRow.fromVertexId].position,
        octa.vertices[orientationRow.toVertexId].position,
      ),
      0.5,
    );
    const genealogyMatchesMidpointPosition = isApproximatelyZero(
      subtractVectors(child.position, expectedMidpoint),
    );

    if (!genealogyMatchesMidpointPosition) {
      issues.push({
        code: 'octa-child-position-genealogy-disagreement',
        message: `Core child ${childVertexId} position does not equal the midpoint of its genealogy edge.`,
      });
    }

    rows.push({
      childVertexId,
      edgeId: orientationRow.edgeId,
      fromVertexId: orientationRow.fromVertexId,
      toVertexId: orientationRow.toVertexId,
      fromCarrier: formatSignedBasis(fromCarrier),
      toCarrier: formatSignedBasis(toCarrier),
      recomputedSignedLift: formatSignedBasis(lift),
      reverseOrderLift: formatSignedBasis(reverseLift),
      reverseIsOppositeSign: lift.unit === reverseLift.unit && lift.sign !== reverseLift.sign,
      genealogyMatchesMidpointPosition,
    });
  }

  if (rows.length !== 12) {
    issues.push({
      code: 'octa-edge-child-lift-count-mismatch',
      message: `Expected 12 edge-child lifts, derived ${rows.length} (counts are necessary, never sufficient).`,
    });
  }

  return rows;
}

function buildTriangleRelation(
  face: Face,
  ambo: Shape,
  liftByChildId: Map<string, OctaSignedBasis>,
  issues: OctaFirstBirthCarrierBaseV0Issue[],
): OctaTriangleClosureRelationRowV0 {
  const childIds = orientCycleOutwardInShape(face.vertexIds, ambo);
  const productRows: OctaTriangleClosureProductRowV0[] = [];

  for (let leftIndex = 0; leftIndex < childIds.length; leftIndex += 1) {
    for (let rightIndex = 0; rightIndex < childIds.length; rightIndex += 1) {
      if (leftIndex === rightIndex) {
        continue;
      }

      const thirdIndex = [0, 1, 2].find(
        (index) => index !== leftIndex && index !== rightIndex,
      ) as number;
      const leftChildId = childIds[leftIndex];
      const rightChildId = childIds[rightIndex];
      const thirdChildId = childIds[thirdIndex];
      const leftLift = requireLift(liftByChildId, leftChildId, issues);
      const rightLift = requireLift(liftByChildId, rightChildId, issues);
      const thirdLift = requireLift(liftByChildId, thirdChildId, issues);
      const recomputed = multiplyOctaSignedBasis(leftLift, rightLift);
      const closureUpToSignStatus: 'pass' | 'fail' =
        recomputed.unit !== '1' && recomputed.unit === thirdLift.unit ? 'pass' : 'fail';

      productRows.push({
        orderedProductId: `${leftChildId}*${rightChildId}->${thirdChildId}`,
        leftChildId,
        rightChildId,
        thirdChildId,
        recomputedProduct: formatSignedBasis(recomputed),
        thirdChildLift: formatSignedBasis(thirdLift),
        closureUpToSignStatus,
      });
    }
  }

  return {
    coreFaceId: face.id,
    sourceOctaFaceId: face.sourceFaceId ?? null,
    childIds,
    productRows,
    passCount: productRows.filter((row) => row.closureUpToSignStatus === 'pass').length,
    rowCount: productRows.length,
  };
}

function buildSquareRelation(
  face: Face,
  ambo: Shape,
  liftByChildId: Map<string, OctaSignedBasis>,
  issues: OctaFirstBirthCarrierBaseV0Issue[],
): OctaSquareHolonomyRelationRowV0 {
  const outwardChildCycle = orientCycleOutwardInShape(face.vertexIds, ambo);
  const reversedCycle = [...outwardChildCycle].reverse();
  const variants: Array<{ orientationVariant: string; cycle: string[] }> = [];

  for (let rotation = 0; rotation < 4; rotation += 1) {
    variants.push({
      orientationVariant: `forward-rotation-${rotation}`,
      cycle: rotateCycle(outwardChildCycle, rotation),
    });
  }

  for (let rotation = 0; rotation < 4; rotation += 1) {
    variants.push({
      orientationVariant: `reverse-rotation-${rotation}`,
      cycle: rotateCycle(reversedCycle, rotation),
    });
  }

  const variantRows: OctaSquareHolonomyVariantRowV0[] = variants.map((variant) => {
    const lifts = variant.cycle.map((childId) => requireLift(liftByChildId, childId, issues));
    const product = lifts.reduce((accumulator, lift) =>
      multiplyOctaSignedBasis(accumulator, lift),
    );
    const value = formatSignedBasis(product);

    return {
      variantId: `${face.id}:${variant.orientationVariant}`,
      orientationVariant: variant.orientationVariant,
      childCycle: variant.cycle,
      recomputedLeftAssociatedProduct: value,
      holonomyStatus: value === '+1' ? 'pass' : 'fail',
    };
  });

  return {
    coreFaceId: face.id,
    sourceOctaVertexId: face.sourceVertexId ?? null,
    outwardChildCycle,
    variantRows,
    passCount: variantRows.filter((row) => row.holonomyStatus === 'pass').length,
    rowCount: variantRows.length,
  };
}

function buildAntipodalPairRows(
  ambo: Shape,
  childVertexIds: string[],
  liftByChildId: Map<string, OctaSignedBasis>,
  issues: OctaFirstBirthCarrierBaseV0Issue[],
): OctaAntipodalPairRowV0[] {
  const rows: OctaAntipodalPairRowV0[] = [];
  const paired = new Set<string>();

  for (const childId of childVertexIds) {
    if (paired.has(childId)) {
      continue;
    }

    const position = ambo.vertices[childId]?.position;

    if (!position) {
      continue;
    }

    const partner = childVertexIds.find(
      (candidateId) =>
        candidateId !== childId &&
        !paired.has(candidateId) &&
        isApproximatelyZero(addVectors(position, ambo.vertices[candidateId]?.position ?? [1, 1, 1])),
    );

    if (!partner) {
      issues.push({
        code: 'octa-antipodal-child-unpaired',
        message: `Core child ${childId} has no geometric antipode among the children.`,
      });
      continue;
    }

    paired.add(childId);
    paired.add(partner);

    const leftLift = requireLift(liftByChildId, childId, issues);
    const rightLift = requireLift(liftByChildId, partner, issues);
    const sameUnit = leftLift.unit === rightLift.unit;
    const oppositeSign = leftLift.sign !== rightLift.sign;

    rows.push({
      pairId: `antipodal:${childId}|${partner}`,
      leftChildId: childId,
      rightChildId: partner,
      leftLift: formatSignedBasis(leftLift),
      rightLift: formatSignedBasis(rightLift),
      sameUnit,
      oppositeSign,
      oppositionStatus: sameUnit
        ? oppositeSign
          ? 'same-ray-opposite-sign'
          : 'same-ray-same-sign'
        : 'different-ray',
    });
  }

  return rows;
}

function buildComparisonToReference(
  disc: OctonionVsA3MedialCarrierDiscriminatorV0Report,
  card: MedialDualEquivariantCarrierPolicyModelCardV0Report,
  results: {
    closureAllPass: boolean;
    closurePassCount: number;
    closureRowCount: number;
    holonomyAllPlusOne: boolean;
    holonomyPassCount: number;
    holonomyRowCount: number;
    antipodalityAllOppositeSign: boolean;
    antipodalityPassCount: number;
    antipodalityPairCount: number;
  },
): OctaRelationFamilyComparisonRowV0[] {
  const fiberComponent = card.carrierComponents.find(
    (component) => component.componentId === 'fano-octonionic-local-multiplicative-fiber',
  );

  return [
    {
      relationFamily: 'triangle-closure',
      octaDerivedSummary: `octa recomputed ${results.closurePassCount}/${results.closureRowCount} ordered triangle products closing up to sign (from octa's own lifts)`,
      referenceLaw:
        'every ordered product of two distinct hub-triangle children must close onto the third child up to sign',
      referenceCitation: `disc.summary.triangleClosureStatus='${disc.summary.triangleClosureStatus}' (${disc.summary.canonicalTriangleClosurePassCount}/${disc.summary.canonicalTriangleOrderedProductCount}); card component '${fiberComponent?.componentId ?? 'missing'}' role '${fiberComponent?.role ?? 'missing'}'`,
      octaSatisfiesLaw: results.closureAllPass,
    },
    {
      relationFamily: 'square-holonomy',
      octaDerivedSummary: `octa recomputed ${results.holonomyPassCount}/${results.holonomyRowCount} left-associated square-cycle products equal to +1 (all rotations and reversals)`,
      referenceLaw:
        "the left-associated product around every hub square cycle must equal '+1' for every orientation variant",
      referenceCitation: `disc.summary.squareHolonomyStatus='${disc.summary.squareHolonomyStatus}' (${disc.summary.squareHolonomyPassCount}/${disc.summary.canonicalSquareHolonomyVariantCount})`,
      octaSatisfiesLaw: results.holonomyAllPlusOne,
    },
    {
      relationFamily: 'signed-antipodality',
      octaDerivedSummary: `octa recomputed ${results.antipodalityPassCount}/${results.antipodalityPairCount} geometric antipodal child pairs as same-ray-opposite-sign`,
      referenceLaw:
        'geometrically antipodal hub children must carry the same carrier ray with opposite signs (signed antipodality; F1-R1 complement-transport precedent)',
      referenceCitation: `disc.summary.signedLiftFlagCount=${disc.summary.signedLiftFlagCount} over distinctSignedLiftCount=${disc.summary.distinctSignedLiftCount} signed lifts with paired sign opposition; card claim 'three-component-carrier-required'`,
      octaSatisfiesLaw: results.antipodalityAllOppositeSign,
    },
  ];
}

function buildClassGaugeCheck(
  octa: Shape,
  ambo: Shape | null,
  childVertexIds: string[],
  triangleFaces: Face[],
  squareFaces: Face[],
  frame: DerivedOctaFrame,
  positiveClassOutcomes: RelationOutcomes,
  issues: OctaFirstBirthCarrierBaseV0Issue[],
): OctaClassGaugeCheckV0 {
  let negativeClassOutcomes: RelationOutcomes = {
    closureAllPass: false,
    holonomyAllPlusOne: false,
    antipodalityAllOppositeSign: false,
  };

  if (ambo) {
    const gaugeIssues: OctaFirstBirthCarrierBaseV0Issue[] = [];
    const orientation = deriveOrientation(octa, frame, 'negative', gaugeIssues);
    const liftRows = buildEdgeChildLiftRows(
      octa,
      ambo,
      childVertexIds,
      frame,
      orientation,
      gaugeIssues,
    );
    const liftByChildId = new Map(
      liftRows.map((row) => [row.childVertexId, parseSignedBasis(row.recomputedSignedLift)]),
    );
    const triangles = triangleFaces.map((face) =>
      buildTriangleRelation(face, ambo, liftByChildId, gaugeIssues),
    );
    const squares = squareFaces.map((face) =>
      buildSquareRelation(face, ambo, liftByChildId, gaugeIssues),
    );
    const antipodal = buildAntipodalPairRows(ambo, childVertexIds, liftByChildId, gaugeIssues);
    const closureRowCount = triangles.reduce((sum, row) => sum + row.rowCount, 0);
    const closurePassCount = triangles.reduce((sum, row) => sum + row.passCount, 0);
    const holonomyRowCount = squares.reduce((sum, row) => sum + row.rowCount, 0);
    const holonomyPassCount = squares.reduce((sum, row) => sum + row.passCount, 0);
    const antipodalPass = antipodal.filter(
      (row) => row.oppositionStatus === 'same-ray-opposite-sign',
    ).length;

    negativeClassOutcomes = {
      closureAllPass: closureRowCount > 0 && closurePassCount === closureRowCount,
      holonomyAllPlusOne: holonomyRowCount > 0 && holonomyPassCount === holonomyRowCount,
      antipodalityAllOppositeSign: antipodal.length > 0 && antipodalPass === antipodal.length,
    };

    if (gaugeIssues.length > 0) {
      issues.push({
        code: 'octa-class-gauge-recomputation-malformed',
        message: `Negative-class gauge recomputation raised ${gaugeIssues.length} derivation issue(s); gauge check unreliable.`,
      });
    }
  }

  return {
    positiveClassOutcomes,
    negativeClassOutcomes,
    relationOutcomesInvariantUnderClassGauge:
      positiveClassOutcomes.closureAllPass === negativeClassOutcomes.closureAllPass &&
      positiveClassOutcomes.holonomyAllPlusOne === negativeClassOutcomes.holonomyAllPlusOne &&
      positiveClassOutcomes.antipodalityAllOppositeSign ===
        negativeClassOutcomes.antipodalityAllOppositeSign,
  };
}

function buildIntegrityIssues(args: {
  disc: OctonionVsA3MedialCarrierDiscriminatorV0Report;
  card: MedialDualEquivariantCarrierPolicyModelCardV0Report;
  octaGeometryOk: boolean;
  orientationPolicy: OctaEdgeOrientationPolicyV0;
  primalCarrierAssignment: OctaPrimalCarrierAssignmentV0;
  edgeChildLiftRows: OctaEdgeChildLiftRowV0[];
  triangleClosureRelations: OctaTriangleClosureRelationRowV0[];
  squareHolonomyRelations: OctaSquareHolonomyRelationRowV0[];
  antipodalPairRows: OctaAntipodalPairRowV0[];
  comparisonToReference: OctaRelationFamilyComparisonRowV0[];
  reproductionVerdict: OctaReproductionVerdict;
  familiesSatisfied: number;
}): OctaFirstBirthCarrierBaseV0Issue[] {
  const issues: OctaFirstBirthCarrierBaseV0Issue[] = [];

  if (args.disc.method !== 'octonion-vs-a3-medial-carrier-discriminator-v0' || !args.disc.ok) {
    issues.push({
      code: 'reference-discriminator-invalid',
      message: `Reference discriminator method='${args.disc.method}', ok=${args.disc.ok}.`,
    });
  }

  if (
    args.card.method !== 'medial-dual-equivariant-carrier-policy-model-card-v0' ||
    !args.card.ok
  ) {
    issues.push({
      code: 'reference-model-card-invalid',
      message: `Reference model card method='${args.card.method}', ok=${args.card.ok}.`,
    });
  }

  if (args.orientationPolicy.edgeOrientationRows.length !== 12) {
    issues.push({
      code: 'octa-orientation-row-count-mismatch',
      message: `Expected 12 oriented edges, got ${args.orientationPolicy.edgeOrientationRows.length}.`,
    });
  }

  if (
    args.orientationPolicy.edgeOrientationRows.some((row) => !row.negativeClassInducesReverse)
  ) {
    issues.push({
      code: 'octa-reverse-orientation-unverified',
      message: 'At least one edge lacks the verified reverse-direction induction from the negative class.',
    });
  }

  if (args.edgeChildLiftRows.some((row) => !row.reverseIsOppositeSign)) {
    issues.push({
      code: 'octa-reverse-lift-not-opposite',
      message: 'At least one edge-child reverse-order lift is not the opposite sign of the canonical lift.',
    });
  }

  if (args.edgeChildLiftRows.some((row) => !row.genealogyMatchesMidpointPosition)) {
    issues.push({
      code: 'octa-genealogy-position-disagreement',
      message: 'At least one child fails the genealogy/midpoint position corroboration.',
    });
  }

  const closureRowCount = args.triangleClosureRelations.reduce((sum, row) => sum + row.rowCount, 0);
  const holonomyRowCount = args.squareHolonomyRelations.reduce((sum, row) => sum + row.rowCount, 0);

  if (args.triangleClosureRelations.length !== 8 || closureRowCount !== 48) {
    issues.push({
      code: 'octa-triangle-relation-shape-mismatch',
      message: `Expected 8 triangle relations over 48 ordered products, got ${args.triangleClosureRelations.length}/${closureRowCount}.`,
    });
  }

  if (args.squareHolonomyRelations.length !== 6 || holonomyRowCount !== 48) {
    issues.push({
      code: 'octa-square-relation-shape-mismatch',
      message: `Expected 6 square relations over 48 orientation variants, got ${args.squareHolonomyRelations.length}/${holonomyRowCount}.`,
    });
  }

  if (args.antipodalPairRows.length !== 6) {
    issues.push({
      code: 'octa-antipodal-pair-count-mismatch',
      message: `Expected 6 antipodal child pairs, got ${args.antipodalPairRows.length}.`,
    });
  }

  if (args.comparisonToReference.length !== 3) {
    issues.push({
      code: 'comparison-block-incomplete',
      message: `Comparison-to-reference must cover the 3 relation families; got ${args.comparisonToReference.length}.`,
    });
  }

  for (const row of args.comparisonToReference) {
    if (!row.referenceLaw || !row.referenceCitation || !row.octaDerivedSummary) {
      issues.push({
        code: 'comparison-row-incomplete',
        message: `Comparison row for ${row.relationFamily} lacks law, citation, or octa-derived summary.`,
      });
    }
  }

  const expectedVerdict: OctaReproductionVerdict =
    args.familiesSatisfied === 3
      ? 'cuboctahedral-hub-reproduced'
      : args.familiesSatisfied === 0
        ? 'not-reproduced'
        : 'reproduced-with-deviation';

  if (args.reproductionVerdict !== expectedVerdict) {
    issues.push({
      code: 'reproduction-verdict-not-derived',
      message: `reproductionVerdict '${args.reproductionVerdict}' does not equal the derived mapping '${expectedVerdict}'.`,
    });
  }

  if (!args.octaGeometryOk) {
    issues.push({
      code: 'octa-geometry-precondition-failed',
      message: 'Octa seed geometry preconditions failed; the run is not grounded in octa geometry.',
    });
  }

  return issues;
}

function multiplyOctaSignedBasis(left: OctaSignedBasis, right: OctaSignedBasis): OctaSignedBasis {
  if (left.unit === '1') {
    return { sign: signParity(left.sign, right.sign), unit: right.unit };
  }

  if (right.unit === '1') {
    return { sign: signParity(left.sign, right.sign), unit: left.unit };
  }

  if (left.unit === right.unit) {
    return { sign: signParity(left.sign, right.sign, '-'), unit: '1' };
  }

  const leftNumber = Number(left.unit.slice(1));
  const rightNumber = Number(right.unit.slice(1));

  for (const [first, second, third] of ORIENTED_FANO_TRIPLES) {
    for (const [cycleLeft, cycleRight, cycleProduct] of [
      [first, second, third],
      [second, third, first],
      [third, first, second],
    ] as const) {
      if (leftNumber === cycleLeft && rightNumber === cycleRight) {
        return {
          sign: signParity(left.sign, right.sign, '+'),
          unit: `e${cycleProduct}` as OctaFanoUnit,
        };
      }

      if (leftNumber === cycleRight && rightNumber === cycleLeft) {
        return {
          sign: signParity(left.sign, right.sign, '-'),
          unit: `e${cycleProduct}` as OctaFanoUnit,
        };
      }
    }
  }

  throw new Error(`octa carrier base: unsupported Fano product ${left.unit}*${right.unit}`);
}

function signParity(...signs: OctaSign[]): OctaSign {
  return signs.filter((sign) => sign === '-').length % 2 === 0 ? '+' : '-';
}

function formatSignedBasis(value: OctaSignedBasis): string {
  return `${value.sign}${value.unit}`;
}

function parseSignedBasis(label: string): OctaSignedBasis {
  return {
    sign: label.startsWith('-') ? '-' : '+',
    unit: label.slice(1) as OctaSignedBasisUnit,
  };
}

function requireLift(
  liftByChildId: Map<string, OctaSignedBasis>,
  childId: string,
  issues: OctaFirstBirthCarrierBaseV0Issue[],
): OctaSignedBasis {
  const lift = liftByChildId.get(childId);

  if (!lift) {
    issues.push({
      code: 'octa-lift-missing-for-child',
      message: `No recomputed lift exists for core child ${childId}.`,
    });

    return { sign: '+', unit: '1' };
  }

  return lift;
}

function requireFace(
  shape: Shape,
  faceId: string,
  issues: OctaFirstBirthCarrierBaseV0Issue[],
): Face | null {
  const face = shape.faces.find((candidate) => candidate.id === faceId);

  if (!face) {
    issues.push({
      code: 'octa-core-face-missing',
      message: `Core face ${faceId} is not present in the ambo shape.`,
    });

    return null;
  }

  return face;
}

function orientCycleOutward(vertexIds: string[], shape: Shape): string[] {
  return orientCycleOutwardFromPositions(
    vertexIds,
    vertexIds.map((vertexId) => shape.vertices[vertexId].position),
  );
}

function orientCycleOutwardInShape(vertexIds: string[], shape: Shape): string[] {
  return orientCycleOutwardFromPositions(
    vertexIds,
    vertexIds.map((vertexId) => shape.vertices[vertexId].position),
  );
}

function orientCycleOutwardFromPositions(vertexIds: string[], positions: Vec3[]): string[] {
  const centroid = averagePosition(positions);
  const normal = newellNormal(positions);

  return dotProduct(normal, centroid) >= 0 ? [...vertexIds] : [...vertexIds].reverse();
}

function newellNormal(positions: Vec3[]): Vec3 {
  let x = 0;
  let y = 0;
  let z = 0;

  for (let index = 0; index < positions.length; index += 1) {
    const current = positions[index];
    const next = positions[(index + 1) % positions.length];

    x += (current[1] - next[1]) * (current[2] + next[2]);
    y += (current[2] - next[2]) * (current[0] + next[0]);
    z += (current[0] - next[0]) * (current[1] + next[1]);
  }

  return [x, y, z];
}

function directedEdgeFromCycle(
  cycle: string[],
  u: string,
  v: string,
): [string, string] | null {
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

function rotateCycle(values: string[], rotation: number): string[] {
  return [...values.slice(rotation), ...values.slice(0, rotation)];
}

function unorderedPairKey(left: string, right: string): string {
  return left < right ? `${left}|${right}` : `${right}|${left}`;
}

function addVectors(left: Vec3, right: Vec3): Vec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

function subtractVectors(left: Vec3, right: Vec3): Vec3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
}

function scaleVector(value: Vec3, factor: number): Vec3 {
  return [value[0] * factor, value[1] * factor, value[2] * factor];
}

function dotProduct(left: Vec3, right: Vec3): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function determinant3(a: Vec3, b: Vec3, c: Vec3): number {
  return (
    a[0] * (b[1] * c[2] - b[2] * c[1]) -
    a[1] * (b[0] * c[2] - b[2] * c[0]) +
    a[2] * (b[0] * c[1] - b[1] * c[0])
  );
}

function averagePosition(positions: Vec3[]): Vec3 {
  const sum = positions.reduce<Vec3>((accumulator, position) => addVectors(accumulator, position), [
    0, 0, 0,
  ]);

  return positions.length === 0 ? [0, 0, 0] : scaleVector(sum, 1 / positions.length);
}

function isApproximatelyZero(value: Vec3): boolean {
  return Math.abs(value[0]) <= 1e-6 && Math.abs(value[1]) <= 1e-6 && Math.abs(value[2]) <= 1e-6;
}

function dedupeIssues(
  issues: OctaFirstBirthCarrierBaseV0Issue[],
): OctaFirstBirthCarrierBaseV0Issue[] {
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
