// multiform — Enabler-1: multi-form load-and-assemble + source-namespaced cell ids.
//
// The FIRST enabler of the generative build-out (charter:
// docs/governance/PLATONIC_ENGINE_ENABLER_1_CHARTER_MULTIFORM_LOAD_AND_ASSEMBLE.md) —
// the foundation the genealogy DAG (Enabler 2) and product (Enabler 3) sit on. Two
// halves of multi-universe birth, ONE mechanism, because each makes the other honest:
//
//   1. loadForm — load a form carrying a `source` provenance; every source-less primal
//      (lineage ROOT) id is namespaced `<source>:<originalId>`, so universe-1's primal
//      `A` and universe-2's primal `A` become DISTINCT lineage keys. Derived cells
//      (edges via deriveEdges, faces) follow the namespacing. With NO source the ids
//      stay PLAIN — the no-provenance path, byte-identical to a plain seed form (§4.7).
//
//   2. assemble — disjoint-union ≥2 (already id-disjoint) forms and apply ONE explicit
//      boundary-identification on the union. Each glued child vertex is MINTED carrying
//      `createdBy.sourceVertexIds = [its identified parents]`, so `lineage.primalMultiset`
//      over the assembled shape computes the CARRIED union of the parents' roots — never
//      minting a fresh primal (§4.3 carried-not-minted). The assembly's TransformationLedger
//      is built from the identification via the COMMITTED `buildLedgerFromIdentification`.
//      NOTHING auto-glues by shared name — only the explicit identification identifies.
//
// The single law secured: CO-LOCATION ≠ IDENTITY ACROSS UNIVERSES — same plain name +
// different source ⇒ distinct lineage ⇒ NOT auto-identified (only an explicit glue is).
//
// DERIVE-ONLY · ADDITIVE. Committed modules are consumed BYTE-UNCHANGED: this module
// imports only their helpers (`createDefaultVertexData` / `deriveEdges` from shape.ts;
// `buildLedgerFromIdentification` from transformationLedger.ts) and the geometry TYPES.
// lineage.ts is UNTOUCHED — the namespacing happens at LOAD: a source-less primal id
// `<source>:<originalId>` already keys to `<source>:<originalId>` under the committed
// `lineage.primalMultiset` (line 41-42, a source-less vertex is its own primal), so no
// lineage change is needed (the charter's "sanctioned extension point" is satisfied
// without editing the locus).

import type {
  Edge,
  Face,
  OperationKind,
  Shape,
  ShapeId,
  Vec3,
  Vertex,
  VertexId,
} from '../types/geometry';
import { createDefaultVertexData, deriveEdges } from './shape';
import { buildLedgerFromIdentification, type TransformationLedger } from './transformationLedger';

// `primalMultisetKey` (lineage.ts:57-61) joins `id×count` terms with the RESERVED chars
// `×` and `|`; a namespaced id must contain NEITHER (else the key is corrupted). The
// house segment separator `:` (ids.ts) is used to namespace and contains neither.
const RESERVED_KEY_CHARS = ['×', '|'];

