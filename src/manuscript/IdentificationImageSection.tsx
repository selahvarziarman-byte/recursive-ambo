// IdentificationImageSection — STAMP THE-THIRD-RESOLUTION · D19 (2026-10-06): THE IDENTIFICATION'S DIRECT IMAGE at the person's eye.
// The specimen card of a form born by an identification of a record-carrying form: the merged corners with their children side by side
// (and what the seam's acts made one), the seams with their media (the two edges' relatings, those met as one, the discordances), the
// seam's ACT (the door act, C-11a: a role of one side's corner pointed at a role of the other's — the whole line-pair taken or the
// refusal named) with its one hand per taken line, and k — the relatings also through the seam under this identification. Nothing here
// is stored: the image is derived at every read (identificationImageModel); the person's transports are the page's record. THE WORDS
// are placeholders until the designer's (asked 2026-10-06 20:20; the mothership's stamp item 2) — each marked by its data attribute.

import { useMemo, useState } from 'react';
import type { VertexId } from '../types/geometry';
import { AGAINST, dirOf, IS, type Relating } from '../lib/relatings';
import { nameIn } from '../lib/spaceOf';
import { termWordsOf } from '../lib/instanceSpace';
import type { LiftedConceptPick } from './LiftedConceptSection';
import { seamSidesOf, type IdentificationImage, type SeamRecord } from './identificationImageModel';
import type { DoorTransport } from './apertureModel';

const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;

