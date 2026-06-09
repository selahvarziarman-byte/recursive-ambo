# PlatonicEngine Tuple/Signature Conflation Audit

Status: Gate B read-only audit.

Parent gate: Gate A - Governance state recovered.

This document is an audit map only. It is not a repair plan, not implementation permission, not a Codex prompt, and not a backlog. No source code, scripts, package metadata, UI, registry, packet, topology, or structured source-state implementation was changed for this audit.

## 1. Executive summary

Gate B is an audit, not repair.

No implementation was changed.

The current repo does contain tuple/signature conflation risk. The risk is not surprising: the current source-profile and field-atlas substrate was built around scalar emission parameters, and the Pythagorean proving branch improved that scalar regime before the later structured source-state amendment made the new law explicit.

Current repo state should be read as:

```txt
existing scalar tuple pipeline:
  useful legacy/control/provisional substrate

structured source-state law:
  active source-signature law

Gate B result:
  tuple/signature conflation risk confirmed
  no repair performed
```

Highest-risk pattern:

```txt
FieldSourceEmissionParameters
-> derivedParameters / derivedTuple
-> ProfileAwareSourceEntry.emissionParameters
-> ProfileAwareAtlasSourceEntry extends FieldSourceEmissionParameters
-> FieldCueV0.emittedSourceSignature
-> GeneratedSiteReadingV0.sourceSignatureStatus
-> Gate 1 / Gate 2 pass and legibility preview
```

The Pythagorean work remains valuable as a finite harmonic scalar baseline and diagnostic control. It is demoted only because scalar tuple differentiation is not structured source-state truth.

## 2. Active law

Active law:

```txt
source signature = structured source state
emitted tuple = field-facing reduction
```

The emitted tuple is not the whole source signature.

Tuple reduction must report:

```txt
preserved structure
reduced or compressed structure
metadata-only structure
lost structure
```

A tuple that does not say what it preserved, compressed, left metadata-only, or lost is not sufficient source-signature truth for final FieldCueV0 or GeneratedSiteReadingV0 trust.

## 3. Audit table

Risk definitions:

```txt
none:
  no tuple/signature issue relevant to source-state law

low:
  scalar tuple is used correctly as field-facing emission only

medium:
  scalar tuple is necessary but language or report structure may overstate it

high:
  scalar tuple is treated as source truth, source signature, field-ready source identity,
  or downstream legibility without reduction-loss report
```

