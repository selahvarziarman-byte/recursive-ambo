# T21-A A3 Residual-Origin / Stale Field Equivalence Audit

## 1. Summary verdict

Summary verdict: `A3-law-cleaned-stale-reduction`

Recommendation: `revise-T21`

The proposed A3 residual-origin law is not genuinely new. It is a cleaned P-simplex vector reduction of the older structured-source-state residual problem:

```txt
J = C q_ij + alpha r_ij + beta r_kl + L
```

The stale field layer already discovered the same core problem: source-state structure can exist, can be visible in emitted or structural witnesses, and can still fail to become trustworthy raw field behavior or downstream FieldCue evidence. The P-simplex version improves the situation because it replaces scalar tuple and cue vocabulary with an explicit vector decomposition into child-axis, target-edge A3 root, complement-edge A3 root, and leakage / unsupported remainder.

This audit does not authorize a new diagnostic implementation by itself. T21 should be revised so that it states:

```txt
A3 residual-origin law is the P-simplex reduction of the stale structured-source-state residual problem.
It is allowed only as source-drive residual evidence.
It does not imply response grounding, FieldCue, route, semantic, or defect/vortex interpretation.
```

## 2. Files/docs inspected

All primary target files were present.

Code files inspected:

| File | Inspection note |
| --- | --- |
| `src/lib/structuredSourceStateFieldBehaviorResidualV0.ts` | C.4D residual comparison, ambiguous residual status, FieldCue / GeneratedSiteReading blocking. |
| `src/lib/structuredSourceStateMultiProjectionStructuralChannelV0.ts` | Propagation projection, structural projection, polarity, complement operation, structural-channel relation visibility. |
| `src/lib/structuredSourceStateCandidateReductionLawComparisonV0.ts` | R4-S1 demotion, orbit-common control, structural-propagation split candidate, no FieldCue promotion. |
| `src/lib/structuredSourceStateFieldBehaviorRecoveryV0.ts` | Raw field-behavior recovery failure / ambiguity and detector cleanliness boundaries. |
| `src/lib/structuredSourceStateEmittedRecoveryV0.ts` | R0 metadata-only structured control and R4-S1 emitted tuple success. |
| `src/lib/fieldCueV0MultiProjectionConsumption.ts` | Diagnostic-only multi-projection consumption adapter, reduction honesty, blocked runtime promotion. |
| `src/lib/fieldCueV0.ts` | FieldCueV0 diagnostic-only integration and blocking / non-semantic statuses. |
| `src/lib/pSimplexForcingScaleCalibrationReachabilityLedgerT20.ts` | T20 consequence: residual reachability separated from response reachability; source-magnitude evidence incomplete. |

Scripts inspected:

| Script | Inspection note |
| --- | --- |
| `scripts/diagnose-structured-source-state-field-behavior-residual-v0.cjs` | Existing runner asserts diagnostic integrity only. |
| `scripts/diagnose-structured-source-state-multi-projection-structural-channel-v0.cjs` | Existing runner asserts diagnostic integrity only. |
| `scripts/diagnose-structured-source-state-candidate-reduction-law-comparison-v0.cjs` | Existing runner asserts diagnostic integrity only. |
| `scripts/diagnose-structured-source-state-field-behavior-recovery-v0.cjs` | Existing runner asserts diagnostic integrity only. |
| `scripts/diagnose-structured-source-state-emitted-recovery-v0.cjs` | Existing runner asserts emitted recovery diagnostics. |
| `scripts/diagnose-field-cue-v0-multi-projection-consumption.cjs` | Existing runner asserts adapter boundaries and blocking. |
| `scripts/diagnose-field-cue-v0.cjs` | Existing runner includes forbidden promotion checks. |

Governance and research docs inspected:

| Doc | Inspection note |
| --- | --- |
| `docs/governance/PLATONIC_ENGINE_GATE_C4_FIELD_BEHAVIOR_FAILURE_INTERPRETATION.md` | Field-behavior failure context. |
| `docs/governance/PLATONIC_ENGINE_GATE_C4D_RESIDUAL_DIAGNOSTIC_REVIEW.md` | Residual was ambiguous local residue, not recoverable field regime. |
| `docs/governance/PLATONIC_ENGINE_GATE_C4L_REDUCTION_LAW_DECISION.md` | Reduction law must state preserved, compressed, metadata-only, and lost structure. |
| `docs/governance/PLATONIC_ENGINE_GATE_C4L_D4_STRUCTURAL_CHANNEL_WITNESS_REVIEW.md` | Structural channel witness is not raw-field victory or FieldCue trust. |
| `docs/governance/PLATONIC_ENGINE_GATE_C5_MULTI_PROJECTION_SOURCE_STATE_ACCEPTANCE_REVIEW.md` | Multi-projection source-state regime accepted with strict limits; FieldCue remains blocked. |
| `docs/governance/PLATONIC_ENGINE_TUPLE_SIGNATURE_CONFLATION_AUDIT.md` | Tuple/signature conflation risk confirmed; tuple is not sovereign. |
| `docs/governance/PLATONIC_ENGINE_SOURCE_PROFILE_CONTRACT_AMENDMENT_STRUCTURED_SOURCE_STATE.md` | Active law: source signature is structured source state; emitted tuple is field-facing reduction. |
| `docs/governance/PLATONIC_ENGINE_PROMPTER_NOTICE_STRUCTURED_SOURCE_STATE_SOLUTION.md` | Structured source-state problem framing and reduction-honesty requirements. |
| `docs/governance/PLATONIC_ENGINE_P_SIMPLEX_READOUT_SUBSTRATE_CONSOLIDATION_CHARTER_C1.md` | Closed axis + provisional A3 + quarantined D3 consolidation boundary. |
| `docs/research/PLATONIC_ENGINE_P_SIMPLEX_READOUT_SUBSTRATE_RESEARCH_NOTE_C2.md` | Research-facing statement of closed axis + provisional A3; D4/T diagnostic-only. |

Missing inspected targets: none.

## 3. Equivalence matrix O1-O4

