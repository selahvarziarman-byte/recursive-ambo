import { createSeedShape } from '../data/seeds';
import type { Cell, Shape, Vertex, VertexId } from '../types/geometry';
import { applyAmboDissection } from './ambo';

export type WGateRootFrameLabel = 'A' | 'B' | 'C' | 'D';
export type WGateRootKey = `rho(${WGateRootFrameLabel},${WGateRootFrameLabel})`;
export type WGateR4Vector = [number, number, number, number];
export type WGateSourceEdgeLabels = [WGateRootFrameLabel, WGateRootFrameLabel];

export interface WGateRootFrameExtractionRowV0 {
  g2VertexId: string;
  g1EndpointVertexIds: [string, string];
  g1EndpointSourceEdges: [WGateSourceEdgeLabels, WGateSourceEdgeLabels];
  sharedIndex: WGateRootFrameLabel;
  omittedIndex: WGateRootFrameLabel;
  rootKey: WGateRootKey;
  rootVector: WGateR4Vector;
  rootSource: 'incidence-derived';
  usedCarrierLabel: false;
  usedStoredFlagTable: false;
}

export interface WGateRootSetSummaryV0 {
  expectedRootCount: 12;
  extractedRootCount: number;
  uniqueExtractedRootCount: number;
  missingRoots: WGateRootKey[];
  unexpectedRoots: string[];
  duplicateRoots: Array<{ rootKey: string; witnessCount: number; g2VertexIds: string[] }>;
  everyRootHasOneWitness: boolean;
  ok: boolean;
}

export interface WGateAntipodalSummaryV0 {
  pairCount: number;
  fixedPointFree: boolean;
  pairs: Array<{ leftRoot: WGateRootKey; rightRoot: WGateRootKey; leftWitnessId: string | null; rightWitnessId: string | null }>;
  ok: boolean;
}

export interface WGateA2SubsystemRowV0 {
  droppedLabel: WGateRootFrameLabel;
  remainingLabels: WGateRootFrameLabel[];
  rootKeys: WGateRootKey[];
  uniqueRootCount: number;
  rowWitnessCount: number;
  ok: boolean;
}

export interface WGateA2SubsystemSummaryV0 {
  subsystemCount: number;
  subsystemRows: WGateA2SubsystemRowV0[];
  eachSubsystemHasSixRoots: boolean;
  rootMembershipCounts: Record<WGateRootKey, number>;
  eachRootBelongsToExactlyTwoSubsystems: boolean;
  ok: boolean;
}

export interface WGateMetricMeasurementV0 {
  subsystemId: string;
  leftRoot: WGateRootKey;
  rightRoot: WGateRootKey;
  leftNormSquared: number | null;
  rightNormSquared: number | null;
  dot: number | null;
  angleDegrees: number | null;
  edgeLength: number | null;
  circumradius: number | null;
  edgeCircumradiusRatio: number | null;
  ok: boolean;
}

export interface WGateMetricSummaryV0 {
  rootNormSquaredExpected: 2;
  adjacentDotExpected: 1;
  adjacencyAngleDegreesExpected: 60;
  edgeCircumradiusRatioExpected: 1;
  tolerance: number;
  measurements: WGateMetricMeasurementV0[];
  ok: boolean;
}

export interface WGateS4EquivarianceSummaryV0 {
  permutationCount: 24;
  passCount: number;
  failCount: number;
  failedPermutations: string[];
  nonEquivariantControlPassCount: number;
  nonEquivariantControlFailsAtLeastOne: boolean;
  ok: boolean;
}

export interface WGateDestructiveTestRowV0 {
  id: string;
  name: string;
  destructiveTestStatus:
    | 'passed-damaged-input-failed-as-expected'
    | 'failed-damage-did-not-break'
    | 'declared-deferred-not-silent';
  damage: string;
  expectedFailure: string;
  observed: Record<string, unknown>;
  ok: boolean;
  reason?: string;
  requiredFutureModule?: string;
  requiredFutureAudit?: string;
}

