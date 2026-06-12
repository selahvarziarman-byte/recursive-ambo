# PlatonicEngine Station IV-A Closing Memo

## Propagation / field-activity survival — the fiber's field role, derived under observable-only blinding

Audience: mothership (ratifying authority) and the human (Arman, sovereign).

Status: **lieutenant-authored closing memo, drafted for mothership ratification.** It reports the IV-A Run 2 diagnostic (`propagationFieldActivitySurvivalAuditV0`), the lieutenant's independent audit, the sealed-prediction reveal verified against the committed hash, the relation×basis matrix with auditor-derived Gate-C.5 statuses, the filled anomaly ledger, and the formal hard-problems registry entry for "survival through propagation." IV-A is diagnostic-only; no verdict is self-resolved.

Drafted: 2026-06-11. Branch `Claude-child`. Entry anchor `513b1a2`; sealed-prediction hash committed before Run 2 (`077201b`/`984a4db`). Run under the Station IV entry order and its five audit sharpenings.

---

## 1. The IV-A question, and why blinding was decisive

For each fiber relation now source-state-real at the hub layer (signed Fano lift, triangle closure, square holonomy, ordered flag identity, orientation sign, carrier-ray/antipodal axis) and the provenance routes: **which Gate-C.5 field-facing visibility status does it attain — DERIVED from propagated/projected field data, never asserted from source state?**

The decisive design element was mothership's sharpening 1, **observable-only blinding**. F2 retains carrier state on contribution rows by design and F1's node/edge rows carry carrier-state fields as data. An unblinded recovery would have hit ≈1.0 by reading those columns — propagation survival "confirmed" by database lookup. The run strips carrier-state, root-identity, sign, flag-id, and lift columns from everything the recovery side sees, in every basis, and proves it (closed blinded-view types + a recursive leak scan). The recovery works from field-facing observables only: positions, support values, complex coefficients, activation magnitudes, anonymized adjacency.

---

## 2. Independent audit (not from the implementer's summary)

```txt
- Re-ran scripts/diagnose-propagation-field-activity-survival-audit-v0.cjs via node:
  EXIT 0, "Diagnostic assertions passed.", integrity issues: 0. Every raw number below
  reproduced under the auditor's run (r-t-axis 6/6, r-t-flag 0/6, r-t-ori-nonzero 8/8 /
  g 4/8, r-field-tuple 0.3333, G0 residual 1.11e-16).
- Blinding verified IN CODE, not just in output:
  * imports are F1/F2/G0 + the Pythagorean emission regime + seeds/ambo/fieldSampler ONLY.
    structuredSourceStateMultiProjection / hubLayerSourceStateCapsule / medialCarrier*
    appear only as STRINGS in the not-consumed list and strip-list — never imported.
    Basis-S genuinely recomputes from F1/F2 field data; the source-state reports are not
    consumed (consuming one is this station's mock-solution failure — structurally avoided).
  * BlindedSView/RView/DView are CLOSED interfaces carrying only field observables; no
    carrier field exists on the type the recovery functions receive — a lookup is
    impossible by construction.
  * runLeakScan is a real recursive walk: 11 regex patterns (signed-lift, bare-unit e1-7,
    carrier/signed/lift/fano/slot words, M_xx child tokens, single-letter slots) + 40
    stripped key-names over every string value and object key. Hits: 0 in all three bases
    (one declared, printed exemption: the Basis-D sealed-transform name list itself).
- recompute-not-echo held: Basis-R recomputes emitted tuples from the regime atoms + seed/
  ambo positions + the legacy fieldSampler kernel; Basis-S from F1 activations + F2 supports.
- controls genuine: structured payload-permutation K=64 and strict all-control K=64 per
  measurement, full {mean,p95,max} printed beside every real value; r and g separated throughout.
- scope: native git status shows only the two new files (+ the committed hash file). Sandbox
  mount shows the known spurious M files (mount/native divergence); scope-clean confirmation
  is Arman's native check, recorded as such.
- substrate diagnostics (F1/F2/G0/discriminator) re-run unperturbed; tsc --noEmit exit 0.
```

Audit verdict: **ACCEPT** the run as a valid, reproducible, genuinely-blinded computes-and-reports. The honesty machinery is real and load-bearing.

---

## 3. Sealed predictions — revealed and reconciled

The sealed text is revealed in full at the end of this memo (§A). Verify by re-hashing the
original file `IV_A_SEALED_PREDICTIONS.txt` against the pre-Run-2 committed value:
`SHA-256 = 3C846500…A0A562` (LF) or `72B11056…03BDC8` (CRLF).

