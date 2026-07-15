// surfaceRefinement — THE RIM (engineer-chartered 2026-07-16, sealed
// e5e2e7fb…4dde; mothership-chartered ARC 0.0 REFINE · researcher-defined 1600).
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
// THE LOOP (the researcher's rule, verbatim): BISECT UNTIL A CHORD CAN CUT A
// DISTINCT-CORNERED DISK. THEN CHORD. The exit condition is the gate's own
// rule — new Set(cycle).size === cycle.length — applied to the would-be disk
// (its arc plus the chord), with the chord's endpoint pair FRESH (parallel to
// no rim edge: the endpoint-keyed seam could not resolve it otherwise).
// Terminating: each pass doubles the slots and adds a midpoint class per edge
// class. Measured pass-counts: RP² 4-gon 1 · RP² 2-gon 2 · T² 1 · Klein 1
// (the 2-gon admits no chord at pass 0 — that is the loop's first iteration,
// not a defect).
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
// ⚠ KNOWN DEBT, named by the mandate and NOT fixed here: the endpoint-keyed
// readers (tryDirectComplex, the seam) cannot translate a refined T²/Klein at
// the ruled exit — their halves h(a,1)=(x,m) and h(a,2)=(m,x) are PARALLEL
// classes on one endpoint pair. The op's output is a valid complex; the
// reader abstains. The deeper fix (explicit signed classes, never
// endpoint-derived) is its own build.
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

// the exit condition — the gate's own rule on the would-be disk: a chord
// between non-adjacent positions whose arc has all-distinct corners, whose
// endpoints are distinct classes, and whose endpoint pair is FRESH (parallel
// to no rim slot — the endpoint-keyed seam could not resolve it otherwise)
const findChord = (state: RimState): ChordPick | null => {
  const { n, corners } = state;
  const rimPairs = new Set<string>();
  for (let k = 0; k < n; k += 1) {
    const a = corners[k];
    const b = corners[(k + 1) % n];
    rimPairs.add(a < b ? `${a}|${b}` : `${b}|${a}`);
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
      const key = vi < vj ? `${vi}|${vj}` : `${vj}|${vi}`;
      if (rimPairs.has(key)) continue;
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
 * refineToDisk — THE PAIR: bisect until a chord can cut a distinct-cornered
 * disk, then chord. The exit is the gate's own rule on the would-be disk.
 * Returns the refined form (2 faces — the disk and the remainder) with the
 * refinement record: type-claim 'resolution', the measured pass count, and
 * the carrier surjection new→old.
 */
export function refineToDisk(form: Shape, parent: Shape | null): RefineResult {
  const { state, slotEdgeOf } = recoverState(form, parent);
  let current = state;
  let chord = findChord(current);
  // terminating: each pass doubles the slots and adds a midpoint class per
  // edge class; the hard stop is a programmer-guard, not a tuning knob
  const HARD_STOP = 8;
  while (!chord && current.pass < HARD_STOP) {
    current = bisectPass(current);
    chord = findChord(current);
  }
  if (!chord) {
    throw new Error(`surfaceRefinement: no distinct-cornered disk after ${HARD_STOP} passes — refusing (report this form)`);
  }
  return assembleRefined(form, current, chord, slotEdgeOf);
}
