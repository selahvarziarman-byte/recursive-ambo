// ═══ ONE READER FOR A WORD'S WAY ON THIS EDGE (VL 42 — the designer's 15:05, items 1–3; the mothership's 15:17) ═══
// A word in use on an edge reads its own way at once: the way his sayings in that word read there — his relatings and bars in it, the decisions he made in
// it on the edge's faces (the direction recorded with the decision), and the ways he chose for it on the edge's child's loops. Where every saying reads
// the same way, that is the word's way here; where there is none, or two ways, the word has no way here yet, and the place he types it asks `which way
// it reads` and waits. The pairing tab, the decide prompt, the bond's saying, the rule field and the loop card read THIS and nothing else, so no two
// of them can disagree about how a word reads on one edge. The direction is the edge's own: `→` the first corner's role as subject, `←` the second's.
import type { Edge, Shape, VertexId } from '../types/geometry';
import { AGAINST, ALONG, dirOf, IS, relatingsHeld, type Dir } from './relatings';
import { verdictsOn } from './sorting';

/** a saying in a word, read in a direction on this edge */
export type Saying = readonly [string, Dir];

/** his sayings on the edge: relatings and bars (never IS), decisions on the edge's faces that carry their direction, the ways chosen on the child's loops */
export function sayingsOn(shape: Shape, edge: Edge, loopAnswers: ReadonlyArray<ReadonlyArray<unknown>>): Saying[] {
  const out: Saying[] = [];
  for (const r of relatingsHeld(edge)) if (r[0] !== IS) out.push([r[0], dirOf(r)]);
  const [a, b] = edge.vertexIds as [VertexId, VertexId];
  for (const f of shape.faces) {
    if (!f.vertexIds.includes(a) || !f.vertexIds.includes(b)) continue;
    for (const v of verdictsOn(f)) {
      if (v.verdict !== 'composed' || !v.w3 || !v.w3dir) continue; // a decision made before the way was recorded with it says nothing about the word's way
      const xAtA = f.vertexIds[v.base[0]] === a; // the record's direction runs x → y; the edge's runs its first corner → its second
      out.push([v.w3, xAtA ? v.w3dir : v.w3dir === ALONG ? AGAINST : ALONG]);
    }
  }
  const child = Object.values(shape.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(a) && v.createdBy.sourceVertexIds.includes(b));
  if (child) for (const row of loopAnswers) if (row[0] === shape.id && row[1] === child.id && typeof row[3] === 'string' && (row[4] === ALONG || row[4] === AGAINST)) out.push([row[3], row[4] as Dir]);
  return out;
}

/** the word's way on this edge: the one way all his sayings in it read, else none */
export function wayOfWord(w: string, sayings: ReadonlyArray<Saying>): Dir | null {
  const ds = sayings.filter((s) => s[0] === w).map((s) => s[1]);
  return ds.length > 0 && ds.every((d) => d === ds[0]) ? ds[0] : null;
}
