// ManuscriptChrome — Manuscript Phase 3a: the operating chrome (DOM layer).
//
//   · OperationsDock — OPERATIONS ONLY (no invoke, no readouts — CONTEXT):
//     five informative glyphs (glue · flip-glue · collapse · cut · dualize);
//     the text label appears on HOVER; a group whose committed word-variants
//     number more than one opens a variant flyout (each variant IS a committed
//     `PlaygroundOperation`; disabled ones show their committed reason).
//   · InvokePalette — the right-click-on-paper menu: the committed
//     `PRIMITIVE_CATALOGUE`, manuscript-styled.
//   · FormOpsMenu — right-click-a-form: the SAME committed operations inline
//     (the dock stays primary; one op-application path underneath).
//
// Pure presentation: every enable/disable state and reason arrives from
// writtenFormModel's `operationAvailabilityFor` (the committed contract,
// verbatim) — this layer invents no operability.

import { useRef, useState } from 'react';
import type { PrimitiveCatalogueEntry } from '../playground/primitiveCatalogue';
import type { OperationAvailability } from './writtenFormModel';
import { DOCK_OPERATION_GROUPS } from './writtenFormModel';
import { DOCK_GLYPHS } from './OperationGlyphs';
import type { BirthGate, RecordEntry, ShelfEntry } from './genesisModel';

export interface ChromePaper {
  cardBackground: string;
  cardBorder: string;
  cardInk: string;
}

const menuStyle = (paper: ChromePaper): React.CSSProperties => ({
  position: 'fixed',
  zIndex: 60,
  minWidth: 172,
  padding: '6px 6px',
  borderRadius: 3,
  background: paper.cardBackground,
  border: `1px solid ${paper.cardBorder}`,
  boxShadow: '0 3px 10px rgba(58, 51, 38, 0.25)',
  color: paper.cardInk,
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 13,
});

const menuHeader: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 1.1,
  opacity: 0.55,
  fontVariant: 'small-caps',
  padding: '2px 8px 4px',
};

