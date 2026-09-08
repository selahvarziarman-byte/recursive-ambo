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
