# Charter — The Fifth Necessity: the global w₁ class (cycle basis of the *subdivided* assembled complex)

**From:** mothership · **To:** engineer/prompter · **Status:** chartered — certifier-only (derive-only); **scope amended 2026-06-23** after the researcher's pre-seal finding.
**Authority:** the researcher's ratified ruling — necessity (5) is the **whole loop-structure**: `w₁` as a class on a **cycle basis of H₁** (ADR 0011) — *and* their pre-seal correction: the trap is the **representation, not the operator**. The committed single-face representation reads RP² *orientable* (its w₁ cochain is a `Z/2` coboundary there; product↔sum doesn't change it); a **subdivided, non-degenerate** representation gives the correct `w₁ ≠ 0` (grounded on RP²₆, the minimal simplicial RP²). Scope ratified by the mothership.
**Substrate:** reuses the committed 2-colouring (`certifyOrientation` / `certifyCascadeOrientation`) and the cycle-basis machinery; the new work is a **derive-only subdivision pass** + the induced-direction frustration cochain on the subdivided complex.

## Correction absorbed (why the original method was wrong)

The original charter's "sign-product of seam-signs over the H₁ basis on the committed representation" is **degenerate** — the single-face square is too coarse to carry the global class, so RP² reads orientable. A `product → sum` edit does **not** fix it (same representation). The fix is to compute on a **subdivided** representation.

## The build

1. **Subdivide (derive-only).** Produce a non-degenerate representation of the assembled complex — **≥ 2 distinct face-corners per edge-class** — on a **working copy**. The actual form and all operations are untouched; the subdivision exists only for the w₁ computation.
2. **Induced-direction / 2-colouring frustration cochain.** The per-face orientation 2-colouring; the cochain records the **frustration** (where the colouring cannot be made consistent). Reuses the built 2-colouring.
3. **Cycle basis + sum mod 2.** Compute a cycle basis (`H₁`) of the *subdivided* complex; sum the frustration cochain **mod 2** over each basis cycle. (`w₁` is `Z/2`; sum-mod-2 ≅ sign-product — the operator was never the issue.)
4. **Deliverable:** the `w₁` class as the **sorted multiset** of its values on the basis — finite, complete (by `Z/2`-linearity), order-independent.

## The seal (sorted multisets — seal before building)

```txt
torus →  {0, 0}
Klein →  {0, 1}
RP²   →  {1}
```

**The discriminator is the falsifiable core:** Klein `{0,1}` and RP² `{1}` MUST come out **distinct** — and now **robustly** (subdivided), not accidentally. The orientability bit (necessity 4) calls both "non-orientable"; necessity (5) must separate them. Make it an explicit sealed assertion, and **seal every zoo surface**, not just RP².

## Discipline

- **Certifier-only / derive-only:** the subdivision is a working-copy computation; operations and the actual form untouched.
- **Sufficiency, verified then carried:** "≥ 2 per edge-class" must reproduce the sealed values for **all** zoo surfaces in this build; its **general** sufficiency is re-verified when the assembled complex grows past the zoo (the larger-complex stage). If a future form needs finer subdivision, that's a contained refinement — or the trigger to reach for the **fallback**: a representation-robust `w₁` (orientation double-cover / holonomy), explicitly *not* this build's path.
- Reuse the committed 2-colouring + cycle-basis machinery; surface (don't patch) any real certifier gap. Cross-office audit holds. Commit native by Arman.

## Done =

The global `w₁` class computed on a cycle basis of the **subdivided** assembled complex; reproduces torus `{0,0}` / Klein `{0,1}` / RP² `{1}` with **Klein ≠ RP²** (robust); subdivision derive-only; every zoo surface sealed and green. The five necessities complete — the reading's structural support is whole.