| P-simplex origin | old/stale analogue file or doc | old/stale term | equivalence status | what matches | what differs | what failed before | what P-simplex fixes | what risk remains |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| O1 endpoint split | `PLATONIC_ENGINE_SOURCE_PROFILE_CONTRACT_AMENDMENT_STRUCTURED_SOURCE_STATE.md`; `structuredSourceStateEmittedRecoveryV0.ts`; `structuredSourceStateFieldBehaviorResidualV0.ts` | parent edge, structured source state, R4-S1, residual comparison | partial | The stale layer knew endpoint / child source structure must survive reduction and that scalar emitted tuples were not full source signatures. | It did not express unequal endpoint contributions as `((w_i + w_j)/2) q_ij + ((w_i - w_j)/2) r_ij`. | R4-S1 could succeed as emitted tuple evidence but failed / became ambiguous as raw field behavior. | P-simplex names the target-edge residual root `r_ij` and keeps it separate from the child-axis coefficient `C`. | Endpoint split could still be overpromoted into response readout without generated-site magnitude grounding. |
| O2 complement split | `structuredSourceStateMultiProjectionStructuralChannelV0.ts`; `PLATONIC_ENGINE_GATE_C5_MULTI_PROJECTION_SOURCE_STATE_ACCEPTANCE_REVIEW.md`; C1/C2 | complement edge, complement pairs, structural projection, structural channel | partial | The stale layer represented complement edge state, complement pairs, and structural projection polarity. | It did not use `q_kl = -q_ij` to separate symmetric complement-axis contribution from antisymmetric `r_kl`. | Complement / antipodal structure was recoverable only through a declared structural-channel basis, not raw propagation. | P-simplex converts complement split into a concrete complement-edge A3 root term `beta r_kl`. | Complement residual may be confused with target-edge residual unless T21 reports both coefficients. |
| O3 same-endpoint sibling-pair activation | `structuredSourceStateMultiProjectionStructuralChannelV0.ts`; `PLATONIC_ENGINE_GATE_C4L_D4_STRUCTURAL_CHANNEL_WITNESS_REVIEW.md`; `PLATONIC_ENGINE_GATE_C5_MULTI_PROJECTION_SOURCE_STATE_ACCEPTANCE_REVIEW.md` | multi-projection structural channel, relation visibility, antipodal relation visibility | partial | The stale layer had six generated child projections, structural operations, relation visibility rows, and warnings that raw-field readings are misleading. | It did not state the sibling-pair identities `q_ik + q_il = r_ij`, `q_jk + q_jl = -r_ij`, `q_ik + q_jk = r_kl`, or `q_il + q_jl = -r_kl`. | Old residual and field behavior tests had false positives and lacked clean pair-origin versus leakage separation. | P-simplex can classify sibling-pair origin as target-root, complement-root, or leakage in one vector basis. | Single sibling leakage can still masquerade as structured residual if `L` is not reported explicitly. |
| O4 structured source-state reduction polarity | `structuredSourceStateCandidateReductionLawComparisonV0.ts`; `structuredSourceStateMultiProjectionStructuralChannelV0.ts`; `fieldCueV0MultiProjectionConsumption.ts`; Gate C.5 review | structural polarity, starSign, structural-propagation split, propagation / structural projection split | same | The stale layer explicitly tried to make declared polarity / structural relation field-facing through a separate structural channel. | The stale layer expressed this as source-state / structural-channel machinery, not as P-simplex A3 vector residual components. | R4-S1 was demoted to emitted-tuple success; structural channel was accepted only under a declared multi-projection basis; FieldCue stayed blocked. | P-simplex replaces cue-facing structural-channel vocabulary with source-drive residual evidence and a clean `alpha`, `beta`, `L` decomposition. | The same old failure returns if T21 claims response grounding, FieldCue, or semantics from residual evidence. |

## 4. Failure-mode ledger

| failure mode | present? yes/no/partial | evidence source | relevance to A3 residual-origin law |
| --- | --- | --- | --- |
| tuple-sovereignty | yes | Tuple/signature conflation audit; source-profile amendment; Gate C.5 rejection of scalar tuple as full source signature. | T21 must not reduce A3 residual origin to scalar emission tuple behavior. |
| metadata-only-structure | yes | `r0-metadata-only-structured-control` in emitted recovery; Gate C.5 preserves R0 as a control only. | A3 origin rows must say whether a source-state fact becomes source-drive active or remains metadata. |
| residual-as-cue | yes | C.4D says residual does not unblock FieldCueV0; FieldCue multi-projection consumption stays diagnostic-only. | A3 residual-origin evidence must not become FieldCue or generated-site reading authority. |
| candidate-bloat | partial | C.4D warns against endless residual testing; C.4L documents multiple candidate families and keeps implementation blocked. | T21 should stay narrow and not grow routes, supports, UI, or cue machinery. |
| semantic-leak | partial | FieldCueV0 and C.5 repeatedly mark `not-semantic-naming` and reject semantic naming from structural channel. | A3 residual origin must remain vector/source-drive evidence, not concept meaning. |
| policy-slippage | partial | FieldCueV0 is policy-relative; C.5 accepts only a declared source-state regime, not a universal reduction law. | T21 must state its source-population and reduction conventions instead of treating them as universal. |
| reduction-opacity | yes | C.4L requires preserved / compressed / metadata-only / lost structure; tuple audit says opaque tuple reduction is insufficient. | T21 must report `C`, `alpha`, `beta`, and `L`, not only a pass/fail residual label. |
| single-leakage-confusion | partial | C.4D residual recovered 1/3 with false positives; C.4L-D4 requires misleading-risk warnings. | The leakage term `L` is mandatory so single sibling / unsupported remainder is not called structured A3. |
| no-decomposition | yes | Old residual diagnostics used comparative scores and structural-channel visibility, not `J = C q_ij + alpha r_ij + beta r_kl + L`. | This is the main thing P-simplex genuinely fixes. |
| no-magnitude-grounding | yes | T20 returns `source-magnitude-evidence-incomplete`; stale C.4/C.4D/C.5 separated structural witness from raw field-behavior success. | A3 residual origin can be source-drive evidence but cannot imply operational response reachability yet. |

