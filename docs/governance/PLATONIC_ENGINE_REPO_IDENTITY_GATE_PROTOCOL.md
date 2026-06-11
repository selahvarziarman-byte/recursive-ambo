# PlatonicEngine Repo-Identity Gate Protocol

Audience: every agent in the campaign — mothership, prompter/planner/auditor (lieutenant), and Claude Code — and every future agent seated into this project.

Status: binding operational protocol, ordered by the human (sovereign), installed by mothership 2026-06-11. It governs all Git, file, and commit instructions for the field-generalizability campaign and any successor work in this repository.

## 1. Canonical identity

```txt
Canonical repo (native Windows):  C:\Dev\202cl\PlatonicEngine202
Canonical branch:                 Claude-child
Known good state at installation: 513b1a2 Ratify Station III Bench 2 closing memo
```

```txt
DECOY WARNING: C:\Dev\PlatonicEngine is a DIFFERENT local repo and is NOT the
active campaign working tree. Never infer state from it. Never write commit
instructions for it unless the human explicitly declares work is moving there.
```

## 2. The gate (run before every report, command, or commit instruction)

```powershell
pwd
git rev-parse --show-toplevel
git branch --show-current
git rev-parse HEAD
git status --short --untracked-files=all
git diff --name-status HEAD
git diff --cached --name-status
```

Stop conditions — do not proceed past either:

```txt
git rev-parse --show-toplevel is not C:/Dev/202cl/PlatonicEngine202 (or the
  equivalent Windows path)  -> STOP.
branch is not Claude-child  -> STOP.
```

Every agent must prove three things before acting: exact path, exact branch, exact HEAD. Same branch name is NOT enough — two repos can both have a `Claude-child`.

## 3. Authority rules

```txt
1. The native Windows repo is the sole authority. A file does not count as part
   of the campaign until it is visible from native PowerShell in the canonical repo.

2. Container/mount views (mothership's sandbox, any Linux mount of the folder)
   are RECONNAISSANCE ONLY. An agent operating through a container must say so
   explicitly, label its output "[CONTAINER VIEW — not authoritative]", and must
   not issue staging/commit instructions from that view alone. Known container
   divergences: line-ending churn (symmetric +/- diffs), stale .git/index.lock,
   sync lag.

3. No invented filenames. Commit/staging instructions may name only paths
   returned by git status, git diff --name-status HEAD, git diff --cached
   --name-status, or explicit Get-ChildItem searches in the canonical repo —
   run natively. Handoff memory, container memory, agent memory files, and
   planned deliverables are NOT sources of filenames.

4. Narrative claims about artifacts ("two files", "the duplicate draft",
   "the bench files", "already committed") must be verified by native Git or
   filesystem commands before any staging/commit command is given.

5. Exact-path staging only (standing rule, restated): never `git add .`;
   no commit before audit; no audit without diff; no diff without
   untracked-file handling.
```

## 4. Per-seat application

```txt
Mothership      operates via container mount: gate output is labeled container
                view; authoritative gate output is requested from the human's
                native PowerShell whenever a commit instruction is to be issued.

Lieutenant      includes the gate (section 2) as the mandatory preamble of every
                implementation prompt, and requires the implementer to print it
                before edits and again before reporting.

Claude Code     runs the gate first in every session; stops on either stop
                condition; reports gate output verbatim in its final summary
                alongside git status --short --untracked-files=all.
```

## 5. Station III state note (at installation)

The ratified Station III memo and the archived lieutenant draft are already committed on `Claude-child` (c7cd7dd, ab1a5c0, 513b1a2). They are not to be recommitted unless native Git shows new changes.
