// B-104 — RUNG 2: THE SURFACE DECK-TILING (ADR 0025, Accepted, tracked at
// c7cd138). The explore-window renders a surface as its deck-tiling in the
// conformal model of its curvature — Poincaré disk / plane / stereographic —
// from its {p,q}. THE STANDARD: one Schläfli symbol; the cell never changes;
// only q — how many flat cells meet at a vertex — and that mismatch IS the
// curvature (the engine's own DEFICIT/FLAT/EXCESS read at a tiling vertex).
//
// {p,q} is STORED NOWHERE (record-not-reading): p reads off the complex's
// face cycles, q off the interior vertex links — both through the FROZEN
// readers (classifyLevel3Soundness's own vertexLinks), consumed never edited.
//
// THE METHOD (Δ6, hyperbolic-anchored): the reflect-across-edge generator in
// the Poincaré disk (a geodesic reflection is a circle-inversion in the
// unique circle orthogonal to the boundary through the edge's endpoints);
// euclidean derives as the plane (line mirrors — the same reflection, the
// orthogonal circle grown flat); spherical as the stereographic projection of
// the seed solid (the pole-containing cell is the whole EXTERIOR). Ported
// from the designer reference (.handoff/instruments/tiling_reference/ —
// computed and checked, not imagined) and pinned by its own traps:
//   · cosh R = cot(π/p)·cot(π/q) — the naive form cos(π/p)/sin(π/q) makes
//     the corner read 79.47° where 72° is owed (the witness bites it);
//   · dedup is (1−|c|²)-SCALED — exact rounding never matches under repeated
//     inversion drift and the walk unrolls into the TREE instead of closing
//     its cycles (the witness pins closed < tree);
//   · the rim is INFINITY — addressed, never drawn as a wall a person could
//     mistake for an edge; a cell below the LOD floor is DROPPED, never
//     drawn wrong.
// THE DESCENT LAW (ADR §3): a tiling descends to a quotient surface iff the
// identifying symmetry σ is (a) a symmetry of the tiling and (b) FREE —
// CHECKED, never assumed (cube ✔ · octa ✔ · tetra ✘ — the LAW-24 control
// that must fail).
import { createSeedShape } from '../data/seeds';

type V2 = [number, number];
type V3 = [number, number, number];

export type TilingGeometry = 'spherical' | 'euclidean' | 'hyperbolic';

export interface TileCell {
  outline: V2[]; // the sampled boundary (geodesic arcs pre-sampled — the window draws polylines)
  corners: V2[]; // the p true corners
  center: V2;
  depth: number; // BFS ring; 0 = the base cell
  farSide?: boolean; // spherical: the cell lies on the projection-pole side — shows through, drawn faint
  exterior?: boolean; // spherical: the pole cell — its image is the whole plane OUTSIDE the drawn tiling
}

export interface DeckTiling {
  p: number;
  q: number;
  geometry: TilingGeometry;
  coshR: number;
  // TWO corner facts, both owed: the FLAT cell's own corner ((p−2)·180/p) —
  // the caption's countable arithmetic (q × it = the GAP/FLAT/OVERLAP sum) —
  // and the DRAWN conformal corner (360/q exactly, every geometry: the q
  // cells around a vertex share the full turn — the fit's 0.01° invariant)
  flatCornerDeg: number;
  drawnCornerDeg: number;
  angleSumDeg: number; // q × flatCornerDeg — GAP (<360) · FLAT (=360) · OVERLAP (>360)
  cells: TileCell[];
  // the COUNTABLE vertex — ring it, count the cells (the ADR's own check)
  ring: { at: V2; cellIndices: number[] } | null;
  rim: boolean; // hyperbolic: the horizon circle exists (addressed, not a wall)
  dropped: number; // LOD/rim-dropped candidates — never drawn wrong
  // descent marks (a non-orientable spherical surface): the antipodal pairs,
  // present exactly when the CHECK passed on this tiling's own cells
  descent: { pairs: [number, number][] } | null;
}

