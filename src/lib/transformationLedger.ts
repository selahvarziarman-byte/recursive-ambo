// transformationLedger — the Transformation Ledger & Faithfulness Certifier v0.
//
// A pure, read-only layer over a built transformation, returning a typed report
// with an `issues[]` array. It mutates nothing, names nothing, and fabricates
// nothing — it CERTIFIES a transformation's bookkeeping (transformation only); it
// asserts no semantic names. Modelled as a read-only sibling of
// `src/lib/incidenceTraceRegistry.ts` (see the authoritative spec:
// docs/governance/PLATONIC_ENGINE_TRANSFORMATION_LEDGER_SPEC.md).
//
// SCOPE OF THIS FILE (Target 2, P1 — the BIJECTIVE BASELINE over the built dual):
//   The generic ledger shape — a forward PARTIAL function over source site ids
//   (each source -> its result, or null when cut/removed) and a SET-valued
//   pull-back (each result -> the set of source sites it absorbed). Plus the
//   faithfulness certificate (spec §6) over it. `buildLedgerFromDual` lifts the
//   dual's six maps into that shape; on the dual the ledger is BIJECTIVE — every
//   forward is total + injective, every pull-back is a singleton — so the
//   certificate returns FAITHFUL trivially.
//
// LINEAGE IS UNLOADED IN THIS SLICE. `certifyFaithfulness` is generic and will be
// reused in P2–P5 with the registry's real (primalMultisetKey-based) `lineageOf`;
// here it is called with the trivial `lineageOf = (id) => id`, which is never
// load-bearing: every pull-back is a singleton, so homogeneity holds by the
// `pullBackScopes.length <= 1` clause and `lineageOf` is not consulted on any
// multi-element set. The real lineage content begins at P2.
//
// HONESTY (spec §3.III): never fabricate an identity; never silently drop a cut;
// surface any anomaly (e.g. a pull-back that is NOT a singleton on the dual —
// which would mean the dual's enforced bijection broke) via `issues[]`. Statuses
// are NAMED `lineage-homogeneous` / `lineage-heterogeneous`; the only operation
// verdicts are `FAITHFUL` / `UNFAITHFUL`.
//
// GATED: this module builds NO glue/quotient/cut OPERATION (spec §8). It imports
// only the `SemanticDualModel` TYPE; it never calls `applyDualization`, never
// mutates a `Shape`, and runs no simulated primitive.

import type { SemanticDualModel } from './dualization';
import type { Shape } from '../types/geometry';
// The lineage homogeneity criterion is the SHARED single-source primitive
// (src/lib/lineage.ts) — the same definition the registry uses for its B-twin
// grouping key, so the transformation-side and generation-side never drift.
import { primalMultiset, primalMultisetKey } from './lineage';

export interface TransformationLedger {
  forward: Record<string, string | null>; // each source site id -> its result site id, or null (cut/removed) — a PARTIAL function
  pullBack: Record<string, string[]>; // each result site id -> the SET of source site ids it absorbed (set-valued)
}

export interface ResultSiteCertificate {
  resultSiteId: string;
  pullBackScopes: string[]; // the absorbed source site ids (the "scopes")
  lineageHomogeneous: boolean;
  inheritedLineage: string | null; // the shared lineage key when homogeneous (P1: the trivial singleton key); null if heterogeneous
  lineageConflict: string[] | null; // the distinct lineage keys when heterogeneous; null if homogeneous
  status: 'lineage-homogeneous' | 'lineage-heterogeneous';
}

export interface FaithfulnessCertificate {
  perResultSite: ResultSiteCertificate[];
  perCutSource: { sourceSiteId: string; removed: true; logged: boolean }[];
  resultSiteCount: number;
  homogeneousCount: number;
  heterogeneousCount: number;
  removedLoggedCount: number;
  removedSilentCount: number;
  operationStatus: 'FAITHFUL' | 'UNFAITHFUL'; // FAITHFUL iff heterogeneousCount === 0 AND removedSilentCount === 0
}

export interface TransformationLedgerReport {
  method: 'transformation-ledger-v0';
  scope: 'transformation-only';
  semanticStatus: 'not-semantic-naming';
  shapeMutationStatus: 'not-shape-mutation';
  ledger: TransformationLedger;
  certificate: FaithfulnessCertificate;
  issues: string[];
}

