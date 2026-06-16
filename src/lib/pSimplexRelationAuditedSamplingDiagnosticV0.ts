import {
  EPSILON,
  addVec3,
  buildPSimplexVectorOrderParameterDiagnosticV0Report,
  dotVec3,
  normVec3,
  normalizeVec3,
  scaleVec3,
  subVec3,
  sumVec3,
  type PSimplexChildEdgeId,
  type PSimplexChildSourceId,
  type PSimplexPrimalSourceId,
  type PSimplexSourceKind,
  type PSimplexSourceLedgerRowV0,
  type PSimplexVec3,
  type PSimplexVectorOrderParameterDiagnosticV0Report,
} from './pSimplexVectorOrderParameterDiagnosticV0';
import {
  buildPSimplexVectorOrderParameterLocalityDiagnosticV0Report,
  type PSimplexVectorOrderParameterLocalityDiagnosticV0Report,
} from './pSimplexVectorOrderParameterLocalityDiagnosticV0';

export type PSimplexRelationClass =
  | 'primary-child'
  | 'endpoint-parent'
  | 'complement-parent'
  | 'complement-child'
  | 'one-endpoint-sibling-child'
  | 'nonlocal-other';
export type PSimplexSamplingKernelFamily = 'K0' | 'K1' | 'K2' | 'K4';
export type PSimplexSamplingStatus =
  | 'axis-preserved'
  | 'axis-flipped'
  | 'axis-cancelled'
  | 'axis-warning'
  | 'axis-bent'
  | 'mixed-axis'
  | 'neutral-by-symmetry'
  | 'locality-sensitive'
  | 'kernel-artifact-risk'
  | 'unreadable-under-axis-policy'
  | 'source-population-amputated-control';
export type PSimplexReadabilityStatus =
  | 'axis-preserved'
  | 'axis-flipped'
  | 'axis-cancelled'
  | 'neutral-by-symmetry'
  | 'unreadable-under-axis-policy';
export type PSimplexSamplingVerdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexSamplingRecommendation = 'declare-kernel-locality-policy-before-geometry-distance-sampling';

export interface PSimplexSourceRelationRowV0 {
  targetChild: PSimplexChildSourceId;
  sourceId: PSimplexPrimalSourceId | PSimplexChildSourceId;
  sourceGeneration: 0 | 1;
  sourceKind: PSimplexSourceKind;
  qVector: PSimplexVec3;
  relationClass: PSimplexRelationClass;
  symmetryPartner?: PSimplexPrimalSourceId | PSimplexChildSourceId;
  axisCompatibilityRole: string;
}

export interface PSimplexSampleRowV0 {
  sampleId: string;
  targetChild: PSimplexChildSourceId;
  sampleDomainKind: 'relation-graph-target-child';
  sampleLocationOrGraphNode: PSimplexChildSourceId;
  kernelFamily: PSimplexSamplingKernelFamily;
  kernelVariant: string;
  relationClassWeights: Record<PSimplexRelationClass, number[]>;
  sourceWeights: Record<string, number>;
  axisCompatible: boolean;
  axisCompatibilityFailures: string[];
}

export interface PSimplexVectorResultRowV0 {
  sampleId: string;
  targetChild: PSimplexChildSourceId;
  phi: PSimplexVec3;
  magnitude: number;
  targetAxis: PSimplexVec3;
  axisProjection: number;
  transverseResidualVector: PSimplexVec3;
  transverseResidualMagnitude: number;
  axisAlignment: number;
  status: PSimplexSamplingStatus;
  readabilityStatus: PSimplexReadabilityStatus;
  suppressedCleanReading: boolean;
}

export interface PSimplexLocalityAuditRowV0 {
  sampleId: string;
  targetChild: PSimplexChildSourceId;
  axisCompatible: boolean;
  localitySensitive: boolean;
  siblingLeakageAmount: number;
  nonlocalLeakageAmount: number;
  transverseResidualMagnitude: number;
  kernelArtifactRisk: boolean;
  unreadableUnderAxisPolicy: boolean;
  suppressedCleanReading: boolean;
  axisCompatibilityFailures: string[];
  notes: string;
}

export interface PSimplexControlRowV0 {
  controlId: 'C0' | 'C1' | 'C2' | 'C3';
  controlKind:
    | 'uniform-accumulated-control'
    | 'child-only-amputation-control'
    | 'scalar-reduction-failure-control'
    | 'status-reduction-failure-control';
  expectedResult: string;
  observedResult: string;
  actualFieldModelValid: boolean;
  ok: boolean;
}

export interface PSimplexRelationAuditedSamplingSummaryV0 {
  activeSourceCount: number;
  targetChildCount: number;
  sourceRelationRowCount: number;
  sampleCount: number;
  axisCompatibleSampleCount: number;
  axisIncompatibleSampleCount: number;
  cleanAxisReadingCount: number;
  suppressedCleanReadingCount: number;
  localitySensitiveCount: number;
  kernelArtifactRiskCount: number;
  unreadableUnderAxisPolicyCount: number;
  controlCount: number;
}