```txt
RECONCILIATION (own it plainly):
  My headline predicted a BASIS-RELATIVE SPLIT: structural-channel-visible under Basis-S,
  lost under Basis-R. The truth: lost under BOTH. The entire Basis-S column was WRONG, in
  the false-positive direction. The "structural-channel-visibility" I predicted existed only
  in the stored carrier columns; observable-only blinding (sharpening 1) stripped them and it
  collapsed to tuple-projection-lost / unsupported.

  HITS:   cube-primal-sourcehood-boundary = unsupported. Basis-R losses (lift, flag) = lost.
          "antipodal-axis is the strongest" — directionally right (it alone has any field
          reach), though only as unsigned geometry, not as a carrier relation.
  MISSES: every Basis-S "structural-channel-visible" (7 cells). orientation-sign Basis-R
          predicted "misleading"; actually at-chance/lost (random, not systematically flipped).
  I pre-declared I expected >= 1 wrong cell; I was wrong on a whole column. The per-cell
  sealing localizes it exactly, and the direction (toward false-positive field-activity) is
  the precise failure sharpening 1 was built to catch. Without it this station passes by SQL.
```

---

## 4. Relation × basis matrix — auditor-derived Gate-C.5 statuses

Statuses derived by applying the hash-committed total decision rule to the raw numbers. The
implementer assigned none.

```txt
relation                    Basis-S            Basis-R            Basis-D (sealed transform)
signed-fano-lift            tuple-projection-  tuple-projection-  tuple-projection-lost
                            lost (observable   lost               (T_lift inapplicable:
                            absent)                               unit-vector not emitted)
triangle-closure            tuple-projection-lost (dependency T_lift absent — all bases)
square-holonomy             tuple-projection-lost (dependency T_lift absent — all bases)
ordered-flag-identity       tuple-projection-  tuple-projection-  tuple-projection-lost
                            lost               lost               (T_flag 0/6 exact, r-c=0)
orientation-sign            tuple-projection-  tuple-projection-  tuple-projection-lost
                            lost               lost               (T_ori sign g=0.50 = chance;
                                                                  r-nonzero meaningless, ctrl=1.0)
carrier-ray/antipodal-axis  source-state-only  misleading-if-     depropagation-recoverable
                            (field-phase r-c   read-as-raw-field  as UNSIGNED GEOMETRY only
                            =0.099 ~ chance)   (r-c=0.16, g=0.0   (T_axis 6/6, ctrl 0.18;
                                               systematic flip)   g null — carrier sign NOT borne)
provenance: tetra-G2-core   unsupported (no G2 field instantiation in the accepted stack)
provenance: octa-G1         unsupported (blocked-until-octa-field-stack)
provenance: cube-G1-dual    unsupported (dual-provenance-only, carried verbatim)
cube-primal-sourcehood      unsupported (dual-provenance-only)
G0-identity cell            no-field-activity-claim (identity holds 1e-16; phase-opp 2/3 mixed;
                            aggregate identity can cancel the sign — exploratory, ledgered)
```

**Derived headline: under observable-only blinding, NO fiber relation survives propagation as a carrier relation.** Every carrier-fiber datum is tuple-projection-lost (its defining observable is not field-emitted) or unsupported (no field instantiation). The fiber is source-state-real (D1/D3) and **field-inactive**.

---

## 5. The one partial reach, stated precisely (carrier-ray/antipodal-axis)

```txt
T_axis recovers the antipodal PAIRING 6/6 from positions alone, beating both controls
(structured 0.18, strict 0.19) — the structured control permutes the truth labels, so a real
6/6 against ~chance is a genuine geometric signal. BUT:
  - it is the UNSIGNED axis: which two sites are negatives of each other. That is GEOMETRY
    (the octahedron's vertices come in +/- position pairs), not the carrier fiber.
  - the carrier CONTENT of the relation is the SIGNED antipodality (lift negation across the
    pair). Its sign is at chance under Basis-S (g moot, r at chance) and SYSTEMATICALLY WRONG
    under Basis-R (g=0.0 vs control 0.49) — misleading-if-read-as-raw-field.
  - the sealed rule requires g >= 0.90 for depropagation-recoverable; T_axis has null g, so as
    a CARRIER relation it does NOT clear. Recorded honestly: geometry yes, carrier no.
So even the strongest relation carries no carrier information into the field; only its shadow
(the unsigned spatial pairing) and typed topology (adjacency) survive — and both are EXPOSED
channels (controls = real by construction), not propagation signals.
```

---

## 6. Anomaly ledger — derivation statuses filled (14 rows)