export type TilingResolution =
  | { ok: true; tiling: DeckTiling }
  // counted facts only — wording beyond them is the designer's (flagged)
  | { ok: false; reason: string };

// ---------------------------------------------------------------------------
// {p,q} — read off the complex through the frozen readers
// ---------------------------------------------------------------------------

// the complex this model consumes is the ACQUIRED quotient complex — the
// same object the identify trace and the mode derivation already read
// (acquireComplex's own product: merged vertex classes, edges with u/v,
// faces as edge-boundary cycles — structural, multi-edge-safe)
export interface SchlafliComplex {
  vertices: readonly string[];
  edges: ReadonlyArray<{ id: string; u: string; v: string }>;
  faces: ReadonlyArray<{ boundary: ReadonlyArray<{ edge: string; dir: 1 | -1 }> }>;
}

export function readSchlafli(
  complex: SchlafliComplex,
): { ok: true; p: number; q: number } | { ok: false; reason: string } {
  if (complex.faces.length === 0) {
    return { ok: false, reason: 'no 2-cells here — the deck-tiling reads a surface' };
  }
  // closedness: every edge class borders exactly TWO face-sides — one side
  // is a boundary edge; more than two is a junction, not a surface at all
  const sides = new Map<string, number>();
  for (const face of complex.faces) for (const b of face.boundary) sides.set(b.edge, (sides.get(b.edge) ?? 0) + 1);
  const freeEdges = [...sides.values()].filter((n) => n === 1).length;
  const junctionEdges = [...sides.values()].filter((n) => n > 2).length;
  if (junctionEdges > 0) {
    return {
      ok: false,
      reason: `not a surface here — ${junctionEdges} edge class${junctionEdges === 1 ? '' : 'es'} border${junctionEdges === 1 ? 's' : ''} more than two faces`,
    };
  }
  if (freeEdges > 0) {
    return {
      ok: false,
      reason: `the deck-tiling reads a CLOSED surface — this one has a boundary (${freeEdges} free edge class${freeEdges === 1 ? '' : 'es'})`,
    };
  }
  // p — every face's cycle length; q — the corner census per vertex class
  // (the corner between consecutive boundary slots sits at the head of the
  // incoming edge: dir +1 → v, dir −1 → u)
  const edgeById = new Map(complex.edges.map((e) => [e.id, e]));
  const corners = new Map<string, number>();
  const ps = new Set<number>();
  for (const face of complex.faces) {
    ps.add(face.boundary.length);
    for (const b of face.boundary) {
      const edge = edgeById.get(b.edge);
      if (!edge) return { ok: false, reason: `the complex cites edge ${b.edge} it does not carry` };
      const head = b.dir === 1 ? edge.v : edge.u;
      corners.set(head, (corners.get(head) ?? 0) + 1);
    }
  }
  const psSorted = [...ps].sort((a, b) => a - b);
  const qs = [...new Set([...corners.values()])].sort((a, b) => a - b);
  if (psSorted.length !== 1 || qs.length !== 1) {
    return {
      ok: false,
      reason: `no single {p,q}: faces of ${psSorted.join('·')} corners · vertex valences {${qs.join(', ')}}`,
    };
  }
  return { ok: true, p: psSorted[0], q: qs[0] };
}

export const coshROf = (p: number, q: number): number =>
  (1 / Math.tan(Math.PI / p)) * (1 / Math.tan(Math.PI / q));

export const geometryOf = (p: number, q: number): TilingGeometry => {
  const s = (p - 2) * (q - 2) - 4;
  return s < 0 ? 'spherical' : s === 0 ? 'euclidean' : 'hyperbolic';
};

// ---------------------------------------------------------------------------
// the reflection engine (the reference's own mechanics, ported verbatim)
// ---------------------------------------------------------------------------

