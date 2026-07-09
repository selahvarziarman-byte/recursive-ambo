// genesisModel — Manuscript Phase 3b (the final build): the react-free model of
// the manuscript's MEMORY — birth (the committed assemble), the genealogy
// record, the pentimento/stemma readings, and the sources-shelf load. The
// acceptance diagnostic requires THIS module through the anti-mock hook;
// ManuscriptView consumes it verbatim.
//
// THE FAITHFULNESS GUARD (the law, this phase's face): every genealogical mark
// is the engine's own —
//   · the COMBINE GATE is the committed `canAssemblePair` +
//     `getAssemblePairDisabledReason`, verbatim (visible legality + reason);
//   · the CHILD is the committed `executeAssemblePair` (the real `assemble`;
//     a multi-parent root whose shape-level sources pull back to BOTH parents);
//   · the PENTIMENTO SET is the DAG's OWN consumed population — every shape in
//     the record NOT in `buildGenealogyDag(...).liveAtEnd` (the engine's
//     death-marking: assemble/glue/flip-glue/collapse/cut consume; invoke/
//     patch-lift/dualization do not) — never a chosen visual state;
//   · the STEMMA edges ARE the committed `GenealogyEdge`s, Q3
//     transitive-reduced (`transitiveReduceEdges` — direct parents only);
//   · the RECORD is the same reduced committed DAG, grouped for the foot
//     margin ("what begat what"), with the DAG's integrity verdict surfaced,
//     never hidden;
//   · a LOADED form is the committed `deserializeSnapshot` output, source-
//     namespaced (E1: co-location ≠ identity across universes — a name, not a
//     doorway). A loaded WORD-BORN quotient is HONESTLY unplaceable (its
//     positions are bookkeeping and its parent is not in the file to replay) —
//     refused with the reason, never drawn.
//
// DERIVE-ONLY · ADDITIVE: committed modules by import; the engine, the
// certifiers, and all prior manuscript renderers/models stay byte-unchanged.

import type { Shape, ShapeId } from '../types/geometry';
import {
  canAssemblePair,
  executeAssemblePair,
  getAssemblePairDisabledReason,
} from '../playground/playgroundOperations';
import {
  buildGenealogyDag,
  type GenealogyDag,
  type GenealogyEdge,
} from '../lib/genealogyDag';
import { transitiveReduceEdges } from '../playground/genealogyLayout';
import {
  deserializeSnapshot,
  type LoadedSnapshotForm,
  type PlaygroundSnapshotFile,
} from '../playground/snapshot';
import { readFormInvariants } from '../playground/formInvariants';
import { h1LabelFromCertified } from './inkedFormModel';
import { h1LabelFromLevel1 } from './worldModel';
import type { WrittenForm } from './writtenFormModel';

// ---------------------------------------------------------------------------
// BIRTH — the committed assemble, gated visibly
// ---------------------------------------------------------------------------

export interface BirthGate {
  legal: boolean;
  reason: string | null; // the committed getAssemblePairDisabledReason, verbatim
}

export function birthGateFor(a: Shape | null, b: Shape | null): BirthGate {
  return {
    legal: canAssemblePair(a, b),
    reason: getAssemblePairDisabledReason(a, b),
  };
}

export type BirthResult = { ok: true; born: WrittenForm } | { ok: false; reason: string };

