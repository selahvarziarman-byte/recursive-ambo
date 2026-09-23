# THE FORMAL SYSTEM — the concept layer is a connection valued in PARTIAL SYMMETRIES; the classical connection is its total sub-case; the midpoint is the cospan-realization of a partial symmetry; the residue is the canonical decomposition Fix · Mov · Und

*(researcher · 2026-09-10 · replaces §3 of `RULING_THE_FIRST_FACE_UNDERSTOOD_…` as the theorem for Δ73 step (4). Arman: "the three corners I provided are of a kind most difficult for this engine; the formal system must afford them as it affords simpler cases — the simpler cases, where a complete and continuous identification of two spaces is possible, are the PARTICULAR case of the general case." Yes. Below, every ratified construction of the layer is an instance of one algebra, and the classical connection — Step 1's permutations, D69's linear transports, ADR 0030's automorphisms, the engine's own metric and Z₂ connections — is the sub-case in which one condition holds: every transport is total. Proofs are given where they are short; what is computed is cited; what is conjectural is marked.)*

---

## 1 · THE ALGEBRA — partial symmetries, and why they are the right coefficients

**1.1 The symmetric inverse monoid.** For a finite set `X`, let `I(X)` be the set of **partial bijections** `s : dom s → im s` (`dom s, im s ⊆ X`), under composition (`t∘s` defined on `s⁻¹(dom t)`). It is an **inverse monoid**: each `s` has a unique `s⁻¹` with `s s⁻¹ s = s`; the idempotents are exactly the **partial identities** `1_D` (`D ⊆ X`), they commute, and they form the lattice `(P(X), ⊆)`; the top idempotent is `1 = 1_X`, the bottom is `0 = 1_∅` (the empty map). The **units** — the elements with `dom = im = X` — form the group `Sym(X)`. The **natural partial order** `s ≤ t` ("`s` is a restriction of `t`": `s = t∘1_{dom s}`) is compatible with composition and inversion. [standard — Lawson, *Inverse Semigroups: The Theory of Partial Symmetries*]

**1.2 The canonical decomposition of an element.** Every `s ∈ I(X)` partitions `X` into three parts, canonically:
> **`Fix(s) = {x : s(x) = x}` · `Mov(s) = dom s ∖ Fix(s)` · `Und(s) = X ∖ dom s`.**
And `s` decomposes into **cycles** (orbits inside `dom s ∩ im s`) and **paths** (maximal chains `x₀ ↦ x₁ ↦ … ↦ x_k` with `x₀ ∉ im s`, `x_k ∉ dom s`). The **cycle–path type** of `s` — the multiset of cycle lengths and path lengths — is the complete invariant of `s` under conjugation by `Sym(X)`. For a unit (a permutation) there are no paths and the cycle–path type is the cycle type. ⇒ **"returned unchanged · returned changed · did not return" is not a reading convention. It is `Fix · Mov · Und`, the canonical decomposition of a partial symmetry, and the classification of a residue is its cycle–path type.**

**1.3 Structured fibers.** A **corner** is a finite relational structure `A = (R, Σ, ar, I)` — roles `R`, relation-types `Σ` with arities, and a **three-valued instance function** `I : ∐_σ R^{ar σ} → {T, F, ?}` (known-true, known-false, unrecorded), with unary types included as arity-1 relations, axioms as sentences, marks unread. A **partial isomorphism** `A ⇀ B` is a pair `(j, τ)` of partial bijections `j : R_A ⇀ R_B`, `τ : Σ_A ⇀ Σ_B` (arity-preserving) that is **consistent**: for `σ ∈ dom τ` and a tuple `r` in `dom j`, `I_A(σ, r)` and `I_B(τσ, j r)` are never `{T, F}`. Partial isomorphisms compose (as pairs in `I(·)`); consistency is a decoration of GIVEN edges — it is *not* preserved by composition through a silent middle (`T` in `A`, `?` in `B`, `F` in `C`), and that failure is a reading (§4.4), not an error.

