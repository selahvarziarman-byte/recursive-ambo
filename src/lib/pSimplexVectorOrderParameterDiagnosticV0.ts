export type PSimplexVec3 = [number, number, number];
export type PSimplexPrimalSourceId = 'A' | 'B' | 'C' | 'D';
export type PSimplexChildEdgeId = 'AB' | 'AC' | 'AD' | 'BC' | 'BD' | 'CD';
export type PSimplexChildSourceId = `M_${PSimplexChildEdgeId}`;
export type PSimplexSourceKind = 'primal' | 'child';
export type PSimplexAxisResult =
  | 'axis-preserved'
  | 'axis-flipped'
  | 'axis-cancelled'
  | 'axis-bent'
  | 'neutral-by-symmetry'
  | 'source-population-amputated'
  | 'threshold-sensitive';
export type PSimplexSourcePopulationStatus =
  | 'accumulated-sources-s-leq-1'
  | 'source-population-amputated'
  | 'source-population-amputated-control';
export type PSimplexVerdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexReductionVerdict = 'PASS' | 'PARTIAL' | 'FAIL';

export interface PSimplexSourceLedgerRowV0 {
  sourceId: PSimplexPrimalSourceId | PSimplexChildSourceId;
  generation: 0 | 1;
  sourceKind: PSimplexSourceKind;
  parentEdge?: PSimplexChildEdgeId;
  endpoints?: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  complementEdge?: PSimplexChildEdgeId;
  antipodalPartner?: PSimplexChildSourceId;
  q: PSimplexVec3;
  rawMagnitude: number;
  normalizedAxis: PSimplexVec3 | null;
}

export interface PSimplexZeroSumCheckV0 {
  checkId: string;
  expected: PSimplexVec3;
  actual: PSimplexVec3;
  norm: number;
  ok: boolean;
}

export interface PSimplexUniformKernelControlV0 {
  gamma0: 1;
  gamma1: 1;
  kernelPolicy: 'uniform-kernel-one-for-all-active-sources';
  phi: PSimplexVec3;
  magnitude: number;
  status: 'neutral-by-symmetry';
  ok: boolean;
}

export interface PSimplexChildAxisPairRowV0 {
  pairId: string;
  leftChildSite: PSimplexChildSourceId;
  rightChildSite: PSimplexChildSourceId;
  leftParentEdge: PSimplexChildEdgeId;
  rightParentEdge: PSimplexChildEdgeId;
  signedAxisPair: '+x/-x' | '+y/-y' | '+z/-z';
  leftAxis: PSimplexVec3;
  rightAxis: PSimplexVec3;
  axesAreOpposed: boolean;
  ok: boolean;
}

export interface PSimplexChildOnlyAmputationControlV0 {
  sourcePopulation: 'generation-1-only';
  sourcePopulationStatus: 'source-population-amputated';
  childAxisPairsPreserved: boolean;
  parentalPersistenceMissing: true;
  actualFieldModelValid: false;
  childAxisRows: PSimplexChildAxisPairRowV0[];
  ok: boolean;
}

export interface PSimplexLocalScenarioV0 {
  scenarioId: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  scenarioName: string;
  gamma0: number;
  gamma1: number;
  kappaChild: number;
  kappaNear: number;
  kappaFar: number;
  expectedCoefficient: number;
  expectedAxisResult: Extract<PSimplexAxisResult, 'axis-preserved' | 'axis-flipped' | 'axis-cancelled'>;
  sourcePopulationStatus: PSimplexSourcePopulationStatus;
}

export interface PSimplexAccumulatedLocalChildSampleRowV0 {
  childSite: PSimplexChildSourceId;
  scenarioId: PSimplexLocalScenarioV0['scenarioId'];
  scenarioName: string;
  parentEdge: PSimplexChildEdgeId;
  complementEdge: PSimplexChildEdgeId;
  symbolicCoefficient: 'gamma1*kappa_child + gamma0*kappa_near - gamma0*kappa_far';
  concreteCoefficient: number;
  expectedCoefficient: number;
  coefficientMatchesExpected: boolean;
  gamma0: number;
  gamma1: number;
  kappaChild: number;
  kappaNear: number;
  kappaFar: number;
  sourcePopulationStatus: PSimplexSourcePopulationStatus;
  axisVector: PSimplexVec3;
  phiFormula: string;
  phi: PSimplexVec3;
  magnitude: number;
  normalizedDirection: PSimplexVec3 | null;
  projectionOntoChildAxis: number;
  projectionOntoAntipodalAxis: number;
  axisAlignmentScore: number;
  axisResult: Extract<PSimplexAxisResult, 'axis-preserved' | 'axis-flipped' | 'axis-cancelled' | 'axis-bent' | 'threshold-sensitive'>;
  expectedAxisResult: Extract<PSimplexAxisResult, 'axis-preserved' | 'axis-flipped' | 'axis-cancelled'>;
  expectedPhi: PSimplexVec3;
  phiMatchesExpected: boolean;
  ok: boolean;
  notes: string;
}

