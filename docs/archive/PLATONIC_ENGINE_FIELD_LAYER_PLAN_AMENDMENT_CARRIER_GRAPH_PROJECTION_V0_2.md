# PlatonicEngine Field-Layer Recovery Plan — Projection-Law Amendment V0.2

Status: **binding plan amendment / prompter-control update**  
Supersedes only the ordering after E1 in `PLATONIC_ENGINE_FANO_OCTONIONIC_FIELD_EXECUTION_PLAN.md`.

This amendment corrects the post-E1 route. The prior plan allowed S0, the Fano-Trison semantic residual model card, to appear immediately after E1. That is no longer accepted. The carrier and emission layers are now sufficiently developed that the next urgent problem is the field-facing projection law. Semantic residual work must not precede the field projection bridge.

The guiding correction is:

```txt
Do not move from child emission envelopes directly into semantic residuals.

Move first into the law that projects carrier-valued emissions through the generated source graph
and then into continuous spatial support.
```

The continuous spatial field must not become an indefinitely postponed monster. It must be addressed immediately after the carrier-graph projection law is specified.

---

## 1. Current completed gates

The current completed sequence is:

```txt
P0 — Solution record + execution plan
P1 — Fano-octonionic birth/local-channel model card
C0-R1 — strict signed carrier lift and antipodal quotient derivation
C1 — local child-parent and child-projection channel derivation
A0 — associator / projection displacement table
E0 — finite harmonic primal emission profile library
E1 — child emission envelope table
```

The project now has:

```txt
carrier:
  strict Fano-octonionic signed lifts and quotient antipodality

local channels:
  child-parent return
  child-projection loop
  complement coupling

projection residue:
  associator and canonical projection displacement tables

primal emission:
  finite harmonic profile libraries

child emission:
  intrinsic birth emission + local response kernels
```

This is enough to define a field projection law. It is not enough to justify semantic/naming work as the next gate.

---

## 2. Strategic correction after E1

The accepted next sequence is now:

```txt
F0 — Carrier Graph Projection Law Model Card
F1 — Carrier Graph Field Table Prototype
F2 — Continuous Spatial Support Projection Table Prototype
G0 — Generational Field Update Table
S0 — Fano-Trison Semantic Residual Model Card
R0 — Model Review and Continuation Decision
```

This ordering is intentional.

```txt
F0/F1:
  define and test the graph-carrier law.

F2:
  force the continuous spatial field bridge immediately.

G0:
  show how the active source population updates using carrier/emission/projection objects.

S0:
  only then attach semantic residual interpretation to field-grounded carrier channels.
```

S0 is not deleted. It is demoted to its proper place: after the field-facing projection bridge is no longer hand-wavy.

---

## 3. Selected projection-law direction

The leading law is a merge of the previous candidates:

```txt
graph/spectral propagation
+
carrier-channel bundle projection
```

The merged object is:

```txt
Fano-Octonionic Carrier Graph Bundle
```

or, operationally:

```txt
Carrier-Connection Graph Field
```

The field first lives on the generated source-channel graph. Each node and edge carries Fano-octonionic carrier data and harmonic emission data. Continuous spatial field then appears as a projection of this carrier graph field onto geometric supports.

The proposed staged law is:

```txt
intrinsic emission
  + carrier state
  + local channel kernel
  ↓
carrier-channel graph contribution
  ↓
simplicial / spatial support projection
  ↓
continuous field-facing spatial contribution
```

Compact form:

```txt
F_s(x,t)
=
Σ_c Activation_c · Transport_c(q_s) · ψ_s(t) · Support_c(x)
```

where:

```txt
c:
  a carrier-valid channel or free source node

Activation_c:
  free intrinsic emission, available response, or activated response

Transport_c(q_s):
  Fano-octonionic carrier operation along the channel

ψ_s(t):
  oscillator emission from E1

Support_c(x):
  spatial support function tied to vertices, child sites, edges, links, faces, or cells
```

This is not a generic radial-wave law. It is a law whose parts come from the already-built project objects.

---

## 4. Why not generic Euclidean radial waves first

A radial-wave law is easy:

```txt
A · decay(distance) · exp(i(ωt - kd + phase))
```

but it is too weak as the first field law. It risks collapsing the source back into:

```txt
point + phase
```

The project has already escaped that reduction. A source is now:

```txt
carrier
+ intrinsic emission
+ local channel-response kernel
+ complement / projection relations
```

A projection law must preserve that structure. A generic radial source may still become a later display observable, but it should not be the ontology of the field.

---

## 5. Gate F0 — Carrier Graph Projection Law Model Card

Deliverable:

```txt
FANO_OCTONIONIC_CARRIER_GRAPH_PROJECTION_LAW_MODEL_CARD_V0.md
```

Purpose:

```txt
Specify the merged carrier-graph projection law before implementation.
```

Required sections:

```txt
1. Current accepted inputs from C0/C1/A0/E0/E1.
2. Why S0 is not next.
3. Graph object Γ_G:
   nodes, edges, directed channels, generation index.
4. Node payload:
   source token, carrier state, intrinsic emission, spatial anchor.
5. Edge payload:
   channel family, carrier transport, activation, weight, source/target.
6. Transport law:
   finite path-sum first, no premature octonionic spectral exponential.
7. Activation law:
   intrinsic free emission versus available response channel.
8. Weight law:
   explicit first weights, no arbitrary tuning.
9. Spatial bridge:
   every node/edge must carry a spatial support placeholder immediately.
10. Continuous spatial projection:
   must be the next implementation gate, not a distant future idea.
11. Pass/fail tables for F1 and F2.
12. Falsifiers.
```

