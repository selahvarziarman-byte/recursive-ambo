// siteWitnessCatalogueV0 — the salvaged, COMPUTABLE meat of the semantic-meat dig.
//
// A finite library of per-site and per-shape STRUCTURAL witnesses, read off the
// engine's output. No field, no octonion, no Fano, no undefined "operations" —
// only what survived the kill-tests (see .handoff/PLATONIC_ENGINE_SEMANTIC_MEAT_
// KILL_TEST_PLAN.md). It does NOT modify the engine, the presenter, or the UI.
//
// TWO DRAWERS:
//  - PER-SITE (varies per generated site, from lineage + faces): the RESIDUAL
//    (distillation), the ABSTRACTION depth, and the NAMED ADJACENCY (object vs
//    relation faces).
//  - PER-SHAPE (fixed per topology, attached to each cell): the SYMMETRY GEM —
//    octahedron -> antipodality, cuboctahedron -> A3/S4 axis structure.
//
// JOIN-POINT (deferred by sovereign instruction): the per-site realization of a
// gem — this site's role WITHIN its cell's gem — is where the two drawers fuse.
// It is NOT built in v0; this comment marks the seam.
//
// Honesty (mandate §3): return null / 'unsupported'-equivalent (null gem, null
// residual, 'unclassified' adjacency) when a witness is undefined for a site;
// never fabricate.
//
// ADJACENCY SCOPE: §4d is implemented LITERALLY — every face in shape.faces that
// contains the site, classified by lineage with both-fields-set -> 'unclassified'
// reported honestly (engineer ruling "Option A", see
// .handoff/REPORT_site-witness-catalogue-v0-STOP-adjacency-contradiction.md). The
// 'unclassified' entries that appear for a deep core vertex are the dissection
// residue side-faces (they carry BOTH a source vertex and a source face); they
// are reported as-is, not hidden.

import type { Cell, Face, Shape, VertexId } from '../types/geometry';
import { buildGeneralSitePacketPresenterReport } from './generalSitePacketPresenterV0';

export interface Residual {
  preserved: string[];
  shed: string[];
}

export interface Abstraction {
  generationDepth: number;
  preservedCount: number;
  shedCount: number;
}

export type AdjacencyType = 'object' | 'relation' | 'unclassified';

export interface AdjacencyFace {
  type: AdjacencyType;
  members: string[];
}

export interface SiteWitnesses {
  siteId: VertexId;
  label: string;
  residual: Residual | null;
  abstraction: Abstraction;
  adjacency: AdjacencyFace[];
  gemRoles: SiteGemRole[];
}

export interface GemAxis {
  kind: string;
  members: string[];
  memberIds: VertexId[];
}

export interface ShapeGem {
  gemName: string;
  fact: string;
  axes: GemAxis[];
}

// The MERGE: a site's concrete role in its host cell's gem — the gem's axes the
// site lies on (matched by id). Kept a LIST so genuine multi-membership
// (confluence: a vertex shared by >1 gem-cell) is reported, never collapsed.
export interface SiteGemRole {
  cellId: string;
  topology: string;
  gemName: string;
  incidentAxes: GemAxis[];
}

export interface SiteWitnessCatalogueReport {
  methodId: 'site-witness-catalogue-v0';
  seedKey: string;
  sites: SiteWitnesses[];
  shapeGems: { cellId: string; topology: string; gem: ShapeGem }[];
  issues: string[];
}

const CENTROID_EPS = 1e-9;

// ---- 4a. primal ancestry -------------------------------------------------

// The SEED vertices a vertex descends from. A seed vertex (or any vertex with no
// source vertices) is its own primal root; otherwise the union over its sources.
function primalAncestry(
  shape: Shape,
  vertexId: VertexId,
  memo: Map<VertexId, Set<VertexId>>,
): Set<VertexId> {
  const cached = memo.get(vertexId);
  if (cached) {
    return cached;
  }

  const vertex = shape.vertices[vertexId];
  let result: Set<VertexId>;

  if (!vertex) {
    result = new Set();
  } else {
    const sources = vertex.createdBy.sourceVertexIds;
    if (vertex.createdBy.operation === 'seed' || sources.length === 0) {
      result = new Set([vertexId]);
    } else {
      result = new Set();
      for (const sourceId of sources) {
        for (const primal of primalAncestry(shape, sourceId, memo)) {
          result.add(primal);
        }
      }
    }
  }

  memo.set(vertexId, result);
  return result;
}

function labelOf(shape: Shape, id: VertexId): string {
  return shape.vertices[id]?.data.label ?? id;
}

function labelsOf(shape: Shape, ids: Iterable<VertexId>): string[] {
  return [...ids].map((id) => labelOf(shape, id)).sort();
}

// ---- 4e. per-shape gems --------------------------------------------------

