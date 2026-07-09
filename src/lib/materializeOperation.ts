// materializeOperation — G5.0: operations produce FORMS, not certificates.
//
// `glueFace`/`flipGlueFace`/`collapseFace` return a `SurfaceTrace` and `cutCell` a
// `CutTrace` — certificates over an identification, never a form. This module
// MATERIALIZES the committed certificate into a renderable `Shape` (the level-2
// op's result is the ISOLATED identified polygon — the committed
// surfaceOperations header's own reading), so the playground's op-set can beget
// forms that R0/L2/field then render. It is the SAME explicit edge-class
// materialization route-B (`patchLift`) proved — reused as a pattern, not forked:
//
//   · vertices — the committed trace ledger's pull-back classes: a multi-corner
//     class is MINTED CARRIED-NOT-MINTED (`createdBy.sourceVertexIds` = ALL its
//     absorbed corners, so `primalMultiset` is the union of the parents' roots —
//     the committed `buildSignedIdentification`/`buildLedgerFromIdentification`
//     pull-back IS the membership source); a singleton class is RETAINED verbatim.
//   · edges — EXPLICIT edge classes (parallel classes preserved; self-loop
//     classes allowed; `sourceVertexIds` = the pre-merge endpoints) — an
//     endpoint-keyed re-derivation would fuse the torus's two classes and corrupt
//     χ (the route-B trap; the diagnostic's T1 bites on it).
//   · genealogy — SINGLE-PARENT birth: `parentShapeId = form.id`, `operation` =
//     the op's OperationKind ('glue' | 'flip-glue' | 'collapse' | 'cut'),
//     `generationDepth = form.depth + 1`.
//
// THE TRACE IS THE ORACLE — and it does not carry its pairings, so the boundary
// identification is RECONSTRUCTED (edgeA per pairing from the trace's committed
// `cycles` reps; the partner edge by searching the tiny assignment space) and
// then VERIFIED BY REPLAYING THE COMMITTED OP: the re-trace's identified /
// supports / cellCounts / χ / w₁ / pairSigns must equal the input trace byte-for-
// byte, else the materializer THROWS (a doctored or foreign certificate never
// materializes — the diagnostic's T2). Nothing is recomputed: every invariant the
// result carries is either the committed trace's own or independently measurable
// by the committed certifiers over the returned complex.
//
// The `Shape` type cannot carry a fundamental polygon's boundary WORD (a face
// cycle like [S,S,S,S] cannot say which slot uses which self-loop class), so the
// result rides with its faithful `AssembledComplex` and edge-class-level links —
// exactly `patchLift`'s shape of result. `result.shape` is the mandated Shape.
//
// Vertex-id note (lineage-key safety): the trace's support ids (`S:a|b|…`)
// contain `|`, a RESERVED `primalMultisetKey` character (the committed
// `multiform.assertKeySafe` precedent) — a downstream merge would corrupt the
// lineage key. Minted classes therefore get key-safe ids `mat:<members ~-joined>`
// mapped 1:1 from the trace's supports.

import type { Edge, Face, OperationKind, Shape, Vec3, Vertex, VertexId } from '../types/geometry';
import {
  collapseFace,
  faceEdgePairs,
  flipGlueFace,
  glueFace,
  type BoundaryPairing,
  type SurfaceTrace,
} from './surfaceOperations';
import type { CutTrace } from './cutOperation';
import { createDefaultVertexData } from './shape';
import { decomposeLink, type LinkDecomposition, type LinkValence } from './incidenceTraceRegistry';
import type { AssembledComplex } from './globalW1';

const RESERVED_KEY_CHARS = ['×', '|'];

function assertKeySafe(part: string, what: string): void {
  for (const reserved of RESERVED_KEY_CHARS) {
    if (part.includes(reserved)) {
      throw new Error(
        `materializeOperation: ${what} "${part}" contains reserved primalMultisetKey char "${reserved}"`,
      );
    }
  }
}

