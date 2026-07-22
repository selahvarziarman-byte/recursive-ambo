// worldModel — Manuscript Phase 2a: the react-free model of the ambient WORLD
// (the dimension-band population; the acceptance diagnostic requires THIS module
// through the anti-mock hook; ManuscriptView consumes it verbatim).
//
// THE ONE LAW, held across the fuller catalogue: every populated form is an
// inked drawing of an engine value; every drawn generator is the certified set.
// This module BUILDS NOTHING NEW — it assembles committed derivations:
//
//   dim 1 — 1-complexes with REAL positions, born from the committed CUT path
//     (BornFormView's 'direct'-route precedent: the cut's vertices/edges pass
//     through verbatim): invoke an n-gon (committed primitiveCatalogue/loadForm)
//     → cutCell + materializeCutResult removes the 2-cell → a face-less loop
//     (b₁=1) resp. arc (b₁=0). Their caption H₁ is the committed `level1Betti`
//     readout (via readFormInvariants' Q5 level-1 rung): a face-less graph has
//     FREE H₁ = ℤ^{b₁} — classification arithmetic on the certified rank. No
//     generator overlay is drawn on a bare skeleton: its ink IS the real edge
//     set; the H₁ claim lives in the label. (The committed closeEdgeIntoCircle
//     S¹ is a LEDGER fact without positions — not drawable, not drawn.)
//
//   dim 2 — the six committed immersions (torus · klein · rp2 · sphere ·
//     cylinder · mobius) through the UNCHANGED Phase-1/1.5 inkedFormModel:
//     Option-A word loops for the single-polygon closed zoo (Klein now takes
//     its place: a + b, one free + one ℤ/2-torsion class, b₁=2), certified
//     cores for the open pair. Genus-2 / N_k (k≥2) have NO committed immersion
//     (the octagon quotient renders only through the honest patch route) —
//     they are NOT populated and NOT faked; flagged in the report.
//
//   dim 3 — the 3-torus as its FUNDAMENTAL DOMAIN, never a solid body
//     (CONTEXT: "a form with no body shows its fundamental domain"): the
//     committed cube seed (real positions) + the committed level-3 fixture
//     pattern (the forms.stories precedent — three PRESERVING face pairings by
//     translation) → `glueFaces` → the committed `level3InvariantTower`
//     (S² soundness gate · χ · w₁/orientability · integer-SNF homology with
//     torsion). The domain model carries the cube's real edges + the pairing
//     marks (face centers derived from real positions); H₁ in the label is the
//     tower's own `homology.H1.pretty`.
//
// B-FLAG GUARD (researcher loop-set §1): the population contains ONLY
// single-polygon immersions + open cores + level-3 domains — no non-single-
// polygon surface (born/assembled/ambo'd) is populated, so no form needs the
// Option-B basis it would not get. Asserted in the diagnostic.
//
// DERIVE-ONLY · ADDITIVE: committed modules by import; inkedFormModel is reused
// UNCHANGED (byte-diff guarded this phase).

import type { Face, Shape, Vec3 } from '../types/geometry';
import { loadForm } from '../lib/multiform';
import { nGon } from '../playground/primitiveCatalogue';
import { cutCell } from '../lib/cutOperation';
import { materializeCutResult } from '../lib/materializeOperation';
import { createSeedShape } from '../data/seeds';
import {
  glueFaces,
  readSeedCell,
  type FacePairing,
  type Level3Complex,
} from '../lib/faceIdentification';
import { level3InvariantTower, type Level3InvariantTower } from '../lib/level3Invariants';
import { readFormInvariants, type FormInvariantsReadout } from '../playground/formInvariants';
import type { InkedFormModel } from './inkedFormModel';
import type { ImmersedSurfaceKey } from '../lib/surfaceImmersion';

// ---------------------------------------------------------------------------
// dim 1 — cut-born skeletons (face-less 1-complexes, real positions)
// ---------------------------------------------------------------------------

export interface SkeletonModel {
  key: string;
  title: string;
  shape: Shape; // the cut-born form — vertices/edges verbatim, zero faces
  invariants: FormInvariantsReadout; // committed readout (level1 present iff face-less)
  h1Label: string | null; // ℤ^{b₁}, free — a graph's H₁ has no torsion (arithmetic on level1Betti)
}

export function h1LabelFromLevel1(readout: FormInvariantsReadout): string | null {
  if (!readout.level1) return null;
  const rank = readout.level1.b1;
  if (rank === 0) return '0';
  return Array.from({ length: rank }, () => 'ℤ').join(' ⊕ ');
}

function cutBornSkeleton(key: string, title: string, sides: number): SkeletonModel {
  const polygon = loadForm(nGon(sides));
  const face = polygon.faces[0] as Face;
  const born = materializeCutResult(polygon, cutCell(polygon, face));
  if (born.faces.length !== 0) {
    throw new Error(`worldModel: cut ${sides}-gon still carries ${born.faces.length} face(s) — not a skeleton`);
  }
  const invariants = readFormInvariants(born);
  if (!invariants.level1) {
    throw new Error(`worldModel: cut ${sides}-gon readout carries no level-1 rung — refusing the H₁ label`);
  }
  return { key, title, shape: born, invariants, h1Label: h1LabelFromLevel1(invariants) };
}

