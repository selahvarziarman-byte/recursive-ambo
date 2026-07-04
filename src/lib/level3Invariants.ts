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
  chiConsistent: boolean | null; // sound ⇒ (χ === 0); unsound ⇒ null (n-a — no closed-manifold claim)
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

export function level3InvariantTower(complex: Level3Complex): Level3InvariantTower {
  const gate = classifyLevel3Soundness(complex);
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
  return {
    chi: complex.chi,
    sound: gate.sound,
    chiConsistent: gate.sound ? complex.chi === 0 : null,
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