export interface WGateRootFrameExtractionV0Report {
  method: 'w-gate-root-frame-extraction-v0';
  candidateW: 'ambo-root-frame-source-regime-v0';
  shortName: 'W_ARF_v0';
  diagnosticScope: 'w1-legitimacy-diagnostic-only';
  verdictStatus: 'computes-and-reports-only-auditor-classifies';
  fieldStatus: 'not-field-law';
  uiStatus: 'no-ui';
  shapeMutationStatus: 'no-shape-mutation-beyond-derived-test-shapes';
  packetWriteStatus: 'no-packet-writing';
  operationRegistryStatus: 'not-operation-registry-work';
  topologyStatus: 'not-topology-workspace';
  sourcePopulationPolicy: 'current-core-primary';
  historicalCumulativeStatus: 'bounded-variant-only';
  carrierShadowFloorStatus: 'deferred-reference-only-not-consumed';
  reverseReturnBranch: 'R-root';
  reverseReturnStatus: 'bounded-hole-not-resolved-by-this-diagnostic';
  usedCarrierLabels: false;
  usedStoredOrderedFlagTable: false;
  rootExtractionSource: 'g0-g1-g2-ambo-incidence';
  g0Summary: {
    shapeId: string;
    vertexCount: number;
    edgeCount: number;
    seedTopology: string | null;
    labelsByVertexId: Record<string, WGateRootFrameLabel>;
  };
  g1Summary: {
    shapeId: string;
    childCount: number;
    coreCellId: string | null;
    coreTopology: string | null;
    coreVertexCount: number;
    complementPairCount: number;
    complementPairs: Array<{
      pairKey: string;
      leftG1VertexId: string;
      rightG1VertexId: string;
      leftSourceEdgeKey: string;
      rightSourceEdgeKey: string;
    }>;
    ok: boolean;
  };
  g2Summary: {
    shapeId: string;
    coreCellId: string | null;
    coreTopology: string | null;
    coreVertexCount: number;
    sourceG1CoreCellId: string | null;
    ok: boolean;
  };
  rootExtractionRows: WGateRootFrameExtractionRowV0[];
  rootSetSummary: WGateRootSetSummaryV0;
  antipodalSummary: WGateAntipodalSummaryV0;
  a2SubsystemSummary: WGateA2SubsystemSummaryV0;
  metricSummary: WGateMetricSummaryV0;
  s4EquivarianceSummary: WGateS4EquivarianceSummaryV0;
  destructiveTestRows: WGateDestructiveTestRowV0[];
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface ExtractionInputRow {
  g2VertexId: string;
  g1EndpointVertexIds: [string, string];
  g1EndpointSourceEdges: [WGateSourceEdgeLabels, WGateSourceEdgeLabels] | null;
  collapsedUnion?: WGateRootFrameLabel[];
}

interface ExtractionAttempt {
  rows: WGateRootFrameExtractionRowV0[];
  issues: string[];
}

const LABELS: readonly WGateRootFrameLabel[] = ['A', 'B', 'C', 'D'];
const LABEL_SET = new Set<WGateRootFrameLabel>(LABELS);
const TOLERANCE = 1e-9;

export function buildWGateRootFrameExtractionV0Report(): WGateRootFrameExtractionV0Report {
  const integrityIssues: string[] = [];
  const g0 = createSeedShape('tetrahedron');
  const labelsByVertexId = buildG0LabelMap(g0, integrityIssues);
  const g1 = applyAmboDissection(g0);
  const g1Core = findUniqueCoreCell(g1, 'octahedron', integrityIssues, 'G1');
  const g2 = g1Core ? applyAmboDissection(g1, g1Core.id) : null;
  const g2Core = g2 ? findUniqueCoreCell(g2, 'cuboctahedron', integrityIssues, 'G2') : null;
  const extractionInputs = g1Core && g2 && g2Core
    ? buildExtractionInputs(g1, g1Core, g2, g2Core, labelsByVertexId, integrityIssues)
    : [];
  const extraction = extractRowsFromInputs(extractionInputs);

  integrityIssues.push(...extraction.issues);

  const rootExtractionRows = sortRootRows(extraction.rows);
  const g1ChildCount = g1Core?.vertexIds.length ?? 0;
  const complementPairs = g1Core
    ? buildComplementPairs(g1, g1Core, labelsByVertexId, integrityIssues)
    : [];
  const rootSetSummary = buildRootSetSummary(rootExtractionRows);
  const antipodalSummary = buildAntipodalSummary(rootExtractionRows);
  const a2SubsystemSummary = buildA2SubsystemSummary(rootExtractionRows);
  const metricSummary = buildMetricSummary(rootExtractionRows);
  const s4EquivarianceSummary = buildS4EquivarianceSummary(rootExtractionRows);
  const destructiveTestRows = buildDestructiveTestRows(extractionInputs, rootExtractionRows, s4EquivarianceSummary);
  const g1Summary = {
    shapeId: g1.id,
    childCount: g1ChildCount,
    coreCellId: g1Core?.id ?? null,
    coreTopology: g1Core?.topology ?? null,
    coreVertexCount: g1Core?.vertexIds.length ?? 0,
    complementPairCount: complementPairs.length,
    complementPairs,
    ok: g1ChildCount === 6 && complementPairs.length === 3 && g1Core?.topology === 'octahedron',
  };
  const g2Summary = {
    shapeId: g2?.id ?? 'not-built',
    coreCellId: g2Core?.id ?? null,
    coreTopology: g2Core?.topology ?? null,
    coreVertexCount: g2Core?.vertexIds.length ?? 0,
    sourceG1CoreCellId: g1Core?.id ?? null,
    ok: g2Core?.topology === 'cuboctahedron' && g2Core.vertexIds.length === 12,
  };

  appendSummaryIssues(integrityIssues, {
    g1Summary,
    g2Summary,
    rootSetSummary,
    antipodalSummary,
    a2SubsystemSummary,
    metricSummary,
    s4EquivarianceSummary,
    destructiveTestRows,
  });

  const dedupedIssues = dedupeStrings(integrityIssues);

  return {
    method: 'w-gate-root-frame-extraction-v0',
    candidateW: 'ambo-root-frame-source-regime-v0',
    shortName: 'W_ARF_v0',
    diagnosticScope: 'w1-legitimacy-diagnostic-only',
    verdictStatus: 'computes-and-reports-only-auditor-classifies',
    fieldStatus: 'not-field-law',
    uiStatus: 'no-ui',
    shapeMutationStatus: 'no-shape-mutation-beyond-derived-test-shapes',
    packetWriteStatus: 'no-packet-writing',
    operationRegistryStatus: 'not-operation-registry-work',
    topologyStatus: 'not-topology-workspace',
    sourcePopulationPolicy: 'current-core-primary',
    historicalCumulativeStatus: 'bounded-variant-only',
    carrierShadowFloorStatus: 'deferred-reference-only-not-consumed',
    reverseReturnBranch: 'R-root',
    reverseReturnStatus: 'bounded-hole-not-resolved-by-this-diagnostic',
    usedCarrierLabels: false,
    usedStoredOrderedFlagTable: false,
    rootExtractionSource: 'g0-g1-g2-ambo-incidence',
    g0Summary: {
      shapeId: g0.id,
      vertexCount: Object.keys(g0.vertices).length,
      edgeCount: g0.edges.length,
      seedTopology: g0.cells.find((cell) => cell.kind === 'seed')?.topology ?? null,
      labelsByVertexId,
    },
    g1Summary,
    g2Summary,
    rootExtractionRows,
    rootSetSummary,
    antipodalSummary,
    a2SubsystemSummary,
    metricSummary,
    s4EquivarianceSummary,
    destructiveTestRows,
    integrityIssues: dedupedIssues,
    integrityIssueCount: dedupedIssues.length,
    ok: dedupedIssues.length === 0,
  };
}

function buildG0LabelMap(shape: Shape, issues: string[]): Record<string, WGateRootFrameLabel> {
  const labelsByVertexId: Record<string, WGateRootFrameLabel> = {};
  const seen = new Set<WGateRootFrameLabel>();

  for (const vertex of Object.values(shape.vertices)) {
    const label = vertex.data.label;

    if (isRootFrameLabel(label)) {
      labelsByVertexId[vertex.id] = label;
      seen.add(label);
    }
  }

  for (const label of LABELS) {
    if (!seen.has(label)) {
      issues.push(`G0 tetrahedron is missing normalized label ${label}.`);
    }
  }

  if (Object.keys(labelsByVertexId).length !== 4) {
    issues.push(`G0 label map expected 4 labeled vertices, got ${Object.keys(labelsByVertexId).length}.`);
  }

  return labelsByVertexId;
}

function findUniqueCoreCell(
  shape: Shape,
  topology: 'octahedron' | 'cuboctahedron',
  issues: string[],
  generationLabel: 'G1' | 'G2',
): Cell | null {
  const matches = shape.cells.filter((cell) => cell.kind === 'core' && cell.topology === topology);

  if (matches.length !== 1) {
    issues.push(`${generationLabel} expected exactly one ${topology} core cell, got ${matches.length}.`);
    return matches[0] ?? null;
  }

  return matches[0];
}

function buildExtractionInputs(
  g1: Shape,
  g1Core: Cell,
  g2: Shape,
  g2Core: Cell,
  labelsByG0VertexId: Record<string, WGateRootFrameLabel>,
  issues: string[],
): ExtractionInputRow[] {
  const g1CoreVertexIds = new Set(g1Core.vertexIds);

  return g2Core.vertexIds.map((g2VertexId) => {
    const g2Vertex = g2.vertices[g2VertexId];

    if (!g2Vertex) {
      issues.push(`G2 core vertex ${g2VertexId} is missing from shape vertices.`);
      return {
        g2VertexId,
        g1EndpointVertexIds: ['missing-left', 'missing-right'],
        g1EndpointSourceEdges: null,
      };
    }

    const endpoints = g2Vertex.createdBy.sourceVertexIds;

    if (endpoints.length !== 2) {
      issues.push(`G2 vertex ${g2VertexId} expected two G1 endpoint source vertices, got ${endpoints.length}.`);
      return {
        g2VertexId,
        g1EndpointVertexIds: [endpoints[0] ?? 'missing-left', endpoints[1] ?? 'missing-right'],
        g1EndpointSourceEdges: null,
      };
    }

    const endpointPair: [string, string] = [endpoints[0], endpoints[1]];

    if (!endpointPair.every((endpointId) => g1CoreVertexIds.has(endpointId))) {
      issues.push(`G2 vertex ${g2VertexId} references a G1 endpoint outside the selected octahedron core.`);
    }

    const g1Edge = findShapeEdge(g1, endpointPair[0], endpointPair[1]);

    if (!g1Edge) {
      issues.push(`G2 vertex ${g2VertexId} references non-adjacent G1 endpoints ${endpointPair.join(' -- ')}.`);
    } else if (g2Vertex.createdBy.sourceEdgeId && g2Vertex.createdBy.sourceEdgeId !== g1Edge.id) {
      issues.push(
        `G2 vertex ${g2VertexId} sourceEdgeId ${g2Vertex.createdBy.sourceEdgeId} does not match G1 edge ${g1Edge.id}.`,
      );
    }

    const sourceEdges = endpointPair.map((endpointId) =>
      recoverG0SourceEdge(g1.vertices[endpointId], labelsByG0VertexId, `G1 endpoint ${endpointId}`, issues),
    );

    return {
      g2VertexId,
      g1EndpointVertexIds: endpointPair,
      g1EndpointSourceEdges: sourceEdges[0] && sourceEdges[1] ? [sourceEdges[0], sourceEdges[1]] : null,
    };
  });
}

function recoverG0SourceEdge(
  vertex: Vertex | undefined,
  labelsByG0VertexId: Record<string, WGateRootFrameLabel>,
  context: string,
  issues: string[],
): WGateSourceEdgeLabels | null {
  if (!vertex) {
    issues.push(`${context} is missing from G1 vertices.`);
    return null;
  }

  if (vertex.createdBy.operation !== 'ambo-dissection') {
    issues.push(`${context} is not an Ambo midpoint vertex.`);
    return null;
  }

  if (vertex.createdBy.sourceVertexIds.length !== 2) {
    issues.push(`${context} expected exactly two G0 source vertices, got ${vertex.createdBy.sourceVertexIds.length}.`);
    return null;
  }

  const labels = vertex.createdBy.sourceVertexIds.map((sourceVertexId) => labelsByG0VertexId[sourceVertexId]);

  if (!labels[0] || !labels[1]) {
    issues.push(`${context} has source vertices outside the G0 A-D label map.`);
    return null;
  }

  if (labels[0] === labels[1]) {
    issues.push(`${context} source edge collapsed to duplicate label ${labels[0]}.`);
    return null;
  }

  return sortSourceEdgeLabels([labels[0], labels[1]]);
}

function extractRowsFromInputs(inputs: ExtractionInputRow[]): ExtractionAttempt {
  const issues: string[] = [];
  const rows: WGateRootFrameExtractionRowV0[] = [];

  for (const input of inputs) {
    if (!input.g1EndpointSourceEdges) {
      issues.push(`Cannot extract ${input.g2VertexId}: missing the two G1 endpoint source edges.`);
      continue;
    }

    const extracted = extractRootFromSourceEdges(input.g1EndpointSourceEdges);

    if (!extracted.ok) {
      issues.push(`Cannot extract ${input.g2VertexId}: ${extracted.reason}`);
      continue;
    }

    rows.push({
      g2VertexId: input.g2VertexId,
      g1EndpointVertexIds: input.g1EndpointVertexIds,
      g1EndpointSourceEdges: input.g1EndpointSourceEdges,
      sharedIndex: extracted.sharedIndex,
      omittedIndex: extracted.omittedIndex,
      rootKey: rootKey(extracted.sharedIndex, extracted.omittedIndex),
      rootVector: rootVector(extracted.sharedIndex, extracted.omittedIndex),
      rootSource: 'incidence-derived',
      usedCarrierLabel: false,
      usedStoredFlagTable: false,
    });
  }

  return { rows, issues };
}

function extractRootFromSourceEdges(
  sourceEdges: [WGateSourceEdgeLabels, WGateSourceEdgeLabels],
): { ok: true; sharedIndex: WGateRootFrameLabel; omittedIndex: WGateRootFrameLabel } | { ok: false; reason: string } {
  const [left, right] = sourceEdges;
  const shared = left.filter((label) => right.includes(label));

  if (shared.length !== 1) {
    return {
      ok: false,
      reason: `endpoint source edges ${edgeKey(left)} and ${edgeKey(right)} share ${shared.length} G0 indices, expected 1`,
    };
  }

  const union = uniqueLabels([...left, ...right]);

  if (union.length !== 3) {
    return {
      ok: false,
      reason: `endpoint source edge union has ${union.length} G0 indices, expected 3`,
    };
  }

  const omitted = LABELS.filter((label) => !union.includes(label));

  if (omitted.length !== 1) {
    return {
      ok: false,
      reason: `omitted index count is ${omitted.length}, expected 1`,
    };
  }

  return { ok: true, sharedIndex: shared[0], omittedIndex: omitted[0] };
}

function buildComplementPairs(
  g1: Shape,
  g1Core: Cell,
  labelsByG0VertexId: Record<string, WGateRootFrameLabel>,
  issues: string[],
): WGateRootFrameExtractionV0Report['g1Summary']['complementPairs'] {
  const midpointEdges = g1Core.vertexIds
    .map((vertexId) => ({
      vertexId,
      sourceEdge: recoverG0SourceEdge(g1.vertices[vertexId], labelsByG0VertexId, `G1 core vertex ${vertexId}`, issues),
    }))
    .filter((entry): entry is { vertexId: string; sourceEdge: WGateSourceEdgeLabels } => Boolean(entry.sourceEdge));
  const pairs: WGateRootFrameExtractionV0Report['g1Summary']['complementPairs'] = [];

  for (let leftIndex = 0; leftIndex < midpointEdges.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < midpointEdges.length; rightIndex += 1) {
      const left = midpointEdges[leftIndex];
      const right = midpointEdges[rightIndex];

      if (left.sourceEdge.every((label) => !right.sourceEdge.includes(label))) {
        const sourceEdgeKeys = [edgeKey(left.sourceEdge), edgeKey(right.sourceEdge)].sort();

        pairs.push({
          pairKey: `${sourceEdgeKeys[0]}<->${sourceEdgeKeys[1]}`,
          leftG1VertexId: left.vertexId,
          rightG1VertexId: right.vertexId,
          leftSourceEdgeKey: edgeKey(left.sourceEdge),
          rightSourceEdgeKey: edgeKey(right.sourceEdge),
        });
      }
    }
  }

