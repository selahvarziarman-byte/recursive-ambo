// orderTrace — STAMP B-3: the order surface's trace WINDOW, one producer.
//
// The trace ratchets one letter per door crossing for the life of the
// window; the TALLY counts the whole of it. The trace LINE, though, shows
// only the newest TRACE_WINDOW letters — a window, not the whole — and two
// marks ruled to be read together must not describe different spans in
// silence (B-3 item 2). So the elision that stands where the older letters
// were STATES ITS COUNT (item 1): the mark claims exactly what the line does
// not show, and nothing else (LAW 23 — a mark may claim only what the eye can
// check: hidden + shown === the trace's length, pinned). The count is the
// same precedent as the return ordinal: the two-slot log's truncation made
// honest by a number.
//
// The mark is a mark ON the line, never a letter IN the run (item 3): the
// view renders it in its own span with its own tracking; this module only
// mints its text. Pure; view-side; no engine import.

export const TRACE_WINDOW = 40;

export interface TraceWindow {
  hidden: number; // letters older than the window — the elision's count
  shown: string; // the newest letters, a SUFFIX of the trace (elision from the left)
}

export function windowTrace(trace: string, limit: number = TRACE_WINDOW): TraceWindow {
  const width = Math.max(0, Math.floor(limit));
  const hidden = Math.max(0, trace.length - width);
  return { hidden, shown: hidden > 0 ? trace.slice(hidden) : trace };
}

// the mark's text — empty (a TRUE ABSENCE, nothing rendered) while nothing
// is hidden; the count with the panel's own separator once something is
export function elisionMark(hidden: number): string {
  return hidden > 0 ? `${hidden} hidden · ` : '';
}

// B-3 item 4 — THE SENTENCE, minted here so the view can reserve its slot by
// the producer's own longest output. Measured at a narrow panel: the fired
// sentence wrapped to two lines and the return line below it moved 18px —
// a strip that jumps under a walking eye. The reserved blank is therefore
// sized to what WILL come, at whatever width the panel has: an invisible
// copy of the longest sentence holds the slot; the live text lies over it.
// The second clause is the view's to license (LAW 20 — the position-return
// machinery alone); this function only spells it.
export function cancelSentence(home: boolean): string {
  return `every door you opened, you closed — and ${home ? 'here you are, home' : 'you are not home'}`;
}

export const LONGEST_CANCEL_SENTENCE: string = [cancelSentence(true), cancelSentence(false)].reduce((a, b) =>
  b.length > a.length ? b : a,
);

// ═══ STAMP K-1 — THE KEYBOARD WALK: the doors already know their own names ══
//
// A crossing writes its door's LETTER on the trace line (side `a` → lowercase,
// the inverse side → CAPITAL) — the gluing-word vocabulary the person is
// already reading. K-1 binds the KEY to the DOOR by that same letter, so the
// letter producer lives HERE and serves both readings: what the trace spells
// and what a keystroke addresses. `KeyboardEvent.key` IS the letter — shift
// already yields the capital — so there is no key table to drift from the
// trace's own spelling, and no second vocabulary anywhere.

export interface DoorMark {
  pair: number;
  side: 'a' | 'b';
}

// the shape the walk's own face record already has; declared structurally so
// this module imports nothing (types flow down, never up)
export interface LetteredFace {
  n: readonly number[]; // outward unit normal
  d: number; // plane offset: dot(p, n) = d
  door?: DoorMark | null;
}

/** The letter a keystroke types. On a real keyboard `KeyboardEvent.key`
 * already spells the capital when shift is held; this states the rule ONCE so
 * the reading never depends on how a platform — or a driver injecting keys —
 * spells the event: SHIFT MEANS THE INVERSE SIDE, and the inverse side is what
 * the trace writes as a capital. (Measured 2026-09-10: the in-app browser's
 * own injection delivers `key: 'a'` with `shiftKey: true`, and without this
 * rule the inverse door was unreachable by any instrument but a hand.) */
export function letterForKey(key: string, shift: boolean): string {
  return shift ? key.toUpperCase() : key;
}

export function doorLetter(door: DoorMark): string {
  return String.fromCharCode((door.side === 'a' ? 97 : 65) + door.pair);
}

/** The face a typed letter addresses — `-1` when the letter names no door of
 * THIS room. An unbound key does nothing and mints nothing: the vocabulary is
 * the doors', never the keyboard's. */
export function faceForLetter(faces: readonly LetteredFace[], key: string): number {
  if (key.length !== 1) return -1; // 'Shift', 'Escape', 'Enter' … are not letters
  for (let i = 0; i < faces.length; i += 1) {
    const door = faces[i].door;
    if (door && doorLetter(door) === key) return i;
  }
  return -1;
}

/** The room's own width across the pairing this door belongs to: the distance
 * between the door's plane and its PARTNER's (the two carry reversed outward
 * normals, so the offsets add). It is the PERIOD a crossing covers — walk this
 * far along the door's normal and the room's own identification has put the
 * eye where the crossing leaves it, which is why a keyed crossing is a walk of
 * exactly this length and not a jump to the plane. Falls back to twice the
 * door's own offset if the room records no partner; `0` on a face with no
 * door (unreachable through `faceForLetter`, total anyway). */
export function crossingSpan(faces: readonly LetteredFace[], index: number): number {
  const face = faces[index];
  const door = face?.door;
  if (!door) return 0;
  for (let i = 0; i < faces.length; i += 1) {
    const other = faces[i].door;
    if (i !== index && other && other.pair === door.pair && other.side !== door.side) {
      return face.d + faces[i].d;
    }
  }
  return 2 * face.d;
}
