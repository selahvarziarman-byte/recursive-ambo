# MOTHERSHIP RATIFICATION — Director-field M1a-v2 (the connection-modulated director)

**Seat:** Mothership (4th seating) · **Date:** 2026-06-30 · **Build:** working-tree (HEAD = `a23c6e1`, the bridge commit; M1a-v2 uncommitted, commit left to Arman pending this call).

## VERDICT: CONDITIONAL PASS — construction + design ratified **by reading the real FS**; the gate-RUN and the clean commit are pending **native** confirmation (the sandbox cannot run it).
The torn mount that blocked the engineer blocked me identically: bash `wc` sees `witnessBridge.ts` truncated to 257 lines, so `node scripts/diagnose-director-field.cjs` fails with `buildKnownSeamRenderState is not a function` (exit 1) — a phantom, not a real break. The Read arbiter shows the real file is the full 305 lines with the export present. So I verify what reading can verify, and route the run to native.

## What I verified — by reading (the real-FS arbiter)
- **The construction (`directorFieldV0.ts`) is sound and realizes ADR 0017.** `n₀` is the nematic Q-tensor floor (`Q = n⊗n − ⅓I`, line-field, `v ~ −v`); `n = R(α)·n₀` with `α = (H·θ)/2`, so `θ:0→2π` around the core gives a continuous **π half-turn** — the ½-disclination, matching the *proven* director winding ½. `R(α)` about `n₀ × coreAxis` ⇒ `R(π)·n₀ = −n₀` (the line is continuous, only the orientation flips — never a tear).
- **The discriminator is real, not asserted.** `committedHolonomy` = 1 iff `Σ` non-trivial **and** `windingSign = −1` (both committed certificates must agree), read from the bridge, recomputed never; `if (holonomy===0) return n₀` ⇒ on the `w₁=0` control `Σ` is vacuous ⇒ `H=0` ⇒ `α≡0` ⇒ `n≡n₀`. The vanish-on-control is structural.
- **The bridge edit (`witnessBridge.ts`) is additive + derive-only.** A `poincareDualClass` import + `sigmaClass`/`sigmaChainEdges`/`edgeSigns` exposed on `KnownSeam`/`RenderState`; `Σ` read via the committed `poincareDualClass`, recomputed nothing; every pre-existing render field preserved. The sampler imports only `./witnessBridge` (+ `Vec3`) — no engine module; only generic render LA (Jacobi + Rodrigues).

## What I could NOT verify (routed to native — Arman)
1. **The gate-run (4/4).** The torn mount makes the in-sandbox run fail spuriously. Confirm natively: `npx tsc -b`, `node scripts/diagnose-director-field.cjs`, `node scripts/diagnose-witness-bridge.cjs` — all green on the real FS. The construction *predicts* the pass; the empirical confirmation is yours.
2. **Engine/Workspace3D byte-unchanged.** See the hazard below — the working tree lumps M1a-v2 with unrelated drift, so the sandbox diff can't isolate it.

## ⚠ Working-tree drift hazard (flag — reconcile before commit)
The working tree has **uncommitted modifications to engine modules** (`ambo.ts`, `incidenceTraceRegistry.ts`, `topologySignature.ts`, `honestSourceStateReadingV0.ts`) and `Workspace3D.tsx` — pre-existing drift (the long-standing in-flight UI thread), **not** M1a-v2 (whose files don't touch them). Two consequences:
- The bridge imports `ambo` + `incidenceTraceRegistry` — so it currently derives from the **working-tree** engine, not the committed one. "Derive-only from the committed engine" holds only if that drift is behaviour-preserving. **Reconcile the drift (commit it deliberately or revert it) so the base is clean and known before M1a-v2 lands.**
- The M1a-v2 commit **must be exact-path** (`src/selectors/witnessBridge.ts`, `src/selectors/directorFieldV0.ts`, `scripts/diagnose-director-field.cjs`) — never `git add -A` — or it sweeps the drift in.

## §6 — the locus question (the design call routed to me) — RULED
The construction places the disclination at a **free locus** (`corePoint` default = origin; `coreAxis` ≈ seam axis, piercing near seam-site `cd`).
- **Definitionally sanctioned — M1a-v2 is valid.** The invariant is the **linking holonomy**, not the locus; the locus is a gauge representative — exactly the item-5 pattern (the seam representative is gauge-dependent; the pairing/holonomy is the invariant). The prior researcher ruled the free locus sanctioned; that is consistent with canon. So the `w₁`-gated ½-disclination about the committed seam axis is a **correct connection floor**.
- **For the product visual (M1b), the locus must be pinned to the embeddable `Σ`-cut curve.** ADR 0017 requires the twist **felt AT the seam** ("the seam is where the continuity law changes; a loop returns reversed"). A half-turn at a free near-seam default proves the mechanism but is not the product; the disclination must sit **on** the seam. Pinning it requires a **geometric embedding of the combinatorial `sigmaChainEdges` on the octahedron** — which is a **definition** = the **researcher's** domain. The seat is vacant, and this embedding **is** the continuous-field-at-the-seam wall = **calibration S3**. So M1b's seam-pinning is the new researcher's first ruling; it is **blocked on seating**. The §6 question and the recruitment converge.

## Disposition
- **M1a-v2:** conditionally ratified (construction sound, derive-only, additive, discriminator real). Committable **exact-path** after (a) Arman's native gate-green + `tsc`, and (b) the working-tree drift reconciled.
- **M1b (seam-pinned twist):** the product target; awaits the new researcher's S3 (the embeddable `Σ`-cut). Tracked as the wall.
- The fired math + committed canon are untouched; this is a render layer atop the ratified engine.