const orthoCircle = (v1: V2, v2: V2): [number, number, number] | null => {
  const a1 = 2 * v1[0];
  const b1 = 2 * v1[1];
  const c1 = v1[0] * v1[0] + v1[1] * v1[1] + 1;
  const a2 = 2 * v2[0];
  const b2 = 2 * v2[1];
  const c2 = v2[0] * v2[0] + v2[1] * v2[1] + 1;
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-12) return null; // the geodesic through the origin — a straight line
  const Cx = (c1 * b2 - c2 * b1) / det;
  const Cy = (a1 * c2 - a2 * c1) / det;
  const r2 = Cx * Cx + Cy * Cy - 1.0;
  return r2 <= 1e-12 ? null : [Cx, Cy, Math.sqrt(r2)];
};

const invert = (pt: V2, c: [number, number, number]): V2 => {
  const [Cx, Cy, rho] = c;
  const dx = pt[0] - Cx;
  const dy = pt[1] - Cy;
  const dd = dx * dx + dy * dy;
  if (dd < 1e-15) return pt;
  const k = (rho * rho) / dd;
  return [Cx + dx * k, Cy + dy * k];
};

const reflectLine = (poly: V2[], v1: V2, v2: V2): V2[] => {
  let ax = v2[0] - v1[0];
  let ay = v2[1] - v1[1];
  const L = Math.hypot(ax, ay) || 1e-9;
  ax /= L;
  ay /= L;
  return poly.map(([px, py]) => {
    const wx = px - v1[0];
    const wy = py - v1[1];
    const dot = wx * ax + wy * ay;
    return [v1[0] + 2 * dot * ax - wx, v1[1] + 2 * dot * ay - wy] as V2;
  });
};

const reflectAcross = (poly: V2[], i: number, curved: boolean): V2[] => {
  const v1 = poly[i];
  const v2 = poly[(i + 1) % poly.length];
  if (!curved) return reflectLine(poly, v1, v2);
  const c = orthoCircle(v1, v2);
  if (c === null) return reflectLine(poly, v1, v2);
  return poly.map((pt) => invert(pt, c));
};

// the geodesic arc between two disk points, sampled (straight when the
// orthogonal circle degenerates to a diameter — or in the plane)
const sampleEdge = (v1: V2, v2: V2, curved: boolean, n = 16): V2[] => {
  if (!curved) return [v1, v2];
  const c = orthoCircle(v1, v2);
  if (c === null) return [v1, v2];
  const [Cx, Cy, rho] = c;
  const a1 = Math.atan2(v1[1] - Cy, v1[0] - Cx);
  const a2 = Math.atan2(v2[1] - Cy, v2[0] - Cx);
  const da = ((a2 - a1 + Math.PI) % (2 * Math.PI)) - Math.PI;
  const out: V2[] = [];
  for (let t = 0; t <= n; t += 1) out.push([Cx + rho * Math.cos(a1 + (da * t) / n), Cy + rho * Math.sin(a1 + (da * t) / n)]);
  return out;
};

// the drift-tolerant centre dedup: tol = max(2e-4, scale·(1−|c|²)) on a 0.05
// spatial hash — the (1−|c|²) scale IS the mechanism (cells shrink toward the
// rim; a constant tol either misses rim cycles or merges the centre)
class CentreHash {
  private g = new Map<string, V2[]>();
  constructor(private readonly scaled: boolean) {}
  seen(cx: number, cy: number): boolean {
    const tol = this.scaled ? Math.max(2e-4, 0.06 * (1 - (cx * cx + cy * cy))) : 1e-4;
    const step = 0.05;
    const i = Math.floor(cx / step);
    const j = Math.floor(cy / step);
    for (let di = -1; di <= 1; di += 1)
      for (let dj = -1; dj <= 1; dj += 1) {
        const cell = this.g.get(`${i + di},${j + dj}`);
        if (cell) for (const [ox, oy] of cell) if (Math.hypot(ox - cx, oy - cy) < tol) return true;
      }
    const key = `${i},${j}`;
    const list = this.g.get(key);
    if (list) list.push([cx, cy]);
    else this.g.set(key, [[cx, cy]]);
    return false;
  }
}

