// complexIdentification — the general COMPLEX-IDENTIFICATION op (researcher-
// ruled G1–G4; engineer-chartered, sealed): sew a complex, not just fold a
// polygon. `identify(form, cycleA, cycleB, modes)` identifies two matched
// edge-class walks (cycles or arcs) of ONE complex, ENACTED COMPLEX-WIDE, and
// the committed gate judges the result. It is the arity-1 self sibling of the
// committed `connectedSum` (the two-form boundary glue).
//
// THE RULED SEMANTICS, held exactly:
//   G1 — GENERAL, never pre-refused: any two matched edge-class walks. The
//        meaningful sub-family is boundary identification (free edges → sound
//        manifolds); INTERIOR identification is admitted, enacted, and then
//        REFUSED BY THE GATE (the merged class carries 4 face wedges — a
//        junction, named). Instruments, not guards (ADR 0004/0006).
//   G2 — "identify" MEANS MERGE the declared edge classes (path-1): A ≡ B
//        becomes ONE class carrying the union of their wedges. Merging
//        endpoints while leaving two parallel classes (path-2 — the committed
//        P2 free-edge de-dup on interior edges) is NOT identification and is
//        NOT reused here: the DECLARED classes merge, explicitly, and only
//        they.
//   G3 — the MODE is the relative wedge-direction on the merged edge,
//        grounded in the complex's own face-boundary directions (there is no
//        polygon cycle): PRESERVING = the two wedges traverse the merged edge
//        in OPPOSITE directions (orientation-compatible); REVERSING = the
//        SAME direction. Per-pair modes are accepted (a committed word like
//        the Klein abaB mixes them — the single-face reduction demands it).
//        The REFERENCE SIGN of each declared edge is its CANONICAL WEDGE —
//        the wedge on the face of smallest COMMITTED face-id, never a
//        face-array position (researcher-pinned, ADR 0021 §6.0-bis; the
//        selector inside identifyOnComplex states the full rule and refuses
//        the un-ruled same-face tiebreak by name).
//        ⚠ ANTI-OVER-CLAIM LAW: the mode BITES iff the seam is
//        NON-SEPARATING; it is INERT iff the seam SEPARATES. A form's own two
//        boundary circles glue along a non-separating seam, so here the mode
//        genuinely changes the topology (cylinder → torus vs Klein). The
//        committed `connectedSum`'s cross-form glue is SEPARATING, so ITS
//        mode is inert on surfaces — the committed correction. Same
//        principle, opposite side; checkable by cutting the seam curve and
//        counting components.
//   G4 — the LEDGER LAW IS UNCHANGED at arity-1: the committed
//        `buildLedgerFromIdentification` over the one form's source sites. A
//        self-merge absorbing two sites that share a root records that root
//        with multiplicity 2 in the primalMultiset — the self-merge,
//        faithfully recorded.
//
// THE BUILD-CRITICAL LAW (researcher-measured; the committed materializer
// names it "the route-B trap"): edge classes are NEVER endpoint-derived
// during enactment — re-keying by endpoints FUSES parallel classes and
// CORRUPTS χ. Every edge carries its EXPLICIT class identity and every face
// slot its SIGNED direction through `resultOf`; only the DECLARED pairs
// merge. And because the `Shape` type is endpoint-keyed too (a `Face` carries
// only `vertexIds`; the direct bridge refuses self-loops and parallel
// classes), the op EMITS ITS COMPLEX EXPLICITLY — the committed
// `MaterializedSurface` pattern `{ shape, complex, ledger }` — plus a
// REPLAY/RECOVERY path (the birth id encodes the identification; re-run +
// byte-compare — the committed `recoverBornSurface` idiom), so the born form
// stays certifiable forever. The Shape is for render + lineage; the explicit
// complex is the certifiable truth.
//
// SINGLE-FACE REDUCTION (the polygon is a one-face complex): on a
// FIRST-GENERATION single-face form whose input walks resolve unambiguously
// to face slots, the op DELEGATES to the committed word machinery verbatim
// (`glueFace` / `flipGlueFace` + `materializeSurfaceResult`) — reuse, not
// fork: the general op and the committed words agree byte-for-byte on their
// shared domain, because on that domain they ARE the same code. A single-face
// QUOTIENT refuses toward the committed word ops (their Q-M2 composed chain
// owns that path — this module never duplicates the chain gate).
// ⚠ THE DELEGATION TRUTH (mothership-ruled, pinned 2026-07-12): BECAUSE the
// single-face path IS the committed machinery, any byte-agreement measured
// through it (the five-word compare in diagnose-complex-identification §d;
// `via: 'committed-word'`) witnesses the ADAPTER — the edge-walk → slot
// resolution and the mode convention — and NEVER the general enactment
// (`identifyOnComplex`). It must never again be described as a witness of
// the enactment. The enactment's independent witness is the DIFFERENTIAL
// ORACLE (scripts/diagnose-identify-oracle.cjs): a spec-derived reference
// quotient (docs/adr/0021 §§3–5) agreeing on the full byte-structure across
// the sew/chain battery, trap-sensitive against five distinct deliberate
// mutations, with every witnessed case asserting `via === 'general'`.
//
// DERIVE-ONLY · SANCTIONED ADDITION: committed modules by import
// (`buildLedgerFromIdentification`, `decomposeLink`, the word ops, the
// materializer); nothing committed is edited. The shape→complex direct
// bridge is re-expressed privately (the committed per-layer pattern —
// formInvariants and inkedFormModel each carry it; equivalence asserted in
// the diagnostic).

