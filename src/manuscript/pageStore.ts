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

// ═══ P5 — THE THREE ACTS, AND WHY THIS IS A LEDGER AND NOT A STACK ══════════
// RULED (researcher): *you can never erase a TRACE; you can only ADD one.*
//   · removal is a traced DEATH · undo is a traced REVERT.
//   · THE RECORD RATCHETS — it grows and never shrinks.
//   · THE LIVE PAGE DOES NOT — a form can die, an act can revert.
// ⛔ SO `acts` IS APPEND-ONLY, ALWAYS. An undo does not POP it; an undo
// APPENDS an act of its own naming what it reverted. A stack would make undo
// a history-rewrite, which is the one thing this module's own git doctrine
// forbids one register up (*revert, never reset — a revert leaves the record
// of what happened*). If you are ever tempted to `pop()` here, that is the
// disease and not the fix.

// ⛔⛔ B-119 §3 — THE RECORD MAY NOT BE MUTABLE THROUGH THE LIVE PAGE.
// `WrittenPageEntry.home` is an ARRAY, and storing an entry on an act stored a
// REFERENCE to it — measured by identity: `act.entry.home === entry.home` was
// true. ⇒ Remove Torus at H1 → undo → drag it to H2, and with an in-place
// write the ACT RECORD of *"removed Torus from H1"* silently becomes
// *"removed Torus from H2"*.
// ★★★ A RECORD THAT HOLDS A REFERENCE INTO LIVE STATE IS A RECORD THAT CAN BE
// REWRITTEN WITHOUT BEING WRITTEN TO. The ledger's append-only-ness is TRUE at
// every site — three appends, no pop/splice/shift — and the CONTENT still
// changes. Append-only is not enough when the appended thing is an alias.
// ⇒ THE SITE IS SNAPSHOTTED AT THE ACT: `home` is copied, so the record holds
// a FACT AS OF THE REMOVAL and not a view of a live array. ⚠ The FORM object
// is deliberately NOT copied — its identity is what the DAG is keyed on, and
// only the mutable position needed freezing.
const frozenSite = (entry: WrittenPageEntry): WrittenPageEntry => ({
  ...entry,
  home: [entry.home[0], entry.home[1], entry.home[2]],
});

export type PageActKind = 'remove' | 'set-aside' | 'undo';

export interface PageAct {
  id: string; // stable, so an undo can NAME what it reverted rather than count backwards
  kind: PageActKind;
  formId: string;
  name: string; // the form's own name at the time of the act — the memorial's M.2
  /** remove / set-aside: the entry as it stood, so the revert returns it whole
   * TO ITS SITE (the designer's §5 mechanism clause). */
  entry?: WrittenPageEntry;
  /** set-aside only: the shelf entry it came from, if it came from one — the
   * shelf is where a set-aside form WAITS, and only a shelf-born form has one. */
  shelfShapeId?: string | null;
  /** undo only: the id of the act it reverted. */
  ofActId?: string;
  ofKind?: PageActKind;
}

/**
 * P5 M.1–M.5 — THE MARK AT THE FORM'S OWN SITE.
 * ⛔ M.1: the site keeps a mark, because A FORM THAT SIMPLY VANISHES IS
 * INDISTINGUISHABLE FROM A CAMERA MOVE — the designer proved that on herself.
 * ⛔ M.3: the word is `removed`, not `died`: same mechanism, two words, and
 * the difference is AGENCY — `died` is what happens to a concept inside an op;
 * `removed` is what happens when HE does it.
 * ⛔ §5 / the researcher's strengthening: an undo does NOT erase the death.
 * The RECORD keeps `removed, then restored` permanently; on the LIVE PAGE the
 * absence-memorial YIELDS to the returned form and the return posts its own
 * positive `restored` mark — so the page never shows a `removed` ghost
 * BENEATH a present form, which would say gone-and-here at once.
 */
export interface RemovalMark {
  formId: string;
  /** ⛔ NO FORCED CASCADE (researcher): removing a parent does NOT remove the
   * child it begot — begetting cannot be un-done by removing the parent. The
   * child stands and its lineage keeps naming its parent, so the RECORD needs
   * the removed form's SHAPE id to go on naming it. (The record survives by
   * the committed mechanism already: `genesisStoryShapes` collects
   * `entry.form.parentShape`, so a child holds its parent's Shape in the DAG
   * even after the parent leaves the page — what it lacked was the NAME.) */
  shapeId: string;
  name: string;
  home: [number, number, number];
  restored: boolean; // the memorial GAINS a return; it never loses its death
}

