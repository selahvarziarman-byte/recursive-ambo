// sorting — STAMP MODES-1 · B3 (2026-09-26; the projection ruling D5–D9; ADR 0031 §9.1 D5–D9 and §9.2's landing gate F4,
// second half; Arman's Δ117 Q6–Q9): PATHS, VERDICTS, RULES, EXCEPTIONS, THE SORTING AND THE STATES — the projection.
//
// THE PATH (D5). For a face XYZ and its edge e = XY, a path from x to y through Z is an instance (w, x, z, +) on XZ with an
// instance (w′, z, y, +) on ZY — read through B1's one reader in each edge's own orientation. The device computes every path.
// A C-14 TRIAD `x ↦ y ⟨z⟩` given at the face is a path with the person's verdict `composed` (ADR 0031 §9.4 on §1.3): its two
// legs are the triad's own record, IS on each, and it is read here as such — the record is not rewritten.
// THE COMPOSITE (D6). A path's word is given by a RULE (w, w′) ↦ w‴ — the identity regime's IS ; IS = IS is built in (§9.2);
// the person's rules ride the store — or by the person's VERDICT on that path: `composed` to the direct (w″, x, y), or `not`.
// An EXCEPTION is a verdict that overrides a rule on one path; it is recorded and the rule is flagged. Neither is proposed here.
// THE READING of a path (D7): COMPOSED — its composite is a direct instance of e (that instance is the CENTROID'S); TENSION — its
// composite meets a BAR (the person's, or IS's own one-to-one law on the path's own x: an IS-instance (x, y′), y′ ≠ y, bars
// (IS, x, y) — the identity regime's DISAGREEMENT); LIGHT — its composite is no direct and meets no bar: Z's light, RECORD never
// an offer (§9.6); NOT — the person's verdict says this path is not that instance; UNRULED — no rule and no verdict.
// THE SORTING (D7). Per view Z: an instance is OWN if no path through Z composes to it, the CENTROID'S otherwise. Over the views:
// OWN = the intersection of the per-view own parts (the exclusion is the union); the forms are kept one per view. Z contributes
// no role and no relating. THE STONE's four link kinds are the identity regime's reading of a view, per x of X in Z's shadow:
// FIX (composed) · DISAGREEMENT (tension) · PROPOSAL (light) · UND (x reaches Z but Z does not reach Y — no path).
// THE STATES (D8): UNDETECTED · VACUOUS (per view) · EXHAUSTED · POCKET (D9) · UNRULED · COHERENT · CLOSED — read, never stored.
// THE LOOP at a base corner (the face reading's Fix · Mov · Und, C-5) is the same machinery read from a base: the direct on XY
// then the path back from y through Z to X — returned to itself, returned elsewhere, or broke at one of the three steps.
// F4 (§9.2): under IS-only relatings with IS ; IS = IS the view's kinds must reproduce the stone's four kinds and the loop the
// face reading's classification on the existing tetrahedron fixtures — pinned by the witness against the stone's reference port
// and against `composeThroughCorner` itself, triple for triple. React-free; DOM-free; no vertex id in any packet (the verdict
// record is positional in the face's corner order). Pinned by scripts/diagnose-modes1-the-sorting.cjs.

import type { Edge, Face, JsonValue, PacketData, Shape, VertexId } from '../types/geometry';
import { edgeBetween } from './faceReading';
import { barsOn, instancesOn, IS, type Relating } from './relatings';
import { facesThrough, respectsOn } from './respects';
import type { SpaceOfOptions } from './spaceOf';

export type Rule = [string, string, string]; // (w, w′) ↦ w‴
export const IS_RULE: Rule = [IS, IS, IS];
export type Verdict = 'composed' | 'not';

