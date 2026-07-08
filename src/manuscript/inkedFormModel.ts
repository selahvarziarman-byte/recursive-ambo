// inkedFormModel — Manuscript Phase 1.5: the react-free model of the inked form.
// (The faithfulness half; the rendering in InkedForm.tsx consumes it verbatim,
// and the acceptance diagnostic requires THIS module through the anti-mock hook.)
//
// THE ONE LAW (docs/design/CONTEXT.md · design ADR 0001) + THE CERTIFICATION BAR
// (researcher ruling `RESEARCHER_RULING_FAITHFUL_LOOP_SET.md`): every drawn loop
// is a CERTIFIED H₁ generator and the drawn set is a full basis (b₁ loops).
// Class = certified (Option A: the gluing word's identified boundary; Option B:
// `globalW1.basisCycles`); representative = craft. This module DERIVES, never invents:
//
//   · the WORD LOOPS (Option A — complete for single-polygon CLOSED surfaces,
//     researcher §1 canon), read off `correspondence.word` + `gridVertexTo` ONLY:
//       torus  abAB → letters a, b are each CLOSED identified cycles → two
//              loops (a = the j=0 boundary row → the outer longitude circle;
//              b = the i=0 boundary column → the meridian circle);
//       klein  abaB → a, b both closed → two loops;
//       rp2    abab → a and b are individually ARCS between the two corner
//              classes (the L2 selectors' own `closed: false` reading); the
//              ℤ/2 generator is their closed CONCATENATION a·b, walked along
//              the perimeter (the j=0 row, then the i=R column) through
//              `gridVertexTo` — drawn, not erased by the cross-cap;
//       sphere ''   → NO gluing word → NO loops (H₁ = 0 — the null case);
//       cylinder/mobius → the word carries no closed identified cycle (the one
//              glued letter is an arc between distinct rim classes; free letters
//              are never marks) → Option A yields none, and Option B takes over:
//
//   · the OPEN CORES (Option B — researcher §2: b₁=1 open surfaces MUST draw
//     their one generator; 0 was a partial erasure). The core is extracted from
//     the committed certifier itself: bridge the shape to an `AssembledComplex`
//     (the formInvariants direct-complex rules), run the committed
//     `analyzeGlobalW1(…, {subdivide:false})` so `debug.basisCycles` speaks in
//     REAL shape-edge ids, validate its cert against the committed subdivided
//     certificate (b₁ / w₁Class / orientability must agree — raw mode reports
//     `nonDegenerate:false` by construction, hence the cross-check), and draw
//     each basis cycle as an ordered simple closed path. Verified 2026-07-08:
//     cylinder R∈{8,16} → one simple R-edge ring, w₁Class [0]; mobius → one
//     simple 2R-edge ring through the half-twist, w₁Class [1]. NEVER hand-drawn:
//     any validation failure THROWS rather than draw an uncertified mark.
//
//   · the INVARIANT CAPTION — read from the committed certifiers
//     (`readFormInvariants` → χ / w₁ certificate / b₁ / classification). The
//     H₁ label is CLASSIFICATION ARITHMETIC on those certified values only:
//     closed → H₁(Σ_g)=ℤ^{2g} / H₁(N_k)=ℤ^{k−1}⊕ℤ/2; open (bounded complex,
//     homotopy-equivalent to a wedge of b₁ circles) → ℤ^{b₁}, torsion-free.
//     Cross-checked against `cert.b1` in the diagnostic.
//
// NON-KNOBS: which loops exist and what the construction grid is are decided
// HERE, from the correspondence + the certifier — no craft parameter can add
// or remove a mark. (Hatching is TONE, lives entirely in the renderer, and has
// no input into this module — asserted in the diagnostic.)
//
// DERIVE-ONLY · ADDITIVE: committed modules consumed by import only; no engine
// value is recomputed. The complex bridge below re-expresses the shape for the
// committed certifier exactly as formInvariants' private `tryDirectComplex`
// does (unique endpoint keys, no parallel classes, no self-loops) — its
// equivalence to the committed bridge is asserted in the diagnostic.

import type { Shape, VertexId } from '../types/geometry';
import {
  immerseSurface,
  type ImmersedSurfaceKey,
  type QuotientCorrespondence,
  type SurfaceImmersion,
  type SurfaceImmersionSpec,
} from '../lib/surfaceImmersion';
import {
  analyzeGlobalW1,
  type AssembledComplex,
  type GlobalW1Cert,
} from '../lib/globalW1';
import { readFormInvariants, type FormInvariantsReadout } from '../playground/formInvariants';

export interface GeneratorLoop {
  letters: Array<'a' | 'b'>; // the word letters the loop traces (empty for a certified core)
  label: string; // 'a' | 'b' | 'a·b' | 'core'
  vertexPath: VertexId[]; // ordered CLOSED path on the quotient (first === last)
  gridPath: Array<{ i: number; j: number }>; // the walked fundamental-square points (word loops; empty for cores)
  basisEdgeIds?: string[]; // certified-core provenance: the raw `globalW1` basis-cycle edge ids
}

