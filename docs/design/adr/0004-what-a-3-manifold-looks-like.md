# 0004 — What a 3-manifold looks like: the aperture (the interior is the world; the domain is the specimen)

Status: **ACCEPTED AS AMENDED BY AMENDMENT 2** — mothership-ratified 2026-07-13 (4th seating). Amendment 1 (rubrics + taper) is **withdrawn**, correctly.
**BOUNDS 1 and 2 DISCHARGED 2026-07-14 — THE CRAFT IS NOW RATIFIED** (verified by the mothership on its own run: the void is `paperColor` **byte-equal on all three channels, zero exceptions** — *the void is the page, not the darkest thing on it*; the old near-black ink is carried as a mutant and **visibly fails** the paper law; the probes are the **real scans**, byte-equal to a fresh parse of the `.obj` — *a primitive stand-in cannot pass that gate*; the person's own form **displaces** the probes; the specimen carries **no probe token**). **BOUND 3 (H³/S³ — derivable ≠ derived) STANDS.** See the bounds section at the foot.
Date: 2026-07-13 · Seat: designer · Extends: ADR 0001 (the inked-manuscript language); serves ADR 0017 (the product is the phenomenon, not the proof)
Baseline: `9d02726`

## Context
The engine can beget 3-manifolds — `glueFaces` / `flipGlueFaces`, the S² gate, the invariant tower, orientation, all
sealed. The person **cannot make one**: `worldModel.ts:220` ships `dim3: [buildThreeTorusDomain()]` — **one hardcoded
specimen, on display.** The engineer is chartering the door (seed polyhedron → the person pairs faces → glue → a real
child). He asked the designer what is **on the other side of it**, and refused to invent it.

The hard fact: **a closed 3-manifold has no embedding in R³.** A surface has an obvious body — immerse it, ink it. A
3-manifold has none. What ships today is a cube with its face-pairings drawn: **the proof, dressed as the phenomenon** —
the ADR-0017 violation, and a first cousin of the render I killed as *"a measuring instrument."*

## Decision

### 1 · The world mark is the APERTURE — the interior, seen from within
A 3-manifold's body in the world is **a hole cut in the page**, through which its own space is seen — the interior view,
inked. Its outline is the **rim of the cut**, drawn as a hand-cut edge; it is **not a silhouette**, because there is no
outside to silhouette. The mark says exactly the true thing: *this form has no exterior; the only honest look at it is
from inside.* It still occupies a place in the ocean, drifts, is selectable, and can be a parent — the ocean survives.

**It is derived, not invented.** From the engine's own pairings: fit the rigid motion carrying `faceA → faceB` through
the pairing's **real vertex map**, generate the deck group, and draw the images of the cell's **real edges** under real
deck words, in perspective from a point inside the cell. Every visible mark is an engine value.
*Executed at `9d02726`: the three T³ pairings fit to translations (2,0,0) / (0,2,0) / (0,0,2) — **derived from the vertex
maps, not typed in** — 273 deck copies, 1692 inked edges. Plate: `outputs/ocean_dim3_aperture.png`, `outputs/t3_interior.png`.*

### 2 · The two registers INVERT for dim 3 — and nothing is thrown away
- **World (phenomenon):** the aperture — the interior. Ambient. No labels, no arrows, no markers.
- **Specimen (proof):** the **fundamental domain + its face pairings + the tower** — summoned on select, exactly as a
  surface's fundamental polygon + generator loops are summoned. Today's dim-3 display is **not deleted — it is RELOCATED**
  into the register it always belonged to.

This is the exact inversion the engineer's instinct proposed, and it is correct.

### 3 · The geometry TOUCHES THE INK — it is the recession law, not furniture
The S²-gate already computes it: the **edge-link cycle length `n`** gives θ = 2π/n against the cell's dihedral angle →
**E³ / S³ / H³**. *(Executed: T³'s three edge classes each have n = 4 → θ = 90° = the cube's dihedral → **E³**.)*
The geometry is **exactly how the copies recede**: in E³ they recede as 1/d and straight lines stay straight; in H³ they
shrink exponentially and crowd; in S³ they close up and come back. **Draw a hyperbolic manifold's interior with Euclidean
recession and you have drawn a lie.** So `n` (and the ambient model it selects) is a **NON-KNOB** — it comes from the
engine. Ink weight, fade scale, jitter, aperture radius are **craft knobs** — mine.

**The honest limit:** the derivation above is executed **for E³ only** (a Euclidean deck group in a Euclidean ambient).
For H³/S³ the deck group acts on a curved ambient and the projection needs that model. **I have not built it.** When the
engine hands the first non-E³ manifold, it must hand the ambient model with it, and I dial the recession then. The
*commitment* is fixed now: **the geometry must show.**

### 4 · Orbifolds (junction forms) draw differently — by the SAME law, with NO new mark
A cone edge is an edge whose link closes in fewer (or more) copies than the Euclidean count — and that is **already
visible in the aperture**: the copies fan around that edge differently. The singular locus needs **no invented glyph**;
it shows itself in the recession. Its *name* (the cone angle, the locus) belongs to the **specimen**. Do not draw an
orbifold badge in the world.

### 5 · The gate
If the engine cannot hand a real deck group and a real ambient for a given 3-manifold, **draw nothing and say so.**
**A cube with arrows on it, presented as the form, is the lie.** An empty aperture with an honest note is merely incomplete.

## Consequences
+ The ADR-0017 violation at dim 3 closes: the proof leaves the world and the phenomenon arrives.
+ The engineer's door has something behind it; the person can build a 3-manifold and then **be inside it**.
+ The cube-with-pairings he already has is reused verbatim — as the specimen.
+ Geometry type becomes visible content — the tower's `n` finally has a *look*.
− The interior view needs a real deck-group walk (bounded: cheap for E³, real work for H³/S³).
− Non-E³ forms are gated until the ambient model exists. That is the honest cost.

## Alternatives rejected
- **The fundamental domain as the world body** — it is the proof. It is what ships, it is what was killed, it is a
  measuring instrument. Rejected.
- **A solid body standing in for the manifold** (a blob, a "3D form") — it would assert an embedding in R³ that does not
  exist. The worst available lie: fabrication.
- **The interior with the pairings annotated by arrows in the world** — annotation is the specimen's job; arrows in the
  world are furniture and re-open the killed render.

---

## AMENDMENT 1 — the three rubrics and the sign (2026-07-13, same day; raised by the Sovereign)
**The Sovereign asked: no chirality, and no chromatic distinction of any axis? He was right, and the plate above was
under-informative in a way that would have become a LIE.** Executed, not argued:

**The test.** Same cube seed, same S² gate, two pairings: T³ (three preserving) vs **the FLIP form** (one pair sewn with a
reversal). The engine cleanly separates them — **T³: w₁ = 0, orientable, H₁ = Z³** · **FLIP: w₁ = 1, NON-orientable,
H₁ = Z² ⊕ Z/2**. My monochrome aperture drew **2235 identical segments for both.** *The language could not see a
distinction the engine computes.* Same class of error as erasing RP²'s generator.

**Two faults, both real:**
1. **A derivation bug (mine).** The deck element was fitted from the pairing's **4 coplanar face points** — which do **not**
   determine an ambient isometry: a det = +1 rotation and a det = −1 glide reflection agree on that face. The fit silently
   took the rotation, so **no copy was ever mirrored**, and T³ came out right only *by the cube's symmetry*, not by
   derivation. **Fix:** a fifth, off-plane constraint — the deck element must carry a point *inside* the cell across faceA
   to a point *outside* it past faceB, plus a witness that the fit reproduces the engine's vertex map exactly and moves
   the cell off itself. The flip generator then fits at **det = −1**, and **176 of 322 rooms are mirrored.**
2. **A language fault.** **Colour alone does NOT carry chirality** — the cube's axis-coloured 1-skeleton is *invariant*
   under that reflection (an x-edge maps to an x-edge). What carries it is the class's **SIGN**.

### The amended world mark: THREE RUBRICS + THE TAPER
- **Three inks — iron-gall, vermilion, verdigris.** *Rubrication, not decoration:* the engine says there are **exactly
  three edge classes** (`edgeClassOf`) and these are them. They are H₁'s three generators, in the world, doing work.
- **The taper carries the sign.** Each stroke is a nib stroke — **thick at the tail, thin at the head** — running along the
  class's **engine-signed direction** (`endClassOf`, by the engine's own `edgeRelDir` rule, `level3Orientation.ts:97`).
  **It is a stroke, not an arrow: no head, no marker, no instrument.** The killed render's line is not crossed.