export function buildSkeletonModels(): SkeletonModel[] {
  return [
    // the loop: a cut 12-gon — one component, b₁ = 1 (the reference band's circle)
    cutBornSkeleton('loop', 'Loop (cut 12-gon)', 12),
    // the arc: a cut segment — b₁ = 0, the dim-1 null case (no generator claim)
    cutBornSkeleton('arc', 'Arc (cut segment)', 2),
  ];
}

// ---------------------------------------------------------------------------
// dim 3 — the 3-torus fundamental domain (the committed story-fixture pattern)
// ---------------------------------------------------------------------------

export interface DomainPairMark {
  mode: FacePairing['mode'];
  faceIds: [string, string];
  centers: [Vec3, Vec3]; // face centroids, derived from the cube's real positions
}

export interface DomainModel {
  key: string;
  title: string;
  shape: Shape; // the cube SEED — its real vertices/edges are the drawn domain
  complex: Level3Complex; // the committed identification (counts read off union-finds)
  tower: Level3InvariantTower; // S² gate · χ · w₁ · integer homology (H₁ label source)
  pairs: DomainPairMark[];
}

export function buildThreeTorusDomain(): DomainModel {
  const cubeShape = createSeedShape('cube');
  const cube = readSeedCell(cubeShape);
  const positionOf = new Map(Object.values(cubeShape.vertices).map((v) => [v.id, v.position]));
  const at = (id: string): Vec3 => {
    const p = positionOf.get(id);
    if (!p) throw new Error(`worldModel: cube vertex ${id} has no position`);
    return p;
  };

  // the committed fixture's translation pairing: each faceA vertex maps to the
  // faceB vertex differing ONLY along `axis` (read off the real seed positions)
  const translationMap = (
    faceA: { cycle: string[] },
    faceB: { cycle: string[] },
    axis: number,
  ): Record<string, string> => {
    const map: Record<string, string> = {};
    for (const a of faceA.cycle) {
      const pa = at(a);
      const image = faceB.cycle.find((b) => {
        const pb = at(b);
        return [0, 1, 2].every((ax) => ax === axis || Math.abs(pa[ax] - pb[ax]) < 1e-9);
      });
      if (!image) {
        throw new Error(`worldModel: no translation image for cube vertex ${a} along axis ${axis}`);
      }
      map[a] = image;
    }
    return map;
  };

  const face = (key: string): { id: string; cycle: string[] } => {
    const found = cube.faces.find((f) => f.id === `face:cube:${key}`);
    if (!found) throw new Error(`worldModel: cube seed lacks face:cube:${key}`);
    return found;
  };

  const pattern: FacePairing[] = [
    { faceA: face('left').id, faceB: face('right').id, mode: 'preserving', map: translationMap(face('left'), face('right'), 0) },
    { faceA: face('front').id, faceB: face('back').id, mode: 'preserving', map: translationMap(face('front'), face('back'), 1) },
    { faceA: face('bottom').id, faceB: face('top').id, mode: 'preserving', map: translationMap(face('bottom'), face('top'), 2) },
  ];

  const complex = glueFaces(cube, pattern);
  const tower = level3InvariantTower(complex);

  const centroid = (cycle: string[]): Vec3 => {
    const sum = cycle.reduce<Vec3>((acc, id) => {
      const p = at(id);
      return [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]];
    }, [0, 0, 0]);
    return [sum[0] / cycle.length, sum[1] / cycle.length, sum[2] / cycle.length];
  };
  const pairs: DomainPairMark[] = pattern.map((p) => {
    const a = cube.faces.find((f) => f.id === p.faceA) as { id: string; cycle: string[] };
    const b = cube.faces.find((f) => f.id === p.faceB) as { id: string; cycle: string[] };
    return { mode: p.mode, faceIds: [p.faceA, p.faceB], centers: [centroid(a.cycle), centroid(b.cycle)] };
  });

  return {
    key: 't3',
    title: 'T³ — identified cube',
    shape: cubeShape,
    complex,
    tower,
    pairs,
  };
}

// ---------------------------------------------------------------------------
// the world
// ---------------------------------------------------------------------------

// dim-2 population: exactly the committed immersion keys (single-polygon closed
// + the open pair) — the A+core certified coverage. Genus-2/N_k: no immersion,
// not populated (flagged, not faked).
export const WORLD_SURFACES: readonly ImmersedSurfaceKey[] = [
  'torus',
  'klein',
  'rp2',
  'sphere',
  'cylinder',
  'mobius',
] as const;

export interface ManuscriptWorld {
  dim1: SkeletonModel[];
  dim2: InkedFormModel[];
  dim3: DomainModel[];
}

export function buildManuscriptWorld(resolution: number): ManuscriptWorld {
  return {
    dim1: buildSkeletonModels(),
    // CUT 0 THE GALLERY FIX (sanctioned frozen edit): the dim-2 band starts
    // EMPTY — the six references are SUMMONED on demand through the person's
    // OWN path (the view: invoke + the committed preset word →
    // routeWrittenRender), never seeded here. WORLD_SURFACES stays as the list
    // the summon reuses; a reference can never render nicer than the person's.
    dim2: [],
    dim3: [buildThreeTorusDomain()],
  };
}
