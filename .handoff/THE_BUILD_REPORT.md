to: the mothership (sixth)
from: the coder
**STAMP `B-115` — ECHOED.**

# 0 · THE ANSWER SHE NEEDS FIRST

> ### ⛔ **THE OLD FLY WAS NEVER THE PLATE'S ROUTE. HER RULING REMOVED NOTHING HERE.**
> **Source-confirmed at the commit before R1 (`1340293^`): the fly's own condition was `if (selected && selected.startsWith('w:'))`.** It fired **only for written forms** — never for a `dim1:`, `dim2:` or `dim3:` room. **An aperture plate belongs to a `dim3:` room, so the fly never framed one.**
> ✔ **And the same restriction still governs her own control: `hasSelection={selected !== null && selected.startsWith('w:')}` — `Fit Selected` is DISABLED while a room is selected, measured live.**

**She parked two rulings behind this. They can come off the shelf.**

---

# 1 · §3 — R2's CURE IS BUILT AND MEASURED

✅ **`THE LABEL STAYS.`** Her diagnosis carried the cure: **selection's job is to say WHICH THING IS SELECTED, and un-naming the thing is the exact opposite of that act.**

⛔ **The `hidden` prop is GONE, not passed `false`.** It stood for exactly one condition — *"this form is the selected one"* — and that condition has been ruled away. **A guard is correct to leave standing only while something it stands for still holds; this one had nothing left, and a dead prop is a door the same defect comes back through.** Five routes shared that one line, so the cure is one deletion.

✔ **AT THE EYE, and pinned so it cannot go away again:** the label now carries `data-form-label`, and the drive leg's new **§E-NAME** clause reads page labels **selected vs deselected — `13` and `13`.** Equal ⇒ selection removed no name; **before the cure this fell by one.**

⚠ **My first version of that clause matched the card's heading against the labels, read `None`, and reported a RED on a cure that was working.** ⇒ **The ruling is about a node LEAVING THE DOM, so a COUNT bites exactly there** — and a string-agrees-with-string comparison is the part that rots first. **Corrected before it was believed.**

★ **P5's collision is closed:** the page will no longer name a thing only once it is gone.

## 1.1 · ⚠ ONE CONSEQUENCE — REPORTED, NOT CURED (placement is form, and form is hers)

**The label rides the SpecimenLift.** So on the reference zoo, a selected form's name **comes to rest over the dim-3 row's aperture plate** — present and readable, but sitting in the plate's ink. **Its place was never a question while it was hidden; now it is one.** Plate captured. ⛔ **I designed nothing.**

---

# 2 · §2 — THE PLATE'S ROUTE, MEASURED (no cure, as ordered)

**Measured on the reference zoo at 1920×919.**

### (a) IS THE PLATE REACHABLE AT ALL, WITHOUT HUNTING? ✅ **YES, AND IT IS ONE GESTURE.**
| state | plate on screen | size | fraction of viewport height |
|---|---|---|---|
| default camera, nothing selected | **yes** | 139 × 139 px | **0.151** |
| **double-click the plate** → the room summons | **yes** | **418 × 418 px** | **0.455** |

⇒ **The plate is its own doorway: a person points at the thing and it grows 3×.** **No hunting, no chrome, no second gesture** — and it works at HEAD with `selection holds` landed.

### (b) WAS IT REACHABLE BY THE OLD FLY? ⛔ **NO — see §0. It was never that route.**

### (c) THE INVISIBILITY: ⛔ **TWO CAUSES, NOT ONE — AND NEITHER IS THE DEFAULT CAMERA.**
1. ⛔ **OCCLUSION BY THE RISEN SPECIMEN.** While any form is selected it rises to the specimen position and is **drawn in front of the dim-3 row.** Measured: with a dropped dodecahedron selected, the plate's projected box is **unchanged and `onScreen: true`** — and the body covers it. **Deselect and the plate returns whole.**
2. ⛔ **FORESHORTENING.** The plate is a flat `PlaneGeometry`. The default camera faces it; **any orbit narrows it** — measured **139×139 → 119×153 → 94×111** across two orbits, and B-113's post-load camera reduced a 3.6-unit square to **52 px wide against 218 tall.**

> ### ⛔ **AND A CORRECTION OF MY OWN B-113 SENTENCE.** I wrote *"the plates are invisible at the default camera."* **That named the wrong cause.** The plate is on screen at its correct size at the default camera; it was **occluded** and, on that page's post-load framing, **foreshortened**. ⇒ **The same law §0 of the last cycle bought, applied to me again: a measurement is a fact about the condition it was taken under, and my sentence carried a cause I had not measured.**

⚠ **And the fact that composes badly with the crowding, now with a number:** the plate at **0.151** of viewport height is where a shrink would have to read, and B-114 showed the shrink reads at **full window size** and not at thumbnail size. **The two facts are one fact: the plate is too small to carry that mark, and the window is not.** **Hers to weigh; I am only handing over the measurement.**

---

# 3 · WHAT I RAN

- **`npx tsc -b` → exit 0** · **folded sweep 121 @ 1** (`diagnose-dual-inspection`, the accepted baseline), 412 s.
- **THE DRIVE FAMILY by its trigger** (the label is its subject): ⇒ **the driver-clause failure set is IDENTICAL to the HEAD baseline — 16 clauses, every one pre-existing.** New clause `label.staysOnSelect` **passes**.
- `git diff --stat bbd4aa0 HEAD -- src scripts` = **EMPTY**.
- **Freeze:** `ManuscriptView.tsx` **NOT_FROZEN**. **No frozen file touched; no hash moved.**

**Verbatim:**
```
label.staysOnSelect: page labels — selected: 13 · deselected: 13
plate, default camera : 139×139 px · fracH 0.1512 · onScreen true
plate, room summoned  : 418×418 px · fracH 0.4546 · onScreen true
plate, after orbiting : 119×153 then 94×111 (a flat plane narrowing)
Fit Selected while a dim3 room is selected: DISABLED
the fly's own condition at 1340293^ : if (selected && selected.startsWith('w:'))
```

---

# 4 · ⛔ ONE STALE COMMENT SWEPT

The drive leg's caption capture justified itself by *"the selected shape's row label leaves the DOM (`hidden={selected === id}`)"*. **That precondition is retired by this build.** Capturing cold is still right — it brackets the journey at one known state — **but it is no longer a workaround for a vanishing node**, and ***a comment that keeps a retired precondition is a guard nobody wrote, aimed at a condition nobody has.***

---

# 5 · WHAT I COULD NOT REACH

- **Nothing in the mandate.** §3 built, §2 measured and not designed, nothing else chased.
- ⚠ **The label's new placement collision** (§1.1) — **hers**.
- ⚠ **The open tab** — you noted the guard-with-no-exit. **It held again this cycle** (I set `window.onbeforeunload = null` and the close still timed out), so it is not the page's own handler. **Server stopped, port released, tab inert.** Not chartered; named because you named it.

— the coder
