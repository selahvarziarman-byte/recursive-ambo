// noncubeDomain — B.4 (ADR 0026): the non-cube domain — re-realizing a form
// in its own geometry (S³/H³), where the euclidean deck-deficit vanishes.
//
// THE SEAM THIS FILLS (the ADR's §0, the mothership's frame): the aperture
// already DIAGNOSES the non-euclidean deficit from the tower's carried edge
// links and REFUSES to realize it ("only the E³ transport is built"). This
// module is the transport that refusal has been holding a place for — the
// EXISTENCE half only (the deck-fit checker + the S³/H³ realizer + the three
// target realizations). ⛔ HABITATION (walking the curved interior) is
// deferred by the ADR's own §5 trigger; nothing here touches a view.
//
// THE THREE REALIZATIONS (first-build scope, closed — "these three
// realizations", never "the non-cube domains"):
//   · dodecahedron, opposite faces glued with a 3/10 turn → SEIFERT–WEBER
//     (H³; 6 edge-classes × 5 members; H₁ = (Z/5)³ — the committed tower
//     certifies it through the person's own gluing door);
//   · dodecahedron, 1/10 turn → the POINCARÉ HOMOLOGY SPHERE (S³; 10 × 3;
//     H₁ = 0 — the strongest classical pin there is);
//   · the lens L(p,q) — the p-bipyramid, top fan glued to the bottom fan
//     with a q-shift (S³; the equator class of p members at 2π/p + apex
//     classes of 2 at π; H₁ = Z/p).
//
// ⛔ TRAP 1 (the position-keyed adjacency — R1's trap, met a fourth time and
// routed around BY CONSTRUCTION): the deck-fit checker draws WHICH cells
// meet at an edge from the CARRIED census (`tower.gate.edgeLinks[].
// memberEdgeIds`) and WHICH faces flank a member edge from the CARRIED face
// cycles — positions enter only as the emitted co-vectors it measures
// angles from. §E's body reads no vertex position and builds no distance
// graph; the witness pins that structurally.
//
// ⛔ TRAP 2 (the size-blind dihedral): a curved dihedral DEPENDS ON SIZE, so
// the realizer SOLVES δ(inradius) = 2π/k (the instrument's Gram relations,
// `.handoff/instruments/noncube_domain_reference/`) and the checker PROVES
// the target was reached by measuring the emitted realization independently
// — never by reading the euclidean 116.565° and declaring a fit. The
// euclidean control goes through the SAME checker and must FAIL by the
// ADR's own margins (+222.8254° Seifert–Weber · −10.3048° Poincaré).
//
// THE R1 CARRY TABLE (ADR §2), honoured by construction: the realization
// lives BESIDE the Shape (a model keyed by the shape's own face/vertex ids)
// — combinatorics, pairings and lineage are never touched; positions are
// re-derived INTO the model (4-vectors in the hyperboloid/sphere model);
// the geometry class and the solved inradius are the model's own POSITIVE
// marks. Nothing is fabricated into the Shape and nothing is erased.
//
// DERIVE-ONLY · ADDITIVE: committed modules by import (readSeedCell via the
// callers; FacePairing's type); no frozen file touched.

import type { Shape, Vertex, VertexId } from '../types/geometry';
import type { FacePairing } from './faceIdentification';
import type { DomainModel } from '../manuscript/worldModel';
import { defaultPacket } from './packets';
import { createDefaultVertexData, deriveEdges } from './shape';

const PHI = (1 + Math.sqrt(5)) / 2;
const INV = 1 / PHI;

export type Vec4 = [number, number, number, number];

// ---------------------------------------------------------------------------
// §A THE SEEDS — authored tables, minted once (the seed-registry idiom).
// The 20 dodecahedron vertices are the cube corners ∪ the three rectangle
// families; the 12 face cycles are AUTHORED literals (derived once by the
// B-109 probe, CCW seen from outside — every directed edge appears exactly
// once, so the outward winding is orientable by construction).
// ---------------------------------------------------------------------------

const DODECA_VERTICES: { key: string; position: [number, number, number] }[] = [
  { key: 'a', position: [-1, -1, -1] },
  { key: 'b', position: [-1, -1, 1] },
  { key: 'c', position: [-1, 1, -1] },
  { key: 'd', position: [-1, 1, 1] },
  { key: 'e', position: [1, -1, -1] },
  { key: 'f', position: [1, -1, 1] },
  { key: 'g', position: [1, 1, -1] },
  { key: 'h', position: [1, 1, 1] },
  { key: 'i', position: [0, -INV, -PHI] },
  { key: 'j', position: [-INV, -PHI, 0] },
  { key: 'k', position: [-PHI, 0, -INV] },
  { key: 'l', position: [0, -INV, PHI] },
  { key: 'm', position: [-INV, PHI, 0] },
  { key: 'n', position: [-PHI, 0, INV] },
  { key: 'o', position: [0, INV, -PHI] },
  { key: 'p', position: [INV, -PHI, 0] },
  { key: 'q', position: [PHI, 0, -INV] },
  { key: 'r', position: [0, INV, PHI] },
  { key: 's', position: [INV, PHI, 0] },
  { key: 't', position: [PHI, 0, INV] },
];

// the probe's authored cycles — CCW from outside, directed-edge-unique
const DODECA_FACE_CYCLES = [
  'epjai', 'oiakc', 'ajbnk', 'pflbj', 'lrdnb', 'dmckn',
  'sgocm', 'gqeio', 'qtfpe', 'hsmdr', 'fthrl', 'tqgsh',
] as const;

