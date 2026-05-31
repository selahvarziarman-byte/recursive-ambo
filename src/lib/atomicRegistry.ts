import type { EdgeId, Face, FaceId, Shape, Vertex, VertexId } from '../types/geometry';

export type AtomicRegistryUnsupportedReason =
  | 'vertex-not-found'
  | 'not-generated-midpoint'
  | 'missing-source-edge'
  | 'missing-parent-vertices'
  | 'missing-source-face-context'
  | 'non-triangular-context'
  | 'ambiguous-context'
  | 'unsupported-generation-law';

export type AtomicCandidateReadingKind = 'edge-mediation-with-face-local-projection';

export interface AtomicRegistrySourceEdgeRef {
  sourceEdgeId: EdgeId | null;
  vertexIds: [VertexId, VertexId];
}

export interface AtomicRegistryFaceContext {
  sourceFaceId: FaceId;
  sourceFaceVertexIds: [VertexId, VertexId, VertexId];
  generatedFaceId: FaceId;
  generatedFaceVertexIds: [VertexId, VertexId, VertexId];
  projectionSourceVertexId: VertexId;
  projectionSourceVertex: Vertex;
}

export interface AtomicRegistryCandidateReading {
  status: 'candidate';
  kind: AtomicCandidateReadingKind;
  sourceEdgeVertexIds: [VertexId, VertexId];
  projectionSourceVertexIds: VertexId[];
}

export interface AtomicRegistrySupportedReport {
  status: 'supported';
  target: {
    vertexId: VertexId;
    vertex: Vertex;
  };
  sourceEdge: AtomicRegistrySourceEdgeRef;
  parentVertices: [Vertex, Vertex];
  triangularFaceContexts: AtomicRegistryFaceContext[];
  candidateReadings: AtomicRegistryCandidateReading[];
}

export interface AtomicRegistryUnsupportedDetails {
  operation?: string;
  sourceEdgeId?: EdgeId;
  sourceVertexIds?: VertexId[];
  faceIds?: FaceId[];
}

export interface AtomicRegistryUnsupportedReport {
  status: 'unsupported';
  targetVertexId: VertexId;
  reason: AtomicRegistryUnsupportedReason;
  details?: AtomicRegistryUnsupportedDetails;
}

export type AtomicRegistryReport =
  | AtomicRegistrySupportedReport
  | AtomicRegistryUnsupportedReport;

type FaceContextRecovery =
  | {
      status: 'supported';
      contexts: AtomicRegistryFaceContext[];
    }
  | {
      status: 'unsupported';
      reason: AtomicRegistryUnsupportedReason;
      details?: AtomicRegistryUnsupportedDetails;
    };

