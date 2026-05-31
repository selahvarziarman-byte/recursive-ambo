# PlatonicEngine Ground Plan

Audience: future agents working with Arman on PlatonicEngine / recursive-ambo.

Status: strategic ground document. This is not a task list, not a Codex prompt, not an implementation contract, and not a mandate to build every idea named here. Use it as the project’s orientation layer: a way to decide whether new work preserves the project’s direction, respects existing architecture, and avoids uncontrolled feature sprawl.

## 1. What PlatonicEngine is

PlatonicEngine is a geometric-semantic transformation workspace.

It begins with polyhedral geometry, but its real subject is not the rendering of solids. Its subject is how generated worlds remain intelligible after transformation.

A vertex is not only a point in space. It can be a named site, a packet carrier, a lineage endpoint, a generated child, a dual counterpart, a semantic projection, or a trace participant.

A face is not only a polygon. It can be a local relation-field, a registry context, a dual source, a topological material, or a semantic constraint surface.

A cell is not only a chunk of geometry. It can be a historical body, a parent residue, a core product, a recursive frontier, or a semantic world.

An operation is not only a mesh rewrite. It is a transformation event that should preserve enough structure for later inspection: what existed before, what was generated, what was preserved, what was transformed, and what became newly meaningful.

The long-term project is therefore not “make a 3D polyhedron app.” It is:

> Build a workspace where generated geometric worlds carry names, lineages, relations, semantic packets, dual correspondences, field phenomena, topological transformations, and local atomic grammars without losing their intelligibility.

## 2. What this document is for

This document exists to prevent drift.

Agents should use it when planning, prompting Codex, reviewing diffs, or assessing new concepts. It should help answer:

- Which layer does this idea belong to?
- Is this a historical operation, derived visualization, inspection lens, semantic model, topological workspace, or UI affordance?
- Does this patch preserve existing architectural distinctions?
- Is this work model-first, or is it adding UI before the model is clear?
- Does this idea deepen the engine, or does it create an expensive side-system?
- Can we defer the expensive part while preserving the conceptual seed?

This document should not become a hidden cost leak. It intentionally avoids detailed backlogs, quota plans, and large multi-stage implementation commitments. Concrete implementation plans should be written separately when the human asks for them.

## 3. Existing architectural distinctions to preserve

PlatonicEngine already has important separations. Do not erase them for convenience.

### 3.1 Historical shape operations

Historical operations mutate `Shape` and create generation history. They are real workspace operations.

Current examples include Ambo Dissection and Pyritohedral Diagonalization.

A historical operation should answer:

- what source shape/cell/entity it operated on;
- what it preserved;
- what it generated;
- what cells/faces/edges/vertices now exist;
- what lineage and genealogy were created.

Do not register a feature as a historical operation merely because it computes something from geometry.

### 3.2 Read-only correspondence Dual View

Correspondence-proxy Dual View is read-only. It may display or inspect a counterpart structure, but it should not mutate `Shape`, create generation history, become packet-editable, or masquerade as a normal operation.

It may later serve as an import source for another workspace, but imports should begin as snapshots/provenance records.

### 3.3 Semantic Dual Universe

Semantic Dual Universe is distinct from correspondence-proxy Dual View. It concerns a stronger semantic counterpart model, currently centered on pyritohedral-icosahedron to dodecahedron inspection.

Do not collapse semantic dual work into generic correspondence.

### 3.4 Packet editing

Packet editing is currently centered on primal vertices.

The project may later support wider semantic annotation, but do not silently generalize the packet editor to cells, faces, edges, dual entities, topology marks, or atomic events.

Snapshotting labels or packet fields for inspection is not the same as expanding packet editing.

### 3.5 Selection state

Do not prematurely replace the current separate selection states with a global all-purpose entity reference.

The current distinctions matter:

- selected cell;
- selected vertex;
- dual inspection target;
- hover target;
- future local selections inside independent workspaces.

