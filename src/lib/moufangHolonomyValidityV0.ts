import {
  buildFanoOctonionicCarrierTableV0Report,
  multiplyFanoUnits,
  type FanoPrimalSourceId,
  type FanoUnitId,
} from './fanoOctonionicCarrierTableV0';
import {
  buildFanoOctonionicCarrierGraphFieldV0Report,
} from './fanoOctonionicCarrierGraphFieldV0';
import {
  buildHubLayerSourceStateCapsuleV0Report,
} from './hubLayerSourceStateCapsuleV0';
import {
  buildOctonionVsA3MedialCarrierDiscriminatorV0Report,
} from './octonionVsA3MedialCarrierDiscriminatorV0';

/**
 * CBF Gate 0, Run 2 -- Moufang holonomy validity diagnostic (link-policy fork).
 *
 * Pure mathematics + finite diagnostic. The project possesses NO field law and
 * this module does not build one; it computes whether the OBSERVABLE such a
 * law would broadcast can exist on the medial hub under the octonionic
 * (Moufang) carrier algebra. It reports raw loop products, Re values,
 * bracketing classifications (exact, over ALL bracketings via interval DP),
 * gauge-orbit behavior, control distributions, and the mock-solution
 * before/after. It assigns NO Gate-0 verdict, no well-defined / invariant /
 * informative labels, and compares to NO threshold: the auditor classifies
 * against a hash-committed sealed rule this module does not see (Rider A).
 *
 * Consumes READ-ONLY: the carrier table (primal quadrangle + the 12 stored
 * ordered lifts + the exported oriented-triple product law), the F1 carrier
 * transport rows, the hub capsule, and the discriminator ok-status. D1/D3
 * carrier results are load-bearing and NOT reopened: any cross-check defect
 * raises an anti-staple ALARM row and an escalation note -- never a silent fix.
 */

export const MOUFANG_HOLONOMY_METHOD = 'moufang-holonomy-validity-v0' as const;

export const MOUFANG_GATE_DECLARATION = {
  declaredPath: 'C:\\Dev\\202cl\\PlatonicEngine202',
  declaredBranch: 'Claude-child',
  declaredHeadAtAuthoring: 'd9ed266',
  sealNote:
    'sealed predictions v2 (link-policy fork) hash-committed at d9ed266; expected values and thresholds withheld from the implementer',
} as const;

export const MOUFANG_SEED = 20260612 as const;
export const MOUFANG_CONTROL_DRAWS = 128 as const;
export const MOUFANG_CONJUGATION_DRAWS = 64 as const;

export type MoufangLoopClass = 'triangle' | 'square' | 'hexagon';
export type MoufangPolicyId =
  | 'policy-a-signed-carrier-link'
  | 'policy-b-grouped-primal-link'
  | 'policy-c-ungrouped-atom-word';

export const MOUFANG_POLICY_IDS: MoufangPolicyId[] = [
  'policy-a-signed-carrier-link',
  'policy-b-grouped-primal-link',
  'policy-c-ungrouped-atom-word',
];

export type MoufangBracketingClass =
  | 'value-identical'
  | 'identical-up-to-sign'
  | 'genuinely-bracketing-dependent';

export interface OctValue {
  sign: 1 | -1;
  unit: number; // 0 = real unit 1; 1..7 = e1..e7
}

export interface MoufangDirectedLink {
  from: FanoPrimalSourceId;
  to: FanoPrimalSourceId;
}

export interface MoufangLoopRecord {
  loopId: string;
  loopClass: MoufangLoopClass;
  linkSequence: MoufangDirectedLink[];
  subsystemKey: string | null;
  orientationNote: string;
}

export interface MoufangValueCensusEntry {
  valueKey: string;
  re: number;
  bracketingCount: number | null;
  witness: string | null;
}

export interface MoufangLoopBatteryRow {
  loopId: string;
  loopClass: MoufangLoopClass;
  policyId: MoufangPolicyId;
  wordLength: number;
  totalBracketings: number;
  canonicalLeftAssocValueKey: string;
  canonicalRe: number;
  distinctValueCount: number;
  bracketingClass: MoufangBracketingClass;
  valueCensus: MoufangValueCensusEntry[];
  dependenceWitnessPair: [string, string] | null;
}

export interface MoufangGaugeLoopRow {
  loopId: string;
  policyId: 'recomputed-link-policy-across-orbit' | 'policy-c-ungrouped-atom-word';
  distinctReValuesAcrossOrbit: number[];
  reIdenticalAcrossOrbit: boolean;
  distinctBracketingClassesAcrossOrbit: MoufangBracketingClass[];
  bracketingClassStableAcrossOrbit: boolean;
  rawValueKeysSample: string[];
}

export interface MoufangConjugationSummary {
  draws: number;
  perLoopReInvariantFraction: Array<{ loopId: string; fraction: number }>;
  fullPatternMatchFraction: number;
  patternMatchMean: number;
  patternMatchP95: number;
  patternMatchMax: number;
  note: string;
}

export interface MoufangControlDistribution {
  controlId: 'c0-strict-null' | 'c1-q-confined-null' | 'c2-carrier-permutation' | 'c3-sign-flip';
  policyId: MoufangPolicyId;
  draws: number;
  realityFractionMean: number;
  realityFractionP95: number;
  realityFractionMax: number;
  patternMatchMean: number;
  patternMatchP95: number;
  patternMatchMax: number;
  fullPatternFraction: number;
  distinctRePatternCount: number;
  degenerateControl: boolean;
  adaptationNote: string | null;
}

export interface MoufangMockSolutionReport {
  scrambleDescription: string;
  scrambledAssignment: Array<{ edge: string; trueValueKey: string; scrambledValueKey: string }>;
  trueReVector: number[];
  scrambledReVector: number[];
  loopsEqualCount: number;
  loopCount: number;
  patternBroke: boolean;
}

export interface MoufangAntiStapleAlarm {
  alarmId: string;
  context: string;
  detail: string;
  escalationNote: 'D1/D3 carrier results are load-bearing; defect escalates to mothership, not silently fixed';
}

export interface MoufangLedgerRow {
  ledgerId: string;
  context: string;
  measurement: string;
  derivationStatus: '';
}

export interface MoufangIntegrityIssue {
  code: string;
  message: string;
}

export interface MoufangClassificationData {
  note: 'raw data keyed to the auditor four-way reading; no classification assigned here';
  abPerEdgeIdentical: boolean;
  aBracketingClassCounts: Record<MoufangBracketingClass, number>;
  bBracketingClassCounts: Record<MoufangBracketingClass, number>;
  cBracketingClassCounts: Record<MoufangBracketingClass, number>;
  cValueIdenticalLoopCount: number;
  cCanonicalDiffersFromACanonicalCount: number;
  cCanonicalReDiffersFromACanonicalReCount: number;
  linkPolicyReIdenticalAcrossOrbitLoopCount: number;
  cReIdenticalAcrossOrbitLoopCount: number;
  conjugationFullPatternMatchFraction: number;
  controlFullPatternFractions: Array<{ policyId: MoufangPolicyId; controlId: string; fullPatternFraction: number }>;
}

