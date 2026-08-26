to: the mothership
from: the coder
clock (raw, verbatim): `Wed Aug 26 19:51 +0330 2026`
**STAMP ECHO: `B-112`.** ⛔ **THE ENGINE HALF LANDED. THE RENDER HALF IS A SECOND CYCLE — you asked to be told, and the answer is YES, with the reason measured.**

---

## TO THE MOTHERSHIP

**1 · ★★ A PERSON CAN BUILD THE SEIFERT–WEBER SPACE TODAY, AT THE DOOR, WITH THEIR OWN HANDS — I drove it end to end.** Load a dodecahedron through the *"load universe…"* door → drag it to the paper → open the aperture → pick six opposite-face pairs and their maps from the menus the engine offers → **glue**. The notice reads, verbatim:
> ### **`glued — H₁ Z/5 ⊕ Z/5 ⊕ Z/5 · the aperture opens in the dim-3 band`**
**The classical invariant of the Seifert–Weber space, printed to the person by the engine's own door, from a form they loaded and pairings they picked.** The dodecahedron draws in the manuscript's own ink with all twenty corners named; the built manifold takes its place in the dim-3 band beside T³. ⇒ **The route exists and it is not the seed picker — it is the FILE door.** *(The seed registry still offers only tetrahedron · octahedron · cube.)*

**2 · ⛔ AND HERE IS WHAT THAT PERSON IS THEN SHOWN — the acceptance's second half, in their own words, and it is your prediction confirmed at the eye:**
> ### **`Euclidean cone-manifold · n=[5,5,5,5,5,5] · cone edges: 6 × 450° · orbit (visible): 12 plaques`**
- **The label says EUCLIDEAN** on the form whose true realization is hyperbolic.
- **It prints a cone angle of 450° — more than a full turn — without comment.**
- **`orbit (visible): 12 plaques` — it is DRAWING**, copies and all, in the euclidean transport.
- ⛔ **Nothing anywhere tells them WHICH geometry they are looking at.** Your sentence was exact: *the person is never told the manifold they BUILT is not the manifold being DRAWN.* **The manifold is right (H₁ correct), the geometry is wrong, and nothing marks it.**

**3 · THE CUT — the transport carries a MODEL (`90ddb8d`), and the seam was the type you and I both named.** One 4×4 acting on the model's own 4-vectors: the same matrix multiply serves all three geometries and only the INNER PRODUCT differs. The consumer's loop is untouched. **FIELD 3 lands: the pairing isometries as in-model maps, FITTED from the person's carried corner correspondence and WITNESSED** — every carried corner must land on its partner (not only the ones the fit consumed), the model's inner product must survive, and a corrupted correspondence THROWS BY NAME rather than fitting a plausible transform to the corners it likes. ⛔ **The off-plane constraint is the committed law carried up: THE CENTRE MAPS TO THE NEIGHBOUR'S CENTRE ACROSS THE EXIT FACE — never centre→centre, since a gluing isometry carries the cell OFF ITSELF and fixing the centre would fit the one map a door can never be.**

**4 · ★★ THE SWING, and it is the instrument §8.2 asked for — the one an angle sum cannot give.** Walking the deck around a carried edge class must return the room to itself.
```
SEALED MODEL   Seifert–Weber (H³)  6 classes   worst turn 1.34e-5°   ← closes
               Poincaré      (S³) 10 classes   worst turn 1.21e-6°   ← closes
FORCED TO E³   Seifert–Weber       every class        137.1745°      ← fails
               Poincaré            every class         10.3047°      ← fails
```
**137.1745° is the principal reading of the ADR's +222.8255°** (a rotation by 222.83° about an axis IS 137.17° about the opposite one); **10.3047° is §4's −10.3048 exactly.** ⇒ **The transport CAN fail, which is the only reason its closing means anything.** ⛔ **And it is a WALK, not a product over a list**: you cross the door on the face you stand against, the edge is carried through by the person's own corner map, and the OTHER face flanking the image edge is the next door — returning to the starting (edge, face) in exactly `memberCount` steps or the class is refused by name.

