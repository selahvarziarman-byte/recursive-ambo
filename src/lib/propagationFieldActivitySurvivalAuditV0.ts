import {
  buildFanoOctonionicCarrierGraphFieldV0Report,
  type FanoCarrierGraphChildNodeRow,
  type FanoCarrierGraphEdgeRow,
  type FanoCarrierGraphNodeRow,
  type FanoCarrierGraphPrimalNodeRow,
} from './fanoOctonionicCarrierGraphFieldV0';
import {
  buildFanoOctonionicSpatialSupportProjectionV0Report,
  type FanoFieldContributionSampleRow,
  type FanoSpatialSamplePointRow,
} from './fanoOctonionicSpatialSupportProjectionV0';
import {
  buildFanoOctonionicGenerationalFieldUpdateV0Report,
} from './fanoOctonionicGenerationalFieldUpdateV0';
import {
  buildPythagoreanTetrachordQuarkRegimeV0Report,
  type PythagoreanTetrachordChildDerivationRecord,
  type PythagoreanTetrachordPrimalSourceRecord,
} from './fieldSourcePythagoreanTetrachordQuarkRegimeV0';
import { createSeedShape } from '../data/seeds';
import { applyAmboDissection } from './ambo';
import { buildFieldSources, sampleFieldAtPoint } from './fieldSampler';
import type { Shape, Vec3 } from '../types/geometry';

/**
 * Station IV-A, Run 2 -- propagation / field-activity survival audit (diagnostic-only).
 *
 * Computes and reports raw recovery numbers and control distributions for each
 * fiber relation, per field-facing basis, under observable-only blinding.
 * Assigns NO Gate C.5 status, compares to NO threshold, imports NO upstream
 * reference law. The auditor classifies against a hash-committed sealed rule
 * this module does not see.
 *
 * Consumes READ-ONLY: F1 carrier graph field, F2 spatial support projection,
 * G0 generational field update, the Pythagorean tetrachord quark regime, the
 * seed/ambo geometry, and the legacy fieldSampler kernel. Consumes NOTHING
 * from source-state reports (sss / mp / hub capsule / survival audits): the
 * structural channel of Basis-S is recomputed from F1+F2 field data only --
 * consuming a source-state report to "find" structure in the field is this
 * station's mock-solution failure mode.
 */

export const PROPAGATION_AUDIT_METHOD =
  'propagation-field-activity-survival-audit-v0' as const;

export const PROPAGATION_AUDIT_DECLARED_GATE = {
  declaredPath: 'C:\\Dev\\202cl\\PlatonicEngine202',
  declaredBranch: 'Claude-child',
  declaredHeadAtAuthoring: '984a4db',
  anchorHead: '513b1a2',
  decoyPathNotCampaignTree: 'C:\\Dev\\PlatonicEngine',
} as const;

export const PROPAGATION_AUDIT_SEED = 20260611 as const;
export const PROPAGATION_AUDIT_CONTROL_DRAWS = 64 as const;

export type PropagationAuditRelationId =
  | 'carrier-ray-antipodal-axis'
  | 'signed-fano-lift'
  | 'triangle-closure'
  | 'square-holonomy'
  | 'ordered-flag-identity'
  | 'orientation-sign'
  | 'provenance-route-tetra-g2-core'
  | 'provenance-route-octa-g1'
  | 'provenance-route-cube-g1-dual'
  | 'cube-primal-sourcehood-boundary';

export const PROPAGATION_AUDIT_RELATION_IDS: PropagationAuditRelationId[] = [
  'carrier-ray-antipodal-axis',
  'signed-fano-lift',
  'triangle-closure',
  'square-holonomy',
  'ordered-flag-identity',
  'orientation-sign',
  'provenance-route-tetra-g2-core',
  'provenance-route-octa-g1',
  'provenance-route-cube-g1-dual',
  'cube-primal-sourcehood-boundary',
];

export type PropagationAuditBasisId =
  | 'basis-s-structural-channel-recomputed-from-f1-f2'
  | 'basis-r-raw-scalar-field-legacy'
  | 'basis-d-depropagation-sealed-transforms';

export const PROPAGATION_AUDIT_BASIS_IDS: PropagationAuditBasisId[] = [
  'basis-s-structural-channel-recomputed-from-f1-f2',
  'basis-r-raw-scalar-field-legacy',
  'basis-d-depropagation-sealed-transforms',
];

/** Sealed depropagation transforms, verbatim from the Station IV-A order. */
export const SEALED_DEPROPAGATION_TRANSFORMS = {
  tAxis:
    'T_axis (antipodal-axis): center the raw position cloud (subtract centroid); antipodal partner of x := argmin_y ||x + y||; recovered axis := normalize(x - y).',
  tLift:
    'T_lift (signed-fano-lift): per site, from the field-emitted coefficient vector over the imaginary units, recovered unit := argmax_k |coeff_k|, recovered sign := sign(Re coeff_k).',
  tFlag:
    'T_flag (ordered-flag-identity): from the recovered anchor a, solve a = u_i - u_j over the fixed octa face-normal frame {u_1..u_4}; (i,j) := the unique exact-match pair.',
  tClo:
    'T_clo (triangle-closure): left-assoc product of T_lift over each triangle\'s three sites.',
  tHol:
    'T_hol (square-holonomy): left-assoc product of T_lift around each square cycle.',
  tOri:
    'T_ori (orientation-sign): sign of the scalar triple product of the three triangle anchors.',
} as const;

export const CUBE_DUAL_PROVENANCE_WORDING =
  'cube-g1-as-cuboctahedral-medial-object-via-dual-provenance-only' as const;

export interface PropagationAuditVisibleField {
  fieldPath: string;
  description: string;
}

export interface PropagationAuditLeakScanResult {
  patternsApplied: string[];
  declaredExemptions: string[];
  strippedKeyNamesChecked: number;
  stringValuesScanned: number;
  objectKeysScanned: number;
  hitCount: number;
  hits: string[];
}

export interface PropagationAuditBasisManifest {
  basisId: PropagationAuditBasisId;
  basisNote: string;
  visibleFields: PropagationAuditVisibleField[];
  strippedFields: string[];
  rowCounts: Record<string, number>;
  unitIndexedCoefficientVectorPresent: boolean;
  orientationBearingObservablePresent: boolean;
  flagIdentityObservablePresent: boolean;
  leakScan: PropagationAuditLeakScanResult;
}

export interface PropagationAuditControlDistribution {
  draws: number;
  mean: number;
  p95: number;
  max: number;
}

export interface PropagationAuditAllControl {
  draws: number;
  mean: number;
}

export interface PropagationAuditMeasurement {
  measurementKey: string;
  kind: 'r' | 'g';
  real: number;
  numerator: number;
  denominator: number;
  structuredControl: PropagationAuditControlDistribution | null;
  allControl: PropagationAuditAllControl | null;
  note: string;
}

export interface PropagationAuditGridCell {
  cellId: string;
  relationId: PropagationAuditRelationId;
  basisId: PropagationAuditBasisId;
  procedureNote: string;
  attempted: boolean;
  statusNote: string;
  measurements: PropagationAuditMeasurement[];
  voidedByLeak: boolean;
}

export interface PropagationAuditAnonymizationEntry {
  anonId: string;
  trueId: string;
}

export interface PropagationAuditBlindProtocol {
  seed: number;
  rngLaw: 'mulberry32';
  streamConsumptionOrder: string[];
  scorerSideNote: string;
  basisSNodeMap: PropagationAuditAnonymizationEntry[];
  basisSEdgeMap: PropagationAuditAnonymizationEntry[];
  basisSSampleMap: PropagationAuditAnonymizationEntry[];
  basisRSiteMap: PropagationAuditAnonymizationEntry[];
  basisRLatticeMap: PropagationAuditAnonymizationEntry[];
}

export interface PropagationAuditSealedTransformOutcome {
  transformId: string;
  definitionVerbatim: string;
  applied: boolean;
  outcomeNote: string;
  perItemCensus: string[];
}

export interface PropagationAuditG0Cell {
  cellNote: string;
  auditGraphId: string;
  deltaRowCount: number;
  maxAbsDeltaMinusBornSumResidual: number;
  antipodalSamplePairCount: number;
  phaseOpposedPairCount: number;
  pairCensus: string[];
  mayNotClaimNote: string;
  cautionVerbatim: string;
}

export interface PropagationAuditLedgerRow {
  ledgerId: string;
  context: string;
  measurement: string;
  derivationStatus: '';
}

export interface PropagationAuditIntegrityIssue {
  code: string;
  message: string;
}

export interface PropagationFieldActivitySurvivalAuditV0Report {
  reportId: string;
  method: typeof PROPAGATION_AUDIT_METHOD;
  declaredGate: typeof PROPAGATION_AUDIT_DECLARED_GATE;
  diagnosticScope: 'computes-and-reports-only';
  routeScope: 'tetra-hub-route-only';
  octaFieldActivityStatus: 'blocked-until-octa-field-stack';
  consumedSubstrates: string[];
  notConsumedSourceStateReports: string[];
  auditGraphId: string;
  nonAuditedGraphIds: string[];
  manifests: PropagationAuditBasisManifest[];
  blindProtocol: PropagationAuditBlindProtocol;
  grid: PropagationAuditGridCell[];
  sealedTransformOutcomes: PropagationAuditSealedTransformOutcome[];
  g0Cell: PropagationAuditG0Cell;
  anomalyLedger: PropagationAuditLedgerRow[];
  integrityIssueCount: number;
  integrityIssues: PropagationAuditIntegrityIssue[];
  verdictStatus: 'no-status-assigned-auditor-classifies-against-hash-committed-rule';
  ok: boolean;
}

// ---------------------------------------------------------------------------
// Deterministic stream
// ---------------------------------------------------------------------------

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);

    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffledCopy<T>(items: T[], next: () => number): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(next() * (index + 1));
    const held = copy[index];
    copy[index] = copy[swapIndex];
    copy[swapIndex] = held;
  }

  return copy;
}

function drawPermutation(size: number, next: () => number): number[] {
  return shuffledCopy(
    Array.from({ length: size }, (_unused, index) => index),
    next,
  );
}

// ---------------------------------------------------------------------------
// Small numeric helpers
// ---------------------------------------------------------------------------

interface Coordinate3 {
  x: number;
  y: number;
  z: number;
}

function coordFromVec3(position: Vec3): Coordinate3 {
  return { x: position[0], y: position[1], z: position[2] };
}

function subtract3(a: Coordinate3, b: Coordinate3): Coordinate3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function add3(a: Coordinate3, b: Coordinate3): Coordinate3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function scale3(a: Coordinate3, factor: number): Coordinate3 {
  return { x: a.x * factor, y: a.y * factor, z: a.z * factor };
}

function cross3(a: Coordinate3, b: Coordinate3): Coordinate3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function dot3(a: Coordinate3, b: Coordinate3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function norm3(a: Coordinate3): number {
  return Math.sqrt(dot3(a, a));
}

function normalize3(a: Coordinate3): Coordinate3 {
  const length = norm3(a);

  return length > 0 ? scale3(a, 1 / length) : { x: 0, y: 0, z: 0 };
}

function circularDistance(phaseA: number, phaseB: number): number {
  return 2 * Math.sin(Math.abs(angleDifference(phaseA, phaseB)) / 2);
}

function angleDifference(phaseA: number, phaseB: number): number {
  let difference = (phaseA - phaseB) % (2 * Math.PI);

  if (difference > Math.PI) {
    difference -= 2 * Math.PI;
  }

  if (difference < -Math.PI) {
    difference += 2 * Math.PI;
  }

  return difference;
}

function controlDistribution(
  values: number[],
): PropagationAuditControlDistribution {
  const sorted = [...values].sort((left, right) => left - right);
  const mean = sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
  const p95Index = Math.min(sorted.length - 1, Math.ceil(0.95 * sorted.length) - 1);

  return {
    draws: sorted.length,
    mean,
    p95: sorted[p95Index],
    max: sorted[sorted.length - 1],
  };
}

// ---------------------------------------------------------------------------
// Perfect matchings on six items (15 total), deterministic enumeration order
// ---------------------------------------------------------------------------

type PairIndex = [number, number];

function enumeratePerfectMatchingsOfSix(): PairIndex[][] {
  const matchings: PairIndex[][] = [];

  const recurse = (remaining: number[], current: PairIndex[]): void => {
    if (remaining.length === 0) {
      matchings.push(current.map((pair) => [pair[0], pair[1]]));

      return;
    }

    const [first, ...rest] = remaining;

    for (let index = 0; index < rest.length; index += 1) {
      const partner = rest[index];
      const nextRemaining = rest.filter((_value, restIndex) => restIndex !== index);
      recurse(nextRemaining, [...current, [first, partner]]);
    }
  };

  recurse([0, 1, 2, 3, 4, 5], []);

  return matchings;
}

const PERFECT_MATCHINGS_OF_SIX = enumeratePerfectMatchingsOfSix();

function unorderedPairKey(a: string, b: string): string {
  return a <= b ? `${a}|${b}` : `${b}|${a}`;
}

interface MatchingPick {
  matching: PairIndex[];
  tieDetected: boolean;
}

function pickBestMatching(
  scoreMatching: (matching: PairIndex[]) => number,
  direction: 'max' | 'min',
): MatchingPick {
  let bestIndex = 0;
  let bestScore = scoreMatching(PERFECT_MATCHINGS_OF_SIX[0]);
  let tieDetected = false;

  for (let index = 1; index < PERFECT_MATCHINGS_OF_SIX.length; index += 1) {
    const score = scoreMatching(PERFECT_MATCHINGS_OF_SIX[index]);
    const better = direction === 'max' ? score > bestScore + 1e-12 : score < bestScore - 1e-12;
    const tied = Math.abs(score - bestScore) <= 1e-12;

    if (better) {
      bestScore = score;
      bestIndex = index;
      tieDetected = false;
    } else if (tied) {
      tieDetected = true;
    }
  }

  return { matching: PERFECT_MATCHINGS_OF_SIX[bestIndex], tieDetected };
}

function matchingOverlapFraction(
  matching: PairIndex[],
  ids: string[],
  truthPairKeys: Set<string>,
): { numerator: number; denominator: number } {
  let recovered = 0;

  for (const [left, right] of matching) {
    if (truthPairKeys.has(unorderedPairKey(ids[left], ids[right]))) {
      recovered += 1;
    }
  }

  return { numerator: recovered, denominator: truthPairKeys.size };
}

// ---------------------------------------------------------------------------
// Leak scan
// ---------------------------------------------------------------------------

const STRIPPED_FIELD_NAMES = [
  'carrierUnit',
  'signedCarrier',
  'signedLift',
  'carrierRay',
  'sharedCarrierRay',
  'sourceChildSignedLift',
  'complementChildSignedLift',
  'sourceCarrierRay',
  'complementCarrierRay',
  'carrierStateOrTransportResult',
  'canonicalLiftId',
  'childTokenId',
  'complementTokenId',
  'sourceSlotId',
  'parentSet',
  'projectedSourceSet',
  'actionSourceId',
  'expectedRecoveredSourceId',
  'childLeftSignedResult',
  'sourceLeftSignedResult',
  'sourceToken',
  'sampleToken',
  'nodeId',
  'edgeId',
  'ownerId',
  'samplePointId',
  'contributionId',
  'profileId',
  'envelopeId',
  'sourceEmissionProfileId',
  'sourceEmissionEnvelopeId',
  'frequencyRatio',
  'ratioLabel',
  'slotId',
  'vertexId',
  'childId',
  'sourceEdgeId',
  'complementEdgeId',
  'antipodalChildId',
  'label',
];

const LEAK_SCAN_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'signed-lift-token', pattern: /[+\-]e[1-7](?![0-9])/ },
  { label: 'bare-unit-token', pattern: /\be[1-7]\b/i },
  { label: 'carrier-ray-token', pattern: /\bray:/i },
  { label: 'lift-product-token', pattern: /e[1-7]\s*[·*]\s*e[1-7]/i },
  { label: 'child-pair-token', pattern: /M_[A-D]{2}/ },
  { label: 'primal-slot-single-letter', pattern: /\b[A-D]\b/ },
  { label: 'carrier-word', pattern: /carrier/i },
  { label: 'signed-word', pattern: /signed/i },
  { label: 'lift-word', pattern: /lift/i },
  { label: 'fano-word', pattern: /fano/i },
  { label: 'slot-word', pattern: /slot/i },
];

