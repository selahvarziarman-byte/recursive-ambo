import {
  buildMoufangHolonomyValidityV0Report,
  octKey,
  octMul,
  octRe,
  type MoufangLoopRecord,
  type OctValue,
} from './moufangHolonomyValidityV0';

/**
 * CBF Gate 0, Run 3 -- gauge-invariance under the ruled automorphism gauge
 * (the one bounded repair).
 *
 * Sovereign ruling (2026-06-12): the legitimate local gauge for the inherited
 * Fano/source-state carrier object is the STRUCTURE-PRESERVING AUTOMORPHISM
 * gauge (Fano relabeling / G2-type); arbitrary signed-unit conjugation is NOT
 * in the gauge group. This run replaces Run 2's arbitrary-unit conjugation
 * with the automorphism gauge and re-tests the gauge axis ONLY. Run 2's
 * bracketing and control findings stand and are not recomputed here.
 *
 * Computes and reports raw values; assigns NO Gate-0 verdict and no gauge
 * labels -- the auditor classifies against the hash-committed sealed rule.
 * Consumes Run 2 READ-ONLY (algebra core, loop inventory, stored carriers);
 * D1/D3 are not reopened -- defects raise alarms and escalate.
 */

export const AUTOMORPHISM_GAUGE_METHOD = 'moufang-automorphism-gauge-v0' as const;

export const AUTOMORPHISM_GATE_DECLARATION = {
  declaredPath: 'C:\\Dev\\202cl\\PlatonicEngine202',
  declaredBranch: 'Claude-child',
  declaredHeadAtAuthoring: 'ff1dd89',
  sealNote:
    'Run-3 sealed predictions (automorphism-gauge repair under sovereign ruling) hash-committed at ff1dd89; expected values and thresholds withheld from the implementer',
  rulingNote:
    'sovereign ruling 2026-06-12: the legitimate local gauge is the structure-preserving automorphism gauge (Fano relabeling / G2-type); arbitrary signed-unit conjugation is NOT in the gauge group',
} as const;

export const AUTOMORPHISM_SEED = 20260613 as const;
export const AUTOMORPHISM_SITE_LOCAL_DRAWS = 128 as const;

const PRIMAL_SITES = ['A', 'B', 'C', 'D'] as const;
type PrimalSite = (typeof PRIMAL_SITES)[number];

export interface SignedUnitAutomorphism {
  autId: string;
  /** perm[i] = sigma(i) for units 1..7; index 0 unused. */
  perm: number[];
  /** signs[i] in {1,-1} for units 1..7; index 0 unused. */
  signs: number[];
  signMask: number;
}

export interface AutomorphismGroupCensus {
  candidateCount: number;
  monomialAutomorphismCount: number;
  distinctCollineationCount: number;
  liftsPerCollineationMin: number;
  liftsPerCollineationMax: number;
  canonicalLiftCount: number;
  canonicalLiftSelectionRule: 'smallest-sign-bitmask-per-collineation';
  productLawChecksPerLift: number;
  productLawCheckTotal: number;
  allCanonicalLiftsMultiplicative: boolean;
  linePreservingCollineationCount: number;
  derivedFanoLines: number[][];
}

export interface Run2OrbitCorrespondence {
  run2LabelingCount: number;
  matchedLabelingCount: number;
  distinctCollineationsCovered: number;
  bijectionHolds: boolean;
  note: string;
}

export interface GlobalGaugeLoopRow {
  loopId: string;
  distinctReValuesAcrossGroup: number[];
  reIdenticalAcrossGroup: boolean;
}

export interface GlobalGaugeSampleRow {
  autId: string;
  loopId: string;
  holonomy: string;
  transformedHolonomy: string;
  phiOfHolonomy: string;
  reBefore: number;
  reAfter: number;
}

export interface GlobalGaugeResult {
  automorphismCount: number;
  loopCount: number;
  pairCount: number;
  fullPatternMatchCount: number;
  fullPatternMatchFraction: number;
  covarianceEqualCount: number;
  reFixedCount: number;
  perLoopRows: GlobalGaugeLoopRow[];
  samples: GlobalGaugeSampleRow[];
}

export interface SiteLocalRelationSet {
  pairRelationCandidateCount: number;
  pairRelationsHeld: number;
  tripleRelationCandidateCount: number;
  tripleRelationsHeld: number;
  excludedRelations: string[];
}

export interface SiteLocalDrawsResult {
  draws: number;
  globalDrawCount: number;
  consistentCount: number;
  consistentNonGlobalCount: number;
  reFullMatchCount: number;
  reFullMatchAmongConsistentCount: number;
  patternMatchMean: number;
  patternMatchP95: number;
  patternMatchMax: number;
  perLoopReInvariantFraction: Array<{ loopId: string; fraction: number }>;
}

