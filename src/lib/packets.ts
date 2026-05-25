import type {
  PacketHostKind,
  PacketInheritanceMode,
  PacketLineage,
  PacketSourceRef,
} from '../types/geometry';

type PacketLineageFields = { lineage?: PacketLineage };

export function packetSourceRef(
  kind: PacketHostKind,
  id: string,
  role?: string,
): PacketSourceRef {
  return role ? { kind, id, role } : { kind, id };
}

export function defaultPacket(lineage?: PacketLineage): PacketLineageFields {
  return {
    lineage: lineage ?? {
      inheritanceMode: 'default',
      sources: [],
    },
  };
}

export function preservePacket<T extends { lineage?: PacketLineage }>(
  packet: T,
  sourceRef: PacketSourceRef,
  operationId?: string,
): T {
  return {
    ...packet,
    lineage: makeLineage('preserved', [sourceRef], operationId),
  };
}

export function deriveCompositePacket(
  sources: PacketSourceRef[],
  operationId: string,
  mode: PacketInheritanceMode = 'composite',
): PacketLineageFields {
  return {
    lineage: makeLineage(mode, sources, operationId),
  };
}

export function deriveFaceLineage(
  sources: PacketSourceRef[],
  operationId: string,
  mode: PacketInheritanceMode = 'composite',
): PacketLineage {
  return makeLineage(mode, sources, operationId);
}

export function deriveCellLineage(
  sources: PacketSourceRef[],
  operationId: string,
  mode: PacketInheritanceMode = 'composite',
): PacketLineage {
  return makeLineage(mode, sources, operationId);
}

export function deriveFromSourceFace(
  sourceFaceId: string,
  operationId: string,
  role = 'source-face',
): PacketLineage {
  return deriveFaceLineage(
    [packetSourceRef('face', sourceFaceId, role)],
    operationId,
    'derived-from-face',
  );
}

export function deriveFromSourceVertex(
  sourceVertexId: string,
  operationId: string,
  role = 'source-vertex',
): PacketLineage {
  return deriveFaceLineage(
    [packetSourceRef('vertex', sourceVertexId, role)],
    operationId,
    'derived-from-vertex',
  );
}

export function deriveFromParentCell(
  parentCellId: string,
  operationId: string,
  role = 'parent-cell',
): PacketLineage {
  return deriveCellLineage(
    [packetSourceRef('cell', parentCellId, role)],
    operationId,
    'derived-from-cell',
  );
}

function makeLineage(
  inheritanceMode: PacketInheritanceMode,
  sources: PacketSourceRef[],
  operationId?: string,
): PacketLineage {
  const lineage: PacketLineage = {
    inheritanceMode,
    sources: sources.map((source) => ({ ...source })),
  };

  if (operationId) {
    lineage.operationId = operationId;
  }

  return lineage;
}
