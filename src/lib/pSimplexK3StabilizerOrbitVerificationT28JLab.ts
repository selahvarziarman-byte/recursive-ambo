import {
  buildPSimplexGeometryGraphSamplingGateK3V0Report,
  type PSimplexGeometryGraphSamplingGateK3V0Report,
} from './pSimplexGeometryGraphSamplingGateK3V0';

type PrimalId = 'A' | 'B' | 'C' | 'D';
type ChildId = 'M_AB' | 'M_AC' | 'M_AD' | 'M_BC' | 'M_BD' | 'M_CD';
type SourceId = PrimalId | ChildId;
type AxisPairId = 'AB-CD' | 'AC-BD' | 'AD-BC';
type SourceKind = 'primal' | 'child';
type Vec3 = [number, number, number];
type BreakVector2 = [number, number];

export type T28JLabSummaryVerdict =
  | 'T28-J-Lab-stabilizer-orbit-theorem-verified'
  | 'T28-J-Lab-sibling-choice-equivalence-failed'
  | 'T28-J-Lab-orbit-average-collapse-failed'
  | 'T28-J-Lab-relation-class-symmetry-collapse-failed'
  | 'T28-J-Lab-weight-formula-mismatch'
  | 'T28-J-Lab-parent-sibling-decomposition-inconclusive'
  | 'T28-J-Lab-boundary-failed';

export interface T28JLabParentEvidenceRow {
  parentId: 'K3';
  builderName: 'buildPSimplexGeometryGraphSamplingGateK3V0Report';
  importStatus: 'imported' | 'failed';
  ok: boolean;
  verdict: string | null;
  diagnosticScope: string | null;
  usedFor: 'k3-parent-source';
}

export interface TargetAxisStabilizerRow {
  targetChild: ChildId;
  axisPairId: AxisPairId;
  targetAxis: Vec3;
  antipodalPartner: ChildId;
  endpointParents: [PrimalId, PrimalId];
  complementParents: [PrimalId, PrimalId];
  legalOneEndpointSiblings: ChildId[];
  endpointParentOrbit: [PrimalId, PrimalId];
  complementParentOrbit: [PrimalId, PrimalId];
  siblingCancellationOrbits: Array<[ChildId, ChildId]>;
  axisSourcesAllowedToDiffer: [ChildId, ChildId];
  stabilizerCondition: {
    endpointParentsEqual: string;
    complementParentsEqual: string;
    siblingPairEqualities: string[];
  };
  stabilizerMeaning: 'weights constant on target-axis cancellation orbits imply zero transverse residual';
}

export interface SingleSiblingOrbitRow {
  targetChild: ChildId;
  axisPairId: AxisPairId;
  siblingChild: ChildId;
  samplePosition: Vec3;
  phi: Vec3;
  axisProjection: number;
  transverseResidualVector: Vec3;
  transverseResidualMagnitude: number;
  axisAlignment: number;
  residualDirectionClass:
    | '+first-transverse-axis'
    | '-first-transverse-axis'
    | '+second-transverse-axis'
    | '-second-transverse-axis'
    | 'mixed'
    | 'zero';
  matchesK3TDeterministicMagnitude: boolean;
}

export interface SiblingChoiceEquivalenceRow {
  targetChild: ChildId;
  axisPairId: AxisPairId;
  siblingCount: number;
  residualMagnitudes: number[];
  minResidualMagnitude: number;
  maxResidualMagnitude: number;
  residualMagnitudeSpread: number;
  axisAlignmentValues: number[];
  minAxisAlignment: number;
  maxAxisAlignment: number;
  axisAlignmentSpread: number;
  residualCoordinatePairs: BreakVector2[];
  absoluteCoordinatePairs: BreakVector2[];
  tolerance: number;
  signedPermutationOrbitStatus:
    | 'signed-permutation-orbit'
    | 'magnitude-only'
    | 'not-signed-permutation-orbit'
    | 'inconclusive';
  siblingChoiceEquivalenceStatus: 'equivalent-up-to-signed-permutation' | 'not-equivalent' | 'inconclusive';
}

export interface OrbitAverageRow {
  targetChild: ChildId;
  axisPairId: AxisPairId;
  orbitMemberCount: number;
  orbitAveragePhi: Vec3;
  orbitAverageAxisProjection: number;
  orbitAverageTransverseResidualVector: Vec3;
  orbitAverageTransverseResidualMagnitude: number;
  orbitAverageAxisAlignment: number;
  tolerance: number;
  orbitAverageStatus: 'residual-collapses-to-zero' | 'residual-persists' | 'inconclusive';
}

export interface RelationClassSymmetricKernelRow {
  targetChild: ChildId;
  axisPairId: AxisPairId;
  assignmentId: string;
  endpointParentWeight: number;
  complementParentWeight: number;
  siblingPair1Weight: number;
  siblingPair2Weight: number;
  targetChildWeight: number;
  antipodalChildWeight: number;
  phi: Vec3;
  axisProjection: number;
  transverseResidualMagnitude: number;
  tolerance: number;
  relationClassSymmetricStatus: 'residual-zero' | 'residual-nonzero' | 'inconclusive';
}

export interface WeightSpaceResidualFormulaRow {
  targetChild: ChildId;
  axisPairId: AxisPairId;
  sampleKind: 'deterministic-K3T' | 'single-sibling-choice' | 'orbit-average' | 'relation-class-symmetric';
  sampleId: string;
  directResidualMagnitude: number;
  formulaResidualMagnitude: number;
  formulaMatchesDirect: boolean;
  R1: number;
  R2: number;
  formulaScale: number;
  formulaConvention: string;
  formulaInputSource: 'source-weights-and-q-vectors' | 'residual-vector' | 'unknown';
  formulaIndependenceStatus:
    | 'independent-from-residual-vector'
    | 'tautological-from-residual-vector'
    | 'inconclusive';
  formulaStatus: 'formula-matches-direct' | 'formula-mismatch' | 'inconclusive';
}

export interface ParentVsSiblingContributionRow {
  targetChild: ChildId;
  axisPairId: AxisPairId;
  sampleKind: 'deterministic-K3T' | 'single-sibling-choice' | 'orbit-average' | 'relation-class-symmetric';
  sampleId: string;
  parentBreakVector: BreakVector2;
  siblingBreakVector: BreakVector2;
  combinedBreakVector: BreakVector2;
  parentBreakMagnitude: number;
  siblingBreakMagnitude: number;
  combinedBreakMagnitude: number;
  dominantBreakSource: 'sibling-localization' | 'parent-pair-breaking' | 'balanced' | 'none' | 'inconclusive';
}

export interface SymmetryClassificationRow {
  modelId: string;
  modelKind:
    | 'K3-A-primary'
    | 'K3-A-complement'
    | 'deterministic-K3T'
    | 'single-sibling-K3T'
    | 'orbit-averaged-K3T'
    | 'relation-class-symmetric-weight-model';
  targetChild: ChildId;
  axisPairId: AxisPairId;
  stabilizerPreserved: boolean;
  siblingCancellationPreserved: boolean;
  parentPairSymmetryPreserved: boolean;
  residualZero: boolean;
  symmetryClass:
    | 'stabilizer-preserving-zero-residual'
    | 'localized-sibling-breaking-positive-residual'
    | 'parent-pair-breaking-positive-residual'
    | 'compensated-breaking-zero-residual'
    | 'inconclusive';
}