function centroidOf(points: Vec3[]): Vec3 {
  const n = points.length || 1;
  const sum = points.reduce<Vec3>(
    (acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]],
    [0, 0, 0],
  );
  return [sum[0] / n, sum[1] / n, sum[2] / n];
}

const edgeKeyOf = (u: string, v: string): string =>
  [u, v].sort((a, b) => a.localeCompare(b)).join('|');

export interface MaterializedVertexLink {
  vertexId: VertexId;
  valence: LinkValence;
  decomposition: LinkDecomposition;
}

export interface MaterializedSurface {
  shape: Shape; // the mandated result — the operation's form
  complex: AssembledComplex; // the faithful CW complex (the Shape cannot carry the boundary word)
  links: MaterializedVertexLink[]; // edge-class-level vertex links (committed decomposeLink)
  pairings: BoundaryPairing[]; // the reconstructed, REPLAY-VERIFIED identification ([] for collapse)
  supportOf: Record<VertexId, VertexId>; // original corner -> materialized vertex id
}

const SURFACE_OPERATION: Record<string, OperationKind> = {
  glue: 'glue',
  'flip-glue': 'flip-glue',
  collapse: 'collapse',
};

// ---------------------------------------------------------------------------
// pairing reconstruction + committed-op replay verification
// ---------------------------------------------------------------------------

// The fields of a SurfaceTrace that pin the identification (byte-compared on replay).
function traceSignature(trace: SurfaceTrace): string {
  return JSON.stringify({
    surface: trace.surface,
    identified: trace.identified,
    supports: trace.supports,
    pairSigns: trace.pairSigns,
    cellCounts: trace.cellCounts,
    chi: trace.chi,
    w1: trace.w1,
  });
}

// the committed ops' own documented contracts, ENFORCED (a relabelled
// certificate lies only in its name — replay cannot catch it, this does):
// glueFace = "every pair orientation-PRESERVING (+1)"; flipGlueFace = "at
// least one pair orientation-REVERSING (−1)".
function enforceModeContracts(trace: SurfaceTrace): void {
  if (trace.surface === 'glue' && trace.pairSigns.some((sign) => sign === -1)) {
    throw new Error(
      "materializeOperation: a 'glue' certificate carrying a reversing (−1) pair sign violates the committed glueFace contract — refusing to materialize",
    );
  }
  if (trace.surface === 'flip-glue' && !trace.pairSigns.some((sign) => sign === -1)) {
    throw new Error(
      "materializeOperation: a 'flip-glue' certificate with NO reversing pair violates the committed flipGlueFace contract — refusing to materialize",
    );
  }
}

// Q-M2 (sanctioned, 2026-07-09): the caller may DECLARE the pairings it ran —
// a COMPOSED chained word (the born form's birth pairs prepended to the new
// ones) may re-glue an already-identified slot pair, which the search below
// rightly forbids per single word (its used-set). Declared pairings get the
// SAME teeth: the committed op is replayed with them and the trace signature
// byte-compared — a wrong or tampered declaration refuses loudly.
function verifyDeclaredPairings(
  form: Shape,
  face: Face,
  trace: SurfaceTrace,
  declared: BoundaryPairing[],
): BoundaryPairing[] {
  enforceModeContracts(trace);
  const candidate = declared.map((p) => ({ ...p }));
  const op = trace.surface === 'flip-glue' ? flipGlueFace : glueFace;
  let replay: SurfaceTrace;
  try {
    replay = op(form, face, candidate);
  } catch (error) {
    throw new Error(
      `materializeOperation: the declared pairings do not replay through the committed op (${(error as Error).message}) — refusing to materialize`,
    );
  }
  if (traceSignature(replay) !== traceSignature(trace)) {
    throw new Error(
      'materializeOperation: the declared pairings do not reproduce this trace through the committed op — refusing to materialize',
    );
  }
  return candidate;
}

