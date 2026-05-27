import type { Cell, Edge, Face, Shape, Vec3, Vertex } from '../types/geometry';
import type { DualInspectionTarget } from '../store/geometryStore';
import { isCellActiveFrontier } from './cellLifecycle';
import { buildSemanticDualModel, type SemanticDualModel } from './dualization';
import { canonicalEdgeKey, stableHash } from './ids';
import { getCellFaces, getCellVertices, getFaceVertices } from './shape';

export type DualViewSupportedTopology = 'tetrahedron' | 'octahedron' | 'cube';
export type DualViewTopology =
  | DualViewSupportedTopology
  | 'cuboctahedron'
  | 'square-pyramid'
  | 'unknown';

export interface DualViewDescription {
  source: DualViewTopology;
  dual?: DualViewSupportedTopology;
}

export interface DualViewVertex {
  id: string;
  position: Vec3;
}

export interface DualViewFace {
  id: string;
  vertexIds: string[];
}

export interface DualCorrespondenceVertex {
  id: string;
  position: Vec3;
}

export interface DualCorrespondenceFace {
  id: string;
  vertexIds: string[];
}

export interface DualCorrespondenceEdge {
  id: string;
  vertexIds: [string, string];
  sourceEdgeId: string;
}

export interface DualCorrespondenceModel {
  sourceCellId: string;
  dualModelId: string;
  dualTopologyLabel: string;
  dualVertices: Record<string, DualCorrespondenceVertex>;
  dualFaces: DualCorrespondenceFace[];
  dualEdges: DualCorrespondenceEdge[];
  sourceFaceToDualVertex: Record<string, string>;
  dualVertexToSourceFace: Record<string, string>;
  sourceVertexToDualFace: Record<string, string>;
  dualFaceToSourceVertex: Record<string, string>;
  sourceEdgeToDualEdge: Record<string, string>;
  dualEdgeToSourceEdge: Record<string, string>;
}

export interface DualViewProxy {
  cellId: string;
  topology: DualViewSupportedTopology;
  vertices: DualViewVertex[];
  faces: DualViewFace[];
  correspondenceModel: DualCorrespondenceModel;
}

export type DualUniverseViewModel =
  | { kind: 'legacy-proxy'; proxy: DualViewProxy }
  | { kind: 'semantic-model'; semanticModel: SemanticDualModel }
  | { kind: 'unsupported'; reason: string };

export interface DualUniverseRenderVertex {
  id: string;
  position: Vec3;
}

export interface DualUniverseRenderFace {
  id: string;
  vertexIds: string[];
}

export interface DualUniverseRenderEdge {
  id?: string;
  vertexIds: [string, string];
  role?: Edge['role'];
  sourceEdgeId?: string;
  sourceCellId?: string;
}

export type DualUniverseRenderGeometry =
  | {
      kind: 'legacy-proxy';
      topology: DualViewSupportedTopology;
      vertices: DualUniverseRenderVertex[];
      faces: DualUniverseRenderFace[];
      edges: DualUniverseRenderEdge[];
      viewModel: Extract<DualUniverseViewModel, { kind: 'legacy-proxy' }>;
    }
  | {
      kind: 'semantic-model';
      topology: 'dodecahedron';
      vertices: DualUniverseRenderVertex[];
      faces: DualUniverseRenderFace[];
      edges: DualUniverseRenderEdge[];
      viewModel: Extract<DualUniverseViewModel, { kind: 'semantic-model' }>;
    }
  | {
      kind: 'unsupported';
      reason: string;
      viewModel: Extract<DualUniverseViewModel, { kind: 'unsupported' }>;
    };

