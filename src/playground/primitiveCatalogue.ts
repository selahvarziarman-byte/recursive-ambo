// primitiveCatalogue — G1: the playground's invocation catalogue (primitives).
//
// INVOCATION = building a form from scratch with DISTINCT, SOURCE-LESS primal
// vertices (sovereign scope ruling 2026-07-02, refining ADR 0010): bare lines and
// polygons only. A form that begins with identified/collapsed vertices (torus,
// Klein, RP², the glued zoo) is BUILT, not invoked — it arrives later via the
// op-set (invoke a polygon → glue/flip-glue) and is deliberately NOT here.
//
// Pure data + builders: each entry's `build` returns a plain `FormSpec` (vertex
// ids `v0..v{n-1}`, one face cycle) exactly like G0's `buildPlaygroundSquareForm`;
// the committed `loadForm` (multiform.ts) does ALL the construction — id
// namespacing, edge derivation, genealogy. No engine math is computed here.
//
// Spec names are `<n>-gon` (the zoo charter's invocation language) so catalogue
// invokes never collide with G0's seeded 'square' forms.

import type { FormBuilder, FormSpec } from '../lib/multiform';
import type { Vec3 } from '../types/geometry';

export interface PrimitiveCatalogueEntry {
  key: string;
  label: string;
  build: FormBuilder;
}

const POLYGON_RADIUS = 0.8;

// The regular n-gon spec: n distinct source-less vertices `v0..v{n-1}` on a
// circle (first vertex at the top), one face cycle through all of them. For
// n = 2 this is the segment/2-gon (one bigon face over two vertices).
//
// THE LEGIBILITY MIGRATION — the LAST producer-stop (B-2026-08-23-C §3,
// researcher-ruled): `v${index}` in the LABEL slot was a POSITIONAL INDEX —
// the D-index class, not a name (the discriminator: does the label carry
// information about the entity beyond its own position?). BORN, not yet
// given ⇒ no source to carry, nothing to compose from, and the person has
// not named it ⇒ TRUE ABSENCE; the display reads `unnamed`, the COMPLETE
// answer for a born corner. The vertex IDS stay `v0..v{n-1}` — an id is
// the value, never the name.
function nGonSpec(n: number, name: string): FormSpec {
  const vertices = Array.from({ length: n }, (_, index) => {
    const angle = Math.PI / 2 + (2 * Math.PI * index) / n;
    const position: Vec3 = [
      Number((POLYGON_RADIUS * Math.cos(angle)).toFixed(6)),
      Number((POLYGON_RADIUS * Math.sin(angle)).toFixed(6)),
      0,
    ];
    return { id: `v${index}`, position, label: '' };
  });

  return {
    name,
    vertices,
    faces: [{ vertexIds: vertices.map((vertex) => vertex.id) }],
  };
}

// Parametric n-gon builder. An n-gon needs an integer n >= 2 — anything else is
// rejected loudly (never silently clamped).
export function nGon(n: number): FormBuilder {
  if (!Number.isInteger(n) || n < 2) {
    throw new Error(`primitiveCatalogue: nGon(${n}) — an n-gon needs an integer n >= 2`);
  }
  return () => nGonSpec(n, `${n}-gon`);
}

// P-mint (DOORS batch, sanctioned frozen edit): the REAL segment — two
// distinct source-less vertices, ONE explicit edge, NO face (V2 E1 F0). The
// old entry minted nGon(2), a FACED bigon (V2 E1 F1) — measured lying at
// GAP2B (Q1 refuses it by the face clause). The catalogue now invokes the
// true 1-cell: Q1 accepts it, thicken products it, the fold (P1) closes it
// into the loop — never a polygon word.
function segmentSpec(): FormSpec {
  return {
    name: 'segment',
    // the same producer-stop (B-2026-08-23-C §3): born endpoints mint TRUE
    // ABSENCE — the ids stay `v0`/`v1`, the labels are no one's name
    vertices: [
      { id: 'v0', position: [-POLYGON_RADIUS, 0, 0], label: '' },
      { id: 'v1', position: [POLYGON_RADIUS, 0, 0], label: '' },
    ],
    edges: [{ vertexIds: ['v0', 'v1'] }],
  };
}

export const PRIMITIVE_CATALOGUE: PrimitiveCatalogueEntry[] = [
  { key: 'segment', label: 'Segment', build: () => segmentSpec() },
  { key: 'triangle', label: 'Triangle', build: nGon(3) },
  { key: 'square', label: 'Square', build: nGon(4) },
  { key: 'pentagon', label: 'Pentagon', build: nGon(5) },
  { key: 'hexagon', label: 'Hexagon', build: nGon(6) },
];
