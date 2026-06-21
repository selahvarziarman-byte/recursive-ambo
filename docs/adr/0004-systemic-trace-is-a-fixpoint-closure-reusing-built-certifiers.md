# 0004 — The systemic closure: incidence forces, the certifiers check (instruments, not guards)

A new relation propagates as a **closure to a fixpoint** driven by **incidence** (topology): gluing forces boundary cells to coincide, and each forced identification may force the next through the **incidence web**. The committed certifiers are an **overlay**, not part of the forcing — **faithfulness** (lineage-homogeneity) and **`GlueCoh`** (manifoldness) are consumed **per-step as annotations** on what incidence forces, and summarised as an **end-state verdict**. They are **instruments, not guards**: a clash *annotates*, it never aborts and never forces a merge.

## Why the redraw (a defect found in read-back, before the driver was built)

The earlier draft propagated through "the lineage web **and** the incidence web, each forced identification forcing the next." That makes **lineage-equality force identification** — which would auto-merge **B-twins** (same lineage, different scope) and break the very **"co-location ≠ identity"** law this picture rests on. The engineer and the researcher, independently, reached the same correction: **incidence forces; lineage checks.** The lineage web is the faithfulness-clash *overlay* on what incidence forces — never a co-forcer.

## Shape

```txt
forcing engine    : incidence / topology   (gluing → forced identifications, propagated to a fixpoint)
checking overlay  : faithfulness (lineage-homogeneity) + GlueCoh (manifoldness)
                    — consumed per-step as ANNOTATIONS; never per-step guards; never forcers
verdict           : the END-STATE postcondition (a summary over the annotations), not a per-step abort
```

## Open / gated

The closure **driver** is unbuilt; the certifiers it calls are built. Operations remain GATED. The lineage check rides on **`multiset = lineage`** (verified to 62 leaves, proof open): operationally sound (decidable tree-comparison), but its **completeness** inherits that open obligation.
