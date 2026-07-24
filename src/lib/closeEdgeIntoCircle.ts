// THE FIRST LOOP — closeEdgeIntoCircle: the first lossy operation, on REAL input.
//
// The first time the committed certifiers meet real material. We close one real
// edge into a circle (S¹, level 1) and watch the committed ledger record it:
// operation → consequence → faithful trace, closed once, honestly. Success is not
// a theorem — it is that the loop turns once on real material and the trace is
// faithful (co-location ≠ identity; the ledger refuses to fabricate identity).
//
// DERIVE-ONLY (Finding 1): this is a NEW ledger-level operation. It does NOT fit
// operations/GeometryOperation.execute → Shape — it produces a LEDGER FACT, not a
// Shape. The source Shape is never mutated. The committed certifiers
// (buildSignedIdentification / certifyFaithfulness / certifyOrientation /
// boundarySign / shapeLineageOf) are reused UNCHANGED — we feed them real input,
// we do not patch them. The level-1 valence (classifyLevel1Link) is a NEW small
// member of the dimension-indexed link-classifier family; decomposeLink stays the
// committed level-2 (S¹) member and is NOT edited here.
//
// Operations remain otherwise GATED: this is one identification over snapshotted
// endpoints; the topology of the merged support is the ISOLATED closed line,
// independent of how the edge sat in the source Shape (charter §1).

import type { Edge, Shape } from '../types/geometry';
import {
  buildSignedIdentification,
  certifyFaithfulness,
  certifyOrientation,
  boundarySign,
  shapeLineageOf,
  type SignedTransformationLedger,
  type FaithfulnessCertificate,
  type OrientationCertificate,
} from './transformationLedger';
import { createDefaultVertexData } from './shape';

export type Level1Valence = 'interior' | 'boundary' | 'junction';

// §D — the n=1 member of the dimension-indexed link-classifier (researcher ruling).
// At level 1 the link of a point on a 1-complex is S⁰ (arc-ends): interior ⟺ the
// point sits between two arc-ends (degree 2 — a closed 1-manifold), boundary ⟺ a
// single free end (degree 1 — a D⁰ tip), junction ⟺ three or more arc-ends meet
// (degree ≥3 — a Y). The ≥3-VERTEX floor that decomposeLink imposes is its LEVEL-2
// (S¹) spec and must NOT be imposed here — decomposeLink stays the level-2 member;
// this degree-count is the level-1 member of the SAME family.
export function classifyLevel1Link(degree: number): Level1Valence {
  if (degree >= 3) return 'junction'; // ≥3 arc-ends — a branch (Y)
  if (degree === 2) return 'interior'; // two arc-ends — a closed 1-manifold point
  return 'boundary'; // one free end (D⁰); degree 0 has no context but is not a junction
}

export interface CircleClosureTrace {
  identified: [string, string]; // [x, y] — the two endpoints identified
  support: string; // the merged support id (a single NEW id — not x, not y)
  ledger: SignedTransformationLedger; // {x,y} -> support, signed
  faithfulness: FaithfulnessCertificate; // homogeneous iff lineageOf(x) === lineageOf(y)
  orientation: OrientationCertificate; // w₁ over the circle cycle (trivially 0 at level 1)
  supportDegree: number; // arc-ends incident at the support (the isolated loop -> 2)
  level1Valence: Level1Valence; // the ruled level-1 (S⁰) classifier read off supportDegree
  passes: number; // closure-driver fixpoint passes (one identification -> 1)
}

// Close one real edge AB into a circle. Import the edge as an ISOLATED line: snapshot
// its two endpoints x, y from `shape` (their lineage is the carried charge, read from
// `shape`); do NOT mutate `shape`. "Close" identifies the endpoints into one support
// ({x, y} → support) — the edge becomes a loop S¹. The merged support's topology is the
// isolated closed line, independent of how AB sat in the source Shape.
export function closeEdgeIntoCircle(shape: Shape, edge: Edge): CircleClosureTrace {
  const [x, y] = edge.vertexIds;
  // A single NEW support id (sorted so it is order-independent; never equal to x or y).
  const support = `circle:${[x, y].slice().sort().join('|')}`;

  // x is the orientation reference (sign +1); the other endpoint's relative sign is
  // READ OFF the substrate via boundarySign. At level 1 the endpoints share no source
  // edge, so this is the +1 default — the sign machinery is the 2-cell flip-glue
  // instrument and is NOT load-bearing here. Recorded as data, not dressed up.
  const signOf = (s: string): 1 | -1 => (s === x ? 1 : boundarySign(s, x, shape));

  // §4 — THE MINIMAL CLOSURE DRIVER: enact → recompute → check, as a fixpoint loop.
  // `pending` is the work-list flag (identifications still forced); we seed it with the
  // one {x,y}→support closure. Each pass (1) ENACTs the pending identification, (2)
  // RECOMPUTEs the local incidence around the merged support from the real isolated
  // line — its two arc-ends meet at the support, so supportDegree === 2 — and (3)
  // CHECKs whether the recompute FORCED any new identification. A standalone closed
  // line forces nothing further, so the loop settles in ONE pass. It is written as the
  // loop because this is the driver reused for cascades later (explicitly NOT this
  // loop's job — here the work-list empties after the first pass).
  let passes = 0;
  let pending = true;
  let ledger!: SignedTransformationLedger;
  let supportDegree = 0;
  while (pending) {
    passes += 1;
    ledger = buildSignedIdentification([x, y], () => support, signOf); // (1) ENACT
    supportDegree = (ledger.pullBack[support] ?? []).length; // (2) RECOMPUTE: 2 arc-ends meet
    pending = false; // (3) CHECK: a single identification forces nothing further → fixpoint
  }

  // §5 — wire the committed certifiers (reused UNCHANGED) + the ruled level-1 valence.
  // Faithfulness reads the UNSIGNED projection (sources/lineage); orientation reads the
  // signed layer (signs/cycles). lineage is read from `shape` (the carried charge).
  const lineageOf = shapeLineageOf(shape);
  const faithfulness = certifyFaithfulness(
    { forward: ledger.forward, pullBack: ledger.pullBack },
    lineageOf,
  );
  const orientation = certifyOrientation(ledger, [[x, y]]); // the circle cycle x→y→x
  const level1Valence = classifyLevel1Link(supportDegree);

  return {
    identified: [x, y],
    support,
    ledger,
    faithfulness,
    orientation,
    supportDegree,
    level1Valence,
    passes,
  };
}

