# Charter — The First Loop: close an edge into a circle, end to end

**From:** mothership · **To:** engineer/prompter · **Status:** chartered
**Authority:** the built certifiers (ratified this session) + CONTEXT.md (the ratified picture). No gate, no "pressure" — this is simply the first lossy operation, built because it's the next thing the module needs. Ordinary discipline applies (build only this one; don't let it sprawl).
**Substrate (verified this session):** `transformationLedger.ts` — `buildSignedIdentification(sourceSiteIds, resultOf, signOf)`, `certifyFaithfulness`, `certifyOrientation(ledger, cycles)`, `boundarySign(siteId, refSiteId, shape)`; `incidenceTraceRegistry.ts` — `decomposeLink(adjacency)` → strata / junctionLoci / pinch / four-valued valence; `lineage.ts` — the carried charge; edge endpoints live at `shape.vertices[id].createdBy.sourceVertexIds` (the oriented `[A,B]`).

## Intent

Turn the loop **once**: perform the first lossy operation on a **real engine edge** and watch the **already-built certifiers** record it — on real input, not the synthetic stand-ins they run on today. The operation is the simplest possible (the CONTEXT.md example dialogue): close a line into a circle. Success is not a torus or a theorem — it's that the loop **operation → consequence → faithful trace** closes once, on real material, and the trace is honest.

## 1. The operation — `closeEdgeIntoCircle`

Closing a line `x——y` into a circle **identifies its two endpoints** `{x, y}` into one support; the edge becomes a loop (S¹, level 1 of the ladder).

- **Input:** one real edge of a real Shape (a seed or a g1 ambo output), i.e. its two endpoint vertices `x, y`, each carrying its `scope × lineage`.
- **Effect (as a ledger fact, not a mutation):** `{x, y} → one result support`. Do **not** mutate the source Shape — derive/snapshot; the module is independent of Shape state.
- This is the atomic member of the operation set. Build **only** this one.

## 2. The minimal closure driver

Enact the one identification and compute what it forces, then hand the result to the certifiers:

- recompute the **post-identification link** around the new (merged) support from the real incidence;
- run the propagation as a loop to a fixpoint — for a single identification it terminates in one pass, but build the **loop shape** (enact → recompute → check), since that is the driver we'll reuse for cascades later;
- keep it minimal: one identification, the local recompute. A multi-step cascade is a **later, richer** example, explicitly **not** this loop.

## 3. Wire the built certifiers to REAL input (reuse unchanged)

- **Ledger:** `buildSignedIdentification([x, y], resultOf, signOf)` → `pullBack { circleSupport ← [x, y] }` + the signed layer.
- **Faithfulness:** `certifyFaithfulness(...)` reports honestly whether `{x, y}` is lineage-homogeneous. Expect **heterogeneous** for two distinct endpoints — and that is the *finding, not a failure*: it is **co-location ≠ identity** made concrete (the topology says "one support"; the ledger says the two placeholders are co-located, **not** identified — the rest is the user's mirror). If the chosen edge's endpoints happen to be lineage-equal, expect homogeneous/faithful. Either way, the certificate's verdict **is** the result.
- **Orientation:** `certifyOrientation(ledger, [theCircleCycle])` with the cycle `x → y → x`; `boundarySign(x, y, shape)`; expect `w1 = 0` (an orientable circle) unless the substrate signs say otherwise.
- **Valence:** `decomposeLink(...)` on the merged support's link → expect `valence 2` (interior, manifold), one stratum, no junction (a circle is a manifold).

## 4. The diagnostic (the loop turning)

`scripts/diagnose-close-edge-into-circle.cjs`: pick one concrete real edge, run **operation → driver → certifiers**, and assert every output against **sealed expected values**. The actual numbers (which support, homogeneous vs heterogeneous, `w1`, the valence) are the finding — **seal them, then read them.**

## 5. Scope & discipline

- **One operation only.** Not glue/cut/collapse/flip-glue/the zoo — those get built as we actually reach for them. No speculative operation library.
- **Certifiers unchanged** — this loop *feeds* them real input; it does not modify them. If you find a real wiring gap in a certifier, surface it as a finding, don't silently patch.
- **Source Shape not mutated.**
- **The exact substrate wiring is yours to read from the code, not mine to invent** — the Shape edge API, the adjacency you hand `decomposeLink`, and `certifyFaithfulness`'s exact argument list. I verified the certifier entry points this session; I did **not** read the operation/driver plumbing, so I'm not prescribing signatures I haven't seen. If anything here collides with the substrate, the collision is your first finding (say so; don't bend the code to fit my words).

## 6. Seat process

Write the build prompt; **seal the expected ledger + certificate values** so the audit is falsifiable; prompt the implementer; **audit the diff before any commit**; the commit is Arman's to fire natively. Seal discipline holds — nothing unrevealed on the branch.

## 7. Done =

A real edge, closed into a circle, with the ledger recording `{x ↔ y}` and the faithfulness / orientation / valence certificates computed on **real post-identification data**, all asserted green in the diagnostic. That is the first closed loop: **operation → consequence → faithful trace.** Everything after it — glue → cylinder/torus, flip-glue → Möbius/Klein, collapse, cut — is just more operations landing on certifiers that are already there to catch them.
