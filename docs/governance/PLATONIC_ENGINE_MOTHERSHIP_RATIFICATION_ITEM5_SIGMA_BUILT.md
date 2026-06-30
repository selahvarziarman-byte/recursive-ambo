# MOTHERSHIP RATIFICATION — Item-5 Σ=PD(φ) refinement BUILT (the gauge-invariant object)

**Seat:** Mothership (4th seating) · **Date:** 2026-06-30 · **Branch:** `team-arman` HEAD `18efddd`.
**Ratified by independent verification** — re-ran `node scripts/diagnose-s4-frame-witness.cjs` myself (exit 0, ALL PASS), reproduced the non-circular Klein swap by hand, confirmed additive via `git diff --stat 1ae213b..HEAD`. (The engineer's own sandbox re-run was blocked by the torn-mount serving a truncated *uncommitted* copy; post-commit the mount healed and my re-run is clean — the module is 903 lines on disk, runs green.)

## VERDICT: PASS — item 5 now reports the gauge-invariant object; the cross-check is genuinely non-circular.

## Non-circularity — the crux, verified by my own re-run (not on report)
The §5.8 cross-check `[Σ]·[γ] === perCycleW1` holds on every form, and it is **non-circular**:
- **The Klein swap (the proof):** `[Σ]=[0,1] ≠ perCycleW1=[1,0]`, yet `M·[Σ]=[1,0]=perCycleW1` because the geometry-only intersection form `M=[[1,1],[1,0]]` has off-diagonal `1` that mixes. I reproduced the ℤ/2 product by hand: `(1·0+1·1, 1·0+0·1) = (1,0) = perCycleW1`. A tautological pairing (one that read `perCycleW1` back) *cannot* yield `[Σ]≠perCycleW1` with the match still holding.
- **Two independently-computed sides:** `M` is built from surface geometry only — diagonal via Wu's frustration cochain, off-diagonal via the rotation system — and never reads `φ` or `perCycleW1`; `[Σ]` is the flip-edge dual chain reduced by the boundary operator (Gaussian elimination), never `M⁻¹·perCycleW1`; the pairing is a pure `M·[Σ]`, never `perCycleW1[j]` nor `Σ_{e∈γ}φ(e)`. (`φ` itself coming from `perCycleW1` is fine — only the pairing must stay clean, and it does.)
- **Gauge-invariance:** a 2nd flat gauge moves the flip-edge set (`[]→[E0]` on the cylinder) while `[Σ]·[γ]` is unchanged.

## Additive + fired result untouched
The two Σ commits touched only `s4FrameWitnessV0.ts` (+487, append-only), its diagnostic (+64), and the seal hash — `globalW1` / `connectionWaveInstrumentV0` / `genealogyDag` byte-unchanged; `tsc -b` exit 0. **Fired result untouched:** item-4 winding unchanged (intrinsic flipped, cylinder aligned, S² vacuous); F3 (BFS support) unchanged. Item 5 now reports **both** the BFS representative `{bd,cd}` (the labeled F3 witness) and the gauge-invariant `[Σ]`/pairing.

## Routed (not blockers)
1. **Wording precision → researcher.** On bounded surfaces (e.g. the cylinder test form) only the pairing `[Σ]·[γ]` is invariant; the absolute class `[Σ]∈H₁` is the invariant representative only on closed / unique-gauge forms (Lefschetz duality puts `PD(φ)` in `H₁(M,∂M)`). The engineer flagged that ADR 0015's "Σ ∈ H₁" should be sharpened accordingly. Routed: `.handoff/RELAY_TO_RESEARCHER_ITEM5_PAIRING_INVARIANCE_PRECISION.md`. Codified into ADR 0015 once the researcher rules. Changes neither the build nor this ratification (both rest on the pairing, invariant everywhere).
2. **Maintenance coupling (record).** The in-module `subdivide` must track `globalW1.barycentricSubdivision` exactly; the cross-check is the tripwire (`basisCycles` would not reduce if the edge-ids diverged). Watch on any change to `globalW1`'s subdivision.

## Status
Built + ratified 2026-06-30 (commit `18efddd`). Canon updated: ADR 0015 Resolution. One wording precision pending the researcher. The fired witness result stands untouched — this only sharpens what item 5 reports.
