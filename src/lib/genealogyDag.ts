// genealogyDag — Enabler-2: the persistent genealogy DAG (ADR 0009/0010).
//
// The standing, monotone-growing record of the generative build-out: nodes = forms
// (by shapeId), edges = operations (parent → child), the one forced arrow =
// `generationDepth`. It is built by reading each form's COMMITTED parent-pointer
// (`ShapeGenealogy` — `parentShapeId` and the shape-level `sourceVertexIds`) FORWARD;
// it invents NO second parentage model and mutates no shape. Three faces:
//
//   • the DAG proper — depth, the birth `OperationKind` on each edge, a consuming marker
//     for consumed parents, and queryable ancestry / descent;
//   • the integrity invariants (the tooth) — (a) acyclic (depth strictly increases
//     along every edge) and (b) lineage ⊆ parents (a node's `createdBy.sourceVertexIds`
//     are a subset of its recorded parents' vertices). A DAG violating either is REJECTED;
//   • seam-readiness, STRUCTURE ONLY — the per-incidence `X_K` slots
//     (`buildIncidenceTraceRegistry(shape).sites`), the orientation sign `U = (-1)^w1`
//     carried on glue / flip-glue edges (read from a committed `OrientationCert`), and
//     every birth as a discrete, queryable event. NO ψ / Laplacian / holonomy / flow
//     compute — Layer-1 attaches LATER by ADDING, never by editing this module.
//
// DERIVE-ONLY · ADDITIVE. Committed modules are consumed BY IMPORT only:
// `lineage.primalMultiset` (the carried-roots primitive) and
// `incidenceTraceRegistry.buildIncidenceTraceRegistry` (the X_K slots). `OperationKind`
// is a PURE annotation (R-E2-2): nothing here branches lineage on it.

import type { OperationKind, Shape, ShapeId, VertexId } from '../types/geometry';
import { primalMultiset } from './lineage';
import { buildIncidenceTraceRegistry, type SiteIncidenceReading } from './incidenceTraceRegistry';

// The glue family — these edges carry the orientation sign `U` (charter §3.2/§4.6).
const GLUE_KINDS: ReadonlySet<OperationKind> = new Set<OperationKind>(['glue', 'flip-glue', 'assemble', 'patch-lift']);

// In the walk's UNCONSUMED census an operation consumes (retires) its parents; the standing
// RECORD, by contrast, never shrinks. The non-consuming cases are `invoke` (a
// from-scratch birth — no parent), `patch-lift` (a lift READS a sub-region and
// leaves the source byte-unchanged — the source stays unconsumed; mothership ruling
// "Route-B patch-lift RATIFIED; NON-CONSUMING"), `dualization` (the surface
// Poincaré dual REFLECTS its source — M and M* coexist; mothership ruling
// Q6/ADR 0020 "single-parent NON-consuming birth", sanctioned 2026-07-04), and
// `product` (E3 — the seat this comment held as "deferred" since it was
// written, filled by THICKEN, 2026-07-18, sealed 039feb1b…82cae: A×I is a
// dim+1 birth whose projection π_A recovers the parent exactly — the parent
// stays unconsumed; NO pentimento; manifest re-sealed in the same change), and
// `refine` (REFINE'S WORD, 2026-07-29: a RESOLUTION is not a birth — nothing
// is consumed because nothing is begotten; the form itself stays unconsumed), and
// `open-lift` (DOOR 3, 2026-08-13, sovereign-ruled Option B: the open-star
// extractor READS a star sub-region and leaves the terrain byte-unchanged —
// patch-lift's carriage MINUS its closure; deliberately NOT in GLUE_KINDS
// because no identification is performed, the rim stays a free boundary;
// manifest re-sealed in the same change).
const NON_CONSUMING: ReadonlySet<OperationKind> = new Set<OperationKind>(['invoke', 'patch-lift', 'dualization', 'product', 'open-lift', 'refine']);

// REFINE'S WORD (2026-07-29): the RESOLUTION kinds — operations that change a
// form WITHOUT begetting a new one (same form, cells minted, χ fixed; the
// trace rides `ShapeGenealogy.resolution`). A resolution shape mints NO
// `GenealogyNode`, NO parent→child edge, and NO record event: refine keeps
// the form's own id, so the form's ONE node is its original expression's, and
// the walk is INVARIANT under adding/removing a re-expression (a population
// carrying both the form and its refined expression is legal — the
// re-expression is not a second citizen, so the duplicate-id integrity throw
// rightly never sees it).
const RESOLUTION_KINDS: ReadonlySet<OperationKind> = new Set<OperationKind>(['refine']);

export interface GenealogyNode {
  id: ShapeId;
  depth: number; // = shape.genealogy.generationDepth (the ADR 0009 arrow)
  birthOperation: OperationKind; // 'invoke' for source-less roots; else genealogy.operation
  parents: ShapeId[]; // recovered from the committed parent-pointer, read forward (input order)
  vertexIds: VertexId[]; // own vertex-id set (used as a parent's vertices in the integrity check)
  createdVertexIds: VertexId[];
  lineageSources: VertexId[]; // ∪ createdBy.sourceVertexIds over the node's vertices (must ⊆ parents' vertices)
  carriedRoots: VertexId[]; // ∪ primalMultiset over the node's vertices — the CARRIED (not minted) roots
  xK: SiteIncidenceReading[]; // the per-incidence seam slots (cell-keyed ambo midpoints); [] when cell-less
}

