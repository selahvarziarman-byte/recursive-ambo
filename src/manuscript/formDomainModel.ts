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
  readSeedCells,
  type FacePairing,
} from '../lib/faceIdentification';
import { level3InvariantTower } from '../lib/level3Invariants';
import type { DomainModel, DomainPairMark, DomainPendingPairMark } from './worldModel';

// THE MULTI-CELL CUT (2026-08-13): the SHARED interior walls of a multi-cell
// solid (thicken's product cells share their radial faces) become explicit
// pairings between the two cells' PREFIXED copies — the paired-face
// representation `enact` consumes (researcher 1930 (ii)). The map is the
// identity corner correspondence (the copies carry the SAME underlying
// vertices), mode preserving.
export function sharedWallPairings(seedShape: Shape): FacePairing[] {
  const owners = new Map<string, number[]>();
  seedShape.cells.forEach((cell, index) => {
    for (const faceId of cell.faceIds) {
      const list = owners.get(faceId) ?? [];
      list.push(index);
      owners.set(faceId, list);
    }
  });
  const faceById = new Map(seedShape.faces.map((f) => [f.id, f]));
  const pairings: FacePairing[] = [];
  for (const [faceId, cellIndexes] of owners) {
    if (cellIndexes.length !== 2) continue; // boundary (1 owner) or malformed (>2 — the gate will speak)
    const face = faceById.get(faceId);
    if (!face) continue;
    const [i, j] = cellIndexes;
    const map: Record<string, string> = {};
    for (const v of face.vertexIds) map[`c${i}:${v}`] = `c${j}:${v}`;
    pairings.push({ faceA: `c${i}:${faceId}`, faceB: `c${j}:${faceId}`, mode: 'preserving', map });
  }
  return pairings;
}

export function buildFormDomain(
  seedShape: Shape,
  pairings: FacePairing[],
  key: string,
  title: string,
): DomainModel {
  if (seedShape.cells.length > 1) {
    // the multi-cell route: each cell a prefixed seed; the shared walls
    // auto-pair; the caller's pairings (if any) ride alongside. All
    // shared-wall maps are identity → preserving → glueFaces.
    const seeds = readSeedCells(seedShape);
    const allPairings = [...sharedWallPairings(seedShape), ...pairings];
    const anyRev = allPairings.some((p) => p.mode === 'reversing');
    if (anyRev) throw new Error('formDomainModel: reversing pairings on a multi-cell seed are a later chapter');
    const complex = glueFaces(seeds, allPairings);
    const tower = level3InvariantTower(complex);
    const positionOfM = new Map(Object.values(seedShape.vertices).map((v) => [v.id, v.position]));
    const strip = (id: string): string => id.replace(/^c\d+:/, '');
    const centroidM = (cycle: string[]): Vec3 => {
      const sum = cycle.reduce<Vec3>(
        (acc, id) => {
          const p = positionOfM.get(strip(id));
          if (!p) throw new Error(`formDomainModel: seed vertex ${id} has no position`);
          return [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]];
        },
        [0, 0, 0],
      );
      return [sum[0] / cycle.length, sum[1] / cycle.length, sum[2] / cycle.length];
    };
    const faceCycleOf = new Map(seeds.flatMap((s) => s.faces).map((f) => [f.id, f.cycle]));
    const pairs: DomainPairMark[] = allPairings.map((pairing) => ({
      mode: pairing.mode,
      faceIds: [pairing.faceA, pairing.faceB],
      centers: [
        centroidM(faceCycleOf.get(pairing.faceA) ?? []),
        centroidM(faceCycleOf.get(pairing.faceB) ?? []),
      ],
    }));
    return { key, title, shape: seedShape, complex, tower, pairs };
  }
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

// F.0b — THE PENDING MARK (engineer 0200 §1–2): a row with both faces chosen
// and no map yet is a POSITIVE fact about the person's progress — the pair
// exists; how it meets is not yet decided. These marks carry NO mode (none
// exists to carry; inventing one was refused by name) — they are a separate
// type the decided-mark readers cannot confuse. Centers come from the SAME
// centroid arithmetic as the decided marks (the seed's real positions);
// multi-cell face ids arrive PREFIXED (`c{i}:` — the menu's id space, the D2
// seam) and strip for the position lookup, exactly as `buildFormDomain` does.
export function pendingPairMarks(seedShape: Shape, facePairs: [string, string][]): DomainPendingPairMark[] {
  if (facePairs.length === 0) return [];
  const faces =
    seedShape.cells.length > 1
      ? readSeedCells(seedShape).flatMap((s) => s.faces)
      : readSeedCell(seedShape).faces;
  const faceCycleOf = new Map(faces.map((f) => [f.id, f.cycle]));
  const positionOf = new Map(Object.values(seedShape.vertices).map((v) => [v.id, v.position]));
  const strip = (id: string): string => id.replace(/^c\d+:/, '');
  const centroid = (cycle: string[]): Vec3 => {
    const sum = cycle.reduce<Vec3>(
      (acc, id) => {
        const p = positionOf.get(strip(id));
        if (!p) throw new Error(`formDomainModel: seed vertex ${id} has no position`);
        return [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]];
      },
      [0, 0, 0],
    );
    return [sum[0] / cycle.length, sum[1] / cycle.length, sum[2] / cycle.length];
  };
  return facePairs.map(([faceA, faceB]) => {
    const a = faceCycleOf.get(faceA);
    const b = faceCycleOf.get(faceB);
    if (!a || !b) throw new Error('formDomainModel: a pending pair names a face not on the seed');
    return { faceIds: [faceA, faceB], centers: [centroid(a), centroid(b)] };
  });
}
