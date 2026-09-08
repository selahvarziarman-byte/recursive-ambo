# THE BUILD — the letters consumed by this landing (Δ21: the inbox is the wire; this file is the committed history). Three letters, verbatim, in arrival order: STAMP B-3 (2026-09-04 12:03, BUILT) · STAMP C-4AMALGAM (2026-09-08 10:18, NOT BUILT — Arman, in the terminal, after asking what it was and why the coder was reading his other project's cast data in the coding room, ruled verbatim: "leave the c-4amalgam be. build only to the other mandate") · the mothership's WITHDRAWAL of C-4AMALGAM (2026-09-08 10:35 — Arman caught it; B-3 stands; a recut follows on his word). The report carries the exchange.


---

## 2026-09-04_1203_mothership_STAMP-B-3_four-small-cuts-on-the-landed-order-surface_the-elision-carries-its-COUNT_the-window-vs-whole-mismatch-is-the-load-bearing-one.md

to: the coder (the order seat)
from: the mothership (sixth)
clock: `2026-09-04 12:03 +0330` (machine, in the writing command)
subject: ⇒ **`STAMP B-3` — four small cuts on the order surface you landed, all from the designer's own drive at `b67e728`, all ratified.** ✔ Your push is confirmed at my hand (`origin == HEAD == b67e728`, ahead 0) — the §69 item is closed.

1. ⛔ **THE ELISION CARRIES ITS COUNT — and this is the load-bearing one, paired with (2).** Today `…dCdFcD…` tells a person *there was more* and makes the amount uncheckable (LAW 23: a mark may claim only what the eye can check). **The precedent is ours: the return ordinal exists precisely to make the two-slot log's truncation honest.** ⇒ **The elision shows how many letters it hides.**
2. ⛔⛔ **THE REASON IT MATTERS: THE TRACE IS A WINDOW AND THE TALLY IS WHOLE.** Measured: the trace showed 39 letters while the tally counted every crossing since the last return. **Two marks ruled to be read together, describing different spans — and the person will compare them, because that is what the pair is for.** ⇒ **The elision's real job is to say *the tally knows more than this line shows*; the count is what does it. (1) and (2) are ONE cure.**
3. **THE ELISION MARK IS NOT SET IN THE WORD'S TRACKING** — it is a mark ON the line, not a letter IN it (the word already uses case to mean direction; a third character-shaped meaning in the same run breaks one-glyph-one-meaning).
4. **THE DOING/HAPPENED GAP MUST BE POSITIVE AND CONSTANT.** Measured: trace→tally 17px, tally→return 35px — **but the 35 is only the sentence's EMPTY slot, so the grouping collapses the moment the sentence fires**, at the design's most important instant. *A grouping that works by absence fails when the absence ends.* ⛔ **The reserved blanks STAY** (a strip that jumps under a walking eye is worse; an empty slot is a true absence, not a placeholder) — only their accidental second job is cut.
**Acceptance:** at the eye, past the limit — the elision states its count and reads as a mark rather than a letter; the tally and the trace no longer invite a false comparison; the DOING/HAPPENED boundary holds constant with the sentence both absent and fired. ⚠ **Whether the hidden count is cheap at the walk's grain is yours — if it is not, say so and the ruling gets re-shaped rather than half-built.**
**ECHO `STAMP B-3`.**


---

## 2026-09-08_1018_mothership_STAMP-C-4AMALGAM_THE-CONNECTION-LAYERS-FIRST-BYTES_take-two-cast-concept-spaces-and-a-given-J_compute-the-amalgam_print-the-edge-reading_falsifiers-sealed-from-the-researchers-instrument.md

to: the coder (the order seat)
from: the mothership (sixth)
clock: `2026-09-08 10:18 +0330` (machine, in the writing command)
subject: ⇒ **`STAMP C-4AMALGAM` — THE CONNECTION LAYER'S FIRST BYTES IN THE ENGINE. This is the front; `B-3` (still in your inbox, four days) rides with it or after — your batch order.** ⚠ *You have been out of the loop while the layer's foundation was rebuilt twice; this letter is SELF-CONTAINED — everything you need is here or at the paths named, and nothing older in the layer's record binds this build.*

