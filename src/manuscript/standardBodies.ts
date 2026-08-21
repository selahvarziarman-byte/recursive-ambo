// standardBodies — P-IMMERSE Build (b): the STANDARD-BODY FAMILY. Given a
// structured `SurfaceClass`, produce a POSITIONED Shape that IS a surface of
// that class — then prove it, or refuse it.
//
// CONSTRUCTIVE, never parametrized-4g-gon (mandate §3): the closed bodies are
// GEOMETRIC CONNECTED SUMS built by the COMMITTED P2 `connectedSum` macro over
// positioned summands — the engine sews the rims (cutCell + cutCell + the
// enacted assemble), the seam vertices land at the committed centroid mint,
// and the neck between summands is exactly the enacted seam:
//   · genus-g: a CHAIN of g torus summands. Each summand is a grid torus laid
//     out with the committed `immersionPosition('torus', …)` parametrization
//     (half-step phased so two PORT cells sit centred on θ=0 / θ=π of the
//     outer equator). The θ=π port's cycle is stored ROTATED BY ONE so the
//     macro's fixed anti-parallel pairing (aᵢ ↔ b₍ₖ₋ᵢ₎ mod k) lands on the
//     geometrically FACING corners — probe-verified: all four seam pair
//     distances equal, the seam quad planar in the mid-plane (no twist). A
//     rotation of a stored cycle is the same face; the port is cut anyway.
//   · N_k: a CHAIN of k cross-cap summands — namespaced copies of the
//     COMMITTED `immerseSurface('rp2')` mesh (the committed snapshot
//     round-trip does the namespacing; only positions are translated). The
//     partner port is chosen by DETERMINISTIC weld-cost argmin (the committed
//     cross-cap mesh's cycle phases are not ours to reorder); the sum
//     certifies regardless — self-intersection is expected and honest.
//   · sphere (g=0) / single cross-cap (k=1): the committed immersion mesh
//     itself, namespaced.
//   · with-b-holes: the closed class body with b faces removed by the
//     COMMITTED `cutCell` + `materializeCutResult`, on pairwise
//     vertex-disjoint faces — each cut leaves one free boundary circle.
//
// THE FAITHFULNESS GUARD (mandate §3 — "the load-bearing check of the whole
// build"): `assertBodyCertifiesToClass` runs the SAME committed certification
// the classifier runs (analyzeGlobalW1 · the link gate · the boundary-circle
// counter) on the produced body and demands the class come back EQUAL —
// kind, g/k, b, χ, b₁. A body that does not self-certify to its class is a
// lie and THROWS. Every `buildClassBody` dispatch ends in this guard.
//
// DERIVE-ONLY · ADDITIVE: committed modules by import (`connectedSum`,
// `cutCell`/`materializeCutResult`, `immerseSurface`/`immersionPosition`,
// `deriveEdges`, `createDefaultVertexData`, the snapshot round-trip); the
// engine and the certifiers stay byte-unchanged. Positions of copies are
// transformed (translate / uniform normalize) — positions are render
// geometry, owned here; ids and complexes are never touched.

import type { Face, Shape, Vec3, Vertex, VertexId } from '../types/geometry';
import { connectedSum } from '../lib/connectedSum';
import { cutCell } from '../lib/cutOperation';
import { materializeCutResult } from '../lib/materializeOperation';
import { immerseSurface, immersionPosition } from '../lib/surfaceImmersion';
import { createDefaultVertexData, deriveEdges } from '../lib/shape';
import { deserializeSnapshot, serializeSnapshot } from '../playground/snapshot';
import {
  classifyComplexComponent,
  classLabel,
  splitComplexComponents,
  type SurfaceClass,
} from './surfaceClassifier';
import { toAssembledComplex } from './inkedFormModel';

// grid resolution of every summand (≥4 per the committed immersion contract;
// even, so a θ=π port cell exists) and the chain spacings (torus outer radius
// = 2.75 + 1.25 = 4.0; cross-cap span ≈ ±2.75)
const BODY_RESOLUTION = 8;
const TORUS_SPACING = 8.2;
const CROSSCAP_SPACING = 6.4;
const BODY_TARGET_RADIUS = 3.2; // normalized manuscript size (uniform, position-only)