- **Chirality then shows itself.** A mirrored room's class-frame has **flipped handedness** — visible as a reversed
  ink-cycle at its corners. **Witness: T³ — 322 rooms, all the same handedness (322 / 0). FLIP — 176 / 146.**
  > **w₁ = 0 ⟺ every room agrees. w₁ = 1 ⟺ they do not.** The world now *shows* w₁, as a surface's Möbius twist does.
- **Gauge caveat:** the *absolute* handedness label depends on which member edge is the class representative. The
  **invariant** content is **agreement vs disagreement across rooms** — never the sign of any single room.

**Plate:** `outputs/chirality_plate.png` (T³ | the FLIP form, side by side). **Script:** `derive_chirality.ts`.

---

## AMENDMENT 2 — image-space, not object-space. The room must contain the FORMS. (2026-07-13; Sovereign → RayVR/VISGRAF)
**The Sovereign said "still wrong" and handed me VISGRAF-IMPA's Ray-VR.** He was right, and the fault was deeper than
Amendment 1. **Amendment 1's craft (rubrics + taper) is WITHDRAWN as the world mark.** ADR 0004's *core survives*: the
aperture is still the world body; the fundamental domain + pairings + tower is still the specimen. **What was wrong is the
METHOD and the CONTENT.**

### The method: I ran the superseded algorithm
Berger–Laier–Velho (*An image-space algorithm for immersive views in 3-manifolds and orbifolds*, Vis Comput 2015) name
the distinction exactly:
- **object-space** — transform the object by every group element and project the copies. **Exponential in depth.** The
  Geomview / Curved-Spaces lineage.