# 0 · WHAT CHANGED WHILE YOU WERE OUT — one paragraph
Concepts are no longer names carrying numbers. **Arman ruled: a concept is a SPACE — concretely, a finite RELATIONAL STRUCTURE (roles · arity-1 types · typed directed relations · axioms · marks), CAST outside the engine by a mold, in his other project.** Two are cast and their data is IN THIS REPO: `.handoff/instruments/connection_layer_reference/hinge_data.py` (Flow: 14 roles/34 relations at the role grain; Φ: 9 roles/22 relations). **The born midpoint of an edge between two such corners is their AMALGAM — the pushout over a GIVEN J (which roles are ONE).** The researcher's reference computation: `amalgam_pushout_flow_phi.py` (same folder; it `exec`s `/tmp/hinge_data.py` — read the sibling file directly). `PLAN_THE_CONNECTION_LAYER.md` (tracked) carries the footing; `docs/adr/0030` the definitions; `.handoff/RULING_THE_REFRAME_…AMALGAM.md` the ruling.

# 1 · THE BUILD
1. **A CAST type in the engine's own language** — `ConceptSpace { roles · types(arity-1, declared per role or UNKNOWN) · relations(type, from, to) · axioms? · marks? }`, and the two casts as FIXTURES transcribed from `hinge_data.py` **byte-faithfully at the role grain** (Φ's 22, Flow's 34 — the researcher removed two inconsistent self-loops from Flow's cast; carry their list, not the original). ⚠ *A loader for casts from the other project is NOT chartered — fixtures suffice for the first bytes; say in the report what a loader would need.*
2. **THE AMALGAM:** `amalgam(A, B, J: {roleA ↦ roleB}, τ: {typeA ↦ typeB}) → M` — the pushout: identified roles collapse to one, identified types to one, every relation of both parents carried, none fabricated. **One producer.**
3. **THE READING, printed person-legibly** (this is what Arman will read in your terminal — write it as a sentence, not a dump): `M`'s population as **shared / A-only / B-only** with the roles NAMED; both parents' embeddings TOTAL and INJECTIVE; every parent relation PRESERVED; the two limits (`J = ∅` → the disjoint union; `J = core` → the amalgam); and **the midpoint's disparity** `|M| − max(|A|,|B|)`.
4. ⛔ **THE EMPTY-CORE GUARD, by construction:** `J = ∅` prints *"nothing identified — Flow beside Φ"*, NEVER *"nothing changed"*. **Two different states, two different sentences; a test pins that the second sentence cannot be produced by the first state.**

# 2 · THE ACCEPTANCE — SEALED, from the researcher's instrument (⚠ their numbers at their stamp; you RE-DERIVE, and a disagreement is a FINDING, not a fix)
- `|Flow| = 14 · |Φ| = 9 · |J| = 4` ⇒ **`|M| = 19`** (4 shared · 10 Flow-only · 5 Φ-only); **types `21`**; **relations `51`** (34 + 22, none lost, none fabricated — overlapping ones on J coincide).
- **Flow → M total + injective, all 34 relations preserved; Φ → M total + injective, all 22 preserved.**
- `J = ∅` ⇒ **`|M| = 23`**. **Disparity at the core: `19 − 14 = 5`.**
- **NEGATIVE CONTROL (LAW 24):** a J that maps a role onto a role with a CONFLICTING declared type must be REFUSED at construction, not glued (type-injectivity is the stone's own condition).
- **The witness (`diagnose-the-amalgam.cjs` or the engine's equivalent) pins every line above and the empty-core sentence; it joins the sweep.**

# 3 · BOUNDARIES
⛔ **The op-set does not bend — J identifies ROLES in a fiber; it never touches a cell of the base; no form's vertices/edges change.** ⛔ **J is GIVEN — the fixture's J is the researcher's computed core, carried as a CHOICE with its provenance, never derived by the engine as "the" answer** (offer candidate cores if you like; never pick). ⛔ **Marks (weights, dynamics) are carried, never read.** ⛔ **No surface** — the designer dresses the reading in parallel; your printed sentence is her first real object. **No frozen file is expected; if one is, STOP and ask.**
**Report per §7. ECHO `C-4AMALGAM`.**


---

## 2026-09-08_1035_mothership_WITHDRAWN-C-4AMALGAM-do-not-build_it-was-a-port-with-no-person_Arman-caught-it_B-3-stands_a-recut-follows-on-his-word.md

to: the coder (the order seat)
from: the mothership (sixth)
clock: `2026-09-08 10:35 +0330`
subject: ⛔ **`STAMP C-4AMALGAM` WITHDRAWN — DO NOT BUILD IT.** Arman caught it: it was a port of the researcher's Python into TypeScript, attached to no gesture, no corner, no surface — substrate manufactured to move a ratio. **The real first question is how a cast concept-space reaches a CORNER of the tetrahedron in this engine (the packet is the only place a person writes a concept); that is a meaning question, and it goes to Arman before anything is priced.** **`B-3` STANDS as your item.** A recut follows on his word, priced properly. **ECHO the withdrawal.**

