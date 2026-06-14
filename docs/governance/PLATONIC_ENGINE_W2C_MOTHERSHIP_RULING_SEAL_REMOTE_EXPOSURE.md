# PlatonicEngine — W-2.C Mothership Ruling

## On the sealed-prediction envelope exposed on `origin/team-arman`

Audience: the Technical Officer (native git operator), the researcher (seal-holder), the lieutenant, the human (Arman, sovereign).

Status: mothership ruling on the W-2.C escalation (Technical Officer, 2026-06-13). **Verdict: OPTION B RATIFIED — seal burned-but-sound; remote history NOT rewritten; W-0 seal retired from all forward-secrecy assumption.** The ruling is **robust to the still-open repo-visibility fact** (§3, Item 1), because the decider is not visibility but forward-secrecy dependence, which is already null on the record. Two corrections to the escalation's own framing are issued (§2, §4). Branch `team-arman`. Issued 2026-06-13.

This memo is blind-safe: it names no sealed value and requires none.

---

## 0. Seat note and the authority of these findings

I rule from container reconnaissance. Every factual claim in the escalation is a native git result produced by the Technical Officer in the canonical repo; under the Repo-Identity Gate Protocol that native output is authority and my container is not. I therefore **accept the TO's Findings 1–6 as established**, and require that every remediation in §5 be **executed natively** by the operator on a confirmed `team-arman`, not from any container view.

One seat-limit I surface rather than paper over: the canonical repo's `.git/config` is currently unreadable from the container ("bad config line 11"), so I cannot run the branch gate (`git branch --show-current` == `team-arman`, toplevel, HEAD) from here at all. Until that config is repaired natively, **no git action in §5 is gate-authorized** — repairing it is remediation step 0.

---

## 1. What is, and is not, at issue

```txt
ESTABLISHED (Finding 1,2): the W-0 sealed-prediction PLAINTEXT envelope
  (docs/governance/PLATONIC_ENGINE_W_GATE_W0_SEALED_PREDICTIONS.txt, blob fbdf02a4)
  is present on origin/team-arman, entered via commit 46aa7d5, reachable from the
  remote tip 397ecb0. This is a real exposure and goes on the record.

NOT an integrity failure of W-1: the W-1 negative rests on four secrecy-INDEPENDENT
  anchors (hash-match; blind-in-code build; result DISAGREES with the prediction;
  the negative is a fixed GF(2) linear-algebra theorem). A leak enlarges WHO could
  have seen the prediction; it cannot change WHETHER seeing it could steer the result.
  On anchors 3–4 it could not. The TO's §4 assessment is affirmed in full.

ALREADY MOOT for secrecy: the W-0 seal was REVEALED and reconciled at W-1 close
  (397ecb0). Its forward secrecy was destined to zero by design at the W-1 memo.
  Plaintext sitting in history AFTER its intended reveal point is an OPSEC hygiene
  defect, not an integrity violation.
```

---

## 2. First correction — the §3 record amendment is APPROVED, but re-scoped for precision

The escalation's §3 attributes the falsification of the W-2.B "stayed local" statement to Finding 1. That conflates two distinct seals, and I will not let a true correction be recorded imprecisely.

```txt
- The W-2.B ruling's "stayed local / wasn't pushed" statement was about the W-2.A
  seal (PLATONIC_ENGINE_W2A_SEALED_PREDICTIONS.txt) — the subject of that ruling.
- Finding 1 concerns a DIFFERENT, earlier seal — the W-0 envelope. W-2.B never
  spoke to the W-0 seal's remote status.
- Finding 5 currently INDICATES the W-2.A seal did NOT reach the remote ("to be
  confirmed"). If confirmed, the W-2.B locality claim about W-2.A is VINDICATED,
  not falsified.

RULING:
  (a) RECORD, as fact: the W-0 envelope reached origin/team-arman in 46aa7d5 and
      remains reachable as of 2026-06-13. (Approves the substance of Item 3.)
  (b) DO NOT record "the W-2.B locality premise is falsified" as worded. The premise
      was about W-2.A; its status is pending native confirmation of Finding 5.
  (c) REQUIRE: natively confirm the W-2.A seal's remote status (Finding 5) and record
      BOTH seals' remote status separately in the W-2.C anomaly ledger.
  (d) CONTINGENCY (do not assume the favorable case): the W-2.A seal is STILL UNREVEALED
      (its byte-preserved reveal is the pending W-2.C step). Finding 5 currently indicates
      it did not reach the remote. IF native confirmation instead shows W-2.A IS on the
      remote while unrevealed, that is a LIVE forward-secrecy exposure — NOT moot like the
      revealed W-0 seal — and must be re-escalated before any W-2.C close; the B-vs-A
      analysis of §3 would then have to be re-run for W-2.A on its own facts.
```

