# Charter — Layer-1: The Connection-Wave Instrument (the measurement layer over the derived invariant)

**From:** Mothership (4th seating) · **To:** the Engineer office (senior + operating) · **cc:** Researcher (R-L1 pre-build), Sovereign, TO · **Date:** 2026-06-27 · **Authority:** ADR 0013; the "field is a measurement layer" ruling; the E2 seam (ratified).

The field's **measurement instrument** (ADR 0013, Layer 1). It is **not a law** — a **labeled probe** over the derived invariant (Layer 0: the orientation–genealogy connection `U` + holonomy + spectral flow), built **additively** over the E2 seam. The seam test is already grounded and mothership-verified; this build stands the instrument up in our committed code so it *reproduces* those invariants. **Iron filings — never the magnetic field.**

## §1 Target
- State `ψ : X_K → ℂ⊗ℝ³` on the per-incidence slots (E2's `X_K` seam).
- Transport = the connection Laplacian on the **committed** `U`: `(L_U ψ)_x = Σ_{y~x} w_{xy}(ψ_x − U_{xy} ψ_y)` — `U` is Layer 0's (E2 carries `U=(-1)^{w₁}` on glue/flip-glue edges; **read it, do not redefine it**).
- Probe law: `ψ̈ + γ ψ̇ + L_U ψ + N(ψ) = J_K(t)` — `J_K` = the genealogy's births (E2's DAG, queryable as sources); `N` optional (declared gates/thresholds).
- Observables (readouts of the invariant): `I_x=|ψ_x|²`, `θ_x=arg ψ_x`, `j_{xy}=Im(ψ_x^* U_{xy} ψ_y)` (current), `F_γ=arg Hol(γ)` (loop holonomy — **must match Layer 0**), `R_s` (source contribution), generated-site pressure.
- Declared, labeled knobs: `γ, α, ω_s, φ_s, wave-speed, τ, κ` — every one declared up front, never result-fitted.

## §2 Grounding (the seam is built; the test is passed)
- E2 exposed the seam (ratified): the `X_K` per-incidence slots (where `ψ` lives), `U` on glue/flip-glue edges (Layer-0's law), births queryable as sources. Layer 1 attaches here **by adding**.
- The seam test is grounded + mothership-verified (ADR 0013): `F_γ = Hol` (`θ=π → w₁=1`, no zero mode); order-sensitive on distinguishable births / blind on symmetric; weight-robust; strips clean. This build reproduces those in committed code.

## §3 Scope
**IN:** a NEW module (e.g. `src/lib/connectionWaveInstrumentV0.ts`) + diagnostic — the `ψ` state, the connection Laplacian on the committed `U`, the wave evolution with declared knobs, the births as sources, the observables. **Additive over E2.**
**FORBIDDEN:** redefining `U` / holonomy / spectral flow (Layer 0, committed — read, don't rebuild); editing any committed module; **any canonical clause in terms of `ψ`**; UI; E3 product.

## §4 Acceptance — the three disciplines as the gate (engineer seals exact **Layer-0-invariant** values, not raw `ψ`)
1. **TRACK · holonomy:** `F_γ` (the instrument's measured holonomy) `=` the derived `Hol = ∏U` on the looped/flip variant, at every `θ` (`θ=π → w₁=1` / no zero mode); the field-spectrum and Wilson-loop/current readouts **agree**.
2. **TRACK · order:** order-sensitive + site-legible on distinguishable births (the seam); **order-blind on symmetric** (no invented order).
3. **DECLARE · robustness:** the readout (the invariant) is stable across declared knob ranges (`γ,α,τ,κ,…`) — not knife-edge.
4. **TRACK · strip:** removing the probe leaves Layer 0 (`Hol`, `SF`) **byte-identical** — the invariants are defined from `U` / the bare Laplacian, no `ψ`, no knob.
5. **LABEL:** no assertion and no canonical clause is written in terms of `ψ`; the sealed values are Layer-0 invariants.
6. **Additive:** committed modules (Layer 0 + E2 + core) byte-unchanged; the instrument reads the seam without redefining it.
7. **Falsifiers (must NOT trigger):** the field invents order (symmetric), holonomy (`H₁=0`), or parameter-fragile structure → reject.
8. No regression.

## §5 Disciplines
The three binding disciplines (ADR 0013) are the gate: **LABEL** (`ψ` is never the law), **DECLARE** (knobs up front, never fitted), **TRACK** (reproduce, never invent; strips clean). Seal-before-build (operating engineer seals the Layer-0-invariant expected values; the **senior** reviews and holds the LABEL/TRACK guards). Forward-additive (add, never reshape committed code). Cross-office audit; never `git add -A`; commit is Arman's.

## §6 Routing
- **→ Researcher (R-L1, pre-build):** pin the canonical objects (looped/flip variant for holonomy; the two-tetrahedra seam for order; symmetric for the blind control) + the expected **Layer-0 invariants** the instrument must reproduce + the declared knob ranges for robustness. (Pins the already-grounded seam test as the build spec.)
- **→ Engineer office:** seal exact invariant values → build-prompt (a labeled probe, additive) → coder builds → audit (does it track? additive? no `ψ` in canon?) → draft verdict + commit.
- **→ Arman:** native commit.

## §7 Done
A new diagnostic green asserting §4 (the three disciplines, in terms of **Layer-0 invariants**) through the real committed modules + the E2 seam; committed modules byte-unchanged; one verdict to the mothership; the instrument stands as a **labeled probe that reveals the law and is never mistaken for it.**