export function buildAtomicRegistryReport(
  shape: Shape,
  vertexId: VertexId,
): AtomicRegistryReport {
  const target = shape.vertices[vertexId];

  if (!target) {
    return unsupported(vertexId, 'vertex-not-found');
  }

  if (!isGeneratedMidpointVertex(target)) {
    return unsupported(vertexId, 'not-generated-midpoint', {
      operation: target.createdBy.operation,
      sourceEdgeId: target.createdBy.sourceEdgeId,
      sourceVertexIds: target.createdBy.sourceVertexIds,
    });
  }

  if (target.createdBy.operation !== 'ambo-dissection') {
    return unsupported(vertexId, 'unsupported-generation-law', {
      operation: target.createdBy.operation,
      sourceEdgeId: target.createdBy.sourceEdgeId,
      sourceVertexIds: target.createdBy.sourceVertexIds,
    });
  }

  if (!target.createdBy.sourceEdgeId && target.createdBy.sourceVertexIds.length !== 2) {
    return unsupported(vertexId, 'missing-source-edge', {
      operation: target.createdBy.operation,
      sourceVertexIds: target.createdBy.sourceVertexIds,
    });
  }

  const sourceEdgeVertexIds = asVertexPair(target.createdBy.sourceVertexIds);

  if (!sourceEdgeVertexIds) {
    return unsupported(
      vertexId,
      target.createdBy.sourceVertexIds.length > 2 ? 'ambiguous-context' : 'missing-parent-vertices',
      {
        operation: target.createdBy.operation,
        sourceEdgeId: target.createdBy.sourceEdgeId,
        sourceVertexIds: target.createdBy.sourceVertexIds,
      },
    );
  }

  const parentVertices = sourceEdgeVertexIds.map((sourceVertexId) => shape.vertices[sourceVertexId]);

  if (!parentVertices[0] || !parentVertices[1]) {
    return unsupported(vertexId, 'missing-parent-vertices', {
      operation: target.createdBy.operation,
      sourceEdgeId: target.createdBy.sourceEdgeId,
      sourceVertexIds: target.createdBy.sourceVertexIds,
    });
  }

  const faceContextRecovery = recoverTriangularFaceContexts(shape, vertexId, sourceEdgeVertexIds);

  if (faceContextRecovery.status === 'unsupported') {
    return unsupported(vertexId, faceContextRecovery.reason, faceContextRecovery.details);
  }

  const projectionSourceVertexIds = Array.from(
    new Set(faceContextRecovery.contexts.map((context) => context.projectionSourceVertexId)),
  ).sort((a, b) => a.localeCompare(b));

  return {
    status: 'supported',
    target: {
      vertexId,
      vertex: target,
    },
    sourceEdge: {
      sourceEdgeId: target.createdBy.sourceEdgeId ?? null,
      vertexIds: sourceEdgeVertexIds,
    },
    parentVertices: [parentVertices[0], parentVertices[1]],
    triangularFaceContexts: faceContextRecovery.contexts,
    candidateReadings: [
      {
        status: 'candidate',
        kind: 'edge-mediation-with-face-local-projection',
        sourceEdgeVertexIds,
        projectionSourceVertexIds,
      },
    ],
  };
}

function recoverTriangularFaceContexts(
  shape: Shape,
  targetVertexId: VertexId,
  sourceEdgeVertexIds: [VertexId, VertexId],
): FaceContextRecovery {
  const generatedContextFaces = shape.faces
    .filter(
      (face) =>
        face.role === 'dissection-core-face' &&
        Boolean(face.sourceFaceId) &&
        face.vertexIds.includes(targetVertexId),
    )
    .sort(compareFaces);

  if (!generatedContextFaces.length) {
    return {
      status: 'unsupported',
      reason: 'missing-source-face-context',
    };
  }

  const contexts: AtomicRegistryFaceContext[] = [];
  const sourceFaceIds = new Set<FaceId>();
  let foundNonTriangularContext = false;
  let foundUnrelatedSourceFace = false;

  for (const generatedFace of generatedContextFaces) {
    const sourceFaceId = generatedFace.sourceFaceId;

    if (!sourceFaceId) {
      continue;
    }

    if (sourceFaceIds.has(sourceFaceId)) {
      return unsupportedContext('ambiguous-context', {
        faceIds: generatedContextFaces.map((face) => face.id),
      });
    }

    sourceFaceIds.add(sourceFaceId);

    const sourceFaceCandidates = findSourceFaceCandidates(shape, generatedFace, sourceFaceId);

    if (sourceFaceCandidates.length > 1) {
      return unsupportedContext('ambiguous-context', {
        faceIds: sourceFaceCandidates.map((face) => face.id),
      });
    }

    const sourceFace = sourceFaceCandidates[0];

    if (!sourceFace) {
      foundUnrelatedSourceFace = true;
      continue;
    }

    const generatedFaceVertexIds = asVertexTriple(generatedFace.vertexIds);
    const sourceFaceVertexIds = asVertexTriple(sourceFace.vertexIds);

    if (!generatedFaceVertexIds || !sourceFaceVertexIds) {
      foundNonTriangularContext = true;
      continue;
    }

    if (!containsSourceEdge(sourceFaceVertexIds, sourceEdgeVertexIds)) {
      foundUnrelatedSourceFace = true;
      continue;
    }

    const projectionSourceVertexIds = sourceFaceVertexIds.filter(
      (vertexId) => !sourceEdgeVertexIds.includes(vertexId),
    );

    if (projectionSourceVertexIds.length !== 1) {
      return unsupportedContext('ambiguous-context', {
        faceIds: [sourceFace.id],
      });
    }

    const projectionSourceVertexId = projectionSourceVertexIds[0];
    const projectionSourceVertex = shape.vertices[projectionSourceVertexId];

    if (!projectionSourceVertex) {
      foundUnrelatedSourceFace = true;
      continue;
    }

    contexts.push({
      sourceFaceId,
      sourceFaceVertexIds,
      generatedFaceId: generatedFace.id,
      generatedFaceVertexIds,
      projectionSourceVertexId,
      projectionSourceVertex,
    });
  }

  if (contexts.length) {
    return {
      status: 'supported',
      contexts,
    };
  }

  return {
    status: 'unsupported',
    reason: foundNonTriangularContext ? 'non-triangular-context' : 'missing-source-face-context',
    details: foundUnrelatedSourceFace
      ? {
          faceIds: generatedContextFaces.map((face) => face.id),
        }
      : undefined,
  };
}

