# THE BUILD REPORT — INTERIOR TRANSPORT: the fan turns

**coder · 2026-08-21 · cut `4c0d94e` · witness recuts `9e84390` · on `0780653` (mandate record) · branch `team-arman`**

---

## 1 · WHAT I SAW — the person's own chamber, built by the person's own route, coming home early

I built the fan chamber in the real app exactly as Arman would: SOURCES → the fan-lift and segment parcels through the file door → both dragged onto the paper → shift-click pairs them → **thicken — the band** → the band rides the shelf, dragged out → `aperture — build a 3-manifold (on open-lift(…) × I)` → **leave bounded** (*"left bounded — the free rim stands as walls · the chamber joins the dim-3 band"* — the subtitle honestly counting its 15 boundary faces) → the built room summons → **explore inside**.

**Inside, after walking the pillar circuit** (a driven loop through the ratified arc), the plate reads, verbatim:
```
Euclidean cone-manifold · n=[…] · cone edges (measured): 1 × 300° · the manifold ends here;
the orbit recurs only through the glued corridors · copies shown to depth 6
back where you started · 1 door · the room came back turned
```
**The acceptance sentence, live: a door count that is NOT 0, and the room came back turned.** No detector, no felt rotation — the room comes home EARLY, counted in doors (LAW 20), and W.7's singular (`1 door`) pays for itself on the first real cone. The heavy hatched pillar rod stands visibly in the room; the seam is invisible from inside, as a deck transition must be. Evidence: `scripts/app-leg/it_fan_chamber_1door_turned.jpg`.

**Two defects were found AT THE EYE during this drive and cured in the cut — neither was reachable by the in-process instruments alone:**
1. **The app's chamber refused to develop (`walls: 15` in the seam census)** while every in-process fixture developed. Measured to the root: `deserializeSnapshot` re-roots every id with the shelf prefix **but not the `dihedralAngles` record blob's keys** — GAP2C's exact data-blob class, live — and since the person's band always rides the shelf once more, the pillar-key match failed only on the person's route. Cure at the consumer: the record key matches by TAIL (either side may carry prefixes the other lacks), demanding EXACTLY ONE hit per cell — an ambiguous or absent record falls back to the union path rather than developing a wrong room.
2. **A re-opened room rendered a blank standing caption**: `seam.caption` was the one session fact the open-reset missed, so the change-gated DOM write never re-fired (seam 217 chars, DOM 0 — measured). One line adds it to the reset family.

## 2 · WHAT I RAN — the witnesses, verbatim

**The measurement that forced the mechanism** (instruments, gitignored): the fan's OWNED pillar wedges read [60,60,90,45,45] (Σ=300°) while its EMBEDDED wedges read [135,59,90,45,31] (Σ=360°) — the thicken embedding smears the deficit INSIDE cells, every shared-wall isometry fits identity (witness-refused), so no per-wall transform on the stored embedding can be honest. D6's own law names the cure: the intrinsic product is the OWNED stamps' — so the room is DEVELOPED from the records.

**The simulator (the committed replica), on the developed room:**
```
pillar circuit: returned=true doorsAtReturn=1 traceAtReturn=2 handedness=1 clamps=0
reading → back where you started · 1 door · the room came back turned
```
The trace shows one seam crossing per lap (+60° holonomy jump), deck trace 1+2·cos 60° = 2, never mirrored (det +1).

**The expiry pin failed exactly as designed and was re-derived (LAW 24 both ways):**
```
PASS (1a/1b) the single-cell cone control: 2 doors · deck trace −1 (the half-turn) — UNTOUCHED
PASS (2a) the fixture, DEVELOPED: 9 faces — 7 walls + 2 bounded seam portals — k=5 pillar rod
PASS (2b) ★ INTERIOR TRANSPORT, PINNED: 1 door · 0 clamps · trace 2 ⇒ `1 door · the room came back turned`
PASS (2c) the null-homotopy control: a loop NOT winding the pillar — 0 doors, identity (the seam never over-fires)
DIAGNOSE-WINDING-HEADINGS: ALL GREEN · DIAGNOSE-OPEN-LIFT: ALL GREEN (census recut 9/7/29)
```

