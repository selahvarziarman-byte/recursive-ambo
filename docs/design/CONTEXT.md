# Topological Module — Design Context

The visual and interaction design of the playground. Companion to the domain `docs/CONTEXT.md`
(what things MEAN) and the ADRs. This is the DESIGN language and its resolved decisions; it routes
to the mothership for canonical integration. Started 2026-07-08 (designer seat).

## The one law (from §2 · ADR 0017/0018)
Beauty is the **revelation of true structure — never decoration over it.** Every visible mark is a
value the engine computed — loops = the real `gridVertexTo` correspondence, χ = measured `V−E+F(−C)`,
the twist = the edge-swap = 0, the merge remembers `maxMerge`. The designer adds no fiction the math
does not carry.

## The language — the inked manuscript _(firm · design ADR 0001 — RATIFIED, Mothership 2026-07-08)_
One idiom for everything: **ink & graphite on warm paper.** Chrome, world, and forms all speak it.
- **Forms are inked drawings**, not photoreal objects — the real subdivision drawn as construction
  lines, an ink silhouette, the real generators in colour. A drawing reads openly as a *chosen
  representative*, never as THE object (honest to §3).
- **The world is a living manuscript** (the biosphere, drawn): a warm-paper field where forms are
  born, drift, and coexist, **dimension-stratified as tonal registers**; the genealogy settles as
  **marginalia — the record**. (Evolves the earlier "ocean": the living quality is unchanged, the
  medium is now paper/ink, not water.)

## The through-line — two registers _(firm)_
- **The world (the manuscript)** — where you inhabit and think. Ambient, immersive — the phenomenon.
- **The specimen (on select)** — where you verify. Select a form → it **rises** (rise-and-sink), its
  true structure lights up (generating loops, measured invariants, the twist); packets / lineage /
  field on demand. A form with no body (a 3-manifold) shows its **fundamental domain** instead.
- **The one rule** — *the fiction never impersonates the proof.* The immersion you live with is a
  chosen representative; the proof is summoned, never ambient furniture (the ADR 0017 lesson).

## The chrome & interaction (resolved 2026-07-08)
- **Material enters two ways.** **Invoke** a primitive → **right-click on empty paper** (segment,
  triangle, square, …). **Load** a snapshot from an ambo universe → a **sources shelf** in the
  margin (loaded universes and their entities; drag one onto the sheet).
- **The dock is operations-only.** No invoke, no readouts — just the operations (glue / flip-glue /
  collapse / cut / dualize), each an **informative glyph** (a small diagram of the move itself);
  the text label appears on hover. The text-row dock was the last of the synthesizer.
- **Readouts surface on the form** — the specimen (rise-and-sink), on select. Act at the edges
  (dock, shelf, right-click); read on the form.
- **Birth** — select two forms → the legal combine (gate visible) → confirm. The consumed parents
  settle to **pencil** (a pentimento — legible on paper, not a transparent fade), joined to the child by a thin **ink stemma line** in the world; the settled
  record runs as **marginalia** along the foot.
- **Right-click a form** — a power shortcut mirroring the dock's operations, inline. Dock stays primary.

## Faithful rendering of forms (§3)
Committed immersion, **no faked structure**: a generating loop is drawn only where it genuinely
exists — torus/Klein edges are real generators; the **sphere** is simply connected (no loop); **RP²
HAS its ℤ/2 generator** (do not let the immersion's awkwardness erase it — correction 2026-07-08).

## Build-phase faithfulness guard (mothership-ratified 2026-07-08)
As the inked craft is polished (silhouette / hatching), do NOT drift toward photoreal solidity — a
form must read as a *drawing of a representative*, never as THE object. The moment it reads as the
object, the §2 / ADR-0017 lie is back. Keep the construction lines legible.

## Open
- Craft: the silhouette / hatching of the inked body, and the operation glyphs.
- Exact layout of dock + sources shelf + specimen — settle in the live build.