## 5. Answers to Q1-Q6

Q1. Did the stale field layer already contain endpoint/complement split logic?

Yes, partially.

It contained endpoint and complement structure under names such as `edgeStateId`, `complementEdgeStateId`, `tetrahedral-edge-complement-v0`, `complementPairs`, `structured source state`, `structural projection`, and `multi-projection source-state regime v0`.

The source-profile amendment required generated children to retain parent edge, complement edge, antipodal child, derivation record, and tuple-reduction honesty. The multi-projection structural channel then gave generated child sources both propagation projections and structural projections. However, endpoint/complement split did not become the P-simplex algebra:

```txt
w_i p_i + w_j p_j = ((w_i + w_j)/2) q_ij + ((w_i - w_j)/2) r_ij
```

or:

```txt
w_k p_k + w_l p_l = ((w_k + w_l)/2) q_kl + ((w_k - w_l)/2) r_kl
```

It became source-state-active only under declared structural projection / multi-projection witness logic. It did not become a trusted raw field-behavior law.

Q2. Did the stale field layer already contain same-endpoint sibling-pair or multi-projection logic equivalent to `q_ik + q_il = r_ij`?

Yes, partially.

The old layer contained multi-projection logic with six generated child projections, complement pairs, structural relation visibility, and antipodal relation recovery. That overlaps with sibling-pair reasoning because it records generated children as a relation-bearing source-state population rather than as isolated scalar tuples.

It did not explicitly distinguish:

```txt
q_ik + q_il = r_ij
q_jk + q_jl = -r_ij
q_ik + q_jk = r_kl
q_il + q_jl = -r_kl
```

Nor did it cleanly separate same-endpoint sibling-pair origin from single sibling leakage. The stale layer distinguished structural-channel visibility from misleading raw-field visibility; P-simplex still needs to distinguish pair-origin from leakage inside the vector decomposition.

Q3. Did the stale field layer contain a structured-source-state reduction law capable of producing field-active A3 polarity?

Yes, but the result was bounded and not fully adopted.

R4-S1 used structural star/sign polarity in emitted tuple phase. It passed emitted-source recovery but failed or became ambiguous as raw field behavior. C.4L then tested structural-propagation split candidates, and C.4L-D3 / C.5 accepted a multi-projection source-state regime as an architectural basis: source signature stays structured source state, emitted tuple stays propagation-facing reduction, and structural projection carries relation visibility.

The accepted regime reports reduction honesty: what is propagation projection, what is structural projection, where raw field behavior fails, and where FieldCue remains blocked. It is not an adopted universal runtime reduction law.

Q4. Did the stale field layer already fail at the point T20 exposed?

Yes.

The old equivalent failure was:

```txt
structured source-state / residual structure exists
but raw field behavior and downstream cue trust are not grounded
```

C.4D called this `ambiguous-residual`: local residue existed, but recovery was only 1/3 with false positives. C.4L-D3 produced a structural-channel witness, but not a raw-field victory. C.5 accepted the multi-projection source-state regime while leaving FieldCue blocked and reduction-law adoption not adopted.

T20 restates the analogous P-simplex failure as:

```txt
A3 residual evidence is readable as residual structure, not as response reachability.
source-magnitude-evidence-incomplete
```

Q5. Does current A3 residual-origin law avoid the stale failure?

partially

It avoids the stale failure if it remains a source-drive residual-origin law with explicit decomposition:

```txt
J = C q_ij + alpha r_ij + beta r_kl + L
```

That is clearer than scalar tuple residual scoring or FieldCue structural-channel vocabulary. It does not avoid the stale failure if it silently treats A3 residual origin as A3 response grounding, FieldCue evidence, semantic naming, route/walk/holonomy, or defect/vortex evidence. The missing generated-site magnitude grounding from T20 remains unresolved.

Q6. Should T21 proceed as originally drafted, or should it be revised?

`revise-T21`

T21 should proceed only after revision. The revised T21 should cite the stale structured-source-state problem explicitly, preserve residual/response separation, require leakage reporting, and state that A3 residual origin is source-drive evidence only.

## 6. What P-simplex genuinely adds

P-simplex genuinely adds:

- A finite R3 vector carrier for the residual-origin question.
- A clean child-axis / A3-root / leakage decomposition:

```txt
J = C q_ij + alpha r_ij + beta r_kl + L
```

- A target-edge A3 root term `alpha r_ij`.
- A complement-edge A3 root term `beta r_kl`.
- A leakage / unsupported remainder term `L`.
- Explicit formulas for endpoint split and complement split.
- Explicit sibling-pair identities that can separate target-root origin from complement-root origin.
- Strict separation between A3 residual reachability and A3 response reachability.
- T20 calibration discipline: no gain chosen merely to force A3, and no operational response claim without generated-site source magnitude evidence.
- C1/C2 substrate discipline: closed axis + provisional A3, with D3 quarantined and D4/T diagnostic-only.

The real gain is not a new metaphysics of A3. It is a narrower, more honest vector reduction of the old source-state residual problem.

## 7. What stale-field risk remains

The remaining risks are the same old risks in sharper clothing:

- A3 residual origin could be mistaken for A3 response grounding.
- Residual roots could be promoted into FieldCue or semantic interpretation.
- Sibling leakage could be overclassified as structured A3 if `L` is not reported.
- Endpoint and complement asymmetry could be reported as a label without coefficient evidence.
- A high gain could be chosen to force A3, repeating the old knob-field problem.
- Source-state polarity could be treated as active source drive without declaring the reduction convention.
- Generated-site source magnitude evidence is still incomplete after T20.

T21 must therefore remain a residual-origin ledger, not a readout or response ledger.

## 8. Recommendation for revised T21

Recommendation: `revise-T21`

The revised T21 should be a narrow P-simplex residual-origin diagnostic. It should not be drafted as a new field layer, FieldCue adapter, semantic interpretation, response-reachability proof, or runtime substrate.

Required revised T21 claims:

```txt
A3 residual-origin law is the P-simplex reduction of the stale structured-source-state residual problem.
It is allowed only as source-drive residual evidence.
It does not imply response grounding, FieldCue, route, semantic, or defect/vortex interpretation.
```

Required revised T21 structure:

- report O1 endpoint split as `endpoint-split-A3-root`;
- report O2 complement split as `complement-split-A3-root`;
- report O3 same-endpoint sibling-pair activation as `same-endpoint-sibling-pair-A3-root`;
- report O4 structured source-state reduction polarity only when a declared polarity / orientation / profile asymmetry becomes source-drive active;
- report `C`, `alpha`, `beta`, and `L` separately;
- report whether `L` is near zero or unsupported leakage;
- keep residual evidence separate from response evidence;
- carry T20's `source-magnitude-evidence-incomplete` boundary unless actual generated-site A3 source magnitudes are supplied;
- keep C1/C2 boundaries: closed axis + provisional A3, D3 quarantined, D4/T diagnostic-only;
- do not add FieldCue, route/walk/holonomy, semantic naming, rendering, spatial coupling, defect/vortex, or runtime extraction.

T21 should not proceed as originally drafted if it omits the stale-field equivalence warning or if it lets residual-origin evidence masquerade as operational A3 response grounding.