const dot3 = (a: readonly number[], b: readonly number[]): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm3 = (v: readonly number[]): [number, number, number] => {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross3 = (a: readonly number[], b: readonly number[]): [number, number, number] => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

function mintSolidShape(
  shapeId: string,
  name: string,
  vertexTable: { key: string; position: [number, number, number] }[],
  faceCycles: { key: string; vertexKeys: string[] }[],
  topology: 'dodecahedron' | null,
): Shape {
  const vertices: Record<string, Vertex> = {};
  for (const v of vertexTable) {
    const id = `${shapeId.replace('shape:seed:', 'vertex:')}:${v.key}`;
    vertices[id] = {
      id,
      position: v.position,
      data: createDefaultVertexData(v.key.toUpperCase(), '#9a917e'),
      createdBy: { shapeId, operation: 'seed', sourceVertexIds: [] },
    };
  }
  const vid = (key: string): string => `${shapeId.replace('shape:seed:', 'vertex:')}:${key}`;
  const faces = faceCycles.map((f) => ({
    id: `${shapeId.replace('shape:seed:', 'face:')}:${f.key}`,
    vertexIds: f.vertexKeys.map(vid),
    role: 'seed-face' as const,
  }));
  const edges = deriveEdges(faces, shapeId); // the committed edge mint
  const vertexIds = Object.keys(vertices);
  const createdAt = new Date().toISOString();
  return {
    id: shapeId,
    name,
    vertices,
    edges,
    faces,
    cells: [
      {
        id: `${shapeId.replace('shape:seed:', 'cell:')}:solid`,
        kind: 'seed',
        // the lens bipyramid carries NO topology name — CellTopology (frozen
        // types) holds none for it, and the field is optional: a true
        // absence, never a fabricated 'unknown'
        ...(topology ? { topology } : {}),
        generationDepth: 0,
        parentCellId: null,
        sourceOperation: 'seed',
        vertexIds,
        faceIds: faces.map((f) => f.id),
        sourceVertexIds: [],
        sourceEdgeIds: [],
        lineage: defaultPacket().lineage,
      },
    ],
    generations: [],
    genealogy: {
      parentShapeId: null,
      operation: 'seed',
      generationDepth: 0,
      sourceVertexIds: [],
      createdVertexIds: vertexIds,
      createdAt,
    },
  } as Shape;
}

export function createDodecahedronShape(): Shape {
  return mintSolidShape(
    'shape:seed:dodeca',
    'Regular dodecahedron',
    DODECA_VERTICES,
    DODECA_FACE_CYCLES.map((cycle, k) => ({ key: `f${k}`, vertexKeys: cycle.split('') })),
    'dodecahedron',
  );
}

export function createLensBipyramidShape(p: number): Shape {
  if (!Number.isInteger(p) || p < 3) throw new Error(`noncubeDomain: the lens bipyramid needs integer p ≥ 3 (got ${p})`);
  const vertexTable: { key: string; position: [number, number, number] }[] = [];
  for (let k = 0; k < p; k += 1) {
    const a = (2 * Math.PI * k) / p;
    vertexTable.push({ key: `e${k}`, position: [Math.cos(a), Math.sin(a), 0] });
  }
  vertexTable.push({ key: 'north', position: [0, 0, 1] });
  vertexTable.push({ key: 'south', position: [0, 0, -1] });
  const faceCycles: { key: string; vertexKeys: string[] }[] = [];
  for (let k = 0; k < p; k += 1) {
    // outward winding: top CCW from outside, bottom mirrored
    faceCycles.push({ key: `top${k}`, vertexKeys: [`e${k}`, `e${(k + 1) % p}`, 'north'] });
    faceCycles.push({ key: `bot${k}`, vertexKeys: [`e${(k + 1) % p}`, `e${k}`, 'south'] });
  }
  return mintSolidShape(`shape:seed:lens${p}`, `Lens bipyramid (p=${p})`, vertexTable, faceCycles, null);
}

// ---------------------------------------------------------------------------
// §B THE PAIRINGS — mint-time numeric derivation with loud throws; the mode
// is DERIVED from the map's cycle step (never hand-set), and the committed
// tower is the oracle that certifies the result (H₁ — the witness pins it).
// ---------------------------------------------------------------------------

const rotAbout = (axis: readonly number[], ang: number, pnt: readonly number[]): [number, number, number] => {
  const [x, y, z] = pnt;
  const [ux, uy, uz] = axis;
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const d = (1 - c) * (ux * x + uy * y + uz * z);
  return [
    x * c + (uy * z - uz * y) * s + ux * d,
    y * c + (uz * x - ux * z) * s + uy * d,
    z * c + (ux * y - uy * x) * s + uz * d,
  ];
};

const faceNormalOf = (shape: Shape, faceId: string): [number, number, number] => {
  const face = shape.faces.find((f) => f.id === faceId);
  if (!face) throw new Error(`noncubeDomain: no face ${faceId}`);
  const centroid: [number, number, number] = [0, 0, 0];
  for (const vId of face.vertexIds) {
    const p = shape.vertices[vId].position;
    centroid[0] += p[0] / face.vertexIds.length;
    centroid[1] += p[1] / face.vertexIds.length;
    centroid[2] += p[2] / face.vertexIds.length;
  }
  return norm3(centroid); // origin-centered seeds: the centroid direction IS the outward normal
};

const deriveMode = (shape: Shape, pairing: Omit<FacePairing, 'mode'>): FacePairing => {
  const fA = shape.faces.find((f) => f.id === pairing.faceA);
  const fB = shape.faces.find((f) => f.id === pairing.faceB);
  if (!fA || !fB) throw new Error('noncubeDomain: pairing names a missing face');
  const pos = new Map(fB.vertexIds.map((v, i) => [v, i]));
  const n = fB.vertexIds.length;
  const i0 = pos.get(pairing.map[fA.vertexIds[0]]);
  const i1 = pos.get(pairing.map[fA.vertexIds[1]]);
  if (i0 === undefined || i1 === undefined) throw new Error('noncubeDomain: the map leaves the target cycle');
  const step = (i1 - i0 + n) % n;
  if (step !== 1 && step !== n - 1) throw new Error('noncubeDomain: the map is not a cycle isomorphism');
  return { ...pairing, mode: step === 1 ? 'preserving' : 'reversing' };
};

export type DodecahedralTwistTenths = 1 | 3 | 5 | 7 | 9;

// opposite faces glued after a twist of `tenths`/10 of a turn, measured in
// the classical projection frame (looking along the face axis). The
// candidate maps rotate the central image (−v ∈ the opposite face) by
// multiples of 72°; the classifier MEASURES each candidate's classical
// twist and picks the asked one — the convention is measured, not assumed.
export function dodecahedralTwistPairings(shape: Shape, tenths: DodecahedralTwistTenths): FacePairing[] {
  const positionsOf = (faceId: string): { vId: VertexId; p: readonly number[] }[] => {
    const face = shape.faces.find((f) => f.id === faceId);
    if (!face) throw new Error(`noncubeDomain: no face ${faceId}`);
    return face.vertexIds.map((vId) => ({ vId, p: shape.vertices[vId].position }));
  };
  const nearestVertexOf = (faceId: string, target: readonly number[]): VertexId => {
    let best: VertexId | null = null;
    let bd = Infinity;
    for (const { vId, p } of positionsOf(faceId)) {
      const d = Math.hypot(p[0] - target[0], p[1] - target[1], p[2] - target[2]);
      if (d < bd) {
        bd = d;
        best = vId;
      }
    }
    if (best === null || bd > 1e-6) {
      throw new Error(`noncubeDomain: the twist candidate does not land on a vertex of ${faceId} (miss ${bd.toExponential(2)}) — the form under pairing changed`);
    }
    return best;
  };
  const done = new Set<string>();
  const out: FacePairing[] = [];
  for (const face of shape.faces) {
    const m = faceNormalOf(shape, face.id);
    const opposite = shape.faces.find((g) => Math.abs(dot3(faceNormalOf(shape, g.id), m) + 1) < 1e-9);
    if (!opposite) throw new Error(`noncubeDomain: face ${face.id} has no opposite`);
    if (done.has(face.id) || done.has(opposite.id)) continue;
    done.add(face.id);
    done.add(opposite.id);
    // the classical twist of the k-th candidate, measured in a fixed frame
    const u = norm3(cross3(m, Math.abs(m[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]));
    const w = cross3(m, u);
    const ang = (pnt: readonly number[]): number => Math.atan2(dot3(pnt, w), dot3(pnt, u));
    const v0 = shape.vertices[face.vertexIds[0]].position;
    const rotK = [0, 1, 2, 3, 4].find((k) => {
      const img = rotAbout(m, (k * 2 * Math.PI) / 5, [-v0[0], -v0[1], -v0[2]]);
      let d = ang(img) - ang(v0);
      while (d <= -Math.PI / 10) d += 2 * Math.PI;
      while (d > 2 * Math.PI - Math.PI / 10) d -= 2 * Math.PI;
      return Math.round(d / (Math.PI / 5)) === tenths;
    });
    if (rotK === undefined) throw new Error(`noncubeDomain: no candidate realizes the ${tenths}/10 twist on ${face.id}`);
    const map: Record<string, string> = {};
    for (const vId of face.vertexIds) {
      const p = shape.vertices[vId].position;
      map[vId] = nearestVertexOf(opposite.id, rotAbout(m, (rotK * 2 * Math.PI) / 5, [-p[0], -p[1], -p[2]]));
    }
    out.push(deriveMode(shape, { faceA: face.id, faceB: opposite.id, map }));
  }
  if (out.length !== shape.faces.length / 2) throw new Error('noncubeDomain: the opposite-face matching is incomplete');
  return out;
}

export function lensPairings(shape: Shape, p: number, q: number): FacePairing[] {
  if (!Number.isInteger(q) || q < 1 || q >= p) throw new Error(`noncubeDomain: the lens twist needs 1 ≤ q < p (got q=${q})`);
  const base = shape.id.replace('shape:seed:', '');
  const vid = (key: string): string => `vertex:${base}:${key}`;
  const fid = (key: string): string => `face:${base}:${key}`;
  const out: FacePairing[] = [];
  for (let k = 0; k < p; k += 1) {
    const map: Record<string, string> = {
      [vid(`e${k}`)]: vid(`e${(k + q) % p}`),
      [vid(`e${(k + 1) % p}`)]: vid(`e${(k + q + 1) % p}`),
      [vid('north')]: vid('south'),
    };
    out.push(deriveMode(shape, { faceA: fid(`top${k}`), faceB: fid(`bot${(k + q) % p}`), map }));
  }
  return out;
}

// ---------------------------------------------------------------------------
// §C THE SOLVE (Trap 2) — δ(inradius), the instrument's Gram relations:
//   H³ (hyperboloid): cos δ = sinh²d − cosh²d · c
//   S³ (unit sphere): cos δ = −(sin²d + cos²d · c)
// with c = the adjacent face-normal dot (1/√5 for the regular dodecahedron);
// both → arccos(−c) (the euclidean dihedral) as d → 0, as they must.
// ---------------------------------------------------------------------------

export function dihedralAtInradius(geometry: 'S3' | 'H3', c: number, d: number): number {
  const cosDelta =
    geometry === 'H3' ? Math.sinh(d) ** 2 - Math.cosh(d) ** 2 * c : -(Math.sin(d) ** 2 + Math.cos(d) ** 2 * c);
  return Math.acos(Math.max(-1, Math.min(1, cosDelta)));
}

// bisection on the monotone branch — the solve THROWS if the bracket does
// not span the target (an unreachable dihedral is a refusal, never a clamp)
export function solveDihedralInradius(geometry: 'S3' | 'H3', c: number, targetRad: number): number {
  let lo = 1e-9;
  let hi = geometry === 'H3' ? 5 : Math.PI / 2 - 1e-9;
  const f = (d: number): number => dihedralAtInradius(geometry, c, d) - targetRad;
  const fLo = f(lo);
  const fHi = f(hi);
  if (fLo * fHi > 0) {
    throw new Error(
      `noncubeDomain: the ${geometry} dihedral never reaches ${((targetRad * 180) / Math.PI).toFixed(3)}° on this face family (range ${((dihedralAtInradius(geometry, c, lo) * 180) / Math.PI).toFixed(3)}° … ${((dihedralAtInradius(geometry, c, hi) * 180) / Math.PI).toFixed(3)}°) — refused, never clamped`,
    );
  }
  for (let it = 0; it < 200; it += 1) {
    const mid = (lo + hi) / 2;
    if (f(lo) * f(mid) <= 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// §D THE REALIZER — face co-vectors + vertex positions in the model space.
//   H³ hyperboloid: face plane {x : ⟨x,u⟩ = 0}, u = (cosh d · n, sinh d),
//     ⟨u,u⟩ = +1; the dihedral between adjacent planes is arccos(−⟨u,u'⟩).
//   S³: u = (cos d · n, sin d), |u| = 1, dihedral arccos(−(u·u')).
// Vertex positions are re-derived by a per-vertex radial solve (the vertex
// direction is carried; the radius solves ⟨x(r), u⟩ = 0 on its incident
// faces) and ASSERTED onto all three incident planes — a sign error cannot
// survive the assert.
// ---------------------------------------------------------------------------

export interface CurvedRealization {
  geometry: 'S3' | 'H3'; // the positive mark (ADR §2: never inferred from "not flat")
  inradius: number | null; // the solved size — the mark's content (null = constructive, the lens)
  targetDihedralRad: number | null; // the dodecahedral targets (2π/k); null on the lens (two class kinds)
  faceCovectors: Map<string, Vec4>; // keyed by the shape's own face ids (carried)
  vertexPositions: Map<string, Vec4>; // keyed by the shape's own vertex ids (re-derived)
}

const minkowski = (a: Vec4, b: Vec4): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2] - a[3] * b[3];
const dot4 = (a: Vec4, b: Vec4): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];

export const metricDot = (geometry: 'S3' | 'H3' | 'E3', a: Vec4, b: Vec4): number =>
  geometry === 'H3' ? minkowski(a, b) : dot4(a, b);

/** The adjacent-normal dot `c` the realizer's Gram relations are written in,
 * MEASURED from the shape's own faces — and it exists only if the family is
 * regular. A family whose adjacent dots differ has no single c and THROWS BY
 * NAME rather than being averaged into one. */
export function measureRegularNormalDot(shape: Shape): number {
  const normals = new Map(shape.faces.map((f) => [f.id, faceNormalOf(shape, f.id)]));
  let c: number | null = null;
  for (const fA of shape.faces) {
    for (const fB of shape.faces) {
      if (fA.id >= fB.id) continue;
      const shared = fA.vertexIds.filter((v) => fB.vertexIds.includes(v));
      if (shared.length !== 2) continue;
      const d = dot3(normals.get(fA.id) as number[], normals.get(fB.id) as number[]);
      if (c === null) c = d;
      else if (Math.abs(d - c) > 1e-9) throw new Error('noncubeDomain: the face family is not regular (adjacent-normal dots differ)');
    }
  }
  if (c === null) throw new Error('noncubeDomain: no adjacent faces found');
  return c;
}

/**
 * THE REGULAR-CELL REALIZER, general over any one-cell seed whose adjacent
 * face normals share one measured dot: the face co-vectors at the inradius
 * that SOLVES δ(d) = the target dihedral, and the vertex positions re-derived
 * onto them and asserted. `realizeDodecahedralDomain` is this function with
 * the dodecahedron's own c asserted first — ONE construction, two contracts,
 * never two copies that can drift apart.
 */
export function realizeRegularDomain(
  shape: Shape,
  geometry: 'S3' | 'H3',
  targetDihedralRad: number,
): CurvedRealization {
  const c = measureRegularNormalDot(shape);
  const normals = new Map(shape.faces.map((f) => [f.id, faceNormalOf(shape, f.id)]));
  const d = solveDihedralInradius(geometry, c, targetDihedralRad);
  const faceCovectors = new Map<string, Vec4>();
  for (const f of shape.faces) {
    const n = normals.get(f.id) as [number, number, number];
    faceCovectors.set(
      f.id,
      geometry === 'H3'
        ? [Math.cosh(d) * n[0], Math.cosh(d) * n[1], Math.cosh(d) * n[2], Math.sinh(d)]
        : // S³: the OUTWARD co-vector — u passes through the face's nearest
          // point (sin d · n, cos d) with p·u = 0, and the center (0,0,0,1)
          // sits on the NEGATIVE side (x·u = −sin d), exactly as it does in
          // H³ (⟨center,u⟩ = −sinh d). The pairwise Gram is sign-invariant;
          // the per-vertex radial solve is what a flipped sign breaks — and
          // the on-plane asserts below are what catch it.
          [Math.cos(d) * n[0], Math.cos(d) * n[1], Math.cos(d) * n[2], -Math.sin(d)],
    );
  }
  // vertex positions: the carried radial direction, the radius solved so the
  // point lies on its incident face planes — then asserted onto all of them
  const vertexPositions = new Map<string, Vec4>();
  for (const v of Object.values(shape.vertices)) {
    const w = norm3(v.position);
    const incident = shape.faces.filter((f) => f.vertexIds.includes(v.id));
    const embed = (r: number): Vec4 =>
      geometry === 'H3'
        ? [Math.sinh(r) * w[0], Math.sinh(r) * w[1], Math.sinh(r) * w[2], Math.cosh(r)]
        : [Math.sin(r) * w[0], Math.sin(r) * w[1], Math.sin(r) * w[2], Math.cos(r)];
    const u0 = faceCovectors.get(incident[0].id) as Vec4;
    const g = (r: number): number => metricDot(geometry, embed(r), u0);
    let lo = 0;
    let hi = geometry === 'H3' ? 10 : Math.PI / 2;
    if (g(lo) * g(hi) > 0) throw new Error(`noncubeDomain: the radial solve has no root for ${v.id}`);
    for (let it = 0; it < 200; it += 1) {
      const mid = (lo + hi) / 2;
      if (g(lo) * g(mid) <= 0) hi = mid;
      else lo = mid;
    }
    const x = embed((lo + hi) / 2);
    for (const f of incident) {
      const err = Math.abs(metricDot(geometry, x, faceCovectors.get(f.id) as Vec4));
      if (err > 1e-9) throw new Error(`noncubeDomain: vertex ${v.id} misses face plane ${f.id} by ${err.toExponential(2)}`);
    }
    vertexPositions.set(v.id, x);
  }
  return { geometry, inradius: d, targetDihedralRad, faceCovectors, vertexPositions };
}

export function realizeDodecahedralDomain(shape: Shape, target: 'seifert-weber' | 'poincare'): CurvedRealization {
  const geometry = target === 'seifert-weber' ? 'H3' : 'S3';
  const k = target === 'seifert-weber' ? 5 : 3; // cells per edge — the carried census must agree
  // c measured from the shape's OWN adjacent normals — asserted onto 1/√5
  const c = measureRegularNormalDot(shape);
  if (Math.abs(c - 1 / Math.sqrt(5)) > 1e-9) {
    throw new Error(`noncubeDomain: adjacent-normal dot ${c.toFixed(6)} is not the regular dodecahedron's 1/√5 — R1's seed is the prerequisite`);
  }
  return realizeRegularDomain(shape, geometry, (2 * Math.PI) / k);
}

// L-1 (STAMP L-1): the lens seed's OWN structural prerequisites, read off the
// shape — exactly what realizeLensDomain requires to construct (2p faces all
// top*/bot* in the seed's id scheme, the p equator vertices e0..e{p-1}, the
// north/south poles). Detection BY THE SEED'S OWN CONSTRUCTION, never a
// distance graph or heuristic; a shape failing any prerequisite is simply
// not a lens seed (null — the caller's regular path proceeds untouched).
export function readLensSeed(shape: Shape): { p: number } | null {
  const base = shape.id.replace('shape:seed:', '');
  if (shape.faces.length < 4 || shape.faces.length % 2 !== 0) return null;
  const p = shape.faces.length / 2;
  const keys = shape.faces.map((f) => f.id.replace(`face:${base}:`, ''));
  if (keys.filter((key) => key.startsWith('top')).length !== p) return null;
  if (keys.filter((key) => key.startsWith('bot')).length !== p) return null;
  const vertexIds = new Set(Object.keys(shape.vertices));
  if (vertexIds.size !== p + 2) return null;
  for (let k = 0; k < p; k += 1) {
    if (!vertexIds.has(`vertex:${base}:e${k}`)) return null;
  }
  if (!vertexIds.has(`vertex:${base}:north`) || !vertexIds.has(`vertex:${base}:south`)) return null;
  return { p };
}

// the lens realization is CONSTRUCTIVE (S³): the equator lies on the binding
// great circle; all top faces lie on one page (a great 2-sphere through the
// binding), all bottom faces on the other, the pages meeting at exactly
// 2π/p; the apexes are the page points orthogonal to the binding. The
// checker then MEASURES what the construction claims.
export function realizeLensDomain(shape: Shape, p: number): CurvedRealization {
  const base = shape.id.replace('shape:seed:', '');
  // the two pages meet along the binding at EXACTLY the lens dihedral:
  // u_T·u_B = sin²(π/p) − cos²(π/p) = −cos(2π/p) ⇒ arccos(−u_T·u_B) = 2π/p.
  // (The tempting (cos, ±sin) form measures π − 2π/p — a lie that would
  // COINCIDENTALLY pass at p=4; the p=5 witness leg is what kills it.)
  const uTop: Vec4 = [0, 0, Math.sin(Math.PI / p), Math.cos(Math.PI / p)];
  const uBot: Vec4 = [0, 0, Math.sin(Math.PI / p), -Math.cos(Math.PI / p)];
  const faceCovectors = new Map<string, Vec4>();
  for (const f of shape.faces) {
    const key = f.id.replace(`face:${base}:`, '');
    faceCovectors.set(f.id, key.startsWith('top') ? uTop : uBot);
  }
  const vertexPositions = new Map<string, Vec4>();
  for (let k = 0; k < p; k += 1) {
    const a = (2 * Math.PI * k) / p;
    vertexPositions.set(`vertex:${base}:e${k}`, [Math.cos(a), Math.sin(a), 0, 0]);
  }
  // the apexes: the ends of the lens's wedge arc on the circle orthogonal
  // to the binding — each on its own page (x·u = 0, asserted below)
  vertexPositions.set(`vertex:${base}:north`, [0, 0, Math.cos(Math.PI / p), -Math.sin(Math.PI / p)]);
  vertexPositions.set(`vertex:${base}:south`, [0, 0, Math.cos(Math.PI / p), Math.sin(Math.PI / p)]);
  for (const [vId, x] of vertexPositions) {
    for (const f of shape.faces) {
      if (!f.vertexIds.includes(vId)) continue;
      const err = Math.abs(dot4(x, faceCovectors.get(f.id) as Vec4));
      if (err > 1e-9) throw new Error(`noncubeDomain: lens vertex ${vId} misses its page by ${err.toExponential(2)}`);
    }
  }
  return { geometry: 'S3', inradius: null, targetDihedralRad: null, faceCovectors, vertexPositions };
}

// the §4 CONTROL's co-vectors: the euclidean face normals, fourth component
// zero — the SAME checker measures them (arccos(−n·n') = the euclidean
// interior dihedral; the Gram relations' d→0 limit)
export function euclideanControlCovectors(shape: Shape): Map<string, Vec4> {
  const out = new Map<string, Vec4>();
  for (const f of shape.faces) {
    const n = faceNormalOf(shape, f.id);
    out.set(f.id, [n[0], n[1], n[2], 0]);
  }
  return out;
}

// ---------------------------------------------------------------------------
// THE EUCLIDEAN CONTROL AS A REALIZATION (B-112): the §4 control must go
// through the SAME transport as the curved models, so it needs positions and
// co-vectors in the affine model — points (x,y,z,1), a plane {p·n̂ = h} as
// (n̂, −h), and <x,u> = p·n̂ − h. ⚠ A SECOND producer beside
// `euclideanControlCovectors`, and the two are NOT interchangeable: the angle
// control needs DIRECTION ONLY (its Gram is n̂·n̂′, which the affine offset
// would corrupt), while incidence and the isometry fit need the OFFSET. Two
// jobs, two producers, each named — never one quietly serving both.
export function euclideanControlRealization(shape: Shape): CurvedRealization {
  const faceCovectors = new Map<string, Vec4>();
  for (const f of shape.faces) {
    const n = faceNormalOf(shape, f.id);
    const c: [number, number, number] = [0, 0, 0];
    for (const vId of f.vertexIds) {
      const p = shape.vertices[vId].position;
      c[0] += p[0] / f.vertexIds.length;
      c[1] += p[1] / f.vertexIds.length;
      c[2] += p[2] / f.vertexIds.length;
    }
    faceCovectors.set(f.id, [n[0], n[1], n[2], -dot3(c, n)]);
  }
  const vertexPositions = new Map<string, Vec4>();
  for (const v of Object.values(shape.vertices)) {
    vertexPositions.set(v.id, [v.position[0], v.position[1], v.position[2], 1]);
  }
  return { geometry: 'E3' as CurvedRealization['geometry'], inradius: null, targetDihedralRad: null, faceCovectors, vertexPositions };
}

// §E THE DECK-FIT CHECKER (Trap 1: carried census, carried flankings).
// Θ(c) = Σ over the class's member edges of the dihedral between the TWO
// carried flanking faces, measured from the emitted co-vectors. The class
// list comes from `tower.gate.edgeLinks` (the carried census); the flanking
// map comes from the carried face cycles. No position is read here and no
// distance graph exists — an adjacency that re-selects with the realization
// is not expressible in this body.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// §F THE MODEL-CARRYING TRANSPORT (B-112 — ADR 0026 §8.1 field 3, and the
// seam the routing turns on).
//
// THE BLOCKER, named and cured: the committed transport is
// `p ← g(p), v ← R·v` with `DeckTransform` = TWELVE FLOATS (a 3×3 linear part
// plus a translation) over V3 — the ALGEBRA survives a model change, the TYPE
// does not. A Minkowski isometry is 4×4. ⇒ THE TRANSPORT GETS A MODEL: one
// 4×4 acting on the model's own 4-vectors, where the SAME matrix multiply
// serves all three geometries and only the INNER PRODUCT differs (E³ affine
// on (p,1) · S³ the R⁴ dot · H³ the Minkowski form). The consumer's loop is
// unchanged; it is handed a model, not a new loop.
//
// ⛔ THE MODEL IS CARRIED, NEVER RE-INFERRED (§8.2, and R1's trap a fifth
// time): `ModeledDeck.model` is the realization's SEALED class, copied from
// `CurvedRealization.geometry` — never read back off the emitted positions.
// ⛔ AND THE ISOMETRIES ARE BUILT ON THE CARRIED COMPLEX: each pairing's map
// comes from the person's own corner correspondence and the face ids they
// name — never from a distance graph over the realized positions, which
// would re-select with the realization and close the transport trivially
// (a door that always has a partner because proximity chose it).
// ---------------------------------------------------------------------------

export type Mat4 = number[]; // row-major 16

const matApply = (m: Mat4, x: Vec4): Vec4 => [
  m[0] * x[0] + m[1] * x[1] + m[2] * x[2] + m[3] * x[3],
  m[4] * x[0] + m[5] * x[1] + m[6] * x[2] + m[7] * x[3],
  m[8] * x[0] + m[9] * x[1] + m[10] * x[2] + m[11] * x[3],
  m[12] * x[0] + m[13] * x[1] + m[14] * x[2] + m[15] * x[3],
];
const matMul = (a: Mat4, b: Mat4): Mat4 => {
  const out = new Array(16).fill(0) as Mat4;
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      let s = 0;
      for (let k = 0; k < 4; k += 1) s += a[r * 4 + k] * b[k * 4 + c];
      out[r * 4 + c] = s;
    }
  }
  return out;
};
const MAT4_ID: Mat4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

// the general 4×4 inverse (Gauss–Jordan) — a door crossed the OTHER way is
// its inverse, and the walk crosses doors in both directions
function mat4Inverse(m: Mat4): Mat4 {
  const a: number[][] = [];
  for (let r = 0; r < 4; r += 1) {
    const idn = [0, 0, 0, 0];
    idn[r] = 1;
    a.push([m[r * 4], m[r * 4 + 1], m[r * 4 + 2], m[r * 4 + 3], ...idn]);
  }
  for (let col = 0; col < 4; col += 1) {
    let pivot = col;
    for (let r = col + 1; r < 4; r += 1) if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    if (Math.abs(a[pivot][col]) < 1e-12) throw new Error('noncubeDomain: a door is singular — it cannot be crossed backwards');
    [a[col], a[pivot]] = [a[pivot], a[col]];
    const d = a[col][col];
    for (let c = 0; c < 8; c += 1) a[col][c] /= d;
    for (let r = 0; r < 4; r += 1) {
      if (r === col) continue;
      const f = a[r][col];
      if (f === 0) continue;
      for (let c = 0; c < 8; c += 1) a[r][c] -= f * a[col][c];
    }
  }
  const out = new Array(16).fill(0) as Mat4;
  for (let r = 0; r < 4; r += 1) for (let c = 0; c < 4; c += 1) out[r * 4 + c] = a[r][4 + c];
  return out;
}

// solve M · P = Q for M, with P and Q holding four 4-vectors as COLUMNS
// (Gauss–Jordan on Pᵀ; a singular P means the four chosen corners are
// dependent and the caller must pick another four — never a silent fudge)
function solveTransform(P: Vec4[], Q: Vec4[]): Mat4 | null {
  const n = 4;
  // A = the 4×4 whose COLUMNS are the source points, augmented with I and
  // reduced ⇒ P⁻¹; then M = Q·P⁻¹. ⚠ THE ORDER IS THE WHOLE CONTENT: the
  // easy slip is to reduce [P | Q] and read off P⁻¹Q, which solves a
  // DIFFERENT equation and yields a matrix that fits the points it was built
  // from and nothing else. Unit-tested against a known rotation+translation
  // before use — and the corner witness below caught it first, which is what
  // the witness is for.
  const a: number[][] = [];
  for (let r = 0; r < n; r += 1) {
    const idn = [0, 0, 0, 0];
    idn[r] = 1;
    a.push([...P.map((p) => p[r]), ...idn]);
  }
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let r = col + 1; r < n; r += 1) if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    if (Math.abs(a[pivot][col]) < 1e-12) return null; // dependent points — the caller tries another triple
    [a[col], a[pivot]] = [a[pivot], a[col]];
    const d = a[col][col];
    for (let c = 0; c < 2 * n; c += 1) a[col][c] /= d;
    for (let r = 0; r < n; r += 1) {
      if (r === col) continue;
      const f = a[r][col];
      if (f === 0) continue;
      for (let c = 0; c < 2 * n; c += 1) a[r][c] -= f * a[col][c];
    }
  }
  const pinv = a.map((row) => row.slice(n));
  const out = new Array(16).fill(0) as Mat4;
  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) {
      let sum = 0;
      for (let k = 0; k < n; k += 1) sum += Q[k][r] * pinv[k][c];
      out[r * 4 + c] = sum;
    }
  }
  return out;
}

