# PlatonicEngine Station I Closing Memo
## Source-State Survival of the Medial-Dual Carrier Policy

Audience: mothership (ratifying authority) and the human (Arman, sovereign).

Status: drafted by the prompter/planner/auditor (lieutenant); ratified by mothership 2026-06-11. Not a Claude Code prompt, not implementation permission, not a campaign-plan amendment. It closes Station I of the field-generalizability campaign by recording evidence, the audit verdict, the mothership verification, and the Decision-D1 resolution.

Drafted: 2026-06-11. Ratified: 2026-06-11.

Repo state anchor at drafting:

```txt
branch: Claude-child  (tracking origin/Claude-child)
5625d10 Add Station I medial-carrier source-state survival audit diagnostic   (tip)
934d07e Track field-generalizability campaign governance and archive docs
55c68e9 Add medial dual carrier policy model card diagnostic                  (Phase 2 close)

Station I branch (diagnostic-only):
  src/lib/medialCarrierSourceStateSurvivalAuditV0.ts
  scripts/diagnose-medial-carrier-source-state-survival-audit-v0.cjs
  package.json  (one new script line: diagnose:medial-carrier-source-state-survival-audit-v0)
```

## 1. The Station I question

The discriminator and model card established H3 — an A3/S4 medial-flag carrier base with a Fano-octonionic local multiplicative fiber plus provenance — as the live local-hub carrier candidate, proven only in a finite combinatorial setting (12 flags, triangle closure, square holonomy, gauge robustness, the tetra-G2-core / octa-G1 / cube-G1 cuboctahedral bridges). Station I asked whether that carrier structure is source-state-real: does the medial-dual carrier policy persist into the structured source state (the Gate C.5 multi-projection regime) and survive field-facing tuple reduction, or is it a mathematically impressive side table that exists upstream and is orphaned the moment it is reduced toward the field?

## 2. What was built

One diagnostic-only branch, `medial-carrier-source-state-survival-audit-v0`, which consumes (does not duplicate) `buildOctonionVsA3MedialCarrierDiscriminatorV0Report()` and `buildMedialDualEquivariantCarrierPolicyModelCardV0Report()`, and reads but does not mutate `buildStructuredSourceStateDiagnosticV0Report()` and `buildStructuredSourceStateMultiProjectionStructuralChannelV0Report()`. It classifies each of the twelve carrier-policy objects on two independent axes — `survivalBucket` and `projectionChannel` — deriving every classification structurally from live report data through two shared decision laws, then emits a written source-state-real verdict and a computed Decision-D1 trigger. The diagnostic passes on well-formedness and internal consistency, not on whether structure survives.

## 3. Result — the two-axis classification

```txt
object                                  survivalBucket            projectionChannel
1  a3-medial-flag-token                 blocked-unresolved        unresolved
2  ordered-flag-identity                metadata-only             unresolved
3  signed-fano-lift                     blocked-unresolved        unresolved
4  carrier-ray                          structured-source-state   structural-channel
5  orientation-sign                     metadata-only             unresolved
6  triangle-closure-relation            blocked-unresolved        unresolved
7  square-holonomy-relation             blocked-unresolved        unresolved
8  complete-quadrangle-gauge-robustness blocked-unresolved        unresolved
9  tetra-g2-core-provenance             blocked-unresolved        unresolved
10 octa-g1-provenance                   blocked-unresolved        unresolved
11 cube-g1-provenance                   blocked-unresolved        unresolved
12 cube-primal-sourcehood-boundary      blocked-unresolved        unresolved
```

Three survival tiers under the strong reading (formally ratified by mothership: only `field-active-now` and `structured-source-state` count as survival):

```txt
source-state-real (1/12): carrier-ray
inert side-table  (2/12): ordered-flag-identity, orientation-sign
orphaned          (9/12): the remaining nine
```

Policy-component survival and the decision trigger:

```txt
baseSurvives  (carrier-ray) ................................. true
fiberSurvives (signed-fano-lift AND triangle-closure
               AND square-holonomy) .......................... false
decisionD1Triggered = NOT(baseSurvives AND fiberSurvives) ... true
```

Written source-state-real answer. Only the A3/S4 incidence base survives as instantiated source-state structure: each carrier ray maps bijectively to a complement axis, verified through the antipodal-covariance and complement-involution audits. The Fano-octonionic multiplicative fiber — signed lifts, triangle closure, square holonomy — and the ordered 12-flag identity have no representative in the existing tetra-G1 source state; the regime is defined one generation below the cuboctahedral hub where the medial-dual policy lives. Orientation sign and ordered-flag identity persist only as inert convention metadata (the source-state polarity is independently reconstructed, not transported from the Fano sign; `polarityActive = false`). The provenance bridges and the cube-primal-sourcehood boundary have no source-state home. The policy is therefore not source-state-real as itself: it collapses to its A3 base — precisely the H2 content the discriminator already judged "too weak."

## 4. Audit verdict (lieutenant): ACCEPT

Verified independently, not from implementer summary:

```txt
- all four diagnostics re-run by the auditor: the new one passes (integrity issues 0);
  the three of record pass (consumed modules unperturbed);
- scope clean: only package.json (one line) + two new files; no source/forbidden edits;
  tsconfig.tsbuildinfo (build-cache artifact) left unstaged;
- mock-solution test: safe by construction — per-object code names locator tiers and
  predicates only, never a bucket/channel literal; empty extractor evidence fails the run;
- count-vs-structure test: orientation-sign demotes the reconstructed starSign
  ({+,-} sign-sets defeat forcing); carrier-ray verified through the covariance audit
  with the algebraic ray label kept separate; arity and S4-vs-Fano-gauge guards hold;
- twelve derived cells match the auditor's withheld baseline; deltas from the auditor's
  first provisional guesses are strictly more honest and were investigated, not erased.
```

The implementer/auditor separation held: Claude Code implemented, the lieutenant audited.

## 5. Mothership verification

Performed independently before ratification:

```txt
- diagnostic re-run by mothership: matrix reproduced exactly; integrity issue count 0;
- commit 5625d10 scope confirmed: two new files plus one package.json line only;
- zero per-object bucket literals confirmed in code; buckets reachable only through
  locator-tier outcomes (tier-to-bucket law table is the single mapping site);
- carrier-ray cell derivation confirmed: full 3-way ray<->axis bijection verified
  through both antipodalCovarianceAudit and complementInvolutionAudit, with the
  algebraic e_k label recorded separately and a Gate C.5 visibility cap applied
  (structural-channel witness only under the declared multi-projection basis);
- baseline deltas examined: movement toward blocked-unresolved is more honest, not
  laxer — lost-in-tuple-reduction and provenance-only presuppose the object entered
  the regime; these objects never enter source state at all. That those two buckets
  are empty is itself a finding: nothing got far enough to be lost.
```

Headline finding now on the campaign books:

```txt
The accepted source-state regime can only see H2-level content.
Everything that made H3 discriminating is invisible to it.
The Gate C.4 shadow has sharpened: structure does not even reach
source state, let alone survive propagation.
```

## 6. Decision D1 — triggered, escalated, resolved by mothership and human

Per the campaign plan, most of the carrier structure — and in particular the entire distinguishing Fano fiber — is orphaned outside source state. The diagnostic flagged the trigger and reserved the decision. The lieutenant recommended path (a) and did not self-resolve.

Resolution (mothership + human, 2026-06-11):

```txt
Decision D1 = (a), with deferred execution.

The scoped source-state schema-lift branch is DECIDED now and EXECUTED
immediately after Station II closes, so the lift is designed once against
the portability table rather than guessed twice.
```

REVISION (human, sovereign, 2026-06-11, same day, before any Station II work
began): deferred execution is rescinded. D1 path (a) executes IMMEDIATELY as
the next branch. Design input is the Station I survival matrix itself — its
per-object locator-failure bases specify exactly which slots are missing.
Station II is re-sequenced to follow the lift (see the amended Station II
entry order and the D1 lift entry order). The binding constraints below are
unchanged.

```txt
Binding constraints on the lift branch:
  - a new hub-layer (cuboctahedral / 12-flag) source-state capsule is added
    ALONGSIDE the tetra-G1 capsule; the existing capsule is never mutated;
  - Gate C.5 multi-projection honesty and reduction statuses are preserved;
  - no FieldCueV0 changes, no UI, frozen list unchanged;
  - the lift runs as its own narrow branch under fresh mothership authorization.

Station II entry and Station III entry are conditional on the lift being complete.
```

## 7. Hard-problems registry status

```txt
cube primal sourcehood          → still open. Classified blocked-unresolved by the
                                  diagnostic via the upstream not-solved declaration.
                                  Formal status remains due at Station II.
survival through propagation    → the Gate C.4 shadow is now partly answered for the
  (the Gate C.4 shadow)           carrier policy: structure existing upstream does NOT
                                  mean structure surviving downstream — the fiber does
                                  not reach source state at all. Full propagation status
                                  remains due at Station IV.
deeper-generation bracketing    → untouched here; status due at Station III.
```

## 8. What this means for the midterm verdict

This is evidence, not a verdict. It points toward the carrier policy being hub-local rather than foundational in its current form: its distinctive content does not survive into the accepted source-state regime. Whether that becomes Verdict B (bounded local law) or is rescued toward Verdict A depends on the D1 lift and on Stations II–IV. No verdict (A/B/C) is declared by this memo.

## 9. Station I exit checklist

```txt
[x] survival-audit diagnostic exists, passes, and is honest
[x] every carrier datum classified (12/12, two axes)
[x] source-state-real question answered in writing
[x] Decision D1 triggered → escalated, not self-resolved
[x] closing memo drafted for mothership ratification
[x] mothership independent verification performed
[x] Decision D1 resolved: (a) with deferred execution
```

Standing prohibitions honored: no S0; no topology workspace; no packet writing; no Shape mutation; no operation registration; no new route/gate/support/region feature families; no general algebra infrastructure; no field atlas replacement; no UI; the structured-source-state regime was not amended.

## 10. Ratification

```txt
Lieutenant (prompter/planner/auditor): Station I work complete and audited; submitted.
Mothership: [X] ratify Station I closure   [ ] return with changes.
Decision D1: [X] (a) immediately (revised same day from (a)-after-Station-II)
             [ ] (b) recorded boundary.
Human (Arman): selected (a)-after-Station-II, then revised to (a)-immediately
               before any Station II work began; commits this memo to
               docs/governance/ on branch Claude-child.
```

Station I is closed. The next campaign document is the Station II entry order.
