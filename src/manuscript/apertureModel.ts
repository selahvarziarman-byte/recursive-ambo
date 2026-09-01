// apertureModel — THE APERTURE (engineer-chartered 2026-07-13, designer-ruled
// ADR 0004 + Amendments; sealed 47dae985…73fd): the person BUILDS a 3-manifold
// and then stands inside it. React-free — the acceptance diagnostic requires
// THIS module through the anti-mock hook; ApertureView renders it verbatim.
//
// WHAT THIS MODULE IS:
//   · the MAP MENU — for a picked face pair, the face's own dihedral orbit
//     (a square: 4 rotations + 4 reflections) IS the menu; every candidate is
//     exactly a map the committed `assertWellFormed` accepts. ⛔ THE KNOB THAT
//     LIES: `mode` is NEVER offered — the engine's own words
//     (faceIdentification: "a genuinely orientation-reversing pairing requires
//     a REFLECTED map; a translation map yields the same manifold whatever the
//     label says"). Mode is DERIVED from the chosen map — the determinant of
//     its WITNESSED deck isometry — and RECORDED.
//   · the WITNESSED DECK FIT — the deck isometry of a pairing, fitted from the
//     4 vertex correspondences PLUS A FIFTH, OFF-PLANE constraint (a point
//     inside the cell carried across faceA to a point outside past faceB).
//     Four coplanar points are DEGENERATE: a det=+1 rotation and a det=−1
//     glide agree on the face, and an unwitnessed fit silently takes the
//     rotation (zero mirrored copies, ever). Both witness assertions THROW:
//     (1) the fit reproduces the engine's vertex map to 1e-6;
//     (2) the fit moves the cell off itself.
//   · the RECESSION LAW, un-gated — the geometry is DERIVED from the tower's
//     own edge links: n = tower.gate.edgeLinks[].memberEdgeIds.length,
//     θ = 2π/n against the cube's 90° dihedral → n=4 everywhere ⇒ E³
//     (n<4 ⇒ S³ deficit, n>4 ⇒ H³ excess). Only the E³ transport is built —
//     S³/H³ are the same loop with a different (ray, transport) and REFUSE
//     honestly for now.
//   · the ROOM — image-space ray tracing (Berger–Laier–Velho, Alg. 3): per
//     pixel, a ray from an eye INSIDE the fundamental domain Δ; if it hits a
//     scene object it shades; else it exits Δ through a face and is
//     TRANSPORTED by the ENGINE'S OWN gluing isometry (p ← g(p), v ← R·v) and
//     continues, up to `level` steps. Linear in depth. ⛔ NEVER OBJECT-SPACE:
//     the copies are NOT drawn — they are what the light does. The scene is
//     built ONCE; no copy of any object is ever materialized.
//   · the DEFAULT INHABITANTS — a bare room is a lie (T³'s three generators
//     are genuinely indistinguishable in an empty room): THE SCENE (designer
//     2026-08-08_1810, authored): the happy/sad JANUS PLAQUE (recurrence — a
//     face looks back down every corridor, never a blank back; the two
//     aspects differ by ONE ARC) and the RIGHT-HANDED COIL beside it
//     (chirality, legible at a glance — NO arrows, NO field lines: the
//     helix, never the diagram). The person's own forms are what they ADD.
//   · COUNTABLE CAPTIONS — copies, not pixels; objects, not area. The trace
//     counts VISIBLE COPIES (distinct accumulated deck words owning at least
//     `minCopyPixels` pixels) per inhabitant, and how many come back mirrored.
//     Say ORBIT, never π₁ — a picture shows the orbit, not a group law.
//
// DERIVE-ONLY · ADDITIVE: committed modules by import (`readSeedCell`,
// `buildFormDomain`, the tower via DomainModel). worldModel / specimenModel /
// InkedDomain are BYTE-UNCHANGED — the register inversion is view-layer.

import type { Face, Shape, Vec3 } from '../types/geometry';
import {
  flipGlueFaces,
  glueFaces,
  readSeedCell,
  readSeedCells,
  type FacePairing,
  type Level3SeedCell,
} from '../lib/faceIdentification';
import { readLevel3Tower, type Level3TowerReading } from '../lib/level3Invariants';
// step 8 (THE INSIDE-VIEW HATCH): the SEALED metric — read-only, derive-only
import { readPillarDihedrals } from '../lib/conformalAtom';
import { bisectEdges, liftPairingsToBisected } from '../lib/level3Subdivision';
import type { Level3SoundnessReport } from '../lib/level3SoundnessGate';
// B-113 THE RENDER: the model the transport already carries, reaching the
// consumer. Derive-only — every symbol here is a reader or a constructor,
// and nothing in this file writes into a Shape.
import {
  chartDistance,
  chartOf,
  chartPlaneOf,
  mat4Det,
  mat4Mul,
  matrixInverse4,
  pushChartRay,
  sealDomainRealization,
  type Chart3,
  type Mat4,
  type SealedRealization,
} from '../lib/noncubeDomain';
import { buildFormDomain, sharedWallPairings } from './formDomainModel';
import type { DomainModel } from './worldModel';

// ---------------------------------------------------------------------------
// small vector kit (module-local; the tracer is hot, keep it lean)
// ---------------------------------------------------------------------------

type V3 = Vec3;
/** 12-number affine isometry: row-major 3×3 linear part (0..8) + translation (9..11). */
export type DeckTransform = number[];

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mulS = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (v: V3): V3 => {
  const L = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / L, v[1] / L, v[2] / L];
};

const det3 = (m: number[][]): number =>
  m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
  m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
  m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

const invT = (m: number[][]): number[][] => {
  const D = det3(m);
  const c = [
    [m[1][1] * m[2][2] - m[1][2] * m[2][1], -(m[1][0] * m[2][2] - m[1][2] * m[2][0]), m[1][0] * m[2][1] - m[1][1] * m[2][0]],
    [-(m[0][1] * m[2][2] - m[0][2] * m[2][1]), m[0][0] * m[2][2] - m[0][2] * m[2][0], -(m[0][0] * m[2][1] - m[0][1] * m[2][0])],
    [m[0][1] * m[1][2] - m[0][2] * m[1][1], -(m[0][0] * m[1][2] - m[0][2] * m[1][0]), m[0][0] * m[1][1] - m[0][1] * m[1][0]],
  ];
  return c.map((r) => r.map((x) => x / D));
};

export const applyPoint = (g: DeckTransform, p: V3): V3 => [
  g[0] * p[0] + g[1] * p[1] + g[2] * p[2] + g[9],
  g[3] * p[0] + g[4] * p[1] + g[5] * p[2] + g[10],
  g[6] * p[0] + g[7] * p[1] + g[8] * p[2] + g[11],
];
export const applyVector = (g: DeckTransform, v: V3): V3 => [
  g[0] * v[0] + g[1] * v[1] + g[2] * v[2],
  g[3] * v[0] + g[4] * v[1] + g[5] * v[2],
  g[6] * v[0] + g[7] * v[1] + g[8] * v[2],
];
export const deckDet = (g: DeckTransform): number =>
  det3([
    [g[0], g[1], g[2]],
    [g[3], g[4], g[5]],
    [g[6], g[7], g[8]],
  ]);
export const deckInverse = (g: DeckTransform): DeckTransform => {
  // orthogonal linear part: inverse = transpose
  const R = [g[0], g[3], g[6], g[1], g[4], g[7], g[2], g[5], g[8]];
  const t: V3 = [g[9], g[10], g[11]];
  return [
    ...R,
    -(R[0] * t[0] + R[1] * t[1] + R[2] * t[2]),
    -(R[3] * t[0] + R[4] * t[1] + R[5] * t[2]),
    -(R[6] * t[0] + R[7] * t[1] + R[8] * t[2]),
  ];
};
export const deckCompose = (a: DeckTransform, b: DeckTransform): DeckTransform => {
  const R: number[] = [];
  for (let i = 0; i < 3; i += 1)
    for (let j = 0; j < 3; j += 1)
      R.push(a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j]);
  return [...R, ...applyPoint(a, [b[9], b[10], b[11]])];
};

// ---------------------------------------------------------------------------
// seed geometry readers
// ---------------------------------------------------------------------------

interface SeedGeometry {
  seed: Level3SeedCell;
  positionOf: (id: string) => V3;
  cellCentroid: V3;
  bboxLo: V3;
  bboxHi: V3;
  faceById: Map<string, { id: string; cycle: string[] }>;
  faceCentroid: (faceId: string) => V3;
  // D2: the frame that orients a face's INSIDE — the face's OWNING cell's
  // vertex centroid + bounds + its OWN face cycles on a multi-cell volume
  // (resolved by the id's `c{i}:` prefix), the one cell's committed
  // centroid/bbox/faces on a single-cell volume (byte-identical there). The
  // deck fit's fifth constraint reads sidedness through the centroid; its
  // off-itself witness reads the CELL's planes (B-101 §2b(i): the bbox
  // over-covers any cell that under-fills its box — the lifted octahedron's
  // every true deck neighbour landed in the slack and was refused).
  insideFrameOf: (faceId: string) => { centroid: V3; lo: V3; hi: V3; faces: { cycle: string[] }[] };
}

export function readSeedGeometry(seedShape: Shape): SeedGeometry {
  // THE MULTI-CELL CUT (2026-08-13): a multi-cell solid reads as the UNION
  // region — its vertices/faces are the shape's own, and every PREFIXED id
  // (cN:…, the paired-face representation's charts) resolves by stripping
  // the prefix: the charts of an embedded product COINCIDE in space, so the
  // shared-wall deck fits come out identity, which is geometrically true.
  // The single-cell path is byte-behavior-identical (no prefixes to strip).
  const strip = (id: string): string => id.replace(/^c\d+:/, '');
  const seed =
    seedShape.cells.length === 1
      ? readSeedCell(seedShape)
      : {
          cellId: seedShape.cells.map((c) => c.id).join('+'),
          vertexIds: Object.keys(seedShape.vertices),
          edges: seedShape.edges.map((e) => ({ id: e.id, a: e.vertexIds[0], b: e.vertexIds[1] })),
          faces: seedShape.faces.map((f) => ({ id: f.id, cycle: f.vertexIds })),
        };
  const positions = new Map(Object.values(seedShape.vertices).map((v) => [v.id, v.position as V3]));
  const positionOf = (id: string): V3 => {
    const p = positions.get(id) ?? positions.get(strip(id));
    if (!p) throw new Error(`apertureModel: seed vertex ${id} has no position`);
    return p;
  };
  const all = seed.vertexIds.map(positionOf);
  const cellCentroid = mulS(
    all.reduce((acc, p) => add(acc, p), [0, 0, 0] as V3),
    1 / all.length,
  );
  const bboxLo: V3 = [Infinity, Infinity, Infinity];
  const bboxHi: V3 = [-Infinity, -Infinity, -Infinity];
  for (const p of all)
    for (let k = 0; k < 3; k += 1) {
      bboxLo[k] = Math.min(bboxLo[k], p[k]);
      bboxHi[k] = Math.max(bboxHi[k], p[k]);
    }
  const faceById = new Map(seed.faces.map((f) => [f.id, f]));
  const faceCentroid = (faceId: string): V3 => {
    const f = faceById.get(faceId) ?? faceById.get(strip(faceId));
    if (!f) throw new Error(`apertureModel: unknown face ${faceId}`);
    return mulS(
      f.cycle.reduce((acc, id) => add(acc, positionOf(id)), [0, 0, 0] as V3),
      1 / f.cycle.length,
    );
  };
  const insideFrameOf = (faceId: string): { centroid: V3; lo: V3; hi: V3; faces: { cycle: string[] }[] } => {
    const m = /^c(\d+):/.exec(faceId);
    if (!m || seedShape.cells.length <= 1)
      return { centroid: cellCentroid, lo: bboxLo, hi: bboxHi, faces: seed.faces.map((f) => ({ cycle: f.cycle })) };
    const cell = seedShape.cells[Number(m[1])];
    if (!cell) throw new Error(`apertureModel: face ${faceId} names cell ${m[1]}, which does not exist`);
    const pts = cell.vertexIds.map(positionOf);
    const lo: V3 = [Infinity, Infinity, Infinity];
    const hi: V3 = [-Infinity, -Infinity, -Infinity];
    for (const p of pts)
      for (let k = 0; k < 3; k += 1) {
        lo[k] = Math.min(lo[k], p[k]);
        hi[k] = Math.max(hi[k], p[k]);
      }
    // the owning cell's OWN face cycles, raw ids (positionOf strips prefixes)
    const owned = new Set(cell.faceIds);
    return {
      centroid: mulS(
        pts.reduce((acc, p) => add(acc, p), [0, 0, 0] as V3),
        1 / pts.length,
      ),
      lo,
      hi,
      faces: seedShape.faces.filter((f) => owned.has(f.id)).map((f) => ({ cycle: f.vertexIds })),
    };
  };
  return { seed, positionOf, cellCentroid, bboxLo, bboxHi, faceById, faceCentroid, insideFrameOf };
}

// ---------------------------------------------------------------------------
// THE WITNESSED DECK FIT (mandate §3 — the derivation trap, not inherited)
// ---------------------------------------------------------------------------

// Kabsch-style rigid fit via iterated polar decomposition (the in-tree
// reference implementation's shape, verified on the engine's own pairings).
function fitRigid(pairs: [V3, V3][]): DeckTransform {
  const n = pairs.length;
  const cA: V3 = [0, 0, 0];
  const cB: V3 = [0, 0, 0];
  for (const [a, b] of pairs)
    for (let i = 0; i < 3; i += 1) {
      cA[i] += a[i] / n;
      cB[i] += b[i] / n;
    }
  const H = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (const [a, b] of pairs)
    for (let i = 0; i < 3; i += 1)
      for (let j = 0; j < 3; j += 1) H[i][j] += (a[i] - cA[i]) * (b[j] - cB[j]);
  let R = [
    [H[0][0], H[1][0], H[2][0]],
    [H[0][1], H[1][1], H[2][1]],
    [H[0][2], H[1][2], H[2][2]],
  ];
  if (Math.abs(det3(R)) < 1e-9)
    R = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  for (let k = 0; k < 80; k += 1) {
    const iv = invT(R);
    for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) R[i][j] = 0.5 * (R[i][j] + iv[i][j]);
  }
  const t: V3 = [0, 0, 0];
  for (let i = 0; i < 3; i += 1) t[i] = cB[i] - (R[i][0] * cA[0] + R[i][1] * cA[1] + R[i][2] * cA[2]);
  return [R[0][0], R[0][1], R[0][2], R[1][0], R[1][1], R[1][2], R[2][0], R[2][1], R[2][2], t[0], t[1], t[2]];
}

/**
 * Fit the deck isometry of one face pairing — the 4 vertex correspondences
 * PLUS the fifth, OFF-PLANE constraint (a point half-way INSIDE the cell
 * behind faceA maps to the point half-way OUTSIDE past faceB). Both witness
 * assertions THROW — a fit that merely looks right is not a fit.
 */
export function fitDeckIsometry(geometry: SeedGeometry, pairing: FacePairing): { g: DeckTransform; det: number } {
  const { positionOf, faceById, faceCentroid, insideFrameOf } = geometry;
  const fcA = faceCentroid(pairing.faceA);
  const fcB = faceCentroid(pairing.faceB);
  const correspondences: [V3, V3][] = Object.entries(pairing.map).map(([a, b]) => [positionOf(a), positionOf(b)]);
  // THE FIFTH, OFF-PLANE CONSTRAINT — inside the cell → outside past the
  // partner. D2 (face-local): the committed construction took the half-way
  // point toward/away from ONE global cell centroid — exact only where that
  // centroid sits midway between the paired faces (every cube pair, which is
  // why it never fired). The general volume computes the SAME sidedness
  // face-locally: h along faceA's INWARD normal behind A maps to h along
  // faceB's OUTWARD normal past B — exact under the true isometry for ANY h
  // (both sides share it), and on the seed cube these are the committed
  // points to the byte (centroid distance 1, h = 0.5).
  const stripId = (id: string): string => id.replace(/^c\d+:/, '');
  const inwardNormal = (faceId: string, fc: V3): V3 => {
    const f = faceById.get(faceId) ?? faceById.get(stripId(faceId));
    if (!f) throw new Error(`apertureModel: unknown face ${faceId}`);
    let n: V3 = [0, 0, 0];
    for (let k = 0; k < f.cycle.length; k += 1) {
      const p = positionOf(f.cycle[k]);
      const q = positionOf(f.cycle[(k + 1) % f.cycle.length]);
      n = add(n, [(p[1] - q[1]) * (p[2] + q[2]), (p[2] - q[2]) * (p[0] + q[0]), (p[0] - q[0]) * (p[1] + q[1])]);
    }
    const len = Math.hypot(n[0], n[1], n[2]);
    if (len < 1e-12) throw new Error(`apertureModel: face ${faceId} is degenerate — no normal exists for the deck fit`);
    n = mulS(n, 1 / len);
    const cOwn = insideFrameOf(faceId).centroid;
    const toInside = sub(cOwn, fc);
    return n[0] * toInside[0] + n[1] * toInside[1] + n[2] * toInside[2] >= 0 ? n : mulS(n, -1);
  };
  const H5 = 0.5;
  correspondences.push([
    add(fcA, mulS(inwardNormal(pairing.faceA, fcA), H5)),
    add(fcB, mulS(inwardNormal(pairing.faceB, fcB), -H5)),
  ]);
  const g = fitRigid(correspondences);
  // WITNESS (1): the fit reproduces the ENGINE'S vertex map to 1e-6.
  for (const [a, b] of Object.entries(pairing.map)) {
    const err = Math.hypot(...sub(applyPoint(g, positionOf(a)), positionOf(b)));
    if (err > 1e-6) {
      throw new Error(
        `apertureModel: the fitted deck isometry does not reproduce the engine's vertex map on ${pairing.faceA}→${pairing.faceB} (error ${err.toExponential(2)})`,
      );
    }
  }
  // WITNESS (2): the fit MOVES THE CELL OFF ITSELF — a deck transformation of
  // a fundamental domain never fixes it (the 4-coplanar rotation does: it
  // pins the centroid and the fit silently passes as the wrong isometry).
  // D2: the cell is faceA's OWNING cell (its frame). B-101 §2b(i), MEASURED:
  // the old bbox test was exact only where cell == bbox (every cube); a cell
  // that under-fills its box (the lifted octahedron — bbox [-1,1]³, every
  // true deck neighbour's centroid at (±2/3,±2/3,±2/3)) put ALL its real
  // isometries in the slack and the guard refused the entire menu. Inside is
  // now the CELL itself: strictly on the centroid's side of every face plane.
  const frameA = insideFrameOf(pairing.faceA);
  const movedCentroid = applyPoint(g, frameA.centroid);
  const inside = frameA.faces.every((face) => {
    let n: V3 = [0, 0, 0];
    for (let k = 0; k < face.cycle.length; k += 1) {
      const p = positionOf(face.cycle[k]);
      const q = positionOf(face.cycle[(k + 1) % face.cycle.length]);
      n = add(n, [(p[1] - q[1]) * (p[2] + q[2]), (p[2] - q[2]) * (p[0] + q[0]), (p[0] - q[0]) * (p[1] + q[1])]);
    }
    const len = Math.hypot(n[0], n[1], n[2]);
    if (len < 1e-12) return true; // a degenerate face constrains nothing
    n = mulS(n, 1 / len);
    const fc = mulS(
      face.cycle.reduce((acc, id) => add(acc, positionOf(id)), [0, 0, 0] as V3),
      1 / face.cycle.length,
    );
    const sideOfCentroid = dot(n, sub(frameA.centroid, fc));
    if (Math.abs(sideOfCentroid) < 1e-12) return true; // a plane through the centroid constrains nothing
    const sideOfMoved = dot(n, sub(movedCentroid, fc));
    return sideOfMoved * Math.sign(sideOfCentroid) > 1e-9;
  });
  if (inside) {
    throw new Error(
      `apertureModel: the fitted isometry for ${pairing.faceA}→${pairing.faceB} does not move the cell off itself — the 4-coplanar degeneracy (a rotation agreeing on the face), refused`,
    );
  }
  return { g, det: deckDet(g) };
}