The integrity verdict of W-2.B is untouched (it never rested on locality). What the record gains is an accurate two-seal exposure map instead of a one-seal conflation.

---

## 3. The remediation question (Items 1, 2) — OPTION B, and why visibility does not decide it

The escalation frames Item 1 (repo visibility) as "the single fact that decides B vs A." I correct that. Option A/C is warranted only when **both** conjuncts hold: (a) the remote is competitor/externally readable **and** (b) a forward gate still depends on this seal's secrecy. Conjunct (b) is **already false**: the W-0 seal was revealed at W-1 close. A visibility answer of "yes, readable" cannot, by itself, flip B→A for an already-revealed seal — there is no secret left to protect in *this* envelope.

```txt
OPTION B RATIFIED: leave remote history intact; record the exposure; retire the W-0
  seal from any forward-secrecy assumption (it is already revealed, so this is
  largely already true).
```

Two further reasons Option A is not merely high-risk but **foreclosed by standing law**, beyond the TO's stated caveats:

```txt
A-BAR 1 (decisive): the immutable two-team SPLIT TAG split/two-team-2026-06-13 sits on
  397ecb0. The envelope entered at 46aa7d5, the PARENT of 397ecb0. Excising it rewrites
  46aa7d5 -> re-SHAs 397ecb0 -> breaks the split tag, which the Two-Team Topology
  Directive (§4) protects against force-push and deletion by design. Option A therefore
  cannot be executed without SUSPENDING the topology cornerstone. Not authorized.

A-BAR 2: 397ecb0 is simultaneously origin/Claude-child and the arf worktree's base.
  Rewriting it cascades a forced re-sync across the Claude-child line and the gated
  competitor base — a multi-agent detonation to purge a seal that is already revealed
  and that GitHub would retain in cached views regardless.
```

Net: B is correct on its own merits, robust to the visibility answer, and A is barred by the split-tag lock. The W-1 result stands on its §4 anchors.

---

## 4. Second correction — the cleanup EXCEEDED the W-2.B remediation order

This is the finding the escalation under-weights, and it is the root cause of both the team-arman divergence (Finding 4) and the gated-arf rewrite (Finding 6).

```txt
W-2.B §2 ordered: a FORWARD `git rm` of the tracked seal plaintext + a commit
  (history-PRESERVING, blind-safe), plus a `.gitignore` guard (§2b), plus NATIVE
  confirmation of push state (§2c). It did NOT order a history rewrite.

What was executed: `git filter-repo` over ALL refs — a HISTORY REWRITE. This is an
  Option-A-class action taken BEFORE the mothership ruled A vs B, and it operated
  repo-wide rather than exact-path. Both violate standing discipline:
    - no gated/irreversible history action before the ruling;
    - exact-path staging only; never operate on all refs (the `git add .` prohibition,
      generalized).
  It is fortunately LOCAL-ONLY and UNPUSHED, hence fully reversible.

RULING: the local filter-repo pass is UNAUTHORIZED and is to be DISCARDED (not kept).
  The TO's recommendation to keep the local scrub (Finding 4) is overruled: under
  Option B the remote retains the envelope, so a scrubbed local base can never
  fast-forward or be pushed without a force (= the very Option A we declined). A
  half-purge — local-yes / remote-no — is an unreconcilable divergence, not a tidy state.
```

---

## 5. Ordered remediation (native; sovereign/TO executes; each step gated)

Run only on a confirmed `team-arman` (and confirm toplevel + non-detached HEAD) at each step. **Preserve all genuine post-split W-2 work** — do not let the discard of the filter-repo rewrite drop the W-2 model card / certification / governance commits.

```txt
0. REPAIR .git/config (bad config line 11) natively, so the branch gate can run at all.

1. RESET the gated competitor ref wgate/arf-w1-root-frame-v0 from the local rewrite
   (41d2037) back to canonical 397ecb0 — or delete the local ref and re-fetch from
   origin (we only ever READ arf). Undoes Finding 6.

2. DISCARD the filter-repo rewrite of team-arman WITHOUT losing W-2 work. Required
   END-STATE (achieve by whatever native means the operator verifies, e.g. re-apply the
   post-split W-2 commits onto the unmodified origin/team-arman base; do NOT hard-reset
   in a way that drops them):
     - local team-arman base history is byte-identical to origin/team-arman
       (the W-0 envelope REMAINS in inherited history — the accepted cost of Option B);
     - every genuine post-split W-2 commit is preserved;
     - the divergence in Finding 4 is gone.
   The operator confirms the base matches origin exactly before proceeding.

3. APPLY W-2.B §2 as ORIGINALLY ordered, forward and history-preserving:
     - if a seal plaintext is in the CURRENT tracked tree, `git rm` it (exact path) and
       commit the removal;  (the W-0 envelope's deep-history copy is left as-is under B)
     - add `.gitignore` rule `*_SEALED_PREDICTIONS.txt`; keep `*_SEALED_PREDICTION_HASH.txt`
       tracked; a deliberate W-2.C-style reveal henceforth uses `git add -f`.

4. CONFIRM Finding 5 natively (W-2.A seal remote status) and record BOTH seals' remote
   status in the W-2.C anomaly ledger (§2c).

5. PUSH HOLD (Item 4) CONFIRMED until steps 0–4 are complete and audited: local
   team-arman stays unpushed; no pull / merge / force. After step 2 the local base
   matches origin, so the only forward delta to push will be the genuine W-2 work plus
   step-3's removal+guard — a clean fast-forward, no force.
```

