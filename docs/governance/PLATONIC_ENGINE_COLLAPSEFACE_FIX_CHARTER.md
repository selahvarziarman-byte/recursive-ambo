# Charter — Fix committed `collapseFace` (vertices-only bug) + harden the surface seals

**From:** mothership · **To:** engineer/prompter · **Status:** chartered — **gate-level** (mutates a committed, sealed op + re-seals + checks consumers). Tight step, cross-office audit.
**Authority:** the bug, confirmed by the mothership reading the code (not the report); the researcher's finding + the engineer's reproduction; the cascade's `runCollapseCascade` as the correct reference.
**Substrate (verified):** `surfaceOperations.ts:354` `collapseFace` builds its identification from `face.vertexIds` only — no edge collapse → boundary edges survive as self-loops at the apex. `diagnose-level2-zoo.cjs` sphere seal (≈140–188) checks vertex-merge + `w1` + a **constructed** `buildCollapseLink` `cycle4`; it never computes χ and never reads the real link → the bug passed.

## The bug

`collapseFace` collapses the boundary **vertices** to the apex but leaves the boundary **edges** as self-loops → χ = 1 − 4 + 1 = **−2**, a non-manifold wedge, not a sphere (χ = 2). Wrong output sitting in ratified, level2-zoo-sealed "surface."

## The seal hole (why a wrong op stayed green)

The sphere seal tests the **gluing pattern** (which vertices merge) + `w1` + an **idealized, constructed** link — never the **resulting surface** (χ) and never the **actual** link. This is the level-2 charter's own watch-item #2 ("the adjacency must *be* the real link, not just that `decomposeLink` ran"), unenforced for collapse. The fix closes the op *and* the hole.

## Fix

1. **`collapseFace`** → collapse the **whole boundary** (vertices **and** edges → the apex point), yielding a sphere (χ = 2, manifold). **Single-source it** with the cascade's `runCollapseCascade` boundary-quotient — one correct collapse, not two divergent implementations. (If they must stay separate functions, they must *provably agree* on an isolated face.)
2. **`buildCollapseLink`** → read the link from the **actual** collapsed structure, or delete it if the corrected collapse yields a structure `decomposeLink` reads directly. No constructed/idealized adjacency.
3. **Harden the seals — systemically, not just collapse.** Add a **χ check to all six surfaces** (cylinder 0 · torus 0 · Möbius 0 · Klein 0 · RP² 1 · sphere 2); a surface seal must test the surface, not just the pattern. Confirm every surface's link is **read, not constructed**.
4. **Regression guard:** the χ-hardened sphere seal must **FAIL** on the old vertices-only collapse (prove the new seal would have caught the bug).
5. **Re-seal + check presenter consumers** of `collapseFace` output (anything that read the buggy result).

## Discipline

Surfaced → fixed → tested (the bigon-close pattern). Tight step; **the χ-hardening is the audit's new teeth.** `registry` + `level2-zoo` diagnostics green before and after. Commit native by Arman. Seal discipline — this is a public correctness fix, no strategy exposure.

## Done =

`collapseFace` produces a sphere (χ = 2, manifold) on real material, single-sourced with the cascade's collapse; the level2-zoo seals test **χ for all six surfaces** and provably fail the old bug; links read not constructed; consumers checked; green before and after.

## Sequencing

Independent of the cascade build but converging with it (both want one correct collapse). Engineer slots it; the natural move is to land this so `collapseFace` and `runCollapseCascade` share the single correct boundary-quotient rather than diverge.