export type ResolvedDualInspectionTarget =
  | {
      kind: 'cell';
      target: Extract<DualInspectionTarget, { kind: 'cell' }>;
      semanticModel: SemanticDualModel;
      sourceCell: Cell;
      dualCell: Cell;
    }
  | {
      kind: 'vertex';
      target: Extract<DualInspectionTarget, { kind: 'vertex' }>;
      semanticModel: SemanticDualModel;
      sourceCell: Cell;
      dualVertex: Vertex;
      sourceFace: Face | null;
    }
  | {
      kind: 'face';
      target: Extract<DualInspectionTarget, { kind: 'face' }>;
      semanticModel: SemanticDualModel;
      sourceCell: Cell;
      dualFace: Face;
      sourceVertex: Vertex | null;
    }
  | {
      kind: 'edge';
      target: Extract<DualInspectionTarget, { kind: 'edge' }>;
      semanticModel: SemanticDualModel;
      sourceCell: Cell;
      dualEdge: Edge;
      sourceEdge: Edge | null;
    };

interface DualVertexEntry {
  face: Face;
  vertex: DualViewVertex;
}

interface DualFaceEntry {
  sourceVertexId: string;
  face: DualViewFace;
}

interface DualEdgeEntry {
  sourceEdge: Edge;
  edge: DualCorrespondenceEdge;
}

interface SourceEdgeEntry {
  edge: Edge;
  incidentFaces: [Face, Face];
}

export function describeDualViewTopology(shape: Shape, cell: Cell): DualViewDescription {
  const faces = getCellFaces(shape, cell);
  const faceSizes = faces.map((face) => face.vertexIds.length);

  if (cell.vertexIds.length === 4 && faces.length === 4 && faceSizes.every((size) => size === 3)) {
    return { source: 'tetrahedron', dual: 'tetrahedron' };
  }

  if (cell.vertexIds.length === 6 && faces.length === 8 && faceSizes.every((size) => size === 3)) {
    return { source: 'octahedron', dual: 'cube' };
  }

  if (cell.vertexIds.length === 8 && faces.length === 6 && faceSizes.every((size) => size === 4)) {
    return { source: 'cube', dual: 'octahedron' };
  }

  if (cell.kind === 'core' && cell.vertexIds.length === 12) {
    return { source: 'cuboctahedron' };
  }

  if (cell.kind === 'residue' && cell.vertexIds.length === 5) {
    return { source: 'square-pyramid' };
  }

  return { source: 'unknown' };
}

export function isDualViewSupportedCell(shape: Shape, cell: Cell): boolean {
  return isSemanticDualUniverseSource(shape, cell) || Boolean(describeDualViewTopology(shape, cell).dual);
}

export function buildDualUniverseViewModel(shape: Shape, cell: Cell): DualUniverseViewModel {
  if (isSemanticDualUniverseSource(shape, cell)) {
    try {
      return {
        kind: 'semantic-model',
        semanticModel: buildSemanticDualModel(shape, cell.id),
      };
    } catch {
      return {
        kind: 'unsupported',
        reason: 'Semantic Dual Universe could not build a valid dodecahedron counterpart for this cell.',
      };
    }
  }

  const proxy = buildDualViewProxy(shape, cell);

  if (proxy) {
    return {
      kind: 'legacy-proxy',
      proxy,
    };
  }

  return {
    kind: 'unsupported',
    reason: getDualUniverseUnsupportedReason(shape, cell),
  };
}

export function buildDualUniverseRenderGeometry(
  shape: Shape,
  cell: Cell,
): DualUniverseRenderGeometry {
  return projectDualUniverseViewModelToRenderGeometry(buildDualUniverseViewModel(shape, cell));
}

