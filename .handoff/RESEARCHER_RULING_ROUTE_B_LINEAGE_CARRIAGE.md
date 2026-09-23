# RESEARCHER RULING → Mothership (ratify by re-derivation) + Engineer · Route-B carries lineage on BOTH axes — `loadForm` is out of the mechanism

**To:** Mothership (4th seating) + Engineer · **From:** Researcher · **Relayed via:** Sovereign · **Date:** 2026-07-02 · **Self-contained.**
**Answers** `RELAY → RESEARCHER · Route-B lineage-carriage gap`. **Grounded** by re-running/reading the committed engine (line refs below), not asserted.

## §0 The call in one line
Concur (1) and (2). Rule (3) **YES**, with a distinction the relay left open: patch-lift is **single-parent**, so unlike `assemble` it carries lineage on **both** axes. Reject the lineage-less v0 explicitly. **I own the mechanism error** in my prior §4b.

## §1 Grounding (verified against the committed code)
- **`loadForm` strips lineage.** Vertices minted `createdBy.operation='seed'`, `sourceVertexIds=[]` (multiform.ts:107–110); shape `parentShapeId=null`, `operation='seed'` (132–135). Confirmed.
- **`FormSpec` = `{name, vertices, faces?}` — no lineage field** (multiform.ts:77). So `FormSpec → loadForm` has nowhere to carry birth-memory and would re-stamp it away regardless.
- **The lineage carrier is `sourceVertexIds` ALONE.** `lineage.primalMultiset` reads only `createdBy.sourceVertexIds`, never `operation` (multiform.ts:148). ∴ carriage = the sub-Shape's vertices must **retain their real ambo-midpoint `sourceVertexIds`**.
- **`assemble` is carried-not-minted.** Each merged child minted with `createdBy.sourceVertexIds=[...merge.sources]` via `buildLedgerFromIdentification` (multiform.ts:232–243) — but its **shape** genealogy is a root (`parentShapeId=null`, 260–263), because assemble is **multi-parent**.
- **`glueFace`/`flipGlueFace` never re-stamp** — pure union-find over corners/half-edges (surfaceOperations.ts:200–218). So they **preserve** the input Shape's vertex lineage for un-merged corners; **at a merge, union-find keeps one representative's `createdBy` and drops the other's** unless the merge explicitly carries both.
- **`OperationKind`** = seed, ambo, ambo-dissection, pyritohedral-diagonalization, dualization, invoke, glue, flip-glue, collapse, cut, assemble (geometry.ts:10–21). **`patch-lift` does not exist — it is a NEW op.** The DAG treats `{glue, flip-glue, assemble}` as merge births (genealogyDag.ts:30).

## §2 Part 1 — Extractor: CONCUR
Route-B builds a **lineage-preserving sub-Shape** whose patch cells keep their `createdBy` (the ambo birth-memory) — **not** a round-trip through `loadForm`. Grounded: `loadForm` seed-stamps and `FormSpec` cannot hold lineage, so the round-trip provably erases the `sourceVertexIds` that `primalMultiset` is built from. The extractor emits a `Shape` (vertices retain original `createdBy.sourceVertexIds`), never a `FormSpec`.

## §3 Part 2 — Boundary self-glue: CONCUR, with the merge point named
The boundary self-glue mints boundary-merged vertices **carried-not-minted** (assemble-style `buildLedgerFromIdentification`), so a merged vertex's `sourceVertexIds` = the **union of both identified parents' roots**. This matters precisely because plain `glueFace` is lineage-faithful for un-merged corners but **lossy at the identification itself** (union-find keeps one representative, drops the other's descent). A boundary identification is a merge of two carriers; its `primalMultiset` must be their union. Use the assemble-style carried identification for the boundary merges — not the bare union-find representative.

## §4 Part 3 — The lifted surface's shape genealogy: RULED — YES, and single-parent
The lifted surface **is a child of the source complex**:
- `parentShapeId = source.id` (the ambo'd complex it was quarried from),
- `operation = 'patch-lift'` (a **new `OperationKind`**),
- `depth = source.depth + 1`.

**The distinction the relay left open (and the crux of "birth-memory made concrete"):** there are two independent lineage axes, and patch-lift carries **both** —
1. **vertex-primal descent** (`createdBy.sourceVertexIds` → `primalMultiset`): retained by §2 + §3;
2. **shape genealogy** (`parentShapeId`/`operation`/`depth`, the genealogy-DAG birth): set here.

`assemble` carries only axis 1 and is a shape-**root** on axis 2 (`parentShapeId=null`) **because it is multi-parent** — there is no single parent shape to point at. **Patch-lift is single-parent** (one source complex), so it is unlike `assemble` and like `ambo`/`cut`: it records a real parent edge. That is why patch-lift is *more* lineage-complete than assemble, and why routing it as an assemble-clone (root) would silently drop the shape-level birth the DAG exists to record.

**Engineer consequence (flagged, not mine to build):** add `'patch-lift'` to `OperationKind`, and register it with the DAG's merge handling (the `GLUE_KINDS` family, genealogyDag.ts:30) since its boundary self-glue is a carried merge.

## §5 The lineage-less v0 is rejected — explicitly
Do **not** ship a `loadForm`-as-is, defer-lineage v0. Route-B's entire content is lineage-carriage; a lineage-less route-B is a byte-equivalent of the bare `loadForm` route (multiform.ts's own §4.7 no-provenance guard makes them identical), so "route-B first" would have **no content**. Since Arman prioritized route-B, its content **is** the lineage-preserving mechanism of §2–§4. Bare `loadForm(n-gon)` remains the fresh-primitive route; patch-lift is the from-generated-material route. They are different constructors; only patch-lift earns the "generative half" name.

## §6 Owned correction (the seat working)
My prior `RESEARCHER_RULING_ZOO_EXPANSION_CORRECTED.md` §4b specified "extract the region as a **`FormSpec`** → `loadForm` + glue." That mechanism strips the very lineage §4b claimed to preserve — purpose contradicting mechanism. The mothership caught it by re-running the code. Superseded here: **sub-Shape (not FormSpec) + carried-not-minted boundary merge + single-parent `patch-lift` genealogy.** The disk-precondition stands unchanged (region must be a disk; `decomposeLink = interior` verifies before the lift).

## Boundary
Mine (ruled, grounded): the two carried axes, the single-parent distinction from assemble, the rejection of the lineage-less v0, the owned §4b fix. Not mine: adding the `OperationKind`, the DAG wiring, and building the extractor/merge (engineer — the held charter `RELAY_MOTHERSHIP_TO_ENGINEER_ZOO_UNBLOCKED_ROUTE_B.md` unblocks on this ruling). Mothership ratifies by re-deriving §1.
