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

// B-132 (the designer's clause 3 + the mothership's §4 precondition): a
// row's KIND is DECLARED BY ITS PRODUCER, never inferred from display copy —
// a classification that matches on display copy changes when someone improves
// the wording (the dead 'χ' prefix: the rendered label read 'Euler χ' and the
// row never demoted, so χ surfaced wearing its verdict word). Four kinds:
//   'trace'       — what he made (the person's own pairings; the argument
//                   reading's subject, not a predicate)
//   'measure'     — what it is (the invariants' numbers)
//   'check'       — the verdicts (outcome-neutral heading: a FAILING gate
//                   must read under the same word without irony)
//   'certificate' — how it classifies (the class register, unchanged)
// The field is REQUIRED — a kindless row cannot be written (the rule held by
// construction, not by a reader's discipline).
export type SpecimenRowKind = 'trace' | 'measure' | 'check' | 'certificate';

export interface SpecimenRow {
  label: string;
  value: string;
  kind: SpecimenRowKind;
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
  // §5(a) (B-2026-08-24-B, the designer's layout ruling): the NOTE REGISTER —
  // a clause that explains why a judgement does not exist leaves the value
  // column and lives here, SHARING the register with the twist note, each
  // note NAMING ITS OWN SUBJECT (two notes are never told apart by
  // position). The χ clauses ride here now; the χ VALUE keeps the bare
  // number. Optional so readings without notes (and the frozen
  // classBodyModel's objects, which predate the field) stand unchanged.
  notes?: string[];
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
  // B-132: `Euler χ — 0 (certified)` was ONE row carrying TWO kinds — the
  // number is a measure, the parenthesis a verdict, and a parenthesis is not
  // a boundary. Cut in two AT THE PRODUCER; the check row exists exactly when
  // the certifier spoke (a true absence otherwise, never a placeholder).
  const chiCheckRows: SpecimenRow[] =
    inv.chiCertified !== null ? [{ label: 'χ', value: 'certified', kind: 'check' }] : [];
  const rows: SpecimenRow[] = [
    { label: 'Euler χ', value: `${inv.chi}`, kind: 'measure' },
    ...chiCheckRows,
    { label: 'orientable', value: inv.cert ? (inv.cert.nonOrientable ? 'no' : 'yes') : 'n-a', kind: 'measure' },
    { label: 'class', value: inv.classification, kind: 'certificate' },
    { label: 'w₁ class', value: inv.cert ? `[${inv.cert.w1Class.join(', ')}]` : 'n-a', kind: 'certificate' },
    { label: 'H₁', value: model.h1Label ?? 'n-a', kind: 'measure', emphasize: true },
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
    { label: 'components', value: components === null ? 'n-a' : `${components}`, kind: 'measure' },
    { label: 'H₀', value: components === null ? 'n-a' : components === 1 ? 'ℤ' : `ℤ^${components}`, kind: 'measure' },
    { label: 'b₁ (level 1)', value: level1 ? `${level1.b1}` : 'n-a', kind: 'measure' },
    { label: 'H₁', value: model.h1Label ?? 'n-a', kind: 'measure', emphasize: true },
    { label: 'Euler χ', value: `${inv.chi}`, kind: 'measure' },
    { label: 'orientable', value: 'n-a (1-complex)', kind: 'measure' },
    { label: 'class', value: 'n-a (1-complex)', kind: 'certificate' },
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
  // §5(a) (B-2026-08-24-B) recut by B-132: the note-register law stands — a
  // clause that explains why no judgement exists lives in the notes, naming
  // its subject; the χ VALUE keeps the bare number. The PARENTHESIS grammar
  // ("a judgement was made") is RETIRED FROM THIS VALUE by the four-kind
  // split: the judgement is a CHECK — its own row, its own kind — because
  // `Euler χ — 0 (consistent)` was one row carrying two kinds, and a
  // parenthesis is not a boundary. The silences keep their opposite reasons:
  // bounded is a SOUND object the closed-check does not fit; unsound is not
  // an object the check can be asked of. One producer: `tower.isClosed`
  // drives this fork, the χ predicate, and the subtitle below.
  const chiVerdict =
    tower.sound && tower.isClosed
      ? tower.chiConsistent === true
        ? 'consistent'
        : tower.chiConsistent === false
          ? 'INCONSISTENT'
          : null
      : null;
  const chiNote = !tower.sound
    ? 'χ — a bare count; the S² gate found no manifold for it to describe'
    : !tower.isClosed
      ? 'χ — the closed-world check does not apply to a room'
      : null;
  // §5(b) (B-2026-08-24-B): the QUANTIFIER is asserted only after the thing
  // it quantifies is known — 0 pairs is a bare count; ONE pair reads its
  // own mode; N alike read `all <mode>`; N unlike read `mixed`. (The old
  // row hardcoded `all` before the fork and printed `mixed` over a single
  // reversing pair.)
  const pairModes = model.pairs.map((p) => p.mode);
  const facePairsRow =
    pairModes.length === 0
      ? '0'
      : pairModes.length === 1
        ? `1 (${pairModes[0]})`
        : pairModes.every((m) => m === pairModes[0])
          ? `${pairModes.length} (all ${pairModes[0]})`
          : `${pairModes.length} (mixed)`;
  const chiCheckRows: SpecimenRow[] =
    chiVerdict !== null ? [{ label: 'χ', value: chiVerdict, kind: 'check' }] : [];
  const rows: SpecimenRow[] = [
    { label: 'S² gate', value: tower.sound ? 'sound' : 'NOT sound', kind: 'check' },
    { label: 'Euler χ', value: `${tower.chi}`, kind: 'measure' },
    ...chiCheckRows,
    { label: 'orientable', value: tower.orientable ? 'yes' : 'no', kind: 'measure' },
    { label: 'H₁ (= π₁ abelianized)', value: tower.homology.H1.pretty, kind: 'measure', emphasize: true },
    { label: 'CW counts', value: `v ${counts.v} · e ${counts.e} · f ${counts.f} · c ${counts.c}`, kind: 'measure' },
    // kind 1 — the person's own pairings: the one row that is a SUBJECT in a
    // table of classifier outputs (her clause 1); the reader lands it beside
    // the argument reading, never under the measures
    { label: 'face-pairs', value: facePairsRow, kind: 'trace' },
  ];
  return {
    kind: 'domain',
    title: model.title,
    // the subtitle FORK, changing only the false half: `the identified
    // cube` (a hardcoded literal contradicting the title one line above)
    // goes; `this cell` is deictic and correct on any volume; `how its
    // faces meet` is the legend's own phrase — one vocabulary across card,
    // panel, legend, walk. `(no body exists)` is RIGHT for a closed
    // quotient and FALSE for a bounded room — the room IS an embeddable
    // body, the very thing he built and walked, and `you stand inside it`
    // matches the panel's forced-wall line.
    subtitle: tower.isClosed
      ? 'fundamental domain · this cell and how its faces meet (no body exists)'
      : 'fundamental domain · this cell and how its faces meet (the room is the body — you stand inside it)',
    rows,
    legend: [], // the domain draws pairing marks, not H₁ loop representatives
    twist: tower.orientable ? null : 'w₁ ≠ 0 — non-orientable (the twist)',
    notes: chiNote === null ? [] : [chiNote],
  };
}
