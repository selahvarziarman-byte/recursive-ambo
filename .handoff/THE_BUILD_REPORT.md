to: the mothership
from: the coder
clock (raw, verbatim): `Fri Aug 28 18:33:08 IST 2026` — mtime is the fact
**STAMP ECHOED: `B-128` — three measurements, nothing built, no geometry chosen**

## TO THE MOTHERSHIP

1. ⛔ **§3 FIRST, AND THE PREMISE NEEDS ONE CORRECTION BEFORE THE ANSWER: the RP² deck-tiling window's producer is NOT `traceAperture`** (that is the 3-manifold room tracer, a different instrument). The window is `DeckTilingWindow.tsx` drawing what **`deckTilingModel.sphericalTiling`** emits. Measured by RUNNING it on `{4,2}`:
   - **TWO cells emitted** (the double cover's two caps — the QUOTIENT has one cell; the window draws the COVER, S², which has two).
   - **Cell 0 (the pole cap) is the EXTERIOR BY CONSTRUCTION** — outline deliberately EMPTY, never drawn, because its stereographic image is the entire plane OUTSIDE the tiling and "its edges are its neighbours' edges, already drawn" (B-104's own design, commit `6661266`).
   - **Cell 1 IS DRAWN — and it is the small black circle on her plate.** 84 outline points, every one at radius 1.000: the four equator edges and four vertices of BOTH caps all lie ON the equator, which stereo-projects to that one circle. Her two coils sit exactly where the model puts them: the near image maxR 0.78 (inside the circle), the far-side antipodal image maxR 5.56 (the large faint spiral outside).
   > ### ⇒ **NEITHER BRANCH OF HER FORK FIRES CLEANLY: cells ARE emitted AND drawn, and the form DOES have a tiling to show — but the `{4,2}` tiling's complete wall-set genuinely IS one circle.** What the plate cannot say, and never could: that the circle is a SQUARE cell (its four corners ride the outline undifferentiated — no vertex mark exists), and that the OUTSIDE is the second cell (the exterior is unmarked by design). "No cells, no lattice" at her eye is a two-cell tiling whose readable structure was never marked, not missing geometry.
2. ✅ **"Did that plate ever draw them" — answered from history, exactly:** the cell walls drawn today are **exactly what B-104 drew at birth** (`6661266` — the one circle for `{4,2}`). What B-105 (`0573375` §4d) removed was **the RINGED VERTEX and the count caption** — marks ABOUT the tiling (one ringed vertex saying "q cells meet here"), never additional cell geometry. So on `{4,2}` specifically, B-105's cut took the ONLY mark that distinguished the circle's structure, and her sentence lands measured: *the telling was removed and this plate's showing was one circle all along.* ⛔ Per your own line: this touches Δ19 and I conclude nothing — the mechanism, the run, and the history are the report; the ruling (mark the cells, or refuse the door, or accept the sparse plate as true) is not mine.
3. ⛔ **§2.1 — WHY `8.75°` EXISTS: it is DELIBERATE, and it is not the occluding pair.** The ladder's ring 2 runs at half ring-1's step (17.5°) with its ladder OFFSET by half of that again (**8.75°**) so that **no outer slot is COLLINEAR with an inner slot** — a collinear outer edge would lie exactly under a shorter inner edge and one EDGE would vanish from the count (the fan's whole point). It protects the edge count; the witness pins it (min angular gap ≥ 8°). **And the measured bodies say the occlusion is elsewhere:** Box3 world extents of all six children, pairwise —
   - **Klein + sphere (her pair, −35°/−70°): boxes OVERLAP 1.19 × 1.22 world** at center distance 3.61;
   - **cylinder + Möbius (+35°/+70°, the mirror pair): OVERLAP 1.39 × 1.32** — a second occlusion nobody had named;
   - **the `8.75°` pair (torus 0° at r=6, RP² +8.75° at r=12): NO overlap, clearance ~0.95 world at distance 6.14 — the LARGEST clearance of any adjacent pair** (the radial separation more than pays for the small angle).
   ⇒ **The mechanical cause of the occlusion is ring-1's CHORD (3.608) against BODY WIDTHS up to 5.31 (Klein) and 4.96 (torus)** — adjacent ring-1 siblings collide whenever both are wide, at every 35° gap equally. The `8.75°` slot is innocent and load-bearing. No fix chosen — the numbers are hers now (body widths: torus 4.96 · cylinder 3.36 · Klein 5.31 · Möbius 3.50 · sphere 2.82 · RP² 7.15; full table in `b128_bodies.json`).
4. ✅ **§2.3 — ONE PRODUCER, measured:** every form caption — `Cylinder — born` over the torus AND `T³ — identified cube · n=[4,4,…]` over the ops deck — renders through **the single `FormLabel` component (`ManuscriptView.tsx:510`) at its single call site (`:5253`)**, world specimens and written forms alike, as drei Html with `zIndexRange={[40, 0]}`. The two symptoms are two victims of that one producer: (a) another form's INK (labels have no inter-form yield — the stemma's E.5 yield exists for stemma labels only); (b) the ops dock, which is a **z-auto DOM overlay** (`ManuscriptChrome.tsx` — `position: absolute; bottom: 14`, no zIndex), so labels at z ≤ 40 stack over it — **the exact class B-106 cured for the deck-tiling window by lifting it to z 60 above the whole label range.** One producer ⇒ one cure, and the cure is hers to shape (a yield, a stacking rule, or both).

---

## 1 · WHAT I RAN

- `sphericalTiling(4, 2, true)` — the REAL function through the leg transpile harness: 2 cells · exterior empty-by-construction · 84 pts at r=1.000 · 4 corners · rim:false · 2 inhabitant images (0.78 in / 5.56 out).
- `git log --follow` + `-S` over `DeckTilingWindow.tsx` / `deckTilingModel.ts` — the B-104 birth (`6661266`, "the ringed vertex countable") and the B-105 cut (`0573375` §4d, ring mark + count caption OUT).
- The body drive (headed, 5174, stopped, port released): one square, six births, Box3 world extents per child, all 15 pairwise overlap tests — `b128_bodies.json`.
- Source reads: `DeckTilingWindow.tsx` whole (`drawCell` skips `exterior`/empty outlines at `:77`; spherical home cell gets no fill by `:87`); `FormLabel` (`:510`/`:5253`); the dock's stacking (`ManuscriptChrome.tsx:1237`-area).

## 2 · WHAT I CHANGED

Nothing in `src/` — report only, as ordered. The record pair carries this letter.

## 3 · WHAT I COULD NOT REACH

Nothing. All three questions are answered with runs, history, and numbers; the two rulings they gate (the deck-tiling's form; the fan's crowding cure) are named as not mine, and Δ19 is not touched.

`B-128`'s three measurements are delivered. ⛔ Nothing further started.

— the coder
