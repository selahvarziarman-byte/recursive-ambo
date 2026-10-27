// LiftedConceptSection — STAMP C-10 (2026-09-24): THE LIFT CARRIES, at the person's eye (the mothership's item 3:
// REUSE, not new design — the corner's inside is the Ambo's own `CastInsidePanel` through the one resolver; a face's
// reading is the Ambo's own face block — the gen-0 `FaceRecord`, the born `BornFaceRecord` — read on the RECORD the
// lift carried). The section lives on the specimen card of a selected written form:
//   · a form lifted from a universe: the record named, the corners as rows (each its own count, or its absence said),
//     the faces as a pick (D14 names, never ids); a picked corner opens its inside, a picked face its reading;
//   · a form born on the page by an act: the absence said — no transport carried, none minted (item 2);
//   · a form that carried no record: said.
// The hands on a face block are WORDS here, never acts: the acts are the Ambo's, at the sites the words name — a
// withdrawal from this page would reach into the source universe the record was copied from.
// C-10b (§131 item 1, the designer's blocker — the inside CLIPPED in the card's 232 px column): on the card the inside is
// WORDS — `AB · holds a space of 20 roles · 22 words · 52 tuples · open the drawing` — and opened, the drawing mounts at its
// OWN size on the sheet (ManuscriptView's overlay, the canvas side — as a source's drawing opens in the Ambo), never in the
// column: no drawing may be mounted narrower than itself. The face block keeps the Ambo's dark ground (its ink is drawn for it).

import { useState } from 'react';
import type { SinceLift } from './sinceLiftModel';
import type { VertexId } from '../types/geometry';
import { BornFaceRecord, FaceRecord } from '../components/MidpointSurface';
import type { LiftedConcept } from './liftedConceptModel';

export interface LiftedConceptPick {
  vertex: VertexId | null;
  face: string | null;
}

