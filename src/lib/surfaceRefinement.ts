// surfaceRefinement — THE RIM (engineer-chartered 2026-07-16, sealed
// e5e2e7fb…4dde; mothership-chartered ARC 0.0 REFINE · researcher-defined 1600)
// · THE EXIT (re-charter 2026-07-16, sealed a1587899…1049, after the coder's
// stop killed SEAL_THE_SEAM: the exit now tests EVERY wall it must clear).
// Refine until a disk can be cut. The level-2 sibling of level3Subdivision —
// a SIBLING, not a refactor: no L3 code is imported or moved.
//
// WHY THE OP IS A PAIR — neither half works alone:
//   · CHORD alone is DEAD by pigeonhole: it mints no vertex, so the corner-
//     class count is frozen; every sub-face has ≥3 slots from ≤2 classes, a
//     corner must repeat, and connectedSum's quotient-cycle gate (:129)
//     refuses the disk.
//   · BISECTION alone is ALSO dead: the bisected RP² rim reads
//     [p, m_a, q, m_b, p, m_a, q, m_b] — 4 classes, 8 slots — still repeats.
//   BISECT grows the classes. The CHORD cuts a sub-face small enough to use
//   them. Both are load-bearing.
//
// THE LOOP (the researcher's rule, deepened by THE EXIT re-charter): BISECT
// UNTIL A CHORD CAN CUT A DISK THAT CLEARS EVERY WALL. connectedSum applies
// FOUR walls; a loop's exit condition must test every wall it must clear:
//   :98  faces ≥ 2            — the chord clears it by construction;
//   :122 equal rim lengths    — cleared freely (the exit disk is minimal);
//   :127 distinct corners     — tested (new Set(cycle).size === cycle.length);
//   :132 no parallel rim pair — ★ tested since THE EXIT (each disk rim pair
//        carried by exactly ONE edge instance — the wall's own predicate,
//        re-derived here, never imported from the frozen wall).
// The chord's endpoint pair stays FRESH (parallel to no rim slot). Measured
// pass-counts at the full exit: RP² 4-gon 1 · RP² 2-gon 2 · T² 2 · Klein 2
// (the 2-gon admits no chord at pass 0; T²/Klein clear :127 at pass 1 but
// their halves h(a,1)/h(a,2) still share endpoint pairs — one more pass
// breaks the collision. The old exit stopped there: three seals died on
// walls the exit never asked about).
//
// THE WORD IS THE SUBSTRATE: the op recovers the form's birth word through the
// committed, replay-verified `recoverBornSurface` and refines at the
// (polygon, word) level — the quotient Shape alone under-determines the
// complex (parallel edge classes, degenerate cycles), and the slot→edge
// binding lives in the recovery's own materialized complex. The gluing
// convention (preserving = crossed corners a≡b+1 · a+1≡b; reversing =
// parallel corners a≡b · a+1≡b+1) is ASSERTED per call: the pass-0 settle
// must reproduce the born cycle byte-for-byte, or the op throws.
//
// REFINE IS NOT A BIRTH — for a minting op this is not an analogy: the L3
// instance (bisectEdges, 8 → 20 vertices on the cube) is already committed
// and witnessed. Bisecting an edge adds ONE vertex AND ONE edge — χ cannot
// move. Minting a cell is not begetting a form:
//   · the result carries the form's id, name, genealogy, generations and
//     cells VERBATIM — no genealogy node, no pentimento, nothing consumed;
//   · the CARRIER law: every new cell's parent is the unique smallest OLD
//     cell whose closure contains it — midpoints and half-edges → the edge
//     they subdivide (via the recovery's slot→edge binding, composed through
//     passes); the disk, the remainder and the chord → the face. Surjective
//     new→old, recorded on the refinement;
//   · type-claim = 'resolution', NEVER 'lineage' (design ADR 0003: a mark's
//     ink carries a type-claim and it must be true — birth-ink would assert
//     a falsehood; a pentimento would mourn a parent that never died).
//
// ⚠ KNOWN DEBT, named and NOT fixed here: the endpoint-keyed readers
// (tryDirectComplex, the seam) cannot translate a PARTIALLY-refined quotient
// whose halves share an endpoint pair — e.g. ONE bisection pass of T²/Klein
// leaves h(a,1)=(x,m) and h(a,2)=(m,x) PARALLEL, and the reader abstains
// (bisectSurface output can still carry this). THE EXIT clears it for the
// pair's own outputs BY DEPTH — refineToDisk keeps bisecting until the disk
// rim is parallel-free, which on the zoo lands fully endpoint-faithful forms
// the readers translate directly. The deeper fix (explicit signed classes,
// never endpoint-derived) remains its own build — the seam's known debt,
// formally owed elsewhere.
//
// ⚠ PROVENANCE GAP, disclosed: the frozen OperationKind union has no word for
// refinement, and the freeze must not move in this build. Minted midpoints
// therefore inherit the form's own birth operation in `createdBy.operation`,
// with `sourceEdgeId` carrying the true provenance (the subdivided edge). The
// one-word union addition ('refine') is a frozen-types ruling for the
// engineer's hand.