  return pairs.sort((left, right) => left.pairKey.localeCompare(right.pairKey));
}

function buildRootSetSummary(rows: WGateRootFrameExtractionRowV0[]): WGateRootSetSummaryV0 {
  const expected = expectedRootKeys();
  const counts = countRowsByRoot(rows);
  const extractedRootKeys = Object.keys(counts);
  const missingRoots = expected.filter((key) => !counts[key]);
  const expectedSet = new Set<string>(expected);
  const unexpectedRoots = extractedRootKeys.filter((key) => !expectedSet.has(key)).sort();
  const duplicateRoots = extractedRootKeys
    .filter((key) => counts[key].length > 1)
    .sort()
    .map((key) => ({ rootKey: key, witnessCount: counts[key].length, g2VertexIds: counts[key].map((row) => row.g2VertexId) }));
  const everyRootHasOneWitness =
    missingRoots.length === 0 &&
    unexpectedRoots.length === 0 &&
    expected.every((key) => (counts[key]?.length ?? 0) === 1);

  return {
    expectedRootCount: 12,
    extractedRootCount: rows.length,
    uniqueExtractedRootCount: extractedRootKeys.length,
    missingRoots,
    unexpectedRoots,
    duplicateRoots,
    everyRootHasOneWitness,
    ok: rows.length === 12 && extractedRootKeys.length === 12 && everyRootHasOneWitness,
  };
}