function runLeakScan(
  view: unknown,
  declaredExemptions: string[] = [],
): PropagationAuditLeakScanResult {
  const hits: string[] = [];
  let stringValuesScanned = 0;
  let objectKeysScanned = 0;
  const strippedNameSet = new Set(STRIPPED_FIELD_NAMES);

  const walk = (value: unknown, pathSoFar: string): void => {
    if (declaredExemptions.some((exemption) => pathSoFar.startsWith(exemption))) {
      return;
    }

    if (typeof value === 'string') {
      stringValuesScanned += 1;

      for (const { label, pattern } of LEAK_SCAN_PATTERNS) {
        if (pattern.test(value)) {
          hits.push(`${pathSoFar}: value "${value}" matched ${label}`);
        }
      }

      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${pathSoFar}[${index}]`));

      return;
    }

    if (value !== null && typeof value === 'object') {
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        objectKeysScanned += 1;

        if (strippedNameSet.has(key)) {
          hits.push(`${pathSoFar}.${key}: stripped field name present as key`);
        }

        walk(child, `${pathSoFar}.${key}`);
      }
    }
  };

  walk(view, '$');

  return {
    patternsApplied: LEAK_SCAN_PATTERNS.map((entry) => entry.label),
    declaredExemptions,
    strippedKeyNamesChecked: STRIPPED_FIELD_NAMES.length,
    stringValuesScanned,
    objectKeysScanned,
    hitCount: hits.length,
    hits,
  };
}

// ---------------------------------------------------------------------------
// Blinded views
// ---------------------------------------------------------------------------

interface BlindedSNode {
  anonId: string;
  role: 'primal' | 'child';
  anchor: Coordinate3;
}

interface BlindedSEdge {
  anonEdgeId: string;
  family: FanoCarrierGraphEdgeRow['edgeFamily'];
  sourceAnonIds: string[];
  targetAnonIds: string[];
  actionAnonId: string | null;
  weight: number;
  activationStatus: string;
}

interface BlindedSObservationRow {
  anonSampleId: string;
  supportValue: number;
  supportDistance: number;
  weight: number;
  amplitude: number;
  attenuation: number;
  attenuationFactor: number;
  effectiveAmplitude: number;
  phaseRadiansAtT0: number;
  frequencyRatioValue: number;
  realCoefficient: number;
  imagCoefficient: number;
  contributionFamily: string;
  activationStatus: string;
  activationMode: string;
  baselineInclusionStatus: string;
}

interface BlindedSOwnerObservations {
  ownerAnonId: string;
  ownerKind: 'node' | 'edge';
  rows: BlindedSObservationRow[];
}

interface BlindedSSamplePoint {
  anonSampleId: string;
  x: number;
  y: number;
  z: number;
}

interface BlindedSView {
  basisId: 'basis-s-structural-channel-recomputed-from-f1-f2';
  nodes: BlindedSNode[];
  edges: BlindedSEdge[];
  samplePoints: BlindedSSamplePoint[];
  ownerObservations: BlindedSOwnerObservations[];
}

interface BlindedRSite {
  anonId: string;
  role: 'primal' | 'child';
  x: number;
  y: number;
  z: number;
  tuple: {
    amplitude: number;
    waveNumber: number;
    phase: number;
    attenuation: number;
  };
}

interface BlindedRLatticeSample {
  anonSampleId: string;
  x: number;
  y: number;
  z: number;
  scalarFieldValue: number;
}

interface BlindedRView {
  basisId: 'basis-r-raw-scalar-field-legacy';
  sites: BlindedRSite[];
  latticeSamples: BlindedRLatticeSample[];
}

interface BlindedDView {
  basisId: 'basis-d-depropagation-sealed-transforms';
  sites: BlindedRSite[];
  latticeSamples: BlindedRLatticeSample[];
  sealedTransformIds: string[];
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export function buildPropagationFieldActivitySurvivalAuditV0Report(): PropagationFieldActivitySurvivalAuditV0Report {
  const integrityIssues: PropagationAuditIntegrityIssue[] = [];
  const ledger: PropagationAuditLedgerRow[] = [];
  let ledgerCounter = 0;

  const pushLedger = (context: string, measurement: string): void => {
    ledgerCounter += 1;
    ledger.push({
      ledgerId: `iv-a-ledger-${String(ledgerCounter).padStart(2, '0')}`,
      context,
      measurement,
      derivationStatus: '',
    });
  };

  const pushIssue = (code: string, message: string): void => {
    integrityIssues.push({ code, message });
  };

  // -------------------------------------------------------------------------
  // Substrates (READ-ONLY)
  // -------------------------------------------------------------------------
  const f1Report = buildFanoOctonionicCarrierGraphFieldV0Report();
  const f2Report = buildFanoOctonionicSpatialSupportProjectionV0Report();
  const g0Report = buildFanoOctonionicGenerationalFieldUpdateV0Report();
  const regimeReport = buildPythagoreanTetrachordQuarkRegimeV0Report();

  if (!f1Report.ok) {
    pushIssue('f1-substrate-not-ok', 'F1 carrier graph field report is not ok.');
  }

  if (!f2Report.ok) {
    pushIssue('f2-substrate-not-ok', 'F2 spatial support projection report is not ok.');
  }

  if (!g0Report.ok) {
    pushIssue('g0-substrate-not-ok', 'G0 generational field update report is not ok.');
  }

  if (!regimeReport.ok) {
    pushIssue(
      'pythagorean-regime-not-ok',
      'Pythagorean tetrachord quark regime report is not ok.',
    );
  }

  // Audit instance: the first F1 graph set in report order (declared scope).
  const auditGraphSet = f1Report.graphSetRows[0];
  const auditGraphId = auditGraphSet.graphId;
  const nonAuditedGraphIds = f1Report.graphSetRows
    .slice(1)
    .map((row) => row.graphId);
  const auditNodeRows = f1Report.nodeRows.filter(
    (row) => row.graphId === auditGraphId,
  );
  const auditEdgeRows = f1Report.edgeRows.filter(
    (row) => row.graphId === auditGraphId,
  );
  const auditSamplePointRows = f2Report.samplePointRows.filter(
    (row) => row.graphId === auditGraphId,
  );
  const auditContributionRows = f2Report.fieldContributionSampleRows.filter(
    (row) => row.graphId === auditGraphId,
  );
  const primalNodeRows = auditNodeRows.filter(
    (row): row is FanoCarrierGraphPrimalNodeRow =>
      row.nodeRole === 'primal-source-node',
  );
  const childNodeRows = auditNodeRows.filter(
    (row): row is FanoCarrierGraphChildNodeRow =>
      row.nodeRole === 'child-source-node',
  );

  if (primalNodeRows.length !== 4 || childNodeRows.length !== 6) {
    pushIssue(
      'audit-graph-site-count-mismatch',
      `Expected 4 primal + 6 child nodes in audit graph, got ${primalNodeRows.length}+${childNodeRows.length}.`,
    );
  }

  if (auditEdgeRows.length !== 36) {
    pushIssue(
      'audit-graph-edge-count-mismatch',
      `Expected 36 edges in audit graph, got ${auditEdgeRows.length}.`,
    );
  }

  if (auditSamplePointRows.length !== 11) {
    pushIssue(
      'audit-graph-sample-point-count-mismatch',
      `Expected 11 F2 sample points in audit graph, got ${auditSamplePointRows.length}.`,
    );
  }

  // -------------------------------------------------------------------------
  // Basis-R geometry: seed tetrahedron -> one ambo -> 6 midpoints
  // -------------------------------------------------------------------------
  const seedShape = createSeedShape('tetrahedron');
  const amboShape = applyAmboDissection(seedShape);
  const geometry = extractAmboGeometry(amboShape, pushIssue);
  const regimeChildRows = regimeReport.childDerivationTable;
  const regimePrimalRows = regimeReport.primalSourceTable;

  for (const childRow of regimeChildRows) {
    if (!childRow.derivedTuple) {
      pushIssue(
        'regime-child-tuple-missing',
        `Pythagorean child ${childRow.childId} has no derived emitted tuple.`,
      );
    }
  }

  // -------------------------------------------------------------------------
  // Deterministic stream, declared consumption order
  // -------------------------------------------------------------------------
  const streamConsumptionOrder = [
    '1. basis-s primal node anonymization shuffle (4)',
    '2. basis-s child node anonymization shuffle (6)',
    '3. basis-s edge anonymization shuffle (36)',
    '4. basis-s sample point anonymization shuffle (11)',
    '5. basis-r primal site anonymization shuffle (4)',
    '6. basis-r child site anonymization shuffle (6)',
    '7. basis-r lattice point anonymization shuffle (11)',
    '8. structured control draws 1..64, each drawing: basis-s child payload permutation (6), basis-r child payload permutation (6), basis-d child payload permutation (6)',
    '9. strict all-control draws 1..64, each drawing: basis-s child phases (6 uniform [0,2pi)), basis-r child tuples (6x4 uniform in observed min..max, phase uniform [0,2pi)), basis-d child positions (6x3 uniform in observed bounding box)',
    'note: no grid measurement consumes primal payloads, so primal-payload permutations are not drawn (within-role permutation of unused payloads has no measurement impact; declared rather than silently skipped)',
  ];
  const stream = mulberry32(PROPAGATION_AUDIT_SEED);

  // -------------------------------------------------------------------------
  // Basis-S blinded view + scorer-side maps
  // -------------------------------------------------------------------------
  const shuffledPrimalNodes = shuffledCopy(primalNodeRows, stream);
  const shuffledChildNodes = shuffledCopy(childNodeRows, stream);
  const shuffledEdges = shuffledCopy(auditEdgeRows, stream);
  const shuffledSamplePoints = shuffledCopy(auditSamplePointRows, stream);

  const sNodeAnonByTrueId = new Map<string, string>();
  shuffledPrimalNodes.forEach((row, index) => {
    sNodeAnonByTrueId.set(row.nodeId, `P${index}`);
  });
  shuffledChildNodes.forEach((row, index) => {
    sNodeAnonByTrueId.set(row.nodeId, `S${index}`);
  });
  const sEdgeAnonByTrueId = new Map<string, string>();
  shuffledEdges.forEach((row, index) => {
    sEdgeAnonByTrueId.set(row.edgeId, `EDG${String(index).padStart(2, '0')}`);
  });
  const sSampleAnonByTrueId = new Map<string, string>();
  shuffledSamplePoints.forEach((row, index) => {
    sSampleAnonByTrueId.set(row.samplePointId, `SP${String(index).padStart(2, '0')}`);
  });

  const anchorByNodeId = new Map<string, Coordinate3>();

  for (const anchorRow of f2Report.spatialAnchorRows) {
    if (anchorRow.graphId === auditGraphId) {
      anchorByNodeId.set(anchorRow.nodeId, { ...anchorRow.coordinate });
    }
  }

  const blindedSView = buildBlindedSView({
    auditNodeRows,
    auditEdgeRows,
    auditSamplePointRows,
    auditContributionRows,
    sNodeAnonByTrueId,
    sEdgeAnonByTrueId,
    sSampleAnonByTrueId,
    anchorByNodeId,
    pushIssue,
  });

  // -------------------------------------------------------------------------
  // Basis-R blinded view + scorer-side maps
  // -------------------------------------------------------------------------
  const shuffledRPrimals = shuffledCopy(regimePrimalRows, stream);
  const shuffledRChildren = shuffledCopy(regimeChildRows, stream);
  const rSiteAnonByTrueId = new Map<string, string>();
  shuffledRPrimals.forEach((row, index) => {
    rSiteAnonByTrueId.set(row.vertexId, `P${index}`);
  });
  shuffledRChildren.forEach((row, index) => {
    rSiteAnonByTrueId.set(row.childId, `S${index}`);
  });

  const latticeTrueIds = [
    ...geometry.primalLabels.map((label) => `lattice:${label}`),
    ...geometry.childIds.map((childId) => `lattice:${childId}`),
    'lattice:centroid',
  ];
  const shuffledLattice = shuffledCopy(latticeTrueIds, stream);
  const rLatticeAnonByTrueId = new Map<string, string>();
  shuffledLattice.forEach((trueId, index) => {
    rLatticeAnonByTrueId.set(trueId, `SP${String(index).padStart(2, '0')}`);
  });

  const blindedRView = buildBlindedRView({
    geometry,
    regimePrimalRows,
    regimeChildRows,
    amboShape,
    rSiteAnonByTrueId,
    rLatticeAnonByTrueId,
    pushIssue,
  });

  const blindedDView: BlindedDView = {
    basisId: 'basis-d-depropagation-sealed-transforms',
    sites: blindedRView.sites,
    latticeSamples: blindedRView.latticeSamples,
    sealedTransformIds: ['T_axis', 'T_lift', 'T_flag', 'T_clo', 'T_hol', 'T_ori'],
  };

  // -------------------------------------------------------------------------
  // Leak scans + manifest absence inventories
  // -------------------------------------------------------------------------
  const sLeakScan = runLeakScan(blindedSView);
  const rLeakScan = runLeakScan(blindedRView);
  const dLeakScan = runLeakScan(blindedDView, [
    '$.sealedTransformIds',
  ]);
  const anyLeak =
    sLeakScan.hitCount > 0 || rLeakScan.hitCount > 0 || dLeakScan.hitCount > 0;

  if (anyLeak) {
    pushLedger(
      'leak-scan',
      `Leak scan hits: basis-s=${sLeakScan.hitCount}, basis-r=${rLeakScan.hitCount}, basis-d=${dLeakScan.hitCount}; affected relation cells are voided.`,
    );
  }

  const sUnitVector = scanForUnitIndexedCoefficientVector(blindedSView);
  const rUnitVector = scanForUnitIndexedCoefficientVector(blindedRView);
  const dUnitVector = scanForUnitIndexedCoefficientVector(blindedDView);

  pushLedger(
    'unit-indexed-coefficient-vector-inventory',
    `No basis exposes a per-site coefficient vector indexed over the seven imaginary units (basis-s: ${sUnitVector}, basis-r: ${rUnitVector}, basis-d: ${dUnitVector}); each contribution emits ONE complex coefficient. This absence is the finding for signed-fano-lift and its dependents.`,
  );

  // -------------------------------------------------------------------------
  // Scorer-side truth keys (from geometry + the F1/regime construction; never
  // passed to recovery functions)
  // -------------------------------------------------------------------------
  const sTruth = buildSTruth({ childNodeRows, sNodeAnonByTrueId, pushIssue });
  const rTruth = buildRTruth({ regimeChildRows, rSiteAnonByTrueId });

  // -------------------------------------------------------------------------
  // Structured + strict control draw materials (declared stream order)
  // -------------------------------------------------------------------------
  const structuredDraws: Array<{
    sChildPermutation: number[];
    rChildPermutation: number[];
    dChildPermutation: number[];
  }> = [];

  for (let draw = 0; draw < PROPAGATION_AUDIT_CONTROL_DRAWS; draw += 1) {
    structuredDraws.push({
      sChildPermutation: drawPermutation(6, stream),
      rChildPermutation: drawPermutation(6, stream),
      dChildPermutation: drawPermutation(6, stream),
    });
  }

  const rChildTuples = blindedRView.sites
    .filter((site) => site.role === 'child')
    .map((site) => site.tuple);
  const observedTupleRanges = {
    amplitude: observedRange(rChildTuples.map((tuple) => tuple.amplitude)),
    waveNumber: observedRange(rChildTuples.map((tuple) => tuple.waveNumber)),
    attenuation: observedRange(rChildTuples.map((tuple) => tuple.attenuation)),
  };
  const dChildPositions = blindedDView.sites
    .filter((site) => site.role === 'child')
    .map((site) => ({ x: site.x, y: site.y, z: site.z }));
  const observedPositionRanges = {
    x: observedRange(dChildPositions.map((position) => position.x)),
    y: observedRange(dChildPositions.map((position) => position.y)),
    z: observedRange(dChildPositions.map((position) => position.z)),
  };

  const strictDraws: Array<{
    sChildPhases: number[];
    rChildTuples: Array<{
      amplitude: number;
      waveNumber: number;
      phase: number;
      attenuation: number;
    }>;
    dChildPositions: Coordinate3[];
  }> = [];

  for (let draw = 0; draw < PROPAGATION_AUDIT_CONTROL_DRAWS; draw += 1) {
    const sChildPhases = Array.from({ length: 6 }, () => stream() * 2 * Math.PI);
    const strictTuples = Array.from({ length: 6 }, () => ({
      amplitude: uniformIn(observedTupleRanges.amplitude, stream),
      waveNumber: uniformIn(observedTupleRanges.waveNumber, stream),
      phase: stream() * 2 * Math.PI,
      attenuation: uniformIn(observedTupleRanges.attenuation, stream),
    }));
    const strictPositions = Array.from({ length: 6 }, () => ({
      x: uniformIn(observedPositionRanges.x, stream),
      y: uniformIn(observedPositionRanges.y, stream),
      z: uniformIn(observedPositionRanges.z, stream),
    }));
    strictDraws.push({
      sChildPhases,
      rChildTuples: strictTuples,
      dChildPositions: strictPositions,
    });
  }

  // -------------------------------------------------------------------------
  // Grid cells
  // -------------------------------------------------------------------------
  const grid: PropagationAuditGridCell[] = [];
  const sealedOutcomes: PropagationAuditSealedTransformOutcome[] = [];

  // ---- Relation 1: carrier-ray / antipodal-axis ----------------------------
  const sAxisCell = computeSAxisCell({
    view: blindedSView,
    truth: sTruth,
    structuredDraws: structuredDraws.map((draw) => draw.sChildPermutation),
    strictDraws: strictDraws.map((draw) => draw.sChildPhases),
    voided: sLeakScan.hitCount > 0,
    pushIssue,
    pushLedger,
  });
  grid.push(sAxisCell);

  const rAxisCell = computeRAxisCell({
    view: blindedRView,
    truth: rTruth,
    structuredDraws: structuredDraws.map((draw) => draw.rChildPermutation),
    strictDraws: strictDraws.map((draw) => draw.rChildTuples),
    voided: rLeakScan.hitCount > 0,
    pushLedger,
  });
  grid.push(rAxisCell);

  const dAxisResult = computeDAxisCell({
    view: blindedDView,
    truth: rTruth,
    structuredDraws: structuredDraws.map((draw) => draw.dChildPermutation),
    strictDraws: strictDraws.map((draw) => draw.dChildPositions),
    voided: dLeakScan.hitCount > 0,
  });
  grid.push(dAxisResult.cell);
  sealedOutcomes.push(dAxisResult.outcome);

  // ---- Relation 2: signed-fano-lift ----------------------------------------
  const liftAbsenceNote =
    'observable-absent / not-recoverable; other transforms untested';

  grid.push({
    cellId: 'cell:signed-fano-lift:basis-s',
    relationId: 'signed-fano-lift',
    basisId: 'basis-s-structural-channel-recomputed-from-f1-f2',
    procedureNote:
      'Defining datum: imaginary-unit identity e1..e7 plus sign per site. Runtime manifest inventory: unit-indexed coefficient vector present = ' +
      `${sUnitVector}. Each contribution row carries one complex coefficient (real, imag), not seven unit-indexed coefficients.`,
    attempted: false,
    statusNote: liftAbsenceNote,
    measurements: [],
    voidedByLeak: sLeakScan.hitCount > 0,
  });
  grid.push({
    cellId: 'cell:signed-fano-lift:basis-r',
    relationId: 'signed-fano-lift',
    basisId: 'basis-r-raw-scalar-field-legacy',
    procedureNote:
      'Defining datum: imaginary-unit identity e1..e7 plus sign per site. Runtime manifest inventory: unit-indexed coefficient vector present = ' +
      `${rUnitVector}. Emitted tuples are (amplitude, waveNumber, phase, attenuation) scalars.`,
    attempted: false,
    statusNote: liftAbsenceNote,
    measurements: [],
    voidedByLeak: rLeakScan.hitCount > 0,
  });
  grid.push({
    cellId: 'cell:signed-fano-lift:basis-d',
    relationId: 'signed-fano-lift',
    basisId: 'basis-d-depropagation-sealed-transforms',
    procedureNote:
      'T_lift applied literally: it requires "the field-emitted coefficient vector over the imaginary units". Runtime manifest inventory: unit-indexed coefficient vector present = ' +
      `${dUnitVector}.`,
    attempted: false,
    statusNote: liftAbsenceNote,
    measurements: [],
    voidedByLeak: dLeakScan.hitCount > 0,
  });
  sealedOutcomes.push({
    transformId: 'T_lift',
    definitionVerbatim: SEALED_DEPROPAGATION_TRANSFORMS.tLift,
    applied: false,
    outcomeNote:
      'The referenced observable (a per-site coefficient vector over the imaginary units) is not field-emitted by any basis; the cell is not-recoverable; other transforms untested.',
    perItemCensus: [],
  });

  // ---- Relations 3+4: triangle-closure / square-holonomy --------------------
  const triangleCensusCount = geometry.coreFaces.length;
  const squareCensusCount = geometry.equatorialSquares.length;
  const dependencyNote =
    'not-recoverable (transform dependency absent: T_lift observable-absent); other transforms untested';

  for (const basisId of PROPAGATION_AUDIT_BASIS_IDS) {
    const voided =
      basisId === 'basis-s-structural-channel-recomputed-from-f1-f2'
        ? sLeakScan.hitCount > 0
        : basisId === 'basis-r-raw-scalar-field-legacy'
          ? rLeakScan.hitCount > 0
          : dLeakScan.hitCount > 0;
    grid.push({
      cellId: `cell:triangle-closure:${shortBasis(basisId)}`,
      relationId: 'triangle-closure',
      basisId,
      procedureNote:
        `Triangle-closure composes per-site lifts (T_clo on basis-d; lift relations on basis-s/r). Attempt census from geometry: ${triangleCensusCount} octahedral face triangles on the 6 child sites. No per-site lift carrier exists in the visible fields, so no composition was attempted.`,
      attempted: false,
      statusNote: dependencyNote,
      measurements: [],
      voidedByLeak: voided,
    });
  }

  for (const basisId of PROPAGATION_AUDIT_BASIS_IDS) {
    const voided =
      basisId === 'basis-s-structural-channel-recomputed-from-f1-f2'
        ? sLeakScan.hitCount > 0
        : basisId === 'basis-r-raw-scalar-field-legacy'
          ? rLeakScan.hitCount > 0
          : dLeakScan.hitCount > 0;
    grid.push({
      cellId: `cell:square-holonomy:${shortBasis(basisId)}`,
      relationId: 'square-holonomy',
      basisId,
      procedureNote:
        `Square-holonomy composes per-site lifts around square cycles (T_hol on basis-d). Attempt census from geometry: ${squareCensusCount} equatorial 4-cycles on the 6 child sites. No per-site lift carrier exists in the visible fields, so no composition was attempted.`,
      attempted: false,
      statusNote: dependencyNote,
      measurements: [],
      voidedByLeak: voided,
    });
  }

  sealedOutcomes.push({
    transformId: 'T_clo',
    definitionVerbatim: SEALED_DEPROPAGATION_TRANSFORMS.tClo,
    applied: false,
    outcomeNote: `Dependency T_lift is observable-absent; ${triangleCensusCount} geometric triangles enumerated, 0 compositions attempted; other transforms untested.`,
    perItemCensus: geometry.coreFaces.map(
      (face, index) =>
        `triangle ${index + 1}/${triangleCensusCount}: sites [${face.anonNote}] - not attempted (dependency absent)`,
    ),
  });
  sealedOutcomes.push({
    transformId: 'T_hol',
    definitionVerbatim: SEALED_DEPROPAGATION_TRANSFORMS.tHol,
    applied: false,
    outcomeNote: `Dependency T_lift is observable-absent; ${squareCensusCount} geometric square cycles enumerated, 0 compositions attempted; other transforms untested.`,
    perItemCensus: geometry.equatorialSquares.map(
      (square, index) =>
        `square ${index + 1}/${squareCensusCount}: sites [${square.map((childId) => rSiteAnonByTrueId.get(childId) ?? childId).join(', ')}] - not attempted (dependency absent)`,
    ),
  });

  // ---- Relation 5: ordered-flag-identity ------------------------------------
  grid.push({
    cellId: 'cell:ordered-flag-identity:basis-s',
    relationId: 'ordered-flag-identity',
    basisId: 'basis-s-structural-channel-recomputed-from-f1-f2',
    procedureNote:
      'Defining datum: ordered pair (i,j) over the four A3 indices per flag. Runtime manifest inventory: flag-identity observable present = ' +
      `${manifestHasFlagIdentityObservable(blindedSView)}. Unordered parent pairs are recoverable from typed birth adjacency and are reported as data under provenance-route-tetra-g2-core; the ORDER carrier is not field-emitted.`,
    attempted: false,
    statusNote: 'observable-absent / not-recoverable; other transforms untested',
    measurements: [],
    voidedByLeak: sLeakScan.hitCount > 0,
  });
  grid.push({
    cellId: 'cell:ordered-flag-identity:basis-r',
    relationId: 'ordered-flag-identity',
    basisId: 'basis-r-raw-scalar-field-legacy',
    procedureNote:
      'Defining datum: ordered pair (i,j) over the four A3 indices per flag. Runtime manifest inventory: flag-identity observable present = ' +
      `${manifestHasFlagIdentityObservable(blindedRView)}.`,
    attempted: false,
    statusNote: 'observable-absent / not-recoverable; other transforms untested',
    measurements: [],
    voidedByLeak: rLeakScan.hitCount > 0,
  });

  const dFlagResult = computeDFlagCell({
    view: blindedDView,
    geometry,
    rSiteAnonByTrueId,
    structuredDraws: structuredDraws.map((draw) => draw.dChildPermutation),
    strictDraws: strictDraws.map((draw) => draw.dChildPositions),
    voided: dLeakScan.hitCount > 0,
    pushLedger,
  });
  grid.push(dFlagResult.cell);
  sealedOutcomes.push(dFlagResult.outcome);

  // ---- Relation 6: orientation-sign -----------------------------------------
  grid.push({
    cellId: 'cell:orientation-sign:basis-s',
    relationId: 'orientation-sign',
    basisId: 'basis-s-structural-channel-recomputed-from-f1-f2',
    procedureNote:
      'Declared procedure: orientation from coefficient phases. Runtime manifest inventory: orientation-bearing observable (ordered-triple-valued or signed-cycle-valued field) present = ' +
      `${manifestHasOrientationBearingObservable(blindedSView)}. Per-site scalar phases carry no ordered-triple sign; no proxy substituted.`,
    attempted: false,
    statusNote: 'observable-absent / not-recoverable; other transforms untested',
    measurements: [],
    voidedByLeak: sLeakScan.hitCount > 0,
  });
  grid.push({
    cellId: 'cell:orientation-sign:basis-r',
    relationId: 'orientation-sign',
    basisId: 'basis-r-raw-scalar-field-legacy',
    procedureNote:
      'Declared procedure: orientation from emitted-tuple phases. Runtime manifest inventory: orientation-bearing observable present = ' +
      `${manifestHasOrientationBearingObservable(blindedRView)}.`,
    attempted: false,
    statusNote: 'observable-absent / not-recoverable; other transforms untested',
    measurements: [],
    voidedByLeak: rLeakScan.hitCount > 0,
  });

  const dOriResult = computeDOriCell({
    view: blindedDView,
    geometry,
    structuredDraws: structuredDraws.map((draw) => draw.dChildPermutation),
    strictDraws: strictDraws.map((draw) => draw.dChildPositions),
    voided: dLeakScan.hitCount > 0,
  });
  grid.push(dOriResult.cell);
  sealedOutcomes.push(dOriResult.outcome);

  // ---- Relations 7-9: provenance routes -------------------------------------
  const stackInventoryNote =
    'The accepted field stack (F1/F2/G0) instantiates G0->G1 tetra content only; the manifest inventory contains no G2, octa-field, or cube-field rows.';

  const birthStructureMeasurements = computeBirthStructureRecovery({
    view: blindedSView,
    truth: sTruth,
    structuredDrawCount: PROPAGATION_AUDIT_CONTROL_DRAWS,
    voided: sLeakScan.hitCount > 0,
    pushLedger,
  });

  for (const basisId of PROPAGATION_AUDIT_BASIS_IDS) {
    const voided =
      basisId === 'basis-s-structural-channel-recomputed-from-f1-f2'
        ? sLeakScan.hitCount > 0
        : basisId === 'basis-r-raw-scalar-field-legacy'
          ? rLeakScan.hitCount > 0
          : dLeakScan.hitCount > 0;
    const isS = basisId === 'basis-s-structural-channel-recomputed-from-f1-f2';
    grid.push({
      cellId: `cell:provenance-route-tetra-g2-core:${shortBasis(basisId)}`,
      relationId: 'provenance-route-tetra-g2-core',
      basisId,
      procedureNote:
        `${stackInventoryNote} No tetra-G2 field instantiation exists to recover from.` +
        (isS
          ? ' Auxiliary data (the only provenance-like field-facing structure present): birth-structure recovery of each child\'s parent pair from anonymized typed birth adjacency, reported below as r-adjacency.'
          : ''),
      attempted: isS,
      statusNote: 'observable-absent (no field instantiation in the accepted stack)',
      measurements: isS ? birthStructureMeasurements : [],
      voidedByLeak: voided,
    });
  }

  for (const basisId of PROPAGATION_AUDIT_BASIS_IDS) {
    const voided =
      basisId === 'basis-s-structural-channel-recomputed-from-f1-f2'
        ? sLeakScan.hitCount > 0
        : basisId === 'basis-r-raw-scalar-field-legacy'
          ? rLeakScan.hitCount > 0
          : dLeakScan.hitCount > 0;
    grid.push({
      cellId: `cell:provenance-route-octa-g1:${shortBasis(basisId)}`,
      relationId: 'provenance-route-octa-g1',
      basisId,
      procedureNote: `${stackInventoryNote} Octa field activity is blocked-until-octa-field-stack; no octa field stack was built in this run.`,
      attempted: false,
      statusNote: 'observable-absent (no field instantiation in the accepted stack)',
      measurements: [],
      voidedByLeak: voided,
    });
  }

  for (const basisId of PROPAGATION_AUDIT_BASIS_IDS) {
    const voided =
      basisId === 'basis-s-structural-channel-recomputed-from-f1-f2'
        ? sLeakScan.hitCount > 0
        : basisId === 'basis-r-raw-scalar-field-legacy'
          ? rLeakScan.hitCount > 0
          : dLeakScan.hitCount > 0;
    grid.push({
      cellId: `cell:provenance-route-cube-g1-dual:${shortBasis(basisId)}`,
      relationId: 'provenance-route-cube-g1-dual',
      basisId,
      procedureNote: `${stackInventoryNote} The cube route travels as ${CUBE_DUAL_PROVENANCE_WORDING}.`,
      attempted: false,
      statusNote: 'observable-absent (no field instantiation in the accepted stack)',
      measurements: [],
      voidedByLeak: voided,
    });
  }

  // ---- Relation 10: cube-primal-sourcehood-boundary --------------------------
  for (const basisId of PROPAGATION_AUDIT_BASIS_IDS) {
    const voided =
      basisId === 'basis-s-structural-channel-recomputed-from-f1-f2'
        ? sLeakScan.hitCount > 0
        : basisId === 'basis-r-raw-scalar-field-legacy'
          ? rLeakScan.hitCount > 0
          : dLeakScan.hitCount > 0;
    grid.push({
      cellId: `cell:cube-primal-sourcehood-boundary:${shortBasis(basisId)}`,
      relationId: 'cube-primal-sourcehood-boundary',
      basisId,
      procedureNote: `Boundary carried, not tested: no cube field content exists in the accepted stack. Wording carried verbatim: ${CUBE_DUAL_PROVENANCE_WORDING}.`,
      attempted: false,
      statusNote: 'observable-absent (boundary carried with dual-provenance-only wording)',
      measurements: [],
      voidedByLeak: voided,
    });
  }

  sortSealedOutcomes(sealedOutcomes);

  // -------------------------------------------------------------------------
  // G0 exploratory cell
  // -------------------------------------------------------------------------
  const g0Cell = computeG0Cell({
    g0Report,
    auditGraphId,
    f2SamplePointRows: auditSamplePointRows,
    pushIssue,
  });
  pushLedger(
    'g0-exploratory-cell',
    `delta-equals-born-sum max abs residual ${g0Cell.maxAbsDeltaMinusBornSumResidual.toExponential(3)} over ${g0Cell.deltaRowCount} sample points; antipodal sample-point phase opposition ${g0Cell.phaseOpposedPairCount}/${g0Cell.antipodalSamplePairCount}. ${g0Cell.cautionVerbatim}`,
  );

  // -------------------------------------------------------------------------
  // Split observations (r-high/g-low) and control-overlap observations
  // -------------------------------------------------------------------------
  for (const cell of grid) {
    const rMeasurements = cell.measurements.filter((entry) => entry.kind === 'r');
    const gMeasurements = cell.measurements.filter((entry) => entry.kind === 'g');

    for (const rEntry of rMeasurements) {
      for (const gEntry of gMeasurements) {
        if (gEntry.real < rEntry.real) {
          pushLedger(
            `sign-count-split:${cell.cellId}`,
            `${rEntry.measurementKey}=${rEntry.real.toFixed(4)} while ${gEntry.measurementKey}=${gEntry.real.toFixed(4)} (g < r, raw inequality, no threshold applied).`,
          );
        }
      }

      if (
        rEntry.structuredControl !== null &&
        rEntry.real <= rEntry.structuredControl.p95
      ) {
        pushLedger(
          `control-overlap:${cell.cellId}`,
          `${rEntry.measurementKey} real=${rEntry.real.toFixed(4)} lies at or below the structured-control p95=${rEntry.structuredControl.p95.toFixed(4)} (overlap recorded, not classified).`,
        );
      }
    }
  }

  // -------------------------------------------------------------------------
  // Manifests
  // -------------------------------------------------------------------------
  const manifests: PropagationAuditBasisManifest[] = [
    {
      basisId: 'basis-s-structural-channel-recomputed-from-f1-f2',
      basisNote:
        'Structural channel recomputed from F1 carrier-graph-field activations + F2 spatial supports (concept anchor: structuredSourceStateMultiProjectionStructuralChannelV0; that report is NOT consumed -- consuming it would be this station\'s mock-solution failure).',
      visibleFields: [
        { fieldPath: 'nodes[].anonId', description: 'anonymized site id (P0..P3 primal, S0..S5 child)' },
        { fieldPath: 'nodes[].role', description: 'role class (primal | child) -- structural fact' },
        { fieldPath: 'nodes[].anchor.{x,y,z}', description: 'F2 spatial anchor coordinate' },
        { fieldPath: 'edges[].anonEdgeId', description: 'anonymized edge id (EDG00..EDG35)' },
        { fieldPath: 'edges[].family', description: 'typed edge family (birth-edge | parent-return-edge | projection-loop-edge | complement-coupling-edge)' },
        { fieldPath: 'edges[].sourceAnonIds/targetAnonIds/actionAnonId', description: 'anonymized endpoint references' },
        { fieldPath: 'edges[].weight', description: 'activation weight' },
        { fieldPath: 'edges[].activationStatus', description: 'activation status string' },
        { fieldPath: 'samplePoints[].{anonSampleId,x,y,z}', description: 'F2 sample lattice coordinates' },
        { fieldPath: 'ownerObservations[].rows[].supportValue/supportDistance', description: 'continuous spatial support observables' },
        { fieldPath: 'ownerObservations[].rows[].amplitude/attenuation/attenuationFactor/effectiveAmplitude', description: 'activation magnitudes' },
        { fieldPath: 'ownerObservations[].rows[].phaseRadiansAtT0', description: 'emission phase observable' },
        { fieldPath: 'ownerObservations[].rows[].frequencyRatioValue', description: 'numeric frequency ratio value (label stripped)' },
        { fieldPath: 'ownerObservations[].rows[].realCoefficient/imagCoefficient', description: 'complex field coefficient (the field observable)' },
        { fieldPath: 'ownerObservations[].rows[].contributionFamily/activationStatus/activationMode/baselineInclusionStatus', description: 'activation/baseline statuses' },
      ],
      strippedFields: [
        'carrierUnit', 'signedCarrier', 'signedLift', 'carrierRay', 'sharedCarrierRay',
        'sourceChildSignedLift', 'complementChildSignedLift', 'sourceCarrierRay', 'complementCarrierRay',
        'carrierStateOrTransportResult', 'canonicalLiftId', 'childTokenId', 'complementTokenId',
        'sourceSlotId', 'parentSet', 'projectedSourceSet', 'actionSourceId', 'expectedRecoveredSourceId',
        'childLeftSignedResult', 'sourceLeftSignedResult', 'all carrier-transport rows',
        'every source token / node id / edge id / sample token / contribution id / profile id / envelope id',
        'frequencyRatio label strings (numeric value retained)',
      ],
      rowCounts: {
        nodes: blindedSView.nodes.length,
        edges: blindedSView.edges.length,
        samplePoints: blindedSView.samplePoints.length,
        ownerObservationOwners: blindedSView.ownerObservations.length,
        ownerObservationRows: blindedSView.ownerObservations.reduce(
          (sum, owner) => sum + owner.rows.length,
          0,
        ),
      },
      unitIndexedCoefficientVectorPresent: sUnitVector,
      orientationBearingObservablePresent:
        manifestHasOrientationBearingObservable(blindedSView),
      flagIdentityObservablePresent: manifestHasFlagIdentityObservable(blindedSView),
      leakScan: sLeakScan,
    },
    {
      basisId: 'basis-r-raw-scalar-field-legacy',
      basisNote:
        'Raw scalar field: per-site emitted tuples recomputed from the Pythagorean tetrachord quark regime atoms (the proving emission law), site positions from createSeedShape(tetrahedron) + applyAmboDissection, and inverse-distance scalar field samples via the legacy fieldSampler kernel (weight 1, power 2, epsilon 1e-6) at the locally recomputed 11-point lattice.',
      visibleFields: [
        { fieldPath: 'sites[].anonId', description: 'anonymized site id (P0..P3 primal, S0..S5 child; independent shuffle from basis-s)' },
        { fieldPath: 'sites[].role', description: 'role class (primal | child)' },
        { fieldPath: 'sites[].{x,y,z}', description: 'site position (seed/ambo frame)' },
        { fieldPath: 'sites[].tuple.{amplitude,waveNumber,phase,attenuation}', description: 'the four emitted-tuple numbers' },
        { fieldPath: 'latticeSamples[].{anonSampleId,x,y,z,scalarFieldValue}', description: 'inverse-distance scalar field samples at lattice points' },
      ],
      strippedFields: [
        'vertexId', 'childId', 'label', 'slotId', 'ratioLabel', 'sourceEdgeId', 'complementEdgeId',
        'antipodalChildId', 'channel ids and channel ratio labels', 'assignment provenance statements',
        'no carrier columns present in this substrate (recorded as such)',
      ],
      rowCounts: {
        sites: blindedRView.sites.length,
        latticeSamples: blindedRView.latticeSamples.length,
      },
      unitIndexedCoefficientVectorPresent: rUnitVector,
      orientationBearingObservablePresent:
        manifestHasOrientationBearingObservable(blindedRView),
      flagIdentityObservablePresent: manifestHasFlagIdentityObservable(blindedRView),
      leakScan: rLeakScan,
    },
    {
      basisId: 'basis-d-depropagation-sealed-transforms',
      basisNote:
        'Depropagation: Basis-R observables only, with the sealed transforms applied (one per relation, fixed, no shopping; one shot each). Manifest = Basis-R manifest + the transform list.',
      visibleFields: [
        { fieldPath: 'sites[] (= basis-r sites)', description: 'same visible fields as basis-r' },
        { fieldPath: 'latticeSamples[] (= basis-r lattice)', description: 'same visible fields as basis-r' },
        { fieldPath: 'sealedTransformIds[]', description: 'T_axis, T_lift, T_flag, T_clo, T_hol, T_ori (definitions printed verbatim)' },
      ],
      strippedFields: ['same stripped set as basis-r'],
      rowCounts: {
        sites: blindedDView.sites.length,
        latticeSamples: blindedDView.latticeSamples.length,
        sealedTransforms: blindedDView.sealedTransformIds.length,
      },
      unitIndexedCoefficientVectorPresent: dUnitVector,
      orientationBearingObservablePresent:
        manifestHasOrientationBearingObservable(blindedDView),
      flagIdentityObservablePresent: manifestHasFlagIdentityObservable(blindedDView),
      leakScan: dLeakScan,
    },
  ];

  // -------------------------------------------------------------------------
  // Blind protocol record (scorer-side maps printed for auditor verification)
  // -------------------------------------------------------------------------
  const blindProtocol: PropagationAuditBlindProtocol = {
    seed: PROPAGATION_AUDIT_SEED,
    rngLaw: 'mulberry32',
    streamConsumptionOrder,
    scorerSideNote:
      'Anonymization maps live on the scorer side only: recovery functions are typed against the blinded views and never receive these maps. They are printed here so the auditor can verify the scoring; truth keys come from geometry + the F1/regime construction.',
    basisSNodeMap: [...sNodeAnonByTrueId.entries()]
      .map(([trueId, anonId]) => ({ anonId, trueId }))
      .sort((left, right) => left.anonId.localeCompare(right.anonId)),
    basisSEdgeMap: [...sEdgeAnonByTrueId.entries()]
      .map(([trueId, anonId]) => ({ anonId, trueId }))
      .sort((left, right) => left.anonId.localeCompare(right.anonId)),
    basisSSampleMap: [...sSampleAnonByTrueId.entries()]
      .map(([trueId, anonId]) => ({ anonId, trueId }))
      .sort((left, right) => left.anonId.localeCompare(right.anonId)),
    basisRSiteMap: [...rSiteAnonByTrueId.entries()]
      .map(([trueId, anonId]) => ({ anonId, trueId }))
      .sort((left, right) => left.anonId.localeCompare(right.anonId)),
    basisRLatticeMap: [...rLatticeAnonByTrueId.entries()]
      .map(([trueId, anonId]) => ({ anonId, trueId }))
      .sort((left, right) => left.anonId.localeCompare(right.anonId)),
  };

  // -------------------------------------------------------------------------
  // Integrity (well-formedness only; NO assertion on any r/g value)
  // -------------------------------------------------------------------------
  const expectedCellCount =
    PROPAGATION_AUDIT_RELATION_IDS.length * PROPAGATION_AUDIT_BASIS_IDS.length;

  if (grid.length !== expectedCellCount) {
    pushIssue(
      'grid-cell-count-mismatch',
      `Expected ${expectedCellCount} grid cells (relations x bases), got ${grid.length}.`,
    );
  }

  for (const relationId of PROPAGATION_AUDIT_RELATION_IDS) {
    for (const basisId of PROPAGATION_AUDIT_BASIS_IDS) {
      if (
        !grid.some(
          (cell) => cell.relationId === relationId && cell.basisId === basisId,
        )
      ) {
        pushIssue('grid-cell-missing', `Missing cell ${relationId} x ${basisId}.`);
      }
    }
  }

  for (const cell of grid) {
    if (!cell.procedureNote) {
      pushIssue('grid-cell-missing-procedure', cell.cellId);
    }

    for (const measurement of cell.measurements) {
      if (!Number.isFinite(measurement.real)) {
        pushIssue('non-finite-measurement', `${cell.cellId}:${measurement.measurementKey}`);
      }

      if (
        measurement.structuredControl !== null &&
        measurement.structuredControl.draws !== PROPAGATION_AUDIT_CONTROL_DRAWS
      ) {
        pushIssue(
          'structured-control-draw-count-mismatch',
          `${cell.cellId}:${measurement.measurementKey}`,
        );
      }

      if (
        measurement.allControl !== null &&
        measurement.allControl.draws !== PROPAGATION_AUDIT_CONTROL_DRAWS
      ) {
        pushIssue(
          'all-control-draw-count-mismatch',
          `${cell.cellId}:${measurement.measurementKey}`,
        );
      }
    }
  }

  for (const row of ledger) {
    if (row.derivationStatus !== '') {
      pushIssue('ledger-derivation-status-not-empty', row.ledgerId);
    }
  }

  for (const manifest of manifests) {
    if (manifest.leakScan.hitCount > 0) {
      pushIssue(
        'leak-scan-hit',
        `${manifest.basisId}: ${manifest.leakScan.hitCount} leak-scan hits; affected cells voided.`,
      );
    }
  }

  const report: PropagationFieldActivitySurvivalAuditV0Report = {
    reportId: `${PROPAGATION_AUDIT_METHOD}:tetra-hub-route:${auditGraphId}`,
    method: PROPAGATION_AUDIT_METHOD,
    declaredGate: PROPAGATION_AUDIT_DECLARED_GATE,
    diagnosticScope: 'computes-and-reports-only',
    routeScope: 'tetra-hub-route-only',
    octaFieldActivityStatus: 'blocked-until-octa-field-stack',
    consumedSubstrates: [
      'fanoOctonionicCarrierGraphFieldV0 (F1, READ-ONLY)',
      'fanoOctonionicSpatialSupportProjectionV0 (F2, READ-ONLY)',
      'fanoOctonionicGenerationalFieldUpdateV0 (G0, READ-ONLY)',
      'fieldSourcePythagoreanTetrachordQuarkRegimeV0 (emission law, READ-ONLY)',
      'createSeedShape + applyAmboDissection (geometry, READ-ONLY)',
      'fieldSampler (legacy inverse-distance kernel, READ-ONLY)',
    ],
    notConsumedSourceStateReports: [
      'structuredSourceStateMultiProjectionStructuralChannelV0 (concept anchor only; report NOT consumed)',
      'medialDualEquivariantCarrierPolicyModelCardV0 (NOT consumed)',
      'hubLayerSourceStateCapsuleV0 (NOT consumed)',
      'medialCarrierSourceStateSurvivalAuditV0/V1 (NOT consumed)',
    ],
    auditGraphId,
    nonAuditedGraphIds,
    manifests,
    blindProtocol,
    grid,
    sealedTransformOutcomes: sealedOutcomes,
    g0Cell,
    anomalyLedger: ledger,
    integrityIssueCount: integrityIssues.length,
    integrityIssues,
    verdictStatus:
      'no-status-assigned-auditor-classifies-against-hash-committed-rule',
    ok: integrityIssues.length === 0,
  };

  return report;
}

// ---------------------------------------------------------------------------
// Geometry extraction (Basis-R/D frame)
// ---------------------------------------------------------------------------

interface CoreFaceGeometry {
  faceClass: 'parent-face-class' | 'parent-vertex-class';
  parentVertexLabel: string | null;
  childIdsInCycleOrder: [string, string, string];
  anonNote: string;
}

interface AmboGeometry {
  primalLabels: string[];
  primalPositionByLabel: Map<string, Coordinate3>;
  childIds: string[];
  childPositionById: Map<string, Coordinate3>;
  coreFaces: CoreFaceGeometry[];
  positiveClassFrame: Array<{ parentVertexLabel: string; unitNormal: Coordinate3 }>;
  equatorialSquares: string[][];
}

function extractAmboGeometry(
  amboShape: Shape,
  pushIssue: (code: string, message: string) => void,
): AmboGeometry {
  const primalLabels: string[] = [];
  const primalPositionByLabel = new Map<string, Coordinate3>();
  const childIds: string[] = [];
  const childPositionById = new Map<string, Coordinate3>();
  const childIdByVertexId = new Map<string, string>();
  const labelByVertexId = new Map<string, string>();

  for (const vertex of Object.values(amboShape.vertices)) {
    const label = vertex.data.label.trim();
    labelByVertexId.set(vertex.id, label);

    if (vertex.createdBy.operation === 'ambo-dissection') {
      const childId = `M_${label}`;
      childIds.push(childId);
      childPositionById.set(childId, coordFromVec3(vertex.position));
      childIdByVertexId.set(vertex.id, childId);
    } else {
      primalLabels.push(label);
      primalPositionByLabel.set(label, coordFromVec3(vertex.position));
    }
  }

  primalLabels.sort();
  childIds.sort();

  if (primalLabels.length !== 4 || childIds.length !== 6) {
    pushIssue(
      'ambo-geometry-site-count-mismatch',
      `Expected 4 primal + 6 child sites from seed+ambo, got ${primalLabels.length}+${childIds.length}.`,
    );
  }

  const coreCell = amboShape.cells.find((cell) => cell.kind === 'core');
  const coreFaces: CoreFaceGeometry[] = [];
  const positiveClassFrame: Array<{
    parentVertexLabel: string;
    unitNormal: Coordinate3;
  }> = [];

  if (!coreCell) {
    pushIssue('ambo-core-cell-missing', 'No core cell found in the ambo shape.');
  } else {
    const coreFaceRows = amboShape.faces.filter(
      (face) => face.sourceCellId === coreCell.id,
    );

    for (const face of coreFaceRows) {
      const cycleChildIds = face.vertexIds.map(
        (vertexId) => childIdByVertexId.get(vertexId) ?? 'unknown',
      );

      if (cycleChildIds.length !== 3 || cycleChildIds.includes('unknown')) {
        pushIssue('ambo-core-face-not-child-triangle', face.id);
        continue;
      }

      const isVertexClass = Boolean(face.sourceVertexId);
      const parentVertexLabel = face.sourceVertexId
        ? labelByVertexId.get(face.sourceVertexId) ?? null
        : null;
      coreFaces.push({
        faceClass: isVertexClass ? 'parent-vertex-class' : 'parent-face-class',
        parentVertexLabel,
        childIdsInCycleOrder: [
          cycleChildIds[0],
          cycleChildIds[1],
          cycleChildIds[2],
        ],
        anonNote: cycleChildIds.join(', '),
      });

      if (isVertexClass && parentVertexLabel) {
        const positions = cycleChildIds.map(
          (childId) => childPositionById.get(childId) as Coordinate3,
        );
        const faceCentroid = scale3(
          add3(add3(positions[0], positions[1]), positions[2]),
          1 / 3,
        );
        const rawNormal = cross3(
          subtract3(positions[1], positions[0]),
          subtract3(positions[2], positions[1]),
        );
        const outwardNormal =
          dot3(rawNormal, faceCentroid) >= 0 ? rawNormal : scale3(rawNormal, -1);
        positiveClassFrame.push({
          parentVertexLabel,
          unitNormal: normalize3(outwardNormal),
        });
      }
    }

    if (coreFaces.length !== 8) {
      pushIssue(
        'ambo-core-face-count-mismatch',
        `Expected 8 core faces, got ${coreFaces.length}.`,
      );
    }

    if (positiveClassFrame.length !== 4) {
      pushIssue(
        'positive-class-frame-count-mismatch',
        `Expected 4 positive-class (parent-vertex-class) face normals, got ${positiveClassFrame.length}.`,
      );
    }

    positiveClassFrame.sort((left, right) =>
      left.parentVertexLabel.localeCompare(right.parentVertexLabel),
    );
  }

  const childCentroid = computeCentroid(
    childIds.map((childId) => childPositionById.get(childId) as Coordinate3),
  );
  const equatorialSquares: string[][] = [];
  const axes: Array<keyof Coordinate3> = ['x', 'y', 'z'];

  for (const axis of axes) {
    const planeChildren = childIds.filter((childId) => {
      const position = childPositionById.get(childId) as Coordinate3;

      return Math.abs(position[axis] - childCentroid[axis]) < 1e-9;
    });

    if (planeChildren.length === 4) {
      const ordered = [...planeChildren].sort((left, right) => {
        const angleOf = (childId: string): number => {
          const position = subtract3(
            childPositionById.get(childId) as Coordinate3,
            childCentroid,
          );
          const planar =
            axis === 'x'
              ? { a: position.y, b: position.z }
              : axis === 'y'
                ? { a: position.z, b: position.x }
                : { a: position.x, b: position.y };

          return Math.atan2(planar.b, planar.a);
        };

        return angleOf(left) - angleOf(right);
      });
      equatorialSquares.push(ordered);
    }
  }

  if (equatorialSquares.length !== 3) {
    pushIssue(
      'equatorial-square-count-mismatch',
      `Expected 3 equatorial squares, got ${equatorialSquares.length}.`,
    );
  }

  return {
    primalLabels,
    primalPositionByLabel,
    childIds,
    childPositionById,
    coreFaces,
    positiveClassFrame,
    equatorialSquares,
  };
}

function computeCentroid(points: Coordinate3[]): Coordinate3 {
  const sum = points.reduce(
    (accumulator, point) => add3(accumulator, point),
    { x: 0, y: 0, z: 0 },
  );

  return scale3(sum, 1 / Math.max(1, points.length));
}

// ---------------------------------------------------------------------------
// Blinded view construction
// ---------------------------------------------------------------------------

function buildBlindedSView(args: {
  auditNodeRows: FanoCarrierGraphNodeRow[];
  auditEdgeRows: FanoCarrierGraphEdgeRow[];
  auditSamplePointRows: FanoSpatialSamplePointRow[];
  auditContributionRows: FanoFieldContributionSampleRow[];
  sNodeAnonByTrueId: Map<string, string>;
  sEdgeAnonByTrueId: Map<string, string>;
  sSampleAnonByTrueId: Map<string, string>;
  anchorByNodeId: Map<string, Coordinate3>;
  pushIssue: (code: string, message: string) => void;
}): BlindedSView {
  const nodes: BlindedSNode[] = args.auditNodeRows
    .map((row) => {
      const anchor = args.anchorByNodeId.get(row.nodeId);

      if (!anchor) {
        args.pushIssue('node-anchor-missing', row.nodeId);
      }

      return {
        anonId: args.sNodeAnonByTrueId.get(row.nodeId) ?? 'unmapped',
        role:
          row.nodeRole === 'primal-source-node'
            ? ('primal' as const)
            : ('child' as const),
        anchor: anchor ?? { x: 0, y: 0, z: 0 },
      };
    })
    .sort((left, right) => left.anonId.localeCompare(right.anonId));

  const edges: BlindedSEdge[] = args.auditEdgeRows
    .map((row) => {
      const actionNodeId =
        row.edgeFamily === 'parent-return-edge' ||
        row.edgeFamily === 'projection-loop-edge'
          ? row.actionNodeId
          : null;

      return {
        anonEdgeId: args.sEdgeAnonByTrueId.get(row.edgeId) ?? 'unmapped',
        family: row.edgeFamily,
        sourceAnonIds: row.sourceNodeIds.map(
          (nodeId) => args.sNodeAnonByTrueId.get(nodeId) ?? 'unmapped',
        ),
        targetAnonIds: row.targetNodeIds.map(
          (nodeId) => args.sNodeAnonByTrueId.get(nodeId) ?? 'unmapped',
        ),
        actionAnonId: actionNodeId
          ? args.sNodeAnonByTrueId.get(actionNodeId) ?? 'unmapped'
          : null,
        weight: row.weight,
        activationStatus: row.activationStatus,
      };
    })
    .sort((left, right) => left.anonEdgeId.localeCompare(right.anonEdgeId));

  const samplePoints: BlindedSSamplePoint[] = args.auditSamplePointRows
    .map((row) => ({
      anonSampleId: args.sSampleAnonByTrueId.get(row.samplePointId) ?? 'unmapped',
      x: row.coordinate.x,
      y: row.coordinate.y,
      z: row.coordinate.z,
    }))
    .sort((left, right) => left.anonSampleId.localeCompare(right.anonSampleId));

  const rowsByOwner = new Map<string, BlindedSObservationRow[]>();
  const ownerKinds = new Map<string, 'node' | 'edge'>();

  for (const row of args.auditContributionRows) {
    const ownerAnonId =
      row.ownerKind === 'node'
        ? args.sNodeAnonByTrueId.get(row.ownerId)
        : args.sEdgeAnonByTrueId.get(row.ownerId);

    if (!ownerAnonId) {
      args.pushIssue('contribution-owner-unmapped', row.contributionId);
      continue;
    }

    ownerKinds.set(ownerAnonId, row.ownerKind);
    const observationRows = rowsByOwner.get(ownerAnonId) ?? [];
    observationRows.push({
      anonSampleId: args.sSampleAnonByTrueId.get(row.samplePointId) ?? 'unmapped',
      supportValue: row.supportValue,
      supportDistance: row.supportDistance,
      weight: row.weight,
      amplitude: row.amplitude,
      attenuation: row.attenuation,
      attenuationFactor: row.attenuationFactor,
      effectiveAmplitude: row.effectiveAmplitude,
      phaseRadiansAtT0: row.phaseRadiansAtT0,
      frequencyRatioValue:
        row.frequencyRatio.numerator / row.frequencyRatio.denominator,
      realCoefficient: row.realCoefficient,
      imagCoefficient: row.imagCoefficient,
      contributionFamily: row.contributionFamily,
      activationStatus: row.activationStatus,
      activationMode: row.activationMode,
      baselineInclusionStatus: row.baselineInclusionStatus,
    });
    rowsByOwner.set(ownerAnonId, observationRows);
  }

  const ownerObservations: BlindedSOwnerObservations[] = [...rowsByOwner.entries()]
    .map(([ownerAnonId, rows]) => ({
      ownerAnonId,
      ownerKind: ownerKinds.get(ownerAnonId) ?? ('node' as const),
      rows: rows.sort((left, right) =>
        left.anonSampleId.localeCompare(right.anonSampleId),
      ),
    }))
    .sort((left, right) => left.ownerAnonId.localeCompare(right.ownerAnonId));

  return {
    basisId: 'basis-s-structural-channel-recomputed-from-f1-f2',
    nodes,
    edges,
    samplePoints,
    ownerObservations,
  };
}

function buildBlindedRView(args: {
  geometry: AmboGeometry;
  regimePrimalRows: PythagoreanTetrachordPrimalSourceRecord[];
  regimeChildRows: PythagoreanTetrachordChildDerivationRecord[];
  amboShape: Shape;
  rSiteAnonByTrueId: Map<string, string>;
  rLatticeAnonByTrueId: Map<string, string>;
  pushIssue: (code: string, message: string) => void;
}): BlindedRView {
  const sites: BlindedRSite[] = [];

  for (const primalRow of args.regimePrimalRows) {
    const position = args.geometry.primalPositionByLabel.get(primalRow.vertexId);

    if (!position) {
      args.pushIssue('regime-primal-position-missing', primalRow.vertexId);
      continue;
    }

    sites.push({
      anonId: args.rSiteAnonByTrueId.get(primalRow.vertexId) ?? 'unmapped',
      role: 'primal',
      x: position.x,
      y: position.y,
      z: position.z,
      tuple: {
        amplitude: primalRow.amplitude,
        waveNumber: primalRow.waveNumber,
        phase: primalRow.phase,
        attenuation: primalRow.attenuation,
      },
    });
  }

  for (const childRow of args.regimeChildRows) {
    const position = args.geometry.childPositionById.get(childRow.childId);

    if (!position) {
      args.pushIssue('regime-child-position-missing', childRow.childId);
      continue;
    }

    if (!childRow.derivedTuple) {
      continue;
    }

    sites.push({
      anonId: args.rSiteAnonByTrueId.get(childRow.childId) ?? 'unmapped',
      role: 'child',
      x: position.x,
      y: position.y,
      z: position.z,
      tuple: {
        amplitude: childRow.derivedTuple.amplitude,
        waveNumber: childRow.derivedTuple.waveNumber,
        phase: childRow.derivedTuple.phase,
        attenuation: childRow.derivedTuple.attenuation,
      },
    });
  }

  sites.sort((left, right) => left.anonId.localeCompare(right.anonId));

  const fieldSources = buildFieldSources(args.amboShape);
  const latticeEntries: Array<{ trueId: string; point: Coordinate3 }> = [
    ...args.geometry.primalLabels.map((labelValue) => ({
      trueId: `lattice:${labelValue}`,
      point: args.geometry.primalPositionByLabel.get(labelValue) as Coordinate3,
    })),
    ...args.geometry.childIds.map((childId) => ({
      trueId: `lattice:${childId}`,
      point: args.geometry.childPositionById.get(childId) as Coordinate3,
    })),
    { trueId: 'lattice:centroid', point: { x: 0, y: 0, z: 0 } },
  ];

  const latticeSamples: BlindedRLatticeSample[] = latticeEntries
    .map((entry) => ({
      anonSampleId: args.rLatticeAnonByTrueId.get(entry.trueId) ?? 'unmapped',
      x: entry.point.x,
      y: entry.point.y,
      z: entry.point.z,
      scalarFieldValue: sampleFieldAtPoint(fieldSources, [
        entry.point.x,
        entry.point.y,
        entry.point.z,
      ]),
    }))
    .sort((left, right) => left.anonSampleId.localeCompare(right.anonSampleId));

  return {
    basisId: 'basis-r-raw-scalar-field-legacy',
    sites,
    latticeSamples,
  };
}

// ---------------------------------------------------------------------------
// Manifest absence inventories (runtime scans, not hard-coded conclusions)
// ---------------------------------------------------------------------------

function scanForUnitIndexedCoefficientVector(view: unknown): boolean {
  // A unit-indexed coefficient vector would be a per-site numeric array of
  // length 7 (one coefficient per imaginary unit). Scan every array reachable
  // in the view for numeric arrays of length 7.
  let found = false;

  const walk = (value: unknown): void => {
    if (found) {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 7 && value.every((item) => typeof item === 'number')) {
        found = true;

        return;
      }

      value.forEach(walk);

      return;
    }

    if (value !== null && typeof value === 'object') {
      Object.values(value as Record<string, unknown>).forEach(walk);
    }
  };

  walk(view);

  return found;
}

function manifestHasOrientationBearingObservable(view: unknown): boolean {
  // An orientation-bearing observable would be a field keyed as an ordered
  // triple or signed cycle (a per-record array of exactly 3 site references
  // carrying a sign, or any field name declaring orientation/handedness).
  let found = false;

  const walk = (value: unknown): void => {
    if (found || value === null || typeof value !== 'object') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(walk);

      return;
    }

    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (/orientation|handedness|cycleSign|tripleSign/i.test(key)) {
        found = true;

        return;
      }

      walk(child);
    }
  };

  walk(view);

  return found;
}

function manifestHasFlagIdentityObservable(view: unknown): boolean {
  // A flag-identity observable would be a per-site field carrying an ordered
  // index pair over the four A3 indices.
  let found = false;

  const walk = (value: unknown): void => {
    if (found || value === null || typeof value !== 'object') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(walk);

      return;
    }

    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (/orderedFlag|flagId|orderedPair|rootIdentity/i.test(key)) {
        found = true;

        return;
      }

      walk(child);
    }
  };

  walk(view);

  return found;
}

// ---------------------------------------------------------------------------
// Truth keys (scorer side only)
// ---------------------------------------------------------------------------

interface STruth {
  childAnonIds: string[];
  antipodalPairKeys: Set<string>;
  parentPairByChildAnonId: Map<string, Set<string>>;
}

function buildSTruth(args: {
  childNodeRows: FanoCarrierGraphChildNodeRow[];
  sNodeAnonByTrueId: Map<string, string>;
  pushIssue: (code: string, message: string) => void;
}): STruth {
  const anonByToken = new Map<string, string>();

  for (const row of args.childNodeRows) {
    anonByToken.set(
      row.childTokenId,
      args.sNodeAnonByTrueId.get(row.nodeId) ?? 'unmapped',
    );
  }

  const antipodalPairKeys = new Set<string>();
  const parentPairByChildAnonId = new Map<string, Set<string>>();

  for (const row of args.childNodeRows) {
    const selfAnon = anonByToken.get(row.childTokenId);
    const complementAnon = anonByToken.get(row.complementTokenId);

    if (!selfAnon || !complementAnon) {
      args.pushIssue('s-truth-complement-unmapped', row.childTokenId);
      continue;
    }

    antipodalPairKeys.add(unorderedPairKey(selfAnon, complementAnon));

    const parentAnonIds = new Set<string>();

    for (const parentSlot of row.parentSet) {
      const parentNodeId = row.nodeId.replace(
        `:child:${row.childTokenId}`,
        `:primal:${parentSlot}`,
      );
      parentAnonIds.add(args.sNodeAnonByTrueId.get(parentNodeId) ?? 'unmapped');
    }

    parentPairByChildAnonId.set(selfAnon, parentAnonIds);
  }

  return {
    childAnonIds: [...anonByToken.values()].sort(),
    antipodalPairKeys,
    parentPairByChildAnonId,
  };
}

interface RTruth {
  childAnonIds: string[];
  antipodalPairKeys: Set<string>;
  antipodeByAnonId: Map<string, string>;
}

function buildRTruth(args: {
  regimeChildRows: PythagoreanTetrachordChildDerivationRecord[];
  rSiteAnonByTrueId: Map<string, string>;
}): RTruth {
  const antipodalPairKeys = new Set<string>();
  const antipodeByAnonId = new Map<string, string>();
  const childAnonIds: string[] = [];

  for (const row of args.regimeChildRows) {
    const selfAnon = args.rSiteAnonByTrueId.get(row.childId) ?? 'unmapped';
    const otherAnon = args.rSiteAnonByTrueId.get(row.antipodalChildId) ?? 'unmapped';
    childAnonIds.push(selfAnon);
    antipodalPairKeys.add(unorderedPairKey(selfAnon, otherAnon));
    antipodeByAnonId.set(selfAnon, otherAnon);
  }

  return {
    childAnonIds: childAnonIds.sort(),
    antipodalPairKeys,
    antipodeByAnonId,
  };
}

// ---------------------------------------------------------------------------
// Relation 1 recoveries: carrier-ray / antipodal-axis
// ---------------------------------------------------------------------------

function derivedChildPhasesFromSView(
  view: BlindedSView,
  pushIssue: (code: string, message: string) => void,
): Map<string, number> {
  // Declared law: per child, the coefficient phase atan2(imag, real) of the
  // baseline contribution row with maximal supportValue (the own-anchor row).
  // Recomputed from coefficients, not echoed from a stored phase column.
  const phases = new Map<string, number>();
  const childAnonIds = view.nodes
    .filter((node) => node.role === 'child')
    .map((node) => node.anonId);

  for (const anonId of childAnonIds) {
    const owner = view.ownerObservations.find(
      (entry) => entry.ownerAnonId === anonId && entry.ownerKind === 'node',
    );

    if (!owner) {
      pushIssue('s-child-owner-observations-missing', anonId);
      continue;
    }

    const baselineRows = owner.rows.filter(
      (row) => row.contributionFamily === 'baseline-intrinsic-node',
    );

    if (baselineRows.length === 0) {
      pushIssue('s-child-baseline-rows-missing', anonId);
      continue;
    }

    let bestRow = baselineRows[0];

    for (const row of baselineRows) {
      if (row.supportValue > bestRow.supportValue) {
        bestRow = row;
      }
    }

    phases.set(anonId, Math.atan2(bestRow.imagCoefficient, bestRow.realCoefficient));
  }

  return phases;
}

function scoreMatchingByPhaseOpposition(
  matching: PairIndex[],
  ids: string[],
  phaseById: Map<string, number>,
): number {
  let score = 0;

  for (const [left, right] of matching) {
    const phaseLeft = phaseById.get(ids[left]) ?? 0;
    const phaseRight = phaseById.get(ids[right]) ?? 0;
    score += -Math.cos(phaseLeft - phaseRight);
  }

  return score;
}

function computeSAxisCell(args: {
  view: BlindedSView;
  truth: STruth;
  structuredDraws: number[][];
  strictDraws: number[][];
  voided: boolean;
  pushIssue: (code: string, message: string) => void;
  pushLedger: (context: string, measurement: string) => void;
}): PropagationAuditGridCell {
  const childIds = args.view.nodes
    .filter((node) => node.role === 'child')
    .map((node) => node.anonId)
    .sort();
  const phases = derivedChildPhasesFromSView(args.view, args.pushIssue);

  // (a) typed complement adjacency (visible structure)
  const adjacencyPairKeys = new Set<string>();

  for (const edge of args.view.edges) {
    if (edge.family === 'complement-coupling-edge') {
      adjacencyPairKeys.add(
        unorderedPairKey(edge.sourceAnonIds[0], edge.targetAnonIds[0]),
      );
    }
  }

  let adjacencyRecovered = 0;

  for (const pairKey of adjacencyPairKeys) {
    if (args.truth.antipodalPairKeys.has(pairKey)) {
      adjacencyRecovered += 1;
    }
  }

  // (b) field-only pairing by coefficient-phase anti-alignment
  const realPick = pickBestMatching(
    (matching) => scoreMatchingByPhaseOpposition(matching, childIds, phases),
    'max',
  );

  if (realPick.tieDetected) {
    args.pushLedger(
      'matching-tie:basis-s-axis',
      'The phase-opposition matching objective tied across distinct perfect matchings; the first matching in deterministic enumeration order was used.',
    );
  }

  const realFieldScore = matchingOverlapFraction(
    realPick.matching,
    childIds,
    args.truth.antipodalPairKeys,
  );

  // g: phase opposition over TRUE pairs
  const gReal = phaseOppositionOverTruePairs(phases, args.truth.antipodalPairKeys);

  // structured controls: permute child phase payloads among children
  const structuredFieldValues: number[] = [];
  const structuredAdjacencyValues: number[] = [];
  const structuredGValues: number[] = [];

  for (const permutation of args.structuredDraws) {
    const permutedPhases = permutePayloads(childIds, phases, permutation);
    const pick = pickBestMatching(
      (matching) => scoreMatchingByPhaseOpposition(matching, childIds, permutedPhases),
      'max',
    );
    structuredFieldValues.push(
      fraction(matchingOverlapFraction(pick.matching, childIds, args.truth.antipodalPairKeys)),
    );
    structuredAdjacencyValues.push(adjacencyRecovered / 3);
    structuredGValues.push(
      fraction(phaseOppositionOverTruePairs(permutedPhases, args.truth.antipodalPairKeys)),
    );
  }

  // strict all-control: phases uniform [0, 2pi)
  const strictFieldValues: number[] = [];
  const strictAdjacencyValues: number[] = [];
  const strictGValues: number[] = [];

  for (const strictPhases of args.strictDraws) {
    const phaseMap = new Map<string, number>();
    childIds.forEach((anonId, index) => phaseMap.set(anonId, strictPhases[index]));
    const pick = pickBestMatching(
      (matching) => scoreMatchingByPhaseOpposition(matching, childIds, phaseMap),
      'max',
    );
    strictFieldValues.push(
      fraction(matchingOverlapFraction(pick.matching, childIds, args.truth.antipodalPairKeys)),
    );
    strictAdjacencyValues.push(adjacencyRecovered / 3);
    strictGValues.push(
      fraction(phaseOppositionOverTruePairs(phaseMap, args.truth.antipodalPairKeys)),
    );
  }

  args.pushLedger(
    'adjacency-channel-exposure:basis-s-axis',
    'r-adjacency is recovered from typed complement adjacency (visible structure); payload permutation and payload randomization cannot degrade it, so its control distributions equal the real value by construction. The exposure is reported, not patched.',
  );

  return {
    cellId: 'cell:carrier-ray-antipodal-axis:basis-s',
    relationId: 'carrier-ray-antipodal-axis',
    basisId: 'basis-s-structural-channel-recomputed-from-f1-f2',
    procedureNote:
      'Pair the 6 anonymized child sites two ways. (a) r-adjacency: unordered endpoint pairs of complement-coupling-edge rows (visible typed structure). (b) r-field: over all 15 perfect matchings, maximize sum of -cos(phase difference) where each child phase is recomputed as atan2(imagCoefficient, realCoefficient) of its maximal-supportValue baseline row; score = fraction of true antipodal pairs in the chosen matching. g: fraction of true pairs with cos(phase difference) < 0 (natural midpoint, no tuned threshold).',
    attempted: true,
    statusNote: 'computed',
    measurements: [
      {
        measurementKey: 'r-adjacency',
        kind: 'r',
        real: adjacencyRecovered / 3,
        numerator: adjacencyRecovered,
        denominator: 3,
        structuredControl: controlDistribution(structuredAdjacencyValues),
        allControl: meanControl(strictAdjacencyValues),
        note: 'adjacency-only channel; controls equal real by construction (exposure reported)',
      },
      {
        measurementKey: 'r-field-phase-matching',
        kind: 'r',
        real: fraction(realFieldScore),
        numerator: realFieldScore.numerator,
        denominator: realFieldScore.denominator,
        structuredControl: controlDistribution(structuredFieldValues),
        allControl: meanControl(strictFieldValues),
        note: 'field-only pairing from recomputed coefficient phases',
      },
      {
        measurementKey: 'g-phase-opposition',
        kind: 'g',
        real: fraction(gReal),
        numerator: gReal.numerator,
        denominator: gReal.denominator,
        structuredControl: controlDistribution(structuredGValues),
        allControl: meanControl(strictGValues),
        note: 'sign structure reported separately from the count',
      },
    ],
    voidedByLeak: args.voided,
  };
}

function phaseOppositionOverTruePairs(
  phaseById: Map<string, number>,
  truthPairKeys: Set<string>,
): { numerator: number; denominator: number } {
  let opposed = 0;

  for (const pairKey of truthPairKeys) {
    const [left, right] = pairKey.split('|');
    const phaseLeft = phaseById.get(left);
    const phaseRight = phaseById.get(right);

    if (
      phaseLeft !== undefined &&
      phaseRight !== undefined &&
      Math.cos(phaseLeft - phaseRight) < 0
    ) {
      opposed += 1;
    }
  }

  return { numerator: opposed, denominator: truthPairKeys.size };
}

function permutePayloads<T>(
  ids: string[],
  payloadById: Map<string, T>,
  permutation: number[],
): Map<string, T> {
  const permuted = new Map<string, T>();

  ids.forEach((anonId, index) => {
    const sourceId = ids[permutation[index]];
    const payload = payloadById.get(sourceId);

    if (payload !== undefined) {
      permuted.set(anonId, payload);
    }
  });

  return permuted;
}

function fraction(score: { numerator: number; denominator: number }): number {
  return score.denominator > 0 ? score.numerator / score.denominator : 0;
}

function meanControl(values: number[]): PropagationAuditAllControl {
  return {
    draws: values.length,
    mean: values.reduce((sum, value) => sum + value, 0) / values.length,
  };
}

// ---------------------------------------------------------------------------
// Basis-R axis recovery
// ---------------------------------------------------------------------------

interface EmittedTuple {
  amplitude: number;
  waveNumber: number;
  phase: number;
  attenuation: number;
}

function tupleDistance(left: EmittedTuple, right: EmittedTuple): number {
  const amplitudeDelta = left.amplitude - right.amplitude;
  const waveNumberDelta = left.waveNumber - right.waveNumber;
  const attenuationDelta = left.attenuation - right.attenuation;
  const phaseDelta = circularDistance(left.phase, right.phase);

  return Math.sqrt(
    amplitudeDelta * amplitudeDelta +
      waveNumberDelta * waveNumberDelta +
      attenuationDelta * attenuationDelta +
      phaseDelta * phaseDelta,
  );
}

function computeRAxisCell(args: {
  view: BlindedRView;
  truth: RTruth;
  structuredDraws: number[][];
  strictDraws: Array<Array<EmittedTuple>>;
  voided: boolean;
  pushLedger: (context: string, measurement: string) => void;
}): PropagationAuditGridCell {
  const childSites = args.view.sites.filter((site) => site.role === 'child');
  const childIds = childSites.map((site) => site.anonId);
  const tupleById = new Map<string, EmittedTuple>(
    childSites.map((site) => [site.anonId, site.tuple]),
  );

  const scoreMatching = (
    matching: PairIndex[],
    tuples: Map<string, EmittedTuple>,
  ): number => {
    let total = 0;

    for (const [left, right] of matching) {
      const tupleLeft = tuples.get(childIds[left]);
      const tupleRight = tuples.get(childIds[right]);

      if (tupleLeft && tupleRight) {
        total += tupleDistance(tupleLeft, tupleRight);
      }
    }

    return total;
  };

  const realPick = pickBestMatching(
    (matching) => scoreMatching(matching, tupleById),
    'min',
  );

  if (realPick.tieDetected) {
    args.pushLedger(
      'matching-tie:basis-r-axis',
      'The emitted-tuple-distance matching objective tied across distinct perfect matchings; the first matching in deterministic enumeration order was used.',
    );
  }

  const realScore = matchingOverlapFraction(
    realPick.matching,
    childIds,
    args.truth.antipodalPairKeys,
  );
  const phasesById = new Map<string, number>(
    childSites.map((site) => [site.anonId, site.tuple.phase]),
  );
  const gReal = phaseOppositionOverTruePairs(phasesById, args.truth.antipodalPairKeys);

  const structuredValues: number[] = [];
  const structuredGValues: number[] = [];

  for (const permutation of args.structuredDraws) {
    const permutedTuples = permutePayloads(childIds, tupleById, permutation);
    const pick = pickBestMatching(
      (matching) => scoreMatching(matching, permutedTuples),
      'min',
    );
    structuredValues.push(
      fraction(matchingOverlapFraction(pick.matching, childIds, args.truth.antipodalPairKeys)),
    );
    const permutedPhases = new Map<string, number>();
    permutedTuples.forEach((tuple, anonId) => permutedPhases.set(anonId, tuple.phase));
    structuredGValues.push(
      fraction(phaseOppositionOverTruePairs(permutedPhases, args.truth.antipodalPairKeys)),
    );
  }

  const strictValues: number[] = [];
  const strictGValues: number[] = [];

  for (const strictTuples of args.strictDraws) {
    const tupleMap = new Map<string, EmittedTuple>();
    childIds.forEach((anonId, index) => tupleMap.set(anonId, strictTuples[index]));
    const pick = pickBestMatching(
      (matching) => scoreMatching(matching, tupleMap),
      'min',
    );
    strictValues.push(
      fraction(matchingOverlapFraction(pick.matching, childIds, args.truth.antipodalPairKeys)),
    );
    const strictPhases = new Map<string, number>();
    tupleMap.forEach((tuple, anonId) => strictPhases.set(anonId, tuple.phase));
    strictGValues.push(
      fraction(phaseOppositionOverTruePairs(strictPhases, args.truth.antipodalPairKeys)),
    );
  }

  return {
    cellId: 'cell:carrier-ray-antipodal-axis:basis-r',
    relationId: 'carrier-ray-antipodal-axis',
    basisId: 'basis-r-raw-scalar-field-legacy',
    procedureNote:
      'Over all 15 perfect matchings of the 6 anonymized child sites, minimize total emitted-tuple distance d = sqrt(dAmplitude^2 + dWaveNumber^2 + dAttenuation^2 + (2 sin(dPhase/2))^2); r-field = fraction of true antipodal pairs in the chosen matching. g: fraction of true pairs with cos(dPhase) < 0.',
    attempted: true,
    statusNote: 'computed',
    measurements: [
      {
        measurementKey: 'r-field-tuple-matching',
        kind: 'r',
        real: fraction(realScore),
        numerator: realScore.numerator,
        denominator: realScore.denominator,
        structuredControl: controlDistribution(structuredValues),
        allControl: meanControl(strictValues),
        note: 'field-only pairing from emitted tuples',
      },
      {
        measurementKey: 'g-tuple-phase-opposition',
        kind: 'g',
        real: fraction(gReal),
        numerator: gReal.numerator,
        denominator: gReal.denominator,
        structuredControl: controlDistribution(structuredGValues),
        allControl: meanControl(strictGValues),
        note: 'sign structure reported separately from the count',
      },
    ],
    voidedByLeak: args.voided,
  };
}

// ---------------------------------------------------------------------------
// Basis-D sealed transforms
// ---------------------------------------------------------------------------

function computeDAxisCell(args: {
  view: BlindedDView;
  truth: RTruth;
  structuredDraws: number[][];
  strictDraws: Coordinate3[][];
  voided: boolean;
}): { cell: PropagationAuditGridCell; outcome: PropagationAuditSealedTransformOutcome } {
  const childSites = args.view.sites.filter((site) => site.role === 'child');
  const childIds = childSites.map((site) => site.anonId);
  const positionById = new Map<string, Coordinate3>(
    childSites.map((site) => [site.anonId, { x: site.x, y: site.y, z: site.z }]),
  );

  const runTAxis = (positions: Map<string, Coordinate3>): number => {
    const centroid = computeCentroid(childIds.map((anonId) => positions.get(anonId) as Coordinate3));
    const centered = new Map<string, Coordinate3>(
      childIds.map((anonId) => [
        anonId,
        subtract3(positions.get(anonId) as Coordinate3, centroid),
      ]),
    );
    let correct = 0;

    for (const anonId of childIds) {
      const own = centered.get(anonId) as Coordinate3;
      let partner: string | null = null;
      let bestNorm = Number.POSITIVE_INFINITY;

      for (const otherId of childIds) {
        if (otherId === anonId) {
          continue;
        }

        const candidateNorm = norm3(add3(own, centered.get(otherId) as Coordinate3));

        if (candidateNorm < bestNorm) {
          bestNorm = candidateNorm;
          partner = otherId;
        }
      }

      if (partner !== null && args.truth.antipodeByAnonId.get(anonId) === partner) {
        correct += 1;
      }
    }

    return correct / childIds.length;
  };

  const realValue = runTAxis(positionById);
  const census = childIds.map((anonId) => {
    const centroid = computeCentroid(childIds.map((id) => positionById.get(id) as Coordinate3));
    const own = subtract3(positionById.get(anonId) as Coordinate3, centroid);
    let partner: string | null = null;
    let bestNorm = Number.POSITIVE_INFINITY;

    for (const otherId of childIds) {
      if (otherId === anonId) {
        continue;
      }

      const candidateNorm = norm3(
        add3(own, subtract3(positionById.get(otherId) as Coordinate3, centroid)),
      );

      if (candidateNorm < bestNorm) {
        bestNorm = candidateNorm;
        partner = otherId;
      }
    }

    const axis = partner
      ? normalize3(subtract3(own, subtract3(positionById.get(partner) as Coordinate3, centroid)))
      : { x: 0, y: 0, z: 0 };

    return `${anonId}: partner=${partner ?? 'none'}, ||x+y||=${bestNorm.toFixed(6)}, axis=(${axis.x.toFixed(4)}, ${axis.y.toFixed(4)}, ${axis.z.toFixed(4)})`;
  });

  const structuredValues = args.structuredDraws.map((permutation) =>
    runTAxis(permutePayloads(childIds, positionById, permutation)),
  );
  const strictValues = args.strictDraws.map((strictPositions) => {
    const positionMap = new Map<string, Coordinate3>();
    childIds.forEach((anonId, index) => positionMap.set(anonId, strictPositions[index]));

    return runTAxis(positionMap);
  });

  return {
    cell: {
      cellId: 'cell:carrier-ray-antipodal-axis:basis-d',
      relationId: 'carrier-ray-antipodal-axis',
      basisId: 'basis-d-depropagation-sealed-transforms',
      procedureNote:
        'T_axis applied to the 6 child site positions (the relation pairs the 6 generated midpoints): center by centroid; partner(x) = argmin_y ||x + y||; recovered axis = normalize(x - y). r = fraction of sites whose recovered partner is the true antipodal child. g: not defined for T_axis (the recovered axis is unsigned); reported null.',
      attempted: true,
      statusNote: 'computed',
      measurements: [
        {
          measurementKey: 'r-t-axis-partner',
          kind: 'r',
          real: realValue,
          numerator: Math.round(realValue * childIds.length),
          denominator: childIds.length,
          structuredControl: controlDistribution(structuredValues),
          allControl: meanControl(strictValues),
          note: 'sealed transform T_axis, one shot',
        },
      ],
      voidedByLeak: args.voided,
    },
    outcome: {
      transformId: 'T_axis',
      definitionVerbatim: SEALED_DEPROPAGATION_TRANSFORMS.tAxis,
      applied: true,
      outcomeNote: `Applied to the 6 child positions; partner recovery ${Math.round(realValue * childIds.length)}/${childIds.length}. The recovered axis is unsigned, so no g component exists for this transform.`,
      perItemCensus: census,
    },
  };
}

function computeDFlagCell(args: {
  view: BlindedDView;
  geometry: AmboGeometry;
  rSiteAnonByTrueId: Map<string, string>;
  structuredDraws: number[][];
  strictDraws: Coordinate3[][];
  voided: boolean;
  pushLedger: (context: string, measurement: string) => void;
}): { cell: PropagationAuditGridCell; outcome: PropagationAuditSealedTransformOutcome } {
  const childSites = args.view.sites.filter((site) => site.role === 'child');
  const childIds = childSites.map((site) => site.anonId);
  const positionById = new Map<string, Coordinate3>(
    childSites.map((site) => [site.anonId, { x: site.x, y: site.y, z: site.z }]),
  );
  const frame = args.geometry.positiveClassFrame;
  const tolerance = 1e-9;

  const runTFlag = (
    positions: Map<string, Coordinate3>,
  ): { matchedCount: number; census: string[] } => {
    const centroid = computeCentroid(
      childIds.map((anonId) => positions.get(anonId) as Coordinate3),
    );
    let matchedCount = 0;
    const census: string[] = [];

    for (const anonId of childIds) {
      const anchor = subtract3(positions.get(anonId) as Coordinate3, centroid);
      const matches: string[] = [];

      for (let i = 0; i < frame.length; i += 1) {
        for (let j = 0; j < frame.length; j += 1) {
          if (i === j) {
            continue;
          }

          const difference = subtract3(frame[i].unitNormal, frame[j].unitNormal);

          if (norm3(subtract3(anchor, difference)) <= tolerance) {
            matches.push(`(u${i + 1}, u${j + 1})`);
          }
        }
      }

      if (matches.length === 1) {
        matchedCount += 1;
        census.push(`${anonId}: exact match ${matches[0]}`);
      } else if (matches.length === 0) {
        census.push(`${anonId}: no-exact-match`);
      } else {
        census.push(`${anonId}: non-unique matches [${matches.join(', ')}]`);
      }
    }

    return { matchedCount, census };
  };

  const realRun = runTFlag(positionById);
  const realValue = realRun.matchedCount / childIds.length;

  if (realRun.matchedCount === 0) {
    args.pushLedger(
      't-flag-census',
      `T_flag produced no-exact-match for ${childIds.length}/${childIds.length} child anchors against the positive-class face-normal frame (exact tolerance 1e-9). Raw census reported; one shot, no rescaling attempted.`,
    );
  }

  const structuredValues = args.structuredDraws.map(
    (permutation) =>
      runTFlag(permutePayloads(childIds, positionById, permutation)).matchedCount /
      childIds.length,
  );
  const strictValues = args.strictDraws.map((strictPositions) => {
    const positionMap = new Map<string, Coordinate3>();
    childIds.forEach((anonId, index) => positionMap.set(anonId, strictPositions[index]));

    return runTFlag(positionMap).matchedCount / childIds.length;
  });

  const frameNote = frame
    .map(
      (entry, index) =>
        `u${index + 1}=(${entry.unitNormal.x.toFixed(6)}, ${entry.unitNormal.y.toFixed(6)}, ${entry.unitNormal.z.toFixed(6)})`,
    )
    .join('; ');

  return {
    cell: {
      cellId: 'cell:ordered-flag-identity:basis-d',
      relationId: 'ordered-flag-identity',
      basisId: 'basis-d-depropagation-sealed-transforms',
      procedureNote:
        `T_flag exactly as sealed: recovered anchor a := centered child site position; solve a = u_i - u_j over the fixed octa face-normal frame {u_1..u_4} = the four positive-class (parent-vertex-class) outward unit face normals of the G1 octahedral core, computed from geometry. Exact match tolerance 1e-9; one shot. Frame: ${frameNote}.`,
      attempted: true,
      statusNote: 'computed',
      measurements: [
        {
          measurementKey: 'r-t-flag-exact-match',
          kind: 'r',
          real: realValue,
          numerator: realRun.matchedCount,
          denominator: childIds.length,
          structuredControl: controlDistribution(structuredValues),
          allControl: meanControl(strictValues),
          note: 'sealed transform T_flag, one shot; per-site census printed',
        },
      ],
      voidedByLeak: args.voided,
    },
    outcome: {
      transformId: 'T_flag',
      definitionVerbatim: SEALED_DEPROPAGATION_TRANSFORMS.tFlag,
      applied: true,
      outcomeNote: `Applied to the 6 centered child anchors against the derived positive-class frame; exact matches ${realRun.matchedCount}/${childIds.length}.`,
      perItemCensus: realRun.census,
    },
  };
}

function computeDOriCell(args: {
  view: BlindedDView;
  geometry: AmboGeometry;
  structuredDraws: number[][];
  strictDraws: Coordinate3[][];
  voided: boolean;
}): { cell: PropagationAuditGridCell; outcome: PropagationAuditSealedTransformOutcome } {
  const childSites = args.view.sites.filter((site) => site.role === 'child');
  const childIds = childSites.map((site) => site.anonId);
  const positionById = new Map<string, Coordinate3>(
    childSites.map((site) => [site.anonId, { x: site.x, y: site.y, z: site.z }]),
  );
  // Triangles: the 8 core faces, vertex cycles in construction order,
  // expressed in anon ids via scorer-side position matching (exact values,
  // both sides read the same geometry map).
  const anonIdByTrueChildId = new Map<string, string>();

  for (const [trueId, position] of args.geometry.childPositionById.entries()) {
    for (const site of childSites) {
      if (
        Math.abs(site.x - position.x) < 1e-12 &&
        Math.abs(site.y - position.y) < 1e-12 &&
        Math.abs(site.z - position.z) < 1e-12
      ) {
        anonIdByTrueChildId.set(trueId, site.anonId);
      }
    }
  }

  const triangles = args.geometry.coreFaces.map((face) =>
    face.childIdsInCycleOrder.map(
      (trueChildId) => anonIdByTrueChildId.get(trueChildId) ?? 'unmapped',
    ),
  );

  const runTOri = (
    positions: Map<string, Coordinate3>,
  ): { nonZeroCount: number; outwardMatchCount: number; census: string[] } => {
    const centroid = computeCentroid(
      childIds.map((anonId) => positions.get(anonId) as Coordinate3),
    );
    let nonZeroCount = 0;
    let outwardMatchCount = 0;
    const census: string[] = [];

    triangles.forEach((triangle, index) => {
      const [p1, p2, p3] = triangle.map((anonId) =>
        subtract3(positions.get(anonId) as Coordinate3, centroid),
      );
      const tripleProduct = dot3(p1, cross3(p2, p3));
      const recoveredSign = Math.sign(tripleProduct);

      if (recoveredSign !== 0) {
        nonZeroCount += 1;
      }

      // Outward truth: the boundary orientation of the octahedral core gives
      // every face cycle an outward normal; truth sign := +1 (outward).
      if (recoveredSign === 1) {
        outwardMatchCount += 1;
      }

      census.push(
        `triangle ${index + 1}/8 [${triangle.join(', ')}]: triple=${tripleProduct.toFixed(6)}, recovered sign=${recoveredSign}`,
      );
    });

    return { nonZeroCount, outwardMatchCount, census };
  };

  const realRun = runTOri(positionById);
  const rReal = realRun.nonZeroCount / triangles.length;
  const gReal = realRun.outwardMatchCount / triangles.length;

  const structuredR: number[] = [];
  const structuredG: number[] = [];

  for (const permutation of args.structuredDraws) {
    const run = runTOri(permutePayloads(childIds, positionById, permutation));
    structuredR.push(run.nonZeroCount / triangles.length);
    structuredG.push(run.outwardMatchCount / triangles.length);
  }

  const strictR: number[] = [];
  const strictG: number[] = [];

  for (const strictPositions of args.strictDraws) {
    const positionMap = new Map<string, Coordinate3>();
    childIds.forEach((anonId, index) => positionMap.set(anonId, strictPositions[index]));
    const run = runTOri(positionMap);
    strictR.push(run.nonZeroCount / triangles.length);
    strictG.push(run.outwardMatchCount / triangles.length);
  }

  return {
    cell: {
      cellId: 'cell:orientation-sign:basis-d',
      relationId: 'orientation-sign',
      basisId: 'basis-d-depropagation-sealed-transforms',
      procedureNote:
        'T_ori: sign of the scalar triple product p1 . (p2 x p3) of the three centered triangle anchors, per octahedral core face, anchors taken in the face construction cycle order (geometric structure, carrier-free). Truth: outward boundary orientation derived from geometry (truth sign +1 for every face). r = fraction of triangles with non-zero triple product; g = fraction matching outward truth.',
      attempted: true,
      statusNote: 'computed',
      measurements: [
        {
          measurementKey: 'r-t-ori-nonzero',
          kind: 'r',
          real: rReal,
          numerator: realRun.nonZeroCount,
          denominator: triangles.length,
          structuredControl: controlDistribution(structuredR),
          allControl: meanControl(strictR),
          note: 'sealed transform T_ori, one shot',
        },
        {
          measurementKey: 'g-t-ori-outward-match',
          kind: 'g',
          real: gReal,
          numerator: realRun.outwardMatchCount,
          denominator: triangles.length,
          structuredControl: controlDistribution(structuredG),
          allControl: meanControl(strictG),
          note: 'orientation accuracy reported separately from the count',
        },
      ],
      voidedByLeak: args.voided,
    },
    outcome: {
      transformId: 'T_ori',
      definitionVerbatim: SEALED_DEPROPAGATION_TRANSFORMS.tOri,
      applied: true,
      outcomeNote: `Applied to the 8 octahedral core face triangles; non-zero ${realRun.nonZeroCount}/8, outward-match ${realRun.outwardMatchCount}/8.`,
      perItemCensus: realRun.census,
    },
  };
}

function sortSealedOutcomes(
  outcomes: PropagationAuditSealedTransformOutcome[],
): void {
  const order = ['T_axis', 'T_lift', 'T_flag', 'T_clo', 'T_hol', 'T_ori'];
  outcomes.sort(
    (left, right) => order.indexOf(left.transformId) - order.indexOf(right.transformId),
  );
}

// ---------------------------------------------------------------------------
// Birth-structure recovery (auxiliary data on the tetra provenance row)
// ---------------------------------------------------------------------------

function computeBirthStructureRecovery(args: {
  view: BlindedSView;
  truth: STruth;
  structuredDrawCount: number;
  voided: boolean;
  pushLedger: (context: string, measurement: string) => void;
}): PropagationAuditMeasurement[] {
  const recoveredParentsByChild = new Map<string, Set<string>>();

  for (const edge of args.view.edges) {
    if (edge.family === 'birth-edge') {
      const childAnonId = edge.targetAnonIds[0];
      recoveredParentsByChild.set(childAnonId, new Set(edge.sourceAnonIds));
    }
  }

  let recovered = 0;
  const childCount = args.truth.parentPairByChildAnonId.size;

  for (const [childAnonId, trueParents] of args.truth.parentPairByChildAnonId) {
    const recoveredParents = recoveredParentsByChild.get(childAnonId);

    if (
      recoveredParents &&
      recoveredParents.size === trueParents.size &&
      [...trueParents].every((parent) => recoveredParents.has(parent))
    ) {
      recovered += 1;
    }
  }

  const realValue = childCount > 0 ? recovered / childCount : 0;
  const controlValues = Array.from(
    { length: args.structuredDrawCount },
    () => realValue,
  );

  args.pushLedger(
    'adjacency-channel-exposure:birth-structure',
    'Birth-structure parent-pair recovery is adjacency-only (typed birth edges); payload permutation and payload randomization cannot degrade it, so its control distributions equal the real value by construction. The exposure is reported, not patched.',
  );

  return [
    {
      measurementKey: 'r-adjacency-birth-parent-pair',
      kind: 'r',
      real: realValue,
      numerator: recovered,
      denominator: childCount,
      structuredControl: controlDistribution(controlValues),
      allControl: meanControl(controlValues),
      note: 'adjacency-only channel; controls equal real by construction (exposure reported)',
    },
  ];
}

// ---------------------------------------------------------------------------
// G0 exploratory cell
// ---------------------------------------------------------------------------

function computeG0Cell(args: {
  g0Report: ReturnType<typeof buildFanoOctonionicGenerationalFieldUpdateV0Report>;
  auditGraphId: string;
  f2SamplePointRows: FanoSpatialSamplePointRow[];
  pushIssue: (code: string, message: string) => void;
}): PropagationAuditG0Cell {
  const deltaRows = args.g0Report.baselineFieldDeltaRows.filter(
    (row) => row.graphId === args.auditGraphId,
  );
  let maxResidual = 0;

  for (const row of deltaRows) {
    maxResidual = Math.max(
      maxResidual,
      Math.abs(row.realDelta - row.bornSourceContributionRealSum),
      Math.abs(row.imagDelta - row.bornSourceContributionImagSum),
    );
  }

  // Geometrically antipodal sample points: among the F2 sample lattice, the
  // child midpoint samples form antipodal coordinate pairs; find all unordered
  // pairs (p, q) with coordinate(p) = -coordinate(q) and |p| > 0.
  const pointById = new Map(
    args.f2SamplePointRows.map((row) => [row.samplePointId, row.coordinate]),
  );
  const antipodalPairs: Array<[string, string]> = [];
  const sampleIds = [...pointById.keys()].sort();

  for (let leftIndex = 0; leftIndex < sampleIds.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < sampleIds.length; rightIndex += 1) {
      const left = pointById.get(sampleIds[leftIndex]) as { x: number; y: number; z: number };
      const right = pointById.get(sampleIds[rightIndex]) as { x: number; y: number; z: number };
      const isAntipodal =
        Math.abs(left.x + right.x) < 1e-12 &&
        Math.abs(left.y + right.y) < 1e-12 &&
        Math.abs(left.z + right.z) < 1e-12 &&
        Math.abs(left.x) + Math.abs(left.y) + Math.abs(left.z) > 1e-12;

      if (isAntipodal) {
        antipodalPairs.push([sampleIds[leftIndex], sampleIds[rightIndex]]);
      }
    }
  }

  const deltaBySamplePointId = new Map(
    deltaRows.map((row) => [row.samplePointId, row]),
  );
  let phaseOpposedCount = 0;
  const pairCensus: string[] = [];

  for (const [leftId, rightId] of antipodalPairs) {
    const leftDelta = deltaBySamplePointId.get(leftId);
    const rightDelta = deltaBySamplePointId.get(rightId);

    if (!leftDelta || !rightDelta) {
      args.pushIssue('g0-delta-row-missing-for-antipodal-pair', `${leftId}|${rightId}`);
      continue;
    }

    const leftPhase = Math.atan2(leftDelta.imagDelta, leftDelta.realDelta);
    const rightPhase = Math.atan2(rightDelta.imagDelta, rightDelta.realDelta);
    const opposed = Math.cos(leftPhase - rightPhase) < 0;

    if (opposed) {
      phaseOpposedCount += 1;
    }

    pairCensus.push(
      `pair ${shortSampleId(leftId)} <-> ${shortSampleId(rightId)}: deltaPhase cos=${Math.cos(leftPhase - rightPhase).toFixed(6)} -> ${opposed ? 'opposed' : 'not-opposed'}`,
    );
  }

  return {
    cellNote:
      'Exploratory only, no sealed prediction: does baseline(G1) - baseline(G0) = Sum(born) carry any fiber relation? One declared probe: phase opposition of the delta field at geometrically antipodal sample points.',
    auditGraphId: args.auditGraphId,
    deltaRowCount: deltaRows.length,
    maxAbsDeltaMinusBornSumResidual: maxResidual,
    antipodalSamplePairCount: antipodalPairs.length,
    phaseOpposedPairCount: phaseOpposedCount,
    pairCensus,
    mayNotClaimNote:
      'This cell may NOT claim field-activity on its own.',
    cautionVerbatim:
      'aggregate identities can cancel exactly the sign structure under test',
  };
}

function shortSampleId(samplePointId: string): string {
  const segments = samplePointId.split(':');

  return segments[segments.length - 1] ?? samplePointId;
}

function shortBasis(basisId: PropagationAuditBasisId): string {
  if (basisId === 'basis-s-structural-channel-recomputed-from-f1-f2') {
    return 'basis-s';
  }

  if (basisId === 'basis-r-raw-scalar-field-legacy') {
    return 'basis-r';
  }

  return 'basis-d';
}

function observedRange(values: number[]): { min: number; max: number } {
  return { min: Math.min(...values), max: Math.max(...values) };
}

function uniformIn(range: { min: number; max: number }, next: () => number): number {
  return range.min + (range.max - range.min) * next();
}
