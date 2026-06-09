# PlatonicEngine Source-State Reduction Law Candidates

## 1. Status

This is Gate C.2.

This is not implementation.

This does not authorize FieldCueV0, GeneratedSiteReadingV0, UI, topology, packet writing, operation registration, field atlas replacement, or source-code changes.

This defines candidate source-state-to-tuple reduction laws for later blind recovery diagnostics. No candidate in this document is accepted as proven.

R1 is the minimal smoke-test carrier.

R4 is the architecturally preferred target candidate.

The project must not accidentally lock itself into phase-only recovery merely because it is easier to test.

## 2. Problem

The current Structured Source-State Diagnostic scaffold records source-state structure, but it does not yet make antipodality field-detectable.

The missing piece is a reduction law:

```txt
structured source state
-> emitted field-facing tuple
```

The reduction law must be strong enough that some source-state structure becomes field-active, but honest enough to report what remains metadata-only or lost.

Gate C cannot pass because a report remembers:

```txt
AB<->CD
AC<->BD
AD<->BC
```

Gate C can pass only if the upstream source-state / inheritance / reduction regime makes that structure recoverable from emitted-source behavior or field behavior by a diagnostic that is not handed the stored antipodal labels.

## 3. Requirements For A Valid Reduction Law

A valid candidate must:

```txt
derive emitted parameters from structured source-state components;
identify which state component controls amplitude, waveNumber, phase, and attenuation;
specify whether complement / polarity affects any field-active axis;
produce emitted parameters without reading stored antipodal labels as output targets;
allow a blind detector to attempt recovery from emitted sources or field samples;
compare against uniform bad control and Pythagorean scalar baseline;
report preserved, reduced/compressed, metadata-only, and lost structure;
fail honestly if recovery does not happen.
```

Reject candidates that:

```txt
merely add antipodalChildSiteId;
merely add axisPairId;
merely add pi to a known antipodal child as a patch;
merely display antipodal labels in UI;
merely prove a stored complement lookup table;
create a general algebra engine;
replace the field atlas;
require topology.
```

## 4. Source-State Components

Candidate laws may use these source-state components.

### A. Harmonic Component

```txt
Pythagorean ratio / logRatio;
profile slot;
childRatio / childLogRatio;
baseWaveNumber / wavelength.
```

This component is already the strongest part of the scalar baseline. It can control field-active waveNumber and wavelength without pretending to be the whole source signature.

### B. Structural Component

```txt
oriented edge states AB, AC, AD, BC, BD, CD;
complement / star operation candidate;
sign / polarity convention;
endpoint incidence;
projection vertices;
axis-pair membership.
```

This is the source-state structure Gate C must eventually make field-detectable. It must not remain only a lookup table.

### C. Derivation Component

```txt
Quark channel records;
parent/projection roles;
common-mode harmonic inheritance;
differential structural polarity.
```

This component should explain how generated child states arise before tuple reduction.

### D. Reduction Component

```txt
emitted tuple;
reduction report.
```

The reduction report must say what became field-active, what was compressed, what remained metadata-only, and what was lost.

## 5. Candidate Laws

### Candidate R0 - Metadata-Only Structured State

Definition:

```txt
harmonic component controls waveNumber and phase as in the Pythagorean baseline;
structural component remains metadata-only;
amplitude remains neutral;
attenuation remains neutral.
```

Expected outcome:

```txt
blind recovery should fail or be weak.
```

Purpose:

```txt
negative structured-state control.
```

Status:

```txt
not acceptable as final Gate C success.
```

R0 is useful because it proves that merely creating a structured source-state vessel does not make structure field-active.

### Candidate R1 - Star-Sign Phase Projection

Definition:

```txt
structural star/sign component contributes to emitted phase through a declared reduction map;
harmonic component controls waveNumber and wavelength;
amplitude remains neutral;
attenuation remains neutral.
```

The intended chain is:

```txt
source-state star/sign operation
-> structural phase component
-> emitted phase relation
-> blind recovery attempt
```

Antipodal/star-related states receive a derived phase relation from the source-state operation, not from post-hoc label patching.

Expected emitted-source recovery signal:

```txt
phase relation across star-complement pairs.
```

Risk:

```txt
can become an "add pi" patch if not derived from the operator.
```

Required safeguard:

```txt
phase relation must be computed from source-state star/sign projection;
blind detector must not receive pair labels;
diagnostic must compare against controls;
failure must mark the candidate deficient.
```

Status:

```txt
useful as a minimal ablation / smoke test;
not sufficient as the long-term source-state reduction architecture;
acceptable only if interpreted as the first phase of a staged multi-axis projection;
not acceptable as final Gate C solution by itself.
```

