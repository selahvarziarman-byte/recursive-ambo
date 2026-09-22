// ═══ THE MIDPOINT, after the ambo — `STAMP C-7b`, 2026-09-22 (Δ81: BOTH opposite
// vertices; the designer's layout and gestures, ratified §110.2; the MARKER on
// its inputs — the presenter's TRACE consumed, never re-derived). The connection
// layer's surface on an ambo site: the two incident faces UNFOLDED about the
// shared edge — one projection vertex above, `A–B` between with the midpoint on
// it, the other below; the tetrahedron opened along `A–B`, so the picture is the
// solid's own trace and both projection vertices are equally near, neither main.
//
// THE DEVICE SAYS FOUR THINGS (§107.2): the FORM (what a mapping must be) · the
// RECORD (each cast shown whole; the opposite vertices' casts beside the
// parents, WHOLE and UNPROCESSED — the device computes NOTHING with them) · the
// REFUSAL (by name, at the act, with BOTH withdrawals) · the TRACE of the
// person's act (description, never a score). ⛔ NEVER a candidate, a weight, a
// ranking, a proposal, a hint (no same-name highlight, no similarity sort, no
// proximity — the caster's order stands on both sides), a trace of a map not
// made, or two traces side by side.
//
//   POINTING     a point in this cast's column, then a point in that cast's — the
//                pair is drawn as a LINE ACROSS THE FOLD marked `yours` with
//                `withdraw`; a word to a word the same way between the two word
//                rows. The record's own orientation: this cast is the edge's first
//                corner, that cast its second.
//   THE REFUSAL  at the act, where the pair was made: every offending tuple with
//                BOTH values and BOTH parents named — and it OFFERS EVERY
//                WITHDRAWAL the conflict rests on (the attempt · each prior pair ·
//                the word pair), a two-handed control, never an error message
//                deciding which half was wrong; nothing is glued.
//   THE INSIDE   the unfolded layout IS the midpoint's inside: `from A` and
//                `from B` stated BY POSITION, and only `both` gets a glyph (`≡`,
//                amber) — marking all three would mark the ordinary twice.
//   THE TRACE    per glued role — the tuples now about it both · from A · from B,
//                the mold's value with its witnesses; per parent — what it brought
//                that the other did not confirm, with PER-PARENT DENOMINATORS
//                (`A: 11 of its 14 roles met no partner`); the parent→child lines
//                are NEVER bare — the residual IS the relation, minted with the
//                line.
//   THE STATES   no cast on a parent → NO SURFACE (a true absence; the corner's own
//                inside stands instead when it holds one); no pair given yet → the
//                two columns apart, no line across the fold, said in those words
//                (never *nothing identified*); given; refused at the act; a record
//                that contradicts itself (a pair the retired register let through)
//                → named, with its withdrawals.
// Pure over its props — the store is reached only to act (a zustand hook under a
// server render reads the initial state; the witness passes the record as props).

import { useMemo, useState } from 'react';
import type { ConceptSpace, Edge, EdgeIdentification, Shape, VertexId } from '../types/geometry';
import { useGeometryStore, type MidpointRefusal } from '../store/geometryStore';
import { buildGeneralSitePacketPresenterReport, type GeneralSitePacketTrace } from '../lib/generalSitePacketPresenterV0';
import { composeCornerCycleName } from '../lib/cornerCycleName';
import { insideOf, type Inside } from '../lib/castInside';
import { glue, traceOf, type Midpoint, type ParentTrace, type Side } from '../lib/midpointGlue';
import { type Conflict } from '../lib/jRegister';
import { CastInsideDiagram, CastInsidePanel, InsideColumn, insideGeometry, type MarkExtra } from './CastInsideDiagram';

export interface ProjectionSource {
  faceName: string; // composed from the face's corners (D14)
  apexes: VertexId[]; // the face's corners other than the two parents
}