export interface DeckEntry {
  g: DeckTransform;
  gi: DeckTransform;
  det: number;
  nA: V3;
  dA: number;
  nB: V3;
  dB: number;
}

/** The full deck of a pairing pattern: witnessed isometries + the exit planes. */
export function deckOf(seedShape: Shape, pairings: FacePairing[]): DeckEntry[] {
  const geometry = readSeedGeometry(seedShape);
  return pairings.map((pairing) => {
    const { g, det } = fitDeckIsometry(geometry, pairing);
    const fcA = geometry.faceCentroid(pairing.faceA);
    const fcB = geometry.faceCentroid(pairing.faceB);
    const nA = norm(sub(fcA, geometry.cellCentroid));
    const nB = norm(sub(fcB, geometry.cellCentroid));
    return { g, gi: deckInverse(g), det, nA, dA: dot(fcA, nA), nB, dB: dot(fcB, nB) };
  });
}

// THE MULTI-CELL CUT: the pairings that are DOORS. An interior shared wall
// of a multi-cell solid (two cells own the face) is spanned by the room's
// own region — no transport happens there, and the witnessed deck fit
// RIGHTLY refuses it (the off-cell law is for doors). The deck is fit over
// the SURFACE pairings only; a room whose pairings are all interior is a
// legitimately DECKLESS bounded chamber.
export function surfacePairingsOf(seedShape: Shape, pairings: FacePairing[]): FacePairing[] {
  if (seedShape.cells.length <= 1) return pairings;
  const ownersCount = new Map<string, number>();
  for (const cell of seedShape.cells)
    for (const faceId of cell.faceIds) ownersCount.set(faceId, (ownersCount.get(faceId) ?? 0) + 1);
  const strip = (id: string): string => id.replace(/^c\d+:/, '');
  return pairings.filter(
    (p) => (ownersCount.get(strip(p.faceA)) ?? 1) !== 2 && (ownersCount.get(strip(p.faceB)) ?? 1) !== 2,
  );
}

// ---------------------------------------------------------------------------
// THE MAP MENU (mandate §2 — the knob that lies never reaches the person)
// ---------------------------------------------------------------------------

export interface ApertureMapCandidate {
  key: string; // stable pick key ('d+0'..'d+3' rotations, 'd-0'..'d-3' reflections)
  map: Record<string, string>;
  correspondence: [string, string][]; // faceA cycle vertex → its faceB image (display order = A's cycle)
  derivedMode: 'preserving' | 'reversing'; // DERIVED from the witnessed fit determinant — never chosen
  det: number;
  // R4(f): the R-test on the WITNESSED deck fit — ‖R − I‖∞ < 0.5 on g[0..8].
  // True exactly on the translation (flat) glue; every other candidate rotates
  // or reflects the face before gluing. Never a key test (the flat key differs
  // by pair — d-1/d-1/d-0 on the cube's axes, measured). Doubles as the
  // winding-label hook in describeCandidate.
  translationLike: boolean;
}

const shortId = (id: string): string => {
  const parts = id.split(':');
  return parts[parts.length - 1];
};

// R4(f): the row-major identity — the R-test's reference (‖R − I‖∞).
const IDENTITY3 = [1, 0, 0, 0, 1, 0, 0, 0, 1] as const;

export function describeCandidate(
  candidate: ApertureMapCandidate,
  // B-102 §2b (F.4 — an id never stands where a NAME is owed; ruled by Arman
  // in-terminal: names EVERYWHERE, the cube's tail-strings included): the
  // corner-name reach — the SAME producer the face picker composes through
  // (cornerDisplayName, threaded by the caller). A corner the reach cannot
  // name (TRUE absence, or a caller without the page's reach) displays the
  // honest address tail — the pre-existing honest-id arm, never minted
  // letters.
  cornerName?: (vertexId: string) => string | null,
): string {
  const display = (id: string): string => cornerName?.(id) ?? shortId(id);
  const corr = candidate.correspondence.map(([a, b]) => `${display(a)}→${display(b)}`).join(' · ');
  const base = `${corr} — ${candidate.derivedMode} (derived)`;
  // R4(f) THE WINDING LABEL — the arc's ONE new person-facing string: every
  // non-translation candidate rotates/reflects the face before gluing, so it
  // genuinely winds; the flag IS the label hook (no separate geometry).
  return candidate.translationLike ? base : `${base} · cone room · edges wind`;
}

/**
 * The face's own dihedral orbit IS the menu: for square faces, 8 candidates —
 * 4 rotations and 4 reflections of the cycle correspondence. Every candidate
 * passes the committed `assertWellFormed` (step ±1 around the cycle); the
 * engine already refuses anything else. `derivedMode` comes from the WITNESSED
 * deck fit of that very map — rotations land det=+1 (preserving), reflections
 * det=−1 (reversing) — measured, never labelled by hand.
 */
export function dihedralMapCandidates(
  seedShape: Shape,
  faceAId: string,
  faceBId: string,
  // B-101 §2b (the D13-catch rider): a skipped candidate is a DECISION with a
  // REASON — the optional collector receives each one (the fit's own thrown
  // sentence, verbatim), so an empty menu is never silently unexplained.
  // Additive; every existing caller stands unchanged.
  onRefusal?: (refusal: { key: string; reason: string }) => void,
): ApertureMapCandidate[] {
  const geometry = readSeedGeometry(seedShape);
  // D2 — the id-space seam (the one place the two worlds differ): a
  // multi-cell volume's menu speaks PREFIXED ids (`c{i}:faceId` — the space
  // its build path consumes: readSeedCells + glueFaces), while the
  // geometry's face records are the shape's own raw ids. Strip for the
  // lookup; PREFIX the emitted correspondence per side so the pairing's map
  // lands in the complex's prefixed corner space. A single-cell volume has
  // no prefix and every string below is byte-identical to the committed door.
  const prefixOf = (id: string): string => {
    const m = /^(c\d+:)/.exec(id);
    return m ? m[1] : '';
  };
  const prefA = prefixOf(faceAId);
  const prefB = prefixOf(faceBId);
  const fA = geometry.faceById.get(faceAId) ?? (prefA ? geometry.faceById.get(faceAId.slice(prefA.length)) : undefined);
  const fB = geometry.faceById.get(faceBId) ?? (prefB ? geometry.faceById.get(faceBId.slice(prefB.length)) : undefined);
  if (!fA || !fB) throw new Error(`apertureModel: unknown face in pair ${faceAId} ~ ${faceBId}`);
  // D13 (engineer 2021, URGENT): a NON-CONGRUENT pick is a LEGITIMATE person
  // action, not a programming error — it killed the whole app when this was
  // a throw reached from the render path. The menu simply offers NO
  // candidates; `aperturePairingRefusal` names the reason to the person.
  // ⛔ the unknown-face throw above STAYS a throw: that one IS a programming
  // error (a menu id the geometry does not hold).
  if (fA.cycle.length !== fB.cycle.length) {
    return [];
  }
  const n = fA.cycle.length;
  const candidates: ApertureMapCandidate[] = [];
  for (const dir of [1, -1] as const) {
    for (let offset = 0; offset < n; offset += 1) {
      const map: Record<string, string> = {};
      const correspondence: [string, string][] = [];
      for (let i = 0; i < n; i += 1) {
        const a = `${prefA}${fA.cycle[i]}`;
        const b = `${prefB}${fB.cycle[(((offset + dir * i) % n) + n) % n]}`;
        map[a] = b;
        correspondence.push([a, b]);
      }
      // D2: on a non-symmetric face (e.g. the terrain's 45·45·90 splits) some
      // cycle correspondences are NOT realizable by any isometry — the
      // committed fit refuses them (its 1e-6 verify). The menu offers exactly
      // the realizable ones: an unrealizable correspondence is SKIPPED, never
      // shown (offering it would be the lying knob). The cube's regular
      // squares realize all eight — its menu is byte-identical.
      let fitted: { g: number[]; det: number };
      try {
        fitted = fitDeckIsometry(geometry, { faceA: faceAId, faceB: faceBId, mode: 'preserving', map });
      } catch (error) {
        // B-101 §2b rider: the skip stays a skip, but the reason is CARRIED —
        // never eaten (the silent-chip class; the lifted octahedron's whole
        // menu vanished through this catch with no word anywhere).
        onRefusal?.({
          key: `d${dir > 0 ? '+' : '-'}${offset}`,
          reason: error instanceof Error ? error.message : String(error),
        });
        continue;
      }
      const { g, det } = fitted;
      // R4(f): the flat (translation) candidate — the witnessed rotation part
      // is the identity up to the fit's own noise: ‖R − I‖∞ < 0.5.
      const translationLike = IDENTITY3.every((v, i) => Math.abs(g[i] - v) < 0.5);
      candidates.push({
        key: `d${dir > 0 ? '+' : '-'}${offset}`,
        map,
        correspondence,
        derivedMode: det > 0 ? 'preserving' : 'reversing',
        det,
        translationLike,
      });
    }
  }
  // R4(f): the FLAT room leads the menu — the translation candidate takes slot
  // 0 (order-preserving otherwise; every consumer picks by KEY, the menu alone
  // reads the array order).
  return [...candidates.filter((c) => c.translationLike), ...candidates.filter((c) => !c.translationLike)];
}

// B-104 R2 (the designer's wording, RULED, verbatim — fork (ii)'s sentence):
// sited AT the empty menu (her placement clause: a sentence explaining an
// emptiness must be adjacent to it), in the corner-count refusal's register.
// One producer; the row renders it, never re-types it.
export const NO_MAP_FITS_SENTENCE =
  'these two faces have the same corners, but no map fits — every candidate was tried and refused. pick a different partner, or leave the pair open.';

// ---------------------------------------------------------------------------
// THE DOOR — the person's pairing rows → a certified DomainModel
// ---------------------------------------------------------------------------

export interface AperturePairRow {
  faceA: string | null;
  faceB: string | null;
  candidateKey: string | null; // the picked MAP (never a mode)
}

// D2 — THE ONE DOOR (2026-08-15, sovereign-ruled: "building manifold-3
// becomes real on the user's choice over the shapes, not a given set of
// shapes"): the aperture is a VIEW ONTO A VOLUME THE PERSON POINTS AT. The
// cube panel is the DEGENERATE CASE of the one rule — the person pairs the
// faces exactly one cell owns; on a single-cell solid that is ALL its faces.
// `boundaryFacesOf` is that rule, emitted in the id space the volume's own
// build path consumes: RAW ids for a single-cell volume (readSeedCell +
// glueFaces(seed, …)), PREFIXED `c{i}:…` ids for a multi-cell volume
// (readSeedCells + sharedWallPairings). That seam is the only place the two
// differ.
export interface BoundaryFaceEntry {
  id: string; // the id the build path consumes (raw or c{i}:-prefixed) — THE RECORD (F.2: survives in data/value/DOM)
  label: string; // the person-facing name: a per-volume letter + the countable corner fact — NEVER the id's hash tail (F.4)
}

// D14 (engineer 2021, amended 2026-08-18 — GOVERNED BY ADR 0024 §3.1, the
// FAITHFULNESS CLAUSE): a face's person-facing name is its CORNER LABELS,
// read from the PACKET (`vertex.data.label` — the real name the substrate
// holds; ambo names a midpoint of A and B "AB"), in CYCLE order, rotated to
// start at the earliest label, joined by `·`, UPPERCASE at display. Two
// clauses make it a rule, not a guess: ROTATION-TO-EARLIEST (else one face
// has several names) and ⛔ DIRECTION IS NOT NORMALIZED (A·D·C·B ≠ A·B·C·D —
// the cycle's sense is real information the map's `dir` acts on): rotate
// only, never reverse to make it sort. Where the packet does NOT carry a
// label — empty, or the id copied into the label (the committed identity
// law's own discriminator, argumentReadingModel:303-311) — the name is
// `unnamed`, the ADR's word: never a synthesized letter, never a positional
// index (the D11 `menuLetter` was exactly that fabrication — a list
// position with no place on the shape — and is DELETED), never the cycle
// scheme run over ids, never a warmer word. ★ A THICKENED room's faces read
// `unnamed` and that is CORRECT (thicken:175 fabricates id-as-label
// packets; the packet-carriage cure is a separate chartered cut under the
// semantic layer's non-foreclosure rider). ⛔ the rendered form (`·` join,
// case) is the designer's — flagged.
// D12-b part 4 (engineer 1740): a corner whose packet label is ABSENT
// resolves through `createdBy.sourceVertexIds` to the SOURCE's positively-
// present label — presence-first, lineage-on-absence (the ratified ruling;
// never lineage-always: an ambo midpoint carries sources AND a real label,
// and the label wins). The resolver reaches OUTSIDE the shape (a ×I copy's
// source lives in the base form, on the page) — the door hands one in; a
// caller without one keeps the honest `unnamed`. Only a SINGLE source is
// resolved: composing several source labels into a new name would be the
// reader minting a reading (ambo composes at the MINT; a reader never may).
export type AbsentLabelResolver = (sourceVertexIds: string[], vertexId: string) => string | null;

// the per-corner LEVEL MARK (designer-ratified SUBSCRIPT form): the ×I
// mint's own structural record is the copy id's `@k` tail — the mark reads
// THAT (raw level, no word for it; the semantic layer is deferred). `·`
// stays reserved for the corner join; both ends always carry their mark.
const SUBSCRIPT_DIGITS = '₀₁₂₃₄₅₆₇₈₉';
function levelMarkOf(vertexId: string): string {
  const m = /@(\d+)$/.exec(vertexId);
  if (!m) return '';
  return m[1]
    .split('')
    .map((d) => SUBSCRIPT_DIGITS[Number(d)])
    .join('');
}

// D16 (B-2026-08-23-C §4): the door's per-corner LINEAGE ARM, extracted so
// the argument card can take the resolver ENTIRE — the page-population
// REACH (the caller's AbsentLabelResolver) AND the LEVEL MARK (the ×I copy
// id's own `@k` tail). ONE resolver, two readers — the menu's
// faceDisplayName and the card's labels cannot disagree by construction.
// Null when the absence does not resolve (no resolver handed in, not
// exactly one source, or no agreed positive label) — each caller keeps its
// own honest fallback ('unnamed' at the menu; the root composition at the
// card).
export function lineageCornerDisplay(
  sourceVertexIds: readonly string[],
  vertexId: string,
  resolveAbsent?: AbsentLabelResolver,
): string | null {
  const resolved =
    resolveAbsent && sourceVertexIds.length === 1
      ? resolveAbsent([...sourceVertexIds], vertexId)
      : null;
  if (resolved === null || resolved.trim().length === 0) return null;
  return `${resolved.trim().toUpperCase()}${levelMarkOf(vertexId)}`;
}

// B-102 §2b — THE ONE CORNER NAME (D16's shape, extracted from the face
// picker's loop): the positively-present label (uppercased), else the
// lineage reach (level-marked), else null — TRUE ABSENCE, the caller's own
// honest register. SHARED by the composed face name and the map menu's
// correspondence labels — one producer, two readers that cannot disagree.
// Total over both id spaces: a multi-cell `c{i}:` prefixed id resolves to
// the shape's raw vertex (the established strip idiom).
export function cornerDisplayName(shape: Shape, vertexId: string, resolveAbsent?: AbsentLabelResolver): string | null {
  const vertex = shape.vertices[vertexId] ?? shape.vertices[vertexId.replace(/^c\d+:/, '')];
  const data = vertex?.data;
  const trimmed = typeof data?.label === 'string' ? data.label.trim() : '';
  // THE TERMINAL CUT (B-2026-08-23-A): the id-as-label scaffold clause is
  // DEAD — every producer it stood for has stopped (the nine reachable
  // mints + the patchLift latent rider + multiform's absent-fallback, the
  // ruled census, measured at the tree: eleven sites mint TRUE ABSENCE;
  // what remains is exempt/given/out-of-scope/D-index — none caught by
  // the retired clause). A label is a NAME by positive presence; absence
  // resolves through lineage below. Its twin in argumentReadingModel's
  // ownNameOf died in the SAME commit — the card and the menu agree.
  // (Pre-migration FILES may carry id-copy labels verbatim — the record
  // is the record; the view-side resolver still refuses to LAUNDER an
  // id-copy source label through lineage resolution.)
  if (trimmed.length === 0) {
    const sources = vertex?.createdBy?.sourceVertexIds ?? [];
    return lineageCornerDisplay(sources, vertexId, resolveAbsent);
  }
  return trimmed.toUpperCase();
}