Exit condition:

```txt
The model card makes a precise enough law for F1 to implement a table,
and it explicitly schedules continuous spatial support as F2.
```

Kill condition:

```txt
The law collapses into generic graph labels, generic radial waves, or unconstrained edge weights.
```

---

## 6. Gate F1 — Carrier Graph Field Table Prototype

Deliverables:

```txt
src/lib/fanoOctonionicCarrierGraphFieldV0.ts
scripts/diagnose-fano-octonionic-carrier-graph-field-v0.cjs
```

Purpose:

```txt
Build the carrier-channel graph from existing C1/E1 data.
```

Primary output:

```txt
source graph node table
channel edge table
carrier transport table
activation/weight table
path-sum readiness table
spatial support placeholder table
```

F1 must use:

```txt
C1:
  canonical child carrier states and local channel rows

E1:
  child emission envelopes and channel-response kernels
```

F1 must not compute continuous spatial values yet, but it must create the explicit placeholders F2 will fill.

Required node types:

```txt
primal-source-node
child-source-node
```

Required edge families:

```txt
birth-edge
parent-return-edge
projection-loop-edge
complement-coupling-edge
```

Required activation statuses:

```txt
intrinsic-free-emission
available-response-not-free-emission
```

Required checks:

```txt
nodes are derived from active source inputs;
edges are derived from C1/E1 kernels;
carrier transport is explicit;
weights are finite and non-negative;
response edges are not always-on;
spatial support placeholders exist for every node and edge;
no UI;
no semantic labels;
no Trison.
```

Exit condition:

```txt
The graph field substrate exists as a table and can tell F2 what spatial supports must be projected.
```

---

## 7. Gate F2 — Continuous Spatial Support Projection Table Prototype

Deliverables:

```txt
src/lib/fanoOctonionicSpatialSupportProjectionV0.ts
scripts/diagnose-fano-octonionic-spatial-support-projection-v0.cjs
```

Purpose:

```txt
Address the continuous spatial field bridge immediately.
```

F2 is not a UI/visual-render branch. It is a mathematical projection table.

Primary output:

```txt
spatial anchor table
node support function table
edge support function table
sample point table
field contribution sample table
continuous projection summary
```

F2 should start with the tetrahedron / first ambo geometry only.

Required spatial anchors:

```txt
A,B,C,D:
  tetrahedron vertices

M_AB, M_AC, M_AD, M_BC, M_BD, M_CD:
  edge midpoints / born source sites

complement axes:
  child-child antipodal links

local channels:
  graph edges with spatial support between anchors
```

Candidate support functions:

```txt
node support:
  localized radial basis or barycentric vertex/point support

edge support:
  line/tube support or Whitney-like edge support

cell support:
  deferred unless needed
```

F2 must explicitly choose a minimal continuous support law, even if provisional.

Required checks:

```txt
every F1 graph node has a spatial anchor;
every F1 graph edge has a spatial support reference;
sample points can receive finite field contributions;
carrier/emission data is not collapsed to phase;
channel responses are not always-on unless activated;
continuous projection is table-tested before UI.
```

Exit condition:

```txt
A continuous spatial field contribution can be computed at sample points,
without rendering and without reducing the source to point+phase.
```

Kill condition:

```txt
The model cannot produce finite continuous spatial contributions from carrier graph data
without arbitrary display-only patches.
```

---

## 8. Gate G0 — Generational Field Update Table

G0 moves after F2.

Purpose:

```txt
Show that source population update, carrier graph update, emission envelope update,
and spatial support update can happen together from G0 to G1.
```

Required output:

```txt
G0 active source table
birth source table
G1 active source table
G1 carrier graph table
G1 spatial support table
field recomputation basis
```

Exit condition:

```txt
The field can change because the active source population and carrier graph change.
```

---

## 9. Gate S0 — Fano-Trison Semantic Residual Model Card

S0 moves after F2 and preferably after G0.

Purpose:

```txt
Attach semantic residual interpretation only after carrier channels, emission envelopes,
graph propagation, and spatial projection are materially grounded.
```

S0 must not become naming automation. It must read already-derived carrier/graph/spatial structures.

Required inputs:

```txt
C1 local channels
A0 associator/projection residues
F1 carrier graph edges
F2 spatial support projections
E1 child emission envelopes
```

Exit condition:

```txt
Trison can be stated as a semantic reading of carrier-validated and field-grounded local structures.
```

---

## 10. Continuous spatial field non-postponement rule

From this amendment forward:

```txt
Continuous spatial projection is the next major implementation target after F0/F1.
```

Any plan that moves from E1 into semantics, naming, or further abstract carrier theory before F2 must explain why F2 is impossible. Otherwise it is plan drift.

The continuous spatial field must be addressed as a table first:

```txt
not UI,
not rendering,
not shader work,
not visual polish,
but finite sampleable spatial projection.
```

The guiding question is:

```txt
Given the carrier graph field, what finite field contribution does it make at spatial sample points?
```

If this question is not answered soon, the field layer has again become an abstract diagnostic system rather than a field.

---

## 11. Updated checkpoint sentence

The updated checkpoint sentence is:

```txt
Given four Fano-octonionic primal sources with finite harmonic emissions,
their six born child sources, local channel-response kernels, and carrier graph relations,
what carrier-valued graph field is produced,
how is it projected into continuous spatial support,
and how does that field update when a new source generation is born?
```