export interface MidpointSite {
  siteId: VertexId;
  edge: Edge; // the source edge in the CURRENT shape — the edge between the two parents (the record's home)
  a: VertexId; // the edge's first corner — `this cast`
  b: VertexId; // its second — `that cast`
  hostCellId: string;
  sources: ProjectionSource[]; // the faces of the host incident to the edge, each with its apexes — the projection sources
}

/**
 * THE MIDPOINT'S STRUCTURAL INPUTS — the presenter's TRACE consumed (parents · host · complement), never re-derived;
 * the two faces incident to the edge read from the host it names (on the tetrahedron their apexes ARE the
 * presenter's complement; on a later generation's octahedral host the complement is four and the incident faces
 * have two apexes among them — the unfolding needs the faces, which the trace does not carry).
 */
export function midpointSiteOf(shape: Shape, siteId: VertexId, trace: GeneralSitePacketTrace | null): MidpointSite | null {
  if (!trace) return null;
  const [p, q] = trace.parentIds;
  const edge = shape.edges.find((e) => (e.vertexIds[0] === p && e.vertexIds[1] === q) || (e.vertexIds[0] === q && e.vertexIds[1] === p));
  if (!edge) return null;
  const host = shape.cells.find((c) => c.id === trace.hostCellId);
  const faces = host ? shape.faces.filter((f) => host.faceIds.includes(f.id) && f.vertexIds.includes(p) && f.vertexIds.includes(q)) : [];
  const sources = faces.map((f) => ({
    faceName: composeCornerCycleName(f.vertexIds.map((v) => shape.vertices[v]?.data.label ?? null)) ?? f.vertexIds.map((v) => labelOf(shape, v)).join(''),
    apexes: f.vertexIds.filter((v) => v !== p && v !== q),
  }));
  return { siteId, edge, a: edge.vertexIds[0], b: edge.vertexIds[1], hostCellId: trace.hostCellId, sources };
}

export const labelOf = (shape: Shape, id: VertexId): string => {
  const label = shape.vertices[id]?.data.label ?? '';
  return label.trim() ? label : 'unnamed';
};

/** a conflict in the person's words — both values, both parents named */
export const conflictWords = (c: Conflict, la: string, lb: string): string => {
  if (c.arity === 1) {
    const yKey = c.yType === c.type ? '' : `${c.yType}: `;
    return `${c.type}: ${c.xTerms[0]} ${c.xValue} in ${la} · ${yKey}${c.yTerms[0]} ${c.yValue} in ${lb}`;
  }
  return `${c.type}(${c.xTerms.join(', ')}) ${c.xValue} in ${la} · ${c.yType}(${c.yTerms.join(', ')}) ${c.yValue} in ${lb}`;
};

/** the residual a parent still holds alone — the label of the parent→child line, never bare */
export const residualWords = (t: ParentTrace, label: string, other: string): string =>
  `${label}: ${t.unmatched} of its ${t.roles} roles met no partner · ${t.onUnmatched} ${t.onUnmatched === 1 ? 'tuple' : 'tuples'} on them · ${t.untranslatedOnMapped} on mapped roles in words not translated · ${t.exposed} in translated words ${other} has unrecorded`;

