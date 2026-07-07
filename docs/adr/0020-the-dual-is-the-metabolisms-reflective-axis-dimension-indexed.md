# 0020 — The dual is the metabolism's reflective axis, dimension-indexed (surface n=2 / cell n=3); reuse the correspondence, build a general extractor

Status: **Accepted** — researcher-defined (Q6), mothership-ratified + scoped, 2026-07-04. Surface-dual build authorized (route a); engineer to build.

## Context
The metabolism op-set has identification (climb the sphere ladder) and product (add dimensions, deferred). The **dual** is the third axis — **reflection** (Poincaré duality, k ↔ n−k). The committed `dualization` was 3-cell/polytope-based and had **no target** while the playground held only surfaces; level-3 (3-manifolds) and the Q6 surface-dual ruling reopened it.

## Decision
- **The dual is Poincaré duality, dimension-graded — the level-k member swaps k ↔ n−k:**
  - **Surface dual (n=2): V\*=F, E\*=E, F\*=V** — for sound closed **2-manifolds**. Homeomorphic re-cellulation (`M\*≅M`); **χ, w₁, genus, H₁ all preserved**. The **involution `M\*\*=M`** is the falsifiable correctness check. *(Q6 — build authorized.)*
  - **3-cell dual (n=3): V\*=C, E\*=F, F\*=E, C\*=V** — for closed **3-manifolds**; the committed `dualization`'s dimension. Un-defers at level-3 (dualize the 3-torus etc.). *(Companion, engineer-sequenced, not yet built.)*
- **Gated on the committed soundness at each dimension** — the surface dual requires every vertex-link `decomposeLink='interior'` (S¹) and every edge in exactly 2 faces; **undefined on bounded / non-manifold input — refuse, never fake.** The whole committed surface zoo (torus/Klein/RP²/genus-g/N_k) passes → all dualizable.
- **Genealogy:** `M\*` is a **single-parent, NON-consuming** child of `M` (`operation='dualization'`, `parentShapeId=M.id`, depth+1) — a re-cellulation, so `M` and `M\*` coexist. **Lineage carried-not-minted by the bijective correspondence** — every dual cell back-references exactly one source cell (the cleanest carriage; the dual is the ledger's "hinge").

## The reuse seam (grounded correction — the honest build split)
The committed `dualization.ts` is **not** reusable on a general surface — grounded twice (mothership + the in-tree coder, who caught an over-optimistic "reuse verbatim" build mandate; the honesty bar held):
- Its entry `buildPyritohedralIcosahedronSourceTopology` **hard-refuses anything but the pyritohedral icosahedron** (12v/20f/30e/degree-5 → else `null`), and its output is a 3-cell `Cell`, not a 2-complex.
- **Its internal construction helpers are ALSO walled** — `createDualVertices` / `buildDualFaceEntries` / `orderIncidentSourceFaces` are **module-private** AND hard-guarded to **degree-5 pyritohedral vertices** (`:527` "expected five incident faces", `:574` "not a five-cycle") AND **endpoint-keyed** (`:563` — which *fuses quotient self-loops*, wrong for identified forms). They cannot touch a cube corner, let alone a quotient surface.
- **REUSE (only the genuinely public):** the committed **`decomposeLink` gate**, the lineage helpers (`deriveFaceLineage`/`packetSourceRef`), the `dualization` OperationKind, and the correspondence *naming/concept* (V*↔F/E*↔E/F*↔V).
- **BUILD NEW (fresh module — `surfaceDual.ts` for n=2):** a **general** topology extractor (any sound closed n-complex → the incidence, gated on the committed soundness), a **dimension-appropriate output** (a 2-complex for the surface dual; a 3-cell path for n=3), + playground wiring. **Delivered + ratified 2026-07-04** (`surfaceDual.ts`; `M**=M` + χ/w₁ preserved across the whole zoo — torus self-dual, Klein, RP², genus-2; non-consuming `dualization` birth).

## Consequences
- The metabolism's reflective axis is completed at n=2 (build authorized); n=3 is a ready companion.
- `M\*\*=M` is the build's ratification gate (a wrong dual fails self-inversion).
- The L3 **field re-indexes** under the dual (vertex-data ↔ face-data via V↔F; `w₁`/`Σ`/eigenmodes preserved since `M\*≅M`) — the field seat's item, flagged, not part of the op.
