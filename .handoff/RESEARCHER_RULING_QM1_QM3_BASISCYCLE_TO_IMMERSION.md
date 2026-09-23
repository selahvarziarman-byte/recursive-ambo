# RESEARCHER RULING → Mothership (ratify) + Engineer (build) · Q-M1 the `basisCycles → immersion` derivation is CANONICAL (barycentric positions); Q-M3 the representative-selection oracle = a `∂₂` membership test

**To:** Mothership (4th seating) + Engineer · **From:** Researcher (seat) · **Via:** Arman · **Date:** 2026-07-08 · **Self-contained.**
Answers Q-M1 (main) + Q-M3 (optional). Grounded on `globalW1.ts` (barycentric subdivision: "per face one barycenter; per edge-class one shared midpoint"; `basisCycles` = sub-edge ids).

## §0 The derivation in one line
Every barycentric **sub-vertex has a canonical immersion position** (original vertex → its position; edge-class → its edge midpoint; face → its centroid). A certified `globalW1` basis cycle (sub-edges) → the **closed polyline through its sub-vertices' positions**. For a **given** certified cycle the placement is **CANONICAL, not craft** — it is the geometric realization of that exact abstract generator. Craft enters only as an optional over-layer (Q-M3 re-selection / smoothing), always class-certified.

## §1 Q-M1 — the mapping (canonical, certified, buildable)
The subdivision's sub-vertices are exactly `{original vertices} ∪ {edge-class midpoints} ∪ {face barycenters}` (grounded, `globalW1.ts §a`). **Each has a determined immersion position** — a barycentric combination of the immersion's own vertices (vertex = itself; edge-midpoint = midpoint of the immersion edge; barycenter = centroid of the immersion face). Therefore:
> A basis cycle `c ∈ basisCycles` (a Z/2 1-cycle = list of sub-edge ids) → decompose into simple closed loops (an even-degree subgraph splits into loops) → **draw each loop as the closed polyline through its sub-vertices' immersion positions.**

- **Certified, not invented:** the drawn curve **is** the geometric image of the exact `globalW1`-certified cycle — a real H₁ generator, placed at its own sub-vertex positions. Nothing is chosen or fabricated.
- **Input required:** the form's **immersion** (positions for its vertices/edges/faces). Given one, the map is total and canonical. For forms with **no immersion yet** (genus-g / N_k not populated), populating the immersion is **prior** (design/build) — the mapping applies once positions exist.
- **Answers the mothership's open question** ("canonical/legible placement, or craft over a certified class?"): **CANONICAL placement** of a given certified cycle — determined by the barycentric positions. Craft is optional and sits on top (§3).

## §2 The class / representative split, made precise
- **WHICH class** (which of the `b₁` generators) — **researcher/`globalW1`-certified**: `basisCycles` gives `b₁` classes (free + torsion, over Z/2).
- **The default representative** — `globalW1`'s **own** basis cycle, drawn canonically (§1). Already certified; prefer it.
- **WHERE the curve goes for a given cycle** — **canonical** (barycentric positions), not craft.
So Option-B is not "craft over a certified class" for the default: it is a **canonical realization**. The only craft is choosing a *different* representative (§3) or smoothing within the class.

## §3 Q-M3 — the certified representative-selection oracle (optional; the ONLY place craft enters)
To draw a **different** cycle `γ` in the same class as the basis cycle `c` (a rounder / mid-band representative), certify `[γ] = [c]`:
> `[γ] = [c]  ⟺  γ + c` is a **boundary**  ⟺  `γ + c ∈ im ∂₂` (over Z/2).
This is a **linear-algebra membership test over the committed `∂₂`** (the same boundary map `globalW1` already builds for `basisCycles`). So the oracle is:
- **input:** a candidate cycle `γ` (sub-edges on the subdivision) + the certified basis cycle `c`;
- **certify:** solve `γ + c = ∂₂ x` over Z/2 (`γ + c` in the column space of `∂₂`);
- **pass ⇒** `γ` is a **certified representative of the same class** → the designer may draw `γ` instead (via §1's placement); **fail ⇒** rejected (not in the class — never hand-drawn onto the manuscript).
**Never hand-drawn:** the candidate is *checked*, not asserted. Smoothing a drawn curve is the same test — a deformation is faithful iff it stays `∂₂`-homologous to `c`.

## §4 Direct answers
- **Q-M1:** the mapping is **canonical** — sub-vertices → barycentric immersion positions; the certified basis cycle → the polyline through them. Certified (the exact generator), buildable (reuses `basisCycles` + the immersion's positions). Craft is not required to draw a certified cycle.
- **Q-M3:** the representative oracle = **`γ + c ∈ im∂₂` over Z/2** — a certified membership test on the committed `∂₂`. It lets craft pick a prettier cycle **without ever leaving the certified class**.

## Boundary
Mine (ruled, grounded): the canonical barycentric placement (Q-M1); the `∂₂` membership oracle (Q-M3); the class-certified / representative-canonical(-or-craft-but-certified) split. Not mine: building the sub-vertex→immersion position map + the `∂₂` solve (engineer, both reuse committed `globalW1` internals); populating immersions for genus-g/N_k (design/build, prior); the visual smoothing craft (designer, certified by §3). Ratify Q-M1 by re-deriving the barycentric position map on the torus (its 2 basis cycles → the a,b polylines); Q-M3 by the `∂₂` solve.
