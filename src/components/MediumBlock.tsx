// MediumBlock — STAMP MODES-1 · B5 (2026-09-26): THE MEDIUM IN THE DESIGNER'S WORDS (her letter of 17:15, ratified for meaning
// §207; the projection ruling D2–D11; ADR 0031 §9). Under the midpoint's own column: the medium between the two corners, its
// extent AS COUNTS, the person's modes and his relatings (his sentences), the passages through each opposite corner with his
// says and his rules, where each relating sits (theirs alone · the face's · only in a corner's light · against your bar),
// the one-line state with its count, the name kept with the state it was given under, and the device's own lights at a
// deeper generation. HER THREE RULES: Arman's grill words are kept and the researcher's coinages never printed (the D-names
// live in the record and in data attributes — never in text); his acts read with `you` as subject and the device's sorting as
// where a thing sits; a state is one line with a count, a description, never a grade. `≡` is IS and nothing else: the IS pairs
// keep their line above; every other mode prints as its word. Every line is the same weight; a light is never a control and
// never first in its block (Δ80). Nothing here glues, sorts or decides: the readers are B1–B4's, the words are hers.

import { useState } from 'react';
import type { Edge, Shape, VertexId } from '../types/geometry';
import { useGeometryStore } from '../store/geometryStore';
import { childSpaceOf } from '../lib/instanceSpace';
import { mediumOf, type DerivedLight } from '../lib/descent';
import { lexiconOf, IS, type Relating } from '../lib/relatings';
import { relKey, type ReadPath, type Sorting, type ViewSorting } from '../lib/sorting';
import { nameIn, type SpaceOfOptions } from '../lib/spaceOf';

export interface NamedUnder {
  relatings: number;
  own: string[];
}
export const NAMED_UNDER_KEY = 'namedUnder';

/** the state the name was given under, as the vertex's packet holds it (role keys and counts only; nothing else is read) */
export function namedUnderOf(shape: Shape, siteId: VertexId | null): NamedUnder | null {
  if (!siteId) return null;
  const raw = shape.vertices[siteId]?.data.custom?.[NAMED_UNDER_KEY];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const o = raw as { relatings?: unknown; own?: unknown };
  if (typeof o.relatings !== 'number' || !Array.isArray(o.own) || !o.own.every((k) => typeof k === 'string')) return null;
  return { relatings: o.relatings, own: [...(o.own as string[])] };
}

const join = (xs: string[]): string => xs.join(' · ');
const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;