import type { Face, Shape, VertexId } from '../types/geometry';
import type { BoundaryPairing } from './surfaceOperations';
import { createDefaultVertexData } from './shape';
import { recoverBornSurface } from '../playground/bornFormRouting';
// P2 (DOORS batch) — the WORDLESS bisection consumes the acquisition chain
// (an acquired composite has a complex but no birth word) and the committed
// boundary walker (the sew preparer equalizes rims). No cycle: the
// identification module never imports this one.
import { acquireComplex, walkBoundaryCircles } from './complexIdentification';
import type { AssembledComplex } from './globalW1';

export interface RefinementRecord {
  typeClaim: 'resolution'; // never 'lineage' — refine is not a birth
  passes: number;
  chordEdgeId: string | null; // null for a bisection-only refinement
  // the carrier surjection new→old: every new cell id → the old cell whose
  // closure contains it (old cells map to themselves)
  carrier: Record<string, string>;
}

export interface RefineResult {
  shape: Shape;
  refinement: RefinementRecord;
}

interface RimState {
  n: number;
  word: BoundaryPairing[];
  corners: string[]; // the settled quotient label per position
  slotOrigin: number[]; // per slot: the pass-0 slot it descends from
  pass: number;
  mintNs: string; // namespace for minted ids (the form's id — keeps sums disjoint)
}

// union-find over polygon positions under the word — the derived convention,
// asserted against the engine's own born cycle at pass 0
const settleCorners = (n: number, word: BoundaryPairing[], provisional: string[]): string[] => {
  const uf = new Map<number, number>();
  const find = (x: number): number => {
    let r = x;
    while (uf.get(r) !== r) r = uf.get(r) as number;
    let c = x;
    while (uf.get(c) !== r) {
      const nx = uf.get(c) as number;
      uf.set(c, r);
      c = nx;
    }
    return r;
  };
  const union = (x: number, y: number): void => {
    uf.set(find(x), find(y));
  };
  for (let k = 0; k < n; k += 1) uf.set(k, k);
  for (const { edgeA: a, edgeB: b, mode } of word) {
    if (mode === 'preserving') {
      union(a, (b + 1) % n);
      union((a + 1) % n, b);
    } else {
      union(a, b);
      union((a + 1) % n, (b + 1) % n);
    }
  }
  const out: string[] = [];
  for (let k = 0; k < n; k += 1) out.push(provisional[find(k)]);
  return out;
};

// slot classes under the word (which boundary slots are identified)
const slotClassOf = (n: number, word: BoundaryPairing[]): ((k: number) => number) => {
  const uf = new Map<number, number>();
  const find = (x: number): number => {
    let r = x;
    while (uf.get(r) !== r) r = uf.get(r) as number;
    return r;
  };
  for (let k = 0; k < n; k += 1) uf.set(k, k);
  for (const { edgeA: a, edgeB: b } of word) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) uf.set(ra, rb);
  }
  return find;
};