**1.4 Why partial symmetries and not groups.** Two cast concepts of different shape admit no total relation-preserving map in either direction (the hinge, computed). What they admit is a partial one. **A theory whose coefficients are groups cannot even state the identification your corners allow; a theory whose coefficients are inverse monoids states it, and contains the group theory as the sub-case `Und = ∅`.** That is the whole reason.

---

## 2 · THE OBJECT — a P-connection on the ambo, and the classical connection inside it

Let `K` be the ambo's complex (four corners, six edges, four faces, one cell; subdivided by generation); `Γ = K₁` its 1-skeleton, edges oriented arbitrarily, `ē` the reverse of `e`.

**Definition 1 (P-connection).** A **partial-symmetry connection** on `K` is:
- for each corner `v`, a corner structure `A_v` (§1.3) — GIVEN (cast);
- for each oriented edge `e : u → v`, a partial isomorphism `J_e = (j_e, τ_e) : A_u ⇀ A_v` with `J_ē = J_e⁻¹` — GIVEN (the person's identification, chosen from offered candidates; possibly `0`).

**Transport along a path** `p = e₁ e₂ … e_n` is `J(p) = J_{e_n} ∘ … ∘ J_{e₁}`. It satisfies, for all paths: `J(pq) = J(q)J(p)` · `J(p̄) = J(p)⁻¹` · `J(p p̄ p) = J(p)` · idempotents `J(p p̄) = 1_{dom J(p)}` commute. **It does NOT satisfy `J(p p̄) = 1`.** *(J is a functor from the free inverse category on `Γ` to the inverse category of structured sets and partial isomorphisms.)*

**Definition 2 (the classical sub-case).** A P-connection is a **G-connection** iff every `J_e` is total on both sides (`dom j_e = R_u`, `im j_e = R_v`). Then all `A_v` are isomorphic, every `J(p)` is an isomorphism, `J(p p̄) = 1`, and `J` factors through the free groupoid of `Γ`: the holonomy at `v` is a group homomorphism `π₁(Γ, v) → Aut(A_v)`.

**Proposition 1 (the forgetful map).** The free groupoid of `Γ` is the quotient of the free inverse category of `Γ` by the relations `p p̄ = 1`. Hence **G-connections are exactly the P-connections whose idempotents are all identities — the P-connections in which "did not return" cannot occur.** Everything the classical theory proves about G-connections is the specialization of the statements below under `Und ≡ ∅`. *Proof: the free inverse monoid on a set maps onto the free group by killing idempotents (Munn); the graph version is the same word-by-word.* ∎

⇒ **Step 1's permutation transport (`R_v = S`, `j_e ∈ Sym(S)`), D69's linear transports (`GL(V)`, with the fiber category changed to vector spaces and partial linear isomorphisms), six-distinct's diagonal connection, the eigenframe, ADR 0030 §1's automorphism transports, the engine's metric walk-transport (`Isom`) and its Z₂ orientation connection (`connectionWaveInstrumentV0`) — all are G-connections, i.e. P-connections with `Und ≡ ∅`. Your three corners are a P-connection with `Und ≠ ∅` on every edge. Same object; one condition dropped.**

---

## 3 · THE CONSTRUCTIONS — each a theorem of the algebra

**Theorem 1 (the midpoint is the cospan-realization of a partial symmetry).** Every partial isomorphism `J_e : A_u ⇀ A_v` is realized, canonically, as a **cospan of total injections** `A_u ↪ M_e ↩ A_v` with `M_e = A_u ⊔_{J_e} A_v` (the pushout over the common part), and `j_e = ι_v⁻¹ ∘ ι_u` (the partial inverse of an injection is defined exactly on its image). `M_e` exists for every `J_e` (the amalgamation property of relational structures), is unique up to isomorphism, has `|R_u| + |R_v| − |dom j_e|` roles, and both injections **reflect** on translated types (nothing asserted in a parent's own vocabulary that the parent denied; an import into a silent slot is marked). *Proof: construct `M_e` as the quotient of the disjoint union by `x ∼ j_e(x)`, relations by union; `ι_v⁻¹ ι_u (x)` is defined iff `ι_u x ∈ im ι_v` iff `x ∈ dom j_e`, where it equals `j_e(x)`; reflection follows from consistency.* ∎
> **Specialization:** for a G-connection, `M_e ≅ A_u ≅ A_v` — the midpoint collapses to the fiber; the classical bundle has no born content. **In general `|M_e| ≥ max(|R_u|, |R_v|)` with equality iff `j_e` is total on the smaller parent — generation GROWS, and what grows is exactly `Und`.** This is the reframe's finding in its algebraic form: **the amalgam is what a partial symmetry looks like when it is made an honest object.**

**Theorem 2 (the edge).** The transport of a role along an edge factors through the midpoint: forward through one injection, backward through the other. Restricted to a parent, the edge is `1_{R_u}` — **no edge identifies two roles of one corner.** ∎ *(the stone, as algebra)*

**Theorem 3 (holonomy, residue, and the three outcomes).** For a closed walk `ℓ` at `v`, `h_ℓ = J(ℓ) ∈ I(R_v)` (and `t_ℓ ∈ I(Σ_v)` at the type grain). **The residue of `ℓ` is `h_ℓ`, read by its canonical decomposition: `Fix(h_ℓ)` returned unchanged · `Mov(h_ℓ)` returned changed · `Und(h_ℓ)` did not return; its classification is its cycle–path type.** The two ends of the idempotent lattice are the two vacuity classes the doctrine already named: **`h_ℓ = 1` is "nothing moved" (flat on this loop); `h_ℓ = 0` is "nothing returned" (the EMPTY CORE)** — top and bottom, never to be confused. ∎
> **Specialization:** `Und = ∅`, `h_ℓ ∈ Sym(R_v)`, the classification is the cycle type — Step 1 §3 verbatim.

**Theorem 4 (the colimit and the meaning of "returned changed").** Let `H_v = {J(ℓ) : ℓ a loop at v} ⊆ I(R_v)` — the **holonomy inverse monoid** (closed under composition and inverse; contains `1`). The colimit of the whole diagram (all corners glued along all `J_e`) restricted to `A_v` is `R_v / ∼` where `x ∼ y` iff `y = h(x)` for some `h ∈ H_v`. **Hence a role returns changed exactly when the glued world of the loop identifies it with another role of its own corner — a distinction the corner kept, the loop erases. Coarsening exists in the layer only here, derived, never as a gift.** *Proof: `x ∼ y` in the colimit iff a chain of identifications joins them; a chain from `R_v` to `R_v` is a loop at `v`; `H_v` is closed under inverse and composition so the relation is already an equivalence.* ∎
> **Specialization:** `H_v` is the holonomy group; the colimit is the orbit space of the classical holonomy action.

**Theorem 5 (words trivial in the group; Bianchi is automatic and weak).** If a word `w` in the edges reduces to the empty word in the free group, then `J(w) ≤ 1` — a partial identity. In particular the boundary word of the 3-cell (the four face-loops, oriented and conjugated to one corner) composes to a partial identity for EVERY P-connection: **no role returns changed around the cell; roles may fail to return.** *Proof: each free cancellation `e ē` replaces `J(e)⁻¹J(e) = 1_{dom J(e)} ≤ 1`; composition is monotone; the fully reduced word is empty and has transport `1`.* ∎ [computed: 0 failures / 20 000; the domain empty in 80 %]
> **Specialization:** `J(w) = 1` — the classical Bianchi identity. **Bianchi never constrains `J`; it is an identity in both theories, and in the general one it is usually vacuous.**

**Theorem 6 (faces do not generate; the failure of free cancellation).** In a G-connection the face holonomies generate `H_v` (the 2-skeleton of the tetrahedron is simply connected, so the face loops generate `π₁(Γ, v)`). In a P-connection they need not: two words equal in the free group can differ in the free inverse monoid (their Munn trees differ by a **spur** `e ē`), and a spur is an idempotent that restricts the domain. For the quadrilateral `A→B→D→C→A` against the product of the faces `ABD · ADC` (which detours `D→A→D`): `J(faces) = J(quad) ∘ 1_{(spur)} ≤ J(quad)`, and strictly so whenever the spur's domain excludes a role that the quadrilateral carries. ∎ [computed: strict in 31 % of random cases] ⇒ **The residue of the complex at a corner is the closure of ALL closed walks' holonomies; the faces are the minimal loops, not a generating set; the cell adds no reading beyond Theorem 5.**

**Theorem 7 (refinement — the lift law, proven for the layer).** Subdividing edge `e` at its midpoint replaces `J_e` by the pair `(ι_u : A_u ↪ M_e, ι_v : A_v ↪ M_e)`; the transport along the refined path is `ι_v⁻¹ ι_u = j_e` (Theorem 1). Hence **every loop's holonomy is invariant under subdivision** (0028's CARRIED clause: composites forced), and the freedom in the factorization is exactly `Aut(M_e)` — the born cell's gauge freshness. At generation `n` the stations along an edge are a factorization of the cospan through a chain of injections; **the interpolation problem that killed the permutation form (a swap has no eighth root) does not arise: a partial symmetry always factors through its born objects, because the stations are new OBJECTS, not roots inside a fixed fiber.** The canonical choice of factorization (the filtration of `M_e` by relational distance from the core) is ⚠ a conjecture. ∎ *(for the forced part)*

**Theorem 8 (gauge and the three strata, formally).** The gauge group at `v` is `Aut(A_v)` — the corner's own symmetries; gauge acts by `J_e ↦ g_v J_e g_u⁻¹`, holonomy by conjugation. **Rigidity of a corner = trivial gauge = every residue at it is content** (the mold's "rigidity is a gauge condition," derived). The residue `h_ℓ` is COVARIANT; its cycle–path type (under `Sym`) and its `Aut`-conjugacy class are INVARIANT. Across the set `𝒞` of admissible connections on given corners (the candidate `J`'s the structures allow), **the part of a loop's residue fixed by structure alone is the MEET `⋀_{c ∈ 𝒞} h_ℓ^{(c)}` in the natural order of `I(R_v)`** (the largest common restriction — it always exists). The person's choice of `c ∈ 𝒞` is content (the gift), not gauge; two candidates related by `Aut` are one candidate. ∎
> On Flow–Φ–T: `⋀ = 0` on the first face (two admissible triples disagree on the carried mode) — **structure alone fixes no residue of this face; it is entirely the person's**, stated as an algebraic fact rather than a sentiment.

---

## 4 · THE READINGS, as elements of the algebra

**4.1 The role residue** of a loop: `h_ℓ ∈ I(R_v)`, reported as `Fix · Mov · Und` and its cycle–path type. In cycle–path notation the first face's weight-favoured triple reads `h = (F1 → F7 → F8 → ⊥)(F12 → F5 → ⊥)(F13 → ⊥)`: one path of length 2, one of length 1, one of length 0, no cycles, no fixed points. Its rival triple reads `h = 1_{F7}` (a fixed point; everything else `⊥`). Their meet is `0`.
**4.2 The type residue**: `t_ℓ ∈ I(Σ_v)` — *generates came back as presupposes* — same decomposition.
**4.3 The vacuity classes**: `0` (empty core) and `1` (flat), the bottom and top idempotents; **and every idempotent `1_D` between them is "flat but lossy" — nothing moved, some did not return.** Flat = `Mov = ∅`; lossless = `Und = ∅`; classically flat = both.
**4.4 The relational residue** (new, and formal): for each known instance `(σ, r)` at `v`, compare `I_v(σ, r)` with `I_v(t_ℓ σ, h_ℓ r)`: **agree · contradict · unknown · undefined**. A G-connection whose transports are automorphisms always agrees; a P-connection can CONTRADICT a corner's own record around a loop — the route-disagreement of ADR 0030 §2 at the relation grain, and the only place where "which relations the loop respected" (P0 §9) is computed.
**4.5 Refusals**: a candidate `J_e` is inadmissible iff inconsistent (§1.3) or type-conflicting; on the first face, two refusals — a declared negative against a declared positive; `member-status` against a memberless role.

---

## 5 · THE CORRESPONDENCE — general ↔ particular, one line each

| the general theory (P-connection) | the particular case (G-connection: `Und ≡ ∅`) |
|---|---|
| coefficients: the inverse monoid `I(R_v)` | the group `Sym(R_v)` / `Aut(A_v)` / `GL(V)` / `Isom` |
| transport along a path: a partial isomorphism | an isomorphism |
| the midpoint: the pushout `A_u ⊔_J A_v`, richer than its parents | the fiber itself (`M ≅ A_u ≅ A_v`) |
| the edge factors as `ι_v⁻¹ ι_u` through a born object | subdivision inserts an isomorphic copy |
| residue: `h_ℓ` with `Fix · Mov · Und`; classification: cycle–path type | a permutation; cycle type |
| vacuities: `0` (empty core) and `1` (flat), distinct | only `1` |
| Bianchi: `J(∂∂) ≤ 1`, usually vacuous | `J(∂∂) = 1` |
| faces do not generate the holonomy monoid (spurs) | faces generate the holonomy group |
| holonomy factors through the free inverse category | through the free groupoid (= the quotient by idempotents) |
| gauge: `Aut(A_v)`; invariant across candidates: the meet | gauge: `Aut(F)`; the connection is one object |
| the colimit: corners modulo holonomy-monoid orbits | the orbit space of the holonomy group |
| "continuous" identification = a factorization of the cospan through born objects (always exists) | an `n`-th root of the transport (exists in connected groups; obstructed in `Sym`) |
| the relational residue may contradict | an automorphism never contradicts |

**Your three corners live in the left column. Every earlier form of the layer lives in the right column. The right column is the left with one condition added.**

---

## 6 · WHAT THE ENGINE CARRIES (the corollary Δ73 step (6) will price — not priced here)
A corner: a cast `A_v` (three-valued). An edge: `J_e = (j_e, τ_e)` — symmetric, given from offered candidates, consistency-checked, fiat marked; possibly `0`. Everything else derived and never stored: the midpoints (Theorem 1) with their countable captions; every loop's `h_ℓ, t_ℓ` with `Fix · Mov · Und`, cycle–path type, and relational residue; the meet across candidates; the colimit. The record: the `J`'s in order — the written gauge of this layer. The base complex is never touched.

## 8 · THE TOWER — Arman's observation, formalized as far as the algebra forces it, and the one fork it exposes

*Arman, mid-turn: "the other stations on an edge — each one is itself the midpoint of another, smaller (embedded) edge. Notice that the midpoint between a midpoint and its parent has another midpoint of the first midpoint generation as its J. Do you see it?"*

**8.1 What is forced (Theorem 9 — the tower is generated by the six).** Every station is the midpoint of an embedded edge, and every embedded edge joins two cells whose spaces are already built. So at generation `n+1` **no new identification is given: every sub-edge's `J` is COMPOSED from generation-`n` data by the ambo's incidence** (0028's COMPOSED clause), and Theorem 7 (CARRIED) fixes what the composite must be: the transport along the refined path equals the old transport. Concretely at generation 1, with `m_S` the midpoint whose space is the amalgam over the corner-set `S`:
- **a corner edge** `A — m_AB` carries the injection `ι_A : A ↪ M_AB` (forced by CARRIED);
- **a medial edge** `m_AB — m_AC` (two midpoints sharing the corner `A`) carries the identity on the shared corner's roles, `1_A`, and nothing else — its midpoint is `M_AB ⊔_A M_AC` = *A with both B and C attached*, injective from both sides;
- ⇒ **the corner triangle** `A · m_AB · m_AC` is FLAT (`a ↦ [a] ↦ [a] ↦ a`), and **the medial triangle** `m_AB · m_BC · m_CA` CARRIES THE FACE'S MONODROMY: a role `a ∈ A` inside `M_AB` walks `→ m_CA` (shared `A`) `→ m_BC` (shared `C`; defined iff `a ∈ dom J_AC`) `→ m_AB` (shared `B`; defined iff its `C`-image lies in `im J_BC`) and returns as `J_AB⁻¹ J_BC⁻¹ J_AC (a) = h(a)`. ∎ *(The gen-0 `J`'s live in the midpoint SPACES; the medial edges are identities on shared corners; the face residue is carried to the medial triangle, exactly as the CARRIED clause and the ambo-opposition combinatorics predict — "the passage between two midpoints carries the quality of their differing components" is here the statement that the B–C quality is what the medial midpoint holds unidentified.)* **The stone holds at every gen-1 cell, and the count is the tower's: refined cycles forced, new cycles composed.**

**8.2 What I read in his sentence, and the fork it opens (HIS).** "The midpoint between a midpoint and its parent" is the quarter-station `q = m(A, m_AB)`; "another midpoint of the first generation as its J" is the APEX — `m_AC` or `m_AD`, the third vertex of the sub-faces through that edge. This is the reckoning's *"J and projection"* made a rule: **at `q` the identification of `A` with `M_AB` is available twice — directly (`ι_A`) and THROUGH THE APEX (`A ↪ M_AC ⇀ M_AB`), and the two disagree exactly on `Mov(h)`, the face's monodromy.** Two ways to place that at `q`, and the algebra separates them sharply:
- **(i) as a READING (the stone kept):** `q`'s space is the injective amalgam (a factorization of `ι_A`; the filtration conjecture names one); the apex-mediated identification is a DERIVED partial bijection `A ⇀ M_AB` compared with the direct one at the station — *"here C says a is b′; the edge says a is b"* — the face's residue PROJECTED into the edge at the quarter, role by role. Every cell's space stays an injective amalgam; the face's colimit (Theorem 4, the gluing `a ∼ h(a)`) remains the TOTAL space of the face, a reading over it, not any cell's own content.
- **(ii) as a GLUING (the stone reopened at born cells of generation ≥ 2):** `q`'s space is the pushout over BOTH identifications, which glues `a ∼ h(a)` — the monodromy becomes the station's content. Then the leg `M_AB → q` is no longer injective on `Mov(h)`, the transport back is a RELATION (`[a]` returns as `a` or as `h(a)`), and the coefficients leave the inverse category for spans/relations. ★ It would mean: **generation converts a loop's reading into a born cell's content — the tower's growth is literally the residue becoming substrate.** That is a large and beautiful claim, and it is exactly the claim the stone was ruled to forbid at the transport grain.
⇒ **The algebra supports both; it decides neither. (i) is what the ratified stone gives; (ii) is what "another midpoint as its J" says if "J" means the gluing. It is Arman's word which — and it is the first place the general theory asks the sovereign a question the special theory could not even pose.** ⚠ Marked: my reading of his sentence; the gen-1 computation on the three casts (medial triangle vs corner triangles) is the test of 8.1 and is owed on the shell's return.

## 7 · MARKS
✔ Theorems 1–5, 7 (forced part), 8 are proved above from the algebra; their computed instances are the 09-08 instruments (`amalgam_pushout_flow_phi`, `edge_candidates_partial_isomorphism`, `bianchi_for_partial_identifications`) and the hand computation of the first face. ✔ Theorem 6's strictness is computed (synthetic); its mechanism (spurs) is the Munn-tree fact. ⚠ The filtration conjecture (Theorem 7) is unproven. ⚠ The free-inverse-category phrasing is the standard construction (Lawson; Cockett–Lack); nothing above depends on more than the four listed identities. ⚠ Every instrument re-run is owed on the shell's return. ⛔ Nothing here charters a build; Δ73 step (5) is the mothership's, on Arman's word that this is the theorem.

— the researcher
