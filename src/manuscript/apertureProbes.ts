// apertureProbes — THE SCENE's inhabitants, AUTHORED (designer 2026-08-08_1810,
// superseding the scanned masks; Arman's direction — emoji-simple, drawn, not
// scanned). "Two ellipses, three arcs and a helix."
//
// WHY AUTHORED (the watermark incident, 2026-08-08): the scanned pair
// (masks_happy_and_sad) carried EMBOSSED LETTERING across both faces —
// invisible in shaded preview, faithfully inked by the honest contour. The
// authored inhabitants delete the whole defect class: no scan, no licence,
// no supply chain, no watermark possible, no pose assumption to mis-mount.
// (The 12 MB baked module apertureProbeAssets.ts is DELETED with them.)
//
// THE INHABITANTS:
//   · the JANUS PLAQUE — a standing oval shell; HAPPY face one way, SAD the
//     other. The two aspects differ by the curvature of ONE ARC (the mouth) —
//     the cheapest distinguisher and the last to die as a copy recedes. The
//     face is deliberately ASYMMETRIC (one round eye, one short stroke): a
//     mirrored face is uncanny — a second, independent orientation reading
//     beside the per-pixel hatch flip. Features are REAL OPENINGS (omitted
//     triangles — the darkSolid term stays inert; the contour draws the rims).
//   · the COIL — the right-handed helix, the chirality counter (it rides the
//     HAND material slot; a reflected return winds the other way).
//   · both STAND: a stem and a CONTACT DASH each, at a COMMON BASE — a row at
//     a common base implies a plane without asserting one; the FD floor is an
//     arbitrary cut and stays undrawn (the mothership's lattice ruling).
//
// ⛔ THE JANUS MOUNT LAW (2026-08-08, Arman's find, kept): each shell's mount
// is DERIVED from its own measured face direction (area-weighted mean
// normal → change-of-basis onto face→∓y · height→+z) — a PURE ROTATION with
// det(R) > 0 asserted. Never a pose assumption; the two faces point OUTWARD.

import { APERTURE_MATERIALS, type TriMesh } from './apertureModel';

type V3 = [number, number, number];
type Mat3 = number[]; // row-major 3×3

const det3 = (m: Mat3): number =>
  m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);

const applyR = (m: Mat3, p: V3): V3 => [
  m[0] * p[0] + m[1] * p[1] + m[2] * p[2],
  m[3] * p[0] + m[4] * p[1] + m[5] * p[2],
  m[6] * p[0] + m[7] * p[1] + m[8] * p[2],
];

interface AuthoredShell {
  positions: V3[];
  tris: [number, number, number][];
}

// ---------------------------------------------------------------------------
// THE PLAQUE FACES — authored in a scan-like frame (face bulge +z, height
// along y); the measured mount stands each up to face ∓y. Features are
// OMITTED triangles: one round eye, one stroke eye, ONE MOUTH ARC whose
// curvature is the happy/sad distinguisher.
// ---------------------------------------------------------------------------

const PLAQUE_A = 0.2; // ellipse semi-axis, width (author units)
const PLAQUE_B = 0.26; // ellipse semi-axis, height
const PLAQUE_BULGE = 0.055; // the shallow dome
const GRID = 56;

function inFeature(u: number, v: number, mouth: 'happy' | 'sad'): boolean {
  // the ROUND eye (left) — a disc
  if (Math.hypot(u + 0.32, v - 0.3) < 0.105) return true;
  // the STROKE eye (right) — a short horizontal slot (the asymmetry)
  if (Math.abs(v - 0.3) < 0.05 && Math.abs(u - 0.32) < 0.17) return true;
  // THE MOUTH — one arc; its curvature IS the aspect. A band around a
  // circle: happy = the low arc of a circle centred ABOVE (ends curve up);
  // sad = the high arc of a circle centred BELOW (ends curve down).
  const c = mouth === 'happy' ? 0.2 : -0.75;
  const r = 0.55;
  const d = Math.hypot(u, v - c);
  if (Math.abs(d - r) < 0.055 && v < -0.12 && Math.abs(u) < 0.34) return true;
  return false;
}

