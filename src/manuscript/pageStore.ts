// pageStore — THE MANUSCRIPT PAGE, RELOCATED (B-2026-08-22-A §2A): Arman's
// ruling, verbatim — "manuscript is exactly like ambo" — and Ambo has a
// STORE half (the page survives navigating away and an unmount, within a
// session) beside its FILE half. The manuscript's durable state lived in
// component useState and died with every unmount; it lives HERE now, module
// scope, single source of truth. The setters keep the exact useState updater
// signature so the view's call sites did not have to move.
//
// TWO LAYERS, deliberately:
//   · the LIVE layer — written · shelf entries · laid bodies · built domains
//     · folded bodies · the D1 metric maps. Derived objects ride in memory
//     (a DomainModel carries functions; it is never serialized).
//   · the RECORD layer — the inputs ledger the FILE serializes: the shelf's
//     load-door files, the person's placements, and each domain door's
//     inputs (door · seed · rows · key/title · base). RECORD, not READING:
//     hydration re-runs the SAME committed doors over these records.
//
// #37 GAP 3: hydration restores ids VERBATIM (no re-namespacing — this is
// the same page returning, not a foreign universe entering one) and resolves
// nothing by suffix; shelf universes re-load through the committed
// `deserializeSnapshot`, whose same-source prefixes are idempotent — a
// save→load→save→load page nests nothing.

import { create } from 'zustand';
import type { Shape } from '../types/geometry';
import type { PlaygroundSnapshotFile } from '../playground/snapshot';
import type { DomainModel } from './worldModel';
import type { WrittenForm } from './writtenFormModel';
import type { ShelfEntry } from './genesisModel';
import { loadUniverseSnapshot } from './genesisModel';
import type { LaidBodyModel } from './laidBodyModel';
import { tryLaidBodyModel } from './laidBodyModel';
import type { FoldedDomain, AperturePairRow } from './apertureModel';
import { buildPersonDomainVerdict } from './apertureModel';
import { buildFormDomain } from './formDomainModel';
import type { BuiltDomainRecord, ManuscriptPageRecords, WrittenPageEntry } from './pageSnapshot';

type Updater<T> = T | ((cur: T) => T);
const applyUpdater = <T>(cur: T, next: Updater<T>): T =>
  typeof next === 'function' ? (next as (c: T) => T)(cur) : next;

export interface ShelfItem {
  entry: ShelfEntry;
  placed: boolean;
}

interface ManuscriptPageState {
  // ── the LIVE layer ──
  written: WrittenPageEntry[];
  shelf: ShelfItem[];
  laidBodies: Map<string, LaidBodyModel>;
  builtDomains: DomainModel[];
  foldedBodies: FoldedDomain[];
  metricBaseIds: Record<string, string>;
  metricBaseRefusals: Record<string, string>;
  shelfAncestors: Map<string, Shape[]>; // GAP2C acquire-metadata, keyed by loaded shape id
  builtCount: number;
  // ── the RECORD layer ──
  shelfFiles: PlaygroundSnapshotFile[];
  builtRecords: BuiltDomainRecord[];
  // ── setters (useState-compatible updater signatures) ──
  setWritten: (next: Updater<WrittenPageEntry[]>) => void;
  setShelf: (next: Updater<ShelfItem[]>) => void;
  setLaidBodies: (next: Updater<Map<string, LaidBodyModel>>) => void;
  setBuiltDomains: (next: Updater<DomainModel[]>) => void;
  setFoldedBodies: (next: Updater<FoldedDomain[]>) => void;
  setMetricBaseIds: (next: Updater<Record<string, string>>) => void;
  setMetricBaseRefusals: (next: Updater<Record<string, string>>) => void;
  // ── the doors' record hooks ──
  recordShelfFile: (file: PlaygroundSnapshotFile) => void;
  recordShelfAncestors: (shapeId: string, ancestors: Shape[]) => void;
  recordBuilt: (record: BuiltDomainRecord) => void;
  bumpBuiltCount: () => number; // returns the NEW count (the door's n)
  unbumpBuiltCount: () => void; // a refused door hands its number back
  // ── the file half ──
  pageRecords: () => ManuscriptPageRecords;
  loadPage: (records: ManuscriptPageRecords) => string[]; // named per-record refusals (empty = clean)
}