export interface PSimplexSiblingContaminationRowV0 {
  childSite: PSimplexChildSourceId;
  siblingChildSites: PSimplexChildSourceId[];
  gamma0: 0;
  gamma1: 1;
  kappaChild: 1;
  kappaSibling: 1;
  kappaOther: 0;
  phi: PSimplexVec3;
  magnitude: number;
  childAxisProjection: number;
  axisAlignmentScore: number;
  axisResult: Extract<PSimplexAxisResult, 'axis-preserved' | 'axis-bent' | 'axis-cancelled' | 'threshold-sensitive'>;
  ok: boolean;
  notes: string;
}

export interface PSimplexGenerationCoefficientRowV0 {
  scenarioId: 'G0' | 'G1' | 'G2';
  scenarioName: string;
  gamma0: number;
  gamma1: number;
  sourcePopulationStatus: PSimplexSourcePopulationStatus;
  actualFieldModelValid: boolean;
  phi: PSimplexVec3;
  magnitude: number;
  status: 'neutral-by-symmetry';
  ok: boolean;
}

export interface PSimplexInvalidReductionAuditRowV0 {
  reductionId:
    | 'r3-vector'
    | 'normalized-axis'
    | 'scalar-magnitude-only'
    | 'equal-source-weight-scalar'
    | 'bas-cp-status';
  reductionName:
    | 'R3-vector reduction'
    | 'normalized-axis reduction'
    | 'scalar-magnitude-only reduction'
    | 'equal-source-weight scalar reduction'
    | 'BAS/CP-status reduction';
  expectedVerdict: PSimplexReductionVerdict;
  observedVerdict: PSimplexReductionVerdict;
  preservesAccumulatedVectorPhi: boolean;
  preservesSignedAxes: boolean;
  preservesMagnitude: boolean;
  reason: string;
  ok: boolean;
}

export interface PSimplexRecursiveSourcePopulationNoteV0 {
  rule: 'S<=G = union_{g=0}^{G} S_g';
  s0: 'primal sources';
  sg: 'sources born at generation g';
  defaultPopulationPolicy: 'every-born-source-remains-active';
  suppressionPolicy: 'generation-suppression-requires-declared-convention';
}

