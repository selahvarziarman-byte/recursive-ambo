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


// ═══ STAMP K-2a — THE WALK KEYS (Arman, verbatim: "we meant for the keyboard
// control to be the complete control") ═══════════════════════════════════════
// Everything the pointer does, by keys: WALK forward/back while held, TURN
// left/right and LOOK up/down while held. The table is stated ONCE, here,
// beside the letter rule, so the view, the panel line and the witness read
// one vocabulary.
//
// ⛔ THE ALPHABET IS THE DOORS'. K-1 gave every door its letter — side a in
// lowercase, the inverse a capital — and the doors are numbered from `a`, so
// `a` is a door in EVERY room and `d`/`e` are doors in every six-pairing room
// (Seifert–Weber, Poincaré). A walk bound to W/A/S/D would cross door `a` when
// the hand meant to turn left. So a walk key is NEVER a single character, BY
// CONSTRUCTION (`walkKeyAct` refuses one before it reads the table): the walk
// keys are the arrows and the page keys, and no room of up to 26 pairings can
// ever have a door and a walk act share a key. Both spellings of "forward" the
// mandate named would have needed a letter; the measurement above is why the
// table carries one spelling, named in the panel line.
export type WalkAct = 'forward' | 'back' | 'left' | 'right' | 'up' | 'down' | 'faceDoor' | 'entryLook';

export const WALK_KEYS: ReadonlyArray<readonly [key: string, act: WalkAct]> = [
  ['ArrowUp', 'forward'],
  ['ArrowDown', 'back'],
  ['ArrowLeft', 'left'],
  ['ArrowRight', 'right'],
  ['PageUp', 'up'],
  ['PageDown', 'down'],
  // STAMP K-2c — the two snaps ruled lawful on their face: FACE THE NEAREST
  // DOOR squarely (a wall the person can see, LAW 20) and FACE AS YOU ENTERED
  // (the entry orientation carried along the walker's own path). Non-letter,
  // non-walk keys, as the alphabet law binds.
  ['End', 'faceDoor'],
  ['Home', 'entryLook'],
];

/** The walk act a key is bound to, or null. `KeyboardEvent.key` is the input;
 * a single character (any letter, digit or symbol) is refused before the table
 * is read — the doors own the alphabet. */
export function walkKeyAct(key: string): WalkAct | null {
  if (key.length === 1) return null;
  for (const [bound, act] of WALK_KEYS) if (bound === key) return act;
  return null;
}