import type { Edge, Face, Shape, Vec3, Vertex, VertexId } from '../types/geometry';
import { flipGlueFace, glueFace, type BoundaryPairing } from './surfaceOperations';
import { materializeCutResult, materializeSurfaceResult } from './materializeOperation';
import { cutCell } from './cutOperation';
import {
  buildLedgerFromIdentification,
  type TransformationLedger,
} from './transformationLedger';
import { decomposeLink, type LinkValence } from './incidenceTraceRegistry';
import { createDefaultVertexData } from './shape';
import { canonicalEdgeKey } from './ids';
import { recoverBornSurface } from '../playground/bornFormRouting';
import type { AssembledComplex } from './globalW1';

export type IdentifyMode = 'preserving' | 'reversing';

export interface ComplexIdentificationSpec {
  cycleA: string[]; // ordered edge-class walk (arc or closed) — ids on the form's complex
  cycleB: string[];
  modes: IdentifyMode[]; // per pair, index-aligned (a single mode broadcasts)
}

export interface IdentificationGateReading {
  // wedge counts over the EMITTED complex — the committed slot arithmetic
  junctionEdgeIds: string[]; // >2 wedges (an interior identification lands here)
  freeEdgeIds: string[]; // <2 wedges
  // the committed decomposeLink at every vertex (end-keyed link nodes)
  junctionVertexIds: string[];
  manifold: boolean; // every edge ≤2 wedges AND every vertex link interior|boundary
  refusal: string | null; // the gate's own words when it refuses (names the junction)
}

export interface IdentifiedComplex {
  shape: Shape; // render + lineage (endpoint-keyed — may carry self-loops/parallels)
  complex: AssembledComplex; // the EXPLICIT signed truth — what certifies
  ledger: TransformationLedger; // G4 — the committed builder, arity-1
  gate: IdentificationGateReading;
  seamEdgeIds: string[]; // the merged classes this identification minted
  spec: ComplexIdentificationSpec; // normalized (modes broadcast)
  via: 'general' | 'committed-word'; // which path enacted (single-face delegates)
}

// ---------------------------------------------------------------------------
// small shared pieces
// ---------------------------------------------------------------------------

const RESERVED_KEY_CHARS = ['×', '|'];
function assertKeySafe(part: string, what: string): void {
  for (const reserved of RESERVED_KEY_CHARS) {
    if (part.includes(reserved)) {
      throw new Error(`complexIdentification: ${what} "${part}" contains reserved primalMultisetKey char "${reserved}"`);
    }
  }
}

