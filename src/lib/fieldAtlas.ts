import type {
  Cell,
  CellId,
  Face,
  FaceId,
  Shape,
  ShapeId,
  Vec3,
  Vertex,
  VertexId,
} from '../types/geometry';
import { getCellLifecycleStatus } from './cellLifecycle';

export interface ComplexValue {
  re: number;
  im: number;
}

export type FieldSourceDomainKind =
  | 'triangle-reference'
  | 'polygon-face-reference'
  | 'cell-surface-reference'
  | 'closed-shape-surface-reference'
  | 'shape-vertices-reference';

export type ComputationalChartSemanticRole = 'computational-only';
export type DirectFaceChartSemanticRole = 'face-local';
export type FieldChartSemanticRole =
  | ComputationalChartSemanticRole
  | DirectFaceChartSemanticRole;

export interface DirectTriangleFaceChart {
  kind: 'direct-triangle-face-chart';
  semanticRole: DirectFaceChartSemanticRole;
  chartId: string;
  sourceFaceId: FaceId;
  positions: [Vec3, Vec3, Vec3];
  boundaryVertexIds: [VertexId, VertexId, VertexId];
  sourceVertexIds: [VertexId, VertexId, VertexId];
  support: {
    kind: 'source-face';
    faceId: FaceId;
  };
}

export interface ComputationalTriangleChart {
  kind: 'computational-triangle-chart';
  semanticRole: ComputationalChartSemanticRole;
  chartId: string;
  sourceFaceId: FaceId;
  positions: [Vec3, Vec3, Vec3];
  boundaryVertexIds: [VertexId, VertexId];
  sourceVertexIds: [VertexId, VertexId];
  computationalSupport: {
    kind: 'polygon-centroid';
    position: Vec3;
  };
}

export type FieldSurfaceSampleChart = DirectTriangleFaceChart | ComputationalTriangleChart;

export interface SingleCellSeedSurfaceSelectionStrategy {
  kind: 'single-cell-seed-surface';
  reliability: 'supported';
  sourceCellId: CellId;
}

export interface TopologicalCellFaceIncidenceSelectionStrategy {
  kind: 'topological-cell-face-incidence';
  reliability: 'supported';
  activeCellIds: CellId[];
  boundaryFaceCount: number;
  internalFaceCount: number;
}

export type ClosedShapeSurfaceSelectionStrategy =
  | SingleCellSeedSurfaceSelectionStrategy
  | TopologicalCellFaceIncidenceSelectionStrategy;

export interface ClosedShapeFaceIncidence {
  cellId: CellId;
  faceId: FaceId;
  faceRole: Face['role'];
  vertexIds: VertexId[];
}

export interface ClosedShapeBoundaryFace {
  faceKey: string;
  incidence: ClosedShapeFaceIncidence;
}

export interface ClosedShapeInternalFace {
  faceKey: string;
  incidences: [ClosedShapeFaceIncidence, ClosedShapeFaceIncidence];
}

export type ClosedShapeSurfaceBoundaryClassification =
  | {
      status: 'supported';
      strategyKind: 'topological-cell-face-incidence';
      activeCellIds: CellId[];
      boundaryFaces: ClosedShapeBoundaryFace[];
      internalFaces: ClosedShapeInternalFace[];
    }
  | {
      status: 'unsupported';
      strategyKind: 'topological-cell-face-incidence';
      reason: string;
      details?: string[];
    };

export interface TriangleSourceDomain {
  kind: 'triangle-reference';
  id: string;
  vertexIds: [VertexId, VertexId, VertexId];
  positions: [Vec3, Vec3, Vec3];
  faceId?: FaceId;
}

export interface PolygonFaceSourceDomain {
  kind: 'polygon-face-reference';
  id: string;
  faceId: FaceId;
  vertexIds: VertexId[];
  positions: Vec3[];
  computationalCharts: ComputationalTriangleChart[];
}

export interface CellSurfaceSourceDomain {
  kind: 'cell-surface-reference';
  id: string;
  cellId: CellId;
  faceIds: FaceId[];
  vertexIds: VertexId[];
  positions: Vec3[];
  surfaceCharts: FieldSurfaceSampleChart[];
}

export interface ClosedShapeSurfaceSourceDomain {
  kind: 'closed-shape-surface-reference';
  id: string;
  shapeId: ShapeId;
  faceIds: FaceId[];
  vertexIds: VertexId[];
  positions: Vec3[];
  surfaceCharts: FieldSurfaceSampleChart[];
  surfaceSelectionStrategy: ClosedShapeSurfaceSelectionStrategy;
}

export interface ShapeVerticesSourceDomain {
  kind: 'shape-vertices-reference';
  id: string;
  vertexIds: VertexId[];
  positions: Vec3[];
}