// one uniform bisection pass at the word level: n-gon → 2n-gon; the lifted
// word sends each slot's halves to its partner's halves (preserving crosses,
// reversing parallels — the midpoint maps to the midpoint either way)
const bisectPass = (state: RimState): RimState => {
  const { n, word, corners, slotOrigin, pass, mintNs } = state;
  const sc = slotClassOf(n, word);
  const provisional: string[] = [];
  const origin2: number[] = [];
  for (let k = 0; k < n; k += 1) {
    provisional.push(corners[k], `mid:${mintNs}:p${pass}:s${sc(k)}`);
    origin2.push(slotOrigin[k], slotOrigin[k]);
  }
  const lifted: BoundaryPairing[] = word.flatMap(({ edgeA: a, edgeB: b, mode }): BoundaryPairing[] =>
    mode === 'preserving'
      ? [
          { edgeA: 2 * a, edgeB: 2 * b + 1, mode },
          { edgeA: 2 * a + 1, edgeB: 2 * b, mode },
        ]
      : [
          { edgeA: 2 * a, edgeB: 2 * b, mode },
          { edgeA: 2 * a + 1, edgeB: 2 * b + 1, mode },
        ],
  );
  const settled = settleCorners(2 * n, lifted, provisional);
  return { n: 2 * n, word: lifted, corners: settled, slotOrigin: origin2, pass: pass + 1, mintNs };
};

interface ChordPick {
  i: number;
  j: number;
  arc: string[]; // the disk's corners (both chord endpoints included)
}

// THE EXIT — a loop's exit condition must test EVERY wall it must clear (the
// re-charter's law; the seam post-mortem). The gate's own rules on the
// would-be disk: a chord between non-adjacent positions whose arc has
// all-distinct corners (:127), whose endpoints are distinct classes, whose
// endpoint pair is FRESH (parallel to no rim slot), AND whose disk rim is
// ENDPOINT-FAITHFUL — every rim pair of the disk carried by exactly ONE edge
// instance (:132's own predicate, re-derived here by design: the exit must
// ask the same question the wall asks, without importing the frozen wall)
const findChord = (state: RimState): ChordPick | null => {
  const { n, corners, word } = state;
  const pairKeyOf = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);
  // the result carries ONE edge per slot CLASS (plus the chord) — :132 counts
  // edge INSTANCES per unordered endpoint pair, so the census is per class,
  // never per slot (a class's two slots share one settled pair)
  const sc = slotClassOf(n, word);
  const classPairCount = new Map<string, number>();
  const rimPairs = new Set<string>();
  const seenClass = new Set<number>();
  for (let k = 0; k < n; k += 1) {
    const key = pairKeyOf(corners[k], corners[(k + 1) % n]);
    rimPairs.add(key);
    const rep = sc(k);
    if (seenClass.has(rep)) continue;
    seenClass.add(rep);
    classPairCount.set(key, (classPairCount.get(key) ?? 0) + 1);
  }
  for (let i = 0; i < n; i += 1) {
    for (let d = 2; d <= n - 2; d += 1) {
      const j = (i + d) % n;
      const arc: string[] = [];
      for (let k = i; ; k = (k + 1) % n) {
        arc.push(corners[k]);
        if (k === j) break;
      }
      if (new Set(arc).size !== arc.length) continue;
      const vi = corners[i];
      const vj = corners[j];
      if (vi === vj) continue;
      const key = pairKeyOf(vi, vj);
      if (rimPairs.has(key)) continue;
      // ★ the missing conjunct (THE EXIT): every arc edge's endpoint pair
      // must be carried by exactly one class — else the sum's parallel-rim
      // wall (:132) refuses the disk downstream. The chord itself is fresh
      // (checked above), hence automatically the unique instance on its pair.
      let parallelFree = true;
      for (let k = i; k !== j; k = (k + 1) % n) {
        if ((classPairCount.get(pairKeyOf(corners[k], corners[(k + 1) % n])) ?? 0) !== 1) {
          parallelFree = false;
          break;
        }
      }
      if (!parallelFree) continue;
      return { i, j, arc };
    }
  }
  return null;
};

