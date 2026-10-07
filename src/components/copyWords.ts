// ═══ COPY-1 §3 — THE WORDS FOR CODE VALUES AND COUNTS, one reader for the whole Ambo page (STAMP LAYOUT-1 · MARKER M1, the
// designer's COPY-1 ratified 2026-09-29). Rule 6: code words become words (P2, P4, P5). Rule 10: counts are a number and its noun,
// plural right (`1 cell`, `2 cells`; `generation 1`, never `g1`). Rule 5: no id reaches the page. Every component that prints a
// shape's code, a cell's kind, an operation's id or a count reads it here, so the page has ONE spelling for each — a second
// formatter is the drift the law predicts.

import { getOperation } from '../operations/registry';
import { shapeWords } from '../operations/shapeWords';
import type { CellKind, Shape } from '../types/geometry';

export { shapeWords };

/** rule 10 — `1 cell` · `2 cells`; an irregular plural given (`1 vertex` · `2 vertices`) */
export function countNoun(count: number, noun: string, plural: string = `${noun}s`): string {
  return `${count} ${count === 1 ? noun : plural}`;
}

/** `a tetrahedron` · `an octahedron` */
export function withArticle(words: string): string {
  return `${/^[aeiou]/i.test(words) ? 'an' : 'a'} ${words}`;
}