| File path | Relevant symbols/types/functions | Risk | Observed tuple/signature pattern | Why it matters | Acceptable now? | Gate C repair or supersession |
|---|---|---:|---|---|---|---|
| `src/lib/fieldSourceProfiles.ts` | `FieldSourceEmissionParameters`, `FieldSourceProfile extends FieldSourceEmissionParameters`, `AssignedPrimalEmissionSource extends FieldSourceEmissionParameters`, `generateFieldSourceProfiles`, `sameEmissionParameters` | high | A source profile and assigned primal source are structurally the four scalar emission parameters plus IDs/provenance. | This is where the tuple is defined and first becomes source/profile identity. Under active law, source signature must be larger than this tuple. | Acceptable as legacy scalar substrate and uniform bad-control support. | Add structured source-state types and keep scalar tuple only as reduction output. Profiles should no longer imply full source signature. |
| `src/lib/fieldSourceQuarkChannels.ts` | `QuarkChannelParameters`, `QuarkChannelRecord.channelParameters`, `buildQuarkChannelRecord`, `buildTetrahedralQuarkChannelReport` | medium | Quark channels preserve parent/projection records, but each channel output is scalar `channelParameters`. | Channel records retain useful grammar, but the active value propagated downstream is still scalar. | Acceptable as legacy/control derivation support. | Structured Quark records must derive state components first, then reduce to a channel tuple with reduction honesty. |
| `src/lib/fieldSourceChildDerivations.ts` | `FieldChildSourceProfileDerivation.derivedParameters`, `mergeFourQuarkChannelParameters`, `buildTetrahedralChildSourceProfileDerivationReport` | high | Four channel scalar parameters are merged into `derivedParameters`; derivation success and report `ok` depend on those parameters. | This is the first legacy child tuple derivation. It treats resolved child source derivation as the scalar tuple. | Acceptable as old uniform-control/provisional diagnostic history only. | Gate C must create child structured states and report tuple reduction separately from source-state derivation. |
| `src/lib/fieldSourceChildDegeneracy.ts` | `compareEmissionTuples`, `ChildEmissionTupleComparison`, `buildTetrahedralChildProfileDegeneracyReport` | medium | Degeneracy compares only amplitude, waveNumber, phase, and attenuation. | Tuple-equivalence can miss structural differences such as complement/antipodal state distinctions. | Acceptable as scalar degeneracy/control audit. | Gate C must add source-state distinctness, tuple-equivalence-after-reduction, and unknown-feature retention audits. |
| `src/lib/fieldSourceProfileAwarePolicy.ts` | `ProfileAwareSourceEntry.emissionParameters`, `ProfileAwareSourceReadiness`, `buildChildSourceEntry`, `copyEmissionParameters` | high | A child with `derivedParameters` becomes `generated-child-derived`, `readiness = field-ready`, and receives `emissionParameters`. | This promotes scalar child tuples into field-ready source entries. | Acceptable as provisional policy behavior only. | Gate C/D must distinguish source-state-ready from tuple-ready and preserve reduction status before any FieldCueV0 consumption change. |
| `src/lib/fieldSourceProfileAwareAtlasAdapter.ts` | `ProfileAwareAtlasSourceEntry extends FieldSourceEmissionParameters`, `buildAtlasSources`, `fieldReadySourceCount` | medium | Field-ready policy sources are converted into atlas source entries by copying scalar emission parameters. | This is legitimate field-facing reduction for the current atlas, but no reduction-loss report travels with the atlas source. | Acceptable as current atlas adapter substrate. | Gate C must not replace the atlas yet; it must produce reduction reports so later adapters can say what was lost before scalar execution. |
| `src/lib/fieldSourceProfileAwareAtlasExecution.ts` | `buildProfileAwareAtlasExecutionReport`, `buildPositionedSources`, `sampleFieldAtlasAtPoint`, `fieldReadySourceCount` | low | The atlas execution consumes positioned scalar atlas sources and computes field samples. | This is the correct place for emitted tuples to be consumed as field-facing reduction. The risk is upstream trust, not execution math. | Acceptable active substrate. | Gate C should leave atlas execution unchanged and feed it only through explicit tuple reduction. |
| `src/lib/fieldSourcePythagoreanTetrachordQuarkRegimeV0.ts` | `PythagoreanTetrachordPrimalSourceRecord extends FieldSourceEmissionParameters`, `channelEmittedTuple`, `derivedTuple`, `buildChildDerivationRecord`, `buildChildReadinessAudit`, `buildChildDistinctivenessAudit` | high | The regime adds strong harmonic provenance, but primal records and child records still culminate in scalar emitted tuples and `fieldReady`. | It is a valuable scalar baseline, but still scalar-first and has no preserved/reduced/metadata-only/lost structure report. | Accepted control / harmonic scalar baseline. | Gate C must demote this to harmonic component/control and wrap or supersede it with structured source-state derivation. |
| `src/lib/fieldCueV0.ts` | `FieldCueV0EmissionTuple`, `FieldCueV0EmittedSourceSignature`, `FieldCueV0SourceSignatureProvenance`, `buildCueSourceSignatureProvenance`, `buildEmittedSourceSignature`, `summarizeTuple` | high | `emittedSourceSignature` exposes `fieldReady`, `emissionTuple`, and `tupleSummary`; provenance mostly wraps Pythagorean scalar/harmonic fields. | FieldCueV0 is downstream and currently presents scalar readiness as source-signature readiness. | Provisional downstream witness only. | Gate D, after Gate C, must consume structured source-state and include reduction honesty. |
| `src/lib/generatedSiteReadingV0.ts` | `GeneratedSiteReadingV0FieldWitness.sourceSignatureStatus`, `buildFieldWitness` | high | Generated-site readings set `sourceSignatureStatus = field-ready` from complete FieldCueV0 inheritance plus `emittedSourceSignature.fieldReady`. | This promotes provisional scalar FieldCueV0 state into reading-level source-signature status. | Provisional downstream witness only. | Gate E must inherit revised FieldCueV0 structured source-state fields and keep final trust blocked until Gate C/D pass. |
| `src/lib/sourceSignatureContractAuditV0.ts` | `SourceSignatureContractAuditV0Tuple`, `SourceSignatureContractAuditV0ChildDerivationRow.derivedTuple`, `buildSourceSignatureContractAuditV0ComparisonReport`, `pickGate2DownstreamSourceIntegrationStatus` | high | Gate 1/Gate 2 pass around uniform bad control vs Pythagorean scalar candidate and downstream field-ready scalar provenance. | The audit correctly proved scalar baseline improvement, but after the amendment its pass is not final source-signature truth. | Accepted scalar control audit. | Gate C must add structured source-state diagnostic comparison against uniform bad control and Pythagorean scalar baseline. |
| `scripts/preview-generated-site-legibility-v0.cjs` | `buildPreviewLines`, `buildSiteLines`, `buildSummaryTableLines`, `validateReading`, `getSourceInheritanceLegibilityStatus` | high | The preview presents ratio, waveNumber, wavelength, emitted phase, and `field-ready` source signature as generated-site legibility. | Useful scalar-baseline preview, but not active destination and no reduction-loss report. | Accepted preview of scalar-baseline state only. | Gate C/F successor preview must show preserved/reduced/metadata-only/lost structure before UI. |
| `scripts/diagnose-source-signature-contract-audit-v0.cjs` | Pythagorean pass assertions, derived tuple checks, downstream source-provenance checks | medium | Asserts the scalar Pythagorean regime and downstream propagation pass. | Useful regression control, but language should not be read as final structured source-signature authority. | Accepted diagnostic control. | Gate C should add a separate structured source-state diagnostic, not mutate this control first. |
| `scripts/diagnose-field-cue-v0.cjs` | `sourceSignatureProvenance` assertions, `emittedSourceSignature`, `field-ready signature`, tuple waveNumber checks | medium | Asserts FieldCueV0 has field-ready emitted tuple and Pythagorean provenance. | Good provisional downstream regression, but scalar tuple readiness is not final source-state readiness. | Accepted provisional downstream diagnostic. | Gate D should update or supersede after Gate C, not during Gate B. |
| `scripts/diagnose-generated-site-reading-v0.cjs` | `sourceSignatureStatus`, Pythagorean regime/source profile IDs, shell scaling assertions | medium | Asserts generated-site readings inherit scalar Pythagorean source signature status. | Good provisional downstream regression, but final trust is blocked. | Accepted provisional downstream diagnostic. | Gate E should update or supersede after Gate D, not during Gate B. |