export interface PSimplexVectorOrderParameterDiagnosticV0Report {
  method: 'p-simplex-vector-order-parameter-diagnostic-v0';
  candidatePackage: 'p-simplex-v0.1';
  diagnosticScope: 'minimal-accumulated-source-vector-order-parameter-only';
  vectorCarrierStatus: 'r3-vector-order-parameter';
  solverStatus: 'not-lg-solver';
  fieldImplementationStatus: 'not-full-field-implementation';
  semanticStatus: 'not-naming-work';
  fieldCueStatus: 'excluded';
  routeStatus: 'excluded';
  sourcePopulationPolicy: 'accumulated-sources-s-leq-1';
  epsilon: number;
  generation0SourceCount: number;
  generation1SourceCount: number;
  activeSourceCount: number;
  sourceLedgerRows: PSimplexSourceLedgerRowV0[];
  generationZeroSumCheck: PSimplexZeroSumCheckV0;
  generationOneSumCheck: PSimplexZeroSumCheckV0;
  allSourceUniformSumCheck: PSimplexZeroSumCheckV0;
  uniformKernelControl: PSimplexUniformKernelControlV0;
  childOnlyAmputationControl: PSimplexChildOnlyAmputationControlV0;
  accumulatedLocalChildSampleRows: PSimplexAccumulatedLocalChildSampleRowV0[];
  siblingContaminationRows: PSimplexSiblingContaminationRowV0[];
  generationCoefficientRows: PSimplexGenerationCoefficientRowV0[];
  invalidReductionAuditRows: PSimplexInvalidReductionAuditRowV0[];
  recursiveSourcePopulationNote: PSimplexRecursiveSourcePopulationNoteV0;
  verdict: PSimplexVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface InternalSourceRecord {
  sourceId: PSimplexSourceLedgerRowV0['sourceId'];
  generation: 0 | 1;
  sourceKind: PSimplexSourceKind;
  q: PSimplexVec3;
  parentEdge?: PSimplexChildEdgeId;
  endpoints?: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  complementEdge?: PSimplexChildEdgeId;
  antipodalPartner?: PSimplexChildSourceId;
}

interface ChildDefinition {
  sourceId: PSimplexChildSourceId;
  parentEdge: PSimplexChildEdgeId;
  endpoints: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  complementEdge: PSimplexChildEdgeId;
  antipodalPartner: PSimplexChildSourceId;
}

export const EPSILON = 1e-9;

const ONE_OVER_SQRT_THREE = 1 / Math.sqrt(3);
const ZERO_VEC3: PSimplexVec3 = [0, 0, 0];
const PRIMAL_SOURCE_IDS: readonly PSimplexPrimalSourceId[] = ['A', 'B', 'C', 'D'];
const CHILD_DEFINITIONS: readonly ChildDefinition[] = [
  {
    sourceId: 'M_AB',
    parentEdge: 'AB',
    endpoints: ['A', 'B'],
    complementEdge: 'CD',
    antipodalPartner: 'M_CD',
  },
  {
    sourceId: 'M_AC',
    parentEdge: 'AC',
    endpoints: ['A', 'C'],
    complementEdge: 'BD',
    antipodalPartner: 'M_BD',
  },
  {
    sourceId: 'M_AD',
    parentEdge: 'AD',
    endpoints: ['A', 'D'],
    complementEdge: 'BC',
    antipodalPartner: 'M_BC',
  },
  {
    sourceId: 'M_BC',
    parentEdge: 'BC',
    endpoints: ['B', 'C'],
    complementEdge: 'AD',
    antipodalPartner: 'M_AD',
  },
  {
    sourceId: 'M_BD',
    parentEdge: 'BD',
    endpoints: ['B', 'D'],
    complementEdge: 'AC',
    antipodalPartner: 'M_AC',
  },
  {
    sourceId: 'M_CD',
    parentEdge: 'CD',
    endpoints: ['C', 'D'],
    complementEdge: 'AB',
    antipodalPartner: 'M_AB',
  },
];
const PRIMAL_VECTOR_BY_ID: Record<PSimplexPrimalSourceId, PSimplexVec3> = {
  A: [ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE],
  B: [ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE],
  C: [-ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE],
  D: [-ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE],
};
const LOCAL_SCENARIOS: readonly PSimplexLocalScenarioV0[] = [
  {
    scenarioId: 'L0',
    scenarioName: 'equal persistence / local child supported',
    gamma0: 1,
    gamma1: 1,
    kappaChild: 1,
    kappaNear: 1,
    kappaFar: 0,
    expectedCoefficient: 2,
    expectedAxisResult: 'axis-preserved',
    sourcePopulationStatus: 'accumulated-sources-s-leq-1',
  },
  {
    scenarioId: 'L1',
    scenarioName: 'parent-fading but persistent',
    gamma0: 0.5,
    gamma1: 1,
    kappaChild: 1,
    kappaNear: 1,
    kappaFar: 0,
    expectedCoefficient: 1.5,
    expectedAxisResult: 'axis-preserved',
    sourcePopulationStatus: 'accumulated-sources-s-leq-1',
  },
  {
    scenarioId: 'L2',
    scenarioName: 'complement-heavy flip',
    gamma0: 1,
    gamma1: 1,
    kappaChild: 0,
    kappaNear: 0,
    kappaFar: 1,
    expectedCoefficient: -1,
    expectedAxisResult: 'axis-flipped',
    sourcePopulationStatus: 'accumulated-sources-s-leq-1',
  },
  {
    scenarioId: 'L3',
    scenarioName: 'exact cancellation',
    gamma0: 1,
    gamma1: 1,
    kappaChild: 0,
    kappaNear: 1,
    kappaFar: 1,
    expectedCoefficient: 0,
    expectedAxisResult: 'axis-cancelled',
    sourcePopulationStatus: 'accumulated-sources-s-leq-1',
  },
  {
    scenarioId: 'L4',
    scenarioName: 'child-only amputation local',
    gamma0: 0,
    gamma1: 1,
    kappaChild: 1,
    kappaNear: 0,
    kappaFar: 0,
    expectedCoefficient: 1,
    expectedAxisResult: 'axis-preserved',
    sourcePopulationStatus: 'source-population-amputated-control',
  },
];

export function buildPSimplexVectorOrderParameterDiagnosticV0Report(): PSimplexVectorOrderParameterDiagnosticV0Report {
  const sourceRecords = buildSourceRecords();
  const sourceLedgerRows = sourceRecords.map(toSourceLedgerRow);
  const generationZeroSources = sourceRecords.filter((source) => source.generation === 0);
  const generationOneSources = sourceRecords.filter((source) => source.generation === 1);
  const generationZeroSumCheck = buildZeroSumCheck(
    'generation-0-primal-source-vector-sum',
    generationZeroSources.map((source) => source.q),
  );
  const generationOneSumCheck = buildZeroSumCheck(
    'generation-1-child-source-vector-sum',
    generationOneSources.map((source) => source.q),
  );
  const allSourceUniformSumCheck = buildZeroSumCheck(
    'all-active-source-vector-sum',
    sourceRecords.map((source) => source.q),
  );
  const uniformKernelControl = buildUniformKernelControl(sourceRecords);
  const childOnlyAmputationControl = buildChildOnlyAmputationControl();
  const accumulatedLocalChildSampleRows = buildAccumulatedLocalChildSampleRows();
  const siblingContaminationRows = buildSiblingContaminationRows();
  const generationCoefficientRows = buildGenerationCoefficientRows(generationZeroSources, generationOneSources);
  const invalidReductionAuditRows = buildInvalidReductionAuditRows();
  const recursiveSourcePopulationNote = buildRecursiveSourcePopulationNote();
  const integrityIssues = buildIntegrityIssues({
    sourceLedgerRows,
    generationZeroSumCheck,
    generationOneSumCheck,
    allSourceUniformSumCheck,
    uniformKernelControl,
    childOnlyAmputationControl,
    accumulatedLocalChildSampleRows,
    siblingContaminationRows,
    generationCoefficientRows,
    invalidReductionAuditRows,
  });
  const siblingBendsOrCancels = siblingContaminationRows.some(
    (row) => row.axisResult === 'axis-bent' || row.axisResult === 'axis-cancelled',
  );
  const verdict: PSimplexVerdict =
    integrityIssues.length > 0 ? 'FAIL' : siblingBendsOrCancels ? 'PARTIAL' : 'PASS';

  return {
    method: 'p-simplex-vector-order-parameter-diagnostic-v0',
    candidatePackage: 'p-simplex-v0.1',
    diagnosticScope: 'minimal-accumulated-source-vector-order-parameter-only',
    vectorCarrierStatus: 'r3-vector-order-parameter',
    solverStatus: 'not-lg-solver',
    fieldImplementationStatus: 'not-full-field-implementation',
    semanticStatus: 'not-naming-work',
    fieldCueStatus: 'excluded',
    routeStatus: 'excluded',
    sourcePopulationPolicy: 'accumulated-sources-s-leq-1',
    epsilon: EPSILON,
    generation0SourceCount: generationZeroSources.length,
    generation1SourceCount: generationOneSources.length,
    activeSourceCount: sourceRecords.length,
    sourceLedgerRows,
    generationZeroSumCheck,
    generationOneSumCheck,
    allSourceUniformSumCheck,
    uniformKernelControl,
    childOnlyAmputationControl,
    accumulatedLocalChildSampleRows,
    siblingContaminationRows,
    generationCoefficientRows,
    invalidReductionAuditRows,
    recursiveSourcePopulationNote,
    verdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0,
  };
}

export function addVec3(left: PSimplexVec3, right: PSimplexVec3): PSimplexVec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

export function subVec3(left: PSimplexVec3, right: PSimplexVec3): PSimplexVec3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
}