export interface ModeledDeckEntry {
  faceA: string; // the CARRIED face ids — the door's identity, never a position
  faceB: string;
  m: Mat4; // the in-model isometry carrying faceA onto faceB
  uA: Vec4; // the in-model face co-vectors, from the realization
  uB: Vec4;
}

export interface ModeledDeck {
  model: 'S3' | 'E3' | 'H3'; // CARRIED from the realization's seal — never re-inferred
  entries: ModeledDeckEntry[];
}

/**
 * ADR 0026 §8.1 field 3 — the pairing isometries as IN-MODEL maps. Each is
 * FITTED from the person's own carried corner correspondence (four
 * independent corners → M = Q·P⁻¹) and then WITNESSED, exactly as the
 * committed euclidean fit witnesses itself: the fit must reproduce EVERY
 * carried corner (not just the four it was built from), it must preserve the
 * model's inner product, and it must carry faceA's plane onto faceB's. Any
 * failure THROWS BY NAME — a transport that cannot be witnessed is never
 * handed on.
 */
export function realizePairingIsometries(
  shape: Shape,
  pairings: FacePairing[],
  realization: CurvedRealization,
): ModeledDeck {
  const geometry = realization.geometry;
  const posOf = (vertexId: string): Vec4 => {
    const p = realization.vertexPositions.get(vertexId);
    if (!p) throw new Error(`noncubeDomain: the realization carries no position for ${vertexId}`);
    return p;
  };
  // THE OFF-PLANE CONSTRAINT, carried up one dimension. A face's corners lie
  // ON its plane — a 3-dimensional subspace — so no number of them can pin a
  // 4×4. The committed euclidean fit solved this with a FIFTH, OFF-PLANE
  // point (*"inside the cell → outside past the partner"*), and the same law
  // holds here: THE CENTRE MAPS TO THE NEIGHBOUR'S CENTRE ACROSS THE EXIT
  // FACE. ⛔ Never centre→centre: a gluing isometry carries the cell OFF
  // ITSELF (the committed fit asserts exactly that), so fixing the centre
  // would fit the one map the door can never be.
  // The neighbour's centre is read from the CARRIED co-vector alone — the
  // inradius is recoverable from its fourth component in each model
  // (H³ u=(cosh d·n̂, sinh d) · S³ u=(cos d·n̂, −sin d) · E³ u=(n̂, −h)) —
  // and the walk is 2d along the same geodesic that meets the face at d.
  const centre: Vec4 = [0, 0, 0, 1];
  const neighbourCentre = (u: Vec4): Vec4 => {
    const nl = Math.hypot(u[0], u[1], u[2]);
    const nHat = [u[0] / nl, u[1] / nl, u[2] / nl];
    if (geometry === 'H3') {
      const d = Math.asinh(u[3]);
      return [Math.sinh(2 * d) * nHat[0], Math.sinh(2 * d) * nHat[1], Math.sinh(2 * d) * nHat[2], Math.cosh(2 * d)];
    }
    if (geometry === 'S3') {
      const d = Math.asin(Math.max(-1, Math.min(1, -u[3])));
      return [Math.sin(2 * d) * nHat[0], Math.sin(2 * d) * nHat[1], Math.sin(2 * d) * nHat[2], Math.cos(2 * d)];
    }
    const h = -u[3] / nl;
    return [2 * h * nHat[0], 2 * h * nHat[1], 2 * h * nHat[2], 1];
  };
  const entries: ModeledDeckEntry[] = pairings.map((pairing) => {
    const corners = Object.entries(pairing.map);
    if (corners.length < 3) throw new Error(`noncubeDomain: the pairing ${pairing.faceA}~${pairing.faceB} names too few corners`);
    const uAfit = realization.faceCovectors.get(pairing.faceA);
    const uBfit = realization.faceCovectors.get(pairing.faceB);
    if (!uAfit || !uBfit) throw new Error(`noncubeDomain: the realization carries no co-vector for ${pairing.faceA} or ${pairing.faceB}`);
    const centreImage = neighbourCentre(uBfit);
    let fit: Mat4 | null = null;
    for (let i = 0; i < corners.length && !fit; i += 1) {
      for (let j = i + 1; j < corners.length && !fit; j += 1) {
        for (let k = j + 1; k < corners.length && !fit; k += 1) {
          const P = [posOf(corners[i][0]), posOf(corners[j][0]), posOf(corners[k][0]), centre];
          const Q = [posOf(corners[i][1]), posOf(corners[j][1]), posOf(corners[k][1]), centreImage];
          fit = solveTransform(P, Q);
        }
      }
    }
    if (!fit) {
      throw new Error(`noncubeDomain: no independent corner triple fits the isometry for ${pairing.faceA}~${pairing.faceB} — refusing, never fudged`);
    }
    // WITNESS 1 — every carried corner lands on its partner (not only the
    // three the fit consumed)
    for (const [a, b] of corners) {
      const got = matApply(fit, posOf(a));
      const want = posOf(b);
      const miss = Math.hypot(got[0] - want[0], got[1] - want[1], got[2] - want[2], got[3] - want[3]);
      if (miss > 1e-6) {
        throw new Error(`noncubeDomain: the in-model isometry for ${pairing.faceA}~${pairing.faceB} misses corner ${a}→${b} by ${miss.toExponential(2)} — the fit is not the person's map`);
      }
    }
    // WITNESS 2 — it is an ISOMETRY of the model: the inner product of two
    // carried corner positions survives the map
    const p0 = posOf(corners[0][0]);
    const p1 = posOf(corners[1][0]);
    const before = metricDot(geometry, p0, p1);
    const after = metricDot(geometry, matApply(fit, p0), matApply(fit, p1));
    if (Math.abs(before - after) > 1e-6) {
      throw new Error(`noncubeDomain: the map for ${pairing.faceA}~${pairing.faceB} is not an isometry of ${geometry} (⟨,⟩ moved by ${Math.abs(before - after).toExponential(2)})`);
    }
    const uA = realization.faceCovectors.get(pairing.faceA);
    const uB = realization.faceCovectors.get(pairing.faceB);
    if (!uA || !uB) throw new Error(`noncubeDomain: the realization carries no co-vector for ${pairing.faceA} or ${pairing.faceB}`);
    return { faceA: pairing.faceA, faceB: pairing.faceB, m: fit, uA, uB };
  });
  return { model: geometry, entries };
}