A scoped reference type inside a new module is acceptable. A global replacement is not.

## 4. Strategic layers of the project

The project can become rich without becoming incoherent if each layer has a clear role.

### 4.1 Shape and generation layer

This is the current base layer.

It contains shapes, cells, faces, edges, vertices, generations, genealogy, source operations, and structural lineage.

It answers:

> What was generated, from what, by which historical operation?

### 4.2 Inspection and relation layer

This layer reads the current shape and exposes relations without necessarily changing the shape.

It answers:

> How do selected things relate locally, historically, geometrically, or semantically?

Examples include selected-vertex relations, face-local opposites, diagonalization matrix inspection, dual inspection panels, and packet workbench context.

### 4.3 Field/wave layer

This should be a derived phenomenon of the current closed shape.

It answers:

> What field arises if vertices are treated as sources?

The field layer should compute from closed geometry, not exploded display positions. It should not mutate shape history. It should not persist heavy sampled grids. It should be disableable and bounded.

### 4.4 Atomic layer

This should be the local semantic grammar of triangular generation.

It answers:

> What kind of child-event occurred here?

The atomic idea should preserve this principle:

A midpoint can be mediation of its parent edge and also a projection/sublimation site of the face-local opposite vertex or vertices.

This does not mean every midpoint receives an automatic final name. It means the engine can inspect the local generative law that made the midpoint meaningful.

Atomic work may eventually involve named operations or registries such as Midwife, Quark, or Kingmaker. Treat those as candidate local grammars, not as reasons to overbuild a separate system immediately.

The first form should be an atomic module or lens: pure, diagnostic, read-only, and optional.

A full atomic workspace may be possible later, but it should earn its place by proving that the module creates durable value.

### 4.5 Semantic-topological workspace

This should be an independent process space.

It answers:

> Where do names live after topological transformation, and what semantic conditions govern that habitation?

It may import named material from the primal shape world, correspondence Dual View, semantic dual models, atomic contexts, or future sources. After import, it should own its own session state, operations, supports, semantic fibers, and traces.

It should not mutate the source shape by default.

Key distinction:

Topological co-location is not semantic identity.

If four vertices become one quotient support, the topology may say “one support,” but semantics must still say whether the names are co-located, identified, fused, constrained, conflicted, or rejected.

### 4.6 Conceptual-cartographic layer

This is a possible future layer for organizing concepts, packets, traces, names, and relations at a higher level.

Do not build this until the lower layers have real use pressure.

## 5. General implementation strategy

### 5.1 Model before UI

Do not use UI to discover the model when the model is conceptually delicate.

For field, atomic, and topology work, prefer:

1. pure types;
2. pure computation;
3. diagnostic output;
4. small read-only UI;
5. optional persistence;
6. richer interaction.

### 5.2 Derived before historical

If a feature can be derived from current shape state, keep it derived until there is a strong reason to persist or historize it.

A derived report is cheaper and safer than a new ledger.

A diagnostic is cheaper and safer than a new workspace.

A read-only lens is cheaper and safer than an editor.

### 5.3 Snapshot before live link

When importing material from one universe into another, begin with snapshots and provenance.

Live links are powerful but expensive. They create synchronization questions, invalidation rules, and subtle semantics. Do not introduce them casually.

### 5.4 Explicit traces where transformation matters

When a workspace transforms named material, record what happened.

A trace should not be only a debug log. It should preserve semantic passage:

- what name or mark was affected;
- what support it came from;
- what support it moved to;
- what operation carried it;
- what semantic condition was imposed;
- whether the result is confirmed, candidate, unsupported, or conflicted.

### 5.5 Return unsupported often

Do not force interpretation.

If a triangle is not a supported atomic registry, return unsupported.

If a topological operation lacks clear semantic conditions, mark unresolved or reject it.

If a dual/correspondence relation is unavailable, say so.