function MenuRow({
  label,
  sub,
  disabled,
  onPick,
}: {
  label: string;
  sub?: string | null;
  disabled?: boolean;
  onPick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={(e) => {
        e.stopPropagation();
        if (!disabled) onPick();
      }}
      style={{
        padding: '4px 8px',
        borderRadius: 2,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        background: hover && !disabled ? 'rgba(58,51,38,0.08)' : 'transparent',
      }}
    >
      <div style={{ whiteSpace: 'nowrap' }}>{label}</div>
      {sub ? (
        <div style={{ fontSize: 10.5, fontFamily: 'ui-monospace, monospace', opacity: 0.65, maxWidth: 240, whiteSpace: 'normal' }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// the invoke palette (right-click on empty paper)
// ---------------------------------------------------------------------------

export function InvokePalette({
  x,
  y,
  primitives,
  paper,
  onInvoke,
}: {
  x: number;
  y: number;
  primitives: readonly PrimitiveCatalogueEntry[];
  paper: ChromePaper;
  onInvoke: (key: string) => void;
}) {
  return (
    <div style={{ ...menuStyle(paper), left: x, top: y }}>
      <div style={menuHeader}>invoke — real material</div>
      {primitives.map((entry) => (
        <MenuRow key={entry.key} label={entry.label} onPick={() => onInvoke(entry.key)} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// the right-click-a-form inline ops (mirrors the dock; same committed path)
// ---------------------------------------------------------------------------

export function FormOpsMenu({
  x,
  y,
  title,
  availability,
  paper,
  onApply,
}: {
  x: number;
  y: number;
  title: string;
  availability: OperationAvailability[];
  paper: ChromePaper;
  onApply: (operationId: string) => void;
}) {
  return (
    <div style={{ ...menuStyle(paper), left: x, top: y, maxWidth: 280 }}>
      <div style={menuHeader}>operations — {title}</div>
      {availability.map((op) => (
        <MenuRow
          key={op.id}
          label={op.label}
          sub={op.enabled ? null : op.reason}
          disabled={!op.enabled}
          onPick={() => onApply(op.id)}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3b — the BIRTH GATE panel (two forms selected → the committed legality,
// visible: the combine affordance when legal, the committed reason when not)
// ---------------------------------------------------------------------------

export function BirthGatePanel({
  aTitle,
  bTitle,
  gate,
  paper,
  accent,
  onCombine,
}: {
  aTitle: string;
  bTitle: string;
  gate: BirthGate;
  paper: ChromePaper;
  accent: string;
  onCombine: () => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 14,
        top: 64,
        width: 264,
        padding: '13px 15px',
        borderRadius: 3,
        background: paper.cardBackground,
        border: `1px solid ${paper.cardBorder}`,
        boxShadow: '0 2px 9px rgba(58, 51, 38, 0.2)',
        color: paper.cardInk,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 13.5,
        lineHeight: 1.5,
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6, fontVariant: 'small-caps' }}>
        birth — the legal-combine gate
      </div>
      <div style={{ marginTop: 4 }}>
        <b>{aTitle}</b>
        <span style={{ opacity: 0.65 }}> + </span>
        <b>{bTitle}</b>
      </div>
      {gate.legal ? (
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onCombine();
          }}
          style={{
            marginTop: 10,
            width: '100%',
            padding: '7px 0',
            borderRadius: 3,
            border: `1px solid ${accent}`,
            background: 'transparent',
            color: accent,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 700,
            fontSize: 13.5,
            cursor: 'pointer',
          }}
        >
          combine — the committed assemble
        </button>
      ) : (
        <div
          style={{
            marginTop: 9,
            padding: '6px 8px',
            border: `1px solid ${paper.cardBorder}`,
            borderRadius: 3,
            fontSize: 12,
            fontStyle: 'italic',
            opacity: 0.85,
          }}
        >
          {gate.reason ?? 'The pair cannot combine.'}
        </div>
      )}
      <div style={{ marginTop: 9, fontSize: 10, fontFamily: 'ui-monospace, monospace', opacity: 0.5 }}>
        the consumed parents settle to pencil · esc releases the pair
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3b — the RECORD, as foot-marginalia ("what begat what" — the committed DAG,
// Q3 transitive-reduced; integrity surfaced, never hidden)
// ---------------------------------------------------------------------------

export function RecordStrip({
  entries,
  accepted,
  paper,
}: {
  entries: RecordEntry[];
  accepted: boolean;
  paper: ChromePaper;
}) {
  if (!entries.length) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 74,
        padding: '5px 12px 6px',
        borderTop: `1px solid ${paper.cardBorder}`,
        color: paper.cardInk,
        fontFamily: 'Georgia, "Times New Roman", serif',
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <span style={{ fontSize: 10.5, letterSpacing: 1.1, opacity: 0.55, fontVariant: 'small-caps' }}>
        the record — what begat what{accepted ? '' : ' · ⚠ integrity violations (shown, not hidden)'}
      </span>
      <span style={{ fontSize: 12 }}>
        {entries.map((entry, k) => (
          <span key={entry.childId} style={{ whiteSpace: 'nowrap' }}>
            <span style={{ opacity: 0.55 }}>{k === 0 ? '   ' : '   ·   '}</span>
            {entry.parents.map((p) => p.name).join(' + ')}
            <span style={{ opacity: 0.7 }}> ─{entry.operation}→ </span>
            <b>{entry.childName}</b>
          </span>
        ))}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3b — the SOURCES SHELF (load a committed snapshot → the margin; drag onto
// the sheet). Every entry is the committed deserializeSnapshot output,
// source-tagged; unplaceable entries carry their honest reason.
// ---------------------------------------------------------------------------

export function SourcesShelf({
  universes,
  paper,
  onLoadFiles,
  onDragEntry,
}: {
  universes: Array<{ source: string; entries: Array<{ index: number; entry: ShelfEntry; placed: boolean }> }>;
  paper: ChromePaper;
  onLoadFiles: (files: FileList) => void;
  onDragEntry: (index: number) => void; // dragstart — the view places on canvas drop
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div
      style={{
        position: 'absolute',
        left: 14,
        top: 110,
        width: 208,
        padding: '9px 11px',
        borderRadius: 3,
        background: paper.cardBackground,
        border: `1px solid ${paper.cardBorder}`,
        boxShadow: '0 2px 9px rgba(58, 51, 38, 0.16)',
        color: paper.cardInk,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 12.5,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div style={{ fontSize: 10.5, letterSpacing: 1.1, opacity: 0.6, fontVariant: 'small-caps' }}>
        sources — loaded universes
      </div>
      {universes.length === 0 ? (
        <div style={{ fontStyle: 'italic', opacity: 0.65, margin: '6px 0' }}>nothing loaded yet</div>
      ) : (
        universes.map((universe) => (
          <div key={universe.source} style={{ marginTop: 6 }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5, opacity: 0.7 }}>
              “{universe.source}”
            </div>
            {universe.entries.map(({ index, entry, placed }) => (
              <div
                key={index}
                draggable={entry.placeable && !placed}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', String(index));
                  onDragEntry(index);
                }}
                title={entry.reason ?? (placed ? 'already on the sheet' : 'drag onto the sheet')}
                style={{
                  padding: '3px 6px',
                  marginTop: 2,
                  borderRadius: 2,
                  border: `1px dashed ${paper.cardBorder}`,
                  opacity: entry.placeable && !placed ? 1 : 0.45,
                  cursor: entry.placeable && !placed ? 'grab' : 'default',
                }}
              >
                {entry.title}
                {placed ? <span style={{ opacity: 0.6 }}> — placed</span> : null}
                {!entry.placeable ? <span style={{ opacity: 0.6 }}> — unplaceable</span> : null}
              </div>
            ))}
          </div>
        ))
      )}
      <button
        type="button"
        onMouseDown={(e) => {
          e.stopPropagation();
          fileRef.current?.click();
        }}
        style={{
          marginTop: 8,
          width: '100%',
          padding: '5px 0',
          borderRadius: 3,
          border: `1px solid ${paper.cardBorder}`,
          background: 'transparent',
          color: paper.cardInk,
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        load universe… (.snapshot.json)
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length) onLoadFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// the operations dock (glyphs only; labels on hover; variant flyouts)
// ---------------------------------------------------------------------------

export function OperationsDock({
  availability,
  hasTarget,
  paper,
  accent,
  onApply,
}: {
  availability: OperationAvailability[]; // the committed contract for the CURRENT selection
  hasTarget: boolean;
  paper: ChromePaper;
  accent: string; // hover/enabled ink (the generator-a orange)
  onApply: (operationId: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const byId = new Map(availability.map((op) => [op.id, op]));

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 14,
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 4,
        background: paper.cardBackground,
        border: `1px solid ${paper.cardBorder}`,
        boxShadow: '0 2px 9px rgba(58, 51, 38, 0.18)',
        color: paper.cardInk,
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      {DOCK_OPERATION_GROUPS.map((group) => {
        const ops = group.operationIds
          .map((id) => byId.get(id))
          .filter((op): op is OperationAvailability => Boolean(op));
        const groupEnabled = hasTarget && ops.some((op) => op.enabled);
        const Glyph = DOCK_GLYPHS[group.key];
        const isOpen = openGroup === group.key;
        return (
          <div key={group.key} style={{ position: 'relative' }}>
            <button
              type="button"
              onMouseEnter={() => setHovered(group.key)}
              onMouseLeave={() => setHovered(null)}
              onMouseDown={(e) => {
                e.stopPropagation();
                if (!groupEnabled) return;
                if (ops.length === 1) {
                  setOpenGroup(null);
                  onApply(ops[0].id);
                } else {
                  setOpenGroup(isOpen ? null : group.key);
                }
              }}
              style={{
                width: 46,
                height: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                border: `1px solid ${paper.cardBorder}`,
                background: isOpen ? 'rgba(58,51,38,0.08)' : 'transparent',
                color: groupEnabled ? (hovered === group.key ? accent : paper.cardInk) : paper.cardInk,
                opacity: groupEnabled ? 1 : 0.38,
                cursor: groupEnabled ? 'pointer' : 'default',
                padding: 0,
              }}
            >
              <Glyph />
            </button>
            {hovered === group.key && !isOpen ? (
              <div
                style={{
                  position: 'absolute',
                  bottom: 52,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                  padding: '3px 8px',
                  borderRadius: 3,
                  background: paper.cardBackground,
                  border: `1px solid ${paper.cardBorder}`,
                  fontSize: 12,
                  boxShadow: '0 2px 6px rgba(58,51,38,0.18)',
                }}
              >
                {group.label}
                {!hasTarget ? <span style={{ opacity: 0.6 }}> — select a form first</span> : null}
                {hasTarget && !groupEnabled ? (
                  <span style={{ opacity: 0.6 }}> — {ops[0]?.reason ?? 'not applicable'}</span>
                ) : null}
              </div>
            ) : null}
            {isOpen ? (
              <div
                style={{
                  position: 'absolute',
                  bottom: 52,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  minWidth: 210,
                  padding: '6px 6px',
                  borderRadius: 3,
                  background: paper.cardBackground,
                  border: `1px solid ${paper.cardBorder}`,
                  boxShadow: '0 3px 10px rgba(58,51,38,0.25)',
                }}
              >
                <div style={menuHeader}>{group.label} — committed words</div>
                {ops.map((op) => (
                  <MenuRow
                    key={op.id}
                    label={op.label}
                    sub={op.enabled ? null : op.reason}
                    disabled={!op.enabled}
                    onPick={() => {
                      setOpenGroup(null);
                      onApply(op.id);
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