// ---------------------------------------------------------------------------
// position transforms (render geometry only — never ids, never cells)
// ---------------------------------------------------------------------------

function transformed(shape: Shape, fn: (p: Vec3) => Vec3): Shape {
  const vertices: Record<VertexId, Vertex> = {};
  for (const [id, vertex] of Object.entries(shape.vertices)) {
    vertices[id] = { ...vertex, position: fn(vertex.position) };
  }
  return { ...shape, vertices };
}

const translatedX = (shape: Shape, dx: number): Shape =>
  transformed(shape, (p) => [p[0] + dx, p[1], p[2]]);

// centre on the origin and scale uniformly to the manuscript body radius
function normalizePlacement(shape: Shape): Shape {
  const positions = Object.values(shape.vertices).map((v) => v.position);
  if (positions.length === 0) return shape;
  const centre = positions
    .reduce<Vec3>((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0])
    .map((x) => x / positions.length) as Vec3;
  const radius = Math.max(
    1e-9,
    ...positions.map((p) => Math.hypot(p[0] - centre[0], p[1] - centre[1], p[2] - centre[2])),
  );
  const s = BODY_TARGET_RADIUS / radius;
  return transformed(shape, (p) => [(p[0] - centre[0]) * s, (p[1] - centre[1]) * s, (p[2] - centre[2]) * s]);
}

// a namespaced copy of a committed immersion mesh — the COMMITTED snapshot
// round-trip does the id-prefixing (the P2 fixture idiom); we only translate
function namespacedCopy(shape: Shape, ns: string, dx: number): Shape {
  return translatedX(deserializeSnapshot(serializeSnapshot(shape, ns)).shape, dx);
}

// ---------------------------------------------------------------------------
// the torus summand — a grid over the committed torus parametrization with
// two designated PORT cells (probe-verified weld alignment)
// ---------------------------------------------------------------------------

interface TorusSummand {
  shape: Shape;
  portPlus: Face; // the θ=0 outer-equator cell (faces +x) — used as faceA
  portMinus: Face; // the θ=π outer-equator cell (faces −x) — used as faceB (cycle rotated by 1)
}

function torusSummand(ns: string, cx: number): TorusSummand {
  const R = BODY_RESOLUTION;
  const vid = (i: number, j: number): string => `${ns}:v${(i + R) % R}x${(j + R) % R}`;
  const shapeId = `shape:clsbody:${ns}`;
  const vertices: Record<VertexId, Vertex> = {};
  for (let i = 0; i < R; i += 1) {
    for (let j = 0; j < R; j += 1) {
      // half-step phasing: cell (R−1, R−1) is centred on (θ=0, φ=0) — the +x
      // port; cell (R/2−1, R−1) on (θ=π, φ=0) — the −x port. The committed
      // parametrization's y/z are swapped (an isometry): the donut hole then
      // faces the reader instead of the page top — legibility, not topology.
      const p = immersionPosition('torus', (i + 0.5) / R, (j + 0.5) / R);
      const id = vid(i, j);
      vertices[id] = {
        id,
        position: [p[0] + cx, p[2], p[1]],
        // LEGIBILITY MIGRATION (B-2026-08-23-A, census site 13, sanctioned
        // frozen edit): the zoo's grid mints TRUE ABSENCE — an id in the
        // name slot is no name; a from-scratch root reads unnamed.
        data: createDefaultVertexData(''),
        createdBy: { shapeId, operation: 'seed', sourceVertexIds: [] },
      };
    }
  }
  const faces: Face[] = [];
  for (let i = 0; i < R; i += 1) {
    for (let j = 0; j < R; j += 1) {
      const std = [vid(i, j), vid(i + 1, j), vid(i + 1, j + 1), vid(i, j + 1)];
      const isPortMinus = i === R / 2 - 1 && j === R - 1;
      faces.push({
        id: `face:clsbody:${ns}:${i}x${j}`,
        // the −x port stores its cycle ROTATED BY ONE: the committed macro's
        // anti-parallel pairing then merges geometrically FACING corners
        // (same face, same orientation — a rotation, not a reflection)
        vertexIds: isPortMinus ? [std[1], std[2], std[3], std[0]] : std,
        role: 'seed-face',
      });
    }
  }
  const shape: Shape = {
    id: shapeId,
    name: `class-body torus ${ns}`,
    vertices,
    edges: deriveEdges(faces, shapeId),
    faces,
    cells: [],
    generations: [],
    genealogy: {
      parentShapeId: null,
      operation: 'seed',
      generationDepth: 0,
      sourceVertexIds: [],
      createdVertexIds: Object.keys(vertices),
      createdAt: '',
    },
  };
  const portPlus = faces.find((f) => f.id === `face:clsbody:${ns}:${R - 1}x${R - 1}`) as Face;
  const portMinus = faces.find((f) => f.id === `face:clsbody:${ns}:${R / 2 - 1}x${R - 1}`) as Face;
  return { shape, portPlus, portMinus };
}

