// bornFormRouting — G5.2 Part B: route a BORN form to its render, keyed by the
// gluing WORD (the architectural guard, held):
//
//   The immersion lives at the RENDER boundary. The born form's minted positions
//   are quotient bookkeeping (position-blind engine truth) — NEVER render
//   geometry; `materializeOperation` stays byte-unchanged. Given a born form and
//   its parent (both in the store), this module:
//
//   1. RECOVERS the materializer's replay-verified pairings: the pairing suffix
//      the materializer minted into the born id (`…:0-2r:1-3r`) is parsed, the
//      committed op is REPLAYED (glueFace/flipGlueFace + materializeSurfaceResult)
//      and the result byte-compared to the born form — a stale or foreign id
//      never routes (returns null → fallback).
//   2. CLASSIFIES the word: the v0-reachable map, derived from the pairings'
//      MODES over the OPPOSITE-EDGE structure (edgeB ≡ edgeA + n/2 — anything
//      else is un-mapped and falls back honestly):
//        1 pair  — preserving → cylinder ; reversing → möbius
//        2 pairs — {pres,pres} → torus ; {pres,rev} → klein ; {rev,rev} → rp2
//   3. ROUTES: 'immersion' (the R0/Part-A immersion renders it, carrying L2
//      identification + field; C2: a replay-verified COLLAPSE routes here as
//      'sphere' — no word, the collapse target) · 'direct' (C2: a replay-verified
//      CUT — real positions pass through; the form renders itself, no immersion) ·
//      'patch' (the pre-quotient-patch display — the field-integration precedent;
//      honest, never a crash, never a dot) · 'raw' (no parent in the store —
//      nothing better exists; last resort).
//
// Pure + react-free (the diagnostic requires it through the anti-mock hook).
// DERIVE-ONLY: committed ops + the committed G5.0 materializer by import.

import type { Face, Shape, VertexId } from '../types/geometry';
import {
  collapseFace,
  flipGlueFace,
  glueFace,
  type BoundaryPairing,
  type SurfaceTrace,
} from '../lib/surfaceOperations';
import { cutCell } from '../lib/cutOperation';
import {
  materializeCutResult,
  materializeSurfaceResult,
  type MaterializedSurface,
} from '../lib/materializeOperation';
import type { ImmersedSurfaceKey } from '../lib/surfaceImmersion';

// Parse the materializer's deterministic pairing suffix off a born id:
// trailing `:<edgeA>-<edgeB><p|r>` segments (in order). Null if none parse.
export function parsePairingSuffix(bornId: string): BoundaryPairing[] | null {
  const segments = bornId.split(':');
  const pairings: BoundaryPairing[] = [];
  for (let i = segments.length - 1; i >= 0; i -= 1) {
    const match = segments[i].match(/^(\d+)-(\d+)([pr])$/);
    if (!match) break;
    pairings.unshift({
      edgeA: Number(match[1]),
      edgeB: Number(match[2]),
      mode: match[3] === 'p' ? 'preserving' : 'reversing',
    });
  }
  return pairings.length > 0 ? pairings : null;
}

export interface BornSurfaceRecovery {
  pairings: BoundaryPairing[];
  trace: SurfaceTrace;
  materialized: MaterializedSurface;
  parentFace: Face;
}

// Recover the born form's identification and REPLAY-VERIFY it: the committed op
// with the parsed pairings must reproduce the born form byte-for-byte.
// C2: 'collapse' recoveries carry NO pairings (no word) — the committed collapse
// itself is replayed and byte-compared.
export function recoverBornSurface(born: Shape, parent: Shape | null): BornSurfaceRecovery | null {
  if (!parent || born.genealogy.parentShapeId !== parent.id) return null;
  const operation = born.genealogy.operation;
  if (operation !== 'glue' && operation !== 'flip-glue' && operation !== 'collapse') return null;
  if (born.faces.length !== 1) return null;
  const parentFace = parent.faces.find((face) => face.id === born.faces[0].id);
  if (!parentFace) return null;
  if (operation === 'collapse') {
    try {
      const trace = collapseFace(parent, parentFace);
      const materialized = materializeSurfaceResult(parent, parentFace, trace);
      if (JSON.stringify(materialized.shape) !== JSON.stringify(born)) return null;
      return { pairings: [], trace, materialized, parentFace };
    } catch {
      return null;
    }
  }
  const pairings = parsePairingSuffix(born.id);
  if (!pairings) return null;
  try {
    const op = operation === 'flip-glue' ? flipGlueFace : glueFace;
    const trace = op(parent, parentFace, pairings);
    const materialized = materializeSurfaceResult(parent, parentFace, trace);
    if (JSON.stringify(materialized.shape) !== JSON.stringify(born)) return null;
    return { pairings, trace, materialized, parentFace };
  } catch {
    return null;
  }
}