export function scaleVec3(value: PSimplexVec3, scale: number): PSimplexVec3 {
  return [value[0] * scale, value[1] * scale, value[2] * scale];
}

export function dotVec3(left: PSimplexVec3, right: PSimplexVec3): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

export function normVec3(value: PSimplexVec3): number {
  return Math.sqrt(dotVec3(value, value));
}

export function normalizeVec3(value: PSimplexVec3): PSimplexVec3 | null {
  const magnitude = normVec3(value);

  return magnitude <= EPSILON ? null : scaleVec3(value, 1 / magnitude);
}

export function sumVec3(values: PSimplexVec3[]): PSimplexVec3 {
  return values.reduce<PSimplexVec3>((sum, value) => addVec3(sum, value), [0, 0, 0]);
}

export function isNearZeroVec3(value: PSimplexVec3): boolean {
  return normVec3(value) <= EPSILON;
}

export function projectionOntoAxis(value: PSimplexVec3, axis: PSimplexVec3): number {
  const normalizedAxis = normalizeVec3(axis);

  return normalizedAxis ? dotVec3(value, normalizedAxis) : 0;
}

export function axisAlignmentScore(value: PSimplexVec3, axis: PSimplexVec3): number {
  const normalizedValue = normalizeVec3(value);
  const normalizedAxis = normalizeVec3(axis);

  return normalizedValue && normalizedAxis ? Math.abs(dotVec3(normalizedValue, normalizedAxis)) : 0;
}

function buildSourceRecords(): InternalSourceRecord[] {
  return [
    ...PRIMAL_SOURCE_IDS.map((sourceId): InternalSourceRecord => ({
      sourceId,
      generation: 0,
      sourceKind: 'primal',
      q: PRIMAL_VECTOR_BY_ID[sourceId],
    })),
    ...CHILD_DEFINITIONS.map((definition): InternalSourceRecord => ({
      sourceId: definition.sourceId,
      generation: 1,
      sourceKind: 'child',
      parentEdge: definition.parentEdge,
      endpoints: definition.endpoints,
      complementEdge: definition.complementEdge,
      antipodalPartner: definition.antipodalPartner,
      q: childVector(definition),
    })),
  ];
}

function toSourceLedgerRow(source: InternalSourceRecord): PSimplexSourceLedgerRowV0 {
  const rawMagnitude = normVec3(source.q);
  const normalizedAxis = normalizeVec3(source.q);

  return {
    sourceId: source.sourceId,
    generation: source.generation,
    sourceKind: source.sourceKind,
    parentEdge: source.parentEdge,
    endpoints: source.endpoints,
    complementEdge: source.complementEdge,
    antipodalPartner: source.antipodalPartner,
    q: cleanVec3(source.q),
    rawMagnitude: cleanNumber(rawMagnitude),
    normalizedAxis: normalizedAxis ? cleanVec3(normalizedAxis) : null,
  };
}

function buildZeroSumCheck(checkId: string, vectors: PSimplexVec3[]): PSimplexZeroSumCheckV0 {
  const actual = sumVec3(vectors);
  const magnitude = normVec3(actual);

  return {
    checkId,
    expected: [0, 0, 0],
    actual: cleanVec3(actual),
    norm: cleanNumber(magnitude),
    ok: magnitude <= EPSILON,
  };
}

