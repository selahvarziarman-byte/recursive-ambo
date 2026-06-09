# PlatonicEngine Gate C.4L Reduction-Law Decision

## 1. Status

This is the Gate C.4L reduction-law decision / revision-design memo.

It is not:

- a Codex prompt;
- a backlog;
- an implementation branch;
- a new reduction law;
- an R4-S2 implementation;
- a FieldCueV0 promotion;
- a GeneratedSiteReadingV0 promotion;
- a fieldAtlas replacement.

This memo decides what kind of source-state-to-field reduction-law revision is
justified after Gate C.4 and Gate C.4D. It does not implement that revision.

## 2. Purpose

C.4L exists because the current Gate C sequence has separated three facts:

- R4-S1 succeeded at emitted-tuple recovery;
- R4-S1 failed raw field-behavior recovery;
- C.4D found ambiguous local residue but no recoverable residual regime.

The project must now decide what kind of reduction law should be designed
next. The decision cannot be made by treating C.3 success as sufficient, by
polishing R4-S1 thresholds, or by implementing R4-S2 before the failure has
been understood.

C.4D found residue, not recovery. A residue can guide revision. It cannot
carry FieldCueV0. The next task is to decide what kind of reduction law can
survive propagation.

## 3. Authority Context

The binding project laws remain:

- event legibility before field expansion;
- source signature = structured source state;
- emitted tuple = field-facing reduction;
- field-cue is the field's witness inside generated-site reading;
- generated site remains the center;
- FieldCueV0 remains blocked until Gate C is resolved.

The field layer is not sovereign. It is useful only insofar as it helps the
human read the one-Ambo tetrahedron proving event without false maturity.

Generated-site reading remains the centered interpretive object. FieldCueV0 is
one witness inside that reading, not an autonomous claim of source-law
success.

## 4. Diagnosis Of R4-S1

R4-S1 sends:

- harmonic component -> waveNumber / wavelength;
- structural polarity / star-sign component -> phase;
- amplitude -> neutral;
- attenuation -> neutral.

It works at the emitted-source level because the emitted tuple can encode the
antipodal relation through phase. At that level, the detector can recover the
three generated antipodal pairs from the tuple-facing reduction.

It fails at the field-behavior level because structural phase is propagated as
ordinary scalar wave phase. The current field sampler uses the form:

```txt
angle = source.waveNumber * distance + source.phase
```

Thus source-level structural opposition is mixed with distance-dependent and
waveNumber-dependent propagation. If two sources have different waveNumbers or
unequal distances to a probe, the original structural opposition is deformed:

```txt
phase_j(sample) - phase_i(sample)
  = structural_phase_difference
  + k_j * d_j(sample)
  - k_i * d_i(sample)
```

For an antipodal pair, the structural phase difference may begin as opposition.
But after propagation, that opposition is no longer protected from carrier
scale and probe geometry.

The failure is therefore not merely numerical. R4-S1 puts structural polarity
into a channel whose meaning is transformed by propagation.

## 5. C.4D Decision

C.4D found local residue without regime-level recovery.

The interpretation is:

- R4-S1 is not completely inert;
- R4-S1 is not recoverable enough to carry FieldCueV0;
- R4-S1 should be demoted to emitted-tuple-success only;
- R4-S1 should not be treated as a field-behavior law;
- further C.4D variants are not authorized unless a specific methodological
  flaw is identified.

One truth pair showing meaningful residual matters. It means there is a local
trace worth learning from. But 1/3 recovery with two false positives is not a
recoverable field regime.

The decision is not to discard structured source-state work. The decision is
to stop pretending that R4-S1 has already made structured source-state facts
survive propagation.

## 6. Reduction-Law Design Problem

The real design problem is this:

The project must decide how structured source-state facts become field-active
without being destroyed by propagation.

The problem is not:

```txt
find better numbers
```

The problem is:

```txt
choose which state component belongs to which field-facing channel,
and what detector / acceptance criterion is appropriate for that channel.
```

A reduction law must say what it preserves, what it compresses, what remains
metadata-only, and what is lost. It must also say whether the detector is
trying to recover emitted tuple structure, propagated field behavior,
de-propagated relational structure, reach / locality evidence, or some other
declared recovery basis.

## 7. Candidate Family Evaluation

### A. R4-S1 Polish / Threshold Tuning

Decision: reject.

C.4 and C.4D show the failure is structural, not a threshold problem. The
candidate can encode antipodality before propagation, then fail after
propagation. Lowering a threshold or adjusting a scoring margin would not
answer why structural opposition was deformed by `k * d + phase`.

### B. Immediate R4-S2 Incidence / Attenuation Patch

Decision: not primary / not immediately authorized.

Attenuation may encode reach or locality later. It may become important for
FieldCue locality and for distinguishing where a child-source participates in
the field-world.

But the current R4-S1 failure is specifically about structural opposition
being deformed as propagated phase. Incidence / attenuation should not be the
first repair unless the acceptance detector is redesigned around reach /
locality evidence.

R4-S2 is therefore not authorized as immediate implementation.

### C. Orbit-Common WaveNumber / Propagation-Scale Normalization

