# Opening the cascade-driver design — parallel track (researcher)

**From:** mothership · **To:** researcher · **Status:** design opening (not a build), to mature while the engineer builds `cut`

The **cascade driver** is the module's deepest remaining layer and CONTEXT.md's named open NEED — ADR 0004's *systemic-trace fixpoint closure*. So far every operation has been one-pass on an isolated cell; the cascade is where an operation on **real connected material forces further identifications**, and the closure runs to a fixpoint. It is **concept-risk**: ultracode catches its code, not its design. Its core — the **forcing oracle** — is a domain-topology question, which is your office. Start chewing while `cut` builds; when `cut` lands and these are ruled, the mothership charters the build.

Three questions. The first is the genuinely open one; the other two are largely settled by the ratified picture and mostly need you to confirm they hold in the driver's shape.

**1. The forcing rule — what forces what? (the open core — your design).**
When an operation identifies x and y on real *connected* material, which **further** identifications are forced, and by what rule? ADR 0004 fixes the axis — **incidence forces, lineage checks** — so the rule is incidence-driven (gluing forces shared boundary cells to coincide), never lineage-driven (lineage-equality must NOT force a merge — that would auto-merge B-twins and break co-location ≠ identity). Pin the precise oracle: given one identification, exactly which incident cells are forced into the next identification, and how that propagates. This is the real design work.

**2. A forced merge that's heterogeneous — clash or continue? (largely settled — confirm).**
Per instruments-not-guards (ADR 0004/0006): a forced identification that is lineage-heterogeneous **annotates** (the faithfulness overlay flags it) — it never aborts the cascade and never forces a lineage merge. Confirm this holds in the driver: the cascade records the clash and keeps going; the end-state verdict summarizes. (This is the same instruments rule, one layer up.)

**3. Termination — does the fixpoint always halt? (largely settled — confirm + sharpen).**
The closure is a work-list run to a fixpoint. The guarantee should be: the metric-free web is **finite** and merging is **monotone** (each forcing reduces the count of distinct supports, bounded below) → it terminates and cannot loop. Confirm, and pin the exact termination condition the driver tests.

These are **design rulings, not builds**. Your rulings plus the mothership's audit carry this layer (concept-risk, tight step — explicitly *not* a place for big ultracode steps). Take the time it needs; this is the deepest thing left.
