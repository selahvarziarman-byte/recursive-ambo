# PlatonicEngine — W-Gate Researcher Calibration Submission

## The theorist's seat reports for calibration, before the W-0 model card

Audience: mothership (acknowledging authority) and the human (Arman, sovereign). For the lieutenant's awareness.

Status: **researcher calibration submission — DRAFT, NOT a model card, NOT a claimed result.** Per §7 of the Researcher Initiation, this reports my understanding before production and HOLDS at the gate: I do not produce the candidate-W model card until mothership acknowledges this calibration. Nothing here is hash-committed; §6 previews values I *intend* to seal in the model card, not before.

Repo identity (mandatory preamble): canonical `C:\Dev\202cl\PlatonicEngine202`, branch `Claude-child`. Decoy `C:\Dev\PlatonicEngine` is NOT this project and is ignored.

Issued: 2026-06-13. By: researcher, on the Source-Regime Reset and the Abductive Research Gate ruling (both 2026-06-13).

---

## 0. What I read, and the discipline I read it under

Tier 1 (charter): the Researcher Initiation, the Source-Regime Reset ruling, the Ground Plan. Tier 2 (results I may not contradict): CBF Gate-0 closing memo (quaternionic observable), Station IV-A closing memo (propagation negative), Station III Bench-2 D3 (60° / vector equilibrium / A₃), the campaign closing memo + the Closure Consciousness Clause. Tier 4 (code, as factual authority): `seeds.ts`, `ambo.ts`, `hubLayerSourceStateCapsuleV0.ts`, `moufangHolonomyValidityV0.ts`, `octaFirstBirthCarrierBaseV0.ts`.

I write under the Closure Consciousness Clause. A candidate W is never a possessed field law. "Legitimate source regime" and "field-observable regime" are distinct possessions and are kept separate throughout. W_0 is the floor: source-state-real (as structure), quaternionic-observable, field-inactive under the accepted emission stack — and the central object (a carrier/fiber observable field) remains **not possessed**.

---

## 1. (a) The object of research, in my own words

The Ambo births one midpoint per parent edge. In the code, that midpoint is given exactly two things by the operation itself: a **position** (the edge midpoint) and an **unordered parent pair** `createdBy.sourceVertexIds = [a, b]` (`ambo.ts` lines 105–120). Everything else a "source" is later said to carry — a direction `a→b`, a carrier/state, a reverse law, an inheritance from its parents — is **structure we add on top of the birth**. The birth does not hand us a directed relation; `canonicalEdgeKey(a,b)` is order-independent. Direction, and all algebra, is imposed afterward.

The old regime W_0 added: *source = octonion unit; child = product of its parents' units; emission = a reduced scalar tuple.* That addition proved **real as source-state structure** and **generalized** across the tetra–octa–cube medial hub at root-level (R12) resolution — it reproduces the hub's order-2 and order-3 invariants, gauge-invariant across the 7×24 = 168 Fano labelings (D1, D3). It then hit a hard two-sided boundary: (i) its only well-defined holonomy observable is **quaternionic**, confined to Q = {e3, e5, e6}, because every hub link is a product of two primal-quadrangle units {e1, e2, e4, e7} and such products fill the complement line Q, which is an associative quaternion subalgebra — so octonion non-associativity is dormant; and (ii) under the accepted emission stack it is **field-inactive**: the field broadcasts one complex coefficient per source, so the unit content, signs, and flag identities are never emitted, and a label-blind observer recovers nothing of the fiber.

So the research object is this: **what minimal, coherent regime of state-plus-relations must we attach to recursive Ambo births so that the generated children are *legitimate* sources** — born from the right parents and relation, with coherent directed walks, preserved angular geometry (60°, not 90°), and with antipodality, complement, and loop-closure **derived from the regime rather than inserted by hand** — correctly counted under a declared population policy and equivariant under the symmetry? And only afterward, separately: can a declared reduction of that richer state be made **observable** by a field law, directly or mediated, under blind recovery?

The reframing I take seriously, and state as my working thesis, is an **inversion of primacy**. W_0 treated the source's *state* as primitive (a unit) and relations as derived (products). The reset asks me to treat the *walk regime* as primitive — a basepoint carrying directed relations with real angular geometry — and the algebraic "state" (a unit, a carrier) as a **derived shadow** of that walk regime. The object of research is the law of that inversion on the lineage G0 tetra (4) → G1 octa (+6) → G2 cuboctahedron (+12), and whether it buys legitimacy that W_0's posture could not, without (a) regressing below the W_0 floor or (b) discarding the only structure that was ever field-testable.