export interface GenealogyEdge {
  parent: ShapeId;
  child: ShapeId;
  operation: OperationKind; // the child's birth operation
  consuming: boolean; // this birth's operation KIND consumes the parent — an op-kind fact,
  // never page liveness (ADR 0027 §4's three senses live elsewhere; renamed from `death`, F1)
  U?: 1 | -1; // orientation sign on glue/flip-glue/assemble edges = (-1)^w1 (seam-readiness)
}

export interface GenealogyEvent {
  kind: 'birth' | 'consumption';
  node: ShapeId;
  operation: OperationKind;
}

export interface IntegrityReport {
  acyclic: boolean; // depth strictly increases along every edge
  lineageWithinParents: boolean; // every node's lineage sources ⊆ its recorded parents' vertices
  accepted: boolean; // === acyclic && lineageWithinParents
  violations: string[];
}

export interface GenealogyDag {
  nodes: GenealogyNode[];
  edges: GenealogyEdge[];
  record: GenealogyEvent[]; // the MONOTONE append-only log (births + consumptions) — never shrinks
  unconsumedPath: number[]; // unconsumed count after each birth (with its consumptions) — NON-monotone
  unconsumedAtEnd: ShapeId[]; // never consumed by any op in the walk — an op-kind census, never page liveness
  integrity: IntegrityReport;
}

// A minimal orientation reading (structurally a committed `cascadeDriver.OrientationCert`);
// kept local so the DAG does not hard-depend on the cascade module.
export interface OrientationReading {
  w1: 0 | 1;
}

export interface BuildOptions {
  orientation?: Record<ShapeId, OrientationReading>; // per glue-child w1 (from a committed OrientationCert)
}

// U = (-1)^w1 (charter §3.2/§4.6): w1=0 orientable → +1 ; w1=1 flip-glue Möbius → −1.
export function seamSign(w1: 0 | 1): 1 | -1 {
  return w1 === 1 ? -1 : 1;
}

// The CARRIED roots of a form: the union of `primalMultiset` over every vertex — the
// source-less ancestors the form carries. A minted child contributes its parents' roots,
// never itself (carried-not-minted), because `primalMultiset` only ever bottoms out at
// source-less ids.
function carriedRootsOf(shape: Shape): VertexId[] {
  const memo = new Map<string, Map<string, number>>();
  const roots = new Set<VertexId>();
  for (const id of Object.keys(shape.vertices)) {
    for (const primal of primalMultiset(id, shape, memo).keys()) roots.add(primal);
  }
  return [...roots].sort();
}

// Every parent vertex any of this form's vertices was created from — the things that must
// be a subset of the recorded parents' vertices (the integrity tooth, half b).
function lineageSourcesOf(shape: Shape): VertexId[] {
  const sources = new Set<VertexId>();
  for (const vertex of Object.values(shape.vertices)) {
    for (const source of vertex.createdBy.sourceVertexIds) sources.add(source);
  }
  return [...sources].sort();
}

