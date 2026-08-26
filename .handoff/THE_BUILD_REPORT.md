to: the mothership (sixth)
from: the coder
**STAMP `B-114` — ECHOED.**

# 0 · ⛔ THE ONE THING TO READ FIRST: THE CROWDING READS, AND B-113's HONEST HALF WAS MEASURING THE WRONG SURFACE

> ### ★★★ **STANDING INSIDE THE SEIFERT–WEBER SPACE, AFTER EIGHT DOORS, THE COPIES SHRINK *AND CROWD* — a dense lace of falling-away cells beyond the near wall.** **ADR 0004 §3's sentence, both halves, at the eye.**

**B-113 reported — correctly for what it measured — that the shrink read and the crowd did not.** ⛔ **That was measured on the PLATE: an 84×84 thumbnail on the page.** At that size the copies are sub-pixel before they can crowd, so the plate showed an emptier page and I said so. **The WINDOW is the room at full size, and there the crowd is the dominant fact.** ⇒ **The finding stands as a finding about the plate; it was never a fact about H³.** *(You had already sent the plate-invisibility note and the crowding note to her together — the two do compose, and this is the third fact for that pair.)*

---

# 1 · §2 — THE SECOND CONSUMER IS GONE

✅ **THE PLATE AND THE WINDOW READ ONE GEOMETRY.** `readCellSurface` hands the walk window the **sealed** room — twelve doors each carrying an in-model 4×4, the cell's corners and **every** face plane (walls included) from the model's projective chart. **Measured: every plane the walk tests is the same plane the tracer exits through, agreement `0.00e+0` over 12 faces.** The disagreement you named as the control is gone.

**The shader's arm was the small half, exactly as I specified it:** the exit test was already the chart's form and `uFaceG` was already `mat4[16]`, so what was missing is the projective divide and **the metre** — `modelDist` lifts the chart point onto the quadric and reads the inner product, because chart length saturates at the Klein boundary while true distance runs to infinity, and distance is what the fade and the LOD ladder ride.

> ### ⛔ **THE COMMITTED EUCLIDEAN ARM IS UNTOUCHED BY BRANCH, NOT BY REDUCTION.**
> An affine door's bottom row is `(0,0,0,1)`, so the projective branch **would** reduce to the committed lines — **and reducing to them is not the same as being them.** `uModel==0` keeps the exact arithmetic every euclidean witness was measured against. ✔ Witnessed: T³'s walk room read *with* a null model is byte-equal to the committed read and carries no `model` field and no `g4`; on the running app T³'s caption, GPU, doors and handedness are unchanged.

## 1.1 · ⛔ THE CARRIED FRAME — the part that was not a translation, and your STOP condition

`applyRot` is correct **only** because an affine door's linear part is the same map at every point. **Under a projective door a direction's transport DEPENDS ON THE BASE POINT.** The differential is `pushChartRay`'s own direction formula — so the carry is not invented — but the frame must then be **re-orthonormalised in THE MODEL's inner product**, because three chart vectors orthonormal at the old point are not orthonormal at the new one.

⛔ **LAW 22 decided the method:** the orthonormalisation is **Gram–Schmidt IN ORDER**, which rotates and **can never reflect**. ⇒ **The only thing that may flip the mirror is a door whose own 4×4 determinant is negative — which is exactly what the reading MEANS.**

> ### ✔ **SO THE MIRROR READING'S MEANING IS UNCHANGED, AND NO STOP WAS OWED.** I checked that before building, not after.

**Witnessed:** the carried frame returns orthonormal to `4.44e-16` and right-handed on every door; **eight doors walked live left `frameHanded` at +1 throughout**; the return still counts in doors (0 → 8).

★ **The measurement that shows why the orientation must read det4 and not det3: every Seifert–Weber door's 4×4 determinant is `1.000000` while its 3×3 BLOCK reads `3.736`.** On a projective door the block is not the orientation, and now nothing reads it as one.

---

# 2 · §0 — THE LABEL, LANDED

**At the eye, verbatim, on the room a person built:**
```
hyperbolic manifold · n=[5,5,5,5,5,5] · cone edges: 6 × 450° · (k×90° heuristic) ·
copies shown to depth 6
these angles are the shadow's, not the manifold's · 450° is more than a full turn —
that excess is why it cannot be flat
```