export function faceDisplayName(shape: Shape, face: Face, resolveAbsent?: AbsentLabelResolver): string {
  const labels: string[] = [];
  for (const vertexId of face.vertexIds) {
    const display = cornerDisplayName(shape, vertexId, resolveAbsent);
    if (display === null) return 'unnamed';
    labels.push(display);
  }
  if (labels.length === 0) return 'unnamed';
  const best = d14NameRotation(labels);
  return labels.map((_, i) => labels[(best + i) % labels.length]).join('·');
}

// D14's rotation, extracted (F.0e): rotate to the earliest label; a TIE
// (duplicate labels on one cycle) is broken by the lexicographically least
// full rotation, so the name is total and stable — still a rotation, never a
// reversal. SHARED by the printed name (faceDisplayName) and the drawn trace
// (faceTraceCycle) so the two cannot disagree — one rotation, two readers.
export function d14NameRotation(labels: string[]): number {
  let best = 0;
  for (let k = 1; k < labels.length; k += 1) {
    for (let i = 0; i < labels.length; i += 1) {
      const a = labels[(best + i) % labels.length];
      const b = labels[(k + i) % labels.length];
      if (b < a) {
        best = k;
        break;
      }
      if (a < b) break;
    }
  }
  return best;
}

// F.0e — THE TRACE IS THE NAME (mothership §2, designer-ruled): a face's
// pair-mark is its own edge cycle TRACED in D14 order — start at the
// alphabetically-first corner, run in the face's own cycle direction — so
// drawing the trace IS drawing the name `A·D·C·B`: one rotation
// (d14NameRotation, the printed name's own call), two readers. A face whose
// labels do not resolve (absent or the id-as-label scaffold) keeps its stored
// cycle order — its printed name is 'unnamed' there, so no name exists for
// the trace to disagree with. Menu-space ids in, menu-space corners out
// (`c{i}:` preserved — the correspondence's space); positions resolve through
// the seed's own vertices with the prefix stripped, the same lookup the
// marks' centroids use.
export interface ApertureFaceTrace {
  faceId: string;
  corners: string[]; // vertex ids, menu space, D14 trace order
  positions: V3[]; // same order, the seed's real positions
}

export function faceTraceCycle(seedShape: Shape, menuFaceId: string): ApertureFaceTrace | null {
  const geometry = readSeedGeometry(seedShape);
  const m = /^(c\d+:)/.exec(menuFaceId);
  const pref = m ? m[1] : '';
  const raw = pref ? menuFaceId.slice(pref.length) : menuFaceId;
  const face = geometry.faceById.get(menuFaceId) ?? geometry.faceById.get(raw);
  if (!face) return null;
  const positions: V3[] = [];
  const labels: string[] = [];
  let labelsSound = true;
  for (const vid of face.cycle) {
    const stripped = vid.replace(/^c\d+:/, '');
    const vertex = seedShape.vertices[stripped];
    if (!vertex) return null;
    positions.push([vertex.position[0], vertex.position[1], vertex.position[2]]);
    const trimmed = typeof vertex.data?.label === 'string' ? vertex.data.label.trim() : '';
    if (trimmed.length === 0 || trimmed === stripped) labelsSound = false;
    else labels.push(trimmed.toUpperCase());
  }
  const n = face.cycle.length;
  const best = labelsSound && labels.length === n ? d14NameRotation(labels) : 0;
  return {
    faceId: menuFaceId,
    corners: face.cycle.map((_, i) => `${pref}${face.cycle[(best + i) % n]}`),
    positions: positions.map((_, i) => positions[(best + i) % n]),
  };
}

export function boundaryFacesOf(shape: Shape, resolveAbsent?: AbsentLabelResolver): BoundaryFaceEntry[] {
  if (shape.cells.length === 0) {
    throw new Error('apertureModel: this form is a surface, not a solid — there is no room to build on it');
  }
  if (shape.cells.length === 1) {
    // the degenerate case: one cell owns every face — the whole menu, raw ids
    return shape.faces
      .filter((face) => shape.cells[0].faceIds.includes(face.id))
      .map((face) => ({ id: face.id, label: `${faceDisplayName(shape, face, resolveAbsent)} · ${face.vertexIds.length} corners` }));
  }
  // the owner census — DISTINCT owning cells per face. ⛔ THE DEGENERATE
  // GUARD (engineer 1420 §1): a face repeated INSIDE one cell's faceIds (a
  // pinched / self-paired cell) would count 2 by naive tallying and be
  // silently hidden from the person as if it were an interior wall — never
  // silently hide it; refuse BY NAME.
  const ownersByFace = new Map<string, number[]>();
  shape.cells.forEach((cell, index) => {
    const seenInCell = new Set<string>();
    for (const faceId of cell.faceIds) {
      if (seenInCell.has(faceId)) {
        throw new Error(
          `apertureModel: cell ${index} cites face ${shortId(faceId)} more than once (a pinched cell) — the boundary menu cannot be read honestly; refused by name`,
        );
      }
      seenInCell.add(faceId);
      const owners = ownersByFace.get(faceId);
      if (owners) {
        owners.push(index);
      } else {
        ownersByFace.set(faceId, [index]);
      }
    }
  });
  const entries: BoundaryFaceEntry[] = [];
  for (const face of shape.faces) {
    const owners = ownersByFace.get(face.id);
    if (!owners || owners.length !== 1) continue; // interior walls (2 owners) are the complex's own identification — never offered
    entries.push({ id: `c${owners[0]}:${face.id}`, label: `${faceDisplayName(shape, face, resolveAbsent)} · ${face.vertexIds.length} corners` });
  }
  return entries;
}

// D8 amendment 1 (engineer 1759) → 2(b) recut (B-2026-08-22-C, ruling (i):
// identity across a hop is a RECORD, never a string relation): the
// carried-base resolve is EXACT-ONLY now. The suffix arm — and the
// amendment-1759 ambiguity refusal that existed solely to guard it — dies
// with its class: a hopped product no longer resolves its base by name
// surgery at all; its genealogy pointer (re-rooted by the committed loader
// onto the CARRIED ancestor riding the same file) is the record the view
// reads FIRST, and this map remains only the mint-time exact-id fallback
// for a product that never hopped. Zero yields nothing — the caller's
// pointer road stands; nothing is ever guessed.
export interface CarriedMetricBaseResolution {
  baseId: string | null;
  // retained for the RECORD type (old page files carry named refusals);
  // this resolver no longer mints one — the walk it guarded is dead.
  ambiguity: string | null;
}

export function resolveCarriedMetricBase(
  volumeId: string,
  carried: ReadonlyMap<string, string>,
): CarriedMetricBaseResolution {
  const exact = carried.get(volumeId);
  if (exact) return { baseId: exact, ambiguity: null };
  return { baseId: null, ambiguity: null };
}

// D13: a menu id's corner count, id-space-aware (the multi-cell menu speaks
// `c{i}:`-prefixed ids); null for an id the shape does not hold — the
// unknown-id case stays the engine's own throw downstream, never guessed here
function faceCornerCountOf(shape: Shape, menuFaceId: string): number | null {
  const raw = menuFaceId.replace(/^c\d+:/, '');
  const face = shape.faces.find((f) => f.id === raw);
  return face ? face.vertexIds.length : null;
}

// §3.3 (mothership 2026-08-21; the researcher's ruled consequence): THE
// PARITY CENSUS — a face meets only an equal-cornered face, so per corner
// class the pair capacity is ⌊count/2⌋ and every ODD class forces one face
// to stand as a wall whatever the person chooses. Read BEFORE the person
// acts — a fact about the volume, never a refusal; the panel prints it only
// when a wall is actually forced (a cube's even classes say nothing).
export interface ApertureParityCensus {
  total: number;
  classes: { corners: number; count: number }[]; // largest class first — the ratified reading order
  pairs: number; // Σ ⌊count/2⌋ — all this volume can make
  forcedWalls: number; // Σ (count mod 2) — walls that stand whatever is chosen
}

export function apertureParityCensus(shape: Shape, resolveAbsent?: AbsentLabelResolver): ApertureParityCensus | null {
  let entries: BoundaryFaceEntry[];
  try {
    entries = boundaryFacesOf(shape, resolveAbsent);
  } catch {
    return null; // the pinch guard's refusal owns that surface — no census
  }
  const byCorners = new Map<number, number>();
  for (const entry of entries) {
    const corners = faceCornerCountOf(shape, entry.id);
    if (corners === null) return null; // an unreadable face ⇒ no honest census
    byCorners.set(corners, (byCorners.get(corners) ?? 0) + 1);
  }
  const classes = [...byCorners.entries()]
    .map(([corners, count]) => ({ corners, count }))
    .sort((a, b) => b.count - a.count || a.corners - b.corners);
  let pairs = 0;
  let forcedWalls = 0;
  for (const { count } of classes) {
    pairs += Math.floor(count / 2);
    forcedWalls += count % 2;
  }
  return { total: entries.length, classes, pairs, forcedWalls };
}

/** Named, curable refusals — the door never glues a half-made pattern. */
export function aperturePairingRefusal(seedShape: Shape, rows: AperturePairRow[]): string | null {
  // D2: the validation side-effect, cell-count-aware — the single-cell path
  // keeps `readSeedCell`'s wall byte-behavior-identically; a multi-cell
  // volume validates through its own reader (the old unconditional
  // readSeedCell would THROW on every multi-cell solid). The `seed` binding
  // was unused by the row law below (verified) — only the throw mattered.
  if (seedShape.cells.length <= 1) {
    readSeedCell(seedShape);
  } else {
    readSeedCells(seedShape);
  }
  const used = new Map<string, number>();
  for (const row of rows) {
    for (const id of [row.faceA, row.faceB]) {
      if (id) used.set(id, (used.get(id) ?? 0) + 1);
    }
  }
  for (const [id, count] of used) {
    if (count > 1) return `face ${shortId(id)} is picked ${count} times — every face pairs exactly once.`;
  }
  // THE APERTURE'S ROW LAW, ruled apart (R2, seal 6f7ae2dc…661f1): an UNTOUCHED
  // pair is the OPEN PAIR — the person's chosen boundary — and is SKIPPED, never
  // refused; a HALF-PICKED pair is refused BY NAME; zero complete pairs is the
  // one honest global refusal below. `pair N: pick BOTH faces.` died with the
  // one-predicate law that could not tell the two apart.
  let completePairs = 0;
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const hasA = row.faceA !== null;
    const hasB = row.faceB !== null;
    if (!hasA && !hasB) continue; // the open pair — the boundary stands
    if (hasA !== hasB)
      return `pair ${i + 1}: one face is picked and its partner is not — pick the second face, or clear the first to leave the pair open.`;
    if (row.faceA === row.faceB) return `pair ${i + 1}: a face cannot pair with itself.`;
    // D13 (engineer 2021): the NON-CONGRUENT pick, refused BY NAME — this
    // fires BEFORE the pick-the-map refusal below, so the person hears the
    // real reason (the map menu is empty precisely because of this).
    // ⛔ the sentence is the designer's RATIFIED string (her plate, engineer
    // 2021 §(a)) — templated onto the row's own numbers, flagged not final.
    const cornersA = faceCornerCountOf(seedShape, row.faceA as string);
    const cornersB = faceCornerCountOf(seedShape, row.faceB as string);
    if (cornersA !== null && cornersB !== null && cornersA !== cornersB) {
      return `a face meets only a face with the same corners — this one has ${cornersA}, that one has ${cornersB}. pick a partner with ${cornersA}.`;
    }
    completePairs += 1;
  }
  // THE BOUNDED FORM (2026-07-18, sealed eb9bfcb4…d598c): the UNPAIRED-face
  // refusal ("…is not in any pair — the matching must be perfect.") is DELETED.
  // An unpaired face is a legitimate BOUNDARY — the person may pair one or two
  // of the three opposite pairs and hold a body with a boundary. The
  // over-paired refusal above stays byte-identical: a face in several pairs
  // was always genuinely malformed. The door now says what the engine's own
  // gate reads — one predicate, two meanings, finally ruled apart.
  for (let i = 0; i < rows.length; i += 1) {
    if (rows[i].faceA === null && rows[i].faceB === null) continue; // an open pair carries no map
    if (!rows[i].candidateKey) return `pair ${i + 1}: pick the identification MAP (which vertex lands on which).`;
    // F.0e — THE MISPLACED REFUSAL, RELOCATED (mothership §3.3, designer-ruled):
    // the reversing-map-on-a-multi-cell limit used to surface only at COMMIT
    // (buildPersonDomainVerdict's wall — which STAYS standing behind this),
    // costing the whole act; here it costs one pick. The option's own label
    // already printed the derived mode where it was chosen, so the sentence
    // can name it. Guarded: the candidate build sits on the render path (D13)
    // — an unbuildable menu refuses nothing here; the commit wall still holds.
    if (seedShape.cells.length > 1 && rows[i].candidateKey) {
      try {
        const chosen = dihedralMapCandidates(seedShape, rows[i].faceA as string, rows[i].faceB as string).find(
          (c) => c.key === rows[i].candidateKey,
        );
        if (chosen && chosen.derivedMode === 'reversing') {
          return `pair ${i + 1}: a REVERSING identification on a multi-cell volume is a later chapter — pick a preserving map, or leave the pair open.`;
        }
      } catch {
        // the commit wall behind this ladder still refuses by name
      }
    }
  }
  if (completePairs === 0)
    return 'no identification yet — pick at least one pair of faces (the rest may stay open as boundary).';
  return null;
}

// THE FOLDED EDGE (ADR 0022, researcher-ruled wall; the subdivide clause CUT
// by the designer's ruling, B-106 V3 §1 — the wall instructed the person to
// do what the door beside it already offers, in almost the same words. THE
// WALL STATES THE LIMIT; THE DOOR CARRIES THE ACT — one act, one voice. The
// wall asserts EXACTLY the non-freeness and its consequence, nothing more):
export const foldedEdgeWall = (edgeClass: string): string =>
  `This identification is not free: it folds edge class ${edgeClass} onto its own reverse, fixing its midpoint. ` +
  `The quotient is an orbifold — it carries a fold locus — not a free-quotient manifold. ` +
  `Its invariants cannot be read on this cell structure (a folded cell has no consistent orientation).`;

export interface FoldedEdgeVerdict {
  folded: true;
  key: string;
  title: string;
  chi: number;
  foldedEdgeClasses: string[];
  gate: Level3SoundnessReport;
  wall: string; // the ruled wall, naming the fold locus — the LIMIT only; the ACT is the door's (V3 §1)
  // 0.2 THE ORBIFOLD'S BODY: the verdict CARRIES A BODY now — the tower-less
  // sibling the aperture can draw. The wall and its cure above are 0.1's and
  // stand untouched; the body is what the person sees when they look through
  // the aperture at the thing the wall names.
  body: FoldedDomain;
}

export type PersonDomainVerdict = { folded: false; domain: DomainModel } | FoldedEdgeVerdict;

function resolvePersonPairings(seedShape: Shape, rows: AperturePairRow[]): FacePairing[] {
  const refusal = aperturePairingRefusal(seedShape, rows);
  if (refusal) throw new Error(`apertureModel: ${refusal}`);
  return rows
    // R2, the law's other half: an UNTOUCHED pair is the OPEN PAIR — the
    // person's boundary — and contributes NO pairing (the refusal above has
    // already guaranteed every remaining row is complete with its map).
    .filter((row) => row.faceA !== null || row.faceB !== null)
    .map((row) => {
    const candidates = dihedralMapCandidates(seedShape, row.faceA as string, row.faceB as string);
    const candidate = candidates.find((c) => c.key === row.candidateKey);
    if (!candidate) throw new Error(`apertureModel: unknown map candidate ${row.candidateKey}`);
    return {
      faceA: row.faceA as string,
      faceB: row.faceB as string,
      mode: candidate.derivedMode, // DERIVED and RECORDED — never chosen
      map: candidate.map,
    };
  });
}

/**
 * Glue, as a VERDICT (ADR 0022): resolve each row's picked candidate (mode
 * DERIVED from the map's witnessed fit, RECORDED), enact the identification,
 * and read the tower GATE-FIRST. A folded edge class is a verdict — the
 * identification is not free; the quotient is an ORBIFOLD — refused BY NAME
 * with the researcher's wall (which carries its cure: subdivide). Zero
 * throws escape this door. The sound path runs the COMMITTED `buildFormDomain`
 * verbatim — byte-identical to the pre-verdict route.
 */
