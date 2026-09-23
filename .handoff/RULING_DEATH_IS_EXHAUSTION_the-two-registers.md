# RULING — DEATH IS EXHAUSTION: the two registers

- **Seat:** researcher. **Date:** 2026-08-27. **Context SHA:** `565ade3`.
- **Occasion:** Arman redefined death in-terminal (verbatim): *"to let the shape that is a parent remain alive (operable). from 1 square all its 'unique' children should be obtainable exactly once! the parent will 'die' only if all it's possible children are on the page. so for example if a child is deleted a dead parent should come back to life."* The designer built a gesture spec on it and routed five definitional questions here.
- **Companion ruling:** Arman also ruled *"remove and undo does not need be recorded as geneology"* (mothership `MARKER A1`) — removal/undo are PAGE acts, not genealogy. This ruling depends on that and does not reopen it.

---

## 0 · THE ORGANIZING LAW — TWO REGISTERS (everything below is one consequence of this)

There are two registers, and death-as-exhaustion lives in the second, not the first:

| | THE RECORD (genealogy) | THE LIVE STATE (the page) |
|---|---|---|
| **holds** | what operations MADE — births, the parent→child relation | what is currently OBTAINED (on the page) + arrangement |
| **direction** | RATCHETS — only grows, never un-writes | DERIVED — recomputed from the page; moves both ways |
| **reversible?** | NO (a begetting is a past fact) | YES (remove a child → the obtained-set shrinks) |
| **who lives here** | begetting · `died`(op-internal) · the removal *trace* | **liveness / exhaustion** · arrangement |

⇒ **`alive/exhausted` is a LIVE-STATE property — a function of the current obtained-set — NEVER a genealogy death.** This single placement answers Q1 (no contradiction), Q4 (it is not the genealogy's `died`), and grounds Q3 (it is derived, so it must be re-derivable). It is the same record-ratchets / live-page-derived law that runs through P5 and that the leaf-catch proved structurally (*a record derived from the live state cannot ratchet* — so the record must be independent of the page, and liveness must be derived from it).

---

## 1 · Q1 — NO CONTRADICTION with the irreversibility ruling. The designer read it right; here is why, sharpened.

My P5 ruling: *"removing the Square does NOT cascade-remove the RP²; the RP² was BEGOTTEN — begetting cannot be un-done by removing the parent."* Arman's model: removing a CHILD revives a dead PARENT. **These do not collide, because they speak to different registers:**
- **Begetting is a RECORD fact** — irreversible. Removing the parent cannot un-make a child that was made; removing the child cannot un-make the fact that it was made. Both the birth and the removal stand in the record.
- **Liveness is a DERIVED live-state** — a function of *which distinct children are currently on the page*. Removing a child shrinks the obtained-set, so the parent's liveness RE-DERIVES to alive. **Reviving recomputes a derived value; it un-begets nothing.**

⇒ **Ruled: revival is not un-making. The child that existed still existed — the record holds its birth and its removal — and the parent's return is its liveness recomputed from a now-smaller obtained-set.** ⛔ **And liveness must be DERIVED, never STORED** (the RECORD-NOT-READING law: a stored derived value drifts from the code that makes it — and the leaf-catch is the live proof). A parent's `alive/exhausted` is a READING, recomputed from (its total unique-child set) minus (the children currently on the page).

## 2 · Q2 — A UNIQUE CHILD IS A DISTINCT RESULT-FORM (up to homeomorphism), one generation. NOT an (operation, map) input.

The map is part of a child's identity **only through the result**: `glue→torus` and `glue→Klein` are two children because the FORMS differ; two different maps that both yield a torus are **one** child. Grounds:
1. **"Unique children" individuates the CHILD, and a child is a FORM (a result).** The meaning-trace law: *operation is the meaning; the name is the RESULT — the index of the operation.* The child's identity is its result; the operation is the route. Two routes to the same form reach the same child (the record keeps both routes; the child is one).
2. **Arman's own case requires it:** *torus AND Klein bottle from one square* is possible precisely because they are distinct results — and the failure he named (*"could never make the torus AND the Klein bottle"*) is what an (operation)-grained child-set would cause (one `glue` spends `glue`). Result-grain avoids it.
3. **The opposite grain — (operation, map) input — would let a parent be "exhausted" by isomorphic DUPLICATES** (the same torus via two maps), which is making the same thing twice, not spending new potential. That contradicts the spirit (*alive while it can make something NEW*).

⚠ **Scope: ONE generation (direct children), never the transitive closure.** Forms beget forms without bound; *"all its children"* means the forms obtainable by a single operation on the parent, or `exhausted` is undecidable. The count a person sees is the parent's *direct* offspring.

## 3 · Q3 — ENUMERABLE (and `exhausted` assertable) YES for SURFACES now; DEFERRED for 3-manifold parents.

Exhaustion needs the child-set answered TOTALLY (*"what can I still beget?"*), or only *"nothing I can currently offer"* is assertable — which cannot carry a death (the designer's Q3, exactly right). The answer has a **buildability boundary**:
- ✔ **The menu is finite and total.** The op-set is finite; each op's legal parameter-set is finitely enumerated (a square's identification maps are the 8 `dihedralMapCandidates`; `cut`/`collapse`/`identify` range over finite edge-walks/faces/pairs). The affordance line already computes this set totally.
- ✔ **Dedup-up-to-homeomorphism is DECIDABLE for the square's children (surfaces) NOW** — closed surfaces are classified completely by **χ + orientability (+ boundary components)**, all of which the engine computes (`level3Invariants` χ; the window already distinguishes torus/Klein/RP²). So *"is this child a NEW unique one or an already-obtained duplicate?"* is decidable, and `exhausted` = *every distinct (χ, orientability, boundary) result is on the page* is assertable. **Arman's example (the square) is exactly the decidable case.**
- ⛔ **For a 3-MANIFOLD parent, DEFERRED.** General form-sameness (homeomorphy) is *"the tower's later business"* (`level3SoundnessGate.ts:11`) — not built. Until it exists, a 3-manifold parent can only assert *"nothing I can currently offer,"* not `exhausted`. **Trigger for the deferred half: a form-sameness predicate for 3-manifolds lands.**

⇒ **The first build ships death-as-exhaustion for the SURFACE generation; 3-manifold-parent liveness is deferred with that trigger.** ⚠ I did **not** find a general form-sameness predicate at HEAD (only χ/orientability + a `standardBodies` class-match); the surface case needs only what exists, the 3-manifold case needs what does not yet.

## 4 · Q4 — THREE distinct senses; the TYPE SPLITS; three marks (one glyph, one meaning).

| sense | what it is | register | reversible | mark |
|---|---|---|---|---|
| **`died`** (existing) | a part/concept absent from a child, read one generation up, INSIDE an op (`argumentReadingModel:24-26`, M3) | record | no (a past event) | its memorial row |
| **`removed`** (P5) | the person's page removal act | page act (NOT genealogy) | its own undo | the site memorial |
| **`exhausted`** (new) | a form with no unobtained unique child | **derived live-state** | **YES (revival)** | a liveness mark at the form |

⛔ **`exhausted` must NOT reuse `died`'s type or mark.** They differ in register (record vs live-state), in reversibility (past event vs revivable), and in subject (a part dying inside an op vs a form's generative potential spent). Conflating them re-buys *one glyph, two meanings* — forbidden. **The designer's instinct (two words, by agency) is right; extend it to three.** `exhausted` is a new DERIVED field on the form, computed per §3 — not a genealogy entry.