R1 is useful because phase is already field-active in the current scalar tuple and does not require replacing the atlas. It should be treated as the R4-S1 ablation, not as the sovereign reduction law.

### Candidate R2 - Structural Polarity As Signed Amplitude Or Signed Contribution

Definition:

```txt
structural polarity modulates signed source contribution or an amplitude-like factor;
harmonic component may still control waveNumber;
phase may remain harmonic or carry a secondary structural term;
attenuation remains neutral unless separately justified.
```

Expected recovery signal:

```txt
cancellation / reinforcement symmetry.
```

Risk:

```txt
current scalar atlas amplitude may not support negative amplitude safely unless explicitly allowed;
signed contribution semantics may require field atlas semantics changes.
```

Likely status:

```txt
defer unless current atlas can support safely.
```

R2 may be powerful, but it risks becoming an atlas semantics change rather than a diagnostic-only source-state reduction law.

### Candidate R3 - Attenuation / Reach-Locality Structural Projection

Definition:

```txt
complement or incidence structure affects attenuation / reach;
harmonic component controls waveNumber;
phase remains harmonic unless another structural term is justified;
amplitude remains neutral.
```

Expected recovery signal:

```txt
paired influence envelopes;
complementary reach patterns;
field samples with recoverable reach symmetry.
```

Risk:

```txt
may be arbitrary;
may be weakly tied to antipodality;
may encode geometry-local reach rather than source-state complementarity.
```

Likely status:

```txt
lower priority.
```

R3 is less direct than R1 because attenuation can easily become a visual or range-tuning knob rather than a principled projection of star/complement structure.

### Candidate R4-S - Staged Multi-Axis Source-State Projection

Definition:

```txt
harmonic component controls waveNumber / wavelength;
structural star/sign/polarity controls phase;
incidence / projection relation may control attenuation only in a later stage;
amplitude remains neutral unless a state-norm law is explicitly justified.
```

R4-S is the architecturally preferred target law.

Why it is cleaner:

```txt
it treats the tuple as a real reduction of multiple source-state components;
it avoids compressing all structure into phase alone;
it keeps future structural features from requiring one-off patches;
it aligns better with "source signature = structured source state; emitted tuple = reduction."
```

Expected recovery signal:

```txt
staged recovery signal, beginning with phase and later testing reach or state-norm effects only if justified.
```

Risk:

```txt
too many axes can become overfit;
recovery may be tuned into existence;
attribution becomes unclear if all axes change at once.
```

Safeguard:

```txt
staged ablation discipline;
no free weights;
no per-child fitting;
no use of stored antipodal labels by the detector;
each added axis must improve blind recovery over the previous stage;
if an added axis does not improve recovery, it remains metadata-only.
```

R4-S should not be implemented all at once. It should be tested as a staged family.

#### R4-S0 - Metadata-Only Structured State

Definition:

```txt
metadata-only structured state;
harmonic scalar behavior remains equivalent to the negative control;
structural component remains metadata-only.
```

Status:

```txt
equivalent to negative control.
```

#### R4-S1 - Harmonic WaveNumber + Star/Sign Phase

Definition:

```txt
harmonic -> waveNumber;
star/sign structural polarity -> phase;
amplitude neutral;
attenuation neutral.
```

Status:

```txt
recommended first blind emitted-source recovery test.
```

R4-S1 is operationally as narrow as R1, but conceptually belongs to the broader R4 architecture.

#### R4-S2 - Incidence/Projection Attenuation Stage

Definition:

```txt
R4-S1 plus incidence/projection -> attenuation.
```

Condition:

```txt
only if an explicit non-arbitrary incidence law is declared.
```

If this stage does not improve blind recovery over R4-S1, incidence/projection remains metadata-only.

#### R4-S3 - State-Norm Amplitude Stage

Definition:

```txt
R4-S2 plus amplitude/state-norm law.
```

Condition:

```txt
only if a state-norm law is explicitly justified.
```

If this stage does not improve blind recovery over R4-S2, state norm remains metadata-only.

## 6. Recommended First Test Candidate

Recommended first implementation candidate for Gate C.3:

```txt
R4-S1 - first staged multi-axis projection test
```

R4-S1 is operationally as narrow as R1 because it changes only one already field-active scalar axis:

```txt
phase
```

It is conceptually cleaner because it belongs to the broader R4-S architecture:

```txt
harmonic -> waveNumber;
star/sign structural polarity -> phase;
amplitude neutral;
attenuation neutral.
```

This preserves the clean long-term reduction architecture while still allowing a narrow first blind recovery test.

R1 should be treated as the R4-S1 ablation, not as the final law.

R4-S1 is field-active because phase is consumed by the existing field-facing tuple and can affect emitted-source and field behavior without replacing the atlas.

