// specimenModel — Manuscript Phase 2b: the react-free ANALYTIC READING of a
// selected form (the specimen card's content; the acceptance diagnostic
// requires THIS module through the anti-mock hook; the view renders it
// verbatim, and ONLY while a form is selected — summoned, never ambient).
//
// THE ONE RULE (CONTEXT · ADR 0017): the fiction never impersonates the proof.
// Every value below is a COMMITTED certifier's, verbatim, per form kind:
//   surface  → readFormInvariants (χ measured+certified · orientability ·
//              genus/cross-caps classification · w₁Class · the H₁ label the
//              model already carries) + the gluing word off the correspondence;
//   skeleton → the same readout's level-1 rung (level1Betti: components/b₁)
//              — the surface rows read an honest n-a;
//   domain   → level3InvariantTower (S² soundness · χ consistency · w₁/
//              orientability · integer H₁ with torsion · CW counts).
// The LEGEND names the loops the form ALREADY draws (InkedForm's certified
// set — nothing is redrawn here); naming is geometric only where geometry
// backs it (torus a→longitude/b→meridian; RP²'s single class IS the ℤ/2 —
// b₁=1 certified). Klein's letters are NOT attributed free-vs-torsion — the
// carried certificate distinguishes ranks, not letters; claiming "a is the
// torsion" would exceed the certified data, so the legend stays generic.
// THE TWIST reads the certified w₁: the canonical w₁Class carries exactly one
// 1 on a non-orientable form (the functional's rank) — surfaced as
// "w₁ = 1 — non-orientable (the twist)"; null (no row) when orientable.
//
// NOTHING here computes an invariant; nothing here is reachable without a
// selection (the view calls these on select — asserted structurally in the
// diagnostic; the world model carries no precomputed reading).
//
// DERIVE-ONLY · ADDITIVE: committed modules + the Phase-1.5/2a models by
// import only; InkedForm / the renderers / worldModel stay byte-unchanged.

import type { InkedFormModel } from './inkedFormModel';
import type { DomainModel, SkeletonModel } from './worldModel';

export interface SpecimenRow {
  label: string;
  value: string;
  emphasize?: boolean; // the card renders these rows bolder (craft only)
}

export interface SpecimenLegendEntry {
  key: string; // the drawn loop's label ('a' | 'b' | 'a·b' | 'core')
  text: string; // its named reading
  ink: 'a' | 'b'; // which generator colour the swatch takes (mirrors InkedForm)
}

export interface SpecimenReading {
  kind: 'surface' | 'skeleton' | 'domain';
  title: string;
  subtitle: string;
  rows: SpecimenRow[];
  legend: SpecimenLegendEntry[];
  twist: string | null; // non-null iff the certifier reads non-orientable
}

const SURFACE_TITLES: Record<string, string> = {
  torus: 'Torus (T²)',
  klein: 'Klein bottle (K²)',
  rp2: 'RP² (cross-cap)',
  sphere: 'Sphere (S²)',
  cylinder: 'Cylinder',
  mobius: 'Möbius band',
};

// loop naming — geometric where the immersion backs it, generic elsewhere
const LOOP_READINGS: Record<string, Record<string, string>> = {
  torus: { a: 'a — longitude', b: 'b — meridian' },
  klein: { a: 'a — identified boundary generator', b: 'b — identified boundary generator' },
  rp2: { 'a·b': 'a·b — the ℤ/2 generator' },
  cylinder: { core: 'core — the ℤ generator (certified)' },
  mobius: { core: 'core — the ℤ generator (certified)' },
};

const inkOf = (loop: { letters: Array<'a' | 'b'> }): 'a' | 'b' =>
  loop.letters.length === 1 && loop.letters[0] === 'b' ? 'b' : 'a';

export function readSurfaceSpecimen(model: InkedFormModel): SpecimenReading {
  const inv = model.invariants;
  const word = model.immersion.correspondence.word;
  const rows: SpecimenRow[] = [
    { label: 'Euler χ', value: `${inv.chi}${inv.chiCertified !== null ? ' (certified)' : ''}` },
    { label: 'orientable', value: inv.cert ? (inv.cert.nonOrientable ? 'no' : 'yes') : 'n-a' },
    { label: 'class', value: inv.classification },
    { label: 'w₁ class', value: inv.cert ? `[${inv.cert.w1Class.join(', ')}]` : 'n-a' },
    { label: 'H₁', value: model.h1Label ?? 'n-a', emphasize: true },
  ];
  return {
    kind: 'surface',
    title: SURFACE_TITLES[model.surface] ?? model.surface,
    subtitle: word === '' ? 'collapse target · no gluing word' : `gluing word · ${word}`,
    rows,
    legend: model.loops.map((loop) => ({
      key: loop.label,
      text: LOOP_READINGS[model.surface]?.[loop.label] ?? loop.label,
      ink: inkOf(loop),
    })),
    twist:
      inv.cert && inv.cert.nonOrientable
        ? 'w₁ = 1 — non-orientable (the twist)'
        : null,
  };
}

export function readSkeletonSpecimen(model: SkeletonModel): SpecimenReading {
  const inv = model.invariants;
  const level1 = inv.level1;
  const components = level1 ? level1.components : null;
  const rows: SpecimenRow[] = [
    { label: 'components', value: components === null ? 'n-a' : `${components}` },
    { label: 'H₀', value: components === null ? 'n-a' : components === 1 ? 'ℤ' : `ℤ^${components}` },
    { label: 'b₁ (level 1)', value: level1 ? `${level1.b1}` : 'n-a' },
    { label: 'H₁', value: model.h1Label ?? 'n-a', emphasize: true },
    { label: 'Euler χ', value: `${inv.chi}` },
    { label: 'orientable', value: 'n-a (1-complex)' },
    { label: 'class', value: 'n-a (1-complex)' },
  ];
  return {
    kind: 'skeleton',
    title: model.title,
    subtitle: 'cut-born 1-complex · real positions',
    rows,
    legend: [], // a bare skeleton's ink IS its cycle set — nothing separate to light
    twist: null,
  };
}

export function readDomainSpecimen(model: DomainModel): SpecimenReading {
  const tower = model.tower;
  const counts = model.complex.counts;
  const rows: SpecimenRow[] = [
    { label: 'S² gate', value: tower.sound ? 'sound' : 'NOT sound' },
    {
      label: 'Euler χ',
      value: `${tower.chi}${tower.chiConsistent === null ? '' : tower.chiConsistent ? ' (consistent)' : ' (INCONSISTENT)'}`,
    },
    { label: 'orientable', value: tower.orientable ? 'yes' : 'no' },
    { label: 'H₁ (= π₁ abelianized)', value: tower.homology.H1.pretty, emphasize: true },
    { label: 'CW counts', value: `v ${counts.v} · e ${counts.e} · f ${counts.f} · c ${counts.c}` },
    { label: 'face-pairs', value: `${model.pairs.length} (all ${model.pairs.every((p) => p.mode === 'preserving') ? 'preserving' : 'mixed'})` },
  ];
  return {
    kind: 'domain',
    title: model.title,
    subtitle: 'fundamental domain · the identified cube (no body exists)',
    rows,
    legend: [], // the domain draws pairing marks, not H₁ loop representatives
    twist: tower.orientable ? null : 'w₁ ≠ 0 — non-orientable (the twist)',
  };
}