export function buildGenealogyDag(shapes: Shape[], options: BuildOptions = {}): GenealogyDag {
  const orientation = options.orientation ?? {};

  // REFINE'S WORD — the non-begetting walk: a resolution shape is not a
  // citizen of the record (no node, no edge, no birth/consumption event); the walk
  // reads only the born population.
  const citizens = shapes.filter((shape) => !RESOLUTION_KINDS.has(shape.genealogy.operation));

  const byId = new Map<ShapeId, Shape>();
  for (const shape of citizens) {
    if (byId.has(shape.id)) throw new Error(`genealogyDag: duplicate shape id "${shape.id}"`);
    byId.set(shape.id, shape);
  }

  // Recover parents from the COMMITTED parent-pointer, read forward: m is a parent of n
  // iff m === n.genealogy.parentShapeId (the single-parent arrow), OR n's shape-level
  // `sourceVertexIds` intersect m's `createdVertexIds` (the multi-parent case — e.g.
  // assemble, where `parentShapeId` is null because it is single-valued). No second
  // parentage model is invented; both signals are committed `ShapeGenealogy` fields.
  const parentsOf = (shape: Shape): ShapeId[] => {
    const parents: ShapeId[] = [];
    const seen = new Set<ShapeId>();
    const consider = (id: ShapeId | null): void => {
      if (id && id !== shape.id && byId.has(id) && !seen.has(id)) {
        seen.add(id);
        parents.push(id);
      }
    };
    consider(shape.genealogy.parentShapeId); // the committed single-parent arrow first
    const sourceSet = new Set(shape.genealogy.sourceVertexIds);
    if (sourceSet.size > 0) {
      for (const candidate of citizens) {
        if (candidate.id === shape.id) continue;
        if (candidate.genealogy.createdVertexIds.some((vertexId) => sourceSet.has(vertexId))) {
          consider(candidate.id);
        }
      }
    }
    return parents;
  };

  const nodes: GenealogyNode[] = citizens.map((shape) => {
    const parents = parentsOf(shape);
    // From-scratch nodes (no parents) carry 'invoke' AT THE DAG LAYER — the committed
    // seed creation is NOT re-tagged (seeds.ts is forbidden; the shape stays 'seed').
    const birthOperation: OperationKind = parents.length === 0 ? 'invoke' : shape.genealogy.operation;
    return {
      id: shape.id,
      depth: shape.genealogy.generationDepth,
      birthOperation,
      parents,
      vertexIds: Object.keys(shape.vertices),
      createdVertexIds: [...shape.genealogy.createdVertexIds],
      lineageSources: lineageSourcesOf(shape),
      carriedRoots: carriedRootsOf(shape),
      xK: buildIncidenceTraceRegistry(shape).sites,
    };
  });

  // Edges: one per (parent → child), carrying the child's birth op, the consuming marker, and
  // U on glue/flip-glue/assemble edges (when an orientation reading was supplied).
  const edges: GenealogyEdge[] = [];
  for (const node of nodes) {
    const consuming = !NON_CONSUMING.has(node.birthOperation);
    const w1 = orientation[node.id]?.w1;
    const carriesU = GLUE_KINDS.has(node.birthOperation) && w1 !== undefined;
    for (const parent of node.parents) {
      const edge: GenealogyEdge = { parent, child: node.id, operation: node.birthOperation, consuming };
      if (carriesU) edge.U = seamSign(w1 as 0 | 1);
      edges.push(edge);
    }
  }

  // The MONOTONE record (births + consumptions, append-only) and the NON-monotone
  // unconsumed census, walked in birth (input) order. A consuming birth retires its parents.
  const record: GenealogyEvent[] = [];
  const unconsumed = new Set<ShapeId>();
  const unconsumedPath: number[] = [];
  for (const node of nodes) {
    record.push({ kind: 'birth', node: node.id, operation: node.birthOperation });
    unconsumed.add(node.id);
    if (!NON_CONSUMING.has(node.birthOperation)) {
      for (const parent of node.parents) {
        record.push({ kind: 'consumption', node: parent, operation: node.birthOperation });
        unconsumed.delete(parent);
      }
    }
    unconsumedPath.push(unconsumed.size);
  }

  return {
    nodes,
    edges,
    record,
    unconsumedPath,
    unconsumedAtEnd: [...unconsumed],
    integrity: assessIntegrity(nodes, edges),
  };
}

// The integrity invariants (the tooth) — PURE over (nodes, edges) so a caller can re-check
// a mutated variant (an injected cycle edge, a ghost source) WITHOUT rebuilding:
//   (a) acyclic — depth STRICTLY increases along every edge;
//   (b) lineage ⊆ parents — every node's lineage sources are a subset of the union of its
//       DAG-recorded parents' vertices.
export function assessIntegrity(nodes: GenealogyNode[], edges: GenealogyEdge[]): IntegrityReport {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const violations: string[] = [];

  let acyclic = true;
  for (const edge of edges) {
    const parent = byId.get(edge.parent);
    const child = byId.get(edge.child);
    if (!parent || !child) continue;
    if (!(child.depth > parent.depth)) {
      acyclic = false;
      violations.push(
        `cycle: edge ${edge.parent} -> ${edge.child} has child depth ${child.depth} <= parent depth ${parent.depth}`,
      );
    }
  }

  let lineageWithinParents = true;
  for (const node of nodes) {
    const parentVertices = new Set<VertexId>();
    for (const parentId of node.parents) {
      const parent = byId.get(parentId);
      if (parent) for (const vertexId of parent.vertexIds) parentVertices.add(vertexId);
    }
    for (const source of node.lineageSources) {
      if (!parentVertices.has(source)) {
        lineageWithinParents = false;
        violations.push(`ghost source: node ${node.id} references ${source} not in recorded parents' vertices`);
      }
    }
  }

  return {
    acyclic,
    lineageWithinParents,
    accepted: acyclic && lineageWithinParents,
    violations,
  };
}

// Queryable ancestry / descent — the transitive closure over the recorded edges.
export function ancestorsOf(dag: GenealogyDag, id: ShapeId): ShapeId[] {
  return reachable(dag.edges, id, 'up');
}

export function descendantsOf(dag: GenealogyDag, id: ShapeId): ShapeId[] {
  return reachable(dag.edges, id, 'down');
}

function reachable(edges: GenealogyEdge[], start: ShapeId, direction: 'up' | 'down'): ShapeId[] {
  const result = new Set<ShapeId>();
  const stack = [start];
  while (stack.length) {
    const current = stack.pop() as ShapeId;
    for (const edge of edges) {
      const [from, to] = direction === 'up' ? [edge.child, edge.parent] : [edge.parent, edge.child];
      if (from === current && !result.has(to)) {
        result.add(to);
        stack.push(to);
      }
    }
  }
  return [...result].sort();
}
