# NOTICE TO ALL AGENTS — Two-Team Branch Topology & Hygiene
## Read this before any git, file, or commit action. It amends the Repo-Identity Gate.

Issued by: mothership, 2026-06-13. Binding on every seat (mothership, lieutenant, researcher, implementer) and every session, every turn.

## 1. The incident (what changed)

A competitor team now works the SAME problem in the SAME repository. The work was split into two team branches off a shared, immutable ancestor. Both branches are in the ONE canonical repo `selahvarziarman-byte/recursive-ambo` (single-repo / two-branch model).

```txt
SPLIT ANCESTOR (common, tagged):  397ecb0   (W-1 close)
  OUR branch     : team-arman                  -> 397ecb0   (we chose this name)
  THEIR branch   : wgate/arf-w1-root-frame-v0  -> 397ecb0   (they chose it; token "arf")
  (Claude-child  : 397ecb0  = the pre-split lineage, now FROZEN as ancestor)
  (main          : 55c68e9  = old pre-campaign tip; not a work branch)
As of issuance the two team branches are IDENTICAL. They will diverge as each team works.
```

## 2. THE BRANCH LAW (standing — no one needs to restate it again)

```txt
1. OUR canonical working branch is  team-arman.  Nothing else.
   - This SUPERSEDES every prior doc that says "branch Claude-child". Claude-child is the
     frozen pre-split ancestor; we no longer work on it. Canonical = team-arman.

2. ANYTHING containing "arf" (currently wgate/arf-w1-root-frame-v0) is THE COMPETITOR'S.
   It is READ-ONLY, forever. Treat it exactly like a foreign repo that merely happens to
   live in the same remote.
   - NEVER checkout-and-commit on it, NEVER push to it, NEVER edit a file while on it,
     NEVER cherry-pick our work onto it, NEVER merge it into ours without explicit
     mothership+sovereign authorization.
   - You MAY read it: `git log origin/wgate/arf-w1-root-frame-v0`,
     `git diff team-arman origin/wgate/arf-w1-root-frame-v0`. Reading is encouraged
     (it is how we watch them). Writing is forbidden.

3. EVERY session, EVERY agent, BEFORE any work, runs the gate and CONFIRMS the branch:
     git rev-parse --show-toplevel      # must be the canonical repo
     git branch --show-current          # MUST print exactly: team-arman
     git rev-parse --short HEAD
   If `git branch --show-current` is not `team-arman` (especially if it is an arf branch,
   Claude-child, main, or detached HEAD): STOP. Do no work. `git checkout team-arman`
   first. Committing on the wrong branch is the incident this notice exists to prevent.

4. Before any commit/push, re-confirm the branch is team-arman and the push target is our
   branch. Exact-path staging only; never `git add .`. No commit before audit (unchanged).
```

## 3. The Repo-Identity Gate, amended

The mandatory preamble of every prompt and report is now:

```txt
Canonical repo:   C:\Dev\202cl\PlatonicEngine202   (native Windows is sole authority)
Canonical branch: team-arman                        (NOT Claude-child anymore)
Competitor ref:   wgate/arf-w1-root-frame-v0 (and any arf*) = READ-ONLY, never write
Decoy repo:       C:\Dev\PlatonicEngine = NOT this project
Gate: path + branch + HEAD, all three; branch MUST be team-arman before acting.
```

Stop conditions (any one -> stop): toplevel is not the canonical repo; branch is not
team-arman; HEAD is detached. The protocol doc
(`PLATONIC_ENGINE_REPO_IDENTITY_GATE_PROTOCOL.md`) is amended by this notice on the
branch name; where they differ, THIS notice governs.

## 4. Integrity, now mandatory (single-repo model)

Because both teams share one repo (their human is a git expert; we are protecting against
mistakes AND against a capable counterpart), the owner-side locks recorded in the Two-Team
Topology Directive §4 are no longer optional:

```txt
- block force-push and deletion on team-arman and on the split tag (history cannot be rewritten);
- require signed commits on team-arman (authorship cannot be forged: git config commit.gpgsign true);
- the competitor has read; never grant them collaborator/push on our branch's protection;
- our agents NEVER touch arf* branches (Branch Law §2).
These are the difference between a policy guarantee and a real one. Arman (owner) sets them.
```

## 5. Opsec (same repo = they read everything we commit)

```txt
The competitor reads our entire branch in real time. Our edge is NOT method-secrecy (our
discipline is documented, and that is a strength) but SEAL DISCIPLINE:
  - sealed predictions are hash-committed with PLAINTEXT HELD OFF-REPO (already our law).
  - they see THAT we sealed and WHEN (hash + timestamp); they do NOT see WHAT until reveal.
Keep it that way: never write an unrevealed prediction, candidate-W internal, or in-flight
strategy into team-arman before it is sealed off-repo. The governance trail is legible to
them by design; the foresight is not.
```

## 6. Current-state flag (corrective)

```txt
At issuance, a working clone was observed parked on wgate/arf-w1-root-frame-v0 (the
competitor's branch), not team-arman. This is exactly the failure Branch Law §3 prevents.
Every clone/worktree must be returned to team-arman and confirmed before work resumes.
Anyone who finds themselves on an arf branch: checkout team-arman; verify nothing was
committed there by us; report to mothership if anything was.
```

## 7. One-line summary for every agent

```txt
We are team-arman. They are arf (read-only). Confirm `git branch --show-current` == team-arman
before you touch anything. Seals stay off-repo. They are watching; commit accordingly.
```