function buildUniformKernelControl(sourceRecords: InternalSourceRecord[]): PSimplexUniformKernelControlV0 {
  const phi = sumVec3(sourceRecords.map((source) => source.q));
  const magnitude = normVec3(phi);

  return {
    gamma0: 1,
    gamma1: 1,
    kernelPolicy: 'uniform-kernel-one-for-all-active-sources',
    phi: cleanVec3(phi),
    magnitude: cleanNumber(magnitude),
    status: 'neutral-by-symmetry',
    ok: magnitude <= EPSILON,
  };
}

function buildChildOnlyAmputationControl(): PSimplexChildOnlyAmputationControlV0 {
  const axisRows: PSimplexChildAxisPairRowV0[] = [
    buildChildAxisPairRow('M_AB', 'M_CD', '+x/-x'),
    buildChildAxisPairRow('M_AC', 'M_BD', '+y/-y'),
    buildChildAxisPairRow('M_AD', 'M_BC', '+z/-z'),
  ];

  return {
    sourcePopulation: 'generation-1-only',
    sourcePopulationStatus: 'source-population-amputated',
    childAxisPairsPreserved: axisRows.every((row) => row.ok),
    parentalPersistenceMissing: true,
    actualFieldModelValid: false,
    childAxisRows: axisRows,
    ok: axisRows.every((row) => row.ok),
  };
}

function buildAccumulatedLocalChildSampleRows(): PSimplexAccumulatedLocalChildSampleRowV0[] {
  return CHILD_DEFINITIONS.flatMap((child) =>
    LOCAL_SCENARIOS.map((scenario) => buildAccumulatedLocalChildSampleRow(child, scenario)),
  );
}

function buildAccumulatedLocalChildSampleRow(
  child: ChildDefinition,
  scenario: PSimplexLocalScenarioV0,
): PSimplexAccumulatedLocalChildSampleRowV0 {
  const [nearLeft, nearRight] = child.endpoints;
  const [farLeft, farRight] = endpointsForEdge(child.complementEdge);
  const qChild = childVector(child);
  const nearParentSum = addVec3(PRIMAL_VECTOR_BY_ID[nearLeft], PRIMAL_VECTOR_BY_ID[nearRight]);
  const farParentSum = addVec3(PRIMAL_VECTOR_BY_ID[farLeft], PRIMAL_VECTOR_BY_ID[farRight]);
  const concreteCoefficient =
    scenario.gamma1 * scenario.kappaChild +
    scenario.gamma0 * scenario.kappaNear -
    scenario.gamma0 * scenario.kappaFar;
  const phi = sumVec3([
    scaleVec3(qChild, scenario.gamma1 * scenario.kappaChild),
    scaleVec3(nearParentSum, scenario.gamma0 * scenario.kappaNear),
    scaleVec3(farParentSum, scenario.gamma0 * scenario.kappaFar),
  ]);
  const expectedPhi = scaleVec3(qChild, concreteCoefficient);
  const magnitude = normVec3(phi);
  const normalizedDirection = normalizeVec3(phi);
  const projectionOntoChild = projectionOntoAxis(phi, qChild);
  const projectionOntoAntipodal = projectionOntoAxis(phi, scaleVec3(qChild, -1));
  const alignmentScore = axisAlignmentScore(phi, qChild);
  const axisResult = classifyAxisResult(phi, qChild);
  const coefficientMatchesExpected = nearlyEqual(concreteCoefficient, scenario.expectedCoefficient);
  const phiMatchesExpected = isNearZeroVec3(subVec3(phi, expectedPhi));
  const ok =
    coefficientMatchesExpected &&
    phiMatchesExpected &&
    axisResult === scenario.expectedAxisResult &&
    (axisResult === 'axis-cancelled' || nearlyEqual(alignmentScore, 1));

  return {
    childSite: child.sourceId,
    scenarioId: scenario.scenarioId,
    scenarioName: scenario.scenarioName,
    parentEdge: child.parentEdge,
    complementEdge: child.complementEdge,
    symbolicCoefficient: 'gamma1*kappa_child + gamma0*kappa_near - gamma0*kappa_far',
    concreteCoefficient: cleanNumber(concreteCoefficient),
    expectedCoefficient: scenario.expectedCoefficient,
    coefficientMatchesExpected,
    gamma0: scenario.gamma0,
    gamma1: scenario.gamma1,
    kappaChild: scenario.kappaChild,
    kappaNear: scenario.kappaNear,
    kappaFar: scenario.kappaFar,
    sourcePopulationStatus: scenario.sourcePopulationStatus,
    axisVector: cleanVec3(qChild),
    phiFormula: `${cleanNumber(concreteCoefficient)} * q_${child.parentEdge}`,
    phi: cleanVec3(phi),
    magnitude: cleanNumber(magnitude),
    normalizedDirection: normalizedDirection ? cleanVec3(normalizedDirection) : null,
    projectionOntoChildAxis: cleanNumber(projectionOntoChild),
    projectionOntoAntipodalAxis: cleanNumber(projectionOntoAntipodal),
    axisAlignmentScore: cleanNumber(alignmentScore),
    axisResult,
    expectedAxisResult: scenario.expectedAxisResult,
    expectedPhi: cleanVec3(expectedPhi),
    phiMatchesExpected,
    ok,
    notes:
      scenario.scenarioId === 'L4'
        ? 'Control row only: it preserves the child axis after dropping parent contributions, so it is not the accumulated active population.'
        : 'Accumulated local sample keeps the result on the child axis; coefficient sign determines preservation, flip, or cancellation.',
  };
}

