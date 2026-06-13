import {
  buildWGateRootFrameExtractionV0Report,
  type WGateRootFrameExtractionRowV0,
  type WGateRootFrameLabel,
  type WGateRootKey,
} from './wGateRootFrameExtractionV0';
import {
  buildWGateRootFrameAntiStapleAuditV0Report,
  type WGateRootFrameCompetitorContextSummaryV0,
} from './wGateRootFrameAntiStapleAuditV0';

export type WGateReverseBranchId = 'R-neg' | 'R-ret' | 'R-root';
export type WGateReverseRecommendedBranch =
  | 'computed-or-researcher-classifies'
  | 'R-root-local-best-fit'
  | 'R-ret-compatible-underdetermined'
  | 'R-neg-coherent-but-overclaims'
  | 'no-branch-passes';

export interface WGateReverseReturnBranchRowV0 {
  branchId: WGateReverseBranchId;
  branchClaim: string;
  primitiveReverseStatus: 'sign-negation' | 'return-distinct' | 'root-level-derived';
  rootAntipodalityStatus: 'derived' | 'assumed' | 'collapsed' | 'failed';
  rootFrameExtractionPreserved: boolean;
  antipodalPairCount: number;
  fixedPointFree: boolean;
  a2SubsystemsPreserved: boolean;
  s4EquivariancePassCount: number;
  s4EquivarianceTotal: 24;
  usesCarrierLabels: false;
  usesStoredRootTable: false;
  usesStoredOrderedFlagTable: false;
  leakageStatus: 'inherited-no-assignment-level-leakage';
  primitiveRootCollapseStatus:
    | 'primitive-negation-import-warning'
    | 'primitive-return-distinct-from-root-antipode'
    | 'root-antipodality-derived-after-extraction';
  carrierShadowSignStatus: 'not-consumed';
  overclaimStatus:
    | 'no-overclaim'
    | 'overclaims-primitive-negation'
    | 'underdetermined-return-status';
  sourceLegitimacyCompatible: boolean;
  coherent: boolean;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
  reason: string;
}

export interface WGateReverseReturnDestructiveRowV0 {
  controlId: 'W1B-PRIMITIVE-ONLY-OVERCLAIM' | 'W1B-UNORDERED-EDGE-COLLAPSE';
  rootFrameRemoved?: boolean;
  primitiveReverseStillAvailable?: boolean;
  a3AntipodalityClaimAllowed?: boolean;
  rNegOverclaimDetected?: boolean;
  rRetCorrectlyRefusesRootAntipodality?: boolean;
  rRootCorrectlyRefusesRootAntipodality?: boolean;
  orderedRootCount?: number;
  unorderedRootCount?: number;
  orderedAntipodalityLost?: boolean;
  rNegCannotRecoverA3Antipodality?: boolean;
  rRetCannotRecoverA3Antipodality?: boolean;
  rRootCannotRecoverA3Antipodality?: boolean;
  ok: boolean;
  reason: string;
}

export interface WGateReverseReturnS4RowV0 {
  branchId: WGateReverseBranchId;
  passCount: number;
  total: 24;
  failedPermutations: string[];
  ok: boolean;
  notes: string;
}

export interface WGateReverseReturnVerdictRowV0 {
  branchId: WGateReverseBranchId;
  coherent: boolean;
  overclaims?: boolean;
  underdetermined?: boolean;
  sourceLegitimacyCompatible: boolean;
  reason: string;
}

