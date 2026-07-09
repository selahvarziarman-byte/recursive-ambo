// THE LEVEL-2 ZOO — glue · flip-glue · collapse: the first surfaces, on REAL input.
//
// MILESTONE: this module fires the first real `w1 = 1` — a genuine non-orientable
// surface (Möbius / Klein / RP²) on real material, the orientation layer (P8) only
// ever exercised synthetically until now.
//
// DERIVE-ONLY · committed certifiers UNCHANGED. Each operation is a thin wrapper
// over the committed `buildSignedIdentification` / `certifyFaithfulness` /
// `certifyOrientation` / `decomposeLink`, fed level-2 input. No Shape mutation.
// `boundaryEdgeSign` is NEW and LOCAL here (the level-2 sibling of `boundarySign`);
// it is NOT added to `transformationLedger.ts` (committed modules stay byte-unchanged).
//
// On an isolated 2-cell each operation is ONE identification batch (one pass, no
// cascade — the circle's shape one rung up). The merged support's topology is the
// isolated identified polygon, independent of how the face sat in the source Shape.

import type { Face, Shape, VertexId } from '../types/geometry';
import {
  buildSignedIdentification,
  certifyFaithfulness,
  certifyOrientation,
  shapeLineageOf,
  type SignedTransformationLedger,
  type FaithfulnessCertificate,
  type OrientationCertificate,
} from './transformationLedger';
import { decomposeLink, type LinkDecomposition, type LinkValence } from './incidenceTraceRegistry';

// ---------------------------------------------------------------------------
// §3 — shared utilities
// ---------------------------------------------------------------------------

// The ordered boundary edges (v[i], v[(i+1)%n]) read off the oriented face cycle —
// the FIXED CCW boundary traversal every sign/link below is measured against.
export function faceEdgePairs(face: Face): [VertexId, VertexId][] {
  const vs = face.vertexIds;
  return vs.map((v, i) => [v, vs[(i + 1) % vs.length]] as [VertexId, VertexId]);
}

// §3 — the sign is READ relative to ONE fixed traversal (Agent-1's seal). The two
// arguments are the glued boundary edges expressed in the merged SEAM coordinates
// (each directed half-edge end mapped to the end-class it lands on), each in CCW order:
//   - ANTIPARALLEL across the seam (edgeA = [X,Y], edgeB = [Y,X]) -> +1, the
//     orientation-PRESERVING seam (the a…a⁻¹ pairing — cylinder / torus).
//   - PARALLEL across the seam (edgeA = [X,Y], edgeB = [X,Y]) -> -1, the
//     orientation-REVERSING flip (the a…a pairing — Möbius / Klein / RP²).
// This is the standard fundamental-polygon fact; it is a pure function of the two
// ordered tuples (no Shape, no global state). No shared seam detected -> +1 default.
export function boundaryEdgeSign(
  edgeA: [VertexId, VertexId],
  edgeB: [VertexId, VertexId],
): 1 | -1 {
  if (edgeA[0] === edgeB[0] && edgeA[1] === edgeB[1]) return -1; // parallel seam — reversing
  if (edgeA[0] === edgeB[1] && edgeA[1] === edgeB[0]) return 1; // antiparallel seam — preserving
  return 1; // not a shared seam (no reversal detected) -> orientation-preserving default
}

// A boundary pairing: glue edge index `edgeA` to edge index `edgeB` (indices into
// faceEdgePairs) with the chosen correspondence. `preserving` = crossed (tail~head),
// the antiparallel/orientable seam; `reversing` = parallel (tail~tail), the flip.
export interface BoundaryPairing {
  edgeA: number;
  edgeB: number;
  mode: 'preserving' | 'reversing';
}

export interface SupportLink {
  support: string; // the merged support whose link this is
  corners: VertexId[]; // the absorbed polygon corners, sorted
  adjacency: Record<string, string[]>; // the EXPOSED level-2 link adjacency (serialized Map)
  valence: LinkValence; // decomposeLink(adjacency).valence
  decomposition: LinkDecomposition;
  vertexCount: number; // |link vertices|
  edgeCount: number; // |link edges| (undirected)
  degrees: Record<string, number>; // per link-vertex degree (for the bigon / arc FACTs)
}

export interface SurfaceTrace {
  surface: string;
  identified: Record<string, string | null>; // forward: corner -> support
  supports: Record<string, VertexId[]>; // pullBack: support -> absorbed corners
  ledger: SignedTransformationLedger;
  faithfulness: FaithfulnessCertificate;
  orientation: OrientationCertificate;
  pairSigns: (1 | -1)[]; // one per identified pair (boundaryEdgeSign over the seam)
  cycles: string[][]; // one singleton cycle PER pair (each carries that pair's sign)
  links: SupportLink[]; // per multi-corner merged support
  w1: 0 | 1;
  nonOrientable: boolean;
  passes: number; // one-pass fixpoint (no cascade)
  cellCounts: { v: number; e: number; f: number }; // distinct cells after identification (the REAL CW counts)
  chi: number; // Euler characteristic V − E + F — the SURFACE invariant
}