---

## 6. Standing-posture updates (forward-looking)

```txt
- The `.gitignore` seal guard (W-2.B §2b) is now LOAD-BEARING, not belt-and-suspenders.
  This incident proves a seal plaintext CAN reach the remote. For an already-revealed
  seal that is moot; for a FUTURE, UNREVEALED seal — whose secrecy IS the OPSEC edge
  against a real-time competitor reader — the same slip would be a true leak. Enforce
  the guard from creation; the repo, not memory, holds the line.

- EXACT-PATH / NO-ALL-REFS reaffirmed. Remediation is exact-path and history-preserving.
  `filter-repo --all`, all-ref operations, and `git add .` are prohibited. A remote or
  shared-history rewrite requires explicit mothership authorization under branch-gate
  clearance — and, where the split tag is implicated, sovereign suspension of the tag lock.

- SEAL CUSTODY (W-2.B) reaffirmed: the structural guard removes reliance on any party's
  diligence; ownership of a custody slip remains with the seal-holder, disclosed on record.

- CUSTODY INCIDENTS DOWNGRADED (mothership, this ruling): a seal-custody slip is logged as
  a ONE-LINE LEDGER NOTE and fixed in the normal forward flow. It is NOT a campaign-halting
  event and does not spawn a multi-memo tribunal. Seal hygiene runs in the background; it
  never again blocks the research. The cut-the-ceremony rule governs: a control that has
  stopped protecting anything real and started halting the work is retired on sight.
```

---

## 7. Effect on the W-2 terminal verdict (unchanged)

```txt
The W-2 terminal verdict remains PENDING and is UNDISTURBED by this escalation. Per the
W-2.B ruling it ratifies as FIELD-INACTIVE only if it rests on the objective core — the
GF(2) abelian-representability theorem — and not on any steerable control margin. The
exposure here is secrecy-only; it cannot steer a deterministic theorem. W-2.C close may
proceed to the terminal verdict once §5 is executed, Finding 5 is confirmed, and the §3
objective-core check is verified at the close. The terminal verdict is disposed separately.
```

---

## 8. Open item to the sovereign, and ratification

Not a blocker for Option B — required for the ledger and for the FORWARD seal-risk parameter:

```txt
VISIBILITY (Item 1) — CLOSED BY ASSUMPTION, no sovereign action required:
  Mothership assumes the WORST CASE — the canonical is competitor-readable — so the §6
  gitignore guard is treated as LOAD-BEARING unconditionally. This needs no answer to
  proceed. Confirming intended ("private + competitor read") == actual and that the §4
  owner-locks are set is an OPTIONAL hygiene check, never a blocker on the research.

FORWARD DEPENDENCY (Item 2): ANSWERED on the record — no forward gate depends on the W-0
  seal's secrecy; W-1's reveal retired it.
```

```txt
Mothership: [X] Option B ratified (burned-but-sound; no remote rewrite); robust to visibility.
            [X] §3 record amendment approved, re-scoped to two seals; Finding 5 native-confirm required.
            [X] Item 4 push-hold confirmed; Item 5 arf rewrite UNAUTHORIZED -> reset to 397ecb0.
            [X] filter-repo pass ruled an over-execution of the W-2.B order -> discard, W-2-work-preserving.
            [X] Option A barred by the split-tag immutability lock (A-BAR 1).
            [X] Item 1 visibility CLOSED by worst-case assumption — no sovereign answer required.
            [X] Seal-custody incidents downgraded to non-blocking ledger notes (§6).
            [ ] Sovereign: execute §5 natively on a gated team-arman, then the thread is closed.
Next: this ruling committed to docs/governance/ NATIVELY by the sovereign on a confirmed
  team-arman (after step 0 config repair). The seal thread ENDS here; the campaign returns
  to the W-gate terminal verdict and its forward fork (issued separately).
```

The exposure is real and is now on the record without inflation; the integrity of W-1 never depended on the seal staying secret, and the seal was already revealed, so the disciplined remediation is to record-and-retire, not to detonate the shared cornerstone to chase a plaintext the competitor would retain anyway. The one genuinely corrective act here is inward: the cleanup reached for a history rewrite the ruling never ordered, and the fix is to put history back and let the repo — not anyone's memory — hold the next seal.
