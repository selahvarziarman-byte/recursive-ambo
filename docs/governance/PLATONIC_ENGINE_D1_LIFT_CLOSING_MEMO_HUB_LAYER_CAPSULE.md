# PlatonicEngine D1 Lift Closing Memo
## Hub-Layer Source-State Capsule V0 — Decision D1 Resolved (Path a)

Audience: mothership (ratifying authority) and the human (Arman, sovereign).

Status: drafted by the prompter/planner/auditor (lieutenant); ratified by mothership 2026-06-11. Not a Claude Code prompt, not a campaign-plan amendment. It closes the Decision-D1 path-(a) schema-lift authorized by `PLATONIC_ENGINE_D1_LIFT_ENTRY_ORDER_HUB_LAYER_SOURCE_STATE_CAPSULE.md`.

Drafted: 2026-06-11. Ratified: 2026-06-11.

Repo state anchor at drafting:

```txt
branch: Claude-child  (pushed to origin/Claude-child)
8be7874 Add D1-lift versioned survival re-audit (v1) over extended regime   (tip)
3f86c9b Add D1-lift hub-layer source-state capsule diagnostic
5bb871b station 1 closure
5625d10 Add Station I medial-carrier source-state survival audit diagnostic

D1-lift artifacts (committed):
  src/lib/hubLayerSourceStateCapsuleV0.ts
  scripts/diagnose-hub-layer-source-state-capsule-v0.cjs
  src/lib/medialCarrierSourceStateSurvivalAuditV1.ts
  scripts/diagnose-medial-carrier-source-state-survival-audit-v1.cjs

Known cleanup item (does not affect substance):
  package.json npm-script lines for the two new diagnostics are NOT yet committed
  (a package.json truncate-then-restore-from-HEAD cycle ate the staged lines across
  both commits). All four diagnostics run via `node scripts/<name>.cjs`. A one-line
  follow-up commit should register both scripts.
```

## 1. The lift question (restated)

Station I found the medial-dual carrier policy's distinguishing fiber orphaned: only the A3 base (`carrier-ray`) was source-state-real; the Fano-octonionic multiplicative fiber — signed lifts, triangle closure, square holonomy — had no representative in the tetra-G1 regime, so `fiberSurvives=false` and Decision D1 triggered. The human revised D1 to immediate path-(a) execution: extend the regime with a hub-layer (cuboctahedral / 12-flag) source-state capsule, alongside the frozen tetra-G1 capsule, in which the fiber could instantiate honestly — or, if it could not, report that as the high-value finding. This was an extension test, not a rescue.

## 2. What was built (3 runs + this memo, exactly to budget)

```txt
Run 1  plan (lieutenant), ratified with three binding sharpenings.
Run 2  hub-layer capsule: src/lib/hubLayerSourceStateCapsuleV0.ts (+ diagnostic).
       Instantiates 12 ordered flag states, signed lifts as transported facts,
       6 flag-granularity antipodal axes, 8 triangle-closure and 6 square-holonomy
       relations, a declared gauge meta-property, 3 provenance routes, and the
       cube-primal-sourcehood open boundary — every relation RECOMPUTED from the
       capsule's own 4 primal atoms via a capsule-local Fano product, then
       cross-checked against upstream; every record carrying a Gate C.5 status;
       nothing field-active.  (commit 3f86c9b)
Run 3  versioned re-audit: src/lib/medialCarrierSourceStateSurvivalAuditV1.ts
       (+ diagnostic). Re-derives the twelve cells over the extended region set
       {sss, mp, hub}; v0 left byte-for-byte frozen.  (commit 8be7874)
```

## 3. Result — the v0 → v1 delta (post-lift)

```txt
object                                  v0 (Station I)        ->  v1 (post-lift)
a3-medial-flag-token                    blocked-unresolved   ->  structured-source-state
ordered-flag-identity                   metadata-only        ->  structured-source-state
signed-fano-lift                        blocked-unresolved   ->  structured-source-state
carrier-ray                             structured-source-state  (unchanged)
orientation-sign                        metadata-only        ->  structured-source-state
triangle-closure-relation               blocked-unresolved   ->  structured-source-state
square-holonomy-relation                blocked-unresolved   ->  structured-source-state
complete-quadrangle-gauge-robustness    blocked-unresolved   ->  metadata-only
tetra-g2-core-provenance                blocked-unresolved   ->  provenance-only
octa-g1-provenance                      blocked-unresolved   ->  provenance-only
cube-g1-provenance                      blocked-unresolved   ->  provenance-only
cube-primal-sourcehood-boundary         blocked-unresolved   ->  provenance-only

11/12 cells changed; every change attributed to a winning representative in the new
hub region, NOT to any change in the tetra-G1 regime (v0 still reports its frozen
1/2/9). Buckets: structured-source-state 1->7; metadata-only 2->1; provenance-only
0->4; blocked-unresolved 9->0.

baseSurvives  = true
fiberSurvives = true        (signed-fano-lift AND triangle-closure AND square-holonomy)
decisionD1Triggered = false
```

Decision D1 is resolved. The Fano-octonionic multiplicative fiber instantiates as honest source-state structure once the regime is built to the cuboctahedral layer where the policy lives. The fiber was orphaned at Station I not because it is unreal, but because the structured-source-state regime had been defined one generation below the hub.

## 4. The binding pre-caveat (survives this memo regardless)

The fiber is source-state-real as structure only. Every hub-capsule record carries Gate C.5 status `source-state-only` and reduction status `tuple-projection-lost`; nothing is field-active. The emitted-tuple law is intact: source signature = structured source state; emitted tuple = field-facing reduction, which still loses the fiber. Field-activity is Station IV territory and is not claimed here. "D1 resolved" means the fiber instantiates as source-state structure, not that it survives propagation or is field-active.