export interface BoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface FalsifierRow {
  falsifierId: string;
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export interface PSimplexK3StabilizerOrbitVerificationT28JLabReport {
  method: 'p-simplex-k3-stabilizer-orbit-verification-t28j-lab';
  diagnosticScope: 'k3-stabilizer-orbit-residual-verification-only';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  parentEvidenceRows: T28JLabParentEvidenceRow[];
  targetAxisStabilizerRows: TargetAxisStabilizerRow[];
  singleSiblingOrbitRows: SingleSiblingOrbitRow[];
  siblingChoiceEquivalenceRows: SiblingChoiceEquivalenceRow[];
  orbitAverageRows: OrbitAverageRow[];
  relationClassSymmetricKernelRows: RelationClassSymmetricKernelRow[];
  weightSpaceResidualFormulaRows: WeightSpaceResidualFormulaRow[];
  parentVsSiblingContributionRows: ParentVsSiblingContributionRow[];
  symmetryClassificationRows: SymmetryClassificationRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  summaryVerdict: T28JLabSummaryVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface SourceRecord {
  sourceId: SourceId;
  sourceKind: SourceKind;
  geometryPosition: Vec3;
  qVector: Vec3;
}

interface TargetRecord {
  targetChild: ChildId;
  axisPairId: AxisPairId;
  targetAxis: Vec3;
  geometryPosition: Vec3;
  antipodalPartner: ChildId;
  endpointParents: [PrimalId, PrimalId];
  complementParents: [PrimalId, PrimalId];
  legalOneEndpointSiblings: ChildId[];
  siblingCancellationPairs: Array<[ChildId, ChildId]>;
}

interface EvaluatedWeightedSample {
  targetChild: ChildId;
  axisPairId: AxisPairId;
  sampleKind:
    | 'K3-A-primary'
    | 'K3-A-complement'
    | 'deterministic-K3T'
    | 'single-sibling-choice'
    | 'orbit-average'
    | 'relation-class-symmetric';
  sampleId: string;
  sourceWeights: Record<SourceId, number>;
  phi: Vec3;
  axisProjection: number;
  transverseResidualVector: Vec3;
  transverseResidualMagnitude: number;
  axisAlignment: number;
}

interface RelationAssignment {
  assignmentId: string;
  endpointParentWeight: number;
  complementParentWeight: number;
  siblingPair1Weight: number;
  siblingPair2Weight: number;
  targetChildWeight: number;
  antipodalChildWeight: number;
}

const EPSILON = 1e-9;
const NUMERIC_TOLERANCE = 1e-9;
const BRANCH_REF = 'wgate/arf-w1-root-frame-v0' as const;
const METHOD = 'p-simplex-k3-stabilizer-orbit-verification-t28j-lab' as const;
const DIAGNOSTIC_SCOPE = 'k3-stabilizer-orbit-residual-verification-only' as const;
const FORMULA_SCALE = 1 / Math.sqrt(3);
const FORMULA_CONVENTION =
  'target-local orthonormal transverse coordinates with R_i = sqrt(3) * dot(residualVector, transverseAxis_i)';
const PRIMAL_ORDER: readonly PrimalId[] = ['A', 'B', 'C', 'D'];
const CHILD_ORDER: readonly ChildId[] = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const TARGET_CHILDREN: readonly ChildId[] = CHILD_ORDER;
const AXIS_PAIR_IDS: readonly AxisPairId[] = ['AB-CD', 'AC-BD', 'AD-BC'];
const REQUIRED_BOUNDARY_IDS = [
  'not-ATD-H0-survival',
  'not-ACTS-v0',
  'not-corridor',
  'not-route',
  'not-gate',
  'not-loop',
  'not-vortex',
  'not-support-region',
  'not-topology',
  'not-fieldcue',
  'not-semantic-naming',
  'not-generated-site-reading',
  'not-runtime',
  'not-field-resurrection',
  'not-P-channel-support',
  'not-G-spatial-propagation',
  'not-closed-A3-response',
  'not-body-response',
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
const ALLOWED_SUMMARY_VERDICTS: readonly T28JLabSummaryVerdict[] = [
  'T28-J-Lab-stabilizer-orbit-theorem-verified',
  'T28-J-Lab-sibling-choice-equivalence-failed',
  'T28-J-Lab-orbit-average-collapse-failed',
  'T28-J-Lab-relation-class-symmetry-collapse-failed',
  'T28-J-Lab-weight-formula-mismatch',
  'T28-J-Lab-parent-sibling-decomposition-inconclusive',
  'T28-J-Lab-boundary-failed',
];
const FORBIDDEN_VERDICTS = [
  'ATD-H0-survives',
  'ACTS-v0-accepted',
  'corridor-confirmed',
  'route-confirmed',
  'gate-confirmed',
  'fieldworld-feature-confirmed',
  'FieldCue-ready',
  'topology-authorized',
  'runtime-authorized',
];
const RELATION_ASSIGNMENTS: readonly RelationAssignment[] = [
  {
    assignmentId: 'assignment-1',
    endpointParentWeight: 1,
    complementParentWeight: 1,
    siblingPair1Weight: 1,
    siblingPair2Weight: 1,
    targetChildWeight: 1,
    antipodalChildWeight: 0.5,
  },
  {
    assignmentId: 'assignment-2',
    endpointParentWeight: 2,
    complementParentWeight: 0.75,
    siblingPair1Weight: 1.25,
    siblingPair2Weight: 0.5,
    targetChildWeight: 1.5,
    antipodalChildWeight: 0.25,
  },
  {
    assignmentId: 'assignment-3',
    endpointParentWeight: 0.25,
    complementParentWeight: 1.75,
    siblingPair1Weight: 0.6,
    siblingPair2Weight: 2,
    targetChildWeight: 0.4,
    antipodalChildWeight: 1.6,
  },
];

export function buildPSimplexK3StabilizerOrbitVerificationT28JLabReport(
  k3Report = buildPSimplexGeometryGraphSamplingGateK3V0Report(),
): PSimplexK3StabilizerOrbitVerificationT28JLabReport {
  const parentEvidenceRows = buildParentEvidenceRows(k3Report);
  const sources = buildSourceRecords(k3Report);
  const targets = buildTargetRecords(sources);
  const targetAxisStabilizerRows = targets.map(buildTargetAxisStabilizerRow);
  const deterministicK3TSamples = buildParentK3Samples(k3Report, sources, targets, 'K3-T', 'deterministic-K3T');
  const k3APrimarySamples = buildParentK3Samples(k3Report, sources, targets, 'K3-A-primary', 'K3-A-primary');
  const k3AComplementSamples = buildParentK3Samples(k3Report, sources, targets, 'K3-A-complement', 'K3-A-complement');
  const singleSiblingSamples = buildSingleSiblingSamples(sources, targets, deterministicK3TSamples);
  const singleSiblingOrbitRows = singleSiblingSamples.map((sample) => toSingleSiblingOrbitRow(sample, targets));
  const siblingChoiceEquivalenceRows = buildSiblingChoiceEquivalenceRows(singleSiblingOrbitRows, targets);
  const orbitAverageSamples = buildOrbitAverageSamples(singleSiblingSamples, sources, targets);
  const orbitAverageRows = orbitAverageSamples.map(toOrbitAverageRow);
  const relationSamples = buildRelationClassSymmetricSamples(sources, targets);
  const relationClassSymmetricKernelRows = relationSamples.map(toRelationClassSymmetricKernelRow);
  const testedResidualSamples = [
    ...deterministicK3TSamples,
    ...singleSiblingSamples,
    ...orbitAverageSamples,
    ...relationSamples,
  ];
  const weightSpaceResidualFormulaRows = testedResidualSamples.map((sample) =>
    buildWeightSpaceResidualFormulaRow(sample, sources, targets),
  );
  const parentVsSiblingContributionRows = testedResidualSamples.map((sample) =>
    buildParentVsSiblingContributionRow(sample, sources, targets),
  );
  const symmetryClassificationRows = buildSymmetryClassificationRows({
    k3APrimarySamples,
    k3AComplementSamples,
    deterministicK3TSamples,
    singleSiblingSamples,
    orbitAverageSamples,
    relationSamples,
    targets,
  });
  const boundaryRows = buildBoundaryRows();
  const preliminaryVerdict = classifySummaryVerdict({
    boundaryFailed: false,
    integrityIssues: [],
    siblingChoiceEquivalenceRows,
    orbitAverageRows,
    relationClassSymmetricKernelRows,
    weightSpaceResidualFormulaRows,
    parentVsSiblingContributionRows,
  });
  const falsifierRows = buildFalsifierRows({
    parentEvidenceRows,
    targetAxisStabilizerRows,
    singleSiblingOrbitRows,
    orbitAverageRows,
    relationClassSymmetricKernelRows,
    weightSpaceResidualFormulaRows,
    parentVsSiblingContributionRows,
    siblingChoiceEquivalenceRows,
    summaryVerdict: preliminaryVerdict,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    targetAxisStabilizerRows,
    singleSiblingOrbitRows,
    siblingChoiceEquivalenceRows,
    orbitAverageRows,
    relationClassSymmetricKernelRows,
    weightSpaceResidualFormulaRows,
    parentVsSiblingContributionRows,
    boundaryRows,
    falsifierRows,
    summaryVerdict: preliminaryVerdict,
  });
  const boundaryFailed = falsifierRows.some((row) => boundaryFalsifierId(row.falsifierId) && row.triggered);
  const summaryVerdict = classifySummaryVerdict({
    boundaryFailed,
    integrityIssues,
    siblingChoiceEquivalenceRows,
    orbitAverageRows,
    relationClassSymmetricKernelRows,
    weightSpaceResidualFormulaRows,
    parentVsSiblingContributionRows,
  });
  const finalIntegrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    targetAxisStabilizerRows,
    singleSiblingOrbitRows,
    siblingChoiceEquivalenceRows,
    orbitAverageRows,
    relationClassSymmetricKernelRows,
    weightSpaceResidualFormulaRows,
    parentVsSiblingContributionRows,
    boundaryRows,
    falsifierRows,
    summaryVerdict,
  });

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    parentEvidenceRows,
    targetAxisStabilizerRows,
    singleSiblingOrbitRows,
    siblingChoiceEquivalenceRows,
    orbitAverageRows,
    relationClassSymmetricKernelRows,
    weightSpaceResidualFormulaRows,
    parentVsSiblingContributionRows,
    symmetryClassificationRows,
    boundaryRows,
    falsifierRows,
    summaryVerdict,
    integrityIssues: finalIntegrityIssues,
    integrityIssueCount: finalIntegrityIssues.length,
    ok: finalIntegrityIssues.length === 0,
  };
}

