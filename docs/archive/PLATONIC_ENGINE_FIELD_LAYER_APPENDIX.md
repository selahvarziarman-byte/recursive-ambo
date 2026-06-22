# PlatonicEngine Field Layer Appendix

Audience: future agents working with Arman on PlatonicEngine / recursive-ambo.

Status: critical notice and field-specific strategic appendix. This document corrects and sharpens the field-layer definition in the broader PlatonicEngine ground plan. It is not a backlog, not a Codex prompt, not a mandate to implement every capability described here, and not permission to spend quota on speculative rendering. Use it to assess whether field-layer work is conceptually correct before implementation proceeds.

## 1. Why this appendix exists

The field layer has been misunderstood once already.

A weak interpretation says: “show waves around the current shape” or “render a decorative scalar overlay from vertices.” That is not the intended feature.

The field layer is a derived interference atlas. It is numerical, geometric, and topological before it is interpretive. It is not a naming machine, not a semantic embedding, not a packet editor, not a historical operation, and not a visual effect whose correctness can be judged by appearance alone.

The field layer should eventually help the engine read closed geometric worlds as source-domains: not only where vertices are, but how their wave-like contributions reinforce, cancel, gate, route, and constrain one another.

This appendix makes the field concept explicit so that future agents do not implement the wrong thing efficiently.

## 2. Canonical definition

A field in PlatonicEngine is a **dynamic source-population interference atlas** over a selected geometric source-domain.

The source-domain may begin as a triangle, but it is not limited to triangles. It may later be a polygonal face, a cell surface, a closed shape surface, a closed shape volume, or a union of closed shapes.

Every active vertex in the chosen domain may act as a wave source. This includes generated child vertices, such as Ambo midpoints. The fact that born children become sources is not optional. The policy for computing their source parameters is open, but their inclusion in the source population is a hard requirement.

The atlas computes complex superposition, intensity, phase, genealogical contribution ratios, gradients, and eventually higher-order features such as nodes, near-nodes, ridges, valleys, gates, failed routes, loops, anchors, regions, and support classes.

The field does not directly name concepts. It supplies constraints that later interpretive layers may use.

Compact invariant:

> The field is a derived dynamic interference atlas of the current closed source-domain, and generated vertices join the source population.

## 3. What the field is not

The field is not a decorative wave overlay.

The field is not a semantic ontology.

The field is not a direct concept-naming machine.

The field is not a packet-writing system.

The field is not a historical shape operation.

The field is not computed from exploded display positions.

The field is not restricted to a fixed three-source triangle, although the triangle remains the reference calibration case.

The field is not allowed to ignore generated children. If generated child vertices do not become sources, the implemented feature is not the intended field layer.

## 4. Relation to the broader ground plan

The broader PlatonicEngine ground plan says the field layer should be derived, calculated from closed geometry, and kept separate from historical shape operations. That remains correct.

This appendix adds precision:

1. “Closed shape” should be read as “closed source-domain” when working locally and as “whole closed shape or shapes” when the feature matures.
2. The primitive reference case is a triangular domain, but the final target includes whole closed shapes.
3. Generated vertices must become sources on the next rebuild.
4. Intensity and genealogical mixture must be computed separately.
5. Visualization is secondary to the atlas.

The field layer should remain compatible with the project’s other layers:

- shape/generation layer: births vertices and defines closed geometry;
- atomic layer: interprets local child-events such as midpoint mediation and projection;
- field layer: includes the born child as a new source and computes the interference atlas;
- topology workspace: may later import field features as constraints or supports;
- interpretive/semantic layers: may later use the atlas to propose or test names.

## 5. Source-domain before renderer

Agents should not begin by asking: “What should the waves look like?”

They should begin by asking:

- What is the source-domain?
- Which vertices are active sources?
- Which geometry is closed for computation?
- Which sample charts cover the domain?
- Which source-parameter policy is active?
- What atlas data is computed at each sample?
- What is diagnostic truth before visual interpretation?

A renderer is only a view over the atlas.

## 6. Domain model

The field should be modeled over a domain. The domain may grow in complexity over time.

### 6.1 Calibration domain: triangle

