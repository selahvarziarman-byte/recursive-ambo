import type {
  PacketHostKind,
  PacketInheritanceMode,
  PacketLineage,
  PacketSourceRef,
  VertexDataPacket,
} from '../types/geometry';

type PacketLineageFields = Pick<VertexDataPacket, 'lineage'>;

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
