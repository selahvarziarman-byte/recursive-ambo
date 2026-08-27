to: the mothership
from: the coder
clock (raw, verbatim): `Thu Aug 27 18:09:33 IST 2026` — mtime is the fact
**STAMP ECHOED: `B-123`**

## TO THE MOTHERSHIP

**Your camera-only reading is HALF-right, and the half that fails simplifies her problem rather than complicating it.** Head-on, the drag truly cannot place a child off-view (measured both ways). But under ANY tilt the drag's own clamp leaks, and past a threshold tilt it DISARMS entirely (§1, all three measured). ⇒ **Since the camera can strand ANY child regardless of how carefully it was placed, the off-screen case is unavoidable at READ time no matter what the drag does** — her deliberately-unwritten clause is needed in full, and it is a read-time test, not a placement rule. The test she needs exists as parts, not as a committed function (§2).

---

## 1 · (a) — CAN A STEMMA CHILD BE OUT OF VIEW AT HEAD? YES, by FOUR measured mechanisms

All driven/computed on a live page (one square, one glue child), the child's HOME projected through the real camera to NDC (on-screen ⟺ |x|,|y| ≤ 1):

1. **The head-on drag CANNOT strand — the clamp is exact.** Dragged the child to the last pixel of the viewport (x=1359/1360): the home clamped to NDC **0.920** — precisely `visibleAtPage`'s 4% inset (1 − 2·0.04), at the eye and analytically (all four clamp corners project to ±0.92 head-on). Your reading holds on this arm.
2. **The TILTED drag CAN strand — the clamp's box is the AABB of a trapezoid.** `visibleAtPage` (`ManuscriptView.tsx:5108`) unprojects the four viewport corners onto the page plane and takes the AXIS-ALIGNED box; under tilt the true visible region is a trapezoid, and the box's corners lie outside it. Measured at a MILD one-gesture tilt (camera `(14.6, −12.8, 41.7)`): three of four clamp corners project OFF-SCREEN, worst **NDC 1.815** — nearly half a viewport beyond the edge. Every box point is drag-reachable (the clamp `min/max`es raw input ONTO the box, `:5182-5183`), so the person can strand a child by dragging toward a screen corner while tilted.
3. **Past a threshold tilt the clamp DISARMS.** When any viewport-corner ray no longer hits the page plane in front of the camera, `visibleAtPage` returns null by its own `t > 0` guard — and the drag's committed fallback is **unclamped**: `bounds ? clamped : raw` (`:5182-5184`). My analytic probe hit exactly this null at the stronger tilt. At such a camera the drag is unbounded.
4. **The CAMERA strands trivially, and reversibly.** Driven: zoom-to-cursor over the parent left the placed child at **NDC 1.789** (off-screen at px 1897 of 1360) with the form standing; zooming back restored 0.920. One orbit gesture alone: **NDC 1.081**, off-screen. Same class by mechanism, undriven: pan, the summon flight (double-click flies the camera to a specimen), Fit Selected, Reset Camera, page reload (homes persist; the camera boots default), window resize.

⇒ **The narrowing for her clause:** she cannot prevent the off-screen case by constraining placement — the camera alone defeats that, and the drag bound is only head-on-tight. What she CAN rely on: it is always detectable at read time (§2), and always curable by the camera that caused it (probe 4's restore).

## 2 · (b) — THE CHEAP HONEST TEST: located as PARTS; no committed named function exists

- **The exact test is one projection:** `home → camera → NDC ∈ [−1,1]²`. Every ingredient is already committed and in the view's hands: the camera handle (`CameraGrab` → `cameraRef`, and the dev seam `__manuscriptCamera` at `:5269`), the child's `home` on its written entry, and THREE's own `Vector3.project(camera)` (THREE is imported in the view). The idiom is already used three times in this campaign's instruments (the app-leg driver's projection, my drive probes) — but **no committed, named "is this on screen" predicate exists at HEAD**. That is the honest answer: one call away, not present.
- **The committed near-miss is unfit off-axis, measured:** `visibleAtPage` (`:5108`) would test `home ∈ box` for free — but it is the very box measured optimistic above (worst corner NDC 1.815 at mild tilt; null past the horizon tilt). Fit head-on only.
- One sentence on planes: homes live at z=0, the stemma ink at z=−1.5; at page distances the parallax is a few pixels — whichever point her clause means ("the end of this line" suggests the ink's plane), the projection is the same one call.

⛔ **Nothing designed, nothing built, no copy written** — the probes were throwaway scratchpad scripts; the tree is untouched.

## 3 · WHAT I RAN

Two throwaway playwright probes (dev server 5174, headed; stopped and port released after): the three-probe drive (clamp at the edge · zoom-strand+restore · orbit-strand) and the analytic corner probe (the `visibleAtPage` math mirrored — the function is not exported — projected back through the live camera; its strong-tilt null IS the §1.3 finding, the function's own guard firing). No source changed ⇒ no sweep re-run owed (the tip `638dcb8` carries its own green receipt), tsc standing, DRIVE family trigger not fired.

## 4 · WHAT I CHANGED

`.handoff/THE_BUILD.md` / `THE_BUILD_REPORT.md` — the record pair. Nothing else; the working tree holds only `tsconfig.tsbuildinfo` (dirty by law).

## 5 · WHAT I COULD NOT REACH

Nothing. Both halves of the measurement are answered with mechanisms and numbers.

`B-123`'s one item is delivered. ⛔ Nothing further started. And the message you asked me to carry is carried: **Arman — there is a fan worth seeing.** One square, six children, six arrows from one point, and the whole thing appears when you drag the pile apart.

— the coder
