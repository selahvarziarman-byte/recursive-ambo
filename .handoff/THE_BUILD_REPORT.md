# THE BUILD REPORT — F.0c: the ruled disarm, and what the eye then found

**coder · 2026-08-21 · cut `846737a` + witness recut `1727998` on base `61ea3e6` · branch `team-arman`**

---

## 1 · WHAT I SAW — drove the real app, the mandated route exactly, once

Fresh origin (`127.0.0.1:5180`, a fresh vite on the audited tree — port 5173 was squatted by an unknown server, and a fresh origin also guarantees no persisted state colours the drive). Real Chrome. Route: fresh page → **Manuscript** → `load the reference zoo` → **double-click** `T³ — identified cube` → `aperture — build a 3-manifold` → pair 1 faces `A·D·C·B · 4 corners` ↔ `E·F·G·H · 4 corners` → *(separately)* map `a→e · d→h · c→g · b→f — preserving (derived)`.

**Before the door (selection only) — untouched by the cut:** the specimen rises and the finished coloured domain diagram (mount 1) draws above it at eye height, pair marks and all. Unchanged, as it should be.

**Door open, NO map picked:**
- **Mount 1 is GONE the moment the door opens.** The top of the frame holds nothing but the faded row-1 exemplars. The disarm fires exactly at the ruled boundary, and only there.
- The **risen aperture body stays risen** (that rise is selection-driven — not this ruling's subject) and still owns the centre of the stage.
- **The live skeleton is on screen and I could not see it as a skeleton.** Scene census: the named group `live-aperture-skeleton` exists at world `(0, −7.5, 0)` — the T³ home slot + 3.0, at the row, not risen — holding exactly one `LineSegments2` of **12 segments** (the cube's 12 edges), ink `#918b7b`, and **zero marks**. Outline-and-nothing before any map, exactly as the `~2597` grounded fact predicts. But its **entire screen projection is a 17 × 27-pixel speck** near the bottom of the frame (extent (743,491)–(760,518) in a 1568×704 frame), and its **top half is tucked behind the risen body's lower silhouette**. With my eye — including a pixel zoom onto exactly that region — it reads as a stray fleck of pale ink escaping under the body's rim. I found it only because the census told me where to look. From the person's chair I would have said *"there is no skeleton."*
- Views placed at pick-time, seen working: *"pair 1: one face is picked and its partner is not — pick the second face, or clear the first to leave the pair open."* → then *"pair 1: pick the identification MAP (which vertex lands on which)."* The partner dropdown excludes the already-picked face. The map menu leads with the MAP — `a→e · d→h · c→g · b→f — preserving (derived)` first; every twisted entry announces `cone room · edges wind` on its own line-item. ADR-0024's order, as a menu.

**After the map is picked:**
- **The pair marks EXIST — and cannot be seen.** Census: 2 mark meshes appear on the live skeleton, pair-ink `#b0561b`, projecting to frame px **(751,502)** and **(751,506)** — **4 pixels apart**, inside the same 17×27 speck. A zoom onto those exact pixels resolves no orange at all. The mark pixels straddle the risen body's lower edge; an unnamed `PlaneGeometry` mesh — the risen specimen's image-space aperture plane, **26.9** units from camera against the marks' **47.3** — covers the mark pixel (bounding-box cover, and the eye confirms the body's ink is painted there).
- The panel completed the pair and offered `glue — the S² gate judges`. The route ends at the map; I did not glue.

**⇒ The mandate's binary ("was there and occluded" vs "draws somewhere useless") resolves as BOTH AT ONCE: the live mark draws, at the row, and from the frame the person is in it is simultaneously an order of magnitude too small (17×27 px at camera distance ~47; mount 1's diagram was ~200×140 px when it drew) and partly behind the risen body, which sits ~20 units nearer the camera — the grounded dz.** The ⚠ UNVERIFIED hypothesis (skeleton unfindable even after a map) is now grounded and refined: **not absent — unreadable.** Arrow‑8 (the census) passes; arrow‑9 (the eye) fails. A person cannot use this mark.

Evidence frames (untracked, beside the earlier drive artifacts): `scripts/app-leg/f0c_door_open_after_map_full.jpg` (door open, map landed, no mount 1, the speck under the body) · `scripts/app-leg/f0c_live_skeleton_speck_zoom.png` (the speck, zoomed).

## 2 · WHAT I RAN — the witness list, verbatim

**1 · Tree identity — the committed trees ARE the audited sims:**
```
git diff --stat 353e84e 846737a   → (empty)
git diff --stat c94bd7e 1727998   → (empty)
```
(`353e84e` / `c94bd7e` were the audited sim commits, soft-reset and recommitted with real messages, trees byte-identical.)

