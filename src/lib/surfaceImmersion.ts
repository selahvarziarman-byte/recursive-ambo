// surfaceImmersion — R0: the render-immersion foundation (ADR 0018).
//
// Makes the DEGENERATE-BOUNDARY surfaces showable: a bare fundamental polygon
// whose boundary is glued into a closed surface (torus / Klein bottle / RP²)
// becomes a subdivided `Shape` immersed in R³, per the researcher/mothership
// ruling — *intrinsic immersion of the abstract cell respecting its gluings,
// interior positions by subdivision*:
//
//   1. SUBDIVIDE the fundamental square into an R×R grid;
//   2. APPLY the boundary identifications (the surface's gluing word) to the
//      grid vertices — the quotient is real (merged classes), not a flat sheet;
//   3. IMMERSE via a per-surface parametrization CONSISTENT with the gluings —
//      identified grid points map to the SAME R³ position (guarded, not hoped):
//        · torus  (word abAB — a b a⁻¹ b⁻¹): the flat donut;
//        · klein  (word abaB — a b a b⁻¹):  the standard figure-8 immersion,
//          whose defining symmetry K(θ+2π, v) = K(θ, −v) is exactly the
//          reversed wrap (0,j) ~ (R, R−j);
//        · rp2    (word abab):              the cross-cap — the square maps
//          radially onto the disk (perimeter-antipodal → boundary-antipodal,
//          the square being centrally symmetric), then the disk through the
//          standard cross-cap parametrization, whose boundary collapse
//          (u, π/2) = (u+π, π/2) realizes the antipodal identification.
//      The R³ self-intersection of Klein/RP² is GEOMETRIC overlap only — the
//      combinatorial quotient stays a closed manifold (every vertex link a
//      single interior cycle), which is what the diagnostic asserts.
//   4. EMIT the `Shape` (merged vertices with R³ positions; faces = the R²
//      grid cells over merged classes; edges via the committed `deriveEdges`)
//      PLUS the QUOTIENT CORRESPONDENCE — which grid points each merged vertex
//      absorbed (multi-member classes ARE the landed boundary identifications)
//      and which grid cell each face came from — so L2 (identification/lineage
//      annotation) and L3 (the L_U field content) can overlay later. NEITHER is
//      built here: R0 is geometry only.
//
// Scope notes (honest limits): the emitted Shape is a genealogy ROOT (operation
// 'seed', source-less vertices) — R0 makes no lineage claim; the quotient facts
// live in the correspondence for L2 to interpret. Lifted-composite surfaces
// (route-B) render from carried material and do not pass through here.
//
// DERIVE-ONLY · ADDITIVE: committed modules consumed by import only
// (`deriveEdges`, `createDefaultVertexData`); no invariant is recomputed here —
// the diagnostic measures χ/w₁ through the committed `globalW1Class` path.

import type { Face, FaceId, Shape, ShapeId, Vec3, Vertex, VertexId } from '../types/geometry';
import { createDefaultVertexData, deriveEdges } from './shape';

// G5.2 Part A (additive): the OPEN surfaces join the catalogue — the gluing word
// wraps ONE direction only (single-pair glue/flip-glue births): 'cylinder'
// (columns identified preserving; rows free — two rim circles) and 'mobius'
// (columns identified REVERSED; rows free — one rim circle through the
// half-twist). Same subdivide→identify→immerse pattern, same gluing-consistency
// guard; their rims read decomposeLink valence 'boundary' (free edges), the
// interior 'interior'.
//
// C1 (additive): 'sphere' — the COLLAPSE target (D²/∂D² = S²; no gluing word).
// The u-wrap closes the longitudes and each POLE ROW collapses to its point;
// pole-adjacent grid cells become real TRIANGLES of the quotient (not a
// degeneracy — the strict quad guard stays for every worded surface). Closed,
// orientable: χ=2, w₁ trivial, every link interior.
export type ImmersedSurfaceKey = 'torus' | 'klein' | 'rp2' | 'cylinder' | 'mobius' | 'sphere';

export interface SurfaceImmersionSpec {
  surface: ImmersedSurfaceKey;
  resolution: number; // grid cells per side; integer >= 4 (rejected loudly below)
}

export interface GridPointRef {
  i: number;
  j: number;
  u: number; // i / resolution — fundamental-square coordinate in [0,1]
  v: number; // j / resolution
}

