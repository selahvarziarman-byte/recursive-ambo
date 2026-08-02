// argumentReadingModel — THE ARGUMENT-READING CARD, Phase 1: THE MAP (the
// spine). (Seal SEAL_THE_ARGUMENT_CARD, cut f1c5d67; researcher data-source
// spec 2142; designer look 0020; ADR 0024. Phase 2 — incidence · stance ·
// verdict · gloss — rides on this spine.)
//
// THE MEANING: the card a person gets ON SELECT is the ARGUMENT of the form's
// BIRTH op (`O : parent ⟶ this form`, ONE move — the lineage is browsed by
// selecting the parent), with the invariants DEMOTED to a one-line
// `certificate` receipt. This model is the TESTABLE half: it READS the
// substrate and returns typed rows; the view draws hands and rules.
//
// THE READS (all READ-ONLY on the frozen substrate — researcher spec §1):
//   · the op: `shape.genealogy.operation`;
//   · the immediate correspondence: `vertex.createdBy.sourceVertexIds` (ONE
//     generation; the merged-name convention `mat:…~…`/`idn:…~…` mints the
//     members into the id) — relations via the same convention on edge ids
//     plus `sourceEdgeId` for carried edges;
//   · the ULTIMATE roots: `primalMultiset(vertexId, shape, memo)`
//     (`lineage.ts:29`) — the atomic sources, one call, never a DAG-walk,
//     NEVER invented;
//   · typing: identified (≥2 sources) · survived (present in the parent —
//     includes the retained-verbatim corner whose `createdBy` still tells
//     the seed story; the spec's "id changed" letter is widened to
//     present-in-parent, flagged in the handback) · born (fresh/source-less,
//     or born OF a face/edge — the dual's `p ⟷ f`) · died (a parent site
//     absent from the child, read one generation up).
//
// THE LABELS ARE PRESENTATION, THE IDS ARE THE VALUE: root letters (A, B, …)
// and relation letters (a, b, …) are deterministic presentation labels over
// the REAL substrate ids (kept on every row for the witness); a label names,
// it never invents a source.

import type { Edge, Shape } from '../types/geometry';
import { primalMultiset } from '../lib/lineage';
import type { WrittenForm } from './writtenFormModel';

export type ArgumentTyping = 'identified' | 'survived' | 'born';

export interface ArgumentMapRow {
  kind: 'concept' | 'relation'; // • vertex-concept · — relation
  resultId: string; // the substrate id (the value — the witness reads this)
  label: string; // the presentation letter/name the card draws
  sourceIds: string[]; // the ONE-generation sources (ids, may be empty)
  rootIds: string[]; // the ultimate roots via primalMultiset (concepts only)
  rootLabels: string[]; // presentation letters for the roots (A, B, …)
  typing: ArgumentTyping;
  bornOf: 'face' | 'edge' | null; // the dual's trade: born OF a face/edge (p ⟷ f)
}

export interface ArgumentReading {
  op: string; // the birth op, verbatim from the genealogy
  header: { source: string; result: string; gloss: string }; // the map line (□ ⟶ 𝕋²)
  conceptRows: ArgumentMapRow[];
  relationRows: ArgumentMapRow[];
  // MEASURED SUBSTRATE FACT (probe, 2026-08-02 — flags the spec's relation
  // naming): quotient edges get FRESH ids carrying `sourceVertexIds` (the
  // surviving representative's parent endpoints); the identified PARTNER
  // edges simply leave the shape. They are ABSORBED into the identification
  // (recorded by the birth word), never "dead" — listed here by their
  // endpoint root letters. `diedConcepts` counts true vertex deaths only.
  absorbedRelations: string[]; // e.g. ['CD', 'DA'] — the partner edges, endpoint-lettered
  diedConcepts: number;
  words: string; // the map's words-line (counts: "4 concepts become 1 · …")
  certificateLabels: string[]; // which of the existing card rows demote into the receipt
}

// the sign hand's polygon signs (presentation; a size without a sign stays a word)
const POLYGON_SIGNS: Record<number, string> = { 3: '△', 4: '□', 5: '⬠', 6: '⬡' };

