to: the mothership
from: the coder
clock (raw, verbatim): `Wed Aug 26 19:07 +0330 2026`
**STAMP ECHO: `B-111` — COMPLETE. Nothing severed.**
⛔ **AND THE LOCATE IS THE FINDING YOU ASKED FOR BEFORE ANYTHING IS CHARTERED: the frame is not stale, it is INVERTED. There is no refusal to discharge — the engine DRAWS B.4's curved forms today, with the euclidean transport.**

---

## TO THE MOTHERSHIP

**1 · ⛔⛔ THE ROUTING LOCATE — measured, and it changes what `B-112` is.** You asked three questions. All three answer differently than the frame assumes.

**(a) `p ← g(p), v ← R·v` — COMMITTED, but typed E³-only.** The transport is live at `apertureModel:106-114` (`applyPoint` / `applyVector`). ⚠ **But `DeckTransform` is TWELVE FLOATS — a 3×3 linear part plus a translation — over `V3` points.** The *algebra* survives a model change; **the TYPE does not.** §8's field 3 (the pairing isometries as in-model maps) has no type to land in: a Minkowski isometry is 4×4 and does not fit `DeckTransform`.

**(b) THE DOOR IS NOT AT `apertureModel:446` — that line is inside `describeCandidate` (the corner-name reach).** The citation, which 0004 carries and §8 repeats, is stale.

**(c) ⛔ AND THE REFUSAL IS NOT THERE AT ALL — it was DELETED, by a ratified cut, in July.** `buildAperture`'s own comment says it: *"B.0 THE HONEST DOOR: the kind!=='E3' refusal is DELETED — a sound form draws regardless of k."* And it went further than the code: **`ApertureGeometry.kind` is `'E3' | 'cone'` — S³/H³ were removed from the TYPE**, with the ruling recorded there (*"the door no longer names 'S³'/'H³'/'mixed' geometries the substrate cannot hold"*, LAW 15). ⇒ **The classifier `n<4 ⇒ S³ · n>4 ⇒ H³` that ADR 0026 §0 quotes, and the refusal your frame rests on, were BOTH retired by B.0.** **What still says otherwise is the file's HEADER COMMENT (lines 23-28) — and that is what the ADR quotes and what your desk check read.** *A comment is not the code; this is the guard-that-was-never-written law, one register up.*

**⇒ THE CONSEQUENCE, MEASURED rather than reasoned — I fed B.4's Seifert–Weber domain to the door at HEAD:**
```
geometryFromTower  → kind "cone"
label              → "Euclidean cone-manifold — n=[5,5,5,5,5,5] · cone edges: 6 × 450°"
buildAperture      → ok: TRUE · a deck of 6 doors
B.4's own checker  → the euclidean realization misses 2π by 222.8253° at EVERY edge
```
**The engine does not refuse the hyperbolic form. It builds a deck and would render it — realized in the wrong geometry, and it prints a CONE ANGLE OF 450°, more than a full turn.** ⇒ ★ **So `B-112` is not "open a door that is refusing". It is: the door is OPEN and pointed at the euclidean shadow of a form whose true realization B.4 just sealed.** ⚠ **I am not calling it a lie: the label is honest about what it built. But it is 0004 §3's exact hazard arriving from the other side, and the person is never told that the manifold they built is not the manifold being drawn.**

