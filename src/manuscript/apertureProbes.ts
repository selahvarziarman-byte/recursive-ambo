// apertureProbes — THE PROBES (engineer-chartered 2026-07-14, designer-ruled
// 0400/0510/0620/0750/0900; sealed 8fcb8d42…4a69): the mask, held in a hand.
// Real scans, not primitives.
//
// WHY THE SCENE CHANGED (measured, not aesthetic): a face is bilaterally
// symmetric — mirror-IoU 0.98 — it can NEVER carry chirality; a room of masks
// alone makes w₁ invisible. The Capitolini pointing hand (mirror-IoU 0.081)
// is unmistakable as a LEFT hand when the space reflects it. The mask does
// recurrence + the corridors; THE HAND DOES CHIRALITY. Two jobs, genuinely
// two. RETIRED: the capsule coil and the ellipsoid-mask stand-in.
//
// THE MASK — masks_happy_and_sad (208,188 vertices · 416,350 triangles),
// split at the mid-plane of its own bbox in x (x < cx / x > cx — the shells
// are DISJOINT, measured: 0 straddling faces; no tolerance is needed and
// none is used). Each shell stands up (a pure rotation) to face ∓y and
// mounts RIM TO RIM: the −y-facing shell translated by −max(y), the
// +y-facing shell by −min(y) — the rims meet at y = 0 and the shells occupy
// y ≤ 0 / y ≥ 0: disjoint by construction, no self-intersection possible.
//
// THE HAND — hand_pointing_capitolini (53,160 vertices · 106,022 triangles),
// fist + extended index. ⛔ PLACEMENT LAW: the hand is placed by ROTATION
// ONLY — det(R) > 0 is ASSERTED here and THROWS on violation. The designer
// never mirrors the hand; only the space may. A reflected placement is a lie
// planted inside the probe.

import { maskScan, handScan, type ProbeScan } from './apertureProbeAssets';
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

// stand-up rotations, derived from the scan's measured frame (shells lie
// face-up: nose +z, face height along y):
//   Rx(+90°): (x,y,z) → (x, z, −y)  — the nose (+z) turns to −y, up (y) → +z
const RX_POS90: Mat3 = [1, 0, 0, 0, 0, 1, 0, -1, 0];
//   Rx(−90°): (x,y,z) → (x, −z, y) — the nose turns to +y, up → −z (inverted)…
const RX_NEG90: Mat3 = [1, 0, 0, 0, 0, -1, 0, 1, 0];
//   …so the +y-facing shell also spins Ry(180°): (x,y,z) → (−x, y, −z)
const RY_180: Mat3 = [-1, 0, 0, 0, 1, 0, 0, 0, -1];
const mulM = (a: Mat3, b: Mat3): Mat3 => {
  const out: number[] = new Array(9).fill(0);
  for (let i = 0; i < 3; i += 1)
    for (let j = 0; j < 3; j += 1)
      for (let k = 0; k < 3; k += 1) out[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j];
  return out;
};

/** The hand's placement rotation — IDENTITY (the scan already points its
 * index along +z, the room's up). ⛔ det(R) > 0 asserted below; a mirrored
 * placement THROWS. */
export const HAND_PLACEMENT_ROTATION: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

interface ShellExtract {
  positions: V3[];
  tris: [number, number, number][];
}

