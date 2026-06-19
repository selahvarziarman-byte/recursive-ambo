# PlatonicEngine — Transformation Ledger & Lineage-Descent Faithfulness Law v0 (Canonical Build Surface)

Authored by: the researcher seat. Ratified + recorded by: mothership, 2026-06-19. Branch `team-arman`. Status: **ratified spec, build-pending — the engineer's authoritative build surface for Target 2.** Transformation-only; certifies STRUCTURE (lineage descent + logged loss); asserts no names and no truths; never fabricates identity.

**Naming note (mothership ratification correction).** The researcher's draft titled this the "intelligibility law." Corrected: it is the **Lineage-Descent / Faithfulness Law**. The ledger certifies a *structural* property (lineage descends, losses are logged); "intelligible" is the north-star *semantic* word, and that verdict belongs to the downstream semantic layer, not this certifier. Per-site verdict is **lineage-homogeneous / lineage-heterogeneous** (faithful / unfaithful) — never "intelligible / unintelligible."

Report these status lines; do NOT use metatheory vocabulary:

```txt
method               = transformation-ledger-v0
scope                = transformation-only
semanticStatus       = not-semantic-naming
shapeMutationStatus  = not-shape-mutation
```

## 1. The ledger (the object)
A transformation `T : complex → complex` carries a ledger = the dual's `SemanticDualModel` six maps, generalized:

```txt
forward   :  each source site → its image result site, or ∅ (removed)     [a PARTIAL function]
pull-back :  each result site → the SET of source sites it absorbed        [set-valued]
```

The dual is the bijective baseline (forward and pull-back both bijections; every pull-back a singleton). The lossy primitives are deformations of exactly this:

```txt
glue      :  some pull-back set has size > 1          (forward non-injective)
quotient  :  pull-back sets = the classes of an equivalence ~   (glue scaled to a relation)
cut       :  some source has image ∅                  (forward NON-TOTAL [corrected from "non-surjective"]; a logged removal)
```

So glue / quotient / cut are not three operations — they are three ways the one ledger departs from the bijective dual.

## 2. The carried charge
```txt
site identity = scope × lineage.
  lineage = the conserved CHARGE — it must DESCEND across the ledger.
  scope   = survives as the PULL-BACK — the set of source scopes a result site absorbed.
Identity is preserved by BACK-REFERENCE, not embodiment (the dual mints a fresh scope and points back).
```

## 3. THE LAW
`T` is FAITHFUL iff all three hold:

```txt
(I)  HOMOGENEITY  (glue / quotient).  Every result site's pull-back set is LINEAGE-HOMOGENEOUS: all absorbed
       sources share one lineage μ → the result inherits μ; its absorbed scopes are recorded as the pull-back.
       A heterogeneous pull-back = carried content destroyed → flag status 'lineage-heterogeneous'
       (NOT "unintelligible"; the semantic layer decides what a heterogeneous merge MEANS).
(II) LOGGED LOSS  (cut).  Every source with empty image is RECORDED as removed. A silent drop = unfaithful;
       a logged removal = a faithful, named loss.
(III) HONESTY.  The ledger CERTIFIES (I) and (II); where they fail it returns an explicit
       'lineage-heterogeneous' / 'removed' status and NEVER fabricates an identity or silently drops content.
       (The ^inc/^tri posture carried from generation into transformation: certify structure, never assert
       what the sources do not entail.)
One law: glue/quotient are clause (I); cut is clause (II).
```

## 4. The spectrum, and the maximal lineage-preserving quotient
A quotient by `~` is faithful iff `~` refines lineage-equality — equivalently, lineage descends to the quotient (the universal property, with lineage as the function that must descend; verified).

```txt
identity (the dual)   keeps scope × lineage in full                        — bijective baseline
lineage-equality      the MAXIMAL faithful quotient: projects scope × lineage ↦ lineage, collapsing each
                      lineage-class to one site (the lineage-grain complex); scope recoverable via the
                      set-valued pull-back
anything coarser      merges distinct lineages → lineage-heterogeneous
```

