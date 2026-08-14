// faceIdentification — level-3 Build 1: the 3-cell identification op.
//
// The level-3 analog of `glueFace`/`flipGlueFace` (the committed
// `identifyByPairs`, surfaceOperations.ts:190): identify the boundary FACES
// (2-cells) of a committed solid `Cell` seed in orientation-aware pairs,
// cascading face → edge → vertex by union-find, and emit a 3-complex
// `{V, E, F, C}` whose counts are READ off the union-finds (never assumed from
// the pattern). Well-formed ≠ sound — the pattern always runs; the S² gate
// (level3SoundnessGate) decides.
//
// THE ONE-INCIDENCE CONDITION (mothership's carried condition): edge-links and
// vertex-links must be built consistently from ONE incidence. This module
// therefore enacts, ONCE, the full flag algebra the links need — alongside the
// cell classes it maintains:
//   · FLAG  (face, edge)   — a face's side at an edge   → edge-link vertices;
//   · END   (edge, vertex) — a directed half-edge end   → vertex-link vertices
//     (the committed level-2 lesson: END classes, never bare edge classes);
//   · CORNER(face, vertex) — a face's wedge at a corner → vertex-link edges.
// Each face-pairing's `map` drives ALL six union-finds in one pass; the
// extractor only ever READS these classes.
//
// Why not literally reuse `identifyByPairs`: it is level-2-shaped through and
// through (one face, boundary-slot indices, seam-sign machinery over half-edge
// ends). Generalizing it in place would rewrite the sealed level-2 file; the
// mandate's guard (level-2 byte-unchanged) wins, so this module MIRRORS its
// enact-by-union-find discipline one dimension up, and level-2 stays untouched
// (diff-verified in the report).
//
// Orientation: `mode` is validated and RECORDED per pair (glueFaces = all
// preserving; flipGlueFaces = ≥1 reversing — the committed level-2 contracts,
// mirrored). The Tier-2 w₁ tower over these modes is Build 2 — nothing here
// computes orientation classes.
//
// The PINCH fixtures (§2②③ of the seal): two seeds joined at exactly one edge
// or one vertex, NO faces glued — not producible by `glueFaces` (perfect
// matching forbids an empty pattern), so this module also exports the two
// explicit VALIDATION-FIXTURE constructors the acceptance names. They run the
// same `enact` core, so the gate sees one representation everywhere.

import type { Shape, VertexId } from '../types/geometry';

// The reserved `primalMultisetKey` characters — the committed
// `multiform.assertKeySafe` precedent (replicated: the committed guard is
// module-private; same chars, same refusal, attributed).
const RESERVED_KEY_CHARS = ['×', '|'];