// ---------------------------------------------------------------------------
// local union-find over string ids (corners and half-edges)
// ---------------------------------------------------------------------------
function makeUnionFind() {
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    if (!parent.has(x)) parent.set(x, x);
    let root = x;
    while (parent.get(root) !== root) root = parent.get(root) as string;
    let cursor = x;
    while (parent.get(cursor) !== root) {
      const next = parent.get(cursor) as string;
      parent.set(cursor, root);
      cursor = next;
    }
    return root;
  };
  const union = (a: string, b: string): void => {
    parent.set(find(a), find(b));
  };
  return { find, union };
}

// Half-edge ids: each boundary edge index k has two ends — `${k}:0` at its CCW-tail
// vertex v[k], `${k}:1` at its CCW-head vertex v[k+1].
const endTail = (k: number): string => `${k}:0`;
const endHead = (k: number): string => `${k}:1`;

// ---------------------------------------------------------------------------
// §4 — the level-2 vertex-link builder (the audit checks THIS adjacency)
// ---------------------------------------------------------------------------
// For a gluing, the merged support's link is read off the REAL incidence:
//   - link-vertices = the directed half-edges at the support (identified edges share
//     their corresponding ends per the gluing correspondence);
//   - link-edges = the polygon corners absorbed into the support: corner at position
//     p (vertex v[p]) sits between the incoming edge e_{p-1} (its HEAD end) and the
//     outgoing edge e_p (its TAIL end), contributing ONE link-edge joining their
//     end-classes.
function buildGluingLink(
  supportId: string,
  cornerPositions: number[],
  n: number,
  endClassOf: (end: string) => string,
): SupportLink {
  const adjacency = new Map<string, string[]>();
  const ensure = (v: string): string[] => {
    let list = adjacency.get(v);
    if (!list) {
      list = [];
      adjacency.set(v, list);
    }
    return list;
  };
  let edgeCount = 0;
  for (const p of cornerPositions) {
    const prev = (p - 1 + n) % n;
    const inEnd = endClassOf(endHead(prev)); // incoming edge e_{p-1}, head end at v[p]
    const outEnd = endClassOf(endTail(p)); // outgoing edge e_p, tail end at v[p]
    ensure(inEnd).push(outEnd);
    ensure(outEnd).push(inEnd);
    edgeCount += 1;
  }
  return finishLink(supportId, cornerPositions, n, adjacency, edgeCount);
}

function finishLink(
  supportId: string,
  cornerPositions: number[],
  _n: number,
  adjacency: Map<string, string[]>,
  edgeCount: number,
  cornersOverride?: VertexId[],
): SupportLink {
  const decomposition = decomposeLink(adjacency);
  const adjacencyRecord: Record<string, string[]> = {};
  const degrees: Record<string, number> = {};
  for (const [vertex, neighbours] of adjacency) {
    adjacencyRecord[vertex] = [...neighbours].sort((a, b) => a.localeCompare(b));
    degrees[vertex] = neighbours.length;
  }
  return {
    support: supportId,
    corners: cornersOverride ?? cornerPositions.map((p) => `pos:${p}`),
    adjacency: adjacencyRecord,
    valence: decomposition.valence,
    decomposition,
    vertexCount: adjacency.size,
    edgeCount,
    degrees,
  };
}