function buildParentEvidenceRows(k3Report: PSimplexGeometryGraphSamplingGateK3V0Report | null | undefined): T28JLabParentEvidenceRow[] {
  return [
    {
      parentId: 'K3',
      builderName: 'buildPSimplexGeometryGraphSamplingGateK3V0Report',
      importStatus: k3Report ? 'imported' : 'failed',
      ok: k3Report?.ok === true,
      verdict: k3Report?.verdict ?? null,
      diagnosticScope: k3Report?.diagnosticScope ?? null,
      usedFor: 'k3-parent-source',
    },
  ];
}

function buildSourceRecords(k3Report: PSimplexGeometryGraphSamplingGateK3V0Report): SourceRecord[] {
  return k3Report.geometrySourceRows
    .filter((row) => isSourceId(row.sourceId))
    .map((row) => ({
      sourceId: row.sourceId as SourceId,
      sourceKind: row.sourceKind as SourceKind,
      geometryPosition: toVec3(row.geometryPosition),
      qVector: toVec3(row.qVector),
    }))
    .sort((left, right) => sourceOrder(left.sourceId) - sourceOrder(right.sourceId));
}

function buildTargetRecords(sources: readonly SourceRecord[]): TargetRecord[] {
  return TARGET_CHILDREN.flatMap((targetChild) => {
    const source = sourceById(sources, targetChild);

    if (!source) {
      return [];
    }

    const endpointParents = endpointsForChild(targetChild);
    const complementParents = complementEndpoints(endpointParents);
    const antipodalPartner = childIdForEndpoints(complementParents[0], complementParents[1]);
    const legalOneEndpointSiblings = CHILD_ORDER.filter(
      (child) =>
        child !== targetChild &&
        child !== antipodalPartner &&
        sharesExactlyOneEndpoint(endpointParents, endpointsForChild(child)),
    );
    const [i, j] = endpointParents;
    const [k, l] = complementParents;
    const siblingCancellationPairs: Array<[ChildId, ChildId]> = [
      [childIdForEndpoints(i, k), childIdForEndpoints(j, l)],
      [childIdForEndpoints(i, l), childIdForEndpoints(j, k)],
    ];

    return [
      {
        targetChild,
        axisPairId: axisPairForChild(targetChild),
        targetAxis: cleanVec3(normalizeVec3(source.qVector) ?? [0, 0, 0]),
        geometryPosition: source.geometryPosition,
        antipodalPartner,
        endpointParents,
        complementParents,
        legalOneEndpointSiblings,
        siblingCancellationPairs,
      },
    ];
  });
}

function buildTargetAxisStabilizerRow(target: TargetRecord): TargetAxisStabilizerRow {
  return {
    targetChild: target.targetChild,
    axisPairId: target.axisPairId,
    targetAxis: target.targetAxis,
    antipodalPartner: target.antipodalPartner,
    endpointParents: target.endpointParents,
    complementParents: target.complementParents,
    legalOneEndpointSiblings: [...target.legalOneEndpointSiblings],
    endpointParentOrbit: target.endpointParents,
    complementParentOrbit: target.complementParents,
    siblingCancellationOrbits: target.siblingCancellationPairs,
    axisSourcesAllowedToDiffer: [target.targetChild, target.antipodalPartner],
    stabilizerCondition: {
      endpointParentsEqual: `${target.endpointParents[0]} = ${target.endpointParents[1]}`,
      complementParentsEqual: `${target.complementParents[0]} = ${target.complementParents[1]}`,
      siblingPairEqualities: target.siblingCancellationPairs.map(([left, right]) => `${left} = ${right}`),
    },
    stabilizerMeaning: 'weights constant on target-axis cancellation orbits imply zero transverse residual',
  };
}

function buildParentK3Samples(
  k3Report: PSimplexGeometryGraphSamplingGateK3V0Report,
  sources: readonly SourceRecord[],
  targets: readonly TargetRecord[],
  sampleFamily: 'K3-T' | 'K3-A-primary' | 'K3-A-complement',
  sampleKind: EvaluatedWeightedSample['sampleKind'],
): EvaluatedWeightedSample[] {
  return k3Report.k3SampleRows
    .filter((row) => row.sampleFamily === sampleFamily && isChildId(row.targetChild))
    .map((row) => {
      const target = requireTarget(targets, row.targetChild as ChildId);
      return evaluateSourceWeights({
        target,
        sources,
        sampleKind,
        sampleId: row.sampleId,
        sourceWeights: sourceWeightsFromRecord(row.sourceWeights, sources),
      });
    });
}

function buildSingleSiblingSamples(
  sources: readonly SourceRecord[],
  targets: readonly TargetRecord[],
  deterministicSamples: readonly EvaluatedWeightedSample[],
): EvaluatedWeightedSample[] {
  return targets.flatMap((target) =>
    target.legalOneEndpointSiblings.map((siblingChild) => {
      const sibling = requireSource(sources, siblingChild);
      const samplePosition = midpointVec3(target.geometryPosition, sibling.geometryPosition);
      const sourceWeights = radialWeightsForPosition(samplePosition, sources);
      const deterministic = requireEvaluatedSample(deterministicSamples, target.targetChild);

      return {
        ...evaluateSourceWeights({
          target,
          sources,
          sampleKind: 'single-sibling-choice',
          sampleId: `single-sibling:${target.targetChild}:${siblingChild}`,
          sourceWeights,
        }),
        siblingChild,
        samplePosition: cleanVec3(samplePosition),
        matchesK3TDeterministicMagnitude: nearlyEqual(
          computeWeightedVector(sourceWeights, sources, target).transverseResidualMagnitude,
          deterministic.transverseResidualMagnitude,
          NUMERIC_TOLERANCE,
        ),
      };
    }),
  );
}

function toSingleSiblingOrbitRow(
  sample: EvaluatedWeightedSample & {
    siblingChild?: ChildId;
    samplePosition?: Vec3;
    matchesK3TDeterministicMagnitude?: boolean;
  },
  targets: readonly TargetRecord[],
): SingleSiblingOrbitRow {
  const target = requireTarget(targets, sample.targetChild);

  return {
    targetChild: sample.targetChild,
    axisPairId: sample.axisPairId,
    siblingChild: sample.siblingChild ?? target.legalOneEndpointSiblings[0],
    samplePosition: sample.samplePosition ?? [0, 0, 0],
    phi: sample.phi,
    axisProjection: sample.axisProjection,
    transverseResidualVector: sample.transverseResidualVector,
    transverseResidualMagnitude: sample.transverseResidualMagnitude,
    axisAlignment: sample.axisAlignment,
    residualDirectionClass: classifyResidualDirection(sample.transverseResidualVector, target, NUMERIC_TOLERANCE),
    matchesK3TDeterministicMagnitude: sample.matchesK3TDeterministicMagnitude === true,
  };
}

function buildSiblingChoiceEquivalenceRows(
  rows: readonly SingleSiblingOrbitRow[],
  targets: readonly TargetRecord[],
): SiblingChoiceEquivalenceRow[] {
  return targets.map((target) => {
    const targetRows = rows.filter((row) => row.targetChild === target.targetChild);
    const residualMagnitudes = targetRows.map((row) => row.transverseResidualMagnitude);
    const axisAlignmentValues = targetRows.map((row) => row.axisAlignment);
    const minResidualMagnitude = minOrZero(residualMagnitudes);
    const maxResidualMagnitude = maxOrZero(residualMagnitudes);
    const minAxisAlignment = minOrZero(axisAlignmentValues);
    const maxAxisAlignment = maxOrZero(axisAlignmentValues);
    const residualMagnitudeSpread = cleanNumber(maxResidualMagnitude - minResidualMagnitude);
    const axisAlignmentSpread = cleanNumber(maxAxisAlignment - minAxisAlignment);
    const residualCoordinatePairs = targetRows.map((row) =>
      cleanBreakVector(transverseCoordinates(row.transverseResidualVector, target)),
    );
    const absoluteCoordinatePairs = residualCoordinatePairs.map(canonicalAbsPair);
    const complete = targetRows.length === 4;
    const scalarEquivalent =
      residualMagnitudeSpread <= NUMERIC_TOLERANCE &&
      axisAlignmentSpread <= NUMERIC_TOLERANCE;
    const signedPermutationOrbitStatus = classifySignedPermutationOrbitStatus({
      complete,
      scalarEquivalent,
      residualCoordinatePairs,
      absoluteCoordinatePairs,
    });
    const equivalent =
      complete &&
      scalarEquivalent &&
      signedPermutationOrbitStatus === 'signed-permutation-orbit';

    return {
      targetChild: target.targetChild,
      axisPairId: target.axisPairId,
      siblingCount: targetRows.length,
      residualMagnitudes,
      minResidualMagnitude,
      maxResidualMagnitude,
      residualMagnitudeSpread,
      axisAlignmentValues,
      minAxisAlignment,
      maxAxisAlignment,
      axisAlignmentSpread,
      residualCoordinatePairs,
      absoluteCoordinatePairs,
      tolerance: NUMERIC_TOLERANCE,
      signedPermutationOrbitStatus,
      siblingChoiceEquivalenceStatus: !complete
        ? 'inconclusive'
        : equivalent
          ? 'equivalent-up-to-signed-permutation'
          : 'not-equivalent',
    };
  });
}

