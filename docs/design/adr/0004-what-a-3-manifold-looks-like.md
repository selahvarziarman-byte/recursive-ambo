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
~~A cone edge is an edge whose link closes in fewer (or more) copies than the Euclidean count — and that is **already
visible in the aperture**: the copies fan around that edge differently.~~ The singular locus needs **no invented glyph**;
it shows itself in the recession. Its *name* belongs to the **specimen**. **Do not draw an orbifold badge in the world.**

> ### ✅ **§4 IS RESTORED (2026-07-15). IT WAS RIGHT, AND I STRUCK IT WITH A PROOF THAT DID NOT APPLY TO IT.**
> *(I first "corrected" §4 on 2026-07-14, ruling **"there is no cone edge; nothing winds."** The researcher has since **WITHDRAWN** the claim that gave me that, and it was hers to withdraw. **§4's cone edge is real.** My correction was the error.)*
>
> ### **THE FORM HAS TWO SINGULAR SETS — and each office held one and called it the whole.**
> | | **TOPOLOGICAL** | **METRIC — *this is §4, and it is the one a person SEES*** |
> |---|---|---|
> | what | isolated **POINTS** (folded-edge **midpoints**; RP² vertex link) | **CONE EDGES** — an edge-class whose dihedrals miss 2π |
> | codim | 3 (a point) | **2 — an AXIS** |
> | test | the gate (χ=1 ⇒ RP²) | **edge-class SIZE**: `k` cube-edges carry `k×90°` ⇒ **flat ⟺ k=4; any k≠4 is a cone edge** |
> | seen? | **invisible** — no winding, no focusing; **hygiene, print nothing** | ### **★ RAYS WIND AND FOCUS. This is the only part of the singularity a person will ever see.** |
> | how many | 200 points, in 97/97 forms | **61 of 97 forms** (180°×108 · 270°×32 · 540°×16 · 720°×24) |
>
> **★ The tell: the 43 FLAT (`k=4`) sound manifolds carry ZERO cone edges — which is exactly why T³ always rendered cleanly.** *"The copies fan around that edge differently"* — **your sentence, and it was true.**
>
> **What was genuinely wrong in the old §4 is only the LOCATION of the topological certificate** (the non-manifoldness is an isolated **point**, not the edge). **Both readings live together.** And the instruction inside §4 stands as written: **no invented glyph · no orbifold badge in the world · the name belongs to the specimen.**
>
> **⛔ AND THE TRAP THAT FOOLED BOTH OFFICES (LAW 20):** a cone edge is exactly where **Poincaré's condition fails** ⇒ for `k ≠ 4` **the cube is NOT a fundamental domain**, so **a deck group fitted to the face maps is not the form's group** (for 76 of the 97 it folds the cube onto itself — it even produced *mirror planes* that had been **proven** impossible). **Never derive the singular set from a fitted deck group. Read it from the GATE and the EDGE-CLASS SIZES.**
>
> ### ⚠⚠ AND THE MARK IS **NOT** THE MIRROR-CLUSTER *(researcher's own correction; binding on Amendment 3)*
> **Measured:** all **97 folded** forms have **w₁=1** — **but so do 57 of the 79 SOUND MANIFOLDS.**
> **⇒ The mirror-cluster marks `w₁ ≠ 0`, NOT non-freeness.** *A mark true of the thing and also of its opposite is not a mark.* **57 genuine manifolds produce it identically.**
> **THE REAL MARK IS THE ORBIT COLLAPSE — and it IS the definition, not a symptom.** *Non-freeness **is** a smaller orbit:* a free action never lets two copies share a position, so **the copy-count is CONSTANT everywhere**; at the fold the stabiliser is **ℤ₂ = {1, −I}**, so **the orbit is HALF the size there.**
> ### **The copy-count DROPS at the singular point, by exactly the stabiliser order (2) — and it is COUNTABLE BY EYE** (a form placed there appears superimposed with its own mirror image: **two copies in ONE place, which never happens in a free action**). **LAW 8 satisfied honestly.**
>
> **⚠ THE HONEST BOUND THE WORLD MUST CARRY:** **from a static frame, with no form near the singular point, the NON-MANIFOLDNESS IS INVISIBLE** — and *it should be*, because **away from that point the space IS a non-orientable manifold.** The certificate is the **GATE's** (the RP² link), **not the eye's.**
> ### **The aperture may claim `w₁` from the EYE. It may claim the FOLD only from a PROBE.**
>
> ### ★ **AND THE SHARPEST STATEMENT OF THE GUARD (designer, 2026-07-16 — adopted into canon):**
> ### ***"An ε² hole sized so it reads is the orbifold badge wearing the costume of honesty."***
> **⇒ The RP² point prints NOTHING. It is a GUARD in the tracer, never a mark on the page — not even a "small honest hole."**
>
> **And the refusal at the singular point is HYGIENE, not a phenomenon** *(the designer was right and the researcher has said so)*: an isolated point causes **no winding and no focusing** — `ℝ³/{±I}` is 2-to-1 and a straight line near `0` **stays straight** — so a near-miss ray is perfectly well-behaved and **the refusal will essentially never fire.** **Enlarging the hole so that it "reads" would be a FABRICATED MARK.** *(An axis would have given us something to draw. A point gives us nothing — which is precisely why the **orbit**, not the point, must carry the meaning.)*

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
- ~~**Orbifolds** — the ray **REFLECTS** instead of transporting: `v ← v − 2n⟨v,n⟩`. (The mirrored cube; the mirrored
  hyperbolic dodecahedron.)~~
  > ### ⛔ **WITHDRAWN 2026-07-14 by the mothership (my ratification error, not the designer's craft).**
  > **That is the MIRROR law, and it needs an object this engine forbids.** A mirror wall is **codim-1** — a face glued to **itself** by a reflection. `faceIdentification.ts:316` **throws** on a self-paired face; `:348` enforces a **perfect matching**. **No Build-1 form has a mirror wall. The mirrored cube is UNREACHABLE.**
  > **Our 97 folds are on EDGES — codim-2 — a CONE AXIS, not a mirror.** There is nothing to reflect about.
  > **§4 of this very ADR had it right 110 lines earlier** (*"a cone edge is an edge whose link closes in fewer (or more) copies…"*). **The two halves disagreed; the substrate sides with §4, and §4 governs.**
  > **No new ray law is needed:** every face is paired, so the ray always has a partner to transport into — the committed **`p ← g(p), v ← R·v`** already carries it. **What blocks the orbifolds' body is a DOOR (`apertureModel.ts:446`), not the tracer.**
  > **Shipping the reflect law would draw a MIRROR where the engine has a CONE — a body that looks right and is a LIE.**
  > *(A reflection orbifold is a legitimate future object — but it means relaxing `:316`, which would break the subdivision cure's precondition. **A different build, deliberately chosen — never smuggled in through a render.**)*

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
> **unsupported caption on a

---

## AMENDMENT 3 — THE FOLD IS A POINT, NOT AN EDGE. §165 is withdrawn; §4's RULING survives and its OBJECT is corrected. (2026-07-14)

Two corrections landed together, and they are a pincer: the **mothership WITHDREW §165** (the borrowed orbifold-reflect law)
and said **§4 was right**; the **researcher** says **§4 NAMES THE WRONG OBJECT**. Both are correct.

### 1 · §165 — WITHDRAWN. It was a borrowed mechanism with no reachable object here.
I imported Ray-VR's mirrored-cube rule (*"orbifolds — the ray REFLECTS: `v ← v − 2n⟨v,n⟩`"*) **accurately, and uselessly**:
a mirror wall is a face glued to **ITSELF** by a reflection (**codim-1**), and our engine **forbids a self-paired face**
(`faceIdentification.ts:316` throws; `:348` enforces a perfect matching). **The mirrored cube is UNREACHABLE in our
substrate.** Every face is paired, so the ray **always** has a partner to transport into — **no new ray law is needed at all.**
What blocks the folded forms' body is a **DOOR** (`apertureModel.ts:446` returns early on `folded`), **not the tracer.**
> **Shipping it would have drawn a MIRROR where the engine has a POINT — a body that looks right and is a lie.**
> **LAW 17 — a borrowed mechanism must be checked for REACHABILITY in our own substrate.** *An external mechanism arrives
> with its own example; check the example against your substrate before adopting the law.* **I carried it in. Recorded.**

### 2 · §4's OBJECT — CORRECTED. It is an isolated POINT, and nothing winds.
§4 read the fold as *"an edge whose link closes in fewer copies than the Euclidean count"* — **that is a CONE EDGE, a
singular AXIS, codim-2. We do not have one.**
**Researcher-measured on `8a009e0`, all 97 folded pairings: 200 of 200 fold fixed-points have a vertex link with
`components = 1, χ = 1` — i.e. RP². ZERO read S².** So the local model is **ℝ³/{±I} — the CONE ON RP²**:
- the singular set is an **ISOLATED POINT (codim-3)**, **not an edge**;
- the local group is **ℤ₂ = {1, −I}** — the **point-inversion**; **det = −1 ⇒ ORIENTATION-REVERSING**;
- **it is NOT a manifold** (a cone *axis* would be; this is not).
> **THERE IS NO AXIS. NOTHING WINDS. Strike every word of §4 that says "edge", "axis", "winds", or "fans around".**

### 3 · §4's RULING — SURVIVES, and is now cheaper and truer than what I wrote over it.
**No badge. No glyph. No orbifold mark of any kind.** The singular point **shows itself** — and what it shows is better than
the winding §4 promised:
> **A MIRROR-CLUSTER AROUND AN ISOLATED POINT.** Every copy reached *through* the fold comes back **handed the other way**
> (det = −1). **Chirality needs no ink: the pointing hand comes back a LEFT hand, around the point.**
**The countable claim** (Law 8 — seal the count, never the metric): *"N of the M hands around this point are LEFT hands."*
**Produced by the tracer. Never by me.**

### 4 · ★ THE INK OF THE REFUSAL — and I decline to inflate it.
A ray that **hits** the singular point has **no geodesic continuation**. The researcher's law: **the body must REFUSE
there, not interpolate. An honest hole IS the finding; a smooth pixel is a lie.** Accepted, and here is its ink:

> **We already have the ink for a hole: THE PAGE.** Our own ink law says **the void is PAPER** — adopted for the build-guard,
> for a completely different reason. **A refused ray is an un-hit pixel, and an un-hit pixel is bare paper.**
> **The hole in the page IS the hole in the space.** *No new mark. The manuscript already knew how to draw nothing.*

**But I will not pretend it is a phenomenon.** The refusal locus is **measure-zero**: it will draw as **at most a pinprick**,
and a viewer **cannot distinguish it from empty page**. So:
> **THE REFUSAL IS A CORRECTNESS LAW FOR THE TRACER, NOT A MARK FOR THE VIEWER.**
> **Enlarging the hole so that it "reads" would be a FABRICATED MARK — the orbifold badge, wearing the costume of honesty.**
> **The PHENOMENON is the mirror-cluster. The refusal is hygiene.**
- **Do NOT anti-alias, blur, or interpolate across the refusal.** A refused sample contributes **paper**, never a neighbour's colour.
- **Do NOT snap, thicken, or dilate it.** It is a point. Draw a point's worth of nothing.

### 5 · WHAT I HAVE **NOT** DONE — and will not seal until I have (LAW 7)
**I have not rendered a folded form.** The door is shut. **The mirror-cluster above is a PREDICTION from the researcher's
local model, not a look I have seen.** Per my own practice rule — *render every probe alone, first; check a witness from
outside the thing it witnesses* — **I will not seal how it LOOKS until I have traced one.** *(I asserted a mechanism from a
glance once already this week — the "grieving masks" — and it was false. Not twice.)*
**Open the door and I will dial it. Until then this amendment rules the OBJECT and the LAW, and stops short of the look.**

## AMENDMENT 4 — THE LOOK IS SEALED. I traced a folded form. (2026-07-14)
Amendment 3 stopped short of the look and said *"open the door and I will dial it."* **The door was shut in the PRODUCT. It
was never shut to me.** I enumerated the person's door in my own tracer (`dihedralMapCandidates` × 3 = **512**, of which
**97 FOLDED** — the researcher'

## AMENDMENT 5 — THE MARK IS THE ORBIT COLLAPSE, NOT THE MIRROR. And my own witness had a gap. (2026-07-14)

### 1 · ⛔ AMENDMENT 4 §2 IS WITHDRAWN AS A MARK OF THE FOLD
I captioned *"22 of the 39 hands are LEFT hands"* as the folded form's mark. **The researcher measured: all 97 folded forms
have w₁ = 1 — AND SO DO 57 OF THE 79 SOUND MANIFOLDS.** *(A mark that is true of the thing and also of its opposite is not a
mark.)* **The mirrored copies mean NON-ORIENTABLE, never NON-MANIFOLD.** The count stays — its **meaning** is corrected.

### 2 · ★ THE FOLD'S MARK — the ORBIT COLLAPSE. Derived here, from the geometry, with no topology.
A **free** action never lets two copies share a place. A **non-free** one does — that is what non-freeness *is*.
> **MEASURED (my deck group, same form):**
> **generic point → 429 deck words → 429 DISTINCT images (ratio 1.00 — FREE).**
> **singular point → 429 deck words → 189 DISTINCT images (ratio 2.27 — THE ORBIT COLLAPSED).**
**Countable. No ink. No badge.** It is the only thing that separates the 97 from the 57.
**HONEST LIMIT:** *proven numerically; I have NOT yet made it LEGIBLE in a frame.* `outputs/the_orbit_collapse.png` shows the
probe on the singular point and **the collapse does not yet read by eye.** **The look is NOT sealed. Craft owed.**

### 3 · ⚠ MY WITNESS HAD A GAP — and closing it changes the map
My fixed-point search **only found ISOLATED fixed points** (`det(I−R) ≠ 0`). **Elements whose fixed set is a LINE were
silently dropped.** Closed:
- **Isolated fixed points in the cell: 12 = 8 CORNERS + 4 FACE CENTRES** — all det = −1; the exact **point-inversions
  (R = −I) are at the FACE CENTRES.** ***Not*** 12 edge midpoints.
- **NON-ISOLATED fixed sets: 9 — fixed LINES, det = +1**, one through **(−1, 0, 1) — an EDGE MIDPOINT.**
> **⇒ In this form the edge midpoints are ROTATION AXES (det = +1) — cone AXES, and ℝ³/rotation IS a manifold.**
> **The NON-MANIFOLD points (R = −I) are at the FACE CENTRES and CORNERS.**

### 4 · ⚠⚠ A LIVE DISCREPANCY — I do not claim the researcher is wrong; I claim what I measured
Her census: the RP² (χ=1) classes sit at **folded-edge MIDPOINTS in all 97**. My geometry: the R = −I points sit at **face
centres / corners**, and the edge midpoints carry **orientation-PRESERVING** axes. **She could not decode my door keys
(`d+0 · d+1 · d-2`), so we may not be looking at the same form.** **Either our forms differ, or the combinatorial singular
vertices and the geometric fixed sets disagree. This must be reconciled BEFORE 0.2 seals on a probe aim.** *(She is right that
an assumed location is how a true mark dies — and that cuts both ways.)*

### 5 · ★ HER ε-EXPONENT READING — accepted, and I did not know I had made it
> **The ε-scaling exponent of the refused pixels IS the CODIMENSION of the singular set.**
My data: ε × 10 ⇒ px × 77 ⇒ exponent **1.89 ≈ 2** ⇒ **codim 3 — a POINT.** *(An axis would give ∝ ε¹; a mirror ∝ ε⁰.)*
**A third witness, from a pixel count, with no topology in it.** It also makes *"print no hole"* airtight: the hole is `ε²` —
**entirely manufactured by the tolerance.**

## AMENDMENT 6 — TWO SINGULAR SETS. §4's CONE EDGE IS RESTORED. My location claim is WITHDRAWN. (2026-07-15)

### 1 · ⛔ MY AMENDMENT-5 LOCATION CLAIM IS WITHDRAWN. The researcher was right.
I claimed the singular points were *"8 corners + 4 face centres — **zero** edge midpoints."* **False. MEASURED, directly:**
```
edge:10bado1 (FOLDED)  midpoint [0, 1,−1]   STABILISER = 2   (orientation-reversing: 1)   ← FIXED
edge:1hmvkhh (FOLDED)  midpoint [0,−1, 1]   STABILISER = 2   (orientation-reversing: 1)   ← FIXED
```
**The folded edges' midpoints ARE fixed, by an order-2 stabiliser containing exactly one orientation-reversing element** —
her ℤ₂ = {1, −I}, exactly where she said it was. **My enumeration silently dropped precisely the elements that fix them.**
> **THE ORBIT COLLAPSE, AT THE PLACE IT LIVES: 429 deck words → 224 distinct images. Ratio 1.92 ≈ 2 — the stabiliser order.**
> *(My earlier corner figure, 429 → 189 / ratio 2.27, is not an integer and is not trustworthy. The midpoint is.)*

### 2 · ⚠ BUT HER DIAGNOSIS OF MY BUG IS WRONG — and it matters, because it is about LAW 20
She ruled my deck group invalid because *"for k ≠ 4 the cube is not a fundamental domain."* **Measured on my form:**
> **EVERY edge class has k = 4. ZERO cone edges. The form is FLAT ⇒ the cube IS a fundamental domain ⇒ my fitted group WAS
> this form's group.**
**My error was not the domain. It was an INCOMPLETE FIXED-SET CLASSIFICATION** — I enumerated only *isolated* fixed points
and mis-binned the rest. **That is LAW 18 (an elimination needs a closed list), not LAW 20.** *(LAW 20 stands as a law — it
simply was not my bug. Two of us mis-diagnosed the same error, in opposite directions.)*

### 3 · ★ §4's CONE EDGE IS RESTORED — for the METRIC
The form has **TWO** singular sets, and each of us had been holding one:
| | **TOPOLOGICAL** | **METRIC** |
|---|---|---|
| where | isolated **POINTS** — folded-edge **midpoints**, link RP² | **EDGE-CLASSES with k ≠ 4** (cone angle = k × 90°) |
| codim | **3** | **2 — an AXIS** |
| rays wind? | **no** | **YES — they wind, and < 2π FOCUSES them** |
| visible? | **no** (measure-zero; the ε² law) | **YES — this IS the visible geometry** |
| in the 97 | **all 97** | **61 of 97** |
> **Restore every word of §4 that says *edge · axis · winds · fans around* — FOR THE METRIC.** The non-manifoldness is at a
> **point**; the **winding** is at the **edges**. **Both are real, and only the second can be seen.**

### 4 · HOW TO READ EACH — never off a fitted group again
- **cone edges ⟸ EDGE-CLASS SIZES** (`k ≠ 4`) — combinatorial, exact, already computed.
- **topological points ⟸ THE GATE** (`folded-edge` class → that edge's **midpoint**).
**Both from the engine. Neither from a fit.**

### 5 · WHAT IS OWED (mine)
**My form is FLAT — it has no cone edges, so nothing winds in it.** **To SEE the winding I must trace one of the 61.**
**The look of the cone edge is NOT sealed.** *(And the key decode is broken: `d+0·d+0·d+0` is **not** T³ — it carries k=2 cone
edges. My T³ control was built from explicit translation maps, never from keys. The researcher's inability to reproduce my
pick has the same root.)*

## AMENDMENT 7 — ★ THE APERTURE IS A PLACE, NOT A PICTURE. The shipped aperture is a STILL, and that is MY specification error. (2026-07-15)

### 1 · WHAT SHIPS
`ManuscriptView.tsx:703` calls `traceAperture` inside a `useMemo` keyed on `[dim3All, placedForms, shapeById, apertureCtl]`.
**No `eye`. No `forward`. No camera dependency.** It traces ONCE from a default viewpoint and paints the result on a plane as
a `THREE.DataTexture`.
> ### **THE PERSON CANNOT MOVE INSIDE THEIR OWN MANIFOLD. THE APERTURE IS A STILL.**

### 2 · ⛔ THIS IS MINE, AND THE FAULT IS EXACT
**Every mail I sent the engineer specified INK** — the void is paper, the crease term, the hatch, the echo fade, the tone
curve. **Not one of them said the EYE MUST MOVE.** Ray-VR — the source I brought in and built the whole doctrine on — is a
**walkthrough**, and I reduced it to a plate. **I specified a picture where my own doctrine demanded a place.**
*(And the doctrine says so in its own words: "a 3-manifold is a **HABITAT**, not a specimen." A habitat you cannot enter is a
diorama.)*

### 3 · WHY IT HAPPENED — the architecture forced it (MEASURED, one CPU thread)
| resolution × echoes | time | rate |
|---|---|---|
| **168² × 6 — what ships** | **1.2 s** | **0.8 fps** |
| 512² × 6 — interactive | 10.5 s | 0.1 fps |
**A CPU ray tracer in JS cannot be walked through.** I handed the engineer a CPU tracer and ink recipes; a picture is what he
could build. **The still was the honest consequence of my spec.**

### 4 · ★ THE RULING — the aperture becomes a FRAGMENT SHADER
**Not too heavy: this is trivial on a GPU.** Each pixel is an independent loop of ≤ `level` transports plus a few
intersections; Ray-VR runs it in **VR at 90 fps**. We are **already in three.js** (`ApertureView` builds the texture today).
- **transport** → GLSL loop; the deck isometries are `uniform mat4 g[N]` (from the engine, unchanged).
- **eye / forward** → the person's camera, per frame.
- **scene** → **bake the probe m
---

## Amendment 8 (2026-07-14) — **THE WINDING IS DRAWN. And the cone edge announces itself as a MIRROR at half-turn.**

**Status:** measured, in the instrument, on the engine's own pairing. Nothing here is inferred.

### 8.1 · What a person actually sees when they turn around a cone edge

Select an edge; the room carries you around it. **Count doors.**

| | k = 4 edge (flat) | **k = 2 edge (CONE)** |
|---|---|---|
| after 2 doors (180°) | nothing | **the room comes back — MIRRORED.** Your right hand is a left hand. |
| after 4 doors (360°) | the room comes back true | the room comes back true |

**The cone edge is not drawn with ink. It is drawn with a HALF-TURN.** On a flat edge the room takes a
full turn to return. On a cone edge it returns at *half* a turn — and returns *handed the other way*.
**That is the phenomenon, it needs no badge, and it is countable by eye: doors, and the hand.**

### 8.2 · Why the ambient picture could never have shown it (LAW 20, earned the hard way)

Fitting deck isometries to the face maps is **exact** (residual 0.000 on all six faces — the fit is not the bug).
And yet, on every k = 2 edge:

> **the complex closes the cycle at 2 cells, while the composed isometry NEVER becomes the identity.**

**That is not a contradiction — that is the definition of a cone.** The holonomy around the edge is a
non-trivial, orientation-reversing element that *holds the edge fixed*. **A cube tiling of E³ cannot close
it**; it unwinds the cone into its **double cover** — which is precisely the 4 doors the observer walks.

> ### **LAW 21 — A GLOBAL TILING CANNOT CARRY A CONE.**
> An ambient deck group fitted to the face maps silently renders the **flat double cover** of a cone form.
> **The transport must be CELL-LOCAL** (leave face *f*, re-enter its partner by the face map — the ray never
> leaves the cube). *Our ray transport already was; only my RETURN TEST was ambient, and so it reported "not
> yet returned" at the very moment the cone was speaking.*

### 8.3 · The rule I gave is CONFIRMED — by measurement, not by intuition

Census over all 512 cube-door forms, edge-class size *k* vs. the true dihedral cycle *L*:

- **k = L on all 6144 edges. Zero exceptions.**
- **"cone edge ⟺ k ≠ 4" and "cone edge ⟺ L ≠ 4" disagree on 0 of 512 forms.**
- **61 of the 97 folded forms carry a cone edge — the same 61.** The cone angle **is** k × 90°.

**§4 stands, and now it stands on a run instead of on my word.** *(I had asserted the angle from the class
size without ever walking the cycle. It happened to be true. It was still an unearned claim — and I only
found that out because the instrument disagreed with me and I believed the instrument.)*

### 8.4 · Three bugs, one lesson

1. **The rotation sense is a pseudovector.** Through a mirror door (det = −1) the turn keeps its axis and
   **reverses its sense**: ω ← det(R)·R·ω. Rotating about the naive R·d sent the observer back out the door
   it came in. **T³'s doors are all det = +1, so the flat form was structurally incapable of exposing this.**
   *A control that cannot fail is not a control — the folded form was the only witness.*
2. **The return test was a metric tolerance** (`|eye − home| < 0.12`), which knew nothing about *which copy*
   the observer stood in. **Replaced by a word: the room has returned when the accumulated door-word is the
   identity.** *(My own countable-captions law, broken by me, in the very instrument built to obey it.)*
3. **The edge was re-found by nearest-neighbour search** each door. **Replaced by transport:** the edge is
   carried by the isometry, exactly as the rays are. *Search where you can transport, and you will drift.*

### 8.5 · **The observer CARRIES a frame, and the space is allowed to TAKE it** (Arman caught this)

*"The flips are applied to the orbiting itself — every 180° the spin changes between clockwise and counterclockwise."*
**He was seeing something real, and it was not the orbit.**

- **The motion never reverses.** Developed into one fixed frame, the observer's path around the edge is
  **monotone: 315° swept, 0 reversals.** It is a true circuit.
- **The CAMERA was reversing.** The heading was stored as a **yaw/pitch pair**, which silently re-imposes a
  **RIGHT-handed frame every single frame.** So when a mirror door handed the observer back *reversed*, the
  render **denied it** — and a denied mirror has to go somewhere. It came out as **the spin flipping**.

> ### **LAW 22 — HANDEDNESS IS STATE THE OBSERVER CARRIES, NOT A CONVENTION THE RENDERER RE-IMPOSES.**
> Store the observer's frame as a **carried basis** (fwd, right, up), transported through every door by the
> face map — **det = −1 included.** A frame rebuilt from angles cannot become left-handed, so a renderer that
> rebuilds it **cannot show a mirror**, and will pay for the lie somewhere else in the picture.

**Verified:** the observer's handedness now tracks **sign(det W)** at every door, on every edge tested — it
flips **exactly** when the door-word says it does, and never on its own. On a cone edge the observer is
**LEFT-handed for precisely the half-turn in which the room is mirrored**, and comes back right-handed at 360°.

**And the phenomenon is now clean:** *you cannot carry a consistent handedness around a cone edge — the space
takes it from you and gives it back.* The spin no longer flips; **you do.**

---

## Amendment 9 (2026-07-14) — ⛔ **§8.1 IS WITHDRAWN. The half-turn mirror is NOT VISIBLE, and I captioned a picture that does not contain it.**

**Arman caught this by LOOKING.** *"Only the prose on the screen tells me that I am flipped. Everything else
remains the same, except for a glitch every time the flip is supposed to happen."* **He is right, and the
failure is mine, and it is a repeat offence.**

### 9.1 · The measurement that kills it
The room repeats after turning Δθ about an edge **iff the rotation by Δθ about that edge is itself a deck
element.** Enumerated Γ (195 elements) and tested Δθ ∈ {90°, 180°, 270°, 360°}:

> **The room repeats at 360°. On EVERY edge. Cone (k=2) and flat (k=4) alike. In BOTH forms.**
> **Nothing repeats at 180°. There is no visible half-turn. There is nothing on the screen to see.**

**§8.1's table is false as rendered, and I am striking it.** What I actually measured in §8.1 was that the
**door-WORD** holds the edge and has det = −1 at door 2. That is an algebraic fact **about the word**. I
promoted it to a claim **about the picture** without ever rendering the picture. *That is the same error as
"48% of the coils," and this is the third time in this arc.*

### 9.2 · Why there is nothing to see — and it is LAW 20, which I wrote and then walked past
> ### **A DECK TRANSFORMATION IS INVISIBLE FROM INSIDE. That is what a quotient MEANS.**
> The scene is invariant under exactly the transformation applied to the observer, so the image from the
> transported pose is **identical, pixel for pixel**. **An observer can NEVER see their own handedness flip.**
> No experiment inside the room reveals it. **Handedness is only ever visible by COMPARISON.**

And the deeper one, which retires §8.2's optimism:

> ### **LAW 21 (STRENGTHENED) — A CONE FORM HAS NO E³ DEVELOPMENT AT ALL.**
> I wrote *"the transport must be cell-local — our rays already are."* **They are not.** The cell-local step
> **IS** the ambient generator; composing them **reconstructs Γ**, and **Γ has no cone**. Four cubes go around
> every edge because four cubes are what fits in flat space. **I have been rendering the flat DOUBLE COVER and
> calling it a cone.** *My own memory says it: "for k≠4 the cube is NOT a fundamental domain, so a deck group
> fitted to the face maps is NOT the form's group." I quoted that law at the mothership and then broke it.*

### 9.3 · What survives, and what it costs
- **SURVIVES — the census (§8.3).** k = L on all 6144 edges; the 61 of 97 are the same 61. **Combinatorial,
  independent of the render.** The cone edges are REAL. *They are simply not in this picture.*
- **SURVIVES — LAW 22 (§8.5), as engineering.** Carrying the frame is correct; rebuilding it from angles
  rendered the **mirror of the true view**, which was a falsehood. **But it draws NOTHING** — removing a false
  mark left an empty screen, and I filled the emptiness with a caption. ⚠ **Strike the caption.**
- **DEAD — 0.2 as chartered.** *"0.2 must draw the winding"* **cannot be satisfied by this method.** The
  winding is not renderable from a fitted ambient deck group, at any level of care, ever.
- **★ THE ONE MARK THAT IS REAL AND VISIBLE: THE COPIES, NOT THE OBSERVER.** You never see your own flip.
  **You see THEIRS** — a chiral object's copies come back through mirror words as LEFT hands, in the same
  frame, next to the right ones. **That is a comparison, it is countable, and it is already on the screen.**
  *This is the mirror-cluster I ruled in Amendment 3 and then wandered away from chasing a phenomenon that
  does not exist.*

---

## Amendment 10 (2026-07-14) — ★ **AMENDMENT 9 IS ITSELF WITHDRAWN. THE WINDING IS REAL, VISIBLE, AND I HAVE NOW RENDERED IT. §8.1 IS RESTORED — CORRECTED.**

**I withdrew the winding on a measurement taken from a form that could not contain one.** The researcher's
stratum table (2026-07-15) exposed it: a **FOLD** (`folded`, holonomy **reverses** the edge, det = −1) and a
**CONE EDGE** (`k≠4` **AND NOT FOLDED**, holonomy is a **rotation** about the edge) are **different strata.**
**My instrument's form was FOLDED. Its `k=2` classes were FOLDS. I never rendered a cone edge at all.**

### 10.1 · The render — same form, same code, both strata
Form `["d-3","d-3","d+0"]` (**sound**, carrying a k=2 cone class). Observer orbits cell-locally by the local
face map. The cube is a fundamental domain, so **pose-return IS image-return**:

| edge | stratum | doors | **the room comes back at** |
|---|---|---|---|
| k = 4 | flat (**control**) | 4 | **360° — a full turn** |
| **k = 2** | **TRUE CONE EDGE** | **2** | **★ 179° — A HALF TURN** |

> ### **THE ROOM COMES BACK AT HALF A TURN ON A CONE EDGE AND A FULL TURN ON A FLAT ONE — IN THE SAME FORM.**
> **Visible. Countable (doors). No ink, no badge, no prose. 0.2 HAS ITS MARK.**

### 10.2 · What was wrong with Amendment 9, precisely
1. **Wrong instance.** A folded form cannot carry a cone edge. **I found nothing and reported that nothing was there.**
2. **Wrong test.** *"The room repeats iff R_Δθ ∈ Γ"* **presumes a tiling group Γ.** A true cone form **has no Γ** —
   the developing map never closes. **I applied a flat-space criterion to a curved question, and it answered 360°
   because 360° is the only answer it can give.**

> ### **LAW 24 — A NEGATIVE RESULT REQUIRES A POSITIVE CONTROL.**
> Before reporting *"the phenomenon is not there,"* show the instrument **CAN** show it, on a case where it
> **MUST** appear. **A form structurally incapable of carrying the mark cannot testify against it.**
> *This is the third time in this arc that a control which could not fail let a false claim through. I named that
> failure myself in Amendment 8 — and committed it in Amendment 9.*

### 10.3 · What now stands
- **§8.1 RESTORED, corrected:** the mark is **the room returning at k×90° instead of 360°** — a **rotation**, not
  a mirror. *(The det = −1 "mirror at half-turn" of A8 was the FOLD's reversal, misread. That part stays dead.)*
- **The engineer's transport was correct all along**; the researcher's ruling (no development needed) is confirmed
  **by render**. **The door is refusing forms it can already draw.**
- **LAW 22 stands** (a deck transformation is invisible from inside; you see *their* flip, not yours) — **it is
  true, and it is a DIFFERENT mark from the winding.** Both are real. **We get both.**

---

## Amendment 11 (2026-07-14) — ★★ **THE FOLD IS VISIBLE. Three marks, three registers, each earned by a theorem AND a render.** Standing canon corrected.

> ⚠ **PENDING-ROUTE** *(marked 2026-07-16 by the designer; mothership-accepted, one line, no re-seal, not a retraction — nothing below is withdrawn)*: the three marks are **proven**, but **two of them have no person's route** — **THE WINDING** needs *turning* and **THE FLIP** needs *walking a meridian*, and the aperture's `eye`/`forward` are unwired (`ManuscriptView.tsx:709` passes no eye), so a still frame cannot carry either. **MIRROR-CLUSTER is reachable today** (`mirrored[]`, shipped). **The route lands with the camera** — mothership-ruled to **STEP 5, at the head of the post-field queue** (behind the field, against its own merit). *I sealed three marks without asking which a person could reach; that omission is marked here, not litigated.*

The researcher ruled the flip a **theorem** (both directions); I swept it (200/200, closed list) and rendered its
**condition**. Canon that said *"the fold is claimed by no eye"* is **withdrawn** (hers, ratified).

### 11.1 · The three marks — now fully separated
| mark | the person sees | ⟺ | register |
|---|---|---|---|
| **THE WINDING** | the room comes home **EARLY** — k doors, not 4 | **`k ≠ 4`** | cone **or** fold *(a rotation)* |
| ### **THE FLIP** | the room comes home **MIRRORED** — handed the other way | ### **THE FOLD** | *(a reflection; the meridian is `w₁=1`)* |
| **THE MIRROR-CLUSTER** | a chiral form's **copies** return left-handed | **`w₁ ≠ 0`** *(global)* | orientability, not the fold |

**EARLY and MIRRORED are INDEPENDENT AXES** — proven by the **72 folded `k=4` classes**, which come home at a
**full turn** (the winding is blind to them) **and mirrored** (only the flip sees them). *I found those 72 only by
re-running after catching LAW 18 on my own sweep.*

### 11.2 · Why MIRRORED ⟺ FOLD is a theorem, not my statistic (researcher's proof, recorded)
- **FOLDED ⟹ det = −1:** the fold's local group is `ℤ₂ = {1, −I}` (from the RP² link); the edge holonomy is that
  nontrivial element ⇒ `−I` ⇒ det = −1.
- **NOT FOLDED ⟹ det = +1:** a non-folded holonomy fixes the edge *direction*; a det = −1 isometry fixing a line
  pointwise is a **reflection in a plane through it** — a mirror — which would give `cube/~` a **boundary**. But
  `cube/~` is **closed** (perfect face matching). Impossible. ∎

My sweep (200/200 mirrored on folds, 928/928 true off them, **zero exceptions**) is the **confirmation** of the
theorem, not its ground.

### 11.3 · ★ THE CONDITION — rendered, not asserted (and it caught me)
`det = −1` is the **math**. **Seeing** it is a further claim with a precondition:
> ### **THE ROOM MUST CONTAIN A CHIRAL REFERENCE THAT DOES NOT TRAVEL WITH THE OBSERVER.**
> A **mirror-symmetric** room flips with the observer and **nothing disagrees — the flip is real and invisible.**

**Proven two ways:**
1. **Algebraic:** all **24 / 24** det = −1 frames preserve the cube-edge rod set ⇒ a rods-only room *cannot* show
   the flip, by construction.
2. **Rendered clean** (no manifold transport ⇒ zero noise floor): the det = −1 return leaves a **symmetric object
   0.0%** changed and a **right-handed helix 91.9%** changed.

⚠ **AND IT CAUGHT A LIVE ERROR OF MINE:** my first render of a rods-only room reported **19.7% changed → "the flip
is seen."** That 19.7% was **transport noise** in the throwaway tracer, not signal — the symmetry proof says the
true value is **0**. **I nearly captioned the noise.** *(Countable-captions law, one more time: the floor is not the
mark. Measure the signal against the floor, or don't print it.)*

> ### **LAW 26 — A VISIBILITY CLAIM MUST NAME ITS NOISE FLOOR.** *"X% of pixels changed" is meaningless until the
> floor (the same measurement where the true signal is provably zero) is subtracted. Render the null case first.*

### 11.4 · What is canon now
- **The FLIP is the fold's visible mark**, in motion, with a chiral reference at rest. The **orbit-collapse probe is
  secondary** (still valid; the flip is cheaper and catches the 72 `k=4` folds it cannot).
- **STILL TRUE:** a **static** frame shows nothing; the **isolated RP² point** stays invisible (a different object —
  the mark lives on the *edge* around it, not the point).
- **WITHDRAWN:** *"the fold is claimed by no eye."* **A moving observer with a chiral reference reads it directly.**
