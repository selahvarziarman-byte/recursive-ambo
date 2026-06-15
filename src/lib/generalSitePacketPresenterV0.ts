// generalSitePacketPresenterV0 — the GENERAL per-site packet presenter.
//
// Reads `applyAmboDissection`'s output (the ENGINE) directly and renders, for
// EVERY ambo-generated site at EVERY generation present in a Shape, the
// validated minimal human FACE + a walled-off TRACE — for ANY supported seed,
// not just the one-ambo tetrahedron.
//
// It reads applyAmboDissection's output directly (not any per-site proving
// pipeline). It is a THIN reader: no new geometry, no scope expansion, no naming
// logic. Per midpoint the
// engine already records its parents (createdBy.sourceVertexIds), its source edge
// (createdBy.sourceEdgeId), its concatenated label, and its host lineage; the
// presenter just locates the host cell and reports the structural neighbourhood.
//
// FACE rules (carried verbatim from the validated minimal face): state by
// STRUCTURE, not by caveat ("Unnamed" = namingDecision === null, never a status
// label); NO coded ids in the face (ids live only in the TRACE); NO machinery
// vocabulary; NO dead-campaign vocabulary; render the complement by LABEL only,
// generally — any set size. A FACE_FORBIDDEN_TOKENS self-check guards this; the
// diagnostic enforces the same floor independently.
//
// Coverage is described by DATA (seedKey + generatedSiteCount), never a
// hard-coded scope lock. In-memory report object — no persistence, no Shape
// mutation, no auto-naming. namingDecision is ALWAYS null here (the human is the
// sole namer/signer; never auto).

import type { Cell, Shape, Vertex, VertexId } from '../types/geometry';

export interface PresenterNamedNeighbour {
  label: string;
  role: 'parent' | 'across-cell';
}

export interface PresenterNamingDecision {
  name: string;
  reasoning: string;
}

export interface GeneralSitePacketFace {
  siteDescription: string;
  bornBetween: [string, string];
  readAcross: string;
  namedNeighbours: PresenterNamedNeighbour[];
  howToName: string;
  namingDecision: PresenterNamingDecision | null;
}

export interface GeneralSitePacketTrace {
  siteId: VertexId;
  parentIds: [VertexId, VertexId];
  hostCellId: string;
  complementVertexIds: VertexId[];
  generationDepth: number;
  operation: 'ambo-dissection';
  seedKey: string;
}

export interface GeneralSitePacket {
  face: GeneralSitePacketFace;
  trace: GeneralSitePacketTrace;
}

export interface GeneralSitePacketPresenterReport {
  methodId: 'general-site-packet-presenter-v0';
  // Coverage is described by DATA (seedKey + generatedSiteCount); no hard-coded scope lock.
  seedKey: string;
  generatedSiteCount: number;
  packets: GeneralSitePacket[];
  issues: string[];
}

// Tokens that must NEVER appear in the rendered face. Declared INLINE (copied,
// not imported from the slice — the presenter does not import the slice). The
// diagnostic re-declares the same floor independently.
const FACE_FORBIDDEN_TOKENS: string[] = [
  'not-',
  'candidate-',
  '-status',
  'reasoningsource',
  'agentcomputation',
  'packetwritestatus',
  'shapemutation',
  'namingauthority',
  'labelstatus',
  'semanticstatus',
  'untested',
  'methodid',
  'scope',
  'siteid',
  'm_',
  'oppositemidpointid',
  'oppositeedgeid',
  'genealogy',
  'createdby',
  'sourcevertexids',
  'generationdepth',
  'field',
  'fieldcue',
  'tuple',
  'source-state',
  'source-signature',
  'pressure',
  'carrier',
  'octonion',
  'fano',
  'quark',
  'propagation',
  'atlas',
  'holonomy',
  'moufang',
  '∧',
];

interface ResolvedSite {
  host: Cell;
  complementVertexIds: VertexId[];
}

function labelOf(shape: Shape, id: VertexId): string | null {
  return shape.vertices[id]?.data.label ?? null;
}

// Resolve a site's host cell from the engine by its source edge. Each ambo
// midpoint's createdBy.sourceEdgeId belongs to exactly ONE 'parent' cell's
// sourceEdgeIds — edge ids are unique to the dissection that created them, and
// that cell necessarily contains both parents — so the edge-match host is unique
// and correct (this holds across generations AND across overlapping sibling
// dissections). If the edge does not resolve to exactly one parent cell, return
// null: the caller records an issue and marks the site unsupported. NEVER fabricate.
function resolveSite(
  parentCells: Cell[],
  parents: VertexId[],
  sourceEdgeId: string,
): ResolvedSite | null {
  const edgeHosts = parentCells.filter((cell) =>
    cell.sourceEdgeIds.includes(sourceEdgeId),
  );

  if (edgeHosts.length !== 1) {
    return null;
  }

  const host = edgeHosts[0];
  const parentSet = new Set(parents);

  return {
    host,
    complementVertexIds: host.sourceVertexIds.filter((id) => !parentSet.has(id)),
  };
}