## 5. Hard-problems registry — cube primal sourcehood (NOT solved by this lift)

This entry is binding and must not be read away.

```txt
PROBLEM:  cube primal sourcehood (8 cube vertices vs 7 octonion imaginary units).
STATUS:   OPEN. Not solved by the D1 lift.
CARRIED AS: a declared open-boundary provenance record in the hub capsule
            (boundaryStatus = 'declared-open-boundary-not-absorbed'); the v1
            re-audit therefore classifies it provenance-only, not orphaned.
CAUTION:  the v1 headline "0 orphaned" includes this object. The bucket label
            (provenance-only) reflects that it now has a documented representative
            in the regime; it does NOT reflect resolution. The underlying carrier-
            assignment problem is untouched.
DUE:      formal status at Station II (per the campaign-plan hard-problems registry).
```

Also still travelling with the campaign: deeper-generation bracketing law (status due Station III); survival through propagation / the Gate C.4 shadow (Station IV) — the lift establishes source-state instantiation, not propagation survival.

## 6. Audit verdict (lieutenant): ACCEPT

Verified independently, not from implementer summary:

```txt
- all diagnostics re-run by the auditor via node: v1 passes (integrity 0,
  baseline-identity-verified); the hub capsule passes; v0 still reports its frozen
  1/2/9 with D1 true (unperturbed); discriminator / model card / multi-projection pass.
- recompute-not-echo (Run 2 guard, carried into Run 3): the capsule re-derives every
  flag lift from 4 primal atoms via its own Fano product; closure/holonomy/antipodality
  recomputed (48/48, 48/48, 12/12 agreement) then cross-checked - not echoed. v1 admits
  a hub representative only when the capsule's own verification status passes.
- baseline-identity assertion (sharpening 2): v1's live v0 baseline identity-checks
  against the ratified Station I twelve cells + aggregates; holds exactly.
- reachability annotation (sharpening 3): all 11 changed cells annotated as reachable
  only via the added capsule region, the tetra-G1 regime unchanged.
- one corrective iteration disclosed by the implementer (gauge meta -> metadata-only,
  not structured-source-state; triangle/square key patterns narrowed; navigation
  records preferred at equal tier) - all conservative / citation-precision; verified.
- scope clean: only the four new diagnostic files (plus the pending package.json
  script lines); the tetra-G1 capsule, the frozen v0 audit, and the consumed carrier
  modules untouched.
```

Implementer/auditor separation held throughout: Claude Code implemented, the lieutenant audited.

## 7. Mothership verification

Performed independently before ratification:

```txt
- commit scope confirmed: 3f86c9b and 8be7874 each touch exactly their two new
  files; nothing else;
- package.json incident bounded: the two new script lines are absent as disclosed,
  and all 59 pre-existing diagnose: lines survived intact — nothing else was eaten;
- frozen v0 re-run: still reports the ratified 1/2/9 matrix, fiberSurvives=false,
  decisionD1Triggered=true, integrity 0 — Station I evidence unperturbed;
- v1 re-run: baseline-identity-verified; buckets 7/1/4/0; fiberSurvives=true;
  decisionD1Triggered=false; integrity 0; all 11 deltas carry the capsule-region
  reachability annotation;
- hub capsule re-run: integrity 0; reduction-law declaration explicitly enumerates
  what the scalar tuple still loses (the pre-caveat lives in code, not only here);
- recompute-not-echo verified in source: recomputedSignedLift / recomputedProduct /
  recomputedClosureStatus / recomputedHolonomyStatus fields present; zero hard-coded
  pass literals in the capsule.
```

Headline finding for the campaign books:

```txt
The Station I orphaning was a regime-depth problem, not a fiber-reality problem.
Built to the hub layer, the fiber instantiates as honest source-state structure —
still tuple-projection-lost, still not field-active, still untested in propagation.
```

## 8. What this means for the campaign

This is evidence, not a verdict. The medial-dual policy's distinguishing fiber is now demonstrably source-state-realizable (as structure) in a purpose-built hub-layer capsule. That removes the Station-I orphaning as a blocker, but it does not by itself decide the midterm verdict: the fiber is not yet shown to survive propagation (Station IV) or to help read generated sites, and cube primal sourcehood remains open (Station II). No Verdict A/B/C is declared by this memo.

## 9. Sequencing after the lift

```txt
D1 lift closed (this memo, ratified)
-> Station II takes effect: portability model, consuming the post-lift v1 re-audit;
   cube-primal-sourcehood status and the D2 second-instance recommendation due there.
-> Station III entry conditional on the D2 decision.
```

Standing prohibitions honored: tetra-G1 capsule and v0 audit frozen; the regime was EXTENDED with a capsule alongside, never amended in place; no FieldCueV0 / GeneratedSiteReading / UI / Shape mutation / packet writing; nothing field-active; no universal-law naming (hub-layer capsule, not a general field schema); frozen list intact.

## 10. Ratification

```txt
Lieutenant (prompter/planner/auditor): D1-lift Runs 1-3 complete and audited ACCEPT; submitted.
Mothership: [X] ratify D1-lift closure   [ ] return with changes.
Ratification condition: the section-5 cube-sourcehood caution travels with any
  downstream consumption of the v1 "0 orphaned" headline; Station II must cite it.
Cleanup (human, native): one follow-up commit registering both npm-script lines
  in package.json.
Human (Arman): commits this memo to docs/governance/ on branch Claude-child.
```

D1 lift is closed. Station II (portability model) takes effect per its amended entry order.
