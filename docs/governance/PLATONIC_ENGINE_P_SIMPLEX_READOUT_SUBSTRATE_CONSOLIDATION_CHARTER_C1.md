# P-Simplex Readout Substrate Consolidation Charter C1

## Status

This charter is the first consolidation artifact after the T14-T19 P-simplex diagnostic burst.

It is not T20. It is not another diagnostic ledger. It is not a runtime extraction. It is a governance control point for deciding what may later be carried into a thin readout substrate.

The accepted diagnostic sequence remains diagnostic evidence. It is not itself the substrate.

## Purpose

This charter answers three questions:

- What can be safely carried forward from T14-T19 into a future thin readout substrate.
- What must remain diagnostic-only.
- What must be explicitly excluded.

A future runtime substrate, for example `src/lib/pSimplexReadoutStatusCore.ts`, may be proposed only after this charter is accepted. No such runtime module is created by C1.

## Accepted diagnostic basis

The source basis for this charter is:

- T14: `P-SIMPLEX-BOUNDED-POINTWISE-VECTOR-LG-RELAXATION-LEDGER-T14-PARTIAL`
- T15: `P-SIMPLEX-BOUNDED-RELAXATION-RESPONSE-STATUS-LEDGER-T15-PASS`
- T16: `P-SIMPLEX-NON-AXIS-THRESHOLD-SWEEP-READOUT-LEDGER-T16-PASS`
- T17: `P-SIMPLEX-A3-PROVISIONAL-READOUT-LEDGER-T17-PASS`
- T18: `P-SIMPLEX-D3-BODY-DIAGONAL-DIVERGENCE-ANATOMY-LEDGER-T18-PASS`
- T19: `P-SIMPLEX-D3-BODY-DRIVE-BRANCH-ANATOMY-LEDGER-T19-PASS`

These ledgers are accepted as diagnostic evidence only. They must not be imported wholesale into a runtime substrate, and their report builders must not become runtime dependencies for readout status code.

## Consolidated channel map

| Channel | Consolidated status | Substrate consequence |
| --- | --- | --- |
| axis / child-axis response channel | `closed` | Substrate-safe readout channel. |
| D2 / A3 readout regime | `provisional-readout` | Stable provisional evidence below closure. |
| D3 / body-diagonal readout | `threshold-refinement-needed` and `quarantined` | Systematic diagnostic evidence, not substrate-safe. |
| D4 residual / composite structural behavior | `diagnostic-only` | Audit residue, not a readout channel. |
| T suppressed transverse controls | `diagnostic-only` | Control residue, not a readout channel. |

The project may proceed with closed axis plus provisional A3 while D3 remains quarantined.

## Closed substrate

The axis / child-axis response channel is closed.

The closed substrate may carry the axis response channel as an accepted readout class. This includes the D0/D1/D5 closure result from the T14-T15 sequence.

Allowed wording:

- closed axis channel
- closed child-axis response channel
- axis response is substrate-safe

Forbidden wording:

- all P-simplex response is closed
- all finite ledger classes are closed
- A3 is closed
- D3/body is closed

## Provisional substrate

The D2 / A3 readout regime is provisional.

D2 supports a stable provisional A3 readout regime across all twelve A3-root drives, below closure.

A3 may be carried forward as provisional readout evidence, but it is not a closed response class.

The following D2 terms may be carried forward:

- `axis-locked-regime`
- `axis-dominant-tilted-regime`
- `continuous-tilt-regime`
- `A3-near-regime`
- `same-class-symmetry-degeneracy`
- `provisional-readout`

This provisional status is intentionally narrower than closure. It permits a future readout substrate to acknowledge stable A3 evidence without claiming that A3 is closed.

## Quarantined substrate

The D3 / body-diagonal readout remains quarantined and threshold-refinement-needed.

T18 and T19 show that D3 is systematic but not substrate-safe. The finite ledger predicts body-diagonal high-mixing before the accepted pointwise branch anatomy supports body-near onset.

Carry forward only as diagnostic policy:

- D3 channel status: `threshold-refinement-needed`
- D3 policy: `quarantine-D3-and-proceed-axis-plus-A3`
- D3 `safeForReadoutSubstrate`: `false`