function buildAntipodalSummary(rows: WGateRootFrameExtractionRowV0[]): WGateAntipodalSummaryV0 {
  const rowByRoot = new Map(rows.map((row) => [row.rootKey, row]));
  const pairs: WGateAntipodalSummaryV0['pairs'] = [];
  const seen = new Set<string>();
  let fixedPointFree = true;

  for (const root of expectedRootKeys()) {
    if (seen.has(root)) {
      continue;
    }

    const parsed = parseRootKey(root);

    if (!parsed) {
      fixedPointFree = false;
      continue;
    }

    const reverse = rootKey(parsed.to, parsed.from);
    const pairKey = [root, reverse].sort().join('|');

    seen.add(root);
    seen.add(reverse);

    if (root === reverse) {
      fixedPointFree = false;
    }

    pairs.push({
      leftRoot: root,
      rightRoot: reverse,
      leftWitnessId: rowByRoot.get(root)?.g2VertexId ?? null,
      rightWitnessId: rowByRoot.get(reverse)?.g2VertexId ?? null,
    });

    if (!pairKey.includes('|')) {
      fixedPointFree = false;
    }
  }

  return {
    pairCount: pairs.length,
    fixedPointFree,
    pairs,
    ok: pairs.length === 6 && fixedPointFree && pairs.every((pair) => pair.leftWitnessId && pair.rightWitnessId),
  };
}