## 4. Required findings

### A. Where is the scalar tuple currently defined?

The scalar tuple is defined in `src/lib/fieldSourceProfiles.ts`:

```txt
FieldSourceEmissionParameters:
  amplitude
  waveNumber
  phase
  attenuation
```

It is inherited by:

```txt
FieldSourceProfile
AssignedPrimalEmissionSource
```

It is copied or mirrored by later tuple types:

```txt
QuarkChannelParameters
FieldCueV0EmissionTuple
SourceSignatureContractAuditV0Tuple
PythagoreanTetrachord channelEmittedTuple / derivedTuple
```

### B. Where are child tuples derived?

Legacy/uniform child tuples are derived in:

```txt
src/lib/fieldSourceQuarkChannels.ts
  buildQuarkChannelRecord -> channelParameters

src/lib/fieldSourceChildDerivations.ts
  mergeFourQuarkChannelParameters -> derivedParameters
  buildTetrahedralChildSourceProfileDerivationReport -> derivation.derivedParameters
```

Pythagorean scalar-baseline child tuples are derived in:

```txt
src/lib/fieldSourcePythagoreanTetrachordQuarkRegimeV0.ts
  buildChildChannels -> channelEmittedTuple
  buildChildDerivationRecord -> derivedTuple
```

### C. Where are child tuples compared for degeneracy?

Child tuple degeneracy is compared in:

```txt
src/lib/fieldSourceChildDegeneracy.ts
  compareEmissionTuples
  buildTetrahedralChildProfileDegeneracyReport
```

The comparison checks:

```txt
amplitudeDelta
waveNumberDelta
phaseDelta
attenuationDelta
sameTuple
```

This is scalar degeneracy only. It does not prove structured source-state equivalence.

### D. Where are tuples promoted into profile-aware source entries?

Promotion occurs in:

```txt
src/lib/fieldSourceProfileAwarePolicy.ts
  buildChildSourceEntry
```

Observed pattern:

```txt
derivation.derivedParameters
-> ProfileAwareSourceEntry.emissionParameters
-> sourceKind = generated-child-derived
-> readiness = field-ready
```

### E. Where are tuples converted into atlas sources?

Conversion occurs in:

```txt
src/lib/fieldSourceProfileAwareAtlasAdapter.ts
  ProfileAwareAtlasSourceEntry extends FieldSourceEmissionParameters
  buildAtlasSources
```

Observed pattern:

```txt
ProfileAwareSourceEntry.emissionParameters
-> amplitude/waveNumber/phase/attenuation copied directly into atlasSources
```

### F. Where are tuples consumed by field atlas execution?

Consumption occurs in:

```txt
src/lib/fieldSourceProfileAwareAtlasExecution.ts
  buildProfileAwareAtlasExecutionReport
  buildProfileAwareAtlasExecutionReportFromPositionMap
  sampleFieldAtlasAtPoint
```

This is low risk when read correctly: the atlas is supposed to consume field-facing emitted tuples. The risk is upstream conflation, not scalar field execution itself.

### G. Where does Pythagorean regime provide provenance but still remain scalar-first?

The Pythagorean regime is in:

```txt
src/lib/fieldSourcePythagoreanTetrachordQuarkRegimeV0.ts
```

It provides strong scalar-baseline provenance:

```txt
provingRegimeId
sourceProfileSystemId
childInheritanceGrammarId
sourcePolicyId
ratioLabel
ratio
logRatio
childLogRatio
childRatio
childWaveNumber
childWavelength
baseWaveNumberCalibration
pairSumUniquenessAudit
eventShellProvenance
activeDifferentiatingAxes
neutralAxes
```

But it remains scalar-first because:

```txt
PythagoreanTetrachordPrimalSourceRecord extends FieldSourceEmissionParameters
PythagoreanTetrachordChannelRecord.channelEmittedTuple is FieldSourceEmissionParameters
PythagoreanTetrachordChildDerivationRecord.derivedTuple is FieldSourceEmissionParameters
fieldReady is Boolean(derivedTuple)
child distinctiveness is audited through scalar tuple counts
```

### H. Where does FieldCueV0 expose emittedSourceSignature or sourceSignatureProvenance?

Exposure occurs in:

```txt
src/lib/fieldCueV0.ts
  FieldCueV0EmittedSourceSignature
  FieldCueV0SourceSignatureProvenance
  FieldCueV0.emittedSourceSignature
  FieldCueV0.sourceSignatureProvenance
  buildCueSourceSignatureProvenance
  buildEmittedSourceSignature
  summarizeTuple
```

Risk pattern:

```txt
emittedSourceSignature.fieldReady
emittedSourceSignature.emissionTuple
tupleSummary = "field-ready tuple ..."
sourceSignatureProvenance mostly contains Pythagorean scalar/harmonic provenance
```

FieldCueV0 is therefore provisional downstream, not final source-state truth.

### I. Where does GeneratedSiteReadingV0 inherit sourceSignatureStatus?

Inheritance occurs in:

```txt
src/lib/generatedSiteReadingV0.ts
  GeneratedSiteReadingV0FieldWitness.sourceSignatureStatus
  buildFieldWitness
```

Observed pattern:

```txt
fieldCue.inheritanceAxis.inheritanceStatus === "complete"
and fieldCue.emittedSourceSignature.fieldReady
-> sourceSignatureStatus = "field-ready"
```

This is a high-risk downstream trust promotion until Gate C/D/E repair the source-state chain.

### J. Where does sourceSignatureContractAuditV0 mark Gate 1/Gate 2 pass around scalar Pythagorean regime?

Pass status is produced in:

```txt
src/lib/sourceSignatureContractAuditV0.ts
  buildSourceSignatureContractAuditV0ComparisonReport
  pickGate2DownstreamSourceIntegrationStatus
```

Gate 1 currently depends on:

```txt
uniform control failed as expected
Pythagorean candidate status pass
Gate 2 downstream status pass
comparison issues length zero
```

Gate 2 currently depends on:

```txt
FieldCueV0 sourceSignatureProvenance.provingRegimeId =
  pythagorean-tetrachord-quark-regime-v0

FieldCueV0 emittedSourceSignature.fieldReady = true

GeneratedSiteReadingV0 fieldWitness.sourceRegimeId =
  pythagorean-tetrachord-quark-regime-v0

GeneratedSiteReadingV0 fieldWitness.sourceSignatureStatus =
  field-ready
```

This is accepted scalar-control evidence, not final structured source-state proof.

### K. Where does preview-generated-site-legibility-v0 present ratios/waveNumber/wavelength as if they were legibility?

The preview script is:

```txt
scripts/preview-generated-site-legibility-v0.cjs
```

Relevant functions:

```txt
buildPreviewLines
buildSiteLines
buildSummaryTableLines
validateReading
getSourceInheritanceLegibilityStatus
```

Risk pattern:

```txt
Gate 1 source-signature proving: pass
Gate 2 downstream source integration: pass
child logRatio / ratio / waveNumber / wavelength / emitted phase displayed
"Source signature is field-ready under Pythagorean proving regime."
sourceInheritanceLegibilityStatus pass if scalar Pythagorean fields are finite
```

This is useful scalar-baseline preview output. It is not active destination legibility under structured source-state law.

## 5. Risk classification

