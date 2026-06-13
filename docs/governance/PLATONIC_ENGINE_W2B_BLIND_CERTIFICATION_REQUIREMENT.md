# PlatonicEngine — W-2.B Blind Certification Requirement

## The researcher's blind-safe build requirement for the lieutenant/prompter to hand the coder

Audience: the prompter/planner/auditor (lieutenant), who turns this into the coder's prompt and owns the gate, the blind build, and the commit. For mothership (verdict authority) and the human (Arman, sovereign).

Status: **researcher-authored build requirement. Blind-safe — contains NO sealed values.** The researcher holds the sealed predictions and therefore does NOT build, run, certify, or commit this battery. The lieutenant prompts the coder; the coder builds it BLIND to the seal; the auditor derives the per-criterion verdict at W-2.C; mothership disposes the terminal verdict.

Repo identity (mandatory preamble): canonical `C:\Dev\202cl\PlatonicEngine202`, branch **`team-arman`**; competitor `wgate/arf-w1-root-frame-v0` and any `arf*` = READ-ONLY; decoy `C:\Dev\PlatonicEngine` = not this project. Gate (path+branch+HEAD; branch MUST be team-arman) before any action — the coder's responsibility, enforced by the lieutenant.

Issued: 2026-06-13. Inputs: W-2.A model card (`PLATONIC_ENGINE_W2A_MODEL_CARD_FIELD_REDUCTION.md`); mothership audit (`PLATONIC_ENGINE_W2A_MODEL_CARD_MOTHERSHIP_AUDIT.md`, conditions C1–C5); sealed-prediction hash (`PLATONIC_ENGINE_W2A_SEALED_PREDICTION_HASH.txt`, SHA-256 LF `81cfc7b3…db03`; plaintext OFF-REPO). Authorization: W-2.A AUDITED-PASS, W-2.B build authorized under C1–C5.

---

## 0. The blinding boundary (binding)

```txt
- The sealed prediction PLAINTEXT is OFF-REPO. The coder works in the repo and is therefore BLIND
  BY CONSTRUCTION. Do NOT fetch, paste, regenerate, or reconstruct the seal for the build.
- Rider A: the scorer hard-codes NO expected value (no recovery rate, no obstruction count, no
  residual size, no margin, no verdict). Every quantity is COMPUTED-AND-REPORTED.
- Rider B: this requirement is the DESIGN; the coder's build is the CERTIFICATION; different hands.
  Frozen one-shot; counts toward the charter N=3; a 4th run is the drift signature -> escalate.
- The researcher (seal-holder) does not build/run/certify. The seal is revealed only at W-2.C.
```

---

## 1. Object

```txt
Certify whether the W-2.A reduction R* (the Z2 / sign loop-holonomy field) lets a LABEL-BLIND
observer RECOVER OR MEDIATE the W-1 prize — the gauge-equivariant selected Re on the 280 off-Q
(birth-edge) bracketing-dependent loops of the G1 (10-node) carrier graph — beating ALL controls
including the bare-geometry control, sign included, without label leakage. Report measured values;
declare no terminal verdict.
```

---

## 2. Construction to build (from the model card — build it, do not invent it)

```txt
- Rebuild the G1 carrier graph from the REAL Ambo (src/data/seeds.ts, src/lib/ambo.ts), parentage
  via createdBy.sourceVertexIds; the same Fano product law used across the repo (recompute, not echo).
- Build R*: a 1-cochain on the closed G1 geometry — an edge transport derived from the source-state's
  LABEL-FREE loop/antipodal structure; emit the edge transports + the loop-holonomies O(L) ONLY.
- VISIBLE-FIELD MANIFEST (enforce): emit transports + O(L) only. NEVER emit a carrier unit, signed
  lift, root identity, flag id, provenance token, or any per-source coefficient. Enforce with CLOSED
  blinded-view types + a recursive leak scan (11+ patterns over every string/key), ZERO exemptions;
  a leak hit VOIDS the affected cell by code.
```

---

## 3. The battery

```txt
3.1 Rec(O): recover the prize per loop from O(L) (labels stripped). Score r (incidence) and g
    (sign/orientation) SEPARATELY. g >= 0.90 is REQUIRED to count as field (unsigned geometry is
    not the field — the W_0/orientation lesson).
3.2 CONTROL LADDER: trivial-null, structured-permutation, strict, and BARE-GEOMETRY. The
    bare-geometry control gives a label-blind observer ONLY positions + adjacency and the strongest
    geometric features (node-type by radius, visit counts/parities, oriented area/chirality, distance
    multisets). [C3] It MUST use the IDENTICAL recovery procedure and IDENTICAL supervision regime as
    Rec(O); the ONLY permitted difference is the INPUT (field observables vs bare geometry). Neither
    rung may fit harder than the other.
3.3 ABELIAN-REPRESENTABILITY: compute whether the selected Re is the holonomy of ANY Z2/U(1) field —
    i.e. whether the GF(2) system [loop-edge incidence | Re-bits] is CONSISTENT. Report solvable/
    not and the obstruction dimension. (Decidable, blind-computable; no expected value.)
3.4 RESIDUAL: measure the loops recovered by NEITHER the bare-geometry control NOR R*; report size
    and signature.
3.5 BRANCH-SELECTION sweep: run Rec(O) AND the bare-geometry control for each Hole #2 branch
    (B-walk / B-gen / B-frame) separately; report whether any single branch is uniquely
    field-recoverable (beating bare geometry) while the others are degenerate.
3.6 [C1] TRANSPORT-DERIVATION DESTRUCTIVE TEST: strip/scramble the carriers and RECOMPUTE the edge
    transports. The transports MUST be UNCHANGED (they are label-free-derived). If they change when
    carriers are removed, they were carrier-derived — a definition-level staple — and the run VOIDS.
3.7 MOCK-SOLUTION: scramble the source-state; the recovery pattern MUST break; if it survives, VOID.
3.8 INTEGRITY: re-run deterministic, exit 0, "assertions passed"; leak scan zero exemptions; native
    git scope clean to the new diagnostic file; structural self-checks only (no target-matching path).
```