---

## 2. (b) The single hardest sub-problem

**Reconciling the angular (walk) product law with the algebraic (carrier) product law — deriving antipodality, loop-closure, and the 60° metric as consequences of ONE walk-composition law whose octonionic shadow is richer than quaternionic — without that law collapsing back into W_0.** The reverse/return law is its sharpest finite probe.

Why this one, above the others:

- **It is upstream of everything.** The reset's own sharpening (absorbed from the suspended Station F-I) is that a link variable cannot be derived until the walk law that defines it is abducted. Source ontology, inheritance, and any field observable all sit downstream of how two walks compose. If the angular product law is wrong or arbitrary, nothing below it is legitimate.

- **It is where the two things we trust collide.** Everything that proved *testable* came from the algebra (Fano products, A₃ roots, the quaternionic holonomy). Yet Bench 2 derived the 60°/vector-equilibrium metric **from carrier-derived anchors** u_i − u_j, never from canonical cuboctahedron coordinates — so metric and algebra were already entangled in W_0. To make the walk/angular layer primitive, I must show the angular composition *lands exactly on* the Fano product when restricted to the lineage's edges — i.e. that "rotate by 60° along an A₂ great circle" and "multiply by the next unit on the Fano line" are **one law in two guises**. The repo half-shows the bridge: in `octaFirstBirthCarrierBaseV0.ts` the three octa axes carry a Fano *line* {e1, e2, e3} that is simultaneously an A₂ subsystem, and the right-handed-frame closure `e1·e2 = e3` is checked to mirror the 3-axis geometry (`lineClosureSelfCheck`). But a hint on one A₂ is not a derivation on the whole A₃ lineage.

- **It subsumes the campaign's weakest cell.** Orientation-sign was the most fragile result; the structural sign was once *reconstructed lexicographically, not transported*. The reverse walk B→A is precisely "the walk at the antipodal angle," so whether B→A = −(A→B) is a **property of the angular product law** (its anticommutativity), not an independent axiom. Solving the product law fixes the reverse law; guessing the reverse law in isolation is the trap.

- **It is where regression-to-W_0 is most tempting, and most fatal.** If the walk-composition shadow is *exactly* the Fano product and nothing else, then W is W_0 wearing a walk costume — and §6.1 of the ruling names that a regression, not a fresh start.

A companion difficulty governs W choice even though it is deferred to W-2: the IV-A death is caused by **per-source scalar reduction** — one complex number per contribution. Any W whose declared field reduction is still one-scalar-per-source will die identically, no matter how legitimate its source regime. Both things that survived in the evidence — the Gate-0 holonomy and IV-A's lone partial reach (the unsigned antipodal *pairing* recovered from positions) — are **relational/loop** quantities, not per-source content. So the hardest *legitimacy* problem (the product-law reconciliation) and the hardest *field* problem (per-source death) point at the same design demand: the regime's load-bearing content, and any observable built on it, must be **relational** from the start.

---

## 3. (c) The shape of the W I intend to abduct

A sketch of the regime, not the model card. The nine components in shape, with bounded holes named:

