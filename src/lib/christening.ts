// christening — C-13b (F4): THE MIDPOINT'S SLOT, ITS STRING, AND THE PERSON'S MARK. Arman's Δ58 ("keep exactly as now")
// and Δ104 ("fix F4"), reconciled by the mothership's C-13 · M1 (2026-09-25):
//
//   1. THE SLOT IS NEVER EMPTIED. A midpoint born of the Ambo carries in its name slot the raw composed string of its two
//      corners' labels, in the Ambo's own concatenation form (`AB`, `ABAC` — no separator), exactly as the mint makes it.
//   2. THE STRING FOLLOWS ITS CORNERS. When a corner (or a parent midpoint) is christened, every un-christened descendant's
//      string is re-composed by the same rule that minted it — `apexB`, then `apexBapexC` one generation down. A christened
//      midpoint is never touched.
//   3. "CHRISTENED" IS A POSITIVE FACT WITH A POSITIVE MARK, set by the person's own act — the packet editor's Save with a
//      changed Label — and read from the packet, never inferred by comparing strings with the corners' current labels (the
//      judge that did so read a stale string as a name once a corner was renamed: F4). The mark lives in the packet's
//      `custom` record under the reserved key `christened`, beside the keys the app already reads there (title · name ·
//      summary · description · body) — visible to the person in his packet's JSON, removable by his hand.
//   4. Frozen readers (dualization, incidenceTraceRegistry, complexIdentification, materializeOperation) read the slot
//      directly and need no edit: the slot always holds the right letters.
//
// ⛔ RECORD, NOT READING is honoured at the act: the string is re-derived when a corner's label changes, by the one rule.

import type { Shape, Vertex, VertexDataPacket } from '../types/geometry';

export const CHRISTENED_KEY = 'christened';

/** the Ambo's own rule for a midpoint's letters: its two corners' labels concatenated in the edge's order, no separator (Δ58) */
export const midpointLetters = (a: string, b: string): string => `${a}${b}`;

/** a midpoint the Ambo made — its slot holds the composed string unless the person christened it */
export const isGeneratedMidpoint = (vertex: Vertex): boolean =>
  Boolean(vertex.createdBy.sourceEdgeId) || vertex.data.lineage?.inheritanceMode === 'derived-from-edge';

/** the positive mark: the person christened this vertex by his own act */
export const isChristened = (data: Pick<VertexDataPacket, 'custom'>): boolean => data.custom?.[CHRISTENED_KEY] === true;

/** the packet's custom record with the mark set, or with it removed (a cleared christening leaves no false behind) */
export function withChristened(custom: VertexDataPacket['custom'], christened: boolean): VertexDataPacket['custom'] {
  if (christened) return { ...custom, [CHRISTENED_KEY]: true };
  const rest: VertexDataPacket['custom'] = {};
  for (const [k, v] of Object.entries(custom)) if (k !== CHRISTENED_KEY) rest[k] = v;
  return rest;
}

/**
 * THE JUDGE (the one both components read): the label the person gave — a christened midpoint's, or any other vertex's
 * non-empty label; null for an un-christened midpoint, whose slot holds the composed string and not a name.
 */
export function givenLabelOf(vertex: Vertex): string | null {
  const label = vertex.data.label.trim();
  if (!label) return null;
  if (isGeneratedMidpoint(vertex) && !isChristened(vertex.data)) return null;
  return label;
}

/** the string the mint would write for this midpoint from its corners' labels as they stand now; null when the shape does not hold both corners */
export function composedLettersOf(shape: Shape, vertex: Vertex): string | null {
  if (!isGeneratedMidpoint(vertex) || vertex.createdBy.sourceVertexIds.length < 2) return null;
  const [a, b] = vertex.createdBy.sourceVertexIds;
  const va = shape.vertices[a];
  const vb = shape.vertices[b];
  if (!va || !vb) return null;
  return midpointLetters(va.data.label, vb.data.label);
}

/**
 * THE STRING FOLLOWS ITS CORNERS: every un-christened midpoint's slot re-composed by the mint's rule, to a fixpoint (a
 * midpoint of midpoints follows its parents' new strings); a christened vertex is never touched; the same object back when
 * nothing moves.
 */
export function recomposeUnchristened(shape: Shape): Shape {
  let current = shape;
  let moved = true;
  let passes = 0;
  while (moved && passes < 64) {
    moved = false;
    passes += 1;
    for (const vertex of Object.values(current.vertices)) {
      if (!isGeneratedMidpoint(vertex) || isChristened(vertex.data)) continue;
      const letters = composedLettersOf(current, vertex);
      if (letters === null || letters === vertex.data.label) continue;
      current = { ...current, vertices: { ...current.vertices, [vertex.id]: { ...vertex, data: { ...vertex.data, label: letters } } } };
      moved = true;
    }
  }
  return current;
}

/**
 * WORKSPACES SAVED BEFORE THE MARK EXISTED — the stated heuristic, applied ONCE at import to midpoints carrying no mark: a
 * slot that differs from every form the old mint (or the old judge) would have composed from its corners' labels as they
 * stand now (`AB` · `BA` · `A-B` · `B-A`) is taken as a name the person gave, and marked; a slot equal to one of them stays
 * un-christened. ITS FAILURE CASE, NAMED: a slot left stale by a corner renamed before the cure is byte-identical to a given
 * name (ADR 0029), so it is marked christened — the old defect kept for that one vertex until the person clears its label.
 * A file saved after the cure keeps every un-christened slot in step with its corners, so the rule marks nothing wrongly there.
 */
export function migrateChristening(shape: Shape): Shape {
  let current = shape;
  for (const vertex of Object.values(shape.vertices)) {
    if (!isGeneratedMidpoint(vertex) || vertex.createdBy.sourceVertexIds.length < 2 || vertex.data.custom?.[CHRISTENED_KEY] !== undefined) continue;
    const label = vertex.data.label.trim();
    if (!label) continue;
    const [a, b] = vertex.createdBy.sourceVertexIds.map((id) => shape.vertices[id]?.data.label.trim() ?? '');
    if (!a || !b) continue;
    const forms = new Set([`${a}${b}`, `${b}${a}`, `${a}-${b}`, `${b}-${a}`]);
    if (forms.has(label)) continue;
    current = { ...current, vertices: { ...current.vertices, [vertex.id]: { ...vertex, data: { ...vertex.data, custom: withChristened(vertex.data.custom, true) } } } };
  }
  return current;
}