function reconstructPairings(form: Shape, face: Face, trace: SurfaceTrace): BoundaryPairing[] {
  const n = face.vertexIds.length;
  const pairCount = trace.pairSigns.length;
  if (pairCount === 0) return [];
  if (n > 8) {
    throw new Error(
      `materializeOperation: pairing reconstruction is guarded to n <= 8 boundary edges (got ${n}) — un-searched territory`,
    );
  }
  // edgeA per pairing: the committed trace.cycles[i] = [vs[edgeA_i]] (the pair's
  // rep corner). Q-M2 (sanctioned): on a QUOTIENT face the rep corner class may
  // occupy SEVERAL slots — search edgeA over ALL its occurrences (n ≤ 8 keeps
  // the search tiny); the replay signature pins the true assignment. On a
  // first-generation face each corner occurs once — the old behavior exactly.
  const edgeACandidates = trace.cycles.map((cycle, i) => {
    const occurrences = face.vertexIds
      .map((v, k) => (v === cycle[0] ? k : -1))
      .filter((k) => k >= 0);
    if (cycle.length !== 1 || occurrences.length === 0) {
      throw new Error(`materializeOperation: trace cycle ${i} does not name a face corner — not a level-2 trace`);
    }
    return occurrences;
  });
  const modes = trace.pairSigns.map((sign) => (sign === 1 ? 'preserving' : 'reversing') as BoundaryPairing['mode']);
  enforceModeContracts(trace);

  const want = traceSignature(trace);
  const matches: BoundaryPairing[][] = [];

  // assign each pairing an (edgeA, edgeB) slot pair — edgeA over the rep corner's
  // occurrences, edgeB over the still-unused slots (tiny search; n <= 8). Edges
  // left UNASSIGNED are FREE RIM edges (an OPEN certificate — cylinder/Möbius):
  // full coverage is NOT required (the G5.2 finding, fixed under this sanction) —
  // the replay verification still pins the identification exactly. Replays that
  // the committed op itself refuses are simply not matches (never a crash here).
  const assign = (i: number, used: Set<number>, acc: BoundaryPairing[]): void => {
    if (i === pairCount) {
      const candidate = acc.map((p) => ({ ...p }));
      const op = trace.surface === 'flip-glue' ? flipGlueFace : glueFace;
      let replay: SurfaceTrace;
      try {
        replay = op(form, face, candidate);
      } catch {
        return;
      }
      if (traceSignature(replay) === want) matches.push(candidate);
      return;
    }
    for (const edgeA of edgeACandidates[i]) {
      if (used.has(edgeA)) continue;
      for (let edgeB = 0; edgeB < n; edgeB += 1) {
        if (edgeB === edgeA || used.has(edgeB)) continue;
        const nextUsed = new Set(used);
        nextUsed.add(edgeA);
        nextUsed.add(edgeB);
        assign(i + 1, nextUsed, [...acc, { edgeA, edgeB, mode: modes[i] }]);
      }
    }
  };
  assign(0, new Set<number>(), []);

  if (matches.length === 0) {
    throw new Error(
      'materializeOperation: NO pairing reproduces this trace through the committed op — the certificate does not belong to (form, face) or was altered; refusing to materialize',
    );
  }
  // multiple matches would have IDENTICAL trace signatures — the same identification;
  // pick deterministically (sorted by the (edgeA,edgeB) sequence).
  matches.sort((a, b) =>
    a.map((p) => `${p.edgeA}-${p.edgeB}`).join(',').localeCompare(b.map((p) => `${p.edgeA}-${p.edgeB}`).join(',')),
  );
  return matches[0];
}

// ---------------------------------------------------------------------------
// materializeSurfaceResult — glue / flip-glue / collapse → a Shape
// ---------------------------------------------------------------------------