const centreOf = (poly: V2[]): V2 => [
  poly.reduce((s, pt) => s + pt[0], 0) / poly.length,
  poly.reduce((s, pt) => s + pt[1], 0) / poly.length,
];

interface ReflectOptions {
  depth: number;
  minEdge: number; // LOD floor: below it the cell is DROPPED, never drawn wrong
  bound: number; // euclidean: |centre| stop; hyperbolic: the 0.998 rim clip on corners
  dedup?: boolean; // the witness's tree control turns this off
}

// the one generator — disk (curved) and plane (flat) are the same walk with
// the reflection's flat limit; returns cells + the dropped count
function reflectTiling(base: V2[], curved: boolean, opts: ReflectOptions): { cells: TileCell[]; dropped: number } {
  const hash = new CentreHash(curved);
  const dedup = opts.dedup !== false;
  const outlineOf = (poly: V2[]): V2[] => {
    const out: V2[] = [];
    for (let i = 0; i < poly.length; i += 1) {
      const seg = sampleEdge(poly[i], poly[(i + 1) % poly.length], curved);
      for (const pt of seg) out.push(pt);
    }
    return out;
  };
  const cells: TileCell[] = [{ outline: outlineOf(base), corners: base, center: centreOf(base), depth: 0 }];
  hash.seen(...centreOf(base));
  let frontier: V2[][] = [base];
  let dropped = 0;
  for (let d = 1; d <= opts.depth; d += 1) {
    const next: V2[][] = [];
    for (const poly of frontier) {
      for (let i = 0; i < poly.length; i += 1) {
        const np = reflectAcross(poly, i, curved);
        if (curved && np.some((pt) => pt[0] * pt[0] + pt[1] * pt[1] > 0.998)) {
          dropped += 1; // the rim is infinity — a cell reaching it is not drawn wrong
          continue;
        }
        let per = 0;
        for (let j = 0; j < np.length; j += 1)
          per += Math.hypot(np[j][0] - np[(j + 1) % np.length][0], np[j][1] - np[(j + 1) % np.length][1]);
        if (per < opts.minEdge) {
          dropped += 1; // LOD: the mark STOPS, never degrades
          continue;
        }
        const [cx, cy] = centreOf(np);
        if (!curved && Math.hypot(cx, cy) > opts.bound) continue; // the plane's window
        if (dedup && hash.seen(cx, cy)) continue;
        cells.push({ outline: outlineOf(np), corners: np, center: [cx, cy], depth: d });
        next.push(np);
      }
    }
    frontier = next;
    if (frontier.length === 0) break;
  }
  return { cells, dropped };
}

// the countable vertex: the base cell's first corner + every cell holding it
function ringAt(cells: TileCell[], at: V2, tolBase: number, scaled: boolean): { at: V2; cellIndices: number[] } {
  const tol = scaled ? Math.max(2e-3, 0.04 * (1 - (at[0] * at[0] + at[1] * at[1]))) : tolBase;
  const cellIndices: number[] = [];
  cells.forEach((cell, k) => {
    if (cell.corners.some((c) => Math.hypot(c[0] - at[0], c[1] - at[1]) < tol)) cellIndices.push(k);
  });
  return { at, cellIndices };
}

// ---------------------------------------------------------------------------
// the three conformal models
// ---------------------------------------------------------------------------

export function hyperbolicTiling(p: number, q: number, depth = 6): DeckTiling {
  const coshR = coshROf(p, q);
  const rEuc = Math.tanh(Math.acosh(coshR) / 2);
  const base: V2[] = [];
  for (let k = 0; k < p; k += 1) {
    const a = ((2 * Math.PI) / p) * k + Math.PI / p;
    base.push([rEuc * Math.cos(a), rEuc * Math.sin(a)]);
  }
  const { cells, dropped } = reflectTiling(base, true, { depth, minEdge: 0.02, bound: 1 });
  return {
    p,
    q,
    geometry: 'hyperbolic',
    coshR,
    flatCornerDeg: ((p - 2) * 180) / p,
    drawnCornerDeg: 360 / q,
    angleSumDeg: (q * ((p - 2) * 180)) / p,
    cells,
    ring: ringAt(cells, base[0], 2e-3, true),
    rim: true,
    dropped,
    descent: null,
  };
}