Current repo risk summary:

```txt
high:
  fieldSourceProfiles.ts
  fieldSourceChildDerivations.ts
  fieldSourceProfileAwarePolicy.ts
  fieldSourcePythagoreanTetrachordQuarkRegimeV0.ts
  fieldCueV0.ts
  generatedSiteReadingV0.ts
  sourceSignatureContractAuditV0.ts
  preview-generated-site-legibility-v0.cjs

medium:
  fieldSourceQuarkChannels.ts
  fieldSourceChildDegeneracy.ts
  fieldSourceProfileAwareAtlasAdapter.ts
  diagnose-source-signature-contract-audit-v0.cjs
  diagnose-field-cue-v0.cjs
  diagnose-generated-site-reading-v0.cjs

low:
  fieldSourceProfileAwareAtlasExecution.ts

none:
  none of the inspected target files are completely irrelevant to tuple/signature law
```

Interpretation:

```txt
high does not mean broken in its historical branch.
high means unsafe to treat as final under the active structured source-state law.
```

## 6. Current status of major artifacts

```txt
fieldSourceProfiles.ts:
  high risk
  scalar tuple definition and scalar profile identity
  accepted as legacy substrate / bad-control support

fieldSourceChildDerivations.ts:
  high risk
  child derivation resolves to derivedParameters
  accepted as legacy scalar derivation/control

fieldSourceProfileAwarePolicy.ts:
  high risk
  derivedParameters promote to field-ready source emissionParameters
  accepted as provisional source policy behavior

fieldSourceProfileAwareAtlasAdapter.ts:
  medium risk
  tuple copied into atlas input source
  accepted as field-facing scalar adapter substrate

fieldSourcePythagoreanTetrachordQuarkRegimeV0.ts:
  high risk
  strong scalar provenance but still derivedTuple/channelEmittedTuple first
  accepted as harmonic scalar baseline / diagnostic control

fieldCueV0.ts:
  high risk
  exposes emittedSourceSignature and sourceSignatureProvenance around scalar baseline
  provisional downstream witness, blocked from final trust

generatedSiteReadingV0.ts:
  high risk
  inherits sourceSignatureStatus from FieldCueV0 scalar readiness
  provisional downstream witness, blocked from final trust

sourceSignatureContractAuditV0.ts:
  high risk
  Gate 1/Gate 2 pass currently around scalar Pythagorean regime and downstream propagation
  accepted scalar control audit, not final structured source-state proof

preview-generated-site-legibility-v0.cjs:
  high risk
  presents scalar Pythagorean ratios/waveNumber/wavelength as source-inheritance legibility
  accepted scalar-baseline preview, not active destination
```

## 7. Gate C requirements derived from audit

Structured Source-State Diagnostic v0 must be diagnostic-only and must include:

```txt
structured source state types
primal states A/B/C/D
generated edge states AB/AC/AD/BC/BD/CD
complement / antipodal involution internal to state
orientation or polarity convention
incidence/projection relations
harmonic component using Pythagorean baseline as component/control
tuple reduction report
preserved structure fields
reduced/compressed structure fields
metadata-only structure fields
lost structure fields
antipodal covariance audit
relabeling covariance audit
unknown-feature retention audit
comparison against uniform bad control
comparison against Pythagorean scalar baseline
no FieldCueV0 consumption change yet
```

Gate C must distinguish at least:

```txt
source-state-derived
tuple-reduced
field-active structure
metadata-only structure
lost-by-tuple-projection structure
tuple-too-narrow or partial-structure-loss status where applicable
```

Gate C must not:

```txt
modify FieldCueV0 consumption
modify GeneratedSiteReadingV0 consumption
replace the field atlas
add UI
write packets
add topology
register operations
generalize beyond one-Ambo tetrahedron
```

## 8. Blocking statement

FieldCueV0 and GeneratedSiteReadingV0 remain blocked from final trust until Gate C passes and later Gate D/E reconnect them to structured source-state.

Current FieldCueV0 and GeneratedSiteReadingV0 remain useful as provisional downstream witnesses over the Pythagorean scalar baseline. They are not final source-state truth.

## 9. Forbidden repairs during Gate B

No code changes were made and none are authorized by this audit.

Gate B forbids:

```txt
source code edits
script edits
package.json edits
UI changes
registry changes
packet file changes
topology file changes
structured source-state implementation
FieldCueV0 consumption changes
GeneratedSiteReadingV0 consumption changes
```

This audit names risks and next requirements only.

## 10. Compact next branch statement

Next permissible implementation branch: Structured Source-State Diagnostic v0.
