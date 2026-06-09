# PlatonicEngine Gate C.4L-D2 Multi-Projection Source-State Design

## 1. Status

This is the Gate C.4L-D2 multi-projection source-state design memo.

It is not:

- a Codex prompt;
- a backlog;
- an implementation branch;
- a new reduction law;
- a Gate C pass;
- a FieldCueV0 promotion;
- a GeneratedSiteReadingV0 promotion;
- a fieldAtlas replacement.

This memo interprets the Gate C.4L-D1 candidate comparison result and defines
the next law-design direction. It does not adopt C4L-S1 as the law.

## 2. Purpose

This memo locks the meaning of the C.4L-D1 result so later work does not
overread it.

The purpose is to define:

- structural / propagation split;
- multi-projection source-state reduction;
- structural comparison basis;
- relation visibility statuses;
- what the next diagnostic must prove.

C.4L-D1 supports the structural / propagation split as the next law-design
direction. It does not pass Gate C, adopt a final law, or unblock downstream
witnesses.

## 3. Authority Context

The binding project laws remain:

- event legibility before field expansion;
- source signature = structured source state;
- emitted tuple = field-facing reduction;
- field-cue is the field witness inside generated-site reading;
- generated site remains the center;
- FieldCueV0 remains blocked until Gate C is resolved.

The field layer is derived. It cannot promote itself by diagnostic success
alone. Generated-site reading remains the centered interpretive object, and
the human remains the naming authority.

## 4. C.4L-D1 Result Summary

C.4L-D1 reported:

- `diagnosticIntegrityStatus = pass`;
- R4-S1 baseline failed raw field behavior and recovered 1/3 truth pairs;
- C4L-O1 orbit-common carrier was ambiguous and recovered 0/3 truth pairs;
- C4L-S1 structural / propagation split passed under the
  `known-propagation-dephased-structural-channel` basis;
- C4L-S1 recovered 3/3 truth pairs with 0 false positives and ambiguity 1;
- `candidateComparisonStatus =
  structural-propagation-split-supported-for-next-design`;
- `strongestCandidateLawId =
  c4l-s1-structural-propagation-split-v0`;
- `strongestCandidateBasis =
  known-propagation-dephased-structural-channel`;
- `recommendedNextGate = Gate C.4L-D2`;
- FieldCueV0 stayed blocked;
- GeneratedSiteReadingV0 stayed blocked;
- Gate C.5 was not authorized;
- reduction-law adoption status remained `not-adopted`.

This is a diagnostic comparison result. It is not law adoption.

## 5. What C.4L-D1 Actually Showed

C.4L-D1 showed that when structural phase is not swallowed by ordinary
propagation, the antipodal relation is recoverable under a declared basis.

It did not show that raw propagated field behavior sees antipodality.

It did not show that subtracting `k * d` is the new method.

It showed that source-state structure requires its own projection and
comparison basis.

The structural relation is recoverable under a declared comparison basis;
therefore the next field-cue design should include a structural comparison
channel.

## 6. Multi-Projection Source-State Reduction

A structured source state should not be reduced to one scalar tuple pretending
to carry everything.

A source state may project into several witnesses:

- propagation witness:
  ordinary field contribution, carrier behavior, `k * distance`, attenuation,
  and interference;
- structural witness:
  complement, antipode, incidence, edge-state, polarity, star-sign, and
  source-state relations;
- harmonic witness:
  ratio, note, wavelength, and spectral identity;
- derivation witness:
  Quark channels, parent / projection paths, source-edge and complement-edge
  production;
- cue witness:
  what becomes relevant for generated-site reading.

For the current design path, only the first two are authorized for immediate
diagnostic design:

- propagation projection;
- structural projection.

The other witnesses remain part of the source-state horizon, not current
implementation permission.

## 7. Projection Frames

Source frame:

- the structured source state before field-facing reduction.

Propagation frame:

- the ordinary field atlas frame where wave contributions propagate as
  `k * distance + phase`.

Structural comparison frame:

- the declared basis in which source-state structural relations are compared,
  recovered, or marked lost.

Field-cue witness frame:

- the eventual generated-site-facing account that tells the human what is
  raw-visible, recoverable, lost, or misleading.

De-propagation is only one way to compare a propagated contribution back to a
structural comparison frame. It is not the whole method.

## 8. Propagation Projection

The propagation projection carries ordinary wave behavior:

- amplitude;
- carrier waveNumber;
- carrier phase if justified;
- attenuation;
- raw propagated interference.

It is what the current field atlas naturally consumes.

The propagation projection should not be forced to carry every structural
invariant. If a structural relation becomes distorted in the propagation
frame, that does not mean the relation is false. It means the projection has
changed what is visible.

## 9. Structural Projection

The structural projection carries source-state relational facts:

- edge state;
- complement edge;
- antipodal relation;
- polarity / star-sign;
- incidence;
- projection-source relation;
- source-state involution.

It must not be reduced to metadata tags.

At minimum it should support operations such as:

```txt
complement operation:
  c(AB) = CD
  c(AC) = BD
  c(AD) = BC

source-state involution:
  sigma(state_AB) = state_CD

structural comparison:
  compareStructural(state_AB, state_CD) = antipodal-opposition

recovery / comparison basis:
  factor, transport, or otherwise compare the structural component without
  mistaking raw propagated carrier phase for structural relation
```

