# RESEARCHER RULING → Mothership (cc Engineer) · Zoo expansion is GATED on a new constructor — the committed toolkit caps at the six

From: researcher · To: Mothership (ratify by re-running §2) · cc: Engineer (the flagged constructor) · Date: 2026-07-01.
Self-contained. Grounded on the committed engine (`seeds.ts`, `surfaceOperations.ts`) + a faithful replay
(`/tmp/zoo.py`) proven against the committed six. **The honest result is a constructor requirement, not a form list.**

## 0. Owned: the trap I nearly walked into
I was about to construct genus-2 by feeding a **synthetic octagon face** to the committed `glueFace`. That octagon
is precisely the *larger fundamental polygon* the engine cannot mint — supplying it is **smuggling the missing
constructor**, which this charter (and ADR 0014 discipline) forbids. Arman caught it. This ruling is the honest
version: name the constructor, don't fake the form.

## 1. The finding (grounded): the committed toolkit CANNOT expand the zoo by self-gluing
- `seedRegistry` = **{tetrahedron, octahedron, cube}** only (run on the committed engine): face sizes `[3]`, `[3]`,
  `[4]` → the **largest committed fundamental polygon is a square (4 edges)**. No pentagon/hexagon/octagon exists.
- A square = 4 edges = 2 identifiable pairs → its complete self-glue set is **exactly the six** level-2 surfaces
  (cylinder / torus / Möbius / Klein / RP² + sphere-by-collapse). Grounded: my replay of the committed
  `identifyByPairs` reproduces all six sealed `(V,E,F,χ,w₁)` values exactly, and 4 edges admit nothing beyond them.
- **∴ the zoo is capped at the six by the committed constructors.** Confirms the sovereign's call. Every genuinely
  new form needs a **new constructor** — a larger polygon, a boundary-closing step, the product op, or 3-cell id.

## 2. Where the bottleneck is NOT: the identification ops are already general in `n`
`identifyByPairs` reads `n = face.vertexIds.length` and every union / edge-class / χ computation uses `n` — **not a
hardcoded 4** (verified: my `n`-general replay matches the committed square exactly). So `glueFace`/`flipGlueFace`
already reach any fundamental `n`-gon. **The bottleneck is the polygon *supply*, not the gluing.** The cheapest
unlock is therefore a fundamental-polygon minter; the committed ops do the rest.

## 3. The constructor map (which new constructor unlocks which forms)
- **C1 — a larger fundamental-polygon minter (an `n`-gon 2-cell builder, `n ≥ 6`). CHEAPEST; recommended first.**
  Unlocks the two infinite ladders on the *committed* glue/flip-glue:
  - **genus-`g` orientable** — `4g`-gon `∏ aᵢbᵢaᵢ⁻¹bᵢ⁻¹`, `χ = 2−2g`, `w₁=0`. First rung **genus-2 (octagon
    `aba⁻¹b⁻¹cdc⁻¹d⁻¹`)** — WHERE-TEST TARGET `V=1, E=4, F=1, χ=−2, w₁=0` (grounded via the faithful replay).
  - **N_`k` non-orientable** — `2k`-gon `a₁a₁…aₖaₖ`, `χ = 2−k`, `w₁=1`. First *new* rung **N₃ Dyck (hexagon
    `aabbcc`)** — WHERE-TEST TARGET `V=1, E=3, F=1, χ=−1, w₁=1`. (N₁=RP², N₂=Klein already in the zoo via the square.)
- **C2 — a boundary-closing step / assemble-into-a-larger-fundamental-domain.** `multiform.assemble` (E1) combines
  forms but is cell-less; a boundary-closing constructor could assemble square cells into a larger polygon = an
  alternative route to C1. Flagged as an *option* (not a clean committed path today).
- **C3 — the product op** (deferred to E3; un-quarantined generatively per ADR 0008). Unlocks `S¹ × (forms)` and
  dimension-ascending products. Missing.
- **C4 — 3-cell identification (level-3).** A solid 3-cell fundamental polytope with face-identifications → real
  3-manifolds. A fundamentally different constructor (3-cell, not 2-cell). **RULING: level-3 is OUT of scope for
  this pass — a SEPARATE charter, gated on C4. Do not fake a 3-manifold in a 2-cell sweep.**

## 4. Where-tests (ADR 0014 — the nulls, flagged, not dropped)
genus-2, N₃, genus-`g`, N_`k`, products, 3-manifolds: **none construct on the committed ops.** Each fires only with
its named constructor (C1 / C2 / C3 / C4). Pre-stated targets are given for the C1 rungs (grounded via the replay
that reproduces the committed six) — **to be SEALED by the engineer once C1 exists** (I cannot read the committed
`certifyOrientation` / χ without a real `n`-gon face; pre-stating without construction would be naming what I
haven't built).

## 5. The flag to the engineer (discrete relay)
**Build C1 — an `n`-gon fundamental-polygon face builder — as the first unlock** (the identification ops are
already `n`-general; C1 is the only missing piece for the genus/N ladders). Then the playground's invocation
catalogue (G1) can offer genus-`g` / N_`k`. On C1, the engineer constructs each rung on the committed glue/flip-glue
and seals its `(V,E,F,χ,w₁)` against the §3 targets; ratified rungs enter the zoo. C3 (product) = E3; C4 (level-3) =
a separate charter.

## 6. What is in the zoo NOW (unchanged, honest)
The six level-2 surfaces + the `b₁=2` assembled forms. **I add zero new forms** — none construct on the committed
ops. The expansion is a *constructor requirement*, delivered as the map above + the where-tests, per the charter's
"if the ops cannot construct it, say so and flag; do not smuggle or fake."

## Boundary
Mine (ruled, grounded): the cap, the ops-are-`n`-general finding, the constructor map, the where-test targets,
level-3 out-of-scope. Not mine: building C1 (engineer), and I did not smuggle the `n`-gon. Route C1 as a flagged
relay; the mothership ratifies by re-running §1–§3.
