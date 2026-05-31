import type { FaceId, Shape, Vec3, Vertex, VertexId } from '../types/geometry';

export interface ComplexValue {
  re: number;
  im: number;
}

export type FieldSourceDomainKind = 'triangle-reference' | 'shape-vertices-reference';

export interface TriangleSourceDomain {
  kind: 'triangle-reference';
  id: string;
  vertexIds: [VertexId, VertexId, VertexId];
  positions: [Vec3, Vec3, Vec3];
  faceId?: FaceId;
}

export interface ShapeVerticesSourceDomain {
  kind: 'shape-vertices-reference';
  id: string;
  vertexIds: VertexId[];
  positions: Vec3[];
}

export type FieldSourceDomain = TriangleSourceDomain | ShapeVerticesSourceDomain;

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