const centroidOf = (points: Vec3[]): Vec3 => {
  const n = points.length || 1;
  const sum = points.reduce<Vec3>((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
  return [sum[0] / n, sum[1] / n, sum[2] / n];
};

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

// the shape → AssembledComplex direct bridge, the committed rules verbatim
// (unique endpoint keys, no parallel classes, no self-loops — the SAME
// re-expression formInvariants and inkedFormModel each deliberately carry for
// their layer; equivalence to the committed bridge is asserted in the
// diagnostic). Throws with the refusing rule — quotient forms fail by design.
function directComplexOf(shape: Shape): AssembledComplex {
  const byKey = new Map<string, { id: string; u: string; v: string }>();
  for (const edge of shape.edges) {
    const [u, v] = edge.vertexIds;
    if (u === v) throw new Error(`self-loop edge ${edge.id}`);
    const key = canonicalEdgeKey(u, v);
    if (byKey.has(key)) throw new Error(`parallel edge class ${key}`);
    byKey.set(key, { id: edge.id, u, v });
  }
  const faces = shape.faces.map((face) => ({
    boundary: face.vertexIds.map((x, i) => {
      const y = face.vertexIds[(i + 1) % face.vertexIds.length];
      const record = byKey.get(canonicalEdgeKey(x, y));
      if (!record) throw new Error(`face slot ${x}→${y} has no edge`);
      return { edge: record.id, dir: (record.u === x && record.v === y ? 1 : -1) as 1 | -1 };
    }),
  }));
  return { vertices: Object.keys(shape.vertices), edges: [...byKey.values()], faces };
}

const normalizeModes = (mode: IdentifyMode | IdentifyMode[], k: number): IdentifyMode[] => {
  const modes = Array.isArray(mode) ? [...mode] : Array.from({ length: k }, () => mode);
  if (modes.length !== k) {
    throw new Error(`complexIdentification: ${modes.length} modes for ${k} edge pairs — one per pair (or one for all)`);
  }
  for (const m of modes) {
    if (m !== 'preserving' && m !== 'reversing') {
      throw new Error(`complexIdentification: unknown mode "${m}"`);
    }
  }
  return modes;
};

// the wedge direction of an edge: the direction its FIRST face slot traverses
// it (+1: u→v). Free edges have exactly one wedge, so the value is exact; on
// interior edges the first slot is an ARRAY-ORDER artifact, which is why this
// map is consumed ONLY by the free-edge boundary walker (walkBoundaryCircles)
// — the identification's mode reference is the CANONICAL WEDGE selector inside
// `identifyOnComplex` (researcher-pinned, ADR 0021 §6.0-bis, 2026-07-12),
// NEVER this scan. A slot-less (dangling) edge reads +1 — deterministic,
// disclosed.
function wedgeDirections(complex: AssembledComplex): Map<string, 1 | -1> {
  const dir = new Map<string, 1 | -1>();
  for (const face of complex.faces) {
    for (const slot of face.boundary) {
      if (!dir.has(slot.edge)) dir.set(slot.edge, slot.dir);
    }
  }
  return dir;
}

// ---------------------------------------------------------------------------
// THE GATE — wedge counts + end-keyed vertex links through the committed
// decomposeLink (the materializer's own link idiom, complex-wide)
// ---------------------------------------------------------------------------

export function readIdentificationGate(complex: AssembledComplex): IdentificationGateReading {
  const wedges = new Map<string, number>();
  for (const edge of complex.edges) wedges.set(edge.id, 0);
  for (const face of complex.faces) {
    for (const slot of face.boundary) wedges.set(slot.edge, (wedges.get(slot.edge) ?? 0) + 1);
  }
  const junctionEdgeIds = complex.edges.filter((e) => (wedges.get(e.id) ?? 0) > 2).map((e) => e.id);
  const freeEdgeIds = complex.edges.filter((e) => (wedges.get(e.id) ?? 0) < 2).map((e) => e.id);

  // end-keyed link nodes (the committed lesson: a loop edge has TWO ends)
  const edgeById = new Map(complex.edges.map((e) => [e.id, e]));
  const adjacencyOf = new Map<string, Map<string, string[]>>();
  const push = (v: string, a: string, b: string): void => {
    let m = adjacencyOf.get(v);
    if (!m) {
      m = new Map();
      adjacencyOf.set(v, m);
    }
    m.set(a, [...(m.get(a) ?? []), b]);
    m.set(b, [...(m.get(b) ?? []), a]);
  };
  for (const face of complex.faces) {
    const n = face.boundary.length;
    for (let k = 0; k < n; k += 1) {
      const here = face.boundary[k];
      const next = face.boundary[(k + 1) % n];
      const hereEdge = edgeById.get(here.edge);
      const nextEdge = edgeById.get(next.edge);
      if (!hereEdge || !nextEdge) continue;
      const corner = here.dir === 1 ? hereEdge.v : hereEdge.u;
      push(corner, `${here.edge}#${here.dir === 1 ? 'v' : 'u'}`, `${next.edge}#${next.dir === 1 ? 'u' : 'v'}`);
    }
  }
  const junctionVertexIds: string[] = [];
  for (const [vertexId, adjacency] of adjacencyOf) {
    const valence: LinkValence = decomposeLink(adjacency).valence;
    if (valence !== 'interior' && valence !== 'boundary') junctionVertexIds.push(vertexId);
  }
  const manifold = junctionEdgeIds.length === 0 && junctionVertexIds.length === 0;
  return {
    junctionEdgeIds,
    freeEdgeIds,
    junctionVertexIds,
    manifold,
    refusal: manifold
      ? null
      : `identify gate: ${
          junctionEdgeIds.length
            ? `edge class${junctionEdgeIds.length === 1 ? '' : 'es'} [${junctionEdgeIds.join(', ')}] carry >2 face wedges (an interior identification makes a 4-wedge seam)`
            : `vertex link${junctionVertexIds.length === 1 ? '' : 's'} [${junctionVertexIds.join(', ')}] read junction/pinch`
        } — the identification is ENACTED but the gate refuses the manifold claim (instruments, not guards)`,
  };
}

// ---------------------------------------------------------------------------
// the birth id — encodes the identification for replay recovery
// ---------------------------------------------------------------------------

const SPEC_SEPARATORS = [',', ';', '[', ']'];
function assertIdEncodable(edgeId: string): void {
  for (const ch of SPEC_SEPARATORS) {
    if (edgeId.includes(ch)) {
      throw new Error(`complexIdentification: edge id "${edgeId}" contains the reserved spec separator "${ch}" — not encodable in a birth id`);
    }
  }
}

export function encodeIdentificationSuffix(spec: ComplexIdentificationSpec): string {
  for (const id of [...spec.cycleA, ...spec.cycleB]) assertIdEncodable(id);
  const modes = spec.modes.map((m) => (m === 'preserving' ? 'p' : 'r')).join('');
  return `idn[${modes}][${spec.cycleA.join(',')}][${spec.cycleB.join(',')}]`;
}

export function parseIdentificationSuffix(bornId: string): ComplexIdentificationSpec | null {
  const at = bornId.lastIndexOf(':idn[');
  if (at < 0) return null;
  const match = bornId.slice(at + 1).match(/^idn\[([pr]*)\]\[([^\]]*)\]\[([^\]]*)\]$/);
  if (!match) return null;
  const cycleA = match[2] ? match[2].split(',') : [];
  const cycleB = match[3] ? match[3].split(',') : [];
  if (cycleA.length === 0 || cycleA.length !== cycleB.length || match[1].length !== cycleA.length) return null;
  return {
    cycleA,
    cycleB,
    modes: [...match[1]].map((c) => (c === 'p' ? 'preserving' : 'reversing')),
  };
}

// ---------------------------------------------------------------------------
// the single-face delegation — the committed word machinery, verbatim (Q-M2
// composed prior word included). The general op and the committed words agree
// byte-for-byte on the polygon domain because this IS the committed path.
// ---------------------------------------------------------------------------

function resolveSlot(face: Face, edge: Edge): number {
  const vs = face.vertexIds;
  const n = vs.length;
  const [u, v] = edge.vertexIds;
  const slots: number[] = [];
  for (let k = 0; k < n; k += 1) {
    const a = vs[k];
    const b = vs[(k + 1) % n];
    if ((a === u && b === v) || (a === v && b === u)) slots.push(k);
  }
  if (slots.length !== 1) {
    throw new Error(
      `complexIdentification: edge "${edge.id}" resolves to ${slots.length} face slots — ` +
        (slots.length === 0
          ? 'not a boundary edge of the single face'
          : 'parallel identified slots are ambiguous on this quotient face (the committed word ops own that path)'),
    );
  }
  return slots[0];
}

