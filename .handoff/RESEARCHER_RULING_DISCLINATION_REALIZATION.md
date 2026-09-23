# RESEARCHER RULING → Engineer (cc Mothership) · realize `winding=½` as a connection-modulated director (ADR 0017 crux)

From: researcher · To: Engineer office (operating) · cc: Mothership · Via: Arman · 2026-06-30. Self-contained.
Grounded `/tmp/disc` (reproduces the engineer's floor + grounds the positive construction). This is the
correctness/realization ruling the director-field render is blocked on.

## The pivot: the Q-field's blindness is CORRECT and expected — that is the whole answer
The ½ is the **obstruction to *orienting* the headless director** — it *is* `w₁`, carried by the connection. A
pure headless Q-field of the 6 fixed axes is therefore **correctly `w₁`-blind**; `max|Q_flip − Q_control| = 0`
(reproduced `/tmp/disc` A) is exactly what a faithful headless field *must* show. So the ½ does **not** and
**cannot** emerge from the axis values alone. **ADR 0017's crux claim — "the twist emerges automatically from
interpolation" — is false** (flagged to the mothership for amendment, below). The engineer's M1a proof stands and
is the floor.

## Ruling — the construction that canonically carries the ½ (the engineer's Option 1, made precise)
**The director field is the committed geometric axes carrying a continuous π half-turn accumulated across a
representative of `Σ = PD(φ)`, the half-turn's magnitude being the committed connection's holonomy.** Concretely:

> `n(x) = R(α(x)) · n₀(x)`, where `n₀` = the interpolated committed site directors, and `α(x)` is a continuous
> phase that sweeps `0 → π` across a neighborhood of a cut representing `Σ` — `α`'s total jump = `π ×` (the
> committed connection holonomy across that cut). On the surface render the cut is a `Σ`-representative *curve*
> (the half-turn is *across* it); for an interior render it is a cut *surface* bounded by `Σ`.

Grounded `/tmp/disc` C: this winds **½ on `w₁=1`, 0 on `w₁=0`** — `w₁`-dependent, vanishing on the control.
Everything is derived from committed data — `n₀` from the site directors, the cut-locus class from `Σ=PD(φ)`,
the magnitude from the connection holonomy — **none of it coder-choosable.**

## Why this is NOT the forbidden cut (the three differences, the discriminator is the third)
The fake (`θ=φ/2` at the arbitrary non-seam `ab–ac`) differs on three counts the correct construction fixes:
(a) the cut is **`Σ=PD(φ)`** (the forced invariant seam-class), not an arbitrary edge; (b) the half-turn
**modulates** the real axes `n₀`, it does not replace them; (c) the magnitude is the **committed connection
holonomy**, so it **vanishes on `w₁=0`**. **(c) is the discriminator** — the correct field is *absent on the
control*; the fake plants ½ regardless. (That is also why the fake's `0.500 at ab–ac` is wrong: its cut does not
realize the `Σ` class, so a linking test loop's holonomy would not match the committed `w₁`.)

## Option 2 (a globally-continuous section carrying the connection) is RULED OUT
On `w₁=1` there is **no** continuous oriented section (grounded `/tmp/disc` B: parallel-transport closure `= −1`
— the obstruction *is* the ½), and a forced continuous lift unwraps the ½ to **integer** winding (the engineer's
own continuous-lift finding). The ½ is **inherently** the obstruction to global continuity; it must be realized
as a cut/half-turn (the multivalued covariant-constant section's branch), never read from a global continuous
section.

## The locus is representative-free; the invariant is the linking holonomy (item-5, one level up)
The cut is a **representative** of `Σ` — homologous representatives are physically equivalent (the wall slides;
grounded `/tmp/disc` D: move the cut → winding unchanged `= ½`, holonomy unchanged `= −1`). The gauge-**invariant**
content is the **linking holonomy**: a loop crossing the cut an odd number of times picks up `π` (`= −1 =
w₁(loop)`). This is exactly the **item-5 pairing ruling** lifted to the render: *pair, do not pin the position*.

## The bridge must expose `Σ` AND the connection (answer to the engineering sub-question: YES)
The 6 lines + the discrete BFS representative are **provably insufficient**. The field must consume **`Σ=PD(φ)`**
(the cut locus-class — already computed by `s4FrameWitnessV0.poincareDualClass`, cheap to surface) **and the
committed connection** (`edgeSigns`/`orientationSign` — the holonomy that sets `α`). Surface both.

## The M1a gate, refined (test the gauge-invariant content, not the absolute locus)
PASS iff: **(i)** a test loop linking the disclination has holonomy `−1` (the cut realizes the `Σ` class, matching
the committed `w₁`); **(ii)** strength `½` (the π half-turn); **(iii)** **absent on a `w₁=0` form** (`Σ` trivial →
no wall) — the discriminator; **(iv)** invariant under the `Σ`-representative choice (move the cut among
homologous curves → same verdict). **Do not** assert the absolute cut position (representative-dependent).

## Boundary
- **Mine (ruled, grounded):** the construction (connection-modulated `n = R(α)n₀`, π half-turn across a
  `Σ`-representative, magnitude = the committed holonomy); Option 2 ruled out; the invariant is the linking
  holonomy, not the locus; the refined M1a criteria.
- **Mothership's:** ADR 0017's "twist emerges automatically from interpolation" is underdetermined/false — a
  charter amendment is owed, downstream of this ruling. I flag it; they own it.
- **Engineer's:** expose `Σ`+connection on the bridge; rebuild the sampler around `n=R(α)n₀`; re-run M1a (refined).
