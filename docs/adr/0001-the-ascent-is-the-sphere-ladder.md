# 0001 — The ascent is the sphere ladder; inhabitants are the manifold zoo

The Topological Module's **levels** are indexed by dimension, with the n-sphere Sⁿ as each rung's emblem (the sphere ladder S⁰ → S¹ → S² → …). The **life-shapes** inhabiting the levels are the closed and bounded manifolds obtained by identifying the boundary of imported ambo cells (fundamental polytopes), closed under products: orientation-**preserving** identifications give sphere / cylinder / torus; orientation-**reversing** identifications (flips) give Möbius / Klein bottle / RPⁿ; collapsing a whole boundary to a point gives a sphere.

## Considered options

- **Manifold zoo via orientation-aware boundary identification + products (chosen).** One generator: an imported cell modulo a boundary-identification pattern, closed under products.
- **Orientable product-world only (rejected).** Intervals × circles (lines, cylinders, tori) — too narrow; the life explicitly includes non-orientable and projective shapes (Möbius, Klein, RPⁿ), which require orientation-reversing gluing and boundary-collapse beyond extrude+close.

## Consequences

Relations the module records are **orientation-aware** — a flip-glue carries a sign/twist, not bare identity. The engine's oriented cell boundaries (edge `sourceVertexIds`, face vertex-cycles) are the substrate; the committed quotient ledger already models identification (set-valued pull-back), gated from enacting it.