**5 · ⚠ THE SCOPE ANSWER YOU ASKED FOR: YES, BIGGER THAN ONE CYCLE — and the remainder is now precisely two things, not a fog.**
- **(a) THE RENDER.** `traceAperture` is a euclidean image-space ray-marcher; giving it the model means the GEODESIC STEP and the PLANE-HIT test per model (E³ `p+tv` · S³ `cos t·p + sin t·v` · H³ `cosh t·p + sinh t·v`). That is a real build with its own acceptance (the copies visibly closing).
- **(b) THE LABEL.** `geometryFromTower` must SPEAK THE SEALED CLASS when a realization exists — carrying a tag, which is NOT re-inferring curvature and so does NOT re-open B.0's LAW-15 ruling (that ruling forbade INFERRING S³/H³ from `k`; carrying a sealed class is the opposite act). ⚠ **The wording is the designer's**, and so is whether the 450° line should say anything about being more than a full turn.
⇒ **Two things I did NOT do, deliberately:** I did not touch the label (person-facing copy, and it needs her), and I did not widen `apertureModel`'s `DeckTransform` (the render's shape should decide that type, not a guess made ahead of it).

**6 · ⚠ AND YOUR INTERIM-HONESTY QUESTION IS NOW LIVE, on measured ground rather than anticipated.** You wrote you would raise it if the build ran long. It runs long — **and §1 shows the exposure is not hypothetical: a person CAN build Seifert–Weber today, through the file door, and be shown a euclidean cone-manifold with a 450° edge and no mark.** I have added no caption (that is the reword-over-build disease, and you forbade it). **It is yours and the designer's.**

**7 · Two things caught by the build's own witnesses, both worth the record:** the transform solver first computed `P⁻¹Q` instead of `Q·P⁻¹` — a matrix that fits the points it was built from and nothing else — and the closure's first walk had no direction or edge-tracking. **Neither reached a green: the corner witness caught the first before any number was believed, and the not-closing measurement caught the second.** ★ *The witnesses I wrote for §8 caught my own two errors inside one build.*

---

## 1 · WHAT I SAW
§1 and §2 above, driven end to end on my own server (5174; 5173 untouched): the load door took the dodecahedron; the aperture offered all twelve faces with real corner names (`A·I·E·P·J · 5 corners`) and derived six rows; ten map candidates per opposite pair; the glue printed the Seifert–Weber H₁; the built body joined the dim-3 band; and its geometry line reads *"Euclidean cone-manifold · cone edges: 6 × 450°"*.

## 2 · WHAT I RAN
```
1  the folded sweep 121 @ 1 (dual-inspection, accepted) + tsc -b exit 0.
2  freeze: nothing frozen touched, no spend.
3  no re-seal owed.
4  §8's four legs green (the walk closes · the swing on both targets · field 3
   refuses an unwitnessable map · TRAP 1 structural).
5  THE READING — §1/§2, at the eye, with the sentences verbatim.
```

## 3 · WHAT I CHANGED
- **`src/lib/noncubeDomain.ts`** — the model-carrying transport (`Mat4`, `ModeledDeck`), field 3 (`realizePairingIsometries`, witnessed), the closure walk (`readDeckClosure`), and `euclideanControlRealization` (a SECOND producer, named: affine co-vectors for incidence, beside the direction-only ones the angle control needs — the two are not interchangeable).
- **`scripts/diagnose-the-noncube-domain.cjs`** — §8's four legs.

## 4 · WHAT I COULD NOT REACH / DID NOT DO
- **The render and the label** — §5, named as the second cycle.
- **The interim honesty** — §6, yours and hers.
- **`apertureModel`'s own types** — untouched on purpose; the render should shape them.
