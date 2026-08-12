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
- **Birth** — select the parents → the legal combine (boundary-match gate visible; illegal pairs refused
  with the reason) → confirm. **N parents → N pentimenti + N stemma lines** (design ADR 0003): one pencil
  ghost per **consumed** parent (`pentimento ⟺ death === true`; a non-consuming parent stays **live ink**
  but still gets its stemma line), each ghosting **where it was** — never relocated behind the child, never
  composited into one. The ink carries **no order** (a connected sum is symmetric; the argument order is
  *record provenance*, stated in the specimen, never drawn as precedence). The **stemma forks upward** —
  the lines converge into the child. The child's **seam** (the sewn locus — its birth-scar) is content,
  drawn in the **specimen**, in its **own** ink, never in the generator ink. The settled record runs as
  **marginalia** along the foot.
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

## SCAR — the two renderers, and the office's own first law (2026-07-28)
**The surface-body LOOK is `src/manuscript/InkedForm.tsx`** — the committed hand-designed craft:
depth prepass · ink silhouette (inverted hull) · translucent body · **key-light hatching** (banded;
target `outputs/torus_hatched_study.png`) · **two-pass construction lines** (near + hidden) ·
**two-pass generator loops in colour**. The six zoo surfaces render through it and read.
**`LaidBody` (CUT 1b, `ManuscriptView.tsx:445`) is a SECOND renderer** — the person's own cells on the
canonical body — and it reproduced almost NONE of that craft (fill + hull + cells + rim only). A
word-torus (2 cell edges) through LaidBody is invisible. **The fix is craft-parity (LaidBody wears
InkedForm's passes / unify the two), NEVER a fill-colour tweak.**
> ### **THE OFFICE'S FIRST LAW: any body-render ruling STARTS by opening `InkedForm.tsx` + this file —
> never from memory, never from a plate on flattering paper.** *P4 was ruled from recollection without
> reading the component this office authored; it cost days and shipped a band-aid on the wrong layer.
> The whole value of a standing office is that it does not re-derive what it built — so read the built
> record first, every time.*

### THE GATING LAWS — what a craft value must survive before it is filed
*(2026-08-12, designer 3 · mothership-ratified · ledger E5/E6. The FIRST LAW above says where a ruling STARTS; these say when a value has earned the right to leave this office. All five were bought in a single afternoon, each by a false claim caught before it reached the person.)*

> **THE BRACKET LAW — drive the dial to BOTH EXTREMES before judging any value.** A value judged against its neighbours is a guess; a value judged against the dial's full range is a reading. *I had already formed the claim "`smoothRodRecede`'s top of range does not achieve the recede it names" from a 0.65 → 0.92 comparison in which the frame barely moved. The bracket killed it: at `0` the room is a full-strength coloured wireframe cage, at `1` the inhabitants carry the frame with the class colour surviving as a whisper. **The dial worked; my comparison was too insensitive to see it** — and that claim was one step from reaching the engineer as a defect. It went on to catch three more the same afternoon.*

> **SAME-PASS VERIFICATION — the value on the panel and the plate in ONE pass.** A filed value never rests on a read taken at a different moment than the picture. *The panel read `8.00` where I had typed `9`, so two plates I had already judged were at a value I could not name. This is the "seal a read on the runtime object, not the source" scar in its craft form.*

> **THE STATION LAW — a depth-threshold dial is gateable only from a station where the band it governs is POPULATED; the gate must NAME its station.** *`lodMidDepth` at 2 vs 6 rendered **pixel-identical frames at two independent stations** — no copy sat in the band — and I had written the defect report: "the mid rung is inert, the default sits in a dead zone." At the third station `2` leaves the mid cluster smooth and `6` gives it hatch. The dial was fine. **My evidence channel was empty and I read empty as broken.** "Tune it to your eye" is under-specified for a threshold dial: a value can pass the gate blind.*

> **THE READING-RANGE BOUND — this office's capture instrument cannot reach reading range.** Screen captures return 1568 px from a 1920 px viewport, `zoom` crops the already-downscaled image (recovering nothing), and `resize_window` is refused. Contour weight and small-type contrast are precisely what that softening destroys. **So a legibility or weight ruling comes only from the app's own camera driven to true size, or from the Sovereign's eye — never from a cropped plate.** Anything below that resolution is filed ⚠ with its magnitude named as tentative. *The Sovereign's own full-resolution screenshot of his screen proved a better plate than anything this office can capture; where a judgement turns on fine weight, ask him for one.*

> **A RULING IS NOT A RECEIPT.** A definition handed down by another office is ground for what a thing MEANS, never for what the code DOES. Before person-facing copy is written against a ruling, read the line that emits the string. *I transcribed three `preserving · cone room · edges wind` options into my own task-1 report, then adopted a ruling that says the tag means reversing, and specified copy that would have printed a falsehood in the product. The receipt was in my own filing.*

**The through-line:** all five are the same instruction — **do not let the absence of evidence read as evidence.** An insensitive comparison, a stale read, an empty depth band, a softened plate, and an unread emitting line all present as information and are not.

### The world mark at dim 3 — the aperture (design ADR 0004)
A closed 3-manifold **has no embedding in R³**, so it gets **no silhouette**. Its body in the world is an **aperture** —
a **hand-cut hole in the page** through which its **interior** is seen: the cell's real edges, redrawn under the real deck
words, receding and fading into the paper. The rim is a *cut*, not an outline. It still drifts in the ocean, is selectable,
and can be a parent — the stratification (dim 2 above, dim 3 below) holds.

- **World = the interior** (phenomenon; no arrows, no markers, no labels).
- **Specimen = the fundamental domain + its face pairings + the tower** (proof; summoned on select) — the exact parallel of
  a surface's fundamental polygon + generator loops. **The registers invert at dim 3; nothing is thrown away, the domain is
  RELOCATED.**
- **The geometry touches the ink.** The S²-gate's edge-link cycle length `n` → θ = 2π/n vs the cell's dihedral → **E³/S³/H³**
  **is the recession law** (E³: 1/d, straight lines straight; H³: exponential crowding; S³: closing up and coming back).
  Euclidean recession on a hyperbolic form would be a **lie**. Geometry = **non-knob** (the engine's); ink weight, fade,
  jitter, aperture radius = **craft** (mine). *Derived for E³ at `9d02726`; H³/S³ await the ambient model — gated, not faked.*
- **Orbifolds / junction forms draw differently BY THE SAME LAW** — a cone edge's copies fan differently, visibly. **No
  orbifold badge.** The cone angle and singular locus are **specimen** facts.
- **Gate:** no real deck group + ambient → **draw nothing and say so**. *A cube with arrows, called the form, is the lie.*

#### Amendment (2026-07-13) — the three rubrics and the sign
The dim-3 world mark is **rubricated**, not monochrome. **Three inks — iron-gall · vermilion · verdigris — are the
engine's three EDGE CLASSES** (`edgeClassOf`; H₁'s generators). **Every stroke is a nib stroke, thick at the tail and thin
at the head, running along the class's ENGINE-SIGNED direction** (`endClassOf`, per `level3Orientation.ts:97`) — **a stroke,
never an arrow.**

Why both are load-bearing: a monochrome aperture draws a **non-orientable** 3-manifold and an **orientable** one with
*identical ink* (measured: 2235 identical segments for w₁=0 T³ and w₁=1 FLIP). And **colour alone does not fix it** — the
cube's axis-coloured skeleton is *invariant* under the reflection. **The SIGN is what carries chirality.** With it, a
mirrored room shows a flipped class-frame handedness:
> **w₁ = 0 ⟺ every room agrees.  w₁ = 1 ⟺ they do not.**  *(T³: 322/0. FLIP: 176/146.)*

**Gauge caveat:** the absolute handedness of a single room is a convention (which member edge is the class rep). The
invariant is **agreement vs disagreement across rooms** — never seal one room's sign. *(design ADR 0004, Amendment 1.)*

#### Amendment 2 (2026-07-13) — image-space, and the habitat. *(Supersedes Amendment 1's world-mark craft.)*
The dim-3 interior is **IMAGE-SPACE ray traced** (Berger–Laier–Velho, Vis Comput 2015): trace a ray from the eye; **when it
exits the fundamental domain, TRANSPORT it by the engine's gluing isometry and continue**; shade on first hit. **Never
object-space** (enumerating the group and projecting copies — exponential, and it is what the superseded lineage did).

**The room holds the person's own FORMS.** *"a ray of light might loop and such paths can represent every element of the
fundamental group"* — **the copies ARE π₁**, which our tower explicitly does **not** compute. The world **shows** π₁ without
claiming it. **A dim-3 form is therefore a HABITAT, not a specimen: the ocean's dim-2 forms are the scene objects of the
dim-3 spaces.**

**Chirality needs no ink.** Put a **chiral** form in the room (the committed Möbius band) and look: *(T³ → 0% of copies
mirrored; the FLIP form, w₁=1 → 11.8% show the MIRROR band.)* **Amendment 1's rubrics + nib-taper are WITHDRAWN from the
world** — that was the diagram again. The cell's edges may appear as **faint rods** (Ray-VR's "space perception" aid):
**scaffolding, never the form.**

