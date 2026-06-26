# Charter — Enabler 2: The Persistent Genealogy DAG + OperationKind (the standing object; the shared seam)

**From:** Mothership (4th seating) · **To:** the Engineer office (senior + operating) · **cc:** Researcher (taxonomy, pre-build), Sovereign, TO · **Date:** 2026-06-26 · **Rewrite** (merge-aware, seam-precise; supersedes the 2026-06-26 v1).

The second generative enabler (ADR 0009): the genealogy is the playground's **persistent state and real product**. Built on E1's assembled forms + the committed pull-back; resolves E1's flagged `OperationKind`. **It is also the seam both columns read** — the topological column (lineage / `w₁` / junction) and the now-canonical spectral column (ADR 0012, 0013). This build is **purely topological**; it builds the *structure* the spectral instrument will later read, and **no spectral / `ψ` / operator / Laplacian code.**

## §1 Target
The persistent **genealogy DAG** — the standing, monotone-growing record: nodes = forms, edges = operations (who-born-from-whom, who-died), the arrow = **genealogical depth** (ADR 0009). Forms transient (population consumptive, non-monotone); the genealogy is what lasts and what the user reads. Built by reading the committed pull-back (the parent-pointer) **forward** — no new identity model.
Plus the real **OperationKind**: type each operation/edge (`invoke` / `ambo` / `glue` / `flip-glue` / `collapse` / `cut` / `assemble`; `product` later) — the **sanctioned `geometry.ts` extension**, retiring E1's lineage-inert `'ambo'` placeholder on glued children.

## §2 Grounding
- The pull-back **is** the parent-pointer (`transformationLedger`, committed) — "the genealogy is that ledger read forwards" (ADR 0008). The DAG lifts per-operation pull-backs into one persistent record.
- E1 delivered multi-form assemble with **carried-not-minted** lineage — the births the DAG records.
- The **connection** `U` (ADR 0013's Layer-0 law) is *already built* — the committed signed pull-back / `certifyOrientation` orientation sign. E2 does not build it; E2 only needs to **carry it on the DAG edges** so it is readable along the genealogy.

## §3 Scope
**IN (topological):** the persistent genealogy DAG (nodes / edges / depth; monotone record vs non-monotone population — ADR 0009); the `OperationKind` taxonomy + the sanctioned `geometry.ts` extension; reading the committed pull-back forward; queryable ancestry/descent to roots.

**IN (seam-readiness — build the *structure*, not the physics):** build the DAG / per-incidence registry so the spectral column can later attach **without modifying committed E2 code** —
1. surface the **per-incidence / cell-context slots** (`X_K` = our co-location-≠-identity registry) as a clean, queryable structure (the slots where Layer-1's `ψ` will later live);
2. carry the **orientation sign / connection `U`** (the committed signed pull-back) on each `glue` / `flip-glue` edge, so holonomy along a loop is readable from the DAG;
3. make each **birth queryable as a discrete event** (the DAG already records it) so the future spectral-flow source `J_K` reads it directly.
These are **data/structure exposure** of things already built — **no** Laplacian, holonomy, `γ`, `ψ`, or flow computation in E2.

**DEFERRED:** the Layer-1 connection-wave instrument (separate, later charter — after E2; ADR 0013); product (E3); UI.

## §4 Acceptance (shape; operating engineer seals exact values)
1. DAG built from a real multi-operation sequence (e.g. `invoke → ambo → E1 assemble`): nodes/edges correct; every node traces to its roots via the committed pull-back.
2. **Monotone record:** births and deaths both add nodes; the record never shrinks (vs the consumptive population).
3. **Depth = the arrow:** every child deeper than its inputs (`generationDepth` lifted); ascent not forced.
4. **OperationKind:** each edge carries its kind; glued children no longer mislabeled `'ambo'`; lineage still reads only `createdBy.sourceVertexIds` (kind lineage-inert unless the researcher rules a kind *mints*).
5. **`geometry.ts` extension additive + regression-guarded:** the no-`OperationKind` path is byte-identical; all existing diagnostics green.
6. **Seam-readiness (structural, not spectral):** the registry exposes the per-incidence slots; `glue`/`flip-glue` edges carry the orientation sign `U`; births are queryable as events. Assert the *data is present and correct*, not any flow/holonomy value.
7. **TOOTH:** a degenerate/false genealogy (a cycle; or a child that does not trace to its recorded parents) is **rejected** by the DAG's invariants.
8. No regression.

## §5 Disciplines
Seal-before-build (operating engineer seals; senior reviews before the coder); cross-office audit; the `geometry.ts` extension is **sanctioned** (mothership ruling — as `lineage.ts` was for E1) but minimal + regression-guarded; never `git add -A`; commit is Arman's. **Forward-additive design:** the seam must let Layer 1 attach later by *adding*, never by editing committed E2 code (the same "added by adding, never reshaping" law).

## §6 Routing
- **→ Researcher (pre-build):** pin the `OperationKind` taxonomy + the per-kind lineage rule (carried-vs-minted; forward-compatible with product/E3); pin the canonical DAG example with numbers.
- **→ Engineer office:** seal + prompt + audit the DAG + `OperationKind` + seam-readiness build (topological).
- **→ Arman:** native commit.

## §7 Done
A new diagnostic green asserting §4 (including the tooth and the structural seam-readiness) through the real committed modules; all existing diagnostics green; one verdict to the mothership; the DAG/registry standing as the seam the Layer-1 instrument will later attach to **by adding**.