const keySafeNs = (id: string): string => id.replace(/[×|]/g, '_');

const beginState = (form: Shape, word: BoundaryPairing[]): RimState => ({
  n: form.faces[0].vertexIds.length,
  word,
  corners: [...form.faces[0].vertexIds],
  slotOrigin: form.faces[0].vertexIds.map((_, k) => k),
  pass: 0,
  mintNs: keySafeNs(form.id),
});

// assemble the refined Shape from a settled state — the SAME form (identity,
// name, genealogy, generations, cells verbatim), at a finer resolution
const assembleRefined = (
  form: Shape,
  state: RimState,
  chord: ChordPick | null,
  slotEdgeOf: (originSlot: number) => string,
): RefineResult => {
  const { n, corners } = state;
  const face = form.faces[0];
  const carrier: Record<string, string> = {};
  for (const id of Object.keys(form.vertices)) carrier[id] = id;
  const vertices: Shape['vertices'] = { ...form.vertices };
  const edgeById = new Map(form.edges.map((e) => [e.id, e]));
  for (let k = 0; k < n; k += 1) {
    const label = corners[k];
    if (vertices[label]) continue;
    // a minted midpoint class: its carrier is the OLD EDGE it subdivides
    // (both halves of a bisected slot share the same pass-0 origin, so the
    // slot at the midpoint's own position binds it). Its lineage SOURCES are
    // that old edge's endpoints — REAL old vertices with terminating lineage
    // (settled-cycle neighbors would be mutual and cycle the lineage walk).
    const oldEdgeId = slotEdgeOf(state.slotOrigin[k]);
    const oldEdge = edgeById.get(oldEdgeId);
    const src = oldEdge ? oldEdge.vertexIds : ([corners[(k - 1 + n) % n], corners[(k + 1) % n]] as [string, string]);
    const p1 = form.vertices[src[0]]?.position ?? [0, 0, 0];
    const p2 = form.vertices[src[1]]?.position ?? p1;
    vertices[label] = {
      id: label,
      // position = midpoint of the subdivided edge's endpoints (a loop's
      // midpoint sits on the point itself — the quotient's immersion is
      // already degenerate there)
      position: [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2],
      data: createDefaultVertexData(label),
      createdBy: {
        shapeId: form.id,
        // the frozen OperationKind has no word for refinement (disclosed in
        // the header); the true provenance is sourceEdgeId — the subdivided
        // old edge — with the form's own birth operation inherited
        operation: form.genealogy.operation,
        sourceVertexIds: [...src],
        sourceEdgeId: oldEdgeId,
      },
    };
    carrier[label] = oldEdgeId;
  }
  const sc = slotClassOf(n, state.word);
  const classSeen = new Set<number>();
  const edges: Shape['edges'] = [];
  for (let k = 0; k < n; k += 1) {
    const rep = sc(k);
    if (classSeen.has(rep)) continue;
    classSeen.add(rep);
    const a = corners[k];
    const b = corners[(k + 1) % n];
    const id = `ref:${state.mintNs}:e${edges.length}`;
    edges.push({ id, vertexIds: [a, b], sourceVertexIds: [a, b] });
    carrier[id] = slotEdgeOf(state.slotOrigin[k]);
  }
  let chordEdgeId: string | null = null;
  let faces: Face[];
  if (chord) {
    chordEdgeId = `ref:${state.mintNs}:chord`;
    edges.push({
      id: chordEdgeId,
      vertexIds: [corners[chord.i], corners[chord.j]],
      sourceVertexIds: [corners[chord.i], corners[chord.j]],
    });
    carrier[chordEdgeId] = face.id;
    const rest: string[] = [];
    for (let k = chord.j; ; k = (k + 1) % n) {
      rest.push(corners[k]);
      if (k === chord.i) break;
    }
    faces = [
      { ...face, id: `${face.id}:disk`, vertexIds: chord.arc },
      { ...face, id: `${face.id}:rest`, vertexIds: rest },
    ];
    carrier[`${face.id}:disk`] = face.id;
    carrier[`${face.id}:rest`] = face.id;
  } else {
    faces = [{ ...face, vertexIds: [...corners] }];
    carrier[face.id] = face.id;
  }
  return {
    shape: { ...form, vertices, edges, faces },
    refinement: { typeClaim: 'resolution', passes: state.pass, chordEdgeId, carrier },
  };
};