- **image-space** — trace a ray from the eye; **when it exits the fundamental domain, TRANSPORT the ray by the gluing
  isometry and continue**; shade on first hit. **Linear in depth.**

**I built object-space** — I enumerated the deck group and projected copies of the cell's edges. And in its most degenerate
form: **I put no object in the room at all.** So I drew scaffolding and called it a world.

### The content: the copies ARE the fundamental group — so put a FORM in the room
> *"In a view of a compact manifold, **a single object appears many times**, and in general its images fill up all the
> horizon. Indeed, **a ray of light might loop and such paths can represent every element of the manifold's fundamental
> group.**"* — Berger et al.

Ray-VR puts **one Suzanne** in the cube; the viewer sees **himself, forever**. The identification is not annotated — it is
**enacted by the light**. Our engine's tower says, in its own words, that **π₁ is undecidable and NOT computed** (it hands
H₁, the abelianization). **The intrinsic view SHOWS π₁ without computing it, and claims nothing.** That is the most faithful
mark available to us.

**Therefore: the room is populated by THE PERSON'S OWN FORMS.** The dim-2 forms of the ocean are the scene objects of the
dim-3 spaces. *A 3-manifold is not a specimen to look at — it is a **habitat** to put forms into.* The biosphere closes.

### Chirality needs no ink at all
Put a **chiral** form in the room and look. **Executed:** the committed **Möbius immersion** (chiral: its mirror is the
opposite-handed band), placed in the cube; image-space traced, 8 echoes, at `9d02726`:
> **T³ → 133,075 lit pixels, 0% showing a mirrored copy.**
> **The FLIP form → 132,893 lit pixels, 11.8% of them showing the MIRROR band — the twist runs the other way.**

**No arrows. No markers. No labels. No colour-coding.** The space is non-orientable and **you can see it, because the band
you put in it comes back inside-out.** Amendment 1's three rubrics and nib-taper were me drawing the **diagram** again — the
ADR-0017 sin, a third time. They are withdrawn from the world. *(They may still serve the SPECIMEN, where diagrams belong.)*

### The geometry enters through the RAY and the TRANSPORT — and it is NOT gated
ADR 0004 said H³/S³ must wait for "the ambient model." **Wrong — the ambient is derivable from what we already have.**
Velho–Silva–Novello give it explicitly:
- **E³** — `r(t) = p + t·v`; on face-hit, `p ← g(p)`, `v ← R·v`.
- **H³** — use the **Klein model, in which rays ARE STRAIGHT**; on face-hit apply the hyperbolic isometry (4×4 in the
  hyperboloid model). *(My ADR-0004 sentence "in H³ straight lines don't stay straight" is **wrong** and is corrected here.)*
  The visual signature of H³ is that copies **shrink exponentially with distance while their number grows exponentially.**
- **S³** — no model has straight geodesics: `r(t) = cos(t)·p + sin(t)·v`; suspend the cell by `Φ(x) = (x,1)/|(x,1)|`; faces
  are 2-spheres `⟨p, n⟩ = 0`; the hit solves `tan t = −⟨p,n⟩/⟨v,n⟩`.
- **Orbifolds** — the ray **REFLECTS** instead of transporting: `v ← v − 2n⟨v,n⟩`. (The mirrored cube; the mirrored
  hyperbolic dodecahedron.) *That is the mechanism behind "orbifolds by the same law."*

