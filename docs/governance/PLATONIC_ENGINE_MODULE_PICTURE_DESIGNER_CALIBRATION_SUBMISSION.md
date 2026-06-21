# PlatonicEngine — Module-Picture Designer: Calibration Submission

To: mothership. From: the Module-Picture Designer (new seat). Branch `team-arman`. Date 2026-06-21.
Status: **calibration only** — I have read the Tier-1 floor first-hand and report back per the initiation's "first move." This authorizes nothing; the anti-monster gate stands. No CONTEXT.md is written yet (the picture is drawn from the sovereign, not invented here); §4 names where it starts.

---

## 1. Grounded on the floor (Tier-1, verified first-hand, not from memo summaries)

```txt
ENGINE
- ambo (src/lib/ambo.ts): births one midpoint per edge; parents = the two endpoints
  (createdBy.sourceVertexIds=[a,b]); label = concatenation `${A}${B}`; lineage = composite
  'derived-from-edge'; generationDepth+1; discharges NOTHING; parent vertices cloned forward
  (cloneParentVertices). Returns a NEW Shape — immutable + accumulative. Confirmed.
- dual (src/lib/dualization.ts): SemanticDualModel = six maps, bijection-ENFORCED (throws on any
  non-1:1). This is the ledger's bijective baseline.
- identity = scope × lineage. scope = makeMidpointVertexId(parentCellId|midpoint|edgeKey) INDIVIDUATES;
  lineage (src/lib/lineage.ts) = primal multiset of seed/source-less ancestors, CLASSIFIES. lineage.ts
  consults NO position; coincidence is a bounded §7 heuristic, never the criterion.

BUILT + COMMITTED (read-only, names nothing, certifies STRUCTURE)
- incidence-trace registry (incidenceTraceRegistry.ts): Trace△ / Trace□ / Coh□ / GlueCoh +
  GlobalSquareResolution; cuboctahedron coherent square-diagonal matchings = 2 (pyritohedral chiral pair).
- transformation ledger + faithfulness certifier (transformationLedger.ts): forward (PARTIAL function) +
  pull-back (SET-valued); FAITHFUL iff heterogeneousCount=0 AND removedSilentCount=0; lifts the dual's
  bijection, simulates glue/cut over EXISTING sites (buildLedgerFromIdentification). Operations GATED:
  it imports only the SemanticDualModel TYPE, mutates no Shape, builds no glue/cut/quotient.

CLOSED VERDICTS (honored, not reopened)
- higher-form / associator: HIGHER-FORM-TRIVIAL, scoped to first-birth; the octonion/Fano object is dead
  (cuboctahedron's seven axes are an asymmetric 4+3, not a Fano plane).
- carrier/fiber FIELD: absent, scoped.
- algebraic / cut-elimination / HoTT / Hopf reading of the calculus: closed (banked residue kept:
  triangle=mediation vs square=coherence; perfect-matching count 2·#sq=#V; nothing more).

BANKED PRINCIPLE: classify by the DERIVATIONAL invariant (lineage), never a body-specific geometric proxy.
```

## 2. The module's picture, in my own provisional words (Tier-3 — MINE to be grilled, asserted by no one yet)

> The Topological Module is the seam where the engine's strictly-**accumulative, bijection-clean**
> genealogy first meets **lossy** operations. Ambo only ever *adds* (monotone, nothing discharged); the
> module is where *identification, collapse, and removal* enter — gluing makes two sites one, cutting
> makes a site a boundary, quotient collapses a class. Its deliverable is not the new shape but the
> **correspondence ledger**: a per-site before/after record, certified so that the carried charge
> (lineage) **descends faithfully** and every loss is **logged** — so the engine's history can finally be
> merged and cut **without fabricating identity**.

