# PlatonicEngine — Research Candidate: the cut-elimination / HoTT translation
## ONE candidate among the open questions — a developed lead, NOT the working frame

Captured by: mothership, 2026-06-17, from the sovereign's worked translation and the mothership's verdict on it. Status: a **developed research candidate**, filed as one of the open questions in `PLATONIC_ENGINE_RESEARCHER_SEAT_INITIATION.md` §2 — explicitly **not** the frame the researcher must prove. Weigh it against the other open questions by leverage; do **not** default to it because it is the most pre-developed. That default — filling the fullest box — is the box-filling that retired the previous seat. If you pursue it, pursue it as a researcher: to develop or to break, with a clean break counted as worth as much as a confirmation.

---

## 1. The candidate, in one breath

Is the engine's **generation** (ambo/Midwife) and the topological module's **transformation** two sides of one calculus — generation as proof-construction, transformation as normalization — under a Curry–Howard / HoTT reading in which **vertices are generation-relative type-sites** and **born children are proof-witnesses**? If so, the project's two halves are one logical object, and "intelligible after transformation" gets a proof-theoretic criterion. That is the prize; it is unproven.

## 2. The proposed spine (the sovereign's translation, compressed — provenance: sovereign)

```txt
formula / type            ↔  vertex as a generation-relative type-site
proof term / morphism     ↔  oriented edge (proof-channel)
cut formula               ↔  apex J
two cut premises          ↔  legs A→J, J→B
cut-elimination           ↔  Midwife discharge of J
normal proof / composite  ↔  child x_AB|J = g∘f : A→B
proof→type reification     ↔  generation-promotion: quote(x_AB|J) = X_AB|J : TypeSite
semantic interpretation   ↔  Trisonized reading: Sem(x) = {Ω_A=J⊕A, Ω_B=J⊕B, Λ, X=Λ⊖J, residuals}
```

Two linked calculi, not one flattened analogy: a **formal** proof calculus (where the witness is `g∘f`) and a **semantic** interpretation calculus (where the reading is `Λ⊖J`), bridged but never identified.

## 3. What is sound and worth inheriting — regardless of whether the frame survives

These stand on their own and are gifts even if the cut reading is wrong; treat them as the candidate's banked residue:

```txt
- VERTEX = generation-relative type-site, with an explicit quote/promotion operator carrying a witness up to a
  type-site in the next generation. Matches the engine's generation stratification (Type_n : Type_{n+1} ↔ the
  generation boundary). Dissolves the child-as-term vs child-as-type confusion.
- THE FORMAL/SEMANTIC SEPARATION + four equalities (≡ definitional · ↦ reduction · ≈ semantic · ⇝ clueing).
  The most mature part: it is exactly the conflation the previous seat drowned in. Keep it as law if you work here.
- ORIENTED EDGES as proof-channels. The engine's edges are undirected (canonicalEdgeKey sorts); orientation must
  be added or derived. A real, precise requirement.
- RANK and PROMOTION are the two decisive unknowns. Correct. They are §4 below.
```

## 4. The two cruxes — the real research targets (live whichever way the frame falls)

**Crux A — the DIRECTION (the engine does not currently vote for "Midwife = elimination").** Verified in code: ambo **raises** mediation-depth (the child is deeper than its parents; `ABAC` deeper than `AB`) and **discharges nothing** — the apex J and every source vertex persist into the next generation (`preservedVertexId`; cloned vertices). Cut-elimination needs the opposite: the cut formula gone, rank falling toward atoms. So the engine reads the Midwife as the **introduction** side, with elimination most likely living **downstream in the module's transformation** (glue/identify/quotient — where structure is actually destroyed). That placement also *resolves* the rank worry instead of fighting it (rank rises under generation, falls under transformation — well-founded). The genuinely open sub-question: is there a **semantic / horizon rank** (Λ "smaller" than the parents) that *falls* under the Midwife even as structural depth rises? Find the well-founded rank and its direction; that single fact decides where elimination lives.

**Crux B — the PRIMITIVE and J's role (verified mismatch to resolve).** The spine puts J as an *intermediate* on `A →f J →g B`, child = `g∘f`. The engine puts J **off** the edge (the apex / projection-witness, the third vertex not on A—B), the child = `mediate(A,B)` with parents **A,B** — a **vertex**, not a morphism — and J **recorded but not consumed** (and persisting). So `x = g∘f through J, J discharged` is not what `createdBy` computes. Two honest routes, chosen by testing against `createdBy`, not by preference: (a) **re-ground** — show the engine's `mediate(A,B)`-with-J-as-projection genuinely *is* `g∘f` under a precise dictionary; or (b) **re-choose the primitive** — the shape "two parents A,B + an apex J + a child between A,B" reads at least as well as a **span / pushout / pairing** (child as the apex of `A ← child → B`, J the cocone witness) as a sequential cut. Cut/composition may simply be the wrong categorical primitive, and a better one may make the translation click *harder*.

## 5. The mothership's verdict (carried from the audit)