export function materializeSurfaceResult(
  form: Shape,
  face: Face,
  trace: SurfaceTrace,
  declaredPairings?: BoundaryPairing[],
): MaterializedSurface {
  const operation = SURFACE_OPERATION[trace.surface];
  if (!operation) {
    throw new Error(`materializeOperation: unknown trace surface "${trace.surface}"`);
  }
  const vs = face.vertexIds;
  const n = vs.length;

  // COLLAPSE is replay-verified directly (no pairings to reconstruct). Declared
  // pairings (Q-M2 composed chained words) are replay-verified; otherwise the
  // committed search reconstructs them from the trace.
  const pairings =
    trace.surface === 'collapse'
      ? []
      : declaredPairings
        ? verifyDeclaredPairings(form, face, trace, declaredPairings)
        : reconstructPairings(form, face, trace);
  if (trace.surface === 'collapse') {
    const replay = collapseFace(form, face);
    if (traceSignature(replay) !== traceSignature(trace)) {
      throw new Error('materializeOperation: collapse replay does not reproduce this trace — refusing to materialize');
    }
  }

  // (1) vertices from the committed ledger pull-back: minted carried-not-minted /
  // retained verbatim. Support ids re-keyed to lineage-safe `mat:` ids.
  const supportOf: Record<VertexId, VertexId> = {};
  const vertices: Record<VertexId, Vertex> = {};
  const mintedIds: VertexId[] = [];
  const shapeIdSuffix = pairings.map((p) => `${p.edgeA}-${p.edgeB}${p.mode === 'preserving' ? 'p' : 'r'}`).join(':');
  const shapeId = `shape:materialized:${trace.surface}:${form.id}:${face.id}${shapeIdSuffix ? `:${shapeIdSuffix}` : ''}`;

  for (const [supportId, members] of Object.entries(trace.supports)) {
    if (members.length === 1) {
      const original = form.vertices[members[0]];
      if (!original) throw new Error(`materializeOperation: corner ${members[0]} not on the form`);
      supportOf[members[0]] = original.id; // retained verbatim
      vertices[original.id] = original;
      continue;
    }
    const sorted = [...members].sort((a, b) => a.localeCompare(b));
    for (const member of sorted) assertKeySafe(member, 'identified corner id');
    const mintedId: VertexId = `mat:${sorted.join('~')}`;
    if (vertices[mintedId] || form.vertices[mintedId]) {
      throw new Error(`materializeOperation: minted id "${mintedId}" collides with an existing site`);
    }
    for (const member of members) supportOf[member] = mintedId;
    vertices[mintedId] = {
      id: mintedId,
      position: centroidOf(sorted.map((m) => form.vertices[m].position)),
      data: createDefaultVertexData(mintedId),
      createdBy: {
        shapeId,
        operation,
        // carried-not-minted: the merged class carries ALL its absorbed corners
        // (the committed ledger's pull-back membership), so primalMultiset is
        // the union of the parents' roots — never a fresh primal.
        sourceVertexIds: [...sorted],
      },
    };
    mintedIds.push(mintedId);
    void supportId;
  }
  const resultOf = (cornerId: VertexId): VertexId => {
    const target = supportOf[cornerId];
    if (!target) throw new Error(`materializeOperation: corner ${cornerId} missing from the trace supports`);
    return target;
  };

  // (2) EXPLICIT edge classes (collapse: every boundary edge collapses — none survive).
  const formEdgeByKey = new Map<string, Edge>();
  for (const e of form.edges) formEdgeByKey.set(edgeKeyOf(e.vertexIds[0], e.vertexIds[1]), e);
  const slotPairs = faceEdgePairs(face);

  let edges: Edge[] = [];
  let classOfSlot: number[] = [];
  let classEdgeIds: string[] = [];
  if (trace.surface !== 'collapse') {
    // union-find over the n boundary-edge indices per pairing (the committed χ path's structure)
    const parent = Array.from({ length: n }, (_x, k) => k);
    const find = (x: number): number => {
      let root = x;
      while (parent[root] !== root) root = parent[root];
      let cursor = x;
      while (parent[cursor] !== root) {
        const next = parent[cursor];
        parent[cursor] = root;
        cursor = next;
      }
      return root;
    };
    for (const { edgeA, edgeB } of pairings) {
      parent[find(edgeA)] = find(edgeB);
    }
    const repOfClass = new Map<number, number>(); // root -> min slot (deterministic rep)
    for (let k = 0; k < n; k += 1) {
      const root = find(k);
      repOfClass.set(root, Math.min(repOfClass.get(root) ?? k, k));
    }
    classOfSlot = Array.from({ length: n }, (_x, k) => repOfClass.get(find(k)) as number);
    const repSlots = [...new Set(classOfSlot)].sort((a, b) => a - b);
    edges = repSlots.map((rep) => {
      const [from, to] = slotPairs[rep];
      const carried = formEdgeByKey.get(edgeKeyOf(from, to));
      if (!carried) throw new Error(`materializeOperation: no form edge for face slot ${from}..${to}`);
      return {
        ...carried,
        vertexIds: [resultOf(from), resultOf(to)] as [VertexId, VertexId],
        sourceVertexIds: [from, to] as [VertexId, VertexId],
      };
    });
    classEdgeIds = repSlots.map((rep, i) => edges[i].id);
    void classEdgeIds;
  }

  // (3) the face carried with its cycle rewritten (repeats ARE the fundamental polygon).
  const faces: Face[] = [{ ...face, vertexIds: vs.map((v) => resultOf(v)) }];

  // (4) the faithful complex: per-slot edge class + direction. The rep slot is +1;
  // its partner reads −1 on a PRESERVING seam (a…a⁻¹) and +1 on a REVERSING one
  // (a…a) — the committed fundamental-polygon convention (diagnose-global-w1 §3).
  let complex: AssembledComplex;
  if (trace.surface === 'collapse') {
    const support = Object.keys(vertices)[0];
    complex = { vertices: [support], edges: [], faces: [{ boundary: [] }] };
  } else {
    const repSlots = [...new Set(classOfSlot)].sort((a, b) => a - b);
    const edgeIdOfRep = new Map<number, string>(repSlots.map((rep, i) => [rep, edges[i].id]));
    const modeOfSlot = new Map<number, BoundaryPairing['mode']>();
    for (const { edgeA, edgeB, mode } of pairings) {
      modeOfSlot.set(Math.max(edgeA, edgeB), mode); // the non-rep slot carries the seam mode
    }
    const boundary = Array.from({ length: n }, (_x, k) => {
      const rep = classOfSlot[k];
      const edgeId = edgeIdOfRep.get(rep) as string;
      let dir: 1 | -1 = 1;
      if (k !== rep) {
        const mode = modeOfSlot.get(k);
        dir = mode === 'preserving' ? -1 : 1;
      }
      return { edge: edgeId, dir };
    });
    complex = {
      vertices: Object.keys(vertices),
      edges: edges.map((e) => ({ id: e.id, u: e.vertexIds[0], v: e.vertexIds[1] })),
      faces: [{ boundary }],
    };
  }

  // (5) vertex links over HALF-EDGE END classes — the committed identifyByPairs/
  // buildGluingLink construction (§4), NOT edge classes: a self-loop edge class
  // incident to one support contributes TWO distinct link vertices (its two
  // ends); an edge-class-level link would fuse them and misread the torus's
  // 4-cycle as a junction. Link-vertices = end classes; link-edges = the corners
  // (corner p joins the incoming edge's HEAD end to the outgoing edge's TAIL
  // end). Decomposed by the committed decomposeLink. Collapse has no 1-complex
  // link (committed precedent: the surface test is χ) → [].
  const links: MaterializedVertexLink[] = [];
  if (trace.surface !== 'collapse') {
    const endParent = new Map<string, string>();
    const endFind = (x: string): string => {
      if (!endParent.has(x)) endParent.set(x, x);
      let root = x;
      while (endParent.get(root) !== root) root = endParent.get(root) as string;
      let cursor = x;
      while (endParent.get(cursor) !== root) {
        const next = endParent.get(cursor) as string;
        endParent.set(cursor, root);
        cursor = next;
      }
      return root;
    };
    const endUnion = (a: string, b: string): void => {
      endParent.set(endFind(a), endFind(b));
    };
    const endTail = (k: number): string => `${k}:0`;
    const endHead = (k: number): string => `${k}:1`;
    for (let k = 0; k < n; k += 1) {
      endFind(endTail(k));
      endFind(endHead(k));
    }
    for (const { edgeA, edgeB, mode } of pairings) {
      if (mode === 'preserving') {
        endUnion(endTail(edgeA), endHead(edgeB));
        endUnion(endHead(edgeA), endTail(edgeB));
      } else {
        endUnion(endTail(edgeA), endTail(edgeB));
        endUnion(endHead(edgeA), endHead(edgeB));
      }
    }
    for (const vertexId of Object.keys(vertices).sort((a, b) => a.localeCompare(b))) {
      const adjacency = new Map<string, string[]>();
      const addHalfEdge = (from: string, to: string): void => {
        const list = adjacency.get(from);
        if (list) list.push(to);
        else adjacency.set(from, [to]);
      };
      for (let p = 0; p < n; p += 1) {
        if (resultOf(vs[p]) !== vertexId) continue;
        const inEnd = endFind(endHead((p - 1 + n) % n));
        const outEnd = endFind(endTail(p));
        addHalfEdge(inEnd, outEnd);
        addHalfEdge(outEnd, inEnd);
      }
      const decomposition = decomposeLink(adjacency);
      links.push({ vertexId, valence: decomposition.valence, decomposition });
    }
  }

  const shape: Shape = {
    id: shapeId,
    name: `${trace.surface}(${form.name}:${face.id})`,
    vertices,
    edges,
    faces,
    cells: [],
    generations: [],
    genealogy: {
      parentShapeId: form.id,
      operation,
      generationDepth: form.genealogy.generationDepth + 1,
      sourceVertexIds: [...vs],
      createdVertexIds: mintedIds,
      createdAt: '',
    },
  };

  return { shape, complex, links, pairings, supportOf };
}