// the result signs where the drawn class carries one (presentation)
const SURFACE_SIGNS: Record<string, string> = {
  torus: '𝕋²',
  klein: 'K²',
  rp2: 'ℝP²',
  sphere: 'S²',
  cylinder: 'cylinder',
  mobius: 'Möbius',
};

// dev-register op words (the designer refines wording; the op token is the value)
const OP_WORDS: Record<string, string> = {
  glue: 'identify the paired edges',
  'flip-glue': 'identify the paired edges, reversed',
  collapse: 'collapse the boundary',
  cut: 'cut along the curve',
  dualization: 'concepts and faces trade places',
  subdivide: 'draw the chord',
  refine: 'refine the cells',
  seed: 'the seed, invoked',
  identify: 'identify the chosen cells',
};

const ROOT_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const RELATION_LETTERS = 'abcdefghjklmnpqrstuvwxyz';

const letterFor = (index: number, alphabet: string): string =>
  index < alphabet.length
    ? alphabet[index]
    : `${alphabet[index % alphabet.length]}${Math.floor(index / alphabet.length) + 1}`;

// the merged-name convention: `mat:a~b~c` / `idn:a~b` carry their members in
// the id (materializeOperation:293 / complexIdentification:620)
export function mergedMembersOf(id: string): string[] | null {
  const match = /^(?:mat|idn):(.+)$/.exec(id);
  if (!match) return null;
  const members = match[1].split('~');
  return members.length >= 2 ? members : null;
}

function sourceNameFor(form: WrittenForm): string {
  const parent = form.parentShape;
  if (!parent) return 'invoked';
  if (parent.faces.length === 1) {
    return POLYGON_SIGNS[parent.faces[0].vertexIds.length] ?? `${parent.faces[0].vertexIds.length}-gon`;
  }
  return parent.name || parent.seedKey || 'parent';
}

function resultNameFor(form: WrittenForm): string {
  const render = form.render;
  if (render.mode === 'immersion') return SURFACE_SIGNS[render.model.surface] ?? render.model.surface;
  // the drawn class name where a card already computes one is Phase-2 polish;
  // the form's own title word is the honest Phase-1 fallback
  return form.title.split('—')[0].trim() || form.shape.name || 'this form';
}

