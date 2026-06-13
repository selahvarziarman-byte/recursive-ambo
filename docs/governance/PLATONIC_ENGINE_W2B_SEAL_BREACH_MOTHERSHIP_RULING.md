# PlatonicEngine — W-2.B Seal-Custody Breach: Mothership Ruling

Audience: the researcher, the lieutenant, the human (Arman, sovereign).

Status: mothership ruling on the W-2.B seal-custody breach disposition. Verdict: **CONDITIONAL ACCEPT-WITH-DISCLOSURE (path A), anchored to an objective-core condition (§3); mandatory remediation (§2); no charter cycle consumed (§4); a structural fix that makes "blind by construction" actually enforced going forward (§2b).** Blind-safe: this ruling names no sealed value and requires none. Branch `team-arman`. Issued 2026-06-13.

## 1. What happened, and what the breach is (and is not)

```txt
The W-2.A sealed-prediction PLAINTEXT was tracked into the repo (local commit a348498) during the
W-2.B build. That violates "blind BY CONSTRUCTION" — the guarantee that the builder COULD NOT have
seen the prediction, which is stronger than "blind IN FACT" (the builder DID NOT use it).

NOT breached: seal CONTENT (hash matches off-repo master, working tree, and committed blob —
  81cfc7b3…db03). No re-seal on content grounds; the byte-preserved W-2.C reveal stands.
NOT leaked: the plaintext is absent on the competitor branch and (per last fetch) unpushed — the
  exposure appears contained to the local team-arman repo. NATIVE confirmation owed (§2c).
Breached: confidentiality + the construction guarantee. The build was blind IN FACT
  (lieutenant-verified at source: the diagnostic reads only seeds/ambo/carrier-table; "seal" only
  in comments; no expected value in the scorer) but not blind BY CONSTRUCTION.
Ownership: the researcher owns it as a custody failure; the coder and lieutenant are cleared
  (coder never added/read it; lieutenant caught it by re-execution and stayed blind). Mothership
  affirms that attribution. The audit worked: the breach surfaced because the run was re-executed,
  not trusted.
```

## 2. Remediation — MANDATORY under any disposition (native; blind-safe)

```txt
2a. REMOVE: ensure the off-repo master exists (it does, 81cfc7b3…db03), then on team-arman
    `git rm PLATONIC_ENGINE_W2A_SEALED_PREDICTIONS.txt` and commit the removal (exact-path).
    `git rm` reads no content — blind-safe.
2b. STRUCTURAL FIX (this is the part that matters most): add a .gitignore rule
    `*_SEALED_PREDICTIONS.txt`  so a seal plaintext CANNOT be tracked again. The hash files
    `*_SEALED_PREDICTION_HASH.txt` are not matched and stay in-repo. An intentional W-2.C reveal
    uses `git add -f` — a deliberate force = a deliberate reveal. This converts "blind by
    construction" from a discipline someone must remember into a rule the repo ENFORCES. The
    breach thereby makes future seals MORE protected, not less.
2c. NATIVE PROVENANCE (sovereign): `git log --oneline -- PLATONIC_ENGINE_W2A_SEALED_PREDICTIONS.txt`
    and `git branch -a --contains a348498` — confirm push state, local-branch presence, and the
    introducing commit; record in the ledger.
2d. LEDGER: the breach + ownership + remediation are recorded permanently in the W-2.C anomaly
    ledger. This memo seeds it.
```

## 3. The disposition, and the condition it rests on

```txt
Path A (accept-with-disclosure) is RATIFIED, but NOT on the researcher's self-attestation of
non-contamination — the erring party's own attestation is the weakest possible ground and
mothership does not rest an integrity ruling on it. It is ratified on an OBJECTIVE, NON-STEERABLE
ANCHOR:

  THE OBJECTIVE-CORE CONDITION. The W-2.B field-inactive finding must be carried by the GF(2)
  ABELIAN-REPRESENTABILITY result — a deterministic linear-algebra fact (is the selected-Re
  sign-assignment the holonomy of ANY Z2 1-cochain?) that NO exposure could steer. If the GF(2)
  system is INCONSISTENT, then no label-free abelian relational field carries the prize — a
  THEOREM, independent of any control design, margin, or builder influence — and by the W-2.A §2
  maximality result (Z2 is the ceiling) no legitimate label-free field carries it. That finding
  is breach-immune.

  AT W-2.C, MOTHERSHIP VERIFIES: that the negative rests on this objective core (GF(2) obstruction
  + the deterministic g / bare-geometry measurements), NOT on any judgment that exposure could
  have steered (a hand-tuned control margin, a discretionary comparison). 
    - If yes: the verdict's foundation is a theorem, the breach is immaterial to it, and path A
      stands. Accept.
    - If the negative rests on steerable judgment rather than the objective core: the breach taints
      it, and the finding must be re-established by an unexposed re-construction before any terminal
      verdict (escalate at W-2.C).

CORROBORATING (credited, not load-bearing): the measured values DISAGREE with the seal, and the
C3-symmetric control (a mothership AUDIT condition, not the researcher's seal) "changed the picture
from what was sealed." A contaminated build steering toward the seal would have AGREED; the build
instead followed the audit conditions and surprised the predictor. Mothership credits this as
consistent with non-contamination — but the RULING rests on §3's objective core, not on this.
```

## 4. No charter cycle consumed

```txt
The charter's N=3 budget exists to prevent endless REDESIGN-until-pass. This was not a redesign;
the build was blind-in-fact and its load-bearing finding (if §3 holds) is an objective theorem.
A custody breach is a process defect, not a design iteration. Therefore: NO charter cycle is
charged. (Had the negative rested on steerable judgment and required re-construction, that
re-construction also would not be a "tuning cycle" — it would be remediation. The N=3 budget is
for design attempts, not for fixing integrity slips.)
```

## 5. Why not a hard void (the precedent question, answered)

```txt
A reflexive void would say: "blind by construction" is absolute; any breach voids regardless. That
protects the principle but, here, would void a finding whose CORE is a theorem no exposure could
touch — rigidity for its own sake, which the campaign also forbids (the D4 lesson). The disciplined
path is neither "wave it through on a clever argument" (softens the guarantee) nor "void on reflex"
(ceremony over a theorem). It is: rest the verdict ONLY on what the breach could not have touched,
fix the construction so it cannot recur (§2b), and record everything. This does not soften "blind by
construction" — §2b makes the repo ENFORCE it for every future seal. The guarantee comes out
stronger.
```

## 6. Disposition

```txt
- Breach: ratified as the researcher's custody failure; coder/lieutenant cleared; audit worked.
- Remediation §2a-2d: MANDATORY now, before W-2.C, under either outcome of §3.
- Disposition: ACCEPT-WITH-DISCLOSURE (path A), CONDITIONAL on the §3 objective-core verification
  at W-2.C. No charter cycle consumed.
- W-2.C proceeds: sovereign re-hashes the seal NATIVELY (content + the §3 objective-core check);
  auditor derives per-criterion status; the researcher owns the sealed misses on the record;
  mothership disposes the terminal W-2 verdict — which, if field-inactive, must stand on the
  objective core to be ratified.
- Standing rule added: seal plaintext is gitignored from creation; force-add only at reveal.
```

The construction meant to make the result trustworthy-without-trust slipped, and the researcher owned it without flinching — which is the system working, not failing. Mothership will not rest the verdict on anyone's word that the slip was harmless; it rests on the one part of the finding that no slip could reach — a theorem about whether the prize can live in an abelian field — and it closes the hole so the next seal is protected by the repo itself, not by memory.