export type FieldSourceDomain =
  | TriangleSourceDomain
  | PolygonFaceSourceDomain
  | CellSurfaceSourceDomain
  | ClosedShapeSurfaceSourceDomain
  | ShapeVerticesSourceDomain;

export type FieldAtlasSourceKind =
  | 'seed'
  | 'preserved'
  | 'generated-child'
  | 'ambo-midpoint-child';

export interface FieldAtlasSourcePolicy {
  name: string;
  amplitude: number;
  waveNumber: number;
  phaseStep: number;
  attenuation: number;
}

export interface FieldAtlasSource {
  sourceId: string;
  vertexId: VertexId;
  position: Vec3;
  amplitude: number;
  waveNumber: number;
  phase: number;
  attenuation: number;
  sourceKind: FieldAtlasSourceKind;
  sourceOrder: number;
  policyName: string;
  label?: string;
}

export interface FieldAtlasSamplePoint {
  id: string;
  position: Vec3;
  localChartPosition?: [number, number];
  barycentric?: [number, number, number];
  chartId?: string;
  chartSemanticRole?: FieldChartSemanticRole;
}

export interface FieldSourceContribution {
  sourceId: string;
  vertexId: VertexId;
  value: ComplexValue;
  magnitude: number;
  ratio: number;
  distance: number;
}

export interface FieldSourceScalar {
  sourceId: string;
  vertexId: VertexId;
  value: number;
}

export interface FieldAtlasSample {
  id: string;
  position: Vec3;
  localChartPosition?: [number, number];
  barycentric?: [number, number, number];
  chartId?: string;
  chartSemanticRole?: FieldChartSemanticRole;
  psi: ComplexValue;
  intensity: number;
  phase: number;
  contributions: FieldSourceContribution[];
  contributionMagnitudes: FieldSourceScalar[];
  contributionRatios: FieldSourceScalar[];
}

export interface SampleFieldAtlasAtPointOptions {
  sampleId?: string;
  localChartPosition?: [number, number];
  barycentric?: [number, number, number];
  chartId?: string;
  chartSemanticRole?: FieldChartSemanticRole;
}

export const DEFAULT_FIELD_ATLAS_SOURCE_POLICY: FieldAtlasSourcePolicy = {
  name: 'deterministic-source-order-v1',
  amplitude: 1,
  waveNumber: Math.PI,
  phaseStep: (2 * Math.PI) / 3,
  attenuation: 0.05,
};

export function buildTriangleFaceSourceDomain(
  shape: Shape,
  faceId?: FaceId,
): TriangleSourceDomain {
  const face = faceId
    ? shape.faces.find((candidate) => candidate.id === faceId)
    : shape.faces.find((candidate) => candidate.vertexIds.length === 3);

  if (!face) {
    throw new Error(faceId ? `Face ${faceId} was not found.` : 'No triangular face was found.');
  }

  if (face.vertexIds.length !== 3) {
    throw new Error(`Face ${face.id} is not triangular.`);
  }

  return buildTriangleSourceDomain(shape, face.vertexIds as [VertexId, VertexId, VertexId], {
    domainId: `field-domain:triangle-face:${face.id}`,
    faceId: face.id,
  });
}

export function buildTriangleSourceDomain(
  shape: Shape,
  vertexIds: [VertexId, VertexId, VertexId],
  options: { domainId?: string; faceId?: FaceId } = {},
): TriangleSourceDomain {
  const uniqueVertexIds = new Set(vertexIds);

  if (uniqueVertexIds.size !== 3) {
    throw new Error('Triangle source-domain requires three distinct vertices.');
  }

  const positions = vertexIds.map((vertexId) => {
    const vertex = shape.vertices[vertexId];

    if (!vertex) {
      throw new Error(`Triangle source-domain references missing vertex ${vertexId}.`);
    }

    return copyVec3(vertex.position);
  }) as [Vec3, Vec3, Vec3];

  return {
    kind: 'triangle-reference',
    id: options.domainId ?? `field-domain:triangle:${vertexIds.join('|')}`,
    vertexIds: [vertexIds[0], vertexIds[1], vertexIds[2]],
    positions,
    ...(options.faceId ? { faceId: options.faceId } : {}),
  };
}

export function buildPolygonFaceSourceDomain(
  shape: Shape,
  faceId: FaceId,
): PolygonFaceSourceDomain {
  const face = shape.faces.find((candidate) => candidate.id === faceId);

  if (!face) {
    throw new Error(`Face ${faceId} was not found.`);
  }

  if (face.vertexIds.length < 3) {
    throw new Error(`Face ${face.id} needs at least three boundary vertices for a polygon domain.`);
  }

  const vertexIds = [...face.vertexIds];
  const positions = vertexIds.map((vertexId) => {
    const vertex = shape.vertices[vertexId];

    if (!vertex) {
      throw new Error(`Polygon source-domain references missing vertex ${vertexId}.`);
    }

    return copyVec3(vertex.position);
  });
  const centroid = centroidVec3(positions);

  return {
    kind: 'polygon-face-reference',
    id: `field-domain:polygon-face:${face.id}`,
    faceId: face.id,
    vertexIds,
    positions,
    computationalCharts: buildCentroidFanComputationalCharts(
      face.id,
      vertexIds,
      positions,
      centroid,
      `field-chart:polygon-face:${face.id}:centroid-fan`,
    ),
  };
}