// the committed recovery + the convention assertion, shared by both ops
const recoverState = (form: Shape, parent: Shape | null): { state: RimState; slotEdgeOf: (k: number) => string } => {
  if (form.faces.length !== 1) {
    throw new Error(`surfaceRefinement: "${form.name}" has ${form.faces.length} faces — the rim op refines a single-face born form`);
  }
  const recovery = recoverBornSurface(form, parent);
  if (!recovery) {
    throw new Error(
      `surfaceRefinement: cannot recover "${form.name}"'s birth word (the committed replay-verified recovery refused) — the rim op refines born word-forms`,
    );
  }
  if (recovery.pairings.length === 0) {
    throw new Error(`surfaceRefinement: "${form.name}" carries no gluing word (a collapse birth) — nothing to refine along`);
  }
  const state = beginState(form, recovery.pairings);
  const settled = { ...state, corners: settleCorners(state.n, state.word, state.corners) };
  if (JSON.stringify(settled.corners) !== JSON.stringify(form.faces[0].vertexIds)) {
    throw new Error(
      'surfaceRefinement: the derived gluing convention does not reproduce the born cycle — refusing to refine on an unverified convention',
    );
  }
  // slot→edge binding from the recovery's own materialized complex (the
  // engine's faithful complex — unambiguous even for parallel loop classes)
  const boundary = recovery.materialized.complex.faces[0]?.boundary ?? [];
  if (boundary.length !== state.n) {
    throw new Error('surfaceRefinement: the recovered complex boundary does not match the face cycle');
  }
  const slotEdgeOf = (k: number): string => boundary[k].edge;
  return { state: settled, slotEdgeOf };
};

/**
 * bisectSurface — ONE uniform bisection pass (refine only, no chord). One face
 * in, one face out; every edge gains a midpoint class; χ cannot move. This is
 * also the mandate's carried half-mechanism: alone, the rim still repeats and
 * the sum's quotient-cycle gate refuses — the witness exhibits exactly that.
 */
export function bisectSurface(form: Shape, parent: Shape | null): RefineResult {
  const { state, slotEdgeOf } = recoverState(form, parent);
  const once = bisectPass(state);
  return assembleRefined(form, once, null, slotEdgeOf);
}

/**
 * refineToDisk — THE PAIR at THE EXIT: bisect until a chord can cut a disk
 * that clears EVERY wall it must clear — distinct-cornered (:127) AND
 * endpoint-faithful on its rim (:132's predicate) — then chord. Returns the
 * refined form (2 faces — the disk and the remainder) with the refinement
 * record: type-claim 'resolution', the measured pass count, and the carrier
 * surjection new→old.
 */
export function refineToDisk(form: Shape, parent: Shape | null): RefineResult {
  const { state, slotEdgeOf } = recoverState(form, parent);
  let current = state;
  let chord = findChord(current);
  // the BOUND: termination is expected (each pass doubles the slots and adds
  // a midpoint class per edge class, so corner classes strictly grow and
  // parallel collisions strictly break) — but expected is not measured, so
  // the loop carries a hard stop and refuses LOUDLY rather than spin
  const HARD_STOP = 8;
  while (!chord && current.pass < HARD_STOP) {
    current = bisectPass(current);
    chord = findChord(current);
  }
  if (!chord) {
    throw new Error(
      `surfaceRefinement: no disk cleared every wall (distinct corners AND a parallel-free rim) after ${HARD_STOP} passes — refusing loudly (report this form)`,
    );
  }
  return assembleRefined(form, current, chord, slotEdgeOf);
}

