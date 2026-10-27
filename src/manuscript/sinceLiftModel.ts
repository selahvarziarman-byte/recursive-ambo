// SINCE THIS LIFT — ADR 0031 §9.61 (ratified 10-19 16:13; the designer's form of 10-19 16:15; the mothership's STAMP THE-RIDERS-AFTER-2.1, rider 2).
//
// A lifted form is a RECORD of the residue as it stood at the lift (a stage of the log, D17). An act on the seed after the lift is SINCE THE LIFT: it is
// on the seed's record and not in the form, and it reaches a room only by his acts — a new lift and a new glue. Where the difference shows, the form's
// card and the room read from it carry a positive mark: `since this lift, on the seed: 2 relatings on A–B, 1 on A–C · 1 bar on A–B · 1 withdrawn on A–C`,
// counted by kind and by place with a zero part not printed, `show` listing each act as he said it with its place, `lift again` his act. When nothing
// moved there is no line — the ordinary is not marked.
//
// THE READER: the universe's log after the lift's own entry (the lift is an act of the log; the shelf item and the page store carry its stage), the
// entries whose subject is the seed — its edges (relatings, bars, pairs, word pairs), its faces (decisions, sayings in a light, triads), its sites (a
// loop's answers, names). Each act counts in its own kind; an item acted on more than once since the lift counts by its LATEST act — given then
// withdrawn reads `withdrawn` (the ADR's falsifier: "withdraw that relating on the seed: the first form's mark reads one withdrawn since"). Acts on the
// lexicon as a whole (a rule, a converse, a mode, a bond rule, a loop rule) are not acts on the seed and are not counted here.
// RECORD, NOT READING: nothing is stored; derived at every read from the log, the lift's origin and the seed as it stands. React-free.
import { edgeNameOf } from '../lib/faceReading';
import type { Shape, VertexId } from '../types/geometry';
import type { LogEntry } from '../lib/stage';
import type { LiftOrigin } from '../store/liftStore';
import { termWordsOf } from '../lib/instanceSpace';
import { AGAINST, IS, dirOf, type Relating } from '../lib/relatings';
import { faceDesignationOf } from '../lib/subComplexLift';

export type SinceKind = 'relating' | 'pair' | 'word pair' | 'bar' | 'decision' | 'saying' | 'triad' | 'answer' | 'name' | 'withdrawn';
const KIND_ORDER: SinceKind[] = ['relating', 'pair', 'word pair', 'bar', 'decision', 'saying', 'triad', 'answer', 'name', 'withdrawn'];
const PLURAL: Record<SinceKind, string> = { relating: 'relatings', pair: 'pairs', 'word pair': 'word pairs', bar: 'bars', decision: 'decisions', saying: 'sayings', triad: 'triads', answer: 'answers', name: 'names', withdrawn: 'withdrawn' };

/** one act since the lift, by its latest state: its kind, its place (`on A–B` · `at A·AB·AC` · `at AB`) and his words for it */
export interface SinceItem { kind: SinceKind; place: string; words: string }
export interface SinceLift { items: SinceItem[]; line: string; list: string[] }

/** the words of a count by kind and place: `2 relatings on A–B, 1 on A–C` — the kind said once, then the places */
const kindWords = (kind: SinceKind, byPlace: Map<string, number>): string => {
  const parts = [...byPlace.entries()];
  const noun = kind === 'withdrawn' ? 'withdrawn' : parts[0][1] === 1 ? kind : PLURAL[kind]; // the noun agrees with the first place's count: `2 relatings on A–B, 1 on A–C` · `1 relating on A–B, 1 on A–C`
  return parts.map(([place, n], i) => (i === 0 ? `${n} ${noun} ${place}` : `${n} ${place}`)).join(', ');
};

/** the log entry the lift is: present, a lift, of this seed — else the log is not the one the lift was made in and nothing can be said */
export const liftEntryOf = (log: readonly LogEntry[], origin: LiftOrigin): LogEntry | null => {
  const e = log.find((x) => x.n === origin.stage);
  return e && e.act === 'lift' && e.shape === origin.shapeId ? e : null;
};