const at = (correspondence: QuotientCorrespondence, i: number, j: number): VertexId => {
  const vertexId = correspondence.gridVertexTo[`${i},${j}`];
  if (!vertexId) {
    throw new Error(`inkedFormModel: grid point (${i},${j}) missing from the correspondence`);
  }
  return vertexId;
};

// The two canonical letter walks on the fundamental square (perimeter reading
// [bottom, right, top, left] — surfaceImmersion's own convention): letter `a`
// is carried by the j=0 boundary row, letter `b` by the i=0 boundary column.
function letterWalk(
  correspondence: QuotientCorrespondence,
  letter: 'a' | 'b',
): { grid: Array<{ i: number; j: number }>; path: VertexId[] } {
  const R = correspondence.resolution;
  const grid: Array<{ i: number; j: number }> = [];
  for (let k = 0; k <= R; k += 1) {
    grid.push(letter === 'a' ? { i: k, j: 0 } : { i: 0, j: k });
  }
  return { grid, path: grid.map((p) => at(correspondence, p.i, p.j)) };
}

// The word-derived generator loops (Option A), from the correspondence ONLY.
export function deriveGeneratorLoops(correspondence: QuotientCorrespondence): GeneratorLoop[] {
  const R = correspondence.resolution;
  const word = correspondence.word;
  if (word === '') return []; // no gluing word (sphere): H₁ = 0 — nothing to draw

  // Identified letters appear TWICE in the word (case-insensitive; capital =
  // inverse of the same edge). A letter appearing once is a FREE (rim) edge —
  // never a generator mark.
  const counts = new Map<string, number>();
  for (const ch of word.toLowerCase()) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  const identified = new Set(
    [...counts.entries()].filter(([, n]) => n === 2).map(([ch]) => ch),
  );

  const loops: GeneratorLoop[] = [];
  const openArcs: Array<'a' | 'b'> = [];
  for (const letter of ['a', 'b'] as const) {
    if (!identified.has(letter)) continue;
    const walk = letterWalk(correspondence, letter);
    if (walk.path[0] === walk.path[walk.path.length - 1]) {
      loops.push({ letters: [letter], label: letter, vertexPath: walk.path, gridPath: walk.grid });
    } else {
      openArcs.push(letter);
    }
  }

  // Both identified letters open (RP², word abab): each is an arc between the
  // two corner classes, and the closed generator is the perimeter concatenation
  // a·b — the j=0 row followed by the i=R column (the word's first two sides).
  if (loops.length === 0 && openArcs.length === 2) {
    const grid: Array<{ i: number; j: number }> = [];
    for (let i = 0; i <= R; i += 1) grid.push({ i, j: 0 });
    for (let j = 1; j <= R; j += 1) grid.push({ i: R, j });
    const path = grid.map((p) => at(correspondence, p.i, p.j));
    if (path[0] !== path[path.length - 1]) {
      // never draw an unclosed "generator" — fail loudly instead of inking a lie
      throw new Error(
        `inkedFormModel: ${correspondence.surface} a·b perimeter concatenation failed to close — refusing to draw`,
      );
    }
    loops.push({ letters: ['a', 'b'], label: 'a·b', vertexPath: path, gridPath: grid });
  }

  return loops;
}

// ---------------------------------------------------------------------------
// Option B — the certified open core (Phase 1.5 Part A)
// ---------------------------------------------------------------------------

// shape → AssembledComplex, the formInvariants direct-complex rules verbatim:
// every face slot resolves to exactly one edge by endpoints, no two edges share
// an endpoint key, no self-loops. Pure re-expression — nothing computed.
export function toAssembledComplex(shape: Shape): AssembledComplex {
  const key = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const byKey = new Map<string, { id: string; u: string; v: string }>();
  for (const edge of shape.edges) {
    const [u, v] = edge.vertexIds;
    if (u === v) throw new Error(`inkedFormModel: bridge refused — self-loop edge ${edge.id}`);
    const k = key(u, v);
    if (byKey.has(k)) throw new Error(`inkedFormModel: bridge refused — parallel edge class ${k}`);
    byKey.set(k, { id: edge.id, u, v });
  }
  const faces = shape.faces.map((face) => ({
    boundary: face.vertexIds.map((x, i) => {
      const y = face.vertexIds[(i + 1) % face.vertexIds.length];
      const rec = byKey.get(key(x, y));
      if (!rec) throw new Error(`inkedFormModel: bridge refused — face slot ${x}→${y} has no edge`);
      return { edge: rec.id, dir: (rec.u === x && rec.v === y ? 1 : -1) as 1 | -1 };
    }),
  }));
  return { vertices: Object.keys(shape.vertices), edges: [...byKey.values()], faces };
}