export function buildCellSurfaceSourceDomain(
  shape: Shape,
  cellId: CellId,
): CellSurfaceSourceDomain {
  const cell = shape.cells.find((candidate) => candidate.id === cellId);

  if (!cell) {
    throw new Error(`Cell ${cellId} was not found.`);
  }

  const faces = cell.faceIds.map((faceId) => {
    const face = shape.faces.find((candidate) => candidate.id === faceId);

    if (!face) {
      throw new Error(`Cell ${cell.id} references missing face ${faceId}.`);
    }

    return face;
  });
  const vertexIds = uniqueVertexIds(
    faces.flatMap((face) => {
      if (face.vertexIds.length < 3) {
        throw new Error(`Cell surface face ${face.id} needs at least three vertices.`);
      }

      return face.vertexIds.map((vertexId) => {
        if (!shape.vertices[vertexId]) {
          throw new Error(`Cell surface face ${face.id} references missing vertex ${vertexId}.`);
        }

        return vertexId;
      });
    }),
  );

  if (!vertexIds.length) {
    throw new Error(`Cell ${cell.id} has no surface vertices.`);
  }

  return {
    kind: 'cell-surface-reference',
    id: `field-domain:cell-surface:${cell.id}`,
    cellId: cell.id,
    faceIds: [...cell.faceIds],
    vertexIds,
    positions: vertexIds.map((vertexId) => copyVec3(shape.vertices[vertexId].position)),
    surfaceCharts: faces.flatMap((face) =>
      buildFaceSurfaceCharts(shape, face, `field-chart:cell-surface:${cell.id}:face:${face.id}`),
    ),
  };
}

export function classifyClosedShapeSurfaceBoundary(
  shape: Shape,
): ClosedShapeSurfaceBoundaryClassification {
  const activeCells = shape.cells.filter(
    (cell) => getCellLifecycleStatus(shape, cell.id) === 'active',
  );

  if (!activeCells.length) {
    return unsupportedBoundaryClassification('Shape has no active cells to classify.');
  }

  const faceById = new Map(shape.faces.map((face) => [face.id, face]));
  const incidenceByFaceKey = new Map<string, ClosedShapeFaceIncidence[]>();
  const inactiveIncidenceByFaceKey = buildInactiveIncidenceByFaceKey(shape, activeCells);
  const details: string[] = [];

  for (const cell of activeCells) {
    if (!cell.faceIds.length) {
      details.push(`Active cell ${cell.id} has no faceIds.`);
      continue;
    }

    const seenKeysForCell = new Set<string>();

    for (const faceId of cell.faceIds) {
      const face = faceById.get(faceId);

      if (!face) {
        details.push(`Active cell ${cell.id} references missing face ${faceId}.`);
        continue;
      }

      const faceProblem = validateClassifiableFace(shape, cell, face);

      if (faceProblem) {
        details.push(faceProblem);
        continue;
      }

      const faceKey = normalizedFaceVertexKey(face.vertexIds);

      if (seenKeysForCell.has(faceKey)) {
        details.push(`Active cell ${cell.id} repeats normalized face key ${faceKey}.`);
        continue;
      }

      seenKeysForCell.add(faceKey);

      const incidences = incidenceByFaceKey.get(faceKey) ?? [];

      incidences.push({
        cellId: cell.id,
        faceId: face.id,
        faceRole: face.role,
        vertexIds: [...face.vertexIds],
      });
      incidenceByFaceKey.set(faceKey, incidences);
    }
  }

  if (details.length) {
    return unsupportedBoundaryClassification(
      'Closed-shape surface boundary classification found invalid cell-face references.',
      details,
    );
  }

  const boundaryFaces: ClosedShapeBoundaryFace[] = [];
  const internalFaces: ClosedShapeInternalFace[] = [];
  const ambiguousInactiveMatches: string[] = [];

  for (const [faceKey, incidences] of incidenceByFaceKey) {
    if (incidences.length === 1) {
      const inactiveIncidences = inactiveIncidenceByFaceKey.get(faceKey) ?? [];

      if (inactiveIncidences.length) {
        ambiguousInactiveMatches.push(
          `Boundary candidate ${incidences[0].faceId} on active cell ${incidences[0].cellId} also appears on non-active face(s) ${inactiveIncidences
            .map((incidence) => incidence.faceId)
            .join(', ')}.`,
        );
        continue;
      }

      boundaryFaces.push({ faceKey, incidence: incidences[0] });
      continue;
    }

    if (incidences.length === 2) {
      const [first, second] = incidences;

      if (first.cellId === second.cellId) {
        return unsupportedBoundaryClassification(
          'Closed-shape surface boundary classification found duplicate face incidence within one cell.',
          [`Cell ${first.cellId} has multiple incidences for normalized face key ${faceKey}.`],
        );
      }

      internalFaces.push({ faceKey, incidences: [first, second] });
      continue;
    }

    return unsupportedBoundaryClassification(
      'Closed-shape surface boundary classification found non-manifold face incidence.',
      [`Normalized face key ${faceKey} has ${incidences.length} active-cell incidences.`],
    );
  }

  if (ambiguousInactiveMatches.length) {
    return unsupportedBoundaryClassification(
      'Closed-shape surface boundary classification found active boundary candidates that also occur on expanded or historical cells.',
      ambiguousInactiveMatches,
    );
  }

  if (!boundaryFaces.length) {
    return unsupportedBoundaryClassification(
      'Closed-shape surface boundary classification found no boundary faces.',
    );
  }

  return {
    status: 'supported',
    strategyKind: 'topological-cell-face-incidence',
    activeCellIds: activeCells.map((cell) => cell.id),
    boundaryFaces,
    internalFaces,
  };
}