/** a verdict as the FACE stores it (positional — the two base corners by their POSITIONS in the face's corner order; no id) */
export interface VerdictRecord {
  base: [number, number]; // the positions of x's corner and y's corner in `face.vertexIds`
  x: string;
  w: string;
  z: string;
  w2: string;
  y: string;
  w3: string; // the direct's mode the verdict speaks of
  verdict: Verdict;
  exception?: boolean; // an override of a rule on this one path
}
export const VERDICTS_KEY = 'verdicts';

export interface Path {
  view: VertexId;
  faceId: string;
  x: string;
  w: string;
  z: string;
  w2: string;
  y: string;
  source: 'legs' | 'triad'; // two instances on the legs, or a C-14 triad (a path given whole with `composed`)
}
export type PathReading = 'COMPOSED' | 'TENSION' | 'LIGHT' | 'NOT' | 'UNRULED';
export interface ReadPath {
  path: Path;
  composite: string | null; // w‴ when a rule or a verdict gives it
  by: 'rule' | 'verdict' | 'triad' | null;
  exception: boolean;
  reading: PathReading;
  direct: string | null; // the direct instance's key it composes to (COMPOSED) or presses on (TENSION)
}
export type FootKind = 'FIX' | 'DIS' | 'PRO' | 'UND';
export interface ViewSorting {
  view: VertexId;
  faceId: string;
  vacuous: boolean; // no relating from X or Y to Z
  paths: ReadPath[];
  own: string[]; // instance keys no path through this view composes to
  centroid: string[];
  lights: ReadPath[];
  tensions: ReadPath[];
  unruled: ReadPath[];
  feet: Map<string, { kind: FootKind; y: string | null }>; // the identity regime's reading per x of X in Z's shadow
}
export interface Sorting {
  edge: [VertexId, VertexId];
  instances: Relating[];
  bars: Relating[];
  views: ViewSorting[];
  own: string[]; // the intersection over the views
  centroid: string[]; // the union
  state: 'UNDETECTED' | 'EXHAUSTED' | 'POCKET' | 'OPEN';
  unruled: boolean;
  coherent: boolean;
  closed: boolean;
}

export const relKey = (r: Relating | [string, string, string]): string => `${r[0]}|${r[1]}|${r[2]}`;
const isKey = (x: string, y: string): string => `${IS}|${x}|${y}`;

/** the composite of a path under the rules, or null (the identity regime's rule is always in force) */
export function composeBy(rules: readonly Rule[], w: string, w2: string): string | null {
  for (const [a, b, c] of [IS_RULE, ...rules]) if (a === w && b === w2) return c;
  return null;
}

/**
 * THE SORTING of one edge from its records (the pure core): the direct relatings on e (x of X, y of Y), each view's leg
 * instances (XZ oriented X → Z, ZY oriented Z → Y), its triads (x, y, z), its verdicts (already resolved to this edge's
 * orientation), and the rules in force; `rolesX` is Z's shadow's domain for the identity regime's UND.
 */
