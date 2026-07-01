# 0017 — The product visual is a continuous animated director-field, not a glyph witness

Status: **Accepted** — sovereign design directive, 2026-06-30. Governs the whole UI / render arc built on the engine→UI bridge.

## Context
The first engine→UI bridge render landed as a **glyph diagram**: named points, colored spheres, a red seam tube, diagnostic labels. That is a useful **debug witness** — it proves the bridge carries the derived structure to the screen — but it is the **wrong visual language for the product**, and the sovereign ruled it explicitly *not the target*. It must not become the default by inertia.

## Decision (binding)
The product visual is a **continuous, animated, phenomenological field** — the polyhedron as a **body containing and carrying a living field**, not a diagram with markers placed on it.
- **Continuous, not glyph.** Flowing striations / advected texture / liquid-crystal bands / smoke-plasma-current motion. The viewer immediately perceives transport, twisting, sliding, internal circulation. Static points, arrows, tubes, labels, seam-markers are **not** the default language.
- **One field, volume + skin.** The field is continuous through the polyhedral **interior** and appears on the **boundary surface** as animated flow-map / vector-texture motion that is the visible **skin of the same internal field** — never separate surface decoration.
- **A director field, not an oriented vector field.** Locally a direction axis, but globally the sign can flip: `v ~ −v` (a line field / twisted bundle). The `w₁` flip is rendered as a continuous **twist / phase-inversion / half-turn / director-reversal** in the flow — **experienced, not marked**. A loop through the seam returns with reversed orientation and the viewer can feel it. The seam is **where the field's continuity law changes**, not a graphic object.
- **The glyph witness survives only as an optional debug overlay**, off by default.

## Why this is correct (not arbitrary aesthetics)
The director winding **proved** at the witness is `½` — a half-integer disclination, the signature of a **nematic / liquid-crystal director field** (`v ~ −v`, π-disclinations). The liquid-crystal-band aesthetic with a half-turn at the `w₁` seam is therefore the math's **native visual form**, not a skin over it: the `w₁=1` flip *is* a director disclination, and rendering it as a continuous half-twist is rendering the theorem.

## Not acceptable (the rejection list)
Colored spheres / arrows / a red-tube seam as the main representation; a static diagram; surface-only decoration disconnected from the interior; ordinary vector-field animation that ignores the `v ~ −v` director symmetry; any rendering where the `w₁` flip is only **labeled** rather than **experienced**.

## Consequence
The whole render queue (the frame, holonomy, ψ, the second arrow) is built in this language — continuous, animated, director-correct — reading from the engine→UI bridge. Acceptance is **phenomenological** (does the field live and twist), not "is the witness located." Buildable spec + technique: `.handoff/RELAY_TO_ENGINEER_UI_CONTINUOUS_DIRECTOR_FIELD.md`.

## Amendment (2026-06-30 — researcher-corrected, mothership-owned): the twist is connection-carried, not interpolation-emergent
The researcher's disclination-realization ruling (their last act; grounded `/tmp/disc`; `.handoff/RESEARCHER_RULING_DISCLINATION_REALIZATION.md`) corrected a claim in this ADR and its charter — that the `w₁` twist *emerges automatically from correct interpolation*. **It does not, and cannot.** The interpolated nematic Q-field of the fixed site directors is **correctly `w₁`-blind** (`max|Q_flip − Q_control| = 0`): the ½ is the **obstruction to orienting the headless director** — it *is* `w₁`, and `w₁` lives in the **connection**, not the axis values. The interpolation gives only the **floor** `n₀`; the ½ is **carried by the connection**, realized as `n = R(α)·n₀` — a continuous π half-turn (`α: 0→π`) across a `Σ = PD(φ)` representative, magnitude = the committed holonomy, so it **vanishes on `w₁=0`**. Two consequences for the product visual:
1. **The felt invariant is the linking holonomy, not a located twist.** The success criterion is that **a loop through the structure returns with reversed orientation** (`Hol = −1` around a cycle linking the seam) — the gauge-invariant content, item-5 lifted to the render.
2. **The disclination locus is a free representative** (homologous cuts are physically equivalent — grounded: move the cut, winding unchanged `= ½`). Center the visible cut on a seam-coincident representative for **legibility**, but render it *as a chosen representative*, never as "the" position. Build M1b to make the **loop-reversal** felt; never pin correctness to the locus.

## Amendment 2 (2026-07-01 — sovereign-ruled, mothership-owned): the product is the PHENOMENON; verification stays HEADLESS
M1b's first render drifted into a **diagnostic** — a rounded noise-LIC *sphere* with orbiting rings + transported arrow markers (the loop-transport *apparatus* drawn on screen), the octahedron's form dissolved into a ball. Two failures, both traceable to the charter (mine): (a) the M1b charter literalized "felt in the flow" into "*a loop transported around the seam **visibly** returns reversed*" — an on-screen marker, exactly what "experienced, not marked" forbids; (b) even Amendment 1's "`Hol=−1` around a cycle linking the seam" framing carried the verification-criterion seed into the *visual*. The campaign's falsifiable-rigor — right for the math — leaked into the product's visual language.

**The correction (Arman's ruling, 2026-07-01) — "experienced, not marked" restored to primacy:**
1. **The body is the FACETED octahedron** — the engine's actual crystalline form (facets, edges), the field flowing continuously over its faces. Never a rounded/subdivided sphere; the polyhedron *is* the point.
2. **The `w₁` reversal is felt in the FLOW** — the nematic striations comb, twist, and **return inverted across the seam** (a continuous phase-inversion, never a tear); the viewer *feels* the half-turn in the living field. No rings, no transported markers, no orbiting furniture. A **subtle, non-diagnostic cue** (a seam glow / colour-shift where orientation flips) is allowed to aid the eye — never anything that reads as an instrument.
3. **Verification stays HEADLESS.** The falsifiable linking-holonomy (`Hol=−1` flip / `+1` control) is the invariant and the *gate* — it lives in `scripts/diagnose-*`, off-screen, never as on-screen furniture. It is what is TRUE, not what is RENDERED.

**The distinction to hold (both offices, and Codex):** the **proof** and the **product** are different artifacts. The linking holonomy is the proof (headless); the felt reversal in the flowing field on the faceted form is the product. **Render the phenomenon; keep the proof headless. Never literalize "felt" into a marker.** (Corrected build: `.handoff/PROMPT_DIRECTOR_FIELD_M1b_V2_VISUAL_CORRECTION.md` — engineer-released on the ruling, mothership-confirmed aligned.)
