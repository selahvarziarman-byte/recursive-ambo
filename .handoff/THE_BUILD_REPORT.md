# THE BUILD REPORT — the whole frame: two measurements routed, three strings landed, one death booked

**coder · 2026-08-21 · cut `9e39a13` · witness `346e678` · on `6cf6a09` (mandate record) · branch `team-arman`**

---

## 1 · PART A — MEASURED, NOT FIXED (both routed; both files frozen and untouched)

**The χ verdict, three lines:**
1. The card computes χ from the complex (`v − e + f − c`, `complex.chi`, carried) and prints the flag from `tower.chiConsistent`.
2. `level3Invariants.ts:85`: `chiConsistent: gate.sound ? complex.chi === 0 : null` — **the closed-3-manifold expectation (χ = 0), applied to EVERY sound complex unconditionally**; its own type comment (`:22`) says *"sound ⇒ (χ === 0); unsound ⇒ null — no closed-manifold claim"* — bounded-but-sound was not in that comment's world.
3. The fan chamber is sound with walls and χ = 1 (correct for a bounded body), so the closed-world check prints `INCONSISTENT` at the person — the comment-precondition family, on a frozen file; **whether a bounded room should read `n-a — bounded`, or χ against 1, is the researcher's meaning question.**

**"the identified cube", three lines:**
1. `specimenModel.ts:144` (frozen): `subtitle: 'fundamental domain · the identified cube (no body exists)'` — **a hardcoded literal in `readDomainSpecimen`.**
2. Every `DomainModel` card carries it — T³ truthfully, but also every cone room and the five-cell fan chamber; nothing about it is derived from the specimen.
3. **Stale copy on a generic surface, confirmed** — the replacement wording is the designer's; the mechanism (derive from the model's own title/shape) is a one-line consumer change once she rules.

## 2 · PART B — the three ratified strings, at the eye

Drove the T³ route and the fan-band route on a fresh origin.

- **The dots are DROPPED** (§3.1): a decided pair now draws as its two traced cycles with **exactly one tick each — the only dot on a trace, meaning "the cycle starts here"** — and nothing else; the mechanism is the live mount's own `markRadius={0}` dial (the frozen `InkedDomain` untouched; the finished specimen keeps its dots — no traces there, nothing to contradict). Evidence: `scripts/app-leg/ds_traces_no_dots_one_tick.png`.
- **THE LEGEND** (§3.2) stands under the figure, verbatim, in the walk's own idiom: *"dashed — not yet decided · solid — decided; the tick is its first corner, and the way it runs is how the faces meet · one hue to a pair."*
- **The dependency question, MEASURED:** the F.0e plate's "two blue treatments" are **ONE pending pair across two faces, one treatment** — census: both pending rings carry byte-identical dash material (`dashSize 0.09 · gapSize 0.07`, uniform: true; one code path builds every pending ring). The "dotted vertical" is the same world-space dash foreshortened by projection on the near-edge-on face. **The legend's first clause stands; nothing returns to the designer.**
- **THE FORCED-WALL LINE** (§3.3), live on the fan band, before any pick, quiet and plain (never the refusal register — the pristine refusal is italic; this is not):
  ```
  15 faces — 10 with three corners, 5 with four · a face meets only a face with the same
  corners, so 7 pairs is all this volume can make · one face stands as a wall whatever you choose
  …and a world has no walls — every face glued to a partner. One face with no partner is one
  wall that stays, so this closes into a room you stand inside, never a world.
  ```
  Every number derived from `apertureParityCensus` (boundary faces by corner class; pairs = Σ⌊count/2⌋; forced walls = Σ(count mod 2)); the consequence sentence is the researcher's verbatim, comment-flagged for the designer's compression. **On the cube the line says nothing** — driven and seen (the T³ panel shows only the subtitle). Evidence: `scripts/app-leg/ds_forced_wall_line_panel.png`.

## 3 · WHAT I RAN

```
npx tsc -b → exit 0
PASS apertureParityCensus (fan): {"total":15,"classes":[{"corners":3,"count":10},{"corners":4,"count":5}],"pairs":7,"forcedWalls":1}
PASS apertureParityCensus (cube): {"total":6,"classes":[{"corners":4,"count":6}],"pairs":3,"forcedWalls":0}
DIAGNOSE-OPEN-LIFT: ALL GREEN
112
FAIL scripts/diagnose-dual-inspection.cjs
SUITE-DONE
```
**112 @ 1** — the accepted baseline only; the run's tree is byte-identical to the cut commit (`git diff --stat 9a9fc49 9e39a13` → empty).
```
```
Census-beside-the-eye at each drive step: 2 zero-radius mark meshes (invisible by construction) · 2 ticks (radius > 0, one per decided trace) · pending dash materials identical. Freeze manifest: `apertureModel` · `ManuscriptView` · `ManuscriptChrome` all NOT_FROZEN; `specimenModel.ts` / `level3Invariants.ts` frozen and **untouched** (measured read-only). One stale 0-byte `.git/index.lock` removed (the standing recurrence).

## 4 · WHAT I CHANGED

- **`apertureModel.ts`** — `apertureParityCensus` (the §3.3 derivation, null on an unreadable menu) + the **#37 death-condition booked at the tail-match site**: *"when #37 re-roots carried DATA-BLOB refs by the load's own prefix (resolved by exact ===), delete `keyMatchesPillar` and match record keys by equality — until then this guard STANDS."*
- **`ManuscriptView.tsx`** — the live mount's `markRadius={0}` (with the §3.1 ruling in place); the legend Html under the figure; the parity memo + prop.
- **`ManuscriptChrome.tsx`** — the `parity` prop and the two quiet lines under the subtitle (shown only when `forcedWalls > 0`); corner counts as words per the ratified idiom, counts beyond the spelled range fall back to digits.
- **`diagnose-open-lift.cjs`** (`346e678`) — the parity census pinned both directions (fan: exactly one forced wall; cube: none — the silent case is a check, not an absence).

## 5 · WHAT I COULD NOT REACH

Nothing in the mandate. Two flags standing for the designer, in the code at their sites: the consequence sentence awaits her compression; the legend line's screen position (it can graze the wireframe's lower edge at some cameras) is hers to nudge. And one observation for the record: the loaded parcels' record strip shows *"⚠ integrity violations (shown, not hidden)"* — pre-existing on the load path, outside this mandate, named so nobody discovers it as a surprise.