export function sortFromRecords(
  edge: [VertexId, VertexId],
  direct: Relating[],
  views: Array<{ view: VertexId; faceId: string; xz: Relating[]; zy: Relating[]; triads: Array<[string, string, string]>; verdicts: Array<Omit<VerdictRecord, 'base'>> }>,
  rules: readonly Rule[],
): Sorting {
  const instances = direct.filter((r) => r[3] === '+');
  const bars = direct.filter((r) => r[3] === '-');
  const directKeys = new Set(instances.map(relKey));
  const barKeys = new Set(bars.map(relKey));
  // IS's one-to-one law as an implicit bar, on the path's OWN x: the person's IS-instance (x, y′), y′ ≠ y, bars (IS, x, y) — the
  // identity regime's DISAGREEMENT (the stone: "a, foot(a), the b the person paired a with"). A y already paired with another x′
  // is NOT a bar on this path (the stone reads it as a PROPOSAL; the register refuses the collision at the act, not the reading).
  const isX = new Map<string, string>();
  for (const r of instances) if (r[0] === IS && !isX.has(r[1])) isX.set(r[1], r[2]);
  const barred = (w: string, x: string, y: string): boolean => {
    if (barKeys.has(`${w}|${x}|${y}`)) return true;
    if (w !== IS) return false;
    const yx = isX.get(x);
    return yx !== undefined && yx !== y;
  };
  const out: ViewSorting[] = [];
  for (const v of views) {
    const xzIn = v.xz.filter((r) => r[3] === '+');
    const zyIn = v.zy.filter((r) => r[3] === '+');
    const paths: Path[] = [];
    for (const a of xzIn) for (const b of zyIn) if (a[2] === b[1]) paths.push({ view: v.view, faceId: v.faceId, x: a[1], w: a[0], z: a[2], w2: b[0], y: b[2], source: 'legs' });
    for (const [x, y, z] of v.triads) if (!paths.some((p) => p.x === x && p.z === z && p.y === y && p.w === IS && p.w2 === IS)) paths.push({ view: v.view, faceId: v.faceId, x, w: IS, z, w2: IS, y, source: 'triad' });
    const read: ReadPath[] = paths.map((p) => {
      const verdict = v.verdicts.find((r) => r.x === p.x && r.w === p.w && r.z === p.z && r.w2 === p.w2 && r.y === p.y);
      const ruled = composeBy(rules, p.w, p.w2);
      let composite: string | null = null;
      let by: ReadPath['by'] = null;
      let exception = false;
      if (verdict) {
        exception = Boolean(verdict.exception) || (ruled !== null && (verdict.verdict === 'not' || verdict.w3 !== ruled));
        if (verdict.verdict === 'not') return { path: p, composite: null, by: 'verdict', exception, reading: 'NOT', direct: null };
        composite = verdict.w3;
        by = 'verdict';
      } else if (p.source === 'triad') {
        composite = IS;
        by = 'triad';
      } else if (ruled !== null) {
        composite = ruled;
        by = 'rule';
      }
      if (composite === null) return { path: p, composite: null, by: null, exception, reading: 'UNRULED', direct: null };
      const k = `${composite}|${p.x}|${p.y}`;
      if (directKeys.has(k)) return { path: p, composite, by, exception, reading: 'COMPOSED', direct: k };
      if (barred(composite, p.x, p.y)) return { path: p, composite, by, exception, reading: 'TENSION', direct: composite === IS && isX.get(p.x) !== undefined && isX.get(p.x) !== p.y ? isKey(p.x, isX.get(p.x) as string) : null };
      return { path: p, composite, by, exception, reading: 'LIGHT', direct: null };
    });
    const composedTo = new Set(read.filter((r) => r.reading === 'COMPOSED').map((r) => r.direct as string));
    const own = instances.map(relKey).filter((k) => !composedTo.has(k));
    const centroid = instances.map(relKey).filter((k) => composedTo.has(k));
    // the identity regime's kinds per x of X in Z's shadow (an IS-instance from x to Z)
    const feet = new Map<string, { kind: FootKind; y: string | null }>();
    for (const a of xzIn) {
      if (a[0] !== IS || feet.has(a[1])) continue;
      const p = read.find((r) => r.path.x === a[1] && r.path.z === a[2] && r.path.w === IS && r.path.w2 === IS);
      if (!p) feet.set(a[1], { kind: 'UND', y: null });
      else feet.set(a[1], { kind: p.reading === 'COMPOSED' ? 'FIX' : p.reading === 'TENSION' ? 'DIS' : p.reading === 'LIGHT' ? 'PRO' : 'UND', y: p.path.y });
    }
    for (const [x, y, z] of v.triads) if (!feet.has(x)) { const p = read.find((r) => r.path.x === x && r.path.z === z && r.path.y === y); if (p) feet.set(x, { kind: p.reading === 'COMPOSED' ? 'FIX' : p.reading === 'TENSION' ? 'DIS' : p.reading === 'LIGHT' ? 'PRO' : 'UND', y }); }
    out.push({ view: v.view, faceId: v.faceId, vacuous: xzIn.length === 0 && zyIn.length === 0 && v.triads.length === 0, paths: read, own, centroid, lights: read.filter((r) => r.reading === 'LIGHT'), tensions: read.filter((r) => r.reading === 'TENSION'), unruled: read.filter((r) => r.reading === 'UNRULED'), feet });
  }
  const keys = instances.map(relKey);
  const ownAll = out.length === 0 ? keys : keys.filter((k) => out.every((v) => v.own.includes(k)));
  const centroidAll = keys.filter((k) => !ownAll.includes(k));
  const pocket = out.length >= 2 && out.every((v) => v.own.length > 0) && ownAll.length === 0;
  const state: Sorting['state'] = instances.length === 0 && bars.length === 0 ? 'UNDETECTED' : pocket ? 'POCKET' : ownAll.length === 0 && instances.length > 0 ? 'EXHAUSTED' : 'OPEN';
  const unruled = out.some((v) => v.unruled.length > 0);
  const tension = out.some((v) => v.tensions.length > 0);
  // a verdict disagreement: one word-pair composed to different words across faces
  const said = new Map<string, Set<string>>();
  for (const v of out) for (const r of v.paths) if (r.by === 'verdict' && r.composite !== null) { const k = `${r.path.w}|${r.path.w2}`; said.set(k, new Set([...(said.get(k) ?? []), r.composite])); }
  const disagreement = [...said.values()].some((s) => s.size > 1);
  const light = out.some((v) => v.lights.length > 0);
  return { edge, instances, bars, views: out, own: ownAll, centroid: centroidAll, state, unruled, coherent: !tension && !disagreement && !pocket, closed: instances.length > 0 && ownAll.length === 0 && !light };
}

