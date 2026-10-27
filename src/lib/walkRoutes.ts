/**
 * ADR 0031 §9.57 — THE WALK UNDER FAMILIES (the mothership's STAMP of 2026-10-17 16:42 and ruling of 16:51; the designer's words of 16:44; group 2, after release 1).
 *
 * A walk is a closed walk of the mesh, a finite sequence of corners; a ROUTE is one choice of road per step; at a branching — a role held by several ways — the
 * routes fork; a route stops where its role has no road on the next edge. The tree is finite by construction: finitely many roads at every step, finitely many
 * steps (§9.57 (4)). A route all of whose legs are IS is the identification structure's and reads Fix · Mov · Und by D20, on `transportStepOf`; a route with a
 * named leg is a LIGHT of the face (§9.57 (1), (3)): returning to itself, a named way of the role with itself; returning to another role, a named way between the
 * two — never a Mov, never a merge, never written in a cast. A route's word is the COMPOSITE of the words walked (§9.57 (2)): by substitution where a leg is IS
 * (D13), by his rule where he has one (D6, a chain rule `(w, w′) ↦ w‴`), else UNRULED — the words walked in their order, each as he said it. React-free; the cargo
 * and the born face read through here; pinned by scripts/diagnose-the-walk-under-the-norm.cjs.
 */
import type { VertexId } from '../types/geometry';
import { IS, IS_GLYPH, NO_FACTS, converseOf, type LexiconFacts } from './relatings';
import { ruleReads, ruleShape, type Rule } from './sorting';
import { COORDINATE, IDENTITY, type Road, type WaysMap } from './transport';

export interface RouteLeg { from: VertexId; to: VertexId; road: Road }
export interface Route { start: string; end: string | null; legs: RouteLeg[]; brokeAt: { from: VertexId; to: VertexId } | null }
export type Composite = { kind: 'is' } | { kind: 'word'; word: string; by: 'substitution' | 'rule' } | { kind: 'unruled' };

/** every route of one round of the closed walk `corners` from a role of its first corner — the tree, every road at every branching; a route that finds no road stops (§9.57 (4)) */
export function routesAround(corners: readonly VertexId[], start: string, ways: (from: VertexId, to: VertexId) => WaysMap | null): Route[] {
  const n = corners.length;
  const out: Route[] = [];
  const go = (k: number, role: string, legs: RouteLeg[]): void => {
    if (k === n) { out.push({ start, end: role, legs, brokeAt: null }); return; }
    const from = corners[k]; const to = corners[(k + 1) % n];
    const roads = ways(from, to)?.get(role) ?? [];
    if (roads.length === 0) { out.push({ start, end: null, legs, brokeAt: { from, to } }); return; }
    for (const road of roads) go(k + 1, road.to, [...legs, { from, to, road }]);
  };
  go(0, start, []);
  return out;
}

/** a leg's word as a route reads it: IS as its glyph; the coordinate leg has none (structure, unprinted) */
const printed = (w: string): string | null => (w === COORDINATE || w === IDENTITY ? null : w === IS ? IS_GLYPH : w); // GROUP 4 · slice 5b: the segment leg is structure too, unprinted
/** the words walked, in order, each as he said it (§9.57 (2); the designer's 16:44: printed after `by`, joined by `then`) */
export const wordsOf = (words: readonly string[]): string[] => words.map(printed).filter((w): w is string => w !== null);
export const wordsWalked = (r: Route): string[] => wordsOf(r.legs.map((l) => l.road.word));
/** a route with a named leg is a LIGHT (§9.57 (1), (3)); IS legs alone are the identification structure's */
export const isNamedWords = (words: readonly string[]): boolean => words.some((w) => w !== IS && w !== COORDINATE && w !== IDENTITY);
export const isNamed = (r: Route): boolean => isNamedWords(r.legs.map((l) => l.road.word));

/** the composite of the words walked (§9.57 (2)): IS legs by substitution (D13); two named words by his chain rule `(w, w′) ↦ w‴` (D6) — the first rule that keys them; else unruled */
/** a step of the fold: the leg's word and whether the leg was walked AGAINST its way (the road's own `against`) */
export interface Step { word: string; against: boolean }
/** THE FOLD ALONG THE WALK (§9.65 (1), (3)): IS and the coordinate leg by substitution (D13); the first named leg the way-so-far; each further named leg a step with a
 *  SHAPE — a CHAIN where the leg runs with the walk, keyed by his chain rule `(w, w′) ↦ w‴`; a JOIN where the leg is walked against its way, keyed by his join rule
 *  (order-free) or, where he declared the leg's converse, by the chain rule on the converse — never by the pair's chain rule as if the leg ran along (measured
 *  10-20: the fold read every step as a chain on the words alone); else UNRULED from that step on */
