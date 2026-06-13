# PlatonicEngine — W-2.B Seal-Custody Breach: Researcher Disposition

## Ownership, integrity result, remediation, and disposition recommendation

Audience: mothership (ratifies the accept/void disposition and the terminal verdict) and the human (Arman, sovereign). For the lieutenant (cc; remains blind).

Status: **researcher-authored disposition. Blind-safe — no sealed values.** Responds to the lieutenant's W-2.B blinding-construction breach escalation. The §4 seal-integrity check (which only the seal-holder can perform) is reported; remediation is directed; a disposition is recommended and — because the breach is the researcher's own custody failure — submitted to mothership for ratification rather than self-resolved.

Repo identity: canonical `C:\Dev\202cl\PlatonicEngine202`, branch `team-arman`; competitor `wgate/arf-w1-root-frame-v0` / `arf*` READ-ONLY, untouched. Issued 2026-06-13. HEAD at audit: `a348498`.

---

## 1. Ownership

```txt
Seal custody is the RESEARCHER seat's responsibility. The W-2.A sealed-prediction PLAINTEXT being
tracked in the repository during the W-2.B build is MY failure. I record it plainly:
  - NOT the coder's fault: a348498 changed exactly two files (the diagnostic + the report); the
    coder never added the plaintext and — verified at source — never read it.
  - NOT the lieutenant's fault: the lieutenant audited by independent re-execution, caught the
    breach the summary could not show, and stayed blind. That is the audit working as designed.
  - The "blind BY CONSTRUCTION" guarantee I wrote into the W-2.B requirement §0 did not hold for
    this run. The build was blind IN FACT but not blind BY CONSTRUCTION. The distinction is the
    campaign's whole point, and I am the one who let the construction slip.
```

---

## 2. §4 seal-integrity — CONTENT INTACT (seal-holder check)

```txt
Committed hash (W-2.A): SHA-256 LF 81cfc7b3...db03 / CRLF a3e3f0c9...0f25.
  off-repo master (custody copy)      -> 81cfc7b3...db03   MATCH
  in-repo working-tree copy            -> 81cfc7b3...db03   MATCH
  committed blob in a348498            -> 81cfc7b3...db03   MATCH
=> The seal CONTENT was NOT altered. The byte-preserved W-2.C reveal remains valid; NO re-seal is
   required on content grounds. What was breached is CONFIDENTIALITY and the CONSTRUCTION guarantee,
   not the bytes. (Sovereign re-confirms the hash NATIVELY at W-2.C, per C5.)
```

---

## 3. Branch sweep — exposure contained

```txt
Per the last-fetched remote refs, the plaintext is ABSENT on:
  origin/main, origin/Claude-child, origin/team-arman, AND origin/wgate/arf-w1-root-frame-v0.
=> The competitor branch does NOT carry our seal; no cross-branch / competitor leak is evident.
   The plaintext is present in the LOCAL commit a348498 (apparently unpushed: origin/team-arman
   does not contain it). The exposure therefore appears CONTAINED to the local team-arman working
   repo. NATIVE confirmation owed (sovereign): whether a348498 was pushed; local-branch presence;
   provenance (the introducing commit) via `git log -- <file>`.
```

---

## 4. Remediation (native; blind-safe — `git rm` reads no content)

```txt
a. On team-arman, ensure an off-repo master exists (it does; hash 81cfc7b3...db03), then
   `git rm PLATONIC_ENGINE_W2A_SEALED_PREDICTIONS.txt` and commit the removal (exact-path).
b. Add a .gitignore guard so a seal plaintext can never be tracked again:
   pattern `*_SEALED_PREDICTIONS.txt`  (the hash files `*_SEALED_PREDICTION_HASH.txt` are NOT matched
   and stay in-repo). An INTENTIONAL reveal at W-2.C uses `git add -f` (a deliberate force = a
   deliberate reveal).
c. Native provenance + push state: `git log --oneline -- PLATONIC_ENGINE_W2A_SEALED_PREDICTIONS.txt`;
   `git branch -a --contains a348498`. Record the introducing commit/seat in the ledger.
d. Record the breach + remediation in the W-2.C anomaly ledger (this memo is its seed).
Executable by the lieutenant (blind-safe) or the sovereign; the researcher cannot run native git.
```

---

## 5. Disposition — recommendation (A), submitted to mothership for ratification

```txt
Two defensible paths (lieutenant framed both):
(A) ACCEPT-WITH-DISCLOSURE — carry W-2.B to W-2.C, breach disclosed in the ledger.
(B) VOID-ON-CONSTRUCTION — void on the blinding-construction failure; re-seal off-repo; re-run;
    cost: one of the charter N=3.

RESEARCHER RECOMMENDATION: (A) ACCEPT-WITH-DISCLOSURE, on these grounds:
  1. Content integrity INTACT (§2); the reveal is valid.
  2. Exposure CONTAINED (§3): competitor branch clean; breach appears local-only.
  3. Build blind IN FACT (lieutenant-verified at source): the diagnostic reads only seeds/ambo/
     carrier-table; Rider A clean; "seal" appears only in comments; no expected value in the scorer.
  4. SEAL-HOLDER'S AFFIRMATIVE GROUND (only I can attest this): the run's MEASURED values are
     INCONSISTENT with the sealed prediction's specific values. A build tuned to a readable seal
     would have produced AGREEMENT; this run produces DISAGREEMENT. That is positive evidence of
     non-contamination, beyond mere "opportunity not taken." (Specifics reconciled at W-2.C; stated
     here qualitatively, no values revealed.)
  5. The result is a deterministic, reproducible NEGATIVE; a void/re-run reproduces it identically
     and the seal is already exposed within-team — so (B) is ceremony, and the campaign cuts
     ceremony on sight (the D4 lesson), while spending a scarce charter cycle.

BUT — the breach is MY custody failure. I will not self-absolve. I therefore SUBMIT (A) to
mothership for RATIFICATION, and will execute (B) without argument if mothership holds structural
blindness as an absolute standard that a construction breach must void regardless of in-fact
cleanliness. §2 and §4 (integrity + remediation) are prerequisites under EITHER path.
```

---

## 6. For the W-2.C close

```txt
On a mothership (A) ratification: the byte-preserved seal reveal and the per-prediction
reconciliation proceed at W-2.C (sovereign re-hashes natively; auditor derives per-criterion
status; mothership disposes the terminal W-2 verdict). I flag now, without revealing values, that
the reconciliation will carry NOTABLE MISSES — the fair, C3-symmetric control changed the picture
from what I sealed, and I will own those misses on the record exactly as the discipline requires.
On a mothership (B) ruling: re-seal off-repo first; re-run blind against a genuinely off-repo seal.
```

The audit did its job: the run was re-executed rather than trusted, and a structural breach surfaced that no summary would have shown. The result survived substantive scrutiny; the construction meant to make it trustworthy-without-trust did not, and that is my error to own. Integrity is intact, exposure is contained, the fix is straightforward — and whether a clean-in-fact run with a broken construction may stand is precisely the kind of standard call I should not make about my own mistake. Mothership rules; I will run either way.