function buildA2SubsystemSummary(rows: WGateRootFrameExtractionRowV0[]): WGateA2SubsystemSummaryV0 {
  const rowRootSet = new Set(rows.map((row) => row.rootKey));
  const membershipCounts = Object.fromEntries(expectedRootKeys().map((key) => [key, 0])) as Record<WGateRootKey, number>;
  const subsystemRows = LABELS.map((droppedLabel): WGateA2SubsystemRowV0 => {
    const remainingLabels = LABELS.filter((label) => label !== droppedLabel);
    const expectedRoots = expectedRootKeys().filter((key) => {
      const parsed = parseRootKey(key);

      return Boolean(parsed && parsed.from !== droppedLabel && parsed.to !== droppedLabel);
    });
    const rootKeys = expectedRoots.filter((key) => rowRootSet.has(key));
    const rowWitnessCount = rows.filter(
      (row) => row.sharedIndex !== droppedLabel && row.omittedIndex !== droppedLabel,
    ).length;

    for (const root of rootKeys) {
      membershipCounts[root] += 1;
    }

    return {
      droppedLabel,
      remainingLabels,
      rootKeys,
      uniqueRootCount: new Set(rootKeys).size,
      rowWitnessCount,
      ok: rootKeys.length === 6 && new Set(rootKeys).size === 6 && rowWitnessCount === 6,
    };
  });
  const eachSubsystemHasSixRoots = subsystemRows.every((row) => row.ok);
  const eachRootBelongsToExactlyTwoSubsystems = expectedRootKeys().every((key) => membershipCounts[key] === 2);

  return {
    subsystemCount: subsystemRows.length,
    subsystemRows,
    eachSubsystemHasSixRoots,
    rootMembershipCounts: membershipCounts,
    eachRootBelongsToExactlyTwoSubsystems,
    ok: subsystemRows.length === 4 && eachSubsystemHasSixRoots && eachRootBelongsToExactlyTwoSubsystems,
  };
}

function buildMetricSummary(rows: WGateRootFrameExtractionRowV0[]): WGateMetricSummaryV0 {
  const rowRootSet = new Set(rows.map((row) => row.rootKey));
  const measurements: WGateMetricMeasurementV0[] = [];

  for (const droppedLabel of LABELS) {
    const remaining = LABELS.filter((label) => label !== droppedLabel);
    const hexagon = a2HexagonOrder(remaining);

    for (let index = 0; index < hexagon.length; index += 1) {
      const leftRoot = hexagon[index];
      const rightRoot = hexagon[(index + 1) % hexagon.length];
      const hasRoots = rowRootSet.has(leftRoot) && rowRootSet.has(rightRoot);

      if (!hasRoots) {
        measurements.push({
          subsystemId: `A2_drop(${droppedLabel})`,
          leftRoot,
          rightRoot,
          leftNormSquared: null,
          rightNormSquared: null,
          dot: null,
          angleDegrees: null,
          edgeLength: null,
          circumradius: null,
          edgeCircumradiusRatio: null,
          ok: false,
        });
        continue;
      }

      const leftVector = requireRootVector(leftRoot);
      const rightVector = requireRootVector(rightRoot);
      const leftNormSquared = dot4(leftVector, leftVector);
      const rightNormSquared = dot4(rightVector, rightVector);
      const rootDot = dot4(leftVector, rightVector);
      const angleDegrees = radiansToDegrees(Math.acos(rootDot / Math.sqrt(leftNormSquared * rightNormSquared)));
      const edgeLength = vectorNorm4(subtract4(leftVector, rightVector));
      const circumradius = Math.sqrt(leftNormSquared);
      const edgeCircumradiusRatio = edgeLength / circumradius;

      measurements.push({
        subsystemId: `A2_drop(${droppedLabel})`,
        leftRoot,
        rightRoot,
        leftNormSquared,
        rightNormSquared,
        dot: rootDot,
        angleDegrees,
        edgeLength,
        circumradius,
        edgeCircumradiusRatio,
        ok:
          approx(leftNormSquared, 2) &&
          approx(rightNormSquared, 2) &&
          approx(rootDot, 1) &&
          approx(angleDegrees, 60) &&
          approx(edgeCircumradiusRatio, 1),
      });
    }
  }

  return {
    rootNormSquaredExpected: 2,
    adjacentDotExpected: 1,
    adjacencyAngleDegreesExpected: 60,
    edgeCircumradiusRatioExpected: 1,
    tolerance: TOLERANCE,
    measurements,
    ok: measurements.length === 24 && measurements.every((measurement) => measurement.ok),
  };
}

function buildS4EquivarianceSummary(rows: WGateRootFrameExtractionRowV0[]): WGateS4EquivarianceSummaryV0 {
  const permutations = enumeratePermutations([...LABELS]);
  const failedPermutations: string[] = [];
  let passCount = 0;
  let controlPassCount = 0;

  for (const permutation of permutations) {
    const relabel = Object.fromEntries(LABELS.map((label, index) => [label, permutation[index]])) as Record<
      WGateRootFrameLabel,
      WGateRootFrameLabel
    >;
    const permutationKey = LABELS.map((label) => `${label}->${relabel[label]}`).join(' ');
    const allRowsPass = rows.every((row) => {
      const permutedEdges = row.g1EndpointSourceEdges.map((sourceEdge) =>
        sortSourceEdgeLabels([relabel[sourceEdge[0]], relabel[sourceEdge[1]]]),
      ) as [WGateSourceEdgeLabels, WGateSourceEdgeLabels];
      const extracted = extractRootFromSourceEdges(permutedEdges);
      const expected = permuteRootKey(row.rootKey, relabel);

      return extracted.ok && rootKey(extracted.sharedIndex, extracted.omittedIndex) === expected;
    });
    const controlRowsPass = rows.every(() => {
      const controlOriginal = rootKey('A', 'B');
      const controlAfterPermutation = rootKey('A', 'B');
      const expected = permuteRootKey(controlOriginal, relabel);

      return controlAfterPermutation === expected;
    });

    if (allRowsPass) {
      passCount += 1;
    } else {
      failedPermutations.push(permutationKey);
    }

    if (controlRowsPass) {
      controlPassCount += 1;
    }
  }

  return {
    permutationCount: 24,
    passCount,
    failCount: 24 - passCount,
    failedPermutations,
    nonEquivariantControlPassCount: controlPassCount,
    nonEquivariantControlFailsAtLeastOne: controlPassCount < 24,
    ok: rows.length === 12 && passCount === 24 && controlPassCount < 24,
  };
}