A clean unsupported state is better than a false semantic reading.

### 5.6 Do not auto-name too early

Generated semantic readings should begin as candidate interpretations.

Do not auto-write philosophical or atomic conclusions into packets. Do not silently turn labels into final truth.

Let reports and lenses show what the system can infer. Persist only once a schema and workflow are clearly justified.

## 6. Feature-line guidance

This section is strategic only. It is not a backlog.

### 6.1 Field/wave guidance

Goal:

> Make the current closed shape readable as a source-field.

Rules:

- Use raw closed-geometry vertex positions.
- Ignore explode offsets for field computation.
- Keep the field derived, not historical.
- Keep first rendering simple and bounded.
- Do not persist sampled field grids.
- Do not couple first implementation to Dual View proxy geometry.
- Make the field fully disableable.

First acceptable form:

A pure field sampler and a conservative visual slice/overlay.

Defer:

- volumetric rendering;
- packet-derived source parameters;
- animation;
- persistence;
- shader sophistication;
- field editing.

### 6.2 Atomic guidance

Goal:

> Interpret triangulation-born child-events according to local registry law.

Core intuition:

A generated midpoint is born from an edge, but its meaning can also depend on the local face relation: especially the opposite vertex or vertices whose projection makes the midpoint legible.

Rules:

- Keep atomic logic separate from packet editing.
- Do not auto-name.
- Do not claim universal coverage.
- Do not create a separate atomic workspace before a diagnostic module proves value.
- Treat Midwife/Quark/Kingmaker as possible local grammars, not mandatory architecture.
- Prefer read-only reports before ledgers.
- Let the atomic layer fold into topology later through traces if useful.

First acceptable form:

A pure local-registry report for generated midpoint contexts, showing parents, source edge, incident faces, projection-sources, and candidate atomic reading where supported.

Defer:

- persistent atomic birth ledger;
- recursive atomic workbench;
- packet excavation UI;
- global atomic selection;
- automatic semantic naming.

### 6.3 Semantic-topological guidance

Goal:

> Let names inhabit, move through, and transform under topological operations while preserving semantic conditions and traceability.

Rules:

- Keep topology state independent from `Shape` state.
- Import source material as named marks with provenance.
- Separate supports from semantic identity.
- Make semantic fibers explicit.
- Record trace events for operations.
- Do not treat quotient as automatic semantic fusion.
- Do not begin with a freeform topology UI.
- Use small benchmarks to prove the model.

Useful benchmark:

A square face can be imported and edge-identified so that its corner names share one quotient support. The system must still distinguish whether the names are merely co-located, identified, fused, constrained, conflicted, or rejected.

This benchmark is a model check, not a mandate to build a torus UI immediately.

Defer:

- general surface renderer;
- arbitrary topology playground;
- multi-object composition;
- live source links;
- full persistence;
- curve/diagonal intersection engine.

## 7. Progress assessment rubric

Use this rubric before approving a feature or patch.

### 7.1 Layer clarity

Can the agent state which layer the work belongs to?

Possible answers:

- historical shape operation;
- derived visualization;
- inspection lens;
- packet/editor workflow;
- dual/correspondence view;
- semantic dual model;
- atomic local grammar;
- semantic-topological workspace;
- pure diagnostic;
- UI shell.

If the layer is unclear, stop and clarify before implementation.

### 7.2 Mutation discipline

Does the patch mutate `Shape` only when it is truly a historical operation?

Does it keep read-only views read-only?

Does it avoid writing packet data unless explicitly scoped?

Does it keep derived data derived?

### 7.3 Cost discipline

Does the patch add a subsystem, store, persistence schema, or generalized abstraction?

If yes, is that justified by immediate use?

Can the same value be achieved first as a pure function, diagnostic, or read-only lens?

Does the patch create future maintenance burden for a concept that has not been proven?

### 7.4 Semantic honesty

Does the system distinguish candidate readings from confirmed facts?