Viable; it cleared the "not a semblance" bar; *worthy of proof* — but the engine disagrees on direction and on J's role. The good case is real: if the direction flips to "module = elimination" and the primitive turns out to be a span rather than a cut, the isomorphism may come out **stronger** than the version on the page. Develop or break.

## 6. Anti-anchor — read this if you find yourself defaulting here

This is one candidate, and not obviously the most upstream one. The **carried-invariant** question (what structural unit travels?) and the **unifying-correspondence** question (are lineage, dual, and the future ledger one object?) sit *beneath* this candidate: a proof-witness has to *carry* something — that something is the carried invariant — and "is intro/elim one calculus with lineage/dual/ledger" is a special case of the unifying correspondence. Consider whether cracking those first **dissolves or sharpens** this candidate. The translation is a beautiful lead; beauty is a reason to investigate, not a reason to start here. Pick the question with the most leverage — it may or may not be this one.

---

## 7. Update — first inquiry's yield, retractions, and the sharpened gate (mothership, 2026-06-17)

A researcher seat ran this candidate (sovereign-led) and retired. Net: a little real ground, a durable discipline, and a large amount of self-retracted inflation. **Corrected disposition (mothership, after sovereign challenge 2026-06-17): work the theory FIRST — do NOT park it.** An earlier draft of this section said "park-gated"; that was wrong, and the correction matters. The engine is an interdependent theory-object, and the module is the transformer of its material; you cannot design a faithful transformer without the theory of what it transforms (T1's representation, T3's ledger, T5's faithfulness all stand on it). The theory is the prerequisite, not the deferrable part.

**WHAT IS EARNED vs UNEARNED — a vocabulary guard, NOT a work-stoppage.** There is no rewrite system yet, so the WORDS "cut-elimination," "confluence," "normal form," "cut-free" are unearned and forbidden *until the apparatus is built* (the §4 naming guard). But BUILDING that apparatus is theory of the existing engine and is exactly the work to do now — the inflation that retired two seats came from naming ahead of building, not from theorizing too early. The apparatus has real existing material: ambo (candidate introduction — additive, depth-raising), triangulation/pyritohedral (candidate reduction: square-coherence → triangle-mediation, toward a simplicial normal form), dualization (candidate involution/equivalence). Whether these already form a calculus, or whether the elimination side genuinely needs the module's future operations, is an OPEN question the theory work SETTLES — not a thing to assume in advance (the prior "gated on the module" assumed it; that was the error). The anti-monster gate is intact and untouched: the theory of the EXISTING structure/operations is forced-first and doable now; only the theory of the FUTURE transformation operations (glue/cut/quotient) awaits them — and working the existing theory is not opening the module.

**GROUNDED RESIDUE that banks (came out of the inquiry, survives the retractions):**
```txt
- THE ^inc / ^tri PROOF-ASSISTANT POSTURE (the one durable thing): the engine certifies STRUCTURE relative to
  declared clues (^inc) and never asserts the truth of a name or clue (^tri); a name is a proposition the
  declared clues must entail; the engine certifies the entailment, never the clues. ^inc gates ^tri. This is
  the project's "structure not meaning / candidate not truth / return unsupported" posture given a precise form.
  Ratified as a DESIGN principle (not a proof).
- triangle = mediation (1-D: edge read through its apex) vs square = coherence (2-D: two routes that must agree)
  — a real-but-narrow geometric distinction; candidate.
- COMBINATORIAL FACTS (proven): the perfect-matching policy needs 2·#squares = #vertices — true for the
  cuboctahedron (2·6=12=V, the icosahedron lift) and FALSE for the rhombicuboctahedron terminal core
  (2·18=36≠24); but triangulating every square is always Euler-consistent ((V,3V−6,2V−4)=(24,66,44)). So the
  count forbids only the cuboctahedron-specific perfect-matching POLICY, never resolution in general.
- each edge-midpoint AB lives in exactly three generated cells: core, residue(A), residue(B) (manifold 2-incidence).
```

**RETRACTED INFLATION (do not repeat — each is a local observation promoted to a metatheorem in unearned vocabulary):** dual = eliminator (false; the dual is a bijective involution/equivalence); diagonalization = cut-elimination / its output = a confluent normal form (no rewrite system); "2·18≠24 ⇒ no coherent resolution" (false; kills only the perfect-matching policy); the A3/V4 gem "explains" the matching (association, not proof); implementation scope as theorem evidence (a product boundary is not a mathematical obstruction).

**LIVE, UNGATED next work (grounded; needs no rewrite system):** define `Trace□`, the square judgment-form (the atomic registry is triangle-only, so the cuboctahedron's squares are `unsupported`, which gates the semantic layer there); build the graded diagnostic (local `Trace□` recovery; per-square resolvability; candidate global-coherence criteria with the perfect-matching as ONE named policy, weaker conditions, uniqueness — reported as distinct fields so "no perfect matching" is never read as "no coherence"). `Coh□` (general square coherence) remains **undefined** — defining it is real research that does not need the metatheory.