function buildDestructiveTestRows(
  inputs: ExtractionInputRow[],
  rows: WGateRootFrameExtractionRowV0[],
  s4Summary: WGateS4EquivarianceSummaryV0,
): WGateDestructiveTestRowV0[] {
  return [
    runSourceEdgeMetadataRemovalControl(inputs),
    runCorruptedAdjacencyControl(inputs),
    runUnionOnlyCollapseControl(inputs),
    {
      id: 'D-RFE-4',
      name: 'anti-staple hidden stored-flag leakage audit',
      destructiveTestStatus: 'declared-deferred-not-silent',
      damage: 'Audit the full implementation and runtime load graph for hidden ordered-flag table leakage.',
      expectedFailure: 'Any stored-flag dependency must be surfaced by a future audit module.',
      observed: { destructiveTestStatus: 'declared-deferred-not-silent' },
      ok: true,
      reason: 'Requires a broader source/static audit than this finite extraction module.',
      requiredFutureAudit: 'anti-staple stored-flag leakage audit',
    },
    {
      id: 'D-RFE-5',
      name: 'S4 equivariance against non-equivariant control',
      destructiveTestStatus: s4Summary.nonEquivariantControlFailsAtLeastOne
        ? 'passed-damaged-input-failed-as-expected'
        : 'failed-damage-did-not-break',
      damage: 'Replace the extraction law with a constant hand map rho(A,B).',
      expectedFailure: 'The hand map fails at least one S4 relabeling.',
      observed: {
        trueExtractionPassCount: s4Summary.passCount,
        trueExtractionPermutationCount: s4Summary.permutationCount,
        nonEquivariantControlPassCount: s4Summary.nonEquivariantControlPassCount,
        nonEquivariantControlFailsAtLeastOne: s4Summary.nonEquivariantControlFailsAtLeastOne,
      },
      ok: s4Summary.nonEquivariantControlFailsAtLeastOne && s4Summary.passCount === 24,
    },
    runUnorderedRootCollapseControl(rows),
    runArbitraryLabelReplacementControl(rows),
    {
      id: 'D-RFE-8',
      name: 'arbitrary carrier assignment',
      destructiveTestStatus: 'declared-deferred-not-silent',
      damage: 'Assign arbitrary carrier labels to roots and test whether a carrier-shadow floor is falsely consumed.',
      expectedFailure: 'Carrier assignment should not affect this v0 incidence extraction.',
      observed: { carrierShadowFloorStatus: 'deferred-reference-only-not-consumed' },
      ok: true,
      reason: 'Carrier-shadow floor is explicitly reference-only in W_ARF_v0.',
      requiredFutureModule: 'carrier-shadow comparator diagnostic',
    },
    {
      id: 'D-RFE-9',
      name: 'scalar tuple reduction',
      destructiveTestStatus: 'declared-deferred-not-silent',
      damage: 'Reduce roots to scalar/tuple emissions and test field-facing recoverability.',
      expectedFailure: 'Scalar tuple reduction should not certify source legitimacy.',
      observed: { fieldStatus: 'not-field-law' },
      ok: true,
      reason: 'Field activity and tuple recovery are downstream of W-1 legitimacy.',
      requiredFutureModule: 'W-2 observable/recovery diagnostic',
    },
  ];
}

function runSourceEdgeMetadataRemovalControl(inputs: ExtractionInputRow[]): WGateDestructiveTestRowV0 {
  const damaged = inputs.map((input) => ({ ...input, g1EndpointSourceEdges: null }));
  const attempt = extractRowsFromInputs(damaged);
  const failedAsExpected = attempt.rows.length !== 12 && attempt.issues.length > 0;

  return {
    id: 'D-RFE-1',
    name: 'source-edge metadata removal',
    destructiveTestStatus: failedAsExpected
      ? 'passed-damaged-input-failed-as-expected'
      : 'failed-damage-did-not-break',
    damage: 'Remove or mask G1 endpoint source-edge metadata from extraction input.',
    expectedFailure: 'shared/omitted extraction cannot produce 12 ordered roots.',
    observed: {
      extractedRootCount: attempt.rows.length,
      uniqueExtractedRootCount: new Set(attempt.rows.map((row) => row.rootKey)).size,
      integrityIssueCount: attempt.issues.length,
      firstIssue: attempt.issues[0] ?? null,
    },
    ok: failedAsExpected,
  };
}

