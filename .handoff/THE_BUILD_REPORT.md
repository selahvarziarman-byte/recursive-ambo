# THE BUILD REPORT — F.0d: the question takes the stage

**coder · 2026-08-21 · cut `3147763` on base `312a394` (gitignore ruling) on `1727998` · branch `team-arman`**

---

## 1 · WHAT I SAW — drove the real app, the same route, at the frame he is in

Fresh origin (`127.0.0.1:5181`, fresh vite on the audited tree, virgin state). Real Chrome. Route: Manuscript → `load the reference zoo` → double-click `T³ — identified cube` → `aperture — build a 3-manifold` → faces `A·D·C·B` ↔ `E·F·G·H` → map `a→e · d→h · c→g · b→f — preserving (derived)`.

**Door closed, T³ selected (untouched behaviour):** the specimen rises; the finished coloured diagram holds the stage seat, marks and all.

**The door opens — ACCEPTANCE CLAUSE 1: ✔ SEEN, without knowing where to look.** The seat changes occupants in place: the coloured diagram vanishes (F.0c) and **a large pale wireframe cube stands exactly where it stood** — top-centre, above the risen body, ~140×170 px, unmissable, nothing else near it. It is unmarked and uncoloured (the live-build ink), which reads correctly: a skeleton awaiting identification, visibly NOT the finished answer. The risen body needed **no move and no dim** — the seat is above its silhouette, which is why mount 1 was always legible there.

**Two faces picked, no map — ACCEPTANCE CLAUSE 2: ✘ NOT MET, and placement cannot meet it.** The wireframe stays large and plain but **nothing on it says which two faces are picked** — census: zero mark meshes; the frame is indistinguishable from the no-faces frame. Mechanism, measured last build and unchanged: a pairing row is dropped from the live DomainModel until its MAP lands (`pairs: []` pre-map, the `~2597` grounded fact). The mark that would say *"these two, map pending"* is exactly **F.0b — the pending mark**, which §5 of this mandate holds parked. Routed below.

**Map picked — ACCEPTANCE CLAUSE 3: ✔ TWO DISTINCT THINGS.** Two burnt-orange pair marks (`#b0561b`) appear on the wireframe at the stage — **two clearly separate dots ~30 px apart** (near-face mark larger, far-face smaller — depth reads correctly), each ~12 px across. Last build these were 4 px apart inside a 17×27-px speck; now they are the first thing the eye lands on. Census agrees: 2 mark meshes at world (0, 8.3, 18.15) and (0, 8.3, 21.85) — on the two paired faces.

**Door closed again (regression):** the coloured finished diagram returns to the seat; the wireframe dies with the panel. **The seat alternates with the door — the question while open, the answer while shut — and the two are visually unconfusable (pale unmarked ink vs coloured marked diagram).**

Evidence (untracked): `scripts/app-leg/f0d_stage_map_marks_full.jpg` · `f0d_stage_skeleton_marks_zoom.png` (the wireframe + both marks, zoomed).

## 2 · WHAT I RAN — the witness list, verbatim

**1 · Tree identity:** the audited sim `dcf7c6e` and the real cut commit are byte-identical trees:
```
git diff --stat dcf7c6e 3147763   → (empty)
```

**2 · Freeze manifest, per touched file:**
```
193:NOT_FROZEN src/manuscript/ManuscriptView.tsx — manuscript view seam under active mandate churn — ratified per-build by its own witnesses
.gitignore / .handoff records — not manifest subjects
```
No frozen file touched ⇒ **3 · re-seal: n/a.**

**4 · Types + suite at the audited tree:**
```
npx tsc -b        → exit 0
112
FAIL scripts/diagnose-dual-inspection.cjs
SUITE-DONE at dcf7c6e
```
`diagnose-the-aperture` needed **no recut this time**: the F.0c pin names the door on both mounts and the relocation preserves both armings (`summoned && !apertureOpen ?` untouched; `apertureOpen && liveApertureDomain` still gates the live mount within the pin's window; exactly two `<InkedDomain` sites).

**5 · The reading** — §1, led by the eye as the acceptance demands.

## 3 · WHAT I CHANGED

- **`.gitignore` + `.handoff/THE_BUILD.md` + `.handoff/THE_BUILD_REPORT.md` — commit `312a394`,** implementing §4's ruling: the ignore yields for exactly the two record files (`.handoff/*` + two negations — the `instruments/*` idiom, because git will not descend into an excluded directory to honour a child negation). Seat mail stays ignored; verified with `git check-ignore -v`. The F.0c report entered history in the same commit.
- **`src/manuscript/ManuscriptView.tsx` — the cut, one site:** the live mount's group moves from `apertureTarget.home + 3.0 · scale 0.68` (the row — the F.0c speck) to **the stage**: `position={[riseTo[0], riseTo[1] + 3.05·dim3Scale·riseScale, riseTo[2]]}`, `scale={0.68·dim3Scale·riseScale}` — the seat the finished diagram vacated, composed from the same identifiers mount 1's seat multiplies through its parent chain (`riseTo`, `scaleCtl.dim3Scale`, `specimenCtl.riseScale`, seat constants 3.05/0.68). Composed at one top-level site rather than duplicated per band because **the door's target IS the selection** (`apertureTarget = targetFor(selected)`, :2459) and every `selectable` — dim3 or written — damps to `riseTo` when selected: one seat serves every volume the door can open on. Arming, name, and the InkedDomain call are byte-unchanged; the stale F.0 comment is recut with the code.

**What I did NOT change:** the risen body (needed neither move nor dim — measured by eye at the seat), mount 1, the panel, F.0b.

## 4 · WHAT I COULD NOT REACH

**Acceptance clause 2, routed — three lines:**
1. §3 accepts only if *"two faces picked ⇒ he can see which two"*, but pre-map the substrate drops the row (`pairs: []`, grounded `~2597`) — there is nothing for any placement to show.
2. The mark that carries *"these two, map pending"* is **F.0b — the pending mark** (`68d6a14` / stash `d5adab1`), which §5 of the same mandate holds parked.
3. Clauses 1 and 3 are delivered at the stage; **clause 2 is exactly F.0b's cut** — say the word and it lands on this seat, already sanctioned and clean.
