# THE FORK — recommendation: gluing is what 2-cells DO; injection is what vertices and edges do. The cosheaf decides it, and both honesties are served.

*(researcher · 2026-09-10 · continues `RULING_THE_FORMAL_SYSTEM_…` §8. Arman: "do you have a recommendation? think deep and weigh the consequences to at least the g2 horizon. To my layman eyes (ii) seems more honest but I'm not sure." Weighed to g3. Recommendation: (i) at every walkable cell — and (ii)'s content is not lost: it lives, canonically, on the faces. Grounds are the algebra of the previous ruling and ADR 0028; every claim about what a walker would SEE is derived, not built, and marked where it awaits the instrument.)*

---

## 0 · The two branches, restated so they can be weighed

At generation 1 the medial edge `m_AB — m_AC` admits two identifications: the shared corner (`1_A`, forced — A's roles are A's roles in both amalgams) and the differing components (`J_BC`, the ambo-opposition rule: *the passage between two midpoints carries the quality of their differing components*). Where the face has monodromy they **conflict** on `Mov(h)`: `1_A` sends `[a]_AB ↦ [a]_AC`; `J_BC` through the internal identifications sends `[a]_AB ↦ [a′]_AC`. Jointly they are a RELATION, not a partial bijection.
- **(i)** the edge carries `1_A`; the conflict is not glued in any vertex; the face's colimit (which glues `a ∼ h(a)`) is a reading.
- **(ii)** the edge carries the relation; the born cells at generation 2 glue `a ∼ h(a)`; the residue becomes vertex content; the transport back is a relation.

## 1 · What each does to the WALKER — g1, g2, g3, derived

**Old loops (the four faces of gen 0, refined) keep their residue under BOTH** — they run through corner edges and midpoints only, which neither branch touches. ADR 0028's CARRIED clause is not what separates them; what separates them is the NEW loops and the new cells.

**Under (i):**
- g1 — the three **corner triangles** `A·m_AB·m_AC` are FLAT (`a ↦ [a] ↦ [a] ↦ a`); the **medial triangle** `m_AB·m_BC·m_CA` returns `a` as `h(a)` — the face's whole residue, with its cycle–path type, carried to the centre. Four sub-triangles compose to the old residue exactly (three trivial, one `h`). *This is the spanning-tree gauge of the subdivided face — content concentrates where identifications close cycles (the gauge reading, D12-b) — and it is the canonical factorization the CARRIED clause leaves free.*
- g2 — every vertex is an injective amalgam of its two parents over their shared part; the medial midpoint `p = m(m_AB, m_AC)` is `M_AB ⊔_A M_AC` — *A with B and C attached, B and C unidentified* — and the three medial midpoints of a face hold two of its three `J`'s each; none holds all three. The central sub-triangle carries `h`. Nothing pooled anywhere.
- g3 — the first cells whose parents disagree about a role appear (the pushout of `P_A` and `P_B` over the shared `C`-roles, where `c` sits with `a` in one and with `h(a)` in the other): under the stone the shared identification is the MEET — conflicting roles fall into `Und` — and **the disagreement is HOUSED as two roles, `a-via-B` and `a-via-C`, side by side.** The residue becomes content by *housing*, never by pooling. The walker carrying `a` through such a cell reads *did not return* on the new loop and `a ↦ h(a)` on the old one.
- At every generation: the cargo is a role or `⊥`; every residue has its cycle–path type; anomaly matching is exact; the algebra is one inverse category on the 1-skeleton.

**Under (ii):**
- g1 — the medial edges are relations. **The corner triangle already returns `a` as `{a, h(a)}`** — a set — and so does the medial triangle: the face's residue is smeared over all four sub-triangles as the ORBIT PARTITION. The cycle–path type of every new loop is lost: *returned as `a′` after one turn* and *after two* become indistinguishable; direction is gone.
- g2 — the medial midpoint's space is the face's glued colimit; from here down every cell containing it inherits the gluing; the walker's cargo is set-valued on `Mov(h)` throughout the face's interior; walking an edge into the interior and back returns *a-or-a′*: **the edge has acquired a residue** — not because there are two routes, but because the cell it enters has already internalized the loop.
- g3 — the centre of the 3-cell holds the total colimit: every identification any closed walk ever induced, pooled. **The deepest cells are the coarsest.** Generation descends toward the night.
- At every generation: the coefficients are relations (spans); every witness is a relation check; every surface must show set-valued cargo; the classification of new loops is the orbit partition only.

## 2 · Why (ii) FEELS more honest, and why the engine's honesty is the other one

(ii) is honest about the **consequence**: the person said `a` is `b`, `b` is `c`, `c` is `a′`; identity is transitive; a cell that shows `a` and `a′` as one is showing him what he said. That is real, and it should not be lost — §3 keeps it.

But this engine's honesty has, from its founding stone, been about the **route**: *the operation is the meaning; the name is the result.* Under (ii) the vertex that glues `a ∼ a′` cannot say whether the gluing came by the direct edge or through the apex, or from which three `J`'s — the cell keeps the quotient and forgets the route. That is the reckoning's own line for what the layer must NOT be (*the op-set keeps the quotient and forgets the route; the layer keeps the diagram and reads the route*), and it is the chair's second pathology by name — *the colimit that has forgotten how it pooled is the illusion of immediacy; the founding problem is mediation-forgetting-itself.* (ii) installs that pathology at the fiber grain, one generation down, as vertex content. In gauge terms: it replaces a connection with curvature by its orbit space — **flatness by quotient**. Under P0's aspect reading the residue is an EVENT of the walk (*what you held as X you now hold as Y*); (ii) turns the event into a state. The record would still hold the diagram — nothing is irrecoverable — but the walker, the person's own reading instrument, would read the abelian shadow (the partition) where he now reads the covariant residue (the cycle, with its order).

## 3 · THE RESOLUTION — the layer is a COSHEAF, and the cosheaf already says where gluing lives

The reframe ruled the layer a cosheaf on the ambo's complex: a space for EVERY cell, each higher cell's space the colimit of its boundary's diagram. Written out:

| cell | its space | the map from its boundary |
|---|---|---|
| vertex (corner) | the cast `A` | — |
| edge | the midpoint amalgam `M_AB = A ⊔_J B` | **injective** (the stone) |
| face | the face colimit — `A ⊔ B ⊔ C` over all three `J`'s, **which glues `a ∼ h(a)`** | from each edge-space: injective iff `Mov(h) = ∅` |
| 3-cell | the total colimit | from each face-space |

⇒ **Injectivity holds from vertices to edges and fails exactly from edges to faces — where the holonomy is.** The gauge ladder, verbatim: *connection on 1-cells, curvature on 2-cells, Bianchi on 3-cells.* **(ii)'s content — the world where all three hold — is the FACE's own space. It was never missing; it was never vertex content.** The walker on the 1-skeleton never enters it; it is the face's reading, the semantic cone Step 1 §3 already placed on the faces: shown for the face, countable as **`|amalgam of the three edges| − |face colimit|` = the number of roles the face glues — the semantic cone-deficit, LAW-23 checkable by listing.**

And the vertices the ambo mints are all born of EDGES (rectification bisects edges; it mints no centroids), so by 0028's COMPOSED clause each takes the space its birth-correspondence composes — the edge-amalgam, injective. **A vertex could lawfully carry a face's glued colimit only if it were born OF the face — a centroid.** The ambo has none. If Arman ever wants a walkable room *where all three hold*, that is a dissection that mints face-centroids — a seed/op-set matter for the mothership to charter, and the layer will assign the face's colimit to such a vertex by COMPOSED, without any change to this ruling.

## 4 · RECOMMENDATION
**(i) at every vertex and edge — the stone kept on the 1-skeleton; gluing on the 2-cells and the 3-cell, where the cosheaf puts it; the semantic cone read per face; at g ≥ 3 disagreement housed as doubled roles.** Both honesties: the consequence is content — of the face; the route is preserved — in every vertex, edge and walk. Nothing in the formal system changes; §8's fork closes by dimension.

**Falsifiers, so this can be wrong:** (a) walk the gen-1 medial triangle on Flow–Φ–T under the weight-favoured triple: it must return `F1 ↦ F7`, `F7 ↦ F8`, `F12 ↦ F5`, and the three corner triangles must be flat — computable by hand now (it is §8.1's derivation on the first-face table) and by instrument when the shell returns; (b) the face's cone-deficit on that triple must count 3; (c) at g3 the first doubled roles must be exactly `Mov(h)` — instrument. (d) **The test in the person's vocabulary:** the designer draws, on paper, one role walked round one corner triangle under each branch — *returned unchanged* vs *returned as `{a, a′}`* — and Arman says which he would call meaning. That is the acceptance question in the office's own words; it costs no build.

**What is his:** the choice itself; whether the face's colimit is a nameable thing (the manuscript's *the face is the unnamed stratum* is an op-set doctrine about glued faces, not this — a face-name slot in the layer would be new, and his); whether a centroid-minting dissection is ever wanted.

— the researcher

---

**APPENDED 2026-09-10 (evening):** Arman ruled — *no dissection that mints centroids; no face is nameable* — and took branch (i). Falsifiers (a) and (b) ran the same day (browser port, `…/RESULTS_2026-09-10_…md`): the gen-1 medial triangle reproduces the face's residue and the corner triangles are flat in all 25 triples; the cone-deficit under `(i)+A+P` is 3 — **with the cone-deficit now defined per corner as `|R_v| − |image of R_v in the face colimit|`** (the "amalgam minus colimit" phrasing in §3 above was wrong: it counts roles returning unchanged, not gluings). (c) — the g3 doubled roles — remains owed to an instrument.

**APPENDED 2026-09-16 (`g3_doubled_roles.py`, results beside it):** falsifier (c) RAN and my sealed prediction "the first doubled roles must be exactly `Mov(h)`" **FAILED in every one of 25 triples** (including the flat one, which doubled 3 roles with `Mov = ∅`). Read off the classes: a class doubles when an identification one gen-2 cell holds is NOT CONFIRMED by the other cell's route — **doubled `A`-roles at `Q_AB` = `(im J_CA ∖ Fix h_A) ∪ (dom(J_BC∘J_AB) ∖ dom h_A)`** (the third edge's identifications not brought home unchanged — for a moved role the doubling sits at its target `h(a)` — plus the roles stranded at `C`). Sealed as such and confirmed 25/25 and on the other two midpoints. The mechanism of §1 stands (housing, never pooling; the stone kept); its SET was wrong. ADR 0031 §3.5 amended on the run.