/**
 * THE CLOSURE — the acceptance's own instrument, and the one thing an angle
 * sum cannot say: walking the deck around a CARRIED edge cycle must return
 * the room to itself. The product of the face-pairing isometries around an
 * edge class is the IDENTITY exactly when the deck fits; in the wrong model
 * it is a ROTATION BY THE DEFICIT — a visible seam, not a silent error.
 * ⛔ The cycle comes from `tower.gate.edgeLinks` (carried), the doors from
 * the carried face ids: no distance graph can enter here, so the transport
 * CAN fail to close — which is the only reason its closing means anything.
 */
export interface ClosureReading {
  edgeClass: string;
  memberCount: number;
  turnRad: number; // how far the composed walk is from the identity
}

export function readDeckClosure(domain: DomainModel, deck: ModeledDeck, pairings: FacePairing[]): ClosureReading[] {
  const shape = domain.shape;
  const byFace = new Map<string, ModeledDeckEntry>();
  for (const e of deck.entries) {
    byFace.set(e.faceA, e);
    byFace.set(e.faceB, e);
  }
  const pairingByFace = new Map<string, FacePairing>();
  for (const p of pairings) {
    pairingByFace.set(p.faceA, p);
    pairingByFace.set(p.faceB, p);
  }
  // the carried flanking map (the same combinatorial ground truth the deck
  // fit reads — face cycles, never positions)
  const flankings = new Map<string, string[]>();
  for (const face of shape.faces) {
    const n = face.vertexIds.length;
    for (let k = 0; k < n; k += 1) {
      const a = face.vertexIds[k];
      const b = face.vertexIds[(k + 1) % n];
      const key = a < b ? `${a}~${b}` : `${b}~${a}`;
      flankings.set(key, [...(flankings.get(key) ?? []), face.id]);
    }
  }
  const edgeKeyOf = new Map(
    shape.edges.map((e) => [
      e.id,
      e.vertexIds[0] < e.vertexIds[1] ? `${e.vertexIds[0]}~${e.vertexIds[1]}` : `${e.vertexIds[1]}~${e.vertexIds[0]}`,
    ]),
  );
  const boundaryRoots = new Set(domain.tower.gate.boundary ? domain.tower.gate.boundary.edgeClasses : []);
  const keyOfPair = (a: string, b: string): string => (a < b ? `${a}~${b}` : `${b}~${a}`);
  const out: ClosureReading[] = [];
  for (const link of domain.tower.gate.edgeLinks) {
    if (boundaryRoots.has(link.edgeClass)) continue;
    // ⛔ THE WALK IS A WALK, not a product over a list. Around an edge you
    // step from copy to copy: cross the door on the face you are standing
    // against, and the edge itself is CARRIED THROUGH that door by the
    // person's own corner map — landing on the partner face, where the OTHER
    // face flanking the image edge is the next door. The naive version (one
    // door per member edge, in list order, no direction) composes a product
    // that means nothing; it was measured not-closing and that is how it was
    // caught. The walk here is purely combinatorial — carried corner maps and
    // carried face cycles — and it must RETURN TO ITS STARTING (edge, face)
    // in exactly `memberCount` steps, or the class is refused by name.
    const startKey = edgeKeyOf.get(link.memberEdgeIds[0]);
    if (!startKey) throw new Error(`noncubeDomain: member edge ${link.memberEdgeIds[0]} is not on the seed shape`);
    const startFaces = flankings.get(startKey) ?? [];
    if (startFaces.length !== 2) throw new Error(`noncubeDomain: edge ${link.memberEdgeIds[0]} is flanked by ${startFaces.length} carried faces`);
    let edgeKey = startKey;
    let face = startFaces[0];
    let acc: Mat4 = MAT4_ID;
    for (let step = 0; step < link.memberEdgeIds.length; step += 1) {
      const door = byFace.get(face);
      const pairing = pairingByFace.get(face);
      if (!door || !pairing) throw new Error(`noncubeDomain: face ${face} carries no door — the walk cannot cross it`);
      const forward = pairing.faceA === face;
      acc = matMul(forward ? door.m : mat4Inverse(door.m), acc);
      // the edge, carried through the door by the person's own map
      const [u, v] = edgeKey.split('~');
      const image = (id: string): string => {
        if (forward) {
          const to = pairing.map[id];
          if (!to) throw new Error(`noncubeDomain: the pairing map misses corner ${id} crossing ${face}`);
          return to;
        }
        const back = Object.entries(pairing.map).find(([, b]) => b === id);
        if (!back) throw new Error(`noncubeDomain: the pairing map has no preimage for ${id} crossing ${face}`);
        return back[0];
      };
      edgeKey = keyOfPair(image(u), image(v));
      const landed = forward ? pairing.faceB : pairing.faceA;
      const next = (flankings.get(edgeKey) ?? []).filter((f) => f !== landed);
      if (next.length !== 1) throw new Error(`noncubeDomain: the image edge is flanked by ${next.length + 1} faces — the walk cannot continue`);
      face = next[0];
    }
    if (edgeKey !== startKey || face !== startFaces[0]) {
      throw new Error(
        `noncubeDomain: the walk around edge class ${link.edgeClass} did not return to its start in ${link.memberEdgeIds.length} steps — the carried cycle and the census disagree`,
      );
    }
    // the composed walk's distance from the identity, read as a TURN: the
    // rotation angle of its spatial part (trace = 1 + 2cosθ)
    const trace = acc[0] + acc[5] + acc[10];
    const cos = Math.max(-1, Math.min(1, (trace - 1) / 2));
    out.push({ edgeClass: link.edgeClass, memberCount: link.memberEdgeIds.length, turnRad: Math.acos(cos) });
  }
  return out;
}