export interface PSimplexRelationAuditedSamplingDiagnosticV0Report {
  method: 'p-simplex-relation-audited-sampling-diagnostic-v0';
  candidatePackage: 'p-simplex-relation-audited-sampling-v0.1';
  parentVectorDiagnostic: 'p-simplex-vector-order-parameter-diagnostic-v0';
  parentLocalityDiagnostic: 'p-simplex-vector-order-parameter-locality-diagnostic-v0';
  diagnosticScope: 'finite-relation-audited-graph-sampling-only';
  vectorCarrierStatus: 'r3-vector-order-parameter';
  solverStatus: 'not-lg-solver';
  geometrySamplingStatus: 'geometry-distance-kernel-deferred';
  renderingStatus: 'not-rendering';
  semanticStatus: 'not-semantic-naming';
  fieldCueStatus: 'not-field-cue';
  routeStatus: 'no-route-walk-holonomy';
  sourcePopulationPolicy: 'accumulated-sources-s-leq-1';
  parentVectorDiagnosticStillPasses: boolean;
  parentLocalityDiagnosticStillPasses: boolean;
  sourceRelationRows: PSimplexSourceRelationRowV0[];
  sampleRows: PSimplexSampleRowV0[];
  vectorResultRows: PSimplexVectorResultRowV0[];
  localityAuditRows: PSimplexLocalityAuditRowV0[];
  controlRows: PSimplexControlRowV0[];
  summary: PSimplexRelationAuditedSamplingSummaryV0;
  finalRecommendation: PSimplexSamplingRecommendation;
  verdict: PSimplexSamplingVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface SourceRecord {
  sourceId: PSimplexPrimalSourceId | PSimplexChildSourceId;
  generation: 0 | 1;
  sourceKind: PSimplexSourceKind;
  q: PSimplexVec3;
  parentEdge?: PSimplexChildEdgeId;
  endpoints?: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  complementEdge?: PSimplexChildEdgeId;
  antipodalPartner?: PSimplexChildSourceId;
}

interface TargetChildRecord extends SourceRecord {
  sourceId: PSimplexChildSourceId;
  generation: 1;
  sourceKind: 'child';
  parentEdge: PSimplexChildEdgeId;
  endpoints: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  complementEdge: PSimplexChildEdgeId;
  antipodalPartner: PSimplexChildSourceId;
  targetAxis: PSimplexVec3;
  complementEndpoints: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
}

interface SampleDefinition {
  kernelFamily: PSimplexSamplingKernelFamily;
  kernelVariant: string;
  buildWeights: (target: TargetChildRecord, sources: SourceRecord[]) => Record<string, number>;
}

const CHILD_ORDER: readonly PSimplexChildSourceId[] = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const PRIMAL_ORDER: readonly PSimplexPrimalSourceId[] = ['A', 'B', 'C', 'D'];
const RELATION_CLASSES: readonly PSimplexRelationClass[] = [
  'primary-child',
  'endpoint-parent',
  'complement-parent',
  'complement-child',
  'one-endpoint-sibling-child',
  'nonlocal-other',
];
const AXIS_CLEAN_THRESHOLD = 0.9;
const AXIS_WARNING_THRESHOLD = 0.75;
const AXIS_BENT_THRESHOLD = 0.5;

export function buildPSimplexRelationAuditedSamplingDiagnosticV0Report(): PSimplexRelationAuditedSamplingDiagnosticV0Report {
  const parentVectorReport = buildPSimplexVectorOrderParameterDiagnosticV0Report();
  const parentLocalityReport = buildPSimplexVectorOrderParameterLocalityDiagnosticV0Report();
  const structuralIssues: string[] = [];
  const sources = deriveSources(parentVectorReport.sourceLedgerRows, structuralIssues);
  const targetChildren = deriveTargetChildren(sources, structuralIssues);
  const sourceRelationRows = targetChildren.flatMap((target) =>
    sources.map((source) => buildSourceRelationRow(target, source)),
  );
  const sampleDefinitions = buildSampleDefinitions();
  const sampleRows = targetChildren.flatMap((target) =>
    sampleDefinitions.map((definition) => buildSampleRow(target, sources, sourceRelationRows, definition)),
  );
  const vectorResultRows = sampleRows.map((sample) => buildVectorResultRow(sample, sources, targetChildren));
  const localityAuditRows = sampleRows.map((sample) =>
    buildLocalityAuditRow(sample, sourceRelationRows, vectorResultRows),
  );
  const controlRows = buildControlRows(parentVectorReport, sampleRows, vectorResultRows);
  const summary = buildSummary({
    activeSourceCount: parentVectorReport.activeSourceCount,
    targetChildCount: targetChildren.length,
    sourceRelationRows,
    sampleRows,
    vectorResultRows,
    localityAuditRows,
    controlRows,
  });
  const parentVectorDiagnosticStillPasses =
    parentVectorReport.ok && parentVectorReport.integrityIssueCount === 0;
  const parentLocalityDiagnosticStillPasses =
    parentLocalityReport.ok && parentLocalityReport.integrityIssueCount === 0;
  const integrityIssues = buildIntegrityIssues({
    structuralIssues,
    parentVectorDiagnosticStillPasses,
    parentLocalityDiagnosticStillPasses,
    activeSourceCount: parentVectorReport.activeSourceCount,
    targetChildren,
    sourceRelationRows,
    sampleRows,
    vectorResultRows,
    localityAuditRows,
    controlRows,
  });
  const verdict = classifyVerdict(integrityIssues, vectorResultRows, localityAuditRows);

  return {
    method: 'p-simplex-relation-audited-sampling-diagnostic-v0',
    candidatePackage: 'p-simplex-relation-audited-sampling-v0.1',
    parentVectorDiagnostic: 'p-simplex-vector-order-parameter-diagnostic-v0',
    parentLocalityDiagnostic: 'p-simplex-vector-order-parameter-locality-diagnostic-v0',
    diagnosticScope: 'finite-relation-audited-graph-sampling-only',
    vectorCarrierStatus: 'r3-vector-order-parameter',
    solverStatus: 'not-lg-solver',
    geometrySamplingStatus: 'geometry-distance-kernel-deferred',
    renderingStatus: 'not-rendering',
    semanticStatus: 'not-semantic-naming',
    fieldCueStatus: 'not-field-cue',
    routeStatus: 'no-route-walk-holonomy',
    sourcePopulationPolicy: 'accumulated-sources-s-leq-1',
    parentVectorDiagnosticStillPasses,
    parentLocalityDiagnosticStillPasses,
    sourceRelationRows,
    sampleRows,
    vectorResultRows,
    localityAuditRows,
    controlRows,
    summary,
    finalRecommendation: 'declare-kernel-locality-policy-before-geometry-distance-sampling',
    verdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0,
  };
}

function deriveSources(rows: PSimplexSourceLedgerRowV0[], structuralIssues: string[]): SourceRecord[] {
  const sources = rows.map((row): SourceRecord => ({
    sourceId: row.sourceId,
    generation: row.generation,
    sourceKind: row.sourceKind,
    q: row.q,
    parentEdge: row.parentEdge,
    endpoints: row.endpoints,
    complementEdge: row.complementEdge,
    antipodalPartner: row.antipodalPartner,
  }));

  if (sources.length !== 10) {
    structuralIssues.push(`Expected 10 active sources from parent vector diagnostic, got ${sources.length}.`);
  }

  return [...sources].sort(compareSourceRecords);
}

function deriveTargetChildren(sources: SourceRecord[], structuralIssues: string[]): TargetChildRecord[] {
  const targets: TargetChildRecord[] = [];

  for (const childId of CHILD_ORDER) {
    const source = sources.find((candidate) => candidate.sourceId === childId);

    if (!source || source.sourceKind !== 'child' || !isChildSourceId(source.sourceId)) {
      structuralIssues.push(`Missing target child ${childId}.`);
      continue;
    }

    if (!source.parentEdge || !source.endpoints || !source.complementEdge || !source.antipodalPartner) {
      structuralIssues.push(`Target child ${childId} is missing relation metadata.`);
      continue;
    }

    const targetAxis = normalizeVec3(source.q);

    if (!targetAxis) {
      structuralIssues.push(`Target child ${childId} has no nonzero target axis.`);
      continue;
    }

    targets.push({
      ...source,
      sourceId: source.sourceId,
      generation: 1,
      sourceKind: 'child',
      parentEdge: source.parentEdge,
      endpoints: source.endpoints,
      complementEdge: source.complementEdge,
      antipodalPartner: source.antipodalPartner,
      targetAxis,
      complementEndpoints: endpointsForEdge(source.complementEdge),
    });
  }

  return targets;
}

function buildSourceRelationRow(target: TargetChildRecord, source: SourceRecord): PSimplexSourceRelationRowV0 {
  const relationClass = classifyRelation(target, source);

  return {
    targetChild: target.sourceId,
    sourceId: source.sourceId,
    sourceGeneration: source.generation,
    sourceKind: source.sourceKind,
    qVector: cleanVec3(source.q),
    relationClass,
    symmetryPartner: symmetryPartnerForRelation(target, source, relationClass),
    axisCompatibilityRole: axisCompatibilityRoleForRelation(relationClass),
  };
}

function classifyRelation(target: TargetChildRecord, source: SourceRecord): PSimplexRelationClass {
  if (source.sourceKind === 'child' && source.sourceId === target.sourceId) {
    return 'primary-child';
  }

  if (source.sourceKind === 'primal' && target.endpoints.includes(source.sourceId as PSimplexPrimalSourceId)) {
    return 'endpoint-parent';
  }

  if (
    source.sourceKind === 'primal' &&
    target.complementEndpoints.includes(source.sourceId as PSimplexPrimalSourceId)
  ) {
    return 'complement-parent';
  }

  if (source.sourceKind === 'child' && source.sourceId === target.antipodalPartner) {
    return 'complement-child';
  }

  if (source.sourceKind === 'child' && source.endpoints && sharesExactlyOneEndpoint(target.endpoints, source.endpoints)) {
    return 'one-endpoint-sibling-child';
  }

  return 'nonlocal-other';
}

function symmetryPartnerForRelation(
  target: TargetChildRecord,
  source: SourceRecord,
  relationClass: PSimplexRelationClass,
): PSimplexPrimalSourceId | PSimplexChildSourceId | undefined {
  if (relationClass === 'primary-child') {
    return target.antipodalPartner;
  }

  if (relationClass === 'complement-child') {
    return target.sourceId;
  }

  if (relationClass === 'endpoint-parent') {
    return target.endpoints.find((endpoint) => endpoint !== source.sourceId);
  }

  if (relationClass === 'complement-parent') {
    return target.complementEndpoints.find((endpoint) => endpoint !== source.sourceId);
  }

  if (relationClass === 'one-endpoint-sibling-child' && source.endpoints) {
    return siblingSymmetryPartner(target, source.endpoints);
  }

  return undefined;
}

function axisCompatibilityRoleForRelation(relationClass: PSimplexRelationClass): string {
  const roles: Record<PSimplexRelationClass, string> = {
    'primary-child': 'axis-carrier-allowed',
    'endpoint-parent': 'endpoint-parent-symmetric-pair',
    'complement-parent': 'complement-parent-symmetric-pair',
    'complement-child': 'opposite-axis-carrier-allowed',
    'one-endpoint-sibling-child': 'sibling-child-pair-cancel-required',
    'nonlocal-other': 'must-remain-zero',
  };

  return roles[relationClass];
}

function buildSampleDefinitions(): SampleDefinition[] {
  return [
    {
      kernelFamily: 'K0',
      kernelVariant: 'uniform-accumulated-control',
      buildWeights: (_target, sources) => weightsFromEntries(sources.map((source) => [source.sourceId, 1])),
    },
    {
      kernelFamily: 'K1',
      kernelVariant: 'axis-local-child-stencil',
      buildWeights: (target, sources) => {
        const weights = zeroWeights(sources);

        weights[target.sourceId] = 1;
        setAllWeights(weights, target.endpoints, 1);

        return weights;
      },
    },
    {
      kernelFamily: 'K1',
      kernelVariant: 'axis-local-cancel',
      buildWeights: (target, sources) => {
        const weights = zeroWeights(sources);

        setAllWeights(weights, target.endpoints, 1);
        setAllWeights(weights, target.complementEndpoints, 1);

        return weights;
      },
    },
    {
      kernelFamily: 'K1',
      kernelVariant: 'axis-local-flip',
      buildWeights: (target, sources) => {
        const weights = zeroWeights(sources);

        setAllWeights(weights, target.complementEndpoints, 1);

        return weights;
      },
    },
    {
      kernelFamily: 'K2',
      kernelVariant: 'one-sibling-leakage',
      buildWeights: (target, sources) => {
        const weights = zeroWeights(sources);
        const firstSibling = firstSiblingForTarget(target, sources);

        weights[target.sourceId] = 1;
        weights[firstSibling.sourceId] = 1;

        return weights;
      },
    },
    {
      kernelFamily: 'K4',
      kernelVariant: 'pair-cancelled-relation-graph',
      buildWeights: (target, sources) => {
        const weights = zeroWeights(sources);

        weights[target.sourceId] = 1;
        weights[target.antipodalPartner] = 0.25;
        setAllWeights(weights, target.endpoints, 0.5);
        setAllWeights(weights, target.complementEndpoints, 0.25);

        for (const sibling of siblingChildrenForTarget(target, sources)) {
          weights[sibling.sourceId] = 0.25;
        }

        return weights;
      },
    },
  ];
}

function buildSampleRow(
  target: TargetChildRecord,
  sources: SourceRecord[],
  sourceRelationRows: PSimplexSourceRelationRowV0[],
  definition: SampleDefinition,
): PSimplexSampleRowV0 {
  const sourceWeights = definition.buildWeights(target, sources);
  const relationRowsForTarget = sourceRelationRows.filter((row) => row.targetChild === target.sourceId);
  const axisCompatibilityFailures = axisCompatibilityFailuresFor(target, sourceWeights, sources);
  const sampleId = `${definition.kernelFamily}-${definition.kernelVariant}-${target.sourceId}`;

  return {
    sampleId,
    targetChild: target.sourceId,
    sampleDomainKind: 'relation-graph-target-child',
    sampleLocationOrGraphNode: target.sourceId,
    kernelFamily: definition.kernelFamily,
    kernelVariant: definition.kernelVariant,
    relationClassWeights: relationClassWeights(relationRowsForTarget, sourceWeights),
    sourceWeights: cleanWeightRecord(sourceWeights),
    axisCompatible: axisCompatibilityFailures.length === 0,
    axisCompatibilityFailures,
  };
}

function buildVectorResultRow(
  sample: PSimplexSampleRowV0,
  sources: SourceRecord[],
  targets: TargetChildRecord[],
): PSimplexVectorResultRowV0 {
  const target = requireTarget(targets, sample.targetChild);
  const phi = sumVec3(
    sources.map((source) => scaleVec3(source.q, sample.sourceWeights[source.sourceId] ?? 0)),
  );
  const magnitude = normVec3(phi);
  const axisProjection = dotVec3(phi, target.targetAxis);
  const projected = scaleVec3(target.targetAxis, axisProjection);
  const transverseResidualVector = subVec3(phi, projected);
  const transverseResidualMagnitude = normVec3(transverseResidualVector);
  const axisAlignment = magnitude > EPSILON ? Math.abs(axisProjection) / magnitude : 0;
  const status = classifyVectorStatus(sample, magnitude, transverseResidualMagnitude, axisProjection, axisAlignment);
  const suppressedCleanReading =
    magnitude > EPSILON && axisAlignment < AXIS_CLEAN_THRESHOLD;
  const readabilityStatus = readabilityStatusFor(status, suppressedCleanReading);

  return {
    sampleId: sample.sampleId,
    targetChild: sample.targetChild,
    phi: cleanVec3(phi),
    magnitude: cleanNumber(magnitude),
    targetAxis: cleanVec3(target.targetAxis),
    axisProjection: cleanNumber(axisProjection),
    transverseResidualVector: cleanVec3(transverseResidualVector),
    transverseResidualMagnitude: cleanNumber(transverseResidualMagnitude),
    axisAlignment: cleanNumber(axisAlignment),
    status,
    readabilityStatus,
    suppressedCleanReading,
  };
}

function buildLocalityAuditRow(
  sample: PSimplexSampleRowV0,
  sourceRelationRows: PSimplexSourceRelationRowV0[],
  vectorResultRows: PSimplexVectorResultRowV0[],
): PSimplexLocalityAuditRowV0 {
  const vectorResult = requireVectorResult(vectorResultRows, sample.sampleId);
  const relationRowsForTarget = sourceRelationRows.filter((row) => row.targetChild === sample.targetChild);
  const siblingLeakageAmount = relationRowsForTarget
    .filter((row) => row.relationClass === 'one-endpoint-sibling-child')
    .reduce((sum, row) => sum + Math.abs(sample.sourceWeights[row.sourceId] ?? 0), 0);
  const nonlocalLeakageAmount = relationRowsForTarget
    .filter((row) => row.relationClass === 'nonlocal-other')
    .reduce((sum, row) => sum + Math.abs(sample.sourceWeights[row.sourceId] ?? 0), 0);
  const readabilityRisk = vectorResult.suppressedCleanReading;
  const localitySensitive =
    !sample.axisCompatible ||
    vectorResult.status === 'axis-warning' ||
    vectorResult.status === 'axis-bent' ||
    vectorResult.status === 'mixed-axis';
  const kernelArtifactRisk = !sample.axisCompatible || readabilityRisk;

  return {
    sampleId: sample.sampleId,
    targetChild: sample.targetChild,
    axisCompatible: sample.axisCompatible,
    localitySensitive,
    siblingLeakageAmount: cleanNumber(siblingLeakageAmount),
    nonlocalLeakageAmount: cleanNumber(nonlocalLeakageAmount),
    transverseResidualMagnitude: vectorResult.transverseResidualMagnitude,
    kernelArtifactRisk,
    unreadableUnderAxisPolicy: readabilityRisk,
    suppressedCleanReading: vectorResult.suppressedCleanReading,
    axisCompatibilityFailures: sample.axisCompatibilityFailures,
    notes: localitySensitive
      ? 'Locality-sensitive sample: clean child-axis reading is suppressed when transverse residual crosses the policy threshold.'
      : 'Axis-compatible relation stencil: vector result remains readable by the target child axis policy.',
  };
}

function buildControlRows(
  parentVectorReport: PSimplexVectorOrderParameterDiagnosticV0Report,
  sampleRows: PSimplexSampleRowV0[],
  vectorResultRows: PSimplexVectorResultRowV0[],
): PSimplexControlRowV0[] {
  const k0Rows = vectorResultRows.filter((row) => sampleRows.find((sample) => sample.sampleId === row.sampleId)?.kernelFamily === 'K0');
  const scalarMagnitude = parentVectorReport.invalidReductionAuditRows.find(
    (row) => row.reductionId === 'scalar-magnitude-only',
  );
  const statusReduction = parentVectorReport.invalidReductionAuditRows.find(
    (row) => row.reductionId === 'bas-cp-status',
  );

  return [
    {
      controlId: 'C0',
      controlKind: 'uniform-accumulated-control',
      expectedResult: 'neutral-by-symmetry for every target child',
      observedResult: k0Rows.every((row) => row.status === 'neutral-by-symmetry')
        ? 'neutral-by-symmetry'
        : 'non-neutral',
      actualFieldModelValid: true,
      ok: k0Rows.length === 6 && k0Rows.every((row) => row.status === 'neutral-by-symmetry'),
    },
    {
      controlId: 'C1',
      controlKind: 'child-only-amputation-control',
      expectedResult: 'source-population-amputated-control only',
      observedResult: parentVectorReport.childOnlyAmputationControl.sourcePopulationStatus,
      actualFieldModelValid: false,
      ok:
        parentVectorReport.childOnlyAmputationControl.ok &&
        !parentVectorReport.childOnlyAmputationControl.actualFieldModelValid,
    },
    {
      controlId: 'C2',
      controlKind: 'scalar-reduction-failure-control',
      expectedResult: 'scalar magnitude reduction rejected',
      observedResult: scalarMagnitude?.observedVerdict ?? 'missing',
      actualFieldModelValid: false,
      ok: scalarMagnitude?.observedVerdict === 'FAIL',
    },
    {
      controlId: 'C3',
      controlKind: 'status-reduction-failure-control',
      expectedResult: 'status reduction rejected',
      observedResult: statusReduction?.observedVerdict ?? 'missing',
      actualFieldModelValid: false,
      ok: statusReduction?.observedVerdict === 'FAIL',
    },
  ];
}

function buildSummary(args: {
  activeSourceCount: number;
  targetChildCount: number;
  sourceRelationRows: PSimplexSourceRelationRowV0[];
  sampleRows: PSimplexSampleRowV0[];
  vectorResultRows: PSimplexVectorResultRowV0[];
  localityAuditRows: PSimplexLocalityAuditRowV0[];
  controlRows: PSimplexControlRowV0[];
}): PSimplexRelationAuditedSamplingSummaryV0 {
  return {
    activeSourceCount: args.activeSourceCount,
    targetChildCount: args.targetChildCount,
    sourceRelationRowCount: args.sourceRelationRows.length,
    sampleCount: args.sampleRows.length,
    axisCompatibleSampleCount: args.sampleRows.filter((row) => row.axisCompatible).length,
    axisIncompatibleSampleCount: args.sampleRows.filter((row) => !row.axisCompatible).length,
    cleanAxisReadingCount: args.vectorResultRows.filter((row) => !row.suppressedCleanReading).length,
    suppressedCleanReadingCount: args.vectorResultRows.filter((row) => row.suppressedCleanReading).length,
    localitySensitiveCount: args.localityAuditRows.filter((row) => row.localitySensitive).length,
    kernelArtifactRiskCount: args.localityAuditRows.filter((row) => row.kernelArtifactRisk).length,
    unreadableUnderAxisPolicyCount: args.localityAuditRows.filter((row) => row.unreadableUnderAxisPolicy).length,
    controlCount: args.controlRows.length,
  };
}

function buildIntegrityIssues(args: {
  structuralIssues: string[];
  parentVectorDiagnosticStillPasses: boolean;
  parentLocalityDiagnosticStillPasses: boolean;
  activeSourceCount: number;
  targetChildren: TargetChildRecord[];
  sourceRelationRows: PSimplexSourceRelationRowV0[];
  sampleRows: PSimplexSampleRowV0[];
  vectorResultRows: PSimplexVectorResultRowV0[];
  localityAuditRows: PSimplexLocalityAuditRowV0[];
  controlRows: PSimplexControlRowV0[];
}): string[] {
  const issues = [...args.structuralIssues];

  if (!args.parentVectorDiagnosticStillPasses) {
    issues.push('Parent vector diagnostic did not pass.');
  }

  if (!args.parentLocalityDiagnosticStillPasses) {
    issues.push('Parent locality diagnostic did not pass.');
  }

  if (args.activeSourceCount !== 10) {
    issues.push(`Expected active source count 10, got ${args.activeSourceCount}.`);
  }

  if (args.targetChildren.length !== 6) {
    issues.push(`Expected 6 target children, got ${args.targetChildren.length}.`);
  }

  if (args.sourceRelationRows.length !== 60) {
    issues.push(`Expected 60 source relation rows, got ${args.sourceRelationRows.length}.`);
  }

  for (const target of args.targetChildren) {
    const rows = args.sourceRelationRows.filter((row) => row.targetChild === target.sourceId);
    const counts = countRelationClasses(rows);

    if (
      rows.length !== 10 ||
      counts['primary-child'] !== 1 ||
      counts['endpoint-parent'] !== 2 ||
      counts['complement-parent'] !== 2 ||
      counts['complement-child'] !== 1 ||
      counts['one-endpoint-sibling-child'] !== 4 ||
      counts['nonlocal-other'] !== 0
    ) {
      issues.push(`Relation classification for ${target.sourceId} is not exhaustive with expected class counts.`);
    }
  }

  const k0Rows = rowsForKernel(args.sampleRows, args.vectorResultRows, 'K0');
  if (k0Rows.length !== 6 || k0Rows.some((row) => row.status !== 'neutral-by-symmetry' || row.magnitude > EPSILON)) {
    issues.push('K0 uniform accumulated control did not return zero neutral rows.');
  }

  const k1Samples = args.sampleRows.filter((row) => row.kernelFamily === 'K1');
  const k1Results = rowsForKernel(args.sampleRows, args.vectorResultRows, 'K1');
  if (
    k1Samples.some((row) => !row.axisCompatible) ||
    k1Results.some((row) => row.status === 'axis-warning' || row.status === 'axis-bent' || row.status === 'mixed-axis')
  ) {
    issues.push('At least one K1 axis-compatible row lost clean axis readability.');
  }

  const k2Samples = args.sampleRows.filter((row) => row.kernelFamily === 'K2');
  const k2Results = rowsForKernel(args.sampleRows, args.vectorResultRows, 'K2');
  const k2Audits = auditsForKernel(args.sampleRows, args.localityAuditRows, 'K2');
  if (
    k2Samples.length !== 6 ||
    k2Samples.some((row) => row.axisCompatible) ||
    k2Results.some((row) => !row.suppressedCleanReading || row.readabilityStatus !== 'unreadable-under-axis-policy')
  ) {
    issues.push('K2 asymmetric sibling leakage was treated as a clean child-axis reading.');
  }

  if (!k2Audits.some((row) => row.localitySensitive && row.unreadableUnderAxisPolicy)) {
    issues.push('K2 did not produce a locality-sensitive unreadable row.');
  }

  const k4Samples = args.sampleRows.filter((row) => row.kernelFamily === 'K4');
  if (k4Samples.length !== 6 || k4Samples.some((row) => !row.axisCompatible)) {
    issues.push('K4 relation graph stencil was not axis-compatible for all target children.');
  }

  const childOnlyControl = args.controlRows.find((row) => row.controlId === 'C1');
  const scalarControl = args.controlRows.find((row) => row.controlId === 'C2');
  const statusControl = args.controlRows.find((row) => row.controlId === 'C3');

  if (!childOnlyControl || childOnlyControl.actualFieldModelValid || !childOnlyControl.ok) {
    issues.push('Child-only control was treated as an actual field model or failed its control check.');
  }

  if (!scalarControl?.ok || !statusControl?.ok) {
    issues.push('Scalar or status reduction controls were not rejected.');
  }

  if (args.controlRows.some((row) => !row.ok)) {
    issues.push('At least one required control failed.');
  }

  if (statusValuesContainForbiddenTerms(args.vectorResultRows)) {
    issues.push('A vector result status contained forbidden vocabulary.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(
  integrityIssues: string[],
  vectorResultRows: PSimplexVectorResultRowV0[],
  localityAuditRows: PSimplexLocalityAuditRowV0[],
): PSimplexSamplingVerdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  const suppressedRows = vectorResultRows.filter((row) => row.suppressedCleanReading).length;
  const localityRows = localityAuditRows.filter((row) => row.localitySensitive).length;

  if (suppressedRows > 0 && localityRows > 0) {
    return 'PASS';
  }

  return 'PARTIAL';
}

function axisCompatibilityFailuresFor(
  target: TargetChildRecord,
  weights: Record<string, number>,
  sources: SourceRecord[],
): string[] {
  const failures: string[] = [];
  const [endpointA, endpointB] = target.endpoints;
  const [complementA, complementB] = target.complementEndpoints;

  if (!nearlyEqual(weights[endpointA], weights[endpointB])) {
    failures.push('endpoint-parent-symmetry-failed');
  }

  if (!nearlyEqual(weights[complementA], weights[complementB])) {
    failures.push('complement-parent-symmetry-failed');
  }

  const siblingPairs = siblingCancellationPairs(target);

  for (const [left, right] of siblingPairs) {
    if (!nearlyEqual(weights[left], weights[right])) {
      failures.push(`sibling-pair-symmetry-failed:${left}:${right}`);
    }
  }

  for (const source of sources) {
    const relationClass = classifyRelation(target, source);

    if (relationClass === 'nonlocal-other' && Math.abs(weights[source.sourceId] ?? 0) > EPSILON) {
      failures.push(`nonlocal-source-nonzero:${source.sourceId}`);
    }
  }

  return failures;
}

function relationClassWeights(
  rows: PSimplexSourceRelationRowV0[],
  weights: Record<string, number>,
): Record<PSimplexRelationClass, number[]> {
  return Object.fromEntries(
    RELATION_CLASSES.map((relationClass) => [
      relationClass,
      rows
        .filter((row) => row.relationClass === relationClass)
        .map((row) => cleanNumber(weights[row.sourceId] ?? 0)),
    ]),
  ) as Record<PSimplexRelationClass, number[]>;
}

function classifyVectorStatus(
  sample: PSimplexSampleRowV0,
  magnitude: number,
  residualMagnitude: number,
  axisProjection: number,
  axisAlignment: number,
): PSimplexSamplingStatus {
  if (magnitude <= EPSILON && residualMagnitude <= EPSILON) {
    return sample.kernelFamily === 'K0' ? 'neutral-by-symmetry' : 'axis-cancelled';
  }

  if (axisAlignment >= AXIS_CLEAN_THRESHOLD && axisProjection > EPSILON) {
    return 'axis-preserved';
  }

  if (axisAlignment >= AXIS_CLEAN_THRESHOLD && axisProjection < -EPSILON) {
    return 'axis-flipped';
  }

  if (axisAlignment >= AXIS_WARNING_THRESHOLD) {
    return 'axis-warning';
  }

  if (axisAlignment >= AXIS_BENT_THRESHOLD) {
    return 'axis-bent';
  }

  return 'mixed-axis';
}

function readabilityStatusFor(
  status: PSimplexSamplingStatus,
  suppressedCleanReading: boolean,
): PSimplexReadabilityStatus {
  if (suppressedCleanReading) {
    return 'unreadable-under-axis-policy';
  }

  if (
    status === 'axis-preserved' ||
    status === 'axis-flipped' ||
    status === 'axis-cancelled' ||
    status === 'neutral-by-symmetry'
  ) {
    return status;
  }

  return 'unreadable-under-axis-policy';
}

function countRelationClasses(rows: PSimplexSourceRelationRowV0[]): Record<PSimplexRelationClass, number> {
  return Object.fromEntries(
    RELATION_CLASSES.map((relationClass) => [
      relationClass,
      rows.filter((row) => row.relationClass === relationClass).length,
    ]),
  ) as Record<PSimplexRelationClass, number>;
}

function rowsForKernel(
  sampleRows: PSimplexSampleRowV0[],
  vectorResultRows: PSimplexVectorResultRowV0[],
  kernelFamily: PSimplexSamplingKernelFamily,
): PSimplexVectorResultRowV0[] {
  const ids = new Set(sampleRows.filter((row) => row.kernelFamily === kernelFamily).map((row) => row.sampleId));

  return vectorResultRows.filter((row) => ids.has(row.sampleId));
}

function auditsForKernel(
  sampleRows: PSimplexSampleRowV0[],
  localityAuditRows: PSimplexLocalityAuditRowV0[],
  kernelFamily: PSimplexSamplingKernelFamily,
): PSimplexLocalityAuditRowV0[] {
  const ids = new Set(sampleRows.filter((row) => row.kernelFamily === kernelFamily).map((row) => row.sampleId));

  return localityAuditRows.filter((row) => ids.has(row.sampleId));
}

function statusValuesContainForbiddenTerms(rows: PSimplexVectorResultRowV0[]): boolean {
  const forbidden = [
    'basin',
    'wall',
    'complement-pressure',
    'defect',
    'route',
    'walk',
    'holonomy',
    'vortex',
    'dwelling',
    'naming pressure',
    'semantic interpretation',
  ];

  return rows.some((row) => forbidden.some((term) => row.status.includes(term) || row.readabilityStatus.includes(term)));
}

function weightsFromEntries(
  entries: Array<readonly [PSimplexPrimalSourceId | PSimplexChildSourceId, number]>,
): Record<string, number> {
  return Object.fromEntries(entries.map(([sourceId, weight]) => [sourceId, weight]));
}

function zeroWeights(sources: SourceRecord[]): Record<string, number> {
  return weightsFromEntries(sources.map((source) => [source.sourceId, 0]));
}

function setAllWeights(
  weights: Record<string, number>,
  sourceIds: Array<PSimplexPrimalSourceId | PSimplexChildSourceId> | readonly (PSimplexPrimalSourceId | PSimplexChildSourceId)[],
  value: number,
): void {
  for (const sourceId of sourceIds) {
    weights[sourceId] = value;
  }
}

function firstSiblingForTarget(target: TargetChildRecord, sources: SourceRecord[]): SourceRecord {
  const sibling = siblingChildrenForTarget(target, sources)[0];

  if (!sibling) {
    throw new Error(`No one-endpoint sibling child found for ${target.sourceId}.`);
  }

  return sibling;
}

function siblingChildrenForTarget(target: TargetChildRecord, sources: SourceRecord[]): SourceRecord[] {
  return sources
    .filter(
      (source) =>
        source.sourceKind === 'child' &&
        source.sourceId !== target.sourceId &&
        source.sourceId !== target.antipodalPartner &&
        source.endpoints &&
        sharesExactlyOneEndpoint(target.endpoints, source.endpoints),
    )
    .sort(compareSourceRecords);
}

function siblingCancellationPairs(target: TargetChildRecord): Array<[PSimplexChildSourceId, PSimplexChildSourceId]> {
  const [i, j] = target.endpoints;
  const [k, l] = target.complementEndpoints;

  return [
    [childIdForEndpoints(i, k), childIdForEndpoints(j, l)],
    [childIdForEndpoints(i, l), childIdForEndpoints(j, k)],
  ];
}

function siblingSymmetryPartner(
  target: TargetChildRecord,
  sourceEndpoints: [PSimplexPrimalSourceId, PSimplexPrimalSourceId],
): PSimplexChildSourceId | undefined {
  for (const [left, right] of siblingCancellationPairs(target)) {
    const leftEndpoints = endpointsForChild(left);
    const rightEndpoints = endpointsForChild(right);

    if (sameEndpointSet(sourceEndpoints, leftEndpoints)) {
      return right;
    }

    if (sameEndpointSet(sourceEndpoints, rightEndpoints)) {
      return left;
    }
  }

  return undefined;
}

function endpointsForEdge(edge: PSimplexChildEdgeId): [PSimplexPrimalSourceId, PSimplexPrimalSourceId] {
  return edge.split('') as [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
}

function endpointsForChild(childId: PSimplexChildSourceId): [PSimplexPrimalSourceId, PSimplexPrimalSourceId] {
  return endpointsForEdge(childId.slice(2) as PSimplexChildEdgeId);
}

function childIdForEndpoints(
  left: PSimplexPrimalSourceId,
  right: PSimplexPrimalSourceId,
): PSimplexChildSourceId {
  const sorted = [left, right].sort((a, b) => PRIMAL_ORDER.indexOf(a) - PRIMAL_ORDER.indexOf(b)).join('');

  return `M_${sorted}` as PSimplexChildSourceId;
}

function sharesExactlyOneEndpoint(
  left: [PSimplexPrimalSourceId, PSimplexPrimalSourceId],
  right: [PSimplexPrimalSourceId, PSimplexPrimalSourceId],
): boolean {
  return left.filter((endpoint) => right.includes(endpoint)).length === 1;
}

function sameEndpointSet(
  left: [PSimplexPrimalSourceId, PSimplexPrimalSourceId],
  right: [PSimplexPrimalSourceId, PSimplexPrimalSourceId],
): boolean {
  return left.every((endpoint) => right.includes(endpoint)) && right.every((endpoint) => left.includes(endpoint));
}

function requireTarget(targets: TargetChildRecord[], targetChild: PSimplexChildSourceId): TargetChildRecord {
  const target = targets.find((candidate) => candidate.sourceId === targetChild);

  if (!target) {
    throw new Error(`Missing target child ${targetChild}.`);
  }

  return target;
}

function requireVectorResult(
  rows: PSimplexVectorResultRowV0[],
  sampleId: string,
): PSimplexVectorResultRowV0 {
  const row = rows.find((candidate) => candidate.sampleId === sampleId);

  if (!row) {
    throw new Error(`Missing vector result for ${sampleId}.`);
  }

  return row;
}

function compareSourceRecords(left: SourceRecord, right: SourceRecord): number {
  return sourceOrder(left.sourceId) - sourceOrder(right.sourceId);
}

function sourceOrder(sourceId: PSimplexPrimalSourceId | PSimplexChildSourceId): number {
  if (isPrimalSourceId(sourceId)) {
    return PRIMAL_ORDER.indexOf(sourceId);
  }

  return PRIMAL_ORDER.length + CHILD_ORDER.indexOf(sourceId);
}

function isPrimalSourceId(value: string): value is PSimplexPrimalSourceId {
  return PRIMAL_ORDER.includes(value as PSimplexPrimalSourceId);
}

function isChildSourceId(value: string): value is PSimplexChildSourceId {
  return CHILD_ORDER.includes(value as PSimplexChildSourceId);
}

function cleanWeightRecord(weights: Record<string, number>): Record<string, number> {
  return Object.fromEntries(
    Object.entries(weights)
      .sort(([left], [right]) => sourceOrder(left as PSimplexPrimalSourceId | PSimplexChildSourceId) - sourceOrder(right as PSimplexPrimalSourceId | PSimplexChildSourceId))
      .map(([sourceId, weight]) => [sourceId, cleanNumber(weight)]),
  );
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

function nearlyEqual(left = 0, right = 0): boolean {
  return Math.abs(left - right) <= EPSILON;
}