function identifyOnSingleFace(
  form: Shape,
  cycleA: string[],
  cycleB: string[],
  modes: IdentifyMode[],
): IdentifiedComplex {
  const face = form.faces[0];
  // the delegation covers FIRST-GENERATION polygons (distinct corners); a
  // single-face QUOTIENT is the committed word ops' own domain (their Q-M2
  // composed chain) — refuse toward them rather than duplicate the chain gate
  if (new Set(face.vertexIds).size !== face.vertexIds.length) {
    throw new Error(
      'complexIdentification: a single-face QUOTIENT identifies through the committed word ops (glue / flip-glue on the face — the Q-M2 composed chain); this op delegates only first-generation polygons',
    );
  }
  const edgeById = new Map(form.edges.map((e) => [e.id, e]));
  const slotOf = (id: string): number => {
    const edge = edgeById.get(id);
    if (!edge) throw new Error(`complexIdentification: edge "${id}" is not on the form`);
    return resolveSlot(face, edge);
  };
  // G3 on the polygon: every slot's wedge walks the boundary FORWARD, so the
  // committed slot modes coincide with the ruled wedge modes 1:1 —
  // 'preserving' is the crossed (anti-parallel) merge, 'reversing' the
  // parallel one (identifyByPairs' own documented convention).
  const pairings: BoundaryPairing[] = cycleA.map((aId, i) => ({
    edgeA: slotOf(aId),
    edgeB: slotOf(cycleB[i]),
    mode: modes[i],
  }));
  const op = pairings.some((p) => p.mode === 'reversing') ? flipGlueFace : glueFace;
  const trace = op(form, face, pairings);
  const materialized = materializeSurfaceResult(form, face, trace, pairings);
  // G4 — the committed builder over the one form's (distinct) corner classes
  const sourceSiteIds = [...new Set(face.vertexIds)];
  const ledger = buildLedgerFromIdentification(sourceSiteIds, (siteId) => materialized.supportOf[siteId] ?? siteId);
  // the merged classes = the rep-slot carrier edges of the declared pairs
  const seamEdgeIds = pairings.map(({ edgeA, edgeB }) => {
    const rep = Math.min(edgeA, edgeB);
    const [from, to] = [face.vertexIds[rep], face.vertexIds[(rep + 1) % face.vertexIds.length]];
    const carrier = form.edges.find(
      (e) =>
        (e.vertexIds[0] === from && e.vertexIds[1] === to) ||
        (e.vertexIds[0] === to && e.vertexIds[1] === from),
    );
    return carrier ? carrier.id : `slot:${rep}`;
  });
  return {
    shape: materialized.shape,
    complex: materialized.complex,
    ledger,
    gate: readIdentificationGate(materialized.complex),
    seamEdgeIds,
    spec: { cycleA, cycleB, modes },
    via: 'committed-word',
  };
}

// ---------------------------------------------------------------------------
// the GENERAL enactment — explicit signed classes, complex-wide (the P2 D3
// move with G2's declared-class merge; never endpoint-derived)
// ---------------------------------------------------------------------------