export function buildPersonDomainVerdict(
  seedShape: Shape,
  rows: AperturePairRow[],
  key: string,
  title: string,
): PersonDomainVerdict {
  const pairings = resolvePersonPairings(seedShape, rows);
  // D2 — ONE DOOR, dispatched on cell count. The single-cell path below is
  // byte-behavior-identical to the committed door. A multi-cell volume routes
  // its person pairings through the SAME gate-first shape: enact (the shared
  // walls added by the complex's own law — never passed in, never auto-
  // pairing a boundary face), read the tower GATE-FIRST so no throw escapes,
  // then the committed buildFormDomain runs verbatim on the sound path.
  if (seedShape.cells.length > 1) {
    if (pairings.some((p) => p.mode === 'reversing')) {
      // refused BY NAME here — never crash into formDomainModel's committed
      // wall mid-build; the reversing chapter on multi-cell volumes is its own
      throw new Error(
        'apertureModel: a REVERSING identification on a multi-cell volume is a later chapter — pick a preserving map, or leave the pair open (refused by name; nothing was glued)',
      );
    }
    const seeds = readSeedCells(seedShape);
    const shared = sharedWallPairings(seedShape);
    const complexM = glueFaces(seeds, [...shared, ...pairings]);
    const readingM = readLevel3Tower(complexM);
    if (readingM.folded) {
      return {
        folded: true,
        key,
        title,
        chi: readingM.chi,
        foldedEdgeClasses: readingM.foldedEdgeClasses,
        gate: readingM.gate,
        wall: foldedEdgeWall(readingM.foldedEdgeClasses[0]),
        body: {
          folded: true,
          key,
          title,
          shape: seedShape,
          pairings,
          chi: readingM.chi,
          foldedEdgeClasses: readingM.foldedEdgeClasses,
          gate: readingM.gate,
          wall: foldedEdgeWall(readingM.foldedEdgeClasses[0]),
        },
      };
    }
    return { folded: false, domain: buildFormDomain(seedShape, pairings, key, title) };
  }
  const seed = readSeedCell(seedShape);
  const complex = pairings.some((p) => p.mode === 'reversing')
    ? flipGlueFaces(seed, pairings)
    : glueFaces(seed, pairings);
  const reading = readLevel3Tower(complex);
  if (reading.folded) {
    return {
      folded: true,
      key,
      title,
      chi: reading.chi,
      foldedEdgeClasses: reading.foldedEdgeClasses,
      gate: reading.gate,
      wall: foldedEdgeWall(reading.foldedEdgeClasses[0]),
      // 0.2: the body — tower-less by construction (a folded cell has no
      // readable tower); the gate's own edge links carry its geometry
      body: {
        folded: true,
        key,
        title,
        shape: seedShape,
        pairings,
        chi: reading.chi,
        foldedEdgeClasses: reading.foldedEdgeClasses,
        gate: reading.gate,
        wall: foldedEdgeWall(reading.foldedEdgeClasses[0]),
      },
    };
  }
  return { folded: false, domain: buildFormDomain(seedShape, pairings, key, title) };
}

/**
 * The DomainModel-or-throw door (kept for callers that demand a domain): on
 * a folded verdict it throws the WALL — named, gate-first — never the
 * orientation reader's stack trace.
 */
export function buildPersonDomain(seedShape: Shape, rows: AperturePairRow[], key: string, title: string): DomainModel {
  const verdict = buildPersonDomainVerdict(seedShape, rows, key, title);
  if (verdict.folded) {
    throw new Error(`apertureModel: ${verdict.wall}`);
  }
  return verdict.domain;
}

// ---------------------------------------------------------------------------
// THE SUBDIVISION DOOR (ARC 0.1, 2026-07-14 — LAW 14: a cure must be a door,
// not a theorem). The wall's cure now exists.
// ---------------------------------------------------------------------------

export interface SubdivisionReading {
  // the finer cell structure's counts, read off the union-finds (never assumed)
  counts: { v: number; e: number; f: number; c: number };
  // the gate's OWN verdict on the bisected complex, verbatim — ⛔ NOTHING is
  // claimed about the result: subdivision makes the orbifold LEGIBLE, not a
  // manifold; whatever the gate says is the honest reading (the finer question
  // is ARC 0.3, its own seal).
  reading: Level3TowerReading;
}

/**
 * subdivideAndReadPersonDomain — on a folded-edge verdict the person invokes
 * subdivide: the seed is BISECTED (uniformly — all edges; partial bisection
 * breaks paired-face congruence and the validator would refuse it), the
 * pairings LIFT (midpoint → midpoint of the edge's image), the form is
 * RE-GLUED through the same committed ops, and the gate reads it again. The
 * formerly folded edge is now two half-edges the identification simply
 * swaps, with a genuine vertex fixed at its midpoint.
 *
 * ⚠ Valid exactly while faceIdentification.ts:316 (no self-paired face) is
 * enforced — see level3Subdivision's header for the precondition, by line.
 */
export function subdivideAndReadPersonDomain(seedShape: Shape, rows: AperturePairRow[]): SubdivisionReading {
  // D2 §5 (the :2411 finding): the cure must read THE VOLUME THE PERSON IS
  // LOOKING AT — the committed bisection reads a single seed cell, so a
  // multi-cell volume is refused BY NAME (which form and why), never a
  // silent subdivide of some other shape.
  if (seedShape.cells.length > 1) {
    throw new Error(
      `apertureModel: the subdivide cure reads a single-cell volume — "${seedShape.name}" carries ${seedShape.cells.length} cells; the multi-cell fold cure is its own arc (refused by name; nothing was subdivided)`,
    );
  }
  const pairings = resolvePersonPairings(seedShape, rows);
  const seed = readSeedCell(seedShape);
  const bisected = bisectEdges(seed);
  const lifted = liftPairingsToBisected(seed, pairings);
  const complex = lifted.some((p) => p.mode === 'reversing')
    ? flipGlueFaces(bisected, lifted)
    : glueFaces(bisected, lifted);
  return { counts: complex.counts, reading: readLevel3Tower(complex) };
}

// ---------------------------------------------------------------------------
// GEOMETRY = THE RECESSION LAW, UN-GATED (n from the tower's own edge links)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// THE CONE-ANGLE SOURCE (2026-08-08, THE INSIDE-VIEW HATCH step 8 — the
// mothership's conformal wiring, the researcher's pinned map): ONE clean seam
// deciding where a form's interior cone angles come from.
//   · MEASURED — when the domain's seed is a THICKEN PRODUCT whose cells own
//     their dihedrals AND its base rides in (the genealogy's parent): the
//     SEALED `readPillarDihedrals(base, thickened)` readings, wired onto the
//     glued classes by the pinned DIRECT lookup
//     `complex.edgeClassOf(r.pillarEdgeId)` (buildFormDomain→readSeedCell
//     runs prefix-free, so the pillar ids ARE the complex's edge ids).
//     A sew that merges several pillars into one class AGGREGATES:
//     the class's total angle = Σ member pillars' dihedrals (the angle
//     actually swept around the merged edge; the researcher's fixture table
//     arbitrates the convention — flagged in the handback).
//   · HEURISTIC — everywhere else: the standing k×90° census (each interior
//     class of size k at k times the cube's dihedral). Every CURRENT aperture
//     subject is cube-seeded (no owned dihedrals), so today this branch is
//     the live one — the seam makes the swap total the moment a thicken-born
//     product enters the door.
//   · REFUSAL — a junction base vertex makes `readPillarDihedrals` THROW
//     (a non-manifold 3-edge); the refusal is CARRIED verbatim, never turned
//     into a cone number, and the census falls back to the heuristic with the
//     refusal spoken on the label.
// ---------------------------------------------------------------------------

export interface ConeAngleSource {
  // D1 (2026-08-14, the mothership's non-negotiable): a third kind —
  // 'unresolved-base' — for an OWNED product whose metric base did not
  // resolve. It is a NAMED refusal, never a silent slide to the heuristic:
  // after D1 everyone believes a bare number is measured, so the un-measured
  // owned case must SAY SO on the caption.
  kind: 'measured' | 'heuristic' | 'unresolved-base';
  anglesByClass: Map<string, number> | null; // radians per interior edge-class root (measured only)
  refusal: string | null; // the junction refusal / the unresolved-base reason, carried verbatim
}

export const HEURISTIC_CONE_SOURCE: ConeAngleSource = { kind: 'heuristic', anglesByClass: null, refusal: null };

// D1: `base` resolves the sealed metric; `baseMissing` NAMES why it could not
// be handed in (the caller knows — e.g. the recorded base left the page). An
// owned product with neither is refused by the floor's own default sentence.
export interface ConeLineage {
  base?: Shape;
  baseMissing?: string;
}

export function resolveConeAngleSource(domain: DomainModel, lineage?: ConeLineage): ConeAngleSource {
  const shape = domain.shape;
  // THE MULTI-CELL CUT (2026-08-13): a multi-cell product is ADMITTED when
  // EVERY cell owns its dihedrals (thicken stamps each prism cell of an
  // owned base) — the researcher's fixture ran readPillarDihedrals on the
  // n=5 fan (300°). The single-cell path is byte-behavior-identical: one
  // owned cell passes both forms; a cube (no owned dihedrals) still falls
  // to the k×90° heuristic exactly as before.
  const owned =
    shape.cells.length >= 1 &&
    shape.cells.every((c) => c.dihedralAngles && Object.keys(c.dihedralAngles).length > 0);
  // D1 THE REFUSE-BY-NAME FLOOR (the mothership's non-negotiable): a
  // NOT-owned shape (a cube) falls to the heuristic LEGITIMATELY — that is
  // not the defect. An OWNED product without a resolved base REFUSES BY
  // NAME — never a silent k×90° that would read as measured.
  if (!owned) return HEURISTIC_CONE_SOURCE;
  if (!lineage?.base) {
    return {
      kind: 'unresolved-base',
      anglesByClass: null,
      refusal:
        lineage?.baseMissing ??
        'the product owns its dihedrals but its sealed metric base could not be resolved (no base was recorded for it)',
    };
  }
  try {
    // ⛔ THE PRECONDITION (researcher 1430): the SAME thickened Shape object
    // feeds this reader and fed buildFormDomain — one edge-id space. The
    // domain carries that shape verbatim (`domain.shape`), so the ids match
    // by construction; a re-thickened or divergent solid never reaches here.
    const readings = readPillarDihedrals(lineage.base, shape);
    // ZERO readings means NO interior pillar was readable (a sheet base has
    // only boundary pillars) — nothing was measured, so nothing may be
    // claimed: the heuristic stands. (All-smooth readings are different:
    // they MEASURED 2π everywhere and may say so.)
    if (readings.length === 0) return HEURISTIC_CONE_SOURCE;
    // the reading's pillar id lives in the SHAPE's id space; a multi-cell
    // complex is PREFIXED per cell (readSeedCells) — resolve through the
    // complex's own original edges (exact match first: the single-cell path
    // stays byte-identical; then any cell's prefixed copy — the shared-wall
    // pairings union every copy into ONE class, so any member resolves it)
    const inComplexId = (edgeId: string): string => {
      const exact = domain.complex.originalEdges.find((e) => e.id === edgeId);
      if (exact) return exact.id;
      const prefixed = domain.complex.originalEdges.find((e) => e.id.endsWith(`:${edgeId}`));
      return prefixed ? prefixed.id : edgeId;
    };
    const anglesByClass = new Map<string, number>();
    for (const reading of readings) {
      if (reading.coneAngle === null) continue; // smooth pillars mint no cone edge
      const classRoot = domain.complex.edgeClassOf(inComplexId(reading.pillarEdgeId));
      anglesByClass.set(classRoot, (anglesByClass.get(classRoot) ?? 0) + reading.totalDihedral);
    }
    return { kind: 'measured', anglesByClass, refusal: null };
  } catch (error) {
    return {
      kind: 'heuristic',
      anglesByClass: null,
      refusal: error instanceof Error ? error.message : String(error),
    };
  }
}

export interface ApertureGeometry {
  // B.0 THE HONEST DOOR (researcher-ruled, sealed fab02d7e…e77e2): the engine
  // is EUCLIDEAN — the seed cube has 90° dihedrals and the deck maps are
  // ambient ℝ³ isometries, so cube/~ is ALWAYS a Euclidean cone-manifold.
  // k = edgeLinks[].memberEdgeIds.length is the EDGE-CLASS SIZE, never an
  // ambient curvature: a necessary condition is not a verdict (LAW 15). A
  // k≠4 class is a CONE EDGE at angle k×90° — the door no longer names
  // 'S³'/'H³'/'mixed' geometries the substrate cannot hold.
  kind: 'E3' | 'cone';
  n: number[];
  label: string;
  coneEdges: string | null; // the k≠4 classes at k×90°, human-readable — null on the uniform flat form
  // THE BOUNDED FORM (2026-07-18): the honest boundary sentence, null on a
  // closed form. A boundary edge class (link = an arc) has a k×90° < 360°
  // dihedral BY BEING A BOUNDARY — it is never called a cone edge (the same
  // exclusion the folded label applies to fold loci).
  boundary: string | null;
  // D1 RIDER (engineer 1537): the metric state as a POSITIVE FACT the window
  // caption can mark on BOTH sides (the wordings are the designer's — the
  // view holds the slot table; this field only says WHICH state holds).
  metricSource: 'measured' | 'heuristic' | 'unresolved-base';
  // the unresolved-base reason (or a carried junction refusal), for the
  // caption slot to speak — null when nothing was refused
  metricRefusal: string | null;
}

export function geometryFromTower(tower: DomainModel['tower'], coneSource?: ConeAngleSource | null): ApertureGeometry {
  // THE BOUNDED FORM: boundary edge classes are excluded from the dihedral
  // census exactly as fold loci are — k×90° names a CONE angle only on an
  // interior class. On a closed form the boundary set is empty and every
  // branch below is byte-equivalent to the previous door.
  const boundaryReading = tower.gate.boundary ?? null;
  const boundaryRoots = new Set(boundaryReading ? boundaryReading.edgeClasses : []);
  const boundary = boundaryReading
    ? `bounded — ∂ carries ${boundaryReading.faceClasses.length} face class(es); closed-form claims do not apply`
    : null;
  const interiorLinks = tower.gate.edgeLinks.filter((link) => !boundaryRoots.has(link.edgeClass));
  const n = tower.gate.edgeLinks.map((link) => link.memberEdgeIds.length);
  const interiorN = interiorLinks.map((link) => link.memberEdgeIds.length);
  // step 8 (THE INSIDE-VIEW HATCH) — the MEASURED source supersedes the
  // k×90° heuristic wholesale: the cone edges are exactly the classes the
  // sealed metric read as cones; every other interior class is metric-smooth
  // whatever its k. A carried junction refusal rides the label and the
  // census below falls back to the heuristic (never a half-wired source).
  const source = coneSource ?? HEURISTIC_CONE_SOURCE;
  const refusalNote = source.refusal ? ` · metric refused: ${source.refusal}` : '';
  if (source.kind === 'measured' && source.anglesByClass) {
    const measured = interiorLinks.filter((link) => source.anglesByClass!.has(link.edgeClass));
    if (measured.length === 0) {
      return {
        kind: 'E3',
        n,
        label: `E³ — n=[${n.join(',')}] · every interior pillar measures 2π (the sealed metric)${boundary ? ` · ${boundary}` : ''}`,
        coneEdges: null,
        boundary,
        metricSource: 'measured',
        metricRefusal: null,
      };
    }
    const coneCountsByAngle = new Map<number, number>();
    for (const link of measured) {
      const deg = Math.round(((source.anglesByClass!.get(link.edgeClass) as number) * 1800) / Math.PI) / 10;
      coneCountsByAngle.set(deg, (coneCountsByAngle.get(deg) ?? 0) + 1);
    }
    const coneEdges = [...coneCountsByAngle.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([deg, count]) => `${count} × ${deg}°`)
      .join(', ');
    return {
      kind: 'cone',
      n,
      label: `Euclidean cone-manifold — n=[${n.join(',')}] · cone edges (measured): ${coneEdges}${boundary ? ` · ${boundary}` : ''}`,
      coneEdges,
      boundary,
      metricSource: 'measured',
      metricRefusal: null,
    };
  }
  // D1 THE REFUSE-BY-NAME FLOOR reaches the label: an OWNED product whose
  // base did not resolve claims NO metric number — not flat, not k×90° cones.
  // The caption speaks the refusal by name; the heavy-rod census sees no
  // declared cone edges (coneEdges null — nothing fabricated on a refusal).
  if (source.kind === 'unresolved-base') {
    return {
      kind: 'cone',
      n,
      label: `Euclidean cone-manifold — n=[${n.join(',')}] · sealed metric UNRESOLVED: ${source.refusal ?? 'the metric base could not be resolved'}${boundary ? ` · ${boundary}` : ''}`,
      coneEdges: null,
      boundary,
      metricSource: 'unresolved-base',
      metricRefusal: source.refusal,
    };
  }
  const uniform = interiorN.length > 0 && interiorN.every((v) => v === interiorN[0]);
  if (uniform && interiorN[0] === 4) {
    return {
      kind: 'E3',
      n,
      label: `E³ — n=[${n.join(',')}] · 2π/4 = the cube's 90° dihedral${boundary ? ` · ${boundary}` : ''}${refusalNote}`,
      coneEdges: null,
      boundary,
      metricSource: 'heuristic',
      metricRefusal: source.refusal,
    };
  }
  // every other sound form: a Euclidean cone-manifold — report the cone edges
  // (each INTERIOR k≠4 class at k×90°) and claim nothing about a curved ambient
  const coneCounts = new Map<number, number>();
  for (const k of interiorN) {
    if (k !== 4) coneCounts.set(k, (coneCounts.get(k) ?? 0) + 1);
  }
  const coneEdges = coneCounts.size === 0
    ? null
    : [...coneCounts.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([k, count]) => `${count} × ${k * 90}°`)
        .join(', ');
  return {
    kind: 'cone',
    n,
    label: `Euclidean cone-manifold — n=[${n.join(',')}]${coneEdges ? ` · cone edges: ${coneEdges}` : ''}${boundary ? ` · ${boundary}` : ''}${refusalNote}`,
    coneEdges,
    boundary,
    metricSource: 'heuristic',
    metricRefusal: source.refusal,
  };
}