/**
 * subdivideFace — H1, THE AIMED CHORD (the person's-hands arc): the committed
 * chord discipline, generalized to ANY face of a MULTI-face shape, with the
 * person aiming the chord's two corners. No word recovery — the face's own
 * vertex cycle IS the rim; the walls the committed `findChord` asks
 * automatically are asked here of the person's aim, and refused BY NAME
 * (total on person-reachable input; DEV-register strings — the designer
 * words them at wiring, not here):
 *   1  a corner not on the face;
 *   2  adjacent (or equal) corners — they already share a rim edge; a
 *      TRIANGLE therefore refuses every pair ("a triangle has no chord");
 *   3  a folded/quotient face (repeated corner classes) — not a disk;
 *   4  a chord duplicating an existing endpoint pair anywhere on the shape
 *      (the endpoint-keyed discipline: one instance per pair);
 *   5  a face not on the shape — integrity (dev).
 * The cut mints the committed conventions verbatim: the chord edge
 * `ref:{ns}:chord…`, the faces `{face.id}:disk` / `{face.id}:rest`, and the
 * CARRIER law — {disk, rest, chord} → face.id, identity elsewhere; surjective
 * new→old. Every OTHER cell is byte-carried (the same objects, never copies):
 * +1 edge, +1 face, +0 vertices — χ cannot move, and the trap measures it.
 */
export function subdivideFace(shape: Shape, face: Face, cornerA: VertexId, cornerB: VertexId): RefineResult {
  const own = shape.faces.find((f) => f.id === face.id);
  if (!own) {
    throw new Error(
      `surfaceRefinement: face "${face.id}" is not on "${shape.name}" — subdivideFace refuses an alien face (integrity)`,
    );
  }
  const cycle = own.vertexIds;
  const n = cycle.length;
  if (new Set(cycle).size !== n) {
    throw new Error(
      `surfaceRefinement: face "${own.id}" repeats a corner class around its rim (a folded/quotient face, not a disk) — subdivideFace cuts disk-like faces only`,
    );
  }
  const i = cycle.indexOf(cornerA);
  if (i < 0) {
    throw new Error(
      `surfaceRefinement: corner "${cornerA}" is not on face "${own.id}" — pick both chord corners from the face's own rim`,
    );
  }
  const j = cycle.indexOf(cornerB);
  if (j < 0) {
    throw new Error(
      `surfaceRefinement: corner "${cornerB}" is not on face "${own.id}" — pick both chord corners from the face's own rim`,
    );
  }
  const d = (j - i + n) % n;
  if (d === 0 || d === 1 || d === n - 1) {
    throw new Error(
      `surfaceRefinement: corners "${cornerA}" and "${cornerB}" are ${d === 0 ? 'the same corner' : 'adjacent'} on face "${own.id}" — a chord joins two corners that do not already share a rim edge (a triangle has no chord)`,
    );
  }
  const pairKeyOf = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const chordKey = pairKeyOf(cornerA, cornerB);
  if (shape.edges.some((e) => pairKeyOf(e.vertexIds[0], e.vertexIds[1]) === chordKey)) {
    throw new Error(
      `surfaceRefinement: a chord "${cornerA}"–"${cornerB}" would duplicate an existing edge's endpoint pair on "${shape.name}" — the endpoint-keyed discipline demands one instance per pair`,
    );
  }
  // the cut — the committed chord geometry on the face's own cycle
  const arc: VertexId[] = [];
  for (let k = i; ; k = (k + 1) % n) {
    arc.push(cycle[k]);
    if (k === j) break;
  }
  const rest: VertexId[] = [];
  for (let k = j; ; k = (k + 1) % n) {
    rest.push(cycle[k]);
    if (k === i) break;
  }
  const ns = keySafeNs(shape.id);
  // unique under repetition: the committed base id, suffixed only on collision
  let chordEdgeId = `ref:${ns}:chord`;
  const edgeIds = new Set(shape.edges.map((e) => e.id));
  for (let k = 2; edgeIds.has(chordEdgeId); k += 1) chordEdgeId = `ref:${ns}:chord:${k}`;
  const chordEdge = {
    id: chordEdgeId,
    vertexIds: [cornerA, cornerB] as [VertexId, VertexId],
    sourceVertexIds: [cornerA, cornerB] as [VertexId, VertexId],
  };
  const faceIndex = shape.faces.findIndex((f) => f.id === own.id);
  const faces: Face[] = [
    ...shape.faces.slice(0, faceIndex),
    { ...own, id: `${own.id}:disk`, vertexIds: arc },
    { ...own, id: `${own.id}:rest`, vertexIds: rest },
    ...shape.faces.slice(faceIndex + 1),
  ];
  const carrier: Record<string, string> = {};
  for (const id of Object.keys(shape.vertices)) carrier[id] = id;
  for (const e of shape.edges) carrier[e.id] = e.id;
  for (const f of shape.faces) {
    if (f.id !== own.id) carrier[f.id] = f.id;
  }
  carrier[chordEdgeId] = own.id;
  carrier[`${own.id}:disk`] = own.id;
  carrier[`${own.id}:rest`] = own.id;
  return {
    shape: { ...shape, edges: [...shape.edges, chordEdge], faces },
    refinement: { typeClaim: 'resolution', passes: 0, chordEdgeId, carrier },
  };
}

