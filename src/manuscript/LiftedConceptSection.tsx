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
// The inside and the face block keep the Ambo's dark ground (their ink is drawn for it) inside the paper card.

import { useState } from 'react';
import type { VertexId } from '../types/geometry';
import { CastInsidePanel } from '../components/CastInsideDiagram';
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
}: {
  concept: LiftedConcept;
  pick: LiftedConceptPick | null;
  onPick: (next: LiftedConceptPick) => void;
  paper: { cardBackground: string; cardBorder: string; cardInk: string };
}) {
  const [open, setOpen] = useState(true);
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
      the concept layer — carried by the lift
      <span style={{ fontSize: 10, opacity: 0.6, letterSpacing: 0, fontVariant: 'normal' }}>{open ? '— shown' : '— show it'}</span>
    </div>
  );
  if (concept.state === 'born-on-page') {
    return (
      <div data-lifted-concept="born-on-page">
        {head}
        {open ? (
          <div style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.8 }}>
            {`born on the page (${concept.provenance}) — no transport carried: a form born after the lift holds no concept-space, and none is minted`}
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
  const pickedVertex = current.vertex && vertices.find((v) => v.id === current.vertex) ? current.vertex : null;
  const pickedFace = current.face ? faces.find((f) => f.id === current.face) ?? null : null;
  const pickedRow = pickedVertex ? vertices.find((v) => v.id === pickedVertex) ?? null : null;
  return (
    <div data-lifted-concept="read" data-lifted-concept-held={String(concept.held)} data-lifted-concept-resolved={String(concept.resolved)}>
      {head}
      {open ? (
        <>
          <div data-lifted-concept-record style={{ fontSize: 12, marginBottom: 4 }}>
            {`read from the record the lift carried — ${concept.source}: ${concept.resolved} of ${vertices.length} corners hold a space · the acts are the Ambo's, at the sites the words name`}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
            {vertices.map((v) => (
              <button
                key={v.id}
                type="button"
                data-lifted-vertex-row={v.id}
                data-lifted-vertex-space={v.space}
                data-lifted-vertex-picked={pickedVertex === v.id ? 'true' : undefined}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => onPick({ ...current, vertex: pickedVertex === v.id ? null : v.id })}
                title={v.absence ?? `${v.roles} roles · ${v.words} words — open its inside`}
                style={{
                  appearance: 'none',
                  font: 'inherit',
                  fontSize: 11.5,
                  padding: '2px 7px',
                  borderRadius: 3,
                  border: `1px solid ${paper.cardBorder}`,
                  background: pickedVertex === v.id ? paper.cardInk : paper.cardBackground,
                  color: pickedVertex === v.id ? paper.cardBackground : paper.cardInk,
                  opacity: v.space === 'none' ? 0.6 : 1,
                  cursor: 'pointer',
                }}
              >
                {`${v.label} · ${v.space === 'none' ? (v.absence ?? 'holds no space') : `${v.roles} roles · ${v.words} words`}`}
              </button>
            ))}
          </div>
          {pickedRow ? (
            pickedRow.space === 'none' ? (
              <div data-lifted-vertex-absence={pickedRow.id} style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.8, marginBottom: 4 }}>
                {`${pickedRow.label} ${pickedRow.absence ?? 'holds no space'}`}
              </div>
            ) : (
              <div data-lifted-inside={pickedRow.id} className="text-xs" style={{ background: '#0c0a09', color: '#d6d3d1', borderRadius: 4, padding: 6, marginBottom: 6, overflowX: 'auto' }}>
                <CastInsidePanel shape={record} vertexId={pickedRow.id} inline />
              </div>
            )
          ) : null}
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
            ) : pickedFace.cornerCell ? (
              <div data-lifted-face-corner-cell={pickedFace.id} style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.8, marginTop: 4 }}>
                {`the face ${pickedFace.name} is the corner cell's own: it returns all of its corner to itself — the solid's ordinary, nothing to mark`}
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