## 5. Coincidence — bounded (NOT the criterion)
The law is stated purely in lineage and the ledger; it does not mention position. Geometry enters only as a **certified heuristic**, in three strictly separated tiers:

```txt
General law         :  LINEAGE-HOMOGENEITY is the criterion.                          (geometry-independent)
Measured corollary  :  on the tested body, lineage-equality = position-coincidence    (verified both directions)
Geometry-dependent  :  naive coincident-vertex collapse is a SAFE shortcut for finding the identification ONLY
   heuristic           WHEN coincidence ⇒ lineage-equality. Under a degenerate seed where distinct lineages
                       occupy one point, naive collapse is UNSAFE — but the LAW SURVIVES (it flags the
                       heterogeneous class); only the coincidence shortcut fails.
Coincidence PROPOSES identifications; the homogeneity certificate RATIFIES or REJECTS each. Never the criterion.
```

## 6. Report contract (the certificate)
```txt
per result site :  pullBackScopes, lineageHomogeneous, inheritedLineage | lineageConflict,
                   status ∈ { lineage-homogeneous, lineage-heterogeneous }
per cut source  :  removed, logged ∈ { true, false }
aggregate       :  resultSiteCount, homogeneousCount, heterogeneousCount, removedLoggedCount, removedSilentCount
operation status:  FAITHFUL  iff  heterogeneousCount = 0  AND  removedSilentCount = 0
```

## 7. Numbers the diagnostic must reproduce (grounded on real sites + simulations)
```txt
- dual probe          : transformed sites carry identity by BACK-REFERENCE, not embodiment (ref-only).
- glue, B-twin pair   : same lineage, different scope → lineage-homogeneous (faithful; lineage survives, scope → 2-set).
- glue, diff lineage  : (+X+Y) vs (+X−Y) → lineage-heterogeneous, flagged, no fabricated identity.
- quotient            : 44 sites → 40 lineage-classes (4 B-twin classes collapse); every class homogeneous → faithful.
- coincidence (body)  : lineage-equal ⟺ position-coincident, both directions.
```

## 8. Build scope (anti-monster intact)
```txt
BUILD:  src/lib/transformationLedger.ts  — the six-map correspondence (generalize the dual's bijection to a
        set-valued pull-back) + the homogeneity / logged-loss / honesty certificate.
        scripts/diagnose-transformation-ledger.cjs + a "diagnose:transformation-ledger" package script.
TEST ON:  the BUILT dual (SemanticDualModel, real) + SIMULATED glue/quotient/cut of EXISTING sites
        (real B-twins via dissecting two edge-sharing cells; real different-lineage pairs).
DO NOT BUILD:  the topological OPERATIONS themselves (the actual glue/cut/quotient that transform complexes)
        are GATED behind M7/T0. You build the LEDGER + CERTIFIER, exercised by simulation — not the module.
```

## 9. Open / bounded (do not inflate)
```txt
- glue/quotient/cut OPERATIONS are unbuilt (gated); this is their ledger + law, tested by simulation.
- multiset-injectivity proof OPEN (working foundation; the lineage-equality test is operationally sound via
  decidable nested-tree comparison — the open proof only bears on whether lineage-equality is the COMPLETE identity check).
- the coincidence corollary is geometry-dependent + verified-not-proven; it is explicitly NOT part of the law.
```

## 10. Build notes (mothership)
Model the module on `src/lib/siteWitnessCatalogueV0.ts` / `src/lib/incidenceTraceRegistry.ts` (pure read-only over a Shape, typed report with `issues[]`, mutates nothing, names nothing). The ledger ANCESTOR to lift is `src/lib/dualization.ts`'s `SemanticDualModel` — its six bijection-enforced maps (it throws on a non-bijection); generalize the bijection to the set-valued pull-back. The diagnostic copies the v0 harness, requires the REAL module + the dual (anti-mock guard), builds fixtures, simulates the three primitives over existing sites, and asserts §7. Classify by the **derivational invariant (lineage)**, never a body-specific geometric proxy — the principle banked at the registry's P2 (size↔derivation is a per-body accident) applies here in full.