1. **Source ontology** — *specified in shape.* A source is a basepoint carrying a **local walk frame**: its directed outgoing relations to lineage-neighbors, each tagged with the operation and parents that created it, equipped with the intrinsic angular metric of its frame (the 60° A₂/A₃ geometry — present from G0, since the tetra's equilateral faces already meet edges at 60°). A source is *not* a unit; the unit, if any, is read off the frame.

2. **Walk ontology** — *specified in shape.* A walk A→B is a directed relation seated in A's frame at a definite angle within the relevant A₂ subsystem plane. Walks compose by angular advance along the subsystem's great circle.

3. **Reverse/return law** — *bounded hole*, branch set **{ negation ; return-with-distinct-status ; antipodal-in-frame }**. Default leaning: antipodal-in-frame (B→A is the walk at the antipodal angle), whose *sign behavior is derived from* component 4 rather than assumed. I will consume the evidence that lexicographic sign was fragile, and that the octa second-instance already carries one tested geometric orientation policy (§4, item 3), as a pre-existing branch to evaluate — not a vacuum.

4. **Angular product law** — *specified-in-shape, hard core.* Composition of two walks = advance by the subtended angle in the A₂ plane; the constraint that makes it legitimate is that its **algebraic shadow on lineage edges coincides with the Fano product** (e_parent1 · e_parent2), which makes consistency with the Bench-2 60°/vector-equilibrium result automatic rather than assumed. Proving this coincidence on the full A₃ lineage (not one A₂) is the work.

5. **Child-inheritance law** — *specified in shape.* A child's walk frame is generated from the two parent frames meeting at the birth edge; the child's derived carrier is the angular-composition shadow = e_parent1 · e_parent2. The octonion product reappears as a *consequence* of walk-composition, not a primitive — which is exactly how W stays at or above the W_0 floor while inverting its primacy.

6. **Legitimacy criteria** — *specified in shape.* Correct parentage; walks close under the operation; angles preserved (60°, edge = circumradius); **antipodality derived** as child-level root negation (the j→i child is the reverse-walk of the i→j child, = −(εᵢ−εⱼ)); **loop-closure derived** (triangle/square holonomy +1; hexagon/A₂ holonomy −1 forced by the antipodal-triad identity ((−a)(−b))(−c) = −((ab)c)); correct counts under the declared policy; **equivariance** under S₄ on the base and the 168-element Fano gauge on the shadow; **no arbitrary carrier** — the carrier is forced by walk-composition, not chosen. Each criterion is built to **fail if its defining structure is removed** (the ontology-level mock-solution test).

7. **Field propagation law** — *deferred to W-2*, with a binding design intent recorded now: the observable must be **relational / loop-borne** (holonomy, phase defect, vortex, cancellation axis), never one scalar per source, because per-source reduction is the proven cause of the IV-A death.

8. **Observable / recovery law** — *deferred to W-2.* Blind recovery, label-stripped, beating controls; mediated recovery permitted; the form of observability not predetermined.

9. **Reduction-honesty law** — *specified in shape.* The declared reduction from walk frame to whatever the field sees must confess its loss explicitly, and must clear the W_0 floor (it must at least preserve the quaternionic Re-holonomy that Gate 0 already validated), or the trade is named.

**Source-population policy (declared):** primary test object at G2 = **current-core** (the 12 cuboctahedron children = the A₃ roots), with **historical-cumulative** (4 + 6 + 12) carried as a bounded variant used for the equivariance/embedding check. The legitimacy of G2 births may depend on whether G1 sources persist as sources; that dependence is itself a finite test, not a free parameter.

**The honest risk I will try to break before mothership does (§8).** The failure mode is "W_0 in costume": if removing the directed-walk and angular content collapses W to W_0 with *no* loss of any legitimacy criterion, then the walk layer is decorative and W earns nothing. My defense is built into component 6 — a legitimacy diagnostic must fail when the walk structure is stripped — and into the W-2 intent — the relational observable must be shown to *require* the walk content. If the walk content cannot be made load-bearing, the correct verdict is **W-FAIL**, and that is a first-class result, not a defeat.

---

## 4. (d) Repo items bearing on, or contradicting, the initiation

1. **Decoy path live in an in-repo document.** The Ground Plan's review-command pattern (§9) literally runs `cd /d C:\Dev\PlatonicEngine` — the decoy the initiation forbids. The initiation already brackets the Ground Plan as "orientation, not task," and flags README/ARCHITECTURE as stale, so this is a stale artifact rather than a live conflict — but it is a concrete instance of the decoy path inside the canonical repo and should be corrected so no future agent copies it.

2. **The reverse/orientation hole is not empty — one geometric branch already exists and passed.** The initiation (§6.3) frames orientation-sign as reconstructed *lexicographically* and the campaign's weakest cell. The octa second-instance has already moved past that: `octaFirstBirthCarrierBaseV0.ts` derives each edge's direction **geometrically** from the stella-octangula positive-face-class boundary, with `lexicographicSortingUsed: false`, and that orientation passed Bench-2 at R12. This is not a contradiction of the initiation, but it refines it: my reverse-law bounded hole inherits a pre-tested geometric branch, so the hole is narrower than "open in a vacuum." I will treat that branch as a named candidate, not re-guess it.

3. **Two distinct 12-fold objects both realize the cuboctahedron — a clarity point to confirm.** The hub source-state capsule is built from the **tetra's 4 primal vertices as 12 ordered flags** (X→Y, the directed K₄ edges = A₃ roots εᵢ−εⱼ). The octa first-birth's 12 children are the **octa's 12 edge-midpoints**. Both are the 12 A₃ roots / cuboctahedron vertices, and D3 proved they reproduce the same invariants — but they are *different constructions* (ordered-flags-of-4 vs midpoints-of-6). The initiation's anchor lineage is the **geometric birth chain** (children = edge midpoints), which is the right one for the W-gate; the ordered-flag capsule is the algebraic source-state attached to it. I will anchor W on the geometric birth lineage and treat the flag/root identification as the algebraic shadow, so the two 12-objects are never conflated. I flag this so mothership can confirm the anchoring before the model card.

4. **"Root negation is the natural antipodality" vs "do not assume B→A = −(A→B)" — I read these as consistent, and want that read confirmed.** Root negation is antipodality at the **child/root level** (derived, a legitimacy target); the warning is against importing negation at the **primitive walk level**. My W derives the former and leaves the latter a bounded hole. If mothership reads the two passages as in tension rather than as a level-distinction, that changes component 3 and I should know before producing the card.

Nothing in the repo contradicts the *substance* of the initiation's ratified results; items 2–4 are refinements and one anchoring confirmation, and item 1 is housekeeping.

---

## 5. What I independently verified (calibration hygiene, not a claim for credit)

The §4 results are mine to consume, not re-derive. I nonetheless re-checked the load-bearing facts I will lean on, in a sandbox, to be sure I understood them:

- **Quaternionic confinement.** Using the repo's own oriented-triple table, every product of two distinct primal-quadrangle units {e1, e2, e4, e7} lands in {e3, e5, e6}; and {e3, e5, e6} is closed under multiplication (a Fano line spanning an associative quaternion subalgebra). The Gate-0 caveat's mechanism is exactly right.
- **A₃ / vector equilibrium.** The 12 roots εᵢ−εⱼ give a 4-regular polytope with circumradius = edge = √2 (vector equilibrium), nearest-neighbor center-angle = 60° exactly, chord classes at 60/90/120/180°. The four "drop an index k" subsets are each 6 coplanar roots (the four A₂ hexagonal great circles).

Both reproduce the Bench-2 and Gate-0 figures. My calibration rests on verified ground.

---

## 6. Intended sealed anchors for the W-1 legitimacy diagnostics (PREVIEW — not committed)

To show I hold the sealed-value discipline (the campaign's deepest lesson: a sealed prediction that was *wrong in the false-positive direction* became visible only because it was sealed): the values a legitimate W reproducing the A₃ structure must hit at G2, which I intend to **hash-commit in the W-0 model card, not before**:

- signed antipodality: opposite-sign 6/6 across the 6 antipodal child axes; reverse map a fixed-point-free involution.
- square holonomy: +1 on all square cycles; triangle closure on all 8 triangles.
- triadic (A₂) multiplicative product: {+1, −1} per hexagon — exactly one of each, forced by ((−a)(−b))(−c) = −((ab)c).
- metric: adjacency angle 60°, edge / circumradius = 1; 12/12 distinct anchors; 4 great circles identified-through-projection.
- carrier-shadow holonomy: Re ∈ {+1 on triangles/squares, −1 on hexagons}, quaternionic (links in Q = {e3, e5, e6}).
- equivariance: every verdict invariant across the 7×24 = 168 Fano labelings.

These are the *known* R12 values; W earns nothing by reproducing them unless the reproduction is **derived from the walk regime and fails when the walk structure is removed**. The model card will state, for each, the diagnostic that breaks if W's defining facts are deleted.

---

## 7. What I am NOT doing, and my request

I am not producing the candidate-W model card, not committing any prediction, not authorizing any diagnostic, and not claiming any result. Per §7 I hold here for mothership's acknowledgment of this calibration.

I request acknowledgment or correction on four points before I write the model card: (i) the inversion thesis of §1 as the working frame; (ii) the single-hardest-problem framing of §2; (iii) the W-shape and bounded-hole budget of §3 — in particular that **reverse/return** is the one substantive open hole, with **angular-product** specified-in-shape and **field propagation / observable / recovery** legitimately deferred to W-2; and (iv) the §4 anchoring of W on the geometric birth lineage with the flag/root identification as algebraic shadow.

On acknowledgment, I will produce the W-0 model card: all nine components, every open slot a single named bounded hole with an enumerated branch set, the §6 anchors hash-committed, and each legitimacy criterion paired with the diagnostic that must fail if W's defining facts are removed.

The hub gave a real observable and named exactly where it stops — at the edge of the quaternion subalgebra. My W begins at that edge, and I will try to break it before you have to.
