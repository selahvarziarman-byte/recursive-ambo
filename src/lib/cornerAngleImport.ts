// cornerAngleImport — R2 THE SUBSTRATE ROOT (2026-08-14 mandate, mothership
// nod 1130): derived-face mint sites stop STAMPING `regularCornerAngle(n)`
// (an assumed-regular constant) and instead acos-IMPORT each corner's TRUE
// angle from the face's carried vertex positions — `readPillarDihedrals`
// then MEASURES geometry instead of reading our own hand (arrow 1 of the
// carry chain). R2's honest claim ends there: the read only. Positions are
// untouched (R1); no gate rides this (R3); the window's flat-chart walk
// still renders zero holonomy (the downstream capability the mothership
// carries) — nothing here claims the cone shows.
//
// The import mirrors the RATIFIED P5 second-source read
// (subComplexLift.ts:790-826) VERBATIM, including its honesty law: a
// malformed corner — a missing vertex, a zero-length edge vector, a cycle
// shorter than 3 — leaves the face UN-OWNED (null). Nothing fabricated,
// never a fallback, never a guess. `subComplexLift` keeps its own inline
// copy (refactoring it was priced out of R2; the duplication is disclosed
// in the arc report).
//
// ⛔ The invoke-seed stamp (`conformalAtom.computeSeedCornerAngles`) is NOT
// this seam and stays byte-unchanged: every caller there passes an invoked
// regular seed, where the regular constant EQUALS this acos anyway.

import type { Vec3, VertexId } from '../types/geometry';

// θ_k = acos((e₁·e₂)/(|e₁||e₂|)), e₁ = prev−v, e₂ = next−v — per corner k of
// the cycle, index-aligned to `faceVertexIds`. Returns null (the face owns
// NOTHING) on any malformed corner. The record type asks for exactly what the
// import reads — a position per corner — so both full `Vertex` records and
// lighter position-bearing corners (the dual view's) hand in without a cast.
export function importCornerAngles(
  faceVertexIds: VertexId[],
  vertices: Record<VertexId, { position: Vec3 }>,
): number[] | null {
  const n = faceVertexIds.length;
  if (n < 3) return null;
  const imported: number[] = [];
  for (let k = 0; k < n; k += 1) {
    const v = vertices[faceVertexIds[k]]?.position;
    const prev = vertices[faceVertexIds[(k - 1 + n) % n]]?.position;
    const next = vertices[faceVertexIds[(k + 1) % n]]?.position;
    if (!v || !prev || !next) return null;
    const e1 = [prev[0] - v[0], prev[1] - v[1], prev[2] - v[2]];
    const e2 = [next[0] - v[0], next[1] - v[1], next[2] - v[2]];
    const n1 = Math.hypot(e1[0], e1[1], e1[2]);
    const n2 = Math.hypot(e2[0], e2[1], e2[2]);
    if (n1 < 1e-12 || n2 < 1e-12) return null;
    const cos = (e1[0] * e2[0] + e1[1] * e2[1] + e1[2] * e2[2]) / (n1 * n2);
    imported.push(Math.acos(Math.max(-1, Math.min(1, cos))));
  }
  return imported;
}
