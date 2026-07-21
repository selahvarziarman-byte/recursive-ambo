# 0022 — The orbifold is a first-class object; the folded edge is a VERDICT, not a crash

Status: **Accepted** — researcher-ruled + grounded, mothership-ratified 2026-07-13. Extends **ADR 0019** (level-3 / the S² gate) and **ADR 0006** (the manifold-strata factory — *junctions recorded*) one dimension up. Serves **ADR 0004/0006** (*instruments, not guards*) and connects to the intrinsic-render arc.

## Context

The dim-3 door (`the aperture`, baseline `9d02726`) lets the person pick opposite-face pairings on a seed cube plus a dihedral-orbit map, and glue. The S² gate judges and refuses by name — **cleanly, except in one place.** `level3Orientation` does not refuse; it **THROWS** `edge class FOLDED`, on **97 of the 512 door-reachable pairings — 19%.**

A fifth of the door was wearing a crash's clothing.

## Decision

### 1 · A FOLDED edge is a VERDICT about the object, not malformed input
Grounded on the thrower itself (`level3Orientation.edgeRelDir`): it fires **exactly** when an edge's two ends land in one end-class — i.e. **the identification maps the edge onto its own reverse (`e ≡ ē`), fixing its midpoint.**

- **A fixed point ⇒ the group action is NOT FREE ⇒ the quotient is an ORBIFOLD** (it carries a singular locus), not a free-quotient manifold. That is a **positive fact about the object**, discovered — not a defect in the person's input. **The person's pick was legitimate.**
- Over ℤ a fold forces `2e = 0`, but `C₁` must be **free** ⇒ **the oriented integer chain is genuinely undefined on that cell structure.** So the throw was a *correct detection in the wrong register*: an **exception**, where our law demands a **named wall**.

**97/512 are not broken doors. They are the door's ORBIFOLD BRANCH.**

### 2 · A new S²-gate failure kind — `folded-edge`
Alongside the committed `edge-link` and `vertex-link` failures. It asserts **exactly non-freeness — no more**:

> `kind: 'folded-edge'` — *the identification is not free: it folds edge class `<id>` onto its own reverse, fixing its midpoint. The quotient is an orbifold (a fold locus), not a free-quotient manifold.*

**Ordering:** the **gate runs BEFORE `level3Orientation`**; the cheap detection (`tailsTogether && tailToHead`) **moves into the gate**; the orientation reader's throw survives only as an **unreachable programmer-guard**.

### 3 · The cure clause — **THE CURE IS AN EFFECT, NOT A METHOD** *(restated 2026-07-14; the first wording was wrong and shipped)*

> **THE REQUIREMENT (the effect): the identification's FIXED SET must be a SUBCOMPLEX** — no cell may be identified with itself non-trivially (the fixed set must not sit in a cell's interior). *That is precisely why the chain is undefined otherwise: a self-folded cell forces `2c = 0` over ℤ while `C_k` must be **free**.*
>
> **GENERAL METHOD — BARYCENTRIC subdivision.** Guaranteed for an arbitrary complex (classical: barycentric subdivision makes a simplicial action regular). **It is not the only cure, and on a cubical seed it is not the minimal one.**
>
> **CUBE SPECIALIZATION — CUBICAL (edge-midpoint → 8 sub-cubes).** Valid because **on the committed Build-1 family the ONLY foldable cell is an EDGE**: the 3-cell is the fundamental domain and is never identified; **a face cannot self-pair** (`faceIdentification.ts:316` — *"a face cannot pair with itself in Build 1"*, enforced) and the perfect matching makes every face-class `{F, F′}` with `F ≠ F′`; 0-cells cannot fold. Cubical subdivision **preserves the cell type** (cubes stay cubes, every face stays a quad, so paired-face congruence survives) and **pulls in NO deferred machinery.**
>
> **⚠ PRECONDITION — stated by line, because it is a guard and not a caveat:** the specialization is valid **exactly while `faceA !== faceB` is enforced.** Admit a **face paired with itself** — a *mirror* pairing, which is precisely how one generates a **reflection orbifold** — and a **FACE can fold**; edge-bisection no longer suffices and the **general (barycentric) cure returns.**
>
> **Subdivision still does NOT make the orbifold a manifold. It makes the ORBIFOLD LEGIBLE** — the gate can then read the fixed vertex's link.