export interface SiteLocalProbeResult {
  familyId: 'split-A|BCD' | 'split-AB|CD';
  comboCount: number;
  consistentCount: number;
  consistentNonGlobalCount: number;
  consistentNonGlobalReFullMatchCount: number;
  exampleConsistentNonGlobal: string[];
}

export interface SiteLocalJointResult {
  structureConsistentNonGlobalFound: boolean;
  totalConsistentNonGlobalAcrossDrawsAndProbes: number;
  consistentNonGlobalPreservingReCount: number;
  consistentNonGlobalBreakingReCount: number;
}

export interface AutomorphismMockSolutionReport {
  scrambleDescription: string;
  scrambledAssignment: Array<{ edge: string; trueValueKey: string; scrambledValueKey: string }>;
  trueReVector: number[];
  scrambledReVector: number[];
  loopsEqualCount: number;
  loopCount: number;
  patternBroke: boolean;
}

export interface AutomorphismAlarm {
  alarmId: string;
  context: string;
  detail: string;
  escalationNote: 'D1/D3 carrier results are load-bearing; defect escalates to mothership, not silently fixed';
}

export interface AutomorphismLedgerRow {
  ledgerId: string;
  context: string;
  measurement: string;
  derivationStatus: '';
}

export interface AutomorphismIntegrityIssue {
  code: string;
  message: string;
}

export interface MoufangAutomorphismGaugeV0Report {
  reportId: string;
  method: typeof AUTOMORPHISM_GAUGE_METHOD;
  declaredGate: typeof AUTOMORPHISM_GATE_DECLARATION;
  diagnosticScope: 'computes-and-reports-only-pure-math-finite-diagnostic';
  verdictStatus: 'no-gate0-verdict-auditor-classifies-against-hash-committed-sealed-rule';
  run2Standing: string;
  consumedSubstrates: string[];
  seed: number;
  streamConsumptionOrder: string[];
  trueLinkAssignment: Array<{ edge: string; valueKey: string }>;
  trueReVector: number[];
  automorphismGroup: AutomorphismGroupCensus;
  run2OrbitCorrespondence: Run2OrbitCorrespondence;
  globalGauge: GlobalGaugeResult;
  siteLocalRelationSet: SiteLocalRelationSet;
  siteLocalDraws: SiteLocalDrawsResult;
  siteLocalProbes: SiteLocalProbeResult[];
  siteLocalJointResult: SiteLocalJointResult;
  mockSolution: AutomorphismMockSolutionReport;
  antiStapleAlarms: AutomorphismAlarm[];
  anomalyLedger: AutomorphismLedgerRow[];
  integrityIssueCount: number;
  integrityIssues: AutomorphismIntegrityIssue[];
  ok: boolean;
}

// ---------------------------------------------------------------------------
// Deterministic stream (Run-3 declared seed)
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
// Automorphism application
// ---------------------------------------------------------------------------

export function applyAutomorphism(
  automorphism: SignedUnitAutomorphism,
  value: OctValue,
): OctValue {
  if (value.unit === 0) {
    return { sign: value.sign, unit: 0 };
  }

  return {
    sign: (value.sign * automorphism.signs[value.unit]) as 1 | -1,
    unit: automorphism.perm[value.unit],
  };
}

function leftAssocProduct(word: OctValue[]): OctValue {
  let accumulator = word[0];

  for (let index = 1; index < word.length; index += 1) {
    accumulator = octMul(accumulator, word[index]);
  }

  return accumulator;
}