function authorPlaqueShell(mouth: 'happy' | 'sad'): AuthoredShell {
  const positions: V3[] = [];
  const index = new Map<string, number>();
  const at = (i: number, j: number): number => {
    const key = `${i}:${j}`;
    let m = index.get(key);
    if (m === undefined) {
      const u = (i / GRID) * 2 - 1;
      const v = (j / GRID) * 2 - 1;
      const r2 = u * u + v * v;
      const bulge = Math.max(0, 1 - r2);
      m = positions.length;
      positions.push([u * PLAQUE_A, v * PLAQUE_B, PLAQUE_BULGE * bulge]);
      index.set(key, m);
    }
    return m;
  };
  const inside = (i: number, j: number): boolean => {
    const u = (i / GRID) * 2 - 1;
    const v = (j / GRID) * 2 - 1;
    if (u * u + v * v > 1) return false;
    return !inFeature(u, v, mouth);
  };
  const tris: [number, number, number][] = [];
  for (let i = 0; i < GRID; i += 1) {
    for (let j = 0; j < GRID; j += 1) {
      // a cell contributes only when ALL its corners are on the shell — the
      // features become REAL OPENINGS with drawn rims
      if (inside(i, j) && inside(i + 1, j) && inside(i, j + 1) && inside(i + 1, j + 1)) {
        tris.push([at(i, j), at(i + 1, j), at(i + 1, j + 1)]);
        tris.push([at(i, j), at(i + 1, j + 1), at(i, j + 1)]);
      }
    }
  }
  return { positions, tris };
}

// ---------------------------------------------------------------------------
// THE MEASURED JANUS MOUNT (kept verbatim in law from the correction)
// ---------------------------------------------------------------------------

function mountShell(shell: AuthoredShell, side: 'below' | 'above'): TriMesh {
  const meanNormal = ((): V3 => {
    const s: V3 = [0, 0, 0];
    for (const [a, b, c] of shell.tris) {
      const A = shell.positions[a];
      const B = shell.positions[b];
      const C = shell.positions[c];
      const u: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
      const v: V3 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
      s[0] += u[1] * v[2] - u[2] * v[1];
      s[1] += u[2] * v[0] - u[0] * v[2];
      s[2] += u[0] * v[1] - u[1] * v[0];
    }
    const L = Math.hypot(s[0], s[1], s[2]) || 1;
    return [s[0] / L, s[1] / L, s[2] / L];
  })();
  const fHat = meanNormal;
  const hDot = fHat[1];
  let hHat: V3 = [-hDot * fHat[0], 1 - hDot * fHat[1], -hDot * fHat[2]];
  const hLen = Math.hypot(hHat[0], hHat[1], hHat[2]) || 1;
  hHat = [hHat[0] / hLen, hHat[1] / hLen, hHat[2] / hLen];
  const rHat: V3 = [
    hHat[1] * fHat[2] - hHat[2] * fHat[1],
    hHat[2] * fHat[0] - hHat[0] * fHat[2],
    hHat[0] * fHat[1] - hHat[1] * fHat[0],
  ];
  const F: V3 = side === 'below' ? [0, -1, 0] : [0, 1, 0];
  const H: V3 = [0, 0, 1];
  const Rt: V3 = [H[1] * F[2] - H[2] * F[1], H[2] * F[0] - H[0] * F[2], H[0] * F[1] - H[1] * F[0]];
  const R: Mat3 = [
    Rt[0] * rHat[0] + H[0] * hHat[0] + F[0] * fHat[0],
    Rt[0] * rHat[1] + H[0] * hHat[1] + F[0] * fHat[1],
    Rt[0] * rHat[2] + H[0] * hHat[2] + F[0] * fHat[2],
    Rt[1] * rHat[0] + H[1] * hHat[0] + F[1] * fHat[0],
    Rt[1] * rHat[1] + H[1] * hHat[1] + F[1] * fHat[1],
    Rt[1] * rHat[2] + H[1] * hHat[2] + F[1] * fHat[2],
    Rt[2] * rHat[0] + H[2] * hHat[0] + F[2] * fHat[0],
    Rt[2] * rHat[1] + H[2] * hHat[1] + F[2] * fHat[1],
    Rt[2] * rHat[2] + H[2] * hHat[2] + F[2] * fHat[2],
  ];
  if (det3(R) <= 0) {
    throw new Error(
      `apertureProbes: the ${side} plaque mount is not a pure rotation (det ${det3(R)}) — the measured shell frame degenerated; nothing is mirrored silently`,
    );
  }
  let positions = shell.positions.map((p) => applyR(R, p));
  const b = boundsOf(positions);
  const cxz: [number, number] = [(b.lo[0] + b.hi[0]) / 2, (b.lo[2] + b.hi[2]) / 2];
  const yShift = side === 'below' ? b.hi[1] : b.lo[1];
  positions = positions.map((p) => [p[0] - cxz[0], p[1] - yShift, p[2] - cxz[1]] as V3);
  return { positions, tris: shell.tris, material: APERTURE_MATERIALS.MASK };
}