// ---------------------------------------------------------------------------
// deterministic port selection on committed meshes (cross-cap chain)
// ---------------------------------------------------------------------------

const faceCentroid = (shape: Shape, face: Face): Vec3 => {
  const sum = face.vertexIds.reduce<Vec3>(
    (acc, id) => {
      const p = shape.vertices[id].position;
      return [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]];
    },
    [0, 0, 0],
  );
  return [sum[0] / face.vertexIds.length, sum[1] / face.vertexIds.length, sum[2] / face.vertexIds.length];
};

const distinctCorners = (face: Face): boolean => new Set(face.vertexIds).size === face.vertexIds.length;

// the far-side face: extremal centroid·dir among distinct-corner faces
function extremalFace(shape: Shape, dir: 1 | -1): Face {
  let best: { face: Face; x: number } | null = null;
  for (const face of shape.faces) {
    if (!distinctCorners(face)) continue;
    const x = faceCentroid(shape, face)[0] * dir;
    if (!best || x > best.x) best = { face, x };
  }
  if (!best) throw new Error('standardBodies: no face with distinct corners — cannot choose a port');
  return best.face;
}

// the committed macro's pairing is fixed (aᵢ ↔ b₍ₖ₋ᵢ₎): choose the partner face
// whose corners land nearest under it (deterministic argmin, ties by face id)
function argminWeldFace(shapeA: Shape, faceA: Face, shapeB: Shape): Face {
  const k = faceA.vertexIds.length;
  let best: { face: Face; cost: number } | null = null;
  for (const face of shapeB.faces) {
    if (!distinctCorners(face) || face.vertexIds.length !== k) continue;
    let cost = 0;
    for (let i = 0; i < k; i += 1) {
      const pa = shapeA.vertices[faceA.vertexIds[i]].position;
      const pb = shapeB.vertices[face.vertexIds[(k - i) % k]].position;
      cost = Math.max(cost, Math.hypot(pa[0] - pb[0], pa[1] - pb[1], pa[2] - pb[2]));
    }
    if (!best || cost < best.cost || (cost === best.cost && face.id < best.face.id)) {
      best = { face, cost };
    }
  }
  if (!best) throw new Error('standardBodies: no congruent distinct-corner face to weld to');
  return best.face;
}

// ---------------------------------------------------------------------------
// the closed bodies
// ---------------------------------------------------------------------------

