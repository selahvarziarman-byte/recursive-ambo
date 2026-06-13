import {
  buildMixedLoopLeavesQGateV0Report,
  GOVERNING_QUATERNIONIC_CAVEAT,
  SECTION_6_YELLOW_FLAG,
  type LeavesQDerivedEdge,
  type MixedLoopLeavesQGateV0Report,
} from './mixedLoopLeavesQGateV0';
import {
  octKey,
  octMul,
  octRe,
  type OctValue,
} from './moufangHolonomyValidityV0';
import {
  applyAutomorphism,
  buildMoufangAutomorphismGaugeV0Report,
  type SignedUnitAutomorphism,
} from './moufangAutomorphismGaugeV0';
import {
  buildFanoOctonionicCarrierTableV0Report,
} from './fanoOctonionicCarrierTableV0';
import {
  buildFanoOctonionicLocalChannelTableV0Report,
} from './fanoOctonionicLocalChannelTableV0';

/**
 * CBF F-I Phase-1, Run 2 -- the MIXED-LOOP VALIDITY GAUNTLET.
 *
 * The full WELL-DEFINED / GAUGE-INVARIANT / INFORMATIVE gauntlet on exactly
 * the 10 leaving-Q mixed loop classes the AUDITED leaves-Q gate admitted
 * (2C excluded as hub-grade). Links are CONSUMED from the gate's derivation
 * manifest -- none re-derived (sharpening 10.2). The holonomy definition is
 * the plan-declared, row-derived one (see HOLONOMY_DEFINITION below); its
 * binding consistency condition (the holonomy word operates in the SAME
 * generated subalgebra the gate proved) is verified per cycle at runtime, and
 * any mismatch ESCALATES. This module computes and reports raw values only:
 * it assigns NO per-class validity verdict and no octonionic-prize call --
 * the auditor classifies against a hash-committed sealed rule it does not see.
 * No field-activity claim, no broadcast design.
 */

export const GAUNTLET_METHOD = 'mixed-loop-validity-gauntlet-v0' as const;

export const GAUNTLET_GATE_DECLARATION = {
  declaredPath: 'C:\\Dev\\202cl\\PlatonicEngine202',
  declaredBranch: 'Claude-child',
  declaredHeadAtAuthoring: 'be14a3c',
  sealNote:
    'Run-2 validity-gauntlet sealed predictions (per-class addendum) hash-committed at be14a3c; expected values, thresholds, and the per-class rule withheld from the implementer',
} as const;

export const GAUNTLET_SEED = 20260615 as const;
export const GAUNTLET_CONTROL_DRAWS = 128 as const;
export const SITE_LOCAL_SET_SAMPLE_PER_FAMILY = 64 as const;

/** The plan-declared holonomy definition, echoed verbatim in the output. */
export const HOLONOMY_DEFINITION: string[] = [
  'The holonomy of a loop is the ordered product, in cycle order, of its edges gate-derived link contributions.',
  'hub edge i->j: 1 symbol -- the signed carrier U(i->j) (the gate single link unit).',
  'birth edge i->M_ij: 2 symbols in transport-row source->target order: (atom_i, childLift) -- the traversed parent recorded source quadrangle atom, then the child lift. The recorded atom is engaged in the word exactly as the gate leaves-Q determination counted it.',
  'response edge M->t via action s: 1 symbol per evaluation -- the C1 product result; WHICH of the two derived results (childLeftSignedResult vs sourceLeftSignedResult) is taken is a per-edge BRACKETING CHOICE, part of the bracketing freedom, not a free pick: the value-set ranges over both choices on every response edge.',
  'complement edge M->M2: 2 symbols in row source->target order: (sourceChildSignedLift, complementChildSignedLift).',
  'BINDING CONSISTENCY CONDITION (verified per cycle): the multiplicative closure of the holonomy word symbol set (both response alternatives included) must EQUAL the gate generated subalgebra for that cycle; any mismatch ESCALATES and HOLDS the class.',
];

export type GauntletBracketingClass =
  | 'value-identical'
  | 'identical-up-to-sign'
  | 'genuinely-bracketing-dependent';

export type GauntletMechanism =
  | 'well-defined-by-2-generation'
  | 'well-defined-despite-dim-8'
  | 'not-applicable';

export interface GauntletOutcomeRow {
  outcomeKey: string;
  cycleCount: number;
  witnessCycleId: string;
  wordLength: number;
  responseChoiceCount: number;
  bracketingsPerChoice: number;
  totalEvaluations: number;
  valueCensus: Array<{ valueKey: string; count: number }>;
  /** Classification per FIXED response-choice vector, over all
   *  parenthesizations (what 2-generation guarantees); the worst across
   *  vectors. */
  parenthesizationClass: GauntletBracketingClass;
  /** Distinct values per choice vector (the choice-axis data). */
  perChoiceValueKeys: string[];
  /** Classification over the FULL declared freedom
   *  (parenthesizations x response choices). */
  mergedClass: GauntletBracketingClass;
  gateClosureDimension: number;
  mechanism: GauntletMechanism;
}

export interface GauntletClassRow {
  classSignature: string;
  cycleCount: number;
  outcomes: GauntletOutcomeRow[];
  uniformAcrossCycles: boolean;
  batteryEligible: boolean;
  twoGenerationCrossCheckViolations: number;
}

export interface GauntletGlobalGaugeRow {
  classSignature: string;
  eligible: boolean;
  canonicalReInvariantPairFraction: number;
  covarianceEqualPairFraction: number;
  witnessReSetIdenticalAcrossOrbit: boolean;
}

export interface GauntletSiteLocalResult {
  actionNote: string;
  globalCoincidenceVerified: boolean;
  families: Array<{
    familyId: string;
    comboCount: number;
    consistentCount: number;
    consistentNonGlobalCount: number;
    run3ComparisonNote: string;
  }>;
  perClass: Array<{
    classSignature: string;
    eligible: boolean;
    canonicalReInvariantFractionOverConsistent: number;
    witnessReSetIdenticalFractionOverSample: number;
    sampleSize: number;
  }>;
}

export interface GauntletControlRow {
  classSignature: string;
  controlId: 'c0-strict-null' | 'c1-structure-preserving-null' | 'c2-permutation' | 'c3-sign-flip';
  eligible: boolean;
  draws: number;
  realityFractionMean: number;
  realityFractionP95: number;
  realityFractionMax: number;
  patternMatchMean: number;
  patternMatchP95: number;
  patternMatchMax: number;
  fullPatternFraction: number;
  distinctPatternCount: number;
  degenerateControl: boolean;
  adaptationNote: string | null;
}

export interface GauntletMockClassRow {
  classSignature: string;
  truePatternKey: string;
  mockPatternKey: string;
  patternChanged: boolean;
  trueClassificationSummary: string;
  mockClassificationSummary: string;
  classificationChanged: boolean;
}

export interface GauntletEscalationRecord {
  escalationId: string;
  context: string;
  detail: string;
  escalationNote: 'genuine ambiguity or defect; escalates to mothership, never a silent design choice';
}

export interface GauntletLedgerRow {
  ledgerId: string;
  context: string;
  measurement: string;
  derivationStatus: '';
}

export interface GauntletIntegrityIssue {
  code: string;
  message: string;
}

export interface MixedLoopValidityGauntletV0Report {
  reportId: string;
  method: typeof GAUNTLET_METHOD;
  declaredGate: typeof GAUNTLET_GATE_DECLARATION;
  governingQuaternionicCaveat: string;
  yellowFlag: string;
  holonomyDefinition: string[];
  diagnosticScope: 'computes-and-reports-only-pure-math-finite-diagnostic';
  verdictStatus: 'no-validity-verdict-auditor-classifies-against-hash-committed-sealed-rule';
  consumedSubstrates: string[];
  seed: number;
  streamConsumptionOrder: string[];
  scope: {
    classCount: number;
    cycleCount: number;
    excludedClassSignatures: string[];
    inventoryVerified: boolean;
  };
  consistencyCondition: {
    cyclesChecked: number;
    cyclesConsistent: number;
    expressionsVerified: number;
    expressionsReproducedStored: number;
  };
  censusCrossCheck: {
    consumedMonomialCount: number;
    consumedCollineationCount: number;
    localMonomialCount: number;
    localCollineationCount: number;
    matches: boolean;
  };
  classRows: GauntletClassRow[];
  globalGauge: {
    automorphismCount: number;
    measurementScopeNote: string;
    rows: GauntletGlobalGaugeRow[];
  };
  siteLocal: GauntletSiteLocalResult;
  controls: GauntletControlRow[];
  mock: {
    scrambleDescription: string;
    slotCount: number;
    rows: GauntletMockClassRow[];
    changedClassCount: number;
    voidGuardPassed: boolean;
  };
  escalations: GauntletEscalationRecord[];
  anomalyLedger: GauntletLedgerRow[];
  integrityIssueCount: number;
  integrityIssues: GauntletIntegrityIssue[];
  ok: boolean;
}