export function euclideanTiling(p: number, q: number, bound = 3.4): DeckTiling {
  // the flat regular p-gon whose corner is exactly 360/q — the euclidean
  // symbols close identically ((p−2)·180/p = 360/q ⟺ (p−2)(q−2) = 4)
  const base: V2[] = [];
  for (let k = 0; k < p; k += 1) {
    const a = ((2 * Math.PI) / p) * k + Math.PI / p;
    base.push([Math.cos(a), Math.sin(a)]);
  }
  const { cells, dropped } = reflectTiling(base, false, { depth: 7, minEdge: 0.02, bound });
  return {
    p,
    q,
    geometry: 'euclidean',
    coshR: coshROf(p, q),
    flatCornerDeg: ((p - 2) * 180) / p,
    drawnCornerDeg: 360 / q,
    angleSumDeg: (q * ((p - 2) * 180)) / p,
    cells,
    ring: ringAt(cells, base[0], 1e-3, false),
    rim: false,
    dropped,
    descent: null,
  };
}

// the spherical seeds this engine owns (record-not-reading: built from the
// committed seed shapes; {4,2} — the square dihedron, RP²'s double cover —
// is the one literal, four equator corners and two cap cells)
export interface SphericalFace {
  key: string;
  vertexKeys: string[];
  // the patch's identity on the sphere: its spherical centroid — the face IS
  // its patch, not its corner set (the {4,2} dihedron's two caps share all
  // four corners; only the patch tells them apart — measured degeneracy)
  centroid: V3;
}

function sphericalSolid(p: number, q: number): { verts: Map<string, V3>; faces: SphericalFace[] } | null {
  const fromSeed = (seedKey: 'tetrahedron' | 'cube' | 'octahedron') => {
    const shape = createSeedShape(seedKey);
    const verts = new Map<string, V3>();
    for (const v of Object.values(shape.vertices)) verts.set(v.id, norm3(v.position as V3));
    const faces: SphericalFace[] = shape.faces.map((f) => {
      const vs = f.vertexIds.map((id) => verts.get(id) as V3);
      return {
        key: f.id,
        vertexKeys: [...f.vertexIds],
        centroid: norm3([
          vs.reduce((s, v) => s + v[0], 0),
          vs.reduce((s, v) => s + v[1], 0),
          vs.reduce((s, v) => s + v[2], 0),
        ]),
      };
    });
    return { verts, faces };
  };
  if (p === 3 && q === 3) return fromSeed('tetrahedron');
  if (p === 4 && q === 3) return fromSeed('cube');
  if (p === 3 && q === 4) return fromSeed('octahedron');
  if (p === 4 && q === 2) {
    const verts = new Map<string, V3>([
      ['e0', [1, 0, 0]],
      ['e1', [0, 1, 0]],
      ['e2', [-1, 0, 0]],
      ['e3', [0, -1, 0]],
    ]);
    return {
      verts,
      faces: [
        { key: 'cap:north', vertexKeys: ['e0', 'e1', 'e2', 'e3'], centroid: [0, 0, 1] },
        { key: 'cap:south', vertexKeys: ['e3', 'e2', 'e1', 'e0'], centroid: [0, 0, -1] },
      ],
    };
  }
  return null;
}