export function projectDualUniverseViewModelToRenderGeometry(
  viewModel: DualUniverseViewModel,
): DualUniverseRenderGeometry {
  if (viewModel.kind === 'legacy-proxy') {
    return {
      kind: 'legacy-proxy',
      topology: viewModel.proxy.topology,
      vertices: viewModel.proxy.vertices,
      faces: viewModel.proxy.faces,
      edges: viewModel.proxy.correspondenceModel.dualEdges.map((edge) => ({
        id: edge.id,
        vertexIds: edge.vertexIds,
        sourceEdgeId: edge.sourceEdgeId,
        sourceCellId: viewModel.proxy.correspondenceModel.sourceCellId,
      })),
      viewModel,
    };
  }

  if (viewModel.kind === 'semantic-model') {
    return {
      kind: 'semantic-model',
      topology: 'dodecahedron',
      vertices: Object.values(viewModel.semanticModel.dualVertices).map((vertex) => ({
        id: vertex.id,
        position: vertex.position,
      })),
      faces: viewModel.semanticModel.dualFaces.map((face) => ({
        id: face.id,
        vertexIds: face.vertexIds,
      })),
      edges: viewModel.semanticModel.dualEdges.map((edge) => ({
        id: edge.id,
        vertexIds: edge.vertexIds,
        role: edge.role,
        sourceEdgeId: edge.sourceEdgeId,
        sourceCellId: edge.sourceCellId,
      })),
      viewModel,
    };
  }

  return {
    kind: 'unsupported',
    reason: viewModel.reason,
    viewModel,
  };
}

export function createDualVertexInspectionTarget(
  semanticModel: SemanticDualModel,
  dualVertexId: string,
): DualInspectionTarget | null {
  const sourceFaceId = semanticModel.dualVertexToSourceFace[dualVertexId];

  if (!sourceFaceId) {
    return null;
  }

  return {
    universe: 'dual',
    kind: 'vertex',
    sourceCellId: semanticModel.sourceCellId,
    dualVertexId,
    sourceFaceId,
  };
}

export function createDualFaceInspectionTarget(
  semanticModel: SemanticDualModel,
  dualFaceId: string,
): DualInspectionTarget | null {
  const sourceVertexId = semanticModel.dualFaceToSourceVertex[dualFaceId];

  if (!sourceVertexId) {
    return null;
  }

  return {
    universe: 'dual',
    kind: 'face',
    sourceCellId: semanticModel.sourceCellId,
    dualFaceId,
    sourceVertexId,
  };
}

export function createDualEdgeInspectionTarget(
  semanticModel: SemanticDualModel,
  dualEdgeId: string,
): DualInspectionTarget | null {
  const sourceEdgeId = semanticModel.dualEdgeToSourceEdge[dualEdgeId];

  if (!sourceEdgeId) {
    return null;
  }

  return {
    universe: 'dual',
    kind: 'edge',
    sourceCellId: semanticModel.sourceCellId,
    dualEdgeId,
    sourceEdgeId,
  };
}

export function resolveDualInspectionTarget(
  shape: Shape,
  target: DualInspectionTarget,
): ResolvedDualInspectionTarget | null {
  const sourceCell = shape.cells.find((cell) => cell.id === target.sourceCellId);

  if (!sourceCell) {
    return null;
  }

  const viewModel = buildDualUniverseViewModel(shape, sourceCell);

  if (viewModel.kind !== 'semantic-model') {
    return null;
  }

  const { semanticModel } = viewModel;

  if (target.kind === 'cell') {
    return semanticModel.dualCell.id === target.dualCellId
      ? {
          kind: 'cell',
          target,
          semanticModel,
          sourceCell,
          dualCell: semanticModel.dualCell,
        }
      : null;
  }

  if (target.kind === 'vertex') {
    const dualVertex = semanticModel.dualVertices[target.dualVertexId];
    const sourceFaceId = semanticModel.dualVertexToSourceFace[target.dualVertexId];

    if (!dualVertex || sourceFaceId !== target.sourceFaceId) {
      return null;
    }

    return {
      kind: 'vertex',
      target,
      semanticModel,
      sourceCell,
      dualVertex,
      sourceFace: shape.faces.find((face) => face.id === target.sourceFaceId) ?? null,
    };
  }

  if (target.kind === 'face') {
    const dualFace = semanticModel.dualFaces.find((face) => face.id === target.dualFaceId);
    const sourceVertexId = semanticModel.dualFaceToSourceVertex[target.dualFaceId];

    if (!dualFace || sourceVertexId !== target.sourceVertexId) {
      return null;
    }

    return {
      kind: 'face',
      target,
      semanticModel,
      sourceCell,
      dualFace,
      sourceVertex: shape.vertices[target.sourceVertexId] ?? null,
    };
  }

  const dualEdge = semanticModel.dualEdges.find((edge) => edge.id === target.dualEdgeId);
  const sourceEdgeId = semanticModel.dualEdgeToSourceEdge[target.dualEdgeId];

  if (!dualEdge || sourceEdgeId !== target.sourceEdgeId) {
    return null;
  }

  return {
    kind: 'edge',
    target,
    semanticModel,
    sourceCell,
    dualEdge,
    sourceEdge: shape.edges.find((edge) => edge.id === target.sourceEdgeId) ?? null,
  };
}

