to: the mothership (sixth)
from: the coder
**STAMP `B-119` — ECHOED. MARKER `D1` — ECHOED**, and its order is the one I followed: **the roof → the aliasing cure → the drag.**

# 0 · ⛔ THE DEFECT ONLY THE DRIVE COULD FIND: THE FORM MOVED AND THE CAMERA ORBITED WITH IT

**I built the drag, wired `enabled: !dragging` on the controls, and it read correct. Then I drove it:**
```
formMoved: [-15.561, 5.158, 0]   cameraMoved: 6.3035   quaternionMoved: 0.06798
```
> ### ⇒ ⛔ **FLIPPING A PROP IS A REACT RENDER BEHIND THE GESTURE.** **The orbit's own pointerdown listener and the mesh's fire from the SAME native event — by the time the prop lands, the rotate has already begun.**
✅ **Cure: the controls are stopped SYNCHRONOUSLY inside the pointerdown**, through the instance `makeDefault` already publishes to the R3F store (the committed handle, not a reach into drei's internals). The prop still carries `!dragging` for the steady state; the ref covers the one frame the prop cannot. **Re-measured: `cameraMoved: 0 · quaternionMoved: 0` — the world held still and the form moved alone.**
★ **A green source read and a green witness both said this was fine. Only the hand on it said otherwise.**

---

# 1 · §5.1 — THE ROOF, at the eye
```
THE RECORD
WHAT BEGAT WHAT   Square — invoked ─glue→ Torus (T²) — born
```
✔ **Her string, her split: the roof says `the record` and nothing else; the predicate did not vanish — it MOVED DOWN to the line it is true of.** ✔ **And your structural question is answered by the build: it was one string plus one label, not two roofs.**

# 2 · §5.2 — THE RECORD STOPS ALIASING LIVE STATE
**The site is snapshotted at the act.** ⛔ **THE FALSIFIER, manufactured as ordered:**
```
after home[0] = 99 → act.entry.home[0] = 1 · mark.home[0] = 1   (the live array now reads 99)
```
⚠ **And the positive control is my own prior measurement: `act.entry.home === entry.home → true` at `B-118`.** ⇒ **The test could not have passed before the cure — the arrays were the same object, so writing one wrote both.** ★ **Your line is the one I put in the source: *the ledger's append-only-ness is TRUE at every site, and the CONTENT still changes.***

# 3 · `D1` — THE DRAG. THE CHECKLIST, EACH MARKED
| # | clause | |
|---|---|---|
| **D.1** | drag on the form, no new vocabulary | ✅ **built** — pointer CAPTURED, and only a **written** form grabs (the handler resolves `written` first) |
| **D.2** | moving is not genealogy | ✅ **built** — the block touches no DAG |
| **D.3** | the page may never re-place what he placed | ✅ **built** — `placedByPerson`, set on the drag **and on the two placements he already chooses**, rendering **nothing** |
| **D.4** | save needs nothing | ✅ **free** — `home` and the new mark both ride `written` into the file |
| **D.5** | he must not put a form where he cannot find it | ✅ **built** — the bound is **what the camera can see at the page's plane**, unprojected from the camera, so the clause's own words are the mechanism |
| **D.6** | the stemma follows the homes | ✅ **free, and DRIVEN** — see below |
| **D.7** | a move must not enter the undo chain | ✅ **built** — the block touches no ledger |
| **memorials do not drag** | her ruling | ✅ **already true by construction** — the mark mounts `pointerEvents: 'none'`, so it cannot be picked up at all: **the limit is at the grab** |

⛔ **AND THE IDIOM IS THE IMMUTABLE REPLACE — as a MEANING decision, in the source, in her words.** **Your table is right and I have written it where the next reader will meet it: what I called *"the natural drag is the one that breaks it"* is the requirement, not the hazard.**

## 3.1 · ★★★ D.6, DRIVEN — and it is the clause worth seeing
**Invoked a Square, dragged it across the page, glued it into a Torus, then dragged one of the pair.** **The stemma edge's far endpoint moved with it** — measured from the line's own geometry, `(4.79, −2.18)` → `(−12.74, −8.32)` — and at the eye **the edge stretches right across the page.**
> ### ⇒ **ARRANGING THE PAGE IS ARRANGING THE ARGUMENT, and it is not a phrase — it is what the screen does.**
⚠ **§4's reading, which you asked for: the band is not on this page** (it is the `?manuscript` record strip, and the six-fold repetition you and she are discussing is in the *record*, not the stemma). **So I cannot say whether the drag makes the band's repetition better or worse — I can say the drawn stemma now carries a spatial relation the band cannot express at all, which is her B.1 argument arriving from the hand rather than from the source.**

---

# 4 · WHAT I RAN
- **`npx tsc -b` → exit 0** · **folded sweep 122 @ 1** — ⚠ **run in TWO BATCHES: the sweep now exceeds a single ten-minute call** (61 files / 103 s, then 61 / 511 s). **Worth knowing; it will only grow.**
- **THE DRIVE FAMILY by its trigger** — the card, the record strip and the forms are all its subject: ⇒ **failure set IDENTICAL to the HEAD baseline, 16, every one pre-existing.**
- **Freeze:** `pageStore.ts` · `pageSnapshot.ts` · `ManuscriptView.tsx` · `ManuscriptChrome.tsx` — **all NOT_FROZEN. No frozen file touched.**

⚠ **TWO DISCLOSURES.**
1. **The stale `.git/index.lock` again** — 0 bytes, **64 minutes old**, no `git.exe`. Verified and removed per protocol. **Second time in two cycles; it is no longer a one-off.**
2. ⛔ **The RESEARCHER's `ADR 0027` and a one-line `0026` amendment were sitting UNCOMMITTED in the tree.** **Committed as they stand, attributed, in their own commit (`afb2932`) — not reworded.** ★ **And they are not incidental to this build: 0027's two-registers law is the ground under Δ23, under D.7, and under §5.2's own cure.** *(Same handling as `569c98a` and `cd1fb99`.)*

# 5 · ✅ AND I HAVE STOPPED
**`D1` §5's order is complete.** ⛔ **Nothing further started. Arman's walk of P5 is still owed — and there is more page to walk now than when you first said so.**

— the coder
