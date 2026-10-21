// THE DEPENDENCE LOGIC — ADR 0031 §9.73 (ratified 2026-10-21 13:16; its ADDENDUM by Arman's Δ163 "stay quiet", 13:47): "cannot be without" is TRANSITIVE and is
// read as CHAINS in the caster's words — no composite word is ever made (§9.64 (8)); a denied dependence stops no chain in another word and is shown beside, STRUCK,
// where it stands; mutual foundation (a chain back to its start) is lawful and unmarked. ONE READER OF FOUNDATION PER CAST: what a moment RESTS ON is every moment
// reached from it along the cast's held dependence tuples, nearest first, each kept with the moment it is reached THROUGH; WHAT CANNOT BE WITHOUT IT, its dependents.
// Read at the drawing's card (Δ226, the designer's 15:41 and 13:42), at the child's card (§9.73 (2), her 13:50) and at the altitude's end-cell (§9.73 (3), her 13:42
// §3); a LINE on demand, never a state, never a refusal, never an act; nothing stored (Δ80). The reader takes the cast's tuples as `dependenceTuplesOf` hands them
// (castInside.ts — the one reader of the second part, the wiring's and this one's) and reads no cast field itself. React-free; store-free.
import type { DependenceTuple } from './castInside';

/** a dependence as a card lists it: the word, the moment at its other end, whether the caster holds or denies it */
export interface FoundationItem { word: string; to: string; holds: boolean }
/** a moment the subject rests on: reached by a held chain — `via` the moment it is reached through (null: directly), `chain` the moments from the subject (exclusive) to it (inclusive) */
export interface Foundation { id: string; via: string | null; chain: string[] }
export interface FoundationReading {
  /** the moment's own dependence tuples, held and denied, in the caster's order (a dependence on itself has no run and is not among them) */
  direct: FoundationItem[];
  /** every moment it rests on — held chains only, itself excluded — nearest first; its length is the count the lines print */
  rests: Foundation[];
  /** per moment reached, in that order: its own held dependence tuples to moments the reading has not yet named, and its denials where they stand — the `through X:` lines;
   *  a moment with nothing new is left out */
  through: Array<{ via: string; items: FoundationItem[] }>;
  /** what cannot be without it: the dependence tuples whose other end is the moment */
  dependents: Array<{ from: string; word: string; holds: boolean }>;
}

/** THE READER: what `id` rests on in a cast whose dependence tuples are `tuples` — transitive across words, the chains kept, the denials beside */
export function foundationOf(tuples: readonly DependenceTuple[], id: string): FoundationReading {
  const direct: FoundationItem[] = tuples.filter((t) => t.from === id && t.to !== id).map((t) => ({ word: t.word, to: t.to, holds: t.holds }));
  const named = new Set<string>([id]);
  const rests: Foundation[] = [];
  const queue: Foundation[] = [];
  for (const t of direct) {
    if (!t.holds || named.has(t.to)) continue;
    named.add(t.to);
    const f: Foundation = { id: t.to, via: null, chain: [t.to] };
    rests.push(f);
    queue.push(f);
  }
  const through: Array<{ via: string; items: FoundationItem[] }> = [];
  while (queue.length) {
    const x = queue.shift() as Foundation;
    const items: FoundationItem[] = [];
    for (const t of tuples) {
      if (t.from !== x.id || t.to === x.id) continue;
      if (!t.holds) { items.push({ word: t.word, to: t.to, holds: false }); continue; } // a denial stays struck where it stands
      if (named.has(t.to)) continue; // reached already, or the subject itself (mutual foundation: shown as it is, unmarked)
      named.add(t.to);
      const f: Foundation = { id: t.to, via: x.id, chain: [...x.chain, t.to] };
      rests.push(f);
      queue.push(f);
      items.push({ word: t.word, to: t.to, holds: true });
    }
    if (items.length) through.push({ via: x.id, items });
  }
  const dependents = tuples.filter((t) => t.to === id && t.from !== id).map((t) => ({ from: t.from, word: t.word, holds: t.holds }));
  return { direct, rests, through, dependents };
}

/** the items grouped as the card writes a line: one group per word and polarity, in the order of first appearance — `is made by the working, the capacity`; a denied group is its own, struck by its reader */
export interface FoundationGroup { word: string; holds: boolean; to: string[] }
export function groupedItems(items: readonly FoundationItem[]): FoundationGroup[] {
  const out: FoundationGroup[] = [];
  for (const it of items) {
    const g = out.find((x) => x.word === it.word && x.holds === it.holds);
    if (g) g.to.push(it.to); else out.push({ word: it.word, holds: it.holds, to: [it.to] });
  }
  return out;
}

/** the items of a `show` list, in the moment card's order: each dependence its own item (`is made by the working` and `is made by the capacity` apart), a `through X:`
 *  item per dependence reached through another, a denial struck where it stands */
export function foundationItemsOf(tuples: readonly DependenceTuple[], id: string): Array<{ key: string; via: string | null; item: FoundationItem }> {
  const r = foundationOf(tuples, id);
  const out = r.direct.map((item, i) => ({ key: `d|${i}|${item.word}|${item.to}`, via: null as string | null, item }));
  r.through.forEach((t) => t.items.forEach((item, i) => out.push({ key: `t|${t.via}|${i}|${item.word}|${item.to}`, via: t.via, item })));
  return out;
}
