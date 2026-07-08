// inkedFormModel — Manuscript Phase 1: the react-free model of the inked form.
// (The faithfulness half; the rendering in InkedForm.tsx consumes it verbatim,
// and the acceptance diagnostic requires THIS module through the anti-mock hook.)
//
// THE ONE LAW (docs/design/CONTEXT.md · design ADR 0001): every visible mark is
// a value the engine computed. This module DERIVES, never invents:
//
//   · the GENERATOR LOOPS — ordered closed vertex paths on the committed
//     immersion, read off `correspondence.word` + `gridVertexTo` ONLY:
//       torus  abAB → letters a, b are each CLOSED identified cycles → two
//              loops (a = the j=0 boundary row → the outer longitude circle;
//              b = the i=0 boundary column → the meridian circle);
//       klein  abaB → a, b both closed → two loops;
//       rp2    abab → a and b are individually ARCS between the two corner
//              classes (the L2 selectors' own `closed: false` reading); the
//              ℤ/2 generator is their closed CONCATENATION a·b, walked along
//              the perimeter (the j=0 row, then the i=R column) through
//              `gridVertexTo` — drawn, not erased by the cross-cap;
//       sphere ''   → NO gluing word → NO loops (H₁ = 0 — the null case:
//              nothing is drawn that the math does not carry);
//       cylinder/mobius → the single glued letter is an arc between distinct
//              rim classes and the other letters are FREE edges (each appears
//              once in the word — not identifications): no closed generator is
//              derivable from the correspondence, so NONE is drawn. (Their real
//              core-circle generator is not an identified-boundary curve; a
//              faithful drawing of it would need its own derivation charter.)
//
//   · the INVARIANT CAPTION — read from the committed certifiers
//     (`readFormInvariants` → χ / w₁ certificate / b₁ / classification). The
//     H₁ label is CLASSIFICATION ARITHMETIC on those certified values only
//     (H₁(Σ_g) = ℤ^{2g}; H₁(N_k) = ℤ^{k−1} ⊕ ℤ/2 — the same spirit as
//     formInvariants' genus arithmetic), cross-checked against `cert.b1`
//     (= dim H₁ over 𝔽₂: 2g orientable, k non-orientable) in the diagnostic.
//
// NON-KNOBS: which loops exist and what the construction grid is are decided
// HERE, from the correspondence — no craft parameter can add or remove a mark.
//
// DERIVE-ONLY · ADDITIVE: committed modules consumed by import only; no engine
// value is recomputed.

import type { VertexId } from '../types/geometry';
import {
  immerseSurface,
  type ImmersedSurfaceKey,
  type QuotientCorrespondence,
  type SurfaceImmersion,
  type SurfaceImmersionSpec,
} from '../lib/surfaceImmersion';
import { readFormInvariants, type FormInvariantsReadout } from '../playground/formInvariants';

export interface GeneratorLoop {
  letters: Array<'a' | 'b'>; // the word letters the loop traces: ['a'] | ['b'] | ['a','b']
  label: string; // 'a' | 'b' | 'a·b'
  vertexPath: VertexId[]; // ordered CLOSED path on the quotient (first === last)
  gridPath: Array<{ i: number; j: number }>; // the walked fundamental-square points (provenance)
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

// The generator loops, derived ONLY from the correspondence (word + gridVertexTo).
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

// H₁ as classification arithmetic on CERTIFIED values only (χ from the
// certifier, orientability from the w₁ certificate); null where the closed
// classification honestly does not apply — the caption then reads n-a.
export function h1LabelFromCertified(readout: FormInvariantsReadout): string | null {
  if (!readout.cert || readout.boundary !== 'closed' || readout.chiCertified === null) return null;
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
  loops: GeneratorLoop[]; // ONLY what deriveGeneratorLoops carries
  invariants: FormInvariantsReadout; // the committed certifiers' readout
  h1Label: string | null;
}

export function buildInkedFormModel(spec: SurfaceImmersionSpec): InkedFormModel {
  const immersion = immerseSurface(spec);
  const loops = deriveGeneratorLoops(immersion.correspondence);
  const invariants = readFormInvariants(immersion.shape);
  return {
    surface: spec.surface,
    immersion,
    loops,
    invariants,
    h1Label: h1LabelFromCertified(invariants),
  };
}