// Lift the dual's six maps into the generic ledger shape. `forward` flattens the
// three source->dual maps (disjoint id-spaces: face / vertex / edge, so the union
// never collides); `pullBack` flattens the three dual->source maps, each value
// wrapped as a SINGLETON set. The dual's enforced bijection guarantees every
// pull-back is a singleton (verified, not assumed, in buildTransformationLedgerReport).
export function buildLedgerFromDual(model: SemanticDualModel): TransformationLedger {
  const forward: Record<string, string | null> = {
    ...model.sourceFaceToDualVertex,
    ...model.sourceVertexToDualFace,
    ...model.sourceEdgeToDualEdge,
  };

  const pullBack: Record<string, string[]> = {};
  for (const [dualVertexId, sourceFaceId] of Object.entries(model.dualVertexToSourceFace)) {
    pullBack[dualVertexId] = [sourceFaceId];
  }
  for (const [dualFaceId, sourceVertexId] of Object.entries(model.dualFaceToSourceVertex)) {
    pullBack[dualFaceId] = [sourceVertexId];
  }
  for (const [dualEdgeId, sourceEdgeId] of Object.entries(model.dualEdgeToSourceEdge)) {
    pullBack[dualEdgeId] = [sourceEdgeId];
  }

  return { forward, pullBack };
}

// A lineage-key function over a Shape's sites, memoized — reuses the shared
// primitive (src/lib/lineage.ts), so the ledger's homogeneity criterion is the
// SAME lineage definition the registry's B-twin grouping uses. The returned
// closure carries its own memo (lineage is a DAG; each site resolves once).
export function shapeLineageOf(shape: Shape): (siteId: string) => string {
  const memo = new Map<string, Map<string, number>>();
  return (siteId) => primalMultisetKey(primalMultiset(siteId, shape, memo));
}

// Build a ledger from a PROPOSED identification over source site ids (a SIMULATED
// glue/cut — spec §8: no operation is built; we only read an identification over
// existing sites). `resultOf(s)` = the result id s maps to; sites sharing a result
// are GLUED; `resultOf(s) === null` CUTS s. `forward` is the identification;
// `pullBack[r]` is the SET of sources that landed on r (set-valued — the glue's
// multi-source pull-back is exactly where the certificate becomes load-bearing).
export function buildLedgerFromIdentification(
  sourceSiteIds: string[],
  resultOf: (siteId: string) => string | null,
): TransformationLedger {
  const forward: Record<string, string | null> = {};
  const pullBack: Record<string, string[]> = {};
  for (const sourceSiteId of sourceSiteIds) {
    const resultSiteId = resultOf(sourceSiteId);
    forward[sourceSiteId] = resultSiteId;
    if (resultSiteId !== null) {
      (pullBack[resultSiteId] ??= []).push(sourceSiteId);
    }
  }
  return { forward, pullBack };
}

// Generic faithfulness certifier (spec §6), reused unchanged in P2+. For each
// result site, its pull-back set is `lineage-homogeneous` when it has <= 1 source
// (trivially) OR all its sources share one `lineageOf` value; otherwise
// `lineage-heterogeneous` (the distinct keys are the conflict). A source whose
// forward is null is a CUT -> per-cut-source, `logged` iff it appears in
// `removedLog` (else a SILENT drop). `operationStatus` is FAITHFUL iff there is no
// heterogeneity AND no silent drop. `lineageOf` is consulted only on multi-source
// sets — never on a singleton baseline.
export function certifyFaithfulness(
  ledger: TransformationLedger,
  lineageOf: (sourceSiteId: string) => string,
  removedLog: string[] = [],
): FaithfulnessCertificate {
  const removedLogSet = new Set(removedLog);

  const perResultSite: ResultSiteCertificate[] = Object.keys(ledger.pullBack)
    .sort()
    .map((resultSiteId) => {
      const pullBackScopes = ledger.pullBack[resultSiteId];

      let lineageHomogeneous: boolean;
      let inheritedLineage: string | null;
      let lineageConflict: string[] | null;

      if (pullBackScopes.length <= 1) {
        // Singleton (or empty) pull-back: homogeneous for free; lineageOf is read
        // only to record the trivial inherited key, never to decide homogeneity.
        lineageHomogeneous = true;
        inheritedLineage = pullBackScopes.length === 1 ? lineageOf(pullBackScopes[0]) : null;
        lineageConflict = null;
      } else {
        const distinctKeys = [...new Set(pullBackScopes.map(lineageOf))];
        if (distinctKeys.length === 1) {
          lineageHomogeneous = true;
          inheritedLineage = distinctKeys[0];
          lineageConflict = null;
        } else {
          lineageHomogeneous = false;
          inheritedLineage = null;
          lineageConflict = distinctKeys;
        }
      }

      return {
        resultSiteId,
        pullBackScopes,
        lineageHomogeneous,
        inheritedLineage,
        lineageConflict,
        status: lineageHomogeneous ? 'lineage-homogeneous' : 'lineage-heterogeneous',
      };
    });

  const perCutSource = Object.keys(ledger.forward)
    .filter((sourceSiteId) => ledger.forward[sourceSiteId] === null)
    .sort()
    .map((sourceSiteId) => ({
      sourceSiteId,
      removed: true as const,
      logged: removedLogSet.has(sourceSiteId),
    }));

  const homogeneousCount = perResultSite.filter((c) => c.lineageHomogeneous).length;
  const heterogeneousCount = perResultSite.length - homogeneousCount;
  const removedLoggedCount = perCutSource.filter((c) => c.logged).length;
  const removedSilentCount = perCutSource.length - removedLoggedCount;

  return {
    perResultSite,
    perCutSource,
    resultSiteCount: perResultSite.length,
    homogeneousCount,
    heterogeneousCount,
    removedLoggedCount,
    removedSilentCount,
    operationStatus:
      heterogeneousCount === 0 && removedSilentCount === 0 ? 'FAITHFUL' : 'UNFAITHFUL',
  };
}