export function MediumBlock({ shape, edge, siteId, la, lb, options, mode, setMode, bar, setBar }: { shape: Shape; edge: Edge; siteId: VertexId | null; la: string; lb: string; options: SpaceOfOptions; mode: string; setMode: (w: string) => void; bar: boolean; setBar: (b: boolean) => void }) {
  // the block SUBSCRIBES to these three (a change re-renders it) and reads their LIVE value from the store: react-dom/server
  // hands a hook the store's INITIAL snapshot, so a witness rendering under node would read `rules: []` while the store held a
  // rule (measured); the page and the witness now read the same state
  useGeometryStore((s) => s.lexicon);
  useGeometryStore((s) => s.rules);
  useGeometryStore((s) => s.relatingRefusals);
  const { lexicon, rules, relatingRefusals } = useGeometryStore.getState();
  const declareMode = useGeometryStore((s) => s.declareMode);
  const withdrawRelating = useGeometryStore((s) => s.withdrawRelating);
  const nameRule = useGeometryStore((s) => s.nameRule);
  const withdrawRule = useGeometryStore((s) => s.withdrawRule);
  const giveVerdict = useGeometryStore((s) => s.giveVerdict);
  const withdrawVerdict = useGeometryStore((s) => s.withdrawVerdict);
  const withdrawRelatingAttempt = useGeometryStore((s) => s.withdrawRelatingAttempt);
  const [newMode, setNewMode] = useState('');
  const [ruleWords, setRuleWords] = useState<Record<string, string>>({});

  const medium = mediumOf(shape, edge, options, rules);
  if (!medium || !medium.child || !medium.sorting) return null;
  const { child, sorting, lights } = medium;
  const [X, Y] = edge.vertexIds;
  const spaceX = childSpaceOf(shape, X, options);
  const spaceY = childSpaceOf(shape, Y, options);
  const labelOf = (v: VertexId): string => shape.vertices[v]?.data.label || v;
  const nameA = (id: string): string => (spaceX ? nameIn(spaceX, id) : id);
  const nameB = (id: string): string => (spaceY ? nameIn(spaceY, id) : id);
  const nameZ = (z: VertexId, id: string): string => { const sp = childSpaceOf(shape, z, options); return sp ? nameIn(sp, id) : id; };
  const words = lexiconOf(shape, lexicon);
  const rolesA = spaceX ? spaceX.roles.length : 0;
  const rolesB = spaceY ? spaceY.roles.length : 0;
  const sentence = (r: Relating | [string, string, string]): string => (r[0] === IS ? `${nameA(r[1])} ≡ ${nameB(r[2])}` : `${nameA(r[1])} ${r[0]} ${nameB(r[2])}`);
  const modeRelatings = child.instances.filter((i) => i.mode !== IS);
  const directsAt = (x: string, y: string): Relating[] => sorting.instances.filter((r) => r[1] === x && r[2] === y);
  const viewLabel = (v: ViewSorting): string => labelOf(v.view);
  const cornersWords = sorting.views.length === 0 ? '' : sorting.views.map(viewLabel).join(' or ');
  const passageWords = (p: ReadPath): string => `${nameA(p.path.x)} ${p.path.w} ${nameZ(p.path.view, p.path.z)} · ${nameZ(p.path.view, p.path.z)} ${p.path.w2} ${nameB(p.path.y)}`;
  const compositeWords = (p: ReadPath): string => `${nameA(p.path.x)} ${p.composite ?? '?'} ${nameB(p.path.y)}`;
  const readingWords = (p: ReadPath, lz: string): string => {
    if (p.reading === 'COMPOSED') return `the face's — said between them and through ${lz} too: ${compositeWords(p)}`;
    if (p.reading === 'LIGHT') return `only in ${lz}'s light — through ${lz} it would read: ${compositeWords(p)} — no relating between ${la} and ${lb} says so`;
    if (p.reading === 'TENSION') return `against your bar — through ${lz} it would say ${compositeWords(p)} — which you barred`;
    if (p.reading === 'NOT') return 'you said: that is not it';
    return 'not yet said';
  };
  const stateLine = (): string => {
    if (sorting.state === 'UNDETECTED') return `${la} and ${lb} together, as two — not yet looked into: nothing related between them yet`;
    if (sorting.state === 'POCKET') return `the views leave different things alone — ${sorting.views.map((v) => `through ${viewLabel(v)}, ${v.own.length ? sentence(sorting.instances.find((r) => relKey(r) === v.own[0]) as Relating) : 'nothing'} is theirs alone`).join('; ')} — nothing is theirs alone under both`;
    if (sorting.closed) return `all the face's — nothing theirs alone, nothing only in a corner's light`;
    if (sorting.state === 'EXHAUSTED') return `nothing theirs alone — all ${plural(sorting.instances.length, 'relating', 'relatings')} ${sorting.instances.length === 1 ? 'is' : 'are'} also said through ${cornersWords}`;
    if (sorting.coherent) return 'nothing against it — no bar pressed, no say differs, the views agree on what is theirs alone';
    return `${plural(sorting.own.length, 'relating', 'relatings')} theirs alone · ${plural(sorting.centroid.length, 'relating', 'relatings')} the face's`;
  };
  const named = namedUnderOf(shape, siteId);
  const siteName = siteId ? labelOf(siteId) : null;
  const left = named ? named.own.filter((k) => !sorting.own.includes(k)).length : 0;
  const entered = named ? sorting.own.filter((k) => !named.own.includes(k)).length : 0;
  const refusal = relatingRefusals[edge.id];
  const facePositions = (v: ViewSorting): [number, number] | null => {
    const f = shape.faces.find((x) => x.id === v.faceId);
    if (!f) return null;
    return [f.vertexIds.indexOf(X), f.vertexIds.indexOf(Y)];
  };
  const verdictRecord = (v: ViewSorting, p: ReadPath, verdict: 'composed' | 'not', w3: string) => {
    const base = facePositions(v);
    if (!base) return null;
    return { base, x: p.path.x, w: p.path.w, z: p.path.z, w2: p.path.w2, y: p.path.y, w3, verdict };
  };
  const derivedWords = (l: DerivedLight): string => `only in ${labelOf(l.through)}'s light: ${l.x} ~ ${l.y} — the device can see it through ${labelOf(l.through)}, nobody said it${l.held ? ' — and you related them' : ''}`;

  return (
    <div data-medium="true" data-medium-state={sorting.state} data-medium-coherent={String(sorting.coherent)} data-medium-closed={String(sorting.closed)} data-medium-rules={String(rules.length)} className="mt-2 grid gap-0.5 rounded border border-stone-800 bg-stone-950/60 px-2 py-1 text-stone-300">
      <span data-medium-head="true" className="text-stone-100">{`between ${la} and ${lb} — ${plural(words.length, 'mode', 'modes')} · ${rolesA} × ${rolesB} roles · ${words.length * rolesA * rolesB} could be related · ${sorting.instances.length} related · ${sorting.bars.length} barred`}</span>
      <span data-medium-modes="true" className="flex flex-wrap items-center gap-x-2">
        <span>your modes:</span>
        {words.map((w) => (
          <button key={w} type="button" data-medium-mode={w} data-medium-mode-chosen={w === mode ? 'true' : undefined} className={w === mode ? 'underline text-stone-100' : 'text-stone-300'} onClick={() => setMode(w)}>{w}</button>
        ))}
        <button type="button" data-medium-bar-toggle="true" data-medium-bar-on={bar ? 'true' : undefined} className={bar ? 'underline text-amber-200' : 'text-stone-400'} onClick={() => setBar(!bar)}>does not hold</button>
      </span>
      <span data-medium-gesture="true" className="text-stone-400">{`a relating — pick a point in ${la} and one in ${lb}; it reads "${la}'s point ${mode === IS ? '≡' : mode} ${lb}'s point"${bar ? ' — barred by you' : ''}`}</span>
      <span data-medium-mode-gesture="true" className="flex flex-wrap items-center gap-x-2">
        <span>a mode — your word for how they relate:</span>
        <input data-medium-mode-input="true" value={newMode} onChange={(e) => setNewMode(e.target.value)} placeholder="a new one" className="h-5 w-28 rounded border border-stone-700 bg-stone-900 px-1 text-xs text-stone-100" />
        <button type="button" data-medium-mode-declare="true" className="underline" onClick={() => { declareMode(newMode); setNewMode(''); }}>a new one</button>
      </span>
      {modeRelatings.length > 0 ? modeRelatings.map((i) => (
        <span key={i.key} data-medium-relating={`${i.mode}|${i.x}|${i.y}`}>
          {`${sentence([i.mode, i.x, i.y])} · `}
          <button type="button" data-medium-withdraw={`${i.mode}|${i.x}|${i.y}`} className="underline" onClick={() => withdrawRelating(edge.id, i.mode, i.x, i.y)}>withdraw</button>
        </span>
      )) : null}
      {sorting.bars.map((b) => (
        <span key={relKey(b)} data-medium-bar={relKey(b)}>
          {`barred by you: ${sentence(b)} · `}
          <button type="button" data-medium-withdraw={relKey(b)} className="underline" onClick={() => withdrawRelating(edge.id, b[0], b[1], b[2])}>withdraw</button>
        </span>
      ))}
      {refusal ? (
        <span data-medium-refusal="true" className="text-amber-200">
          {`${refusal.why} · `}
          <button type="button" data-medium-withdraw-attempt="true" className="underline" onClick={() => withdrawRelatingAttempt(edge.id)}>withdraw this attempt</button>
        </span>
      ) : null}
      <span data-medium-child="true">{`the concept between ${la} and ${lb} — made of your ${plural(child.instances.length, 'relating', 'relatings')}`}</span>
      {child.discordances.map((d) => (
        <span key={`${d.word}|${d.terms.join('|')}`} data-medium-differ="true">{`the two sides differ: ${d.word.replace('≡', ' ≡ ')} on ${d.terms.join(', ')} — ${d.viaA === 'holds' ? 'holds' : 'does not'} by ${la} · ${d.viaB === 'holds' ? 'holds' : 'does not'} by ${lb} — both kept`}</span>
      ))}
      {sorting.views.map((v) => {
        const lz = viewLabel(v);
        const pairsSeen = [...new Set(v.paths.map((p) => `${p.path.w}|${p.path.w2}`))];
        return (
          <div key={v.view} data-medium-view={lz} data-medium-view-vacuous={String(v.vacuous)} className="grid gap-0.5">
            <span data-medium-view-head="true" className="text-stone-100">{v.vacuous ? `${lz} — no passage yet: nothing related on ${la}–${lz} or ${lz}–${lb}` : `through ${lz}: ${plural(v.paths.length, 'passage', 'passages')}`}</span>
            {v.paths.map((p) => {
              const directs = directsAt(p.path.x, p.path.y);
              const w3 = p.composite ?? (directs[0] ? directs[0][0] : IS);
              return (
                <span key={`${p.path.x}|${p.path.w}|${p.path.z}|${p.path.w2}|${p.path.y}`} data-medium-passage={`${p.path.x}|${p.path.w}|${p.path.z}|${p.path.w2}|${p.path.y}`} data-medium-passage-reading={p.reading} data-medium-passage-by={p.by ?? undefined} className="flex flex-wrap gap-x-2">
                  <span>{`${passageWords(p)} — ${readingWords(p, lz)}`}</span>
                  {p.by === 'verdict' ? (
                    <>
                      <span data-medium-said="true">{p.reading === 'NOT' ? '' : `you said: that is "${compositeWords(p)}"`}</span>
                      {p.exception ? <span data-medium-exception="true">{`except here — you said this passage is "${p.composite ?? 'not it'}"`}</span> : null}
                      <button type="button" data-medium-say-withdraw="true" className="underline" onClick={() => { const r = verdictRecord(v, p, 'not', w3); if (r) withdrawVerdict(v.faceId, r); }}>withdraw what you said</button>
                    </>
                  ) : (
                    <>
                      <button type="button" data-medium-say={`composed|${w3}`} className="underline" onClick={() => { const r = verdictRecord(v, p, 'composed', w3); if (r) giveVerdict(v.faceId, r); }}>{`that is "${nameA(p.path.x)} ${w3} ${nameB(p.path.y)}"`}</button>
                      <button type="button" data-medium-say="not" className="underline" onClick={() => { const r = verdictRecord(v, p, 'not', w3); if (r) giveVerdict(v.faceId, r); }}>that is not it</button>
                    </>
                  )}
                </span>
              );
            })}
            {pairsSeen.map((pair) => {
              const [w, w2] = pair.split('|');
              const rule = rules.find((r) => r[0] === w && r[1] === w2);
              const builtIn = w === IS && w2 === IS;
              const exceptions = v.paths.filter((p) => p.path.w === w && p.path.w2 === w2 && p.exception).length;
              if (builtIn) return null;
              return rule ? (
                <span key={pair} data-medium-rule={`${w}|${w2}|${rule[2]}`}>
                  {`you named it: ${w}, then ${w2} = ${rule[2]} — your word for the two in a row; holds on every passage with those two${exceptions ? ` — yours, with ${plural(exceptions, 'exception', 'exceptions')}` : ''} · `}
                  <button type="button" data-medium-rule-withdraw={`${w}|${w2}`} className="underline" onClick={() => withdrawRule(w, w2)}>withdraw</button>
                </span>
              ) : (
                <span key={pair} data-medium-rule-gesture={`${w}|${w2}`} className="flex flex-wrap items-center gap-x-2">
                  <span>{`name the two in a row: ${w}, then ${w2} =`}</span>
                  <input data-medium-rule-input={`${w}|${w2}`} value={ruleWords[pair] ?? ''} onChange={(e) => setRuleWords({ ...ruleWords, [pair]: e.target.value })} placeholder="your word" className="h-5 w-24 rounded border border-stone-700 bg-stone-900 px-1 text-xs text-stone-100" />
                  <button type="button" data-medium-rule-name={`${w}|${w2}`} className="underline" onClick={() => { nameRule(w, w2, ruleWords[pair] ?? ''); setRuleWords({ ...ruleWords, [pair]: '' }); }}>name it</button>
                </span>
              );
            })}
            {v.unruled.length > 0 ? <span data-medium-unruled={String(v.unruled.length)}>{`${plural(v.unruled.length, 'passage', 'passages')} through ${lz} you have not said what ${v.unruled.length === 1 ? 'it comes' : 'they come'} to`}</span> : null}
          </div>
        );
      })}
      {(() => {
        const said = new Map<string, Array<[string, string]>>();
        for (const v of sorting.views) for (const p of v.paths) if (p.by === 'verdict' && p.composite !== null) { const k = `${p.path.w}|${p.path.w2}`; said.set(k, [...(said.get(k) ?? []), [viewLabel(v), p.composite]]); }
        const differ = [...said.entries()].filter(([, s]) => new Set(s.map(([, c]) => c)).size > 1);
        return differ.map(([k, s]) => <span key={k} data-medium-says-differ={k}>{`your says differ across the faces: ${s.map(([lz, c]) => `through ${lz} you said "${c}"`).join(', ')}`}</span>);
      })()}
      {sorting.instances.length > 0 ? (
        <span data-medium-own={String(sorting.own.length)}>{sorting.own.length ? `${la} and ${lb}'s alone — no passage through ${cornersWords || 'any corner'} comes to it: ${join(sorting.own.map((k) => sentence(sorting.instances.find((r) => relKey(r) === k) as Relating)))}` : `nothing theirs alone — all ${plural(sorting.instances.length, 'relating', 'relatings')} ${sorting.instances.length === 1 ? 'is' : 'are'} also said through ${cornersWords}`}</span>
      ) : null}
      {sorting.views.filter((v) => v.centroid.length > 0).map((v) => (
        <span key={`c-${v.view}`} data-medium-faces={viewLabel(v)}>{`the face's — said between them and through ${viewLabel(v)} too: ${join(v.centroid.map((k) => sentence(sorting.instances.find((r) => relKey(r) === k) as Relating)))}`}</span>
      ))}
      <span data-medium-state-line="true" className="text-stone-400">{stateLine()}</span>
      {named && siteName ? <span data-medium-named-under="true">{`named when it was: ${siteName} — given when ${plural(named.relatings, 'relating was', 'relatings were')} said; since then, ${left} left what is theirs alone · ${entered} entered`}</span> : null}
      {lights.map((l) => <span key={`${l.kind}|${l.x}|${l.y}|${l.through}`} data-medium-light-derived={l.kind}>{derivedWords(l)}</span>)}
    </div>
  );
}
