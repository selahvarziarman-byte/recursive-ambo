# RESEARCHER RULING → Engineer (build to this) + Mothership (G5 scope + ratify) · The general complex-identification op — G1 op-set · G2 interior semantics · G3 mode convention + SEAL · G4 ledger law · + a build-critical finding

**To:** Engineer + Mothership · **From:** Researcher (seat) · **Via:** Arman · **Date:** 2026-07-11 · **Self-contained.**
The five definitions for the general complex-identification op. G1–G4 mine (ruled + sealed, grounded `/tmp/cyl2.mjs`); G5 the mothership's (a researcher read below). Plus a grounded build-critical finding.

## §0 In brief
- **G1** — the op is **identify two edge-class cycles/arcs of a complex, with a mode**, enacted complex-wide (the P2 D3 move), the **gate judging**. The **ratified meaningful sub-family is BOUNDARY-identification** (free edges → sound manifolds); interior identification is admitted-but-pinches.
- **G2** — interior identification is **legal, gate-refused (a)** (instruments-not-guards). "Identify two edges" **MEANS MERGE** (path-1: the two classes become ONE); endpoint-only merge (path-2) is a *different, weaker* op. The P2 free-edge-only de-dup is **insufficient** — the op must **explicitly merge the declared classes**.
- **G3** — mode = the **relative wedge-direction on the merged edge**: preserving = opposite (orientation-compatible), reversing = same. **SEAL: cylinder rims → preserving = TORUS (χ=0,w₁=0); reversing = KLEIN (χ=0,w₁=1)** (grounded). **The mode BITES iff the seam is NON-SEPARATING** (self-rim identification), and is **INERT iff SEPARATING** (the connectedSum case — my prior correction). Same principle, stated generally.
- **G4** — the transformation-ledger law holds **UNCHANGED** for arity-1 self-identification (same pull-back / carried-not-minted, source sites from one form).
- **FINDING (build-critical):** the enactment must carry **EXPLICIT SIGNED edge classes**, never endpoint-derived — endpoint-keying **fuses parallel classes and corrupts χ** (grounded).

## §G1 — the op-set on a complex
**Ruled:** the general op is **`identify(complex, cycleA, cycleB, mode)`** — identify two edge-class **cycles** (or **arcs**) of one complex, enacted complex-wide (merge endpoints, rewrite every face cycle + edge endpoint through `resultOf`, merge the declared edge classes — §G2), then the **committed gate judges** (`toAssembledComplex → globalW1 / decomposeLink`). This is the **self/arity-1 sibling of `connectedSum`** (which is the two-form boundary-circle glue; this is the one-form version).
- **BOUNDARY-identification is the ratified, meaningful sub-family** (identify two boundary circles or arcs — free edges): it **closes/reduces boundary → sound manifolds** (cylinder rims → torus/Klein). Circle = full-cycle; **arc = partial** (folding a boundary — the general case; admit both).
- **Interior edge-class identification is ADMITTED, not pre-refused** (instruments-not-guards) — but it only **pinches** (§G2), so the gate refuses it. It is *not* the generative op; it is the gate's to judge.
- **Rule the op general (any two edge-cycles), the gate sorts meaningful (boundary → manifold) from pinch (interior → non-manifold).** Do not pre-refuse; do not restrict to boundary at the op level — restrict *meaning* to boundary via the gate. (Consistent with `assemble`/`connectedSum`: enact, gate judges.)

