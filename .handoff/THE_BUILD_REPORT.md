to: the mothership (sixth)
from: the coder
**STAMP `B-113` — ECHOED.**

# 0 · WHAT LANDED, IN ONE LINE EACH
- ✅ **§3 THE RENDER — `traceAperture` carries the model**, driven at the eye on a Seifert–Weber interior. **The copies shrink, measured; the crowding does NOT read, said plainly.**
- ⛔ **AND THE ACCEPTANCE IS ONLY HALF MET, because the window a person WALKS is a SECOND CONSUMER I did not know existed until I drove it.** §2 below. **This is the one thing in this report you most need.**
- ✅ **R1 the camera — SELECTION HOLDS.** Her retired C1 plate clause recut to her ruling and measured **both ways** on the running app.
- ✅ **R3 the wrap — OWN THE WRAP**, driven: `—a ← unnamed·unnamed` / `→ unnamed·unnamed`, arrows aligned in their own column.
- ✅ **R2 measured, NOT cured** (her explicit instruction). **One producer, five routes.**
- ⛔ **§2's label: not landed — her words have not reached my inbox.** A letter from the designer sits in *your* inbox (`2026-08-26_2111`); **I did not open it — it is not addressed to me.** If it carries the label's words, send them and the cut is small.

---

# 1 · WHAT I SAW (drove the app, `?manuscript`, my own dev server)

**★★ THE SEIFERT–WEBER SPACE BUILT AGAIN AT THE DOOR**, by hand: load the dodecahedron through the person's own *load universe…*, drag it to the paper, open the aperture, set six opposite-face pairs and pick each map **by its content** from the menus the engine offers (the six keys came out `d-4, d-0, d-0, d-0, d-0, d-0` — *the key is an address, the map string is the invariant*), glue. Verbatim:

> `glued — H₁ Z/5 ⊕ Z/5 ⊕ Z/5 · the aperture opens in the dim-3 band`

**★★ AND THE CAPTION MOVED.** B-112 measured `orbit (visible): 12 plaques` on this room. At HEAD it reads:

> `Euclidean cone-manifold · n=[5,5,5,5,5,5] · cone edges: 6 × 450° · orbit (visible): 1 plaque · 0 of the 1 coils come back mirrored — count them`

**12 → 1.** That is the model reaching the person's picture. Side by side on the page, the euclidean T³ plate is dense and the Seifert–Weber plate is sparse.

⚠ **AND THE HONEST HALF, which you asked for rather than a caption: THE CROWDING DOES NOT READ.** 0004 §3 says *"in H³ they shrink exponentially and crowd."* **The shrink reads — dramatically. The crowd does not.** What a person actually sees beside the euclidean room is an **emptier page**. Measured at depth 8 (84×84, the same room, the same scene): the H³ room contributes **132 distinct copies** and only **3** survive a 4-pixel threshold, against euclidean **86**; at sixteen pixels **1** against **17**. The copies are all there in their hundreds — they fall under a pixel before they can crowd. This cell is *large* (inradius 0.996 in curvature −1), so the second copy is already tiny. **I added no caption.**

**R1 at the eye:** dropping the dodecahedron on the paper auto-selected it and **the camera did not move** — the loop, the arc and both rooms stayed in frame. The page stayed whole.

**R2 at the eye:** selecting the placed dodecahedron removed its label from the page entirely; its name survived only on the specimen card.

**R3 at the eye:** invoke Square → *Glue → Torus (abAB)* → the card reads the wrap as she drew it (DOM-measured: both arrows at x 1668, both runs at x 1684, two lines).

---

# 2 · ⛔ THE ONE THING THAT MATTERS MOST: THE SECOND CONSUMER

> ### **THE WINDOW A PERSON WALKS IS NOT THIS TRACER.**
> I opened *explore inside — walk the habitat* on the built Seifert–Weber room. **It draws, and it draws EUCLIDEAN,** captioned:
> `Euclidean cone-manifold · n=[5,5,5,5,5,5] · cone edges (k×90° heuristic): 6 × 450° · copies shown to depth 6`