// order a set of edges (by id) into one simple closed vertex path; throws if the
// set is not a single all-degree-2 cycle (we refuse to draw what we cannot walk).
function orderSimpleCycle(shape: Shape, edgeIds: string[]): VertexId[] {
  const edgeById = new Map(shape.edges.map((e) => [e.id, e]));
  const adjacency = new Map<VertexId, VertexId[]>();
  for (const id of edgeIds) {
    const edge = edgeById.get(id);
    if (!edge) throw new Error(`inkedFormModel: certified cycle names unknown edge ${id}`);
    const [u, v] = edge.vertexIds;
    adjacency.set(u, [...(adjacency.get(u) ?? []), v]);
    adjacency.set(v, [...(adjacency.get(v) ?? []), u]);
  }
  for (const [vertex, neighbours] of adjacency) {
    if (neighbours.length !== 2) {
      throw new Error(`inkedFormModel: certified cycle not simple at ${vertex} (degree ${neighbours.length})`);
    }
  }
  const start = [...adjacency.keys()][0];
  const path: VertexId[] = [start];
  let previous: VertexId | null = null;
  let current = start;
  do {
    const [n1, n2] = adjacency.get(current) as [VertexId, VertexId];
    const next = n1 === previous ? n2 : n1;
    path.push(next);
    previous = current;
    current = next;
  } while (current !== start && path.length <= edgeIds.length + 1);
  if (current !== start || path.length !== edgeIds.length + 1) {
    throw new Error('inkedFormModel: certified cycle is disconnected — refusing to draw');
  }
  return path;
}

// The certified open-surface cores (researcher §2): extract the committed
// certifier's own H₁ basis on the RAW representation (real edge ids), validated
// against the committed subdivided certificate. Throws on ANY mismatch — a core
// is drawn certified or not at all.
export function deriveOpenCoreLoops(shape: Shape, committedCert: GlobalW1Cert): GeneratorLoop[] {
  const complex = toAssembledComplex(shape);
  const raw = analyzeGlobalW1(complex, { subdivide: false });
  const agree =
    raw.cert.b1 === committedCert.b1 &&
    raw.cert.nonOrientable === committedCert.nonOrientable &&
    JSON.stringify(raw.cert.w1Class) === JSON.stringify(committedCert.w1Class);
  if (!agree) {
    throw new Error(
      `inkedFormModel: raw/subdivided certificates disagree (raw ${JSON.stringify(raw.cert)} vs committed ${JSON.stringify(committedCert)}) — core not certified, refusing to draw`,
    );
  }
  if (raw.debug.basisCycles.length !== committedCert.b1) {
    throw new Error('inkedFormModel: basis-cycle count differs from certified b₁ — refusing to draw');
  }
  return raw.debug.basisCycles.map((edgeIds, k) => ({
    letters: [] as Array<'a' | 'b'>,
    label: committedCert.b1 === 1 ? 'core' : `core${k + 1}`,
    vertexPath: orderSimpleCycle(shape, edgeIds),
    gridPath: [],
    basisEdgeIds: [...edgeIds],
  }));
}

// H₁ as classification arithmetic on CERTIFIED values only; null where no
// honest classification applies — the caption then reads n-a.
export function h1LabelFromCertified(readout: FormInvariantsReadout): string | null {
  if (!readout.cert || readout.chiCertified === null) return null;
  if (readout.boundary === 'open') {
    // a bounded 2-complex surface deformation-retracts to a wedge of b₁ circles:
    // H₁ = ℤ^{b₁}, torsion-free (cert.b1 = dim over 𝔽₂ = the free rank here)
    const rank = readout.cert.b1;
    if (rank === 0) return '0';
    return Array.from({ length: rank }, () => 'ℤ').join(' ⊕ ');
  }
  if (readout.boundary !== 'closed') return null;
  const chi = readout.chiCertified;
  if (!readout.cert.nonOrientable) {
    const rank = 2 - chi; // = 2g
    if (rank < 0 || rank % 2 !== 0) return null;
    if (rank === 0) return '0';
    return Array.from({ length: rank }, () => 'ℤ').join(' ⊕ ');
  }
  const k = 2 - chi; // cross-caps
  if (k < 1) return null;
  return [...Array.from({ length: k - 1 }, () => 'ℤ'), 'ℤ/2'].join(' ⊕ ');
}

export interface InkedFormModel {
  surface: ImmersedSurfaceKey;
  immersion: SurfaceImmersion; // the committed geometry + correspondence, untouched
  loops: GeneratorLoop[]; // ONLY word loops (Option A) + certified cores (Option B)
  invariants: FormInvariantsReadout; // the committed certifiers' readout
  h1Label: string | null;
}

export function buildInkedFormModel(spec: SurfaceImmersionSpec): InkedFormModel {
  const immersion = immerseSurface(spec);
  const invariants = readFormInvariants(immersion.shape);
  const wordLoops = deriveGeneratorLoops(immersion.correspondence);
  const coreLoops =
    invariants.boundary === 'open' && invariants.cert && invariants.cert.b1 > 0
      ? deriveOpenCoreLoops(immersion.shape, invariants.cert)
      : [];
  return {
    surface: spec.surface,
    immersion,
    loops: [...wordLoops, ...coreLoops],
    invariants,
    h1Label: h1LabelFromCertified(invariants),
  };
}