export function buildDualViewProxy(shape: Shape, cell: Cell): DualViewProxy | null {
  const topology = describeDualViewTopology(shape, cell);

  if (!topology.dual) {
    return null;
  }

  const correspondenceModel = buildDualCorrespondenceModel(shape, cell, topology.dual);

  if (!correspondenceModel) {
    return null;
  }

  return {
    cellId: cell.id,
    topology: topology.dual,
    vertices: Object.values(correspondenceModel.dualVertices),
    faces: correspondenceModel.dualFaces,
    correspondenceModel,
  };
}

export function buildDualCorrespondenceModel(
  shape: Shape,
  cell: Cell,
  dualTopologyLabel: string,
): DualCorrespondenceModel | null {
  const sourceFaces = getCellFaces(shape, cell);
  const sourceVertices = getCellVertices(shape, cell);

  if (
    !sourceFaces.length ||
    sourceFaces.length !== cell.faceIds.length ||
    !sourceVertices.length ||
    sourceVertices.length !== cell.vertexIds.length ||
    sourceFaces.some((face) => !isWellFormedSourceFace(shape, cell, face))
  ) {
    return null;
  }

  const sourceEdgeEntries = buildSourceEdgeEntries(shape, sourceFaces);

  if (!sourceEdgeEntries) {
    return null;
  }

  const sourceCentroid = averagePosition(sourceVertices.map((vertex) => vertex.position));
  const rawDualPositions = sourceFaces.map((face) => faceCentroid(shape, face));
  const scaleFactor = dualScaleFactor(
    sourceCentroid,
    sourceVertices.map((vertex) => vertex.position),
    rawDualPositions,
  );
  const dualVertexByFaceId = new Map<string, DualVertexEntry>();

  for (let index = 0; index < sourceFaces.length; index += 1) {
    const face = sourceFaces[index];
    const vertex = {
      id: makeDualViewVertexId(cell.id, face.id),
      position: scaleAround(sourceCentroid, rawDualPositions[index], scaleFactor),
    };

    dualVertexByFaceId.set(face.id, { face, vertex });
  }

  const dualFaceEntries = sourceVertices.map((sourceVertex) =>
    createDualFaceEntry(shape, cell, sourceVertex, sourceFaces, sourceCentroid, dualVertexByFaceId),
  );
  const dualEdgeEntries = createDualEdgeEntries(cell, sourceEdgeEntries, dualVertexByFaceId);

  if (!dualEdgeEntries) {
    return null;
  }

  if (
    dualFaceEntries.some((entry) => entry.face.vertexIds.length < 3) ||
    hasDuplicateIds(Array.from(dualVertexByFaceId.values()).map((entry) => entry.vertex.id)) ||
    hasDuplicateIds(dualFaceEntries.map((entry) => entry.face.id)) ||
    hasDuplicateIds(dualEdgeEntries.map((entry) => entry.edge.id)) ||
    !hasDualFaceEdgeCoherence(dualFaceEntries, dualEdgeEntries)
  ) {
    return null;
  }

  return {
    sourceCellId: cell.id,
    dualModelId: makeDualCorrespondenceModelId(cell.id, dualTopologyLabel),
    dualTopologyLabel,
    dualVertices: Object.fromEntries(
      sourceFaces.map((face) => {
        const vertex = getDualVertex(dualVertexByFaceId, face.id).vertex;

        return [vertex.id, vertex];
      }),
    ),
    dualFaces: dualFaceEntries.map((entry) => entry.face),
    dualEdges: dualEdgeEntries.map((entry) => entry.edge),
    sourceFaceToDualVertex: Object.fromEntries(
      sourceFaces.map((face) => [face.id, getDualVertex(dualVertexByFaceId, face.id).vertex.id]),
    ),
    dualVertexToSourceFace: Object.fromEntries(
      sourceFaces.map((face) => [getDualVertex(dualVertexByFaceId, face.id).vertex.id, face.id]),
    ),
    sourceVertexToDualFace: Object.fromEntries(
      dualFaceEntries.map((entry) => [entry.sourceVertexId, entry.face.id]),
    ),
    dualFaceToSourceVertex: Object.fromEntries(
      dualFaceEntries.map((entry) => [entry.face.id, entry.sourceVertexId]),
    ),
    sourceEdgeToDualEdge: Object.fromEntries(
      dualEdgeEntries.map((entry) => [entry.sourceEdge.id, entry.edge.id]),
    ),
    dualEdgeToSourceEdge: Object.fromEntries(
      dualEdgeEntries.map((entry) => [entry.edge.id, entry.sourceEdge.id]),
    ),
  };
}

