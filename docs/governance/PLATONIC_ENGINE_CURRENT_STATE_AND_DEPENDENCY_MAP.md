# PlatonicEngine Current State and Dependency Map

Status: governance/planner document.

This document is not a Codex prompt, not a backlog, and not implementation permission by itself. It is a planner compass and dependency map for the repository after the Structured Source-State governance amendment.

Repository source remains the factual authority for implemented files. Governance documents define strategic permission and layer law.

## 1. Current accepted repo state

Current top commit:

```txt
206ebe1 Add structured source-state governance
```

Current governance documents present:

```txt
docs/governance/PLATONIC_ENGINE_EVENT_LEGIBILITY_PIVOT_CHARTER.md
docs/governance/PLATONIC_ENGINE_FIELD_CUE_TARGET_CONTRACT_V0_2.md
docs/governance/PLATONIC_ENGINE_PROMPTER_NOTICE_STRUCTURED_SOURCE_STATE_SOLUTION.md
docs/governance/PLATONIC_ENGINE_PROMPTER_VITAL_NOTE_SOURCE_SIGNATURE_PROVING_REGIME.md
docs/governance/PLATONIC_ENGINE_SOURCE_PROFILE_CONTRACT_AMENDMENT_STRUCTURED_SOURCE_STATE.md
docs/governance/README.txt
```

Current major diagnostic and preview scripts present in `package.json` include:

```txt
diagnose:source-signature-contract-audit-v0
diagnose:field-cue-v0
diagnose:generated-site-reading-v0
preview:generated-site-legibility-v0
preview:generated-site-reading-v0
preview:field-cue-v0
diagnose:field-source-profiles
diagnose:field-source-quark-channels
diagnose:field-source-child-derivations
diagnose:field-source-child-degeneracy
diagnose:field-source-profile-aware-policy
diagnose:field-source-profile-aware-atlas-adapter
diagnose:field-source-profile-aware-atlas-execution
diagnose:field-source-profile-aware-atlas-view-model
diagnose:field-source-profile-aware-atlas-view-model-runtime
diagnose:field-source-profile-aware-evidence-stability
diagnose:field-source-profile-aware-feature-report
diagnose:field-source-profile-aware-route-gate-candidates
diagnose:field-source-profile-aware-support-region-candidates
diagnose:field-source-profile-aware-field-mode-ui
diagnose:field-atlas
diagnose:field-sampler
```

Current relevant source files present include the field atlas substrate, profile-aware source stack, Pythagorean proving regime, FieldCueV0, GeneratedSiteReadingV0, and source-signature contract audit files.

The repository state is factual authority for implemented files. This document does not assert that a future branch, file, or diagnostic exists unless it is named as future work.

## 2. Active governance hierarchy

Active law:

```txt
1. Event Legibility Pivot Charter
2. Field-Cue Target Contract v0.2
3. Structured Source-State Solution Notice
4. Structured Source-State and Tuple-Reduction Amendment
```

Current binding source-signature law:

```txt
source signature = structured source state
emitted tuple = field-facing reduction
```

The emitted tuple is not the whole source signature.

The tuple may remain necessary for the current field atlas because the atlas consumes scalar emission parameters:

```txt
amplitude
waveNumber
phase
attenuation
```

But those values are subordinate projections from a structured source state. They must not be treated as the whole source identity.

## 3. Superseded / demoted / retained controls

Current classifications:

```txt
uniform-circle fixture:
  bad control

Pythagorean Tetrachord Quark Regime v0:
  harmonic scalar baseline / diagnostic control

Pythagorean FieldCueV0 downstream integration:
  provisional downstream witness, not final source-state truth

generated-site legibility preview:
  useful preview of scalar-baseline state, not active destination

old tuple-centered readings:
  superseded by structured source-state amendment
```

The Pythagorean work was not useless. It remains valuable as a finite harmonic scalar baseline and control. It proved that finite harmonic slots, log-ratio provenance, pair-sum uniqueness, and calibrated source-signature audits can make the earlier uniform control fail honestly.

Its demotion is not a repudiation. It is a hierarchy correction: scalar tuple differentiation is not the same thing as structured source-state truth.

## 4. Accepted implementation layers

Factual implementation inventory and current trust level:

```txt
field atlas substrate and source population machinery
  files include src/lib/fieldAtlas.ts, src/lib/fieldSampler.ts, and field atlas report/candidate modules
  trust level: accepted active substrate

profile-aware source profile / Quark inheritance stack
  files include src/lib/fieldSourceProfiles.ts, src/lib/fieldSourceQuarkChannels.ts,
  src/lib/fieldSourceChildDerivations.ts, src/lib/fieldSourceChildDegeneracy.ts,
  and src/lib/fieldSourceProfileAwarePolicy.ts
  trust level: accepted active substrate, with tuple/signature conflation audit pending

source-signature contract audit
  file: src/lib/sourceSignatureContractAuditV0.ts
  script: scripts/diagnose-source-signature-contract-audit-v0.cjs
  trust level: accepted control

Pythagorean tetrachord proving regime
  file: src/lib/fieldSourcePythagoreanTetrachordQuarkRegimeV0.ts
  trust level: accepted control / harmonic scalar baseline

FieldCueV0
  file: src/lib/fieldCueV0.ts
  script: scripts/diagnose-field-cue-v0.cjs
  trust level: provisional downstream, blocked pending structured source-state diagnostic

GeneratedSiteReadingV0
  file: src/lib/generatedSiteReadingV0.ts
  script: scripts/diagnose-generated-site-reading-v0.cjs
  trust level: provisional downstream, blocked pending structured source-state diagnostic

generated-site legibility preview
  script: scripts/preview-generated-site-legibility-v0.cjs
  trust level: accepted preview of scalar-baseline state, not the active destination

governance amendments
  docs include the Structured Source-State Solution Notice and the Structured Source-State and Tuple-Reduction Amendment
  trust level: active law
```

## 5. Dependency DAG

### Gate A - Governance state recovered

Purpose:

```txt
Recover the current law after the structured source-state amendment and prevent old scalar tuple plans from steering the next branch.
```

Depends on:

```txt
current governance docs present
repo state checked locally
current top commit identified
```

Unlocks:

```txt
Gate B tuple/signature conflation audit planning
```

Forbidden before this gate:

```txt
new implementation
UI polish
FieldCueV0 expansion
topology
packet writing
source-profile editing UI
```

### Gate B - Tuple/signature conflation audit complete

Purpose:

```txt
Identify where the current repo treats emission tuples, derived parameters, or scalar reports as if they were full source signatures.
```

Depends on:

```txt
Gate A
source-profile stack inspection
FieldCueV0 and GeneratedSiteReadingV0 inspection
diagnostic/preview script inspection
```

Unlocks:

```txt
Gate C Structured Source-State Diagnostic v0 implementation
```

Forbidden before this gate:

```txt
changing FieldCueV0 consumption
changing GeneratedSiteReadingV0 consumption
UI work
route/gate/support/region expansion
automatic naming
operation registration
```

### Gate C - Structured Source-State Diagnostic v0 passes

Purpose:

```txt
Prove a finite tetrahedral-Ambo structured source-state capsule and honest tuple reduction for the one-Ambo proving event.
```

Depends on:

```txt
Gate B
diagnostic-only branch scope
finite source-state capsule
tuple-reduction honesty report
uniform-circle and Pythagorean baseline comparison
```

Unlocks:

```txt
Gate D FieldCueV0 structured source-state consumption
```

Forbidden before this gate:

```txt
treating FieldCueV0 as final
treating GeneratedSiteReadingV0 as final
UI rendering work
packet persistence
topology
general algebra engine
field atlas replacement
```

### Gate D - FieldCueV0 consumes structured source-state

Purpose:

```txt
Make FieldCueV0 consume the structured source-state diagnostic result instead of treating scalar Pythagorean tuple output as final source-signature truth.
```

Depends on:

```txt
Gate C pass
reduction statuses available
source-state provenance available
field-active vs metadata-only/lost structure classified
```

Unlocks:

```txt
Gate E GeneratedSiteReadingV0 revised consumption
```

Forbidden before this gate:

```txt
GeneratedSiteReadingV0 final claims
UI panel polish
new field feature families
route/gate/support/region maturation
semantic naming
```

### Gate E - GeneratedSiteReadingV0 consumes revised FieldCueV0

Purpose:

```txt
Make generated-site readings inherit the revised FieldCueV0 source-state truth and preserve tuple-reduction honesty.
```

Depends on:

```txt
Gate D pass
FieldCueV0 structured source-state provenance
FieldCueV0 candidate maturity boundaries preserved
```

Unlocks:

```txt
Gate F human preview
```

Forbidden before this gate:

```txt
UI as product surface
automatic naming
packet writing
topology import
claiming mature field-world participation from candidate references
```

### Gate F - Human preview accepted

Purpose:

```txt
Show the revised generated-site readings in a human-legible preview and verify that source-state truth improves the act of reading.
```

Depends on:

```txt
Gate E pass
preview that surfaces preserved/reduced/lost source-state structure
human-readable naming questions
honest candidate-only/sensitive/saturated statuses
```

Unlocks:

```txt
Gate G UI rendering
```

Forbidden before this gate:

```txt
UI polish
visual expansion
source-profile editing UI
workflow persistence
```

### Gate G - UI rendering

Purpose:

```txt
Render the accepted preview/cue/reading information without outrunning the diagnostic truth.
```

Depends on:

```txt
Gate F acceptance
clear display contract
no tuple-as-signature leakage
```

Unlocks:

```txt
Gate H naming workflow
```

Forbidden before this gate:

```txt
recording names as packet truth
topology workflows
general field visualization
route/gate/support/region expansion
```

### Gate H - Naming workflow

Purpose:

```txt
Let the human name, reject, suspend, or revise generated-site dwellings under a separate explicit workflow.
```

Depends on:

```txt
Gate G
human naming authority preserved
packet/write contract if persistence is requested
```

Unlocks:

```txt
Gate I bounded portability/generalization test
```

Forbidden before this gate:

```txt
silent packet writes
automatic naming
semantic truth claims from field cues
Shape mutation
topology import as shortcut
```

### Gate I - Bounded portability/generalization test

Purpose:

```txt
Test exactly one bounded portability question after the one-Ambo event becomes source-state truthful and humanly legible.
```

Depends on:

```txt
Gate H
named or resolved generated material
one explicit portability target
```

Unlocks:

```txt
future scoped generalization decisions
```

Forbidden before this gate:

```txt
general harmonic universe
general algebra engine
multi-shape field expansion
recursive-generation generalization
topology program
field atlas replacement
```

## 6. Current blocking fact

FieldCueV0 and GeneratedSiteReadingV0 currently consume the Pythagorean scalar regime. They are useful but blocked from being treated as final because the active source-signature kernel is now structured source-state, not scalar tuple.

This is not an apology for upstream movement. The upstream movement is a correction of sovereignty:

```txt
source-state truth is now sovereign;
tuple reduction is subordinate;
field-cue is downstream;
UI is downstream.
```

## 7. Next permissible branch

Next implementation branch name:

```txt
Structured Source-State Diagnostic v0
```

It must be diagnostic-only.

Expected future files, not to create in this branch:

```txt
src/lib/structuredSourceStateDiagnosticV0.ts
scripts/diagnose-structured-source-state-v0.cjs
```

The current document only prepares for that branch. It does not create the diagnostic, change source-state code, touch FieldCueV0, alter GeneratedSiteReadingV0, add package scripts, or authorize UI work.

## 8. Forbidden near-term branches

Forbidden near-term branch directions:

```txt
UI polish
more FieldCueV0 panel work
route/gate/support/region expansion
topology
packet writing
source-profile editing UI
general algebra engine
general harmonic universe
field atlas replacement
automatic naming
Shape mutation
operation registration
treating emitted tuple as full signature
```

These prohibitions protect the current correction. They do not delete the long horizon of field-cue maturity, topology, naming workflows, or portability. They keep those layers downstream of source-state truth.

## 9. Tuple/signature conflation risk map

This is a preliminary risk map from current repo knowledge, not a completed audit.

Likely files where scalar tuple assumptions, emitted-parameter assumptions, or tuple-as-signature language should be inspected during Gate B:

```txt
src/lib/fieldSourceProfiles.ts
src/lib/fieldSourceQuarkChannels.ts
src/lib/fieldSourceChildDerivations.ts
src/lib/fieldSourceChildDegeneracy.ts
src/lib/fieldSourceProfileAwarePolicy.ts
src/lib/fieldSourceProfileAwareAtlasAdapter.ts
src/lib/fieldSourceProfileAwareAtlasExecution.ts
src/lib/fieldSourcePythagoreanTetrachordQuarkRegimeV0.ts
src/lib/fieldCueV0.ts
src/lib/generatedSiteReadingV0.ts
src/lib/sourceSignatureContractAuditV0.ts
scripts/preview-generated-site-legibility-v0.cjs
```

Gate B should inspect these files for patterns such as:

```txt
derived tuple treated as source identity
emission tuple treated as full source signature
FieldSourceEmissionParameters treated as source-state-complete
field-ready scalar tuple treated as final source truth
source-signature language attached only to amplitude/waveNumber/phase/attenuation
missing preserved/reduced/metadata-only/lost reduction status
```

Do not claim a full audit is complete until Gate B performs it and records findings.

## 10. Planner operating rule

Future Codex prompts must declare:

```txt
parent gate
touched layer
active law
demoted controls
forbidden downstream changes
whether UI is allowed
whether tuple-as-signature assumptions must fail diagnostics
```

A prompt that does not declare these should be treated as under-specified for source-state, FieldCueV0, GeneratedSiteReadingV0, UI, topology, or packet work.

## 11. Compact current path

```txt
source-state truth
-> tuple reduction honesty
-> FieldCueV0
-> GeneratedSiteReadingV0
-> preview
-> UI
-> human naming
-> bounded portability
```

The sovereign order is now:

```txt
source-state truth first;
tuple reduction second;
field-cue downstream;
generated-site reading downstream;
UI downstream;
human naming protected;
portability bounded.
```