// ---------------------------------------------------------------------------
// 0.2 THE ORBIFOLD'S BODY (2026-07-16, sealed de6f8237…83cb): the folded
// forms' bodies already existed — deckOf fits all 97 and the tracer draws
// them; the sole blocker was one unconditional tower read. The folded path is
// a SIBLING, never a widening: DomainModel's tower stays non-nullable, the
// frozen worldModel/specimenModel do not move, and the transport is untouched.
// ---------------------------------------------------------------------------

/** The folded body's geometry — read from the GATE's own edge links (present
 * on 97/97 folded verdicts), never from a tower a folded cell cannot carry.
 * ⛔ ASSERTS NON-FREENESS ONLY (ADR 0022): the label says orbifold and names
 * the fold loci; it never says (or contains) "manifold" — that certificate is
 * the gate's (0.3, its own seal).
 * THE RP² POINT PRINTS NOTHING (designer-ruled): a FOLDED edge is not a cone
 * edge — its holonomy reverses the edge, so k×90° does not apply and no angle
 * is minted for it (folded classes are excluded by classRoot — the census
 * key). The fold locus gets no angle, no interpolation, and NO drawn hole:
 * "an ε² hole sized so it reads is the orbifold badge wearing the costume of
 * honesty." The tracer is byte-untouched; nothing special-cases the singular
 * point (measure-zero — it essentially never fires).
 */
export interface FoldedApertureGeometry {
  kind: 'folded';
  n: number[];
  foldLoci: number; // folded edge classes — no angle applies to them
  coneEdges: string | null; // TRUE cone edges only: k≠4 AND NOT folded, at k×90°
  label: string;
}

export function geometryFromFoldedGate(gate: Level3SoundnessReport): FoldedApertureGeometry {
  const foldedRoots = new Set(
    gate.failures
      .filter((f): f is Extract<typeof f, { kind: 'folded-edge' }> => f.kind === 'folded-edge')
      .map((f) => f.classRoot),
  );
  const n = gate.edgeLinks.map((link) => link.memberEdgeIds.length);
  const coneCounts = new Map<number, number>();
  for (const link of gate.edgeLinks) {
    const k = link.memberEdgeIds.length;
    if (k !== 4 && !foldedRoots.has(link.edgeClass)) coneCounts.set(k, (coneCounts.get(k) ?? 0) + 1);
  }
  const coneEdges = coneCounts.size === 0
    ? null
    : [...coneCounts.entries()].sort((a, b) => a[0] - b[0]).map(([k, count]) => `${count} × ${k * 90}°`).join(', ');
  return {
    kind: 'folded',
    n,
    foldLoci: foldedRoots.size,
    coneEdges,
    label: `orbifold — n=[${n.join(',')}] · fold loci: ${foldedRoots.size}${coneEdges ? ` · cone edges: ${coneEdges}` : ''}`,
  };
}

/** The tower-less domain a folded verdict carries — the body the person can
 * stand in. A SIBLING of DomainModel (no tower field exists here at all). */
export interface FoldedDomain {
  folded: true;
  key: string;
  title: string;
  shape: Shape; // the seed
  pairings: FacePairing[];
  chi: number;
  foldedEdgeClasses: string[];
  gate: Level3SoundnessReport;
  wall: string; // 0.1's wall + cure, kept verbatim
}

// ---------------------------------------------------------------------------
// THE CELL SURFACE (THE DOOR-FEED partial, 2026-08-13 — the witnessed
// boundary-flag read): everything the walk window needs about the room's OWN
// fundamental cell, in CENTERED cell coordinates — the face planes with each
// face's verdict (a PORTAL carrying its deck transform, or a WALL: the
// person's unpaired boundary — "the manifold ends here"), and the seed edges
// as rods with their engine edge-class k + palette. General over any ONE-cell
// convex seed (the cube degenerates to the instrument's exact 12-rod frame).
// Read from the domain's own pairings/union-find/gate; nothing re-derived,
// the transport math untouched.
// ---------------------------------------------------------------------------

export interface ApertureCellFace {
  n: V3; // outward unit normal (centered coords)
  d: number; // plane offset: dot(p, n) = d
  wall: boolean; // true = the person's boundary — the room's edge, never an escape
  g: DeckTransform | null; // portal: exiting through this face applies g (null on walls)
  /** B-114 — the SAME door as an in-model projective 4×4, present only when
   * the room has SEALED a curved realization. ⛔ The euclidean room does not
   * get one: `g` is already the whole story there, and a second copy of a map
   * the room already holds is how a walk drifts from its own witnesses (the
   * B-113 finding, one dimension over). */
  g4?: Mat4;
  // INTERIOR TRANSPORT (mothership 2026-08-21): a BOUNDED face fires only
  // where its actual quad is — |dot(p−c,u)| ≤ ‖u‖² and |dot(p−c,w)| ≤ ‖w‖².
  // Forced by non-convexity: the developed cone room's seam planes cut
  // through material far from the seam itself, and a plane-only test would
  // transport an eye standing legitimately inside another wedge. Absent =
  // the plane is the whole story (every convex-cell face, byte-identical).
  bounds?: { c: V3; u: V3; w: V3 };
}

export interface ApertureCellRod {
  a: V3;
  b: V3; // endpoints, centered coords
  k: number; // the edge-class SIZE (the heuristic census counts k×90°)
  cls: number; // a small palette index per distinct class root
  heavy: boolean; // drawn HEAVY only when the geometry's own census declared cone edges and this class is k≠4 — never fabricated on a census that read none
}

export interface ApertureCellSurface {
  faces: ApertureCellFace[];
  rods: ApertureCellRod[];
  span: number; // the cell's max bbox extent (the cube: 2) — the walk's horizon unit
  wallCount: number;
  /** B-114 — the model the room is drawn AND WALKED in. Absent = E³, and
   * every euclidean room's surface is byte-identical to what it always was.
   * The chart is the projective one (`chartOf`): straight rays, flat planes,
   * in all three models — so the walk's plane tests are unchanged and only
   * the transport and the metre differ. */
  model?: 'S3' | 'H3';
}

const shiftDeckTransform = (g: DeckTransform, c: V3): DeckTransform => {
  // the frame recenters by c (p' = p − c): the linear part rides; the
  // translation conjugates — t' = R·c + t − c
  const R = g.slice(0, 9);
  const t: V3 = [g[9], g[10], g[11]];
  const Rc: V3 = [
    R[0] * c[0] + R[1] * c[1] + R[2] * c[2],
    R[3] * c[0] + R[4] * c[1] + R[5] * c[2],
    R[6] * c[0] + R[7] * c[1] + R[8] * c[2],
  ];
  return [...R, Rc[0] + t[0] - c[0], Rc[1] + t[1] - c[1], Rc[2] + t[2] - c[2]];
};

// ---------------------------------------------------------------------------
// INTERIOR TRANSPORT (mothership 2026-08-21) — THE DEVELOPED CONE ROOM.
// The measured fact that forced this (instruments/interior_transport_probe):
// a thicken product's STORED embedding smears a cone pillar's angle across
// the full 2π (the fan: owned wedges Σ=300° but embedded wedges Σ=360°, the
// distortion INSIDE cells c0/c4), so every interior shared wall fits the
// identity and no per-wall transform on that embedding can carry the
// deficit. The honest room is the DEVELOPMENT: D6's own law says the
// intrinsic product is the OWNED stamps' (dihedral record ≡ base corner
// angle; "embedded dihedrals tile 2π while intrinsic stamps sum to the cone
// angle") — so the walk-room is rebuilt from the records: the base fan
// unrolled flat around the pillar at its TRUE wedge angles (Σ = the cone
// angle < 2π ⇒ injective, with a void wedge), lifted ⊥ by the pillar's own
// fiber, and the ONE cycle-closing wall becomes a SEAM PORTAL PAIR carrying
// the holonomy (rotation about the pillar by ∓ the material span — det +1,
// LAW 20: the mark is the room coming home EARLY, counted in doors; no felt
// rotation is produced anywhere). Interior walls between consecutively-laid
// wedges coincide BY CONSTRUCTION — genuinely spanned, never emitted:
// not-a-wall and, at the seam, not-nothing.
// Every precondition is a LIVE GUARD (the null falls back to the union
// path): >1 cell · every two-owner face shares one pillar vertex pair ·
// the cells form one cycle · every cell owns the pillar dihedral record ·
// Σ(owned) < 2π − ε. A flat product (Σ ≈ 2π: the charts genuinely
// coincide) keeps the union path byte-identically — the old comment's
// precondition, finally WRITTEN as code.
const rotZAbout = (theta: number, axisXY: [number, number]): DeckTransform => {
  const cs = Math.cos(theta);
  const sn = Math.sin(theta);
  // linear part rotZ(theta); translation fixes the vertical line through axisXY
  const tx = axisXY[0] - (cs * axisXY[0] - sn * axisXY[1]);
  const ty = axisXY[1] - (sn * axisXY[0] + cs * axisXY[1]);
  return [cs, -sn, 0, sn, cs, 0, 0, 0, 1, tx, ty, 0];
};

function developedConeSurface(
  domain: DomainModel | FoldedDomain,
  rodFor: (srcEdgeId: string | null, a: V3, b: V3) => ApertureCellRod,
): ApertureCellSurface | null {
  const shape = domain.shape;
  if (shape.cells.length < 2) return null;
  // interior faces: owned by exactly two cells
  const ownersOf = new Map<string, number[]>();
  shape.cells.forEach((cell, ci) => {
    for (const fid of cell.faceIds) {
      const list = ownersOf.get(fid) ?? [];
      list.push(ci);
      ownersOf.set(fid, list);
    }
  });
  const interior = [...ownersOf.entries()].filter(([, owners]) => owners.length === 2);
  if (interior.length !== shape.cells.length) return null; // one cycle needs exactly N walls
  // the PILLAR: the vertex pair every interior wall contains
  const faceById = new Map(shape.faces.map((f) => [f.id, f]));
  let common: Set<string> | null = null;
  for (const [fid] of interior) {
    const face = faceById.get(fid);
    if (!face || face.vertexIds.length !== 4) return null; // thicken walls are quads
    const ids = new Set(face.vertexIds);
    if (common === null) {
      common = ids;
    } else {
      const prev: Set<string> = common;
      common = new Set([...prev].filter((v) => ids.has(v)));
    }
  }
  if (!common || common.size !== 2) return null;
  const positions = new Map(Object.values(shape.vertices).map((v) => [v.id, v.position as V3]));
  const [pA, pB] = [...common];
  // bottom = the @0 copy when the suffix convention holds; else order is harmless
  const [pillar0, pillar1] = pA.endsWith('@1') && pB.endsWith('@0') ? [pB, pA] : [pA, pB];
  const P0 = positions.get(pillar0);
  const P1 = positions.get(pillar1);
  if (!P0 || !P1) return null;
  const H = Math.hypot(P1[0] - P0[0], P1[1] - P0[1], P1[2] - P0[2]);
  if (!(H > 1e-6)) return null;
  // #37 LANDED (B-2026-08-22-A): the dihedral-record keys are re-rooted by
  // the loader with every other carried ref (snapshot.ts namespaceOne, the
  // sanctioned union), so the record key for this pillar is EXACTLY the
  // pillar id's stem + '@I' — resolved by `===`, never by suffix. The
  // 2026-08-21 tail-match stopgap died here by its own booked
  // death-condition. The match still demands EXACTLY ONE hit per cell — an
  // ambiguous or absent record falls back to the union path rather than
  // developing a wrong room.
  const pillarKey = `${pillar0.replace(/@0$/, '')}@I`;
  const keyMatchesPillar = (k: string): boolean => k === pillarKey;
  // adjacency cycle over cells via the interior walls
  const wallsOfCell = new Map<number, string[]>();
  for (const [fid, owners] of interior)
    for (const ci of owners) wallsOfCell.set(ci, [...(wallsOfCell.get(ci) ?? []), fid]);
  if ([...wallsOfCell.values()].some((w) => w.length !== 2)) return null;
  const cycleCells: number[] = [0];
  const cycleWalls: string[] = [];
  let enteredBy: string | null = null;
  for (let step = 0; step < shape.cells.length; step += 1) {
    const here = cycleCells[cycleCells.length - 1];
    const exitWall = (wallsOfCell.get(here) ?? []).find((w) => w !== enteredBy);
    if (!exitWall) return null;
    cycleWalls.push(exitWall);
    const owners = ownersOf.get(exitWall) ?? [];
    const next = owners.find((ci) => ci !== here);
    if (next === undefined) return null;
    if (step === shape.cells.length - 1) {
      if (next !== cycleCells[0]) return null; // must close
    } else {
      if (cycleCells.includes(next)) return null; // one simple cycle only
      cycleCells.push(next);
    }
    enteredBy = exitWall;
  }
  // owned wedge per cell (the D6 record) + the base radial data per wall
  const wedgeOf: number[] = [];
  for (const ci of cycleCells) {
    const dm = shape.cells[ci].dihedralAngles ?? {};
    const hits = Object.keys(dm).filter(keyMatchesPillar);
    if (hits.length !== 1) return null;
    wedgeOf.push(dm[hits[0]]);
  }
  const total = wedgeOf.reduce((a, b) => a + b, 0);
  if (!(total > 1e-6) || total > 2 * Math.PI - 1e-3) return null; // flat/over ⇒ union path
  // wall i sits BETWEEN cycleCells[i-1] and cycleCells[i]; wall 0 (the seam)
  // between the last and first. Its base rim vertex: the wall's @0 corner
  // that is not the pillar.
  const rimBaseOfWall = (fid: string): string | null => {
    const face = faceById.get(fid);
    if (!face) return null;
    const rims = face.vertexIds.filter((v) => v !== pillar0 && v !== pillar1);
    if (rims.length !== 2) return null;
    return rims.find((v) => v.endsWith('@0')) ?? rims[0];
  };
  // developed layout: wall angles cumulative from the seam at Θ0; the void
  // bisector is aimed OPPOSITE the walk's entry direction (the entry eye is
  // ExploreWindow's [-0.35,-0.55,·] in centered coords) so the person starts
  // inside material, away from the seam.
  const entryDir = Math.atan2(-0.55, -0.35);
  const voidBisector = entryDir + Math.PI;
  const theta0 = voidBisector + (2 * Math.PI - total) / 2 - 2 * Math.PI; // seam A angle
  const wallAngle: number[] = [theta0];
  for (let i = 0; i < wedgeOf.length; i += 1) wallAngle.push(wallAngle[i] + wedgeOf[i]);
  // developed base points: pillar at origin; rim of wall i at its angle
  const seamWall = cycleWalls[cycleWalls.length - 1]; // closes last→first: the seam
  const orderedWalls = [seamWall, ...cycleWalls.slice(0, cycleWalls.length - 1)];
  const rimLen: number[] = [];
  const rimSrc: string[] = [];
  for (const fid of orderedWalls) {
    const rim = rimBaseOfWall(fid);
    const rp = rim ? positions.get(rim) : null;
    if (!rim || !rp) return null;
    rimSrc.push(rim);
    rimLen.push(Math.hypot(rp[0] - P0[0], rp[1] - P0[1], rp[2] - P0[2]));
  }
  rimSrc.push(rimSrc[0]); // the far seam copy shares the SOURCE rim vertex
  rimLen.push(rimLen[0]);
  const rimXY: [number, number][] = wallAngle.map((th, i) => [Math.cos(th) * rimLen[i], Math.sin(th) * rimLen[i]]);
  // recenter on the developed centroid (bottom+top rims + pillar ends)
  const pts: V3[] = [];
  for (const z of [0, H]) {
    pts.push([0, 0, z]);
    for (const [x, y] of rimXY) pts.push([x, y, z]);
  }
  const c: V3 = [0, 0, 0];
  for (const p of pts) {
    c[0] += p[0] / pts.length;
    c[1] += p[1] / pts.length;
    c[2] += p[2] / pts.length;
  }
  const R = (p: V3): V3 => [p[0] - c[0], p[1] - c[1], p[2] - c[2]];
  const pillarXY: [number, number] = [-c[0], -c[1]];
  const faces: ApertureCellFace[] = [];
  faces.push({ n: [0, 0, -1], d: c[2], wall: true, g: null });
  faces.push({ n: [0, 0, 1], d: H - c[2], wall: true, g: null });
  for (let i = 0; i < wedgeOf.length; i += 1) {
    const a = rimXY[i];
    const b = rimXY[i + 1];
    const chord = [b[0] - a[0], b[1] - a[1]];
    let n: V3 = [chord[1], -chord[0], 0];
    const nn = Math.hypot(n[0], n[1]);
    n = [n[0] / nn, n[1] / nn, 0];
    const mid = [(a[0] + b[0]) / 2 - 0, (a[1] + b[1]) / 2 - 0];
    if (mid[0] * n[0] + mid[1] * n[1] < 0) n = [-n[0], -n[1], 0]; // outward from the pillar
    const d = (a[0] - c[0]) * n[0] + (a[1] - c[1]) * n[1];
    faces.push({ n, d, wall: true, g: null });
  }
  // the SEAM PORTAL PAIR — bounded quads; g = rotation about the pillar by
  // ± the material span (the holonomy; det +1: a cone is never a mirror)
  const seamFace = (angle: number, len: number, outwardSign: 1 | -1, gTheta: number): ApertureCellFace => {
    const ur: V3 = [Math.cos(angle), Math.sin(angle), 0];
    const n: V3 = outwardSign > 0 ? [-ur[1], ur[0], 0] : [ur[1], -ur[0], 0];
    const d = pillarXY[0] * n[0] + pillarXY[1] * n[1];
    const center: V3 = [pillarXY[0] + (ur[0] * len) / 2, pillarXY[1] + (ur[1] * len) / 2, H / 2 - c[2]];
    return {
      n,
      d,
      wall: false,
      g: rotZAbout(gTheta, pillarXY),
      bounds: { c: center, u: [(ur[0] * len) / 2, (ur[1] * len) / 2, 0], w: [0, 0, H / 2] },
    };
  };
  faces.push(seamFace(wallAngle[0], rimLen[0], -1, total)); // exit at Θ0 → reappear at the far end
  faces.push(seamFace(wallAngle[wallAngle.length - 1], rimLen[rimLen.length - 1], 1, -total));
  // rods: the developed edges, classes read through the SOURCE edges
  const edgeByPair = new Map<string, string>();
  for (const e of shape.edges) edgeByPair.set([...e.vertexIds].sort().join('~'), e.id);
  const srcEdge = (va: string, vb: string): string | null => edgeByPair.get([va, vb].sort().join('~')) ?? null;
  const top = (v: string): string => v.replace(/@0$/, '@1');
  const rods: ApertureCellRod[] = [];
  rods.push(rodFor(srcEdge(pillar0, pillar1), R([0, 0, 0]), R([0, 0, H])));
  for (let i = 0; i < rimXY.length; i += 1) {
    const [x, y] = rimXY[i];
    rods.push(rodFor(srcEdge(rimSrc[i], pillar0), R([x, y, 0]), R([0, 0, 0])));
    rods.push(rodFor(srcEdge(top(rimSrc[i]), pillar1), R([x, y, H]), R([0, 0, H])));
    rods.push(rodFor(srcEdge(rimSrc[i], top(rimSrc[i])), R([x, y, 0]), R([x, y, H])));
    if (i < rimXY.length - 1) {
      const [x2, y2] = rimXY[i + 1];
      rods.push(rodFor(srcEdge(rimSrc[i], rimSrc[i + 1]), R([x, y, 0]), R([x2, y2, 0])));
      rods.push(rodFor(srcEdge(top(rimSrc[i]), top(rimSrc[i + 1])), R([x, y, H]), R([x2, y2, H])));
    }
  }
  let span = 0;
  for (const axis of [0, 1, 2] as const) {
    const vals = pts.map((p) => p[axis]);
    span = Math.max(span, Math.max(...vals) - Math.min(...vals));
  }
  return { faces, rods, span, wallCount: faces.filter((f) => f.wall).length };
}

