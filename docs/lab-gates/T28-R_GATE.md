# T28-R Gate Manifest

REVIEW ONLY. This manifest is a compact reviewer aid for intended branch `review/t28-r-standard-potential-probe`; it does not claim acceptance.

Git workflow note: branch creation, staging, commit, and push were blocked in this sandbox by inability to create `.git/worktrees/PlatonicEngine202_ARF/index.lock`.

## Summary

- Diagnostic: `p-simplex-cuboctahedral-ve-standard-potential-probe-t28r`
- Package script: `diagnose:p-simplex-cuboctahedral-ve-standard-potential-probe-t28r`
- Summary verdict observed: `T28-R-external-standard-potential-probe-verified`
- `ok`: `true`
- `integrityIssueCount`: `0`
- Parent: T28-Q, `accepted-parent`, `T28-Q-ve-s4-residual-visibility-verified`

## Row Counts

- `parentEvidenceRows`: 1
- `probeDefinitionRows`: 1
- `labelPotentialRows`: 5
- `globalReadoutValueRows`: 110
- `probeEquivarianceRows`: 120
- `probeImageRankRows`: 1
- `probeResidualRows`: 60
- `probeResidualFormulaRows`: 240
- `probeKernelRows`: 1
- `probeClassificationRows`: 1
- `boundaryRows`: 21
- `falsifierRows`: 10

## Diagnostics

- `npm.cmd run diagnose:p-simplex-cuboctahedral-ve-standard-potential-probe-t28r`: pass
- `npm.cmd run diagnose:p-simplex-cuboctahedral-ve-s4-residual-visibility-t28q`: pass
- `npm.cmd run diagnose:p-simplex-cuboctahedral-ve-global-readout-admissibility-t28p`: pass
- `npm.cmd run diagnose:p-simplex-cuboctahedral-ve-flag-star-residual-t28o`: pass
- `npm.cmd run diagnose:p-simplex-cuboctahedral-s4-direct-bridge-t28n0`: pass
- `npm.cmd run diagnose:p-simplex-cuboctahedral-vector-equilibrium-portability-t28m`: pass
- `npm.cmd run diagnose:p-simplex-k3-stabilizer-orbit-verification-t28j-lab`: pass
- `npm.cmd run diagnose:ambo`: pass
- `npm.cmd run build`: pass
- `git diff --check`: pass

## Critical Results

- All five label potentials are sum-zero.
- Probe equivariance mismatch counts: `0=120`.
- Image rank from basis potentials: `3`; detected relation `basis-A + basis-B + basis-C + basis-D = 0`.
- Probe residual rows: `probe-residual-formula-pass=60`.
- Probe formula relation rows: `relation-pass=240`.
- Nonzero residual rows: 36 of 60.
- Probe kernel dimension in sum-zero space: `0`.
- Probe classification: `admissible-external-probe`, `not-natural-readout`, `not-project-internal`, `residual-visible-nontrivial-standard-content`.

## Decisive Examples

For `alpha=A->B`, unused labels `[C,D]`:

- `basis-A`: residual `(0, 0, 0, 0)`, expected `(0, 0, 0, 0)`, pass
- `basis-B`: residual `(0, 0, 0, 0)`, expected `(0, 0, 0, 0)`, pass
- `basis-C`: residual `(-2, 2, 4, -2)`, expected `(-2, 2, 4, -2)`, pass
- `basis-D`: residual `(2, -2, -4, 2)`, expected `(2, -2, -4, 2)`, pass
- `generic`: residual `(-1, 1, 2, -1)`, expected `(-1, 1, 2, -1)`, pass

## Boundaries And Falsifiers

- Boundaries enforced: `21/21`
- Missing or unenforced boundaries: none
- Falsifiers triggered: `0/10`
- Triggered falsifier rows: none

## Forbidden-Import Scan

Scan target:

```txt
src/lib/pSimplexCuboctahedralVEStandardPotentialProbeT28R.ts
scripts/diagnose-p-simplex-cuboctahedral-ve-standard-potential-probe-t28r.cjs
```

Result:

- Active import: T28-Q report builder only.
- Restricted vocabulary hits occur only in boundary, falsifier, or classification text.
- No Fano diagnostics were run as support.