export function buildArgumentReading(form: WrittenForm): ArgumentReading {
  const shape = form.shape;
  const parent = form.parentShape ?? null;
  const op = shape.genealogy.operation;
  const memo = new Map<string, Map<string, number>>();

  // the root letters: every distinct primal root across the form, in sorted
  // order, gets a stable presentation letter
  const allRoots = new Set<string>();
  for (const vertexId of Object.keys(shape.vertices)) {
    for (const root of primalMultiset(vertexId, shape, memo).keys()) allRoots.add(root);
  }
  const rootLabelOf = new Map([...allRoots].sort().map((id, i) => [id, letterFor(i, ROOT_LETTERS)]));

  const parentVertexIds = parent ? new Set(Object.keys(parent.vertices)) : null;
  const conceptRows: ArgumentMapRow[] = Object.keys(shape.vertices)
    .sort()
    .map((vertexId) => {
      const vertex = shape.vertices[vertexId];
      const creation = vertex.createdBy;
      const merged = mergedMembersOf(vertexId);
      const sourceIds = creation.sourceVertexIds.length > 0 ? [...creation.sourceVertexIds] : (merged ?? []);
      const roots = primalMultiset(vertexId, shape, memo);
      const rootIds = [...roots.keys()].sort();
      // the TRADE reads first (measured: a dual-born vertex carries BOTH its
      // sourceFaceId AND the face's corners as sourceVertexIds — the face is
      // what it is born OF; the corners are that face's witnesses)
      const bornOf: ArgumentMapRow['bornOf'] =
        creation.sourceFaceId ? 'face' : creation.sourceEdgeId && sourceIds.length === 0 ? 'edge' : null;
      const typing: ArgumentTyping =
        bornOf !== null
          ? 'born'
          : sourceIds.length >= 2
            ? 'identified'
            : parentVertexIds && parentVertexIds.has(vertexId)
              ? 'survived' // includes the retained-verbatim corner (createdBy still tells the seed story)
              : sourceIds.length === 1 && sourceIds[0] !== vertexId
                ? 'survived'
                : 'born';
      return {
        kind: 'concept' as const,
        resultId: vertexId,
        label: rootIds.length === 1 ? (rootLabelOf.get(rootIds[0]) ?? vertexId) : vertexId.split(':').pop() ?? vertexId,
        sourceIds,
        rootIds,
        rootLabels: rootIds.map((id) => rootLabelOf.get(id) ?? id),
        typing,
        bornOf,
      };
    });

  // the relation source is the recorded `sourceVertexIds` (the surviving
  // representative's parent endpoints — measured substrate fact); the source
  // is NAMED by those endpoints' root letters (AB — a reading, not a mint)
  const endpointLetters = (endpointIds: readonly string[]): string =>
    endpointIds.map((id) => rootLabelOf.get(id) ?? primalRootLetter(id)).join('');
  const primalRootLetter = (id: string): string => {
    // a parent endpoint may itself be a merged class — resolve to its roots
    const roots = shape.vertices[id]
      ? [...primalMultiset(id, shape, memo).keys()].sort()
      : (mergedMembersOf(id) ?? [id]);
    return roots.map((r) => rootLabelOf.get(r) ?? r.split(':').pop() ?? r).join('');
  };
  const parentEdgeIds = parent ? new Set(parent.edges.map((e) => e.id)) : null;
  const relationLabelOf = new Map(
    [...shape.edges].map((e) => e.id).sort().map((id, i) => [id, letterFor(i, RELATION_LETTERS)]),
  );
  const relationRows: ArgumentMapRow[] = [...shape.edges]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((edge: Edge) => {
      const sourceEndpoints = edge.sourceVertexIds ?? edge.vertexIds;
      const sourceIds = edge.sourceEdgeId ? [edge.sourceEdgeId] : [...sourceEndpoints];
      const typing: ArgumentTyping =
        parentEdgeIds && parentEdgeIds.has(edge.id) ? 'survived' : parent ? 'survived' : 'born';
      return {
        kind: 'relation' as const,
        resultId: edge.id,
        label: relationLabelOf.get(edge.id) ?? edge.id,
        sourceIds,
        rootIds: [],
        rootLabels: [endpointLetters(sourceEndpoints)], // the source edge, endpoint-lettered
        typing,
        bornOf: null,
      };
    });

  // the ABSORBED partners: parent edges absent from the child — identified
  // into a surviving class by the birth word (never "dead"); listed by their
  // own endpoint letters. True vertex deaths counted separately.
  const childEdgeIds = new Set(shape.edges.map((e) => e.id));
  const absorbedRelations = parent
    ? parent.edges.filter((e) => !childEdgeIds.has(e.id)).map((e) => endpointLetters(e.vertexIds))
    : [];
  const absorbedVertexIds = new Set(conceptRows.flatMap((r) => r.sourceIds));
  const diedConcepts = parent
    ? Object.keys(parent.vertices).filter((id) => !shape.vertices[id] && !absorbedVertexIds.has(id)).length
    : 0;

  // the words-line — counts, mechanical (the designer's wording rides later)
  const words = parent
    ? `${Object.keys(parent.vertices).length} concepts become ${conceptRows.length} · ${parent.edges.length} relations become ${relationRows.length}${
        absorbedRelations.length > 0 ? ` · ${absorbedRelations.length} absorbed` : ''
      }${diedConcepts > 0 ? ` · ${diedConcepts} die` : ''}`
    : `${conceptRows.length} concepts, ${relationRows.length} relations — the seed's own`;

  return {
    op,
    header: {
      source: sourceNameFor(form),
      result: resultNameFor(form),
      gloss: OP_WORDS[op] ?? `the ${op} move`,
    },
    conceptRows,
    relationRows,
    absorbedRelations,
    diedConcepts,
    words,
    // the receipt: which existing card rows demote under the hairline (the
    // view filters its OWN rows by these labels — nothing re-derived here)
    certificateLabels: ['χ', 'χ (certified)', 'class', 'name', 'H₁', 'w₁', 'genus', 'b₁'],
  };
}
