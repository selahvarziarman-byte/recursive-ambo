# 0002 — The module is a manifold factory, not a cell-complex factory

Every life-shape is a **manifold** — an imported cell modulo an orientation-aware boundary-identification pattern, closed under products — spanning the full zoo: orientable (sphere, cylinder, torus), non-orientable (Möbius, Klein bottle), projective (RPⁿ).

## The explicit no

Excluded: branched / non-manifold complexes (e.g. three sheets meeting along one edge), wedges, and open-ended gluings that leave non-manifold points. The module produces closed-and-bounded manifolds only.

## Why it matters

The manifold restriction keeps the construction a closed-form generated family (classifiable, finite per level) rather than the open-ended world of arbitrary CW complexes. It also makes every identification checkable for the manifold condition (boundary cells identified in pairs, or a whole boundary collapsed) — which the engine's incidence data already supports: the committed registry's `GlueCoh` already grades a site `glued` vs `non-manifold-overlap`, and each edge-midpoint already has manifold 2-incidence (core + 2 residues).
