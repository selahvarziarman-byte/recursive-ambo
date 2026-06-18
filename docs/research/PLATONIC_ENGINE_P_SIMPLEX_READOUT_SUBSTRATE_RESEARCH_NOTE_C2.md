# P-Simplex Readout Substrate Research Note C2

## Status

C2 is a researcher-facing note derived from C1.

C2 does not create new policy.

C2 does not create runtime code.

C2 does not reopen T14-T19.

C1 remains the governing charter.

## Why this note exists

The T14-T19 diagnostic burst produced a large amount of evidence. C1 consolidated that evidence into a governance charter. This note restates the usable meaning for a researcher: what can be used now, what is provisional, what is quarantined, and what should stay diagnostic-only.

The short answer is that the near-term usable substrate is closed axis + provisional A3. D3/body-diagonal behavior is systematic and informative, but it is not substrate-safe yet.

## What the diagnostic burst established

T14: bounded pointwise relaxation was accepted as PARTIAL because it was numerically coherent but threshold-sensitive.

T15: response-status ledger passed and established closure categories.

T16: non-axis sweep separated D2 and D3 behavior.

T17: D2/A3 was stabilized as provisional readout across all twelve A3-root drives.

T18: D3/body divergence was shown to be systematic and symmetry-wide, not random.

T19: D3/body mismatch was explained as branch-level threshold overprediction.

These diagnostics are the history summarized by C1. C2 does not re-run, reinterpret, or amend them.

## The usable readout substrate

The consolidated readout substrate is:

- axis / child-axis: `closed`, substrate-safe
- D2 / A3: `provisional-readout`, usable below closure
- D3 / body-diagonal: `threshold-refinement-needed`, quarantined, not substrate-safe
- D4 residual/composite: `diagnostic-only`
- T suppressed transverse controls: `diagnostic-only`

The usable near-term substrate is closed axis + provisional A3.

## Closed channel: axis / child-axis

The axis / child-axis response channel is the only closed channel.

It may be carried into a future readout substrate as a stable accepted class. This does not mean all response classes are closed. It means the axis response channel has enough accepted evidence to become substrate-safe.

Use this channel as the stable anchor for readout status. Do not generalize axis closure to A3, D3, body-diagonal behavior, or the finite ledger as a whole.

## Provisional channel: D2 / A3

D2 supports a stable provisional A3 readout regime across all twelve A3-root drives, below closure.

A3 is useful because its D2 behavior is stable, symmetry-equivalent, and readable across the A3-root drive family. It can be carried forward as provisional-readout evidence.

Allowed A3 vocabulary:

- `axis-locked-regime`
- `axis-dominant-tilted-regime`
- `continuous-tilt-regime`
- `A3-near-regime`
- `same-class-symmetry-degeneracy`
- `provisional-readout`

A3 is not a closed response class.

## Quarantined channel: D3 / body-diagonal

D3 is not random. D3 is systematic. D3 is not closed. D3 is not substrate-safe.

D3 is quarantined because its finite-ledger body threshold is too early relative to branch anatomy. In plain terms: the finite ledger predicts body-diagonal high-mixing before the actual pointwise branch has reached body-near onset.

Carry forward the C1/T19 facts only as diagnostic policy:

- `s_axis_escape = 1.5`
- `s_body_actual = 2`
- `branchSwitchType = continuous-crossover`
- `finiteLedgerErrorBand = [0.808675134595, 1.57735026919]`
- D3 channel status: `threshold-refinement-needed`
- D3 policy: `quarantine-D3-and-proceed-axis-plus-A3`
- D3 `safeForReadoutSubstrate: false`

Do not promote D3 to provisional body readout. Do not call body-near a substrate-safe regime. Do not carry the finite-ledger body threshold forward as actual body onset.

## Diagnostic-only residue: D4 and T

D4 residual/composite behavior and T suppressed transverse controls remain useful for audits and regression checks.

They are not readout channels.

They may help detect regressions or preserve research memory, but they should not enter the substrate vocabulary as accepted readout behavior.

## What the substrate must not inherit

The substrate must not inherit:

- raw sweep rows
- full per-strength tables
- local-minima lists
- branch comparison rows
- Hessian/eigenvalue traces
- alignment-margin dumps
- energy-gap dumps
- finite-ledger body threshold as actual body onset
- closed D3/body response
- FieldCue hooks
- rendering hooks
- route/walk/holonomy hooks
- semantic naming hooks
- defect/vortex hooks
- spatial coupling assumptions
- dense sampling assumptions

The point is to extract a thin readout substrate, not to move the diagnostic bulk into runtime.

## Research consequences

The project can proceed with closed axis + provisional A3 while D3 remains quarantined.

D3 can be revisited later through threshold refinement.

D3 does not block consolidation.

The diagnostic burst has served its purpose.

Do not start another fat diagnostic ledger by default.

## Recommended next move

Prepare a thin runtime extraction proposal only after the researcher accepts this note.

A possible future runtime module is:

```txt
src/lib/pSimplexReadoutStatusCore.ts
```

That future module may include only:

- channel status enums
- readout regime enums
- closure policy map
- forbidden interpretation boundaries
- small stable diagnostic facts

It must not include diagnostics or minimizer calls.

## Compact carry-forward table

| Object | Status | Can enter substrate? | Carry-forward phrase | Do not say |
| --- | --- | --- | --- | --- |
| axis / child-axis | `closed` | Yes | closed axis channel | all P-simplex response is closed |
| D2 / A3 | `provisional-readout` | Yes, below closure | stable provisional A3 readout | A3 is closed |
| D3 / body-diagonal | `threshold-refinement-needed`, `quarantined` | No | quarantine-D3-and-proceed-axis-plus-A3 | D3/body is substrate-safe |
| D4 residual/composite | `diagnostic-only` | No | audit residue only | D4 is a readout channel |
| T suppressed transverse controls | `diagnostic-only` | No | transverse control residue only | T controls define substrate response |

## Boundary statement

This note authorizes only a readout substrate interpretation. It does not authorize FieldCue, semantic naming, route/walk/holonomy, defect/vortex interpretation, rendering, spatial dynamics, dense sampling, or closed A3/D3 claims.