// ---------------------------------------------------------------------------
// the shared core — derive-only enact -> recompute -> check (the committed driver)
// ---------------------------------------------------------------------------
function identifyByPairs(
  shape: Shape,
  face: Face,
  pairings: BoundaryPairing[],
  surface: string,
): SurfaceTrace {
  const vs = face.vertexIds;
  const n = vs.length;
  const edges = faceEdgePairs(face);

  // Q-M2 (sanctioned, 2026-07-09): a BORN QUOTIENT face repeats corner CLASSES
  // in its cycle. The identification COMPOSES over the distinct class ids (the
  // union-find is id-keyed, so every occurrence of a class moves together —
  // quotient-of-a-quotient); the ledger below is seeded per DISTINCT class so
  // the pull-back carries each absorbed site once. Positions/links keep every
  // occurrence (each corner wedge contributes to its support's link).
  const cornerIds = [...new Set(vs)];

  // (1) ENACT — union corners and half-edges per the pairings' correspondence.
  const cornerUF = makeUnionFind();
  const endUF = makeUnionFind();
  cornerIds.forEach((v) => cornerUF.find(v)); // seed all corner classes as their own class
  for (const { edgeA, edgeB, mode } of pairings) {
    const ai = edgeA;
    const bj = edgeB;
    if (mode === 'preserving') {
      // crossed: tail~head, head~tail (the antiparallel / orientable seam)
      cornerUF.union(vs[ai], vs[(bj + 1) % n]);
      cornerUF.union(vs[(ai + 1) % n], vs[bj]);
      endUF.union(endTail(ai), endHead(bj));
      endUF.union(endHead(ai), endTail(bj));
    } else {
      // parallel: tail~tail, head~head (the flip / non-orientable seam)
      cornerUF.union(vs[ai], vs[bj]);
      cornerUF.union(vs[(ai + 1) % n], vs[(bj + 1) % n]);
      endUF.union(endTail(ai), endTail(bj));
      endUF.union(endHead(ai), endHead(bj));
    }
  }

  // support id for a corner = its class, canonicalised by sorted member vertex ids
  // (distinct ids only — a repeated occurrence is the SAME class member).
  const classMembers = new Map<string, VertexId[]>();
  for (const v of cornerIds) {
    const root = cornerUF.find(v);
    (classMembers.get(root) ?? classMembers.set(root, []).get(root)!).push(v);
  }
  const supportOf = new Map<VertexId, string>();
  for (const members of classMembers.values()) {
    const sorted = [...members].sort((a, b) => a.localeCompare(b));
    const id = `S:${sorted.join('|')}`;
    for (const v of members) supportOf.set(v, id);
  }

  // pair signs read off the SEAM coords via boundaryEdgeSign. The seam is the
  // identified HALF-EDGE ends (endUF), NOT the vertex supports: when a gluing merges
  // every corner into one support (torus / Klein) the vertex-coords collapse to
  // [S,S] and lose the sign, but the directed half-edge ends stay distinct and carry
  // the orientation faithfully. Each edge -> [tail-end class, head-end class] in CCW.
  const resultOf = (v: VertexId): string => supportOf.get(v) as string;
  const pairSigns: (1 | -1)[] = [];
  const cycles: string[][] = [];
  const repSign = new Map<VertexId, 1 | -1>();
  for (const { edgeA, edgeB } of pairings) {
    const arrowA: [string, string] = [endUF.find(endTail(edgeA)), endUF.find(endHead(edgeA))];
    const arrowB: [string, string] = [endUF.find(endTail(edgeB)), endUF.find(endHead(edgeB))];
    const sign = boundaryEdgeSign(arrowA, arrowB);
    pairSigns.push(sign);
    // ONE singleton cycle PER pair, carrying THAT pair's sign (the mandated OR model —
    // never two flips in one cycle, never a parity over all pairs). Rep = edgeA's tail
    // corner (distinct across our configured pairs).
    // Q-M2 (sanctioned, 2026-07-09): a COMPOSED word (a chained identification —
    // the born form's birth pairs prepended to the new ones) may repeat a tail
    // corner across pairs (a quotient face repeats classes). The OR model must
    // never let a later +1 overwrite a recorded flip: −1 STICKS. For every
    // committed single-word op the reps are distinct, so this is byte-inert.
    const rep = vs[edgeA];
    repSign.set(rep, repSign.get(rep) === -1 ? -1 : sign);
    cycles.push([rep]);
  }

  // (3) CHECK — reuse the committed certifiers UNCHANGED (seeded per distinct class).
  const signOf = (v: string): 1 | -1 => repSign.get(v) ?? 1;
  const ledger = buildSignedIdentification([...cornerIds], resultOf, signOf);
  const lineageOf = shapeLineageOf(shape);
  const faithfulness = certifyFaithfulness(
    { forward: ledger.forward, pullBack: ledger.pullBack },
    lineageOf,
  );
  const orientation = certifyOrientation(ledger, cycles); // w1 = OR over the pair-cycles

  // (2) RECOMPUTE — the level-2 link of every multi-corner merged support.
  const links: SupportLink[] = [];
  const seen = new Set<string>();
  for (const members of classMembers.values()) {
    if (members.length < 2) continue; // a lone corner has no merged link
    const sorted = [...members].sort((a, b) => a.localeCompare(b));
    const supportId = `S:${sorted.join('|')}`;
    if (seen.has(supportId)) continue;
    seen.add(supportId);
    const cornerPositions = vs
      .map((v, i) => (cornerUF.find(v) === cornerUF.find(members[0]) ? i : -1))
      .filter((i) => i >= 0);
    const link = buildGluingLink(supportId, cornerPositions, n, (end) => endUF.find(end));
    link.corners = sorted;
    links.push(link);
  }
  links.sort((a, b) => a.support.localeCompare(b.support));

  const supports: Record<string, VertexId[]> = {};
  for (const [support, corners] of Object.entries(ledger.pullBack)) {
    supports[support] = [...corners].sort((a, b) => a.localeCompare(b));
  }

  // χ from the REAL identification: v = distinct corner supports; e = distinct edge
  // classes (a union-find over the n boundary-edge INDICES, unioned per pairing);
  // f = 1 (the single polygon). χ = v − e + f — the surface invariant.
  const edgeUF = makeUnionFind();
  for (let i = 0; i < n; i += 1) edgeUF.find(String(i)); // seed each boundary edge index
  for (const { edgeA, edgeB } of pairings) edgeUF.union(String(edgeA), String(edgeB));
  const edgeRoots = new Set<string>();
  for (let i = 0; i < n; i += 1) edgeRoots.add(edgeUF.find(String(i)));
  const cellCounts = { v: classMembers.size, e: edgeRoots.size, f: 1 };
  const chi = cellCounts.v - cellCounts.e + cellCounts.f;

  return {
    surface,
    identified: ledger.forward,
    supports,
    ledger,
    faithfulness,
    orientation,
    pairSigns,
    cycles,
    links,
    w1: orientation.w1,
    nonOrientable: orientation.nonOrientable,
    passes: 1,
    cellCounts,
    chi,
  };
}