export const DECK_FIT_EPSILON_RAD = 1e-6; // ADR §3's ε — on the ANGLE SUM, never positions

export interface DeckFitClassReading {
  edgeClass: string;
  memberCount: number;
  thetaRad: number;
  deviationRad: number; // |Θ − 2π|
}

export interface DeckFitReport {
  metric: 'S3' | 'H3' | 'E3';
  classes: DeckFitClassReading[];
  maxDeviationRad: number;
  pass: boolean;
}

export function checkDeckFit(
  domain: DomainModel,
  covectors: Map<string, Vec4>,
  metric: 'S3' | 'H3' | 'E3',
): DeckFitReport {
  const shape = domain.shape;
  // the CARRIED flanking map: edge endpoints key → the two faces whose
  // cycles walk that edge (combinatorial — the same ground truth the frozen
  // dualization orders its fans by)
  const flankings = new Map<string, string[]>();
  for (const face of shape.faces) {
    const n = face.vertexIds.length;
    for (let k = 0; k < n; k += 1) {
      const a = face.vertexIds[k];
      const b = face.vertexIds[(k + 1) % n];
      const key = a < b ? `${a}~${b}` : `${b}~${a}`;
      flankings.set(key, [...(flankings.get(key) ?? []), face.id]);
    }
  }
  const edgeKeyOf = new Map(
    shape.edges.map((e) => [e.id, e.vertexIds[0] < e.vertexIds[1] ? `${e.vertexIds[0]}~${e.vertexIds[1]}` : `${e.vertexIds[1]}~${e.vertexIds[0]}`]),
  );
  const boundaryRoots = new Set(domain.tower.gate.boundary ? domain.tower.gate.boundary.edgeClasses : []);
  const classes: DeckFitClassReading[] = [];
  for (const link of domain.tower.gate.edgeLinks) {
    if (boundaryRoots.has(link.edgeClass)) continue; // a boundary class owes no 2π
    let theta = 0;
    for (const memberId of link.memberEdgeIds) {
      const key = edgeKeyOf.get(memberId);
      if (!key) throw new Error(`noncubeDomain: member edge ${memberId} is not on the seed shape`);
      const pair = flankings.get(key) ?? [];
      if (pair.length !== 2) {
        throw new Error(`noncubeDomain: edge ${memberId} is flanked by ${pair.length} carried faces — a solid seed flanks every edge with exactly 2`);
      }
      const uA = covectors.get(pair[0]);
      const uB = covectors.get(pair[1]);
      if (!uA || !uB) throw new Error(`noncubeDomain: the realization carries no co-vector for a flanking face of ${memberId}`);
      theta += Math.acos(Math.max(-1, Math.min(1, -metricDot(metric, uA, uB))));
    }
    classes.push({
      edgeClass: link.edgeClass,
      memberCount: link.memberEdgeIds.length,
      thetaRad: theta,
      deviationRad: Math.abs(theta - 2 * Math.PI),
    });
  }
  const maxDeviationRad = classes.reduce((m, r) => Math.max(m, r.deviationRad), 0);
  return { metric, classes, maxDeviationRad, pass: maxDeviationRad <= DECK_FIT_EPSILON_RAD };
}