/** the acts a refusal rests on — the attempt, then each prior act the conflicts name; every one withdrawable */
export function actsOfRefusal(refusal: MidpointRefusal, roles: EdgeIdentification['roles'], types: EdgeIdentification['types']): Array<{ kind: 'role' | 'word'; pair: [string, string]; attempt: boolean }> {
  const acts: Array<{ kind: 'role' | 'word'; pair: [string, string]; attempt: boolean }> = [{ ...refusal.act, attempt: true }];
  const seen = new Set([`${refusal.act.kind}|${refusal.act.pair.join('↦')}`]);
  const add = (kind: 'role' | 'word', pair: [string, string]): void => {
    const k = `${kind}|${pair.join('↦')}`;
    if (seen.has(k)) return;
    seen.add(k);
    acts.push({ kind, pair, attempt: false });
  };
  for (const c of refusal.conflicts) {
    for (const x of c.xTerms) {
      const y = roles.find(([a]) => a === x)?.[1];
      if (y !== undefined) add('role', [x, y]);
    }
    if (c.arity >= 2 || c.type !== c.yType) {
      if (types.some(([s, t]) => s === c.type && t === c.yType)) add('word', [c.type, c.yType]);
    }
  }
  if (refusal.form) {
    // a refusal of the FORM names the prior act it collides with
    const m = refusal.form.match(/^(.+?) is already (?:paired with|translated to|the translation of) (.+?) —/);
    if (m) {
      if (refusal.act.kind === 'role') {
        const prior = roles.find(([a, b]) => (a === m[1] && b === m[2]) || (b === m[1] && a === m[2]));
        if (prior) add('role', prior);
      } else {
        const prior = types.find(([a, b]) => (a === m[1] && b === m[2]) || (b === m[1] && a === m[2]));
        if (prior) add('word', prior);
      }
    }
  }
  return acts;
}

const FOLD = 150;
const TOP = 26;