export function readCellSurface(
  domain: DomainModel | FoldedDomain,
  coneEdgesDeclared: boolean,
  /** B-114 — the room's SEALED model, when it earned one. The walk window and
   * the plate then read the same geometry; absent, everything below is the
   * committed euclidean read, byte-identical. */
  model?: ApertureModelDeck | null,
): ApertureCellSurface {
  const shape = domain.shape;
  const geometry = readSeedGeometry(shape);
  const c = geometry.cellCentroid;
  const pairings = 'folded' in domain ? domain.pairings : domain.complex.pairings;
  const gate = 'folded' in domain ? domain.gate : domain.tower.gate;
  const classOf = 'folded' in domain ? null : domain.complex.edgeClassOf;
  // the rod-class law, hoisted so both room shapes read the ONE law:
  // a multi-cell complex is PREFIXED — resolve the shape's edge id through
  // any cell's copy (the shared-wall unions make every copy one class).
  const positions = new Map(Object.values(shape.vertices).map((v) => [v.id, v.position as V3]));
  const complexEdgeId = (edgeId: string): string => {
    if ('folded' in domain || shape.cells.length === 1) return edgeId;
    const prefixed = domain.complex.originalEdges.find((e) => e.id === edgeId || e.id.endsWith(`:${edgeId}`));
    return prefixed ? prefixed.id : edgeId;
  };
  const linkOfEdge = (rawEdgeId: string): { root: string; k: number } | null => {
    const edgeId = complexEdgeId(rawEdgeId);
    if (classOf) {
      const root = classOf(edgeId);
      const link = gate.edgeLinks.find((l) => l.edgeClass === root) ?? gate.edgeLinks.find((l) => l.memberEdgeIds.includes(edgeId));
      return link ? { root: link.edgeClass, k: link.memberEdgeIds.length } : { root, k: 1 };
    }
    const link = gate.edgeLinks.find((l) => l.memberEdgeIds.includes(edgeId));
    return link ? { root: link.edgeClass, k: link.memberEdgeIds.length } : null;
  };
  const paletteOf = new Map<string, number>();
  const rodFor = (srcEdgeId: string | null, a: V3, b: V3): ApertureCellRod => {
    const link = srcEdgeId ? linkOfEdge(srcEdgeId) : null;
    const k = link ? link.k : 1;
    let palette = 0;
    if (link) {
      const seen = paletteOf.get(link.root);
      palette = seen ?? paletteOf.size % 5;
      if (seen === undefined) paletteOf.set(link.root, palette);
    }
    return { a, b, k, cls: palette, heavy: coneEdgesDeclared && k !== 4 };
  };
  // INTERIOR TRANSPORT (mothership 2026-08-21): a multi-cell room whose
  // OWNED pillar wedges sum BELOW 2π is a cone — its stored embedding smears
  // the deficit across the cells (measured: the fan's Σ=300° owned reads
  // Σ=360° embedded), so the walk-room is DEVELOPED from the records
  // instead, and the cycle-closing wall becomes the seam portal pair
  // carrying the holonomy. The union path below remains for everything the
  // developed guard measures itself out of.
  if (shape.cells.length > 1) {
    const developed = developedConeSurface(domain, rodFor);
    if (developed) return developed;
  }
  // ═══ B-114 — THE ROOM IN ITS OWN MODEL ════════════════════════════════════
  // The walk window's room, read from the SEALED realization instead of the
  // euclidean seed: the cell's corners and every face's plane come from the
  // model's projective chart, and each door carries its in-model 4×4. ⛔ This
  // is not a second euclidean room with different numbers — it is the same
  // room said in the geometry it actually has, and the plate now reads the
  // same one (that agreement is the acceptance).
  // The chart is already CENTRED: a realization is built around the model's
  // own origin (0,0,0,1), so nothing is recentred by `c` here — and nothing
  // may be, since `shiftDeckTransform` is an affine conjugation that a
  // projective door does not admit.
  if (model && model.model !== 'E3') {
    const doorByFace = new Map<string, { m: Mat4 }>();
    for (const door of model.doors) {
      doorByFace.set(door.faceA, { m: door.m });
      doorByFace.set(door.faceB, { m: door.mi });
    }
    const faces: ApertureCellFace[] = [];
    for (const face of geometry.seed.faces) {
      const plane = model.chartPlanes.get(face.id);
      // ⛔ REFUSE rather than fall back to the euclidean plane for one face:
      // a room whose walls come from two different geometries is a room whose
      // edge is in the wrong place, and nothing downstream would say so.
      if (!plane) return readCellSurface(domain, coneEdgesDeclared);
      const door = doorByFace.get(face.id);
      faces.push(
        door
          ? { n: plane.n, d: plane.d, wall: false, g: null, g4: door.m }
          : { n: plane.n, d: plane.d, wall: true, g: null },
      );
    }
    const rods: ApertureCellRod[] = [];
    for (const edge of shape.edges) {
      const qa = model.chartVertices.get(edge.vertexIds[0]);
      const qb = model.chartVertices.get(edge.vertexIds[1]);
      if (!qa || !qb) continue;
      rods.push(rodFor(edge.id, qa, qb));
    }
    let span = 0;
    for (const q of model.chartVertices.values()) span = Math.max(span, 2 * Math.max(Math.abs(q[0]), Math.abs(q[1]), Math.abs(q[2])));
    return { faces, rods, span, wallCount: faces.filter((f) => f.wall).length, model: model.model };
  }
  // THE MULTI-CELL CUT: the room's walk-region is the UNION of the cells —
  // a face owned by TWO cells is INTERIOR (the region spans it; it is not an
  // exit and never enters the surface); the boundary faces (one owner) carry
  // the portal/wall verdict exactly as before. On an embedded product the
  // charts coincide, so interior pairings fit identity — geometrically true
  // ⛔ AND NOW GUARDED (the F.0-era comment stated this precondition without
  // writing it): the developed path above measures Σ(owned wedges) and takes
  // every under-2π cone; only genuinely-flat products (Σ ≈ 2π — the charts
  // really do coincide) reach this union path.
  const interiorFaceIds = new Set<string>();
  {
    const ownersCount = new Map<string, number>();
    for (const cell of shape.cells)
      for (const faceId of cell.faceIds) ownersCount.set(faceId, (ownersCount.get(faceId) ?? 0) + 1);
    for (const [faceId, count] of ownersCount) if (count === 2) interiorFaceIds.add(faceId);
  }
  const stripId = (id: string): string => id.replace(/^c\d+:/, '');
  const deck = deckOf(shape, surfacePairingsOf(shape, pairings));
  const near = (u: V3, w: V3): boolean => Math.hypot(u[0] - w[0], u[1] - w[1], u[2] - w[2]) < 1e-5;
  // per surface FACE: portal (its deck transform, recentered) or wall. On a
  // convex cell every face owns a unique OUTWARD normal, so the normal alone
  // identifies the deck entry (nA/nB are the pairing's own outward normals).
  const faces: ApertureCellFace[] = geometry.seed.faces
    .filter((face) => !interiorFaceIds.has(stripId(face.id)))
    .map((face) => {
      const fc = sub(geometry.faceCentroid(face.id), c);
      const n = norm(fc);
      const d = dot(fc, n);
      for (const entry of deck) {
        if (near(entry.nA, n)) return { n, d, wall: false, g: shiftDeckTransform(entry.g, c) };
        if (near(entry.nB, n)) return { n, d, wall: false, g: shiftDeckTransform(entry.gi, c) };
      }
      return { n, d, wall: true, g: null };
    });
  // per seed EDGE: the rod through the hoisted class law (one law, both rooms)
  const rods: ApertureCellRod[] = [];
  for (const edge of shape.edges) {
    const qa = positions.get(edge.vertexIds[0]);
    const qb = positions.get(edge.vertexIds[1]);
    if (!qa || !qb) continue;
    rods.push(rodFor(edge.id, sub(qa, c), sub(qb, c)));
  }
  const span = Math.max(
    geometry.bboxHi[0] - geometry.bboxLo[0],
    geometry.bboxHi[1] - geometry.bboxLo[1],
    geometry.bboxHi[2] - geometry.bboxLo[2],
  );
  return { faces, rods, span, wallCount: faces.filter((f) => f.wall).length };
}

// ---------------------------------------------------------------------------
// THE GATE (mandate §1 ⛔ / §8): cannot hand a real deck group + ambient
// ⇒ DRAW NOTHING, SAY SO.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// THE MODEL AT THE DOOR (B-113) — the sealed realization, widened into the
// exact shape the tracer consumes: doors carrying a 4×4 and their CHART
// planes. A committed euclidean deck becomes the E³ instance of this same
// structure, so there is ONE transport below and not two.
// ---------------------------------------------------------------------------

/** What the RAY needs of a door: the map and the two chart planes. The tracer
 * synthesises one of these from a committed euclidean deck, which carries no
 * face ids — so the ids live on the model's own door type below rather than
 * being faked here as empty strings. */
export interface ApertureRayDoor {
  m: Mat4; // the in-model isometry carrying faceA onto faceB
  mi: Mat4;
  nA: V3; // faceA's plane IN THE CHART: {k : k·n̂ = d}
  dA: number;
  nB: V3;
  dB: number;
}

export interface ApertureModelDoor extends ApertureRayDoor {
  faceA: string; // the CARRIED face ids — the door's identity, never a position
  faceB: string;
}

export interface ApertureModelDeck {
  model: 'E3' | 'S3' | 'H3'; // CARRIED from the seal — never re-inferred here
  doors: ApertureModelDoor[];
  inradius: number | null;
  edgeClassSize: number | null;
  /** the cell's own corners in the chart — the scaffold the person actually
   * stands among, which in a curved model is NOT the seed's euclidean cell */
  chartVertices: Map<string, V3>;
  /** EVERY face's chart plane, keyed by the shape's own face id — walls
   * included. ⛔ The doors alone are not enough: an unpaired face is the
   * person's boundary and the room still has to know where it is, and a wall
   * read from the euclidean seed while its neighbours came from the model
   * would put the room's edge in the wrong place. */
  chartPlanes: Map<string, { n: V3; d: number }>;
  /** THE FURNITURE'S SCALE — craft, never geometry. The realized cell is a
   * different SIZE from the seed's euclidean cell (Seifert–Weber: chart
   * inradius tanh(0.99638) = 0.760 against the seed dodecahedron's 1.114;
   * Poincaré: tan(0.31416) = 0.325), so furniture built for the seed would
   * float outside the room or rattle around inside it. This is the ratio of
   * the two inradii, applied to WHAT STANDS IN the room — the walls, the
   * corners and the transport are untouched by it. */
  sceneScale: number;
}

/** the committed 12-float affine isometry, widened to the 4×4 whose bottom
 * row is (0,0,0,1) — the SAME map, said in the type the model needs */
const affine4 = (g: DeckTransform): Mat4 => [
  g[0], g[1], g[2], g[9],
  g[3], g[4], g[5], g[10],
  g[6], g[7], g[8], g[11],
  0, 0, 0, 1,
];

export function apertureModelDeckOf(seal: SealedRealization, euclideanDeck: DeckEntry[]): ApertureModelDeck {
  const model = seal.geometry;
  const doors: ApertureModelDoor[] = seal.deck.entries.map((entry) => {
    const A = chartPlaneOf(model, entry.uA);
    const B = chartPlaneOf(model, entry.uB);
    return {
      faceA: entry.faceA,
      faceB: entry.faceB,
      m: entry.m,
      mi: matrixInverse4(entry.m),
      nA: A.n as V3,
      dA: A.d,
      nB: B.n as V3,
      dB: B.d,
    };
  });
  const chartVertices = new Map<string, V3>();
  for (const [id, x] of seal.realization.vertexPositions) chartVertices.set(id, chartOf(x) as V3);
  const chartPlanes = new Map<string, { n: V3; d: number }>();
  for (const [id, u] of seal.realization.faceCovectors) {
    const plane = chartPlaneOf(model, u);
    chartPlanes.set(id, { n: plane.n as V3, d: plane.d });
  }
  const minAbs = (xs: number[]): number => xs.reduce((m, x) => Math.min(m, Math.abs(x)), Infinity);
  const chartInradius = minAbs(doors.flatMap((d) => [d.dA, d.dB]));
  const seedInradius = minAbs(euclideanDeck.flatMap((d) => [d.dA, d.dB]));
  const sceneScale = Number.isFinite(chartInradius) && Number.isFinite(seedInradius) && seedInradius > 1e-9
    ? chartInradius / seedInradius
    : 1;
  return { model, doors, inradius: seal.inradius, edgeClassSize: seal.edgeClassSize, chartVertices, chartPlanes, sceneScale };
}

export type ApertureGate =
  | {
      ok: true;
      deck: DeckEntry[];
      geometry: ApertureGeometry | FoldedApertureGeometry;
      /** B-113 — THE CURVED TRANSPORT the render is to use, when the domain
       * earned one. ⛔ `null` AT E³ ON PURPOSE, and this is not an omission:
       * at E³ the sealed map and the committed deck fit are THE SAME MAP, and
       * where they are the same the committed one stands — two producers for
       * one fact is how a render starts drifting from its own witnesses. The
       * CLASS is still carried, in `seal`, whatever the render does. */
      model: ApertureModelDeck | null;
      /** the class the domain EARNED (constructed, then proven by the fit, by
       * every door's witnessed isometry, and by the closure walk) — carried,
       * never re-inferred downstream. `null` = no realization closed. */
      seal: { geometry: 'E3' | 'S3' | 'H3'; inradius: number | null; edgeClassSize: number | null; closureWorstRad: number } | null;
      /** why no seal, when there is none — named, never silent */
      modelRefusal: string | null;
    }
  | { ok: false; reason: string };

export function buildAperture(domain: DomainModel | FoldedDomain, lineage?: ConeLineage): ApertureGate {
  // 0.2 — THE BOUNDARY: this branch keys on FOLDED, never on !sound. The 336
  // unsound-but-NOT-folded patterns (pinches, bad links) are not orbifolds and
  // stay refused below by the S² gate's own words. An orbifold is a legitimate
  // object; a pinch is not — the gate already distinguishes them, and this
  // door inherits that distinction rather than routing around it.
  if ('folded' in domain) {
    const geometry = geometryFromFoldedGate(domain.gate);
    try {
      const deck = deckOf(domain.shape, domain.pairings);
      // a FOLDED body is an orbifold, not a manifold — the seal's three
      // proofs are written for a deck group and say nothing here. No model,
      // and the reason is the object's own kind, not a failure.
      return { ok: true, deck, geometry, model: null, seal: null, modelRefusal: 'a folded body is an orbifold — the seal realizes deck groups, and this is not one' };
    } catch (error) {
      return { ok: false, reason: `the deck fit refused: ${(error as Error).message} — nothing is drawn.` };
    }
  }
  const tower = domain.tower;
  if (!tower.sound) {
    const failures = tower.gate.failures ?? [];
    // the failure record NAMES what failed (kind · clause · the class) — say it verbatim
    const first = failures.length > 0 ? JSON.stringify(failures[0]) : 'link failure';
    return {
      ok: false,
      reason: `S² gate: NOT sound (${first}) — no deck group exists behind this pattern; nothing is drawn.`,
    };
  }
  // B.0 THE HONEST DOOR: the kind!=='E3' refusal is DELETED — a sound form
  // draws regardless of k. The cell-local face-map step (p←g(p), v←R·v) IS the
  // geodesic flow on a Euclidean cone-manifold, ratified; the transport is
  // unchanged. (Unsound/folded forms stay refused ABOVE — that gate is 0.2's,
  // not B.0's.)
  // step 8: the cone census reads the ONE seam — measured when the seed is a
  // dihedral-owning thicken product with its base in hand, k×90° otherwise
  const geometry = geometryFromTower(tower, resolveConeAngleSource(domain, lineage));
  // THE MULTI-CELL CUT: the deck is the room's DOORS — interior shared walls
  // (spanned by the region, no transport) are excluded; the witnessed fit
  // rightly refuses them and a bounded chamber may be legitimately deckless.
  const pairings = surfacePairingsOf(domain.shape, domain.complex.pairings);
  try {
    const deck = deckOf(domain.shape, pairings);
    // B-113 THE SEAL: the domain is offered a realization in its OWN geometry
    // and either earns it (constructed, then proven by the fit, the witnessed
    // door isometries and the closure walk) or is refused BY NAME. Nothing is
    // inferred from k here — see `sealDomainRealization`'s own header, which
    // is where the distinction from B.0's killed classifier is written down.
    const sealed = sealDomainRealization(domain);
    if (!sealed.sealed) return { ok: true, deck, geometry, model: null, seal: null, modelRefusal: sealed.reason };
    const seal = {
      geometry: sealed.seal.geometry,
      inradius: sealed.seal.inradius,
      edgeClassSize: sealed.seal.edgeClassSize,
      closureWorstRad: sealed.seal.closureWorstRad,
    };
    // ⛔ AT E³ THE MODEL CHANGES NOTHING, SO IT IS NOTHING. The seal's own
    // isometries and the committed deck fit are the same rigid maps of the
    // same cell; handing the render a second copy of a map it already has
    // would move every flat form's buffers in the last ulp and buy nothing.
    // The CLASS is carried regardless — that is what `seal` is for.
    if (seal.geometry === 'E3') return { ok: true, deck, geometry, model: null, seal, modelRefusal: null };
    try {
      return { ok: true, deck, geometry, model: apertureModelDeckOf(sealed.seal, deck), seal, modelRefusal: null };
    } catch (error) {
      // a seal that cannot be put in the chart is not a transport — say so,
      // and keep the class that WAS proven
      return { ok: true, deck, geometry, model: null, seal, modelRefusal: (error as Error).message };
    }
  } catch (error) {
    return { ok: false, reason: `the deck fit refused: ${(error as Error).message} — nothing is drawn.` };
  }
}