// The dual-specific report builder: lift the bijection, run the honesty anomaly
// scans (these would fire only if the dual's enforced bijection broke), then
// certify with the TRIVIAL lineage. Real lineage is DEFERRED to P2 — here every
// pull-back is a singleton, so `lineageOf` is never load-bearing.
export function buildTransformationLedgerReport(
  model: SemanticDualModel,
): TransformationLedgerReport {
  const issues: string[] = [];
  const ledger = buildLedgerFromDual(model);

  // Anomaly scan #1 — non-singleton pull-back (the dual is the bijective baseline).
  for (const [resultSiteId, scopes] of Object.entries(ledger.pullBack)) {
    if (scopes.length !== 1) {
      issues.push(
        `result site ${resultSiteId}: pull-back is not a singleton (size ${scopes.length}); the dual's enforced bijection broke`,
      );
    }
  }

  // Anomaly scan #2 — forward must be a total injection that round-trips through
  // the pull-back (the ledger must REPRODUCE the model's bijection, not approximate it).
  const sourceByResult = new Map<string, string>();
  for (const [sourceSiteId, resultSiteId] of Object.entries(ledger.forward)) {
    if (resultSiteId === null) {
      issues.push(
        `source site ${sourceSiteId}: forward is null (a cut); the dual has no cuts — bijection broke`,
      );
      continue;
    }
    const prior = sourceByResult.get(resultSiteId);
    if (prior !== undefined) {
      issues.push(
        `result site ${resultSiteId}: forward is not injective (${prior} and ${sourceSiteId} both map to it); bijection broke`,
      );
    } else {
      sourceByResult.set(resultSiteId, sourceSiteId);
    }
    const scopes = ledger.pullBack[resultSiteId];
    if (!scopes) {
      issues.push(
        `source site ${sourceSiteId}: forward target ${resultSiteId} has no pull-back entry; bijection broke`,
      );
    } else if (!(scopes.length === 1 && scopes[0] === sourceSiteId)) {
      issues.push(
        `source site ${sourceSiteId}: round-trip pullBack[forward[${sourceSiteId}]] is not [${sourceSiteId}]; bijection broke`,
      );
    }
  }

  const certificate = certifyFaithfulness(ledger, (id) => id);

  return {
    method: 'transformation-ledger-v0',
    scope: 'transformation-only',
    semanticStatus: 'not-semantic-naming',
    shapeMutationStatus: 'not-shape-mutation',
    ledger,
    certificate,
    issues,
  };
}

// ===========================================================================
// P8 (charter layer 2) — the SIGNED pull-back + w₁ (orientation as faithful data)
// ===========================================================================
// Authority: docs/governance/PLATONIC_ENGINE_SIGNED_PULLBACK_JUNCTION_CHARTER.md
// §1(2) / §3 / §5 / §6 + ADR 0001 (a flip-glue carries a sign). This block is
// PURELY ADDITIVE: the committed faithfulness law above — TransformationLedger,
// FaithfulnessCertificate, buildLedgerFromIdentification, certifyFaithfulness — is
// BYTE-UNCHANGED. Orientation is a NEW, ORTHOGONAL layer; the clash-set gains NO
// third class (charter §3): faithfulness reads the UNSIGNED pullBack
// (sources/lineage), certifyOrientation reads the SIGNED pullBack (signs/cycles),
// and NEITHER reads the other. GATED (charter §5): a SIMULATED signed
// identification over existing sites; the orientation-reversing flip is simulated
// (the engine produces no [B,A]); w₁ runs over SYNTHETIC cycles (the real
// incidence-web cycles arrive when the closure driver is built). A junction is a
// >2-valent pull-back — set-valued at the vertex (P6 §B), signed-non-manifold at
// the edge (here).

// §A — the signed pull-back: a per-element sign (ADR 0001; charter §1.2).
export interface SignedPullBackElement {
  source: string; // a source site id absorbed into the result
  sign: 1 | -1; // its orientation relative to the result (+ preserving, − reversing)
}

