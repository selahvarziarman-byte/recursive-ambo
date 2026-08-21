// THE WINDING WALK SIMULATOR (engineer 1230/1300 charter) — the exact
// replica of ExploreWindow's transportWalk + deck frame + position-return
// law, over any `readCellSurface` output. This is the instrument that let
// the winding route's walks be DERIVED rather than searched (it predicted
// the cone room's 2-door half-turn fold to four decimals before the app
// printed it, and planned the fan pillar circuit that showed the
// interior-transport gap).
//
// ⛔ REPLICATION, not import: ExploreWindow's walk lives inside a component
// closure; this mirror carries the same arithmetic (applyM/applyRot over
// the packed 12-float g, the wall clamp, the transport guard of 8, the
// 0.35/0.6125 return law). If the window's law moves, the pinned fixtures
// in diagnose-winding-headings.cjs fail and point here.

const ENTRY = [-0.35, -0.55, 0.1]; // ExploreWindow's entry eye, verbatim

const applyM = (g, p) => [
  g[0] * p[0] + g[1] * p[1] + g[2] * p[2] + g[9],
  g[3] * p[0] + g[4] * p[1] + g[5] * p[2] + g[10],
  g[6] * p[0] + g[7] * p[1] + g[8] * p[2] + g[11],
];
const applyRot = (g, v) => [
  g[0] * v[0] + g[1] * v[1] + g[2] * v[2],
  g[3] * v[0] + g[4] * v[1] + g[5] * v[2],
  g[6] * v[0] + g[7] * v[1] + g[8] * v[2],
];

// walk a COVER path (waypoints in the developing plane) through the folded
// cell: each step is taken in the CURRENT deck orientation — exactly how the
// person's transported forward carries a straight intent through doors.
function simulateWalk(surface, startEye, coverPath, opts = {}) {
  const returnEps = opts.returnEps ?? 0.35;
  const armEps = opts.armEps ?? 0.6125;
  let eye = [...startEye];
  let doors = 0;
  let clamps = 0;
  let deckF = [1, 0, 0];
  let deckR = [0, 1, 0];
  let deckU = [0, 0, 1];
  let armed = false;
  let returned = false;
  let doorsAtReturn = null;
  let traceAtReturn = null;
  let handedness = 1;
  const folded = [];
  for (let i = 1; i < coverPath.length; i += 1) {
    const step = [
      coverPath[i][0] - coverPath[i - 1][0],
      coverPath[i][1] - coverPath[i - 1][1],
      coverPath[i][2] - coverPath[i - 1][2],
    ];
    const s = applyRot(
      [deckF[0], deckR[0], deckU[0], deckF[1], deckR[1], deckU[1], deckF[2], deckR[2], deckU[2]],
      step,
    );
    let prev = eye;
    eye = [eye[0] + s[0], eye[1] + s[1], eye[2] + s[2]];
    for (let guard = 0; guard < 8; guard += 1) {
      let exited = -1;
      for (let f = 0; f < surface.faces.length; f += 1) {
        const face = surface.faces[f];
        const d = eye[0] * face.n[0] + eye[1] * face.n[1] + eye[2] * face.n[2] - face.d;
        if (d > 0) {
          // INTERIOR TRANSPORT (2026-08-21, mirrored from ExploreWindow's
          // transportWalk): a BOUNDED face (the developed cone room's seam
          // quad) fires only on a genuine CROSSING — this step's segment
          // pierces the plane (before ≤ 0 < after) and the pierce point lies
          // inside the quad. A point-only test fired 60° early (measured).
          // Unbounded faces keep the convex-cell law byte-identically.
          if (face.bounds) {
            const dPrev = prev[0] * face.n[0] + prev[1] * face.n[1] + prev[2] * face.n[2] - face.d;
            if (dPrev > 0) continue;
            const t = dPrev / (dPrev - d);
            const hit = [
              prev[0] + (eye[0] - prev[0]) * t,
              prev[1] + (eye[1] - prev[1]) * t,
              prev[2] + (eye[2] - prev[2]) * t,
            ];
            const q = [hit[0] - face.bounds.c[0], hit[1] - face.bounds.c[1], hit[2] - face.bounds.c[2]];
            const u = face.bounds.u;
            const w = face.bounds.w;
            const du = q[0] * u[0] + q[1] * u[1] + q[2] * u[2];
            const dw = q[0] * w[0] + q[1] * w[1] + q[2] * w[2];
            if (Math.abs(du) > u[0] * u[0] + u[1] * u[1] + u[2] * u[2]) continue;
            if (Math.abs(dw) > w[0] * w[0] + w[1] * w[1] + w[2] * w[2]) continue;
          }
          exited = f;
          break;
        }
      }
      if (exited < 0) break;
      const face = surface.faces[exited];
      if (face.wall || !face.g) {
        const d = eye[0] * face.n[0] + eye[1] * face.n[1] + eye[2] * face.n[2] - face.d;
        eye = [eye[0] - face.n[0] * (d + 1e-4), eye[1] - face.n[1] * (d + 1e-4), eye[2] - face.n[2] * (d + 1e-4)];
        prev = eye;
        clamps += 1;
        continue;
      }
      eye = applyM(face.g, eye);
      prev = eye;
      deckF = applyRot(face.g, deckF);
      deckR = applyRot(face.g, deckR);
      deckU = applyRot(face.g, deckU);
      doors += 1;
    }
    folded.push([...eye]);
    const dEntry = Math.hypot(eye[0] - startEye[0], eye[1] - startEye[1], eye[2] - startEye[2]);
    if (!armed && dEntry > armEps) armed = true;
    else if (armed && !returned && dEntry <= returnEps) {
      returned = true;
      doorsAtReturn = doors;
      traceAtReturn = deckF[0] + deckR[1] + deckU[2];
      handedness =
        deckF[0] * (deckR[1] * deckU[2] - deckR[2] * deckU[1]) -
        deckF[1] * (deckR[0] * deckU[2] - deckR[2] * deckU[0]) +
        deckF[2] * (deckR[0] * deckU[1] - deckR[1] * deckU[0]);
    }
  }
  const trace = deckF[0] + deckR[1] + deckU[2];
  return { eye, doors, clamps, deckF, deckR, deckU, trace, folded, returned, doorsAtReturn, traceAtReturn, handedness };
}

const straightLine = (from, dir, length, steps) => {
  const line = [];
  const n = Math.hypot(dir[0], dir[1], dir[2]);
  const u = [dir[0] / n, dir[1] / n, dir[2] / n];
  for (let i = 0; i <= steps; i += 1) {
    const t = (length * i) / steps;
    line.push([from[0] + u[0] * t, from[1] + u[1] * t, from[2] + u[2] * t]);
  }
  return line;
};

module.exports = { ENTRY, simulateWalk, straightLine, applyM, applyRot };