export function IdentificationImageSection({
  image,
  pick,
  onPick,
  paper,
  standing,
  onSeamAct,
  onSeamWithdraw,
  refusal,
}: {
  image: IdentificationImage;
  pick: LiftedConceptPick | null;
  onPick: (next: LiftedConceptPick) => void;
  paper: { cardBackground: string; cardBorder: string; cardInk: string };
  standing: SeamRecord[];
  onSeamAct: (seam: number, i: 0 | 1, x: string, y: string) => void;
  onSeamWithdraw: (seam: number, corner: 0 | 1, role: string) => void;
  refusal: string | null;
}) {
  const [open, setOpen] = useState(true);
  const [picks, setPicks] = useState<Record<number, { i: 0 | 1; x: string; y: string }>>({});
  const current: LiftedConceptPick = pick ?? { vertex: null, face: null };
  const { record, corners, seams, media, k } = image;
  const L = (v: VertexId): string => record.vertices[v]?.data.label?.trim() || v;
  const sides = useMemo(() => seams.map((s) => seamSidesOf(record, s)), [record, seams]);
  /** a role's words at a corner of the image: a merged corner's union label, else the record's own sentence */
  const roleWords = (v: VertexId, id: string): string => {
    const c = corners.find((x) => x.id === v);
    return c ? nameIn(c.space, id) : termWordsOf(record, v, id);
  };
  const relWords = (edgeId: string, r: Relating): string => {
    const e = image.image.edges.find((x) => x.id === edgeId);
    const [a, b] = e ? e.vertexIds : ['', ''];
    const x = roleWords(a as VertexId, r[1]); const y = roleWords(b as VertexId, r[2]);
    const w = r[0] === IS ? '≡' : r[0];
    return dirOf(r) === AGAINST ? `${y} ${w} ${x}` : `${x} ${w} ${y}`;
  };
  const transportsAt = (seam: number): DoorTransport[] => standing.filter((r) => r.formId === image.formId && r.seam === seam).flatMap((r) => r.transports);
  const pickedVertex = current.vertex && corners.some((c) => c.id === current.vertex) ? current.vertex : null;
  const select = { fontFamily: 'ui-monospace, monospace', fontSize: 10.5, background: paper.cardBackground, color: paper.cardInk, border: `1px solid ${paper.cardBorder}`, borderRadius: 3, padding: '2px 3px', maxWidth: 220 } as const;
  const button = { appearance: 'none', font: 'inherit', fontSize: 11.5, padding: 0, border: 'none', background: 'none', color: paper.cardInk, textDecoration: 'underline', cursor: 'pointer' } as const;
  return (
    <div data-identification-image="identified" data-identification-k={String(k)} data-identification-transports={String(image.transportsGiven)} data-identification-path={image.path}>
      <div
        data-lifted-concept-door
        data-compartment-state={open ? 'open' : 'closed'}
        onMouseDown={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        style={{ cursor: 'pointer', fontSize: 11, letterSpacing: 1, fontVariant: 'small-caps', opacity: 0.68, minHeight: 24, display: 'flex', alignItems: 'center', gap: 7, marginTop: 6 }}
      >
        the concept layer — carried through the seams
        <span style={{ fontSize: 10, opacity: 0.6, letterSpacing: 0, fontVariant: 'normal' }}>{open ? '— shown' : '— show it'}</span>
      </div>
      {open ? (
        <>
          <div data-identification-record style={{ fontSize: 12, marginBottom: 4 }}>
            {`read from the record the lift carried — ${record.name}: ${plural(corners.length, 'corner', 'corners')} made one by the identification, ${plural(seams.length, 'seam', 'seams')} · the acts at the seams are yours`}
          </div>
          <div style={{ display: 'grid', gap: 2, marginBottom: 4 }}>
            {corners.map((c) => (
              <div key={c.id} data-image-corner={c.id} data-image-corner-roles={String(c.roles)} data-image-corner-identities={String(c.identities)} data-image-corner-members={String(c.members.length)} style={{ fontSize: 11.5 }}>
                <span style={{ fontWeight: 600 }}>{c.label}</span>
                {` · holds ${plural(c.members.length, 'child', 'children')} side by side — ${c.members.map((m) => m.roles).join(' + ')} roles`}
                {c.identities > 0 ? <span data-image-corner-made-one={String(c.identities)}>{` · ${c.identities} made one by the seam`}</span> : <span data-image-corner-no-transport="true">{' · no transport yet between them'}</span>}
                {' · '}
                <button type="button" data-lifted-open-drawing={c.id} data-lifted-drawing-state={pickedVertex === c.id ? 'open' : 'closed'} onMouseDown={(e) => e.stopPropagation()} onClick={() => onPick({ ...current, vertex: pickedVertex === c.id ? null : c.id })} style={button}>
                  {pickedVertex === c.id ? 'close the drawing' : 'open the drawing'}
                </button>
              </div>
            ))}
          </div>
          {k > 0 ? <div data-image-k={String(k)} style={{ fontSize: 11.5, marginBottom: 4 }}>{`under this identification ${plural(k, 'relating is', 'relatings are')} also through the seam`}</div> : null}
          {seams.map((s) => {
            const m = media.find((x) => x.seam === s.index) ?? null;
            const S = sides[s.index];
            const ts = transportsAt(s.index);
            const p = picks[s.index] ?? { i: 0 as const, x: '', y: '' };
            const rolesA = !('missing' in S) ? S.A.spaces[p.i].roles : [];
            const rolesB = !('missing' in S) ? S.B.spaces[p.i].roles : [];
            return (
              <div key={s.index} data-image-seam={String(s.index)} data-image-seam-mode={s.mode} data-image-seam-transports={String(ts.length)} style={{ fontSize: 11.5, marginTop: 4, display: 'grid', gap: 2 }}>
                <span>{`seam ${s.index + 1} · ${L(s.a.corners[0])}–${L(s.a.corners[1])} ~ ${L(s.b.corners[0])}–${L(s.b.corners[1])} · ${s.mode === 'reversing' ? 'reversing — a twist' : 'preserving'}`}</span>
                {m ? (
                  <span data-image-medium={String(s.index)} data-image-medium-joined={String(m.joined)} data-image-medium-discordances={String(m.discordances.length)} style={{ opacity: 0.85 }}>
                    {`${plural(m.fromA, 'relating', 'relatings')} on ${L(s.a.corners[0])}–${L(s.a.corners[1])}, ${m.fromB} on ${L(s.b.corners[0])}–${L(s.b.corners[1])}${m.joined ? ` — ${m.joined} one through the seam` : ''}${m.discordances.length ? ` · ${plural(m.discordances.length, 'discordance', 'discordances')}` : ''}`}
                  </span>
                ) : null}
                {m ? m.discordances.map((d, j) => (
                  <span key={j} data-image-discordance={d.kind} style={{ color: '#fcd34d' }}>
                    {d.kind === 'direction'
                      ? `${relWords(m.edgeId, d.a)} against ${relWords(m.edgeId, d.b)} run the other way — a discordance of the twist (a converse cannot be read here: the record the lift carried holds no lexicon)`
                      : `${relWords(m.edgeId, d.a)} against ${relWords(m.edgeId, d.b)} — two words on one pair`}
                  </span>
                )) : null}
                {ts.length === 0 ? (
                  <span data-image-seam-empty="true" style={{ fontStyle: 'italic', opacity: 0.8 }}>no transport yet — the door exists, its transport does not</span>
                ) : (
                  ts.flatMap((t) => t.roles.map(([x, y]) => (
                    <span key={`${t.corners.join('|')}|${x}|${y}`} data-image-seam-line={`${x}|${y}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'baseline' }}>
                      <span>{`${L(t.corners[0])}: ${termWordsOf(record, t.corners[0], x)} ≡ ${L(t.corners[1])}: ${termWordsOf(record, t.corners[1], y)}`}</span>
                      <button type="button" data-image-seam-withdraw={`${x}|${y}`} onMouseDown={(e) => e.stopPropagation()} onClick={() => onSeamWithdraw(s.index, (s.a.corners.indexOf(t.corners[0]) === 1 ? 1 : 0), x)} style={button}>withdraw</button>
                    </span>
                  )))
                )}
                {'missing' in S ? (
                  <span data-image-seam-no-sides="true" style={{ fontStyle: 'italic', opacity: 0.8 }}>{`no act here: ${S.missing.join(' and ')} ${S.missing.length === 1 ? 'holds' : 'hold'} no space`}</span>
                ) : (
                  <span data-image-seam-act={String(s.index)} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }} onMouseDown={(e) => e.stopPropagation()}>
                    <select data-image-seam-pair value={p.i} onChange={(e) => setPicks({ ...picks, [s.index]: { i: Number(e.target.value) === 1 ? 1 : 0, x: '', y: '' } })} style={select}>
                      <option value={0}>{`${L(s.a.corners[0])} ~ ${L(s.b.corners[0])}`}</option>
                      <option value={1}>{`${L(s.a.corners[1])} ~ ${L(s.b.corners[1])}`}</option>
                    </select>
                    <select data-image-seam-x value={p.x} onChange={(e) => setPicks({ ...picks, [s.index]: { ...p, x: e.target.value } })} style={select}>
                      <option value="">{`— a role of ${L(s.a.corners[p.i])} —`}</option>
                      {rolesA.map((r) => <option key={r.id} value={r.id}>{termWordsOf(record, s.a.corners[p.i], r.id)}</option>)}
                    </select>
                    <span>≡</span>
                    <select data-image-seam-y value={p.y} onChange={(e) => setPicks({ ...picks, [s.index]: { ...p, y: e.target.value } })} style={select}>
                      <option value="">{`— a role of ${L(s.b.corners[p.i])} —`}</option>
                      {rolesB.map((r) => <option key={r.id} value={r.id}>{termWordsOf(record, s.b.corners[p.i], r.id)}</option>)}
                    </select>
                    <button type="button" data-image-seam-transport={String(s.index)} disabled={!p.x || !p.y} onClick={() => { if (p.x && p.y) onSeamAct(s.index, p.i, p.x, p.y); }} style={{ ...button, opacity: p.x && p.y ? 1 : 0.5, cursor: p.x && p.y ? 'pointer' : 'default' }}>transport</button>
                  </span>
                )}
              </div>
            );
          })}
          {refusal ? <div data-image-seam-refusal="true" style={{ fontSize: 11.5, color: '#fcd34d', marginTop: 4 }}>{refusal}</div> : null}
        </>
      ) : null}
    </div>
  );
}