// The v0-reachable word → surface-class map, derived from the pairings' modes
// over the OPPOSITE-EDGE structure. Anything else → null (unmapped; fallback).
export function classifyGluingWord(
  pairings: BoundaryPairing[],
  faceEdgeCount: number,
): ImmersedSurfaceKey | null {
  const n = faceEdgeCount;
  if (n < 4 || n % 2 !== 0) return null;
  const opposite = pairings.every(
    ({ edgeA, edgeB }) => (edgeB - edgeA + n) % n === n / 2 || (edgeA - edgeB + n) % n === n / 2,
  );
  if (!opposite) return null;
  const reversingCount = pairings.filter((p) => p.mode === 'reversing').length;
  if (pairings.length === 1) return reversingCount === 0 ? 'cylinder' : 'mobius';
  if (pairings.length === 2) {
    if (reversingCount === 0) return 'torus';
    if (reversingCount === 1) return 'klein';
    return 'rp2';
  }
  return null;
}

export type BornFormRoute =
  | { kind: 'immersion'; surface: ImmersedSurfaceKey; recovery: BornSurfaceRecovery }
  | { kind: 'direct' } // C2 — cut: real positions pass through; render the form itself (no immersion)
  | {
      kind: 'patch'; // the pre-quotient-patch display (the field-integration precedent)
      parent: Shape;
      displayFaces: Face[];
      vertexClassOf: Record<VertexId, VertexId>;
    }
  | { kind: 'raw' }; // no parent in the store — nothing better exists (honest last resort)

export function routeBornForm(born: Shape, parent: Shape | null): BornFormRoute {
  const recovery = recoverBornSurface(born, parent);
  if (recovery) {
    // C2: a collapse recovery has no word — it routes to the SPHERE (the collapse
    // target); worded recoveries classify by the v0 map as before.
    const surface =
      born.genealogy.operation === 'collapse'
        ? ('sphere' as const)
        : classifyGluingWord(recovery.pairings, recovery.parentFace.vertexIds.length);
    if (surface) return { kind: 'immersion', surface, recovery };
  }
  // C2 — a CUT renders DIRECTLY (its vertices/edges pass through verbatim, real
  // positions — no immersion), REPLAY-VERIFIED: the one parent face the born form
  // lost is re-cut through the committed op and byte-compared.
  if (parent && born.genealogy.parentShapeId === parent.id && born.genealogy.operation === 'cut') {
    const missing = parent.faces.filter((pf) => !born.faces.some((bf) => bf.id === pf.id));
    if (missing.length === 1) {
      try {
        const replay = materializeCutResult(parent, cutCell(parent, missing[0]));
        if (JSON.stringify(replay) === JSON.stringify(born)) return { kind: 'direct' };
      } catch {
        // fall through to the honest fallbacks
      }
    }
  }
  if (parent && born.genealogy.parentShapeId === parent.id) {
    const displayFaces = born.faces
      .map((face) => parent.faces.find((pf) => pf.id === face.id))
      .filter((face): face is Face => Boolean(face));
    if (displayFaces.length === born.faces.length && displayFaces.length > 0) {
      const vertexClassOf: Record<VertexId, VertexId> = {};
      for (const vertex of Object.values(born.vertices)) {
        if (vertex.createdBy.shapeId === born.id && vertex.createdBy.sourceVertexIds.length >= 2) {
          for (const source of vertex.createdBy.sourceVertexIds) vertexClassOf[source] = vertex.id;
        } else {
          vertexClassOf[vertex.id] = vertex.id;
        }
      }
      return { kind: 'patch', parent, displayFaces, vertexClassOf };
    }
  }
  return { kind: 'raw' };
}