export interface QuotientCorrespondence {
  surface: ImmersedSurfaceKey;
  resolution: number;
  word: string; // the fundamental-polygon gluing word (capital = inverse)
  gridVertexTo: Record<string, VertexId>; // "i,j" -> the merged shape vertex it landed on
  vertexClasses: Record<VertexId, GridPointRef[]>; // merged vertex -> absorbed grid points (>1 ⟺ a boundary identification landed here)
  faceCells: Record<FaceId, { i: number; j: number }>; // face -> its grid cell origin
}

export interface SurfaceImmersion {
  shape: Shape;
  correspondence: QuotientCorrespondence;
}

// Perimeter reading [bottom, right, top, left]; capitals = inverse; for the open
// surfaces `b` is the one glued pair and `a`/`c` are FREE (rim) edges.
const WORDS: Record<ImmersedSurfaceKey, string> = {
  torus: 'abAB',
  klein: 'abaB',
  rp2: 'abab',
  cylinder: 'abcB',
  mobius: 'abcb',
  sphere: '', // NO gluing word — the collapse target (pole rows collapse; u wraps)
};

// How far identified grid points' immersion positions may drift apart before we
// call the parametrization inconsistent with the gluing (floating-point slack
// on exact trig identities like cos(π) = −1).
const GLUING_EPSILON = 1e-6;

// ---------------------------------------------------------------------------
// the per-surface immersion maps (u, v ∈ [0,1] on the fundamental square)
// ---------------------------------------------------------------------------

// Exported so the diagnostic can independently verify the gluing-consistency
// invariant: every member of a merged class maps to the same R³ point.
export function immersionPosition(surface: ImmersedSurfaceKey, u: number, v: number): Vec3 {
  // Scales are chosen for the committed playground viewport, whose vertex
  // spheres are a FIXED 0.07 radius: the surfaces are sized large enough that
  // the spheres read as small studs, not a ball-pit hiding the surface.
  if (surface === 'torus') {
    // the donut: both wraps periodic — trivially consistent with abAB.
    const R0 = 2.75;
    const r0 = 1.25;
    const theta = 2 * Math.PI * u;
    const phi = 2 * Math.PI * v;
    const ring = R0 + r0 * Math.cos(phi);
    return [ring * Math.cos(theta), r0 * Math.sin(phi), ring * Math.sin(theta)];
  }

  if (surface === 'klein') {
    // the figure-8 immersion: r(θ,v) = C + cos(θ/2)·sin v − sin(θ/2)·sin 2v.
    // K(θ+2π, v) = K(θ, −v) — exactly the reversed wrap (0,j) ~ (R, R−j);
    // v is 2π-periodic — the preserving wrap (i,0) ~ (i,R). C=2 keeps r > 0.
    const S = 1.4;
    const C = 2;
    const theta = 2 * Math.PI * u;
    const vv = 2 * Math.PI * v;
    const half = theta / 2;
    const r = C + Math.cos(half) * Math.sin(vv) - Math.sin(half) * Math.sin(2 * vv);
    return [S * r * Math.cos(theta), S * (Math.sin(half) * Math.sin(vv) + Math.cos(half) * Math.sin(2 * vv)), S * r * Math.sin(theta)];
  }

  if (surface === 'cylinder') {
    // the tube: the u-wrap is periodic (trivially consistent with the preserving
    // column identification); v is OPEN — the two rims are free circles.
    const Rc = 2.2;
    const H = 2.6;
    const theta = 2 * Math.PI * u;
    return [Rc * Math.cos(theta), H * (v - 0.5), Rc * Math.sin(theta)];
  }

  if (surface === 'mobius') {
    // the half-twist band: M(θ+2π, v) = M(θ, 1−v) — exactly the reversed column
    // identification (0,j) ~ (R, R−j); v is OPEN — one rim circle through the twist.
    const Rm = 2.4;
    const W = 1.7;
    const theta = 2 * Math.PI * u;
    const w = (v - 0.5) * W;
    const r = Rm + w * Math.cos(theta / 2);
    return [r * Math.cos(theta), w * Math.sin(theta / 2), r * Math.sin(theta)];
  }

  if (surface === 'sphere') {
    // the round sphere (the collapse target): the u-wrap is periodic; at each
    // pole (v=0 / v=1) sin φ vanishes, so the whole pole ROW maps to its one
    // point — the row-collapse identification is consistent by construction.
    const Rs = 2.2;
    const theta = 2 * Math.PI * u;
    const phi = Math.PI * v;
    const s = Math.sin(phi);
    return [Rs * s * Math.cos(theta), Rs * Math.cos(phi), Rs * s * Math.sin(theta)];
  }

  // rp2 — the cross-cap. Square → disk radially (sup-norm radius, so the
  // square's perimeter-antipodal identification becomes the disk's
  // boundary-antipodal one), then the standard cross-cap map, whose boundary
  // (ρ=1 ⇒ sin 2v_c = 0) collapses antipodal pairs to one point. The two
  // Whitney pinch points are the cross-cap's own (the standard rendering).
  const S = 5.5;
  const dx = u - 0.5;
  const dy = v - 0.5;
  const rho = 2 * Math.max(Math.abs(dx), Math.abs(dy)); // 0 at centre, 1 on the square boundary
  const alpha = Math.atan2(dy, dx);
  const vc = (rho * Math.PI) / 2;
  const x = 0.5 * Math.cos(alpha) * Math.sin(2 * vc);
  const y = 0.5 * Math.sin(alpha) * Math.sin(2 * vc);
  const z = 0.5 * (Math.cos(vc) * Math.cos(vc) - Math.cos(alpha) * Math.cos(alpha) * Math.sin(vc) * Math.sin(vc));
  return [S * x, S * z, S * y];
}

