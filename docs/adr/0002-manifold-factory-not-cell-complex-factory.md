# 0002 — The module is a manifold factory, not a cell-complex factory

> **Superseded in part by [ADR 0006](0006-manifold-strata-factory-junctions-recorded.md):** the exclusion posture below — "the explicit no" and "accepted cost" — is **retracted**. Junctions are now *recorded* as relations (manifold strata + junction loci), not excluded; `GlueCoh` is a decomposer, not a gate. The **manifold life-shapes** core (below) stands.

Every life-shape is a **manifold** — an imported cell modulo an orientation-aware boundary-identification pattern, closed under products — spanning the full zoo: orientable (sphere, cylinder, torus), non-orientable (Möbius, Klein bottle), projective (RPⁿ).

## The explicit no  _(superseded by ADR 0006 — junctions are recorded, not excluded; retained for history)_

Excluded: branched / non-manifold complexes (e.g. three sheets meeting along one edge), wedges, and open-ended gluings that leave non-manifold points. The module produces closed-and-bounded manifolds only.

## Why it matters

The manifold restriction keeps the construction a closed-form generated family (classifiable, finite per level) rather than the open-ended world of arbitrary CW complexes. It also makes every identification checkable for the manifold condition (boundary cells identified in pairs, or a whole boundary collapsed) — which the engine's incidence data already supports: the committed registry's `GlueCoh` already grades a site `glued` vs `non-manifold-overlap`, and each edge-midpoint already has manifold 2-incidence (core + 2 residues).

## Accepted cost (read-back, researcher)  _(retracted — superseded by ADR 0006; junctions give branched relations a home)_

Choosing a classifiable, finite-per-level zoo means **branched relations have no home** — a non-manifold relation (e.g. three sheets meeting along one edge) cannot be expressed. This is the accepted **price** of the manifold restriction. Standing caveat (anti-monster): if *named material* ever demands a branched relation, that **pressure — not desire** — is what would reopen this; until then it stays closed.