function extractShell(scan: ProbeScan, side: 'below' | 'above', cx: number): ShellExtract {
  const remap = new Map<number, number>();
  const positions: V3[] = [];
  const tris: [number, number, number][] = [];
  const p = scan.positions;
  const keep = (i: number): boolean => (side === 'below' ? p[i * 3] < cx : p[i * 3] > cx);
  const mapped = (i: number): number => {
    let m = remap.get(i);
    if (m === undefined) {
      m = positions.length;
      positions.push([p[i * 3], p[i * 3 + 1], p[i * 3 + 2]]);
      remap.set(i, m);
    }
    return m;
  };
  const t = scan.tris;
  for (let k = 0; k < t.length; k += 3) {
    const a = t[k];
    const b = t[k + 1];
    const c = t[k + 2];
    // the shells are disjoint (0 straddling faces, measured) — a triangle is
    // wholly on one side; NO tolerance is applied
    if (keep(a) && keep(b) && keep(c)) tris.push([mapped(a), mapped(b), mapped(c)]);
  }
  return { positions, tris };
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

export interface ApertureProbeMeshes {
  maskShells: [TriMesh, TriMesh]; // −y-facing · +y-facing, mounted rim-to-rim at y=0
  hand: TriMesh;
}

let cache: ApertureProbeMeshes | null = null;

/** Build the room's probes from the RAW scans (deterministic; cached). */
export function buildProbeMeshes(): ApertureProbeMeshes {
  if (cache) return cache;
  const scanBounds = boundsOf(
    Array.from({ length: maskScan.positions.length / 3 }, (_, i) => [
      maskScan.positions[i * 3],
      maskScan.positions[i * 3 + 1],
      maskScan.positions[i * 3 + 2],
    ] as V3),
  );
  const cx = (scanBounds.lo[0] + scanBounds.hi[0]) / 2;

  const mountShell = (side: 'below' | 'above'): TriMesh => {
    const shell = extractShell(maskScan, side, cx);
    // the stand-up rotation: the 'below' shell faces −y (Rx+90); the 'above'
    // shell faces +y, righted by Ry180 (both pure rotations, det +1)
    const R = side === 'below' ? RX_POS90 : mulM(RY_180, RX_NEG90);
    let positions = shell.positions.map((p) => applyR(R, p));
    // centre x/z on the room's axis, then the RIM-TO-RIM mount:
    //   facing −y  →  V.y −= max(V.y)   (rim at its y-max → 0, shell in y ≤ 0)
    //   facing +y  →  V.y −= min(V.y)   (rim at its y-min → 0, shell in y ≥ 0)
    const b = boundsOf(positions);
    const cxz: [number, number] = [(b.lo[0] + b.hi[0]) / 2, (b.lo[2] + b.hi[2]) / 2];
    const yShift = side === 'below' ? b.hi[1] : b.lo[1];
    positions = positions.map((p) => [p[0] - cxz[0], p[1] - yShift, p[2] - cxz[1]] as V3);
    return { positions, tris: shell.tris, material: APERTURE_MATERIALS.MASK };
  };

  const shellNegY = mountShell('below');
  const shellPosY = mountShell('above');

  // scale the mounted pair into the room (face height ≈ 0.52 world units) and
  // seat it in the upper middle — the same station the retired stand-in held
  const pairBounds = boundsOf([...shellNegY.positions, ...shellPosY.positions]);
  const maskScale = 0.52 / (pairBounds.hi[2] - pairBounds.lo[2]);
  const MASK_CENTER: V3 = [0, 0, 0.14];
  const placeMask = (mesh: TriMesh): TriMesh => ({
    ...mesh,
    positions: mesh.positions.map((p) => [
      p[0] * maskScale + MASK_CENTER[0],
      p[1] * maskScale + MASK_CENTER[1],
      (p[2] - (pairBounds.lo[2] + pairBounds.hi[2]) / 2) * maskScale + MASK_CENTER[2],
    ] as V3),
  });

  // THE HAND — rotation only (⛔ the placement law), scaled and seated below,
  // the extended index rising toward the mask's chin
  const R = HAND_PLACEMENT_ROTATION;
  if (det3(R) <= 0) {
    throw new Error(
      `apertureProbes: the hand placement rotation has det ${det3(R)} — a reflected placement is a lie planted inside the probe (the designer never mirrors the hand; only the space may)`,
    );
  }
  const handPositions: V3[] = [];
  for (let i = 0; i < handScan.positions.length / 3; i += 1) {
    handPositions.push(applyR(R, [handScan.positions[i * 3], handScan.positions[i * 3 + 1], handScan.positions[i * 3 + 2]]));
  }
  const hb = boundsOf(handPositions);
  const handScale = 0.34 / (hb.hi[2] - hb.lo[2]); // wrist→fingertip ≈ 0.34 world units — the whole hand stays INSIDE the cell
  const maskLowZ = MASK_CENTER[2] - 0.26;
  const placed = handPositions.map(
    (p) =>
      [
        (p[0] - (hb.lo[0] + hb.hi[0]) / 2) * handScale,
        (p[1] - (hb.lo[1] + hb.hi[1]) / 2) * handScale,
        (p[2] - hb.hi[2]) * handScale + (maskLowZ - 0.006), // fingertip just under the chin — held, not fused
      ] as V3,
  );
  const handTris: [number, number, number][] = [];
  for (let k = 0; k < handScan.tris.length; k += 3) {
    handTris.push([handScan.tris[k], handScan.tris[k + 1], handScan.tris[k + 2]]);
  }
  const hand: TriMesh = { positions: placed, tris: handTris, material: APERTURE_MATERIALS.HAND };

  cache = { maskShells: [placeMask(shellNegY), placeMask(shellPosY)], hand };
  return cache;
}

/** Parse a Wavefront OBJ's v/f lines (fan-triangulated) — the same reading
 * the asset bake used; the witness re-parses the real scans through THIS
 * function and asserts the baked module equal. */
export function parseWavefrontObj(text: string): { positions: Float32Array; tris: Uint32Array } {
  const positions: number[] = [];
  const tris: number[] = [];
  for (const line of text.split('\n')) {
    if (line.startsWith('v ')) {
      const parts = line.trim().split(/\s+/);
      positions.push(+parts[1], +parts[2], +parts[3]);
    } else if (line.startsWith('f ')) {
      const idx = line
        .trim()
        .split(/\s+/)
        .slice(1)
        .map((token) => {
          const i = parseInt(token.split('/')[0], 10);
          return i > 0 ? i - 1 : positions.length / 3 + i;
        });
      for (let k = 1; k + 1 < idx.length; k += 1) tris.push(idx[0], idx[k], idx[k + 1]);
    }
  }
  return { positions: new Float32Array(positions), tris: new Uint32Array(tris) };
}