// ---------------------------------------------------------------------------
// P1 THE LOOP-MAKER (DOORS batch, 2026-07-24): the trace's loop, MINTED as a
// Shape the shelf can carry — V1 (the merged support) · E1 (the segment's own
// edge, now a self-loop) · F0, χ = 0, b₁ = 1. The TRACE stays the truth (the
// ledger fact above, returned alongside); this mint is its carrier for the
// person's shelf. Genealogy: `operation: 'assemble'` — ONE enacted
// identification ({x, y} → support), a single-parent birth naming the
// segment. (The word-family kinds 'glue'/'flip-glue'/'collapse' are the WORD
// doors and the shelf's load gate refuses them by design — this birth has no
// word, and the loop must ride the shelf.) The support's position is the
// endpoints' midpoint — a drawing offset, no metric claim.
// ---------------------------------------------------------------------------

export interface ClosedLoopBirth {
  shape: Shape;
  trace: CircleClosureTrace;
}

export function closeSegmentIntoLoop(segment: Shape, edge: Edge): ClosedLoopBirth {
  const trace = closeEdgeIntoCircle(segment, edge);
  const [x, y] = trace.identified;
  const px = segment.vertices[x]?.position ?? [0, 0, 0];
  const py = segment.vertices[y]?.position ?? [0, 0, 0];
  const shapeId = `shape:closed-loop:${segment.id}`;
  // the Shape CARRIER spells the support with the idn-family '+' join: the
  // snapshot's reserved-char law ('|' corrupts the lineage key) binds every id
  // a Shape OWNS; the TRACE above keeps its own committed spelling untouched.
  const support = trace.support.split('|').join('+');
  // P1-USABLE (Arman's ruling): the loop is a CLEAN 3-CYCLE, never the V1 E1
  // self-loop — the segment's edge is SUBDIVIDED into three sub-edges (two
  // midpoints carrying the edge's own lineage: sourceEdgeId = the subdivided
  // edge, sourceVertexIds = its endpoints) and the two ORIGINAL endpoints are
  // identified into the one support. No self-loop, no parallel pair: the
  // direct bridge, the boundary walker, thicken and sew all take the loop
  // whole — fold → thicken → sew lands the person a TORUS. The drawing: the
  // three cycle vertices ride a circle around the segment's midpoint — a
  // drawing offset, no metric claim.
  const m1 = `mid:${edge.id}:1`;
  const m2 = `mid:${edge.id}:2`;
  const center: [number, number, number] = [
    (px[0] + py[0]) / 2,
    (px[1] + py[1]) / 2,
    (px[2] + py[2]) / 2,
  ];
  const radius = Math.max(Math.hypot(px[0] - py[0], px[1] - py[1], px[2] - py[2]) / 2, 0.2);
  const ringAt = (angle: number): [number, number, number] => [
    center[0] + radius * Math.cos(angle),
    center[1] + radius * Math.sin(angle),
    center[2],
  ];
  const mintVertex = (id: string, angle: number) => ({
    id,
    position: ringAt(angle),
    data: createDefaultVertexData(id),
    createdBy: { shapeId, operation: 'assemble' as const, sourceVertexIds: [x, y] },
  });
  const shape: Shape = {
    id: shapeId,
    name: `loop of ${segment.name}`,
    vertices: {
      [support]: mintVertex(support, Math.PI / 2),
      [m1]: mintVertex(m1, Math.PI / 2 + (2 * Math.PI) / 3),
      [m2]: mintVertex(m2, Math.PI / 2 + (4 * Math.PI) / 3),
    },
    edges: [
      { id: `${edge.id}:1`, vertexIds: [support, m1], sourceVertexIds: [x, y], sourceEdgeId: edge.id },
      { id: `${edge.id}:2`, vertexIds: [m1, m2], sourceVertexIds: [x, y], sourceEdgeId: edge.id },
      { id: `${edge.id}:3`, vertexIds: [m2, support], sourceVertexIds: [x, y], sourceEdgeId: edge.id },
    ],
    faces: [],
    cells: [],
    generations: [],
    genealogy: {
      parentShapeId: segment.id,
      operation: 'assemble',
      generationDepth: segment.genealogy.generationDepth + 1,
      sourceVertexIds: [x, y],
      createdVertexIds: [support, m1, m2],
      createdAt: '',
    },
  };
  return { shape, trace };
}
