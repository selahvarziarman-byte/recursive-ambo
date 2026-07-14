# 0003 — The multi-parent birth (N pentimenti · no order in the ink · the forking stemma · the seam in the specimen)

Status: **ACCEPTED** — mothership-ratified 2026-07-13 (4th seating), unamended. *Ratification note: the seam ruling (§4) carries a distinction the canon did not previously have — **a mark's INK carries a type-claim, and the type-claim must be true.** Drawing the seam in generator ink would not lie about where the mark is; it would lie about **what kind of mark it is** (an identification locus is not necessarily an H₁ generator), and would collide with design ADR 0002's certified-basis loop-set. That is a distinct species of faithfulness violation and it is now named. The composite-vs-N-ghosts call is likewise correct and for the stated reason: **a composite draws a form that never existed — fabrication, which is worse than omission.***
Date: 2026-07-12 · Seat: designer · Extends: design ADR 0001 (the birth clause)

## Context
ADR 0001 canonised **birth = pencil-pentimento parents + ink-stemma lineage** — written when every birth
had ONE parent. **`connectedSum` (co-ratified 2026-07-10) makes forms with TWO** (two tori sewn → genus-2).

The engineer measured the gap on a `connectedSum(T², T²)` child: the record carries **32 source sites —
16 to parent A, 16 to parent B**; the DAG carries **2 parents, 2 edges, integrity `accepted`** — but
`resolveLineage` (`src/playground/playgroundOperations.ts:80`) follows a **single** parent pointer, so
`ManuscriptView.tsx:644` receives **0 ancestors** and draws the child as an **orphan**. He sealed the data
fix, forbade the coder from inventing the render, and asked the designer to rule. Baseline `ef704d0`.

Two failure modes were live: **(a)** drawing ONE parent of two (silent omission — a lie in the canonised
register), and **(b)** drawing a COMPOSITE ghost (fabrication — a form that never existed; the worse lie).

## Decision
1. **N parents → N pentimenti + N stemma lines.** One pencil ghost per **consumed** parent the DAG carries.
   Never a composite; never "the first only." The researcher's bound gate holds — `pentimento ⟺ death ===
   true`: a NON-consuming parent (invoke / patch-lift / dualization) stays **live ink**, is not ghosted, and
   still receives its stemma line.
2. **The argument order does NOT touch the ink.** A connected sum is **symmetric** (A # B ≅ B # A); the order
   is computed only as the operation's argument order and is **not a fact about the child**. The pentimenti
   are drawn **equal** — no precedence, no over/under. Order is **record provenance**: it may be *stated* in
   the specimen's readout, never *drawn* as asymmetry in the world.
3. **The stemma forks upward.** The record is a DAG and it joins; the drawing shows the join — the lines
   converge into the child. No new mark: `transitiveReduceEdges(buildGenealogyDag)` already carries the edges.
4. **The seam is content, in the specimen, in its own ink.** The connect-sum seam (the sewn cut circles) is a
   real computed locus asserting something true — the child's **birth-scar**. Drawn only if the engine hands
   it as a real locus (never reconstructed by feel); in the **specimen** (structure is summoned, never ambient
   — as the generator loops already are); in a **distinct seam ink**, NOT the generator ink (it is an
   identification locus, not necessarily an H₁ generator; generator ink would lie about the *kind* of mark and
   collide with ADR 0002's certified basis).
5. **Pentimenti stay in place.** A parent dies where it lived and settles to pencil there — not relocated
   behind the child. This is also what makes N parents legible without a composite.
6. **Gate.** If the render cannot draw all N honestly, **gate it** — drawing one of two is the lie; drawing
   none and saying so is merely incomplete.

## Consequences
+ A two-parent birth can no longer be silently drawn as an orphan or as a single-parent birth.
+ No mark is invented — both parents, both edges, and the seam are all engine-computed.
+ The two-register wall is reinforced (order = record provenance → the specimen; never world ink).
− More ink on the page (N ghosts + N stemma lines); legibility rests on in-place ghosting + the fork — craft,
  dialled in `manuscriptDefaults`.
− The seam needs its own ink + legend line (one more craft channel).

## Alternatives rejected
- **A composite ghost** — draws a form that never existed (fabrication; the worse lie).
- **Draw the first parent only** — silent omission of a computed parent.
- **Encode the argument order (left/right, over/under)** — asserts an asymmetry the math does not carry.
- **The seam ambient in the world, or in the generator ink** — structure is summoned, not ambient; and
  generator ink would mis-label the kind of mark.
