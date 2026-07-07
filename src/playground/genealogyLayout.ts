// genealogyLayout — D2: the PURE (react-free) layout model behind the genealogy view.
//
// Reads the COMMITTED `buildGenealogyDag` over the playground's forms (store order)
// and lays the DAG out as depth-layered rows: the row order IS `generationDepth`
// (the ADR 0009 arrow; rows are the sorted distinct depths, so sparse depths stay
// adjacent), columns follow store order within a row, each row centered. Plain
// coordinates — no graph library. The DIAGNOSTIC requires this module directly and
// asserts the model's node/edge sets EQUAL the committed DAG's (ids, depths, birth
// operations, parents, edge labels) — the view adds pixels, never structure.
//
// DERIVE-ONLY · ADDITIVE: `buildGenealogyDag` consumed by import; no second
// parentage model, no re-derived depth (`depth` is the DAG node's own reading of
// `shape.genealogy.generationDepth`); integrity is carried through, never hidden.

import type { OperationKind, Shape, ShapeId } from '../types/geometry';
import { ancestorsOf, buildGenealogyDag, type GenealogyDag, type GenealogyEdge } from '../lib/genealogyDag';

// Q3 / D6-view — the DEFAULT rendering draws DIRECT-parent edges only. The
// committed `buildGenealogyDag` recovers parents from the carried-root
// pull-back, so a deep assembled child also gets DIRECT edges to its
// grandparents (their created vertices ride in its shape-level sources). The
// view transitively REDUCES those — LOSSLESSLY: an edge (p → c) is dropped iff
// some OTHER parent q of c already reaches p (so reachability, and the
// committed `carriedRoots` attribute, preserve the full material ancestry —
// it is just not drawn by default). `buildGenealogyDag` stays byte-unchanged;
// this is view-layer, exported pure for the diagnostic.
export function transitiveReduceEdges(dag: GenealogyDag): GenealogyEdge[] {
  return dag.edges.filter(
    (edge) =>
      !dag.edges.some(
        (other) =>
          other.child === edge.child &&
          other.parent !== edge.parent &&
          ancestorsOf(dag, other.parent).includes(edge.parent),
      ),
  );
}

export interface GenealogyViewNode {
  id: ShapeId;
  name: string; // the shape's display name (DAG nodes carry ids only)
  birthOperation: OperationKind; // the DAG node's own ('invoke' for parentless roots)
  depth: number; // === the DAG node's depth === shape.genealogy.generationDepth
  parents: ShapeId[]; // the DAG node's own (order preserved)
  x: number; // node center
  y: number;
}

export interface GenealogyViewEdge {
  parent: ShapeId;
  child: ShapeId;
  operation: OperationKind; // the DAG edge's own label
  x1: number; // parent bottom-center
  y1: number;
  x2: number; // child top-center
  y2: number;
}

export interface GenealogyViewModel {
  nodes: GenealogyViewNode[];
  edges: GenealogyViewEdge[];
  width: number;
  height: number;
  nodeWidth: number;
  nodeHeight: number;
  accepted: boolean; // dag.integrity.accepted — surfaced by the view, never hidden
  violations: string[];
}

export const GENEALOGY_NODE_WIDTH = 132;
export const GENEALOGY_NODE_HEIGHT = 40;
const H_GAP = 16;
const V_GAP = 44;
const MARGIN = 10;

export function layoutGenealogy(shapes: Shape[]): GenealogyViewModel {
  const dag = buildGenealogyDag(shapes);
  const nameOf = new Map(shapes.map((shape) => [shape.id, shape.name]));

  const depths = [...new Set(dag.nodes.map((node) => node.depth))].sort((a, b) => a - b);
  const rowOfDepth = new Map(depths.map((depth, row) => [depth, row]));
  const rows = depths.map((depth) => dag.nodes.filter((node) => node.depth === depth));

  const widest = rows.reduce((max, row) => Math.max(max, row.length), 1);
  const width = MARGIN * 2 + widest * GENEALOGY_NODE_WIDTH + (widest - 1) * H_GAP;
  const height =
    MARGIN * 2 + rows.length * GENEALOGY_NODE_HEIGHT + Math.max(0, rows.length - 1) * V_GAP;

  const nodes: GenealogyViewNode[] = [];
  for (const row of rows) {
    const rowWidth = row.length * GENEALOGY_NODE_WIDTH + (row.length - 1) * H_GAP;
    const left = (width - rowWidth) / 2;
    row.forEach((node, column) => {
      nodes.push({
        id: node.id,
        name: nameOf.get(node.id) ?? node.id,
        birthOperation: node.birthOperation,
        depth: node.depth,
        parents: [...node.parents],
        x: left + column * (GENEALOGY_NODE_WIDTH + H_GAP) + GENEALOGY_NODE_WIDTH / 2,
        y:
          MARGIN +
          (rowOfDepth.get(node.depth) ?? 0) * (GENEALOGY_NODE_HEIGHT + V_GAP) +
          GENEALOGY_NODE_HEIGHT / 2,
      });
    });
  }

  const nodeAt = new Map(nodes.map((node) => [node.id, node]));
  // Q3 — the default view draws the transitively-REDUCED (direct-parent) edges.
  const edges: GenealogyViewEdge[] = transitiveReduceEdges(dag).map((edge) => {
    const parent = nodeAt.get(edge.parent);
    const child = nodeAt.get(edge.child);
    if (!parent || !child) {
      throw new Error(
        `genealogyLayout: DAG edge ${edge.parent} -> ${edge.child} references a missing node`,
      );
    }
    return {
      parent: edge.parent,
      child: edge.child,
      operation: edge.operation,
      x1: parent.x,
      y1: parent.y + GENEALOGY_NODE_HEIGHT / 2,
      x2: child.x,
      y2: child.y - GENEALOGY_NODE_HEIGHT / 2,
    };
  });

  return {
    nodes,
    edges,
    width,
    height,
    nodeWidth: GENEALOGY_NODE_WIDTH,
    nodeHeight: GENEALOGY_NODE_HEIGHT,
    accepted: dag.integrity.accepted,
    violations: [...dag.integrity.violations],
  };
}