## 5 · Q5 — MOVING IS NOT AN ACT (for the undo chain).

An **act** (what undo's *"last act"* ranges over) = a gesture that changes CONTENT (a form's existence or identity) or the RECORD. **Moving changes only ARRANGEMENT (position)** — the non-act baseline. Grounds: LAW 20 (a view/camera move is invisible from inside — not a content event) and P5's own constraint (*the person must tell a removal from the world merely having moved* — moving is the explicit non-act against which removal must be distinguishable). ⇒ **Undo SKIPS moves; the undo chain is over content acts only** — the designer's risk (*an undo chain crowded with arrangement cannot reach the acts that matter*) is averted by construction. If arrangement wants its own reversal, it is a SEPARATE register from the content-act chain, never mixed in.

---

## 6 · CONSEQUENCES for the designer's build (her §5 blast radius)

For the SURFACE generation, Q2 (distinct results) + Q3 (decidable) both hold ⇒ her design is buildable now: the affordance line as a **liveness display** (derived, total, shrinks/grows with the obtained-set), the **two greys** (*already-obtained* = a prior child shares this result; *cannot-be-made* = a refused op), the **revival mark at the parent**, and the **spent-vs-removed two states** (a `exhausted` parent stays on the page; a `removed` one leaves a site memorial). For a 3-manifold parent, her L.4/L.5 (`spent`) wait on the form-sameness trigger (§3). ⚠ **Everything here is MEANING; the sights, words, and greys are the designer's.**

⇒ **RULED. Nothing in Arman's redefinition collides with the irreversibility ruling — they are two registers. Death-as-exhaustion is a derived, reversible live-state; it ships for surfaces and defers for 3-manifolds; and it is a THIRD word, never the genealogy's `died`.**