The triangle is the reference case because the older field experiment began with an equilateral triangulation and because the atomic layer treats triangular generation as foundational.

In the simplest triangle case, the three face vertices are sources, and points inside the triangle are sampled. This case should be used to verify the mathematical field model.

The triangle case is not the final target.

### 6.2 Polygonal face domain

Faces in PlatonicEngine are not always triangular. A field implementation must not assume triangular faces forever.

A polygonal face can use all boundary vertices as sources. For sampling, the polygon may be internally triangulated into computational charts. Such triangulation must be explicitly computational, not semantic.

Do not silently introduce a semantic diagonal merely because the renderer or sampler triangulated a square.

If a diagonal is semantically present because an operation created it, such as a construction diagonal, then that diagonal may be treated as part of the source-domain structure. A numerical triangulation alone must not invent that meaning.

### 6.3 Cell-surface domain

A cell surface can become a source-domain where the field is sampled across its faces or a triangulated surface representation.

This is the natural bridge from local face fields to whole-shape fields.

### 6.4 Closed-shape surface domain

The long-term target is a whole closed shape or multiple closed shapes. All active vertices in the domain may become sources.

The first whole-shape version should likely be a surface atlas, not a full volume. Volume fields can be considered later.

### 6.5 Multi-shape domain

The eventual engine may allow multiple closed shapes or related worlds to contribute to one field. This is future work. Do not implement it until single-domain behavior is correct.

## 7. Source population

The source population is the set of active wave emitters for a field atlas.

The default rule is:

> The active source set is derived from the vertices of the selected source-domain.

This includes:

- seed/source vertices;
- preserved vertices;
- generated child vertices;
- Ambo midpoint vertices;
- later, possibly imported or semantic-dual/topological vertices, if explicitly scoped.

The field should rebuild when the source population changes.

## 8. Generated children as sources

This is a hard requirement.

When an operation births a vertex, that vertex must be able to enter the field source population. For Ambo, midpoint vertices are generated from source edges and carry creation/lineage data. The field layer must not treat such children as passive sample points only.

The source-parameter policy for children remains open. Possible policies include:

### 8.1 Parent-inheritance policy

A child source inherits or combines amplitude, phase, frequency, and decay from its parent endpoints.

This is simple and stable, but may miss the deeper atomic meaning of the birth-event.

### 8.2 Field-imprint policy

A child source is initialized from the previous field value at its birth position.

This treats the field as leaving an imprint at the site where a child is born. It is conceptually attractive, but requires careful handling of temporal rebuilds and previous-atlas availability.

### 8.3 Atomic-aware policy

A child source is computed from parents plus local projection-source/opposite vertices.

For example, an edge midpoint `AB` may be born from parent edge `A-B` while also carrying the local atomic context `AB | C` or tetrahedrally `AB | (C,D)`.

This policy connects the field layer to the atomic layer. It should not be the first hard-coded policy unless the atomic report model is stable.

### 8.4 Packet-override policy

Later, packet data may explicitly define source parameters such as amplitude, frequency, phase, and decay.

Do not implement packet override first. It requires schema discipline and can quickly turn the field layer into a packet-editing feature.

### 8.5 Recommended first policy

Begin with a simple deterministic policy that includes all active vertices as sources and computes child parameters conservatively. The architecture should allow later replacement or extension by named source policies.

The invariant is source inclusion, not the final source recipe.

## 9. Mathematical atlas model

The field should use complex superposition, not only scalar distance weighting.

For a source `i` at position `r_i`, one possible contribution at point `r` is:

```txt
c_i(r) = A_i * exp(i * (k_i * ||r - r_i|| + phi_i)) * exp(-delta_i * ||r - r_i||)
```

where:

- `A_i` is amplitude;
- `k_i` is wave number / frequency parameter;
- `phi_i` is phase offset;
- `delta_i` is attenuation;
- `||r - r_i||` is distance in the chosen domain metric or chart.

The total complex field is:

```txt
psi(r) = sum_i c_i(r)
```

The topological/intensity field is:

```txt
I(r) = |psi(r)|^2
```

The phase is:

```txt
Phi(r) = arg(psi(r))
```

