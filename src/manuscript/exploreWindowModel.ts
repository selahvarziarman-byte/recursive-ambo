// exploreWindowModel — RUNG 1 of the explore window (FAT CHARTER, engineer-
// chartered 2026-08-07, mothership 1500 §THE REFRAME): the react-free walk +
// threshold law behind the EXPLORE WINDOW. The person opens a window INTO a
// built 3-manifold and walks it — the aperture's own image-space transport
// draws what they see; this module only carries the EYE.
//
// ⛔ THE TRANSPORT IS NOT RE-DERIVED: the walk consumes the aperture's own
// witnessed deck (`DeckEntry` — exit planes + fitted isometries) through the
// EXPORTED applyPoint/applyVector, exactly the tracer's step (p ← g(p),
// v ← R·v). apertureModel is byte-untouched by this rung — the drivable eye
// rides the tracer's exposed `options.eye`/`options.forward` seam.
//
// THE INVARIANTS THIS MODULE CARRIES:
//   · NEVER MARK THE CROSSING — when the eye leaves the fundamental domain
//     through a paired face it is carried back by the SAME gluing isometry
//     the rays use. By equivariance the view before and after the carry is
//     the same view — nothing to draw, nothing to hide, no seam to smooth.
//   · REFUSE NON-E³ AT THE THRESHOLD — the door law is TOTAL and fires at
//     the DOOR: an E³ room opens; a cone room or an orbifold refuses BY NAME
//     with the geometry's own census; a surface (class body) refuses to a
//     later chapter. Never a smear — the habitat opens or it doesn't.
//   · TWO GESTURES — look (rotate forward about the eye) and advance (move
//     the eye along forward). Walking a cloister: no strafe, no roll, no
//     speed. Both live here so the view stays a thin hand.

import type { Vec3 } from '../types/geometry';
import {
  applyPoint,
  applyVector,
  type ApertureGeometry,
  type DeckEntry,
  type FoldedApertureGeometry,
} from './apertureModel';

// ---------------------------------------------------------------------------
// the standing start — the tracer's own default frame, verbatim
// ---------------------------------------------------------------------------

/** The opening frame MIRRORS the tracer's defaults (apertureModel's eye
 * [-0.38,-0.3,-0.05] / forward [0.8,0.55,0.12] — the frame chosen so the
 * x-corridor's odd-word copies are in view). RECURRENCE AT REST rides this:
 * the window's first standing frame is the shell's own corridor view, already
 * showing the returning copies before the person moves. */
export const EXPLORE_START: { eye: Vec3; forward: Vec3 } = {
  eye: [-0.38, -0.3, -0.05],
  forward: [0.8, 0.55, 0.12],
};

export interface ExploreWalkState {
  eye: Vec3;
  forward: Vec3; // unit
  crossings: number; // transports the EYE has taken (the walk's own count)
}

const norm3 = (v: Vec3): Vec3 => {
  const L = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / L, v[1] / L, v[2] / L];
};

export const exploreStartState = (): ExploreWalkState => ({
  eye: [...EXPLORE_START.eye] as Vec3,
  forward: norm3([...EXPLORE_START.forward] as Vec3),
  crossings: 0,
});

// ---------------------------------------------------------------------------
// LOOK — drag rotates forward about the eye (yaw about the page's vertical,
// pitch about the walker's right hand; pitch clamped so the frame the tracer
// builds from world-Z never degenerates)
// ---------------------------------------------------------------------------

/** |forward·Z| ceiling — keeps the tracer's right = forward×Z well-formed. */
const PITCH_Z_MAX = 0.985;

export function lookTurn(state: ExploreWalkState, yawRad: number, pitchRad: number): ExploreWalkState {
  const f = norm3(state.forward);
  // yaw about world Z
  const cy = Math.cos(yawRad);
  const sy = Math.sin(yawRad);
  let out: Vec3 = [f[0] * cy - f[1] * sy, f[0] * sy + f[1] * cy, f[2]];
  // pitch about the walker's right (right = forward × Z, horizontal) — with
  // right ⊥ forward the Rodrigues turn reduces to cos/sin on the pair
  const right = norm3([out[1], -out[0], 0]); // forward × [0,0,1] = [fy, -fx, 0]
  const cp = Math.cos(pitchRad);
  const sp = Math.sin(pitchRad);
  const rxf: Vec3 = [
    right[1] * out[2] - right[2] * out[1],
    right[2] * out[0] - right[0] * out[2],
    right[0] * out[1] - right[1] * out[0],
  ];
  out = [out[0] * cp + rxf[0] * sp, out[1] * cp + rxf[1] * sp, out[2] * cp + rxf[2] * sp];
  // the clamp: hold the vertical component under the ceiling, keep the heading
  if (Math.abs(out[2]) > PITCH_Z_MAX) {
    const z = Math.sign(out[2]) * PITCH_Z_MAX;
    const h = Math.hypot(out[0], out[1]) || 1;
    const hScale = Math.sqrt(1 - z * z) / h;
    out = [out[0] * hScale, out[1] * hScale, z];
  }
  return { eye: state.eye, forward: norm3(out), crossings: state.crossings };
}