// ---------------------------------------------------------------------------
// THE ROOM — default inhabitants (furniture, not engine forms) + the person's form
// ---------------------------------------------------------------------------

// THE PROBES (2026-07-14): the coil and its axis are RETIRED — a face is
// bilaterally symmetric and can never carry chirality, so the HAND does
// (the Capitolini pointing hand; mirror-IoU 0.081 — a LEFT hand is
// unmistakable). The mask does recurrence + the corridors. Two jobs,
// genuinely two.
export const APERTURE_MATERIALS = {
  MASK: 0,
  HAND: 1,
  SCAFFOLD: 3,
  FORM: 4,
} as const;

export interface TriMesh {
  positions: V3[];
  tris: [number, number, number][];
  material: number;
}

export interface Capsule {
  a: V3;
  b: V3;
  r: number;
  material: number;
}

// (THE PROBES, 2026-07-14: `buildMaskMesh` — the modelled stand-in — and
// `buildCoilCapsules` — the coil — are RETIRED. The room's probes are the
// REAL SCANS, mounted in `apertureProbes.ts` and injected into
// `buildApertureScene` — the mask held in a hand.)

/** The person's own form, placed in the room: any positioned, faced Shape, fan-triangulated. */
export function meshFromShape(shape: Shape, center: V3, maxSize: number): TriMesh | null {
  const vertices = Object.values(shape.vertices);
  if (vertices.length === 0 || shape.faces.length === 0) return null;
  if (vertices.some((v) => !v.position)) return null; // a positionless form has no body to place
  const indexOf = new Map(vertices.map((v, i) => [v.id, i]));
  let P: V3[] = vertices.map((v) => v.position as V3);
  const lo: V3 = [Infinity, Infinity, Infinity];
  const hi: V3 = [-Infinity, -Infinity, -Infinity];
  for (const p of P)
    for (let k = 0; k < 3; k += 1) {
      lo[k] = Math.min(lo[k], p[k]);
      hi[k] = Math.max(hi[k], p[k]);
    }
  const c: V3 = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
  const span = Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) || 1;
  const s = maxSize / span;
  P = P.map((p) => add(mulS(sub(p, c), s), center));
  const tris: [number, number, number][] = [];
  for (const face of shape.faces) {
    const ids = face.vertexIds.map((id) => indexOf.get(id));
    if (ids.some((i) => i === undefined)) continue;
    for (let i = 1; i + 1 < ids.length; i += 1) {
      tris.push([ids[0] as number, ids[i] as number, ids[i + 1] as number]);
    }
  }
  if (tris.length === 0) return null;
  return { positions: P, tris, material: APERTURE_MATERIALS.FORM };
}

export interface ApertureScene {
  meshes: TriMesh[];
  capsules: Capsule[];
  rods: [V3, V3][]; // the domain's own edges — faint scaffolding at most
  rodRadius: number;
}

/** The scene is built ONCE — no copy of any object is ever materialized.
 * THE PROBES (2026-07-14) are INJECTED (the real scans, mounted in
 * apertureProbes.ts): the mask's two shells + the pointing hand.
 *
 * B-113 — `model` is the room the person is actually standing in. When a
 * domain has SEALED a realization, the cell's corners are the model's
 * (in the projective chart), not the seed's euclidean ones, and the
 * furniture is scaled to that room. ⛔ The scaling touches the SCENE only:
 * the walls, the doors and the transport never see it, so no scene knob can
 * move a copy — the committed law. Absent `model` = the committed path,
 * byte-identical. */
export function buildApertureScene(
  seedShape: Shape,
  placedShape: Shape | null,
  probes: TriMesh[],
  model?: ApertureModelDeck | null,
): ApertureScene {
  const s = model ? model.sceneScale : 1;
  const scaleMesh = (mesh: TriMesh): TriMesh =>
    s === 1 ? mesh : { ...mesh, positions: mesh.positions.map((p) => mulS(p, s)) };
  const meshes: TriMesh[] = probes.map(scaleMesh);
  if (placedShape) {
    const placed = meshFromShape(placedShape, [0.30 * s, 0.27 * s, -0.10 * s], 0.42 * s);
    if (placed) meshes.push(placed);
  }
  const positions = model
    ? model.chartVertices
    : new Map(Object.values(seedShape.vertices).map((v) => [v.id, v.position as V3]));
  const rods: [V3, V3][] = shapeEdges(seedShape)
    .filter(([a, b]) => positions.has(a) && positions.has(b))
    .map(([a, b]) => [positions.get(a) as V3, positions.get(b) as V3]);
  return { meshes, capsules: [], rods, rodRadius: 0.011 * s };
}

/** Where the eye stands, in the room it is actually in. The committed frame
 * was tuned inside the seed's euclidean cell; a sealed room is a different
 * size, and an eye left at the euclidean coordinate would be standing
 * OUTSIDE a Poincaré cell (chart inradius 0.325 against the seed's 1.114) —
 * the same relative place in the room is the honest carry. */
export const apertureEyeFor = (model: ApertureModelDeck | null | undefined, eye: V3): V3 =>
  model && model.sceneScale !== 1 ? mulS(eye, model.sceneScale) : eye;

function shapeEdges(shape: Shape): [string, string][] {
  return shape.edges.map((e) => [e.vertexIds[0], e.vertexIds[1]]);
}

// ---------------------------------------------------------------------------
// the tracer — IMAGE-SPACE, transported by the engine's own gluing isometries
// ---------------------------------------------------------------------------

export interface ApertureCraft {
  level: number; // transport depth (bounded — linear, never an orbit enumeration)
  toneGamma: number; // tone curve
  contourWeight: number; // silhouette-edge darkening
  // NO echoFade here (THE INK re-cut, 2026-07-14): the echo fade lives in ONE
  // place — the ink, applied to the MARKS. value carries darkness only.
  maskTone: number;
  handTone: number; // THE PROBES: the hand replaced the retired coil
  scaffoldTone: number;
  formTone: number;
}

export const APERTURE_CRAFT_DEFAULTS: ApertureCraft = {
  level: 6,
  toneGamma: 1.25,
  contourWeight: 0.55,
  maskTone: 1.0,
  handTone: 0.92,
  scaffoldTone: 0.28,
  formTone: 0.95,
};

export interface ApertureTraceCounts {
  transports: number; // Clause 1: the image-space transport RAN
  litPixels: number;
  lostRays: number;
  // THE PROBES (2026-07-14): the mask counts RECURRENCE only — a face is
  // bilaterally symmetric and carries no chirality, so there is NO mask
  // mirrored-count (a mask-based chirality counter would be true for one map
  // and false for the next: a lie in general). THE HAND is the only
  // chirality counter.
  maskCopiesVisible: number;
  handCopiesVisible: number;
  handCopiesMirrored: number; // "N of the M hands you can see are LEFT — count them"
  formCopiesVisible: number;
  formCopiesMirrored: number;
  minCopyPixels: number;
}

export interface ApertureTrace {
  width: number;
  height: number;
  hit: Uint8Array; // 0 none · 1 object · 2 scaffold
  value: Float32Array; // shaded tone 0..1 (post craft)
  echo: Uint8Array; // transports before the hit
  mirrored: Int8Array; // sign of det(accumulated word) at the hit
  material: Int8Array;
  // THE INK (2026-07-14, additive): accumulated ray travel at the hit
  // (transport legs summed + the final segment) — the contour's fold detector
  // (a near copy crossing a far one is a depth discontinuity, not a hit/material one)
  depth: Float32Array;
  // THE PROBES (2026-07-14, additive): the shading normal at the hit — a hand
  // is nothing but creases: the gaps between fingers are SHALLOW depth steps
  // but SHARP normal steps; without this the hand renders as a mitten.
  normal: Float32Array; // 3 × W×H
  // THE INSIDE-VIEW HATCH (2026-08-08, additive): the OBJECT-SPACE hit point.
  // The scene is built ONCE in the seed frame and the ray is TRANSPORTED into
  // it, so at the hit `p + v·t` IS the seed-frame coordinate — the
  // surface-locked hatch's phase source (strokes ride the surface, never the
  // screen). Storing it materialises NO copy (the ⛔ NEVER OBJECT-SPACE law
  // forbids copying scene objects, not recording where a ray landed).
  objPos: Float32Array; // 3 × W×H
  // …and the grazing scalar |n·v| at the hit (already computed for the
  // contour term) — the hatch's density source (dense edge-on, sparse face-on)
  facing: Float32Array;
  counts: ApertureTraceCounts;
}

interface BvhNode {
  lo: V3;
  hi: V3;
  l: number;
  r: number;
  s: number;
  e: number;
}

function buildBvh(mesh: TriMesh): { nodes: BvhNode[]; order: number[] } {
  const nodes: BvhNode[] = [];
  const order = mesh.tris.map((_, i) => i);
  const triBox = (i: number): { lo: V3; hi: V3 } => {
    const t = mesh.tris[i];
    const lo: V3 = [Infinity, Infinity, Infinity];
    const hi: V3 = [-Infinity, -Infinity, -Infinity];
    for (const v of t)
      for (let k = 0; k < 3; k += 1) {
        lo[k] = Math.min(lo[k], mesh.positions[v][k]);
        hi[k] = Math.max(hi[k], mesh.positions[v][k]);
      }
    return { lo, hi };
  };
  const build = (s: number, e: number): number => {
    const lo: V3 = [Infinity, Infinity, Infinity];
    const hi: V3 = [-Infinity, -Infinity, -Infinity];
    for (let i = s; i < e; i += 1) {
      const b = triBox(order[i]);
      for (let k = 0; k < 3; k += 1) {
        lo[k] = Math.min(lo[k], b.lo[k]);
        hi[k] = Math.max(hi[k], b.hi[k]);
      }
    }
    const id = nodes.length;
    nodes.push({ lo, hi, l: -1, r: -1, s, e });
    if (e - s <= 6) return id;
    const ax = [0, 1, 2].reduce((a, k) => (hi[k] - lo[k] > hi[a] - lo[a] ? k : a), 0);
    const seg = order.slice(s, e).sort((a, b) => {
      const A = triBox(a);
      const B = triBox(b);
      return A.lo[ax] + A.hi[ax] - (B.lo[ax] + B.hi[ax]);
    });
    for (let i = 0; i < seg.length; i += 1) order[s + i] = seg[i];
    const m = (s + e) >> 1;
    nodes[id].l = build(s, m);
    nodes[id].r = build(m, e);
    nodes[id].s = -1;
    nodes[id].e = -1;
    return id;
  };
  if (order.length > 0) build(0, order.length);
  return { nodes, order };
}

// THE PROBES (2026-07-14): the real scans carry ~522k triangles — the BVH is
// built ONCE per mesh and cached (pure derivation of the mesh; the scene is
// still never copied).
const bvhCache = new WeakMap<TriMesh, { nodes: BvhNode[]; order: number[] }>();
const bvhOf = (mesh: TriMesh): { nodes: BvhNode[]; order: number[] } => {
  let cached = bvhCache.get(mesh);
  if (!cached) {
    cached = buildBvh(mesh);
    bvhCache.set(mesh, cached);
  }
  return cached;
};

