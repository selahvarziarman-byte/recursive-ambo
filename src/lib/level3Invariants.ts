// level3Invariants — Build 2: the tower façade.
//
// One call reads the whole tower off a Build-1 `Level3Complex`:
//   Tier-1 — χ (Build 1's own `chi`, NOT recomputed) demoted to a CONSISTENCY
//            reporter: a sound closed 3-complex must have χ=0; on unsound
//            complexes the consistency claim is n-a (null), never faked.
//   Tier-2 — w₁ across face-gluings (level3W1 over the orientation foundation).
//   Tier-3 — integer homology with torsion (level3Homology over the same
//            foundation's ∂ matrices — ONE oriented chain complex feeds both).
// π₁ is NOT computed (undecidable); H₁ is exposed as its abelianization,
// labelled exactly that.

import type { Level3Complex } from './faceIdentification';
import { classifyLevel3Soundness, type Level3SoundnessReport } from './level3SoundnessGate';
import { buildOrientedChainComplex, type OrientedChainComplex } from './level3Orientation';
import { readLevel3W1, type Level3W1Reading } from './level3W1';
import { computeIntegerHomology, type IntegerHomology } from './level3Homology';

export interface Level3InvariantTower {
  chi: number; // Build 1's Tier-1 value, carried
  sound: boolean; // the S² gate's verdict (Build 1)
  // THE CARD UNION (B-2026-08-22-C, sanctioned frozen edit): the ONE
  // closed-detector — STRUCTURAL (the gate's own boundary census: null ⇔ no
  // unpaired/wall face), never χ (χ cannot discriminate the classes — a
  // bounded solid torus is also χ=0; anyone tempted to widen the χ check is
  // refuted here in advance). One producer; the χ gate below, the card's χ
  // rendering fork, and the subtitle fork all read THIS field.
  isClosed: boolean;
  // sound ∧ closed ⇒ (χ === 0); otherwise null — a bounded room is a SOUND
  // object the closed-world check does not fit (χ = χ(∂M)/2: the fan's χ=1
  // is CORRECT), and an unsound complex is not an object the check can be
  // asked of. The 07-18 seal made an unpaired face legitimate; this
  // predicate stopped assuming "sound" implied "closed" two months late.
  chiConsistent: boolean | null;
  w1: Level3W1Reading;
  orientable: boolean;
  homology: IntegerHomology;
  piAbelianization: {
    value: string; // H₁'s pretty form
    label: string; // the honest label — π₁ itself is NOT computed
  };
  oriented: OrientedChainComplex; // the shared foundation (∂ matrices, gluing bits)
  gate: Level3SoundnessReport;
}

// THE FOLDED EDGE (ADR 0022, 2026-07-14): a folded edge class (the gate's
// 'folded-edge' reading — the identification is NOT FREE; the quotient is an
// ORBIFOLD) makes the oriented tower unreadable: a folded cell has no
// consistent orientation, so w₁/homology CANNOT be read on this cell
// structure. The verdict asserts EXACTLY the non-freeness and nothing more.
export interface Level3FoldedVerdict {
  folded: true;
  sound: false;
  chi: number; // Build 1's Tier-1 value — still real (no orientation needed)
  foldedEdgeClasses: string[]; // the class reps whose ends coincide (the fold loci)
  gate: Level3SoundnessReport;
}

export type Level3TowerReading = { folded: false; tower: Level3InvariantTower } | Level3FoldedVerdict;

// THE ORDER IS THE FIX (ADR 0022): the GATE runs BEFORE the orientation
// reader, so a folded complex is a VERDICT here and level3Orientation never
// sees it — its own throw survives one layer deeper as an unreachable-from-
// the-door programmer-guard.
export function readLevel3Tower(complex: Level3Complex): Level3TowerReading {
  const gate = classifyLevel3Soundness(complex);
  const foldedEdgeClasses = gate.failures
    .filter((f): f is Extract<typeof f, { kind: 'folded-edge' }> => f.kind === 'folded-edge')
    // the census mandate (2026-07-16): the failure's field is repEdgeId now —
    // the VALUE is unchanged (the smallest member edge id, which the wall
    // prints), only its name stopped lying. The class ROOT rides beside it as
    // classRoot for any census that must match the link readings.
    .map((f) => f.repEdgeId);
  if (foldedEdgeClasses.length > 0) {
    return { folded: true, sound: false, chi: complex.chi, foldedEdgeClasses, gate };
  }
  return { folded: false, tower: towerFromGate(complex, gate) };
}

function towerFromGate(complex: Level3Complex, gate: Level3SoundnessReport): Level3InvariantTower {
  const oriented = buildOrientedChainComplex(complex);
  const w1 = readLevel3W1(complex, oriented);
  const homology = computeIntegerHomology(
    {
      n0: oriented.vertexReps.length,
      n1: oriented.edgeReps.length,
      n2: oriented.faceReps.length,
      n3: oriented.cellIds.length,
    },
    oriented.d1,
    oriented.d2,
    oriented.d3,
  );
  const isClosed = gate.boundary === null;
  return {
    chi: complex.chi,
    sound: gate.sound,
    isClosed,
    chiConsistent: gate.sound && isClosed ? complex.chi === 0 : null,
    w1,
    orientable: w1.orientable,
    homology,
    piAbelianization: {
      value: homology.H1.pretty,
      label: 'H₁ = the abelianization of π₁ — π₁ itself is undecidable and NOT computed',
    },
    oriented,
    gate,
  };
}

export function level3InvariantTower(complex: Level3Complex): Level3InvariantTower {
  const reading = readLevel3Tower(complex);
  if (reading.folded) {
    // the gate-first programmer-guard (ADR 0022): the DOOR routes through
    // readLevel3Tower and never lands here; anything that does gets the
    // verdict's name, not the orientation reader's stack trace.
    throw new Error(
      `level3Invariants: the S² gate reads folded edge class(es) ${reading.foldedEdgeClasses.join(', ')} — the identification is not free (an orbifold verdict, kind 'folded-edge'); the oriented tower cannot be built on a folded cell structure. Route through readLevel3Tower for the verdict.`,
    );
  }
  return reading.tower;
}
