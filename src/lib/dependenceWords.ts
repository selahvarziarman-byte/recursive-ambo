// THE DEPENDENCE KIND — ADR 0031 §9.64 (3): a second kind of word inside a cast, kept apart (Arman's "b", Δ216; the spend on the cast's type sanctioned Δ221;
// the mothership's STAMP of 2026-10-20 14:04 and its MARKERS of 14:10, 14:12 and 14:15; the designer's 14:08 form, its part 3 built here).
//
// A dependence word says the first cannot be without the second — a condition and what it conditions, a bearer and the borne. IT IS NOT A WAY: no loop takes it
// as a side, no rule composes it, no translation makes it one with a way, no walk rides it, no light's saying is in it. The way-readers are blind to it BY
// CONSTRUCTION, not by a filter at each reader: a cast's dependences live in their own two fields (`dependenceSignature`, `dependences`, read as structure by
// the loader), and every reader of ways reads `signature` and `relations` alone. What this file holds is THE REFUSAL BY NAME wherever a way's word is typed —
// the one reader of the dependence words of a corner's cast, the scope the mothership ruled (14:10: at an edge, its two corners; in a light, the speaking corner
// and the end's; for a rule, the edge he names it at; for a translation, its two words — a word that is a dependence only in a cast not at the act is not refused
// there, since casts' words are foreign to one another until he translates, §9.64 (8)), and the sentence the designer gave: `"requires" names a dependence in
// Production's cast, not a way` — both corners holding it, `… in Production's and Consumption's casts, not a way`. A born corner holds no cast: its dependences
// are its two coordinates, given by the dissection and never poured (§9.64 (3)), so only a seed corner's own cast answers here. React-free; nothing stored.
import type { ConceptSpace, Shape, VertexId } from '../types/geometry';

/** the dependence words of a cast — its dependence signature's words, in the caster's order; none for a cast before MOLD v7 */
export const dependenceWordsOf = (cast: ConceptSpace | null | undefined): string[] => (cast?.dependenceSignature ?? []).map((s) => s.type);

/** the corners, among those given, whose own cast names `word` as a dependence (each once, in the order given) */
export function dependenceCornersOf(shape: Shape, corners: readonly VertexId[], word: string): VertexId[] {
  const w = word.trim();
  if (w.length === 0) return [];
  const out: VertexId[] = [];
  for (const c of corners) {
    if (out.includes(c)) continue;
    const v = shape.vertices[c];
    if (v && dependenceWordsOf(v.data.cast).includes(w)) out.push(c);
  }
  return out;
}

/** THE REFUSAL, in the designer's words (14:08, part 3), or null where the word names no dependence at these corners */
export function dependenceRefusal(shape: Shape, corners: readonly VertexId[], word: string): string | null {
  const at = dependenceCornersOf(shape, corners, word);
  if (at.length === 0) return null;
  const label = (c: VertexId): string => shape.vertices[c]?.data.label?.trim() || 'unnamed';
  const owners = at.map((c) => `${label(c)}'s`);
  return `"${word.trim()}" names a dependence in ${owners.join(' and ')} ${at.length === 1 ? 'cast' : 'casts'}, not a way`;
}