// ---------------------------------------------------------------------------
// Local algebra helpers over the consumed product law
// ---------------------------------------------------------------------------

const PRIMAL_SITES = ['A', 'B', 'C', 'D'] as const;
type PrimalSite = (typeof PRIMAL_SITES)[number];
const NODE_ORDER = ['A', 'B', 'C', 'D', 'M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const CATALAN = [1, 1, 2, 5, 14, 42, 132, 429];

function parseSignedUnit(label: string): OctValue {
  const sign = label.startsWith('-') ? -1 : 1;
  const unitLabel = label.replace(/^[+-]/, '');
  const unit = unitLabel === '1' ? 0 : Number(unitLabel.slice(1));

  return { sign: sign as 1 | -1, unit };
}

function octIndex(value: OctValue): number {
  return value.unit * 2 + (value.sign === 1 ? 0 : 1);
}

function octFromIndex(index: number): OctValue {
  return { sign: index % 2 === 0 ? 1 : -1, unit: Math.floor(index / 2) };
}

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

/** Exact interval DP: per-value bracketing counts over ALL parenthesizations.
 *  Re-implemented locally over the consumed octMul (the Gate-0 internal helper
 *  is not exported; declared in the plan). */
function analyzeBracketingsWithCounts(
  word: OctValue[],
): { total: number; census: Map<number, number> } {
  const n = word.length;
  const dp: Array<Array<Map<number, number>>> = [];

  for (let i = 0; i < n; i += 1) {
    dp.push([]);

    for (let j = 0; j < n; j += 1) {
      dp[i].push(new Map());
    }

    dp[i][i].set(octIndex(word[i]), 1);
  }

  for (let span = 2; span <= n; span += 1) {
    for (let i = 0; i + span - 1 < n; i += 1) {
      const j = i + span - 1;
      const cell = dp[i][j];

      for (let k = i; k < j; k += 1) {
        for (const [leftIdx, leftCount] of dp[i][k]) {
          for (const [rightIdx, rightCount] of dp[k + 1][j]) {
            const productIdx = MUL_INDEX_TABLE[leftIdx][rightIdx];
            cell.set(productIdx, (cell.get(productIdx) ?? 0) + leftCount * rightCount);
          }
        }
      }
    }
  }

  const census = dp[0][n - 1];
  let total = 0;

  for (const count of census.values()) {
    total += count;
  }

  return { total, census };
}

/** Set-only mask DP over all bracketings. */
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

function classifyValueIndices(indices: number[]): GauntletBracketingClass {
  if (indices.length === 1) {
    return 'value-identical';
  }

  if (indices.length === 2) {
    const left = octFromIndex(indices[0]);
    const right = octFromIndex(indices[1]);

    if (left.unit === right.unit && left.sign !== right.sign) {
      return 'identical-up-to-sign';
    }
  }

  return 'genuinely-bracketing-dependent';
}

function closeUnderProduct(seedKeys: string[]): string[] {
  const closed = new Set<number>(seedKeys.map((key) => octIndex(parseSignedUnit(key))));
  let changed = true;

  while (changed) {
    changed = false;
    const current = [...closed];

    for (const leftIdx of current) {
      for (const rightIdx of current) {
        const productIdx = MUL_INDEX_TABLE[leftIdx][rightIdx];

        if (!closed.has(productIdx)) {
          closed.add(productIdx);
          changed = true;
        }
      }
    }
  }

  return [...closed].map((index) => octKey(octFromIndex(index))).sort();
}

function dimensionOfKeys(keys: string[]): number {
  return new Set(keys.map((key) => parseSignedUnit(key).unit)).size;
}

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

function drawPermutation(size: number, next: () => number): number[] {
  const permutation = Array.from({ length: size }, (_unused, index) => index);

  for (let index = size - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(next() * (index + 1));
    const held = permutation[index];
    permutation[index] = permutation[swapIndex];
    permutation[swapIndex] = held;
  }

  return permutation;
}

function drawDerangement(size: number, next: () => number): number[] {
  let permutation = drawPermutation(size, next);

  while (permutation.some((target, index) => target === index)) {
    permutation = drawPermutation(size, next);
  }

  return permutation;
}

function enumeratePermutations(items: number[]): number[][] {
  if (items.length <= 1) {
    return [items];
  }

  const results: number[][] = [];

  items.forEach((item, index) => {
    const rest = items.filter((_value, restIndex) => restIndex !== index);

    for (const tail of enumeratePermutations(rest)) {
      results.push([item, ...tail]);
    }
  });

  return results;
}

// ---------------------------------------------------------------------------
// Symbol derivation expressions (site-local action + C1-mixed control)
// ---------------------------------------------------------------------------

interface SymbolDerivation {
  exprKind: 'atom' | 'lift' | 'child-left' | 'source-left';
  atomSite: PrimalSite | null;
  parents: [PrimalSite, PrimalSite] | null;
  action: PrimalSite | null;
  slot: { edgeId: string; position: number };
  storedKey: string;
}

interface WordElement {
  edgeId: string;
  kind: 'fixed' | 'choice';
  derivations: SymbolDerivation[]; // 1 for fixed; 2 for choice [childLeft, sourceLeft]
}

type AtomMap = Record<PrimalSite, OctValue>;

function evaluateDerivation(derivation: SymbolDerivation, atoms: AtomMap): OctValue {
  if (derivation.exprKind === 'atom') {
    return atoms[derivation.atomSite as PrimalSite];
  }

  const [x, y] = derivation.parents as [PrimalSite, PrimalSite];
  const lift = octMul(atoms[x], atoms[y]);

  if (derivation.exprKind === 'lift') {
    return lift;
  }

  const actionAtom = atoms[derivation.action as PrimalSite];

  return derivation.exprKind === 'child-left'
    ? octMul(lift, actionAtom)
    : octMul(actionAtom, lift);
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export function buildMixedLoopValidityGauntletV0Report(): MixedLoopValidityGauntletV0Report {
  const integrityIssues: GauntletIntegrityIssue[] = [];
  const ledger: GauntletLedgerRow[] = [];
  const escalations: GauntletEscalationRecord[] = [];
  let ledgerCounter = 0;
  let escalationCounter = 0;

  const pushIssue = (code: string, message: string): void => {
    integrityIssues.push({ code, message });
  };
  const pushLedger = (context: string, measurement: string): void => {
    ledgerCounter += 1;
    ledger.push({
      ledgerId: `gauntlet-ledger-${String(ledgerCounter).padStart(2, '0')}`,
      context,
      measurement,
      derivationStatus: '',
    });
  };
  const pushEscalation = (context: string, detail: string): void => {
    escalationCounter += 1;
    escalations.push({
      escalationId: `gauntlet-escalation-${String(escalationCounter).padStart(2, '0')}`,
      context,
      detail,
      escalationNote:
        'genuine ambiguity or defect; escalates to mothership, never a silent design choice',
    });
    pushIssue('escalation', `${context}: ${detail}`);
  };

  // -------------------------------------------------------------------------
  // Consumed substrates (READ-ONLY)
  // -------------------------------------------------------------------------
  const gate: MixedLoopLeavesQGateV0Report = buildMixedLoopLeavesQGateV0Report();
  const run3 = buildMoufangAutomorphismGaugeV0Report();
  const carrierTable = buildFanoOctonionicCarrierTableV0Report();
  const c1 = buildFanoOctonionicLocalChannelTableV0Report();

  if (!gate.ok) {
    pushIssue('leaves-q-gate-not-ok', `Gate integrity ${gate.integrityIssueCount}.`);
  }

  if (!run3.ok) {
    pushIssue('run3-not-ok', `Run-3 integrity ${run3.integrityIssueCount}.`);
  }

  if (!carrierTable.ok) {
    pushIssue('carrier-table-not-ok', 'Carrier table report is not ok.');
  }

  if (!c1.ok) {
    pushIssue('c1-not-ok', 'C1 report is not ok.');
  }

  const atoms: AtomMap = { A: { sign: 1, unit: 1 }, B: { sign: 1, unit: 2 }, C: { sign: 1, unit: 4 }, D: { sign: 1, unit: 7 } };

  for (const row of carrierTable.primalCarrierRows) {
    atoms[row.sourceId as PrimalSite] = parseSignedUnit(`+${row.carrierUnit}`);
  }

  const canonicalParentsByToken = new Map<string, [PrimalSite, PrimalSite]>();

  for (const state of c1.canonicalChildCarrierStates) {
    const [x, y] = state.canonicalLiftId.split('·') as [PrimalSite, PrimalSite];
    canonicalParentsByToken.set(state.tokenId, [x, y]);
  }

  // -------------------------------------------------------------------------
  // Word elements per consumed gate edge + expression verification
  // -------------------------------------------------------------------------
  const edgeById = new Map(gate.derivationManifest.map((edge) => [edge.edgeId, edge]));
  const wordElementsByEdgeId = new Map<string, WordElement[]>();
  let expressionsVerified = 0;
  let expressionsReproducedStored = 0;

  const verifyExpression = (derivation: SymbolDerivation): void => {
    expressionsVerified += 1;
    const evaluated = octKey(evaluateDerivation(derivation, atoms));

    if (evaluated === derivation.storedKey) {
      expressionsReproducedStored += 1;
    } else {
      pushEscalation(
        'expression-reproduction-failure',
        `${derivation.slot.edgeId}[${derivation.slot.position}]: expression evaluates to ${evaluated}, stored ${derivation.storedKey}.`,
      );
    }
  };

  for (const edge of gate.derivationManifest) {
    const elements: WordElement[] = [];

    if (edge.family === 'hub') {
      const [i, j] = [edge.from as PrimalSite, edge.to as PrimalSite];
      const derivation: SymbolDerivation = {
        exprKind: 'lift',
        atomSite: null,
        parents: [i, j],
        action: null,
        slot: { edgeId: edge.edgeId, position: 0 },
        storedKey: edge.linkUnitKeys[0],
      };
      verifyExpression(derivation);
      elements.push({ edgeId: edge.edgeId, kind: 'fixed', derivations: [derivation] });
    } else if (edge.family === 'birth') {
      // Gate slot order is [childLift, atom]; the declared holonomy order is
      // (atom, childLift) -- the transport row's source->target order.
      const parentSite = edge.from as PrimalSite;
      const parents = canonicalParentsByToken.get(edge.to);

      if (!parents) {
        pushEscalation('birth-canonical-parents-missing', edge.edgeId);
        continue;
      }

      const atomDerivation: SymbolDerivation = {
        exprKind: 'atom',
        atomSite: parentSite,
        parents: null,
        action: null,
        slot: { edgeId: edge.edgeId, position: 1 },
        storedKey: edge.linkUnitKeys[1],
      };
      const liftDerivation: SymbolDerivation = {
        exprKind: 'lift',
        atomSite: null,
        parents,
        action: null,
        slot: { edgeId: edge.edgeId, position: 0 },
        storedKey: edge.linkUnitKeys[0],
      };
      verifyExpression(atomDerivation);
      verifyExpression(liftDerivation);
      elements.push({ edgeId: edge.edgeId, kind: 'fixed', derivations: [atomDerivation] });
      elements.push({ edgeId: edge.edgeId, kind: 'fixed', derivations: [liftDerivation] });
    } else if (edge.family === 'response-parent-return' || edge.family === 'response-projection-loop') {
      const parents = canonicalParentsByToken.get(edge.from);

      if (!parents || !edge.viaActionSource) {
        pushEscalation('response-derivation-missing', edge.edgeId);
        continue;
      }

      const childLeft: SymbolDerivation = {
        exprKind: 'child-left',
        atomSite: null,
        parents,
        action: edge.viaActionSource as PrimalSite,
        slot: { edgeId: edge.edgeId, position: 0 },
        storedKey: edge.linkUnitKeys[0],
      };
      const sourceLeft: SymbolDerivation = {
        exprKind: 'source-left',
        atomSite: null,
        parents,
        action: edge.viaActionSource as PrimalSite,
        slot: { edgeId: edge.edgeId, position: 1 },
        storedKey: edge.linkUnitKeys[1],
      };
      verifyExpression(childLeft);
      verifyExpression(sourceLeft);
      elements.push({
        edgeId: edge.edgeId,
        kind: 'choice',
        derivations: [childLeft, sourceLeft],
      });
    } else {
      // complement edge M -> M2: (source child's canonical lift, complement child's canonical lift)
      const sourceParents = canonicalParentsByToken.get(edge.from);
      const complementParents = canonicalParentsByToken.get(edge.to);

      if (!sourceParents || !complementParents) {
        pushEscalation('complement-derivation-missing', edge.edgeId);
        continue;
      }

      const sourceDerivation: SymbolDerivation = {
        exprKind: 'lift',
        atomSite: null,
        parents: sourceParents,
        action: null,
        slot: { edgeId: edge.edgeId, position: 0 },
        storedKey: edge.linkUnitKeys[0],
      };
      const complementDerivation: SymbolDerivation = {
        exprKind: 'lift',
        atomSite: null,
        parents: complementParents,
        action: null,
        slot: { edgeId: edge.edgeId, position: 1 },
        storedKey: edge.linkUnitKeys[1],
      };
      verifyExpression(sourceDerivation);
      verifyExpression(complementDerivation);
      elements.push({ edgeId: edge.edgeId, kind: 'fixed', derivations: [sourceDerivation] });
      elements.push({ edgeId: edge.edgeId, kind: 'fixed', derivations: [complementDerivation] });
    }

    wordElementsByEdgeId.set(edge.edgeId, elements);
  }

  // -------------------------------------------------------------------------
  // Cycle re-enumeration over the CONSUMED edges + inventory verification
  // -------------------------------------------------------------------------
  interface GauntletCycle {
    cycleId: string;
    edgeIds: string[];
    classSignature: string;
  }

  const FAMILY_TOKENS: Record<LeavesQDerivedEdge['family'], string> = {
    hub: 'H',
    birth: 'B',
    'response-parent-return': 'Rpr',
    'response-projection-loop': 'Rpl',
    complement: 'C',
  };
  const edgesByFrom = new Map<string, LeavesQDerivedEdge[]>();

  for (const edge of gate.derivationManifest) {
    const list = edgesByFrom.get(edge.from) ?? [];
    list.push(edge);
    edgesByFrom.set(edge.from, list);
  }

  const nodeIndex = new Map(NODE_ORDER.map((node, index) => [node, index]));
  const cycles: GauntletCycle[] = [];

  const dfs = (
    startNode: string,
    currentNode: string,
    pathEdges: LeavesQDerivedEdge[],
    visited: Set<string>,
  ): void => {
    for (const edge of edgesByFrom.get(currentNode) ?? []) {
      if (edge.to === startNode && pathEdges.length + 1 >= 2) {
        const cycleEdges = [...pathEdges, edge];
        const families = cycleEdges.map((cycleEdge) => cycleEdge.family);

        if (!families.every((family) => family === 'hub')) {
          const counts = new Map<string, number>();

          for (const family of families) {
            const token = FAMILY_TOKENS[family];
            counts.set(token, (counts.get(token) ?? 0) + 1);
          }

          const signature = [...counts.entries()]
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([token, count]) => (count === 1 ? token : `${count}${token}`))
            .join('+');
          cycles.push({
            cycleId: cycleEdges.map((cycleEdge) => cycleEdge.edgeId).join(' , '),
            edgeIds: cycleEdges.map((cycleEdge) => cycleEdge.edgeId),
            classSignature: signature,
          });
        }
      }

      if (pathEdges.length + 1 < 4) {
        const nextIndex = nodeIndex.get(edge.to) ?? -1;
        const startIndex = nodeIndex.get(startNode) ?? -1;

        if (nextIndex > startIndex && !visited.has(edge.to)) {
          visited.add(edge.to);
          dfs(startNode, edge.to, [...pathEdges, edge], visited);
          visited.delete(edge.to);
        }
      }
    }
  };

  for (const startNode of NODE_ORDER) {
    dfs(startNode, startNode, [], new Set([startNode]));
  }

  // Verify the consumed inventory: per-class counts + witness membership.
  const cyclesBySignature = new Map<string, GauntletCycle[]>();

  for (const cycle of cycles) {
    const list = cyclesBySignature.get(cycle.classSignature) ?? [];
    list.push(cycle);
    cyclesBySignature.set(cycle.classSignature, list);
  }

  let inventoryVerified = true;

  for (const gateClass of gate.classRows) {
    const localCycles = cyclesBySignature.get(gateClass.classSignature) ?? [];

    if (localCycles.length !== gateClass.cycleCount) {
      inventoryVerified = false;
      pushEscalation(
        'inventory-count-mismatch',
        `Class ${gateClass.classSignature}: gate ${gateClass.cycleCount} vs re-enumerated ${localCycles.length}.`,
      );
    }

    for (const outcome of gateClass.outcomes) {
      if (!localCycles.some((cycle) => cycle.cycleId === outcome.witnessCycleId)) {
        inventoryVerified = false;
        pushEscalation(
          'inventory-witness-missing',
          `Gate witness ${outcome.witnessCycleId} not found in the re-enumeration.`,
        );
      }
    }
  }

  const EXCLUDED = ['2C'];
  const scopeClasses = gate.classRows
    .map((row) => row.classSignature)
    .filter((signature) => !EXCLUDED.includes(signature))
    .sort();
  const scopeCycles = cycles.filter((cycle) => scopeClasses.includes(cycle.classSignature));

  if (scopeClasses.length !== 10) {
    pushIssue('scope-class-count-mismatch', `Expected 10 classes, got ${scopeClasses.length}.`);
  }

  // -------------------------------------------------------------------------
  // Words per cycle, slot tables, consistency condition
  // -------------------------------------------------------------------------
  const slotKeyOf = (slot: { edgeId: string; position: number }): string =>
    `${slot.edgeId}#${slot.position}`;
  const trueSlotValues = new Map<string, OctValue>();

  for (const edge of gate.derivationManifest) {
    edge.linkUnitKeys.forEach((key, position) => {
      trueSlotValues.set(slotKeyOf({ edgeId: edge.edgeId, position }), parseSignedUnit(key));
    });
  }

  const wordElementsOf = (cycle: GauntletCycle): WordElement[] =>
    cycle.edgeIds.flatMap((edgeId) => wordElementsByEdgeId.get(edgeId) ?? []);

  const wordFromSlots = (
    elements: WordElement[],
    slots: Map<string, OctValue>,
    choiceVector: number[],
  ): OctValue[] => {
    let choiceIndex = 0;

    return elements.map((element) => {
      const derivation =
        element.kind === 'choice'
          ? element.derivations[choiceVector[choiceIndex++] ?? 0]
          : element.derivations[0];

      return slots.get(slotKeyOf(derivation.slot)) as OctValue;
    });
  };

  const wordFromAtoms = (
    elements: WordElement[],
    atomMap: AtomMap,
    choiceVector: number[],
  ): OctValue[] => {
    let choiceIndex = 0;

    return elements.map((element) => {
      const derivation =
        element.kind === 'choice'
          ? element.derivations[choiceVector[choiceIndex++] ?? 0]
          : element.derivations[0];

      return evaluateDerivation(derivation, atomMap);
    });
  };

  const choiceVectorsOf = (elements: WordElement[]): number[][] => {
    const choiceCount = elements.filter((element) => element.kind === 'choice').length;
    const vectors: number[][] = [];

    for (let mask = 0; mask < 1 << choiceCount; mask += 1) {
      vectors.push(
        Array.from({ length: choiceCount }, (_unused, index) => (mask >> index) & 1),
      );
    }

    return vectors;
  };

  // Consistency: word symbol union closure == gate-link closure per cycle.
  let cyclesConsistent = 0;

  for (const cycle of scopeCycles) {
    const elements = wordElementsOf(cycle);
    const wordSymbolKeys = [
      ...new Set(
        elements.flatMap((element) =>
          element.derivations.map((derivation) =>
            octKey(trueSlotValues.get(slotKeyOf(derivation.slot)) as OctValue),
          ),
        ),
      ),
    ];
    const gateSeedKeys = [
      ...new Set(
        cycle.edgeIds.flatMap((edgeId) => edgeById.get(edgeId)?.linkUnitKeys ?? []),
      ),
    ];
    const wordClosure = closeUnderProduct(wordSymbolKeys).join(',');
    const gateClosure = closeUnderProduct(gateSeedKeys).join(',');

    if (wordClosure === gateClosure) {
      cyclesConsistent += 1;
    } else {
      pushEscalation(
        'holonomy-consistency-condition-failed',
        `${cycle.classSignature} cycle [${cycle.cycleId}]: word closure != gate closure.`,
      );
    }
  }

  // -------------------------------------------------------------------------
  // PART 1 -- WELL-DEFINED (exact DP with counts, per cycle; per-class outcomes)
  // -------------------------------------------------------------------------
  interface CycleAnalysis {
    cycle: GauntletCycle;
    wordLength: number;
    responseChoiceCount: number;
    bracketingsPerChoice: number;
    totalEvaluations: number;
    valueCensus: Array<{ valueKey: string; count: number }>;
    perChoiceValueKeys: string[];
    parenthesizationClass: GauntletBracketingClass;
    mergedClass: GauntletBracketingClass;
    gateClosureKeys: string[];
  }

  const CLASS_SEVERITY: Record<GauntletBracketingClass, number> = {
    'value-identical': 0,
    'identical-up-to-sign': 1,
    'genuinely-bracketing-dependent': 2,
  };

  const analyzeCycle = (
    cycle: GauntletCycle,
    slots: Map<string, OctValue>,
  ): CycleAnalysis => {
    const elements = wordElementsOf(cycle);
    const vectors = choiceVectorsOf(elements);
    const wordLength = elements.length;
    const merged = new Map<number, number>();
    const perChoiceValueKeys: string[] = [];
    let parenthesizationClass: GauntletBracketingClass = 'value-identical';
    let totalEvaluations = 0;
    let bracketingsPerChoice = 0;

    for (const vector of vectors) {
      const word = wordFromSlots(elements, slots, vector);
      const { total, census } = analyzeBracketingsWithCounts(word);
      bracketingsPerChoice = total;
      totalEvaluations += total;
      const vectorIndices = [...census.keys()].sort((a, b) => a - b);
      const vectorClass = classifyValueIndices(vectorIndices);

      if (CLASS_SEVERITY[vectorClass] > CLASS_SEVERITY[parenthesizationClass]) {
        parenthesizationClass = vectorClass;
      }

      perChoiceValueKeys.push(
        vectorIndices.map((index) => octKey(octFromIndex(index))).join('/'),
      );

      for (const [index, count] of census) {
        merged.set(index, (merged.get(index) ?? 0) + count);
      }
    }

    const expectedPerChoice = CATALAN[wordLength - 1];

    if (bracketingsPerChoice !== expectedPerChoice) {
      pushIssue(
        'catalan-total-mismatch',
        `${cycle.cycleId}: DP total ${bracketingsPerChoice} != Catalan ${expectedPerChoice}.`,
      );
    }

    const distinctIndices = [...merged.keys()].sort((a, b) => a - b);
    const gateSeedKeys = [
      ...new Set(cycle.edgeIds.flatMap((edgeId) => edgeById.get(edgeId)?.linkUnitKeys ?? [])),
    ];

    return {
      cycle,
      wordLength,
      responseChoiceCount: vectors.length,
      bracketingsPerChoice,
      totalEvaluations,
      valueCensus: [...merged.entries()]
        .sort(([, left], [, right]) => right - left)
        .map(([index, count]) => ({ valueKey: octKey(octFromIndex(index)), count })),
      perChoiceValueKeys,
      parenthesizationClass,
      mergedClass: classifyValueIndices(distinctIndices),
      gateClosureKeys: closeUnderProduct(gateSeedKeys),
    };
  };

  const analysesByClass = new Map<string, CycleAnalysis[]>();

  for (const cycle of scopeCycles) {
    const analysis = analyzeCycle(cycle, trueSlotValues);
    const list = analysesByClass.get(cycle.classSignature) ?? [];
    list.push(analysis);
    analysesByClass.set(cycle.classSignature, list);
  }

  const classRows: GauntletClassRow[] = scopeClasses.map((classSignature) => {
    const analyses = analysesByClass.get(classSignature) ?? [];
    const outcomeMap = new Map<string, CycleAnalysis[]>();

    for (const analysis of analyses) {
      const outcomeKey = `${analysis.parenthesizationClass}|${analysis.mergedClass}|${analysis.valueCensus
        .map((entry) => `${entry.valueKey}x${entry.count}`)
        .join(',')}`;
      const list = outcomeMap.get(outcomeKey) ?? [];
      list.push(analysis);
      outcomeMap.set(outcomeKey, list);
    }

    // The 2-generation cross-check tests what 2-generation guarantees:
    // parenthesization-invariance PER FIXED response-choice vector. The
    // response-choice axis is a declared separate freedom (its sign flip is
    // reported as data, not as an associativity violation).
    let crossCheckViolations = 0;

    for (const analysis of analyses) {
      const gateDim = dimensionOfKeys(analysis.gateClosureKeys);

      if (gateDim <= 4 && analysis.parenthesizationClass !== 'value-identical') {
        crossCheckViolations += 1;
        pushEscalation(
          'two-generation-cross-check-violation',
          `${classSignature} cycle [${analysis.cycle.cycleId}]: gate closure dim ${gateDim} (associative) but per-choice parenthesization class ${analysis.parenthesizationClass}.`,
        );
      }
    }

    const outcomes: GauntletOutcomeRow[] = [...outcomeMap.entries()]
      .sort(([, left], [, right]) => right.length - left.length)
      .map(([outcomeKey, group]) => {
        const witness = group[0];
        const gateDim = dimensionOfKeys(witness.gateClosureKeys);
        const mechanism: GauntletMechanism =
          witness.parenthesizationClass === 'value-identical'
            ? gateDim <= 4
              ? 'well-defined-by-2-generation'
              : 'well-defined-despite-dim-8'
            : 'not-applicable';

        return {
          outcomeKey,
          cycleCount: group.length,
          witnessCycleId: witness.cycle.cycleId,
          wordLength: witness.wordLength,
          responseChoiceCount: witness.responseChoiceCount,
          bracketingsPerChoice: witness.bracketingsPerChoice,
          totalEvaluations: witness.totalEvaluations,
          valueCensus: witness.valueCensus,
          parenthesizationClass: witness.parenthesizationClass,
          perChoiceValueKeys: witness.perChoiceValueKeys,
          mergedClass: witness.mergedClass,
          gateClosureDimension: gateDim,
          mechanism,
        };
      });

    const batteryEligible = outcomes.every(
      (outcome) =>
        (outcome.mergedClass === 'value-identical' ||
          outcome.mergedClass === 'identical-up-to-sign') &&
        outcome.parenthesizationClass !== 'genuinely-bracketing-dependent',
    );

    if (outcomes.length > 1) {
      pushLedger(
        `non-uniform-class:${classSignature}`,
        `Class ${classSignature} has ${outcomes.length} distinct DP outcomes across its ${analyses.length} cycles (reported per outcome).`,
      );
    }

    return {
      classSignature,
      cycleCount: analyses.length,
      outcomes,
      uniformAcrossCycles: outcomes.length === 1,
      batteryEligible,
      twoGenerationCrossCheckViolations: crossCheckViolations,
    };
  });

  const mechanismSummary = classRows
    .map(
      (row) =>
        `${row.classSignature}: ${[...new Set(row.outcomes.map((outcome) => outcome.mechanism))].join('/')}`,
    )
    .join('; ');
  pushLedger(
    'mechanism-census',
    `Per-class well-definedness mechanisms (raw): ${mechanismSummary}.`,
  );

  const choiceAxisSplitCycleCount = [...analysesByClass.values()]
    .flat()
    .filter((analysis) => analysis.mergedClass !== analysis.parenthesizationClass).length;

  if (choiceAxisSplitCycleCount > 0) {
    pushLedger(
      'response-choice-axis-observation',
      `On ${choiceAxisSplitCycleCount}/${scopeCycles.length} cycles the MERGED classification differs from the per-choice parenthesization classification: the childLeft/sourceLeft response-choice axis flips the holonomy sign even where every fixed choice is parenthesization-invariant. Measured, reported on both axes; the choice-axis sign is channel-orientation data, not an associativity failure.`,
    );
  }

  // -------------------------------------------------------------------------
  // Automorphism census re-derivation + consumed cross-check
  // -------------------------------------------------------------------------
  const allPermutations = enumeratePermutations([1, 2, 3, 4, 5, 6, 7]);
  const monomialByPermKey = new Map<string, number[]>();
  let localMonomialCount = 0;

  for (const perm of allPermutations) {
    const permTable = [0, ...perm];

    for (let signMask = 0; signMask < 128; signMask += 1) {
      const signs = [0, 0, 0, 0, 0, 0, 0, 0];

      for (let unit = 1; unit <= 7; unit += 1) {
        signs[unit] = (signMask & (1 << (unit - 1))) === 0 ? 1 : -1;
      }

      const automorphism: SignedUnitAutomorphism = { autId: '', perm: permTable, signs, signMask };
      let multiplicative = true;

      for (let i = 1; i <= 7 && multiplicative; i += 1) {
        for (let j = 1; j <= 7; j += 1) {
          const lhs = applyAutomorphism(automorphism, octMul({ sign: 1, unit: i }, { sign: 1, unit: j }));
          const rhs = octMul(
            applyAutomorphism(automorphism, { sign: 1, unit: i }),
            applyAutomorphism(automorphism, { sign: 1, unit: j }),
          );

          if (lhs.sign !== rhs.sign || lhs.unit !== rhs.unit) {
            multiplicative = false;
            break;
          }
        }
      }

      if (multiplicative) {
        localMonomialCount += 1;
        const permKey = perm.join(',');
        const masks = monomialByPermKey.get(permKey) ?? [];
        masks.push(signMask);
        monomialByPermKey.set(permKey, masks);
      }
    }
  }

  const canonicalLifts: SignedUnitAutomorphism[] = [...monomialByPermKey.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([permKey, masks]) => {
      const perm = permKey.split(',').map(Number);
      const signMask = Math.min(...masks);
      const signs = [0, 0, 0, 0, 0, 0, 0, 0];

      for (let unit = 1; unit <= 7; unit += 1) {
        signs[unit] = (signMask & (1 << (unit - 1))) === 0 ? 1 : -1;
      }

      return { autId: `aut:${permKey}:s${signMask}`, perm: [0, ...perm], signs, signMask };
    });

  const censusCrossCheck = {
    consumedMonomialCount: run3.automorphismGroup.monomialAutomorphismCount,
    consumedCollineationCount: run3.automorphismGroup.distinctCollineationCount,
    localMonomialCount,
    localCollineationCount: monomialByPermKey.size,
    matches:
      localMonomialCount === run3.automorphismGroup.monomialAutomorphismCount &&
      monomialByPermKey.size === run3.automorphismGroup.distinctCollineationCount,
  };

  if (!censusCrossCheck.matches) {
    pushIssue(
      'census-cross-check-mismatch',
      `Local census ${localMonomialCount}/${monomialByPermKey.size} vs consumed ${censusCrossCheck.consumedMonomialCount}/${censusCrossCheck.consumedCollineationCount}.`,
    );
  }

  // -------------------------------------------------------------------------
  // PART 2 -- GAUGE
  // -------------------------------------------------------------------------
  const eligibleSignatures = new Set(
    classRows.filter((row) => row.batteryEligible).map((row) => row.classSignature),
  );
  const eligibleCycles = scopeCycles.filter((cycle) =>
    eligibleSignatures.has(cycle.classSignature),
  );
  const witnessCycles: GauntletCycle[] = classRows.flatMap((row) =>
    row.batteryEligible
      ? row.outcomes.map(
          (outcome) =>
            scopeCycles.find((cycle) => cycle.cycleId === outcome.witnessCycleId) as GauntletCycle,
        )
      : [],
  );

  const canonicalProduct = (cycle: GauntletCycle, slots: Map<string, OctValue>): OctValue => {
    const elements = wordElementsOf(cycle);
    const zeroVector = elements
      .filter((element) => element.kind === 'choice')
      .map(() => 0);

    return leftAssocProduct(wordFromSlots(elements, slots, zeroVector));
  };

  const valueMaskOf = (cycle: GauntletCycle, slots: Map<string, OctValue>): number => {
    const elements = wordElementsOf(cycle);
    let mask = 0;

    for (const vector of choiceVectorsOf(elements)) {
      mask |= bracketingValueMask(wordFromSlots(elements, slots, vector));
    }

    return mask;
  };

  const reSetOfMask = (mask: number): string => {
    const reSet = new Set<number>();

    for (let index = 0; index < 16; index += 1) {
      if ((mask & (1 << index)) !== 0) {
        reSet.add(octRe(octFromIndex(index)));
      }
    }

    return [...reSet].sort().join(',');
  };

  const trueCanonicalByCycle = new Map<string, OctValue>(
    scopeCycles.map((cycle) => [cycle.cycleId, canonicalProduct(cycle, trueSlotValues)]),
  );
  const trueWitnessReSet = new Map<string, string>(
    witnessCycles.map((cycle) => [cycle.cycleId, reSetOfMask(valueMaskOf(cycle, trueSlotValues))]),
  );

  // Global-coincidence verification: phi(stored) == expression(phi-atoms), all lifts x slots.
  let globalCoincidenceVerified = true;

  for (const lift of canonicalLifts) {
    const transformedAtoms: AtomMap = {
      A: applyAutomorphism(lift, atoms.A),
      B: applyAutomorphism(lift, atoms.B),
      C: applyAutomorphism(lift, atoms.C),
      D: applyAutomorphism(lift, atoms.D),
    };

    for (const elements of wordElementsByEdgeId.values()) {
      for (const element of elements) {
        for (const derivation of element.derivations) {
          const direct = applyAutomorphism(
            lift,
            trueSlotValues.get(slotKeyOf(derivation.slot)) as OctValue,
          );
          const viaExpression = evaluateDerivation(derivation, transformedAtoms);

          if (octKey(direct) !== octKey(viaExpression)) {
            globalCoincidenceVerified = false;
          }
        }
      }
    }
  }

  if (!globalCoincidenceVerified) {
    pushEscalation(
      'global-action-coincidence-failure',
      'The slot-value action and the derivation-expression action disagree at a global assignment.',
    );
  }

  const globalRows: GauntletGlobalGaugeRow[] = classRows.map((classRow) => {
    if (!classRow.batteryEligible) {
      return {
        classSignature: classRow.classSignature,
        eligible: false,
        canonicalReInvariantPairFraction: 0,
        covarianceEqualPairFraction: 0,
        witnessReSetIdenticalAcrossOrbit: false,
      };
    }

    const classCycles = eligibleCycles.filter(
      (cycle) => cycle.classSignature === classRow.classSignature,
    );
    const classWitnesses = witnessCycles.filter(
      (cycle) => cycle.classSignature === classRow.classSignature,
    );
    let invariantPairs = 0;
    let covariantPairs = 0;
    let witnessSetsIdentical = true;

    for (const lift of canonicalLifts) {
      const transformedSlots = new Map<string, OctValue>();

      for (const [slotKey, value] of trueSlotValues) {
        transformedSlots.set(slotKey, applyAutomorphism(lift, value));
      }

      for (const cycle of classCycles) {
        const transformedCanonical = canonicalProduct(cycle, transformedSlots);
        const trueCanonical = trueCanonicalByCycle.get(cycle.cycleId) as OctValue;

        if (octRe(transformedCanonical) === octRe(trueCanonical)) {
          invariantPairs += 1;
        }

        if (octKey(transformedCanonical) === octKey(applyAutomorphism(lift, trueCanonical))) {
          covariantPairs += 1;
        }
      }

      for (const witness of classWitnesses) {
        if (
          reSetOfMask(valueMaskOf(witness, transformedSlots)) !==
          trueWitnessReSet.get(witness.cycleId)
        ) {
          witnessSetsIdentical = false;
        }
      }
    }

    const pairCount = canonicalLifts.length * classCycles.length;

    return {
      classSignature: classRow.classSignature,
      eligible: true,
      canonicalReInvariantPairFraction: pairCount > 0 ? invariantPairs / pairCount : 0,
      covarianceEqualPairFraction: pairCount > 0 ? covariantPairs / pairCount : 0,
      witnessReSetIdenticalAcrossOrbit: witnessSetsIdentical,
    };
  });

  // Site-local: the derivation-expression action; consistency on the hub law.
  const hubEdges = gate.derivationManifest.filter((edge) => edge.family === 'hub');
  const hubParents = new Map<string, [PrimalSite, PrimalSite]>(
    hubEdges.map((edge) => [edge.edgeId, [edge.from as PrimalSite, edge.to as PrimalSite]]),
  );

  const hubLinksUnder = (assignment: Record<PrimalSite, SignedUnitAutomorphism>): Map<string, OctValue> => {
    const transformedAtoms: AtomMap = {
      A: applyAutomorphism(assignment.A, atoms.A),
      B: applyAutomorphism(assignment.B, atoms.B),
      C: applyAutomorphism(assignment.C, atoms.C),
      D: applyAutomorphism(assignment.D, atoms.D),
    };
    const links = new Map<string, OctValue>();

    for (const [edgeId, [i, j]] of hubParents) {
      links.set(edgeId.replace('hub:', ''), octMul(transformedAtoms[i], transformedAtoms[j]));
    }

    return links;
  };

  const hubLawConsistent = (links: Map<string, OctValue>): boolean => {
    for (const i of PRIMAL_SITES) {
      for (const j of PRIMAL_SITES) {
        if (i === j) {
          continue;
        }

        if (octKey(octMul(links.get(`${i}->${j}`) as OctValue, links.get(`${j}->${i}`) as OctValue)) !== '+1') {
          return false;
        }

        for (const k of PRIMAL_SITES) {
          if (k === i || k === j) {
            continue;
          }

          if (
            octKey(octMul(links.get(`${i}->${j}`) as OctValue, links.get(`${j}->${k}`) as OctValue)) !==
            octKey(links.get(`${i}->${k}`) as OctValue)
          ) {
            return false;
          }
        }
      }
    }

    return true;
  };

  const probeFamilies: Array<{
    familyId: string;
    build: (phi: SignedUnitAutomorphism, psi: SignedUnitAutomorphism) => Record<PrimalSite, SignedUnitAutomorphism>;
  }> = [
    { familyId: 'split-A|BCD', build: (phi, psi) => ({ A: phi, B: psi, C: psi, D: psi }) },
    { familyId: 'split-AB|CD', build: (phi, psi) => ({ A: phi, B: phi, C: psi, D: psi }) },
  ];
  const consistentGauges: Array<{ familyId: string; assignment: Record<PrimalSite, SignedUnitAutomorphism>; nonGlobal: boolean }> = [];
  const familySummaries: GauntletSiteLocalResult['families'] = [];

  for (const family of probeFamilies) {
    let consistentCount = 0;
    let consistentNonGlobalCount = 0;

    for (let phiIndex = 0; phiIndex < canonicalLifts.length; phiIndex += 1) {
      for (let psiIndex = 0; psiIndex < canonicalLifts.length; psiIndex += 1) {
        const assignment = family.build(canonicalLifts[phiIndex], canonicalLifts[psiIndex]);

        if (!hubLawConsistent(hubLinksUnder(assignment))) {
          continue;
        }

        consistentCount += 1;
        const nonGlobal = phiIndex !== psiIndex;

        if (nonGlobal) {
          consistentNonGlobalCount += 1;
        }

        consistentGauges.push({ familyId: family.familyId, assignment, nonGlobal });
      }
    }

    const run3Count = run3.siteLocalProbes.find(
      (probe) => probe.familyId === family.familyId,
    )?.consistentCount;
    familySummaries.push({
      familyId: family.familyId,
      comboCount: canonicalLifts.length ** 2,
      consistentCount,
      consistentNonGlobalCount,
      run3ComparisonNote: `Run-3 source-site-form consistent count for this family: ${run3Count ?? 'n/a'}; this run's derivation-expression action measures ${consistentCount}.`,
    });

    if (run3Count !== undefined && run3Count !== consistentCount) {
      pushLedger(
        `site-local-consistency-count-difference:${family.familyId}`,
        `Under the derivation-expression action the consistent count is ${consistentCount}; Run-3's source-site form measured ${run3Count}. Different actions, both derived; recorded for the auditor.`,
      );
    }
  }

  const siteLocalPerClass: GauntletSiteLocalResult['perClass'] = classRows.map((classRow) => {
    if (!classRow.batteryEligible) {
      return {
        classSignature: classRow.classSignature,
        eligible: false,
        canonicalReInvariantFractionOverConsistent: 0,
        witnessReSetIdenticalFractionOverSample: 0,
        sampleSize: 0,
      };
    }

    const classCycles = eligibleCycles.filter(
      (cycle) => cycle.classSignature === classRow.classSignature,
    );
    const classWitnesses = witnessCycles.filter(
      (cycle) => cycle.classSignature === classRow.classSignature,
    );
    let invariantPairs = 0;
    let totalPairs = 0;

    for (const gauge of consistentGauges) {
      const transformedAtoms: AtomMap = {
        A: applyAutomorphism(gauge.assignment.A, atoms.A),
        B: applyAutomorphism(gauge.assignment.B, atoms.B),
        C: applyAutomorphism(gauge.assignment.C, atoms.C),
        D: applyAutomorphism(gauge.assignment.D, atoms.D),
      };

      for (const cycle of classCycles) {
        const elements = wordElementsOf(cycle);
        const zeroVector = elements.filter((element) => element.kind === 'choice').map(() => 0);
        const transformedCanonical = leftAssocProduct(
          wordFromAtoms(elements, transformedAtoms, zeroVector),
        );
        totalPairs += 1;

        if (octRe(transformedCanonical) === octRe(trueCanonicalByCycle.get(cycle.cycleId) as OctValue)) {
          invariantPairs += 1;
        }
      }
    }

    // Witness Re-set equality over a declared sample of consistent gauges.
    const samplePerFamily = SITE_LOCAL_SET_SAMPLE_PER_FAMILY;
    const sample: typeof consistentGauges = [];

    for (const family of probeFamilies) {
      sample.push(
        ...consistentGauges
          .filter((gauge) => gauge.familyId === family.familyId)
          .slice(0, samplePerFamily),
      );
    }

    let witnessSetEqual = 0;
    let witnessSetTotal = 0;

    for (const gauge of sample) {
      const transformedAtoms: AtomMap = {
        A: applyAutomorphism(gauge.assignment.A, atoms.A),
        B: applyAutomorphism(gauge.assignment.B, atoms.B),
        C: applyAutomorphism(gauge.assignment.C, atoms.C),
        D: applyAutomorphism(gauge.assignment.D, atoms.D),
      };

      for (const witness of classWitnesses) {
        const elements = wordElementsOf(witness);
        let mask = 0;

        for (const vector of choiceVectorsOf(elements)) {
          mask |= bracketingValueMask(wordFromAtoms(elements, transformedAtoms, vector));
        }

        witnessSetTotal += 1;

        if (reSetOfMask(mask) === trueWitnessReSet.get(witness.cycleId)) {
          witnessSetEqual += 1;
        }
      }
    }

    return {
      classSignature: classRow.classSignature,
      eligible: true,
      canonicalReInvariantFractionOverConsistent:
        totalPairs > 0 ? invariantPairs / totalPairs : 0,
      witnessReSetIdenticalFractionOverSample:
        witnessSetTotal > 0 ? witnessSetEqual / witnessSetTotal : 0,
      sampleSize: sample.length,
    };
  });

  const siteLocal: GauntletSiteLocalResult = {
    actionNote:
      'Site-local action DERIVED through the symbol derivation expressions: {phi_A..phi_D} transforms each primal atom by its own site automorphism and every symbol is re-evaluated through its row-derived expression. This is the unique TOTAL action (the Run-3 source-site form does not extend to child-sourced edges and is recorded as partial); the two coincide at global assignments (verified).',
    globalCoincidenceVerified,
    families: familySummaries,
    perClass: siteLocalPerClass,
  };

  for (const row of siteLocalPerClass) {
    if (
      row.eligible &&
      row.canonicalReInvariantFractionOverConsistent < 1 &&
      row.witnessReSetIdenticalFractionOverSample === 1
    ) {
      pushLedger(
        `site-local-canonical-vs-set-split:${row.classSignature}`,
        `Class ${row.classSignature}: site-local canonical-Re invariance ${(row.canonicalReInvariantFractionOverConsistent * 100).toFixed(2)}% while the witness Re-SET equality over the declared sample is 100% -- the canonical (left-assoc, childLeft) representative's Re moves under some structure-consistent site-local gauges where the bracketing value-SET does not. Raw split, reported on both observables.`,
      );
    } else if (row.eligible && row.canonicalReInvariantFractionOverConsistent < 1) {
      pushLedger(
        `site-local-invariance-below-unity:${row.classSignature}`,
        `Class ${row.classSignature}: site-local canonical-Re invariance ${(row.canonicalReInvariantFractionOverConsistent * 100).toFixed(2)}%; witness Re-SET equality ${(row.witnessReSetIdenticalFractionOverSample * 100).toFixed(2)}%.`,
      );
    }
  }

  // -------------------------------------------------------------------------
  // PART 3 -- CONTROLS (K=128, declared stream order)
  // -------------------------------------------------------------------------
  const streamConsumptionOrder = [
    '1. c0 strict null: 128 draws x 96 slot units (uniform +-e1..+-e7)',
    '2. c1 structure-preserving null: 128 draws x 4 site atoms (uniform +-e1..+-e7), all symbols rebuilt through their derivation expressions',
    '3. c2 permutation: 128 derangements of the 96 true slot values',
    '4. c3 sign-flip: 128 draws x 96 sign bits on the true slot values',
    '5. mock: one derangement of the 96 slots + 96 sign bits',
  ];
  const stream = mulberry32(GAUNTLET_SEED);
  const slotKeys = [...trueSlotValues.keys()].sort();
  const randomUnit = (next: () => number): OctValue => ({
    sign: next() < 0.5 ? 1 : -1,
    unit: 1 + Math.floor(next() * 7),
  });

  const controlDraws: Record<string, Array<Map<string, OctValue>>> = {
    'c0-strict-null': [],
    'c1-structure-preserving-null': [],
    'c2-permutation': [],
    'c3-sign-flip': [],
  };

  for (let draw = 0; draw < GAUNTLET_CONTROL_DRAWS; draw += 1) {
    const slots = new Map<string, OctValue>();
    slotKeys.forEach((slotKey) => slots.set(slotKey, randomUnit(stream)));
    controlDraws['c0-strict-null'].push(slots);
  }

  for (let draw = 0; draw < GAUNTLET_CONTROL_DRAWS; draw += 1) {
    const drawAtoms: AtomMap = {
      A: randomUnit(stream),
      B: randomUnit(stream),
      C: randomUnit(stream),
      D: randomUnit(stream),
    };
    const slots = new Map<string, OctValue>();

    for (const elements of wordElementsByEdgeId.values()) {
      for (const element of elements) {
        for (const derivation of element.derivations) {
          slots.set(slotKeyOf(derivation.slot), evaluateDerivation(derivation, drawAtoms));
        }
      }
    }

    controlDraws['c1-structure-preserving-null'].push(slots);
  }

  const trueSlotList = slotKeys.map((slotKey) => trueSlotValues.get(slotKey) as OctValue);

  for (let draw = 0; draw < GAUNTLET_CONTROL_DRAWS; draw += 1) {
    const derangement = drawDerangement(slotKeys.length, stream);
    const slots = new Map<string, OctValue>();
    slotKeys.forEach((slotKey, index) => slots.set(slotKey, trueSlotList[derangement[index]]));
    controlDraws['c2-permutation'].push(slots);
  }

  for (let draw = 0; draw < GAUNTLET_CONTROL_DRAWS; draw += 1) {
    const slots = new Map<string, OctValue>();
    slotKeys.forEach((slotKey, index) => {
      const base = trueSlotList[index];
      slots.set(
        slotKey,
        stream() < 0.5 ? base : { sign: (-1 * base.sign) as 1 | -1, unit: base.unit },
      );
    });
    controlDraws['c3-sign-flip'].push(slots);
  }

  const controls: GauntletControlRow[] = [];

  for (const classRow of classRows) {
    const classCycles = scopeCycles.filter(
      (cycle) => cycle.classSignature === classRow.classSignature,
    );
    const truePattern = classCycles.map((cycle) =>
      octRe(trueCanonicalByCycle.get(cycle.cycleId) as OctValue),
    );

    for (const controlId of [
      'c0-strict-null',
      'c1-structure-preserving-null',
      'c2-permutation',
      'c3-sign-flip',
    ] as const) {
      if (!classRow.batteryEligible) {
        controls.push({
          classSignature: classRow.classSignature,
          controlId,
          eligible: false,
          draws: 0,
          realityFractionMean: 0,
          realityFractionP95: 0,
          realityFractionMax: 0,
          patternMatchMean: 0,
          patternMatchP95: 0,
          patternMatchMax: 0,
          fullPatternFraction: 0,
          distinctPatternCount: 0,
          degenerateControl: false,
          adaptationNote: 'moot: class not battery-eligible (genuinely-bracketing-dependent outcome present)',
        });
        continue;
      }

      const realityFractions: number[] = [];
      const patternMatches: number[] = [];
      const patternKeys = new Set<string>();
      let fullMatches = 0;

      for (const slots of controlDraws[controlId]) {
        const reVector = classCycles.map((cycle) => octRe(canonicalProduct(cycle, slots)));
        realityFractions.push(
          reVector.filter((re) => Math.abs(re) === 1).length / reVector.length,
        );
        const matches = reVector.filter((re, index) => re === truePattern[index]).length;
        patternMatches.push(matches);
        patternKeys.add(reVector.join(','));

        if (matches === classCycles.length) {
          fullMatches += 1;
        }
      }

      const sortedReality = [...realityFractions].sort((a, b) => a - b);
      const sortedMatches = [...patternMatches].sort((a, b) => a - b);
      const p95 = (sorted: number[]): number =>
        sorted[Math.min(sorted.length - 1, Math.ceil(0.95 * sorted.length) - 1)];
      const mean = (values: number[]): number =>
        values.reduce((sum, value) => sum + value, 0) / values.length;

      controls.push({
        classSignature: classRow.classSignature,
        controlId,
        eligible: true,
        draws: GAUNTLET_CONTROL_DRAWS,
        realityFractionMean: mean(realityFractions),
        realityFractionP95: p95(sortedReality),
        realityFractionMax: sortedReality[sortedReality.length - 1],
        patternMatchMean: mean(patternMatches),
        patternMatchP95: p95(sortedMatches),
        patternMatchMax: sortedMatches[sortedMatches.length - 1],
        fullPatternFraction: fullMatches / GAUNTLET_CONTROL_DRAWS,
        distinctPatternCount: patternKeys.size,
        degenerateControl: patternKeys.size <= 1,
        adaptationNote:
          controlId === 'c1-structure-preserving-null'
            ? 'mixed-sector adaptation: random site atoms, symbols rebuilt through the derivation expressions (declared)'
            : null,
      });
    }
  }

  for (const control of controls) {
    if (control.eligible && control.degenerateControl) {
      pushLedger(
        `degenerate-control:${control.classSignature}:${control.controlId}`,
        `Control never varied across ${control.draws} draws (1 distinct Re-pattern); reported as degenerate, not as a pass.`,
      );
    }
  }

  // -------------------------------------------------------------------------
  // PART 4 -- MOCK (void-guard)
  // -------------------------------------------------------------------------
  const mockDerangement = drawDerangement(slotKeys.length, stream);
  const mockSlots = new Map<string, OctValue>();
  slotKeys.forEach((slotKey, index) => {
    const base = trueSlotList[mockDerangement[index]];
    const flip = stream() < 0.5;
    mockSlots.set(slotKey, {
      sign: (flip ? -1 * base.sign : base.sign) as 1 | -1,
      unit: base.unit,
    });
  });

  const mockRows: GauntletMockClassRow[] = classRows.map((classRow) => {
    const classCycles = scopeCycles.filter(
      (cycle) => cycle.classSignature === classRow.classSignature,
    );
    const truePatternKey = classCycles
      .map((cycle) => octRe(trueCanonicalByCycle.get(cycle.cycleId) as OctValue))
      .join(',');
    const mockPatternKey = classCycles
      .map((cycle) => octRe(canonicalProduct(cycle, mockSlots)))
      .join(',');
    const summarize = (slots: Map<string, OctValue>): string => {
      const counts = new Map<string, number>();

      for (const cycle of classCycles) {
        const mask = valueMaskOf(cycle, slots);
        const indices: number[] = [];

        for (let index = 0; index < 16; index += 1) {
          if ((mask & (1 << index)) !== 0) {
            indices.push(index);
          }
        }

        const klass = classifyValueIndices(indices);
        counts.set(klass, (counts.get(klass) ?? 0) + 1);
      }

      return [...counts.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([klass, count]) => `${klass} x${count}`)
        .join(' | ');
    };
    const trueClassificationSummary = summarize(trueSlotValues);
    const mockClassificationSummary = summarize(mockSlots);

    return {
      classSignature: classRow.classSignature,
      truePatternKey,
      mockPatternKey,
      patternChanged: truePatternKey !== mockPatternKey,
      trueClassificationSummary,
      mockClassificationSummary,
      classificationChanged: trueClassificationSummary !== mockClassificationSummary,
    };
  });

  const changedClassCount = mockRows.filter(
    (row) => row.patternChanged || row.classificationChanged,
  ).length;
  const voidGuardPassed = changedClassCount > 0;

  if (!voidGuardPassed) {
    pushIssue(
      'mock-void-guard-failed',
      'The scrambled links changed neither any class Re-pattern nor any classification; the computation is reading constants. RUN VOID.',
    );
  }

  // -------------------------------------------------------------------------
  // Integrity (well-formedness only)
  // -------------------------------------------------------------------------
  if (scopeCycles.length !== cyclesConsistent) {
    pushIssue(
      'consistency-condition-not-universal',
      `${cyclesConsistent}/${scopeCycles.length} cycles satisfied the binding consistency condition.`,
    );
  }

  if (expressionsVerified !== expressionsReproducedStored) {
    pushIssue(
      'expression-reproduction-incomplete',
      `${expressionsReproducedStored}/${expressionsVerified} expressions reproduce their stored links.`,
    );
  }

  for (const row of ledger) {
    if (row.derivationStatus !== '') {
      pushIssue('ledger-derivation-status-not-empty', row.ledgerId);
    }
  }

  return {
    reportId: `${GAUNTLET_METHOD}:ten-leaving-q-classes`,
    method: GAUNTLET_METHOD,
    declaredGate: GAUNTLET_GATE_DECLARATION,
    governingQuaternionicCaveat: GOVERNING_QUATERNIONIC_CAVEAT,
    yellowFlag: SECTION_6_YELLOW_FLAG,
    holonomyDefinition: HOLONOMY_DEFINITION,
    diagnosticScope: 'computes-and-reports-only-pure-math-finite-diagnostic',
    verdictStatus:
      'no-validity-verdict-auditor-classifies-against-hash-committed-sealed-rule',
    consumedSubstrates: [
      'mixedLoopLeavesQGateV0 (AUDITED gate: 54-edge derivation manifest + inventory + closures; READ-ONLY; no link re-derived)',
      'moufangHolonomyValidityV0 (octMul/octKey/octRe, the consumed product law; the exact DP re-implemented locally over it)',
      'moufangAutomorphismGaugeV0 (census cross-check + applyAutomorphism; lift list re-derived locally and asserted)',
      'fanoOctonionicCarrierTableV0 + fanoOctonionicLocalChannelTableV0 (symbol derivation expressions; READ-ONLY)',
    ],
    seed: GAUNTLET_SEED,
    streamConsumptionOrder,
    scope: {
      classCount: scopeClasses.length,
      cycleCount: scopeCycles.length,
      excludedClassSignatures: EXCLUDED,
      inventoryVerified,
    },
    consistencyCondition: {
      cyclesChecked: scopeCycles.length,
      cyclesConsistent,
      expressionsVerified,
      expressionsReproducedStored,
    },
    censusCrossCheck,
    classRows,
    globalGauge: {
      automorphismCount: canonicalLifts.length,
      measurementScopeNote:
        'canonical-Re invariance and holonomy covariance on ALL cycles x 168; full Re-SET equality on one witness cycle per class outcome (declared scope)',
      rows: globalRows,
    },
    siteLocal,
    controls,
    mock: {
      scrambleDescription:
        'seeded derangement of the 96 consumed link-unit slots + independent sign flips (consistency check suspended for the mock, declared); the computation must read the consumed links, not constants',
      slotCount: slotKeys.length,
      rows: mockRows,
      changedClassCount,
      voidGuardPassed,
    },
    escalations,
    anomalyLedger: ledger,
    integrityIssueCount: integrityIssues.length,
    integrityIssues,
    ok: integrityIssues.length === 0,
  };
}