function assertKeySafe(part: string, what: string): void {
  for (const reserved of RESERVED_KEY_CHARS) {
    if (part.includes(reserved)) {
      throw new Error(
        `multiform: ${what} "${part}" contains reserved primalMultisetKey char "${reserved}" — it would corrupt the lineage key`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// loadForm — a provenance-tagged form (source-less primals namespaced by source)
// ---------------------------------------------------------------------------

export interface FormVertexSpec {
  id: string; // the PLAIN (un-namespaced) root id, e.g. "A"
  position: Vec3;
  label?: string;
  color?: string;
}

export interface FormFaceSpec {
  vertexIds: string[]; // ordered PLAIN root ids around the face cycle
}

export interface FormSpec {
  name: string;
  vertices: FormVertexSpec[];
  faces?: FormFaceSpec[];
}

export type FormBuilder = () => FormSpec;

// Load a form, tagging every source-less primal (root) id with `source` as
// `<source>:<originalId>`; derived cells (edges/faces) follow. With an empty/absent
// `source` the ids stay PLAIN — the no-provenance path, byte-identical to a plain seed
// form (the §4.7 regression guard).
export function loadForm(builder: FormBuilder, source = ''): Shape {
  const spec = builder();
  if (source) assertKeySafe(source, 'source');

  const ns = (plainId: string): VertexId => {
    assertKeySafe(plainId, 'vertex id');
    return source ? `${source}:${plainId}` : plainId;
  };

  const shapeId: ShapeId = `shape:multiform:${source || 'plain'}:${spec.name}`;

  const vertices: Record<VertexId, Vertex> = {};
  for (const v of spec.vertices) {
    const id = ns(v.id);
    vertices[id] = {
      id,
      position: v.position,
      data: createDefaultVertexData(v.label ?? v.id, v.color),
      createdBy: {
        shapeId,
        operation: 'seed', // a loaded form's roots ARE source-less primals (seeds)
        sourceVertexIds: [], // source-less ⇒ primalMultiset keys it to its own (namespaced) id
      },
    };
  }

  const faces: Face[] = (spec.faces ?? []).map((f, index) => ({
    id: `face:multiform:${source || 'plain'}:${spec.name}:${index}`,
    vertexIds: f.vertexIds.map(ns),
    role: 'seed-face' as const,
  }));

  const edges: Edge[] = deriveEdges(faces, shapeId); // derived cells follow the namespaced ids

  return {
    id: shapeId,
    name: spec.name,
    vertices,
    edges,
    faces,
    cells: [],
    generations: [],
    genealogy: {
      parentShapeId: null,
      operation: 'seed',
      generationDepth: 0,
      sourceVertexIds: [],
      createdVertexIds: Object.keys(vertices),
      createdAt: '',
    },
  };
}

// ---------------------------------------------------------------------------
// assemble — disjoint-union ≥2 forms + ONE explicit boundary-identification
// ---------------------------------------------------------------------------

// The identification child is born from gluing its parents. `OperationKind` (geometry.ts,
// FORBIDDEN to extend) has no 'glue'/'assemble' member; this field is LINEAGE-INERT —
// `lineage.primalMultiset` reads ONLY `createdBy.sourceVertexIds`, never `operation`, and
// the assembled Shape is consumed solely by the lineage/ledger layer. We tag the child
// 'ambo' (the one kind whose canonical form is a vertex DERIVED from multiple source
// vertices) as a neutral, derived (non-'seed', non-primal) placeholder consistent with
// carried-not-minted. [Flagged for the auditor — see REPORT findings.]
const ASSEMBLY_CHILD_OPERATION: OperationKind = 'assemble';

// D1 (sanctioned): the id PREFIX — the full assembled shape id is derived in
// `assemble` DETERMINISTICALLY from (input forms + identification), so the same
// inputs reproduce the same id (derive-only holds) and DISTINCT assemblies mint
// DISTINCT ids (two births coexist in one store / genealogy DAG). LINEAGE-INERT:
// `lineage.primalMultiset` reads `createdBy.sourceVertexIds`, never the container
// shape id — every R2-sealed lineage value is unchanged by this derivation.
const ASSEMBLED_SHAPE_ID_PREFIX: ShapeId = 'shape:multiform:assembly';

export interface VertexMerge {
  resultId: VertexId; // the child the identified parents collapse to (e.g. "A*")
  sources: VertexId[]; // the ≥2 identified parent vertex ids (across forms), e.g. ["u1:A","u2:A"]
}

export interface BoundaryIdentification {
  merges: VertexMerge[];
}

export interface Assembly {
  shape: Shape;
  ledger: TransformationLedger;
}

function centroid(points: Vec3[]): Vec3 {
  const n = points.length || 1;
  const sum = points.reduce<Vec3>((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
  return [sum[0] / n, sum[1] / n, sum[2] / n];
}

// Disjoint-union the (already id-disjoint) forms and apply ONE explicit boundary-
// identification. Each merge MINTS a child vertex carrying `createdBy.sourceVertexIds` =
// its identified parents (load-bearing: §4.3 carried-not-minted). The ledger is the
// COMMITTED `buildLedgerFromIdentification` over the union's source sites, enumerated in
// FORM ORDER (so each glued child's pull-back lists its parents form-by-form). Nothing
// auto-glues by shared name — only the merges passed here identify anything.
export function assemble(forms: Shape[], identification: BoundaryIdentification): Assembly {
  if (forms.length < 2) {
    throw new Error(`multiform.assemble: arity must be >= 2 (got ${forms.length})`);
  }

  // D1: the child's identity is fixed by its inputs (see ASSEMBLED_SHAPE_ID_PREFIX).
  const assembledShapeId: ShapeId = [
    ASSEMBLED_SHAPE_ID_PREFIX,
    forms.map((form) => form.id).join('+'),
    identification.merges.map((merge) => `${merge.resultId}=${merge.sources.join('~')}`).join(';'),
  ].join(':');

  // (1) DISJOINT-UNION — vertices (form order), edges, faces. Ids are already disjoint by
  // namespacing; we VERIFY that (fail loud on any collision) rather than assume it.
  const vertices: Record<VertexId, Vertex> = {};
  const sourceSiteIds: VertexId[] = []; // form order — fixes the pull-back push order
  const edges: Edge[] = [];
  const faces: Face[] = [];
  for (const form of forms) {
    for (const id of Object.keys(form.vertices)) {
      if (vertices[id]) {
        throw new Error(`multiform.assemble: vertex id collision "${id}" — forms are not id-disjoint`);
      }
      vertices[id] = form.vertices[id];
      sourceSiteIds.push(id);
    }
    edges.push(...form.edges);
    faces.push(...form.faces);
  }

  // (2) the EXPLICIT identification: each merged parent ↦ its child; every survivor ↦ itself.
  const resultOfMap = new Map<VertexId, VertexId>();
  const childIds = new Set<VertexId>();
  for (const merge of identification.merges) {
    if (merge.sources.length < 2) {
      throw new Error(
        `multiform.assemble: merge "${merge.resultId}" identifies < 2 sources — not a boundary-identification`,
      );
    }
    assertKeySafe(merge.resultId, 'child id');
    if (vertices[merge.resultId] || childIds.has(merge.resultId)) {
      throw new Error(`multiform.assemble: child id "${merge.resultId}" collides with an existing site`);
    }
    childIds.add(merge.resultId);
    for (const source of merge.sources) {
      if (!vertices[source]) {
        throw new Error(`multiform.assemble: merge source "${source}" is not a vertex of the union`);
      }
      if (resultOfMap.has(source)) {
        throw new Error(`multiform.assemble: source "${source}" appears in more than one merge`);
      }
      resultOfMap.set(source, merge.resultId);
    }
  }
  const resultOf = (siteId: VertexId): VertexId => resultOfMap.get(siteId) ?? siteId;

  // (3) MINT each child carrying its identified parents (createdBy.sourceVertexIds). This
  // wiring is what makes `lineage.primalMultiset(child)` the CARRIED union of the parents'
  // roots (never a freshly-minted `{child×1}` primal) — §4.3.
  for (const merge of identification.merges) {
    vertices[merge.resultId] = {
      id: merge.resultId,
      position: centroid(merge.sources.map((source) => vertices[source].position)),
      data: createDefaultVertexData(merge.resultId),
      createdBy: {
        shapeId: assembledShapeId,
        operation: ASSEMBLY_CHILD_OPERATION,
        sourceVertexIds: [...merge.sources],
      },
    };
  }

  // (4) the LEDGER — the COMMITTED builder over the union's source sites (form order).
  const ledger = buildLedgerFromIdentification(sourceSiteIds, resultOf);

  const shape: Shape = {
    id: assembledShapeId,
    name: `assembly(${forms.map((form) => form.name).join('+')})`,
    vertices,
    edges,
    faces,
    cells: [],
    generations: [],
    genealogy: {
      parentShapeId: null,
      operation: ASSEMBLY_CHILD_OPERATION,
      generationDepth: 1,
      sourceVertexIds: sourceSiteIds,
      createdVertexIds: [...childIds],
      createdAt: '',
    },
  };

  return { shape, ledger };
}
