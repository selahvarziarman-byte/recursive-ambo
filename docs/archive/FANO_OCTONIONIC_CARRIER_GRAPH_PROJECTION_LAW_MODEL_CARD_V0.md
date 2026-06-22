# Fano-Octonionic Carrier Graph Projection Law V0

Operational alias: Carrier-Connection Graph Field V0

Status: selected next testable projection-law candidate after E1.

## 1. Purpose

F0 defines the field-facing projection law after the accepted carrier and emission groundwork and before any semantic residual work.

The selected direction is a merged law:

- graph / source-channel propagation;
- Fano-octonionic carrier-channel bundle projection;
- finite oscillator emission from the E0/E1 profile stack;
- spatial support projection as the immediate next stage.

The field first lives on a generated carrier-channel graph. Each node and edge carries carrier, emission, activation, and channel data. A continuous spatial field appears as the next projection of that carrier graph field onto geometric supports.

Compact law:

```text
F_s(x,t)
=
sum_c Activation_c * Transport_c(q_s) * psi_s(t) * Support_c(x)
```

Where:

- `c` is a carrier-valid channel or free source node.
- `Activation_c` is intrinsic free emission, available response, or activated response.
- `Transport_c(q_s)` is the Fano-octonionic carrier operation along the channel.
- `psi_s(t)` is the oscillator emission from E1.
- `Support_c(x)` is spatial support tied to vertices, child sites, graph edges, faces, or cells.

## 2. Accepted Inputs

F0 takes the following pushed diagnostics as accepted input:

- C0-R1: signed carrier lifts, ordered products, antipodal lift candidates, and antipodal quotient groups.
- C1: canonical child carrier states, local channel rows, parent-return rows, projection-loop rows, and complement pairings.
- A0: formal associator rows and canonical projection displacement residues.
- E0: finite primal harmonic profile sets for source slots A, B, C, D.
- E1: child intrinsic birth emissions, parent-return response kernels, projection-loop response kernels, and complement-coupling response kernels.

F0 does not mutate these inputs. It names the next law that will read them into a graph field table.

## 3. Why S0 Is Not Next

S0 remains important, but semantic residuals should not precede field projection.

The system now has a carrier basis, local channels, associator residues, primal emissions, and child emission envelopes. The next missing object is the field-facing projection law that tells the system how carrier/emission/channel data becomes a graph field and then a continuous spatial field.

S0 is therefore preserved and moved after F1, F2, and G0:

- F1 builds the carrier graph field table.
- F2 projects that graph field onto continuous spatial supports.
- G0 adds generational update behavior.
- S0 can then read semantic residuals against a field object rather than against an unfinished carrier/emission stack.

## 4. Why Generic Radial Waves Are Not Enough

A generic Euclidean radial wave law is not sufficient as the source ontology. It risks collapsing a source to:

- point position;
- scalar amplitude;
- phase;
- radial falloff.

That collapse would discard the carrier-channel structure established by C0-R1, C1, A0, E0, and E1. Radial waves may later become display observables or one family of spatial supports, but they must not become the primary source model.

The source is not just point plus phase. It is carrier state plus oscillator emission plus graph-channel transport.

## 5. The Selected Merged Law

The selected law is a finite carrier graph projection law.

Core objects:

- Generated source graph `Gamma_G`: the finite graph of primal and child source nodes produced by the accepted carrier/emission diagnostics.
- Carrier-channel graph: `Gamma_G` with typed directed edges carrying local channel, complement, and later generation relations.
- Carrier-valued emission: each node or activated channel contributes oscillator data multiplied by a carrier transport result.
- Activation-controlled transport: channel kernels exist as available responses and contribute only when activated.
- Finite path-sum first: F1 tables one-step and path-ready carrier contributions without pretending a closed-form spectral kernel exists.
- Continuous spatial support second: F2 maps finite graph contributions to sampleable spatial supports.

The law is selected because it keeps the carrier graph and oscillator profile together without reducing either one to decorative metadata.

## 6. Graph Object

The F1 graph object is a generated carrier-channel graph.

Graph fields:

- `graphId`
- `generationIndex`
- `nodeRows`
- `edgeRows`
- `graphStatus: carrier-channel-graph-field-ready`

Node types:

- `primal-source-node`
- `child-source-node`

Directed edge families:

- `birth-edge`
- `parent-return-edge`
- `projection-loop-edge`
- `complement-coupling-edge`
- `generation-edge-placeholder`

Generation index starts at the accepted C0/C1/E0/E1 source layer and remains explicit on every node and edge.

## 7. Node Payload

Each graph node should carry:

- source token;
- source role;
- carrier state;
- signed lift and ray where applicable;
- intrinsic emission profile;
- generation index;
- spatial anchor placeholder;
- semantic-label status: `not-attached`.

Primal nodes read source slots and harmonic profiles from E0. Child nodes read canonical carrier state and intrinsic birth emission from E1.

## 8. Edge Payload

Each graph edge should carry:

- edge id;
- source node;
- target or recovered node;
- edge family;
- carrier operation or transport;
- activation status;
- scalar weight;
- response/free status;
- spatial support placeholder.

Edges are not manually invented. Parent-return, projection-loop, and complement-coupling edges are derived from C1 and E1 rows.

## 9. Activation Law

Activation states:

- `intrinsic-free-emission`: the node emits by its intrinsic oscillator profile.
- `available-response-not-free-emission`: the edge is available as a response kernel but does not emit continuously on its own.
- `activated-response`: the edge contributes when a source/path/interaction activates the response.

E1 response kernels must not become always-on emissions. F1 must preserve this distinction in the activation table.

## 10. Weight Law V0

F0 selects an explicit first weight policy with no hidden tuning:

- intrinsic source free emission weight = `1`;
- parent-return edge weight = `1`;
- projection-loop edge weight = `1`;
- complement-coupling edge weight = `1`;
- associator-residue class is recorded but does not yet rescale weight;
- generation attenuation placeholder = `not-applied-in-f0-f1`.

These weights are not claimed to be final physics. They are the first finite policy so F1 can be tested without arbitrary per-run tuning.

## 11. Transport Law V0

F1 must use finite path-sum transport first, not a premature octonionic spectral exponential.

Full graph spectral kernels are deferred because octonionic noncommutativity and nonassociativity make naive spectral formulas unsafe. In particular, F0 does not claim:

```text
exp(-tL_octonion)
```

First implementation should table:

- one-step transports;
- path-ready bracketing fields;
- edge transport rows;
- carrier result rows.

Every transport must preserve explicit order and bracketing.

## 12. Path-Sum Law

First path contribution:

```text
Contribution(path,t)
=
pathWeight * Transport_path(q_source) * psi_source(t)
```

Every path must have explicit bracketing. A path row should name:

- source node;
- ordered edge sequence;
- activation state for each edge;
- finite path weight;
- carrier transport result;
- oscillator source;
- bracketing status.

## 13. Spatial Bridge

Every F1 node and edge must already have a spatial support placeholder so F2 can follow immediately.

Spatial support kinds:

- `primal-vertex-support`
- `child-midpoint-support`
- `channel-edge-support`
- `complement-axis-support`
- `face-cell-support-deferred`

F1 does not compute continuous samples, but it must leave no graph object without a spatial bridge handle.

## 14. Continuous Spatial Projection Must Be F2

F2 immediately follows F1.

F2 must compute sampleable continuous field contributions at sample points. It is not UI, rendering, shader work, or visualization. F2 is a pure table prototype for spatial support and finite field contribution.

F2 is where `Support_c(x)` becomes operational.

## 15. F1 Required Tables

F1 must produce:

- graph node table;
- graph edge table;
- carrier transport table;
- activation/weight table;
- path-sum readiness table;
- spatial support placeholder table.

These tables make the carrier graph field testable before any continuous projection.

## 16. F2 Required Tables

F2 must produce:

- spatial anchor table;
- node support function table;
- edge support function table;
- sample point table;
- field contribution sample table;
- continuous projection summary.

F2 should demonstrate finite sample values while preserving carrier/emission/channel separation.

## 17. Pass Criteria For F1

F1 passes only if:

- nodes are derived from C1/E1;
- edges are derived from C1/E1 kernels;
- carrier transport is explicit;
- activation statuses are explicit;
- response kernels are not always-on emissions;
- weights are finite and non-negative;
- spatial support placeholders are present;
- semantic labels are not attached;
- UI is not introduced.

## 18. Pass Criteria For F2

F2 passes only if:

- every F1 node has a spatial anchor;
- every F1 edge has a spatial support reference;
- sample points receive finite contributions;
- carrier/emission is not collapsed to phase;
- channel response activation is respected;
- UI/rendering is not introduced.

## 19. Falsifiers

The candidate law fails if:

- it collapses into a generic radial wave;
- graph edges require manual maps not derived from C1/E1;
- carrier transport becomes decoration;
- edge weights become arbitrary tuning;
- continuous spatial projection cannot produce finite sample values;
- the field reduces to point plus phase;
- response kernels become always-on free emissions.

## 20. Updated Gate Order

F0 — this model card

F1 — carrier graph field table

F2 — continuous spatial support projection table

G0 — generational field update

S0 — Fano-Trison semantic residual model card

R0 — review
