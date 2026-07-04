// level3W1 — Build 2 Tier-2: w₁ ∈ H¹(M³; Z/2) across face-gluings.
//
// MIRRORS the committed `globalW1` parity idea one dimension up — `globalW1.ts`
// itself stays byte-unchanged (the Build-1 mirror precedent): where the
// committed certifier 2-colours 2-cells across EDGES, this 2-colours 3-CELLS
// across FACE-gluings. The support is the orientation foundation's per-gluing
// bit: a gluing that REVERSES the induced boundary orientation lets one
// consistent cell-orientation propagate (parity 0); a NON-reversing gluing
// forces a flip (parity 1). C=1 forms (the 3-torus) are SELF-gluings — the
// committed selfFrustration case one dimension up: a parity-1 self-loop is an
// immediate frustration.
//
//   orientable ⟺ the gluing graph is parity-2-colourable ⟺ w₁ = 0.
//
// w₁ here is one Z/2 functional (rank 0/1 — the canonicalisation the ruling
// names); the per-gluing support is emitted for the Tier-3 cross-check
// (orientable ⟺ H₃ = Z on the closed sound forms).

import type { Level3Complex } from './faceIdentification';
import { buildOrientedChainComplex, type OrientedChainComplex } from './level3Orientation';

export interface Level3W1Reading {
  w1: 0 | 1;
  orientable: boolean;
  support: { index: number; faceA: string; faceB: string; reversesInducedOrientation: boolean }[]; // the NON-reversing gluings
  gluings: OrientedChainComplex['gluings'];
  frustrationWitness: string | null; // the gluing (or odd cycle closer) that frustrated 2-colouring
}

export function readLevel3W1(
  complex: Level3Complex,
  oriented: OrientedChainComplex = buildOrientedChainComplex(complex),
): Level3W1Reading {
  const cellOfFace = new Map<string, string>();
  for (const f of complex.originalFaces) cellOfFace.set(f.id, f.cellId);

  // parity union-find over cells: find returns [root, parityToRoot]
  const parent = new Map<string, { up: string; parity: 0 | 1 }>();
  const find = (x: string): [string, 0 | 1] => {
    const entry = parent.get(x);
    if (!entry) {
      parent.set(x, { up: x, parity: 0 });
      return [x, 0];
    }
    if (entry.up === x) return [x, entry.parity];
    const [root, parityUp] = find(entry.up);
    const total = ((entry.parity + parityUp) % 2) as 0 | 1;
    parent.set(x, { up: root, parity: total });
    return [root, total];
  };

  let frustrationWitness: string | null = null;
  for (const gluing of oriented.gluings) {
    const parity: 0 | 1 = gluing.reversesInducedOrientation ? 0 : 1; // non-reversing forces a flip
    const cellA = cellOfFace.get(gluing.faceA) as string;
    const cellB = cellOfFace.get(gluing.faceB) as string;
    const [rootA, parityA] = find(cellA);
    const [rootB, parityB] = find(cellB);
    if (rootA === rootB) {
      // a closing constraint (self-gluing or cycle): frustrated iff parities disagree
      if (((parityA + parityB) % 2) !== parity && frustrationWitness === null) {
        frustrationWitness = `gluing #${gluing.index} (${gluing.faceA} ~ ${gluing.faceB})`;
      }
    } else {
      const need = ((parity + parityA + parityB) % 2) as 0 | 1;
      parent.set(rootA, { up: rootB, parity: need });
    }
  }

  const orientable = frustrationWitness === null;
  return {
    w1: orientable ? 0 : 1,
    orientable,
    support: oriented.gluings
      .filter((g) => !g.reversesInducedOrientation)
      .map((g) => ({
        index: g.index,
        faceA: g.faceA,
        faceB: g.faceB,
        reversesInducedOrientation: g.reversesInducedOrientation,
      })),
    gluings: oriented.gluings,
    frustrationWitness,
  };
}
