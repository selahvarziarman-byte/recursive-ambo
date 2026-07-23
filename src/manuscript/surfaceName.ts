// surfaceName — RECOGNITION (2026-07-23, researcher-ruled): the NAME REGISTER.
//
// A compact surface with boundary is classified COMPLETELY by the triple
// (orientable?, g|k, b) — the arithmetic the classifier already computes. A
// NAME is a TOTAL LOOKUP on that triple: zero new math, zero new claim — the
// word for a point the card already prints, honest by construction because a
// pure function of the arithmetic can never disagree with it.
//
// ⛔ THE GUARD (LAW 0's shape, the researcher's own): the name is emitted ONLY
// as this lookup's output — never hand-typed per form (the DOCK_GLYPHS
// trapdoor's lesson). An unnamed triple prints the arithmetic and FLAGS the
// missing table row — never a guess.
// ⛔ NEVER "cone": "cone" = disk + a positive angle deficit at the apex — a
// METRIC mark the cells do not carry. The table says "disk"; the metric apex
// is a held later cut on the sealed-metric layer.

import type { SurfaceClass } from './surfaceClassifier';

export type SurfaceNameReading =
  | { named: true; name: string }
  | { named: false; arithmetic: string; missingRow: string };

// the ruled table, verbatim — keyed (orientable?, g|k, b)
const NAME_TABLE: Record<string, string> = {
  'or:0:0': 'sphere',
  'or:0:1': 'disk',
  'or:0:2': 'cylinder',
  'or:1:0': 'torus',
  'non:1:1': 'Möbius band',
  'non:1:0': 'RP²',
  'non:2:0': 'Klein bottle',
};

export function surfaceNameFor(cls: SurfaceClass): SurfaceNameReading {
  const orientable = cls.kind === 'orientable';
  const gk = orientable ? cls.g ?? 0 : cls.k ?? 0;
  const key = `${orientable ? 'or' : 'non'}:${gk}:${cls.b}`;
  const name = NAME_TABLE[key];
  if (name !== undefined) return { named: true, name };
  return {
    named: false,
    arithmetic: `${orientable ? `genus ${gk}` : `${gk} cross-cap${gk === 1 ? '' : 's'}`} · ${cls.b} boundary circle${cls.b === 1 ? '' : 's'}`,
    missingRow: `(orientable=${orientable ? 'yes' : 'no'}, ${orientable ? 'g' : 'k'}=${gk}, b=${cls.b})`,
  };
}