The genealogical contribution magnitudes are computed separately:

```txt
m_i(r) = |c_i(r)|
```

and the contribution ratios are:

```txt
R_i(r) = m_i(r) / sum_j m_j(r)
```

This separation is central.

A point can have strong contribution ratios from several sources while intensity is low because waves cancel. A point can be genealogically mixed and still be an interference node. Do not collapse mixture into intensity.

## 10. Sample data requirements

A field sample should not be just `{ position, value }`.

A useful field sample should be able to carry:

- sample ID;
- position in world coordinates;
- position in local chart coordinates;
- optional barycentric or polygonal coordinates;
- complex `psi`;
- intensity;
- phase;
- per-source contribution magnitudes;
- per-source contribution ratios;
- optional gradient;
- optional Hessian/local curvature data;
- optional support class;
- optional confidence;
- optional feature membership.

Do not implement all optional fields first. But do not design a model that prevents them.

## 11. Field features

The atlas may eventually support derived features:

- node;
- near-node;
- ridge;
- valley;
- saddle;
- phase singularity;
- gate;
- route;
- failed route;
- anchor;
- loop;
- boundary;
- region;
- support class.

These are not first-pass obligations. The first pass should compute enough raw atlas data to make later feature extraction possible.

Agents must not spend quota implementing all feature extractors until the basic atlas and diagnostics are correct.

## 12. Closed geometry rule

The field must compute from closed geometry.

Explode View is decorative. It changes display positions, not the source-domain for field computation.

If a user explodes cells visually, the field should still be computed from the un-exploded shape.

A field implementation that samples from exploded positions is incorrect.

## 13. Rebuild rule

The field is derived and should be rebuilt when relevant inputs change.

Relevant inputs include:

- current shape/domain identity;
- active source-domain selection;
- vertex set changes;
- generated vertex births;
- vertex positions;
- field settings;
- source-parameter policy;
- later, explicit packet overrides if implemented.

The field should not persist heavy sampled grids as part of normal workspace history.

## 14. Relationship to historical operations

The field layer is not a historical operation.

Historical operations produce new `Shape` states and generation history. The field reads those states.

The field should not be added to the geometry-operation registry.

The field should not create cells, faces, edges, vertices, or generations.

The field may consume operation results, especially newly born vertices.

## 15. Relationship to the atomic layer

The atomic layer and field layer are related but distinct.

The atomic layer asks:

> What kind of child-event occurred here?

The field layer asks:

> Once this source population exists, what interference atlas arises over the domain?

For example:

```txt
Shape operation births midpoint AB.
Atomic layer may read it as AB | C or AB | (C,D).
Field layer includes AB as a source on the next rebuild.
The new atlas constrains later interpretation.
```

Do not make the field name atomic sites directly.

Do not require the atomic layer before the field can include generated children. A simple source policy can include children now; atomic-aware source policies can come later.

## 16. Relationship to semantics and naming

The field does not name concepts.

It may provide:

- high-confidence sites;
- ambiguous sites;
- cancellations;
- gates;
- supports;
- route failures;
- contribution ratios;
- structural constraints.

A later interpretive layer may use those constraints to propose names or semantic readings. That later layer must remain separate.

Field output should therefore use terms such as:

- candidate site;
- support class;
- constraint;
- route;
- gate;
- intensity maximum/minimum;
- contribution mixture;
- cancellation;
- confidence.

Avoid terms that imply final conceptual naming unless an interpretive procedure has actually run.

## 17. Implementation strategy

This appendix is not a backlog. Still, future implementation should follow this order in spirit.

### 17.1 Reference diagnostic first

Before UI, add a diagnostic that computes a triangular field atlas.

It should verify:

- complex `psi` is computed;
- intensity and phase are computed;
- contribution ratios are computed separately;
- intensity and mixture can diverge;
- representative points such as vertices, centroid, and edge midpoints are inspectable.

### 17.2 Child-source diagnostic

Add or extend a diagnostic to show that born children become sources.

A minimal reference:

1. Start with an equilateral triangle with three sources.
2. Add or generate midpoint children.
3. Rebuild the atlas with six sources.
4. Verify children are included in the source population.
5. Compare before/after field summaries.