// ---------------------------------------------------------------------------
// §F THE PROJECTIVE CHART (B-113) — the ONE place all three models look alike,
// and the reason the committed tracer can carry them at all.
//
// Divide a model 4-vector by its fourth component and you land in a chart
// where, in EVERY model, a geodesic is a STRAIGHT LINE and a face plane is a
// FLAT PLANE:
//   · E³ x = (p, 1)            → p            (the identity — the committed frame)
//   · H³ x = (sinh r·ŵ, cosh r) → tanh r·ŵ    (the KLEIN ball; ADR 0004's
//                                              own correction: "in H³ use the
//                                              Klein model, in which rays ARE
//                                              STRAIGHT")
//   · S³ x = (sin r·ŵ, cos r)   → tan r·ŵ     (the gnomonic chart)
// ⇒ the tracer's exit-plane solve and its BVH mesh test stay LINEAR and
// UNCHANGED in all three; what changes is the TRANSPORT (a projective 4×4,
// no longer affine) and the METRE (chart length is not distance).
//
// ⛔ THE CHART'S OWN LIMIT, and why it is safe HERE and nowhere else: the
// gnomonic chart covers one open hemisphere and blows up at r = π/2; the
// Klein chart stops at the sphere at infinity. This tracer never leaves ONE
// CELL — the ray is transported HOME through every door and the scene is
// never copied — so the chart is only ever asked about points inside a cell
// of inradius ≪ π/2. ⚠ A consumer that walks OUT of the cell would need a
// different chart, and this comment is not a guard: `chartOf` REFUSES a point
// whose fourth component has collapsed, by name.
// ---------------------------------------------------------------------------