export function birthChild(a: Shape, b: Shape, seq: number): BirthResult {
  const gate = birthGateFor(a, b);
  if (!gate.legal) {
    return { ok: false, reason: gate.reason ?? 'The pair cannot combine.' };
  }
  let child: Shape;
  try {
    child = executeAssemblePair(a, b); // ← THE COMMITTED assemble, verbatim
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
  // the assemble child carries REAL positions from both parents (carried-not-
  // minted) — the plain ink render; card values from the committed certifier
  const invariants = readFormInvariants(child);
  return {
    ok: true,
    born: {
      id: `w${seq}`,
      title: 'Child — assembled',
      shape: child,
      parentShape: null, // multi-parent root — the committed assemble semantics
      opId: 'assemble',
      provenance: 'assemble — born of two (legal-combine)',
      render: { mode: 'plain', shape: child, invariants, h1Label: h1LabelFromCertified(invariants) },
    },
  };
}

// ---------------------------------------------------------------------------
// THE GENEALOGY — one committed DAG feeds pentimento + stemma + record
// ---------------------------------------------------------------------------

export interface GenesisReading {
  dag: GenealogyDag;
  reducedEdges: GenealogyEdge[]; // Q3 — direct parents only (the canon ruling)
  pentimentoIds: Set<ShapeId>; // the REALLY-consumed: in the story, not in liveAtEnd
  accepted: boolean; // dag integrity — surfaced, never hidden
  violations: string[];
}

// The page's genealogical story: every written/loaded shape + every shape
// referenced as a parent (so the DAG's lineage⊆parents integrity can bite).
export function genesisStoryShapes(
  written: ReadonlyArray<{ form: WrittenForm }>,
): Shape[] {
  const byId = new Map<ShapeId, Shape>();
  for (const entry of written) {
    byId.set(entry.form.shape.id, entry.form.shape);
    if (entry.form.parentShape) byId.set(entry.form.parentShape.id, entry.form.parentShape);
  }
  return [...byId.values()];
}

export function readGenesis(storyShapes: Shape[]): GenesisReading | null {
  if (storyShapes.length === 0) return null;
  const dag = buildGenealogyDag(storyShapes);
  const live = new Set(dag.liveAtEnd);
  return {
    dag,
    reducedEdges: transitiveReduceEdges(dag),
    pentimentoIds: new Set(storyShapes.map((s) => s.id).filter((id) => !live.has(id))),
    accepted: dag.integrity.accepted,
    violations: dag.integrity.violations,
  };
}

// the foot-marginalia entries — "what begat what", one line per birth, in the
// DAG's own record (birth-event) order, edges from the REDUCED committed set
export interface RecordEntry {
  childId: ShapeId;
  childName: string;
  operation: string;
  parents: Array<{ id: ShapeId; name: string }>;
}

export function footRecord(
  reading: GenesisReading,
  nameOf: (id: ShapeId) => string,
): RecordEntry[] {
  const byChild = new Map<ShapeId, GenealogyEdge[]>();
  for (const edge of reading.reducedEdges) {
    byChild.set(edge.child, [...(byChild.get(edge.child) ?? []), edge]);
  }
  const entries: RecordEntry[] = [];
  for (const event of reading.dag.record) {
    if (event.kind !== 'birth') continue;
    const edges = byChild.get(event.node);
    if (!edges || edges.length === 0) continue; // parentless roots are material, not births begotten
    entries.push({
      childId: event.node,
      childName: nameOf(event.node),
      operation: edges[0].operation,
      parents: edges.map((e) => ({ id: e.parent, name: nameOf(e.parent) })),
    });
  }
  return entries;
}

// ---------------------------------------------------------------------------
// THE SOURCES SHELF — the committed snapshot load (E1 source-namespacing)
// ---------------------------------------------------------------------------

export interface ShelfEntry {
  source: string; // the universe name (opaque provenance — never a doorway)
  title: string; // the form's display name
  loaded: LoadedSnapshotForm; // the committed deserializeSnapshot output, verbatim
  placeable: boolean;
  reason: string | null; // honest refusal (e.g. a loaded word-born quotient)
  render: WrittenForm['render'] | null;
}

export function loadUniverseSnapshot(
  file: PlaygroundSnapshotFile,
  loadSource?: string,
): ShelfEntry {
  const loaded = deserializeSnapshot(file, loadSource); // ← the committed load, verbatim
  const shape = loaded.shape;
  const operation = shape.genealogy.operation;
  // a loaded WORD-BORN quotient's positions are bookkeeping, and its parent is
  // not in the single-shape snapshot to replay — honestly unplaceable
  const quotientBorn = operation === 'glue' || operation === 'flip-glue' || operation === 'collapse';
  if (quotientBorn) {
    return {
      source: loaded.provenance.source,
      title: `${shape.name} (${operation})`,
      loaded,
      placeable: false,
      reason: `a loaded ${operation}-born quotient has no parent in the snapshot to replay — its minted positions are bookkeeping, refusing to draw`,
      render: null,
    };
  }
  const invariants = readFormInvariants(shape);
  const render: WrittenForm['render'] =
    shape.faces.length === 0
      ? {
          mode: 'skeleton',
          model: {
            key: shape.id,
            title: shape.name,
            shape,
            invariants,
            h1Label: h1LabelFromLevel1(invariants),
          },
        }
      : { mode: 'plain', shape, invariants, h1Label: h1LabelFromCertified(invariants) };
  return {
    source: loaded.provenance.source,
    title: shape.name,
    loaded,
    placeable: true,
    reason: null,
    render,
  };
}

export function placeShelfEntry(entry: ShelfEntry, seq: number): WrittenForm {
  if (!entry.placeable || !entry.render) {
    throw new Error(`genesisModel: shelf entry "${entry.title}" is not placeable (${entry.reason ?? 'no render'})`);
  }
  return {
    id: `w${seq}`,
    title: `${entry.title} — loaded`,
    shape: entry.loaded.shape,
    parentShape: null,
    opId: null,
    provenance: `loaded — universe “${entry.source}” (source-tagged, not a doorway)`,
    render: entry.render,
  };
}