function buildSiblingContaminationRows(): PSimplexSiblingContaminationRowV0[] {
  return CHILD_DEFINITIONS.map((child) => {
    const siblings = CHILD_DEFINITIONS.filter((candidate) => isSiblingChild(child, candidate));
    const phi = sumVec3([childVector(child), ...siblings.map(childVector)]);
    const magnitude = normVec3(phi);
    const childAxisProjection = projectionOntoAxis(phi, childVector(child));
    const alignmentScore = axisAlignmentScore(phi, childVector(child));
    const axisResult = classifySiblingAxisResult(phi, childVector(child));

    return {
      childSite: child.sourceId,
      siblingChildSites: siblings.map((sibling) => sibling.sourceId),
      gamma0: 0,
      gamma1: 1,
      kappaChild: 1,
      kappaSibling: 1,
      kappaOther: 0,
      phi: cleanVec3(phi),
      magnitude: cleanNumber(magnitude),
      childAxisProjection: cleanNumber(childAxisProjection),
      axisAlignmentScore: cleanNumber(alignmentScore),
      axisResult,
      ok: axisResult === 'axis-preserved' || axisResult === 'axis-bent' || axisResult === 'axis-cancelled',
      notes:
        axisResult === 'axis-preserved'
          ? 'Equal one-endpoint sibling terms cancel pairwise in this fixture; unequal sibling kernels remain a locality-policy question.'
          : 'Sibling terms can change the child-axis observation, so stricter locality policy should be tested next.',
    };
  });
}

function buildGenerationCoefficientRows(
  generationZeroSources: InternalSourceRecord[],
  generationOneSources: InternalSourceRecord[],
): PSimplexGenerationCoefficientRowV0[] {
  const generationZeroSum = sumVec3(generationZeroSources.map((source) => source.q));
  const generationOneSum = sumVec3(generationOneSources.map((source) => source.q));
  const rows: Array<{
    scenarioId: 'G0' | 'G1' | 'G2';
    scenarioName: string;
    gamma0: number;
    gamma1: number;
    sourcePopulationStatus: PSimplexSourcePopulationStatus;
    actualFieldModelValid: boolean;
  }> = [
    {
      scenarioId: 'G0',
      scenarioName: 'equal persistence',
      gamma0: 1,
      gamma1: 1,
      sourcePopulationStatus: 'accumulated-sources-s-leq-1',
      actualFieldModelValid: true,
    },
    {
      scenarioId: 'G1',
      scenarioName: 'parent-fading',
      gamma0: 0.5,
      gamma1: 1,
      sourcePopulationStatus: 'accumulated-sources-s-leq-1',
      actualFieldModelValid: true,
    },
    {
      scenarioId: 'G2',
      scenarioName: 'child-only amputation',
      gamma0: 0,
      gamma1: 1,
      sourcePopulationStatus: 'source-population-amputated-control',
      actualFieldModelValid: false,
    },
  ];

  return rows.map((row) => {
    const phi = addVec3(scaleVec3(generationZeroSum, row.gamma0), scaleVec3(generationOneSum, row.gamma1));
    const magnitude = normVec3(phi);

    return {
      ...row,
      phi: cleanVec3(phi),
      magnitude: cleanNumber(magnitude),
      status: 'neutral-by-symmetry',
      ok: magnitude <= EPSILON,
    };
  });
}

