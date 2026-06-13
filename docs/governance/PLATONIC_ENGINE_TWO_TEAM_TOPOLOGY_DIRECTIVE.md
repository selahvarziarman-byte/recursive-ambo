# PlatonicEngine — Two-Team Topology Directive
## Mothership decision: how Team Arman and Team Blicero share a root, read each other, and cannot touch each other

Audience: the human (Arman, sovereign, repo owner) and all agents. For coordination with Team Blicero.

Status: mothership decision. Issued 2026-06-13, branch `Claude-child`, split commit `397ecb0b`.

## 1. The decision (in one picture)

```txt
TWO HOUSES, ONE CORNERSTONE.
  - One shared, tagged, immutable SPLIT COMMIT = the common ancestor both teams agree on.
  - Each team works in a repo IT ALONE can write to (write-isolation by ownership, not policy).
  - A one-way window each direction: each team adds the other as a READ-ONLY remote and
    fetches. Neither can reach through the window.
  - History is tamper-proof BY CONSTRUCTION: you cannot rewrite a history you have no write
    access to. No reliance on the other team configuring anything correctly.
```

Chosen model: **FORK-BASED**, not shared-branches. Rationale: with a fork, the other team has
ZERO write access to your repository — integrity is physical, not a setting that can be
misconfigured. Against an expert counterpart and a non-expert owner, physical guarantees beat
policy guarantees. (Shared-branch alternative is recorded in §6 for completeness; it is NOT
the chosen model.)

## 2. Topology

```txt
CANONICAL (neutral root): selahvarziarman-byte/recursive-ambo  (Arman owns it).
  - holds the immutable SPLIT TAG; this is the agreed common ancestor.
  - Team Arman works HERE, on branch `team-arman`.

TEAM BLICERO: their own FORK, e.g. <blicero-namespace>/recursive-ambo.
  - they work on branch `team-blicero` in THEIR fork.
  - they have NO write access to the canonical. They read it.

CROSS-VISIBILITY: each side adds the other as a remote and only ever FETCHES.
  - Team Arman reads blicero/team-blicero (cannot push to it).
  - Team Blicero reads arman/team-arman (cannot push to it).
SYMMETRIC READ, ISOLATED WRITE, TAMPER-PROOF HISTORY.
```

## 3. Exact commands (Arman runs these natively in the canonical repo)

```bash
# --- set the immutable cornerstone ---
cd C:\Dev\202cl\PlatonicEngine202
git checkout Claude-child
git pull origin Claude-child
git tag -a split/two-team-2026-06-13 -m "Two-team split: common ancestor (Team Arman / Team Blicero)" 397ecb0b
git push origin split/two-team-2026-06-13

# --- create Team Arman's working branch from the split ---
git branch team-arman 397ecb0b
git push origin team-arman
git checkout team-arman      # Team Arman works here from now on
```

```txt
# --- Team Blicero (their human, on GitHub) ---
1. Click "Fork" on selahvarziarman-byte/recursive-ambo -> <blicero-namespace>/recursive-ambo.
2. In their fork: git checkout -b team-blicero split/two-team-2026-06-13 ; git push -u origin team-blicero
   (the fork inherits the tag, so both teams share the verifiable cornerstone).
```

```bash
# --- the read-only window, each side adds the other (run once per clone) ---
# Team Arman, in the canonical clone:
git remote add blicero https://github.com/<blicero-namespace>/recursive-ambo.git
git fetch blicero
git log  blicero/team-blicero          # read-only; `git push blicero ...` is denied by GitHub
git diff team-arman blicero/team-blicero

# Team Blicero, in their fork clone:
git remote add arman https://github.com/selahvarziarman-byte/recursive-ambo.git
git fetch arman
git log arman/team-arman               # read-only
```

To refresh what the other team has done at any time: `git fetch <their-remote>` then read. It is live; no manual exchange needed.

## 4. Integrity locks (Arman, as repo OWNER — your home advantage)

```txt
On the canonical repo settings (Arman holds admin; this is your leverage):
  1. PROTECT the split tag and team-arman: a ruleset that BLOCKS force-push and BLOCKS
     deletion on `team-arman` and on tag `split/**`. History cannot be rewritten.
  2. REQUIRE SIGNED COMMITS on team-arman (both your agents run: git config commit.gpgsign true).
     Against an expert, signing means authorship cannot be forged — a commit claiming to be
     yours that you did not sign is detectable.
  3. Keep the canonical PRIVATE; grant Team Blicero READ (not write) explicitly. Ask the same
     of their fork so the window is symmetric.
  4. Never add Blicero's team as a COLLABORATOR on the canonical. Read-grant only. A
     collaborator can push; a reader cannot. This one choice is the whole integrity guarantee.
Team Blicero applies the same locks on their fork for their own protection.
```

## 5. Strategic note (opsec that is already our practice)

```txt
Read-only is SYMMETRIC: they see our governance trail, we see theirs. Our edge is not secrecy
of method (our discipline is documented and that is a strength) but SEAL DISCIPLINE as opsec:
  - sealed predictions are hash-committed with the PLAINTEXT HELD OFF-REPO (already our law).
  - So a competitor reading our repo sees THAT we predicted (the hash, the timestamp) but NOT
    WHAT we predicted, until we reveal. The hash is public; the foresight is not.
This means: keep doing exactly what W-1 did — seal off-repo, reveal byte-preserved at close.
Any in-flight reasoning we want to keep ahead of them stays in the off-repo seal until
committed. Do NOT write unrevealed predictions, candidate W internals, or strategy into the
repo before they are sealed. The governance docs are legible to them by design; the sealed
foresight is not.
```

## 6. Recorded alternative (NOT chosen): shared-branch model

```txt
One repo, two protected branches (team-arman, team-blicero), Blicero added as collaborator
with a ruleset restricting each branch's push to its owning team. Rejected because: it gives
the competitor WRITE access to the shared repo, so integrity depends on rulesets being
configured and never bypassed — a policy guarantee, not a physical one. Acceptable only if
both teams insist on a single side-by-side repo; if so, the §4 locks become mandatory, not
optional, and the split tag protection is non-negotiable.
```

## 7. Disposition

```txt
Adopt the fork-based two-house topology (§2-§3). Arman sets the cornerstone tag and the §4
locks as repo owner. Team Blicero forks and applies their own locks. Seals stay off-repo (§5).
The campaign's governance, seats, and verdict discipline continue UNCHANGED on team-arman;
the only change is the topology in which the work lives.
```
