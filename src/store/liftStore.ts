// liftStore — P1b: the ambo→manuscript lift CHANNEL (the shell's bridge content).
//
// The two modules are separately mounted (P1a) and the manuscript's shelf is
// LOCAL component state, so a lift needs a minimal shared channel: the ambo
// lift action PUSHES a serialized snapshot here; the Manuscript DRAINS the
// queue into its shelf through the committed `loadUniverseSnapshot` (the same
// path as the file picker — this store never loads, never parses, never
// touches a live universe: it carries FILES, names not doorways).
//
// DURABLE + RETAINED (R1.2, the fresh-session drain): a module-singleton
// Zustand store — the queue holds while the Manuscript is unvisited AND is
// never destructively drained. React 18 StrictMode replays the consumer's
// first mount, and a one-shot drain RACES that replay — measured both ways on
// the same bytes (the lift lost in one run; arrived seconds late in another).
// The channel therefore RETAINS its items and the consumer ingests
// IDEMPOTENTLY, keyed by each item's own `key` (the protocol's idempotence
// token — no runtime guard minted): no lift is lost under any replay, none is
// doubled, and the production single-mount behavior is unchanged. One
// consumer exists (ManuscriptView's shelf effect — counted at cut time); a
// FRESH consumer instance re-ingests the retained queue into its fresh
// shelf, which is the correct semantics for a shelf that lives in that
// instance's own state.
//
// ADDITIVE: nothing committed moves; the shelf's file-load path is untouched.

import { create } from 'zustand';
import type { PlaygroundSnapshotFile } from '../playground/snapshot';

export interface LiftedSnapshotItem {
  key: number; // channel-local ordering key
  title: string; // display name for notices/shelf context
  file: PlaygroundSnapshotFile; // the committed snapshot file, verbatim
}

interface LiftChannelState {
  queue: LiftedSnapshotItem[];
  push: (item: Omit<LiftedSnapshotItem, 'key'>) => void;
}

let liftSequence = 0;

export const useLiftStore = create<LiftChannelState>((set, get) => ({
  queue: [],
  push: (item) => {
    liftSequence += 1;
    set({ queue: [...get().queue, { ...item, key: liftSequence }] });
  },
}));