const boundsOf = (positions: V3[]): { lo: V3; hi: V3 } => {
  const lo: V3 = [Infinity, Infinity, Infinity];
  const hi: V3 = [-Infinity, -Infinity, -Infinity];
  for (const p of positions)
    for (let k = 0; k < 3; k += 1) {
      lo[k] = Math.min(lo[k], p[k]);
      hi[k] = Math.max(hi[k], p[k]);
    }
  return { lo, hi };
};

// ---------------------------------------------------------------------------
// small authored solids — tubes (the coil, the stems) and the contact dash
// ---------------------------------------------------------------------------

function tubeAlong(path: V3[], radius: number, ringN: number, material: number): TriMesh {
  const positions: V3[] = [];
  const tris: [number, number, number][] = [];
  let prevRing: number[] | null = null;
  for (let s = 0; s < path.length; s += 1) {
    const p = path[s];
    const q = path[Math.min(path.length - 1, s + 1)];
    const back = path[Math.max(0, s - 1)];
    let t: V3 = [q[0] - back[0], q[1] - back[1], q[2] - back[2]];
    const tL = Math.hypot(t[0], t[1], t[2]) || 1;
    t = [t[0] / tL, t[1] / tL, t[2] / tL];
    // a stable frame around the path
    const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    let n1: V3 = [
      t[1] * ref[2] - t[2] * ref[1],
      t[2] * ref[0] - t[0] * ref[2],
      t[0] * ref[1] - t[1] * ref[0],
    ];
    const nL = Math.hypot(n1[0], n1[1], n1[2]) || 1;
    n1 = [n1[0] / nL, n1[1] / nL, n1[2] / nL];
    const n2: V3 = [
      t[1] * n1[2] - t[2] * n1[1],
      t[2] * n1[0] - t[0] * n1[2],
      t[0] * n1[1] - t[1] * n1[0],
    ];
    const ring: number[] = [];
    for (let r = 0; r < ringN; r += 1) {
      const a = (r / ringN) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      ring.push(positions.length);
      positions.push([
        p[0] + radius * (ca * n1[0] + sa * n2[0]),
        p[1] + radius * (ca * n1[1] + sa * n2[1]),
        p[2] + radius * (ca * n1[2] + sa * n2[2]),
      ]);
    }
    if (prevRing) {
      for (let r = 0; r < ringN; r += 1) {
        const r2 = (r + 1) % ringN;
        tris.push([prevRing[r], ring[r], ring[r2]]);
        tris.push([prevRing[r], ring[r2], prevRing[r2]]);
      }
    }
    prevRing = ring;
  }
  return { positions, tris, material };
}

const mergeInto = (target: TriMesh, extra: TriMesh): void => {
  const base = target.positions.length;
  target.positions.push(...extra.positions);
  for (const [a, b, c] of extra.tris) target.tris.push([a + base, b + base, c + base]);
};

/** a stem down from baseTop to the base line + the CONTACT DASH (a short bar
 * along x) — they stand; the ground is implied, never drawn */