// ---------------------------------------------------------------------------
// the quotient: boundary identifications per gluing word (union-find)
// ---------------------------------------------------------------------------

const gridKey = (i: number, j: number): string => `${i},${j}`;

function makeUnionFind() {
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    if (!parent.has(x)) parent.set(x, x);
    let root = x;
    while (parent.get(root) !== root) root = parent.get(root) as string;
    let cursor = x;
    while (parent.get(cursor) !== root) {
      const next = parent.get(cursor) as string;
      parent.set(cursor, root);
      cursor = next;
    }
    return root;
  };
  const union = (a: string, b: string): void => {
    parent.set(find(a), find(b));
  };
  return { find, union };
}

// The boundary identifications the gluing word induces on the (R+1)² grid:
//   torus    abAB: (i,0)~(i,R) and (0,j)~(R,j)       — both wraps preserving;
//   klein    abaB: (i,0)~(i,R) and (0,j)~(R,R−j)     — one preserving, one reversed;
//   rp2      abab: (i,0)~(R−i,R) and (0,j)~(R,R−j)   — both reversed (perimeter-antipodal);
//   cylinder abcB: (0,j)~(R,j) ONLY                  — one preserving wrap; rows FREE (two rims);
//   mobius   abcb: (0,j)~(R,R−j) ONLY                — one reversed wrap; rows FREE (one rim).
function applyIdentifications(surface: ImmersedSurfaceKey, R: number, union: (a: string, b: string) => void): void {
  if (surface === 'sphere') {
    // no gluing word: the u-wrap closes the longitudes; each POLE ROW collapses
    // to its single point (the collapse target — closed, orientable).
    for (let j = 0; j <= R; j += 1) {
      union(gridKey(0, j), gridKey(R, j));
    }
    for (let i = 0; i < R; i += 1) {
      union(gridKey(i, 0), gridKey(i + 1, 0));
      union(gridKey(i, R), gridKey(i + 1, R));
    }
    return;
  }
  const open = surface === 'cylinder' || surface === 'mobius';
  if (!open) {
    for (let i = 0; i <= R; i += 1) {
      if (surface === 'rp2') {
        union(gridKey(i, 0), gridKey(R - i, R));
      } else {
        union(gridKey(i, 0), gridKey(i, R));
      }
    }
  }
  for (let j = 0; j <= R; j += 1) {
    if (surface === 'torus' || surface === 'cylinder') {
      union(gridKey(0, j), gridKey(R, j));
    } else {
      union(gridKey(0, j), gridKey(R, R - j));
    }
  }
}

// ---------------------------------------------------------------------------
// immerseSurface — the R0 constructor
// ---------------------------------------------------------------------------