export interface MoufangHolonomyValidityV0Report {
  reportId: string;
  method: typeof MOUFANG_HOLONOMY_METHOD;
  declaredGate: typeof MOUFANG_GATE_DECLARATION;
  diagnosticScope: 'computes-and-reports-only-pure-math-finite-diagnostic';
  verdictStatus: 'no-gate0-verdict-auditor-classifies-against-hash-committed-sealed-rule';
  consumedSubstrates: string[];
  seed: number;
  streamConsumptionOrder: string[];
  derivedFanoLines: number[][];
  primalAtomAssignment: Array<{ site: FanoPrimalSourceId; atom: string }>;
  storedLinkAssignment: Array<{ edge: string; valueKey: string }>;
  liftsAllInQ: boolean;
  loopInventory: {
    triangles: number;
    squares: number;
    hexagonSubsystems: number;
    directedHexagons: number;
    batteryLoopCount: number;
    loops: MoufangLoopRecord[];
  };
  batteryRows: MoufangLoopBatteryRow[];
  trueReVectorByPolicy: Array<{ policyId: MoufangPolicyId; reVector: number[]; realityFraction: number }>;
  gauge: {
    quadrangleCount: number;
    labelingsPerQuadrangle: number;
    orbitSize: number;
    trueLabelingInOrbit: boolean;
    orbitNote: string;
    linkPolicyRows: MoufangGaugeLoopRow[];
    cPolicyRows: MoufangGaugeLoopRow[];
  };
  conjugation: MoufangConjugationSummary;
  controls: MoufangControlDistribution[];
  mockSolution: MoufangMockSolutionReport;
  antiStapleAlarms: MoufangAntiStapleAlarm[];
  classificationData: MoufangClassificationData;
  anomalyLedger: MoufangLedgerRow[];
  integrityIssueCount: number;
  integrityIssues: MoufangIntegrityIssue[];
  ok: boolean;
}

// ---------------------------------------------------------------------------
// Algebra core: signed basis octonion values, wrapping the consumed law
// ---------------------------------------------------------------------------

const PRIMAL_SITES: readonly FanoPrimalSourceId[] = ['A', 'B', 'C', 'D'];
const CATALAN = [1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796, 58786];

export function octMul(a: OctValue, b: OctValue): OctValue {
  if (a.unit === 0) {
    return { sign: (a.sign * b.sign) as 1 | -1, unit: b.unit };
  }

  if (b.unit === 0) {
    return { sign: (a.sign * b.sign) as 1 | -1, unit: a.unit };
  }

  if (a.unit === b.unit) {
    return { sign: (-1 * a.sign * b.sign) as 1 | -1, unit: 0 };
  }

  const product = multiplyFanoUnits(
    `e${a.unit}` as FanoUnitId,
    `e${b.unit}` as FanoUnitId,
  );
  const productSign = product.sign === '+' ? 1 : -1;

  return {
    sign: (a.sign * b.sign * productSign) as 1 | -1,
    unit: Number(product.productUnit.slice(1)),
  };
}

export function octConjugate(a: OctValue): OctValue {
  return a.unit === 0 ? { ...a } : { sign: (-1 * a.sign) as 1 | -1, unit: a.unit };
}

export function octRe(a: OctValue): number {
  return a.unit === 0 ? a.sign : 0;
}

export function octKey(a: OctValue): string {
  const unitLabel = a.unit === 0 ? '1' : `e${a.unit}`;

  return `${a.sign === 1 ? '+' : '-'}${unitLabel}`;
}

function octIndex(a: OctValue): number {
  return a.unit * 2 + (a.sign === 1 ? 0 : 1);
}

function octFromIndex(index: number): OctValue {
  return { sign: index % 2 === 0 ? 1 : -1, unit: Math.floor(index / 2) };
}

// 16x16 multiplication index table, built once from the consumed law.
const MUL_INDEX_TABLE: number[][] = [];

for (let leftIndex = 0; leftIndex < 16; leftIndex += 1) {
  MUL_INDEX_TABLE.push([]);

  for (let rightIndex = 0; rightIndex < 16; rightIndex += 1) {
    MUL_INDEX_TABLE[leftIndex].push(
      octIndex(octMul(octFromIndex(leftIndex), octFromIndex(rightIndex))),
    );
  }
}

function leftAssocProduct(word: OctValue[]): OctValue {
  let accumulator = word[0];

  for (let index = 1; index < word.length; index += 1) {
    accumulator = octMul(accumulator, word[index]);
  }

  return accumulator;
}

// Exact interval DP over ALL bracketings: per-value bracketing counts and one
// witness expression per distinct value.
interface BracketingAnalysis {
  totalBracketings: number;
  census: Array<{ value: OctValue; count: number; witness: string }>;
}

function analyzeBracketings(
  word: OctValue[],
  atomLabels: string[],
): BracketingAnalysis {
  const n = word.length;
  const dp: Array<Array<Map<number, { count: number; witness: string }>>> = [];

  for (let i = 0; i < n; i += 1) {
    dp.push([]);

    for (let j = 0; j < n; j += 1) {
      dp[i].push(new Map());
    }

    dp[i][i].set(octIndex(word[i]), { count: 1, witness: atomLabels[i] });
  }

  for (let span = 2; span <= n; span += 1) {
    for (let i = 0; i + span - 1 < n; i += 1) {
      const j = i + span - 1;
      const cell = dp[i][j];

      for (let k = i; k < j; k += 1) {
        for (const [leftIdx, leftEntry] of dp[i][k]) {
          for (const [rightIdx, rightEntry] of dp[k + 1][j]) {
            const productIdx = MUL_INDEX_TABLE[leftIdx][rightIdx];
            const existing = cell.get(productIdx);
            const count = leftEntry.count * rightEntry.count;

            if (existing) {
              existing.count += count;
            } else {
              cell.set(productIdx, {
                count,
                witness: `(${leftEntry.witness} ${rightEntry.witness})`,
              });
            }
          }
        }
      }
    }
  }

  const census = [...dp[0][n - 1].entries()]
    .map(([index, entry]) => ({
      value: octFromIndex(index),
      count: entry.count,
      witness: entry.witness,
    }))
    .sort((left, right) => right.count - left.count);
  const totalBracketings = census.reduce((sum, entry) => sum + entry.count, 0);

  return { totalBracketings, census };
}

// Set-only DP (bitmask over the 16 values) for the gauge orbit sweep.
function bracketingValueMask(word: OctValue[]): number {
  const n = word.length;
  const dp: number[][] = [];

  for (let i = 0; i < n; i += 1) {
    dp.push(new Array<number>(n).fill(0));
    dp[i][i] = 1 << octIndex(word[i]);
  }

  for (let span = 2; span <= n; span += 1) {
    for (let i = 0; i + span - 1 < n; i += 1) {
      const j = i + span - 1;
      let mask = 0;

      for (let k = i; k < j; k += 1) {
        const leftMask = dp[i][k];
        const rightMask = dp[k + 1][j];

        for (let leftIdx = 0; leftIdx < 16; leftIdx += 1) {
          if ((leftMask & (1 << leftIdx)) === 0) {
            continue;
          }

          for (let rightIdx = 0; rightIdx < 16; rightIdx += 1) {
            if ((rightMask & (1 << rightIdx)) === 0) {
              continue;
            }

            mask |= 1 << MUL_INDEX_TABLE[leftIdx][rightIdx];
          }
        }
      }

      dp[i][j] = mask;
    }
  }

  return dp[0][n - 1];
}

function classifyMask(mask: number): MoufangBracketingClass {
  const values: OctValue[] = [];

  for (let index = 0; index < 16; index += 1) {
    if ((mask & (1 << index)) !== 0) {
      values.push(octFromIndex(index));
    }
  }

  return classifyValues(values);
}

