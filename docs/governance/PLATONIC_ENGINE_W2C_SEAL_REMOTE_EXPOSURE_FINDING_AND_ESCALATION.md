# W-2.C ESCALATION — Sealed-Prediction Envelope Exposed on the Remote

**Date:** 2026-06-13
**From:** Technical Officer (native git operator, team-arman)
**To:** Mothership (terminal verdict authority)
**Re:** Factual correction to the W-2.B seal-breach ruling + remediation decision required before W-2.C close
**Classification:** Governance / integrity — gated branch action implicated

---

## 1. Bottom line

During the routine cleanup that the W-2.B ruling ordered — remove the stray sealed-prediction envelope, add a `.gitignore` guard, and confirm it was never pushed — the "confirm it was never pushed" step **failed**. The plaintext sealed-prediction envelope is present on the remote `origin/team-arman`, inside commit `46aa7d5`, and is reachable from the current remote tip.

This contradicts a factual premise the W-2.B ruling relied on ("it stayed in your local copy and wasn't even pushed out"). That premise must be corrected on the record.

**The integrity verdict itself does not change** — the reasons are in §4 — but the basis for it must be restated, and the mothership must rule on remediation, because the only way to purge the remote is to rewrite the canonical shared branch, which is a gated, multi-agent action.

---

## 2. Confirmed technical findings

All claims below are backed by git commands run this session; exact commands and outputs are in the Appendix.

**Finding 1 — The envelope is on the remote.**
`git rev-list --objects origin/team-arman` lists blob `fbdf02a4a243c00c0bbadae3626d7d192e425d15` at path `docs/governance/PLATONIC_ENGINE_W_GATE_W0_SEALED_PREDICTIONS.txt`. The plaintext envelope is reachable from `origin/team-arman`.

**Finding 2 — It entered via commit `46aa7d5`.**
The remote history (`git log --oneline origin/team-arman`) contains `46aa7d5` ("W-gate: W-0 model card … sealed prize by hash (plaintext off-repo) …") with the same SHA as the local pre-cleanup commit. Identical SHA means identical tree content, so the remote `46aa7d5` carries the same envelope blob the local copy did.

**Finding 3 — The remote tip is another agent's audited work.**
The remote tip is `397ecb0` ("W-1 close: blind legitimacy diagnostic; seal revealed + reconciled (prize HELD, independently audited); terminal verdict pending mothership"), and it is simultaneously `origin/Claude-child`. The ARF worktree was sitting at this same `397ecb0` before the local cleanup. Any remote rewrite of `team-arman` would rewrite `397ecb0` and force a re-sync of the Claude-child line and anything based on it.

**Finding 4 — The local branch is now clean.**
A local `git filter-repo` pass scrubbed both envelopes (`…W_GATE_W0_SEALED_PREDICTIONS.txt` and the root-level `PLATONIC_ENGINE_W2A_SEALED_PREDICTIONS.txt`) from local `team-arman`. Scoped verification (`git rev-list --objects team-arman` and `git log team-arman -- <envelope>`) returns empty. The local scrub is correct and worth keeping, but it cannot reach the remote.

**Finding 5 — A second envelope existed locally.**
A second plaintext envelope, `PLATONIC_ENGINE_W2A_SEALED_PREDICTIONS.txt` (blob `6b72047d…`), was also present in local history and is now scrubbed locally. Its remote status should be checked the same way (`git rev-list --objects origin/team-arman | Select-String SEALED_PREDICTIONS` returned only the W_GATE_W0 blob, suggesting W2A did not reach the remote — to be confirmed).

**Finding 6 — The local cleanup also rewrote the gated ARF branch.**
The local `filter-repo` pass operated on all refs, not only `team-arman`: the gated competitor branch `wgate/arf-w1-root-frame-v0` now points to a rewritten commit `41d2037…`, whereas the original/remote line is `397ecb0`. A gated branch was therefore altered in the local clone as a side effect of the cleanup. This is **local-only and unpushed**, but it should be reviewed under the branch-gate rules and reset to the canonical commit if the rewrite was not authorized. The envelope blob `fbdf02a4` remains reachable in the local object store via this ARF line, which is why a repo-wide (`--all`) scan still surfaces it even though `team-arman` is clean.

---

## 3. Correction to the W-2.B record

The W-2.B ruling listed, as one of four reasons the breach was a slip rather than a disaster, that the envelope "didn't leak … it stayed in your local copy and wasn't even pushed out." **Finding 1 falsifies that specific point.** The plaintext reached `origin/team-arman`.

The record should be amended to state plainly: the envelope was pushed to the remote in commit `46aa7d5` and remains reachable from `origin/team-arman` as of 2026-06-13.

---

## 4. Integrity assessment — why the verdict still holds

The W-2.B ruling deliberately did **not** anchor its integrity finding on the envelope staying local. It anchored on:

1. **The seal hash still matches** — no post-hoc alteration of the prediction.
2. **The builder's source never reads the prediction** — verified line by line by the lieutenant.
3. **The result disagrees with the prediction** — the anti-cheating tell; a peek-and-confirm would have produced agreement, not disagreement.
4. **The negative result rests on a fixed linear-algebra theorem** — an expressibility question with a definite answer that no amount of peeking could steer.

