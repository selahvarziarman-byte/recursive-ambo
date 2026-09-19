// ═══ THE J REGISTER — `STAMP C-6d (β)`, 2026-09-19: the connection layer's first
// GIVEN surface. `Layer 3 Witness` generalised WITNESS → GIVEN (§96.3): the
// layer's own edge register — an edge table of the selected cell's seams, and
// each edge whose two corners BOTH hold a cast carries the person's `J`.
//
// NOTHING HERE POSITS A `J`: the device OFFERS (the register's arithmetic,
// src/lib/jRegister.ts), the person TAKES. `Edge.identification` (FROZEN type,
// untouched) is the record — `roles` and `types` (τ) ONLY, written by the
// store's one writer; `support` and `fiat` are DERIVED at every read here and
// written by nothing (RECORD, NOT READING).
//
//   (i)   τ — the offering's STATED PREMISE, printed ABOVE the offers, its pairs
//         marked as the person's; the shared-signature line beneath it; given
//         where it is needed (the empty core's sentence IS the affordance);
//         withdrawable — and the register SAYS the offers were re-derived.
//   (ii)  THE OFFERING — ALL offers, grouped by READING (gauge orbit) within
//         weight, weight-ordered; ALL OR NONE, never a truncated offering; each
//         offer's pairs marked by support; three counts of three different
//         things, never a ratio; the tie sentence leads with the READING; the
//         FIVE states never collapsed — the device found nothing and the device
//         did not look are different facts.
//   (iii) THE TAKE — taking an offer writes the record and carries the
//         given-mark; withdrawable; `none` is a take too (`nothing identified` +
//         the given-mark); a FIAT pair is visibly distinct — support 0, marked as
//         YOURS AND UNBACKED, never merged with OFFERED (one glyph, one meaning:
//         an offered pair whose backing left with a τ change reads the same mark,
//         because it IS the same fact) — its conflicts printed BY NAME beside it;
//         the third value lives only there.
// One printing per fact, labelled. No camera work; the composition untouched;
// nothing in ExploreWindow; the register reads ONE edge.

import { useMemo, useState } from 'react';
import {
  arityIn,
  assess,
  describeConflict,
  recordOf,
  registerReading,
  sharedSignature,
  type Conflict,
  type Offer,
} from '../lib/jRegister';
import { useGeometryStore } from '../store/geometryStore';
import type { ConceptSpace, EdgeId, EdgeIdentification, Shape, VertexId } from '../types/geometry';

export interface JRegisterEdgeRow {
  edgeId: EdgeId | null;
  vertexIds: [VertexId, VertexId];
  displayLabel: string;
}

/** the register spends at most this many search nodes at a look; beyond it the row says so, in words */
export const SURFACE_BUDGET = 200_000;

const NO_COMMON_TYPE = 'no relation-type in common — a translation is yours to give';
const NOT_COMPUTED = 'not computed — this pair is beyond the budget';

// τ given before a take rides in as a PROP (the store's `edgeTauDrafts`, read by the selection panel): the
// panel is a function of its inputs — the shape, the seams, the drafts — and reaches the store only to ACT
export function JRegisterPanel({ shape, edges, tauDrafts = {}, budget = SURFACE_BUDGET }: { shape: Shape; edges: JRegisterEdgeRow[]; tauDrafts?: Record<EdgeId, EdgeIdentification['types']>; budget?: number }) {
  return (
    <div className="grid gap-3 text-sm text-stone-300" data-j-register-panel="true">
      <p className="text-xs leading-5 text-stone-500">
        the selected cell&apos;s seams — an edge whose two corners both hold a cast carries your J: the device offers, you take
      </p>
      <ul className="grid gap-3">
        {edges.map((row) => (
          <JRegisterRow key={row.vertexIds.join('|')} shape={shape} row={row} draft={row.edgeId ? tauDrafts[row.edgeId] : undefined} budget={budget} />
        ))}
      </ul>
    </div>
  );
}