/** what moved on the seed since this lift — null when nothing did, when the seed is not in the universe, or when the log is not the lift's */
export function sinceLiftOf(log: readonly LogEntry[], origin: LiftOrigin, seed: Shape | null): SinceLift | null {
  if (!seed || seed.id !== origin.shapeId || !liftEntryOf(log, origin)) return null;
  const label = (v: VertexId): string => { const raw = seed.vertices[v]?.data.label; return typeof raw === 'string' && raw.trim() !== '' ? raw.trim() : 'unnamed'; };
  const name = (corner: VertexId, id: string): string => termWordsOf(seed, corner, id, {});
  const edgeOf = (id: string, corners?: VertexId[]) => seed.edges.find((e) => e.id === id) ?? (corners && corners.length === 2 ? seed.edges.find((e) => corners.every((c) => e.vertexIds.includes(c))) : undefined);
  const faceOf = (id: string, corners?: VertexId[]) => seed.faces.find((f) => f.id === id) ?? (corners ? seed.faces.find((f) => f.vertexIds.length === corners.length && corners.every((c) => f.vertexIds.includes(c))) : undefined);
  const edgePlace = (a: VertexId, b: VertexId): string => `on ${edgeNameOf(label(a), label(b))}`; // the designer's 23:20 (2)
  const facePlace = (faceId: string, corners: readonly VertexId[]): string => `at ${faceDesignationOf(seed, faceId) ?? corners.map(label).join('·')}`;
  const sitePlace = (v: VertexId): string => `at ${label(v)}`;
  const relatingWords = (a: VertexId, b: VertexId, r: Relating): string => {
    if (r[0] === IS) return `${name(a, r[1])} ≡ ${name(b, r[2])}`;
    const s = dirOf(r) === AGAINST ? `${name(b, r[2])} ${r[0]} ${name(a, r[1])}` : `${name(a, r[1])} ${r[0]} ${name(b, r[2])}`;
    return r[3] === '-' ? `${s} · barred` : s;
  };
  // the latest state of each item acted on since the lift: added (in its kind) or removed (withdrawn)
  const latest = new Map<string, { added: boolean; kind: SinceKind; place: string; words: string }>();
  const put = (key: string, added: boolean, kind: SinceKind, place: string, words: string): void => { latest.delete(key); latest.set(key, { added, kind, place, words }); };
  const relKey = (r: Relating): string => `${r[0]}|${r[1]}|${r[2]}|${dirOf(r)}`;
  for (const e of log) {
    if (e.n <= origin.stage) continue;
    switch (e.act) {
      case 'relate': {
        const edge = edgeOf(e.edge, e.corners); if (!edge) break;
        const [a, b] = edge.vertexIds as [VertexId, VertexId]; const place = edgePlace(a, b);
        for (const r of e.removed) put(`rel|${edge.id}|${relKey(r)}`, false, r[3] === '-' ? 'bar' : 'relating', place, relatingWords(a, b, r));
        for (const r of e.added) put(`rel|${edge.id}|${relKey(r)}`, true, r[3] === '-' ? 'bar' : 'relating', place, relatingWords(a, b, r));
        break;
      }
      case 'pair': {
        const edge = edgeOf(e.edge, e.corners); if (!edge) break;
        const [a, b] = edge.vertexIds as [VertexId, VertexId]; const place = edgePlace(a, b);
        for (const [x, y] of e.roles.removed) put(`pair|${edge.id}|${x}|${y}`, false, 'pair', place, `${name(a, x)} ≡ ${name(b, y)}`);
        for (const [x, y] of e.roles.added) put(`pair|${edge.id}|${x}|${y}`, true, 'pair', place, `${name(a, x)} ≡ ${name(b, y)}`);
        for (const [s, t] of e.types.removed) put(`word|${edge.id}|${s}|${t}`, false, 'word pair', place, `${s} ≡ ${t}`);
        for (const [s, t] of e.types.added) put(`word|${edge.id}|${s}|${t}`, true, 'word pair', place, `${s} ≡ ${t}`);
        break;
      }
      case 'say': {
        const face = faceOf(e.face, e.corners); if (!face) break;
        const place = facePlace(face.id, face.vertexIds);
        const words = (v: LogEntry & { act: 'say' } extends infer _ ? (typeof e.added)[number] : never): string => {
          const cx = face.vertexIds[v.base[0]]; const cy = face.vertexIds[v.base[1]];
          if (v.verdict !== 'composed' || !v.w3) return `${name(cx, v.x)} · ${name(cy, v.y)} comes to nothing`;
          return v.w3dir === AGAINST ? `${name(cy, v.y)} ${v.w3} ${name(cx, v.x)}` : `${name(cx, v.x)} ${v.w3} ${name(cy, v.y)}`;
        };
        const key = (v: (typeof e.added)[number]): string => `say|${face.id}|${v.x}|${v.w}|${v.z}|${v.w2}|${v.y}|${(v.dirs ?? []).join('')}|${v.S ?? ''}|${v.z2 ?? ''}`;
        for (const v of e.removed) put(key(v), false, 'decision', place, words(v));
        for (const v of e.added) put(key(v), true, 'decision', place, words(v));
        break;
      }
      case 'altitude': {
        const face = faceOf(e.face, e.corners); if (!face) break;
        const place = `in ${label(e.apex)}'s light ${facePlace(face.id, face.vertexIds)}`;
        const words = (s: (typeof e.added)[number]): string => {
          if (s[0] === 'say') { const end = face.vertexIds[s[3]]; const t = `${name(e.apex, s[1])} ${s[2]} ${end ? name(end, s[4]) : s[4]}`; return s[5] === '-' ? `${t} · barred` : t; }
          const end = face.vertexIds[s[1]];
          const t = `about the bond ${name(e.apex, s[4])} ${s[3]} ${name(e.apex, s[5])} at ${end ? name(end, s[2]) : s[2]}`;
          return s[6] === '-' ? `${t} · barred` : t;
        };
        for (const s of e.removed) put(`alt|${face.id}|${e.apex}|${JSON.stringify(s.slice(0, 6))}`, false, 'saying', place, words(s));
        for (const s of e.added) put(`alt|${face.id}|${e.apex}|${JSON.stringify(s.slice(0, 6))}`, true, 'saying', place, words(s));
        break;
      }
      case 'triad': {
        const face = faceOf(e.face, e.corners); if (!face) break;
        const place = facePlace(face.id, face.vertexIds);
        for (const t of e.removed) put(`triad|${face.id}|${JSON.stringify(t)}`, false, 'triad', place, `a triad (${e.kind})`);
        for (const t of e.added) put(`triad|${face.id}|${JSON.stringify(t)}`, true, 'triad', place, `a triad (${e.kind})`);
        break;
      }
      case 'loopsay': {
        if (e.shape !== origin.shapeId) break;
        const key = `loop|${e.site}|${e.route ?? `${e.loop}|${e.start}|${e.way}`}`;
        if (e.answer === null) put(key, false, 'answer', sitePlace(e.site), 'an answer on a way of a loop');
        else put(key, true, 'answer', sitePlace(e.site), `a way of a loop comes to ${e.answer === 0 ? 'nothing' : e.answer}`);
        break;
      }
      case 'name': {
        if (!seed.vertices[e.vertex]) break;
        const given = e.label.trim().length > 0;
        put(`name|${e.vertex}`, given, 'name', sitePlace(e.vertex), given ? `the name “${e.label.trim()}”` : `the name “${e.was.trim()}”`);
        break;
      }
      case 'rolename': {
        if (e.shape !== origin.shapeId) break;
        const given = e.name.trim().length > 0;
        put(`rolename|${e.site}|${e.role}`, given, 'name', sitePlace(e.site), given ? `the name “${e.name.trim()}” for a role` : `the name “${e.was.trim()}” for a role`);
        break;
      }
      case 'relname': {
        if (e.shape !== origin.shapeId) break;
        const given = e.name.trim().length > 0;
        put(`relname|${e.site}|${e.loop}`, given, 'name', sitePlace(e.site), given ? `the name “${e.name.trim()}” for a relation` : `the name “${e.was.trim()}” for a relation`);
        break;
      }
      default:
        break; // a rule, a converse, a mode, a bond rule, a loop rule, a lift: not an act on the seed's record
    }
  }
  const items: SinceItem[] = [...latest.values()].map((v) => ({ kind: v.added ? v.kind : 'withdrawn', place: v.place, words: v.words }));
  if (items.length === 0) return null;
  const counts = new Map<SinceKind, Map<string, number>>();
  for (const it of items) { const byPlace = counts.get(it.kind) ?? new Map<string, number>(); byPlace.set(it.place, (byPlace.get(it.place) ?? 0) + 1); counts.set(it.kind, byPlace); }
  const line = `since this lift, on the seed: ${KIND_ORDER.filter((k) => counts.has(k)).map((k) => kindWords(k, counts.get(k) as Map<string, number>)).join(' · ')}`;
  const list = items.map((it) => (it.kind === 'withdrawn' ? `withdrawn ${it.place}: ${it.words}` : `${it.place}: ${it.words}`));
  return { items, line, list };
}
