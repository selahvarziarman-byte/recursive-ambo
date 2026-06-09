# PlatonicEngine Gate C Acceptance Criterion

## 1. Status

This is a governance correction.

This is not a Codex implementation prompt.

This is not a backlog.

This does not authorize FieldCueV0 work, GeneratedSiteReadingV0 work, UI work, topology, packet writing, operation registration, or source-state implementation changes.

This corrects the meaning of Gate C after the first Structured Source-State Diagnostic scaffold.

## 2. Why this correction exists

The first Structured Source-State Diagnostic created a finite vessel for the one-Ambo tetrahedron proving event. It records primal source states, generated edge child states, complement axes, tuple reductions, and audit scaffolding.

That is useful. It is not enough.

The scaffold does not yet prove field-detectable antipodality. Recording that `AB` complements `CD`, `AC` complements `BD`, and `AD` complements `BC` is not the same as making complementarity emerge from the source-state regime.

A pass over stored relations proves internal consistency only. It says the diagnostic remembered the expected antipodal labels. It does not yet prove that the upstream source-state, inheritance, or tuple-reduction law makes those relations field-active or field-detectable.

## 3. Corrected Gate C Acceptance Criterion

Gate C passes only when all of the following are true:

```txt
structured child states exist;
complement / antipodal structure acts inside the upstream source-state / inheritance / reduction regime;
emitted field-facing parameters are derived from that regime;
a blind recovery diagnostic, not given stored antipodal pairs, can recover or strongly infer the three antipodal axes;
recovery is stronger than uniform bad control and Pythagorean scalar baseline;
reduction honesty reports which structures are field-active, metadata-only, compressed, or lost;
if recovery fails, the regime is marked deficient, not accepted.
```

The active law remains:

```txt
source signature = structured source state
emitted tuple = field-facing reduction
```

The emitted tuple is not the whole source signature.

## 4. What Does Not Count

The following do not satisfy Gate C:

```txt
stored complement lookup table alone;
labels such as antipodalChildSiteId alone;
UI display of antipodal pairs;
after-the-fact metadata;
adding pi to antipodal children as a patch;
a formal operator that is not projected into field-active reduction;
scalar tuple differentiation alone;
self-consistency of report objects alone.
```

The source-state regime must do more than remember known labels. It must make structural relations act through inheritance and reduction in a way that a detector can recover without being handed the answer.

## 5. Required Emergence Diagnostics

Future Gate C work must define and pass emergence diagnostics.

### A. Blind Emitted-Source Recovery Diagnostic

Input:

```txt
emitted source parameters
source positions
```

Forbidden input:

```txt
stored antipodal labels
stored complement lookup tables
axis-pair ids
```

Output:

```txt
inferred axes or failure
```

Success:

```txt
recover AB<->CD, AC<->BD, AD<->BC
or strongly infer those axes with explicit confidence and caveats
```

Failure must be reported as failure, not hidden behind retained metadata.

### B. Blind Field-Behavior Recovery Diagnostic

Input:

```txt
field samples
contribution behavior
phase behavior
source positions
emitted source behavior
```

Forbidden input:

```txt
stored antipodal labels
stored complement lookup tables
axis-pair ids
```

Output:

```txt
inferred axes or failure
```

Success:

```txt
the structured regime outperforms controls in recovering or strongly inferring the three antipodal axes
```

### C. Control Comparison

Every emergence diagnostic must compare:

```txt
uniform-circle bad control;
Pythagorean scalar baseline;
structured source-state candidate.
```

The uniform bad control should show why scalar invariance and phase cancellation can hide structure.

The Pythagorean scalar baseline should show how finite harmonic differentiation improves scalar provenance but does not by itself prove structured source-state emergence.

The structured source-state candidate must show that complement / antipodal relations become recoverable through emitted-source or field behavior, not merely retained as labels.

## 6. Revised Gate Ladder

The corrected ladder is:

```txt
Gate C.0 - source-state scaffold exists
Gate C.1 - corrected acceptance criterion committed
Gate C.2 - source-state reduction law candidates
Gate C.3 - blind emitted-source recovery diagnostic
Gate C.4 - blind field-behavior recovery diagnostic
Gate C.5 - control comparison
Gate C.6 - Gate C decision
```

Only after Gate C.6 may the project proceed to:

```txt
Gate D - FieldCueV0 consumes accepted structured source-state regime
```

## 7. Current Status of Existing Structured Source-State Diagnostic v0

The existing Structured Source-State Diagnostic v0 is classified as:

```txt
accepted as scaffold;
not accepted as full Gate C;
not allowed to unlock FieldCueV0;
not allowed to unlock GeneratedSiteReadingV0;
not allowed to unlock UI.
```

It is a vessel. It is not yet proof that antipodal structure emerges from source-state inheritance or field-facing reduction.

## 8. Planner Rule

No future branch may be accepted because it records antipodality.

A future branch must show that antipodality is generated by the source-state regime and recoverable from emitted-source or field behavior without passing the answer to the detector.

If a diagnostic knows the antipodal pair because it reads `antipodalChildSiteId`, `axisPairId`, or a complement lookup table, it is not a blind recovery diagnostic.

## 9. Forbidden Next Moves

Forbidden next moves:

```txt
Gate D FieldCueV0 integration;
GeneratedSiteReadingV0 integration;
UI polish;
topology;
packet writing;
automatic naming;
general algebra engine;
general harmonic universe;
treating Gate C.0 as Gate C pass.
```

The next valid work must stay inside the corrected Gate C ladder.

## 10. Compact Statement

The algebraic solution is not decorative recovery of known antipodal labels. It is accepted only if it changes upstream source-state inheritance/reduction so that antipodal structure can later emerge in the field.