export const useManuscriptPageStore = create<ManuscriptPageState>((set, get) => ({
  written: [],
  shelf: [],
  laidBodies: new Map(),
  builtDomains: [],
  foldedBodies: [],
  metricBaseIds: {},
  metricBaseRefusals: {},
  shelfAncestors: new Map(),
  builtCount: 0,
  shelfFiles: [],
  builtRecords: [],

  setWritten: (next) => set((s) => ({ written: applyUpdater(s.written, next) })),
  setShelf: (next) => set((s) => ({ shelf: applyUpdater(s.shelf, next) })),
  setLaidBodies: (next) => set((s) => ({ laidBodies: applyUpdater(s.laidBodies, next) })),
  setBuiltDomains: (next) => set((s) => ({ builtDomains: applyUpdater(s.builtDomains, next) })),
  setFoldedBodies: (next) => set((s) => ({ foldedBodies: applyUpdater(s.foldedBodies, next) })),
  setMetricBaseIds: (next) => set((s) => ({ metricBaseIds: applyUpdater(s.metricBaseIds, next) })),
  setMetricBaseRefusals: (next) => set((s) => ({ metricBaseRefusals: applyUpdater(s.metricBaseRefusals, next) })),

  recordShelfFile: (file) => set((s) => ({ shelfFiles: [...s.shelfFiles, file] })),
  recordShelfAncestors: (shapeId, ancestors) =>
    set((s) => ({ shelfAncestors: new Map(s.shelfAncestors).set(shapeId, ancestors) })),
  recordBuilt: (record) => set((s) => ({ builtRecords: [...s.builtRecords, record] })),
  bumpBuiltCount: () => {
    const n = get().builtCount + 1;
    set({ builtCount: n });
    return n;
  },
  unbumpBuiltCount: () => set((s) => ({ builtCount: Math.max(0, s.builtCount - 1) })),

  pageRecords: () => {
    const s = get();
    return {
      written: s.written,
      shelfFiles: s.shelfFiles,
      shelfPlacedShapeIds: s.shelf.filter((i) => i.placed).map((i) => i.entry.loaded.shape.id),
      builtRecords: s.builtRecords,
      builtCount: s.builtCount,
    };
  },

  // hydration — the RECORDS through the SAME committed doors, in the order
  // the person performed them. Per-record guarded: a refused record becomes
  // a NAMED line for the panel's notice, never a crash and never a silent
  // drop. The restored page is QUIET (no selection, no notices restored).
  loadPage: (records) => {
    const refusals: string[] = [];
    const shelf: ShelfItem[] = [];
    const shelfAncestors = new Map<string, Shape[]>();
    const placedIds = new Set(records.shelfPlacedShapeIds);
    for (const file of records.shelfFiles) {
      try {
        const entry = loadUniverseSnapshot(file);
        if (entry.loaded.ancestors?.length) shelfAncestors.set(entry.loaded.shape.id, entry.loaded.ancestors);
        shelf.push({ entry, placed: placedIds.has(entry.loaded.shape.id) });
      } catch (error) {
        refusals.push(`shelf load refused: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    const laidBodies = new Map<string, LaidBodyModel>();
    for (const { form } of records.written) {
      if (form.render.mode === 'classBody') {
        try {
          const laid = tryLaidBodyModel(form.shape, shelfAncestors.get(form.shape.id) ?? null);
          if (laid) laidBodies.set(form.shape.id, laid);
        } catch {
          // a body that cannot re-lay draws through its router's fallback —
          // the form itself is intact; nothing is dropped
        }
      }
    }
    const builtDomains: DomainModel[] = [];
    const foldedBodies: FoldedDomain[] = [];
    const metricBaseIds: Record<string, string> = {};
    const metricBaseRefusals: Record<string, string> = {};
    for (const record of records.builtRecords) {
      try {
        if (record.door === 'bounded') {
          builtDomains.push(buildFormDomain(record.seed, [], record.key, record.title));
        } else {
          const verdict = buildPersonDomainVerdict(record.seed, record.rows, record.key, record.title);
          if (verdict.folded) foldedBodies.push(verdict.body);
          else builtDomains.push(verdict.domain);
        }
        if (record.baseId) metricBaseIds[record.key] = record.baseId;
        else if (record.baseRefusal) metricBaseRefusals[record.key] = record.baseRefusal;
      } catch (error) {
        refusals.push(
          `"${record.title}" refused on restore: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    set({
      written: records.written,
      shelf,
      shelfAncestors,
      laidBodies,
      builtDomains,
      foldedBodies,
      metricBaseIds,
      metricBaseRefusals,
      builtCount: records.builtCount,
      shelfFiles: records.shelfFiles,
      builtRecords: records.builtRecords,
    });
    return refusals;
  },
}));