// ---------------------------------------------------------------------------
// P2 (DOORS batch, 2026-07-24) — THE WORDLESS BISECTION: refine a form that
// has an ACQUIRABLE COMPLEX but NO BIRTH WORD (an acquired patch-lift
// composite — `recoverState` above rightly refuses it: there is no word to
// verify). The bisection works on the COMPLEX directly: every CHOSEN edge
// class gains a midpoint support (u —m— v) and each face-word slot splits in
// place WITH ITS SIGN CARRIED; χ cannot move (+|S| vertices, +|S| edges,
// faces fixed). The refine discipline holds whole: type-claim 'resolution'
// (subdivision invariance — NOT a birth; the genealogy is carried verbatim),
// carrier surjection new→old (midpoint → its class, halves → their class,
// everything else → itself). The SHAPE is re-assembled from the bisected
// complex in the form's own id space (post-GAP2C the acquired complex's
// supports ARE the form's vertex ids); midpoint positions are endpoint
// midpoints — a drawing offset, no metric claim.
// ---------------------------------------------------------------------------

export interface WordlessBisectResult {
  shape: Shape;
  refinement: RefinementRecord;
  complex: AssembledComplex; // the bisected complex — the truth the shape re-draws
}

export function bisectAcquiredComplex(
  form: Shape,
  ancestry: Shape | Shape[] | null = null,
  classIds: string[] | null = null, // null = every class (one uniform pass)
): WordlessBisectResult {
  const acquired = acquireComplex(form, ancestry);
  if (!acquired) {
    throw new Error(
      'surfaceRefinement: the wordless bisection needs an acquirable complex — the chain returned null (pass the form\'s ancestry for chained recovery)',
    );
  }
  const complex = acquired.complex;
  const chosen = new Set(classIds ?? complex.edges.map((edge) => edge.id));
  const midOf = (classId: string): string => `mid:${classId}`;

  const edges: AssembledComplex['edges'] = [];
  const vertices: string[] = [...complex.vertices];
  for (const edge of complex.edges) {
    if (!chosen.has(edge.id)) {
      edges.push(edge);
      continue;
    }
    const mid = midOf(edge.id);
    vertices.push(mid);
    edges.push({ id: `${edge.id}:a`, u: edge.u, v: mid });
    edges.push({ id: `${edge.id}:b`, u: mid, v: edge.v });
  }
  const faces: AssembledComplex['faces'] = complex.faces.map((face) => ({
    boundary: face.boundary.flatMap((slot) => {
      if (!chosen.has(slot.edge)) return [slot];
      return slot.dir === 1
        ? [
            { edge: `${slot.edge}:a`, dir: 1 as const },
            { edge: `${slot.edge}:b`, dir: 1 as const },
          ]
        : [
            { edge: `${slot.edge}:b`, dir: -1 as const },
            { edge: `${slot.edge}:a`, dir: -1 as const },
          ];
    }),
  }));
  const bisected: AssembledComplex = { vertices, edges, faces };

  // the SHAPE, re-drawn from the bisected complex — rings are the words' tail
  // walks (slot dir +1 crosses u→v), so a ring is the sequence of slot tails
  const byId = new Map(edges.map((edge) => [edge.id, edge]));
  const positionOf = (support: string): [number, number, number] =>
    form.vertices[support]?.position ?? [0, 0, 0];
  const shapeVertices: Shape['vertices'] = { ...form.vertices };
  for (const edge of complex.edges) {
    if (!chosen.has(edge.id)) continue;
    const mid = midOf(edge.id);
    const pu = positionOf(edge.u);
    const pv = positionOf(edge.v);
    shapeVertices[mid] = {
      id: mid,
      position: [(pu[0] + pv[0]) / 2, (pu[1] + pv[1]) / 2, (pu[2] + pv[2]) / 2],
      data: createDefaultVertexData(mid),
      createdBy: {
        shapeId: form.id,
        operation: form.genealogy.operation,
        sourceVertexIds: [edge.u, edge.v],
      },
    };
  }
  const shapeEdges: Shape['edges'] = edges.map((edge) => ({
    id: edge.id,
    vertexIds: [edge.u, edge.v] as Shape['edges'][number]['vertexIds'],
    sourceVertexIds: [edge.u, edge.v] as Shape['edges'][number]['vertexIds'],
  }));
  const shapeFaces: Shape['faces'] = form.faces.map((face, index) => ({
    ...face,
    vertexIds: (bisected.faces[index]?.boundary ?? []).map((slot) => {
      const edge = byId.get(slot.edge) as AssembledComplex['edges'][number];
      return slot.dir === 1 ? edge.u : edge.v;
    }),
  }));

  const carrier: Record<string, string> = {};
  for (const id of Object.keys(form.vertices)) carrier[id] = id;
  for (const edge of complex.edges) {
    if (chosen.has(edge.id)) {
      carrier[midOf(edge.id)] = edge.id;
      carrier[`${edge.id}:a`] = edge.id;
      carrier[`${edge.id}:b`] = edge.id;
    } else {
      carrier[edge.id] = edge.id;
    }
  }
  for (const face of form.faces) carrier[face.id] = face.id;

  return {
    shape: { ...form, vertices: shapeVertices, edges: shapeEdges, faces: shapeFaces },
    refinement: { typeClaim: 'resolution', passes: 1, chordEdgeId: null, carrier },
    complex: bisected,
  };
}