// §7 (B-2026-08-24-B, RULED): THE STANDING UNSAVED MARK's fact — "there is
// work here that is not written down" is a POSITIVE fact: the RECORD layer
// (exactly what the page FILE serializes) differs from the last save/load.
// The signature reads ids and counts only, so it recomputes cheaply on any
// store change: written forms MINUS zoo members (the serializer's own
// exclusion — the zoo re-summon on restore must never read as unsaved
// work), the shelf's load-door files, the person's placements, the built
// ledger, the count, the zoo act. A page holding nothing beyond its last
// writing is the ORDINARY case and carries NO mark (a mark on the
// unremarkable stops meaning anything).
export const pageSignatureOf = (s: {
  written: WrittenPageEntry[];
  shelf: ShelfItem[];
  shelfFiles: PlaygroundSnapshotFile[];
  builtRecords: BuiltDomainRecord[];
  builtCount: number;
  zooLoaded: boolean;
}): string =>
  JSON.stringify([
    s.written.filter((w) => !w.zooMember).map((w) => w.form.id),
    s.shelfFiles.length,
    s.shelf.filter((i) => i.placed).map((i) => i.entry.loaded.shape.id),
    s.builtRecords.length,
    s.builtCount,
    s.zooLoaded,
  ]);
const EMPTY_PAGE_SIGNATURE = JSON.stringify([[], 0, [], 0, 0, false]);

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
  // §4 (B-2026-08-22-B): the ACT "the zoo was loaded" — page state (the flag
  // survives the unmount WITH the forms it explains; component state dying
  // while the store-held forms lived was the latent duplicate-zoo bug)
  zooLoaded: boolean;
  // ── the RECORD layer ──
  shelfFiles: PlaygroundSnapshotFile[];
  builtRecords: BuiltDomainRecord[];
  // ── P5: the acts ledger + the site marks (both RATCHET) ──
  acts: PageAct[];
  removals: RemovalMark[];
  removeForm: (formId: string) => void;
  setAsideForm: (formId: string) => void;
  undoLastAct: () => void;
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
  recordZooLoaded: () => void; // §4: the zoo door's one-way act record
  bumpBuiltCount: () => number; // returns the NEW count (the door's n)
  unbumpBuiltCount: () => void; // a refused door hands its number back
  // ── the file half ──
  pageRecords: () => ManuscriptPageRecords;
  loadPage: (records: ManuscriptPageRecords) => string[]; // named per-record refusals (empty = clean)
  // §7: the record-layer signature at the last save/load; the mark reads
  // `pageSignatureOf(state) !== savedSignature`
  savedSignature: string;
  markPageSaved: () => void;
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
  zooLoaded: false,
  shelfFiles: [],
  builtRecords: [],
  acts: [],
  removals: [],
  savedSignature: EMPTY_PAGE_SIGNATURE,

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
  recordZooLoaded: () => set({ zooLoaded: true }),
  bumpBuiltCount: () => {
    const n = get().builtCount + 1;
    set({ builtCount: n });
    return n;
  },
  unbumpBuiltCount: () => set((s) => ({ builtCount: Math.max(0, s.builtCount - 1) })),
  markPageSaved: () => set((s) => ({ savedSignature: pageSignatureOf(s) })),

  // ═══ P5 · THE ACTS ════════════════════════════════════════════════════════
  // ⛔ REMOVE — a traced DEATH. The live form leaves; the record GAINS. Both
  // halves in one set(), because a page that had lost the form without gaining
  // the trace would be, for that instant, exactly the erasure this forbids.
  removeForm: (formId) =>
    set((s) => {
      const entry = s.written.find((w) => w.form.id === formId);
      if (!entry) return {}; // nothing to remove is not an act — no empty trace
      return {
        written: s.written.filter((w) => w.form.id !== formId),
        acts: [...s.acts, { id: `act:${s.acts.length + 1}:remove:${formId}`, kind: 'remove', formId, name: entry.form.title, entry: frozenSite(entry) }],
        removals: [...s.removals, { formId, shapeId: entry.form.shape.id, name: entry.form.title, home: [entry.home[0], entry.home[1], entry.home[2]], restored: false }],
      };
    }),

  // ⛔ SET ASIDE — *it leaves the page whole and waits; NOTHING DIES.* So it
  // posts NO memorial: the memorial's own justification is the M3 seal, and
  // M3 is about a thing that DIED. A set-aside form is intact and waiting.
  // ⚠ WHERE IT WAITS is the shelf — a shelf-born form's entry simply returns
  // to `placed: false`, the state it was in before he dragged it out, which
  // uses the shelf's existing surface rather than redesigning it (her §6:
  // *the shelf's own surface is untouched*). A form with no shelf entry has
  // nowhere to wait, and the CARD refuses it BY NAME at pick-time rather than
  // here at act-time — a limit found at the act costs the whole act; the same
  // limit at pick-time costs one look.
  setAsideForm: (formId) =>
    set((s) => {
      const entry = s.written.find((w) => w.form.id === formId);
      if (!entry) return {};
      const shelfShapeId = s.shelf.find((i) => i.entry.loaded.shape.id === entry.form.shape.id)?.entry.loaded.shape.id ?? null;
      return {
        written: s.written.filter((w) => w.form.id !== formId),
        shelf: shelfShapeId ? s.shelf.map((i) => (i.entry.loaded.shape.id === shelfShapeId ? { ...i, placed: false } : i)) : s.shelf,
        acts: [...s.acts, { id: `act:${s.acts.length + 1}:set-aside:${formId}`, kind: 'set-aside', formId, name: entry.form.title, entry: frozenSite(entry), shelfShapeId }],
      };
    }),

  // ⛔ UNDO — a traced REVERT, one step, and it APPENDS. U.1: the last act
  // that is not itself an undo and has not already been reverted. ⛔ Walking
  // back to the last UN-REVERTED act is what makes this a revert rather than a
  // stack pop: the ledger keeps every act, and `undo` names the one it
  // reverted by id instead of counting backwards into a mutable history.
  undoLastAct: () =>
    set((s) => {
      const revertedIds = new Set(s.acts.filter((a) => a.kind === 'undo').map((a) => a.ofActId));
      const target = [...s.acts].reverse().find((a) => a.kind !== 'undo' && !revertedIds.has(a.id));
      if (!target || !target.entry) return {}; // nothing to undo — the control is ABSENT, never inert
      const undoAct: PageAct = {
        id: `act:${s.acts.length + 1}:undo:${target.formId}`,
        kind: 'undo',
        formId: target.formId,
        name: target.name,
        ofActId: target.id,
        ofKind: target.kind,
      };
      return {
        // §5 mechanism: the form returns TO ITS SITE — the entry carries its
        // own `home`, so restoring the entry restores the place with it
        written: [...s.written, target.entry],
        shelf: target.shelfShapeId
          ? s.shelf.map((i) => (i.entry.loaded.shape.id === target.shelfShapeId ? { ...i, placed: true } : i))
          : s.shelf,
        acts: [...s.acts, undoAct],
        // ⛔ THE DEATH IS NOT ERASED. The mark stays and GAINS its return; on
        // the page it stops drawing an absence-ghost (the form is back) and
        // starts drawing the return's own positive mark (U.3).
        removals: s.removals.map((m) => (m.formId === target.formId ? { ...m, restored: true } : m)),
      };
    }),

  pageRecords: () => {
    const s = get();
    return {
      written: s.written,
      shelfFiles: s.shelfFiles,
      shelfPlacedShapeIds: s.shelf.filter((i) => i.placed).map((i) => i.entry.loaded.shape.id),
      builtRecords: s.builtRecords,
      builtCount: s.builtCount,
      zooLoaded: s.zooLoaded,
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
        // R1 (B-2026-08-24-B §2): a 'bounded' record with TOUCHED rows
        // replays through the SAME verdict door — the pairs were CONSUMED at
        // the act and the restore reproduces exactly that. A pre-R1 record
        // (rows []) restores its all-walls chamber as recorded — the record
        // is the record. The old unconditional `[]` here was the SECOND site
        // of the fully-glued-or-fully-open assumption.
        const touched = record.rows.some((row) => row.faceA !== null || row.faceB !== null);
        if (record.door === 'bounded' && !touched) {
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
      // §4: the ACT restores; the zoo's FORMS are absent from the file by the
      // serializer's own law — the view re-runs the committed door on seeing
      // the act recorded with no zoo on the page
      zooLoaded: records.zooLoaded,
      shelfFiles: records.shelfFiles,
      builtRecords: records.builtRecords,
      // §7: a freshly loaded page IS written down — the mark starts quiet
      savedSignature: pageSignatureOf({
        written: records.written,
        shelf,
        shelfFiles: records.shelfFiles,
        builtRecords: records.builtRecords,
        builtCount: records.builtCount,
        zooLoaded: records.zooLoaded,
      }),
    });
    return refusals;
  },
}));