export function LiftedConceptSection({
  concept,
  pick,
  onPick,
  paper,
  since = null,
  onLiftAgain,
  onLiftAgainDoors,
  liftAgainNotice = null,
}: {
  concept: LiftedConcept;
  pick: LiftedConceptPick | null;
  onPick: (next: LiftedConceptPick) => void;
  paper: { cardBackground: string; cardBorder: string; cardInk: string };
  // ADR 0031 §9.61 (rider 2 after 2.1): what moved on the seed since this lift — null when nothing did (no line: the ordinary is not marked)
  since?: SinceLift | null;
  onLiftAgain?: () => void; // his act: the same region lifted again, as the seed stands now
  onLiftAgainDoors?: () => void; // Arman's "b" (Δ208): the same region lifted again AND the old form's doors applied and glued, said — offered where the form has a glued room
  liftAgainNotice?: string | null; // what the last `lift again` did, in words
}) {
  const [open, setOpen] = useState(true);
  const [showSince, setShowSince] = useState(false);
  const current: LiftedConceptPick = pick ?? { vertex: null, face: null };
  const head = (
    <div
      data-lifted-concept-door
      data-compartment-state={open ? 'open' : 'closed'}
      onMouseDown={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
      style={{ cursor: 'pointer', fontSize: 11, letterSpacing: 1, fontVariant: 'small-caps', opacity: 0.68, minHeight: 24, display: 'flex', alignItems: 'center', gap: 7, marginTop: 6 }}
    >
      {/* the designer's 20:51: over an absence the head drops its tail — `carried by the lift` would claim a carry the next line denies */}
      {concept.state === 'born-on-page' || concept.state === 'no-record' ? 'the concept layer' : 'the concept layer — carried by the lift'}
      <span style={{ fontSize: 10, opacity: 0.6, letterSpacing: 0, fontVariant: 'normal' }}>{open ? '— shown' : '— show it'}</span>
    </div>
  );
  if (concept.state === 'born-on-page') {
    return (
      <div data-lifted-concept="born-on-page">
        {head}
        {open ? (
          <div style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.8 }}>
            {`born on the page (${concept.provenance}) — ${concept.reason}`}
          </div>
        ) : null}
      </div>
    );
  }
  if (concept.state === 'no-record') {
    return (
      <div data-lifted-concept="no-record">
        {head}
        {open ? <div style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.8 }}>{`nothing carried — this form was not lifted from a universe (${concept.provenance})`}</div> : null}
      </div>
    );
  }
  const { record, vertices, faces } = concept;
  void record;
  const pickedVertex = current.vertex && vertices.find((v) => v.id === current.vertex) ? current.vertex : null;
  const pickedFace = current.face ? faces.find((f) => f.id === current.face) ?? null : null;
  return (
    <div data-lifted-concept="read" data-lifted-concept-held={String(concept.held)} data-lifted-concept-resolved={String(concept.resolved)}>
      {head}
      {open ? (
        <>
          <div data-lifted-concept-record style={{ fontSize: 12, marginBottom: 4 }}>
            {`${concept.chain} — ${concept.source}: ${concept.resolved} of ${concept.corners} corners hold a space · the acts are the Ambo's, at the sites the words name`}
          </div>
          {/* ADR 0031 §9.61 (rider 2 after 2.1; the designer's 10-19 16:15): what moved on the seed SINCE THIS LIFT — a fact about the record, in the drawers' muted ink;
              `show` lists each act as he said it with its place, `lift again` is his act; no line when nothing moved */}
          {since ? (
            <div data-lifted-since style={{ fontSize: 11.5, opacity: 0.72, marginBottom: 4 }}>
              <span data-lifted-since-line>{since.line}</span>
              {' · '}
              <button type="button" data-lifted-since-show onMouseDown={(e) => e.stopPropagation()} onClick={() => setShowSince((v) => !v)} style={{ appearance: 'none', font: 'inherit', fontSize: 11.5, padding: 0, border: 'none', background: 'none', color: paper.cardInk, textDecoration: 'underline', cursor: 'pointer' }}>
                {showSince ? 'hide' : 'show'}
              </button>
              {' · '}
              <button type="button" data-lifted-lift-again onMouseDown={(e) => e.stopPropagation()} onClick={() => onLiftAgain?.()} style={{ appearance: 'none', font: 'inherit', fontSize: 11.5, padding: 0, border: 'none', background: 'none', color: paper.cardInk, textDecoration: 'underline', cursor: 'pointer' }}>
                lift again
              </button>
              {onLiftAgainDoors ? (
                <>
                  {' · '}
                  <button type="button" data-lifted-lift-again-doors onMouseDown={(e) => e.stopPropagation()} onClick={() => onLiftAgainDoors()} style={{ appearance: 'none', font: 'inherit', fontSize: 11.5, padding: 0, border: 'none', background: 'none', color: paper.cardInk, textDecoration: 'underline', cursor: 'pointer' }}>
                    lift again with the same doors
                  </button>
                </>
              ) : null}
              {showSince ? (
                <div data-lifted-since-list style={{ paddingLeft: 10 }}>
                  {since.list.map((t, i) => <div key={`${i}|${t}`} data-lifted-since-item>{t}</div>)}
                </div>
              ) : null}
            </div>
          ) : null}
          {liftAgainNotice ? <div data-lifted-lift-again-notice style={{ fontSize: 11.5, opacity: 0.72, marginBottom: 4 }}>{liftAgainNotice}</div> : null}
          <div style={{ display: 'grid', gap: 2, marginBottom: 4 }}>
            {/* C-10b — WHOLE OR WORDS: each corner one line of words; the drawing opens on the sheet at its own size */}
            {vertices.map((v) => (
              <div key={v.id} data-lifted-vertex-row={v.id} data-lifted-vertex-space={v.space} data-lifted-vertex-picked={pickedVertex === v.id ? 'true' : undefined} style={{ fontSize: 11.5, opacity: v.space === 'none' ? 0.7 : 1 }}>
                <span style={{ fontWeight: 600 }}>{v.label}</span>
                {v.space === 'none' ? (
                  <span data-lifted-vertex-absence={v.id}>{` · ${v.absence ?? 'holds no space'}`}</span>
                ) : v.roles === 0 ? (
                  // the designer's gate (12:32 §7): a corner whose child is EMPTY says so — the Ambo's own sentence for an empty midpoint — with no counts and no drawing to open
                  <span data-lifted-vertex-empty={v.id}>{' · nothing related here yet'}</span>
                ) : (
                  <>
                    {` · ${v.levels && v.levels.length > 1 ? 'hold one space' : 'holds a space'} of ${v.roles} ${v.roles === 1 ? 'role' : 'roles'} · ${v.words} ${v.words === 1 ? 'word' : 'words'} · ${v.tuples} ${v.tuples === 1 ? 'tuple' : 'tuples'} · `}
                    <button
                      type="button"
                      data-lifted-open-drawing={v.id}
                      data-lifted-drawing-state={pickedVertex === v.id ? 'open' : 'closed'}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => onPick({ ...current, vertex: pickedVertex === v.id ? null : v.id })}
                      style={{ appearance: 'none', font: 'inherit', fontSize: 11.5, padding: 0, border: 'none', background: 'none', color: paper.cardInk, textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {pickedVertex === v.id ? 'close the drawing' : 'open the drawing'}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
          {faces.length > 0 ? (
            <label style={{ display: 'block', fontSize: 11.5 }}>
              <span style={{ opacity: 0.7 }}>a face of the lifted form, read on the record</span>
              <select
                data-lifted-face-pick
                value={pickedFace ? pickedFace.id : ''}
                onChange={(e) => onPick({ ...current, face: e.target.value || null })}
                onMouseDown={(e) => e.stopPropagation()}
                style={{ display: 'block', width: '100%', marginTop: 2, padding: '3px 4px', fontFamily: 'ui-monospace, monospace', fontSize: 10.5, background: paper.cardBackground, color: paper.cardInk, border: `1px solid ${paper.cardBorder}`, borderRadius: 3 }}
              >
                <option value="">— pick a face —</option>
                {faces.map((f) => (
                  <option key={f.id} value={f.id}>
                    {`${f.name}${f.held ? '' : ' — not in the record'}`}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {pickedFace ? (
            !pickedFace.held ? (
              <div data-lifted-face-absence={pickedFace.id} style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.8, marginTop: 4 }}>
                {`the face ${pickedFace.name}: a corner of it is not in the record the lift carried — no reading`}
              </div>
            ) : (
              <div data-lifted-face={pickedFace.id} data-lifted-face-kind={pickedFace.kind} className="text-xs" style={{ background: '#0c0a09', color: '#a8a29e', borderRadius: 4, padding: 6, marginTop: 4, overflowX: 'auto' }}>
                {pickedFace.kind === 'seed' ? (
                  <FaceRecord shape={record} cycle={pickedFace.cycle} faceName={pickedFace.name} here={null} hands="words" />
                ) : (
                  <BornFaceRecord shape={record} cycle={pickedFace.cycle} faceName={pickedFace.name} faceId={pickedFace.id} here={null} hands="words" />
                )}
              </div>
            )
          ) : null}
        </>
      ) : null}
    </div>
  );
}