function buildOrbitAverageSamples(
  singleSiblingSamples: readonly EvaluatedWeightedSample[],
  sources: readonly SourceRecord[],
  targets: readonly TargetRecord[],
): EvaluatedWeightedSample[] {
  return targets.map((target) => {
    const targetSamples = singleSiblingSamples.filter((sample) => sample.targetChild === target.targetChild);
    const sourceWeights = averageSourceWeights(targetSamples.map((sample) => sample.sourceWeights), sources);

    return evaluateSourceWeights({
      target,
      sources,
      sampleKind: 'orbit-average',
      sampleId: `orbit-average:${target.targetChild}`,
      sourceWeights,
    });
  });
}

function toOrbitAverageRow(sample: EvaluatedWeightedSample): OrbitAverageRow {
  const orbitMemberCount = 4;
  const residualMagnitude = sample.transverseResidualMagnitude;

  return {
    targetChild: sample.targetChild,
    axisPairId: sample.axisPairId,
    orbitMemberCount,
    orbitAveragePhi: sample.phi,
    orbitAverageAxisProjection: sample.axisProjection,
    orbitAverageTransverseResidualVector: sample.transverseResidualVector,
    orbitAverageTransverseResidualMagnitude: residualMagnitude,
    orbitAverageAxisAlignment: sample.axisAlignment,
    tolerance: NUMERIC_TOLERANCE,
    orbitAverageStatus:
      orbitMemberCount !== 4
        ? 'inconclusive'
        : residualMagnitude <= NUMERIC_TOLERANCE
          ? 'residual-collapses-to-zero'
          : 'residual-persists',
  };
}

function buildRelationClassSymmetricSamples(
  sources: readonly SourceRecord[],
  targets: readonly TargetRecord[],
): Array<EvaluatedWeightedSample & RelationAssignment> {
  return targets.flatMap((target) =>
    RELATION_ASSIGNMENTS.map((assignment) => {
      const sourceWeights = relationClassSymmetricWeights(target, assignment);
      return {
        ...evaluateSourceWeights({
          target,
          sources,
          sampleKind: 'relation-class-symmetric',
          sampleId: `relation-class:${target.targetChild}:${assignment.assignmentId}`,
          sourceWeights,
        }),
        ...assignment,
      };
    }),
  );
}

function toRelationClassSymmetricKernelRow(sample: EvaluatedWeightedSample & RelationAssignment): RelationClassSymmetricKernelRow {
  return {
    targetChild: sample.targetChild,
    axisPairId: sample.axisPairId,
    assignmentId: sample.assignmentId,
    endpointParentWeight: sample.endpointParentWeight,
    complementParentWeight: sample.complementParentWeight,
    siblingPair1Weight: sample.siblingPair1Weight,
    siblingPair2Weight: sample.siblingPair2Weight,
    targetChildWeight: sample.targetChildWeight,
    antipodalChildWeight: sample.antipodalChildWeight,
    phi: sample.phi,
    axisProjection: sample.axisProjection,
    transverseResidualMagnitude: sample.transverseResidualMagnitude,
    tolerance: NUMERIC_TOLERANCE,
    relationClassSymmetricStatus:
      sample.transverseResidualMagnitude <= NUMERIC_TOLERANCE ? 'residual-zero' : 'residual-nonzero',
  };
}

function buildWeightSpaceResidualFormulaRow(
  sample: EvaluatedWeightedSample,
  sources: readonly SourceRecord[],
  targets: readonly TargetRecord[],
): WeightSpaceResidualFormulaRow {
  const target = requireTarget(targets, sample.targetChild);
  const [coord1, coord2] = formulaCoordinatesFromWeights(sample.sourceWeights, sources, target);
  const R1 = cleanNumber(coord1 / FORMULA_SCALE);
  const R2 = cleanNumber(coord2 / FORMULA_SCALE);
  const formulaResidualMagnitude = cleanNumber(FORMULA_SCALE * Math.sqrt(R1 * R1 + R2 * R2));
  const directResidualMagnitude = sample.transverseResidualMagnitude;
  const formulaMatchesDirect = nearlyEqual(directResidualMagnitude, formulaResidualMagnitude, NUMERIC_TOLERANCE);

  return {
    targetChild: sample.targetChild,
    axisPairId: sample.axisPairId,
    sampleKind: formulaSampleKind(sample.sampleKind),
    sampleId: sample.sampleId,
    directResidualMagnitude,
    formulaResidualMagnitude,
    formulaMatchesDirect,
    R1,
    R2,
    formulaScale: cleanNumber(FORMULA_SCALE),
    formulaConvention: FORMULA_CONVENTION,
    formulaInputSource: 'source-weights-and-q-vectors',
    formulaIndependenceStatus: 'independent-from-residual-vector',
    formulaStatus: formulaMatchesDirect ? 'formula-matches-direct' : 'formula-mismatch',
  };
}

function buildParentVsSiblingContributionRow(
  sample: EvaluatedWeightedSample,
  sources: readonly SourceRecord[],
  targets: readonly TargetRecord[],
): ParentVsSiblingContributionRow {
  const target = requireTarget(targets, sample.targetChild);
  const parentBreakVector = cleanBreakVector(transverseCoordinates(sourceSubsetPhi(sample.sourceWeights, sources, [
    ...target.endpointParents,
    ...target.complementParents,
  ]), target));
  const siblingBreakVector = cleanBreakVector(transverseCoordinates(sourceSubsetPhi(sample.sourceWeights, sources, target.legalOneEndpointSiblings), target));
  const combinedBreakVector = cleanBreakVector([
    parentBreakVector[0] + siblingBreakVector[0],
    parentBreakVector[1] + siblingBreakVector[1],
  ]);
  const parentBreakMagnitude = cleanNumber(norm2(parentBreakVector));
  const siblingBreakMagnitude = cleanNumber(norm2(siblingBreakVector));
  const combinedBreakMagnitude = cleanNumber(norm2(combinedBreakVector));

  return {
    targetChild: sample.targetChild,
    axisPairId: sample.axisPairId,
    sampleKind: formulaSampleKind(sample.sampleKind),
    sampleId: sample.sampleId,
    parentBreakVector,
    siblingBreakVector,
    combinedBreakVector,
    parentBreakMagnitude,
    siblingBreakMagnitude,
    combinedBreakMagnitude,
    dominantBreakSource: classifyDominantBreakSource(parentBreakMagnitude, siblingBreakMagnitude, combinedBreakMagnitude),
  };
}

function buildSymmetryClassificationRows(args: {
  k3APrimarySamples: readonly EvaluatedWeightedSample[];
  k3AComplementSamples: readonly EvaluatedWeightedSample[];
  deterministicK3TSamples: readonly EvaluatedWeightedSample[];
  singleSiblingSamples: readonly EvaluatedWeightedSample[];
  orbitAverageSamples: readonly EvaluatedWeightedSample[];
  relationSamples: readonly EvaluatedWeightedSample[];
  targets: readonly TargetRecord[];
}): SymmetryClassificationRow[] {
  return [
    ...args.k3APrimarySamples.map((sample) => buildSymmetryClassificationRow(sample, args.targets, 'K3-A-primary')),
    ...args.k3AComplementSamples.map((sample) => buildSymmetryClassificationRow(sample, args.targets, 'K3-A-complement')),
    ...args.deterministicK3TSamples.map((sample) => buildSymmetryClassificationRow(sample, args.targets, 'deterministic-K3T')),
    ...args.singleSiblingSamples.map((sample) => buildSymmetryClassificationRow(sample, args.targets, 'single-sibling-K3T')),
    ...args.orbitAverageSamples.map((sample) => buildSymmetryClassificationRow(sample, args.targets, 'orbit-averaged-K3T')),
    ...args.relationSamples.map((sample) =>
      buildSymmetryClassificationRow(sample, args.targets, 'relation-class-symmetric-weight-model'),
    ),
  ];
}