/** THE SURFACE — the unfolded midpoint, pure over its props */
export function MidpointSurface({ shape, site, castA, castB, tauDraft, refusal }: {
  shape: Shape;
  site: MidpointSite;
  castA: ConceptSpace;
  castB: ConceptSpace;
  tauDraft: EdgeIdentification['types'];
  refusal: MidpointRefusal | null;
}) {
  const giveRolePair = useGeometryStore((s) => s.giveRolePair);
  const giveWordPair = useGeometryStore((s) => s.giveWordPair);
  const withdrawRolePair = useGeometryStore((s) => s.withdrawRolePair);
  const withdrawWordPair = useGeometryStore((s) => s.withdrawWordPair);
  const withdrawMidpointAttempt = useGeometryStore((s) => s.withdrawMidpointAttempt);
  const record = site.edge.identification;
  const roles = useMemo(() => (record ? record.roles : []), [record]);
  const types = useMemo(() => (record ? record.types : tauDraft), [record, tauDraft]);
  const result = useMemo(() => glue(castA, castB, roles, types), [castA, castB, roles, types]);
  const M: Midpoint | null = result.refused ? null : result.midpoint;
  const trace = useMemo(() => (M ? traceOf(castA, castB, M) : null), [castA, castB, M]);
  const insideA = useMemo(() => insideOf(castA), [castA]);
  const insideB = useMemo(() => insideOf(castB), [castB]);
  const [pick, setPick] = useState<{ side: Side; role: string } | null>(null);
  const [wordPick, setWordPick] = useState<{ side: Side; word: string } | null>(null);
  const la = labelOf(shape, site.a);
  const lb = labelOf(shape, site.b);
  const lm = labelOf(shape, site.siteId);
  const edgeId = site.edge.id;

  // the geometry: two columns in one drawing, the fold between them
  const g0A = useMemo(() => insideGeometry(insideA, { top: TOP }), [insideA]);
  const g0B = useMemo(() => insideGeometry(insideB, { top: TOP }), [insideB]);
  const gA = useMemo(() => insideGeometry(insideA, { top: TOP, px: g0A.leftReach + 8 }), [insideA, g0A]);
  const gB = useMemo(() => insideGeometry(insideB, { top: TOP, px: g0A.leftReach + 8 + g0A.rightReach + FOLD + g0B.leftReach }), [insideB, g0A, g0B]);
  const foldX = gA.px + g0A.rightReach + FOLD / 2;
  const width = gB.px + g0B.rightReach + 8;
  const columnsBottom = Math.max(gA.top + gA.height, gB.top + gB.height);
  const height = columnsBottom + 64;
  const mY = columnsBottom + 30;

  const onPoint = (side: Side, role: string): void => {
    if (pick && pick.side === side && pick.role === role) {
      setPick(null);
      return;
    }
    if (pick && pick.side !== side) {
      if (side === 'B') giveRolePair(edgeId, pick.role, role);
      else giveRolePair(edgeId, role, pick.role);
      setPick(null);
      return;
    }
    setPick({ side, role });
  };
  const onWord = (side: Side, word: string): void => {
    if (wordPick && wordPick.side === side && wordPick.word === word) {
      setWordPick(null);
      return;
    }
    if (wordPick && wordPick.side !== side) {
      if (side === 'B') giveWordPair(edgeId, wordPick.word, word);
      else giveWordPair(edgeId, word, wordPick.word);
      setWordPick(null);
      return;
    }
    setWordPick({ side, word });
  };
  const bothExtra = (side: Side, inside: Inside) => {
    const origin = (type: string, terms: string[]): MarkExtra | null => (M?.originOf[side].get(`${type}|${JSON.stringify(terms)}`) === 'both' ? { emphasis: true, glyph: '≡', attrs: { 'data-midpoint-both': side } } : null);
    return {
      arc: (arc: { type: string; from: number; to: number }) => origin(arc.type, [inside.points[arc.from].id, inside.points[arc.to].id]),
      loop: (loop: { type: string; at: number }) => origin(loop.type, [inside.points[loop.at].id, inside.points[loop.at].id]),
      node: (node: { type: string; legs: number[] }) => origin(node.type, node.legs.map((i) => inside.points[i].id)),
    };
  };
  const extraA = bothExtra('A', insideA);
  const extraB = bothExtra('B', insideB);
  const pairedA = new Set(roles.map(([x]) => x));
  const pairedB = new Set(roles.map(([, y]) => y));
  const pointExtra = (side: Side) => (point: { id: string }) => ({
    onClick: () => onPoint(side, point.id),
    emphasis: (pick !== null && pick.side === side && pick.role === point.id) || (side === 'A' ? pairedA.has(point.id) : pairedB.has(point.id)),
    attrs: {
      'data-midpoint-side': side,
      ...(pick && pick.side === side && pick.role === point.id ? { 'data-midpoint-picked': 'true' } : {}),
      ...((side === 'A' ? pairedA.has(point.id) : pairedB.has(point.id)) ? { 'data-midpoint-paired': 'true' } : {}),
    },
  });
  // the pairs drawn across the fold; a pair naming a role a cast does not hold is named, never erased
  const lines = roles.map(([x, y]) => ({ x, y, iA: insideA.points.findIndex((p) => p.id === x), iB: insideB.points.findIndex((p) => p.id === y) }));
  const acts = refusal ? actsOfRefusal(refusal, roles, types) : [];
  const state = result.refused ? 'record-in-conflict' : roles.length === 0 && types.length === 0 ? 'unglued' : 'glued';
  const withdrawAct = (kind: 'role' | 'word', pair: [string, string]): void => {
    if (kind === 'role') withdrawRolePair(edgeId, pair[0], pair[1]);
    else withdrawWordPair(edgeId, pair[0], pair[1]);
  };
  const disjoint = useMemo(() => (M && state === 'unglued' ? M.counts : null), [M, state]);

  return (
    <div
      data-midpoint-surface={site.siteId}
      data-midpoint-state={state}
      className="pointer-events-auto absolute bottom-20 left-3 right-3 top-14 overflow-auto rounded border border-stone-800 bg-stone-950/90 px-3 py-2 text-xs text-stone-300 shadow-lg"
    >
      <div className="mb-1">
        <span className="text-stone-100">{lm}</span>
        {` · the midpoint between `}
        <span className="text-stone-100">{la}</span>
        {` and `}
        <span className="text-stone-100">{lb}</span>
        {` — the two faces unfolded about their edge`}
      </div>
      {/* the projection source ABOVE — shown whole, as record; the device computes nothing with it */}
      {site.sources[0] ? <ProjectionRecord shape={shape} source={site.sources[0]} position="above" /> : null}
      <div data-midpoint-sentence="true" className="my-1 text-stone-400">
        {state === 'unglued' && disjoint
          ? `no pair given yet — ${la} and ${lb} stand apart: ${disjoint.roles} roles · ${disjoint.words} words · ${disjoint.tuples} tuples · ${disjoint.marks} marks`
          : state === 'glued'
            ? `${roles.length} ${roles.length === 1 ? 'role pair' : 'role pairs'} · ${types.length} ${types.length === 1 ? 'word pair' : 'word pairs'} — yours`
            : `the record on this edge contradicts itself — a pair given before this surface; withdraw a half`}
        {pick ? <span data-midpoint-pick={`${pick.side}|${pick.role}`} className="ml-2 text-amber-200">{`${pick.role} in ${pick.side === 'A' ? la : lb} chosen — now a point in ${pick.side === 'A' ? lb : la}`}</span> : null}
        {wordPick ? <span data-midpoint-word-pick={`${wordPick.side}|${wordPick.word}`} className="ml-2 text-amber-200">{`${wordPick.word} in ${wordPick.side === 'A' ? la : lb} chosen — now a word in ${wordPick.side === 'A' ? lb : la}`}</span> : null}
      </div>
      <div className="overflow-x-auto">
        <svg data-midpoint-drawing="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block overflow-visible">
          <text x={gA.px} y={14} textAnchor="middle" fontSize={11} className="fill-stone-100">{la}</text>
          <text x={gB.px} y={14} textAnchor="middle" fontSize={11} className="fill-stone-100">{lb}</text>
          <line x1={foldX} y1={TOP} x2={foldX} y2={columnsBottom} className="stroke-stone-800" strokeDasharray="2 4" />
          <InsideColumn inside={insideA} geometry={gA} idPrefix={`m-${site.siteId}-a`} arcExtra={extraA.arc} loopExtra={extraA.loop} nodeExtra={extraA.node} pointExtra={pointExtra('A')} />
          <InsideColumn inside={insideB} geometry={gB} idPrefix={`m-${site.siteId}-b`} arcExtra={extraB.arc} loopExtra={extraB.loop} nodeExtra={extraB.node} pointExtra={pointExtra('B')} />
          {lines.map((l) =>
            l.iA >= 0 && l.iB >= 0 ? (
              <g key={`${l.x}|${l.y}`} data-midpoint-line={`${l.x}↦${l.y}`}>
                <line x1={gA.px} y1={gA.yOf(l.iA)} x2={gB.px} y2={gB.yOf(l.iB)} className="stroke-amber-300/90" strokeWidth={1.6} />
                <text x={foldX} y={(gA.yOf(l.iA) + gB.yOf(l.iB)) / 2 - 4} textAnchor="middle" fontSize={10} className="fill-amber-200">
                  <tspan>{`${l.x} ↦ ${l.y} · yours · `}</tspan>
                  <tspan data-midpoint-withdraw={`role|${l.x}|${l.y}`} className="cursor-pointer fill-stone-300 underline" onClick={() => withdrawRolePair(edgeId, l.x, l.y)}>withdraw</tspan>
                </text>
              </g>
            ) : null,
          )}
          {/* the REFUSED pair, where it was made: a dashed line across the fold marked `refused` (found at the eye: the box alone sat below the word rows, a scroll away from the act) */}
          {refusal && refusal.act.kind === 'role' && (() => {
            const [x, y] = refusal.act.pair;
            const iA = insideA.points.findIndex((pt) => pt.id === x);
            const iB = insideB.points.findIndex((pt) => pt.id === y);
            if (iA < 0 || iB < 0) return null;
            return (
              <g data-midpoint-refused-line={`${x}↦${y}`}>
                <line x1={gA.px} y1={gA.yOf(iA)} x2={gB.px} y2={gB.yOf(iB)} className="stroke-rose-400/90" strokeWidth={1.6} strokeDasharray="5 4" />
                <text x={foldX} y={(gA.yOf(iA) + gB.yOf(iB)) / 2 - 4} textAnchor="middle" fontSize={10} className="fill-rose-300">{`${x} ↦ ${y} · refused — see below the drawing`}</text>
              </g>
            );
          })()}
          {/* the midpoint on the fold, and the parent→child lines — never bare: the residual rides each one */}
          <circle cx={foldX} cy={mY} r={5} className="fill-amber-300 stroke-amber-100" />
          <text x={foldX} y={mY + 18} textAnchor="middle" fontSize={11} className="fill-stone-100">{lm}</text>
          <line x1={gA.px} y1={columnsBottom + 4} x2={foldX - 8} y2={mY - 2} className="stroke-stone-600" />
          <line x1={gB.px} y1={columnsBottom + 4} x2={foldX + 8} y2={mY - 2} className="stroke-stone-600" />
        </svg>
      </div>
      {/* THE REFUSAL, at the act: the offending tuples by name, both values, both parents — and every withdrawal it rests on */}
      {refusal ? (
        <div data-midpoint-refusal={`${refusal.act.kind}|${refusal.act.pair[0]}|${refusal.act.pair[1]}`} className="mt-2 rounded border border-rose-900 bg-rose-950/30 px-2 py-1 text-rose-200">
          <span className="block">{`refused — ${refusal.act.pair[0]} ↦ ${refusal.act.pair[1]} (${refusal.act.kind === 'role' ? 'a role pair' : 'a word pair'}): nothing glued, the edge keeps its prior state`}</span>
          {refusal.form ? <span data-midpoint-refusal-form="true" className="block">{refusal.form}</span> : null}
          {refusal.conflicts.map((c, i) => (
            <span key={i} data-midpoint-conflict={conflictWords(c, la, lb)} className="block">{`in conflict: ${conflictWords(c, la, lb)}`}</span>
          ))}
          <span className="mt-1 block text-stone-300">
            {acts.map((act) => (
              <span key={`${act.kind}|${act.pair.join('|')}`} className="mr-3">
                <button
                  type="button"
                  data-midpoint-withdraw={act.attempt ? `attempt|${act.pair[0]}|${act.pair[1]}` : `${act.kind}|${act.pair[0]}|${act.pair[1]}`}
                  data-midpoint-withdraw-attempt={act.attempt ? 'true' : undefined}
                  className="underline"
                  onClick={() => (act.attempt ? withdrawMidpointAttempt(edgeId) : withdrawAct(act.kind, act.pair))}
                >
                  {`withdraw ${act.pair[0]} ↦ ${act.pair[1]}${act.attempt ? ' (the act just made)' : ''}`}
                </button>
              </span>
            ))}
          </span>
        </div>
      ) : null}
      {trace ? (
        <div data-midpoint-residuals="true" className="mt-1 grid gap-0.5 text-stone-400">
          <span data-midpoint-parent-trace="A">{residualWords(trace.parents[0], la, lb)}</span>
          <span data-midpoint-parent-trace="B">{residualWords(trace.parents[1], lb, la)}</span>
        </div>
      ) : null}
      {/* the pairs named in words with their withdrawals, and a pair naming a role a cast does not hold — marked, never erased */}
      {lines.some((l) => l.iA < 0 || l.iB < 0) ? (
        <div className="mt-1 text-amber-200">
          {lines.filter((l) => l.iA < 0 || l.iB < 0).map((l) => (
            <span key={`${l.x}|${l.y}`} data-midpoint-unheld={`${l.x}↦${l.y}`} className="mr-3">
              {`${l.x} ↦ ${l.y} names a role a cast does not hold · `}
              <button type="button" data-midpoint-withdraw={`role|${l.x}|${l.y}`} className="underline" onClick={() => withdrawRolePair(edgeId, l.x, l.y)}>withdraw</button>
            </span>
          ))}
        </div>
      ) : null}
      {/* the words: this cast's row, the pairs between, that cast's row — the caster's order on both sides, no hint */}
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3">
        <div data-midpoint-words="A" className="flex flex-wrap gap-1">
          <span className="mr-1 text-stone-500">{`${la}'s words`}</span>
          {insideA.words.map((w) => (
            <button key={w} type="button" data-midpoint-word={`A|${w}`} data-midpoint-word-translated={types.some(([s]) => s === w) ? 'true' : undefined} onClick={() => onWord('A', w)} className={`rounded border px-1 ${wordPick?.side === 'A' && wordPick.word === w ? 'border-amber-300 text-amber-200' : types.some(([s]) => s === w) ? 'border-amber-700 text-amber-200' : 'border-stone-800 text-stone-300'}`}>{w}</button>
          ))}
        </div>
        <div data-midpoint-word-pairs="true" className="grid gap-0.5 text-amber-200">
          {types.length ? types.map(([s, t]) => (
            <span key={`${s}|${t}`} data-midpoint-word-pair={`${s}↦${t}`}>
              {`${s} ↦ ${t} · yours · `}
              <button type="button" data-midpoint-withdraw={`word|${s}|${t}`} className="underline" onClick={() => withdrawWordPair(edgeId, s, t)}>withdraw</button>
            </span>
          )) : <span className="text-stone-500">no word translated — every word foreign to the other side, alike spellings included</span>}
        </div>
        <div data-midpoint-words="B" className="flex flex-wrap gap-1">
          <span className="mr-1 text-stone-500">{`${lb}'s words`}</span>
          {insideB.words.map((w) => (
            <button key={w} type="button" data-midpoint-word={`B|${w}`} data-midpoint-word-translated={types.some(([, t]) => t === w) ? 'true' : undefined} onClick={() => onWord('B', w)} className={`rounded border px-1 ${wordPick?.side === 'B' && wordPick.word === w ? 'border-amber-300 text-amber-200' : types.some(([, t]) => t === w) ? 'border-amber-700 text-amber-200' : 'border-stone-800 text-stone-300'}`}>{w}</button>
          ))}
        </div>
      </div>
      {result.refused ? (
        <div data-midpoint-record-conflict="true" className="mt-2 rounded border border-rose-900 bg-rose-950/30 px-2 py-1 text-rose-200">
          {result.conflicts.map((c, i) => (
            <span key={i} data-midpoint-conflict={conflictWords(c, la, lb)} className="block">{`in conflict: ${conflictWords(c, la, lb)}`}</span>
          ))}
          <span className="mt-1 block text-stone-300">
            {roles.map(([x, y]) => (
              <span key={`${x}|${y}`} className="mr-3">
                <button type="button" data-midpoint-withdraw={`role|${x}|${y}`} className="underline" onClick={() => withdrawRolePair(edgeId, x, y)}>{`withdraw ${x} ↦ ${y}`}</button>
              </span>
            ))}
            {types.map(([s, t]) => (
              <span key={`${s}|${t}`} className="mr-3">
                <button type="button" data-midpoint-withdraw={`word|${s}|${t}`} className="underline" onClick={() => withdrawWordPair(edgeId, s, t)}>{`withdraw ${s} ↦ ${t}`}</button>
              </span>
            ))}
          </span>
        </div>
      ) : null}
      {/* THE TRACE — the origin partition of the one glued record, as description */}
      {M && trace && state === 'glued' ? (
        <div data-midpoint-trace="true" className="mt-2 grid gap-0.5 text-stone-300">
          <span data-midpoint-counts="true">{`${lm}: ${M.counts.roles} roles (${castA.roles.length} + ${castB.roles.length} − ${M.pairs.length}) · ${M.counts.words} words · ${M.counts.tuples} tuples (${M.counts.both} both) · ${M.counts.marks} marks`}</span>
          <span data-midpoint-core="true" className="text-stone-400">{`what both confirm: ${M.core.roles} ${M.core.roles === 1 ? 'role' : 'roles'} · ${M.core.tuples} ${M.core.tuples === 1 ? 'tuple' : 'tuples'} · ${M.core.marks} ${M.core.marks === 1 ? 'mark' : 'marks'}`}</span>
          {trace.glued.map((r) => (
            <span key={r.key} data-midpoint-role-trace={r.key}>
              {`${r.a} ≡ ${r.b} · ${r.about} ${r.about === 1 ? 'tuple' : 'tuples'} about it: both ${r.both} · ${la} ${r.fromA} · ${lb} ${r.fromB}`}
              {r.mark ? ` · ${r.mark.type} ${r.mark.value} (${r.mark.witnesses.map((w) => (w === 'A' ? la : lb)).join(', ')})` : ''}
            </span>
          ))}
        </div>
      ) : null}
      {/* the projection source BELOW */}
      {site.sources[1] ? <ProjectionRecord shape={shape} source={site.sources[1]} position="below" /> : null}
      {site.sources.slice(2).map((s) => <ProjectionRecord key={s.faceName} shape={shape} source={s} position="below" />)}
    </div>
  );
}