function buildOrientableClosedBody(g: number, ns: string): Shape {
  if (g === 0) {
    return namespacedCopy(immerseSurface({ surface: 'sphere', resolution: BODY_RESOLUTION }).shape, `${ns}-s0`, 0);
  }
  const summands = Array.from({ length: g }, (_, j) => torusSummand(`${ns}-s${j}`, j * TORUS_SPACING));
  let body = summands[0].shape;
  for (let j = 1; j < g; j += 1) {
    // faceA = the previous summand's +x port (its id survives the enactment);
    // faceB = the new summand's −x port (stored pre-rotated for the pairing)
    const faceA = body.faces.find((f) => f.id === summands[j - 1].portPlus.id);
    if (!faceA) throw new Error('standardBodies: the +x port did not survive the previous sum');
    body = connectedSum(body, summands[j].shape, { faceA, faceB: summands[j].portMinus }).shape;
  }
  return body;
}

function buildNonOrientableClosedBody(k: number, ns: string): Shape {
  const crossCap = (j: number): Shape =>
    namespacedCopy(immerseSurface({ surface: 'rp2', resolution: BODY_RESOLUTION }).shape, `${ns}-s${j}`, j * CROSSCAP_SPACING);
  let body = crossCap(0);
  for (let j = 1; j < k; j += 1) {
    const next = crossCap(j);
    const faceA = extremalFace(body, 1);
    const faceB = argminWeldFace(body, faceA, next);
    body = connectedSum(body, next, { faceA, faceB }).shape;
  }
  return body;
}

// ---------------------------------------------------------------------------
// with-b-holes: the committed cut, b times, on pairwise vertex-disjoint faces
// ---------------------------------------------------------------------------

function cutDisks(closedBody: Shape, b: number): Shape {
  let body = closedBody;
  const usedVertexIds = new Set<string>();
  for (let cut = 0; cut < b; cut += 1) {
    const face = body.faces.find(
      (f) => distinctCorners(f) && f.vertexIds.every((v) => !usedVertexIds.has(v)),
    );
    if (!face) {
      throw new Error(`standardBodies: no vertex-disjoint face left for boundary circle ${cut + 1} of ${b} — refusing a touching rim`);
    }
    for (const v of face.vertexIds) usedVertexIds.add(v);
    body = materializeCutResult(body, cutCell(body, face)); // ← the committed cut, verbatim
  }
  return body;
}

// ---------------------------------------------------------------------------
// THE GUARD — the body certifies to its class, or it does not ship
// ---------------------------------------------------------------------------

export function assertBodyCertifiesToClass(body: Shape, cls: SurfaceClass): void {
  let components;
  try {
    components = splitComplexComponents(toAssembledComplex(body));
  } catch (error) {
    throw new Error(
      `standardBodies: the produced body does not bridge to a faithful complex (${error instanceof Error ? error.message : String(error)}) — refusing it`,
    );
  }
  if (components.length !== 1) {
    throw new Error(`standardBodies: the produced body is disconnected (${components.length} components) — refusing it`);
  }
  const verdict = classifyComplexComponent(components[0]);
  if (!verdict.ok) {
    throw new Error(`standardBodies: the produced body does not certify (${verdict.reason}) — refusing it`);
  }
  const got = verdict.class;
  const equal =
    got.kind === cls.kind &&
    got.b === cls.b &&
    got.chi === cls.chi &&
    got.b1 === cls.b1 &&
    (got.g ?? null) === (cls.g ?? null) &&
    (got.k ?? null) === (cls.k ?? null);
  if (!equal) {
    throw new Error(
      `standardBodies: the produced body certifies to ${classLabel(got)} (χ=${got.chi}, b₁=${got.b1}), NOT the claimed ${classLabel(cls)} (χ=${cls.chi}, b₁=${cls.b1}) — a body that does not self-certify to its class is a lie; refusing it`,
    );
  }
}

// ---------------------------------------------------------------------------
// the family dispatch
// ---------------------------------------------------------------------------

export function buildClassBody(cls: SurfaceClass, ns: string): Shape {
  const closed =
    cls.kind === 'orientable'
      ? buildOrientableClosedBody(cls.g as number, ns)
      : buildNonOrientableClosedBody(cls.k as number, ns);
  const body = cls.b > 0 ? cutDisks(closed, cls.b) : closed;
  assertBodyCertifiesToClass(body, cls); // ← the load-bearing check — always runs
  return normalizePlacement(body);
}