export function buildClosedShapeSurfaceSourceDomain(shape: Shape): ClosedShapeSurfaceSourceDomain {
  const sourceCell = getSupportedClosedShapeSurfaceCell(shape);

  if (sourceCell) {
    const cellSurface = buildCellSurfaceSourceDomain(shape, sourceCell.id);

    return {
      kind: 'closed-shape-surface-reference',
      id: `field-domain:closed-shape-surface:${shape.id}`,
      shapeId: shape.id,
      faceIds: cellSurface.faceIds,
      vertexIds: cellSurface.vertexIds,
      positions: cellSurface.positions.map(copyVec3),
      surfaceCharts: cellSurface.surfaceCharts,
      surfaceSelectionStrategy: {
        kind: 'single-cell-seed-surface',
        reliability: 'supported',
        sourceCellId: sourceCell.id,
      },
    };
  }

  if (shape.genealogy.operation !== 'ambo-dissection') {
    throw new Error(
      `Closed-shape surface domains for ${shape.genealogy.operation} shapes are not supported yet.`,
    );
  }

  const boundaryClassification = classifyClosedShapeSurfaceBoundary(shape);

  if (boundaryClassification.status === 'unsupported') {
    throw new Error(formatUnsupportedBoundaryClassification(boundaryClassification));
  }

  const boundaryFaceIds = boundaryClassification.boundaryFaces.map(
    (boundaryFace) => boundaryFace.incidence.faceId,
  );
  const boundaryFaces = boundaryFaceIds.map((faceId) => {
    const face = shape.faces.find((candidate) => candidate.id === faceId);

    if (!face) {
      throw new Error(`Closed-shape boundary references missing face ${faceId}.`);
    }

    return face;
  });
  const vertexIds = uniqueVertexIds(boundaryFaces.flatMap((face) => face.vertexIds));

  return {
    kind: 'closed-shape-surface-reference',
    id: `field-domain:closed-shape-surface:${shape.id}`,
    shapeId: shape.id,
    faceIds: boundaryFaceIds,
    vertexIds,
    positions: vertexIds.map((vertexId) => copyVec3(shape.vertices[vertexId].position)),
    surfaceCharts: boundaryFaces.flatMap((face) =>
      buildFaceSurfaceCharts(
        shape,
        face,
        `field-chart:closed-shape-surface:${shape.id}:face:${face.id}`,
      ),
    ),
    surfaceSelectionStrategy: {
      kind: 'topological-cell-face-incidence',
      reliability: 'supported',
      activeCellIds: boundaryClassification.activeCellIds,
      boundaryFaceCount: boundaryClassification.boundaryFaces.length,
      internalFaceCount: boundaryClassification.internalFaces.length,
    },
  };
}

export function buildShapeVerticesSourceDomain(shape: Shape): ShapeVerticesSourceDomain {
  const vertexIds = Object.keys(shape.vertices).sort();

  return {
    kind: 'shape-vertices-reference',
    id: `field-domain:shape-vertices:${shape.id}`,
    vertexIds,
    positions: vertexIds.map((vertexId) => copyVec3(shape.vertices[vertexId].position)),
  };
}