function isWellFormedSourceFace(shape: Shape, cell: Cell, face: Face): boolean {
  const cellVertexIds = new Set(cell.vertexIds);
  const faceVertexIds = new Set(face.vertexIds);

  return (
    face.vertexIds.length >= 3 &&
    faceVertexIds.size === face.vertexIds.length &&
    face.vertexIds.every((vertexId) => cellVertexIds.has(vertexId) && Boolean(shape.vertices[vertexId]))
  );
}

function buildSourceEdgeEntries(shape: Shape, sourceFaces: Face[]): SourceEdgeEntry[] | null {
  const sourceEdgeByKey = new Map(
    shape.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]),
  );
  const incidentFacesByEdgeKey = new Map<string, Face[]>();

  for (const face of sourceFaces) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);

      if (!sourceEdgeByKey.has(key)) {
        return null;
      }

      incidentFacesByEdgeKey.set(key, [...(incidentFacesByEdgeKey.get(key) ?? []), face]);
    }
  }

  const entries: SourceEdgeEntry[] = [];

  for (const [key, incidentFaces] of incidentFacesByEdgeKey) {
    const edge = sourceEdgeByKey.get(key);

    if (!edge || incidentFaces.length !== 2) {
      return null;
    }

    entries.push({
      edge,
      incidentFaces: [incidentFaces[0], incidentFaces[1]],
    });
  }

  return entries.sort((a, b) => a.edge.id.localeCompare(b.edge.id));
}

function createDualEdgeEntries(
  cell: Cell,
  sourceEdgeEntries: SourceEdgeEntry[],
  dualVertexByFaceId: Map<string, DualVertexEntry>,
): DualEdgeEntry[] | null {
  return sourceEdgeEntries.map(({ edge: sourceEdge, incidentFaces }) => {
    const dualVertexA = getDualVertex(dualVertexByFaceId, incidentFaces[0].id).vertex.id;
    const dualVertexB = getDualVertex(dualVertexByFaceId, incidentFaces[1].id).vertex.id;
    const vertexIds = [dualVertexA, dualVertexB].sort() as [string, string];

    return {
      sourceEdge,
      edge: {
        id: makeDualViewEdgeId(cell.id, sourceEdge.id, vertexIds),
        vertexIds,
        sourceEdgeId: sourceEdge.id,
      },
    };
  });
}