This is more important than a pretty renderer.

### 17.3 Polygonal domain support

After triangular diagnostics are correct, support polygonal face domains.

Computational triangulation must be marked computational, not semantic.

### 17.4 Closed-shape surface support

After local face domains work, support a cell or whole closed-shape surface field.

This is the real destination, but it should not be the first implementation step.

### 17.5 Visualization

Only after the atlas is trustworthy should visualization be added.

First visualization can be modest:

- 2D atlas plane;
- face-local heat/phase visualization;
- conservative surface overlay;
- sample-point display.

Avoid starting with volumetric shaders or animated effects.

## 18. Minimal acceptable first implementation

The smallest acceptable implementation is not a visual effect.

It is:

1. a source-domain model;
2. a source-population builder;
3. a complex field sampler;
4. separate intensity and contribution-ratio calculations;
5. a diagnostic for the triangular reference case;
6. a diagnostic proving generated children can join the source population.

A renderer can come after this.

## 19. Acceptance criteria for field work

A field-layer patch should not be approved unless it satisfies the relevant criteria for its scope.

For any field patch:

- It preserves the distinction between field atlas and semantic naming.
- It does not mutate `Shape` or create generation history.
- It does not register a geometry operation.
- It computes from closed geometry, not exploded view positions.
- It keeps contribution ratios separate from interference intensity.
- It has bounded runtime and resolution.
- It is disableable if UI is involved.

For a source-builder patch:

- Generated vertices are included when they belong to the active domain.
- Source parameters are computed by an explicit policy.
- The policy can be replaced or extended later.

For a triangular diagnostic patch:

- It computes `psi`, intensity, phase, magnitudes, and ratios.
- It demonstrates at least one case where mixture and intensity are not equivalent.

For a child-source patch:

- It proves born midpoint children become sources after a rebuild.

For a polygonal-domain patch:

- It does not confuse computational triangulation with semantic diagonals.

For a renderer patch:

- It renders atlas data, not invented values.
- It does not define correctness by visual aesthetics.

## 20. Forbidden shortcuts

Do not implement a decorative overlay and call it the field layer.

Do not implement a fixed three-source triangle as the whole field model.

Do not leave generated child vertices out of the source set.

Do not compute field from exploded display offsets.

Do not collapse contribution ratios into intensity.

Do not persist heavy sampled grids by default.

Do not write names or concepts into packets from field results.

Do not treat numerical triangulation of a polygon as semantic diagonalization.

Do not begin with a whole-shape volume renderer.

Do not spend quota on feature extraction before the atlas model is correct.

## 21. Suggested vocabulary

Use these terms:

- field atlas;
- source-domain;
- source population;
- active source;
- generated child source;
- source policy;
- complex superposition;
- intensity;
- phase;
- contribution magnitude;
- contribution ratio;
- closed geometry;
- sample chart;
- support class;
- constraint site;
- gate;
- route;
- failed route.

Avoid these terms unless explicitly justified:

- semantic embedding;
- concept vector;
- automatic naming;
- packet generator;
- decorative wave;
- aura;
- visual flourish;
- final meaning.

## 22. Review questions for agents

Before approving or proposing field work, answer:

1. What is the source-domain?
2. Which vertices are sources?
3. Are generated children included?
4. Which source policy assigns amplitude, phase, frequency, and decay?
5. Is the field calculated from closed geometry?
6. Are intensity and contribution ratios separate?
7. Is this derived, not historical?
8. Is the implementation diagnostic-first?
9. Is any triangulation computational or semantic?
10. Does the patch avoid naming concepts directly?
11. Does it avoid hidden future cost?

If these questions cannot be answered, the work is not ready.

## 23. Guiding statement

The field layer is the engine's dynamic interference constraint layer.

It lets a generated world become a source-domain whose vertices, including born children, emit into an atlas of reinforcement, cancellation, phase, mixture, gates, and supports.

It does not tell us what a site means. It tells us what the world makes possible, difficult, reinforced, cancelled, mixed, or blocked.

Future interpretation may read from that atlas, but the atlas itself must remain numerically honest.