Decision: promising as a bounded next diagnostic family.

C.4 suggests that harmonic differentiation through waveNumber may be fighting
structural phase opposition. A candidate where complement / antipodal
orbit-pairs share a propagation carrier can test whether waveNumber
differentiation caused the failure.

This must not erase harmonic difference. Harmonic difference must be preserved
elsewhere, either as metadata, as a non-propagation channel for the diagnostic,
or as a later field-facing component once the reduction boundary is redesigned.

This family is useful as a bounded control because it asks a precise question:
does carrier mismatch explain the deformation?

### D. Separating Structural Phase From Propagation Phase

Decision: strongest conceptual family.

Structural polarity should not simply be injected as ordinary carrier phase if
ordinary carrier phase is transformed by propagation. The next design should
test whether the structural component can remain field-active as a relational
or de-propagated signature rather than being swallowed by `k * d + phase`.

This family directly addresses the failure mechanism. It does not assume that
the existing scalar tuple is sufficient. It asks whether the structural part of
the source state needs a distinct recovery basis from the propagated carrier.

### E. Multi-Axis Tuple Reduction

Decision: potentially necessary but dangerous as first move.

Amplitude, waveNumber, phase, and attenuation might each carry different
source-state components. But without a governing law this becomes tuning.

Use this only after the structural / propagation split is specified. Otherwise
the tuple becomes a knob field rather than an honest reduction of structured
source state.

### F. Revising The Scalar Tuple Boundary

Decision: keep as serious possibility, not immediate implementation.

If no scalar tuple can honestly carry structured source-state through the
current field atlas, the project may need a multi-component field-facing
source signature later.

That possibility is serious. It is not authorized yet. The next diagnostic
should test the strongest bounded scalar-adjacent families before declaring
the scalar tuple boundary exhausted.

### G. Retain R4-S1 As Emitted-Tuple-Only Success

Decision: accepted.

R4-S1 remains valuable because it proves that structured state can be encoded
before propagation. It is a real emitted-tuple success.

It is not field-behavior success.

R4-S1 should remain the baseline candidate in the next comparison diagnostic,
but it must not be promoted into trusted downstream field witness authority.

## 8. C.4L Decision

C.4L makes this decision:

- R4-S1 is demoted to emitted-tuple success, not field-behavior law.
- Do not implement R4-S2 immediately.
- The next authorized implementation should be a diagnostic-only
  candidate-law comparison branch.
- That branch should test a structural / propagation separation family.
- The first diagnostic should include an orbit-common waveNumber /
  carrier-normalization candidate as a bounded control.
- The first diagnostic should also define how structural phase is treated
  separately from propagation phase, at least as a candidate design.
- The diagnostic must keep FieldCueV0 and GeneratedSiteReadingV0 blocked.

This decision preserves the value of R4-S1 without letting it carry authority
it has not earned.

## 9. Next Branch

The next implementation branch is:

```txt
Gate C.4L-D1 - Candidate Reduction-Law Comparison Diagnostic
```

Purpose:

```txt
Compare candidate revised reduction laws without mutating the field atlas or
promoting FieldCueV0.
```

Suggested candidates for C.4L-D1:

- R4-S1 baseline: current harmonic waveNumber + structural phase.
- C4L-O1 orbit-common carrier candidate: complement / axis-pair or
  orbit-common waveNumber; harmonic variation retained in metadata or a
  non-propagation channel for the diagnostic.
- C4L-S1 structural / propagation split candidate: structural phase treated as
  a distinct relational component, not merely ordinary propagated
  `source.phase`.
- Optionally R0 / Pythagorean controls as existing controls.

This memo authorizes design of the diagnostic. It does not over-specify code,
and it does not implement the diagnostic.

## 10. Acceptance Criteria For The Next Diagnostic

The next diagnostic must:

- compare R4-S1 against new candidates and existing controls;
- preserve hidden-truth blindness in detector inputs;
- not expose source positions or probe positions unless the diagnostic
  explicitly declares a new recovery basis that uses a known propagation law;
- distinguish diagnostic integrity from candidate success;
- keep FieldCueV0 blocked;
- keep GeneratedSiteReadingV0 blocked;
- not mutate fieldAtlas;
- not mutate fieldAtlas source policies;
- not mutate Shape;
- not write packets;
- not edit operation registry.

The diagnostic may only claim candidate success under its declared recovery
basis. It must not allow a passing integrity check to masquerade as Gate C
success.

## 11. What Is Still Forbidden

The following remain forbidden:

- FieldCueV0 promotion;
- GeneratedSiteReadingV0 promotion;
- R4-S2 implementation;
- fieldAtlas replacement;
- topology;
- packet writing;
- UI expansion;
- route / gate / support / region expansion;
- general algebra engine;
- harmonic universe.

The project is not reducing its ambition. It is refusing to let an unproven
reduction law become the ground beneath downstream witnesses.

## 12. Compact Binding Statement

R4-S1 taught the project that structure can enter the emitted tuple.

C.4 and C.4D taught that this is not enough.

The next law must decide how structure survives propagation.

Until that is tested, FieldCueV0 remains blocked.