type Pair = [string, string];
const pairsKey = (pairs: Pair[]): string => JSON.stringify(pairs);
const samePairs = (a: Pair[], b: Pair[]): boolean => pairsKey([...a].sort()) === pairsKey([...b].sort());
const roleName = (cast: ConceptSpace, id: string): string => cast.roles.find((role) => role.id === id)?.label ?? id;
const typeNames = (cast: ConceptSpace): Array<{ name: string; arity: number }> => {
  const out = cast.signature.map((s) => ({ name: s.type, arity: s.arity }));
  const seen = new Set(out.map((t) => t.name));
  for (const role of cast.roles) {
    for (const k of Object.keys(role.types ?? {})) {
      if (!seen.has(k)) { seen.add(k); out.push({ name: k, arity: 1 }); }
    }
  }
  return out;
};

function JRegisterRow({ shape, row, draft, budget }: { shape: Shape; row: JRegisterEdgeRow; draft: EdgeIdentification['types'] | undefined; budget: number }) {
  const castA = shape.vertices[row.vertexIds[0]]?.data.cast;
  const castB = shape.vertices[row.vertexIds[1]]?.data.cast;
  const edge = row.edgeId ? shape.edges.find((candidate) => candidate.id === row.edgeId) ?? null : null;
  const setEdgeTau = useGeometryStore((state) => state.setEdgeTau);
  const takeEdgeIdentification = useGeometryStore((state) => state.takeEdgeIdentification);
  const withdrawEdgeIdentification = useGeometryStore((state) => state.withdrawEdgeIdentification);
  const identification: EdgeIdentification | null = edge?.identification ?? null;
  const tau: Pair[] = identification ? identification.types : draft ?? [];
  const [rederived, setRederived] = useState<string | null>(null);
  const [pickX, setPickX] = useState('');
  const [pickY, setPickY] = useState('');
  const [fiatX, setFiatX] = useState('');
  const [fiatY, setFiatY] = useState('');
  const X = useMemo(() => (castA ? recordOf(castA) : null), [castA]);
  const Y = useMemo(() => (castB ? recordOf(castB) : null), [castB]);
  const shared = useMemo(() => (X && Y ? sharedSignature(X, Y, tau) : null), [X, Y, tau]);
  const reading = useMemo(
    () => (castA && castB ? registerReading(castA, castB, tau, budget, { keepAll: true, countFull: false }) : null),
    [castA, castB, tau, budget],
  );
  const given = useMemo(() => {
    if (!identification || !X || !Y || !shared) return null;
    return assess(X, Y, new Map(identification.roles), shared);
  }, [identification, X, Y, shared]);

  if (!castA || !castB || !X || !Y || !shared || !reading) {
    // (ii): an edge whose corners do not BOTH hold a cast — no J register on that row, a TRUE ABSENCE
    return (
      <li data-j-row={row.vertexIds.join('|')} className="border-t border-stone-800 pt-2">
        <span className="font-mono text-stone-100">{row.displayLabel}</span>
      </li>
    );
  }

  const changeTau = (next: Pair[], how: 'withdrawn' | 'given'): void => {
    if (!row.edgeId) return;
    setEdgeTau(row.edgeId, next);
    setRederived(how === 'withdrawn' ? 'τ withdrawn — the offers below were re-derived for the τ now in force' : 'τ given — the offers below were re-derived for the τ now in force');
  };
  const xTypes = typeNames(castA);
  const yTypes = typeNames(castB);
  const pickXArity = xTypes.find((t) => t.name === pickX)?.arity;
  const yChoices = pickXArity === undefined ? [] : yTypes.filter((t) => t.arity === pickXArity);
  const canWrite = row.edgeId !== null;
  const state = identification ? 'given' : reading.state === 'offers' ? 'offered' : reading.state === 'beyond the budget' ? 'not computed' : reading.state;
  const arityLine = (name: string): string => `"${name}" is arity ${arityIn(X, name)} here and arity ${arityIn(Y, name)} there — not a shared name`;
  const crossLine = (pair: string): string => {
    const [x, y] = pair.split('↦');
    return `"${x} ↦ ${y}" is arity ${arityIn(X, x)} here and arity ${arityIn(Y, y)} there — not translated`;
  };
  const mappedX = new Set((identification?.roles ?? []).map(([x]) => x));
  const mappedY = new Set((identification?.roles ?? []).map(([, y]) => y));

  return (
    <li data-j-row={row.vertexIds.join('|')} data-j-edge={row.edgeId ?? undefined} data-j-state={state} className="border-t border-stone-800 pt-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-stone-100">{row.displayLabel}</span>
        <span className="text-xs text-stone-500">J register</span>
      </div>
      {!canWrite ? (
        <p className="mt-1 text-xs text-rose-300/80" data-j-no-entity="true">no edge entity carries this pair — a J cannot be recorded here</p>
      ) : null}

      {/* (i) τ — the stated premise, ABOVE the offers, the pairs marked as the person's */}
      <div className="mt-2 grid gap-1" data-j-tau={pairsKey(tau)}>
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">τ — the translation, given by you</span>
        {tau.length ? (
          <ul className="grid gap-1">
            {tau.map(([x, y]) => (
              <li key={`${x}|${y}`} className="flex items-center justify-between gap-2 text-xs" data-j-tau-pair={`${x}↦${y}`}>
                <span className="font-mono text-stone-200">{x} ↦ {y}</span>
                <span className="flex items-center gap-2">
                  <span className="text-stone-500">yours</span>
                  {canWrite ? (
                    <button type="button" className="rounded border border-stone-700 px-1.5 py-0.5 text-stone-300 hover:border-stone-500" data-j-tau-withdraw={`${x}↦${y}`} onClick={() => changeTau(tau.filter(([px, py]) => !(px === x && py === y)), 'withdrawn')}>
                      withdraw
                    </button>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-xs text-stone-500" data-j-tau-none="true">no translation given</span>
        )}
        {canWrite ? (
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <select data-j-tau-x="true" value={pickX} onChange={(event) => { setPickX(event.target.value); setPickY(''); }} className="rounded border border-stone-700 bg-stone-950 px-1 py-0.5 text-stone-200">
              <option value="">a type here…</option>
              {xTypes.filter((t) => !tau.some(([x]) => x === t.name)).map((t) => (
                <option key={t.name} value={t.name}>{t.name} (arity {t.arity})</option>
              ))}
            </select>
            <span className="text-stone-500">↦</span>
            <select data-j-tau-y="true" value={pickY} onChange={(event) => setPickY(event.target.value)} className="rounded border border-stone-700 bg-stone-950 px-1 py-0.5 text-stone-200" disabled={!pickX}>
              <option value="">a type there, of the same arity…</option>
              {yChoices.map((t) => (
                <option key={t.name} value={t.name}>{t.name} (arity {t.arity})</option>
              ))}
            </select>
            <button type="button" data-j-tau-add="true" disabled={!pickX || !pickY} className="rounded border border-stone-700 px-1.5 py-0.5 text-stone-300 hover:border-stone-500 disabled:opacity-50" onClick={() => { if (pickX && pickY) { changeTau([...tau, [pickX, pickY]], 'given'); setPickX(''); setPickY(''); } }}>
              add pair
            </button>
          </div>
        ) : null}
        {/* the shared-signature line: by name · under τ · the two-arities fact as a positive mark · the roles' keys */}
        <div className="grid gap-0.5 text-xs text-stone-400" data-j-shared="true">
          {shared.byName.length ? <span>shared by name: {shared.byName.join(' · ')}</span> : null}
          {shared.underTau.length ? <span>shared under τ: {shared.underTau.map(([x, y]) => `${x} ↦ ${y}`).join(' · ')}</span> : null}
          {[...shared.unary.entries()].length ? <span>types on the roles shared: {[...shared.unary.entries()].map(([x, y]) => (x === y ? x : `${x} ↦ ${y}`)).join(' · ')}</span> : null}
          {shared.notSame.map((name) => (
            <span key={name} data-j-not-same={name}>{name.includes('↦') ? crossLine(name) : arityLine(name)}</span>
          ))}
          {shared.unknownNames.map(([x, y]) => (
            <span key={`${x}|${y}`} data-j-unknown-name={`${x}↦${y}`}>&quot;{x} ↦ {y}&quot; names a type a cast does not declare</span>
          ))}
        </div>
        {rederived ? <span className="text-xs text-amber-200/80" data-j-rederived="true">{rederived}</span> : null}
      </div>

      {/* (iii) the take — the person's record, each pair marked; `none` is a take too */}
      {identification && given ? (
        <div className="mt-2 grid gap-1 rounded border border-amber-300/40 bg-amber-300/5 px-2 py-2" data-j-given={identification.roles.length ? 'pairs' : 'none'}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-200">J given</span>
            {canWrite ? (
              <button type="button" data-j-withdraw="true" className="rounded border border-stone-700 px-1.5 py-0.5 text-xs text-stone-300 hover:border-stone-500" onClick={() => { if (row.edgeId) withdrawEdgeIdentification(row.edgeId); }}>
                withdraw
              </button>
            ) : null}
          </div>
          {identification.roles.length ? (
            <ul className="grid gap-0.5 text-xs">
              {identification.roles.map(([x, y], index) => {
                const support = given.support[x] ?? 0;
                // a conflict is printed ONCE, beside the pair that completed it (the last of its X-terms in the record's order)
                const completedHere = given.conflicts.filter((c: Conflict) => {
                  const involved = identification.roles.map(([rx], i) => (c.xTerms.includes(rx) ? i : -1)).filter((i) => i >= 0);
                  return involved.length > 0 && Math.max(...involved) === index;
                });
                return (
                  <li key={`${x}|${y}`} data-j-pair={`${x}↦${y}`} data-j-support={support} data-j-unbacked={support === 0 ? 'true' : undefined} className="grid gap-0.5">
                    <span>
                      <span className="font-mono text-stone-100">{roleName(castA, x)} ↦ {roleName(castB, y)}</span>
                      {support > 0 ? <span className="text-stone-400"> · support {support}</span> : <span className="text-amber-200/90"> · support 0 — yours, backed by no offer under this τ</span>}
                    </span>
                    {completedHere.map((c) => (
                      <span key={describeConflict(c)} data-j-conflict="true" className="pl-3 text-rose-300/90">in conflict: {describeConflict(c)}</span>
                    ))}
                  </li>
                );
              })}
            </ul>
          ) : (
            <span className="text-xs text-stone-300" data-j-nothing-identified="true">nothing identified</span>
          )}
          {identification.roles.length ? (
            <span className="text-xs text-stone-400" data-j-given-counts="true">
              relational weight {given.relational} · {given.unrecorded} unrecorded · {given.exposure} known on one side only · types: {given.typesAgree} agree · {given.typesUnknown} unknown
            </span>
          ) : null}
          {canWrite ? (
            <div className="flex flex-wrap items-center gap-1 text-xs">
              <span className="text-stone-500">add a pair of your own:</span>
              <select data-j-fiat-x="true" value={fiatX} onChange={(event) => setFiatX(event.target.value)} className="rounded border border-stone-700 bg-stone-950 px-1 py-0.5 text-stone-200">
                <option value="">a role here…</option>
                {castA.roles.filter((role) => !mappedX.has(role.id)).map((role) => (
                  <option key={role.id} value={role.id}>{roleName(castA, role.id)}</option>
                ))}
              </select>
              <span className="text-stone-500">↦</span>
              <select data-j-fiat-y="true" value={fiatY} onChange={(event) => setFiatY(event.target.value)} className="rounded border border-stone-700 bg-stone-950 px-1 py-0.5 text-stone-200">
                <option value="">a role there…</option>
                {castB.roles.filter((role) => !mappedY.has(role.id)).map((role) => (
                  <option key={role.id} value={role.id}>{roleName(castB, role.id)}</option>
                ))}
              </select>
              <button type="button" data-j-fiat-add="true" disabled={!fiatX || !fiatY} className="rounded border border-stone-700 px-1.5 py-0.5 text-stone-300 hover:border-stone-500 disabled:opacity-50" onClick={() => { if (row.edgeId && fiatX && fiatY) { takeEdgeIdentification(row.edgeId, [...identification.roles, [fiatX, fiatY]]); setFiatX(''); setFiatY(''); } }}>
                add
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* (ii) the offering — the five states, never collapsed */}
      <div className="mt-2 grid gap-1" data-j-offering={reading.state}>
        {reading.state === 'empty core (a)' ? (
          <p className="text-xs text-stone-200" data-j-sentence="true">{NO_COMMON_TYPE}</p>
        ) : reading.state === 'empty core (b)' ? (
          <p className="text-xs text-stone-200" data-j-sentence="true">
            {reading.sentence}
            {reading.unaryRefusals > 0 ? <span className="text-stone-400"> · {reading.unaryRefusals} matching{reading.unaryRefusals === 1 ? '' : 's'} refused by a type on the roles</span> : null}
          </p>
        ) : reading.state === 'beyond the budget' ? (
          <p className="text-xs text-stone-200" data-j-sentence="true">
            {NOT_COMPUTED}
            <span className="text-stone-400"> (the register spends at most {budget} nodes at a look; this pair needs more)</span>
          </p>
        ) : (
          <>
            <p className="text-xs text-stone-200" data-j-tie="true">{tieSentence(reading.tied, reading.readings[0].groups.length, reading.aut, reading.autComplete)}</p>
            {reading.unaryRefusals > 0 ? <span className="text-xs text-stone-400">{reading.unaryRefusals} matching{reading.unaryRefusals === 1 ? '' : 's'} refused by a type on the roles</span> : null}
            {!identification && canWrite ? (
              <button type="button" data-j-take-none="true" className="justify-self-start rounded border border-stone-700 px-1.5 py-0.5 text-xs text-stone-300 hover:border-stone-500" onClick={() => { if (row.edgeId) takeEdgeIdentification(row.edgeId, []); }}>
                take none
              </button>
            ) : null}
            {reading.readings.map((w) => (
              <div key={w.weight} data-j-weight={w.weight} className="grid gap-1">
                <span className="text-xs text-stone-400">
                  relational weight {w.weight} · {w.groups.flat().length} offer{w.groups.flat().length === 1 ? '' : 's'} · {w.groups.length} reading{w.groups.length === 1 ? '' : 's'}
                </span>
                {w.groups.map((group, g) => (
                  <div key={g} data-j-reading={`${w.weight}:${g + 1}`} className="grid gap-1 border-l border-stone-800 pl-2">
                    <span className="text-[11px] text-stone-500">reading {g + 1} · {group.length} member{group.length === 1 ? '' : 's'}</span>
                    {group.map((offer) => (
                      <OfferRow
                        key={pairsKey(offer.pairs)}
                        offer={offer}
                        castA={castA}
                        castB={castB}
                        isGiven={identification ? samePairs(identification.roles, offer.pairs) : false}
                        onTake={canWrite ? () => { if (row.edgeId) takeEdgeIdentification(row.edgeId, offer.pairs); } : null}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </li>
  );
}

/** the tie sentence leads with the READING (the designer's rider 3, in the truthful form: orbit sizes vary) */
export function tieSentence(tied: number, readings: number, aut: [number, number], autComplete: boolean): string {
  const symmetries = `(this cast has ${aut[0]}, that one ${aut[1]}${autComplete ? '' : ' — not fully counted within the budget'})`;
  if (tied === 1) return `1 tied · 1 reading — one offer at the top weight ${symmetries}`;
  if (readings === 1) return `${tied} tied · 1 reading — they differ only by symmetry, so pick any ${symmetries}`;
  return `${tied} tied · ${readings} readings — genuinely different choices; within a reading they differ only by symmetry ${symmetries}`;
}

function OfferRow({ offer, castA, castB, isGiven, onTake }: { offer: Offer; castA: ConceptSpace; castB: ConceptSpace; isGiven: boolean; onTake: (() => void) | null }) {
  return (
    <div data-j-offer={pairsKey(offer.pairs)} data-j-offer-given={isGiven ? 'true' : undefined} className={`grid gap-0.5 rounded border px-2 py-1 text-xs ${isGiven ? 'border-amber-300/50 bg-amber-300/5' : 'border-stone-900 bg-stone-950/70'}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0">
          {offer.pairs.map(([x, y], index) => (
            <span key={`${x}|${y}`}>
              <span className="font-mono text-stone-100">{roleName(castA, x)} ↦ {roleName(castB, y)}</span>
              <span className="text-stone-500"> (support {offer.support[x] ?? 0})</span>
              {index < offer.pairs.length - 1 ? <span className="text-stone-600"> · </span> : null}
            </span>
          ))}
        </span>
        {isGiven ? (
          <span className="shrink-0 text-amber-200">given — this one</span>
        ) : onTake ? (
          <button type="button" data-j-take="true" className="shrink-0 rounded border border-stone-700 px-1.5 py-0.5 text-stone-300 hover:border-stone-500" onClick={onTake}>
            take
          </button>
        ) : null}
      </div>
      <span className="text-stone-400" data-j-offer-counts="true">
        relational weight {offer.weight} · {offer.unrecorded} unrecorded · {offer.exposure} known on one side only · types: {offer.typesAgree} agree · {offer.typesUnknown} unknown
      </span>
    </div>
  );
}