function buildFace(
  parentLabels: [string, string],
  complementLabels: string[],
): GeneralSitePacketFace {
  const [parentALabel, parentBLabel] = parentLabels;

  return {
    siteDescription: `A site born where the edge between ${parentALabel} and ${parentBLabel} is rectified.`,
    bornBetween: [parentALabel, parentBLabel],
    readAcross: `Across the cell from it: ${complementLabels.join(', ')}.`,
    namedNeighbours: [
      { label: parentALabel, role: 'parent' },
      { label: parentBLabel, role: 'parent' },
      ...complementLabels.map(
        (label): PresenterNamedNeighbour => ({ label, role: 'across-cell' }),
      ),
    ],
    howToName: 'Name the concept that dwells here.',
    namingDecision: null,
  };
}

function scanFaceForForbiddenTokens(packet: GeneralSitePacket): string[] {
  const rendered = renderPacketFace(packet).join('\n').toLowerCase();

  return FACE_FORBIDDEN_TOKENS.filter((token) => rendered.includes(token));
}

export function buildGeneralSitePacketPresenterReport(
  shape: Shape,
): GeneralSitePacketPresenterReport {
  const issues: string[] = [];
  const seedKey = shape.seedKey ?? '';
  const parentCells = shape.cells.filter((cell) => cell.kind === 'parent');

  // The generated sites: every ambo-dissection vertex, all generations present.
  const generatedVertices: Vertex[] = Object.values(shape.vertices).filter(
    (vertex) => vertex.createdBy.operation === 'ambo-dissection',
  );
  const generatedSiteCount = generatedVertices.length;

  const packets: GeneralSitePacket[] = [];

  for (const vertex of generatedVertices) {
    const parents = vertex.createdBy.sourceVertexIds;

    if (parents.length !== 2) {
      issues.push(
        `site ${vertex.id} has ${parents.length} source vertices (expected 2); skipped`,
      );
      continue;
    }

    const sourceEdgeId = vertex.createdBy.sourceEdgeId;

    if (!sourceEdgeId) {
      issues.push(`site ${vertex.id} has no source edge id; marked unsupported`);
      continue;
    }

    const resolved = resolveSite(parentCells, parents, sourceEdgeId);

    if (!resolved) {
      issues.push(
        `site ${vertex.id} host cell unresolved or disagreeing (edge-match vs vertex-containment); marked unsupported`,
      );
      continue;
    }

    const [parentAId, parentBId] = parents;
    const parentLabelA = labelOf(shape, parentAId);
    const parentLabelB = labelOf(shape, parentBId);
    const complementLabels = resolved.complementVertexIds.map((id) => labelOf(shape, id));

    if (
      parentLabelA === null ||
      parentLabelB === null ||
      complementLabels.some((label) => label === null)
    ) {
      issues.push(`site ${vertex.id} has unresolved neighbour labels; marked unsupported`);
      continue;
    }

    const packet: GeneralSitePacket = {
      face: buildFace(
        [parentLabelA, parentLabelB],
        complementLabels as string[],
      ),
      trace: {
        siteId: vertex.id,
        parentIds: [parentAId, parentBId],
        hostCellId: resolved.host.id,
        complementVertexIds: resolved.complementVertexIds,
        generationDepth: resolved.host.generationDepth + 1,
        operation: 'ambo-dissection',
        seedKey,
      },
    };

    const leaks = scanFaceForForbiddenTokens(packet);

    if (leaks.length > 0) {
      issues.push(
        `site ${vertex.id} face leaked machinery tokens: ${leaks.join(', ')}`,
      );
    }

    packets.push(packet);
  }

  packets.sort((a, b) => a.trace.siteId.localeCompare(b.trace.siteId));

  return {
    methodId: 'general-site-packet-presenter-v0',
    seedKey,
    generatedSiteCount,
    packets,
    issues,
  };
}

// CLEAN human worksheet — renders the minimal FACE only, never the trace.
export function renderPacketFace(packet: GeneralSitePacket): string[] {
  const face = packet.face;
  const lines: string[] = [];

  lines.push(face.siteDescription);
  lines.push(`Born between ${face.bornBetween[0]} and ${face.bornBetween[1]}.`);
  lines.push(face.readAcross);
  lines.push('');
  lines.push('Named neighbours:');
  for (const neighbour of face.namedNeighbours) {
    const roleWords = neighbour.role === 'parent' ? 'parent' : 'across cell';
    lines.push(`  ${neighbour.label} (${roleWords})`);
  }
  lines.push('');
  lines.push(face.howToName);
  lines.push('');
  if (face.namingDecision === null) {
    lines.push('Name: ______________________________');
    lines.push('Why this name: ______________________________');
  } else {
    lines.push(`Name: ${face.namingDecision.name}`);
    lines.push(`Why this name: ${face.namingDecision.reasoning}`);
  }

  return lines;
}