function hasDualFaceEdgeCoherence(
  dualFaceEntries: DualFaceEntry[],
  dualEdgeEntries: DualEdgeEntry[],
): boolean {
  const boundaryEdgeCounts = new Map<string, number>();

  for (const { face } of dualFaceEntries) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];

      if (a === b) {
        return false;
      }

      const key = canonicalEdgeKey(a, b);
      boundaryEdgeCounts.set(key, (boundaryEdgeCounts.get(key) ?? 0) + 1);
    }
  }

  const dualEdgeKeys = new Set<string>();

  for (const { edge } of dualEdgeEntries) {
    const key = canonicalEdgeKey(...edge.vertexIds);

    if (dualEdgeKeys.has(key)) {
      return false;
    }

    dualEdgeKeys.add(key);
  }

  if (boundaryEdgeCounts.size !== dualEdgeKeys.size) {
    return false;
  }

  for (const [key, count] of boundaryEdgeCounts) {
    if (count !== 2 || !dualEdgeKeys.has(key)) {
      return false;
    }
  }

  for (const key of dualEdgeKeys) {
    if (!boundaryEdgeCounts.has(key)) {
      return false;
    }
  }

  return true;
}

function isSemanticDualUniverseSource(shape: Shape, cell: Cell): boolean {
  return (
    cell.kind === 'core' &&
    cell.topology === 'pyritohedral-icosahedron' &&
    isCellActiveFrontier(shape, cell.id)
  );
}

function getDualUniverseUnsupportedReason(shape: Shape, cell: Cell): string {
  if (cell.kind === 'core' && cell.topology === 'pyritohedral-icosahedron') {
    return 'Semantic Dual Universe is available only for active pyritohedral-icosahedron core cells.';
  }

  const topology = describeDualViewTopology(shape, cell);

  if (topology.source !== 'unknown') {
    return `Dual Universe is not available for ${topology.source}.`;
  }

  return 'Dual Universe is not available for this cell topology.';
}

function createDualFaceEntry(
  shape: Shape,
  cell: Cell,
  sourceVertex: Vertex,
  sourceFaces: Face[],
  sourceCentroid: Vec3,
  dualVertexByFaceId: Map<string, DualVertexEntry>,
): DualFaceEntry {
  const incidentFaces = sourceFaces.filter((face) => face.vertexIds.includes(sourceVertex.id));
  const orderedFaces = orderIncidentFaces(shape, sourceVertex, incidentFaces, sourceCentroid);
  const vertexIds = orderedFaces.map((face) => getDualVertex(dualVertexByFaceId, face.id).vertex.id);

  return {
    sourceVertexId: sourceVertex.id,
    face: {
      id: makeDualViewFaceId(cell.id, sourceVertex.id, vertexIds),
      vertexIds,
    },
  };
}

function orderIncidentFaces(
  shape: Shape,
  sourceVertex: Vertex,
  incidentFaces: Face[],
  sourceCentroid: Vec3,
): Face[] {
  const normal = normalizeVec3(
    subtractVec3(sourceVertex.position, sourceCentroid),
    fallbackDirection(sourceVertex.id),
  );
  const basis = tangentBasis(normal);

  return [...incidentFaces].sort((a, b) => {
    const angleA = faceAngle(shape, a, sourceVertex.position, basis.u, basis.v);
    const angleB = faceAngle(shape, b, sourceVertex.position, basis.u, basis.v);
    const angleDelta = angleA - angleB;

    return Math.abs(angleDelta) > 0.000001 ? angleDelta : a.id.localeCompare(b.id);
  });
}

