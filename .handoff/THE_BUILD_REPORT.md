# THE BUILD REPORT — W.7: the comparison is on the display

**coder · 2026-08-21 · cut `2398c08` · witness recut `6817dbb` · on `9442984` (mandate record) · branch `team-arman`**

---

## 1 · WHAT I SAW — walked the room myself, three circuits and then two more on a fresh window

Fresh origin (`127.0.0.1:5183`), real Chrome, the T³ zoo specimen, `explore inside — walk the habitat`. (One stall worth recording: the walk runs on `requestAnimationFrame`, which Chrome freezes for a backgrounded window — the drive needed the window foregrounded, and Arman brought it forward when asked.)

**First circuit closes** (diagonal heading): the return line arrives in its familiar slot — `back where you started · 7 doors · the room came back the same way up` — and the previous-return slot below it stays **empty**: nothing is invented on the first fire.

**Second circuit closes**: the plate now reads, in one glance, no scrolling, no memory —
```
back where you started · 11 doors · the room came back the same way up     (full ink, the familiar slot)
back where you started · 7 doors · the room came back the same way up      (faint — the circuit before)
```
Measured registers: current opacity 0.78, previous 0.45 — same ink family, same grammar, the just-closed one unmistakable because it is the full-ink line in the slot returns have always used. **The acceptance sentence, verbatim: he walks one circuit, then another, and sees both readings at once, and can tell which is the one he just closed.**

**Third circuit** (axis-aligned): the pair shifts again — `12 doors` over `11 doors`. Every close shifts; nothing flashes; both lines persist.

**A fresh window, then two axis circuits — the ruled singular, live:** first close prints **`back where you started · 1 door · the room came back the same way up`** — `1 door`, not the `1 doors` the substrate printed before this cut — and the second close puts above it:
```
back where you started · 2 doors · the room came back the same way up      (full ink)
back where you started · 1 door · the room came back the same way up       (faint)
```
Seam and DOM agree at every step (`__exploreWindow.returnLine` / `.previousReturnLine` === the two `data-explore-return*` nodes' text). Evidence frame, committed beside the leg artifacts: `scripts/app-leg/w7_two_returns_2doors_over_1door.png`.

**The honest duplicate** — the shift is **unconditional on the string having changed** (the code path has no equality gate anywhere between the fire and the two slots), so two circuits with identical readings show the same pair twice by construction. My circuits happened to differ in door count (the counter is cumulative over the walk, so successive closes rarely tie); the mechanism cannot de-dup because it never compares.

## 2 · WHAT I RAN — the witnesses, verbatim

**1 · Tree identity:** `git diff --stat 76d6c13 2398c08` → **(empty)** — the audited sim IS the real commit.

**2 · Freeze manifest, per touched file:**
```
186:NOT_FROZEN src/manuscript/ExploreWindow.tsx — THE GPU EXPLORE WINDOW (2026-08-08 reset, ADR 0004 Amdt 7) …
scripts/app-leg/winding_route_driver.py · diagnose-winding-route.cjs — not listed (outside the engine roots)
```
No frozen file touched ⇒ **3 · re-seal: n/a.**

**4 · Types + suite:**
```
npx tsc -b → exit 0
112
FAIL scripts/diagnose-dual-inspection.cjs
SUITE-DONE at 76d6c13
```
**112 @ 1 at the sim** (tree byte-identical to the cut commit `2398c08`); the accepted baseline only. The witness-recut commit touches only `scripts/app-leg/*` — outside the suite's glob — so the verdict carries to HEAD unchanged; tsc re-run at HEAD, exit 0.

**5 · The reading** — §1, at the eye, with the seam census beside it.

⚠ **One measured divergence, resolved by the ruling:** the mandate lists `1 door` singular among the FINAL strings, but the pre-cut substrate printed `${doors} doors` unconditionally — and the winding leg itself pinned `1 doors` (driver `:504`, clause label `:189`). The ratified strings win: the template now reads `1 door` / `N doors` (`0 doors` stays plural), and the leg's pins are recut to the ratified string (`6817dbb`). The leg is an app-driving witness (its own vite + Playwright session under the orchestrator); it was not run in this build — its next run bites on the recut want-string.

## 3 · WHAT I CHANGED

- **`src/manuscript/ExploreWindow.tsx` — commit `2398c08`, the whole cut:**
  - seam union: `previousReturnLine: string | null` (+ init, + the open-reset beside `returnLine`);
  - the producer: on every position-return, the standing line shifts to the previous slot **before** the new line takes the current one — no equality gating (the honest duplicate), both persist (W.5), nothing flashes;
  - the render: a second held line `data-explore-return-previous` under the current one — recessed register (opacity 0.45 vs 0.78), same ink family, own `minHeight` slot so the plate never jumps; two lines is the named cost, paid always;
  - the ratified singular in the line template.
- **`scripts/app-leg/winding_route_driver.py` + `diagnose-winding-route.cjs` — commit `6817dbb`:** the `1 doors` pins and the stale header comment recut to `1 door` (a label is behaviour; a witness pinning the dead string would fail the ratified one).

**Not touched, per the mandate:** the centroid-dot craft (§4 — hers), and nothing was chased on the fan acceptance (§2 — his).

## 4 · WHAT I COULD NOT REACH

Nothing in the mandate. Two notes, neither blocking:
1. The **`mirrored` / `turned` clauses were not exercised in this drive** — the committed T³'s straight circuits all read `the same way up` (all three pairs preserving translations); the other clauses live in the winding leg's cone/mirror rooms, whose recut pins now expect the ratified singular. W.7's mechanism is clause-blind (it shifts whatever string fired), so the coverage gap is the leg's, not the cut's.
2. The walk drive requires a **foregrounded** Chrome window (rAF freezes hidden tabs) — recorded here so the next drive doesn't re-diagnose it.
