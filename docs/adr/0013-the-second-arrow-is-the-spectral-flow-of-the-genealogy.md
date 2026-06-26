# 0013 — The second arrow is the spectral flow of the genealogy, read by a tracked connection-wave instrument

Closes Merge Phase-1. Builds on ADR 0012 (the spectral column + its second-arrow addendum) and the mothership ruling "the field is a measurement layer over a derived invariant." **The seam test PASSED (all five items), mothership-verified at the crux.** This canonizes the result, written in terms of Layer 0 (the law) only.

## The architecture: law vs instrument
The "field" is two things that must never be confused — a derived **law** (Layer 0) and a declared **measurement instrument** (Layer 1). The iron filings are not the magnetic field; you need them to see it, and you never mistake them for it.

## Layer 0 — the LAW (derived, parameter-free) [canonical]
The **orientation–genealogy connection** `U` — the committed signed pull-back / `certifyOrientation` (`U ∈ {±1}`, lifting to `U(1)×SO(3)` along the genealogy) — and its two **complementary** invariants:
- **Holonomy** `Hol(γ) = ∏U` (needs a loop, `H₁≠0`): `Hol = −1` is exactly `w₁ = 1`. *Mothership-verified:* the connection-Laplacian on a 6-loop has spectrum `{0,1,1,3,3,4}` (1 zero mode) at `θ=0`/`w₁=0`, and `{0.268,0.268,2,2,3.732,3.732}` (**0 zero modes**) at `θ=π`/`w₁=1` — the twist forces the antipodal node; weight-invariant.
- **Spectral flow** `SF` along the genealogy (needs a birth): *mothership-verified* — a birth flows the Laplacian spectrum `{0,0,4,4,4} → {0,3,5,5,5}` irreversibly, net crossing `1`, no return.

`w₁` (built, static) is the **Z/2 shadow** of both. This is what enters canon — never a probe parameter.

## The second arrow [canonical]
The second arrow is **not a new, independent arrow.** It is genealogical depth (ADR 0009, the one arrow) **read spectrally.** Frozen, the spectral column is a complex-level static reading (ADR 0012); read *along* the genealogy it is the field. The two columns marry at the root — the topological arrow *is* the time, the spectral reading along it *is* the field, `w₁` is the shadow. ADR 0009 stands; this is its spectralization.

## Layer 1 — the connection-wave field: a SANCTIONED, TRACKED instrument (not a law) [sanctioned]
A labeled probe — `ψ` on the per-incidence registry slots; transport = the connection Laplacian on the **derived** `U`; sources = the genealogy's births. It is **not** a law, and **no canonical clause is written in terms of `ψ`.** Admitted under three binding disciplines, **seam-test PASSED (mothership-verified at the crux):**
- **LABEL** — `ψ` is the filings; the holonomy / spectral flow is the field.
- **DECLARE** — every probe knob (`γ,α,ω,φ,τ,κ,wave-speed`) stated before the run; readout weight-robust (verified: the holonomy / zero-mode pattern is weight-invariant).
- **TRACK** — the instrument reproduces the invariant **two independent ways** (field-spectrum + Wilson-loop/current), reports nothing the invariant lacks, and **survives stripping** (`Hol`/`SF` are defined from `U` / the bare Laplacian, no `ψ`, no knob). It is order-sensitive on distinguishable births, order-blind on symmetric ones, and vacuous where `H₁=0` — no invented structure.

The skew-adjoint exchange (hollow), the driven-relaxation (coarse), and `ConnectionWaveFieldLaw_v0` are subsumed as instrument-candidates; the connection-wave on the derived `U` is the sanctioned one.

## Build & routing
Layer 0 is canon. **Layer 1 is sanctioned to be built by the engineer as a labeled probe — after Enabler 2**, since it reads E2's per-incidence registry seam. The canonical language stays in terms of Layer 0; `ψ` never enters an ADR clause. `CONTEXT.md` gains the Layer-0 glossary (the connection, holonomy, spectral flow, the second arrow) as a follow-on. Commit: Arman (native).