None of these four are weakened by the envelope being on the remote. A leak enlarges *who could have seen* the prediction; it does not change *whether seeing it could have altered the result*. On anchors 3 and 4, it could not.

**Timeline point that bounds the severity:** the blinding concern is about access to the plaintext *during test construction*, before the reveal. That concern was already adjudicated (anchors 2–4). The remote tip `397ecb0` records that at W-1 close the seal was **revealed and reconciled** — i.e. the prediction was destined to become open at the W-1 memo regardless. Plaintext sitting in the repo *after* the intended reveal point is, by itself, not an integrity violation. The exposure matters for forward secrecy of this seal, not for the validity of the W-1 negative result.

**Net:** the W-1 result stands on its stated anchors. The seal should be treated as **burned for any forward use**, which — given W-1 already revealed it — is largely already the case.

---

## 5. Remediation options (mothership to rule)

### Option A — Coordinated remote history rewrite (purge)
Rewrite `origin/team-arman` to excise the envelope from `46aa7d5` and all descendants, then force-push.
- **Requires:** gating the canonical branch; rewriting `397ecb0` (changing the SHA of an independently-audited close); re-syncing `origin/Claude-child` and the ARF worktree; coordinated reset across every clone/agent.
- **Caveats:** force-push does **not** guarantee removal — GitHub retains unreachable objects and cached views (commit URLs, PRs, forks) until garbage-collection or a support request. The seal must be treated as exposed even after a rewrite.
- **Risk:** high; touches the gated competitor line; re-anchors an audited commit.

### Option B — Declare seal burned-but-sound; document, do not rewrite (recommended)
Leave history intact; record the exposure formally; retire the W-0 seal from any forward secrecy assumption.
- **Preserves:** the full audit trail and `397ecb0`'s audited SHA.
- **Cost:** plaintext remains in remote history — acceptable because (a) the seal was revealed at W-1 close anyway, and (b) the integrity anchors are independent of secrecy.
- **Risk:** low; honest; no multi-agent disruption.

### Option C — Visibility-gated hybrid
Choose A only if the remote is externally or competitor-readable; otherwise B.
- Hinges on a fact not yet established: the visibility of `github.com/selahvarziarman-byte/recursive-ambo` and whether the competitor (`arf` line) can read this remote.

---

## 6. Recommendation

**Option B, unless the remote is externally or competitor-visible.** Rationale: the integrity anchor is untouched; the seal was already revealed at W-1; rewriting the canonical branch is high-risk, multi-agent, gated, and cannot fully purge a remote in any case; and preserving the audited `397ecb0` SHA has value. If §7 Q1 reveals public or competitor-side visibility *and* any forward gate still depends on this seal's secrecy, escalate to Option A under explicit branch-gate clearance.

---

## 7. Decision items for the mothership

1. **Repo visibility:** Is `github.com/selahvarziarman-byte/recursive-ambo` public or private, and does the competitor / `arf` line have read access to this remote? This single fact decides B vs A.
2. **Forward dependency:** Does any gate beyond W-2.C depend on the W-0 seal remaining secret, or did W-1's reveal already retire it?
3. **Record amendment:** Approve the §3 correction to the W-2.B ruling.
4. **Push hold:** Confirm that local `team-arman` stays unpushed and no force action is taken until 1–2 are answered. (Local branch has diverged from the remote and currently cannot fast-forward; no pull/merge/force has been performed.)
5. **ARF branch rewrite:** Rule on whether the local rewrite of the gated `wgate/arf-w1-root-frame-v0` (`41d2037…`, down from `397ecb0`) is authorized or should be reset to the canonical commit. It is local-only and unpushed.

---

## Appendix — Evidence

**Envelope reachable from the remote:**
```
PS> git rev-list --objects origin/team-arman | Select-String "SEALED_PREDICTIONS\.txt"
fbdf02a4a243c00c0bbadae3626d7d192e425d15 docs/governance/PLATONIC_ENGINE_W_GATE_W0_SEALED_PREDICTIONS.txt
```

**Remote history (head):**
```
PS> git log --oneline origin/team-arman
397ecb0 (origin/team-arman, origin/Claude-child) W-1 close: blind legitimacy diagnostic; seal revealed + reconciled (prize HELD, independently audited); terminal verdict pending mothership
46aa7d5 W-gate: W-0 model card (walk-primitive W) + sealed prize by hash (plaintext off-repo) + W-1 legitimacy spec
538ddf9 compete mfs
...
```

**Local team-arman is clean (both empty):**
```
PS> git rev-list --objects team-arman | Select-String "SEALED_PREDICTIONS\.txt"
PS> git log team-arman --oneline -- "docs/governance/PLATONIC_ENGINE_W_GATE_W0_SEALED_PREDICTIONS.txt"
PS>
```

**Lingering blob locally is pinned to the gated ARF branch:**
```
PS> git for-each-ref | Select-String "wgate|arf"
41d2037c4525846f5fe371c234260411c15bbf6b commit refs/heads/wgate/arf-w1-root-frame-v0
```

**Push rejection (no force taken):**
```
PS> git push --set-upstream origin team-arman
 ! [rejected]        team-arman -> team-arman (fetch first)
error: failed to push some refs to 'https://github.com/selahvarziarman-byte/recursive-ambo.git'
```