// ---------------------------------------------------------------------------
// P2 — the SEW PREPARER (the combine-prepare pattern, engine half): when the
// form's two boundary circles are walkable but UNEQUAL, classes of the
// SHORTER circle are split (one midpoint each — length grows by exactly one)
// until the rims match; the committed sew then accepts the prepared form.
// Anything else — unwalkable rims, fewer than two circles, no acquirable
// complex — returns the form UNCHANGED with prepared:false (the committed
// doors keep their own sentences; nothing is silently cured).
// ---------------------------------------------------------------------------

export function prepareFormForSew(
  form: Shape,
  ancestry: Shape | Shape[] | null = null,
): { shape: Shape; prepared: boolean } {
  const acquired = acquireComplex(form, ancestry);
  if (!acquired) return { shape: form, prepared: false };
  const circles = walkBoundaryCircles(acquired.complex);
  if (!circles || circles.length < 2) return { shape: form, prepared: false };
  const [a, b] = circles;
  if (a.edgeIds.length === b.edgeIds.length) return { shape: form, prepared: false };
  const [shorter, longer] =
    a.edgeIds.length < b.edgeIds.length ? [a, b] : [b, a];
  const deficit = longer.edgeIds.length - shorter.edgeIds.length;
  const result = bisectAcquiredComplex(form, ancestry, shorter.edgeIds.slice(0, deficit));
  return { shape: result.shape, prepared: true };
}
