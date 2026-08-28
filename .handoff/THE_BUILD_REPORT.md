to: the mothership
from: the coder
clock (raw, verbatim): `Fri Aug 28 16:33:55 IST 2026` — mtime is the fact
**STAMP ECHOED: `B-124`**

## TO THE MOTHERSHIP

1. ✅ **THE FAN IS BUILT AND THE COUNT IS TRUE AT REST — her acceptance, driven at two Ns, touching nothing.** N=2: two children, two edges, 35° apart. N=6: six children, six edges (angles −70°, −35°, 0°, 8.75°, 35°, 70°; min pairwise home distance 3.608 world) — countable at a glance, every caption legible, no smear and no one-thing. **And per my own B-122 control: it looks fine** — three plates for the designer (`b124_1_N2_at_rest` · `b124_2_N6_at_rest` · `b124_3_N6_plate` in my drive scratchpad; the N=6 plate is the craft plate she asked to be able to see).
2. ⛔ **F.5 — THE STOP FIRED AND THE BOUNDS ARE MEASURED, NOT DODGED.** The fan CAN reach a neighboring dimension row, and here are the numbers (row bands measured at the eye, world-y extents of the standing members: dim1 `[7.5, 14.81]` · dim2 `[−6.5, 6.5]` · dim3 `[−14, −7]`; centerlines ±10.5): for a ROW-RESIDENT parent at radius 6, children 1–9 stay clear (max |Δy| 5.64 on ring 1, 5.31 at ring-2 ±26.25°); **the 10th/11th children (ring-2 ±43.75°, Δy ±8.30) are the FIRST to enter a foreign band; the 12th/13th (±61.25°, Δy ±10.52) cross the foreign centerline.** Two narrowings she should have with the numbers: (a) N ≥ 10 on one parent is reachable today ONLY by repeat begetting (a square offers 8 registry doors; `dual` refuses on the bounded square — measured; so ~7 distinct-door births), and repeat begetting is the act her *obtaining-is-not-making* route will retire; (b) the band is a y-INTERVAL — a fan child enters the neighboring row's HEIGHT far from its members' x-extent, so the false sight is "reads as that row's member" only when x also approaches. I chose the geometry from F.1's own needs and did not shrink it to dodge this — the collision case is hers to rule with these numbers.
3. ⚠ **A site-census correction, one register over:** your §2 counted FIVE sites (four homes + dep at `:3952`). Measured: SIX `spawnOffset` tokens in the view — four home expressions **plus TWO dep arrays** (`:3952` and `:4712`, the fold commit's). The substance held (one expression, four birth sites); the count was one short.
4. ★ **Craft note for her re-gate, from the plate:** at ring-1 chord 3.608 the wide-bodied children (torus, Klein) BRUSH each other's ink; the count survives through edges + captions. The knobs are one place each: her `spawnOffset` stays the radius (her file, comment updated to say what it now does), and `FAN.stepDeg / arcHalfDeg / clearance` sit in `spawnFanModel.ts` — she takes the craft when she can see it, and now she can.

---

## 1 · WHAT I SAW (the drive — headed, 5174, stopped after)

- **N=2 at rest:** the diamond with two arrows — torus at slot 0 (exactly the old constant's slot), cylinder at +35°. Two, at a glance.
- **N=6 at rest, touching nothing since birth:** five children on ring 1 (0°, ±35°, ±70°) and the sixth opening ring 2 at +8.75° (radius 12) — six distinct edges, six legible captions, the RP² reading plainly as a second rank. The record strip below still prints the parent once per child — the band's known flattening (B-122, ADR 0027 §7), not this build's subject.
- **F.3 at the eye:** dragged the +35° child ~8.5 world; the OTHER FIVE homes stayed byte-identical (`othersUnmoved: true`, 5/5) and the dragged one stayed where he left it. The page placed; he rearranged; the page took nothing back.
- **F.5 rows:** the three bands measured (numbers above) from the standing members' own geometry, before anything was invoked.

## 2 · WHAT I RAN

- `npx tsc -b` — exit 0.
- `node scripts/diagnose-spawn-fan.cjs` — **21/21 CLEAN** (the new 124th leg; teeth below).
- `npm run sweep` pre-commit — **RED by design, every red with a read mechanism:** 11 unexpected fails = 2 freeze legs (ran before the new file was STAGED; the fifth guard healed by staging — re-run green) + 9 manifest-pin legs (each pins the manifest byte-identical-to-HEAD or its own build's exact differential; my uncommitted `+ NOT_FROZEN spawnFanModel.ts` row is a foreign line to every one of them — the same correct-transient class as B-120/B-122). **The authoritative sweep runs at the committed tip and its verbatim verdict is echoed in the closing terminal message and the push follows it: expected `124 files · expect exactly ONE fail: diagnose-dual-inspection` → SWEEP OK.**
- The B-124 drive (throwaway playwright, headed): N=2 · N=6 · the F.3 drag control · the F.5 row-band Box3 measurement. Plates + `b124_report.json` in the scratchpad.
- **DRIVE FAMILY: not fired, reason named** — none of the five legs' subjects is spawn placement (grepped: zero `home[`/`spawnOffset` references in all five), and the single-child lay is byte-identical to the old constant (slot 0 preserved), so even an incidental birth inside their drives sees an unchanged page.

## 3 · WHAT I CHANGED (and why each)

- **`src/manuscript/spawnFanModel.ts` (NEW, NOT_FROZEN row added)** — the ONE producer (F.4): `spawnHomeForBirth(target, written, radius)` filters the parent's existing children (`parentShape` + the connected-sum's `parentShapes` — the same parenthood the stemma edges draw from, so the fan fans exactly what has edges) and takes the first FREE slot of the deterministic ladder (F.2). Geometry (craft, mine to choose, hers to re-gate): rightward arc, ring 1 at her `spawnOffset` radius, step 35° inside ±70°; full rings double out at step/ring (chord preserved ≈3.6), offset half a step so no outer slot is collinear with an inner one. **Slot 0 IS the old constant's slot — a single child lands exactly where it always did.** Occupancy is a distance read (clearance 1.8) of CURRENT homes: a slot his drag emptied is reused; placement reads the page, never a memory of it.
- **`src/manuscript/ManuscriptView.tsx`** — the four birth sites (`:3923`, `:3949`, `:4678`, `:4709`) now call the producer; each sits inside its existing `setWritten((cur) => [...cur, …])` appender, so the fan writes the NEWBORN alone (F.3 by construction — no re-layout exists to run). The old constant expression is gone from the view.
- **`src/design/designDefaults.ts`** — one comment: `spawnOffset` now says what it is (the fan's ring-1 radius, WHERE computed from the population). A label is behaviour; fixed in the same cut. (File outside the census ROOTS — no manifest action.)
- **`docs/governance/ENGINE_FREEZE_MANIFEST.txt`** — the NOT_FROZEN row for the new module (the completeness law).
- **`scripts/diagnose-spawn-fan.cjs` (NEW — the sweep's 124th leg)** — §1 F.1 as numbers (13 at-rest births: pairwise ≥ clearance, edge angles distinct ≥ 8°, slot 1 = the old slot, deterministic) **with the LAW-24 control: the constant-offset lay FAILS the same bar** (minDist 0 — the bar can catch the defect it exists for); §2 F.2 (occupied skips · a drag-freed slot is REUSED · another parent's children invisible · a `parentShapes` child occupies); §3 F.3/F.4 at the view (old expression GONE · exactly four producer calls · all four appender-only · no second door into the geometry · the producer mutates nothing it reads); §4 the REAL story (five committed doors on one square — `dual` refused honestly on the bounded square — fan five clear homes at five distinct angles).
- **`CLAUDE.md`** — the sweep's canonical line: 123 → 124.
- **`.handoff/THE_BUILD.md` / `THE_BUILD_REPORT.md`** — the record pair.

## 4 · WHAT I COULD NOT REACH

Nothing withheld. Two boundaries stated rather than crossed: the F.5 collision case is measured and reported, not ruled (hers); and twins (repeat begettings, legal today) share one shape id, so the stemma draws ONE edge to the LAST twin's home while the fan honestly seats each body apart — bodies and edges can differ in count on a twinned page until her obtaining-is-not-making route lands (ADR 0027 §3; not mine to build unbidden).

`B-124`'s two items are delivered: the fan built F.1–F.4, F.5 measured and reported as the STOP ordered. ⛔ Nothing further started.

— the coder


═══════════════════════════════════════════════════════════════════════════
# APPENDED — THE N1 REPORT (marker echoed beside B-124)

to: the mothership
from: the coder
clock (raw, verbatim): `Fri Aug 28 16:44:04 IST 2026` — mtime is the fact
**MARKER ECHOED: `N1` (beside `B-124`, which landed first as ordered — commit `71545e2`, sweep OK at that tip)**

## TO THE MOTHERSHIP

1. ✅ **N1.1 — THE EDGE IS NOT CULLED. Her sentence has a route to point along, and the fly stays refused.** Measured at the eye with plates: child stranded off-screen by mechanism 4 (zoom-to-cursor), parent standing in view — at child NDC **1.028** and again fully out at **1.27**, **the stemma edge runs visibly from the parent's corner to the right edge of the viewport** (plate `n1_2_child_far_offscreen.png`: the line reaches the boundary; the arrowhead is clipped mid-glyph AT the edge — the ink literally points past it). Pixel-sampled on the plate itself, LAW-24 controlled: on-line ink hit-rate 0.481 vs **0.000** on a 30px-parallel control path (baseline both-on-screen calibration: 0.875 on-line / 0.000 off-line). Restored to NDC −0.416 by zooming back — the camera that strands cures.
2. ⚠ **The mechanism behind the measurement, labeled as mechanism:** the drei Line2 has `frustumCulled: true` (per-OBJECT bounding-sphere culling is ON); it survives because a segment's sphere intersects the frustum whenever ANY part of the segment could be visible — including the both-endpoints-off-but-crossing case. The only vanish case is the entire segment outside the view, where there is nothing visible to point with or at. So the render fact she could not check composes with the half she checked (`stemmaLines` filters on homes, not visibility — hers, confirmed standing): **built AND drawn.**
3. ⛔ **N1.2 — THE CHRISTENING LOCATE: I could not find any gesture that gives a form a name — where is it?** Swept `src/manuscript` for rename/christen/prompt/contentEditable/textarea/editable/onDoubleClick and every `<input`/`onChange` in the view: exactly two inputs exist (the room's place-a-form `<select>` at `:6346` and the displace-inhabitants checkbox at `:6378`) — neither touches a name. **(b) And there is no true-absence field a given name could land in:** `WrittenForm.title: string` is REQUIRED and machine-filled at every writer — a GIVEN name is NEW STATE (a new optional field, or the register split the ruling implies). The store would carry it if it existed (acts/removals already persist name-strings — see 4).
4. ★★★ **N1.2(c) — THE MINT CENSUS, and it returned the surprise you predicted — SIX sites where the machine fills a name-shaped slot:**
   - `writtenFormModel.ts:291` — `` `${bornShape.name || 'Form'}` `` — **a PLACEHOLDER** minted when the shape's own name is empty (the bodiless card's title).
   - `writtenFormModel.ts:361` — `` `${IMMERSION_TITLES[surface] ?? render.model.surface} — born` `` — **a raw KEY** into the born title when the titles map misses.
   - `ManuscriptView.tsx:3195` and `:4100` — `DIM2_TITLES[m.surface] ?? m.surface` — the same raw-key mint at the dim2 row's display names.
   - `ManuscriptView.tsx:4129` — the foot record's resolver `(id) => nameOfShapeId.get(id) ?? id` — **a shape ID into the record sentence's name position** on a map miss. The removals-map cure (P5 clause 19) stands IN FRONT of it, so the known paths are covered — but the backstop itself is the forbidden class if any uncovered path ever reaches it.
   - `pageStore.ts:248/:249/:271` — ledger fields literally called **`name`** (acts, removals) filled from the machine `title`.
   - `Shape.name` (`src/types` :246, FROZEN) — every shape carries a machine-minted name at birth (writtenFormModel's own header: "dual-born shapes — surfaceDual mints"), and it flows into titles.
   The compliant side, for the census's completeness: `apertureModel.ts:698/:701` prints the ratified `unnamed` and its comments name the fabrication it guards against — the doctrine's one swept-clean surface.
   ⚠ **A register question that is YOURS, not mine:** whether `title` / `Shape.name` / the ledger's `name` fields ARE the name register (then these six are violations) or the CLASSIFICATION register wearing the word "name" (then the defect is the field LABEL, and the true name register simply does not exist yet). I report the sites; the assignment of registers is meaning.

⛔ **Nothing built, no copy written, no gesture invented** — probes were throwaway; plates in the scratchpad (`n1_0_baseline` · `n1_1_child_offscreen` · `n1_2_child_far_offscreen`).

## WHAT I RAN
One throwaway playwright probe (headed, 5174): baseline → strand (NDC 1.028) → far strand (NDC 1.27) → restore, each with plate + on-line/off-line pixel sampling. The christening locate: file-read sweeps over `src/manuscript` (gesture hunt · title writers · fallback census) + `pageStore.ts` persistence reads + the frozen `src/types` field, read-only.

## WHAT I CHANGED
Nothing in the tree for N1 (report only, as ordered). The record pair carries this report beside B-124's.

## WHAT I COULD NOT REACH
Nothing. Both measurements are answered with plates, pixels, sites, and mechanisms.

`N1`'s two items are delivered. ⛔ Nothing further started.

— the coder
