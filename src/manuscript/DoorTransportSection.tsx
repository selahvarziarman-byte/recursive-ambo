// DoorTransportSection — STAMP C-11a (2026-09-24): THE DOOR's ACT at the pairing row (§133 — Option R: the ROOM's door;
// the surface the designer's 1500 §1, placed where the door is given). The section draws what doorTransportModel returns:
//   · the empty state — a positive mark: `the door … — glued by you · carries no concept yet: a cargo crossing it arrives
//     did not return`;
//   · the corners of the door, each with the roles of both sides in the caster's order — nothing offered, nothing lit;
//     point a role at one side's corner, then a role at the other's;
//   · TAKEN — the WHOLE line-pair, marked `yours · a whole line`, ONE hand: `withdraw the line F1 ↦ T3` (the edges force the
//     line; a per-pair hand would offer an undo the structure does not have);
//   · REFUSED — by the lines at the edge where they part, by the record at a corner with the tuple named, by the form —
//     the one grammar (`not taken — …` · `here, at the door: withdraw this attempt`);
//   · a role that can never cross, said ONCE for the door, quietly; the absences of C-10 where the form carries no record.
// View seam; NOT_FROZEN; ratified by scripts/diagnose-the-doors-act.cjs and the concept-layer eye leg.

import { doorHandWords, emptyDoorWords, type DoorReading } from './doorTransportModel';

export interface DoorRowView {
  faceA: string; // D14 names, never ids
  faceB: string;
  state: 'read' | 'absent' | 'no-record' | 'born-on-page';
  absence: string | null; // the words for a door that reads no record
  reading: DoorReading | null;
  pick: { corner: number; side: 'A' | 'B'; role: string } | null;
  notice: string | null; // the last TAKEN sentence
  refusal: string | null; // the standing refusal's words — `not taken — …`
}

const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;

export function DoorTransportSection({
  door,
  onPick,
  onWithdrawLine,
  onWithdrawAttempt,
  paper,
}: {
  door: DoorRowView;
  onPick: (corner: number, side: 'A' | 'B', role: string) => void;
  onWithdrawLine: (key: string) => void;
  onWithdrawAttempt: () => void;
  paper: { cardBackground: string; cardBorder: string; cardInk: string };
}) {
  const mono = { fontFamily: 'ui-monospace, monospace', fontSize: 10.5 } as const;
  const hand = {
    border: 'none',
    background: 'transparent',
    color: paper.cardInk,
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
    ...mono,
  } as const;
  const chip = (picked: boolean, taken: boolean) =>
    ({
      ...mono,
      padding: '1px 5px',
      marginRight: 3,
      marginBottom: 3,
      borderRadius: 3,
      cursor: 'pointer',
      background: paper.cardBackground,
      color: paper.cardInk,
      border: `1px ${picked ? 'solid' : taken ? 'solid' : 'dashed'} ${paper.cardBorder}`,
      fontWeight: taken ? 700 : 400,
      outline: picked ? `2px solid ${paper.cardInk}` : 'none',
    }) as const;
  const r = door.reading;
  return (
    <div data-door={`${door.faceA}→${door.faceB}`} data-door-state={door.state} data-door-pairs={r ? r.pairs : 0} data-door-lines={r ? r.lines.length : 0} style={{ marginTop: 6, paddingTop: 5, borderTop: `1px dotted ${paper.cardBorder}`, fontSize: 11.5, lineHeight: 1.45 }}>
      {door.state !== 'read' || !r ? (
        <div data-door-absence={door.state} style={{ fontStyle: 'italic', opacity: 0.8 }}>
          {door.absence}
        </div>
      ) : (
        <>
          {r.lines.length === 0 ? (
            <div data-door-empty="true">{emptyDoorWords(door.faceA, door.faceB)}</div>
          ) : (
            <div data-door-head="true">{`the door ${door.faceA} → ${door.faceB} — glued by you · carries ${plural(r.pairs, 'role pair', 'role pairs')} on ${plural(r.lines.length, 'whole line', 'whole lines')}`}</div>
          )}
          {r.lines.map((l) => (
            <div key={l.key} data-door-line={l.key} data-door-line-kind={l.kind} data-door-line-pairs={l.pairs.length} style={{ marginTop: 3 }}>
              <span data-door-line-words="true">{l.words}</span>
              <span style={{ marginLeft: 6 }}>
                <button type="button" data-door-withdraw-line={l.key} style={hand} onMouseDown={(e) => e.stopPropagation()} onClick={() => onWithdrawLine(l.key)}>
                  {l.hand}
                </button>
              </span>
            </div>
          ))}
          {door.notice ? (
            <div data-door-taken="true" style={{ marginTop: 3 }}>
              {door.notice}
            </div>
          ) : null}
          {door.refusal ? (
            <div data-door-refusal="true" style={{ marginTop: 3, padding: '3px 6px', border: `1px solid ${paper.cardBorder}`, borderRadius: 3 }}>
              <span data-door-refusal-words="true" style={{ display: 'block' }}>{door.refusal}</span>
              <button type="button" data-door-withdraw-attempt="true" style={hand} onMouseDown={(e) => e.stopPropagation()} onClick={onWithdrawAttempt}>
                {doorHandWords}
              </button>
            </div>
          ) : null}
          {r.corners.map((c) => (
            <div key={c.index} data-door-corner={c.index} data-door-corner-pair={`${c.aLabel}→${c.bLabel}`} style={{ marginTop: 5 }}>
              <div style={{ opacity: 0.7 }}>{`at ${c.aLabel} → ${c.bLabel}`}</div>
              {(['A', 'B'] as const).map((side) => {
                const roles = side === 'A' ? c.aRoles : c.bRoles;
                const label = side === 'A' ? c.aLabel : c.bLabel;
                return (
                  <div key={side} data-door-side={side} data-door-side-corner={label} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline' }}>
                    <span style={{ ...mono, opacity: 0.6, marginRight: 5 }}>{side === 'A' ? `${label} ↦` : `↦ ${label}`}</span>
                    {roles.map((role) => {
                      const picked = door.pick !== null && door.pick.corner === c.index && door.pick.side === side && door.pick.role === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          data-door-role={`${c.index}|${side}|${role.id}`}
                          data-door-role-name={role.name}
                          data-door-role-crosses={role.crosses ? 'true' : 'false'}
                          {...(role.partner !== null ? { 'data-door-role-taken': role.partner } : {})}
                          {...(picked ? { 'data-door-role-picked': 'true' } : {})}
                          title={role.partner !== null ? `yours: ${side === 'A' ? `${role.name} ↦ ${role.partner}` : `${role.partner} ↦ ${role.name}`}` : undefined}
                          style={chip(picked, role.partner !== null)}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => onPick(c.index, side, role.id)}
                        >
                          {role.name}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
          {r.cannotCross ? (
            <div data-door-cannot-cross="true" style={{ marginTop: 4, fontSize: 10.5, fontStyle: 'italic', opacity: 0.6 }}>
              {r.cannotCross}
            </div>
          ) : null}
          {!r.lawful ? (
            <div data-door-unlawful="true" style={{ marginTop: 4, fontSize: 10.5, fontStyle: 'italic', opacity: 0.8 }}>
              {'the transport this door carries does not descend on the record as it now stands — withdraw its lines and give them again'}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