export type Chart3 = [number, number, number];

/** A model 4-vector in the projective chart. Refuses the horizon by name —
 * never a silent Infinity that would render as a hit somewhere plausible. */
export function chartOf(x: Vec4): Chart3 {
  if (Math.abs(x[3]) < 1e-9) {
    throw new Error('noncubeDomain: the projective chart cannot see this point — its fourth component has collapsed (the horizon of the chart, not a position)');
  }
  return [x[0] / x[3], x[1] / x[3], x[2] / x[3]];
}

/** The chart plane of a model face co-vector, in the tracer's own (n̂, d)
 * form: the set {k : k·n̂ = d}. ⟨u,x⟩ = 0 divided through by x₃ is
 * u_xyz·k − u₃ = 0 in H³ (the Minkowski sign) and u_xyz·k + u₃ = 0 in S³/E³. */
export function chartPlaneOf(geometry: 'S3' | 'E3' | 'H3', u: Vec4): { n: Chart3; d: number } {
  const L = Math.hypot(u[0], u[1], u[2]);
  if (L < 1e-12) throw new Error('noncubeDomain: a face co-vector with no spatial part has no chart plane');
  const raw = geometry === 'H3' ? u[3] : -u[3];
  return { n: [u[0] / L, u[1] / L, u[2] / L], d: raw / L };
}

/** THE METRE — the model distance between two CHART points. This is the one
 * quantity the chart itself cannot carry: chart length saturates at the Klein
 * boundary while true hyperbolic distance runs to infinity, and it is exactly
 * what the ink fades on. E³'s answer is the chart length, which is why the
 * committed euclidean render is unchanged. */
export function chartDistance(geometry: 'S3' | 'E3' | 'H3', a: Chart3, b: Chart3): number {
  if (geometry === 'E3') return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const lift = (k: Chart3): Vec4 => {
    const x: Vec4 = [k[0], k[1], k[2], 1];
    const q = metricDot(geometry, x, x);
    if (geometry === 'H3') {
      if (q >= -1e-12) throw new Error('noncubeDomain: a chart point outside the Klein ball has no hyperbolic position');
      const s = Math.sqrt(-q);
      return [x[0] / s, x[1] / s, x[2] / s, x[3] / s];
    }
    const s = Math.sqrt(q);
    return [x[0] / s, x[1] / s, x[2] / s, x[3] / s];
  };
  const A = lift(a);
  const B = lift(b);
  const ip = metricDot(geometry, A, B);
  return geometry === 'H3' ? Math.acosh(Math.max(1, -ip)) : Math.acos(Math.max(-1, Math.min(1, ip)));
}

/**
 * THE PROJECTIVE PUSH — a chart point AND the direction it is travelling in,
 * carried through a door's in-model 4×4.
 *
 * The ray is the projective line spanned by K = (k, 1) and W = (w, 0); the
 * door carries it to the line spanned by K′ = M·K and W′ = M·W, and the chart
 * curve σ ↦ chart(K′ + σW′) has derivative (W′ₓᵧ_z·K′₃ − K′ₓᵧ_z·W′₃)/K′₃² at
 * σ = 0. The denominator is positive, so the NUMERATOR is the new direction —
 * and it is invariant under negating the pair, so no representative choice
 * can silently reverse the ray.
 *
 * ⇒ ON AN AFFINE M (bottom row (0,0,0,1) — every euclidean door) this reduces
 * to K′₃ = 1, W′₃ = 0: the point is exactly `applyPoint` and the direction is
 * exactly `applyVector`. The committed euclidean transport is not a special
 * case bolted on beside this one; it IS this one, at E³.
 */
export function pushChartRay(m: Mat4, k: Chart3, w: Chart3): { k: Chart3; w: Chart3 } {
  const K = matApply(m, [k[0], k[1], k[2], 1]);
  const W = matApply(m, [w[0], w[1], w[2], 0]);
  if (Math.abs(K[3]) < 1e-9) {
    throw new Error('noncubeDomain: a door carried the ray onto the chart horizon — refusing, never a fabricated position');
  }
  const point: Chart3 = [K[0] / K[3], K[1] / K[3], K[2] / K[3]];
  const dir: Chart3 = [W[0] * K[3] - K[0] * W[3], W[1] * K[3] - K[1] * W[3], W[2] * K[3] - K[2] * W[3]];
  // ⚠ AN AFFINE DOOR NEEDS NO RENORMALIZATION AND MUST NOT GET ONE — and the
  // test is STRUCTURAL, not a tolerance: a bottom row of exactly (0,0,0,1)
  // makes K₃ exactly 1 and W₃ exactly 0, so `dir` is exactly the committed
  // `applyVector(R, w)`, bit for bit. Dividing it by its own hypot would move
  // every committed euclidean render by ~1e-16 per door in exchange for
  // nothing, and a bit that moves for no reason is a bit nobody can later
  // explain. A PROJECTIVE door genuinely changes the chart length — the
  // plane solve is ratio-invariant but the mesh test's t-caps and epsilons
  // are not — so it is divided.
  if (m[12] === 0 && m[13] === 0 && m[14] === 0 && m[15] === 1) return { k: point, w: dir };
  const L = Math.hypot(dir[0], dir[1], dir[2]);
  if (L < 1e-12) throw new Error('noncubeDomain: a door collapsed the ray direction — the transport is degenerate');
  return { k: point, w: [dir[0] / L, dir[1] / L, dir[2] / L] };
}

/** det of a 4×4 — the orientation mark for a model door. On an affine matrix
 * it equals the committed `deckDet` of the 3×3 block (the bottom row is
 * (0,0,0,1)), so the mirrored count is the same number it always was. */
export function mat4Det(m: Mat4): number {
  let out = 0;
  for (let c = 0; c < 4; c += 1) {
    const minor: number[][] = [];
    for (let r = 1; r < 4; r += 1) {
      const row: number[] = [];
      for (let cc = 0; cc < 4; cc += 1) if (cc !== c) row.push(m[r * 4 + cc]);
      minor.push(row);
    }
    const d3 =
      minor[0][0] * (minor[1][1] * minor[2][2] - minor[1][2] * minor[2][1]) -
      minor[0][1] * (minor[1][0] * minor[2][2] - minor[1][2] * minor[2][0]) +
      minor[0][2] * (minor[1][0] * minor[2][1] - minor[1][1] * minor[2][0]);
    out += (c % 2 === 0 ? 1 : -1) * m[c] * d3;
  }
  return out;
}

export const matrixInverse4 = mat4Inverse;
export const mat4Mul = matMul;
export const mat4Apply = matApply;

