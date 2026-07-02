# 0010 — The playground is standalone and multi-universe; primals are namespaced by an opaque source

The playground is **separated from ambo** — its own space, not a region inside any one ambo run. Material enters two ways:

```txt
INVOCATION : invoke a primitive form from scratch (a line, a square — dim-1 up), label its vertices.
             Its vertices are source-less primals; the genealogy roots at the invocation.
             (= the engine's seed mechanism, generalised below the 3D seeds.)
LOAD       : save an entity (a face / cell / edge) out of an ambo universe and load it as a
             SELF-CONTAINED SNAPSHOT — its structure, its inert labels, and its tagged roots all
             travel with it. Snapshot, never a live link (Ground Plan §5.3).
```

## The "ultimately great" part — multi-universe

Many ambo universes (naming-processes) can be saved, and the playground can load entities from **different** universes at once, each keeping its own genealogy. The playground is a **meeting-place for naming-processes**: arguments grown in different worlds, brought together, combined, each piece still tracing home.

## The one structural extension

```txt
NAMESPACE each primal by its source:  (universe-id, primalKey)  or  (invocation-id, …)
```

That is the whole cost. Consequences:

- **Opaque id (chosen).** The source-id is pure provenance — a name, not a doorway. Everything the playground needs (structure, labels, roots) travels with the snapshot, so the playground never reaches back into a universe (no drill-back; rejected as load-bearing — would re-import the universe's internals and break "snapshot, not live link").
- **Sealed except by explicit glue.** Two universes' material never auto-identifies; the only way universe-1 and universe-2 ever touch is a glue the **user** performs, recorded with **both** provenances. **Co-location ≠ identity, across universes.**

Grounded in Ground Plan §4.5 (independent process space), §5.3 (snapshot before live link), §6.3 (import named marks with provenance; keep topology state independent of the source `Shape`).

## Amendment (2026-07-02 — sovereign-directed, mothership-formalized): invocation is distinct-primal only; identified forms are BUILT, not invoked

**Invocation mints DISTINCT, source-less primal vertices** — lines, polygons, n-gons. A form that *begins with identified / collapsed vertices* — torus, Klein, RP², the whole glued zoo — is **BUILT, not invoked**: it arrives via the op-set (invoke a polygon → `glue` / `flip-glue`) as a **born child carrying lineage**, never as a primitive. (Line 6 above, "a line, a square," is hereby read strictly: distinct-primal only; it never licensed invoking a glued surface.)

**Why (grounding):**
1. **It is the lineage ontology.** Invocation *mints* distinct primals (each vertex its own root). An *identified* vertex is the **result of an identification** — i.e. of an operation with carried lineage. A glued surface is therefore a **birth**, not a primitive; putting it in the invocation catalogue would mint-as-primal something that is really a carried-lineage child, contradicting ADR 0008/0009 and the carried-not-minted law.
2. **It dissolves the render problem.** The ratified zoo surfaces as *minimal CW quotients* do not render as recognizable forms — a torus from a fundamental square is 1 vertex / 2 edges / 1 face (a point with self-loops); RP² cannot embed in R³. "Invoke a torus and *see* it" had no faithful rendering. Under this refinement you never invoke a torus — you **build** it from a rendered polygon via a *visible* glue, and the render question moves to the **op-set**, where the operation supplies fundamental-domain context (the natural representation is the polygon with identification cues — ADR 0011's mirror).

**Consequences.**
- **G1 (invocation catalogue) is distinct-primal polygons only** — segment/2-gon, triangle, square, pentagon, hexagon, parametric `nGon(n≥2)`. Built + ratified 2026-07-02 (`src/playground/primitiveCatalogue.ts`).
- **The zoo is reached at the op-set step** (invoke a polygon → `glue`/`flip-glue` → born surface), not at invocation.
- **The "render a glued surface faithfully" question is parked at the op-set** — reopen there with the mothership (product intent) + researcher (faithful representation), per `.handoff/RELAY_ENGINEER_TO_RESEARCHER_SURFACE_RENDERABLE_REPRESENTATION.md`.