function identifyOnComplex(
  form: Shape,
  complex: AssembledComplex,
  cycleA: string[],
  cycleB: string[],
  modes: IdentifyMode[],
): IdentifiedComplex {
  // the enactment rewrites shape faces and complex faces in step — every
  // acquisition source keeps them index-aligned (asserted, never assumed)
  if (complex.faces.length !== form.faces.length) {
    throw new Error(
      `complexIdentification: the acquired complex carries ${complex.faces.length} faces for a ${form.faces.length}-face shape — misaligned acquisition, refusing`,
    );
  }
  const edgeById = new Map(complex.edges.map((e) => [e.id, e]));
  const k = cycleA.length;
  for (const id of [...cycleA, ...cycleB]) {
    if (!edgeById.has(id)) throw new Error(`complexIdentification: edge class "${id}" is not on the form's complex`);
  }
  const inA = new Set(cycleA);
  const inB = new Set(cycleB);
  if (cycleA.length !== inA.size || cycleB.length !== inB.size) {
    throw new Error('complexIdentification: a walk repeats an edge class — each class may appear once');
  }
  for (const id of cycleA) {
    if (inB.has(id)) throw new Error(`complexIdentification: edge class "${id}" appears in BOTH walks — a class cannot be identified with itself`);
  }

  // ---------------------------------------------------------------------------
  // THE CANONICAL WEDGE (researcher-pinned, ADR 0021 §6.0-bis; engineer-
  // chartered 2026-07-12). The mode's reference sign s_X is the sign with which
  // X's CANONICAL WEDGE traverses X's STORED arrow, and the canonical wedge is
  // the incident wedge on the face of SMALLEST COMMITTED FACE-ID (localeCompare)
  // — NEVER a face-array position: `complex.faces` records are anonymous, their
  // order is storage, not structure, and an array-order reference makes the
  // operation a function of the complex AND how it happens to be listed (the
  // measured bug: rotating `shape.faces` — a pure relabelling — changed the
  // merge partition). The alignment assert above pins index i ↔ form.faces[i].id,
  // so the committed identity is available without touching the complex type.
  // On a FREE (1-wedge) edge this reduces EXACTLY to the single wedge — the
  // shipped, derived rule (σ = −s_A·s_B on a preserving pair), which is why no
  // sealed surface moves by a byte. The rule is invariant under face
  // relabelling AND under re-storage (flip a stored arrow and s flips with it,
  // selecting the same physical pairing) — a FIXED sign is neither.
  //
  // MEANING (researcher-ruled; load-bearing, not decoration): the INTERIOR mode
  // has NO orientation semantics. At valence 2 every symmetric function of the
  // two wedge signs is constant (s₁·s₂ = −1, s₁+s₂ = 0), so
  // "orientation-compatibility" carries ZERO information there; the interior
  // mode is a deterministic NAMING over a gate-recorded junction (ADR 0006),
  // and this selector is an arbitrary tiebreak — arbitrary BY NECESSITY.
  // THE FORM UNIFIES; THE MEANING DOES NOT: valence 1 is DERIVED (torus vs
  // Klein); valence 2 is STIPULATED (a name). No future reader may import the
  // free-edge meaning into the interior case.
  //
  // ⛔ NOT TOTAL, by ruling: if BOTH wedges of a declared edge lie on ONE face
  // (a face citing the edge twice), "smallest face-id" picks a face but not a
  // wedge — REFUSE by name; the tiebreak is a researcher pin not yet ruled.
  // (The obvious tiebreaks are traps: a dir-based pick IS the raw stored-arrow
  // reference and fails re-storage; a slot-index pick is rotation-dependent —
  // the array-order bug one level down.)
  const wedgesOfEdge = new Map<string, Array<{ faceId: string; dir: 1 | -1 }>>();
  complex.faces.forEach((face, faceIndex) => {
    const faceId = form.faces[faceIndex].id;
    for (const slot of face.boundary) {
      const list = wedgesOfEdge.get(slot.edge);
      const wedge = { faceId, dir: slot.dir };
      if (list) list.push(wedge);
      else wedgesOfEdge.set(slot.edge, [wedge]);
    }
  });
  const canonicalDirOf = (id: string): 1 | -1 => {
    const wedges = wedgesOfEdge.get(id) ?? [];
    if (wedges.length === 0) return 1; // dangling — deterministic, disclosed (unchanged)
    if (wedges.length === 1) return wedges[0].dir; // FREE — the derived rule, byte-identical
    const canonicalFaceId = wedges.reduce(
      (min, wedge) => (wedge.faceId.localeCompare(min) < 0 ? wedge.faceId : min),
      wedges[0].faceId,
    );
    const onCanonicalFace = wedges.filter((wedge) => wedge.faceId === canonicalFaceId);
    if (onCanonicalFace.length > 1) {
      throw new Error(
        `complexIdentification: the canonical wedge is ambiguous — both wedges of edge "${id}" lie on face "${canonicalFaceId}"; the tiebreak is a researcher pin not yet ruled`,
      );
    }
    return onCanonicalFace[0].dir;
  };
  const orient = (id: string): [VertexId, VertexId] => {
    const e = edgeById.get(id) as { id: string; u: string; v: string };
    return canonicalDirOf(id) === 1 ? [e.u, e.v] : [e.v, e.u];
  };

  // (1) vertex merges per pair, by the ruled wedge-direction convention (G3)
  const uf = makeUnionFind();
  for (const vertex of complex.vertices) uf.find(vertex);
  for (let i = 0; i < k; i += 1) {
    const [tailA, headA] = orient(cycleA[i]);
    const [tailB, headB] = orient(cycleB[i]);
    if (modes[i] === 'preserving') {
      // opposite traversal on the merged edge — the orientation-compatible seam
      uf.union(tailA, headB);
      uf.union(headA, tailB);
    } else {
      // same traversal — the orientation-incompatible seam
      uf.union(tailA, tailB);
      uf.union(headA, headB);
    }
  }

  // (2) vertex classes → minted carried-not-minted ids (the committed mint
  // idiom: sorted members, centroid position, sourceVertexIds = the members)
  const membersOfRoot = new Map<string, VertexId[]>();
  for (const vertex of complex.vertices) {
    const root = uf.find(vertex);
    (membersOfRoot.get(root) ?? membersOfRoot.set(root, []).get(root)!).push(vertex);
  }
  const supportOf: Record<VertexId, VertexId> = {};
  const vertices: Record<VertexId, Vertex> = {};
  const mintedIds: VertexId[] = [];
  const modesCompact = modes.map((m) => (m === 'preserving' ? 'p' : 'r')).join('');
  const bornShapeId = `shape:identified:${form.id}:${encodeIdentificationSuffix({ cycleA, cycleB, modes })}`;
  void modesCompact;
  for (const members of membersOfRoot.values()) {
    if (members.length === 1) {
      const original = form.vertices[members[0]];
      if (!original) throw new Error(`complexIdentification: vertex ${members[0]} not on the form`);
      supportOf[members[0]] = original.id;
      vertices[original.id] = original;
      continue;
    }
    const sorted = [...members].sort((a, b) => a.localeCompare(b));
    for (const member of sorted) assertKeySafe(member, 'identified vertex id');
    const mintedId: VertexId = `idn:${sorted.join('~')}`;
    if (vertices[mintedId] || form.vertices[mintedId]) {
      throw new Error(`complexIdentification: minted id "${mintedId}" collides with an existing site`);
    }
    for (const member of sorted) supportOf[member] = mintedId;
    vertices[mintedId] = {
      id: mintedId,
      position: centroidOf(sorted.map((m) => {
        const vertex = form.vertices[m];
        if (!vertex) throw new Error(`complexIdentification: vertex ${m} not on the form`);
        return vertex.position;
      })),
      data: createDefaultVertexData(mintedId),
      createdBy: {
        shapeId: bornShapeId,
        operation: modes.some((m) => m === 'reversing') ? 'flip-glue' : 'glue',
        sourceVertexIds: [...sorted], // carried-not-minted (G4 feeds off this)
      },
    };
    mintedIds.push(mintedId);
  }
  const resultOf = (vertexId: VertexId): VertexId => supportOf[vertexId] ?? vertexId;

  // (3) EDGE ENACTMENT — G2 path-1: the DECLARED classes merge (one class, the
  // union of wedges); every other class keeps its identity with rewritten
  // endpoints. EXPLICIT — parallel classes stay parallel, self-loops stay
  // distinct classes; nothing is endpoint-keyed (the route-B trap).
  const mergedIdOfA = new Map<string, string>();
  const mergedIdOfB = new Map<string, string>();
  const flipOfB = new Map<string, 1 | -1>();
  const seamEdgeIds: string[] = [];
  for (let i = 0; i < k; i += 1) {
    const mergedId = `idn:${cycleA[i]}+${cycleB[i]}`;
    mergedIdOfA.set(cycleA[i], mergedId);
    mergedIdOfB.set(cycleB[i], mergedId);
    seamEdgeIds.push(mergedId);
    // b's written (u,v) orientation vs the carrier a's, under the merge —
    // derived STRUCTURALLY from the CANONICAL wedge signs and the mode (an
    // endpoint comparison would be ambiguous on self-loop seams):
    //   preserving maps tail_b↦head_a (anti) ⇒ aligned iff s_a·s_b = −1
    //   reversing maps tail_b↦tail_a (par)  ⇒ aligned iff s_a·s_b = +1
    const sA = canonicalDirOf(cycleA[i]);
    const sB = canonicalDirOf(cycleB[i]);
    flipOfB.set(cycleB[i], ((modes[i] === 'preserving' ? -1 : 1) * sA * sB) as 1 | -1);
  }
  const enactedEdges: Array<{ id: string; u: string; v: string }> = [];
  const shapeEdgeById = new Map(form.edges.map((e) => [e.id, e]));
  const bornEdges: Edge[] = [];
  for (const edge of complex.edges) {
    if (mergedIdOfB.has(edge.id)) continue; // absorbed into its declared partner's class
    const mergedId = mergedIdOfA.get(edge.id);
    const id = mergedId ?? edge.id;
    const u = resultOf(edge.u);
    const v = resultOf(edge.v);
    enactedEdges.push({ id, u, v });
    const carried = shapeEdgeById.get(edge.id);
    bornEdges.push({
      ...(carried ?? { id: edge.id, vertexIds: [edge.u, edge.v] as [VertexId, VertexId] }),
      id,
      vertexIds: [u, v] as [VertexId, VertexId],
      sourceVertexIds: [edge.u, edge.v] as [VertexId, VertexId],
    });
  }

  // (4) FACES — every slot rewritten with its EXPLICIT class + sign carried:
  // a-slots keep their direction (a is the merged carrier); b-slots re-express
  // their direction relative to the carrier via the structural flip factor.
  const enactedFaces: AssembledComplex['faces'] = complex.faces.map((face) => ({
    boundary: face.boundary.map((slot) => {
      if (mergedIdOfA.has(slot.edge)) return { edge: mergedIdOfA.get(slot.edge) as string, dir: slot.dir };
      if (mergedIdOfB.has(slot.edge)) {
        return {
          edge: mergedIdOfB.get(slot.edge) as string,
          dir: (slot.dir * (flipOfB.get(slot.edge) as 1 | -1)) as 1 | -1,
        };
      }
      return slot;
    }),
  }));
  const enactedComplex: AssembledComplex = {
    vertices: Object.keys(vertices),
    edges: enactedEdges,
    faces: enactedFaces,
  };

  // (5) the born SHAPE (render + lineage — the complex above is the truth):
  // faces are corner cycles rewritten through resultOf (the P2 D3 move; the
  // complex.faces are index-aligned with shape.faces on the direct bridge)
  const bornFaces: Face[] = form.faces.map((face) => ({
    ...face,
    vertexIds: face.vertexIds.map((vertexId) => resultOf(vertexId)),
  }));
  const shape: Shape = {
    id: bornShapeId,
    name: `${form.name} / identified`,
    vertices,
    edges: bornEdges,
    faces: bornFaces,
    cells: [],
    generations: [],
    genealogy: {
      parentShapeId: form.id,
      operation: modes.some((m) => m === 'reversing') ? 'flip-glue' : 'glue',
      generationDepth: form.genealogy.generationDepth + 1,
      sourceVertexIds: [...complex.vertices],
      createdVertexIds: mintedIds,
      createdAt: '',
    },
  };

  // (6) G4 — the committed ledger builder over the ONE form's source sites
  const ledger = buildLedgerFromIdentification([...complex.vertices], resultOf);

  return {
    shape,
    complex: enactedComplex,
    ledger,
    gate: readIdentificationGate(enactedComplex),
    seamEdgeIds,
    spec: { cycleA, cycleB, modes },
    via: 'general',
  };
}