---

## 4. The five binding conditions (C1–C5), mapped

```txt
C1 transport-derivation destructive test -> §3.6 (MUST fire; VOID if transports move with carriers).
C2 the sealed NEGATIVE must have a REACHABLE falsifier -> the battery MUST measure the three
   quantities whose conjunction is PASS — (GF(2) CONSISTENT) AND (field g >= 0.90) AND (field beats
   bare-geometry by a margin) — so that, IF reality supported it, the blind run WOULD output PASS.
   The build does not know the predicted values; it just measures these so PASS is achievable.
   (At W-2.C mothership verifies the falsifier was real: a measurable run outcome that yields PASS.)
C3 symmetric information -> §3.2 (identical procedure + supervision regime; only the input differs;
   declare/seal the regime — both unsupervised, or both supervised with held-out cross-validation).
C4 maximality on record -> recorded in the model card §9 and to be repeated in the W-2.C close.
C5 standard inheritance -> seals off-repo; byte-preserved reveal; sovereign re-hashes NATIVELY at
   W-2.C (chronology AND byte-match); blind-in-code; Riders A/B; leak scan zero exemptions; one shot,
   counts toward N=3; all work on team-arman, arf* read-only; gate before every action.
```

---

## 5. Scoring and verdict (auditor + mothership; not the coder)

```txt
- The coder computes-and-reports raw values only and declares NO terminal verdict.
- AUDITOR (at W-2.C, against the THEN-REVEALED seal): a recovery the bare-geometry control ALSO
  achieves is NOT a field result, however high its raw score; the field must beat bare-geometry by
  the sealed margin, sign included (g >= 0.90).
- MOTHERSHIP terminal verdict: W-2 PASS (FIELD-OBSERVABLE — first field, scoped) / W-2 FAIL
  (FIELD-INACTIVE — boundary hardens) / VOID (staple/leak/tuning -> counts toward N, re-seal).
```

---

## 6. Output

```txt
A W-2.C-ready report: measured Rec(O) r and g; the full control ladder (mean/p95/max beside each
real value); GF(2) consistency + obstruction dimension; residual size/signature; the per-branch
sweep; the C1 destructive-test result (fired / transports-unchanged true|false); mock-solution;
integrity (re-run, exit, scope). Raw values only; the auditor derives status against the seal.
```

---

## 7. PROMPT REQUIREMENT for the lieutenant/prompter (what to ask the coder)

```txt
Lieutenant: brief a FRESH repo-bound coder (blind by construction — the seal is off-repo) with:

  1. GATE FIRST. Run path+branch+HEAD; confirm `git branch --show-current` == team-arman. If not,
     `git checkout team-arman` and re-confirm before doing anything. Never `git add .`.
  2. BUILD scripts/diagnose-w2b-field-certification-v0.cjs implementing
     docs/governance/PLATONIC_ENGINE_W2B_BLIND_CERTIFICATION_REQUIREMENT.md (this file), honoring
     §0 blinding, §2 manifest-only emission, §3 the full battery, §4 C1–C5.
  3. DO NOT read, search for, fetch, or reconstruct any *SEALED_PREDICTIONS* plaintext or any
     expected value. Compute-and-report only. Hard-code no recovery rate / obstruction / margin /
     verdict (Rider A).
  4. RUN it with node; produce the §6 report (raw values only). Declare NO verdict.
  5. COMMIT on team-arman, exact-path staging: the new diagnostic + its report only. Re-confirm the
     branch before staging. One shot — no tuning to a desired outcome (Rider B; counts toward N=3).

The coder returns the report; the researcher reveals the seal and reconciles at W-2.C; mothership
disposes the terminal verdict. The researcher neither builds nor commits this battery.
```

---

## 8. Where it lives

```txt
Diagnostic: scripts/diagnose-w2b-field-certification-v0.cjs, run via `node`. Pure compute-and-report;
no UI; no Shape/production mutation beyond the diagnostic + any minimal pure lib. Recommended runner:
a fresh repo-bound coder session, blind by construction. Legitimacy (W-1) before activity (W-2);
this battery is the activity test, and it can fail honestly or pass honestly.
```

The reduction is the maximal one a label-free field is allowed to be (model card §9). This requirement defines the blind test of it and binds the five conditions — including the two that guard a predicted negative: a falsifier that could have come out positive (C2) and a bare-geometry control that cannot fit harder than the field (C3). The coder runs it blind; the seal, revealed byte-preserved at close, shows which way the prize fell.