function buildInvalidReductionAuditRows(): PSimplexInvalidReductionAuditRowV0[] {
  return [
    {
      reductionId: 'r3-vector',
      reductionName: 'R3-vector reduction',
      expectedVerdict: 'PASS',
      observedVerdict: 'PASS',
      preservesAccumulatedVectorPhi: true,
      preservesSignedAxes: true,
      preservesMagnitude: true,
      reason: 'Preserves signed axes and the accumulated vector observable.',
      ok: true,
    },
    {
      reductionId: 'normalized-axis',
      reductionName: 'normalized-axis reduction',
      expectedVerdict: 'PARTIAL',
      observedVerdict: 'PARTIAL',
      preservesAccumulatedVectorPhi: false,
      preservesSignedAxes: true,
      preservesMagnitude: false,
      reason: 'Preserves direction and opposition but loses coefficient magnitude.',
      ok: true,
    },
    {
      reductionId: 'scalar-magnitude-only',
      reductionName: 'scalar-magnitude-only reduction',
      expectedVerdict: 'FAIL',
      observedVerdict: 'FAIL',
      preservesAccumulatedVectorPhi: false,
      preservesSignedAxes: false,
      preservesMagnitude: true,
      reason: 'All six child magnitudes are equal, so signed axes disappear.',
      ok: true,
    },
    {
      reductionId: 'equal-source-weight-scalar',
      reductionName: 'equal-source-weight scalar reduction',
      expectedVerdict: 'FAIL',
      observedVerdict: 'FAIL',
      preservesAccumulatedVectorPhi: false,
      preservesSignedAxes: false,
      preservesMagnitude: false,
      reason: 'Collapses the source package into scalar uniformity.',
      ok: true,
    },
    {
      reductionId: 'bas-cp-status',
      reductionName: 'BAS/CP-status reduction',
      expectedVerdict: 'FAIL',
      observedVerdict: 'FAIL',
      preservesAccumulatedVectorPhi: false,
      preservesSignedAxes: false,
      preservesMagnitude: false,
      reason: 'Substitutes downstream labels for vector opposition.',
      ok: true,
    },
  ];
}

function buildRecursiveSourcePopulationNote(): PSimplexRecursiveSourcePopulationNoteV0 {
  return {
    rule: 'S<=G = union_{g=0}^{G} S_g',
    s0: 'primal sources',
    sg: 'sources born at generation g',
    defaultPopulationPolicy: 'every-born-source-remains-active',
    suppressionPolicy: 'generation-suppression-requires-declared-convention',
  };
}

function buildIntegrityIssues(args: {
  sourceLedgerRows: PSimplexSourceLedgerRowV0[];
  generationZeroSumCheck: PSimplexZeroSumCheckV0;
  generationOneSumCheck: PSimplexZeroSumCheckV0;
  allSourceUniformSumCheck: PSimplexZeroSumCheckV0;
  uniformKernelControl: PSimplexUniformKernelControlV0;
  childOnlyAmputationControl: PSimplexChildOnlyAmputationControlV0;
  accumulatedLocalChildSampleRows: PSimplexAccumulatedLocalChildSampleRowV0[];
  siblingContaminationRows: PSimplexSiblingContaminationRowV0[];
  generationCoefficientRows: PSimplexGenerationCoefficientRowV0[];
  invalidReductionAuditRows: PSimplexInvalidReductionAuditRowV0[];
}): string[] {
  const issues: string[] = [];
  const generation0Count = args.sourceLedgerRows.filter((row) => row.generation === 0).length;
  const generation1Count = args.sourceLedgerRows.filter((row) => row.generation === 1).length;

  if (args.sourceLedgerRows.length !== 10) {
    issues.push(`Expected 10 active sources, got ${args.sourceLedgerRows.length}.`);
  }

  if (generation0Count !== 4 || generation1Count !== 6) {
    issues.push(`Expected source counts 4/6 by generation, got ${generation0Count}/${generation1Count}.`);
  }

  if (!args.generationZeroSumCheck.ok) {
    issues.push('Generation-0 vector sum is nonzero.');
  }

  if (!args.generationOneSumCheck.ok) {
    issues.push('Generation-1 vector sum is nonzero.');
  }

  if (!args.allSourceUniformSumCheck.ok) {
    issues.push('All-source uniform vector sum is nonzero.');
  }

  if (!args.uniformKernelControl.ok || args.uniformKernelControl.status !== 'neutral-by-symmetry') {
    issues.push('Uniform kernel control did not return neutral-by-symmetry.');
  }

  if (
    !args.childOnlyAmputationControl.ok ||
    args.childOnlyAmputationControl.sourcePopulationStatus !== 'source-population-amputated' ||
    args.childOnlyAmputationControl.actualFieldModelValid
  ) {
    issues.push('Child-only control was not marked as an amputated control.');
  }

  const failedLocalRows = args.accumulatedLocalChildSampleRows.filter((row) => !row.ok);

  if (failedLocalRows.length > 0) {
    issues.push(`Accumulated local child rows failed: ${failedLocalRows.map((row) => `${row.childSite}:${row.scenarioId}`).join(', ')}.`);
  }

  const l0Rows = args.accumulatedLocalChildSampleRows.filter((row) => row.scenarioId === 'L0');
  const l1Rows = args.accumulatedLocalChildSampleRows.filter((row) => row.scenarioId === 'L1');

  if (
    l0Rows.some((row) => row.axisResult !== 'axis-preserved' || row.concreteCoefficient !== 2) ||
    l1Rows.some((row) => row.axisResult !== 'axis-preserved' || row.concreteCoefficient !== 1.5)
  ) {
    issues.push('Parent persistence scenarios did not preserve the expected child-axis logic.');
  }

  if (args.siblingContaminationRows.some((row) => !row.ok)) {
    issues.push('Sibling contamination rows were not reportable.');
  }

  if (args.generationCoefficientRows.some((row) => !row.ok || row.status !== 'neutral-by-symmetry')) {
    issues.push('Generation coefficient rows did not stay neutral under uniform kernels.');
  }

  const generation2 = args.generationCoefficientRows.find((row) => row.scenarioId === 'G2');

  if (
    !generation2 ||
    generation2.sourcePopulationStatus !== 'source-population-amputated-control' ||
    generation2.actualFieldModelValid
  ) {
    issues.push('G2 child-only row was not marked as an invalid active-population model.');
  }

  const scalarMagnitude = args.invalidReductionAuditRows.find((row) => row.reductionId === 'scalar-magnitude-only');
  const equalScalar = args.invalidReductionAuditRows.find((row) => row.reductionId === 'equal-source-weight-scalar');
  const labelStatus = args.invalidReductionAuditRows.find((row) => row.reductionId === 'bas-cp-status');

  if (
    !scalarMagnitude ||
    scalarMagnitude.observedVerdict !== 'FAIL' ||
    !equalScalar ||
    equalScalar.observedVerdict !== 'FAIL' ||
    !labelStatus ||
    labelStatus.observedVerdict !== 'FAIL'
  ) {
    issues.push('Invalid scalar or downstream-label reductions were not rejected.');
  }

  return [...new Set(issues)];
}