function buildSymmetryClassificationRow(
  sample: EvaluatedWeightedSample,
  targets: readonly TargetRecord[],
  modelKind: SymmetryClassificationRow['modelKind'],
): SymmetryClassificationRow {
  const target = requireTarget(targets, sample.targetChild);
  const flags = symmetryFlags(sample.sourceWeights, target);
  const residualZero = sample.transverseResidualMagnitude <= NUMERIC_TOLERANCE;

  return {
    modelId: sample.sampleId,
    modelKind,
    targetChild: sample.targetChild,
    axisPairId: sample.axisPairId,
    stabilizerPreserved: flags.stabilizerPreserved,
    siblingCancellationPreserved: flags.siblingCancellationPreserved,
    parentPairSymmetryPreserved: flags.parentPairSymmetryPreserved,
    residualZero,
    symmetryClass: classifySymmetryClass(flags, residualZero),
  };
}

function buildBoundaryRows(): BoundaryRow[] {
  return [
    boundary('not-ATD-H0-survival', 'ATD-H0 survival is not retested or rescued.'),
    boundary('not-ACTS-v0', 'ACTS-v0 is not introduced.'),
    boundary('not-corridor', 'No corridor maturity is claimed.'),
    boundary('not-route', 'No route maturity is claimed.'),
    boundary('not-gate', 'No gate maturity is claimed.'),
    boundary('not-loop', 'No loop interpretation is claimed.'),
    boundary('not-vortex', 'No vortex interpretation is claimed.'),
    boundary('not-support-region', 'No support-region interpretation is claimed.'),
    boundary('not-topology', 'No topology workspace or operation is authorized.'),
    boundary('not-fieldcue', 'No FieldCue is created or authorized.'),
    boundary('not-semantic-naming', 'No semantic naming is introduced.'),
    boundary('not-generated-site-reading', 'No generated-site reading is created.'),
    boundary('not-runtime', 'No runtime behavior or substrate is authorized.'),
    boundary('not-field-resurrection', 'No field residue is resurrected into support.'),
    boundary('not-P-channel-support', 'P-channel support is excluded.'),
    boundary('not-G-spatial-propagation', 'G-channel spatial propagation support is excluded.'),
    boundary('not-closed-A3-response', 'Closed A3 response is not claimed.'),
    boundary('not-body-response', 'Body response is not claimed.'),
  ];
}

function buildFalsifierRows(args: {
  parentEvidenceRows: readonly T28JLabParentEvidenceRow[];
  targetAxisStabilizerRows: readonly TargetAxisStabilizerRow[];
  singleSiblingOrbitRows: readonly SingleSiblingOrbitRow[];
  orbitAverageRows: readonly OrbitAverageRow[];
  relationClassSymmetricKernelRows: readonly RelationClassSymmetricKernelRow[];
  weightSpaceResidualFormulaRows: readonly WeightSpaceResidualFormulaRow[];
  parentVsSiblingContributionRows: readonly ParentVsSiblingContributionRow[];
  siblingChoiceEquivalenceRows: readonly SiblingChoiceEquivalenceRow[];
  summaryVerdict: T28JLabSummaryVerdict;
}): FalsifierRow[] {
  const formulaClasses = new Set(args.weightSpaceResidualFormulaRows.map((row) => row.sampleKind));
  const contributionClasses = new Set(args.parentVsSiblingContributionRows.map((row) => row.sampleKind));
  const formulaIndependenceFailed = args.weightSpaceResidualFormulaRows.some(
    (row) =>
      row.formulaInputSource !== 'source-weights-and-q-vectors' ||
      row.formulaIndependenceStatus !== 'independent-from-residual-vector',
  );
  const claimedVerified = args.summaryVerdict === 'T28-J-Lab-stabilizer-orbit-theorem-verified';
  const siblingSpreadFailed = args.siblingChoiceEquivalenceRows.some((row) => row.siblingChoiceEquivalenceStatus === 'not-equivalent');
  const invalidSignedOrbitClaim = args.siblingChoiceEquivalenceRows.some(
    (row) =>
      row.siblingChoiceEquivalenceStatus === 'equivalent-up-to-signed-permutation' &&
      (row.residualMagnitudeSpread > row.tolerance ||
        row.axisAlignmentSpread > row.tolerance ||
        row.signedPermutationOrbitStatus !== 'signed-permutation-orbit'),
  );
  const orbitAverageFailed = args.orbitAverageRows.some((row) => row.orbitAverageStatus === 'residual-persists');
  const relationSymmetryFailed = args.relationClassSymmetricKernelRows.some((row) => row.relationClassSymmetricStatus === 'residual-nonzero');
  const k3Parent = args.parentEvidenceRows[0];

  return [
    falsifierRow('F1', 'ATD-H0 survival is retested or rescued.', false, 'Only the K3 parent report is used.'),
    falsifierRow(
      'F2',
      'K3-T residual is promoted to route/gate/corridor/topology/FieldCue/runtime/semantic feature.',
      false,
      'The report emits only stabilizer-orbit residual lab rows and negative boundaries.',
    ),
    falsifierRow('F3', 'P-channel scalar field or route/gate residue is imported as support.', false, 'No P-channel or route/gate/support diagnostics are imported.'),
    falsifierRow('F4', 'G-channel is used as spatial propagation.', false, 'No G-channel spatial propagation support is imported.'),
    falsifierRow(
      'F5',
      'Only deterministic first sibling is tested; legal sibling orbit is not enumerated.',
      args.singleSiblingOrbitRows.length !== 24 || args.targetAxisStabilizerRows.some((row) => row.legalOneEndpointSiblings.length !== 4),
      `singleSiblingRows=${args.singleSiblingOrbitRows.length}.`,
    ),
    falsifierRow('F6', 'Orbit average is not computed.', args.orbitAverageRows.length !== 6, `orbitAverageRows=${args.orbitAverageRows.length}.`),
    falsifierRow(
      'F7',
      'Relation-class symmetric weight model is not tested.',
      args.relationClassSymmetricKernelRows.length < 18,
      `relationClassSymmetricRows=${args.relationClassSymmetricKernelRows.length}.`,
    ),
    falsifierRow(
      'F8',
      'Weight-space residual formula is not independently computed from source weights and q-vectors.',
      !requiredFormulaClassesPresent(formulaClasses) || formulaIndependenceFailed,
      `formulaClasses=${[...formulaClasses].sort().join(',')}; formulaIndependenceFailed=${formulaIndependenceFailed}.`,
    ),
    falsifierRow(
      'F9',
      'Parent and sibling contribution decomposition is omitted.',
      !requiredFormulaClassesPresent(contributionClasses),
      `contributionClasses=${[...contributionClasses].sort().join(',')}.`,
    ),
    falsifierRow(
      'F10',
      'Sibling-choice equivalence is claimed despite residual magnitude spread above tolerance or missing signed-permutation orbit.',
      invalidSignedOrbitClaim,
      `claimedVerified=${claimedVerified}; siblingSpreadFailed=${siblingSpreadFailed}; invalidSignedOrbitClaim=${invalidSignedOrbitClaim}.`,
    ),
    falsifierRow(
      'F11',
      'Orbit average is claimed to collapse residual despite nonzero residual above tolerance.',
      claimedVerified && orbitAverageFailed,
      `claimedVerified=${claimedVerified}; orbitAverageFailed=${orbitAverageFailed}.`,
    ),
    falsifierRow(
      'F12',
      'Relation-class symmetric model gives nonzero residual but is still classified as stabilizer-preserving.',
      claimedVerified && relationSymmetryFailed,
      `claimedVerified=${claimedVerified}; relationSymmetryFailed=${relationSymmetryFailed}.`,
    ),
    falsifierRow(
      'F13',
      'Summary verdict exceeds allowed vocabulary.',
      !ALLOWED_SUMMARY_VERDICTS.includes(args.summaryVerdict),
      `summaryVerdict=${args.summaryVerdict}.`,
    ),
    falsifierRow('F14', 'T28-F/G/I/J are treated as imported parent reports.', false, 'Parent evidence rows contain only K3.'),
    falsifierRow(
      'F15',
      'K3 parent failure is ignored.',
      (k3Parent?.ok !== true || k3Parent.verdict !== 'PASS') &&
        args.summaryVerdict !== 'T28-J-Lab-parent-sibling-decomposition-inconclusive',
      `k3Ok=${k3Parent?.ok}; k3Verdict=${k3Parent?.verdict}; summaryVerdict=${args.summaryVerdict}.`,
    ),
  ];
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly T28JLabParentEvidenceRow[];
  targetAxisStabilizerRows: readonly TargetAxisStabilizerRow[];
  singleSiblingOrbitRows: readonly SingleSiblingOrbitRow[];
  siblingChoiceEquivalenceRows: readonly SiblingChoiceEquivalenceRow[];
  orbitAverageRows: readonly OrbitAverageRow[];
  relationClassSymmetricKernelRows: readonly RelationClassSymmetricKernelRow[];
  weightSpaceResidualFormulaRows: readonly WeightSpaceResidualFormulaRow[];
  parentVsSiblingContributionRows: readonly ParentVsSiblingContributionRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  summaryVerdict: T28JLabSummaryVerdict;
}): string[] {
  const issues: string[] = [];
  const k3Parent = args.parentEvidenceRows.find((row) => row.parentId === 'K3');

  if (!k3Parent) {
    issues.push('Missing K3 parent report.');
  } else {
    if (k3Parent.importStatus !== 'imported') {
      issues.push('K3 parent report was not imported.');
    }
    if (!k3Parent.ok) {
      issues.push('K3 parent report is not ok.');
    }
    if (k3Parent.verdict !== 'PASS') {
      issues.push(`K3 parent verdict is not PASS: ${k3Parent.verdict ?? 'missing'}.`);
    }
  }

  for (const targetChild of TARGET_CHILDREN) {
    if (!args.targetAxisStabilizerRows.some((row) => row.targetChild === targetChild)) {
      issues.push(`Missing target child ${targetChild}.`);
    }
  }

  for (const axisPairId of AXIS_PAIR_IDS) {
    if (!args.targetAxisStabilizerRows.some((row) => row.axisPairId === axisPairId)) {
      issues.push(`Missing axis-pair row ${axisPairId}.`);
    }
  }

  for (const row of args.targetAxisStabilizerRows) {
    if (row.legalOneEndpointSiblings.length !== 4) {
      issues.push(`Legal one-endpoint sibling count for ${row.targetChild} is ${row.legalOneEndpointSiblings.length}, expected 4.`);
    }
    if (row.siblingCancellationOrbits.length !== 2) {
      issues.push(`Sibling cancellation pair count for ${row.targetChild} is ${row.siblingCancellationOrbits.length}, expected 2.`);
    }
  }

  if (args.singleSiblingOrbitRows.length !== 24) {
    issues.push(`Single-sibling orbit row count is ${args.singleSiblingOrbitRows.length}, expected 24.`);
  }

  if (args.siblingChoiceEquivalenceRows.length !== 6) {
    issues.push(`Sibling choice equivalence row count is ${args.siblingChoiceEquivalenceRows.length}, expected 6.`);
  }

  if (args.orbitAverageRows.length !== 6) {
    issues.push(`Orbit average row count is ${args.orbitAverageRows.length}, expected 6.`);
  }

  if (args.relationClassSymmetricKernelRows.length < 18) {
    issues.push(`Relation-class symmetric row count is ${args.relationClassSymmetricKernelRows.length}, expected at least 18.`);
  }

  const formulaClasses = new Set(args.weightSpaceResidualFormulaRows.map((row) => row.sampleKind));
  if (!requiredFormulaClassesPresent(formulaClasses)) {
    issues.push('Weight-space formula rows are missing deterministic/single/orbit/relation-class classes.');
  }

  if (args.weightSpaceResidualFormulaRows.some((row) => row.formulaInputSource !== 'source-weights-and-q-vectors')) {
    issues.push('At least one weight-space formula row was not computed from source weights and q-vectors.');
  }

  if (
    args.weightSpaceResidualFormulaRows.some(
      (row) => row.formulaIndependenceStatus !== 'independent-from-residual-vector',
    )
  ) {
    issues.push('At least one weight-space formula row is tautological from the residual vector or inconclusive.');
  }

  const contributionClasses = new Set(args.parentVsSiblingContributionRows.map((row) => row.sampleKind));
  if (!requiredFormulaClassesPresent(contributionClasses)) {
    issues.push('Parent-vs-sibling contribution rows are missing deterministic/single/orbit/relation-class classes.');
  }

  for (const boundaryId of REQUIRED_BOUNDARY_IDS) {
    if (!args.boundaryRows.some((row) => row.boundaryId === boundaryId && row.enforced)) {
      issues.push(`Missing required boundary ${boundaryId}.`);
    }
  }

  for (const falsifierId of REQUIRED_FALSIFIER_IDS) {
    if (!args.falsifierRows.some((row) => row.falsifierId === falsifierId)) {
      issues.push(`Missing required falsifier ${falsifierId}.`);
    }
  }

  if (!ALLOWED_SUMMARY_VERDICTS.includes(args.summaryVerdict) || FORBIDDEN_VERDICTS.includes(args.summaryVerdict)) {
    issues.push(`Forbidden or unknown verdict emitted: ${args.summaryVerdict}.`);
  }

  return unique(issues);
}