// ---------------------------------------------------------------------------
// §G THE SEAL (B-113) — the realization a PERSON-BUILT domain EARNS, or the
// refusal it earns instead.
//
// ⛔ THIS IS NOT B.0's CLASSIFIER AND MUST NOT BECOME IT. B.0 (LAW 15) killed
// a reader that took the carried edge-class size k, printed "hyperbolic", and
// realized nothing — a curvature word INFERRED from a count. Nothing here is
// inferred: a realization is CONSTRUCTED (the inradius solved so the cell's
// own dihedral becomes 2π/k) and then PROVEN three ways before any class is
// carried anywhere —
//   1. the deck-fit checker measures Θ(c) on the EMITTED co-vectors and every
//      carried edge class must close to 2π;
//   2. every door's in-model isometry must fit and WITNESS (§8.1 field 3);
//   3. the deck WALK must return the room to itself around every class.
// A domain that fails any of the three gets NO seal and NO model — the
// euclidean transport stands and says what it always said. The seal is a
// positive mark that was earned; its absence is a true absence.
//
// ⚠ AND WHICH MODEL IS NOT CHOSEN EITHER: the target 2π/k is compared with
// the cell's OWN euclidean dihedral arccos(−c). Bigger ⇒ the cell must
// inflate ⇒ S³; smaller ⇒ it must thin ⇒ H³; equal ⇒ E³, sealed POSITIVELY
// (the flat cube earns a class rather than being the case with no answer).
// The solve either has a root or THROWS — an unreachable dihedral is a
// refusal, never a clamp.
// ---------------------------------------------------------------------------

export const SEAL_CLOSURE_EPSILON_RAD = 1e-4; // the walk's own ε — a seam this big is visible

export interface SealedRealization {
  geometry: 'S3' | 'E3' | 'H3';
  inradius: number | null; // null on E³ — a flat cell has no solved size
  // the k every carried class shares on the REGULAR family; null on a lens
  // seal (L-1) — the lens's census is mixed BY CONSTRUCTION ({p·k=2, 1·k=p})
  // and a single number cannot say that truth (measured: no consumer reads
  // this field today; it is carried for the record)
  edgeClassSize: number | null;
  // the cell's own arccos(−c) on the regular family; null on a lens seal —
  // the constructive realization solves no regular dihedral
  euclideanDihedralRad: number | null;
  realization: CurvedRealization;
  deck: ModeledDeck;
  fit: DeckFitReport;
  closureWorstRad: number;
}

export type DomainSeal = { sealed: true; seal: SealedRealization } | { sealed: false; reason: string };

export function sealDomainRealization(domain: DomainModel): DomainSeal {
  const shape = domain.shape;
  const refuse = (reason: string): DomainSeal => ({ sealed: false, reason });
  // ONE cell: a multi-cell region's interior walls are spanned, not crossed,
  // and the regular-cell realizer has no meaning on a union.
  if (shape.cells.length !== 1) {
    return refuse(`the seal needs a one-cell seed; this region carries ${shape.cells.length} cells`);
  }
  if (!domain.tower.sound) return refuse('the S² gate is not sound — there is no deck group to realize');
  const boundaryRoots = new Set(domain.tower.gate.boundary ? domain.tower.gate.boundary.edgeClasses : []);
  const classes = domain.tower.gate.edgeLinks.filter((l) => !boundaryRoots.has(l.edgeClass));
  if (classes.length === 0) return refuse('the carried census has no interior edge class to fit');
  const sizes = [...new Set(classes.map((l) => l.memberEdgeIds.length))].sort((a, b) => a - b);
  // L-1 (STAMP L-1, Arman: "the lens should be there and walkable yes"): THE
  // LENS ARM — a SECOND realization source on the same proof pipeline. The
  // guard below is CORRECT and correctly scoped to its own realizer (one
  // regular solve genuinely cannot serve two k); the never-revisited part was
  // the DISPATCH — B-109 built realizeLensDomain and the seal never gained a
  // route to it. Detection is the seed's OWN constructive prerequisites
  // (readLensSeed), never a heuristic; the lens census is mixed BY
  // CONSTRUCTION ({p at k=2, 1 at k=p} — measured), so the arm branches
  // BEFORE the uniform-k refusal and the three proofs judge it exactly as
  // they judge the regular family.
  const lens = readLensSeed(shape);
  if (lens) {
    let realization: CurvedRealization;
    try {
      realization = realizeLensDomain(shape, lens.p);
    } catch (error) {
      return refuse((error as Error).message);
    }
    return proveAndSeal(domain, shape, 'S3', realization, null, null);
  }
  if (sizes.length !== 1) {
    return refuse(`the carried edge classes are k = ${sizes.join(', ')} — one regular realization cannot serve two different k, and averaging them would be a fabrication`);
  }
  const k = sizes[0];
  let c: number;
  try {
    c = measureRegularNormalDot(shape);
  } catch (error) {
    return refuse((error as Error).message);
  }
  const euclideanDihedralRad = Math.acos(Math.max(-1, Math.min(1, -c)));
  const target = (2 * Math.PI) / k;
  const geometry: 'S3' | 'E3' | 'H3' =
    Math.abs(target - euclideanDihedralRad) <= 1e-9 ? 'E3' : target > euclideanDihedralRad ? 'S3' : 'H3';
  let realization: CurvedRealization;
  try {
    realization =
      geometry === 'E3'
        ? euclideanControlRealization(shape)
        : realizeRegularDomain(shape, geometry, target);
  } catch (error) {
    return refuse((error as Error).message);
  }
  // ⛔ A DEGENERATE CELL IS NOT A REALIZATION, and the case is REACHABLE: a
  // uniform k = 2 census (two cells around every edge ⇒ a 180° dihedral)
  // solves to inradius π/2 on S³, where every face plane becomes the SAME
  // great sphere — the spatial part of each co-vector collapses and the
  // "cell" is a hemisphere with no corners. The three proofs below all pass
  // on it, because an angle sum and a closure walk are blind to a cell that
  // has stopped being a solid. Measured on the cube family: pattern 776.
  if (realization.inradius !== null) {
    const bound = geometry === 'S3' ? Math.PI / 2 : 5;
    if (realization.inradius >= bound - 1e-6) {
      return refuse(`the cell degenerates at this size: the solve reaches inradius ${realization.inradius.toFixed(6)} on ${geometry}, where the faces stop bounding a solid (k = ${k} puts ${k} cells around every edge — a fundamental domain needs at least 3)`);
    }
  }
  return proveAndSeal(domain, shape, geometry, realization, k, euclideanDihedralRad);
}

// THE ONE PROOF PIPELINE (L-1 extraction — two realization sources, one
// judge): proofs 1–3 verbatim from the seal's original body; both the
// regular arm and the lens arm are sealed by exactly this code, so a lens
// seal can never be weaker than a regular one.
function proveAndSeal(
  domain: DomainModel,
  shape: Shape,
  geometry: 'S3' | 'E3' | 'H3',
  realization: CurvedRealization,
  edgeClassSize: number | null,
  euclideanDihedralRad: number | null,
): DomainSeal {
  const refuse = (reason: string): DomainSeal => ({ sealed: false, reason });
  // PROOF 1 — every carried class closes to 2π on the EMITTED co-vectors.
  // ⚠ E³ measures on the DIRECTION-ONLY co-vectors: the angle Gram is n̂·n̂′
  // and the affine offset the isometry fit needs would corrupt it (the two
  // producers, named where they were built).
  let fit: DeckFitReport;
  try {
    fit = checkDeckFit(domain, geometry === 'E3' ? euclideanControlCovectors(shape) : realization.faceCovectors, geometry);
  } catch (error) {
    return refuse((error as Error).message);
  }
  if (!fit.pass) {
    return refuse(`the realization does not fit: an edge class misses 2π by ${((fit.maxDeviationRad * 180) / Math.PI).toFixed(4)}°`);
  }
  // PROOF 2 — every door fits and witnesses (§8.1 field 3, throws by name)
  let deck: ModeledDeck;
  try {
    deck = realizePairingIsometries(shape, domain.complex.pairings, realization);
  } catch (error) {
    return refuse((error as Error).message);
  }
  // PROOF 3 — the WALK returns the room to itself around every class
  let closureWorstRad: number;
  try {
    const closure = readDeckClosure(domain, deck, domain.complex.pairings);
    if (closure.length === 0) return refuse('the closure walk read no edge class — nothing was proven');
    closureWorstRad = closure.reduce((m, r) => Math.max(m, r.turnRad), 0);
  } catch (error) {
    return refuse((error as Error).message);
  }
  if (closureWorstRad > SEAL_CLOSURE_EPSILON_RAD) {
    return refuse(`the deck walk does not close: a class returns the room turned by ${((closureWorstRad * 180) / Math.PI).toFixed(4)}°`);
  }
  return {
    sealed: true,
    seal: {
      geometry,
      inradius: realization.inradius,
      edgeClassSize,
      euclideanDihedralRad,
      realization,
      deck,
      fit,
      closureWorstRad,
    },
  };
}