export function traceAperture(options: {
  deck: DeckEntry[];
  scene: ApertureScene;
  /** B-113 — the sealed model. Absent = E³, and the committed euclidean deck
   * becomes the E³ instance of the very same structure. */
  model?: ApertureModelDeck | null;
  width?: number;
  height?: number;
  craft?: Partial<ApertureCraft>;
  eye?: V3;
  forward?: V3;
  fovDegrees?: number;
  minCopyPixels?: number;
}): ApertureTrace {
  const W = options.width ?? 168;
  const H = options.height ?? 168;
  const craft: ApertureCraft = { ...APERTURE_CRAFT_DEFAULTS, ...(options.craft ?? {}) };
  const LEVEL = Math.max(0, Math.round(craft.level));
  const scene = options.scene;
  // ═══ THE MODEL ENTERS THE RENDER (B-113) ══════════════════════════════════
  // ADR 0004's own correction, quoted: *"in H³ use the KLEIN model, in which
  // rays ARE STRAIGHT."* That is the whole architecture. In the projective
  // chart (divide the model 4-vector by its fourth component) a geodesic is a
  // straight line and a face plane is a flat plane IN EVERY MODEL, so the
  // exit-plane solve and the BVH mesh test below are UNCHANGED — the same
  // lines of code serve E³, S³ and H³. What the model changes is exactly two
  // things, and they are the two the ADR named:
  //   · THE TRANSPORT — a projective 4×4, no longer an affine 12-float. On an
  //     affine matrix `pushChartRay` reduces to applyPoint/applyVector
  //     exactly, so the committed euclidean render is not a branch beside
  //     this one; it IS this one, at E³.
  //   · THE METRE — chart length is not distance. In H³ the chart saturates
  //     at the Klein boundary while true distance runs to infinity, and
  //     distance is what `depth` carries and the ink fades on.
  // ⛔ WHAT IT DOES NOT CHANGE, said plainly rather than implied: the SHADING
  // is chart-space Lambert + contour, exactly as committed. A curved-space
  // radiance model is not built and is not claimed — the geometry (where the
  // copies are and how big they are) is the model's; the tone is the craft's.
  const model: 'E3' | 'S3' | 'H3' = options.model ? options.model.model : 'E3';
  const doors: ApertureRayDoor[] = options.model
    ? options.model.doors
    : options.deck.map((d) => ({ m: affine4(d.g), mi: affine4(d.gi), nA: d.nA, dA: d.dA, nB: d.nB, dB: d.dB }));
  // the leg's length in the MODEL. ⚠ In E³ the chart parameter already IS
  // arclength (v is a unit chart vector), so the committed path returns `t`
  // itself rather than re-deriving it through a hypot — same number, and the
  // ink's fade does not move by a last-ulp difference nobody asked for.
  const legLength = (t: number, from: V3, to: V3): number =>
    model === 'E3' ? t : chartDistance(model, from as Chart3, to as Chart3);
  const minCopyPixels = options.minCopyPixels ?? Math.max(18, Math.round((W * H) / 900));

  // THE PROBES (2026-07-14): the default frame looks down the diagonal so the
  // x-corridor's odd-word copies are IN VIEW — the FLIP's reflected generator
  // lives on x, and a frame that hides odd-x copies hides every LEFT hand
  // (measured: the old frame showed 0 of 6 LEFT on the reflected space).
  const eye: V3 = apertureEyeFor(options.model, options.eye ?? [-0.38, -0.3, -0.05]);
  const fwd = norm(options.forward ?? [0.8, 0.55, 0.12]);
  const right = norm(cross(fwd, [0, 0, 1]));
  const up = cross(right, fwd);
  const FOV = ((options.fovDegrees ?? 80) * Math.PI) / 180;
  const FL = H / 2 / Math.tan(FOV / 2);
  const keyLight = norm([-0.38, -0.62, 0.66]);

  const bvhs = scene.meshes.map((mesh) => ({ mesh, bvh: bvhOf(mesh) }));

  const hit = new Uint8Array(W * H);
  const value = new Float32Array(W * H);
  const echoBuf = new Uint8Array(W * H);
  const mirrored = new Int8Array(W * H);
  const material = new Int8Array(W * H);
  const depth = new Float32Array(W * H);
  const normal = new Float32Array(3 * W * H);
  const objPos = new Float32Array(3 * W * H);
  const facingBuf = new Float32Array(W * H);

  let transports = 0;
  let litPixels = 0;
  let lostRays = 0;
  const copyWords = new Map<number, Map<string, { pixels: number; det: number }>>();
  const wordKey = (g: Mat4): string => g.map((x) => (Math.abs(x) < 1e-6 ? 0 : x).toFixed(3)).join(',');
  // the orientation mark reads det of the 4×4 — on an affine door that is the
  // committed deckDet of its 3×3 block (the bottom row is (0,0,0,1)), so the
  // mirrored count is the same number it has always been; on a curved door it
  // is the only reading that means anything.
  const recordCopy = (mat: number, g: Mat4): void => {
    let words = copyWords.get(mat);
    if (!words) {
      words = new Map();
      copyWords.set(mat, words);
    }
    const key = wordKey(g);
    const entry = words.get(key);
    if (entry) entry.pixels += 1;
    else words.set(key, { pixels: 1, det: mat4Det(g) < 0 ? -1 : 1 });
  };

  const hitMesh = (
    entry: { mesh: TriMesh; bvh: { nodes: BvhNode[]; order: number[] } },
    o: V3,
    d: V3,
    tmax: number,
  ): { t: number; n: V3 } | null => {
    const { mesh, bvh } = entry;
    if (bvh.nodes.length === 0) return null;
    let best = tmax;
    let bn: V3 | null = null;
    const stack = [0];
    while (stack.length > 0) {
      const node = bvh.nodes[stack.pop() as number];
      let t0 = 1e-4;
      let t1 = best;
      let out = false;
      for (let k = 0; k < 3; k += 1) {
        const inv = 1 / (d[k] || 1e-12);
        let a = (node.lo[k] - o[k]) * inv;
        let b = (node.hi[k] - o[k]) * inv;
        if (a > b) {
          const s = a;
          a = b;
          b = s;
        }
        t0 = Math.max(t0, a);
        t1 = Math.min(t1, b);
        if (t0 > t1) {
          out = true;
          break;
        }
      }
      if (out) continue;
      if (node.s >= 0) {
        for (let i = node.s; i < node.e; i += 1) {
          const tri = mesh.tris[bvh.order[i]];
          const a = mesh.positions[tri[0]];
          const b = mesh.positions[tri[1]];
          const c = mesh.positions[tri[2]];
          const e1 = sub(b, a);
          const e2 = sub(c, a);
          const pv = cross(d, e2);
          const det = dot(e1, pv);
          if (Math.abs(det) < 1e-10) continue;
          const inv = 1 / det;
          const tv = sub(o, a);
          const u = dot(tv, pv) * inv;
          if (u < 0 || u > 1) continue;
          const qv = cross(tv, e1);
          const vv = dot(d, qv) * inv;
          if (vv < 0 || u + vv > 1) continue;
          const tt = dot(e2, qv) * inv;
          if (tt > 1e-4 && tt < best) {
            best = tt;
            bn = norm(cross(e1, e2));
          }
        }
      } else {
        stack.push(node.l);
        stack.push(node.r);
      }
    }
    return bn ? { t: best, n: bn } : null;
  };

  const hitCapsule = (c: Capsule, o: V3, d: V3, tmax: number): { t: number; n: V3 } | null => {
    const ba = sub(c.b, c.a);
    const oa = sub(o, c.a);
    const bb = dot(ba, ba);
    const bd = dot(ba, d);
    const bo = dot(ba, oa);
    const A = dot(d, d) - (bd * bd) / bb;
    const B = 2 * (dot(d, oa) - (bd * bo) / bb);
    const C = dot(oa, oa) - (bo * bo) / bb - c.r * c.r;
    const D = B * B - 4 * A * C;
    if (D < 0 || Math.abs(A) < 1e-12) return null;
    const t = (-B - Math.sqrt(D)) / (2 * A);
    if (t < 1e-4 || t >= tmax) return null;
    const p = add(o, mulS(d, t));
    const h = dot(sub(p, c.a), ba) / bb;
    if (h < 0 || h > 1) return null;
    return { t, n: norm(sub(p, add(c.a, mulS(ba, h)))) };
  };

  const hitRod = (rod: [V3, V3], o: V3, d: V3, tmax: number): { t: number; n: V3 } | null =>
    hitCapsule({ a: rod[0], b: rod[1], r: scene.rodRadius, material: APERTURE_MATERIALS.SCAFFOLD }, o, d, tmax);

  for (let py = 0; py < H; py += 1) {
    for (let px = 0; px < W; px += 1) {
      let p: V3 = [eye[0], eye[1], eye[2]];
      let v: V3 = norm(add(add(mulS(fwd, FL), mulS(right, px - W / 2 + 0.5)), mulS(up, -(py - H / 2 + 0.5))));
      let g: Mat4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; // the accumulated deck word
      let echo = 0;
      let travel = 0;
      for (let step = 0; step <= LEVEL; step += 1) {
        // the exit face of Δ along the ray
        let tExit = Infinity;
        let exitPair = -1;
        let exitSide = 0;
        for (let k = 0; k < doors.length; k += 1) {
          const d0 = doors[k];
          const planes: [V3, number, number][] = [
            [d0.nA, d0.dA, 0],
            [d0.nB, d0.dB, 1],
          ];
          for (const [n, dd, side] of planes) {
            const den = dot(v, n);
            if (den <= 1e-9) continue;
            const t = (dd - dot(p, n)) / den;
            if (t > 1e-5 && t < tExit) {
              tExit = t;
              exitPair = k;
              exitSide = side;
            }
          }
        }
        // the scene, capped at the exit
        let best: { t: number; n: V3; mat: number; scaffold: boolean } | null = null;
        let cap = tExit === Infinity ? 1e9 : tExit;
        for (const entry of bvhs) {
          const h = hitMesh(entry, p, v, cap);
          if (h) {
            best = { t: h.t, n: h.n, mat: entry.mesh.material, scaffold: false };
            cap = h.t;
          }
        }
        for (const c of scene.capsules) {
          const h = hitCapsule(c, p, v, cap);
          if (h) {
            best = { t: h.t, n: h.n, mat: c.material, scaffold: false };
            cap = h.t;
          }
        }
        for (const rod of scene.rods) {
          const h = hitRod(rod, p, v, cap);
          if (h) {
            best = { t: h.t, n: h.n, mat: APERTURE_MATERIALS.SCAFFOLD, scaffold: true };
            cap = h.t;
          }
        }
        if (best) {
          const idx = py * W + px;
          const lambert = Math.abs(dot(best.n, keyLight));
          const facing = Math.abs(dot(best.n, v));
          let tone = 0.14 + 0.86 * lambert;
          tone *= 1 - craft.contourWeight * (1 - facing) * (1 - facing); // contour weight — line-art rim, not photoreal light
          // THE INK re-cut (2026-07-14): NO echo fade here — value is raw
          // shading (how dark is this surface), never distance (how far is
          // this copy). DISTANCE is carried by the ink's fade, on the marks;
          // a tracer-side fade would bake "far" into "dark" and the hatch
          // would shade distance as if it were shadow.
          const objectTone =
            best.mat === APERTURE_MATERIALS.MASK
              ? craft.maskTone
              : best.mat === APERTURE_MATERIALS.HAND
                ? craft.handTone
                : best.mat === APERTURE_MATERIALS.FORM
                  ? craft.formTone
                  : craft.scaffoldTone;
          tone *= objectTone;
          tone = Math.pow(Math.max(0, Math.min(1, tone)), craft.toneGamma); // the tone curve
          const hitPoint: V3 = [p[0] + v[0] * best.t, p[1] + v[1] * best.t, p[2] + v[2] * best.t];
          hit[idx] = best.scaffold ? 2 : 1;
          value[idx] = tone;
          echoBuf[idx] = echo;
          mirrored[idx] = mat4Det(g) < 0 ? -1 : 1;
          material[idx] = best.mat;
          // the ink fades on DISTANCE, so this last leg is measured in the
          // model too — in H³ a copy four doors out is exponentially further
          // than its chart parameter says
          depth[idx] = travel + legLength(best.t, p, hitPoint);
          normal[3 * idx] = best.n[0];
          normal[3 * idx + 1] = best.n[1];
          normal[3 * idx + 2] = best.n[2];
          // THE INSIDE-VIEW HATCH: the seed-frame hit point + the grazing
          // scalar (facing computed above for the contour term) — additive
          // outputs; the transport and every count are untouched
          objPos[3 * idx] = hitPoint[0];
          objPos[3 * idx + 1] = hitPoint[1];
          objPos[3 * idx + 2] = hitPoint[2];
          facingBuf[idx] = facing;
          litPixels += 1;
          if (!best.scaffold) recordCopy(best.mat, g);
          break;
        }
        if (exitPair < 0) {
          lostRays += 1;
          break;
        }
        // no hit — TRANSPORT through the face by the engine's own gluing
        // isometry, IN THE MODEL. At E³ this is byte-for-byte the committed
        // p ← g(p), v ← R·v; at S³/H³ it is the same equation said
        // projectively (see `pushChartRay`).
        const d0 = doors[exitPair];
        const P0 = add(p, mulS(v, tExit));
        const M = exitSide === 0 ? d0.m : d0.mi;
        travel += legLength(tExit, p, P0);
        let pushed: { k: Chart3; w: Chart3 };
        try {
          pushed = pushChartRay(M, P0 as Chart3, v as Chart3);
        } catch {
          // a ray the chart cannot carry is a LOST ray, counted as one — never
          // a fabricated position that would shade as a plausible surface
          lostRays += 1;
          break;
        }
        p = pushed.k as V3;
        v = pushed.w as V3;
        g = mat4Mul(M, g);
        p = add(p, mulS(v, 1e-5));
        transports += 1;
        echo += 1;
      }
    }
  }

  const countCopies = (mat: number): { visible: number; mirroredCount: number } => {
    const words = copyWords.get(mat);
    if (!words) return { visible: 0, mirroredCount: 0 };
    const visible = [...words.values()].filter((w) => w.pixels >= minCopyPixels);
    return { visible: visible.length, mirroredCount: visible.filter((w) => w.det < 0).length };
  };
  const mask = countCopies(APERTURE_MATERIALS.MASK);
  const hand = countCopies(APERTURE_MATERIALS.HAND);
  const form = countCopies(APERTURE_MATERIALS.FORM);

  return {
    width: W,
    height: H,
    hit,
    value,
    echo: echoBuf,
    mirrored,
    material,
    depth,
    normal,
    objPos,
    facing: facingBuf,
    counts: {
      transports,
      litPixels,
      lostRays,
      maskCopiesVisible: mask.visible, // recurrence only — no mask chirality claim, ever
      handCopiesVisible: hand.visible,
      handCopiesMirrored: hand.mirroredCount,
      formCopiesVisible: form.visible,
      formCopiesMirrored: form.mirroredCount,
      minCopyPixels,
    },
  };
}

// ---------------------------------------------------------------------------
// the countable caption — copies and objects, never pixels or area
// ---------------------------------------------------------------------------

/** The class a gate carries, in the shape a caption needs it. */
export type ApertureSealedClass = { geometry: 'E3' | 'S3' | 'H3'; inradius: number | null; edgeClassSize: number | null; closureWorstRad: number };

// ═══ THE NOUN (B-114 §0 — the designer's rule and her words) ═════════════════
// ⇒ ★ EVERY WORD IN THE NOUN MUST BE TRUE OF THE GEOMETRY THE NOUN NAMES.
//   · euclidean, with real cone edges → `Euclidean cone-manifold` — `cone` is
//     TRUE there; the noun is not retired, only stopped from claiming forms it
//     does not describe;
//   · a SEALED curved realization closing at 2π → `hyperbolic manifold` (no
//     cone in H³ — the cone is the shadow's);
//   · a genuine FOLD LOCUS → `orbifold`, and its singularity is REAL.
// ⛔ THE THIRD ROW IS WHY THE RULE KEYS ON THE RIGHT FACT: a fold locus is NOT
// an artifact of the wrong geometry — it SURVIVES into the right one. So
// *"a realization exists"* and *"the singularity is an artifact"* are two
// different facts and only the second decides the word. The fold branch below
// is therefore tested FIRST and no seal can reach past it.
// ⚠ `spherical manifold` is MINE, not hers: she handed the hyperbolic word and
// the rule; a sealed S³ form is reachable today (the cube family's two uniform
// k=3 patterns) so the slot cannot stay empty, and the rule gives only one
// word that is true of S³. Named here so she can overrule one string.
// ⛔ No future tense anywhere. The noun says what IS.
const MODEL_NOUN: Record<'S3' | 'H3', string> = {
  H3: 'hyperbolic manifold',
  S3: 'spherical manifold',
};

/** ⛔ ONE PRODUCER FOR THE NOUN. The plate and the walk window read THIS —
 * two producers for one sentence is how they came to disagree about the same
 * room, which is the defect this replaces. */
export function apertureNoun(
  geometry: ApertureGeometry | FoldedApertureGeometry,
  seal: ApertureSealedClass | null,
): string {
  if (geometry.kind === 'folded') {
    // the singularity is REAL and survives every realization — no seal speaks here
    return `orbifold · n=[${geometry.n.join(',')}] · fold loci: ${geometry.foldLoci}${geometry.coneEdges ? ` · cone edges: ${geometry.coneEdges}` : ''}`;
  }
  if (seal && seal.geometry !== 'E3') {
    // her noun, verbatim: the class, the census, and the cone figures KEPT in
    // their slot — the note below says whose they are, and hiding a number the
    // engine computed would be worse than marking it
    return `${MODEL_NOUN[seal.geometry]} · n=[${geometry.n.join(',')}]${geometry.coneEdges ? ` · cone edges: ${geometry.coneEdges}` : ''}`;
  }
  return geometry.kind === 'E3'
    ? `E³ · n=[${geometry.n.join(',')}]`
    : `Euclidean cone-manifold · n=[${geometry.n.join(',')}] · cone edges: ${geometry.coneEdges}`;
}

/** THE NOTE — the instrument's register, its own line(s). Her words.
 * ⚠ THE SHADOW CLAUSE FIRES ON A FACT, not on a class: `drawnInShadow` is
 * whether the picture beside this caption is the euclidean shadow. It was
 * true everywhere when she wrote the sentence; B-114's own cut makes it false
 * for a room drawn in its sealed model, and a label that says what ISN'T is
 * exactly what her rule forbids. So her sentence goes out WHOLE when its
 * first clause is true, and her second clause goes out ALONE when only that
 * one is — not a word of hers changed, none invented. ⇒ Reported: if she
 * wants the clause unconditional, it is one line. */
export function apertureNote(
  geometry: ApertureGeometry | FoldedApertureGeometry,
  seal: ApertureSealedClass | null,
  drawnInShadow: boolean,
): string[] {
  if (geometry.kind === 'folded' || !seal || seal.geometry === 'E3') return [];
  const notes = [
    drawnInShadow
      // ⛔ MARKER S1 — TWO STRINGS, NOT ONE STRING MINUS A CLAUSE. She caught
      // what the split did to her own words: standalone, clause two says
      // *"the shadow's"* and THE SHADOW HAS NO ANTECEDENT, because the clause
      // that introduced it is the one that no longer fires.
      // ★ A clause lifted out of a sentence is not a sentence; it is a
      // fragment that happened to parse.
      // ⇒ The standalone carries `euclidean` ITSELF. ⚠ And it is ADDED here,
      // never MOVED: the whole form above is untouched, because when it fires
      // it still introduces the shadow and the pair does not repeat itself.
      ? 'drawn in the euclidean shadow — these angles are the shadow\'s, not the manifold\'s'
      : 'these angles are the euclidean shadow\'s, not the manifold\'s',
  ];
  // the excess, in the note's register, the value staying in its slot — fired
  // by the FIGURE itself (any cone angle past a full turn), never by the class
  if (geometry.coneEdges && /(\d+(?:\.\d+)?)\s*°/.test(geometry.coneEdges)) {
    const over = [...geometry.coneEdges.matchAll(/(\d+(?:\.\d+)?)\s*°/g)]
      .map((m) => Number(m[1]))
      .filter((deg) => deg > 360);
    if (over.length > 0) {
      notes.push(`${over[0]}° is more than a full turn — that excess is why it cannot be flat`);
    }
  }
  return notes;
}

export function apertureCaption(
  geometry: ApertureGeometry | FoldedApertureGeometry,
  counts: ApertureTraceCounts,
  seal?: ApertureSealedClass | null,
  drawnInShadow = false,
): string {
  // COUNTABLE, and honest about occlusion: hidden copies are omitted because
  // the person cannot SEE them — the caption counts what the eye can count.
  // The mask line carries NO chirality claim (a face is its own mirror);
  // THE HAND is the only chirality counter — and its LEFT count is w₁'s
  // caption ("the copies come back left-handed"), NEVER the fold's (0.2:
  // mirrored[] lights on sound w₁=1 forms that carry no fold at all; sealing
  // the fold on it would certify a fold in 57 manifolds that don't have one).
  const parts = [
    // B.0: the honest reading — the flat form keeps its exact caption; a cone
    // form names its cone edges (k×90°) and never a curved ambient.
    // 0.2: a FOLDED body asserts NON-FREENESS ONLY — orbifold, fold loci, and
    // its TRUE cone edges; no manifoldness word appears (that certificate is
    // the gate's, 0.3).
    // B-114: the noun is `apertureNoun`'s — ONE producer, shared with the walk
    // window, so the plate and the window cannot say different words about the
    // same room. With no seal this returns the committed strings exactly.
    apertureNoun(geometry, seal ?? null),
    // THE SCENE (designer 1810): the inhabitants are the PLAQUE (recurrence,
    // the MASK count slot) and the COIL (chirality, the HAND count slot);
    // the mirrored wording is the designer's plate's own. FEED (researcher
    // §4b): the orientation-floor wording remains her open question.
    `orbit (visible): ${counts.maskCopiesVisible} plaque${counts.maskCopiesVisible === 1 ? '' : 's'}`,
    `${counts.handCopiesMirrored} of the ${counts.handCopiesVisible} coils come back mirrored — count them`,
  ];
  if (counts.formCopiesVisible > 0) {
    parts.push(`${counts.formCopiesVisible} of the placed form${counts.formCopiesMirrored > 0 ? ` (${counts.formCopiesMirrored} mirrored)` : ''}`);
  }
  // the note keeps its OWN line — the instrument's register, never folded into
  // the noun's ` · ` run where it would read as one more countable fact
  const note = apertureNote(geometry, seal ?? null, drawnInShadow);
  return note.length > 0 ? `${parts.join(' · ')}\n${note.join(' · ')}` : parts.join(' · ');
}