/** the verdicts a face holds, positional (well-formed items only) */
export function verdictsOn(face: Face | undefined): VerdictRecord[] {
  const raw = face?.data?.[VERDICTS_KEY];
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[]).filter((v): v is VerdictRecord => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
    const o = v as Record<string, unknown>;
    return Array.isArray(o.base) && o.base.length === 2 && o.base.every((n) => typeof n === 'number') && ['x', 'w', 'z', 'w2', 'y', 'w3'].every((k) => typeof o[k] === 'string' && (o[k] as string).length > 0) && (o.verdict === 'composed' || o.verdict === 'not');
  }).map((v) => ({ ...v, base: [v.base[0], v.base[1]] }));
}
export function withVerdict(face: Face, v: VerdictRecord): Face {
  const held = verdictsOn(face).filter((h) => !(h.base[0] === v.base[0] && h.base[1] === v.base[1] && h.x === v.x && h.w === v.w && h.z === v.z && h.w2 === v.w2 && h.y === v.y));
  const rest: PacketData = { ...(face.data ?? {}) };
  rest[VERDICTS_KEY] = [...held, { ...v }] as unknown as JsonValue;
  return { ...face, data: rest };
}
export function withoutVerdict(face: Face, v: Omit<VerdictRecord, 'verdict' | 'w3' | 'exception'>): Face {
  const held = verdictsOn(face);
  const next = held.filter((h) => !(h.base[0] === v.base[0] && h.base[1] === v.base[1] && h.x === v.x && h.w === v.w && h.z === v.z && h.w2 === v.w2 && h.y === v.y));
  if (next.length === held.length) return face;
  const rest: PacketData = { ...(face.data ?? {}) };
  delete rest[VERDICTS_KEY];
  if (next.length) rest[VERDICTS_KEY] = next as unknown as JsonValue;
  return Object.keys(rest).length ? { ...face, data: rest } : (({ data: _d, ...f }) => { void _d; return f; })(face);
}

