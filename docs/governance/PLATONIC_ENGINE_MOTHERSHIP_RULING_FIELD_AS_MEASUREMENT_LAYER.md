# Mothership Ruling — The field is a measurement layer over a derived invariant (law vs instrument)

**From:** Mothership (4th seating) · **On:** the researcher's spec "the connection-wave field as the measurement layer over the derived invariant" (companion to the second-arrow / spectral-flow spec) · **Date:** 2026-06-26 · **Routes:** researcher (finish the seam test), engineer (build after), Sovereign

## Verdict: architecture RATIFIED; build + canonical ADR GATED on the seam test

The field saga resolves — and it resolves *honestly*. The "field" was always sold as a **law** and kept coming out hollow (skew-adjoint) or declared (driven-relaxation, `ConnectionWaveFieldLaw`). The correction is an architecture, not a new law: **one derived invariant (the truth) + one measurement instrument (what makes it observable).** Iron filings are not the magnetic field — but you need them to see it, and you never confuse the two.

## What I verified (independent run)

The load-bearing justification — that the bare invariant is too coarse to read order, so the *path* carries structure the *endpoint* hides — confirmed on our objects: two distinguishable births reaching the same complex have an **order-blind endpoint** (`{0,2,4,5,5}` either order) but an **order-sensitive path** (mid-spectra differ: D-first `{0,0,4,4,4}` vs E-first `{0,0,2,4,4}`). The order is real, in the path, and invisible to a coarse endpoint invariant. (Layer 0's pieces are already grounded/built: the signed-pull-back connection, holonomy `= w₁` [ADR 0001], and the spectral flow [verified, ADR 0012 addendum].)

## Ruling

1. **Layer 0 — the derived invariant — is the LAW.** Parameter-free, grounded: the orientation–genealogy connection (the committed signed pull-back / `certifyOrientation`; `U ∈ {±1}` lifting to `U(1)×SO(3)` along the genealogy) + its two **complementary** invariants — holonomy `Hol = ∏U` (`= w₁` on the orientation line, built; needs a loop, `H₁≠0`) and spectral flow `SF` (verified; needs a birth). This is what enters `CONTEXT.md`/ADR — **never a probe parameter.**
2. **Layer 1 — the connection-wave field — is a measurement INSTRUMENT, not a law.** Reclassified (ratified). Admitted **only** under three **binding** disciplines:
   - **LABEL** — `ψ` is the filings, never the law; **no ADR clause is written in terms of `ψ`** — only in terms of Layer-0 invariants.
   - **DECLARE** — every probe parameter (`γ, α, ω_s, φ_s, wave-speed, τ, κ`) is stated before the run, never result-fitted.
   - **TRACK** (load-bearing) — the instrument must **reproduce** the invariant, not invent it: field holonomy `F_γ = arg Hol(γ)` equals the derived holonomy; order-localization matches the spectral flow's path-dependence; the readout is robust across declared ranges (not knife-edge); **strip the probe → Layer 0 unchanged.** `Dη` is the *medium* (impedance / potential / source profile), never `ψ` and never the invariant.
3. **Build + canonical ADR are GATED on the seam test.** Acceptance items 1–2 are grounded PASS (order-sensitive + site-legible on distinguishable births; order-blind on symmetric); item 4 partial. **The researcher finishes items 3 (`F_γ` = the derived holonomy on the looped/flip-glued variant) and 5 (strip-the-probe tracking)** — the TRACK guarantees that keep the instrument honest — **before any ADR or engineer build.** No canon, no build, until the seam test passes. (This is the same gate as the §7 second-arrow legibility, now resolved *through* this architecture: legibility comes via the **tracked instrument**, not the bare integer — which §7's order-blindness showed is too coarse.)
4. **Subsumption ratified.** Blicero's `ConnectionWaveFieldLaw_v0`, the driven-relaxation, and the skew-adjoint are subsumed as instrument-**candidates**, ranked by the discipline: the skew-adjoint reads nothing (hollow); the driven-relaxation reads order coarsely; the connection-wave on the **derived** `U` reads order + holonomy + localizes — the leading candidate, pending the seam test.

## Routing
- **Researcher:** finish seam-test items 3 and 5 → return. That closes the gate.
- **Mothership:** on a passing seam test, write the canonical ADR (0013) and sanction the build; on failure, log Layer 1 as a rejected probe and keep Layer 0 (the law) alone.
- **Engineer:** build Layer 1 as a labeled probe **only after** that ratification.
- **Commit:** Arman (native).