Diagnostic facts recorded from T19:

- `s_axis_escape = 1.5`
- `s_body_actual = 2`
- `branchSwitchType = continuous-crossover`
- `finiteLedgerErrorBand = [0.808675134595, 1.57735026919]`

The finite-ledger body threshold must not be carried forward as actual body onset.

D3 can be revisited later through threshold refinement. Consolidation is allowed even though D3 remains unresolved.

## Diagnostic-only residue

D4 residual / composite structural behavior remains diagnostic-only.

T suppressed transverse controls remain diagnostic-only.

These rows and controls may remain useful for audits, regression checks, and research review. They are not substrate readout channels.

No residual, composite, or transverse-control result may be promoted into a readout class without a new explicitly authorized research question and a separate acceptance gate.

## Thin readout vocabulary

Allowed channel statuses:

- `closed`
- `provisional-readout`
- `threshold-refinement-needed`
- `quarantined`
- `diagnostic-only`
- `forbidden`

Allowed readout regimes:

- `axis-locked-regime`
- `axis-dominant-tilted-regime`
- `continuous-tilt-regime`
- `A3-near-regime`
- `body-near-regime`

Restriction: `body-near-regime` may appear only as diagnostic D3 branch/readout evidence. It is not substrate-safe yet.

Allowed degeneracy terms:

- `single-minimum`
- `same-class-symmetry-degeneracy`
- `cross-class-threshold-degeneracy`
- `unclassified-degeneracy`

Allowed finite-ledger relation terms:

- `consistent`
- `coarse-compatible`
- `divergent`
- strict finite-ledger relation
- contextual finite-ledger relation

Required distinctions:

- Strict divergence must never be hidden by contextual compatibility.
- Same-class symmetry degeneracy must never be treated as cross-class threshold degeneracy.

## Diagnostic bulk explicitly excluded

The following diagnostic bulk is explicitly excluded from any thin substrate:

- raw sweep rows
- full per-strength tables
- full local-minima lists
- full branch comparison rows
- Hessian/eigenvalue traces
- all alignment margins
- all energy gaps
- finite-ledger body threshold as actual onset
- closed D3/body response
- FieldCue hooks
- rendering hooks
- route/walk/holonomy hooks
- semantic naming hooks
- defect/vortex hooks
- spatial coupling assumptions
- dense sampling assumptions

The future substrate should carry policy and small stable facts, not diagnostic machinery.

## Forbidden interpretations

Explicit negative boundaries:

- No FieldCue claim.
- No semantic meaning claim.
- No route/walk/holonomy claim.
- No defect/vortex claim.
- No spatial dynamics claim.
- No dense sampling claim.
- No rendering claim.
- No closed A3 claim.
- No closed D3/body claim.

Branch theory is local pointwise branch anatomy only. It is not a topological route, field path, walk, or holonomy model.

## Future extraction gate

A later implementation may create a thin module only if this charter is accepted.

Possible future module:

```txt
src/lib/pSimplexReadoutStatusCore.ts
```

That module may include only:

- channel status enums
- readout regime enums
- closure policy map
- forbidden interpretation boundaries
- small stable diagnostic facts

It must not include:

- raw T14-T19 report builders
- full sweep rows
- branch rows
- Hessian traces
- minimizer calls
- new package diagnostics
- UI code

Any future extraction must preserve the difference between diagnostic evidence and substrate policy. A runtime core should not re-run the fat diagnostics to answer readout status questions.

## Research consequences

The project may now proceed with closed axis + provisional A3 while D3 remains quarantined.

D3 can be revisited later through threshold refinement.

Consolidation is allowed even though D3 remains unresolved.

Do not start another fat diagnostic ledger by default.

The recommended next research consequence is to stop expanding diagnostic ledgers unless a new question is explicitly authorized, and instead convert the accepted evidence into either a researcher-facing note or a thin runtime extraction proposal.

## Engineering stop condition

C1 is the stop condition for the T14-T19 diagnostic burst.
After C1, the next step is either:
  1. a researcher-facing readout-substrate note, or
  2. a thin runtime extraction proposal,
not another diagnostic ledger unless a new research question is explicitly authorized.