**The app leg (its own server + three live sessions), first run at the cut:** the cone control passed LIVE (`2 doors · turned` + the retrace `2 doors · the same way up`), the mirror room passed (`1 door · mirrored`), and the E-leg exposed defect #1 above (stalled at 0 doors on the union room). After the tail-match cure:
```
PASS ★★ `2 doors · the room came back turned` (cone control, seam + DOM) · PASS ★ the retrace `2 doors · the same way up`
PASS ★ the pillar ENCIRCLED: THE LINE, VERBATIM: back where you started · 1 door · the room came back turned · doors 1
PASS ★★ `1 door · the room came back mirrored` (the fourth string, W.7 singular) · PASS no console error
DIAGNOSE-WINDING-ROUTE: ALL GREEN
```

**Types + suite:**
```
npx tsc -b → exit 0 (at the final HEAD)
112
FAIL scripts/diagnose-dual-inspection.cjs
SUITE-DONE at 9e84390
```
**112 @ 1 at the final HEAD** — the accepted baseline only.
```
```
(The 112 suite carries no pins on this surface — the winding witnesses live in `scripts/app-leg/`, all green above. The suite was also 112@1 at the intermediate sim `f9139aa`.)

**Freeze manifest, per touched file:** `196:NOT_FROZEN src/manuscript/apertureModel.ts` · `186:NOT_FROZEN src/manuscript/ExploreWindow.tsx` · app-leg scripts not listed (outside the engine roots). No frozen file touched ⇒ re-seal n/a. One stale 0-byte `.git/index.lock` removed (10 min old, no live git — the standing recurrence).

## 3 · WHAT I CHANGED

- **`src/manuscript/apertureModel.ts`** — `developedConeSurface`: behind live guards (>1 cell · every two-owner face is a quad sharing one pillar vertex pair · one simple cell cycle · exactly one dihedral record per cell · Σ(owned) < 2π − ε), the base fan is unrolled flat at its OWNED wedge angles, lifted ⊥ by the pillar's own fiber, recentered, the void aimed away from the walk's entry; the cycle-closing wall becomes a **bounded seam portal pair** with g = rotation about the pillar by ∓ the material span (det +1). `ApertureCellFace` gains optional quad `bounds`. The old filter's true-but-unguarded comment ("on an embedded product the charts coincide") is now **written as the guard**: only genuinely-flat products reach the union path. The rod-class law is hoisted so both room shapes read the one law.
- **`src/manuscript/ExploreWindow.tsx`** — bounded faces in the walk and the shader: a seam fires only on a genuine **segment crossing** (before ≤ 0 < after, pierce point inside the quad) — a point-only test fired 60° early on the measured circuit; the ray path already had exact-point semantics and gained the same quad test; packCell/uniforms carry the bounds; the caption joins the open-reset.
- **`scripts/app-leg/`** (`9e84390`, the recut commit): `windingWalk.cjs` mirrors the segment law (the replica must move with the window's law, by its own charter); `diagnose-winding-headings.cjs` 2a/2b re-derived to the ratified reading + the null-homotopy control added; `diagnose-open-lift.cjs` census 9/7/29; `diagnose-winding-route.cjs` FAN_PLAN re-planned for the developed coordinates + the E.circuit clause label and the driver's want-pin set to the ratified line (a witness that accepts any line pins nothing).

**Not touched:** `snapshot.ts` (frozen; the blob-key re-rooting is the standing 37/GAP2C work — my consumer-side tail-read carries what the substrate holds), the single-cell path (byte-identical in behavior — the C/M legs prove it live), the winding vocabulary (no new words anywhere).

## 4 · WHAT I COULD NOT REACH

Nothing in the mandate. Three notes:
1. **The person's chamber card says `Euler χ 1 (INCONSISTENT)`** — the bounded chamber's χ flag predates this build (visible on the card before the walk); it did not block the gate (sound) or the walk. Named, not chased.
2. The E-leg's first-run failure was **the find of the build**: the shelf round-trip's un-re-rooted `dihedralAngles` keys are exactly the researcher's priced "DATA-BLOB refs" gap — my tail-match reads through it, but the mint-side re-rooting remains theirs.
3. §2 stands: the fan acceptance is **Arman's** — he walks the pillar in his own fan and the sentence *"the same defect: blind identification"* dies at his hand. The room is ready for him.