export function immerseSurface(spec: SurfaceImmersionSpec): SurfaceImmersion {
  const { surface, resolution: R } = spec;
  if (WORDS[surface] === undefined) {
    throw new Error(
      `surfaceImmersion: unknown surface "${surface}" (expected torus | klein | rp2 | cylinder | mobius | sphere)`,
    );
  }
  if (!Number.isInteger(R) || R < 4) {
    throw new Error(`surfaceImmersion: resolution ${R} — the subdivision needs an integer resolution >= 4`);
  }

  const shapeId: ShapeId = `shape:immersion:${surface}:${R}`;

  // (1)+(2) subdivide + apply the gluing word.
  const { find, union } = makeUnionFind();
  for (let i = 0; i <= R; i += 1) {
    for (let j = 0; j <= R; j += 1) find(gridKey(i, j));
  }
  applyIdentifications(surface, R, union);

  // classes: root -> absorbed grid points; representative = lexicographically
  // smallest (i, j) — deterministic.
  const membersByRoot = new Map<string, GridPointRef[]>();
  for (let i = 0; i <= R; i += 1) {
    for (let j = 0; j <= R; j += 1) {
      const root = find(gridKey(i, j));
      const ref: GridPointRef = { i, j, u: i / R, v: j / R };
      const members = membersByRoot.get(root);
      if (members) {
        members.push(ref);
      } else {
        membersByRoot.set(root, [ref]);
      }
    }
  }

  // (3) immerse: one merged vertex per class, positioned at its representative's
  // parameter point — with the gluing-consistency invariant ENFORCED: every
  // member of the class must map to the same R³ point (else the parametrization
  // does not respect the gluing word, and we fail loudly rather than render a lie).
  const vertices: Record<VertexId, Vertex> = {};
  const gridVertexTo: Record<string, VertexId> = {};
  const vertexClasses: Record<VertexId, GridPointRef[]> = {};
  for (const members of membersByRoot.values()) {
    const sorted = [...members].sort((a, b) => a.i - b.i || a.j - b.j);
    const rep = sorted[0];
    const vertexId: VertexId = `v${rep.i}x${rep.j}`;
    const position = immersionPosition(surface, rep.u, rep.v);
    for (const member of sorted) {
      const memberPosition = immersionPosition(surface, member.u, member.v);
      const drift = Math.hypot(
        memberPosition[0] - position[0],
        memberPosition[1] - position[1],
        memberPosition[2] - position[2],
      );
      if (!Number.isFinite(drift) || drift > GLUING_EPSILON) {
        throw new Error(
          `surfaceImmersion: ${surface} parametrization violates the gluing at grid (${member.i},${member.j}) — drift ${drift} from class ${vertexId}`,
        );
      }
      gridVertexTo[gridKey(member.i, member.j)] = vertexId;
    }
    vertices[vertexId] = {
      id: vertexId,
      position,
      // LEGIBILITY MIGRATION (B-2026-08-23-A, census site 6, sanctioned
      // frozen edit): the immersion grid mints TRUE ABSENCE — an id in the
      // name slot is no name. A from-scratch root has no lineage to resolve
      // through; the honest reading is `unnamed`, never the address.
      data: createDefaultVertexData(''),
      createdBy: {
        shapeId,
        operation: 'seed', // a from-scratch root — R0 makes NO lineage claim (L2 owns that)
        sourceVertexIds: [],
      },
    };
    vertexClasses[vertexId] = sorted;
  }

  // (4) faces = the R² grid cells over merged classes (degenerate cells rejected).
  const faces: Face[] = [];
  const faceCells: Record<FaceId, { i: number; j: number }> = {};
  for (let i = 0; i < R; i += 1) {
    for (let j = 0; j < R; j += 1) {
      const quad = [
        gridVertexTo[gridKey(i, j)],
        gridVertexTo[gridKey(i + 1, j)],
        gridVertexTo[gridKey(i + 1, j + 1)],
        gridVertexTo[gridKey(i, j + 1)],
      ];
      // sphere ONLY: a pole-row cell's two pole corners are ONE vertex of the
      // quotient — the cell is a real TRIANGLE (cyclic consecutive-duplicate
      // dedup), not a degeneracy. Every worded surface keeps the strict quad.
      const cycle =
        surface === 'sphere' ? quad.filter((v, k) => v !== quad[(k + 1) % quad.length]) : quad;
      if (new Set(cycle).size !== cycle.length || cycle.length < 3) {
        throw new Error(
          `surfaceImmersion: ${surface} R=${R} grid cell (${i},${j}) degenerates under the identification (repeated vertex)`,
        );
      }
      const faceId: FaceId = `face:immersion:${surface}:${R}:${i}x${j}`;
      faces.push({ id: faceId, vertexIds: cycle, role: 'seed-face' });
      faceCells[faceId] = { i, j };
    }
  }

  const shape: Shape = {
    id: shapeId,
    name: surface,
    vertices,
    edges: deriveEdges(faces, shapeId),
    faces,
    cells: [],
    generations: [],
    genealogy: {
      parentShapeId: null,
      operation: 'seed',
      generationDepth: 0,
      sourceVertexIds: [],
      createdVertexIds: Object.keys(vertices),
      createdAt: '',
    },
  };

  return {
    shape,
    correspondence: {
      surface,
      resolution: R,
      word: WORDS[surface],
      gridVertexTo,
      vertexClasses,
      faceCells,
    },
  };
}