export interface SignedTransformationLedger {
  forward: Record<string, string | null>; // identical to the unsigned ledger's forward
  pullBack: Record<string, string[]>; // the UNSIGNED set — exactly what the committed certifier reads, UNCHANGED
  signedPullBack: Record<string, SignedPullBackElement[]>; // the SAME sets, each element signed (the orientation layer)
}

// Build a signed ledger from a PROPOSED signed identification over source sites.
// `pullBack` is built EXACTLY as buildLedgerFromIdentification does (same order,
// same push) so the committed certifier is reused VERBATIM on the unsigned
// projection; `signedPullBack[r]` carries the same sources in the same order, each
// tagged signOf(source). GATED: no operation is built; the sign/flip is simulated.
export function buildSignedIdentification(
  sourceSiteIds: string[],
  resultOf: (siteId: string) => string | null,
  signOf: (siteId: string) => 1 | -1,
): SignedTransformationLedger {
  const forward: Record<string, string | null> = {};
  const pullBack: Record<string, string[]> = {};
  const signedPullBack: Record<string, SignedPullBackElement[]> = {};
  for (const sourceSiteId of sourceSiteIds) {
    const resultSiteId = resultOf(sourceSiteId);
    forward[sourceSiteId] = resultSiteId;
    if (resultSiteId !== null) {
      (pullBack[resultSiteId] ??= []).push(sourceSiteId);
      (signedPullBack[resultSiteId] ??= []).push({ source: sourceSiteId, sign: signOf(sourceSiteId) });
    }
  }
  return { forward, pullBack, signedPullBack };
}

// §B — the sign is READ OFF the substrate (grounded, not arbitrary; charter §1.2).
// Compare two edge-midpoints' oriented source edges (createdBy.sourceVertexIds =
// the oriented edge [A,B]): the SAME edge in the SAME order -> +1 (orientation-
// preserving); the same edge in REVERSED order [B,A] -> -1 (orientation-reversing,
// a flip). No detected reversal (different edges / missing data) -> +1 (the
// identity/preserving default; -1 fires ONLY on a detected same-edge reversal).
// GATED: the engine produces no [B,A], so the -1 branch stands in for a flip-glue.
export function boundarySign(siteId: string, refSiteId: string, shape: Shape): 1 | -1 {
  const edgeOf = (id: string): string[] => shape.vertices[id]?.createdBy?.sourceVertexIds ?? [];
  const edge = edgeOf(siteId);
  const ref = edgeOf(refSiteId);
  if (edge.length === 2 && ref.length === 2) {
    if (edge[0] === ref[0] && edge[1] === ref[1]) return 1; // same oriented edge
    if (edge[0] === ref[1] && edge[1] === ref[0]) return -1; // reversed -> a flip
  }
  return 1; // no reversal detected -> orientation-preserving
}

// §C — w₁ over CYCLES (a cocycle; signs COMPOSE; charter §1.2 / §3).
export interface OrientationCertificate {
  perCycle: { cycle: string[]; netSign: 1 | -1; orientable: boolean }[];
  w1: 0 | 1; // 0 = orientable (every cycle +1); 1 = non-orientable (some cycle −1)
  nonOrientable: boolean; // === (w1 === 1) — recorded as FAITHFUL DATA, never a clash
}

// certifyOrientation reads ONLY the signed layer. Each cycle is a loop of source
// ids (a loop in the gluing/incidence web — SYNTHETIC in v0); its `netSign` is the
// PRODUCT of those sources' signs (each source maps to one result, so its sign is
// well-defined); `orientable` = (netSign === +1); `w1 = 1` iff ANY cycle is −1.
// A single pull-back SET is NEVER flagged "inconsistent" — (non)orientability is a
// GLOBAL cycle property ONLY (charter §1.2). A source absent from the signed
// ledger (e.g. a cut) contributes +1 (no reversal).
export function certifyOrientation(
  ledger: SignedTransformationLedger,
  cycles: string[][],
): OrientationCertificate {
  const signOfSource = new Map<string, 1 | -1>();
  for (const elements of Object.values(ledger.signedPullBack)) {
    for (const element of elements) {
      signOfSource.set(element.source, element.sign);
    }
  }

  const perCycle = cycles.map((cycle) => {
    let net = 1;
    for (const source of cycle) {
      net *= signOfSource.get(source) ?? 1;
    }
    const netSign: 1 | -1 = net < 0 ? -1 : 1;
    return { cycle, netSign, orientable: netSign === 1 };
  });

  const w1: 0 | 1 = perCycle.some((cycleResult) => cycleResult.netSign === -1) ? 1 : 0;
  return { perCycle, w1, nonOrientable: w1 === 1 };
}