function standAtXY(x: number, y: number, baseTop: number, baseLine: number, material: number): TriMesh {
  const stem = tubeAlong(
    [
      [x, y, baseTop],
      [x, y, baseLine + 0.008],
    ],
    0.008,
    6,
    material,
  );
  const dash = tubeAlong(
    [
      [x - 0.05, y, baseLine],
      [x + 0.05, y, baseLine],
    ],
    0.007,
    6,
    material,
  );
  mergeInto(stem, dash);
  return stem;
}
const standAt = (x: number, baseTop: number, baseLine: number, material: number): TriMesh =>
  standAtXY(x, 0, baseTop, baseLine, material);

// ---------------------------------------------------------------------------
// the build — deterministic, cached; nothing fetched, nothing baked
// ---------------------------------------------------------------------------

export interface ApertureProbeMeshes {
  // the JANUS PLAQUE's two faces (−y-facing happy · +y-facing sad), mounted
  // rim-to-rim at y=0 by the MEASURED mount. (The field name predates the
  // scene — the plaque rides the MASK material slot / recurrence counter.)
  maskShells: [TriMesh, TriMesh];
  // the COIL — the right-handed helix (the HAND slot / chirality counter;
  // the name predates the scene, kept to contain witness ripple — flagged)
  hand: TriMesh;
}

let cache: ApertureProbeMeshes | null = null;

export function buildProbeMeshes(): ApertureProbeMeshes {
  if (cache) return cache;

  // THE PLAQUE — happy faces −y, sad faces +y; the measured mount stands
  // them rim-to-rim, faces OUTWARD (the Janus law)
  const happy = mountShell(authorPlaqueShell('happy'), 'below');
  const sad = mountShell(authorPlaqueShell('sad'), 'above');

  // seat the pair at the room's station and scale to the ruled face height
  const pairBounds = boundsOf([...happy.positions, ...sad.positions]);
  const plaqueScale = 0.52 / (pairBounds.hi[2] - pairBounds.lo[2]);
  // the station: deep enough into the room that the standing frame reads the
  // PAIR as a scene (the plate's distance), not a close-up — and the ruled
  // stroke pitch reads as hatch, not bands (proximity magnifies object pitch)
  const PLAQUE_X = 0.22;
  const PLAQUE_CENTER_Z = 0.1;
  const seat = (mesh: TriMesh): TriMesh => ({
    ...mesh,
    positions: mesh.positions.map(
      (p) =>
        [
          p[0] * plaqueScale + PLAQUE_X,
          p[1] * plaqueScale,
          (p[2] - (pairBounds.lo[2] + pairBounds.hi[2]) / 2) * plaqueScale + PLAQUE_CENTER_Z,
        ] as V3,
    ),
  });
  const plaqueFront = seat(happy);
  const plaqueBack = seat(sad);

  // THE COMMON BASE — the plaque's foot sets the base line; both stand on it
  const plaqueLoZ = PLAQUE_CENTER_Z - 0.26;
  const BASE_LINE = plaqueLoZ - 0.09;
  mergeInto(plaqueFront, standAt(PLAQUE_X, plaqueLoZ + 0.01, BASE_LINE, APERTURE_MATERIALS.MASK));

  // THE COIL — right-handed: counterclockwise (seen from above) while rising.
  // near the plaque, on the common base line
  // to the plaque's SCREEN-RIGHT in the standing frame (the view runs +x+y,
  // so screen-right is +x,−y) — the two stand side by side, never in file
  const COIL_X = 0.34;
  const COIL_Y = -0.17;
  const coilPath: V3[] = [];
  const TURNS = 2.75;
  const SEGS = 88;
  const COIL_R = 0.07;
  const COIL_H = 0.27;
  const COIL_BASE = BASE_LINE + 0.05;
  for (let s = 0; s <= SEGS; s += 1) {
    const t = (s / SEGS) * TURNS * Math.PI * 2;
    coilPath.push([COIL_X + COIL_R * Math.cos(t), COIL_Y + COIL_R * Math.sin(t), COIL_BASE + (s / SEGS) * COIL_H]);
  }
  const coil = tubeAlong(coilPath, 0.02, 8, APERTURE_MATERIALS.HAND);
  mergeInto(coil, standAtXY(COIL_X + COIL_R, COIL_Y, COIL_BASE - 0.01, BASE_LINE, APERTURE_MATERIALS.HAND));

  cache = { maskShells: [plaqueFront, plaqueBack], hand: coil };
  return cache;
}
