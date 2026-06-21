# 0006 — Manifold-strata factory: junctions are recorded, not excluded (GlueCoh is a decomposer)

The "instruments, not guards" principle (ADR 0004) governs the **whole** picture, not just the systemic closure. ADR 0002 still wrote `GlueCoh` as a **gate** — non-manifold complexes excluded, "branched relations have no home." That is the guard posture ADR 0004 retired. Propagated one step, the gate becomes a **decomposer**: a >2-sheet junction is not excluded, it is **recorded** — split into **manifold strata + a junction locus**.

So the module is not a manifold-*only* factory that excludes non-manifolds; it is a **manifold-strata factory** that **records junctions as relations**. The **life-shapes stay manifolds** (still classifiable); the **relations admit junctions**. Nothing is silently excluded — that is the honesty discipline, not a loosening of it.

## What this supersedes (ADR 0002)

- "The explicit no" (non-manifold complexes excluded) → **retracted**: junctions are recorded (strata + locus), not excluded.
- "Accepted cost" (branched relations have no home) → **superseded**: both technical seats retracted it; junctions give branched relations a home.

## The valence axis (per locus of the post-identification link)

```txt
valence 1  = boundary  (a free edge, from a cut)   — manifold
valence 2  = interior  (two sheets meet)           — manifold
valence >2 = JUNCTION  (d sheets meet)             — non-manifold, RECORDED (not excluded)
```

Junctions arise **only on the post-identification (quotient) link**; the rigid substrate link is always one closed cycle (valence 2). `GlueCoh` already builds this link-graph — it currently **stops at a boolean** where it should **emit a partition** (manifold strata + junction loci). The engineer confirms the **signed pull-back and the junction are one build**: a junction is a **>2-valent pull-back** — set-valued at the vertex, signed-non-manifold at the edge.

## Two orthogonal axes

```txt
VALENCE       : manifold (≤2) ↔ junction (>2)                       — a STRUCTURAL property, always RECORDED
FAITHFULNESS  : lineage-homogeneous ↔ heterogeneous; logged ↔ silent — where CLASHES live
orientation   : faithful DATA — w₁ on the strata, a signed incident set at junctions
```

The axes are orthogonal: a junction may be lineage-homogeneous or heterogeneous. **A junction is recorded structure, never a clash**; clashes are faithfulness failures only (lineage-heterogeneity; sign-contradiction — the degree-1 analogue).

## RESOLVED by ADR 0007 — what is a *stratum*?

**Ruled 2026-06-21 (ADR 0007): a stratum is the canonical component (horn a); the through-pairing is a deferred named policy = `GlobalSquareResolution` generalized (horn b). The sign never fixes the pairing (verified).** The original open framing is kept below for history.

The mothership held the build charter behind this one question. Two horns, and the build's cost rides on the answer:

```txt
(a) CANONICAL COMPONENT — a connected component of the link cut at its junction loci.
      GlueCoh builds it directly, no policy; the build is FREE at the base.
(b) POLICY-PAIRED SHEET — pairing the d incident sheets THROUGH a degree-d junction:
      (d−1)!! choices the link graph alone does not fix; needs the sign data, or a named global
      policy structurally identical to the GlobalSquareResolution (GSR) already built.
```

Material to **test** in the grill (not a foregone answer): the committed registry already runs an **atomic-incidence (policy-free) + named-global-policy (GSR)** architecture, so the candidate is whether the junction-decomposer should **mirror** it — canonical base, deferred pairing. The grill decides whether that precedent actually applies.