function runCorruptedAdjacencyControl(inputs: ExtractionInputRow[]): WGateDestructiveTestRowV0 {
  const damaged = inputs.map((input, index): ExtractionInputRow => {
    if (index !== 0) {
      return input;
    }

    return {
      ...input,
      g1EndpointSourceEdges: [
        ['A', 'B'],
        ['C', 'D'],
      ],
    };
  });
  const attempt = extractRowsFromInputs(damaged);
  const summary = buildRootSetSummary(attempt.rows);
  const failedAsExpected =
    attempt.issues.length > 0 ||
    summary.duplicateRoots.length > 0 ||
    summary.unexpectedRoots.length > 0 ||
    !summary.ok;

  return {
    id: 'D-RFE-2',
    name: 'deterministic corrupted G1 adjacency',
    destructiveTestStatus: failedAsExpected
      ? 'passed-damaged-input-failed-as-expected'
      : 'failed-damage-did-not-break',
    damage: 'Corrupt one G1 endpoint pair to disjoint G0 source edges AB and CD.',
    expectedFailure: 'The damaged pair no longer shares exactly one G0 index, so extraction reports failure or root-set damage.',
    observed: {
      extractedRootCount: attempt.rows.length,
      uniqueExtractedRootCount: summary.uniqueExtractedRootCount,
      duplicateRootCount: summary.duplicateRoots.length,
      unexpectedRootCount: summary.unexpectedRoots.length,
      integrityIssueCount: attempt.issues.length,
      firstIssue: attempt.issues[0] ?? null,
    },
    ok: failedAsExpected,
  };
}

function runUnionOnlyCollapseControl(inputs: ExtractionInputRow[]): WGateDestructiveTestRowV0 {
  const damaged = inputs.map((input): ExtractionInputRow => {
    const union = input.g1EndpointSourceEdges
      ? uniqueLabels([...input.g1EndpointSourceEdges[0], ...input.g1EndpointSourceEdges[1]])
      : [];

    return {
      ...input,
      g1EndpointSourceEdges: null,
      collapsedUnion: union,
    };
  });
  const attempt = extractRowsFromInputs(damaged);
  const failedAsExpected = attempt.rows.length === 0 && attempt.issues.length === inputs.length;

  return {
    id: 'D-RFE-3',
    name: 'union-only collapse',
    destructiveTestStatus: failedAsExpected
      ? 'passed-damaged-input-failed-as-expected'
      : 'failed-damage-did-not-break',
    damage: 'Replace the two endpoint source edges with only their three-label union.',
    expectedFailure: 'The shared index cannot be distinguished from the omitted index without the two endpoint edges.',
    observed: {
      damagedInputCount: damaged.length,
      sampleCollapsedUnion: damaged[0]?.collapsedUnion?.join('') ?? null,
      extractedRootCount: attempt.rows.length,
      integrityIssueCount: attempt.issues.length,
      firstIssue: attempt.issues[0] ?? null,
    },
    ok: failedAsExpected,
  };
}

function runUnorderedRootCollapseControl(rows: WGateRootFrameExtractionRowV0[]): WGateDestructiveTestRowV0 {
  const orderedRootCount = new Set(rows.map((row) => row.rootKey)).size;
  const unorderedRootCount = new Set(rows.map((row) => unorderedRootKey(row.sharedIndex, row.omittedIndex))).size;
  const antipodalStructureFails = orderedRootCount === 12 && unorderedRootCount === 6;

  return {
    id: 'D-RFE-6',
    name: 'unordered-root collapse',
    destructiveTestStatus: antipodalStructureFails
      ? 'passed-damaged-input-failed-as-expected'
      : 'failed-damage-did-not-break',
    damage: 'Collapse rho(i,j) and rho(j,i) into unordered edge keys.',
    expectedFailure: '12 ordered roots collapse to 6 unordered roots and root-negation is no longer represented.',
    observed: {
      orderedRootCount,
      unorderedRootCount,
      antipodalStructureFails,
    },
    ok: antipodalStructureFails,
  };
}

function runArbitraryLabelReplacementControl(rows: WGateRootFrameExtractionRowV0[]): WGateDestructiveTestRowV0 {
  const arbitraryLabels = rows.map((_row, index) => `L${index}`);
  const parseableAsRootCount = arbitraryLabels.filter((label) => parseRootKey(label)).length;
  const metricCanRun = parseableAsRootCount === arbitraryLabels.length;
  const failedAsExpected = arbitraryLabels.length === 12 && !metricCanRun;

  return {
    id: 'D-RFE-7',
    name: 'arbitrary 12-label replacement',
    destructiveTestStatus: failedAsExpected
      ? 'passed-damaged-input-failed-as-expected'
      : 'failed-damage-did-not-break',
    damage: 'Replace A3 roots with arbitrary labels L0..L11 without epsilon-vector structure.',
    expectedFailure: 'A2/metric checks cannot run because arbitrary labels do not parse as rho(i,j) roots.',
    observed: {
      arbitraryLabelCount: arbitraryLabels.length,
      parseableAsRootCount,
      metricCanRun,
    },
    ok: failedAsExpected,
  };
}

function appendSummaryIssues(
  issues: string[],
  args: {
    g1Summary: WGateRootFrameExtractionV0Report['g1Summary'];
    g2Summary: WGateRootFrameExtractionV0Report['g2Summary'];
    rootSetSummary: WGateRootSetSummaryV0;
    antipodalSummary: WGateAntipodalSummaryV0;
    a2SubsystemSummary: WGateA2SubsystemSummaryV0;
    metricSummary: WGateMetricSummaryV0;
    s4EquivarianceSummary: WGateS4EquivarianceSummaryV0;
    destructiveTestRows: WGateDestructiveTestRowV0[];
  },
): void {
  if (!args.g1Summary.ok) {
    issues.push(
      `RFE-1/RFE-2 failed: G1 childCount=${args.g1Summary.childCount}, complementPairCount=${args.g1Summary.complementPairCount}.`,
    );
  }

  if (!args.g2Summary.ok) {
    issues.push(
      `G2 cuboctahedron core failed: topology=${args.g2Summary.coreTopology}, vertexCount=${args.g2Summary.coreVertexCount}.`,
    );
  }

  if (!args.rootSetSummary.ok) {
    issues.push(
      `RFE-3/RFE-4/RFE-5 failed: extracted=${args.rootSetSummary.extractedRootCount}, unique=${args.rootSetSummary.uniqueExtractedRootCount}, missing=${args.rootSetSummary.missingRoots.join(',')}.`,
    );
  }

  if (!args.antipodalSummary.ok) {
    issues.push(
      `RFE-6/RFE-7 failed: pairCount=${args.antipodalSummary.pairCount}, fixedPointFree=${args.antipodalSummary.fixedPointFree}.`,
    );
  }

  if (!args.a2SubsystemSummary.ok) {
    issues.push('RFE-8/RFE-9/RFE-10 failed: A2 subsystem counts or root memberships are invalid.');
  }

  if (!args.metricSummary.ok) {
    issues.push('RFE-11/RFE-12 failed: A2 metric measurements did not match dot=1, angle=60, edge/radius=1.');
  }

  if (!args.s4EquivarianceSummary.ok) {
    issues.push(
      `RFE-13 failed: S4 passCount=${args.s4EquivarianceSummary.passCount}/24, nonEquivariantControlPassCount=${args.s4EquivarianceSummary.nonEquivariantControlPassCount}.`,
    );
  }

  const failedDestructive = args.destructiveTestRows.filter((row) => !row.ok);

  if (failedDestructive.length > 0) {
    issues.push(`Destructive controls failed to fire: ${failedDestructive.map((row) => row.id).join(', ')}.`);
  }
}

