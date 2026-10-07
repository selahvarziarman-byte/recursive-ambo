// IdentificationImageSection — STAMP THE-THIRD-RESOLUTION · D19 (2026-10-06): THE IDENTIFICATION'S DIRECT IMAGE at the person's eye.
// The specimen card of a form born by an identification of a record-carrying form: the merged corners with their children side by side
// (and what the seam's acts made one), the seams with their media (the two edges' relatings, those met as one, the discordances), the
// seam's ACT (the door act, C-11a: a role of one side's corner pointed at a role of the other's — the whole line-pair taken or the
// refusal named) with its one hand per taken line, and k — the relatings also through the seam under this identification. Nothing here
// is stored: the image is derived at every read (identificationImageModel); the person's transports are the page's record. THE WORDS
// are the designer's (her letter of 2026-10-07 08:19, direct): the head for a form born by an identification of a lifted form (the
// lifted form's own head, the gluing named), the k line (the doors by letter, only when k > 0), the merged corner's row (the totals,
// `side by side`) and the empty door's sentence (M7), the discordance (`on the door b, (…) meets (…), the other way round; both are
// kept`). A glued pair is a DOOR named by its letter (as the cargo and the aperture print it); a relating used as a term goes in
// parentheses (COPY-1). This seat's words in her vocabulary, marked `data-…-words="coder"` for her gate: the door's own head line,
// the medium line, the WORD discordance's form.

import { useMemo, useState } from 'react';
import type { VertexId } from '../types/geometry';
import { AGAINST, dirOf, IS, type Relating } from '../lib/relatings';
import { nameIn, spaceCounts } from '../lib/spaceOf';
import { doorLetter } from './orderTrace';
import { termWordsOf } from '../lib/instanceSpace';
import type { LiftedConceptPick } from './LiftedConceptSection';
import { seamSidesOf, type IdentificationImage, type SeamRecord } from './identificationImageModel';
import type { DoorTransport } from './apertureModel';