function classifySummaryVerdict(args: {
  boundaryFailed: boolean;
  integrityIssues: readonly string[];
  siblingChoiceEquivalenceRows: readonly SiblingChoiceEquivalenceRow[];
  orbitAverageRows: readonly OrbitAverageRow[];
  relationClassSymmetricKernelRows: readonly RelationClassSymmetricKernelRow[];
  weightSpaceResidualFormulaRows: readonly WeightSpaceResidualFormulaRow[];
  parentVsSiblingContributionRows: readonly ParentVsSiblingContributionRow[];
}): T28JLabSummaryVerdict {
  if (args.boundaryFailed) {
    return 'T28-J-Lab-boundary-failed';
  }

  if (args.integrityIssues.length > 0) {
    return 'T28-J-Lab-parent-sibling-decomposition-inconclusive';
  }

  if (args.siblingChoiceEquivalenceRows.some((row) => row.siblingChoiceEquivalenceStatus === 'not-equivalent')) {
    return 'T28-J-Lab-sibling-choice-equivalence-failed';
  }

  if (args.orbitAverageRows.some((row) => row.orbitAverageStatus === 'residual-persists')) {
    return 'T28-J-Lab-orbit-average-collapse-failed';
  }

  if (args.relationClassSymmetricKernelRows.some((row) => row.relationClassSymmetricStatus === 'residual-nonzero')) {
    return 'T28-J-Lab-relation-class-symmetry-collapse-failed';
  }

  if (args.weightSpaceResidualFormulaRows.some((row) => row.formulaStatus === 'formula-mismatch')) {
    return 'T28-J-Lab-weight-formula-mismatch';
  }

  if (
    args.parentVsSiblingContributionRows
      .filter((row) => row.sampleKind === 'deterministic-K3T')
      .some((row) => row.dominantBreakSource !== 'sibling-localization')
  ) {
    return 'T28-J-Lab-parent-sibling-decomposition-inconclusive';
  }

  return 'T28-J-Lab-stabilizer-orbit-theorem-verified';
}

function evaluateSourceWeights(args: {
  target: TargetRecord;
  sources: readonly SourceRecord[];
  sampleKind: EvaluatedWeightedSample['sampleKind'];
  sampleId: string;
  sourceWeights: Record<SourceId, number>;
}): EvaluatedWeightedSample {
  const vector = computeWeightedVector(args.sourceWeights, args.sources, args.target);

  return {
    targetChild: args.target.targetChild,
    axisPairId: args.target.axisPairId,
    sampleKind: args.sampleKind,
    sampleId: args.sampleId,
    sourceWeights: cleanSourceWeights(args.sourceWeights),
    phi: vector.phi,
    axisProjection: vector.axisProjection,
    transverseResidualVector: vector.transverseResidualVector,
    transverseResidualMagnitude: vector.transverseResidualMagnitude,
    axisAlignment: vector.axisAlignment,
  };
}

function computeWeightedVector(
  sourceWeights: Record<SourceId, number>,
  sources: readonly SourceRecord[],
  target: TargetRecord,
): {
  phi: Vec3;
  axisProjection: number;
  transverseResidualVector: Vec3;
  transverseResidualMagnitude: number;
  axisAlignment: number;
} {
  const phi = sources.reduce<Vec3>(
    (sum, source) => addVec3(sum, scaleVec3(source.qVector, sourceWeights[source.sourceId] ?? 0)),
    [0, 0, 0],
  );
  const magnitude = normVec3(phi);
  const axisProjection = dotVec3(phi, target.targetAxis);
  const transverseResidualVector = transverseResidual(phi, target.targetAxis);
  const transverseResidualMagnitude = normVec3(transverseResidualVector);
  const axisAlignment = magnitude > EPSILON ? Math.abs(axisProjection) / magnitude : 0;

  return {
    phi: cleanVec3(phi),
    axisProjection: cleanNumber(axisProjection),
    transverseResidualVector: cleanVec3(transverseResidualVector),
    transverseResidualMagnitude: cleanNumber(transverseResidualMagnitude),
    axisAlignment: cleanNumber(axisAlignment),
  };
}