// rotate the sphere so `target` lands on +z — the projection pole is PLACED
// at a face's patch centre, so the pole cell is the exterior BY CONSTRUCTION
// (an edge-sampling test never trips: the pole sits in a face's INTERIOR)
function rotationTo(target: V3): (v: V3) => V3 {
  const [x, y, z] = target;
  const axisLen = Math.hypot(x, y);
  if (axisLen < 1e-12) {
    if (z > 0) return (v) => v;
    return (v) => [v[0], -v[1], -v[2]]; // 180° about x
  }
  // the axis ⟂ target in the xy-plane; angle from target to +z
  const ax = -y / axisLen;
  const ay = x / axisLen;
  const ang = Math.acos(Math.max(-1, Math.min(1, z)));
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  return (v) => {
    // Rodrigues about (ax, ay, 0)
    const dot = ax * v[0] + ay * v[1];
    const crossX = ay * v[2];
    const crossY = -ax * v[2];
    const crossZ = ax * v[1] - ay * v[0];
    return [
      v[0] * c + crossX * s + ax * dot * (1 - c),
      v[1] * c + crossY * s + ay * dot * (1 - c),
      v[2] * c + crossZ * s,
    ];
  };
}

const slerp = (a: V3, b: V3, t: number): V3 => {
  const raw: V3 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const m = Math.hypot(raw[0], raw[1], raw[2]) || 1e-9;
  return [raw[0] / m, raw[1] / m, raw[2] / m];
};

const stereo = (v: V3): V2 | null => {
  const den = 1 - v[2];
  return den < 1e-6 ? null : [v[0] / den, v[1] / den];
};

export function sphericalTiling(p: number, q: number, wantDescent: boolean): DeckTiling | null {
  const raw = sphericalSolid(p, q);
  if (!raw) return null;
  // PLACE the projection pole at face 0's patch centre — the pole cell is
  // the whole EXTERIOR by construction (the reference's own presentation;
  // an edge-sampling test never trips because the pole sits in the face's
  // INTERIOR — measured on the cube seed before this rotation existed)
  const rotate = rotationTo(raw.faces[0].centroid);
  const verts = new Map<string, V3>();
  for (const [key, v] of raw.verts) verts.set(key, norm3(rotate(v)));
  const faces: SphericalFace[] = raw.faces.map((f) => ({ ...f, centroid: norm3(rotate(f.centroid)) }));
  const cells: TileCell[] = [];
  faces.forEach((face, index) => {
    const vs = face.vertexKeys.map((k) => verts.get(k) as V3);
    if (index === 0) {
      // the pole cell — its stereographic image is everything OUTSIDE the
      // drawn tiling; its edges are its neighbours' edges, already drawn
      cells.push({ outline: [], corners: [], center: [0, 0], depth: 1, exterior: true });
      return;
    }
    const outline: V2[] = [];
    for (let i = 0; i < vs.length; i += 1) {
      const a = vs[i];
      const b = vs[(i + 1) % vs.length];
      for (let t = 0; t <= 20; t += 1) {
        const pt = stereo(slerp(a, b, t / 20));
        if (pt !== null) outline.push(pt);
      }
    }
    const corners = vs.map(stereo).filter((c): c is V2 => c !== null);
    cells.push({
      outline,
      corners,
      center: corners.length > 0 ? centreOf(corners) : [0, 0],
      depth: 0,
      // the far side SHOWS THROUGH the stereographic plate — drawn faint
      // (the ink stack's renderOrder+depthWrite:false idiom, 2D register)
      farSide: face.centroid[2] > 0,
    });
  });
  // the countable vertex: the LOWEST vertex (farthest from the pole — the
  // least-distorted ring on the plate)
  let ring: DeckTiling['ring'] = null;
  let low: { key: string; z: number } | null = null;
  for (const [key, v] of verts) if (low === null || v[2] < low.z) low = { key, z: v[2] };
  if (low) {
    const at = stereo(verts.get(low.key) as V3);
    if (at) {
      const idx: number[] = [];
      faces.forEach((f, k) => {
        if (f.vertexKeys.includes(low!.key)) idx.push(k);
      });
      ring = { at, cellIndices: idx };
    }
  }
  // descent — CHECKED on this tiling's own cells, never assumed
  let descent: DeckTiling['descent'] = null;
  if (wantDescent) {
    const verdict = tilingDescends(faces, verts);
    if (verdict.descends) descent = { pairs: verdict.pairs };
  }
  return {
    p,
    q,
    geometry: 'spherical',
    coshR: coshROf(p, q),
    flatCornerDeg: ((p - 2) * 180) / p,
    drawnCornerDeg: 360 / q,
    angleSumDeg: (q * ((p - 2) * 180)) / p,
    cells,
    ring,
    rim: false,
    dropped: 0,
    descent,
  };
}

