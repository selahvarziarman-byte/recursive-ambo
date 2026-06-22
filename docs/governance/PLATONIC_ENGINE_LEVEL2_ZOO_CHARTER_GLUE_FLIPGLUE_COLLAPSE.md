# Charter — The Level-2 Zoo: glue · flip-glue · collapse (one ultracode step)

**From:** mothership · **To:** engineer/prompter · **Status:** chartered (bigger step, ultracode ON)
**Authority:** the built certifiers + the first loop (ratified). No gate, no ceremony — the next operations.
**Substrate (verified this session):** first loop green (`diagnose-close-edge-into-circle` 31 PASS / ALL PASS); `decomposeLink(adjacency: Map<string,string[]>)` is **adjacency-based / dimension-agnostic** (registry 107 PASS / ALL PASS); `Face.vertexIds` is the oriented boundary cycle; `buildSignedIdentification` / `certifyFaithfulness` / `certifyOrientation` / `boundarySign` unchanged.

## Why this is the right bigger step

The engineer's road-split is ratified: this leg is **code-risk, not concept-risk** — each operation is a thin derive-only wrapper feeding the **unchanged** certifiers, on an isolated 2-cell it's one identification batch (one pass, the circle's exact shape one rung up), and the three operations **share everything** (a ~10-line `boundaryEdgeSign`, a ~5-line `faceEdgePairs`, then the per-operation identification-building). That is precisely the profile where **ultracode + a bigger step** is correct. And the payoff is the milestone: the first **real `w1 = 1`** — a genuine non-orientable surface (flip-glue → Möbius/Klein), the orientation layer that P8 only ever exercised synthetically, finally fired on real material as **faithful data**.

## Scope — build, in one run

- **glue** (orientation-preserving edge-pair identification) → cylinder (one pair) · torus (both pairs)
- **flip-glue** (orientation-reversing) → Möbius (one pair) · Klein (one preserving + one reversing) · RP² (both reversing)
- **collapse** (whole boundary → a point) → sphere
- Shared new code only: `boundaryEdgeSign` (level-2 sibling of `boundarySign`) + `faceEdgePairs`, then per-operation identification-building.
- **On isolated 2-cells**: one identification batch each, one pass, **no cascade** — runs on the driver we already have.
- **Derive-only**: do not mutate the source Shape; do not modify the committed certifiers (feed them level-2 input; if you hit a real gap inside a certifier, surface it as a finding — don't patch silently).

## Step-size & checking (the ratified ultracode doctrine)

- **ultracode ON.** Bigger step; the 30-lens self-check carries the implementation volume.
- **The cross-office audit does NOT relax.** Ultracode is the coder checking itself; the audit is a different office checking the coder. Both run.
- **Seal each operation separately** even inside the one run — glue→torus, flip-glue→Möbius with `w1=1`, collapse→sphere — so the audit stays per-operation falsifiable.

## Watch-items — concept-risk, surface-first (ultracode does NOT cover these)

These are caught by reading the substrate, not by code review. Bigger step amplifies them, so hold them tight even with ultracode on:

1. **The bigon ruling.** If any operation produces a 2-vertex / 2-cycle link (a `collapse`, or a degenerate gluing), the dormant bigon question (interior vs boundary) goes **live**. **Surface it to the researcher — do not guess, and do not paper it with a code-fix.** This is the one most likely to wake at level 2.
2. **The level-2 adjacency is yours to get right.** `decomposeLink` accepts *any* adjacency, so a **wrong** vertex-link passes silently. The audit must check the adjacency **is** the correct level-2 vertex-link — not merely that `decomposeLink` ran.
3. **Faithfulness verdicts are findings, not failures.** A level-2 glue may report heterogeneous (co-location ≠ identity, one rung up). Seal it, read it; it is not a bug.

## NOT in this charter — held separate

The **cascade driver + forcing oracle** (ADR 0004's fixpoint closure — the work-list loop and the incidence-forcing oracle, plus extracting `buildVertexLinkAdjacency` from `buildSiteGlueCoh` and the real-incidence recompute) is **greenfield, concept-risk**, for multi-cell operations that actually force a cascade. It is its **own later, tighter step** — ultracode helps its code but not its design collisions. The level-2 zoo on isolated 2-cells **does not need it**, which is exactly why this leg can be big.

## Seat process

Write the prompt; **tag it ultracode**; seal per-operation expected values; prompt the implementer; **audit the diff cross-office** (ultracode does not replace it); commit native by Arman. Seal discipline — nothing unrevealed on the branch.

## Done =

glue / flip-glue / collapse each producing their surface, with ledger + faithfulness + orientation + valence computed on **real level-2 material**, sealed per-operation and asserted green — **including the first real `w1 = 1`.** The whole orientable + non-orientable surface zoo, on real input, on the driver we already have.