**2 · Freeze manifest, line per touched file:**
```
193:NOT_FROZEN src/manuscript/ManuscriptView.tsx — manuscript view seam under active mandate churn — ratified per-build by its own witnesses
scripts/diagnose-the-aperture.cjs — not listed in the manifest (outside the engine roots)
```
No frozen file touched ⇒ **3 · re-seal: n/a** — no hashes recomputed, nothing sealed, positive control not applicable this build.

**4 · Types + suite at the real HEAD `1727998`:**
```
npx tsc -b        → exit 0
112
FAIL scripts/diagnose-dual-inspection.cjs
SUITE-DONE at 1727998
```
**112 @ 1** — exactly the accepted baseline, at the real HEAD.
⚠ **Measured discrepancy in the doctrine's literal command:** `npx tsc -b --noEmit` exits 1 — `tsconfig.json(20,18): error TS6310: Referenced project '…/tsconfig.node.json' may not disable emit.` The root tsconfig already carries `noEmit: true`; the CLI flag conflicts with the composite reference project. The repo's real instrument (what `npm run build` runs) is plain `tsc -b` — that is what I ran, exit 0 at every audited tree. Config-level, pre-existing, unrelated to this cut. CLAUDE.md §5's command line should read `npx tsc -b`.

⛔ **The suite was NOT 112@1 on first contact with the cut.** First full run: **112 @ 2** — `dual-inspection` (the accepted baseline) **plus `diagnose-the-aperture`**: its mount-census pin regexes the literal PRE-ruling arming, `/summoned \?[\s\S]{0,400}<InkedDomain/` (`diagnose-the-aperture.cjs:436`). The ruling changes that arming, so the pin was asserting the exact shape the ruling forbids. Recut in its own commit (`1727998`): the pin now requires `summoned && !apertureOpen ?` and the check's title names the door on the specimen mount. **The falsifier ran in both directions:** at the cut, the recut script exits 0; the new regex against the BASE view returns `false` (a door-blind revert now fails the suite); the old regex against base returned `true` (sanity — it was indeed the pre-ruling pin).

**5 · The reading** — §1 above. The drive ran at the audited tree, on a fresh origin, from the person's default camera; nothing persisted coloured it.

## 3 · WHAT I CHANGED

- **`src/manuscript/ManuscriptView.tsx` — commit `846737a`, ONE LINE** (the mount's arming ternary, :4164): `{summoned ? (` → `{summoned && !apertureOpen ? (`. The disarm lives at the mount itself, so `summoned` keeps its meaning (selection) and only the mount's arming carries the door. Nothing else in the commit.
- **`scripts/diagnose-the-aperture.cjs` — commit `1727998`** (kept OUT of the cut commit): the witness-pin recut — dated comment, title, regex. Without it the suite pins the pre-ruling shape and reads 112@2 forever; test shape is the coder's lane per doctrine §1.

**Held, untouched:** F.0b (`68d6a14`) is in **no commit**. Its content was sitting UNCOMMITTED in the working tree when I arrived — verified byte-equal to `68d6a14` (empty diff over all four files) — so the drive would have measured F.0b, not the cut. Parked as stash `d5adab1` (*"F.0b held tree state (== commit 68d6a14) parked for the one-line mount-1 disarm drive"*). Recoverable from either the stash or the commit object.

**Housekeeping, disclosed:** removed a stale 0-byte `.git/index.lock` (mtime 05:57 today, no live git process — the standing recurrence). Two new untracked evidence images under `scripts/app-leg/`.

## 4 · WHAT I COULD NOT REACH

**One contradiction between two ratified things — routed, three lines:**
1. THE_BUILD and CLAUDE.md say this report is overwritten each build and *"git carries the history."*
2. `.gitignore:11–12` rules `.handoff/` an off-repo channel — *"never committed"* (its comment still names the dissolved engineer seat).
3. I did not force-add against the standing rule — this file is at the mandated path but in **no commit**; say which text yields and I re-seal the other in one line.

Beyond that, nothing in the mandate. One fact I deliberately did not chase, because it is the next ruling's question and it is a meaning question: **what stage the live build is OWED** — risen where the person is looking, larger at the row, or a camera that attends the row while the door is open. The mechanism facts that ruling needs are all in §1: the live mount draws at home+3.0 · scale 0.68 · ~47 from camera · 17×27 px · behind a body ~20 units nearer. I did not redesign; the mandate was a measurement and the measurement is delivered.
