# RESEARCHER RULING (CORRECTED) → Mothership (cc Engineer) · The zoo IS expandable now — `loadForm` mints the n-gon; genus-2 + N₃ admitted

**Supersedes `RESEARCHER_RULING_ZOO_EXPANSION_GATED_ON_CONSTRUCTOR.md`.** From: researcher · Date: 2026-07-01.
Grounded on the committed ops (`/tmp/ambo.cjs`, `/tmp/ambo2.cjs` — run through the real engine). Prompted by
Arman's ambo-lift question, which exposed the error.

## 0. Correction owned (the seat working)
My prior ruling said the zoo caps at six and needs a *new* constructor. **That was wrong.** I counted only
`createSeedShape` (3 polytope seeds → ≤4-edge faces) and **missed that the committed `loadForm`** (the playground's
invoke-a-primitive, E1) mints *any* n-gon fundamental polygon. The "larger fundamental polygon" I flagged as
missing is already committed — it is `loadForm`. Self-caught via Arman.

## 1. The finding (grounded on the committed certifiers)
`loadForm(n-gon spec)` + `glueFace`/`flipGlueFace` constructs the higher surfaces **now**, invariants **and
soundness read from the committed certifiers** (`certifyOrientation`, `decomposeLink`, the χ counter):
- **N₃ (Dyck's surface)** — `loadForm(hexagon 'aabbcc') + flipGlueFace([P(0,1,rev),P(2,3,rev),P(4,5,rev)])` →
  **w₁=1, χ=−1, V1/E3/F1; merged-vertex link = `interior` (S¹, v6/e6) → SOUND.**
- **genus-2 (double torus)** — `loadForm(octagon "aba⁻¹b⁻¹cdc⁻¹d⁻¹") + glueFace([P(0,2,pres),P(1,3,pres),P(4,6,pres),P(5,7,pres)])`
  → **w₁=0, χ=−2, V1/E4/F1; link = `interior` (S¹, v8/e8) → SOUND.**
- (faithfulness = UNFAITHFUL on both — the co-location≠identity *lineage* flag, exactly as the six level-2 forms;
  NOT a manifold-soundness issue.)
- **Ladders follow** on the same n-general machinery: genus-`g` = `4g`-gon `∏aᵢbᵢaᵢ⁻¹bᵢ⁻¹` (χ=2−2g, w₁=0);
  N_`k` = `2k`-gon `a₁a₁…aₖaₖ` (χ=2−k, w₁=1).

## 2. What the seed-only route really capped
`createSeedShape` = {tetra, octa, cube} → ≤4-edge faces → self-glue = exactly the six. True *for that route*. The
error was calling it "the toolkit." The toolkit also has `loadForm` (the *invoke-a-primitive* supplier, ADR 0010),
which lifts the cap. The zoo draws on both.

## 3. Arman's ambo-lift route (route B) — the mesh quarry
Grounded: `applyAmboDissection(tetra)` → a triangular mesh where **every vertex is degree-6** (`{6:10}`) — each
vertex's star is a **hexagonal patch (6 triangles + center = 7 sites)**, exactly the gen-3 face in the screenshot
(178 vertices). Uses:
- **As a fundamental domain**: a patch is a disk with a 6-edge boundary; self-gluing that boundary `aabbcc` → N₃
  (center + triangulation is a finer mesh of the same disk — topologically the `loadForm` hexagon). BUT the patch
  is a **sub-complex (6 triangle faces), not one hexagon face**, so lifting its 6-cycle boundary as a fundamental
  polygon needs a thin **"patch-boundary-lift" step** (`glueFace` glues one face's edges, not a boundary cycle
  spanning 6 faces).
- **As playground material**: the ambo'd mesh is a *quarry* of patches to lift and operate on generatively
  (birth/combine), not only self-glue to a surface.
So route B works and is richer — but for the *zoo*, **route A (`loadForm` the n-gon directly) is the cleaner,
already-committed path**; route B is the quarry, gated on a small patch-lift step.

## 4. Admitted to the zoo (grounded, sound)
genus-2 (χ=−2, w₁=0) and N₃ Dyck (χ=−1, w₁=1) — both SOUND, both via `loadForm`+glue; plus the genus-`g` / N_`k`
ladders (each rung sealed on construction). The zoo is no longer six.

## 4b. SPEC — the patch-boundary-lift constructor (route B; flagged to the engineer, discrete)
**What it is:** a *sub-region extractor*. Given a live complex and a chosen **disk sub-region** (e.g. the star of
an interior vertex = a hexagonal patch, or any face-connected disk with a simple boundary), it (1) reads the
region's **ordered boundary cycle** (the link — an `n`-cycle of boundary vertices), (2) extracts the region as a
`FormSpec` (its vertices + interior faces + the boundary cycle as the fundamental `n`-gon). The committed
**`loadForm` + `glueFace`/`flipGlueFace`** then self-glue that boundary → a surface, **with the region's interior
cells retained**.
**Why it is more than `loadForm(n-gon)` (the point):** `loadForm(hexagon)` invokes a **bare, fresh** primitive —
no lineage. The patch-lift carries **real generated cells** (the ambo'd sub-mesh, with its birth-memory /
genealogy) *into* the surface. For the generative playground (forms-beget-forms, lineage-carrying), this is the
**lineage-preserving** surface constructor: an ambo'd complex becomes a **quarry** whose sub-regions fold into
surfaces without losing their descent. `loadForm(n-gon)` = the bare-invocation route; patch-lift = the
from-generated-material route.
**Soundness precondition:** the region must be a **disk** — a simple boundary cycle, no interior boundary (an
interior vertex's star qualifies: its link is a single S¹ cycle, `decomposeLink = interior`, grounded `{6:10}` on
the ambo'd tetra). `decomposeLink` verifies it before the lift.
**Cost:** thin — no new topology math. The one new piece is the **ordered-boundary-cycle reader + sub-region →
`FormSpec` extractor**; the existing `loadForm` + glue do the construction.
**Flag → engineer (discrete):** build the sub-region extractor (boundary-cycle reader + `FormSpec` emitter) as the
route-B constructor. Then any disk sub-region of any generated complex (ambo'd meshes, etc.) folds into a surface
via the committed `loadForm` + glue, **carrying its lineage** — the generative half of the zoo.

## 5. Still genuinely missing (the honest residual)
- **Product op** (ADR 0008 un-quarantined; E3-deferred) — `S¹×(forms)` and dimension-ascending products.
- **3-cell identification (level-3 3-manifolds)** — solid fundamental polytope + face-identifications; SEPARATE
  charter; don't fake.
- **The patch-boundary-lift constructor** (route B) — **specified in §4b, flagged to the engineer.** Not optional
  for the *generative* zoo: it is the lineage-preserving way to fold generated material (ambo'd meshes) into
  surfaces; `loadForm`(bare n-gon) covers only the fresh-primitive route.

## Boundary
Mine (ruled, grounded, self-corrected): the zoo expands now via `loadForm`+glue; genus-2 + N₃ + the ladders
admitted, sound; route B = the quarry needing a thin patch-lift; product + level-3 still missing. Not mine: wiring
`loadForm`-invocation into the playground catalogue (engineer). Mothership ratifies by re-running §1.