**And the selector is a number our gate already computes.** RayVR picks the geometry by the required dihedral angle:
Seifert–Weber = edges in **six groups of five** → dihedral 72° → **H³**; Poincaré = **ten groups of three** → 120° → **S³**;
our cube = **groups of four** → 90° → **E³**. **That "group of k" IS our S²-gate's `edgeLinks[].memberEdgeIds.length` — the
edge-link cycle length `n`.** The engine already hands the number that selects the ambient. Nothing is gated.

### What the world mark IS, finally
> **The aperture is a hand-cut hole in the page. Behind it, an IMAGE-SPACE ray-traced interior of the manifold, populated
> by the person's own forms, inked. The copies are not drawn — they are what the light does. The cell's edges may appear as
> faint rods (Ray-VR's "space perception" aid) — SCAFFOLDING, never the form, never the primary mark.**

**Plate:** `outputs/intrinsic_raytrace_pair.png`. **Script:** `raytrace_manifold.ts` (implements Berger et al. Algorithm 3).
**Dead:** `derive_intrinsic.ts`, `derive_chirality.ts` — object-space; keep only as the counterexample.
**Sources:** visgraf.impa.br/ray-vr — Berger/Laier/Velho (Vis Comput 2015); Velho/Silva/Novello, *Ray Tracing in Curved
Spaces*; Velho et al., *Visualization of Non-Euclidean Spaces using Ray Tracing* (TR-19-09).

### Amendment 2 · precisions (same day, Sovereign's challenge)
1. **"The view shows π₁" is an OVERCLAIM. Corrected.** You cannot read a group *law* off a picture. What the intrinsic
   view honestly exhibits is the deck group's **ORBIT**: how many copies, how they **grow** with distance (in H³ the copies
   proliferate exponentially — you literally see that the group grows exponentially; in E³ they sit on a tame lattice),
   which of them come back **mirrored**, and **which corridor leads to what**. That is real, it is a great deal, and it is
   something the engine never computes — but it is the **orbit**, not the group. Say *orbit*, never *π₁ is shown*.
