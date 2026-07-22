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
//     are genuinely indistinguishable in an empty room): a TWO-FACED MASK in
//     the middle (recurrence — a face looks back down every corridor, never a
//     blank back; its aspects tell the decks apart) and a RIGHT-HANDED COIL
//     beneath it (chirality, legible at a glance — NO arrows, NO field lines:
//     the helix, never the diagram). The person's own forms are what they ADD.
//   · COUNTABLE CAPTIONS — copies, not pixels; objects, not area. The trace
//     counts VISIBLE COPIES (distinct accumulated deck words owning at least
//     `minCopyPixels` pixels) per inhabitant, and how many come back mirrored.
//     Say ORBIT, never π₁ — a picture shows the orbit, not a group law.
//
// DERIVE-ONLY · ADDITIVE: committed modules by import (`readSeedCell`,
// `buildFormDomain`, the tower via DomainModel). worldModel / specimenModel /
// InkedDomain are BYTE-UNCHANGED — the register inversion is view-layer.

import type { Shape, Vec3 } from '../types/geometry';
import {
  flipGlueFaces,
  glueFaces,
  readSeedCell,
  type FacePairing,
  type Level3SeedCell,
} from '../lib/faceIdentification';
import { readLevel3Tower, type Level3TowerReading } from '../lib/level3Invariants';
import { bisectEdges, liftPairingsToBisected } from '../lib/level3Subdivision';
import type { Level3SoundnessReport } from '../lib/level3SoundnessGate';
import { buildFormDomain } from './formDomainModel';
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
}