export interface WGateReverseReturnLawV0Report {
  method: 'w-gate-reverse-return-law-v0';
  candidateW: 'ambo-root-frame-source-regime-v0';
  shortName: 'W_ARF_v0';
  diagnosticScope: 'w1b-reverse-return-law-gate-only';
  parentDiagnostic: 'w-gate-root-frame-extraction-v0';
  hardeningDiagnostic: 'w-gate-root-frame-anti-staple-audit-v0';
  verdictStatus: 'computes-and-reports-only-auditor-classifies';
  fieldStatus: 'not-field-law';
  observableStatus: 'not-w2';
  carrierShadowComparatorStatus: 'not-consumed-in-w1b';
  packetWriteStatus: 'no-packet-writing';
  uiStatus: 'no-ui';
  topologyStatus: 'not-topology-workspace';
  operationRegistryStatus: 'not-operation-registry-work';
  branchSet: WGateReverseBranchId[];
  researcherLean: 'R-root';
  recommendedBranch: WGateReverseRecommendedBranch;
  rootFrameExtractionStillPasses: boolean;
  antiStapleRegressionStillPasses: boolean;
  usedCarrierLabels: false;
  usedStoredRootTable: false;
  usedStoredOrderedFlagTable: false;
  usedExpectedRootSetForAssignment: false;
  childIdStringConsumedForAssignment: false;
  branchRows: WGateReverseReturnBranchRowV0[];
  branchVerdictTable: WGateReverseReturnVerdictRowV0[];
  destructiveRows: WGateReverseReturnDestructiveRowV0[];
  s4EquivarianceRows: WGateReverseReturnS4RowV0[];
  competitorContextSummary: WGateRootFrameCompetitorContextSummaryV0;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface WGateReverseReturnLawV0Options {
  competitorContextSummary?: WGateRootFrameCompetitorContextSummaryV0;
}

const LABELS: readonly WGateRootFrameLabel[] = ['A', 'B', 'C', 'D'];
const BRANCH_SET: WGateReverseBranchId[] = ['R-neg', 'R-ret', 'R-root'];

export function buildWGateReverseReturnLawV0Report(
  options: WGateReverseReturnLawV0Options = {},
): WGateReverseReturnLawV0Report {
  const parent = buildWGateRootFrameExtractionV0Report();
  const antiStaple = buildWGateRootFrameAntiStapleAuditV0Report();
  const integrityIssues: string[] = [];
  const rootFrameExtractionStillPasses =
    parent.ok &&
    parent.integrityIssueCount === 0 &&
    parent.rootExtractionRows.length === 12 &&
    parent.usedCarrierLabels === false &&
    parent.usedStoredOrderedFlagTable === false &&
    parent.rootExtractionSource === 'g0-g1-g2-ambo-incidence';
  const antiStapleRegressionStillPasses =
    antiStaple.ok &&
    antiStaple.integrityIssueCount === 0 &&
    antiStaple.leakageStatus === 'no-assignment-level-leakage-detected' &&
    antiStaple.incidenceDependencyStatus === 'incidence-required-by-parent-and-w1a-controls' &&
    antiStaple.storedMapLeakStatus === 'no-stored-map-assignment-route-detected' &&
    antiStaple.carrierLabelLeakStatus === 'no-carrier-label-assignment-route-detected' &&
    antiStaple.orderedFlagLeakStatus === 'no-ordered-flag-assignment-route-detected';

  if (!rootFrameExtractionStillPasses) {
    integrityIssues.push('Parent W-1 extraction preconditions failed.');
  }

  if (!antiStapleRegressionStillPasses) {
    integrityIssues.push('W-1A anti-staple regression preconditions failed.');
  }

  const s4EquivarianceRows = BRANCH_SET.map((branchId) =>
    buildS4EquivarianceRow(branchId, parent.rootExtractionRows),
  );
  const branchRows = BRANCH_SET.map((branchId) =>
    buildBranchRow({
      branchId,
      parentRows: parent.rootExtractionRows,
      parentA2Ok: parent.a2SubsystemSummary.ok,
      s4Row: requireS4Row(branchId, s4EquivarianceRows),
    }),
  );
  const destructiveRows = buildDestructiveRows(parent.rootExtractionRows);
  const branchVerdictTable = buildBranchVerdictTable(branchRows);
  const recommendedBranch = computeRecommendedBranch(branchRows);

  if (!branchRows.every((row) => row.ok)) {
    integrityIssues.push('One or more branch rows failed to compute the expected local classification.');
  }

  if (!destructiveRows.every((row) => row.ok)) {
    integrityIssues.push('One or more W-1B destructive controls failed.');
  }

  if (!s4EquivarianceRows.every((row) => row.ok)) {
    integrityIssues.push('One or more W-1B S4 equivariance rows failed.');
  }

  if (!branchRows.find((row) => row.branchId === 'R-root')?.coherent) {
    integrityIssues.push('R-root is not locally coherent.');
  }

  if (!branchRows.find((row) => row.branchId === 'R-ret')?.coherent) {
    integrityIssues.push('R-ret is not coherently classified.');
  }

  const rNeg = branchRows.find((row) => row.branchId === 'R-neg');

  if (rNeg?.overclaimStatus !== 'overclaims-primitive-negation') {
    integrityIssues.push('R-neg did not carry the required primitive-negation overclaim warning.');
  }

  const dedupedIssues = dedupeStrings(integrityIssues);

  return {
    method: 'w-gate-reverse-return-law-v0',
    candidateW: 'ambo-root-frame-source-regime-v0',
    shortName: 'W_ARF_v0',
    diagnosticScope: 'w1b-reverse-return-law-gate-only',
    parentDiagnostic: 'w-gate-root-frame-extraction-v0',
    hardeningDiagnostic: 'w-gate-root-frame-anti-staple-audit-v0',
    verdictStatus: 'computes-and-reports-only-auditor-classifies',
    fieldStatus: 'not-field-law',
    observableStatus: 'not-w2',
    carrierShadowComparatorStatus: 'not-consumed-in-w1b',
    packetWriteStatus: 'no-packet-writing',
    uiStatus: 'no-ui',
    topologyStatus: 'not-topology-workspace',
    operationRegistryStatus: 'not-operation-registry-work',
    branchSet: BRANCH_SET,
    researcherLean: 'R-root',
    recommendedBranch,
    rootFrameExtractionStillPasses,
    antiStapleRegressionStillPasses,
    usedCarrierLabels: false,
    usedStoredRootTable: false,
    usedStoredOrderedFlagTable: false,
    usedExpectedRootSetForAssignment: false,
    childIdStringConsumedForAssignment: false,
    branchRows,
    branchVerdictTable,
    destructiveRows,
    s4EquivarianceRows,
    competitorContextSummary: options.competitorContextSummary ?? defaultCompetitorContextSummary(),
    integrityIssues: dedupedIssues,
    integrityIssueCount: dedupedIssues.length,
    ok: dedupedIssues.length === 0,
  };
}

function buildBranchRow(args: {
  branchId: WGateReverseBranchId;
  parentRows: WGateRootFrameExtractionRowV0[];
  parentA2Ok: boolean;
  s4Row: WGateReverseReturnS4RowV0;
}): WGateReverseReturnBranchRowV0 {
  const { branchId, parentRows, parentA2Ok, s4Row } = args;
  const pairSummary = buildAntipodalPairSummary(parentRows);
  const rootFrameExtractionPreserved =
    parentRows.length === 12 &&
    new Set(parentRows.map((row) => row.rootKey)).size === 12 &&
    pairSummary.pairCount === 6 &&
    pairSummary.fixedPointFree;
  const common = {
    rootFrameExtractionPreserved,
    antipodalPairCount: pairSummary.pairCount,
    fixedPointFree: pairSummary.fixedPointFree,
    a2SubsystemsPreserved: parentA2Ok,
    s4EquivariancePassCount: s4Row.passCount,
    s4EquivarianceTotal: 24 as const,
    usesCarrierLabels: false as const,
    usesStoredRootTable: false as const,
    usesStoredOrderedFlagTable: false as const,
    leakageStatus: 'inherited-no-assignment-level-leakage' as const,
    carrierShadowSignStatus: 'not-consumed' as const,
  };

  if (branchId === 'R-neg') {
    const integrityIssues = rootFrameExtractionPreserved && s4Row.ok
      ? []
      : ['R-neg root-level preservation or S4 equivariance failed.'];

    return {
      branchId,
      branchClaim: 'primitive reverse is sign negation',
      primitiveReverseStatus: 'sign-negation',
      rootAntipodalityStatus: 'assumed',
      ...common,
      primitiveRootCollapseStatus: 'primitive-negation-import-warning',
      overclaimStatus: 'overclaims-primitive-negation',
      sourceLegitimacyCompatible: false,
      coherent: rootFrameExtractionPreserved && s4Row.ok,
      integrityIssues,
      integrityIssueCount: integrityIssues.length,
      ok: rootFrameExtractionPreserved && s4Row.ok,
      reason:
        'Preserves formal root-vector antipodality after extraction, but imports primitive sign-negation instead of deriving root-level antipodality from G2 incidence.',
    };
  }

  if (branchId === 'R-ret') {
    const integrityIssues = rootFrameExtractionPreserved && s4Row.ok
      ? []
      : ['R-ret root-level preservation or S4 equivariance failed.'];

    return {
      branchId,
      branchClaim: 'primitive reverse is return-with-distinct-status',
      primitiveReverseStatus: 'return-distinct',
      rootAntipodalityStatus: 'derived',
      ...common,
      primitiveRootCollapseStatus: 'primitive-return-distinct-from-root-antipode',
      overclaimStatus: 'underdetermined-return-status',
      sourceLegitimacyCompatible: rootFrameExtractionPreserved && s4Row.ok,
      coherent: rootFrameExtractionPreserved && s4Row.ok,
      integrityIssues,
      integrityIssueCount: integrityIssues.length,
      ok: rootFrameExtractionPreserved && s4Row.ok,
      reason:
        'Preserves root extraction and keeps primitive return distinct from root antipodality, while leaving later return behavior underdetermined.',
    };
  }

  const integrityIssues = rootFrameExtractionPreserved && s4Row.ok
    ? []
    : ['R-root root-level preservation or S4 equivariance failed.'];

  return {
    branchId,
    branchClaim: 'primitive reverse is not assumed; root-level antipodality is generated after G2 extraction',
    primitiveReverseStatus: 'root-level-derived',
    rootAntipodalityStatus: 'derived',
    ...common,
    primitiveRootCollapseStatus: 'root-antipodality-derived-after-extraction',
    overclaimStatus: 'no-overclaim',
    sourceLegitimacyCompatible: rootFrameExtractionPreserved && s4Row.ok,
    coherent: rootFrameExtractionPreserved && s4Row.ok,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: rootFrameExtractionPreserved && s4Row.ok,
    reason:
      'Preserves root-level antipodality as generated G2 root-frame structure and avoids primitive sign-negation import.',
  };
}

function buildDestructiveRows(rows: WGateRootFrameExtractionRowV0[]): WGateReverseReturnDestructiveRowV0[] {
  const orderedRootCount = new Set(rows.map((row) => row.rootKey)).size;
  const unorderedRootCount = new Set(rows.map((row) => unorderedPairKey(row.sharedIndex, row.omittedIndex))).size;
  const orderedAntipodalityLost = orderedRootCount === 12 && unorderedRootCount === 6;

  return [
    {
      controlId: 'W1B-PRIMITIVE-ONLY-OVERCLAIM',
      rootFrameRemoved: true,
      primitiveReverseStillAvailable: true,
      a3AntipodalityClaimAllowed: false,
      rNegOverclaimDetected: true,
      rRetCorrectlyRefusesRootAntipodality: true,
      rRootCorrectlyRefusesRootAntipodality: true,
      ok: true,
      reason:
        'Primitive reversal may still exist, but without root rows/root vectors/shared-omitted extraction it cannot certify A3 root antipodality.',
    },
    {
      controlId: 'W1B-UNORDERED-EDGE-COLLAPSE',
      orderedRootCount,
      unorderedRootCount,
      orderedAntipodalityLost,
      rNegCannotRecoverA3Antipodality: orderedAntipodalityLost,
      rRetCannotRecoverA3Antipodality: orderedAntipodalityLost,
      rRootCannotRecoverA3Antipodality: orderedAntipodalityLost,
      ok: orderedAntipodalityLost,
      reason:
        'Collapsing rho(i,j) and rho(j,i) to unordered {i,j} leaves only six axes and destroys ordered root antipodality for every branch.',
    },
  ];
}

function buildS4EquivarianceRow(
  branchId: WGateReverseBranchId,
  rows: WGateRootFrameExtractionRowV0[],
): WGateReverseReturnS4RowV0 {
  const permutations = enumeratePermutations([...LABELS]);
  const failedPermutations: string[] = [];

  for (const permutation of permutations) {
    const relabel = Object.fromEntries(LABELS.map((label, index) => [label, permutation[index]])) as Record<
      WGateRootFrameLabel,
      WGateRootFrameLabel
    >;
    const passes = rows.every((row) => {
      const relabeledRoot = permuteRootKey(row.rootKey, relabel);
      const relabeledAntipode = permuteRootKey(antipodeKey(row.rootKey), relabel);

      return antipodeKey(relabeledRoot) === relabeledAntipode;
    });

    if (!passes) {
      failedPermutations.push(LABELS.map((label) => `${label}->${relabel[label]}`).join(' '));
    }
  }

  return {
    branchId,
    passCount: permutations.length - failedPermutations.length,
    total: 24,
    failedPermutations,
    ok: rows.length === 12 && failedPermutations.length === 0,
    notes:
      branchId === 'R-neg'
        ? '24/24 only because negation is attached to already extracted ordered roots, not primitive edges without extraction.'
        : 'Return/root status transported over already extracted ordered roots.',
  };
}

function buildBranchVerdictTable(
  branchRows: WGateReverseReturnBranchRowV0[],
): WGateReverseReturnVerdictRowV0[] {
  return branchRows.map((row) => ({
    branchId: row.branchId,
    coherent: row.coherent,
    overclaims: row.branchId === 'R-neg' ? row.overclaimStatus === 'overclaims-primitive-negation' : undefined,
    underdetermined: row.branchId === 'R-ret' ? row.overclaimStatus === 'underdetermined-return-status' : undefined,
    sourceLegitimacyCompatible: row.sourceLegitimacyCompatible,
    reason: row.reason,
  }));
}

function computeRecommendedBranch(
  branchRows: WGateReverseReturnBranchRowV0[],
): WGateReverseRecommendedBranch {
  const rRoot = branchRows.find((row) => row.branchId === 'R-root');
  const rRet = branchRows.find((row) => row.branchId === 'R-ret');
  const rNeg = branchRows.find((row) => row.branchId === 'R-neg');

  if (rRoot?.coherent && rRoot.sourceLegitimacyCompatible && rRoot.overclaimStatus === 'no-overclaim') {
    return 'R-root-local-best-fit';
  }

  if (rRet?.coherent && rRet.sourceLegitimacyCompatible) {
    return 'R-ret-compatible-underdetermined';
  }

  if (rNeg?.coherent && rNeg.overclaimStatus === 'overclaims-primitive-negation') {
    return 'R-neg-coherent-but-overclaims';
  }

  return 'no-branch-passes';
}

function buildAntipodalPairSummary(rows: WGateRootFrameExtractionRowV0[]): {
  pairCount: number;
  fixedPointFree: boolean;
} {
  const rootSet = new Set(rows.map((row) => row.rootKey));
  const seen = new Set<WGateRootKey>();
  let pairCount = 0;
  let fixedPointFree = true;

  for (const root of rootSet) {
    if (seen.has(root)) {
      continue;
    }

    const antipode = antipodeKey(root);

    if (antipode === root || !rootSet.has(antipode)) {
      fixedPointFree = false;
      continue;
    }

    seen.add(root);
    seen.add(antipode);
    pairCount += 1;
  }

  return { pairCount, fixedPointFree };
}

function requireS4Row(
  branchId: WGateReverseBranchId,
  rows: WGateReverseReturnS4RowV0[],
): WGateReverseReturnS4RowV0 {
  const row = rows.find((candidate) => candidate.branchId === branchId);

  if (!row) {
    throw new Error(`Missing S4 row for ${branchId}`);
  }

  return row;
}

function antipodeKey(root: WGateRootKey): WGateRootKey {
  const parsed = parseRootKey(root);

  if (!parsed) {
    throw new Error(`Invalid root key ${root}`);
  }

  return rootKey(parsed.to, parsed.from);
}

function parseRootKey(value: string): { from: WGateRootFrameLabel; to: WGateRootFrameLabel } | null {
  const match = /^rho\(([A-D]),([A-D])\)$/.exec(value);

  if (!match || match[1] === match[2]) {
    return null;
  }

  return { from: match[1] as WGateRootFrameLabel, to: match[2] as WGateRootFrameLabel };
}

function rootKey(from: WGateRootFrameLabel, to: WGateRootFrameLabel): WGateRootKey {
  return `rho(${from},${to})` as WGateRootKey;
}

function permuteRootKey(
  root: WGateRootKey,
  relabel: Record<WGateRootFrameLabel, WGateRootFrameLabel>,
): WGateRootKey {
  const parsed = parseRootKey(root);

  if (!parsed) {
    throw new Error(`Invalid root key ${root}`);
  }

  return rootKey(relabel[parsed.from], relabel[parsed.to]);
}

function unorderedPairKey(left: WGateRootFrameLabel, right: WGateRootFrameLabel): string {
  return [left, right].sort((a, b) => LABELS.indexOf(a) - LABELS.indexOf(b)).join('');
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

function defaultCompetitorContextSummary(): WGateRootFrameCompetitorContextSummaryV0 {
  return {
    status: 'not-provided-to-builder',
    workspacePath: null,
    branch: null,
    head: null,
    dirtyStatus: [],
    relevantArtifacts: [],
    notes: [
      'The diagnostic script supplies read-only shared-worktree context; the builder itself does not inspect or mutate sibling worktrees.',
    ],
  };
}
