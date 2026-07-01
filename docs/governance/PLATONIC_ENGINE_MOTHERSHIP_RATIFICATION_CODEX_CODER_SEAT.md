# MOTHERSHIP RATIFICATION — Codex as operating coder (clone-isolation + patch-handback)

**Seat:** Mothership (4th seating) · **Date:** 2026-06-30 · **On:** the TO's Codex Integration Architecture proposal (2026-06-25). Ratifies the coder-seat change; the sovereign gives the final go + the seat-structure call.

## VERDICT: the mechanism is RATIFIED (verified sound). The seat change is ratified WITH conditions (below).

## What I verified (not on the TO's report)
- **The problem is real.** OpenAI Codex issue **#28241** (confirmed via web): Codex's `refs/codex/turn-diffs/checkpoints/*` tree-refs break libgit2-based git clients enumerating refs. Bonus harm **#29388**: the checkpoint blobs also balloon the object store (~100 GB reports). Both land in whatever `.git` Codex runs in.
- **The worktree-is-insufficient argument is correct.** Our canonical `.git` is a shared directory (own object+ref store); a worktree inherits it, so `refs/codex/*` from a worktree still pollute canonical repo-wide. A clone has its own store. (Grounded on our repo: 0 codex refs now = recently swept = recurring; arf worktrees already share the store.)
- **The handback is clean by construction.** A `git diff` is file hunks — it cannot carry refs or objects. Codex's git machinery (refs + checkpoint blobs) stays in its clone; canonical only ever sees a patch Arman applies. Verified.
- **Architecturally coherent** with the campaign's recurring move: isolate the volatile thing, bridge via a controlled artifact (arf read-only worktree; per-session seat anchors; now Codex's git in an isolated clone).

## The mechanism — RATIFIED
Codex operates in a separate full clone (`PlatonicEngine202_CODEX`, own `.git`), **fetch-only** from canonical; syncs to the chartered `team-arman` SHA; builds; hands back `.handoff/PATCH_<stem>.diff` + `REPORT_<stem>.md`; the engineer audits the patch; **Arman applies + commits natively**. Codex's refs/blobs are quarantined in its clone. This is the existing coder discipline with one substrate accommodation — no new discipline invented.

## The condition layer (mine — the seat, not the substrate)
The TO solved the *substrate* (git isolation). The *seat* is mine and the sovereign's, and git-isolation alone does not make Codex a trusted coder:
1. **Calibrate Codex as a coder seat, and verify it holds the discipline before light-touch trust.** Seat it via the anchor mechanism (coder Layer-1 role + seat-map + its own `seat-anchor-<guid>.md`) AND confirm — on a real probe build — that it holds our coder disciplines: **build-to-prompt (no scope-creep), no-commit-before-audit, adversarial self-audit, handback via `.handoff/`.** These are our calibrated culture, not Codex's defaults; trust is earned per calibration, like any seat. A coder-seat calibration pair (role doc + probe) is **owed** — analogous to the researcher pair.
2. **This is exactly what protects against "getting sloppy."** The guard on quality is the **engineer's cross-office audit on every Codex patch** (unchanged surface: the diff + the seals) + the mothership ratification — and both stay Claude. Only the heavy *coding* is offloaded; quality control is not. Until Codex is calibration-proven, the engineer audits its patches with **extra** scrutiny (no light-touch trust yet).
3. **The audit is now cross-model-family** (Codex builds, Claude audits/ratifies) — a *stronger* independence than Claude-audits-Claude. An integrity gain.
4. **Hold the baseline discipline.** Codex must build against the **current** `team-arman` SHA (the engineer pins it in the charter; Codex fetches+checks out to it); if canonical moves before handback, re-sync/re-base so the patch applies cleanly. Baseline drift is the one new friction the clone introduces.
5. **Quota logic confirmed** (Arman's motive): the heavy token cost is the multi-turn coding iteration → offloading it to Codex saves the most, while the bounded Claude audit + ratification keep quality. Addresses both session-limit and don't-get-sloppy.

## The one open call — the sovereign's (seat structure)
Does Codex **replace** دازم‌ه as coder, or is it a **tier alongside** it (like the engineer's senior/operating)? **My recommendation:** a tiered coder office — **Codex = default operating coder for heavy builds** (the quota win), **دازم‌ه (Claude Code) retained** for builds needing Claude-native judgment/subtlety and as fallback. Preserves optionality; matches the campaign's tiering pattern. The sovereign decides.

**RESOLVED (sovereign, 2026-06-30): Codex REPLACES دازم‌ه — sole operating coder; دازم‌ه retired from the coding slot.** Maximal quota offload. **Load-bearing implication:** there is no Claude-native coder fallback, so the **engineer's cross-office audit is the SOLE build-side quality guard** — the Codex calibration and the rigorous per-patch audit are non-negotiable, not optional. Until Codex is calibration-proven, every patch is audited at full scrutiny; the seals + the mothership ratification remain the backstop.

## Routing
- **Sovereign:** the go + the seat-structure call.
- **TO:** on the go — stand up `PlatonicEngine202_CODEX` (clone + fetch-only remote + `pre-push` block + the sync + patch-handback scripts) and the Codex `seat-anchor`.
- **Mothership + engineer:** produce the **Codex coder-seat calibration** (role doc + probe build) and run it before Codex is trusted light-touch.

## Substrate stood up (TO) — RATIFIED 2026-06-30
The TO mechanized the substrate (`.handoff/AGENTS.md`, `CODEX_CLONE_SETUP.md`, `codex_sync.ps1`, `codex_handback.ps1`), verified by the mothership:
- **Boundary holds:** clone-scoped work; handback is a **file drop** of `PATCH_<stem>.diff` + `REPORT_<stem>.md` into canonical `.handoff/` (not a git op on canonical); Codex structurally fetch-only (local origin, no GitHub creds, `--push DISABLED` + `pre-push` hook).
- **Drift discipline (my §3) baked in:** the handback fetches canonical, rebases `codex-work` onto the current `team-arman` tip, and **aborts + exits on conflict** (stop, never force) — the patch always applies cleanly.
- **`AGENTS.md` is the anchor — RATIFIED as faithful.** It carries the coder seat + our exact disciplines + the boundary, and auto-loads every run. The seat-anchor mechanism keys on a Cowork `local_<guid>` that an external CLI has no equivalent for; `AGENTS.md` realizes the anchor's *purpose* via Codex's native means. Faithful adaptation, correctly flagged (not a silent deviation).
- **One native step remains (Arman's hand):** the `git clone --no-hardlinks …` + setup block in `CODEX_CLONE_SETUP.md` — native authority, like commits/pushes. On that, the clone + scripts + anchor are live.
- **Deferred to post-calibration (mothership):** the campaign-side memory note "the coder seat is now Codex" is written **only after** the probe passes — trust is earned, not declared. The TO correctly left this to me.
