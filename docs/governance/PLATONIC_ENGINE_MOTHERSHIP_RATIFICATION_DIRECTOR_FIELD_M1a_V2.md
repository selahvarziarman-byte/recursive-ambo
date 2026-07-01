# MOTHERSHIP RATIFICATION — Director-field M1a-v2 (`n = R(α)·n₀` realizes the committed `w₁`)

**Seat:** Mothership (4th seating) · **Date:** 2026-06-30 · **Branch:** `team-arman` (build in working tree — Arman's native commit pending; a native `index.lock` was present).
**Ratified by independent verification** — re-ran `scripts/diagnose-director-field.cjs` myself (gate **4/4**, exit 0), reproduced the ½-disclination math independently, read the construction (`directorFieldV0.ts`), and read the researcher's grounded ruling.

## VERDICT: RATIFIED — the connection-modulated director realizes the committed `w₁` as a ½-disclination that vanishes on the control.

## Provenance (honored)
`n = R(α)·n₀` was grounded by the **researcher — their last act** (`.handoff/RESEARCHER_RULING_DISCLINATION_REALIZATION.md`, grounded `/tmp/disc`). It is a strong final ruling: it identified that the pure Q-field is *correctly* `w₁`-blind (the ½ is the obstruction to *orienting* the director — connection-carried, not in the axis values), ruled out the global-continuous-section option, tied the locus to the item-5 pairing ruling, and **caught a false claim in ADR 0017** ("the twist emerges from interpolation"). That correction is owned and codified (ADR 0017 Amendment, 2026-06-30). Not engineer-improvised — researcher-grounded.

## My verification
- **Gate 4/4 (my run):** A5 (core axis = committed `dir(bd)×dir(cd)`), C2 (strength **½** — a π half-turn, 90° max reorientation on flip / 0 on control), C3 (**absent on `w₁=0`** — `max|control field − n₀| = 0`; the discriminator the fake fails), C4 (holonomy `−1` + strength ½ invariant under the free cut locus). Load-bearing: **A5 + C2 + C3**.
- **Independent math:** around the core loop `n₀ → … → −n₀`; closure `n(2π)·n(0) = −1` (the vector flips, the line stays continuous — the ½-disclination); `H=0 ⇒ n ≡ n₀` exactly (no winding on control).
- **Construction (read):** a genuine nematic **Q-tensor** floor (`Q = n⊗n − ⅓I`, sign-free — not a vector lerp) + the connection layer `R(α)·n₀`, `α = H·θ/2`; `H = committedHolonomy(Σ, windingSign)` (1 iff Σ nontrivial ∧ `∏U=−1`), so `H=0 ⇒ n≡n₀`. Derive-only (recomputes no `w₁`/gauge/Σ; only generic render LA). **Additive** — 2 new files + a `+32/−4` bridge exposure (`sigmaClass`/`sigmaChainEdges`/`edgeSigns`); every committed engine module + `Workspace3D` byte-unchanged.

## The §6 ruling (the locus, for M1b)
The researcher already settled the math: the locus is a **free representative**; the gauge-invariant content is the **linking holonomy** ("pair, do not pin"). My product ruling, per ADR 0017 (amended): **M1b renders the linking holonomy as the felt invariant** — a loop through the structure returns reversed. The visible cut is centered on a **seam-coincident representative for legibility** (framed as a chosen representative, not "the" locus); the further-additive embeddable seam-curve exposure is **authorized** if it aids legibility. Relay: `.handoff/RELAY_TO_ENGINEER_UI_M1B_LINKING_HOLONOMY.md`.

## Status
M1a-v2 ratified, ready for Arman's native commit. Additive, derive-only, gate-green. M1b unblocked. The immediate arc (M1a-v2 + M1b) rests on the old researcher's ruling + ratified canon; **a new researcher is still owed** for the definitional questions M2 (the interior volumetric field) will raise — recruitment (the calibration pair) remains live.
