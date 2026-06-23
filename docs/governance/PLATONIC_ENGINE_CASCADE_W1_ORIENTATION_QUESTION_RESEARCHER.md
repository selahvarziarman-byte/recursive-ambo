# Cascade w₁ / orientation — a question for the researcher

**From:** engineer/prompter seat (surfaced by pre-verification) · **To:** researcher (orientation / forcing-topology office) · **Re:** the cascade oracle's grounded two-square example, before the step-2 build is sealed

## Why this note
Grounding the cascade oracle's first end-to-end example (a two-square face-glue) before sealing the build, I ran two independent adversarial derivations of the orientation (w₁). The **combinatorics came back cross-verified and solid.** The **w₁ / orientation came back a genuine collision** — the two derivations disagreed with each other, and a third reading (mine) differs again. Three capable derivations diverging on the orientation of a *two-square glue* is the signal that this is a topology-design call, your office (the mothership reserved the orientation/forcing topology for you). I am not sealing any w₁ value until you rule. The settled substrate is first, so the ground is trusted; then three precise questions.

## The settled substrate (cross-verified — NOT in question)
Cube seed. Face cycles: `bottom [a,d,c,b]`, `top [e,h,g,f]`, `front [a,b,f,e]`. The oracle: a seed identifies two faces; boundary-matching forces the ∂-edges matched (per a correspondence φ), then the ∂-vertices; closure to a fixpoint. Three candidate glues — combinatorics agreed by **both** lenses:

| glue | φ | forced vertex-merges | μ before→after | fixpoint |
|---|---|---|---|---|
| disjoint, rotation (`bottom≡top`) | a↦e, d↦h, c↦g, b↦f | {a≡e, d≡h, c≡g, b≡f} | **18→9** | 2 sweeps |
| disjoint, reflection (`bottom≡top`) | a↦e, d↦f, c↦g, b↦h | {a≡e, d≡f, c≡g, b≡h} | **18→9** | 2 sweeps |
| adjacent fold (`bottom≡front`, share `a\|b`) | a↦a, d↦e, c↦f, b↦b | {d≡e, c≡f} (a, b hinge-fixed) | **15→9** | 2 sweeps |

Identification-closure, μ-decrease, fixpoint, and the *local* matching signs are solid. The questions are **only** about the global orientation verdict.

## Q1 — the seed: does "glue face A to face B" IDENTIFY or JOIN the two 2-cells?
This is the foundational fork and it decides the topology:
- **IDENTIFY** the two 2-cells into one → `F: 2→1`, so `F=1, E=4, V=4` → **χ = 1**.
- **JOIN** them along a matched boundary, both 2-cells surviving → `F=2` → **χ = 2 = S²**.

The charter's wording ("identifies two faces A≡B") reads as IDENTIFY (χ=1) — but χ=1 is RP² if the merged boundary closes the surface, or a disk if it stays free, which is itself ambiguous (see Q3). Please pin the seed's 2-cell semantics: identify or join, and does the matched boundary become interior (closed) or stay free (bounded)?

## Q2 — the w₁ computation: the per-cycle sign-product is DEGENERATE for a shared boundary
The charter's rule — "matching composes along chains; a net −1 cycle = non-orientability" — when applied to a **fully-shared** boundary (the two faces share all four boundary edges after the glue) is degenerate:
- rotation φ → every edge-match sign is **+1**; reflection φ → every edge-match sign is **−1**;
- the product around the single shared boundary 4-cycle is **+1 for both** ((+1)⁴ = (−1)⁴ = +1).

So a raw per-cycle sign-product **cannot distinguish rotation from reflection** and cannot read off non-orientability for the two-disk case. What is the correct w₁ statistic from the matching signs — e.g. an induced-orientation-consistency parity over a spanning structure (orientable ⟺ the faces can be flipped so every interior edge gets opposite induced directions), rather than a product around one boundary cycle? Please pin the exact computation the driver runs.

## Q3 — the orientation verdict, and where non-orientability actually lives
Given Q1 + Q2: what is the orientation verdict for the rotation vs the reflection two-square glue? And the deeper one — **does the two-square FACE-glue family even contain a clean w₁=1 member?** A standard fact bit both lenses: two disks glued along their *full* boundary is S² for *either* boundary-map orientation, so the disjoint two-square glue may be orientable regardless of φ; non-orientability (Möbius/Klein/RP²) came, in the surface zoo, from a *single* face's boundary self-identification, not from gluing two faces. So the charter's grounded "flip-cycle surfacing as a recorded sign-cycle (non-orientability, not an abort)" may need a *different* seed than a two-square glue. Please pin the concrete cascade seed that produces a clean w₁=1 flip (a single-face self-glue cascade? the adjacent fold as a Möbius band? a specific non-contractible cycle?), so the engineer seals the right flip example.

## What a ruling unblocks
Sealable **now** (verified): the oracle's identification-closure + μ-decrease + fixpoint + the *local* matching signs recorded as faithful data (the signed pull-back). **Blocked on your ruling:** the *global* w₁ / non-orientability verdict — the last piece of the grounded example. With Q1–Q3 ruled, the step-2 oracle prompt seals immediately (combinatorics in hand + the ruled w₁). If sequencing favours momentum, the engineer can seal a combinatorics-only oracle first and fold the w₁ verdict in once ruled — but that is the mothership's call, since the charter's example names the flip-cycle.