/** an edge's instances and bars oriented from `from` to `to` (the record reads first corner ↦ second) */
export function relatingsFrom(shape: Shape, from: VertexId, to: VertexId, options: SpaceOfOptions): Relating[] {
  const e = edgeBetween(shape.edges, from, to);
  if (!e) return [];
  const list = [...instancesOn(e, options), ...barsOn(e, options)];
  return e.vertexIds[0] === from ? list : list.map((r): Relating => [r[0], r[2], r[1], r[3]]);
}

/** THE SORTING of an edge on a shape: every triangular face through it a view; the legs, the triads and the verdicts read from the shape; the rules given */
export function sortingOf(shape: Shape, edge: Edge | undefined, options: SpaceOfOptions = {}, rules: readonly Rule[] = []): Sorting | null {
  if (!edge) return null;
  const [X, Y] = edge.vertexIds as [VertexId, VertexId];
  const direct = [...instancesOn(edge, options), ...barsOn(edge, options)];
  const triadsBy = respectsOn(shape, edge);
  const views = facesThrough(shape, edge).map((f) => {
    const Z = f.vertexIds.find((v) => v !== X && v !== Y) as VertexId;
    const iX = f.vertexIds.indexOf(X);
    const iY = f.vertexIds.indexOf(Y);
    const rec = triadsBy.get(Z);
    // the triad's tuple reads a of the edge's first corner, b of its second, c of the light — the edge's own orientation already
    const triads: Array<[string, string, string]> = rec ? rec.roles.map((t) => [t[0], t[1], t[2]] as [string, string, string]) : [];
    const verdicts = verdictsOn(f).filter((v) => v.base[0] === iX && v.base[1] === iY).map(({ base: _b, ...rest }) => { void _b; return rest; });
    return { view: Z, faceId: f.id, xz: relatingsFrom(shape, X, Z, options), zy: relatingsFrom(shape, Z, Y, options), triads, verdicts };
  });
  // several Face objects with one vertex set are one view (a face two cells hold): keep the first per light
  const seen = new Set<VertexId>();
  const oneEach = views.filter((v) => { if (seen.has(v.view)) return false; seen.add(v.view); return true; });
  return sortFromRecords([X, Y], direct, oneEach, rules);
}

/** THE LOOP at a base corner X of a face X·Y·Z — the face reading's classification, from the same paths: h(x) is the direct on
 *  X–Y then the path back from y through Z; returned to itself (Fix), elsewhere (Mov), or broke — at step 1 (no direct), 2 or 3 */
export type LoopStep = 1 | 2 | 3;
export function loopReading(xy: Map<string, string>, yz: Map<string, string>, zx: Map<string, string>, rolesX: readonly string[]): { fix: string[]; mov: Array<[string, string]>; und: Array<{ role: string; brokeAt: LoopStep }> } {
  const fix: string[] = [];
  const mov: Array<[string, string]> = [];
  const und: Array<{ role: string; brokeAt: LoopStep }> = [];
  for (const x of rolesX) {
    const y = xy.get(x);
    if (y === undefined) { und.push({ role: x, brokeAt: 1 }); continue; }
    const z = yz.get(y);
    if (z === undefined) { und.push({ role: x, brokeAt: 2 }); continue; }
    const back = zx.get(z);
    if (back === undefined) { und.push({ role: x, brokeAt: 3 }); continue; }
    if (back === x) fix.push(x);
    else mov.push([x, back]);
  }
  return { fix, mov, und };
}
/** the IS map of an edge from `from` to `to` (the first IS-instance per x) */
export function isMapFrom(shape: Shape, from: VertexId, to: VertexId, options: SpaceOfOptions = {}): Map<string, string> {
  const m = new Map<string, string>();
  for (const r of relatingsFrom(shape, from, to, options)) if (r[0] === IS && r[3] === '+' && !m.has(r[1])) m.set(r[1], r[2]);
  return m;
}