// ---------------------------------------------------------------------------
// identify — the op (G1: general; single-face delegates to the committed word)
// ---------------------------------------------------------------------------

export function identify(
  form: Shape,
  cycleA: string[],
  cycleB: string[],
  mode: IdentifyMode | IdentifyMode[],
  ancestry: Shape | Shape[] | null = null,
): IdentifiedComplex {
  if (cycleA.length === 0 || cycleA.length !== cycleB.length) {
    throw new Error(
      `complexIdentification: the walks must be matched and non-empty (got ${cycleA.length} vs ${cycleB.length} edge classes) — subdivide to equalize, never silently mis-match`,
    );
  }
  const modes = normalizeModes(mode, cycleA.length);
  if (form.faces.length === 1) {
    // the polygon IS a one-face complex — DELEGATION BY CONSTRUCTION: the
    // committed word machinery is its enactment (via: 'committed-word').
    // Byte-agreement through this branch witnesses the ADAPTER, never
    // `identifyOnComplex` — the enactment's independent witness is the
    // differential oracle (diagnose-identify-oracle.cjs; 2026-07-12).
    return identifyOnSingleFace(form, cycleA, cycleB, modes);
  }
  // the ACQUISITION CHAIN (mothership-required): direct → word/cut recovery →
  // identify recovery, recursively — a form born of identify is identify-able
  // again (pass its ancestry; with none, only direct-readable forms resolve —
  // the committed behavior, byte-identical)
  const acquired = acquireComplex(form, ancestry);
  if (!acquired) {
    throw new Error(
      'complexIdentification: the form\'s faithful complex is not acquirable — the direct bridge refuses it and no replay recovery reaches it' +
        (normalizeAncestry(ancestry).length === 0 ? ' (pass the form\'s ancestry for chained recovery)' : '') +
        ' — refusing honestly',
    );
  }
  return identifyOnComplex(form, acquired.complex, cycleA, cycleB, modes);
}