**Geometry is UN-GATED** — the ambient follows from the engine's own `n`: **E³** `r=p+tv`; **H³** the **Klein model (rays
ARE straight)**; **S³** `r(t)=cos(t)p+sin(t)v`, faces are 2-spheres, `tan t = −⟨p,n⟩/⟨v,n⟩`; **orbifolds** the ray
**reflects** (`v ← v − 2n⟨v,n⟩`). *(design ADR 0004, Amendment 2.)*

**Precisions (2026-07-13).** *(a)* **"The view shows π₁" is an OVERCLAIM** — it exhibits the deck group's **ORBIT** (count,
growth, which copies return mirrored, which corridor leads where). Say **orbit**, never "π₁ is shown". *(b)* **The three
decks are told apart by WHAT IS DOWN EACH CORRIDOR.** In a **bare** room T³'s three generators are *genuinely*
indistinguishable — marking them would be a lie. **Populate the room with several of the person's forms, set apart**, and the
corridors separate themselves. *This is why the room must not be empty.* *(c)* The scene form goes in the **middle**, and its
chirality must be **legible** (the Klein bottle, not the Möbius blob). *(d)* **OPEN CRAFT:** the interior still renders as a
grey clay model — it drifts toward the photoreal solidity the **build-guard forbids**. Method settled; **ink not settled.**
