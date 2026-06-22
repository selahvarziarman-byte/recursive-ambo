// `cut` — THE REMOVAL OPERATION (completes the atomic set: glue / flip-glue / collapse / cut).
//
// Every operation so far has been an IDENTIFICATION → UNFAITHFUL (heterogeneous merge)
// → interior. `cut` is the first REMOVAL, and it fires the two members nothing has
// touched on real material:
//   - FAITHFUL by logging — a logged loss is the FIRST faithful real result (the whole
//     zoo was UNFAITHFUL). The committed P5 loss clause: forward[s] = null; logged →
//     FAITHFUL, silent → UNFAITHFUL.
//   - boundary — removing a 2-cell leaves a free edge; the merged vertex's post-cut
//     link opens from a closed cycle (interior) into an arc (boundary, valence-1).
//
// DERIVE-ONLY · committed certifiers UNCHANGED. Reuses certifyFaithfulness /
// decomposeLink / faceEdgePairs as-is; no Shape mutation; one pass (no cascade).
// The removal is modelled purely as a ledger fact — the open 2-cell maps to null,
// its boundary vertices pass through (they remain, now free).

import type { Face, Shape, VertexId } from '../types/geometry';
import {
  buildLedgerFromIdentification,
  certifyFaithfulness,
  shapeLineageOf,
  type TransformationLedger,
  type FaithfulnessCertificate,
} from './transformationLedger';
import { decomposeLink, type LinkValence } from './incidenceTraceRegistry';
import { faceEdgePairs } from './surfaceOperations';

export interface CutTrace {
  removed: string; // the cut face id
  ledger: TransformationLedger; // forward[face]=null (logged loss); boundary vertices pass through
  faithfulnessLogged: FaithfulnessCertificate; // removedLog=[face] -> FAITHFUL
  faithfulnessSilent: FaithfulnessCertificate; // removedLog=[]     -> UNFAITHFUL (the clause's other side)
  boundaryVertex: string; // a vertex on the cut face's boundary
  postCutLink: Record<string, string[]>; // the EXPOSED post-cut vertex link (incident faces MINUS the cut)
  valence: LinkValence; // decomposeLink(postCutLink).valence -> 'boundary'
}

// Build the vertex link of `v` from a set of faces: each face incident to `v`
// contributes ONE corner-arc joining v's two cyclic boundary-edge neighbours in that
// face (the incoming edge prev→v and the outgoing edge v→next). Reuses faceEdgePairs
// to read the oriented boundary. Removing the cut face from the input set is exactly
// what opens the closed link (cycle) into an arc.
function buildVertexLink(v: VertexId, faces: Face[]): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();
  const ensure = (x: string): string[] => {
    let list = adjacency.get(x);
    if (!list) {
      list = [];
      adjacency.set(x, list);
    }
    return list;
  };
  for (const face of faces) {
    if (!face.vertexIds.includes(v)) continue;
    const edges = faceEdgePairs(face);
    const incoming = edges.find((edge) => edge[1] === v); // prev → v
    const outgoing = edges.find((edge) => edge[0] === v); // v → next
    if (!incoming || !outgoing) continue;
    const prev = incoming[0];
    const next = outgoing[1];
    ensure(prev).push(next);
    ensure(next).push(prev);
  }
  return adjacency;
}

// Remove one real 2-cell. The open cell is removed (forward[face.id] = null, a logged
// loss); its boundary vertices pass through (forward[v] = v, they remain). Lineage is
// read from `shape` but is consulted ONLY on the pass-through vertices — the loss
// clause is lineage-independent, so certifyFaithfulness never asks for lineageOf(face.id)
// (face.id has no pull-back). Snapshot from `shape`; do NOT mutate it.
export function cutCell(shape: Shape, face: Face): CutTrace {
  const removed = face.id;

  // The ledger fact: the 2-cell is cut (→ null); each boundary vertex stays (→ itself).
  const sources = [face.id, ...face.vertexIds];
  const resultOf = (siteId: string): string | null => (siteId === face.id ? null : siteId);
  const ledger = buildLedgerFromIdentification(sources, resultOf);

  const lineageOf = shapeLineageOf(shape);
  // LOGGED → FAITHFUL (the first faithful real result); SILENT → UNFAITHFUL (the clause's other side).
  const faithfulnessLogged = certifyFaithfulness(ledger, lineageOf, [face.id]);
  const faithfulnessSilent = certifyFaithfulness(ledger, lineageOf, []);

  // The post-cut link of a boundary vertex: its incident faces MINUS the cut face.
  const boundaryVertex = face.vertexIds[0];
  const remainingFaces = shape.faces.filter((f) => f.id !== face.id);
  const adjacency = buildVertexLink(boundaryVertex, remainingFaces);
  const valence = decomposeLink(adjacency).valence;

  const postCutLink: Record<string, string[]> = {};
  for (const [vertex, neighbours] of adjacency) {
    postCutLink[vertex] = [...neighbours].sort((a, b) => a.localeCompare(b));
  }

  return {
    removed,
    ledger,
    faithfulnessLogged,
    faithfulnessSilent,
    boundaryVertex,
    postCutLink,
    valence,
  };
}
