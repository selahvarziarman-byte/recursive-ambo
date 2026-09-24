// exploreRead — C-12a item 7 (§144, Δ95): THE EXPLORE ROOM'S GUARDED READ SAYS ITS REFUSAL.
//
// The walk window's room is read from the domain (the cell surface) and, for a built room, the cargo's room from the
// built record and the carried record. That read can THROW on a form the engine cannot read as a solid (measured: the
// gen-2 corner cell lifted with its neighbours' finer grain — the level-3 link extractor refuses an edge on 0 of the
// cell's faces). The view used to catch the throw and return null — the window simply did not open, and from the
// person's chair a silent null is indistinguishable from nothing having happened. Here the throw becomes a POSITIVE
// MARK in the one refusal grammar (`cannot walk this room — …: <the engine's own reason>`), returned beside the room
// it replaces; the view prints it in the door's refusal register. React-free; nothing stored; derived at every read.

import type { Shape } from '../types/geometry';
import { readCellSurface, type AperturePairRow, type ApertureCellSurface } from './apertureModel';
import { cargoRoomOf, type CargoRoom } from './cargoModel';

export interface ExploreRead {
  cellSurface: ApertureCellSurface;
  cargoRoom: CargoRoom | null;
}

export interface ExploreReadRefusal {
  refusal: string;
}

/** the refusal's words, in the one grammar: what was refused — the engine's own reason, carried, never paraphrased */
export function exploreRefusalWords(thrown: unknown): string {
  const reason = thrown instanceof Error ? thrown.message : String(thrown);
  return `cannot walk this room — its surface could not be read: ${reason}`;
}

/** the room read for the walk: the cell surface, and the cargo's room when the room was BUILT from a record; a throw
 * anywhere in the read is returned as its refusal, never swallowed */
export function exploreReadOf(args: {
  domain: Parameters<typeof readCellSurface>[0];
  coneEdgesDeclared: boolean;
  model: Parameters<typeof readCellSurface>[2];
  built: { seed: Shape; rows: AperturePairRow[] } | null;
  ancestors: Shape[];
  resolveAbsent: Parameters<typeof cargoRoomOf>[4];
}): ExploreRead | ExploreReadRefusal {
  try {
    const cellSurface = readCellSurface(args.domain, args.coneEdgesDeclared, args.model);
    const cargoRoom = args.built ? cargoRoomOf(args.built.seed, args.ancestors, args.built.rows, cellSurface, args.resolveAbsent) : null;
    return { cellSurface, cargoRoom };
  } catch (thrown) {
    return { refusal: exploreRefusalWords(thrown) };
  }
}