// ---------------------------------------------------------------------------
// ADVANCE — the eye moves along forward; leaving Δ through a paired face it
// is carried back by THE ENGINE'S OWN gluing isometry (never marked); an
// UNPAIRED boundary face is genuinely the edge of the body — the walk stops
// at it (the person's chosen boundary is a wall in truth, not a horizon)
// ---------------------------------------------------------------------------

const WALL_MARGIN = 2e-4;

export function advanceEye(
  deck: readonly DeckEntry[],
  bboxLo: Vec3,
  bboxHi: Vec3,
  state: ExploreWalkState,
  distance: number,
): ExploreWalkState {
  let eye: Vec3 = [...state.eye] as Vec3;
  let forward: Vec3 = norm3(state.forward);
  let crossings = state.crossings;
  let remaining = Math.max(0, distance);
  for (let guard = 0; guard < 12 && remaining > 1e-7; guard += 1) {
    // nearest DECK exit plane ahead — the tracer's own exit search, on the eye
    let tExit = Infinity;
    let exitPair = -1;
    let exitSide = 0;
    for (let k = 0; k < deck.length; k += 1) {
      const d0 = deck[k];
      const planes: [Vec3, number, number][] = [
        [d0.nA, d0.dA, 0],
        [d0.nB, d0.dB, 1],
      ];
      for (const [n, dd, side] of planes) {
        const den = forward[0] * n[0] + forward[1] * n[1] + forward[2] * n[2];
        if (den <= 1e-9) continue;
        const t = (dd - (eye[0] * n[0] + eye[1] * n[1] + eye[2] * n[2])) / den;
        if (t > 1e-7 && t < tExit) {
          tExit = t;
          exitPair = k;
          exitSide = side;
        }
      }
    }
    // nearest BBOX wall ahead (the cell is the seed's own box; a paired face
    // lies ON a box plane, so the deck test above wins ties)
    let tWall = Infinity;
    for (let k = 0; k < 3; k += 1) {
      if (Math.abs(forward[k]) < 1e-12) continue;
      const bound = forward[k] > 0 ? bboxHi[k] : bboxLo[k];
      const t = (bound - eye[k]) / forward[k];
      if (t > 0 && t < tWall) tWall = t;
    }
    if (exitPair >= 0 && tExit <= remaining && tExit <= tWall + 1e-6) {
      // carry the eye back: p ← g(p), v ← R·v — the engine's own isometry,
      // the same step the rays take; drawn NOWHERE (the crossing is seamless)
      const d0 = deck[exitPair];
      const P0: Vec3 = [eye[0] + forward[0] * tExit, eye[1] + forward[1] * tExit, eye[2] + forward[2] * tExit];
      const g = exitSide === 0 ? d0.g : d0.gi;
      eye = applyPoint(g, P0) as Vec3;
      forward = norm3(applyVector(g, forward) as Vec3);
      eye = [eye[0] + forward[0] * 1e-4, eye[1] + forward[1] * 1e-4, eye[2] + forward[2] * 1e-4];
      remaining -= tExit;
      crossings += 1;
      continue;
    }
    if (remaining < tWall - WALL_MARGIN) {
      eye = [eye[0] + forward[0] * remaining, eye[1] + forward[1] * remaining, eye[2] + forward[2] * remaining];
      remaining = 0;
      break;
    }
    // an unpaired boundary face — the walk stops AT the person's boundary
    const step = Math.max(0, tWall - WALL_MARGIN);
    eye = [eye[0] + forward[0] * step, eye[1] + forward[1] * step, eye[2] + forward[2] * step];
    remaining = 0;
    break;
  }
  return { eye, forward, crossings };
}

// ---------------------------------------------------------------------------
// THE THRESHOLD — the door law, total; the refusal fires AT the door with the
// geometry's own census, never a smear (the habitat opens or it doesn't)
// ---------------------------------------------------------------------------

export type ExploreThreshold = { opens: true } | { opens: false; reason: string };

// FEED (researcher): the non-E³ refusal's person-facing MEANING is owed by
// the researcher (charter §4a). The sentences below are PROVISIONAL
// placeholders that already carry the honest census (cone edges by angle ·
// fold loci); swap the wording when the ruled strings land, behavior fixed.
export function exploreThreshold(geometry: ApertureGeometry | FoldedApertureGeometry): ExploreThreshold {
  if (geometry.kind === 'E3') return { opens: true };
  if (geometry.kind === 'folded') {
    return {
      opens: false,
      reason:
        `this door does not open — the body behind it is an orbifold (fold loci: ${geometry.foldLoci}` +
        `${geometry.coneEdges ? ` · cone edges: ${geometry.coneEdges}` : ''}); only the flat rooms can be walked for now.`,
    };
  }
  return {
    opens: false,
    reason:
      `this door does not open — the room behind it is not the flat E³ habitat` +
      `${geometry.coneEdges ? ` (cone edges: ${geometry.coneEdges})` : ''}; only the flat rooms can be walked for now.`,
  };
}

// FEED (researcher): the surface walk's own sentence is a later rung's copy;
// this placeholder declares the horizon rather than staying silent.
export const EXPLORE_SURFACE_LATER =
  'the inside of a surface is not walkable yet — this door opens in a later chapter of the instrument.';

/** The greyed chip's word when nothing with an inside is selected. */
export const EXPLORE_NEEDS_ROOM = 'select a room with an inside — a built 3-manifold';
