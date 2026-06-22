# Surface Zoo — REPORT + next-charter request (engineer/prompter seat → mothership)

**Status:** the lossy operations are built, audited, committed, and pushed on `team-arman` through **level 2** — the whole surface zoo on real material, orientable and non-orientable. The milestone landed: the first real `w1 = 1`. Reporting up, and requesting the next charter.

---

## 1. What is now built (on real input, derive-only, one pass)

- **Level 1 — `closeEdgeIntoCircle`** (`3681388`): a real edge closed into a circle (S¹), faithfulness recording co-location ≠ identity, `w1 = 0`, the level-1 (S⁰) valence member.
- **Level 2 — the surface zoo** (`6849e7b`): glue → **cylinder / torus**, flip-glue → **Möbius / Klein / RP²**, collapse → **sphere**, each on a real cube-seed square, sealed per-surface (ultracode run).
- **The bigon close** (`7b3cce6`): `decomposeLink`'s ≥3-vertex floor retired — the campaign's first committed-certifier change, per the researcher's level-2 bigon ruling.

The committed certifiers carried all of it **unchanged** except the one ruled floor-drop: `buildSignedIdentification` / `certifyFaithfulness` / `certifyOrientation` / `boundarySign` / `decomposeLink`. Each operation is a thin derive-only wrapper; no source Shape is mutated.

## 2. What this completes

- **The orientation layer fires for real.** P8 built the signed pull-back + w₁ but only ever exercised it on synthetic cycles. Möbius / Klein / RP² now produce genuine `w1 = 1` non-orientable surfaces on real material — orientation recorded as faithful data, sealed as **OR over one-cycle-per-pair** (RP² is the discriminator: two flips give `w1 = 1`, not the parity `(−1)(−1) = +1`).
- **Faithfulness, one rung up.** Every surface reports `UNFAITHFUL` (the cube square's four distinct-lineage corners glue heterogeneously) — co-location ≠ identity, exactly the level-1 finding lifted to level 2. The finding, not a failure.
- **The dimension-indexed classifier is closed at both rungs.** Level-1 (`classifyLevel1Link`, S⁰ degree test) + level-2 (`decomposeLink`, S¹ single-cycle test), both now floor-free — one principle: test the topological sphere `Sⁿ⁻¹`, never a simplicial vertex count. The bigon thread (level 1 degree-2, level 2 RP² 2-cycle) is shut.

## 3. The honest edges (what is NOT yet built)

- **Still one-pass, isolated 2-cells.** Every operation so far is a single identification batch — no cascade. They run on the one-pass driver; nothing forces a further identification.
- **The forcing oracle + cascade driver are greenfield.** This is CONTEXT.md's named open NEED and ADR 0004's systemic-trace closure — the module's deepest layer. It needs: the incidence-forcing oracle (which identifications force which — a domain-topology question, not a certifier), the work-list fixpoint loop, the real-incidence degree recompute (forward note 1 from the first loop), and a small refactor extracting `buildVertexLinkAdjacency` out of the registry's `buildSiteGlueCoh`. Unbuilt.
- **`cut` is unbuilt as a real operation.** The ledger already models it (T2 P5: `forward[s] = null`, logged → FAITHFUL, silent → UNFAITHFUL), but no real removal operation is wired to it.
- **`product` and level-3** are further out: product is the binary, lossless, merge-free member (outside the faithfulness clash calculus); level 3 (S² inhabitants) needs the unbuilt S² member of the classifier.

## 4. The next charter — the engineer's read (the call is yours)

Two live candidates, on opposite ends of the risk axis:

- **`cut` — the quick completion · code-risk-low, concept-risk-low · tight step, standard run.** The last atomic member of the operation set after glue/flip-glue/collapse. A thin derive-only wrapper over the *already-ruled* P5 cut machinery (a source → ∅, a logged loss); the faithfulness verdict is already sealed. It finishes the lossy-operation members on real material and is a clean, low-surface build. It also hands the cascade driver a *complete* one-pass operation set to later make cascading.

- **The cascade driver + forcing oracle — the deep frontier · concept-risk · tight step (ultracode helps its code, not its design).** The systemic trace, the picture's named open NEED — where an operation finally *forces* further identifications and the closure runs to a fixpoint. Greenfield, touches the committed registry, and the forcing oracle is full of design decisions (what forces what, when a forced merge is a clash, how the cascade terminates). This is the substantive next layer, and the one to hold tight even with ultracode on.

(`product` and level-3 I'd hold until the cascade exists — they build on it or on a new classifier member.)

**My recommendation, deferring to you:** take **`cut` next** as a quick, low-risk completion of the operation members — it warms the path and leaves the cascade driver with the full atomic set to generalize — then charter **the cascade driver** as the deep step after. But if you'd rather go straight to the frontier, the cascade is the named open NEED and I'll seal it tight.

Requesting the next charter.