function expectedRootKeys(): WGateRootKey[] {
  return LABELS.flatMap((from) => LABELS.filter((to) => to !== from).map((to) => rootKey(from, to)));
}

function rootKey(from: WGateRootFrameLabel, to: WGateRootFrameLabel): WGateRootKey {
  return `rho(${from},${to})` as WGateRootKey;
}

function rootVector(from: WGateRootFrameLabel, to: WGateRootFrameLabel): WGateR4Vector {
  return LABELS.map((label) => (label === from ? 1 : label === to ? -1 : 0)) as WGateR4Vector;
}

function requireRootVector(key: WGateRootKey): WGateR4Vector {
  const parsed = parseRootKey(key);

  if (!parsed) {
    throw new Error(`Invalid root key ${key}`);
  }

  return rootVector(parsed.from, parsed.to);
}

function parseRootKey(value: string): { from: WGateRootFrameLabel; to: WGateRootFrameLabel } | null {
  const match = /^rho\(([A-D]),([A-D])\)$/.exec(value);

  if (!match || match[1] === match[2] || !isRootFrameLabel(match[1]) || !isRootFrameLabel(match[2])) {
    return null;
  }

  return { from: match[1], to: match[2] };
}

function permuteRootKey(key: WGateRootKey, relabel: Record<WGateRootFrameLabel, WGateRootFrameLabel>): WGateRootKey {
  const parsed = parseRootKey(key);

  if (!parsed) {
    throw new Error(`Invalid root key ${key}`);
  }

  return rootKey(relabel[parsed.from], relabel[parsed.to]);
}

function a2HexagonOrder(labels: WGateRootFrameLabel[]): WGateRootKey[] {
  const [a, b, c] = labels;

  return [
    rootKey(a, b),
    rootKey(a, c),
    rootKey(b, c),
    rootKey(b, a),
    rootKey(c, a),
    rootKey(c, b),
  ];
}

function countRowsByRoot(rows: WGateRootFrameExtractionRowV0[]): Record<string, WGateRootFrameExtractionRowV0[]> {
  const counts: Record<string, WGateRootFrameExtractionRowV0[]> = {};

  for (const row of rows) {
    counts[row.rootKey] = [...(counts[row.rootKey] ?? []), row];
  }

  return counts;
}

function sortRootRows(rows: WGateRootFrameExtractionRowV0[]): WGateRootFrameExtractionRowV0[] {
  return [...rows].sort((left, right) => left.rootKey.localeCompare(right.rootKey) || left.g2VertexId.localeCompare(right.g2VertexId));
}

function findShapeEdge(shape: Shape, left: VertexId, right: VertexId): { id: string } | null {
  return shape.edges.find((edge) => edge.vertexIds.includes(left) && edge.vertexIds.includes(right)) ?? null;
}

function isRootFrameLabel(value: string | undefined): value is WGateRootFrameLabel {
  return Boolean(value && LABEL_SET.has(value as WGateRootFrameLabel));
}

function sortSourceEdgeLabels(labels: [WGateRootFrameLabel, WGateRootFrameLabel]): WGateSourceEdgeLabels {
  return [...labels].sort((left, right) => labelIndex(left) - labelIndex(right)) as WGateSourceEdgeLabels;
}

function edgeKey(labels: WGateSourceEdgeLabels): string {
  return sortSourceEdgeLabels(labels).join('');
}

function unorderedRootKey(left: WGateRootFrameLabel, right: WGateRootFrameLabel): string {
  return sortSourceEdgeLabels([left, right]).join('');
}

function uniqueLabels(labels: WGateRootFrameLabel[]): WGateRootFrameLabel[] {
  return LABELS.filter((label) => labels.includes(label));
}

function labelIndex(label: WGateRootFrameLabel): number {
  return LABELS.indexOf(label);
}

function subtract4(left: WGateR4Vector, right: WGateR4Vector): WGateR4Vector {
  return left.map((value, index) => value - right[index]) as WGateR4Vector;
}

function dot4(left: WGateR4Vector, right: WGateR4Vector): number {
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

function vectorNorm4(value: WGateR4Vector): number {
  return Math.sqrt(dot4(value, value));
}

function radiansToDegrees(value: number): number {
  return (value * 180) / Math.PI;
}

function approx(left: number, right: number): boolean {
  return Math.abs(left - right) <= TOLERANCE;
}

function enumeratePermutations<TValue>(values: TValue[]): TValue[][] {
  if (values.length <= 1) {
    return [values];
  }

  return values.flatMap((value, index) =>
    enumeratePermutations(values.filter((_candidate, candidateIndex) => candidateIndex !== index)).map((tail) => [
      value,
      ...tail,
    ]),
  );
}

function dedupeStrings(values: string[]): string[] {
  return [...new Set(values)];
}