Does it return unsupported rather than hallucinating structure?

Does it preserve the difference between co-location and identity?

Does it avoid collapsing projection-source, parent, counterpart, and semantic name into one thing?

### 7.5 Reviewability

Is the diff narrow enough to audit?

Are new files included in the review material?

Were diagnostics run?

Is there a final `git status --short`?

Can a human understand what changed without trusting a summary?

## 8. Agent workflow

### 8.1 Before proposing implementation

When the human brings an idea, first assess:

- What is the actual concept?
- Which layer does it touch?
- Is it feature, workflow, model change, UI display, or architecture shift?
- What existing invariants does it threaten?
- What is the smallest useful diagnostic?
- What should be deferred?

Do not jump to Codex prompts for conceptually delicate work.

### 8.2 When writing Codex prompts

Prompts should be narrow.

Include:

- goal;
- expected files;
- forbidden moves;
- diagnostics/commands to run;
- final `git status --short`;
- instruction not to commit before review.

Avoid broad prompts like “implement the topology workspace.”

Prefer prompts like “add pure field source builder and diagnostic only.”

### 8.3 When auditing

Do not approve Codex summaries alone.

Require actual diff material. Check:

- scope;
- runtime behavior;
- architecture drift;
- untracked files;
- diagnostics/build;
- semantic changes hidden behind wording like “refactor” or “extraction.”

## 9. Review command pattern

The human usually prefers local cmd/PowerShell review extraction rather than spending Codex quota on summaries.

Typical command:

```cmd
cd /d C:\Dev\PlatonicEngine

del review.txt 2>nul

(
echo ===== STATUS =====
git status --short
echo.
echo ===== DIFF STAT =====
git --no-pager diff --stat
echo.
echo ===== FULL DIFF =====
git --no-pager diff
echo.
echo ===== DIFF CHECK =====
git diff --check
) > review.txt

notepad review.txt
```

Important: `git diff` does not show untracked files. If a patch adds files, append their contents explicitly:

```cmd
echo ===== NEW FILE: src\path\NewFile.ts ===== >> review.txt
type src\path\NewFile.ts >> review.txt
```

## 10. Guardrails against hidden cost leaks

A concept named in this document is not automatically approved for implementation.

A future workspace named here is not automatically a near-term task.

A possible persistence layer is not automatically justified.

A possible UI is not automatically useful.

A named philosophical connection is not automatically an engineering requirement.

Agents should treat this document as a map of direction, not a list of obligations.

Before adding cost, ask:

- What is the smallest artifact that preserves the idea?
- Can this remain diagnostic?
- Can this remain derived?
- Can this remain read-only?
- Can this be deferred without losing the conceptual thread?
- Does this fold into an existing layer rather than becoming a rival layer?

## 11. Forbidden shortcuts

Do not implement multiple major layers in one pass.

Do not replace existing selection state with global entity references.

Do not mutate source shapes from topology or atomic experiments.

Do not make read-only dual correspondence mutable.

Do not make field visualization a historical operation.

Do not make atomic readings final packet names automatically.

Do not build topology UI before topology semantics are clear.

Do not persist heavy or unstable derived data.

Do not rely on README as the source of current project truth.

Do not add “helpful” hygiene when it consumes quota without supporting current use.

## 12. Guiding invariants

For the project as a whole:

> A generated world should remain intelligible after transformation.

For shape operations:

> Historical operations generate new shape history and must preserve lineage.

For the field layer:

> The field is a derived phenomenon of the current closed shape.

For the atomic layer:

> Local triangular birth-events can carry semantic law, but candidate meaning is not automatic truth.

For the semantic-topological workspace:

> Topological operations transform supports; semantic operations transform how names inhabit those supports; traces record both.

For agents:

> Preserve the layers, keep diffs narrow, prove models before UI, and do not turn conceptual richness into uncontrolled implementation cost.