function parseSignedUnit(label: string): OctValue {
  const sign = label.startsWith('-') ? -1 : 1;
  const unitLabel = label.replace(/^[+-]/, '');
  const unit = unitLabel === '1' ? 0 : Number(unitLabel.slice(1));

  return { sign: sign as 1 | -1, unit };
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export function buildMoufangAutomorphismGaugeV0Report(): MoufangAutomorphismGaugeV0Report {
  const integrityIssues: AutomorphismIntegrityIssue[] = [];
  const ledger: AutomorphismLedgerRow[] = [];
  const alarms: AutomorphismAlarm[] = [];
  let ledgerCounter = 0;
  let alarmCounter = 0;

  const pushIssue = (code: string, message: string): void => {
    integrityIssues.push({ code, message });
  };
  const pushLedger = (context: string, measurement: string): void => {
    ledgerCounter += 1;
    ledger.push({
      ledgerId: `gate0-run3-ledger-${String(ledgerCounter).padStart(2, '0')}`,
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
  // Run-2 substrate (READ-ONLY)
  // -------------------------------------------------------------------------
  const run2 = buildMoufangHolonomyValidityV0Report();

  if (!run2.ok) {
    pushAlarm('run2-substrate-not-ok', `Run-2 report integrity ${run2.integrityIssueCount}`);
  }

  const loops: MoufangLoopRecord[] = run2.loopInventory.loops;
  const trueLinkByEdge = new Map<string, OctValue>(
    run2.storedLinkAssignment.map((entry) => [entry.edge, parseSignedUnit(entry.valueKey)]),
  );
  const atomBySite = new Map<PrimalSite, OctValue>(
    run2.primalAtomAssignment.map((entry) => [
      entry.site as PrimalSite,
      parseSignedUnit(entry.atom),
    ]),
  );

  if (loops.length !== 22) {
    pushIssue('loop-count-mismatch', `Expected 22 loops from Run 2, got ${loops.length}.`);
  }

  if (trueLinkByEdge.size !== 12) {
    pushIssue('link-count-mismatch', `Expected 12 links from Run 2, got ${trueLinkByEdge.size}.`);
  }

  if (atomBySite.size !== 4) {
    pushIssue('atom-count-mismatch', `Expected 4 atoms from Run 2, got ${atomBySite.size}.`);
  }

  const edgeKeys = [...trueLinkByEdge.keys()].sort();
  const computeReVector = (linkMap: Map<string, OctValue>): number[] =>
    loops.map((loop) =>
      octRe(
        leftAssocProduct(
          loop.linkSequence.map(
            (link) => linkMap.get(`${link.from}->${link.to}`) as OctValue,
          ),
        ),
      ),
    );
  const trueReVector = computeReVector(trueLinkByEdge);

  // -------------------------------------------------------------------------
  // Automorphism group census (exhaustive monomial search from the consumed law)
  // -------------------------------------------------------------------------
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

  const allPermutations = enumeratePermutations([1, 2, 3, 4, 5, 6, 7]);
  let candidateCount = 0;
  const monomialByPermKey = new Map<string, number[]>(); // permKey -> sign masks

  for (const perm of allPermutations) {
    const permTable = [0, ...perm];

    for (let signMask = 0; signMask < 128; signMask += 1) {
      candidateCount += 1;
      const signs = [0, 0, 0, 0, 0, 0, 0, 0];

      for (let unit = 1; unit <= 7; unit += 1) {
        signs[unit] = (signMask & (1 << (unit - 1))) === 0 ? 1 : -1;
      }

      const automorphism: SignedUnitAutomorphism = {
        autId: '',
        perm: permTable,
        signs,
        signMask,
      };

      if (isMultiplicative(automorphism)) {
        const permKey = perm.join(',');
        const masks = monomialByPermKey.get(permKey) ?? [];
        masks.push(signMask);
        monomialByPermKey.set(permKey, masks);
      }
    }
  }

  const monomialAutomorphismCount = [...monomialByPermKey.values()].reduce(
    (sum, masks) => sum + masks.length,
    0,
  );
  const liftCounts = [...monomialByPermKey.values()].map((masks) => masks.length);
  const canonicalLifts: SignedUnitAutomorphism[] = [...monomialByPermKey.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([permKey, masks]) => {
      const perm = permKey.split(',').map(Number);
      const signMask = Math.min(...masks);
      const signs = [0, 0, 0, 0, 0, 0, 0, 0];

      for (let unit = 1; unit <= 7; unit += 1) {
        signs[unit] = (signMask & (1 << (unit - 1))) === 0 ? 1 : -1;
      }

      return {
        autId: `aut:${permKey}:s${signMask}`,
        perm: [0, ...perm],
        signs,
        signMask,
      };
    });

  // Re-verify each canonical lift multiplicative over all 49 ordered pairs.
  let productLawCheckTotal = 0;
  let allCanonicalLiftsMultiplicative = true;

  for (const lift of canonicalLifts) {
    for (let i = 1; i <= 7; i += 1) {
      for (let j = 1; j <= 7; j += 1) {
        productLawCheckTotal += 1;
        const lhs = applyAutomorphism(lift, octMul({ sign: 1, unit: i }, { sign: 1, unit: j }));
        const rhs = octMul(
          applyAutomorphism(lift, { sign: 1, unit: i }),
          applyAutomorphism(lift, { sign: 1, unit: j }),
        );

        if (octKey(lhs) !== octKey(rhs)) {
          allCanonicalLiftsMultiplicative = false;
        }
      }
    }
  }

  if (!allCanonicalLiftsMultiplicative) {
    pushIssue(
      'canonical-lift-not-multiplicative',
      'A canonical lift failed the 49-pair product-law re-verification.',
    );
  }

  // Line preservation per collineation.
  const lineKeySet = new Set(derivedFanoLines.map((line) => line.join(',')));
  let linePreservingCollineationCount = 0;

  for (const lift of canonicalLifts) {
    const preservesLines = derivedFanoLines.every((line) =>
      lineKeySet.has(
        line
          .map((point) => lift.perm[point])
          .sort((a, b) => a - b)
          .join(','),
      ),
    );

    if (preservesLines) {
      linePreservingCollineationCount += 1;
    }
  }

  if (linePreservingCollineationCount !== canonicalLifts.length) {
    pushIssue(
      'collineation-line-preservation-mismatch',
      `${linePreservingCollineationCount}/${canonicalLifts.length} canonical lifts preserve the derived line set.`,
    );
  }

  const automorphismGroup: AutomorphismGroupCensus = {
    candidateCount,
    monomialAutomorphismCount,
    distinctCollineationCount: monomialByPermKey.size,
    liftsPerCollineationMin: liftCounts.length ? Math.min(...liftCounts) : 0,
    liftsPerCollineationMax: liftCounts.length ? Math.max(...liftCounts) : 0,
    canonicalLiftCount: canonicalLifts.length,
    canonicalLiftSelectionRule: 'smallest-sign-bitmask-per-collineation',
    productLawChecksPerLift: 49,
    productLawCheckTotal,
    allCanonicalLiftsMultiplicative,
    linePreservingCollineationCount,
    derivedFanoLines,
  };

  if (monomialByPermKey.size !== 168) {
    pushIssue(
      'collineation-count-mismatch',
      `Expected 168 distinct collineations, measured ${monomialByPermKey.size}.`,
    );
  }

  if (liftCounts.some((count) => count !== liftCounts[0])) {
    pushLedger(
      'lift-count-non-uniform',
      `Sign-lift counts per collineation are not uniform: min ${Math.min(...liftCounts)}, max ${Math.max(...liftCounts)}.`,
    );
  }

  // -------------------------------------------------------------------------
  // Run-2 orbit correspondence: quadrangle labelings <-> collineations
  // -------------------------------------------------------------------------
  const canonicalAtomTuple = PRIMAL_SITES.map(
    (site) => (atomBySite.get(site) as OctValue).unit,
  ); // expected (1,2,4,7)
  const quadrangles: number[][] = [];

  for (let a = 1; a <= 7; a += 1) {
    for (let b = a + 1; b <= 7; b += 1) {
      for (let c = b + 1; c <= 7; c += 1) {
        for (let d = c + 1; d <= 7; d += 1) {
          const triples = [
            [a, b, c],
            [a, b, d],
            [a, c, d],
            [b, c, d],
          ];

          if (!triples.some((triple) => lineKeySet.has(triple.join(',')))) {
            quadrangles.push([a, b, c, d]);
          }
        }
      }
    }
  }

  const orderings = enumeratePermutations([0, 1, 2, 3]);
  const labelings: number[][] = [];

  for (const quadrangle of quadrangles) {
    for (const ordering of orderings) {
      labelings.push(ordering.map((position) => quadrangle[position]));
    }
  }

  const collineationByImageKey = new Map<string, SignedUnitAutomorphism>();

  for (const lift of canonicalLifts) {
    const imageKey = canonicalAtomTuple.map((unit) => lift.perm[unit]).join(',');

    if (collineationByImageKey.has(imageKey)) {
      pushIssue(
        'orbit-correspondence-collision',
        `Two collineations share the quadrangle image ${imageKey}.`,
      );
    }

    collineationByImageKey.set(imageKey, lift);
  }

  let matchedLabelingCount = 0;
  const coveredCollineations = new Set<string>();

  for (const labeling of labelings) {
    const lift = collineationByImageKey.get(labeling.join(','));

    if (lift) {
      matchedLabelingCount += 1;
      coveredCollineations.add(lift.autId);
    }
  }

  const run2OrbitCorrespondence: Run2OrbitCorrespondence = {
    run2LabelingCount: labelings.length,
    matchedLabelingCount,
    distinctCollineationsCovered: coveredCollineations.size,
    bijectionHolds:
      labelings.length === canonicalLifts.length &&
      matchedLabelingCount === labelings.length &&
      coveredCollineations.size === canonicalLifts.length,
    note: 'Each Run-2 quadrangle labeling corresponds to the unique collineation mapping the canonical ordered quadrangle (e1,e2,e4,e7) to that labeling; reuse of the Run-2 orbit as the automorphism set verified by this bijection.',
  };

  if (!run2OrbitCorrespondence.bijectionHolds) {
    pushIssue(
      'run2-orbit-correspondence-failed',
      `labelings ${labelings.length}, matched ${matchedLabelingCount}, covered ${coveredCollineations.size}, collineations ${canonicalLifts.length}.`,
    );
  }

  // -------------------------------------------------------------------------
  // Test 1: GLOBAL automorphism gauge
  // -------------------------------------------------------------------------
  const trueHolonomyByLoop = loops.map((loop) =>
    leftAssocProduct(
      loop.linkSequence.map((link) => trueLinkByEdge.get(`${link.from}->${link.to}`) as OctValue),
    ),
  );
  let fullPatternMatchCount = 0;
  let covarianceEqualCount = 0;
  let reFixedCount = 0;
  const perLoopReSets: Array<Set<number>> = loops.map(() => new Set<number>());
  const samples: GlobalGaugeSampleRow[] = [];

  for (const lift of canonicalLifts) {
    const transformed = new Map<string, OctValue>();

    for (const [edgeKey, value] of trueLinkByEdge) {
      transformed.set(edgeKey, applyAutomorphism(lift, value));
    }

    const reVector = computeReVector(transformed);

    if (reVector.join(',') === trueReVector.join(',')) {
      fullPatternMatchCount += 1;
    }

    loops.forEach((loop, loopIndex) => {
      const transformedHolonomy = leftAssocProduct(
        loop.linkSequence.map(
          (link) => transformed.get(`${link.from}->${link.to}`) as OctValue,
        ),
      );
      const phiOfHolonomy = applyAutomorphism(lift, trueHolonomyByLoop[loopIndex]);
      perLoopReSets[loopIndex].add(octRe(transformedHolonomy));

      if (octKey(transformedHolonomy) === octKey(phiOfHolonomy)) {
        covarianceEqualCount += 1;
      }

      if (octRe(transformedHolonomy) === octRe(trueHolonomyByLoop[loopIndex])) {
        reFixedCount += 1;
      }

      if (samples.length < 6 && loopIndex < 2 && canonicalLifts.indexOf(lift) < 3) {
        samples.push({
          autId: lift.autId,
          loopId: loop.loopId,
          holonomy: octKey(trueHolonomyByLoop[loopIndex]),
          transformedHolonomy: octKey(transformedHolonomy),
          phiOfHolonomy: octKey(phiOfHolonomy),
          reBefore: octRe(trueHolonomyByLoop[loopIndex]),
          reAfter: octRe(transformedHolonomy),
        });
      }
    });
  }

  const pairCount = canonicalLifts.length * loops.length;
  const globalGauge: GlobalGaugeResult = {
    automorphismCount: canonicalLifts.length,
    loopCount: loops.length,
    pairCount,
    fullPatternMatchCount,
    fullPatternMatchFraction: fullPatternMatchCount / canonicalLifts.length,
    covarianceEqualCount,
    reFixedCount,
    perLoopRows: loops.map((loop, loopIndex) => ({
      loopId: loop.loopId,
      distinctReValuesAcrossGroup: [...perLoopReSets[loopIndex]].sort(),
      reIdenticalAcrossGroup: perLoopReSets[loopIndex].size === 1,
    })),
    samples,
  };

  if (globalGauge.fullPatternMatchFraction < 1 || reFixedCount < pairCount) {
    pushLedger(
      'global-gauge-re-variation',
      `Global automorphism gauge: full-pattern match ${fullPatternMatchCount}/${canonicalLifts.length}; Re fixed on ${reFixedCount}/${pairCount} (automorphism, loop) pairs.`,
    );
  }

  // -------------------------------------------------------------------------
  // Test 2: SITE-LOCAL automorphism gauge
  // -------------------------------------------------------------------------
  // Derive the carrier composition relation set from the ORIGINAL links.
  const excludedRelations: string[] = [];
  const heldPairRelations: Array<[PrimalSite, PrimalSite]> = [];
  const heldTripleRelations: Array<[PrimalSite, PrimalSite, PrimalSite]> = [];
  let pairCandidates = 0;
  let tripleCandidates = 0;

  for (const i of PRIMAL_SITES) {
    for (const j of PRIMAL_SITES) {
      if (i === j) {
        continue;
      }

      pairCandidates += 1;
      const product = octMul(
        trueLinkByEdge.get(`${i}->${j}`) as OctValue,
        trueLinkByEdge.get(`${j}->${i}`) as OctValue,
      );

      if (octKey(product) === '+1') {
        heldPairRelations.push([i, j]);
      } else {
        excludedRelations.push(`U(${i}->${j})*U(${j}->${i}) != +1 on the ORIGINAL links`);
      }
    }
  }

  for (const i of PRIMAL_SITES) {
    for (const j of PRIMAL_SITES) {
      for (const k of PRIMAL_SITES) {
        if (i === j || j === k || i === k) {
          continue;
        }

        tripleCandidates += 1;
        const product = octMul(
          trueLinkByEdge.get(`${i}->${j}`) as OctValue,
          trueLinkByEdge.get(`${j}->${k}`) as OctValue,
        );

        if (octKey(product) === octKey(trueLinkByEdge.get(`${i}->${k}`) as OctValue)) {
          heldTripleRelations.push([i, j, k]);
        } else {
          excludedRelations.push(
            `U(${i}->${j})*U(${j}->${k}) != U(${i}->${k}) on the ORIGINAL links`,
          );
        }
      }
    }
  }

  for (const excluded of excludedRelations) {
    pushLedger('original-relation-not-held', excluded);
  }

  const siteLocalRelationSet: SiteLocalRelationSet = {
    pairRelationCandidateCount: pairCandidates,
    pairRelationsHeld: heldPairRelations.length,
    tripleRelationCandidateCount: tripleCandidates,
    tripleRelationsHeld: heldTripleRelations.length,
    excludedRelations,
  };

  const transformLinks = (
    assignment: Record<PrimalSite, SignedUnitAutomorphism>,
  ): Map<string, OctValue> => {
    const transformed = new Map<string, OctValue>();

    for (const [edgeKey, value] of trueLinkByEdge) {
      const fromSite = edgeKey.split('->')[0] as PrimalSite;
      transformed.set(edgeKey, applyAutomorphism(assignment[fromSite], value));
    }

    return transformed;
  };

  const isConsistent = (linkMap: Map<string, OctValue>): boolean => {
    for (const [i, j] of heldPairRelations) {
      const product = octMul(
        linkMap.get(`${i}->${j}`) as OctValue,
        linkMap.get(`${j}->${i}`) as OctValue,
      );

      if (octKey(product) !== '+1') {
        return false;
      }
    }

    for (const [i, j, k] of heldTripleRelations) {
      const product = octMul(
        linkMap.get(`${i}->${j}`) as OctValue,
        linkMap.get(`${j}->${k}`) as OctValue,
      );

      if (octKey(product) !== octKey(linkMap.get(`${i}->${k}`) as OctValue)) {
        return false;
      }
    }

    return true;
  };

  // Declared stream order: (1) site-local draws, (2) mock scramble.
  const streamConsumptionOrder = [
    '1. site-local draws: 128 draws x 4 canonical-lift indices (one automorphism per primal site, uniform over the 168 canonical lifts)',
    '2. mock-solution scramble: one derangement of the 12 stored carriers + 12 sign bits',
  ];
  const stream = mulberry32(AUTOMORPHISM_SEED);

  let globalDrawCount = 0;
  let drawConsistentCount = 0;
  let drawConsistentNonGlobalCount = 0;
  let drawConsistentNonGlobalReFullCount = 0;
  let drawReFullMatchCount = 0;
  let drawReFullMatchAmongConsistentCount = 0;
  const drawMatchCounts: number[] = [];
  const perLoopInvariantCounts = new Array<number>(loops.length).fill(0);
  const drawConsistentNonGlobalExamples: string[] = [];

  for (let draw = 0; draw < AUTOMORPHISM_SITE_LOCAL_DRAWS; draw += 1) {
    const indices = PRIMAL_SITES.map(() => drawInt(stream, canonicalLifts.length));
    const assignment = {
      A: canonicalLifts[indices[0]],
      B: canonicalLifts[indices[1]],
      C: canonicalLifts[indices[2]],
      D: canonicalLifts[indices[3]],
    } as Record<PrimalSite, SignedUnitAutomorphism>;
    const isGlobal = indices.every((index) => index === indices[0]);

    if (isGlobal) {
      globalDrawCount += 1;
    }

    const transformed = transformLinks(assignment);
    const consistent = isConsistent(transformed);
    const reVector = computeReVector(transformed);
    let matches = 0;

    reVector.forEach((re, loopIndex) => {
      if (re === trueReVector[loopIndex]) {
        matches += 1;
        perLoopInvariantCounts[loopIndex] += 1;
      }
    });
    drawMatchCounts.push(matches);
    const fullMatch = matches === loops.length;

    if (consistent) {
      drawConsistentCount += 1;

      if (!isGlobal) {
        drawConsistentNonGlobalCount += 1;

        if (fullMatch) {
          drawConsistentNonGlobalReFullCount += 1;
        }

        if (drawConsistentNonGlobalExamples.length < 6) {
          drawConsistentNonGlobalExamples.push(
            `draw ${draw}: [${indices.join(', ')}] fullReMatch=${fullMatch}`,
          );
        }
      }

      if (fullMatch) {
        drawReFullMatchAmongConsistentCount += 1;
      }
    }

    if (fullMatch) {
      drawReFullMatchCount += 1;
    }
  }

  const sortedMatches = [...drawMatchCounts].sort((left, right) => left - right);
  const p95Index = Math.min(
    sortedMatches.length - 1,
    Math.ceil(0.95 * sortedMatches.length) - 1,
  );
  const siteLocalDraws: SiteLocalDrawsResult = {
    draws: AUTOMORPHISM_SITE_LOCAL_DRAWS,
    globalDrawCount,
    consistentCount: drawConsistentCount,
    consistentNonGlobalCount: drawConsistentNonGlobalCount,
    reFullMatchCount: drawReFullMatchCount,
    reFullMatchAmongConsistentCount: drawReFullMatchAmongConsistentCount,
    patternMatchMean:
      drawMatchCounts.reduce((sum, value) => sum + value, 0) / drawMatchCounts.length,
    patternMatchP95: sortedMatches[p95Index],
    patternMatchMax: sortedMatches[sortedMatches.length - 1],
    perLoopReInvariantFraction: loops.map((loop, loopIndex) => ({
      loopId: loop.loopId,
      fraction: perLoopInvariantCounts[loopIndex] / AUTOMORPHISM_SITE_LOCAL_DRAWS,
    })),
  };

  // Bounded deterministic probes over two structured families.
  const probeFamilies: Array<{
    familyId: SiteLocalProbeResult['familyId'];
    buildAssignment: (
      phi: SignedUnitAutomorphism,
      psi: SignedUnitAutomorphism,
    ) => Record<PrimalSite, SignedUnitAutomorphism>;
  }> = [
    {
      familyId: 'split-A|BCD',
      buildAssignment: (phi, psi) => ({ A: phi, B: psi, C: psi, D: psi }),
    },
    {
      familyId: 'split-AB|CD',
      buildAssignment: (phi, psi) => ({ A: phi, B: phi, C: psi, D: psi }),
    },
  ];
  const siteLocalProbes: SiteLocalProbeResult[] = [];

  for (const family of probeFamilies) {
    let comboCount = 0;
    let consistentCount = 0;
    let consistentNonGlobalCount = 0;
    let consistentNonGlobalReFullMatchCount = 0;
    const examples: string[] = [];

    for (let phiIndex = 0; phiIndex < canonicalLifts.length; phiIndex += 1) {
      for (let psiIndex = 0; psiIndex < canonicalLifts.length; psiIndex += 1) {
        comboCount += 1;
        const assignment = family.buildAssignment(
          canonicalLifts[phiIndex],
          canonicalLifts[psiIndex],
        );
        const transformed = transformLinks(assignment);

        if (!isConsistent(transformed)) {
          continue;
        }

        consistentCount += 1;
        const nonGlobal = phiIndex !== psiIndex;

        if (nonGlobal) {
          consistentNonGlobalCount += 1;
          const reVector = computeReVector(transformed);
          const fullMatch = reVector.join(',') === trueReVector.join(',');

          if (fullMatch) {
            consistentNonGlobalReFullMatchCount += 1;
          }

          if (examples.length < 6) {
            examples.push(
              `${family.familyId}: phi=${canonicalLifts[phiIndex].autId} psi=${canonicalLifts[psiIndex].autId} fullReMatch=${fullMatch}`,
            );
          }
        }
      }
    }

    siteLocalProbes.push({
      familyId: family.familyId,
      comboCount,
      consistentCount,
      consistentNonGlobalCount,
      consistentNonGlobalReFullMatchCount,
      exampleConsistentNonGlobal: examples,
    });
  }

  const totalConsistentNonGlobal =
    drawConsistentNonGlobalCount +
    siteLocalProbes.reduce((sum, probe) => sum + probe.consistentNonGlobalCount, 0);
  const consistentNonGlobalPreservingReCount =
    drawConsistentNonGlobalReFullCount +
    siteLocalProbes.reduce(
      (sum, probe) => sum + probe.consistentNonGlobalReFullMatchCount,
      0,
    );
  const siteLocalJointResult: SiteLocalJointResult = {
    structureConsistentNonGlobalFound: totalConsistentNonGlobal > 0,
    totalConsistentNonGlobalAcrossDrawsAndProbes: totalConsistentNonGlobal,
    consistentNonGlobalPreservingReCount,
    consistentNonGlobalBreakingReCount:
      totalConsistentNonGlobal - consistentNonGlobalPreservingReCount,
  };

  pushLedger(
    'site-local-joint-result',
    `Structure-consistent NON-global site-local automorphism gauges found: ${totalConsistentNonGlobal} (draws ${drawConsistentNonGlobalCount} + probes ${totalConsistentNonGlobal - drawConsistentNonGlobalCount}); of these, ${consistentNonGlobalPreservingReCount} preserve the full true Re-pattern and ${siteLocalJointResult.consistentNonGlobalBreakingReCount} do not.`,
  );

  for (const example of drawConsistentNonGlobalExamples) {
    pushLedger('consistent-non-global-draw-example', example);
  }

  for (const probe of siteLocalProbes) {
    for (const example of probe.exampleConsistentNonGlobal) {
      pushLedger('consistent-non-global-probe-example', example);
    }
  }

  // -------------------------------------------------------------------------
  // Mock-solution test (anti-staple, carry-over)
  // -------------------------------------------------------------------------
  const trueValues = edgeKeys.map((edgeKey) => trueLinkByEdge.get(edgeKey) as OctValue);
  let derangement = drawPermutation(edgeKeys.length, stream);

  while (derangement.some((target, index) => target === index)) {
    derangement = drawPermutation(edgeKeys.length, stream);
  }

  const scrambled = new Map<string, OctValue>();

  edgeKeys.forEach((edgeKey, index) => {
    const base = trueValues[derangement[index]];
    const flip = stream() < 0.5;
    scrambled.set(edgeKey, {
      sign: (flip ? -1 * base.sign : base.sign) as 1 | -1,
      unit: base.unit,
    });
  });

  const scrambledReVector = computeReVector(scrambled);
  const loopsEqualCount = scrambledReVector.filter(
    (re, index) => re === trueReVector[index],
  ).length;
  const mockSolution: AutomorphismMockSolutionReport = {
    scrambleDescription:
      'seeded derangement of the 12 true carriers across the 12 edges + independent sign flips (anti-staple: the pipeline must read carrier facts, not constants)',
    scrambledAssignment: edgeKeys.map((edgeKey) => ({
      edge: edgeKey,
      trueValueKey: octKey(trueLinkByEdge.get(edgeKey) as OctValue),
      scrambledValueKey: octKey(scrambled.get(edgeKey) as OctValue),
    })),
    trueReVector,
    scrambledReVector,
    loopsEqualCount,
    loopCount: trueReVector.length,
    patternBroke: loopsEqualCount !== trueReVector.length,
  };

  if (!mockSolution.patternBroke) {
    pushIssue(
      'mock-solution-pattern-survived',
      'The scrambled carrier assignment reproduced the true Re-pattern; the diagnostic is reading constants, not carrier facts. RUN VOID.',
    );
  }

  // -------------------------------------------------------------------------
  // Integrity (well-formedness only)
  // -------------------------------------------------------------------------
  if (siteLocalProbes.some((probe) => probe.comboCount !== canonicalLifts.length ** 2)) {
    pushIssue('probe-combo-count-mismatch', 'A probe family did not scan all 168^2 pairs.');
  }

  if (drawMatchCounts.length !== AUTOMORPHISM_SITE_LOCAL_DRAWS) {
    pushIssue('draw-count-mismatch', `Expected 128 draws, got ${drawMatchCounts.length}.`);
  }

  for (const row of ledger) {
    if (row.derivationStatus !== '') {
      pushIssue('ledger-derivation-status-not-empty', row.ledgerId);
    }
  }

  return {
    reportId: `${AUTOMORPHISM_GAUGE_METHOD}:medial-hub-first-birth-loop-classes`,
    method: AUTOMORPHISM_GAUGE_METHOD,
    declaredGate: AUTOMORPHISM_GATE_DECLARATION,
    diagnosticScope: 'computes-and-reports-only-pure-math-finite-diagnostic',
    verdictStatus:
      'no-gate0-verdict-auditor-classifies-against-hash-committed-sealed-rule',
    run2Standing:
      'run-2 bracketing and control findings stand and are not recomputed; this run re-tests the gauge axis only, under the ruled automorphism gauge',
    consumedSubstrates: [
      'moufangHolonomyValidityV0 (Run 2: algebra core octMul/octRe/octKey, loop inventory, stored carriers, primal atoms; READ-ONLY)',
    ],
    seed: AUTOMORPHISM_SEED,
    streamConsumptionOrder,
    trueLinkAssignment: edgeKeys.map((edgeKey) => ({
      edge: edgeKey,
      valueKey: octKey(trueLinkByEdge.get(edgeKey) as OctValue),
    })),
    trueReVector,
    automorphismGroup,
    run2OrbitCorrespondence,
    globalGauge,
    siteLocalRelationSet,
    siteLocalDraws,
    siteLocalProbes,
    siteLocalJointResult,
    mockSolution,
    antiStapleAlarms: alarms,
    anomalyLedger: ledger,
    integrityIssueCount: integrityIssues.length,
    integrityIssues,
    ok: integrityIssues.length === 0,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isMultiplicative(automorphism: SignedUnitAutomorphism): boolean {
  for (let i = 1; i <= 7; i += 1) {
    for (let j = 1; j <= 7; j += 1) {
      const lhs = applyAutomorphism(
        automorphism,
        octMul({ sign: 1, unit: i }, { sign: 1, unit: j }),
      );
      const rhs = octMul(
        applyAutomorphism(automorphism, { sign: 1, unit: i }),
        applyAutomorphism(automorphism, { sign: 1, unit: j }),
      );

      if (lhs.sign !== rhs.sign || lhs.unit !== rhs.unit) {
        return false;
      }
    }
  }

  return true;
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
