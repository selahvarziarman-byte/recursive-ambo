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

import { useLayoutEffect, useRef, useState } from 'react';
import type { PrimitiveCatalogueEntry } from '../playground/primitiveCatalogue';
import type { OperationAvailability } from './writtenFormModel';
import { DOCK_OPERATION_GROUPS } from './writtenFormModel';
import { DOCK_GLYPHS } from './OperationGlyphs';
import type { BirthGate, RecordEntry, ShelfEntry } from './genesisModel';
import type { GluingPreviewResult } from '../playground/customGluing';
import type { BoundaryPairing } from '../lib/surfaceOperations';
import type { ChordSplit, FoldState } from './handGestureModel';
import type { ApertureParityCensus } from './apertureModel';

export interface ChromePaper {
  cardBackground: string;
  cardBorder: string;
  cardInk: string;
}

// M1 (SEAL_THE_MARKED_SPECIMEN) — THE FIELD DOOR: the specimen panel's
// control for the FIELD annotation register. CLOSED by default. THE 3-STATE
// LAW (SEAL_THE_FIELD_DOOR): the field is DOOR-GATED — ABSENT when closed
// (not drawn at all; presence ≠ consent), FULL when open; the always-present
// registers stay RECESSED. The dock-chip idiom at card scale. The COPY is
// the designer's RULED person-language ("the field — show it" / "the field —
// shown · other marks step back") — the register mechanics stay off the page.
export function FieldDoor({
  open,
  onToggle,
  onHover,
  paper,
  accent,
}: {
  open: boolean;
  onToggle: () => void;
  // §7 — hovering the door touches the field REGISTER row (the same
  // emphasizedIds channel every register promotion rides); null on leave
  onHover?: (touching: boolean) => void;
  paper: ChromePaper;
  accent: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      data-door="field"
      aria-pressed={open}
      onMouseEnter={() => {
        setHovered(true);
        onHover?.(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHover?.(false);
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 7,
        marginTop: 7,
        padding: '3px 9px',
        borderRadius: 3,
        border: `1px solid ${paper.cardBorder}`,
        background: open ? 'rgba(58,51,38,0.08)' : 'transparent',
        color: hovered ? accent : paper.cardInk,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 11,
        letterSpacing: 1,
        fontVariant: 'small-caps',
        cursor: 'pointer',
      }}
    >
      the field
      <span style={{ fontSize: 10, opacity: 0.6, letterSpacing: 0, fontVariant: 'normal' }}>
        {/* the person's language (designer-ruled): the mechanics stay OFF
            the page — never "recessed"/"promoted" here (our memo words) */}
        {open ? '— shown · other marks step back' : '— show it'}
      </span>
    </button>
  );
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
  chord,
  onOpenChord,
}: {
  x: number;
  y: number;
  title: string;
  availability: OperationAvailability[];
  paper: ChromePaper;
  onApply: (operationId: string) => void;
  // H2 — the aimed chord's GENERAL entry (reshape a face anytime): a gesture
  // row after the committed ops; enable/reason arrive from the view's model
  // read, never invented here
  chord?: { enabled: boolean; reason: string | null } | null;
  onOpenChord?: () => void;
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
      {chord ? (
        <MenuRow
          label="subdivide — draw a chord"
          sub={chord.enabled ? null : chord.reason}
          disabled={!chord.enabled}
          onPick={() => onOpenChord?.()}
        />
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3b — the BIRTH GATE panel (two forms selected → the committed legality,
// visible: the combine affordance when legal, the committed reason when not).
// COMBINE IS THE CONNECTED SUM (2026-07-12): the door runs the co-ratified
// connectedSum, and THE PERSON PICKS THE PORT FACE ON EACH FORM — the gate
// refuses by name until both are picked; there is NO default (faces[0] would
// be an array-order artifact) and NO mode choice (inert: the seam separates).
// ---------------------------------------------------------------------------

export interface PortFaceChoice {
  id: string; // the committed face id — the value the door consumes
  label: string; // honest display (the id + corner count)
}

export function PortFacePicker({
  formTitle,
  faces,
  picked,
  onPick,
  paper,
}: {
  formTitle: string;
  faces: PortFaceChoice[];
  picked: string;
  onPick: (faceId: string) => void;
  paper: ChromePaper;
}) {
  return (
    <label style={{ display: 'block', marginTop: 7, fontSize: 11.5 }}>
      <span style={{ opacity: 0.7 }}>port face on {formTitle}</span>
      <select
        value={picked}
        onChange={(e) => onPick(e.target.value)}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          display: 'block',
          width: '100%',
          marginTop: 2,
          padding: '3px 4px',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 10.5,
          background: paper.cardBackground,
          color: paper.cardInk,
          border: `1px solid ${paper.cardBorder}`,
          borderRadius: 3,
        }}
      >
        <option value="">— pick the port face —</option>
        {faces.map((face) => (
          <option key={face.id} value={face.id}>
            {face.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function BirthGatePanel({
  aTitle,
  bTitle,
  aFaces,
  bFaces,
  portA,
  portB,
  onPickA,
  onPickB,
  gate,
  paper,
  accent,
  onCombine,
  refusalNotice,
  fork,
}: {
  aTitle: string;
  bTitle: string;
  aFaces: PortFaceChoice[];
  bFaces: PortFaceChoice[];
  portA: string; // picked face id ('' = not yet picked — the gate refuses)
  portB: string;
  onPickA: (faceId: string) => void;
  onPickB: (faceId: string) => void;
  gate: BirthGate;
  paper: ChromePaper;
  accent: string;
  onCombine: () => void;
  // H2 THE FORK — when the last combine attempt refused on the rim mismatch,
  // the refusal (the frozen door's own sentence, verbatim) rides the panel and
  // the offer below it opens the aimed chord, pre-aimed by the view (lengths
  // computed from the PICKED faces — the string is never parsed)
  refusalNotice?: string | null;
  fork?: { label: string; onTake: () => void } | null;
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
        birth — the connect-sum gate
      </div>
      <div style={{ marginTop: 4 }}>
        <b>{aTitle}</b>
        <span style={{ opacity: 0.65 }}> # </span>
        <b>{bTitle}</b>
      </div>
      <PortFacePicker formTitle={aTitle} faces={aFaces} picked={portA} onPick={onPickA} paper={paper} />
      <PortFacePicker formTitle={bTitle} faces={bFaces} picked={portB} onPick={onPickB} paper={paper} />
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
          combine — the connected sum
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
      {refusalNotice ? (
        <div
          style={{
            marginTop: 9,
            padding: '7px 9px',
            border: `1px solid ${paper.cardBorder}`,
            borderRadius: 3,
            fontSize: 12,
          }}
        >
          <div style={{ fontSize: 10.5, letterSpacing: 1, opacity: 0.6, fontVariant: 'small-caps' }}>
            ⊘ cannot combine these two faces
          </div>
          <div style={{ marginTop: 3, fontStyle: 'italic', opacity: 0.88 }}>{refusalNotice}</div>
          {fork ? (
            <div style={{ borderTop: `1px dashed ${paper.cardBorder}`, marginTop: 7, paddingTop: 6 }}>
              <span
                onMouseDown={(e) => {
                  e.stopPropagation();
                  fork.onTake();
                }}
                style={{ color: accent, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}
              >
                {fork.label}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
      <div style={{ marginTop: 9, fontSize: 10, fontFamily: 'ui-monospace, monospace', opacity: 0.5 }}>
        the consumed parents settle to pencil · esc releases the pair
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// THE APERTURE gate (engineer-chartered 2026-07-13, designer-ruled ADR 0004):
// the person builds a 3-manifold — seed cube → pick face PAIRS → pick the MAP
// on each → glue; the engine's S² gate judges. ⛔ THE KNOB THAT LIES: there is
// NO preserving/reversing toggle here and never will be — the menu offers the
// MAP (which vertex of faceA lands on which vertex of faceB — the face's own
// dihedral orbit, exactly the maps the engine accepts); the mode printed
// beside each option is DERIVED from that map's witnessed deck fit and merely
// RECORDED. A label cannot reverse anything; only a reflected map can.
// ---------------------------------------------------------------------------

export interface ApertureFaceChoice {
  id: string;
  label: string;
}

// §3.3 — corner counts read as words in the forced-wall line (the ratified
// string's own idiom: "10 with three corners, 5 with four"); counts beyond
// the spelled range fall back to the digit rather than fake a word.
const APERTURE_CORNER_WORDS: Record<number, string> = {
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
};

export interface ApertureMapChoice {
  key: string; // the map's pick key — never a mode
  label: string; // the vertex correspondence + its derived mode, for reading only
}

export interface AperturePairRowView {
  faceA: string; // '' = not yet picked
  faceB: string;
  mapKey: string;
  faceChoicesA: ApertureFaceChoice[];
  faceChoicesB: ApertureFaceChoice[];
  mapChoices: ApertureMapChoice[]; // empty until both faces are picked
  // B-104 R2: HER sentence at the empty menu — set exactly when both faces
  // are picked, corner counts match, and EVERY candidate was refused by the
  // fit (the view supplies the one ruled string; this chrome invents none)
  mapRefusal?: string | null;
}

function AperturePickRow({
  index,
  row,
  onPickFaceA,
  onPickFaceB,
  onPickMap,
  paper,
}: {
  index: number;
  row: AperturePairRowView;
  onPickFaceA: (value: string) => void;
  onPickFaceB: (value: string) => void;
  onPickMap: (value: string) => void;
  paper: ChromePaper;
}) {
  const selectStyle = {
    display: 'block',
    width: '100%',
    marginTop: 2,
    padding: '3px 4px',
    fontFamily: 'ui-monospace, monospace',
    fontSize: 10.5,
    background: paper.cardBackground,
    color: paper.cardInk,
    border: `1px solid ${paper.cardBorder}`,
    borderRadius: 3,
  } as const;
  return (
    <div style={{ marginTop: 9, paddingTop: 7, borderTop: index > 0 ? `1px dashed ${paper.cardBorder}` : 'none' }}>
      <div style={{ fontSize: 11, opacity: 0.7 }}>pair {index + 1}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {/* D11 (F.2/F.4): the option TEXT is the person's letter; the face id
            survives as the RECORD — the option's value and its DOM title */}
        <select value={row.faceA} onChange={(e) => onPickFaceA(e.target.value)} onMouseDown={(e) => e.stopPropagation()} style={{ ...selectStyle, flex: 1 }}>
          <option value="">— face —</option>
          {row.faceChoicesA.map((f) => (
            <option key={f.id} value={f.id} title={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <select value={row.faceB} onChange={(e) => onPickFaceB(e.target.value)} onMouseDown={(e) => e.stopPropagation()} style={{ ...selectStyle, flex: 1 }}>
          <option value="">— face —</option>
          {row.faceChoicesB.map((f) => (
            <option key={f.id} value={f.id} title={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      <select
        value={row.mapKey}
        onChange={(e) => onPickMap(e.target.value)}
        onMouseDown={(e) => e.stopPropagation()}
        disabled={row.mapChoices.length === 0}
        style={selectStyle}
      >
        <option value="">— pick the identification map (vertex → vertex) —</option>
        {row.mapChoices.map((m) => (
          <option key={m.key} value={m.key}>
            {m.label}
          </option>
        ))}
      </select>
      {row.mapRefusal ? (
        // B-104 R2 — the sentence explaining an emptiness, ADJACENT to it
        // (her placement clause), in the corner-count refusal's register
        <div data-aperture-no-map style={{ marginTop: 3, fontSize: 10.5, fontStyle: 'italic', opacity: 0.8 }}>
          {row.mapRefusal}
        </div>
      ) : null}
    </div>
  );
}

export function ApertureGatePanel({
  rows,
  faceCount,
  unpairedFaceCount,
  parity,
  refusal,
  pristine,
  notice,
  onPickFaceA,
  onPickFaceB,
  onPickMap,
  onGlue,
  onLeaveBounded,
  wall,
  onClose,
  paper,
  accent,
}: {
  rows: AperturePairRowView[];
  // F.0e (mothership §3.2): the volume's own boundary-face count for the
  // subtitle's `{N} faces` — null when the menu could not be read (the pinch
  // guard's refusal), and then the clause is DROPPED rather than faked.
  faceCount: number | null;
  // B-104 R3(a): {N} for the designer's leave-bounded string — the boundary
  // faces no complete pair consumes, computed by the view live
  unpairedFaceCount: number;
  // §3.3 (2026-08-21): the parity census — printed only when it actually
  // forces a wall; a fact about the volume, before the person acts, and it
  // must never wear a refusal's register.
  parity: ApertureParityCensus | null;
  refusal: string | null; // the door's named, curable refusal — null = the glue may run
  // F.0 THE EMPTY STATE (engineer 2300, mothership 1745 §5): before the
  // person has acted the refusal may not occupy the primary action's slot —
  // the same words move to the quiet register below instead.
  pristine: boolean;
  // the GENERAL channel — sentences that promise nothing (a glued reading, a
  // thrown refusal verbatim, the subdivided reading). ⛔ the folded WALL never
  // arrives here — it crosses only inside `wall`, beside its own door (B1).
  notice: string | null;
  onPickFaceA: (index: number, value: string) => void;
  onPickFaceB: (index: number, value: string) => void;
  onPickMap: (index: number, value: string) => void;
  onGlue: () => void;
  // D2 — EXIT B (LEAVE BOUNDED): non-null exactly when a volume is pointed
  // at. An EXPLICIT zero-pair act — the volume becomes the bounded free-rim
  // chamber, chosen, not defaulted (the zero-pair refusal guards the glue
  // exit only). ⛔ the button's wording is the designer's (flagged).
  onLeaveBounded: (() => void) | null;
  // THE FOLDED WALL (ARC 0.1, LAW 14 · recut B-106 B1): non-null exactly when
  // the last glue came back FOLDED. ONE value carries the wall's sentence AND
  // its cure's door — a doorless wall (or a wall-less door) is inexpressible
  // at this seam by construction. ⛔ the sentence's wording is upstream
  // (`verdict.wall` — the researcher's; the designer's recut is owed).
  wall: { sentence: string; onSubdivide: () => void } | null;
  onClose: () => void;
  paper: ChromePaper;
  accent: string;
}) {
  // D10 (engineer 1629): the panel must be usable at ANY row count — the
  // count is ⌊boundary/2⌋ and unbounded, so the ROWS region owns a bounded
  // scroll (viewport-relative, tuned to NO row count) while the exits,
  // refusal and notice stay below it, always visible without scrolling.
  // The more-indicator is MEASURED (the region actually overflows), never
  // guessed from a count. ⛔ the appearance (the bound's look, the
  // indicator's wording) is the designer's — flagged in the handback.
  const rowsRegionRef = useRef<HTMLDivElement>(null);
  const [rowsOverflow, setRowsOverflow] = useState(false);
  useLayoutEffect(() => {
    const region = rowsRegionRef.current;
    if (!region) {
      setRowsOverflow(false);
      return;
    }
    setRowsOverflow(region.scrollHeight > region.clientHeight + 1);
  }, [rows.length]);
  return (
    <div
      data-aperture-panel
      style={{
        position: 'absolute',
        left: 14,
        top: 64,
        width: 306,
        // D10 STRUCTURAL BOUND (measured, not eyeballed): the panel's bottom
        // never passes 64 + min(560, 100vh−340) — paired with the shelf's own
        // bound (its top pinned ≥ 100vh−128−max(140,100vh−762) = 634px for
        // viewports ≥ 902px), the two left-column tenants cannot meet at any
        // row count on viewports ≥ ~760px. overflowY is the last-resort
        // fallback for pathological viewports — the rows region below scrolls
        // long before this fires. ⛔ the numbers are a mechanical safety
        // margin, NOT a design: the plate is the designer's (flagged).
        maxHeight: 'min(560px, calc(100vh - 340px))',
        overflowY: 'auto',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6, fontVariant: 'small-caps' }}>
          the aperture — build a 3-manifold
        </div>
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{ border: 'none', background: 'transparent', color: paper.cardInk, cursor: 'pointer', fontSize: 13, opacity: 0.6 }}
        >
          ×
        </button>
      </div>
      {/* F.0 (engineer 2300): the old sentence commanded a total pairing the
          engine stopped requiring on 07-18 and was false three ways on a
          5-cell (not a cube · not six faces · not required).
          F.0e (mothership §1+§3.2): the earlier wiring dropped the clause
          that makes `leave bounded` legible — `the rest stand as walls` is
          the designer's DELIVERED line, restored verbatim; `{N} faces` rides
          only when the count is genuinely read off the volume's own boundary
          menu (never faked — the clause drops instead). ⛔ wording hers,
          nothing authored here. */}
      <div style={{ marginTop: 3, fontSize: 11, opacity: 0.75 }}>
        {faceCount !== null
          ? `this volume · ${faceCount} faces · pair the ones you choose — the rest stand as walls · the mode follows from the map, never chosen`
          : 'this volume · pair the ones you choose — the rest stand as walls · the mode follows from the map, never chosen'}
      </div>
      {parity && parity.forcedWalls > 0 ? (
        <>
          {/* §3.3 — THE FORCED-WALL LINE (ratified shape; every number
              derived from the census; corner counts as words, the first
              class carrying the word "corners"). Its own quiet PLAIN line —
              never the refusal register (the pristine refusal is italic;
              this is not one): the person has done nothing wrong, this is
              the volume's own fact, available before he acts. */}
          <div style={{ marginTop: 3, fontSize: 10.5, opacity: 0.7 }}>
            {`${parity.total} faces — ${parity.classes
              .map(({ count, corners }, i) => `${count} with ${APERTURE_CORNER_WORDS[corners] ?? corners}${i === 0 ? ' corners' : ''}`)
              .join(', ')} · a face meets only a face with the same corners, so ${parity.pairs} ${
              parity.pairs === 1 ? 'pair' : 'pairs'
            } is all this volume can make · ${
              parity.forcedWalls === 1 ? 'one face stands as a wall' : `${parity.forcedWalls} faces stand as walls`
            } whatever you choose`}
          </div>
          {/* the ruled consequence — the RESEARCHER's words, verbatim. ⛔ the
              final compression is the DESIGNER's (flagged); nothing authored
              here. */}
          <div style={{ marginTop: 2, fontSize: 10.5, opacity: 0.6 }}>
            …and a world has no walls — every face glued to a partner. One face with no partner is one wall that stays, so this closes into a room you stand inside, never a world.
          </div>
        </>
      ) : null}
      <div data-aperture-rows ref={rowsRegionRef} style={{ maxHeight: 'clamp(100px, 22vh, 300px)', overflowY: 'auto' }}>
        {rows.map((row, i) => (
          <AperturePickRow
            key={i}
            index={i}
            row={row}
            onPickFaceA={(v) => onPickFaceA(i, v)}
            onPickFaceB={(v) => onPickFaceB(i, v)}
            onPickMap={(v) => onPickMap(i, v)}
            paper={paper}
          />
        ))}
      </div>
      {rowsOverflow ? (
        <div data-aperture-more style={{ marginTop: 4, fontSize: 10.5, opacity: 0.65, textAlign: 'center' }}>
          {/* B-104 R3(b) — the designer's ruled string, verbatim; {N} computed */}
          {`▼ ${rows.length} pairs in all — scroll for the rest`}
        </div>
      ) : null}
      {refusal !== null && pristine ? (
        /* the empty state: the person has not acted — the primary slot
           stays empty; the refusal's words stand in the quiet register */
        <div data-aperture-quiet style={{ marginTop: 9, fontSize: 11, fontStyle: 'italic', opacity: 0.6 }}>{refusal}</div>
      ) : refusal === null ? (
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onGlue();
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
          glue — the S² gate judges
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
          {refusal}
        </div>
      )}
      {onLeaveBounded ? (
        <button
          type="button"
          data-aperture-leave-bounded
          onMouseDown={(e) => {
            e.stopPropagation();
            onLeaveBounded();
          }}
          style={{
            marginTop: 7,
            width: '100%',
            padding: '6px 0',
            borderRadius: 3,
            border: `1px solid ${paper.cardBorder}`,
            background: 'transparent',
            color: paper.cardInk,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          {/* D2 EXIT B — B-104 R3(a): the designer's ruled string, verbatim
              (the one Arman called "whatever that is"); {N} computed live */}
          {`leave it bounded — its ${unpairedFaceCount} unpaired faces stand as walls, and the walk stops at each`}
        </button>
      ) : null}
      {notice ? (
        <div style={{ marginTop: 7, fontSize: 11, fontFamily: 'ui-monospace, monospace', opacity: 0.8 }}>{notice}</div>
      ) : null}
      {/* B1: the wall and its door render from the SAME conditional on the
          SAME value — one cannot stand without the other */}
      {wall ? (
        <>
          <div style={{ marginTop: 7, fontSize: 11, fontFamily: 'ui-monospace, monospace', opacity: 0.8 }}>
            {wall.sentence}
          </div>
          <button
            type="button"
            onMouseDown={(e) => {
              e.stopPropagation();
              wall.onSubdivide();
            }}
            style={{
              marginTop: 7,
              width: '100%',
              padding: '6px 0',
              borderRadius: 3,
              border: `1px solid ${paper.cardBorder}`,
              background: 'transparent',
              color: paper.cardInk,
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            subdivide — resolve the fold; the gate reads again
          </button>
        </>
      ) : null}
      <div style={{ marginTop: 9, fontSize: 10, fontFamily: 'ui-monospace, monospace', opacity: 0.5 }}>
        the world shows the interior · the specimen carries the domain, its pairings, the tower
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
  acts,
  undo,
}: {
  entries: RecordEntry[];
  accepted: boolean;
  paper: ChromePaper;
  // ═══ P5 · U.2 — THE ACTS ARE RECORDED, and this is where they live ════════
  // ⛔ `undo` acts on an ACT, not a form ⇒ IT DOES NOT BELONG ON A FORM'S CARD
  // AT ALL. It lives with the page's own acts, and this strip IS the page's
  // account of itself. ⛔ U.2: the revert is ITSELF recorded — an untraced
  // undo is the only gesture in this app that would lie about having happened.
  acts?: string[];
  // ⛔ U.4 — the control says WHAT it will undo, computed from the act
  // (`undo — remove Square`); `undo` alone is a promise about a thing he
  // cannot see. ⚠ And when there is nothing to undo it is ABSENT or REASONED,
  // never present and inert — so this prop is undefined, not disabled.
  undo?: { label: string; onUndo: () => void };
}) {
  if (!entries.length && !acts?.length && !undo) return null;
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
      {/* ═══ THE ROOF (B-119 §4 — the designer's ruling) ══════════════════════
          ⛔ THE ROOF SAYS `the record`. NOTHING ELSE. It used to read *"the
          record — what begat what"*, which sat over the DAG line (true) AND
          over the acts line (a live-state log — NOT what begat what).
          ★ Her own naming rule with nothing invented: A NAME MUST BE TRUE OF
          WHAT IT NAMES, so A ROOF OVER TWO THINGS MAY SAY ONLY WHAT IS TRUE
          OF BOTH — and `the record` is exactly true of both, because they are
          the two registers of ONE record.
          ⛔ NOT two roofs: *two roofs would say the strip is two things; it is
          one record with two registers, and the roof should say so once.*
          ⚠ AND IT MATTERED BEYOND TIDINESS: Δ23 took removal OUT of the
          genealogy, and a roof naming the acts line *what begat what* put it
          back one register up, where nobody would look for it. A TITLE IS A
          CLAIM ABOUT EVERYTHING UNDER IT.
          ⇒ The predicate does not vanish — it MOVES DOWN to the line it is
          true of, so each LINE now carries its own name. */}
      <div style={{ fontSize: 10.5, letterSpacing: 1.1, opacity: 0.55, fontVariant: 'small-caps' }}>
        the record{accepted ? '' : ' · ⚠ integrity violations (shown, not hidden)'}
      </div>
      <div style={{ marginTop: 2, display: 'flex', gap: 12, alignItems: 'baseline' }}>
        <span
          data-record-begat-label
          style={{ fontSize: 10.5, letterSpacing: 1.1, opacity: 0.55, fontVariant: 'small-caps', whiteSpace: 'nowrap' }}
        >
          what begat what
        </span>
        <span style={{ fontSize: 12 }}>
          {entries.map((entry, k) => (
            <span key={entry.childId} style={{ whiteSpace: 'nowrap' }}>
              <span style={{ opacity: 0.55 }}>{k === 0 ? '' : '   ·   '}</span>
              {entry.parents.map((p) => p.name).join(' + ')}
              <span style={{ opacity: 0.7 }}> ─{entry.operation}→ </span>
              <b>{entry.childName}</b>
            </span>
          ))}
        </span>
      </div>
      {/* P5 · U.2 — THE ACTS, on their own line: the page's account of what
          the PERSON did to it, beside its account of what begat what. Two
          kinds, two lines — the record does not mix them into one run. */}
      {acts?.length || undo ? (
        <div style={{ marginTop: 3, display: 'flex', gap: 12, alignItems: 'baseline' }}>
          <span style={{ fontSize: 10.5, letterSpacing: 1.1, opacity: 0.55, fontVariant: 'small-caps' }}>
            the acts
          </span>
          <span data-record-acts style={{ fontSize: 12, opacity: 0.8 }}>
            {acts?.length ? acts.join('   ·   ') : <span style={{ opacity: 0.6 }}>—</span>}
          </span>
          {undo ? (
            <button
              type="button"
              data-undo-act
              onMouseDown={(e) => {
                e.stopPropagation();
                undo.onUndo();
              }}
              style={{
                pointerEvents: 'auto', // the strip itself is inert; this control is not
                marginLeft: 'auto',
                padding: '2px 9px',
                borderRadius: 3,
                border: `1px solid ${paper.cardBorder}`,
                background: 'transparent',
                color: paper.cardInk,
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 11.5,
                cursor: 'pointer',
              }}
            >
              {undo.label}
            </button>
          ) : null}
        </div>
      ) : null}
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
  dirty,
  onLoadFiles,
  onDragEntry,
  onSavePage,
  onLoadPage,
}: {
  universes: Array<{ source: string; entries: Array<{ index: number; entry: ShelfEntry; placed: boolean }> }>;
  paper: ChromePaper;
  // §7 (B-2026-08-24-B, RULED): the page holds work not written down — the
  // QUIET STANDING MARK renders beside `save the page…`, where the act
  // lives, while the person still has a choice. UNSAVED only (the saved
  // state is the ordinary case and carries no mark).
  dirty: boolean;
  onLoadFiles: (files: FileList) => void;
  onDragEntry: (index: number) => void; // dragstart — the view places on canvas drop
  // §2B (B-2026-08-22-A): THE PAGE DOORS — VISIBLE, ruled ("not a right-click,
  // not a hidden gesture"): the whole page saved to and restored from an
  // explicit versioned file. ⛔ COPY PENDING THE DESIGNER (flagged): the
  // buttons' wording holds the slots, nothing authored here.
  onSavePage: () => void;
  onLoadPage: (files: FileList) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const pageFileRef = useRef<HTMLInputElement>(null);
  return (
    <div
      style={{
        position: 'absolute',
        left: 14,
        // R2 (the left-corner collisions): the shelf is BOTTOM-anchored — the
        // top-left corner belongs to the aperture gate panel (left:14, top:64,
        // grows down; measured fullest bottom ≈ y650) and the person-picks
        // card (top:64, ~180 tall). Anchored at bottom:128 the shelf grows UP
        // from ≈y872 — above the record strip (bottom:74) and clear of both
        // top-corner tenants at any measured extent. The designer reviews the
        // plate; nothing here pre-rules their coordinates.
        bottom: 128,
        // D10 (measured 2026-08-15): with FOUR loaded universes the shelf's
        // top invaded y339 — under the aperture panel's bottom (546) — so the
        // shelf now owns its own bound too: its top stays pinned ≥ 634px on
        // viewports ≥ 902px (floor 140px below), paired with the panel's
        // min(560, 100vh−340) cap so the two tenants cannot meet. Content
        // beyond the bound scrolls. ⛔ mechanical margins only — the real
        // column layout is the designer's (flagged).
        maxHeight: 'max(140px, calc(100vh - 762px))',
        overflowY: 'auto',
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
      {/* §7 (B-2026-08-24-B, RULED): the QUIET STANDING MARK — unsaved work,
          stated where the act lives, while he still has a choice. Only the
          UNSAVED state is marked. The second line speaks the ruled asymmetry
          ("an unmount survives; a full reload does not") in the person's own
          vocabulary. ⛔ final wording + look the DESIGNER's (flagged); the
          lines state the ruled facts and nothing more. */}
      {dirty ? (
        <div data-unsaved-mark style={{ marginTop: 7, fontSize: 10.5, fontStyle: 'italic', opacity: 0.75 }}>
          there is work here that is not written down
          <div style={{ marginTop: 1, opacity: 0.85 }}>
            switching modules keeps it · a full reload loses it — save the page… writes it down
          </div>
        </div>
      ) : null}
      {/* §2B — THE PAGE DOORS, visible beside the universe door. ⛔ COPY
          PENDING THE DESIGNER (flagged): wording holds the slots. */}
      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onSavePage();
          }}
          style={{
            flex: 1,
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
          save the page…
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            pageFileRef.current?.click();
          }}
          style={{
            flex: 1,
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
          load the page…
        </button>
      </div>
      <input
        ref={pageFileRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length) onLoadPage(e.target.files);
          e.target.value = '';
        }}
      />
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
// PHASE A (SEAL_PHASE_A_CAMERA C2) — the camera dock: Fit Selected + Reset
// Camera over the shared rig's request counters (the Ambo's own pattern).
// The plate fires on SELECT by itself — these are the recovery controls.
// Bottom-RIGHT: the shelf owns bottom-left, the op dock bottom-center.
// ---------------------------------------------------------------------------

export function CameraDock({
  paper,
  hasSelection,
  onFitSelected,
  onResetCamera,
}: {
  paper: ChromePaper;
  hasSelection: boolean;
  onFitSelected: () => void;
  onResetCamera: () => void;
}) {
  const buttonStyle = (enabled: boolean): React.CSSProperties => ({
    padding: '5px 10px',
    borderRadius: 3,
    border: `1px solid ${paper.cardBorder}`,
    background: paper.cardBackground,
    color: paper.cardInk,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 12,
    cursor: enabled ? 'pointer' : 'default',
    opacity: enabled ? 1 : 0.38,
    boxShadow: '0 2px 6px rgba(58,51,38,0.14)',
  });
  return (
    // above the drei Html card layer (zIndexRange tops out ~16.7M): the
    // recovery controls must stay CLICKABLE under every framing (the measured
    // 30s-timeout find).
    // M3-CLEANUP-2 (designer 1852, OBSTRUCTIVE): the dock leaves the RIGHT
    // column entirely — at right:14/bottom:64 it overlaid the specimen
    // panel's lower rows + the field door (the card grew past it at the
    // marked-specimen close) and crowded the zoo/aperture stack. BOTTOM-LEFT
    // (left:14, bottom:24): below the record strip (bottom:74) and the
    // sources shelf (bottom:128, grows up), clear of the bottom-centre
    // OperationsDock, the right column free for the card.
    <div style={{ position: 'absolute', left: 14, bottom: 24, display: 'flex', gap: 8, zIndex: 2147483000 }}>
      <button
        type="button"
        aria-label="Fit Selected"
        title="fit the selected specimen"
        disabled={!hasSelection}
        onClick={onFitSelected}
        style={buttonStyle(hasSelection)}
      >
        Fit Selected
      </button>
      <button
        type="button"
        aria-label="Reset Camera"
        title="return to the default view"
        onClick={onResetCamera}
        style={buttonStyle(true)}
      >
        Reset Camera
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// the operations dock (glyphs only; labels on hover; variant flyouts)
// ---------------------------------------------------------------------------

export function OperationsDock({
  availability,
  hasTarget,
  noTargetReason,
  paper,
  accent,
  onApply,
  fold,
  onFoldToggle,
  thicken,
  onThickenToggle,
  identifySew,
  onIdentifyToggle,
  explore,
  onExploreToggle,
}: {
  availability: OperationAvailability[]; // the committed contract for the CURRENT selection
  hasTarget: boolean;
  // §2b (B-2026-08-26-A, ruled): the sentence a chip speaks when no target
  // resolves — the VIEW names which void it is (nothing selected vs a
  // standing selection no band resolves). This chrome invents no operability
  // and no sentence; a required prop cannot be forgotten by a later caller.
  noTargetReason: string;
  paper: ChromePaper;
  accent: string; // hover/enabled ink (the generator-a orange)
  onApply: (operationId: string) => void;
  // H2 THE FOLD — the 7th word is a GESTURE, not a registry op: the chip
  // opens the fold panel; enable/reason arrive from handGestureModel via the
  // view (the committed form-level gate's own sentence — never invented here)
  fold?: { enabled: boolean; reason: string | null; open: boolean };
  onFoldToggle?: () => void;
  // GAP2B THE THICKEN — the 8th word, same gesture shape as the fold: the
  // chip opens the thicken panel; enable/reason arrive from the view (the
  // pair arming + the committed Q1 gate — never invented here)
  thicken?: { enabled: boolean; reason: string | null; open: boolean };
  onThickenToggle?: () => void;
  // CYCLE-IDENTIFY (L23) — the sew register: the chip opens the trace panel
  // (two walks, NO mode control — the mode IS the traced direction);
  // enable/reason arrive from the view's entry gate (D2 fires at entry)
  identifySew?: { enabled: boolean; reason: string | null; open: boolean };
  onIdentifyToggle?: () => void;
  // RUNG 1 THE EXPLORE WINDOW — the DOORWAY chip: enabled on any selected
  // shape with an inside behind it (a built 3-manifold room, the folded
  // shelf, a class-body shell); the THRESHOLD verdict (open vs the named
  // refusal) is the view's — exploreThreshold judges, never this chrome
  explore?: { enabled: boolean; reason: string | null; open: boolean };
  onExploreToggle?: () => void;
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
        if (group.key === 'thicken') {
          // GAP2B — the thicken chip mirrors the fold chip: no variant flyout
          // (a gesture, not a registry family); the panel is the affordance;
          // a greyed chip still SPEAKS on hover (R4(e): no refusal is eaten).
          const thickenEnabled = Boolean(thicken?.enabled);
          const thickenOpenNow = Boolean(thicken?.open);
          return (
            <div key={group.key} style={{ position: 'relative' }}>
              <button
                type="button"
                aria-label={group.label}
                title={group.label}
                onMouseEnter={() => setHovered(group.key)}
                onMouseLeave={() => setHovered(null)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  if (thickenEnabled) onThickenToggle?.();
                }}
                style={{
                  width: 46,
                  height: 46,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  border: `1px solid ${paper.cardBorder}`,
                  background: thickenOpenNow ? 'rgba(58,51,38,0.08)' : 'transparent',
                  color: thickenEnabled ? (hovered === group.key ? accent : paper.cardInk) : paper.cardInk,
                  opacity: thickenEnabled ? 1 : 0.38,
                  cursor: thickenEnabled ? 'pointer' : 'default',
                  padding: 0,
                }}
              >
                {DOCK_GLYPHS[group.key]()}
              </button>
              {hovered === group.key ? (
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
                  {!thickenEnabled && thicken?.reason ? (
                    <span style={{ opacity: 0.6 }}> — {thicken.reason}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        }
        if (group.key === 'fold') {
          // H2 — the fold chip: no variant flyout (the gesture has no
          // committed words to list); the panel is the affordance. A greyed
          // chip still SPEAKS on hover — the committed gate reason rides the
          // label (the R4(e) rule: no refusal is eaten with the click).
          const foldEnabled = Boolean(fold?.enabled);
          const foldOpen = Boolean(fold?.open);
          return (
            <div key={group.key} style={{ position: 'relative' }}>
              <button
                type="button"
                aria-label={group.label}
                title={group.label}
                onMouseEnter={() => setHovered(group.key)}
                onMouseLeave={() => setHovered(null)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  if (foldEnabled) onFoldToggle?.();
                }}
                style={{
                  width: 46,
                  height: 46,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  border: `1px solid ${paper.cardBorder}`,
                  background: foldOpen ? 'rgba(58,51,38,0.08)' : 'transparent',
                  color: foldEnabled ? (hovered === group.key ? accent : paper.cardInk) : paper.cardInk,
                  opacity: foldEnabled ? 1 : 0.38,
                  cursor: foldEnabled ? 'pointer' : 'default',
                  padding: 0,
                }}
              >
                {DOCK_GLYPHS[group.key]()}
              </button>
              {hovered === group.key ? (
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
                  {!hasTarget ? <span style={{ opacity: 0.6 }}> — {noTargetReason}</span> : null}
                  {hasTarget && !foldEnabled && fold?.reason ? (
                    <span style={{ opacity: 0.6 }}> — {fold.reason}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        }
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
              aria-label={group.label}
              title={group.label}
              onMouseEnter={() => setHovered(group.key)}
              onMouseLeave={() => setHovered(null)}
              onMouseDown={(e) => {
                e.stopPropagation();
                if (!groupEnabled) {
                  // R4(e): a greyed group can be ASKED — the click opens the
                  // submenu, where EVERY refused op speaks its own committed
                  // reason through the existing row idiom. Apply stays gated by
                  // each row's disabled; a disabled SINGLE-op group opens too —
                  // its reason must not be eaten with the click.
                  setOpenGroup(isOpen ? null : group.key);
                  return;
                }
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
                {!hasTarget ? <span style={{ opacity: 0.6 }}> — {noTargetReason}</span> : null}
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
      {identifySew ? (
        // CYCLE-IDENTIFY (L23) — the sew-register chip, chrome-local (the
        // frozen dock-group list is untouched): same gesture shape as the
        // fold/thicken chips; a greyed chip still SPEAKS on hover.
        (() => {
          const idEnabled = Boolean(identifySew.enabled);
          const idOpen = Boolean(identifySew.open);
          return (
            <div key="identify-sew" style={{ position: 'relative' }}>
              <button
                type="button"
                aria-label="identify"
                title="identify"
                onMouseEnter={() => setHovered('identify-sew')}
                onMouseLeave={() => setHovered(null)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  if (idEnabled) onIdentifyToggle?.();
                }}
                style={{
                  width: 46,
                  height: 46,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  border: `1px solid ${paper.cardBorder}`,
                  background: idOpen ? 'rgba(58,51,38,0.08)' : 'transparent',
                  color: idEnabled ? (hovered === 'identify-sew' ? accent : paper.cardInk) : paper.cardInk,
                  opacity: idEnabled ? 1 : 0.38,
                  cursor: idEnabled ? 'pointer' : 'default',
                  padding: 0,
                }}
              >
                {/* the glyph: two walks meeting in a seam (stitch strokes) */}
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M4 8 C 9 5, 17 5, 22 8" stroke="currentColor" strokeWidth="1.6" fill="none" />
                  <path d="M4 18 C 9 21, 17 21, 22 18" stroke="currentColor" strokeWidth="1.6" fill="none" />
                  <path d="M8 7.2 L 8 18.8 M13 6.4 L 13 19.6 M18 7.2 L 18 18.8" stroke="currentColor" strokeWidth="0.9" />
                </svg>
              </button>
              {hovered === 'identify-sew' ? (
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
                  {/* B-103 §2d — doubly grounded (designer's words; the
                      researcher's independent ruling from the definitions
                      chair): the act named by its vertex RESULT, the gesture
                      edge-addressed. Ships verbatim. */}
                  identify — trace two edge-walks; where they meet, corners become one concept
                  {!idEnabled && identifySew.reason ? (
                    <span style={{ opacity: 0.6 }}> — {identifySew.reason}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })()
      ) : null}
      {explore ? (
        // RUNG 1 THE EXPLORE WINDOW — the doorway chip (the identify-chip
        // idiom): glyph-only, label on hover, a greyed chip still SPEAKS.
        // The chip is the DOOR; whether the habitat opens or refuses at the
        // threshold is the view's exploreThreshold verdict.
        (() => {
          const exEnabled = Boolean(explore.enabled);
          const exOpen = Boolean(explore.open);
          return (
            <div key="explore-window" style={{ position: 'relative' }}>
              <button
                type="button"
                aria-label="explore inside"
                title="explore inside"
                onMouseEnter={() => setHovered('explore-window')}
                onMouseLeave={() => setHovered(null)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  if (exEnabled) onExploreToggle?.();
                }}
                style={{
                  width: 46,
                  height: 46,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  border: `1px solid ${paper.cardBorder}`,
                  background: exOpen ? 'rgba(58,51,38,0.08)' : 'transparent',
                  color: exEnabled ? (hovered === 'explore-window' ? accent : paper.cardInk) : paper.cardInk,
                  opacity: exEnabled ? 1 : 0.38,
                  cursor: exEnabled ? 'pointer' : 'default',
                  padding: 0,
                }}
              >
                {/* the glyph: a doorway with the corridor receding through it */}
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M6 22 L6 6 Q13 2.5 20 6 L20 22" stroke="currentColor" strokeWidth="1.6" fill="none" />
                  <path d="M10 22 L10 10 Q13 8.4 16 10 L16 22" stroke="currentColor" strokeWidth="1" fill="none" />
                  <path d="M12.2 22 L12.2 13.6 Q13 13.2 13.8 13.6 L13.8 22" stroke="currentColor" strokeWidth="0.7" fill="none" />
                </svg>
              </button>
              {hovered === 'explore-window' ? (
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
                  explore inside — walk the habitat; the shell stays behind you
                  {!exEnabled && explore.reason ? (
                    <span style={{ opacity: 0.6 }}> — {explore.reason}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })()
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// H2 — THE FOLD GATE panel (the 7th word's affordance): the person writes the
// rim's own gluing word — edge taps pair (a·a, b·b, …), the arrow per pair is
// the mode, the preview is the committed dry-run's OWN certificate, and the
// commit runs the committed execute. Pure presentation: every number and every
// refusal in here arrives from handGestureModel/customGluing verbatim.
// Wording = the designer's plate (working text; his craft-pass refines).
// ---------------------------------------------------------------------------

const PAIR_LETTERS = 'abcdefgh';

// GAP2B — the THICKEN panel (the 8th word's affordance): the combine's own
// TWO-FORM selection (click + shift-click), NO port-face pick — thicken
// products whole forms. The VIEW assigns the roles by the committed Q1 gate
// (the operand passing it is the SEGMENT, the other the SHAPE) and hands the
// sentence down; the panel only shows it and fires the arity-2 store door.
export function ThickenGatePanel({
  shapeTitle,
  segmentTitle,
  refusal,
  paper,
  accent,
  onThicken,
  onClose,
}: {
  shapeTitle: string | null; // null ⟺ the roles are refused (see refusal)
  segmentTitle: string | null;
  refusal: string | null; // the refusal copy when neither operand passes Q1
  paper: ChromePaper;
  accent: string;
  onThicken: () => void;
  onClose: () => void;
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
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6, fontVariant: 'small-caps' }}>
          thicken — form × segment
        </div>
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{ border: 'none', background: 'transparent', color: paper.cardInk, cursor: 'pointer', fontSize: 13, opacity: 0.6 }}
        >
          ×
        </button>
      </div>
      {refusal === null && shapeTitle !== null && segmentTitle !== null ? (
        <>
          <div style={{ marginTop: 4 }}>
            <span style={{ opacity: 0.65 }}>shape </span>
            <b>{shapeTitle}</b>
          </div>
          <div>
            <span style={{ opacity: 0.65 }}>segment </span>
            <b>{segmentTitle}</b>
          </div>
          <button
            type="button"
            onMouseDown={(e) => {
              e.stopPropagation();
              onThicken();
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
            thicken — the band
          </button>
        </>
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
          {refusal ?? 'Select two placed forms.'}
        </div>
      )}
    </div>
  );
}

export function FoldGatePanel({
  title,
  state,
  preview,
  commitEnabled,
  paper,
  accent,
  markColors,
  onToggleMode,
  onCommit,
  onClose,
}: {
  title: string;
  state: FoldState;
  preview: GluingPreviewResult | null; // null ⟺ no pairs yet
  commitEnabled: boolean;
  paper: ChromePaper;
  accent: string;
  // B-105 W3 §1 (P.2/P.6): the pick moved to the FIGURE — the panel lists no
  // edges and carries no address; each pair row wears ITS OWN figure hue so
  // the row and the drawn mark agree by color (one hue to a pair)
  markColors: string[];
  onToggleMode: (pairIndex: number) => void;
  onCommit: () => void;
  onClose: () => void;
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
        fontSize: 13,
        lineHeight: 1.5,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6, fontVariant: 'small-caps' }}>
          the fold — write the rim&apos;s own word
        </div>
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{ border: 'none', background: 'transparent', color: paper.cardInk, cursor: 'pointer', fontSize: 13, opacity: 0.6 }}
        >
          ×
        </button>
      </div>
      <div style={{ marginTop: 2, fontWeight: 700, fontSize: 13.5 }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 11, opacity: 0.75 }}>
        tap two EDGES → they pair (a·a). the arrow is the mode: →→ same sense = glue · →⇄ opposed = flip-glue
      </div>
      {/* B-105 W3 §1 (P.1/P.6): the edge list is GONE — the person taps the
          two edges ON THE DRAWN POLYGON; `e0, e1` live only in the committed
          record. The pending half-pair is marked ON THE FIGURE (dashed — her
          ratified legend), never restated here; no new sentence is authored
          (W3 §6's bar). */}
      {state.pairs.map((pair, k) => (
        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 5, fontSize: 12 }}>
          <span style={{ fontFamily: 'ui-monospace, monospace', color: markColors[k % markColors.length] }}>
            {PAIR_LETTERS[k] ?? '?'}·{PAIR_LETTERS[k] ?? '?'}
          </span>
          <button
            type="button"
            onMouseDown={(e) => {
              e.stopPropagation();
              onToggleMode(k);
            }}
            title={pair.mode === 'preserving' ? 'same sense — the committed glue' : 'opposed — the committed flip-glue'}
            style={{
              padding: '1px 7px',
              borderRadius: 3,
              border: `1px solid ${paper.cardBorder}`,
              background: 'transparent',
              color: paper.cardInk,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {pair.mode === 'preserving' ? '→→' : '→⇄'}
          </button>
        </div>
      ))}
      <div style={{ marginTop: 9, fontSize: 10.5, letterSpacing: 1, opacity: 0.6, fontVariant: 'small-caps' }}>
        preview — updates per pair
      </div>
      {preview === null ? (
        <div style={{ marginTop: 3, fontSize: 12, fontStyle: 'italic', opacity: 0.7 }}>
          no pairs yet — the word is empty
        </div>
      ) : preview.ok ? (
        <div style={{ marginTop: 3 }}>
          {(
            [
              ['χ (Euler)', String(preview.preview.chi)],
              ['w₁', String(preview.preview.w1)],
              ['orientable', preview.preview.w1 === 0 ? 'yes' : 'no'],
              ['rim', `${preview.preview.freeEdges} edge${preview.preview.freeEdges === 1 ? '' : 's'} free`],
              ['runs', `the committed ${preview.preview.operation}`],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                borderTop: `1px solid ${paper.cardBorder}55`,
                padding: '3px 0 2px',
                fontSize: 12.5,
              }}
            >
              <span style={{ opacity: 0.85 }}>{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            marginTop: 4,
            padding: '5px 8px',
            border: `1px solid ${paper.cardBorder}`,
            borderRadius: 3,
            fontSize: 12,
            fontStyle: 'italic',
            opacity: 0.85,
          }}
        >
          {preview.reason}
        </div>
      )}
      <button
        type="button"
        disabled={!commitEnabled}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (commitEnabled) onCommit();
        }}
        style={{
          marginTop: 10,
          width: '100%',
          padding: '7px 0',
          borderRadius: 3,
          border: `1px solid ${commitEnabled ? accent : paper.cardBorder}`,
          background: 'transparent',
          color: commitEnabled ? accent : paper.cardInk,
          opacity: commitEnabled ? 1 : 0.45,
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: 700,
          fontSize: 13.5,
          cursor: commitEnabled ? 'pointer' : 'default',
        }}
      >
        commit the fold
      </button>
      <div style={{ marginTop: 8, fontSize: 10, fontFamily: 'ui-monospace, monospace', opacity: 0.5 }}>
        commit only when the rim closes
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// H2 — THE CHORD panel (the subdivide gesture): tap two non-adjacent corners,
// read the live split, commit the aimed chord. Serves BOTH entries — the
// general reshape and the combine fork (targetLen non-null ⟺ pre-aimed).
// Pure presentation: the split numbers and every refusal are subdivideFace's
// own, via handGestureModel. Wording = the designer's plate (working text).
// ---------------------------------------------------------------------------

export function ChordGatePanel({
  formTitle,
  faceText,
  corners,
  cornerA,
  cornerB,
  split,
  targetLen,
  paper,
  accent,
  onTapCorner,
  onCommit,
  onClose,
}: {
  formTitle: string;
  faceText: string; // the one face-labeler's honest line for the subject face
  corners: string[]; // the face's own corner ids, rim order
  cornerA: string | null;
  cornerB: string | null;
  split: ChordSplit | null; // null ⟺ fewer than two corners tapped
  targetLen: number | null; // the fork's aim (null on the general entry)
  paper: ChromePaper;
  accent: string;
  onTapCorner: (cornerId: string) => void;
  onCommit: () => void;
  onClose: () => void;
}) {
  const commitEnabled = split !== null && split.ok;
  const matches = (n: number): boolean => targetLen !== null && n === targetLen;
  return (
    <div
      style={{
        position: 'absolute',
        left: 14,
        top: 288,
        width: 264,
        padding: '13px 15px',
        borderRadius: 3,
        background: paper.cardBackground,
        border: `1px solid ${paper.cardBorder}`,
        boxShadow: '0 2px 9px rgba(58, 51, 38, 0.2)',
        color: paper.cardInk,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 13,
        lineHeight: 1.5,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6, fontVariant: 'small-caps' }}>
          subdivide — draw a chord
        </div>
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{ border: 'none', background: 'transparent', color: paper.cardInk, cursor: 'pointer', fontSize: 13, opacity: 0.6 }}
        >
          ×
        </button>
      </div>
      <div style={{ marginTop: 2, fontWeight: 700, fontSize: 13.5 }}>{formTitle}</div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5, opacity: 0.72 }}>{faceText}</div>
      <div style={{ marginTop: 4, fontSize: 11, opacity: 0.75 }}>tap two non-adjacent CORNERS → a chord.</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
        {corners.map((cornerId) => {
          const picked = cornerId === cornerA || cornerId === cornerB;
          return (
            <button
              key={cornerId}
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
                onTapCorner(cornerId);
              }}
              title={cornerId}
              style={{
                padding: '3px 7px',
                borderRadius: 3,
                border: `1px solid ${picked ? accent : paper.cardBorder}`,
                background: 'transparent',
                color: picked ? accent : paper.cardInk,
                fontFamily: 'ui-monospace, monospace',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {cornerId.split(':').pop()}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 9, fontSize: 10.5, letterSpacing: 1, opacity: 0.6, fontVariant: 'small-caps' }}>
        chord preview
      </div>
      {split === null ? (
        <div style={{ marginTop: 3, fontSize: 12, fontStyle: 'italic', opacity: 0.7 }}>
          two corners aim the chord
        </div>
      ) : split.ok ? (
        <div style={{ marginTop: 3 }}>
          {(
            [
              ['this side', split.diskCorners],
              ['that side', split.restCorners],
            ] as const
          ).map(([label, n]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                borderTop: `1px solid ${paper.cardBorder}55`,
                padding: '3px 0 2px',
                fontSize: 12.5,
              }}
            >
              <span style={{ opacity: 0.85 }}>{label}</span>
              <b style={{ color: matches(n) ? accent : paper.cardInk }}>
                {n} edges{matches(n) ? ' — matches' : ''}
              </b>
            </div>
          ))}
          {targetLen !== null ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                borderTop: `1px solid ${paper.cardBorder}55`,
                padding: '3px 0 2px',
                fontSize: 12.5,
              }}
            >
              <span style={{ opacity: 0.85 }}>target</span>
              <b>{targetLen}</b>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          style={{
            marginTop: 4,
            padding: '5px 8px',
            border: `1px solid ${paper.cardBorder}`,
            borderRadius: 3,
            fontSize: 12,
            fontStyle: 'italic',
            opacity: 0.85,
          }}
        >
          {split.reason}
        </div>
      )}
      <button
        type="button"
        disabled={!commitEnabled}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (commitEnabled) onCommit();
        }}
        style={{
          marginTop: 10,
          width: '100%',
          padding: '7px 0',
          borderRadius: 3,
          border: `1px solid ${commitEnabled ? accent : paper.cardBorder}`,
          background: 'transparent',
          color: commitEnabled ? accent : paper.cardInk,
          opacity: commitEnabled ? 1 : 0.45,
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: 700,
          fontSize: 13.5,
          cursor: commitEnabled ? 'pointer' : 'default',
        }}
      >
        commit the chord
      </button>
      {targetLen !== null ? (
        <div style={{ marginTop: 8, fontSize: 10, fontFamily: 'ui-monospace, monospace', opacity: 0.5 }}>
          aim until one side = the target — then combine again
        </div>
      ) : null}
    </div>
  );
}