Provisional reason it is *topology* and not some other transformation: topological operations are exactly
the ones that change **identity and adjacency relations** without appeal to the metric — and the engine's
own notion of identity is combinatorial/derivational (lineage), not metric. Topology is the transformation
class native to a combinatorial-identity engine. (Offered as my reading; the sovereign's is what counts.)

## 3. The sharpest terminological confusions I already see (one word doing several jobs)

```txt
(A) "NAMED MATERIAL" / "the names" / "label-preserving"  — the central fork (initiation §4).
    It carries TWO objects: (1) the DERIVATIONAL charge (scope × lineage) — machine-made, present in every
    site now, the ONLY thing the registry + ledger actually operate on; and (2) AUTHORED semantic content
    (label/notes/tags/custom packet fields, "concepts/dwellings") — sparse, human, the semantic layer's.
    FINDING: everything BUILT lives on (1); the spec's and Ground Plan's prose ("where do names live after
    transformation") lives on (2). The faithfulness certifier is, by design, BLIND to (2) — it certifies
    lineage-homogeneity, not "the concept survived." So the names the module is *said* to preserve and the
    names it *actually* certifies may be different objects. This is the size↔derivation error's shape:
    one word ("name") standing for both a structural invariant and an authored overlay.

(B) "IDENTITY"  — overloaded across the very law the module is built around.
    STRUCTURAL identity = scope × lineage (built, in the certifiers). SEMANTIC identity = the thing the
    cardinal law denies to mere co-location (fused / aliased / constrained / conflicted / rejected — unbuilt,
    the semantic layer's verdict). The cardinal law "co-location ≠ identity" is stated with the SAME word
    the built layer uses for something else. The picture needs these named apart or the law and the code
    will keep talking past each other.

(C) "TRANSFORMATION" / "operation" vs "the ledger"  — anti-monster-relevant.
    What is built is NOT a transformation; it is a CERTIFIER over a *proposed* identification of existing
    sites. The §4 operations (glue/cut/fold/torus/…) are GATED + unbuilt. The picture must keep "the
    operation that mutates the complex" (future) distinct from "the law that certifies it" (built, read-only),
    or the gate gets crossed on paper.

(D) "DE-RIGIDIFICATION" (the bridge ruling)  — a tension to grill, not yet resolved.
    The IDENTITY model is ALREADY metric-free: lineage.ts excludes position; coincidence is only a heuristic.
    So if de-rigidification means "make identity non-positional," it may already be done; if it means
    "representation for genus/operations," it is a different, narrower need. Which one is the bridge claiming?
```

## 4. Where CONTEXT.md starts (proposed skeleton — populated only as the picture firms with the sovereign)

```txt
docs/CONTEXT.md  (the module's living picture; ADRs in docs/adr/ as decisions crystallise)
  §0  One true sentence: what the module IS (sovereign-endorsed) ......... [TBD — drawn in the loop]
  §1  Glossary, one-word-one-meaning: name vs lineage vs scope vs support; identity (structural vs
        semantic); transformation vs operation vs ledger; faithful; co-location. [seeded by §3 above]
  §2  The labelled cell complex model (entities the module imports + owns)
  §3  The cardinal law, made precise (co-location ≠ identity; the status vocabulary it feeds)
  §4  Built vs NEED vs GATED (Tier-1 floor refs; what exists, what is owed, what is forbidden-until-pressure)
  §5  Open picture-questions → ADR pointers
```

## 5. Discipline I will hold (so the mothership can check my seat)

```txt
- Three tiers strictly separate; I treat your readings AND this memo's framings as Tier-2 to grill, not
  Tier-1 to build on. I will not defend a reading on your behalf.
- Grounded, never free-floating; I mark NEEDs as NEEDs, never as facts.
- Closed verdicts honored; no dead vocabulary imported as alive (octonion/Fano, field, cut-elimination).
- Classify by the derivational invariant. I hone + document; I do not build, rule meaning, or prove —
  and honing the picture is NOT opening the module.
```

## 6. First ask to the sovereign (opening grill-with-docs)
Name THE GAP — the specific part of the module's picture that keeps failing to land. Candidates I surfaced
are (A)–(D) above; override freely with your own. Wherever you point, the loop and CONTEXT.md §0 start there.