✅ **Her rule is the mechanism, not a table of cases:** a sealed curved realization reads **`hyperbolic manifold`**; a euclidean form with real cone edges **KEEPS `Euclidean cone-manifold`**; a fold locus reads **`orbifold`** and **no seal can reach past it** — witnessed by *forcing* a seal onto a folded body and watching the noun refuse to move. ⇒ **That third row is what makes her rule right and your conditional wrong, and it is now enforced by ordering rather than by discipline.**

⛔ **ONE PRODUCER.** The view no longer composes its own `Euclidean cone-manifold` beside the plate's — **that is precisely how the two came to disagree.** Both read `apertureNoun`, and the witness pins it structurally.

## 2.1 · ⚠ TWO THINGS ARE MINE. I am flagging them, not smuggling them.

1. **`spherical manifold` is my word, not hers.** She handed the hyperbolic one and the rule; **a sealed S³ form is reachable today** (the cube family's two uniform k=3 patterns), so the slot could not stay empty, and her rule admits exactly one word true of S³. **One string for her to overrule.**
2. ⛔ **THE SHADOW CLAUSE FIRES ON A FACT, and this is a real tension between §0 and §2 that I resolved by construction rather than by asking you to choose.** Her note was written when *everything* was drawn in the shadow. **§2 makes that false for a sealed room** — and *"the label says what IS"* is her own rule. ⇒ **Her sentence goes out WHOLE when its first clause is true; her second clause goes out ALONE when only that one is.** **Not a word of hers changed, none invented.** **If she wants it unconditional it is one line, and I will not argue.**

⛔ **AND THE NOTE GOT ITS OWN LINE, WHICH IT DID NOT HAVE.** She said *"its own line"*; both renderers silently collapsed the newline (`whiteSpace: nowrap` on the page label, plain `textContent` in the window). **Found by measuring the rendered node — the string was right and the page was wrong, and only one of those is what a person reads.**

---

# 3 · WHAT I RAN

- **`npx tsc -b` → exit 0** · **folded sweep 121 @ 1** (`diagnose-dual-inspection`, the accepted baseline), 525 s.
- **THE DRIVE FAMILY by its trigger** (my reading is the walk window): `diagnose-deficit-app` — ⇒ **the driver-clause failure set is IDENTICAL to the HEAD baseline I took in B-113: 16 clauses, every one pre-existing.** No new failure.
- **`§9`/`§10` in `diagnose-the-noncube-domain`** — the walk room, the plane agreement, the euclidean non-movement, the closure, the mirror meaning, the carried frame, the four noun rows, the note's two firings, and the one-producer pin.
- `git diff --stat 1b72f43 HEAD` = **EMPTY**.
- **Freeze:** `ExploreWindow.tsx` **NOT_FROZEN** · `apertureModel.ts` **NOT_FROZEN** · `ManuscriptView.tsx` **NOT_FROZEN**. **No frozen file touched.**

**Verbatim, the load-bearing ones:**
```
walk room: model H3 · 12 faces (0 walls) · 30 rods · span 1.7870
plate-vs-walk plane agreement: worst 0.00e+0 over 12 faces
door det4: 1.000000 · their 3×3 blocks: 3.736
carried frame: worst |⟨eᵢ,eⱼ⟩ − δᵢⱼ| 4.44e-16 · right-handed on every door: true
live walk: doors 0→8 · frameHanded +1 throughout
T³ window (control): E³ · n=[4,4,4] · flat · no cone edges · (k×90° heuristic) · copies shown to depth 6
```

---

# 4 · ONE WITNESS DEFECT OF MY OWN, FOUND AND FIXED

⛔ **B-113 gave the depth line the model's metre and updated the ink clause's PREDICATE but not its BRANCH SELECTOR.** HEAD stopped matching the old literal, so the leg fell into a **retired pre-commit branch that cannot pass** — a green that had quietly become unreachable. ⇒ ***A predicate written twice is a predicate that will be updated once.*** One marker, one definition, both readers.

---

# 5 · WHAT I COULD NOT REACH

- **Nothing in the mandate.** §0 and §2 both landed; you ordered *nothing else* and I chased nothing else.
- ⚠ **A browser tab is open** at `localhost:5174` — the app's unsaved-changes guard refuses programmatic close. **The server is stopped, the port released; the tab is inert.**

— the coder
