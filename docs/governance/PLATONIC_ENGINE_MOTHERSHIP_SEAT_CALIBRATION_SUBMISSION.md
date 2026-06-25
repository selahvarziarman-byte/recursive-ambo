# PlatonicEngine — Mothership Seat: Calibration Submission (4th seating)

**To:** Arman (Sovereign) · **From:** the incoming mothership, candidate · **Date:** 2026-06-25 · HEAD `e775ce3`

Submitted against the bar — becoming ≫ acting; know the engine by reading the **code**; be the archive's historian; commander's posture; **own** posture. I held the chair, ran the pass, and report. This is deliberately **not** a board recitation (turning-point #1).

---

## 0 · Seat, by verification — not on the memo

My durable memory said TECHNICAL OFFICER. I did not accept the mothership memo on faith; I verified. The chain: the morning `COWORK_SEAT_HANDOFF` is stamped **SUPERSEDED — "wrong seat (claimed mothership)"** and the space genuinely *was* TO then (the anchor's origin). Later today the seat moved — commit `e775ce3 "mothership 3 to mothership 4"`, `MOTHERSHIP_SEAT_INITIATION` (15:01), and a campaign handoff naming my exact hazard: *"durable memory carries a stale TECHNICAL OFFICER anchor… do not inherit it."* I also ran the doctrine's own trap — a memo *"To: Mothership"* proves it's a seat you escalate *to*; this is the **inverse** (an outgoing mothership seating its successor), so it doesn't fire. **Anchor repaired** in memory (TO demoted to ops-reference; current seat = MOTHERSHIP). Memory writes work here — the prior seat's *"writes failing / outside connected folders"* was a wrong-path artifact, which I reproduced and corrected. That AT-RISK item is **clear**.

## 1 · The engine, cold (read in code, this session)

Live core ≈ **5.6k lines / 9 files** sitting on ~73k of **killed legacy** (field / octonion / fano / moufang / medial). First historian fact: do not mistake the mass for the engine. Operation by operation:

- **`lineage.ts` (62)** — the one charge. `primalMultiset` recurses `createdBy.sourceVertexIds` to source-less seeds (with multiplicity); `primalMultisetKey` = sorted `id×count`, injective. **Single-sourced** so the generation-side B-twin key and the transformation-side homogeneity criterion can never drift.
- **`transformationLedger.ts` (384)** — `forward` (partial fn; `null` = cut) + set-valued `pullBack`. `certifyFaithfulness`: a result site is homogeneous iff ≤1 source **or** all sources share `lineageOf`; `operationStatus` FAITHFUL iff no heterogeneity **and** no silent drop. The P8 signed layer (`buildSignedIdentification`, `boundarySign` read off oriented `[A,B]`, `certifyOrientation` = w₁ over cycles, signs compose) is **orthogonal** — no third clash class; faithfulness reads the unsigned pull-back, orientation the signed, neither the other.
- **`surfaceOperations.ts` (390)** — glue / flip-glue / collapse as thin **derive-only** wrappers over the committed certifiers. `boundaryEdgeSign` = +1 antiparallel (preserving) / −1 parallel (flip); the sign is read off **half-edge ends**, so it survives even when vertex supports collapse to `[S,S]` (torus / Klein). `collapseFace` now quotients the **whole** boundary → χ=2.
- **`cascadeDriver.ts` (737)** — ADR 0004's "incidence FORCES, certifiers CHECK." `runCascade` (downward ∂ fixpoint; **JOIN**, so faces survive), `runCutCascade` (upward ∂ᵀ, the dual), `runCollapseCascade` (D²/∂D² = S², μ 9→2), `certifyCascadeOrientation` (w₁ as a face **2-colouring** parity-union-find), `assertOpSet` (pure-∂ / pure-∂ᵀ, **throws** on mixed), and honesty / termination / confluence as **read-only overlays** whose clash oracle is the *committed* faithfulness law (single-sourced, never reimplemented). "Added by adding, never by reshaping" is real in the code.
- **`incidenceTraceRegistry.ts` (965) / dual (`dualization`, `dualView`)** — *(honest scope: verified by running its diagnostic green through P7 and seen via `decomposeLink` in the zoo; understood by role as the bijective baseline the ledger lifts — not yet full line-read. I'll close that read before leaning on its internals.)*

**Sharp observation that only reading the code yields:** there are **three** w₁ computations, one per layer — the zoo's per-pair cycle sign-product, the cascade's face-2-colouring, and the global H₁-cocycle multiset — mutually cross-checked against orientability, the global one the finest (it alone separates Klein `[0,1]` from RP² `[1]`). The docs don't spell this out.

## 2 · Ratified by verification — I ran them, and read the greens for their claims

- **`diagnose-global-w1` (5th necessity)** — real values: torus `[0,0]`/orientable, Klein `[0,1]`/non-orientable, RP² `[1]`/non-orientable. The Klein≠RP² seal tests **both** length and content differ; `§W-teeth` reproduces turning-point #6's degeneracy trap (raw RP² wrongly reads `[0]`) and proves the subdivision flips it to `[1]`; an independent 2-colouring cross-checks; `Shape byte-unchanged` confirms derive-only.
- **`diagnose-level2-zoo`** — `collapseFace` χ=2 (S²), and the **regression guard asserts the seal has TEETH**: the old vertices-only collapse (χ=−2 wedge) **fails** the χ===2 seal. Turning-point #4 is closed — the green now encodes sphere-*ness*, not which vertices merged. §J cross-checks `collapseFace` vs `runCollapseCascade`.
- **`diagnose-cascade` / `-transformation-ledger` / `-incidence-trace-registry`** — green through their frontiers (cascade 2a→4; ledger P6; registry P7); fail-loud guards real (`assertOpSet` throws on mixed / +2 hop; no hybrid inhabitant). Each green I checked encodes its claim, not a proxy.

## 3 · The archive's historian

- **AT REST:** working tree truly clean (CRLF phantom filtered); nothing in flight; local **2 ahead** of `origin/team-arman` (`1c26db7`, `e775ce3`) — your push.
- **CLOSED & VERIFIED:** reductive core; cascade (seal `029f1d99`, **sealed-before-build**, visible at `ad11299` before the driver); `collapseFace` χ-fix; the five structural necessities; the generative-playground picture (ADRs 0008–0011 + CONTEXT.md).
- **STALE → corrected:** TO identity anchor (fixed); board's "re-cut skill need→groundedness" listed *owed* but **already applied** in the loaded skill; board's HEAD `1c26db7` is now `e775ce3`; nested-maps v0 → v2.
- **DEAD — do not reopen:** octonion / field / fano / moufang / medial; cut-elimination / HoTT / Hopf algebraic reading; the "meaty" semantic packet; the **resolution operation** (meaning-into-operation); the anti-monster / named-pressure gate (turning-points #3, #5).
- **OWED (not blocking):** multiset-injectivity re-confirm over **namespaced cross-universe** multisets before born forms lean on it; w₁ subdivision-sufficiency re-verify when the complex grows past the zoo (fallback: orientation double-cover); M5/M7 bridge (low priority).
- **CRISES — resolved:** W-2.C seal remote-exposure → **Option B** (still binds: no history rewrite); a mis-routed cascade build → recovered + cross-office audited; the six drift-corrections in the trail digest.

## 4 · My posture (my own, not the predecessor's)

**Instrument-reader, not gatekeeper.** The engine is small, legible, and "instruments not guards" by its own ADRs; I rule from what the instruments say *when I run them*, and I distrust any map — the board, the skill, my own memory — until I re-ground it. That distrust is what caught the stale anchor, the already-applied re-cut, and the HEAD drift this session. The predecessor's hard growth was learning to **stop defending** a stale fixture; my opposite risk, as a fresh seat handed a clean board, is **over-trusting** a tidy "it's all closed, just charter the enablers." So my discipline is the mirror of theirs: re-ground the closed work (done), and carry the bar that built it — **seal before build, cross-office audit, groundedness-not-appetite** — onto the enablers. And hold the wall hardest exactly where it most wants to leak: the **genealogy DAG**, where "the life of concepts" is most tempted to become structure.

## 5 · The first charter, read — not yet fired (you calibrate first)

**multi-form load-and-assemble + source-namespaced cell ids.** Grounded, not appetite: the arity-≥2 assembly machinery **already exists** (`cascadeDriver.buildJoinSeed` = the same boundary-identification on the disjoint union, ADR 0008), `lineage.ts` already roots source-less primals, and CONTEXT names `(source, primalKey)` as **the only** structural extension multi-universe needs — one mechanism delivers both. Before I'd ring it: **route to the researcher** the lineage rule for product's minted cells (carried vs minted) and the multiset-injectivity re-confirm over cross-universe multisets; **seal** the namespacing's expected `(u1,A) ≠ (u2,A)` co-location-≠-identity cases before any build; **hold the cross-office audit**. Then, in dependency order, the genealogy DAG, then product.

**Calibrate me.**
