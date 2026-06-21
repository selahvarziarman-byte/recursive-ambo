# 0004 — The systemic trace is a fixpoint closure over the metric-free web, reusing the built certifiers

A new relation x~y propagates as a **closure to a fixpoint** through the engine's metric-free data — the **lineage web** (wherever x's or y's primal-multiset recurs) and the **incidence web** (the cells they bound) — each forced identification possibly forcing the next. The per-step checks **reuse the committed certifiers**: the faithfulness certifier (`transformationLedger`) flags any forced identification that is lineage-heterogeneous; the registry's `GlueCoh` flags any that would break manifoldness.

## Why it matters

The module's most novel layer (the systemic, universe-wide trace) is thereby a closure over *existing* structure, validated by *already-built* code — not new machinery. It also keeps the systemic trace **structural** (it propagates identifications and clashes, never meanings) and **metric-free** (it runs over lineage/incidence, never positions).

## Open / gated

The closure **driver** (the propagation engine) is unbuilt; the certifiers it calls are built. The topological operations it would trace remain GATED — this records the trace's *shape*, not an enacted operation.