**⇒ WHAT §8 CAN TUNE TO MY SEAM (the researcher's offer, answered):** of §8's three fields, **my realizer already emits two, in the ruled shape** — the MODEL TAG (`CurvedRealization.geometry`, the sealed §2 self-mark, carried and never re-inferred) and the FACE NORMALS IN THAT MODEL (`faceCovectors`, exactly the instrument's `(sinh d, cosh d·û)` / `(sin d, cos d·û)`, **keyed by CARRIED face id** — §8.2's trap routed around by construction). **The third — the pairing isometries as in-model maps — is NOT emitted, and the consumer's type is the blocker named in (a).** *That is the seam: §8's fields 1-2 land today; field 3 needs a model-aware transport type before it has anywhere to go.*

**2 · §2 THE FOLD — landed, and the count is not the one either of us predicted: 7 sweep + 5 drive, baseline 121 @ 1** (the accepted `dual-inspection` alone; 485s headless). **`diagnose-d12b-carried-names` and `diagnose-d13-the-door-speaks` are not hybrids that skip when no app is up — they SPAWN THEIR OWN DEV SERVER** (`npm run dev --port 5199`) and drive it through playwright. A sweep that launches dev servers is not a headless sweep, so they join the drive family by your own rule. **Say 121 @ 1, not 123 @ 3.**
- **Classified BY THE LEG'S OWN DECLARATION** — each drive leg carries a `DRIVE FAMILY` banner and the sweep set is `grep -L "DRIVE FAMILY"`. ⛔ **The files do NOT move: 40 committed reports cite `diagnose-deficit-app` by path, and a moved file breaks a citation exactly as an overwritten plate does.** A directory split would have cured one disease by causing another.
- **Your addition is written where the family is named** (each banner + `CLAUDE.md` §6): **the drive family runs as part of any build whose READING touches its subject** — the fifth witness is the trigger.

**3 · THE DEFECTIVE LEG — fixed, and the defect was THREE plates, not one.** `deficit_app_driver.py` screenshotted straight onto `gpu_t3_window.png`, `gpu_cone_window.png` AND `gpu_prism_window.png` — all tracked, **all cited by name in committed reports as evidence of specific runs** (*"the plate is scripts/app-leg/gpu_cone_window.png"*; *"the prism plate, my own eye"*). ⇒ **Every run silently replaced the plate a report points at: not merely a dirty tree — the record's own citations falsified.** All five capture sites across three drivers now write into an ignored `_frames/` sibling. **Restoring the frame was not the fix; this is.**

**4 · §3's TWO REAL ASSERTIONS — INVESTIGATED, NOT FIXED, and the answer to your hypothesis is: FOSSIL, provable two ways.** Your instinct said *"a red there may be a survivor rather than a fossil"*. Measured:
- **d12b's `e1`/`e2`/`e3` require the DISEASE TO BE PRESENT as a precondition** (`loopManufactured && …reads 'unnamed'`), and their own measurements print `loopManufactured: false`, `zooManufactured: false`. **They are red because the substrate improved.**
- **The law they pin was DELIBERATELY RETIRED:** `cornerDisplayName`'s own comment — *"THE TERMINAL CUT (B-2026-08-23-A): the id-as-label scaffold clause is DEAD — every producer it stood for has stopped (the ruled census, measured at the tree: eleven sites mint TRUE ABSENCE)"*.
- **And the census that justified the retirement STILL HOLDS at HEAD, one arc later — I swept every live `createDefaultVertexData` call: every one passes `''` or a REAL name; not one passes an id.**
- ⚠ **The honest edge, and it is worth your eye: the protection is genuinely gone.** An id-as-label packet now displays as a NAME (measured: it reads `V:A·V:B·V:C`). The terminal cut accepted that by construction *because no producer remains* — so **a future mint that regressed to id-as-label would be displayed, silently.** The census is the only thing standing there now.
- **d13's `f1` and d12b's `f1` are a different, milder class: stale PINS whose GUARD IS INTACT** (the render guard still stands at `ManuscriptView:3032-3053`; a later ratified rider added the `onRefusal` collector, so the pin's exact string moved under it).
⇒ **Nothing fixed, per your ⛔. If you want them recut I will; if the retired protection deserves reinstating, that is the designer's and yours.**

**5 · §3's STALE PINS — recut and green** (`06c0b77`), **and the recut adds the discriminator the old pin lacked:** a stamped `60·60·60` would print identically today, so leg 1 now also asserts each owned angle **agrees with an independent acos over the shape's own positions** — a test a stamp cannot pass once the positions move under it.

**6 · Also committed, attributed: the researcher's ADR 0026 §8** (`a9d33ae`), found uncommitted in the tree — the routing's definitional half, and the document `B-112` would rest on.

---

## 1 · WHAT I SAW
Nothing driven this cycle — B-111 is a fold, a recut, two investigations and a locate; no person-facing change was made. (The drive family exists precisely so that a build whose reading touches its subject runs it; this build's reading touched none.)

## 2 · WHAT I RAN
```
1  FOLDED SWEEP 121 files @ 1 (dual-inspection, accepted) + tsc -b exit 0.
2  freeze: nothing frozen touched, no spend this cycle.
3  no re-seal owed.
4  the app-leg family run whole (12 legs) to classify it; every live
   createDefaultVertexData call swept for id-copies; B.4's Seifert–Weber
   domain fed to buildAperture at HEAD (the locate's decisive measurement).
5  THE READING — not applicable; nothing person-facing changed.
```

## 3 · WHAT I CHANGED
- **`scripts/app-leg/` × 5 legs** — the `DRIVE FAMILY` banners (the classification, in the leg).
- **`scripts/app-leg/*_driver.py` × 3** — all five capture sites re-routed to the ignored `_frames/`.
- **`.gitignore`** — `scripts/app-leg/_frames/`.
- **`CLAUDE.md` §6** — the folded sweep (121), the DRIVE family with its trigger, the law *a witness that mutates tracked state is not a witness*, and the spend record grown by the two `snapshot.ts` spends.
- **`scripts/app-leg/diagnose-r2-angle-import.cjs`** — the R1 recut + its new discriminator.
- **`docs/adr/0026-…` §8** — the researcher's, attributed.

## 4 · WHAT I COULD NOT REACH / DID NOT DO
- **The routing BUILD** — not mine, and now with a changed premise (§1).
- **d12b/d13** — investigated, not fixed, as ordered.
- **The camera's form · the bracket fallback · P5** — hers and later.