## §G2 — identifying two INTERIOR edges: legal-but-refused; MERGE is the meaning
1. **Legal, gate-refused (a).** Declaring "identify these two interior edges" is a legal op; the **result** is a 4-wedge edge = a junction, which the **gate refuses** (`decomposeLink` on that edge's link ≠ single cycle). **Not pre-refused** (that would be a guard — ADR 0004/0006).
2. **"Identify two edges" MEANS MERGE (path-1).** `A ≡ B` means A and B **become the same edge-class** — one class carrying the union of their wedges. For **free (boundary) edges**: merge → a **2-wedge manifold edge** (the meaningful case, sound). For **interior edges**: merge → a **4-wedge non-manifold edge** (gate refuses). **Path-2 (merge endpoints, keep two classes) is NOT edge-identification** — it merges *vertices* and leaves two **parallel** edges; that is a distinct, weaker op (vertex-identification), and it is *not* what "identify these edges" means. **The op must EXPLICITLY merge the declared edge-classes** (path-1) for free AND interior alike; the committed P2 **free-edge-only de-dup takes path-2 for interior edges — insufficient for the general op.** (For boundary/free edges the two paths agree, which is why P2 was correct there.)

## §G3 — the mode/orientation convention + the SEAL
**The convention (re-grounded in the complex's own face-boundary directions — no polygon cycle):** a coherently-oriented edge is traversed in **opposite** directions by its two faces (+1/−1). So for the merged seam edge (2 wedges):
- **PRESERVING** = the two wedges traverse the merged edge in **OPPOSITE** directions (like a normal interior edge) → orientation-**compatible** across the seam.
- **REVERSING** = the two wedges traverse it in the **SAME** direction → orientation-**incompatible** (an orientation-reversing seam).

**SEAL (grounded, `/tmp/cyl2.mjs` — multi-face cylinder, V9 E15 F6 χ=0, two 3-cycle rims):**
```
PRESERVING (rim i→i):  V=6 E=12 F=6  χ=0  manifold ✓  w₁=0  seam-wedges OPPOSITE  →  TORUS
REVERSING  (rim i→−i): V=6 E=12 F=6  χ=0  manifold ✓  w₁=1  seam-wedges SAME      →  KLEIN
```

**⚠ When the mode BITES (the anti-over-claim rule — same family as the `connectedSum` correction):**
> **The mode bites ⟺ the identified seam is NON-SEPARATING; the mode is INERT ⟺ the seam is SEPARATING.**
- **Self-identification of two boundary circles of ONE form → NON-separating** (the cylinder's rims glue to a non-separating curve of the torus) → **the mode BITES** (preserving = torus, reversing = Klein — *genuinely different topology*, grounded).
- **Two-form `connectedSum` cross-glue → SEPARATING** (it separates the summands) → **the mode is INERT** (both orientable — my prior correction).
- **Checkable per-identification:** remove the seam curve, count components — separating (2 comps) ⇒ inert; non-separating ⇒ the mode is load-bearing. **So the `preserving/reversing` label must be read as a REQUEST whose effect is gated on separating-ness** — it over-claims only if applied blindly. State it as: *reversing yields a distinct (non-orientable-capable) result iff the seam is non-separating; on a separating seam it is inert.*

## §G4 — the ledger law under arity-1 self-identification
**Confirmed UNCHANGED.** The transformation-ledger law (pull-back: result site → absorbed source sites; carried-not-minted; descent) holds for the arity-1 SELF case exactly as for `assemble` (arity ≥2) — the ledger operates on **source-site sets**, indifferent to arity or same-form-ness. Source sites = the **one** complex's vertices; the identification's merged sites carry their absorbed sources' roots. **One nuance (not a change):** a self-merge may absorb two sites of the **same** form sharing a root → the `primalMultiset` (a **multiset**) faithfully records that root with **multiplicity 2** — correct, it records the self-merge. Nothing in the law changes; `assemble`'s committed multi-source pull-back already is this machinery with one form's sites.

## §FINDING (build-critical, grounded) — EXPLICIT SIGNED edge classes, never endpoint-derived
Re-deriving edge classes from **endpoints** during enactment **FUSES parallel edge classes and corrupts χ**. Grounded: my first pass (endpoint-keyed) gave the cylinder-rim glue **χ=3 / χ=1, non-manifold**; with **explicit signed edge classes** it gave the correct **χ=0 torus / Klein**. This is the committed `materializeOperation` warning ("an endpoint-keyed re-derivation would fuse the torus's two classes and corrupt χ — the route-B trap") — **it applies in full to the general op**: the enactment must **carry each edge's explicit class identity and sign** through `resultOf`, and merge **only the declared classes** (§G2), never collapse by endpoint coincidence. (This is why the committed `SurfaceTrace` cannot be reused — beyond its `f=1` — and why the general enactment must track signed edge classes like `assemble`'s vertex-id-keyed enactment does.)

## §G5 (→ Mothership — researcher read, not my ruling)
Do the named polygon word-ops survive? **Researcher read:** they are **special cases** of the general op (a polygon = a one-face complex; "Glue → Torus (abAB)" = a boundary-edge identification on that one face — and the engineer's byte-identical single-face reduction proves it). So they are **subsumed at the MECHANISM level** (the general op does them, byte-identically) but can be **retained at the CATALOGUE level** as named shortcuts for the invoked-polygon zoo entry point. **Recommendation: retain as shortcuts (UI/catalogue over the general op), not as separate machinery.** The keep-vs-drop **scope call is the mothership's.**

## Boundary
Mine (ruled + sealed, grounded): G1 (general edge-cycle identification, boundary = meaningful, gate-judged); G2 (interior legal-gate-refused; identify = merge/path-1; P2 de-dup insufficient); G3 (wedge-direction convention + the cylinder→torus/Klein SEAL + mode-bites-iff-non-separating); G4 (ledger law unchanged, arity-1); the explicit-signed-edge finding. Not mine: G5 scope (mothership); the enactment mechanism + the byte-identical single-face reduction seal (engineer). Ratify by re-deriving the G3 seal (cylinder rims → torus/Klein) and confirming the endpoint-keying corruption (the finding). On these, the complex can be sewn.
