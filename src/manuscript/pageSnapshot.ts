// pageSnapshot — THE PAGE FILE (B-2026-08-22-A §2B): the manuscript page as a
// RECORD, not a reading. Serialized: what the person PERFORMED — the written
// forms verbatim (shapes carry their own history: genealogy, generations,
// createdBy chains), the shelf's LOAD-DOOR INPUTS (the original parcel files,
// in load order, + which placements he made), and the domain DOORS' inputs
// (seed shape + his pairing rows + key/title + the D1 metric base). NOT
// serialized: anything derived (complex · tower · laid bodies · renders'
// downstream caches — re-derived on load) and anything transient (selection,
// menus, notices, camera, in-flight gestures) — a restored page comes back
// QUIET; restoring a half-finished gesture restores a state he never chose
// to keep.
//
// #37 GAP 3 (the page serializer follows the same rule): ids are saved and
// restored VERBATIM — the page loader does NO re-namespacing (this is the
// same page coming back, not a foreign universe entering one) and resolves
// NOTHING by suffix. Shelf universes are re-loaded through the committed
// `deserializeSnapshot` with their original sources, whose same-source
// prefixes are idempotent — so a save→load→save→load page carries no nested
// prefixes anywhere.
//
// NON-FORECLOSURE (Arman's clause, verbatim ruled): the version string is
// checked EXACTLY and a mismatch refuses BY NAME — the later, richer
// semantic save arrives as a new version beside this one, never as a rewrite
// of a file that silently reads differently.

import type { Shape } from '../types/geometry';
import type { PlaygroundSnapshotFile } from '../playground/snapshot';
import type { WrittenForm } from './writtenFormModel';
import type { AperturePairRow } from './apertureModel';

export const PAGE_SNAPSHOT_VERSION = 'platonic-engine.manuscript-page.v1' as const;

// the domain doors' input ledger — one entry per act, in the order performed.
// `door` records WHICH exit the person took; hydration re-runs the SAME door.
export interface BuiltDomainRecord {
  door: 'glue' | 'bounded';
  key: string; // `built-${n}` — stable across restore (the counter is saved)
  title: string;
  seed: Shape; // the pointed-at volume, VERBATIM at the moment of the act
  rows: AperturePairRow[]; // the person's pairing rows ([] for `bounded`)
  baseId: string | null; // D1: the inherited metric base (rides the record, never a side-map)
  baseRefusal: string | null; // …or the named ambiguity refusal (amendment 1759)
}

export interface WrittenPageEntry {
  form: WrittenForm;
  home: [number, number, number];
  // §4 (B-2026-08-22-B, the zoo RULED record-not-reading): the positive mark
  // on the reference zoo's own entries — the serializer's exclusion reads it
  // (the zoo's contents never enter the file; the ACT does, as `zooLoaded`)
  zooMember?: true;
}

export interface ManuscriptPageFile {
  version: typeof PAGE_SNAPSHOT_VERSION;
  written: WrittenPageEntry[];
  shelfFiles: PlaygroundSnapshotFile[]; // the load door's inputs, load order
  shelfPlacedShapeIds: string[]; // which loaded forms he placed (namespaced shape ids, verbatim)
  builtRecords: BuiltDomainRecord[];
  builtCount: number; // so future keys never collide with restored ones
  // §4: the ACT "the zoo was loaded" — hydration re-runs the committed door;
  // absent on pre-§4 files (an additive field; the version does not move)
  zooLoaded?: boolean;
}

export interface ManuscriptPageRecords {
  written: WrittenPageEntry[];
  shelfFiles: PlaygroundSnapshotFile[];
  shelfPlacedShapeIds: string[];
  builtRecords: BuiltDomainRecord[];
  builtCount: number;
  zooLoaded: boolean;
}

export function serializePage(records: ManuscriptPageRecords): ManuscriptPageFile {
  return {
    version: PAGE_SNAPSHOT_VERSION,
    // §4: the zoo is the engine's own catalogue — the ACT rides the file
    // (`zooLoaded`), the contents never do (record, not reading)
    written: records.written.filter((entry) => !entry.zooMember),
    shelfFiles: records.shelfFiles,
    shelfPlacedShapeIds: records.shelfPlacedShapeIds,
    builtRecords: records.builtRecords,
    builtCount: records.builtCount,
    zooLoaded: records.zooLoaded,
  };
}

// validation is structural and shallow — the deep truth of each record is
// established by RE-RUNNING the committed doors at hydration (the same code
// that judged the act judges the restore); a record those doors refuse
// surfaces as a named notice, never a crash and never a silent drop.
export function parsePage(raw: unknown): ManuscriptPageRecords {
  const file = raw as Partial<ManuscriptPageFile> | null;
  if (!file || typeof file !== 'object') {
    throw new Error('page: not a manuscript page file');
  }
  if (file.version !== PAGE_SNAPSHOT_VERSION) {
    throw new Error(
      `page: unsupported page version "${String(file.version)}" (expected ${PAGE_SNAPSHOT_VERSION})`,
    );
  }
  if (!Array.isArray(file.written) || !Array.isArray(file.shelfFiles) || !Array.isArray(file.builtRecords)) {
    throw new Error('page: the page file is missing its record arrays — refusing to load');
  }
  const placed = Array.isArray(file.shelfPlacedShapeIds) ? file.shelfPlacedShapeIds : [];
  const count = typeof file.builtCount === 'number' && Number.isFinite(file.builtCount) ? file.builtCount : 0;
  for (const record of file.builtRecords) {
    if (!record || (record.door !== 'glue' && record.door !== 'bounded') || typeof record.key !== 'string') {
      throw new Error('page: a built-domain record is malformed (door/key) — refusing to load');
    }
  }
  return {
    written: file.written,
    shelfFiles: file.shelfFiles,
    shelfPlacedShapeIds: placed,
    builtRecords: file.builtRecords,
    builtCount: count,
    // §4: absent on pre-§4 files — the act was not recorded, so it did not happen
    zooLoaded: file.zooLoaded === true,
  };
}
