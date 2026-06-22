# Charter — The Cascade Driver (the systemic-trace fixpoint closure)

**From:** mothership · **To:** engineer/prompter · **Status:** chartered — the deep step. **Concept-risk, TIGHT step. Explicitly NOT an ultracode-big-step.**
**Authority:** the researcher's cascade design v1 — ratified-with-amendments, Q1–Q4 closed, three threads pinned (mothership-audited 2026-06-22); ADR 0004 (systemic trace = fixpoint closure; *incidence forces, the certifiers check*).
**Substrate (verified this session):** mount clean (registry 949/949; diagnostics green — registry 117 / loop 31 / zoo 77 / cut 19); certifiers (`buildSignedIdentification`, `certifyFaithfulness`, `certifyOrientation`, `decomposeLink`) unchanged; the atomic op set (glue/flip-glue/collapse/cut) landed on real material; the link-adjacency construction lives inside `buildSiteGlueCoh`.

## Intent

Build the driver that runs an operation's seed identification **to a fixpoint** — ADR 0004's named open NEED. This is where the module first operates on real **connected** material (not isolated cells), where the **signed pull-back is actually computed** (matching composing along chains; net −1 cycles surfacing as non-orientability / junctions), and where the systemic trace becomes real. The driver is the **forcing engine**; the built certifiers are the **overlay that checks** — never the other way around.

## Build to the ratified design

**1. The oracle (Q1) — incidence congruence closure of the seed.**
- **Seed**: an operation-specific, **full-dimensional** identification — it must name every cell it merges at *every* dimension (the full-dimensional-seed discipline: lower-dim coincidence never forces a higher merge — co-location ≠ identity at the cell level).
- **Two productions to a fixpoint**: (1) equivalence closure (union-find per dimension); (2) **boundary-matching (F1)** — identified same-dim cells force their matched boundary cells identified, via the attaching map, **carrying the sign**.
- Matching composes along chains (`ψ∘φ`, signs multiplying) = **the signed pull-back**. A net −1 cycle = non-orientability / junction — **recorded, never aborted**.

**2. The two dual modes (the crux).**
- **Identification (glue/quotient): DOWNWARD along ∂** — forces matched boundary cells; never upward (same-boundary never forces a merge).
- **Removal (cut): UPWARD along ∂ᵀ** — forces co-boundary removal (a cell can't survive losing a boundary cell); never downward (removal leaves the boundary standing).
- **Collapse: the HYBRID** — ∂-merge on 0-cells + ∂ᵀ-rewrite/removal on ≥2-cells (dimension-disjoint).
- Nothing else forces: lineage (B-twins), coincidence, manifoldness only **check**.

**3. The pinned laws — build to these exactly.**
- **Signed matching-composition (Z/2):** edge — endpoints by sign (`+` head-head/tail-tail, `−` head-tail); face — boundary edge-cycle by rotation (`+`) or rotation+reflection (`−`). Put the mechanical per-type table in the build prompt.
- **Viability floor:** a cell collapses when its boundary becomes **empty** (≥1 boundary cell is viable — monogons/bigons valid per the dimension rulings). Boundary only shrinks → monotone.
- **Op-set invariant — ASSERT in code:** every op is pure-∂, pure-∂ᵀ, or a dimension-disjoint hybrid. A future op forcing a merge **and** a removal on the **same** cell requires a **"removal wins"** precedence rule. The driver must fail loudly if that invariant is violated without the rule — confluence depends on it.

**4. The honesty overlay (Q2) — instruments, not guards, in two modes.**
- merge-honesty (lineage-homogeneity) rides ∂; removal-honesty (logged-not-silent) rides ∂ᵀ; collapse triggers both.
- **Annotate each forced change with the specific pair AND the production/path that forced it** (provenance). Never abort; the end-state verdict summarizes.

**5. Termination + confluence (Q3/Q4) — assert the certificates.**
- μ (distinct cells across dimensions) strictly decreases under merge-or-delete, bounded below → halts. **ASSERT no cell-creation mid-cascade** (product grows cells and stays OUTSIDE the cascade).
- Confluence is closed (Newman + the monotone floor + dimension-disjoint commuting) → the trace is **order-independent**. The build inherits this *only while the op-set invariant holds* (point 3).
- **Fixpoint test the driver runs:** closed under (F1)+equivalence AND no cell carrying a removed boundary/co-boundary obligation — one full sweep yields zero new merges and zero new removals; the work-list drains.

## The behavior-preserving extraction (first build step)

Extract `buildVertexLinkAdjacency` out of the registry's `buildSiteGlueCoh`. This is the **second committed-registry change**, so it is a **pure refactor**: `buildSiteGlueCoh` still calls the extracted function, identical behavior, **registry diagnostic green (117) before and after**. Surfaced → done → tested, exactly like the bigon floor-drop. If the extraction can't be made behavior-preserving, that is a finding — stop and surface it, don't reshape the registry to fit.

## Reuse the certifiers unchanged

The driver **feeds** the certifiers the forced identifications and the post-cascade links/cycles; `certifyFaithfulness` / `decomposeLink` / `certifyOrientation` are the overlay, not modified. A real gap inside a certifier is a finding to surface, not a silent patch.

## Step-size & checking

**Tight, per-step, concept-risk.** Ultracode is welcome on its *code*, but it does **not** substitute for the design discipline or the audit — the design is ruled, the realization is where collisions hide. **The cross-office audit carries the weight.** Seal a grounded end-to-end example before building: a two-square face-glue settling to a fixpoint (μ strictly down); a flip-cycle surfacing as a recorded sign-cycle (non-orientability, not an abort); a lineage-heterogeneous forced merge annotated and the cascade continuing. Commit native by Arman. Seal discipline — nothing unrevealed on the branch.

## Done =

The driver runs a real, full-dimensional seed on real **connected** material to a fixpoint — identifications propagated downward (∂), removals upward (∂ᵀ), the signed pull-back computed (net −1 cycles recorded as non-orientability/junction), each forced change annotated with its pair+path by the two-mode honesty overlay, terminating and confluent, the certifiers carrying it unchanged — sealed and green. The systemic trace, real on the engine's own material. After this: `product` and level-3 (each on its own classifier/structure, no longer blocked).
