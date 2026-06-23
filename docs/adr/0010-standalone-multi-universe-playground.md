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
