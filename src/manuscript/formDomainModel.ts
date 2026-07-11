// formDomainModel — P-IMMERSE Build (c), the dim-3 route: the GENERIC
// form → `DomainModel` builder. A 3-manifold has no R³ body (the committed
// doctrine: "a form with no body shows its fundamental domain"), and the
// committed machinery is already class-agnostic — `readSeedCell`,
// `glueFaces`/`flipGlueFaces`, `level3InvariantTower`, `InkedDomain`,
// `readDomainSpecimen` all take ANY solid seed + pattern. The ONLY hardcoded
// piece was `buildThreeTorusDomain` (the cube + the fixed T³ translation
// pattern + the fixed key/title). This module is that builder with the
// hardcoding lifted: any committed solid seed Shape, any well-formed pairing
// pattern, dispatched to the committed op the modes select (the level-3
// contracts: all-preserving → `glueFaces`, ≥1 reversing → `flipGlueFaces`),
// certified by the committed tower, marked from the seed's REAL positions.
//
// Nothing is faked and nothing is bodied: the render route for the result is
// the committed `InkedDomain` (wireframe + pairing studs), the reading the
// committed `readDomainSpecimen` — both consume `DomainModel` unchanged.
//
// DERIVE-ONLY · ADDITIVE: committed modules by import; `worldModel`'s
// `buildThreeTorusDomain` stays byte-identical (the diagnostic asserts this
// builder REPRODUCES its T³ on the same inputs).

import type { Shape, Vec3 } from '../types/geometry';
import {
  flipGlueFaces,
  glueFaces,
  readSeedCell,
  type FacePairing,
} from '../lib/faceIdentification';
import { level3InvariantTower } from '../lib/level3Invariants';
import type { DomainModel, DomainPairMark } from './worldModel';

export function buildFormDomain(
  seedShape: Shape,
  pairings: FacePairing[],
  key: string,
  title: string,
): DomainModel {
  const seed = readSeedCell(seedShape); // ← the committed solid-seed read (throws honestly off non-solids)
  const anyReversing = pairings.some((p) => p.mode === 'reversing');
  // the committed level-3 contracts pick the op — never bypassed
  const complex = anyReversing ? flipGlueFaces(seed, pairings) : glueFaces(seed, pairings);
  const tower = level3InvariantTower(complex);

  const positionOf = new Map(Object.values(seedShape.vertices).map((v) => [v.id, v.position]));
  const centroid = (cycle: string[]): Vec3 => {
    const sum = cycle.reduce<Vec3>(
      (acc, id) => {
        const p = positionOf.get(id);
        if (!p) throw new Error(`formDomainModel: seed vertex ${id} has no position`);
        return [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]];
      },
      [0, 0, 0],
    );
    return [sum[0] / cycle.length, sum[1] / cycle.length, sum[2] / cycle.length];
  };
  const pairs: DomainPairMark[] = pairings.map((pairing) => {
    const a = seed.faces.find((f) => f.id === pairing.faceA);
    const b = seed.faces.find((f) => f.id === pairing.faceB);
    if (!a || !b) throw new Error('formDomainModel: pairing names a face not on the seed cell');
    return {
      mode: pairing.mode,
      faceIds: [pairing.faceA, pairing.faceB],
      centers: [centroid(a.cycle), centroid(b.cycle)],
    };
  });

  return { key, title, shape: seedShape, complex, tower, pairs };
}