**Why the first wording was a defect and not a detail** *(mothership)*: it named **BARYCENTRIC**, and barycentric of a cube yields **simplices** — a different cell type — which walks straight into **the non-cube domain constructor that this same ADR defers.** *The cure clause, as written, forced the work the ADR postpones.* And the engine had **no subdivision at all**: for one build, 19% of the dim-3 door named what the person had made and then **pointed at a door that was not there** — breaking **ADR 0018**, the very law the folded-edge build was built on.

> ### **LAW — A CURE MUST BE A DOOR, NOT A THEOREM.**
> ADR 0018 requires that a refusal carry its cure. This sharpens it: the cure must name **the effect the person needs**, be achievable with **machinery that exists**, and **drag in no deferred arc**. *A wall that names the general proof that an effect exists — rather than the door — is worse than a wall with no cure, because it promises one.*

**RIDER (confirmed; seal it as its OWN clause, do not smuggle it into the subdivision seal):** the finer question this ADR honestly defers — *"is the underlying space **also** a manifold?"* — **becomes computable the moment subdivision exists**: the fold's fixed midpoint is then a genuine vertex, and the gate reads its link (**S² ⇒ a topological manifold carrying an orbifold structure; not-S² ⇒ not**).

### 4 · ORBIFOLD is a FIRST-CLASS OBJECT CLASS
Not a broken form; not a form we merely tolerate. **This is the ADR-0006 spirit — record the strata, do not swallow them — lifted one dimension.** At level 2 the gate's refusal produced the **junction**, which we *keep and record*. At level 3 it produces the **orbifold**, and we keep that too.

**A gate refusal has never been a statement that the object is unreal. It is the instrument naming what the object IS.**

### ★ 5-bis · **THE RESIDUAL IS NOW CLOSED — the 97 are NOT manifolds. PROVEN.** *(2026-07-14, by the subdivision this ADR chartered)*
**In a PL 3-manifold every vertex link is S².** The subdivided folds read **RP²** links (200/200, χ=1) — **a definitive non-manifold certificate.** (Plus 92 torus/Klein corners and 12 further RP² corners: **304** link failures, counted independently by two offices.)

> **⚠ AND THIS DOES NOT RETRO-JUSTIFY THE ORIGINAL WALL. §5's restraint was CORRECT.** Before subdivision the complex was **unreadable** and the claim would have been **unearned** — so the wall asserted **non-freeness only**, which was all we had. **The subdivision bought the right to say more.**
> ### **The wall may now say more than it could yesterday — because the door was hung.**
> ***That is LAW 14 paying a dividend: the cure was a door, and walking through it answered the question the wall could only refuse.***