function faceAngle(shape: Shape, face: Face, origin: Vec3, u: Vec3, v: Vec3): number {
  const projected = subtractVec3(faceCentroid(shape, face), origin);

  return Math.atan2(dotVec3(projected, v), dotVec3(projected, u));
}

function makeDualCorrespondenceModelId(cellId: string, dualTopologyLabel: string): string {
  return `dual-model:${stableHash(`${cellId}|${dualTopologyLabel}|dual-correspondence`)}`;
}

function makeDualViewVertexId(cellId: string, faceId: string): string {
  return `vertex:dual-view:${stableHash(`${cellId}|${faceId}`)}`;
}

function makeDualViewFaceId(cellId: string, sourceVertexId: string, vertexIds: string[]): string {
  return `face:dual-view:${stableHash(`${cellId}|${sourceVertexId}|${vertexIds.join('|')}`)}`;
}

function makeDualViewEdgeId(cellId: string, sourceEdgeId: string, vertexIds: [string, string]): string {
  return `edge:dual-view:${stableHash(`${cellId}|${sourceEdgeId}|${vertexIds.join('|')}`)}`;
}

function getDualVertex(entries: Map<string, DualVertexEntry>, sourceFaceId: string): DualVertexEntry {
  const entry = entries.get(sourceFaceId);

  if (!entry) {
    throw new Error(`Missing dual view vertex for source face ${sourceFaceId}`);
  }

  return entry;
}

function hasDuplicateIds(ids: string[]): boolean {
  return new Set(ids).size !== ids.length;
}

function faceCentroid(shape: Shape, face: Face): Vec3 {
  return averagePosition(getFaceVertices(shape, face).map((vertex) => vertex.position));
}

function dualScaleFactor(sourceCentroid: Vec3, sourcePositions: Vec3[], rawDualPositions: Vec3[]): number {
  const rawDualRadius = averageDistance(sourceCentroid, rawDualPositions);

  if (rawDualRadius < 0.0001) {
    return 1;
  }

  return averageDistance(sourceCentroid, sourcePositions) / rawDualRadius;
}

function averageDistance(origin: Vec3, positions: Vec3[]): number {
  if (!positions.length) {
    return 0;
  }

  return (
    positions.reduce(
      (total, position) =>
        total +
        Math.hypot(position[0] - origin[0], position[1] - origin[1], position[2] - origin[2]),
      0,
    ) / positions.length
  );
}

function averagePosition(positions: Vec3[]): Vec3 {
  if (!positions.length) {
    return [0, 0, 0];
  }

  return scaleVec3(
    positions.reduce<Vec3>((sum, position) => addVec3(sum, position), [0, 0, 0]),
    1 / positions.length,
  );
}

function scaleAround(origin: Vec3, position: Vec3, scale: number): Vec3 {
  return addVec3(origin, scaleVec3(subtractVec3(position, origin), scale));
}

function tangentBasis(normal: Vec3): { u: Vec3; v: Vec3 } {
  const reference: Vec3 = Math.abs(normal[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0];
  const u = normalizeVec3(crossVec3(reference, normal), [0, 0, 1]);
  const v = normalizeVec3(crossVec3(normal, u), [0, 1, 0]);

  return { u, v };
}

function addVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtractVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scaleVec3([x, y, z]: Vec3, scale: number): Vec3 {
  return [x * scale, y * scale, z * scale];
}

function dotVec3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function crossVec3(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalizeVec3(vector: Vec3, fallback: Vec3): Vec3 {
  const length = Math.hypot(vector[0], vector[1], vector[2]);

  if (length < 0.0001) {
    return fallback;
  }

  return scaleVec3(vector, 1 / length);
}

function fallbackDirection(seed: string): Vec3 {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 2654435761);
  }

  const angle = ((hash >>> 0) / 4294967295) * Math.PI * 2;

  return normalizeVec3([Math.cos(angle), Math.sin(angle), 0.5], [1, 0, 0]);
}