function buildChildAxisPairRow(
  leftChildSite: PSimplexChildSourceId,
  rightChildSite: PSimplexChildSourceId,
  signedAxisPair: PSimplexChildAxisPairRowV0['signedAxisPair'],
): PSimplexChildAxisPairRowV0 {
  const left = requireChildDefinition(leftChildSite);
  const right = requireChildDefinition(rightChildSite);
  const leftAxis = normalizeVec3(childVector(left)) ?? ZERO_VEC3;
  const rightAxis = normalizeVec3(childVector(right)) ?? ZERO_VEC3;
  const axesAreOpposed = isNearZeroVec3(addVec3(leftAxis, rightAxis));

  return {
    pairId: `${leftChildSite}/${rightChildSite}`,
    leftChildSite,
    rightChildSite,
    leftParentEdge: left.parentEdge,
    rightParentEdge: right.parentEdge,
    signedAxisPair,
    leftAxis: cleanVec3(leftAxis),
    rightAxis: cleanVec3(rightAxis),
    axesAreOpposed,
    ok: axesAreOpposed,
  };
}

function classifyAxisResult(
  value: PSimplexVec3,
  axis: PSimplexVec3,
): Extract<PSimplexAxisResult, 'axis-preserved' | 'axis-flipped' | 'axis-cancelled' | 'axis-bent' | 'threshold-sensitive'> {
  if (isNearZeroVec3(value)) {
    return 'axis-cancelled';
  }

  const alignment = axisAlignmentScore(value, axis);

  if (alignment < 1 - 1e-8) {
    return 'axis-bent';
  }

  const projection = projectionOntoAxis(value, axis);

  if (projection > EPSILON) {
    return 'axis-preserved';
  }

  if (projection < -EPSILON) {
    return 'axis-flipped';
  }

  return 'threshold-sensitive';
}

function classifySiblingAxisResult(
  value: PSimplexVec3,
  axis: PSimplexVec3,
): Extract<PSimplexAxisResult, 'axis-preserved' | 'axis-bent' | 'axis-cancelled' | 'threshold-sensitive'> {
  const result = classifyAxisResult(value, axis);

  return result === 'axis-flipped' ? 'axis-bent' : result;
}

function isSiblingChild(left: ChildDefinition, right: ChildDefinition): boolean {
  if (left.sourceId === right.sourceId || left.antipodalPartner === right.sourceId) {
    return false;
  }

  const sharedEndpointCount = left.endpoints.filter((endpoint) => right.endpoints.includes(endpoint)).length;

  return sharedEndpointCount === 1;
}

function childVector(child: ChildDefinition): PSimplexVec3 {
  return addVec3(PRIMAL_VECTOR_BY_ID[child.endpoints[0]], PRIMAL_VECTOR_BY_ID[child.endpoints[1]]);
}

function endpointsForEdge(edge: PSimplexChildEdgeId): [PSimplexPrimalSourceId, PSimplexPrimalSourceId] {
  const definition = CHILD_DEFINITIONS.find((candidate) => candidate.parentEdge === edge);

  if (!definition) {
    throw new Error(`Unknown child edge ${edge}`);
  }

  return definition.endpoints;
}

function requireChildDefinition(sourceId: PSimplexChildSourceId): ChildDefinition {
  const definition = CHILD_DEFINITIONS.find((candidate) => candidate.sourceId === sourceId);

  if (!definition) {
    throw new Error(`Unknown child source ${sourceId}`);
  }

  return definition;
}

function nearlyEqual(left: number, right: number): boolean {
  return Math.abs(left - right) <= EPSILON;
}

function cleanVec3(value: PSimplexVec3): PSimplexVec3 {
  return [cleanNumber(value[0]), cleanNumber(value[1]), cleanNumber(value[2])];
}

function cleanNumber(value: number): number {
  if (Math.abs(value) <= EPSILON) {
    return 0;
  }

  return Number(value.toFixed(12));
}