/** a list in a sentence: `a` · `a and b` · `a, b and c` */
export function listWords(parts: string[]): string {
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

/** a cell's kind in words: the record calls a dissected cell's copy `parent`; on the page it is the seed (at generation 0 — the seed
 * tetrahedron, now dissected: P4's own example) or `dissected` (a core or residue dissected again); the other kinds as they are */
export function cellKindWord(kind: CellKind, generation: number): string {
  if (kind === 'parent') return generation === 0 ? 'seed' : 'dissected';
  return kind;
}

/** P4 — a cell by kind, shape and generation: `seed tetrahedron, generation 0` · `core octahedron, generation 1`; a cell with no recorded
 * shape leaves the shape out (`core, generation 1`), never `unknown` */
export function cellWords(kind: CellKind, topology: string | null | undefined, generation: number): string {
  const shape = shapeWords(topology);
  return `${cellKindWord(kind, generation)}${shape ? ` ${shape}` : ''}, generation ${generation}`;
}

/** the kinds present, each with its count, in the solid's own order: `1 parent, 1 core, 4 residues` (the genealogy's line and the solid's
 * foot read the same words; a kind with no cell is not listed — the ordinary is not marked). The RECORD's kind words stand here, a
 * dissected cell's copy counted as `parent`: the counts line keeps `1 parent` — there it counts the relation, and it doesn't double
 * (MARKER LAYOUT-1 · M14); a cell named on its own reads `cellKindWord` */
export function cellKindCountsWords(shape: Shape): string {
  const counts: Record<CellKind, number> = { seed: 0, parent: 0, core: 0, residue: 0 };
  for (const cell of shape.cells) counts[cell.kind] += 1;
  return (['seed', 'parent', 'core', 'residue'] as CellKind[])
    .filter((kind) => counts[kind] > 0)
    .map((kind) => `${counts[kind]} ${counts[kind] === 1 ? kind : `${kind}s`}`) // the designer's gate (12:32 §2): `2 parents, 1 core, 10 residues`
    .join(', ');
}

/** LAYOUT-1 §3 · COPY-1 §5.2 — the counts in one small line at the solid's foot:
 * `generation 1 · 6 cells (1 parent, 1 core, 4 residues) · 8 faces · 6 vertices` (a dissected tetrahedron: its seed's copy is kind `parent`) */
export function solidCountsWords(shape: Shape): string {
  const kinds = cellKindCountsWords(shape);
  return [
    `generation ${shape.genealogy.generationDepth}`,
    `${countNoun(shape.cells.length, 'cell')}${kinds ? ` (${kinds})` : ''}`,
    countNoun(shape.faces.length, 'face'),
    countNoun(Object.keys(shape.vertices).length, 'vertex', 'vertices'),
  ].join(' · ');
}

/** P2 — an operation's id → its name (`ambo-dissection` → `Ambo Dissection`, the registry's own label); the seed and the reset by their
 * words (`the seed`, `reset`); any other operation code with its hyphens made spaces (`open lift`, `patch lift`) */
export function operationWords(id: string | null | undefined): string | null {
  if (!id) return null;
  if (id === 'seed' || id === 'seed-selection') return 'the seed';
  if (id === 'reset-workspace') return 'reset';
  return getOperation(id)?.label ?? id.replace(/-/g, ' ');
}

/** COPY-1 §5.4 **save & history** — a history entry's stored label in the page's words: `the seed: Tetrahedron` · `reset: Tetrahedron` ·
 * `Ambo Dissection`. The store writes these words now; a workspace saved before them carries `Seed: …` / `Reset Workspace: …`, read here
 * as the same acts (the label is the record of the act as named; nothing else in it is parsed) */
export function historyWords(label: string): string {
  if (label.startsWith('Seed: ')) return `the seed: ${label.slice('Seed: '.length)}`;
  if (label.startsWith('Reset Workspace: ')) return `reset: ${label.slice('Reset Workspace: '.length)}`;
  return label;
}

/** COPY-1 §5.4 — a position as the page prints it: `0.500, 0.000, −0.354` (three decimals, a true minus, no `−0.000`) */
export function positionWords(position: readonly [number, number, number] | readonly number[]): string {
  return position
    .map((n) => {
      const fixed = Math.abs(n).toFixed(3);
      return n < 0 && fixed !== '0.000' ? `−${fixed}` : fixed;
    })
    .join(', ');
}

/** P2 — a vertex's role code → its words: `generated midpoint` → `midpoint` · `preserved source` → `kept from the source` ·
 * `seed/source` → `seed corner` · `source` → `source corner`; `unknown` stays what the record says */
export function vertexRoleWords(role: string): string {
  if (role === 'generated midpoint') return 'midpoint';
  if (role === 'preserved source') return 'kept from the source';
  if (role === 'seed/source') return 'seed corner';
  if (role === 'source') return 'source corner';
  return role;
}

/** P2 — a lineage mode code → its words: `derived-from-edge` → `from edge` · `-face` · `-vertex` · `-cell` · `composite` → `made from` ·
 * `preserved` → `kept` · `default` → `seed`; any other code with its hyphens made spaces */
export function lineageModeWords(mode: string): string {
  if (mode === 'derived-from-edge') return 'from edge';
  if (mode === 'derived-from-face') return 'from face';
  if (mode === 'derived-from-vertex') return 'from vertex';
  if (mode === 'derived-from-cell') return 'from cell';
  if (mode === 'composite') return 'made from';
  if (mode === 'preserved') return 'kept';
  if (mode === 'default') return 'seed';
  return mode.replace(/-/g, ' ');
}

/** P2 — a face-size histogram `3:8 4:6` → `8 with 3 corners · 6 with 4 corners` */
export function faceSizesWords(histogram: Record<number, number>): string {
  const entries = Object.entries(histogram).sort(([a], [b]) => Number(a) - Number(b));
  return entries.length ? entries.map(([size, count]) => `${count} with ${countNoun(Number(size), 'corner')}`).join(' · ') : 'none';
}

/** P2 — a vertex-degree histogram `4:6` → `6 of degree 4` */
export function vertexDegreesWords(histogram: Record<number, number>): string {
  const entries = Object.entries(histogram).sort(([a], [b]) => Number(a) - Number(b));
  return entries.length ? entries.map(([degree, count]) => `${count} of degree ${degree}`).join(' · ') : 'none';
}

/** `A holds no cast` · `A and B hold no cast` · `A, B and C hold no cast` — the corners named, the verb agreeing */
export function holdNoCastWords(names: string[]): string {
  return `${listWords(names)} ${names.length === 1 ? 'holds' : 'hold'} no cast`;
}

/** MODES-3 (the designer's 16:26 §1b, with M10): the parents under a midpoint that hold no space, each with its reason — a seed corner
 * `A holds no cast`, a midpoint `AB holds no relating yet` — the corners of one reason listed together, the two reasons joined by `and`:
 * `A holds no cast and AB holds no relating yet` · `AB and AC hold no relating yet` */
export function holdNoSpaceWords(items: Array<{ name: string; why: 'cast' | 'relating' }>): string {
  const casts = items.filter((i) => i.why === 'cast').map((i) => i.name);
  const relatings = items.filter((i) => i.why === 'relating').map((i) => i.name);
  const parts: string[] = [];
  if (casts.length) parts.push(holdNoCastWords(casts));
  if (relatings.length) parts.push(`${listWords(relatings)} ${relatings.length === 1 ? 'holds' : 'hold'} no relating yet`);
  return parts.join(' and ');
}