**It is `ExploreWindow.tsx`'s WebGL2 fragment-shader port** (the CPU still was retired), fed by `readCellSurface`, with **its own JS frame-walk** for the eye. My cut reached `traceAperture` — the shell's plate — and not this. **So at HEAD the plate and the window now disagree about the same room**, and I am telling you that rather than letting you find it.

⚠ **I scoped §3 as `traceAperture` in B-112 because that is what B-112's drive went through. That was an incomplete locate, and it was mine.** The correction is measured, not estimated:

- ✅ **The shader's plane test is ALREADY the chart form** — `t=(uFaceD[f]-dot(p,uFaceN[f]))/dn`, which is exactly what the projective chart needs, unchanged.
- ✅ **`uFaceG` is ALREADY `mat4[16]`.** The type is there.
- ⛔ **What is missing in the shader is four lines:** the point transport takes `.xyz` (assumes w = 1) and the direction uses `mat3(g)`; `acc` is a `mat3`; `travel` is the chart parameter, not the metre.
- ⛔ **AND THE REAL WORK IS NOT THE SHADER — it is the person's CARRIED FRAME.** `transportWalk` carries the eye **and six axes** (`camF/R/U`, `deckF/R/U`) through a door by `applyRot`. Under a projective map a direction's transport **depends on the base point**. `pushChartRay`'s own direction formula IS that differential — but the re-orthonormalisation is in the **model's** inner product, and **LAW 22 makes handedness state the observer CARRIES**, which the walk window's mirror reading is pinned on. **I will not guess that at speed.**

⇒ **It is one cut, not two, and it is now precisely specified. It is the obvious front for B-114 and I did not start it.**

---

# 3 · WHAT I RAN

- **`npx tsc -b` → exit 0** at the committed HEAD.
- **The folded sweep: 121 files @ 1** (`diagnose-dual-inspection`, the accepted baseline), 561 s headless.
- **THE DRIVE FAMILY, by its own trigger** (my reading touches the camera and the aperture): `scripts/app-leg/diagnose-deficit-app.cjs`, run **twice** — once at HEAD with my cut stashed, once with it. ⇒ **The driver-clause failure set is IDENTICAL: 16 clauses, every one pre-existing.** This cut adds none. *(The aggregate check count fell 29 → 28 because §E-PLATE now passes.)*
- `git diff --stat 1340293 HEAD` = **EMPTY**.
- **Freeze manifest, every touched file:** `noncubeDomain.ts` **NOT_FROZEN** · `apertureModel.ts` **NOT_FROZEN** · `ManuscriptView.tsx` **NOT_FROZEN**. **No frozen file touched; no hash moved; no spend asked for.**

**The §9 measurements, verbatim:**
```
sealed: H3 · inradius 0.99638 · k=5 · closure worst 1.34e-5° · chart scale 0.5522
affine pushes compared: 36 · exact: 36
copies surviving ≥[1,4,16,64] px at depth 8 — H³ [132,3,1,1] · E³ [285,86,17,1]
door round-trip worst error: 3.96e-15
deepest lit ray at level 8 — H³ 12.008 (hyperbolic) · E³ 20.445 (euclidean)
cube family: 79 sound = 43 E³ + 2 S³ + 1 degenerate + 33 mixed-k
```

---

# 4 · WHAT I CHANGED

**`src/lib/noncubeDomain.ts`** — the projective chart (`chartOf`, `chartPlaneOf`, `chartDistance`, `pushChartRay`, `mat4Det`), the general regular-cell realizer (`realizeRegularDomain`; `realizeDodecahedralDomain` now delegates to it — **one construction, two contracts, never two copies that can drift**), and **`sealDomainRealization`** — the class a domain EARNS.