export function buildFieldSourcePopulation(
  shape: Shape,
  domain: FieldSourceDomain,
  policy: FieldAtlasSourcePolicy = DEFAULT_FIELD_ATLAS_SOURCE_POLICY,
): FieldAtlasSource[] {
  const resolvedPolicy = resolveSourcePolicy(policy);

  return domain.vertexIds.map((vertexId, sourceOrder) => {
    const vertex = shape.vertices[vertexId];
    const position = domain.positions[sourceOrder];

    if (!vertex) {
      throw new Error(`Field source population references missing vertex ${vertexId}.`);
    }

    if (!position) {
      throw new Error(
        `Field source population missing domain position for ${vertexId} at source order ${sourceOrder}.`,
      );
    }

    const label = vertex.data.label.trim();

    return {
      sourceId: `field-source:${domain.id}:${vertexId}`,
      vertexId,
      position: copyVec3(position),
      amplitude: resolvedPolicy.amplitude,
      waveNumber: resolvedPolicy.waveNumber,
      phase: normalizePhase(sourceOrder * resolvedPolicy.phaseStep),
      attenuation: resolvedPolicy.attenuation,
      sourceKind: classifySourceKind(vertex),
      sourceOrder,
      policyName: resolvedPolicy.name,
      ...(label ? { label } : {}),
    };
  });
}

export function sampleFieldAtlasAtPoint(
  sources: FieldAtlasSource[],
  point: Vec3,
  options: SampleFieldAtlasAtPointOptions = {},
): FieldAtlasSample {
  const position = copyVec3(point);
  const rawContributions = sources.map((source) => {
    const distance = distanceVec3(source.position, position);
    const magnitude = source.amplitude * Math.exp(-source.attenuation * distance);
    const angle = source.waveNumber * distance + source.phase;
    const value = {
      re: magnitude * Math.cos(angle),
      im: magnitude * Math.sin(angle),
    };

    return {
      sourceId: source.sourceId,
      vertexId: source.vertexId,
      value,
      magnitude: complexMagnitude(value),
      ratio: 0,
      distance,
    };
  });
  const totalMagnitude = rawContributions.reduce(
    (sum, contribution) => sum + contribution.magnitude,
    0,
  );
  const contributions = rawContributions.map((contribution) => ({
    ...contribution,
    ratio: totalMagnitude > 0 ? contribution.magnitude / totalMagnitude : 0,
  }));
  const psi = contributions.reduce<ComplexValue>(
    (sum, contribution) => ({
      re: sum.re + contribution.value.re,
      im: sum.im + contribution.value.im,
    }),
    { re: 0, im: 0 },
  );

  return {
    id: options.sampleId ?? makeSampleId(position),
    position,
    ...(options.localChartPosition
      ? { localChartPosition: [...options.localChartPosition] as [number, number] }
      : {}),
    ...(options.barycentric
      ? { barycentric: [...options.barycentric] as [number, number, number] }
      : {}),
    ...(options.chartId ? { chartId: options.chartId } : {}),
    ...(options.chartSemanticRole ? { chartSemanticRole: options.chartSemanticRole } : {}),
    psi,
    intensity: squaredMagnitude(psi),
    phase: Math.atan2(psi.im, psi.re),
    contributions,
    contributionMagnitudes: contributions.map((contribution) => ({
      sourceId: contribution.sourceId,
      vertexId: contribution.vertexId,
      value: contribution.magnitude,
    })),
    contributionRatios: contributions.map((contribution) => ({
      sourceId: contribution.sourceId,
      vertexId: contribution.vertexId,
      value: contribution.ratio,
    })),
  };
}

export function sampleFieldAtlasPoints(
  sources: FieldAtlasSource[],
  samplePoints: FieldAtlasSamplePoint[],
): FieldAtlasSample[] {
  return samplePoints.map((point) =>
    sampleFieldAtlasAtPoint(sources, point.position, {
      sampleId: point.id,
      localChartPosition: point.localChartPosition,
      barycentric: point.barycentric,
      chartId: point.chartId,
      chartSemanticRole: point.chartSemanticRole,
    }),
  );
}

export function buildTriangleRepresentativeSamplePoints(
  domain: TriangleSourceDomain,
): FieldAtlasSamplePoint[] {
  const barycentricPoints: Array<{
    id: string;
    barycentric: [number, number, number];
  }> = [
    {
      id: `triangle:vertex:${domain.vertexIds[0]}`,
      barycentric: [1, 0, 0],
    },
    {
      id: `triangle:vertex:${domain.vertexIds[1]}`,
      barycentric: [0, 1, 0],
    },
    {
      id: `triangle:vertex:${domain.vertexIds[2]}`,
      barycentric: [0, 0, 1],
    },
    {
      id: 'triangle:centroid',
      barycentric: [1 / 3, 1 / 3, 1 / 3],
    },
    {
      id: `triangle:edge-midpoint:${domain.vertexIds[0]}:${domain.vertexIds[1]}`,
      barycentric: [0.5, 0.5, 0],
    },
    {
      id: `triangle:edge-midpoint:${domain.vertexIds[1]}:${domain.vertexIds[2]}`,
      barycentric: [0, 0.5, 0.5],
    },
    {
      id: `triangle:edge-midpoint:${domain.vertexIds[2]}:${domain.vertexIds[0]}`,
      barycentric: [0.5, 0, 0.5],
    },
  ];

  return barycentricPoints.map((point) => ({
    id: point.id,
    position: pointFromTriangleBarycentric(domain, point.barycentric),
    localChartPosition: [point.barycentric[1], point.barycentric[2]],
    barycentric: [point.barycentric[0], point.barycentric[1], point.barycentric[2]],
  }));
}