// ---------------------------------------------------------------------------
// the recovery — replay + byte-compare (the committed recoverBornSurface idiom)
// ---------------------------------------------------------------------------

export function recoverIdentifiedComplex(
  born: Shape,
  parent: Shape | null,
  ancestry: Shape | Shape[] | null = null,
): IdentifiedComplex | null {
  if (!parent || born.genealogy.parentShapeId !== parent.id) return null;
  const spec = parseIdentificationSuffix(born.id);
  if (!spec) return null;
  try {
    // the replay may itself need the parent's ancestry (a sewn form born of a
    // sewn form — the chain across generations); the born shape is excluded
    // from the replay lineage so a crafted genealogy cycle exhausts finitely
    const lineage = normalizeAncestry(ancestry).filter((s) => s.id !== born.id);
    const replay = identify(parent, spec.cycleA, spec.cycleB, spec.modes, lineage);
    if (JSON.stringify(replay.shape) !== JSON.stringify(born)) return null;
    return replay;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// THE ACQUISITION CHAIN (mothership-required): a form's faithful complex,
// resolved DIRECT → else the committed word/collapse replay recovery → else
// the CUT derivation (the child's complex is the parent's, chain-acquired,
// minus the one removed face — replay-verified first) → else the IDENTIFY
// replay recovery — RECURSIVELY across generations (recovering a sewn form
// may need its parent's complex, which may itself need recovery). Without
// this chain, a form born of `identify` whose shape the direct bridge
// refuses (self-loops / parallel classes — the bridge is RIGHT to refuse
// them) would read as "no faithful complex" everywhere downstream: the op
// would generalize identification across forms but not across generations
// of itself. The `ancestry` is the ancestor shapes the caller can supply
// (a single parent, or the deeper lineage for multi-generation chains);
// each recursion step consumes lineage, so the walk is finite by
// construction. NOTE (held): the committed direct bridge's refusals are
// NEVER weakened here — the bridge is right; the chain is what was missing.
// ---------------------------------------------------------------------------

export type ComplexAcquisitionSource = 'direct' | 'recovered' | 'cut-derived' | 'identified';

export interface AcquiredComplex {
  complex: AssembledComplex;
  source: ComplexAcquisitionSource;
}

const normalizeAncestry = (ancestry: Shape | Shape[] | null | undefined): Shape[] =>
  !ancestry ? [] : Array.isArray(ancestry) ? ancestry : [ancestry];

export function acquireComplex(
  shape: Shape,
  ancestry: Shape | Shape[] | null = null,
  seen: Set<string> = new Set(),
): AcquiredComplex | null {
  if (seen.has(shape.id)) return null; // a lineage cycle — refuse honestly
  seen.add(shape.id);
  // (1) the committed direct bridge (its refusals stand — quotient shapes
  // fail by design and chain on)
  try {
    return { complex: directComplexOf(shape), source: 'direct' };
  } catch {
    // not endpoint-representable — the chain continues
  }
  const lineage = normalizeAncestry(ancestry);
  const parent = lineage.find((candidate) => candidate.id === shape.genealogy.parentShapeId) ?? null;
  // (2) the committed word/collapse replay recovery (one hop, verbatim)
  const word = recoverBornSurface(shape, parent);
  if (word) return { complex: word.materialized.complex, source: 'recovered' };
  // (3) a CUT birth: replay-verify through the committed cut, then derive the
  // complex from the PARENT's (chain-acquired — recursion) by dropping the
  // removed face's boundary at the parent's face index (complex faces are
  // index-aligned with shape faces on every acquisition source)
  if (parent && shape.genealogy.operation === 'cut') {
    const missing = parent.faces.filter((pf) => !shape.faces.some((cf) => cf.id === pf.id));
    if (missing.length === 1) {
      try {
        const replay = materializeCutResult(parent, cutCell(parent, missing[0]));
        if (JSON.stringify(replay) === JSON.stringify(shape)) {
          const parentAcquired = acquireComplex(parent, lineage, seen);
          if (parentAcquired) {
            const cutIndex = parent.faces.findIndex((pf) => pf.id === missing[0].id);
            return {
              complex: {
                ...parentAcquired.complex,
                faces: parentAcquired.complex.faces.filter((_face, k) => k !== cutIndex),
              },
              source: 'cut-derived',
            };
          }
        }
      } catch {
        // the committed cut replay refused — not a faithful cut child
      }
    }
  }
  // (4) an IDENTIFY birth: the replay recovery (recursive — the replay
  // acquires the parent's complex through this same chain)
  if (parent && parseIdentificationSuffix(shape.id)) {
    const identified = recoverIdentifiedComplex(shape, parent, lineage);
    if (identified) return { complex: identified.complex, source: 'identified' };
  }
  return null;
}

// ---------------------------------------------------------------------------
// the meaningful sub-family — sew two BOUNDARY CIRCLES (the wired case)
// ---------------------------------------------------------------------------

export interface BoundaryCircleWalk {
  edgeIds: string[]; // the circle's free edges in wedge-induced walk order
  anchor: string; // the deterministic start (smallest edge id on the circle)
}

// Enumerate the complex's boundary circles as ORDERED walks in the
// wedge-induced direction (each free edge is traversed by its one face wedge;
// the walk follows head→tail chaining). The circle COUNT agrees with the
// committed P-IMMERSE counter (surfaceClassifier.readBoundary) — that counter
// gates the registry op; this walker additionally ORDERS the circles for the
// seam correspondence. Refuses (returns null) when the free skeleton is not a
// disjoint union of coherently-walkable circles.
export function walkBoundaryCircles(complex: AssembledComplex): BoundaryCircleWalk[] | null {
  const wedgeCount = new Map<string, number>();
  for (const edge of complex.edges) wedgeCount.set(edge.id, 0);
  for (const face of complex.faces) {
    for (const slot of face.boundary) wedgeCount.set(slot.edge, (wedgeCount.get(slot.edge) ?? 0) + 1);
  }
  const free = complex.edges.filter((e) => wedgeCount.get(e.id) === 1);
  if (complex.edges.some((e) => wedgeCount.get(e.id) === 0)) return null; // dangling edges — not a surface boundary
  const wedgeDir = wedgeDirections(complex);
  // tail/head per the single wedge; the induced walk chains head → next tail
  const byTail = new Map<string, string[]>();
  const tailOf = new Map<string, string>();
  const headOf = new Map<string, string>();
  for (const edge of free) {
    const [tail, head] = (wedgeDir.get(edge.id) ?? 1) === 1 ? [edge.u, edge.v] : [edge.v, edge.u];
    tailOf.set(edge.id, tail);
    headOf.set(edge.id, head);
    byTail.set(tail, [...(byTail.get(tail) ?? []), edge.id]);
  }
  // coherence: every boundary vertex must have exactly one outgoing free edge
  for (const list of byTail.values()) {
    if (list.length !== 1) return null;
  }
  const visited = new Set<string>();
  const circles: BoundaryCircleWalk[] = [];
  const anchors = free.map((e) => e.id).sort((a, b) => a.localeCompare(b));
  for (const anchor of anchors) {
    if (visited.has(anchor)) continue;
    const walk: string[] = [];
    let current = anchor;
    for (;;) {
      if (visited.has(current)) return null; // re-entered mid-walk — not disjoint circles
      visited.add(current);
      walk.push(current);
      const next = (byTail.get(headOf.get(current) as string) ?? [])[0];
      if (!next) return null; // an arc, not a circle
      if (next === anchor) break;
      current = next;
    }
    circles.push({ edgeIds: walk, anchor });
  }
  return circles;
}

// Sew two of the form's boundary circles (the researcher-ruled meaningful
// sub-family). The mode's INDEX CORRESPONDENCE lives here: the two circles are
// walked in their wedge-induced directions; a PRESERVING seam pairs walk A
// with walk B REVERSED (per-edge G3 then chains coherently — the
// orientation-compatible sew), a REVERSING seam pairs the walks ALIGNED. The
// rotation anchor is deterministic (each circle starts at its smallest edge
// id); for circles, every rotation of the seam is the same sew up to
// homeomorphism.
export function sewBoundaryCircles(
  form: Shape,
  mode: IdentifyMode,
  circleIndexA = 0,
  circleIndexB = 1,
  ancestry: Shape | Shape[] | null = null,
): IdentifiedComplex {
  // a single-face QUOTIENT keeps its committed route (the word chain owns it);
  // every other bridge-refused form resolves through the ACQUISITION CHAIN
  if (form.faces.length === 1) {
    try {
      directComplexOf(form);
    } catch (error) {
      throw new Error(
        `complexIdentification: sew needs the explicit complex (${error instanceof Error ? error.message : String(error)}) — a single-face quotient sews its rims through the committed word ops (the composed chain)`,
      );
    }
  }
  const acquired = acquireComplex(form, ancestry);
  if (!acquired) {
    throw new Error(
      'complexIdentification: sew needs the form\'s faithful complex — the direct bridge refuses it and no replay recovery reaches it (pass the form\'s ancestry for chained recovery)',
    );
  }
  const complex = acquired.complex;
  const circles = walkBoundaryCircles(complex);
  if (!circles) {
    throw new Error('complexIdentification: the free 1-skeleton is not a disjoint union of coherent circles — nothing to sew');
  }
  if (circles.length < 2) {
    throw new Error(`complexIdentification: the form has ${circles.length} boundary circle${circles.length === 1 ? '' : 's'} — sewing needs two`);
  }
  const a = circles[circleIndexA];
  const b = circles[circleIndexB];
  if (!a || !b || circleIndexA === circleIndexB) {
    throw new Error('complexIdentification: pick two distinct boundary circles to sew');
  }
  if (a.edgeIds.length !== b.edgeIds.length) {
    throw new Error(
      `complexIdentification: the circles do not match (${a.edgeIds.length} vs ${b.edgeIds.length} edge classes) — subdivide to equalize the rims, never silently mis-match`,
    );
  }
  const cycleB = mode === 'preserving' ? [...b.edgeIds].reverse() : [...b.edgeIds];
  return identify(form, a.edgeIds, cycleB, mode, ancestry); // the ancestry threads through (the chain across generations)
}