function cellCentroid(shape: Shape, cell: Cell): [number, number, number] {
  const sum: [number, number, number] = [0, 0, 0];
  for (const id of cell.vertexIds) {
    const p = shape.vertices[id]?.position;
    if (!p) {
      continue;
    }
    sum[0] += p[0];
    sum[1] += p[1];
    sum[2] += p[2];
  }
  const n = cell.vertexIds.length || 1;
  return [sum[0] / n, sum[1] / n, sum[2] / n];
}

function faceCentroid(shape: Shape, face: Face): [number, number, number] {
  const sum: [number, number, number] = [0, 0, 0];
  for (const id of face.vertexIds) {
    const p = shape.vertices[id]?.position;
    if (!p) {
      continue;
    }
    sum[0] += p[0];
    sum[1] += p[1];
    sum[2] += p[2];
  }
  const n = face.vertexIds.length || 1;
  return [sum[0] / n, sum[1] / n, sum[2] / n];
}

function distance(a: [number, number, number], b: [number, number, number]): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function normalize(v: [number, number, number]): [number, number, number] {
  const m = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / m, v[1] / m, v[2] / m];
}

function dot(a: [number, number, number], b: [number, number, number]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function octahedronGem(shape: Shape, cell: Cell): ShapeGem {
  const centroid = cellCentroid(shape, cell);
  const ids = cell.vertexIds;
  const used = new Set<VertexId>();
  const axes: GemAxis[] = [];

  for (let i = 0; i < ids.length; i += 1) {
    if (used.has(ids[i])) {
      continue;
    }
    const pi = shape.vertices[ids[i]]?.position;
    if (!pi) {
      continue;
    }
    for (let j = i + 1; j < ids.length; j += 1) {
      if (used.has(ids[j])) {
        continue;
      }
      const pj = shape.vertices[ids[j]]?.position;
      if (!pj) {
        continue;
      }
      const mid: [number, number, number] = [
        (pi[0] + pj[0]) / 2,
        (pi[1] + pj[1]) / 2,
        (pi[2] + pj[2]) / 2,
      ];
      if (distance(mid, centroid) < CENTROID_EPS) {
        axes.push({
          kind: 'antipodal-pair',
          members: [labelOf(shape, ids[i]), labelOf(shape, ids[j])].sort(),
          memberIds: [ids[i], ids[j]],
        });
        used.add(ids[i]);
        used.add(ids[j]);
        break;
      }
    }
  }

  axes.sort((a, b) => a.members.join(',').localeCompare(b.members.join(',')));

  return {
    gemName: 'antipodality',
    fact: 'the cell has 3 antipodal axes = the 3 pair-partitions of its source',
    axes,
  };
}

function cuboctahedronGem(shape: Shape, cell: Cell, faceById: Map<string, Face>): ShapeGem {
  const centroid = cellCentroid(shape, cell);
  const descriptors = cell.faceIds
    .map((id) => faceById.get(id))
    .filter((face): face is Face => Boolean(face))
    .map((face) => ({
      face,
      size: face.vertexIds.length,
      dir: normalize([
        faceCentroid(shape, face)[0] - centroid[0],
        faceCentroid(shape, face)[1] - centroid[1],
        faceCentroid(shape, face)[2] - centroid[2],
      ]),
    }));

  const used = new Set<number>();
  const axes: GemAxis[] = [];

  for (let i = 0; i < descriptors.length; i += 1) {
    if (used.has(i)) {
      continue;
    }
    // opposite face = same size, centroid-direction most nearly antipodal
    let best = -1;
    let bestNegDot = -Infinity;
    for (let j = 0; j < descriptors.length; j += 1) {
      if (j === i || used.has(j) || descriptors[j].size !== descriptors[i].size) {
        continue;
      }
      const negDot = -dot(descriptors[i].dir, descriptors[j].dir);
      if (negDot > bestNegDot) {
        bestNegDot = negDot;
        best = j;
      }
    }
    if (best === -1) {
      continue; // honesty: an unpaired face is not forced into an axis
    }
    used.add(i);
    used.add(best);
    const memberIdSet = new Set<VertexId>([
      ...descriptors[i].face.vertexIds,
      ...descriptors[best].face.vertexIds,
    ]);
    const members = labelsOf(shape, memberIdSet);
    axes.push({
      kind: descriptors[i].size === 3 ? 'triangle-face' : 'square-face',
      members,
      memberIds: [...memberIdSet],
    });
  }

  axes.sort(
    (a, b) => a.kind.localeCompare(b.kind) || a.members.join(',').localeCompare(b.members.join(',')),
  );

  return {
    gemName: 'A3/S4-incidence',
    fact:
      'octonion-free: 4 triangle-axes form a K4, 3 square-axes are its perfect matchings; ' +
      'closure = the 4 triangles, cut = the 3 matchings (Klein-four V4). [research: R2/R3]',
    axes,
  };
}

function gemForCell(shape: Shape, cell: Cell, faceById: Map<string, Face>): ShapeGem | null {
  switch (cell.topology) {
    case 'octahedron':
      return octahedronGem(shape, cell);
    case 'cuboctahedron':
      return cuboctahedronGem(shape, cell, faceById);
    // TODO(extension point): cube, square-pyramid, rectified-* gems are not yet
    // computed. Do NOT invent facts that have not been computed — return null.
    default:
      return null;
  }
}

// ---- 4d. named adjacency (object vs relation), §4d literal/global --------

function adjacencyFor(shape: Shape, siteId: VertexId): AdjacencyFace[] {
  const faces = shape.faces.filter((face) => face.vertexIds.includes(siteId));

  const adjacency = faces.map((face): AdjacencyFace => {
    const hasVertexSource = face.sourceVertexId != null;
    const hasFaceSource = face.sourceFaceId != null;
    let type: AdjacencyType;
    if (hasVertexSource && !hasFaceSource) {
      type = 'object'; // a former vertex = a thing
    } else if (hasFaceSource && !hasVertexSource) {
      type = 'relation'; // a former face = a gathering
    } else {
      type = 'unclassified'; // neither, or BOTH (e.g. residue side-faces) — honest
    }
    const members = face.vertexIds
      .filter((id) => id !== siteId)
      .map((id) => labelOf(shape, id));
    return { type, members };
  });

  adjacency.sort(
    (a, b) => a.type.localeCompare(b.type) || a.members.join(',').localeCompare(b.members.join(',')),
  );

  return adjacency;
}

// ---- assembly ------------------------------------------------------------

export function buildSiteWitnessCatalogueV0(shape: Shape): SiteWitnessCatalogueReport {
  const issues: string[] = [];
  const seedKey = shape.seedKey ?? '';
  const memo = new Map<VertexId, Set<VertexId>>();

  const presenter = buildGeneralSitePacketPresenterReport(shape);
  for (const presenterIssue of presenter.issues) {
    issues.push(`presenter: ${presenterIssue}`);
  }

  // §4b: assemble the per-shape gems BEFORE the per-site loop so each site can
  // read them (pure reordering — identical gemForCell logic, just moved up).
  const faceById = new Map<string, Face>(shape.faces.map((face) => [face.id, face]));
  const shapeGems: { cellId: string; topology: string; gem: ShapeGem }[] = [];
  for (const cell of shape.cells) {
    const gem = gemForCell(shape, cell, faceById);
    if (gem) {
      shapeGems.push({ cellId: cell.id, topology: cell.topology ?? '', gem });
    }
  }

  const sites: SiteWitnesses[] = [];

  for (const packet of presenter.packets) {
    const siteId = packet.trace.siteId;
    const parents = packet.trace.parentIds;
    const label = labelOf(shape, siteId);

    let residual: Residual | null = null;
    let preservedCount = 0;
    let shedCount = 0;

    if (parents.length === 2) {
      const ancestryA = primalAncestry(shape, parents[0], memo);
      const ancestryB = primalAncestry(shape, parents[1], memo);
      const preserved = new Set<VertexId>([...ancestryA].filter((id) => ancestryB.has(id)));
      const shed = new Set<VertexId>(
        [...ancestryA, ...ancestryB].filter((id) => !(ancestryA.has(id) && ancestryB.has(id))),
      );
      preservedCount = preserved.size;
      shedCount = shed.size;
      residual = {
        preserved: labelsOf(shape, preserved),
        shed: labelsOf(shape, shed),
      };
    } else {
      issues.push(`site ${siteId} is not a 2-parent ambo site; residual = null`);
    }

    const abstraction: Abstraction = {
      generationDepth: packet.trace.generationDepth,
      preservedCount,
      shedCount,
    };

    // §4b: the MERGE — this site's role in each gem-bearing cell it belongs to.
    // Match cell by id; incidence by memberIds (robust, no label collisions).
    const gemRoles: SiteGemRole[] = [];
    for (const entry of shapeGems) {
      const cell = shape.cells.find((candidate) => candidate.id === entry.cellId);
      if (cell && cell.vertexIds.includes(siteId)) {
        const incidentAxes = entry.gem.axes.filter((axis) => axis.memberIds.includes(siteId));
        gemRoles.push({
          cellId: entry.cellId,
          topology: entry.topology,
          gemName: entry.gem.gemName,
          incidentAxes,
        });
        if (incidentAxes.length === 0) {
          issues.push(
            `site ${siteId} is a vertex of gem-cell ${entry.cellId} but lies on no gem axis`,
          );
        }
      }
    }

    sites.push({
      siteId,
      label,
      residual,
      abstraction,
      adjacency: adjacencyFor(shape, siteId),
      gemRoles,
    });
  }

  sites.sort((a, b) => a.siteId.localeCompare(b.siteId));

  return {
    methodId: 'site-witness-catalogue-v0',
    seedKey,
    sites,
    shapeGems,
    issues,
  };
}