function radialWeightsForPosition(samplePosition: Vec3, sources: readonly SourceRecord[]): Record<SourceId, number> {
  return cleanSourceWeights(
    Object.fromEntries(
      sources.map((source) => [source.sourceId, radialWeight(distanceVec3(samplePosition, source.geometryPosition))]),
    ) as Record<SourceId, number>,
  );
}

function relationClassSymmetricWeights(target: TargetRecord, assignment: RelationAssignment): Record<SourceId, number> {
  const weights = zeroSourceWeights();
  const [endpointA, endpointB] = target.endpointParents;
  const [complementA, complementB] = target.complementParents;
  const [[siblingA, siblingB], [siblingC, siblingD]] = target.siblingCancellationPairs;

  weights[endpointA] = assignment.endpointParentWeight;
  weights[endpointB] = assignment.endpointParentWeight;
  weights[complementA] = assignment.complementParentWeight;
  weights[complementB] = assignment.complementParentWeight;
  weights[siblingA] = assignment.siblingPair1Weight;
  weights[siblingB] = assignment.siblingPair1Weight;
  weights[siblingC] = assignment.siblingPair2Weight;
  weights[siblingD] = assignment.siblingPair2Weight;
  weights[target.targetChild] = assignment.targetChildWeight;
  weights[target.antipodalPartner] = assignment.antipodalChildWeight;

  return cleanSourceWeights(weights);
}

function averageSourceWeights(weightRecords: Array<Record<SourceId, number>>, sources: readonly SourceRecord[]): Record<SourceId, number> {
  if (weightRecords.length === 0) {
    return zeroSourceWeights();
  }

  return cleanSourceWeights(
    Object.fromEntries(
      sources.map((source) => [
        source.sourceId,
        weightRecords.reduce((sum, weights) => sum + (weights[source.sourceId] ?? 0), 0) / weightRecords.length,
      ]),
    ) as Record<SourceId, number>,
  );
}

function sourceWeightsFromRecord(weights: Record<string, number>, sources: readonly SourceRecord[]): Record<SourceId, number> {
  return cleanSourceWeights(
    Object.fromEntries(sources.map((source) => [source.sourceId, weights[source.sourceId] ?? 0])) as Record<SourceId, number>,
  );
}

function cleanSourceWeights(weights: Record<SourceId, number>): Record<SourceId, number> {
  return Object.fromEntries(
    [...PRIMAL_ORDER, ...CHILD_ORDER].map((sourceId) => [sourceId, cleanNumber(weights[sourceId] ?? 0)]),
  ) as Record<SourceId, number>;
}

function zeroSourceWeights(): Record<SourceId, number> {
  return Object.fromEntries([...PRIMAL_ORDER, ...CHILD_ORDER].map((sourceId) => [sourceId, 0])) as Record<SourceId, number>;
}

function sourceSubsetPhi(
  sourceWeights: Record<SourceId, number>,
  sources: readonly SourceRecord[],
  sourceIds: readonly SourceId[],
): Vec3 {
  const allowed = new Set(sourceIds);

  return sources.reduce<Vec3>(
    (sum, source) =>
      allowed.has(source.sourceId)
        ? addVec3(sum, scaleVec3(source.qVector, sourceWeights[source.sourceId] ?? 0))
        : sum,
    [0, 0, 0],
  );
}

function formulaCoordinatesFromWeights(
  sourceWeights: Record<SourceId, number>,
  sources: readonly SourceRecord[],
  target: TargetRecord,
): BreakVector2 {
  const frame = targetFrame(target);
  const coord1 = sources.reduce(
    (sum, source) =>
      sum + (sourceWeights[source.sourceId] ?? 0) * dotVec3(source.qVector, frame.firstTransverseAxis),
    0,
  );
  const coord2 = sources.reduce(
    (sum, source) =>
      sum + (sourceWeights[source.sourceId] ?? 0) * dotVec3(source.qVector, frame.secondTransverseAxis),
    0,
  );

  return cleanBreakVector([coord1, coord2]);
}

function transverseCoordinates(vector: Vec3, target: TargetRecord): BreakVector2 {
  const frame = targetFrame(target);
  return [dotVec3(vector, frame.firstTransverseAxis), dotVec3(vector, frame.secondTransverseAxis)];
}

function canonicalAbsPair(pair: BreakVector2): BreakVector2 {
  const values = [Math.abs(pair[0]), Math.abs(pair[1])].sort((a, b) => b - a);
  return cleanBreakVector([values[0], values[1]]);
}

function classifySignedPermutationOrbitStatus(args: {
  complete: boolean;
  scalarEquivalent: boolean;
  residualCoordinatePairs: readonly BreakVector2[];
  absoluteCoordinatePairs: readonly BreakVector2[];
}): SiblingChoiceEquivalenceRow['signedPermutationOrbitStatus'] {
  if (!args.complete || args.residualCoordinatePairs.length !== 4 || args.absoluteCoordinatePairs.length !== 4) {
    return 'inconclusive';
  }

  if (!args.scalarEquivalent) {
    return 'not-signed-permutation-orbit';
  }

  const canonical = args.absoluteCoordinatePairs[0];
  const absolutePairsMatch = args.absoluteCoordinatePairs.every((pair) =>
    breakVectorNearlyEqual(pair, canonical, NUMERIC_TOLERANCE),
  );
  const variants = new Set(args.residualCoordinatePairs.map((pair) => signedPermutationVariantKey(pair, canonical)));
  const variantsKnown = !variants.has('unknown');

  if (absolutePairsMatch && variantsKnown && variants.size >= 2) {
    return 'signed-permutation-orbit';
  }

  return 'magnitude-only';
}

function signedPermutationVariantKey(pair: BreakVector2, canonical: BreakVector2): string {
  const absoluteFirst = Math.abs(pair[0]);
  const absoluteSecond = Math.abs(pair[1]);
  const orientation =
    nearlyEqual(absoluteFirst, canonical[0], NUMERIC_TOLERANCE) &&
    nearlyEqual(absoluteSecond, canonical[1], NUMERIC_TOLERANCE)
      ? 'identity'
      : nearlyEqual(absoluteFirst, canonical[1], NUMERIC_TOLERANCE) &&
          nearlyEqual(absoluteSecond, canonical[0], NUMERIC_TOLERANCE)
        ? 'swap'
        : 'unknown';

  if (orientation === 'unknown') {
    return orientation;
  }

  return `${orientation}:${signClass(pair[0])}:${signClass(pair[1])}`;
}

function signClass(value: number): '+' | '-' | '0' {
  if (value > NUMERIC_TOLERANCE) {
    return '+';
  }

  if (value < -NUMERIC_TOLERANCE) {
    return '-';
  }

  return '0';
}

function breakVectorNearlyEqual(left: BreakVector2, right: BreakVector2, tolerance: number): boolean {
  return nearlyEqual(left[0], right[0], tolerance) && nearlyEqual(left[1], right[1], tolerance);
}

function targetFrame(target: TargetRecord): {
  firstTransverseAxis: Vec3;
  secondTransverseAxis: Vec3;
} {
  const basis: readonly Vec3[] = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  const seed = [...basis].sort(
    (left, right) => Math.abs(dotVec3(left, target.targetAxis)) - Math.abs(dotVec3(right, target.targetAxis)),
  )[0];
  const first = normalizeVec3(subVec3(seed, scaleVec3(target.targetAxis, dotVec3(seed, target.targetAxis)))) ?? [1, 0, 0];
  const second = normalizeVec3(crossVec3(target.targetAxis, first)) ?? [0, 1, 0];

  return {
    firstTransverseAxis: cleanVec3(first),
    secondTransverseAxis: cleanVec3(second),
  };
}

function classifyResidualDirection(
  residualVector: Vec3,
  target: TargetRecord,
  tolerance: number,
): SingleSiblingOrbitRow['residualDirectionClass'] {
  const residualMagnitude = normVec3(residualVector);
  const [first, second] = transverseCoordinates(residualVector, target);
  const firstSignificant = Math.abs(first) > tolerance;
  const secondSignificant = Math.abs(second) > tolerance;

  if (residualMagnitude <= tolerance) {
    return 'zero';
  }

  if (firstSignificant && !secondSignificant) {
    return first > 0 ? '+first-transverse-axis' : '-first-transverse-axis';
  }

  if (secondSignificant && !firstSignificant) {
    return second > 0 ? '+second-transverse-axis' : '-second-transverse-axis';
  }

  return 'mixed';
}