export function pointFromTriangleBarycentric(
  domain: TriangleSourceDomain,
  barycentric: [number, number, number],
): Vec3 {
  return [
    domain.positions[0][0] * barycentric[0] +
      domain.positions[1][0] * barycentric[1] +
      domain.positions[2][0] * barycentric[2],
    domain.positions[0][1] * barycentric[0] +
      domain.positions[1][1] * barycentric[1] +
      domain.positions[2][1] * barycentric[2],
    domain.positions[0][2] * barycentric[0] +
      domain.positions[1][2] * barycentric[1] +
      domain.positions[2][2] * barycentric[2],
  ];
}

export function buildPolygonRepresentativeSamplePoints(
  domain: PolygonFaceSourceDomain,
): FieldAtlasSamplePoint[] {
  const vertexSamplePoints = domain.vertexIds.map((vertexId, index) => ({
    id: `polygon:vertex:${vertexId}`,
    position: copyVec3(domain.positions[index]),
  }));
  const edgeMidpointSamplePoints = domain.computationalCharts.map((chart) =>
    pointFromComputationalTriangleChart(chart, [0, 0.5, 0.5], {
      id: `polygon:edge-midpoint:${chart.boundaryVertexIds[0]}:${chart.boundaryVertexIds[1]}`,
    }),
  );
  const chartCenterSamplePoints = domain.computationalCharts.map((chart) =>
    pointFromComputationalTriangleChart(chart, [1 / 3, 1 / 3, 1 / 3], {
      id: `polygon:chart-centroid:${chart.chartId}`,
    }),
  );
  const centroidChart = domain.computationalCharts[0];
  const centroidSamplePoint = centroidChart
    ? pointFromComputationalTriangleChart(centroidChart, [1, 0, 0], {
        id: `polygon:centroid:${domain.faceId}`,
      })
    : {
        id: `polygon:centroid:${domain.faceId}`,
        position: centroidVec3(domain.positions),
      };

  return [
    ...vertexSamplePoints,
    centroidSamplePoint,
    ...edgeMidpointSamplePoints,
    ...chartCenterSamplePoints,
  ];
}

export function pointFromComputationalTriangleChart(
  chart: ComputationalTriangleChart,
  barycentric: [number, number, number],
  options: { id?: string } = {},
): FieldAtlasSamplePoint {
  return {
    id: options.id ?? `polygon:chart-sample:${chart.chartId}`,
    position: pointFromPositionsBarycentric(chart.positions, barycentric),
    localChartPosition: [barycentric[1], barycentric[2]],
    barycentric: [barycentric[0], barycentric[1], barycentric[2]],
    chartId: chart.chartId,
    chartSemanticRole: chart.semanticRole,
  };
}

export function buildCellSurfaceRepresentativeSamplePoints(
  domain: CellSurfaceSourceDomain,
): FieldAtlasSamplePoint[] {
  const vertexSamplePoints = domain.vertexIds.map((vertexId, index) => ({
    id: `cell-surface:vertex:${vertexId}`,
    position: copyVec3(domain.positions[index]),
  }));
  const chartSamplePoints = domain.surfaceCharts.map((chart) => {
    if (chart.kind === 'direct-triangle-face-chart') {
      return pointFromDirectTriangleFaceChart(chart, [1 / 3, 1 / 3, 1 / 3], {
        id: `cell-surface:face-centroid:${chart.sourceFaceId}`,
      });
    }

    return pointFromComputationalTriangleChart(chart, [1 / 3, 1 / 3, 1 / 3], {
      id: `cell-surface:chart-centroid:${chart.chartId}`,
    });
  });

  return [...vertexSamplePoints, ...chartSamplePoints];
}

export function buildClosedShapeSurfaceRepresentativeSamplePoints(
  domain: ClosedShapeSurfaceSourceDomain,
): FieldAtlasSamplePoint[] {
  const vertexSamplePoints = domain.vertexIds.map((vertexId, index) => ({
    id: `closed-shape-surface:vertex:${vertexId}`,
    position: copyVec3(domain.positions[index]),
  }));
  const chartSamplePoints = domain.surfaceCharts.map((chart) => {
    if (chart.kind === 'direct-triangle-face-chart') {
      return pointFromDirectTriangleFaceChart(chart, [1 / 3, 1 / 3, 1 / 3], {
        id: `closed-shape-surface:face-centroid:${chart.sourceFaceId}`,
      });
    }

    return pointFromComputationalTriangleChart(chart, [1 / 3, 1 / 3, 1 / 3], {
      id: `closed-shape-surface:chart-centroid:${chart.chartId}`,
    });
  });

  return [...vertexSamplePoints, ...chartSamplePoints];
}