// ---------------------------------------------------------------------------
// §5 — the three operations (derive-only)
// ---------------------------------------------------------------------------

// Glue boundary-edge PAIRS orientation-PRESERVING (every pair's boundaryEdgeSign === +1).
export function glueFace(shape: Shape, face: Face, pairings: BoundaryPairing[]): SurfaceTrace {
  const trace = identifyByPairs(shape, face, pairings, 'glue');
  return trace;
}

// Flip-glue: at least one pair is orientation-REVERSING (some boundaryEdgeSign === -1) —
// the seam that fires `w1 = 1`.
export function flipGlueFace(shape: Shape, face: Face, pairings: BoundaryPairing[]): SurfaceTrace {
  const trace = identifyByPairs(shape, face, pairings, 'flip-glue');
  return trace;
}

// Collapse the WHOLE boundary subcomplex to a single apex point — the boundary-quotient
// D²/∂D² = S² (the researcher's collapse ruling; matches the cascade's runCollapseCascade).
// Both the n boundary VERTICES and the n boundary EDGES collapse to the apex: V=1, E=0,
// F=1 → χ=2 (the manifold sphere; the face survives as the 2-cell). No pairing → w1 = 0.
// (The earlier vertices-only version left the n edges as self-loops at the apex → χ=−2, a
// non-manifold wedge — fixed here.) The corrected collapse has no 1-complex link for
// decomposeLink to read, so the surface test is χ; links: [].
export function collapseFace(shape: Shape, face: Face): SurfaceTrace {
  const vs = face.vertexIds;
  // Q-M2 (sanctioned): distinct corner classes only — a quotient face repeats
  // class ids in its cycle; the collapse absorbs each class once.
  const cornerIds = [...new Set(vs)];
  const sorted = [...cornerIds].sort((a, b) => a.localeCompare(b));
  const support = `S:${sorted.join('|')}`;
  const resultOf = (): string => support;
  const signOf = (): 1 | -1 => 1;
  const ledger = buildSignedIdentification([...cornerIds], resultOf, signOf);
  const lineageOf = shapeLineageOf(shape);
  const faithfulness = certifyFaithfulness(
    { forward: ledger.forward, pullBack: ledger.pullBack },
    lineageOf,
  );
  const orientation = certifyOrientation(ledger, []); // no pair -> no cycle -> w1 = 0

  const supports: Record<string, VertexId[]> = {};
  for (const [s, corners] of Object.entries(ledger.pullBack)) {
    supports[s] = [...corners].sort((a, b) => a.localeCompare(b));
  }

  // The boundary-quotient cell counts, derived structurally (NOT hard-coded): every one
  // of the n boundary edges collapses (dim-drops) into the apex, so e = n − n_collapsed = 0;
  // v = the single merged support (all corners → one apex); f = 1 (the surviving face).
  const boundaryEdgeCount = faceEdgePairs(face).length; // n
  const collapsedEdgeCount = boundaryEdgeCount; // all boundary edges collapse to the apex
  const cellCounts = {
    v: Object.keys(supports).length,
    e: boundaryEdgeCount - collapsedEdgeCount,
    f: 1,
  };
  const chi = cellCounts.v - cellCounts.e + cellCounts.f;

  return {
    surface: 'collapse',
    identified: ledger.forward,
    supports,
    ledger,
    faithfulness,
    orientation,
    pairSigns: [],
    cycles: [],
    links: [], // the corrected collapse has no 1-complex link — the surface test is χ
    w1: orientation.w1,
    nonOrientable: orientation.nonOrientable,
    passes: 1,
    cellCounts,
    chi,
  };
}