```txt
01 unit-vector-inventory      DERIVED (root cause): field emits ONE complex coefficient per
                              contribution, not a 7-unit vector; the lift datum is not field-
                              borne -> tuple-projection-lost for lift + closure + holonomy.
02 matching-tie basis-s-axis  DERIVED: the field-phase objective is degenerate (matchings tie)
                              -> the phase channel does not discriminate antipodal pairs;
                              consistent with source-state-only. Deterministic tiebreak, benign.
03 adjacency-exposure s-axis  DERIVED: r-adjacency=1.0 with control=real is TYPED-TOPOLOGY
                              exposure (edge family survived as structural type), not carrier
                              recovery. Correctly not counted as field-activity.
04 t-flag-census              DERIVED: centered anchors != u_i - u_j at 1e-9 for 6/6; the flag
                              ORDER is not reconstructable from positions -> tuple-projection-lost.
05 adjacency-exposure birth   DERIVED: birth-parent-pair adjacency is typed topology, control=
                              real; exposure, not provenance-carrier signal.
06 g0-exploratory             DERIVED: identity holds (1e-16); phase-opp 2/3 mixed; aggregate
                              identity can cancel sign -> no field-activity claim. Inconclusive.
07 sign-count-split s-axis    DERIVED: r-adjacency 1.0 (topology) vs g 0.667; carrier sign partial
                              -> source-state-only for the carrier content.
08 control-overlap s-axis(adj)DERIVED: adjacency exposure, control=real -> overlap expected;
                              confirms not-a-signal.
09 control-overlap s-axis(phase)DERIVED: field-phase at chance -> source-state-only.
10 sign-count-split r-axis     DERIVED: r-tuple 0.333 with g 0.0 -> above-chance pairing with
                              INVERTED sign = misleading-if-read-as-raw-field.
11 control-overlap r-axis      DERIVED: tuple pairing within control band; with g=0 -> misleading.
12 control-overlap flag d      DERIVED: T_flag at floor (0/6) -> tuple-projection-lost.
13 sign-count-split ori d      DERIVED: r-nonzero 1.0 meaningless (control=1.0); g=0.50=chance
                              -> orientation sign not field-borne -> tuple-projection-lost.
14 control-overlap prov s       DERIVED: birth adjacency at p95, control=real -> topology exposure,
                              not a provenance-carrier signal.
```

Every row resolves to one theme: the only high recoveries are geometry/topology **exposures** (controls = real); every genuine carrier datum is at chance or observable-absent.

---

## 7. Hard-problems registry — formal status

```txt
SURVIVAL THROUGH PROPAGATION  (status DUE at IV-A; the project's oldest open wound):

  RESOLVED -> NEGATIVE. The medial-dual carrier fiber does NOT survive into field-facing
  witness. Under observable-only blinding, every carrier-fiber relation is tuple-projection-
  lost (defining observable not field-emitted) or unsupported (no field instantiation). The
  fiber is source-state-real structure (D1 lift, D3) that is field-INACTIVE. Only geometry
  (unsigned antipodal pairing) and typed topology (adjacency) are field-recoverable, and both
  are exposed channels, not the carrier fiber. The Gate C.4 failure mode is confirmed, cleanly,
  at the hub: structure real upstream, lost in propagation.

  This is Verdict-B material for the FIBER'S FIELD ROLE — recorded, not papered over. Per the
  entry order, a clean negative is a SUCCESSFUL IV-A outcome.

CUBE PRIMAL SOURCEHOOD     unchanged: boundary, dual-provenance-only wording preserved; no field
                          content; no 8-vs-7 work done.
DEEPER-GENERATION BRACKET  untouched: IV-A is first-birth (G0->G1) only.
```

---

## 8. What this means — for IV-B and for the campaign

```txt
FOR IV-B: reshaped, not cancelled. Since NO relation is field-active, FieldCueV0 may present
  ONLY source-state structure with honest statuses visibly attached ("source-state-only",
  "tuple-projection-lost"); it may claim field-activity for nothing. The D4 human-fruit test
  becomes precisely: does an HONEST source-state reading (structure shown, statuses visible,
  no field-activity overclaim) make the six generated sites more legible than the pre-campaign
  scalar reading? That is a real, fair question — and the honest framing the project demanded.

FOR THE CAMPAIGN (composite, for mothership's deliberation — not self-resolved):
  - As STRUCTURE / SOURCE STATE: the medial-dual carrier policy is real and GENERALIZES
    (D3, Verdict-A direction). That stands.
  - As FIELD ACTIVITY: it does NOT survive propagation (this memo, Verdict-B for the field role).
  The composite the evidence now supports: a real, generalizable SOURCE-STATE architecture that
  is not field-active. Whether the final verdict reads A (if honest source-state reading improves
  legibility at D4) or B (if it does not) now hinges on D4 — exactly where the campaign plan
  places the human's judgment.
```