export function pointFromDirectTriangleFaceChart(
  chart: DirectTriangleFaceChart,
  barycentric: [number, number, number],
  options: { id?: string } = {},
): FieldAtlasSamplePoint {
  return {
    id: options.id ?? `cell-surface:direct-face-sample:${chart.chartId}`,
    position: pointFromPositionsBarycentric(chart.positions, barycentric),
    localChartPosition: [barycentric[1], barycentric[2]],
    barycentric: [barycentric[0], barycentric[1], barycentric[2]],
    chartId: chart.chartId,
    chartSemanticRole: chart.semanticRole,
  };
}

function resolveSourcePolicy(policy: FieldAtlasSourcePolicy): FieldAtlasSourcePolicy {
  return {
    name: policy.name.trim() || DEFAULT_FIELD_ATLAS_SOURCE_POLICY.name,
    amplitude: finiteNonnegative(policy.amplitude, DEFAULT_FIELD_ATLAS_SOURCE_POLICY.amplitude),
    waveNumber: finiteNumber(policy.waveNumber, DEFAULT_FIELD_ATLAS_SOURCE_POLICY.waveNumber),
    phaseStep: finiteNumber(policy.phaseStep, DEFAULT_FIELD_ATLAS_SOURCE_POLICY.phaseStep),
    attenuation: finiteNonnegative(policy.attenuation, DEFAULT_FIELD_ATLAS_SOURCE_POLICY.attenuation),
  };
}

function classifySourceKind(vertex: Vertex): FieldAtlasSourceKind {
  if (
    vertex.createdBy.operation === 'ambo-dissection' &&
    (vertex.createdBy.sourceEdgeId ||
      vertex.data.lineage?.inheritanceMode === 'derived-from-edge')
  ) {
    return 'ambo-midpoint-child';
  }

  if (vertex.createdBy.operation === 'seed') {
    return 'seed';
  }

  if (vertex.data.lineage?.inheritanceMode === 'preserved') {
    return 'preserved';
  }

  return 'generated-child';
}

function finiteNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function finiteNonnegative(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function normalizePhase(value: number): number {
  const tau = 2 * Math.PI;
  const normalized = value % tau;

  return normalized >= 0 ? normalized : normalized + tau;
}

function complexMagnitude(value: ComplexValue): number {
  return Math.hypot(value.re, value.im);
}

function squaredMagnitude(value: ComplexValue): number {
  return value.re * value.re + value.im * value.im;
}

function getSupportedClosedShapeSurfaceCell(shape: Shape) {
  if (shape.cells.length !== 1 || shape.genealogy.operation !== 'seed') {
    return null;
  }

  const [cell] = shape.cells;

  return cell.kind === 'seed' ? cell : null;
}

function unsupportedBoundaryClassification(
  reason: string,
  details?: string[],
): ClosedShapeSurfaceBoundaryClassification {
  return {
    status: 'unsupported',
    strategyKind: 'topological-cell-face-incidence',
    reason,
    ...(details?.length ? { details } : {}),
  };
}

function formatUnsupportedBoundaryClassification(
  classification: Extract<ClosedShapeSurfaceBoundaryClassification, { status: 'unsupported' }>,
): string {
  const details = classification.details?.length
    ? ` Details: ${classification.details.join(' ')}`
    : '';

  return `${classification.reason}${details}`;
}

function validateClassifiableFace(shape: Shape, cell: Cell, face: Face): string | null {
  if (face.vertexIds.length < 3) {
    return `Face ${face.id} on active cell ${cell.id} has fewer than three vertices.`;
  }

  const uniqueFaceVertexIds = new Set(face.vertexIds);

  if (uniqueFaceVertexIds.size !== face.vertexIds.length) {
    return `Face ${face.id} on active cell ${cell.id} repeats a vertex id.`;
  }

  const cellVertexIds = new Set(cell.vertexIds);

  if (face.sourceCellId && face.sourceCellId !== cell.id) {
    return `Face ${face.id} sourceCellId ${face.sourceCellId} conflicts with active cell ${cell.id}.`;
  }

  for (const vertexId of face.vertexIds) {
    if (!shape.vertices[vertexId]) {
      return `Face ${face.id} on active cell ${cell.id} references missing vertex ${vertexId}.`;
    }

    if (!cellVertexIds.has(vertexId)) {
      return `Face ${face.id} references vertex ${vertexId} outside active cell ${cell.id}.`;
    }
  }

  return null;
}

function buildInactiveIncidenceByFaceKey(
  shape: Shape,
  activeCells: Cell[],
): Map<string, ClosedShapeFaceIncidence[]> {
  const activeCellIds = new Set(activeCells.map((cell) => cell.id));
  const faceById = new Map(shape.faces.map((face) => [face.id, face]));
  const incidenceByFaceKey = new Map<string, ClosedShapeFaceIncidence[]>();

  for (const cell of shape.cells) {
    if (activeCellIds.has(cell.id)) {
      continue;
    }

    for (const faceId of cell.faceIds) {
      const face = faceById.get(faceId);

      if (!face || !isFaceKeyComparable(shape, face)) {
        continue;
      }

      const faceKey = normalizedFaceVertexKey(face.vertexIds);
      const incidences = incidenceByFaceKey.get(faceKey) ?? [];

      incidences.push({
        cellId: cell.id,
        faceId: face.id,
        faceRole: face.role,
        vertexIds: [...face.vertexIds],
      });
      incidenceByFaceKey.set(faceKey, incidences);
    }
  }

  return incidenceByFaceKey;
}

function isFaceKeyComparable(shape: Shape, face: Face): boolean {
  return (
    face.vertexIds.length >= 3 &&
    new Set(face.vertexIds).size === face.vertexIds.length &&
    face.vertexIds.every((vertexId) => Boolean(shape.vertices[vertexId]))
  );
}

function normalizedFaceVertexKey(vertexIds: VertexId[]): string {
  return [...vertexIds].sort().join('\u001f');
}

function buildFaceSurfaceCharts(
  shape: Shape,
  face: Face,
  chartIdPrefix: string,
): FieldSurfaceSampleChart[] {
  const vertexIds = [...face.vertexIds];
  const positions = vertexIds.map((vertexId) => copyVec3(shape.vertices[vertexId].position));

  if (vertexIds.length === 3) {
    return [
      {
        kind: 'direct-triangle-face-chart',
        semanticRole: 'face-local',
        chartId: `${chartIdPrefix}:direct-triangle`,
        sourceFaceId: face.id,
        positions: [positions[0], positions[1], positions[2]],
        boundaryVertexIds: [vertexIds[0], vertexIds[1], vertexIds[2]],
        sourceVertexIds: [vertexIds[0], vertexIds[1], vertexIds[2]],
        support: {
          kind: 'source-face',
          faceId: face.id,
        },
      },
    ];
  }

  return buildCentroidFanComputationalCharts(
    face.id,
    vertexIds,
    positions,
    centroidVec3(positions),
    `${chartIdPrefix}:centroid-fan`,
  );
}

function buildCentroidFanComputationalCharts(
  faceId: FaceId,
  vertexIds: VertexId[],
  positions: Vec3[],
  centroid: Vec3,
  chartIdPrefix: string,
): ComputationalTriangleChart[] {
  return vertexIds.map((vertexId, index) => {
    const nextIndex = (index + 1) % vertexIds.length;
    const nextVertexId = vertexIds[nextIndex];

    return {
      kind: 'computational-triangle-chart',
      semanticRole: 'computational-only',
      chartId: `${chartIdPrefix}:${index}`,
      sourceFaceId: faceId,
      positions: [copyVec3(centroid), copyVec3(positions[index]), copyVec3(positions[nextIndex])],
      boundaryVertexIds: [vertexId, nextVertexId],
      sourceVertexIds: [vertexId, nextVertexId],
      computationalSupport: {
        kind: 'polygon-centroid',
        position: copyVec3(centroid),
      },
    };
  });
}

function pointFromPositionsBarycentric(
  positions: [Vec3, Vec3, Vec3],
  barycentric: [number, number, number],
): Vec3 {
  return [
    positions[0][0] * barycentric[0] +
      positions[1][0] * barycentric[1] +
      positions[2][0] * barycentric[2],
    positions[0][1] * barycentric[0] +
      positions[1][1] * barycentric[1] +
      positions[2][1] * barycentric[2],
    positions[0][2] * barycentric[0] +
      positions[1][2] * barycentric[1] +
      positions[2][2] * barycentric[2],
  ];
}

function uniqueVertexIds(vertexIds: VertexId[]): VertexId[] {
  return Array.from(new Set(vertexIds));
}

function centroidVec3(positions: Vec3[]): Vec3 {
  if (!positions.length) {
    return [0, 0, 0];
  }

  const sum = positions.reduce<Vec3>(
    (accumulator, position) => [
      accumulator[0] + position[0],
      accumulator[1] + position[1],
      accumulator[2] + position[2],
    ],
    [0, 0, 0],
  );

  return [sum[0] / positions.length, sum[1] / positions.length, sum[2] / positions.length];
}

function distanceVec3(a: Vec3, b: Vec3): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function copyVec3(position: Vec3): Vec3 {
  return [position[0], position[1], position[2]];
}

function makeSampleId(position: Vec3): string {
  return `field-sample:${position.map((coordinate) => coordinate.toFixed(6)).join(',')}`;
}