The structural channel must be operational. It must define how relations are
compared, transported, recovered, or declared lost.

## 10. Why R4-S1 Failed

R4-S1 put structural polarity into ordinary propagated phase.

The field atlas propagates source phase as:

```txt
angle = waveNumber * distance + phase
```

That makes structural opposition mix with carrier scale and probe geometry.
Different waveNumbers, unequal probe distances, or both can deform the
source-level relation before raw field behavior is inspected.

So R4-S1 made a structural relation ride inside a channel whose meaning is
transformed by propagation.

This is why R4-S1 remains emitted-tuple success only, not field-behavior law.

## 11. Why De-Propagation Is Not Enough As A Method

C4L-S1 de-propagation was diagnostically useful. It showed that the structural
relation can be recovered when carrier propagation is factored out.

But the project must not become:

```txt
raw field hides structure, so subtract k*d afterward
```

The better formulation is:

```txt
Propagation is one transport of the source state.
Structural relation has its own basis.
De-propagation is only one recovery / comparison technique for relating the
propagated contribution back to that basis.
```

The next law must not merely add an after-the-fact correction. It must define
which source-state projection is being inspected and what kind of visibility
is being claimed.

## 12. Relation Visibility Statuses

Future diagnostics and field-cues should distinguish relation visibility with
explicit statuses.

Minimum statuses:

- `raw-field-visible`:
  relation is visible in raw propagated field behavior;
- `propagation-transformed`:
  relation is present but changed by propagation;
- `depropagation-recoverable`:
  relation is recoverable when the declared carrier / recovery basis is
  applied;
- `structural-channel-visible`:
  relation is visible in the structural projection;
- `source-state-only`:
  relation exists in source state but has no field-facing witness yet;
- `tuple-projection-lost`:
  relation is lost by scalar tuple projection;
- `misleading-if-read-as-raw-field`:
  raw field behavior suggests a relation that should not be treated as
  structural truth;
- `unsupported`:
  relation is not established.

For the current C.4L-D1 result, antipodality is classified as:

```txt
antipodal relation:
  depropagation-recoverable;
  structural-channel-visible under declared basis;
  raw-field-visible not proven;
  not enough to unblock FieldCueV0.
```

These statuses protect the project from treating every recovered relation as
raw field truth.

## 13. Structural Channel Is Not Metadata

Bad repair:

```txt
child.antipodalPair = AB/CD
child.polarity = +
```

Better repair:

```txt
child.sourceState carries a structural component;
complement acts inside that state;
structural comparison is an operation;
recovery basis explains how structural relation is compared after propagation.
```

The structural channel must have operations, not just labels.

Metadata may record facts. A structural channel must support comparison,
transport, recovery, and loss reporting under declared rules.

## 14. What C.4L-D3 Must Prove

The next branch is:

```txt
Gate C.4L-D3 - Multi-Projection Structural-Channel Diagnostic
```

The next diagnostic must answer:

1. Does every generated child have a structured source state?

2. Does every child have a propagation projection:
   amplitude, carrier waveNumber, carrier phase, attenuation?

3. Does every child have a structural projection:
   edge state, complement edge, antipodal relation, polarity / star relation?

4. Does raw field computation use propagation projection only?

5. Does structural comparison use a declared comparison / recovery basis, not
   raw propagated phase?

6. Can the report classify each relation as:
   raw-field-visible / propagation-transformed /
   depropagation-recoverable / structural-channel-visible /
   source-state-only / tuple-projection-lost /
   misleading-if-read-as-raw-field / unsupported?

7. Does antipodality recover 3/3 only under the declared structural basis,
   without claiming raw field unblocking?

8. Does FieldCueV0 remain blocked unless generated-site readings can use the
   split honestly?

## 15. C.4L-D3 Acceptance Discipline

C.4L-D3 must:

- compare C4L-S2 or equivalent explicit structural-channel candidate against
  R4-S1, C4L-O1, and controls;
- make propagation projection and structural projection explicit in the
  report;
- preserve detector blindness to hidden truth where appropriate;
- distinguish raw propagated field behavior from structural-channel recovery;
- report relation visibility statuses;
- preserve tuple-reduction honesty;
- keep FieldCueV0 blocked;
- keep GeneratedSiteReadingV0 blocked;
- not mutate fieldAtlas;
- not adopt the law;
- not pass Gate C by diagnostic integrity alone.

A passing structural-channel diagnostic may justify further law design. It is
not, by itself, downstream witness authority.

## 16. Forbidden Interpretations

The following remain forbidden:

- "C4L-S1 passed, so Gate C passed."
- "De-propagation equals raw field-behavior success."
- "Structural channel is just metadata."
- "FieldCueV0 is now trusted."
- "GeneratedSiteReadingV0 is now trusted."
- "We can replace fieldAtlas."
- "We can now implement topology."
- "We can write packets."
- "We can auto-name generated sites."
- "We can treat structural channel as semantic truth."

The structural channel may help a future field-cue speak honestly. It is not
semantic naming, topology, packet truth, or Gate C completion.

## 17. Compact Binding Statement

C.4L-D1 showed that structure survives when it is not mistaken for
propagation.

C.4L-D2 names the lesson as multi-projection source-state reduction.

The next law must give structural relation its own field-facing witness.

Until that witness is tested, FieldCueV0 remains blocked.