function classifyValues(values: OctValue[]): MoufangBracketingClass {
  if (values.length === 1) {
    return 'value-identical';
  }

  if (
    values.length === 2 &&
    values[0].unit === values[1].unit &&
    values[0].sign !== values[1].sign
  ) {
    return 'identical-up-to-sign';
  }

  return 'genuinely-bracketing-dependent';
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

function drawInt(next: () => number, bound: number): number {
  return Math.floor(next() * bound);
}

function drawPermutation(size: number, next: () => number): number[] {
  const permutation = Array.from({ length: size }, (_unused, index) => index);

  for (let index = size - 1; index > 0; index -= 1) {
    const swapIndex = drawInt(next, index + 1);
    const held = permutation[index];
    permutation[index] = permutation[swapIndex];
    permutation[swapIndex] = held;
  }

  return permutation;
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export function buildMoufangHolonomyValidityV0Report(): MoufangHolonomyValidityV0Report {
  const integrityIssues: MoufangIntegrityIssue[] = [];
  const ledger: MoufangLedgerRow[] = [];
  const alarms: MoufangAntiStapleAlarm[] = [];
  let ledgerCounter = 0;
  let alarmCounter = 0;

  const pushIssue = (code: string, message: string): void => {
    integrityIssues.push({ code, message });
  };
  const pushLedger = (context: string, measurement: string): void => {
    ledgerCounter += 1;
    ledger.push({
      ledgerId: `gate0-ledger-${String(ledgerCounter).padStart(2, '0')}`,
      context,
      measurement,
      derivationStatus: '',
    });
  };
  const pushAlarm = (context: string, detail: string): void => {
    alarmCounter += 1;
    alarms.push({
      alarmId: `anti-staple-alarm-${String(alarmCounter).padStart(2, '0')}`,
      context,
      detail,
      escalationNote:
        'D1/D3 carrier results are load-bearing; defect escalates to mothership, not silently fixed',
    });
    pushIssue('anti-staple-alarm', `${context}: ${detail}`);
  };

  // -------------------------------------------------------------------------
  // Substrates (READ-ONLY) + cross-checks
  // -------------------------------------------------------------------------
  const carrierTable = buildFanoOctonionicCarrierTableV0Report();
  const f1Report = buildFanoOctonionicCarrierGraphFieldV0Report();
  const capsule = buildHubLayerSourceStateCapsuleV0Report();
  const discriminator = buildOctonionVsA3MedialCarrierDiscriminatorV0Report();

  if (!carrierTable.ok) {
    pushIssue('carrier-table-not-ok', 'Carrier table report is not ok.');
  }

  if (!f1Report.ok) {
    pushIssue('f1-not-ok', 'F1 carrier graph field report is not ok.');
  }

  if (!capsule.ok) {
    pushIssue('hub-capsule-not-ok', 'Hub capsule report is not ok.');
  }

  if (!discriminator.ok) {
    pushIssue('discriminator-not-ok', 'Discriminator report is not ok.');
  }

  // Primal atoms from the carrier table (cross-checked against the capsule).
  const atomBySite = new Map<FanoPrimalSourceId, OctValue>();

  for (const row of carrierTable.primalCarrierRows) {
    atomBySite.set(row.sourceId, parseSignedUnit(`+${row.carrierUnit}`));
  }

  for (const site of PRIMAL_SITES) {
    const capsuleUnit = capsule.primalCarrierAssignment[site];
    const tableUnit = `e${atomBySite.get(site)?.unit ?? 0}`;

    if (capsuleUnit !== tableUnit) {
      pushAlarm(
        'primal-atom-cross-check',
        `site ${site}: capsule ${capsuleUnit} vs carrier table ${tableUnit}`,
      );
    }
  }

  // Stored link assignment U(i->j): capsule flagStates (the stack-carried
  // rows), cross-checked against the carrier table ordered lifts and the F1
  // birth-edge transports.
  const storedLinkByEdge = new Map<string, OctValue>();

  for (const flagState of capsule.flagStates) {
    storedLinkByEdge.set(
      flagState.flagId,
      parseSignedUnit(flagState.recomputedSignedLiftLabel),
    );
  }

  if (storedLinkByEdge.size !== 12) {
    pushIssue(
      'stored-link-count-mismatch',
      `Expected 12 stored links, got ${storedLinkByEdge.size}.`,
    );
  }

  for (const liftRow of carrierTable.orderedLiftRows) {
    const edgeKey = `${liftRow.orderedParents[0]}->${liftRow.orderedParents[1]}`;
    const stored = storedLinkByEdge.get(edgeKey);

    if (!stored || octKey(stored) !== normalizeSignedLift(liftRow.signedLift)) {
      pushAlarm(
        'capsule-vs-carrier-table',
        `edge ${edgeKey}: capsule ${stored ? octKey(stored) : 'missing'} vs table ${liftRow.signedLift}`,
      );
    }
  }

  const liftByLiftId = new Map(
    carrierTable.orderedLiftRows.map((row) => [row.liftId, row.signedLift]),
  );

  for (const edgeRow of f1Report.edgeRows) {
    if (edgeRow.edgeFamily !== 'birth-edge') {
      continue;
    }

    const tableLift = liftByLiftId.get(edgeRow.canonicalLiftId);

    if (!tableLift || tableLift !== edgeRow.signedLift) {
      pushAlarm(
        'f1-birth-transport-vs-carrier-table',
        `${edgeRow.edgeId}: F1 ${edgeRow.signedLift} vs table ${tableLift ?? 'missing'}`,
      );
    }
  }

  const liftsAllInQ = [...storedLinkByEdge.values()].every((value) =>
    [3, 5, 6].includes(value.unit),
  );

  if (!liftsAllInQ) {
    pushLedger(
      'lift-q-membership',
      'At least one stored lift lies outside Q={e3,e5,e6}; reported as data.',
    );
  }

  // Fano lines derived from the consumed product law (no hard-coding).
  const derivedFanoLines: number[][] = [];

  for (let i = 1; i <= 7; i += 1) {
    for (let j = i + 1; j <= 7; j += 1) {
      const product = octMul({ sign: 1, unit: i }, { sign: 1, unit: j });
      const line = [i, j, product.unit].sort((a, b) => a - b);
      const lineKey = line.join(',');

      if (!derivedFanoLines.some((existing) => existing.join(',') === lineKey)) {
        derivedFanoLines.push(line);
      }
    }
  }

  if (derivedFanoLines.length !== 7) {
    pushIssue(
      'derived-line-count-mismatch',
      `Expected 7 Fano lines from the consumed law, got ${derivedFanoLines.length}.`,
    );
  }

  // -------------------------------------------------------------------------
  // Loop-class inventory (from geometry)
  // -------------------------------------------------------------------------
  const loops = buildLoopInventory(pushIssue);
  const triangleCount = loops.filter((loop) => loop.loopClass === 'triangle').length;
  const squareCount = loops.filter((loop) => loop.loopClass === 'square').length;
  const directedHexagonCount = loops.filter(
    (loop) => loop.loopClass === 'hexagon',
  ).length;
  const hexagonSubsystems = new Set(
    loops
      .filter((loop) => loop.loopClass === 'hexagon')
      .map((loop) => loop.subsystemKey ?? ''),
  ).size;

  // -------------------------------------------------------------------------
  // Per-policy words
  // -------------------------------------------------------------------------
  const wordForPolicy = (
    loop: MoufangLoopRecord,
    policyId: MoufangPolicyId,
    linkMap: Map<string, OctValue>,
    atoms: Map<FanoPrimalSourceId, OctValue>,
  ): { word: OctValue[]; labels: string[] } => {
    if (policyId === 'policy-c-ungrouped-atom-word') {
      const word: OctValue[] = [];
      const labels: string[] = [];

      for (const link of loop.linkSequence) {
        word.push(atoms.get(link.from) as OctValue, atoms.get(link.to) as OctValue);
        labels.push(`p${link.from}`, `p${link.to}`);
      }

      return { word, labels };
    }

    const word = loop.linkSequence.map((link) => {
      if (policyId === 'policy-a-signed-carrier-link') {
        return linkMap.get(`${link.from}->${link.to}`) as OctValue;
      }

      return octMul(
        atoms.get(link.from) as OctValue,
        atoms.get(link.to) as OctValue,
      );
    });
    const labels = loop.linkSequence.map((link) => `U(${link.from}->${link.to})`);

    return { word, labels };
  };

  // Anti-staple fork check: B vs A per edge.
  let abPerEdgeIdentical = true;

  for (const [edgeKey, storedValue] of storedLinkByEdge) {
    const [from, to] = edgeKey.split('->') as [FanoPrimalSourceId, FanoPrimalSourceId];
    const recomputed = octMul(
      atomBySite.get(from) as OctValue,
      atomBySite.get(to) as OctValue,
    );

    if (octKey(recomputed) !== octKey(storedValue)) {
      abPerEdgeIdentical = false;
      pushAlarm(
        'policy-b-vs-policy-a-per-edge',
        `edge ${edgeKey}: stored ${octKey(storedValue)} vs recomputed ${octKey(recomputed)} -- carrier table internally inconsistent`,
      );
    }
  }

  // -------------------------------------------------------------------------
  // Battery (exact DP with counts + witnesses at the true labeling)
  // -------------------------------------------------------------------------
  const batteryRows: MoufangLoopBatteryRow[] = [];

  for (const policyId of MOUFANG_POLICY_IDS) {
    for (const loop of loops) {
      const { word, labels } = wordForPolicy(
        loop,
        policyId,
        storedLinkByEdge,
        atomBySite,
      );
      const analysis = analyzeBracketings(word, labels);
      const expectedTotal = CATALAN[word.length - 1];

      if (analysis.totalBracketings !== expectedTotal) {
        pushIssue(
          'bracketing-count-mismatch',
          `${loop.loopId}/${policyId}: DP total ${analysis.totalBracketings} != Catalan ${expectedTotal}`,
        );
      }

      const canonical = leftAssocProduct(word);
      const bracketingClass = classifyValues(
        analysis.census.map((entry) => entry.value),
      );
      const dependenceWitnessPair: [string, string] | null =
        analysis.census.length >= 2
          ? [
              `${analysis.census[0].witness} = ${octKey(analysis.census[0].value)}`,
              `${analysis.census[1].witness} = ${octKey(analysis.census[1].value)}`,
            ]
          : null;

      batteryRows.push({
        loopId: loop.loopId,
        loopClass: loop.loopClass,
        policyId,
        wordLength: word.length,
        totalBracketings: analysis.totalBracketings,
        canonicalLeftAssocValueKey: octKey(canonical),
        canonicalRe: octRe(canonical),
        distinctValueCount: analysis.census.length,
        bracketingClass,
        valueCensus: analysis.census.map((entry) => ({
          valueKey: octKey(entry.value),
          re: octRe(entry.value),
          bracketingCount: entry.count,
          witness: entry.witness,
        })),
        dependenceWitnessPair,
      });
    }
  }

  const trueReVectorByPolicy = MOUFANG_POLICY_IDS.map((policyId) => {
    const reVector = loops.map(
      (loop) =>
        batteryRows.find(
          (row) => row.loopId === loop.loopId && row.policyId === policyId,
        )?.canonicalRe ?? Number.NaN,
    );

    return {
      policyId,
      reVector,
      realityFraction:
        reVector.filter((re) => Math.abs(re) === 1).length / reVector.length,
    };
  });

  // -------------------------------------------------------------------------
  // Gauge orbit: 7 quadrangles x 24 labelings = 168
  // -------------------------------------------------------------------------
  const quadrangles = enumerateQuadrangles(derivedFanoLines);

  if (quadrangles.length !== 7) {
    pushIssue(
      'quadrangle-count-mismatch',
      `Expected 7 complete quadrangles, got ${quadrangles.length}.`,
    );
  }

  const orderings = enumeratePermutationsOfFour();
  const orbitAssignments: Array<Map<FanoPrimalSourceId, OctValue>> = [];

  for (const quadrangle of quadrangles) {
    for (const ordering of orderings) {
      const assignment = new Map<FanoPrimalSourceId, OctValue>();
      PRIMAL_SITES.forEach((site, position) => {
        assignment.set(site, { sign: 1, unit: quadrangle[ordering[position]] });
      });
      orbitAssignments.push(assignment);
    }
  }

  if (orbitAssignments.length !== 168) {
    pushIssue(
      'orbit-size-mismatch',
      `Expected 168 labelings, got ${orbitAssignments.length}.`,
    );
  }

  const trueAtomKey = PRIMAL_SITES.map((site) => octKey(atomBySite.get(site) as OctValue)).join(',');
  const trueLabelingInOrbit = orbitAssignments.some(
    (assignment) =>
      PRIMAL_SITES.map((site) => octKey(assignment.get(site) as OctValue)).join(',') ===
      trueAtomKey,
  );

  if (!trueLabelingInOrbit) {
    pushIssue(
      'true-labeling-not-in-orbit',
      'The canonical quadrangle labeling is not a member of the derived orbit.',
    );
  }

  const linkPolicyRows: MoufangGaugeLoopRow[] = [];
  const cPolicyRows: MoufangGaugeLoopRow[] = [];

  for (const loop of loops) {
    const linkReSet = new Set<number>();
    const linkClassSet = new Set<MoufangBracketingClass>();
    const linkRawSample: string[] = [];
    const cReSet = new Set<number>();
    const cClassSet = new Set<MoufangBracketingClass>();
    const cRawSample: string[] = [];

    for (const assignment of orbitAssignments) {
      const linkWord = loop.linkSequence.map((link) =>
        octMul(assignment.get(link.from) as OctValue, assignment.get(link.to) as OctValue),
      );
      const linkCanonical = leftAssocProduct(linkWord);
      linkReSet.add(octRe(linkCanonical));
      linkClassSet.add(classifyMask(bracketingValueMask(linkWord)));

      if (linkRawSample.length < 4) {
        linkRawSample.push(octKey(linkCanonical));
      }

      const cWord: OctValue[] = [];

      for (const link of loop.linkSequence) {
        cWord.push(
          assignment.get(link.from) as OctValue,
          assignment.get(link.to) as OctValue,
        );
      }

      const cCanonical = leftAssocProduct(cWord);
      cReSet.add(octRe(cCanonical));
      cClassSet.add(classifyMask(bracketingValueMask(cWord)));

      if (cRawSample.length < 4) {
        cRawSample.push(octKey(cCanonical));
      }
    }

    linkPolicyRows.push({
      loopId: loop.loopId,
      policyId: 'recomputed-link-policy-across-orbit',
      distinctReValuesAcrossOrbit: [...linkReSet].sort(),
      reIdenticalAcrossOrbit: linkReSet.size === 1,
      distinctBracketingClassesAcrossOrbit: [...linkClassSet].sort(),
      bracketingClassStableAcrossOrbit: linkClassSet.size === 1,
      rawValueKeysSample: linkRawSample,
    });
    cPolicyRows.push({
      loopId: loop.loopId,
      policyId: 'policy-c-ungrouped-atom-word',
      distinctReValuesAcrossOrbit: [...cReSet].sort(),
      reIdenticalAcrossOrbit: cReSet.size === 1,
      distinctBracketingClassesAcrossOrbit: [...cClassSet].sort(),
      bracketingClassStableAcrossOrbit: cClassSet.size === 1,
      rawValueKeysSample: cRawSample,
    });
  }

  pushLedger(
    'gauge-orbit-link-policy-identification',
    'Across the orbit, policies A and B coincide by construction: stored rows exist only at the true labeling, so orbit links are recomputed from relabeled atoms (the B form). Declared, not hidden.',
  );

  // -------------------------------------------------------------------------
  // Deterministic stream (declared order), conjugation, controls, mock
  // -------------------------------------------------------------------------
  const streamConsumptionOrder = [
    '1. site-local conjugation draws: 64 draws x 4 unit octonions (g_A..g_D, each uniform over the 16 signed basis units incl +-1)',
    '2. controls policy A: c0 (128x12 edge units), c1 (128x12 Q units), c2 (128 permutations of the 12 true carriers), c3 (128x12 sign bits)',
    '3. controls policy B: same structure as policy A (independent draws)',
    '4. controls policy C: c0 (128x4 atom units), c1 (128x4 Q units), c2 (128 permutations of the 4 true atoms), c3 (128x4 sign bits)',
    '5. mock-solution scramble: one derangement of the 12 stored carriers + 12 sign bits',
  ];
  const stream = mulberry32(MOUFANG_SEED);

  const edgeKeys = [...storedLinkByEdge.keys()].sort();
  const trueLinkReVector = trueReVectorByPolicy[0].reVector;
  const trueCReVector = trueReVectorByPolicy[2].reVector;

  const computeLinkReVector = (linkMap: Map<string, OctValue>): number[] =>
    loops.map((loop) =>
      octRe(
        leftAssocProduct(
          loop.linkSequence.map(
            (link) => linkMap.get(`${link.from}->${link.to}`) as OctValue,
          ),
        ),
      ),
    );

  const computeAtomReVector = (atoms: Map<FanoPrimalSourceId, OctValue>): number[] =>
    loops.map((loop) => {
      const word: OctValue[] = [];

      for (const link of loop.linkSequence) {
        word.push(atoms.get(link.from) as OctValue, atoms.get(link.to) as OctValue);
      }

      return octRe(leftAssocProduct(word));
    });

  // (1) site-local conjugation on the stored links.
  const conjugation = runConjugationSample({
    loops,
    storedLinkByEdge,
    trueLinkReVector,
    stream,
  });
  pushLedger(
    'site-conjugation-measurement',
    `Site-local conjugation (g_i (U g_j^-1)), 64 draws: full-pattern match fraction ${conjugation.fullPatternMatchFraction.toFixed(4)}; per-loop invariance fractions reported. Hexagon links conjugate per their own endpoints (vertex-cycles do not telescope); conjugation is not defined for policy C atom words (no links).`,
  );

  // (2)-(4) controls.
  const controls: MoufangControlDistribution[] = [];
  const randomUnit = (next: () => number): OctValue => ({
    sign: next() < 0.5 ? 1 : -1,
    unit: 1 + drawInt(next, 7),
  });
  const randomQUnit = (next: () => number): OctValue => ({
    sign: next() < 0.5 ? 1 : -1,
    unit: [3, 5, 6][drawInt(next, 3)],
  });

  for (const policyId of ['policy-a-signed-carrier-link', 'policy-b-grouped-primal-link'] as MoufangPolicyId[]) {
    const trueValues = edgeKeys.map((edgeKey) => storedLinkByEdge.get(edgeKey) as OctValue);

    for (const controlId of ['c0-strict-null', 'c1-q-confined-null', 'c2-carrier-permutation', 'c3-sign-flip'] as const) {
      const realityFractions: number[] = [];
      const patternMatches: number[] = [];
      const patternKeys = new Set<string>();
      let fullMatches = 0;

      for (let draw = 0; draw < MOUFANG_CONTROL_DRAWS; draw += 1) {
        const drawMap = new Map<string, OctValue>();

        if (controlId === 'c0-strict-null') {
          edgeKeys.forEach((edgeKey) => drawMap.set(edgeKey, randomUnit(stream)));
        } else if (controlId === 'c1-q-confined-null') {
          edgeKeys.forEach((edgeKey) => drawMap.set(edgeKey, randomQUnit(stream)));
        } else if (controlId === 'c2-carrier-permutation') {
          const permutation = drawPermutation(edgeKeys.length, stream);
          edgeKeys.forEach((edgeKey, index) =>
            drawMap.set(edgeKey, trueValues[permutation[index]]),
          );
        } else {
          edgeKeys.forEach((edgeKey, index) =>
            drawMap.set(
              edgeKey,
              stream() < 0.5
                ? trueValues[index]
                : { sign: (-1 * trueValues[index].sign) as 1 | -1, unit: trueValues[index].unit },
            ),
          );
        }

        const reVector = computeLinkReVector(drawMap);
        const realityFraction =
          reVector.filter((re) => Math.abs(re) === 1).length / reVector.length;
        const matches = reVector.filter(
          (re, index) => re === trueLinkReVector[index],
        ).length;
        realityFractions.push(realityFraction);
        patternMatches.push(matches);
        patternKeys.add(reVector.join(','));

        if (matches === loops.length) {
          fullMatches += 1;
        }
      }

      controls.push(
        summarizeControl({
          controlId,
          policyId,
          realityFractions,
          patternMatches,
          fullMatches,
          patternKeys,
          loopCount: loops.length,
          adaptationNote: null,
        }),
      );
    }
  }

  {
    const policyId: MoufangPolicyId = 'policy-c-ungrouped-atom-word';
    const trueAtoms = PRIMAL_SITES.map((site) => atomBySite.get(site) as OctValue);

    for (const controlId of ['c0-strict-null', 'c1-q-confined-null', 'c2-carrier-permutation', 'c3-sign-flip'] as const) {
      const realityFractions: number[] = [];
      const patternMatches: number[] = [];
      const patternKeys = new Set<string>();
      let fullMatches = 0;

      for (let draw = 0; draw < MOUFANG_CONTROL_DRAWS; draw += 1) {
        const atoms = new Map<FanoPrimalSourceId, OctValue>();

        if (controlId === 'c0-strict-null') {
          PRIMAL_SITES.forEach((site) => atoms.set(site, randomUnit(stream)));
        } else if (controlId === 'c1-q-confined-null') {
          PRIMAL_SITES.forEach((site) => atoms.set(site, randomQUnit(stream)));
        } else if (controlId === 'c2-carrier-permutation') {
          const permutation = drawPermutation(PRIMAL_SITES.length, stream);
          PRIMAL_SITES.forEach((site, index) =>
            atoms.set(site, trueAtoms[permutation[index]]),
          );
        } else {
          PRIMAL_SITES.forEach((site, index) =>
            atoms.set(
              site,
              stream() < 0.5
                ? trueAtoms[index]
                : { sign: (-1 * trueAtoms[index].sign) as 1 | -1, unit: trueAtoms[index].unit },
            ),
          );
        }

        const reVector = computeAtomReVector(atoms);
        const realityFraction =
          reVector.filter((re) => Math.abs(re) === 1).length / reVector.length;
        const matches = reVector.filter((re, index) => re === trueCReVector[index]).length;
        realityFractions.push(realityFraction);
        patternMatches.push(matches);
        patternKeys.add(reVector.join(','));

        if (matches === loops.length) {
          fullMatches += 1;
        }
      }

      controls.push(
        summarizeControl({
          controlId,
          policyId,
          realityFractions,
          patternMatches,
          fullMatches,
          patternKeys,
          loopCount: loops.length,
          adaptationNote:
            'policy C degrees of freedom are the 4 primal atoms, not edges; the four control ideas are applied at atom level (declared adaptation)',
        }),
      );
    }
  }

  for (const control of controls) {
    if (control.degenerateControl) {
      pushLedger(
        `degenerate-control:${control.policyId}:${control.controlId}`,
        `Control never varied across ${control.draws} draws (1 distinct Re-pattern); reported as degenerate, not as a pass.`,
      );
    }
  }

  // Measured-surprise ledger rows (conditional on the data, not on expectations).
  const edgeC1Controls = controls.filter(
    (control) =>
      control.controlId === 'c1-q-confined-null' &&
      control.policyId !== 'policy-c-ungrouped-atom-word',
  );

  if (edgeC1Controls.some((control) => control.realityFractionMean < 1)) {
    pushLedger(
      'c1-edge-reality-observation',
      `Edge-level C1 (Q-confined) reality-fraction means measured ${edgeC1Controls
        .map((control) => `${control.policyId}=${control.realityFractionMean.toFixed(4)}`)
        .join(', ')} -- below 1.0: random Q-confined EDGE assignments did not keep every loop product real on these loop classes. The control ladder's reality-preservation premise is measured here, not assumed.`,
    );
  }

  const cControls = controls.filter(
    (control) => control.policyId === 'policy-c-ungrouped-atom-word',
  );

  if (cControls.length > 0 && cControls.every((control) => control.realityFractionMean === 1)) {
    pushLedger(
      'c-policy-reality-observation',
      'Policy C reality fraction measured 1.0 across ALL four atom-level controls (including the strict null): every ungrouped atom-word loop product landed in {+-1} on every draw.',
    );
  }

  const aRowsForLedger = batteryRows.filter(
    (row) => row.policyId === 'policy-a-signed-carrier-link',
  );
  const cRowsForLedger = batteryRows.filter(
    (row) => row.policyId === 'policy-c-ungrouped-atom-word',
  );
  const reDifferingLoopIds = loops
    .filter((loop) => {
      const aRow = aRowsForLedger.find((row) => row.loopId === loop.loopId);
      const cRow = cRowsForLedger.find((row) => row.loopId === loop.loopId);

      return aRow && cRow && aRow.canonicalRe !== cRow.canonicalRe;
    })
    .map((loop) => loop.loopId);

  if (reDifferingLoopIds.length > 0) {
    pushLedger(
      'c-vs-a-canonical-re-difference',
      `Policy C canonical (left-assoc) Re differs from policy A on ${reDifferingLoopIds.length}/${loops.length} loops: ${reDifferingLoopIds.join(', ')}.`,
    );
  }

  // (5) mock-solution test (anti-staple).
  const mockSolution = runMockSolution({
    loops,
    storedLinkByEdge,
    edgeKeys,
    trueLinkReVector,
    stream,
    computeLinkReVector,
  });

  if (!mockSolution.patternBroke) {
    pushIssue(
      'mock-solution-pattern-survived',
      'The scrambled carrier assignment reproduced the true Re-pattern; the diagnostic is reading constants, not carrier facts. RUN VOID.',
    );
  }

  // -------------------------------------------------------------------------
  // Classification data (raw; auditor assigns)
  // -------------------------------------------------------------------------
  const classCounts = (policyId: MoufangPolicyId): Record<MoufangBracketingClass, number> => {
    const counts: Record<MoufangBracketingClass, number> = {
      'value-identical': 0,
      'identical-up-to-sign': 0,
      'genuinely-bracketing-dependent': 0,
    };

    for (const row of batteryRows) {
      if (row.policyId === policyId) {
        counts[row.bracketingClass] += 1;
      }
    }

    return counts;
  };

  const aRows = batteryRows.filter((row) => row.policyId === 'policy-a-signed-carrier-link');
  const cRows = batteryRows.filter((row) => row.policyId === 'policy-c-ungrouped-atom-word');
  const cCanonicalDiffersFromACanonicalCount = loops.filter((loop) => {
    const aRow = aRows.find((row) => row.loopId === loop.loopId);
    const cRow = cRows.find((row) => row.loopId === loop.loopId);

    return aRow && cRow && aRow.canonicalLeftAssocValueKey !== cRow.canonicalLeftAssocValueKey;
  }).length;
  const cCanonicalReDiffersFromACanonicalReCount = loops.filter((loop) => {
    const aRow = aRows.find((row) => row.loopId === loop.loopId);
    const cRow = cRows.find((row) => row.loopId === loop.loopId);

    return aRow && cRow && aRow.canonicalRe !== cRow.canonicalRe;
  }).length;

  const classificationData: MoufangClassificationData = {
    note: 'raw data keyed to the auditor four-way reading; no classification assigned here',
    abPerEdgeIdentical,
    aBracketingClassCounts: classCounts('policy-a-signed-carrier-link'),
    bBracketingClassCounts: classCounts('policy-b-grouped-primal-link'),
    cBracketingClassCounts: classCounts('policy-c-ungrouped-atom-word'),
    cValueIdenticalLoopCount: classCounts('policy-c-ungrouped-atom-word')['value-identical'],
    cCanonicalDiffersFromACanonicalCount,
    cCanonicalReDiffersFromACanonicalReCount,
    linkPolicyReIdenticalAcrossOrbitLoopCount: linkPolicyRows.filter(
      (row) => row.reIdenticalAcrossOrbit,
    ).length,
    cReIdenticalAcrossOrbitLoopCount: cPolicyRows.filter(
      (row) => row.reIdenticalAcrossOrbit,
    ).length,
    conjugationFullPatternMatchFraction: conjugation.fullPatternMatchFraction,
    controlFullPatternFractions: controls.map((control) => ({
      policyId: control.policyId,
      controlId: control.controlId,
      fullPatternFraction: control.fullPatternFraction,
    })),
  };

  // -------------------------------------------------------------------------
  // Integrity (well-formedness only)
  // -------------------------------------------------------------------------
  if (loops.length !== 22) {
    pushIssue('battery-loop-count-mismatch', `Expected 22 directed loops, got ${loops.length}.`);
  }

  if (batteryRows.length !== loops.length * 3) {
    pushIssue(
      'battery-row-count-mismatch',
      `Expected ${loops.length * 3} battery rows, got ${batteryRows.length}.`,
    );
  }

  if (controls.length !== 12) {
    pushIssue('control-cell-count-mismatch', `Expected 12 control cells, got ${controls.length}.`);
  }

  for (const control of controls) {
    if (control.draws !== MOUFANG_CONTROL_DRAWS) {
      pushIssue('control-draw-count-mismatch', `${control.policyId}/${control.controlId}`);
    }
  }

  if (conjugation.draws !== MOUFANG_CONJUGATION_DRAWS) {
    pushIssue('conjugation-draw-count-mismatch', String(conjugation.draws));
  }

  for (const row of ledger) {
    if (row.derivationStatus !== '') {
      pushIssue('ledger-derivation-status-not-empty', row.ledgerId);
    }
  }

  return {
    reportId: `${MOUFANG_HOLONOMY_METHOD}:medial-hub-first-birth-loop-classes`,
    method: MOUFANG_HOLONOMY_METHOD,
    declaredGate: MOUFANG_GATE_DECLARATION,
    diagnosticScope: 'computes-and-reports-only-pure-math-finite-diagnostic',
    verdictStatus:
      'no-gate0-verdict-auditor-classifies-against-hash-committed-sealed-rule',
    consumedSubstrates: [
      'fanoOctonionicCarrierTableV0 (quadrangle atoms, 12 ordered lifts, multiplyFanoUnits law; READ-ONLY)',
      'fanoOctonionicCarrierGraphFieldV0 (F1 transport rows, cross-check; READ-ONLY)',
      'hubLayerSourceStateCapsuleV0 (12 stack-carried flag lifts; READ-ONLY)',
      'octonionVsA3MedialCarrierDiscriminatorV0 (ok-status; READ-ONLY)',
    ],
    seed: MOUFANG_SEED,
    streamConsumptionOrder,
    derivedFanoLines,
    primalAtomAssignment: PRIMAL_SITES.map((site) => ({
      site,
      atom: octKey(atomBySite.get(site) as OctValue),
    })),
    storedLinkAssignment: edgeKeys.map((edgeKey) => ({
      edge: edgeKey,
      valueKey: octKey(storedLinkByEdge.get(edgeKey) as OctValue),
    })),
    liftsAllInQ,
    loopInventory: {
      triangles: triangleCount,
      squares: squareCount,
      hexagonSubsystems,
      directedHexagons: directedHexagonCount,
      batteryLoopCount: loops.length,
      loops,
    },
    batteryRows,
    trueReVectorByPolicy,
    gauge: {
      quadrangleCount: quadrangles.length,
      labelingsPerQuadrangle: orderings.length,
      orbitSize: orbitAssignments.length,
      trueLabelingInOrbit,
      orbitNote:
        'Orbit = the 7 complete quadrangles of the Fano plane (derived from the consumed product law) x 24 site orderings. Raw loop products are reported as covariant (samples printed); the candidate observable function is Re.',
      linkPolicyRows,
      cPolicyRows,
    },
    conjugation,
    controls,
    mockSolution,
    antiStapleAlarms: alarms,
    classificationData,
    anomalyLedger: ledger,
    integrityIssueCount: integrityIssues.length,
    integrityIssues,
    ok: integrityIssues.length === 0,
  };
}

// ---------------------------------------------------------------------------
// Loop inventory (from geometry)
// ---------------------------------------------------------------------------

function buildLoopInventory(
  pushIssue: (code: string, message: string) => void,
): MoufangLoopRecord[] {
  const loops: MoufangLoopRecord[] = [];

  // Triangles: directed 3-cycles of K4, deduped by rotation.
  const triangleKeys = new Set<string>();

  for (const a of PRIMAL_SITES) {
    for (const b of PRIMAL_SITES) {
      for (const c of PRIMAL_SITES) {
        if (a === b || b === c || a === c) {
          continue;
        }

        const rotations = [`${a}${b}${c}`, `${b}${c}${a}`, `${c}${a}${b}`];
        const canonical = [...rotations].sort()[0];

        if (triangleKeys.has(canonical)) {
          continue;
        }

        triangleKeys.add(canonical);
        const [v0, v1, v2] = canonical.split('') as FanoPrimalSourceId[];
        loops.push({
          loopId: `triangle:${canonical}`,
          loopClass: 'triangle',
          linkSequence: [
            { from: v0, to: v1 },
            { from: v1, to: v2 },
            { from: v2, to: v0 },
          ],
          subsystemKey: null,
          orientationNote: `directed 3-cycle ${v0}->${v1}->${v2}->${v0}`,
        });
      }
    }
  }

  // Squares: directed Hamiltonian 4-cycles of K4, deduped by rotation.
  const squareKeys = new Set<string>();
  const permute = (items: FanoPrimalSourceId[]): FanoPrimalSourceId[][] => {
    if (items.length <= 1) {
      return [items];
    }

    const results: FanoPrimalSourceId[][] = [];

    items.forEach((item, index) => {
      const rest = items.filter((_value, restIndex) => restIndex !== index);

      for (const tail of permute(rest)) {
        results.push([item, ...tail]);
      }
    });

    return results;
  };

  for (const ordering of permute([...PRIMAL_SITES])) {
    const sequence = ordering.join('');
    const rotations = [0, 1, 2, 3].map(
      (shift) => sequence.slice(shift) + sequence.slice(0, shift),
    );
    const canonical = [...rotations].sort()[0];

    if (squareKeys.has(canonical)) {
      continue;
    }

    squareKeys.add(canonical);
    const vertices = canonical.split('') as FanoPrimalSourceId[];
    loops.push({
      loopId: `square:${canonical}`,
      loopClass: 'square',
      linkSequence: vertices.map((vertex, index) => ({
        from: vertex,
        to: vertices[(index + 1) % 4],
      })),
      subsystemKey: null,
      orientationNote: `directed Hamiltonian 4-cycle ${vertices.join('->')}->${vertices[0]}`,
    });
  }

  // Hexagonal great circles from root coordinates: flag i->j maps to the
  // vector eps_i - eps_j in R^4; each 3-subset supports an A2 subsystem of 6
  // roots; angular order in the subsystem plane gives the great-circle cycle.
  const coordinateBySite: Record<FanoPrimalSourceId, number[]> = {
    A: [1, 0, 0, 0],
    B: [0, 1, 0, 0],
    C: [0, 0, 1, 0],
    D: [0, 0, 0, 1],
  };
  const subsets: FanoPrimalSourceId[][] = [];

  for (let i = 0; i < 4; i += 1) {
    for (let j = i + 1; j < 4; j += 1) {
      for (let k = j + 1; k < 4; k += 1) {
        subsets.push([PRIMAL_SITES[i], PRIMAL_SITES[j], PRIMAL_SITES[k]]);
      }
    }
  }

  for (const subset of subsets) {
    const roots: Array<{ link: MoufangDirectedLink; vector: number[] }> = [];

    for (const from of subset) {
      for (const to of subset) {
        if (from === to) {
          continue;
        }

        roots.push({
          link: { from, to },
          vector: subtract4(coordinateBySite[from], coordinateBySite[to]),
        });
      }
    }

    if (roots.length !== 6) {
      pushIssue('a2-subsystem-root-count', `${subset.join('')}: ${roots.length}`);
      continue;
    }

    const u = normalize4(roots[0].vector);
    const rawW = roots.find(
      (root) => Math.abs(dot4(normalize4(root.vector), u)) < 0.99,
    )?.vector as number[];
    const wOrth = subtract4(rawW, scale4(u, dot4(rawW, u)));
    const w = normalize4(wOrth);
    const withAngles = roots.map((root) => ({
      ...root,
      angle: Math.atan2(dot4(root.vector, w), dot4(root.vector, u)),
    }));
    withAngles.sort((left, right) => left.angle - right.angle);

    // verify consecutive roots at 60 degrees (dot = 1 for root length sqrt(2))
    for (let index = 0; index < 6; index += 1) {
      const current = withAngles[index].vector;
      const nextRoot = withAngles[(index + 1) % 6].vector;

      if (Math.abs(dot4(current, nextRoot) - 1) > 1e-9) {
        pushIssue(
          'hexagon-adjacency-not-60-degrees',
          `${subset.join('')}: consecutive roots dot ${dot4(current, nextRoot)}`,
        );
      }
    }

    const subsystemKey = subset.join('');
    const forward = withAngles.map((entry) => entry.link);
    const backward = [...forward].reverse();

    loops.push({
      loopId: `hexagon:${subsystemKey}:fwd`,
      loopClass: 'hexagon',
      linkSequence: forward,
      subsystemKey,
      orientationNote: `A2 great circle on {${subset.join(',')}}, angular order, forward traversal`,
    });
    loops.push({
      loopId: `hexagon:${subsystemKey}:rev`,
      loopClass: 'hexagon',
      linkSequence: backward,
      subsystemKey,
      orientationNote: `A2 great circle on {${subset.join(',')}}, angular order, reverse traversal`,
    });
  }

  return loops;
}

function subtract4(a: number[], b: number[]): number[] {
  return a.map((value, index) => value - b[index]);
}

function scale4(a: number[], factor: number): number[] {
  return a.map((value) => value * factor);
}

function dot4(a: number[], b: number[]): number {
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

function normalize4(a: number[]): number[] {
  const length = Math.sqrt(dot4(a, a));

  return length > 0 ? scale4(a, 1 / length) : a;
}

// ---------------------------------------------------------------------------
// Gauge helpers
// ---------------------------------------------------------------------------

function enumerateQuadrangles(lines: number[][]): number[][] {
  const lineKeys = new Set(lines.map((line) => line.join(',')));
  const quadrangles: number[][] = [];

  for (let a = 1; a <= 7; a += 1) {
    for (let b = a + 1; b <= 7; b += 1) {
      for (let c = b + 1; c <= 7; c += 1) {
        for (let d = c + 1; d <= 7; d += 1) {
          const points = [a, b, c, d];
          const triples = [
            [a, b, c],
            [a, b, d],
            [a, c, d],
            [b, c, d],
          ];
          const containsLine = triples.some((triple) =>
            lineKeys.has(triple.join(',')),
          );

          if (!containsLine) {
            quadrangles.push(points);
          }
        }
      }
    }
  }

  return quadrangles;
}

function enumeratePermutationsOfFour(): number[][] {
  const results: number[][] = [];

  const recurse = (current: number[], remaining: number[]): void => {
    if (remaining.length === 0) {
      results.push([...current]);

      return;
    }

    remaining.forEach((value, index) => {
      recurse(
        [...current, value],
        remaining.filter((_unused, restIndex) => restIndex !== index),
      );
    });
  };

  recurse([], [0, 1, 2, 3]);

  return results;
}

// ---------------------------------------------------------------------------
// Conjugation sample
// ---------------------------------------------------------------------------

function runConjugationSample(args: {
  loops: MoufangLoopRecord[];
  storedLinkByEdge: Map<string, OctValue>;
  trueLinkReVector: number[];
  stream: () => number;
}): MoufangConjugationSummary {
  const { loops, storedLinkByEdge, trueLinkReVector, stream } = args;
  const perLoopInvariantCounts = new Array<number>(loops.length).fill(0);
  const patternMatches: number[] = [];
  let fullMatches = 0;

  for (let draw = 0; draw < MOUFANG_CONJUGATION_DRAWS; draw += 1) {
    const gBySite = new Map<FanoPrimalSourceId, OctValue>();

    for (const site of PRIMAL_SITES) {
      gBySite.set(site, octFromIndex(Math.floor(stream() * 16)));
    }

    const transformed = new Map<string, OctValue>();

    for (const [edgeKey, value] of storedLinkByEdge) {
      const [from, to] = edgeKey.split('->') as [FanoPrimalSourceId, FanoPrimalSourceId];
      const gFrom = gBySite.get(from) as OctValue;
      const gTo = gBySite.get(to) as OctValue;
      // declared bracketing of the conjugation: g_i (U g_j^{-1})
      transformed.set(edgeKey, octMul(gFrom, octMul(value, octConjugate(gTo))));
    }

    const reVector = loops.map((loop) =>
      octRe(
        leftAssocProduct(
          loop.linkSequence.map(
            (link) => transformed.get(`${link.from}->${link.to}`) as OctValue,
          ),
        ),
      ),
    );
    let matches = 0;

    reVector.forEach((re, index) => {
      if (re === trueLinkReVector[index]) {
        matches += 1;
        perLoopInvariantCounts[index] += 1;
      }
    });
    patternMatches.push(matches);

    if (matches === loops.length) {
      fullMatches += 1;
    }
  }

  const sorted = [...patternMatches].sort((left, right) => left - right);
  const p95Index = Math.min(sorted.length - 1, Math.ceil(0.95 * sorted.length) - 1);

  return {
    draws: MOUFANG_CONJUGATION_DRAWS,
    perLoopReInvariantFraction: loops.map((loop, index) => ({
      loopId: loop.loopId,
      fraction: perLoopInvariantCounts[index] / MOUFANG_CONJUGATION_DRAWS,
    })),
    fullPatternMatchFraction: fullMatches / MOUFANG_CONJUGATION_DRAWS,
    patternMatchMean:
      patternMatches.reduce((sum, value) => sum + value, 0) / patternMatches.length,
    patternMatchP95: sorted[p95Index],
    patternMatchMax: sorted[sorted.length - 1],
    note:
      'Site-local gauge action U(i->j) -> g_i (U(i->j) g_j^{-1}), unit g per site (16 signed basis units incl +-1), declared sample of 64 seeded draws. Hexagon links conjugate per their own endpoints; the great-circle vertex-cycle does not telescope. Not defined for policy C (no links).',
  };
}

// ---------------------------------------------------------------------------
// Control summary helper
// ---------------------------------------------------------------------------

function summarizeControl(args: {
  controlId: MoufangControlDistribution['controlId'];
  policyId: MoufangPolicyId;
  realityFractions: number[];
  patternMatches: number[];
  fullMatches: number;
  patternKeys: Set<string>;
  loopCount: number;
  adaptationNote: string | null;
}): MoufangControlDistribution {
  const sortedReality = [...args.realityFractions].sort((left, right) => left - right);
  const sortedMatches = [...args.patternMatches].sort((left, right) => left - right);
  const p95 = (sorted: number[]): number =>
    sorted[Math.min(sorted.length - 1, Math.ceil(0.95 * sorted.length) - 1)];
  const mean = (values: number[]): number =>
    values.reduce((sum, value) => sum + value, 0) / values.length;

  return {
    controlId: args.controlId,
    policyId: args.policyId,
    draws: args.realityFractions.length,
    realityFractionMean: mean(args.realityFractions),
    realityFractionP95: p95(sortedReality),
    realityFractionMax: sortedReality[sortedReality.length - 1],
    patternMatchMean: mean(args.patternMatches),
    patternMatchP95: p95(sortedMatches),
    patternMatchMax: sortedMatches[sortedMatches.length - 1],
    fullPatternFraction: args.fullMatches / args.realityFractions.length,
    distinctRePatternCount: args.patternKeys.size,
    degenerateControl: args.patternKeys.size <= 1,
    adaptationNote: args.adaptationNote,
  };
}

// ---------------------------------------------------------------------------
// Mock-solution test (anti-staple)
// ---------------------------------------------------------------------------

function runMockSolution(args: {
  loops: MoufangLoopRecord[];
  storedLinkByEdge: Map<string, OctValue>;
  edgeKeys: string[];
  trueLinkReVector: number[];
  stream: () => number;
  computeLinkReVector: (linkMap: Map<string, OctValue>) => number[];
}): MoufangMockSolutionReport {
  const { edgeKeys, storedLinkByEdge, trueLinkReVector, stream } = args;
  const trueValues = edgeKeys.map((edgeKey) => storedLinkByEdge.get(edgeKey) as OctValue);

  // Seeded derangement of the 12 carriers (rejection sampling, deterministic).
  let permutation = drawPermutation(edgeKeys.length, stream);

  while (permutation.some((target, index) => target === index)) {
    permutation = drawPermutation(edgeKeys.length, stream);
  }

  const scrambled = new Map<string, OctValue>();

  edgeKeys.forEach((edgeKey, index) => {
    const base = trueValues[permutation[index]];
    const flip = stream() < 0.5;
    scrambled.set(edgeKey, {
      sign: (flip ? -1 * base.sign : base.sign) as 1 | -1,
      unit: base.unit,
    });
  });

  const scrambledReVector = args.computeLinkReVector(scrambled);
  const loopsEqualCount = scrambledReVector.filter(
    (re, index) => re === trueLinkReVector[index],
  ).length;

  return {
    scrambleDescription:
      'seeded derangement of the 12 true carriers across the 12 edges + independent sign flips (anti-staple: the pipeline must read carrier facts, not constants)',
    scrambledAssignment: edgeKeys.map((edgeKey) => ({
      edge: edgeKey,
      trueValueKey: octKey(storedLinkByEdge.get(edgeKey) as OctValue),
      scrambledValueKey: octKey(scrambled.get(edgeKey) as OctValue),
    })),
    trueReVector: trueLinkReVector,
    scrambledReVector,
    loopsEqualCount,
    loopCount: trueLinkReVector.length,
    patternBroke: loopsEqualCount !== trueLinkReVector.length,
  };
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

function parseSignedUnit(label: string): OctValue {
  const sign = label.startsWith('-') ? -1 : 1;
  const unitLabel = label.replace(/^[+-]/, '');
  const unit = unitLabel === '1' ? 0 : Number(unitLabel.slice(1));

  return { sign: sign as 1 | -1, unit };
}

function normalizeSignedLift(signedLift: string): string {
  return signedLift.startsWith('+') || signedLift.startsWith('-')
    ? signedLift
    : `+${signedLift}`;
}