function norm3(v: V3): V3 {
  const m = Math.hypot(v[0], v[1], v[2]) || 1e-9;
  return [v[0] / m, v[1] / m, v[2] / m];
}

// ---------------------------------------------------------------------------
// THE DESCENT CHECK — σ ∈ Sym(tiling) ∧ free, checked never assumed
// ---------------------------------------------------------------------------

// σ = −I. THE CHECK (ADR §3, the reference's own assert made non-degenerate):
// (a) σ is a SYMMETRY of the tiling — every VERTEX has an antipodal vertex
//     (tetra ✘ lives exactly here: −v is a face centre, not a corner) and
//     every FACE PATCH has an antipodal face patch (keyed by the patch's
//     spherical centroid — the corner SET cannot tell the {4,2} dihedron's
//     two caps apart, they share all four corners; the patch can);
// (b) σ is FREE — no fixed vertex, no fixed patch (−c = c is impossible on
//     the unit sphere, and a fixed corner would mean v = −v likewise; both
//     stated as checks, not trusted as algebra).
export function tilingDescends(
  faces: ReadonlyArray<SphericalFace>,
  verts: Map<string, V3>,
): { descends: boolean; reason: string | null; pairs: [number, number][] } {
  const near = (a: V3, b: V3): boolean => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 1e-6;
  // (a) on the corners
  for (const [key, v] of verts) {
    const anti: V3 = [-v[0], -v[1], -v[2]];
    let image: string | null = null;
    for (const [k2, v2] of verts)
      if (near(v2, anti)) {
        image = k2;
        break;
      }
    if (image === null)
      return { descends: false, reason: `σ carries the corner ${key} to no corner — not a symmetry of the tiling`, pairs: [] };
    if (image === key) return { descends: false, reason: `σ fixes the corner ${key} — not free`, pairs: [] };
  }
  // (a)+(b) on the patches
  const pairs: [number, number][] = [];
  const seen = new Set<number>();
  for (let k = 0; k < faces.length; k += 1) {
    const anti: V3 = [-faces[k].centroid[0], -faces[k].centroid[1], -faces[k].centroid[2]];
    let j = -1;
    for (let m = 0; m < faces.length; m += 1)
      if (near(faces[m].centroid, anti)) {
        j = m;
        break;
      }
    if (j === -1)
      return { descends: false, reason: `σ carries the cell ${faces[k].key} to no cell — not a symmetry of the tiling`, pairs: [] };
    if (j === k) return { descends: false, reason: `σ fixes the cell ${faces[k].key} — not free`, pairs: [] };
    if (!seen.has(k) && !seen.has(j)) {
      pairs.push([k, j]);
      seen.add(k);
      seen.add(j);
    }
  }
  return { descends: true, reason: null, pairs };
}

// ---------------------------------------------------------------------------
// THE RESOLUTION — the door's own judge (true-predictive: eligible ⟺ opens)
// ---------------------------------------------------------------------------

export function resolveDeckTiling(complex: SchlafliComplex, nonOrientable: boolean): TilingResolution {
  const s = readSchlafli(complex);
  if (!s.ok) return { ok: false, reason: s.reason };
  const geometry = geometryOf(s.p, s.q);
  if (geometry === 'hyperbolic') return { ok: true, tiling: hyperbolicTiling(s.p, s.q) };
  if (geometry === 'euclidean') return { ok: true, tiling: euclideanTiling(s.p, s.q) };
  const spherical = sphericalTiling(s.p, s.q, nonOrientable);
  if (spherical === null)
    return {
      ok: false,
      reason: `a spherical {${s.p},${s.q}} — its solid is not among the engine's seeds (tetrahedron · cube · octahedron · the square dihedron)`,
    };
  return { ok: true, tiling: spherical };
}
