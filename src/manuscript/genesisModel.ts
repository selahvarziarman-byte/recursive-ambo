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

import type { Face, Shape, ShapeId } from '../types/geometry';
import {
  canAssemblePair,
  getAssemblePairDisabledReason,
  resolveLineage,
} from '../playground/playgroundOperations';
import { connectedSum } from '../lib/connectedSum';
import { routeWrittenRender } from './writtenFormModel';
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

// COMBINE IS THE CONNECTED SUM (mothership co-ratified 2026-07-10; wired
// 2026-07-12): the combine door runs the co-ratified `connectedSum` macro
// (cutCell + cutCell + enacted assemble), NOT the raw assemble — an assemble
// of two tori is a union along a seam; their CONNECTED SUM is genus-2.
//
// ⛔ THE PORT FACES ARE THE PERSON'S. The topology is safe wherever you cut,
// but the SEAM'S LOCATION — the birth-scar the record carries — would be an
// ARRAY-ORDER ARTIFACT under any `faces[0]` default (the exact defect
// ef704d0/04a1c5f were spent killing). No port face on both sides ⇒ this gate
// REFUSES, BY NAME. No default is ever taken; no "canonical" face is
// invented — the person choosing is MORE faithful, not less.
//
// THE MODE IS INERT AND IS NOT OFFERED: the ratified two-sided law — the mode
// bites ⟺ the seam is NON-separating — and a connect-sum seam SEPARATES. Its
// inertness is a computed fact, STATED in the specimen line, never a choice.
export function combineGateFor(
  a: Shape | null,
  b: Shape | null,
  portFaceA: Face | null,
  portFaceB: Face | null,
): BirthGate {
  const pair = birthGateFor(a, b);
  if (!pair.legal) return pair;
  if (!portFaceA || !portFaceB) {
    const missing = [!portFaceA ? (a?.name ?? 'form A') : null, !portFaceB ? (b?.name ?? 'form B') : null]
      .filter((name): name is string => name !== null)
      .join(' and ');
    return {
      legal: false,
      reason: `connect-sum needs a port face picked on each form — pick the disk to cut on ${missing}. The face you pick changes the result, so there's no default.`,
    };
  }
  return { legal: true, reason: null };
}

export type BirthResult = { ok: true; born: WrittenForm } | { ok: false; reason: string };

export function birthChild(
  a: Shape,
  b: Shape,
  seq: number,
  portFaceA: Face | null = null,
  portFaceB: Face | null = null,
  resolution = 8,
): BirthResult {
  const gate = combineGateFor(a, b, portFaceA, portFaceB);
  if (!gate.legal) {
    return { ok: false, reason: gate.reason ?? 'The pair cannot combine.' };
  }
  let child: Shape;
  let seamSiteCount: number;
  try {
    // ← THE CO-RATIFIED CONNECTED SUM, verbatim — the person's port faces,
    //   no mode passed (inert on surfaces; the macro's committed default)
    const sum = connectedSum(a, b, { faceA: portFaceA as Face, faceB: portFaceB as Face });
    child = sum.shape;
    seamSiteCount = sum.seamMerges.length;
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
  // ★ the child gets a BODY: the committed classify→immerse pipeline routes
  // the render (the certified class — never a guessed shape); the full
  // ancestry [a, b] feeds the acquisition
  let render: WrittenForm['render'];
  try {
    render = routeWrittenRender(child, [a, b], resolution);
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
  const title =
    render.mode === 'classBody'
      ? `${render.model.components.map((component) => component.label).join(' + ')} — born`
      : 'Child — connected sum';
  return {
    ok: true,
    born: {
      id: `w${seq}`,
      title,
      shape: child,
      parentShape: null, // multi-parent root — the committed assemble semantics
      parentShapes: [a, b], // BOTH parents, committed argument order — the story collector reads this
      opId: 'connect-sum',
      provenance:
        `connect-sum — born of two (port faces picked by hand; ` +
        `the birth-scar seam is ${seamSiteCount} merged rim sites, recorded on the child's complex — ` +
        `not drawable on the class body, a certified representative; ` +
        `the seam mode is INERT here: a connect-sum seam separates)`,
      render,
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
//
// COMBINE IS THE CONNECTED SUM (2026-07-12) — the §2 regression fix: the old
// collector took ONLY the one-hop `parentShape` — for a two-parent child that
// is ONE parent of two entering the story: ONE stemma line where two are owed
// — the designer's forbidden lie, verbatim ("drawing one parent of two is the
// LIE; drawing none is merely incomplete"). The story now collects the FULL
// MULTI-PARENT ANCESTRY: the carried `parentShapes` (both parents of a
// combine birth, committed argument order) and the DAG-shaped
// `resolveLineage` walk over the page's own population — never the one-hop
// pointer alone. The original loop is kept VERBATIM FIRST so single-parent
// pages collect the identical set in the identical order (non-movement).
export function genesisStoryShapes(
  written: ReadonlyArray<{ form: WrittenForm }>,
): Shape[] {
  const byId = new Map<ShapeId, Shape>();
  for (const entry of written) {
    byId.set(entry.form.shape.id, entry.form.shape);
    if (entry.form.parentShape) byId.set(entry.form.parentShape.id, entry.form.parentShape);
  }
  // BOTH parents of a multi-parent birth (carried on the written record —
  // off-page parents included), appended after the original collection
  for (const entry of written) {
    for (const parent of entry.form.parentShapes ?? []) {
      if (!byId.has(parent.id)) byId.set(parent.id, parent);
    }
  }
  // the full ancestry of every page shape, walked DAG-shaped over the
  // collected population (pointer where single-valued; committed
  // site-provenance where the pointer is null) — adds nothing on
  // single-parent pages (everything is already collected above)
  const walkPopulation = [...byId.values()];
  for (const entry of written) {
    for (const ancestor of resolveLineage(entry.form.shape, (id) => byId.get(id), walkPopulation)) {
      if (!byId.has(ancestor.id)) byId.set(ancestor.id, ancestor);
    }
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