export function compositeOfSteps(steps: readonly Step[], rules: readonly Rule[], facts: LexiconFacts = NO_FACTS): Composite {
  let acc: string | null = null;
  let byRule = false;
  for (const { word: w, against } of steps) {
    if (w === IS || w === COORDINATE || w === IDENTITY) continue;
    if (acc === null) { acc = w; continue; }
    const key: string = acc;
    const rule: Rule | undefined = against
      ? rules.find((x) => ruleReads(x, { w: key, w2: w, shape: 'join' })) ?? (() => { const cw = converseOf(facts, w); return cw === null ? undefined : rules.find((x) => ruleShape(x) === 'chain' && x[0] === key && x[1] === cw); })()
      : rules.find((x) => ruleShape(x) === 'chain' && x[0] === key && x[1] === w);
    if (!rule) return { kind: 'unruled' };
    acc = rule[2] as string; byRule = true;
  }
  return acc === null ? { kind: 'is' } : { kind: 'word', word: acc, by: byRule ? 'rule' : 'substitution' };
}
/** the fold over words alone — every leg read as walked along; kept for readers that hold no roads (none in `src` today: the cargo and the lights pass their steps) */
export const compositeOfWords = (words: readonly string[], rules: readonly Rule[], facts: LexiconFacts = NO_FACTS): Composite => compositeOfSteps(words.map((word) => ({ word, against: false })), rules, facts);
export const stepsOf = (r: Route): Step[] => r.legs.map((l) => ({ word: l.road.word, against: l.road.against }));
export const compositeOf = (r: Route, rules: readonly Rule[], facts: LexiconFacts = NO_FACTS): Composite => compositeOfSteps(stepsOf(r), rules, facts);

/** the way a named route derives between its two ends, in its own direction: the composite's subject is the route's start, unless every named leg was walked against its way — then the end (a mixed route read back from its other end, §9.53 (a)) */
export function derivedWayOf(r: Route, rules: readonly Rule[], facts: LexiconFacts = NO_FACTS): { subject: string; word: string | null; object: string; unruled: boolean } | null {
  if (r.end === null || !isNamed(r)) return null;
  const c = compositeOf(r, rules, facts);
  const named = r.legs.filter((l) => l.road.word !== IS && l.road.word !== COORDINATE && l.road.word !== IDENTITY);
  const against = named.length > 0 && named.every((l) => l.road.against);
  const [subject, object] = against ? [r.end, r.start] : [r.start, r.end];
  return { subject, word: c.kind === 'word' ? c.word : null, object, unruled: c.kind === 'unruled' };
}

/** THE LIGHTS OF A FACE AT A CORNER (§9.57 (3); the mothership's 16:51: a way found from both its ends is ONE light, listed once; the designer's 16:51: its line names
 *  the route that reads in the sentence's direction): the named routes from every role of the corner around the walk based there, grouped by the way they derive —
 *  subject, word, object (an unruled route by its ends and its words) — the route kept the one whose start is the way's subject */
export interface FaceLight { subject: string; object: string; word: string | null; unruled: boolean; route: Route }
export function lightsAt(corners: readonly VertexId[], roles: readonly string[], ways: (from: VertexId, to: VertexId) => WaysMap | null, rules: readonly Rule[], facts: LexiconFacts = NO_FACTS): FaceLight[] {
  const out = new Map<string, FaceLight>();
  for (const role of roles) {
    for (const r of routesAround(corners, role, ways)) {
      const d = derivedWayOf(r, rules, facts);
      if (!d) continue;
      const key = d.unruled ? `${[d.subject, d.object].sort().join('\u0000')}\u0000${wordsWalked(r).join('\u0000')}` : `${d.subject}\u0000${d.word}\u0000${d.object}`;
      const held = out.get(key);
      if (!held || (held.route.start !== held.subject && r.start === d.subject)) out.set(key, { ...d, route: r });
    }
  }
  return [...out.values()];
}