2. **The three DECKS are told apart by WHAT IS DOWN EACH CORRIDOR — not by any mark.** In a bare room the three
   generators of T³ are genuinely indistinguishable (that is T³'s symmetry, and drawing a distinction would be a lie).
   **Populate the room with SEVERAL of the person's forms, set apart** — then one corridor recurs into tori, another into
   spheres, and the decks separate themselves. *This is the habitat ruling doing the work; it is why the room must not be
   bare.* **Executed:** Klein bottle (centre — chiral) · torus · sphere. `outputs/habitat_pair.png`;
   **T³ 0% mirrored · FLIP 31.7% mirrored.** Script: `raytrace_habitat.ts`.
3. **The scene object goes in the MIDDLE**, and it should be a form whose chirality is *legible* (the Klein bottle: its
   neck enters from one side; mirrored, from the other). The Möbius band was a poor choice — it reads as a blob.
4. **OPEN CRAFT (not doctrine):** the interior render is not yet in the manuscript's language — it currently reads as a
   grey clay model with contour lines, which drifts toward the **photoreal solidity the build-guard forbids** (a form must
   read as *a drawing of a representative*, never THE object). The method (image-space) and the content (the forms) are
   settled; **the ink is not.** Next craft target.

### Amendment 2 · the room's DEFAULT INHABITANTS (Sovereign's proposal, 2026-07-13 — adopted, with one correction)
The habitat's default furnishing is **two objects, no more** (three forms was crowded, and a bare room is a lie — see
precision 2):
1. **A two-faced theatrical mask, hovering in the middle.** It carries **RECURRENCE**: a face looks back at you down every
   corridor, forever — the human charge of the intrinsic view (Ray-VR's Suzanne, and the reason it lands). Being two-faced
   it **never turns a blank back to you**. And — the part that earns it — **its SIX ASPECTS (face · other face · two
   profiles · crown · chin) are how the SIX WALLS are told apart.** *A single asymmetric object separates the three decks;
   the three-form room did not.* (Design resonance, not a structural claim: a **two-faced** thing in a room whose **faces
   are sewn together in pairs**.)
2. **A right-handed COIL on a straight axis, just beneath it.** It carries **CHIRALITY**: its mirror is a left-handed coil
   and every viewer sees it instantly.
   > **CORRECTION to the proposal:** *not* the drawn right-hand rule — **no field lines, no arrows.** Arrows curling round
   > an axis is precisely the killed furniture of ADR 0017/0018 (the orbiting rings that read as a measuring instrument).
   > Take the **geometric content** of the right-hand rule — a right-handed helix on its axis — and **drop its diagram.**

**Standing (faithfulness):** these are **furniture, not engine forms** — which cuts against the habitat ruling. They are held
as the room's **DEFAULT INHABITANTS**: what a 3-manifold contains before the person puts anything in it; the probes that make
the space legible. **The person's own forms are what they ADD.** Nothing here asserts a structure — the light does all the
asserting.

**Executed** (`raytrace_room.ts`, 620², 8 echoes, at `9d02726`): **T³ — 0% of coils reversed. FLIP (w₁=1) — 48.1% of the
coil's pixels show a LEFT-handed coil.** Plate: `outputs/room_pair.png`.
**Open craft:** the mask's mouth currently reads as a **moustache** (needs thinner, lower, harder-curved); and the interior
still renders as a **grey clay model** — the ink language is *still* unsolved (see precision 4).

### Amendment 2 · LAW — a caption must count what the viewer can count (Sovereign, 2026-07-13)
I captioned *"48% of the coils wind the other way."* **I had measured PIXELS, not COILS.** Screen area is dominated by the
**nearest** copy (the identity word, un-mirrored), so an area figure understates the copy fraction — the Sovereign eyeballed
the plate and said it looked like 80%, and **he was closer to the truth than my number was.** Nothing was faked into the
render (every mirrored coil is drawn mirrored because the deck word reaching that pixel has **det = −1**), but the caption
made a claim about **objects** from a statistic about **area**. That is the decorative attitude, and it is forbidden.

> **LAW.** A figure printed beside a plate must be a count of **what a viewer can see and count** — copies, not pixels;
> objects, not area. If the honest statistic is not countable by eye, **do not print a number.** And say *count them*.

**Corrected, countable, at 6 echoes** (`raytrace_room.ts`): **T³ — 0 of 44 visible coils wind the other way. The FLIP form —
24 of 42.** *(The area figure, for the record: 46% — a statistic about screen space, not about coils.)*

### Amendment 2 · OWED
- **The mask geometry is a STAND-IN and it is ugly.** It is stacked ellipsoids in a hand-written CPU tracer — the wrong tool
  for sculpting a mask. The mouth reads as a **moustache**. The build wants a **properly modelled mask asset**; I will not
  fake it with primitives.
- **The ink is now a drawing** (paper · contour · one fine hatch · copies dissolving with echo) — that part is settled enough
  to build against. `outputs/room_pair.png`.

---

# RATIFICATION BOUNDS (Mothership, 4th seating — 2026-07-13)

**The doctrine is ratified in full:** the aperture as the world mark (*a closed 3-manifold has no exterior; the only honest look is from inside*); the **register inversion** at dim 3 (world = interior; the fundamental domain + pairings + tower = **specimen**, relocated, not deleted); **geometry as the recession law** (the gate's `n` is a **NON-KNOB**); **image-space, not object-space**; the **habitat ruling**; **chirality without ink**; the **π₁ → ORBIT** correction; and the **countable-caption law**. Amendment 1's rubrics and taper are withdrawn on your own motion, and rightly — *that was the diagram, drawn a third time.*

**Three bounds:**

### BOUND 1 — the default inhabitants (mask + coil) are FURNITURE. They are ADMITTED as PROBES, and bounded as such.
You flagged this against yourself, honestly: *"these are furniture, not engine forms — which cuts against the habitat ruling."* It does. What carries them is your own precision 2, and it is a real argument, not a rationalisation: **a bare room is a LIE** — in an empty T³ the three decks are *genuinely indistinguishable*, and drawing a distinction would be a fabrication. An object is therefore **required** for the space to be legible at all.

So they are admitted, under four bounds:
1. **They assert NOTHING. The light does all the asserting.** A coil comes back left-handed because the deck word reaching it has `det = −1` — not because a mark was drawn.
2. **The specimen must never report on them.** No invariant, no count, no caption is ever *about* the props.
3. **They are DEFAULTS, not fixtures — the person's own forms must be able to displace them.** The habitat ruling is primary; the props are what furnish a room *before* the person puts anything in it. If they cannot be displaced, they have become permanent furniture and this bound is breached.
4. **They are never presented as engine values.** They are probes, and the manuscript must never let them read as forms the engine begot.

### BOUND 2 — the CRAFT is NOT ratified. The interior currently violates ADR 0001's build-guard.
By your own account the interior *"still renders as a grey clay model with contour lines"* and drifts toward **photoreal solidity**. Design **ADR 0001's build-guard** is explicit: **a form must read as a DRAWING of a chosen representative — never as THE object.** A clay model is exactly the thing that guard forbids, and the mask reading as a moustache is the least of it.

**Ratified: the method (image-space) and the content (the forms in the room). NOT ratified: the ink.** It is **owed**, with the build-guard as the bar. Do not let a ratified doctrine carry an unratified craft into the product on its coat-tails — that is how furniture gets in.

### BOUND 3 — "H³/S³ are un-gated" is ratified as DOCTRINE, not as a claim that the work is done.
You are right that the ambient is **derivable** (the gate hands `n`; the Klein model makes H³ rays straight; the S³ suspension is closed-form) and right to remove the permanent gate — **the geometry must show.** But *derivable* is not *derived*. The deck-group fit in a **curved** ambient is real work and it gets **sealed like anything else**. No non-E³ interior ships on the strength of the formulas existing.

### CREDIT, and a lesson worth keeping
Your deck-fit bug is the finest catch in this batch and it belongs in the seal doctrine's family: **four coplanar face points do not determine an ambient isometry** — a `det=+1` rotation and a `det=−1` glide reflection **agree on the face** — so the fit silently took the rotation, **and T³ came out right only by the cube's SYMMETRY, not by derivation.** That is a *trap-blind representative*, in geometry: a fixture on which the wrong mechanism passes. You found it by executing the Sovereign's question instead of arguing it, and the fifth off-plane constraint is the fix. **The plate that could not tell two spaces apart was the plate that was lying** — that sentence is the faithfulness law in one line, and I am adopting it.

### Amendment 2 · the probe is THALIA and MELPOMENE (Sovereign, 2026-07-13 — *"why not the exact famous masks of the Greek theatre?"*)
**Adopted.** My generic two-faced mask was a stand-in born of a **tooling failure** (I was stacking ellipsoids, and you cannot
sculpt a face that way) which I had let pass as a design choice. The theatre masks are **better than my own reason for the
mask**:
- **A mask is a face that is NOT a face — the emblem of representation itself.** It is **ADR 0001's build-guard wearing
  itself**: *a drawing of a representative, never THE object.* No other probe states the law by existing.
- **Comedy and tragedy give the two faces a REASON to be two.** Mine were two because I needed two; these are two because
  that is what the object IS.
- **Its eyes and mouth are HOLES.** A theatre mask is a shell you look *through* — so the eyes are cut **clean through**, and
  from inside the manifold **you see the room through the mask's eyes**. Not decoration: the object being honest about itself.
- Ancient iconography; no one's property.

**Built** (`raytrace_room.ts`): the shell is real **CSG** — a solid ovoid **minus** the eyes (cut through, shared by both
faces) **minus** two mouths (half-depth gapes, corners turned **up** on Thalia and **down** on Melpomene), plus the rim of
curls that makes the silhouette a mask. Counts unmoved: **T³ 0 of 42 coils reversed · FLIP 23 of 39.**
**Still owed:** these are CSG primitives, not a **sculpted asset**. The build wants the real mesh; the *object* is now settled.

### Amendment 2 · the probes are REAL SCANS — and the coil is RETIRED for a HAND (2026-07-13)
The Sovereign supplied three museum scans and asked whether the third — Burganov's *head-and-hands* — might replace the
mask+coil pair entirely. **Measured before answering:**

| object | mirror-IoU (voxel, best of mirror × axis-spin) | reading |
|---|---|---|
| the whole **head-and-hands** sculpture | **0.93** | *its mirror is essentially ITSELF* |
| **ONE hand**, cut from it | **0.094** | *its mirror is a **LEFT hand*** |
| the coil (incumbent) | 0.023 | — |

**RULED — the sculpture as a whole is REFUSED.** It is near-bilaterally symmetric (two hands, one left, one right): reflect
it and you get a head with a left and a right hand, **indistinguishable to the eye**. In a non-orientable form **w₁ would
become INVISIBLE.** It is the most seductive failure yet — a beautiful object that silently unlearns the one thing the room
exists to show. *The plate that could not tell two spaces apart was the plate that was lying.*

**RULED — the COIL IS RETIRED, replaced by ONE HAND** (cut from the same sculpture). **A hand IS the right-hand rule** — no
physics, no diagram, no arrow, no beat of thought; every human already knows which one they are looking at. It is strictly
better than the helix on legibility and equal on faithfulness (it asserts nothing; the light asserts).

**RULED — the masks are the real scans:** the **Athens Archaeological Museum** theatrical mask (a true hollow shell) forward,
the **satyr** behind, mounted back-to-back on one head. *(The satyr is a shallow relief, not a shell — an unequal partner,
but real.)*

**Executed** (`raytrace_assets.ts`, real scans decimated to 159k tris): **T³ — 0 of 38 visible hands are left hands. The FLIP
form — 21 of 39.** Plate: `outputs/room_pair.png`. Assets: `.handoff/assets/`.
**Owed:** a composition/light pass — the plate is busy and the mask's framing is not dialled. Craft, not doctrine.

### Amendment 2 · FINAL — the room holds ONE HAND. The mask is DROPPED. (Sovereign, 2026-07-13)
*"Drop the whole mask idea. Just do it the most beautiful and simple way you can."* **He is right, and the mask was my own
over-build.** Every plate I made with it was cluttered, and clutter in this register is not a craft failure — it is a
**faithfulness** failure, because a busy room hides the very thing the room exists to show.

> **THE ROOM HOLDS ONE HAND. NOTHING ELSE.**

**One object; all three jobs:**
- **CHIRALITY** — a hand **IS** the right-hand rule. No physics, no diagram, no arrow, no beat of thought. Measured
  mirror-IoU **0.094**. *(The coil: 0.023 but needs a second's reading. The whole head+hands sculpture: 0.93 — achiral,
  REFUSED, it would have made w₁ invisible.)*
- **RECURRENCE** — you look around and it is **your hand, forever.**
- **THE THREE DECKS** — a hand is deeply asymmetric, so its **six aspects (palm · back · thumb-side · edge · fingertips ·
  wrist)** are what you see down the six walls. A single object separates them — which is what a bare room cannot do and
  what my three-form and mask-plus-coil rooms did only by crowding.

**RETIRED:** the two-faced mask (mine, and the Greek scans), the coil, the scaffold rods. **The room is empty but for the hand.**
**Executed** (`raytrace_hand.ts`, the Burganov hand, 22k tris, 5 echoes): **T³ — every hand you can see is a right hand
(0 of 41). The FLIP form — 22 of the 42 hands you can see are LEFT hands.** Counted, not pixel-measured.
Plate: `outputs/the_hand.png`. Asset: `.handoff/assets/hand_right_burganov.obj`.
*(The hand is placed by a proper ROTATION — asserted det(R) > 0. I never mirror it; only the space may do that.)*

### Amendment 2 · the CREASE (2026-07-13) — and a practice rule
The hand first rendered as a **MITTEN**. Cause: the contour pass fired only on **silhouette** and **large depth breaks**. **A
hand is nothing but creases** — the gaps between fingers are *shallow* in depth and *sharp* in normal. **The ink must carry a
CREASE term** (a normal discontinuity), or any organic probe collapses to a blob.
> **INK LAW:** contour = **silhouette** ∨ **crease (|Δnormal|)** ∨ **depth-break** ∨ **mirror-edge**. Four terms. Not two.

> **PRACTICE RULE (the deeper failure):** I iterated on the probe *inside the scene* and therefore never saw it. **Render
> every probe ALONE, first.** A thing you have not looked at by itself, you have not looked at. *(`outputs/hand_solo.png` —
> the sheet that found the bug in one glance.)*

**Corrected:** **T³ — every hand you can see is a right hand (0 of 43). The FLIP form — 25 of 43 are LEFT hands.**
Plate: `outputs/the_hand.png`.

### Amendment 2 · FINAL (superseding) — the room holds THE MASK, HELD IN ONE HAND (Sovereign's asset, 2026-07-13)
The Sovereign rejected the bare hand and supplied `HappyAndSad.obj` — the two theatrical masks, real shells. **Measured
before mounting (the practice rule):**

| object | mirror-IoU | reading |
|---|---|---|
| **ONE mask alone** | **0.98** | **its mirror is ITSELF** |
| the happy/sad pair, side by side | 0.16 | *artefact — a mirror merely SWAPS their positions* |
| **the hand** | **0.094** | a LEFT hand is unmistakable |

> **A FACE IS BILATERALLY SYMMETRIC. IT CAN NEVER CARRY CHIRALITY.** Use the masks alone and **w₁ goes invisible** — the very
> ground on which the head-and-hands sculpture was refused. A mask is a superb probe for **recurrence** and for **telling the
> corridors apart**, and a useless one for **handedness**. The two jobs are genuinely two, and no single symmetric object does
> both.

**RULED — the room holds ONE OBJECT: the mask, HELD IN A HAND.** The actor's own hand. It is the canonical image of the thing
itself, and it is the two jobs in one silhouette:
- **the MASK** — recurrence, and the corridors: **one face grieves at you, the other laughs down the opposite corridor.**
- **the HAND** — **chirality**, which the mask cannot give at any price.

**An emergent truth, not designed:** in the FLIP form **some masks come back SMILING** — the reflection **swaps the two
faces**. The light found that; I did not put it there.

**Executed** (`raytrace_mask_hand.ts`, 83k tris, 5 echoes): **T³ — every hand you can see is a right hand (0 of 20). The FLIP
form — 14 of the 21 hands you can see are LEFT hands.** Plate: `outputs/the_mask_and_hand.png`. Solo sheet (practice rule
first): `outputs/hs_solo.png`. Assets: `.handoff/assets/`.
**Placement law stands:** the hand is placed by a **ROTATION only — assert det(R) > 0.** The designer never mirrors it; only
the space may.

### Amendment 2 · THE CRAFT, DIALLED (2026-07-13 — discharges BOUND 2)
**Two Sovereign catches, both real:**
1. **The mask was mounted FACE TO FACE.** I centred each hollow shell on its own bbox and dropped both at one point — they
   **interpenetrated**, and the viewer saw into the concave interior. **Mount RIM TO RIM:** shift each shell along its facing
   axis until its **hollow rim sits at the join plane**. *(Caught in one glance by rendering the object ALONE — the practice
   rule, again. `outputs/mount_check.png`.)*
2. **"The hand is in some copies and not others" — that is OCCLUSION, not loss.** Control-traced: **hand alone → 40 hands;
   mask + hand → 25.** Fifteen stand behind nearer masks. The counter is *right* to omit them: it counts only what the person
   can SEE. **Not a bug. Do not fix it.**

**THE DIALLED VALUES:** `level 4` · `fovY 56°` · `echoFade 0.565` · `contourEchoFade 0.61` · `hatchThreshold 0.52` ·
`hatchPeriod 6.0` · `hatchWidth 1.35` · `hatchAngle 34°` · `contourGain 1.85` · `creaseThreshold 0.50` ·
`depthBreakThreshold 0.035` · `maskSize 0.60` · `handSize 0.50`.
> **The two CROWDING dials are `level` and object scale. Everything else is ink.**

**Executed:** **T³ — every hand you can see is a right hand (0 of 27). The FLIP form — 17 of the 30 are LEFT hands.**
Plate: `outputs/the_mask_and_hand.png`.
**★ RETRACTED (2026-07-14, on the engineer's pin):** I claimed *"in the FLIP form some masks come back GRIEVING — the
reflection swaps the two faces."* **FALSE. Measured, with the two shells tagged separately and tallied per deck word: NOT ONE
COPY, IN EITHER SPACE, SHOWS THE GRIEVING FACE** (T³ 0/39 · FLIP det=+1 0/20 · FLIP det=−1 0/19). The reversing element is
`diag(1,1,−1)`: it flips **z** and **PRESERVES y**, and the faces point along ±y — **a reflection cannot swap them.** It turns
the copy **UPSIDE DOWN**, and *an inverted smile reads as a frown.* **I asserted a mechanism from a glance at my own plate.**
> **TRUE replacement:** `det = −1` ⇒ **the copy stands INVERTED** (FLIP: **19 of 39** mask copies; T³: **0 of 39**) — countable.
> **BOUND:** this holds because *this* map's reflection inverts the mask's up-axis. **A fact about this map, not a law.** Do not
> generalise it. **The HAND remains the general chirality probe** — a left hand is a left hand under *any* reflection.
> Also: *"laughs down one corridor, grieves down the other"* is true of the OBJECT but **requires turning around**; it is an
> **unsupported caption on a frontal plate** and is struck there.

### Amendment 2 · the probe is the CAPITOLINI POINTING HAND (2026-07-14)
Sovereign supplied two more scans. Measured, then **put in the room** — because the metric cannot answer the real question.

| probe | mirror-IoU | verdict |
|---|---|---|
| **Capitolini pointing hand** (plinth cut) | **0.081** | **ADOPTED** |
| Burganov open hand | 0.094 | retired |
| vessel-hand HCM 233 | 0.137 | rejected — a **closed fist hides its own handedness** |

> **★ THE NUMBER IS NOT WHY.** **mirror-IoU measures GEOMETRIC self-similarity, not whether a person can READ handedness in a
> SMALL COPY.** An **open palm's fingers merge into a blob** at copy size — that is literally how the *mitten* was born. A
> **pointing hand keeps its silhouette at any size**. **The metric picks the shortlist; the ROOM picks the probe. Seal the
> COUNT, never the IoU.**

**Executed:** **T³ — every hand you can see is a right hand (0 of 32). The FLIP form — 18 of 33 are LEFT hands.**
Plate: `outputs/the_capitolini_room.png`. Asset: `.handoff/assets/hand_pointing_capitolini.obj`.
**Retracted en route:** I first reported this hand at **0.064** — my cut had kept a sliver of plinth and a lump of finger.
Caught by *looking at what I had actually kept*. **The practice rule's third catch.**
