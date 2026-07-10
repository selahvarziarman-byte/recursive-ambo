// liftStore — P1b: the ambo→manuscript lift CHANNEL (the shell's bridge content).
//
// The two modules are separately mounted (P1a) and the manuscript's shelf is
// LOCAL component state, so a lift needs a minimal shared channel: the ambo
// lift action PUSHES a serialized snapshot here; the Manuscript DRAINS the
// queue into its shelf through the committed `loadUniverseSnapshot` (the same
// path as the file picker — this store never loads, never parses, never
// touches a live universe: it carries FILES, names not doorways).
//
// DURABLE: a module-singleton Zustand store — the queue holds even while the
// Manuscript is unvisited (it is lazy-mounted); the first mount drains it.
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
  drain: () => LiftedSnapshotItem[];
}

let liftSequence = 0;

export const useLiftStore = create<LiftChannelState>((set, get) => ({
  queue: [],
  push: (item) => {
    liftSequence += 1;
    set({ queue: [...get().queue, { ...item, key: liftSequence }] });
  },
  drain: () => {
    const items = get().queue;
    if (items.length > 0) set({ queue: [] });
    return items;
  },
}));