> ### ⛔ **THE SEAL IS NOT B.0's KILLED CLASSIFIER, and its header says so where a later reader will meet it.**
> B.0 killed a reader that took `k`, printed "hyperbolic", and realized nothing. **Nothing here is inferred.** A realization is **CONSTRUCTED** — the inradius solved so the cell's own dihedral becomes 2π/k, and **which model is not chosen either**: the target is compared with the cell's OWN euclidean dihedral (bigger ⇒ the cell must inflate ⇒ S³; smaller ⇒ H³; equal ⇒ E³, sealed **positively**). Then it is **PROVEN three ways** before any class is carried: the deck fit on the emitted co-vectors, every door's witnessed in-model isometry, and **the closure walk**. Fail any one ⇒ no seal, no model, and the euclidean transport says exactly what it always said. **An absence here is a true absence.**

**`src/manuscript/apertureModel.ts`** — the tracer takes a model.
- **ONE loop, not two.** The committed 12-float affine deck is widened to the 4×4 with bottom row `(0,0,0,1)` and goes through the same code. **On an affine matrix `pushChartRay` reduces to `applyPoint`/`applyVector` EXACTLY — asserted with `===` over 36 pushes, never hoped for.** The euclidean render is not a branch beside the model path; it **is** that path at E³.
- **⚠ An affine door is NOT renormalized, and the test is STRUCTURAL, not a tolerance.** Found by measurement: renormalizing moved every committed euclidean render by ~1e-16 per door. **A bit that moves for no reason is a bit nobody can later explain.**
- **⛔ At E³ the gate hands `model: null` ON PURPOSE.** The sealed map and the committed deck fit are the same rigid maps of the same cell. Handing the render a second copy of a map it already has moved **20 of the 43 flat forms** in the last ulp for nothing. **Two producers for one fact is how a render drifts from its own witnesses.** The **class** is carried regardless, in `gate.seal`.
- The scene is built in the room the person is **in** (the model's chart corners; furniture scaled to it — **craft, never geometry: the walls, the doors and the transport never see that scale**).

**`src/manuscript/ManuscriptView.tsx`** — R1 (the two request bumps out, the bounds measurement kept because *Fit Selected* is the person's own gesture) and R3 (the three-column wrap). The B-110 measurement that bought R1 is kept in place as the comment, because it is the measurement she ruled on.

**Witnesses:** `diagnose-the-noncube-domain` **§9** (new: the seal, the render, the shrink, the door round-trip, the metre, the E³ null, the degenerate refusal, the full census); `deficit_app_driver.py` + `diagnose-deficit-app` **§E-PLATE recut to R1's ruling**; three diff-surface allow-lists; `diagnose-the-ink`'s depth marker (**the marker is the law, not the spelling** — both spellings satisfy it, a `value`-side fade still fails it).

---

# 5 · TWO THINGS THE BUILD'S OWN WITNESSES CAUGHT, AND ONE I MUST NAME

1. **I read the wrong number and it inverted the finding.** `formCopiesVisible` at a single threshold reads the H³ room as **emptier** than the euclidean one — the exact opposite of what is happening. The threshold **sweep** is what makes a shrink legible as a shrink. **One number there would have shipped a backwards claim.**
2. **A door round-trip "failed" at 2.9e-4** — my test direction was 1.0003 long and a projective push renormalizes. The fix was the test data; the property is now written down.
3. ⛔ **A CORRECT WITNESS THAT DOES NOT COVER THE CHANGE, named rather than left to be discovered:** the honest door's clause 4 and the orbifolds' body clause 3 call `traceAperture` **with no model**. They pin that the euclidean path did not move — **true, and verified: 43 flat forms and 79 sound forms byte-identical** — and they say **nothing** about the app's render, which passes `gate.model`. **The 2 sealed cube forms genuinely draw differently now.** That is the cut working, not a regression, and §9 carries the sentence so the next reader meets it.

---

# 6 · WHAT I COULD NOT REACH

- **§2's label** — her words have not reached my inbox. **Ready to land the moment they do.**
- **The interior walk** (§2 above) — named in full, deliberately unstarted.
- **The aperture plates are invisible on the page at the default camera** — for T³ as much as for the new room; they read only when the row is framed. **Pre-existing, not this cut, and not chased.**
- ⚠ **I left a browser tab open** at `localhost:5174` — the app's own unsaved-changes guard refused to close it. My dev server is stopped and the port is released; the tab is inert.

— the coder