export function readSeedGeometry(seedShape: Shape): SeedGeometry {
  const seed = readSeedCell(seedShape);
  const positions = new Map(Object.values(seedShape.vertices).map((v) => [v.id, v.position as V3]));
  const positionOf = (id: string): V3 => {
    const p = positions.get(id);
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
    const f = faceById.get(faceId);
    if (!f) throw new Error(`apertureModel: unknown face ${faceId}`);
    return mulS(
      f.cycle.reduce((acc, id) => add(acc, positionOf(id)), [0, 0, 0] as V3),
      1 / f.cycle.length,
    );
  };
  return { seed, positionOf, cellCentroid, bboxLo, bboxHi, faceById, faceCentroid };
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
  const { positionOf, cellCentroid, bboxLo, bboxHi, faceCentroid } = geometry;
  const fcA = faceCentroid(pairing.faceA);
  const fcB = faceCentroid(pairing.faceB);
  const correspondences: [V3, V3][] = Object.entries(pairing.map).map(([a, b]) => [positionOf(a), positionOf(b)]);
  // THE FIFTH, OFF-PLANE CONSTRAINT — inside the cell → outside past the partner:
  correspondences.push([
    add(fcA, mulS(sub(cellCentroid, fcA), 0.5)),
    add(fcB, mulS(sub(fcB, cellCentroid), 0.5)),
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
  const movedCentroid = applyPoint(g, cellCentroid);
  const inside = [0, 1, 2].every((k) => movedCentroid[k] > bboxLo[k] + 1e-9 && movedCentroid[k] < bboxHi[k] - 1e-9);
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

export function describeCandidate(candidate: ApertureMapCandidate): string {
  const corr = candidate.correspondence.map(([a, b]) => `${shortId(a)}→${shortId(b)}`).join(' · ');
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
export function dihedralMapCandidates(seedShape: Shape, faceAId: string, faceBId: string): ApertureMapCandidate[] {
  const geometry = readSeedGeometry(seedShape);
  const fA = geometry.faceById.get(faceAId);
  const fB = geometry.faceById.get(faceBId);
  if (!fA || !fB) throw new Error(`apertureModel: unknown face in pair ${faceAId} ~ ${faceBId}`);
  if (fA.cycle.length !== fB.cycle.length) {
    throw new Error(`apertureModel: faces ${faceAId} and ${faceBId} are not congruent (${fA.cycle.length} vs ${fB.cycle.length})`);
  }
  const n = fA.cycle.length;
  const candidates: ApertureMapCandidate[] = [];
  for (const dir of [1, -1] as const) {
    for (let offset = 0; offset < n; offset += 1) {
      const map: Record<string, string> = {};
      const correspondence: [string, string][] = [];
      for (let i = 0; i < n; i += 1) {
        const a = fA.cycle[i];
        const b = fB.cycle[(((offset + dir * i) % n) + n) % n];
        map[a] = b;
        correspondence.push([a, b]);
      }
      const { g, det } = fitDeckIsometry(geometry, { faceA: faceAId, faceB: faceBId, mode: 'preserving', map });
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

// ---------------------------------------------------------------------------
// THE DOOR — the person's pairing rows → a certified DomainModel
// ---------------------------------------------------------------------------

export interface AperturePairRow {
  faceA: string | null;
  faceB: string | null;
  candidateKey: string | null; // the picked MAP (never a mode)
}

/** Named, curable refusals — the door never glues a half-made pattern. */
export function aperturePairingRefusal(seedShape: Shape, rows: AperturePairRow[]): string | null {
  const seed = readSeedCell(seedShape);
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
  }
  if (completePairs === 0)
    return 'no identification yet — pick at least one pair of faces (the rest may stay open as boundary).';
  return null;
}

// THE FOLDED EDGE (ADR 0022, researcher-ruled wall — verbatim; it asserts
// EXACTLY the non-freeness and nothing more, and carries its cure):
export const foldedEdgeWall = (edgeClass: string): string =>
  `This identification is not free: it folds edge class ${edgeClass} onto its own reverse, fixing its midpoint. ` +
  `The quotient is an orbifold — it carries a fold locus — not a free-quotient manifold. ` +
  `Its invariants cannot be read on this cell structure (a folded cell has no consistent orientation); ` +
  `subdivide to resolve the fold, and the gate will read it.`;

export interface FoldedEdgeVerdict {
  folded: true;
  key: string;
  title: string;
  chi: number;
  foldedEdgeClasses: string[];
  gate: Level3SoundnessReport;
  wall: string; // the researcher-ruled wall, naming the fold locus and the cure
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
}

export function geometryFromTower(tower: DomainModel['tower']): ApertureGeometry {
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
  const uniform = interiorN.length > 0 && interiorN.every((v) => v === interiorN[0]);
  if (uniform && interiorN[0] === 4) {
    return {
      kind: 'E3',
      n,
      label: `E³ — n=[${n.join(',')}] · 2π/4 = the cube's 90° dihedral${boundary ? ` · ${boundary}` : ''}`,
      coneEdges: null,
      boundary,
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
    label: `Euclidean cone-manifold — n=[${n.join(',')}]${coneEdges ? ` · cone edges: ${coneEdges}` : ''}${boundary ? ` · ${boundary}` : ''}`,
    coneEdges,
    boundary,
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
// THE GATE (mandate §1 ⛔ / §8): cannot hand a real deck group + ambient
// ⇒ DRAW NOTHING, SAY SO.
// ---------------------------------------------------------------------------

export type ApertureGate =
  | { ok: true; deck: DeckEntry[]; geometry: ApertureGeometry | FoldedApertureGeometry }
  | { ok: false; reason: string };

export function buildAperture(domain: DomainModel | FoldedDomain): ApertureGate {
  // 0.2 — THE BOUNDARY: this branch keys on FOLDED, never on !sound. The 336
  // unsound-but-NOT-folded patterns (pinches, bad links) are not orbifolds and
  // stay refused below by the S² gate's own words. An orbifold is a legitimate
  // object; a pinch is not — the gate already distinguishes them, and this
  // door inherits that distinction rather than routing around it.
  if ('folded' in domain) {
    const geometry = geometryFromFoldedGate(domain.gate);
    try {
      const deck = deckOf(domain.shape, domain.pairings);
      return { ok: true, deck, geometry };
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
  const geometry = geometryFromTower(tower);
  const pairings = domain.complex.pairings;
  try {
    const deck = deckOf(domain.shape, pairings);
    return { ok: true, deck, geometry };
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
 * apertureProbes.ts): the mask's two shells + the pointing hand. */
export function buildApertureScene(seedShape: Shape, placedShape: Shape | null, probes: TriMesh[]): ApertureScene {
  const meshes: TriMesh[] = [...probes];
  if (placedShape) {
    const placed = meshFromShape(placedShape, [0.30, 0.27, -0.10], 0.42);
    if (placed) meshes.push(placed);
  }
  const positions = new Map(Object.values(seedShape.vertices).map((v) => [v.id, v.position as V3]));
  const rods: [V3, V3][] = shapeEdges(seedShape).map(([a, b]) => [positions.get(a) as V3, positions.get(b) as V3]);
  return { meshes, capsules: [], rods, rodRadius: 0.011 };
}

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
  const deck = options.deck;
  const scene = options.scene;
  const minCopyPixels = options.minCopyPixels ?? Math.max(18, Math.round((W * H) / 900));

  // THE PROBES (2026-07-14): the default frame looks down the diagonal so the
  // x-corridor's odd-word copies are IN VIEW — the FLIP's reflected generator
  // lives on x, and a frame that hides odd-x copies hides every LEFT hand
  // (measured: the old frame showed 0 of 6 LEFT on the reflected space).
  const eye: V3 = options.eye ?? [-0.38, -0.3, -0.05];
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

  let transports = 0;
  let litPixels = 0;
  let lostRays = 0;
  const copyWords = new Map<number, Map<string, { pixels: number; det: number }>>();
  const wordKey = (g: DeckTransform): string => g.map((x) => (Math.abs(x) < 1e-6 ? 0 : x).toFixed(3)).join(',');
  const recordCopy = (mat: number, g: DeckTransform): void => {
    let words = copyWords.get(mat);
    if (!words) {
      words = new Map();
      copyWords.set(mat, words);
    }
    const key = wordKey(g);
    const entry = words.get(key);
    if (entry) entry.pixels += 1;
    else words.set(key, { pixels: 1, det: deckDet(g) < 0 ? -1 : 1 });
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
      let g: DeckTransform = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]; // the accumulated deck word
      let echo = 0;
      let travel = 0;
      for (let step = 0; step <= LEVEL; step += 1) {
        // the exit face of Δ along the ray
        let tExit = Infinity;
        let exitPair = -1;
        let exitSide = 0;
        for (let k = 0; k < deck.length; k += 1) {
          const d0 = deck[k];
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
          hit[idx] = best.scaffold ? 2 : 1;
          value[idx] = tone;
          echoBuf[idx] = echo;
          mirrored[idx] = deckDet(g) < 0 ? -1 : 1;
          material[idx] = best.mat;
          depth[idx] = travel + best.t;
          normal[3 * idx] = best.n[0];
          normal[3 * idx + 1] = best.n[1];
          normal[3 * idx + 2] = best.n[2];
          litPixels += 1;
          if (!best.scaffold) recordCopy(best.mat, g);
          break;
        }
        if (exitPair < 0) {
          lostRays += 1;
          break;
        }
        // no hit — TRANSPORT through the face by the engine's own gluing isometry
        const d0 = deck[exitPair];
        const P0 = add(p, mulS(v, tExit));
        if (exitSide === 0) {
          p = applyPoint(d0.g, P0);
          v = applyVector(d0.g, v);
          g = deckCompose(d0.g, g);
        } else {
          p = applyPoint(d0.gi, P0);
          v = applyVector(d0.gi, v);
          g = deckCompose(d0.gi, g);
        }
        p = add(p, mulS(v, 1e-5));
        transports += 1;
        echo += 1;
        travel += tExit;
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

export function apertureCaption(geometry: ApertureGeometry | FoldedApertureGeometry, counts: ApertureTraceCounts): string {
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
    geometry.kind === 'folded'
      ? `orbifold · n=[${geometry.n.join(',')}] · fold loci: ${geometry.foldLoci}${geometry.coneEdges ? ` · cone edges: ${geometry.coneEdges}` : ''}`
      : geometry.kind === 'E3'
        ? `E³ · n=[${geometry.n.join(',')}]`
        : `Euclidean cone-manifold · n=[${geometry.n.join(',')}] · cone edges: ${geometry.coneEdges}`,
    `orbit (visible): ${counts.maskCopiesVisible} mask${counts.maskCopiesVisible === 1 ? '' : 's'}`,
    `${counts.handCopiesMirrored} of the ${counts.handCopiesVisible} hands are LEFT — count them`,
  ];
  if (counts.formCopiesVisible > 0) {
    parts.push(`${counts.formCopiesVisible} of the placed form${counts.formCopiesMirrored > 0 ? ` (${counts.formCopiesMirrored} mirrored)` : ''}`);
  }
  return parts.join(' · ');
}