---

## 9. Ratification

```txt
Lieutenant (prompter/planner/auditor): IV-A Run 2 complete and audited ACCEPT (re-run,
  integrity 0, blinding verified genuine in code); matrix derived against the hash-committed
  rule; sealed predictions revealed and reconciled (Basis-S column wrong, owned); registry
  entry: survival through propagation = NEGATIVE. Submitted.
Mothership: [X] ratify IV-A closure and the NEGATIVE propagation status
            [X] confirm the sealed text verifies against the committed hash
                (hash file 077201b/984a4db predates the run; reveal reconciles)
Human (Arman): confirm native `git status` = only the two new audit files; commit them and
  this memo to docs/governance/ on Claude-child; the sealed file is revealed with this memo.
On ratification, IV-B is authorized (honest source-state reading only) and the lieutenant
  prepares the D4 sitting — the human, not a diagnostic, judges.
```

---

## A. Revealed sealed predictions (verify against the committed hash)

The full pre-registered text follows verbatim; hash-verify the original `IV_A_SEALED_PREDICTIONS.txt`
(presented alongside this memo) against the committed `3C846500…A0A562` (LF) / `72B11056…03BDC8` (CRLF).

The per-cell predictions, the total decision rule, and the headline are reproduced in §3–§4 of
this memo and in the sealed file. The operative reconciliation: predicted Basis-S = structural-
channel-visible across the core relations; derived Basis-S = tuple-projection-lost / unsupported.
The prediction failed in the false-positive direction; observable-only blinding converted the
false positive into the true negative.
```

---

## B. Mothership ratification addendum (2026-06-11)

### B.1 Independent verification

```txt
- diagnostic re-run by mothership: exit 0, integrity 0; raw numbers reproduce
  (G0 residual 1.11e-16; T_axis 6/6 vs controls 0.18/0.19; T_flag 0/6;
  orientation g=0.50 = chance; basis-R sign systematically flipped);
- blinding verified in source by mothership: imports = F1/F2/G0 + emission
  regime + seeds/ambo/fieldSampler ONLY; source-state reports appear only as
  strings in the not-consumed/strip lists; blinded view types closed; leak
  scan walked 7,521 keys / 2,522 strings with 11 patterns, 0 hits, 0
  exemptions; leak hits void cells by code (not by promise);
- ledger row 01 is recorded as the CENTRAL FACT of the station: no basis
  exposes a per-site coefficient vector indexed over the seven imaginary
  units; each contribution emits ONE complex coefficient. The fiber's
  defining observables are not emitted — that, and nothing subtler, is why
  the fiber is field-inactive.
```

### B.2 Scope of the negative (binding wording)

```txt
The NEGATIVE is law-relative: under the ACCEPTED emission/projection stack
(F0 law as implemented in F1/F2/G0, with the scalar emission regime), the
medial-dual fiber is field-inactive. This does not assert that no richer
emission law could carry it; any such law would be a NEW candidate under a
NEW campaign, not a rescue of this one. Within this campaign, the answer
is final: source-state-real, field-inactive.
```

### B.3 Verdict-taxonomy notice (for closing deliberation; decided at closing, not here)

```txt
The evidence has outgrown the campaign plan's verdict taxonomy:
  Verdict A (as written) requires survival of tuple reduction — now formally
    NEGATIVE. Strict A is unreachable.
  Verdict B (as written) says "provably hub-local" — but D3 proved the
    policy GENERAL at carrier/source-state level. Strict B understates.
The closing verdict must therefore be stated as the precise composite the
evidence supports — a generalizable source-state carrier law that is
field-inactive under the accepted stack — with D4 determining whether it
carries human fruit. This notice is disclosure, not amendment: no verdict
language is softened, and the composite claims LESS than A and MORE than B
only where evidence compels each direction. Deliberated at campaign close
by human + mothership.
```

### B.4 IV-B authorization (reshaped by the negative)

```txt
IV-B proceeds as: honest source-state reading ONLY.
  - FieldCueV0 / GeneratedSiteReadingV0 consume hub-capsule structure with
    source-state-only / unsupported statuses VISIBLE; nothing field-active;
  - the misleading-if-read-as-raw-field finding is SURFACED as a warning in
    readings: raw-field sign reading at the hub is systematically wrong —
    telling the human what NOT to trust is part of legibility;
  - D4 then asks the reshaped question: does an honest source-state reading,
    statuses visible and nothing overclaimed, still make the six sites more
    legible than the pre-campaign baseline? The human judges.
```

IV-A is closed. The registry entry "survival through propagation" reads: NEGATIVE (resolved, law-relative per B.2).