It is testable because a blind emitted-source detector can examine source positions and emitted tuple values, especially phase relations, without reading stored complement labels.

The implementation prompt must phrase R4-S1 as:

```txt
source-state star/sign operation
-> structural phase component
-> emitted phase relation
-> blind recovery attempt
```

It must not phrase R1 as:

```txt
if edge is antipodal, add pi
```

Failure conditions:

```txt
blind detector cannot recover or strongly infer AB<->CD, AC<->BD, AD<->BC;
recovery is no better than uniform bad control;
recovery is no better than Pythagorean scalar baseline;
detector relies on labels, complement lookup, axisPairId, or antipodalChildSiteId;
phase relation is discovered to be a post-hoc pair patch rather than a projection of source-state star/sign structure.
```

FieldCueV0 remains blocked because R4-S1 is only the first staged candidate until blind recovery and control comparison pass. A passing R4-S1 does not prove that the full source-state reduction architecture is complete.

## 7. Blind Recovery Implications

Allowed detector inputs:

```txt
source positions;
source IDs only if IDs do not encode the answer;
anonymized sources;
emitted tuple values;
field samples if later Gate C.4.
```

Forbidden detector inputs:

```txt
complement lookup table;
antipodalChildSiteId;
axisPairId;
source-state metadata that already says AB<->CD;
child labels if the detector can trivially parse AB/CD from them.
```

If child IDs encode edge names, the recovery diagnostic must either anonymize IDs or prove it does not use ID spelling.

For R0, a blind detector should receive emitted tuple values equivalent to the scaffold's metadata-only reduction and should fail or produce weak recovery.

For R1/R4-S1, a blind detector should receive source positions plus emitted tuple values whose phase component includes the star/sign projection.

For R2, a blind detector would need safe signed contribution or amplitude semantics. If the current atlas cannot support that safely, R2 should not be implemented.

For R3, a blind detector would compare reach or attenuation envelopes. It must separate structural reach from geometry-only distance effects.

For R4-S0, a blind detector should fail or produce weak recovery because structural facts remain metadata-only.

For R4-S1, a blind detector should test whether star/sign polarity made phase behavior sufficient to recover or strongly infer antipodal axes.

For R4-S2, a blind detector must show that incidence/projection attenuation improves recovery over R4-S1 before attenuation is treated as field-active source-state structure.

For R4-S3, a blind detector must show that a justified state-norm amplitude law improves recovery over R4-S2 before amplitude is treated as field-active source-state structure.

## 8. Control Expectations

Uniform bad control:

```txt
should fail or produce ambiguous recovery.
```

Pythagorean scalar baseline:

```txt
may show weak scalar ordering;
should not reliably recover all antipodal axes unless position geometry leaks the answer.
```

Structured source-state candidate:

```txt
must outperform both controls.
```

If geometry alone recovers antipodal axes, the diagnostic must distinguish:

```txt
geometry-only recovery
source-regime recovery
field-behavior recovery
```

Geometry-only recovery is not enough. Gate C requires the source-state inheritance/reduction regime to make structure field-active or field-detectable.

## 9. Gate C.3 Implementation Requirements

Next implementation branch:

```txt
Gate C.3 - Blind Emitted-Source Recovery Diagnostic
```

It should:

```txt
implement R0 metadata-only control;
compare the Pythagorean scalar baseline;
implement R4-S1 structured candidate;
optionally keep R1 as a naming alias for R4-S1, but do not make R1 the sovereign branch;
anonymize or mask child labels;
compare uniform bad control, Pythagorean scalar baseline, and structured candidate;
recover axes from emitted tuple / position behavior without stored labels;
report confidence, false positives, and failure cases;
not touch FieldCueV0;
not touch GeneratedSiteReadingV0;
not touch UI.
```

It must not:

```txt
import stored antipodal labels into the detector;
use axisPairId as detector input;
parse child IDs such as M_AB to recover edge pairs;
register operations;
write packets;
touch topology;
replace the field atlas;
build a general algebra engine;
claim Gate C success without control comparison.
```

## 10. Anti-Lock-In Rule

The project must not adopt a phase-only law merely because it passes the first blind recovery test.

A passing R4-S1 proves only that star/sign polarity can become field-active through phase. It does not prove that the full source-state reduction problem is solved.

Later stages must remain governed by staged ablation discipline:

```txt
no free weights;
no per-child fitting;
no detector access to stored antipodal labels;
each added axis must improve blind recovery over the previous stage;
failed axes remain metadata-only.
```

## 11. Compact Acceptance Language

A reduction law candidate is not accepted because it is mathematically pretty.

It is accepted only if it makes source-state structure field-active enough for blind recovery to outperform scalar controls.
