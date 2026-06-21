# Target 2 — CLOSE REPORT (engineer/prompter seat → mothership)

**Status:** Target 2 (transformation ledger + faithfulness certificate) structurally complete on `team-arman`. Both ratified targets of this seating are now built, exercised, and committed. Submitted for the mothership's ratification of the close.

**Method/scope (unchanged from the ratified spec):** `method = transformation-ledger-v0`, `scope = transformation-only`, `semanticStatus = not-semantic-naming`, `shapeMutationStatus = not-shape-mutation`. Operations remain GATED (§8): the ledger and certifier are the deliverable, exercised by *simulated* glue / quotient / cut over existing sites — no shape-mutating operation was built, by design.

---

## 1. What was built

Two source files plus a diagnostic, all on the committed spine:

- **`src/lib/lineage.ts`** — the single canonical lineage primitive. `primalMultiset(siteId, shape, memo)` (recursive seed-ancestor multiset = the conserved charge) + `primalMultisetKey(multiset)`. Extracted byte-identical from the registry at P2 and imported by *both* the registry (B-twin grouping) and the ledger (homogeneity) — one definition, two consumers, regression-guarded.
- **`src/lib/transformationLedger.ts`** — the ledger + certifier. Exports: `buildLedgerFromDual` (the dual's six maps flattened to one `forward` + set-valued `pullBack`), `buildLedgerFromIdentification` (a `resultOf` partial function → ledger; null image = cut, shared image = glue), `shapeLineageOf` (memoized lineage lookup), and `certifyFaithfulness(ledger, lineageOf, removedLog)` → the `FaithfulnessCertificate`.
- **`scripts/diagnose-transformation-ledger.cjs`** — 84 falsifiable checks, `ALL PASS`, exercising every certifier surface on a real multi-generation octahedron fixture (44 midpoints, 4 B-twin groups).

The ledger generalizes the dual's bijective `SemanticDualModel` (three inverse pairs) to a partial, set-valued map: `forward: srcId → resId | null`, `pullBack: resId → srcId[]`. Glue = non-injective pull-back; quotient = pull-back is the equivalence classes; cut = forward null.

## 2. The faithfulness law, as sealed

A transformation is **faithful** iff its ledger satisfies all three clauses, exercised on real data:

- **Clause I — homogeneity.** Every pull-back is lineage-homogeneous (all sources share one lineage). Sealed both ways: homogeneous B-twin glue → FAITHFUL (P2); different-lineage glue → `lineage-heterogeneous`, UNFAITHFUL, conflict recorded (P3); and at size 3 — a >2-way conflict recorded *in full*, never collapsed to a pair (P6 §B).
- **Clause II — logged loss.** Every cut is recorded; a *logged* removal is faithful, a *silent* drop is not (P5 §A: same cut ledger, `removedLog=[cut]` → FAITHFUL vs `[]` → UNFAITHFUL).
- **Clause III — honesty.** Never fabricate identity, never silently drop. A heterogeneous pull-back yields `inheritedLineage = null` and status `lineage-heterogeneous` (never an invented shared lineage; never the semantic layer's word "intelligible").

`operationStatus = FAITHFUL` **iff** `heterogeneousCount === 0 AND removedSilentCount === 0`. P6 §A makes this an explicit truth table: a single ledger carrying *both* a glue and a cut, certified three ways — homogeneous-glue + logged-cut → FAITHFUL (0/0); same ledger silent-cut → UNFAITHFUL via clause II alone (0/1); heterogeneous-glue + logged-cut → UNFAITHFUL via clause I alone (1/0). The two failures fail for *different* clauses, which is what proves the status is the AND of both, not a disjunctive shortcut.

The **maximal faithful quotient** (§4) is exercised: mapping each site to its lineage key collapses 44 sites → 40 classes, FAITHFUL, with scope recoverable through the set-valued pull-back (projects scope × lineage ↦ lineage). The **coincidence corollary** (§5) is measured, not legislated: on this body lineage-equality ⟺ position-coincidence (partitions 40 == 40), and a position-proposed quotient is RATIFIED by the lineage certificate — coincidence *proposes*, the certificate *ratifies*; it is never the criterion.

## 3. Build spine (commit-contiguous, `team-arman`)

```
786bb40  T2 P6 hardening — mixed glue+cut truth table + heterogeneous pull-back size 3
bc53785  T2 P5 — cut (logged/silent, clause II) + coincidence corollary; §7 complete
0c72fc4  T2 P3+P4 — heterogeneous glue (UNFAITHFUL) + lineage quotient 44→40 (maximal faithful)
c227e5e  T2 P2 — extract lineage.ts (single-source, regression-guarded) + B-twin glue → FAITHFUL 44→43
887b61e  T2 P1 — ledger + certificate over the built dual; bijective baseline FAITHFUL (62 sites)
```

Target 1 (the foundation Target 2 reuses) closed earlier on the same spine: `0086be0` (P5, registry v0 complete) ← `5496e9c` ← `78f191f` ← `83bc5aa` ← `dd240f6` (P1). The registry's `primalMultiset`/`primalMultisetKey` became `lineage.ts` at T2 P2, so the two targets now share one lineage definition.

## 4. The exercise surface (what the certifier is demonstrated to do)

Bijective baseline (62 sites, dual) · homogeneous glue · heterogeneous glue at size 2 *and* size 3 · lineage quotient 44→40 · cut logged *and* silent · coincidence corollary (both directions) · mixed glue+cut across all three clause states. The coder's standing note: no unexercised compound case remains — further hardening would be redundant exercise, not new coverage.

## 5. Honest boundaries (what is NOT claimed)

- **Operations are GATED.** The certifier judges *simulated* identifications (`resultOf` functions over existing site ids). No operation that mutates the complex was built. Wiring the certifier into a live shape-mutating operation (un-gating) is explicitly out of this target's scope (`not-shape-mutation`) and would be a separate, mothership-chartered target.
- **Lineage injectivity is verified, not proved.** The primal multiset is verified injective to 62 leaves on the built bodies; a general injectivity proof remains open.
- **This is the structural/transformation half, not the semantic-naming half.** The ledger tracks identity descent (lineage as the conserved charge); it does not assign meaning. `semanticStatus = not-semantic-naming` stands.

## 6. Deliverables confirmed + seat boundary

Both ratified targets delivered: Target 1 (incidence-trace & square-coherence registry v0) and Target 2 (transformation ledger + faithfulness certificate v0), each built across surgical implementer prompts, audited against sealed expected values, and committed natively at the mothership's gate. The engineer seat held throughout: prompts and audits authored here; engine code written only by the implementer; definition questions routed to the researcher; every commit fired by the sovereign. Awaiting the mothership's ratification of the close and direction on whether a successor target (un-gating to a live operation, or the injectivity proof) is chartered.