function assertKeySafe(part: string, what: string): void {
  for (const reserved of RESERVED_KEY_CHARS) {
    if (part.includes(reserved)) {
      throw new Error(
        `faceIdentification: ${what} "${part}" contains reserved primalMultisetKey char "${reserved}"`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// input: a solid seed read off a committed Shape (its single seed Cell)
// ---------------------------------------------------------------------------

export interface Level3SeedCell {
  cellId: string;
  vertexIds: VertexId[];
  edges: { id: string; a: VertexId; b: VertexId }[];
  faces: { id: string; cycle: VertexId[] }[];
}

const pairKey = (a: string, b: string): string => (a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`);

// Ground on a committed solid Shape (e.g. `createSeedShape('cube')`): its one
// Cell, its explicit faces/edges. Optionally namespace every id with a prefix
// (the two-seed fixtures need disjoint copies — the committed `<source>:<id>`
// prefix mechanism).
export function readSeedCell(shape: Shape, prefix = ''): Level3SeedCell {
  if (shape.cells.length !== 1) {
    throw new Error(
      `faceIdentification: expected ONE committed solid Cell on "${shape.id}" (got ${shape.cells.length})`,
    );
  }
  const cell = shape.cells[0];
  if (prefix) assertKeySafe(prefix, 'seed prefix');
  const ns = (id: string): string => {
    assertKeySafe(id, 'seed id');
    return prefix ? `${prefix}:${id}` : id;
  };
  const faces = shape.faces
    .filter((face) => cell.faceIds.includes(face.id))
    .map((face) => ({ id: ns(face.id), cycle: face.vertexIds.map(ns) }));
  if (faces.length !== cell.faceIds.length) {
    throw new Error(`faceIdentification: the Cell's faceIds are not all on the Shape`);
  }
  const edges = shape.edges.map((edge) => ({
    id: ns(edge.id),
    a: ns(edge.vertexIds[0]),
    b: ns(edge.vertexIds[1]),
  }));
  return {
    cellId: ns(cell.id),
    vertexIds: cell.vertexIds.map(ns),
    edges,
    faces,
  };
}

// THE MULTI-CELL CUT (2026-08-13, sovereign GO; researcher 1930/2033 ruling):
// read EACH cell of a multi-cell Shape as its own PREFIXED seed — the same
// disjoint-id mechanism the two-seed fixtures use, applied per cell. A face
// SHARED by two cells (thicken's interior wall) becomes two disjoint prefixed
// copies; the CALLER pairs them (the paired-face representation `enact`
// consumes — the researcher's (ii): NOT the shared-face representation).
// Each per-cell seed carries only ITS OWN edges (derived from its faces'
// cycles — a multi-cell Shape's edge list is global). One-incidence is
// PER-CELL and each solid cell satisfies it independently (the ruling's (i)).
export function readSeedCells(shape: Shape, prefixBase = 'c'): Level3SeedCell[] {
  if (shape.cells.length === 0) {
    throw new Error(`faceIdentification: expected committed solid Cells on "${shape.id}" (got 0)`);
  }
  assertKeySafe(prefixBase, 'seed prefix');
  const faceById = new Map(shape.faces.map((face) => [face.id, face]));
  const edgeByEndpointsKey = new Map<string, { id: string; a: VertexId; b: VertexId }>();
  for (const edge of shape.edges) {
    edgeByEndpointsKey.set(pairKey(edge.vertexIds[0], edge.vertexIds[1]), {
      id: edge.id,
      a: edge.vertexIds[0],
      b: edge.vertexIds[1],
    });
  }
  return shape.cells.map((cell, index) => {
    const prefix = `${prefixBase}${index}`;
    const ns = (id: string): string => {
      assertKeySafe(id, 'seed id');
      return `${prefix}:${id}`;
    };
    const faces = cell.faceIds.map((faceId) => {
      const face = faceById.get(faceId);
      if (!face) throw new Error(`faceIdentification: the Cell's faceIds are not all on the Shape`);
      return { id: ns(face.id), cycle: face.vertexIds.map(ns) };
    });
    // the cell's own edges: every consecutive corner pair of its faces' cycles
    const edgeIds = new Set<string>();
    const edges: Level3SeedCell['edges'] = [];
    for (const faceId of cell.faceIds) {
      const face = faceById.get(faceId);
      if (!face) continue;
      const cycle = face.vertexIds;
      for (let k = 0; k < cycle.length; k += 1) {
        const u = cycle[k];
        const v = cycle[(k + 1) % cycle.length];
        const edge = edgeByEndpointsKey.get(pairKey(u, v));
        if (!edge) {
          throw new Error(`faceIdentification: no edge with endpoints ${u} ~ ${v} on "${shape.id}"`);
        }
        if (edgeIds.has(edge.id)) continue;
        edgeIds.add(edge.id);
        edges.push({ id: ns(edge.id), a: ns(edge.a), b: ns(edge.b) });
      }
    }
    return {
      cellId: ns(cell.id),
      vertexIds: cell.vertexIds.map(ns),
      edges,
      faces,
    };
  });
}

// ---------------------------------------------------------------------------
// the pairing pattern
// ---------------------------------------------------------------------------

export interface FacePairing {
  faceA: string;
  faceB: string;
  // P-IMMERSE flag sweep (2026-07-11, doc-only): the TOPOLOGY is determined by
  // the `map` — the map alone drives the six union-finds and the Tier-2 w₁
  // reading; `mode` is a validated, RECORDED label (it selects which committed
  // op contract applies — glueFaces all-preserving vs flipGlueFaces) and does
  // NOT by itself reverse anything. A genuinely orientation-reversing pairing
  // requires a REFLECTED `map`; a translation map yields the same manifold
  // whatever the label says. (The connectedSum mode-doc family: a label that
  // reads like it drives the math when the map does.)
  mode: 'preserving' | 'reversing';
  map: Record<VertexId, VertexId>; // faceA-cycle vertex -> its faceB image (a combinatorial bijection)
}

// keys for the flag algebra (JSON tuples — unambiguous, id-content-agnostic)
const flagKey = (faceId: string, edgeId: string): string => JSON.stringify([faceId, edgeId]);
const endKey = (edgeId: string, vertexId: string): string => JSON.stringify([edgeId, vertexId]);
const cornerKey = (faceId: string, vertexId: string): string => JSON.stringify([faceId, vertexId]);

export interface Level3Complex {
  counts: { v: number; e: number; f: number; c: number };
  chi: number; // Tier-1: V − E + F − C
  cells: { id: string; seed: Level3SeedCell }[];
  pairings: FacePairing[]; // recorded (Tier-2 consumes the modes in Build 2)
  // class lookups (union-find roots) over the ORIGINAL entities — ONE incidence:
  vertexClassOf: (id: VertexId) => string;
  edgeClassOf: (id: string) => string;
  faceClassOf: (id: string) => string;
  flagClassOf: (faceId: string, edgeId: string) => string;
  endClassOf: (edgeId: string, vertexId: string) => string;
  cornerClassOf: (faceId: string, vertexId: string) => string;
  // original incidence (for the extractor):
  originalVertices: VertexId[];
  originalEdges: { id: string; a: VertexId; b: VertexId; cellId: string }[];
  originalFaces: { id: string; cycle: VertexId[]; cellId: string }[];
  edgeOfFaceSlot: (faceId: string, k: number) => string; // the original edge under face slot k
}

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

// ---------------------------------------------------------------------------
// the enact core (shared by the op and the pinch fixtures — one representation)
// ---------------------------------------------------------------------------

interface ExtraUnions {
  vertexPairs?: [VertexId, VertexId][];
  edgeJoins?: { edgeA: string; edgeB: string; endMap: [VertexId, VertexId][] }[]; // endMap: [vertexOnA, vertexOnB]
}

function enact(seeds: Level3SeedCell[], pairings: FacePairing[], extra: ExtraUnions = {}): Level3Complex {
  // the original incidence, seed by seed
  const originalVertices: VertexId[] = [];
  const originalEdges: Level3Complex['originalEdges'] = [];
  const originalFaces: Level3Complex['originalFaces'] = [];
  const edgeByEndpoints = new Map<string, string>(); // pairKey(a,b) -> edge id (per whole complex; seeds are id-disjoint)
  for (const seed of seeds) {
    originalVertices.push(...seed.vertexIds);
    for (const edge of seed.edges) {
      originalEdges.push({ ...edge, cellId: seed.cellId });
      const key = pairKey(edge.a, edge.b);
      if (edgeByEndpoints.has(key)) {
        throw new Error(`faceIdentification: duplicate edge endpoints ${edge.a} ~ ${edge.b}`);
      }
      edgeByEndpoints.set(key, edge.id);
    }
    for (const face of seed.faces) {
      originalFaces.push({ id: face.id, cycle: face.cycle, cellId: seed.cellId });
    }
  }
  const edgeOf = (a: VertexId, b: VertexId): string => {
    const id = edgeByEndpoints.get(pairKey(a, b));
    if (!id) throw new Error(`faceIdentification: no edge with endpoints ${a} ~ ${b}`);
    return id;
  };

  const vertexUF = makeUnionFind();
  const edgeUF = makeUnionFind();
  const faceUF = makeUnionFind();
  const flagUF = makeUnionFind();
  const endUF = makeUnionFind();
  const cornerUF = makeUnionFind();

  // seed every class (so counts read classes of ALL originals, not just touched ones)
  for (const v of originalVertices) vertexUF.find(v);
  for (const e of originalEdges) {
    edgeUF.find(e.id);
    endUF.find(endKey(e.id, e.a));
    endUF.find(endKey(e.id, e.b));
  }
  for (const f of originalFaces) {
    faceUF.find(f.id);
    const n = f.cycle.length;
    for (let k = 0; k < n; k += 1) {
      const u = f.cycle[k];
      const w = f.cycle[(k + 1) % n];
      flagUF.find(flagKey(f.id, edgeOf(u, w)));
      cornerUF.find(cornerKey(f.id, u));
    }
  }

  const faceById = new Map(originalFaces.map((f) => [f.id, f]));

  // FACE PAIRINGS — the cascade: face → edge → vertex, PLUS the flag algebra,
  // all driven by the pairing's `map` in one pass (one incidence).
  for (const pairing of pairings) {
    const fA = faceById.get(pairing.faceA);
    const fB = faceById.get(pairing.faceB);
    if (!fA || !fB) throw new Error(`faceIdentification: pairing names unknown face(s) ${pairing.faceA} / ${pairing.faceB}`);
    faceUF.union(fA.id, fB.id);
    const n = fA.cycle.length;
    for (let k = 0; k < n; k += 1) {
      const u = fA.cycle[k];
      const uNext = fA.cycle[(k + 1) % n];
      const v = pairing.map[u];
      const vNext = pairing.map[uNext];
      const eA = edgeOf(u, uNext);
      const eB = edgeOf(v, vNext);
      vertexUF.union(u, v);
      edgeUF.union(eA, eB);
      flagUF.union(flagKey(fA.id, eA), flagKey(fB.id, eB));
      endUF.union(endKey(eA, u), endKey(eB, v));
      endUF.union(endKey(eA, uNext), endKey(eB, vNext));
      cornerUF.union(cornerKey(fA.id, u), cornerKey(fB.id, v));
    }
  }

  // FIXTURE unions (pinch configs): the identification at the stated dimension
  // ONLY — a vertex-join unites vertices (no ends, no corners: a shared point
  // does not identify any higher structure); an edge-join unites the edge, its
  // ends per the correspondence, and its endpoint vertices.
  for (const [a, b] of extra.vertexPairs ?? []) {
    vertexUF.union(a, b);
  }
  for (const join of extra.edgeJoins ?? []) {
    edgeUF.union(join.edgeA, join.edgeB);
    for (const [va, vb] of join.endMap) {
      vertexUF.union(va, vb);
      endUF.union(endKey(join.edgeA, va), endKey(join.edgeB, vb));
    }
  }

  const countClasses = (items: string[], find: (x: string) => string): number =>
    new Set(items.map(find)).size;

  const counts = {
    v: countClasses(originalVertices, vertexUF.find),
    e: countClasses(originalEdges.map((e) => e.id), edgeUF.find),
    f: countClasses(originalFaces.map((f) => f.id), faceUF.find),
    c: seeds.length,
  };

  return {
    counts,
    chi: counts.v - counts.e + counts.f - counts.c,
    cells: seeds.map((seed) => ({ id: seed.cellId, seed })),
    pairings,
    vertexClassOf: vertexUF.find,
    edgeClassOf: edgeUF.find,
    faceClassOf: faceUF.find,
    flagClassOf: (faceId, edgeId) => flagUF.find(flagKey(faceId, edgeId)),
    endClassOf: (edgeId, vertexId) => endUF.find(endKey(edgeId, vertexId)),
    cornerClassOf: (faceId, vertexId) => cornerUF.find(cornerKey(faceId, vertexId)),
    originalVertices,
    originalEdges,
    originalFaces,
    edgeOfFaceSlot: (faceId, k) => {
      const f = faceById.get(faceId);
      if (!f) throw new Error(`faceIdentification: unknown face ${faceId}`);
      return edgeOf(f.cycle[k], f.cycle[(k + 1) % f.cycle.length]);
    },
  };
}

// ---------------------------------------------------------------------------
// well-formedness (asserted BEFORE enacting — the mandate's three clauses)
// ---------------------------------------------------------------------------

// THE MULTI-CELL CUT: the well-formedness laws are unchanged — the face
// universe simply spans every seed (the ruling's "ordinary pairing
// well-formedness … the op already enforces"; no condition added or removed).
// Single-seed callers pass [seed]; every message stays byte-identical.
function assertWellFormed(seeds: Level3SeedCell[], pairings: FacePairing[]): void {
  // (3) map/mode present + map is a combinatorial cycle-isomorphism
  const faceById = new Map(seeds.flatMap((s) => s.faces).map((f) => [f.id, f]));
  const seen = new Map<string, number>();
  for (const pairing of pairings) {
    if (pairing.mode !== 'preserving' && pairing.mode !== 'reversing') {
      throw new Error(`faceIdentification: pairing ${pairing.faceA}~${pairing.faceB} lacks a preserve/reverse mode`);
    }
    const fA = faceById.get(pairing.faceA);
    const fB = faceById.get(pairing.faceB);
    if (!fA || !fB) throw new Error(`faceIdentification: pairing names a face not on the cell`);
    if (pairing.faceA === pairing.faceB) throw new Error(`faceIdentification: a face cannot pair with itself in Build 1`);
    // (2) combinatorial congruence
    if (fA.cycle.length !== fB.cycle.length) {
      throw new Error(
        `faceIdentification: paired faces ${fA.id} (${fA.cycle.length}-gon) and ${fB.id} (${fB.cycle.length}-gon) are not congruent`,
      );
    }
    // map: a bijection fA-cycle -> fB-cycle preserving adjacency (rotation/reflection allowed)
    const images = fA.cycle.map((u) => {
      const v = pairing.map[u];
      if (!v) throw new Error(`faceIdentification: the map misses corner ${u} of ${fA.id}`);
      if (!fB.cycle.includes(v)) throw new Error(`faceIdentification: map image ${v} is not a corner of ${fB.id}`);
      return v;
    });
    if (new Set(images).size !== images.length) {
      throw new Error(`faceIdentification: the map ${fA.id}→${fB.id} is not a bijection`);
    }
    const n = fB.cycle.length;
    const pos = new Map(fB.cycle.map((v, i) => [v, i]));
    const step = ((pos.get(images[1]) as number) - (pos.get(images[0]) as number) + n) % n;
    if (step !== 1 && step !== n - 1) {
      throw new Error(`faceIdentification: the map ${fA.id}→${fB.id} does not preserve the boundary cycle`);
    }
    for (let k = 0; k < n; k += 1) {
      const expected = ((pos.get(images[k]) as number) + step) % n;
      if (pos.get(images[(k + 1) % n]) !== expected) {
        throw new Error(`faceIdentification: the map ${fA.id}→${fB.id} breaks cycle adjacency at ${fA.cycle[k]}`);
      }
    }
    seen.set(pairing.faceA, (seen.get(pairing.faceA) ?? 0) + 1);
    seen.set(pairing.faceB, (seen.get(pairing.faceB) ?? 0) + 1);
  }
  // (1) the matching — every PAIRED face at most once. THE BOUNDED FORM
  // (2026-07-18, sealed eb9bfcb4…d598c): the old `count !== 1` held two
  // different facts in one predicate, and nobody had ever ruled it.
  //   count === 0 — an UNPAIRED face: a legitimate BOUNDARY, carried as a
  //     verdict in the enacted complex (its face class stays free; the
  //     level-3 gate reads the boundary downstream), never thrown;
  //   count > 1  — a face in several pairs: genuinely MALFORMED, still
  //     thrown, message byte-identical.
  for (const face of seeds.flatMap((s) => s.faces)) {
    const count = seen.get(face.id) ?? 0;
    if (count > 1) {
      throw new Error(
        `faceIdentification: boundary face ${face.id} appears in ${count} pairs — a perfect matching needs exactly 1`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// the ops (the level-2 docstring contracts, mirrored one dimension up)
// ---------------------------------------------------------------------------

// Every pairing orientation-PRESERVING. THE MULTI-CELL CUT: the entry now
// admits PLURAL seeds (the researcher's WALL 2 — the private `enact` was
// already plural; this exposes the (seeds[], pairings) composition over the
// ready core). A single seed passes exactly as before.
export function glueFaces(seedOrSeeds: Level3SeedCell | Level3SeedCell[], pairings: FacePairing[]): Level3Complex {
  if (pairings.some((p) => p.mode === 'reversing')) {
    throw new Error('faceIdentification: glueFaces requires every pairing preserving (use flipGlueFaces)');
  }
  const seeds = Array.isArray(seedOrSeeds) ? seedOrSeeds : [seedOrSeeds];
  assertWellFormed(seeds, pairings);
  return enact(seeds, pairings);
}

// At least one pairing orientation-REVERSING.
export function flipGlueFaces(seed: Level3SeedCell, pairings: FacePairing[]): Level3Complex {
  if (!pairings.some((p) => p.mode === 'reversing')) {
    throw new Error('faceIdentification: flipGlueFaces requires >= 1 reversing pairing (use glueFaces)');
  }
  assertWellFormed([seed], pairings);
  return enact([seed], pairings);
}

// ---------------------------------------------------------------------------
// the §2 validation-fixture constructors (PINCH-A / PINCH-B — not glueFaces
// products: their patterns are EMPTY, which perfect matching forbids)
// ---------------------------------------------------------------------------

// Two seeds sharing exactly ONE vertex — no edge, no face glued (PINCH-B).
export function joinSeedsAtVertex(
  seedA: Level3SeedCell,
  seedB: Level3SeedCell,
  vertexA: VertexId,
  vertexB: VertexId,
): Level3Complex {
  if (!seedA.vertexIds.includes(vertexA) || !seedB.vertexIds.includes(vertexB)) {
    throw new Error('faceIdentification: joinSeedsAtVertex names vertices not on the seeds');
  }
  return enact([seedA, seedB], [], { vertexPairs: [[vertexA, vertexB]] });
}

// Two seeds sharing exactly ONE edge (endpoints per the correspondence) — no face glued (PINCH-A).
export function joinSeedsAtEdge(
  seedA: Level3SeedCell,
  seedB: Level3SeedCell,
  edgeA: string,
  edgeB: string,
  endMap: [VertexId, VertexId][],
): Level3Complex {
  const eA = seedA.edges.find((e) => e.id === edgeA);
  const eB = seedB.edges.find((e) => e.id === edgeB);
  if (!eA || !eB) throw new Error('faceIdentification: joinSeedsAtEdge names edges not on the seeds');
  if (endMap.length !== 2) throw new Error('faceIdentification: the edge join needs both endpoint correspondences');
  return enact([seedA, seedB], [], { edgeJoins: [{ edgeA, edgeB, endMap }] });
}