// ---------------------------------------------------------------------------
// materializeCutResult — the form minus the trace's removed 2-cell
// ---------------------------------------------------------------------------
// The committed cutCell semantics: ONLY the open 2-cell is removed (a logged
// loss); its boundary vertices — and their edges — PASS THROUGH (they remain,
// now free). χ drops by exactly the removed-cell count.

export function materializeCutResult(form: Shape, trace: CutTrace): Shape {
  const removedIds = Object.entries(trace.ledger.forward)
    .filter(([, target]) => target === null)
    .map(([sourceId]) => sourceId);
  if (!removedIds.includes(trace.removed)) {
    throw new Error(
      `materializeOperation: the CutTrace's removed cell "${trace.removed}" is not a logged loss in its own ledger — refusing to materialize`,
    );
  }
  const cutFace = form.faces.find((f) => f.id === trace.removed);
  if (!cutFace) {
    throw new Error(`materializeOperation: cut face "${trace.removed}" is not a face of the form`);
  }

  const faces = form.faces.filter((f) => f.id !== trace.removed);
  const shape: Shape = {
    id: `shape:materialized:cut:${form.id}:${trace.removed}`,
    name: `cut(${form.name}:${trace.removed})`,
    vertices: form.vertices, // pass through verbatim (retained createdBy — no re-stamp)
    edges: form.edges, // boundary edges remain (now possibly free)
    faces,
    cells: [],
    generations: [],
    genealogy: {
      parentShapeId: form.id,
      operation: 'cut',
      generationDepth: form.genealogy.generationDepth + 1,
      sourceVertexIds: [...cutFace.vertexIds],
      createdVertexIds: [], // a cut mints nothing
      createdAt: '',
    },
  };
  return shape;
}