const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;
/** a door by its letter (the seam's index: a · b · c …), as the cargo and the aperture print it */
const letterOf = (seam: number): string => doorLetter({ pair: seam, side: 'a' });
/** `the door a` · `the doors a and b` · `the doors a, b and c` */
const doorsWords = (seams: number[]): string => { const ls = [...new Set(seams)].sort((p, q) => p - q).map(letterOf); return ls.length === 1 ? `the door ${ls[0]}` : `the doors ${ls.slice(0, -1).join(', ')} and ${ls[ls.length - 1]}`; };

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
  const inParens = (s: string): string => `(${s})`; // COPY-1: a relating used as a term goes in parentheses
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
            {/* the designer's head (08:19 §0): the lifted form's own head with the gluing named — `glued by abAB`; the general path has no word and says `identified` */}
            {`read from the record the lift carried — ${record.name}, ${image.gluing ? `glued by ${image.gluing}` : 'identified'}: ${image.held} of ${image.cornersTotal} corners ${image.held === 1 ? 'holds' : 'hold'} a space · the acts are the Ambo's, at the sites the words name`}
          </div>
          <div style={{ display: 'grid', gap: 2, marginBottom: 4 }}>
            {corners.map((c) => (
              <div key={c.id} data-image-corner={c.id} data-image-corner-roles={String(c.roles)} data-image-corner-identities={String(c.identities)} data-image-corner-members={String(c.members.length)} style={{ fontSize: 11.5 }}>
                {/* the designer's row (08:19 §2): one row, the totals, `side by side` saying the spaces aren't merged; the roles made one by a door ride the attribute and the door's own line */}
                <span style={{ fontWeight: 600 }}>{c.label}</span>
                {` · holds ${plural(c.members.length, 'space', 'spaces')} side by side · ${plural(spaceCounts(c.space).roles, 'role', 'roles')} · ${plural(spaceCounts(c.space).words, 'word', 'words')} · ${plural(spaceCounts(c.space).tuples, 'tuple', 'tuples')} · `}
                {c.identities > 0 ? <span data-image-corner-made-one={String(c.identities)} /> : null}
                <button type="button" data-lifted-open-drawing={c.id} data-lifted-drawing-state={pickedVertex === c.id ? 'open' : 'closed'} onMouseDown={(e) => e.stopPropagation()} onClick={() => onPick({ ...current, vertex: pickedVertex === c.id ? null : c.id })} style={button}>
                  {pickedVertex === c.id ? 'close the drawing' : 'open the drawing'}
                </button>
                {/* the empty door's own sentence (M7; the designer's §2): the doors meeting here that carry no role yet — it goes once a door act gives the door a line */}
                {(() => { const empty = c.seams.filter((s) => transportsAt(s).length === 0); return empty.length ? <span data-image-corner-no-transport="true" style={{ display: 'block', fontStyle: 'italic', opacity: 0.8 }}>{`${doorsWords(empty)} ${empty.length === 1 ? 'carries' : 'carry'} no role yet`}</span> : null; })()}
              </div>
            ))}
          </div>
          {/* the designer's k line (08:19 §1), printed only when k > 0: the door named, not the joined corner — `also come through` is COPY-1's phrase for a passage that comes to a relating */}
          {k > 0 ? <div data-image-k={String(k)} style={{ fontSize: 11.5, marginBottom: 4 }}>{`under this identification, ${plural(k, 'relating also comes', 'relatings also come')} through ${doorsWords(image.kDetail.flatMap((d) => d.doors))}`}</div> : null}
          {seams.map((s) => {
            const m = media.find((x) => x.seam === s.index) ?? null;
            const S = sides[s.index];
            const ts = transportsAt(s.index);
            const p = picks[s.index] ?? { i: 0 as const, x: '', y: '' };
            const rolesA = !('missing' in S) ? S.A.spaces[p.i].roles : [];
            const rolesB = !('missing' in S) ? S.B.spaces[p.i].roles : [];
            return (
              <div key={s.index} data-image-seam={String(s.index)} data-image-seam-mode={s.mode} data-image-seam-transports={String(ts.length)} style={{ fontSize: 11.5, marginTop: 4, display: 'grid', gap: 2 }}>
                {/* the door's own head line — this seat's words in the designer's vocabulary (a glued pair is a door named by its letter), for her gate */}
                <span data-image-seam-head-words="coder">{`the door ${letterOf(s.index)} · ${L(s.a.corners[0])}–${L(s.a.corners[1])} ~ ${L(s.b.corners[0])}–${L(s.b.corners[1])} · ${s.mode}`}</span>
                {m ? (
                  <span data-image-medium={String(s.index)} data-image-medium-joined={String(m.joined)} data-image-medium-discordances={String(m.discordances.length)} data-image-medium-words="coder" style={{ opacity: 0.85 }}>
                    {`${plural(m.fromA, 'relating', 'relatings')} on ${L(s.a.corners[0])}–${L(s.a.corners[1])}, ${m.fromB} on ${L(s.b.corners[0])}–${L(s.b.corners[1])}${m.joined ? ` — ${m.joined} joined through the door ${letterOf(s.index)}` : ''}${m.discordances.length ? ` · ${plural(m.discordances.length, 'discordance', 'discordances')}` : ''}`}
                  </span>
                ) : null}
                {m ? m.discordances.map((d, j) => (
                  <span key={j} data-image-discordance={d.kind} data-image-discordance-words={d.kind === 'direction' ? 'designer' : 'coder'} style={{ color: '#fcd34d' }}>
                    {/* the designer's discordance (08:19 §3): worded by what the page shows — the door, the two relatings as terms, `the other way round; both are kept` (COPY-1's `… ; both are kept`); where the two are one relating no line prints. The WORD discordance (D4, two words on one pair) in the same form — this seat's, for her gate. The lexicon's absence said only for a file saved before the spend (M2). */}
                    {d.kind === 'direction'
                      ? `on the door ${letterOf(s.index)}, ${inParens(relWords(m.edgeId, d.a))} meets ${inParens(relWords(m.edgeId, d.b))}, the other way round; both are kept${image.lexiconCarried ? '' : " · the lifted file holds no modes, so a word for the other way round can't be read here"}`
                      : `on the door ${letterOf(s.index)}, ${inParens(relWords(m.edgeId, d.a))} meets ${inParens(relWords(m.edgeId, d.b))}, in another word; both are kept`}
                  </span>
                )) : null}
                {ts.length === 0 ? (
                  <span data-image-seam-empty="true" style={{ fontStyle: 'italic', opacity: 0.8 }}>{`the door ${letterOf(s.index)} carries no role yet`}</span>
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