function findSourceFaceCandidates(
  shape: Shape,
  generatedFace: Face,
  sourceFaceId: FaceId,
): Face[] {
  const scopedCandidates = findScopedSourceFaceCandidates(shape, generatedFace, sourceFaceId);

  if (scopedCandidates.length) {
    return scopedCandidates;
  }

  return shape.faces
    .filter(
      (face) =>
        face.id === sourceFaceId ||
        (face.role === 'parent-cell-face' && face.sourceFaceId === sourceFaceId),
    )
    .sort(compareFaces);
}

function findScopedSourceFaceCandidates(
  shape: Shape,
  generatedFace: Face,
  sourceFaceId: FaceId,
): Face[] {
  if (!generatedFace.sourceCellId) {
    return [];
  }

  const contextCell = shape.cells.find((cell) => cell.id === generatedFace.sourceCellId);
  const parentCell = contextCell?.parentCellId
    ? shape.cells.find((cell) => cell.id === contextCell.parentCellId)
    : null;

  if (!parentCell) {
    return [];
  }

  const faceById = new Map(shape.faces.map((face) => [face.id, face]));

  return parentCell.faceIds
    .map((faceId) => faceById.get(faceId))
    .filter((face): face is Face => {
      if (!face) {
        return false;
      }

      return face.id === sourceFaceId || face.sourceFaceId === sourceFaceId;
    })
    .sort(compareFaces);
}

function isGeneratedMidpointVertex(vertex: Vertex): boolean {
  return (
    vertex.createdBy.operation === 'ambo-dissection' &&
    (Boolean(vertex.createdBy.sourceEdgeId) ||
      vertex.data.lineage?.inheritanceMode === 'derived-from-edge')
  );
}

function containsSourceEdge(
  sourceFaceVertexIds: [VertexId, VertexId, VertexId],
  sourceEdgeVertexIds: [VertexId, VertexId],
): boolean {
  return sourceEdgeVertexIds.every((vertexId) => sourceFaceVertexIds.includes(vertexId));
}

function asVertexPair(vertexIds: VertexId[]): [VertexId, VertexId] | null {
  if (vertexIds.length !== 2) {
    return null;
  }

  return [vertexIds[0], vertexIds[1]];
}

function asVertexTriple(vertexIds: VertexId[]): [VertexId, VertexId, VertexId] | null {
  if (vertexIds.length !== 3 || new Set(vertexIds).size !== 3) {
    return null;
  }

  return [vertexIds[0], vertexIds[1], vertexIds[2]];
}

function compareFaces(a: Face, b: Face): number {
  return a.id.localeCompare(b.id);
}

function unsupported(
  targetVertexId: VertexId,
  reason: AtomicRegistryUnsupportedReason,
  details?: AtomicRegistryUnsupportedDetails,
): AtomicRegistryUnsupportedReport {
  return details
    ? {
        status: 'unsupported',
        targetVertexId,
        reason,
        details,
      }
    : {
        status: 'unsupported',
        targetVertexId,
        reason,
      };
}

function unsupportedContext(
  reason: AtomicRegistryUnsupportedReason,
  details?: AtomicRegistryUnsupportedDetails,
): FaceContextRecovery {
  return details
    ? {
        status: 'unsupported',
        reason,
        details,
      }
    : {
        status: 'unsupported',
        reason,
      };
}