function classifyDominantBreakSource(
  parentBreakMagnitude: number,
  siblingBreakMagnitude: number,
  combinedBreakMagnitude: number,
): ParentVsSiblingContributionRow['dominantBreakSource'] {
  if (combinedBreakMagnitude <= NUMERIC_TOLERANCE) {
    return 'none';
  }

  if (siblingBreakMagnitude > parentBreakMagnitude + NUMERIC_TOLERANCE) {
    return 'sibling-localization';
  }

  if (parentBreakMagnitude > siblingBreakMagnitude + NUMERIC_TOLERANCE) {
    return 'parent-pair-breaking';
  }

  if (parentBreakMagnitude > NUMERIC_TOLERANCE || siblingBreakMagnitude > NUMERIC_TOLERANCE) {
    return 'balanced';
  }

  return 'inconclusive';
}

function symmetryFlags(
  sourceWeights: Record<SourceId, number>,
  target: TargetRecord,
): {
  stabilizerPreserved: boolean;
  siblingCancellationPreserved: boolean;
  parentPairSymmetryPreserved: boolean;
} {
  const [endpointA, endpointB] = target.endpointParents;
  const [complementA, complementB] = target.complementParents;
  const parentPairSymmetryPreserved =
    nearlyEqual(sourceWeights[endpointA], sourceWeights[endpointB], NUMERIC_TOLERANCE) &&
    nearlyEqual(sourceWeights[complementA], sourceWeights[complementB], NUMERIC_TOLERANCE);
  const siblingCancellationPreserved = target.siblingCancellationPairs.every(([left, right]) =>
    nearlyEqual(sourceWeights[left], sourceWeights[right], NUMERIC_TOLERANCE),
  );

  return {
    stabilizerPreserved: parentPairSymmetryPreserved && siblingCancellationPreserved,
    siblingCancellationPreserved,
    parentPairSymmetryPreserved,
  };
}

function classifySymmetryClass(
  flags: ReturnType<typeof symmetryFlags>,
  residualZero: boolean,
): SymmetryClassificationRow['symmetryClass'] {
  if (flags.stabilizerPreserved && residualZero) {
    return 'stabilizer-preserving-zero-residual';
  }

  if (!flags.siblingCancellationPreserved && !residualZero) {
    return 'localized-sibling-breaking-positive-residual';
  }

  if (!flags.parentPairSymmetryPreserved && !residualZero) {
    return 'parent-pair-breaking-positive-residual';
  }

  if (!flags.stabilizerPreserved && residualZero) {
    return 'compensated-breaking-zero-residual';
  }

  return 'inconclusive';
}

function formulaSampleKind(
  sampleKind: EvaluatedWeightedSample['sampleKind'],
): WeightSpaceResidualFormulaRow['sampleKind'] {
  if (
    sampleKind === 'deterministic-K3T' ||
    sampleKind === 'single-sibling-choice' ||
    sampleKind === 'orbit-average' ||
    sampleKind === 'relation-class-symmetric'
  ) {
    return sampleKind;
  }

  throw new Error(`Sample kind ${sampleKind} is not part of the residual formula audit.`);
}

function requiredFormulaClassesPresent(classes: ReadonlySet<string>): boolean {
  return (
    classes.has('deterministic-K3T') &&
    classes.has('single-sibling-choice') &&
    classes.has('orbit-average') &&
    classes.has('relation-class-symmetric')
  );
}

function boundary(boundaryId: string, statement: string): BoundaryRow {
  return { boundaryId, statement, enforced: true };
}

function falsifierRow(falsifierId: string, description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function boundaryFalsifierId(falsifierId: string): boolean {
  return falsifierId === 'F1' || falsifierId === 'F2' || falsifierId === 'F3' || falsifierId === 'F4' || falsifierId === 'F13' || falsifierId === 'F14';
}

function requireTarget(targets: readonly TargetRecord[], targetChild: ChildId): TargetRecord {
  const target = targets.find((candidate) => candidate.targetChild === targetChild);

  if (!target) {
    throw new Error(`Missing target ${targetChild}.`);
  }

  return target;
}

function requireSource(sources: readonly SourceRecord[], sourceId: SourceId): SourceRecord {
  const source = sourceById(sources, sourceId);

  if (!source) {
    throw new Error(`Missing source ${sourceId}.`);
  }

  return source;
}

function requireEvaluatedSample(samples: readonly EvaluatedWeightedSample[], targetChild: ChildId): EvaluatedWeightedSample {
  const sample = samples.find((candidate) => candidate.targetChild === targetChild);

  if (!sample) {
    throw new Error(`Missing evaluated sample for ${targetChild}.`);
  }

  return sample;
}

function sourceById(sources: readonly SourceRecord[], sourceId: SourceId): SourceRecord | undefined {
  return sources.find((source) => source.sourceId === sourceId);
}

function endpointsForChild(childId: ChildId): [PrimalId, PrimalId] {
  return childId.slice(2).split('') as [PrimalId, PrimalId];
}

function complementEndpoints(endpoints: readonly PrimalId[]): [PrimalId, PrimalId] {
  return PRIMAL_ORDER.filter((sourceId) => !endpoints.includes(sourceId)) as [PrimalId, PrimalId];
}

function childIdForEndpoints(left: PrimalId, right: PrimalId): ChildId {
  const edge = [left, right].sort((a, b) => PRIMAL_ORDER.indexOf(a) - PRIMAL_ORDER.indexOf(b)).join('');
  return `M_${edge}` as ChildId;
}

function axisPairForChild(childId: ChildId): AxisPairId {
  if (childId === 'M_AB' || childId === 'M_CD') {
    return 'AB-CD';
  }

  if (childId === 'M_AC' || childId === 'M_BD') {
    return 'AC-BD';
  }

  return 'AD-BC';
}

function sharesExactlyOneEndpoint(left: readonly PrimalId[], right: readonly PrimalId[]): boolean {
  return left.filter((endpoint) => right.includes(endpoint)).length === 1;
}

function isSourceId(value: string): value is SourceId {
  return isPrimalId(value) || isChildId(value);
}

function isPrimalId(value: string): value is PrimalId {
  return PRIMAL_ORDER.includes(value as PrimalId);
}

function isChildId(value: string): value is ChildId {
  return CHILD_ORDER.includes(value as ChildId);
}

function sourceOrder(sourceId: SourceId): number {
  return isPrimalId(sourceId) ? PRIMAL_ORDER.indexOf(sourceId) : PRIMAL_ORDER.length + CHILD_ORDER.indexOf(sourceId);
}

function minOrZero(values: readonly number[]): number {
  return values.length > 0 ? cleanNumber(Math.min(...values)) : 0;
}

function maxOrZero(values: readonly number[]): number {
  return values.length > 0 ? cleanNumber(Math.max(...values)) : 0;
}

function toVec3(value: readonly number[]): Vec3 {
  return cleanVec3([value[0] ?? 0, value[1] ?? 0, value[2] ?? 0]);
}

function addVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

function subVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
}

function scaleVec3(value: Vec3, scale: number): Vec3 {
  return [value[0] * scale, value[1] * scale, value[2] * scale];
}

function dotVec3(left: Vec3, right: Vec3): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function normVec3(value: Vec3): number {
  return Math.sqrt(dotVec3(value, value));
}

function normalizeVec3(value: Vec3): Vec3 | null {
  const norm = normVec3(value);

  return norm > EPSILON ? scaleVec3(value, 1 / norm) : null;
}

function distanceVec3(left: Vec3, right: Vec3): number {
  return normVec3(subVec3(left, right));
}

function midpointVec3(left: Vec3, right: Vec3): Vec3 {
  return scaleVec3(addVec3(left, right), 0.5);
}

function projectOntoAxis(value: Vec3, axis: Vec3): Vec3 {
  return scaleVec3(axis, dotVec3(value, axis));
}

function transverseResidual(value: Vec3, axis: Vec3): Vec3 {
  return subVec3(value, projectOntoAxis(value, axis));
}

function radialWeight(distance: number): number {
  return 1 / (1 + distance);
}

function crossVec3(left: Vec3, right: Vec3): Vec3 {
  return [
    left[1] * right[2] - left[2] * right[1],
    left[2] * right[0] - left[0] * right[2],
    left[0] * right[1] - left[1] * right[0],
  ];
}

function cleanNumber(value: number): number {
  if (Math.abs(value) <= EPSILON) {
    return 0;
  }

  return Number(value.toFixed(12));
}

function cleanVec3(value: Vec3): Vec3 {
  return [cleanNumber(value[0]), cleanNumber(value[1]), cleanNumber(value[2])];
}

function cleanBreakVector(value: BreakVector2): BreakVector2 {
  return [cleanNumber(value[0]), cleanNumber(value[1])];
}

function norm2(value: BreakVector2): number {
  return Math.sqrt(value[0] * value[0] + value[1] * value[1]);
}

function nearlyEqual(left: number, right: number, tolerance = EPSILON): boolean {
  return Math.abs(left - right) <= tolerance;
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}