/** an opposite vertex through its face — the cast shown WHOLE, as record; the device computes nothing with it */
function ProjectionRecord({ shape, source, position }: { shape: Shape; source: ProjectionSource; position: 'above' | 'below' }) {
  return (
    <div data-midpoint-source={position} data-midpoint-face={source.faceName} className={`${position === 'above' ? 'mb-1 border-b' : 'mt-2 border-t'} border-stone-800 py-1`}>
      {source.apexes.map((apex) => {
        const cast = shape.vertices[apex]?.data.cast;
        const label = labelOf(shape, apex);
        return (
          <div key={apex} data-midpoint-apex={apex} className="grid gap-0.5">
            <span className="text-stone-400">
              <span className="text-stone-100">{label}</span>
              {` · through face ${source.faceName} · `}
              {cast ? 'the cast it holds, whole' : 'holds no cast'}
            </span>
            {cast ? cast.roles.length ? <CastInsideDiagram inside={insideOf(cast)} compact id={`source-${apex}`} /> : <span className="text-stone-500">a cast of nothing — no roles</span> : null}
          </div>
        );
      })}
    </div>
  );
}

/**
 * THE CONCEPT LAYER ON THE CANVAS — for the selected vertex: an ambo site whose parents BOTH hold a cast shows the
 * midpoint's unfolding; any other vertex shows its own inside (or nothing). The store is read here and passed down.
 */
export function ConceptSurface({ shape, vertexId }: { shape: Shape; vertexId: VertexId }) {
  const tauDrafts = useGeometryStore((s) => s.edgeTauDrafts);
  const refusals = useGeometryStore((s) => s.midpointRefusals);
  const report = useMemo(() => buildGeneralSitePacketPresenterReport(shape), [shape]);
  const packet = useMemo(() => report.packets.find((p) => p.trace.siteId === vertexId) ?? null, [report, vertexId]);
  const site = useMemo(() => midpointSiteOf(shape, vertexId, packet ? packet.trace : null), [shape, vertexId, packet]);
  const castA = site ? shape.vertices[site.a]?.data.cast : undefined;
  const castB = site ? shape.vertices[site.b]?.data.cast : undefined;
  if (site && castA && castB) {
    return <MidpointSurface shape={shape} site={site} castA={castA} castB={castB} tauDraft={tauDrafts[site.edge.id] ?? []} refusal={refusals[site.edge.id] ?? null} />;
  }
  return <CastInsidePanel shape={shape} vertexId={vertexId} />;
}
