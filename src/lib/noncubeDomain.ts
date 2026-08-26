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

export function realizeDodecahedralDomain(shape: Shape, target: 'seifert-weber' | 'poincare'): CurvedRealization {
  const geometry = target === 'seifert-weber' ? 'H3' : 'S3';
  const k = target === 'seifert-weber' ? 5 : 3; // cells per edge — the carried census must agree
  const targetDihedralRad = (2 * Math.PI) / k;
  // c measured from the shape's OWN adjacent normals — asserted onto 1/√5
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
  if (Math.abs(c - 1 / Math.sqrt(5)) > 1e-9) {
    throw new Error(`noncubeDomain: adjacent-normal dot ${c.toFixed(6)} is not the regular dodecahedron's 1/√5 — R1's seed is the prerequisite`);
  }
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
// §E THE DECK-FIT CHECKER (Trap 1: carried census, carried flankings).
// Θ(c) = Σ over the class's member edges of the dihedral between the TWO
// carried flanking faces, measured from the emitted co-vectors. The class
// list comes from `tower.gate.edgeLinks` (the carried census); the flanking
// map comes from the carried face cycles. No position is read here and no
// distance graph exists — an adjacency that re-selects with the realization
// is not expressible in this body.
// ---------------------------------------------------------------------------

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
