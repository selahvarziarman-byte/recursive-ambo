# Signed Pull-Back + Junction Decomposer — CLOSE REPORT (engineer/prompter seat → mothership)

**Status:** the build chartered as *one* (`PLATONIC_ENGINE_SIGNED_PULLBACK_JUNCTION_CHARTER.md`) is complete on `team-arman` — both layers built, audited, committed, pushed. The first theory-layer-to-code crossing of the spiral has landed. Submitted for the mothership's ratification of the close.

**Authority honoured:** ADR 0006 (manifold-strata factory; junctions recorded; GlueCoh = decomposer) · ADR 0007 (stratum = canonical component; through-pairing deferred) · the clash-vs-level ruling (orientation is faithful data; clashes stay at faithfulness only). Operations remain GATED throughout — this is a certifier/decomposer upgrade, not a shape-mutating op.

---

## 1. What was built — the unification, in code

A junction is a `>2`-valent pull-back: **set-valued at the vertex, signed-non-manifold at the edge**, with faithfulness the orthogonal lineage check at both. The two layers deliver exactly that.

**Layer 1 — the junction decomposer** (`src/lib/incidenceTraceRegistry.ts`, commit `07f5acd`). `GlueCoh` stopped being a boolean manifold gate and became a decomposer: the committed pure `decomposeLink(adjacency)` reads the partition off the vertex-link graph it already built — `strata` (maximal manifold pieces, *walled* at the junction loci), `junctionLoci` (degree-`>2` branches), `pinch` (multi-component vertex-junctions), and a **four-valued `valence`** (`no-context / boundary / interior / junction`). The committed binary `non-manifold-overlap` — which fused valence-1 boundary (a legal bounded manifold) with valence-`>2` junction — is retired; a junction is now a *recorded outcome*, never an `issues[]` anomaly (instruments-not-guards). Through-pairing across a junction is a bare `'deferred'` hook — no `(d−1)!!` policy authored.

**Layer 2 — the signed pull-back + w₁** (`src/lib/transformationLedger.ts`, commit `aba209e`). A *pure append* (109 insertions, 0 deletions): the committed faithfulness law — `TransformationLedger`, `FaithfulnessCertificate`, `buildLedgerFromIdentification`, `certifyFaithfulness` — is byte-unchanged. Added: `SignedTransformationLedger` (the unsigned `pullBack` the committed certifier reads verbatim, plus `signedPullBack` carrying a per-element `sign: 1 | -1`); `buildSignedIdentification` (its unsigned projection deep-equals the committed builder — the sign is purely additional); `boundarySign` (the sign read off the substrate's oriented edges `createdBy.sourceVertexIds` — a B-twin pair shares `[A,B]` → `+1`); and `certifyOrientation` (w₁ as the product of signs **over cycles**, never a per-set inconsistency check).

## 2. What is sealed (falsifiable)

- **Orientation is faithful data, not a clash.** A non-orientable (`w1 = 1`) but lineage-homogeneous glue certifies `FAITHFUL`. The `FaithfulnessCertificate` keeps exactly its 8 keys; flipping every sign yields a byte-identical certificate (faithfulness is provably sign-agnostic); `operationStatus` is still exactly `heterogeneousCount === 0 AND removedSilentCount === 0`. The two certificates are key-disjoint — orthogonal layers. **No third clash class** (charter §3, held in code).
- **Signs compose; w₁ is a cocycle over cycles.** One flip around a cycle → `w1 = 1` (Möbius/Klein/RPⁿ, recorded as faithful data); **two flips cancel** → `w1 = 0`. A single pull-back set is never flagged inconsistent — (non)orientability is a global cycle property only.
- **The valence split is live.** Boundary (valence 1) is kept on the manifold side; only degree-`>2` or a pinch is a junction. The rigid-substrate regression (74 real sites) is exclusively `interior`/`no-context` — zero junctions — confirming the decomposer stays silent until an operation produces a quotient link.
- **The vertex/edge unification.** The vertex-junction is the `>2`-element pull-back already exercised at T2 P6 §B; the edge-junction is the signed pull-back at `>2`, detected as `decomposeLink`'s degree-`>2` locus. The signed build and the junction build were genuinely one build.

Diagnostics green on both sides (registry 107 PASS; ledger 104 PASS), `tsc` clean.

## 3. Build spine (`team-arman`)

```
aba209e  charter layer 2 — signed pull-back + w₁ (orientation as faithful data)
1f6dbbc  junction charter (the charter governance doc, now tracked)
07f5acd  charter layer 1 — junction decomposer (GlueCoh gate → decomposeLink; four-valued valence)
41766d2  zoo-factory set up (ADR 0007)
623b91b  grill-with-docs first output: topology clarified v0.1 (CONTEXT.md + ADRs)
e4e5003  Target 2 close (transformation ledger + faithfulness certificate v0)
```

## 4. Honest edges (what is NOT claimed)

- **The decomposer and w₁ consume *synthetic* links and cycles.** Operations are gated, so no quotient link or incidence cycle yet exists to feed them; the synthetic adjacency graphs (layer 1) and synthetic cycles (layer 2) stand in. This is faithful to the gate — the certifiers are proven correct on the structures the closure *will* produce.
- **The one real downstream NEED is the closure driver.** It is what produces the actual post-identification links and incidence cycles from an enacted operation. Until it exists, the decomposer and w₁ are exercised, not driven. This is the mothership's to charter next.
- **One ruling is owed before that driver goes live:** when a quotient collapses a link to a *bigon* (a 2-vertex 2-cycle), it currently lands `valence:'boundary'` yet `closed:true` — the `≥3` floor on `interior` carried over from the rigid guard. Is a bigon `interior` (a closed 2-gon) or `boundary`? Dead on every in-scope input today; it becomes live the moment the driver emits quotient links. Researcher's office.
- **Lineage rides on `multiset = lineage`** (verified to 62 leaves, proof open) — used as committed; completeness inherits the open obligation.

## 5. Deliverables + seat boundary

The chartered build is delivered in two committed layers, each prompted as a sealed implementer task, audited against falsifiable expected values before any commit, with the commits fired natively at the gate. The engineer seat held: prompts and audits authored here; engine code written only by the implementer; the committed faithfulness law preserved byte-for-byte; the clash taxonomy held at exactly the two ruled classes; operations gated throughout. The module now records orientation and decomposes junctions — the whole non-orientable half of the zoo has a home in the certifiers, waiting on the driver to enact it. Awaiting the mothership's ratification of the close and direction on the closure driver.