> ### ✅ **AND THE DIVIDEND IS COLLECTED — RULED 2026-07-16: THE SUBDIVIDE NOTICE MAY TELL THE PERSON "THIS IS NOT A MANIFOLD."**
> *The certificate is now **EXECUTED in the repo**, not quoted: **97 folded forms subdivided · 200 fold midpoints examined · χ of the midpoint links = {1: 200} · χ=2 (S², a manifold): ZERO · subdivided: sound 0, refused 97/97.***
>
> **Two canon rulings appeared to collide and do not — they are about different OFFICES:**
> - **"The ROOM claims no manifoldness — that certificate is THE GATE's"** is a **JURISDICTION, not a gag order.** It says *which office may speak*, and the answer was **not the room**. **It never said the gate must stay silent.**
> - **THE TWO REGISTERS DECIDE IT** *(design ADR 0004)*: the **ROOM is the WORLD register — the phenomenon** — and the non-manifoldness is **invisible** (the RP² point is isolated; hygiene; prints nothing) ⇒ **the room must never assert it.** The **SUBDIVIDE NOTICE is the SPECIMEN register — the proof, summoned** ⇒ it is **the GATE speaking, in the gate's own voice, about a certificate the gate now genuinely holds** ⇒ **it may say it.**
>
> **THREE CONDITIONS (all already this ADR's):**
> 1. **Only AFTER subdivision, and only from the READ certificate** — never from the fold verdict alone. *Before subdivision the complex is unreadable and the claim is unearned; §5's restraint is **not** retro-justified.*
> 2. **It says what the gate READ, in the gate's terms:** *the midpoint link reads **χ=1 ⇒ RP²**; in a PL 3-manifold every vertex link is S²; therefore **not a manifold** — an orbifold.* **A certificate, not a verdict handed down.**
> 3. **The ROOM still says nothing.** The body keeps saying `"orbifold — n=[…] · fold loci: N"`, and nothing about manifoldness. ### **The wall speaks; the world does not.**
>
> ### **If we hang the door and then forbid the answer, the door was decoration.**

### 5 · ⚠ THE HONEST RESIDUAL (as originally ruled — retained; **superseded by 5-bis**) — orbifold ⇏ "not a topological manifold"
This must not over-claim, and the wall wording must not either.
- A **π-rotation fold** can yield a space that **is** a manifold carrying an orbifold *structure*.
- A **reflection fold** yields a **mirror boundary**.
- **What is CERTAIN is the NON-FREENESS** (the fixed midpoint). `folded-edge` asserts that and nothing else.
- Whether the underlying space is *also* a manifold is the **finer question the SUBDIVIDED gate answers** (via the fixed vertex's link).

### 6 · They have BODIES — the branch is not a dead end
Orbifolds carry an **intrinsic interior view**, and the 97 are **a class we can NAME now and BODY later**. Design **ADR 0004 §4** rules that they draw by the *same law, with no new mark* — the singular locus shows itself in the **recession**; **no orbifold badge in the world.**

> ### ⚠ CORRECTED 2026-07-14 — **the ray does NOT reflect. That was my error, and it was in this ADR.**
> This section originally said: *"the ray **REFLECTS** at a mirror wall (`v ← v − 2n⟨v,n⟩`) instead of transporting"*, citing IMPA's **mirrored cube**. **That law is for an object our engine cannot build.**
> - **A mirror wall is codim-1: it requires a face glued to ITSELF by a reflection.** The engine **forbids it twice** — `faceIdentification.ts:316` (*"a face cannot pair with itself in Build 1"*, throws) and `:348` (**perfect matching**: every boundary face in exactly one pair, with a *different* face). **No Build-1 form has a mirror wall anywhere. The mirrored cube is UNREACHABLE.**
> - ~~**Every one of our 97 folds is on an EDGE — codim-2 — a CONE AXIS.**~~ ⛔ **REFUTED THE SAME DAY. That was my second error in this section, and it is the one I was simultaneously warning another seat against.**
>   > **THE SINGULARITY IS A CONE ON RP² — an isolated POINT (codim-3), not an axis.** *An isometry reversing an edge `e` through its midpoint `m` may be a **π-rotation** (a LINE, codim-2, det=+1), a **reflection** (excluded — see above), **or the POINT-INVERSION `−I`** (the POINT `m`, codim-3, **det = −1**). *"The fold reverses an edge"* is **necessary for two survivors and separates neither** — **the elimination was run against a list of two when the list has three** (LAW 18).
>   > **THE DECIDER WAS ALREADY IN OUR OWN NUMBERS: a cone axis is a topological MANIFOLD point** (ℝ³/rotation ≅ ℝ³; link **S²**, χ=2) — **the gate would have PASSED it. The gate refuses 97/97 on `vertex-link`.** At the fold's fixed points: **200 of 200 links read `components=1, χ=1`. ZERO read S².** Edge-links are clean ⇒ every link is a **closed surface** ⇒ **χ=1 ⇒ RP²**, and no other closed surface has χ=1.
>   > ⇒ **local model `ℝ³/{±I}` — the CONE ON RP².** Local group **ℤ₂ = {1, −I}**: **isolated · codim-3 · ORIENTATION-REVERSING.**
>
> ### ⛔⛔ AND "NOTHING WINDS" IS **WITHDRAWN** (2026-07-15) — **THE FORM HAS TWO SINGULAR SETS, AND EACH OFFICE HELD ONE AND CALLED IT THE WHOLE.**
> **I canonized *"there is no axis; nothing winds."* It is TRUE of the topological point and **FALSE of the METRIC**.**
>
> | | **TOPOLOGICAL** *(researcher's)* | **METRIC** *(the designer's §4 — and he was RIGHT)* |
> |---|---|---|
> | what | isolated **POINTS** — folded-edge **midpoints**, RP² link | **CONE EDGES** — any edge-class whose dihedrals miss 2π |
> | codim | **3** (a point) | **2** (an AXIS) |
> | test | the gate's vertex link (χ=1 ⇒ RP²) | **edge-class SIZE**: a class of `k` cube-edges carries `k×90°` ⇒ **FLAT ⟺ k=4; any k≠4 is a cone edge** |
> | seen? | **INVISIBLE** — no winding, no focusing; **hygiene** | **★ RAYS WIND AND FOCUS — and this is the ONLY part a person will SEE** |
> | how many | 200 points; **97/97 forms** | **61 of 97 forms** (measured: 180°×108 · 270°×32 · 540°×16 · 720°×24) |
>
> **★ And the tell that settles it: the 43 FLAT (`k=4`) sound manifolds carry ZERO cone edges — which is exactly why T³ always rendered cleanly.**
> **⛔ NEVER derive the singular set from a FITTED DECK GROUP — read it from the GATE and the EDGE-CLASS SIZES** (LAW 20).
>
> ### ✅✅ **SETTLED BY THE SCREEN (2026-07-15) — THE WINDING IS REAL, VISIBLE, AND COUNTABLE IN DOORS.**
> **The decisive render, on a form that CAN carry it — same form, same code, two edges, cell-local transport:**
> ```
> k = 4  FLAT edge (the control) → the room returns at 360°, after 4 doors
> k = 2  TRUE CONE EDGE          → the room returns at 179°, after 2 doors
> ```
> ### **The room comes back at a HALF TURN on a cone edge and a FULL TURN on a flat one — in the same room. No ink, no badge, no caption. That is 0.2's mark.**
> **⇒ The E³ transport is CORRECT for every form the engine builds** (each is a **Euclidean cone-manifold**; the cell-local face-map step **IS** its geodesic flow — no development, no deck group, no fundamental domain). **The door has simply been HIDING it.** **`ARC E — the cone-metric transport` is DISSOLVED: it was never needed.**
> **⚠ AND THE DISTINCTION THAT SAVES THE TRANSPORT (LAW 20's scope):** *fitting the face maps into a **GROUP** and reasoning inside it is the sin; applying them **CELL-LOCALLY** is the truth.* **Same isometries — one use is the flat double cover, the other is the manifold.**
>
> ### ★★★ **THREE MARKS, NOT TWO — AND THE FOLD IS VISIBLE AFTER ALL (2026-07-15; overturns "the fold is claimed by no eye," which was mine).**
> **A CLOSED-LIST sweep (1128 orbits, all 512 forms, EVERY edge class) settles it — and it is a THEOREM the sweep confirms, not a statistic:**
>
> | mark | seen as | ⟺ | proof |
> |---|---|---|---|
> | **WINDING** | the room comes home **EARLY** (`k` doors, not 4) | **`k ≠ 4`** (cone **OR** fold) | dihedral sum ≠ 2π |
> | ### **FLIP** | the room comes home **MIRRORED** (det = −1, axis reversed) | ### **THE FOLD** | folded ⟹ local group `{1,−I}` ⟹ `−I` ⟹ det=−1; **not**-folded ⟹ a det=−1 edge-preserving isometry is a **mirror** ⟹ a **boundary**, but `cube/~` is CLOSED ⟹ impossible. **∴ MIRRORED ⟺ FOLDED.** |
> | **MIRROR-CLUSTER** | the **copies** return left-handed | **`w₁ ≠ 0`** (GLOBAL) | 57 sound manifolds carry it |
>
> **★ THE WINDING AND THE FLIP ARE INDEPENDENT AXES — the 72 folded `k=4` classes prove it:** they come home at a **FULL turn** (like a flat edge, so the winding is BLIND to them) **and MIRRORED.** *Only the flip sees them.* **200/200 fold classes mirror, zero exceptions — and they are the SAME 200 on which the gate reads χ=1 ⇒ RP². Two independent instruments (a ray tracer and the homology gate), one set** — LAW 25's standard, met.
>
> **⇒ THE FOLD IS VISIBLE: encircle an edge; if the room comes home HANDED THE OTHER WAY, that edge is a fold. No badge, no hole, no ink.** The orbit-collapse probe becomes **secondary** (still valid; the flip is cheaper, needs no probe placement, and certifies **every** folded edge including the 72 the winding cannot see).
>
> **⚠ WHAT SURVIVES of the old ruling:** *invisible from a **STATIC** frame* ✅ **stands** (the flip needs a **moving** observer); *the RP² **POINT** is hygiene, invisible* ✅ **stands** (a different object — the isolated point, not the surrounding edge). **Only *"claimed by no eye"* is withdrawn** — *the fold's visibility lives on the EDGE that surrounds the point, and we never looked there.*
>
> ### ⚠⚠ **IMPLEMENTATION WARNING (2026-07-16, bought with a live near-miss): `mirrored[]` IS NOT THE FLIP.**
> **`apertureModel.ts:1028` — `mirrored[idx] = deckDet(g) < 0`** reads the **deck determinant of the word reaching that pixel: a GLOBAL property.** **It fires on a form with `w₁=1` and NO FOLD AT ALL** (executed: `d+0³` — sound, two `k=2` cone edges, no fold → **369 mirrored pixels, 1 LEFT hand of 3**). **Of the 79 sound forms, 57 are non-orientable; 24 carry `w₁=1` + a cone edge + no fold.**
> ### **⇒ Sealing the fold on `mirrored[]` would certify a fold in up to 57 manifolds that do not have one. `mirrored[]` marks `w₁`. The FLIP is `w₁ = 1 ON THE MERIDIAN OF THAT EDGE` — and the LOCALISATION is the entire content.**
> **Nor does the naive count separate them:** *"count the LEFT hands among the `k` copies"* fails — **a FLAT `k=4` edge shows 2 LEFT of 4 copies** (×192 classes). **That is the mirror-cluster in the fold's clothes.**
> **★ SEAL AGAINST THE ORBIT / the accumulated deck word — NEVER a face-mode product.** *(A combinatorial meridian walk reported some `k=2` folds closing at +1, contradicting the orbit's 200/200; `mode == deck det` verified on all 176 with zero mismatches ⇒ the walk had a bug the orbit did not.)*
> **⇒ The flip needs the observer to WALK the meridian — that is MOTION. A still cannot carry it.**
>
> **⚠ THE CONDITION THAT RIDES WITH THE FLIP (LAW 22, and it OBEYS it):** *you never see your own frame reverse — you see **the room you left come back mirrored**.* So the mark needs a **CHIRAL REFERENCE AT REST** in the room: *in a mirror-symmetric room the flip is REAL and INVISIBLE* (measured: a symmetric object changes **0.0%**, a right-handed helix **91.9%**). **LAW 22 does not forbid this mark — it predicts it.** *(And the localisation is the whole content: MIRROR-CLUSTER = `w₁≠0` on **some** loop, global; the FOLD = `w₁=1` on **the meridian of this edge**, local. That is what stops the flip collapsing into `w₁`.)*
>
> *(Historical, retained: before this sweep the fold was ruled "certified by the gate and read by a probe (the orbit collapse); the winding a cone-edge rotation; the mirror-cluster w₁." All three still stand as objects — the correction is that the FOLD is **also** directly visible, which "claimed by no eye" denied.)*
>
> ### ⛔ *(HISTORICAL — the withdrawal that was itself withdrawn.)* "0.2 MUST DRAW THE WINDING IS WITHDRAWN — THE CONE IS NOT IN THE PICTURE"
> **RENDERED (designer; Γ enumerated, 195 elements):** *the room repeats at **360° on EVERY edge — cone (`k=2`) and flat (`k=4`) alike.** **Nothing at 180°. There is nothing on the screen to see.***
> **THE REASON IS STRUCTURAL AND FATAL: a EUCLIDEAN polyhedron quotiented by EUCLIDEAN isometries HAS NO CONE.** The cell-local transport step **IS** the ambient generator; composing the steps **reconstructs Γ**, and **Γ is the FLAT DOUBLE COVER.** *Four cubes go around every edge because four cubes are what fits in flat space.* **The tracer has been rendering the flat development and we called it a cone.**
> **⇒ The censuses STAND** (combinatorial, render-free: `k = L` on all 6144 edges; the same 61 of 97). **The cone edges are REAL. They are simply not in the image.**
> **⇒ Drawing the 61 requires a transport built on the CONE METRIC ITSELF — no ambient group, no global development. That is a NEW ARC (`ARC E — the cone-metric transport`), and it may NOT ride 0.2.**
>
> ### ★ **WHAT 0.2 ACTUALLY DELIVERS (re-chartered): THE 36.**
> **36 of the 97 folded forms carry NO cone edge — they are FLAT orbifolds, and the committed E³ transport renders them FAITHFULLY.** They get a body. The **61** are **refused — honestly, and for the TRUE reason:** *"this form has cone edges; the Euclidean transport would render its flat development, not the form."*
> **The door was refusing the right forms for the WRONG REASON** (it named a geometry — LAW 15). **Fix the reason, and 36 forms walk through.**
> **The eye may show `w₁`** — the copies come back **left-handed beside the right ones**, a comparison, countable (**LAW 22**: *you never see your own flip; you see theirs*). **The FOLD is never claimed by the eye** — it is certified by the **GATE** and read by a **PROBE** (the orbit collapse, a COUNT, which needs no motion).
>   > ⛔ **NEVER call these "cone orbifolds."** That term denotes a cone **AXIS — which IS a manifold.** We have measured a **non-manifold**. The name would assert manifoldness exactly where we proved its absence.
> - **And no new ray law is NEEDED:** because **every face is paired**, the ray **always has a partner face to transport into**. The committed law — **`p ← g(p), v ← R·v`**, the engine's own gluing isometry — already carries it. **What blocks the 97 is a DOOR, not a TRACER** (`apertureModel.ts:446` returns early on `folded` and never builds a domain).
> - **Shipping the reflect law would draw a MIRROR where the engine has a CONE — a body that looks right and IS A LIE.** *(Same family as LAW 15: asserting more than the engine knows.)*
>
> **Still OPEN and routed to the researcher (do not assume it):** *is `p ← g(p), v ← R·v` correct transport for a **NON-FREE** action?* The orbit is well-defined, so the image should be — **but a ray near the axis winds.** The singularity's **type** and the **transport law** are ruled together; **0.2's seal waits on both.**

## Consequences
+ **A fifth of the dim-3 door stops crashing and starts producing a named object.** The person's legitimate pick yields a legitimate form.
+ **The refusal becomes information.** `folded-edge` tells the person *what they built*, not merely that the engine declined.
+ **The ceiling is NOT breached.** ADR 0019 bounded level-3 to the seed-derivable family; **orbifolds are exactly what that family produces when the pairing is not free.** They are *inside* the scope, not beyond it — and reading them costs one cheap test the gate already has the data for.
+ **The render arc gains a third family** (E³/S³/H³ × manifold **and orbifold**), with the mechanism already specified (ray reflection).
− The subdivided-gate question (is the underlying space a manifold?) is real work, deferred and honestly named.

## The law this pays out, for the third time
**Instruments, not guards.** The op is never pre-refused; the gate judges the result; **and the judgement is a description, not a dismissal.** Level 2 gave us the junction. Level 3 gives us the orbifold. Each time, the thing we were tempted to throw away turned out to be an object with a name, a record, and — now — a body.

The minimalist moves were available and were rejected: *keep throwing* (a crash is not a verdict), or *pre-refuse those pairings* (a guard, and a lie about what the person built). **ADR 0014 holds: expand — name the class, keep the object.**
