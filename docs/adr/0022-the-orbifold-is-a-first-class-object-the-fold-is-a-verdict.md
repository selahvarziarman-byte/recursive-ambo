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

### 5 · ⚠ THE HONEST RESIDUAL — orbifold ⇏ "not a topological manifold"
This must not over-claim, and the wall wording must not either.
- A **π-rotation fold** can yield a space that **is** a manifold carrying an orbifold *structure*.
- A **reflection fold** yields a **mirror boundary**.
- **What is CERTAIN is the NON-FREENESS** (the fixed midpoint). `folded-edge` asserts that and nothing else.
- Whether the underlying space is *also* a manifold is the **finer question the SUBDIVIDED gate answers** (via the fixed vertex's link).

### 6 · They have BODIES — the branch is not a dead end
Orbifolds carry an **intrinsic interior view**: in the image-space ray trace the ray **REFLECTS** at a mirror wall (`v ← v − 2n⟨v,n⟩`) instead of transporting by a gluing isometry. IMPA's Ray-VR renders the mirrored cube and the mirrored hyperbolic dodecahedron as first-class examples. So the 97 are **a class we can NAME now and BODY later** — and design **ADR 0004 §4** already rules that orbifolds draw by the *same law, with no new mark* (the singular locus shows itself in the recession; **no orbifold badge in the world**).

## Consequences
+ **A fifth of the dim-3 door stops crashing and starts producing a named object.** The person's legitimate pick yields a legitimate form.
+ **The refusal becomes information.** `folded-edge` tells the person *what they built*, not merely that the engine declined.
+ **The ceiling is NOT breached.** ADR 0019 bounded level-3 to the seed-derivable family; **orbifolds are exactly what that family produces when the pairing is not free.** They are *inside* the scope, not beyond it — and reading them costs one cheap test the gate already has the data for.
+ **The render arc gains a third family** (E³/S³/H³ × manifold **and orbifold**), with the mechanism already specified (ray reflection).
− The subdivided-gate question (is the underlying space a manifold?) is real work, deferred and honestly named.

## The law this pays out, for the third time
**Instruments, not guards.** The op is never pre-refused; the gate judges the result; **and the judgement is a description, not a dismissal.** Level 2 gave us the junction. Level 3 gives us the orbifold. Each time, the thing we were tempted to throw away turned out to be an object with a name, a record, and — now — a body.

The minimalist moves were available and were rejected: *keep throwing* (a crash is not a verdict), or *pre-refuse those pairings* (a guard, and a lie about what the person built). **ADR 0014 holds: expand — name the class, keep the object.**
